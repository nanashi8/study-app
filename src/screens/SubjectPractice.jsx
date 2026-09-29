import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  PRACTICE_KINDS,
  PRACTICE_LEVELS,
  SUBJECTS,
  bookMeta,
  getSubjectQuestion,
  getSubjectUnit,
  pickSubjectPractice,
  practicePool,
  seededShuffle,
} from '../data/subjects/index.js'
import {
  SUBJECT_PRACTICE_RESULTS,
  checkSubjectPractice,
  formatNumberAnswer,
  latestSubjectPractice,
  pressNumberKey,
} from '../lib/subjectPractice.js'
import { limitQuizChoices, UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { answeredQuizIndexes, growDeck, restartSessionCount } from '../lib/session.js'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { ChoiceExplanations } from '../components/ChoiceExplanations.jsx'
import { SubjectFigure } from '../components/SubjectFigure.jsx'
import { SubjectText } from '../components/SubjectText.jsx'
import { WordBookToggle } from '../components/WordListSheet.jsx'
import { Button, Chip, cx } from '../components/ui.jsx'
import { ArrowRight, BookOpen, Check, Close, Refresh } from '../components/Icons.jsx'
import { SessionCounter, useCarriedAnswers, useSessionSize } from '../components/SessionSize.jsx'
import { StudyMixEmptyNotice, currentStudyMixShare, useStudyMixRebuild } from '../components/StudyMix.jsx'
import { QuestionSessionControls, useIndexedSessionState } from '../components/QuestionSessionControls.jsx'

// 社会・理科の演習。選ぶ（3択＋わからない）・数を入れる（数字キー）・並べる（順に押す）の3つの形。
// 開き方：1つの単元（unitId、段階 level）・冊（bookId、mixed で単元を混ぜる）・選んだ問題（ids）。
// 出題の順は、問題ごとの結果（contentQuizResults の social-practice / science-practice）から全教材共通の決まりで組む。
// 答え合わせのあとは、正解・この問題の解説・出した選択肢すべての説明（計算は解き方、並べる問題は順の理由）を見せる。

const ALL_QUESTIONS = 9999 // 在庫数を数えるための十分大きな上限

const NUMBER_KEYS = Object.freeze(['7', '8', '9', '4', '5', '6', '1', '2', '3', 'minus', '0', '.'])
const KEY_LABELS = Object.freeze({ minus: '−', '.': '．' })

function NumberPad({ value, onChange, unit }) {
  return (
    <div className="space-y-2" data-subject-number-pad>
      <div className="flex min-h-12 items-center justify-end gap-1 rounded-2xl bg-white px-4 py-2 ring-2 ring-emerald-300" aria-live="polite">
        <span className="font-display text-2xl font-extrabold tabular-nums text-ink" data-subject-number-value>
          {value || <span className="text-ink/25">数を入れる</span>}
        </span>
        {unit && <span className="text-sm font-extrabold text-ink/55">{unit}</span>}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <div className="col-span-3 grid grid-cols-3 gap-1.5">
          {NUMBER_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange(pressNumberKey(value, key))}
              className="min-h-11 rounded-xl bg-white font-display text-lg font-extrabold text-ink shadow-sm active:bg-emerald-50"
              aria-label={key === 'minus' ? '符号を入れかえる' : key === '.' ? '小数点' : key}
              data-subject-number-key={key}
            >
              {KEY_LABELS[key] ?? key}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange(pressNumberKey(value, 'back'))}
          className="min-h-11 rounded-xl bg-slate-100 text-sm font-extrabold text-ink/70 active:bg-slate-200"
          aria-label="1字消す"
          data-subject-number-key="back"
        >
          ⌫
        </button>
      </div>
    </div>
  )
}

function OrderBoard({ question, order, onChange, disabled }) {
  const shuffled = useMemo(() => seededShuffle(question.items, question.id), [question])
  const remaining = shuffled.filter((item) => !order.includes(item))
  return (
    <div className="space-y-3" data-subject-order-board>
      <ol className="space-y-1.5" aria-label="並べた順">
        {question.items.map((_, position) => {
          const item = order[position]
          return (
            <li key={position}>
              <button
                type="button"
                disabled={disabled || !item}
                onClick={() => onChange(order.filter((entry) => entry !== item))}
                className={cx(
                  'flex min-h-11 w-full items-center gap-2 rounded-xl border-2 px-3 py-2 text-left text-sm font-bold leading-relaxed',
                  item ? 'border-emerald-300 bg-white text-ink' : 'border-dashed border-slate-300 bg-paper text-ink/30',
                )}
                aria-label={item ? `${position + 1}番目：${item}（押すと外す）` : `${position + 1}番目は空き`}
                data-subject-order-slot={position + 1}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-800">
                  {position + 1}
                </span>
                <span className="min-w-0 flex-1">{item ? <SubjectText>{item}</SubjectText> : '下から選ぶ'}</span>
              </button>
            </li>
          )
        })}
      </ol>
      {remaining.length > 0 && (
        <div className="space-y-1.5" aria-label="並べるもの">
          {remaining.map((item) => (
            <button
              key={item}
              type="button"
              disabled={disabled}
              onClick={() => onChange([...order, item])}
              className="flex min-h-11 w-full items-center rounded-xl bg-white px-3 py-2 text-left text-sm font-bold leading-relaxed text-ink shadow-sm active:bg-emerald-50"
              data-subject-order-item={item}
            >
              <SubjectText>{item}</SubjectText>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SubjectPracticeScreen({ subject }) {
  const meta = SUBJECTS[subject]
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const practiceLog = useStore((state) => state[meta.practiceLogField])
  const recordPractice = useStore((state) => state.recordSubjectPractice)
  const mixed = Boolean(params.mixed)
  const pool = useMemo(() => practicePool({
    subject,
    unitId: params.unitId ?? null,
    bookId: params.bookId ?? null,
    level: params.level ?? 'all',
    ids: params.ids ?? null,
  }), [subject, params])

  const pickQuestions = (size) => {
    if (params.preserveOrder) return size > 0 ? pool.slice(0, size) : pool
    const state = useStore.getState()
    return pickSubjectPractice(pool, {
      subject,
      quizResults: state.contentQuizResults,
      size,
      freshShare: currentStudyMixShare(),
      mixed,
    })
  }
  const [poolSize] = useState(() => pickQuestions(ALL_QUESTIONS).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => pickQuestions(params.size ?? sessionSize))
  const [index, setIndex] = useState(0)
  // 答え合わせした問題の記録（位置ごと）。前へ戻っても、その問題の答えと結果を見せる。
  const {
    value: record,
    setValue: setRecord,
    clear: clearRecords,
    values: records,
  } = useIndexedSessionState(index)
  // 答え合わせ前の入力（位置ごと）：数を入れる問題の文字列・並べる問題の順。
  const [drafts, setDrafts] = useState({})
  const startedAt = useRef({})
  const [tally, setTally] = useState({ correct: 0, wrong: 0, unknown: 0 })
  const [missedIds, setMissedIds] = useState([])
  const [done, setDone] = useState(false)
  const carried = useCarriedAnswers()

  const question = deck[index] ?? null
  const unit = question ? getSubjectUnit(question.unitId) : null
  const book = unit ? bookMeta(subject, unit.book) : null

  useEffect(() => {
    if (question && startedAt.current[index] === undefined) startedAt.current[index] = Date.now()
  }, [index, question])

  useStudyMixRebuild({
    index,
    answeredIndexes: answeredQuizIndexes(index, records),
    fixedOrder: Boolean(params.preserveOrder),
    rebuild: (keepCount) => {
      const size = params.size ?? sessionSize
      setDeck((current) => growDeck(current, current.length ? keepCount : 0, pickQuestions(ALL_QUESTIONS), Math.max(size, keepCount)))
    },
  })

  const leave = () => (params.returnTo?.screen
    ? returnTo(params.returnTo.screen, params.returnTo.params ?? {})
    : returnTo(meta.screens.home))

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">{meta.emoji}</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる問題がありません</p>
        <StudyMixEmptyNotice />
        <Button onClick={leave}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = null) => {
    carried.reset()
    const nextPool = ids?.length ? ids.map(getSubjectQuestion).filter(Boolean) : null
    setDeck(nextPool ?? pickQuestions(deck.length || sessionSize))
    setIndex(0)
    clearRecords()
    setDrafts({})
    startedAt.current = {}
    setTally({ correct: 0, wrong: 0, unknown: 0 })
    setMissedIds([])
    setDone(false)
  }

  const draft = drafts[index] ?? (question.kind === 'order' ? [] : '')
  const setDraft = (value) => setDrafts((current) => ({ ...current, [index]: value }))

  const finish = (response) => {
    if (record) return
    const unknown = response === UNKNOWN_CHOICE_ID
    const checked = unknown ? { filled: true, correct: false } : checkSubjectPractice(question, response)
    if (!checked.filled) return
    const result = unknown ? 'unknown' : checked.correct ? 'correct' : 'wrong'
    const seconds = Math.max(1, Math.round((Date.now() - (startedAt.current[index] ?? Date.now())) / 1000))
    recordPractice(subject, question.id, result, seconds)
    setRecord({ result, response })
    setTally((current) => ({ ...current, [result]: current[result] + 1 }))
    if (result !== 'correct') setMissedIds((ids) => [...new Set([...ids, question.id])])
  }

  const next = () => {
    if (index + 1 >= deck.length) setDone(true)
    else setIndex((current) => current + 1)
  }

  if (done) {
    const total = carried.count + deck.length
    const missedUnits = [...new Set(missedIds.map((id) => getSubjectQuestion(id)?.unitId))]
      .map(getSubjectUnit)
      .filter(Boolean)
    return (
      <div className="flex h-full flex-col overflow-y-auto p-6 text-center" data-subject-practice-result>
        <div className="m-auto flex w-full max-w-sm flex-col items-center gap-5 py-5">
          <div className="text-6xl">{tally.correct === total ? '🏆' : tally.correct * 2 >= total ? '✨' : '📚'}</div>
          <div>
            <p className="text-xs font-extrabold text-emerald-700"><SubjectText>{`${params.title ?? `${meta.label}の演習`}の結果`}</SubjectText></p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">{`${tally.correct} / ${total}問 正解`}</p>
          </div>
          <div className="grid w-full grid-cols-3 gap-2 text-left" data-subject-practice-result-counts>
            {Object.entries(SUBJECT_PRACTICE_RESULTS).map(([id, row]) => (
              <div key={id} className="rounded-2xl bg-white px-3 py-2.5 shadow-card">
                <p className="text-[11px] font-extrabold" style={{ color: row.color }}>{row.label}</p>
                <p className="font-display text-xl font-extrabold text-ink">{`${tally[id]}問`}</p>
              </div>
            ))}
          </div>

          {missedUnits.length > 0 && (
            <section className="w-full space-y-2 text-left" data-subject-missed-units>
              <p className="px-1 text-xs font-extrabold text-rose-700">解き直す前に、単元の要点を読み直す</p>
              {missedUnits.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(meta.screens.unit, { unitId: item.id })}
                  className="flex w-full items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3 text-left text-rose-800 transition-transform active:scale-[0.98]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold"><SubjectText>{item.title}</SubjectText></span>
                    <span className="block text-[11px] font-bold text-rose-700/75">{`${bookMeta(subject, item.book)?.label}・要点と重要語句`}</span>
                  </span>
                  <BookOpen size={18} />
                </button>
              ))}
            </section>
          )}

          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => restart(missedIds)} disabled={!missedIds.length}>
              <Refresh size={17} /> {missedIds.length ? `解き直す（${missedIds.length}問）` : '解き直しなし'}
            </Button>
            <Button onClick={leave}>戻る</Button>
          </div>
        </div>
      </div>
    )
  }

  const answeredIndexes = answeredQuizIndexes(index, records)
  const level = PRACTICE_LEVELS[question.level]
  const revealUnit = !mixed || Boolean(record)
  const previous = record ? null : latestSubjectPractice(practiceLog, question.id)
  const choices = question.kind === 'choice'
    ? limitQuizChoices(question.choices, question.answer, { seed: question.id })
    : []
  const resultRow = record ? SUBJECT_PRACTICE_RESULTS[record.result] : null
  const filled = question.kind === 'number'
    ? checkSubjectPractice(question, draft).filled
    : question.kind === 'order'
      ? draft.length === question.items.length
      : false

  return (
    <div className="flex h-full flex-col">
      <QuestionSessionControls
        index={index}
        total={deck.length}
        onPrevious={() => setIndex((current) => Math.max(0, current - 1))}
        onNext={next}
        nextDisabled={!record}
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
                const next = restartSessionCount(deck, answeredIndexes, index, pickQuestions(size + deck.length), size)
                carried.carry(next.answeredItems)
                setDeck(next.deck)
                clearRecords()
                setDrafts({})
                startedAt.current = {}
                setIndex(0)
              } else {
                setDeck((current) => growDeck(current, Math.max(index, answeredIndexes.at(-1) ?? 0) + 1, pickQuestions(size), size))
              }
            }}
          />
        )}
        trailingActions={(
          <WordBookToggle domain={meta.notebookPractice} itemId={question.id} itemLabel="この問題" />
        )}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4" data-return-scroll="subject-practice">
        <section className="mt-3 rounded-[1.75rem] bg-white p-5 shadow-card" data-subject-practice-question={question.id}>
          <div className="flex flex-wrap items-center gap-2">
            <Chip color={level.color}>{level.label}</Chip>
            <span className="text-[11px] font-extrabold text-ink/45">{PRACTICE_KINDS[question.kind].label}</span>
            {revealUnit && unit && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">
                {book?.label}・<SubjectText>{unit.title}</SubjectText>
              </span>
            )}
          </div>
          {previous && (
            <p className="mt-2 text-[11px] font-bold text-ink/45" data-subject-practice-previous>
              {`前回：${SUBJECT_PRACTICE_RESULTS[previous.result].label}`}
            </p>
          )}
          <p className="mt-3 text-[15px] font-bold leading-relaxed text-ink"><SubjectText>{question.text}</SubjectText></p>
          {question.figure && (
            <div className="mt-3 rounded-2xl bg-paper p-2">
              <SubjectFigure figure={question.figure} />
            </div>
          )}
        </section>

        {/* 答える欄 */}
        <div className="mt-4 space-y-2.5">
          {question.kind === 'choice' && (
            <>
              {choices.map((choice, choiceIndex) => {
                const correct = choice === question.answer
                const chosen = record?.response === choice
                let tone = 'idle'
                if (record) tone = correct ? 'correct' : chosen ? 'wrong' : 'dim'
                return (
                  <button
                    key={choice}
                    type="button"
                    disabled={Boolean(record)}
                    aria-pressed={record ? chosen : undefined}
                    onClick={() => finish(choice)}
                    className={cx(
                      'flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all',
                      tone === 'idle' && 'border-emerald-100 bg-white text-ink active:scale-[0.99] active:bg-emerald-50',
                      tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-900',
                      tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-900',
                      tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                    )}
                    data-subject-choice={choiceIndex}
                  >
                    <span className={cx(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold',
                      tone === 'correct' ? 'bg-emerald-500 text-white' : tone === 'wrong' ? 'bg-rose-500 text-white' : 'bg-emerald-100 text-emerald-700',
                    )}>
                      {String.fromCharCode(65 + choiceIndex)}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-bold leading-relaxed"><SubjectText>{choice}</SubjectText></span>
                    {tone === 'correct' && <Check size={19} className="mt-0.5 shrink-0 text-emerald-600" />}
                    {tone === 'wrong' && <Close size={17} className="mt-0.5 shrink-0 text-rose-500" />}
                  </button>
                )
              })}
              <UnknownChoiceButton
                selected={record?.response === UNKNOWN_CHOICE_ID}
                disabled={Boolean(record)}
                onClick={() => finish(UNKNOWN_CHOICE_ID)}
              />
            </>
          )}

          {question.kind === 'number' && (
            record ? (
              <div className="rounded-2xl bg-white px-4 py-3 shadow-card" data-subject-number-answered>
                <p className="text-[11px] font-extrabold text-ink/50">あなたの答え</p>
                <p className="font-display text-xl font-extrabold text-ink">
                  {record.response === UNKNOWN_CHOICE_ID ? 'わからない' : `${record.response}${question.unit}`}
                </p>
              </div>
            ) : (
              <NumberPad value={draft} onChange={setDraft} unit={question.unit} />
            )
          )}

          {question.kind === 'order' && (
            <OrderBoard
              question={question}
              order={record ? (record.response === UNKNOWN_CHOICE_ID ? [] : record.response) : draft}
              onChange={setDraft}
              disabled={Boolean(record)}
            />
          )}
        </div>

        {/* 答え合わせのあと：結果・正解・解説・選択肢すべての説明（計算は解き方、並べる問題は順の理由）。 */}
        {record && (
          <section className="mt-4 space-y-3 animate-slide-up" data-subject-practice-review>
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <p className="font-display text-lg font-extrabold" style={{ color: resultRow.color }} data-subject-practice-result-label>
                {record.result === 'correct' ? '正解！' : record.result === 'wrong' ? 'ここを確かめよう' : '答えを確かめよう'}
              </p>
              <div className="mt-2 rounded-xl bg-emerald-50 px-3 py-2.5">
                <p className="text-[10px] font-extrabold text-emerald-600">正解</p>
                <p className="mt-0.5 text-sm font-extrabold leading-relaxed text-emerald-900">
                  <SubjectText>
                    {question.kind === 'number'
                      ? formatNumberAnswer(question)
                      : question.kind === 'order'
                        ? question.items.join(' → ')
                        : question.answer}
                  </SubjectText>
                </p>
              </div>
              {question.explanation && (
                <div className="mt-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-emerald-100" data-subject-practice-explanation>
                  <p className="text-[10px] font-extrabold text-emerald-700">解説</p>
                  <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/75"><SubjectText>{question.explanation}</SubjectText></p>
                </div>
              )}
            </div>

            {question.kind === 'choice' && (
              <ChoiceExplanations
                title="選択肢解説（3択すべて）"
                name={`${subject}-practice`}
                renderText={(text) => <SubjectText>{text}</SubjectText>}
                rows={choices.map((choice) => ({
                  id: choice,
                  heading: choice,
                  body: question.notes[choice],
                  correct: choice === question.answer,
                  chosen: record.response === choice,
                }))}
              />
            )}

            {question.kind === 'number' && (
              <section className="rounded-2xl bg-white p-4 shadow-card" data-subject-practice-steps aria-label="解き方">
                <p className="text-xs font-extrabold tracking-wide text-emerald-700">解き方</p>
                <ol className="mt-2 space-y-2">
                  {question.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-2.5">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-700">
                        {stepIndex + 1}
                      </span>
                      <p className="min-w-0 flex-1 text-sm font-bold leading-relaxed text-ink/80"><SubjectText>{step}</SubjectText></p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {question.kind === 'order' && (
              <ChoiceExplanations
                title="正しい順とその理由"
                name={`${subject}-practice-order`}
                renderText={(text) => <SubjectText>{text}</SubjectText>}
                rows={question.items.map((item, position) => ({
                  id: item,
                  heading: `${position + 1}. ${item}`,
                  body: question.notes[item],
                  correct: false,
                  chosen: false,
                }))}
              />
            )}

            {unit && (
              <button
                type="button"
                onClick={() => navigate(meta.screens.unit, { unitId: unit.id })}
                className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-50 px-2 text-xs font-extrabold text-brand-700 transition-transform active:scale-[0.98]"
                data-subject-practice-unit-link
              >
                <BookOpen size={15} /> <SubjectText>{unit.title}</SubjectText>の要点を読む
              </button>
            )}
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-emerald-100 bg-white/90 px-3 py-2.5 backdrop-blur">
        {record ? (
          <Button full size="lg" onClick={next}>
            {index + 1 >= deck.length ? '結果を見る' : '次の問題へ'} <ArrowRight size={18} />
          </Button>
        ) : question.kind === 'choice' ? (
          <p className="py-2 text-center text-xs font-bold text-ink/45">答えを選ぶと、答え合わせをします。</p>
        ) : (
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <Button variant="secondary" onClick={() => finish(UNKNOWN_CHOICE_ID)} data-subject-practice-unknown>
              わからない
            </Button>
            <Button disabled={!filled} onClick={() => finish(draft)} data-subject-practice-check>
              答え合わせ
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function SocialPracticeScreen() {
  return <SubjectPracticeScreen subject="social" />
}

export function SciencePracticeScreen() {
  return <SubjectPracticeScreen subject="science" />
}
