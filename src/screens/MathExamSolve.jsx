import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  MATH_EXAM_LEVELS,
  MATH_EXAM_QUIZ_DOMAIN,
  mathExamPattern,
  mathExamProblem,
  mathExamProblemsForKind,
  mathExamProblemsForScope,
  mathExamProblemsForUnit,
} from '../data/math-exam.js'
import { unitById } from '../data/math.js'
import {
  MATH_EXAM_RESULTS,
  TIME_VERDICTS,
  attemptResult,
  checkProblemAnswers,
  choiceMark,
  formatSeconds,
  problemBoxes,
  timeVerdict,
} from '../lib/mathExam.js'
import { latestMathExamAttempt } from '../lib/mathExamLog.js'
import { pickInStudyOrder, rankQuestionsForStudy } from '../lib/studyOrder.js'
import { mixRankedForStudy, questionMixStockOf } from '../lib/studyMix.js'
import { answeredQuizIndexes, growDeck, restartSessionCount } from '../lib/session.js'
import { readableMathAccent } from '../lib/mathVisualColors.js'
import { MathAnswerKeypad, MathAnswerSheet } from '../components/MathAnswerPad.jsx'
import { MathExamFigure } from '../components/MathExamFigure.jsx'
import { ChoiceExplanations } from '../components/ChoiceExplanations.jsx'
import { MathBlock, MathText } from '../components/MathText.jsx'
import { Button, Chip, cx } from '../components/ui.jsx'
import { ArrowRight, BookOpen, Lightbulb, Refresh, Target } from '../components/Icons.jsx'
import { SessionCounter, useCarriedAnswers, useSessionSize } from '../components/SessionSize.jsx'
import { StudyMixEmptyNotice, currentStudyMixShare, useStudyMixRebuild } from '../components/StudyMix.jsx'
import { QuestionSessionControls, useIndexedSessionState } from '../components/QuestionSessionControls.jsx'

// 数学の入試演習。紙に解いた答えを解答欄（ア・イ…）へ入れて答え合わせし、解答の筋道・ポイント・つまずきやすい点を読む。
// 開き方：1つの単元（unitId）・範囲を混ぜる総合演習（scope）・入試の種類全体（kind）・選んだ問題（ids）。
// 出題の順は、問題ごとの結果（contentQuizResults の math-exam）から全教材共通の決まりで組む。
// 単元別は同じ段の中を基礎 → 標準の順に、総合演習は単元を混ぜて出す。

const ALL_QUESTIONS = 9999 // 在庫数を数えるための十分大きな上限

function poolFor(params) {
  if (Array.isArray(params.ids) && params.ids.length) return params.ids.map(mathExamProblem).filter(Boolean)
  const level = params.level ?? 'all'
  if (params.unitId) return mathExamProblemsForUnit(params.unitId, level)
  if (params.scope) return mathExamProblemsForScope(params.scope, level)
  if (params.kind) return mathExamProblemsForKind(params.kind, level)
  return []
}

// 答え方の決まり。その問題の解答欄の式に出てくる形のものだけを出す。
function answerRules(problem) {
  const tex = (problem.parts ?? []).map((part) => part.answer).join(' ')
  const rules = []
  if (/\\d?frac/.test(tex)) rules.push('分数は、それ以上約分できない形で。負の符号は分子につける')
  if (/\\sqrt/.test(tex)) rules.push('根号の中は、できるだけ小さい自然数に')
  if (/\[[゠-ヿ]\]\s*:\s*\[[゠-ヿ]\]/.test(tex)) rules.push('比は、もっとも簡単な整数の比に')
  return rules
}

export function MathExamSolveScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const returnTo = useStore((state) => state.returnTo)
  const mathExamLog = useStore((state) => state.mathExamLog)
  const recordAttempt = useStore((state) => state.recordMathExamAttempt)
  const mixed = Boolean(params.mixed)
  const pool = useMemo(() => poolFor(params), [params])

  // 出題順は、いまの記録から全教材共通の決まりで並べる（lib/studyOrder.js）。
  const pickProblems = (size) => {
    const state = useStore.getState()
    const ranked = rankQuestionsForStudy(pool, {
      quizResults: state.contentQuizResults,
      quizDomain: MATH_EXAM_QUIZ_DOMAIN,
      // 単元別・選んだ問題は、同じ段の中を教材の順（基礎 → 標準）のまま出す。総合演習は単元を混ぜる。
      rng: mixed ? Math.random : null,
    })
    // 画面下部の「出題」（出題バランス）で寄せたときは、その割合で復習と未回答を混ぜる（lib/studyMix.js）。
    return pickInStudyOrder(mixRankedForStudy(ranked, { freshShare: currentStudyMixShare(), stockOf: questionMixStockOf }), size)
  }
  // 在庫を数えて、選べる問題数の上限を実態に合わせる。
  const [poolSize] = useState(() => pickProblems(ALL_QUESTIONS).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => pickProblems(params.size ?? sessionSize))
  const [index, setIndex] = useState(0)
  // 答え合わせした問題の記録（位置ごと）。前へ戻っても、その問題の答えと結果を見せる。
  const {
    value: record,
    setValue: setRecord,
    clear: clearRecords,
    values: records,
  } = useIndexedSessionState(index)
  // 答え合わせ前の入力（位置ごと）：欄の値・いまの欄・開いたヒントの数・解き始めた時刻。
  const [drafts, setDrafts] = useState({})
  const [now, setNow] = useState(() => Date.now())
  const [tally, setTally] = useState({ solved: 0, hinted: 0, wrong: 0, unknown: 0, seconds: 0 })
  const [missedIds, setMissedIds] = useState([])
  const [done, setDone] = useState(false)
  // 1回の問題数を減らして数え直す前に答えた問題。結果の全問数に含める。
  const carried = useCarriedAnswers()

  const problem = deck[index] ?? null
  const unit = problem ? unitById(problem.unit) : null
  const accent = readableMathAccent(unit?.color ?? '#7c3aed')
  const draft = drafts[index] ?? null
  const labels = problem ? problemBoxes(problem) : []

  // 表示した問題の解き始めの時刻を置く（前へ戻って開き直しても、最初に開いた時刻のまま）。
  useEffect(() => {
    if (!problem) return
    setDrafts((current) => (current[index]
      ? current
      : { ...current, [index]: { entries: {}, active: problemBoxes(problem)[0] ?? null, hints: 0, startedAt: Date.now() } }))
  }, [index, problem])

  // 答え合わせまでの時間を1秒ごとに進める。
  const running = Boolean(problem) && !record && !done
  useEffect(() => {
    if (!running) return undefined
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [running])

  // 画面下部の「出題」を動かしたら、表示中と答えた分を残して、先の問題を新しい割合で組み直す。
  useStudyMixRebuild({
    index,
    answeredIndexes: answeredQuizIndexes(index, records),
    fixedOrder: Boolean(params.preserveOrder),
    rebuild: (keepCount) => {
      const size = params.size ?? sessionSize
      setDeck((current) => growDeck(current, current.length ? keepCount : 0, pickProblems(ALL_QUESTIONS), Math.max(size, keepCount)))
    },
  })

  // コンテンツ画面の「戻る」は履歴でなく、開いた画面（目次・単元の演習ページ）へ。
  const leave = () => {
    if (params.returnTo?.screen) {
      returnTo(params.returnTo.screen, params.returnTo.params ?? {})
      return
    }
    returnTo('mathExam')
  }

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">📝</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる問題がありません</p>
        <StudyMixEmptyNotice />
        <Button onClick={leave}>戻る</Button>
      </div>
    )
  }

  const restart = (ids = null) => {
    carried.reset()
    const nextPool = ids?.length ? ids.map(mathExamProblem).filter(Boolean) : null
    setDeck(nextPool ?? pickProblems(deck.length || sessionSize))
    setIndex(0)
    clearRecords()
    setDrafts({})
    setTally({ solved: 0, hinted: 0, wrong: 0, unknown: 0, seconds: 0 })
    setMissedIds([])
    setDone(false)
  }

  const updateDraft = (change) => {
    setDrafts((current) => {
      const base = current[index] ?? { entries: {}, active: labels[0] ?? null, hints: 0, startedAt: Date.now() }
      return { ...current, [index]: { ...base, ...change(base) } }
    })
  }

  const elapsed = record
    ? record.seconds
    : Math.max(0, Math.floor((now - (draft?.startedAt ?? now)) / 1000))

  const finish = (unknown) => {
    if (!problem || record) return
    const entries = draft?.entries ?? {}
    const checked = checkProblemAnswers(problem, entries)
    const hintsUsed = draft?.hints ?? 0
    const result = attemptResult({ correct: checked.correct, hintsUsed, unknown })
    const seconds = Math.max(1, Math.floor((Date.now() - (draft?.startedAt ?? Date.now())) / 1000))
    // 問題ごとの記録（入試演習の記録と、出題の順に使う問題ごとの結果）に残す。
    recordAttempt(problem.id, result, seconds)
    setRecord({ result, perBox: unknown ? null : checked.perBox, seconds, hintsUsed, entries })
    setTally((current) => ({ ...current, [result]: current[result] + 1, seconds: current.seconds + seconds }))
    if (result !== 'solved') setMissedIds((ids) => [...new Set([...ids, problem.id])])
  }

  const next = () => {
    if (index + 1 >= deck.length) setDone(true)
    else setIndex((current) => current + 1)
  }

  if (done) {
    const total = carried.count + deck.length
    const answered = tally.solved + tally.hinted + tally.wrong + tally.unknown
    const missed = missedIds.map(mathExamProblem).filter(Boolean)
    const missedUnits = [...new Set(missed.map((item) => item.unit))].map(unitById).filter(Boolean)
    return (
      <div className="flex h-full flex-col overflow-y-auto p-6 text-center" data-math-exam-result>
        <div className="m-auto flex w-full max-w-sm flex-col items-center gap-5 py-5">
          <div className="text-6xl">{tally.solved === total ? '🏆' : tally.solved * 2 >= total ? '✨' : '📚'}</div>
          <div>
            <p className="text-xs font-extrabold text-violet-700">{`${params.title ?? '入試演習'}の結果`}</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-ink">{`自力で正解 ${tally.solved} / ${total}問`}</p>
            <p className="mt-1 text-sm font-bold text-ink/55">{`解いた時間 ${formatSeconds(tally.seconds)}（${answered}問）`}</p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 text-left" data-math-exam-result-counts>
            {Object.entries(MATH_EXAM_RESULTS).map(([id, meta]) => (
              <div key={id} className="rounded-2xl bg-white px-3 py-2.5 shadow-card">
                <p className="text-[11px] font-extrabold" style={{ color: meta.color }}>{meta.label}</p>
                <p className="font-display text-xl font-extrabold text-ink">{`${tally[id]}問`}</p>
              </div>
            ))}
          </div>

          {missedUnits.length > 0 && (
            <section className="w-full space-y-2 text-left" data-math-exam-missed-units>
              <p className="px-1 text-xs font-extrabold text-rose-700">解き直す前に、単元の基本の型を確かめる</p>
              {missedUnits.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate('mathIntro', { unitId: item.id })}
                  className="flex w-full items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3 text-left text-rose-800 transition-transform active:scale-[0.98]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-xl">{item.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold">{item.title}</span>
                    <span className="block text-[11px] font-bold text-rose-700/75">{`${item.grade}・基本の型`}</span>
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
  const level = MATH_EXAM_LEVELS[problem.level]
  const pattern = mathExamPattern(problem.unit, problem.pattern)
  const revealIdentity = !mixed || Boolean(record)
  const previous = latestMathExamAttempt(mathExamLog, problem.id)
  const shownPrevious = record ? null : previous
  const entries = record?.entries ?? draft?.entries ?? {}
  const hintsOpened = record ? problem.hints.length : draft?.hints ?? 0
  const rules = answerRules(problem)
  const activeBox = record ? null : draft?.active ?? labels[0]
  const activate = (label) => updateDraft(() => ({ active: label }))
  const enter = (label, value) => updateDraft((base) => ({ entries: { ...base.entries, [label]: value } }))
  const emptyBoxes = labels.filter((label) => (
    problem.choices?.[label] ? !Number.isInteger(entries[label]) : !/\d/.test(String(entries[label] ?? ''))
  )).length
  const verdict = record ? timeVerdict(record.seconds, problem.minutes) : null
  const resultMeta = record ? MATH_EXAM_RESULTS[record.result] : null

  return (
    <div className="flex h-full flex-col">
      <QuestionSessionControls
        index={index}
        total={deck.length}
        onPrevious={() => setIndex((current) => Math.max(0, current - 1))}
        onNext={next}
        nextDisabled={!record}
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
                const next = restartSessionCount(deck, answeredIndexes, index, pickProblems(size + deck.length), size)
                carried.carry(next.answeredItems)
                setDeck(next.deck)
                clearRecords()
                setDrafts({})
                setIndex(0)
              } else {
                setDeck((current) => growDeck(current, Math.max(index, answeredIndexes.at(-1) ?? 0) + 1, pickProblems(size), size))
              }
            }}
          />
        )}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4" data-return-scroll="math-exam-solve">
        {/* 問題 */}
        <section className="mt-3 rounded-[1.75rem] bg-white p-5 shadow-card" data-math-exam-question={problem.id}>
          <div className="flex flex-wrap items-center gap-2">
            <Chip color={level.color}>{level.label}</Chip>
            {revealIdentity && unit && <Chip color={accent}>{`${unit.emoji} ${unit.title}`}</Chip>}
            <span
              className={cx(
                'ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold tabular-nums',
                !record && elapsed > problem.minutes * 60 ? 'bg-amber-100 text-amber-800' : 'bg-paper text-ink/60',
              )}
              data-math-exam-timer
              aria-label={`かかった時間 ${formatSeconds(elapsed)}、目安 ${problem.minutes}分`}
            >
              <Target size={13} /> {`${formatSeconds(elapsed)} / 目安${problem.minutes}分`}
            </span>
          </div>
          {revealIdentity && pattern && (
            <p className="mt-2 text-[11px] font-extrabold text-ink/50" data-math-exam-pattern>{`型：${pattern.title}`}</p>
          )}
          {shownPrevious && (
            <p className="mt-1 text-[11px] font-bold text-ink/45" data-math-exam-previous>
              {`前回：${MATH_EXAM_RESULTS[shownPrevious.result].label}・${formatSeconds(shownPrevious.seconds)}`}
            </p>
          )}
          <p className="mt-3 text-[15px] font-bold leading-relaxed text-ink">
            <MathText>{problem.text}</MathText>
          </p>
          {problem.math && (
            <MathBlock tex={problem.math} className="mt-3 overflow-x-auto text-ink [&_.katex]:text-[1.2rem]" />
          )}
          {problem.figure && (
            <div className="mt-3 rounded-2xl bg-paper p-2">
              <MathExamFigure figure={problem.figure} />
            </div>
          )}
        </section>

        {/* ヒント：押したときだけ1段ずつ開く。答え合わせのあとは全部見せる。 */}
        <section className="mt-3 space-y-2" aria-label="ヒント" data-math-exam-hints>
          {problem.hints.slice(0, hintsOpened).map((hint, hintIndex) => (
            <div key={hintIndex} className="flex gap-2 rounded-2xl bg-hint-soft px-3.5 py-2.5 text-sm font-bold leading-relaxed text-amber-950/85">
              <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <span className="min-w-0 flex-1">
                <span className="mr-1 text-[11px] font-extrabold text-amber-700">{`ヒント${hintIndex + 1}`}</span>
                <MathText>{hint}</MathText>
              </span>
            </div>
          ))}
          {!record && hintsOpened < problem.hints.length && (
            <button
              type="button"
              onClick={() => updateDraft((base) => ({ hints: Math.min(problem.hints.length, base.hints + 1) }))}
              className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-amber-300 bg-white px-3 text-sm font-extrabold text-amber-800 transition-transform active:scale-[0.98]"
              data-math-exam-hint-button
            >
              <Lightbulb size={16} />
              {hintsOpened ? `次のヒントを見る（あと${problem.hints.length - hintsOpened}）` : `ヒントを見る（全${problem.hints.length}段）`}
            </button>
          )}
          {!record && hintsOpened === 0 && (
            <p className="px-1 text-center text-[11px] font-bold text-ink/45">ヒントを開くと、正解しても「ヒントで正解」と記録します。</p>
          )}
        </section>

        <MathAnswerSheet
          problem={problem}
          entries={entries}
          active={activeBox}
          onActivate={activate}
          onEntry={enter}
          perBox={record?.perBox ?? null}
          reveal={Boolean(record)}
        />
        {rules.length > 0 && !record && (
          <ul className="mt-2 space-y-0.5 px-2 text-[11px] font-bold leading-relaxed text-ink/55" data-math-exam-answer-rules>
            {rules.map((rule) => <li key={rule}>{`・${rule}`}</li>)}
          </ul>
        )}

        {/* 答え合わせのあと：結果・かかった時間・解答の筋道・ポイント・つまずきやすい点。 */}
        {record && (
          <section className="mt-4 space-y-3 animate-slide-up" data-math-exam-review>
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <p className="font-display text-lg font-extrabold" style={{ color: resultMeta.color }} data-math-exam-result-label>
                {record.result === 'solved' ? '正解！' : record.result === 'hinted' ? 'ヒントで正解' : record.result === 'wrong' ? '解き方を確かめよう' : '答えを確かめよう'}
              </p>
              <p className="mt-1 text-xs font-bold text-ink/60">
                {`かかった時間 ${formatSeconds(record.seconds)}（目安${problem.minutes}分）`}
                {/* 時間の比べは、正しく解けたときだけ出す（まちがえたのに「速い」とは言わない）。 */}
                {(record.result === 'solved' || record.result === 'hinted') && (
                  <span style={{ color: TIME_VERDICTS[verdict].color }}>{`・${TIME_VERDICTS[verdict].label}`}</span>
                )}
              </p>
              {record.result !== 'solved' && (
                <p className="mt-1 text-xs font-bold text-ink/60">この問題は解き直しに入りました。次は自力で解いてみよう。</p>
              )}
            </div>

            {labels.filter((label) => problem.choices?.[label]).map((label) => (
              <ChoiceExplanations
                key={label}
                title={`欄${label}の選択肢解説（${problem.choices[label].options.length}つすべて）`}
                name={`math-exam-${label}`}
                renderText={(text) => <MathText>{text}</MathText>}
                rows={problem.choices[label].options.map((option, optionIndex) => ({
                  id: String(optionIndex),
                  heading: <span><span className="mr-1 text-violet-700">{choiceMark(optionIndex)}</span><MathText>{option}</MathText></span>,
                  body: problem.choices[label].notes[optionIndex],
                  correct: optionIndex === problem.boxes[label],
                  chosen: record.entries[label] === optionIndex,
                }))}
              />
            ))}

            <section className="rounded-2xl bg-white p-4 shadow-card" data-math-exam-solution aria-label="解答の筋道">
              <p className="text-xs font-extrabold tracking-wide text-violet-700">解答の筋道</p>
              <ol className="mt-2 space-y-3">
                {problem.solution.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-extrabold text-violet-700">
                      {stepIndex + 1}
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      {step.text && (
                        <p className="text-sm font-bold leading-relaxed text-ink/80"><MathText>{step.text}</MathText></p>
                      )}
                      {step.math && <MathBlock tex={step.math} className="mt-1 overflow-x-auto text-ink [&_.katex]:text-[1.05rem]" />}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <div className="rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100" data-math-exam-point>
              <p className="text-xs font-extrabold text-emerald-700">この型のポイント</p>
              <p className="mt-1 text-sm font-bold leading-relaxed text-emerald-950/85"><MathText>{problem.point}</MathText></p>
            </div>
            <div className="rounded-2xl bg-rose-50 px-4 py-3 ring-1 ring-rose-100" data-math-exam-pitfall>
              <p className="text-xs font-extrabold text-rose-700">つまずきやすい点</p>
              <p className="mt-1 text-sm font-bold leading-relaxed text-rose-950/80"><MathText>{problem.pitfall}</MathText></p>
            </div>
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-violet-100 bg-white/90 px-3 py-2.5 backdrop-blur">
        {record ? (
          <Button full size="lg" onClick={next}>
            {index + 1 >= deck.length ? '結果を見る' : '次の問題へ'} <ArrowRight size={18} />
          </Button>
        ) : (
          <div className="space-y-2">
            <MathAnswerKeypad problem={problem} entries={entries} active={activeBox} onActivate={activate} onEntry={enter} />
            <div className="grid grid-cols-[auto_1fr] gap-2">
              <Button variant="secondary" onClick={() => finish(true)} data-math-exam-unknown>
                わからない
              </Button>
              <Button disabled={emptyBoxes > 0} onClick={() => finish(false)} data-math-exam-check>
                {emptyBoxes > 0 ? `答え合わせ（空の欄 ${emptyBoxes}）` : '答え合わせ'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
