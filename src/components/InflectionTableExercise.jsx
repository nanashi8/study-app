import { useState } from 'react'
import { inflectionBlankNote } from '../lib/inflectionQuiz.js'
import { cx } from './ui.jsx'
import { Check, Close } from './Icons.jsx'

// 語形変化の表の問題（文法の「語形変化」）。約5語の活用表のうち3か所が空所。
// 空所を押して選び、下の語のタイルを押して入れる。入れた空所をもう一度押すと空に戻す。
// 入れた語は「|」でつないだ文字列で親（GrammarQuiz）へ渡し、答え合わせで round.answer と比べる。

const EMPTY = ''
export const splitFills = (value, count) => {
  const parts = String(value ?? '').split('|')
  return Array.from({ length: count }, (_, index) => parts[index] ?? EMPTY)
}

export function InflectionTableExercise({ item, value, checked = false, onChange }) {
  const blanks = item.blanks ?? []
  const fills = splitFills(value, blanks.length)
  const [active, setActive] = useState(() => Math.max(0, fills.findIndex((fill) => !fill)))
  const answers = String(item.answer ?? '').split('|')
  const blankIndexAt = (r, c) => blanks.findIndex((blank) => blank.r === r && blank.c === c)

  // タイルは同じつづりが2枚あることもある（played が過去形と過去分詞の両方の空所の正解のとき）。使った枚数で消す。
  const usedCount = (text) => fills.filter((fill) => fill === text).length
  const tileCount = (text) => (item.bank ?? []).filter((tile) => tile === text).length

  const update = (next) => onChange?.(next.join('|'), { complete: next.every(Boolean) })
  const pressBlank = (index) => {
    if (checked) return
    if (index === active && fills[index]) {
      const next = [...fills]
      next[index] = EMPTY
      update(next)
      return
    }
    setActive(index)
  }
  const pressTile = (text) => {
    if (checked) return
    const target = fills[active] === EMPTY ? active : fills.findIndex((fill) => !fill)
    const at = target < 0 ? active : target
    const next = [...fills]
    next[at] = text
    update(next)
    const nextEmpty = next.findIndex((fill, index) => !fill && index !== at)
    if (nextEmpty >= 0) setActive(nextEmpty)
  }

  return (
    <div data-inflection-table={item.id}>
      <div className="overflow-x-auto rounded-2xl bg-white p-2 shadow-card">
        <table className="w-full min-w-[19rem] border-separate border-spacing-1 text-left">
          <thead>
            <tr>
              {item.columns.map((column) => (
                <th key={column} className="px-1 text-[10px] font-extrabold text-ink/45">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {item.rows.map((row, r) => (
              <tr key={row.wordId} data-inflection-table-row={row.wordId}>
                {row.cells.map((cell, c) => {
                  const index = blankIndexAt(r, c)
                  if (index < 0) {
                    return (
                      <td key={cell.id} className="rounded-lg bg-brand-50/60 px-1.5 py-1 align-top">
                        <span className="block break-all font-display text-[13px] font-extrabold text-ink">{cell.answer}</span>
                        {c === 0 && <span className="block text-[10px] font-bold leading-tight text-ink/50">{row.meaning}</span>}
                      </td>
                    )
                  }
                  const fill = fills[index]
                  const right = checked && fill === answers[index]
                  const wrong = checked && !right
                  return (
                    <td key={cell.id} className="align-top">
                      <button
                        type="button"
                        onClick={() => pressBlank(index)}
                        aria-pressed={!checked && index === active}
                        aria-label={`${row.head} の${cell.label}の空所${fill ? `（${fill}）` : ''}`}
                        data-inflection-blank={index}
                        className={cx(
                          'flex min-h-9 w-full flex-col items-start rounded-lg border-2 px-1.5 py-1 text-left',
                          !checked && index === active && 'border-sky-500 bg-sky-50',
                          !checked && index !== active && 'border-dashed border-sky-300 bg-white',
                          right && 'border-emerald-400 bg-correct-soft',
                          wrong && 'border-rose-400 bg-wrong-soft',
                        )}
                      >
                        <span className={cx('flex items-center gap-0.5 break-all font-display text-[13px] font-extrabold', fill ? 'text-ink' : 'text-sky-400')}>
                          {fill || '？'}
                          {right && <Check size={12} className="shrink-0 text-emerald-600" />}
                          {wrong && <Close size={12} className="shrink-0 text-rose-500" />}
                        </span>
                        {wrong && <span className="break-all text-[11px] font-extrabold text-emerald-700">{answers[index]}</span>}
                        {c === 0 && <span className="text-[10px] font-bold leading-tight text-ink/50">{row.meaning}</span>}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!checked && (
        <div className="mt-3 flex flex-wrap gap-2" data-inflection-bank>
          {(item.bank ?? []).map((text, index) => {
            const spent = usedCount(text) >= tileCount(text)
            return (
              <button
                key={`${text}-${index}`}
                type="button"
                disabled={spent}
                onClick={() => pressTile(text)}
                data-inflection-tile={text}
                className={cx(
                  'rounded-xl border-2 px-3 py-2 font-display text-sm font-extrabold transition-all',
                  spent ? 'border-transparent bg-paper text-ink/25' : 'border-brand-100 bg-white text-ink active:scale-[0.98] active:bg-brand-50',
                )}
              >
                {text}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** 答え合わせ：空所ごとに、入れた語の正誤と説明。 */
export function InflectionTableExplanations({ item, value, className = '' }) {
  const blanks = item.blanks ?? []
  const fills = splitFills(value, blanks.length)
  const answers = String(item.answer ?? '').split('|')
  return (
    <div className={cx('space-y-2', className)} data-inflection-table-explanations>
      <p className="font-display text-sm font-extrabold text-ink/70">{`空所ごとの解説（${blanks.length}か所）`}</p>
      {blanks.map((blank, index) => {
        const row = item.rows[blank.r]
        const cell = row.cells[blank.c]
        const fill = fills[index]
        const right = fill === answers[index]
        return (
          <div
            key={cell.id}
            className={cx('rounded-xl p-2.5 ring-1', right ? 'bg-emerald-50/70 ring-emerald-100' : 'bg-rose-50/70 ring-rose-100')}
            data-inflection-blank-explanation={index}
          >
            <p className="text-xs font-extrabold text-ink/60">
              {`${row.head} の${cell.label}：`}
              <span className="font-display text-sm text-emerald-700">{cell.answer}</span>
              {!right && fill && <span className="ml-1 text-rose-600">{`（あなたの答え ${fill}）`}</span>}
            </p>
            {!right && fill && (
              <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/75">{inflectionBlankNote(item, blank, fill)}</p>
            )}
            <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/75">{inflectionBlankNote(item, blank, cell.answer)}</p>
          </div>
        )
      })}
    </div>
  )
}
