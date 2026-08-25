import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  ALL_WORDS,
  vocabFieldFor,
  wordsByLevel,
} from '../src/data/vocab.js'
import { LEVELS } from '../src/data/levels.js'
import { buildDeck } from '../src/lib/session.js'
import {
  VOCAB_CATALOG_DEFAULT_DIRECTIONS,
  VOCAB_CATALOG_SORT_OPTIONS,
  vocabularyCatalogRows,
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

test('学習日・テスト日・分野・先に復習する順の4種類で級内を並び替える', () => {
  assert.deepEqual(
    VOCAB_CATALOG_SORT_OPTIONS.map((option) => option.id),
    ['weight', 'memoryAt', 'testAt', 'field'],
  )
  assert.deepEqual(VOCAB_CATALOG_DEFAULT_DIRECTIONS, {
    weight: 'desc',
    memoryAt: 'desc',
    testAt: 'desc',
    field: 'asc',
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

  const fieldCollator = new Intl.Collator('ja', { sensitivity: 'base', numeric: true })
  const expectedFields = [...words]
    .sort((a, b) => fieldCollator.compare(vocabFieldFor(a), vocabFieldFor(b)))
    .map((word) => word.id)
  assert.deepEqual(ids('field', 'asc'), expectedFields)
  assert.deepEqual(ids('field', 'desc'), [...expectedFields].reverse())
})

test('一覧で選んだ語は並び替え後の順を保ったまま既存の暗記カードへ渡せる', () => {
  const selected = [ALL_WORDS[17], ALL_WORDS[3], ALL_WORDS[29]]
  const source = {
    type: 'deck',
    ids: selected.map((word) => word.id),
    preserveOrder: true,
  }

  assert.deepEqual(
    buildDeck(source, { size: 0, purpose: 'study' }).map((word) => word.id),
    source.ids,
  )
})

test('級画面から一覧を開き、一覧選択だけを一時状態として復習へ渡す', () => {
  const levels = readFileSync(new URL('../src/screens/VocabLevels.jsx', import.meta.url), 'utf8')
  const decks = readFileSync(new URL('../src/screens/VocabDecks.jsx', import.meta.url), 'utf8')
  const catalog = readFileSync(new URL('../src/lib/vocabCatalog.js', import.meta.url), 'utf8')

  assert.match(levels, /data-vocab-catalog-entry/)
  assert.match(levels, /一覧から復習/)
  assert.match(decks, /data-vocab-catalog=\{level\.id\}/)
  assert.match(decks, /data-vocab-catalog-sort/)
  assert.match(catalog, /最終学習日/)
  assert.match(catalog, /最終テスト日/)
  assert.match(`${catalog}\n${decks}`, /先に復習する順/)
  assert.match(decks, /source: \{ type: 'deck', ids, preserveOrder: true \}/)
  assert.match(decks, /data-vocab-catalog-start-review/)
  assert.match(decks, /returnTo: \{ screen: 'vocabDecks', params: \{ levelId: level\.id, view: 'list' \} \}/)
  assert.equal(PERSISTED_PROGRESS_FIELDS.some((field) => /catalog|selected/i.test(field)), false)
})
