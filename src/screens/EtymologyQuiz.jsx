import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  getWord,
} from '../data/vocab.js'
import { buildEtymologyDeck } from '../lib/etymologyProgress.js'
import { growDeck } from '../lib/session.js'
import { buildEtymologyQuizQuestion } from '../lib/etymologyQuiz.js'
import {
  EtymologyKnowledgeAnswer,
  wordsForEtymologyPack,
} from '../components/EtymologyKnowledge.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Button, IconButton, ProgressBar, cx } from '../components/ui.jsx'
import { ArrowRight, Check, Close } from '../components/Icons.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'

const freshResults = () => ({
  correct: 0,
  review: 0,
  missedPackIds: new Set(),
})

function QuizChoices({ options, answerId, selected, onChoose }) {
  const answered = selected !== null
  return (
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="正しいか正しくないかを選ぶ">
      {options.map((option) => {
        const correct = option.id === answerId
        const chosen = option.id === selected
        let tone = 'idle'
        if (answered) tone = correct ? 'correct' : chosen ? 'wrong' : 'dim'
        return (
          <button
            key={option.id}
            type="button"
            disabled={answered}
            onClick={() => onChoose(option.id)}
            className={cx(
              'flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-center font-display text-sm font-extrabold transition-all sm:min-h-16 sm:py-3',
              tone === 'idle' && 'border-violet-200 bg-white text-violet-800 active:scale-[0.98] active:bg-violet-50',
              tone === 'correct' && 'border-emerald-400 bg-emerald-50 text-emerald-800',
              tone === 'wrong' && 'animate-shake border-rose-400 bg-rose-50 text-rose-800',
              tone === 'dim' && 'border-transparent bg-slate-100 text-ink/35',
            )}
          >
            {tone === 'correct' && <Check size={19} className="shrink-0 text-emerald-600" />}
            {tone === 'wrong' && <Close size={18} className="shrink-0 text-rose-500" />}
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function EtymologyQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const reviewEtymology = useStore((state) => state.reviewEtymology)
  const scrollRef = useRef(null)
  const initialEtymologySrs = useRef(useStore.getState().etymologySrs)
  // 実際に出せる問題数を数えて、1回の問題数の選択肢に反映する。
  const buildFor = (size) =>
    buildEtymologyDeck(ETYMOLOGY_PACKS, initialEtymologySrs.current, {
      mode: params.mode ?? 'all',
      status: params.status ?? 'priority',
      packIds: params.packIds,
      size,
    })
  const [poolSize] = useState(() => buildFor(Infinity).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildFor(params.size ?? sessionSize))
  const [index, setIndex] = useState(0)
  const [studied, setStudied] = useState(false)
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)
  const results = useRef(freshResults())
  const pack = deck[index]

  // コンテンツ画面の「戻る」は履歴でなく、語源カードの種類を選ぶ画面へ。
  const backToEtymologyParent = () => (
    params.packIds?.length === 1
      ? navigate('etymologyPack', { packId: params.packIds[0] })
      : navigate('roots')
  )
  const question = useMemo(
    () => pack ? buildEtymologyQuizQuestion(pack) : null,
    [pack?.id],
  )

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [index, done, studied])

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">確認できる語源カードがありません</p>
        <p className="text-sm font-bold text-ink/50">別の学び方や進み具合を選んでください。</p>
        <Button onClick={backToEtymologyParent}>戻る</Button>
      </div>
    )
  }

  const restartMissed = () => {
    const packIds = [...results.current.missedPackIds]
    const nextDeck = buildEtymologyDeck(
      ETYMOLOGY_PACKS,
      useStore.getState().etymologySrs,
      { mode: 'all', status: 'all', packIds, size: packIds.length },
    )
    results.current = freshResults()
    setDeck(nextDeck)
    setIndex(0)
    setStudied(false)
    setSelected(null)
    setDone(false)
  }

  if (done) {
    const missedCount = results.current.missedPackIds.size
    return (
      <div className="flex h-full flex-col" data-etymology-quiz-result>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
          <div className="mx-auto max-w-xl space-y-5 text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <Check size={42} />
            </span>
            <div>
              <p className="font-display text-2xl font-extrabold text-ink">語源の学習完了</p>
              <p className="mt-1 text-sm font-bold text-ink/50">{deck.length}問の2択確認</p>
            </div>
            <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
              <p className="text-xs font-extrabold text-ink/50">正解</p>
              <p className="mt-1 font-display text-4xl font-extrabold text-violet-700">
                {results.current.correct}/{deck.length}
              </p>
            </div>
            <p className="rounded-2xl bg-brand-50 px-4 py-3 text-sm font-bold leading-relaxed text-brand-700">
              結果は英単語の暗記記録とは分けて、語源の学習記録に保存しました。
            </p>
            {missedCount > 0 && (
              <Button full size="lg" onClick={restartMissed}>
                復習する（{missedCount}枚）
              </Button>
            )}
            <Button full size="lg" variant="secondary" onClick={backToEtymologyParent}>語源へ戻る</Button>
          </div>
        </div>
      </div>
    )
  }

  const mode = ETYMOLOGY_MODE_META[pack.mode]
  const words = wordsForEtymologyPack(pack)
  const word = getWord(question.targetWordId)
  const answered = selected !== null
  const correct = selected === question.knowledge.answerId
  const progress = (index + (answered ? 1 : studied ? 0.5 : 0)) / deck.length

  const choose = (optionId) => {
    if (answered) return
    setSelected(optionId)
    const isCorrect = optionId === question.knowledge.answerId
    reviewEtymology(pack.id, isCorrect ? 'correct' : 'wrong')
    if (isCorrect) results.current.correct += 1
    else {
      results.current.review += 1
      results.current.missedPackIds.add(pack.id)
    }
  }

  const next = () => {
    if (!answered) return
    if (index + 1 >= deck.length) {
      setDone(true)
      return
    }
    setIndex((current) => current + 1)
    setStudied(false)
    setSelected(null)
  }

  return (
    <div className="flex h-full flex-col" data-etymology-quiz>
      <div className="shrink-0 border-b border-brand-100 bg-white/95 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={backToEtymologyParent} aria-label="語源の確認をやめる">
            <Close size={22} />
          </IconButton>
          <div className="flex-1">
            <ProgressBar value={progress} color="#7c3aed" />
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
                setStudied(false)
                setSelected(null)
                setDone(false)
                results.current = freshResults()
              } else {
                setDeck((current) => growDeck(current, index + 1, buildFor(size), size))
              }
            }}
          />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 pb-5">
        <div className="mx-auto mt-3 w-full max-w-xl space-y-4">
          {!studied ? (
            <section
              className="rounded-[2rem] bg-white p-5 shadow-card"
              aria-labelledby="etymology-learning-heading"
              data-etymology-learning-preview
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-extrabold text-violet-700">
                  {mode.emoji} まず意味を理解
                </span>
                <SpeakButton text={word.word} size="sm" />
              </div>
              <h1 id="etymology-learning-heading" className="sr-only">{word.word} の語源を学ぶ</h1>
              <div className="mt-4">
                <EtymologyKnowledgeAnswer pack={pack} words={words} />
              </div>
            </section>
          ) : (
            <section className="rounded-[2rem] bg-white p-4 shadow-card sm:p-5" aria-labelledby="etymology-question-heading">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-extrabold text-violet-700">
                  {mode.emoji} 2択で確認
                </span>
                <SpeakButton text={word.word} size="sm" />
              </div>
              <p className="mt-3 text-center font-display text-2xl font-extrabold tracking-tight text-ink sm:mt-5 sm:text-3xl">
                {question.knowledge.cue}
              </p>
              <h1 id="etymology-question-heading" className="mt-1 text-center text-sm font-extrabold leading-relaxed text-ink/60 sm:mt-2">
                {question.knowledge.prompt}
              </h1>
              <p
                className="mt-3 break-words rounded-2xl border-2 border-violet-200 bg-violet-50 px-3 py-3 text-center font-display text-sm font-extrabold leading-relaxed text-violet-900 sm:mt-4 sm:px-4 sm:py-5 sm:text-base"
                data-etymology-meaning-claim
              >
                {question.knowledge.statement}
              </p>
              <div className="mt-3 sm:mt-4">
                <QuizChoices
                  options={question.knowledge.options}
                  answerId={question.knowledge.answerId}
                  selected={selected}
                  onChoose={choose}
                />
              </div>
              {answered && (
                <div className="mt-4 space-y-3" data-etymology-answer-feedback>
                  <p className={cx(
                    'rounded-xl px-3 py-2 text-sm font-extrabold',
                    correct ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
                  )}>
                    {correct
                      ? question.knowledge.statementIsCorrect
                        ? '正解。形と意味がつながっています。'
                        : '正解。意味の違いを見抜けました。'
                      : '不正解。正しいつながりを見直しましょう。'}
                  </p>
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
                    <p className="text-xs font-extrabold text-emerald-700">正しい形と意味</p>
                    <p className="mt-1 font-display text-sm font-extrabold leading-relaxed text-ink">
                      {question.knowledge.correctLabel}
                    </p>
                    <p className="mt-2 text-xs font-bold leading-relaxed text-ink/55">
                      {question.knowledge.explanation}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <p className="text-xs font-extrabold text-ink/50">関連語</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {words.map((relatedWord) => (
                        <span key={relatedWord.id} className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-ink/70 ring-1 ring-slate-200">
                          {relatedWord.word}＝{relatedWord.meanings?.[0] ?? relatedWord.meaning}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/95 p-3 pb-3 backdrop-blur">
        {!studied ? (
          <Button full size="lg" onClick={() => setStudied(true)}>
            2択で確認する <ArrowRight size={18} />
          </Button>
        ) : (
          <Button full size="lg" disabled={!answered} onClick={next}>
            {index + 1 >= deck.length ? '結果を見る' : '次の語源へ'} <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </div>
  )
}
