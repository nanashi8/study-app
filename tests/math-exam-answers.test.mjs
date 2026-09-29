// 数学の入試演習：全問の正解を、問題文の条件から計算し直して確かめる（tests/math-exam-verify/）。
// 検算は教材の答え（problem.boxes）を見ずに欄の値を出す。図のある問題は、図の点・長さ・角が条件と合うかも確かめる。
import test from 'node:test'
import assert from 'node:assert/strict'
import { MATH_EXAM_PROBLEMS } from '../src/data/math-exam.js'
import * as junior1 from './math-exam-verify/junior1.mjs'
import * as junior2 from './math-exam-verify/junior2.mjs'
import * as junior3 from './math-exam-verify/junior3.mjs'
import * as math1 from './math-exam-verify/math1.mjs'
import * as mathA from './math-exam-verify/mathA.mjs'
import * as math2 from './math-exam-verify/math2.mjs'
import * as mathB from './math-exam-verify/mathB.mjs'
import * as mathC from './math-exam-verify/mathC.mjs'
import * as math3 from './math-exam-verify/math3.mjs'

const MODULES = [junior1, junior2, junior3, math1, mathA, math2, mathB, mathC, math3]
const ANSWERS = Object.assign({}, ...MODULES.map((module) => module.answers))
const FIGURES = Object.assign({}, ...MODULES.map((module) => module.figures ?? {}))
const sorted = (object) => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)))

test('全問の全解答欄が、問題文の条件から計算し直した値と一致する', () => {
  assert.ok(MATH_EXAM_PROBLEMS.length > 0)
  const failures = []
  let boxes = 0
  for (const problem of MATH_EXAM_PROBLEMS) {
    const verify = ANSWERS[problem.id]
    if (!verify) {
      failures.push(`${problem.id}: 検算がない`)
      continue
    }
    try {
      const computed = verify()
      if (JSON.stringify(sorted(computed)) !== JSON.stringify(sorted(problem.boxes))) {
        failures.push(`${problem.id}: 検算 ${JSON.stringify(sorted(computed))} ≠ 教材 ${JSON.stringify(sorted(problem.boxes))}`)
      }
      boxes += Object.keys(problem.boxes).length
    } catch (error) {
      failures.push(`${problem.id}: 検算が止まった（${error.message}）`)
    }
  }
  assert.deepEqual(failures, [])
  assert.ok(boxes >= MATH_EXAM_PROBLEMS.length)
})

test('検算はすべて教材の問題に対応している（消した問題の検算が残っていない）', () => {
  const ids = new Set(MATH_EXAM_PROBLEMS.map((problem) => problem.id))
  assert.deepEqual(Object.keys(ANSWERS).filter((id) => !ids.has(id)), [])
  assert.deepEqual(Object.keys(FIGURES).filter((id) => !ids.has(id)), [])
})

test('図のある全問で、図の点・長さ・角が問題の条件と合う', () => {
  const failures = []
  for (const problem of MATH_EXAM_PROBLEMS.filter((item) => item.figure)) {
    const check = FIGURES[problem.id]
    if (!check) {
      failures.push(`${problem.id}: 図の確かめがない`)
      continue
    }
    try {
      check(problem.figure)
    } catch (error) {
      failures.push(`${problem.id}: ${error.message}`)
    }
  }
  assert.deepEqual(failures, [])
})

test('検算は、教材の答えをわざと変えると見つける（検算が形だけになっていない）', () => {
  // 各学年の最初の問題の1欄を1ずらして、同じ比べ方で不一致になることを確かめる。
  for (const problem of MATH_EXAM_PROBLEMS.filter((item, index, list) => list.findIndex((other) => other.unit === item.unit) === index)) {
    const computed = ANSWERS[problem.id]()
    const [label] = Object.keys(problem.boxes)
    const broken = { ...problem.boxes, [label]: problem.boxes[label] + 1 }
    assert.notDeepEqual(sorted(computed), sorted(broken), `${problem.id}: 答えをずらしても一致してしまう`)
  }
})
