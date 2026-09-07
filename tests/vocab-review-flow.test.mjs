import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ALL_WORDS, wordsByLevel } from '../src/data/vocab.js'
import { LEVELS } from '../src/data/levels.js'
import { LEARNING_FIELD_TOC } from '../src/data/decks.js'
import {
  AUTOMATIC_VOCAB_MIX_PROFILES,
  AUTOMATIC_VOCAB_REVIEW_SHARE,
  automaticVocabSessionPlan,
  buildDeck,
  nextVocabularyReviewInDays,
  overallProgress,
  reviewActionState,
  wordProgress,
} from '../src/lib/session.js'
import {
  REVIEW_MARK_LIMIT,
  appendReviewMark,
  reviewMarksForEntry,
} from '../src/lib/reviewHistory.js'
import {
  summarizeVocabularySrsItems,
  vocabularyReviewMetrics,
} from '../src/lib/vocabScheduler.js'
import { progressStateFromCloud } from '../src/lib/cloudSync.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import { INTERVALS, todayIndex, useStore } from '../src/store/useStore.js'

test('語彙ごとの正解履歴と経過時間で期限を伸縮し、同日連打では段階を上げない', () => {
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
          due: day,
          last: day - 2,
          lastAt: timestamp - 2 * 86400000,
        },
      },
    })
    const beforeRetention = vocabularyReviewMetrics(
      useStore.getState().srs[word.id],
      { now: timestamp, day },
    ).retention
    const beforeScore = vocabularyReviewMetrics(
      useStore.getState().srs[word.id],
      { now: timestamp, day },
    ).score

    useStore.getState().review(word.id, 'remembered', 'vocab')
    let entry = useStore.getState().srs[word.id]
    assert.equal(entry.box, 3)
    assert.ok(entry.due >= day + INTERVALS[3])
    assert.deepEqual(reviewMarksForEntry(entry), { memory: [1], test: [] })
    const firstDue = entry.due
    const firstScore = vocabularyReviewMetrics(entry, { now: timestamp, day }).score
    const afterRetention = vocabularyReviewMetrics(entry, { now: timestamp, day }).retention
    assert.ok(afterRetention > beforeRetention, '復習日に「覚えた」と答えると次回計算へ反映する')
    assert.ok(firstScore > beforeScore, '期限到来後に思い出せた語の定着スコアが上がる')

    // 同じ日に続けて押しても、時間を空けた想起とは扱わない。
    useStore.getState().review(word.id, 'remembered', 'vocab')
    entry = useStore.getState().srs[word.id]
    assert.equal(entry.box, 3)
    assert.equal(entry.due, firstDue)

    useStore.getState().review(word.id, 'correct', 'vocab')
    entry = useStore.getState().srs[word.id]
    assert.equal(entry.box, 3)
    assert.equal(entry.due, firstDue)

    useStore.getState().review(word.id, 'wrong', 'vocab')
    entry = useStore.getState().srs[word.id]
    assert.equal(entry.box, 2)
    assert.equal(entry.due, day + 1)

    useStore.getState().review(word.id, 'forgot', 'vocab')
    entry = useStore.getState().srs[word.id]
    assert.equal(entry.box, 0)
    assert.equal(entry.due, day)
    assert.deepEqual(reviewMarksForEntry(entry), {
      memory: [1, 1, 0],
      test: [1, 0],
    })

    const decoded = decodeProgress(encodeProgress(useStore.getState()))
    assert.deepEqual(decoded.srs[word.id].memory.marks, [1, 1, 0])
    assert.deepEqual(decoded.srs[word.id].test.marks, [1, 0])
    const cloud = progressStateFromCloud({ srs: decoded.srs }, useStore.getState())
    assert.deepEqual(cloud.srs[word.id].memory.marks, [1, 1, 0])
    assert.deepEqual(cloud.srs[word.id].test.marks, [1, 0])
  } finally {
    Date.now = originalNow
    useStore.setState(original, true)
  }
})

test('○×履歴は暗記とテストそれぞれ直近5回に制限する', () => {
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

test('通常の暗記・テストは復習負荷に応じて新しい語・別の語を30〜60%に変える', () => {
  assert.deepEqual(AUTOMATIC_VOCAB_MIX_PROFILES, {
    expansion: { freshShare: 0.6 },
    balanced: { freshShare: 0.4 },
    support: { freshShare: 0.3 },
  })
  const now = new Date(2026, 7, 24, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const words = wordsByLevel('4')
  const cases = [
    { dueCount: 4, profile: 'expansion', reviewCount: 4, varietyCount: 6 },
    { dueCount: 8, profile: 'balanced', reviewCount: 6, varietyCount: 4 },
    { dueCount: 24, profile: 'support', reviewCount: 7, varietyCount: 3 },
  ]

  for (const expected of cases) {
    const dueWords = words.slice(0, expected.dueCount)
    const dueIds = new Set(dueWords.map((word) => word.id))
    const srs = Object.fromEntries(dueWords.map((word) => [word.id, {
      box: 1,
      due: day,
      last: day - 2,
      lastAt: now - 2 * 86_400_000,
    }]))
    for (const purpose of ['study', 'quiz']) {
      const plan = automaticVocabSessionPlan(words, { srs, size: 10, purpose, day })
      const deck = buildDeck(
        { type: 'level', levelId: '4' },
        { srs, size: 10, purpose, now, day },
      )
      assert.equal(plan.profile, expected.profile, `${purpose}:${expected.dueCount}`)
      assert.equal(plan.reviewCount, expected.reviewCount, `${purpose}:plan-review`)
      assert.equal(plan.varietyCount, expected.varietyCount, `${purpose}:plan-variety`)
      assert.equal(deck.filter((word) => dueIds.has(word.id)).length, expected.reviewCount)
      assert.equal(deck.filter((word) => !dueIds.has(word.id)).length, expected.varietyCount)
      assert.doesNotMatch(
        deck.map((word) => dueIds.has(word.id) ? 'R' : 'N').join(''),
        /RRR/,
      )
    }
  }
})

test('「覚えた」語は復習日が来ても学習済のまま残し、復習件数は別に数える', () => {
  const now = new Date(2026, 7, 24, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const [forgot, scheduled, waiting, unlearned] = ALL_WORDS.slice(0, 4)
  const remembered = (due) => ({
    box: 4,
    due,
    last: day - 7,
    lastAt: now - 7 * 86400000,
    memory: {
      passes: 4,
      remembered: 4,
      forgot: 0,
      lastAt: now - 7 * 86400000,
      lastJudgment: 'remembered',
      marks: [1, 1, 1, 1],
    },
  })
  const srs = {
    [forgot.id]: {
      box: 0,
      due: day,
      last: day - 1,
      lastAt: now - 86400000,
      memory: {
        passes: 1,
        remembered: 0,
        forgot: 1,
        lastAt: now - 86400000,
        lastJudgment: 'forgot',
        marks: [0],
      },
    },
    [scheduled.id]: remembered(day),
    [waiting.id]: remembered(day + 15),
  }

  const summary = summarizeVocabularySrsItems(
    [forgot, scheduled, waiting, unlearned],
    srs,
    { now, day },
  )

  // 棒グラフは凡例どおり暗記の自己判定を示す。復習日が来た scheduled も
  // 「覚えた」と答えた語なので学習済のまま＝前日の学習が翌日に消えない。
  assert.deepEqual(summary.learning, { learned: 2, reviewing: 1, unlearned: 1 })
  // 復習が必要な件数は棒グラフと別枠で、画面の「復習が必要 N語」と一致する。
  assert.equal(summary.due, 2)

  const originalNow = Date.now
  try {
    Date.now = () => now
    assert.equal(wordProgress([forgot, scheduled, waiting, unlearned], srs).due, summary.due)
  } finally {
    Date.now = originalNow
  }
})

test('テストだけ解いた日の結果が、翌日の復習件数と復習導線に残る', () => {
  const original = useStore.getState()
  const originalNow = Date.now
  const yesterday = new Date(2026, 7, 24, 20, 0, 0, 0).getTime()
  const today = yesterday + 86400000
  const words = wordsByLevel('5').slice(0, 6)

  try {
    // 前日：暗記を挟まず単語テストだけを解く（3問正解・3問不正解）。
    Date.now = () => yesterday
    useStore.setState({ srs: {} })
    words.forEach((word, index) => {
      useStore.getState().review(word.id, index < 3 ? 'correct' : 'wrong', 'vocab')
    })

    Date.now = () => today
    const srs = useStore.getState().srs
    const progress = wordProgress(words, srs)
    assert.equal(progress.seen, 6) // 暗記の自己判定が無くても既習として数える
    assert.equal(progress.due, 6)

    // 級カードの「復習が必要 N語」と、実際に出せる復習語数が一致する。
    const deck = buildDeck({ type: 'due' }, { srs, size: 0, now: today, day: todayIndex(today) })
    assert.equal(deck.filter((word) => words.some((w) => w.id === word.id)).length, progress.due)

    // 復習ショートカットが「今日の復習」として押せる状態になる。
    const overall = overallProgress(srs)
    assert.ok(overall.seen > 0)
    assert.equal(reviewActionState(overall), 'due')
  } finally {
    Date.now = originalNow
    useStore.setState(original, true)
  }
})

test('全級の暗記は復習中を先頭にし、未学習が無ければ待機中の定着語を自動補充しない', () => {
  const now = new Date(2026, 7, 21, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const stableEntry = () => ({
    box: 5,
    correct: 8,
    wrong: 0,
    due: day + 15,
    last: day,
    lastAt: now,
    memory: {
      passes: 5,
      remembered: 5,
      forgot: 0,
      lastAt: now,
      lastJudgment: 'remembered',
      marks: [1, 1, 1, 1, 1],
    },
  })
  const reviewingEntry = () => ({
    box: 2,
    correct: 2,
    wrong: 2,
    due: day,
    last: day - 2,
    lastAt: now - 2 * 86400000,
    memory: {
      passes: 2,
      remembered: 1,
      forgot: 1,
      lastAt: now - 2 * 86400000,
      lastJudgment: 'forgot',
      marks: [1, 0],
    },
  })

  for (const level of LEVELS) {
    const words = wordsByLevel(level.id)
    assert.ok(words.length >= 3, `英検${level.label}の監査母数`)
    const [reviewing, unlearned, stable] = words
    const srs = Object.fromEntries(
      words.filter((word) => word.id !== unlearned.id).map((word) => [word.id, stableEntry()]),
    )
    srs[reviewing.id] = reviewingEntry()

    assert.deepEqual(
      buildDeck(
        { type: 'level', levelId: level.id },
        { srs, size: 0, purpose: 'study', now, day },
      ).map((word) => word.id),
      [reviewing.id, unlearned.id],
      `英検${level.label}は復習中→未学習の順`,
    )

    srs[unlearned.id] = stableEntry()
    assert.deepEqual(
      buildDeck(
        { type: 'level', levelId: level.id },
        { srs, size: 0, purpose: 'study', now, day },
      ).map((word) => word.id),
      [reviewing.id],
      `英検${level.label}は復習中だけを出す`,
    )

    srs[reviewing.id] = stableEntry()
    assert.equal(
      buildDeck(
        { type: 'level', levelId: level.id },
        { srs, size: 0, purpose: 'study', now, day },
      ).length,
      0,
      `英検${level.label}は全語が期限前なら自動再出現なし`,
    )
    assert.deepEqual(
      buildDeck(
        { type: 'deck', ids: [stable.id] },
        { srs, size: 0, purpose: 'study', now, day },
      ).map((word) => word.id),
      [stable.id],
      `英検${level.label}も任意選択なら期限前に確認できる`,
    )
  }

  let auditedLevelFields = 0
  for (const levelToc of LEARNING_FIELD_TOC) {
    for (const field of levelToc.chapters) {
      auditedLevelFields++
      assert.ok(field.wordIds.length >= 2, `英検${levelToc.level.label}・${field.field}の監査母数`)
      const [reviewingId, unlearnedId] = field.wordIds
      const srs = Object.fromEntries(
        field.wordIds
          .filter((id) => id !== unlearnedId)
          .map((id) => [id, stableEntry()]),
      )
      srs[reviewingId] = reviewingEntry()
      const source = {
        type: 'levelField',
        levelId: levelToc.level.id,
        field: field.fieldId,
      }

      assert.deepEqual(
        buildDeck(source, { srs, size: 0, purpose: 'study', now, day }).map((word) => word.id),
        [reviewingId, unlearnedId],
        `英検${levelToc.level.label}・${field.field}も復習中→未学習の順`,
      )
      srs[unlearnedId] = stableEntry()
      assert.deepEqual(
        buildDeck(source, { srs, size: 0, purpose: 'study', now, day }).map((word) => word.id),
        [reviewingId],
        `英検${levelToc.level.label}・${field.field}は復習中だけを出す`,
      )
      srs[reviewingId] = stableEntry()
      assert.equal(
        buildDeck(source, { srs, size: 0, purpose: 'study', now, day }).length,
        0,
        `英検${levelToc.level.label}・${field.field}は期限前なら自動再出現なし`,
      )
    }
  }
  assert.equal(auditedLevelFields, 69, '収録語がある全69級別分野を監査する')
})

test('単語暗記とテストは参考画面を往復しても同じ問題・解答状態を復元する', () => {
  const study = readFileSync(new URL('../src/screens/VocabStudy.jsx', import.meta.url), 'utf8')
  const quiz = readFileSync(new URL('../src/screens/VocabQuiz.jsx', import.meta.url), 'utf8')
  const detail = readFileSync(new URL('../src/screens/WordDetail.jsx', import.meta.url), 'utf8')
  const history = readFileSync(new URL('../src/components/VocabReviewHistory.jsx', import.meta.url), 'utf8')

  assert.match(study, /restore\?\.deck \?\? buildFor/)
  assert.match(study, /restore\?\.i \?\? 0/)
  assert.match(study, /restore\?\.flipped \?\? revealAll/)
  assert.match(study, /purpose: 'study'/)
  assert.match(study, /saveBeforeReference\('rootDetail'/)
  assert.match(study, /saveBeforeReference\('wordDetail'/)
  assert.match(quiz, /restore\?\.deck \?\? buildFor/)
  assert.match(quiz, /saveBeforeDetail/)
  for (const source of [study, quiz, detail]) {
    assert.match(source, /VocabReviewHistory/)
  }
  assert.match(history, /data-vocab-review-history/)
  assert.match(history, /data-vocab-review-status/)
  assert.doesNotMatch(history, /data-vocab-memory-score|覚え具合/)
  assert.match(history, /label="学習"/)
  assert.match(history, /label="テスト"/)
})

test('「まだ」は同日中の通常学習を占有せず、翌日は支援配分の7対3で混ざる', () => {
  assert.equal(AUTOMATIC_VOCAB_REVIEW_SHARE, 0.6)
  const now = new Date(2026, 7, 24, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const words = wordsByLevel('3')
  assert.ok(words.length >= 30, '英検3級の監査母数')
  const failed = words.slice(0, 10)
  const unseen = words.slice(10, 30)
  const unseenIds = new Set(unseen.map((word) => word.id))
  const failedIds = new Set(failed.map((word) => word.id))
  const stableEntry = {
    box: 5,
    correct: 8,
    wrong: 0,
    due: day + 15,
    last: day,
    lastAt: now,
    memory: { passes: 5, remembered: 5, forgot: 0, lastAt: now, lastJudgment: 'remembered', marks: [1, 1, 1, 1, 1] },
  }
  const srs = Object.fromEntries(words.map((word) => [word.id, stableEntry]))
  for (const word of unseen) delete srs[word.id]
  for (const word of failed) {
    srs[word.id] = {
      box: 0,
      correct: 0,
      wrong: 2,
      due: day,
      last: day,
      lastAt: now,
      memory: { passes: 2, remembered: 0, forgot: 2, lastAt: now, lastJudgment: 'forgot', marks: [0, 0] },
    }
  }

  for (const word of failed) {
    const metrics = vocabularyReviewMetrics(srs[word.id], { now, day })
    assert.equal(metrics.needsReview, true)
    assert.equal(metrics.coolingDown, true)
    assert.equal(metrics.shouldAutoAppear, false)
  }
  const sameDay = buildDeck(
    { type: 'level', levelId: '3' },
    { srs, size: 10, purpose: 'study', now, day },
  )
  assert.equal(sameDay.length, 10)
  assert.equal(sameDay.every((word) => unseenIds.has(word.id)), true)

  const nextDayNow = now + 86_400_000
  const nextDay = buildDeck(
    { type: 'level', levelId: '3' },
    { srs, size: 10, purpose: 'study', now: nextDayNow, day: day + 1 },
  )
  assert.equal(nextDay.filter((word) => failedIds.has(word.id)).length, 7)
  assert.equal(nextDay.filter((word) => unseenIds.has(word.id)).length, 3)
})

test('通常テストも苦手語だけで埋めず、支援配分でも10語中3語を別の語にする', () => {
  const now = new Date(2026, 7, 24, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const words = wordsByLevel('pre2')
  assert.ok(words.length >= 20, '英検準2級の監査母数')
  const failedIds = new Set(words.slice(0, 10).map((word) => word.id))
  const srs = Object.fromEntries(words.slice(0, 10).map((word) => [word.id, {
    box: 0,
    wrong: 2,
    due: day,
    last: day - 1,
    lastAt: now - 86_400_000,
    test: { attempts: 2, correct: 0, wrong: 2, lastAt: now - 86_400_000, lastResult: 'wrong', marks: [0, 0] },
  }]))

  const deck = buildDeck(
    { type: 'level', levelId: 'pre2' },
    { srs, size: 10, purpose: 'quiz', now, day },
  )
  assert.equal(deck.length, 10)
  assert.equal(deck.filter((word) => failedIds.has(word.id)).length, 7)
  assert.equal(new Set(deck.map((word) => word.id)).size, 10)
})
