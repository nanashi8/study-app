import { useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  getKotenCulture,
  KOTEN_CULTURE_CATEGORIES,
  KOTEN_CULTURE_LEVELS,
  KOTEN_CULTURE_QUESTION_FORMATS,
  pickKotenCultureQuestions,
} from '../data/koten-culture.js'
import { limitQuizChoices, UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { KotenText } from '../components/KotenFurigana.jsx'
import { Button, Chip, cx } from '../components/ui.jsx'
import { answeredQuizIndexes, growDeck, restartSessionCount } from '../lib/session.js'
import {
  ArrowRight,
  Book,
  Bookmark,
  BookmarkFilled,
  Check,
  Close,
} from '../components/Icons.jsx'
import { buildKotenCultureInstructorExplanation } from '../lib/instructorExplanations.js'
import { SessionCounter, useCarriedAnswers, useSessionSize } from '../components/SessionSize.jsx'
import {
  QuestionSessionControls,
  ReselectNote,
  useAnswerReceipts,
  useIndexedSessionState,
  useRevisitedAnswer,
} from '../components/QuestionSessionControls.jsx'

const ALL_QUESTIONS = 9999 // 在庫数を数えるための十分大きな上限

export function KotenCultureQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const reviewCulture = useStore((state) => state.reviewKotenCulture)
  const reviseReview = useStore((state) => state.reviseReview)
  const savedIds = useStore((state) => state.kotenCultureList)
  const addSaved = useStore((state) => state.addManyToKotenCultureList)
  const recordQuizResult = useStore((state) => state.recordContentQuizResult)

  // 在庫を数えて、選べる問題数の上限を実態に合わせる。
  const [poolSize] = useState(() => pickKotenCultureQuestions(params.ids, { size: ALL_QUESTIONS }).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() =>
    pickKotenCultureQuestions(params.ids, { size: params.size ?? sessionSize }),
  )
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
  // 1回の問題数を減らして数え直す前に答えた問題。結果の全問数に含める。
  const carried = useCarriedAnswers()
  // 答えた問題ごとの記録の控え。前へ戻って選び直したときに入れ替える。
  const receipts = useAnswerReceipts()

  const question = deck[index]
  // 教材は4択だが、出題は「3択＋わからない」にそろえる。
  const choices = question
    ? limitQuizChoices(question.choices, question.answer, { seed: question.id })
    : []
  const relatedCulture = question
    ? question.cultureIds.map(getKotenCulture).filter(Boolean)
    : []
  const primary = relatedCulture[0]
  const category = primary
    ? KOTEN_CULTURE_CATEGORIES.find((item) => item.id === primary.category)
    : null
  const level = question ? KOTEN_CULTURE_LEVELS[question.level] : null
  const format = question ? KOTEN_CULTURE_QUESTION_FORMATS[question.format] : null
  const allSaved = relatedCulture.length > 0
    && relatedCulture.every((item) => savedIds.includes(item.id))

  // コンテンツ画面の「戻る」は履歴でなく、古典常識の内容選択画面へ。
  const backToKotenCulture = () => returnTo('kotenCulture')

  // 前に答えてから戻ってきた問題は、答えを選び直せる。
  const reselectable = useRevisitedAnswer(index, selected !== null)

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🏯</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる古典常識問題がありません</p>
        <Button onClick={backToKotenCulture}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = params.ids) => {
    carried.reset()
    receipts.clear()
    setDeck(pickKotenCultureQuestions(ids, { size: deck.length || sessionSize }))
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

  // 選び直した問題以外で、まだ間違えたままの問題が持つ項目。見直しリストから外してよいかの判断に使う。
  const stillWeakIds = () => new Set(Object.entries(selections)
    .filter(([position, choice]) => (
      Number(position) !== index && choice !== null && choice !== deck[Number(position)]?.answer
    ))
    .flatMap(([position]) => deck[Number(position)]?.cultureIds ?? []))

  const choose = (choice) => {
    if (choice === selected || !primary || (selected !== null && !reselectable)) return
    const result = resultOf(choice)
    // テストの進み具合は「全112問」に対して数えるので、問題そのものの結果も残す。
    recordQuizResult('koten-culture', question.id, result === 'correct' ? 1 : 0, 1)
    if (selected !== null) {
      // 前へ戻って選び直したときは、この問題の最初の答えを置き換える（正解数も記録も二重に数えない）。
      const previous = resultOf(selected)
      receipts.set(index, reviseReview(receipts.get(index), result))
      setCorrectCount((count) => count + (result === 'correct') - (previous === 'correct'))
      setUnknownCount((count) => count + (result === 'unknown') - (previous === 'unknown'))
      if (result === 'correct') {
        const keep = stillWeakIds()
        setWeakIds((ids) => ids.filter((id) => !question.cultureIds.includes(id) || keep.has(id)))
      } else {
        setWeakIds((ids) => [...new Set([...ids, ...question.cultureIds])])
      }
      setSelected(choice)
      return
    }
    setSelected(choice)
    receipts.set(index, reviewCulture(primary.id, result))
    if (result === 'correct') {
      setCorrectCount((count) => count + 1)
      autoAdvanceSequence.current += 1
      setAutoAdvanceSignal(autoAdvanceSequence.current)
    } else {
      if (result === 'unknown') setUnknownCount((count) => count + 1)
      setWeakIds((ids) => [...new Set([...ids, ...question.cultureIds])])
    }
  }

  const next = () => {
    if (index + 1 >= deck.length) setDone(true)
    else {
      setIndex((current) => current + 1)
    }
  }

  if (done) {
    const total = carried.count + deck.length
    const percentage = Math.round((correctCount / total) * 100)
    return (
      <div className="flex h-full flex-col overflow-y-auto p-6 text-center">
        <div className="m-auto flex w-full max-w-sm flex-col items-center gap-5 py-5">
          <div className="text-6xl">{percentage >= 80 ? '🏆' : percentage >= 50 ? '🪭' : '📚'}</div>
          <div>
            <p className="text-xs font-extrabold text-violet-700">古典常識の結果</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">
              {correctCount} / {total} 正解
            </p>
            <p className="mt-1 text-sm font-bold text-ink/50">
              正答率 {percentage}%{unknownCount > 0 && `・わからない ${unknownCount}問`}
            </p>
          </div>

          {weakIds.length > 0 && (
            <button
              onClick={() =>
                navigate('kotenCultureStudy', {
                  ids: weakIds,
                  title: '間違えた古典常識',
                })
              }
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3.5 text-left text-rose-800 transition-transform active:scale-[0.98]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                <Book size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold">間違えた常識を覚え直す</span>
                <span className="block text-[11px] font-bold text-rose-700/65">{weakIds.length}テーマ</span>
              </span>
              <ArrowRight size={18} />
            </button>
          )}

          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => restart(weakIds.length ? weakIds : params.ids)}>
              もう一度
            </Button>
            <Button onClick={backToKotenCulture}>常識へ戻る</Button>
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
        progressColor="#7c3aed"
        progressControl={(
          <SessionCounter
            index={index}
            total={deck.length}
            max={poolSize}
            className="h-11"
            reached={Math.max(index, answeredIndexes.at(-1) ?? 0)}
            onResize={(size, { restart }) => {
              if (restart) {
                // 答えた問題の記録と結果は残したまま、まだ答えていない問題を1問目として数え直す。
                const next = restartSessionCount(deck, answeredIndexes, index, pickKotenCultureQuestions(params.ids, { size: size + deck.length }), size)
                carried.carry(next.answeredItems)
                receipts.clear()
                setDeck(next.deck)
                clearSelections()
                setIndex(0)
              } else {
                setDeck((current) => growDeck(current, Math.max(index, answeredIndexes.at(-1) ?? 0) + 1, pickKotenCultureQuestions(params.ids, { size: size }), size))
              }
            }}
          />
        )}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <section className="mt-3 rounded-[2rem] bg-white p-5 shadow-card">
          <div className="flex flex-wrap gap-2">
            {level && <Chip color={level.color}>{level.label}</Chip>}
            {format && <Chip color={category?.color ?? '#7c3aed'}>{format.emoji} {format.label}</Chip>}
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">
              {question.source}
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-950 to-violet-950 p-4 text-white">
            <p className="font-serif text-lg font-bold leading-[1.9]">
              <KotenText>{question.passage}</KotenText>
            </p>
            {question.target && (
              <p className="mt-2 inline-flex rounded-lg bg-violet-300/15 px-2 py-1 text-xs font-extrabold text-violet-200">
                注目：<KotenText>{question.target}</KotenText>
              </p>
            )}
          </div>

          <p className="mt-4 text-sm font-extrabold leading-relaxed text-ink/75">
            <KotenText>{question.question}</KotenText>
          </p>
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
                disabled={answered && !reselectable}
                aria-pressed={answered ? selected === choice : undefined}
                onClick={() => choose(choice)}
                className={cx(
                  'flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all',
                  tone === 'idle' && 'border-violet-100 bg-white text-ink active:scale-[0.99] active:bg-violet-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-900',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-900',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className={cx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold',
                  tone === 'correct' ? 'bg-emerald-500 text-white' : tone === 'wrong' ? 'bg-rose-500 text-white' : 'bg-violet-100 text-violet-700',
                )}>
                  {String.fromCharCode(65 + choiceIndex)}
                </span>
                <span className="min-w-0 flex-1 text-sm font-bold leading-relaxed">
                  <KotenText>{choice}</KotenText>
                </span>
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
            <div className="flex items-start justify-between gap-3">
              <p className={cx(
                'font-display text-lg font-extrabold',
                correctPick ? 'text-emerald-600' : 'text-rose-500',
              )}>
                {correctPick ? '正解！' : unknownPick ? '答えを確認しよう' : 'ここを覚え直そう'}
              </p>
              <button
                onClick={() => addSaved(question.cultureIds)}
                disabled={allSaved}
                className={cx(
                  'flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-extrabold',
                  allSaved ? 'bg-violet-100 text-violet-700' : 'bg-paper text-ink/50 active:scale-95',
                )}
              >
                {allSaved ? <BookmarkFilled size={15} /> : <Bookmark size={15} />}
                {allSaved ? '登録済み' : '常識を登録'}
              </button>
            </div>

            <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2.5">
              <p className="text-[10px] font-extrabold text-emerald-600">正解</p>
              <p className="mt-0.5 text-sm font-extrabold leading-relaxed text-emerald-900">
                <KotenText>{question.answer}</KotenText>
              </p>
            </div>
            <InstructorExplanation
              explanation={buildKotenCultureInstructorExplanation(
                question,
                selected,
                relatedCulture[0],
              )}
              className="mt-3"
              renderText={(text) => <KotenText>{text}</KotenText>}
            />

            <div className="mt-3 space-y-2">
              {relatedCulture.map((item) => (
                <div key={item.id} className="rounded-xl border border-violet-100 px-3 py-2.5">
                  <p className="text-xs font-extrabold leading-relaxed text-violet-800">
                    <KotenText>{item.title}</KotenText>
                  </p>
                  <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/50">
                    <KotenText>{item.core}</KotenText>
                  </p>
                  <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/40">
                    <KotenText>{item.examTip}</KotenText>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-violet-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {index + 1 >= deck.length ? '結果を見る' : '次の問題へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
