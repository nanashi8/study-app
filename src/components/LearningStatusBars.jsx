import {
  LEARNING_STATUS_KEYS,
  QUIZ_STATUS_KEYS,
  statusTotal,
} from '../lib/contentProgress.js'
import { cx } from './ui.jsx'

export const LEARNING_STATUS_META = Object.freeze({
  learned: { label: '学習済', color: '#059669' },
  reviewing: { label: '復習中', color: '#f59e0b' },
  unlearned: { label: '未学習', color: '#cbd5e1' },
})

export const QUIZ_STATUS_META = Object.freeze({
  correct: { label: '正解', color: '#0284c7' },
  incorrect: { label: '不正解', color: '#e11d48' },
  unanswered: { label: '未回答', color: '#cbd5e1' },
})

function statusScheme(kind) {
  return kind === 'quiz'
    ? { keys: QUIZ_STATUS_KEYS, meta: QUIZ_STATUS_META, title: 'クイズ' }
    : { keys: LEARNING_STATUS_KEYS, meta: LEARNING_STATUS_META, title: '学習' }
}

export function StatusDistributionBar({
  kind = 'learning',
  counts = {},
  className = '',
  compact = false,
  showLegend = true,
  unit = '',
}) {
  const { keys, meta, title } = statusScheme(kind)
  const total = statusTotal(counts, keys)
  const aria = `${title}: 全${total}${unit}中 ${keys.map((key) => `${meta[key].label} ${counts?.[key] ?? 0}`).join('、')}`

  return (
    <div className={cx('min-w-0', className)} data-status-distribution={kind}>
      <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-extrabold text-slate-600">
        <span>{title}</span>
        <span className="tabular-nums text-slate-400">全{total.toLocaleString('ja-JP')}{unit}</span>
      </div>
      <div
        role="img"
        aria-label={aria}
        className={cx(
          'flex w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200',
          compact ? 'h-2.5' : 'h-3',
        )}
        data-status-bar={kind}
      >
        {keys.map((key) => {
          const count = Math.max(0, Number(counts?.[key]) || 0)
          const width = total ? (count / total) * 100 : key === keys.at(-1) ? 100 : 0
          return (
            <span
              key={key}
              title={`${meta[key].label} ${count}`}
              data-status-segment={key}
              className="h-full transition-[width] duration-500 first:rounded-l-full last:rounded-r-full"
              style={{ width: `${width}%`, backgroundColor: meta[key].color }}
            />
          )
        })}
      </div>
      {showLegend && (
        <div className="mt-1.5 grid grid-cols-3 gap-x-1" aria-hidden="true">
          {keys.map((key) => (
            <span key={key} className="flex min-w-0 items-center gap-1 text-[9px] font-bold text-slate-500">
              <i className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: meta[key].color }} />
              <span className="truncate">{meta[key].label}</span>
              <b className="ml-auto tabular-nums text-slate-700">{(counts?.[key] ?? 0).toLocaleString('ja-JP')}</b>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// units で「全74項目」「全136問」のように、学習とクイズそれぞれの数え方を示す。
export function LearningStatusBars({
  progress,
  className = '',
  compact = false,
  units = {},
  showQuiz = true,
}) {
  return (
    <div className={cx('space-y-2.5', className)} data-learning-status-bars>
      <StatusDistributionBar
        kind="learning"
        counts={progress?.learning}
        compact={compact}
        unit={units.learning ?? ''}
      />
      {showQuiz && (
        <StatusDistributionBar
          kind="quiz"
          counts={progress?.quiz}
          compact={compact}
          unit={units.quiz ?? ''}
        />
      )}
    </div>
  )
}
