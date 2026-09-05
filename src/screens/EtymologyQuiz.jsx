import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { ETYMOLOGY_PACKS, getEtymologyPack, getWord } from '../data/vocab.js'
import { buildEtymologyQuizQuestion } from '../lib/etymologyQuiz.js'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { growDeck } from '../lib/session.js'
import { Button, IconButton } from '../components/ui.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'
import {
  QuestionSessionControls,
  useIndexedSessionState,
} from '../components/QuestionSessionControls.jsx'
import { ArrowRight, Check, Close } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

function shuffle(values) {
  const list = [...values]
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[list[index], list[swap]] = [list[swap], list[index]]
  }
  return list
}

function buildQuizDeck(ids, size = 0) {
  const cards = shuffle((ids ?? []).map(getEtymologyPack).filter(Boolean))
  return size > 0 ? cards.slice(0, size) : cards
}

// 語源そのもののテスト。3択＋「わからない」で、記録は語源専用SRSへ入る。
export function EtymologyQuizScreen() {
  const params = useStore((state) => state.params)
  const back = useStore((state) => state.back)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const reviewEtymology = useStore((state) => state.reviewEtymology)

  const poolSize = (params.ids ?? []).length
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildQuizDeck(params.ids, params.size ?? sessionSize))
  const [index, setIndex] = useState(0)
  const {
    value: selected,
    setValue: setSelected,
    clear: clearSelections,
  } = useIndexedSessionState(index)
  const autoAdvanceSequence = useRef(0)
  const [autoAdvanceSignal, setAutoAdvanceSignal] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  const card = deck[index]
  const question = useMemo(
    () => (card ? buildEtymologyQuizQuestion(card, ETYMOLOGY_PACKS) : null),
    [card?.id], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const options = useMemo(
    () => (question ? shuffle(question.options) : []),
    [question?.cardId], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const leave = () => (params.returnTo
    ? returnTo(params.returnTo.screen, params.returnTo.params ?? {})
    : back())

  if (!deck.length || !question) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる語源カードがありません</p>
        <Button onClick={leave}>戻る</Button>
      </div>
    )
  }

  const restart = () => {
    setDeck(buildQuizDeck(params.ids, deck.length))
    setIndex(0)
    clearSelections()
    setCorrectCount(0)
    setDone(false)
  }

  if (done) {
    const rate = Math.round((correctCount / deck.length) * 100)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-6xl">{rate >= 80 ? '🏆' : rate >= 50 ? '👏' : '📚'}</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">{correctCount} / {deck.length} 正解</p>
          <p className="mt-1 text-sm font-bold text-ink/55">正答率 {rate}%</p>
        </div>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Button variant="secondary" onClick={restart}>もう一度</Button>
          <Button onClick={leave}>戻る</Button>
        </div>
      </div>
    )
  }

  const answered = selected !== null
  const isCorrectPick = answered && selected === question.answerId

  const choose = (optionId) => {
    if (answered) return
    setSelected(optionId)
    if (optionId === UNKNOWN_CHOICE_ID) {
      reviewEtymology(card.id, 'unknown')
    } else if (optionId === question.answerId) {
      reviewEtymology(card.id, 'correct')
      setCorrectCount((count) => count + 1)
      autoAdvanceSequence.current += 1
      setAutoAdvanceSignal(autoAdvanceSequence.current)
    } else {
      reviewEtymology(card.id, 'wrong')
    }
  }

  const next = () => {
    if (index + 1 >= deck.length) setDone(true)
    else setIndex(index + 1)
  }

  const exampleWords = card.exampleIds.map(getWord).filter(Boolean)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={leave} aria-label="やめる"><Close size={22} /></IconButton>
        <span className="min-w-0 flex-1" aria-hidden="true" />
        <SessionCounter
          index={index}
          total={deck.length}
          max={poolSize}
          onResize={(size, { discard }) => {
            if (discard) {
              setDeck(buildQuizDeck(params.ids, size))
              setIndex(0)
              clearSelections()
              setCorrectCount(0)
              setDone(false)
            } else {
              setDeck((current) => growDeck(current, index + 1, buildQuizDeck(params.ids, size), size))
            }
          }}
        />
      </div>

      <QuestionSessionControls
        index={index}
        total={deck.length}
        onPrevious={() => setIndex((current) => Math.max(0, current - 1))}
        onNext={next}
        nextDisabled={!answered}
        showAutoAdvance
        autoAdvanceSignal={isCorrectPick ? autoAdvanceSignal : null}
        progressColor="#7c3aed"
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4" data-etymology-quiz>
        <div className="mt-2 flex flex-col items-center rounded-[2rem] bg-white p-6 text-center shadow-card">
          <span className="self-start rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-extrabold text-violet-700">
            {question.formatLabel}
          </span>
          <h2 className="mt-2 pt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
            {question.cue}
          </h2>
          {question.cueNote && (
            <p className="mt-1 text-sm font-bold text-ink/55">{question.cueNote}</p>
          )}
          <p className="mt-4 text-sm font-extrabold text-ink/55">{question.prompt}</p>
        </div>

        <div className="mt-4 space-y-2.5">
          {options.map((option) => {
            const correct = option.id === question.answerId
            const chosen = selected === option.id
            let tone = 'idle'
            if (answered) tone = correct ? 'correct' : chosen ? 'wrong' : 'dim'
            return (
              <button
                key={option.id}
                disabled={answered}
                onClick={() => choose(option.id)}
                className={cx(
                  'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-bold transition-all',
                  tone === 'idle' && 'border-violet-100 bg-white text-ink active:scale-[0.99] active:bg-violet-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-800',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className="flex-1">{option.label}</span>
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

        {answered && (
          <div className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <p className={cx('font-display text-lg font-extrabold', isCorrectPick ? 'text-emerald-600' : 'text-rose-500')}>
              {isCorrectPick ? '正解！🎉' : selected === UNKNOWN_CHOICE_ID ? '答えはこちら' : 'ざんねん…'}
            </p>
            <p className="mt-1 font-bold text-ink">
              <span className="font-display">{card.rootForm}</span> ＝ {card.rootMeaning}
            </p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-ink/60">{question.explanation}</p>
            <div className="mt-3 rounded-2xl bg-violet-50/70 p-3">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-violet-500">この形を使う語</p>
              <p className="mt-1 text-sm font-bold leading-relaxed text-ink/70">
                {exampleWords.map((word) => word.word).join('・')}
                {card.coverageIds.length > exampleWords.length
                  ? ` ほか${card.coverageIds.length - exampleWords.length}語`
                  : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('etymologyPack', { packId: card.id })}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-violet-50 px-3 text-xs font-extrabold text-violet-700 ring-1 ring-violet-100 active:bg-violet-100"
            >
              このカードの単語と出典を見る <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-violet-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {index + 1 >= deck.length ? '結果を見る' : '次へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
