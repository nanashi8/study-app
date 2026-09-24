import { useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  MATH_HISTORY_CHAPTERS,
  MATH_HISTORY_QUIZ_DOMAIN,
  mathHistoryChapter,
  mathHistoryThemeColor,
  questionsForChapters,
} from '../data/math-history.js'
import { pickInStudyOrder, rankQuestionsForStudy } from '../lib/studyOrder.js'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { answeredQuizIndexes, growDeck, restartSessionCount } from '../lib/session.js'
import { readableMathAccent } from '../lib/mathVisualColors.js'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { ChoiceExplanations } from '../components/ChoiceExplanations.jsx'
import { MathText } from '../components/MathText.jsx'
import { Button, Chip, cx } from '../components/ui.jsx'
import { ArrowRight, BookOpen, Check, Close } from '../components/Icons.jsx'
import { SessionCounter, useCarriedAnswers, useSessionSize } from '../components/SessionSize.jsx'
import {
  QuestionSessionControls,
  ReselectNote,
  useIndexedSessionState,
  useRevisitedAnswer,
} from '../components/QuestionSessionControls.jsx'

// 数学の歴史の話のテスト。話1つ・部ごと・コース全体のどれからでも開き、
// 問題ごとの結果（contentQuizResults の math-history）から全教材共通の出題順で組む。
// 選択肢は3つ＋「わからない」。並びは問題ごとに毎回入れかえ、答え合わせで3つすべての説明を出す。

const ALL_QUESTIONS = 9999 // 在庫数を数えるための十分大きな上限

const shuffledOrder = (length) => {
  const order = Array.from({ length }, (_, index) => index)
  for (let index = order.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[order[index], order[target]] = [order[target], order[index]]
  }
  return order
}

export function MathStoryQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const recordQuizResult = useStore((state) => state.recordContentQuizResult)
  const chapterIds = Array.isArray(params.chapterIds) && params.chapterIds.length
    ? params.chapterIds
    : MATH_HISTORY_CHAPTERS.map((chapter) => chapter.id)

  // 出題順は、いまの記録から全教材共通の決まりで並べる（lib/studyOrder.js）。
  const pickQuestions = (ids, size) => {
    const state = useStore.getState()
    const ranked = rankQuestionsForStudy(questionsForChapters(ids), {
      quizResults: state.contentQuizResults,
      quizDomain: MATH_HISTORY_QUIZ_DOMAIN,
    })
    return pickInStudyOrder(ranked, size)
  }
  // 在庫を数えて、選べる問題数の上限を実態に合わせる。
  const [poolSize] = useState(() => pickQuestions(chapterIds, ALL_QUESTIONS).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => pickQuestions(chapterIds, params.size ?? sessionSize))
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
  const [missedChapterIds, setMissedChapterIds] = useState([])
  const [done, setDone] = useState(false)
  // 1回の問題数を減らして数え直す前に答えた問題。結果の全問数に含める。
  const carried = useCarriedAnswers()
  // 問題ごとの選択肢の並び。前へ戻ったときは同じ並びで見せ、やり直すと入れかえる。
  const choiceOrders = useRef({})

  const question = deck[index]
  const chapter = question ? mathHistoryChapter(question.chapterId) : null
  const accent = readableMathAccent(mathHistoryThemeColor(chapter?.theme))
  if (question && !choiceOrders.current[question.id]) {
    choiceOrders.current[question.id] = shuffledOrder(question.choices.length)
  }
  const order = question ? choiceOrders.current[question.id] : []

  // 前に答えてから戻ってきた問題は、答えを選び直せる。
  const reselectable = useRevisitedAnswer(index, selected !== null)

  // コンテンツ画面の「戻る」は履歴でなく、開いた画面（話・目次）へ。
  const leave = () => {
    if (params.returnTo?.screen) {
      returnTo(params.returnTo.screen, params.returnTo.params ?? {})
      return
    }
    returnTo('mathHistory')
  }

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧭</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる問題がありません</p>
        <Button onClick={leave}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = chapterIds) => {
    carried.reset()
    choiceOrders.current = {}
    setDeck(pickQuestions(ids, deck.length || sessionSize))
    setIndex(0)
    clearSelections()
    setCorrectCount(0)
    setUnknownCount(0)
    setMissedChapterIds([])
    setDone(false)
  }

  const resultOf = (choice) => (
    choice === UNKNOWN_CHOICE_ID ? 'unknown' : choice === question.answer ? 'correct' : 'wrong'
  )

  // 選び直した問題以外で、まだ間違えたままの問題の話。見直しの一覧から外してよいかの判断に使う。
  const stillMissedChapters = () => new Set(Object.entries(selections)
    .filter(([position, choice]) => (
      Number(position) !== index && choice !== null && choice !== deck[Number(position)]?.answer
    ))
    .map(([position]) => deck[Number(position)]?.chapterId))

  const choose = (choice) => {
    if (choice === selected || (selected !== null && !reselectable)) return
    const result = resultOf(choice)
    // テストの進み具合は問題ごとに数えるので、問題そのものの結果を残す（選び直したら置き換わる）。
    recordQuizResult(MATH_HISTORY_QUIZ_DOMAIN, question.id, result === 'correct' ? 1 : 0, 1)
    if (selected !== null) {
      // 前へ戻って選び直したときは、この問題の最初の答えを置き換える（正解数を二重に数えない）。
      const previous = resultOf(selected)
      setCorrectCount((count) => count + (result === 'correct') - (previous === 'correct'))
      setUnknownCount((count) => count + (result === 'unknown') - (previous === 'unknown'))
      if (result === 'correct') {
        const keep = stillMissedChapters()
        setMissedChapterIds((ids) => ids.filter((id) => id !== question.chapterId || keep.has(id)))
      } else {
        setMissedChapterIds((ids) => [...new Set([...ids, question.chapterId])])
      }
      setSelected(choice)
      return
    }
    setSelected(choice)
    if (result === 'correct') {
      setCorrectCount((count) => count + 1)
      autoAdvanceSequence.current += 1
      setAutoAdvanceSignal(autoAdvanceSequence.current)
    } else {
      if (result === 'unknown') setUnknownCount((count) => count + 1)
      setMissedChapterIds((ids) => [...new Set([...ids, question.chapterId])])
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
    const missedChapters = missedChapterIds.map(mathHistoryChapter).filter(Boolean)
    return (
      <div className="flex h-full flex-col overflow-y-auto p-6 text-center">
        <div className="m-auto flex w-full max-w-sm flex-col items-center gap-5 py-5">
          <div className="text-6xl">{percentage >= 80 ? '🏆' : percentage >= 50 ? '🧭' : '📚'}</div>
          <div>
            <p className="text-xs font-extrabold text-violet-700">{params.title ?? '数学の歴史'}の結果</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">
              {correctCount} / {total} 正解
            </p>
            <p className="mt-1 text-sm font-bold text-ink/50">
              正答率 {percentage}%{unknownCount > 0 && `・わからない ${unknownCount}問`}
            </p>
          </div>

          {missedChapters.length > 0 && (
            <section className="w-full space-y-2 text-left" data-math-history-missed>
              <p className="px-1 text-xs font-extrabold text-rose-700">間違えた問題の話を読み直す</p>
              {missedChapters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate('mathStory', { chapterId: item.id })}
                  className="flex w-full items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3 text-left text-rose-800 transition-transform active:scale-[0.98]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-xl">{item.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold">{item.title}</span>
                    <span className="block text-[11px] font-bold text-rose-700/75">{item.headline}</span>
                  </span>
                  <BookOpen size={18} />
                </button>
              ))}
            </section>
          )}

          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => restart(missedChapterIds.length ? missedChapterIds : chapterIds)}>
              もう一度
            </Button>
            <Button onClick={leave}>戻る</Button>
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
        progressColor={accent}
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
                const next = restartSessionCount(deck, answeredIndexes, index, pickQuestions(chapterIds, size + deck.length), size)
                carried.carry(next.answeredItems)
                setDeck(next.deck)
                clearSelections()
                setIndex(0)
              } else {
                setDeck((current) => growDeck(current, Math.max(index, answeredIndexes.at(-1) ?? 0) + 1, pickQuestions(chapterIds, size), size))
              }
            }}
          />
        )}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <section className="mt-3 rounded-[2rem] bg-white p-5 shadow-card" data-math-history-question={question.id}>
          {chapter && (
            <div className="flex flex-wrap items-center gap-2">
              <Chip color={accent}>{`${chapter.emoji} ${chapter.title}`}</Chip>
              <span className="text-[11px] font-extrabold text-ink/45">{chapter.era}</span>
            </div>
          )}
          <p className="mt-4 text-[15px] font-extrabold leading-relaxed text-ink">
            <MathText>{question.question}</MathText>
          </p>
        </section>

        <div className="mt-4 space-y-2.5">
          {reselectable && <ReselectNote />}
          {order.map((choiceIndex, position) => {
            const choice = question.choices[choiceIndex]
            const correct = choiceIndex === question.answer
            const chosen = selected === choiceIndex
            let tone = 'idle'
            if (answered) {
              if (correct) tone = 'correct'
              else if (chosen) tone = 'wrong'
              else tone = 'dim'
            }
            return (
              <button
                key={choiceIndex}
                disabled={answered && !reselectable}
                aria-pressed={answered ? chosen : undefined}
                onClick={() => choose(choiceIndex)}
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
                  {String.fromCharCode(65 + position)}
                </span>
                <span className="min-w-0 flex-1 text-sm font-bold leading-relaxed">
                  <MathText>{choice}</MathText>
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
            <p className={cx(
              'font-display text-lg font-extrabold',
              correctPick ? 'text-emerald-600' : 'text-rose-500',
            )}>
              {correctPick ? '正解！' : unknownPick ? '答えを確かめよう' : 'ここを読み直そう'}
            </p>

            <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2.5">
              <p className="text-[10px] font-extrabold text-emerald-600">正解</p>
              <p className="mt-0.5 text-sm font-extrabold leading-relaxed text-emerald-900">
                <MathText>{question.choices[question.answer]}</MathText>
              </p>
            </div>
            {/* この問題固有の説明と、出題した選択肢1つずつの説明を出す。 */}
            <div className="mt-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-violet-100" data-math-history-explanation>
              <p className="text-[10px] font-extrabold text-violet-700">解説</p>
              <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/75">
                <MathText>{question.explanation}</MathText>
              </p>
            </div>
            <ChoiceExplanations
              title="選択肢解説（3択すべて）"
              name="mathHistory"
              className="mt-3"
              renderText={(text) => <MathText>{text}</MathText>}
              rows={order.map((choiceIndex) => ({
                id: String(choiceIndex),
                heading: question.choices[choiceIndex],
                body: question.notes[choiceIndex],
                correct: choiceIndex === question.answer,
                chosen: selected === choiceIndex,
              }))}
            />
            {chapter && (
              <button
                type="button"
                onClick={() => navigate('mathStory', { chapterId: chapter.id })}
                className="mt-3 flex w-full items-center gap-2 rounded-xl border border-violet-100 px-3 py-2.5 text-left active:bg-violet-50"
              >
                <BookOpen size={16} className="shrink-0 text-violet-600" />
                <span className="min-w-0 flex-1 text-xs font-extrabold text-violet-800">{`話「${chapter.title}」を読む`}</span>
                <ArrowRight size={15} className="shrink-0 text-violet-500" />
              </button>
            )}
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
