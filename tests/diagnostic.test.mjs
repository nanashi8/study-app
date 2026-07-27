import test from 'node:test'
import assert from 'node:assert/strict'

import {
  DIAGNOSTIC_LEVELS,
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_SKILLS,
} from '../src/data/diagnostic.js'
import {
  scoreDiagnostic,
  UNKNOWN_DIAGNOSTIC_ANSWER,
} from '../src/lib/diagnostic.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import { useStore } from '../src/store/useStore.js'

const answersWith = (answerFor) =>
  Object.fromEntries(DIAGNOSTIC_QUESTIONS.map((question, index) => [
    question.id,
    answerFor(question, index),
  ]))

const allCorrect = () => answersWith((question) => question.answer)
const allUnknown = () => answersWith(() => UNKNOWN_DIAGNOSTIC_ANSWER)

test('診断問題は4分野×7級を4択で均等に網羅する', () => {
  assert.equal(DIAGNOSTIC_QUESTIONS.length, 28)
  assert.equal(new Set(DIAGNOSTIC_QUESTIONS.map((question) => question.id)).size, 28)

  for (const question of DIAGNOSTIC_QUESTIONS) {
    assert.ok(DIAGNOSTIC_SKILLS.some((skill) => skill.id === question.skill), question.id)
    assert.ok(DIAGNOSTIC_LEVELS.some((level) => level.id === question.level), question.id)
    assert.equal(question.choices.length, 4, question.id)
    assert.equal(new Set(question.choices).size, 4, question.id)
    assert.ok(question.choices.includes(question.answer), question.id)
    assert.ok(Number.isFinite(question.difficulty), question.id)
  }

  for (const skill of DIAGNOSTIC_SKILLS) {
    assert.equal(
      DIAGNOSTIC_QUESTIONS.filter((question) => question.skill === skill.id).length,
      7,
      skill.id,
    )
  }
  for (const level of DIAGNOSTIC_LEVELS) {
    assert.equal(
      DIAGNOSTIC_QUESTIONS.filter((question) => question.level === level.id).length,
      4,
      level.id,
    )
  }
})

test('推定偏差値は成績に対して単調で、上下限と級目安が妥当', () => {
  const timestamp = '2026-07-27T01:23:45.000Z'
  const high = scoreDiagnostic(allCorrect(), { completedAt: timestamp })
  const middle = scoreDiagnostic(
    answersWith((question, index) => index % 2 === 0 ? question.answer : UNKNOWN_DIAGNOSTIC_ANSWER),
    { completedAt: timestamp },
  )
  const low = scoreDiagnostic(allUnknown(), { completedAt: timestamp })

  assert.equal(high.score, 28)
  assert.equal(low.score, 0)
  assert.ok(high.deviation > middle.deviation)
  assert.ok(middle.deviation > low.deviation)
  assert.ok(high.deviation <= 75)
  assert.ok(low.deviation >= 25)
  assert.equal(high.estimatedLevel.id, '1')
  assert.equal(low.estimatedLevel.id, '5')
  assert.ok(high.deviationLow < high.deviationHigh)
  assert.equal(high.completedAt, timestamp)
  assert.equal(high.prioritySkillId, null)
})

test('分野別診断は弱点と強みを分け、未回答を拒否する', () => {
  const answers = allCorrect()
  for (const question of DIAGNOSTIC_QUESTIONS.filter((item) => item.skill === 'reading')) {
    answers[question.id] = UNKNOWN_DIAGNOSTIC_ANSWER
  }
  const result = scoreDiagnostic(answers)
  const reading = result.skillResults.find((skill) => skill.id === 'reading')

  assert.equal(reading.correct, 0)
  assert.equal(reading.status, 'focus')
  assert.equal(result.prioritySkillId, 'reading')
  assert.notEqual(result.strengthSkillId, 'reading')

  const incomplete = { ...answers }
  delete incomplete[DIAGNOSTIC_QUESTIONS[0].id]
  assert.throws(() => scoreDiagnostic(incomplete), /未回答/)
})

test('診断結果は進捗コードで往復し、不正な履歴型を拒否する', () => {
  const result = scoreDiagnostic(allCorrect(), { completedAt: '2026-07-27T01:23:45.000Z' })
  const state = {
    srs: {},
    kotenSrs: {},
    myList: [],
    readingsDone: [],
    mathDone: [],
    mathMastery: {},
    skillStats: {},
    diagnosticHistory: [result],
    engPos: null,
    vnCleared: [],
    portalOrder: [],
    portalHidden: [],
    stats: {},
    settings: {},
  }

  const decoded = decodeProgress(encodeProgress(state))
  assert.deepEqual(decoded.diagnosticHistory, [result])
  const fiveResults = Array.from({ length: 5 }, (_, index) =>
    scoreDiagnostic(allCorrect(), {
      completedAt: `2026-07-${String(20 + index).padStart(2, '0')}T01:23:45.000Z`,
    }))
  assert.ok(
    encodeProgress({ ...state, diagnosticHistory: fiveResults }).length < 2800,
    '診断履歴だけで進捗QRの目安容量を超えない',
  )
  assert.throws(
    () => decodeProgress(encodeProgress({ ...state, diagnosticHistory: {} })),
    /diagnosticHistory/,
  )
})

test('診断保存は履歴・分野別成績・初回の適応位置へ一度だけ反映する', () => {
  const result = scoreDiagnostic(allCorrect(), { completedAt: '2026-07-27T01:23:45.000Z' })
  useStore.setState({ diagnosticHistory: [], skillStats: {}, engPos: null })

  useStore.getState().recordDiagnosticResult(result)
  let state = useStore.getState()
  assert.equal(state.diagnosticHistory.length, 1)
  assert.equal(state.engPos, 6)
  for (const skill of result.skillResults) {
    assert.equal(state.skillStats[skill.id].answered, 7)
    assert.equal(state.skillStats[skill.id].correct, 7)
    assert.equal(state.skillStats[skill.id].sessions, 1)
  }

  useStore.getState().recordDiagnosticResult(result)
  state = useStore.getState()
  assert.equal(state.diagnosticHistory.length, 1)
  assert.equal(state.skillStats.vocab.sessions, 1)

  for (let index = 0; index < 6; index++) {
    useStore.getState().recordDiagnosticResult({
      ...result,
      id: `history-${index}`,
      completedAt: `2026-07-${String(20 + index).padStart(2, '0')}T01:23:45.000Z`,
    })
  }
  state = useStore.getState()
  assert.equal(state.diagnosticHistory.length, 5)
  assert.equal(state.diagnosticHistory[0].id, 'history-5')
})
