import {
  LONG_TERM_SRS_BOX,
  MAX_SRS_BOX,
} from './srs.js'

const ANALYTICS_VERSION = 2
const LONG_TERM_BOX = LONG_TERM_SRS_BOX
const MAX_TRACKED_DAYS = 90
const MEMORY_WEIGHTS = Object.freeze([
  0.22,
  0.42,
  0.58,
  0.7,
  0.82,
  0.91,
  0.96,
  0.975,
  0.985,
  0.99,
])

// 学習時間は「回答と回答の間隔」から推定する。
// 5分を超える間隔は離席とみなして加算せず、単発の回答には最小クレジットだけ与える。
export const STUDY_GAP_LIMIT_MS = 5 * 60 * 1000
export const STUDY_MIN_CREDIT_MS = 20 * 1000

export const LEARNING_ACTIVITY_MODES = Object.freeze({
  memory: { label: '暗記', description: 'カードで「覚えた／まだ」を判定した記録' },
  test: { label: 'テスト', description: '問題を解いて正誤を採点した記録' },
  practice: { label: '演習', description: '採点を伴わない読解・作文などの記録' },
})

export const MEMORY_PASS_BUCKETS = Object.freeze([
  { id: '1', label: '1回' },
  { id: '2', label: '2回' },
  { id: '3', label: '3回' },
  { id: '4-5', label: '4〜5回' },
  { id: '6+', label: '6回以上' },
])

const INTERVAL_BUCKETS = [
  { id: 'under1h', label: '1時間未満', maxHours: 1 },
  { id: 'under6h', label: '1〜6時間', maxHours: 6 },
  { id: 'under1d', label: '6〜24時間', maxHours: 24 },
  { id: 'under3d', label: '1〜3日', maxHours: 72 },
  { id: 'under7d', label: '3〜7日', maxHours: 168 },
  { id: 'over7d', label: '7日以上', maxHours: Infinity },
]

export const LEARNING_SKILLS = {
  vocab: { label: '英単語', emoji: '📖', color: '#6366f1' },
  etymology: { label: '語源知識', emoji: '🧩', color: '#7c3aed' },
  grammar: { label: '英文法', emoji: '💡', color: '#f59e0b' },
  usage: { label: '熟語・語法', emoji: '✨', color: '#8b5cf6' },
  reading: { label: '長文読解', emoji: '📚', color: '#10b981' },
  listening: { label: 'リスニング', emoji: '🎧', color: '#0ea5e9' },
  dictation: { label: 'ディクテーション', emoji: '⌨️', color: '#14b8a6' },
  writing: { label: '英作文', emoji: '✍️', color: '#d946ef' },
  koten: { label: '古典単語', emoji: '📜', color: '#a16207' },
  koten_grammar: { label: '古典文法', emoji: '🪶', color: '#d97706' },
  koten_culture: { label: '古典常識', emoji: '🏯', color: '#7c3aed' },
  koten_reading: { label: '古典読解', emoji: '🏯', color: '#b45309' },
  kanbun_vocab: { label: '漢語', emoji: '📖', color: '#0f766e' },
  kanbun_grammar: { label: '漢文法', emoji: '🧭', color: '#be123c' },
  kanbun_culture: { label: '漢文常識', emoji: '🏛️', color: '#7c3aed' },
  kanbun_kundoku: { label: '返り点・訓読', emoji: '🔁', color: '#0369a1' },
  math: { label: '数学', emoji: '📐', color: '#7c3aed' },
}

const finiteOr = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback

const nonNegative = (value, fallback = 0) =>
  Math.max(0, finiteOr(value, fallback))

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const emptyAggregate = () => ({ inputs: 0, scored: 0, correct: 0 })

const emptyModeAggregate = () => ({ ...emptyAggregate(), hours: {} })

export function createLearningAnalytics() {
  return {
    version: ANALYTICS_VERSION,
    inputs: 0,
    scored: 0,
    correct: 0,
    hours: {},
    intervals: {},
    skills: {},
    days: {},
    lastEventAt: null,
    modes: {
      memory: emptyModeAggregate(),
      test: emptyModeAggregate(),
      practice: emptyModeAggregate(),
    },
    memoryCohorts: { hours: {}, passes: {} },
    longTerm: { items: 0, repetitions: 0 },
  }
}

function normalizeAggregate(value) {
  const scored = nonNegative(value?.scored)
  return {
    inputs: nonNegative(value?.inputs),
    scored,
    correct: clamp(nonNegative(value?.correct), 0, scored),
    ms: nonNegative(value?.ms),
  }
}

// 時間帯ごとの集計には「その時刻に学習した日数」を持たせ、学習リズムの規則性を測る。
function normalizeHourAggregate(value) {
  const aggregate = normalizeAggregate(value)
  const lastDay = typeof value?.lastDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.lastDay)
    ? value.lastDay
    : null
  return {
    ...aggregate,
    days: Math.max(nonNegative(value?.days), lastDay ? 1 : 0),
    lastDay,
  }
}

function normalizeModeAggregate(value) {
  const aggregate = normalizeAggregate(value)
  const hours = {}
  for (const [key, hourAggregate] of Object.entries(value?.hours ?? {})) {
    const hour = Number(key)
    if (Number.isInteger(hour) && hour >= 0 && hour <= 23) {
      hours[hour] = normalizeAggregate(hourAggregate)
    }
  }
  return { ...aggregate, hours }
}

export function normalizeLearningAnalytics(value) {
  const base = createLearningAnalytics()
  if (!value || typeof value !== 'object' || Array.isArray(value)) return base

  const hours = {}
  for (const [key, aggregate] of Object.entries(value.hours ?? {})) {
    const hour = Number(key)
    if (Number.isInteger(hour) && hour >= 0 && hour <= 23) {
      hours[hour] = normalizeHourAggregate(aggregate)
    }
  }

  const intervals = {}
  for (const bucket of INTERVAL_BUCKETS) {
    if (value.intervals?.[bucket.id]) {
      intervals[bucket.id] = normalizeAggregate(value.intervals[bucket.id])
    }
  }

  const skills = {}
  for (const [skill, aggregate] of Object.entries(value.skills ?? {})) {
    if (skill) skills[skill] = normalizeAggregate(aggregate)
  }

  const days = {}
  for (const [day, aggregate] of Object.entries(value.days ?? {})) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      days[day] = normalizeAggregate(aggregate)
    }
  }


  const modes = Object.fromEntries(
    Object.keys(LEARNING_ACTIVITY_MODES).map((mode) => [
      mode,
      normalizeModeAggregate(value.modes?.[mode]),
    ]),
  )

  const cohortHours = {}
  for (const [key, aggregate] of Object.entries(value.memoryCohorts?.hours ?? {})) {
    const hour = Number(key)
    if (Number.isInteger(hour) && hour >= 0 && hour <= 23) {
      cohortHours[hour] = normalizeAggregate(aggregate)
    }
  }
  const cohortPasses = {}
  for (const bucket of MEMORY_PASS_BUCKETS) {
    if (value.memoryCohorts?.passes?.[bucket.id]) {
      cohortPasses[bucket.id] = normalizeAggregate(
        value.memoryCohorts.passes[bucket.id],
      )
    }
  }

  return {
    version: ANALYTICS_VERSION,
    inputs: nonNegative(value.inputs),
    scored: nonNegative(value.scored),
    correct: clamp(nonNegative(value.correct), 0, nonNegative(value.scored)),
    hours,
    intervals,
    skills,
    days,
    modes,
    lastEventAt: Number.isFinite(Number(value.lastEventAt)) ? Number(value.lastEventAt) : null,
    memoryCohorts: { hours: cohortHours, passes: cohortPasses },
    longTerm: {
      items: nonNegative(value.longTerm?.items),
      repetitions: nonNegative(value.longTerm?.repetitions),
    },
  }
}

function memoryPassBucketFor(passes) {
  const count = Math.floor(nonNegative(passes))
  if (count <= 0) return null
  if (count <= 3) return String(count)
  if (count <= 5) return '4-5'
  return '6+'
}

function activityModeFor(event, scored) {
  if (Object.hasOwn(LEARNING_ACTIVITY_MODES, event?.activity)) return event.activity
  return scored > 0 ? 'test' : 'practice'
}

function localDateKey(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addAggregate(current, { inputs, scored, correct, ms = 0 }) {
  const previous = normalizeAggregate(current)
  return {
    inputs: previous.inputs + inputs,
    scored: previous.scored + scored,
    correct: previous.correct + correct,
    ms: previous.ms + nonNegative(ms),
  }
}

// 時間帯の集計に、その時刻へ新しい学習日が加わったかどうかも反映する。
function addHourAggregate(current, delta, day) {
  const previous = normalizeHourAggregate(current)
  const isNewDay = Boolean(day) && previous.lastDay !== day
  return {
    ...addAggregate(previous, delta),
    days: previous.days + (isNewDay ? 1 : 0),
    lastDay: day ?? previous.lastDay,
  }
}

function intervalBucketFor(gapHours) {
  if (!Number.isFinite(gapHours) || gapHours < 0) return null
  return INTERVAL_BUCKETS.find((bucket) => gapHours < bucket.maxHours)
    ?? INTERVAL_BUCKETS[INTERVAL_BUCKETS.length - 1]
}

// 回答内容そのものは残さず、分析に必要な集計値だけを加算する。
export function recordLearningEvent(current, event, timestamp = Date.now()) {
  const analytics = normalizeLearningAnalytics(current)
  const at = Number.isFinite(timestamp) ? timestamp : Date.now()
  const inputs = nonNegative(event?.inputs, 1)
  const scored = nonNegative(event?.scored)
  const correct = clamp(nonNegative(event?.correct), 0, scored)
  const hour = new Date(at).getHours()
  const day = localDateKey(at)
  const skill = event?.skill || 'other'
  const activity = activityModeFor(event, scored)
  // 直前の回答からの間隔を、そのまま学習時間として積む（離席とみなす長い間隔は除外）。
  const sinceLast = Number.isFinite(analytics.lastEventAt) ? at - analytics.lastEventAt : null
  // 同一タイムスタンプでまとめて記録される一括保存は、二重計上しない。
  const ms = sinceLast === 0
    ? 0
    : sinceLast != null && sinceLast > 0 && sinceLast <= STUDY_GAP_LIMIT_MS
      ? sinceLast
      : STUDY_MIN_CREDIT_MS

  analytics.inputs += inputs
  analytics.scored += scored
  analytics.correct += correct
  analytics.lastEventAt = at
  analytics.hours[hour] = addHourAggregate(analytics.hours[hour], { inputs, scored, correct, ms }, day)
  analytics.skills[skill] = addAggregate(analytics.skills[skill], { inputs, scored, correct, ms })
  analytics.days[day] = addAggregate(analytics.days[day], { inputs, scored, correct, ms })
  const mode = analytics.modes[activity] ?? emptyModeAggregate()
  const nextMode = addAggregate(mode, { inputs, scored, correct })
  analytics.modes[activity] = {
    ...nextMode,
    hours: {
      ...mode.hours,
      [hour]: addAggregate(mode.hours?.[hour], { inputs, scored, correct }),
    },
  }

  // テスト結果を、その項目を最後に暗記した時刻と暗記周回数へ帰属させる。
  // 問題文・回答内容は保存せず、条件別の正誤件数だけを保持する。
  if (activity === 'test' && scored > 0) {
    const memoryHour = Number(event?.memoryHour)
    if (Number.isInteger(memoryHour) && memoryHour >= 0 && memoryHour <= 23) {
      analytics.memoryCohorts.hours[memoryHour] = addAggregate(
        analytics.memoryCohorts.hours[memoryHour],
        { inputs, scored, correct },
      )
    }
    const passBucket = memoryPassBucketFor(event?.memoryPasses)
    if (passBucket) {
      analytics.memoryCohorts.passes[passBucket] = addAggregate(
        analytics.memoryCohorts.passes[passBucket],
        { inputs, scored, correct },
      )
    }
  }

  const bucket = intervalBucketFor(event?.gapHours)
  if (bucket && scored > 0) {
    analytics.intervals[bucket.id] = addAggregate(
      analytics.intervals[bucket.id],
      { inputs, scored, correct },
    )
  }

  if (
    Number.isFinite(event?.beforeBox)
    && Number.isFinite(event?.afterBox)
    && event.beforeBox < LONG_TERM_BOX
    && event.afterBox >= LONG_TERM_BOX
  ) {
    analytics.longTerm.items += 1
    analytics.longTerm.repetitions += Math.max(1, nonNegative(event?.repetitions, 1))
  }

  const recentDays = Object.keys(analytics.days).sort().slice(-MAX_TRACKED_DAYS)
  analytics.days = Object.fromEntries(recentDays.map((key) => [key, analytics.days[key]]))
  return analytics
}

export function recordLearningEvents(current, events, timestamp = Date.now()) {
  return (Array.isArray(events) ? events : []).reduce(
    (analytics, event) => recordLearningEvent(analytics, event, timestamp),
    current,
  )
}

export function learningSkillForItem(itemId, hint) {
  if (hint) return hint
  const id = String(itemId ?? '')
  if (id.startsWith('gr_') || id.startsWith('wgr_')) return 'grammar'
  if (id.startsWith('idm_') || id.startsWith('syn_')) return 'usage'
  if (id.startsWith('lis_') || id.startsWith('listening_')) return 'listening'
  if (id.startsWith('dict_')) return 'dictation'
  return 'vocab'
}

function collectSrsEntries(stores) {
  return (Array.isArray(stores) ? stores : [])
    .flatMap((store) => Object.values(store && typeof store === 'object' ? store : {}))
    .filter((entry) => entry && typeof entry === 'object')
}

function percentage(count, total) {
  return total ? Math.round((count / total) * 100) : 0
}

function localDateKeysBack(now, count) {
  const cursor = new Date(now)
  cursor.setHours(12, 0, 0, 0)
  return Array.from({ length: count }, (_, offset) => {
    const date = new Date(cursor)
    date.setDate(cursor.getDate() - offset)
    return localDateKey(date.getTime())
  })
}

// 「1日の学習時間」は、回答間隔から積んだ実時間を暦日で平均する。
// 学習しなかった日を分母から外さないため、直近7日・28日の暦日で割る。
function studyTimeFrom(analytics, now) {
  const keys28 = localDateKeysBack(now, 28)
  const msFor = (key) => nonNegative(analytics.days?.[key]?.ms)
  const sum = (keys) => keys.reduce((total, key) => total + msFor(key), 0)
  const ms7 = sum(keys28.slice(0, 7))
  const ms28 = sum(keys28)
  const totalMs = Object.values(analytics.days ?? {}).reduce(
    (total, day) => total + nonNegative(day?.ms),
    0,
  )
  const activeDays7 = keys28.slice(0, 7).filter((key) => msFor(key) > 0).length
  const activeDays28 = keys28.filter((key) => msFor(key) > 0).length
  return {
    todayMs: msFor(keys28[0]),
    ms7,
    ms28,
    totalMs,
    activeDays7,
    activeDays28,
    // 暦日平均（学習しなかった日も含む）と、学習した日だけの平均を並べて示す。
    dailyAverageMs7: ms7 / 7,
    dailyAverageMs28: ms28 / 28,
    activeDayAverageMs: activeDays28 ? ms28 / activeDays28 : null,
    recentDays: keys28.map((key) => ({ key, ms: msFor(key) })).reverse(),
    hasEvidence: totalMs > 0,
  }
}

// 学習リズム＝「同じ時刻に学習を繰り返せているか」。
// 時間帯ごとの学習日数を、学習した日数で割った定着率で測る。
function rhythmFrom(hourlyTime, activeDays) {
  const ranked = [...hourlyTime].sort((a, b) => b.days - a.days || b.ms - a.ms)
  const peak = ranked[0] ?? null
  const core = ranked.filter((stat) => stat.days > 0).slice(0, 3)
  const coreDays = core.reduce((sum, stat) => sum + stat.days, 0)
  const regularity = activeDays && core.length
    ? Math.min(1, coreDays / (activeDays * core.length))
    : null
  return {
    peakHour: peak && peak.days > 0 ? peak.hour : null,
    peakDays: peak?.days ?? 0,
    coreHours: core.map((stat) => stat.hour).sort((a, b) => a - b),
    activeDays,
    regularity,
    score: regularity == null ? null : Math.round(regularity * 100),
  }
}

function hourStatsFrom(analytics) {
  return Array.from({ length: 24 }, (_, hour) => {
    const aggregate = normalizeAggregate(analytics.hours[hour])
    const accuracy = aggregate.scored ? aggregate.correct / aggregate.scored : null
    // 少数回答の100%を過大評価しないよう、50%の弱い事前分布で平滑化する。
    const efficiency = aggregate.scored
      ? (aggregate.correct + 2) / (aggregate.scored + 4)
      : null
    return { hour, ...aggregate, accuracy, efficiency }
  })
}

function cohortHourStatsFrom(analytics) {
  return Array.from({ length: 24 }, (_, hour) => {
    const aggregate = normalizeAggregate(analytics.memoryCohorts?.hours?.[hour])
    return {
      hour,
      ...aggregate,
      accuracy: aggregate.scored ? aggregate.correct / aggregate.scored : null,
    }
  })
}

function passStatsFrom(analytics) {
  return MEMORY_PASS_BUCKETS.map((bucket) => {
    const aggregate = normalizeAggregate(analytics.memoryCohorts?.passes?.[bucket.id])
    return {
      ...bucket,
      ...aggregate,
      accuracy: aggregate.scored ? aggregate.correct / aggregate.scored : null,
    }
  })
}

function bestThreeHourWindow(hourly) {
  const candidates = hourly.map((_, start) => {
    const hours = [start, (start + 1) % 24, (start + 2) % 24]
    const scored = hours.reduce((sum, hour) => sum + hourly[hour].scored, 0)
    const correct = hours.reduce((sum, hour) => sum + hourly[hour].correct, 0)
    return {
      start,
      end: (start + 3) % 24,
      scored,
      correct,
      efficiency: scored ? (correct + 2) / (scored + 4) : null,
    }
  })
  return candidates
    .filter((candidate) => candidate.scored >= 5)
    .sort((a, b) => b.efficiency - a.efficiency || b.scored - a.scored)[0] ?? null
}

function skillResultsFrom(analytics, skillStats) {
  // 現在サポートしている分野だけを表示し、旧版や未知の分野が推薦導線へ戻らないようにする。
  const ids = Object.keys(LEARNING_SKILLS).filter(
    (id) => skillStats?.[id] || analytics.skills?.[id],
  )
  return ids.map((id) => {
    const tracked = normalizeAggregate(analytics.skills[id])
    const historic = skillStats?.[id] ?? {}
    // 新分析が5回答以上たまるまでは既存の分野別成績を使い、少数回答の振れを避ける。
    const useTracked = tracked.scored >= 5 || !nonNegative(historic.answered)
    const scored = useTracked ? tracked.scored : nonNegative(historic.answered)
    const correct = useTracked
      ? tracked.correct
      : clamp(nonNegative(historic.correct), 0, scored)
    const meta = LEARNING_SKILLS[id]
    return {
      id,
      ...meta,
      scored,
      correct,
      accuracy: scored ? correct / scored : null,
    }
  })
    // 英作文は現状「完成」を記録しており、正誤採点ではないため得意不得意から外す。
    .filter((skill) => skill.scored > 0 && skill.id !== 'writing')
    .sort((a, b) => b.scored - a.scored)
}

export function analyzeLearning({
  learningAnalytics,
  srsStores = [],
  skillStats = {},
  now = Date.now(),
} = {}) {
  const analytics = normalizeLearningAnalytics(learningAnalytics)
  const entries = collectSrsEntries(srsStores)
  const stages = { fragile: 0, short: 0, long: 0 }
  let weightedMemory = 0
  let lifetimeReviews = 0
  let lifetimeCorrect = 0
  let lifetimeWrong = 0

  for (const entry of entries) {
    const box = clamp(Math.floor(nonNegative(entry.box)), 0, MAX_SRS_BOX)
    if (box === 0) stages.fragile += 1
    else if (box < LONG_TERM_BOX) stages.short += 1
    else stages.long += 1
    weightedMemory += MEMORY_WEIGHTS[box]
    lifetimeCorrect += nonNegative(entry.correct)
    lifetimeWrong += nonNegative(entry.wrong)
    lifetimeReviews += nonNegative(entry.correct) + nonNegative(entry.wrong)
  }

  const learnedItems = entries.length
  const trackingStarted = analytics.inputs > 0
  const scored = trackingStarted ? analytics.scored : lifetimeReviews
  const correct = trackingStarted ? analytics.correct : lifetimeCorrect
  const forgotten = Math.max(0, scored - correct)
  const activeDays = Object.values(analytics.days).filter((day) => day.inputs > 0)
  const hourly = hourStatsFrom(analytics)
  const memoryHourly = hourStatsFrom({ hours: analytics.modes.memory.hours })
  const testHourly = hourStatsFrom({ hours: analytics.modes.test.hours })
  const memoryCohortHourly = cohortHourStatsFrom(analytics)
  const memoryPasses = passStatsFrom(analytics)
  const bestWindow = bestThreeHourWindow(hourly)
  const studyTime = studyTimeFrom(analytics, now)
  const hourlyTime = Array.from({ length: 24 }, (_, hour) => {
    const aggregate = normalizeHourAggregate(analytics.hours[hour])
    return {
      hour,
      ms: aggregate.ms,
      inputs: aggregate.inputs,
      days: aggregate.days,
      share: studyTime.totalMs ? aggregate.ms / studyTime.totalMs : 0,
    }
  })
  const rhythm = rhythmFrom(hourlyTime, studyTime.activeDays28)
  const skills = skillResultsFrom(analytics, skillStats)
  const rankedSkills = skills
    .filter((skill) => skill.scored >= 3)
    .sort((a, b) => b.accuracy - a.accuracy || b.scored - a.scored)

  const longTermEntries = entries.filter(
    (entry) => nonNegative(entry.box) >= LONG_TERM_BOX,
  )
  const repetitionsToLongTerm = analytics.longTerm.items
    ? analytics.longTerm.repetitions / analytics.longTerm.items
    : longTermEntries.length
      ? longTermEntries.reduce(
          (sum, entry) => sum + nonNegative(entry.correct) + nonNegative(entry.wrong),
          0,
        ) / longTermEntries.length
      : null

  const intervals = INTERVAL_BUCKETS.map((bucket) => {
    const aggregate = normalizeAggregate(analytics.intervals[bucket.id])
    return {
      id: bucket.id,
      label: bucket.label,
      ...aggregate,
      accuracy: aggregate.scored ? aggregate.correct / aggregate.scored : null,
    }
  })

  return {
    source: trackingStarted ? 'tracked' : lifetimeReviews ? 'srs-fallback' : 'empty',
    // 導入前のSRS累計が、最初の新規回答で小さな値へ戻って見えないようにする。
    inputs: Math.max(analytics.inputs, lifetimeReviews),
    scored,
    correct,
    forgotten,
    retentionRate: scored ? correct / scored : null,
    forgettingRate: scored ? forgotten / scored : null,
    learnedItems,
    memoryScore: learnedItems ? Math.round((weightedMemory / learnedItems) * 100) : 0,
    stages: {
      ...stages,
      fragilePct: percentage(stages.fragile, learnedItems),
      shortPct: percentage(stages.short, learnedItems),
      longPct: percentage(stages.long, learnedItems),
    },
    activeDays: activeDays.length,
    averageInputsPerActiveDay: activeDays.length
      ? activeDays.reduce((sum, day) => sum + day.inputs, 0) / activeDays.length
      : null,
    studyTime,
    hourlyTime,
    rhythm,
    repetitionsToLongTerm,
    hourly,
    activity: {
      memory: normalizeModeAggregate(analytics.modes.memory),
      test: normalizeModeAggregate(analytics.modes.test),
      practice: normalizeModeAggregate(analytics.modes.practice),
    },
    memoryHourly,
    testHourly,
    memoryCohortHourly,
    memoryPasses,
    bestWindow,
    intervals,
    skills,
    strength: rankedSkills[0] ?? null,
    weakness: rankedSkills.length > 1
      ? rankedSkills[rankedSkills.length - 1]
      : null,
    trackingReadiness:
      analytics.scored >= 100 ? 'stable'
        : analytics.scored >= 20 ? 'growing'
          : analytics.scored > 0 ? 'starting'
            : 'empty',
  }
}

export { INTERVAL_BUCKETS, LONG_TERM_BOX }
