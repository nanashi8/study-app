import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { buildDeck, growDeck } from '../lib/session.js'
import { pickDistractors, shuffle } from '../data/vocab.js'
import { quizMeaning } from '../data/compact.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { EtymologyBlock, PosBadge } from '../components/WordBits.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { DragonVeinCipherStage } from '../components/DragonVeinCipherStage.jsx'
import { Button, ProgressBar, IconButton } from '../components/ui.jsx'
import { Close, Check, ArrowRight } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { buildVocabInstructorExplanation } from '../lib/instructorExplanations.js'
import { isDragonVeinSource } from '../lib/dragonVein.js'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'

const sessionKey = (params) => (
  `vocab|${JSON.stringify(params.source ?? { type: 'due' })}|${params.title ?? ''}|${params.size ?? ''}`
)

const newSessionId = () => (
  globalThis.crypto?.randomUUID?.()
  ?? `dragon-${Date.now()}-${Math.random().toString(36).slice(2)}`
)

function restoredAnswerLog(results = {}) {
  if (Array.isArray(results.answerLog)) return [...results.answerLog]
  if (Array.isArray(results.battleLog)) return [...results.battleLog]
  const count = (value) => Math.max(0, Math.floor(Number(value) || 0))
  return [
    ...Array(count(results.correct)).fill('correct'),
    ...Array(count(results.wrong)).fill('wrong'),
    ...Array(count(results.unknown)).fill('unknown'),
  ]
}

function streaksFromLog(log = []) {
  let streak = 0
  let wrongStreak = 0
  for (const answer of log) {
    if (answer === 'correct') {
      streak += 1
      wrongStreak = 0
    } else {
      streak = 0
      wrongStreak += 1
    }
  }
  return { streak, wrongStreak, lastAnswer: log.at(-1) ?? null }
}

export function VocabQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const back = useStore((state) => state.back)
  const review = useStore((state) => state.review)
  const saveQuizSession = useStore((state) => state.saveQuizSession)
  const clearQuizSession = useStore((state) => state.clearQuizSession)
  const selectedStudentId = useStore((state) => state.battleStudentId)
  const source = params.source ?? { type: 'due' }
  const isDragonVein = isDragonVeinSource(source)

  const [restore] = useState(() => {
    const saved = useStore.getState().quizSession
    return saved && saved.key === sessionKey(params) ? saved : null
  })
  useEffect(() => clearQuizSession(), [clearQuizSession])

  const sessionId = useRef(restore?.sessionId ?? newSessionId())
  // size=0 は「絞り込みなし」。在庫数から、選べる問題数の上限を決める。
  const buildFor = (size) => buildDeck(source, { srs: useStore.getState().srs, size })
  const [poolSize] = useState(() => buildFor(0).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => (
    restore?.deck ?? buildFor(params.size ?? sessionSize)
  ))
  const [index, setIndex] = useState(restore?.i ?? 0)
  const [selected, setSelected] = useState(() => (
    restore?.selected === 'unknown' ? UNKNOWN_CHOICE_ID : restore?.selected ?? null
  ))
  const results = useRef(
    restore
      ? {
          ...restore.results,
          wrongIds: [...(restore.results?.wrongIds ?? [])],
          answerLog: restoredAnswerLog(restore.results),
        }
      : { correct: 0, wrong: 0, unknown: 0, wrongIds: [], answerLog: [] },
  )

  const word = deck[index]
  const options = useMemo(() => {
    if (!word) return []
    if (restore?.i === index && restore.options?.length) return restore.options
    return shuffle([word, ...pickDistractors(word, 2)])
  }, [word?.id, index, restore])

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
  const streakState = streaksFromLog(results.current.answerLog)
  const isCorrectPick = answered && selected === word.id
  const instructorExplanation = answered
    ? buildVocabInstructorExplanation(
        word,
        selected === UNKNOWN_CHOICE_ID
          ? UNKNOWN_CHOICE_ID
          : options.find((option) => option.id === selected),
      )
    : null

  const finish = () => {
    navigate('sessionResult', {
      title: params.title ?? (isDragonVein ? '龍脈の単語解読' : 'クイズ'),
      mode: 'quiz',
      engine: 'word',
      total: deck.length,
      correct: results.current.correct,
      wrong: results.current.wrong + results.current.unknown,
      reviewIds: results.current.wrongIds,
      source,
      size: params.size,
      continueTo: params.continueTo,
      returnTo: params.returnTo,
      sessionId: sessionId.current,
      answerLog: [...results.current.answerLog],
      vocabSession: {
        wordIds: deck.map((item) => item.id),
        completedAt: Date.now(),
      },
    })
  }

  const choose = (optionId) => {
    if (answered) return
    setSelected(optionId)
    let answer
    if (optionId === UNKNOWN_CHOICE_ID) {
      review(word.id, 'unknown', 'vocab')
      results.current.unknown += 1
      results.current.wrongIds.push(word.id)
      answer = 'unknown'
    } else if (optionId === word.id) {
      review(word.id, 'correct', 'vocab')
      results.current.correct += 1
      answer = 'correct'
    } else {
      review(word.id, 'wrong', 'vocab')
      results.current.wrong += 1
      results.current.wrongIds.push(word.id)
      answer = 'wrong'
    }
    results.current.answerLog.push(answer)
  }

  const next = () => {
    if (index + 1 >= deck.length) finish()
    else {
      setIndex((current) => current + 1)
      setSelected(null)
    }
  }

  const saveBeforeDetail = () => {
    saveQuizSession({
      key: sessionKey(params),
      sessionId: sessionId.current,
      deck,
      i: index,
      selected,
      options,
      results: {
        ...results.current,
        wrongIds: [...results.current.wrongIds],
        answerLog: [...results.current.answerLog],
        // 旧版の退避セッションを読める期間は同じ値も残す。
        battleLog: [...results.current.answerLog],
      },
    })
    navigate('wordDetail', { id: word.id })
  }

  const feedback = isCorrectPick
    ? streakState.streak >= 5
      ? `連続${streakState.streak}正解！ 記憶の文脈が一気につながった`
      : '正解。英語の記憶断片を1つ復元した'
    : selected === UNKNOWN_CHOICE_ID
      ? '未解読として記録。例文から手掛かりを拾おう'
      : '組み合わせが合わない。意味と語源を見直そう'

  return (
    <div className={cx('flex h-full flex-col', isDragonVein && 'dragon-vein-quiz-screen')}>
      <div className="border-b border-brand-100 bg-white/90 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={back} aria-label={isDragonVein ? '解読を中断' : 'やめる'}>
            <Close size={22} />
          </IconButton>
          <div className="flex-1">
            <ProgressBar value={index / deck.length} color={isDragonVein ? '#8b5cf6' : '#0ea5e9'} />
          </div>
          <SpeechSettingsButton compact />
          <SessionCounter
            index={index}
            total={deck.length}
            max={poolSize}
            onResize={(size, { discard }) => {
              if (discard) {
                setDeck(buildFor(size))
                setIndex(0)
                setSelected(null)
                results.current = { correct: 0, wrong: 0, unknown: 0, wrongIds: [], answerLog: [] }
              } else {
                setDeck((current) => growDeck(current, index + 1, buildFor(size), size))
              }
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {isDragonVein && (
          <DragonVeinCipherStage
            source={source}
            studentId={selectedStudentId}
            answered={answered}
            lastAnswer={streakState.lastAnswer}
            streak={streakState.streak}
            wrongStreak={streakState.wrongStreak}
            current={index + 1}
            total={deck.length}
            className="mx-auto mt-2 w-full max-w-xl"
          />
        )}

        <div className={cx(
          'mx-auto mt-3 flex w-full max-w-xl flex-col items-center bg-white text-center shadow-card',
          isDragonVein ? 'rounded-2xl px-4 py-3' : 'rounded-[2rem] p-6',
        )}>
          <PosBadge pos={word.pos} className="self-start" />
          <div className="flex w-full items-center justify-center gap-3">
            <div>
              <h2 className={cx(
                'font-display font-extrabold tracking-tight text-ink',
                isDragonVein ? 'text-3xl' : 'mt-2 text-4xl',
              )}>{word.word}</h2>
              {word.phonetic && <p className="mt-1 text-sm font-bold text-ink/40">{word.phonetic}</p>}
            </div>
            <SpeakButton text={word.word} size="md" />
          </div>
          <p className="mt-2 text-sm font-extrabold text-ink/55">
            {isDragonVein ? 'この記憶断片が指す意味は？' : 'この単語の意味は？'}
          </p>
        </div>

        <div className={cx(
          'mx-auto w-full max-w-xl',
          isDragonVein ? 'mt-2 grid grid-cols-2 gap-2' : 'mt-4 space-y-2.5',
        )}>
          {options.map((option, optionIndex) => {
            const correct = option.id === word.id
            const chosen = selected === option.id
            let tone = 'idle'
            if (answered) tone = correct ? 'correct' : chosen ? 'wrong' : 'dim'
            return (
              <button
                key={option.id}
                disabled={answered}
                onClick={() => choose(option.id)}
                className={cx(
                  'flex w-full items-center gap-3 border-2 text-left font-bold transition-all',
                  isDragonVein ? 'min-h-14 rounded-xl px-3 py-2.5 text-sm' : 'rounded-2xl px-4 py-3.5',
                  tone === 'idle' && 'border-brand-100 bg-white text-ink active:scale-[0.99] active:bg-brand-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-800',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                {isDragonVein && (
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-900 text-xs font-black text-amber-100">
                    {optionIndex + 1}
                  </span>
                )}
                <span className="flex-1">{quizMeaning(option)}</span>
                {tone === 'correct' && <Check size={20} className="text-emerald-600" />}
                {tone === 'wrong' && <Close size={18} className="text-rose-500" />}
              </button>
            )
          })}
          <UnknownChoiceButton
            selected={selected === UNKNOWN_CHOICE_ID}
            disabled={answered}
            onClick={() => choose(UNKNOWN_CHOICE_ID)}
            className={isDragonVein ? 'min-h-14 rounded-xl py-2.5' : ''}
          />
        </div>

        {answered && (
          <div className="mx-auto mt-4 w-full max-w-xl animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <p className={cx(
              'font-display text-lg font-extrabold',
              isCorrectPick ? 'text-emerald-600' : 'text-rose-500',
            )}>
              {isDragonVein ? feedback : isCorrectPick ? '正解！🎉' : selected === UNKNOWN_CHOICE_ID ? '答えはこちら' : 'ざんねん…'}
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
            <InstructorExplanation explanation={instructorExplanation} className="mt-3" />
            {word.etymology && (
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-left ring-1 ring-slate-200">
                <p className="mb-2 text-sm font-extrabold text-brand-700">語源で覚える</p>
                <EtymologyBlock word={word} />
              </div>
            )}
            <button onClick={saveBeforeDetail} className="mt-2 inline-flex items-center gap-1 text-sm font-extrabold text-brand-600">
              辞書ページで関連語も見る <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-3 pb-3 backdrop-blur">
        <Button full size={isDragonVein ? 'md' : 'lg'} disabled={!answered} onClick={next}>
          {index + 1 >= deck.length
            ? isDragonVein ? '修復結果を確認' : '結果を見る'
            : '次の断片へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
