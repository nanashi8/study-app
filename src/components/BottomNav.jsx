import { useStore } from '../store/useStore.js'
import { Home, Book, Bookmark, Chart, Menu } from './Icons.jsx'
import { cx } from './ui.jsx'

const TABS = [
  { key: 'home', label: 'ホーム', screen: 'home', Icon: Home },
  { key: 'vocab', label: '単語', screen: 'vocabLevels', Icon: Book },
  { key: 'mylist', label: 'マイ単語', screen: 'myList', Icon: Bookmark },
  { key: 'stats', label: '記録', screen: 'progress', Icon: Chart },
  { key: 'menu', label: 'メニュー', screen: null, Icon: Menu },
]

// 各画面がどのタブに属するか。
const SCREEN_TO_TAB = {
  home: 'home',
  vocabLevels: 'vocab',
  vocabGroups: 'vocab',
  vocabDecks: 'vocab',
  vocabStudy: 'vocab',
  vocabQuiz: 'vocab',
  sessionResult: 'vocab',
  wordDetail: 'vocab',
  rootDetail: 'vocab',
  roots: 'vocab',
  etymologyPack: 'vocab',
  etymologyStudy: 'vocab',
  vocabSearch: 'vocab',
  myList: 'mylist',
  myGrammar: 'mylist',
  progress: 'stats',
  settings: 'menu',
  readingList: 'home',
  reader: 'home',
  readingSummary: 'home',
  phrases: 'home',
  phraseStudy: 'home',
  phraseQuiz: 'home',
  listening: 'home',
  listeningQuiz: 'home',
  dictation: 'home',
  dictationPlay: 'home',
  writing: 'home',
}

export function BottomNav() {
  const screen = useStore((s) => s.screen)
  const navigate = useStore((s) => s.navigate)
  const goHome = useStore((s) => s.goHome)
  const openSpeechSettings = useStore((s) => s.openSpeechSettings)
  const menuOpen = useStore((s) => s.speechSettingsOpen)
  const active = SCREEN_TO_TAB[screen] ?? 'home'

  return (
    <nav className="shrink-0 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around px-1">
        {TABS.map(({ key, label, screen: target, Icon }) => {
          const on = key === 'menu' ? menuOpen || active === 'menu' : active === key
          return (
            <button
              key={key}
              onClick={() => (
                key === 'menu'
                  ? openSpeechSettings()
                  : target === 'home'
                    ? goHome()
                    : navigate(target)
              )}
              aria-label={key === 'menu' ? 'メニューを開く' : undefined}
              className={cx(
                'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 py-1.5 transition-colors select-none',
                on ? 'text-brand-700' : 'text-ink/55',
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
