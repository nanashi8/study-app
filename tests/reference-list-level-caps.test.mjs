// 語彙の4つの一覧（高校の単語・熟語、中学の単語・熟語）の語が、学べる級に置かれているか。
// 高校の一覧は2級以下、中学の一覧は3級以下（2026-10-09 の依頼）。
import test from 'node:test'
import assert from 'node:assert/strict'
import { ALL_WORDS } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { JUNIOR_CORE_PHRASES } from '../src/data/phrases-junior-core.js'
import { LEVEL_CAP_DECISIONS, LEVEL_CAP_LISTS } from '../scripts/data/level-cap-review.js'

const LEVELS = ['5', '4', '3', 'pre2', '2', 'pre1', '1']
const rank = (level) => LEVELS.indexOf(level)
const entries = new Map([
  ...ALL_WORDS.map((word) => [word.id, word]),
  ...PHRASES.map((phrase) => [phrase.id, phrase]),
])
const list = (key) => LEVEL_CAP_LISTS.find((item) => item.key === key)

// 一覧の行の数（空の番号は除く）と、アプリに見出しが無い行の数。
const EXPECTED = {
  'high-school-words': { cap: '2', rows: 1900, missing: 0 },
  'high-school-phrases': { cap: '2', rows: 1000, missing: 0 },
  'junior-words': { cap: '3', rows: 1784, missing: 0 },
  'junior-phrases': { cap: '3', rows: 400, missing: 0 },
}

test('4つの一覧の全行が、アプリの見出しに結び付いているか、見出しが無いと書いてある', () => {
  assert.deepEqual(LEVEL_CAP_LISTS.map((item) => item.key), Object.keys(EXPECTED))
  for (const [key, expected] of Object.entries(EXPECTED)) {
    const { cap, rows } = list(key)
    assert.equal(cap, expected.cap, key)
    assert.equal(rows.length, expected.rows, `${key} の行の数`)
    assert.equal(rows.filter(([, ids]) => ids.length === 0).length, expected.missing, `${key} の見出しが無い行`)
    for (const [hash, ids] of rows) {
      assert.match(hash, /^[0-9a-f]{16}$/)
      for (const id of ids) assert.ok(entries.has(id), `${key}: ${id} はアプリの見出しにない`)
    }
  }
})

for (const [key, { cap }] of Object.entries(EXPECTED)) {
  test(`${key} の一覧が指す見出しは、すべて上限（${cap}）以下の級にある`, () => {
    const over = []
    for (const [, ids] of list(key).rows) {
      for (const id of ids) {
        const level = entries.get(id).level
        if (rank(level) > rank(cap)) over.push(`${id}=${level}`)
      }
    }
    assert.deepEqual(over, [])
  })
}

test('上限を超えていた見出しは1件ずつ級を決めてあり、決めた級でアプリに出る', () => {
  const capOf = new Map()
  for (const { cap, rows } of LEVEL_CAP_LISTS) {
    for (const [, ids] of rows) {
      for (const id of ids) {
        if (!capOf.has(id) || rank(cap) < rank(capOf.get(id))) capOf.set(id, cap)
      }
    }
  }
  const decided = Object.entries(LEVEL_CAP_DECISIONS)
  assert.equal(decided.length, 921)
  for (const [id, [from, to]] of decided) {
    assert.ok(capOf.has(id), `${id} は一覧の行が指していない`)
    assert.ok(rank(from) > rank(capOf.get(id)), `${id}: 元の級 ${from} は上限を超えていない`)
    assert.ok(rank(to) <= rank(capOf.get(id)), `${id}: 決めた級 ${to} が上限を超える`)
    assert.equal(entries.get(id).level, to, `${id}: アプリの級が決めた級と違う`)
  }
  // 上限にそろえず1件ずつ決めた（上限より下に置いたものがある）。
  assert.ok(decided.some(([id, [, to]]) => rank(to) < rank(capOf.get(id))))
})

test('アプリに無かった中学の熟語156行は、足した熟語155件（2行が同じ熟語）にすべて結び付き、3級以下で中身がそろっている', () => {
  assert.equal(JUNIOR_CORE_PHRASES.length, 155)
  const rowIds = new Set(list('junior-phrases').rows.flatMap(([, ids]) => ids))
  const ids = new Set(PHRASES.map((phrase) => phrase.id))
  for (const phrase of JUNIOR_CORE_PHRASES) {
    assert.ok(ids.has(phrase.id), `${phrase.id} が PHRASES にない`)
    assert.ok(rowIds.has(phrase.id), `${phrase.id} を指す一覧の行がない`)
    assert.ok(rank(phrase.level) <= rank('3'), `${phrase.id} は3級より上`)
    assert.ok(phrase.meaning && phrase.example.en && phrase.example.ja && phrase.origin && phrase.note, phrase.id)
  }
  const sorted = [...JUNIOR_CORE_PHRASES].map((phrase) => phrase.phrase)
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
  assert.deepEqual(JUNIOR_CORE_PHRASES.map((phrase) => phrase.phrase), sorted)
})
