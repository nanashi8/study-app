import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { problemsForUnit, unitById } from '../data/math.js'
import { mathGuidedWork } from '../data/math-guided-work.js'
import { checkLine, clearTiles, fillLineIndexes, openWorkHint, placeTile, removeTile, workLineScore, workLinesDone } from '../lib/mathWork.js'
import { MathBlock, MathText } from '../components/MathText.jsx'
import { MathWorkSteps } from '../components/MathWork.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { Button, ProgressBar, IconButton, cx } from '../components/ui.jsx'
import { Close, ArrowRight, Lightbulb, Target } from '../components/Icons.jsx'

// 誘導型の数学（基本の型）。手で計算せずに、計算の経過を1行ずつ穴埋めして進む（lib/mathWork.js）。
//  ① 計算の経過 … 解いた行は上へ積み上がる。行ごとの考え方はヒントボタンで開く
//  ② 解き終わり … 全行の考え方とタイルの説明・この型の着眼点と公式・つまずきやすい点
//     着眼点と公式は穴埋めの答えになるので、解き終わってから見せる
// 正答率は、はじめの答え合わせで正しく埋めた行（ヒントを開いた行はふくめない）で数える。

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
  const [work, setWork] = useState({})
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)

  const p = problems[pIndex]
  const lines = p ? mathGuidedWork(p.id) : []
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
    setPIndex(0); setSolved(false); setWork({})
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
          <span className="font-display text-lg font-extrabold text-ink">{`自力で埋めた行 ${score.correct} / ${score.total}`}</span>
          <span className="text-sm font-bold text-ink/45">{`(${pct}%)`}</span>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-2.5">
          <Button full variant="secondary" onClick={reset}>もう一度</Button>
          <Button full onClick={leave}>単元一覧へ <ArrowRight size={18} /></Button>
        </div>
      </div>
    )
  }

  const left = fillLineIndexes(lines).length - workLinesDone(lines, work)

  // 解き終わり（全行を埋めた、または「わからない」）。わからないで終えた問題は、全行を自力で埋められなかった行として数える。
  const finishProblem = (unknown, state = work) => {
    if (solved) return
    const result = unknown ? { correct: 0, total: fillLineIndexes(lines).length } : workLineScore(lines, state)
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
    setPIndex(pIndex + 1); setSolved(false); setWork({})
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
            <p className="mt-3 text-[11px] font-bold text-ink/50">{'紙に計算はしなくてよい。下の経過の空所に、タイルを入れて1行ずつ進もう。'}</p>
          )}
        </div>

        <MathWorkSteps
          problemId={p.id}
          lines={lines}
          state={work}
          onPlace={(lineIndex, tileIndex) => setWork((current) => placeTile(current, lines[lineIndex], lineIndex, tileIndex))}
          onRemove={(lineIndex, slot) => setWork((current) => removeTile(current, lineIndex, slot))}
          onClear={(lineIndex) => setWork((current) => clearTiles(current, lineIndex))}
          onHint={(lineIndex) => setWork((current) => openWorkHint(current, lineIndex))}
          onCheck={(lineIndex) => {
            const next = checkLine(work, lines[lineIndex], lineIndex)
            setWork(next)
            // 最後の行まで正しく埋めたら、そのまま解き終わりにする。
            if (workLinesDone(lines, next) === fillLineIndexes(lines).length) finishProblem(false, next)
          }}
          reviewed={solved}
        />

        {/* 全教材共通の「わからない」。押すと、正しい経過と全行の考え方を見る。 */}
        {!solved && (
          <div className="mt-4" data-math-guided-unknown>
            <UnknownChoiceButton onClick={() => finishProblem(true)} />
          </div>
        )}

        {solved && (
          <div className="mt-4 space-y-3 animate-slide-up" data-math-guided-review>
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
          <p className="py-2 text-center text-xs font-bold text-ink/50" data-math-guided-left>
            {`空所のある行 あと${left}行。ヒントを開いた行は、自力で埋めた行に数えません。`}
          </p>
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
