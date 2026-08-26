import { SKILL_ROUTES } from '../lib/learningPower.js'
import { ArrowRight, Chart, Sparkles, Target } from './Icons.jsx'
import { Button, Card } from './ui.jsx'

function percent(value) {
  return value == null ? '記録なし' : `${Math.round(value * 100)}%`
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
        : '最後の学習診断をもとにしています',
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
    label: '記録なし',
    detail: '診断やテストに答えると表示します',
  }
}

export function LearningAdvisorSummary({ profile, onOpenAdvisor, onOpenAnalysis }) {
  const weakness = learningWeakness(profile)
  const recommendation = profile.recommendation

  return (
    <section
      className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white"
      aria-label="学習状況の要約"
      data-menu-learning-overview
    >
      <button
        type="button"
        onClick={onOpenAdvisor}
        className="flex min-h-14 w-full items-center gap-2.5 px-3 py-2 text-left active:bg-violet-50"
        data-menu-advisor-entry
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-700">
          <Sparkles size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-extrabold text-violet-700">今日のおすすめ</span>
          <strong className="block truncate text-sm font-extrabold text-ink">{recommendation.actionLabel}</strong>
        </span>
        <ArrowRight size={17} className="shrink-0 text-violet-300" />
      </button>
      <button
        type="button"
        onClick={onOpenAnalysis}
        className="flex min-h-12 w-full items-center gap-2.5 px-3 py-2 text-left active:bg-slate-50"
        data-menu-retention-entry
      >
        <span className="grid h-8 w-9 shrink-0 place-items-center text-slate-500">
          <Chart size={17} />
        </span>
        <span className="min-w-0 flex-1 text-sm font-extrabold text-slate-700">学習記録</span>
        <span className="truncate text-[11px] font-bold text-slate-400" data-menu-advisor-meta>
          復習：{weakness.label}・回答{profile.analysis.scored}回
        </span>
        <ArrowRight size={17} className="shrink-0 text-slate-300" />
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
              <p className="text-xs font-extrabold tracking-wide text-white/60">これまでの学習記録</p>
              <p className="mt-1 font-display text-3xl font-extrabold">
                {profile.analysis.scored}<span className="ml-1 text-sm text-white/55">回答</span>
              </p>
            </div>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-extrabold text-white/80">
              最近7日間で{profile.habit.activeDays7}日
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {profile.dimensions.map((dimension) => (
              <div key={dimension.id} className="rounded-2xl bg-white/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-extrabold text-white/75">{dimension.label}</span>
                </div>
                <p className="mt-1.5 text-[10px] font-bold leading-relaxed text-white/70">{dimension.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2.5">
        <Card className="p-3" data-advisor-strength>
          <p className="text-xs font-extrabold text-emerald-600">得意</p>
          <p className="mt-1 font-display text-base font-extrabold text-ink">
            {strength?.label ?? '記録なし'}
          </p>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/45">
            {strength ? `${strength.scored}回答・正答率 ${percent(strength.accuracy)}` : 'テストに答えると表示します'}
          </p>
        </Card>
        <Card className="p-3" data-advisor-weakness>
          <p className="text-xs font-extrabold text-amber-600">先に復習</p>
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
          おすすめの時間：{recommendation.timing}
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
        <Chart size={18} /> 学習記録とおすすめを詳しく見る
      </Button>

    </section>
  )
}
