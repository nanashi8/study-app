import { vocabFieldFor } from '../data/vocab.js'
import {
  learningStatusForSrsEntry,
  quizStatusForSrsEntry,
} from './contentProgress.js'
import { vocabularyReviewMetrics } from './vocabScheduler.js'

export const VOCAB_CATALOG_SORT_OPTIONS = Object.freeze([
  { id: 'weight', label: '確認のおすすめ順' },
  { id: 'memoryAt', label: '最終学習日' },
  { id: 'testAt', label: '最終テスト日' },
  { id: 'field', label: '分野' },
])

export const VOCAB_CATALOG_ACTIVITY_OPTIONS = Object.freeze([
  { id: 'memory', label: '学習した語彙' },
  { id: 'test', label: 'テストした語彙' },
])

export const VOCAB_CATALOG_DEFAULT_DIRECTIONS = Object.freeze({
  weight: 'desc',
  memoryAt: 'desc',
  testAt: 'desc',
  field: 'asc',
})

const WORD_COLLATOR = new Intl.Collator('en', { sensitivity: 'base', numeric: true })
const FIELD_COLLATOR = new Intl.Collator('ja', { sensitivity: 'base', numeric: true })

const activityTimestamp = (entry, activity) => (
  Number.isFinite(entry?.[activity]?.lastAt) ? entry[activity].lastAt : null
)

const reviewWeightFromMetrics = (metrics) => {
  if (metrics.learningStatus === 'unlearned') return 0

  // 数値自体は学習者へ見せない。復習が必要な語を大きく分けたうえで、
  // 直近の失敗、復習日の到来、現在の定着度を使って級内の順番だけを決める。
  return 20
    + (metrics.needsReview ? 200 : 0)
    + (metrics.reason === 'recent-failure' ? 100 : 0)
    + (metrics.due ? 30 : 0)
    + (100 - metrics.score)
}

export function vocabularyReviewWeight(entry, options = {}) {
  return reviewWeightFromMetrics(vocabularyReviewMetrics(entry, options))
}

export function vocabularyCatalogPriority(metrics) {
  if (metrics.learningStatus === 'unlearned') return 'unlearned'
  if (metrics.reason === 'recent-failure') return 'retry'
  if (metrics.needsReview) return 'due'
  return 'waiting'
}

function compareNullableNumber(a, b, direction) {
  const hasA = Number.isFinite(a)
  const hasB = Number.isFinite(b)
  // 記録のない語は、新旧どちらの向きでも日付のある語の後ろへ置く。
  if (hasA !== hasB) return hasA ? -1 : 1
  if (!hasA) return 0
  return direction === 'asc' ? a - b : b - a
}

/**
 * 級内の全語を、表示・選択・復習に共通して使う一つの順序へ並べる。
 * 元の語彙配列と保存済みSRSは変更しない。
 */
export function vocabularyCatalogRows(
  words = [],
  srs = {},
  {
    sort = 'weight',
    direction = VOCAB_CATALOG_DEFAULT_DIRECTIONS[sort] ?? 'desc',
    now = Date.now(),
    day,
  } = {},
) {
  const normalizedSort = VOCAB_CATALOG_SORT_OPTIONS.some((option) => option.id === sort)
    ? sort
    : 'weight'
  const normalizedDirection = direction === 'asc' ? 'asc' : 'desc'
  const metricOptions = day === undefined ? { now } : { now, day }
  const rows = (Array.isArray(words) ? words : []).map((word) => {
    const entry = srs?.[word.id]
    const metrics = vocabularyReviewMetrics(entry, metricOptions)
    return {
      word,
      entry,
      field: vocabFieldFor(word),
      memoryAt: activityTimestamp(entry, 'memory'),
      testAt: activityTimestamp(entry, 'test'),
      memoryStatus: learningStatusForSrsEntry(entry),
      testStatus: quizStatusForSrsEntry(entry),
      weight: reviewWeightFromMetrics(metrics),
      priority: vocabularyCatalogPriority(metrics),
      metrics,
    }
  })

  return rows.sort((a, b) => {
    let compared = 0
    if (normalizedSort === 'memoryAt' || normalizedSort === 'testAt') {
      compared = compareNullableNumber(
        a[normalizedSort],
        b[normalizedSort],
        normalizedDirection,
      )
    } else if (normalizedSort === 'field') {
      compared = FIELD_COLLATOR.compare(a.field, b.field)
      if (normalizedDirection === 'desc') compared *= -1
    } else {
      compared = normalizedDirection === 'asc'
        ? a.weight - b.weight
        : b.weight - a.weight
    }

    return compared
      || WORD_COLLATOR.compare(a.word.word, b.word.word)
      || String(a.word.id).localeCompare(String(b.word.id))
  })
}

/**
 * 一覧確認では、級内の未着手語を混ぜず、その操作を一度でも行った語だけを出す。
 * 旧保存の学習記録は従来どおり箱から復元するが、旧形式では暗記とテストを
 * 区別できないため、根拠のないテスト結果は補わない。
 */
export function vocabularyCatalogActivityRows(
  words = [],
  srs = {},
  { activity = 'memory', ...options } = {},
) {
  return vocabularyCatalogRecordedRows(
    vocabularyCatalogRows(words, srs, options),
    activity,
  )
}

export function vocabularyCatalogRecordedRows(rows = [], activity = 'memory') {
  const normalizedActivity = activity === 'test' ? 'test' : 'memory'
  return (Array.isArray(rows) ? rows : []).filter((row) => (
    normalizedActivity === 'test'
      ? row.testStatus !== 'unanswered'
      : row.memoryStatus !== 'unlearned'
  ))
}

export function vocabularyCatalogRemainingRows(rows = [], dismissedIds = []) {
  const dismissed = dismissedIds instanceof Set
    ? dismissedIds
    : new Set(Array.isArray(dismissedIds) ? dismissedIds : [])
  return (Array.isArray(rows) ? rows : []).filter((row) => (
    !dismissed.has(row.word?.id ?? row.item?.id ?? row.id)
  ))
}

/**
 * 指を左へ動かす操作は肯定、右へ動かす操作は要再確認として記録する。
 */
export function vocabularyCatalogResultForDirection(activity, direction) {
  if (direction !== 'left' && direction !== 'right') return null
  if (activity === 'test') return direction === 'left' ? 'correct' : 'wrong'
  return direction === 'left' ? 'remembered' : 'forgot'
}
