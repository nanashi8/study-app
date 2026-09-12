import { cx } from './ui.jsx'
import { ArrowRight } from './Icons.jsx'

// アプリのホーム（学ぶ内容を選ぶ画面）。英語アプリのホームと同じ見出し・同じ並びにそろえる。
// 古典アプリ・漢文アプリでも、ここでコンテンツを選び、そのトップ（今日の学習・単語帳・カード）へ進む。

export function ContentMenu({ eyebrow = '学ぶ内容を選ぶ', title, children, className = '', ...props }) {
  return (
    <div className={cx('min-h-full bg-slate-100 pb-8', className)} {...props}>
      <header className="sticky top-0 z-20 min-h-16 border-b border-slate-200/80 bg-white/95 px-4 py-2.5 backdrop-blur">
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-brand-500">{eyebrow}</p>
          <h1 className="font-display text-xl font-extrabold text-ink">{title}</h1>
        </div>
      </header>
      <div className="space-y-4 px-4 pt-4">{children}</div>
    </div>
  )
}

/** 見出しつきの、コンテンツを1列に並べるまとまり。 */
export function ContentMenuSection({ title, children, ...props }) {
  return (
    <section>
      <h2 className="mb-2 px-1 font-display text-sm font-extrabold text-ink/65">{title}</h2>
      <div className="grid grid-cols-1 gap-2.5" {...props}>{children}</div>
    </section>
  )
}

/** コンテンツ1つの入口。英語アプリのホームと同じ形（色のついたアイコン・名前・矢印）。 */
export function ContentMenuButton({ icon: Icon, color, label, ...props }) {
  return (
    <button
      type="button"
      className="flex min-h-14 items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white px-3 py-2.5 text-left shadow-sm active:bg-brand-50"
      {...props}
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white"
        style={{ backgroundColor: color }}
      >
        <Icon size={19} />
      </span>
      <span className="min-w-0 flex-1 font-display text-sm font-extrabold text-ink">{label}</span>
      <ArrowRight size={16} className="shrink-0 text-ink/25" />
    </button>
  )
}
