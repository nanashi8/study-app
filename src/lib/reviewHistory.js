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
