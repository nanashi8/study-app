import { reviewMarksForEntry } from '../lib/reviewHistory.js'
import {
  formatVocabularyDueDays,
  formatVocabularyElapsedDays,
  vocabularyReviewMetrics,
} from '../lib/vocabScheduler.js'
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
  if (!entry) return null
  const metrics = vocabularyReviewMetrics(entry)
  const status = metrics.learningStatus === 'unlearned'
    ? '未学習'
    : metrics.needsReview || metrics.learningStatus === 'reviewing'
      ? '復習中'
      : '学習済'
  const tone = status === '復習中'
    ? 'bg-amber-50 text-amber-800'
    : status === '学習済'
      ? 'bg-emerald-50 text-emerald-800'
      : 'bg-slate-50 text-slate-600'

  return (
    <div
      className={cx('flex flex-col items-center gap-1.5', className)}
      data-vocab-review-history
    >
      <div
        className={cx('flex flex-wrap items-center justify-center gap-x-2 rounded-full px-2.5 py-1 text-[10px] font-extrabold', tone)}
        data-vocab-review-status={metrics.learningStatus}
        aria-label={`${status}。${formatVocabularyElapsedDays(metrics.elapsedDays)}。${formatVocabularyDueDays(metrics.daysUntilDue)}`}
      >
        <span>{status}</span>
        <span>{formatVocabularyElapsedDays(metrics.elapsedDays)}</span>
        <span>{formatVocabularyDueDays(metrics.daysUntilDue)}</span>
      </div>
      {(marks.memory.length > 0 || marks.test.length > 0) && (
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
          <MarkRow label="学習" marks={marks.memory} />
          <MarkRow label="テスト" marks={marks.test} />
        </div>
      )}
    </div>
  )
}
