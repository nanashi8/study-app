// 依頼 2026-09-24-classics-enrich の条件 koten-grammar-tables。
// 活用する文法項目（用言の活用・助動詞・敬語動詞）の全件が活用表を持ち、全項目が体系表のどれかに入り、
// 体系表（用言の活用一覧・助動詞一覧（接続別）・助詞一覧（種類別）・敬語動詞一覧 など）ごとに
// まとめて暗記・テストでき、暗記カードの裏と文法辞典に表で出ること。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KOTEN_GRAMMAR, KOTEN_GRAMMAR_BY_ID } from '../src/data/koten-grammar.js'
import { pickKotenGrammarQuestions } from '../src/data/koten-grammar-questions.js'
import {
  KOTEN_GRAMMAR_SYSTEM_BY_ID,
  KOTEN_GRAMMAR_SYSTEMS,
  kotenGrammarSystemItemIds,
} from '../src/data/koten-grammar-systems.js'
import { AUXILIARY_TABLES, dictionaryFormOf } from '../src/lib/kotenConjugation.js'
import { kotenGrammarConjugationTables, kotenGrammarListTable } from '../src/lib/kotenGrammarTables.js'

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')

// 活用・接続と敬語の項目のうち、活用する語そのものではなく、しくみを説明する項目（一覧表を持つ）。
const CONCEPT_ITEMS = new Set([
  'kg_forms_usage', 'kg_verb_type_identify', 'kg_onbin', 'kg_onbin_hatsuon', 'kg_gokan',
  'kg_honorific_direction', 'kg_hon_nihoumen', 'kg_hon_shugo', 'kg_hon_jikei',
])
const conjugatingItems = KOTEN_GRAMMAR.filter((item) => (
  item.category === 'auxiliary'
  || ((item.category === 'inflection' || item.category === 'honorific') && !CONCEPT_ITEMS.has(item.id))
))

test('古典文法の活用表：活用する項目の全件が、6活用形の活用表を持つ', () => {
  assert.equal(conjugatingItems.length, 26 + 13 + 9)
  for (const item of conjugatingItems) {
    const tables = kotenGrammarConjugationTables(item)
    assert.ok(tables.length > 0, `${item.id} ${item.title}: 活用表がない`)
    for (const table of tables) assert.equal(table.forms.length, 6, `${item.id}: 活用形が6つない`)
    for (const name of item.table.aux ?? []) assert.ok(AUXILIARY_TABLES[name], `${item.id}: 助動詞「${name}」の表がない`)
    for (const spec of item.table.conj ?? []) {
      const table = tables.find((entry) => entry.label.startsWith(`${spec.word}（`) && entry.type === spec.type)
      assert.ok(table, `${item.id}: ${spec.word}（${spec.type}）の活用表が組み立てられない`)
      assert.equal(dictionaryFormOf(table), spec.word, `${item.id}: ${spec.word} の活用表の終止形が見出しと違う`)
    }
  }
  // 助動詞の項目は助動詞の活用表を、用言の項目は語の活用表を持つ。
  for (const item of conjugatingItems.filter((entry) => entry.category === 'auxiliary')) {
    assert.ok(item.table.aux?.length, `${item.id}: 助動詞の活用表がない`)
  }
  for (const id of CONCEPT_ITEMS) {
    assert.ok(kotenGrammarListTable(KOTEN_GRAMMAR_BY_ID[id]), `${id}: しくみの一覧表がない`)
  }
})

test('古典文法の体系表：依頼に挙げた4つの表があり、全項目がどれかの表に入る', () => {
  const NAMED = {
    yougen: '用言の活用一覧',
    jodoushi: '助動詞一覧（接続別）',
    joshi: '助詞一覧（種類別）',
    keigo: '敬語動詞一覧（普通の語との対応）',
  }
  for (const [id, title] of Object.entries(NAMED)) {
    assert.equal(KOTEN_GRAMMAR_SYSTEM_BY_ID[id]?.title, title, `体系表「${title}」がない`)
  }
  assert.equal(new Set(KOTEN_GRAMMAR_SYSTEMS.map((system) => system.id)).size, KOTEN_GRAMMAR_SYSTEMS.length)
  const inSomeTable = new Set()
  for (const system of KOTEN_GRAMMAR_SYSTEMS) {
    assert.ok(system.explain?.trim().length >= 30, `${system.id}: 使い分けの解説がない`)
    assert.ok(system.columns.length >= 2, `${system.id}: 列`)
    for (const row of system.rows) {
      if (row.group) continue
      assert.equal(row.cells.length, system.columns.length, `${system.id}: 「${row.cells[0]}」の欄の数が列と違う`)
      assert.ok(row.cells.every((cell) => cell.trim()), `${system.id}: 「${row.cells[0]}」に空の欄がある`)
      assert.ok(row.ids.length > 0, `${system.id}: 「${row.cells[0]}」がどの項目の行かわからない`)
      for (const id of row.ids) {
        assert.ok(KOTEN_GRAMMAR_BY_ID[id], `${system.id}: ${id} が項目にない`)
        inSomeTable.add(id)
      }
    }
  }
  for (const item of KOTEN_GRAMMAR) assert.ok(inSomeTable.has(item.id), `${item.id} ${item.title} がどの体系表にも入っていない`)
  // 表の中身が、その表の分野の全項目を覆う。
  const inTable = (id) => new Set(kotenGrammarSystemItemIds(KOTEN_GRAMMAR_SYSTEM_BY_ID[id]))
  const jodoushi = inTable('jodoushi')
  for (const item of KOTEN_GRAMMAR.filter((entry) => entry.category === 'auxiliary')) {
    assert.ok(jodoushi.has(item.id), `${item.id} が助動詞一覧にない`)
  }
  const yougen = inTable('yougen')
  for (const item of conjugatingItems.filter((entry) => entry.category === 'inflection')) {
    assert.ok(yougen.has(item.id), `${item.id} が用言の活用一覧にない`)
  }
  const keigo = new Set([...inTable('keigo'), ...inTable('keigo-shikumi')])
  for (const item of KOTEN_GRAMMAR.filter((entry) => entry.category === 'honorific')) {
    assert.ok(keigo.has(item.id), `${item.id} が敬語の表にない`)
  }
})

test('古典文法の体系表：表ごとに、表に出てくる項目をまとめて暗記・テストできる', () => {
  for (const system of KOTEN_GRAMMAR_SYSTEMS) {
    const ids = kotenGrammarSystemItemIds(system)
    assert.ok(ids.length > 0, system.id)
    const questions = pickKotenGrammarQuestions(ids, { size: 9999, rng: () => 0.5 })
    const asked = new Set(questions.flatMap((question) => question.grammarIds))
    for (const id of ids) assert.ok(asked.has(id), `${system.id}: ${id} のテストの問題がない`)
  }
  const screen = read('src/screens/KotenGrammar.jsx')
  assert.match(screen, /<SystemCard[\s\S]*?onStudy=\{\(\) => study\(ids\.map/u, '体系表ごとの暗記の入口がない')
  assert.match(screen, /<SystemCard[\s\S]*?onQuiz=\{\(\) => quiz\(ids\.map/u, '体系表ごとのテストの入口がない')
  assert.match(screen, /<KotenGrammarSystemTable/u, '体系表を表で出していない')
  assert.match(screen, /data-koten-grammar-systems-entry/u, '古典文法のトップに体系表の入口がない')
})

test('古典文法の体系表：暗記カードの裏・文法辞典・テストの答え合わせに表を出す', () => {
  assert.match(read('src/screens/KotenGrammarStudy.jsx'), /<KotenGrammarTables item=\{item\}/u, '暗記カードの裏に表がない')
  assert.match(read('src/screens/KotenGrammar.jsx'), /function GrammarItemDetail[\s\S]*?<KotenGrammarTables item=\{item\}/u, '文法辞典に表がない')
  assert.match(read('src/screens/KotenGrammarQuiz.jsx'), /<KotenGrammarTablesToggle item=\{item\}/u, 'テストの答え合わせに表がない')
})
