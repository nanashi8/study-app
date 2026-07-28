import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore, todayIndex } from '../store/useStore.js'
import { buildDeck, SESSION_SIZE } from '../lib/session.js'
import { enemyLevel } from '../lib/adaptive.js'
import {
  battleSceneCue,
  battleTactic,
  encounterFor,
  heroProgress,
  resolveBattleState,
  titleForLevel,
} from '../lib/rpg.js'
import { pickDistractors, shuffle } from '../data/vocab.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { MobPortrait } from '../components/MobPortrait.jsx'
import { HeroPortrait } from '../components/HeroPortrait.jsx'
import { Button, ProgressBar, IconButton } from '../components/ui.jsx'
import { Close, Check, ArrowRight } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'

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
  const battleHeroLevel = isBattle
    ? params.source?.heroLevel
      ?? heroProgress(useStore.getState().stats.xp).level
    : 1
  const battleHeroTitle = isBattle ? titleForLevel(battleHeroLevel) : null
  const encounter = isBattle
    ? encounterFor({
        level: battleHeroLevel,
        day: params.source?.adventureDay ?? todayIndex(),
        enemyRankIndex: params.source?.levelIndex ?? 0,
      })
    : null
  const tactic = isBattle ? battleTactic(params.source?.tacticId) : null
  const battleState = isBattle
    ? resolveBattleState({
        answers: results.current.battleLog,
        total: deck.length,
        tacticId: tactic.id,
        heroLevel: battleHeroLevel,
        enemyRankIndex: params.source?.levelIndex ?? 0,
        isBoss: encounter.isBoss,
      })
    : null
  const battleAnswered = battleState?.answered ?? 0
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
      reviewIds: results.current.wrongIds.length ? results.current.wrongIds : deck.map((w) => w.id),
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

  const isCorrectPick = answered && selected === word.id
  const battleEvent = answered ? battleState?.lastEvent : null
  const battleFeedback = battleEvent?.kind === 'hit'
    ? `${encounter.name}に ${battleEvent.damage} ダメージ！ ⚔️`
    : ['burst', 'counter', 'shield'].includes(battleEvent?.kind)
      ? `${battleEvent.title}（${battleEvent.damage}ダメージ）`
      : ['damage', 'unknown'].includes(battleEvent?.kind)
        ? `${battleEvent.title}（${battleEvent.damage}ダメージ）`
    : battleEvent?.title
      ?? (isCorrectPick
        ? `${encounter?.name ?? '敵'}に一撃！ ⚔️`
        : selected === UNKNOWN_CHOICE_ID
          ? '「わからない」を記録。次で立て直そう'
          : '反撃を受けた…次の一手へ')
  const positiveBattleFeedback = isCorrectPick || battleEvent?.kind === 'block'

  return (
    <div className="flex h-full flex-col">
      {/* 進捗 */}
      <div className="border-b border-brand-100 bg-white/90 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={back} aria-label="やめる">
            <Close size={22} />
          </IconButton>
          <div className="flex-1">
            <ProgressBar
              value={isBattle ? battleAnswered / deck.length : i / deck.length}
              color={isBattle ? '#f43f5e' : '#0ea5e9'}
            />
          </div>
          <span className="w-12 text-right text-sm font-extrabold text-ink/50">
            {i + 1}/{deck.length}
          </span>
        </div>
        {isBattle && (
          <BattleHud
            encounter={encounter}
            enemyRank={enemyLevel(params.source?.levelIndex ?? 0)}
            enemyHp={enemyHp}
            heroHp={heroHp}
            hit={answered && isCorrectPick}
            tactic={tactic}
            battleState={battleState}
            eventActive={answered}
            heroLevel={battleHeroLevel}
            heroTitle={battleHeroTitle}
            turns={results.current.battleLog}
            totalTurns={deck.length}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* 出題語 */}
        <div className="mt-2 flex flex-col items-center rounded-[2rem] bg-white p-6 text-center shadow-card">
          <PosBadge pos={word.pos} className="self-start" />
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">{word.word}</h2>
          {word.phonetic && <p className="mt-1 text-sm font-bold text-ink/40">{word.phonetic}</p>}
          <div className="mt-3">
            <SpeakButton text={word.word} size="md" />
          </div>
          <p className="mt-4 text-sm font-extrabold text-ink/55">この単語の意味は？</p>
        </div>

        {/* 選択肢 */}
        <div className="mt-4 space-y-2.5">
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
                  'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-bold transition-all',
                  tone === 'idle' && 'border-brand-100 bg-white text-ink active:bg-brand-50 active:scale-[0.99]',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-800',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className="flex-1">{o.meanings?.[0] ?? o.meaning}</span>
                {tone === 'correct' && <Check size={20} className="text-emerald-600" />}
                {tone === 'wrong' && <Close size={18} className="text-rose-500" />}
              </button>
            )
          })}

          <UnknownChoiceButton
            selected={selected === UNKNOWN_CHOICE_ID}
            disabled={answered}
            onClick={() => choose(UNKNOWN_CHOICE_ID)}
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

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {i + 1 >= deck.length
            ? isBattle
              ? '戦果を確認'
              : '結果を見る'
            : isBattle
              ? '次の一手'
              : '次へ'}{' '}
          <ArrowRight size={18} />
        </Button>
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
  heroLevel,
  heroTitle,
  turns,
  totalTurns,
}) {
  const eventKind = eventActive ? battleState.lastEvent?.kind : null
  const cue = battleSceneCue(eventKind)
  const skillFlash = ['burst', 'shield', 'block', 'counter'].includes(eventKind)
  const guardActive = ['shield', 'block'].includes(eventKind)
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
  const damageLabel = !eventActive
    ? null
    : eventKind === 'block'
      ? '0 DAMAGE'
      : eventKind === 'shield'
        ? `-${eventDamage} · SHIELD +1`
        : cue.target === 'enemy'
          ? `-${eventDamage} DAMAGE${eventHealing ? ` · +${eventHealing} HP` : ''}`
          : `-${eventDamage} DAMAGE`

  return (
    <div className="mt-2 rounded-2xl bg-slate-950 p-2.5 text-white shadow-inner">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <HeroPortrait
            level={heroLevel}
            title={heroTitle}
            decorative
            showLevel={false}
            guarding={guardActive}
            className="h-8 w-8"
          />
          <div className="min-w-0 flex-1">
            <div
              className={cx(
                'flex items-center justify-between gap-1 text-[8px] font-extrabold',
                heroHp <= 34 ? 'text-rose-300' : 'text-emerald-300',
              )}
            >
              <span>YOU</span>
              <span>
                {battleState.heroCurrentHp}/{battleState.heroMaxHp}
              </span>
            </div>
            <ProgressBar
              value={heroHp / 100}
              color="#34d399"
              className="mt-1 h-1.5 bg-white/15"
            />
            <p className="mt-1 truncate text-[8px] font-bold text-white/55">
              ⚔{battleState.heroStats.attack} · 🛡{battleState.heroStats.defense}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/10 px-1.5 py-1 text-center">
          <span className="block text-[7px] font-black tracking-wider text-white/40">
            TURN
          </span>
          <span className="block text-[10px] font-black text-amber-300">
            {currentTurn}/{totalTurns}
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-1 text-[9px] font-extrabold text-rose-300">
            <span className="truncate">{encounter.name}</span>
            <span>
              {battleState.enemyCurrentHp}/{battleState.enemyMaxHp}
            </span>
          </div>
          <ProgressBar
            value={enemyHp / 100}
            color="#fb7185"
            className="mt-1 h-1.5 bg-white/15"
          />
          <p className="mt-1 truncate text-right text-[9px] font-bold text-white/55">
            {encounter.elementEmoji} 英検{enemyRank.label} · ⚔{battleState.enemyStats.attack}
          </p>
        </div>
      </div>

      <div
        key={`scene-${battleState.answered}-${eventKind ?? 'ready'}`}
        className={cx(
          'mob-battle-stage battle-status-stage mt-2 rounded-xl',
          skillFlash && 'battle-stage-skill',
        )}
        style={{ '--battle-scene': encounter.chapterGradient }}
        role="img"
        aria-label={`戦闘状況。自分は${battleState.heroCurrentHp}/${battleState.heroMaxHp}HP、${encounter.name}は${battleState.enemyCurrentHp}/${battleState.enemyMaxHp}HP。${cue.title}`}
      >
        <div
          className={cx(
            'battle-stage-unit battle-stage-hero',
            heroAttacking && 'battle-unit-lunge-right',
            heroDamaged && 'battle-unit-damaged',
            guardActive && 'battle-unit-guard',
          )}
        >
          <HeroPortrait
            level={heroLevel}
            title={heroTitle}
            decorative
            showLevel={false}
            attacking={heroAttacking}
            damaged={heroDamaged}
            guarding={guardActive}
            className="h-[58px] w-[58px]"
          />
          <span>YOU</span>
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
          <span>{cue.emoji}</span>
          <strong>{cue.label}</strong>
          <small>{cue.title}</small>
          {damageLabel && <b>{damageLabel}</b>}
        </div>

        <div
          className={cx(
            'battle-stage-unit battle-stage-enemy',
            enemyAttacking && 'battle-unit-lunge-left',
            enemyDamaged && 'battle-unit-damaged',
          )}
        >
          <MobPortrait
            encounter={encounter}
            decorative
            showBadge={false}
            hit={hit}
            className="h-16 w-16 rounded-2xl ring-1 ring-white/35"
          />
          <span>{encounter.isBoss ? 'BOSS' : 'MOB'}</span>
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

      <div className="mt-2 flex items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-400/10 px-2 py-1.5">
        <span className="text-sm">{encounter.elementEmoji}</span>
        <p className="min-w-0 flex-1 truncate text-[9px] font-bold text-rose-100">
          <span className="mr-1 font-black tracking-wide text-rose-300">NEXT</span>
          {encounter.move} — {encounter.intent}
        </p>
      </div>
      <div
        key={`status-${battleState.answered}-${eventActive ? 'answer' : 'ready'}`}
        className={cx(
          'mt-2 flex items-center justify-between gap-2 rounded-xl bg-white/10 px-2 py-1.5 text-[9px] font-extrabold',
          skillFlash && 'battle-skill-flash bg-amber-300 text-amber-950',
        )}
        aria-live="polite"
      >
        <span className="shrink-0">{tactic.emoji} {tactic.name}</span>
        <span className="truncate text-right">{battleState.status}</span>
      </div>
    </div>
  )
}
