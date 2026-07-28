import test from 'node:test'
import assert from 'node:assert/strict'

import {
  EXAM_USAGE_GUIDES,
  EXAM_WORDS,
  EXAM_WORD_IDS,
} from '../src/data/exam-lexicon.js'
import { EXAM_PHRASES } from '../src/data/phrases-exam.js'
import { EXAM_GRAMMAR_LESSONS } from '../src/data/grammar-lessons-exam.js'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { GRAMMAR_LESSONS } from '../src/data/grammar-lessons.js'
import { grammarByTopic } from '../src/data/grammar.js'
import { splitMeanings } from '../src/data/compact.js'
import { vocabMatchRank } from '../src/lib/vocabSearch.js'

const LEVELS = new Set(['5', '4', '3', 'pre2', '2', 'pre1', '1'])

test('入試・英検向けの新規見出し語139語は既存辞書へ一意に統合される', () => {
  assert.equal(EXAM_WORDS.length, 139)
  assert.equal(EXAM_WORD_IDS.size, EXAM_WORDS.length)
  assert.equal(new Set(ALL_WORDS.map((word) => word.id)).size, ALL_WORDS.length)
  assert.deepEqual(
    ALL_WORDS.slice(-EXAM_WORDS.length).map((word) => word.id),
    EXAM_WORDS.map((word) => word.id),
    '既存見出し語の順序を変えず、新規語だけを末尾へ追加する',
  )

  for (const word of EXAM_WORDS) {
    const integrated = getWord(word.id)
    assert.ok(integrated, word.id)
    assert.equal(integrated.word, word.word, word.id)
    assert.ok(LEVELS.has(integrated.level), word.id)
    assert.ok(integrated.field, word.id)
    assert.ok(integrated.usage, word.id)
    assert.ok(integrated.phonetic, word.id)
    assert.equal(integrated.meanings.join('・'), integrated.meaning, word.id)
  }
})

test('使い分けガイドは実在する93見出し語と往復でき、推奨表現も検証できる', () => {
  assert.equal(EXAM_USAGE_GUIDES.length, 43)
  assert.equal(new Set(EXAM_USAGE_GUIDES.map((guide) => guide.id)).size, EXAM_USAGE_GUIDES.length)

  const referenced = new Set()
  for (const guide of EXAM_USAGE_GUIDES) {
    assert.ok(guide.title && guide.summary, guide.id)
    assert.ok(guide.wordIds.length >= 1, guide.id)
    assert.ok(guide.choices.length >= 2, guide.id)
    for (const wordId of guide.wordIds) {
      referenced.add(wordId)
      const word = getWord(wordId)
      assert.ok(word, `${guide.id}: ${wordId}`)
      assert.ok(word.usageGuides.some((item) => item.id === guide.id), `${guide.id}: ${wordId}`)
    }
    for (const choice of guide.choices) {
      assert.ok(choice.term && choice.rule && choice.example && choice.ja, guide.id)
    }
    if (guide.preferred) {
      assert.ok(guide.preferred.avoid, guide.id)
      assert.ok(guide.preferred.use, guide.id)
      assert.ok(guide.preferred.reason, guide.id)
    }
  }
  assert.equal(referenced.size, 93)
})

test('辞書検索は見出し語・意味に加えて語法と推奨表現も検索する', () => {
  assert.equal(vocabMatchRank(getWord('affect'), 'affect'), 0)
  assert.equal(vocabMatchRank(getWord('misinformation'), '誤情報'), 3)
  assert.equal(vocabMatchRank(getWord('access'), '余分な前置詞'), 4)
  assert.equal(vocabMatchRank(getWord('say'), '相手を直接目的語'), 4)
  assert.equal(vocabMatchRank(getWord('say'), '検索不能な文字列'), -1)
})

test('熟語・構文は新規144項目を含む213項目へ拡充され、全級に十分な項目がある', () => {
  assert.equal(EXAM_PHRASES.length, 144)
  assert.equal(PHRASES.length, 213)
  assert.deepEqual(
    PHRASES.slice(-EXAM_PHRASES.length).map((phrase) => phrase.id),
    EXAM_PHRASES.map((phrase) => phrase.id),
  )
  assert.equal(new Set(PHRASES.map((phrase) => phrase.id)).size, PHRASES.length)
  assert.equal(
    new Set(PHRASES.map((phrase) => phrase.phrase.toLowerCase())).size,
    PHRASES.length,
  )

  for (const phrase of EXAM_PHRASES) {
    assert.ok(LEVELS.has(phrase.level), phrase.id)
    assert.ok(['idiom', 'syntax'].includes(phrase.kind), phrase.id)
    assert.equal(phrase.meanings.join('・'), phrase.meaning, phrase.id)
    assert.deepEqual(phrase.meanings, splitMeanings(phrase.meaning), phrase.id)
    assert.ok(phrase.example.en && phrase.example.ja, phrase.id)
    assert.ok(phrase.origin && phrase.note, phrase.id)
  }

  for (const level of LEVELS) {
    assert.ok(PHRASES.filter((phrase) => phrase.level === level).length >= 25, level)
  }
})

test('高校文法解説は43単元となり、追加35単元は同論点クイズへ接続する', () => {
  assert.equal(EXAM_GRAMMAR_LESSONS.length, 35)
  assert.equal(GRAMMAR_LESSONS.length, 69)
  assert.deepEqual(
    GRAMMAR_LESSONS.slice(-EXAM_GRAMMAR_LESSONS.length).map((lesson) => lesson.id),
    EXAM_GRAMMAR_LESSONS.map((lesson) => lesson.id),
  )
  assert.equal(new Set(GRAMMAR_LESSONS.map((lesson) => lesson.id)).size, GRAMMAR_LESSONS.length)
  assert.equal(
    GRAMMAR_LESSONS.filter((lesson) => lesson.stage === '高校基礎' || lesson.stage === '高校発展').length,
    43,
  )

  for (const lesson of EXAM_GRAMMAR_LESSONS) {
    assert.ok(['高校基礎', '高校発展'].includes(lesson.stage), lesson.id)
    assert.ok(lesson.summary && lesson.form, lesson.id)
    assert.ok(lesson.points.length >= 2, lesson.id)
    assert.ok(lesson.examples.length >= 2, lesson.id)
    assert.ok(grammarByTopic(lesson.level, lesson.topic).length > 0, lesson.id)
    for (const example of lesson.examples) {
      assert.ok(example.en && example.ja, lesson.id)
    }
    for (const item of lesson.preferred ?? []) {
      assert.ok(item.avoid && item.use && item.reason, lesson.id)
    }
  }
})
