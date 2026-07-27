import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore, todayIndex } from '../store/useStore.js'
import { buildDeck, SESSION_SIZE } from '../lib/session.js'
import { enemyLevel } from '../lib/adaptive.js'
import {
  battleTactic,
  battleQuest,
  encounterFor,
  heroProgress,
  resolveBattleState,
} from '../lib/rpg.js'
import { pickDistractors, shuffle } from '../data/vocab.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { Button, ProgressBar, IconButton } from '../components/ui.jsx'
import { Close, Check, ArrowRight } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import battleVignette from '../assets/rpg-battle-vignette.jpg'

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
  const quest = isBattle ? battleQuest(params.source?.questId) : null
  const encounter = isBattle
    ? encounterFor({
        level:
          params.source?.heroLevel
          ?? heroProgress(useStore.getState().stats.xp).level,
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
      })
    : null
  const battleAnswered = battleState?.answered ?? 0
  const enemyHp = battleState?.enemyHp ?? 100
  const heroHp = battleState?.heroHp ?? 100
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
      review(word.id, 'unknown')
      results.current.unknown++
      results.current.wrongIds.push(word.id)
      battleAnswer = 'unknown'
    } else if (optId === word.id) {
      review(word.id, 'correct')
      results.current.correct++
      battleAnswer = 'correct'
    } else {
      review(word.id, 'wrong')
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
    ? `${encounter.name}に一撃！ ⚔️`
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
            quest={quest}
            tactic={tactic}
            battleState={battleState}
            eventActive={answered}
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
  quest,
  tactic,
  battleState,
  eventActive,
}) {
  const eventKind = eventActive ? battleState.lastEvent?.kind : null
  const skillFlash = ['burst', 'shield', 'block', 'counter'].includes(eventKind)
  return (
    <div className="mt-2 rounded-2xl bg-slate-900 p-2.5 text-white shadow-inner">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-1 text-[9px] font-extrabold text-emerald-300">
            <span>YOU</span>
            <span>{heroHp} HP</span>
          </div>
          <ProgressBar
            value={heroHp / 100}
            color="#34d399"
            className="mt-1 h-1.5 bg-white/15"
          />
          <p className="mt-1 truncate text-[9px] font-bold text-white/55">
            {quest.emoji} {quest.label}
          </p>
        </div>

        <span className="text-[10px] font-black text-amber-300">VS</span>

        <div className="flex min-w-0 items-center gap-1.5">
          <img
            src={battleVignette}
            alt=""
            className={cx(
              'mob-portrait h-8 w-8 shrink-0 rounded-xl object-cover ring-1 ring-violet-300/50',
              hit && 'mob-portrait-hit',
            )}
            style={{ objectPosition: '88% 52%' }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1 text-[9px] font-extrabold text-rose-300">
              <span className="truncate">{encounter.name}</span>
              <span>{enemyHp} HP</span>
            </div>
            <ProgressBar
              value={enemyHp / 100}
              color="#fb7185"
              className="mt-1 h-1.5 bg-white/15"
            />
            <p className="mt-1 truncate text-right text-[9px] font-bold text-white/55">
              敵：英検{enemyRank.label}
            </p>
          </div>
        </div>
      </div>
      <div
        key={`${battleState.answered}-${eventActive ? 'answer' : 'ready'}`}
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
