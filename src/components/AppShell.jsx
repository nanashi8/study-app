// アプリ外枠。スマホは全幅、PCでは中央に「スマホ幅」のアプリを表示。
export function AppShell({ children, nav }) {
  return (
    <div className="flex min-h-[100dvh] w-full justify-center bg-gradient-to-b from-brand-100 to-brand-50">
      <div className="relative flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-paper shadow-2xl sm:rounded-none">
        <main className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          {children}
        </main>
        {nav}
      </div>
    </div>
  )
}

// 各画面共通のヘッダー（戻る・タイトル・右アクション）。
import { useStore } from '../store/useStore.js'
import { IconButton } from './ui.jsx'
import { ChevronLeft } from './Icons.jsx'

export function ScreenHeader({ title, subtitle, right, onBack, color }) {
  const back = useStore((s) => s.back)
  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-1 px-2 py-2.5 backdrop-blur"
      style={{
        background: color
          ? `linear-gradient(to bottom, ${color}22, transparent)`
          : 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.0))',
      }}
    >
      <IconButton onClick={onBack ?? back} aria-label="戻る">
        <ChevronLeft size={24} />
      </IconButton>
      <div className="min-w-0 flex-1">
        {title && <h1 className="truncate font-display text-lg font-extrabold leading-tight text-ink">{title}</h1>}
        {subtitle && <p className="truncate text-xs font-bold text-ink/50">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}
