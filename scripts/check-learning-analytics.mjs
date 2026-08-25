import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ALL_WORDS, ETYMOLOGY_PACKS } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { GRAMMAR_PRACTICE } from '../src/data/grammar.js'
import { LISTENING_ITEMS } from '../src/data/listening.js'
import { DICTATION_ITEMS } from '../src/data/dictation.js'
import { KOTEN_WORDS } from '../src/data/koten.js'
import { KOTEN_GRAMMAR } from '../src/data/koten-grammar.js'
import { KOTEN_CULTURE } from '../src/data/koten-culture.js'
import { KOTEN_INTERPRETATIONS } from '../src/data/koten-interpretations.js'
import { KANBUN_VOCAB } from '../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../src/data/kanbun-grammar.js'
import { KANBUN_CULTURE } from '../src/data/kanbun-culture.js'
import { KANBUN_KUNDOKU_EXERCISES } from '../src/data/kanbun-kundoku.js'
import { MATH_UNITS } from '../src/data/math.js'
import {
  analyzeLearning,
  createLearningAnalytics,
  normalizeLearningAnalytics,
  recordLearningEvent,
} from '../src/lib/learningAnalytics.js'
import {
  LEARNING_REPORT_DOMAINS,
  buildLearningAnalyticsReport,
  forgettingCurveForRows,
  learningLaunchFor,
} from '../src/lib/learningAnalyticsReport.js'

const now = new Date(2026, 7, 13, 18, 0, 0, 0).getTime()
const entry = (index) => ({
  box: index % 10,
  correct: 3,
  wrong: 1,
  due: 0,
  last: 0,
  lastAt: now - (index % 31) * 86400000,
  firstAt: now - 45 * 86400000,
  memory: {
    passes: 2,
    remembered: 1,
    forgot: 1,
    lastAt: now - 3 * 86400000,
    lastHour: index % 24,
    lastJudgment: index % 2 ? 'remembered' : 'forgot',
  },
  test: {
    attempts: 2,
    correct: 1,
    wrong: 1,
    unknown: 0,
    lastAt: now - 2 * 86400000,
    lastResult: index % 2 ? 'correct' : 'wrong',
  },
})

const asStore = (items, offset = 0) => Object.fromEntries(
  items.map((item, index) => [item.id, entry(index + offset)]),
)

const sharedCollections = [ALL_WORDS, PHRASES, GRAMMAR_PRACTICE, LISTENING_ITEMS, DICTATION_ITEMS]
const sharedIds = sharedCollections.flatMap((items) => items.map((item) => item.id))
assert.equal(
  new Set(sharedIds).size,
  sharedIds.length,
  '共通SRS内で教材IDが衝突しています',
)

const state = {
  srs: asStore(sharedIds.map((id) => ({ id }))),
  etymologySrs: asStore(ETYMOLOGY_PACKS, sharedIds.length),
  kotenSrs: asStore(KOTEN_WORDS, sharedIds.length + ETYMOLOGY_PACKS.length),
  kotenGrammarSrs: asStore(KOTEN_GRAMMAR),
  kotenCultureSrs: asStore(KOTEN_CULTURE),
  kotenInterpretationSrs: asStore(KOTEN_INTERPRETATIONS),
  kanbunVocabSrs: asStore(KANBUN_VOCAB),
  kanbunGrammarSrs: asStore(KANBUN_GRAMMAR),
  kanbunCultureSrs: asStore(KANBUN_CULTURE),
  kanbunKundokuSrs: asStore(KANBUN_KUNDOKU_EXERCISES),
  mathMastery: Object.fromEntries(MATH_UNITS.map((unit) => [unit.id, 75])),
  skillStats: {},
}

let analytics = createLearningAnalytics()
for (let hour = 0; hour < 24; hour += 1) {
  for (let sample = 0; sample < 5; sample += 1) {
    analytics = recordLearningEvent(
      analytics,
      {
        skill: 'vocab',
        activity: 'memory',
        inputs: 1,
        scored: 1,
        correct: sample < 4 ? 1 : 0,
      },
      new Date(2026, 7, 1 + sample, hour, 0, 0, 0).getTime(),
    )
    analytics = recordLearningEvent(
      analytics,
      {
        skill: 'vocab',
        activity: 'test',
        inputs: 1,
        scored: 1,
        correct: hour < 12 ? 1 : sample < 2 ? 1 : 0,
        memoryHour: hour,
        memoryPasses: (hour % 6) + 1,
      },
      new Date(2026, 7, 1 + sample, (hour + 2) % 24, 0, 0, 0).getTime(),
    )
  }
}

const analysis = analyzeLearning({
  learningAnalytics: analytics,
  srsStores: [
    state.srs,
    state.etymologySrs,
    state.kotenSrs,
    state.kotenGrammarSrs,
    state.kotenCultureSrs,
    state.kotenInterpretationSrs,
    state.kanbunVocabSrs,
    state.kanbunGrammarSrs,
    state.kanbunCultureSrs,
    state.kanbunKundokuSrs,
  ],
})
const report = buildLearningAnalyticsReport(state, analysis, now)

const expectedByDomain = {
  vocab: ALL_WORDS.length,
  phrases: PHRASES.length,
  grammar: GRAMMAR_PRACTICE.length,
  listening: LISTENING_ITEMS.length,
  dictation: DICTATION_ITEMS.length,
  etymology: ETYMOLOGY_PACKS.length,
  kotenVocab: KOTEN_WORDS.length,
  kotenGrammar: KOTEN_GRAMMAR.length,
  kotenCulture: KOTEN_CULTURE.length,
  kotenReading: KOTEN_INTERPRETATIONS.length,
  kanbunVocab: KANBUN_VOCAB.length,
  kanbunGrammar: KANBUN_GRAMMAR.length,
  kanbunCulture: KANBUN_CULTURE.length,
  kanbunKundoku: KANBUN_KUNDOKU_EXERCISES.length,
  math: MATH_UNITS.length,
}
const actualByDomain = Object.fromEntries(
  Object.keys(expectedByDomain).map((domain) => [
    domain,
    report.itemRows.filter((row) => row.domain === domain).length,
  ]),
)
assert.deepEqual(actualByDomain, expectedByDomain, '全教材の分析カタログ件数が一致しません')
assert.equal(
  report.itemRows.length,
  Object.values(expectedByDomain).reduce((sum, value) => sum + value, 0),
  '項目別成績表に欠落または重複があります',
)
assert.equal(new Set(report.itemRows.map((row) => row.key)).size, report.itemRows.length)

for (const row of report.itemRows) {
  assert.ok(row.title && row.catalogResolved, `${row.key}: 教材名を解決できません`)
  assert.ok(row.field, `${row.key}: 分野が空です`)
  assert.ok(row.typeLabel, `${row.key}: 種類が空です`)
  assert.ok(['english', 'koten', 'kanbun', 'math'].includes(row.subject), `${row.key}: 科目が不正です`)
  assert.ok(row.gradeScore >= 0 && row.gradeScore <= 100, `${row.key}: 評定値が範囲外です`)
  if (Number.isFinite(row.predictedRetention)) {
    assert.ok(row.predictedRetention >= 0 && row.predictedRetention <= 1)
    const curve = forgettingCurveForRows([row])
    assert.ok(curve[0].retention >= curve.at(-1).retention, `${row.key}: 忘却曲線が増加しています`)
  }
}

for (const dimension of ['subject', 'type', 'field', 'item']) {
  assert.ok(report.groups[dimension].length > 0, `${dimension}: 成績表が空です`)
}
assert.deepEqual(
  new Set(report.groups.subject.map((group) => group.id)),
  new Set(['english', 'koten', 'kanbun', 'math']),
)

const firstIdByDomain = Object.fromEntries(
  Object.keys(LEARNING_REPORT_DOMAINS).map((domain) => [
    domain,
    report.itemRows.find((row) => row.domain === domain)?.id,
  ]),
)
for (const [domain, meta] of Object.entries(LEARNING_REPORT_DOMAINS)) {
  const id = firstIdByDomain[domain]
  if (meta.memory) {
    const launch = learningLaunchFor(domain, id ? [id] : [], 'memory')
    assert.ok(launch.screen, `${domain}: 暗記開始先がありません`)
  }
  if (meta.test) {
    const launch = learningLaunchFor(domain, id ? [id] : [], 'test')
    assert.ok(launch.screen, `${domain}: テスト開始先がありません`)
  }
}

assert.equal(analysis.activity.memory.scored, 120)
assert.equal(analysis.activity.test.scored, 120)
assert.equal(analysis.memoryCohortHourly.every((stat) => stat.scored === 5), true)
assert.equal(analysis.memoryPasses.every((stat) => stat.scored > 0), true)
assert.ok(report.prescriptions.length > 0 && report.prescriptions.length <= 8)

const normalizedLegacy = normalizeLearningAnalytics({
  version: 1,
  inputs: 2,
  scored: 2,
  correct: 1,
  hours: { 8: { inputs: 2, scored: 2, correct: 1 } },
})
assert.equal(normalizedLegacy.inputs, 2)
assert.equal(normalizedLegacy.version, 2)
assert.deepEqual(normalizedLegacy.modes.memory.hours, {})

const serialized = JSON.stringify(analytics)
for (const forbidden of ['prompt', 'answer', 'question', 'submittedText']) {
  assert.equal(serialized.includes(`"${forbidden}"`), false, `回答内容 ${forbidden} を保存しています`)
}

const componentSource = readFileSync(
  new URL('../src/components/LearningAnalytics.jsx', import.meta.url),
  'utf8',
)
const storeSource = readFileSync(new URL('../src/store/useStore.js', import.meta.url), 'utf8')
const progressSource = readFileSync(new URL('../src/screens/Progress.jsx', import.meta.url), 'utf8')
for (const marker of [
  'data-activity-progress-split',
  'data-learning-gradebook',
  'data-24-hour-effect-clock',
  'data-memory-pass-effect',
  'data-personalized-prescriptions',
  'data-random-study-wisdom',
]) {
  assert.match(componentSource, new RegExp(marker), `${marker}: 分析UIがありません`)
}
assert.doesNotMatch(
  componentSource,
  /data-forgetting-curve-analysis|忘却曲線|復習の段階|記憶段階|覚えている見込み|profile\.score|dimension\.score|group\.grade/,
  '内部の予測値・段階・総合点を学習者向けUIへ表示しています',
)
for (const field of ['activity', 'memoryPasses', 'memoryHour', 'firstAt', 'lastJudgment']) {
  assert.match(storeSource, new RegExp(field), `${field}: 項目別記録契約がありません`)
}
assert.match(progressSource, /progressState=\{full\}/)

console.log('学習分析監査: PASS')
console.log(`  全項目: ${report.itemRows.length.toLocaleString('ja-JP')}`)
console.log(`  科目: ${report.groups.subject.length} / 種類: ${report.groups.type.length} / 分野: ${report.groups.field.length}`)
console.log(`  暗記時刻標本: ${analysis.memoryCohortHourly.reduce((sum, item) => sum + item.scored, 0)}`)
console.log(`  処方ルール出力: ${report.prescriptions.length}`)
