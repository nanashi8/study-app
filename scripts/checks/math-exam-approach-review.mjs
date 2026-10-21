#!/usr/bin/env node
// 入試演習の全問の方針の段を、問題文・解答の筋道と照らして1問ずつ読んだ記録（docs/audits/math-exam-approach-review.json）の道具。
// 依頼台帳 requests/2026-10-22-math-no-hand-calc.json の exam-approach-read。テストは tests/math-exam-approach.test.mjs。
//
//   読むこと：正解の選択肢が解答の筋道どおりか、誤りの選択肢が実際にありがちな誤りで説明がその結果と合うか、
//   どの段も計算の結果を求めていないか、考え方（なぜ）と手がかり（図・表・書き出しなど）が答えを書かずに導くか、
//   標準の問題の1段目が「どこから手をつけるか」を問うか、言葉がその学年の生徒に読めるか。
//   problems に問題ごとの中身（問題と方針の段）の指紋、fixes に読んで直したことを書く。
//
//   node scripts/checks/math-exam-approach-review.mjs                    … 記録と今の中身の食いちがいを並べる
//   node scripts/checks/math-exam-approach-review.mjs --stamp mx-pn-01   … 読み直した問題の指紋を押す
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { MATH_EXAM_PROBLEMS, mathExamProblem } from '../../src/data/math-exam.js'
import { MATH_EXAM_APPROACH_ROWS } from '../../src/data/math-exam-approach.js'

const ROOT = new URL('../../', import.meta.url)
export const APPROACH_REVIEW_PATH = new URL('docs/audits/math-exam-approach-review.json', ROOT)

/** 問題と方針の段の指紋。問題文・図・求めるもの・正解・解答の筋道・ポイント・つまずき・方針の段のどれかが変わると変わる。 */
export const approachFingerprint = (problem) => createHash('sha256').update(JSON.stringify({
  text: problem.text,
  math: problem.math ?? null,
  figure: problem.figure ?? null,
  parts: problem.parts,
  boxes: problem.boxes,
  choices: problem.choices ?? null,
  solution: problem.solution,
  point: problem.point,
  pitfall: problem.pitfall,
  approach: MATH_EXAM_APPROACH_ROWS[problem.id] ?? null,
})).digest('hex')

export const readApproachReview = () => (existsSync(APPROACH_REVIEW_PATH)
  ? JSON.parse(readFileSync(APPROACH_REVIEW_PATH, 'utf8'))
  : { problems: {}, fixes: [] })

export function approachReviewProblems(ledger = readApproachReview()) {
  const problems = []
  for (const problem of MATH_EXAM_PROBLEMS) {
    const recorded = ledger.problems?.[problem.id]
    if (!recorded) problems.push(`${problem.id}: 読んだ記録がない`)
    else if (recorded !== approachFingerprint(problem)) problems.push(`${problem.id}: 読んだあとに変わった（読み直して --stamp ${problem.id}）`)
  }
  const ids = new Set(MATH_EXAM_PROBLEMS.map((problem) => problem.id))
  for (const id of Object.keys(ledger.problems ?? {})) if (!ids.has(id)) problems.push(`${id}: 記録にあるが、問題がない`)
  for (const [index, fix] of (ledger.fixes ?? []).entries()) {
    if (!ids.has(fix.problem) || !fix.what?.trim() || !fix.fix?.trim()) problems.push(`fixes[${index}]: problem・what（見つけたこと）・fix（直し方）がそろっていない`)
  }
  return problems
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  const ledger = readApproachReview()
  const stampAt = process.argv.indexOf('--stamp')
  if (stampAt > 0) {
    ledger.readMe = '入試演習の全問の方針の段を、問題文・解答の筋道と照らして1問ずつ読んだ記録。problems は問題ごとの中身（問題と方針の段）の指紋、fixes は読んで直したこと。中身を変えたら読み直して node scripts/checks/math-exam-approach-review.mjs --stamp <問題ID>。'
    ledger.problems ??= {}
    ledger.fixes ??= []
    for (const id of process.argv.slice(stampAt + 1).filter((arg) => !arg.startsWith('--'))) {
      const problem = mathExamProblem(id)
      if (!problem) throw new Error(`問題がない: ${id}`)
      ledger.problems[id] = approachFingerprint(problem)
      console.log(`押した: ${id}`)
    }
    ledger.problems = Object.fromEntries(MATH_EXAM_PROBLEMS.filter((problem) => ledger.problems[problem.id]).map((problem) => [problem.id, ledger.problems[problem.id]]))
    writeFileSync(APPROACH_REVIEW_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
  } else {
    const problems = approachReviewProblems(ledger)
    for (const problem of problems) console.log(problem)
    console.log(problems.length ? `食いちがい ${problems.length}件` : `${MATH_EXAM_PROBLEMS.length}問すべて読んだ記録と一致`)
    if (problems.length) process.exitCode = 1
  }
}
