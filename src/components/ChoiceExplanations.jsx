import { cx } from './ui.jsx'

/**
 * 答え合わせで、出題した選択肢を1件も省かずに並べる。
 * 単語・熟語などのテストは「その選択肢がどの項目の意味か」を、問題形式のテストは
 * 「その選択肢がこの問題で正しい理由・合わない理由」を本文に置く。
 * rows は画面の選択肢ボタンと同じ並びから作り、表示した選択肢が欄から抜けないようにする。
 */
export function ChoiceExplanations({
  title,
  name,
  rows,
  className = '',
  renderText = (text) => text,
}) {
  if (!rows?.length) return null

  return (
    <section
      className={cx('rounded-2xl bg-slate-50 p-3 text-left ring-1 ring-slate-200', className)}
      data-choice-explanations={name}
      aria-label={title}
    >
      <p className="mb-2 text-sm font-extrabold text-brand-700">{title}</p>
      <ul className="space-y-1.5">
        {rows.map((row) => (
          <li
            key={row.id}
            data-choice-explanation={row.id}
            data-choice-correct={row.correct ? 'true' : 'false'}
            className={cx(
              'rounded-xl bg-white px-3 py-2',
              row.correct && 'ring-1 ring-emerald-300',
              row.chosen && !row.correct && 'ring-2 ring-rose-300',
            )}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-display text-sm font-extrabold leading-relaxed text-ink">
                {typeof row.heading === 'string' ? renderText(row.heading) : row.heading}
              </span>
              {row.correct && (
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-extrabold text-white">正解</span>
              )}
              {row.chosen && !row.correct && (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-extrabold text-white">あなたの回答</span>
              )}
            </div>
            {row.body && (
              <div className="mt-0.5 text-xs font-bold leading-relaxed text-ink/65">
                {typeof row.body === 'string' ? renderText(row.body) : row.body}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
