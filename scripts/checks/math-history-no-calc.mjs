#!/usr/bin/env node
// 数学の歴史コースのテスト全問を1問ずつ読み、答えを出すのに計算が要る問いを、計算せずに求め方を選ぶ問いに
// 書き直したかどうかの記録（docs/audits/math-history-no-calc.json）の道具。
// 依頼台帳 requests/2026-10-22-math-no-hand-calc.json の history-no-calc。テストは tests/math-history-no-calc.test.mjs。
//
//   decision … rewritten（求め方を選ぶ問いに書き直し、考え方のヒント hint を持つ）
//              kept（史実・用語の意味・決まり・図や並びの読み取りを問い、計算しない。why にそう判断した理由）
//   problems に問題ごとの中身の指紋を持たせ、問いを変えたら読み直しになる。
//
//   node scripts/checks/math-history-no-calc.mjs                          … 記録と今の中身の食いちがいを並べる
//   node scripts/checks/math-history-no-calc.mjs --stamp mh-zero-1 ...    … 読み直した問題の指紋を押す（判定は台帳に書く）
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { MATH_HISTORY_QUESTIONS, mathHistoryQuestion } from '../../src/data/math-history.js'

const ROOT = new URL('../../', import.meta.url)
export const NO_CALC_PATH = new URL('docs/audits/math-history-no-calc.json', ROOT)

export const noCalcFingerprint = (question) => createHash('sha256').update(JSON.stringify({
  question: question.question,
  hint: question.hint ?? null,
  choices: question.choices,
  answer: question.answer,
  explanation: question.explanation,
  notes: question.notes,
})).digest('hex')

export const readNoCalc = () => (existsSync(NO_CALC_PATH)
  ? JSON.parse(readFileSync(NO_CALC_PATH, 'utf8'))
  : { questions: {} })

export function noCalcProblems(ledger = readNoCalc()) {
  const problems = []
  for (const question of MATH_HISTORY_QUESTIONS) {
    const entry = ledger.questions?.[question.id]
    if (!entry) {
      problems.push(`${question.id}: 読んだ記録がない`)
      continue
    }
    if (entry.sha256 !== noCalcFingerprint(question)) problems.push(`${question.id}: 読んだあとに変わった（読み直して --stamp ${question.id}）`)
    if (entry.decision === 'rewritten' && !question.hint) problems.push(`${question.id}: 書き直した問いに考え方のヒントがない`)
    if (entry.decision === 'kept' && question.hint) problems.push(`${question.id}: 残した問いなのにヒントがある（判定を rewritten にする）`)
    if (!['rewritten', 'kept'].includes(entry.decision)) problems.push(`${question.id}: decision が rewritten / kept でない`)
    if (entry.decision === 'kept' && !entry.why?.trim()) problems.push(`${question.id}: 残した理由（why）がない`)
  }
  const ids = new Set(MATH_HISTORY_QUESTIONS.map((question) => question.id))
  for (const id of Object.keys(ledger.questions ?? {})) if (!ids.has(id)) problems.push(`${id}: 記録にあるが、問題がない`)
  return problems
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  const ledger = readNoCalc()
  const stampAt = process.argv.indexOf('--stamp')
  if (stampAt > 0) {
    for (const id of process.argv.slice(stampAt + 1)) {
      const question = mathHistoryQuestion(id)
      if (!question) throw new Error(`問題がない: ${id}`)
      if (!ledger.questions[id]) throw new Error(`${id} の判定（decision・why）を先に台帳へ書く`)
      ledger.questions[id].sha256 = noCalcFingerprint(question)
      console.log(`押した: ${id}`)
    }
    writeFileSync(NO_CALC_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
  } else {
    const problems = noCalcProblems(ledger)
    for (const problem of problems) console.log(problem)
    console.log(problems.length ? `食いちがい ${problems.length}件` : `${MATH_HISTORY_QUESTIONS.length}問すべて読んだ記録と一致`)
    if (problems.length) process.exitCode = 1
  }
}
