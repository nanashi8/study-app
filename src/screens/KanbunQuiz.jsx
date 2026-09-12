import { useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { kanbunNotebookDomain } from '../lib/wordBookLaunch.js'
import {
  KANBUN_COLLECTIONS,
  getKanbunItem,
  kanbunDomainMeta,
  pickKanbunQuestions,
} from '../data/kanbun-content.js'
import { KANBUN_LEVEL_BY_ID } from '../data/kanbun-meta.js'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { KanbunText } from '../components/KanbunFurigana.jsx'
import { Button, Chip, cx } from '../components/ui.jsx'
import { SessionCounter, useCarriedAnswers, useSessionSize } from '../components/SessionSize.jsx'
import { answeredQuizIndexes, growDeck, restartSessionCount } from '../lib/session.js'
import {
  QuestionSessionControls,
  ReselectNote,
  useAnswerReceipts,
  useIndexedSessionState,
  useRevisitedAnswer,
} from '../components/QuestionSessionControls.jsx'
import {
  ArrowRight,
  Book,
  Check,
  Close,
  Lightbulb,
} from '../components/Icons.jsx'

const ALL_QUESTIONS = 9999 // 在庫数を数えるための十分大きな上限

function ChoiceExplanation({ question, selected }) {
  const selectedItemId = selected?.split(':')[1]
  const selectedItem = selectedItemId ? getKanbunItem(question.domain, selectedItemId) : null
  const unknown = selected === UNKNOWN_CHOICE_ID
  const correct = selected === question.answerId
  return (
    <div className="mt-3 space-y-2.5">
      <div className="rounded-xl bg-emerald-50 p-3">
        <p className="text-[10px] font-extrabold text-emerald-700">正解と決め手</p>
        <p className="mt-1 text-sm font-extrabold leading-relaxed text-emerald-950">{question.answer}</p>
        <p className="mt-1 text-xs font-bold leading-relaxed text-emerald-900/70">{question.clue}</p>
      </div>
      {!correct && (
        <div className="rounded-xl bg-rose-50 p-3">
          <p className="text-[10px] font-extrabold text-rose-700">{unknown ? 'わからないときの考え方' : 'その答えが違う理由'}</p>
          <p className="mt-1 text-xs font-bold leading-relaxed text-rose-950/70">
            {unknown
              ? `まず「${question.clue}」を探し、形・主語・くらべる相手のどれを聞かれているかを一つに決める。`
              : `「${selectedItem?.answer ?? 'その選択肢'}」は「${selectedItem?.title ?? '別項目'}」の説明。ここでは「${getKanbunItem(question.domain, question.itemId)?.title}」に固有の手掛かりと一致しない。`}
          </p>
        </div>
      )}
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-[10px] font-extrabold text-slate-500">次に出たときの見分け方</p>
        <p className="mt-1 text-xs font-bold leading-relaxed text-ink/65">{question.detail}</p>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p className="text-[10px] font-extrabold text-amber-700">まちがえやすい点</p>
        <p className="mt-1 text-xs font-bold leading-relaxed text-amber-950/70">{question.pitfall}</p>
      </div>
    </div>
  )
}

export function KanbunQuizScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const review = useStore((state) => state.reviewKanbun)
  const reviseReview = useStore((state) => state.reviseReview)
  const domain = KANBUN_COLLECTIONS[params.domain] ? params.domain : 'vocab'
  const meta = kanbunDomainMeta(domain)
  const [poolSize] = useState(() => pickKanbunQuestions(domain, params.ids, { size: ALL_QUESTIONS }).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => pickKanbunQuestions(domain, params.ids, { size: params.size ?? sessionSize }))
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
  const item = question ? getKanbunItem(domain, question.itemId) : null

  // コンテンツ画面の「戻る」は履歴でなく、この分野の内容選択画面へ。
  const backToKanbunCatalog = () => returnTo('kanbunCatalog', { domain })

  // 前に答えてから戻ってきた問題は、答えを選び直せる。
  const reselectable = useRevisitedAnswer(index, selected !== null)

  if (!question || !item) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📝</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる問題がありません</p>
        <Button onClick={backToKanbunCatalog}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = params.ids) => {
    carried.reset()
    receipts.clear()
    setDeck(pickKanbunQuestions(domain, ids, { size: deck.length || sessionSize }))
    setIndex(0)
    clearSelections()
    setCorrectCount(0)
    setUnknownCount(0)
    setWeakIds([])
    setDone(false)
  }

  const resultOf = (choiceId) => (
    choiceId === question.answerId ? 'correct' : choiceId === UNKNOWN_CHOICE_ID ? 'unknown' : 'wrong'
  )

  // 選び直した問題以外で、まだ間違えたままの問題の項目。見直しリストから外してよいかの判断に使う。
  const stillWeakIds = () => new Set(Object.entries(selections)
    .filter(([position, choiceId]) => (
      Number(position) !== index && choiceId !== null && choiceId !== deck[Number(position)]?.answerId
    ))
    .map(([position]) => deck[Number(position)]?.itemId))

  const choose = (choiceId) => {
    if (choiceId === selected || (selected !== null && !reselectable)) return
    const result = resultOf(choiceId)
    if (selected !== null) {
      // 前へ戻って選び直したときは、この問題の最初の答えを置き換える（正解数も記録も二重に数えない）。
      const previous = resultOf(selected)
      receipts.set(index, reviseReview(receipts.get(index), result))
      setCorrectCount((count) => count + (result === 'correct') - (previous === 'correct'))
      setUnknownCount((count) => count + (result === 'unknown') - (previous === 'unknown'))
      if (result === 'correct') {
        if (!stillWeakIds().has(question.itemId)) {
          setWeakIds((ids) => ids.filter((id) => id !== question.itemId))
        }
      } else {
        setWeakIds((ids) => [...new Set([...ids, question.itemId])])
      }
      setSelected(choiceId)
      return
    }
    setSelected(choiceId)
    receipts.set(index, review(domain, question.itemId, result))
    if (result === 'correct') {
      setCorrectCount((count) => count + 1)
      autoAdvanceSequence.current += 1
      setAutoAdvanceSignal(autoAdvanceSequence.current)
    } else {
      setWeakIds((ids) => [...new Set([...ids, question.itemId])])
      if (result === 'unknown') setUnknownCount((count) => count + 1)
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
          <div className="text-6xl">{percentage >= 80 ? '🏆' : percentage >= 50 ? '📕' : '🧭'}</div>
          <div>
            <p className="text-xs font-extrabold text-rose-700">{meta.label}の結果</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">{correctCount} / {total} 正解</p>
            <p className="mt-1 text-sm font-bold text-ink/50">正答率 {percentage}%{unknownCount ? `・わからない ${unknownCount}問` : ''}</p>
          </div>
          {weakIds.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('kanbunStudy', { domain, ids: weakIds, title: `間違えた${meta.label}` })}
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3.5 text-left text-rose-900"
            >
              <Book size={20} />
              <span className="min-w-0 flex-1 text-sm font-extrabold">間違えた {weakIds.length}{meta.itemLabel}を覚え直す</span>
              <ArrowRight size={18} />
            </button>
          )}
          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => restart(weakIds.length ? weakIds : params.ids)}>もう一度</Button>
            <Button onClick={backToKanbunCatalog}>{meta.label}へ戻る</Button>
          </div>
        </div>
      </div>
    )
  }

  const answered = selected !== null
  const answeredIndexes = answeredQuizIndexes(index, selections)
  const correctPick = selected === question.answerId
  const level = KANBUN_LEVEL_BY_ID[item.level]

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
        progressColor="#be123c"
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
                const next = restartSessionCount(deck, answeredIndexes, index, pickKanbunQuestions(domain, params.ids, { size: size + deck.length }), size)
                carried.carry(next.answeredItems)
                receipts.clear()
                setDeck(next.deck)
                clearSelections()
                setIndex(0)
              } else {
                setDeck((current) => growDeck(current, Math.max(index, answeredIndexes.at(-1) ?? 0) + 1, pickKanbunQuestions(domain, params.ids, { size: size }), size))
              }
            }}
          />
        )}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <section className="mt-3 rounded-[2rem] bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Chip color={level?.color}>{level?.label}</Chip>
              <Chip color={meta.color}>{meta.label}</Chip>
            </div>
            <WordBookToggle domain={kanbunNotebookDomain(domain)} itemId={item.id} itemLabel={item.title} />
          </div>

          {question.passage && (
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-950 to-rose-950 p-4 text-white">
              <p className="font-serif text-lg font-bold leading-[1.9]">{question.passage}</p>
              {question.kakikudashi && <p className="mt-2 text-xs font-bold leading-relaxed text-white/60"><KanbunText>{question.kakikudashi}</KanbunText></p>}
            </div>
          )}
          <p className="mt-4 text-sm font-extrabold leading-relaxed text-ink/75">{question.prompt}</p>
        </section>

        <div className="mt-4 space-y-2.5">
          {reselectable && <ReselectNote />}
          {question.choices.map((choice, choiceIndex) => {
            const isCorrect = choice.id === question.answerId
            const isSelected = selected === choice.id
            let tone = 'idle'
            if (answered) {
              if (isCorrect) tone = 'correct'
              else if (isSelected) tone = 'wrong'
              else tone = 'dim'
            }
            return (
              <button
                type="button"
                key={choice.id}
                disabled={answered && !reselectable}
                aria-pressed={answered ? selected === choice.id : undefined}
                onClick={() => choose(choice.id)}
                className={cx(
                  'flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all',
                  tone === 'idle' && 'border-rose-100 bg-white text-ink active:scale-[0.99] active:bg-rose-50',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-950',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-950',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className={cx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold',
                  tone === 'correct' ? 'bg-emerald-500 text-white' : tone === 'wrong' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800',
                )}>
                  {String.fromCharCode(65 + choiceIndex)}
                </span>
                <span className="min-w-0 flex-1 text-sm font-bold leading-relaxed">{choice.label}</span>
                {tone === 'correct' && <Check size={19} className="mt-0.5 shrink-0 text-emerald-600" />}
                {tone === 'wrong' && <Close size={17} className="mt-0.5 shrink-0 text-rose-500" />}
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
          <section className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-center gap-2">
              <Lightbulb size={19} className={correctPick ? 'text-emerald-600' : 'text-rose-600'} />
              <p className={cx('font-display text-lg font-extrabold', correctPick ? 'text-emerald-700' : 'text-rose-700')}>
                {correctPick ? '正解の理由を確認しよう' : selected === UNKNOWN_CHOICE_ID ? '答えと手掛かりを確認' : 'この違いを覚え直そう'}
              </p>
            </div>
            <ChoiceExplanation question={question} selected={selected} />
            {question.translation && (
              <div className="mt-3 rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-extrabold text-slate-500">現代語訳</p>
                <p className="mt-1 text-xs font-bold leading-relaxed text-ink/60">{question.translation}</p>
              </div>
            )}
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-rose-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {index + 1 >= deck.length ? '結果を見る' : '次の問題へ'}
        </Button>
      </div>
    </div>
  )
}
