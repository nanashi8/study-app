import assert from 'node:assert/strict'
import test from 'node:test'
import { GRAMMAR } from '../src/data/grammar.js'
import {
  GRAMMAR_EXAM_PATTERN_COUNT,
  GRAMMAR_EXAM_PATTERN_FAMILIES,
  GRAMMAR_EXAM_PATTERNS,
  GRAMMAR_EXAM_QUESTION_COUNT,
} from '../src/data/grammar-exam-patterns.js'

const EXPECTED_PATTERNS = [
  'exam:eiken:5_pronoun_form',
  'exam:eiken:5_present_negative',
  'exam:eiken:4_equal_comparison',
  'exam:eiken:4_have_to',
  'exam:eiken:3_verb_complement',
  'exam:eiken:3_perfect_question',
  'exam:eiken:pre2_used_to_contrast',
  'exam:eiken:pre2_difficulty_gerund',
  'exam:common:2_supposed_to',
  'exam:university:2_perfect_passive',
  'exam:university:pre1_mandative',
  'exam:university:pre1_concession_as',
  'exam:university:1_not_until_inversion',
  'exam:university:1_degree_adverb',
  'exam:eiken:5_imperative_1',
  'exam:eiken:5_demonstrative_1',
  'exam:eiken:5_demonstrative_2',
  'exam:eiken:5_imperative_2',
  'exam:eiken:4_pronoun_usage_1',
  'exam:eiken:4_pronoun_usage_2',
  'exam:eiken:3_tag_question_1',
  'exam:eiken:3_tag_question_2',
  'exam:eiken:3_preposition_1',
  'exam:eiken:3_preposition_2',
  'exam:eiken:3_verb_complement_2',
  'exam:eiken:pre2_conjunction_1',
  'exam:eiken:pre2_conjunction_2',
  'exam:eiken:pre2_pronoun_usage_1',
  'exam:eiken:pre2_pronoun_usage_2',
  'exam:eiken:pre2_preposition_1',
  'exam:eiken:pre2_preposition_2',
  'exam:eiken:pre2_used_to_contrast_2',
  'exam:eiken:2_emphasis_1',
  'exam:eiken:2_emphasis_2',
  'exam:eiken:2_past_perfect_progressive_1',
  'exam:eiken:2_past_perfect_progressive_2',
  'exam:eiken:2_comparison_advanced_1',
  'exam:eiken:2_comparison_advanced_2',
  'exam:eiken:2_conjunction_advanced_1',
  'exam:eiken:2_conjunction_advanced_2',
  'exam:eiken:2_modal_obligation_2',
  'exam:university:pre1_noun_clause_1',
  'exam:university:pre1_noun_clause_2',
  'exam:university:pre1_compound_relative_1',
  'exam:university:pre1_compound_relative_2',
]

const countBy = (items, select) =>
  Object.fromEntries(
    [...items.reduce((counts, item) => {
      const key = select(item)
      counts.set(key, (counts.get(key) ?? 0) + 1)
      return counts
    }, new Map())].sort(([a], [b]) => a.localeCompare(b)),
  )

test('入試調査から追加した45出題型を各10問、単元の手薄な級ほど厚めに収録する', () => {
  assert.equal(GRAMMAR_EXAM_PATTERN_COUNT, 45)
  assert.equal(GRAMMAR_EXAM_QUESTION_COUNT, 450)
  assert.equal(GRAMMAR_EXAM_PATTERN_FAMILIES.length, 45)
  assert.ok(GRAMMAR_EXAM_PATTERN_FAMILIES.every((family) => family.length === 10))
  assert.deepEqual(
    GRAMMAR_EXAM_PATTERN_FAMILIES.map((family) => family[0].pattern),
    EXPECTED_PATTERNS,
  )
  assert.deepEqual(
    countBy(GRAMMAR_EXAM_PATTERNS, (item) => item.level),
    { 1: 20, 2: 110, 3: 70, 4: 40, 5: 60, pre1: 60, pre2: 90 },
  )
  assert.deepEqual(
    countBy(GRAMMAR_EXAM_PATTERNS, (item) => item.examSource),
    { common: 10, eiken: 350, university: 90 },
  )
  for (const family of GRAMMAR_EXAM_PATTERN_FAMILIES) {
    const focusCounts = countBy(family, (item) => item.examFocus)
    assert.ok(Object.keys(focusCounts).length >= 4, family[0].pattern)
    assert.ok(Math.max(...Object.values(focusCounts)) <= 3, family[0].pattern)
    assert.ok(new Set(family.map((item) => item.answer)).size >= 4, family[0].pattern)
  }
})

test('入試型問題は独立した英文・和訳・4択・解説を備え、正解で完成文を一意に復元できる', () => {
  const ids = new Set()
  const prompts = new Set()
  const sentences = new Set()
  for (const item of GRAMMAR_EXAM_PATTERNS) {
    assert.match(item.id, /^gr_exam_(eiken|common|university)_[a-z0-9_]+_\d{3}$/)
    assert.ok(!ids.has(item.id), `重複ID: ${item.id}`)
    ids.add(item.id)

    assert.equal((item.q.match(/___/g) ?? []).length, 1, item.id)
    assert.equal(item.choices.length, 4, item.id)
    assert.equal(new Set(item.choices).size, 4, item.id)
    assert.equal(item.choices.filter((choice) => choice === item.answer).length, 1, item.id)
    assert.equal(item.q.replace('___', item.answer), item.sentence.en, item.id)
    assert.ok(item.examFocus?.length >= 4, item.id)
    assert.ok(item.sentence.ja.length >= 8, item.id)
    assert.doesNotMatch(item.sentence.ja, /[A-Za-z]/, item.id)
    assert.ok(item.explain.length >= 20, item.id)

    const prompt = item.q.toLowerCase()
    const sentence = item.sentence.en.toLowerCase()
    assert.ok(!prompts.has(prompt), `重複問題文: ${item.q}`)
    assert.ok(!sentences.has(sentence), `重複完成文: ${item.sentence.en}`)
    prompts.add(prompt)
    sentences.add(sentence)
  }
})

test('既存IDの順序を変えず、入試型450問を文法コーパス末尾へ追加する', () => {
  assert.deepEqual(
    GRAMMAR.slice(-GRAMMAR_EXAM_QUESTION_COUNT).map((item) => item.id),
    GRAMMAR_EXAM_PATTERNS.map((item) => item.id),
  )
  assert.equal(new Set(GRAMMAR.map((item) => item.id)).size, GRAMMAR.length)
  assert.equal(new Set(GRAMMAR.map((item) => item.q.toLowerCase())).size, GRAMMAR.length)
  assert.equal(new Set(GRAMMAR.map((item) => item.sentence.en.toLowerCase())).size, GRAMMAR.length)
})
