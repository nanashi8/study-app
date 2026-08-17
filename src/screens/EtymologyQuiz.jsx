import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  getWord,
} from '../data/vocab.js'
import { buildEtymologyDeck } from '../lib/etymologyProgress.js'
import { buildEtymologyQuizQuestion } from '../lib/etymologyQuiz.js'
import {
  EtymologyKnowledgeAnswer,
  wordsForEtymologyPack,
} from '../components/EtymologyKnowledge.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { Button, IconButton, ProgressBar, cx } from '../components/ui.jsx'
import { ArrowRight, Check, Close } from '../components/Icons.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'

const freshResults = () => ({
  etymologyCorrect: 0,
  etymologyReview: 0,
  wordCorrect: 0,
  wordReview: 0,
  missedPackIds: new Set(),
  missedWordIds: new Set(),
})

function QuizChoices({ options, answerId, selected, onChoose, label }) {
  const answered = selected !== null
  return (
    <div className="space-y-2" role="group" aria-label={label}>
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
              'flex min-h-12 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-extrabold leading-relaxed transition-all',
              tone === 'idle' && 'border-brand-100 bg-white text-ink active:scale-[0.99] active:bg-brand-50',
              tone === 'correct' && 'border-emerald-400 bg-emerald-50 text-emerald-800',
              tone === 'wrong' && 'animate-shake border-rose-400 bg-rose-50 text-rose-800',
              tone === 'dim' && 'border-transparent bg-slate-100 text-ink/35',
            )}
          >
            <span className="min-w-0 flex-1">{option.label}</span>
            {tone === 'correct' && <Check size={20} className="shrink-0 text-emerald-600" />}
            {tone === 'wrong' && <Close size={18} className="shrink-0 text-rose-500" />}
          </button>
        )
      })}
      <UnknownChoiceButton
        selected={selected === UNKNOWN_CHOICE_ID}
        disabled={answered}
        onClick={() => onChoose(UNKNOWN_CHOICE_ID)}
      />
    </div>
  )
}

function ResultStat({ label, correct, total, color }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200">
      <p className="text-xs font-extrabold text-ink/50">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>
        {correct}/{total}
      </p>
      <p className="text-xs font-bold text-ink/45">正解</p>
    </div>
  )
}

export function EtymologyQuizScreen() {
  const params = useStore((state) => state.params)
  const back = useStore((state) => state.back)
  const reviewEtymology = useStore((state) => state.reviewEtymology)
  const reviewWord = useStore((state) => state.review)
  const scrollRef = useRef(null)
  const initialEtymologySrs = useRef(useStore.getState().etymologySrs)
  const [deck, setDeck] = useState(() =>
    buildEtymologyDeck(ETYMOLOGY_PACKS, initialEtymologySrs.current, {
      mode: params.mode ?? 'all',
      status: params.status ?? 'priority',
      packIds: params.packIds,
      size: params.size,
    }),
  )
  const [index, setIndex] = useState(0)
  const [studied, setStudied] = useState(false)
  const [knowledgeSelected, setKnowledgeSelected] = useState(null)
  const [wordSelected, setWordSelected] = useState(null)
  const [done, setDone] = useState(false)
  const results = useRef(freshResults())
  const pack = deck[index]
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
        <p className="text-sm font-bold text-ink/50">別の分類や進み具合を選んでください。</p>
        <Button onClick={back}>もどる</Button>
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
    setKnowledgeSelected(null)
    setWordSelected(null)
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
              <p className="font-display text-2xl font-extrabold text-ink">語源＋英単語の確認完了</p>
              <p className="mt-1 text-sm font-bold text-ink/50">{deck.length}枚・合計{deck.length * 2}問</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ResultStat
                label="語源知識"
                correct={results.current.etymologyCorrect}
                total={deck.length}
                color="#7c3aed"
              />
              <ResultStat
                label="関連英単語"
                correct={results.current.wordCorrect}
                total={deck.length}
                color="#0284c7"
              />
            </div>
            <p className="rounded-2xl bg-brand-50 px-4 py-3 text-sm font-bold leading-relaxed text-brand-700">
              語源の結果は語源カードへ、英単語の結果は単語カードへ、それぞれ別に保存しました。
            </p>
            {missedCount > 0 && (
              <Button full size="lg" onClick={restartMissed}>
                もう一度確認する（{missedCount}枚）
              </Button>
            )}
            <Button full size="lg" variant="secondary" onClick={back}>語源カードへ戻る</Button>
          </div>
        </div>
      </div>
    )
  }

  const mode = ETYMOLOGY_MODE_META[pack.mode]
  const words = wordsForEtymologyPack(pack)
  const word = getWord(question.word.wordId)
  const knowledgeAnswered = knowledgeSelected !== null
  const wordAnswered = wordSelected !== null
  const knowledgeCorrect = knowledgeSelected === question.knowledge.answerId
  const wordCorrect = wordSelected === question.word.answerId
  const progress = (
    index + (
      wordAnswered ? 1
        : knowledgeAnswered ? 2 / 3
          : studied ? 1 / 3
            : 0
    )
  ) / deck.length

  const chooseKnowledge = (optionId) => {
    if (knowledgeAnswered) return
    setKnowledgeSelected(optionId)
    const correct = optionId === question.knowledge.answerId
    reviewEtymology(
      pack.id,
      correct ? 'correct' : optionId === UNKNOWN_CHOICE_ID ? 'unknown' : 'wrong',
    )
    if (correct) results.current.etymologyCorrect += 1
    else {
      results.current.etymologyReview += 1
      results.current.missedPackIds.add(pack.id)
    }
  }

  const chooseWord = (optionId) => {
    if (wordAnswered) return
    setWordSelected(optionId)
    const correct = optionId === question.word.answerId
    reviewWord(
      word.id,
      correct ? 'correct' : optionId === UNKNOWN_CHOICE_ID ? 'unknown' : 'wrong',
      'vocab',
    )
    if (correct) results.current.wordCorrect += 1
    else {
      results.current.wordReview += 1
      results.current.missedPackIds.add(pack.id)
      results.current.missedWordIds.add(word.id)
    }
  }

  const next = () => {
    if (!wordAnswered) return
    if (index + 1 >= deck.length) {
      setDone(true)
      return
    }
    setIndex((current) => current + 1)
    setStudied(false)
    setKnowledgeSelected(null)
    setWordSelected(null)
  }

  return (
    <div className="flex h-full flex-col" data-etymology-quiz>
      <div className="shrink-0 border-b border-brand-100 bg-white/95 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <IconButton onClick={back} aria-label="語源と英単語の確認をやめる">
            <Close size={22} />
          </IconButton>
          <div className="flex-1">
            <ProgressBar value={progress} color="#7c3aed" />
          </div>
          <SpeechSettingsButton compact />
          <span className="w-12 text-right text-sm font-extrabold text-ink/50">
            {index + 1}/{deck.length}
          </span>
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
                  {mode.emoji} まず正解を覚える
                </span>
                <span className="text-xs font-extrabold text-ink/40">関連 {words.length}語</span>
              </div>
              <h1 id="etymology-learning-heading" className="mt-4 text-center font-display text-2xl font-extrabold leading-tight text-ink">
                {pack.title}
              </h1>
              <p className="mt-2 text-center text-sm font-bold leading-relaxed text-ink/55">
                この正しい組み合わせを覚えてから、3択で確認します。
              </p>
              <div
                className="mt-4 rounded-2xl border-2 border-violet-200 bg-violet-50 px-4 py-4 text-center"
                data-etymology-correct-combination
              >
                <p className="text-xs font-extrabold text-violet-600">正しい語源の組み合わせ</p>
                <p className="mt-2 break-words font-display text-lg font-extrabold leading-relaxed text-violet-800">
                  {question.knowledge.correctLabel}
                </p>
              </div>
              <div className="mt-5">
                <p className="text-sm font-extrabold text-sky-700">一緒に結びつける英単語</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {words.map((relatedWord) => (
                    <div
                      key={relatedWord.id}
                      className={cx(
                        'rounded-xl border px-3 py-2',
                        relatedWord.id === question.word.wordId
                          ? 'border-sky-300 bg-sky-50'
                          : 'border-slate-200 bg-slate-50',
                      )}
                    >
                      <p className="font-display text-base font-extrabold text-ink">{relatedWord.word}</p>
                      <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/55">
                        {relatedWord.meanings?.slice(0, 2).join('・') || relatedWord.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <>
              <section className="rounded-[2rem] bg-white p-5 shadow-card" aria-labelledby="etymology-question-heading">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-extrabold text-violet-700">
                    1/2　{mode.emoji} 語源
                  </span>
                  <span className="text-xs font-extrabold text-ink/40">関連 {words.length}語</span>
                </div>
                <p className="mt-5 text-center font-display text-3xl font-extrabold tracking-tight text-violet-700">
                  {question.knowledge.cue}
                </p>
                {question.knowledge.contextWords.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {question.knowledge.contextWords.map((headword) => (
                      <span key={headword} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-600">
                        {headword}
                      </span>
                    ))}
                  </div>
                )}
                <h1 id="etymology-question-heading" className="mt-3 text-center text-sm font-extrabold leading-relaxed text-ink/60">
                  {question.knowledge.prompt}
                </h1>
                <div className="mt-4">
                  <QuizChoices
                    options={question.knowledge.options}
                    answerId={question.knowledge.answerId}
                    selected={knowledgeSelected}
                    onChoose={chooseKnowledge}
                    label="語源の答え"
                  />
                </div>
                {knowledgeAnswered && (
                  <p className={cx(
                    'mt-3 rounded-xl px-3 py-2 text-sm font-extrabold',
                    knowledgeCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
                  )}>
                    {knowledgeCorrect ? '正解。次は、この語源と結びつく英単語です。' : '答えを確認して、関連英単語へ進みましょう。'}
                  </p>
                )}
              </section>

              {knowledgeAnswered && (
                <section className="rounded-[2rem] bg-white p-5 shadow-card" aria-labelledby="etymology-word-question-heading">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-extrabold text-sky-700">
                      2/2　英単語
                    </span>
                    <SpeakButton text={word.word} size="sm" />
                  </div>
                  <p className="mt-4 text-center font-display text-3xl font-extrabold tracking-tight text-ink">
                    {word.word}
                  </p>
                  {word.phonetic && <p className="mt-1 text-center text-sm font-bold text-ink/40">{word.phonetic}</p>}
                  <h2 id="etymology-word-question-heading" className="mt-3 text-center text-sm font-extrabold text-ink/60">
                    {question.word.prompt}
                  </h2>
                  <div className="mt-4">
                    <QuizChoices
                      options={question.word.options}
                      answerId={question.word.answerId}
                      selected={wordSelected}
                      onChoose={chooseWord}
                      label="英単語の答え"
                    />
                  </div>
                  {wordAnswered && (
                    <p className={cx(
                      'mt-3 rounded-xl px-3 py-2 text-sm font-extrabold',
                      wordCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
                    )}>
                      {wordCorrect ? `正解。${word.word} ＝ ${word.meanings.join('・')}` : `${word.word} ＝ ${word.meanings.join('・')}`}
                    </p>
                  )}
                </section>
              )}

              {wordAnswered && (
                <section className="rounded-[2rem] bg-slate-50 p-4 ring-1 ring-slate-200" aria-label="語源と関連英単語の答え合わせ">
                  <p className="mb-3 text-sm font-extrabold text-violet-700">語源と関連英単語をまとめて確認</p>
                  <EtymologyKnowledgeAnswer pack={pack} words={words} />
                </section>
              )}
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur">
        {!studied ? (
          <Button full size="lg" onClick={() => setStudied(true)}>
            この語源を確認する <ArrowRight size={18} />
          </Button>
        ) : (
          <Button full size="lg" disabled={!wordAnswered} onClick={next}>
            {index + 1 >= deck.length ? '結果を見る' : '次の語源へ'} <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </div>
  )
}
