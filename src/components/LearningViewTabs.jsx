import { cx } from './ui.jsx'
import { scrollScreenToTop } from '../lib/screenScroll.js'

// 教材の「学ぶ画面」と「一覧を確認」を行き来する共通タブ。
// 英単語の級画面と同じ並び・同じ表記を、ほかの教材でも使う。
export function LearningViewTabs({
  view,
  onChange,
  learnValue = 'home',
  learnLabel = '学ぶ',
  listValue = 'list',
  listLabel = '一覧を確認',
  label = 'この教材の見方',
  className = '',
  ...rest
}) {
  return (
    <div
      className={cx('grid grid-cols-2 rounded-xl bg-brand-50 p-1', className)}
      role="tablist"
      aria-label={label}
      {...rest}
    >
      {[
        [learnValue, learnLabel],
        [listValue, listLabel],
      ].map(([id, tabLabel]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={view === id}
          onClick={() => {
            scrollScreenToTop()
            onChange(id)
          }}
          className={cx(
            'min-h-11 rounded-lg px-2 text-xs font-extrabold transition-colors',
            view === id
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-ink/50 active:bg-white/70',
          )}
        >
          {tabLabel}
        </button>
      ))}
    </div>
  )
}
