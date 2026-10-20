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

// 2026-10-20 の確かめ直し。一覧の行が指す熟語と同じ形（~・A/B・do/doing・one's を落とした形）の
// ほかの熟語・構文・複数語の単語が上限より上にあるのは、意味の違う別の表現だと読んで決めたものだけ。
const SAME_FORM_DIFFERENT_MEANING = Object.freeze({
  // 一覧の行が指す熟語 → 上限より上にある同じ形の項目: 別の表現と決めた理由
  'curr1900_idm_2_derive_from>exam_syn_derive_a_from_b': '「〜に由来する」と「AをBから得る・導く」（他動詞の使い方）',
  'exam_idm_refer_to>curr_idm_pre1_refer_a_to_b': '「〜を指す・言及する」と「AをBに照会・紹介する」',
  'exam_syn_without_doing>curr_idm_2_do_without': '「〜せずに」と「〜なしで済ませる」',
  'jr_idm_come_to_do>curr1900_idm_2_come_to': '「〜するようになる」と「意識を取り戻す・合計〜になる」',
  'syn_so_that>curr1900_idm_pre1_blank_so_that_blank': '「とても…なので〜」と「〜、その結果…」',
  'jr_idm_take_a_to_b>curr_idm_2_take_to': '「AをBに連れて行く」と「〜を好きになる・〜を始める」',
  'jr_idm_put_a_in_b>curr1900_idm_2_put_in': '「AをBに入れる」と「〜を提出する・注ぎ込む」',
})
const sameForm = (text) => String(text).normalize('NFKC').toLowerCase()
  .replace(/[~〜…—]|\.\.\./g, ' ')
  .replace(/\(([^)]*)\)/g, '$1')
  .replace(/\b(a|b|c|d)\b/g, ' ')
  .replace(/\b(one's|oneself|someone's|someone|something|sb|sth|doing|do)\b/g, ' ')
  .replace(/[?!.,/]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
const PHRASE_LIST_KEYS = ['high-school-phrases', 'junior-phrases']

test('熟語の一覧の行が指す熟語と同じ形の項目は、上限以下か、意味の違う別の表現と決めたものだけ', () => {
  const heads = [
    ...PHRASES.map((phrase) => [phrase, phrase.phrase]),
    ...ALL_WORDS.filter((word) => /\s/.test(word.word)).map((word) => [word, word.word]),
  ]
  const byForm = new Map()
  for (const [entry, head] of heads) {
    const form = sameForm(head)
    if (!byForm.has(form)) byForm.set(form, [])
    byForm.get(form).push(entry)
  }
  const found = new Set()
  for (const key of PHRASE_LIST_KEYS) {
    const { cap, rows } = list(key)
    for (const [, ids] of rows) {
      for (const id of ids) {
        const entry = entries.get(id)
        for (const other of byForm.get(sameForm(entry.phrase ?? entry.word)) ?? []) {
          if (other.id !== id && rank(other.level) > rank(cap)) found.add(`${id}>${other.id}`)
        }
      }
    }
  }
  assert.deepEqual([...found].sort(), Object.keys(SAME_FORM_DIFFERENT_MEANING).sort())
})

test('熟語の一覧の行が指す熟語・構文は、熟語・構文の級ごとの一覧と辞書の見出しに、上限以下の同じ級で出る', async () => {
  const { phrasesByLevel } = await import('../src/data/phrases.js')
  const { DICTIONARY_ENTRIES } = await import('../src/lib/dictionary.js')
  const dictionary = new Map(DICTIONARY_ENTRIES.map((entry) => [entry.id, entry]))
  let checked = 0
  for (const key of PHRASE_LIST_KEYS) {
    const { cap, rows } = list(key)
    for (const [, ids] of rows) {
      for (const id of ids) {
        const entry = entries.get(id)
        assert.ok(rank(entry.level) <= rank(cap), `${key}: ${id}=${entry.level}`)
        assert.ok(entry.kind, `${id} は熟語・構文ではない`)
        assert.ok(phrasesByLevel(entry.kind, entry.level).some((phrase) => phrase.id === id), `${id} が級の一覧にない`)
        assert.equal(dictionary.get(`${entry.kind}:${id}`)?.level, entry.level, `${id} の辞書の級`)
        checked += 1
      }
    }
  }
  assert.equal(checked, 1400)
})

// 一覧には同じ語が2回出る行もある（高校の単語の一覧に3組）ので、指紋の重なりは止めない。
test('一覧ごとの行は指紋の順に並ぶ（Excel を読み直したときに比べられる形）', () => {
  for (const { key, rows } of LEVEL_CAP_LISTS) {
    const hashes = rows.map(([hash]) => hash)
    assert.deepEqual(hashes, [...hashes].sort(), `${key} の行が指紋の順でない`)
  }
})

// 手元に Excel があるときは LEVEL_CAP_SHEET にパスを渡すと、全行を読み直して台帳と比べる。
test('Excel を読み直すと、4つの一覧の全行が台帳の行と一致する', { skip: !process.env.LEVEL_CAP_SHEET }, async () => {
  const { spawnSync } = await import('node:child_process')
  const result = spawnSync(process.execPath, ['scripts/check-level-cap-sheet.mjs', process.env.LEVEL_CAP_SHEET], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stdout + result.stderr)
})
