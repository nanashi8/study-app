import { useStore } from '../store/useStore.js'
import { requiresProgressSaveConfirmation } from '../lib/navigationPolicy.js'
import { appHomeForScreen, isAppHomeScreen } from '../lib/appHome.js'
import { IconButton, cx } from './ui.jsx'
import { ChevronLeft, Menu } from './Icons.jsx'
import { GlobalSpeechConsole } from './SpeechConsole.jsx'

// アプリ外枠。スマホは全幅、PCでは中央に「スマホ幅」のアプリを表示。
// 戻る操作とメニュー入口は、全公開画面で共通の上部バーに一度だけ置く。
export function AppShell({ children, showGlobalMenu = true }) {
  const screen = useStore((state) => state.screen)
  const stackLength = useStore((state) => state.stack.length)
  const globalBack = useStore((state) => state.globalBack)
  const openSpeechSettings = useStore((state) => state.openSpeechSettings)
  const goAppHome = useStore((state) => state.goAppHome)
  const goPortal = useStore((state) => state.goPortal)
  const menuOpen = useStore((state) => state.speechSettingsOpen)
  const canGoBack = screen !== 'portal' || stackLength > 0
  const goBack = () => {
    if (!canGoBack || menuOpen) return
    if (requiresProgressSaveConfirmation(screen, '__back__')) {
      openSpeechSettings('back')
      return
    }
    globalBack()
  }

  // 中央は「いまいるアプリのホームへ」。アプリのホームにいるときは入口へ戻す。
  // どの画面からでも一度で自分のアプリへ帰れるようにするための共通導線。
  const home = appHomeForScreen(screen)
  const atHome = isAppHomeScreen(screen)
  const homeLabel = atHome ? 'スタディアプリ' : home.label
  const goHomeFromBar = () => {
    if (menuOpen || screen === 'portal') return
    // 中央タイトルは現在のアプリへ戻る近道。回答済みの記録は自動保存されるため、
    // QR／コードの保存画面を誤って開かず、アプリホームへ直接移動する。
    if (atHome) goPortal()
    else goAppHome()
  }

  return (
    <div className="study-app-viewport flex w-full justify-center bg-brand-50">
      <div className="study-app-surface relative flex w-full max-w-md flex-col overflow-hidden bg-paper shadow-lg sm:rounded-none">
        {showGlobalMenu && (
          <div
            className="study-app-global-menu-bar relative z-[60] shrink-0 border-b border-slate-200/80 bg-white px-3 pb-2 pt-[calc(var(--app-safe-top)+0.5rem)]"
            data-global-menu-bar
          >
            <div className="flex min-h-11 items-center gap-2">
              <button
                type="button"
                onClick={goBack}
                disabled={!canGoBack || menuOpen}
                aria-label="戻る"
                data-global-back-button
                className="inline-flex h-11 shrink-0 items-center gap-0.5 rounded-full px-2.5 text-sm font-extrabold text-brand-700 active:bg-brand-50 disabled:text-ink/25 disabled:active:bg-transparent"
              >
                <ChevronLeft size={19} /> 戻る
              </button>
              <button
                type="button"
                onClick={goHomeFromBar}
                disabled={menuOpen || screen === 'portal'}
                aria-label={atHome ? 'スタディアプリの入口へ' : `${home.label}のホームへ`}
                data-global-home-button
                className="min-w-0 flex-1 truncate rounded-full px-2 py-1 text-center text-xs font-extrabold tracking-wide text-brand-700 active:bg-brand-50 disabled:text-ink/45 disabled:active:bg-transparent"
              >
                {homeLabel}
              </button>
              <button
                type="button"
                onClick={() => openSpeechSettings()}
                disabled={menuOpen}
                aria-label="メニューを開く"
                aria-expanded={menuOpen}
                data-global-menu-button
                className="inline-flex h-11 shrink-0 items-center gap-1 rounded-full px-2.5 text-sm font-extrabold text-brand-700 active:bg-brand-50 disabled:text-brand-300 disabled:active:bg-transparent"
              >
                <Menu size={18} /> メニュー
              </button>
            </div>
          </div>
        )}
        <main className="study-app-content no-scrollbar flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          {children}
        </main>
        <GlobalSpeechConsole />
        <div
          className="study-app-bottom-clearance shrink-0"
          data-app-bottom-clearance
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

// 各画面のタイトル用ヘッダー。通常の戻る操作は上の共通バーが担当し、
// onBack は同一画面内の場面切替が必要な特殊画面だけに使う。
export function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
  color,
  inverse = false,
  compact = false,
  showSpeechSettings = false,
  titleClassName = '',
  subtitleClassName = '',
}) {
  return (
    <header
      className={cx(
        'sticky top-0 z-20 flex items-center gap-2 border-b',
        compact ? 'min-h-12 px-3 py-1.5' : 'min-h-16 px-3 py-2.5',
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
      {onBack && (
        <IconButton
          onClick={onBack}
          aria-label="この画面内で戻る"
          className={inverse ? 'text-white active:bg-white/10' : ''}
        >
          <ChevronLeft size={24} />
        </IconButton>
      )}
      <div className="min-w-0 flex-1">
        {title && (
          <h1 className={cx(
            'truncate font-display text-xl font-extrabold leading-tight',
            inverse ? 'text-white' : 'text-ink',
            titleClassName,
          )}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p className={cx(
            'truncate text-[13px] font-bold leading-snug',
            inverse ? 'text-white/75' : 'text-ink/60',
            subtitleClassName,
          )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </header>
  )
}
