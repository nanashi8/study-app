import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  GRAMMAR,
  GRAMMAR_TOTAL_TARGET,
  grammarChoiceGuidanceFor,
  grammarChoiceUsageFor,
} from '../src/data/grammar.js'
import { GRAMMAR_LESSONS, GRAMMAR_STAGES } from '../src/data/grammar-lessons.js'
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
import {
  buildGrammarInstructorExplanation,
  isCompleteInstructorExplanation,
} from '../src/lib/instructorExplanations.js'
import { UNKNOWN_CHOICE_ID } from '../src/lib/quizChoices.js'

const normalize = (value) => String(value ?? '')
  .trim()
  .toLocaleLowerCase('en-US')
  .replace(/[’]/g, "'")
  .replace(/\s+/g, ' ')

const contains = (text, part) => normalize(text).includes(normalize(part))
const withoutTerminal = (value) => String(value ?? '').replace(/[。.!！?？]+$/u, '')

assert.equal(GRAMMAR.length, GRAMMAR_TOTAL_TARGET, '英文法の全件母数が収録目標と一致しません')

assert.equal(GRAMMAR_LESSONS.length, 69, '文法レッスンの全件母数が69件から変化しました')
assert.equal(new Set(GRAMMAR_LESSONS.map((lesson) => lesson.id)).size, GRAMMAR_LESSONS.length, '文法レッスンIDが重複しています')
for (const lesson of GRAMMAR_LESSONS) {
  const label = `文法レッスン ${lesson.id}`
  assert.ok(GRAMMAR_STAGES.includes(lesson.stage), `${label}: 学年段階が不正です`)
  assert.ok(String(lesson.title ?? '').trim(), `${label}: 単元名がありません`)
  assert.ok(String(lesson.summary ?? '').trim().length >= 20, `${label}: 一言まとめが短すぎます`)
  assert.ok(String(lesson.form ?? '').trim().length >= 8, `${label}: 形・語順がありません`)
  assert.ok(Array.isArray(lesson.points) && lesson.points.length >= 2, `${label}: 判断ポイントが2件未満です`)
  assert.ok(lesson.points.every((point) => String(point).trim().length >= 18), `${label}: 判断ポイントが短すぎます`)
  assert.ok(Array.isArray(lesson.examples) && lesson.examples.length >= 2, `${label}: 日英例文が2件未満です`)
  assert.ok(lesson.examples.every(({ en, ja }) => String(en).trim() && String(ja).trim()), `${label}: 英文または日本語訳が空です`)
  assert.ok(Array.isArray(lesson.pitfalls) && lesson.pitfalls.length >= 1, `${label}: つまずきやすい点がありません`)
  assert.ok(lesson.pitfalls.every((pitfall) => String(pitfall).trim().length >= 20), `${label}: つまずきやすい点が短すぎます`)
}

const imperativeLesson = GRAMMAR_LESSONS.find((lesson) => lesson.id === 'gl_j1_imp')
assert.ok(imperativeLesson, '命令文レッスンがありません')
const imperativeLessonText = [
  imperativeLesson.summary,
  imperativeLesson.form,
  ...imperativeLesson.points,
  ...imperativeLesson.examples.flatMap(({ en, ja }) => [en, ja]),
  ...imperativeLesson.pitfalls,
].join('\n')
for (const required of ['動詞の原形', 'Be', 'Don’t', 'Never', 'Always', 'Please', 'Let’s', 'Let’s not', '決して']) {
  assert.ok(contains(imperativeLessonText, required), `命令文レッスンに「${required}」の説明がありません`)
}

let correctPaths = 0
let wrongPaths = 0
let unknownPaths = 0
let choiceMismatchCount = 0
let allChoiceReasonCount = 0
let correctChoiceReasonCount = 0
let uniqueAnswerCount = 0
let meaningCueQuestionCount = 0
let formOnlyQuestionCount = 0
let examQuestionCount = 0
const examFocuses = new Set()

for (const item of GRAMMAR) {
  const label = `文法 ${item.id}`
  assert.equal(item.choices.length, 4, `${label}: 選択肢が4件ではありません`)
  assert.equal(new Set(item.choices).size, 4, `${label}: 選択肢が重複しています`)
  assert.equal(
    item.choices.filter((choice) => choice === item.answer).length,
    1,
    `${label}: 正答が選択肢内で一つに定まりません`,
  )

  const evidence = grammarAnswerEvidenceFor(item)
  const visiblePrompt = String(item.q).replace('___', '［空所］')
  assert.ok(evidence?.englishClue.includes(visiblePrompt), `${label}: 問題文の具体的な手掛かりがありません`)
  assert.ok(evidence?.rule, `${label}: 選択根拠となる規則がありません`)
  assert.ok(contains(evidence.conclusion, item.answer), `${label}: 根拠から正答へ至る結論がありません`)
  assert.ok(contains(evidence.conclusion, item.sentence.en), `${label}: 根拠と完成文が結ばれていません`)

  const needsMeaningCue = grammarQuestionNeedsMeaningCue(item)
  assert.equal(evidence.requiresMeaningCue, needsMeaningCue, `${label}: 和訳表示の判定が一致しません`)
  if (needsMeaningCue) {
    assert.ok(contains(evidence.meaningClue, withoutTerminal(item.sentence.ja)), `${label}: 判断に必要な和訳がありません`)
    meaningCueQuestionCount += 1
  } else {
    assert.equal(evidence.meaningClue, '', `${label}: 語形だけで決まる問題に解答前の和訳を要求しています`)
    formOnlyQuestionCount += 1
  }

  const learnerExplanation = grammarQuestionExplanationFor(item)
  assert.ok(isCompleteGrammarQuestionExplanation(item), `${label}: 問題別の正答根拠が未完成`)
  assert.ok(contains(learnerExplanation, item.explain), `${label}: 元の文法規則が解説から欠落`)
  assert.ok(contains(learnerExplanation, item.answer), `${label}: 正答そのものの説明が欠落`)
  assert.ok(contains(learnerExplanation, item.sentence.en), `${label}: 完成英文が解説から欠落`)
  assert.ok(contains(learnerExplanation, withoutTerminal(item.sentence.ja)), `${label}: 完成文の意味が解説から欠落`)

  if (item.examFocus) {
    examQuestionCount += 1
    examFocuses.add(item.examFocus)
    const focusExplanation = grammarExamFocusExplanationFor(item)
    assert.ok(focusExplanation.length >= 24, `${label}: 入試型の問われ方固有の決め手が短すぎます`)
    assert.ok(contains(focusExplanation, item.answer), `${label}: 入試型の決め手に正答がありません`)
  }

  const correctExplanation = buildGrammarInstructorExplanation(item, item.answer)
  assert.ok(isCompleteInstructorExplanation(correctExplanation), `${label}: 正答経路の4段解説が未完成`)
  assert.ok(contains(correctExplanation.answer, item.answer), `${label}: 正答経路に正答がありません`)
  assert.ok(contains(correctExplanation.evidence, item.explain), `${label}: 正答経路に元の文法規則がありません`)
  correctPaths += 1

  const decisions = item.choices.map((choice) => grammarChoiceDecisionFor(item, choice))
  assert.equal(decisions.filter((decision) => decision?.isCorrect).length, 1, `${label}: 4択の正誤判定が一意ではありません`)
  assert.equal(decisions.find((decision) => decision?.isCorrect)?.choice, item.answer, `${label}: 一意な正答判定が答えと一致しません`)
  uniqueAnswerCount += 1

  for (const choice of item.choices) {
    const decision = grammarChoiceDecisionFor(item, choice)
    const usage = grammarChoiceUsageFor(item, choice)
    const choiceExplanation = grammarChoiceExplanationFor(item, choice)
    assert.ok(decision, `${label}: 選択肢「${choice}」の正誤判定がありません`)
    assert.ok(choiceExplanation.length >= 24, `${label}: 選択肢「${choice}」の根拠が短すぎます`)
    assert.ok(contains(choiceExplanation, choice), `${label}: 選択肢根拠に「${choice}」がありません`)
    assert.ok(contains(choiceExplanation, item.answer), `${label}: 選択肢根拠に正答「${item.answer}」がありません`)
    assert.ok(contains(choiceExplanation, visiblePrompt), `${label}: 選択肢根拠に問題文の手掛かりがありません`)
    assert.ok(contains(choiceExplanation, evidence.rule), `${label}: 選択肢根拠に適用規則がありません`)
    assert.ok(usage?.status && usage.status !== 'unresolved', `${label}: 選択肢「${choice}」の使い方が未解決です`)
    assert.ok(usage?.summary, `${label}: 選択肢「${choice}」の使い方がありません`)
    allChoiceReasonCount += 1

    if (choice === item.answer) {
      const correctChoiceReason = grammarCorrectChoiceExplanationFor(item)
      assert.equal(decision.status, 'correct', `${label}: 正解選択肢の判定表示が不正です`)
      assert.equal(usage.status, 'valid', `${label}: 正解選択肢の使い方が valid ではありません`)
      assert.ok(contains(correctChoiceReason, item.sentence.en), `${label}: 正解選択肢の根拠に完成文がありません`)
      assert.match(correctChoiceReason, /正解は一つ/u, `${label}: 正解選択肢に唯一性の説明がありません`)
      correctChoiceReasonCount += 1
      continue
    }

    const guidance = grammarChoiceGuidanceFor(item, choice)
    assert.ok(guidance, `${label}: 誤答「${choice}」の使い方がありません`)
    const mismatch = grammarChoiceMismatchExplanationFor(item, choice)
    assert.ok(mismatch.length >= 24, `${label}: 誤答「${choice}」がこの文で違う理由が短すぎます`)
    assert.ok(contains(mismatch, choice), `${label}: 誤答理由に選択肢「${choice}」がありません`)
    assert.ok(contains(mismatch, item.answer), `${label}: 誤答理由に正答「${item.answer}」がありません`)
    assert.ok(contains(mismatch, withoutTerminal(item.sentence.ja)), `${label}: 誤答理由に目標の意味がありません`)
    choiceMismatchCount += 1

    const wrongExplanation = buildGrammarInstructorExplanation(item, choice, guidance)
    assert.ok(isCompleteInstructorExplanation(wrongExplanation), `${label}: 誤答「${choice}」経路の4段解説が未完成`)
    assert.ok(contains(wrongExplanation.trap, choice), `${label}: 誤答経路に選んだ答えがありません`)
    assert.ok(contains(wrongExplanation.trap, item.answer), `${label}: 誤答経路に正答がありません`)
    assert.ok(contains(wrongExplanation.trap, item.explain), `${label}: 誤答経路にこの問題の文法規則がありません`)
    wrongPaths += 1
  }

  const unknownExplanation = buildGrammarInstructorExplanation(item, UNKNOWN_CHOICE_ID)
  assert.ok(isCompleteInstructorExplanation(unknownExplanation), `${label}: 「わからない」経路の4段解説が未完成`)
  assert.ok(contains(unknownExplanation.trap, item.answer), `${label}: 「わからない」経路に正答がありません`)
  assert.ok(contains(unknownExplanation.trap, item.explain), `${label}: 「わからない」経路に文法規則がありません`)
  unknownPaths += 1
}

assert.equal(examQuestionCount, 450, '入試型の問題別焦点監査が450問に届いていません')
assert.equal(examFocuses.size, 260, '入試型の問われ方260種類を全て監査できていません')
assert.equal(correctPaths, GRAMMAR.length)
assert.equal(wrongPaths, GRAMMAR.length * 3)
assert.equal(unknownPaths, GRAMMAR.length)
assert.equal(choiceMismatchCount, GRAMMAR.length * 3)
assert.equal(allChoiceReasonCount, GRAMMAR.length * 4)
assert.equal(correctChoiceReasonCount, GRAMMAR.length)
assert.equal(uniqueAnswerCount, GRAMMAR.length)
assert.equal(meaningCueQuestionCount + formOnlyQuestionCount, GRAMMAR.length)

const neverImperatives = GRAMMAR.filter((item) => item.examFocus === 'never-imperative')
assert.equal(neverImperatives.length, 2, 'Neverを使う命令文の監査対象が変化しました')
for (const item of neverImperatives) {
  const explanation = grammarQuestionExplanationFor(item)
  assert.match(explanation, /Never＋動詞の原形/)
  assert.match(explanation, /決して/)
  assert.match(explanation, /Don’t/)
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

const examById = new Map(GRAMMAR.map((item) => [item.id, item]))
const focusRegressionCases = [
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
for (const [id, expected] of focusRegressionCases) {
  const item = examById.get(id)
  assert.ok(item, `${id}: 監査対象がありません`)
  assert.match(grammarExamFocusExplanationFor(item), expected, `${id}: 問われ方固有の説明が後退しました`)
}

const [grammarQuizSource, diagnosticSource, choiceExplanationsSource] = await Promise.all([
  readFile(new URL('../src/screens/GrammarQuiz.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/screens/Diagnostic.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/GrammarChoiceExplanations.jsx', import.meta.url), 'utf8'),
])
assert.match(grammarQuizSource, /data-grammar-target-meaning/)
assert.match(grammarQuizSource, /grammarQuestionNeedsMeaningCue/)
assert.match(grammarQuizSource, /<GrammarChoiceExplanations/)
assert.match(diagnosticSource, /data-diagnostic-grammar-meaning/)
assert.match(diagnosticSource, /item\.promptJa && item\.meaningCueRequired/)
assert.match(diagnosticSource, /<GrammarChoiceExplanations/)
assert.match(choiceExplanationsSource, /選択肢解説（4択すべて）/)
assert.match(choiceExplanationsSource, /choices\.map/)
assert.match(choiceExplanationsSource, /data-choice-correct/)
assert.match(choiceExplanationsSource, /grammarChoiceExplanationFor/)

console.log('✅ 英文法の全解説監査OK')
console.log(`  読んで学ぶ文法レッスン: ${GRAMMAR_LESSONS.length}/${GRAMMAR_LESSONS.length}（形・判断・例文・注意点）`)
console.log(`  問題別の正答根拠: ${GRAMMAR.length}/${GRAMMAR.length}`)
console.log(`  問題・4択・答えの一意性: ${uniqueAnswerCount}/${GRAMMAR.length}`)
console.log(`  入試型の問われ方固有の決め手: ${examQuestionCount}/${examQuestionCount}（${examFocuses.size}種類）`)
console.log(`  意味・構造の取り違え回帰: ${focusRegressionCases.length}/${focusRegressionCases.length}`)
console.log(`  正解を含む選択肢別の根拠: ${allChoiceReasonCount}/${GRAMMAR.length * 4}（正解${correctChoiceReasonCount}・誤答${choiceMismatchCount}）`)
console.log(`  解答前の和訳: 意味判断${meaningCueQuestionCount}問・語形のみ非表示${formOnlyQuestionCount}問`)
console.log(`  命令文の先頭語競合: ${imperativeOpenerCollisionCount}件`)
console.log(`  4段解説の回答経路: 正答${correctPaths}・誤答${wrongPaths}・わからない${unknownPaths}（計${correctPaths + wrongPaths + unknownPaths}）`)
