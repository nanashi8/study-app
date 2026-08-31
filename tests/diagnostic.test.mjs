import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  DIAGNOSTIC_LEVELS,
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_SKILLS,
} from '../src/data/diagnostic.js'
import {
  buildDiagnosticAnswerReview,
  buildDiagnosticGuidance,
  buildDiagnosticPerformanceReport,
  scoreDiagnostic,
  UNKNOWN_DIAGNOSTIC_ANSWER,
} from '../src/lib/diagnostic.js'
import { buildDiagnosticQuestions } from '../src/lib/diagnosticQuestions.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import { useStore } from '../src/store/useStore.js'

const answersWith = (answerFor, questions = DIAGNOSTIC_QUESTIONS) =>
  Object.fromEntries(questions.map((question, index) => [
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

test('診断問題は連続3回すべて入れ替わり、同じ回は再現できる', () => {
  const seed = 0x1a2b3c4d
  const forms = [1, 2, 3].map((attemptNumber) =>
    buildDiagnosticQuestions({ attemptNumber, seed }))

  assert.deepEqual(
    forms[0],
    buildDiagnosticQuestions({ attemptNumber: 1, seed }),
    '同じseed・受験回なら同じ問題セットを再現する',
  )

  for (const questions of forms) {
    assert.equal(questions.length, 28)
    assert.equal(new Set(questions.map((question) => question.id)).size, 28)
    for (const question of questions) {
      // 出題は「3択＋わからない」。教材データは4択のままで、組み立て時に絞る。
      assert.equal(question.choices.length, 3, question.id)
      assert.equal(new Set(question.choices).size, 3, question.id)
      assert.ok(question.choices.includes(question.answer), question.id)
      assert.ok(question.sourceId, question.id)
      if (question.skill === 'grammar') {
        assert.ok(question.promptJa, `${question.id}: 文法問題の目標の意味がありません`)
        assert.match(question.explain, /空所は「.+」に決まる/)
        assert.ok(question.explain.includes(question.answer), question.id)
      }
    }
    for (const skill of DIAGNOSTIC_SKILLS) {
      assert.equal(questions.filter((question) => question.skill === skill.id).length, 7)
    }
    for (const level of DIAGNOSTIC_LEVELS) {
      assert.equal(questions.filter((question) => question.level === level.id).length, 4)
    }
  }

  for (let index = 0; index < forms[0].length; index += 1) {
    assert.equal(
      new Set(forms.map((questions) => questions[index].sourceId)).size,
      3,
      `${forms[0][index].level}/${forms[0][index].skill}`,
    )
  }
})

test('生成した問題セットも同じ尺度で採点し、出題回を結果に残す', () => {
  const questions = buildDiagnosticQuestions({ attemptNumber: 8, seed: 24680 })
  const answers = answersWith((question) => question.answer, questions)
  const result = scoreDiagnostic(answers, {
    questions,
    formNumber: 8,
    completedAt: '2026-07-27T01:23:45.000Z',
  })

  assert.equal(result.score, 28)
  assert.equal(result.total, 28)
  assert.equal(result.formNumber, 8)
  assert.match(result.id, /-f8-/)
  assert.equal(result.skillResults.length, 4)
  assert.equal(result.levelResults.length, 7)
})

test('診断終了後の答え合わせは問題順・自分の回答・正解判定を保持する', () => {
  const questions = buildDiagnosticQuestions({ attemptNumber: 4, seed: 13579 })
  const answers = answersWith((question, index) => {
    if (index === 0) return UNKNOWN_DIAGNOSTIC_ANSWER
    if (index === 1) return question.choices.find((choice) => choice !== question.answer)
    return question.answer
  }, questions)
  const review = buildDiagnosticAnswerReview(questions, answers)

  assert.equal(review.length, questions.length)
  assert.deepEqual(
    review.map((item) => item.questionNumber),
    Array.from({ length: questions.length }, (_, index) => index + 1),
  )
  assert.equal(review[0].selectedAnswer, UNKNOWN_DIAGNOSTIC_ANSWER)
  assert.equal(review[0].isUnknown, true)
  assert.equal(review[0].isCorrect, false)
  assert.equal(review[1].isUnknown, false)
  assert.equal(review[1].isCorrect, false)
  assert.equal(review[2].selectedAnswer, questions[2].answer)
  assert.equal(review[2].isCorrect, true)
  assert.equal(review.filter((item) => !item.isCorrect).length, 2)
})

test('成績表は級×分野の全28マスと、不正解・わからないを分けて集計する', () => {
  const answers = allCorrect()
  const unknownQuestion = DIAGNOSTIC_QUESTIONS.find(
    (question) => question.level === '5' && question.skill === 'vocab',
  )
  const wrongQuestion = DIAGNOSTIC_QUESTIONS.find(
    (question) => question.level === '4' && question.skill === 'grammar',
  )
  answers[unknownQuestion.id] = UNKNOWN_DIAGNOSTIC_ANSWER
  answers[wrongQuestion.id] = wrongQuestion.choices.find(
    (choice) => choice !== wrongQuestion.answer,
  )

  const report = buildDiagnosticPerformanceReport(DIAGNOSTIC_QUESTIONS, answers)
  const cells = report.matrix.flatMap((row) => row.cells)
  const vocab = report.skills.find((skill) => skill.id === 'vocab')
  const grammar = report.skills.find((skill) => skill.id === 'grammar')

  assert.equal(report.matrix.length, 7)
  assert.equal(cells.length, 28)
  assert.equal(
    cells.find((cell) => cell.levelId === '5' && cell.skillId === 'vocab').mark,
    'unknown',
  )
  assert.equal(
    cells.find((cell) => cell.levelId === '4' && cell.skillId === 'grammar').mark,
    'incorrect',
  )
  assert.equal(vocab.unknown, 1)
  assert.equal(vocab.incorrect, 0)
  assert.equal(grammar.unknown, 0)
  assert.equal(grammar.incorrect, 1)
  assert.equal(report.levels.find((level) => level.id === '5').correct, 3)
  assert.equal(report.levels.find((level) => level.id === '4').correct, 3)
})

test('おすすめは最初の弱点級、診断根拠、個人の時間帯、間隔を空けた予定を示す', () => {
  const answers = allCorrect()
  for (const question of DIAGNOSTIC_QUESTIONS.filter((item) => item.skill === 'reading')) {
    answers[question.id] = UNKNOWN_DIAGNOSTIC_ANSWER
  }
  const result = scoreDiagnostic(answers, {
    completedAt: '2026-07-29T12:00:00.000Z',
  })
  const guidance = buildDiagnosticGuidance({
    result,
    questions: DIAGNOSTIC_QUESTIONS,
    answers,
    learningAnalysis: {
      bestWindow: { start: 18, end: 21, scored: 24, correct: 20 },
      hourly: [
        { hour: 18, scored: 12, efficiency: 0.7 },
        { hour: 19, scored: 12, efficiency: 0.85 },
      ],
      trackingReadiness: 'stable',
      learnedItems: 20,
      memoryScore: 68,
      stages: { fragile: 5 },
    },
  })

  assert.equal(guidance.recommendation.kind, 'foundation')
  assert.equal(guidance.recommendation.skillId, 'reading')
  assert.equal(guidance.recommendation.targetLevelId, '5')
  assert.match(guidance.recommendation.title, /英検5級の長文読解/)
  assert.match(guidance.recommendation.evidence.join(' '), /0\/7問/)
  assert.match(guidance.recommendation.evidence.join(' '), /「わからない」7問/)
  assert.equal(guidance.time.startHour, 19)
  assert.equal(guidance.time.windowStartHour, 18)
  assert.equal(guidance.time.personalized, true)
  assert.equal(guidance.time.provisional, false)
  assert.equal(guidance.memory.available, true)
  assert.deepEqual(
    guidance.schedule.map((step) => step.offsetDays),
    [1, 3, 7],
  )
  assert.deepEqual(
    guidance.schedule.map((step) => step.screen),
    ['readingList', 'readingList', 'diagnostic'],
  )
})

test('時間帯ごとの記録が足りない場合は19時を仮に選び、個人向けと断定しない', () => {
  const result = scoreDiagnostic(allCorrect(), {
    completedAt: '2026-07-29T12:00:00.000Z',
  })
  const guidance = buildDiagnosticGuidance({
    result,
    questions: DIAGNOSTIC_QUESTIONS,
    answers: allCorrect(),
    learningAnalysis: {
      bestWindow: null,
      trackingReadiness: 'empty',
      learnedItems: 0,
      memoryScore: 0,
      stages: { fragile: 0 },
    },
  })

  assert.equal(guidance.recommendation.kind, 'stretch')
  assert.equal(guidance.recommendation.screen, 'vocabLevels')
  assert.equal(guidance.recommendation.routeLabel, '級別英単語テスト')
  assert.equal(guidance.time.startHour, 19)
  assert.equal(guidance.time.personalized, false)
  assert.equal(guidance.time.provisional, true)
  assert.match(guidance.time.evidence, /仮に選びました/)
  assert.equal(guidance.memory.available, false)
})

test('全分野が同点の弱点なら、存在しない得意分野との比較を根拠にしない', () => {
  const answers = allUnknown()
  const result = scoreDiagnostic(answers, {
    completedAt: '2026-07-29T12:00:00.000Z',
  })
  const guidance = buildDiagnosticGuidance({
    result,
    questions: DIAGNOSTIC_QUESTIONS,
    answers,
  })
  const evidence = guidance.recommendation.evidence.join(' ')

  assert.match(evidence, /同率の弱点が4分野/)
  assert.doesNotMatch(evidence, /比較すると優先順位が明確/)
})

test('診断結果は正解を含む全設問の回答と正答を表示する', () => {
  const source = readFileSync(
    new URL('../src/screens/Diagnostic.jsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /\{reviewItems\.map\(\(review\) =>/)
  assert.match(source, /あなたの回答：/)
  assert.match(source, /正しい答え/)
  assert.doesNotMatch(source, /visibleItems\.map/)
})

test('診断結果は成績表、根拠付きおすすめ、次回計画を答え合わせより先に表示する', () => {
  const source = readFileSync(
    new URL('../src/screens/Diagnostic.jsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /data-diagnostic-performance-report/)
  assert.match(source, /data-diagnostic-matrix/)
  assert.match(source, /data-diagnostic-recommendation/)
  assert.match(source, /なぜ、これがおすすめ？/)
  assert.match(source, /data-diagnostic-study-plan/)
  assert.match(source, /次回は、ここから/)
  assert.match(source, /今後の学習履歴に合わせて予定を更新します/)
  assert.match(source, /公式試験の偏差値や合否ではありません/)
  assert.doesNotMatch(source, /医療検査/)
  assert.doesNotMatch(source, /覚え具合|回答履歴からの推定|脳力|まだ判定できません/)
  assert.ok(
    source.indexOf('<PerformanceReport') < source.indexOf('<AnswerReview'),
    '成績と次回計画を全28問の答え合わせより先に読める',
  )
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
    diagnosticAttempt: 12,
    diagnosticSeed: 1234567890,
    engPos: null,
    portalOrder: [],
    portalHidden: [],
    stats: {},
    settings: {},
  }

  const decoded = decodeProgress(encodeProgress(state))
  assert.deepEqual(decoded.diagnosticHistory, [result])
  assert.equal(decoded.diagnosticAttempt, 12)
  assert.equal(decoded.diagnosticSeed, 1234567890)
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
  assert.throws(
    () => decodeProgress(encodeProgress({ ...state, diagnosticAttempt: -1 })),
    /diagnosticAttempt/,
  )
  assert.throws(
    () => decodeProgress(encodeProgress({ ...state, diagnosticSeed: 0x100000000 })),
    /diagnosticSeed/,
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

test('診断開始回数は中断を含めて進み、同じseedを維持する', () => {
  useStore.setState({ diagnosticAttempt: 0, diagnosticSeed: 987654321 })

  const first = useStore.getState().beginDiagnosticAttempt()
  const second = useStore.getState().beginDiagnosticAttempt()

  assert.deepEqual(first, { attemptNumber: 1, seed: 987654321 })
  assert.deepEqual(second, { attemptNumber: 2, seed: 987654321 })
  assert.equal(useStore.getState().diagnosticAttempt, 2)
  assert.equal(useStore.getState().diagnosticSeed, 987654321)
})
