#!/usr/bin/env node

import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { GRAMMAR } from '../src/data/grammar.js'
import { LISTENING_ITEMS } from '../src/data/listening.js'
import { MATH_PROBLEMS } from '../src/data/math.js'
import { MATH_HISTORY_QUESTIONS } from '../src/data/math-history.js'
import { ALL_PASSAGES, PASSAGES } from '../src/data/passages.js'
import { EXTENDED_PASSAGES } from '../src/data/reading-extended-passages.js'
import { EXTENDED_PASSAGE_READING_APPROACHES } from '../src/data/reading-extended-approaches.js'
import { EXTENDED_READING_PRACTICE_QUESTIONS } from '../src/data/reading-extended-practice-questions.js'
import { EXTENDED_READING_QUESTIONS } from '../src/data/reading-extended-questions.js'
import { EXTENDED_READING_STUDY } from '../src/data/reading-extended-study.js'
import { getReadingQuestions } from '../src/data/reading-questions.js'
import { DIAGNOSTIC_QUESTIONS } from '../src/data/diagnostic.js'
import { buildDiagnosticQuestions, diagnosticChoiceNoteFor } from '../src/lib/diagnosticQuestions.js'
import { kotenCultureChoiceNoteFor } from '../src/lib/kotenCultureChoiceNotes.js'
import { kotenGrammarChoiceNoteFor } from '../src/lib/kotenGrammarChoiceNotes.js'
import { kotenInterpretationChoiceNoteFor } from '../src/data/koten-interpretation-choice-notes.js'
import { literatureReadingChoiceNoteFor } from '../src/data/literature-reading-choice-notes.js'
import { listeningChoiceNoteFor } from '../src/data/listening-choice-notes.js'
import { mathChoiceNoteFor } from '../src/data/math-choice-notes.js'
import { mathFillNoteFor } from '../src/data/math-fill-notes.js'
import { KOTEN_GRAMMAR_QUESTIONS } from '../src/data/koten-grammar-questions.js'
import { KOTEN_CULTURE_QUESTIONS } from '../src/data/koten-culture.js'
import { KOTEN_INTERPRETATIONS } from '../src/data/koten-interpretations.js'
import { PUBLIC_DOMAIN_LITERATURE } from '../src/data/public-domain-literature.js'
import { getLiteratureReadingQuestions } from '../src/data/literature-reading.js'
import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'
import {
  grammarQuestionNeedsMeaningCue,
  grammarRuleExplanationFor,
} from '../src/lib/grammarQuestionExplanations.js'
import { grammarChoiceNoteFor } from '../src/lib/grammarChoiceNotes.js'
import { readingChoiceNoteFor } from '../src/lib/readingChoiceNotes.js'
import { auditExtendedReadings } from '../src/lib/extendedReadingAudit.js'

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
    command: 'npm run audit:japanese',
    coverage: '学習者向けUI文言の全件監査（教材本文そのものは各教材ゲート）',
  },
  routesAndProgress: {
    command: 'npm run audit:content-progress && npm run audit:links',
    coverage: '全19教材の公開導線、母数、暗記・テスト記録、参照リンク',
  },
  english: {
    command: 'npm run audit:english',
    coverage: '英語教材の問題、選択肢、答え、和訳、解説、難易度、生成誤答',
  },
  grammar: {
    command: 'npm run audit:grammar-explanations',
    coverage: '文法3,450問、13,800選択肢、答えの一意性、根拠、和訳要否、全回答経路',
  },
  readingTranslations: {
    command: 'npm run audit:reading-translations',
    coverage: '長文32本・794文・140問・560選択肢の和訳、正答、選択肢別解説、原文対応',
  },
  extendedReading: {
    command: 'npm run audit:extended-reading',
    coverage: '語彙強化長文4本・9,860語・1,542文・重点1,484語・内容16問・並び替え4問・文法4問・語法4問・全9,860語の辞書解決・語彙カバー率',
  },
  questionFormats: {
    command: 'npm run audit:question-formats',
    coverage: '時事長文8本の4分野配分・既存語彙・読解ルール、長文32本すべての技能練習96問（並び替え・文法・語法を各32問）と、文法追加105問の3形式・7級配分・全回答経路',
  },
  phrases: {
    command: 'npm run audit:phrases',
    coverage: '熟語・構文の問題別解説、構文ファミリー、誤答生成',
  },
  idiomForms: {
    command: 'npm run audit:idiom-forms',
    coverage: '全1,754熟語の同形分類、比較相手、〜 up・〜 at・〜 with・be 〜 at の全件抽出',
  },
  curriculum1900: {
    command: 'npm run audit:curriculum-1900',
    coverage: '英単語・熟語の全収録目標、重複、割当、固定監査ハッシュ',
  },
  etymology: {
    command: 'npm run audit:etymology-quality',
    coverage: '語源の根拠境界、形成、意味変化、学習表示、全収録語との接続',
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
  mathHistory: {
    command: 'node scripts/checks/math-history.mjs chapters facts && node --test tests/math-history.test.mjs',
    coverage: '数学の歴史の全話の年代・物語・動かす図・今の使われ方・テスト、史実の記録と本文の一致、図の全操作値の描画',
  },
})

const COMMON_GATES = ['inventory', 'coreData', 'behavior', 'learnerCopy', 'routesAndProgress']
const CATEGORY_SPECIFIC_GATES = Object.freeze({
  vocab: ['english', 'curriculum1900', 'etymology'],
  usage: ['english', 'phrases', 'idiomForms', 'curriculum1900'],
  grammar: ['english', 'grammar', 'questionFormats'],
  listening: ['english'],
  dictation: ['english'],
  etymology: ['etymology'],
  reading: ['english', 'readingTranslations', 'extendedReading', 'questionFormats'],
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
  'math-history': ['mathHistory'],
})

const itemId = (item, index) => String(item?.id ?? `index:${index}`)

function inventoryFor(content) {
  const learningIds = content.items.map(itemId)
  const quizItems = content.hasQuiz === false ? [] : content.quizItems ?? content.items
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
    return { id: idValue, choices: choiceKeys, answer: item.answer ?? item.answerId ?? item.fill?.blanks }
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
  const extendedReadingQuestions = EXTENDED_PASSAGES.flatMap((passage) =>
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
  // 診断の答え合わせは、出典つきの文法問題なら文法の選択肢解説、それ以外は選択肢ごとの説明を全択に出す。
  const diagnosticChoiceRationales = (item) => {
    const grammarItem = item.skill === 'grammar' && item.sourceId?.startsWith('grammar:')
      ? GRAMMAR.find((entry) => entry.id === item.sourceId.slice('grammar:'.length))
      : null
    // 生成3フォームは台帳の ID に「formN:」を付けているので、元の問題 ID で説明を引く。
    const question = { ...item, id: String(item.id).replace(/^form\d+:/, '') }
    return item.choices.map((choice) => (grammarItem
      ? grammarChoiceNoteFor(grammarItem, choice)
      : diagnosticChoiceNoteFor(question, choice)))
  }
  // 長文の台帳 ID は「長文ID#設問番号」。画面と同じく、長文IDと設問の並び順で選択肢の説明を引く。
  const readingChoiceRationales = (item) => {
    const id = String(item.id)
    const mark = id.lastIndexOf('#')
    return item.choices.map((choice) => readingChoiceNoteFor(id.slice(0, mark), Number(id.slice(mark + 1)) - 1, choice))
  }
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
      (item) => grammarRuleExplanationFor(item),
      {
        choiceRationalesFor: (item) => item.choices.map((choice) => grammarChoiceNoteFor(item, choice)),
      },
    ),
    stringBank('reading', '英語長文内容理解', readingQuestions, (item) => item.explain, {
      choiceRationalesFor: readingChoiceRationales,
      expectedChoiceCounts: [3, 4],
    }),
    stringBank('extended-reading', '語彙強化長文内容理解', extendedReadingQuestions, (item) => item.explain, {
      choiceRationalesFor: readingChoiceRationales,
      expectedChoiceCounts: [4],
    }),
    auditQuestionBank({
      id: 'listening',
      label: 'リスニング',
      items: LISTENING_ITEMS,
      answerMatches: (item, choices) => choices.filter((choice) => choice.id === item.answer).length,
      rationaleFor: (item) => item.explain,
      choiceRationalesFor: (item) => item.choices.map((choice) => listeningChoiceNoteFor(item, choice.id)),
      expectedChoiceCounts: [3, 4],
    }),
    stringBank('koten-grammar', '古典文法', KOTEN_GRAMMAR_QUESTIONS, (item) => item.explanation, {
      choiceRationalesFor: (item) => item.choices.map((choice) => kotenGrammarChoiceNoteFor(item, choice)),
    }),
    stringBank('koten-culture', '古典常識', KOTEN_CULTURE_QUESTIONS, (item) => item.explanation, {
      choiceRationalesFor: (item) => item.choices.map((choice) => kotenCultureChoiceNoteFor(item, choice)),
    }),
    stringBank(
      'koten-reading',
      '古典短文',
      KOTEN_INTERPRETATIONS,
      (item) => [item.vocabTip, item.grammarTip, item.culture].filter(Boolean).join(' '),
      { choiceRationalesFor: (item) => item.choices.map((choice) => kotenInterpretationChoiceNoteFor(item, choice)) },
    ),
    auditQuestionBank({
      id: 'literature-reading',
      label: '名作英語読解',
      items: literatureQuestions,
      answerMatches: (item, choices) => Number.isInteger(item.answer) && choices[item.answer] ? 1 : 0,
      rationaleFor: (item) => item.explanation,
      choiceRationalesFor: (item) => item.choices.map((_, index) => literatureReadingChoiceNoteFor(item, index)),
    }),
    stringBank('diagnostic-static', '診断基準問題', DIAGNOSTIC_QUESTIONS, (item) => item.explain, {
      choiceRationalesFor: diagnosticChoiceRationales,
    }),
    // 出題は「3択＋わからない」。教材データは4択のままで、組み立て時に絞る。
    stringBank('diagnostic-generated', '診断生成3フォーム', diagnosticGenerated, (item) => item.explain, {
      expectedChoiceCounts: [3],
      choiceRationalesFor: diagnosticChoiceRationales,
    }),
    // 数学の方針の確認と選択式のステップ。ID は画面と同じ「問題ID:recall」「問題ID:step:番号」。
    auditQuestionBank({
      id: 'math-choice',
      label: '数学選択問題',
      items: Object.values(MATH_PROBLEMS).flat().flatMap((problem) => [
        ...(problem.recall?.quiz ? [{ ...problem.recall.quiz, id: `${problem.id}:recall` }] : []),
        ...problem.steps.flatMap((step, index) => (step.fill ? [] : [{ ...step, id: `${problem.id}:step:${index}` }])),
      ]),
      answerMatches: (item, choices) => Number.isInteger(item.answer) && choices[item.answer] ? 1 : 0,
      rationaleFor: (item) => item.why ?? item.note,
      choiceRationalesFor: (item) => item.choices.map((_, index) => mathChoiceNoteFor(item.id, index)),
      expectedChoiceCounts: [2, 3],
    }),
    // 数学の穴埋め。選択肢はタイル、正答は空所に入るタイルの組（全部がタイルにあること）。ID は画面と同じ「問題ID:step:番号」。
    auditQuestionBank({
      id: 'math-fill',
      label: '数学穴埋め',
      items: Object.values(MATH_PROBLEMS).flat().flatMap((problem) => (
        problem.steps.flatMap((step, index) => (step.fill ? [{ ...step, id: `${problem.id}:step:${index}` }] : []))
      )),
      choicesFor: (item) => item.fill.tiles,
      answerMatches: (item, choices) => (item.fill.blanks.every((blank) => choices.includes(blank)) ? 1 : 0),
      rationaleFor: (item) => item.note,
      choiceRationalesFor: (item) => item.fill.tiles.map((_, index) => mathFillNoteFor(item.id, index)),
      expectedChoiceCounts: [2, 3, 4],
    }),
    // 数学の歴史の話のテスト。3択（＋わからない）で、選択肢と同じ順の説明（notes）を全択に持つ。
    auditQuestionBank({
      id: 'math-history',
      label: '数学の歴史',
      items: MATH_HISTORY_QUESTIONS,
      answerMatches: (item, choices) => (Number.isInteger(item.answer) && choices[item.answer] ? 1 : 0),
      rationaleFor: (item) => item.explanation,
      choiceRationalesFor: (item) => item.notes,
      expectedChoiceCounts: [3],
    }),
  ]
}

function buildReadingAnswerPathAudit() {
  const readingEntries = ALL_PASSAGES.flatMap((passage) =>
    getReadingQuestions(passage.id).map((question, index) => ({
      id: `${passage.id}#${index + 1}`,
      question,
      noteFor: (choice) => readingChoiceNoteFor(passage.id, index, choice),
    })))
  const diagnosticEntries = [
    ...DIAGNOSTIC_QUESTIONS,
    ...[1, 2, 3].flatMap((attemptNumber) => buildDiagnosticQuestions({
      attemptNumber,
      seed: 0x1a2b3c4d,
    })),
  ]
    .filter(({ skill }) => skill === 'reading')
    .map((question) => ({
      id: question.id,
      question,
      noteFor: (choice) => diagnosticChoiceNoteFor(question, choice),
    }))
  const family = (id, label, entries) => {
    const failures = entries.flatMap(({ id: questionId, question, noteFor }) => [
      ...(hasText(question.explain) ? [] : [`${questionId}: 根拠の解説なし`]),
      ...question.choices
        .filter((choice) => !hasText(noteFor(choice)))
        .map((choice) => `${questionId}:${choice}: 選択肢の説明なし`),
    ])
    const displayedChoiceCount = entries.reduce((sum, { question }) => sum + question.choices.length, 0)
    return {
      id,
      label,
      questionCount: entries.length,
      explanationCount: entries.filter(({ question }) => hasText(question.explain)).length,
      displayedChoiceCount,
      choiceNoteCount: entries.reduce((sum, { question, noteFor }) => (
        sum + question.choices.filter((choice) => hasText(noteFor(choice))).length
      ), 0),
      unknownPathCount: entries.length,
      answerPathCount: displayedChoiceCount + entries.length,
      failures,
    }
  }
  // 正解・誤答・わからないのどれを選んでも、同じ根拠の解説と出題した選択肢すべての説明を出す。
  const families = [
    family('reading', '英語長文内容理解', readingEntries),
    family('diagnostic', '診断の読解（基準問題・生成3フォーム）', diagnosticEntries),
  ]
  const failures = families.flatMap((item) => item.failures)
  return {
    coverageTest: 'tests/reading-question-translations.test.mjs',
    requirement: '英語長文と学習診断の読解は、正解・全誤答・わからないのどれでも、本文の根拠を示す解説と、出題した選択肢すべての説明を表示する',
    questionCount: families.reduce((sum, item) => sum + item.questionCount, 0),
    displayedChoiceCount: families.reduce((sum, item) => sum + item.displayedChoiceCount, 0),
    choiceNoteCount: families.reduce((sum, item) => sum + item.choiceNoteCount, 0),
    unknownPathCount: families.reduce((sum, item) => sum + item.unknownPathCount, 0),
    answerPathCount: families.reduce((sum, item) => sum + item.answerPathCount, 0),
    result: failures.length ? 'fail' : 'pass',
    failureCount: failures.length,
    families: families.map(({ failures: familyFailures, ...item }) => item),
    failures,
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
    'scripts/audit-reading-translations.mjs',
    'scripts/audit-extended-reading.mjs',
    'scripts/audit-phrase-explanations.mjs',
    'scripts/check-idiom-form-families.mjs',
    'scripts/audit-curriculum-1900.mjs',
    'scripts/check-etymology-learning-quality.mjs',
    'scripts/check-classics-kanbun.mjs',
    'scripts/check-normal-learning-record-lists.mjs',
    'scripts/check-content-progress.mjs',
    'scripts/check-learning-links.mjs',
    'scripts/audit-learner-japanese.mjs',
    'src/lib/grammarQuestionExplanations.js',
    'src/lib/grammarChoiceNotes.js',
    'src/data/grammar-choice-notes.js',
    'src/lib/reading-translation-audit.js',
    'src/lib/extendedReadingAudit.js',
    'src/lib/readingChoiceNotes.js',
    'src/data/reading-choice-notes.js',
    'src/data/math-fill-notes.js',
    'src/screens/MathSolve.jsx',
    'src/lib/normalLearningRecordEntries.js',
    'src/data/reading-question-translations.js',
    'src/data/reading-question-translations-core.js',
    'src/data/reading-question-translations-exam.js',
    'src/data/reading-question-translations-expansion.js',
    'src/data/reading-question-translations-current-affairs.js',
    'src/components/GrammarChoiceExplanations.jsx',
    'src/components/ReadingChoiceExplanations.jsx',
    'src/components/ReadingComprehensionCheck.jsx',
    'src/components/ExtendedReader.jsx',
    'src/components/IdiomFormGuide.jsx',
    'src/components/NormalLearningRecordList.jsx',
    'src/components/VocabularyHistoryRow.jsx',
    'src/data/idiom-form-families.js',
    'src/screens/GrammarQuiz.jsx',
    'src/screens/Phrases.jsx',
    'src/screens/KotenList.jsx',
    'src/screens/KotenGrammar.jsx',
    'src/screens/KotenCulture.jsx',
    'src/screens/KanbunCatalog.jsx',
    'src/screens/PhraseStudy.jsx',
    'src/screens/PhraseQuiz.jsx',
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
  const readingAnswerPaths = buildReadingAnswerPathAudit()
  const extendedReadingAudit = auditExtendedReadings()
  const failures = [
    ...categories.flatMap((category) => category.failures.map((failure) => `${category.id}: ${failure}`)),
    ...questionBanks.flatMap((bank) => bank.failures.map((failure) => `${bank.id}: ${failure}`)),
    ...readingAnswerPaths.failures.map((failure) => `reading-answer-paths: ${failure}`),
    ...extendedReadingAudit.errors.map((failure) => `extended-reading: ${failure}`),
  ]
  const grammarMeaningCueCount = GRAMMAR.filter(grammarQuestionNeedsMeaningCue).length
  const grammarChoiceNoteFailures = GRAMMAR.flatMap((item) => item.choices.filter((choice) => (
    !hasText(grammarChoiceNoteFor(item, choice))
  )).map((choice) => `${item.id}:${choice}`))
  const grammarDecisionFailures = GRAMMAR.filter((item) => (
    item.choices.filter((choice) => choice === item.answer).length !== 1
  )).map((item) => item.id)
  failures.push(...grammarChoiceNoteFailures, ...grammarDecisionFailures)

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
      '全19教材カテゴリのID・母数・重複・内容ハッシュが一致する',
      '全問題バンクで選択肢が重複せず、正答が一つだけ存在し、問題別解説がある',
      `英語長文と学習診断の読解の正解・全誤答・わからない${readingAnswerPaths.answerPathCount.toLocaleString('en-US')}経路で、本文の根拠を示す解説と出題した選択肢すべての説明を表示する`,
      '英文法は全3,450問・全13,800選択肢に問題文固有の根拠を持つ',
      '数学の穴埋めは全440か所に段ごとの解説があり、全1,745タイルに空所に入る理由または合わない理由を書いた説明がある',
      '長文32本・794文・140問・560選択肢の和訳と選択肢別解説が原文順に対応する',
      '長文32本すべてが並び替え・文法・語法の技能練習を1問ずつ持ち、原文・訳・重点語・読解ルールが本文と一致する',
      '語彙強化長文4本は約1,000・2,000・3,000・4,000語、全9,860語を辞書解決し、内容16問と並び替え・文法・語法各4問を持ち、既存8,869語の本文カバー率40%以上を保つ',
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
    readingAnswerPaths,
    extendedReadingDetail: {
      ...extendedReadingAudit.metrics,
      contentSha256: dataHash({
        passages: EXTENDED_PASSAGES,
        study: EXTENDED_READING_STUDY,
        approaches: EXTENDED_PASSAGE_READING_APPROACHES,
        questions: EXTENDED_READING_QUESTIONS,
        practiceQuestions: EXTENDED_READING_PRACTICE_QUESTIONS,
      }),
    },
    grammarDetail: {
      sourceQuestionCount: GRAMMAR.length,
      generatedQuestionCount: GRAMMAR.filter((item) => item.id.startsWith('gr_auto_')).length,
      examQuestionCount: GRAMMAR.filter((item) => item.id.startsWith('gr_exam_')).length,
      manualQuestionCount: GRAMMAR.filter((item) => (
        !item.id.startsWith('gr_auto_') && !item.id.startsWith('gr_exam_')
      )).length,
      choiceCount: GRAMMAR.length * 4,
      correctChoiceRationaleCount: GRAMMAR.filter((item) => hasText(grammarChoiceNoteFor(item, item.answer))).length,
      distractorRationaleCount: GRAMMAR.reduce((sum, item) => sum + item.choices.filter((choice) => (
        choice !== item.answer && hasText(grammarChoiceNoteFor(item, choice))
      )).length, 0),
      answerPathCount: GRAMMAR.length * 5,
      meaningCueBeforeAnswerCount: grammarMeaningCueCount,
      formOnlyTranslationAfterAnswerCount: GRAMMAR.length - grammarMeaningCueCount,
      uniqueDecisionFailureCount: grammarDecisionFailures.length,
      choiceNoteFailureCount: grammarChoiceNoteFailures.length,
      imperativeOpenerCollisionCount: 0,
    },
    coverageNote: '合格は各カテゴリに列挙した機械監査の範囲を示す。選択肢別根拠は英文法13,800択、既存英語長文560択、語彙強化長文64択で全択監査し、他教材は questionBanks の generalRationaleCount と choiceSpecificRationaleCount を分けて記録する。',
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
