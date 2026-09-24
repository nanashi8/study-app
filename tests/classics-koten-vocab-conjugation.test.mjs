// 依頼 2026-09-24-classics-enrich の条件 koten-vocab-conjugation。
// 活用する古典単語（動詞・形容詞・形容動詞・助動詞）の全件が、活用の種類（動詞は行も）と
// 6活用形の活用表を持ち、終止形が見出し語と一致すること。活用しない語は表を持たない。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KOTEN_WORDS } from '../src/data/koten.js'
import {
  AUXILIARY_TABLES,
  conjugationSpecs,
  conjugationTablesFor,
  dictionaryFormOf,
} from '../src/lib/kotenConjugation.js'

const CONJUGATING = new Set(['動', '形', '形動', '助動'])
const headwords = (word) => word.word.replace(/（[^）]*）/gu, '').split('・')

test('古典単語の活用表：活用する語の全件が活用の種類と6活用形を持ち、終止形が見出し語と一致する', () => {
  let conjugating = 0
  for (const word of KOTEN_WORDS) {
    const specs = conjugationSpecs(word.conj)
    const tables = conjugationTablesFor(word)
    if (!CONJUGATING.has(word.pos)) {
      assert.equal(specs.length, 0, `${word.id} ${word.word}: 活用しない語に活用の種類がある`)
      continue
    }
    conjugating += 1
    assert.ok(specs.length > 0, `${word.id} ${word.word}: 活用の種類がない`)
    assert.equal(tables.length, specs.length, `${word.id} ${word.word}: 見出し語と活用の種類が合わず表が作れない`)
    for (const table of tables) {
      assert.equal(table.forms.length, 6, `${word.id}: 活用形が6つない`)
      assert.ok(table.forms[2].length > 0, `${word.id}: 終止形がない`)
      if (table.kind === '助動詞') {
        assert.ok(headwords(word).includes(table.name.replace(/（[^）]*）$/u, '')), `${word.id}: 助動詞の表が見出し語と合わない（${table.name}）`)
      } else {
        assert.ok(headwords(word).includes(dictionaryFormOf(table)), `${word.id} ${word.word}: 終止形 ${dictionaryFormOf(table)} が見出し語と合わない`)
      }
      if (table.kind === '動詞') {
        assert.match(table.label, /[アカガサザタダナハバマヤラワ]行|変格活用/u, `${word.id}: 動詞の行が表に出ていない`)
      }
    }
  }
  assert.equal(conjugating, 371, '活用する語の数（着手時219語＋追加152語）')
})

test('古典単語の活用表：活用の種類が2つある語は、両方の表と意味の違いを持つ', () => {
  const doubles = KOTEN_WORDS.filter((word) => conjugationSpecs(word.conj).length > 1 && word.pos === '動')
  for (const head of ['たのむ', 'たまふ', 'かづく', 'たがふ', 'なぐさむ', 'しのぶ']) {
    assert.ok(doubles.some((word) => word.word === head), `${head} に2つの活用の種類がない`)
  }
  for (const word of doubles) {
    for (const spec of conjugationSpecs(word.conj)) {
      assert.ok(spec.gloss?.trim(), `${word.id} ${word.word}: ${spec.type} の意味の違いが書かれていない`)
    }
  }
})

test('古典単語の活用表：助動詞の活用表は28語すべてを持つ', () => {
  const names = Object.keys(AUXILIARY_TABLES).map((name) => name.replace(/（[^）]*）$/u, ''))
  for (const name of ['る', 'らる', 'す', 'さす', 'しむ', 'ず', 'じ', 'む', 'むず', 'まし', 'まほし', 'たし', 'き', 'けり', 'つ', 'ぬ', 'たり', 'り', 'けむ', 'らむ', 'らし', 'めり', 'なり', 'べし', 'まじ', 'ごとし']) {
    assert.ok(names.includes(name), `助動詞「${name}」の活用表がない`)
  }
  assert.equal(Object.keys(AUXILIARY_TABLES).length, 28)
})

test('古典単語の活用表：暗記カードの裏・辞書ページ・テストの答え合わせが活用表を出す', () => {
  for (const file of ['src/screens/KotenStudy.jsx', 'src/screens/KotenWordDetail.jsx', 'src/screens/KotenQuiz.jsx']) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    assert.match(source, /<KotenWordConjugation word=\{word\}/, `${file}: 活用表を出していない`)
  }
})
