import {
  READING_RULE_PHASES,
  READING_RULES,
  READING_RULES_BY_ID,
  readingApproachForPassage,
  readingRuleForQuestion,
  readingRulesForSentence,
} from '../data/reading-rules.js'
import { getReadingQuestions } from '../data/reading-questions.js'
import { getReadingPracticeQuestions } from '../data/reading-current-affairs-practice-questions.js'
import { analyzeReadingSentence } from './reading-grammar.js'

// 読解の準備に出す「この本文で使う読解ルール」。
// 準備で学んだルールが読解でそのまま出会うように、読解画面が文ごと（上位3件）と
// 設問ごとに出すルールを全部集める。読む前に使う「全体を見通す」段のルールは、
// 読解画面の文や設問には出ないので、テーマの読み方が挙げるものと長さで要るものだけを足す。

const PHASE_ORDER = new Map(READING_RULE_PHASES.map((phase, index) => [phase.id, index]))
const RULE_ORDER = new Map(READING_RULES.map((rule, index) => [rule.id, index]))

// 読解画面の文ごとのルールと同じ選び方（ReadingSentenceDetail と同じ引数）。
export function readerSentenceRuleIds(sentence) {
  const structure = analyzeReadingSentence(sentence).structure ?? null
  return readingRulesForSentence(sentence, 3, structure).map((rule) => rule.id)
}

// 読解チェックの設問ごとのルールと同じ選び方（ReadingComprehensionCheck と同じ）。
export function readerQuestionRuleIds(passageId) {
  return [...getReadingQuestions(passageId), ...getReadingPracticeQuestions(passageId)]
    .map((question) => (question.readingRuleId
      ? READING_RULES_BY_ID[question.readingRuleId]
      : readingRuleForQuestion(question.q))?.id)
    .filter(Boolean)
}

// 読解画面で出会う回数（文と設問）をルールごとに数える。
export function readerRuleCounts(passage) {
  const counts = new Map()
  const add = (id) => counts.set(id, (counts.get(id) ?? 0) + 1)
  for (const sentence of passage?.sentences ?? []) readerSentenceRuleIds(sentence).forEach(add)
  readerQuestionRuleIds(passage?.id).forEach(add)
  return counts
}

// 読む前に使う段（全体を見通す）のルール。テーマの読み方が挙げるものと、長い本文で要るもの。
export function prepOrientRuleIds(passage) {
  const approach = readingApproachForPassage(passage)
  const ids = (approach?.ruleIds ?? []).filter((id) => READING_RULES_BY_ID[id]?.phase === 'orient')
  const count = passage?.sentences?.length ?? 0
  if (count >= 20) ids.push('reading-mode')
  if (count >= 28) ids.push('genre-prediction')
  return [...new Set(ids)]
}

// 段の順に並べ、段の中はテーマの読み方の中核ルール→読解画面で出会う回数の多い順。
export function readingPrepRulesForPassage(passage) {
  const counts = readerRuleCounts(passage)
  const approachIds = readingApproachForPassage(passage)?.ruleIds ?? []
  const ids = new Set([...prepOrientRuleIds(passage), ...counts.keys()])
  const coreRank = (id) => {
    const index = approachIds.indexOf(id)
    return index < 0 ? approachIds.length : index
  }
  return [...ids]
    .map((id) => READING_RULES_BY_ID[id])
    .filter(Boolean)
    .sort((a, b) =>
      PHASE_ORDER.get(a.phase) - PHASE_ORDER.get(b.phase) ||
      coreRank(a.id) - coreRank(b.id) ||
      (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0) ||
      RULE_ORDER.get(a.id) - RULE_ORDER.get(b.id))
    .map((rule) => ({ rule, readerCount: counts.get(rule.id) ?? 0 }))
}
