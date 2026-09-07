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

test('暗記完了レポートは今回と今日の答え・復習予定を同じSRSから作る', () => {
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
      reviewNowCount: report.session.reviewNowCount,
    },
    {
      total: 3,
      remembered: 2,
      forgot: 1,
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
    { 'day-0': 1, 'day-1': 1, 'day-7': 1 },
  )
  assert.deepEqual(
    Object.fromEntries(report.schedule.map((item) => [item.id, item.ids])),
    {
      'day-0': [forgot.id],
      'day-1': [first.id],
      'day-7': [mastered.id],
    },
  )
  assert.deepEqual(report.schedule.map((item) => item.label), ['今日', '明日', '7日後'])
  assert.equal('curve' in report, false)
  assert.equal(report.session.advancedCount, 2)
  assert.equal(report.session.newlyMasteredCount, 1)
  assert.equal(report.session.longTermCount, 1)
  assert.equal('score' in report.priorityItems[0], false)
  assert.equal('predictedRetention' in report.priorityItems[0], false)
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
  // 最後まで進んだときも途中でやめたときも、結果に載せるのは答えたカードだけ。
  assert.match(study, /const wordIds = answeredWordIds\(answers\)/)
  assert.match(study, /wordIds,/)
  assert.doesNotMatch(study, /wordIds:\s*deck\.map/)
  assert.match(study, /beforeBoxes/)
  assert.match(result, /beforeBoxes: params\.vocabSession\.beforeBoxes/)
  assert.match(result, /isVocabStudy.*params\.vocabSession/s)
  assert.match(result, /buildVocabCompletionReport/)
  assert.match(result, /source:\s*\{ type: 'mylist', ids: vocabReviewIds \}/)
  assert.match(result, /if \(isDragonVein\)[\s\S]*if \(vocabCompletion\)/)
  const vocabResultBranch = result.slice(result.indexOf('if (vocabCompletion)'), result.indexOf("return (\n    <div className=\"relative flex", result.indexOf('if (vocabCompletion)')))
  assert.doesNotMatch(vocabResultBranch, /<Confetti/)

  for (const contract of [
    'data-vocab-completion-report',
    'data-vocab-completion-today',
    'data-vocab-completion-priority',
    'data-vocab-next-cycle',
  ]) {
    assert.match(report, new RegExp(contract))
  }
  assert.match(report, /英単語の学習結果/)
  assert.match(report, /今日、\{today\.uniqueWords\}語に取り組みました/)
  assert.doesNotMatch(report, /暗記サイクル完了|MEMORY CYCLE COMPLETE/)
  for (const heading of ['今日の成果', '次にすること', 'このあとの復習予定', '今回学んだ語']) {
    assert.match(report, new RegExp(heading))
  }
  for (const action of ['復習する', '次へ進む', '単語一覧へ戻る']) {
    assert.match(report, new RegExp(action))
  }
  assert.match(report, /data-vocab-review-schedule/)
  assert.match(report, /30→60→90→180日/)
  assert.match(report, /今日、\{today\.uniqueWords\}語に取り組みました/)
  assert.match(report, /同じ語に何度か答えた場合は、今日最後の答えで分けています/)
  assert.match(report, /次の復習：\{dueLabel\(item\.dueInDays\)\}/)
  assert.match(report, /shrink-0 border-t border-indigo-100/)
  assert.match(report, /data-vocab-fixed-review/)
  assert.match(report, /data-vocab-fixed-continue/)
  assert.match(report, /data-vocab-review-schedule/)
  assert.match(report, /予定日は、これまでの答えに合わせて変わります/)
  assert.match(report, /答えを見る前に、もう一度意味を思い出しましょう/)
  assert.doesNotMatch(report, /最新が|復習の段階|覚え具合|忘れやすさの予測|先取り復習|パーフェクト級/)
  assert.doesNotMatch(report, /data-vocab-memory-progress|data-vocab-long-review-stage|data-vocab-forgetting-curve/)
  assert.doesNotMatch(report, /4日後以降/)
  assert.match(result, /onReviewSchedule=\{reviewVocabSchedule\}/)
  assert.match(result, /reviewVocabSchedule[\s\S]*continueTo: vocabNextAfterReview/)
  assert.equal(PERSISTED_PROGRESS_FIELDS.includes('vocabSession'), false)
})
