import { approachOrder, approachStepsDone } from '../lib/mathExamApproach.js'
import { ChoiceExplanations } from './ChoiceExplanations.jsx'
import { MathBlock, MathText } from './MathText.jsx'
import { Check, Close, Lightbulb } from './Icons.jsx'
import { cx } from './ui.jsx'

// 入試演習の方針の段。解き方の方針を3択で1段ずつ選ぶ（計算はしない）。
//   MathExamApproachSteps … 段。ヒントは段ごとに押したときだけ1つずつ開く：
//                           考え方（なぜそうする必要があるのか）→ 手がかり（図にする・表にする・書き出すなど、実際に手を動かす方法）。
//                           まちがえた選択肢はその方針だとどうなるかを出して選び直させ、答え合わせのあとは全選択肢の説明を出す
//   MathExamSolutionFlow  … 答え合わせのあとの解き方の流れ。1段目から順に、決めたこととなぜそうするのか

export function MathExamApproachSteps({ problem, steps, picks = {}, hints = {}, onPick, onHint, reviewed = false }) {
  const done = approachStepsDone(steps, picks)
  // 答え合わせ（または「わからない」）のあとは全段を、それまでは終えた段と、いまの段を出す。
  const shown = reviewed ? steps.length : Math.min(steps.length, done + 1)
  return (
    <section className="mt-3 space-y-3" aria-label="解き方の方針" data-math-exam-approach>
      {steps.slice(0, shown).map((step, stepIndex) => {
        const chosen = picks[stepIndex] ?? []
        const solved = chosen.includes(0)
        const open = reviewed || solved
        // 開いたヒントの数（0〜2）。答え合わせのあとは両方を見せる。
        const opened = reviewed ? 2 : hints[stepIndex] ?? 0
        const order = approachOrder(problem.id, stepIndex, step.options.length)
        const lastWrong = [...chosen].reverse().find((index) => index !== 0)
        return (
          <div key={stepIndex} className="rounded-2xl bg-white p-3.5 shadow-card" data-math-exam-approach-step={stepIndex}>
            <p className="text-[11px] font-extrabold text-violet-700">{`方針 ${stepIndex + 1}/${steps.length}`}</p>
            <p className="mt-0.5 font-extrabold leading-relaxed text-ink/85"><MathText>{step.q}</MathText></p>
            {opened >= 1 && (
              <div className="mt-2 flex gap-2 rounded-xl bg-hint-soft px-3 py-2 text-sm font-bold leading-relaxed text-amber-950/85" data-math-exam-step-hint>
                <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <span className="min-w-0 flex-1">
                  <span className="mr-1 text-[11px] font-extrabold text-amber-700">考え方</span>
                  <MathText>{step.hint}</MathText>
                </span>
              </div>
            )}
            {opened >= 2 && (
              <div className="mt-2 rounded-xl bg-sky-50 px-3 py-2 text-sm font-bold leading-relaxed text-sky-950/85 ring-1 ring-sky-100" data-math-exam-step-try>
                <p className="text-[11px] font-extrabold text-sky-700">{`手がかり：${step.tryHint.way}`}</p>
                <p className="mt-0.5"><MathText>{step.tryHint.text}</MathText></p>
                {step.tryHint.math && <MathBlock tex={step.tryHint.math} className="mt-1.5 overflow-x-auto text-ink [&_.katex]:text-[1rem]" />}
              </div>
            )}
            {!open && opened < 2 && (
              <button
                type="button"
                onClick={() => onHint?.(stepIndex)}
                className="mt-2 inline-flex min-h-9 items-center gap-1 rounded-full border-2 border-dashed border-amber-300 px-3 text-xs font-extrabold text-amber-800 active:scale-[0.98]"
                data-math-exam-step-hint-button
              >
                <Lightbulb size={14} /> {opened === 0 ? 'ヒント：なぜ・どう考える？' : 'まだ分からない：手がかりを見る'}
              </button>
            )}
            <div className="mt-2.5 space-y-2">
              {order.map((optionIndex) => {
                const correct = optionIndex === 0
                const picked = chosen.includes(optionIndex)
                let tone = 'idle'
                if (open) tone = correct ? 'correct' : picked ? 'wrong' : 'dim'
                else if (picked) tone = 'wrong'
                return (
                  <button
                    key={optionIndex}
                    type="button"
                    disabled={open || picked}
                    onClick={() => onPick?.(stepIndex, optionIndex)}
                    data-math-exam-approach-option={optionIndex}
                    className={cx(
                      'flex w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-3 text-left text-sm font-bold transition-all',
                      tone === 'idle' && 'border-violet-100 bg-white text-ink active:scale-[0.99] active:bg-violet-50',
                      tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                      tone === 'wrong' && 'border-rose-300 bg-wrong-soft text-rose-800',
                      tone === 'dim' && 'border-transparent bg-paper text-ink/40',
                    )}
                  >
                    <span className="min-w-0 flex-1 leading-relaxed"><MathText>{step.options[optionIndex]}</MathText></span>
                    {tone === 'correct' && <Check size={18} className="shrink-0 text-emerald-600" />}
                    {tone === 'wrong' && <Close size={16} className="shrink-0 text-rose-500" />}
                  </button>
                )
              })}
            </div>
            {/* まちがえた選択肢は、その方針だとどうなるかをすぐ出して、選び直してもらう。 */}
            {!open && lastWrong !== undefined && (
              <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold leading-relaxed text-rose-900/85" data-math-exam-approach-wrong>
                <MathText>{step.notes[lastWrong]}</MathText>
              </p>
            )}
            {open && !reviewed && (
              <p className="mt-2 rounded-xl bg-white px-3 py-2 text-sm font-bold leading-relaxed text-ink/75 ring-1 ring-violet-100" data-math-exam-approach-why>
                <MathText>{step.notes[0]}</MathText>
              </p>
            )}
            {reviewed && (
              <ChoiceExplanations
                className="mt-2"
                title={`選択肢解説（${step.options.length}択すべて）`}
                name={`math-exam-approach-${stepIndex}`}
                renderText={(text) => <MathText>{text}</MathText>}
                rows={order.map((optionIndex) => ({
                  id: String(optionIndex),
                  heading: <MathText>{step.options[optionIndex]}</MathText>,
                  body: step.notes[optionIndex],
                  correct: optionIndex === 0,
                  chosen: chosen.includes(optionIndex),
                }))}
              />
            )}
          </div>
        )
      })}
    </section>
  )
}

export function MathExamSolutionFlow({ steps }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-card" aria-label="解き方の流れ" data-math-exam-flow>
      <p className="text-xs font-extrabold tracking-wide text-violet-700">解き方の流れ</p>
      <ol className="mt-2 space-y-3">
        {steps.map((step, stepIndex) => (
          <li key={stepIndex} className="flex gap-2.5 text-left">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-extrabold text-violet-700">
              {stepIndex + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold leading-relaxed text-emerald-800"><MathText>{step.options[0]}</MathText></p>
              <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/65">
                <span className="mr-1 text-violet-700">なぜ</span>
                <MathText>{step.hint}</MathText>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
