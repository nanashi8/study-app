#!/usr/bin/env node
// 中学の社会・理科に、実際の公立高校入試の問題をもとに足した入試の段の問題と、もとにした入試の記録
// （docs/audits/junior-exam-basis.json）の道具。依頼台帳 requests/2026-11-28-junior-exam-questions.json。
// テストは tests/junior-exam-questions.test.mjs。
//
//   exams     … もとにした入試（都道府県・年度・教科・公開している問題のURL）。実際に開いて読んだものだけを書く。
//   questions … 足した問題ごとに、もとにした入試（exams の鍵）・大問と小問（part）・何をもとにしたか（pattern）と、
//               書いたときの問題の指紋（sha256）。問題の文は入試の文を写さずに書く。
//   問題を変えたら、もとにした入試と合っているか読み直してから --stamp <問題IDか単元ID> で指紋を押し直す。
//
//   node scripts/checks/junior-exam-basis.mjs                 … 記録と問題の食いちがいを並べる
//   node scripts/checks/junior-exam-basis.mjs --stamp sc2-01  … 読み直した問題の指紋を押し直す
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { ALL_SUBJECT_UNITS, examSourceQuestions } from '../../src/data/subjects/index.js'

const ROOT = new URL('../../', import.meta.url)
export const EXAM_BASIS_PATH = new URL('docs/audits/junior-exam-basis.json', ROOT)

export const JUNIOR_BOOKS = Object.freeze(['geography', 'history', 'civics', 'science1', 'science2', 'science3'])

/** 中学の単元。 */
export const juniorUnits = () => ALL_SUBJECT_UNITS.filter((unit) => JUNIOR_BOOKS.includes(unit.book))

/** 入試をもとに足した問題（単元の問題の後ろに続く分）。 */
export const examBasedQuestions = (unit) => unit.questions.slice(unit.questions.length - examSourceQuestions(unit.id).length)

export const allExamBasedQuestions = () => juniorUnits().flatMap(examBasedQuestions)

/** 問題の指紋。学習者に見せる中身が1字でも変わると変わる。 */
export const examQuestionFingerprint = (question) => createHash('sha256').update(JSON.stringify([
  question.kind,
  question.level,
  question.text,
  question.figure,
  question.kind === 'order' ? question.items : question.kind === 'number' ? [question.answer, question.unit, question.steps] : question.choices,
  question.notes ?? null,
  question.explanation,
  question.read,
])).digest('hex')

export const readExamBasis = () => JSON.parse(readFileSync(EXAM_BASIS_PATH, 'utf8'))

/** 記録と今の問題の食いちがい。空なら、足した全問がもとにした入試の記録と合っている。 */
export function examBasisProblems(ledger = readExamBasis()) {
  const problems = []
  const exams = ledger.exams ?? {}
  for (const [id, exam] of Object.entries(exams)) {
    for (const field of ['pref', 'year', 'subject', 'name', 'url']) if (!String(exam[field] ?? '').trim()) problems.push(`入試 ${id}: ${field} がない`)
    // 問題のURLは、都道府県の教育委員会が公開している所（都・道府県のサイトと、群馬県教育委員会のサイト）に限る。
    if (!/^https:\/\/(www\.(kyoiku\.metro\.tokyo\.lg\.jp|pref\.[a-z]+\.(lg\.)?jp)|gunma-boe\.gsn\.ed\.jp)\//.test(exam.url ?? '')) problems.push(`入試 ${id}: 問題のURLが教育委員会の公開先でない`)
  }
  const used = new Set()
  const questions = allExamBasedQuestions()
  const ids = new Set(questions.map((question) => question.id))
  for (const question of questions) {
    const entry = ledger.questions?.[question.id]
    if (!entry) {
      problems.push(`${question.id}: もとにした入試の記録がない`)
      continue
    }
    if (!exams[entry.exam]) problems.push(`${question.id}: もとにした入試 ${entry.exam} が一覧にない`)
    else used.add(entry.exam)
    if (!String(entry.part ?? '').trim()) problems.push(`${question.id}: 大問と小問がない`)
    if ((entry.pattern?.trim().length ?? 0) < 15) problems.push(`${question.id}: 何をもとにしたかが短い`)
    if (entry.sha256 !== examQuestionFingerprint(question)) problems.push(`${question.id}: 記録したあとに問題が変わった（読み直して --stamp ${question.id}）`)
  }
  for (const id of Object.keys(ledger.questions ?? {})) if (!ids.has(id)) problems.push(`${id}: 記録にあるが、入試をもとに足した問題にない`)
  for (const id of Object.keys(exams)) if (!used.has(id)) problems.push(`入試 ${id}: どの問題ももとにしていない`)
  return problems
}

function stamp(targets) {
  const ledger = readExamBasis()
  const questions = allExamBasedQuestions().filter((question) => targets.some((target) => question.id === target || question.id.startsWith(`${target}-`)))
  if (!questions.length) throw new Error(`押し直す問題がない: ${targets.join(' ')}`)
  for (const question of questions) {
    const entry = ledger.questions[question.id]
    if (!entry?.exam) throw new Error(`${question.id}: もとにした入試の記録がないので押せない`)
    entry.sha256 = examQuestionFingerprint(question)
  }
  writeFileSync(EXAM_BASIS_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
  console.log(`押し直した: ${questions.length}問`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const args = process.argv.slice(2)
  if (args[0] === '--stamp') stamp(args.slice(1))
  else {
    const problems = examBasisProblems()
    for (const problem of problems) console.log(problem)
    console.log(problems.length ? `食いちがい ${problems.length}件` : `足した ${allExamBasedQuestions().length}問すべて、もとにした入試の記録と合っている`)
    if (problems.length) process.exitCode = 1
  }
}
