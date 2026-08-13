import { SKILL_ROUTES } from '../lib/learningPower.js'
import { ArrowRight, Chart, Sparkles, Target } from './Icons.jsx'
import { Button, Card, ProgressBar } from './ui.jsx'

function confidenceLabel(confidence) {
  if (confidence === 'stable') return '分析精度：安定'
  if (confidence === 'growing') return '分析精度：成長中'
  if (confidence === 'starting') return '分析精度：初期'
  return 'データを収集中'
}

function percent(value) {
  return value == null ? '計測中' : `${Math.round(value * 100)}%`
}

function compactWindow(window) {
  if (!window) return null
  const crossesMidnight = window.end <= window.start
  return `${window.start}〜${crossesMidnight ? '翌' : ''}${window.end}時`
}

function learningWeakness(profile) {
  const diagnosticSkillId = profile?.diagnostic?.prioritySkillId
  const diagnosticRoute = SKILL_ROUTES[diagnosticSkillId]
  const diagnosticResult = profile?.diagnostic?.skillResults?.find(
    (skill) => skill.id === diagnosticSkillId,
  )
  if (diagnosticRoute) {
    return {
      label: diagnosticRoute.label,
      detail: diagnosticResult?.total
        ? `診断 ${diagnosticResult.correct}/${diagnosticResult.total}問正解`
        : '最新の学習診断から判定',
    }
  }

  const tracked = profile?.analysis?.weakness
  if (tracked) {
    return {
      label: tracked.label,
      detail: `${tracked.scored}回答・正答率${percent(tracked.accuracy)}`,
    }
  }

  return {
    label: '計測中',
    detail: '診断や採点済み学習が増えると表示します',
  }
}

function RetentionSnapshot({ profile }) {
  const analysis = profile.analysis
  const bestWindow = compactWindow(analysis.bestWindow)
  return (
    <div className="mt-3 grid grid-cols-3 gap-2" data-menu-retention-snapshot>
      <div className="rounded-xl bg-white/10 px-2 py-2 text-center">
        <span className="block text-[10px] font-bold text-white/60">定着推定</span>
        <strong className="font-display text-lg font-extrabold">
          {analysis.learnedItems || analysis.scored ? analysis.memoryScore : '—'}
        </strong>
      </div>
      <div className="rounded-xl bg-white/10 px-2 py-2 text-center">
        <span className="block text-[10px] font-bold text-white/60">長期段階</span>
        <strong className="font-display text-lg font-extrabold">
          {analysis.learnedItems ? `${analysis.stages.longPct}%` : '—'}
        </strong>
      </div>
      <div className="rounded-xl bg-white/10 px-2 py-2 text-center">
        <span className="block text-[10px] font-bold text-white/60">得意時間</span>
        <strong className="block truncate font-display text-sm font-extrabold">
          {bestWindow ?? '計測中'}
        </strong>
      </div>
    </div>
  )
}

export function LearningAdvisorSummary({ profile, onOpenAdvisor, onOpenAnalysis }) {
  const weakness = learningWeakness(profile)
  const recommendation = profile.recommendation

  return (
    <section className="space-y-2.5" aria-label="学習状況の要約" data-menu-learning-overview>
      <button
        type="button"
        onClick={onOpenAdvisor}
        className="w-full rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-4 text-left text-white shadow-lg shadow-violet-200/60 active:scale-[0.99]"
        data-menu-advisor-entry
      >
        <span className="flex items-start gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-center">
            <strong className="font-display text-xl font-extrabold leading-none">
              {profile.score ?? '—'}
            </strong>
            <span className="sr-only">100点中</span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-white/75">
              <Sparkles size={16} /> 学習アドバイザー
            </span>
            <strong className="mt-1 block font-display text-base font-extrabold">
              次：{recommendation.actionLabel}
            </strong>
            <span className="mt-1 block text-xs font-bold text-white/70">
              弱点：{weakness.label}
            </span>
          </span>
          <ArrowRight size={19} className="mt-1 shrink-0 text-white/60" />
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenAnalysis}
        className="w-full rounded-2xl bg-slate-900 p-4 text-left text-white active:bg-slate-800"
        data-menu-retention-entry
      >
        <span className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-display text-sm font-extrabold">
            <Chart size={18} /> 定着・学習効率を分析
          </span>
          <ArrowRight size={18} className="shrink-0 text-white/45" />
        </span>
        <RetentionSnapshot profile={profile} />
      </button>
    </section>
  )
}

export function LearningAdvisorPanel({ profile, onStart, onOpenAnalysis }) {
  const weakness = learningWeakness(profile)
  const recommendation = profile.recommendation
  const strength = profile.analysis.strength

  return (
    <section className="space-y-4" aria-label="学習アドバイザー" data-learning-advisor-panel>
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold tracking-wide text-white/60">現在の学習プロフィール</p>
              <p className="mt-1 font-display text-3xl font-extrabold">
                {profile.score ?? '—'}<span className="ml-1 text-sm text-white/55">/ 100</span>
              </p>
            </div>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-extrabold text-white/80">
              {confidenceLabel(profile.confidence)}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {profile.dimensions.map((dimension) => (
              <div key={dimension.id} className="rounded-2xl bg-white/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-extrabold text-white/75">{dimension.label}</span>
                  <strong className="font-display text-lg font-extrabold">{dimension.score ?? '—'}</strong>
                </div>
                <ProgressBar
                  value={(dimension.score ?? 0) / 100}
                  color="#ffffff"
                  className="mt-1.5 h-1.5 bg-white/15"
                />
                <p className="mt-1.5 truncate text-[10px] font-bold text-white/55">{dimension.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2.5">
        <Card className="p-3" data-advisor-strength>
          <p className="text-xs font-extrabold text-emerald-600">得意</p>
          <p className="mt-1 font-display text-base font-extrabold text-ink">
            {strength?.label ?? '計測中'}
          </p>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/45">
            {strength ? `${strength.scored}回答・正答率${percent(strength.accuracy)}` : '採点済み学習を収集中'}
          </p>
        </Card>
        <Card className="p-3" data-advisor-weakness>
          <p className="text-xs font-extrabold text-amber-600">優先して伸ばす</p>
          <p className="mt-1 font-display text-base font-extrabold text-ink">{weakness.label}</p>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/45">{weakness.detail}</p>
        </Card>
      </div>

      <Card className="border-violet-200 p-4" data-advisor-next-unit>
        <div className="flex items-center gap-2 text-violet-700">
          <Target size={20} />
          <h2 className="font-display text-base font-extrabold">次に進む学習</h2>
        </div>
        <p className="mt-2 font-display text-xl font-extrabold text-ink">{recommendation.title}</p>
        <p className="mt-2 text-sm font-bold leading-relaxed text-ink/55">{recommendation.reason}</p>
        <p className="mt-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-extrabold text-violet-700">
          目安：{recommendation.timing}
        </p>
        <Button
          full
          className="mt-3"
          onClick={() => onStart?.(recommendation.screen, recommendation.params ?? {})}
        >
          {recommendation.actionLabel} <ArrowRight size={18} />
        </Button>
      </Card>

      <Button full variant="secondary" onClick={onOpenAnalysis}>
        <Chart size={18} /> 定着と学習効率を詳しく見る
      </Button>

      <p className="rounded-2xl bg-slate-100 px-3 py-2.5 text-xs font-bold leading-relaxed text-slate-500">
        このプロフィールは、診断・正誤・復習間隔・学習時刻から作る変化する目安です。
        固定された能力やIQ、医療的な測定ではありません。
      </p>
    </section>
  )
}
