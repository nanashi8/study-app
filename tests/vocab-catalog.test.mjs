import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  ALL_WORDS,
  vocabFieldFor,
  wordsByLevel,
} from '../src/data/vocab.js'
import { LEVELS } from '../src/data/levels.js'
import {
  VOCAB_CATALOG_ACTIVITY_OPTIONS,
  VOCAB_CATALOG_DEFAULT_DIRECTIONS,
  VOCAB_CATALOG_SORT_OPTIONS,
  VOCAB_CATALOG_STATUS_FILTER_OPTIONS,
  vocabularyCatalogActivityRows,
  vocabularyCatalogRecordedRows,
  vocabularyCatalogRemainingRows,
  vocabularyCatalogRows,
  vocabularyCatalogStatusRows,
  vocabularyCatalogResultForDirection,
  vocabularyReviewWeight,
} from '../src/lib/vocabCatalog.js'
import { PERSISTED_PROGRESS_FIELDS } from '../src/lib/progressCode.js'
import { todayIndex } from '../src/store/useStore.js'

const DAY_MS = 86_400_000

function studiedEntry({
  now,
  day,
  memoryAt,
  testAt,
  failed = false,
} = {}) {
  return {
    box: failed ? 0 : 4,
    correct: failed ? 0 : 5,
    wrong: failed ? 2 : 0,
    due: failed ? day : day + 10,
    last: day - 1,
    lastAt: Math.max(memoryAt ?? 0, testAt ?? 0),
    firstAt: now - 20 * DAY_MS,
    memory: {
      passes: 2,
      remembered: failed ? 1 : 2,
      forgot: failed ? 1 : 0,
      lastAt: memoryAt,
      lastJudgment: failed ? 'forgot' : 'remembered',
      marks: failed ? [1, 0] : [1, 1],
    },
    test: {
      attempts: 2,
      correct: failed ? 1 : 2,
      wrong: failed ? 1 : 0,
      unknown: 0,
      lastAt: testAt,
      lastResult: failed ? 'wrong' : 'correct',
      marks: failed ? [1, 0] : [1, 1],
    },
  }
}

test('級別一覧は全7級・全英単語を重複も欠落もなく含む', () => {
  const catalogIds = []
  for (const level of LEVELS) {
    const expected = wordsByLevel(level.id)
    const rows = vocabularyCatalogRows(expected)
    const actualIds = rows.map((row) => row.word.id)

    assert.equal(actualIds.length, expected.length, level.id)
    assert.equal(new Set(actualIds).size, actualIds.length, level.id)
    assert.deepEqual(new Set(actualIds), new Set(expected.map((word) => word.id)), level.id)
    catalogIds.push(...actualIds)
  }

  assert.equal(catalogIds.length, ALL_WORDS.length)
  assert.equal(new Set(catalogIds).size, ALL_WORDS.length)
})

test('学習日・テスト日・確認のおすすめ順の3種類で級内を並び替える', () => {
  assert.deepEqual(
    VOCAB_CATALOG_SORT_OPTIONS.map((option) => option.id),
    ['weight', 'memoryAt', 'testAt'],
  )
  assert.deepEqual(VOCAB_CATALOG_DEFAULT_DIRECTIONS, {
    weight: 'desc',
    memoryAt: 'desc',
    testAt: 'desc',
  })

  const now = new Date(2026, 7, 25, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const first = ALL_WORDS[0]
  const second = ALL_WORDS.find((word) => vocabFieldFor(word) !== vocabFieldFor(first))
  const third = ALL_WORDS.find((word) => (
    word.id !== first.id
    && word.id !== second.id
    && vocabFieldFor(word) !== vocabFieldFor(first)
    && vocabFieldFor(word) !== vocabFieldFor(second)
  ))
  const words = [first, second, third]
  const srs = {
    [first.id]: studiedEntry({
      now,
      day,
      memoryAt: now - 3 * DAY_MS,
      testAt: now - DAY_MS,
      failed: true,
    }),
    [second.id]: studiedEntry({
      now,
      day,
      memoryAt: now - DAY_MS,
      testAt: now - 3 * DAY_MS,
    }),
  }

  const ids = (sort, direction) => vocabularyCatalogRows(words, srs, {
    sort,
    direction,
    now,
    day,
  }).map((row) => row.word.id)

  assert.deepEqual(ids('memoryAt', 'desc'), [second.id, first.id, third.id])
  assert.deepEqual(ids('memoryAt', 'asc'), [first.id, second.id, third.id])
  assert.deepEqual(ids('testAt', 'desc'), [first.id, second.id, third.id])
  assert.deepEqual(ids('testAt', 'asc'), [second.id, first.id, third.id])
  assert.deepEqual(ids('weight', 'desc'), [first.id, second.id, third.id])
  assert.ok(vocabularyReviewWeight(srs[first.id], { now, day }) > vocabularyReviewWeight(srs[second.id], { now, day }))
  assert.ok(vocabularyReviewWeight(srs[second.id], { now, day }) > vocabularyReviewWeight(undefined, { now, day }))

  // 分野は一覧では見分けにくいため並び替えから外す。未知の指定はおすすめ順へ戻す。
  assert.deepEqual(ids('field', 'asc'), ids('weight', 'asc'))
})

test('一覧確認は学習前・テスト前を含む全語を出し、記録済み件数は別に数える', () => {
  assert.deepEqual(VOCAB_CATALOG_ACTIVITY_OPTIONS, [
    { id: 'memory', label: '学習の一覧' },
    { id: 'test', label: 'テストの一覧' },
  ])

  const now = new Date(2026, 7, 26, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const [memoryWord, testWord, bothWord, unrecordedWord] = ALL_WORDS.slice(0, 4)
  const successful = studiedEntry({ now, day, memoryAt: now - DAY_MS, testAt: now })
  const memoryOnly = {
    ...successful,
    test: { attempts: 0, correct: 0, wrong: 0, unknown: 0, lastAt: null, lastResult: null, marks: [] },
  }
  const testOnly = {
    ...successful,
    memory: { passes: 0, remembered: 0, forgot: 0, lastAt: null, lastJudgment: null, marks: [] },
  }
  const words = [memoryWord, testWord, bothWord, unrecordedWord]
  const srs = {
    [memoryWord.id]: memoryOnly,
    [testWord.id]: testOnly,
    [bothWord.id]: successful,
  }

  assert.deepEqual(
    new Set(vocabularyCatalogActivityRows(words, srs, { activity: 'memory', now, day }).map((row) => row.word.id)),
    new Set(words.map((word) => word.id)),
  )
  assert.deepEqual(
    new Set(vocabularyCatalogActivityRows(words, srs, { activity: 'test', now, day }).map((row) => row.word.id)),
    new Set(words.map((word) => word.id)),
  )

  const rows = vocabularyCatalogRows(words, srs, { now, day })
  assert.deepEqual(
    new Set(vocabularyCatalogRecordedRows(rows, 'memory').map((row) => row.word.id)),
    new Set([memoryWord.id, bothWord.id]),
  )
  assert.deepEqual(
    new Set(vocabularyCatalogRecordedRows(rows, 'test').map((row) => row.word.id)),
    new Set([testWord.id, bothWord.id]),
  )
  const unrecordedRow = rows.find((row) => row.word.id === unrecordedWord.id)
  assert.equal(unrecordedRow.memoryStatus, 'unlearned')
  assert.equal(unrecordedRow.testStatus, 'unanswered')
})

test('学習前・学習済・テスト前・テスト後の状態で一覧をしぼり込む', () => {
  assert.deepEqual(VOCAB_CATALOG_STATUS_FILTER_OPTIONS, [
    { id: 'all', label: 'すべて' },
    { id: 'memoryUnlearned', label: '学習前' },
    { id: 'memoryLearned', label: '学習済' },
    { id: 'testUnanswered', label: 'テスト前' },
    { id: 'testAnswered', label: 'テスト後' },
  ])

  const rows = [
    { word: { id: 'a' }, memoryStatus: 'unlearned', testStatus: 'unanswered' },
    { word: { id: 'b' }, memoryStatus: 'learned', testStatus: 'unanswered' },
    { word: { id: 'c' }, memoryStatus: 'reviewing', testStatus: 'correct' },
    { word: { id: 'd' }, memoryStatus: 'unlearned', testStatus: 'incorrect' },
  ]
  const ids = (status) => vocabularyCatalogStatusRows(rows, status).map((row) => row.word.id)

  assert.deepEqual(ids('all'), ['a', 'b', 'c', 'd'])
  assert.deepEqual(ids('memoryUnlearned'), ['a', 'd'])
  assert.deepEqual(ids('memoryLearned'), ['b', 'c'])
  assert.deepEqual(ids('testUnanswered'), ['a', 'b'])
  assert.deepEqual(ids('testAnswered'), ['c', 'd'])
  assert.deepEqual(ids('unknown'), ['a', 'b', 'c', 'd'])
})

test('一覧確認の左右スワイプは指定された扱いを毎回記録する', () => {
  assert.equal(vocabularyCatalogResultForDirection('memory', 'left'), 'remembered')
  assert.equal(vocabularyCatalogResultForDirection('memory', 'right'), 'forgot')
  assert.equal(vocabularyCatalogResultForDirection('test', 'left'), 'correct')
  assert.equal(vocabularyCatalogResultForDirection('test', 'right'), 'wrong')
  assert.equal(vocabularyCatalogResultForDirection('memory', 'up'), null)
})

test('スワイプした語は再表示するまで一覧から一時的に除く', () => {
  const rows = ALL_WORDS.slice(0, 3).map((word) => ({ id: word.id, word }))
  const dismissed = new Set([rows[1].word.id])
  assert.deepEqual(
    vocabularyCatalogRemainingRows(rows, dismissed).map((row) => row.word.id),
    [rows[0].word.id, rows[2].word.id],
  )
  assert.deepEqual(
    vocabularyCatalogRemainingRows(rows, new Set()).map((row) => row.word.id),
    rows.map((row) => row.word.id),
  )
})

test('級画面から一覧を開き、記録別の一覧を左右スワイプで更新する', () => {
  const levels = readFileSync(new URL('../src/screens/VocabLevels.jsx', import.meta.url), 'utf8')
  const decks = readFileSync(new URL('../src/screens/VocabDecks.jsx', import.meta.url), 'utf8')
  const historyRow = readFileSync(new URL('../src/components/VocabularyHistoryRow.jsx', import.meta.url), 'utf8')
  const catalog = readFileSync(new URL('../src/lib/vocabCatalog.js', import.meta.url), 'utf8')

  assert.match(levels, /data-vocab-catalog-entry/)
  assert.match(levels, /一覧を確認/)
  assert.doesNotMatch(levels, /一覧から復習/)
  assert.match(decks, /data-vocab-catalog=\{level\.id\}/)
  assert.match(decks, /data-vocab-catalog-activity-tab/)
  assert.match(decks, /data-vocab-catalog-sort/)
  assert.match(decks, /data-vocab-catalog-status-filter/)
  assert.doesNotMatch(decks, /あ→わ|わ→あ/)
  assert.doesNotMatch(catalog, /id: 'field'/)
  assert.match(decks, /data-vocab-catalog-compact-controls/)
  assert.match(decks, /data-vocab-catalog-tools-toggle/)
  assert.match(decks, /learning-catalog-tools-collapsible/)
  assert.match(historyRow, /data-vocab-catalog-swipe-row/)
  assert.match(historyRow, /unlearned: \{ label: '学習前'/)
  assert.match(historyRow, /unanswered: \{ label: 'テスト前'/)
  assert.match(historyRow, /type="button"/)
  assert.match(historyRow, /onClick=\{openDetails\}/)
  assert.match(historyRow, /suppressOpenUntilRef/)
  assert.match(historyRow, /data-vocab-catalog-open-word/)
  assert.match(decks, /data-vocab-catalog-swipe-guide/)
  assert.match(decks, /data-vocab-catalog-restore/)
  assert.match(decks, /スワイプ後は一時的に非表示/)
  assert.match(decks, /className="sr-only" aria-live="polite" data-vocab-catalog-swipe-message/)
  assert.match(historyRow, /左にスワイプで\$\{activityMeta\.leftLabel\}/)
  assert.match(historyRow, /右にスワイプで\$\{activityMeta\.rightLabel\}/)
  assert.match(decks, /review\(row\.word\.id, result, 'vocab'\)/)
  assert.match(decks, /navigate\('wordDetail', \{ id: wordId \}\)/)
  assert.match(decks, /vocabularyCatalogRecordedRows/)
  assert.match(decks, /next\.add\(row\.word\.id\)/)
  assert.doesNotMatch(decks, /vocabularyCatalogResultMatches|すでに「/)
  assert.match(catalog, /最終学習日/)
  assert.match(catalog, /最終テスト日/)
  assert.match(`${catalog}\n${decks}`, /確認のおすすめ順/)
  assert.doesNotMatch(decks, /data-vocab-catalog-start-review/)
  assert.equal(PERSISTED_PROGRESS_FIELDS.some((field) => /catalog|selected/i.test(field)), false)
})
