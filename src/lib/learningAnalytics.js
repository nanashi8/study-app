const ANALYTICS_VERSION = 1
const LONG_TERM_BOX = 4
const MAX_TRACKED_DAYS = 90

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
  math: { label: '数学', emoji: '📐', color: '#7c3aed' },
}

const finiteOr = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback

const nonNegative = (value, fallback = 0) =>
  Math.max(0, finiteOr(value, fallback))

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const emptyAggregate = () => ({ inputs: 0, scored: 0, correct: 0 })

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
    longTerm: { items: 0, repetitions: 0 },
  }
}

function normalizeAggregate(value) {
  const scored = nonNegative(value?.scored)
  return {
    inputs: nonNegative(value?.inputs),
    scored,
    correct: clamp(nonNegative(value?.correct), 0, scored),
  }
}

export function normalizeLearningAnalytics(value) {
  const base = createLearningAnalytics()
  if (!value || typeof value !== 'object' || Array.isArray(value)) return base

  const hours = {}
  for (const [key, aggregate] of Object.entries(value.hours ?? {})) {
    const hour = Number(key)
    if (Number.isInteger(hour) && hour >= 0 && hour <= 23) {
      hours[hour] = normalizeAggregate(aggregate)
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

  return {
    version: ANALYTICS_VERSION,
    inputs: nonNegative(value.inputs),
    scored: nonNegative(value.scored),
    correct: clamp(nonNegative(value.correct), 0, nonNegative(value.scored)),
    hours,
    intervals,
    skills,
    days,
    longTerm: {
      items: nonNegative(value.longTerm?.items),
      repetitions: nonNegative(value.longTerm?.repetitions),
    },
  }
}

function localDateKey(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addAggregate(current, { inputs, scored, correct }) {
  const previous = normalizeAggregate(current)
  return {
    inputs: previous.inputs + inputs,
    scored: previous.scored + scored,
    correct: previous.correct + correct,
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

  analytics.inputs += inputs
  analytics.scored += scored
  analytics.correct += correct
  analytics.hours[hour] = addAggregate(analytics.hours[hour], { inputs, scored, correct })
  analytics.skills[skill] = addAggregate(analytics.skills[skill], { inputs, scored, correct })
  analytics.days[day] = addAggregate(analytics.days[day], { inputs, scored, correct })

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
} = {}) {
  const analytics = normalizeLearningAnalytics(learningAnalytics)
  const entries = collectSrsEntries(srsStores)
  const stages = { fragile: 0, short: 0, long: 0 }
  let weightedMemory = 0
  let lifetimeReviews = 0
  let lifetimeCorrect = 0
  let lifetimeWrong = 0

  for (const entry of entries) {
    const box = clamp(Math.floor(nonNegative(entry.box)), 0, 6)
    if (box === 0) stages.fragile += 1
    else if (box < LONG_TERM_BOX) stages.short += 1
    else stages.long += 1
    weightedMemory += [0.22, 0.42, 0.58, 0.7, 0.82, 0.91, 0.96][box]
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
  const bestWindow = bestThreeHourWindow(hourly)
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
    repetitionsToLongTerm,
    hourly,
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
