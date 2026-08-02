// アプリ外枠。スマホは全幅、PCでは中央に「スマホ幅」のアプリを表示。
export function AppShell({ children, nav }) {
  return (
    <div className="study-app-viewport flex min-h-[100dvh] w-full justify-center bg-brand-50">
      <div className="study-app-surface relative flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-paper shadow-lg sm:rounded-none">
        <main className="study-app-content no-scrollbar flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          {children}
        </main>
        {nav}
      </div>
    </div>
  )
}

// 各画面共通のヘッダー（戻る・タイトル・右アクション）。
import { useStore } from '../store/useStore.js'
import { IconButton, cx } from './ui.jsx'
import { ChevronLeft } from './Icons.jsx'
import { SpeechSettingsButton } from './SpeechSettings.jsx'

export function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
  color,
  inverse = false,
  showSpeechSettings = true,
}) {
  const back = useStore((s) => s.back)
  return (
    <header
      className={cx(
        'sticky top-0 z-20 flex min-h-16 items-center gap-2 border-b px-3 py-2.5',
        inverse ? 'border-white/10' : 'border-slate-200/80',
      )}
      style={{
        background: inverse
          ? (color ?? '#0f172a')
          : color
            ? `color-mix(in srgb, ${color} 10%, white)`
            : 'rgba(255,255,255,0.97)',
      }}
    >
      <IconButton
        onClick={onBack ?? back}
        aria-label="戻る"
        className={inverse ? 'text-white active:bg-white/10' : ''}
      >
        <ChevronLeft size={24} />
      </IconButton>
      <div className="min-w-0 flex-1">
        {title && (
          <h1 className={cx(
            'truncate font-display text-xl font-extrabold leading-tight',
            inverse ? 'text-white' : 'text-ink',
          )}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p className={cx(
            'truncate text-[13px] font-bold leading-snug',
            inverse ? 'text-white/75' : 'text-ink/60',
          )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {right}
      {showSpeechSettings && <SpeechSettingsButton inverse={inverse} />}
    </header>
  )
}
