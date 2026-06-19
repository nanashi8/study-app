import { useStore } from '../store/useStore.js'
import { Home, Book, Bookmark, Chart, Gear } from './Icons.jsx'
import { cx } from './ui.jsx'

const TABS = [
  { key: 'home', label: 'ホーム', screen: 'home', Icon: Home },
  { key: 'vocab', label: '単語', screen: 'vocabLevels', Icon: Book },
  { key: 'mylist', label: 'マイ単語', screen: 'myList', Icon: Bookmark },
  { key: 'stats', label: '記録', screen: 'progress', Icon: Chart },
  { key: 'settings', label: '設定', screen: 'settings', Icon: Gear },
]

// 各画面がどのタブに属するか。
const SCREEN_TO_TAB = {
  home: 'home',
  vocabLevels: 'vocab',
  vocabDecks: 'vocab',
  vocabStudy: 'vocab',
  vocabQuiz: 'vocab',
  sessionResult: 'vocab',
  wordDetail: 'vocab',
  rootDetail: 'vocab',
  vocabSearch: 'vocab',
  myList: 'mylist',
  progress: 'stats',
  settings: 'settings',
  englishMap: 'home',
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
  pronounce: 'home',
  pronouncePlay: 'home',
}

export function BottomNav() {
  const screen = useStore((s) => s.screen)
  const navigate = useStore((s) => s.navigate)
  const goHome = useStore((s) => s.goHome)
  const active = SCREEN_TO_TAB[screen] ?? 'home'

  return (
    <nav className="shrink-0 border-t border-brand-100 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around px-1">
        {TABS.map(({ key, label, screen: target, Icon }) => {
          const on = active === key
          return (
            <button
              key={key}
              onClick={() => (target === 'home' ? goHome() : navigate(target))}
              className={cx(
                'flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors select-none',
                on ? 'text-brand-600' : 'text-ink/35',
              )}
            >
              <span className={cx('transition-transform', on && '-translate-y-0.5 scale-110')}>
                <Icon size={24} strokeWidth={on ? 2.4 : 2} />
              </span>
              <span className={cx('text-[10px]', on ? 'font-extrabold' : 'font-bold')}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
