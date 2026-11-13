// 文法の単元の問題の数がそろっていること（依頼台帳 requests/2026-11-13-grammar-small-units.json）。
// 2026-11-13 まで、前置詞の4級・2級・準1級の3単元だけが6問（選択0問）で、ほかの124単元はどれも24問以上あった。
// 実力診断で受け直すと3回で問題を使い切っていたので、全127単元がほかの単元のいちばん少ない数を下回らないことを守る。
import test from 'node:test'
import assert from 'node:assert/strict'
import { GRAMMAR_STRANDS } from '../src/data/grammar-strands.js'
import { grammarPracticeByTopic } from '../src/data/grammar.js'
import { grammarQuestionType } from '../src/data/grammar-format-expansion.js'
import { GRAMMAR_UNIT_FORMATS } from '../src/data/grammar-unit-formats/index.js'
import { grammarVariationKey } from '../src/lib/grammarDeck.js'

const MIN_QUESTIONS = 24
const MIN_CHOICE = 18
const MIN_PATTERNS = 10

test('全127単元が24問以上・選択問題18問以上・型10以上を持つ', () => {
  const units = GRAMMAR_STRANDS.flatMap((strand) => strand.topics)
  assert.equal(units.length, 127)
  const short = []
  for (const [level, topic] of units) {
    const items = grammarPracticeByTopic(level, topic)
    const choice = items.filter((item) => grammarQuestionType(item) === 'choice').length
    const patterns = new Set(items.map(grammarVariationKey)).size
    if (items.length < MIN_QUESTIONS || choice < MIN_CHOICE || patterns < MIN_PATTERNS) {
      short.push(`${level}/${topic}: ${items.length}問・選択${choice}問・型${patterns}`)
    }
  }
  assert.deepEqual(short, [])
})

test('前置詞の4級・2級・準1級は、各24問（選択18・並び替え3・語法3）で、足した選択問題の狙いは重ならない', () => {
  for (const level of ['4', '2', 'pre1']) {
    const items = grammarPracticeByTopic(level, '前置詞')
    const types = {}
    for (const item of items) types[grammarQuestionType(item)] = (types[grammarQuestionType(item)] ?? 0) + 1
    assert.deepEqual(types, { choice: 18, 'word-order': 3, usage: 3 }, level)
    const added = GRAMMAR_UNIT_FORMATS.filter((item) => item.unitId === `gref_${level}_prep` && item.questionType === 'choice')
    assert.equal(added.length, 18, level)
    assert.equal(new Set(added.map((item) => item.focus)).size, 18, `${level} の狙いが重なる`)
    for (const item of added) {
      assert.equal(item.q.split('___').length, 2, item.id)
      assert.equal(item.choices.length, 4, item.id)
      assert.ok(item.choices.includes(item.answer), item.id)
      assert.ok(item.explain.includes(item.answer), `${item.id}: 解説に正解 ${item.answer} がない`)
      assert.deepEqual(Object.keys(item.choiceNotes), item.choices, `${item.id}: 選択肢の説明が4つそろわない`)
      assert.ok(Object.values(item.choiceNotes).every((note) => /[ぁ-ん]/u.test(note)), item.id)
      assert.equal(item.sentence.en, item.q.replace('___', item.answer))
    }
  }
})
