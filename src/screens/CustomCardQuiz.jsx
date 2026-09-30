import { useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { limitQuizChoices, UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { ChoiceExplanations } from '../components/ChoiceExplanations.jsx'
import { Button, cx } from '../components/ui.jsx'
import { answeredQuizIndexes, growDeck, restartSessionCount } from '../lib/session.js'
import { ArrowRight, Book, Check, Close } from '../components/Icons.jsx'
import { SessionCounter, useCarriedAnswers, useSessionSize } from '../components/SessionSize.jsx'
import { StudyMixEmptyNotice, currentStudyMixShare, useStudyMixRebuild } from '../components/StudyMix.jsx'
import {
  QuestionSessionControls,
  ReselectNote,
  useAnswerReceipts,
  useIndexedSessionState,
  useRevisitedAnswer,
} from '../components/QuestionSessionControls.jsx'
import {
  CUSTOM_CARD_QUIZ_DOMAIN,
  CUSTOM_SUBJECT_IDS,
  categoryTitle,
  getCustomCard,
  pickCustomCardQuestions,
  templateFor,
} from '../lib/customCards.js'

// 自作カード（英単語以外のテンプレート）のテスト。問いの欄を読んで答えを選ぶ（教材は4択、出題は3択＋わからない）。
// その他は意味を読んで用語を、一問一答は問題を読んで答えを、古文単語・漢語は語を読んで意味を選ぶ。
// 誤答はほかの自作カードの答え。答え合わせでは、出した選択肢それぞれのカードの問いの欄を並べる。
const ALL_QUESTIONS = 9999 // 在庫数を数えるための十分大きな上限
const CARD_COLOR = '#0891b2'

export function CustomCardQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const reviewCard = useStore((state) => state.reviewCustomCard)
  const reviseReview = useStore((state) => state.reviseReview)
  const recordQuizResult = useStore((state) => state.recordContentQuizResult)
  const categories = useStore((state) => state.customCategories)
  const subject = CUSTOM_SUBJECT_IDS.includes(params.subject) ? params.subject : null

  const pickQuestions = (ids, size) => {
    const state = useStore.getState()
    return pickCustomCardQuestions(ids, {
      size,
      srs: state.customCardSrs,
      quizResults: state.contentQuizResults,
      freshShare: currentStudyMixShare(),
      preserveOrder: params.preserveOrder === true,
    })
  }
  const [poolSize] = useState(() => pickQuestions(params.ids, ALL_QUESTIONS).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => pickQuestions(params.ids, params.size ?? sessionSize))
  const [index, setIndex] = useState(0)
  const {
    value: selected,
    setValue: setSelected,
    clear: clearSelections,
    values: selections,
  } = useIndexedSessionState(index)
  const autoAdvanceSequence = useRef(0)
  const [autoAdvanceSignal, setAutoAdvanceSignal] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [unknownCount, setUnknownCount] = useState(0)
  const [weakIds, setWeakIds] = useState([])
  const [done, setDone] = useState(false)
  const carried = useCarriedAnswers()
  const receipts = useAnswerReceipts()

  const question = deck[index]
  const choices = question ? limitQuizChoices(question.choices, question.answer, { seed: question.id }) : []
  const card = question ? getCustomCard(question.cardId) : null
  const reselectable = useRevisitedAnswer(index, selected !== null)

  const leave = () => (params.returnTo?.screen
    ? returnTo(params.returnTo.screen, params.returnTo.params ?? {})
    : returnTo('customWords', subject ? { subject } : {}))

  useStudyMixRebuild({
    index,
    answeredIndexes: answeredQuizIndexes(index, selections),
    fixedOrder: params.preserveOrder === true,
    rebuild: (keepCount) => {
      const size = params.size ?? sessionSize
      setDeck((current) => growDeck(current, current.length ? keepCount : 0, pickQuestions(params.ids, ALL_QUESTIONS), Math.max(size, keepCount)))
    },
  })

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">✍️</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できるカードがありません</p>
        <p className="text-sm font-bold leading-relaxed text-ink/55">{'テストは、答えのちがうカードが2枚以上になるとできます。'}</p>
        <StudyMixEmptyNotice />
        <Button onClick={leave}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = params.ids) => {
    carried.reset()
    receipts.clear()
    setDeck(pickQuestions(ids, deck.length || sessionSize))
    setIndex(0)
    clearSelections()
    setCorrectCount(0)
    setUnknownCount(0)
    setWeakIds([])
    setDone(false)
  }

  const resultOf = (choice) => (
    choice === UNKNOWN_CHOICE_ID ? 'unknown' : choice === question.answer ? 'correct' : 'wrong'
  )

  const choose = (choice) => {
    if (choice === selected || (selected !== null && !reselectable)) return
    const result = resultOf(choice)
    recordQuizResult(CUSTOM_CARD_QUIZ_DOMAIN, question.cardId, result === 'correct' ? 1 : 0, 1)
    if (selected !== null) {
      const previous = resultOf(selected)
      receipts.set(index, reviseReview(receipts.get(index), result))
      setCorrectCount((count) => count + (result === 'correct') - (previous === 'correct'))
      setUnknownCount((count) => count + (result === 'unknown') - (previous === 'unknown'))
      setWeakIds((ids) => (result === 'correct'
        ? ids.filter((id) => id !== question.cardId)
        : [...new Set([...ids, question.cardId])]))
      setSelected(choice)
      return
    }
    setSelected(choice)
    receipts.set(index, reviewCard(question.cardId, result))
    if (result === 'correct') {
      setCorrectCount((count) => count + 1)
      autoAdvanceSequence.current += 1
      setAutoAdvanceSignal(autoAdvanceSequence.current)
    } else {
      if (result === 'unknown') setUnknownCount((count) => count + 1)
      setWeakIds((ids) => [...new Set([...ids, question.cardId])])
    }
  }

  const next = () => {
    if (index + 1 >= deck.length) setDone(true)
    else setIndex((current) => current + 1)
  }

  if (done) {
    const total = carried.count + deck.length
    const percentage = Math.round((correctCount / total) * 100)
    return (
      <div className="flex h-full flex-col overflow-y-auto p-6 text-center" data-custom-card-quiz-result>
        <div className="m-auto flex w-full max-w-sm flex-col items-center gap-5 py-5">
          <div className="text-6xl">{percentage >= 80 ? '🏆' : percentage >= 50 ? '✨' : '📚'}</div>
          <div>
            <p className="text-xs font-extrabold text-cyan-700">{`${params.title ?? '自作カード'}のテストの結果`}</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">{`${correctCount} / ${total} 正解`}</p>
            <p className="mt-1 text-sm font-bold text-ink/50">
              正答率 {percentage}%{unknownCount > 0 && `・わからない ${unknownCount}問`}
            </p>
          </div>

          {weakIds.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('customCardStudy', {
                ids: weakIds,
                title: '間違えたカード',
                preserveOrder: true,
                returnTo: params.returnTo,
                ...(subject ? { subject } : {}),
              })}
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3.5 text-left text-rose-800 transition-transform active:scale-[0.98]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                <Book size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold">間違えたカードを暗記し直す</span>
                <span className="block text-[11px] font-bold text-rose-700/65">{`${weakIds.length}枚`}</span>
              </span>
              <ArrowRight size={18} />
            </button>
          )}

          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => restart(weakIds.length ? weakIds : params.ids)}>
              もう一度
            </Button>
            <Button onClick={leave}>自作カードへ戻る</Button>
          </div>
        </div>
      </div>
    )
  }

  const answered = selected !== null
  const answeredIndexes = answeredQuizIndexes(index, selections)
  const correctPick = selected === question.answer
  const unknownPick = selected === UNKNOWN_CHOICE_ID
  const template = templateFor(question.template)
  const answerLabel = template.fields.find((item) => item.key === template.quiz.answer)?.label ?? '答え'

  return (
    <div className="flex h-full flex-col">
      <QuestionSessionControls
        index={index}
        total={deck.length}
        onPrevious={() => setIndex((current) => Math.max(0, current - 1))}
        onNext={next}
        nextDisabled={!answered}
        showAutoAdvance
        autoAdvanceSignal={correctPick ? autoAdvanceSignal : null}
        progressColor={CARD_COLOR}
        progressControl={(
          <SessionCounter
            index={index}
            total={deck.length}
            max={poolSize}
            className="h-11"
            reached={Math.max(index, answeredIndexes.at(-1) ?? 0)}
            onResize={(size, { restart }) => {
              if (restart) {
                const next = restartSessionCount(deck, answeredIndexes, index, pickQuestions(params.ids, size + deck.length), size)
                carried.carry(next.answeredItems)
                receipts.clear()
                setDeck(next.deck)
                clearSelections()
                setIndex(0)
              } else {
                setDeck((current) => growDeck(current, Math.max(index, answeredIndexes.at(-1) ?? 0) + 1, pickQuestions(params.ids, size), size))
              }
            }}
          />
        )}
        trailingActions={(
          // カードの見出しが答えになる問い方もあるので、答えるまでは押せない（読み上げの名前にも出さない）。
          <WordBookToggle
            domain="customCards"
            itemId={question.cardId}
            itemLabel={card?.front ?? question.answer}
            disabled={!answered}
            className="disabled:opacity-40"
            {...(answered ? {} : {
              savedLabel: '答えたあとで、このカードを単語帳から外せます',
              unsavedLabel: '答えたあとで、このカードを単語帳に入れられます',
            })}
          />
        )}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <section className="mt-3 rounded-[2rem] bg-white p-5 shadow-card" data-custom-card-quiz-question={question.id}>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-extrabold text-cyan-800">{template.label}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">{categoryTitle(categories, question.category)}</span>
          </div>
          <p className="mt-4 text-[11px] font-extrabold text-cyan-700">{question.ask}</p>
          <p className="mt-1 whitespace-pre-line break-words text-base font-extrabold leading-relaxed text-ink">{question.text}</p>
        </section>

        <div className="mt-4 space-y-2.5">
          {reselectable && <ReselectNote />}
          {choices.map((choice, choiceIndex) => {
            const correct = choice === question.answer
            const chosen = selected === choice
            let tone = 'idle'
            if (answered) {
              if (correct) tone = 'correct'
              else if (chosen) tone = 'wrong'
              else tone = 'dim'
            }
            return (
              <button
                key={choice}
                type="button"
                disabled={answered && !reselectable}
                aria-pressed={answered ? chosen : undefined}
                onClick={() => choose(choice)}
                className={cx(
                  'flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all',
                  tone === 'idle' && 'border-cyan-100 bg-white text-ink active:scale-[0.99] active:bg-cyan-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-900',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-900',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className={cx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold',
                  tone === 'correct' ? 'bg-emerald-500 text-white' : tone === 'wrong' ? 'bg-rose-500 text-white' : 'bg-cyan-100 text-cyan-700',
                )}>
                  {String.fromCharCode(65 + choiceIndex)}
                </span>
                <span className="min-w-0 flex-1 whitespace-pre-line break-words text-base font-extrabold leading-relaxed">{choice}</span>
                {tone === 'correct' && <Check size={19} className="mt-0.5 shrink-0 text-emerald-600" />}
                {tone === 'wrong' && <Close size={17} className="mt-0.5 shrink-0 text-rose-500" />}
              </button>
            )
          })}
          <UnknownChoiceButton
            selected={unknownPick}
            disabled={answered && !reselectable}
            onClick={() => choose(UNKNOWN_CHOICE_ID)}
          />
        </div>

        {answered && (
          <section className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card" data-custom-card-quiz-answer>
            <p className={cx('font-display text-lg font-extrabold', correctPick ? 'text-emerald-600' : 'text-rose-500')}>
              {correctPick ? '正解！' : unknownPick ? '答えを確認しよう' : 'ここを覚え直そう'}
            </p>
            <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2.5">
              <p className="text-[10px] font-extrabold text-emerald-600">{`正解の${answerLabel}`}</p>
              <p className="mt-0.5 whitespace-pre-line text-sm font-extrabold leading-relaxed text-emerald-900">{question.answer}</p>
            </div>
            {/* 出した選択肢それぞれが、どのカードの答えか（そのカードの問いの欄）を並べる。 */}
            <ChoiceExplanations
              title={`選択肢解説（${choices.length}択すべて）`}
              name="custom-cards"
              className="mt-3"
              rows={choices.map((choice) => ({
                id: choice,
                heading: choice,
                body: question.notes[choice],
                correct: choice === question.answer,
                chosen: selected === choice,
              }))}
            />
            {card?.note && (
              <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5" data-custom-card-quiz-note>
                <p className="text-[10px] font-extrabold text-slate-500">{template.fields.find((item) => item.key === 'note')?.label ?? '解説'}</p>
                <p className="mt-0.5 whitespace-pre-line text-sm font-bold leading-relaxed text-ink/70">{card.note}</p>
              </div>
            )}
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-cyan-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {index + 1 >= deck.length ? '結果を見る' : '次の問題へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
