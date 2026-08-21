import { useMemo, useState } from 'react'
import { buildLearningPowerProfile } from '../lib/learningPower.js'
import {
  LEARNING_REPORT_DOMAINS,
  buildLearningAnalyticsReport,
  forgettingCurveForRows,
  launchForGradeGroup,
} from '../lib/learningAnalyticsReport.js'
import { MAX_SRS_BOX } from '../lib/srs.js'
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
    label: '思い出す練習',
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

const STUDY_QUOTES = [
  {
    id: 'analects',
    text: '学びて時にこれを習う、また説ばしからずや。',
    author: '孔子',
    source: '『論語』学而 第一',
    note: '学んだ内容を時間を置いて繰り返すことを、学びの喜びとして捉える言葉です。',
    href: 'https://ctext.org/analects/xue-er/ens',
  },
  {
    id: 'bacon',
    text: '知識そのものが力である。',
    author: 'フランシス・ベーコン',
    source: 'Meditationes Sacrae（1597）',
    note: '知ることを、判断し行動するための力へ結び付ける言葉です。',
    href: 'https://en.wikisource.org/wiki/The_Works_of_Francis_Bacon/Volume_1/Meditationes_Sacrae',
  },
  {
    id: 'fukuzawa',
    text: '学問の力あるとなきとによりて、その相違もできたる。',
    author: '福澤諭吉',
    source: '『学問のすすめ』初編',
    note: '生まれつきの固定差ではなく、学びによって変えられる部分へ目を向ける言葉です。',
    href: 'https://ja.wikisource.org/wiki/%E5%AD%A6%E5%95%8F%E3%81%AE%E3%81%99%E3%81%99%E3%82%81',
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

const formatDuration = (ms) => {
  const minutes = Math.round(nonNegativeMs(ms) / 60000)
  if (minutes < 1) return nonNegativeMs(ms) > 0 ? '1分未満' : '0分'
  if (minutes < 60) return `${minutes}分`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}時間${rest}分` : `${hours}時間`
}

function nonNegativeMs(value) {
  return Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0
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
          <dt className="text-[10px] font-extrabold text-slate-500">評価記録</dt>
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
  const splitSamples = analysis.activity.memory.scored + analysis.activity.test.scored
  const legacySamples = Math.max(0, analysis.scored - splitSamples)
  const testRecallRate = analysis.activity.test.scored
    ? analysis.activity.test.correct / analysis.activity.test.scored
    : legacySamples
      ? analysis.retentionRate
      : null
  const testRecallEvidence = analysis.activity.test.scored
    ? `${analysis.activity.test.correct}/${analysis.activity.test.scored}テスト`
    : legacySamples
      ? `${analysis.correct}/${analysis.scored}旧履歴`
      : 'テスト未実施'
  const rows = [
    ['テストで思い出せた割合', asPercent(testRecallRate), testRecallEvidence, analysis.activity.test.scored ? '採点テストでもう一度答えられた割合' : '旧履歴は暗記・テストの区別なし'],
    ['覚え具合の指数', `${analysis.memoryScore}/100`, `${analysis.learnedItems}項目`, 'くり返し復習の段階から出した目安'],
    ['長く覚えている段階', `${analysis.stages.longPct}%`, `${analysis.stages.long}項目`, '復習の段階4以上の割合'],
    ['英単語・今日の復習', `${dueCount}項目`, dueCount ? '対応が必要' : '滞留なし', '期限到来済み英単語の件数'],
    [
      '一日の学習時間',
      analysis.studyTime.hasEvidence ? formatDuration(analysis.studyTime.dailyAverageMs7) : '—',
      analysis.studyTime.hasEvidence
        ? `今日 ${formatDuration(analysis.studyTime.todayMs)}・直近7日で${analysis.studyTime.activeDays7}日`
        : '学習時間を計測中',
      '直近7日の合計を7日で割った1日あたりの学習時間',
    ],
    [
      '学習リズム',
      analysis.rhythm.peakHour == null ? '—' : `${analysis.rhythm.peakHour}時台が中心`,
      analysis.rhythm.score == null
        ? '学習した時刻を収集中'
        : `規則性 ${analysis.rhythm.score}%・${analysis.rhythm.activeDays}日を集計`,
      'よく学習する3つの時間帯を、どれだけ繰り返せているか',
    ],
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

const CLOCK_CENTER = 100
const CLOCK_INNER = 30
const CLOCK_OUTER = 78

const clockPoint = (hour, radius) => {
  // 0時を真上に置き、時計回りに1時間15度ずつ進める。
  const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2
  return {
    x: CLOCK_CENTER + Math.cos(angle) * radius,
    y: CLOCK_CENTER + Math.sin(angle) * radius,
  }
}

// 1時間＝15度の扇形。値が大きいほど外側へ伸びる24時間の円グラフ。
const clockSector = (hour, radius) => {
  const start = clockPoint(hour, CLOCK_INNER)
  const startOuter = clockPoint(hour, radius)
  const endOuter = clockPoint(hour + 1, radius)
  const end = clockPoint(hour + 1, CLOCK_INNER)
  return [
    `M ${start.x} ${start.y}`,
    `L ${startOuter.x} ${startOuter.y}`,
    `A ${radius} ${radius} 0 0 1 ${endOuter.x} ${endOuter.y}`,
    `L ${end.x} ${end.y}`,
    `A ${CLOCK_INNER} ${CLOCK_INNER} 0 0 0 ${start.x} ${start.y}`,
    'Z',
  ].join(' ')
}

function HourWheel({ hours, valueOf, color, caption, headline, sub, tooltip, testId }) {
  const max = hours.reduce((peak, stat) => Math.max(peak, valueOf(stat)), 0)
  return (
    <figure className="m-0" data-hour-wheel={testId}>
      <svg viewBox="0 0 200 200" className="mx-auto block h-auto w-full max-w-[15rem]" role="img" aria-label={caption}>
        <circle cx={CLOCK_CENTER} cy={CLOCK_CENTER} r={CLOCK_OUTER} fill="#f8fafc" stroke="#e2e8f0" />
        <circle cx={CLOCK_CENTER} cy={CLOCK_CENTER} r={(CLOCK_INNER + CLOCK_OUTER) / 2} fill="none" stroke="#e2e8f0" strokeDasharray="2 3" />
        {hours.map((stat) => {
          const value = valueOf(stat)
          const ratio = max ? value / max : 0
          const radius = CLOCK_INNER + 2 + ratio * (CLOCK_OUTER - CLOCK_INNER - 2)
          return (
            <path
              key={stat.hour}
              d={clockSector(stat.hour, value > 0 ? radius : CLOCK_INNER + 1)}
              fill={value > 0 ? color : '#e2e8f0'}
              fillOpacity={value > 0 ? 0.35 + ratio * 0.65 : 1}
              stroke="white"
              strokeWidth="0.6"
            >
              <title>{tooltip(stat)}</title>
            </path>
          )
        })}
        {[0, 6, 12, 18].map((hour) => {
          const point = clockPoint(hour + 0.5, CLOCK_OUTER + 12)
          return (
            <text key={hour} x={point.x} y={point.y + 3} textAnchor="middle" fontSize="9" fontWeight="800" fill="#64748b">
              {hour}時
            </text>
          )
        })}
        <circle cx={CLOCK_CENTER} cy={CLOCK_CENTER} r={CLOCK_INNER} fill="white" stroke="#cbd5e1" />
        <text x={CLOCK_CENTER} y={CLOCK_CENTER - 1} textAnchor="middle" fontSize="13" fontWeight="900" fill="#0f172a">{headline}</text>
        <text x={CLOCK_CENTER} y={CLOCK_CENTER + 11} textAnchor="middle" fontSize="7" fontWeight="700" fill="#94a3b8">{sub}</text>
      </svg>
      <figcaption className="mt-1 text-center text-[10px] font-bold text-slate-500">{caption}</figcaption>
    </figure>
  )
}

function StudyRhythmSection({ analysis }) {
  const { studyTime, hourlyTime, rhythm } = analysis
  const peakByTime = [...hourlyTime].sort((a, b) => b.ms - a.ms)[0] ?? null
  const rhythmLabel = rhythm.coreHours.length
    ? rhythm.coreHours.map((hour) => `${hour}時`).join('・')
    : '計測中'
  return (
    <ReportSection number="05" title="学習時間と時間帯" note="実際に学習した時刻を24時間の円グラフで表示。目安ではなく記録そのもの">
      <dl className="grid grid-cols-2 divide-x divide-y divide-slate-200 border-b border-slate-300 text-center text-xs sm:grid-cols-4" data-study-time-summary>
        {[
          ['今日の学習時間', formatDuration(studyTime.todayMs), true],
          ['1日あたり（7日平均）', formatDuration(studyTime.dailyAverageMs7), false],
          ['直近7日の合計', formatDuration(studyTime.ms7), false],
          ['累計', formatDuration(studyTime.totalMs), false],
        ].map(([label, value, primary]) => (
          <div key={label} className={cx('p-3', primary && 'bg-indigo-50')}>
            <dt className={cx('text-[10px] font-extrabold', primary ? 'text-indigo-700' : 'text-slate-500')}>{label}</dt>
            <dd className={cx(
              'mt-0.5 font-display font-extrabold tabular-nums',
              primary ? 'text-lg text-indigo-950' : 'text-base text-slate-950',
            )}>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-4 p-3 sm:grid-cols-2">
        <HourWheel
          testId="study-hours"
          hours={hourlyTime}
          valueOf={(stat) => stat.ms}
          color="#4f46e5"
          headline={peakByTime && peakByTime.ms ? `${peakByTime.hour}時台` : '—'}
          sub={peakByTime && peakByTime.ms ? `最長 ${formatDuration(peakByTime.ms)}` : '学習すると記録されます'}
          caption="学習した時間帯（扇の長さ＝その時刻の学習時間）"
          tooltip={(stat) => `${stat.hour}時台：${formatDuration(stat.ms)}・${stat.days}日`}
        />
        <HourWheel
          testId="study-rhythm"
          hours={hourlyTime}
          valueOf={(stat) => stat.days}
          color="#0f766e"
          headline={rhythm.score == null ? '—' : `${rhythm.score}%`}
          sub={rhythm.score == null ? '学習した時刻を収集中' : `${rhythm.activeDays}日を集計`}
          caption={`学習リズム（扇の長さ＝その時刻に学習した日数）／中心の時間帯 ${rhythmLabel}`}
          tooltip={(stat) => `${stat.hour}時台：${stat.days}日に学習`}
        />
      </div>
      {!studyTime.hasEvidence && (
        <p className="border-t border-slate-200 px-3 py-2.5 text-center text-[11px] font-bold text-slate-500">
          学習を始めると、学習した時刻と1日の学習時間をこの円グラフに記録します。
        </p>
      )}
      <p className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold leading-relaxed text-slate-500">
        学習時間は回答と回答の間隔から推定します（5分を超える間隔は離席として除外）。
        学習リズムは、よく学習する3つの時間帯を学習日のうち何日繰り返せたかで表します。
      </p>
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

function ActivitySplit({ analysis, report }) {
  const memory = analysis.activity.memory
  const test = analysis.activity.test
  const splitSamples = memory.scored + test.scored
  const legacySamples = Math.max(0, analysis.scored - splitSamples)
  const rows = [
    {
      id: 'memory',
      label: '暗記',
      value: memory.scored,
      rate: memory.scored ? memory.correct / memory.scored : null,
      rateLabel: '「覚えた」率',
      note: 'カードの自己判定。テスト正答率とは分けて表示',
      tone: 'border-indigo-200 bg-indigo-50 text-indigo-950',
    },
    {
      id: 'test',
      label: 'テスト',
      value: test.scored,
      rate: test.scored ? test.correct / test.scored : null,
      rateLabel: '正答率',
      note: '選択・入力問題で採点された結果',
      tone: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    },
  ]
  return (
    <ReportSection number="04" title="暗記・テスト進捗" note="同じ項目でも自己判定と採点結果を混ぜずに比較">
      <div className="grid gap-3 p-3 sm:grid-cols-2" data-activity-progress-split>
        {rows.map((row) => (
          <div key={row.id} className={cx('border p-3', row.tone)}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.12em] opacity-65">{row.label}</p>
                <p className="font-display text-2xl font-extrabold tabular-nums">{row.value}<span className="ml-1 text-[10px]">判定</span></p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-extrabold opacity-60">{row.rateLabel}</p>
                <p className="font-display text-xl font-extrabold tabular-nums">{asPercent(row.rate)}</p>
              </div>
            </div>
            <p className="mt-2 text-[10px] font-bold leading-relaxed opacity-70">{row.note}</p>
          </div>
        ))}
      </div>
      <dl className="grid grid-cols-3 border-t border-slate-200 bg-slate-50 text-center text-[10px]">
        {[
          ['項目別記録', `${report.totals.items}項目`],
          ['暗記周回', `${report.totals.memoryAttempts}回`],
          ['確認テスト', `${report.totals.testAttempts}回`],
        ].map(([label, value]) => (
          <div key={label} className="border-r border-slate-200 p-2.5 last:border-r-0">
            <dt className="font-bold text-slate-500">{label}</dt>
            <dd className="mt-0.5 font-extrabold tabular-nums text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
      {legacySamples > 0 && (
        <p className="border-t border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-bold leading-relaxed text-amber-900">
          旧版で記録した{legacySamples}回答は暗記・テストの区別がないため「旧履歴」として保持しています。
          {report.totals.legacyAttempts > 0 && legacySamples !== report.totals.legacyAttempts
            ? ` このうち項目IDに結び付く${report.totals.legacyAttempts}回答は、項目別成績にも反映しています。`
            : ''}
          新しい回答から自動で分離されます。
        </p>
      )}
      {!splitSamples && !legacySamples && (
        <p className="border-t border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-500">学習を始めると、暗記とテストが別々に記録されます。</p>
      )}
    </ReportSection>
  )
}

const gradeDimensionMeta = {
  subject: { label: '科目', empty: '科目別の履歴がありません' },
  type: { label: '種類', empty: '種類別の履歴がありません' },
  field: { label: '分野', empty: '分野別の履歴がありません' },
  item: { label: '項目', empty: '学習を開始した項目がありません' },
}

function groupMemoryText(group) {
  if (group.memoryAttempts) return `${group.memoryAttempts}回・${asPercent(group.memoryRate)}`
  return group.legacyAttempts ? `旧履歴 ${group.legacyAttempts}` : '—'
}

function groupTestText(group) {
  if (group.testAttempts) return `${group.testAttempts}回・${asPercent(group.testAccuracy)}`
  return group.legacyAttempts ? '旧履歴に合算' : '未実施'
}

function Gradebook({ report, onNavigate }) {
  const [dimension, setDimension] = useState('item')
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(12)
  const normalized = query.trim().toLocaleLowerCase('ja')
  const groups = report.groups[dimension].filter((group) => {
    if (!normalized) return true
    return [group.label, group.weakest?.field, group.weakest?.level, group.weakest?.subtitle]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('ja')
      .includes(normalized)
  })
  const shown = groups.slice(0, limit)

  const open = (group, mode) => {
    const destination = launchForGradeGroup(group, mode)
    if (destination) onNavigate?.(destination.screen, destination.params)
  }

  return (
    <ReportSection number="06" title="科目・種類・分野・項目別 成績表" note="評定、暗記、テスト、定着予測を同じ条件で比較し、その行から学習を開始">
      <div data-learning-gradebook>
        <div className="flex gap-1 overflow-x-auto border-b border-slate-300 bg-slate-50 p-2" role="tablist" aria-label="成績表の集計単位">
          {Object.entries(gradeDimensionMeta).map(([id, meta]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={dimension === id}
              onClick={() => { setDimension(id); setLimit(12); setQuery('') }}
              className={cx(
                'min-h-10 shrink-0 border px-4 text-xs font-extrabold',
                dimension === id
                  ? 'border-slate-800 bg-slate-800 text-white'
                  : 'border-slate-300 bg-white text-slate-600',
              )}
            >
              {meta.label}
            </button>
          ))}
        </div>
        <div className="border-b border-slate-200 p-3">
          <label className="block text-[10px] font-extrabold text-slate-600" htmlFor={`gradebook-search-${dimension}`}>
            {gradeDimensionMeta[dimension].label}を検索
          </label>
          <input
            id={`gradebook-search-${dimension}`}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setLimit(12) }}
            placeholder="名称・分野・級を入力"
            className="mt-1 min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-slate-700"
          />
          <p className="mt-1 text-[9px] font-bold text-slate-400">{groups.length}件。標本が少ない評定は今後の結果で大きく変わります。</p>
        </div>
        {shown.length ? (
          <div className="divide-y divide-slate-200">
            {shown.map((group) => {
              const domainMeta = LEARNING_REPORT_DOMAINS[group.primaryDomain]
              return (
                <article key={group.id} className="p-3" data-gradebook-row={group.id}>
                  <div className="flex items-start gap-3">
                    <span className={cx('grid h-9 w-9 shrink-0 place-items-center border font-display text-lg font-extrabold', gradeClass(group.grade))}>
                      {group.grade}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="break-words text-sm font-extrabold leading-snug text-slate-900">{group.label}</h3>
                          <p className="mt-0.5 text-[9px] font-bold text-slate-400">{group.count}項目・標本 {group.testAttempts + group.memoryAttempts + group.legacyAttempts}</p>
                        </div>
                        <span className={cx('border px-2 py-1 text-[9px] font-extrabold', group.due ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-slate-200 bg-slate-50 text-slate-500')}>
                          {group.due ? `復習 ${group.due}` : '期限内'}
                        </span>
                      </div>
                      <dl className="mt-2 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-2 text-center">
                        <div className="px-1">
                          <dt className="text-[8px] font-extrabold text-slate-400">暗記・覚えた率</dt>
                          <dd className="mt-0.5 text-[10px] font-extrabold tabular-nums text-slate-700">{groupMemoryText(group)}</dd>
                        </div>
                        <div className="px-1">
                          <dt className="text-[8px] font-extrabold text-slate-400">テスト・正答率</dt>
                          <dd className="mt-0.5 text-[10px] font-extrabold tabular-nums text-slate-700">{groupTestText(group)}</dd>
                        </div>
                        <div className="px-1">
                          <dt className="text-[8px] font-extrabold text-slate-400">現在の定着予測</dt>
                          <dd className="mt-0.5 text-[10px] font-extrabold tabular-nums text-slate-700">{asPercent(group.prediction)}</dd>
                        </div>
                      </dl>
                      {dimension === 'item' && group.weakest && (
                        <p className="mt-2 text-[10px] font-bold leading-relaxed text-slate-500">
                          周回 {group.weakest.memoryAttempts}回・直近暗記判定 {group.weakest.lastJudgment}・復習の段階 {group.weakest.box}/{MAX_SRS_BOX}
                          {group.weakest.legacyAttempts ? `・旧履歴 ${group.weakest.legacyAttempts}回` : ''}
                        </p>
                      )}
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {domainMeta?.memory && (
                          <button type="button" onClick={() => open(group, 'memory')} className="min-h-10 border border-indigo-300 bg-indigo-50 px-2 text-[10px] font-extrabold text-indigo-800 active:bg-indigo-100">
                            暗記する
                          </button>
                        )}
                        {domainMeta?.test && (
                          <button type="button" onClick={() => open(group, 'test')} className={cx('min-h-10 border border-emerald-300 bg-emerald-50 px-2 text-[10px] font-extrabold text-emerald-800 active:bg-emerald-100', !domainMeta.memory && 'col-span-2')}>
                            テストする
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="p-5 text-center text-xs font-bold text-slate-500">{gradeDimensionMeta[dimension].empty}</p>
        )}
        {shown.length < groups.length && (
          <div className="border-t border-slate-200 p-3">
            <Button full variant="secondary" onClick={() => setLimit((value) => value + 24)}>
              さらに表示（残り{groups.length - shown.length}件）
            </Button>
          </div>
        )}
      </div>
    </ReportSection>
  )
}

function ForgettingCurve({ report, analysis }) {
  const [dimension, setDimension] = useState('type')
  const [selectedId, setSelectedId] = useState('')
  const [itemQuery, setItemQuery] = useState('')
  const sourceGroups = report.groups[dimension].filter((group) =>
    group.rows.some((row) => Number.isFinite(row.predictedRetention)),
  )
  const normalized = itemQuery.trim().toLocaleLowerCase('ja')
  const filteredGroups = dimension === 'item' && normalized
    ? sourceGroups.filter((group) => group.label.toLocaleLowerCase('ja').includes(normalized))
    : sourceGroups
  const options = dimension === 'item' ? filteredGroups.slice(0, 150) : filteredGroups
  const selected = options.find((group) => group.id === selectedId) ?? options[0] ?? null
  const curve = forgettingCurveForRows(selected?.rows ?? [])
  const points = curve.map((point, index) => {
    const x = 34 + index * 52
    const y = point.retention == null ? 146 : 146 - point.retention * 112
    return { ...point, x, y }
  })
  const observed = (analysis.intervals ?? []).filter((item) => item.scored > 0)

  return (
    <ReportSection number="07" title="忘却曲線・定着予測" note="科目・種類・分野・項目を選択。今の復習の段階、経過時間、本人のテストの傾向から予測">
      <div className="p-3" data-forgetting-curve-analysis>
        <div className="grid grid-cols-4 gap-1">
          {Object.entries(gradeDimensionMeta).map(([id, meta]) => (
            <button
              key={id}
              type="button"
              aria-pressed={dimension === id}
              onClick={() => { setDimension(id); setSelectedId(''); setItemQuery('') }}
              className={cx('min-h-10 border text-[10px] font-extrabold', dimension === id ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-600')}
            >
              {meta.label}
            </button>
          ))}
        </div>
        {dimension === 'item' && (
          <input
            aria-label="忘却曲線の項目を検索"
            value={itemQuery}
            onChange={(event) => { setItemQuery(event.target.value); setSelectedId('') }}
            placeholder="項目名を検索して曲線を表示"
            className="mt-2 min-h-11 w-full border border-slate-300 px-3 text-sm font-bold outline-none focus:border-slate-700"
          />
        )}
        {options.length ? (
          <>
            <label className="mt-3 block text-[10px] font-extrabold text-slate-600" htmlFor={`curve-group-${dimension}`}>表示する区分</label>
            <select
              id={`curve-group-${dimension}`}
              value={selected?.id ?? ''}
              onChange={(event) => setSelectedId(event.target.value)}
              className="mt-1 min-h-11 w-full border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-800"
            >
              {options.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}
            </select>
            <div className="mt-3 overflow-hidden border border-slate-300 bg-white">
              <svg viewBox="0 0 330 180" className="block h-auto w-full" role="img" aria-label={`${selected?.label ?? ''}の忘却曲線`}>
                {[0.25, 0.5, 0.75, 1].map((value) => {
                  const y = 146 - value * 112
                  return (
                    <g key={value}>
                      <line x1="34" x2="298" y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                      <text x="29" y={y + 3} textAnchor="end" fontSize="8" fill="#64748b">{Math.round(value * 100)}%</text>
                    </g>
                  )
                })}
                <line x1="34" x2="298" y1="146" y2="146" stroke="#94a3b8" />
                {points.length > 1 && points[0].retention != null && (
                  <polyline points={points.map((point) => `${point.x},${point.y}`).join(' ')} fill="none" stroke={selected?.color ?? '#334155'} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                )}
                {points.map((point) => (
                  <g key={point.day}>
                    {point.retention != null && <circle cx={point.x} cy={point.y} r="4" fill={selected?.color ?? '#334155'} />}
                    <text x={point.x} y="162" textAnchor="middle" fontSize="8" fontWeight="700" fill="#475569">{point.day === 0 ? '現在' : `${point.day}日`}</text>
                  </g>
                ))}
              </svg>
              <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 bg-slate-50 text-center text-[9px]">
                <div className="p-2"><p className="font-bold text-slate-400">現在</p><p className="font-extrabold text-slate-800">{asPercent(curve[0]?.retention)}</p></div>
                <div className="p-2"><p className="font-bold text-slate-400">7日後</p><p className="font-extrabold text-slate-800">{asPercent(curve.find((point) => point.day === 7)?.retention)}</p></div>
                <div className="p-2"><p className="font-bold text-slate-400">30日後</p><p className="font-extrabold text-slate-800">{asPercent(curve.at(-1)?.retention)}</p></div>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-3 border border-slate-200 bg-slate-50 p-4 text-center text-xs font-bold text-slate-500">この区分には予測できる暗記項目がありません。</p>
        )}
        <p className="mt-2 text-[9px] font-bold leading-relaxed text-slate-500">
          曲線は医療的な記憶測定ではなく、復習の段階をもとに、忘れ方の目安を計算した参考値です。実測の間隔別データは{observed.length ? `${observed.length}区分` : 'まだありません'}。回答のたびに更新します。
        </p>
      </div>
    </ReportSection>
  )
}

const polarPoint = (hour, radius) => {
  const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2
  return { x: 120 + Math.cos(angle) * radius, y: 120 + Math.sin(angle) * radius }
}

function HourClock({ stats }) {
  const measured = stats.filter((stat) => stat.scored >= 5 && stat.accuracy != null)
  const best = [...measured].sort((a, b) => b.accuracy - a.accuracy || b.scored - a.scored)[0] ?? null
  return (
    <div className="mx-auto max-w-[18rem]" data-24-hour-effect-clock>
      <svg viewBox="0 0 240 240" className="h-auto w-full" role="img" aria-label="暗記した時間帯別の後続テスト成績を示す24時間計">
        <circle cx="120" cy="120" r="86" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="120" cy="120" r="48" fill="white" stroke="#e2e8f0" />
        {stats.map((stat) => {
          const from = polarPoint(stat.hour, 53)
          const to = polarPoint(stat.hour, stat.accuracy == null ? 58 : 58 + stat.accuracy * 27)
          const color = stat.accuracy == null ? '#cbd5e1' : stat.accuracy >= 0.8 ? '#059669' : stat.accuracy >= 0.6 ? '#d97706' : '#e11d48'
          return (
            <g key={stat.hour}>
              <title>{stat.hour}時に暗記：後続テスト {asPercent(stat.accuracy)}、n={stat.scored}</title>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={stat.scored >= 5 ? 7 : stat.scored ? 4 : 2} strokeLinecap="round" />
            </g>
          )
        })}
        {[0, 6, 12, 18].map((hour) => {
          const point = polarPoint(hour, 101)
          return <text key={hour} x={point.x} y={point.y + 3} textAnchor="middle" fontSize="10" fontWeight="800" fill="#475569">{hour}時</text>
        })}
        <text x="120" y="112" textAnchor="middle" fontSize="9" fontWeight="800" fill="#64748b">暗記時刻の効果</text>
        <text x="120" y="132" textAnchor="middle" fontSize="16" fontWeight="900" fill="#0f172a">{best ? `${best.hour}時台` : '測定中'}</text>
        <text x="120" y="146" textAnchor="middle" fontSize="8" fontWeight="700" fill="#94a3b8">{best ? `${Math.round(best.accuracy * 100)}%・n=${best.scored}` : '各時刻 n=5 から比較'}</text>
      </svg>
    </div>
  )
}

function MemoryEffectAnalysis({ analysis }) {
  const cohortSamples = analysis.memoryCohortHourly.reduce((sum, stat) => sum + stat.scored, 0)
  const passSamples = analysis.memoryPasses.reduce((sum, stat) => sum + stat.scored, 0)
  return (
    <ReportSection number="08" title="暗記時刻・周回数とテスト成績" note="暗記した条件を、同じ項目の後続テストへ結び付けて比較">
      <div className="grid gap-3 p-3 lg:grid-cols-2">
        <div className="border border-slate-300 bg-white p-2">
          <h3 className="px-2 pt-1 text-xs font-extrabold text-slate-800">24時間計</h3>
          <p className="px-2 text-[9px] font-bold leading-relaxed text-slate-500">線の長さは後続テスト正答率、太さは標本5件以上かを示します。</p>
          <HourClock stats={analysis.memoryCohortHourly} />
          {!cohortSamples && <p className="px-2 pb-2 text-center text-[10px] font-bold text-slate-500">暗記後に同じ項目をテストすると時刻効果を測定します。</p>}
        </div>
        <div className="border border-slate-300 bg-white p-3" data-memory-pass-effect>
          <h3 className="text-xs font-extrabold text-slate-800">暗記を何周した後に正解できたか</h3>
          <p className="mt-0.5 text-[9px] font-bold leading-relaxed text-slate-500">各周回数の後に行ったテストだけを集計します。</p>
          <div className="mt-3 space-y-3">
            {analysis.memoryPasses.map((stat) => (
              <div key={stat.id} className="grid grid-cols-[4.5rem_1fr_4.4rem] items-center gap-2 text-[10px] font-bold">
                <span className="text-slate-600">{stat.label}</span>
                <div className="h-4 overflow-hidden border border-slate-200 bg-slate-100">
                  <span className="block h-full bg-indigo-600" style={{ width: `${Math.round((stat.accuracy ?? 0) * 100)}%` }} />
                </div>
                <span className="text-right tabular-nums text-slate-700">{asPercent(stat.accuracy)}・n={stat.scored}</span>
              </div>
            ))}
          </div>
          {!passSamples && <p className="mt-4 border border-slate-200 bg-slate-50 p-3 text-[10px] font-bold leading-relaxed text-slate-500">暗記カードを通した後にテストすると、1周・2周・3周・4〜5周・6周以上で比較できます。</p>}
        </div>
      </div>
      <div className="grid grid-cols-6 gap-px bg-slate-300 p-px" data-hourly-analysis-matrix>
        {analysis.memoryCohortHourly.map((stat) => (
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

function RetentionDistribution({ analysis }) {
  const stages = [
    { id: 'long', label: '長く覚えている段階', count: analysis.stages.long, pct: analysis.stages.longPct, color: '#047857', criterion: '復習の段階4以上' },
    { id: 'short', label: 'まだ短い段階', count: analysis.stages.short, pct: analysis.stages.shortPct, color: '#475569', criterion: '復習の段階1〜3' },
    { id: 'fragile', label: '要再学習', count: analysis.stages.fragile, pct: analysis.stages.fragilePct, color: '#b45309', criterion: '復習の段階0' },
  ]

  return (
    <ReportSection number="09" title="記憶段階構成" note="項目数の内訳は比較に有効なため、構成比を帯グラフで併記">
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
    <ReportSection number="10" title="学習種類別・累計記録" note="暗記の自己判定とテスト回答を合算。最低3記録以上を得意・弱点判定に使用">
      {analysis.skills.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[31rem] border-collapse text-xs" data-skill-analysis-table>
            <thead>
              <tr className="border-b border-slate-300 text-left text-[10px] font-extrabold text-slate-500">
                <th className="px-3 py-2">分野</th>
                <th className="px-3 py-2 text-right">判定・回答</th>
                <th className="px-3 py-2 text-right">達成</th>
                <th className="px-3 py-2 text-right">達成率</th>
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
    <ReportSection number="11" title="復習の間隔ごとに思い出せた割合" note="同じ教材を時間を空けて解いた回答だけを集計">
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
    <ReportSection number="12" title="学習した時刻別の達成率" note="暗記の自己判定とテスト回答を合算した実施時刻。暗記時刻の後続テスト効果は08で分離し、5記録未満は推薦に不使用">
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

function AdviceReport({ profile, analysis, dueCount, report, onNavigate }) {
  const recommendation = profile.recommendation
  const scheduledWindow = analysis.rhythm.peakHour != null
    ? `${String(analysis.rhythm.peakHour).padStart(2, '0')}:00台（いつも学習している時間帯）`
    : formatWindow(analysis.bestWindow) ?? '19:00〜19:20（仮）'
  const successCriterion = recommendation.id === 'measure'
    ? '診断28問を完了する'
    : dueCount > 0
      ? `今日の復習を${Math.min(dueCount, 20)}項目進める`
      : '10問を解き、正誤を記録する'
  const encouragement = profile.confidence === 'empty'
    ? '最初の10回答が分析の出発点です。小さく始めても、記録が次の教材選びを具体化します。'
    : analysis.retentionRate != null && analysis.retentionRate >= 0.8
      ? '思い出せた割合は安定しています。今の方法を維持し、弱点分野へ少しずつ負荷を移す段階です。'
      : dueCount > 0
        ? '今日の復習は失敗の印ではなく、思い出す練習を入れる時期を示す作業票です。今日の一部を処理すれば前進です。'
        : '記録が増えるたびに推定は更新されます。結果を能力の固定評価ではなく、次の一手を選ぶ材料として使ってください。'

  return (
    <ReportSection number="13" title="多角的な学習処方箋" note="科目・種類・分野・項目・時間帯・周回数・自己判定・活動量から優先順位を作成">
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
              ['実施方法', '答えを見る前に思い出し、まちがえた分は間隔を空けてもう一度確認'],
              ['次回確認', '実施後の正答率・今日の復習件数で再判定'],
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

        {report.prescriptions.length > 0 && (
          <div className="mt-4" data-personalized-prescriptions>
            <h3 className="text-xs font-extrabold text-slate-900">履歴から検出した処方</h3>
            <div className="mt-2 space-y-2">
              {report.prescriptions.map((prescription, index) => (
                <article key={prescription.id} className="border border-slate-300 bg-white p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[9px] font-extrabold tracking-[0.1em] text-slate-500">
                      {String(index + 1).padStart(2, '0')}・{prescription.angle}・{prescription.scope}
                    </p>
                    <span className={cx('border px-2 py-0.5 text-[8px] font-extrabold', prescription.priority === 1 ? 'border-rose-200 bg-rose-50 text-rose-800' : prescription.priority === 2 ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-slate-200 bg-slate-50 text-slate-600')}>
                      優先度 {prescription.priority === 1 ? '高' : prescription.priority === 2 ? '中' : '補助'}
                    </span>
                  </div>
                  <h4 className="mt-1 text-sm font-extrabold text-slate-900">{prescription.title}</h4>
                  <dl className="mt-2 space-y-1 text-[10px] font-bold leading-relaxed">
                    <div className="grid grid-cols-[3.5rem_1fr] gap-2"><dt className="text-slate-400">根拠</dt><dd className="text-slate-600">{prescription.evidence}</dd></div>
                    <div className="grid grid-cols-[3.5rem_1fr] gap-2"><dt className="text-slate-400">行動</dt><dd className="text-slate-700">{prescription.action}</dd></div>
                  </dl>
                  {prescription.launch && (
                    <button
                      type="button"
                      onClick={() => onNavigate?.(prescription.launch.screen, prescription.launch.params ?? {})}
                      className="mt-2 min-h-10 w-full border border-slate-800 bg-slate-800 px-3 text-[10px] font-extrabold text-white active:bg-slate-700"
                    >
                      この処方で学習を始める
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>
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

function StudyWisdomFooter() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000000))
  const quote = STUDY_QUOTES[seed % STUDY_QUOTES.length]
  const reference = SCIENCE_REFERENCES[Math.floor(seed / STUDY_QUOTES.length) % SCIENCE_REFERENCES.length]
  return (
    <ReportSection number="14" title="学びの言葉と科学的根拠" note="表示ごとに原典確認済みの言葉と学習原則をランダムに選択">
      <div className="p-4" data-random-study-wisdom>
        <blockquote className="border-l-4 border-slate-800 bg-slate-50 p-3">
          <p className="font-display text-base font-extrabold leading-relaxed text-slate-950">「{quote.text}」</p>
          <footer className="mt-2 text-[10px] font-bold text-slate-500">
            {quote.author}・<a href={quote.href} target="_blank" rel="noreferrer" className="text-sky-700 underline">{quote.source}</a>
          </footer>
          <p className="mt-2 text-[10px] font-bold leading-relaxed text-slate-600">{quote.note}</p>
        </blockquote>
        <div className="mt-3 border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-[9px] font-extrabold tracking-[0.12em] text-emerald-700">TODAY'S EVIDENCE</p>
          <h3 className="mt-1 text-sm font-extrabold text-emerald-950">{reference.label}</h3>
          <p className="mt-1 text-[10px] font-bold leading-relaxed text-emerald-900">{reference.practice}</p>
          <a href={reference.href} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[10px] font-extrabold text-emerald-800 underline">{reference.citation}</a>
        </div>
        <button
          type="button"
          onClick={() => setSeed((value) => value + 4)}
          className="mt-3 min-h-10 w-full border border-slate-300 bg-white text-[10px] font-extrabold text-slate-700 active:bg-slate-50"
        >
          別の言葉と根拠を表示
        </button>
      </div>
    </ReportSection>
  )
}

export function LearningAnalyticsPanel({
  progressState,
  learningAnalytics,
  srs,
  etymologySrs,
  kotenSrs,
  kotenGrammarSrs,
  kotenCultureSrs,
  kotenInterpretationSrs,
  kanbunVocabSrs,
  kanbunGrammarSrs,
  kanbunCultureSrs,
  kanbunKundokuSrs,
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
        kanbunVocabSrs,
        kanbunGrammarSrs,
        kanbunCultureSrs,
        kanbunKundokuSrs,
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
      kanbunVocabSrs,
      kanbunGrammarSrs,
      kanbunCultureSrs,
      kanbunKundokuSrs,
      skillStats,
      diagnosticHistory,
      stats,
      dueCount,
    ],
  )
  const analysis = profile.analysis
  const report = useMemo(
    () => buildLearningAnalyticsReport(
      {
        ...(progressState ?? {}),
        srs,
        etymologySrs,
        kotenSrs,
        kotenGrammarSrs,
        kotenCultureSrs,
        kotenInterpretationSrs,
        kanbunVocabSrs,
        kanbunGrammarSrs,
        kanbunCultureSrs,
        kanbunKundokuSrs,
        skillStats,
      },
      analysis,
    ),
    [
      progressState,
      srs,
      etymologySrs,
      kotenSrs,
      kotenGrammarSrs,
      kotenCultureSrs,
      kotenInterpretationSrs,
      kanbunVocabSrs,
      kanbunGrammarSrs,
      kanbunCultureSrs,
      kanbunKundokuSrs,
      skillStats,
      analysis,
    ],
  )

  return (
    <section className="space-y-4" aria-label="学習成績の詳細分析">
      <ReportHeader profile={profile} analysis={analysis} />
      <SummaryTable profile={profile} analysis={analysis} dueCount={dueCount} />
      <DiagnosticSnapshot diagnostic={profile.diagnostic} onOpen={onOpenDiagnostic} />
      <DimensionTable profile={profile} />
      <ActivitySplit analysis={analysis} report={report} />
      <StudyRhythmSection analysis={analysis} />
      <Gradebook report={report} onNavigate={onNavigate} />
      <ForgettingCurve report={report} analysis={analysis} />
      <MemoryEffectAnalysis analysis={analysis} />
      <RetentionDistribution analysis={analysis} />
      <SkillTable analysis={analysis} />
      <IntervalAnalysis analysis={analysis} />
      <HourlyMatrix analysis={analysis} />
      <AdviceReport profile={profile} analysis={analysis} dueCount={dueCount} report={report} onNavigate={onNavigate} />
      <StudyWisdomFooter />

      <p className="border border-slate-300 bg-slate-100 px-3 py-2.5 text-[10px] font-bold leading-relaxed text-slate-600">
        総合参考値と評定は、固定された才能やIQではなく、学習履歴に基づいて変化する参考値です。
        脳波・医療検査・公式試験による測定ではありません。標本数が少ない区分は、今後の回答で大きく変動します。
      </p>
    </section>
  )
}
