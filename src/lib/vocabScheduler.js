import {
  learningStatusForSrsEntry,
  quizStatusForSrsEntry,
} from './contentProgress.js'
import { reviewMarksForEntry } from './reviewHistory.js'
import { MAINTENANCE_SRS_BOX, MAX_SRS_BOX, SRS_INTERVAL_DAYS } from './srs.js'

export const VOCAB_REVIEW_INTERVALS = SRS_INTERVAL_DAYS
export const MAX_VOCAB_REVIEW_BOX = MAX_SRS_BOX

const DAY_MS = 86_400_000
const MIN_RECALL = 0.1
const MAX_REVIEW_INTERVAL_DAYS = SRS_INTERVAL_DAYS.at(-1)

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const count = (value) => (
  Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0
)

const boxFor = (entry) => (
  clamp(Math.floor(count(entry?.box)), 0, MAX_VOCAB_REVIEW_BOX)
)

const localDayIndex = (timestamp) => {
  const offset = new Date(timestamp).getTimezoneOffset()
  return Math.floor((timestamp - offset * 60_000) / DAY_MS)
}

const elapsedSinceLastReview = (entry, now, day) => {
  if (Number.isFinite(entry?.lastAt)) {
    return Math.max(0, (now - entry.lastAt) / DAY_MS)
  }
  if (Number.isFinite(entry?.last)) {
    return Math.max(0, day - entry.last)
  }
  return null
}

const latestOutcome = (entry) => {
  const memoryAt = Number(entry?.memory?.lastAt) || 0
  const testAt = Number(entry?.test?.lastAt) || 0
  if (memoryAt >= testAt && memoryAt > 0) return entry.memory?.lastJudgment ?? null
  if (testAt > 0) return entry.test?.lastResult ?? null
  return null
}

// 暗記の自己判定がまだでも、テストを解いた語は「一度は学んだ語」として扱う。
// 級別一覧の件数や復習導線が、テストだけの日を未着手と誤認しないための土台。
export const hasVocabularyReviewEvidence = (entry) => (
  Number.isFinite(entry?.due)
  || Number.isFinite(entry?.lastAt)
  || Number.isFinite(entry?.last)
  || count(entry?.box) > 0
  || count(entry?.correct) + count(entry?.wrong) > 0
  || count(entry?.memory?.passes) > 0
  || count(entry?.test?.attempts) > 0
)

const weightedRate = (marks = []) => {
  if (!marks.length) return null
  let weightedCorrect = 0
  let weightTotal = 0
  marks.forEach((mark, index) => {
    const weight = index + 1
    weightedCorrect += mark * weight
    weightTotal += weight
  })
  return weightTotal ? weightedCorrect / weightTotal : null
}

/**
 * 語彙ごとの回答品質。直近5回を強く見つつ、旧保存にある累計正誤も捨てない。
 */
export function vocabularyResponseAccuracy(entry) {
  const marks = reviewMarksForEntry(entry)
  const recent = weightedRate([...marks.memory, ...marks.test])
  const correct = count(entry?.correct)
  const wrong = count(entry?.wrong)
  const attempts = correct + wrong
  const lifetime = attempts ? (correct + 1) / (attempts + 2) : null

  if (recent == null) return lifetime ?? 0.5
  if (lifetime == null) return recent
  return recent * 0.72 + lifetime * 0.28
}

const startRecallFor = (entry) => {
  const outcome = latestOutcome(entry)
  if (outcome === 'forgot' || outcome === 'unknown') return 0.28
  if (outcome === 'wrong') return 0.42
  if (outcome === 'remembered' || outcome === 'correct') return 0.98
  return boxFor(entry) === 0 ? 0.45 : 0.88
}

/**
 * 保存済みの box・正誤・直近履歴・基準時刻から、現在の定着度と復習要否を導く。
 * score は保存せず毎回再計算するため、旧データともそのまま共存できる。
 */
export function vocabularyReviewMetrics(
  entry,
  { now = Date.now(), day = localDayIndex(now) } = {},
) {
  const learningStatus = hasVocabularyReviewEvidence(entry)
    ? learningStatusForSrsEntry(entry)
    : 'unlearned'
  if (!entry || !hasVocabularyReviewEvidence(entry)) {
    return {
      score: 0,
      responseAccuracy: vocabularyResponseAccuracy(entry),
      retention: 0,
      halfLifeDays: null,
      elapsedDays: null,
      daysUntilDue: null,
      due: false,
      needsReview: false,
      shouldAutoAppear: true,
      coolingDown: false,
      learningStatus: 'unlearned',
      reason: 'unlearned',
    }
  }

  const box = boxFor(entry)
  const responseAccuracy = vocabularyResponseAccuracy(entry)
  const elapsedDays = elapsedSinceLastReview(entry, now, day) ?? 0
  const memoryPasses = count(entry?.memory?.passes)
  const baseHalfLife = Math.max(0.75, VOCAB_REVIEW_INTERVALS[Math.max(1, box)])
  const halfLifeDays = baseHalfLife
    * (0.72 + responseAccuracy * 0.56)
    * (1 + Math.min(memoryPasses, 8) * 0.025)
  const startRecall = startRecallFor(entry)
  const retention = clamp(
    MIN_RECALL + (startRecall - MIN_RECALL) * (2 ** (-elapsedDays / halfLifeDays)),
    MIN_RECALL,
    0.99,
  )
  const stageStrength = box / MAX_VOCAB_REVIEW_BOX
  const score = Math.round(clamp(
    retention * 0.5 + responseAccuracy * 0.3 + stageStrength * 0.2,
    0,
    1,
  ) * 100)
  const scheduledDue = Number.isFinite(entry?.due) && entry.due <= day
  const outcome = latestOutcome(entry)
  const failedLatest = outcome === 'forgot' || outcome === 'wrong' || outcome === 'unknown'
  const reviewedToday = Number.isFinite(entry?.lastAt)
    ? localDayIndex(entry.lastAt) === day
    : entry?.last === day
  const coolingDown = failedLatest && reviewedToday
  // 旧保存で期限が長すぎる語も、1日以上経ち定着予測が十分低ければ拾う。
  const retentionDue = elapsedDays >= 1 && retention < 0.56
  const needsReview = failedLatest || scheduledDue || retentionDue
  const daysUntilDue = Number.isFinite(entry?.due)
    ? Math.max(0, Math.floor(entry.due - day))
    : 0

  return {
    score,
    responseAccuracy,
    retention,
    halfLifeDays,
    elapsedDays,
    daysUntilDue,
    due: scheduledDue,
    needsReview,
    // 「まだ」の直後は明示的な復習では扱えるが、通常学習へ同日に
    // 自動再投入しない。翌日には再び通常の復習候補へ戻る。
    shouldAutoAppear: learningStatus === 'unlearned' || (needsReview && !coolingDown),
    coolingDown,
    learningStatus,
    reason: learningStatus === 'unlearned'
      ? 'unlearned'
      : failedLatest
        ? 'recent-failure'
        : scheduledDue
          ? 'scheduled'
          : retentionDue
            ? 'retention'
            : 'waiting',
  }
}

// 一覧の並べ替え用。棒グラフの表示（暗記の自己判定）とは別に、
// 復習が要る語を先頭へ寄せるための優先度として使う。
export function vocabularyLearningStatus(entry, options) {
  const metrics = vocabularyReviewMetrics(entry, options)
  if (metrics.learningStatus === 'unlearned') return 'unlearned'
  return metrics.needsReview ? 'reviewing' : 'learned'
}

/**
 * 英単語の棒グラフ用集計。
 *
 * 棒グラフは凡例どおり「暗記でどう答えたか」を示す。「覚えた」と答えた語は
 * 復習日が来ても学習済のまま残し、前日の学習が翌日に消えたように見せない。
 * 復習が必要な件数は due（vocabularyReviewMetrics と同じ判定）で別に返し、
 * カードの注記など専用の場所で伝える。
 */
export function summarizeVocabularySrsItems(
  items = [],
  srs = {},
  { now = Date.now(), day = localDayIndex(now) } = {},
) {
  const ids = [...new Set(
    (Array.isArray(items) ? items : [])
      .map((item) => (typeof item === 'string' ? item : item?.id))
      .filter(Boolean),
  )]
  const learning = { learned: 0, reviewing: 0, unlearned: 0 }
  const quiz = { correct: 0, incorrect: 0, unanswered: 0 }
  const activeIds = []
  let due = 0

  for (const id of ids) {
    const entry = srs?.[id]
    const metrics = vocabularyReviewMetrics(entry, { now, day })
    const learningStatus = metrics.learningStatus
    const quizStatus = quizStatusForSrsEntry(entry)

    learning[learningStatus] += 1
    quiz[quizStatus] += 1
    if (metrics.needsReview) due += 1
    if (learningStatus !== 'unlearned' || quizStatus !== 'unanswered') activeIds.push(id)
  }

  return { total: ids.length, learning, quiz, activeIds, due }
}

/**
 * 英単語だけに使う適応間隔。
 * 同日連打の成功は記録へ残すが、十分な間隔が無ければ box と期限を進めない。
 */
export function scheduleVocabularyReview({
  previousEntry = {},
  updatedEntry = {},
  result,
  timestamp = Date.now(),
  day = localDayIndex(timestamp),
} = {}) {
  const successful = result === 'correct' || result === 'remembered'
  const previousBox = boxFor(previousEntry)
  const hadEvidence = hasVocabularyReviewEvidence(previousEntry)
  const elapsedDays = elapsedSinceLastReview(previousEntry, timestamp, day)
  const baseSpacing = Math.max(1, VOCAB_REVIEW_INTERVALS[Math.max(1, previousBox)])
  const enoughSpacing = elapsedDays != null
    && elapsedDays >= Math.max(1, Math.ceil(baseSpacing * 0.6))
  const dueReached = !hadEvidence
    || !Number.isFinite(previousEntry?.due)
    || previousEntry.due <= day
  const canPromote = !hadEvidence || dueReached || enoughSpacing

  if (!successful) {
    const box = result === 'wrong' ? Math.max(0, previousBox - 1) : 0
    return {
      box,
      due: result === 'wrong'
        ? day + (previousBox >= MAINTENANCE_SRS_BOX ? VOCAB_REVIEW_INTERVALS[box] : 1)
        : day,
      promoted: false,
      spacingCredited: true,
    }
  }

  const box = canPromote
    ? Math.min(MAX_VOCAB_REVIEW_BOX, previousBox + 1)
    : previousBox

  if (!canPromote) {
    return {
      box,
      due: Math.max(day + 1, Number(previousEntry?.due) || day + 1),
      promoted: false,
      spacingCredited: false,
    }
  }

  const scoredEntry = { ...updatedEntry, box }
  const { responseAccuracy } = vocabularyReviewMetrics(scoredEntry, { now: timestamp, day })
  const overdueDays = Number.isFinite(previousEntry?.due)
    ? Math.max(0, day - previousEntry.due)
    : 0
  const timingBonus = Math.min(0.15, overdueDays / Math.max(4, baseSpacing * 4))
  const qualityFactor = clamp(0.84 + responseAccuracy * 0.32 + timingBonus, 0.85, 1.25)
  // 維持復習は全教材で表示する30→60→90→180日の契約を優先する。
  // 品質による微調整は短期の段階だけに限定し、長期日程を曖昧にしない。
  const intervalDays = box >= MAINTENANCE_SRS_BOX
    ? VOCAB_REVIEW_INTERVALS[box]
    : clamp(
        Math.max(1, Math.round(VOCAB_REVIEW_INTERVALS[Math.max(1, box)] * qualityFactor)),
        1,
        MAX_REVIEW_INTERVAL_DAYS,
      )

  return {
    box,
    due: day + intervalDays,
    promoted: box > previousBox,
    spacingCredited: true,
  }
}

export function formatVocabularyElapsedDays(elapsedDays) {
  if (!Number.isFinite(elapsedDays)) return '初回'
  if (elapsedDays < 1) return '今日学習'
  const days = Math.max(1, Math.floor(elapsedDays))
  return `前回から${days}日`
}

export function formatVocabularyDueDays(daysUntilDue) {
  if (!Number.isFinite(daysUntilDue) || daysUntilDue <= 0) return '今日が復習日'
  if (daysUntilDue === 1) return '次回は明日'
  return `次回は${daysUntilDue}日後`
}
