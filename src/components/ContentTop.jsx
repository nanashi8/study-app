import { Children, cloneElement, isValidElement, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { WordBookStudySheet } from './WordListSheet.jsx'
import { cx } from './ui.jsx'
import { Cards, Check, ChevronRight, Refresh } from './Icons.jsx'

// 各コンテンツのトップの上部。英語アプリの単語画面と同じ並び
//（「今日の学習」の1枚 → 級・分野のほかの選び方の入口 → 級・分野のカード）で、どのコンテンツも同じ形にそろえる。

/** 「今日の学習」の1枚。今日すること（復習や、先に固める案内）を行で並べる。 */
export function TodayCard({ children, className = '', ...props }) {
  return (
    <section
      aria-label="今日の学習"
      className={cx(
        'divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

/** 「今日の学習」の1行。復習も、先に固める案内も同じ形で並べる。 */
export function TodayRow({ icon, iconClassName = '', iconStyle, title, detail, detailClassName = 'text-ink/55', ...props }) {
  // 2文の案内は文の切れ目（。）で折り返し、「あ／と352語」のように語の途中で行を割らない。
  // 1文が1行に収まらない狭い画面では、対応するブラウザで文節の切れ目を選ぶ（auto-phrase）。
  const sentences = String(detail).split(/(?<=。)/)
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors active:bg-slate-50 disabled:cursor-default disabled:opacity-50"
      {...props}
    >
      <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-xl', iconClassName)} style={iconStyle}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-sm font-extrabold text-ink">{title}</strong>
        <span className={cx('mt-0.5 block text-[11px] font-bold leading-snug [word-break:auto-phrase]', detailClassName)}>
          {sentences.map((sentence, index) => <span key={index} className="inline-block">{sentence}</span>)}
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-ink/25" />
    </button>
  )
}

/**
 * 復習の行。今日の復習があれば「今日の復習」、学んだけれど今日の分がなければ「復習日より前に練習」、
 * まだ何も学んでいなければ押せない「復習」を出す。unit は数え方（語・項目・問など）。
 */
export function ReviewTodayRow({ state, due = 0, nextInDays = Infinity, unit = '語', onStart, ...props }) {
  const complete = state === 'complete'
  const label = state === 'due' ? '今日の復習' : complete ? '復習日より前に練習' : '復習'
  const timing = state === 'due'
    ? `${due}${unit}を今日復習`
    : complete
      ? nextInDays === 1
        ? '次の復習日は明日'
        : Number.isFinite(nextInDays)
          ? `次の復習日まであと${nextInDays}日`
          : `学習済みの${unit}を確認`
      : '学習後に表示'
  return (
    <TodayRow
      disabled={state === 'empty'}
      onClick={onStart}
      aria-label={`${label}。${timing}`}
      data-review-state={state}
      icon={complete ? <Check size={20} /> : <Refresh size={20} />}
      iconClassName={complete ? 'bg-emerald-100 text-emerald-600' : 'bg-hint/20 text-amber-600'}
      title={label}
      detail={timing}
      detailClassName={state === 'due' ? 'text-amber-700' : complete ? 'text-emerald-700' : 'text-ink/50'}
      {...props}
    />
  )
}

/** 級・分野のほかの選び方の入口を、同じ大きさ・同じ形でそろえて並べる。1つだけなら横長の1行にする。 */
export function ChooserTiles({ children, className = '', ...props }) {
  const tiles = Children.toArray(children).filter(isValidElement)
  const columns = tiles.length >= 3 ? 'grid-cols-3' : tiles.length === 2 ? 'grid-cols-2' : 'grid-cols-1'
  return (
    <div className={cx('grid gap-2', columns, className)} {...props}>
      {tiles.length === 1 ? cloneElement(tiles[0], { wide: true }) : tiles}
    </div>
  )
}

/** 選び方の入口1つ。下の数だけが中身を表す。 */
export function ChooserTile({ icon, iconClassName, label, children, wide = false, ...props }) {
  if (wide) {
    return (
      <button
        type="button"
        className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-3.5 py-2.5 text-left shadow-card transition-colors active:bg-brand-50"
        {...props}
      >
        <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-xl', iconClassName)}>{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-extrabold text-ink">{label}</span>
          <span className="block text-[11px] font-bold text-ink/50">{children}</span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-ink/25" />
      </button>
    )
  }
  return (
    <button
      type="button"
      className="flex min-w-0 flex-col items-center rounded-2xl border border-slate-200/70 bg-white px-1 pb-2.5 pt-3 text-center shadow-card transition-colors active:bg-brand-50"
      {...props}
    >
      <span className={cx('grid h-9 w-9 place-items-center rounded-xl', iconClassName)}>{icon}</span>
      <span className="mt-1.5 text-sm font-extrabold text-ink">{label}</span>
      <span className="text-[11px] font-bold text-ink/50">{children}</span>
    </button>
  )
}

/**
 * 単語帳の入口。押すと、その教材（domain）を冊ごとに暗記・テストする単語帳の窓を開く。
 * どのコンテンツでも同じ冊を並べるので、数は単語帳の冊数で示す。
 */
export function WordBookTile({ domain, returnTo, ...props }) {
  const [open, setOpen] = useState(false)
  const count = useStore((state) => state.learningNotebook.sets.length)
  return (
    <>
      <ChooserTile
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`単語帳を選んで学ぶ。${count}冊`}
        data-content-word-books={domain}
        icon={<Cards size={19} />}
        iconClassName="bg-sky-100 text-sky-600"
        label="単語帳"
        {...props}
      >
        {count}冊
      </ChooserTile>
      <WordBookStudySheet
        open={open}
        onClose={() => setOpen(false)}
        domain={domain}
        returnTo={returnTo}
      />
    </>
  )
}
