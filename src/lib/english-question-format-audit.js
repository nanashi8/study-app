import {
  GRAMMAR,
  GRAMMAR_PRACTICE,
  getGrammar,
  grammarChoiceGuidanceFor,
  grammarChoiceUsageFor,
} from '../data/grammar.js'
import {
  GRAMMAR_FORMAT_EXPANSION,
  GRAMMAR_QUESTION_TYPES,
  grammarQuestionType,
} from '../data/grammar-format-expansion.js'
import { CURRENT_AFFAIRS_PASSAGES } from '../data/reading-current-affairs-passages.js'
import {
  ALL_READING_PRACTICE_QUESTIONS,
  CURRENT_AFFAIRS_READING_PRACTICE_QUESTIONS,
} from '../data/reading-current-affairs-practice-questions.js'
import { CURRENT_AFFAIRS_READING_WORD_DEFINITIONS } from '../data/reading-current-affairs-word-definitions.js'
import { READING_RULES_BY_ID } from '../data/reading-rules.js'
import { getWord } from '../data/vocab.js'
import { buildGrammarDeck } from './grammarDeck.js'
import {
  isWritingTokenOrderCorrect,
  shuffledWritingTokens,
  writingWordTokens,
} from './writing.js'

const EXPECTED_READING_LEVELS = Object.freeze([
  '5', '4', '3', 'pre2', 'pre2plus', '2', 'pre1', '1',
])
const EXPECTED_CURRENT_AFFAIRS_DOMAINS = Object.freeze([
  '環境・エネルギー',
  '教育・労働',
  '地域・公共政策',
  '科学・情報',
])
const GRAMMAR_LEVELS = Object.freeze(['5', '4', '3', 'pre2', '2', 'pre1', '1'])
const READING_PRACTICE_TYPES = Object.freeze(['word-order', 'grammar', 'usage'])
const hasJapanese = (value = '') => /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(value)
const countBy = (items, keyFor) => Object.fromEntries(
  [...new Set(items.map(keyFor))].sort().map((key) => [
    key,
    items.filter((item) => keyFor(item) === key).length,
  ]),
)
const blankCount = (value = '') => value.split('___').length - 1

const seededRng = (seed) => {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / (2 ** 32)
  }
}

export function auditEnglishQuestionFormats() {
  const issues = []
  const addIssue = (type, id, detail = '') => issues.push({ type, id, detail })

  const passageIds = CURRENT_AFFAIRS_PASSAGES.map((passage) => passage.id)
  const passageIdSet = new Set(passageIds)
  const practiceIds = ALL_READING_PRACTICE_QUESTIONS.map((question) => question.id)
  const newReadingWordIds = new Set(
    CURRENT_AFFAIRS_READING_WORD_DEFINITIONS.map((word) => word.id),
  )
  const readingVocabIds = CURRENT_AFFAIRS_PASSAGES.flatMap((passage) => passage.vocab)
  const existingReadingVocabIds = readingVocabIds.filter((id) => !newReadingWordIds.has(id))
  const uniqueReadingVocabIds = new Set(readingVocabIds)
  const uniqueExistingReadingVocabIds = new Set(existingReadingVocabIds)

  if (passageIds.length !== 8) addIssue('reading-passage-count', 'current-affairs', passageIds.length)
  if (new Set(passageIds).size !== passageIds.length) addIssue('duplicate-reading-passage-id', 'current-affairs')
  if (new Set(CURRENT_AFFAIRS_PASSAGES.map((passage) => passage.theme)).size !== 8) {
    addIssue('duplicate-current-affairs-theme', 'current-affairs')
  }
  const actualLevels = new Set(CURRENT_AFFAIRS_PASSAGES.map((passage) => passage.level))
  for (const level of EXPECTED_READING_LEVELS) {
    if (!actualLevels.has(level)) addIssue('missing-reading-level', level)
  }

  const domainCounts = countBy(CURRENT_AFFAIRS_PASSAGES, (passage) => passage.currentAffairsDomain)
  for (const domain of EXPECTED_CURRENT_AFFAIRS_DOMAINS) {
    if (domainCounts[domain] !== 2) {
      addIssue('unbalanced-current-affairs-domain', domain, domainCounts[domain] ?? 0)
    }
  }
  for (const domain of Object.keys(domainCounts)) {
    if (!EXPECTED_CURRENT_AFFAIRS_DOMAINS.includes(domain)) {
      addIssue('unexpected-current-affairs-domain', domain, domainCounts[domain])
    }
  }

  if (readingVocabIds.length === 0 || existingReadingVocabIds.length / readingVocabIds.length < 0.9) {
    addIssue(
      'insufficient-existing-vocabulary-ratio',
      'current-affairs',
      `${existingReadingVocabIds.length}/${readingVocabIds.length}`,
    )
  }

  for (const passage of CURRENT_AFFAIRS_PASSAGES) {
    if (!hasJapanese(passage.titleJa) || !hasJapanese(passage.blurb)) {
      addIssue('missing-reading-japanese', passage.id)
    }
    if (passage.sentences.length < 10) addIssue('short-current-affairs-passage', passage.id, passage.sentences.length)
    if (passage.sentences.some((sentence) => !sentence.en?.trim() || !hasJapanese(sentence.ja))) {
      addIssue('incomplete-current-affairs-sentence', passage.id)
    }
    const existingCount = passage.vocab.filter((id) => !newReadingWordIds.has(id)).length
    if (passage.vocab.length === 0 || existingCount / passage.vocab.length < 0.85) {
      addIssue('passage-existing-vocabulary-ratio', passage.id, `${existingCount}/${passage.vocab.length}`)
    }
    for (const vocabId of passage.vocab) {
      if (!getWord(vocabId)) addIssue('unresolved-reading-vocabulary', passage.id, vocabId)
    }

    const passageQuestions = CURRENT_AFFAIRS_READING_PRACTICE_QUESTIONS[passage.id] ?? []
    if (passageQuestions.length !== 3) {
      addIssue('reading-practice-count-per-passage', passage.id, passageQuestions.length)
    }
    for (const type of READING_PRACTICE_TYPES) {
      const count = passageQuestions.filter((question) => question.questionType === type).length
      if (count !== 1) addIssue('reading-practice-type-per-passage', passage.id, `${type}:${count}`)
    }

    const sourceJaByEn = new Map(passage.sentences.map((sentence) => [sentence.en, sentence.ja]))
    const passageVocab = new Set(passage.vocab)
    for (const question of passageQuestions) {
      if (sourceJaByEn.get(question.sourceSentence) !== question.sourceJa) {
        addIssue('reading-practice-source-mismatch', question.id)
      }
      if (!READING_RULES_BY_ID[question.readingRuleId]) {
        addIssue('unresolved-reading-rule', question.id, question.readingRuleId)
      }
      if (!hasJapanese(question.questionJa) || !hasJapanese(question.explain)) {
        addIssue('incomplete-reading-practice-explanation', question.id)
      }
      if (!question.vocabIds?.length) addIssue('missing-reading-practice-vocabulary', question.id)
      for (const vocabId of question.vocabIds ?? []) {
        if (!getWord(vocabId)) addIssue('unresolved-reading-practice-vocabulary', question.id, vocabId)
        if (!passageVocab.has(vocabId)) addIssue('unlisted-reading-practice-vocabulary', question.id, vocabId)
      }

      if (question.questionType === 'word-order') {
        const tokenCount = writingWordTokens(question.answer).length
        if (question.choices.length !== 0 || question.answer !== question.sourceSentence) {
          addIssue('invalid-reading-word-order-answer', question.id)
        }
        if (tokenCount < 5 || tokenCount > 16) {
          addIssue('reading-word-order-length', question.id, tokenCount)
        }
        if (isWritingTokenOrderCorrect(
          shuffledWritingTokens(question.answer, question.id),
          question.answer,
        )) addIssue('reading-word-order-starts-solved', question.id)
        continue
      }

      if (blankCount(question.q) !== 1 || question.q.replace('___', question.answer) !== question.sourceSentence) {
        addIssue('reading-choice-does-not-rebuild-source', question.id)
      }
      if (question.choices.length !== 4 || new Set(question.choices).size !== 4) {
        addIssue('invalid-reading-practice-choices', question.id, question.choices.length)
      }
      if (question.choices.filter((choice) => choice === question.answer).length !== 1) {
        addIssue('non-unique-reading-practice-answer', question.id)
      }
      for (const choice of question.choices) {
        if (!hasJapanese(question.choiceTranslations?.[choice])) {
          addIssue('missing-reading-choice-translation', question.id, choice)
        }
        if (!hasJapanese(question.choiceNotes?.[choice])) {
          addIssue('missing-reading-choice-reason', question.id, choice)
        }
      }
    }
  }

  for (const id of Object.keys(CURRENT_AFFAIRS_READING_PRACTICE_QUESTIONS)) {
    if (!passageIdSet.has(id)) addIssue('orphan-reading-practice-passage', id)
  }
  if (practiceIds.length !== 24) addIssue('reading-practice-total', 'current-affairs', practiceIds.length)
  if (new Set(practiceIds).size !== practiceIds.length) addIssue('duplicate-reading-practice-id', 'current-affairs')
  const readingTypeCounts = countBy(ALL_READING_PRACTICE_QUESTIONS, (question) => question.questionType)
  for (const type of READING_PRACTICE_TYPES) {
    if (readingTypeCounts[type] !== 8) {
      addIssue('unbalanced-reading-practice-type', type, readingTypeCounts[type] ?? 0)
    }
  }
  const readingRuleCount = new Set(
    ALL_READING_PRACTICE_QUESTIONS.map((question) => question.readingRuleId),
  ).size
  if (readingRuleCount < 10) addIssue('insufficient-reading-rule-variety', 'current-affairs', readingRuleCount)

  const expansionIds = GRAMMAR_FORMAT_EXPANSION.map((item) => item.id)
  const allGrammarIds = GRAMMAR_PRACTICE.map((item) => item.id)
  if (GRAMMAR.length !== 3450) addIssue('legacy-grammar-count-changed', 'grammar', GRAMMAR.length)
  if (GRAMMAR_FORMAT_EXPANSION.length !== 105) {
    addIssue('grammar-format-expansion-total', 'grammar', GRAMMAR_FORMAT_EXPANSION.length)
  }
  if (GRAMMAR_PRACTICE.length !== 3555) addIssue('grammar-practice-total', 'grammar', GRAMMAR_PRACTICE.length)
  if (new Set(expansionIds).size !== expansionIds.length) addIssue('duplicate-format-expansion-id', 'grammar')
  if (new Set(allGrammarIds).size !== allGrammarIds.length) addIssue('duplicate-grammar-practice-id', 'grammar')
  if (new Set(GRAMMAR_PRACTICE.map((item) => item.sentence.en)).size !== GRAMMAR_PRACTICE.length) {
    addIssue('duplicate-grammar-completed-sentence', 'grammar')
  }

  const grammarTypeCounts = countBy(GRAMMAR_FORMAT_EXPANSION, grammarQuestionType)
  for (const type of GRAMMAR_QUESTION_TYPES) {
    if (grammarTypeCounts[type] !== 35) {
      addIssue('unbalanced-grammar-format-type', type, grammarTypeCounts[type] ?? 0)
    }
  }
  const grammarLevelCounts = countBy(GRAMMAR_FORMAT_EXPANSION, (item) => item.level)
  for (const level of GRAMMAR_LEVELS) {
    if (grammarLevelCounts[level] !== 15) {
      addIssue('unbalanced-grammar-format-level', level, grammarLevelCounts[level] ?? 0)
    }
    for (const type of GRAMMAR_QUESTION_TYPES) {
      const count = GRAMMAR_FORMAT_EXPANSION.filter(
        (item) => item.level === level && grammarQuestionType(item) === type,
      ).length
      if (count !== 5) addIssue('grammar-format-level-type-count', level, `${type}:${count}`)
    }
  }

  let grammarChoicePathCount = 0
  let grammarWrongChoicePathCount = 0
  for (const item of GRAMMAR_FORMAT_EXPANSION) {
    const type = grammarQuestionType(item)
    if (getGrammar(item.id) !== item) addIssue('unresolved-grammar-format-item', item.id)
    if (!hasJapanese(item.sentence.ja) || !hasJapanese(item.explain)) {
      addIssue('incomplete-grammar-format-explanation', item.id)
    }

    if (type === 'word-order') {
      const tokenCount = writingWordTokens(item.answer).length
      if (item.choices.length !== 0 || item.answer !== item.sentence.en || !hasJapanese(item.q)) {
        addIssue('invalid-grammar-word-order-item', item.id)
      }
      if (tokenCount < 5 || tokenCount > 12) addIssue('grammar-word-order-length', item.id, tokenCount)
      if (isWritingTokenOrderCorrect(shuffledWritingTokens(item.answer, item.id), item.answer)) {
        addIssue('grammar-word-order-starts-solved', item.id)
      }
      continue
    }

    if (blankCount(item.q) !== 1 || item.q.replace('___', item.answer) !== item.sentence.en) {
      addIssue('grammar-choice-does-not-rebuild-sentence', item.id)
    }
    if (item.choices.length !== 4 || new Set(item.choices).size !== 4) {
      addIssue('invalid-grammar-format-choices', item.id, item.choices.length)
    }
    if (item.choices.filter((choice) => choice === item.answer).length !== 1) {
      addIssue('non-unique-grammar-format-answer', item.id)
    }
    for (const choice of item.choices) {
      grammarChoicePathCount += 1
      const usage = grammarChoiceUsageFor(item, choice)
      if (!usage || usage.status === 'unresolved' || !hasJapanese(usage.summary)) {
        addIssue('incomplete-grammar-choice-usage', item.id, choice)
      }
      if (choice !== item.answer) {
        grammarWrongChoicePathCount += 1
        const guidance = grammarChoiceGuidanceFor(item, choice)
        if (!guidance || guidance.status === 'unresolved' || !hasJapanese(guidance.summary)) {
          addIssue('incomplete-grammar-wrong-choice-guidance', item.id, choice)
        }
      }
    }
  }

  for (const level of GRAMMAR_LEVELS) {
    for (const type of GRAMMAR_QUESTION_TYPES) {
      const deck = buildGrammarDeck(
        { type: 'grammar', level, questionType: type },
        { size: 10, day: 0, rng: seededRng(73) },
      )
      if (deck.length < 5 || deck.some((item) => grammarQuestionType(item) !== type)) {
        addIssue('grammar-filtered-deck', level, `${type}:${deck.length}`)
      }
    }
    for (let seed = 1; seed <= 5; seed += 1) {
      const deck = buildGrammarDeck(
        { type: 'grammar', level, questionType: 'mixed' },
        { size: 10, day: 0, rng: seededRng(seed) },
      )
      const counts = GRAMMAR_QUESTION_TYPES.map(
        (type) => deck.filter((item) => grammarQuestionType(item) === type).length,
      )
      if (deck.length !== 10 || Math.max(...counts) - Math.min(...counts) > 1) {
        addIssue('unbalanced-grammar-mixed-deck', level, `seed${seed}:${counts.join('/')}`)
      }
    }
  }

  return Object.freeze({
    complete: issues.length === 0,
    currentAffairsPassageCount: passageIds.length,
    currentAffairsDomainCounts: Object.freeze(domainCounts),
    readingSentenceCount: CURRENT_AFFAIRS_PASSAGES.reduce(
      (total, passage) => total + passage.sentences.length,
      0,
    ),
    readingVocabOccurrenceCount: readingVocabIds.length,
    existingReadingVocabOccurrenceCount: existingReadingVocabIds.length,
    uniqueReadingVocabCount: uniqueReadingVocabIds.size,
    uniqueExistingReadingVocabCount: uniqueExistingReadingVocabIds.size,
    readingPracticeQuestionCount: practiceIds.length,
    readingPracticeTypeCounts: Object.freeze(readingTypeCounts),
    readingRuleCount,
    legacyGrammarQuestionCount: GRAMMAR.length,
    grammarFormatQuestionCount: GRAMMAR_FORMAT_EXPANSION.length,
    grammarPracticeQuestionCount: GRAMMAR_PRACTICE.length,
    grammarFormatTypeCounts: Object.freeze(grammarTypeCounts),
    grammarFormatLevelCounts: Object.freeze(grammarLevelCounts),
    grammarChoicePathCount,
    grammarWrongChoicePathCount,
    issues: Object.freeze(issues),
  })
}
