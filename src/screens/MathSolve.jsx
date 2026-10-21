import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { problemsForUnit, unitById } from '../data/math.js'
import { mathGuidedApproach } from '../data/math-guided-approach.js'
import { approachStepsDone } from '../lib/mathExamApproach.js'
import { MathBlock, MathText } from '../components/MathText.jsx'
import { MathExamApproachSteps, MathExamSolutionFlow } from '../components/MathExamApproach.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { Button, ProgressBar, IconButton, cx } from '../components/ui.jsx'
import { Close, ArrowRight, Lightbulb, Target } from '../components/Icons.jsx'

// 誘導型の数学（基本の型）。手で計算せずに、解き方の方針を3択で1段ずつ選んで進む。
//  ① 方針の段（lib/mathExamApproach.js と同じ形。1段目は方針の確認、2段目からは解き方の手順）。
//     段ごとのヒントは、考え方（なぜそうするのか）→ 手がかり（図にする・表にする・書き出すなど）の順に開く
//  ② 解き終わり … 解き方の流れ（決めたこととなぜ）・この型の着眼点と公式・つまずきやすい点
//     着眼点と公式は方針の答えになるので、選び終わってから見せる
// 正答率は、はじめの選択で正しく選べた段（ヒントを開いた段はふくめない）で数える。
const stepScore = (steps, picks, hints) => ({
  correct: steps.filter((_, index) => (picks[index] ?? [])[0] === 0 && !(hints[index] > 0)).length,
  total: steps.length,
})

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
  const [solved, setSolved] = useState(false)
  const [picks, setPicks] = useState({})
  const [hints, setHints] = useState({})
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)

  const p = problems[pIndex]
  const steps = p ? mathGuidedApproach(p.id) : []
  const leave = () => {
    if (params.returnTo?.screen) {
      returnTo(params.returnTo.screen, params.returnTo.params ?? {})
      return
    }
    back()
  }

  if (!problems.length || !p) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧮</div>
        <p className="font-display text-lg font-extrabold text-ink">この単元はまだ準備中です</p>
        <Button onClick={leave}>戻る</Button>
      </div>
    )
  }

  function reset() {
    setPIndex(0); setSolved(false); setPicks({}); setHints({})
    setScore({ correct: 0, total: 0 }); setFinished(false)
  }

  if (finished) {
    const pct = score.total ? Math.round((score.correct / score.total) * 100) : 0
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="text-6xl">{pct >= 80 ? '🏆' : pct >= 50 ? '✨' : '💪'}</div>
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">おつかれさま！</p>
          <p className="mt-1 font-bold text-ink/55">{`${params.title ?? unit?.title} 全${problems.length}問クリア`}</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-card">
          <Target size={20} className="text-violet-500" />
          <span className="font-display text-lg font-extrabold text-ink">{`自力で選べた方針 ${score.correct} / ${score.total}`}</span>
          <span className="text-sm font-bold text-ink/45">{`(${pct}%)`}</span>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-2.5">
          <Button full variant="secondary" onClick={reset}>もう一度</Button>
          <Button full onClick={leave}>単元一覧へ <ArrowRight size={18} /></Button>
        </div>
      </div>
    )
  }

  const left = steps.length - approachStepsDone(steps, picks)
  const pick = (stepIndex, optionIndex) => setPicks((current) => {
    const chosen = current[stepIndex] ?? []
    if (chosen.includes(0) || chosen.includes(optionIndex)) return current
    return { ...current, [stepIndex]: [...chosen, optionIndex] }
  })
  const openHint = (stepIndex) => setHints((current) => ({ ...current, [stepIndex]: Math.min(2, (current[stepIndex] ?? 0) + 1) }))

  // 解き終わり（全段を選んだ、または「わからない」）。わからないで終えた段は、自力で選べなかった段として数える。
  const finishProblem = (unknown) => {
    if (solved) return
    const result = unknown ? { correct: 0, total: steps.length } : stepScore(steps, picks, hints)
    markMathDone(p.id)
    recordContentQuizResult('math', p.id, result.correct, result.total)
    setScore((current) => ({ correct: current.correct + result.correct, total: current.total + result.total }))
    setSolved(true)
  }

  const nextProblem = () => {
    if (pIndex + 1 >= problems.length) {
      const pct = score.total ? (score.correct / score.total) * 100 : 0
      if (params.unitId && !params.problemIds?.length) setMathMastery(params.unitId, pct)
      setFinished(true)
      return
    }
    setPIndex(pIndex + 1); setSolved(false); setPicks({}); setHints({})
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={leave} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={pIndex / problems.length} color="#8b5cf6" /></div>
        <SpeechSettingsButton compact />
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">{`${pIndex + 1}/${problems.length}`}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4" data-math-guided={p.id}>
        {/* 問題（text＝日本語の問題文・任意、prompt＝中央の数式・任意） */}
        <div className="mt-1 rounded-[1.75rem] bg-white p-5 text-center shadow-card">
          <p className="mb-1 text-xs font-extrabold tracking-wide text-violet-500">問題</p>
          {p.text && (
            <p className="font-bold leading-relaxed text-ink/85"><MathText>{p.text}</MathText></p>
          )}
          {p.prompt && (
            <MathBlock tex={p.prompt} className={cx('text-ink [&_.katex]:text-[1.6rem]', p.text && 'mt-2')} />
          )}
          {!solved && (
            <p className="mt-3 text-[11px] font-bold text-ink/50">{'計算はしなくてよい。どう解くかを、下の段で1つずつ選ぼう。'}</p>
          )}
        </div>

        <MathExamApproachSteps
          problem={p}
          steps={steps}
          picks={picks}
          hints={hints}
          onPick={pick}
          onHint={openHint}
          reviewed={solved}
        />

        {/* 全教材共通の「わからない」。押すと、自力で選べなかった段として解き方の流れを見る。 */}
        {!solved && (
          <div className="mt-4" data-math-guided-unknown>
            <UnknownChoiceButton onClick={() => finishProblem(true)} />
          </div>
        )}

        {solved && (
          <div className="mt-4 space-y-3 animate-slide-up" data-math-guided-review>
            <MathExamSolutionFlow steps={steps} />
            <RecallCard recall={p.recall} />
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-left ring-1 ring-rose-100" data-math-pitfall>
              <p className="text-xs font-extrabold text-rose-600">つまずきやすい点</p>
              <p className="mt-1 text-sm font-bold leading-relaxed text-rose-950/80"><MathText>{p.pitfall}</MathText></p>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-violet-100 bg-white/90 px-3 py-2.5 backdrop-blur">
        {solved ? (
          <Button full size="lg" onClick={nextProblem}>
            {pIndex + 1 >= problems.length ? '結果を見る' : '次の問題へ'} <ArrowRight size={18} />
          </Button>
        ) : (
          <Button full disabled={left > 0} onClick={() => finishProblem(false)} data-math-guided-check>
            {left > 0 ? `解き方の流れを見る（あと${left}段）` : '解き方の流れを見る'}
          </Button>
        )}
      </div>
    </div>
  )
}

// この型の着眼点 + 公式カード（解き終わりに読む）。
function RecallCard({ recall }) {
  if (!recall) return null
  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-4" data-math-recall>
      <div className="flex items-center gap-1.5">
        <Lightbulb size={16} className="text-amber-500" />
        <span className="font-display text-sm font-extrabold text-amber-700">この型の着眼点</span>
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
