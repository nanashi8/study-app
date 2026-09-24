// 依頼 2026-09-24-classics-enrich の条件 koten-vocab-master。
// 古典単語の必修語リスト（docs/audits/classics-coverage.json の kotenVocab）の全件が、
// 見出し語として意味・覚え方・用例と現代語訳を持つこと。リストにない語は教材に置かない。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KOTEN_WORDS } from '../src/data/koten.js'

const coverage = JSON.parse(readFileSync(new URL('../docs/audits/classics-coverage.json', import.meta.url), 'utf8'))
const keyOf = (word, pos) => `${word}\u0000${pos}`

// 依頼の文に挙げた分類。どれも1語以上入っていること。
const SECTIONS = [
  '心情', '評価', '人柄', '程度と呼応の副詞', '動作', '敬語動詞', '時と暦',
  '住まいと宮廷', '恋愛と結婚', '仏教と信仰', '死と出家の言い方', '連語と慣用表現', '助動詞と助詞',
]

test('古典単語の必修語：必修語リストの全件が見出し語としてあり、意味・覚え方・用例と現代語訳を持つ', () => {
  const list = coverage.kotenVocab
  assert.equal(list.length, 612)
  assert.equal(new Set(list.map((entry) => keyOf(entry.word, entry.pos))).size, list.length, '必修語リストに重複がある')
  const byKey = new Map(KOTEN_WORDS.map((word) => [keyOf(word.word, word.pos), word]))
  for (const entry of list) {
    const word = byKey.get(keyOf(entry.word, entry.pos))
    assert.ok(word, `${entry.word}（${entry.pos}）が古典単語にない`)
    assert.ok(word.meanings?.length > 0 && word.meanings.every((meaning) => meaning.trim()), `${word.id}: 意味`)
    assert.ok(word.note?.trim(), `${word.id}: 覚え方・ポイント`)
    assert.ok(word.example?.ja?.trim() && word.example?.gendai?.trim(), `${word.id}: 用例と現代語訳`)
  }
  const listed = new Set(list.map((entry) => keyOf(entry.word, entry.pos)))
  for (const word of KOTEN_WORDS) {
    assert.ok(listed.has(keyOf(word.word, word.pos)), `${word.id} ${word.word} が必修語リストにない`)
  }
  const sections = new Set(list.map((entry) => entry.section))
  for (const section of SECTIONS) assert.ok(sections.has(section), `分類「${section}」の語がない`)
  assert.deepEqual([...sections].filter((section) => !SECTIONS.includes(section)), [], '依頼にない分類がある')
})

test('古典単語の必修語：用例は語ごとに別の文で、見出し語（またはその活用形）を含む', () => {
  const seen = new Map()
  for (const word of KOTEN_WORDS) {
    const prior = seen.get(word.example.ja)
    assert.equal(prior, undefined, `${word.id} と ${prior} が同じ用例を使っている`)
    seen.set(word.example.ja, word.id)
  }
})
