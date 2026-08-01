import { useMemo } from 'react'
import { useStore } from '../store/useStore.js'
import { overallProgress, suggestStartPosition } from '../lib/session.js'
import { buildLearningPowerProfile } from '../lib/learningPower.js'
import { etymologyProgress } from '../lib/etymologyProgress.js'
import { enemyLevel } from '../lib/adaptive.js'
import { ETYMOLOGY_PACKS, ROOTS, wordsByRoot } from '../data/vocab.js'
import { todayIndex } from '../store/useStore.js'
import { capEnemyPositionForHeroLevel, heroProgress } from '../lib/rpg.js'
import { Card, ProgressRing, ProgressBar, Chip } from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Flame, Star, Book, BookOpen, Cards, Sparkles, Bookmark, Refresh, ArrowRight, Headphones, Keyboard, Lightbulb, Target, Trophy, ChevronLeft, Link } from '../components/Icons.jsx'

const APP_NAME = '英語アプリ'

function ModeTile({ icon, label, sub, color, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative flex flex-col items-start gap-2 rounded-3xl bg-white p-4 text-left shadow-card active:scale-[0.98] transition-transform disabled:opacity-55 disabled:active:scale-100"
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
        style={{ background: color }}
      >
        {icon}
      </span>
      <div>
        <div className="font-display font-extrabold text-ink">{label}</div>
        <div className="text-xs font-bold text-ink/45">{sub}</div>
      </div>
      {disabled && (
        <span className="absolute right-3 top-3 rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-extrabold text-ink/50">
          準備中
        </span>
      )}
    </button>
  )
}

export function HomeScreen() {
  const navigate = useStore((s) => s.navigate)
  const stats = useStore((s) => s.stats)
  const srs = useStore((s) => s.srs)
  const etymologySrs = useStore((s) => s.etymologySrs)
  const settings = useStore((s) => s.settings)
  const myList = useStore((s) => s.myList)
  const myGrammarList = useStore((s) => s.myGrammarList)
  const writingProgress = useStore((s) => s.writingProgress)
  const diagnosticHistory = useStore((s) => s.diagnosticHistory)
  const kotenSrs = useStore((s) => s.kotenSrs)
  const kotenGrammarSrs = useStore((s) => s.kotenGrammarSrs)
  const kotenCultureSrs = useStore((s) => s.kotenCultureSrs)
  const kotenInterpretationSrs = useStore((s) => s.kotenInterpretationSrs)
  const skillStats = useStore((s) => s.skillStats)
  const learningAnalytics = useStore((s) => s.learningAnalytics)

  const engPos = useStore((s) => s.engPos)
  const hero = heroProgress(stats.xp)
  const enemy = enemyLevel(
    capEnemyPositionForHeroLevel(
      engPos ?? suggestStartPosition(srs),
      hero.level,
    ),
  )
  const latestDiagnostic = Array.isArray(diagnosticHistory) ? diagnosticHistory[0] : null

  const prog = overallProgress(srs)
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
      dueCount: prog.due,
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
      prog.due,
    ],
  )
  const recommendation = learningPower.recommendation
  const goal = settings.dailyGoal || 20
  const todayCount = stats.day === todayIndex() ? stats.todayCount : 0
  const goalPct = Math.min(1, todayCount / goal)
  const writingDone = Object.values(writingProgress).filter(
    (item) => (item?.completed ?? 0) > 0,
  ).length
  const etymology = useMemo(
    () => etymologyProgress(ETYMOLOGY_PACKS, etymologySrs),
    [etymologySrs],
  )

  const dayRoot = ROOTS[todayIndex() % ROOTS.length]
  const rootWords = wordsByRoot(dayRoot.id).slice(0, 3)

  return (
    <div className="pb-6">
      {/* ヒーロー */}
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-5 pb-7 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navigate('portal')}
            className="flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 active:scale-95 transition-transform"
          >
            <ChevronLeft size={14} /> スタディアプリ
          </button>
          <SpeechSettingsButton compact inverse />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white/70">英検5級〜1級</p>
            <h1 className="font-display text-2xl font-extrabold tracking-wide">{APP_NAME}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Chip className="bg-white/15 text-white">
              <Flame size={14} /> {stats.streak}日
            </Chip>
            <Chip className="bg-white/15 text-white">
              <Star size={14} /> LV{hero.level}
            </Chip>
          </div>
        </div>

        {/* 冒険者LV：XPで1〜99まで上がり、下がらない長期成長。 */}
        <button
          onClick={() => navigate('englishMap')}
          className="mt-4 flex w-full items-center gap-3 rounded-3xl border border-white/15 bg-slate-950/20 p-3 text-left backdrop-blur transition-transform active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-2xl">
            {hero.title.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-display text-sm font-extrabold">
                LV{hero.level} {hero.title.name}
              </span>
              <span className="text-[10px] font-extrabold text-white/60">
                {hero.isMax ? 'MAX' : `あと ${hero.xpToNext} XP`}
              </span>
            </div>
            <ProgressBar
              value={hero.progress}
              color="linear-gradient(90deg,#fde68a,#fbbf24)"
              className="mt-1.5 h-2 bg-white/15"
            />
            <p className="mt-1 text-[10px] font-bold text-white/60">
              {hero.chapter.emoji} {hero.chapter.name}を冒険中
            </p>
          </div>
          <ArrowRight size={18} className="text-white/60" />
        </button>

        {/* 今日の目標リング */}
        <div className="mt-3 flex items-center gap-4 rounded-3xl bg-white/10 p-4 backdrop-blur">
          <ProgressRing value={goalPct} size={76} stroke={9} color="#ffffff" track="rgba(255,255,255,0.25)">
            <span className="font-display text-lg font-extrabold leading-none">{todayCount}</span>
            <span className="text-[10px] font-bold text-white/70">/{goal}</span>
          </ProgressRing>
          <div className="flex-1">
            <p className="font-display text-lg font-extrabold">今日の学習</p>
            <p className="text-sm font-bold text-white/75">
              {todayCount >= goal
                ? '目標達成！すごい🎉'
                : `あと ${goal - todayCount} 回で目標達成`}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 pt-5">
        {/* テスト結果・記憶・習慣・得意時間帯を、その時点の次メニューに使う。 */}
        <Card className="overflow-hidden">
          <button
            onClick={() => navigate(recommendation.screen, recommendation.params)}
            className="w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-4 text-left text-white active:opacity-95"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-violet-200 ring-1 ring-inset ring-white/10">
                {recommendation.id === 'review' ? <Refresh size={24} /> : <Sparkles size={24} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] font-extrabold tracking-[0.16em] text-violet-200/70">
                    学習脳力ナビ
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-extrabold text-white/70">
                    {recommendation.intensity}
                  </span>
                </div>
                <p className="mt-1 font-display text-base font-extrabold">
                  {recommendation.title}
                </p>
                <p className="mt-1 text-[10px] font-bold leading-relaxed text-white/55">
                  {recommendation.reason}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[9px] font-extrabold text-amber-200/80">
                    {recommendation.timing}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-extrabold text-white/85">
                    {recommendation.actionLabel} <ArrowRight size={14} />
                  </span>
                </div>
              </div>
              <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/10">
                <span className="font-display text-lg font-extrabold leading-none">
                  {learningPower.score ?? '—'}
                </span>
                <span className="mt-0.5 text-[7px] font-extrabold text-white/45">参考値</span>
              </span>
            </div>
          </button>
        </Card>

        {/* 学習診断 */}
        <Card className="overflow-hidden">
          <button
            onClick={() => navigate('diagnostic')}
            className="flex w-full items-center gap-3 p-4 text-left active:bg-brand-50"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <Trophy size={24} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-display font-extrabold text-ink">学習診断テスト</div>
              <div className="text-xs font-bold text-ink/50">
                {latestDiagnostic
                  ? `推定偏差値 ${latestDiagnostic.deviation}・英検${latestDiagnostic.estimatedLevel?.label ?? '—'}目安`
                  : '28問で偏差値・英検級・弱点を診断'}
              </div>
            </div>
            {latestDiagnostic && (
              <span className="rounded-full bg-violet-100 px-2.5 py-1 font-display text-sm font-extrabold text-violet-700">
                {latestDiagnostic.deviation}
              </span>
            )}
            <span className="text-brand-500"><ArrowRight size={22} /></span>
          </button>
        </Card>

        {/* 学習マップ・弱点チェック */}
        <Card>
          <button
            onClick={() => navigate('englishMap')}
            className="flex w-full items-center gap-3 p-4 text-left active:bg-brand-50"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <Target size={24} />
            </span>
            <div className="flex-1">
              <div className="font-display font-extrabold text-ink">冒険ギルド・学習バトル</div>
              <div className="text-xs font-bold text-ink/50">
                冒険者LV{hero.level}・敵ランクは英検{enemy.label}
              </div>
            </div>
            <span className="text-brand-500"><ArrowRight size={22} /></span>
          </button>
        </Card>

        {/* モード */}
        <div>
          <h2 className="mb-2.5 px-1 font-display text-base font-extrabold text-ink/80">学習モード</h2>
          <div className="grid grid-cols-2 gap-3">
            <ModeTile
              icon={<Book size={22} />} label="単語" sub={`${prog.seen}/${prog.total} 語`}
              color="linear-gradient(135deg,#6366f1,#4f46e5)" onClick={() => navigate('vocabLevels')}
            />
            <ModeTile
              icon={<Cards size={22} />} label="クイズ" sub="3択で力だめし"
              color="linear-gradient(135deg,#0ea5e9,#0284c7)"
              onClick={() => navigate('vocabLevels', { intent: 'quiz' })}
            />
            <ModeTile
              icon={<Book size={22} />} label="長文" sub="じっくり読解"
              color="linear-gradient(135deg,#10b981,#059669)" onClick={() => navigate('readingList')}
            />
            <ModeTile
              icon={<Headphones size={22} />} label="名作朗読" sub="一息ずつ → 区切り直訳"
              color="linear-gradient(135deg,#0f766e,#0d9488)" onClick={() => navigate('literatureLibrary')}
            />
            <ModeTile
              icon={<Sparkles size={22} />} label="熟語・構文" sub="3択で覚える"
              color="linear-gradient(135deg,#8b5cf6,#7c3aed)" onClick={() => navigate('phrases')}
            />
            <ModeTile
              icon={<Lightbulb size={22} />} label="文法" sub="級ごとに4択"
              color="linear-gradient(135deg,#f59e0b,#ea580c)" onClick={() => navigate('grammar')}
            />
            <ModeTile
              icon={<BookOpen size={22} />} label="英作文" sub={`${writingDone}/14 お題を完成`}
              color="linear-gradient(135deg,#0f172a,#4f46e5)" onClick={() => navigate('writing')}
            />
            <ModeTile
              icon={<Link size={22} />} label="語源" sub={`語源知識 ${etymology.mastered}/${etymology.total}`}
              color="linear-gradient(135deg,#6366f1,#7c3aed)" onClick={() => navigate('roots')}
            />
            <ModeTile
              icon={<Headphones size={22} />} label="リスニング" sub="聞いて当てる"
              color="linear-gradient(135deg,#0ea5e9,#0284c7)" onClick={() => navigate('listening')}
            />
            <ModeTile
              icon={<Keyboard size={22} />} label="ディクテーション" sub="聞いて書く"
              color="linear-gradient(135deg,#14b8a6,#0d9488)" onClick={() => navigate('dictation')}
            />
            <ModeTile
              icon={<Bookmark size={22} />} label="マイ単語" sub={`${myList.length} 語を保存中`}
              color="linear-gradient(135deg,#f59e0b,#d97706)" onClick={() => navigate('myList')}
            />
            <ModeTile
              icon={<Lightbulb size={22} />} label="マイ文法" sub={`${myGrammarList.length} 項目を保存中`}
              color="linear-gradient(135deg,#a855f7,#7c3aed)" onClick={() => navigate('myGrammar')}
            />
          </div>
        </div>

        {/* 今日の語源 */}
        <div>
          <h2 className="mb-2.5 px-1 font-display text-base font-extrabold text-ink/80">きょうの語源</h2>
          <Card className="p-4">
            <button
              onClick={() => navigate('rootDetail', { rootId: dayRoot.id })}
              className="flex w-full items-center gap-3 text-left"
            >
              <span className="text-4xl">{dayRoot.emoji}</span>
              <div className="flex-1">
                <div className="font-display text-xl font-extrabold text-brand-700">{dayRoot.form}</div>
                <div className="text-sm font-bold text-ink/60">＝{dayRoot.meaning}</div>
              </div>
              <span className="text-brand-400"><ArrowRight size={22} /></span>
            </button>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {rootWords.map((w) => (
                <Chip key={w.id} color={dayRoot ? '#6366f1' : undefined}>{w.word}</Chip>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
