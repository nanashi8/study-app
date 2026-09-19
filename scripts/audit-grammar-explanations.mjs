import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  GRAMMAR,
  GRAMMAR_PRACTICE,
  GRAMMAR_TOTAL_TARGET,
} from '../src/data/grammar.js'
import { GRAMMAR_REFERENCE_UNITS, grammarReferenceFor } from '../src/data/grammar-reference/index.js'
import { ALL_WORDS } from '../src/data/vocab.js'
import {
  grammarQuestionNeedsMeaningCue,
  grammarRuleExplanationFor,
} from '../src/lib/grammarQuestionExplanations.js'
import { grammarChoiceNoteFor } from '../src/lib/grammarChoiceNotes.js'

const normalize = (value) => String(value ?? '')
  .trim()
  .toLocaleLowerCase('en-US')
  .replace(/[’]/g, "'")
  .replace(/\s+/g, ' ')

const contains = (text, part) => normalize(text).includes(normalize(part))

assert.equal(GRAMMAR.length, GRAMMAR_TOTAL_TARGET, '英文法の全件母数が収録目標と一致しません')

// 文法の参考書：出題のある級・単元すべてに1ページずつあり、形・ポイント・例文・間違えやすいところ・チェックをそろえる。
const practiceTopicPairs = GRAMMAR_PRACTICE.map((item) => `${item.level}\u0000${item.topic}`)
const referencePairs = GRAMMAR_REFERENCE_UNITS.map((unit) => `${unit.level}\u0000${unit.topic}`)
assert.equal(new Set(referencePairs).size, GRAMMAR_REFERENCE_UNITS.length, '文法の参考書に同じ級・単元のページが2つあります')
assert.deepEqual([...new Set(referencePairs)].sort(), [...new Set(practiceTopicPairs)].sort(), '文法の参考書のページと、テストの級・単元がそろっていません')
for (const unit of GRAMMAR_REFERENCE_UNITS) {
  const label = `文法の参考書 ${unit.id}`
  assert.ok(String(unit.lead ?? '').trim().length >= 20, `${label}: ここで学ぶことが短すぎます`)
  assert.ok(unit.forms.length >= 1, `${label}: 基本の形がありません`)
  assert.ok(unit.points.length >= 2, `${label}: ポイントが2つ未満です`)
  assert.ok(unit.mistakes.length >= 1, `${label}: 間違えやすいところがありません`)
  assert.ok(unit.check.length >= 2, `${label}: テスト前のチェックが2つ未満です`)
  assert.ok(grammarReferenceFor(unit.level, unit.topic) === unit, `${label}: 級・単元から引けません`)
}

const imperativeLesson = grammarReferenceFor('5', '命令文')
assert.ok(imperativeLesson, '命令文の参考書ページがありません')
const imperativeLessonText = [
  imperativeLesson.lead,
  ...imperativeLesson.forms.flatMap((form) => [form.form, form.example?.en ?? '']),
  ...imperativeLesson.points.flatMap((point) => [point.title, ...point.text, ...point.examples.flatMap(({ en, ja }) => [en, ja])]),
  ...imperativeLesson.mistakes.flatMap((item) => [item.wrong, item.right, item.why]),
].join('\n')
for (const required of ['動詞の原形', 'Be', 'Don’t', 'Never', 'Always', 'Please', 'Let’s', 'Let’s not', '決して']) {
  assert.ok(contains(imperativeLessonText, required), `命令文レッスンに「${required}」の説明がありません`)
}

let ruleExplanationCount = 0
let choiceNoteCount = 0
let correctChoiceNoteCount = 0
let uniqueAnswerCount = 0
let meaningCueQuestionCount = 0
let formOnlyQuestionCount = 0
let examQuestionCount = 0
const examFocuses = new Set()
const TEMPLATE_PHRASES = /英語の手掛かり|適用する規則|したがって、空所は|この条件を満たすのは|正解は一つに決まる|この手掛かりと規則を/u

for (const item of GRAMMAR) {
  const label = `文法 ${item.id}`
  assert.equal(item.choices.length, 4, `${label}: 選択肢が4件ではありません`)
  assert.equal(new Set(item.choices).size, 4, `${label}: 選択肢が重複しています`)
  assert.equal(
    item.choices.filter((choice) => choice === item.answer).length,
    1,
    `${label}: 正答が選択肢内で一つに定まりません`,
  )
  uniqueAnswerCount += 1
  if (grammarQuestionNeedsMeaningCue(item)) meaningCueQuestionCount += 1
  else formOnlyQuestionCount += 1
  if (item.examFocus) {
    examQuestionCount += 1
    examFocuses.add(item.examFocus)
  }
}

// 答え合わせの選択肢解説は、正解・誤答とも問題ごとに書いた説明を出す（並び替え問題は選択肢がない）。
for (const item of GRAMMAR_PRACTICE.filter((candidate) => candidate.questionType !== 'word-order')) {
  const label = `文法 ${item.id}`
  const notes = item.choices.map((choice) => grammarChoiceNoteFor(item, choice))
  assert.equal(new Set(notes).size, notes.length, `${label}: 別々の選択肢に同じ解説を使っています`)
  for (const [index, choice] of item.choices.entries()) {
    const note = notes[index]
    assert.ok(note.length >= 12, `${label}: 選択肢「${choice}」の解説がないか短すぎます`)
    assert.match(note, /[ぁ-んァ-ヶ一-龠]/u, `${label}: 選択肢「${choice}」の解説が日本語ではありません`)
    assert.doesNotMatch(note, TEMPLATE_PHRASES, `${label}: 選択肢「${choice}」の解説に決まり文句の枠が残っています`)
    choiceNoteCount += 1
    if (choice === item.answer) correctChoiceNoteCount += 1
  }
}

// 答え合わせの「解説」は、規則ごとに書いた説明を出す。決まり文句の枠（手掛かり・結論の定型文）は使わない。
// 1問だけの規則は、その問題文に当てはめて書くので、正解の語が必ず入る。
const ruleUseCount = new Map()
for (const item of GRAMMAR_PRACTICE) ruleUseCount.set(item.explain, (ruleUseCount.get(item.explain) ?? 0) + 1)
for (const item of GRAMMAR_PRACTICE) {
  const label = `文法 ${item.id}`
  const ruleExplanation = grammarRuleExplanationFor(item)
  assert.ok(ruleExplanation.length >= 30, `${label}: 規則の解説がないか短すぎます`)
  assert.doesNotMatch(ruleExplanation, TEMPLATE_PHRASES, `${label}: 解説に決まり文句の枠が残っています`)
  if (ruleUseCount.get(item.explain) === 1 && item.questionType !== 'word-order') {
    assert.ok(contains(ruleExplanation, item.answer), `${label}: 1問だけの規則の解説に正解「${item.answer}」がありません`)
  }
  ruleExplanationCount += 1
}

assert.equal(examQuestionCount, 450, '入試型の問題別焦点監査が450問に届いていません')
assert.equal(examFocuses.size, 260, '入試型の問われ方260種類を全て監査できていません')
const choiceQuestions = GRAMMAR_PRACTICE.filter((item) => item.questionType !== 'word-order')
assert.equal(ruleExplanationCount, GRAMMAR_PRACTICE.length)
assert.equal(choiceNoteCount, choiceQuestions.reduce((sum, item) => sum + item.choices.length, 0))
assert.equal(correctChoiceNoteCount, choiceQuestions.length)
assert.equal(uniqueAnswerCount, GRAMMAR.length)
assert.equal(meaningCueQuestionCount + formOnlyQuestionCount, GRAMMAR.length)

const neverImperatives = GRAMMAR.filter((item) => item.examFocus === 'never-imperative')
assert.equal(neverImperatives.length, 2, 'Neverを使う命令文の監査対象が変化しました')
for (const item of neverImperatives) {
  const note = grammarChoiceNoteFor(item, 'Never')
  assert.match(note, /Never＋動詞の原形/)
  assert.match(note, /決して/)
  assert.match(grammarRuleExplanationFor(item), /Don’t/)
}

// 文頭の空所に複数の命令表現を並べると、英文だけなら複数解になり得る。
// Always / Never / Please / Don't / Let's を答えにする問題では、競合する命令表現を置かない。
const imperativeOpeners = new Set(['always', 'never', 'please', "don't", "let's"])
const imperativeFocusPattern = /^(?:always|never|please|lets)-(?:imperative|suggestion)/u
let imperativeOpenerCollisionCount = 0
for (const item of GRAMMAR.filter((candidate) => (
  candidate.topic === '命令文'
  && String(candidate.q).startsWith('___')
  && imperativeFocusPattern.test(String(candidate.examFocus ?? ''))
))) {
  const competingOpeners = item.choices.filter((choice) => imperativeOpeners.has(normalize(choice)))
  if (competingOpeners.length !== 1 || competingOpeners[0] !== item.answer) {
    imperativeOpenerCollisionCount += 1
  }
  assert.deepEqual(
    competingOpeners,
    [item.answer],
    `${item.id}: 文頭で成立し得る命令表現が競合しています（${competingOpeners.join(' / ')}）`,
  )
}
assert.equal(imperativeOpenerCollisionCount, 0)

const alwaysSeatbelt = GRAMMAR.find((item) => item.id === 'gr_exam_eiken_5_imperative_1_009')
assert.ok(alwaysSeatbelt, 'Always seatbelt 問題がありません')
assert.equal(alwaysSeatbelt.level, '5', 'Always seatbelt 問題が5級ではありません')
assert.deepEqual(alwaysSeatbelt.choices, ['Always', 'Never to', 'Not', 'No'])
assert.ok(grammarQuestionNeedsMeaningCue(alwaysSeatbelt), 'Always seatbelt 問題に判断用の和訳が表示されません')
assert.ok(!alwaysSeatbelt.choices.includes('Please'), 'Always seatbelt 問題に成立し得る Please が残っています')
assert.ok(!alwaysSeatbelt.choices.includes("Don’t"), 'Always seatbelt 問題に成立し得る Don’t が残っています')

for (const headword of ['always', 'please']) {
  const entries = ALL_WORDS.filter((word) => normalize(word.word) === headword)
  assert.ok(entries.length > 0, `${headword}: 語彙データにありません`)
  assert.ok(entries.some((word) => String(word.level) === '5'), `${headword}: 5級語として収録されていません`)
}

// 取り違えやすい問題で、決め手の説明が選択肢解説から消えていないか。
const examById = new Map(GRAMMAR.map((item) => [item.id, item]))
const focusRegressionCases = [
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
for (const [id, choice, expected] of focusRegressionCases) {
  const item = examById.get(id)
  assert.ok(item, `${id}: 監査対象がありません`)
  assert.ok(item.choices.includes(choice), `${id}: 選択肢「${choice}」がありません`)
  assert.match(grammarChoiceNoteFor(item, choice), expected, `${id}: 選択肢「${choice}」の決め手の説明が後退しました`)
}

const [grammarQuizSource, diagnosticSource, choiceExplanationsSource, diagnosticQuestionsSource] = await Promise.all([
  readFile(new URL('../src/screens/GrammarQuiz.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/screens/Diagnostic.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/GrammarChoiceExplanations.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/lib/diagnosticQuestions.js', import.meta.url), 'utf8'),
])
assert.match(grammarQuizSource, /data-grammar-target-meaning/)
assert.match(grammarQuizSource, /grammarQuestionNeedsMeaningCue/)
assert.match(grammarQuizSource, /<GrammarChoiceExplanations/)
assert.match(grammarQuizSource, /data-grammar-explanation[\s\S]*grammarRuleExplanationFor\(item\)/)
assert.doesNotMatch(grammarQuizSource, /InstructorExplanation/)
assert.match(diagnosticQuestionsSource, /explain: grammarRuleExplanationFor\(item\)/)
assert.match(diagnosticSource, /data-diagnostic-grammar-meaning/)
assert.match(diagnosticSource, /item\.promptJa && item\.meaningCueRequired/)
assert.match(diagnosticSource, /<GrammarChoiceExplanations/)
assert.match(choiceExplanationsSource, /選択肢解説（\$\{choices\.length\}択すべて）/)
assert.match(choiceExplanationsSource, /choices\.map/)
assert.match(choiceExplanationsSource, /<ChoiceExplanations/)
assert.match(choiceExplanationsSource, /grammarChoiceNoteFor\(item, choice\)/)

console.log('✅ 英文法の全解説監査OK')
console.log(`  文法の参考書: ${GRAMMAR_REFERENCE_UNITS.length}/${new Set(practiceTopicPairs).size}単元（形・ポイント・例文・間違えやすいところ・チェック）`)
console.log(`  問題・4択・答えの一意性: ${uniqueAnswerCount}/${GRAMMAR.length}`)
console.log(`  入試型の問われ方: ${examQuestionCount}問（${examFocuses.size}種類）`)
console.log(`  意味・構造の取り違え回帰: ${focusRegressionCases.length}/${focusRegressionCases.length}`)
console.log(`  正解を含む選択肢解説: ${choiceNoteCount}件（正解${correctChoiceNoteCount}・誤答${choiceNoteCount - correctChoiceNoteCount}）`)
console.log(`  解答前の和訳: 意味判断${meaningCueQuestionCount}問・語形のみ非表示${formOnlyQuestionCount}問`)
console.log(`  命令文の先頭語競合: ${imperativeOpenerCollisionCount}件`)
console.log(`  規則ごとの解説: ${ruleExplanationCount}/${GRAMMAR_PRACTICE.length}（決まり文句の枠なし）`)
