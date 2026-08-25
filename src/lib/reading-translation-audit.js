import { PASSAGES } from '../data/passages.js'
import { READING_QUESTIONS } from '../data/reading-questions.js'
import {
  READING_QUESTION_TRANSLATIONS,
  READING_QUESTION_TRANSLATION_REVIEW_LEDGER,
} from '../data/reading-question-translations.js'
import { reviewSourceFingerprint } from '../data/reading-phrase-review-ledger.js'
import { buildReadingChoiceExplanations } from './instructorExplanations.js'

const hasJapanese = (value = '') => /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(value)
const clean = (value) => `${value ?? ''}`.replace(/\s+/g, ' ').trim()

const questionSourceFingerprint = (questions) => reviewSourceFingerprint(JSON.stringify(
  questions.map(({ q, choices }) => ({ q, choices })),
))

export function auditReadingTranslations() {
  const issues = []
  let sentenceCount = 0
  let sentenceTranslationCount = 0
  let questionCount = 0
  let questionTranslationCount = 0
  let choiceCount = 0
  let choiceTranslationCount = 0
  let choiceExplanationCount = 0
  let evidenceExplanationCount = 0

  const passageIds = new Set(PASSAGES.map((passage) => passage.id))
  const questionPassageIds = new Set(Object.keys(READING_QUESTIONS))
  const translationPassageIds = new Set(Object.keys(READING_QUESTION_TRANSLATIONS))
  const reviewPassageIds = new Set(Object.keys(READING_QUESTION_TRANSLATION_REVIEW_LEDGER))

  for (const passage of PASSAGES) {
    if (!hasJapanese(passage.titleJa)) {
      issues.push({ type: 'missing-passage-title-translation', passageId: passage.id })
    }

    for (const [sentenceIndex, sentence] of passage.sentences.entries()) {
      sentenceCount += 1
      if (hasJapanese(clean(sentence.ja))) sentenceTranslationCount += 1
      else {
        issues.push({
          type: 'missing-sentence-translation',
          passageId: passage.id,
          sentenceIndex,
          source: sentence.en,
        })
      }
    }

    const questions = READING_QUESTIONS[passage.id] ?? []
    const translations = READING_QUESTION_TRANSLATIONS[passage.id] ?? []
    const reviewedFingerprint = READING_QUESTION_TRANSLATION_REVIEW_LEDGER[passage.id]
    const actualFingerprint = questionSourceFingerprint(questions)

    if (questions.length !== translations.length) {
      issues.push({
        type: 'question-translation-count-mismatch',
        passageId: passage.id,
        sourceCount: questions.length,
        translationCount: translations.length,
      })
    }
    if (!reviewedFingerprint || reviewedFingerprint !== actualFingerprint) {
      issues.push({
        type: 'stale-question-translation-review',
        passageId: passage.id,
        expected: reviewedFingerprint,
        actual: actualFingerprint,
      })
    }

    for (const [questionIndex, question] of questions.entries()) {
      const translatedQuestion = translations[questionIndex]
      questionCount += 1
      if (hasJapanese(clean(question.questionJa))) questionTranslationCount += 1
      else {
        issues.push({
          type: 'missing-question-translation',
          passageId: passage.id,
          questionIndex,
          source: question.q,
        })
      }
      if (!/[。？]$/u.test(clean(question.questionJa))) {
        issues.push({
          type: 'invalid-question-translation-ending',
          passageId: passage.id,
          questionIndex,
          source: question.questionJa,
        })
      }
      if (translatedQuestion?.choices?.length !== question.choices.length) {
        issues.push({
          type: 'choice-translation-count-mismatch',
          passageId: passage.id,
          questionIndex,
          sourceCount: question.choices.length,
          translationCount: translatedQuestion?.choices?.length ?? 0,
        })
      }

      if (hasJapanese(clean(question.explain))) evidenceExplanationCount += 1
      else {
        issues.push({
          type: 'missing-question-evidence-explanation',
          passageId: passage.id,
          questionIndex,
          source: question.q,
        })
      }

      const choiceDetails = buildReadingChoiceExplanations(question)
      if (choiceDetails.question.en !== clean(question.q)
        || choiceDetails.question.ja !== clean(question.questionJa)) {
        issues.push({
          type: 'question-explanation-payload-mismatch',
          passageId: passage.id,
          questionIndex,
        })
      }
      if (choiceDetails.choices.length !== question.choices.length) {
        issues.push({
          type: 'choice-explanation-count-mismatch',
          passageId: passage.id,
          questionIndex,
        })
      }
      const translatedChoices = question.choices.map((choice) =>
        clean(question.choiceTranslations?.[choice]))
      if (new Set(translatedChoices).size !== translatedChoices.length) {
        issues.push({
          type: 'duplicate-choice-translations',
          passageId: passage.id,
          questionIndex,
        })
      }

      for (const [choiceIndex, choice] of question.choices.entries()) {
        choiceCount += 1
        const translatedChoice = clean(question.choiceTranslations?.[choice])
        const detail = choiceDetails.choices[choiceIndex]
        if (hasJapanese(translatedChoice)) choiceTranslationCount += 1
        else {
          issues.push({
            type: 'missing-choice-translation',
            passageId: passage.id,
            questionIndex,
            choiceIndex,
            source: choice,
          })
        }
        if (!/[。！？]$/u.test(translatedChoice)) {
          issues.push({
            type: 'invalid-choice-translation-ending',
            passageId: passage.id,
            questionIndex,
            choiceIndex,
            source: translatedChoice,
          })
        }
        const explanationMatchesChoice = detail?.correct
          ? clean(detail?.explanation).includes(clean(question.explain))
          : clean(detail?.explanation).includes(translatedChoice)
            && clean(detail?.explanation).includes(clean(question.answerJa))
            && clean(detail?.explanation).includes(clean(question.explain))
        if (
          detail?.en === clean(choice)
          && detail?.ja === translatedChoice
          && detail?.correct === (choice === question.answer)
          && hasJapanese(clean(detail?.explanation))
          && explanationMatchesChoice
        ) choiceExplanationCount += 1
        else {
          issues.push({
            type: 'invalid-choice-explanation',
            passageId: passage.id,
            questionIndex,
            choiceIndex,
            source: choice,
          })
        }
      }

      if (question.answerJa !== question.choiceTranslations?.[question.answer]) {
        issues.push({
          type: 'answer-translation-mismatch',
          passageId: passage.id,
          questionIndex,
        })
      }
    }
  }

  for (const [setName, ids] of [
    ['questions', questionPassageIds],
    ['translations', translationPassageIds],
    ['translation-review', reviewPassageIds],
  ]) {
    for (const passageId of passageIds) {
      if (!ids.has(passageId)) issues.push({ type: `missing-${setName}-passage`, passageId })
    }
    for (const passageId of ids) {
      if (!passageIds.has(passageId)) issues.push({ type: `orphan-${setName}-passage`, passageId })
    }
  }

  return Object.freeze({
    complete: issues.length === 0,
    passageCount: PASSAGES.length,
    sentenceCount,
    sentenceTranslationCount,
    questionCount,
    questionTranslationCount,
    evidenceExplanationCount,
    choiceCount,
    choiceTranslationCount,
    choiceExplanationCount,
    issues: Object.freeze(issues),
  })
}
