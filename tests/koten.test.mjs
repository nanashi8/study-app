import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  KOTEN_BY_ID,
  KOTEN_CATEGORIES,
  KOTEN_TOC,
  KOTEN_WORDS,
  getKoten,
  pickKotenDistractors,
} from '../src/data/koten.js'
import {
  KOTEN_FURIGANA_ENTRIES,
  kotenTextForSearch,
  tokenizeKotenText,
} from '../src/lib/kotenFurigana.js'

const BASE_WORD_COUNT = 126
const categoryIds = new Set(KOTEN_CATEGORIES.map((category) => category.id))

test('古典単語300語は連番idと学習に必要な項目を持つ', () => {
  assert.equal(KOTEN_WORDS.length, 300)
  assert.equal(new Set(KOTEN_WORDS.map((word) => word.id)).size, KOTEN_WORDS.length)
  assert.equal(new Set(KOTEN_WORDS.map((word) => `${word.word}\u0000${word.pos}`)).size, KOTEN_WORDS.length)

  for (const [index, word] of KOTEN_WORDS.entries()) {
    const at = word.id || `index:${index}`
    assert.equal(word.id, `k${String(index + 1).padStart(3, '0')}`, at)
    assert.ok(word.word?.trim(), `${at}: word`)
    assert.ok(word.kana?.trim(), `${at}: kana`)
    assert.ok(word.pos?.trim(), `${at}: pos`)
    assert.ok(categoryIds.has(word.category), `${at}: category`)
    assert.ok(Array.isArray(word.meanings) && word.meanings.length > 0, `${at}: meanings`)
    assert.equal(word.meaning, word.meanings[0], `${at}: primary meaning`)
    assert.ok(word.note?.trim(), `${at}: note`)
    assert.equal(KOTEN_BY_ID[word.id], word, `${at}: KOTEN_BY_ID`)
    assert.equal(getKoten(word.id), word, `${at}: getKoten`)

    if (word.example) {
      assert.ok(word.example.ja?.trim(), `${at}: example.ja`)
      assert.ok(word.example.gendai?.trim(), `${at}: example.gendai`)
    }
    if (index >= BASE_WORD_COUNT) {
      assert.ok(word.example?.ja?.trim(), `${at}: expansion example.ja`)
      assert.ok(word.example?.gendai?.trim(), `${at}: expansion example.gendai`)
    }
  }
})

test('既存200語の章境界idは拡充後も変わらない', () => {
  const expected = {
    k001: 'あはれなり',
    k020: 'せちなり',
    k021: 'めでたし',
    k040: 'おどろおどろし',
    k041: 'はづかし',
    k054: 'おいらかなり',
    k055: 'いと',
    k069: 'などか',
    k070: 'おどろく',
    k088: 'おはす',
    k089: 'あした',
    k100: 'をりふし',
    k101: 'けしき',
    k112: 'わざ',
    k113: 'な…そ',
    k126: 'よし…とも',
  }

  for (const [id, word] of Object.entries(expected)) {
    assert.equal(getKoten(id)?.word, word, id)
  }
  assert.equal(getKoten('k127')?.word, 'ありがたし')
  assert.equal(getKoten('k200')?.word, 'よも')
  assert.equal(getKoten('k201')?.word, 'むつかし')
  assert.equal(getKoten('k300')?.word, 'かく')
})

test('古典の章は全300語を重複なく分類する', () => {
  const tocWords = KOTEN_TOC.flatMap(({ words }) => words)
  assert.equal(KOTEN_TOC.length, KOTEN_CATEGORIES.length)
  assert.equal(tocWords.length, KOTEN_WORDS.length)
  assert.equal(new Set(tocWords.map((word) => word.id)).size, KOTEN_WORDS.length)
  for (const { category, words } of KOTEN_TOC) {
    assert.ok(words.length > 0, category.id)
    assert.ok(words.every((word) => word.category === category.id), category.id)
  }
})

test('全古典単語で意味が重ならない誤答を3件作れる', () => {
  for (const word of KOTEN_WORDS) {
    const distractors = pickKotenDistractors(word, 3, () => 0.5)
    assert.equal(distractors.length, 3, word.id)
    assert.equal(new Set(distractors.map((item) => item.id)).size, 3, word.id)
    assert.ok(distractors.every((item) => item.id !== word.id), word.id)
    assert.ok(distractors.every((item) => item.meaning !== word.meaning), word.id)
  }
})

test('古文の難読語辞書は重複せず、長い語を優先してルビへ分割する', () => {
  assert.equal(
    new Set(KOTEN_FURIGANA_ENTRIES.map(([text]) => text)).size,
    KOTEN_FURIGANA_ENTRIES.length,
  )
  for (const [text, reading] of KOTEN_FURIGANA_ENTRIES) {
    assert.ok(text.trim(), 'furigana text')
    assert.match(reading, /^[ぁ-ゖー・]+$/, text)
  }

  assert.deepEqual(tokenizeKotenText('内裏より御簾の内へ入る。'), [
    { text: '内裏', reading: 'だいり' },
    { text: 'より' },
    { text: '御簾', reading: 'みす' },
    { text: 'の内へ入る。' },
  ])
  assert.deepEqual(tokenizeKotenText('三日夜の餅と後朝の文。'), [
    { text: '三日夜の餅', reading: 'みかよのもちい' },
    { text: 'と' },
    { text: '後朝の文', reading: 'きぬぎぬのふみ' },
    { text: '。' },
  ])
  assert.deepEqual(tokenizeKotenText('効験'), [
    { text: '効験', reading: 'こうけん' },
  ])
  assert.ok(kotenTextForSearch('内裏・宮中').includes('だいり'))
})

test('歴史的仮名遣いの古文単語は既存kanaをルビとして使える', () => {
  const wordsWithReading = KOTEN_WORDS.filter(
    (word) => word.kana && word.kana !== word.word,
  )
  assert.ok(wordsWithReading.length > 0)
  for (const word of wordsWithReading) {
    assert.deepEqual(
      tokenizeKotenText(word.word, [[word.word, word.kana]]),
      [{ text: word.word, reading: word.kana }],
      word.id,
    )
  }
})

test('古文単語・古典常識の主要画面は共通ルビ表示を使う', () => {
  const screens = [
    'KotenStudy.jsx',
    'KotenQuiz.jsx',
    'KotenCulture.jsx',
    'KotenCultureStudy.jsx',
    'KotenCultureQuiz.jsx',
    'KotenSaved.jsx',
    'KotenInterpretationPrep.jsx',
    'KotenInterpretationQuiz.jsx',
  ]
  for (const filename of screens) {
    const source = readFileSync(
      new URL(`../src/screens/${filename}`, import.meta.url),
      'utf8',
    )
    assert.match(source, /Koten(?:Text|Word)/, filename)
  }

  const component = readFileSync(
    new URL('../src/components/KotenFurigana.jsx', import.meta.url),
    'utf8',
  )
  assert.match(component, /<ruby/)
  assert.match(component, /<rt>/)
})
