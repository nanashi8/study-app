import { useEffect } from 'react'
import {
  answerTexWithValues,
  choiceMark,
  isChoiceBox,
  normalizeEntry,
  pressAnswerKey,
  renderAnswerTex,
  templateBoxes,
} from '../lib/mathExam.js'
import { MathBlock, MathText } from './MathText.jsx'
import { cx } from './ui.jsx'

// 入試演習の解答欄。紙で解いた答えを、欄（ア・イ…）ごとに入れる。
//   MathAnswerSheet  … 問題の下に置く解答欄の式と、欄を選ぶボタン。選択式の欄は選択肢のボタンもここに出す
//   MathAnswerKeypad … 画面下部に固定する数字キー（いま入れている欄と値も出す）
// 答え合わせのあとは、欄ごとの正誤と正しい答えを出す。

const isFilled = (problem, label, value) => (
  isChoiceBox(problem, label) ? Number.isInteger(value) : normalizeEntry(value) !== ''
)

/** いまの欄の次の、まだ入っていない欄（なければ次の欄）。 */
export function nextAnswerBox(problem, entries, active) {
  const labels = (problem.parts ?? []).flatMap((part) => templateBoxes(part.answer))
  const at = labels.indexOf(active)
  const after = labels.slice(at + 1).concat(labels.slice(0, Math.max(0, at)))
  return after.find((label) => !isFilled(problem, label, entries[label])) ?? labels[(at + 1) % labels.length] ?? null
}

export function MathAnswerSheet({
  problem,
  entries,
  active,
  onActivate,
  onEntry,
  perBox = null,
  reveal = false,
}) {
  const parts = problem.parts ?? []
  const numbered = parts.length > 1
  const checked = Boolean(perBox) || reveal
  const activeChoice = !checked && active && isChoiceBox(problem, active)

  return (
    <section className="mt-4 rounded-[1.75rem] bg-white p-4 shadow-card" aria-label="解答欄" data-math-exam-answer>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-extrabold tracking-wide text-violet-700">解答欄</p>
        {!checked && (
          <p className="text-[10px] font-bold text-ink/50">欄を押して、下の数字キーで入れる</p>
        )}
      </div>

      <div className="mt-2 space-y-3">
        {parts.map((part, partIndex) => {
          const partLabels = templateBoxes(part.answer)
          return (
            <div key={partIndex} className="rounded-2xl bg-violet-50/60 px-3 py-2.5" data-math-exam-part={partIndex}>
              {(numbered || part.q) && (
                <p className="text-sm font-bold leading-relaxed text-ink/80">
                  {numbered && <span className="mr-1 font-extrabold text-violet-700">{`(${partIndex + 1})`}</span>}
                  {part.q && <MathText>{part.q}</MathText>}
                </p>
              )}
              <MathBlock
                tex={renderAnswerTex(problem, part.answer, { values: entries, active, perBox, reveal: reveal && !perBox })}
                className="mt-1 overflow-x-auto text-ink [&_.katex]:text-[1.15rem]"
              />
              <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="欄を選ぶ">
                {partLabels.map((label) => {
                  const choice = isChoiceBox(problem, label)
                  const value = entries[label]
                  const shown = choice
                    ? (Number.isInteger(value) ? choiceMark(value) : '')
                    : normalizeEntry(value) || (value === '-' ? '−' : '')
                  const ok = perBox?.[label]
                  return (
                    <button
                      key={label}
                      type="button"
                      disabled={checked}
                      onClick={() => onActivate(label)}
                      aria-pressed={label === active}
                      aria-label={`欄${label}${shown ? `（いまは ${shown}）` : '（空）'}`}
                      data-math-exam-box={label}
                      className={cx(
                        'flex min-h-11 min-w-[4.25rem] items-center gap-1.5 rounded-xl border-2 px-2.5 py-1.5 text-left transition-all',
                        !checked && label === active && 'border-violet-600 bg-white shadow-sm',
                        !checked && label !== active && 'border-violet-200 bg-white/80',
                        checked && ok && 'border-emerald-400 bg-correct-soft',
                        checked && perBox && !ok && 'border-rose-400 bg-wrong-soft',
                        checked && !perBox && 'border-violet-200 bg-white/80',
                      )}
                    >
                      <span className="text-xs font-extrabold text-violet-700">{label}</span>
                      <span className="min-w-[1.5rem] font-display text-base font-extrabold tabular-nums text-ink">
                        {shown || <span className="text-ink/25">―</span>}
                      </span>
                      {perBox && !ok && (
                        <span className="text-[11px] font-extrabold text-emerald-700">
                          {`→ ${choice ? choiceMark(problem.boxes[label]) : problem.boxes[label]}`}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              {checked && (
                <MathBlock
                  tex={answerTexWithValues(problem, part.answer)}
                  className="mt-2 overflow-x-auto text-emerald-900 [&_.katex]:text-[1.05rem]"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* 選択式の欄：選択肢から選ぶ。 */}
      {activeChoice && (
        <div className="mt-3 space-y-2" role="group" aria-label={`欄${active}の選択肢`} data-math-exam-choices={active}>
          {problem.choices[active].options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onEntry(active, index)
                const following = nextAnswerBox(problem, { ...entries, [active]: index }, active)
                if (following && following !== active) onActivate(following)
              }}
              aria-pressed={entries[active] === index}
              className={cx(
                'flex w-full items-start gap-2.5 rounded-2xl border-2 px-3 py-2.5 text-left text-sm font-bold transition-all active:scale-[0.99]',
                entries[active] === index ? 'border-violet-600 bg-violet-50 text-ink' : 'border-violet-100 bg-white text-ink/85',
              )}
            >
              <span className="shrink-0 font-display text-base font-extrabold text-violet-700">{choiceMark(index)}</span>
              <span className="min-w-0 flex-1 leading-relaxed"><MathText>{option}</MathText></span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

// 数字キー：2段の横長の並び。いま入れている欄と値を左はしに出す。
const KEY_ROWS = Object.freeze([
  ['1', '2', '3', '4', '5', 'minus', 'back'],
  ['6', '7', '8', '9', '0', 'next'],
])
const KEY_LABELS = Object.freeze({ minus: '−', back: '⌫', next: '次の欄' })
const KEY_NAMES = Object.freeze({ minus: '符号を入れかえる', back: '1字消す', next: '次の欄へ' })

export function MathAnswerKeypad({ problem, entries, active, onActivate, onEntry }) {
  const choice = active && isChoiceBox(problem, active)
  const value = active ? entries[active] : ''

  const press = (key) => {
    if (!active) return
    if (key === 'next') {
      const following = nextAnswerBox(problem, entries, active)
      if (following) onActivate(following)
      return
    }
    if (choice) return
    onEntry(active, pressAnswerKey(entries[active] ?? '', key))
  }

  // パソコンのキーボードでも入れられるようにする（数字・マイナス・Backspace・Enter で次の欄）。
  useEffect(() => {
    const onKey = (event) => {
      if (event.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (/^\d$/.test(event.key)) press(event.key)
      else if (event.key === '-') press('minus')
      else if (event.key === 'Backspace') press('back')
      else if (event.key === 'Enter') press('next')
      else return
      event.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="space-y-1.5" data-math-exam-keypad>
      <p className="flex items-center gap-2 px-1 text-xs font-extrabold text-ink/60" aria-live="polite">
        <span className="rounded-md bg-violet-600 px-1.5 py-0.5 text-white">{active ? `欄${active}` : '欄'}</span>
        {choice
          ? <span>上の選択肢から選ぶ</span>
          : <span className="font-display text-base tabular-nums text-ink">{normalizeEntry(value) || (value === '-' ? '−' : '―')}</span>}
      </p>
      {KEY_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-7 gap-1.5">
          {row.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              disabled={!active || (choice && key !== 'next')}
              aria-label={KEY_NAMES[key] ?? key}
              className={cx(
                'flex h-11 items-center justify-center rounded-xl font-display font-extrabold transition-transform active:scale-95 disabled:opacity-40',
                key === 'next' ? 'col-span-2 bg-violet-600 text-sm text-white' : KEY_NAMES[key] ? 'bg-violet-100 text-lg text-violet-800' : 'bg-paper text-lg text-ink shadow-sm',
              )}
              data-math-exam-key={key}
            >
              {KEY_LABELS[key] ?? key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
