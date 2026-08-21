import { Button, Card, ProgressBar } from './ui.jsx'
import { StatusDistributionBar } from './LearningStatusBars.jsx'
import {
  ArrowRight,
  Bookmark,
  Chart,
  ChevronLeft,
  Refresh,
  Target,
} from './Icons.jsx'
import { srsStageLabel } from '../lib/srs.js'

const asPercent = (value) => (
  Number.isFinite(value) ? `${Math.round(value * 100)}%` : '—'
)

const dueLabel = (days) => {
  if (days <= 0) return '今日もう一度'
  if (days === 1) return '明日'
  return `${days}日後`
}

function CurveChart({ curve = [] }) {
  const points = curve.map((point, index) => {
    const x = 30 + index * 52
    const y = Number.isFinite(point.retention)
      ? 112 - point.retention * 82
      : 112
    return { ...point, x, y }
  })
  const line = points.every((point) => Number.isFinite(point.retention))
    ? points.map((point) => `${point.x},${point.y}`).join(' ')
    : ''
  const curveLabel = points
    .filter((point) => Number.isFinite(point.retention))
    .map((point) => `${point.day === 0 ? '現在' : `${point.day}日後`} ${asPercent(point.retention)}`)
    .join('、')

  return (
    <svg
      viewBox="0 0 320 138"
      className="block h-auto w-full"
      role="img"
      aria-label={`今回の単語を復習しない場合の定着予測。${curveLabel}`}
    >
      {[0.25, 0.5, 0.75, 1].map((value) => {
        const y = 112 - value * 82
        return (
          <g key={value}>
            <line x1="30" x2="290" y1={y} y2={y} stroke="#dbeafe" strokeWidth="1" />
            <text x="25" y={y + 3} textAnchor="end" fontSize="8" fill="#64748b">
              {Math.round(value * 100)}%
            </text>
          </g>
        )
      })}
      <line x1="30" x2="290" y1="112" y2="112" stroke="#94a3b8" strokeWidth="1" />
      {line && (
        <polyline
          points={line}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {points.map((point) => (
        <g key={point.day}>
          {Number.isFinite(point.retention) && (
            <circle cx={point.x} cy={point.y} r="4" fill="#4f46e5" />
          )}
          <text x={point.x} y="128" textAnchor="middle" fontSize="8" fontWeight="700" fill="#475569">
            {point.day === 0 ? '現在' : `${point.day}日`}
          </text>
        </g>
      ))}
    </svg>
  )
}

function StatCell({ value, label, tone = 'text-ink' }) {
  return (
    <div className="rounded-xl bg-white/90 px-2 py-2.5 text-center shadow-sm">
      <b className={`block font-display text-xl font-extrabold tabular-nums ${tone}`}>{value}</b>
      <span className="mt-0.5 block text-[10px] font-extrabold text-ink/45">{label}</span>
    </div>
  )
}

export function VocabCompletionReport({
  report,
  title,
  streak,
  onReviewNow,
  onContinue,
  onBack,
  onWord,
  onReviewSchedule = () => {},
}) {
  const { session, today, priorityItems, schedule, curve } = report
  const judged = session.remembered + session.forgot
  const rememberedRate = judged ? session.remembered / judged : 0
  const currentRetention = curve.find((point) => point.day === 0)?.retention
  const threeDayRetention = curve.find((point) => point.day === 3)?.retention
  const sevenDayRetention = curve.find((point) => point.day === 7)?.retention

  return (
    <section
      className="mx-auto w-full max-w-xl space-y-3.5"
      aria-label="英単語の学習完了レポート"
      data-vocab-completion-report
    >
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-brand-600 to-sky-500 p-4 text-left text-white shadow-lg">
        <p className="text-[10px] font-extrabold tracking-[0.2em] text-white/70">LEARNING COMPLETE</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold">学習完了</h1>
        <p className="mt-0.5 truncate text-xs font-bold text-white/75">{title}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <StatCell value={`${session.remembered}語`} label="覚えた判定" tone="text-emerald-700" />
          <StatCell value={`${session.forgot}語`} label="まだ" tone="text-rose-600" />
          <StatCell value={`${streak}日`} label="連続学習" tone="text-amber-600" />
        </div>
        <div className="mt-3 rounded-2xl bg-slate-950/20 p-3">
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-extrabold">
            <span>今回の自己判定</span>
            <span className="tabular-nums">{session.remembered}/{judged}語・{asPercent(rememberedRate)}</span>
          </div>
          <div className="rounded-xl bg-white p-2">
            <StatusDistributionBar
              kind="learning"
              counts={{ learned: session.remembered, reviewing: session.forgot, unlearned: 0 }}
              compact
              unit="語"
            />
          </div>
          <p className="mt-1.5 text-[10px] font-bold leading-relaxed text-white/70">
            「覚えた」は自分で押した判定です。ほんとうに身についたかは、時間を空けてもう一度思い出せるかとクイズで確かめます。
          </p>
        </div>
      </header>

      <Card className="p-4 text-left" data-vocab-completion-today>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-indigo-500">TODAY</p>
            <h2 className="font-display text-lg font-extrabold text-ink">今日の成果</h2>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Target size={20} />
          </span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <b className="font-display text-3xl font-extrabold tabular-nums text-ink">{today.uniqueWords}</b>
            <span className="ml-1 text-sm font-extrabold text-ink/45">/{today.goal}語</span>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${today.goalReached ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
            {today.goalReached ? '今日の目標達成' : `あと${Math.max(0, today.goal - today.uniqueWords)}語`}
          </span>
        </div>
        <ProgressBar value={today.goalRate} className="mt-2" />
        <p className="mt-1.5 text-[10px] font-bold text-ink/45">今日暗記判定した英単語を重複なしで集計しています。</p>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-center">
          {[
            ['今日新しく着手', today.newWords, 'text-sky-700'],
            ['最新が「覚えた」', today.rememberedLatest, 'text-emerald-700'],
            ['今回の間隔アップ', session.advancedCount, 'text-indigo-700'],
            ['長期定着へ到達', session.newlyMasteredCount, 'text-violet-700'],
          ].map(([label, value, tone]) => (
            <div key={label} className="rounded-xl bg-slate-50 px-2 py-2.5">
              <dt className="text-[10px] font-extrabold text-ink/45">{label}</dt>
              <dd className={`mt-0.5 font-display text-xl font-extrabold tabular-nums ${tone}`}>{value}語</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="overflow-hidden text-left" data-vocab-completion-priority>
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700">
              <Bookmark size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold tracking-[0.16em] text-amber-600">RETENTION PRIORITY</p>
              <h2 className="font-display text-lg font-extrabold text-ink">定着させる語句</h2>
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
                {session.reviewNowCount > 0
                  ? `「まだ」の${session.reviewNowCount}語を先頭に、今回の語を定着優先度順で表示します。`
                  : '今回は「まだ」なし。長期定着までの段階と予測が弱い語から確認できます。'}
              </p>
            </div>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {priorityItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onWord(item.id)}
              className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left active:bg-slate-50"
              aria-label={`${item.word}の詳細を見る`}
              data-vocab-priority-word={item.id}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <b className="font-display text-base font-extrabold text-ink">{item.word}</b>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${item.needsReviewNow ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                    {item.reason}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs font-bold text-ink/50">{item.meaning}</p>
                <p className="mt-1 text-[10px] font-extrabold text-indigo-600">
                  {srsStageLabel(item.box)}・次回 {dueLabel(item.dueInDays)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <b className="block text-sm font-extrabold tabular-nums text-ink">{asPercent(item.predictedRetention)}</b>
                <span className="text-[9px] font-bold text-ink/35">現在予測</span>
              </div>
              <ArrowRight size={16} className="shrink-0 text-ink/25" />
            </button>
          ))}
        </div>
        {report.hiddenPriorityCount > 0 && (
          <p className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center text-[10px] font-bold text-ink/45">
            ほか{report.hiddenPriorityCount}語も学習記録に反映済み
          </p>
        )}
      </Card>

      <Card className="p-4 text-left" data-vocab-forgetting-curve>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-sky-600">FORGETTING CURVE</p>
            <h2 className="font-display text-lg font-extrabold text-ink">今回の忘却曲線</h2>
            <p className="mt-1 text-xs font-bold text-ink/50">このまま復習しない場合の定着予測</p>
          </div>
          <Chart size={22} className="shrink-0 text-sky-600" />
        </div>
        <div className="mt-3 overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/50 p-2">
          <CurveChart curve={curve} />
          <dl className="grid grid-cols-3 divide-x divide-sky-100 border-t border-sky-100 bg-white text-center">
            {[
              ['現在', currentRetention],
              ['3日後', threeDayRetention],
              ['7日後', sevenDayRetention],
            ].map(([label, value]) => (
              <div key={label} className="p-2">
                <dt className="text-[9px] font-bold text-ink/40">{label}</dt>
                <dd className="mt-0.5 text-sm font-extrabold tabular-nums text-ink">{asPercent(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-2 text-[10px] font-bold leading-relaxed text-ink/45">
          復習の段階・経過時間・これまでの回答の傾向から作る目安で、記憶そのものを測った値ではありません。回答のたびに更新されます。
        </p>
      </Card>

      <Card className="p-4 text-left" data-vocab-next-cycle>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Refresh size={20} />
          </span>
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-emerald-600">NEXT CYCLE</p>
            <h2 className="font-display text-lg font-extrabold text-ink">次の暗記サイクル</h2>
          </div>
        </div>
        <ol className="mt-3 space-y-2.5">
          <li className="flex gap-3 rounded-2xl bg-rose-50 p-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white">1</span>
            <div>
              <b className="text-sm font-extrabold text-ink">今は「まだ」だけ再確認</b>
              <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">
                {session.reviewNowCount > 0
                  ? `${session.reviewNowCount}語を、答えを見る前にもう一度思い出します。`
                  : '再確認は不要です。詰め込み直さず、次の期限まで間隔を空けます。'}
              </p>
            </div>
          </li>
          <li className="flex gap-3 rounded-2xl bg-indigo-50 p-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-600 text-[10px] font-extrabold text-white">2</span>
            <div className="min-w-0 flex-1">
              <b className="text-sm font-extrabold text-ink">期限が来たら思い出す</b>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {schedule.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={!item.count}
                    onClick={() => onReviewSchedule(item)}
                    className="min-h-14 rounded-lg bg-white px-1 py-2 text-center ring-1 ring-indigo-100 active:bg-indigo-50 disabled:cursor-default disabled:opacity-45"
                    aria-label={`${item.label}の${item.count}語を${item.id === 'now' ? '復習' : '先取り復習'}`}
                    data-vocab-review-schedule={item.id}
                  >
                    <span className="block text-[9px] font-bold text-ink/40">{item.label}</span>
                    <b className="mt-0.5 block text-sm font-extrabold tabular-nums text-indigo-700">{item.count}語</b>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] font-bold leading-relaxed text-indigo-700/70">
                期限前の枠もタップすると、復習を先取りできます。結果は次の期限と定着予測へ反映されます。
              </p>
              <p className="mt-1 text-[10px] font-bold leading-relaxed text-indigo-700/70" data-maintenance-review-policy>
                長期定着後は30→60→90→180日と間隔を広げ、以後は180日ごとに維持確認します。
              </p>
            </div>
          </li>
          <li className="flex gap-3 rounded-2xl bg-emerald-50 p-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-[10px] font-extrabold text-white">3</span>
            <div>
              <b className="text-sm font-extrabold text-ink">少し時間を空けて腕試し</b>
              <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">意味を見ずに取り出せるかクイズで確認し、結果を次の間隔へ反映します。</p>
            </div>
          </li>
        </ol>
      </Card>

      <div className="space-y-2.5 pb-2" data-vocab-completion-actions>
        <Button full size="lg" onClick={onReviewNow}>
          <Refresh size={18} /> 復習する
        </Button>
        <Button full variant="secondary" onClick={onContinue}>
          次へ進む <ArrowRight size={18} />
        </Button>
        <Button full variant="ghost" onClick={onBack}>
          <ChevronLeft size={18} /> 戻る
        </Button>
      </div>
    </section>
  )
}
