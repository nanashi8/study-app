import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  LEARNING_STATUS_KEYS,
  QUIZ_STATUS_KEYS,
  contentQuizKey,
  learningStatusForSrsEntry,
  normalizeContentQuizResults,
  quizStatusForSrsEntry,
  recordContentQuizResult,
  statusTotal,
  summarizeCompletionItems,
  summarizeSrsItems,
} from '../src/lib/contentProgress.js'
import {
  LEARNING_CONTENTS,
  LEARNING_CONTENT_GROUPS,
  buildLearningContentProgress,
} from '../src/lib/learningContentProgress.js'
import { KOTEN_GRAMMAR_QUESTIONS } from '../src/data/koten-grammar-questions.js'
import { KOTEN_CULTURE_QUESTIONS } from '../src/data/koten-culture.js'
import {
  PERSISTED_PROGRESS_FIELDS,
  buildPayload,
  decodeProgress,
  encodeProgress,
} from '../src/lib/progressCode.js'
import {
  RESETTABLE_PROGRESS_FIELDS,
  progressResetFieldsForGroups,
} from '../src/lib/progressReset.js'
import {
  createInitialLearningState,
  progressStateFromPayload,
  useStore,
} from '../src/store/useStore.js'
import { progressStateFromCloud } from '../src/lib/cloudSync.js'

const expectedContentIds = [
  'vocab',
  'usage',
  'grammar',
  'listening',
  'dictation',
  'etymology',
  'reading',
  'writing',
  'koten-vocab',
  'koten-grammar',
  'koten-culture',
  'koten-reading',
  'kanbun-vocab',
  'kanbun-grammar',
  'kanbun-culture',
  'kanbun-kundoku',
  'literature',
  'math',
]

test('暗記とクイズは同じ項目でも独立した3区分として集計する', () => {
  const items = ['remembered-wrong', 'forgot-correct', 'quiz-only', 'untouched', 'legacy-long', 'legacy-short']
  const srs = {
    'remembered-wrong': {
      memory: { lastJudgment: 'remembered' },
      test: { lastResult: 'wrong' },
    },
    'forgot-correct': {
      memory: { lastJudgment: 'forgot' },
      test: { lastResult: 'correct' },
    },
    'quiz-only': {
      box: 2,
      memory: { lastJudgment: null },
      test: { lastResult: 'unknown' },
    },
    'legacy-long': { box: 4, correct: 8, wrong: 1 },
    'legacy-short': { box: 2, correct: 2, wrong: 1 },
  }

  const summary = summarizeSrsItems(items, srs)
  assert.deepEqual(summary.learning, { learned: 2, reviewing: 2, unlearned: 2 })
  assert.deepEqual(summary.quiz, { correct: 1, incorrect: 2, unanswered: 3 })
  assert.equal(statusTotal(summary.learning, LEARNING_STATUS_KEYS), items.length)
  assert.equal(statusTotal(summary.quiz, QUIZ_STATUS_KEYS), items.length)
  assert.deepEqual(summary.activeIds, [
    'remembered-wrong',
    'forgot-correct',
    'quiz-only',
    'legacy-long',
    'legacy-short',
  ])

  assert.equal(learningStatusForSrsEntry(srs['remembered-wrong']), 'learned')
  assert.equal(learningStatusForSrsEntry(srs['forgot-correct']), 'reviewing')
  assert.equal(learningStatusForSrsEntry(srs['quiz-only']), 'unlearned')
  assert.equal(quizStatusForSrsEntry(srs['quiz-only']), 'incorrect')
  assert.equal(quizStatusForSrsEntry(srs['legacy-long']), 'unanswered')
})

test('実ストアでも後のクイズが学習判定を、後の自己判定がクイズ結果を上書きしない', () => {
  const original = useStore.getState()
  const fresh = createInitialLearningState()
  try {
    useStore.setState({
      srs: {},
      stats: fresh.stats,
      learningAnalytics: fresh.learningAnalytics,
    })
    useStore.getState().review('remembered-then-wrong', 'remembered')
    useStore.getState().review('remembered-then-wrong', 'wrong')
    useStore.getState().review('correct-then-forgot', 'correct')
    useStore.getState().review('correct-then-forgot', 'forgot')

    const summary = summarizeSrsItems(
      ['remembered-then-wrong', 'correct-then-forgot'],
      useStore.getState().srs,
    )
    assert.deepEqual(summary.learning, { learned: 1, reviewing: 1, unlearned: 0 })
    assert.deepEqual(summary.quiz, { correct: 1, incorrect: 1, unanswered: 0 })
  } finally {
    useStore.setState(original, true)
  }
})

test('SRS外教材は完了状態と直近クイズ結果を独立して保存・集計する', () => {
  let quizResults = recordContentQuizResult({}, {
    domain: 'reading',
    itemId: 'passage-a',
    correct: 3,
    total: 3,
    timestamp: 100,
  })
  quizResults = recordContentQuizResult(quizResults, {
    domain: 'reading',
    itemId: 'passage-b',
    correct: 2,
    total: 3,
    timestamp: 200,
  })
  const summary = summarizeCompletionItems({
    items: ['passage-a', 'passage-b', 'passage-c'],
    completedIds: ['passage-a', 'passage-b'],
    quizResults,
    quizDomain: 'reading',
  })

  assert.deepEqual(summary.learning, { learned: 2, reviewing: 0, unlearned: 1 })
  assert.deepEqual(summary.quiz, { correct: 1, incorrect: 1, unanswered: 1 })
  assert.equal(quizResults[contentQuizKey('reading', 'passage-a')].lastResult, 'correct')
  assert.equal(quizResults[contentQuizKey('reading', 'passage-b')].lastResult, 'wrong')
  assert.deepEqual(normalizeContentQuizResults({ invalid: { total: 0 } }), {})
})

test('全18教材の母集団は重複なく、空状態でも両方の3区分が全件を覆う', () => {
  assert.deepEqual(LEARNING_CONTENTS.map((content) => content.id), expectedContentIds)
  assert.deepEqual(LEARNING_CONTENT_GROUPS.map((group) => group.id), [
    'english',
    'classics',
    'kanbun',
    'other',
  ])
  assert.equal(new Set(expectedContentIds).size, expectedContentIds.length)

  for (const content of LEARNING_CONTENTS) {
    const ids = content.items.map((item) => item?.id).filter(Boolean)
    assert.ok(ids.length > 0, `${content.id}: 母集団が空ではない`)
    assert.equal(new Set(ids).size, ids.length, `${content.id}: 教材IDを重複させない`)
  }

  const rows = buildLearningContentProgress(createInitialLearningState())
  assert.equal(rows.length, expectedContentIds.length)
  for (const row of rows) {
    assert.equal(row.progress.learning.learned, 0, `${row.id}: 初期学習済`)
    assert.equal(row.progress.learning.reviewing, 0, `${row.id}: 初期復習中`)
    assert.equal(row.progress.learning.unlearned, row.progress.total, `${row.id}: 初期未学習`)
    assert.equal(row.progress.quiz.correct, 0, `${row.id}: 初期正解`)
    assert.equal(row.progress.quiz.incorrect, 0, `${row.id}: 初期不正解`)
    assert.equal(row.progress.quiz.unanswered, row.progress.quizTotal, `${row.id}: 初期未回答`)
    assert.equal(statusTotal(row.progress.learning, LEARNING_STATUS_KEYS), row.progress.total)
    assert.equal(statusTotal(row.progress.quiz, QUIZ_STATUS_KEYS), row.progress.quizTotal)
  }
})

test('1項目に複数問ある教材は、クイズだけ出題数を母数にする', () => {
  const rows = buildLearningContentProgress(createInitialLearningState())
  const byId = Object.fromEntries(rows.map((row) => [row.id, row]))

  assert.equal(byId['koten-grammar'].progress.total, 74)
  assert.equal(byId['koten-grammar'].progress.quizTotal, KOTEN_GRAMMAR_QUESTIONS.length)
  assert.equal(byId['koten-grammar'].progress.quizTotal, 136)
  assert.equal(byId['koten-culture'].progress.total, 56)
  assert.equal(byId['koten-culture'].progress.quizTotal, KOTEN_CULTURE_QUESTIONS.length)
  assert.equal(byId['koten-culture'].progress.quizTotal, 112)
  assert.equal(byId['koten-vocab'].progress.quizTotal, 300)

  // 数え方が違う分、単位まで揃えて表示できるようにしておく。
  assert.equal(byId['koten-grammar'].unit, '項目')
  assert.equal(byId['koten-grammar'].quizUnit, '問')
  assert.equal(byId['koten-culture'].unit, 'テーマ')
  assert.equal(byId['koten-culture'].quizUnit, '問')
  assert.equal(byId['koten-vocab'].unit, '語')
  assert.equal(byId['koten-vocab'].quizUnit, '問')

  // 出題1問に答えると、その1問だけが「正解」へ動く。
  const answered = buildLearningContentProgress({
    ...createInitialLearningState(),
    contentQuizResults: recordContentQuizResult({}, {
      domain: 'koten-grammar',
      itemId: KOTEN_GRAMMAR_QUESTIONS[0].id,
      correct: 1,
      total: 1,
    }),
  })
  const grammar = answered.find((row) => row.id === 'koten-grammar')
  assert.equal(grammar.progress.quiz.correct, 1)
  assert.equal(grammar.progress.quiz.unanswered, 135)
  assert.equal(grammar.progress.learning.unlearned, 74)
})

test('SRS外クイズ結果は端末・進捗コード・クラウド・リセット契約を往復する', () => {
  const fresh = createInitialLearningState()
  const contentQuizResults = recordContentQuizResult({}, {
    domain: 'math',
    itemId: 'math-001',
    correct: 1,
    total: 1,
    timestamp: 123456,
  })
  const state = { ...fresh, contentQuizResults }

  assert.ok(PERSISTED_PROGRESS_FIELDS.includes('contentQuizResults'))
  assert.ok(RESETTABLE_PROGRESS_FIELDS.includes('contentQuizResults'))
  assert.ok(progressResetFieldsForGroups(['results']).includes('contentQuizResults'))
  assert.deepEqual(buildPayload(state).contentQuizResults, contentQuizResults)

  const decoded = decodeProgress(encodeProgress(state))
  assert.deepEqual(decoded.contentQuizResults, contentQuizResults)
  assert.deepEqual(progressStateFromPayload(decoded).contentQuizResults, contentQuizResults)
  assert.deepEqual(progressStateFromCloud(decoded, fresh).contentQuizResults, contentQuizResults)
})

test('長文・名作・数学の採点画面は教材別の直近クイズ結果を書き込む', () => {
  const writers = [
    ['../src/components/ReadingComprehensionCheck.jsx', /recordContentQuizResult\('reading', passageId/],
    ['../src/screens/LiteratureReader.jsx', /recordContentQuizResult\(\s*'literature'/],
    ['../src/screens/MathSolve.jsx', /recordContentQuizResult\('math', p\.id/],
  ]
  for (const [file, pattern] of writers) {
    const source = readFileSync(new URL(file, import.meta.url), 'utf8')
    assert.match(source, pattern, file)
  }

  const before = useStore.getState().contentQuizResults
  try {
    useStore.getState().recordContentQuizResult('reading', 'runtime-passage', 2, 2)
    assert.equal(
      useStore.getState().contentQuizResults['reading:runtime-passage'].lastResult,
      'correct',
    )
  } finally {
    useStore.setState({ contentQuizResults: before })
  }
})

test('共通バーは指定の6ラベル・6区分・3色ずつを一元定義する', () => {
  const source = readFileSync(
    new URL('../src/components/LearningStatusBars.jsx', import.meta.url),
    'utf8',
  )
  for (const label of ['学習済', '復習中', '未学習', '正解', '不正解', '未回答']) {
    assert.match(source, new RegExp(`label: '${label}'`))
  }
  for (const color of ['#059669', '#f59e0b', '#cbd5e1', '#0284c7', '#e11d48']) {
    assert.match(source, new RegExp(color))
  }
  assert.match(source, /data-status-segment=\{key\}/)

  const myLearning = readFileSync(new URL('../src/screens/MyLearning.jsx', import.meta.url), 'utf8')
  const progress = readFileSync(new URL('../src/screens/Progress.jsx', import.meta.url), 'utf8')
  assert.match(myLearning, /LEARNING_CONTENT_GROUPS\.map/)
  assert.match(myLearning, /buildLearningContentProgress/)
  assert.match(myLearning, /shrink-0 items-center gap-1 whitespace-nowrap/)
  assert.match(progress, /data-all-content-status/)
  assert.match(progress, /buildLearningContentProgress/)
  assert.match(progress, /table-fixed border-collapse/)
  assert.match(progress, /\[word-break:keep-all\]/)

  for (const file of [
    '../src/components/VocabCompletionReport.jsx',
    '../src/screens/Diagnostic.jsx',
    '../src/screens/EtymologyPack.jsx',
    '../src/screens/ReadingPrep.jsx',
    '../src/screens/RootDetail.jsx',
    '../src/screens/VocabDecks.jsx',
    '../src/screens/WordDetail.jsx',
  ]) {
    const detail = readFileSync(new URL(file, import.meta.url), 'utf8')
    assert.match(detail, /LearningStatusBars|StatusDistributionBar/, file)
  }
})
