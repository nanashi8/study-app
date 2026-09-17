import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { problemsForUnit, unitById } from '../data/math.js'
import { shuffle } from '../data/vocab.js'
import { MathBlock, MathInline, MathText } from '../components/MathText.jsx'
import { MathFillIn, resolveFill } from '../components/MathFillIn.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { ChoiceExplanations } from '../components/ChoiceExplanations.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Button, ProgressBar, IconButton } from '../components/ui.jsx'
import { cx } from '../components/ui.jsx'
import { Close, Check, ArrowRight, Lightbulb, Target } from '../components/Icons.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { mathChoiceNoteFor } from '../data/math-choice-notes.js'
import { mathFillNoteFor } from '../data/math-fill-notes.js'

// 誘導型の数学ソルバー。1問を「確認 → 穴埋め → 答え」で解き進める。
//  ① recall  … 着眼点・公式を思い出し、方針を3択で確認
//  ② steps   … 穴埋め（タイルをタップ）or 3択で解答を組み立てる
//  ③ solved  … 最終解とつまずきポイント
export function MathSolveScreen() {
  const params = useStore((s) => s.params)
  const back = useStore((s) => s.back)
  const returnTo = useStore((s) => s.returnTo)
  const markMathDone = useStore((s) => s.markMathDone)
  const setMathMastery = useStore((s) => s.setMathMastery)
  const recordContentQuizResult = useStore((s) => s.recordContentQuizResult)
  const unit = unitById(params.unitId)
  const unitProblems = problemsForUnit(params.unitId)
  const problems = Array.isArray(params.problemIds) && params.problemIds.length
    ? params.problemIds
        .map((id) => unitProblems.find((problem) => problem.id === id))
        .filter(Boolean)
    : unitProblems

  const [pIndex, setPIndex] = useState(0)
  const [phase, setPhase] = useState('recall') // 'recall' | 'steps' | 'solved'
  const [si, setSi] = useState(0)
  const [sel, setSel] = useState(null) // 3択の選択（recall.quiz / choiceステップ）
  const [placed, setPlaced] = useState([]) // 穴埋めスロットに入れた bank.id
  const [fillResult, setFillResult] = useState(null) // { perBlank, correct } | null
  const [lines, setLines] = useState([]) // 積み上がっていく式
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [problemScore, setProblemScore] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)

  const p = problems[pIndex]
  const step = phase === 'steps' ? p?.steps[si] : null
  const leave = () => {
    if (params.returnTo?.screen) {
      returnTo(params.returnTo.screen, params.returnTo.params ?? {})
      return
    }
    back()
  }

  // 穴埋め用タイル（ステップごとにシャッフル固定）。
  const bank = useMemo(
    () => (step?.fill ? shuffle(step.fill.tiles.map((label, id) => ({ id, label }))) : []),
    [p?.id, si, phase], // eslint-disable-line react-hooks/exhaustive-deps
  )

  if (!problems.length || !p) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧮</div>
        <p className="font-display text-lg font-extrabold text-ink">この単元はまだ準備中です</p>
        <Button onClick={leave}>戻る</Button>
      </div>
    )
  }

  if (finished) {
    const pct = score.total ? Math.round((score.correct / score.total) * 100) : 0
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-6xl">{pct >= 80 ? '🏆' : pct >= 50 ? '✨' : '💪'}</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">おつかれさま！</p>
          <p className="mt-1 font-bold text-ink/55">{params.title ?? unit?.title} 全{problems.length}問クリア</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-card">
          <Target size={20} className="text-violet-500" />
          <span className="font-display text-lg font-extrabold text-ink">
            正解 {score.correct} / {score.total}
          </span>
          <span className="text-sm font-bold text-ink/45">({pct}%)</span>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-2.5">
          <Button full variant="secondary" onClick={reset}>もう一度</Button>
          <Button full onClick={leave}>単元一覧へ <ArrowRight size={18} /></Button>
        </div>
      </div>
    )
  }

  function reset() {
    setPIndex(0); setPhase('recall'); setSi(0); setSel(null)
    setPlaced([]); setFillResult(null); setLines([]); setScore({ correct: 0, total: 0 })
    setProblemScore({ correct: 0, total: 0 }); setFinished(false)
  }

  const quiz = phase === 'recall' ? p.recall?.quiz : null
  const isFill = phase === 'steps' && !!step?.fill
  const isChoice = (phase === 'recall' && !!quiz) || (phase === 'steps' && !step?.fill)
  const choiceQ = phase === 'recall' ? quiz : step // 3択の設問
  const allFilled = isFill && placed.length === step.fill.blanks.length

  // 進行可能か（フッターの有効/無効）。
  const recallReady = phase === 'recall' && (!quiz || sel !== null)
  const choiceAnswered = phase === 'steps' && isChoice && sel !== null
  const fillDone = isFill && fillResult !== null

  const chooseOption = (idx) => {
    if (sel !== null) return
    setSel(idx)
    const correct = idx === choiceQ.answer
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setProblemScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    if (phase === 'steps' && step.math) setLines((ls) => [...ls, step.math])
  }

  const addTile = (id) => { if (!fillResult) setPlaced((p) => [...p, id]) }
  const removeSlot = (k) => { if (!fillResult) setPlaced((p) => p.filter((_, i) => i !== k)) }
  const clearTiles = () => { if (!fillResult) setPlaced([]) }

  const checkFill = () => {
    const f = step.fill
    const vals = placed.map((id) => bank.find((b) => b.id === id)?.label)
    let perBlank
    if (f.unordered) {
      const pool = [...f.blanks]
      perBlank = vals.map((v) => {
        const at = pool.indexOf(v)
        if (at >= 0) { pool.splice(at, 1); return true }
        return false
      })
    } else {
      perBlank = vals.map((v, k) => v === f.blanks[k])
    }
    const correct = perBlank.length === f.blanks.length && perBlank.every(Boolean)
    setFillResult({ perBlank, correct })
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setProblemScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setLines((ls) => [...ls, resolveFill(f, f.blanks)]) // 正しい式を積み上げる
  }

  const advance = () => {
    setSel(null); setPlaced([]); setFillResult(null)
    if (phase === 'recall') { setPhase('steps'); setSi(0); return }
    if (si + 1 < p.steps.length) { setSi(si + 1) }
    else {
      markMathDone(p.id)
      recordContentQuizResult('math', p.id, problemScore.correct, problemScore.total)
      setPhase('solved')
    }
  }

  const nextProblem = () => {
    if (pIndex + 1 >= problems.length) {
      const pct = score.total ? (score.correct / score.total) * 100 : 0
      if (params.unitId && !params.problemIds?.length) setMathMastery(params.unitId, pct)
      setFinished(true)
      return
    }
    setPIndex(pIndex + 1); setPhase('recall'); setSi(0)
    setSel(null); setPlaced([]); setFillResult(null); setLines([])
    setProblemScore({ correct: 0, total: 0 })
  }

  // フッターの状態。
  let footer
  if (phase === 'solved') {
    footer = { label: pIndex + 1 >= problems.length ? '結果を見る' : '次の問題へ', onClick: nextProblem, disabled: false }
  } else if (phase === 'recall') {
    footer = { label: '解いていく', onClick: advance, disabled: !recallReady }
  } else if (isFill && !fillDone) {
    footer = {
      label: allFilled ? '答え合わせ' : `答え合わせ（あと${step.fill.blanks.length - placed.length}）`,
      onClick: checkFill, disabled: !allFilled,
    }
  } else {
    const last = si + 1 >= p.steps.length
    footer = { label: last ? '答えを確認' : '次のステップ', onClick: advance, disabled: isChoice && !choiceAnswered }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={leave} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={pIndex / problems.length} color="#8b5cf6" /></div>
        <SpeechSettingsButton compact />
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">{pIndex + 1}/{problems.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* 問題（text＝日本語の問題文・任意、prompt＝中央の数式・任意） */}
        <div className="mt-1 rounded-[1.75rem] bg-white p-5 text-center shadow-card">
          <p className="mb-1 text-xs font-extrabold tracking-wide text-violet-500">問題</p>
          {p.text && (
            <p className="font-bold leading-relaxed text-ink/85"><MathText>{p.text}</MathText></p>
          )}
          {p.prompt && (
            <MathBlock tex={p.prompt} className={cx('text-ink [&_.katex]:text-[1.6rem]', p.text && 'mt-2')} />
          )}
        </div>

        {/* 積み上がる式 */}
        {lines.length > 0 && (
          <div className="mt-3 space-y-1.5 rounded-2xl bg-violet-50/70 px-4 py-3">
            {lines.map((tex, i) => (
              <MathBlock key={i} tex={tex} className="text-ink/80 [&_.katex]:text-[1.05rem]" />
            ))}
          </div>
        )}

        {/* ① 確認 */}
        {phase === 'recall' && (
          <>
            <RecallCard recall={p.recall} />
            {quiz && (
              <Question
                q={quiz}
                noteKey={`${p.id}:recall`}
                badge="方針"
                sel={sel}
                onChoose={chooseOption}
              />
            )}
          </>
        )}

        {/* ② 穴埋め / 3択 */}
        {phase === 'steps' && (
          isFill ? (
            <>
              <MathFillIn
                fill={step.fill} bank={bank} placed={placed} result={fillResult}
                onAdd={addTile} onRemove={removeSlot} onClear={clearTiles}
              />
              {fillResult && (
                <div className="mt-4 space-y-3 animate-slide-up">
                  {/* この段で行う操作の説明と、出したタイル1枚ずつの説明だけを出す（決まり文句の4段解説は置かない）。 */}
                  <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-violet-100" data-math-fill-explanation>
                    <p className="text-[10px] font-extrabold text-violet-600">解説</p>
                    <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/75"><MathText>{step.note}</MathText></p>
                  </div>
                  <ChoiceExplanations
                    title={`タイルの解説（${bank.length}枚すべて）`}
                    name="math-fill"
                    renderText={(text) => <MathText>{text}</MathText>}
                    rows={bank.map((tile) => ({
                      id: String(tile.id),
                      heading: <MathInline tex={tile.label} />,
                      body: mathFillNoteFor(`${p.id}:step:${si}`, tile.id),
                      correct: step.fill.blanks.includes(tile.label),
                      chosen: placed.includes(tile.id),
                    }))}
                  />
                </div>
              )}
            </>
          ) : (
            <Question q={step} noteKey={`${p.id}:step:${si}`} sel={sel} onChoose={chooseOption} />
          )
        )}

        {/* ③ 答え */}
        {phase === 'solved' && <Solved problem={p} />}
      </div>

      <div className="shrink-0 border-t border-violet-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={footer.disabled} onClick={footer.onClick}>
          {footer.label} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}

// 着眼点 + 公式カード。
function RecallCard({ recall }) {
  if (!recall) return null
  return (
    <div className="mt-4 rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-4">
      <div className="flex items-center gap-1.5">
        <Lightbulb size={16} className="text-amber-500" />
        <span className="font-display text-sm font-extrabold text-amber-700">まず確認しよう</span>
      </div>
      {recall.points?.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {recall.points.map((pt, i) => (
            <li key={i} className="flex gap-2 text-sm font-bold leading-relaxed text-ink/75">
              <span className="text-amber-500">•</span>
              <span><MathText>{pt}</MathText></span>
            </li>
          ))}
        </ul>
      )}
      {recall.formula && (
        <div className="mt-3 rounded-xl bg-white px-3 py-2.5 shadow-sm">
          <p className="text-[11px] font-extrabold tracking-wide text-violet-500">{recall.formula.name}</p>
          <MathBlock tex={recall.formula.tex} className="mt-0.5 text-ink [&_.katex]:text-[1.15rem]" />
        </div>
      )}
    </div>
  )
}

// 選択式の設問（方針確認 / 選択式のステップ）。
function Question({ q, noteKey, badge, sel, onChoose }) {
  const answered = sel !== null
  // 教材は正解を先頭に書いているので、出すたびに並びを混ぜる（同じ設問の間は並びを保つ）。
  // 選んだ値は教材の選択肢の番号のまま扱う。
  const order = useMemo(() => shuffle(q.choices.map((_, index) => index)), [q])
  return (
    <div className="mt-4">
      <div className="mb-3 flex items-start gap-2 px-1">
        {badge && (
          <span className="mt-0.5 shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
            {badge}
          </span>
        )}
        <p className="font-extrabold text-ink/80"><MathText>{q.q ?? q.ask}</MathText></p>
      </div>

      <div className="space-y-2.5">
        {order.map((idx) => {
          const c = q.choices[idx]
          const correct = idx === q.answer
          const chosen = sel === idx
          let tone = 'idle'
          if (answered) {
            if (correct) tone = 'correct'
            else if (chosen) tone = 'wrong'
            else tone = 'dim'
          }
          return (
            <button
              key={idx}
              disabled={answered}
              onClick={() => onChoose(idx)}
              className={cx(
                'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-bold transition-all',
                tone === 'idle' && 'border-violet-100 bg-white text-ink active:bg-violet-50 active:scale-[0.99]',
                tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-800',
                tone === 'dim' && 'border-transparent bg-paper text-ink/35',
              )}
            >
              <span className="flex-1"><MathText>{c}</MathText></span>
              {tone === 'correct' && <Check size={20} className="text-emerald-600" />}
              {tone === 'wrong' && <Close size={18} className="text-rose-500" />}
            </button>
          )
        })}
        <UnknownChoiceButton
          selected={sel === UNKNOWN_CHOICE_ID}
          disabled={answered}
          onClick={() => onChoose(UNKNOWN_CHOICE_ID)}
        />
      </div>

      {answered && (
        <div className="mt-4 space-y-3 animate-slide-up">
          {/* この設問固有の説明と、出した選択肢1件ずつの説明だけを出す（決まり文句の4段解説は置かない）。 */}
          <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-violet-100" data-math-choice-explanation>
            <p className="text-[10px] font-extrabold text-violet-600">解説</p>
            <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/75"><MathText>{q.why ?? q.note}</MathText></p>
          </div>
          <ChoiceExplanations
            title={`選択肢解説（${q.choices.length}択すべて）`}
            name="math"
            renderText={(text) => <MathText>{text}</MathText>}
            rows={order.map((idx) => ({
              id: String(idx),
              heading: q.choices[idx],
              body: mathChoiceNoteFor(noteKey, idx),
              correct: idx === q.answer,
              chosen: sel === idx,
            }))}
          />
        </div>
      )}
    </div>
  )
}

// 解き終わり：答えと、解き方を1段ずつ、つまずきやすい点。
function Solved({ problem }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-2xl border-2 border-emerald-300 bg-correct-soft p-4 text-center">
        <p className="mb-1 text-xs font-extrabold tracking-wide text-emerald-600">答え</p>
        <MathBlock tex={problem.answer} className="text-emerald-900 [&_.katex]:text-[1.4rem]" />
      </div>
      {/* 解き方を1段ずつ（何を求めるか・式・理由）と、つまずきやすい点を出す（決まり文句の4段解説は置かない）。 */}
      <section className="rounded-2xl bg-white p-4 shadow-card" data-math-solution aria-label="解き方">
        <p className="text-xs font-extrabold tracking-wide text-violet-500">解き方</p>
        <ol className="mt-2 space-y-3">
          {problem.steps.map((step, index) => (
            <li key={index} className="flex gap-2.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-extrabold text-violet-600">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-extrabold leading-relaxed text-ink/80">
                  <MathText>{step.fill ? step.fill.ask : step.q ?? step.ask}</MathText>
                </p>
                {step.fill ? (
                  <MathBlock tex={resolveFill(step.fill, step.fill.blanks)} className="mt-1 text-ink [&_.katex]:text-[1.05rem]" />
                ) : (
                  <>
                    <p className="mt-1 text-sm font-bold leading-relaxed text-emerald-800">
                      <MathText>{step.choices[step.answer]}</MathText>
                    </p>
                    {step.math && <MathBlock tex={step.math} className="mt-1 text-ink [&_.katex]:text-[1.05rem]" />}
                  </>
                )}
                <p className="mt-1 text-xs font-bold leading-relaxed text-ink/65">
                  <MathText>{step.fill ? step.note : step.why ?? step.note}</MathText>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <div className="rounded-2xl bg-rose-50 px-4 py-3 text-left ring-1 ring-rose-100" data-math-pitfall>
        <p className="text-xs font-extrabold text-rose-600">つまずきやすい点</p>
        <p className="mt-1 text-sm font-bold leading-relaxed text-rose-950/80"><MathText>{problem.pitfall}</MathText></p>
      </div>
    </div>
  )
}
