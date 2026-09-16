import assert from 'node:assert/strict'
import test from 'node:test'
import {
  GRAMMAR,
  getGrammar,
} from '../src/data/grammar.js'
import { GRAMMAR_LESSONS } from '../src/data/grammar-lessons.js'
import { ALL_WORDS } from '../src/data/vocab.js'
import {
  grammarQuestionNeedsMeaningCue,
  grammarRuleExplanationFor,
} from '../src/lib/grammarQuestionExplanations.js'
import { grammarChoiceNoteFor } from '../src/lib/grammarChoiceNotes.js'

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

test('英文法3,450問すべてに、形の決まり方を書いた規則の解説がある', () => {
  assert.equal(GRAMMAR.length, 3_450)
  for (const item of GRAMMAR) {
    assert.ok(grammarRuleExplanationFor(item).length >= 30, item.id)
  }
})

test('入試型450問・260種類の問われ方すべてに、正解と誤答の選択肢解説がある', () => {
  const examItems = GRAMMAR.filter((item) => item.examFocus)
  assert.equal(examItems.length, 450)
  assert.equal(new Set(examItems.map((item) => item.examFocus)).size, 260)
  for (const item of examItems) {
    for (const choice of item.choices) {
      assert.ok(grammarChoiceNoteFor(item, choice).length >= 12, `${item.id}: ${choice}`)
    }
  }
})

test('取り違えやすい入試問題は、決め手をその問題の正解の解説に書く', () => {
  const cases = [
    ['gr_exam_eiken_2_comparison_advanced_2_007', 'even', /比較級 longer を前から強めて/u],
    ['gr_exam_university_pre1_noun_clause_2_009', 'That', /文の主語にするので That/u],
    ['gr_exam_university_1_not_until_inversion_004', 'Aya', /did の後ろには主語 Aya を置き、原形 understand/u],
    ['gr_exam_eiken_4_have_to_004', 'have', /does not の後ろは原形/u],
    ['gr_exam_university_1_degree_adverb_008', 'unchanged', /remained の補語になる形容詞/u],
    ['gr_exam_university_2_perfect_passive_006', 'already', /had already been＋過去分詞/u],
    ['gr_exam_university_pre1_mandative_010', 'be', /原形の be を使って be kept/u],
    ['gr_exam_university_1_degree_adverb_009', 'barely', /かろうじて・ほとんど〜ない/u],
    ['gr_exam_university_1_degree_adverb_002', 'no', /名詞 chance の前に置いて打ち消すのは no/u],
    ['gr_exam_eiken_2_conjunction_advanced_2_010', 'even if', /備える意味にならない/u],
  ]
  for (const [id, choice, expected] of cases) {
    assert.match(grammarChoiceNoteFor(getGrammar(id), choice), expected, id)
  }
})

test('正解を含む13,800選択肢すべてに、選択肢ごとにちがう解説がある', () => {
  let choiceCount = 0
  let correctCount = 0
  for (const item of GRAMMAR) {
    assert.equal(item.choices.filter((choice) => choice === item.answer).length, 1, item.id)
    const notes = item.choices.map((choice) => grammarChoiceNoteFor(item, choice))
    assert.equal(new Set(notes).size, notes.length, item.id)
    for (const [index, choice] of item.choices.entries()) {
      assert.match(notes[index], /[ぁ-んァ-ヶ一-龠]/u, `${item.id}: ${choice}`)
      choiceCount += 1
      if (choice === item.answer) correctCount += 1
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
    if (grammarQuestionNeedsMeaningCue(item)) meaningCount += 1
    else formOnlyCount += 1
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
  assert.match(grammarChoiceNoteFor(item, 'Never'), /Never＋動詞の原形/)
  assert.match(grammarChoiceNoteFor(item, 'Never'), /決して/)
  assert.match(grammarRuleExplanationFor(item), /Don’t/)
  assert.match(grammarChoiceNoteFor(item, 'Not'), /「〜するな」は Don’t＋動詞の原形/)
  assert.match(grammarChoiceNoteFor(item, 'No'), /no＋名詞/)

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
