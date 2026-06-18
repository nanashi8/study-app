// 共通UIプリミティブ。
export const cx = (...xs) => xs.filter(Boolean).join(' ')

const VARIANTS = {
  primary:
    'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-pop active:from-brand-600 active:to-brand-700',
  secondary:
    'bg-white text-brand-700 border-2 border-brand-200 active:bg-brand-50',
  ghost: 'bg-transparent text-brand-700 active:bg-brand-50',
  soft: 'bg-brand-100 text-brand-700 active:bg-brand-200',
  success: 'bg-gradient-to-b from-emerald-400 to-emerald-500 text-white shadow-[0_8px_20px_-8px_rgba(16,185,129,0.6)]',
  danger: 'bg-gradient-to-b from-rose-400 to-rose-500 text-white shadow-[0_8px_20px_-8px_rgba(244,63,94,0.6)]',
  hint: 'bg-amber-100 text-amber-700 border-2 border-amber-200 active:bg-amber-200',
}

const SIZES = {
  sm: 'h-9 px-3 text-sm rounded-xl',
  md: 'h-12 px-5 text-base rounded-2xl',
  lg: 'h-14 px-6 text-lg rounded-2xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center gap-2 font-bold tracking-wide',
        'transition-transform duration-100 active:scale-[0.97]',
        'disabled:opacity-40 disabled:active:scale-100 select-none',
        VARIANTS[variant],
        SIZES[size],
        full && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function IconButton({ className = '', children, ...props }) {
  return (
    <button
      className={cx(
        'inline-flex h-11 w-11 items-center justify-center rounded-full',
        'text-brand-700 active:bg-brand-100 transition-colors',
        'active:scale-90 transition-transform select-none',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={cx('rounded-3xl bg-white shadow-card', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function Chip({ className = '', color, children, style }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
        !color && 'bg-brand-100 text-brand-700',
        className,
      )}
      style={color ? { backgroundColor: `${color}1a`, color, ...style } : style}
    >
      {children}
    </span>
  )
}

export function ProgressBar({ value = 0, className = '', color = 'var(--color-brand-500)' }) {
  const pct = Math.max(0, Math.min(100, value * 100))
  return (
    <div className={cx('h-2.5 w-full overflow-hidden rounded-full bg-brand-100', className)}>
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

export function ProgressRing({
  value = 0,
  size = 64,
  stroke = 7,
  color = 'var(--color-brand-500)',
  track = 'var(--color-brand-100)',
  children,
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(1, value))
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

export function SectionTitle({ children, right }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-display text-lg font-extrabold text-ink/90">{children}</h2>
      {right}
    </div>
  )
}

export function EmptyState({ icon, title, children }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-white/60 px-6 py-12 text-center">
      {icon && <div className="text-4xl">{icon}</div>}
      <p className="font-bold text-ink/80">{title}</p>
      {children && <p className="text-sm text-ink/50">{children}</p>}
    </div>
  )
}
