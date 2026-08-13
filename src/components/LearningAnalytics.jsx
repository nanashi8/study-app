import { useMemo } from 'react'
import { buildLearningPowerProfile } from '../lib/learningPower.js'
import { Button, Card, cx } from './ui.jsx'

const DIAGNOSTIC_SKILL_META = {
  vocab: { emoji: '📖', label: '英単語' },
  grammar: { emoji: '💡', label: '文法・構文' },
  usage: { emoji: '✨', label: '熟語・語法' },
  reading: { emoji: '📚', label: '長文読解' },
}

const SCIENCE_REFERENCES = [
  {
    id: 'retrieval',
    label: '想起練習',
    practice: '答えを見る前に、自力で一度思い出す。',
    citation: 'Roediger & Karpicke (2006)',
    href: 'https://doi.org/10.1111/j.1467-9280.2006.01693.x',
  },
  {
    id: 'spacing',
    label: '分散学習',
    practice: '同じ項目を一度に詰め込まず、間隔を空けて再学習する。',
    citation: 'Cepeda et al. (2006)',
    href: 'https://doi.org/10.1037/0033-2909.132.3.354',
  },
  {
    id: 'implementation',
    label: '実行意図',
    practice: '「いつ・どこで・何をするか」を、もし〜なら〜する形式で決める。',
    citation: 'Gollwitzer (1999)',
    href: 'https://doi.org/10.1037/0003-066X.54.7.493',
  },
]

const asPercent = (value) =>
  value == null ? '—' : `${Math.round(value * 100)}%`

const formatCount = (value) =>
  new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 1 }).format(value ?? 0)

const formatDiagnosticDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '実施日不明'
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

const formatWindow = (window) => {
  if (!window) return null
  const start = String(window.start).padStart(2, '0')
  const end = String(window.end).padStart(2, '0')
  return `${start}:00〜${window.end <= window.start ? '翌' : ''}${end}:00`
}

const confidenceLabel = (confidence) => {
  if (confidence === 'stable') return '安定'
  if (confidence === 'growing') return '更新中'
  if (confidence === 'starting') return '初期'
  return '未判定'
}

const readinessLabel = (readiness) => {
  if (readiness === 'stable') return '十分'
  if (readiness === 'growing') return '増加中'
  if (readiness === 'starting') return '少数'
  return '未収集'
}

const gradeFor = (score) => {
  if (score == null) return '—'
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  return 'D'
}

const gradeClass = (grade) => ({
  A: 'bg-emerald-50 text-emerald-800',
  B: 'bg-sky-50 text-sky-800',
  C: 'bg-amber-50 text-amber-800',
  D: 'bg-rose-50 text-rose-800',
}[grade] ?? 'bg-slate-100 text-slate-500')

function ReportSection({ number, title, note, children, className = '' }) {
  return (
    <Card className={cx('overflow-hidden rounded-xl border-slate-300 shadow-none', className)}>
      <div className="flex items-start gap-3 border-b border-slate-300 bg-slate-100 px-3 py-2.5">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-sm bg-slate-800 text-[10px] font-extrabold text-white">
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-extrabold text-slate-950">{title}</h2>
          {note && <p className="mt-0.5 text-[10px] font-bold leading-relaxed text-slate-500">{note}</p>}
        </div>
      </div>
      {children}
    </Card>
  )
}

function ReportHeader({ profile, analysis }) {
  return (
    <header
      className="overflow-hidden rounded-xl border-2 border-slate-700 bg-white"
      data-learning-analysis-report
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-300 bg-slate-800 px-4 py-3 text-white">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.2em] text-slate-300">ACADEMIC PERFORMANCE RECORD</p>
          <h1 className="mt-0.5 font-display text-xl font-extrabold">学習成績分析票</h1>
        </div>
        <div className="border border-slate-500 px-2 py-1 text-right">
          <p className="text-[9px] font-bold text-slate-300">分析信頼度</p>
          <p className="text-xs font-extrabold">{confidenceLabel(profile.confidence)}</p>
        </div>
      </div>
      <dl className="grid grid-cols-2 divide-x divide-y divide-slate-300 text-xs sm:grid-cols-4">
        <div className="p-3">
          <dt className="text-[10px] font-extrabold text-slate-500">総合参考値</dt>
          <dd className="mt-0.5 font-display text-xl font-extrabold tabular-nums text-slate-950">
            {profile.score ?? '—'}<span className="ml-1 text-[10px] text-slate-500">/ 100</span>
          </dd>
        </div>
        <div className="p-3">
          <dt className="text-[10px] font-extrabold text-slate-500">採点済み標本</dt>
          <dd className="mt-0.5 font-display text-xl font-extrabold tabular-nums text-slate-950">{formatCount(analysis.scored)}</dd>
        </div>
        <div className="p-3">
          <dt className="text-[10px] font-extrabold text-slate-500">学習済み項目</dt>
          <dd className="mt-0.5 font-display text-xl font-extrabold tabular-nums text-slate-950">{formatCount(analysis.learnedItems)}</dd>
        </div>
        <div className="p-3">
          <dt className="text-[10px] font-extrabold text-slate-500">データ充足</dt>
          <dd className="mt-1 text-sm font-extrabold text-slate-800">{readinessLabel(analysis.trackingReadiness)}</dd>
        </div>
      </dl>
    </header>
  )
}

function SummaryTable({ profile, analysis, dueCount }) {
  const rows = [
    ['想起正答率', asPercent(analysis.retentionRate), `${analysis.correct}/${analysis.scored || 0}回答`, '採点済み回答で再現できた割合'],
    ['定着段階指数', `${analysis.memoryScore}/100`, `${analysis.learnedItems}項目`, 'SRSの反復段階から算出した参考値'],
    ['長期段階', `${analysis.stages.longPct}%`, `${analysis.stages.long}項目`, 'SRS BOX 4以上の構成比'],
    ['復習待ち', `${dueCount}項目`, dueCount ? '対応が必要' : '滞留なし', '期限到来済み英単語の件数'],
    ['活動日', `${profile.habit.activeDays28}/28日`, `直近7日 ${profile.habit.activeDays7}日`, '回答を1件以上記録した日'],
    ['記録日平均', analysis.averageInputsPerActiveDay == null ? '—' : `${formatCount(analysis.averageInputsPerActiveDay)}回`, `${analysis.activeDays}記録日`, '活動日だけを分母にした平均'],
    ['推奨時間帯', formatWindow(analysis.bestWindow) ?? '19:00〜22:00（仮）', analysis.bestWindow ? `${analysis.bestWindow.scored}回答` : '標本不足', '3時間帯で5回答以上のとき個別推定'],
  ]

  return (
    <ReportSection number="01" title="総合所見" note="観測値、標本数、推定の根拠を分けて記載">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[35rem] border-collapse text-xs" data-analysis-summary-table>
          <thead>
            <tr className="border-b border-slate-300 bg-white text-left text-[10px] font-extrabold text-slate-500">
              <th className="px-3 py-2">評価項目</th>
              <th className="px-3 py-2">現在値</th>
              <th className="px-3 py-2">標本・状態</th>
              <th className="px-3 py-2">定義</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, value, evidence, definition]) => (
              <tr key={label} className="border-b border-slate-200 last:border-0">
                <th className="px-3 py-2 text-left font-extrabold text-slate-800">{label}</th>
                <td className="px-3 py-2 font-extrabold tabular-nums text-slate-950">{value}</td>
                <td className="px-3 py-2 font-bold text-slate-600">{evidence}</td>
                <td className="px-3 py-2 font-bold text-slate-500">{definition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReportSection>
  )
}

function DiagnosticSnapshot({ diagnostic, onOpen }) {
  if (!diagnostic) {
    return (
      <ReportSection number="02" title="最新の学習診断" note="英語4分野・28問の統一診断" className="p-0">
        <div className="p-4" data-diagnostic-status>
          <p className="text-sm font-extrabold text-slate-900">診断結果：未実施</p>
          <p className="mt-1 text-xs font-bold leading-relaxed text-slate-500">
            まだ診断結果がありません。分野間を同じ条件で比較するには、28問の診断を実施してください。
          </p>
          <Button full className="mt-3" variant="secondary" onClick={onOpen}>学習診断を受ける</Button>
        </div>
      </ReportSection>
    )
  }

  const skillResults = Array.isArray(diagnostic.skillResults) ? diagnostic.skillResults : []
  const strength = skillResults.find((skill) => skill.id === diagnostic.strengthSkillId)
  const priority = skillResults.find((skill) => skill.id === diagnostic.prioritySkillId)
  const total = Number(diagnostic.total) || 0
  const score = Number(diagnostic.score) || 0
  const accuracy = Number.isFinite(diagnostic.accuracy)
    ? diagnostic.accuracy
    : total ? score / total : 0

  return (
    <ReportSection number="02" title="最新の学習診断" note={`実施日 ${formatDiagnosticDate(diagnostic.completedAt)}`}>
      <div data-diagnostic-status>
        <dl className="grid grid-cols-2 divide-x divide-y divide-slate-200 border-b border-slate-300 text-xs sm:grid-cols-4">
          {[
            ['得点', `${score}/${total}`],
            ['正答率', `${Math.round(accuracy * 100)}%`],
            ['推定偏差値', diagnostic.deviation ?? '—'],
            ['英検目安', diagnostic.estimatedLevel?.label ?? '—'],
          ].map(([label, value]) => (
            <div key={label} className="p-3 text-center">
              <dt className="text-[10px] font-extrabold text-slate-500">{label}</dt>
              <dd className="mt-0.5 font-display text-lg font-extrabold tabular-nums text-slate-950">{value}</dd>
            </div>
          ))}
        </dl>
        <table className="w-full border-collapse text-xs">
          <tbody>
            <tr className="border-b border-slate-200">
              <th className="w-28 bg-emerald-50 px-3 py-2 text-left font-extrabold text-emerald-900">今回の得意</th>
              <td className="px-3 py-2 font-bold text-slate-700">
                {strength ? `${DIAGNOSTIC_SKILL_META[strength.id]?.emoji ?? ''} ${DIAGNOSTIC_SKILL_META[strength.id]?.label ?? strength.id}（${strength.correct}/${strength.total}問）` : '判定中'}
              </td>
            </tr>
            <tr>
              <th className="w-28 bg-amber-50 px-3 py-2 text-left font-extrabold text-amber-900">復習優先</th>
              <td className="px-3 py-2 font-bold text-slate-700">
                {priority ? `${DIAGNOSTIC_SKILL_META[priority.id]?.emoji ?? ''} ${DIAGNOSTIC_SKILL_META[priority.id]?.label ?? priority.id}（${priority.correct}/${priority.total}問）` : '明確な弱点なし'}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="p-3">
          <p className="text-[10px] font-bold leading-relaxed text-slate-500">偏差値と級はアプリ内問題による参考推定で、公式試験結果ではありません。</p>
          <Button full className="mt-2" variant="secondary" onClick={onOpen}>学習診断の4分野を見る</Button>
        </div>
      </div>
    </ReportSection>
  )
}

function DimensionTable({ profile }) {
  return (
    <ReportSection number="03" title="評定表" note="4軸の現在値。A〜Dは固定能力ではなく、現時点の履歴区分">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-xs" data-dimension-grade-table>
          <thead>
            <tr className="border-b border-slate-300 text-left text-[10px] font-extrabold text-slate-500">
              <th className="px-3 py-2">評価領域</th>
              <th className="px-3 py-2 text-center">評定</th>
              <th className="px-3 py-2 text-right">参考値</th>
              <th className="px-3 py-2">測定根拠</th>
              <th className="px-3 py-2">留意点</th>
            </tr>
          </thead>
          <tbody>
            {profile.dimensions.map((item) => {
              const grade = gradeFor(item.score)
              return (
                <tr key={item.id} className="border-b border-slate-200 last:border-0">
                  <th className="px-3 py-2 text-left font-extrabold text-slate-800">{item.label}</th>
                  <td className="px-3 py-2 text-center">
                    <span className={cx('inline-grid h-7 w-7 place-items-center rounded-sm font-display text-sm font-extrabold', gradeClass(grade))}>{grade}</span>
                  </td>
                  <td className="px-3 py-2 text-right font-extrabold tabular-nums text-slate-950">{item.score ?? '—'}</td>
                  <td className="px-3 py-2 font-bold text-slate-600">{item.evidence}</td>
                  <td className="px-3 py-2 font-bold text-slate-500">{item.note}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </ReportSection>
  )
}

function RetentionDistribution({ analysis }) {
  const stages = [
    { id: 'long', label: '長期段階', count: analysis.stages.long, pct: analysis.stages.longPct, color: '#047857', criterion: 'SRS BOX 4以上' },
    { id: 'short', label: '短期段階', count: analysis.stages.short, pct: analysis.stages.shortPct, color: '#475569', criterion: 'SRS BOX 1〜3' },
    { id: 'fragile', label: '要再学習', count: analysis.stages.fragile, pct: analysis.stages.fragilePct, color: '#b45309', criterion: 'SRS BOX 0' },
  ]

  return (
    <ReportSection number="04" title="記憶段階構成" note="項目数の内訳は比較に有効なため、構成比を帯グラフで併記">
      <div className="p-3">
        <div className="flex h-5 overflow-hidden border border-slate-300 bg-slate-100" aria-label="記憶段階の構成比">
          {analysis.learnedItems > 0 && stages.map((stage) => (
            <span key={stage.id} style={{ width: `${stage.pct}%`, backgroundColor: stage.color }} />
          ))}
        </div>
      </div>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-y border-slate-300 bg-slate-50 text-left text-[10px] font-extrabold text-slate-500">
            <th className="px-3 py-2">段階</th>
            <th className="px-3 py-2 text-right">項目数</th>
            <th className="px-3 py-2 text-right">構成比</th>
            <th className="px-3 py-2">判定基準</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((stage) => (
            <tr key={stage.id} className="border-b border-slate-200 last:border-0">
              <th className="px-3 py-2 text-left font-extrabold text-slate-800">
                <span className="mr-2 inline-block h-2.5 w-2.5" style={{ backgroundColor: stage.color }} />{stage.label}
              </th>
              <td className="px-3 py-2 text-right font-bold tabular-nums">{stage.count}</td>
              <td className="px-3 py-2 text-right font-extrabold tabular-nums">{stage.pct}%</td>
              <td className="px-3 py-2 font-bold text-slate-500">{stage.criterion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ReportSection>
  )
}

function SkillTable({ analysis }) {
  return (
    <ReportSection number="05" title="分野別成績" note="最低3回答以上を得意・弱点判定に使用">
      {analysis.skills.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[31rem] border-collapse text-xs" data-skill-analysis-table>
            <thead>
              <tr className="border-b border-slate-300 text-left text-[10px] font-extrabold text-slate-500">
                <th className="px-3 py-2">分野</th>
                <th className="px-3 py-2 text-right">回答</th>
                <th className="px-3 py-2 text-right">正答</th>
                <th className="px-3 py-2 text-right">正答率</th>
                <th className="w-36 px-3 py-2">比較図</th>
              </tr>
            </thead>
            <tbody>
              {analysis.skills.map((skill) => (
                <tr key={skill.id} className="border-b border-slate-200 last:border-0">
                  <th className="px-3 py-2 text-left font-extrabold text-slate-800">{skill.emoji} {skill.label}</th>
                  <td className="px-3 py-2 text-right font-bold tabular-nums">{skill.scored}</td>
                  <td className="px-3 py-2 text-right font-bold tabular-nums">{skill.correct}</td>
                  <td className="px-3 py-2 text-right font-extrabold tabular-nums">{asPercent(skill.accuracy)}</td>
                  <td className="px-3 py-2">
                    <div className="h-2 overflow-hidden border border-slate-200 bg-slate-100">
                      <span className="block h-full" style={{ width: `${Math.round((skill.accuracy ?? 0) * 100)}%`, backgroundColor: skill.color }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-4 text-center text-xs font-bold text-slate-500">採点済み回答が増えると分野別成績を表示します。</p>
      )}
    </ReportSection>
  )
}

function IntervalAnalysis({ analysis }) {
  const hasIntervals = analysis.intervals.some((interval) => interval.scored > 0)
  return (
    <ReportSection number="06" title="復習間隔別・想起率" note="同じ教材を時間を空けて解いた回答だけを集計">
      {hasIntervals ? (
        <div className="space-y-3 p-4" data-interval-recall-chart>
          {analysis.intervals.map((interval) => (
            <div key={interval.id} className="grid grid-cols-[5.5rem_1fr_3.4rem] items-center gap-2 text-[10px] font-bold">
              <span className="text-slate-600">{interval.label}</span>
              <div className="h-4 overflow-hidden border border-slate-200 bg-slate-100">
                <span
                  className="block h-full bg-slate-700"
                  style={{ width: `${Math.round((interval.accuracy ?? 0) * 100)}%` }}
                />
              </div>
              <span className="text-right tabular-nums text-slate-700">{asPercent(interval.accuracy)} / n={interval.scored}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-4 text-xs font-bold leading-relaxed text-slate-500">
          間隔別データは未収集です。同じ教材を時間を空けて2回以上学習すると表示します。
        </p>
      )}
    </ReportSection>
  )
}

function hourCellClass(stat) {
  if (!stat.scored) return 'bg-slate-100 text-slate-400'
  if (stat.accuracy >= 0.8) return 'bg-emerald-100 text-emerald-950'
  if (stat.accuracy >= 0.6) return 'bg-amber-100 text-amber-950'
  return 'bg-rose-100 text-rose-950'
}

function HourlyMatrix({ analysis }) {
  return (
    <ReportSection number="07" title="時間帯別成績" note="各時刻の正答率と標本数。5回答未満は推奨時間帯の判定に不使用">
      <div className="grid grid-cols-6 gap-px bg-slate-300 p-px" data-hourly-analysis-matrix>
        {analysis.hourly.map((stat) => (
          <div key={stat.hour} className={cx('min-h-14 p-1.5 text-center', hourCellClass(stat))}>
            <p className="text-[9px] font-extrabold tabular-nums">{String(stat.hour).padStart(2, '0')}時</p>
            <p className="mt-0.5 text-xs font-extrabold tabular-nums">{stat.scored ? asPercent(stat.accuracy) : '—'}</p>
            <p className="text-[8px] font-bold opacity-60">n={stat.scored}</p>
          </div>
        ))}
      </div>
    </ReportSection>
  )
}

function AdviceReport({ profile, analysis, dueCount, onNavigate }) {
  const recommendation = profile.recommendation
  const scheduledWindow = formatWindow(analysis.bestWindow) ?? '19:00〜19:20（仮）'
  const successCriterion = recommendation.id === 'measure'
    ? '診断28問を完了する'
    : dueCount > 0
      ? `復習待ちを${Math.min(dueCount, 20)}項目進める`
      : '10問を解き、正誤を記録する'
  const encouragement = profile.confidence === 'empty'
    ? '最初の10回答が分析の出発点です。小さく始めても、記録が次の教材選びを具体化します。'
    : analysis.retentionRate != null && analysis.retentionRate >= 0.8
      ? '想起できた割合は安定しています。今の方法を維持し、弱点分野へ少しずつ負荷を移す段階です。'
      : dueCount > 0
        ? '復習待ちは失敗の印ではなく、思い出す練習を入れる時期を示す作業票です。今日の一部を処理すれば前進です。'
        : '記録が増えるたびに推定は更新されます。結果を能力の固定評価ではなく、次の一手を選ぶ材料として使ってください。'

  return (
    <ReportSection number="08" title="学習処方・次の行動" note="現在の結果と進捗から、実行可能な一手へ変換">
      <div className="p-4">
        <div className="border-l-4 border-slate-800 bg-slate-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-extrabold tracking-[0.12em] text-slate-500">優先度：{recommendation.intensity}</p>
            <span className="border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-extrabold text-slate-600">個別提案</span>
          </div>
          <h3 className="mt-1 font-display text-lg font-extrabold text-slate-950">{recommendation.title}</h3>
          <p className="mt-1 text-xs font-bold leading-relaxed text-slate-600">{recommendation.reason}</p>
        </div>

        <table className="mt-3 w-full border-collapse text-xs" data-action-plan-table>
          <tbody>
            {[
              ['実施内容', recommendation.actionLabel],
              ['実施時刻', scheduledWindow],
              ['成功基準', successCriterion],
              ['実施方法', '答えを見る前に想起し、誤答は間隔を空けて再確認'],
              ['次回確認', '実施後の正答率・復習待ち件数で再判定'],
            ].map(([label, value]) => (
              <tr key={label} className="border-b border-slate-200 last:border-0">
                <th className="w-24 bg-slate-100 px-3 py-2 text-left font-extrabold text-slate-700">{label}</th>
                <td className="px-3 py-2 font-bold leading-relaxed text-slate-700">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-3 border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-extrabold leading-relaxed text-emerald-900">
          {encouragement}
        </p>

        {recommendation.screen && (
          <Button
            full
            className="mt-3"
            onClick={() => onNavigate?.(recommendation.screen, recommendation.params ?? {})}
          >
            {recommendation.actionLabel}
          </Button>
        )}

        <details className="mt-3 border border-slate-300 bg-white" data-scientific-basis>
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 text-xs font-extrabold text-slate-700">
            <span>助言の科学的根拠と限界</span>
            <span className="text-slate-400">3原則</span>
          </summary>
          <div className="space-y-3 border-t border-slate-200 p-3">
            {SCIENCE_REFERENCES.map((reference) => (
              <div key={reference.id}>
                <p className="text-xs font-extrabold text-slate-800">{reference.label}</p>
                <p className="mt-0.5 text-[10px] font-bold leading-relaxed text-slate-600">{reference.practice}</p>
                <a
                  href={reference.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 inline-block text-[10px] font-extrabold text-sky-700 underline"
                >
                  {reference.citation}
                </a>
              </div>
            ))}
            <p className="border-t border-slate-200 pt-2 text-[10px] font-bold leading-relaxed text-slate-500">
              文献は一般的な学習原則の根拠です。このアプリ内の個人別推定は観察履歴に基づき、因果効果や医学的状態を証明するものではありません。
            </p>
          </div>
        </details>
      </div>
    </ReportSection>
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
  onNavigate,
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
    <section className="space-y-4" aria-label="学習成績の詳細分析">
      <ReportHeader profile={profile} analysis={analysis} />
      <SummaryTable profile={profile} analysis={analysis} dueCount={dueCount} />
      <DiagnosticSnapshot diagnostic={profile.diagnostic} onOpen={onOpenDiagnostic} />
      <DimensionTable profile={profile} />
      <RetentionDistribution analysis={analysis} />
      <SkillTable analysis={analysis} />
      <IntervalAnalysis analysis={analysis} />
      <HourlyMatrix analysis={analysis} />
      <AdviceReport profile={profile} analysis={analysis} dueCount={dueCount} onNavigate={onNavigate} />

      <p className="border border-slate-300 bg-slate-100 px-3 py-2.5 text-[10px] font-bold leading-relaxed text-slate-600">
        総合参考値と評定は、固定された才能やIQではなく、学習履歴に基づいて変化する参考値です。
        脳波・医療検査・公式試験による測定ではありません。標本数が少ない区分は、今後の回答で大きく変動します。
      </p>
    </section>
  )
}
