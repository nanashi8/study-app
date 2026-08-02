import { useMemo, useState } from 'react'
import { useStore, todayIndex } from '../store/useStore.js'
import { overallProgress } from '../lib/session.js'
import { buildLearningPowerProfile } from '../lib/learningPower.js'
import { heroProgress } from '../lib/rpg.js'
import { AFTER_SCHOOL_CHRONICLE } from '../lib/afterSchoolStory.js'
import { publicAssetUrl } from '../lib/publicAssetUrl.js'
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

const APP_NAME = '英語アプリ'

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

function LearningMenu({ navigate, onBack }) {
  const open = (screen, params) => navigate(screen, params ?? {})

  return (
    <div className="min-h-full bg-slate-100 pb-8" data-home-learning-menu>
      <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-slate-200/80 bg-white/95 px-3 py-2.5 backdrop-blur">
        <button
          type="button"
          onClick={onBack}
          aria-label="タイトル画面へ戻る"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-ink/70 active:bg-brand-50"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold tracking-[0.14em] text-brand-500">SELECT MODE</p>
          <h1 className="font-display text-xl font-extrabold text-ink">学習を選ぶ</h1>
        </div>
      </header>

      <div className="space-y-4 px-4 pt-4">
        <section>
          <h2 className="mb-2 px-1 font-display text-sm font-extrabold text-ink/65">基本学習</h2>
          <div className="grid grid-cols-2 gap-2.5" data-home-mode-group="primary">
            {PRIMARY_LEARNING_MODES.map((mode) => (
              <LearningModeButton key={mode.id} mode={mode} onOpen={open} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2.5">
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
  const settings = useStore((state) => state.settings)
  const srs = useStore((state) => state.srs)
  const etymologySrs = useStore((state) => state.etymologySrs)
  const diagnosticHistory = useStore((state) => state.diagnosticHistory)
  const kotenSrs = useStore((state) => state.kotenSrs)
  const kotenGrammarSrs = useStore((state) => state.kotenGrammarSrs)
  const kotenCultureSrs = useStore((state) => state.kotenCultureSrs)
  const kotenInterpretationSrs = useStore((state) => state.kotenInterpretationSrs)
  const skillStats = useStore((state) => state.skillStats)
  const learningAnalytics = useStore((state) => state.learningAnalytics)
  const [learningMenuOpen, setLearningMenuOpen] = useState(false)

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
  const hero = heroProgress(stats.xp)
  const goal = settings.dailyGoal || 20
  const todayCount = stats.day === todayIndex() ? stats.todayCount : 0

  if (learningMenuOpen) {
    return (
      <LearningMenu
        navigate={navigate}
        onBack={() => setLearningMenuOpen(false)}
      />
    )
  }

  return (
    <div
      className="home-title-screen relative flex min-h-full flex-col overflow-hidden bg-slate-950 text-white"
      data-testid="home-title-screen"
    >
      <section className="home-title-art relative overflow-hidden">
        <img
          src={publicAssetUrl(AFTER_SCHOOL_CHRONICLE.keyVisual)}
          alt="放課後の昇降口で、友達と次の学習へ向かう"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/5 to-slate-950" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <button
            type="button"
            onClick={() => navigate('portal')}
            className="inline-flex min-h-10 items-center gap-1 rounded-full border border-white/15 bg-slate-950/50 px-3 text-xs font-extrabold text-white/85 backdrop-blur-sm active:bg-slate-950/70"
          >
            <ChevronLeft size={15} /> スタディアプリ
          </button>
          <SpeechSettingsButton compact inverse />
        </div>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-5 text-center">
          <p className="text-xs font-extrabold tracking-[0.26em] text-cyan-200">ENGLISH ADVENTURE</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold tracking-wide drop-shadow-lg">
            {APP_NAME}
          </h1>
          <p className="mt-1 text-sm font-bold text-white/65">英検5級〜1級</p>
        </div>
      </section>

      <section className="home-title-panel flex flex-1 flex-col justify-center px-5 pb-5 pt-3">
        <div className="home-title-actions space-y-2.5" data-home-title-menu>
          <button
            type="button"
            onClick={() => navigate(recommendation.screen, recommendation.params)}
            className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white px-4 text-left text-slate-950 shadow-lg active:scale-[0.99]"
            data-home-title-action="continue"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700">
              {recommendation.id === 'review' ? <Refresh size={21} /> : <Sparkles size={21} />}
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block font-display text-base font-extrabold">つづきから</strong>
              <span className="block truncate text-xs font-bold text-slate-500">
                {recommendation.actionLabel}
              </span>
            </span>
            <ArrowRight size={20} className="shrink-0 text-violet-600" />
          </button>

          <button
            type="button"
            onClick={() => navigate('afterSchoolChronicle')}
            className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 text-left active:bg-white/15"
            data-home-title-action="battle"
          >
            <Star size={20} className="shrink-0 text-amber-300" />
            <span className="min-w-0 flex-1 truncate font-display text-sm font-extrabold">
              {AFTER_SCHOOL_CHRONICLE.title}
            </span>
            <ArrowRight size={18} className="shrink-0 text-white/55" />
          </button>

          <button
            type="button"
            onClick={() => setLearningMenuOpen(true)}
            className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 text-left active:bg-white/15"
            data-home-title-action="learn"
          >
            <BookOpen size={20} className="shrink-0 text-cyan-200" />
            <span className="min-w-0 flex-1 font-display text-sm font-extrabold">学習を選ぶ</span>
            <ArrowRight size={18} className="shrink-0 text-white/55" />
          </button>
        </div>

        <p
          className="mt-4 text-center text-xs font-extrabold text-white/45"
          data-home-compact-status
        >
          今日 {todayCount}/{goal} ・ {stats.streak}日連続 ・ LV{hero.level}
        </p>
      </section>
    </div>
  )
}
