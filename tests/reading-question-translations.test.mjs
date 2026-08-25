import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { PASSAGES } from '../src/data/passages.js'
import { getReadingQuestions } from '../src/data/reading-questions.js'
import {
  buildReadingChoiceExplanations,
  buildReadingInstructorExplanation,
} from '../src/lib/instructorExplanations.js'
import { auditReadingTranslations } from '../src/lib/reading-translation-audit.js'

test('全32長文・794文・140問・560選択肢の和訳解説に欠落と対応ずれがない', () => {
  const audit = auditReadingTranslations()

  assert.equal(audit.passageCount, 32)
  assert.equal(audit.sentenceCount, 794)
  assert.equal(audit.sentenceTranslationCount, 794)
  assert.equal(audit.questionCount, 140)
  assert.equal(audit.questionTranslationCount, 140)
  assert.equal(audit.evidenceExplanationCount, 140)
  assert.equal(audit.choiceCount, 560)
  assert.equal(audit.choiceTranslationCount, 560)
  assert.equal(audit.choiceExplanationCount, 560)
  assert.deepEqual(audit.issues, [])
  assert.equal(audit.complete, true)
})

test('全問題の徹底解説が設問和訳・正解和訳・選んだ選択肢の和訳を示す', () => {
  let paths = 0

  for (const passage of PASSAGES) {
    for (const question of getReadingQuestions(passage.id)) {
      const correctExplanation = buildReadingInstructorExplanation(question, question.answer)
      assert.match(correctExplanation.answer, new RegExp(question.questionJa.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      assert.match(correctExplanation.answer, new RegExp(question.answerJa.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      assert.match(correctExplanation.evidence, new RegExp(question.explain.replace(/[。.!！?？]+$/u, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      paths += 1

      for (const choice of question.choices.filter((item) => item !== question.answer)) {
        const wrongExplanation = buildReadingInstructorExplanation(question, choice)
        assert.match(
          wrongExplanation.trap,
          new RegExp(question.choiceTranslations[choice].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
          `${passage.id}: ${choice}`,
        )
        assert.match(
          wrongExplanation.trap,
          new RegExp(question.answerJa.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
          `${passage.id}: ${choice}`,
        )
        paths += 1
      }
    }
  }

  assert.equal(paths, 560)
})

test('答え合わせ後の全選択肢解説は英語・和訳・正誤理由を一対一で返す', () => {
  let choices = 0

  for (const passage of PASSAGES) {
    for (const question of getReadingQuestions(passage.id)) {
      const detail = buildReadingChoiceExplanations(question)
      assert.equal(detail.question.en, question.q)
      assert.equal(detail.question.ja, question.questionJa)
      assert.equal(detail.choices.length, question.choices.length)

      for (const [index, choice] of question.choices.entries()) {
        const translated = detail.choices[index]
        assert.equal(translated.en, choice)
        assert.equal(translated.ja, question.choiceTranslations[choice])
        assert.equal(translated.correct, choice === question.answer)
        assert.match(translated.explanation, /[ぁ-んァ-ヶ一-龠]/)
        choices += 1
      }
    }
  }

  assert.equal(choices, 560)
})

test('読解チェック画面は答え合わせ後に設問と全選択肢の和訳解説を接続する', () => {
  const checkSource = readFileSync(
    new URL('../src/components/ReadingComprehensionCheck.jsx', import.meta.url),
    'utf8',
  )
  const choiceSource = readFileSync(
    new URL('../src/components/ReadingChoiceExplanations.jsx', import.meta.url),
    'utf8',
  )

  assert.match(checkSource, /<ReadingChoiceExplanations/)
  assert.match(checkSource, /selectedChoice=\{answers\[questionIndex\]\}/)
  assert.match(choiceSource, /data-reading-question-translation/)
  assert.match(choiceSource, /data-reading-choice-translation/)
  assert.match(choiceSource, /設問・全選択肢の和訳解説/)
  assert.match(choiceSource, /この設問では不正解/)
})
