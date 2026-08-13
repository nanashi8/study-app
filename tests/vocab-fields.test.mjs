import test from 'node:test'
import assert from 'node:assert/strict'

import {
  ALL_WORDS,
  VOCAB_FIELD_GROUPS,
  VOCAB_FIELDS,
  vocabFieldFor,
  wordsByField,
  wordsByLevel,
} from '../src/data/vocab.js'
import {
  DECKS,
  DECK_VERSION,
  LEARNING_DECK_TOC,
} from '../src/data/decks.js'
import { wordsForSource } from '../src/lib/session.js'

test('全英単語を重複なく中高生向け10分野へまとめる', () => {
  assert.equal(VOCAB_FIELD_GROUPS.length, 10)
  assert.deepEqual(VOCAB_FIELDS, VOCAB_FIELD_GROUPS.map((group) => group.label))
  assert.equal(new Set(VOCAB_FIELD_GROUPS.map((group) => group.id)).size, 10)
  assert.equal(new Set(VOCAB_FIELDS).size, 10)

  const sourceFields = VOCAB_FIELD_GROUPS.flatMap((group) => group.sourceFields)
  assert.equal(new Set(sourceFields).size, sourceFields.length)
  assert.deepEqual(new Set(sourceFields), new Set(ALL_WORDS.map((word) => word.field)))

  const members = VOCAB_FIELDS.flatMap(wordsByField)
  assert.equal(members.length, ALL_WORDS.length)
  assert.equal(new Set(members.map((word) => word.id)).size, ALL_WORDS.length)
  assert.ok(VOCAB_FIELDS.every((field) => wordsByField(field).length > 0))
  assert.ok(ALL_WORDS.every((word) => VOCAB_FIELDS.includes(vocabFieldFor(word))))
})

test('新10分野の出題と旧41細分類のsource互換を両立する', () => {
  for (const group of VOCAB_FIELD_GROUPS) {
    const expected = ALL_WORDS.filter((word) => group.sourceFields.includes(word.field))
    assert.deepEqual(wordsByField(group.id).map((word) => word.id), expected.map((word) => word.id))
    assert.deepEqual(wordsByField(group.label).map((word) => word.id), expected.map((word) => word.id))
    assert.deepEqual(
      wordsForSource({ type: 'field', field: group.id }).map((word) => word.id),
      expected.map((word) => word.id),
    )
  }

  const legacyLaw = ALL_WORDS.filter((word) => word.field === '法律')
  assert.deepEqual(wordsByField('法律').map((word) => word.id), legacyLaw.map((word) => word.id))
  assert.ok(wordsByField('civics-history').length > legacyLaw.length)
})

test('級別目次も最大10分野で全単語を一度ずつ扱い、旧デッキ列は維持する', () => {
  assert.equal(DECK_VERSION, 1)
  assert.ok(DECKS.every((deck) => !deck.id.startsWith('learning|')))

  for (const toc of LEARNING_DECK_TOC) {
    assert.ok(toc.chapters.length > 0 && toc.chapters.length <= 10, toc.level.id)
    assert.ok(toc.chapters.every((chapter) => VOCAB_FIELDS.includes(chapter.field)))
    assert.equal(new Set(toc.chapters.map((chapter) => chapter.fieldId)).size, toc.chapters.length)

    const expectedIds = wordsByLevel(toc.level.id).map((word) => word.id)
    const actualIds = toc.chapters.flatMap((chapter) =>
      chapter.decks.flatMap((deck) => deck.wordIds),
    )
    assert.equal(actualIds.length, expectedIds.length, toc.level.id)
    assert.deepEqual(new Set(actualIds), new Set(expectedIds), toc.level.id)
    assert.equal(new Set(actualIds).size, actualIds.length, toc.level.id)
  }
})
