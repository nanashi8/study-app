import { useMemo, useState } from 'react'
import { buildLearningPowerProfile } from '../lib/learningPower.js'
import {
  LEARNING_REPORT_DOMAINS,
  buildLearningAnalyticsReport,
  launchForGradeGroup,
} from '../lib/learningAnalyticsReport.js'
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

function ReportHeader({ profile, analysis, dueCount }) {
  return (
    <header
      className="overflow-hidden rounded-xl border-2 border-slate-700 bg-white"
      data-learning-analysis-report
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-300 bg-slate-800 px-4 py-3 text-white">
        <div>
          <p className="text-[10px] font-extrabold text-slate-300">これまでの回答をまとめて表示</p>
          <h1 className="mt-0.5 font-display text-xl font-extrabold">学習記録とおすすめ</h1>
        </div>
        <div className="border border-slate-500 px-2 py-1 text-right">
          <p className="text-[9px] font-bold text-slate-300">もとにした回答</p>
          <p className="text-xs font-extrabold">{formatCount(analysis.scored)}回</p>
        </div>
      </div>
      <dl className="grid grid-cols-2 divide-x divide-y divide-slate-300 text-xs sm:grid-cols-4">
        <div className="p-3">
          <dt className="text-[10px] font-extrabold text-slate-500">今日の復習</dt>
          <dd className="mt-0.5 font-display text-xl font-extrabold tabular-nums text-slate-950">{dueCount}<span className="ml-1 text-[10px] text-slate-500">項目</span></dd>
        </div>
        <div className="p-3">
          <dt className="text-[10px] font-extrabold text-slate-500">答えた回数</dt>
          <dd className="mt-0.5 font-display text-xl font-extrabold tabular-nums text-slate-950">{formatCount(analysis.scored)}</dd>
        </div>
        <div className="p-3">
          <dt className="text-[10px] font-extrabold text-slate-500">学習済み項目</dt>
          <dd className="mt-0.5 font-display text-xl font-extrabold tabular-nums text-slate-950">{formatCount(analysis.learnedItems)}</dd>
        </div>
        <div className="p-3">
          <dt className="text-[10px] font-extrabold text-slate-500">最近7日間に学習</dt>
          <dd className="mt-0.5 font-display text-xl font-extrabold tabular-nums text-slate-950">{profile.habit.activeDays7}<span className="ml-1 text-[10px] text-slate-500">日</span></dd>
        </div>
      </dl>
    </header>
  )
}

function SummaryTable({ analysis, dueCount }) {
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
      ? `以前の記録 ${analysis.correct}/${analysis.scored}`
      : 'テスト未実施'
  const rows = [
    ['テストで思い出せた割合', asPercent(testRecallRate), testRecallEvidence, analysis.activity.test.scored ? '採点テストでもう一度答えられた割合' : '以前の記録は暗記・テストの区別なし'],
    ['英単語・今日の復習', `${dueCount}項目`, dueCount ? '今日、復習する' : '今日の復習なし', '復習日を迎えた英単語の数'],
    [
      '一日の学習時間',
      analysis.studyTime.hasEvidence ? formatDuration(analysis.studyTime.dailyAverageMs7) : '—',
      analysis.studyTime.hasEvidence
        ? `今日 ${formatDuration(analysis.studyTime.todayMs)}・最近7日間で${analysis.studyTime.activeDays7}日`
        : '学習すると時間を記録します',
      '最近7日間の合計を7日で割った1日あたりの学習時間',
    ],
    [
      '学習リズム',
      analysis.rhythm.peakHour == null ? '—' : `${analysis.rhythm.peakHour}時台が中心`,
      analysis.rhythm.score == null
        ? '学習した時刻の記録がありません'
        : `同じ時間帯に学んだ割合 ${analysis.rhythm.score}%・記録 ${analysis.rhythm.activeDays}日`,
      'よく学習する3つの時間帯を、どれだけ繰り返せているか',
    ],
  ]

  return (
    <ReportSection number="01" title="学習のまとめ" note="記録から分かることと、計算のしかたを分けて表示">
      <div className="divide-y divide-slate-200 sm:hidden" data-analysis-summary-cards>
        {rows.map(([label, value, evidence, definition]) => (
          <article key={label} className="space-y-2 p-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xs font-extrabold leading-relaxed text-slate-800">{label}</h3>
              <p className="shrink-0 font-display text-lg font-extrabold tabular-nums text-slate-950">{value}</p>
            </div>
            <dl className="grid gap-2 text-[10px] leading-relaxed">
              <div>
                <dt className="font-extrabold text-slate-500">記録の数・状態</dt>
                <dd className="mt-0.5 font-bold text-slate-700">{evidence}</dd>
              </div>
              <div>
                <dt className="font-extrabold text-slate-500">計算のしかた</dt>
                <dd className="mt-0.5 font-bold text-slate-600">{definition}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[35rem] border-collapse text-xs" data-analysis-summary-table>
          <thead>
            <tr className="border-b border-slate-300 bg-white text-left text-[10px] font-extrabold text-slate-500">
              <th className="px-3 py-2">見る項目</th>
              <th className="px-3 py-2">今の目安</th>
              <th className="px-3 py-2">記録の数・状態</th>
              <th className="px-3 py-2">計算のしかた</th>
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
    : '記録なし'
  return (
    <ReportSection number="05" title="学習時間と時間帯" note="実際に学習した時刻を24時間の円グラフで表示。目安ではなく記録そのもの">
      <dl className="grid grid-cols-2 divide-x divide-y divide-slate-200 border-b border-slate-300 text-center text-xs sm:grid-cols-4" data-study-time-summary>
        {[
          ['今日の学習時間', formatDuration(studyTime.todayMs), true],
          ['1日あたり（7日平均）', formatDuration(studyTime.dailyAverageMs7), false],
          ['最近7日間の合計', formatDuration(studyTime.ms7), false],
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
          sub={rhythm.score == null ? '時刻の記録なし' : `${rhythm.activeDays}日分の記録`}
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
        学習時間は回答した時刻の差から計算します（5分を超えた分は、席を離れた時間として数えません）。
        学習リズムは、よく学習する3つの時間帯を学習日のうち何日繰り返せたかで表します。
      </p>
    </ReportSection>
  )
}

function DiagnosticSnapshot({ diagnostic, onOpen }) {
  if (!diagnostic) {
    return (
      <ReportSection number="02" title="最近受けた学習診断" note="英語4分野・28問の統一診断" className="p-0">
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
    <ReportSection number="02" title="最近受けた学習診断" note={`実施日 ${formatDiagnosticDate(diagnostic.completedAt)}`}>
      <div data-diagnostic-status>
        <dl className="grid grid-cols-2 divide-x divide-y divide-slate-200 border-b border-slate-300 text-xs sm:grid-cols-4">
          {[
            ['得点', `${score}/${total}`],
            ['正答率', `${Math.round(accuracy * 100)}%`],
            ['偏差値の目安', diagnostic.deviation ?? '—'],
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
              <th className="w-28 bg-emerald-50 px-3 py-2 text-left font-extrabold text-emerald-900">今回よくできた分野</th>
              <td className="px-3 py-2 font-bold text-slate-700">
                {strength ? `${DIAGNOSTIC_SKILL_META[strength.id]?.emoji ?? ''} ${DIAGNOSTIC_SKILL_META[strength.id]?.label ?? strength.id}（${strength.correct}/${strength.total}問）` : 'まだ結果がありません'}
              </td>
            </tr>
            <tr>
              <th className="w-28 bg-amber-50 px-3 py-2 text-left font-extrabold text-amber-900">先に復習</th>
              <td className="px-3 py-2 font-bold text-slate-700">
                {priority ? `${DIAGNOSTIC_SKILL_META[priority.id]?.emoji ?? ''} ${DIAGNOSTIC_SKILL_META[priority.id]?.label ?? priority.id}（${priority.correct}/${priority.total}問）` : '明確な弱点なし'}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="p-3">
          <p className="text-[10px] font-bold leading-relaxed text-slate-500">偏差値と級は、このアプリの問題結果から計算した目安です。公式試験の結果ではありません。</p>
          <Button full className="mt-2" variant="secondary" onClick={onOpen}>学習診断の4分野を見る</Button>
        </div>
      </div>
    </ReportSection>
  )
}

function DimensionTable({ profile }) {
  return (
    <ReportSection number="03" title="4つの学習記録" note="実際の回答数・正答率・学習した日と時刻をそのまま表示">
      <div className="divide-y divide-slate-200 sm:hidden" data-dimension-grade-cards>
        {profile.dimensions.map((item) => (
          <article key={item.id} className="space-y-1.5 p-3">
            <h3 className="text-xs font-extrabold text-slate-800">{item.label}</h3>
            <p className="text-sm font-extrabold text-slate-700">{item.evidence}</p>
            <p className="text-[10px] font-bold leading-relaxed text-slate-500">{item.note}</p>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[30rem] border-collapse text-xs" data-dimension-grade-table>
          <thead>
            <tr className="border-b border-slate-300 text-left text-[10px] font-extrabold text-slate-500">
              <th className="px-3 py-2">記録の種類</th>
              <th className="px-3 py-2">実際の記録</th>
              <th className="px-3 py-2">読み方</th>
            </tr>
          </thead>
          <tbody>
            {profile.dimensions.map((item) => (
              <tr key={item.id} className="border-b border-slate-200 last:border-0">
                <th className="px-3 py-2 text-left font-extrabold text-slate-800">{item.label}</th>
                <td className="px-3 py-2 font-extrabold text-slate-700">{item.evidence}</td>
                <td className="px-3 py-2 font-bold text-slate-500">{item.note}</td>
              </tr>
            ))}
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
      note: 'カードで押した「覚えた／まだ」。テストの正答率とは分けて表示',
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
    <ReportSection number="04" title="暗記とテストの記録" note="「覚えた／まだ」と、テストで答えた結果を分けて比較">
      <div className="grid gap-3 p-3 sm:grid-cols-2" data-activity-progress-split>
        {rows.map((row) => (
          <div key={row.id} className={cx('border p-3', row.tone)}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.12em] opacity-65">{row.label}</p>
                <p className="font-display text-2xl font-extrabold tabular-nums">{row.value}<span className="ml-1 text-[10px]">回答</span></p>
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
          ['暗記した回数', `${report.totals.memoryAttempts}回`],
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
          以前の{legacySamples}回答は暗記・テストの区別がないため、一つにまとめて表示しています。
          {report.totals.legacyAttempts > 0 && legacySamples !== report.totals.legacyAttempts
            ? ` このうち学習項目が分かる${report.totals.legacyAttempts}回答は、項目別の結果にも含めています。`
            : ''}
          これからの回答は、暗記とテストを分けて記録します。
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
  return group.legacyAttempts ? `以前の記録 ${group.legacyAttempts}` : '—'
}

function groupTestText(group) {
  if (group.testAttempts) return `${group.testAttempts}回・${asPercent(group.testAccuracy)}`
  return group.legacyAttempts ? '以前の記録に含む' : '未実施'
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
    <ReportSection number="06" title="教材別の記録" note="「覚えた／まだ」とテストの結果を分け、各行から学習を開始">
      <div data-learning-gradebook>
        <div className="flex gap-1 overflow-x-auto border-b border-slate-300 bg-slate-50 p-2" role="tablist" aria-label="成績表の分け方">
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
          <p className="mt-1 text-[9px] font-bold text-slate-400">{groups.length}件。回答が増えると、正答率も更新されます。</p>
        </div>
        {shown.length ? (
          <div className="divide-y divide-slate-200">
            {shown.map((group) => {
              const domainMeta = LEARNING_REPORT_DOMAINS[group.primaryDomain]
              return (
                <article key={group.id} className="p-3" data-gradebook-row={group.id}>
                  <div className="min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="break-words text-sm font-extrabold leading-snug text-slate-900">{group.label}</h3>
                          <p className="mt-0.5 text-[9px] font-bold text-slate-400">{group.count}項目・記録 {group.testAttempts + group.memoryAttempts + group.legacyAttempts}件</p>
                        </div>
                        <span className={cx('border px-2 py-1 text-[9px] font-extrabold', group.due ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-slate-200 bg-slate-50 text-slate-500')}>
                          {group.due ? `今日の復習 ${group.due}` : '次の復習日を待つ'}
                        </span>
                      </div>
                      <dl className="mt-2 grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-200 py-2 text-center">
                        <div className="px-1">
                          <dt className="text-[8px] font-extrabold text-slate-400">暗記・覚えた率</dt>
                          <dd className="mt-0.5 text-[10px] font-extrabold tabular-nums text-slate-700">{groupMemoryText(group)}</dd>
                        </div>
                        <div className="px-1">
                          <dt className="text-[8px] font-extrabold text-slate-400">テスト・正答率</dt>
                          <dd className="mt-0.5 text-[10px] font-extrabold tabular-nums text-slate-700">{groupTestText(group)}</dd>
                        </div>
                      </dl>
                      {dimension === 'item' && group.weakest && (
                        <p className="mt-2 text-[10px] font-bold leading-relaxed text-slate-500">
                          暗記 {group.weakest.memoryAttempts}回・最後の答え {group.weakest.lastJudgment}
                          {group.weakest.legacyAttempts ? `・以前の記録 ${group.weakest.legacyAttempts}回` : ''}
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

const polarPoint = (hour, radius) => {
  const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2
  return { x: 120 + Math.cos(angle) * radius, y: 120 + Math.sin(angle) * radius }
}

function HourClock({ stats }) {
  const measured = stats.filter((stat) => stat.scored >= 5 && stat.accuracy != null)
  const best = [...measured].sort((a, b) => b.accuracy - a.accuracy || b.scored - a.scored)[0] ?? null
  return (
    <div className="mx-auto max-w-[18rem]" data-24-hour-effect-clock>
      <svg viewBox="0 0 240 240" className="h-auto w-full" role="img" aria-label="暗記した時間帯ごとに、後で行ったテストの成績を示す24時間の図">
        <circle cx="120" cy="120" r="86" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="120" cy="120" r="48" fill="white" stroke="#e2e8f0" />
        {stats.map((stat) => {
          const from = polarPoint(stat.hour, 53)
          const to = polarPoint(stat.hour, stat.accuracy == null ? 58 : 58 + stat.accuracy * 27)
          const color = stat.accuracy == null ? '#cbd5e1' : stat.accuracy >= 0.8 ? '#059669' : stat.accuracy >= 0.6 ? '#d97706' : '#e11d48'
          return (
            <g key={stat.hour}>
              <title>{stat.hour}時に暗記：後で行ったテスト {asPercent(stat.accuracy)}、{stat.scored}回答</title>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={stat.scored >= 5 ? 7 : stat.scored ? 4 : 2} strokeLinecap="round" />
            </g>
          )
        })}
        {[0, 6, 12, 18].map((hour) => {
          const point = polarPoint(hour, 101)
          return <text key={hour} x={point.x} y={point.y + 3} textAnchor="middle" fontSize="10" fontWeight="800" fill="#475569">{hour}時</text>
        })}
        <text x="120" y="112" textAnchor="middle" fontSize="9" fontWeight="800" fill="#64748b">正解しやすかった時刻</text>
        <text x="120" y="132" textAnchor="middle" fontSize="16" fontWeight="900" fill="#0f172a">{best ? `${best.hour}時台` : '記録待ち'}</text>
        <text x="120" y="146" textAnchor="middle" fontSize="8" fontWeight="700" fill="#94a3b8">{best ? `${Math.round(best.accuracy * 100)}%・${best.scored}回答` : '各時刻5回答から比較'}</text>
      </svg>
    </div>
  )
}

function MemoryEffectAnalysis({ analysis }) {
  const cohortSamples = analysis.memoryCohortHourly.reduce((sum, stat) => sum + stat.scored, 0)
  const passSamples = analysis.memoryPasses.reduce((sum, stat) => sum + stat.scored, 0)
  return (
    <ReportSection number="07" title="暗記した時刻・回数とテスト結果" note="暗記した条件と、同じ項目を後でテストした結果を比べる">
      <div className="grid gap-3 p-3 lg:grid-cols-2">
        <div className="border border-slate-300 bg-white p-2">
          <h3 className="px-2 pt-1 text-xs font-extrabold text-slate-800">暗記した時刻と正解の関係</h3>
          <p className="px-2 text-[9px] font-bold leading-relaxed text-slate-500">線の長さは後で行ったテストの正答率、太さは記録が5件以上あるかを示します。</p>
          <HourClock stats={analysis.memoryCohortHourly} />
          {!cohortSamples && <p className="px-2 pb-2 text-center text-[10px] font-bold text-slate-500">暗記後に同じ項目をテストすると、正解しやすかった時間帯を比べられます。</p>}
        </div>
        <div className="border border-slate-300 bg-white p-3" data-memory-pass-effect>
          <h3 className="text-xs font-extrabold text-slate-800">暗記カードを何回見た後に正解できたか</h3>
          <p className="mt-0.5 text-[9px] font-bold leading-relaxed text-slate-500">暗記した回数ごとに、その後で行ったテストだけをまとめます。</p>
          <div className="mt-3 space-y-3">
            {analysis.memoryPasses.map((stat) => (
              <div key={stat.id} className="grid grid-cols-[4.5rem_1fr_4.4rem] items-center gap-2 text-[10px] font-bold">
                <span className="text-slate-600">{stat.label}</span>
                <div className="h-4 overflow-hidden border border-slate-200 bg-slate-100">
                  <span className="block h-full bg-indigo-600" style={{ width: `${Math.round((stat.accuracy ?? 0) * 100)}%` }} />
                </div>
                <span className="text-right tabular-nums text-slate-700">{asPercent(stat.accuracy)}・{stat.scored}回答</span>
              </div>
            ))}
          </div>
          {!passSamples && <p className="mt-4 border border-slate-200 bg-slate-50 p-3 text-[10px] font-bold leading-relaxed text-slate-500">暗記カードを見た後にテストすると、見た回数ごとの正解率を比べられます。</p>}
        </div>
      </div>
      <div className="grid grid-cols-6 gap-px bg-slate-300 p-px" data-hourly-analysis-matrix>
        {analysis.memoryCohortHourly.map((stat) => (
          <div key={stat.hour} className={cx('min-h-14 p-1.5 text-center', hourCellClass(stat))}>
            <p className="text-[9px] font-extrabold tabular-nums">{String(stat.hour).padStart(2, '0')}時</p>
            <p className="mt-0.5 text-xs font-extrabold tabular-nums">{stat.scored ? asPercent(stat.accuracy) : '—'}</p>
            <p className="text-[8px] font-bold opacity-60">{stat.scored}回答</p>
          </div>
        ))}
      </div>
    </ReportSection>
  )
}

function SkillTable({ analysis }) {
  return (
    <ReportSection number="08" title="学習の種類ごとの記録" note="「覚えた／まだ」とテストの回答を合計し、3件以上ある種類だけを得意・苦手の計算に使用">
      {analysis.skills.length ? (
        <>
          <div className="divide-y divide-slate-200 sm:hidden" data-skill-analysis-cards>
            {analysis.skills.map((skill) => (
              <article key={skill.id} className="space-y-2 p-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-extrabold text-slate-800">{skill.emoji} {skill.label}</h3>
                  <p className="shrink-0 text-sm font-extrabold tabular-nums text-slate-950">正答率 {asPercent(skill.accuracy)}</p>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <dt className="font-extrabold text-slate-500">回答数</dt>
                    <dd className="mt-0.5 font-extrabold tabular-nums text-slate-700">{skill.scored}</dd>
                  </div>
                  <div>
                    <dt className="font-extrabold text-slate-500">正解</dt>
                    <dd className="mt-0.5 font-extrabold tabular-nums text-slate-700">{skill.correct}</dd>
                  </div>
                </dl>
                <div className="h-2 overflow-hidden border border-slate-200 bg-slate-100" aria-hidden="true">
                  <span className="block h-full" style={{ width: `${Math.round((skill.accuracy ?? 0) * 100)}%`, backgroundColor: skill.color }} />
                </div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[31rem] border-collapse text-xs" data-skill-analysis-table>
            <thead>
              <tr className="border-b border-slate-300 text-left text-[10px] font-extrabold text-slate-500">
                <th className="px-3 py-2">分野</th>
                <th className="px-3 py-2 text-right">回答数</th>
                <th className="px-3 py-2 text-right">正解</th>
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
        </>
      ) : (
        <p className="p-4 text-center text-xs font-bold text-slate-500">採点済み回答が増えると分野別成績を表示します。</p>
      )}
    </ReportSection>
  )
}

function IntervalAnalysis({ analysis }) {
  const hasIntervals = analysis.intervals.some((interval) => interval.scored > 0)
  return (
    <ReportSection number="09" title="復習までの日数と思い出せた割合" note="同じ教材を時間を空けて解いた回答だけをまとめて表示">
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
              <span className="text-right tabular-nums text-slate-700">{asPercent(interval.accuracy)}・{interval.scored}回答</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="p-4 text-xs font-bold leading-relaxed text-slate-500">
          時間を空けて答えた記録は、まだありません。同じ教材を時間を空けて2回以上学習すると表示します。
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
    <ReportSection number="10" title="学習した時刻ごとの結果" note="「覚えた／まだ」とテストに答えた時刻を合計。後で行ったテストとの関係は07で分け、5件未満の時間帯はおすすめに使用しない">
      <div className="grid grid-cols-6 gap-px bg-slate-300 p-px" data-hourly-analysis-matrix>
        {analysis.hourly.map((stat) => (
          <div key={stat.hour} className={cx('min-h-14 p-1.5 text-center', hourCellClass(stat))}>
            <p className="text-[9px] font-extrabold tabular-nums">{String(stat.hour).padStart(2, '0')}時</p>
            <p className="mt-0.5 text-xs font-extrabold tabular-nums">{stat.scored ? asPercent(stat.accuracy) : '—'}</p>
            <p className="text-[8px] font-bold opacity-60">{stat.scored}回答</p>
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
    ? '最初の10回答が記録の出発点です。小さく始めても、次に選ぶ教材が具体的になります。'
    : analysis.retentionRate != null && analysis.retentionRate >= 0.8
      ? '思い出せた割合は安定しています。今の方法を続けながら、苦手な分野の練習を少しずつ増やしましょう。'
      : dueCount > 0
        ? '今日の復習は、失敗の印ではありません。今が思い出す練習に向く時期だという案内です。できる分だけ進めましょう。'
        : '記録が増えるたびに目安は更新されます。今の結果だけで実力を決めつけず、次に何を学ぶかを選ぶ材料にしてください。'

  return (
    <ReportSection number="11" title="次の学習プラン" note="科目、分野、学習した時刻、暗記回数などの記録から、次にすることを選ぶ">
      <div className="p-4">
        <div className="border-l-4 border-slate-800 bg-slate-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-extrabold tracking-[0.12em] text-slate-500">おすすめの進め方：{recommendation.intensity}</p>
            <span className="border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-extrabold text-slate-600">あなた向け</span>
          </div>
          <h3 className="mt-1 font-display text-lg font-extrabold text-slate-950">{recommendation.title}</h3>
          <p className="mt-1 text-xs font-bold leading-relaxed text-slate-600">{recommendation.reason}</p>
        </div>

        <table className="mt-3 w-full border-collapse text-xs" data-action-plan-table>
          <tbody>
            {[
              ['すること', recommendation.actionLabel],
              ['おすすめの時間', scheduledWindow],
              ['終わりの目安', successCriterion],
              ['進め方', '答えを見る前に思い出し、まちがえた分は間隔を空けてもう一度確認'],
              ['終わった後', '正答率と、残っている今日の復習をもう一度確認'],
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
            <h3 className="text-xs font-extrabold text-slate-900">記録から見つけた学習案</h3>
            <div className="mt-2 space-y-2">
              {report.prescriptions.map((prescription, index) => (
                <article key={prescription.id} className="border border-slate-300 bg-white p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[9px] font-extrabold tracking-[0.1em] text-slate-500">
                      {String(index + 1).padStart(2, '0')}・{prescription.angle}・{prescription.scope}
                    </p>
                    <span className={cx('border px-2 py-0.5 text-[8px] font-extrabold', prescription.priority === 1 ? 'border-rose-200 bg-rose-50 text-rose-800' : prescription.priority === 2 ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-slate-200 bg-slate-50 text-slate-600')}>
                      {prescription.priority === 1 ? '先に取り組む' : prescription.priority === 2 ? '次に取り組む' : '余裕があれば'}
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
                      この内容で学習を始める
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
              文献は一般的な学習方法の根拠です。このアプリの個人別の目安は学習記録をもとにしており、原因と結果や医学的な状態を証明するものではありません。
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
    <ReportSection number="12" title="学びの言葉と科学的な根拠" note="表示するたびに、出典を確認した言葉と学習方法を一つずつ選択">
      <div className="p-4" data-random-study-wisdom>
        <blockquote className="border-l-4 border-slate-800 bg-slate-50 p-3">
          <p className="font-display text-base font-extrabold leading-relaxed text-slate-950">「{quote.text}」</p>
          <footer className="mt-2 text-[10px] font-bold text-slate-500">
            {quote.author}・<a href={quote.href} target="_blank" rel="noreferrer" className="text-sky-700 underline">{quote.source}</a>
          </footer>
          <p className="mt-2 text-[10px] font-bold leading-relaxed text-slate-600">{quote.note}</p>
        </blockquote>
        <div className="mt-3 border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-[9px] font-extrabold text-emerald-700">今日の学習に使える考え方</p>
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
    <section className="space-y-4" aria-label="学習記録とおすすめ">
      <ReportHeader profile={profile} analysis={analysis} dueCount={dueCount} />
      <SummaryTable analysis={analysis} dueCount={dueCount} />
      <DiagnosticSnapshot diagnostic={profile.diagnostic} onOpen={onOpenDiagnostic} />
      <DimensionTable profile={profile} />
      <ActivitySplit analysis={analysis} report={report} />
      <StudyRhythmSection analysis={analysis} />
      <Gradebook report={report} onNavigate={onNavigate} />
      <MemoryEffectAnalysis analysis={analysis} />
      <SkillTable analysis={analysis} />
      <IntervalAnalysis analysis={analysis} />
      <HourlyMatrix analysis={analysis} />
      <AdviceReport profile={profile} analysis={analysis} dueCount={dueCount} report={report} onNavigate={onNavigate} />
      <StudyWisdomFooter />

      <p className="border border-slate-300 bg-slate-100 px-3 py-2.5 text-[10px] font-bold leading-relaxed text-slate-600">
        この画面のおすすめは、学習記録に合わせて変わる目安です。才能やIQを示すものではありません。
        医療検査や公式試験の結果でもありません。記録が少ない分野は、今後の回答で大きく変わります。
      </p>
    </section>
  )
}
