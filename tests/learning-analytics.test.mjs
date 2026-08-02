import test from 'node:test'
import assert from 'node:assert/strict'

import {
  LEARNING_SKILLS,
  analyzeLearning,
  createLearningAnalytics,
  learningSkillForItem,
  recordLearningEvent,
} from '../src/lib/learningAnalytics.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import { useStore } from '../src/store/useStore.js'

const atHour = (hour) => new Date(2026, 6, 28, hour, 0, 0, 0).getTime()

test('学習集計は時刻・反復間隔・長期記憶への移行を回答内容なしで保持する', () => {
  let analytics = createLearningAnalytics()
  analytics = recordLearningEvent(
    analytics,
    {
      skill: 'vocab',
      inputs: 10,
      scored: 10,
      correct: 9,
      gapHours: 2,
      beforeBox: 3,
      afterBox: 4,
      repetitions: 6,
    },
    atHour(8),
  )
  analytics = recordLearningEvent(
    analytics,
    { skill: 'vocab', inputs: 10, scored: 10, correct: 8, gapHours: 30 },
    atHour(9),
  )
  analytics = recordLearningEvent(
    analytics,
    { skill: 'vocab', inputs: 10, scored: 10, correct: 9, gapHours: 200 },
    atHour(10),
  )
  analytics = recordLearningEvent(
    analytics,
    { skill: 'grammar', inputs: 10, scored: 10, correct: 4 },
    atHour(21),
  )

  assert.equal(analytics.inputs, 40)
  assert.equal(analytics.scored, 40)
  assert.equal(analytics.correct, 30)
  assert.deepEqual(analytics.longTerm, { items: 1, repetitions: 6 })
  assert.equal(analytics.hours[8].correct, 9)
  assert.equal(analytics.intervals.under6h.scored, 10)
  assert.equal(analytics.intervals.under3d.scored, 10)
  assert.equal(analytics.intervals.over7d.scored, 10)
  assert.equal('prompt' in analytics, false)
  assert.equal('answer' in analytics, false)
})

test('定着分析は短期・長期の割合、得意不得意、効率の高い時間帯を算出する', () => {
  let analytics = createLearningAnalytics()
  for (const [hour, correct] of [[8, 9], [9, 8], [10, 9]]) {
    analytics = recordLearningEvent(
      analytics,
      { skill: 'vocab', inputs: 10, scored: 10, correct },
      atHour(hour),
    )
  }
  analytics = recordLearningEvent(
    analytics,
    { skill: 'grammar', inputs: 10, scored: 10, correct: 4 },
    atHour(21),
  )

  const analysis = analyzeLearning({
    learningAnalytics: analytics,
    srsStores: [{
      fragile: { box: 0, correct: 1, wrong: 2 },
      short: { box: 2, correct: 3, wrong: 1 },
      long: { box: 4, correct: 5, wrong: 1 },
    }],
    skillStats: {},
  })

  assert.equal(analysis.stages.fragilePct, 33)
  assert.equal(analysis.stages.shortPct, 33)
  assert.equal(analysis.stages.longPct, 33)
  assert.equal(analysis.bestWindow.start, 8)
  assert.equal(analysis.strength.id, 'vocab')
  assert.equal(analysis.weakness.id, 'grammar')
  assert.equal(analysis.repetitionsToLongTerm, 6)
  assert.equal(analysis.retentionRate, 0.75)
  assert.equal(analysis.forgettingRate, 0.25)
})

test('既存SRSだけでも初期推定し、時刻分析は未計測として扱う', () => {
  const analysis = analyzeLearning({
    learningAnalytics: null,
    srsStores: [{
      a: { box: 1, correct: 2, wrong: 1 },
      b: { box: 5, correct: 6, wrong: 2 },
    }],
  })

  assert.equal(analysis.source, 'srs-fallback')
  assert.equal(analysis.inputs, 11)
  assert.equal(analysis.retentionRate, 8 / 11)
  assert.equal(analysis.bestWindow, null)
  assert.equal(analysis.stages.short, 1)
  assert.equal(analysis.stages.long, 1)
})

test('教材IDと明示ヒントから分析分野を判定する', () => {
  assert.equal(learningSkillForItem('gr_5_be_1'), 'grammar')
  assert.equal(learningSkillForItem('idm_get_up'), 'usage')
  assert.equal(learningSkillForItem('ordinary-word'), 'vocab')
})

test('現在サポートしていない旧分野は履歴の総数を保ったまま分析表示から外す', () => {
  const learningAnalytics = recordLearningEvent(
    createLearningAnalytics(),
    { skill: 'retired-skill', inputs: 8, scored: 8, correct: 3 },
    atHour(11),
  )
  const analysis = analyzeLearning({
    learningAnalytics,
    skillStats: {
      'retired-skill': { answered: 8, correct: 3, sessions: 1 },
    },
  })

  assert.equal(analysis.scored, 8)
  assert.equal(analysis.correct, 3)
  assert.equal(analysis.skills.some((skill) => skill.id === 'retired-skill'), false)
})

test('通常の復習操作はSRSと時刻分析を同時に一度だけ更新する', () => {
  useStore.setState({
    srs: {},
    stats: { xp: 0, streak: 0, day: null, todayCount: 0, answered: 0, correct: 0 },
    learningAnalytics: createLearningAnalytics(),
  })

  useStore.getState().review('test-word', 'correct', 'vocab')
  let state = useStore.getState()
  assert.equal(state.srs['test-word'].box, 1)
  assert.ok(Number.isFinite(state.srs['test-word'].lastAt))
  assert.equal(state.learningAnalytics.inputs, 1)
  assert.equal(state.learningAnalytics.scored, 1)
  assert.equal(state.learningAnalytics.correct, 1)

  useStore.getState().review('test-word', 'wrong', 'vocab')
  state = useStore.getState()
  assert.equal(state.learningAnalytics.inputs, 2)
  assert.equal(state.learningAnalytics.scored, 2)
  assert.equal(state.learningAnalytics.correct, 1)
  assert.equal(state.learningAnalytics.intervals.under1h.scored, 1)
})

test('全13分野の学習操作が対応する記録へ漏れなく反映される', () => {
  const original = useStore.getState()
  useStore.setState({
    srs: {},
    etymologySrs: {},
    kotenSrs: {},
    kotenGrammarSrs: {},
    kotenCultureSrs: {},
    kotenInterpretationSrs: {},
    writingProgress: {},
    mathMastery: {},
    skillStats: {},
    learningAnalytics: createLearningAnalytics(),
    stats: { xp: 0, streak: 0, day: null, todayCount: 0, answered: 0, correct: 0 },
  })

  try {
    useStore.getState().review('audit-vocab', 'correct', 'vocab')
    useStore.getState().review('audit-grammar', 'correct', 'grammar')
    useStore.getState().review('audit-usage', 'correct', 'usage')
    useStore.getState().review('audit-listening', 'correct', 'listening')
    useStore.getState().review('audit-dictation', 'correct', 'dictation')
    useStore.getState().reviewEtymology('audit-etymology', 'remembered')
    useStore.getState().reviewKoten('audit-koten', 'remembered')
    useStore.getState().reviewKotenGrammar('audit-koten-grammar', 'remembered')
    useStore.getState().reviewKotenCulture('audit-koten-culture', 'remembered')
    useStore.getState().reviewKotenInterpretation('audit-koten-reading', 'correct')
    useStore.getState().recordSkillResult('reading', 3, 4)
    useStore.getState().recordWritingCompletion({
      exerciseId: 'audit-writing',
      text: 'I keep a careful learning record.',
      mode: 'guide',
      wordCount: 6,
      grammarIds: [],
    })
    useStore.getState().setMathMastery('audit-math', 80)

    const state = useStore.getState()
    assert.deepEqual(
      Object.keys(state.learningAnalytics.skills).sort(),
      Object.keys(LEARNING_SKILLS).sort(),
    )
    assert.equal(state.srs['audit-vocab'].box, 1)
    assert.equal(state.etymologySrs['audit-etymology'].box, 1)
    assert.equal(state.kotenSrs['audit-koten'].box, 1)
    assert.equal(state.kotenGrammarSrs['audit-koten-grammar'].box, 1)
    assert.equal(state.kotenCultureSrs['audit-koten-culture'].box, 1)
    assert.equal(state.kotenInterpretationSrs['audit-koten-reading'].box, 1)
    assert.equal(state.skillStats.reading.answered, 4)
    assert.equal(state.writingProgress['audit-writing'].completed, 1)
    assert.equal(state.mathMastery['audit-math'], 80)
  } finally {
    useStore.setState(original, true)
  }
})

test('クイズ結果の分野別累計は設問履歴と二重集計せず、読解結果は集計する', () => {
  useStore.setState({
    skillStats: {},
    learningAnalytics: createLearningAnalytics(),
  })

  useStore.getState().recordSkillResult('vocab', 4, 5, { trackLearning: false })
  let state = useStore.getState()
  assert.equal(state.skillStats.vocab.answered, 5)
  assert.equal(state.learningAnalytics.inputs, 0)

  useStore.getState().recordSkillResult('reading', 4, 5)
  state = useStore.getState()
  assert.equal(state.skillStats.reading.answered, 5)
  assert.equal(state.learningAnalytics.inputs, 5)
  assert.equal(state.learningAnalytics.scored, 5)
  assert.equal(state.learningAnalytics.correct, 4)
})

test('学習分析は進捗コードで持ち運べる', () => {
  const learningAnalytics = recordLearningEvent(
    createLearningAnalytics(),
    { skill: 'reading', inputs: 5, scored: 5, correct: 4 },
    atHour(14),
  )
  const state = {
    srs: {},
    kotenSrs: {},
    kotenInterpretationSrs: {},
    myList: [],
    myGrammarList: [],
    writingProgress: {},
    kotenWordList: [],
    kotenGrammarList: [],
    readingsDone: [],
    mathDone: [],
    mathMastery: {},
    skillStats: {},
    learningAnalytics,
    diagnosticHistory: [],
    engPos: null,
    portalOrder: [],
    portalHidden: [],
    stats: {},
    settings: {},
  }

  const decoded = decodeProgress(encodeProgress(state))
  assert.deepEqual(decoded.learningAnalytics, learningAnalytics)
  assert.throws(
    () => decodeProgress(encodeProgress({ ...state, learningAnalytics: [] })),
    /learningAnalytics/,
  )
})
