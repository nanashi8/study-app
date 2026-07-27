import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { problemsForUnit, unitById } from '../data/math.js'
import { shuffle } from '../data/vocab.js'
import { MathBlock, MathText } from '../components/MathText.jsx'
import { MathFillIn, resolveFill } from '../components/MathFillIn.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { Button, ProgressBar, IconButton } from '../components/ui.jsx'
import { cx } from '../components/ui.jsx'
import { Close, Check, ArrowRight, Lightbulb, Target } from '../components/Icons.jsx'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'

// 誘導型の数学ソルバー。1問を「確認 → 穴埋め → 答え」で解き進める。
//  ① recall  … 着眼点・公式を思い出し、方針を3択で確認
//  ② steps   … 穴埋め（タイルをタップ）or 3択で解答を組み立てる
//  ③ solved  … 最終解とつまずきポイント
export function MathSolveScreen() {
  const params = useStore((s) => s.params)
  const back = useStore((s) => s.back)
  const markMathDone = useStore((s) => s.markMathDone)
  const setMathMastery = useStore((s) => s.setMathMastery)
  const unit = unitById(params.unitId)
  const problems = problemsForUnit(params.unitId)

  const [pIndex, setPIndex] = useState(0)
  const [phase, setPhase] = useState('recall') // 'recall' | 'steps' | 'solved'
  const [si, setSi] = useState(0)
  const [sel, setSel] = useState(null) // 3択の選択（recall.quiz / choiceステップ）
  const [placed, setPlaced] = useState([]) // 穴埋めスロットに入れた bank.id
  const [fillResult, setFillResult] = useState(null) // { perBlank, correct } | null
  const [lines, setLines] = useState([]) // 積み上がっていく式
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)

  const p = problems[pIndex]
  const step = phase === 'steps' ? p?.steps[si] : null

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
        <Button onClick={back}>もどる</Button>
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
          <p className="mt-1 font-bold text-ink/55">{unit?.title} 全{problems.length}問クリア</p>
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
          <Button full onClick={back}>単元一覧へ <ArrowRight size={18} /></Button>
        </div>
      </div>
    )
  }

  function reset() {
    setPIndex(0); setPhase('recall'); setSi(0); setSel(null)
    setPlaced([]); setFillResult(null); setLines([]); setScore({ correct: 0, total: 0 }); setFinished(false)
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
    setScore((s) => ({ correct: s.correct + (idx === choiceQ.answer ? 1 : 0), total: s.total + 1 }))
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
    setLines((ls) => [...ls, resolveFill(f, f.blanks)]) // 正しい式を積み上げる
  }

  const advance = () => {
    setSel(null); setPlaced([]); setFillResult(null)
    if (phase === 'recall') { setPhase('steps'); setSi(0); return }
    if (si + 1 < p.steps.length) { setSi(si + 1) }
    else { markMathDone(p.id); setPhase('solved') }
  }

  const nextProblem = () => {
    if (pIndex + 1 >= problems.length) {
      const pct = score.total ? (score.correct / score.total) * 100 : 0
      if (params.unitId) setMathMastery(params.unitId, pct)
      setFinished(true)
      return
    }
    setPIndex(pIndex + 1); setPhase('recall'); setSi(0)
    setSel(null); setPlaced([]); setFillResult(null); setLines([])
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
        <IconButton onClick={back} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={pIndex / problems.length} color="#8b5cf6" /></div>
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
              <Question q={quiz} badge="方針" explain={quiz.why} sel={sel} onChoose={chooseOption} />
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
              {fillResult && <ExplainCard correct={fillResult.correct} text={step.note} />}
            </>
          ) : (
            <Question q={step} explain={step.note} sel={sel} onChoose={chooseOption} />
          )
        )}

        {/* ③ 答え */}
        {phase === 'solved' && <Solved problem={p} />}
      </div>

      <div className="shrink-0 border-t border-violet-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
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

// 3択（方針確認 / 3択ステップ）。
function Question({ q, badge, explain, sel, onChoose }) {
  const answered = sel !== null
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
        {q.choices.map((c, idx) => {
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

      {answered && <ExplainCard correct={sel === q.answer} text={explain} />}
    </div>
  )
}

// 答え合わせ後の解説カード。
function ExplainCard({ correct, text }) {
  if (!text) return null
  return (
    <div className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
      <div className="flex items-center gap-1.5">
        <Lightbulb size={16} className="text-amber-500" />
        <span className="font-display text-sm font-extrabold text-ink/80">
          {correct ? '正解！' : 'ここがポイント'}
        </span>
      </div>
      <p className="mt-1.5 text-sm font-bold leading-relaxed text-ink/70"><MathText>{text}</MathText></p>
    </div>
  )
}

// 解き終わり：最終解とつまずきポイント。
function Solved({ problem }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-2xl border-2 border-emerald-300 bg-correct-soft p-4 text-center">
        <p className="mb-1 text-xs font-extrabold tracking-wide text-emerald-600">答え</p>
        <MathBlock tex={problem.answer} className="text-emerald-900 [&_.katex]:text-[1.4rem]" />
      </div>
      {problem.pitfall && (
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <div className="flex items-center gap-1.5">
            <Target size={16} className="text-rose-500" />
            <span className="font-display text-sm font-extrabold text-ink/80">つまずき注意</span>
          </div>
          <p className="mt-1.5 text-sm font-bold leading-relaxed text-ink/70"><MathText>{problem.pitfall}</MathText></p>
        </div>
      )}
    </div>
  )
}
