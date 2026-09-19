import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

import {
  EXAM_USAGE_GUIDES,
  EXAM_WORDS,
  EXAM_WORD_IDS,
} from '../src/data/exam-lexicon.js'
import { EXAM_PHRASES } from '../src/data/phrases-exam.js'
import { CURRICULUM_IDIOMS } from '../src/data/phrases-bank.js'
import {
  PHRASE_LEVEL_TARGETS,
  PHRASE_TARGET_TOTALS,
} from '../src/data/phrase-curriculum.js'
import { ETYMOLOGY_COMPLETION_WORDS } from '../src/data/words-etymology-completion.js'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { GRAMMAR_REFERENCE_UNITS } from '../src/data/grammar-reference/index.js'
import { GRAMMAR, grammarPracticeByTopic } from '../src/data/grammar.js'
import { splitMeanings } from '../src/data/compact.js'
import { pickPhraseDistractors } from '../src/lib/session.js'
import { vocabMatchRank } from '../src/lib/vocabSearch.js'

const LEVELS = new Set(['5', '4', '3', 'pre2', '2', 'pre1', '1'])

test('入試・英検向けの新規見出し語139語は既存辞書へ一意に統合される', () => {
  assert.equal(EXAM_WORDS.length, 139)
  assert.equal(EXAM_WORD_IDS.size, EXAM_WORDS.length)
  assert.equal(new Set(ALL_WORDS.map((word) => word.id)).size, ALL_WORDS.length)
  const examBlockStart = ALL_WORDS.findIndex((word) => word.id === EXAM_WORDS[0].id)
  assert.deepEqual(
    ALL_WORDS.slice(examBlockStart, examBlockStart + EXAM_WORDS.length).map((word) => word.id),
    EXAM_WORDS.map((word) => word.id),
    '既存見出し語の順序を変えず、語源補完語だけを後置する',
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

test('熟語1,754・構文350の全2,104項目を級別目標どおり収録する', () => {
  assert.equal(EXAM_PHRASES.length, 144)
  assert.equal(CURRICULUM_IDIOMS.length, 978)
  assert.equal(PHRASES.length, PHRASE_TARGET_TOTALS.all)
  assert.equal(PHRASES.filter((phrase) => phrase.kind === 'idiom').length, PHRASE_TARGET_TOTALS.idiom)
  assert.equal(PHRASES.filter((phrase) => phrase.kind === 'syntax').length, PHRASE_TARGET_TOTALS.syntax)
  const firstExamIndex = PHRASES.findIndex((phrase) => phrase.id === EXAM_PHRASES[0].id)
  assert.equal(firstExamIndex, 69)
  assert.deepEqual(
    PHRASES.slice(firstExamIndex, firstExamIndex + EXAM_PHRASES.length).map((phrase) => phrase.id),
    EXAM_PHRASES.map((phrase) => phrase.id),
    '既存カードと入試補充カードのID・並びを変えない',
  )
  assert.equal(
    createHash('sha256')
      .update(PHRASES.slice(0, 213).map((phrase) => phrase.id).join('\n'))
      .digest('hex'),
    'c7747eeecd659d74a0fb02f1d7c2eb28035f7550c2dd1cf99c1dd97f96ee820a',
    '既存213カードのSRS IDと並びを保存履歴のため固定する',
  )
  assert.equal(new Set(PHRASES.map((phrase) => phrase.id)).size, PHRASES.length)
  assert.equal(
    new Set(PHRASES.map((phrase) => phrase.phrase.toLowerCase())).size,
    PHRASES.length,
  )

  for (const phrase of PHRASES) {
    assert.ok(LEVELS.has(phrase.level), phrase.id)
    assert.ok(['idiom', 'syntax'].includes(phrase.kind), phrase.id)
    assert.ok(phrase.meaning && phrase.meanings.length, phrase.id)
    assert.ok(phrase.example.en && phrase.example.ja, phrase.id)
    assert.ok(phrase.note, phrase.id)
    if (phrase.kind === 'idiom') assert.ok(phrase.origin, phrase.id)
    if (phrase.kind === 'idiom' && (phrase.curriculumSupplement || phrase.examSupplement)) {
      assert.deepEqual(phrase.meanings, splitMeanings(phrase.meaning), phrase.id)
    }
  }

  for (const [level, target] of Object.entries(PHRASE_LEVEL_TARGETS)) {
    assert.equal(
      PHRASES.filter((phrase) => phrase.level === level && phrase.kind === 'idiom').length,
      target.idiom,
      `${level}級 熟語`,
    )
    assert.equal(
      PHRASES.filter((phrase) => phrase.level === level && phrase.kind === 'syntax').length,
      target.syntax,
      `${level}級 構文`,
    )
  }
})

test('新規熟語は分類・使用例を持ち、構文は既存文法問題へ往復できる', () => {
  const grammarById = new Map(GRAMMAR.map((item) => [item.id, item]))
  const wordIds = new Set(ALL_WORDS.map((word) => word.id))
  const grammarIds = new Set(GRAMMAR.map((item) => item.id))

  for (const phrase of CURRICULUM_IDIOMS) {
    assert.equal(phrase.kind, 'idiom', phrase.id)
    assert.equal(phrase.curriculumSupplement, true, phrase.id)
    assert.ok(phrase.category, phrase.id)
    assert.ok(!wordIds.has(phrase.id), phrase.id)
    assert.ok(!grammarIds.has(phrase.id), phrase.id)
  }

  const syntax = PHRASES.filter((phrase) => phrase.category === 'grammar-example')
  assert.equal(syntax.length, 309)
  for (const phrase of syntax) {
    const source = grammarById.get(phrase.sourceGrammarId)
    assert.ok(source, phrase.id)
    assert.equal(phrase.phrase, source.sentence.en, phrase.id)
    assert.equal(phrase.meaning, source.sentence.ja, phrase.id)
    assert.match(phrase.origin, new RegExp(source.answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), phrase.id)
    assert.ok(phrase.origin.includes(source.topic), phrase.id)
    assert.equal(phrase.note, source.explain, phrase.id)
    assert.ok(phrase.sourcePattern, phrase.id)
  }

  for (const level of LEVELS) {
    assert.ok(
      new Set(
        syntax
          .filter((phrase) => phrase.level === level)
          .map((phrase) => phrase.sourcePattern),
      ).size >= 20,
      `${level}級の構文パターンが偏っている`,
    )
  }

  for (const phrase of PHRASES) {
    const distractors = pickPhraseDistractors(phrase, 3, () => 0.314159)
    assert.equal(distractors.length, 3, phrase.id)
    assert.equal(
      new Set([phrase.meaning, ...distractors.map((item) => item.meaning)]).size,
      4,
      `${phrase.id}: 意味が重なる選択肢`,
    )
  }
})

test('高校（準2級〜1級）の文法の参考書は84単元で、どれも同じ級・単元のテストへつながる', () => {
  const highSchool = GRAMMAR_REFERENCE_UNITS.filter((unit) => ['pre2', '2', 'pre1', '1'].includes(unit.level))
  assert.equal(highSchool.length, 84)
  assert.equal(new Set(GRAMMAR_REFERENCE_UNITS.map((unit) => unit.id)).size, GRAMMAR_REFERENCE_UNITS.length)
  for (const unit of highSchool) {
    assert.ok(unit.lead && unit.forms.length, unit.id)
    assert.ok(unit.points.length >= 2, unit.id)
    assert.ok(grammarPracticeByTopic(unit.level, unit.topic, 'mixed').length > 0, unit.id)
    for (const point of unit.points) {
      for (const example of point.examples) assert.ok(example.en && example.ja, unit.id)
    }
    for (const item of unit.mistakes) assert.ok(item.wrong && item.right && item.why, unit.id)
  }
})
