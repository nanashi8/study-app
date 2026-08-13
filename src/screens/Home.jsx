import { useStore } from '../store/useStore.js'
import {
  ArrowRight,
  Book,
  BookOpen,
  Headphones,
  Lightbulb,
  Sparkles,
} from '../components/Icons.jsx'

const PRIMARY_LEARNING_MODES = [
  { id: 'vocab', label: '単語', Icon: Book, color: '#6366f1', screen: 'vocabLevels' },
  { id: 'reading', label: '長文', Icon: BookOpen, color: '#10b981', screen: 'readingList' },
  { id: 'phrases', label: '熟語・構文', Icon: Sparkles, color: '#8b5cf6', screen: 'phrases' },
  { id: 'grammar', label: '文法', Icon: Lightbulb, color: '#f59e0b', screen: 'grammar' },
  { id: 'listening', label: 'リスニング', Icon: Headphones, color: '#0284c7', screen: 'listening' },
]

function LearningModeButton({ mode, onOpen }) {
  const { Icon } = mode
  return (
    <button
      type="button"
      onClick={() => onOpen(mode.screen, mode.params)}
      className="flex min-h-14 items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white px-3 py-2.5 text-left shadow-sm active:bg-brand-50"
      data-home-mode={mode.id}
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white"
        style={{ backgroundColor: mode.color }}
      >
        <Icon size={19} />
      </span>
      <span className="min-w-0 flex-1 truncate font-display text-sm font-extrabold text-ink">
        {mode.label}
      </span>
      <ArrowRight size={16} className="shrink-0 text-ink/25" />
    </button>
  )
}

function LearningMenu({ navigate }) {
  const open = (screen, params) => navigate(screen, params ?? {})

  return (
    <div className="min-h-full bg-slate-100 pb-8" data-home-learning-menu>
      <header className="sticky top-0 z-20 min-h-16 border-b border-slate-200/80 bg-white/95 px-4 py-2.5 backdrop-blur">
        <div className="min-w-0">
          <p className="text-xs font-extrabold tracking-[0.14em] text-brand-500">SELECT MODE</p>
          <h1 className="font-display text-xl font-extrabold text-ink">英語の主要学習</h1>
        </div>
      </header>

      <div className="space-y-4 px-4 pt-4">
        <section>
          <h2 className="mb-2 px-1 font-display text-sm font-extrabold text-ink/65">学ぶ分野を選ぶ</h2>
          <div className="grid grid-cols-2 gap-2.5" data-home-mode-group="primary">
            {PRIMARY_LEARNING_MODES.map((mode) => (
              <LearningModeButton key={mode.id} mode={mode} onOpen={open} />
            ))}
          </div>
        </section>
        <p className="rounded-2xl bg-white px-4 py-3 text-sm font-bold leading-relaxed text-ink/50 shadow-sm">
          学習アドバイザー、診断、発展学習、保存リスト、記録は、上部の「メニュー」にまとめています。
        </p>
      </div>
    </div>
  )
}

export function HomeScreen() {
  const navigate = useStore((state) => state.navigate)
  return <LearningMenu navigate={navigate} />
}
