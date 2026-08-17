import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ALL_WORDS } from '../src/data/vocab.js'
import { UNKNOWN_CHOICE_ID } from '../src/lib/quizChoices.js'

const MULTIPLE_CHOICE_SCREENS = [
  'Diagnostic.jsx',
  'GrammarQuiz.jsx',
  'KotenCultureQuiz.jsx',
  'KotenGrammarQuiz.jsx',
  'KotenInterpretationQuiz.jsx',
  'KotenQuiz.jsx',
  'ListeningQuiz.jsx',
  'MathSolve.jsx',
  'PhraseQuiz.jsx',
  'VocabQuiz.jsx',
]

test('すべての正誤付き選択問題に「わからない」回答がある', () => {
  for (const filename of MULTIPLE_CHOICE_SCREENS) {
    const source = readFileSync(
      new URL(`../src/screens/${filename}`, import.meta.url),
      'utf8',
    )
    assert.match(source, /<UnknownChoiceButton\b/, filename)
  }
  const readingCheck = readFileSync(
    new URL('../src/components/ReadingComprehensionCheck.jsx', import.meta.url),
    'utf8',
  )
  assert.match(readingCheck, /<UnknownChoiceButton\b/, 'ReadingComprehensionCheck.jsx')
})

test('語源は指定された正しい・正しくないの2択だけを表示する', () => {
  const source = readFileSync(
    new URL('../src/screens/EtymologyQuiz.jsx', import.meta.url),
    'utf8',
  )
  assert.match(source, /正しい/)
  assert.match(source, /正しくない/)
  assert.doesNotMatch(source, /<UnknownChoiceButton\b/)
})

test('「わからない」の内部IDは教材の単語IDと衝突しない', () => {
  assert.ok(ALL_WORDS.some((word) => word.id === 'unknown'))
  assert.ok(ALL_WORDS.every((word) => word.id !== UNKNOWN_CHOICE_ID))
})
