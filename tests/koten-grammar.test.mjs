import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getKotenGrammar,
  KOTEN_GRAMMAR,
  KOTEN_GRAMMAR_CATEGORIES,
} from '../src/data/koten-grammar.js'
import {
  getKotenGrammarQuestion,
  KOTEN_GRAMMAR_CONTEXT_QUESTIONS,
  KOTEN_GRAMMAR_FOUNDATION_QUESTIONS,
  KOTEN_GRAMMAR_LEVELS,
  KOTEN_GRAMMAR_QUESTIONS,
  KOTEN_GRAMMAR_QUESTION_FORMATS,
  pickKotenGrammarQuestions,
} from '../src/data/koten-grammar-questions.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'

const LEGACY_GRAMMAR_COUNT = 29
const categoryIds = new Set(KOTEN_GRAMMAR_CATEGORIES.map((item) => item.id))

test('古典文法は既存29idを保ったまま74項目・6分野へ拡充されている', () => {
  assert.equal(KOTEN_GRAMMAR.length, 74)
  assert.equal(KOTEN_GRAMMAR_CATEGORIES.length, 6)
  assert.equal(new Set(KOTEN_GRAMMAR.map((item) => item.id)).size, KOTEN_GRAMMAR.length)

  const legacyBoundary = {
    0: 'kg_neg_zu',
    18: 'kg_causative_sasu',
    19: 'kg_conj_ba',
    25: 'kg_conj_te',
    26: 'kg_adjective',
    27: 'kg_adjectival_nari',
    28: 'kg_honorific_direction',
  }
  for (const [index, id] of Object.entries(legacyBoundary)) {
    assert.equal(KOTEN_GRAMMAR[Number(index)].id, id)
  }
  assert.equal(KOTEN_GRAMMAR[LEGACY_GRAMMAR_COUNT].id, 'kg_conjecture_muzu')

  for (const item of KOTEN_GRAMMAR) {
    assert.ok(item.id?.startsWith('kg_'), item.id)
    assert.ok(categoryIds.has(item.category), item.id)
    assert.ok(item.title && item.forms && item.connection, item.id)
    assert.ok(item.meaning && item.summary, item.id)
    assert.ok(item.example?.ja && item.example?.gendai, item.id)
    assert.equal(getKotenGrammar(item.id), item)
  }
  for (const category of KOTEN_GRAMMAR_CATEGORIES) {
    assert.ok(KOTEN_GRAMMAR.some((item) => item.category === category.id), category.id)
  }
})

test('古典文法136問は4択・参照・解説が全件整合する', () => {
  assert.equal(KOTEN_GRAMMAR_CONTEXT_QUESTIONS.length, 62)
  assert.equal(KOTEN_GRAMMAR_FOUNDATION_QUESTIONS.length, KOTEN_GRAMMAR.length)
  assert.equal(KOTEN_GRAMMAR_QUESTIONS.length, 136)
  assert.equal(
    new Set(KOTEN_GRAMMAR_QUESTIONS.map((item) => item.id)).size,
    KOTEN_GRAMMAR_QUESTIONS.length,
  )

  for (const item of KOTEN_GRAMMAR_QUESTIONS) {
    assert.equal(getKotenGrammarQuestion(item.id), item, item.id)
    assert.ok(Object.hasOwn(KOTEN_GRAMMAR_LEVELS, item.level), item.id)
    assert.ok(Object.hasOwn(KOTEN_GRAMMAR_QUESTION_FORMATS, item.format), item.id)
    assert.ok(['context', 'foundation'].includes(item.style), item.id)
    assert.ok(item.source && item.passage && item.target && item.question, item.id)
    assert.ok(item.explanation, item.id)
    assert.equal(item.choices.length, 4, item.id)
    assert.equal(new Set(item.choices).size, 4, item.id)
    assert.ok(item.choices.includes(item.answer), item.id)
    assert.ok(item.grammarIds.length > 0, item.id)
    assert.ok(item.grammarIds.every(getKotenGrammar), item.id)
    assert.equal(getKotenGrammar(item.grammarIds[0]).category, item.category, item.id)
  }
})

test('全74文法に基礎問題があり、全6分野に文脈型問題がある', () => {
  assert.deepEqual(
    new Set(KOTEN_GRAMMAR_FOUNDATION_QUESTIONS.flatMap((item) => item.grammarIds)),
    new Set(KOTEN_GRAMMAR.map((item) => item.id)),
  )
  assert.deepEqual(
    new Set(KOTEN_GRAMMAR_CONTEXT_QUESTIONS.map((item) => item.category)),
    categoryIds,
  )
})

test('腕試しは重複なし12問で文脈型と基礎型を混ぜる', () => {
  const picked = pickKotenGrammarQuestions(
    KOTEN_GRAMMAR.map((item) => item.id),
    { size: 12, rng: () => 0.42 },
  )
  assert.equal(picked.length, 12)
  assert.equal(new Set(picked.map((item) => item.id)).size, 12)
  assert.equal(picked.filter((item) => item.style === 'context').length, 8)
  assert.equal(picked.filter((item) => item.style === 'foundation').length, 4)
})

test('古典文法SRSは進捗コードで往復し、旧コードでは省略できる', () => {
  const srs = {
    kg_neg_zu: {
      box: 3,
      correct: 4,
      wrong: 1,
      due: 20000,
      last: 19998,
    },
  }
  const restored = decodeProgress(encodeProgress({
    srs: {},
    kotenSrs: {},
    kotenGrammarSrs: srs,
    kotenInterpretationSrs: {},
    myList: [],
    myGrammarList: [],
    writingProgress: {},
    kotenWordList: [],
    kotenGrammarList: ['kg_neg_zu'],
    readingsDone: [],
    mathDone: [],
    mathMastery: {},
    skillStats: {},
    learningAnalytics: {},
    diagnosticHistory: [],
    diagnosticAttempt: 0,
    diagnosticSeed: null,
    engPos: null,
    portalOrder: [],
    portalHidden: [],
    stats: {},
    settings: {},
  }))
  assert.deepEqual(restored.kotenGrammarSrs, srs)
  assert.deepEqual(restored.kotenGrammarList, ['kg_neg_zu'])

  const legacy = decodeProgress(encodeProgress({
    srs: {},
    kotenSrs: {},
    kotenInterpretationSrs: {},
  }))
  assert.equal(legacy.kotenGrammarSrs, undefined)
})
