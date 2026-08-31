import {
  DIAGNOSTIC_LEVELS,
  DIAGNOSTIC_QUESTION_COUNT,
  DIAGNOSTIC_READING_BANK,
  diagnosticDifficulty,
} from '../data/diagnostic.js'
import { GRAMMAR } from '../data/grammar.js'
import {
  grammarQuestionExplanationFor,
  grammarQuestionNeedsMeaningCue,
} from './grammarQuestionExplanations.js'
import { PHRASES } from '../data/phrases.js'
import { etymologyCardsForWord, pickDistractors, wordsByLevel } from '../data/vocab.js'
import { pickPhraseDistractors } from './session.js'
import { limitQuizChoices, QUIZ_CHOICE_COUNT } from './quizChoices.js'

// 端末ごとの seed と受験回数から同じ問題列を再現できるようにする。
// 一度並べた候補を受験回数で順送りするため、単なる乱数抽選と違い、
// 候補を一巡するまでは同じ級・分野の問題が重ならない。
function hashString(value) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededRandom(seed) {
  let value = seed >>> 0
  return () => {
    value = (value + 0x6d2b79f5) >>> 0
    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

function rngFor(seed, key) {
  return seededRandom(hashString(`${seed >>> 0}:${key}`))
}

function shuffle(values, rng) {
  const result = [...values]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function uniqueBy(values, keyFor) {
  const seen = new Set()
  return values.filter((value) => {
    const key = keyFor(value)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function pickForAttempt(pool, seed, key, attemptNumber) {
  if (!pool.length) throw new Error(`診断問題の候補がありません: ${key}`)
  const ordered = shuffle(pool, rngFor(seed, `pool:${key}`))
  return ordered[(attemptNumber - 1) % ordered.length]
}

// 出題は「3択＋わからない」にそろえる。正解は必ず残す。
function shuffledChoices(choices, answer, seed, sourceId, attemptNumber) {
  return shuffle(
    limitQuizChoices(choices, answer, { seed: sourceId }),
    rngFor(seed, `choices:${sourceId}:${attemptNumber}`),
  )
}

function baseQuestion({
  id,
  sourceId,
  skill,
  level,
  prompt,
  promptJa,
  meaningCueRequired,
  choices,
  answer,
  explain,
  passage,
  passageJa,
  review,
}) {
  return {
    id,
    sourceId,
    skill,
    level,
    difficulty: diagnosticDifficulty(level, skill),
    ...(passage ? { passage } : {}),
    ...(passageJa ? { passageJa } : {}),
    ...(promptJa ? { promptJa } : {}),
    ...(typeof meaningCueRequired === 'boolean' ? { meaningCueRequired } : {}),
    ...(review ? { review } : {}),
    prompt,
    choices,
    answer,
    explain,
  }
}

function vocabQuestion(level, attemptNumber, seed) {
  const pool = uniqueBy(
    wordsByLevel(level).filter((word) => word.id && word.word && word.meaning),
    (word) => `${word.word}\u0000${word.meaning}`,
  )
  const word = pickForAttempt(pool, seed, `vocab:${level}`, attemptNumber)
  const sourceId = `vocab:${word.id}`
  const distractors = pickDistractors(
    word,
    QUIZ_CHOICE_COUNT - 1,
    rngFor(seed, `vocab-distractors:${word.id}:${attemptNumber}`),
  )
  const choices = uniqueBy(
    [word.meaning, ...distractors.map((item) => item.meaning)],
    (meaning) => meaning,
  )
  if (choices.length !== QUIZ_CHOICE_COUNT) {
    throw new Error(`単語診断の選択肢を${QUIZ_CHOICE_COUNT}件作れません: ${word.id}`)
  }
  const reviewedCard = etymologyCardsForWord(word)[0]
  return baseQuestion({
    id: `diag-v-${word.id}`,
    sourceId,
    skill: 'vocab',
    level,
    prompt: `“${word.word}” の意味として最も近いものは？`,
    choices: shuffledChoices(choices, word.meaning, seed, sourceId, attemptNumber),
    answer: word.meaning,
    explain: [
      `${word.word} は「${word.meaning}」という意味です。`,
      reviewedCard
        ? `語源カードでは ${reviewedCard.rootForm} を「${reviewedCard.rootMeaning}」として学びます。`
        : null,
    ].filter(Boolean).join(' '),
    review: word.example,
  })
}

function grammarQuestion(level, attemptNumber, seed) {
  const pool = uniqueBy(
    GRAMMAR.filter((item) => (
      item.level === level
      && item.id
      && item.q
      && Array.isArray(item.choices)
      && item.choices.length === 4
      && new Set(item.choices).size === 4
      && item.choices.includes(item.answer)
    )),
    (item) => `${item.q}\u0000${item.answer}`,
  )
  const item = pickForAttempt(pool, seed, `grammar:${level}`, attemptNumber)
  const sourceId = `grammar:${item.id}`
  return baseQuestion({
    id: `diag-g-${item.id}`,
    sourceId,
    skill: 'grammar',
    level,
    prompt: item.q,
    promptJa: item.sentence.ja,
    meaningCueRequired: grammarQuestionNeedsMeaningCue(item),
    choices: shuffledChoices(item.choices, item.answer, seed, sourceId, attemptNumber),
    answer: item.answer,
    explain: grammarQuestionExplanationFor(item),
    review: item.sentence,
  })
}

function phraseQuestion(level, attemptNumber, seed) {
  const pool = uniqueBy(
    PHRASES.filter((item) => item.level === level && item.id && item.phrase && item.meaning),
    (item) => `${item.phrase}\u0000${item.meaning}`,
  )
  const item = pickForAttempt(pool, seed, `usage:${level}`, attemptNumber)
  const sourceId = `phrase:${item.id}`
  const distractors = pickPhraseDistractors(
    item,
    QUIZ_CHOICE_COUNT - 1,
    rngFor(seed, `usage-distractors:${item.id}:${attemptNumber}`),
  )
  const choices = [item.meaning, ...distractors.map((candidate) => candidate.meaning)]
  if (choices.length !== QUIZ_CHOICE_COUNT) {
    throw new Error(`熟語診断の選択肢を${QUIZ_CHOICE_COUNT}件作れません: ${item.id}`)
  }
  return baseQuestion({
    id: `diag-u-${item.id}`,
    sourceId,
    skill: 'usage',
    level,
    prompt: `“${item.phrase}” の意味として最も近いものは？`,
    choices: shuffledChoices(choices, item.meaning, seed, sourceId, attemptNumber),
    answer: item.meaning,
    explain: [item.origin, item.note].filter(Boolean).join(' '),
    review: item.example,
  })
}

function readingQuestion(level, attemptNumber, seed) {
  const pool = DIAGNOSTIC_READING_BANK.filter((item) => item.level === level)
  const item = pickForAttempt(pool, seed, `reading:${level}`, attemptNumber)
  const sourceId = `reading:${item.id}`
  return baseQuestion({
    id: item.id,
    sourceId,
    skill: 'reading',
    level,
    passage: item.passage,
    passageJa: item.passageJa,
    prompt: item.prompt,
    choices: shuffledChoices(item.choices, item.answer, seed, sourceId, attemptNumber),
    answer: item.answer,
    explain: item.explain,
  })
}

export function buildDiagnosticQuestions({
  attemptNumber = 1,
  seed = 0,
} = {}) {
  const normalizedAttempt = Number.isInteger(attemptNumber) && attemptNumber > 0
    ? attemptNumber
    : 1
  const normalizedSeed = Number.isInteger(seed) ? seed >>> 0 : 0
  const questions = []

  for (const level of DIAGNOSTIC_LEVELS) {
    questions.push(
      vocabQuestion(level.id, normalizedAttempt, normalizedSeed),
      grammarQuestion(level.id, normalizedAttempt, normalizedSeed),
      phraseQuestion(level.id, normalizedAttempt, normalizedSeed),
      readingQuestion(level.id, normalizedAttempt, normalizedSeed),
    )
  }

  if (questions.length !== DIAGNOSTIC_QUESTION_COUNT) {
    throw new Error(`診断問題数が不正です: ${questions.length}`)
  }
  return questions
}
