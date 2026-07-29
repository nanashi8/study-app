import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getKotenCulture,
  getKotenCultureQuestion,
  KOTEN_CULTURE,
  KOTEN_CULTURE_CATEGORIES,
  KOTEN_CULTURE_CONTEXT_QUESTIONS,
  KOTEN_CULTURE_FOUNDATION_QUESTIONS,
  KOTEN_CULTURE_LEVELS,
  KOTEN_CULTURE_QUESTIONS,
  KOTEN_CULTURE_QUESTION_FORMATS,
  pickKotenCultureQuestions,
} from '../src/data/koten-culture.js'
import { getKotenInterpretation } from '../src/data/koten-interpretations.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'

const categoryIds = new Set(KOTEN_CULTURE_CATEGORIES.map((item) => item.id))

test('古典常識は56テーマ・7分野で、暗記と本文読解に必要な情報を備える', () => {
  assert.equal(KOTEN_CULTURE.length, 56)
  assert.equal(KOTEN_CULTURE_CATEGORIES.length, 7)
  assert.equal(new Set(KOTEN_CULTURE.map((item) => item.id)).size, KOTEN_CULTURE.length)

  for (const item of KOTEN_CULTURE) {
    assert.match(item.id, /^kc\d{3}$/)
    assert.ok(categoryIds.has(item.category), item.id)
    assert.ok(Object.hasOwn(KOTEN_CULTURE_LEVELS, item.level), item.id)
    assert.ok(item.title && item.keyword && item.prompt && item.core, item.id)
    assert.ok(item.detail && item.examTip, item.id)
    assert.ok(item.scene?.text && item.scene?.note, item.id)
    assert.equal(getKotenCulture(item.id), item)
    assert.ok(Array.isArray(item.relatedInterpretationIds), item.id)
    assert.ok(item.relatedInterpretationIds.every(getKotenInterpretation), item.id)
  }

  for (const category of KOTEN_CULTURE_CATEGORIES) {
    assert.equal(
      KOTEN_CULTURE.filter((item) => item.category === category.id).length,
      8,
      category.id,
    )
  }
})

test('古典常識112問は全テーマに基礎・文脈各1問があり、4択と参照が整合する', () => {
  assert.equal(KOTEN_CULTURE_CONTEXT_QUESTIONS.length, KOTEN_CULTURE.length)
  assert.equal(KOTEN_CULTURE_FOUNDATION_QUESTIONS.length, KOTEN_CULTURE.length)
  assert.equal(KOTEN_CULTURE_QUESTIONS.length, 112)
  assert.equal(
    new Set(KOTEN_CULTURE_QUESTIONS.map((item) => item.id)).size,
    KOTEN_CULTURE_QUESTIONS.length,
  )

  for (const item of KOTEN_CULTURE_QUESTIONS) {
    assert.equal(getKotenCultureQuestion(item.id), item, item.id)
    assert.ok(Object.hasOwn(KOTEN_CULTURE_LEVELS, item.level), item.id)
    assert.ok(Object.hasOwn(KOTEN_CULTURE_QUESTION_FORMATS, item.format), item.id)
    assert.ok(['context', 'foundation'].includes(item.style), item.id)
    assert.ok(item.source && item.passage && item.target && item.question, item.id)
    assert.ok(item.explanation, item.id)
    assert.equal(item.choices.length, 4, item.id)
    assert.equal(new Set(item.choices).size, 4, item.id)
    assert.ok(item.choices.includes(item.answer), item.id)
    assert.ok(item.cultureIds.length > 0, item.id)
    assert.ok(item.cultureIds.every(getKotenCulture), item.id)
    assert.equal(getKotenCulture(item.cultureIds[0]).category, item.category, item.id)
  }

  assert.deepEqual(
    new Set(KOTEN_CULTURE_FOUNDATION_QUESTIONS.flatMap((item) => item.cultureIds)),
    new Set(KOTEN_CULTURE.map((item) => item.id)),
  )
  assert.deepEqual(
    new Set(KOTEN_CULTURE_CONTEXT_QUESTIONS.flatMap((item) => item.cultureIds)),
    new Set(KOTEN_CULTURE.map((item) => item.id)),
  )
})

test('古典常識の腕試しは重複なし12問で文脈型8・基礎型4を混ぜる', () => {
  const picked = pickKotenCultureQuestions(
    KOTEN_CULTURE.map((item) => item.id),
    { size: 12, rng: () => 0.37 },
  )
  assert.equal(picked.length, 12)
  assert.equal(new Set(picked.map((item) => item.id)).size, 12)
  assert.equal(picked.filter((item) => item.style === 'context').length, 8)
  assert.equal(picked.filter((item) => item.style === 'foundation').length, 4)
})

test('古典常識SRSと登録リストは進捗コードで往復し、旧コードでは省略できる', () => {
  const srs = {
    kc001: {
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
    kotenGrammarSrs: {},
    kotenCultureSrs: srs,
    kotenInterpretationSrs: {},
    myList: [],
    myGrammarList: [],
    writingProgress: {},
    kotenWordList: [],
    kotenGrammarList: [],
    kotenCultureList: ['kc001'],
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
  assert.deepEqual(restored.kotenCultureSrs, srs)
  assert.deepEqual(restored.kotenCultureList, ['kc001'])

  const legacy = decodeProgress(encodeProgress({
    srs: {},
    kotenSrs: {},
    kotenGrammarSrs: {},
    kotenInterpretationSrs: {},
  }))
  assert.equal(legacy.kotenCultureSrs, undefined)
  assert.equal(legacy.kotenCultureList, undefined)
})
