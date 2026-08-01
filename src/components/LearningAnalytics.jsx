import { useMemo } from 'react'
import { buildLearningPowerProfile } from '../lib/learningPower.js'
import { Button, Card, ProgressBar, ProgressRing, cx } from './ui.jsx'

const DIAGNOSTIC_SKILL_META = {
  vocab: { emoji: '📖', label: '英単語' },
  grammar: { emoji: '💡', label: '文法・構文' },
  usage: { emoji: '✨', label: '熟語・語法' },
  reading: { emoji: '📚', label: '長文読解' },
}

const asPercent = (value) =>
  value == null ? '—' : `${Math.round(value * 100)}%`

const formatCount = (value) =>
  new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 1 }).format(value ?? 0)

function readinessLabel(readiness) {
  if (readiness === 'stable') return '分析精度：安定'
  if (readiness === 'growing') return '分析精度：成長中'
  if (readiness === 'starting') return '分析精度：初期'
  return '分析データを収集中'
}

function powerReadinessLabel(readiness) {
  if (readiness === 'stable') return '信頼度：安定'
  if (readiness === 'growing') return '信頼度：成長中'
  if (readiness === 'starting') return '信頼度：初期'
  return 'まだ計測前'
}

function hourColor(stat) {
  if (!stat.scored) return '#e2e8f0'
  const accuracy = stat.accuracy ?? 0
  if (accuracy >= 0.85) return '#10b981'
  if (accuracy >= 0.7) return '#22c55e'
  if (accuracy >= 0.55) return '#f59e0b'
  return '#fb7185'
}

function clockGradient(hourly) {
  const stops = []
  for (const stat of hourly) {
    const start = stat.hour * 15
    const end = start + 15
    stops.push(`#f8fafc ${start}deg ${start + 1.2}deg`)
    stops.push(`${hourColor(stat)} ${start + 1.2}deg ${end - 1.2}deg`)
    stops.push(`#f8fafc ${end - 1.2}deg ${end}deg`)
  }
  return `conic-gradient(${stops.join(',')})`
}

function formatBestWindow(window) {
  if (!window) return null
  const start = String(window.start).padStart(2, '0')
  const end = String(window.end).padStart(2, '0')
  const crossesMidnight = window.end <= window.start
  return `${start}:00〜${crossesMidnight ? '翌' : ''}${end}:00`
}

function Metric({ label, value, note, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  }
  return (
    <div className={cx('rounded-2xl p-3 text-center', tones[tone])}>
      <p className="text-[10px] font-extrabold opacity-60">{label}</p>
      <p className="mt-0.5 font-display text-xl font-extrabold">{value}</p>
      <p className="mt-0.5 text-[9px] font-bold opacity-55">{note}</p>
    </div>
  )
}

function formatDiagnosticDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '実施日不明'
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(date)
}

function DiagnosticSnapshot({ diagnostic, onOpen }) {
  if (!diagnostic) {
    return (
      <Card className="p-4" data-diagnostic-status>
        <p className="text-[10px] font-extrabold tracking-[0.14em] text-brand-500">
          LEARNING DIAGNOSTIC
        </p>
        <h2 className="mt-1 font-display text-lg font-extrabold text-ink">学習診断の現在地</h2>
        <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/45">
          まだ診断結果がありません。28問で英語4分野の得意と復習優先を確認できます。
        </p>
        <Button full className="mt-3" variant="secondary" onClick={onOpen}>
          学習診断を受ける
        </Button>
      </Card>
    )
  }

  const skillResults = Array.isArray(diagnostic.skillResults)
    ? diagnostic.skillResults
    : []
  const strength = skillResults.find(
    (skill) => skill.id === diagnostic.strengthSkillId,
  )
  const priority = skillResults.find(
    (skill) => skill.id === diagnostic.prioritySkillId,
  )
  const strengthMeta = DIAGNOSTIC_SKILL_META[strength?.id]
  const priorityMeta = DIAGNOSTIC_SKILL_META[priority?.id]
  const total = Number(diagnostic.total) || 0
  const score = Number(diagnostic.score) || 0
  const accuracy = Number.isFinite(diagnostic.accuracy)
    ? diagnostic.accuracy
    : total
      ? score / total
      : 0

  return (
    <Card className="overflow-hidden" data-diagnostic-status>
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.14em] text-white/55">
              LATEST DIAGNOSTIC
            </p>
            <h2 className="mt-1 font-display text-lg font-extrabold">最新の学習診断</h2>
          </div>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold text-white/75">
            {formatDiagnosticDate(diagnostic.completedAt)}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/10 px-2 py-3 text-center">
            <p className="text-[9px] font-bold text-white/55">推定偏差値</p>
            <p className="font-display text-2xl font-extrabold">{diagnostic.deviation ?? '—'}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-2 py-3 text-center">
            <p className="text-[9px] font-bold text-white/55">正答率</p>
            <p className="font-display text-2xl font-extrabold">{Math.round(accuracy * 100)}%</p>
            <p className="text-[8px] font-bold text-white/45">{score}/{total}問</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-2 py-3 text-center">
            <p className="text-[9px] font-bold text-white/55">英検目安</p>
            <p className="font-display text-lg font-extrabold leading-7">
              {diagnostic.estimatedLevel?.label ?? '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-emerald-50 p-3">
            <p className="text-[9px] font-extrabold text-emerald-600">今回の得意</p>
            <p className="mt-1 text-sm font-extrabold text-emerald-900">
              {strengthMeta ? `${strengthMeta.emoji} ${strengthMeta.label}` : '— 判定中'}
            </p>
            <p className="mt-0.5 text-[10px] font-bold text-emerald-700/65">
              {strength ? `${strength.correct}/${strength.total}問` : '結果を確認してください'}
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3">
            <p className="text-[9px] font-extrabold text-amber-600">復習優先</p>
            <p className="mt-1 text-sm font-extrabold text-amber-900">
              {priorityMeta ? `${priorityMeta.emoji} ${priorityMeta.label}` : '🎉 明確な弱点なし'}
            </p>
            <p className="mt-0.5 text-[10px] font-bold text-amber-700/65">
              {priority ? `${priority.correct}/${priority.total}問` : '次は総合演習へ'}
            </p>
          </div>
        </div>
        <p className="mt-2 text-[9px] font-bold leading-relaxed text-ink/35">
          最新28問の一部を表示。偏差値と級はアプリ内モデルによる推定です。
        </p>
        <Button full className="mt-3" variant="secondary" onClick={onOpen}>
          学習診断の4分野を見る
        </Button>
      </div>
    </Card>
  )
}

function LearningPowerProfile({ profile }) {
  const { recommendation } = profile

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-4 text-white">
        <div className="flex items-start gap-3">
          <ProgressRing
            value={(profile.score ?? 0) / 100}
            size={82}
            stroke={8}
            color="#ffffff"
            track="rgba(255,255,255,0.2)"
          >
            <span className="font-display text-2xl font-extrabold leading-none">
              {profile.score ?? '—'}
            </span>
            <span className="mt-0.5 text-[8px] font-extrabold text-white/60">参考値 / 100</span>
          </ProgressRing>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-[9px] font-extrabold tracking-[0.16em] text-white/55">
                LEARNING POWER
              </p>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-extrabold text-white/80">
                {powerReadinessLabel(profile.confidence)}
              </span>
            </div>
            <h2 className="mt-1 font-display text-lg font-extrabold">学習脳力プロフィール</h2>
            <p className="mt-1 text-[10px] font-bold leading-relaxed text-white/65">
              テスト結果と学習習慣から、伸ばし方を選ぶための現在値を推定
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {profile.dimensions.map((item) => (
            <div
              key={item.id}
              className="min-w-0 rounded-2xl bg-white/10 p-3 ring-1 ring-inset ring-white/10"
            >
              <div className="flex items-baseline justify-between gap-1">
                <p className="truncate text-[10px] font-extrabold text-white/70">{item.label}</p>
                <p className="font-display text-lg font-extrabold">
                  {item.score ?? '—'}
                </p>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white/85"
                  style={{ width: `${item.score ?? 0}%` }}
                />
              </div>
              <p className="mt-1.5 truncate text-[8px] font-bold text-white/50">
                {item.evidence}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl bg-slate-950/20 p-3 ring-1 ring-inset ring-white/10">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-extrabold tracking-wider text-amber-200">今の活かし方</p>
            <span className="rounded-full bg-amber-300/15 px-2 py-0.5 text-[9px] font-extrabold text-amber-100">
              {recommendation.intensity}
            </span>
          </div>
          <p className="mt-1 text-sm font-extrabold">{recommendation.title}</p>
          <p className="mt-1 text-[9px] font-bold leading-relaxed text-white/55">
            {recommendation.reason}
          </p>
        </div>
      </div>
    </Card>
  )
}

function RetentionFlow({ analysis }) {
  const retention = asPercent(analysis.retentionRate)
  const forgetting = asPercent(analysis.forgettingRate)

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-4 text-white">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-white/45">
              INPUT → MEMORY → OUTPUT
            </p>
            <h2 className="mt-1 font-display text-lg font-extrabold">記憶の定着フロー</h2>
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-extrabold text-white/70">
            {readinessLabel(analysis.trackingReadiness)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto_1.2fr_auto_1fr] items-center gap-1">
          <div className="rounded-2xl bg-sky-400/15 px-2 py-3 text-center ring-1 ring-inset ring-sky-300/20">
            <p className="text-[9px] font-extrabold text-sky-200">INPUT</p>
            <p className="font-display text-2xl font-extrabold">{formatCount(analysis.inputs)}</p>
            <p className="text-[9px] font-bold text-white/50">学習・回答</p>
          </div>
          <span className="text-lg font-extrabold text-white/25">›</span>
          <div className="rounded-2xl bg-violet-400/15 px-2 py-3 text-center ring-1 ring-inset ring-violet-300/20">
            <p className="text-[9px] font-extrabold text-violet-200">MEMORY</p>
            <p className="font-display text-2xl font-extrabold">{analysis.memoryScore}</p>
            <p className="text-[9px] font-bold text-white/50">定着推定 / 100</p>
          </div>
          <span className="text-lg font-extrabold text-white/25">›</span>
          <div className="rounded-2xl bg-rose-400/15 px-2 py-3 text-center ring-1 ring-inset ring-rose-300/20">
            <p className="text-[9px] font-extrabold text-rose-200">OUTPUT</p>
            <p className="font-display text-2xl font-extrabold">{forgetting}</p>
            <p className="text-[9px] font-bold text-white/50">忘却・未想起</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[10px] font-bold text-white/55">
          <span>想起できた割合</span>
          <span className="font-display text-sm font-extrabold text-emerald-300">{retention}</span>
        </div>
      </div>
    </Card>
  )
}

function MemoryBalance({ analysis }) {
  const { stages } = analysis
  const total = Math.max(1, analysis.learnedItems)
  const longEnd = (stages.long / total) * 100
  const shortEnd = longEnd + (stages.short / total) * 100
  const donut = analysis.learnedItems
    ? `conic-gradient(#10b981 0 ${longEnd}%, #6366f1 ${longEnd}% ${shortEnd}%, #f59e0b ${shortEnd}% 100%)`
    : 'conic-gradient(#e2e8f0 0 100%)'

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-extrabold text-ink">短期記憶・長期記憶</h2>
          <p className="mt-0.5 text-[10px] font-bold text-ink/40">
            反復間隔の段階から推定・学習済み{analysis.learnedItems}項目
          </p>
        </div>
        <div
          className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
          style={{ background: donut }}
          aria-label={`長期記憶${stages.longPct}%、短期記憶${stages.shortPct}%`}
        >
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white">
            <span className="font-display text-lg font-extrabold text-ink">{analysis.memoryScore}</span>
            <span className="text-[8px] font-bold text-ink/35">定着度</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Metric label="長期記憶" value={`${stages.longPct}%`} note={`${stages.long}項目`} tone="emerald" />
        <Metric label="短期記憶" value={`${stages.shortPct}%`} note={`${stages.short}項目`} />
        <Metric label="要再学習" value={`${stages.fragilePct}%`} note={`${stages.fragile}項目`} tone="amber" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-paper p-3">
          <p className="text-[10px] font-extrabold text-ink/40">学習頻度</p>
          <p className="mt-1 font-display text-lg font-extrabold text-ink">
            {analysis.averageInputsPerActiveDay == null
              ? '計測中'
              : `1日 ${formatCount(analysis.averageInputsPerActiveDay)}回`}
          </p>
          <p className="text-[9px] font-bold text-ink/35">記録日の平均</p>
        </div>
        <div className="rounded-2xl bg-paper p-3">
          <p className="text-[10px] font-extrabold text-ink/40">長期記憶まで</p>
          <p className="mt-1 font-display text-lg font-extrabold text-ink">
            {analysis.repetitionsToLongTerm == null
              ? '計測中'
              : `平均 ${formatCount(analysis.repetitionsToLongTerm)}回`}
          </p>
          <p className="text-[9px] font-bold text-ink/35">長期段階の項目から推定</p>
        </div>
      </div>
    </Card>
  )
}

function ForgettingCurve({ analysis }) {
  const hasIntervals = analysis.intervals.some((interval) => interval.scored > 0)
  return (
    <Card className="p-4">
      <h2 className="font-display text-base font-extrabold text-ink">反復間隔と想起率</h2>
      <p className="mt-0.5 text-[10px] font-bold text-ink/40">
        前回学習からの時間別に「思い出せた割合」を集計
      </p>

      {hasIntervals ? (
        <div className="mt-4 space-y-3">
          {analysis.intervals.map((interval) => (
            <div key={interval.id}>
              <div className="mb-1 flex items-center gap-2 text-[10px] font-bold">
                <span className="w-20 text-ink/55">{interval.label}</span>
                <span className="ml-auto text-ink/35">{formatCount(interval.scored)}回答</span>
                <span className="w-10 text-right font-extrabold text-brand-700">
                  {asPercent(interval.accuracy)}
                </span>
              </div>
              <ProgressBar
                value={interval.accuracy ?? 0}
                color={(interval.accuracy ?? 0) >= 0.7 ? '#10b981' : '#f59e0b'}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-brand-200 bg-brand-50/60 p-4 text-center">
          <p className="text-sm font-extrabold text-brand-700">忘却カーブを計測中</p>
          <p className="mt-1 text-[10px] font-bold leading-relaxed text-ink/45">
            同じ教材を時間を空けて2回以上学習すると、間隔ごとの想起率が表示されます。
          </p>
        </div>
      )}
    </Card>
  )
}

function SkillProfile({ analysis }) {
  return (
    <Card className="p-4">
      <h2 className="font-display text-base font-extrabold text-ink">得意・不得意の傾向</h2>
      <p className="mt-0.5 text-[10px] font-bold text-ink/40">分野別の採点済み回答から比較</p>

      {(analysis.strength || analysis.weakness) && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-emerald-50 p-3">
            <p className="text-[9px] font-extrabold text-emerald-600">得意分野</p>
            <p className="mt-1 text-sm font-extrabold text-emerald-900">
              {analysis.strength?.emoji} {analysis.strength?.label ?? '計測中'}
            </p>
            <p className="mt-0.5 font-display text-lg font-extrabold text-emerald-700">
              {asPercent(analysis.strength?.accuracy)}
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3">
            <p className="text-[9px] font-extrabold text-amber-600">伸びしろ</p>
            <p className="mt-1 text-sm font-extrabold text-amber-950">
              {analysis.weakness?.emoji} {analysis.weakness?.label ?? '計測中'}
            </p>
            <p className="mt-0.5 font-display text-lg font-extrabold text-amber-700">
              {asPercent(analysis.weakness?.accuracy)}
            </p>
          </div>
        </div>
      )}

      {analysis.skills.length ? (
        <div className="mt-4 space-y-3">
          {analysis.skills.map((skill) => (
            <div key={skill.id}>
              <div className="mb-1 flex items-center gap-2 text-[10px] font-bold">
                <span>{skill.emoji}</span>
                <span className="text-ink/60">{skill.label}</span>
                <span className="ml-auto text-ink/35">{formatCount(skill.scored)}回答</span>
                <span className="w-10 text-right font-extrabold text-ink/65">
                  {asPercent(skill.accuracy)}
                </span>
              </div>
              <ProgressBar value={skill.accuracy ?? 0} color={skill.color} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-paper p-4 text-center text-xs font-bold text-ink/40">
          採点済みの学習が増えると、分野別傾向を表示します。
        </p>
      )}
    </Card>
  )
}

function EfficiencyClock({ analysis }) {
  const gradient = clockGradient(analysis.hourly)
  const bestLabel = formatBestWindow(analysis.bestWindow)
  const bestAccuracy = analysis.bestWindow
    ? analysis.bestWindow.correct / analysis.bestWindow.scored
    : null

  return (
    <Card className="p-4">
      <h2 className="font-display text-base font-extrabold text-ink">24時間・学習効率時計</h2>
      <p className="mt-0.5 text-[10px] font-bold text-ink/40">
        時刻別の正答率を平滑化して、集中しやすい3時間帯を推定
      </p>

      <div className="mx-auto mt-5 w-full max-w-[260px] px-5">
        <div className="relative aspect-square">
          <div
            className="absolute inset-0 rounded-full shadow-inner"
            style={{ background: gradient }}
            aria-label="24時間の時刻別学習効率"
          />
          <div className="absolute inset-[23%] flex flex-col items-center justify-center rounded-full bg-white text-center shadow-card">
            <span className="text-[9px] font-extrabold text-ink/35">おすすめ時間帯</span>
            <span className="mt-1 font-display text-base font-extrabold text-brand-700">
              {bestLabel ?? '計測中'}
            </span>
            <span className="mt-0.5 text-[9px] font-bold text-ink/40">
              {bestAccuracy == null
                ? '各時間帯5回答で判定'
                : `想起率 ${asPercent(bestAccuracy)}`}
            </span>
          </div>
          <span className="absolute left-1/2 top-[-18px] -translate-x-1/2 text-[10px] font-extrabold text-ink/45">0時</span>
          <span className="absolute right-[-24px] top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-ink/45">6時</span>
          <span className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-ink/45">12時</span>
          <span className="absolute left-[-29px] top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-ink/45">18時</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 text-[9px] font-bold text-ink/40">
        <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />高効率</span>
        <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-amber-400" />中間</span>
        <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-rose-400" />要調整</span>
        <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-slate-200" />未計測</span>
      </div>
    </Card>
  )
}

export function LearningAnalyticsPanel({
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
  onOpenDiagnostic,
}) {
  const profile = useMemo(
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
  const analysis = profile.analysis

  return (
    <section className="space-y-4">
      <div className="px-1">
        <p className="text-[10px] font-extrabold tracking-[0.14em] text-brand-500">LEARNING ANALYTICS</p>
        <h2 className="font-display text-xl font-extrabold text-ink">学習脳力と記憶の分析</h2>
        <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/45">
          テスト結果・回答・復習間隔・学習時刻から、現在の学び方を推定します。
        </p>
      </div>

      <DiagnosticSnapshot
        diagnostic={profile.diagnostic}
        onOpen={onOpenDiagnostic}
      />
      <LearningPowerProfile profile={profile} />
      <RetentionFlow analysis={analysis} />
      <MemoryBalance analysis={analysis} />
      <ForgettingCurve analysis={analysis} />
      <SkillProfile analysis={analysis} />
      <EfficiencyClock analysis={analysis} />

      <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px] font-bold leading-relaxed text-slate-500">
        学習脳力は固定された才能やIQではなく、学習履歴に基づく変化する参考値です。
        脳波・医療検査による測定ではありません。
        時刻別分析と忘却曲線は、今後の回答が増えるほど個人の傾向に近づきます。
      </p>
    </section>
  )
}
