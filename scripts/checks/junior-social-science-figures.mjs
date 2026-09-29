#!/usr/bin/env node
// 社会・理科の要点と演習を、図表で詳しく説明できるか1件ずつ判断した記録（docs/audits/junior-social-science-figures.json）の道具。
// 依頼台帳 requests/2026-09-30-subject-figures-glossary.json の points-figure-review・points-figures-guides・figure-questions。
// テストは tests/junior-social-science-figures.test.mjs。
//
//   要点：図表で説明できるものは figure（図）と figure.guide（図の読み方：何を表すか・どこを見るか・特徴・判断の仕方）を持つ。
//         図表を付けないものは noFigure に理由を書く。
//   演習：図を見て考える問題は figure と read（図の読み取り方）を持つ（数を入れる問題は steps が読み取り方を兼ねる）。
//   sha256 は読んで判断したときの中身の指紋。中身を変えたら、読み直してから --stamp <単元ID> で押し直す。
//
//   node scripts/checks/junior-social-science-figures.mjs                 … 記録と中身の食いちがいを並べる
//   node scripts/checks/junior-social-science-figures.mjs --stamp geo-01  … 読み直した単元の指紋を押し直す
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { ALL_SUBJECT_UNITS, getSubjectUnit } from '../../src/data/subjects/index.js'

const ROOT = new URL('../../', import.meta.url)
export const FIGURES_LEDGER_PATH = new URL('docs/audits/junior-social-science-figures.json', ROOT)

const sha256 = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex')

/** 要点の記録の鍵（単元ID#何番目、1から）。 */
export const pointKey = (unit, index) => `${unit.id}#${index + 1}`

/** 要点の指紋。見出し・本文・図（図の読み方を含む）・図を付けない理由が1字でも変わると変わる。 */
export const pointFingerprint = (point) => sha256([point.heading, point.body, point.figure ?? null, point.noFigure ?? null])

/** 演習の指紋（図の判断に関わる中身：問題文・図・図の読み取り方・解き方・解説）。 */
export const questionFigureFingerprint = (question) => sha256([question.text, question.figure ?? null, question.read ?? [], question.steps ?? [], question.explanation ?? ''])

export const readFiguresLedger = () => (existsSync(FIGURES_LEDGER_PATH)
  ? JSON.parse(readFileSync(FIGURES_LEDGER_PATH, 'utf8'))
  : { points: {}, questions: {} })

/** 記録と今の中身の食いちがい。空なら、全要点・全演習が読んで判断したときのまま。 */
export function figuresLedgerProblems(ledger = readFiguresLedger()) {
  const problems = []
  const pointKeys = new Set()
  const questionIds = new Set()
  for (const unit of ALL_SUBJECT_UNITS) {
    unit.points.forEach((point, index) => {
      const key = pointKey(unit, index)
      pointKeys.add(key)
      const entry = ledger.points?.[key]
      if (!entry) problems.push(`${key}: 図表で説明できるかを判断した記録がない`)
      else if (entry.sha256 !== pointFingerprint(point)) problems.push(`${key}: 判断したあとに要点が変わった（読み直して --stamp ${unit.id}）`)
      else if (entry.decision !== (point.figure ? 'figure' : 'none')) problems.push(`${key}: 記録の判断（${entry.decision}）と中身が合わない`)
    })
    for (const question of unit.questions) {
      questionIds.add(question.id)
      const entry = ledger.questions?.[question.id]
      if (!entry) problems.push(`${question.id}: 図を付けるかを判断した記録がない`)
      else if (entry.sha256 !== questionFigureFingerprint(question)) problems.push(`${question.id}: 判断したあとに問題が変わった（読み直して --stamp ${unit.id}）`)
      else if (entry.decision !== (question.figure ? 'figure' : 'none')) problems.push(`${question.id}: 記録の判断（${entry.decision}）と中身が合わない`)
    }
  }
  for (const key of Object.keys(ledger.points ?? {})) if (!pointKeys.has(key)) problems.push(`${key}: 記録にあるが、要点がない`)
  for (const id of Object.keys(ledger.questions ?? {})) if (!questionIds.has(id)) problems.push(`${id}: 記録にあるが、演習がない`)
  return problems
}

function stamp(unitIds) {
  const ledger = readFiguresLedger()
  ledger.points ??= {}
  ledger.questions ??= {}
  for (const id of unitIds) {
    const unit = getSubjectUnit(id)
    if (!unit) throw new Error(`単元がない: ${id}`)
    unit.points.forEach((point, index) => {
      if (!point.figure && !point.noFigure) throw new Error(`${pointKey(unit, index)}: 図も、図を付けない理由（noFigure）もない`)
      ledger.points[pointKey(unit, index)] = { decision: point.figure ? 'figure' : 'none', sha256: pointFingerprint(point) }
    })
    for (const question of unit.questions) {
      ledger.questions[question.id] = { decision: question.figure ? 'figure' : 'none', sha256: questionFigureFingerprint(question) }
    }
  }
  const sortKeys = (object) => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })))
  const next = {
    readMe: ledger.readMe ?? '社会・理科の全要点と全演習を1件ずつ読み、図表（表・グラフ・地図・年表・流れ図・図解・雨温図）で詳しく説明できるかを判断した記録。figure＝図と図の読み方（要点）・図の読み取り方（演習）を付けた、none＝付けない（要点は理由を noFigure に書く）。sha256 は判断したときの中身の指紋。確認は node scripts/checks/junior-social-science-figures.mjs、押し直しは --stamp <単元ID>。',
    reviewedOn: new Date().toISOString().slice(0, 10),
    points: sortKeys(ledger.points),
    questions: sortKeys(ledger.questions),
  }
  writeFileSync(FIGURES_LEDGER_PATH, `${JSON.stringify(next, null, 2)}\n`)
  console.log(`押した: ${unitIds.join(' ')}`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const args = process.argv.slice(2)
  if (args[0] === '--stamp') stamp(args.slice(1))
  else {
    const problems = figuresLedgerProblems()
    const ledger = readFiguresLedger()
    const points = Object.values(ledger.points ?? {})
    const questions = Object.values(ledger.questions ?? {})
    console.log(`要点 ${points.length}件（図表 ${points.filter((entry) => entry.decision === 'figure').length}・なし ${points.filter((entry) => entry.decision === 'none').length}）・演習 ${questions.length}問（図 ${questions.filter((entry) => entry.decision === 'figure').length}）`)
    if (problems.length) {
      console.log(`食いちがい ${problems.length}件`)
      for (const problem of problems.slice(0, 40)) console.log(`  - ${problem}`)
      process.exit(1)
    }
    console.log('全要点・全演習が、判断した記録と一致')
  }
}
