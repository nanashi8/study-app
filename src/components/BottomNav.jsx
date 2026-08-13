import { useStore } from '../store/useStore.js'
import { requiresProgressSaveConfirmation } from '../lib/navigationPolicy.js'
import { Home, Bookmark, Chart, Menu } from './Icons.jsx'
import { cx } from './ui.jsx'

const TABS = [
  { key: 'home', label: 'ホーム', screen: 'portal', Icon: Home },
  { key: 'learning', label: 'マイ学習', screen: 'myList', Icon: Bookmark },
  { key: 'records', label: '記録', screen: 'progress', Icon: Chart },
  { key: 'menu', label: 'メニュー', screen: null, Icon: Menu },
]

const SCREEN_TO_TAB = {
  portal: 'home',
  home: 'home',
  myLearning: 'learning',
  myList: 'learning',
  myGrammar: 'learning',
  kotenSaved: 'learning',
  progress: 'records',
  settings: 'menu',
}

export function BottomNav() {
  const screen = useStore((s) => s.screen)
  const navigate = useStore((s) => s.navigate)
  const goPortal = useStore((s) => s.goPortal)
  const openSpeechSettings = useStore((s) => s.openSpeechSettings)
  const menuOpen = useStore((s) => s.speechSettingsOpen)
  const active = SCREEN_TO_TAB[screen] ?? null

  const openDestination = (target) => {
    if (requiresProgressSaveConfirmation(screen, target)) {
      openSpeechSettings({ type: 'navigate', screen: target, params: {} })
      return
    }
    if (target === 'portal') goPortal()
    else navigate(target)
  }

  return (
    <nav
      className="relative z-[60] shrink-0 border-t border-slate-300 bg-white pb-[env(safe-area-inset-bottom)]"
      aria-label="統一下部メニュー"
      data-global-bottom-nav
    >
      <div className="flex items-stretch justify-around px-1">
        {TABS.map(({ key, label, screen: target, Icon }) => {
          const on = key === 'menu' ? menuOpen || active === 'menu' : active === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => (
                key === 'menu'
                  ? openSpeechSettings()
                  : openDestination(target)
              )}
              disabled={menuOpen && key !== 'menu'}
              aria-label={key === 'menu' ? 'メニューを開く' : undefined}
              aria-current={on && key !== 'menu' ? 'page' : undefined}
              data-bottom-nav-key={key}
              className={cx(
                'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 py-1.5 transition-colors select-none',
                on ? 'text-brand-700' : 'text-ink/55',
                menuOpen && key !== 'menu' && 'opacity-35',
              )}
            >
              <span className={cx(
                'grid h-7 w-11 place-items-center rounded-xl transition-colors',
                on && 'bg-brand-100',
              )}
              >
                <Icon size={22} strokeWidth={on ? 2.4 : 2} />
              </span>
              <span className={cx('text-xs', on ? 'font-extrabold' : 'font-bold')}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
