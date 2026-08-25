// 学習セッションの「デッキ」を組む。
// 通常セッションは復習を優先しつつ、新しい語・別の語も必ず混ぜる。
import {
  ALL_WORDS,
  wordsByField,
  wordsByLevel,
  wordsByPos,
  wordsByRoot,
  getWord,
  shuffle,
} from '../data/vocab.js'
import { phrasesByKind, phrasesByLevel, getPhrase } from '../data/phrases.js'
import { relatedIdiomForms } from '../data/idiom-form-families.js'
import { quizMeaningKey } from '../data/compact.js'
import { LEVELS } from '../data/levels.js'
import { LEVEL_ORDER, enemyLevelIndex, clampPos } from './adaptive.js'
import { todayIndex } from '../store/useStore.js'
import { vocabularyReviewMetrics } from './vocabScheduler.js'

export const SESSION_SIZE = 10

/**
 * 復習ショートカットの表示状態。
 * 未着手の 0 件と、学習後に復習をすべて終えた 0 件を区別する。
 */
export function reviewActionState({ seen = 0, due = 0 } = {}) {
  if (due > 0) return 'due'
  return seen > 0 ? 'complete' : 'empty'
}

/** 暗記セッションの回答を記録し、忘れた項目の ID だけを復習対象として残す。 */
export function recordStudyAnswer(results, itemId, remembered) {
  if (remembered) {
    return {
      ...results,
      remembered: results.remembered + 1,
    }
  }
  return {
    ...results,
    forgot: results.forgot + 1,
    forgotIds: [...results.forgotIds, itemId],
  }
}

// 適応バトルの出題プール：敵LV（その級）を主力に、ひとつ下の級から少量だけ
// 復習を混ぜる（土台を確認しつつ学習効率を上げる）。
function battlePool(levelIndex, rng = Math.random) {
  const idx = clampPos(Math.round(levelIndex))
  const main = wordsByLevel(LEVEL_ORDER[idx])
  if (idx === 0) return main
  const review = shuffle(wordsByLevel(LEVEL_ORDER[idx - 1]), rng).slice(0, 4)
  return [...main, ...review]
}

function dragonVeinWordPool(source = {}) {
  const byLevel = wordsByLevel(source.levelId)
  const fields = new Set(Array.isArray(source.fields) ? source.fields : [])
  if (!fields.size) return byLevel
  const focused = byLevel.filter((word) => fields.has(word.field))
  // 担当分野が少数でも100問へ到達できるよう、同じ級の語を後段へ補う。
  const focusedIds = new Set(focused.map((word) => word.id))
  return [...focused, ...byLevel.filter((word) => !focusedIds.has(word.id))]
}

export function wordsForSource(source = {}) {
  switch (source.type) {
    case 'all':
      return ALL_WORDS
    case 'field':
      return wordsByField(source.field)
    case 'pos':
      return wordsByPos(source.pos)
    case 'level':
      return wordsByLevel(source.levelId)
    case 'levelField':
      return wordsByField(source.field).filter((word) => word.level === source.levelId)
    case 'battle':
      return battlePool(source.levelIndex ?? enemyLevelIndex(source.pos ?? 0))
    case 'dragonVein':
      return dragonVeinWordPool(source)
    case 'root':
      return wordsByRoot(source.rootId)
    case 'mylist':
      return (source.ids ?? []).map(getWord).filter(Boolean)
    case 'deck':
      return (source.ids ?? []).map(getWord).filter(Boolean)
    case 'due':
      return ALL_WORDS
    case 'review':
      return ALL_WORDS
    case 'custom':
      return source.words ?? []
    default:
      return []
  }
}

function legacyRank(word, srs, day) {
  const e = srs[word.id]
  if (!e) return 1 // 未習
  if (e.due <= day) return 0 // 復習どき
  return 2 // まだ復習日前
}

// 旧来の固定配分を参照する保存済みテストとの互換値。実際の通常セッションは
// 下の適応プロファイルで新しい語・別の語を30〜60%に調整する。
export const AUTOMATIC_VOCAB_REVIEW_SHARE = 0.6

function vocabularyRank(word, srs, now, day) {
  const metrics = vocabularyReviewMetrics(srs[word.id], { now, day })
  if (metrics.needsReview && metrics.learningStatus === 'reviewing') return 0
  if (metrics.needsReview) return 1
  if (metrics.learningStatus === 'unlearned') return 2
  if (metrics.learningStatus === 'reviewing') return 3
  return 4
}

const AUTOMATIC_VOCAB_SOURCES = new Set([
  'all',
  'field',
  'pos',
  'level',
  'levelField',
])

export function isAutomaticVocabularySource(source = {}) {
  return AUTOMATIC_VOCAB_SOURCES.has(source.type)
}

// 通常セッションの新しい語・別の語の割合は固定しない。
// 復習の滞留量と直近の失敗率に応じて、広げる → 両立 → 定着優先へ移る。
// 数値はプロダクト上の説明可能な初期値で、学習科学上の普遍的な比率ではない。
export const AUTOMATIC_VOCAB_MIX_PROFILES = Object.freeze({
  expansion: Object.freeze({ freshShare: 0.6 }),
  balanced: Object.freeze({ freshShare: 0.4 }),
  support: Object.freeze({ freshShare: 0.3 }),
})

const RECENT_PERFORMANCE_DAYS = 7
const RECENT_PERFORMANCE_SAMPLE_SIZE = 10

function localDayForTimestamp(timestamp) {
  if (!Number.isFinite(timestamp)) return null
  return todayIndex(timestamp)
}

function latestOutcome(entry) {
  const memoryAt = Number(entry?.memory?.lastAt) || 0
  const testAt = Number(entry?.test?.lastAt) || 0
  if (memoryAt >= testAt && memoryAt > 0) return entry.memory?.lastJudgment ?? null
  if (testAt > 0) return entry.test?.lastResult ?? null
  return null
}

function failedToday(entry, day) {
  if (!entry) return false
  const outcome = latestOutcome(entry)
  const failed = ['forgot', 'wrong', 'unknown'].includes(outcome)
  if (!failed) return false
  const reviewedDay = Number.isFinite(entry.lastAt)
    ? localDayForTimestamp(entry.lastAt)
    : entry.last
  return reviewedDay === day
}

function recentPerformance(pool, srs, day, sampleSize) {
  const recent = pool
    .map((word) => ({ entry: srs[word.id], outcome: latestOutcome(srs[word.id]) }))
    .filter(({ entry, outcome }) => {
      if (!outcome || !Number.isFinite(entry?.lastAt)) return false
      const reviewedDay = localDayForTimestamp(entry.lastAt)
      return reviewedDay >= day - (RECENT_PERFORMANCE_DAYS - 1) && reviewedDay <= day
    })
    .sort((a, b) => b.entry.lastAt - a.entry.lastAt)
    .slice(0, sampleSize)
  const failures = recent.filter(({ outcome }) => (
    ['forgot', 'wrong', 'unknown'].includes(outcome)
  )).length
  return {
    attempts: recent.length,
    failures,
    failureRate: recent.length ? failures / recent.length : 0,
  }
}

function interleaveGroups(first, second) {
  const result = []
  const length = Math.max(first.length, second.length)
  for (let index = 0; index < length; index++) {
    if (first[index]) result.push(first[index])
    if (second[index]) result.push(second[index])
  }
  return result
}

// 7:3 や 6:4 でも片方が末尾に固まらないよう、比率を保って分散する。
function interleaveProportionally(first, second) {
  if (!first.length) return [...second]
  if (!second.length) return [...first]
  const result = []
  let firstIndex = 0
  let secondIndex = 0
  while (firstIndex < first.length || secondIndex < second.length) {
    if (firstIndex >= first.length) {
      result.push(second[secondIndex++])
    } else if (secondIndex >= second.length) {
      result.push(first[firstIndex++])
    } else if (firstIndex / first.length <= secondIndex / second.length) {
      result.push(first[firstIndex++])
    } else {
      result.push(second[secondIndex++])
    }
  }
  return result
}

function automaticVocabularyBuckets(pool, srs, day, purpose) {
  const due = pool.filter((word) => (
    Number.isFinite(srs[word.id]?.due) && srs[word.id].due <= day
  ))
  const failedSameDay = due.filter((word) => failedToday(srs[word.id], day))
  const failedSameDayIds = new Set(failedSameDay.map((word) => word.id))
  const spacedDue = due.filter((word) => !failedSameDayIds.has(word.id))
  // 同日失敗語と、間隔を空けた期限語を両方扱う。一方だけならそのまま使う。
  const review = interleaveGroups(failedSameDay, spacedDue)
  const unlearned = pool.filter((word) => !Number.isFinite(srs[word.id]?.due))
  const waiting = pool.filter((word) => (
    Number.isFinite(srs[word.id]?.due) && srs[word.id].due > day
  ))
  // 暗記は未学習語を先に、テストは学習済みの別の語を先にする。
  // 期限前の安定語は、優先側の在庫が足りないときだけ補充に使う。
  const variety = purpose === 'quiz'
    ? [...waiting, ...unlearned]
    : [...unlearned, ...waiting]
  return { due, failedSameDay, review, unlearned, waiting, variety }
}

/**
 * 通常の単語セッションの配分を説明可能な形で返す。
 * - 復習が軽い: 新しい語・別の語 60%
 * - 復習が中程度: 40%
 * - 復習滞留または直近失敗が多い: 30%
 * 在庫不足時は、残った側から自動で補う。
 */
export function automaticVocabSessionPlan(
  pool,
  {
    srs = {},
    day = todayIndex(),
    size = SESSION_SIZE,
    purpose = 'study',
  } = {},
) {
  const targetSize = Math.min(size, pool.length)
  if (!targetSize) {
    return {
      profile: 'expansion',
      freshShare: AUTOMATIC_VOCAB_MIX_PROFILES.expansion.freshShare,
      targetSize: 0,
      reviewCount: 0,
      varietyCount: 0,
      dueCount: 0,
      failedSameDayCount: 0,
      recentAttempts: 0,
      recentFailureRate: 0,
    }
  }

  const buckets = automaticVocabularyBuckets(pool, srs, day, purpose)
  const recent = recentPerformance(
    pool,
    srs,
    day,
    Math.min(RECENT_PERFORMANCE_SAMPLE_SIZE, Math.max(4, targetSize)),
  )
  const reliableRecentRate = recent.attempts >= 4
  const duePressure = buckets.due.length / targetSize
  const profile = (
    duePressure >= 1.5 || (reliableRecentRate && recent.failureRate >= 0.5)
  )
    ? 'support'
    : duePressure >= 0.5 || (reliableRecentRate && recent.failureRate >= 0.25)
      ? 'balanced'
      : 'expansion'
  const freshShare = AUTOMATIC_VOCAB_MIX_PROFILES[profile].freshShare
  const desiredVarietyCount = buckets.review.length
    ? Math.max(1, Math.round(targetSize * freshShare))
    : targetSize
  let varietyCount = Math.min(buckets.variety.length, desiredVarietyCount)
  let reviewCount = Math.min(buckets.review.length, targetSize - varietyCount)
  let remaining = targetSize - reviewCount - varietyCount
  if (remaining > 0) {
    const extraVariety = Math.min(remaining, buckets.variety.length - varietyCount)
    varietyCount += extraVariety
    remaining -= extraVariety
  }
  if (remaining > 0) {
    reviewCount += Math.min(remaining, buckets.review.length - reviewCount)
  }

  return {
    profile,
    freshShare,
    targetSize,
    reviewCount,
    varietyCount,
    dueCount: buckets.due.length,
    failedSameDayCount: buckets.failedSameDay.length,
    recentAttempts: recent.attempts,
    recentFailureRate: recent.failureRate,
  }
}

function unseenFirst(items, cycleIds) {
  if (!cycleIds.size) return items
  return [
    ...items.filter((item) => !cycleIds.has(item.id)),
    ...items.filter((item) => cycleIds.has(item.id)),
  ]
}

function balancedAutomaticDeck(pool, srs, day, size, purpose, completedIds = []) {
  const buckets = automaticVocabularyBuckets(pool, srs, day, purpose)
  const plan = automaticVocabSessionPlan(pool, { srs, day, size, purpose })
  const cycleIds = new Set(Array.isArray(completedIds) ? completedIds : [])
  const orderedReview = unseenFirst(buckets.review, cycleIds)
  const availableVariety = cycleIds.size
    ? buckets.variety.filter((item) => !cycleIds.has(item.id))
    : buckets.variety
  const selectedReview = orderedReview.slice(0, plan.reviewCount)
  const selectedVariety = availableVariety.slice(0, plan.varietyCount)
  let remaining = plan.targetSize - selectedReview.length - selectedVariety.length

  // 未出の別語が足りない場合だけ、復習が必要な語で設定数へ近づける。
  // 期限前の安定語や単なる既出語を、数合わせのために繰り返すことはしない。
  if (remaining > 0) {
    const selectedReviewIds = new Set(selectedReview.map((item) => item.id))
    const extraReview = orderedReview
      .filter((item) => !selectedReviewIds.has(item.id))
      .slice(0, remaining)
    selectedReview.push(...extraReview)
    remaining -= extraReview.length
  }

  return interleaveProportionally(selectedReview, selectedVariety)
}

/** source からセッション用の単語配列を作る。 */
export function buildDeck(
  source,
  {
    srs = {},
    size = SESSION_SIZE,
    purpose = 'study',
    excludeIds = [],
    cycleIds = [],
    now = Date.now(),
    day = todayIndex(now),
  } = {},
) {
  // 一覧で明示的に選んだ語は、学習者が並べ替えた順をそのまま使う。
  // 通常の級・分野学習はこれまでどおりシャッフルと復習優先順位を適用する。
  const preserveSourceOrder = source.type === 'deck' && source.preserveOrder === true
  let pool = preserveSourceOrder
    ? wordsForSource(source)
    : shuffle(wordsForSource(source))
  // 「次へ進む」で連続セッションを作るときは、同じ周回ですでに終えた語を
  // 候補から外す。明示的な「復習する」は別の source で起動するため、
  // 苦手語を意図して学び直す動線までは抑止しない。
  const excluded = new Set(Array.isArray(excludeIds) ? excludeIds : [])
  if (excluded.size) {
    pool = pool.filter((word) => !excluded.has(word.id))
  }
  // 通常学習は学習状況に応じて既出の苦手語も必要数だけ戻す。それ以外の
  // 明示セットは、同じ周回の未出語を一巡してから終了する。
  const completed = new Set(Array.isArray(cycleIds) ? cycleIds : [])
  if (completed.size && !isAutomaticVocabularySource(source)) {
    pool = pool.filter((word) => !completed.has(word.id))
  }
  if (source.type === 'due') {
    pool = pool.filter((word) => (
      vocabularyReviewMetrics(srs[word.id], { now, day }).needsReview
    ))
  }
  if (source.type === 'review') {
    // 復習日前でも学習済みの語だけを確認できる。
    // 未着手語を「先取り復習」に混ぜない。
    pool = pool.filter((word) => (
      vocabularyReviewMetrics(srs[word.id], { now, day }).learningStatus !== 'unlearned'
    ))
  }
  if (purpose === 'study' && isAutomaticVocabularySource(source)) {
    pool = pool.filter((word) => (
      vocabularyReviewMetrics(srs[word.id], { now, day }).shouldAutoAppear
    ))
  }
  if (!preserveSourceOrder) {
    pool.sort((a, b) => {
      if (source.type === 'review') {
        const dueDifference = (srs[a.id]?.due ?? Infinity) - (srs[b.id]?.due ?? Infinity)
        if (dueDifference !== 0) return dueDifference
      }
      const ra = vocabularyRank(a, srs, now, day)
      const rb = vocabularyRank(b, srs, now, day)
      if (ra !== rb) return ra - rb
      const aScore = vocabularyReviewMetrics(srs[a.id], { now, day }).score
      const bScore = vocabularyReviewMetrics(srs[b.id], { now, day }).score
      if (aScore !== bScore) return aScore - bScore
      const ba = srs[a.id]?.box ?? 0
      const bb = srs[b.id]?.box ?? 0
      return ba - bb // box が低い（苦手）ほど先
    })
  }
  if (size && isAutomaticVocabularySource(source)) {
    pool = balancedAutomaticDeck(pool, srs, day, size, purpose, cycleIds)
  }
  return size ? pool.slice(0, size) : pool
}

/**
 * 途中で問題数を増やすとき、いま解いた分（既存デッキの先頭 keepCount 件）は
 * そのまま残し、足りない分だけ新しいデッキから重複しないよう補って埋める。
 */
export function growDeck(existingDeck, keepCount, freshDeck, targetSize) {
  const kept = existingDeck.slice(0, Math.min(keepCount, existingDeck.length))
  const keptIds = new Set(kept.map((item) => item.id))
  const fresh = freshDeck.filter((item) => !keptIds.has(item.id))
  return [...kept, ...fresh].slice(0, targetSize)
}

/** 級ごとの進捗集計（既習・習得・期限切れ件数）。 */
export function levelProgress(levelId, srs) {
  return wordProgress(wordsByLevel(levelId), srs)
}

/** 任意の単語集合について、既習・習得・復習どき件数を集計する。 */
export function wordProgress(words, srs = {}) {
  const now = Date.now()
  const day = todayIndex(now)
  let seen = 0
  let mastered = 0
  let due = 0
  let ready = 0
  for (const w of words) {
    const e = srs[w.id]
    const metrics = vocabularyReviewMetrics(e, { now, day })
    if (metrics.shouldAutoAppear) ready++
    if (metrics.learningStatus === 'unlearned') continue
    seen++
    if (e?.box >= 4) mastered++
    if (metrics.needsReview) due++
  }
  return { total: words.length, seen, mastered, due, ready }
}

// ── 弱点ナビ：下の級（＝前提）が足を引っ張っていないか検知する ──
// 英検は 5級→1級 が学習の土台。上の級に進んでいるのに、下の級の定着が弱い
// （習得率が低い／復習がたまっている）なら、その級を「先に固めるべき前提」として返す。
// 返り値: { level, progress, masteredPct, reason:'due'|'mastery' } または null。
export function weakFoundationLevel(srs) {
  const stats = LEVELS.map((lv) => ({ lv, p: levelProgress(lv.id, srs) }))
  // いちばん上の「着手済み」級のインデックス。
  let highestActive = -1
  stats.forEach((s, i) => {
    if (s.p.seen > 0) highestActive = Math.max(highestActive, i)
  })
  if (highestActive <= 0) return null // 下に級がない＝判定不要

  for (let i = 0; i < highestActive; i++) {
    const { lv, p } = stats[i]
    if (p.seen < 3) continue // データが少なすぎる級は対象外
    const masteredPct = p.total ? p.mastered / p.total : 0
    if (p.due >= 3) return { level: lv, progress: p, masteredPct, reason: 'due' }
    if (masteredPct < 0.6) return { level: lv, progress: p, masteredPct, reason: 'mastery' }
  }
  return null
}

// ── 熟語・構文（phrase）。SRS は単語と同じ srs を id で共用 ──
function phraseCandidates(source) {
  if (source.type === 'phraseList') return (source.ids ?? []).map(getPhrase).filter(Boolean)
  if (source.type === 'customPhrase') return source.items ?? []
  if (source.type === 'dragonVeinPhrase') {
    return [
      ...phrasesByLevel('idiom', source.levelId),
      ...phrasesByLevel('syntax', source.levelId),
    ]
  }
  if (source.levelId) return phrasesByLevel(source.kind, source.levelId)
  return phrasesByKind(source.kind)
}

export function buildPhraseDeck(source, { srs = {}, size = SESSION_SIZE } = {}) {
  const day = todayIndex()
  let pool = phraseCandidates(source)
  if (source.type === 'phraseList' && source.preserveOrder) {
    return size ? pool.slice(0, size) : pool
  }
  pool = shuffle(pool)
  if (source.type === 'phraseDue') {
    pool = pool.filter((p) => srs[p.id] && srs[p.id].due <= day)
  }
  pool.sort((a, b) => {
    const ra = legacyRank(a, srs, day)
    const rb = legacyRank(b, srs, day)
    if (ra !== rb) return ra - rb
    return (srs[a.id]?.box ?? 0) - (srs[b.id]?.box ?? 0)
  })
  if (source.type === 'dragonVeinPhrase' && Number.isFinite(size) && size && pool.length > 0 && pool.length < size) {
    const original = [...pool]
    while (pool.length < size) pool.push(original[pool.length % original.length])
  }
  return size ? pool.slice(0, size) : pool
}

export function pickPhraseDistractors(phrase, count, rng = Math.random) {
  const candidates = phrasesByKind(phrase.kind).filter((item) => item.id !== phrase.id)
  const tiers = [
    phrase.kind === 'idiom' ? relatedIdiomForms(phrase, 12) : [],
    candidates.filter((item) =>
      item.level === phrase.level && item.category === phrase.category),
    candidates.filter((item) => item.level === phrase.level),
    candidates.filter((item) => item.category === phrase.category),
    candidates,
  ]
  const seenIds = new Set([phrase.id])
  const picked = []
  const used = new Set([quizMeaningKey(phrase)])
  for (const tier of tiers) {
    for (const item of shuffle(tier, rng)) {
      if (seenIds.has(item.id)) continue
      seenIds.add(item.id)
      const meaningKey = quizMeaningKey(item)
      if (!meaningKey || used.has(meaningKey)) continue
      used.add(meaningKey)
      picked.push(item)
      if (picked.length >= count) return picked
    }
  }
  return picked
}

export function phraseKindProgress(kind, srs) {
  const day = todayIndex()
  const items = phrasesByKind(kind)
  let seen = 0
  let mastered = 0
  let due = 0
  for (const p of items) {
    const e = srs[p.id]
    if (!e) continue
    seen++
    if (e.box >= 4) mastered++
    if (e.due <= day) due++
  }
  return { total: items.length, seen, mastered, due }
}

// ── 適応バトル：これまでの習得状況から初期ポジションを推定する ──
// 各級の習得率を下から見て、概ね習得(>=50%)できている最上位級の「少し上」を
// 初期ポジションにする。まだ何もしていなければ 5級(0)から。
export function suggestStartPosition(srs) {
  let pos = 0
  LEVEL_ORDER.forEach((id, i) => {
    const p = levelProgress(id, srs)
    const masteredPct = p.total ? p.mastered / p.total : 0
    if (masteredPct >= 0.5) pos = Math.min(LEVEL_ORDER.length - 1, i + 0.5)
    else if (p.seen > 0) pos = Math.max(pos, i)
  })
  return clampPos(pos)
}

/** 全体の習得数・期限切れ数。 */
export function overallProgress(srs) {
  const now = Date.now()
  const day = todayIndex(now)
  // 文法・熟語も同じ SRS 名前空間を使うため、英単語だけを明示的に数える。
  // Object.keys(srs) を数えるとホームの「N語」と単語復習デッキが食い違う。
  let mastered = 0
  let due = 0
  let seen = 0
  for (const word of ALL_WORDS) {
    const entry = srs[word.id]
    const metrics = vocabularyReviewMetrics(entry, { now, day })
    if (metrics.learningStatus === 'unlearned') continue
    seen++
    if (entry?.box >= 4) mastered++
    if (metrics.needsReview) due++
  }
  return { seen, mastered, due, total: ALL_WORDS.length }
}

/** 学習済み英単語のうち、最も近い次回復習までの日数。 */
export function nextVocabularyReviewInDays(srs = {}, day = todayIndex()) {
  let nextDue = null
  for (const word of ALL_WORDS) {
    const due = srs[word.id]?.due
    if (!Number.isFinite(due)) continue
    nextDue = nextDue == null ? due : Math.min(nextDue, due)
  }
  return nextDue == null ? null : Math.max(0, Math.floor(nextDue - day))
}
