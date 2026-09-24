// 語法問題が「英検で実際に問われる語法」になっているか、そして語法を学習でも学べるかを守るテスト。
//
// 2026-09-24、利用者の「語法問題の品質は英検で実際に問われる語法となっているか。
// また、語法について学習で学べるようになっているか」への答えとして、語法385問を1問ずつ読み直した。
// 文法の規則だけで答えが決まる問題（時制・相の形、一致、語順・倒置、付加疑問、感嘆文、
// 関係詞や接続詞の選択、仮定法の形、冠詞の a / an、代名詞の格）は語法ではないので選択問題へ移し、
// 残る語法には英検で問われる型を1つずつ付け、参考書の全単元でその結び付きを学べるようにした。
import assert from 'node:assert/strict'
import test from 'node:test'
import { GRAMMAR_PRACTICE } from '../src/data/grammar.js'
import { grammarQuestionType } from '../src/data/grammar-format-expansion.js'
import { GRAMMAR_UNIT_FORMATS } from '../src/data/grammar-unit-formats/index.js'
import { USAGE_KINDS, USAGE_KIND_IDS } from '../src/data/grammar-usage-kinds.js'
import { GRAMMAR_REFERENCE_UNITS, grammarReferenceFor } from '../src/data/grammar-reference/index.js'

const LEVELS = Object.freeze(['5', '4', '3', 'pre2', '2', 'pre1', '1'])
const USAGE = GRAMMAR_PRACTICE.filter((item) => grammarQuestionType(item) === 'usage')
const USAGE_POINT_TITLE = '語と語の決まった結び付き'

test('語法385問すべてが、英検で問われる語法の型と、問う結び付きを持つ', () => {
  assert.equal(USAGE.length, 385)
  assert.equal(USAGE_KIND_IDS.length, 8)
  for (const item of USAGE) {
    assert.ok(USAGE_KINDS[item.usageKind], `${item.id}: 語法の型がない（${item.usageKind}）`)
    assert.match(item.focus ?? '', /[ぁ-んァ-ヶ一-龠]/u, `${item.id}: 問う結び付きが書かれていない`)
  }
  // 8つの型がすべて実際に出題され、どの級でも4つ以上の型が出る。
  const used = new Set(USAGE.map((item) => item.usageKind))
  assert.deepEqual([...used].sort(), [...USAGE_KIND_IDS].sort())
  for (const level of LEVELS) {
    const kinds = new Set(USAGE.filter((item) => item.level === level).map((item) => item.usageKind))
    assert.ok(kinds.size >= 4, `${level}級の語法が${kinds.size}種類しかない`)
  }
})

test('文法の規則だけで決まる問題は語法に置かず、選択問題へ移してある', () => {
  // 移した179問。問題文と解説はそのまま、形式の札だけを正した。
  const moved = GRAMMAR_UNIT_FORMATS.filter((item) => item.id.startsWith('gr_unit_ch_'))
  assert.equal(moved.length, 179)
  for (const item of moved) {
    assert.equal(item.questionType, 'choice', item.id)
    assert.equal(item.usageKind, undefined, `${item.id}: 選択問題に語法の型が残っている`)
  }

  // 取り違えの代表例。もう一度語法に戻っていないことを、単元と狙いで確かめる。
  const grammarOnly = [
    ['5', '代名詞', '前置詞の後ろは目的格'],
    ['5', '冠詞', 'hour は音が母音なので an'],
    ['5', '現在進行形', 'Look! のあとは進行形'],
    ['4', '付加疑問', '付加疑問の主語は代名詞にする'],
    ['4', '感嘆文', '感嘆文の終わりは〈主語＋動詞〉'],
    ['3', '関係代名詞', '先行詞が人なら who'],
    ['3', '仮定法(基礎)', '仮定法の If の中は過去形'],
    ['pre2', '分詞構文', '分詞構文は ing 形で始める'],
    ['2', '倒置', 'Never を前に出すと倒置'],
    ['pre1', '一致', '中心の名詞に合わせる'],
    ['1', '限定詞・数量', 'each of のあとは単数動詞'],
  ]
  for (const [level, topic, focus] of grammarOnly) {
    const item = GRAMMAR_UNIT_FORMATS.find(
      (candidate) => candidate.level === level && candidate.topic === topic && candidate.focus === focus,
    )
    assert.ok(item, `${level}/${topic}「${focus}」の問題が見つからない`)
    assert.equal(item.questionType, 'choice', `${level}/${topic}「${focus}」は文法なので選択問題に置く`)
  }

  // 語法として残したものは、語と語の結び付きを問う（代表例を型つきで確かめる）。
  const realUsage = [
    ['5', '否定文・疑問文', '起きるは get up', 'phrasal'],
    ['5', '名詞の複数形', '液体は a glass of で数える', 'noun'],
    ['4', '前置詞', '到着するは arrive at', 'phrasal'],
    ['4', '動名詞', 'finish のあとは動名詞', 'verbForm'],
    ['3', '受動態', 'おおわれているは be covered with', 'adjPrep'],
    ['pre2', '数量表現', '数えられない名詞には little', 'confusable'],
    ['2', '話法', '人を続けるのは tell', 'confusable'],
    ['pre1', '助動詞', 'いくら〜してもしすぎない', 'setPhrase'],
    ['1', '高度比較', 'superior は than ではなく to', 'adjPrep'],
  ]
  for (const [level, topic, focus, kind] of realUsage) {
    const item = USAGE.find(
      (candidate) => candidate.level === level && candidate.topic === topic && candidate.focus === focus,
    )
    assert.ok(item, `${level}/${topic}「${focus}」の語法問題が見つからない`)
    assert.equal(item.usageKind, kind, `${level}/${topic}「${focus}」の型`)
  }
})

test('語法は参考書の全127単元で学べる（問う結び付きがページ本文と例文にある）', () => {
  assert.equal(GRAMMAR_REFERENCE_UNITS.length, 127)
  for (const unit of GRAMMAR_REFERENCE_UNITS) {
    const point = unit.points.find((candidate) => candidate.title === USAGE_POINT_TITLE)
    assert.ok(point, `${unit.level}/${unit.topic}: 語法を教えるポイントがない`)

    const items = USAGE.filter((item) => item.level === unit.level && item.topic === unit.topic)
    assert.ok(items.length >= 3, `${unit.level}/${unit.topic}: 語法問題が3問未満`)

    // ページ本文がその単元の語法問題の狙いをすべて書いている。
    const body = point.text.join(' ')
    for (const item of items) {
      assert.ok(body.includes(item.focus), `${unit.id}: 本文に「${item.focus}」がない`)
    }
    // 例文がその単元の語法問題の完成文をすべて見せている。
    const examples = new Set(point.examples.map((example) => example.en))
    for (const item of items) {
      assert.ok(examples.has(item.sentence.en), `${unit.id}: 例文に「${item.sentence.en}」がない`)
    }
    assert.equal(point.examples.length, items.length, `${unit.id}: 例文の数が語法問題の数と合わない`)
  }
})

test('語法問題は、その単元の参考書ページと同じ結び付きをテストする', () => {
  for (const item of USAGE) {
    const unit = grammarReferenceFor(item.level, item.topic)
    assert.ok(unit, `${item.id}: 参考書に単元がない`)
    const point = unit.points.find((candidate) => candidate.title === USAGE_POINT_TITLE)
    assert.ok(
      point.examples.some((example) => example.en === item.sentence.en),
      `${item.id}: この問題の文が参考書のページに出てこない`,
    )
  }
})
