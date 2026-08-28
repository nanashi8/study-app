import { VOCAB_FIELD_GROUPS, vocabFieldFor, vocabFieldGroupFor } from '../data/vocab.js'
import {
  learningStatusForSrsEntry,
  quizStatusForSrsEntry,
} from './contentProgress.js'
import { vocabularyReviewMetrics } from './vocabScheduler.js'

export const VOCAB_CATALOG_SORT_OPTIONS = Object.freeze([
  { id: 'weight', label: '確認のおすすめ順' },
  { id: 'memoryAt', label: '最終学習日' },
  { id: 'testAt', label: '最終テスト日' },
])

// 学習・テストの進み具合だけで一覧を絞る。並び替えでは分かりにくい
// 「まだ手を付けていない語」「つまずいた語」を、状態そのもので選べるようにする。
export const VOCAB_CATALOG_STATUS_FILTER_OPTIONS = Object.freeze([
  { id: 'all', label: 'すべて' },
  { id: 'memoryUnlearned', label: '学習前' },
  { id: 'memoryLearned', label: '覚えた' },
  { id: 'memoryReviewing', label: 'まだ' },
  { id: 'testUnanswered', label: 'テスト前' },
  { id: 'testCorrect', label: '正解' },
  { id: 'testIncorrect', label: '不正解' },
])

// 10分野は級をまたいで同じ並び。一覧では、その級に語がある分野だけを選べるようにする。
export const VOCAB_CATALOG_FIELD_FILTER_ALL = 'all'

export const VOCAB_CATALOG_ACTIVITY_OPTIONS = Object.freeze([
  { id: 'memory', label: '学習の一覧' },
  { id: 'test', label: 'テストの一覧' },
])

export const VOCAB_CATALOG_DEFAULT_DIRECTIONS = Object.freeze({
  weight: 'desc',
  memoryAt: 'desc',
  testAt: 'desc',
})

const WORD_COLLATOR = new Intl.Collator('en', { sensitivity: 'base', numeric: true })

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
      fieldId: vocabFieldGroupFor(word)?.id ?? null,
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
 * 一覧確認では、未記録の語も含めて全語を出す。
 * activity は呼び出し側の表示文脈として受け取るが、どちらの一覧でも母数は同じ。
 * 記録済み件数が必要な箇所では vocabularyCatalogRecordedRows を別に使う。
 */
export function vocabularyCatalogActivityRows(
  words = [],
  srs = {},
  options = {},
) {
  return vocabularyCatalogRows(words, srs, options)
}

export function vocabularyCatalogStatusRows(rows = [], status = 'all') {
  const list = Array.isArray(rows) ? rows : []
  if (status === 'memoryUnlearned') return list.filter((row) => row.memoryStatus === 'unlearned')
  if (status === 'memoryLearned') return list.filter((row) => row.memoryStatus === 'learned')
  if (status === 'memoryReviewing') return list.filter((row) => row.memoryStatus === 'reviewing')
  if (status === 'testUnanswered') return list.filter((row) => row.testStatus === 'unanswered')
  if (status === 'testCorrect') return list.filter((row) => row.testStatus === 'correct')
  if (status === 'testIncorrect') return list.filter((row) => row.testStatus === 'incorrect')
  return list
}

/**
 * 一覧に出ている語から、選べる分野だけを10分野の並び順で返す。
 * 語のない分野は選択肢に出さず、学習者が空の一覧に迷い込まないようにする。
 */
export function vocabularyCatalogFieldOptions(rows = []) {
  const list = Array.isArray(rows) ? rows : []
  const counts = new Map()
  for (const row of list) {
    if (!row?.fieldId) continue
    counts.set(row.fieldId, (counts.get(row.fieldId) ?? 0) + 1)
  }
  return [
    { id: VOCAB_CATALOG_FIELD_FILTER_ALL, label: 'すべての分野', emoji: '📚', count: list.length },
    ...VOCAB_FIELD_GROUPS
      .filter((group) => counts.has(group.id))
      .map((group) => ({
        id: group.id,
        label: group.label,
        emoji: group.emoji,
        count: counts.get(group.id),
      })),
  ]
}

export function vocabularyCatalogFieldRows(rows = [], fieldId = VOCAB_CATALOG_FIELD_FILTER_ALL) {
  const list = Array.isArray(rows) ? rows : []
  if (!fieldId || fieldId === VOCAB_CATALOG_FIELD_FILTER_ALL) return list
  return list.filter((row) => row.fieldId === fieldId)
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
