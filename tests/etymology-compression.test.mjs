import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ALL_WORDS,
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  ETYMOLOGY_SUMMARY,
  ROOTS,
  getEtymologyPack,
} from '../src/data/vocab.js'
import { buildEtymologyCompression } from '../src/data/etymology-compression.js'
import { wordsForSource } from '../src/lib/session.js'

const compact = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, '')
const byHead = new Map()
for (const word of ALL_WORDS) {
  byHead.set(word.word.toLowerCase(), word)
  if (!byHead.has(compact(word.word))) byHead.set(compact(word.word), word)
}

const familyRelationIds = (word) => new Set(
  [...(word.family ?? []), ...(word.derivatives ?? [])]
    .map((item) => byHead.get(item.w.toLowerCase()) ?? byHead.get(compact(item.w)))
    .map((related) => related?.id)
    .filter((id) => id && id !== word.id),
)

test('全英単語が4つの語源濃縮ルートへ重複なく入る', () => {
  assert.equal(ETYMOLOGY_SUMMARY.total, ALL_WORDS.length)
  assert.equal(ETYMOLOGY_SUMMARY.covered, ALL_WORDS.length)
  assert.equal(
    Object.values(ETYMOLOGY_SUMMARY.counts).reduce((sum, count) => sum + count, 0),
    ALL_WORDS.length,
  )
  assert.deepEqual(
    new Set(Object.keys(ETYMOLOGY_SUMMARY.counts)),
    new Set(Object.keys(ETYMOLOGY_MODE_META)),
  )

  const coverage = ETYMOLOGY_PACKS.flatMap((pack) => pack.coverageIds)
  assert.equal(coverage.length, ALL_WORDS.length)
  assert.equal(new Set(coverage).size, ALL_WORDS.length)
  assert.deepEqual(new Set(coverage), new Set(ALL_WORDS.map((word) => word.id)))

  for (const word of ALL_WORDS) {
    assert.ok(word.compression, word.id)
    const pack = getEtymologyPack(word.compression.packId)
    assert.ok(pack, `${word.id}: ${word.compression.packId}`)
    assert.equal(pack.mode, word.compression.mode, word.id)
    assert.ok(pack.coverageIds.includes(word.id), word.id)
  }
})

test('濃縮ルートは語源データの強さを越えて推測しない', () => {
  for (const word of ALL_WORDS) {
    const formula = (word.etymology?.parts?.length ?? 0) >= 2
    const relations = familyRelationIds(word)
    const mode = word.compression.mode

    if (formula) {
      assert.equal(mode, 'formula', word.id)
    } else if (word.roots.length) {
      assert.equal(mode, 'root', word.id)
    } else if (relations.size) {
      assert.equal(mode, 'family', word.id)
    } else {
      assert.equal(mode, 'origin', word.id)
    }

    if (mode === 'family') {
      assert.ok(
        word.compression.anchorId === word.id ||
          relations.has(word.compression.anchorId),
        `${word.id}: anchor=${word.compression.anchorId}`,
      )
    }
  }
})

test('由来の型は同語根ではないことを明示し、全パックを8語以内で学べる', () => {
  const packIds = new Set()
  for (const pack of ETYMOLOGY_PACKS) {
    assert.ok(!packIds.has(pack.id), pack.id)
    packIds.add(pack.id)
    assert.ok(pack.coverageIds.length > 0, pack.id)
    assert.ok(pack.studyIds.length > 0 && pack.studyIds.length <= 8, pack.id)
    assert.equal(new Set(pack.studyIds).size, pack.studyIds.length, pack.id)
    assert.ok(pack.studyIds.every((id) => ALL_WORDS.some((word) => word.id === id)), pack.id)
    if (pack.mode === 'origin') assert.match(pack.caution, /同じ語根/, pack.id)

    assert.deepEqual(
      wordsForSource({ type: 'deck', ids: pack.studyIds }).map((word) => word.id),
      pack.studyIds,
      pack.id,
    )
  }
})

test('同じ全語データから濃縮パックを決定的に再生成できる', () => {
  const rebuilt = buildEtymologyCompression(ALL_WORDS, ROOTS)
  assert.deepEqual(rebuilt.summary, ETYMOLOGY_SUMMARY)
  assert.deepEqual(
    rebuilt.packs.map((pack) => ({
      id: pack.id,
      coverageIds: pack.coverageIds,
      studyIds: pack.studyIds,
    })),
    ETYMOLOGY_PACKS.map((pack) => ({
      id: pack.id,
      coverageIds: pack.coverageIds,
      studyIds: pack.studyIds,
    })),
  )
})
