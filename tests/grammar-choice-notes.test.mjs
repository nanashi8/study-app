import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  GRAMMAR,
  GRAMMAR_PRACTICE,
  getGrammar,
} from '../src/data/grammar.js'
import { GRAMMAR_CHOICE_NOTES } from '../src/data/grammar-choice-notes.js'
import { grammarQuestionType } from '../src/data/grammar-format-expansion.js'
import { grammarChoiceNoteFor } from '../src/lib/grammarChoiceNotes.js'

const choiceQuestions = GRAMMAR_PRACTICE.filter((item) => grammarQuestionType(item) !== 'word-order')

test('選択式の英文法4,049問は、出題する4つの選択肢すべてに問題ごとの解説を持つ', () => {
  let noteCount = 0
  for (const item of choiceQuestions) {
    for (const choice of item.choices) {
      assert.match(grammarChoiceNoteFor(item, choice), /[ぁ-んァ-ヶ一-龠]/u, `${item.id}: ${choice}`)
      noteCount += 1
    }
  }
  assert.equal(choiceQuestions.length, 4_049)
  assert.equal(noteCount, 16_196)
})

test('自動生成の問題は問題データが、それ以外は台帳が説明を持ち、台帳に古い選択肢が残らない', () => {
  const byId = new Map(GRAMMAR_PRACTICE.map((item) => [item.id, item]))
  for (const item of GRAMMAR.filter((candidate) => candidate.id.startsWith('gr_auto_'))) {
    assert.deepEqual(Object.keys(item.choiceNotes), item.choices, item.id)
    assert.equal(GRAMMAR_CHOICE_NOTES[item.id], undefined, item.id)
  }
  for (const [id, notes] of Object.entries(GRAMMAR_CHOICE_NOTES)) {
    const item = byId.get(id)
    assert.ok(item, id)
    assert.deepEqual(Object.keys(notes).sort(), [...item.choices].sort(), id)
  }
})

test('選択肢解説は、その選択肢がこの文で正しい・合わない理由を書く', () => {
  const cases = [
    ['gr_5_be_1', 'is', /主語 I には使わない/u],
    ['gr_5_plural_1', 'boxs', /es を付ける/u],
    ['gr_auto_4_used_to_001', 'was used to', /慣れていた/u],
    ['gr_pre2_caus_2', 'cutting', /切られる側/u],
    ['gr_exam_eiken_5_present_negative_004', 'not do', /must not do/u],
    ['gr_depth_pre1_agree_01', 'are', /中心は単数の One/u],
    ['gr_auto_2_conjunctive_adverb_001', 'nevertheless', /反対の内容/u],
  ]
  for (const [id, choice, expected] of cases) {
    const item = getGrammar(id)
    assert.ok(item?.choices.includes(choice), `${id}: ${choice}`)
    assert.match(grammarChoiceNoteFor(item, choice), expected, `${id}: ${choice}`)
  }
})

test('誤答に置くと文として成り立ってしまう形は、誤答から外してある', () => {
  // イギリス英語では要求・提案の that 節に revises・revised も使うので、生成問題の誤答は文の動詞にならない形にする。
  for (const item of GRAMMAR.filter((candidate) => candidate.pattern === 'auto:1_mandative')) {
    assert.ok(!item.choices.some((choice) => /s$|ed$/.test(choice) && !choice.includes(' ') && choice !== item.answer), item.id)
  }
  // get＋人＋-ing 形・enable＋人＋-ing 形は文として読めるので、-ing 形を誤答にしない。
  for (const pattern of ['auto:2_causative_get', 'auto:2_inanimate_subject']) {
    for (const item of GRAMMAR.filter((candidate) => candidate.pattern === pattern)) {
      assert.ok(!item.choices.some((choice) => choice.endsWith('ing')), item.id)
    }
  }
  // a series of＋複数名詞は複数の動詞で受ける使い方も辞書に載っているので、一致の問題に使わない。
  for (const item of GRAMMAR.filter((candidate) => candidate.topic === '一致' || candidate.topic === '主語と動詞の一致')) {
    assert.doesNotMatch(item.q, /^A (series|set) of/, item.id)
  }
  // no better A than B も文として成り立つので、クジラ構文の誤答に better を置かない。
  for (const item of GRAMMAR.filter((candidate) => /no ___ .* than /.test(candidate.q))) {
    assert.ok(!item.choices.includes('better'), item.id)
  }
  // Let’s don’t はアメリカ英語のくだけた言い方で使われる。
  assert.ok(!getGrammar('gr_exam_eiken_5_imperative_1_006').choices.includes('don’t'))
})

test('英文法の答え合わせは、共通の選択肢解説の部品で出題した選択肢をすべて並べる', async () => {
  const [screenSource, explanationsSource] = await Promise.all([
    readFile(new URL('../src/screens/GrammarQuiz.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/GrammarChoiceExplanations.jsx', import.meta.url), 'utf8'),
  ])
  assert.match(screenSource, /<GrammarChoiceExplanations/)
  assert.match(screenSource, /choices=\{options\}/)
  assert.match(explanationsSource, /<ChoiceExplanations/)
  assert.match(explanationsSource, /選択肢解説（\$\{choices\.length\}択すべて）/)
  assert.match(explanationsSource, /grammarChoiceNoteFor\(item, choice\)/)
  assert.doesNotMatch(explanationsSource, /この形の使い方|この形は使わない|別の場面で使う/)
})
