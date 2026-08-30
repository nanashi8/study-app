import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  GRAMMAR_FORMAT_EXPANSION,
  GRAMMAR_QUESTION_TYPES,
  grammarQuestionType,
} from '../src/data/grammar-format-expansion.js'
import { ALL_READING_PRACTICE_QUESTIONS } from '../src/data/reading-current-affairs-practice-questions.js'
import { auditEnglishQuestionFormats } from '../src/lib/english-question-format-audit.js'
import {
  buildWritingTokenText,
  isWritingTokenOrderCorrect,
  shuffledWritingTokens,
  writingWordTokens,
} from '../src/lib/writing.js'

const ROOT = new URL('..', import.meta.url)

test('長文32本と技能練習96問は、分野・3形式・読解ルール・既存語彙を全件で満たす', () => {
  const audit = auditEnglishQuestionFormats()
  assert.equal(audit.complete, true, JSON.stringify(audit.issues.slice(0, 20), null, 2))
  assert.equal(audit.currentAffairsPassageCount, 8)
  assert.deepEqual(Object.values(audit.currentAffairsDomainCounts), [2, 2, 2, 2])
  assert.ok(audit.existingReadingVocabOccurrenceCount / audit.readingVocabOccurrenceCount >= 0.9)
  assert.equal(audit.readingPracticeQuestionCount, 96)
  assert.deepEqual(audit.readingPracticeTypeCounts, {
    grammar: 32,
    usage: 32,
    'word-order': 32,
  })
  assert.ok(audit.readingRuleCount >= 10)
})

test('文法追加105問は7級の選択・並び替え・語法に35問ずつ配分する', () => {
  const audit = auditEnglishQuestionFormats()
  assert.equal(audit.legacyGrammarQuestionCount, 3450)
  assert.equal(audit.grammarFormatQuestionCount, 105)
  assert.equal(audit.grammarPracticeQuestionCount, 3555)
  assert.deepEqual(audit.grammarFormatTypeCounts, {
    choice: 35,
    usage: 35,
    'word-order': 35,
  })
  assert.ok(Object.values(audit.grammarFormatLevelCounts).every((count) => count === 15))
  assert.equal(audit.grammarChoicePathCount, 280)
  assert.equal(audit.grammarWrongChoicePathCount, 210)
})

test('並び替えは完成文選択ではなく、全問で直接押せる単語カードを使う', async () => {
  const orderItems = [
    ...ALL_READING_PRACTICE_QUESTIONS.filter((item) => item.questionType === 'word-order'),
    ...GRAMMAR_FORMAT_EXPANSION.filter((item) => grammarQuestionType(item) === 'word-order'),
  ]
  assert.equal(orderItems.length, 67)
  for (const item of orderItems) {
    const tokens = writingWordTokens(item.answer)
    const shuffled = shuffledWritingTokens(item.answer, item.id)
    assert.equal(buildWritingTokenText(tokens), item.answer, item.id)
    assert.equal(isWritingTokenOrderCorrect(tokens, item.answer), true, item.id)
    assert.equal(isWritingTokenOrderCorrect(shuffled, item.answer), false, item.id)
  }

  const componentSource = await readFile(new URL('src/components/WordOrderExercise.jsx', ROOT), 'utf8')
  assert.match(componentSource, /data-word-order-bank/)
  assert.match(componentSource, /onClick=\{\(\) => placeWord\(token\)\}/)
  assert.match(componentSource, /onClick=\{\(\) => returnWord\(token\)\}/)
  assert.match(componentSource, /initialText/)
})

test('文法画面は3形式と混合を選べ、長文は追加形式を実際の採点対象にする', async () => {
  const [grammarSource, grammarQuizSource, readingSource] = await Promise.all([
    readFile(new URL('src/screens/Grammar.jsx', ROOT), 'utf8'),
    readFile(new URL('src/screens/GrammarQuiz.jsx', ROOT), 'utf8'),
    readFile(new URL('src/components/ReadingComprehensionCheck.jsx', ROOT), 'utf8'),
  ])
  assert.match(grammarSource, /\{\['mixed', \.\.\.GRAMMAR_QUESTION_TYPES\]\.map/)
  assert.match(grammarSource, /data-grammar-question-type=\{type\}/)
  assert.match(grammarQuizSource, /<WordOrderExercise/)
  assert.match(grammarQuizSource, /data-grammar-target-meaning/)
  assert.match(readingSource, /contentQuestions, \.\.\.practiceQuestions/)
  assert.match(readingSource, /data-reading-question-type/)
  assert.match(readingSource, /<ReadingPracticeExplanation/)
})
