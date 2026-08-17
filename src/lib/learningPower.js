import {
  analyzeLearning,
  normalizeLearningAnalytics,
} from './learningAnalytics.js'

const DAY_MS = 86400000

const DIMENSION_WEIGHTS = {
  memory: 0.35,
  testing: 0.35,
  consistency: 0.2,
  rhythm: 0.1,
}

const SKILL_ROUTES = {
  vocab: {
    screen: 'vocabLevels',
    params: { intent: 'quiz' },
    label: '英単語',
    actionLabel: '単語クイズへ',
  },
  etymology: {
    screen: 'roots',
    label: '語源知識',
    actionLabel: '語源カードへ',
  },
  grammar: {
    screen: 'grammar',
    label: '英文法',
    actionLabel: '文法トレーニングへ',
  },
  usage: {
    screen: 'phrases',
    label: '熟語・語法',
    actionLabel: '熟語・語法へ',
  },
  reading: {
    screen: 'readingList',
    label: '長文読解',
    actionLabel: '長文読解へ',
  },
  listening: {
    screen: 'listening',
    label: 'リスニング',
    actionLabel: 'リスニングへ',
  },
  dictation: {
    screen: 'dictation',
    label: 'ディクテーション',
    actionLabel: 'ディクテーションへ',
  },
  writing: {
    screen: 'writing',
    label: '英作文',
    actionLabel: '英作文へ',
  },
  math: {
    screen: 'mathMap',
    label: '数学',
    actionLabel: '数学マップへ',
  },
  koten: {
    screen: 'kotenList',
    label: '古典単語',
    actionLabel: '古典単語へ',
  },
  koten_grammar: {
    screen: 'kotenGrammar',
    label: '古典文法',
    actionLabel: '古典文法へ',
  },
  koten_culture: {
    screen: 'kotenCulture',
    label: '古典常識',
    actionLabel: '古典常識へ',
  },
  koten_reading: {
    screen: 'kotenInterpretationList',
    label: '古典読解',
    actionLabel: '古典読解へ',
  },
  kanbun_vocab: {
    screen: 'kanbunCatalog',
    params: { domain: 'vocab' },
    label: '漢語',
    actionLabel: '漢語へ',
  },
  kanbun_grammar: {
    screen: 'kanbunCatalog',
    params: { domain: 'grammar' },
    label: '漢文法',
    actionLabel: '漢文法へ',
  },
  kanbun_culture: {
    screen: 'kanbunCatalog',
    params: { domain: 'culture' },
    label: '漢文常識',
    actionLabel: '漢文常識へ',
  },
  kanbun_kundoku: {
    screen: 'kanbunKundoku',
    label: '返り点・訓読',
    actionLabel: '返り点ドリルへ',
  },
}

const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(value) || 0))

const rounded = (value) => Math.round(clamp(value))

const scoredTotal = (items) =>
  items.reduce((sum, item) => sum + (Number(item?.scored) || 0), 0)

function localDateKey(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function recentDateKeys(now, count) {
  const cursor = new Date(now)
  cursor.setHours(12, 0, 0, 0)
  return Array.from({ length: count }, (_, offset) => {
    const date = new Date(cursor)
    date.setDate(cursor.getDate() - offset)
    return localDateKey(date.getTime())
  })
}

function localDayIndexAt(timestamp) {
  const timezoneOffsetMinutes = new Date(timestamp).getTimezoneOffset()
  return Math.floor((timestamp - timezoneOffsetMinutes * 60000) / DAY_MS)
}

function habitStats(analytics, stats, now) {
  const keys28 = recentDateKeys(now, 28)
  const active = (key) => (analytics.days[key]?.inputs ?? 0) > 0
  const activeDays7 = keys28.slice(0, 7).filter(active).length
  const activeDays28 = keys28.filter(active).length

  // 今日が未学習なら昨日からの連続も継続中として扱う。
  let trackedStreak = 0
  let started = false
  for (const key of keys28) {
    if (active(key)) {
      started = true
      trackedStreak += 1
    } else if (started) {
      break
    }
  }

  const currentDay = localDayIndexAt(now)
  const storedStreak = Number.isFinite(stats?.day)
    && stats.day >= currentDay - 1
    ? Math.max(0, Number(stats?.streak) || 0)
    : 0
  const streak = Math.max(trackedStreak, storedStreak)
  const hasEvidence = activeDays28 > 0 || storedStreak > 0

  return {
    activeDays7,
    activeDays28,
    streak,
    hasEvidence,
    score: hasEvidence
      ? rounded((activeDays7 / 5) * 70 + (Math.min(streak, 7) / 7) * 30)
      : null,
  }
}

function latestValidDiagnostic(history) {
  if (!Array.isArray(history)) return null
  return history.find(
    (item) =>
      item
      && Number.isFinite(item.deviation)
      && Number.isFinite(item.total)
      && item.total > 0,
  ) ?? null
}

function dimensionLevel(score) {
  if (score == null) return '計測中'
  if (score >= 80) return '大きな強み'
  if (score >= 65) return '順調'
  if (score >= 50) return '育成中'
  return '伸びしろ'
}

function dimension({ id, label, score, evidence, note, color }) {
  return {
    id,
    label,
    score: score == null ? null : rounded(score),
    level: dimensionLevel(score),
    evidence,
    note,
    color,
  }
}

function formatWindow(window) {
  if (!window) return null
  const start = String(window.start).padStart(2, '0')
  const end = String(window.end).padStart(2, '0')
  return `${start}:00〜${window.end <= window.start ? '翌' : ''}${end}:00`
}

function hourIsInWindow(hour, window) {
  if (!window) return false
  if (window.start < window.end) {
    return hour >= window.start && hour < window.end
  }
  return hour >= window.start || hour < window.end
}

function daysSince(timestamp, now) {
  const parsed = new Date(timestamp).getTime()
  if (!Number.isFinite(parsed)) return null
  return Math.max(0, Math.floor((now - parsed) / DAY_MS))
}

function recommendationFor({
  analysis,
  dimensions,
  diagnostic,
  habit,
  dueCount,
  now,
}) {
  const memory = dimensions.find((item) => item.id === 'memory')
  const testing = dimensions.find((item) => item.id === 'testing')
  const currentHour = new Date(now).getHours()
  const isBestTime = hourIsInWindow(currentHour, analysis.bestWindow)
  const bestWindowLabel = formatWindow(analysis.bestWindow)
  const diagnosticAge = diagnostic ? daysSince(diagnostic.completedAt, now) : null
  const ongoingWeakness = analysis.skills
    .filter((skill) => skill.scored >= 3 && skill.accuracy < 0.75)
    .sort((a, b) => a.accuracy - b.accuracy || b.scored - a.scored)[0]
  const prioritySkillId = diagnostic?.prioritySkillId
    ?? ongoingWeakness?.id
  const skillRoute = SKILL_ROUTES[prioritySkillId]

  if (
    dueCount > 0
    && (
      memory?.score == null
      || memory.score < 70
      || (analysis.bestWindow && !isBestTime)
    )
  ) {
    return {
      id: 'review',
      intensity: '軽め',
      title: 'いまは復習で記憶をつなぐ',
      reason: `${dueCount}語が復習どきです。新しい範囲より先に、忘れかけた記憶を呼び戻しましょう。`,
      timing: bestWindowLabel && !isBestTime
        ? `集中課題は ${bestWindowLabel} がおすすめ`
        : '5〜10分から',
      screen: 'vocabStudy',
      params: { source: { type: 'due' }, title: '復習', mode: 'study' },
      actionLabel: `${dueCount}語を復習`,
    }
  }

  if (!diagnostic && (analysis.scored < 20 || !testing || testing.score == null)) {
    return {
      id: 'measure',
      intensity: '診断',
      title: 'まず現在地を測ろう',
      reason: '診断テストを加えると、学習履歴だけでは分からない問題対応力と弱点を見つけられます。',
      timing: '28問・約10分',
      screen: 'diagnostic',
      params: {},
      actionLabel: '診断テストを始める',
    }
  }

  if (isBestTime && skillRoute) {
    return {
      id: 'focus',
      intensity: '集中',
      title: `集中タイムに${skillRoute.label}を伸ばす`,
      reason: `正答履歴では${skillRoute.label}が優先分野です。得意な時間帯に、少し難しい課題へ取り組みましょう。`,
      timing: `いまは得意時間帯（${bestWindowLabel}）`,
      screen: skillRoute.screen,
      params: skillRoute.params ?? {},
      actionLabel: skillRoute.actionLabel,
    }
  }

  if (habit.hasEvidence && habit.activeDays7 < 3) {
    return {
      id: 'habit',
      intensity: '短時間',
      title: '5分だけ学習をつなぐ',
      reason: `直近7日の学習は${habit.activeDays7}日です。量を増やす前に、短い学習を続けてリズムを作りましょう。`,
      timing: bestWindowLabel ? `集中学習は ${bestWindowLabel}` : '今日できる時間に5分',
      screen: 'vocabLevels',
      params: {},
      actionLabel: '短い単語学習へ',
    }
  }

  if (dueCount > 0) {
    return {
      id: 'review',
      intensity: '復習',
      title: '復習を終えてから次へ',
      reason: `${dueCount}語の復習を先に終えると、新しい学習を定着させやすくなります。`,
      timing: isBestTime ? 'いま始めどき' : '5〜10分から',
      screen: 'vocabStudy',
      params: { source: { type: 'due' }, title: '復習', mode: 'study' },
      actionLabel: `${dueCount}語を復習`,
    }
  }

  if (diagnosticAge != null && diagnosticAge >= 30) {
    return {
      id: 'remeasure',
      intensity: '再測定',
      title: '伸びを診断テストで確かめる',
      reason: `前回診断から${diagnosticAge}日たちました。今の実力に更新して、次の優先分野を選び直しましょう。`,
      timing: '復習待ちがない今がおすすめ',
      screen: 'diagnostic',
      params: {},
      actionLabel: 'もう一度診断する',
    }
  }

  if ((memory?.score ?? 0) >= 70 && (testing?.score ?? 0) >= 60 && !skillRoute) {
    return {
      id: 'challenge',
      intensity: '応用',
      title: '定着した知識を長文で使う',
      reason: '記憶と問題対応が安定しています。覚えた知識を組み合わせる課題へ進みましょう。',
      timing: bestWindowLabel ? `おすすめ時間帯 ${bestWindowLabel}` : '15分を目安に',
      screen: 'readingList',
      params: {},
      actionLabel: '長文読解へ',
    }
  }

  if (skillRoute) {
    return {
      id: 'weakness',
      intensity: '重点',
      title: `${skillRoute.label}を次の伸びしろに`,
      reason: `テストと学習履歴から、いま最も伸ばしやすい分野として${skillRoute.label}を選びました。`,
      timing: bestWindowLabel
        ? `${bestWindowLabel}なら集中課題におすすめ`
        : '10分を目安に',
      screen: skillRoute.screen,
      params: skillRoute.params ?? {},
      actionLabel: skillRoute.actionLabel,
    }
  }

  return {
    id: 'practice',
    intensity: '基礎',
    title: '単語クイズで測りながら伸ばす',
    reason: '採点済みの回答が増えるほど、記憶・弱点・得意時間帯の推定が個人の傾向に近づきます。',
    timing: '10問から',
    screen: 'vocabLevels',
    params: { intent: 'quiz' },
    actionLabel: '単語クイズへ',
  }
}

// 学習履歴から求める「学習のしかた」の推定。IQ・医療的な認知能力ではなく、
// 何を・いつ学ぶかを選ぶための可変プロフィールとしてのみ利用する。
export function buildLearningPowerProfile({
  learningAnalytics,
  srsStores = [],
  skillStats = {},
  diagnosticHistory = [],
  stats = {},
  dueCount = 0,
  now = Date.now(),
} = {}) {
  const analytics = normalizeLearningAnalytics(learningAnalytics)
  const analysis = analyzeLearning({ learningAnalytics, srsStores, skillStats, now })
  const diagnostic = latestValidDiagnostic(diagnosticHistory)
  const habit = habitStats(analytics, stats, now)
  const trackedSkillAnswers = scoredTotal(analysis.skills)

  const memoryScore = analysis.learnedItems
    ? analysis.retentionRate == null
      ? analysis.memoryScore
      : analysis.memoryScore * 0.55 + analysis.retentionRate * 100 * 0.45
    : analysis.retentionRate == null
      ? null
      : analysis.retentionRate * 100

  const testingScore = diagnostic
    ? diagnostic.deviation
    : trackedSkillAnswers >= 5
      ? analysis.skills.reduce(
          (sum, skill) => sum + (skill.accuracy ?? 0) * skill.scored,
          0,
        ) / trackedSkillAnswers * 100
      : null

  // 学習リズムは正答率ではなく、同じ時刻に学習を繰り返せているかで測る。
  const rhythmScore = analysis.rhythm.score
  const intervalAnswers = scoredTotal(analysis.intervals)

  const dimensions = [
    dimension({
      id: 'memory',
      label: '記憶の定着',
      score: memoryScore,
      evidence: analysis.learnedItems
        ? `${analysis.learnedItems}項目・${analysis.scored}回答`
        : analysis.scored
          ? `${analysis.scored}回答`
          : '復習データを収集中',
      note: '正誤・反復段階・時間間隔から推定',
      color: '#8b5cf6',
    }),
    dimension({
      id: 'testing',
      label: '問題対応',
      score: testingScore,
      evidence: diagnostic
        ? `診断${diagnostic.total}問・偏差値${diagnostic.deviation}`
        : trackedSkillAnswers
          ? `${analysis.skills.length}分野・${trackedSkillAnswers}回答`
          : '診断・クイズ結果を収集中',
      note: '教科テストへの対応であり、IQではありません',
      color: '#0ea5e9',
    }),
    dimension({
      id: 'consistency',
      label: '継続習慣',
      score: habit.score,
      evidence: habit.hasEvidence
        ? `直近7日 ${habit.activeDays7}日・連続${habit.streak}日`
        : '学習日を収集中',
      note: '短時間でも学習した日を評価',
      color: '#10b981',
    }),
    dimension({
      id: 'rhythm',
      label: '学習リズム',
      score: rhythmScore,
      evidence: analysis.rhythm.peakHour == null
        ? '学習した時刻を収集中'
        : `${analysis.rhythm.peakHour}時台・${analysis.rhythm.activeDays}日中${analysis.rhythm.peakDays}日`,
      note: '同じ時間帯に学習を繰り返せている割合',
      color: '#f59e0b',
    }),
  ]

  const primaryEvidence = memoryScore != null || testingScore != null
  const scoredDimensions = primaryEvidence
    ? dimensions.filter((item) => item.score != null)
    : []
  const totalWeight = scoredDimensions.reduce(
    (sum, item) => sum + DIMENSION_WEIGHTS[item.id],
    0,
  )
  const score = totalWeight
    ? rounded(scoredDimensions.reduce(
        (sum, item) => sum + item.score * DIMENSION_WEIGHTS[item.id],
        0,
      ) / totalWeight)
    : null

  const confidence = analysis.scored >= 100
    && habit.activeDays28 >= 7
    && (diagnostic || analysis.skills.length >= 2)
    ? 'stable'
    : analysis.scored >= 30 && habit.activeDays28 >= 3
      ? 'growing'
      : primaryEvidence
        ? 'starting'
        : 'empty'

  const recommendation = recommendationFor({
    analysis,
    dimensions,
    diagnostic,
    habit,
    dueCount: Math.max(0, Number(dueCount) || 0),
    now,
  })

  return {
    score,
    confidence,
    dimensions,
    analysis,
    diagnostic,
    habit,
    intervalAnswers,
    recommendation,
    isEstimate: true,
  }
}

export { DIMENSION_WEIGHTS, SKILL_ROUTES, formatWindow, hourIsInWindow }
