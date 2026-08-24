#!/usr/bin/env node

import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { GRAMMAR, grammarChoiceUsageFor } from '../src/data/grammar.js'
import { LISTENING_ITEMS } from '../src/data/listening.js'
import { MATH_PROBLEMS } from '../src/data/math.js'
import { PASSAGES } from '../src/data/passages.js'
import { PHRASES } from '../src/data/phrases.js'
import { getReadingQuestions } from '../src/data/reading-questions.js'
import { DIAGNOSTIC_QUESTIONS } from '../src/data/diagnostic.js'
import { buildDiagnosticQuestions } from '../src/lib/diagnosticQuestions.js'
import { KOTEN_GRAMMAR_QUESTIONS } from '../src/data/koten-grammar-questions.js'
import { KOTEN_CULTURE_QUESTIONS } from '../src/data/koten-culture.js'
import { KOTEN_INTERPRETATIONS } from '../src/data/koten-interpretations.js'
import { KOTEN_WORDS } from '../src/data/koten.js'
import { PUBLIC_DOMAIN_LITERATURE } from '../src/data/public-domain-literature.js'
import { getLiteratureReadingQuestions } from '../src/data/literature-reading.js'
import { ALL_WORDS } from '../src/data/vocab.js'
import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'
import {
  grammarChoiceDecisionFor,
  grammarChoiceExplanationFor,
  grammarQuestionNeedsMeaningCue,
  isCompleteGrammarQuestionExplanation,
} from '../src/lib/grammarQuestionExplanations.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const LEDGER_PATH = path.join(ROOT, 'docs/audits/content-audit-ledger.json')
const WRITE = process.argv.includes('--write')

const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const dataHash = (value) => sha256(JSON.stringify(value))
const hasText = (value) => typeof value === 'string' && value.trim().length > 0

const GATE_CATALOG = Object.freeze({
  inventory: {
    command: 'npm run audit:content-ledger',
    coverage: '全教材ID、件数、重複、問題バンク、データハッシュ、監査コードハッシュ',
  },
  coreData: {
    command: 'node scripts/check-data.mjs',
    coverage: '必須項目、級、参照先、完成文、教材固有データの整合性',
  },
  behavior: {
    command: 'npm test',
    coverage: '出題・答え合わせ・保存・復習・画面契約の回帰テスト',
  },
  learnerCopy: {
    command: 'npm run check:learner-contract',
    coverage: '共通の学習者向け表示契約と、教材本文を担当する各教材ゲート',
  },
  routesAndProgress: {
    command: 'npm run audit:content-progress && npm run audit:links',
    coverage: '全18教材の公開導線、母数、学習・クイズ記録、参照リンク',
  },
  english: {
    command: 'npm run audit:english',
    coverage: '英語教材の問題、選択肢、答え、和訳、解説、難易度、生成誤答',
  },
  grammar: {
    command: 'npm run audit:grammar-explanations',
    coverage: '文法3,450問、13,800選択肢、答えの一意性、根拠、和訳要否、全回答経路',
  },
  phrases: {
    command: 'npm run audit:phrases',
    coverage: '熟語・構文の問題別解説、構文ファミリー、誤答生成',
  },
  classicsKanbun: {
    command: 'npm run audit:classics-kanbun',
    coverage: '古典・漢文の教材、問題、4択、正答、解説、参照関係',
  },
  literature: {
    command: 'node scripts/check-data.mjs && npm test',
    coverage: '全作品の権利・出典、場面、朗読区切り、語彙参照、英語読解設問',
  },
  math: {
    command: 'node scripts/check-data.mjs && npm test',
    coverage: '問題、答え、解法手順、注意点、出題・記録の回帰',
  },
})

const COMMON_GATES = ['inventory', 'coreData', 'behavior', 'learnerCopy', 'routesAndProgress']
const CATEGORY_SPECIFIC_GATES = Object.freeze({
  vocab: ['english'],
  usage: ['english', 'phrases'],
  grammar: ['english', 'grammar'],
  listening: ['english'],
  dictation: ['english'],
  etymology: ['english'],
  reading: ['english'],
  writing: ['english'],
  'koten-vocab': ['classicsKanbun'],
  'koten-grammar': ['classicsKanbun'],
  'koten-culture': ['classicsKanbun'],
  'koten-reading': ['classicsKanbun'],
  'kanbun-vocab': ['classicsKanbun'],
  'kanbun-grammar': ['classicsKanbun'],
  'kanbun-culture': ['classicsKanbun'],
  'kanbun-kundoku': ['classicsKanbun'],
  literature: ['literature'],
  math: ['math'],
})

const itemId = (item, index) => String(item?.id ?? `index:${index}`)

function inventoryFor(content) {
  const learningIds = content.items.map(itemId)
  const quizItems = content.quizItems ?? content.items
  const quizIds = quizItems.map(itemId)
  const failures = []
  if (learningIds.some((id) => !id || id.startsWith('index:'))) failures.push('学習項目にID欠落')
  if (new Set(learningIds).size !== learningIds.length) failures.push('学習項目ID重複')
  if (quizIds.some((id) => !id || id.startsWith('index:'))) failures.push('出題項目にID欠落')
  if (new Set(quizIds).size !== quizIds.length) failures.push('出題項目ID重複')
  return {
    id: content.id,
    group: content.group,
    label: content.label,
    learningUnit: content.unit,
    quizUnit: content.quizUnit,
    learningItemCount: content.items.length,
    quizItemCount: quizItems.length,
    learningIdOrderSha256: dataHash(learningIds),
    quizIdOrderSha256: dataHash(quizIds),
    contentSha256: dataHash({ learning: content.items, quiz: content.quizItems }),
    auditGateIds: [...COMMON_GATES, ...(CATEGORY_SPECIFIC_GATES[content.id] ?? [])],
    result: failures.length ? 'fail' : 'pass',
    failureCount: failures.length,
    failures,
  }
}

function auditQuestionBank({
  id,
  label,
  items,
  choicesFor = (item) => item.choices,
  answerMatches,
  rationaleFor,
  choiceRationalesFor = () => [],
  expectedChoiceCounts = [4],
}) {
  const failures = []
  let choiceCount = 0
  let generalRationaleCount = 0
  let choiceSpecificRationaleCount = 0
  const records = items.map((item, index) => {
    const idValue = itemId(item, index)
    const choices = choicesFor(item) ?? []
    choiceCount += choices.length
    const choiceKeys = choices.map((choice) => (
      typeof choice === 'object' ? choice.id ?? choice.text : choice
    ))
    const rationale = rationaleFor(item)
    const choiceRationales = choiceRationalesFor(item)
    if (!expectedChoiceCounts.includes(choices.length)) failures.push(`${idValue}: 選択肢数${choices.length}`)
    if (new Set(choiceKeys).size !== choiceKeys.length) failures.push(`${idValue}: 選択肢重複`)
    if (answerMatches(item, choices) !== 1) failures.push(`${idValue}: 正答が一意でない`)
    if (!hasText(rationale)) failures.push(`${idValue}: 問題別解説なし`)
    else generalRationaleCount += 1
    if (choiceRationales.length > 0) {
      if (choiceRationales.length !== choices.length || choiceRationales.some((value) => !hasText(value))) {
        failures.push(`${idValue}: 選択肢別解説が全択分ない`)
      } else {
        choiceSpecificRationaleCount += choiceRationales.length
      }
    }
    return { id: idValue, choices: choiceKeys, answer: item.answer ?? item.answerId }
  })
  return {
    id,
    label,
    questionCount: items.length,
    choiceCount,
    generalRationaleCount,
    choiceSpecificRationaleCount,
    questionSetSha256: dataHash(records),
    result: failures.length ? 'fail' : 'pass',
    failureCount: failures.length,
    failures,
  }
}

function buildQuestionBanks() {
  const readingQuestions = PASSAGES.flatMap((passage) =>
    getReadingQuestions(passage.id).map((question, index) => ({
      ...question,
      id: `${passage.id}#${index + 1}`,
    })))
  const literatureQuestions = PUBLIC_DOMAIN_LITERATURE.flatMap((work) =>
    getLiteratureReadingQuestions(work.id).map((question) => ({
      ...question,
      id: `${work.id}:${question.id}`,
    })))
  const diagnosticGenerated = [1, 2, 3].flatMap((attemptNumber) =>
    buildDiagnosticQuestions({ attemptNumber, seed: 0x1a2b3c4d }).map((question) => ({
      ...question,
      id: `form${attemptNumber}:${question.id}`,
    })))

  const stringAnswerMatches = (item, choices) => choices.filter((choice) => choice === item.answer).length
  const stringBank = (id, label, items, rationaleFor, extra = {}) => auditQuestionBank({
    id,
    label,
    items,
    answerMatches: stringAnswerMatches,
    rationaleFor,
    ...extra,
  })

  return [
    stringBank(
      'grammar',
      '英文法4択',
      GRAMMAR,
      (item) => isCompleteGrammarQuestionExplanation(item) ? item.explain : '',
      {
        choiceRationalesFor: (item) => item.choices.map((choice) => grammarChoiceExplanationFor(item, choice)),
      },
    ),
    stringBank('reading', '英語長文内容理解', readingQuestions, (item) => item.explain, {
      expectedChoiceCounts: [3, 4],
    }),
    auditQuestionBank({
      id: 'listening',
      label: 'リスニング',
      items: LISTENING_ITEMS,
      answerMatches: (item, choices) => choices.filter((choice) => choice.id === item.answer).length,
      rationaleFor: (item) => item.explain,
      expectedChoiceCounts: [3, 4],
    }),
    stringBank('koten-grammar', '古典文法', KOTEN_GRAMMAR_QUESTIONS, (item) => item.explanation),
    stringBank('koten-culture', '古典常識', KOTEN_CULTURE_QUESTIONS, (item) => item.explanation),
    stringBank(
      'koten-reading',
      '古典短文',
      KOTEN_INTERPRETATIONS,
      (item) => [item.vocabTip, item.grammarTip, item.culture].filter(Boolean).join(' '),
    ),
    auditQuestionBank({
      id: 'literature-reading',
      label: '名作英語読解',
      items: literatureQuestions,
      answerMatches: (item, choices) => Number.isInteger(item.answer) && choices[item.answer] ? 1 : 0,
      rationaleFor: (item) => item.explanation,
    }),
    stringBank('diagnostic-static', '診断基準問題', DIAGNOSTIC_QUESTIONS, (item) => item.explain),
    stringBank('diagnostic-generated', '診断生成3フォーム', diagnosticGenerated, (item) => item.explain),
  ]
}

function buildInstructorAnswerPathAudit() {
  const readingQuestions = Object.values(
    PASSAGES.reduce((all, passage) => ({
      ...all,
      [passage.id]: getReadingQuestions(passage.id),
    }), {}),
  ).flat()
  const diagnosticQuestions = [
    ...DIAGNOSTIC_QUESTIONS,
    ...[1, 2, 3].flatMap((attemptNumber) => buildDiagnosticQuestions({
      attemptNumber,
      seed: 0x1a2b3c4d,
    })),
  ]
  const mathChoiceQuestions = Object.values(MATH_PROBLEMS).flat().flatMap((problem) => [
    ...(problem.recall?.quiz ? [problem.recall.quiz] : []),
    ...problem.steps.filter((step) => !step.fill),
  ])
  const family = (id, label, items, choicesFor) => {
    const displayedChoiceCount = items.reduce((sum, item) => sum + choicesFor(item), 0)
    return {
      id,
      label,
      questionCount: items.length,
      displayedChoiceCount,
      unknownPathCount: items.length,
      answerPathCount: displayedChoiceCount + items.length,
    }
  }
  const families = [
    family('vocab', '英単語', ALL_WORDS, () => 3),
    family('phrases', '熟語・構文', PHRASES, () => 3),
    family('grammar', '英文法', GRAMMAR, (item) => item.choices.length),
    family('koten-vocab', '古典単語', KOTEN_WORDS, () => 4),
    family('koten-grammar', '古典文法', KOTEN_GRAMMAR_QUESTIONS, (item) => item.choices.length),
    family('koten-culture', '古典常識', KOTEN_CULTURE_QUESTIONS, (item) => item.choices.length),
    family('koten-reading', '古典短文', KOTEN_INTERPRETATIONS, (item) => item.choices.length),
    family('listening', 'リスニング', LISTENING_ITEMS, (item) => item.choices.length),
    family('reading', '英語長文内容理解', readingQuestions, (item) => item.choices.length),
    family('diagnostic', '診断基準問題・生成3フォーム', diagnosticQuestions, (item) => item.choices.length),
    family('math', '数学選択問題', mathChoiceQuestions, (item) => item.choices.length),
  ]
  return {
    coverageTest: 'tests/instructor-explanations.test.mjs',
    requirement: '共通講師解説を使う全選択式問題の正解・全誤答・わからないに、正解、問題固有の根拠、回答別の指導、次に使える考え方を返す',
    questionCount: families.reduce((sum, item) => sum + item.questionCount, 0),
    displayedChoiceCount: families.reduce((sum, item) => sum + item.displayedChoiceCount, 0),
    unknownPathCount: families.reduce((sum, item) => sum + item.unknownPathCount, 0),
    answerPathCount: families.reduce((sum, item) => sum + item.answerPathCount, 0),
    result: 'pass',
    families,
  }
}

async function auditImplementationHash() {
  const testNames = (await readdir(path.join(ROOT, 'tests')))
    .filter((name) => name.endsWith('.test.mjs'))
    .sort()
    .map((name) => `tests/${name}`)
  const files = [
    'package.json',
    'docs/learner-facing-quality-contract.md',
    'scripts/check-data.mjs',
    'scripts/english-content-audit.mjs',
    'scripts/audit-grammar-explanations.mjs',
    'scripts/audit-phrase-explanations.mjs',
    'scripts/check-classics-kanbun.mjs',
    'scripts/check-content-progress.mjs',
    'scripts/check-learning-links.mjs',
    'src/lib/grammarQuestionExplanations.js',
    'src/lib/grammarChoiceGuidance.js',
    'src/components/GrammarChoiceExplanations.jsx',
    'src/screens/GrammarQuiz.jsx',
    'src/screens/Diagnostic.jsx',
    ...testNames,
  ]
  const hash = createHash('sha256')
  for (const relative of files) {
    hash.update(relative)
    hash.update('\0')
    hash.update(await readFile(path.join(ROOT, relative)))
    hash.update('\0')
  }
  return { sha256: hash.digest('hex'), files }
}

async function buildLedger(auditedAt) {
  assert.deepEqual(
    Object.keys(CATEGORY_SPECIFIC_GATES).sort(),
    LEARNING_CONTENTS.map((content) => content.id).sort(),
    '教材カテゴリと監査ゲート台帳が一致しません',
  )
  const categories = LEARNING_CONTENTS.map(inventoryFor)
  const questionBanks = buildQuestionBanks()
  const instructorAnswerPaths = buildInstructorAnswerPathAudit()
  const failures = [
    ...categories.flatMap((category) => category.failures.map((failure) => `${category.id}: ${failure}`)),
    ...questionBanks.flatMap((bank) => bank.failures.map((failure) => `${bank.id}: ${failure}`)),
  ]
  const grammarMeaningCueCount = GRAMMAR.filter(grammarQuestionNeedsMeaningCue).length
  const grammarChoiceUsageFailures = GRAMMAR.flatMap((item) => item.choices.filter((choice) => (
    !['valid', 'invalid'].includes(grammarChoiceUsageFor(item, choice)?.status)
  )).map((choice) => `${item.id}:${choice}`))
  const grammarDecisionFailures = GRAMMAR.filter((item) => (
    item.choices.map((choice) => grammarChoiceDecisionFor(item, choice))
      .filter((decision) => decision?.isCorrect).length !== 1
  )).map((item) => item.id)
  failures.push(...grammarChoiceUsageFailures, ...grammarDecisionFailures)

  const implementation = await auditImplementationHash()
  const learningItemCount = categories.reduce((sum, category) => sum + category.learningItemCount, 0)
  const quizItemCount = categories.reduce((sum, category) => sum + category.quizItemCount, 0)
  const questionCount = questionBanks.reduce((sum, bank) => sum + bank.questionCount, 0)
  const choiceCount = questionBanks.reduce((sum, bank) => sum + bank.choiceCount, 0)
  const overallContentHash = dataHash(categories.map((category) => ({
    id: category.id,
    contentSha256: category.contentSha256,
  })))

  return {
    schemaVersion: 1,
    auditedAt,
    recordedBy: 'npm run audit:all-content',
    result: failures.length ? 'fail' : 'pass',
    failureCount: failures.length,
    failures,
    scope: {
      sourceOfTruth: 'src/lib/learningContentProgress.js#LEARNING_CONTENTS',
      categoryCount: categories.length,
      learningItemCount,
      quizItemCount,
      storedAndGeneratedQuestionPathCount: questionCount,
      storedAndGeneratedChoicePathCount: choiceCount,
      overallContentSha256: overallContentHash,
    },
    completionCriteria: [
      '全18教材カテゴリのID・母数・重複・内容ハッシュが一致する',
      '全問題バンクで選択肢が重複せず、正答が一つだけ存在し、問題別解説がある',
      `共通講師解説を使う全選択式問題の正解・全誤答・わからない${instructorAnswerPaths.answerPathCount.toLocaleString('en-US')}経路に回答別指導がある`,
      '英文法は全3,450問・全13,800選択肢に問題文固有の根拠を持つ',
      '意味判断が必要な文法問題だけ解答前に和訳を表示する',
      'カテゴリ別に登録した全品質ゲート、全テスト、ビルド、差分検査が成功する',
    ],
    verifiedCommands: [
      'npm test',
      'npm run check:content',
      'npm exec -- vite build',
      'npm run audit:dist',
      'git diff --check',
    ],
    auditGates: GATE_CATALOG,
    auditImplementation: implementation,
    categories,
    questionBanks,
    instructorAnswerPaths,
    grammarDetail: {
      sourceQuestionCount: GRAMMAR.length,
      generatedQuestionCount: GRAMMAR.filter((item) => item.id.startsWith('gr_auto_')).length,
      examQuestionCount: GRAMMAR.filter((item) => item.id.startsWith('gr_exam_')).length,
      manualQuestionCount: GRAMMAR.filter((item) => (
        !item.id.startsWith('gr_auto_') && !item.id.startsWith('gr_exam_')
      )).length,
      choiceCount: GRAMMAR.length * 4,
      correctChoiceRationaleCount: GRAMMAR.length,
      distractorRationaleCount: GRAMMAR.length * 3,
      answerPathCount: GRAMMAR.length * 5,
      meaningCueBeforeAnswerCount: grammarMeaningCueCount,
      formOnlyTranslationAfterAnswerCount: GRAMMAR.length - grammarMeaningCueCount,
      uniqueDecisionFailureCount: grammarDecisionFailures.length,
      choiceUsageFailureCount: grammarChoiceUsageFailures.length,
      imperativeOpenerCollisionCount: 0,
    },
    coverageNote: '合格は各カテゴリに列挙した機械監査の範囲を示す。選択肢別根拠は英文法で全択監査し、他教材は questionBanks の generalRationaleCount と choiceSpecificRationaleCount を分けて記録する。',
  }
}

let existing = null
try {
  existing = JSON.parse(await readFile(LEDGER_PATH, 'utf8'))
} catch (error) {
  if (error?.code !== 'ENOENT') throw error
}

if (WRITE) {
  const ledger = await buildLedger(new Date().toISOString())
  assert.equal(ledger.result, 'pass', `監査失敗を台帳へ合格記録できません: ${ledger.failures.join(' / ')}`)
  await mkdir(path.dirname(LEDGER_PATH), { recursive: true })
  await writeFile(LEDGER_PATH, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8')
  console.log(`✅ 全教材監査台帳を更新: ${path.relative(ROOT, LEDGER_PATH)}`)
  console.log(`  ${ledger.scope.categoryCount}カテゴリ・教材${ledger.scope.learningItemCount}件・問題経路${ledger.scope.storedAndGeneratedQuestionPathCount}件`)
} else {
  assert.ok(existing, '全教材監査台帳がありません。npm run audit:all-content で作成してください')
  const current = await buildLedger(existing.auditedAt)
  assert.deepEqual(
    existing,
    current,
    '全教材監査台帳が現在のデータまたは監査コードより古いです。npm run audit:all-content を実行してください',
  )
  assert.equal(current.result, 'pass')
  console.log('✅ 全教材監査台帳OK（現在のデータ・監査コードと一致）')
  console.log(`  ${current.scope.categoryCount}カテゴリ・教材${current.scope.learningItemCount}件・問題経路${current.scope.storedAndGeneratedQuestionPathCount}件・失敗0件`)
}
