import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  ALL_WORDS,
  VOCAB_FIELD_GROUPS,
  VOCAB_POS,
  rootIdsForWord,
  wordsByLevel,
  wordsByRoot,
} from '../src/data/vocab.js'
import { LEARNING_FIELD_TOC } from '../src/data/decks.js'
import { LEVELS } from '../src/data/levels.js'
import {
  automaticVocabSessionPlan,
  buildDeck,
  overallProgress,
} from '../src/lib/session.js'
import { buildVocabCompletionReport } from '../src/lib/learningAnalyticsReport.js'
import { vocabularySessionContinuation } from '../src/lib/vocabSessionProgress.js'
import { todayIndex, useStore } from '../src/store/useStore.js'

const sessionSizeSource = readFileSync(
  new URL('../src/components/SessionSize.jsx', import.meta.url),
  'utf8',
)
const SESSION_SIZE_OPTIONS = /SESSION_SIZE_OPTIONS = \[([^\]]+)\]/
  .exec(sessionSizeSource)?.[1]
  .split(',')
  .map((value) => Number(value.trim()))

const idsOf = (items) => items.map((item) => item.id)

function assertDisjoint(first, second, label) {
  const firstIds = new Set(idsOf(first))
  assert.equal(
    second.some((item) => firstIds.has(item.id)),
    false,
    label,
  )
}

test('5語で次へ進むと、順序固定セットも5語・5語・残り2語で一巡して終了する', () => {
  const ids = idsOf(ALL_WORDS.slice(0, 12))
  const source = { type: 'deck', ids, preserveOrder: true }
  let cycleIds = []
  const sessions = []
  let lastContinuation = null

  for (const [expectedCount, expectedNextCount, expectedLabel] of [
    [5, 5, '次の5語へ'],
    [5, 2, '次の2語へ'],
    [2, 0, '学習を終える'],
  ]) {
    const deck = buildDeck(source, {
      size: 5,
      purpose: 'study',
      cycleIds,
    })
    assert.equal(deck.length, expectedCount)
    sessions.push(idsOf(deck))
    lastContinuation = vocabularySessionContinuation({
      source,
      title: '順序固定セット',
      mode: 'study',
      size: 5,
      returnTo: { screen: 'vocabLevels' },
      vocabSession: { cycleIds, wordIds: idsOf(deck) },
    }, { storedSize: 5 })
    assert.equal(lastContinuation.nextCount, expectedNextCount)
    assert.equal(lastContinuation.label, expectedLabel)
    assert.equal(lastContinuation.exhausted, expectedNextCount === 0)
    cycleIds = lastContinuation.cycleIds
  }

  assert.deepEqual(sessions.flat(), ids)
  assert.equal(new Set(sessions.flat()).size, 12)
  assert.equal(lastContinuation.exhausted, true)
  assert.equal(lastContinuation.label, '学習を終える')
  assert.deepEqual(lastContinuation.destination, { screen: 'vocabLevels', params: {} })
})

test('5語をすべて「まだ」にした次セットは、暗記の休止とテストの支援配分を使い分ける', () => {
  const now = new Date(2026, 7, 25, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const words = wordsByLevel('4')
  const previous = words.slice(0, 5)
  const previousIds = new Set(idsOf(previous))
  const srs = Object.fromEntries(previous.map((word) => [word.id, {
    box: 0,
    correct: 0,
    wrong: 1,
    due: day,
    last: day,
    lastAt: now,
    memory: {
      passes: 1,
      remembered: 0,
      forgot: 1,
      lastAt: now,
      lastJudgment: 'forgot',
      marks: [0],
    },
  }]))

  for (const purpose of ['study', 'quiz']) {
    const plan = automaticVocabSessionPlan(words, {
      srs,
      day,
      size: 5,
      purpose,
    })
    const next = buildDeck(
      { type: 'level', levelId: '4' },
      { srs, size: 5, purpose, cycleIds: [...previousIds], now, day },
    )
    const repeated = next.filter((word) => previousIds.has(word.id))
    const different = next.filter((word) => !previousIds.has(word.id))

    assert.equal(plan.profile, 'support')
    assert.equal(plan.reviewCount, 3)
    assert.equal(plan.varietyCount, 2)
    assert.equal(
      repeated.length,
      purpose === 'study' ? 0 : 3,
      `${purpose}の同日再出題数`,
    )
    assert.equal(
      different.length,
      purpose === 'study' ? 5 : 2,
      `${purpose}の別語数`,
    )
    assert.notDeepEqual(new Set(idsOf(next)), previousIds)
  }
})

test('全7問題数設定で復習負荷に応じた配分を再計算し、必ず別の語も含める', () => {
  const now = new Date(2026, 7, 25, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const words = wordsByLevel('4')
  const cases = [
    { profile: 'expansion', dueCount: (size) => Math.max(1, Math.floor(size * 0.4)) },
    { profile: 'balanced', dueCount: (size) => size },
    { profile: 'support', dueCount: (size) => Math.ceil(size * 1.5) },
  ]
  let audited = 0

  for (const size of SESSION_SIZE_OPTIONS) {
    for (const expected of cases) {
      const dueWords = words.slice(0, expected.dueCount(size))
      const dueIds = new Set(idsOf(dueWords))
      const srs = Object.fromEntries(dueWords.map((word) => [word.id, {
        box: 1,
        due: day,
        last: day - 2,
        lastAt: now - 2 * 86_400_000,
      }]))

      for (const purpose of ['study', 'quiz']) {
        audited++
        const plan = automaticVocabSessionPlan(words, { srs, day, size, purpose })
        const deck = buildDeck(
          { type: 'level', levelId: '4' },
          { srs, size, purpose, cycleIds: [...dueIds], now, day },
        )
        const reviewCount = deck.filter((word) => dueIds.has(word.id)).length
        const differentCount = deck.length - reviewCount

        assert.equal(plan.profile, expected.profile, `${size}語・${purpose}`)
        assert.equal(deck.length, size, `${size}語・${purpose}の設定数`)
        assert.equal(reviewCount, plan.reviewCount, `${size}語・${purpose}の復習数`)
        assert.equal(differentCount, plan.varietyCount, `${size}語・${purpose}の別語数`)
        assert.ok(differentCount >= 1, `${size}語・${purpose}は必ず別の語を含む`)
      }
    }
  }
  assert.equal(audited, SESSION_SIZE_OPTIONS.length * cases.length * 2)
})

test('全7級・10分野・69級別分野の未学習母集団を全問題数設定で監査し、次セットへ既出語を混ぜない', () => {
  const sources = [
    ...LEVELS.map((level) => ({
      label: `英検${level.label}`,
      source: { type: 'level', levelId: level.id },
    })),
    ...VOCAB_FIELD_GROUPS.map((field) => ({
      label: `分野${field.label}`,
      source: { type: 'field', field: field.id },
    })),
    ...LEARNING_FIELD_TOC.flatMap((level) => level.chapters.map((field) => ({
      label: `英検${level.level.label}・${field.field}`,
      source: {
        type: 'levelField',
        levelId: level.level.id,
        field: field.fieldId,
      },
    }))),
  ]
  assert.equal(LEVELS.length, 7)
  assert.equal(VOCAB_FIELD_GROUPS.length, 10)
  assert.equal(LEARNING_FIELD_TOC.reduce((sum, level) => sum + level.chapters.length, 0), 69)
  assert.equal(sources.length, 86)

  let auditedPaths = 0
  for (const { label, source } of sources) {
    for (const purpose of ['study', 'quiz']) {
      const total = buildDeck(source, { size: 0, purpose }).length
      assert.ok(total > 0, `${label}・${purpose}の監査母数`)
      for (const size of SESSION_SIZE_OPTIONS) {
        auditedPaths++
        const first = buildDeck(source, { size, purpose })
        const next = buildDeck(source, {
          size,
          purpose,
          cycleIds: idsOf(first),
        })
        assertDisjoint(first, next, `${label}・${purpose}・${size}語`)
        assert.equal(
          first.length + next.length,
          Math.min(total, size * 2),
          `${label}・${purpose}・${size}語は在庫分だけ前進する`,
        )
      }
    }
  }
  assert.equal(auditedPaths, 86 * 2 * SESSION_SIZE_OPTIONS.length)
})

test('全13単語source型で既出除外を監査し、明示的な復習だけは別セッションで再出題できる', () => {
  const now = new Date(2026, 7, 25, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const sample = ALL_WORDS.slice(0, 14)
  const sampleIds = idsOf(sample)
  const learnedSrs = Object.fromEntries(sample.map((word, index) => [word.id, {
    box: 1,
    due: index < 12 ? day : day + 2,
    last: day - 1,
    lastAt: now - 86_400_000,
  }]))
  const rootCounts = new Map()
  for (const word of ALL_WORDS) {
    for (const rootId of rootIdsForWord(word)) {
      rootCounts.set(rootId, (rootCounts.get(rootId) ?? 0) + 1)
    }
  }
  const rootId = [...rootCounts.entries()].find(([, count]) => count >= 12)?.[0]
  assert.ok(rootId)
  assert.ok(wordsByRoot(rootId).length >= 12)

  const cases = [
    ['all', { type: 'all' }, {}],
    ['field', { type: 'field', field: VOCAB_FIELD_GROUPS[0].id }, {}],
    ['pos', { type: 'pos', pos: VOCAB_POS[0].id }, {}],
    ['level', { type: 'level', levelId: LEVELS[0].id }, {}],
    ['levelField', {
      type: 'levelField',
      levelId: LEARNING_FIELD_TOC[0].level.id,
      field: LEARNING_FIELD_TOC[0].chapters[0].fieldId,
    }, {}],
    ['battle', { type: 'battle', levelIndex: 2 }, {}],
    ['dragonVein', { type: 'dragonVein', levelId: '3', fields: [] }, {}],
    ['root', { type: 'root', rootId }, {}],
    ['mylist', { type: 'mylist', ids: sampleIds }, {}],
    ['deck', { type: 'deck', ids: sampleIds, preserveOrder: true }, {}],
    ['due', { type: 'due' }, { srs: learnedSrs, now, day }],
    ['review', { type: 'review' }, { srs: learnedSrs, now, day }],
    ['custom', { type: 'custom', words: sample }, {}],
  ]
  assert.deepEqual(cases.map(([type]) => type), [
    'all', 'field', 'pos', 'level', 'levelField', 'battle', 'dragonVein',
    'root', 'mylist', 'deck', 'due', 'review', 'custom',
  ])

  for (const [type, source, options] of cases) {
    const first = buildDeck(source, { ...options, size: 5, purpose: 'quiz' })
    const next = buildDeck(source, {
      ...options,
      size: 5,
      purpose: 'quiz',
      cycleIds: idsOf(first),
    })
    assert.equal(first.length, 5, `${type}の最初の5語`)
    assertDisjoint(first, next, `${type}の次の5語`)
  }

  const reviewSource = { type: 'mylist', ids: sampleIds.slice(0, 5) }
  assert.deepEqual(
    new Set(idsOf(buildDeck(reviewSource, { size: 5, purpose: 'study' }))),
    new Set(sampleIds.slice(0, 5)),
    '復習ボタンで明示した5語は再出題できる',
  )
})

test('暗記・テストの次セットは累積既出IDを渡し、本文などの明示された次画面は優先する', () => {
  const ids = idsOf(ALL_WORDS.slice(0, 15))
  const source = { type: 'deck', ids, preserveOrder: true }
  const study = vocabularySessionContinuation({
    source,
    title: '暗記',
    mode: 'study',
    vocabSession: { cycleIds: ids.slice(0, 5), wordIds: ids.slice(5, 10) },
    returnTo: { screen: 'vocabLevels' },
  }, { storedSize: 5 })
  assert.equal(study.destination.screen, 'vocabStudy')
  assert.deepEqual(study.destination.params.vocabCycleIds, ids.slice(0, 10))
  assert.equal(study.nextCount, 5)
  assert.equal(study.label, '次の5語へ')

  const quiz = vocabularySessionContinuation({
    source,
    title: 'テスト',
    mode: 'quiz',
    size: 5,
    vocabSession: { wordIds: ids.slice(0, 5) },
  }, { storedSize: 20 })
  assert.equal(quiz.destination.screen, 'vocabQuiz')
  assert.deepEqual(quiz.destination.params.vocabCycleIds, ids.slice(0, 5))

  const reading = vocabularySessionContinuation({
    source,
    mode: 'study',
    vocabSession: { wordIds: ids.slice(0, 5) },
    continueTo: {
      screen: 'readingPrep',
      params: { passageId: 'p1' },
      label: '読解の準備に戻る',
    },
  })
  assert.deepEqual(reading.destination, {
    screen: 'readingPrep',
    params: { passageId: 'p1' },
    label: '読解の準備に戻る',
  })
  assert.equal(reading.label, '読解の準備に戻る')
})

test('結果画面は全7問題数設定と「全部」を次セットの実数・表示へ反映する', () => {
  const ids = idsOf(ALL_WORDS.slice(0, 500))
  const source = { type: 'deck', ids, preserveOrder: true }
  const completedIds = ids.slice(0, 5)

  for (const mode of ['study', 'quiz']) {
    for (const storedSize of SESSION_SIZE_OPTIONS) {
      const continuation = vocabularySessionContinuation({
        source,
        mode,
        vocabSession: { wordIds: completedIds },
      }, { storedSize })
      assert.equal(continuation.nextCount, storedSize, `${mode}・${storedSize}語`)
      assert.equal(continuation.label, `次の${storedSize}語へ`, `${mode}・${storedSize}語`)
    }

    const all = vocabularySessionContinuation({
      source,
      mode,
      vocabSession: { wordIds: completedIds },
    }, { storedSize: 0 })
    assert.equal(all.nextCount, ids.length - completedIds.length, `${mode}・全部`)
    assert.equal(all.label, `次の${ids.length - completedIds.length}語へ`, `${mode}・全部`)
  }

  const explicitFive = vocabularySessionContinuation({
    source,
    mode: 'quiz',
    size: 5,
    vocabSession: { wordIds: completedIds },
  }, { storedSize: 200 })
  assert.equal(explicitFive.nextCount, 5, '起動元が明示した5語は保存設定より優先する')
})

test('今日の復習を途中でやめても、答えた語だけを結果にし、残りは次のセットへ残す', () => {
  const original = useStore.getState()
  const originalNow = Date.now
  const yesterday = new Date(2026, 8, 6, 20, 0, 0, 0).getTime()
  const today = yesterday + 86400000
  const day = todayIndex(today)
  const words = wordsByLevel('5').slice(0, 12)
  const source = { type: 'due' }

  try {
    // 前日に12語を「覚えた」で学習し、翌日その全部が復習日を迎える。
    Date.now = () => yesterday
    useStore.setState({ srs: {} })
    for (const word of words) useStore.getState().review(word.id, 'remembered', 'vocab')

    Date.now = () => today
    assert.equal(overallProgress(useStore.getState().srs).due, 12)
    const deck = buildDeck(source, {
      srs: useStore.getState().srs,
      size: 10,
      purpose: 'study',
      now: today,
      day,
    })
    assert.equal(deck.length, 10)

    // 10枚のうち3枚だけ答えて中断する。
    const answered = deck.slice(0, 3)
    const unanswered = deck.slice(3)
    for (const word of answered) useStore.getState().review(word.id, 'remembered', 'vocab')
    const srs = useStore.getState().srs

    // 答えた分は1カードごとに保存済みなので、画面の「今日の復習 N語」も同じだけ減る。
    assert.equal(overallProgress(srs).due, 9)

    // 結果に載る語数は、デッキの10語ではなく答えた3語。
    const report = buildVocabCompletionReport({
      srs,
      wordIds: idsOf(answered),
      correct: answered.length,
      wrong: 0,
      now: today,
    })
    assert.equal(report.session.total, 3)
    assert.deepEqual(report.session.wordIds, idsOf(answered))

    // まだ見ていない語を一巡済みにしないので、次のセットへそのまま残る。
    const continuation = vocabularySessionContinuation({
      source,
      title: '今日の復習',
      mode: 'study',
      vocabSession: { cycleIds: [], wordIds: idsOf(answered) },
    }, { srs, storedSize: 10, now: today })
    assert.equal(continuation.remainingCount, 9)
    assert.equal(continuation.label, '次の9語へ')

    const nextIds = new Set(idsOf(buildDeck(source, {
      srs,
      size: 0,
      purpose: 'study',
      cycleIds: idsOf(answered),
      now: today,
      day,
    })))
    assertDisjoint(answered, [...nextIds].map((id) => ({ id })), '答えた語は次のセットへ出さない')
    for (const word of unanswered) {
      assert.ok(nextIds.has(word.id), `${word.id}は中断時に見ていないので次のセットへ残る`)
    }
  } finally {
    Date.now = originalNow
    useStore.setState(original, true)
  }
})

test('結果画面・暗記・テストの全配線が同じ周回IDを引き継ぐ', () => {
  const study = readFileSync(new URL('../src/screens/VocabStudy.jsx', import.meta.url), 'utf8')
  const quiz = readFileSync(new URL('../src/screens/VocabQuiz.jsx', import.meta.url), 'utf8')
  const result = readFileSync(new URL('../src/screens/SessionResult.jsx', import.meta.url), 'utf8')
  const levels = readFileSync(new URL('../src/screens/VocabLevels.jsx', import.meta.url), 'utf8')

  for (const source of [study, quiz]) {
    assert.equal(
      (source.match(/cycleIds: params\.vocabCycleIds/g) ?? []).length,
      2,
      'デッキ作成と結果引き継ぎの両方へ周回IDを渡す',
    )
  }
  // テストは最後まで解いてから結果へ進むのでデッキ全体、暗記は途中でやめられるので
  // 答えたカードだけを一巡済みとして渡す。見ていない語を次セットから外さない。
  assert.match(quiz, /wordIds: deck\.map/)
  assert.match(study, /const wordIds = answeredWordIds\(answers\)/)
  assert.match(result, /vocabularySessionContinuation\(params/)
  assert.match(result, /continueLabel=\{vocabContinuation\.label\}/)
  assert.doesNotMatch(levels, /data-vocab-session-policy|固定配分|30〜60%|同じ周回|次セット/)
  const continuation = result.slice(
    result.indexOf('const continueVocab'),
    result.indexOf('const reviewVocabSchedule'),
  )
  assert.match(continuation, /vocabContinuation\.destination/)
  assert.doesNotMatch(continuation, /replay\(\)/)
})
