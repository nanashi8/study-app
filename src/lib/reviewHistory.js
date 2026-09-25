export const REVIEW_MARK_LIMIT = 5

const markValue = (value) => {
  if (value === 1 || value === true) return 1
  if (value === 0 || value === false) return 0
  return null
}

export function normalizeReviewMarks(value) {
  if (!Array.isArray(value)) return []
  return value
    .map(markValue)
    .filter((mark) => mark !== null)
    .slice(-REVIEW_MARK_LIMIT)
}

export function appendReviewMark(value, successful) {
  return [
    ...normalizeReviewMarks(value),
    successful ? 1 : 0,
  ].slice(-REVIEW_MARK_LIMIT)
}

export function reviewMarksForEntry(entry) {
  const memory = normalizeReviewMarks(entry?.memory?.marks)
  const test = normalizeReviewMarks(entry?.test?.marks)

  // 旧保存データには連続履歴がないため、直近判定だけを最初の1件として表示する。
  if (!memory.length) {
    if (entry?.memory?.lastJudgment === 'remembered') memory.push(1)
    if (entry?.memory?.lastJudgment === 'forgot') memory.push(0)
  }
  if (!test.length) {
    if (entry?.test?.lastResult === 'correct') test.push(1)
    if (entry?.test?.lastResult === 'wrong' || entry?.test?.lastResult === 'unknown') test.push(0)
  }

  return { memory, test }
}

/**
 * 暗記とテストを通した直近の答え（古い順。1＝覚えた・正解、0＝まだ・不正解・わからない）。
 * 何度もまちがえているか・続けて覚えているかを、どちらで答えたかにかかわらず見るために記録する（entry.recent）。
 * recent を持たない以前の記録は、暗記・テストそれぞれの直近の○×を、最後に答えた側が後ろになるようにつないで読む
 * （いちばん新しい答えは正しく、それより前の暗記とテストの入り混じりは分からないので、側ごとにまとめる）。
 */
export function recentMarksForEntry(entry) {
  if (Array.isArray(entry?.recent)) return normalizeReviewMarks(entry.recent)
  const { memory, test } = reviewMarksForEntry(entry)
  const memoryAt = Number(entry?.memory?.lastAt) || 0
  const testAt = Number(entry?.test?.lastAt) || 0
  const ordered = memoryAt >= testAt ? [...test, ...memory] : [...memory, ...test]
  return ordered.slice(-REVIEW_MARK_LIMIT)
}

// 答えの傾向。出す順（studyOrder.js）と次の復習日（vocabScheduler.js）の両方がこれで決める。
//   苦手（struggling）     最後の答えがまちがいで、直近5回のうち2回以上まちがえている
//   立て直し中（recovering） 最後の答えは成功だが、直近5回に2回以上のまちがいが残り、まだ定着ではない
//   定着（stable）          最後の答えが成功で、3回以上続けて成功、または直近5回のうち4回以上成功
export const REVIEW_TREND = Object.freeze({
  struggling: 'struggling',
  recovering: 'recovering',
  stable: 'stable',
})
export const TREND_REPEATED_FAILURES = 2
export const TREND_STABLE_STREAK = 3
export const TREND_STABLE_SUCCESSES = 4

/** 直近の○×（古い順）から傾向を読む。kind は REVIEW_TREND のどれかか null。 */
export function reviewTrend(marks = []) {
  const recent = normalizeReviewMarks(marks)
  const latest = recent.length ? recent.at(-1) : null
  const failures = recent.filter((mark) => mark === 0).length
  const successes = recent.length - failures
  let streak = 0
  for (let index = recent.length - 1; index >= 0 && recent[index] === latest; index -= 1) streak += 1
  const kind = latest === null
    ? null
    : latest === 0
      ? (failures >= TREND_REPEATED_FAILURES ? REVIEW_TREND.struggling : null)
      : streak >= TREND_STABLE_STREAK || successes >= TREND_STABLE_SUCCESSES
        ? REVIEW_TREND.stable
        : failures >= TREND_REPEATED_FAILURES
          ? REVIEW_TREND.recovering
          : null
  return { kind, latest, failures, successes, streak }
}

/** 記録1件の傾向（暗記とテストを通した直近の答えから）。 */
export function reviewTrendForEntry(entry) {
  return reviewTrend(recentMarksForEntry(entry))
}
