#!/usr/bin/env node
// 誘導問題（基本の型）の全問の方針の段を、問題・着眼点・つまずきやすい点と照らして1問ずつ読んだ記録
// （docs/audits/math-guided-approach-review.json）の道具。
// 依頼台帳 requests/2026-10-22-math-no-hand-calc.json の guided-approach-read。テストは tests/math-guided-approach.test.mjs。
//
//   読むこと：1段目が方針（何を使うか・どこから手をつけるか）を問い、2段目からがその問題の解き方の手順を問うか、
//   正解の選択肢が着眼点どおりか、誤りの選択肢がありがちな誤りで説明がその結果と合うか、計算の答えを選ばせていないか、
//   考え方（なぜ）と手がかり（図・表・書き出しなど）が答えを書かずに導くか、言葉がその学年の生徒に読めるか。
//   problems に問題ごとの中身（問題と方針の段）の指紋、fixes に読んで直したことを書く。
//
//   node scripts/checks/math-guided-approach-review.mjs                       … 記録と今の中身の食いちがいを並べる
//   node scripts/checks/math-guided-approach-review.mjs --stamp eq1-1 eq1-2   … 読み直した問題の指紋を押す
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { MATH_PROBLEMS } from '../../src/data/math.js'
import { MATH_GUIDED_APPROACH_ROWS } from '../../src/data/math-guided-approach.js'

const ROOT = new URL('../../', import.meta.url)
export const GUIDED_REVIEW_PATH = new URL('docs/audits/math-guided-approach-review.json', ROOT)
export const GUIDED_PROBLEMS = Object.values(MATH_PROBLEMS).flat()

/** 問題と方針の段の指紋。問題文・式・着眼点と公式・つまずき・方針の段のどれかが変わると変わる。 */
export const guidedFingerprint = (problem) => createHash('sha256').update(JSON.stringify({
  text: problem.text ?? null,
  prompt: problem.prompt ?? null,
  recall: problem.recall,
  pitfall: problem.pitfall,
  approach: MATH_GUIDED_APPROACH_ROWS[problem.id] ?? null,
})).digest('hex')

export const readGuidedReview = () => (existsSync(GUIDED_REVIEW_PATH)
  ? JSON.parse(readFileSync(GUIDED_REVIEW_PATH, 'utf8'))
  : { problems: {}, fixes: [] })

export function guidedReviewProblems(ledger = readGuidedReview()) {
  const problems = []
  for (const problem of GUIDED_PROBLEMS) {
    const recorded = ledger.problems?.[problem.id]
    if (!recorded) problems.push(`${problem.id}: 読んだ記録がない`)
    else if (recorded !== guidedFingerprint(problem)) problems.push(`${problem.id}: 読んだあとに変わった（読み直して --stamp ${problem.id}）`)
  }
  const ids = new Set(GUIDED_PROBLEMS.map((problem) => problem.id))
  for (const id of Object.keys(ledger.problems ?? {})) if (!ids.has(id)) problems.push(`${id}: 記録にあるが、問題がない`)
  for (const [index, fix] of (ledger.fixes ?? []).entries()) {
    if (!ids.has(fix.problem) || !fix.what?.trim() || !fix.fix?.trim()) problems.push(`fixes[${index}]: problem・what（見つけたこと）・fix（直し方）がそろっていない`)
  }
  return problems
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  const ledger = readGuidedReview()
  const stampAt = process.argv.indexOf('--stamp')
  if (stampAt > 0) {
    ledger.readMe = '誘導問題（基本の型）の全問の方針の段を、問題・着眼点・つまずきやすい点と照らして1問ずつ読んだ記録。problems は問題ごとの中身（問題と方針の段）の指紋、fixes は読んで直したこと。中身を変えたら読み直して node scripts/checks/math-guided-approach-review.mjs --stamp <問題ID>。'
    ledger.problems ??= {}
    ledger.fixes ??= []
    const byId = new Map(GUIDED_PROBLEMS.map((problem) => [problem.id, problem]))
    for (const id of process.argv.slice(stampAt + 1).filter((arg) => !arg.startsWith('--'))) {
      const problem = byId.get(id)
      if (!problem) throw new Error(`問題がない: ${id}`)
      ledger.problems[id] = guidedFingerprint(problem)
      console.log(`押した: ${id}`)
    }
    ledger.problems = Object.fromEntries(GUIDED_PROBLEMS.filter((problem) => ledger.problems[problem.id]).map((problem) => [problem.id, ledger.problems[problem.id]]))
    writeFileSync(GUIDED_REVIEW_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
  } else {
    const problems = guidedReviewProblems(ledger)
    for (const problem of problems) console.log(problem)
    console.log(problems.length ? `食いちがい ${problems.length}件` : `${GUIDED_PROBLEMS.length}問すべて読んだ記録と一致`)
    if (problems.length) process.exitCode = 1
  }
}
