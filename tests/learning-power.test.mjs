import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  buildLearningPowerProfile,
  formatWindow,
  hourIsInWindow,
} from '../src/lib/learningPower.js'
import {
  createLearningAnalytics,
  recordLearningEvent,
} from '../src/lib/learningAnalytics.js'

const localTime = (day, hour) => new Date(2026, 6, day, hour, 0, 0, 0).getTime()

function diagnostic(overrides = {}) {
  return {
    id: 'diagnostic-profile',
    completedAt: new Date(localTime(28, 9)).toISOString(),
    deviation: 62,
    total: 28,
    prioritySkillId: 'grammar',
    ...overrides,
  }
}

function trackedWeek() {
  let analytics = createLearningAnalytics()
  for (const day of [24, 25, 26, 27, 28]) {
    analytics = recordLearningEvent(
      analytics,
      { skill: 'vocab', inputs: 10, scored: 10, correct: 9 },
      localTime(day, 8),
    )
    analytics = recordLearningEvent(
      analytics,
      { skill: 'grammar', inputs: 5, scored: 5, correct: 2 },
      localTime(day, 9),
    )
  }
  return analytics
}

test('テスト結果と学習習慣から4軸の学習脳力プロフィールを作る', () => {
  const profile = buildLearningPowerProfile({
    learningAnalytics: trackedWeek(),
    srsStores: [{
      fragile: { box: 0, correct: 1, wrong: 2 },
      short: { box: 2, correct: 3, wrong: 1 },
      long: { box: 5, correct: 7, wrong: 1 },
    }],
    diagnosticHistory: [diagnostic()],
    stats: {},
    now: localTime(29, 8),
  })

  assert.equal(profile.dimensions.length, 4)
  assert.equal(profile.dimensions.find((item) => item.id === 'testing').score, 62)
  assert.equal(profile.dimensions.find((item) => item.id === 'consistency').score, 91)
  assert.ok(profile.dimensions.find((item) => item.id === 'memory').score > 0)
  assert.ok(profile.dimensions.find((item) => item.id === 'rhythm').score > 0)
  assert.ok(profile.score > 0 && profile.score <= 100)
  assert.equal(profile.habit.activeDays7, 5)
  assert.equal(profile.recommendation.id, 'focus')
  assert.equal(profile.recommendation.screen, 'grammar')
})

test('測定根拠がないときは総合値を作らず、診断テストを提案する', () => {
  const profile = buildLearningPowerProfile({
    learningAnalytics: createLearningAnalytics(),
    now: localTime(29, 12),
  })

  assert.equal(profile.score, null)
  assert.equal(profile.confidence, 'empty')
  assert.ok(profile.dimensions.every((item) => item.score == null))
  assert.equal(profile.recommendation.id, 'measure')
  assert.equal(profile.recommendation.screen, 'diagnostic')
})

test('既存SRSに復習待ちがある場合は、診断前でも記憶の維持を優先する', () => {
  const profile = buildLearningPowerProfile({
    learningAnalytics: createLearningAnalytics(),
    srsStores: [{ legacy: { box: 0, correct: 2, wrong: 1 } }],
    dueCount: 4,
    now: localTime(29, 12),
  })

  assert.equal(profile.recommendation.id, 'review')
  assert.equal(profile.recommendation.actionLabel, '4語を復習')
})

test('集中しやすい時間外で復習待ちがあれば、新規課題より復習を優先する', () => {
  const profile = buildLearningPowerProfile({
    learningAnalytics: trackedWeek(),
    srsStores: [{ known: { box: 5, correct: 12, wrong: 1 } }],
    diagnosticHistory: [diagnostic()],
    dueCount: 8,
    now: localTime(29, 20),
  })

  assert.equal(profile.recommendation.id, 'review')
  assert.equal(profile.recommendation.screen, 'vocabStudy')
  assert.deepEqual(profile.recommendation.params.source, { type: 'due' })
  assert.match(profile.recommendation.timing, /集中課題は/)
})

test('弱点がなく記憶と問題対応が安定していれば応用課題へ進める', () => {
  let analytics = createLearningAnalytics()
  for (const day of [24, 25, 26, 27, 28]) {
    analytics = recordLearningEvent(
      analytics,
      { skill: 'vocab', inputs: 10, scored: 10, correct: 9 },
      localTime(day, 8),
    )
    analytics = recordLearningEvent(
      analytics,
      { skill: 'grammar', inputs: 10, scored: 10, correct: 9 },
      localTime(day, 9),
    )
  }
  const profile = buildLearningPowerProfile({
    learningAnalytics: analytics,
    srsStores: [{
      long1: { box: 5, correct: 12, wrong: 1 },
      long2: { box: 6, correct: 15, wrong: 1 },
    }],
    diagnosticHistory: [diagnostic({ deviation: 68, prioritySkillId: null })],
    now: localTime(29, 20),
  })

  assert.equal(profile.recommendation.id, 'challenge')
  assert.equal(profile.recommendation.screen, 'readingList')
})

test('古くなった診断は復習待ちがない時点で再測定を提案する', () => {
  const profile = buildLearningPowerProfile({
    learningAnalytics: trackedWeek(),
    diagnosticHistory: [
      diagnostic({ completedAt: new Date(localTime(1, 9)).toISOString() }),
    ],
    now: localTime(31, 20),
  })

  assert.equal(profile.recommendation.id, 'remeasure')
  assert.equal(profile.recommendation.screen, 'diagnostic')
})

test('日をまたぐ得意時間帯を判定し、日本語表示にする', () => {
  const window = { start: 23, end: 2 }
  assert.equal(hourIsInWindow(23, window), true)
  assert.equal(hourIsInWindow(1, window), true)
  assert.equal(hourIsInWindow(12, window), false)
  assert.equal(formatWindow(window), '23:00〜翌02:00')
})

test('画面では推定値をIQや固定能力と区別し、メニューの推薦に利用する', () => {
  const analyticsSource = readFileSync(
    new URL('../src/components/LearningAnalytics.jsx', import.meta.url),
    'utf8',
  )
  const menuSource = readFileSync(
    new URL('../src/components/SpeechSettings.jsx', import.meta.url),
    'utf8',
  )
  const advisorSource = readFileSync(
    new URL('../src/components/LearningAdvisor.jsx', import.meta.url),
    'utf8',
  )

  assert.match(analyticsSource, /固定された才能やIQではなく/)
  assert.match(analyticsSource, /diagnosticHistory/)
  assert.match(analyticsSource, /data-diagnostic-status/)
  assert.match(analyticsSource, /最新の学習診断/)
  assert.match(analyticsSource, /今回の得意/)
  assert.match(analyticsSource, /復習優先/)
  assert.match(analyticsSource, /profile\.diagnostic/)
  assert.match(menuSource, /buildLearningPowerProfile/)
  assert.match(menuSource, /data-menu-advisor-entry/)
  assert.match(menuSource, /<LearningAdvisorPanel/)
  assert.match(advisorSource, /profile\.recommendation/)
  assert.match(advisorSource, /次に進む学習/)
  assert.match(advisorSource, /固定された能力やIQ/)
})

test('単語の学習・テスト結果は、復習・次へ・戻るの3導線にそろえる', () => {
  const resultSource = readFileSync(
    new URL('../src/screens/SessionResult.jsx', import.meta.url),
    'utf8',
  )
  const reportSource = readFileSync(
    new URL('../src/components/VocabCompletionReport.jsx', import.meta.url),
    'utf8',
  )

  assert.match(resultSource, /isVocabStudy = mode === 'study' && engine === 'word'/)
  assert.match(resultSource, /isVocabResult = engine === 'word' \|\| engine === 'vocab'/)
  for (const source of [resultSource, reportSource]) {
    assert.match(source, /復習する/)
    assert.match(source, /次へ進む/)
    assert.match(source, /戻る/)
  }
  assert.doesNotMatch(reportSource, /今回の\{session\.total\}語を腕試し|詳細な記録|ホーム/)
})
