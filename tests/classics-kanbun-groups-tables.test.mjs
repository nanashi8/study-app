// 依頼 2026-09-24-classics-enrich の条件 kanbun-groups-tables。
// 全漢語が仲間（同じ読みの字・読み分ける字・反対の意味・テーマ）に、全漢文法項目が体系表に1つ以上入り、
// 仲間・表ごとに使い分けの解説を持ち、まとめて暗記・テストできること。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KANBUN_VOCAB } from '../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR, KANBUN_GRAMMAR_BY_ID } from '../src/data/kanbun-grammar.js'
import { KANBUN_VOCAB_GROUP_TYPES, KANBUN_VOCAB_GROUPS } from '../src/data/kanbun-vocab-groups.js'
import { KANBUN_GRAMMAR_SYSTEMS } from '../src/data/kanbun-grammar-systems.js'
import { pickKanbunQuestions } from '../src/data/kanbun-content.js'
import {
  KANBUN_GROUPS,
  KANBUN_SYSTEM_BY_ID,
  KANBUN_SYSTEMS,
  kanbunGroupsForItem,
  kanbunSystemItemIds,
  kanbunSystemsForItem,
} from '../src/lib/kanbunGroups.js'
import { AUXILIARY_TABLES } from '../src/lib/kotenConjugation.js'

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')

test('漢語の仲間：全語が1つ以上の仲間に入り、仲間の語はすべて漢語の見出しに引き当たる', () => {
  const titles = new Set(KANBUN_VOCAB.map((item) => item.title))
  for (const group of KANBUN_VOCAB_GROUPS) {
    for (const title of group.members) assert.ok(titles.has(title), `${group.id}: 「${title}」が漢語にない`)
  }
  const missing = KANBUN_VOCAB.filter((item) => kanbunGroupsForItem(item.id).length === 0)
  assert.deepEqual(missing.map((item) => `${item.id}${item.title}`), [], '仲間に入っていない漢語がある')
})

test('漢語の仲間：仲間は種類・名前・使い分けの解説・2語以上を持ち、4つの種類がそろう', () => {
  const typeIds = new Set(KANBUN_VOCAB_GROUP_TYPES.map((type) => type.id))
  const ids = new Set()
  for (const group of KANBUN_GROUPS) {
    assert.ok(!ids.has(group.id), `${group.id}: id が重複`)
    ids.add(group.id)
    assert.ok(typeIds.has(group.type), `${group.id}: 種類が不明`)
    assert.ok(group.title?.trim(), `${group.id}: 名前がない`)
    assert.ok(group.explain?.trim().length >= 30, `${group.id}: 使い分けの解説が短すぎる`)
    assert.ok(group.items.length >= 2, `${group.id}: 語が2つ未満`)
    assert.equal(new Set(group.items.map((item) => item.id)).size, group.items.length, `${group.id}: 同じ語が重複`)
    // 解説は仲間の語に触れて使い分けを書く（半分以上の語の字が解説に出てくる）。
    const named = group.items.filter((item) => group.explain.includes(item.title[0]))
    assert.ok(named.length * 2 >= group.items.length, `${group.id}: 解説が仲間の語に触れていない`)
  }
  for (const type of ['same', 'multi', 'pair', 'theme']) {
    assert.ok(KANBUN_GROUPS.some((group) => group.type === type), `種類 ${type} の仲間がない`)
  }
})

test('漢文法の体系表：依頼に挙げた11の表があり、全項目がどれかの表に入る', () => {
  const NAMED = {
    saidoku: '再読文字',
    hitei: '否定',
    'gimon-hango': '疑問と反語',
    'shieki-ukemi': '使役と受身',
    hikaku: '比較・選択',
    'gentei-ruika': '限定と累加',
    yokuyou: '抑揚',
    katei: '仮定',
    'ganbou-eitan': '願望と詠嘆',
    'hendoku-okiji': '返読文字と置き字',
    jodoushi: '書き下しで助動詞になる字とその活用',
  }
  for (const [id, title] of Object.entries(NAMED)) {
    assert.ok(KANBUN_SYSTEM_BY_ID[id]?.title.includes(title), `体系表「${title}」がない`)
  }
  assert.equal(new Set(KANBUN_GRAMMAR_SYSTEMS.map((system) => system.id)).size, KANBUN_GRAMMAR_SYSTEMS.length)
  const titles = new Set(KANBUN_GRAMMAR.map((item) => item.title))
  const inSomeTable = new Set()
  for (const system of KANBUN_SYSTEMS) {
    assert.ok(system.explain?.trim().length >= 30, `${system.id}: 使い分けの解説がない`)
    assert.ok(system.columns.length >= 2, `${system.id}: 列`)
    for (const row of system.rows) {
      if (row.group) continue
      assert.equal(row.cells.length, system.columns.length, `${system.id}: 「${row.cells[0]}」の欄の数が列と違う`)
      assert.ok(row.cells.every((cell) => cell.trim()), `${system.id}: 「${row.cells[0]}」に空の欄がある`)
      assert.ok(row.items.length > 0, `${system.id}: 「${row.cells[0]}」がどの項目の行かわからない`)
      for (const title of row.items) assert.ok(titles.has(title), `${system.id}: 「${title}」が漢文法にない`)
      assert.equal(row.ids.length, row.items.length, `${system.id}: 「${row.cells[0]}」の項目が引き当たらない`)
      for (const id of row.ids) inSomeTable.add(id)
    }
    for (const aux of system.aux ?? []) {
      assert.ok(AUXILIARY_TABLES[aux.name], `${system.id}: 助動詞「${aux.name}」の活用表がない`)
      assert.ok(aux.gloss?.trim(), `${system.id}: 「${aux.name}」がどの字の形かを書いていない`)
    }
  }
  for (const item of KANBUN_GRAMMAR) assert.ok(inSomeTable.has(item.id), `${item.id} ${item.title} がどの体系表にも入っていない`)
  // 表の中身が、その表の分野の全項目を覆う。
  const inTable = (id) => new Set(kanbunSystemItemIds(KANBUN_SYSTEM_BY_ID[id]))
  const COVER = { saidoku: 'saidoku', negation: 'hitei', question: 'gimon-hango', voice: 'shieki-ukemi' }
  for (const [category, systemId] of Object.entries(COVER)) {
    const table = inTable(systemId)
    for (const item of KANBUN_GRAMMAR.filter((entry) => entry.category === category)) {
      assert.ok(table.has(item.id), `${item.id} ${item.title} が表「${KANBUN_SYSTEM_BY_ID[systemId].title}」にない`)
    }
  }
  // 書き下しで助動詞になる字の表は、7つの助動詞の活用表を持つ。
  assert.deepEqual(
    KANBUN_SYSTEM_BY_ID.jodoushi.aux.map((aux) => aux.name),
    ['ず', 'べし', 'しむ', 'る', 'らる', 'ごとし', 'なり（断定）'],
  )
  // 項目から、その項目が入っている表を引ける。
  for (const item of KANBUN_GRAMMAR) assert.ok(kanbunSystemsForItem(item.id).length > 0, item.id)
})

test('漢語の仲間・漢文法の体系表：仲間・表ごとに、その語・項目をまとめて暗記・テストできる', () => {
  for (const group of KANBUN_GROUPS) {
    const ids = group.items.map((item) => item.id)
    const asked = new Set(pickKanbunQuestions('vocab', ids, { size: 9999, rng: () => 0.5 }).map((question) => question.itemId))
    for (const id of ids) assert.ok(asked.has(id), `${group.id}: ${id} のテストの問題がない`)
  }
  for (const system of KANBUN_SYSTEMS) {
    const ids = kanbunSystemItemIds(system)
    assert.ok(ids.every((id) => KANBUN_GRAMMAR_BY_ID[id]), system.id)
    const asked = new Set(pickKanbunQuestions('grammar', ids, { size: 9999, rng: () => 0.5 }).map((question) => question.itemId))
    for (const id of ids) assert.ok(asked.has(id), `${system.id}: ${id} のテストの問題がない`)
  }
  const catalog = read('src/screens/KanbunCatalog.jsx')
  assert.match(catalog, /view === 'groups' && domain === 'vocab'/u, '漢語の仲間の画面がない')
  assert.match(catalog, /view === 'systems' && domain === 'grammar'/u, '漢文法の体系表の画面がない')
  assert.match(catalog, /<GroupCard[\s\S]*?onStudy=\{\(\) => study\(group\.items/u, '仲間ごとの暗記の入口がない')
  assert.match(catalog, /<GroupCard[\s\S]*?onQuiz=\{\(\) => quiz\(group\.items/u, '仲間ごとのテストの入口がない')
  assert.match(catalog, /<SystemCard[\s\S]*?onStudy=\{\(\) => study\(items/u, '体系表ごとの暗記の入口がない')
  assert.match(catalog, /<SystemCard[\s\S]*?onQuiz=\{\(\) => quiz\(items/u, '体系表ごとのテストの入口がない')
  assert.match(catalog, /<KanbunSystemTable/u, '体系表を表で出していない')
  assert.match(catalog, /<KanbunSystemAuxTables/u, '助動詞になる字の活用表を出していない')
  assert.match(catalog, /data-kanbun-groups-entry/u, '漢語のトップに仲間の入口がない')
  assert.match(catalog, /data-kanbun-systems-entry/u, '漢文法のトップに体系表の入口がない')
})
