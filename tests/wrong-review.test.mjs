import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { recordStudyAnswer } from '../src/lib/session.js'

test('暗記セッションは忘れた項目のIDだけを復習対象に残す', () => {
  let results = { remembered: 0, forgot: 0, forgotIds: [] }

  results = recordStudyAnswer(results, 'remembered-1', true)
  results = recordStudyAnswer(results, 'forgot-1', false)
  results = recordStudyAnswer(results, 'remembered-2', true)
  results = recordStudyAnswer(results, 'forgot-2', false)

  assert.deepEqual(results, {
    remembered: 2,
    forgot: 2,
    forgotIds: ['forgot-1', 'forgot-2'],
  })
})

test('各結果画面には全デッキではなく誤答IDだけを渡す', () => {
  const studyScreens = ['VocabStudy.jsx', 'PhraseStudy.jsx']
  const quizScreens = [
    'VocabQuiz.jsx',
    'PhraseQuiz.jsx',
    'ListeningQuiz.jsx',
    'DictationPlay.jsx',
    'GrammarQuiz.jsx',
  ]

  for (const filename of studyScreens) {
    const source = readFileSync(
      new URL(`../src/screens/${filename}`, import.meta.url),
      'utf8',
    )
    assert.match(source, /reviewIds: results\.current\.forgotIds/)
    assert.doesNotMatch(source, /reviewIds: deck\.map/)
  }

  for (const filename of quizScreens) {
    const source = readFileSync(
      new URL(`../src/screens/${filename}`, import.meta.url),
      'utf8',
    )
    assert.match(source, /reviewIds: results\.current\.wrongIds/)
    assert.doesNotMatch(source, /reviewIds:[\s\S]{0,120}deck\.map/)
  }
})
