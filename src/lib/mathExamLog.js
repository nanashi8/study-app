// 数学の入試演習の記録。問題ごとに、解いた日・結果（自力で正解・ヒントで正解・不正解・わからない）・かかった秒数を残す。
// 目次・単元の演習ページ・演習画面の「前回」に出す。出題の順（復習に回すか）は contentQuizResults の math-exam で決める。
//
//   log : { [problemId]: [{ day, result, seconds }, ...] }  古い順。1問あたり新しい10回まで
import { MATH_EXAM_RESULT_IDS } from './mathExam.js'

export const MATH_EXAM_LOG_LIMIT = 10
const PROBLEM_ID = /^mx-[A-Za-z0-9]+-\d{2}$/
const RESULT_SET = new Set(MATH_EXAM_RESULT_IDS)

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
export function normalizeMathExamLog(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const log = {}
  for (const [problemId, attempts] of Object.entries(value)) {
    if (!PROBLEM_ID.test(problemId) || !Array.isArray(attempts)) continue
    const list = attempts.filter(isAttempt).map(cleanAttempt).slice(-MATH_EXAM_LOG_LIMIT)
    if (list.length) log[problemId] = list
  }
  return log
}

/** 1回分を足す（同じ日に何度解いても、1回ずつ残す）。 */
export function appendMathExamLog(log, problemId, { result, seconds, day } = {}) {
  const current = log ?? {}
  const attempt = { day, result, seconds }
  if (!PROBLEM_ID.test(problemId) || !isAttempt(attempt)) return current
  return {
    ...current,
    [problemId]: [...(current[problemId] ?? []), cleanAttempt(attempt)].slice(-MATH_EXAM_LOG_LIMIT),
  }
}

/** いちばん新しい1回（無ければ null）。 */
export const latestMathExamAttempt = (log, problemId) => log?.[problemId]?.at(-1) ?? null

/** 自力で正解した回のうち、いちばん短い時間（秒）。無ければ null。 */
export function bestSolvedSeconds(log, problemId) {
  const solved = (log?.[problemId] ?? []).filter((attempt) => attempt.result === 'solved')
  return solved.length ? Math.min(...solved.map((attempt) => attempt.seconds)) : null
}

/** 問題の集まりを、いちばん新しい結果で数える（まだ解いていない問題は unanswered）。 */
export function mathExamStatusCounts(log, problemIds = []) {
  const counts = { solved: 0, hinted: 0, wrong: 0, unknown: 0, unanswered: 0 }
  for (const problemId of problemIds) {
    counts[latestMathExamAttempt(log, problemId)?.result ?? 'unanswered'] += 1
  }
  return counts
}

/** 解き直しに回っている問題：いちばん新しい結果が「自力で正解」でない問題。 */
export const retryMathExamIds = (log, problemIds = []) => problemIds.filter((problemId) => {
  const latest = latestMathExamAttempt(log, problemId)
  return latest && latest.result !== 'solved'
})
