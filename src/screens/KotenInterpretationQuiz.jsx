import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { getKoten } from '../data/koten.js'
import { getKotenGrammar } from '../data/koten-grammar.js'
import {
  getKotenInterpretation,
  KOTEN_INTERPRETATION_FOCUS,
} from '../data/koten-interpretations.js'
import { Button, Chip, cx } from '../components/ui.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { KotenText, KotenWord } from '../components/KotenFurigana.jsx'
import {
  ArrowRight,
  Check,
  Close,
} from '../components/Icons.jsx'
import { answeredQuizIndexes, growDeck, restartSessionCount } from '../lib/session.js'
import { limitQuizChoices, UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { buildKotenInterpretationInstructorExplanation } from '../lib/instructorExplanations.js'
import { SessionCounter, useCarriedAnswers, useSessionSize } from '../components/SessionSize.jsx'
import {
  QuestionSessionControls,
  ReselectNote,
  useAnswerReceipts,
  useIndexedSessionState,
  useRevisitedAnswer,
} from '../components/QuestionSessionControls.jsx'

function shuffle(items) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// size=0 は「絞り込みなし」。
function buildDeck(ids, size = 12, preserveOrder = false) {
  const selected = (ids ?? []).map(getKotenInterpretation).filter(Boolean)
  const items = preserveOrder ? selected : shuffle(selected)
  return size > 0 ? items.slice(0, size) : items
}

export function KotenInterpretationQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const review = useStore((state) => state.reviewKotenInterpretation)
  const reviseReview = useStore((state) => state.reviseReview)

  const [run, setRun] = useState(0)
  const [poolSize] = useState(() => buildDeck(params.ids, 0, params.preserveOrder).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => buildDeck(params.ids, params.size ?? sessionSize, params.preserveOrder))
  const [index, setIndex] = useState(0)
  const {
    value: selected,
    setValue: setSelected,
    clear: clearSelections,
    values: selections,
  } = useIndexedSessionState(index)
  const autoAdvanceSequence = useRef(0)
  const [autoAdvanceSignal, setAutoAdvanceSignal] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  // 1回の問題数を減らして数え直す前に答えた問題。結果の全問数に含める。
  const carried = useCarriedAnswers()
  // 答えた問題ごとの記録の控え。前へ戻って選び直したときに入れ替える。
  const receipts = useAnswerReceipts()

  const item = deck[index]
  // 教材は4択だが、出題は「3択＋わからない」にそろえる。
  const choices = useMemo(
    () => (item ? shuffle(limitQuizChoices(item.choices, item.answer, { seed: item.id })) : []),
    [item?.id, run], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const answered = selected !== null
  const answeredIndexes = answeredQuizIndexes(index, selections)
  const isCorrect = answered && selected === item?.answer

  // 前に答えてから戻ってきた問題は、答えを選び直せる。
  const reselectable = useRevisitedAnswer(index, selected !== null)

  // コンテンツ画面の「戻る」は履歴でなく、短文解釈の内容選択画面へ。
  const backToKotenInterpretationList = () => params.returnTo?.screen
    ? returnTo(params.returnTo.screen, params.returnTo.params ?? {})
    : returnTo('kotenInterpretationList')

  const restart = () => {
    carried.reset()
    receipts.clear()
    const nextRun = run + 1
    setRun(nextRun)
    setDeck(buildDeck(params.ids, deck.length, params.preserveOrder))
    setIndex(0)
    clearSelections()
    setCorrect(0)
    setDone(false)
  }

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📜</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる短文がありません</p>
        <Button onClick={backToKotenInterpretationList}>戻る</Button>
      </div>
    )
  }

  if (done) {
    const total = carried.count + deck.length
    const percent = Math.round((correct / total) * 100)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-6xl">{percent >= 80 ? '🏆' : percent >= 50 ? '👏' : '📚'}</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">
            {correct} / {total} 正解
          </p>
          <p className="mt-1 text-sm font-bold text-ink/55">正答率 {percent}%</p>
        </div>
        <p className="max-w-xs text-sm font-bold leading-relaxed text-ink/55">
          登録した単語と文法は「登録リスト」からいつでも見直せます。
        </p>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Button variant="secondary" onClick={restart}>もう一度</Button>
          <Button onClick={backToKotenInterpretationList}>戻る</Button>
        </div>
      </div>
    )
  }

  const resultOf = (choice) => (
    choice === UNKNOWN_CHOICE_ID ? 'unknown' : choice === item.answer ? 'correct' : 'wrong'
  )

  const choose = (choice) => {
    if (choice === selected || (answered && !reselectable)) return
    const result = resultOf(choice)
    if (answered) {
      // 前へ戻って選び直したときは、この問題の最初の答えを置き換える（正解数も記録も二重に数えない）。
      receipts.set(index, reviseReview(receipts.get(index), result))
      setCorrect((value) => value + (result === 'correct') - (resultOf(selected) === 'correct'))
      setSelected(choice)
      return
    }
    setSelected(choice)
    receipts.set(index, review(item.id, result))
    if (result === 'correct') {
      setCorrect((value) => value + 1)
      autoAdvanceSequence.current += 1
      setAutoAdvanceSignal(autoAdvanceSequence.current)
    }
  }

  const next = () => {
    if (index + 1 >= deck.length) {
      setDone(true)
      return
    }
    setIndex((value) => value + 1)
  }

  const focus = KOTEN_INTERPRETATION_FOCUS[item.focus]
  const words = item.wordIds.map(getKoten).filter(Boolean)
  const grammarItems = item.grammarIds.map(getKotenGrammar).filter(Boolean)

  return (
    <div className="flex h-full flex-col">
      <QuestionSessionControls
        index={index}
        total={deck.length}
        onPrevious={() => setIndex((current) => Math.max(0, current - 1))}
        onNext={next}
        nextDisabled={!answered}
        showAutoAdvance
        autoAdvanceSignal={isCorrect ? autoAdvanceSignal : null}
        itemLabel="短文"
        progressColor="#d97706"
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
                const next = restartSessionCount(deck, answeredIndexes, index, buildDeck(params.ids, size + deck.length, params.preserveOrder), size)
                carried.carry(next.answeredItems)
                receipts.clear()
                setDeck(next.deck)
                setRun((current) => current + 1)
                clearSelections()
                setIndex(0)
              } else {
                setDeck((current) => growDeck(current, Math.max(index, answeredIndexes.at(-1) ?? 0) + 1, buildDeck(params.ids, size, params.preserveOrder), size))
              }
            }}
          />
        )}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-5">
        <div className="rounded-[2rem] bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <Chip color={focus.color}>{focus.emoji} {focus.label}</Chip>
            <span className="text-[11px] font-bold text-ink/40">{item.source}</span>
          </div>
          <p className="mt-4 font-serif text-[1.45rem] font-bold leading-[1.85] tracking-wide text-ink">
            <KotenText
              readings={words.map((word) => [word.word, word.kana])}
            >
              {item.text}
            </KotenText>
          </p>
          <p className="mt-4 rounded-2xl bg-white/75 p-3 text-sm font-extrabold leading-relaxed text-ink/65">
            <KotenText>{item.question}</KotenText>
          </p>
        </div>

        <div className="mt-4 space-y-2.5">
          {reselectable && <ReselectNote />}
          {choices.map((choice) => {
            const correctChoice = choice === item.answer
            const chosen = choice === selected
            let tone = 'idle'
            if (answered) {
              if (correctChoice) tone = 'correct'
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
                  'flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-bold leading-relaxed transition-all',
                  tone === 'idle' && 'border-amber-100 bg-white text-ink active:scale-[0.99] active:bg-amber-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-900',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-900',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/30',
                )}
              >
                <span className="min-w-0 flex-1"><KotenText>{choice}</KotenText></span>
                {tone === 'correct' && <Check size={20} className="mt-0.5 shrink-0 text-emerald-600" />}
                {tone === 'wrong' && <Close size={18} className="mt-0.5 shrink-0 text-rose-500" />}
              </button>
            )
          })}
          <UnknownChoiceButton
            selected={selected === UNKNOWN_CHOICE_ID}
            disabled={answered && !reselectable}
            onClick={() => choose(UNKNOWN_CHOICE_ID)}
          />
        </div>

        {answered && (
          <div className="mt-4 space-y-3 animate-slide-up">
            <div className="rounded-3xl bg-white p-4 shadow-card">
              <p className={cx('font-display text-lg font-extrabold', isCorrect ? 'text-emerald-600' : 'text-rose-500')}>
                {isCorrect ? '正解！' : selected === UNKNOWN_CHOICE_ID ? '答えを確認しよう' : 'ここを確認しよう'}
              </p>
              <p className="mt-2 text-sm font-bold leading-relaxed text-ink">
                <KotenText>{item.translation}</KotenText>
              </p>
              <InstructorExplanation
                explanation={buildKotenInterpretationInstructorExplanation(item, selected)}
                className="mt-3"
                renderText={(text) => <KotenText>{text}</KotenText>}
              />
            </div>

            <div className="rounded-3xl border border-sky-100 bg-sky-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">📖</span>
                <h3 className="font-display font-extrabold text-sky-900">古典単語</h3>
              </div>
              <p className="mb-3 text-sm font-bold leading-relaxed text-sky-950/70">
                <KotenText>{item.vocabTip}</KotenText>
              </p>
              <div className="space-y-2">
                {words.map((word) => (
                  <div key={word.id} className="flex items-center gap-2 rounded-2xl bg-white p-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-extrabold leading-relaxed text-ink">
                        <KotenWord word={word} />
                      </div>
                      <div className="mt-0.5 text-xs font-bold leading-relaxed text-ink/55">
                        <KotenText>{word.meanings.join('・')}</KotenText>
                      </div>
                    </div>
                    <WordBookToggle domain="kotenVocab" itemId={word.id} itemLabel={word.word} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">🧩</span>
                <h3 className="font-display font-extrabold text-amber-900">古典文法</h3>
              </div>
              <p className="mb-3 text-sm font-bold leading-relaxed text-amber-950/70">
                <KotenText>{item.grammarTip}</KotenText>
              </p>
              <div className="space-y-2">
                {grammarItems.map((grammar) => (
                  <div key={grammar.id} className="flex items-center gap-2 rounded-2xl bg-white p-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-sm font-extrabold text-ink">{grammar.title}</div>
                      <div className="mt-0.5 text-xs font-bold text-ink/55">{grammar.meaning}</div>
                    </div>
                    <WordBookToggle domain="kotenGrammar" itemId={grammar.id} itemLabel={grammar.title} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-purple-100 bg-purple-50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏯</span>
                <h3 className="font-display font-extrabold leading-relaxed text-purple-900">
                  <KotenText>{item.culture.title}</KotenText>
                </h3>
              </div>
              <p className="mt-2 text-sm font-bold leading-relaxed text-purple-950/70">
                <KotenText>{item.culture.body}</KotenText>
              </p>
              <button
                onClick={() => navigate('kotenCulture')}
                className="mt-3 flex w-full items-center justify-between rounded-xl bg-white px-3 py-2.5 text-xs font-extrabold text-purple-800"
              >
                古典常識で覚え直す
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-amber-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {index + 1 >= deck.length ? '結果を見る' : '次の短文へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
