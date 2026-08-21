import { reviewMarksForEntry } from '../lib/reviewHistory.js'
import { cx } from './ui.jsx'

function MarkRow({ label, marks }) {
  if (!marks.length) return null
  const text = marks.map((mark) => (mark ? '○' : '×')).join('')
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${label}履歴 ${text.split('').join('、')}`}>
      <span className="text-[10px] font-extrabold text-ink/40">{label}</span>
      <span className="inline-flex gap-0.5" aria-hidden="true">
        {marks.map((mark, index) => (
          <span
            key={`${mark}-${index}`}
            className={cx(
              'grid h-4 min-w-4 place-items-center rounded-full text-[11px] font-black leading-none',
              mark ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600',
            )}
          >
            {mark ? '○' : '×'}
          </span>
        ))}
      </span>
    </span>
  )
}

export function VocabReviewHistory({ entry, className = '' }) {
  const marks = reviewMarksForEntry(entry)
  if (!marks.memory.length && !marks.test.length) return null

  return (
    <div
      className={cx('flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1', className)}
      data-vocab-review-history
    >
      <MarkRow label="学習" marks={marks.memory} />
      <MarkRow label="クイズ" marks={marks.test} />
    </div>
  )
}
