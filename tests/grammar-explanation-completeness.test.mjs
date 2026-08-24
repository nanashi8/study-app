import assert from 'node:assert/strict'
import test from 'node:test'
import {
  GRAMMAR,
  getGrammar,
  grammarChoiceGuidanceFor,
  grammarChoiceUsageFor,
} from '../src/data/grammar.js'
import { GRAMMAR_LESSONS } from '../src/data/grammar-lessons.js'
import { ALL_WORDS } from '../src/data/vocab.js'
import {
  grammarAnswerEvidenceFor,
  grammarChoiceDecisionFor,
  grammarChoiceExplanationFor,
  grammarChoiceMismatchExplanationFor,
  grammarCorrectChoiceExplanationFor,
  grammarExamFocusExplanationFor,
  grammarQuestionExplanationFor,
  grammarQuestionNeedsMeaningCue,
  isCompleteGrammarQuestionExplanation,
} from '../src/lib/grammarQuestionExplanations.js'
import { buildGrammarInstructorExplanation } from '../src/lib/instructorExplanations.js'

const normalize = (value) => String(value ?? '')
  .toLocaleLowerCase('en-US')
  .replace(/[’]/g, "'")

test('文法レッスン69件すべてに形・判断・日英例文・注意点がある', () => {
  assert.equal(GRAMMAR_LESSONS.length, 69)
  for (const lesson of GRAMMAR_LESSONS) {
    assert.ok(lesson.summary?.trim(), `${lesson.id}: summary`)
    assert.ok(lesson.form?.trim(), `${lesson.id}: form`)
    assert.ok(lesson.points?.length >= 2, `${lesson.id}: points`)
    assert.ok(lesson.examples?.length >= 2, `${lesson.id}: examples`)
    assert.ok(lesson.examples.every(({ en, ja }) => en?.trim() && ja?.trim()), `${lesson.id}: bilingual examples`)
    assert.ok(lesson.pitfalls?.length >= 1, `${lesson.id}: pitfalls`)
  }
})

test('英文法3,450問すべてに正答・完成文・意味を結ぶ問題別解説がある', () => {
  assert.equal(GRAMMAR.length, 3_450)
  for (const item of GRAMMAR) {
    const explanation = grammarQuestionExplanationFor(item)
    assert.ok(isCompleteGrammarQuestionExplanation(item), item.id)
    assert.ok(normalize(explanation).includes(normalize(item.answer)), item.id)
    assert.ok(explanation.includes(item.sentence.en), item.id)
  }
})

test('入試型450問・260種類は問われ方固有の決め手まで説明する', () => {
  const examItems = GRAMMAR.filter((item) => item.examFocus)
  assert.equal(examItems.length, 450)
  assert.equal(new Set(examItems.map((item) => item.examFocus)).size, 260)
  for (const item of examItems) {
    const focusExplanation = grammarExamFocusExplanationFor(item)
    assert.ok(focusExplanation.length >= 24, item.id)
    assert.ok(normalize(focusExplanation).includes(normalize(item.answer)), item.id)
  }
})

test('同じ型を使い回せない入試問題は、各問の意味と構造に分けて説明する', () => {
  const cases = [
    ['gr_exam_eiken_2_comparison_advanced_2_007', /even.*「さらに」|「さらに」.*even/u],
    ['gr_exam_university_pre1_noun_clause_2_009', /That.*名詞節|名詞節.*That/u],
    ['gr_exam_university_1_not_until_inversion_004', /did＋主語＋動詞の原形/u],
    ['gr_exam_eiken_4_have_to_004', /does not.*原形 have/u],
    ['gr_exam_university_1_degree_adverb_008', /remain.*連結動詞/u],
    ['gr_exam_university_2_perfect_passive_006', /過去の基準時.*already/u],
    ['gr_exam_university_pre1_mandative_010', /that 節.*原形.*受動態/u],
    ['gr_exam_university_1_degree_adverb_009', /ほとんど.*barely/u],
    ['gr_exam_university_1_degree_adverb_002', /chance.*限定詞 no/u],
    ['gr_exam_eiken_2_conjunction_advanced_2_010', /even if.*備えの目的を表さない/u],
  ]
  for (const [id, expected] of cases) {
    assert.match(grammarExamFocusExplanationFor(getGrammar(id)), expected, id)
  }
})

test('誤答10,350件すべてに、この文で違う理由と別の使い方がある', () => {
  let count = 0
  for (const item of GRAMMAR) {
    for (const choice of item.choices.filter((candidate) => candidate !== item.answer)) {
      const mismatch = grammarChoiceMismatchExplanationFor(item, choice)
      const usage = grammarChoiceGuidanceFor(item, choice)
      assert.ok(normalize(mismatch).includes(normalize(choice)), `${item.id}: ${choice}`)
      assert.ok(normalize(mismatch).includes(normalize(item.answer)), `${item.id}: ${choice}`)
      assert.ok(usage?.summary, `${item.id}: ${choice}`)
      const instructor = buildGrammarInstructorExplanation(item, choice, usage)
      assert.ok(normalize(instructor.trap).includes(normalize(choice)), `${item.id}: ${choice}`)
      assert.ok(normalize(instructor.trap).includes(normalize(item.answer)), `${item.id}: ${choice}`)
      count += 1
    }
  }
  assert.equal(count, 10_350)
})

test('正解を含む13,800選択肢すべてに、問題文の手掛かりと適用規則による根拠がある', () => {
  let choiceCount = 0
  let correctCount = 0
  for (const item of GRAMMAR) {
    const evidence = grammarAnswerEvidenceFor(item)
    const prompt = item.q.replace('___', '［空所］')
    const decisions = item.choices.map((choice) => grammarChoiceDecisionFor(item, choice))
    assert.equal(decisions.filter((decision) => decision.isCorrect).length, 1, item.id)
    assert.equal(decisions.find((decision) => decision.isCorrect).choice, item.answer, item.id)

    for (const choice of item.choices) {
      const explanation = grammarChoiceExplanationFor(item, choice)
      const usage = grammarChoiceUsageFor(item, choice)
      assert.ok(normalize(explanation).includes(normalize(choice)), `${item.id}: ${choice}`)
      assert.ok(normalize(explanation).includes(normalize(item.answer)), `${item.id}: ${choice}`)
      assert.ok(normalize(explanation).includes(normalize(prompt)), `${item.id}: ${choice}`)
      assert.ok(normalize(explanation).includes(normalize(evidence.rule)), `${item.id}: ${choice}`)
      assert.notEqual(usage?.status, 'unresolved', `${item.id}: ${choice}`)
      assert.ok(usage?.summary, `${item.id}: ${choice}`)
      choiceCount += 1
      if (choice === item.answer) {
        assert.equal(usage.status, 'valid', `${item.id}: ${choice}`)
        assert.match(grammarCorrectChoiceExplanationFor(item), /正解は一つ/u, item.id)
        correctCount += 1
      }
    }
  }
  assert.equal(choiceCount, 13_800)
  assert.equal(correctCount, 3_450)
})

test('意味で選ぶ問題だけ解答前に和訳を出し、語形だけで決まる問題は答え合わせで示す', () => {
  const always = getGrammar('gr_exam_eiken_5_imperative_1_009')
  const inflection = getGrammar('gr_exam_eiken_5_imperative_1_001')
  assert.equal(grammarQuestionNeedsMeaningCue(always), true)
  assert.equal(grammarQuestionNeedsMeaningCue(inflection), false)

  let meaningCount = 0
  let formOnlyCount = 0
  for (const item of GRAMMAR) {
    const needsMeaning = grammarQuestionNeedsMeaningCue(item)
    const evidence = grammarAnswerEvidenceFor(item)
    assert.equal(evidence.requiresMeaningCue, needsMeaning, item.id)
    if (needsMeaning) {
      assert.ok(evidence.meaningClue.includes(item.sentence.ja.replace(/[。.!！?？]+$/u, '')), item.id)
      meaningCount += 1
    } else {
      assert.equal(evidence.meaningClue, '', item.id)
      formOnlyCount += 1
    }
  }
  assert.equal(meaningCount + formOnlyCount, 3_450)
  assert.ok(meaningCount > 0)
  assert.ok(formOnlyCount > 0)
})

test('Always seatbelt問題はPleaseとの複数解を除き、alwaysとpleaseを5級語として扱う', () => {
  const item = getGrammar('gr_exam_eiken_5_imperative_1_009')
  assert.equal(item.answer, 'Always')
  assert.deepEqual(item.choices, ['Always', 'Never to', 'Not', 'No'])
  assert.ok(!item.choices.includes('Please'))
  assert.ok(!item.choices.includes('Don’t'))

  for (const headword of ['always', 'please']) {
    assert.ok(
      ALL_WORDS.some((word) => normalize(word.word) === headword && word.level === '5'),
      headword,
    )
  }
})

test('Neverの命令文はDon’tとの違いと動詞原形まで明示する', () => {
  const item = getGrammar('gr_exam_eiken_5_imperative_1_008')
  const explanation = grammarQuestionExplanationFor(item)
  assert.match(explanation, /Never＋動詞の原形/)
  assert.match(explanation, /決して/)
  assert.match(explanation, /Don’t/)
  assert.match(
    grammarChoiceMismatchExplanationFor(item, 'Don’t'),
    /一般的な「〜するな」.*「決して」.*Never/,
  )
  assert.match(grammarChoiceMismatchExplanationFor(item, 'No'), /名詞の前.*否定命令を作れない/)
  assert.match(grammarChoiceMismatchExplanationFor(item, 'Not'), /単独で普通の命令文を始められない/)
  assert.match(grammarChoiceGuidanceFor(item, 'No').summary, /no＋名詞.*単独で「いいえ」/)
  assert.match(grammarChoiceGuidanceFor(item, 'Not').summary, /be動詞・助動詞の後ろ.*Don’t＋動詞の原形/)

  const lesson = GRAMMAR_LESSONS.find(({ id }) => id === 'gl_j1_imp')
  const lessonText = [
    lesson.form,
    ...lesson.points,
    ...lesson.examples.flatMap(({ en, ja }) => [en, ja]),
    ...lesson.pitfalls,
  ].join('\n')
  assert.match(lessonText, /Never＋動詞の原形/)
  assert.match(lessonText, /Don’t.*一般的な禁止/)
  assert.match(lessonText, /Never.*決して.*強い禁止/)
  assert.match(lessonText, /Never give up on your dream\./)
})
