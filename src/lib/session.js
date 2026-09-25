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
import { quizMeaning, quizMeaningKey } from '../data/compact.js'
import { LEVELS } from '../data/levels.js'
import { LEVEL_ORDER, enemyLevelIndex, clampPos } from './adaptive.js'
import { todayIndex } from '../store/useStore.js'
import { hasVocabularyReviewEvidence, vocabularyReviewMetrics } from './vocabScheduler.js'
import {
  STUDY_ORDER_STAGE,
  compareStudyOrderKeys,
  orderForStudy,
  studyOrderKey,
} from './studyOrder.js'

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

/**
 * 前へ戻って「覚えた／まだ」を選び直したとき、その1枚の集計だけを入れ替える（二重に数えない）。
 * wasRemembered は最初の答え、remembered は選び直した答え。
 */
export function reviseStudyAnswer(results, itemId, wasRemembered, remembered) {
  if (Boolean(wasRemembered) === Boolean(remembered)) return results
  const forgotIds = [...(results.forgotIds ?? [])]
  if (remembered) {
    const at = forgotIds.lastIndexOf(itemId)
    if (at >= 0) forgotIds.splice(at, 1)
  } else {
    forgotIds.push(itemId)
  }
  return {
    ...results,
    remembered: Math.max(0, (results.remembered ?? 0) + (remembered ? 1 : -1)),
    forgot: Math.max(0, (results.forgot ?? 0) + (remembered ? -1 : 1)),
    forgotIds,
  }
}

/**
 * 前へ戻ってテストの答えを選び直したとき、その1問の集計だけを入れ替える（二重に数えない）。
 * previous・next は 'correct' | 'wrong' | 'unknown'。wrongIds（間違えた問題）と
 * answerLog（答えた順の結果）も持っていれば入れ替える。logIndex はその問題を最初に答えた位置。
 */
export function reviseQuizTally(results, itemId, previous, next, logIndex = null) {
  if (!previous || !next || previous === next) return results
  if (Number.isFinite(results[previous])) results[previous] = Math.max(0, results[previous] - 1)
  results[next] = (Number.isFinite(results[next]) ? results[next] : 0) + 1
  if (Array.isArray(results.wrongIds)) {
    const wasWrong = previous !== 'correct'
    const isWrong = next !== 'correct'
    if (wasWrong && !isWrong) {
      const at = results.wrongIds.lastIndexOf(itemId)
      if (at >= 0) results.wrongIds.splice(at, 1)
    } else if (!wasWrong && isWrong) {
      results.wrongIds.push(itemId)
    }
  }
  if (
    Array.isArray(results.answerLog)
    && Number.isInteger(logIndex)
    && logIndex >= 0
    && logIndex < results.answerLog.length
  ) {
    results.answerLog[logIndex] = next
  }
  return results
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
      return wordsByLevel(source.levelId)
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

// 旧来の固定配分を参照する保存済みテストとの互換値。実際の通常セッションは
// 下の適応プロファイルで新しい語・別の語を30〜60%に調整する。
export const AUTOMATIC_VOCAB_REVIEW_SHARE = 0.6

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

// 出題バランスの両端（「復習だけ」「未修だけ」）は、足りなくてももう一方の語で数を埋めない。
// 途中の段（復習寄り・半々・未修寄り）と自動は、在庫の足りない側をもう一方で補う。
function vocabMixSides(freshShareOverride) {
  if (!Number.isFinite(freshShareOverride)) return { review: true, fresh: true }
  return { review: freshShareOverride < 1, fresh: freshShareOverride > 0 }
}

// 出題バランスを手で指定したときに分ける3つの在庫。
//   fresh  未修…暗記もテストも記録のない語
//   missed まだ・不正解…直近の答えが「まだ」「不正解」「わからない」の語（苦手な語）
//   known  覚えた・正解…記録があり、直近の答えが「覚えた」「正解」の語
function vocabMixGroupOf(entry) {
  if (!hasVocabularyReviewEvidence(entry)) return 'fresh'
  return ['forgot', 'wrong', 'unknown'].includes(latestOutcome(entry)) ? 'missed' : 'known'
}

/**
 * 出題バランスを手で指定したときの「復習」と「未修」の枠。ordered は出題順（studyOrder.js）に並べた語。
 * 復習の枠は まだ・不正解 の語から、未修の枠は未修の語から出し、どちらも足りない分は 覚えた・正解 の語で埋める。
 *   復習の枠 … まだ・不正解 を出し切ってから、覚えた・正解 を点数の低い順（忘れかけている順）に。
 *              復習寄りほど、連続で覚えた・正解した語の出る数が減る。
 *   未修の枠 … 未修を出し切ってから、残りの 覚えた・正解 を出題順（復習日が来た語から）に。
 * 途中の段は、それでも足りない枠をもう一方の在庫で補う。「未修だけ」は まだ・不正解 を、
 * 「復習だけ」は未修の語を出さない。size が 0 なら、出せる語をすべて同じ割合で並べる。
 * 点数は now・day の時点で、一覧の「復習のおすすめ順」と同じもの（vocabularyReviewMetrics の score）。
 */
function manualVocabMixShares(
  ordered,
  srs,
  { size = 0, freshShare, cycleIds = [], now = Date.now(), day = todayIndex(now) } = {},
) {
  const share = Math.min(1, Math.max(0, freshShare))
  const sides = vocabMixSides(share)
  const cycle = new Set(Array.isArray(cycleIds) ? cycleIds : [])
  const groups = { fresh: [], missed: [], known: [] }
  for (const word of ordered) groups[vocabMixGroupOf(srs[word.id])].push(word)
  // 同じ周回で出し終えた語は、未修・覚えた・正解 からは外し、まだ・不正解 では最後に回す。
  const fresh = sides.fresh ? groups.fresh.filter((word) => !cycle.has(word.id)) : []
  const missed = sides.review ? unseenFirst(groups.missed, cycle) : []
  const known = groups.known.filter((word) => !cycle.has(word.id))
  const available = fresh.length + missed.length + known.length
  const target = size > 0 ? Math.min(size, available) : available
  const freshTarget = Math.round(target * share)
  const reviewTarget = target - freshTarget

  const freshPicked = fresh.slice(0, freshTarget)
  const reviewPicked = missed.slice(0, reviewTarget)
  // 復習の枠が先に、点数の低い 覚えた・正解 を取る。同じ点数なら出題順のまま（sort は安定）。
  const scoreOf = new Map(known.map((word) => [
    word.id,
    vocabularyReviewMetrics(srs[word.id], { now, day }).score,
  ]))
  const byScore = [...known].sort((a, b) => scoreOf.get(a.id) - scoreOf.get(b.id))
  const usedKnown = new Set()
  for (const word of byScore) {
    if (reviewPicked.length >= reviewTarget) break
    reviewPicked.push(word)
    usedKnown.add(word.id)
  }
  for (const word of known) {
    if (freshPicked.length >= freshTarget) break
    if (usedKnown.has(word.id)) continue
    freshPicked.push(word)
  }
  const spareFresh = fresh.slice(Math.min(fresh.length, freshTarget))
  const spareMissed = missed.slice(Math.min(missed.length, reviewTarget))
  while (freshPicked.length < freshTarget && spareMissed.length) freshPicked.push(spareMissed.shift())
  while (reviewPicked.length < reviewTarget && spareFresh.length) reviewPicked.push(spareFresh.shift())
  return { review: reviewPicked, fresh: freshPicked }
}

// day だけを渡されたときの基準時刻（その日の正午）。定着の見込みは時刻で、復習日は日で見るので、2つをそろえる。
function timestampForDay(day) {
  const noon = day * 86_400_000 + 12 * 3_600_000
  return noon + new Date(noon).getTimezoneOffset() * 60_000
}

function automaticVocabularyBuckets(pool, srs, day, purpose, now = timestampForDay(day)) {
  const stageOf = new Map(pool.map((word) => [
    word.id,
    studyOrderKey(srs[word.id], { purpose, now, day }).stage,
  ]))
  const hasDue = (word) => Number.isFinite(srs[word.id]?.due)
  // 何度もまちがえている語（苦手）は、復習の枠のいちばん先に置く。
  const struggling = pool.filter((word) => stageOf.get(word.id) === STUDY_ORDER_STAGE.struggling)
  // 復習日が来ている語と、復習日の前でも復習の段に入った語（忘れかけの語）。
  const scheduled = pool.filter((word) => (
    stageOf.get(word.id) !== STUDY_ORDER_STAGE.struggling
    && ((hasDue(word) && srs[word.id].due <= day) || stageOf.get(word.id) === STUDY_ORDER_STAGE.review)
  ))
  const due = [...struggling, ...scheduled]
  const failedSameDay = due.filter((word) => failedToday(srs[word.id], day))
  const failedSameDayIds = new Set(failedSameDay.map((word) => word.id))
  const spacedDue = scheduled.filter((word) => !failedSameDayIds.has(word.id))
  // 苦手の語を先に出し切り、そのあと同日失敗語と、間隔を空けた期限語を両方扱う。一方だけならそのまま使う。
  const review = [
    ...struggling,
    ...interleaveGroups(
      scheduled.filter((word) => failedSameDayIds.has(word.id)),
      spacedDue,
    ),
  ]
  const dueIds = new Set(due.map((word) => word.id))
  const unlearned = pool.filter((word) => !dueIds.has(word.id) && !hasDue(word))
  const waiting = pool.filter((word) => !dueIds.has(word.id) && hasDue(word))
  // 暗記は未学習語を先に、テストは学習済みの別の語を先にする。
  // 期限前の安定語は、優先側の在庫が足りないときだけ補充に使う。
  const variety = purpose === 'quiz'
    ? [...waiting, ...unlearned]
    : [...unlearned, ...waiting]
  return { due, struggling, failedSameDay, review, unlearned, waiting, variety }
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
    freshShareOverride = null,
    now = timestampForDay(day),
  } = {},
) {
  // 学習者が下部のバーで割合を指定した日は、その割合をそのまま使う。
  const manualShare = Number.isFinite(freshShareOverride)
    ? Math.min(1, Math.max(0, freshShareOverride))
    : null
  const targetSize = Math.min(size, pool.length)
  if (!targetSize) {
    return {
      profile: manualShare === null ? 'expansion' : 'manual',
      freshShare: manualShare ?? AUTOMATIC_VOCAB_MIX_PROFILES.expansion.freshShare,
      targetSize: 0,
      reviewCount: 0,
      varietyCount: 0,
      dueCount: 0,
      failedSameDayCount: 0,
      recentAttempts: 0,
      recentFailureRate: 0,
    }
  }

  const buckets = automaticVocabularyBuckets(pool, srs, day, purpose, now)
  const recent = recentPerformance(
    pool,
    srs,
    day,
    Math.min(RECENT_PERFORMANCE_SAMPLE_SIZE, Math.max(4, targetSize)),
  )
  if (manualShare !== null) {
    // 手で指定した割合は、buildDeck と同じ枠の組み方（manualVocabMixShares）で数える。
    const shares = manualVocabMixShares(pool, srs, { size, freshShare: manualShare, now, day })
    return {
      profile: 'manual',
      freshShare: manualShare,
      targetSize: shares.review.length + shares.fresh.length,
      reviewCount: shares.review.length,
      varietyCount: shares.fresh.length,
      dueCount: buckets.due.length,
      failedSameDayCount: buckets.failedSameDay.length,
      recentAttempts: recent.attempts,
      recentFailureRate: recent.failureRate,
    }
  }
  const reliableRecentRate = recent.attempts >= 4
  const duePressure = buckets.due.length / targetSize
  const autoProfile = (
    duePressure >= 1.5 || (reliableRecentRate && recent.failureRate >= 0.5)
  )
    ? 'support'
    : duePressure >= 0.5 || (reliableRecentRate && recent.failureRate >= 0.25)
      ? 'balanced'
      : 'expansion'
  const profile = autoProfile
  const freshShare = AUTOMATIC_VOCAB_MIX_PROFILES[autoProfile].freshShare
  // 自動配分は「新しい語を必ず1語は混ぜる」。
  const desiredVarietyCount = buckets.review.length
    ? Math.max(1, Math.round(targetSize * freshShare))
    : targetSize
  let varietyCount = Math.min(buckets.variety.length, desiredVarietyCount)
  let reviewCount = Math.min(buckets.review.length, targetSize - varietyCount)
  let remaining = targetSize - reviewCount - varietyCount
  // 足りない側はもう一方で補う。
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

function balancedAutomaticDeck(
  pool,
  srs,
  day,
  size,
  purpose,
  completedIds = [],
  now = timestampForDay(day),
) {
  const plan = automaticVocabSessionPlan(pool, { srs, day, size, purpose, now })
  const buckets = automaticVocabularyBuckets(pool, srs, day, purpose, now)
  const cycleIds = new Set(Array.isArray(completedIds) ? completedIds : [])
  const orderedReview = unseenFirst(buckets.review, cycleIds)
  const availableVariety = cycleIds.size
    ? buckets.variety.filter((item) => !cycleIds.has(item.id))
    : buckets.variety
  const selectedReview = orderedReview.slice(0, plan.reviewCount)
  const selectedVariety = availableVariety.slice(0, plan.varietyCount)
  let remaining = plan.targetSize - selectedReview.length - selectedVariety.length
  const strugglingIds = new Set(buckets.struggling.map((word) => word.id))

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

  // 何度もまちがえている語は、新しい語・別の語と混ぜる前に、いちばん先へまとめて出す。
  return [
    ...selectedReview.filter((word) => strugglingIds.has(word.id)),
    ...interleaveProportionally(
      selectedReview.filter((word) => !strugglingIds.has(word.id)),
      selectedVariety,
    ),
  ]
}

/**
 * source と学習状況から、そのセッションで使える語を集める（並べ替えはしない）。
 * 「1回のカード数」で選べる在庫と、実際に組むデッキで同じ絞り込みを使うための唯一の口。
 */
function sessionPool(
  source,
  { srs = {}, purpose = 'study', excludeIds = [], cycleIds = [], now = Date.now(), day = todayIndex(now) } = {},
) {
  let pool = wordsForSource(source)
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
    // 復習日前でも、一度学んだ語だけを確認できる。暗記の自己判定がまだでも
    // テストを解いた語は含め、まだ触れていない語は「先取り復習」に混ぜない。
    pool = pool.filter((word) => hasVocabularyReviewEvidence(srs[word.id]))
  }
  return pool
}

/**
 * 「1回のカード数」で選べる上限＝その教材の在庫。
 * 今日の候補が少ない日でも、枚数の選択肢が 5〜200 のまま変わらないようにする。
 */
export function vocabularyStockCount(source, options = {}) {
  return sessionPool(source, options).length
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
    freshShareOverride = null,
    now = Date.now(),
    day = todayIndex(now),
  } = {},
) {
  // 一覧で明示的に選んだ語は、学習者が並べ替えた順をそのまま使う。
  const stock = sessionPool(source, { srs, purpose, excludeIds, cycleIds, now, day })
  if (source.type === 'deck' && source.preserveOrder === true) {
    return size ? stock.slice(0, size) : stock
  }
  // それ以外は全教材共通の出題順（studyOrder.js）：何度もまちがえている語 → 今日の候補（復習する語・未学習／未回答の語）
  // → 今日1回「まだ」「不正解」になった語 → 何度も・続けて覚えた・正解した語の確認 → そのほか。
  // 同じ段の中は点数の低い順。
  const keys = new Map(stock.map((word) => [
    word.id,
    studyOrderKey(srs[word.id], { purpose, now, day }),
  ]))
  const isStruggling = (word) => keys.get(word.id).stage === STUDY_ORDER_STAGE.struggling
  const pool = shuffle(stock).sort((a, b) => {
    if (source.type === 'review') {
      // 先取り復習は次の復習日が近い順。ただし何度もまちがえている語はその前に出す。
      const strugglingDifference = Number(isStruggling(b)) - Number(isStruggling(a))
      if (strugglingDifference !== 0) return strugglingDifference
      const dueDifference = (srs[a.id]?.due ?? Infinity) - (srs[b.id]?.due ?? Infinity)
      if (dueDifference !== 0) return dueDifference
    }
    return compareStudyOrderKeys(keys.get(a.id), keys.get(b.id))
  })
  if (!isAutomaticVocabularySource(source)) return size ? pool.slice(0, size) : pool

  // 出題バランスを手で指定したときは、その割合で「復習」と「未修」の枠を組む（manualVocabMixShares）。
  // size が 0（数えるとき・全部を選んだとき）も、同じ割合で出せる語をすべて並べる。
  if (Number.isFinite(freshShareOverride)) {
    const shares = manualVocabMixShares(pool, srs, {
      size, freshShare: freshShareOverride, cycleIds, now, day,
    })
    // 何度もまちがえている語は、未修の語と混ぜる前に、いちばん先へまとめて出す。
    return [
      ...shares.review.filter(isStruggling),
      ...shares.fresh.filter(isStruggling),
      ...interleaveProportionally(
        shares.review.filter((word) => !isStruggling(word)),
        shares.fresh.filter((word) => !isStruggling(word)),
      ),
    ]
  }

  // 自動のときは「今日の候補」（出題順の0〜2段：苦手・復習・未学習／未回答）から組み、苦手の語をいちばん先に出す。
  // 今日1回「まだ」「不正解」になった語、定着の確認、復習日前の語は、今日の候補があるうちは暗記にもテストにも混ぜない。
  const candidates = pool.filter((word) => (
    keys.get(word.id).stage <= STUDY_ORDER_STAGE.fresh
  ))
  if (!size) {
    // 数えるとき（結果画面の「次へ進む」など）は、今日の候補のあとに続けて出せる残りも含める。
    const candidateIds = new Set(candidates.map((word) => word.id))
    return [...candidates, ...pool.filter((word) => !candidateIds.has(word.id))]
  }

  const deck = balancedAutomaticDeck(candidates, srs, day, size, purpose, cycleIds, now)
  // 今日の候補で足りない分は、同じ教材の残りを出題順（今日1回「まだ」「不正解」になった語を点数の低い順に、
  // そのあと定着の確認、最後に復習日前の語）で続けて出す。
  // 今日の候補を学び終えた日も、次の復習日を待たずにくり返せる。
  if (deck.length < size) {
    const used = new Set([
      ...deck.map((word) => word.id),
      ...(Array.isArray(cycleIds) ? cycleIds : []),
    ])
    deck.push(
      ...pool.filter((word) => !used.has(word.id)).slice(0, size - deck.length),
    )
  }
  return deck.slice(0, size)
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

/** 答えた問題の位置（小さい順）。values は問題の位置 → 回答（未回答は null か値なし）。 */
export function answeredSessionIndexes(values = {}) {
  return Object.entries(values ?? {})
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([index]) => Number(index))
    .filter((index) => Number.isInteger(index) && index >= 0)
    .sort((a, b) => a - b)
}

/**
 * テストで答えた問題の位置。テストは答えないと次へ進めないので、いちばん先まで進んだ問題より前は
 * すべて答えている（辞書を開いて戻ると、表示中の問題の回答しか戻らないため、こう数える）。
 */
export function answeredQuizIndexes(currentIndex, values = {}) {
  const selected = answeredSessionIndexes(values)
  const reached = Math.max(currentIndex, selected.at(-1) ?? -1)
  const before = Array.from({ length: Math.max(0, reached) }, (_, index) => index)
  return [...new Set([...before, ...selected])].sort((a, b) => a - b)
}

/**
 * 1回の数を、いまの番号より少なくしたとき（数え直し）。
 * 答えた問題は記録も結果の集計もそのまま残し、デッキからだけ外して answeredItems で返す
 * （画面は結果の全問数・答えた語にそれを足す）。新しい回は、まだ答えていない問題を
 * いま表示しているものから順に並べ、足りない分を freshDeck（使った問題を除く）で補って size 問にする。
 */
export function restartSessionCount(existingDeck, answeredIndexes, currentIndex, freshDeck, size) {
  const answered = new Set(answeredIndexes)
  const answeredItems = existingDeck.filter((_, index) => answered.has(index))
  const unanswered = existingDeck
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => !answered.has(index))
  const remaining = [
    ...unanswered.filter(({ index }) => index >= currentIndex),
    ...unanswered.filter(({ index }) => index < currentIndex),
  ].map(({ item }) => item)
  const usedIds = new Set(existingDeck.map((item) => item.id))
  const fresh = freshDeck.filter((item) => !usedIds.has(item.id))
  return {
    deck: [...remaining, ...fresh].slice(0, Math.max(0, size)),
    answeredItems,
  }
}

/**
 * 上部バーに出す問題数の表示（「1/10」）。
 *
 * 暗記カードは輪から抜けた分だけ数が減るので「位置/残り枚数」を出す。そのために remaining を渡す。
 * テストなど渡さない画面は、デッキの「番号/総数」を出す。
 * remaining を数として渡したときだけ残り枚数で数える（null を 0 と数えると、
 * 渡さない画面がすべて 0/0 になり、1回の問題数が読めなくなる）。
 */
export function sessionCounterDisplay({
  index = 0,
  total = 0,
  remaining = null,
  position = 1,
} = {}) {
  const deckTotal = Math.max(0, Math.floor(Number(total)) || 0)
  const countsRemaining = remaining !== null && remaining !== undefined && remaining !== ''
    && Number.isFinite(Number(remaining))
  if (countsRemaining) {
    const remainingCards = Math.max(0, Math.floor(Number(remaining)) || 0)
    const place = Math.min(remainingCards, Math.max(1, Math.floor(Number(position)) || 1))
    return {
      countsRemaining: true,
      remaining: remainingCards,
      position: place,
      total: deckTotal,
      text: `${place}/${remainingCards}`,
    }
  }
  const place = Math.min(Math.max(1, Math.floor(Number(index)) + 1 || 1), deckTotal)
  return {
    countsRemaining: false,
    remaining: null,
    position: place,
    total: deckTotal,
    text: `${place}/${deckTotal}`,
  }
}

/** 級ごとの進捗集計（既習・習得・期限切れ件数）。 */
export function levelProgress(levelId, srs) {
  return wordProgress(wordsByLevel(levelId), srs)
}

/**
 * 任意の単語集合について、既習・習得・復習どき件数を集計する。
 * 既習と復習どきは暗記の自己判定ではなく学習の痕跡で数える。テストだけ解いた語も
 * 前日の学習として扱い、翌日の「復習が必要」件数と復習導線から落とさない。
 */
export function wordProgress(words, srs = {}) {
  const now = Date.now()
  const day = todayIndex(now)
  let seen = 0
  let mastered = 0
  let due = 0
  let ready = 0
  let learned = 0
  for (const w of words) {
    const e = srs[w.id]
    const metrics = vocabularyReviewMetrics(e, { now, day })
    if (metrics.shouldAutoAppear) ready++
    if (metrics.needsReview) due++
    // 暗記で「覚えた」と答えた語。級カードの棒グラフの「学習済み」と同じ数え方。
    if (metrics.learningStatus === 'learned') learned++
    if (!hasVocabularyReviewEvidence(e)) continue
    seen++
    if (e?.box >= 4) mastered++
  }
  return { total: words.length, seen, mastered, due, ready, learned }
}

// 下の級で「学習済み」がこの割合に届けば、弱点ナビの案内を終える。
export const WEAK_FOUNDATION_LEARNED_SHARE = 0.6

// ── 弱点ナビ：下の級（＝前提）が足を引っ張っていないか検知する ──
// 英検は 5級→1級 が学習の土台。上の級に進んでいるのに、下の級で復習がたまっている、
// または学習済みの語が6割に届かないなら、その級を「先に固めるべき前提」として返す。
// 判定には、案内に出す数（復習する語・学習済みの語）だけを使う。内部の復習段階（box）は
// 日をおいた復習でしか上がらないので、それで判定すると案内どおり学び終えても表示が変わらない。
// 返り値: { level, progress, remaining, reason:'due'|'learning' } または null。
// remaining は学習済みが6割に届くまでの残り語数（reason が 'learning' のとき）。
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
    if (p.due >= 3) return { level: lv, progress: p, remaining: 0, reason: 'due' }
    const remaining = Math.ceil(p.total * WEAK_FOUNDATION_LEARNED_SHARE) - p.learned
    if (remaining > 0) return { level: lv, progress: p, remaining, reason: 'learning' }
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

// purpose は study（暗記）か quiz（テスト）。出題順は全教材共通（studyOrder.js）。
// 結果画面の「次の◯項目へ」で続けるときは、同じ周回ですでに終えた項目（cycleIds）を
// 候補から外し、一巡するまで同じ項目を出し直さない（英単語の buildDeck と同じ考え方）。
export function buildPhraseDeck(
  source,
  {
    srs = {},
    size = SESSION_SIZE,
    purpose = 'study',
    excludeIds = [],
    cycleIds = [],
    now = Date.now(),
  } = {},
) {
  const day = todayIndex(now)
  let pool = phraseCandidates(source)
  const completed = new Set([
    ...(Array.isArray(excludeIds) ? excludeIds : []),
    ...(Array.isArray(cycleIds) ? cycleIds : []),
  ])
  if (completed.size) pool = pool.filter((item) => !completed.has(item.id))
  if (source.type === 'phraseList' && source.preserveOrder) {
    return size ? pool.slice(0, size) : pool
  }
  if (source.type === 'phraseDue') {
    pool = pool.filter((p) => srs[p.id] && srs[p.id].due <= day)
  }
  pool = orderForStudy(pool, srs, { purpose, now, day })
  return size ? pool.slice(0, size) : pool
}

// 単語と同じく、誤答の意味が正解の意味の中にそのまま入っていると
// どちらを選んでも正しい問題になる（come across「偶然出会う」に
// run across「〜に偶然出会う」を誤答として出す等）。包含関係で弾く。
const phraseOverlapText = (value) => String(value ?? '')
  .normalize('NFKC')
  .replace(/[〜~\s（）()・]/g, '')
const phraseMeaningsOverlap = (phrase, candidate) => {
  const answer = phraseOverlapText(quizMeaning(phrase))
  const other = phraseOverlapText(quizMeaning(candidate))
  if (answer.length >= 2 && phraseOverlapText(candidate.meaning).includes(answer)) return true
  if (other.length >= 2 && phraseOverlapText(phrase.meaning).includes(other)) return true
  return false
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
      if (phraseMeaningsOverlap(phrase, item)) continue
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
    if (metrics.needsReview) due++
    if (!hasVocabularyReviewEvidence(entry)) continue
    seen++
    if (entry?.box >= 4) mastered++
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
