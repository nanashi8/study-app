import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ALL_WORDS,
  ETYMOLOGY_DOMAIN_META,
  ETYMOLOGY_FIELD_TO_DOMAIN,
  ETYMOLOGY_FORMATION_META,
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  ETYMOLOGY_SOURCE_META,
  ETYMOLOGY_SUMMARY,
  ROOTS,
  getEtymologyPack,
} from '../src/data/vocab.js'
import { buildEtymologyCompression } from '../src/data/etymology-compression.js'
import { wordsForSource } from '../src/lib/session.js'

const compact = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, '')
const byHead = new Map()
const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))
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

test('成り立ち・変化は非同根を明示し、全パックを8語以内で学べる', () => {
  const packIds = new Set()
  for (const pack of ETYMOLOGY_PACKS) {
    assert.ok(!packIds.has(pack.id), pack.id)
    packIds.add(pack.id)
    assert.doesNotMatch(pack.id, /[.#$[\]/]/, `${pack.id}: Firebaseで保存できないID`)
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

test('成り立ち・出発言語・意味領域を混ぜず、同じ軸だけで由来パックを作る', () => {
  const originPacks = ETYMOLOGY_PACKS.filter((pack) => pack.mode === 'origin')
  assert.equal(originPacks.length, ETYMOLOGY_SUMMARY.origin.packs)
  assert.equal(
    originPacks.filter((pack) => pack.coverageIds.length === 1).length,
    ETYMOLOGY_SUMMARY.origin.singletonPacks,
  )

  for (const pack of originPacks) {
    assert.ok(ETYMOLOGY_FORMATION_META[pack.formationKey], pack.id)
    assert.ok(ETYMOLOGY_SOURCE_META[pack.sourceKey], pack.id)
    assert.ok(ETYMOLOGY_DOMAIN_META[pack.domainKey], pack.id)
    assert.ok(pack.sharedLabel, pack.id)
    assert.match(pack.caution, /共通点/, pack.id)
    assert.doesNotMatch(pack.title, /意味変化の物語|由来の読み方/, pack.id)

    const words = pack.coverageIds.map((id) => byId.get(id))
    assert.ok(words.every(Boolean), pack.id)
    assert.deepEqual(
      new Set(words.map((word) => word.compression.formationKey)),
      new Set([pack.formationKey]),
      pack.id,
    )
    assert.deepEqual(
      new Set(words.map((word) => word.compression.sourceKey)),
      new Set([pack.sourceKey]),
      pack.id,
    )
    assert.deepEqual(
      new Set(words.map((word) => word.compression.domainKey)),
      new Set([pack.domainKey]),
      pack.id,
    )
    assert.ok(
      words.every((word) =>
        (ETYMOLOGY_FIELD_TO_DOMAIN[word.field] ?? 'other') === pack.domainKey),
      pack.id,
    )
    if (pack.domainKey === 'core') {
      assert.equal(pack.wordClasses.length, 1, `${pack.id}: 基礎・日常は品詞群も統一`)
    }
  }
})

test('代表語を形成法と言語層の別軸へ分類し、旧来の無関係な束を分離する', () => {
  const word = (head) => ALL_WORDS.find((item) => item.word.toLowerCase() === head)
  assert.deepEqual(
    [word('sun').compression.formationKey, word('sun').compression.sourceKey],
    ['inherited', 'oldEnglish'],
  )
  assert.deepEqual(
    [word('travel').compression.formationKey, word('travel').compression.sourceKey],
    ['borrowing', 'french'],
  )
  assert.deepEqual(
    [word('window').compression.formationKey, word('window').compression.sourceKey],
    ['construction', 'norse'],
  )
  assert.deepEqual(
    [word('zoo').compression.formationKey, word('zoo').compression.sourceKey],
    ['shortening', 'greek'],
  )
  assert.equal(word('big').compression.formationKey, 'uncertain')
  assert.notEqual(word('comic').compression.packId, word('box').compression.packId)
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
