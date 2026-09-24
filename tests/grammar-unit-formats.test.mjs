// 単元別の並び替え・語法問題。参考書の全127単元に、どちらの形式も3問以上あることを全件で守る。
//
// 2026-09-24 までは、並び替え・語法は級ごとに5問ずつ（計35問ずつ）しかなく、
// 形式を絞ったテストは1回分（20問）にも届かなかった。ここはその再発を止める。
import assert from 'node:assert/strict'
import test from 'node:test'
import { GRAMMAR_PRACTICE, GRAMMAR_TOPIC_MINIMUM } from '../src/data/grammar.js'
import { grammarQuestionType } from '../src/data/grammar-format-expansion.js'
import {
  GRAMMAR_UNIT_FORMATS,
  UNIT_FORMAT_MINIMUM,
} from '../src/data/grammar-unit-formats/index.js'
import { GRAMMAR_REFERENCE_UNITS, grammarReferenceById } from '../src/data/grammar-reference/index.js'
import { buildGrammarDeck } from '../src/lib/grammarDeck.js'
import { auditGrammarUnitFormats } from '../scripts/check-grammar-unit-formats.mjs'

const LEVELS = Object.freeze(['5', '4', '3', 'pre2', '2', 'pre1', '1'])
const SESSION_QUESTIONS = 20

test('参考書の全127単元が、並び替えも語法も3問以上持つ', () => {
  const audit = auditGrammarUnitFormats()
  assert.deepEqual(audit.issues, [])
  assert.equal(audit.unitCount, 127)
  assert.equal(audit.minimum, GRAMMAR_TOPIC_MINIMUM)
  assert.equal(UNIT_FORMAT_MINIMUM, GRAMMAR_TOPIC_MINIMUM)

  // 母集団は「級ごとの単元数」ではなく、参考書の全単元。
  assert.deepEqual(
    Object.fromEntries(LEVELS.map((level) => [
      level,
      GRAMMAR_REFERENCE_UNITS.filter((unit) => unit.level === level).length,
    ])),
    { 5: 12, 4: 15, 3: 16, pre2: 26, 2: 26, pre1: 20, 1: 12 },
  )
  for (const unit of audit.unitCounts) {
    assert.ok(unit['word-order'] >= 3, `${unit.level}/${unit.topic} の並び替えが3問未満`)
    assert.ok(unit.usage >= 3, `${unit.level}/${unit.topic} の語法が3問未満`)
  }
})

test('追加した875問は、単元の学習内容と結び付き、狙いが単元の中で重ならない', () => {
  assert.equal(GRAMMAR_UNIT_FORMATS.length, 875)
  assert.deepEqual(
    Object.fromEntries(['word-order', 'usage', 'choice'].map((type) => [
      type,
      GRAMMAR_UNIT_FORMATS.filter((item) => item.questionType === type).length,
    ])),
    { 'word-order': 346, usage: 350, choice: 179 },
  )

  const focuses = new Map()
  for (const item of GRAMMAR_UNIT_FORMATS) {
    const unit = grammarReferenceById(item.unitId)
    assert.ok(unit, `${item.id}: 参考書にない単元 ${item.unitId}`)
    assert.equal(unit.level, item.level, item.id)
    assert.equal(unit.topic, item.topic, item.id)
    assert.match(item.focus, /[ぁ-んァ-ヶ一-龠]/u, `${item.id}: 狙いが書かれていない`)
    const key = `${item.unitId}\u0000${item.questionType}`
    const seen = focuses.get(key) ?? new Set()
    assert.ok(!seen.has(item.focus), `${item.id}: 同じ単元・形式で狙いが重なる（${item.focus}）`)
    seen.add(item.focus)
    focuses.set(key, seen)
  }
})

test('どの級でも、並び替えだけ・語法だけのテストが1回分そろう', () => {
  for (const level of LEVELS) {
    for (const type of ['word-order', 'usage']) {
      const stock = GRAMMAR_PRACTICE.filter(
        (item) => item.level === level && grammarQuestionType(item) === type,
      )
      assert.ok(
        stock.length >= SESSION_QUESTIONS,
        `${level}級の${type}が1回分（${SESSION_QUESTIONS}問）に足りない: ${stock.length}問`,
      )
      const deck = buildGrammarDeck(
        { type: 'grammar', level, questionType: type },
        { size: SESSION_QUESTIONS, day: 0 },
      )
      assert.equal(deck.length, SESSION_QUESTIONS, `${level}級の${type}のテストが20問そろわない`)
      assert.ok(deck.every((item) => grammarQuestionType(item) === type), `${level}級の${type}に別形式が混ざる`)
    }
  }
})

test('単元のテストも、形式を絞って3問ずつ出せる', () => {
  for (const unit of GRAMMAR_REFERENCE_UNITS) {
    for (const type of ['word-order', 'usage']) {
      const deck = buildGrammarDeck(
        { type: 'grammar', level: unit.level, topic: unit.topic, questionType: type },
        { size: UNIT_FORMAT_MINIMUM, day: 0 },
      )
      assert.equal(deck.length, UNIT_FORMAT_MINIMUM, `${unit.level}/${unit.topic} の${type}が3問出せない`)
      assert.ok(deck.every((item) => item.topic === unit.topic), `${unit.level}/${unit.topic} に別単元が混ざる`)
    }
  }
})

test('語法問題は4つの選択肢すべてに、この問題に当てはめた説明を持つ', () => {
  const usage = GRAMMAR_UNIT_FORMATS.filter((item) => item.questionType === 'usage')
  let noteCount = 0
  for (const item of usage) {
    assert.equal(item.choices.length, 4, item.id)
    assert.equal(Object.keys(item.choiceNotes).length, 4, item.id)
    for (const choice of item.choices) {
      assert.match(item.choiceNotes[choice], /[ぁ-んァ-ヶ一-龠]/u, `${item.id}: ${choice}`)
      noteCount += 1
    }
  }
  assert.equal(usage.length, 350)
  assert.equal(noteCount, 1_400)
})
