// 社会・理科の演習：答え合わせ（選ぶ・数を入れる・並べる）、数字キーの入力、問題ごとの記録。
//
//   記録 log : { [問題ID]: [{ day, result, seconds }, ...] }  古い順。1問あたり新しい10回まで
//   result は correct（正解）・wrong（不正解）・unknown（わからない）。

export const SUBJECT_PRACTICE_RESULTS = Object.freeze({
  correct: Object.freeze({ label: '正解', short: '正解', color: '#047857' }),
  wrong: Object.freeze({ label: '不正解', short: '不正解', color: '#be123c' }),
  unknown: Object.freeze({ label: 'わからない', short: 'わからない', color: '#5f5b78' }),
})
export const SUBJECT_PRACTICE_RESULT_IDS = Object.freeze(Object.keys(SUBJECT_PRACTICE_RESULTS))

export const SUBJECT_PRACTICE_LOG_LIMIT = 10
const QUESTION_ID = /^(geo|his|civ|sc1|sc2|sc3)-\d{2}-q\d{2}$/
const RESULT_SET = new Set(SUBJECT_PRACTICE_RESULT_IDS)

// ── 数を入れる問題 ─────────────────────────────────────────────

/** 数字キーで入れた文字列を数にする（入っていない・形が正しくなければ null）。 */
export function parseNumberEntry(value) {
  const text = String(value ?? '').trim()
  if (!/^-?(\d+(\.\d*)?|\.\d+)$/.test(text)) return null
  const number = Number(text)
  return Number.isFinite(number) ? number : null
}

/** 数字キーを1つ押したあとの文字列。key は '0'〜'9'・'.'・'minus'（符号を入れかえる）・'back'（1字消す）。 */
export function pressNumberKey(current = '', key) {
  const text = String(current ?? '')
  const negative = text.startsWith('-')
  const digits = negative ? text.slice(1) : text
  if (key === 'minus') return negative ? digits : `-${digits}`
  if (key === 'back') return digits.length ? `${negative ? '-' : ''}${digits.slice(0, -1)}` : ''
  if (key === '.') {
    if (digits.includes('.')) return text
    return `${negative ? '-' : ''}${digits || '0'}.`
  }
  if (!/^\d$/.test(key)) return text
  if (digits.replace('.', '').length >= 7) return text
  const next = digits === '0' ? key : `${digits}${key}`
  return `${negative ? '-' : ''}${next}`
}

const closeEnough = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b))

// ── 答え合わせ ──────────────────────────────────────────────────

/**
 * 1問の答え合わせ。response は、選ぶ問題は選んだ選択肢の文、数を入れる問題は入れた文字列、
 * 並べる問題は並べた順の配列。答えがそろっていなければ filled は false。
 */
export function checkSubjectPractice(question, response) {
  if (!question) return { filled: false, correct: false }
  if (question.kind === 'number') {
    const value = parseNumberEntry(response)
    return { filled: value !== null, correct: value !== null && closeEnough(value, question.answer) }
  }
  if (question.kind === 'order') {
    const order = Array.isArray(response) ? response : []
    const filled = order.length === question.items.length
    return { filled, correct: filled && order.every((item, index) => item === question.items[index]) }
  }
  return { filled: typeof response === 'string' && response.length > 0, correct: response === question.answer }
}

/** 数の答えの見せ方（小数はそのまま、整数は3けた区切りにしない）。 */
export const formatNumberAnswer = (question) => `${question.answer}${question.unit ?? ''}`

// ── 問題ごとの記録 ─────────────────────────────────────────────

const isAttempt = (attempt) => Boolean(attempt)
  && Number.isSafeInteger(attempt.day)
  && attempt.day >= 0
  && RESULT_SET.has(attempt.result)
  && Number.isFinite(attempt.seconds)
  && attempt.seconds >= 0

const cleanAttempt = (attempt) => ({
  day: attempt.day,
  result: attempt.result,
  seconds: Math.min(24 * 3600, Math.round(attempt.seconds)),
})

/** 端末の保存・進捗コード・クラウドから読んだ記録を、形の正しいものだけにそろえる。 */
export function normalizeSubjectPracticeLog(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const log = {}
  for (const [questionId, attempts] of Object.entries(value)) {
    if (!QUESTION_ID.test(questionId) || !Array.isArray(attempts)) continue
    const list = attempts.filter(isAttempt).map(cleanAttempt).slice(-SUBJECT_PRACTICE_LOG_LIMIT)
    if (list.length) log[questionId] = list
  }
  return log
}

/** 1回分を足す（同じ日に何度解いても、1回ずつ残す）。 */
export function appendSubjectPracticeLog(log, questionId, { result, seconds, day } = {}) {
  const current = log ?? {}
  const attempt = { day, result, seconds }
  if (!QUESTION_ID.test(questionId) || !isAttempt(attempt)) return current
  return {
    ...current,
    [questionId]: [...(current[questionId] ?? []), cleanAttempt(attempt)].slice(-SUBJECT_PRACTICE_LOG_LIMIT),
  }
}

/** いちばん新しい1回（無ければ null）。 */
export const latestSubjectPractice = (log, questionId) => log?.[questionId]?.at(-1) ?? null

/** 問題の集まりを、いちばん新しい結果で数える（まだ解いていない問題は unanswered）。 */
export function subjectPracticeCounts(log, questionIds = []) {
  const counts = { correct: 0, wrong: 0, unknown: 0, unanswered: 0 }
  for (const questionId of questionIds) {
    counts[latestSubjectPractice(log, questionId)?.result ?? 'unanswered'] += 1
  }
  return counts
}

/** いちばん新しい結果が正解の問題。 */
export const solvedSubjectPracticeIds = (log, questionIds = []) => questionIds
  .filter((questionId) => latestSubjectPractice(log, questionId)?.result === 'correct')

/** 解き直しに回っている問題：解いたことがあり、いちばん新しい結果が正解でない問題。 */
export const retrySubjectPracticeIds = (log, questionIds = []) => questionIds.filter((questionId) => {
  const latest = latestSubjectPractice(log, questionId)
  return latest && latest.result !== 'correct'
})
