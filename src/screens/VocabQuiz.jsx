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
  battleStudentMotion,
  battleStudentPortrait,
  battleStudentState,
} from '../lib/battleCast.js'
import {
  battleStudentTraitProfile,
  battleTraitById,
} from '../lib/battleTraits.js'
import { battleManaPresentation } from '../lib/battleMana.js'
import { publicAssetUrl } from '../lib/publicAssetUrl.js'

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
  const battleTraitInvestments = useStore((s) => s.battleTraitInvestments)

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
  // 学習評価や再現可能な戦闘計算には混ぜない、短時間の表示専用イベント。
  // 即時回復アイテムのように lastEvent を置き換えない操作だけをここで補う。
  const [battleVisualEvent, setBattleVisualEvent] = useState(null)
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
  const studentTraitProfile = isBattle
    ? battleStudentTraitProfile(
        battleStudent.id,
        battleTraitInvestments,
        battleStars,
      )
    : null
  const battleTrait = isBattle
    ? battleTraitById(
        params.source?.traitId
        ?? studentTraitProfile.dominant.id,
      )
    : null
  const battleSecondaryTrait = isBattle
    ? battleTraitById(
        studentTraitProfile.dominant.id === battleTrait.id
          ? studentTraitProfile.secondary.id
          : studentTraitProfile.dominant.id,
      )
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
    if (isBattle) setBattleVisualEvent(null)
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
      setBattleVisualEvent(null)
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
    if (battleItemAbility.kind === 'heal') {
      setBattleVisualEvent({
        kind: 'item-heal',
        emoji: battleRelic.emoji,
        title: battleRelic.name,
      })
    }
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
            battleTrait={battleTrait}
            battleSecondaryTrait={battleSecondaryTrait}
            battleRival={battleRival}
            visualEvent={battleVisualEvent}
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
  battleTrait,
  battleSecondaryTrait,
  battleRival,
  visualEvent,
  onExit,
}) {
  const eventKind = visualEvent?.kind
    ?? (eventActive ? battleState.lastEvent?.kind : null)
  const presentationActive = eventActive || Boolean(visualEvent)
  const cue = battleSceneCue(eventKind)
  const skillFlash = [
    'burst',
    'shield',
    'block',
    'counter',
    'item-power',
    'item-guard',
    'item-heal',
  ].includes(eventKind)
  const guardActive = ['shield', 'block', 'item-guard'].includes(eventKind)
  const healingActive = eventKind === 'item-heal'
  const heroAttacking =
    presentationActive && cue.actor === 'hero' && cue.target === 'enemy'
  const enemyAttacking =
    presentationActive && cue.actor === 'enemy' && cue.target === 'hero'
  const heroDamaged =
    presentationActive && cue.target === 'hero' && !guardActive && !healingActive
  const enemyDamaged = presentationActive && cue.target === 'enemy'
  const safeTurns = Array.isArray(turns) ? turns : []
  const currentTurn = Math.min(
    totalTurns,
    battleState.answered + (eventActive ? 0 : 1),
  )
  const eventDamage = visualEvent ? 0 : battleState.lastEvent?.damage ?? 0
  const eventHealing = healingActive
    ? battleState.itemHealing
    : battleState.lastEvent?.healing ?? 0
  const manaPresentation = battleManaPresentation({
    traitId: battleTrait.id,
    secondaryTraitId: battleSecondaryTrait.id,
    eventActive: presentationActive,
    eventKind,
    enemyDefeated: battleState.enemyDefeated,
    heroDefeated: battleState.heroDefeated,
    healing: eventHealing,
    themeAbility: visualEvent ? null : battleState.lastEvent?.themeAbility,
  })
  const themeTriggered =
    !visualEvent && eventActive && battleState.lastEvent?.themeAbility
  const studentState = battleStudentState({
    battleState,
    eventActive: presentationActive,
    eventKind,
  })
  const studentPortrait = battleStudentPortrait(battleStudent.id, studentState)
  const studentMotion = presentationActive
    ? battleStudentMotion(battleStudent.id, studentState)
    : null
  const sceneIndex = Math.max(
    0,
    battleState.answered - (eventActive ? 1 : 0),
  ) % battleTheme.scenes.length
  const scene = battleTheme.scenes[sceneIndex]
  const battleStageUrl = publicAssetUrl(battleTheme.stage)
  const actionEmoji = themeTriggered
    ? battleState.themeAbility.emoji
    : visualEvent?.emoji
      ? visualEvent.emoji
      : enemyAttacking
        ? encounter.attackEmoji ?? cue.emoji
        : cue.emoji
  const actionTitle = themeTriggered
    ? battleState.lastEvent.title
    : visualEvent?.title
      ? `${visualEvent.title}！`
      : enemyAttacking
        ? `${battleRival.name}の「${encounter.move}」！`
        : cue.title
  const signalTitle = themeTriggered
    ? battleState.themeAbility.name
    : visualEvent?.title
      ? visualEvent.title
      : enemyAttacking ? encounter.move : cue.title
  const damageLabel = !presentationActive
    ? null
    : healingActive
      ? `+${eventHealing} HP`
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
        '--battle-hero': battleTrait.color,
        '--battle-mana-primary': battleTrait.color,
        '--battle-mana-secondary': battleSecondaryTrait.color,
        '--battle-character-accent': battleStudent.accent,
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
              <span className="truncate">
                <i
                  className="mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle"
                  style={{ backgroundColor: battleTrait.color }}
                  aria-hidden="true"
                />
                {battleStudent.name}
              </span>
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
          '--battle-scene': `${scene.overlay}, linear-gradient(90deg,rgba(15,23,42,.18),rgba(15,23,42,.02),rgba(15,23,42,.26)), url("${battleStageUrl}") ${scene.position} / cover`,
        }}
        role="img"
        aria-label={`戦闘状況。${battleStudent.name}は${battleState.heroCurrentHp}/${battleState.heroMaxHp}HP、${battleRival.name}は${battleState.enemyCurrentHp}/${battleState.enemyMaxHp}HP。${cue.title}。${manaPresentation.ariaLabel}`}
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
        <BattleManaAnimation presentation={manaPresentation} />
        {themeTriggered && (
          <span className="battle-ability-cut-in" aria-hidden="true">
            <i
              className="battle-ability-actor"
              style={{ backgroundImage: `url("${publicAssetUrl(battleTheme.actorsSheet)}")` }}
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
            motionSrc={studentMotion}
            className="h-14 w-14"
            tone="hero"
            label={`${battleStudent.name}・${studentState}`}
          />
          <span>{battleTrait.emoji} {battleStudent.name}</span>
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
        key={`status-${battleState.answered}-${presentationActive ? eventKind : 'ready'}`}
        className={cx(
          'pixel-battle-status mt-1.5 flex min-h-8 items-center gap-2 rounded-xl px-2.5 py-1.5 text-[9px] font-extrabold',
          skillFlash && 'battle-skill-flash bg-amber-100 text-amber-900',
        )}
        aria-live="polite"
      >
        <span className="shrink-0 text-sm">
          {presentationActive ? actionEmoji : encounter.attackEmoji ?? encounter.elementEmoji}
        </span>
        <span className="min-w-0 flex-1 truncate">
          {presentationActive
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

function BattleManaAnimation({ presentation }) {
  const { affinity, sequence } = presentation

  return (
    <span
      className={`battle-mana-layer battle-mana-${sequence.id} battle-mana-affinity-${affinity.style}`}
      data-mana-affinity={affinity.id}
      data-mana-sequence={sequence.id}
      aria-hidden="true"
    >
      <span className="battle-mana-label">
        <i>{affinity.glyph}</i> {presentation.label}
      </span>

      <svg
        className="battle-mana-geometry"
        viewBox="0 0 320 96"
        preserveAspectRatio="none"
        focusable="false"
      >
        <g className="battle-mana-focus-geometry">
          <circle className="battle-mana-ring battle-mana-ring-outer" cx="54" cy="55" r="27" />
          <polygon
            className="battle-mana-ring battle-mana-ring-inner"
            points="54,31 75,43 75,67 54,79 33,67 33,43"
          />
          <circle className="battle-mana-ring battle-mana-ring-core" cx="54" cy="55" r="10" />
        </g>

        <path
          className="battle-mana-route battle-mana-route-forward"
          pathLength="1"
          d="M70 52 C108 17 176 77 250 50 C266 44 272 45 281 49"
        />
        <path
          className="battle-mana-route battle-mana-route-reverse"
          pathLength="1"
          d="M278 49 C235 15 176 78 91 51 C79 47 70 47 61 52"
        />

        <g className="battle-mana-ward-geometry">
          <path className="battle-mana-ward-line battle-mana-ward-line-outer" pathLength="1" d="M17 82 Q54 3 91 82" />
          <path className="battle-mana-ward-line battle-mana-ward-line-inner" pathLength="1" d="M25 81 Q54 19 83 81" />
          <path className="battle-mana-ward-line battle-mana-ward-cross" pathLength="1" d="M27 48 L81 48 M22 63 L86 63" />
        </g>

        <g className="battle-mana-restore-geometry">
          <path className="battle-mana-restore-line" pathLength="1" d="M54 85 C19 72 85 58 48 45 C21 35 77 22 55 10" />
          <path className="battle-mana-restore-line battle-mana-restore-line-alt" pathLength="1" d="M45 82 C83 69 27 55 64 42 C86 34 38 21 56 12" />
        </g>

        <g className="battle-mana-break-geometry">
          <path className="battle-mana-break-line" pathLength="1" d="M84 27 L61 48 L78 56 L46 81" />
          <path className="battle-mana-break-line battle-mana-break-line-alt" pathLength="1" d="M25 32 L47 50 L31 61 L58 81" />
        </g>

        <g className="battle-mana-triumph-geometry">
          <path className="battle-mana-triumph-arc" pathLength="1" d="M28 65 Q160 -5 292 65" />
          <path className="battle-mana-triumph-arc battle-mana-triumph-arc-alt" pathLength="1" d="M43 76 Q160 19 277 76" />
        </g>
      </svg>

      <span className="battle-mana-glyph">{affinity.glyph}</span>
      <span className="battle-mana-bolt"><i>{affinity.glyph}</i></span>
      <span className="battle-mana-impact">
        <i />
        <i />
        <i />
      </span>
      <span className="battle-mana-motes">
        {Array.from({ length: 8 }, (_, index) => (
          <i
            key={index}
            style={{
              '--mana-mote-index': index,
              '--mana-mote-delay': `${index * -0.11}s`,
              '--mana-mote-left': `${20 + ((index * 13) % 62)}%`,
            }}
          >
            {index % 2 === 0 ? affinity.glyph : '•'}
          </i>
        ))}
      </span>
      <span className="battle-mana-phase-track">
        {sequence.phases.map((phase, index) => (
          <i key={phase} title={phase} style={{ '--mana-phase-index': index }} />
        ))}
      </span>
    </span>
  )
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(media.matches)
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  return prefersReducedMotion
}

function PixelBattlePortrait({
  src,
  motionSrc = null,
  className,
  tone = 'hero',
  label = '',
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [motionFailed, setMotionFailed] = useState(false)
  const showMotion = motionSrc && !prefersReducedMotion && !motionFailed
  const resolvedSrc = publicAssetUrl(src)
  const resolvedMotionSrc = publicAssetUrl(motionSrc)

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
      {showMotion ? (
        <video
          src={resolvedMotionSrc}
          poster={resolvedSrc}
          className="battle-motion-video h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          onError={() => setMotionFailed(true)}
        />
      ) : (
        <img src={resolvedSrc} alt="" className="h-full w-full object-cover" />
      )}
    </div>
  )
}
