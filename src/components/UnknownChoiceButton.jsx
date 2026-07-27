import { cx } from './ui.jsx'

// 正解を推測させずに先へ進める、選択問題共通の回答ボタン。
export function UnknownChoiceButton({
  selected = false,
  disabled = false,
  onClick,
  label = 'わからない🙈',
  className = '',
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={cx(
        'w-full rounded-2xl border-2 border-dashed px-4 py-3 text-sm font-extrabold transition-all',
        selected
          ? 'border-amber-400 bg-hint-soft text-amber-800'
          : 'border-ink/15 bg-transparent text-ink/45 enabled:active:bg-ink/5',
        disabled && !selected && 'opacity-40',
        className,
      )}
    >
      {label}
    </button>
  )
}
