import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ALL_WORDS } from '../src/data/vocab.js'
import { buildVocabCompletionReport } from '../src/lib/learningAnalyticsReport.js'
import { PERSISTED_PROGRESS_FIELDS } from '../src/lib/progressCode.js'

const DAY_MS = 86400000
const dayIndex = (timestamp) => {
  const offset = new Date(timestamp).getTimezoneOffset()
  return Math.floor((timestamp - offset * 60000) / DAY_MS)
}

const memoryEntry = ({ box, due, now, firstAt, judgment }) => ({
  box,
  correct: judgment === 'remembered' ? 1 : 0,
  wrong: judgment === 'forgot' ? 1 : 0,
  due,
  last: dayIndex(now),
  lastAt: now,
  firstAt,
  memory: {
    passes: 1,
    remembered: judgment === 'remembered' ? 1 : 0,
    forgot: judgment === 'forgot' ? 1 : 0,
    lastAt: now,
    lastHour: new Date(now).getHours(),
    lastJudgment: judgment,
  },
  test: {
    attempts: 0,
    correct: 0,
    wrong: 0,
    unknown: 0,
    lastAt: null,
    lastResult: null,
  },
})

test('暗記完了レポートは今回・今日・定着対象・復習予定・忘却曲線を同じSRSから作る', () => {
  const now = new Date(2026, 7, 14, 18, 0, 0, 0).getTime()
  const today = dayIndex(now)
  const [first, forgot, mastered] = ALL_WORDS.slice(0, 3)
  const srs = {
    [first.id]: memoryEntry({
      box: 1,
      due: today + 1,
      now,
      firstAt: now,
      judgment: 'remembered',
    }),
    [forgot.id]: memoryEntry({
      box: 0,
      due: today,
      now,
      firstAt: now - 10 * DAY_MS,
      judgment: 'forgot',
    }),
    [mastered.id]: memoryEntry({
      box: 4,
      due: today + 7,
      now,
      firstAt: now - 30 * DAY_MS,
      judgment: 'remembered',
    }),
    // 熟語は共有SRSにあっても「今日の英単語」へ混ぜない。
    idm_get_up: memoryEntry({
      box: 1,
      due: today + 1,
      now,
      firstAt: now,
      judgment: 'remembered',
    }),
  }

  const report = buildVocabCompletionReport({
    srs,
    wordIds: [first.id, forgot.id, mastered.id],
    reviewIds: [forgot.id],
    beforeBoxes: {
      [first.id]: null,
      [forgot.id]: 2,
      [mastered.id]: 3,
    },
    correct: 2,
    wrong: 1,
    dailyGoal: 5,
    now,
  })

  assert.deepEqual(
    {
      total: report.session.total,
      remembered: report.session.remembered,
      forgot: report.session.forgot,
      newCount: report.session.newCount,
      advancedCount: report.session.advancedCount,
      newlyMasteredCount: report.session.newlyMasteredCount,
      reviewNowCount: report.session.reviewNowCount,
    },
    {
      total: 3,
      remembered: 2,
      forgot: 1,
      newCount: 1,
      advancedCount: 2,
      newlyMasteredCount: 1,
      reviewNowCount: 1,
    },
  )
  assert.deepEqual(report.today, {
    uniqueWords: 3,
    newWords: 1,
    rememberedLatest: 2,
    needsReviewLatest: 1,
    goal: 5,
    goalRate: 0.6,
    goalReached: false,
  })
  assert.equal(report.priorityItems[0].id, forgot.id)
  assert.equal(report.priorityItems[0].needsReviewNow, true)
  assert.deepEqual(
    Object.fromEntries(report.schedule.map((item) => [item.id, item.count])),
    { now: 1, tomorrow: 1, soon: 0, later: 1 },
  )
  assert.deepEqual(
    Object.fromEntries(report.schedule.map((item) => [item.id, item.ids])),
    {
      now: [forgot.id],
      tomorrow: [first.id],
      soon: [],
      later: [mastered.id],
    },
  )
  assert.equal(report.nextReviewInDays, 0)
  assert.ok(report.curve[0].retention > report.curve.at(-1).retention)
})

test('暗記完了画面は全単語暗記入口の合流点だけで詳細レポートを表示する', () => {
  const study = readFileSync(
    new URL('../src/screens/VocabStudy.jsx', import.meta.url),
    'utf8',
  )
  const result = readFileSync(
    new URL('../src/screens/SessionResult.jsx', import.meta.url),
    'utf8',
  )
  const report = readFileSync(
    new URL('../src/components/VocabCompletionReport.jsx', import.meta.url),
    'utf8',
  )

  assert.match(study, /vocabSession:\s*\{/)
  assert.match(study, /wordIds:\s*deck\.map\(\(item\) => item\.id\)/)
  assert.match(study, /beforeBoxes:\s*Object\.fromEntries/)
  assert.match(result, /isVocabStudy.*params\.vocabSession/s)
  assert.match(result, /buildVocabCompletionReport/)
  assert.match(result, /source:\s*\{ type: 'mylist', ids: vocabReviewIds \}/)
  assert.match(result, /if \(isDragonVein\)[\s\S]*if \(vocabCompletion\)/)

  for (const contract of [
    'data-vocab-completion-report',
    'data-vocab-completion-today',
    'data-vocab-completion-priority',
    'data-vocab-forgetting-curve',
    'data-vocab-next-cycle',
  ]) {
    assert.match(report, new RegExp(contract))
  }
  assert.match(report, />学習完了</)
  assert.doesNotMatch(report, /暗記サイクル完了|MEMORY CYCLE COMPLETE/)
  for (const heading of ['今日の成果', '定着させる語句', '今回の忘却曲線', '次の暗記サイクル']) {
    assert.match(report, new RegExp(heading))
  }
  for (const action of ['復習する', '次へ進む', '戻る']) {
    assert.match(report, new RegExp(action))
  }
  assert.match(report, /data-vocab-review-schedule/)
  assert.match(report, /期限前の枠もタップ/)
  assert.match(report, /30→60→90→180日/)
  assert.match(result, /onReviewSchedule=\{reviewVocabSchedule\}/)
  assert.equal(PERSISTED_PROGRESS_FIELDS.includes('vocabSession'), false)
})
