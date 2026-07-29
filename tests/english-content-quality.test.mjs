import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  ALL_WORDS,
  pickDistractors,
} from '../src/data/vocab.js'
import { quizMeaning, quizMeaningKey } from '../src/data/compact.js'
import {
  GRAMMAR,
  grammarChoiceGuidanceFor,
} from '../src/data/grammar.js'
import { PHRASES } from '../src/data/phrases.js'
import { pickPhraseDistractors } from '../src/lib/session.js'
import {
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_READING_BANK,
} from '../src/data/diagnostic.js'
import { buildDiagnosticQuestions } from '../src/lib/diagnosticQuestions.js'

const fixedRandom = () => 0.314159

test('全語彙は通常クイズ・診断に必要な4語義が一意で、誤答も同じ品詞から選ぶ', () => {
  for (const word of ALL_WORDS) {
    const distractors = pickDistractors(word, 3, fixedRandom)
    const choices = [word, ...distractors]

    assert.equal(distractors.length, 3, word.id)
    assert.equal(new Set(choices.map(quizMeaningKey)).size, 4, word.id)
    assert.ok(distractors.every((item) => item.pos === word.pos), word.id)
    assert.ok(choices.every((item) => quizMeaning(item)), word.id)
  }
})

test('全熟語・構文は通常クイズ・診断に必要な4語義が一意で、同じ種別から選ぶ', () => {
  for (const item of PHRASES) {
    const distractors = pickPhraseDistractors(item, 3, fixedRandom)
    const choices = [item, ...distractors]

    assert.equal(distractors.length, 3, item.id)
    assert.equal(new Set(choices.map(quizMeaningKey)).size, 4, item.id)
    assert.ok(distractors.every((candidate) => candidate.kind === item.kind), item.id)
  }
})

test('診断の全基準問題・読解バンク・生成3フォームは解説と英文和訳を備える', () => {
  for (const item of DIAGNOSTIC_QUESTIONS) {
    assert.ok(item.explain, item.id)
    if (item.skill === 'reading') {
      assert.ok(item.passage && item.passageJa, item.id)
    } else {
      assert.ok(item.review?.en && item.review?.ja, item.id)
    }
  }

  for (const item of DIAGNOSTIC_READING_BANK) {
    assert.ok(item.passage && item.passageJa && item.explain, item.id)
  }

  for (let attemptNumber = 1; attemptNumber <= 3; attemptNumber += 1) {
    const questions = buildDiagnosticQuestions({
      attemptNumber,
      seed: 0x1a2b3c4d,
    })
    for (const item of questions) {
      assert.equal(item.choices.length, 4, item.id)
      assert.equal(new Set(item.choices).size, 4, item.id)
      assert.ok(item.choices.includes(item.answer), item.id)
      assert.ok(item.explain, item.id)
      if (item.skill === 'reading') {
        assert.ok(item.passageJa, item.id)
      } else {
        assert.ok(item.review?.en && item.review?.ja, item.id)
      }
      if (item.skill === 'usage') {
        const source = PHRASES.find(
          (phrase) => `phrase:${phrase.id}` === item.sourceId,
        )
        assert.ok(source, item.id)
        for (const choice of item.choices) {
          if (choice === item.answer) continue
          assert.ok(
            PHRASES.some((phrase) =>
              phrase.kind === source.kind && phrase.meaning === choice),
            `${item.id}: ${choice}`,
          )
        }
      }
    }
  }
})

test('全英文法の誤答9420件は使える場面または不成立理由を日本語で説明する', () => {
  for (const item of GRAMMAR) {
    for (const choice of item.choices) {
      if (choice === item.answer) continue
      const guidance = grammarChoiceGuidanceFor(item, choice)
      assert.ok(['valid', 'invalid'].includes(guidance?.status), `${item.id}: ${choice}`)
      assert.match(guidance.summary, /[\u3040-\u30ff\u3400-\u9fff]/, `${item.id}: ${choice}`)
    }
  }
})

test('主要クイズは正答後に英文・和訳・学習ポイントを表示する', () => {
  const checks = {
    'VocabQuiz.jsx': [/word\.example\.en/, /word\.example\.ja/, /word\.etymology/],
    'GrammarQuiz.jsx': [/item\.sentence\.en/, /item\.sentence\.ja/, /data-grammar-choice-guidance/, /patternExamples/],
    'PhraseQuiz.jsx': [/item\.example\.en/, /item\.example\.ja/, /item\.origin/, /item\.note/],
    'DictationPlay.jsx': [/item\.text/, /item\.ja/, /聞き取りポイント/],
    'Diagnostic.jsx': [/question\.review/, /question\.passageJa/, /question\.explain/],
  }

  for (const [filename, patterns] of Object.entries(checks)) {
    const source = readFileSync(
      new URL(`../src/screens/${filename}`, import.meta.url),
      'utf8',
    )
    for (const pattern of patterns) assert.match(source, pattern, filename)
  }
})
