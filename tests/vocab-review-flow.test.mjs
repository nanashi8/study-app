import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ALL_WORDS, wordsByLevel } from '../src/data/vocab.js'
import {
  AUTOMATIC_VOCAB_REVIEW_SHARE,
  buildDeck,
  nextVocabularyReviewInDays,
} from '../src/lib/session.js'
import {
  REVIEW_MARK_LIMIT,
  appendReviewMark,
  reviewMarksForEntry,
} from '../src/lib/reviewHistory.js'
import { buildVocabCompletionReport } from '../src/lib/learningAnalyticsReport.js'
import { progressStateFromCloud } from '../src/lib/cloudSync.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import { INTERVALS, todayIndex, useStore } from '../src/store/useStore.js'

test('学習とクイズの判定は語彙ごとに期限を伸縮し、直近の○×を分けて残す', () => {
  const original = useStore.getState()
  const originalNow = Date.now
  const timestamp = new Date(2026, 7, 21, 12, 0, 0, 0).getTime()
  const day = todayIndex(timestamp)
  const word = ALL_WORDS[0]

  try {
    Date.now = () => timestamp
    useStore.setState({
      srs: {
        [word.id]: {
          box: 2,
          correct: 1,
          wrong: 0,
          due: day + INTERVALS[2],
          last: day - 1,
          lastAt: timestamp - 86400000,
        },
      },
    })
    const beforeCurve = buildVocabCompletionReport({
      srs: useStore.getState().srs,
      wordIds: [word.id],
      now: timestamp,
    }).curve.at(-1).retention

    useStore.getState().review(word.id, 'remembered', 'vocab')
    let entry = useStore.getState().srs[word.id]
    assert.equal(entry.box, 3)
    assert.equal(entry.due, day + INTERVALS[3])
    assert.deepEqual(reviewMarksForEntry(entry), { memory: [1], test: [] })
    const afterCurve = buildVocabCompletionReport({
      srs: useStore.getState().srs,
      learningAnalytics: useStore.getState().learningAnalytics,
      wordIds: [word.id],
      now: timestamp,
    }).curve.at(-1).retention
    assert.ok(afterCurve > beforeCurve, '先取りの「覚えた」は7日後の定着予測へ反映する')

    useStore.getState().review(word.id, 'correct', 'vocab')
    entry = useStore.getState().srs[word.id]
    assert.equal(entry.box, 4)
    assert.equal(entry.due, day + INTERVALS[4])

    useStore.getState().review(word.id, 'wrong', 'vocab')
    entry = useStore.getState().srs[word.id]
    assert.equal(entry.box, 3)
    assert.equal(entry.due, day + INTERVALS[3])

    useStore.getState().review(word.id, 'forgot', 'vocab')
    entry = useStore.getState().srs[word.id]
    assert.equal(entry.box, 0)
    assert.equal(entry.due, day)
    assert.deepEqual(reviewMarksForEntry(entry), {
      memory: [1, 0],
      test: [1, 0],
    })

    const decoded = decodeProgress(encodeProgress(useStore.getState()))
    assert.deepEqual(decoded.srs[word.id].memory.marks, [1, 0])
    assert.deepEqual(decoded.srs[word.id].test.marks, [1, 0])
    const cloud = progressStateFromCloud({ srs: decoded.srs }, useStore.getState())
    assert.deepEqual(cloud.srs[word.id].memory.marks, [1, 0])
    assert.deepEqual(cloud.srs[word.id].test.marks, [1, 0])
  } finally {
    Date.now = originalNow
    useStore.setState(original, true)
  }
})

test('○×履歴は学習とクイズそれぞれ直近5回に制限する', () => {
  let marks = []
  for (const successful of [true, false, true, true, false, false, true]) {
    marks = appendReviewMark(marks, successful)
  }
  assert.equal(marks.length, REVIEW_MARK_LIMIT)
  assert.deepEqual(marks, [1, 1, 0, 0, 1])

  assert.deepEqual(reviewMarksForEntry({
    memory: { lastJudgment: 'forgot' },
    test: { lastResult: 'correct' },
  }), { memory: [0], test: [1] })
})

test('期限未到来でも学習済み語だけを次回日が近い順に先取り復習できる', () => {
  const day = todayIndex()
  const [later, sooner, due, unlearned] = ALL_WORDS.slice(0, 4)
  const srs = {
    [later.id]: { box: 4, due: day + 7 },
    [sooner.id]: { box: 2, due: day + 2 },
    [due.id]: { box: 1, due: day },
  }

  assert.deepEqual(
    buildDeck({ type: 'review' }, { srs, size: 0 }).map((word) => word.id),
    [due.id, sooner.id, later.id],
  )
  assert.deepEqual(
    buildDeck({ type: 'due' }, { srs, size: 0 }).map((word) => word.id),
    [due.id],
  )
  assert.equal(buildDeck({ type: 'review' }, {
    srs: { [unlearned.id]: {} },
    size: 0,
  }).length, 0)
  assert.equal(nextVocabularyReviewInDays({
    [later.id]: srs[later.id],
    [sooner.id]: srs[sooner.id],
  }, day), 2)
})

test('当日「まだ」・誤答の語は通常セッションに連投せず、明示復習と翌日には戻る', () => {
  const now = new Date(2026, 7, 24, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const words = wordsByLevel('5')
  const failedWords = words.slice(0, 10)
  const failedIds = new Set(failedWords.map((word) => word.id))
  const srs = Object.fromEntries(failedWords.map((word, index) => [word.id, {
    box: 0,
    due: day,
    last: day,
    lastAt: now + index,
    memory: index % 2 === 0
      ? { lastAt: now + index, lastJudgment: 'forgot' }
      : undefined,
    test: index % 2 === 1
      ? { lastAt: now + index, lastResult: 'wrong' }
      : undefined,
  }]))

  const sameDay = buildDeck(
    { type: 'level', levelId: '5' },
    { srs, size: 10, purpose: 'study', day },
  )
  assert.equal(sameDay.filter((word) => failedIds.has(word.id)).length, 0)

  const explicitReview = buildDeck({ type: 'due' }, { srs, size: 0, day })
  assert.equal(explicitReview.filter((word) => failedIds.has(word.id)).length, 10)

  const nextDay = buildDeck(
    { type: 'level', levelId: '5' },
    { srs, size: 10, purpose: 'study', day: day + 1 },
  )
  assert.equal(nextDay.filter((word) => failedIds.has(word.id)).length, 6)
  assert.equal(nextDay.filter((word) => !failedIds.has(word.id)).length, 4)
})

test('通常の学習・クイズは復習を最大60%にし、新しい語・別の語を40%確保する', () => {
  assert.equal(AUTOMATIC_VOCAB_REVIEW_SHARE, 0.6)
  const day = todayIndex()
  const words = wordsByLevel('4')
  const dueWords = words.slice(0, 24)
  const dueIds = new Set(dueWords.map((word) => word.id))
  const srs = Object.fromEntries(dueWords.map((word) => [word.id, {
    box: 1,
    due: day,
    last: day - 2,
  }]))

  for (const purpose of ['study', 'quiz']) {
    const deck = buildDeck(
      { type: 'level', levelId: '4' },
      { srs, size: 10, purpose, day },
    )
    assert.equal(deck.length, 10)
    assert.equal(deck.filter((word) => dueIds.has(word.id)).length, 6, purpose)
    assert.equal(deck.filter((word) => !dueIds.has(word.id)).length, 4, purpose)
  }

  const study = readFileSync(new URL('../src/screens/VocabStudy.jsx', import.meta.url), 'utf8')
  const quiz = readFileSync(new URL('../src/screens/VocabQuiz.jsx', import.meta.url), 'utf8')
  const levels = readFileSync(new URL('../src/screens/VocabLevels.jsx', import.meta.url), 'utf8')
  assert.match(study, /purpose: 'study'/)
  assert.match(quiz, /purpose: 'quiz'/)
  assert.match(levels, /data-vocab-session-policy/)
  assert.match(levels, /復習を最大6語/)
})

test('単語学習とクイズは参考画面を往復しても同じ問題・解答状態を復元する', () => {
  const study = readFileSync(new URL('../src/screens/VocabStudy.jsx', import.meta.url), 'utf8')
  const quiz = readFileSync(new URL('../src/screens/VocabQuiz.jsx', import.meta.url), 'utf8')
  const detail = readFileSync(new URL('../src/screens/WordDetail.jsx', import.meta.url), 'utf8')
  const history = readFileSync(new URL('../src/components/VocabReviewHistory.jsx', import.meta.url), 'utf8')

  assert.match(study, /restore\?\.deck \?\? buildFor/)
  assert.match(study, /restore\?\.i \?\? 0/)
  assert.match(study, /restore\?\.flipped \?\? revealAll/)
  assert.match(study, /saveBeforeReference\('rootDetail'/)
  assert.match(study, /saveBeforeReference\('wordDetail'/)
  assert.match(quiz, /restore\?\.deck \?\? buildFor/)
  assert.match(quiz, /saveBeforeDetail/)
  for (const source of [study, quiz, detail]) {
    assert.match(source, /VocabReviewHistory/)
  }
  assert.match(history, /data-vocab-review-history/)
  assert.match(history, /label="学習"/)
  assert.match(history, /label="クイズ"/)
})
