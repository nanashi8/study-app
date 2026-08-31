import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  KANBUN_CULTURE,
  KANBUN_CULTURE_CATEGORIES,
  getKanbunCulture,
} from '../src/data/kanbun-culture.js'
import {
  KANBUN_GRAMMAR,
  KANBUN_GRAMMAR_CATEGORIES,
  getKanbunGrammar,
} from '../src/data/kanbun-grammar.js'
import {
  KANBUN_VOCAB,
  KANBUN_VOCAB_CATEGORIES,
  getKanbunVocab,
} from '../src/data/kanbun-vocab.js'
import {
  KANBUN_LEVELS,
} from '../src/data/kanbun-meta.js'
import {
  KANBUN_COLLECTIONS,
  makeKanbunQuestion,
  pickKanbunDistractors,
  pickKanbunQuestions,
} from '../src/data/kanbun-content.js'
import {
  KANBUN_KUNDOKU_EXERCISES,
  KANBUN_KUNDOKU_LEVELS,
  getKanbunKundokuExercise,
  isCorrectKanbunKundokuOrder,
} from '../src/data/kanbun-kundoku.js'
import { CONTENTS } from '../src/data/contents.js'
import { APP_MENU_SCREEN_DESTINATIONS } from '../src/lib/appMenu.js'
import { kanbunDueItems } from '../src/lib/kanbunProgress.js'

const LEVEL_IDS = new Set(KANBUN_LEVELS.map((level) => level.id))

function auditCollection({ collection, prefix, categories, getItem, expected }) {
  const categoryIds = new Set(categories.map((category) => category.id))
  assert.equal(collection.length, expected, `${prefix}: ${collection.length}`)
  assert.equal(new Set(collection.map((item) => item.id)).size, collection.length)
  assert.equal(new Set(collection.map((item) => item.title)).size, collection.length)

  for (const [index, item] of collection.entries()) {
    assert.equal(item.id, `${prefix}${String(index + 1).padStart(3, '0')}`, item.id)
    assert.equal(getItem(item.id), item, item.id)
    assert.ok(categoryIds.has(item.category), item.id)
    assert.ok(LEVEL_IDS.has(item.level), item.id)
    for (const key of ['title', 'answer', 'detail', 'clue', 'pitfall', 'front']) {
      assert.ok(item[key]?.trim(), `${item.id}:${key}`)
    }
  }

  for (const category of categories) {
    assert.ok(collection.some((item) => item.category === category.id), category.id)
  }
  for (const level of KANBUN_LEVELS) {
    assert.ok(collection.some((item) => item.level === level.id), `${prefix}:${level.id}`)
  }
}

test('漢文の三主分野は中学〜最難関大を細かな暗記項目で全件網羅する', () => {
  auditCollection({
    collection: KANBUN_VOCAB,
    prefix: 'kv',
    categories: KANBUN_VOCAB_CATEGORIES,
    getItem: getKanbunVocab,
    expected: 120,
  })
  auditCollection({
    collection: KANBUN_GRAMMAR,
    prefix: 'kgw',
    categories: KANBUN_GRAMMAR_CATEGORIES,
    getItem: getKanbunGrammar,
    expected: 87,
  })
  auditCollection({
    collection: KANBUN_CULTURE,
    prefix: 'kcw',
    categories: KANBUN_CULTURE_CATEGORIES,
    getItem: getKanbunCulture,
    expected: 95,
  })
})

test('漢語・漢文法・漢文常識の全項目から一意な4択と項目固有解説を作れる', () => {
  for (const [domain, collection] of Object.entries(KANBUN_COLLECTIONS)) {
    for (const item of collection) {
      const distractors = pickKanbunDistractors(domain, item, 3, () => 0.42)
      assert.equal(distractors.length, 3, `${domain}:${item.id}`)
      assert.equal(new Set(distractors.map((candidate) => candidate.answer)).size, 3, item.id)
      assert.ok(distractors.every((candidate) => candidate.id !== item.id), item.id)

      const question = makeKanbunQuestion(domain, item, () => 0.42)
      assert.equal(question.choices.length, 3, question.id)
      assert.equal(new Set(question.choices.map((choice) => choice.id)).size, 3, question.id)
      assert.ok(question.choices.some((choice) => choice.id === question.answerId), question.id)
      assert.ok(question.clue && question.detail && question.pitfall, question.id)
    }

    const picked = pickKanbunQuestions(domain, collection.map((item) => item.id), {
      size: 12,
      rng: () => 0.37,
    })
    assert.equal(picked.length, 12, domain)
    assert.equal(new Set(picked.map((item) => item.itemId)).size, 12, domain)
  }
})

test('返り点ドリルはレ点・一二点・上下点・甲乙点・天地人点を実順序で扱う', () => {
  assert.equal(KANBUN_KUNDOKU_EXERCISES.length, 40)
  assert.deepEqual(
    new Set(KANBUN_KUNDOKU_EXERCISES.map((item) => item.level)),
    new Set(KANBUN_KUNDOKU_LEVELS.map((level) => level.id)),
  )
  assert.ok(KANBUN_KUNDOKU_EXERCISES.some((item) => item.marked.includes('レ')))
  assert.ok(KANBUN_KUNDOKU_EXERCISES.some((item) => /[一二]/.test(item.marked)))
  assert.ok(KANBUN_KUNDOKU_EXERCISES.some((item) => /[上下]/.test(item.marked)))
  assert.ok(KANBUN_KUNDOKU_EXERCISES.some((item) => /[甲乙]/.test(item.marked)))
  assert.ok(KANBUN_KUNDOKU_EXERCISES.some((item) => /[天地]/.test(item.marked)))

  for (const exercise of KANBUN_KUNDOKU_EXERCISES) {
    assert.equal(getKanbunKundokuExercise(exercise.id), exercise)
    assert.equal(new Set(exercise.tokens.map((token) => token.id)).size, exercise.tokens.length)
    assert.equal(exercise.order.length, exercise.tokens.length, exercise.id)
    assert.deepEqual(
      new Set(exercise.order),
      new Set(exercise.tokens.map((token) => token.id)),
      exercise.id,
    )
    assert.equal(isCorrectKanbunKundokuOrder(exercise, exercise.order), true, exercise.id)
    assert.equal(
      isCorrectKanbunKundokuOrder(exercise, [...exercise.order].reverse()),
      exercise.order.length === 1,
      exercise.id,
    )
    assert.ok(exercise.kakikudashi && exercise.translation, exercise.id)
    assert.ok(exercise.clue && exercise.pitfall, exercise.id)
  }
})

test('トップメニューは古典と漢文を別アプリとして公開し、漢文の暗記・テスト画面を接続する', () => {
  const koten = CONTENTS.find((content) => content.id === 'koten-quest')
  const kanbun = CONTENTS.find((content) => content.id === 'kanbun-quest')
  assert.equal(koten?.screen, 'kotenList')
  assert.equal(kanbun?.screen, 'kanbunHome')
  assert.notEqual(koten.screen, kanbun.screen)
  assert.ok(APP_MENU_SCREEN_DESTINATIONS.includes('kotenList'))
  assert.ok(APP_MENU_SCREEN_DESTINATIONS.includes('kanbunHome'))
  assert.ok(APP_MENU_SCREEN_DESTINATIONS.includes('kanbunSaved'))

  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
  const portal = readFileSync(new URL('../src/screens/Portal.jsx', import.meta.url), 'utf8')
  const home = readFileSync(new URL('../src/screens/KanbunHome.jsx', import.meta.url), 'utf8')
  const catalog = readFileSync(new URL('../src/screens/KanbunCatalog.jsx', import.meta.url), 'utf8')
  const study = readFileSync(new URL('../src/screens/KanbunStudy.jsx', import.meta.url), 'utf8')
  const quiz = readFileSync(new URL('../src/screens/KanbunQuiz.jsx', import.meta.url), 'utf8')
  const kundoku = readFileSync(new URL('../src/screens/KanbunKundokuQuiz.jsx', import.meta.url), 'utf8')

  for (const screen of [
    'kanbunHome',
    'kanbunCatalog',
    'kanbunStudy',
    'kanbunQuiz',
    'kanbunKundoku',
    'kanbunKundokuQuiz',
    'kanbunSaved',
  ]) {
    assert.match(app, new RegExp(`${screen}:`), screen)
  }
  for (const label of ['漢語', '漢文法', '漢文常識', '返り点・訓読']) {
    assert.match(home, new RegExp(label), label)
  }
  assert.match(catalog, /暗記/)
  assert.match(catalog, /テスト/)
  assert.match(study, /覚えた/)
  assert.match(study, /まだ/)
  assert.match(quiz, /わからない/)
  assert.match(quiz, /選択肢/)
  assert.match(kundoku, /読む順/)
  assert.match(kundoku, /書き下し文/)
  assert.match(portal, /scrollArea\.scrollTop = 0/)
})

test('復習待ちは未着手の全項目を数えず、学習履歴のある期限到来項目だけを返す', () => {
  const sample = KANBUN_GRAMMAR.slice(0, 3)
  assert.deepEqual(kanbunDueItems(sample, {}), [])
  assert.deepEqual(
    kanbunDueItems(sample, {
      [sample[0].id]: { due: -1 },
      [sample[1].id]: { due: Number.MAX_SAFE_INTEGER },
    }).map((item) => item.id),
    [sample[0].id],
  )
})
