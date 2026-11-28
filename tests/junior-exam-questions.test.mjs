// 中学の社会・理科に、実際の公立高校入試の問題をもとに足した入試の段の問題（依頼 requests/2026-11-28-junior-exam-questions.json）。
// 全102単元に、冊ごとに決めた数（社会17問・理科23問）の問題があり、どれも入試の段の3つの形のどれかで、
// もとにした入試の記録（docs/audits/junior-exam-basis.json）と合い、同じ問題文をくり返さないことを確かめる。
import assert from 'node:assert/strict'
import test from 'node:test'
import { EXAM_BASED_QUESTIONS_PER_UNIT, PRACTICE_KINDS } from '../src/data/subjects/meta.js'
import { allExamBasedQuestions, examBasedQuestions, examBasisProblems, juniorUnits, readExamBasis } from '../scripts/checks/junior-exam-basis.mjs'

const units = juniorUnits()
const SOCIAL = ['geography', 'history', 'civics']
const SCIENCE = ['science1', 'science2', 'science3']

test('中学の6冊の全102単元に、冊ごとに決めた数の入試をもとにした問題がある', () => {
  const byBook = Object.fromEntries(Object.keys(EXAM_BASED_QUESTIONS_PER_UNIT).map((book) => [book, 0]))
  for (const unit of units) byBook[unit.book] += 1
  assert.deepEqual(byBook, { geography: 19, history: 21, civics: 18, science1: 13, science2: 15, science3: 16 })
  const wrong = units.filter((unit) => examBasedQuestions(unit).length !== EXAM_BASED_QUESTIONS_PER_UNIT[unit.book])
    .map((unit) => `${unit.id}: ${examBasedQuestions(unit).length}問`)
  assert.deepEqual(wrong, [])
  const count = (books) => units.filter((unit) => books.includes(unit.book)).reduce((sum, unit) => sum + examBasedQuestions(unit).length, 0)
  assert.equal(count(SOCIAL), 986)
  assert.equal(count(SCIENCE), 1012)
  assert.equal(allExamBasedQuestions().length, 1998)
})

test('足した問題はどれも入試の段で、選ぶ・数を入れる・並べるのどれかの形をしている', () => {
  const wrong = []
  for (const question of allExamBasedQuestions()) {
    if (question.level !== 'exam') wrong.push(`${question.id}: 段が ${question.level}`)
    if (!PRACTICE_KINDS[question.kind]) wrong.push(`${question.id}: 形が ${question.kind}`)
    if (!String(question.text ?? '').trim()) wrong.push(`${question.id}: 問題文がない`)
    if (!String(question.explanation ?? '').trim()) wrong.push(`${question.id}: 解説がない`)
    if (question.kind === 'choice' && (question.choices?.length ?? 0) < 3) wrong.push(`${question.id}: 選択肢が少ない`)
    if (question.kind === 'order' && (question.items?.length ?? 0) < 3) wrong.push(`${question.id}: 並べるものが少ない`)
    if (question.kind === 'number' && !Number.isFinite(question.answer)) wrong.push(`${question.id}: 答えが数でない`)
  }
  assert.deepEqual(wrong, [])
})

test('足した全問に、もとにした入試の記録があり、問題がそのあと変わっていない', () => {
  assert.deepEqual(examBasisProblems(), [])
  const ledger = readExamBasis()
  const exams = Object.values(ledger.exams)
  assert.ok(exams.some((exam) => exam.subject === '理科'))
  assert.ok(exams.some((exam) => exam.subject === '社会'))
})

test('中学の全単元で、同じ問題をくり返さない（今の問題と足した問題を合わせて、問題文と選択肢・並べるもの・答えが同じもの）', () => {
  const seen = new Map()
  const repeated = []
  for (const unit of units) {
    for (const question of unit.questions) {
      const key = JSON.stringify([question.text.replace(/\s+/g, ''), question.choices ?? question.items ?? question.answer])
      if (seen.has(key)) repeated.push(`${question.id} と ${seen.get(key)}`)
      else seen.set(key, question.id)
    }
  }
  assert.deepEqual(repeated, [])
})
