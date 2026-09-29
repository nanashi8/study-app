#!/usr/bin/env node
// 社会・理科の演習の正解を確かめた記録（docs/audits/junior-social-science-answers.json）の道具。
// 依頼台帳 requests/2026-09-29-junior-social-science.json の answers-verified。テストは tests/junior-social-science-answers.test.mjs。
//
//   知識の問題（選ぶ・並べる）は1問ずつ読み直し、正解がひとつに決まり誤答が誤りである根拠を basis に書く。
//   sha256 は読み直したときの問題の指紋（問題文・図・選択肢と説明・並べる項目と理由・解説）。
//   問題を変えたら、読み直してから --stamp <問題IDか単元ID> で指紋を押し直す（根拠も合わせて直す）。
//   数を入れる問題は、テストの中で問題文の数から計算し直すので、この記録には入れない。
//
//   node scripts/checks/junior-social-science-answers.mjs            … 記録と問題の食いちがいを並べる
//   node scripts/checks/junior-social-science-answers.mjs --stamp geo-08-q05   … 読み直した問題の指紋を押し直す
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { ALL_SUBJECT_QUESTIONS } from '../../src/data/subjects/index.js'

const ROOT = new URL('../../', import.meta.url)
export const ANSWERS_LEDGER_PATH = new URL('docs/audits/junior-social-science-answers.json', ROOT)

/** 正解の確かめの対象（数を入れる問題は、テストで計算し直すので外す）。 */
export const reviewedQuestions = () => ALL_SUBJECT_QUESTIONS.filter((question) => question.kind !== 'number')

/** 問題の指紋。学習者に見せる中身が1字でも変わると変わる（図の読み取り方は、ある問題だけ指紋に入れる）。 */
export const questionFingerprint = (question) => createHash('sha256').update(JSON.stringify([
  question.kind,
  question.text,
  question.figure,
  question.kind === 'order' ? question.items : question.choices,
  question.notes,
  question.explanation,
  ...(question.read?.length ? [question.read] : []),
])).digest('hex')

export const readAnswersLedger = () => JSON.parse(readFileSync(ANSWERS_LEDGER_PATH, 'utf8'))

/** 記録と今の問題の食いちがい。空なら、全問が読み直した時のまま。 */
export function answersLedgerProblems(ledger = readAnswersLedger()) {
  const problems = []
  const questions = reviewedQuestions()
  const ids = new Set(questions.map((question) => question.id))
  const bases = new Map()
  for (const question of questions) {
    const entry = ledger.questions?.[question.id]
    if (!entry) {
      problems.push(`${question.id}: 読み直した記録がない`)
      continue
    }
    if (entry.sha256 !== questionFingerprint(question)) problems.push(`${question.id}: 読み直したあとに問題が変わった（読み直して --stamp ${question.id}）`)
    const basis = entry.basis?.trim() ?? ''
    if (basis.length < 20) problems.push(`${question.id}: 根拠が短い`)
    if (bases.has(basis)) problems.push(`${question.id}: 根拠が ${bases.get(basis)} と同じ文`)
    bases.set(basis, question.id)
  }
  for (const id of Object.keys(ledger.questions ?? {})) {
    if (!ids.has(id)) problems.push(`${id}: 記録にあるが、知識の問題にない`)
  }
  for (const fix of ledger.fixes ?? []) {
    if (!ids.has(fix.id)) problems.push(`直した記録 ${fix.id}: 問題がない`)
    if (!fix.what?.trim()) problems.push(`直した記録 ${fix.id}: 何を直したかがない`)
  }
  return problems
}

function stamp(targets) {
  const ledger = readAnswersLedger()
  const questions = reviewedQuestions().filter((question) => targets.some((target) => question.id === target || question.id.startsWith(`${target}-`)))
  if (!questions.length) throw new Error(`押し直す問題がない: ${targets.join(' ')}`)
  for (const question of questions) {
    const entry = ledger.questions[question.id]
    if (!entry?.basis) throw new Error(`${question.id}: 根拠がないので押せない（先に basis を書く）`)
    entry.sha256 = questionFingerprint(question)
  }
  writeFileSync(ANSWERS_LEDGER_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
  console.log(`押し直した: ${questions.map((question) => question.id).join(' ')}`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const args = process.argv.slice(2)
  if (args[0] === '--stamp') stamp(args.slice(1))
  else {
    const problems = answersLedgerProblems()
    console.log(problems.length ? problems.join('\n') : `知識の問題 ${reviewedQuestions().length} 問すべて、読み直した記録と一致`)
    if (problems.length) process.exitCode = 1
  }
}
