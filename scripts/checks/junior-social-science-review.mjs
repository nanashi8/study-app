#!/usr/bin/env node
// 社会・理科の全102単元を1単元ずつ読み、内容の品質を精査した記録（docs/audits/junior-social-science-review.json）の道具。
// 依頼台帳 requests/2026-09-30-subject-katakana-quality.json の content-review。テストは tests/junior-social-science-review.test.mjs。
//
//   読むもの：めあて・要点の本文・図（数値・位置・見出し）と図の読み方・重要語句の意味と解説・演習の問題文・選択肢と
//   その説明・正解・解説・図の読み取り方・解き方。見ること：事実・数値・年代・用語・表記・中学の範囲・日本語の誤り、
//   要点と図と語句と演習の食いちがい、問題の正誤（正解が1つに決まるか、誤答が本当に誤りか）。
//   units に単元ごとの中身の指紋、fixes に見つけた誤りと直し方を書く。
//
//   node scripts/checks/junior-social-science-review.mjs                 … 記録と今の中身の食いちがいを並べる
//   node scripts/checks/junior-social-science-review.mjs --stamp geo-01  … 読み直した単元の指紋を押す
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { ALL_SUBJECT_UNITS, getSubjectUnit } from '../../src/data/subjects/index.js'

const ROOT = new URL('../../', import.meta.url)
export const REVIEW_LEDGER_PATH = new URL('docs/audits/junior-social-science-review.json', ROOT)

/** 単元の中身の指紋。めあて・要点・図・語句・演習のどれかが1字でも変わると変わる。 */
export const unitFingerprint = (unit) => createHash('sha256').update(JSON.stringify({
  title: unit.title,
  goal: unit.goal,
  points: unit.points,
  terms: unit.terms.map((term) => [term.term, term.meaning, term.note]),
  questions: unit.questions,
})).digest('hex')

export const readReviewLedger = () => (existsSync(REVIEW_LEDGER_PATH)
  ? JSON.parse(readFileSync(REVIEW_LEDGER_PATH, 'utf8'))
  : { units: {}, fixes: [] })

export function reviewLedgerProblems(ledger = readReviewLedger()) {
  const problems = []
  for (const unit of ALL_SUBJECT_UNITS) {
    const recorded = ledger.units?.[unit.id]
    if (!recorded) problems.push(`${unit.id}（${unit.title}）: 読み直した記録がない`)
    else if (recorded !== unitFingerprint(unit)) problems.push(`${unit.id}（${unit.title}）: 読み直したあとに変わった（読み直して --stamp ${unit.id}）`)
  }
  const ids = new Set(ALL_SUBJECT_UNITS.map((unit) => unit.id))
  for (const id of Object.keys(ledger.units ?? {})) if (!ids.has(id)) problems.push(`${id}: 記録にあるが、単元がない`)
  for (const [index, fix] of (ledger.fixes ?? []).entries()) {
    if (!ids.has(fix.unit) || !fix.what?.trim() || !fix.fix?.trim()) problems.push(`fixes[${index}]: unit・what（見つけた誤り）・fix（直し方）がそろっていない`)
  }
  return problems
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  const ledger = readReviewLedger()
  const stampAt = process.argv.indexOf('--stamp')
  if (stampAt > 0) {
    ledger.readMe = '社会・理科の全102単元を1単元ずつ読み、事実・数値・年代・用語・表記・中学の範囲・日本語、要点と図と語句と演習の食いちがい、問題の正誤を精査した記録。units は単元ごとの中身（めあて・要点・図・図の読み方・語句・演習）の指紋、fixes は見つけた誤りと直し方。中身を変えたら読み直して node scripts/checks/junior-social-science-review.mjs --stamp <単元ID>。'
    ledger.units ??= {}
    ledger.fixes ??= []
    for (const id of process.argv.slice(stampAt + 1).filter((arg) => !arg.startsWith('--'))) {
      const unit = getSubjectUnit(id)
      if (!unit) throw new Error(`単元がない: ${id}`)
      ledger.units[id] = unitFingerprint(unit)
      console.log(`押した: ${id}`)
    }
    ledger.units = Object.fromEntries(Object.entries(ledger.units).sort(([a], [b]) => a.localeCompare(b)))
    writeFileSync(REVIEW_LEDGER_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
  } else {
    const problems = reviewLedgerProblems(ledger)
    for (const problem of problems.slice(0, 30)) console.log(`  - ${problem}`)
    if (problems.length > 30) console.log(`  - ほか ${problems.length - 30}件`)
    console.log(problems.length ? `❌ ${problems.length}件` : `✅ 全${ALL_SUBJECT_UNITS.length}単元を読み直した記録と一致（見つけて直した誤り ${ledger.fixes.length}件）`)
    process.exit(problems.length ? 1 : 0)
  }
}
