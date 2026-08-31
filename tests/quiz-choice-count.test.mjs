import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { QUIZ_CHOICE_COUNT, limitQuizChoices } from '../src/lib/quizChoices.js'
import { GRAMMAR } from '../src/data/grammar.js'
import { LISTENING_ITEMS, shuffledListeningChoices } from '../src/data/listening.js'
import { KANBUN_COLLECTIONS, makeKanbunQuestion } from '../src/data/kanbun-content.js'
import { KOTEN_WORDS, pickKotenDistractors } from '../src/data/koten.js'
import { buildDiagnosticQuestions } from '../src/lib/diagnosticQuestions.js'

const read = (relative) => readFile(new URL(relative, import.meta.url), 'utf8')

test('出題の選択肢は正解を含む3択で、問題ごとにいつも同じ3択になる', () => {
  assert.equal(QUIZ_CHOICE_COUNT, 3)

  const choices = ['am', 'is', 'are', 'be']
  const limited = limitQuizChoices(choices, 'am', { seed: 'gr_5_be_1' })
  assert.equal(limited.length, 3)
  assert.ok(limited.includes('am'))
  // 元の並び順は保つので、添字で正解を持つ教材でも表示と食い違わない。
  assert.deepEqual(limited, choices.filter((choice) => limited.includes(choice)))
  assert.deepEqual(limited, limitQuizChoices(choices, 'am', { seed: 'gr_5_be_1' }))

  // 3件以下の教材はそのまま出す。
  assert.deepEqual(limitQuizChoices(['a', 'b', 'c'], 'a', { seed: 'x' }), ['a', 'b', 'c'])
  assert.deepEqual(limitQuizChoices([], 'a', { seed: 'x' }), [])

  // 正解の判定は値でも関数でも渡せる。
  const objects = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
  const picked = limitQuizChoices(objects, (choice) => choice.id === 'd', { seed: 'y' })
  assert.equal(picked.length, 3)
  assert.ok(picked.some((choice) => choice.id === 'd'))
})

test('英文法は4択の教材から正解を含む3択を出す', () => {
  for (const item of GRAMMAR) {
    const shown = limitQuizChoices(item.choices, item.answer, { seed: item.id })
    assert.equal(shown.length, QUIZ_CHOICE_COUNT, item.id)
    assert.equal(new Set(shown).size, QUIZ_CHOICE_COUNT, item.id)
    assert.ok(shown.includes(item.answer), item.id)
  }
})

test('リスニング・漢文・古典単語・診断も3択で出題する', () => {
  for (const item of LISTENING_ITEMS) {
    const shown = shuffledListeningChoices(item, () => 0.42)
    assert.equal(shown.length, QUIZ_CHOICE_COUNT, item.id)
    assert.ok(shown.some((choice) => choice.id === item.answer), item.id)
  }

  for (const [domain, collection] of Object.entries(KANBUN_COLLECTIONS)) {
    for (const item of collection) {
      const question = makeKanbunQuestion(domain, item, () => 0.42)
      assert.equal(question.choices.length, QUIZ_CHOICE_COUNT, question.id)
      assert.ok(question.choices.some((choice) => choice.id === question.answerId), question.id)
    }
  }

  for (const word of KOTEN_WORDS) {
    assert.equal(pickKotenDistractors(word, QUIZ_CHOICE_COUNT - 1, () => 0.41).length, 2, word.id)
  }

  for (const attemptNumber of [1, 2, 3]) {
    for (const question of buildDiagnosticQuestions({ attemptNumber, seed: 0x1a2b3c4d })) {
      assert.equal(question.choices.length, QUIZ_CHOICE_COUNT, question.id)
      assert.ok(question.choices.includes(question.answer), question.id)
    }
  }
})

test('選択式の全画面は3択に絞ったうえで「わからない」を並べる', async () => {
  const limitedScreens = [
    '../src/screens/GrammarQuiz.jsx',
    '../src/screens/KotenGrammarQuiz.jsx',
    '../src/screens/KotenCultureQuiz.jsx',
    '../src/screens/KotenInterpretationQuiz.jsx',
    '../src/screens/LiteratureReader.jsx',
    '../src/components/ReadingComprehensionCheck.jsx',
  ]
  for (const relative of limitedScreens) {
    const source = await read(relative)
    assert.match(source, /limitQuizChoices/, `${relative}: 3択へ絞っていない`)
    assert.match(source, /UnknownChoiceButton/, `${relative}: わからないがない`)
  }

  const generatedScreens = [
    '../src/screens/VocabQuiz.jsx',
    '../src/screens/PhraseQuiz.jsx',
    '../src/screens/KotenQuiz.jsx',
    '../src/screens/KanbunQuiz.jsx',
    '../src/screens/ListeningQuiz.jsx',
    '../src/screens/Diagnostic.jsx',
    '../src/screens/MathSolve.jsx',
  ]
  for (const relative of generatedScreens) {
    const source = await read(relative)
    assert.match(source, /UnknownChoiceButton/, `${relative}: わからないがない`)
  }
})
