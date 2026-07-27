import { useStore } from '../store/useStore.js'
import { overallProgress, suggestStartPosition } from '../lib/session.js'
import { enemyLevel } from '../lib/adaptive.js'
import { ROOTS, wordsByRoot } from '../data/vocab.js'
import { todayIndex } from '../store/useStore.js'
import { Card, ProgressRing, Chip } from '../components/ui.jsx'
import { Flame, Star, Book, Cards, Sparkles, Bookmark, Refresh, ArrowRight, Headphones, Keyboard, Mic, Lightbulb, Target, Trophy, ChevronLeft, Link } from '../components/Icons.jsx'

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
  const settings = useStore((s) => s.settings)
  const myList = useStore((s) => s.myList)
  const diagnosticHistory = useStore((s) => s.diagnosticHistory)

  const engPos = useStore((s) => s.engPos)
  const enemy = enemyLevel(engPos ?? suggestStartPosition(srs))
  const latestDiagnostic = Array.isArray(diagnosticHistory) ? diagnosticHistory[0] : null

  const prog = overallProgress(srs)
  const goal = settings.dailyGoal || 20
  const todayCount = stats.day === todayIndex() ? stats.todayCount : 0
  const goalPct = Math.min(1, todayCount / goal)

  const dayRoot = ROOTS[todayIndex() % ROOTS.length]
  const rootWords = wordsByRoot(dayRoot.id).slice(0, 3)

  const startDue = () =>
    navigate('vocabStudy', { source: { type: 'due' }, title: '復習', mode: 'study' })

  return (
    <div className="pb-6">
      {/* ヒーロー */}
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-5 pb-7 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <button
          onClick={() => navigate('portal')}
          className="mb-3 flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 active:scale-95 transition-transform"
        >
          <ChevronLeft size={14} /> スタディアプリ
        </button>
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
              <Star size={14} /> {stats.xp}
            </Chip>
          </div>
        </div>

        {/* 今日の目標リング */}
        <div className="mt-5 flex items-center gap-4 rounded-3xl bg-white/10 p-4 backdrop-blur">
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
        {/* 続きから / 復習 */}
        {prog.due > 0 ? (
          <Card className="overflow-hidden">
            <button onClick={startDue} className="flex w-full items-center gap-3 p-4 text-left active:bg-brand-50">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-hint-soft text-hint">
                <Refresh size={24} />
              </span>
              <div className="flex-1">
                <div className="font-display font-extrabold text-ink">復習しよう</div>
                <div className="text-xs font-bold text-ink/50">{prog.due}語が復習どきです</div>
              </div>
              <span className="text-brand-500"><ArrowRight size={22} /></span>
            </button>
          </Card>
        ) : (
          <Card>
            <button
              onClick={() => navigate('vocabLevels')}
              className="flex w-full items-center gap-3 p-4 text-left active:bg-brand-50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                <Sparkles size={24} />
              </span>
              <div className="flex-1">
                <div className="font-display font-extrabold text-ink">今日の学習をはじめる</div>
                <div className="text-xs font-bold text-ink/50">レベルを選んで単語を覚えよう</div>
              </div>
              <span className="text-brand-500"><ArrowRight size={22} /></span>
            </button>
          </Card>
        )}

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
              <div className="font-display font-extrabold text-ink">学習マップ・適応バトル</div>
              <div className="text-xs font-bold text-ink/50">
                敵LV：英検{enemy.label}・成績で強さが変化
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
              icon={<Sparkles size={22} />} label="熟語・構文" sub="3択で覚える"
              color="linear-gradient(135deg,#8b5cf6,#7c3aed)" onClick={() => navigate('phrases')}
            />
            <ModeTile
              icon={<Lightbulb size={22} />} label="文法" sub="級ごとに4択"
              color="linear-gradient(135deg,#f59e0b,#ea580c)" onClick={() => navigate('grammar')}
            />
            <ModeTile
              icon={<Link size={22} />} label="語源" sub="派生語をまとめて"
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
              icon={<Mic size={22} />} label="発音チェック" sub="認識一致度を確認"
              color="linear-gradient(135deg,#f43f5e,#e11d48)" onClick={() => navigate('pronounce')}
            />
            <ModeTile
              icon={<Bookmark size={22} />} label="マイ単語" sub={`${myList.length} 語を保存中`}
              color="linear-gradient(135deg,#f59e0b,#d97706)" onClick={() => navigate('myList')}
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
