const isRecord = (value) => (
  !!value && typeof value === 'object' && !Array.isArray(value)
)

const nonNegativeInteger = (value) => (
  Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0
)

const itemIdOf = (item) => (
  typeof item === 'string' ? item : item?.id
)

const uniqueItemIds = (items = []) => [
  ...new Set((Array.isArray(items) ? items : []).map(itemIdOf).filter(Boolean)),
]

export const LEARNING_STATUS_KEYS = Object.freeze([
  'learned',
  'reviewing',
  'unlearned',
])

export const QUIZ_STATUS_KEYS = Object.freeze([
  'correct',
  'incorrect',
  'unanswered',
])

export function learningStatusForSrsEntry(entry) {
  if (!isRecord(entry)) return 'unlearned'

  const judgment = entry.memory?.lastJudgment
  if (judgment === 'remembered') return 'learned'
  if (judgment === 'forgot') return 'reviewing'

  // 現行形式で memory があるのに自己判定が無い項目は、クイズだけを解いた項目。
  // クイズ結果を暗記済みへ混ぜず、学習側では未学習のままにする。
  if (isRecord(entry.memory)) return 'unlearned'

  // 旧版SRSは暗記とクイズの内訳を持たない。既存履歴を消えたように見せないため、
  // 長期箱だけを学習済、それ以外の既習項目を復習中として互換表示する。
  return nonNegativeInteger(entry.box) >= 4 ? 'learned' : 'reviewing'
}

export function quizStatusForSrsEntry(entry) {
  const result = entry?.test?.lastResult
  if (result === 'correct') return 'correct'
  if (result === 'wrong' || result === 'unknown') return 'incorrect'
  // 旧版の top-level correct/wrong は暗記判定とクイズが混在するため推測しない。
  return 'unanswered'
}

function emptySummary(total) {
  return {
    total,
    learning: { learned: 0, reviewing: 0, unlearned: 0 },
    quiz: { correct: 0, incorrect: 0, unanswered: 0 },
    activeIds: [],
  }
}

export function summarizeSrsItems(items = [], srs = {}) {
  const ids = uniqueItemIds(items)
  const summary = emptySummary(ids.length)
  const activeIds = []

  for (const id of ids) {
    const entry = isRecord(srs) ? srs[id] : null
    const learning = learningStatusForSrsEntry(entry)
    const quiz = quizStatusForSrsEntry(entry)
    summary.learning[learning] += 1
    summary.quiz[quiz] += 1
    if (learning !== 'unlearned' || quiz !== 'unanswered') activeIds.push(id)
  }

  return { ...summary, activeIds }
}

export function contentQuizKey(domain, itemId) {
  const safeDomain = String(domain ?? '').trim()
  const safeItemId = String(itemId ?? '').trim()
  return safeDomain && safeItemId ? `${safeDomain}:${safeItemId}` : ''
}

export function normalizeContentQuizResults(value) {
  if (!isRecord(value)) return {}
  return Object.fromEntries(Object.entries(value).flatMap(([key, result]) => {
    if (!key || !isRecord(result)) return []
    const total = nonNegativeInteger(result.total)
    if (total <= 0) return []
    const correct = Math.min(total, nonNegativeInteger(result.correct))
    const lastResult = result.lastResult === 'correct' && correct === total
      ? 'correct'
      : 'wrong'
    return [[key, {
      correct,
      total,
      lastResult,
      lastAt: Number.isFinite(result.lastAt) ? result.lastAt : null,
    }]]
  }))
}

export function recordContentQuizResult(
  current,
  { domain, itemId, correct, total, timestamp = Date.now() } = {},
) {
  const key = contentQuizKey(domain, itemId)
  const normalizedTotal = nonNegativeInteger(total)
  if (!key || normalizedTotal <= 0) return normalizeContentQuizResults(current)
  const normalizedCorrect = Math.min(normalizedTotal, nonNegativeInteger(correct))
  return {
    ...normalizeContentQuizResults(current),
    [key]: {
      correct: normalizedCorrect,
      total: normalizedTotal,
      lastResult: normalizedCorrect === normalizedTotal ? 'correct' : 'wrong',
      lastAt: Number.isFinite(timestamp) ? timestamp : Date.now(),
    },
  }
}

export function summarizeCompletionItems({
  items = [],
  completedIds = [],
  reviewingIds = [],
  quizResults = {},
  quizDomain,
} = {}) {
  const ids = uniqueItemIds(items)
  const completed = new Set(Array.isArray(completedIds) ? completedIds : [])
  const reviewing = new Set(Array.isArray(reviewingIds) ? reviewingIds : [])
  const normalizedQuiz = normalizeContentQuizResults(quizResults)
  const summary = emptySummary(ids.length)
  const activeIds = []

  for (const id of ids) {
    const learning = completed.has(id)
      ? 'learned'
      : reviewing.has(id)
        ? 'reviewing'
        : 'unlearned'
    const result = normalizedQuiz[contentQuizKey(quizDomain, id)]?.lastResult
    const quiz = result === 'correct'
      ? 'correct'
      : result === 'wrong'
        ? 'incorrect'
        : 'unanswered'
    summary.learning[learning] += 1
    summary.quiz[quiz] += 1
    if (learning !== 'unlearned' || quiz !== 'unanswered') activeIds.push(id)
  }

  return { ...summary, activeIds }
}

export function statusTotal(counts, keys) {
  return keys.reduce((sum, key) => sum + nonNegativeInteger(counts?.[key]), 0)
}
