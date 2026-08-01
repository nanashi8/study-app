import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore, todayIndex } from '../store/useStore.js'
import { buildDeck, SESSION_SIZE } from '../lib/session.js'
import { enemyLevel } from '../lib/adaptive.js'
import {
  battleRelicForLevel,
  battleSceneCue,
  battleTactic,
  encounterFor,
  heroProgress,
  relicBattleAbility,
  resolveBattleState,
} from '../lib/rpg.js'
import { pickDistractors, shuffle } from '../data/vocab.js'
import { quizMeaning } from '../data/compact.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { Button, ProgressBar, IconButton } from '../components/ui.jsx'
import { Close, Check, ArrowRight } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { buildVocabInstructorExplanation } from '../lib/instructorExplanations.js'
import {
  BATTLE_STAR_PER_CORRECT,
  battleThemeById,
} from '../lib/battleThemes.js'
import {
  battleRivalById,
  battleRivalForEncounter,
  battleStudentById,
  battleStudentPortrait,
  battleStudentState,
} from '../lib/battleCast.js'

// このクイズ画面の同一性キー（出題ソース・タイトル・問題数）。
// 退避したセッションが「今まさに戻ってきたクイズ」のものかを照合するのに使う。
const sessionKey = (p) =>
  `vocab|${JSON.stringify(p.source ?? { type: 'due' })}|${p.title ?? ''}|${p.size ?? ''}`

const restoredBattleLog = (results = {}) => {
  if (Array.isArray(results.battleLog)) return [...results.battleLog]
  const count = (value) => Math.max(0, Math.floor(Number(value) || 0))
  return [
    ...Array(count(results.correct)).fill('correct'),
    ...Array(count(results.wrong)).fill('wrong'),
    ...Array(count(results.unknown)).fill('unknown'),
  ]
}

export function VocabQuizScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const review = useStore((s) => s.review)
  const saveQuizSession = useStore((s) => s.saveQuizSession)
  const clearQuizSession = useStore((s) => s.clearQuizSession)
  const addBattleStars = useStore((s) => s.addBattleStars)
  const battleStars = useStore((s) => s.battleStars)
  const battleThemeId = useStore((s) => s.battleThemeId)
  const battleStudentId = useStore((s) => s.battleStudentId)

  // 語源を見て戻ってきたときだけ復元。退避セッションのキーが一致したら採用。
  const [restore] = useState(() => {
    const s = useStore.getState().quizSession
    return s && s.key === sessionKey(params) ? s : null
  })
  // 取り出したら退避は消費（古いセッションが残って誤復元しないよう必ずクリア）。
  useEffect(() => {
    clearQuizSession()
  }, [clearQuizSession])

  const xpAtStart = useRef(restore ? restore.xpAtStart : useStore.getState().stats.xp)
  const [deck] = useState(() =>
    restore
      ? restore.deck
      : buildDeck(params.source ?? { type: 'due' }, {
          srs: useStore.getState().srs,
          size:
            params.size ??
            (['level', 'battle', 'all', 'field', 'pos'].includes(params.source?.type)
              ? SESSION_SIZE
              : 20),
        }),
  )
  const [i, setI] = useState(() => (restore ? restore.i : 0))
  const [selected, setSelected] = useState(() => {
    // 旧版で使っていた "unknown" は実在する単語IDと衝突するため、新しい番兵値へ移行する。
    if (restore?.selected === 'unknown') return UNKNOWN_CHOICE_ID
    return restore ? restore.selected : null
  })
  const [itemUsedAt, setItemUsedAt] = useState(() =>
    Number.isSafeInteger(restore?.itemUsedAt) ? restore.itemUsedAt : null,
  )
  const results = useRef(
    restore
      ? {
          ...restore.results,
          wrongIds: [...(restore.results?.wrongIds ?? [])],
          battleLog: restoredBattleLog(restore.results),
        }
      : {
          correct: 0,
          wrong: 0,
          unknown: 0,
          wrongIds: [],
          battleLog: [],
        },
  )

  const word = deck[i]
  const isBattle = params.source?.type === 'battle'
  const battleTheme = isBattle
    ? battleThemeById(params.source?.themeId ?? battleThemeId, battleStars)
    : null
  const battleHeroLevel = isBattle
    ? params.source?.heroLevel
      ?? heroProgress(useStore.getState().stats.xp).level
    : 1
  const encounter = isBattle
    ? encounterFor({
        level: battleHeroLevel,
        day: params.source?.adventureDay ?? todayIndex(),
        enemyRankIndex: params.source?.levelIndex ?? 0,
      })
    : null
  const battleStudent = isBattle
    ? battleStudentById(params.source?.studentId ?? battleStudentId)
    : null
  const battleRival = isBattle
    ? battleRivalById(
        params.source?.rivalId
        ?? battleRivalForEncounter(
          encounter,
          params.source?.adventureDay ?? todayIndex(),
        ).id,
      )
    : null
  const tactic = isBattle ? battleTactic(params.source?.tacticId) : null
  const battleRelic = isBattle
    ? battleRelicForLevel(battleHeroLevel, params.source?.relicLevel)
    : null
  const battleItemAbility = isBattle ? relicBattleAbility(battleRelic) : null
  const battleState = isBattle
    ? resolveBattleState({
        answers: results.current.battleLog,
        total: deck.length,
        tacticId: tactic.id,
        heroLevel: battleHeroLevel,
        enemyRankIndex: params.source?.levelIndex ?? 0,
        isBoss: encounter.isBoss,
        relicLevel: battleRelic.level,
        itemUsedAt,
        themeId: battleTheme.id,
      })
    : null
  const enemyHp = battleState?.enemyHealthPercent ?? 100
  const heroHp = battleState?.heroHealthPercent ?? 100
  // 選択肢（正解＋誤答2つ）を問題ごとに固定
  const options = useMemo(() => {
    if (!word) return []
    // 詳細画面へ移動する直前の並びも復元し、選んだ誤答が消えないようにする。
    if (restore?.i === i && restore.options?.length) return restore.options
    return shuffle([word, ...pickDistractors(word, 2)])
  }, [word?.id, i, restore])

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる単語がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const answered = selected !== null

  const finish = () => {
    const xpGained = useStore.getState().stats.xp - xpAtStart.current
    navigate('sessionResult', {
      title: params.title ?? 'クイズ',
      mode: 'quiz',
      total: deck.length,
      correct: results.current.correct,
      wrong: results.current.wrong + results.current.unknown,
      xpGained,
      reviewIds: results.current.wrongIds,
      source: params.source,
      size: params.size,
      battleReport: isBattle ? battleState : null,
    })
  }

  const choose = (optId) => {
    if (answered) return
    setSelected(optId)
    let battleAnswer
    if (optId === UNKNOWN_CHOICE_ID) {
      review(word.id, 'unknown', 'vocab')
      results.current.unknown++
      results.current.wrongIds.push(word.id)
      battleAnswer = 'unknown'
    } else if (optId === word.id) {
      review(word.id, 'correct', 'vocab')
      results.current.correct++
      battleAnswer = 'correct'
      if (isBattle) addBattleStars(BATTLE_STAR_PER_CORRECT)
    } else {
      review(word.id, 'wrong', 'vocab')
      results.current.wrong++
      results.current.wrongIds.push(word.id)
      battleAnswer = 'wrong'
    }
    if (isBattle) {
      results.current.battleLog ??= []
      results.current.battleLog.push(battleAnswer)
    }
  }

  const next = () => {
    if (i + 1 >= deck.length) finish()
    else {
      setI(i + 1)
      setSelected(null)
    }
  }

  const useBattleItem = () => {
    if (
      !isBattle
      || !battleRelic
      || battleState.itemUsed
      || battleState.complete
      || (
        battleItemAbility.kind === 'heal'
        && battleState.heroCurrentHp >= battleState.heroMaxHp
      )
    ) return
    setItemUsedAt(battleState.answered)
  }

  const isCorrectPick = answered && selected === word.id
  const instructorExplanation = answered
    ? buildVocabInstructorExplanation(
        word,
        selected === UNKNOWN_CHOICE_ID
          ? UNKNOWN_CHOICE_ID
          : options.find((option) => option.id === selected),
      )
    : null
  const battleEvent = answered ? battleState?.lastEvent : null
  const themeBattleNote = battleEvent?.themeAbility
    ? `・${battleState.themeAbility.name}発動`
    : ''
  const enemyAttackLine = encounter?.attackLine
    ? `${battleRival?.name ?? '相手'}の「${encounter.move}」！`
    : `${battleRival?.name ?? encounter?.name ?? '相手'}の「${encounter?.move ?? '反撃'}」！`
  const battleFeedback = battleEvent?.kind === 'hit'
    ? `正解！ ✦+${BATTLE_STAR_PER_CORRECT}・${battleRival.name}に ${battleEvent.damage} ダメージ${themeBattleNote} 💮`
    : ['burst', 'counter', 'shield', 'item-power'].includes(battleEvent?.kind)
      ? `${battleEvent.title}（${battleEvent.damage}ダメージ）`
      : ['damage', 'unknown'].includes(battleEvent?.kind)
        ? battleEvent?.themeAbility
          ? `${battleEvent.title}（${battleEvent.damage}ダメージ）`
          : `${enemyAttackLine}（${battleEvent.damage}ダメージ）`
    : battleEvent?.title
      ?? (isCorrectPick
        ? `${encounter?.name ?? '相手'}に正解アタック！ 💮`
        : selected === UNKNOWN_CHOICE_ID
          ? '「わからない」を記録。次で立て直そう'
          : `${enemyAttackLine} 次の一問で取り返そう`)
  const positiveBattleFeedback =
    isCorrectPick || ['block', 'item-guard'].includes(battleEvent?.kind)
  const itemHealBlocked =
    battleItemAbility?.kind === 'heal'
    && battleState?.heroCurrentHp >= battleState?.heroMaxHp
  const canUseBattleItem =
    isBattle
    && battleRelic
    && !battleState.itemUsed
    && !battleState.complete
    && !itemHealBlocked
  const battleItemLabel = battleState?.itemUsed
    ? battleState.itemStatus
    : itemHealBlocked
      ? 'HP満タン'
      : battleRelic?.name
  const nextLabel = i + 1 >= deck.length
    ? isBattle
      ? '戦果を確認'
      : '結果を見る'
    : isBattle
      ? 'つぎへ'
      : '次へ'

  return (
    <div className={cx('flex h-full flex-col', isBattle && 'battle-quiz-screen')}>
      {/* 通常クイズの進捗。バトルはHUD内のターン表示へ一本化する。 */}
      {!isBattle && (
        <div className="border-b border-brand-100 bg-white/90 px-3 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <IconButton onClick={back} aria-label="やめる">
              <Close size={22} />
            </IconButton>
            <div className="flex-1">
              <ProgressBar value={i / deck.length} color="#0ea5e9" />
            </div>
            <SpeechSettingsButton compact />
            <span className="w-12 text-right text-sm font-extrabold text-ink/50">
              {i + 1}/{deck.length}
            </span>
          </div>
        </div>
      )}

      {isBattle && (
        <div className="border-b border-brand-100 bg-white/90 p-2 backdrop-blur">
          <BattleHud
            encounter={encounter}
            enemyRank={enemyLevel(params.source?.levelIndex ?? 0)}
            enemyHp={enemyHp}
            heroHp={heroHp}
            hit={answered && isCorrectPick}
            tactic={tactic}
            battleState={battleState}
            eventActive={answered}
            turns={results.current.battleLog}
            totalTurns={deck.length}
            battleStars={battleStars}
            battleTheme={battleTheme}
            battleStudent={battleStudent}
            battleRival={battleRival}
            onExit={back}
          />
        </div>
      )}

      <div
        className={cx(
          'flex-1 overflow-y-auto px-4 pb-4',
          isBattle && 'px-3 pb-2',
        )}
      >
        {/* 出題語 */}
        <div
          className={cx(
            'mt-2 flex flex-col items-center bg-white text-center shadow-card',
            isBattle ? 'pixel-battle-question rounded-2xl px-3 py-2.5' : 'rounded-[2rem] p-6',
          )}
        >
          {isBattle ? (
            <>
              <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
                <PosBadge pos={word.pos} />
                <div className="min-w-0">
                  <h2 className="break-words font-display text-[clamp(1.25rem,6.8vw,1.75rem)] font-extrabold leading-none tracking-tight text-ink">
                    {word.word}
                  </h2>
                  {word.phonetic && (
                    <p className="mt-1 text-[11px] font-bold leading-none text-ink/40">
                      {word.phonetic}
                    </p>
                  )}
                </div>
                <SpeakButton text={word.word} size="md" />
              </div>
              <p className="mt-1.5 text-[11px] font-extrabold text-ink/55">
                この単語の意味は？
              </p>
            </>
          ) : (
            <>
              <PosBadge pos={word.pos} className="self-start" />
              <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
                {word.word}
              </h2>
              {word.phonetic && (
                <p className="mt-1 text-sm font-bold text-ink/40">{word.phonetic}</p>
              )}
              <div className="mt-3">
                <SpeakButton text={word.word} size="md" />
              </div>
              <p className="mt-4 text-sm font-extrabold text-ink/55">
                この単語の意味は？
              </p>
            </>
          )}
        </div>

        {/* 選択肢 */}
        <div
          className={cx(
            isBattle ? 'mt-2 grid grid-cols-2 gap-2' : 'mt-4 space-y-2.5',
          )}
        >
          {options.map((o) => {
            const correct = o.id === word.id
            const chosen = selected === o.id
            let tone = 'idle'
            if (answered) {
              if (correct) tone = 'correct'
              else if (chosen) tone = 'wrong'
              else tone = 'dim'
            }
            return (
              <button
                key={o.id}
                disabled={answered}
                onClick={() => choose(o.id)}
                className={cx(
                  'flex w-full items-center gap-3 border-2 text-left font-bold transition-all',
                  isBattle
                    ? 'pixel-battle-choice min-h-12 rounded-xl px-3 py-2 text-sm leading-snug'
                    : 'rounded-2xl px-4 py-3.5',
                  tone === 'idle' && 'border-brand-100 bg-white text-ink active:bg-brand-50 active:scale-[0.99]',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-800',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className="flex-1">{quizMeaning(o)}</span>
                {tone === 'correct' && <Check size={20} className="text-emerald-600" />}
                {tone === 'wrong' && <Close size={18} className="text-rose-500" />}
              </button>
            )
          })}

          <UnknownChoiceButton
            selected={selected === UNKNOWN_CHOICE_ID}
            disabled={answered}
            onClick={() => choose(UNKNOWN_CHOICE_ID)}
            className={isBattle ? 'pixel-battle-choice min-h-12 py-2 leading-snug' : ''}
          />
        </div>

        {/* 答え合わせ後 */}
        {answered && (
          <div className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <p
              className={cx(
                'font-display text-lg font-extrabold',
                positiveBattleFeedback ? 'text-emerald-600' : 'text-rose-500',
              )}
            >
              {isBattle
                ? battleFeedback
                : isCorrectPick
                  ? '正解！🎉'
                  : selected === UNKNOWN_CHOICE_ID
                    ? '答えはこちら'
                    : 'ざんねん…'}
            </p>
            <p className="mt-1 font-bold text-ink">
              <span className="font-display">{word.word}</span> ＝ {word.meanings.join('・')}
            </p>
            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-brand-50/70 p-3">
              <SpeakButton text={word.example.en} size="sm" />
              <div className="min-w-0 text-left">
                <p className="text-sm font-bold leading-relaxed text-ink">{word.example.en}</p>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/55">{word.example.ja}</p>
              </div>
            </div>
            <InstructorExplanation
              explanation={instructorExplanation}
              className="mt-3"
            />
            <button
              onClick={() => {
                // 解答済みの状態を退避してから語源詳細へ。戻ると結果画面のまま復元。
                saveQuizSession({
                  key: sessionKey(params),
                  deck,
                  i,
                  selected,
                  options,
                  results: {
                    ...results.current,
                    wrongIds: [...results.current.wrongIds],
                    battleLog: [...(results.current.battleLog ?? [])],
                  },
                  xpAtStart: xpAtStart.current,
                  itemUsedAt,
                })
                navigate('wordDetail', { id: word.id })
              }}
              className="mt-2 inline-flex items-center gap-1 text-sm font-extrabold text-brand-600"
            >
              語源をくわしく見る <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      <div
        className={cx(
          'shrink-0 border-t border-brand-100 bg-white/90 backdrop-blur',
          isBattle
            ? 'p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]'
            : 'p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]',
        )}
      >
        {isBattle && battleRelic ? (
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-2">
            <button
              type="button"
              disabled={!canUseBattleItem}
              onClick={useBattleItem}
              aria-label={
                battleState.itemUsed
                  ? `${battleRelic.name}は使用済み。${battleState.itemStatus}`
                  : itemHealBlocked
                    ? `${battleRelic.name}はHPが満タンのため使用できません`
                    : `${battleRelic.name}を使う。${battleItemAbility.description}`
              }
              className={cx(
                'flex h-12 min-w-0 items-center justify-center gap-1.5 rounded-2xl border-2 px-2 text-[11px] font-extrabold transition-transform active:scale-[0.97]',
                canUseBattleItem
                  ? 'border-amber-300 bg-amber-50 text-amber-900'
                  : 'border-ink/10 bg-paper text-ink/35',
              )}
            >
              <span className="shrink-0 text-base">{battleRelic.emoji}</span>
              <span className="truncate" aria-live="polite">{battleItemLabel}</span>
            </button>
            <Button full size="md" disabled={!answered} onClick={next}>
              {nextLabel} <ArrowRight size={18} />
            </Button>
          </div>
        ) : (
          <Button full size="lg" disabled={!answered} onClick={next}>
            {nextLabel} <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </div>
  )
}

function BattleHud({
  encounter,
  enemyRank,
  enemyHp,
  heroHp,
  hit,
  tactic,
  battleState,
  eventActive,
  turns,
  totalTurns,
  battleStars,
  battleTheme,
  battleStudent,
  battleRival,
  onExit,
}) {
  const eventKind = eventActive ? battleState.lastEvent?.kind : null
  const cue = battleSceneCue(eventKind)
  const skillFlash = [
    'burst',
    'shield',
    'block',
    'counter',
    'item-power',
    'item-guard',
  ].includes(eventKind)
  const guardActive = ['shield', 'block', 'item-guard'].includes(eventKind)
  const heroAttacking =
    eventActive && cue.actor === 'hero' && cue.target === 'enemy'
  const enemyAttacking =
    eventActive && cue.actor === 'enemy' && cue.target === 'hero'
  const heroDamaged = eventActive && cue.target === 'hero' && !guardActive
  const enemyDamaged = eventActive && cue.target === 'enemy'
  const safeTurns = Array.isArray(turns) ? turns : []
  const currentTurn = Math.min(
    totalTurns,
    battleState.answered + (eventActive ? 0 : 1),
  )
  const eventDamage = battleState.lastEvent?.damage ?? 0
  const eventHealing = battleState.lastEvent?.healing ?? 0
  const themeTriggered = eventActive && battleState.lastEvent?.themeAbility
  const studentState = battleStudentState({ battleState, eventActive })
  const studentPortrait = battleStudentPortrait(battleStudent.id, studentState)
  const sceneIndex = Math.max(
    0,
    battleState.answered - (eventActive ? 1 : 0),
  ) % battleTheme.scenes.length
  const scene = battleTheme.scenes[sceneIndex]
  const actionEmoji = themeTriggered
    ? battleState.themeAbility.emoji
    : enemyAttacking
      ? encounter.attackEmoji ?? cue.emoji
      : cue.emoji
  const actionTitle = themeTriggered
    ? battleState.lastEvent.title
    : enemyAttacking
      ? `${battleRival.name}の「${encounter.move}」！`
      : cue.title
  const signalTitle = themeTriggered
    ? battleState.themeAbility.name
    : enemyAttacking ? encounter.move : cue.title
  const damageLabel = !eventActive
    ? null
    : ['block', 'item-guard'].includes(eventKind)
      ? '0 DAMAGE'
      : eventKind === 'shield'
        ? `-${eventDamage} · GUARD +1`
        : cue.target === 'enemy'
          ? `-${eventDamage} HP${eventHealing ? ` · +${eventHealing} HP` : ''}`
          : `-${eventDamage} HP`

  return (
    <div
      className="school-battle-hud pixel-battle-hud relative rounded-[1.4rem] border p-2 text-ink shadow-card"
      style={{
        '--battle-accent': battleTheme.accent,
        '--battle-accent-strong': battleTheme.accentStrong,
        '--battle-accent-soft': battleTheme.accentSoft,
        '--battle-enemy': battleTheme.enemy,
        '--battle-surface': battleTheme.surface,
      }}
    >
      <button
        type="button"
        onClick={onExit}
        aria-label="バトルをやめる"
        className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-violet-100 bg-violet-50 text-violet-500 transition-colors active:bg-violet-100"
      >
        <Close size={15} />
      </button>
      <SpeechSettingsButton
        compact
        className="absolute right-10 top-2 z-10 !h-7 !w-7"
      />

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 pr-16">
        <div className="flex min-w-0 items-center gap-1.5">
          <PixelBattlePortrait
            key={`hud-${battleStudent.id}-${studentState}`}
            src={studentPortrait}
            className="h-9 w-9"
            tone="hero"
            label={`${battleStudent.name}・${studentState}`}
          />
          <div className="min-w-0 flex-1">
            <div
              className={cx(
                'flex items-center justify-between gap-1 text-[9px] font-extrabold',
                heroHp <= 34 ? 'text-rose-500' : 'text-emerald-600',
              )}
            >
              <span className="truncate">{battleStudent.name}</span>
              <span>
                {battleState.heroCurrentHp}/{battleState.heroMaxHp}
              </span>
            </div>
            <ProgressBar
              value={heroHp / 100}
              color="#34d399"
              className="mt-1 h-1.5 bg-slate-100"
            />
            <p className="mt-1 truncate text-[8px] font-bold text-ink/40">
              ⚔{battleState.heroStats.attack} · 🛡{battleState.heroStats.defense}
            </p>
          </div>
        </div>

        <div className="pixel-battle-turn rounded-xl px-2 py-1 text-center">
          <span className="block text-[7px] font-black tracking-wider text-violet-400">
            TURN
          </span>
          <span className="block text-[11px] font-black text-violet-700">
            {currentTurn}/{totalTurns}
          </span>
          <span className="mt-0.5 block whitespace-nowrap text-[7px] font-black text-amber-600">
            ✦ {battleStars.toLocaleString()}
          </span>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1 text-[9px] font-extrabold text-rose-500">
              <span className="truncate">{battleRival.name}</span>
              <span>
                {battleState.enemyCurrentHp}/{battleState.enemyMaxHp}
              </span>
            </div>
            <ProgressBar
              value={enemyHp / 100}
              color={battleTheme.enemy}
              className="mt-1 h-1.5 bg-slate-100"
            />
            <p className="mt-1 truncate text-right text-[8px] font-bold text-ink/40">
              {encounter.elementEmoji} {battleRival.title} · 英検{enemyRank.label}
            </p>
          </div>
          <PixelBattlePortrait
            src={battleRival.portrait}
            className="h-9 w-9"
            tone="enemy"
            label={battleRival.name}
          />
        </div>
      </div>

      <div
        key={`scene-${battleState.answered}-${eventKind ?? 'ready'}`}
        className={cx(
          'mob-battle-stage battle-status-stage mt-1.5 rounded-xl',
          'school-battle-stage pixel-battle-stage',
          skillFlash && 'battle-stage-skill',
        )}
        style={{
          '--battle-scene': `${scene.overlay}, linear-gradient(90deg,rgba(15,23,42,.18),rgba(15,23,42,.02),rgba(15,23,42,.26)), url("${battleTheme.stage}") ${scene.position} / cover`,
        }}
        role="img"
        aria-label={`戦闘状況。${battleStudent.name}は${battleState.heroCurrentHp}/${battleState.heroMaxHp}HP、${battleRival.name}は${battleState.enemyCurrentHp}/${battleState.enemyMaxHp}HP。${cue.title}`}
      >
        <span className="battle-scene-label" aria-hidden="true">
          {battleTheme.emoji} {scene.name}
        </span>
        <span className="battle-theme-particles" aria-hidden="true">
          {battleTheme.particles.map((particle, index) => (
            <i
              key={`${particle}-${index}`}
              style={{
                '--particle-index': index,
                '--particle-left': `${8 + ((index * 17) % 82)}%`,
                '--particle-size': `${8 + index}px`,
                '--particle-delay': `${index * -0.55}s`,
              }}
            >
              {particle}
            </i>
          ))}
        </span>
        {themeTriggered && (
          <span className="battle-ability-cut-in" aria-hidden="true">
            <i
              className="battle-ability-actor"
              style={{ backgroundImage: `url("${battleTheme.actorsSheet}")` }}
            />
            <b>{battleState.themeAbility.emoji} {battleState.themeAbility.name}</b>
          </span>
        )}
        <div
          className={cx(
            'battle-stage-unit battle-stage-hero',
            heroAttacking && 'battle-unit-lunge-right',
            heroDamaged && 'battle-unit-damaged',
            guardActive && 'battle-unit-guard',
          )}
        >
          <PixelBattlePortrait
            key={`stage-${battleStudent.id}-${studentState}`}
            src={studentPortrait}
            className="h-14 w-14"
            tone="hero"
            label={`${battleStudent.name}・${studentState}`}
          />
          <span>{battleStudent.name}</span>
        </div>

        <div
          className={cx(
            'battle-action-signal',
            cue.target === 'enemy' && 'battle-action-to-enemy',
            cue.target === 'hero' && !guardActive && 'battle-action-to-hero',
            guardActive && 'battle-action-guard',
          )}
          aria-hidden="true"
        >
          <span>{actionEmoji}</span>
          <strong>{cue.label}</strong>
          <small>{signalTitle}</small>
          {damageLabel && <b>{damageLabel}</b>}
        </div>

        <div
          className={cx(
            'battle-stage-unit battle-stage-enemy',
            enemyAttacking && 'battle-unit-lunge-left',
            enemyDamaged && 'battle-unit-damaged',
          )}
        >
          <PixelBattlePortrait
            src={battleRival.portrait}
            className={cx('h-14 w-14', hit && 'pixel-battle-portrait-hit')}
            tone="enemy"
            label={battleRival.name}
          />
          <span>{battleRival.name}</span>
        </div>
      </div>

      <div
        className="mt-1.5 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${totalTurns}, minmax(0, 1fr))` }}
        role="img"
        aria-label={`${totalTurns}ターン中${battleState.answered}ターン終了。正解${battleState.correct}、ミス${battleState.misses}`}
      >
        {Array.from({ length: totalTurns }, (_, index) => {
          const result = safeTurns[index]
          const current = !eventActive && index === battleState.answered
          return (
            <span
              key={index}
              className={cx(
                'battle-turn-mark',
                result === 'correct' && 'battle-turn-correct',
                result === 'wrong' && 'battle-turn-wrong',
                result === 'unknown' && 'battle-turn-unknown',
                current && 'battle-turn-current',
              )}
              aria-hidden="true"
            >
              {result === 'correct'
                ? '✓'
                : result === 'wrong'
                  ? '×'
                  : result === 'unknown'
                    ? '?'
                    : index + 1}
            </span>
          )
        })}
      </div>

      <div
        key={`status-${battleState.answered}-${eventActive ? 'answer' : 'ready'}`}
        className={cx(
          'pixel-battle-status mt-1.5 flex min-h-8 items-center gap-2 rounded-xl px-2.5 py-1.5 text-[9px] font-extrabold',
          skillFlash && 'battle-skill-flash bg-amber-100 text-amber-900',
        )}
        aria-live="polite"
      >
        <span className="shrink-0 text-sm">
          {eventActive ? actionEmoji : encounter.attackEmoji ?? encounter.elementEmoji}
        </span>
        <span className="min-w-0 flex-1 truncate">
          {eventActive
            ? actionTitle
            : `つぎの攻撃：${encounter.attackLine ?? encounter.move}`}
        </span>
        <span
          className="max-w-[46%] shrink-0 truncate rounded-full bg-white/70 px-2 py-1 text-[8px] text-violet-700"
          title={`${battleState.themeSummary}・${battleState.summary}`}
        >
          {battleState.themeAbility.emoji}{battleState.themeActivations} · {tactic.emoji} {battleState.status}
        </span>
      </div>
    </div>
  )
}

function PixelBattlePortrait({ src, className, tone = 'hero', label = '' }) {
  return (
    <div
      className={cx(
        'pixel-battle-portrait shrink-0 overflow-hidden rounded-xl',
        tone === 'enemy' ? 'pixel-battle-portrait-enemy' : 'pixel-battle-portrait-hero',
        className,
      )}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : 'true'}
    >
      <img src={src} alt="" className="h-full w-full object-cover" />
    </div>
  )
}
