#!/usr/bin/env node
// 社会・理科の重要語句の解説を、中学生向けの用語集の程度に書いて1語ずつ読み直した記録
// （docs/audits/junior-social-science-glossary.json）の道具。依頼台帳 requests/2026-09-30-subject-figures-glossary.json の glossary-terms。
// テストは tests/junior-social-science-glossary.test.mjs。
//
//   語句 = [語句, 意味, { note: 解説 }]。意味は語句テストの問題文になる短い定義。解説に、背景・特徴・関連する語句・
//   まちがえやすい語との見分け方を、中学の範囲で書く（用語集の1項目と同じ程度）。
//   sha256 は読み直したときの語句・意味・解説の指紋。変えたら読み直して --stamp <単元ID> で押し直す。
//
//   node scripts/checks/junior-social-science-glossary.mjs                 … 記録と中身の食いちがいを並べる
//   node scripts/checks/junior-social-science-glossary.mjs --stamp geo-01  … 読み直した単元の指紋を押し直す
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { ALL_SUBJECT_TERMS, getSubjectUnit } from '../../src/data/subjects/index.js'

const ROOT = new URL('../../', import.meta.url)
export const GLOSSARY_LEDGER_PATH = new URL('docs/audits/junior-social-science-glossary.json', ROOT)

/** 語句の指紋。語句・意味・解説が1字でも変わると変わる。 */
export const termFingerprint = (term) => createHash('sha256').update(JSON.stringify([term.term, term.meaning, term.note])).digest('hex')

export const readGlossaryLedger = () => (existsSync(GLOSSARY_LEDGER_PATH)
  ? JSON.parse(readFileSync(GLOSSARY_LEDGER_PATH, 'utf8'))
  : { terms: {} })

/** 記録と今の語句の食いちがい。空なら、全語句が読み直したときのまま。 */
export function glossaryLedgerProblems(ledger = readGlossaryLedger()) {
  const problems = []
  const ids = new Set()
  for (const term of ALL_SUBJECT_TERMS) {
    ids.add(term.id)
    const recorded = ledger.terms?.[term.id]
    if (!recorded) problems.push(`${term.id}（${term.term}）: 解説を読み直した記録がない`)
    else if (recorded !== termFingerprint(term)) problems.push(`${term.id}（${term.term}）: 読み直したあとに変わった（読み直して --stamp ${term.unitId}）`)
  }
  for (const id of Object.keys(ledger.terms ?? {})) if (!ids.has(id)) problems.push(`${id}: 記録にあるが、語句がない`)
  return problems
}

function stamp(unitIds) {
  const ledger = readGlossaryLedger()
  ledger.terms ??= {}
  for (const id of unitIds) {
    const unit = getSubjectUnit(id)
    if (!unit) throw new Error(`単元がない: ${id}`)
    for (const term of unit.terms) {
      if (!term.note?.trim()) throw new Error(`${term.id}（${term.term}）: 解説がない`)
      ledger.terms[term.id] = termFingerprint(term)
    }
  }
  const next = {
    readMe: ledger.readMe ?? '社会・理科の重要語句の解説を、中学生向けの用語集の程度（意味に、背景・特徴・関連する語句・まちがえやすい語との見分け方を添える）に書き、1語ずつ読み直した記録。値は語句・意味・解説の指紋。確認は node scripts/checks/junior-social-science-glossary.mjs、押し直しは --stamp <単元ID>。',
    reviewedOn: new Date().toISOString().slice(0, 10),
    terms: Object.fromEntries(Object.entries(ledger.terms).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))),
  }
  writeFileSync(GLOSSARY_LEDGER_PATH, `${JSON.stringify(next, null, 2)}\n`)
  console.log(`押した: ${unitIds.join(' ')}`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const args = process.argv.slice(2)
  if (args[0] === '--stamp') stamp(args.slice(1))
  else {
    const problems = glossaryLedgerProblems()
    const recorded = Object.keys(readGlossaryLedger().terms ?? {}).length
    console.log(`語句 ${ALL_SUBJECT_TERMS.length}語のうち、記録 ${recorded}語`)
    if (problems.length) {
      console.log(`食いちがい ${problems.length}件`)
      for (const problem of problems.slice(0, 40)) console.log(`  - ${problem}`)
      process.exit(1)
    }
    console.log('全語句の解説が、読み直した記録と一致')
  }
}
