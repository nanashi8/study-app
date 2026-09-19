import { cx } from './ui.jsx'
import { Check } from './Icons.jsx'
import {
  GRAMMAR_REFERENCE_RESULTS,
  formatStudyDay,
  grammarReferenceHistory,
} from '../lib/grammarReferenceLog.js'

// 文法の参考書の学習記録。読み終えたら「まだまだ」「理解した」を押し、
// 押した日と結果を、目次・級をまたいだ一覧・ページの末尾に履歴として並べる。

/** 学習日と結果の履歴（新しい順）。limit を超えた分は「ほかN回」とまとめる。 */
export function StudyHistory({ history, limit = Infinity, className = '', ...props }) {
  if (!history.length) return null
  const shown = history.slice(0, limit)
  return (
    <span
      className={cx('flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-extrabold', className)}
      {...props}
    >
      <span className="text-ink/40">学習日</span>
      {shown.map((entry) => {
        const result = GRAMMAR_REFERENCE_RESULTS[entry.result]
        return (
          <span key={entry.day} className="tabular-nums" style={{ color: result.color }}>
            {`${formatStudyDay(entry.day)} ${result.label}`}
          </span>
        )
      })}
      {history.length > shown.length && (
        <span className="text-ink/40">{`ほか${history.length - shown.length}回`}</span>
      )}
    </span>
  )
}

/** ページの末尾に置く「まだまだ」「理解した」。同じ日に押し直すと、その日の結果が変わる。 */
export function StudySelfCheck({ pageId, log, today, question, onRecord }) {
  const history = grammarReferenceHistory(log, pageId)
  const todayResult = history.find((entry) => entry.day === today)?.result ?? null
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-card" data-grammar-self-check={pageId}>
      <h2 className="font-display text-base font-extrabold text-ink">{question}</h2>
      <div className="mt-2.5 grid grid-cols-2 gap-2" role="group" aria-label={question}>
        {['notYet', 'understood'].map((result) => {
          const meta = GRAMMAR_REFERENCE_RESULTS[result]
          const on = todayResult === result
          return (
            <button
              key={result}
              type="button"
              aria-pressed={on}
              onClick={() => onRecord(result)}
              className={cx(
                'flex min-h-12 items-center justify-center gap-1.5 rounded-xl border-2 px-2 text-sm font-extrabold transition-transform active:scale-[0.98]',
                on ? 'text-white' : 'bg-white',
              )}
              style={on
                ? { background: meta.color, borderColor: meta.color }
                : { borderColor: `${meta.color}55`, color: meta.color }}
              data-grammar-self-check-result={result}
            >
              {result === 'understood' && <Check size={16} />}
              {meta.label}
            </button>
          )
        })}
      </div>
      <StudyHistory history={history} className="mt-2.5" data-grammar-study-history={pageId} />
    </section>
  )
}
