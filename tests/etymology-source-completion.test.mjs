import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ALL_WORDS,
  ETYMOLOGY_PACKS,
  getRoot,
  rootIdsForWord,
} from '../src/data/vocab.js'
import { ETYMOLOGY_COMPLETION_WORDS } from '../src/data/words-etymology-completion.js'

const completionIds = new Set(ETYMOLOGY_COMPLETION_WORDS.map((word) => word.id))
const liveById = new Map(ALL_WORDS.map((word) => [word.id, word]))

test('語源差分監査で不足した215語を独立見出しとして収録する', () => {
  assert.equal(ETYMOLOGY_COMPLETION_WORDS.length, 215)
  assert.equal(completionIds.size, 215)
  assert.equal(ALL_WORDS.length, 8426)

  for (const sourceWord of ETYMOLOGY_COMPLETION_WORDS) {
    const liveWord = liveById.get(sourceWord.id)
    assert.ok(liveWord, sourceWord.id)
    assert.equal(liveWord.word, sourceWord.word)
    assert.ok(liveWord.compression.packId.startsWith('completion:'), sourceWord.id)
  }
})

test('補完語は独自の意味・例文・語源説明と発音をすべて持つ', () => {
  const notes = new Set()
  const examples = new Set()

  for (const id of completionIds) {
    const word = liveById.get(id)
    assert.ok(word.meaning.trim(), `${id}: meaning`)
    assert.ok(word.example.en.trim(), `${id}: example.en`)
    assert.ok(word.example.ja.trim(), `${id}: example.ja`)
    assert.ok(word.etymology.note.length >= 24, `${id}: etymology.note`)
    assert.ok(word.phonetic, `${id}: phonetic`)
    assert.ok(word.field, `${id}: field`)
    assert.ok(!notes.has(word.etymology.note), `${id}: 語源説明の使い回し`)
    assert.ok(!examples.has(word.example.en), `${id}: 例文の使い回し`)
    notes.add(word.etymology.note)
    examples.add(word.example.en)
  }
})

test('補完データに資料本文・ページ・図版の保存用フィールドを持たせない', () => {
  const forbiddenKeys = new Set([
    'sourcePage',
    'sourceQuote',
    'sourceText',
    'sourceImage',
    'sourceOrder',
    'ocr',
    'bookPage',
  ])

  for (const word of ETYMOLOGY_COMPLETION_WORDS) {
    for (const key of Object.keys(word)) {
      assert.ok(!forbiddenKeys.has(key), `${word.id}: ${key}`)
    }
  }
})

test('年と座るの代表語根を補い、確実な同根語だけを結ぶ', () => {
  assert.equal(getRoot('ann')?.meaning, '年')
  assert.equal(getRoot('sed')?.meaning, '座る')

  for (const head of ['annual', 'anniversary', 'annuity', 'biennial', 'perennial']) {
    assert.ok(rootIdsForWord(liveById.get(head.replace('-', '_'))).includes('ann'), head)
  }
  for (const head of ['preside', 'president']) {
    assert.ok(rootIdsForWord(liveById.get(head)).includes('sed'), head)
  }

  // 由来に議論がある結びつきは、綴りだけで追加しない。
  assert.ok(!rootIdsForWord(liveById.get('embarrass')).includes('bar'))

  // 綴りが似ていても別系統の語源は、学習上の同根語として混ぜない。
  const falseRootCases = [
    ['improvisation', 'prob'],
    ['improvise', 'prob'],
    ['tactics', 'tact'],
    ['capitalism', 'cept'],
    ['capitalist', 'cept'],
    ['capitalize', 'cept'],
    ['adjustable', 'jud'],
    ['preface', 'fact'],
    ['opportune', 'port'],
  ]
  for (const [wordId, rootId] of falseRootCases) {
    assert.ok(!rootIdsForWord(liveById.get(wordId)).includes(rootId), `${wordId}: ${rootId}`)
  }
})

test('旧2,678パックと補完パックのID空間が交わらない', () => {
  const legacy = ETYMOLOGY_PACKS.filter((pack) => !pack.id.startsWith('completion:'))
  const completion = ETYMOLOGY_PACKS.filter((pack) => pack.id.startsWith('completion:'))
  assert.equal(legacy.length, 2678)
  assert.ok(completion.length > 0)
  assert.equal(new Set(ETYMOLOGY_PACKS.map((pack) => pack.id)).size, ETYMOLOGY_PACKS.length)
  assert.deepEqual(
    new Set(completion.flatMap((pack) => pack.coverageIds)),
    completionIds,
  )
})
