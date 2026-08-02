import { useMemo } from 'react'
import { useStore } from '../store/useStore.js'
import { overallProgress } from '../lib/session.js'
import { buildLearningPowerProfile } from '../lib/learningPower.js'
import { AFTER_SCHOOL_CHRONICLE } from '../lib/afterSchoolStory.js'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import {
  ArrowRight,
  Book,
  BookOpen,
  Bookmark,
  Cards,
  ChevronLeft,
  Headphones,
  Keyboard,
  Lightbulb,
  Link,
  Refresh,
  Sparkles,
  Star,
  Target,
  Trophy,
} from '../components/Icons.jsx'

const PRIMARY_LEARNING_MODES = [
  { id: 'vocab', label: '単語', Icon: Book, color: '#6366f1', screen: 'vocabLevels' },
  { id: 'quiz', label: 'クイズ', Icon: Cards, color: '#0ea5e9', screen: 'vocabLevels', params: { intent: 'quiz' } },
  { id: 'reading', label: '長文', Icon: BookOpen, color: '#10b981', screen: 'readingList' },
  { id: 'phrases', label: '熟語・構文', Icon: Sparkles, color: '#8b5cf6', screen: 'phrases' },
  { id: 'grammar', label: '文法', Icon: Lightbulb, color: '#f59e0b', screen: 'grammar' },
  { id: 'listening', label: 'リスニング', Icon: Headphones, color: '#0284c7', screen: 'listening' },
]

const EXTRA_LEARNING_MODES = [
  { id: 'literature', label: '名作に親しむ', Icon: Headphones, color: '#0f766e', screen: 'literatureLibrary' },
  { id: 'writing', label: '英作文', Icon: BookOpen, color: '#4338ca', screen: 'writing' },
  { id: 'roots', label: '語源', Icon: Link, color: '#7c3aed', screen: 'roots' },
  { id: 'dictation', label: 'ディクテーション', Icon: Keyboard, color: '#0d9488', screen: 'dictation' },
  { id: 'saved-vocab', label: 'マイ単語', Icon: Bookmark, color: '#d97706', screen: 'myList' },
  { id: 'saved-grammar', label: 'マイ文法', Icon: Lightbulb, color: '#9333ea', screen: 'myGrammar' },
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

function LearningMenu({ navigate, onBack, recommendation }) {
  const open = (screen, params) => navigate(screen, params ?? {})

  return (
    <div className="min-h-full bg-slate-100 pb-8" data-home-learning-menu>
      <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-slate-200/80 bg-white/95 px-3 py-2.5 backdrop-blur">
        <button
          type="button"
          onClick={onBack}
          aria-label="スタディアプリへ戻る"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-ink/70 active:bg-brand-50"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold tracking-[0.14em] text-brand-500">SELECT MODE</p>
          <h1 className="font-display text-xl font-extrabold text-ink">学習を選ぶ</h1>
        </div>
        <SpeechSettingsButton compact />
      </header>

      <div className="space-y-4 px-4 pt-4">
        <section data-home-recommendation>
          <h2 className="mb-2 px-1 font-display text-sm font-extrabold text-ink/65">おすすめ</h2>
          <button
            type="button"
            onClick={() => navigate(recommendation.screen, recommendation.params)}
            className="flex min-h-14 w-full items-center gap-2.5 rounded-2xl bg-violet-100 px-3 py-2.5 text-left active:bg-violet-200"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-600 text-white">
              {recommendation.id === 'review' ? <Refresh size={19} /> : <Sparkles size={19} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-violet-700">いまのおすすめ</span>
              <span className="block truncate font-display text-sm font-extrabold text-violet-950">
                {recommendation.actionLabel}
              </span>
            </span>
            <ArrowRight size={16} className="shrink-0 text-violet-700/50" />
          </button>
        </section>

        <section>
          <h2 className="mb-2 px-1 font-display text-sm font-extrabold text-ink/65">基本学習</h2>
          <div className="grid grid-cols-2 gap-2.5" data-home-mode-group="primary">
            {PRIMARY_LEARNING_MODES.map((mode) => (
              <LearningModeButton key={mode.id} mode={mode} onOpen={open} />
            ))}
          </div>
        </section>

        <section data-home-mode-group="game">
          <h2 className="mb-2 px-1 font-display text-sm font-extrabold text-ink/65">ゲーム</h2>
          <button
            type="button"
            onClick={() => navigate('afterSchoolChronicle')}
            className="flex min-h-14 w-full items-center gap-2.5 rounded-2xl border border-violet-200/80 bg-white px-3 py-2.5 text-left shadow-sm active:bg-violet-50"
            data-home-mode="after-school-chronicle"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-600 text-white">
              <Star size={19} />
            </span>
            <span className="min-w-0 flex-1 truncate font-display text-sm font-extrabold text-ink">
              {AFTER_SCHOOL_CHRONICLE.title}
            </span>
            <ArrowRight size={16} className="shrink-0 text-ink/25" />
          </button>
        </section>

        <div className="grid grid-cols-2 gap-2.5" data-home-mode-group="support">
          <button
            type="button"
            onClick={() => open('diagnostic')}
            className="flex min-h-14 items-center gap-2.5 rounded-2xl bg-violet-100 px-3 text-left font-display text-sm font-extrabold text-violet-800 active:bg-violet-200"
          >
            <Trophy size={20} /> 学習診断
          </button>
          <button
            type="button"
            onClick={() => open('englishMap')}
            className="flex min-h-14 items-center gap-2.5 rounded-2xl bg-amber-100 px-3 text-left font-display text-sm font-extrabold text-amber-800 active:bg-amber-200"
          >
            <Target size={20} /> 学習マップ
          </button>
        </div>

        <details className="home-learning-more rounded-2xl border border-slate-200/80 bg-white">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-4 font-display text-sm font-extrabold text-brand-700">
            <span>そのほかの学習</span>
          </summary>
          <div className="grid grid-cols-2 gap-2.5 border-t border-slate-200/70 p-3" data-home-mode-group="secondary">
            {EXTRA_LEARNING_MODES.map((mode) => (
              <LearningModeButton key={mode.id} mode={mode} onOpen={open} />
            ))}
          </div>
        </details>
      </div>
    </div>
  )
}

export function HomeScreen() {
  const navigate = useStore((state) => state.navigate)
  const stats = useStore((state) => state.stats)
  const srs = useStore((state) => state.srs)
  const etymologySrs = useStore((state) => state.etymologySrs)
  const diagnosticHistory = useStore((state) => state.diagnosticHistory)
  const kotenSrs = useStore((state) => state.kotenSrs)
  const kotenGrammarSrs = useStore((state) => state.kotenGrammarSrs)
  const kotenCultureSrs = useStore((state) => state.kotenCultureSrs)
  const kotenInterpretationSrs = useStore((state) => state.kotenInterpretationSrs)
  const skillStats = useStore((state) => state.skillStats)
  const learningAnalytics = useStore((state) => state.learningAnalytics)

  const dueCount = overallProgress(srs).due
  const learningPower = useMemo(
    () => buildLearningPowerProfile({
      learningAnalytics,
      srsStores: [
        srs,
        etymologySrs,
        kotenSrs,
        kotenGrammarSrs,
        kotenCultureSrs,
        kotenInterpretationSrs,
      ],
      skillStats,
      diagnosticHistory,
      stats,
      dueCount,
    }),
    [
      learningAnalytics,
      srs,
      etymologySrs,
      kotenSrs,
      kotenGrammarSrs,
      kotenCultureSrs,
      kotenInterpretationSrs,
      skillStats,
      diagnosticHistory,
      stats,
      dueCount,
    ],
  )
  const recommendation = learningPower.recommendation

  return (
    <LearningMenu
      navigate={navigate}
      onBack={() => navigate('portal')}
      recommendation={recommendation}
    />
  )
}
