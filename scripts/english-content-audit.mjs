#!/usr/bin/env node

// 英語アプリの全問題を、画面に実際に出る形まで含めて検査する品質ゲート。
// 件数を固定値で決め打ちせず、現行データから毎回導出する。

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import {
  ALL_WORDS,
  pickDistractors,
} from '../src/data/vocab.js'
import { quizMeaningKey } from '../src/data/compact.js'
import {
  GRAMMAR,
  grammarChoiceGuidanceFor,
  samePatternExamplesFor,
} from '../src/data/grammar.js'
import { GRAMMAR_LESSONS } from '../src/data/grammar-lessons.js'
import { PHRASES } from '../src/data/phrases.js'
import { pickPhraseDistractors } from '../src/lib/session.js'
import { PASSAGES } from '../src/data/passages.js'
import { getReadingQuestions } from '../src/data/reading-questions.js'
import {
  DICTATION_ITEMS,
  DICTATION_PROFILES,
} from '../src/data/dictation.js'
import {
  LISTENING_ITEMS,
  LISTENING_PROFILES,
} from '../src/data/listening.js'
import {
  WRITING_EXERCISES,
  WRITING_GRAMMAR_BY_ID,
  WRITING_LEVEL_PROFILES,
} from '../src/data/writing.js'
import {
  recommendedWritingTrail,
  writingCompletion,
} from '../src/lib/writing.js'
import {
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_READING_BANK,
} from '../src/data/diagnostic.js'
import { buildDiagnosticQuestions } from '../src/lib/diagnosticQuestions.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const LEVEL_ORDER = ['5', '4', '3', 'pre2', '2', 'pre1', '1']
const READING_LEVEL_ORDER = ['5', '4', '3', 'pre2', 'pre2plus', '2', 'pre1', '1']
const errors = []

const text = (value) => typeof value === 'string' && value.trim().length > 0
const hasEnglish = (value) => /[A-Za-z]/.test(value ?? '')
const hasJapanese = (value) => /[\u3040-\u30ff\u3400-\u9fff]/.test(value ?? '')
const wordCount = (value) =>
  (value?.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*/g) ?? []).length
const average = (values) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
const round = (value) => Math.round(value * 10) / 10

function assert(condition, message) {
  if (!condition) errors.push(message)
}

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

function rngFor(id, seed) {
  return seededRandom(hashString(`${seed}:${id}`))
}

function countsByLevel(items, order) {
  return Object.fromEntries(
    order
      .map((level) => [level, items.filter((item) => item.level === level).length])
      .filter(([, count]) => count > 0),
  )
}

function averageWordsByLevel(items, order, englishFor) {
  return Object.fromEntries(
    order.map((level) => {
      const values = items
        .filter((item) => item.level === level)
        .map((item) => wordCount(englishFor(item)))
      return [level, round(average(values))]
    }),
  )
}

function averageLettersByLevel(items, order, englishFor) {
  return Object.fromEntries(
    order.map((level) => {
      const values = items
        .filter((item) => item.level === level)
        .map((item) => (englishFor(item).match(/[A-Za-z]/g) ?? []).length)
      return [level, round(average(values))]
    }),
  )
}

function assertIncreasing(label, valuesByLevel, order) {
  for (let index = 1; index < order.length; index += 1) {
    const lower = order[index - 1]
    const upper = order[index]
    const lowerValue = valuesByLevel[lower]
    const upperValue = valuesByLevel[upper]
    assert(
      Number.isFinite(lowerValue) &&
        Number.isFinite(upperValue) &&
        upperValue > lowerValue,
      `${label}: ${upper}級の平均負荷 ${upperValue} が下位 ${lower}級 ${lowerValue} 以下`,
    )
  }
}

// ── 問題バンクの全件と、英文・和訳・解説 ─────────────────────────────

for (const word of ALL_WORDS) {
  const at = `語彙 ${word.id}`
  assert(text(word.id) && text(word.word), `${at}: id/word 不足`)
  assert(text(word.meaning) && text(word.meanings?.[0]), `${at}: 語義不足`)
  assert(hasEnglish(word.example?.en), `${at}: 英語例文不足`)
  assert(text(word.example?.ja), `${at}: 例文和訳不足`)
  assert(
    text(word.etymology?.note) || (word.etymology?.parts?.length ?? 0) > 0,
    `${at}: 誤答後の覚え方となる語源説明不足`,
  )
  assert(hasJapanese(word.etymology?.note), `${at}: 語源説明に日本語不足`)
}

let vocabSameLevelChoiceSets = 0
let vocabSameFieldChoiceSets = 0
for (const word of ALL_WORDS) {
  for (const seed of [17, 101, 20260729]) {
    const distractors = pickDistractors(word, 2, rngFor(word.id, seed))
    const choices = [word, ...distractors]
    assert(distractors.length === 2, `語彙 ${word.id}: 誤答選択肢を2件作れない`)
    assert(
      new Set(choices.map(quizMeaningKey)).size === choices.length,
      `語彙 ${word.id}: 画面表示上の語義が重複`,
    )
    assert(
      distractors.every((candidate) => candidate.pos === word.pos),
      `語彙 ${word.id}: 品詞だけで判別できる誤答を生成`,
    )
    if (seed === 17) {
      if (distractors.every((candidate) => candidate.level === word.level)) {
        vocabSameLevelChoiceSets += 1
      }
      if (distractors.every((candidate) => candidate.field === word.field)) {
        vocabSameFieldChoiceSets += 1
      }
    }
  }
  const diagnosticDistractors = pickDistractors(word, 3, rngFor(word.id, 314159))
  assert(
    diagnosticDistractors.length === 3,
    `語彙 ${word.id}: 診断用の誤答選択肢を3件作れない`,
  )
  assert(
    diagnosticDistractors.every((candidate) => candidate.pos === word.pos),
    `語彙 ${word.id}: 診断で品詞だけから判別できる誤答を生成`,
  )
  assert(
    new Set([word, ...diagnosticDistractors].map(quizMeaningKey)).size === 4,
    `語彙 ${word.id}: 診断の画面表示上の語義が重複`,
  )
}

for (const item of GRAMMAR) {
  const at = `文法 ${item.id}`
  assert(hasEnglish(item.q), `${at}: 問題英文不足`)
  assert(item.choices?.length === 4, `${at}: 4択ではない`)
  assert(new Set(item.choices).size === 4, `${at}: 選択肢重複`)
  assert(item.choices?.includes(item.answer), `${at}: 正答が選択肢にない`)
  assert(hasEnglish(item.sentence?.en), `${at}: 完成英文不足`)
  assert(hasJapanese(item.sentence?.ja), `${at}: 完成文の和訳不足`)
  assert(text(item.explain), `${at}: 正答根拠の解説不足`)
  const examples = samePatternExamplesFor(item, 2)
  assert(examples.length === 2, `${at}: 同じ形の比較例が2文未満`)
  assert(
    examples.every((example) => hasEnglish(example.en) && hasJapanese(example.ja)),
    `${at}: 同じ形の例に英文/和訳不足`,
  )
  for (const choice of item.choices.filter((value) => value !== item.answer)) {
    const guidance = grammarChoiceGuidanceFor(item, choice)
    assert(
      ['valid', 'invalid'].includes(guidance?.status),
      `${at}: 誤答「${choice}」の使い分けが未解決`,
    )
    assert(
      hasJapanese(guidance?.summary),
      `${at}: 誤答「${choice}」の日本語説明不足`,
    )
  }
}

for (const item of PHRASES) {
  const at = `熟語・構文 ${item.id}`
  assert(hasEnglish(item.phrase), `${at}: 見出し英文不足`)
  assert(text(item.meaning) && text(item.meanings?.[0]), `${at}: 語義不足`)
  assert(hasEnglish(item.example?.en), `${at}: 英語例文不足`)
  assert(hasJapanese(item.example?.ja), `${at}: 例文和訳不足`)
  assert(text(item.origin) && text(item.note), `${at}: 成り立ち/使い方の解説不足`)
}

let phraseSameLevelChoiceSets = 0
for (const item of PHRASES) {
  for (const seed of [17, 101, 20260729]) {
    const distractors = pickPhraseDistractors(item, 2, rngFor(item.id, seed))
    const choices = [item, ...distractors]
    assert(distractors.length === 2, `熟語・構文 ${item.id}: 誤答選択肢を2件作れない`)
    assert(
      new Set(choices.map(quizMeaningKey)).size === choices.length,
      `熟語・構文 ${item.id}: 画面表示上の語義が重複`,
    )
    assert(
      distractors.every((candidate) => candidate.kind === item.kind),
      `熟語・構文 ${item.id}: 種別だけで判別できる誤答を生成`,
    )
    if (
      seed === 17 &&
      distractors.every((candidate) => candidate.level === item.level)
    ) {
      phraseSameLevelChoiceSets += 1
    }
  }
  const diagnosticDistractors = pickPhraseDistractors(
    item,
    3,
    rngFor(item.id, 314159),
  )
  assert(
    diagnosticDistractors.length === 3,
    `熟語・構文 ${item.id}: 診断用の誤答選択肢を3件作れない`,
  )
  assert(
    diagnosticDistractors.every((candidate) => candidate.kind === item.kind),
    `熟語・構文 ${item.id}: 診断で種別だけから判別できる誤答を生成`,
  )
  assert(
    new Set([item, ...diagnosticDistractors].map(quizMeaningKey)).size === 4,
    `熟語・構文 ${item.id}: 診断の画面表示上の語義が重複`,
  )
}

const readingQuestions = []
for (const passage of PASSAGES) {
  passage.sentences.forEach((sentence, index) => {
    assert(hasEnglish(sentence.en), `長文 ${passage.id} 第${index + 1}文: 英文不足`)
    assert(hasJapanese(sentence.ja), `長文 ${passage.id} 第${index + 1}文: 和訳不足`)
  })
  getReadingQuestions(passage.id).forEach((question, index) => {
    const at = `長文 ${passage.id} 問${index + 1}`
    readingQuestions.push({ ...question, id: `${passage.id}#${index + 1}`, level: passage.level })
    assert(hasEnglish(question.q), `${at}: 設問英文不足`)
    assert(question.choices?.length >= 3, `${at}: 選択肢不足`)
    assert(new Set(question.choices).size === question.choices.length, `${at}: 選択肢重複`)
    assert(question.choices?.includes(question.answer), `${at}: 正答が選択肢にない`)
    assert(hasJapanese(question.explain), `${at}: 日本語の根拠解説不足`)
  })
}

for (const item of LISTENING_ITEMS) {
  const at = `リスニング ${item.id}`
  assert(item.audio.every((segment) => hasEnglish(segment.text)), `${at}: 放送英文不足`)
  assert(hasEnglish(item.question), `${at}: 設問英文不足`)
  assert(hasJapanese(item.questionJa), `${at}: 設問和訳不足`)
  assert(hasJapanese(item.explain), `${at}: 日本語の聞き取り根拠不足`)
  assert(item.choices.every((choice) => hasEnglish(choice.text)), `${at}: 選択肢英文不足`)
  assert(new Set(item.choices.map((choice) => choice.text)).size === item.choices.length, `${at}: 選択肢重複`)
  assert(item.choices.some((choice) => choice.id === item.answer), `${at}: 正答が選択肢にない`)
}

for (const item of DICTATION_ITEMS) {
  const at = `ディクテーション ${item.id}`
  assert(hasEnglish(item.text), `${at}: 英文不足`)
  assert(hasJapanese(item.ja), `${at}: 和訳不足`)
  assert(text(item.focus), `${at}: 聞き取り・文法解説の焦点不足`)
}

const writingOptions = []
for (const exercise of WRITING_EXERCISES) {
  for (const step of exercise.steps) {
    for (const option of step.options) {
      const at = `英作文 ${exercise.id}/${step.id}/${option.id}`
      writingOptions.push({ ...option, id: at, level: exercise.level })
      assert(hasEnglish(option.text), `${at}: 英文不足`)
      assert(hasJapanese(option.ja), `${at}: 和訳不足`)
      assert(hasJapanese(option.tip), `${at}: 語順・文法解説不足`)
      const grammar = WRITING_GRAMMAR_BY_ID[option.grammarId]
      assert(grammar, `${at}: 文法カード ${option.grammarId} がない`)
      assert(
        !grammar ||
          (
            text(grammar.explanation) &&
            hasEnglish(grammar.example?.en) &&
            hasJapanese(grammar.example?.ja)
          ),
        `${at}: 文法カードの解説または英文/和訳不足`,
      )
    }
  }
}

for (const item of DIAGNOSTIC_QUESTIONS) {
  const at = `診断基準 ${item.id}`
  assert(item.choices?.length === 4, `${at}: 4択ではない`)
  assert(new Set(item.choices).size === 4, `${at}: 選択肢重複`)
  assert(item.choices?.includes(item.answer), `${at}: 正答が選択肢にない`)
  assert(text(item.explain), `${at}: 解説不足`)
  assert(
    item.skill === 'reading'
      ? hasJapanese(item.passageJa)
      : hasEnglish(item.review?.en) && hasJapanese(item.review?.ja),
    `${at}: 答え合わせ用の英文/和訳不足`,
  )
}

for (const item of DIAGNOSTIC_READING_BANK) {
  const at = `診断読解 ${item.id}`
  assert(hasEnglish(item.passage), `${at}: 本文不足`)
  assert(hasJapanese(item.passageJa), `${at}: 本文和訳不足`)
  assert(hasJapanese(item.explain), `${at}: 根拠解説不足`)
  assert(item.choices.includes(item.answer), `${at}: 正答が選択肢にない`)
}

const diagnosticForms = [1, 2, 3].flatMap((attemptNumber) =>
  buildDiagnosticQuestions({ attemptNumber, seed: 0x1a2b3c4d }))
for (const item of diagnosticForms) {
  const at = `生成診断 ${item.id}`
  assert(item.choices?.length === 4, `${at}: 4択ではない`)
  assert(new Set(item.choices).size === 4, `${at}: 選択肢重複`)
  assert(item.choices?.includes(item.answer), `${at}: 正答が選択肢にない`)
  assert(text(item.explain), `${at}: 解説不足`)
  assert(
    item.skill === 'reading'
      ? hasJapanese(item.passageJa)
      : hasEnglish(item.review?.en) && text(item.review?.ja),
    `${at}: 答え合わせ用の英文/和訳不足`,
  )
  if (item.skill === 'usage') {
    const source = PHRASES.find((phrase) => `phrase:${phrase.id}` === item.sourceId)
    assert(source, `${at}: 元の熟語・構文が見つからない`)
    assert(
      !source || item.choices.every((choice) =>
        choice === item.answer ||
        PHRASES.some((phrase) =>
          phrase.kind === source.kind && phrase.meaning === choice)),
      `${at}: 熟語と完成文型を混ぜた誤答がある`,
    )
  }
}

// ── 難易度の段階性 ───────────────────────────────────────────────────

const vocabDifficulty = averageLettersByLevel(
  ALL_WORDS,
  LEVEL_ORDER,
  (item) => item.word,
)
const grammarDifficulty = averageWordsByLevel(
  GRAMMAR,
  LEVEL_ORDER,
  (item) => item.sentence.en,
)
const phraseDifficulty = averageWordsByLevel(
  PHRASES,
  LEVEL_ORDER,
  (item) => item.example.en,
)
const readingDifficulty = averageWordsByLevel(
  PASSAGES,
  READING_LEVEL_ORDER,
  (item) => item.sentences.map((sentence) => sentence.en).join(' '),
)
const listeningDifficulty = averageWordsByLevel(
  LISTENING_ITEMS,
  READING_LEVEL_ORDER,
  (item) => item.audio.map((segment) => segment.text).join(' '),
)
const dictationDifficulty = averageWordsByLevel(
  DICTATION_ITEMS,
  LEVEL_ORDER,
  (item) => item.text,
)
const diagnosticDifficulty = averageWordsByLevel(
  DIAGNOSTIC_READING_BANK,
  LEVEL_ORDER,
  (item) => item.passage,
)
const writingDifficulty = Object.fromEntries(
  LEVEL_ORDER.map((level) => {
    const completions = WRITING_EXERCISES
      .filter((exercise) => exercise.level === level)
      .map((exercise) => writingCompletion(exercise, recommendedWritingTrail(exercise)))
    for (const completion of completions) {
      const [minimum, maximum] = WRITING_LEVEL_PROFILES[level].wordRange
      assert(
        completion.wordCount >= minimum && completion.wordCount <= maximum,
        `英作文 ${level}級: おすすめルート${completion.wordCount}語が設計範囲${minimum}〜${maximum}語外`,
      )
    }
    return [level, round(average(completions.map((item) => item.wordCount)))]
  }),
)

assertIncreasing('英文法', grammarDifficulty, LEVEL_ORDER)
assertIncreasing('熟語・構文', phraseDifficulty, LEVEL_ORDER)
assertIncreasing('長文', readingDifficulty, READING_LEVEL_ORDER)
assertIncreasing('リスニング', listeningDifficulty, READING_LEVEL_ORDER)
assertIncreasing('ディクテーション', dictationDifficulty, LEVEL_ORDER)
assertIncreasing('英作文', writingDifficulty, LEVEL_ORDER)
assertIncreasing('診断読解', diagnosticDifficulty, LEVEL_ORDER)
const basicVocabDifficulty = average(LEVEL_ORDER.slice(0, 3).map((level) => vocabDifficulty[level]))
const intermediateVocabDifficulty = average(LEVEL_ORDER.slice(3, 5).map((level) => vocabDifficulty[level]))
const advancedVocabDifficulty = average(LEVEL_ORDER.slice(5).map((level) => vocabDifficulty[level]))
assert(
  basicVocabDifficulty < intermediateVocabDifficulty &&
    intermediateVocabDifficulty < advancedVocabDifficulty,
  `語彙: 見出し語の平均長が基礎→中級→上級で段階化されていない`,
)

for (const level of LEVEL_ORDER) {
  assert(
    ALL_WORDS.some((item) => item.level === level),
    `語彙: ${level}級の問題がない`,
  )
  assert(DICTATION_PROFILES[level], `ディクテーション: ${level}級の難易度設計がない`)
  assert(LISTENING_PROFILES[level], `リスニング: ${level}級の難易度設計がない`)
}
assert(
  LISTENING_PROFILES.pre2plus,
  'リスニング: 準2級プラスの難易度設計がない',
)

// ── 習熟導線 ─────────────────────────────────────────────────────────

const sourceChecks = [
  ['VocabQuiz.jsx', [/\breview\(/, /UnknownChoiceButton/, /word\.example\.en/, /buildVocabInstructorExplanation/]],
  ['GrammarQuiz.jsx', [/\breview\(/, /UnknownChoiceButton/, /buildGrammarInstructorExplanation/, /patternExamples/]],
  ['PhraseQuiz.jsx', [/\breview\(/, /UnknownChoiceButton/, /buildPhraseInstructorExplanation/, /InstructorExplanation/]],
  ['ListeningQuiz.jsx', [/\breview\(/, /UnknownChoiceButton/, /item\.questionJa/, /buildListeningInstructorExplanation/]],
  ['DictationPlay.jsx', [/\breview\(/, /positionResults/, /item\.ja/, /buildDictationInstructorExplanation/]],
  ['ReadingSummary.jsx', [/markReadingDone\(/, /recordSkillResult\(/, /UnknownChoiceButton/, /buildReadingInstructorExplanation/]],
  ['WritingPlay.jsx', [/recordWritingCompletion\(/, /writingTokenPositionResults/, /buildWritingInstructorExplanation/, /toggleMyGrammar/]],
  ['Diagnostic.jsx', [/recordDiagnosticResult\(/, /data-diagnostic-explanation/, /buildDiagnosticInstructorExplanation/, /question\.review/]],
]
for (const [filename, patterns] of sourceChecks) {
  const source = readFileSync(`${ROOT}/src/screens/${filename}`, 'utf8')
  for (const pattern of patterns) {
    assert(pattern.test(source), `習熟導線 ${filename}: ${pattern} がない`)
  }
}

// ── 集計 ─────────────────────────────────────────────────────────────

const sections = [
  ['語彙クイズ候補', ALL_WORDS, LEVEL_ORDER],
  ['英文法', GRAMMAR, LEVEL_ORDER],
  ['熟語・構文', PHRASES, LEVEL_ORDER],
  ['長文内容理解', readingQuestions, READING_LEVEL_ORDER],
  ['リスニング', LISTENING_ITEMS, READING_LEVEL_ORDER],
  ['ディクテーション', DICTATION_ITEMS, LEVEL_ORDER],
  ['英作文の一文ルート', writingOptions, LEVEL_ORDER],
  ['診断専用読解', DIAGNOSTIC_READING_BANK, LEVEL_ORDER],
]
const totalQuestionUnits = sections.reduce((sum, [, items]) => sum + items.length, 0)
const lessonKeys = new Set(GRAMMAR_LESSONS.map((lesson) => `${lesson.level}\0${lesson.topic}`))
const grammarWithLesson = GRAMMAR.filter((item) =>
  lessonKeys.has(`${item.level}\0${item.topic}`)).length

console.log('英語問題 全件監査')
console.log('='.repeat(68))
for (const [label, items, order] of sections) {
  console.log(`${label.padEnd(14)} ${String(items.length).padStart(6)}件  ${JSON.stringify(countsByLevel(items, order))}`)
}
console.log('-'.repeat(68))
console.log(`問題単位 合計       ${totalQuestionUnits}件`)
console.log('  ※診断の単語・文法・熟語は共有バンクから生成するため、重複加算していません。')
console.log('')
console.log('難易度（語彙は平均文字数、ほかは級別の平均英語語数）')
console.log(`  語彙         ${JSON.stringify(vocabDifficulty)}`)
console.log(`  英文法       ${JSON.stringify(grammarDifficulty)}`)
console.log(`  熟語・構文   ${JSON.stringify(phraseDifficulty)}`)
console.log(`  長文         ${JSON.stringify(readingDifficulty)}`)
console.log(`  リスニング   ${JSON.stringify(listeningDifficulty)}`)
console.log(`  ディクテーション ${JSON.stringify(dictationDifficulty)}`)
console.log(`  英作文       ${JSON.stringify(writingDifficulty)}`)
console.log(`  診断読解     ${JSON.stringify(diagnosticDifficulty)}`)
console.log('')
console.log('品質・習熟カバレッジ')
console.log(`  語彙の同級誤答2件: ${vocabSameLevelChoiceSets}/${ALL_WORDS.length}`)
console.log(`  語彙の同分野誤答2件: ${vocabSameFieldChoiceSets}/${ALL_WORDS.length}`)
console.log(`  熟語・構文の同級誤答2件: ${phraseSameLevelChoiceSets}/${PHRASES.length}`)
console.log(`  文法の即時解説＋同型例2文: ${GRAMMAR.length}/${GRAMMAR.length}`)
console.log(`  文法の誤答別使い分け解説: ${GRAMMAR.length * 3}/${GRAMMAR.length * 3}`)
console.log(`  文法の長形式レッスン接続: ${grammarWithLesson}/${GRAMMAR.length}`)
console.log(`  診断3フォームの解説＋英文/和訳: ${diagnosticForms.length}/${diagnosticForms.length}`)
console.log(`  習熟導線: SRS・わからない・即時フィードバック・弱点復習を主要8画面で確認`)

if (errors.length) {
  console.error(`\n❌ 英語問題 全件監査 失敗（${errors.length}件）`)
  errors.slice(0, 60).forEach((error) => console.error(`  - ${error}`))
  if (errors.length > 60) console.error(`  …ほか${errors.length - 60}件`)
  process.exit(1)
}

console.log(`\n✅ 英語問題 全件監査OK: ${totalQuestionUnits}件 / エラー0件`)
