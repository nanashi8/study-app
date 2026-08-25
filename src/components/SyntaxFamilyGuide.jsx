import { syntaxFamilyFor } from '../data/syntax-families.js'
import { Check, Lightbulb } from './Icons.jsx'
import { cx } from './ui.jsx'

export function SyntaxFamilyGuide({ item, className = '' }) {
  const guide = syntaxFamilyFor(item)
  if (!guide) return null

  return (
    <section
      className={cx('rounded-2xl bg-violet-50 p-4 ring-1 ring-violet-200', className)}
      data-syntax-family-guide
      data-syntax-family-id={guide.id}
      aria-label={`${guide.title}のまとめ`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-2 text-violet-700">
        <span className="rounded-full bg-violet-600 px-2 py-1 text-[10px] font-extrabold text-white">
          仲間で理解
        </span>
        <h3 className="font-display text-sm font-extrabold">{guide.title}</h3>
      </div>

      <p className="mt-2 text-sm font-bold leading-relaxed text-violet-950/85">
        {guide.summary}
      </p>

      <div className="mt-3 rounded-xl bg-white/80 p-3 ring-1 ring-violet-100">
        <div className="mb-1 text-[10px] font-extrabold tracking-wide text-violet-500">見分け方</div>
        <p className="text-xs font-bold leading-relaxed text-ink/75">{guide.decision}</p>
      </div>

      <div className="mt-3" role="list" aria-label="同じ仲間の構文比較">
        <div className="mb-1.5 text-[10px] font-extrabold tracking-wide text-violet-500">
          同じ仲間の形・意味・例
        </div>
        <div className="space-y-2">
          {guide.patterns.map((pattern) => (
            <div
              key={`${pattern.form}:${pattern.meaning}`}
              className="rounded-xl bg-white p-3 ring-1 ring-violet-100"
              role="listitem"
            >
              <p className="font-display text-xs font-extrabold leading-relaxed text-violet-800">
                {pattern.form}
              </p>
              <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/75">
                {pattern.meaning}
              </p>
              {pattern.example && (
                <div className="mt-1.5 border-l-2 border-violet-200 pl-2.5">
                  <p className="text-xs font-bold leading-relaxed text-ink">{pattern.example}</p>
                  <p className="text-[11px] font-bold leading-relaxed text-ink/50">{pattern.ja}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100">
        <div className="flex items-center gap-1.5 text-amber-700">
          <Lightbulb size={15} />
          <span className="text-[10px] font-extrabold tracking-wide">入試での見抜き方</span>
        </div>
        <p className="mt-1 text-xs font-bold leading-relaxed text-amber-950/80">{guide.examTip}</p>
      </div>

      <div className="mt-3">
        <div className="mb-1.5 text-[10px] font-extrabold tracking-wide text-rose-500">間違えやすい点</div>
        <ul className="space-y-1.5">
          {guide.pitfalls.map((pitfall) => (
            <li key={pitfall} className="flex gap-2 text-xs font-bold leading-relaxed text-rose-800">
              <Check size={14} className="mt-0.5 shrink-0 text-rose-400" />
              <span>{pitfall}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
