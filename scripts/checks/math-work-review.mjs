#!/usr/bin/env node
// 誘導問題と入試演習の全問の計算の経過を、問題文・答えの台帳と照らして1問ずつ読んだ記録
// （docs/audits/math-work-review.json）の道具。
// 依頼台帳 requests/2026-10-25-math-work-fill.json の work-read。テストは tests/math-work.test.mjs。
//
//   読むこと：式が正しいか、1行が前の行から暗算でできる1つの操作か（2けた×2けた・筆算のいるわり算などを1行でさせない）、
//   空所がその操作で変わる所だけか、考え方が操作の理由になっていて空所の答えを書いていないか、
//   誤りのタイルがありがちな誤りで説明がその値の出どころと合うか、言葉がその学年の生徒に読めるか。
//   problems に問題ごとの中身（問題と経過）の指紋、fixes に読んで直したことを書く。
//
//   node scripts/checks/math-work-review.mjs                      … 記録と今の中身の食いちがいを並べる
//   node scripts/checks/math-work-review.mjs --stamp pn-1 mx-pn-01 … 読み直した問題の指紋を押す
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { MATH_PROBLEMS } from '../../src/data/math.js'
import { MATH_EXAM_PROBLEMS } from '../../src/data/math-exam.js'
import { MATH_GUIDED_WORK_ROWS } from '../../src/data/math-guided-work.js'
import { MATH_EXAM_WORK_ROWS } from '../../src/data/math-exam-work.js'

const ROOT = new URL('../../', import.meta.url)
export const WORK_REVIEW_PATH = new URL('docs/audits/math-work-review.json', ROOT)
export const GUIDED_PROBLEMS = Object.values(MATH_PROBLEMS).flat()
export const WORK_PROBLEMS = [...GUIDED_PROBLEMS, ...MATH_EXAM_PROBLEMS]

/** 問題と経過の指紋。問題文・式・答えの台帳・経過のどれかが変わると変わる。 */
export const workFingerprint = (problem) => createHash('sha256').update(JSON.stringify({
  text: problem.text ?? null,
  prompt: problem.prompt ?? null,
  math: problem.math ?? null,
  parts: problem.parts ?? null,
  boxes: problem.boxes ?? null,
  work: MATH_GUIDED_WORK_ROWS[problem.id] ?? MATH_EXAM_WORK_ROWS[problem.id] ?? null,
})).digest('hex')

export const readWorkReview = () => (existsSync(WORK_REVIEW_PATH)
  ? JSON.parse(readFileSync(WORK_REVIEW_PATH, 'utf8'))
  : { problems: {}, fixes: [] })

export function workReviewProblems(ledger = readWorkReview()) {
  const problems = []
  for (const problem of WORK_PROBLEMS) {
    const recorded = ledger.problems?.[problem.id]
    if (!recorded) problems.push(`${problem.id}: 読んだ記録がない`)
    else if (recorded !== workFingerprint(problem)) problems.push(`${problem.id}: 読んだあとに変わった（読み直して --stamp ${problem.id}）`)
  }
  const ids = new Set(WORK_PROBLEMS.map((problem) => problem.id))
  for (const id of Object.keys(ledger.problems ?? {})) if (!ids.has(id)) problems.push(`${id}: 記録にあるが、問題がない`)
  for (const [index, fix] of (ledger.fixes ?? []).entries()) {
    if (!ids.has(fix.problem) || !fix.what?.trim() || !fix.fix?.trim()) problems.push(`fixes[${index}]: problem・what（見つけたこと）・fix（直し方）がそろっていない`)
  }
  return problems
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  const ledger = readWorkReview()
  const stampAt = process.argv.indexOf('--stamp')
  if (stampAt > 0) {
    ledger.readMe = '誘導問題と入試演習の全問の計算の経過を、問題文・答えの台帳と照らして1問ずつ読んだ記録。problems は問題ごとの中身（問題と経過）の指紋、fixes は読んで直したこと。中身を変えたら読み直して node scripts/checks/math-work-review.mjs --stamp <問題ID>。'
    ledger.problems ??= {}
    ledger.fixes ??= []
    const byId = new Map(WORK_PROBLEMS.map((problem) => [problem.id, problem]))
    for (const id of process.argv.slice(stampAt + 1).filter((arg) => !arg.startsWith('--'))) {
      const problem = byId.get(id)
      if (!problem) throw new Error(`問題がない: ${id}`)
      ledger.problems[id] = workFingerprint(problem)
      console.log(`押した: ${id}`)
    }
    ledger.problems = Object.fromEntries(WORK_PROBLEMS.filter((problem) => ledger.problems[problem.id]).map((problem) => [problem.id, ledger.problems[problem.id]]))
    writeFileSync(WORK_REVIEW_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
  } else {
    const problems = workReviewProblems(ledger)
    for (const problem of problems) console.log(problem)
    console.log(problems.length ? `食いちがい ${problems.length}件` : `${WORK_PROBLEMS.length}問すべて読んだ記録と一致`)
    if (problems.length) process.exitCode = 1
  }
}
