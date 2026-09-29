import { useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { SUBJECTS, bookMeta, getSubjectUnit, pickSubjectTermQuestions } from '../data/subjects/index.js'
import { limitQuizChoices, UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { ChoiceExplanations } from '../components/ChoiceExplanations.jsx'
import { SubjectText } from '../components/SubjectText.jsx'
import { Button, Chip, cx } from '../components/ui.jsx'
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

// 社会・理科の語句テスト。意味を読んで語句を選ぶ（教材は4択、出題は3択＋わからない）。
// 答え合わせでは、出した選択肢それぞれの語句の意味を並べる。
const ALL_QUESTIONS = 9999 // 在庫数を数えるための十分大きな上限

function SubjectQuizScreen({ subject }) {
  const meta = SUBJECTS[subject]
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const reviewTerm = useStore((state) => state.reviewSubjectTerm)
  const reviseReview = useStore((state) => state.reviseReview)
  const recordQuizResult = useStore((state) => state.recordContentQuizResult)

  const pickQuestions = (ids, size) => {
    const state = useStore.getState()
    return pickSubjectTermQuestions(ids, {
      subject,
      size,
      srs: state[meta.termSrsField],
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
  const unit = question ? getSubjectUnit(question.unitId) : null
  const book = unit ? bookMeta(subject, unit.book) : null
  const reselectable = useRevisitedAnswer(index, selected !== null)

  const leave = () => (params.returnTo?.screen
    ? returnTo(params.returnTo.screen, params.returnTo.params ?? {})
    : returnTo(meta.screens.home))

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
        <div className="text-5xl">{meta.emoji}</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる語句がありません</p>
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
    recordQuizResult(meta.termDomain, question.termId, result === 'correct' ? 1 : 0, 1)
    if (selected !== null) {
      const previous = resultOf(selected)
      receipts.set(index, reviseReview(receipts.get(index), result))
      setCorrectCount((count) => count + (result === 'correct') - (previous === 'correct'))
      setUnknownCount((count) => count + (result === 'unknown') - (previous === 'unknown'))
      setWeakIds((ids) => (result === 'correct'
        ? ids.filter((id) => id !== question.termId)
        : [...new Set([...ids, question.termId])]))
      setSelected(choice)
      return
    }
    setSelected(choice)
    receipts.set(index, reviewTerm(subject, question.termId, result))
    if (result === 'correct') {
      setCorrectCount((count) => count + 1)
      autoAdvanceSequence.current += 1
      setAutoAdvanceSignal(autoAdvanceSequence.current)
    } else {
      if (result === 'unknown') setUnknownCount((count) => count + 1)
      setWeakIds((ids) => [...new Set([...ids, question.termId])])
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
      <div className="flex h-full flex-col overflow-y-auto p-6 text-center" data-subject-quiz-result>
        <div className="m-auto flex w-full max-w-sm flex-col items-center gap-5 py-5">
          <div className="text-6xl">{percentage >= 80 ? '🏆' : percentage >= 50 ? '✨' : '📚'}</div>
          <div>
            <p className="text-xs font-extrabold text-emerald-700"><SubjectText>{`${params.title ?? `${meta.label}の語句テスト`}の結果`}</SubjectText></p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">{`${correctCount} / ${total} 正解`}</p>
            <p className="mt-1 text-sm font-bold text-ink/50">
              正答率 {percentage}%{unknownCount > 0 && `・わからない ${unknownCount}問`}
            </p>
          </div>

          {weakIds.length > 0 && (
            <button
              type="button"
              onClick={() => navigate(meta.screens.study, { ids: weakIds, title: '間違えた語句', preserveOrder: true, returnTo: params.returnTo })}
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3.5 text-left text-rose-800 transition-transform active:scale-[0.98]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                <Book size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold">間違えた語句を暗記し直す</span>
                <span className="block text-[11px] font-bold text-rose-700/65">{`${weakIds.length}語句`}</span>
              </span>
              <ArrowRight size={18} />
            </button>
          )}

          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => restart(weakIds.length ? weakIds : params.ids)}>
              もう一度
            </Button>
            <Button onClick={leave}>{`${meta.label}へ戻る`}</Button>
          </div>
        </div>
      </div>
    )
  }

  const answered = selected !== null
  const answeredIndexes = answeredQuizIndexes(index, selections)
  const correctPick = selected === question.answer
  const unknownPick = selected === UNKNOWN_CHOICE_ID

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
        progressColor={meta.color}
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
          // 語句の名前は答えそのものなので、答えるまでは押せない（読み上げの名前にも出さない）。
          <WordBookToggle
            domain={meta.notebookTerms}
            itemId={question.termId}
            itemLabel={question.answer}
            disabled={!answered}
            className="disabled:opacity-40"
            {...(answered ? {} : {
              savedLabel: '答えたあとで、この語句を単語帳から外せます',
              unsavedLabel: '答えたあとで、この語句を単語帳に入れられます',
            })}
          />
        )}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <section className="mt-3 rounded-[2rem] bg-white p-5 shadow-card" data-subject-quiz-question={question.id}>
          <div className="flex flex-wrap gap-2">
            {book && <Chip color={book.color}>{`${book.emoji} ${book.label}`}</Chip>}
            {unit && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500"><SubjectText>{unit.title}</SubjectText></span>}
          </div>
          <p className="mt-4 text-[11px] font-extrabold text-emerald-700">この説明にあてはまる語句は？</p>
          <p className="mt-1 text-base font-extrabold leading-relaxed text-ink"><SubjectText>{question.text}</SubjectText></p>
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
                  tone === 'idle' && 'border-emerald-100 bg-white text-ink active:scale-[0.99] active:bg-emerald-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-900',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-900',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className={cx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold',
                  tone === 'correct' ? 'bg-emerald-500 text-white' : tone === 'wrong' ? 'bg-rose-500 text-white' : 'bg-emerald-100 text-emerald-700',
                )}>
                  {String.fromCharCode(65 + choiceIndex)}
                </span>
                <span className="min-w-0 flex-1 text-base font-extrabold leading-relaxed"><SubjectText>{choice}</SubjectText></span>
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
          <section className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <p className={cx('font-display text-lg font-extrabold', correctPick ? 'text-emerald-600' : 'text-rose-500')}>
              {correctPick ? '正解！' : unknownPick ? '答えを確認しよう' : 'ここを覚え直そう'}
            </p>
            <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2.5">
              <p className="text-[10px] font-extrabold text-emerald-600">正解</p>
              <p className="mt-0.5 text-sm font-extrabold leading-relaxed text-emerald-900"><SubjectText>{question.answer}</SubjectText></p>
            </div>
            {/* 出した選択肢それぞれが、どの説明の語句かを並べる。 */}
            <ChoiceExplanations
              title="選択肢解説（3択すべて）"
              name={`${subject}-terms`}
              className="mt-3"
              renderText={(text) => <SubjectText>{text}</SubjectText>}
              rows={choices.map((choice) => ({
                id: choice,
                heading: choice,
                body: question.notes[choice],
                correct: choice === question.answer,
                chosen: selected === choice,
              }))}
            />
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-emerald-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {index + 1 >= deck.length ? '結果を見る' : '次の問題へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}

export function SocialQuizScreen() {
  return <SubjectQuizScreen subject="social" />
}

export function ScienceQuizScreen() {
  return <SubjectQuizScreen subject="science" />
}
