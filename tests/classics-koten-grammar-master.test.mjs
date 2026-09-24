// 依頼 2026-09-24-classics-enrich の条件 koten-grammar-master。
// 古典文法の必修項目リスト（docs/audits/classics-coverage.json の kotenGrammar）の全件が項目としてあり、
// 学校文法の全範囲（用言の活用と活用形の用法・助動詞の全語・助詞6種・係り結び・呼応の副詞・敬語・識別・
// 和歌修辞・文の読み方）がそろっていること。リストにない項目は教材に置かない。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KOTEN_GRAMMAR, KOTEN_GRAMMAR_BY_ID } from '../src/data/koten-grammar.js'
import { KOTEN_GRAMMAR_SYSTEM_BY_ID } from '../src/data/koten-grammar-systems.js'
import { AUXILIARY_TABLES } from '../src/lib/kotenConjugation.js'

const coverage = JSON.parse(readFileSync(new URL('../docs/audits/classics-coverage.json', import.meta.url), 'utf8'))

// 依頼の文に挙げた範囲。
const SECTIONS = [
  '用言の活用と活用形の用法', '助動詞',
  '助詞（格助詞）', '助詞（接続助詞）', '助詞（副助詞）', '助詞（係助詞）', '助詞（終助詞）', '助詞（間投助詞）',
  '係り結び', '呼応の副詞', '敬語', '識別', '和歌修辞', '文の読み方',
]

test('古典文法の必修項目：リストの全件が項目としてあり、教材の全項目がリストにある', () => {
  const list = coverage.kotenGrammar
  assert.equal(list.length, 130)
  assert.equal(list.filter((entry) => entry.since === 'existing').length, 74)
  assert.equal(new Set(list.map((entry) => entry.id)).size, list.length, '必修項目リストに重複がある')
  for (const entry of list) {
    const item = KOTEN_GRAMMAR_BY_ID[entry.id]
    assert.ok(item, `${entry.id}（${entry.title}）が古典文法にない`)
    assert.equal(item.title, entry.title, `${entry.id}: 題名がリストと違う`)
    assert.ok(item.forms?.trim() && item.connection?.trim(), `${entry.id}: 形・接続`)
    assert.ok(item.meaning?.trim() && item.summary?.trim(), `${entry.id}: 意味・要点`)
    assert.ok(item.example?.ja?.trim() && item.example?.gendai?.trim(), `${entry.id}: 用例と現代語訳`)
  }
  const listed = new Set(list.map((entry) => entry.id))
  for (const item of KOTEN_GRAMMAR) assert.ok(listed.has(item.id), `${item.id} ${item.title} が必修項目リストにない`)
  const sections = new Set(list.map((entry) => entry.section))
  for (const section of SECTIONS) assert.ok(sections.has(section), `範囲「${section}」の項目がない`)
  assert.deepEqual([...sections].filter((section) => !SECTIONS.includes(section)), [], '依頼にない範囲がある')
})

test('古典文法の必修項目：助動詞は学校文法の28語と上代の3語のすべてに項目がある', () => {
  const covered = new Set(KOTEN_GRAMMAR.flatMap((item) => item.table?.aux ?? []))
  for (const name of Object.keys(AUXILIARY_TABLES)) {
    assert.ok(covered.has(name), `助動詞「${name}」を説明する項目がない`)
  }
  assert.equal(covered.size, Object.keys(AUXILIARY_TABLES).length)
})

test('古典文法の必修項目：助詞6種の主な語が、助詞一覧のどれかの行にある', () => {
  const REQUIRED = {
    格助詞: ['の', 'が', 'に', 'を', 'へ', 'より', 'から', 'にて', 'して', 'と'],
    接続助詞: ['ば', 'と', 'とも', 'ど', 'ども', 'が', 'に', 'を', 'て', 'して', 'で', 'つつ', 'ながら', 'ものの', 'ものを', 'ものから', 'ものゆゑ'],
    副助詞: ['だに', 'すら', 'さへ', 'のみ', 'ばかり', 'まで', 'など', 'し', 'しも'],
    係助詞: ['は', 'も', 'ぞ', 'なむ', 'や', 'か', 'こそ'],
    終助詞: ['ばや', 'なむ', 'てしがな', 'にしがな', 'もがな', 'がな', 'な', 'そ', 'かし', 'かな', 'かも'],
    間投助詞: ['や', 'よ', 'を'],
  }
  const table = KOTEN_GRAMMAR_SYSTEM_BY_ID.joshi
  let group = null
  const words = {}
  for (const row of table.rows) {
    if (row.group) {
      group = Object.keys(REQUIRED).find((name) => row.group.startsWith(name))
      assert.ok(group, `助詞一覧の見出し「${row.group}」が6種のどれでもない`)
      continue
    }
    const listed = row.cells[0].split(/[・／…]/u).map((word) => word.trim()).filter(Boolean)
    words[group] = [...(words[group] ?? []), ...listed]
    for (const id of row.ids) assert.ok(KOTEN_GRAMMAR_BY_ID[id], `助詞一覧の ${id} が項目にない`)
  }
  for (const [kind, required] of Object.entries(REQUIRED)) {
    for (const word of required) assert.ok(words[kind]?.includes(word), `${kind}「${word}」が助詞一覧にない`)
  }
})

test('古典文法の必修項目：敬語・係り結び・呼応の副詞・文の読み方の、依頼に挙げた項目がある', () => {
  const sectionOf = Object.fromEntries(coverage.kotenGrammar.map((entry) => [entry.id, entry.section]))
  const REQUIRED = {
    kg_hon_hojo: '敬語', // 本動詞と補助動詞
    kg_hon_nihoumen: '敬語', // 二方面への敬語
    kg_hon_shugo: '敬語', // 敬語から主語を決める
    kg_kakari_shouryaku: '係り結び', // 結びの省略
    kg_kakari_nagare: '係り結び', // 結びの流れ
    kg_kakari_koso: '係り結び', // こその逆接
    kg_forms_usage: '用言の活用と活用形の用法',
    kg_read_shugo: '文の読み方',
  }
  for (const [id, section] of Object.entries(REQUIRED)) {
    assert.equal(sectionOf[id], section, `${id} が「${section}」にない`)
  }
  assert.match(KOTEN_GRAMMAR_BY_ID.kg_kakari_koso.usage, /逆接/u, '「こそ」の逆接の説明がない')
  assert.ok(coverage.kotenGrammar.filter((entry) => entry.section === '呼応の副詞').length >= 6)
})
