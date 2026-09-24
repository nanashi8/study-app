// 依頼 2026-09-24-classics-enrich の条件 koten-grammar-questions。
// 全古典文法項目に、本文の中で見抜く文脈問題を1問以上持たせ、教材の4択すべてに問題ごとの説明を書く。
// 本文は項目の用例と別の文にし、問題どうしでも使い回さない。
import test from 'node:test'
import assert from 'node:assert/strict'

import { KOTEN_GRAMMAR, KOTEN_GRAMMAR_BY_ID } from '../src/data/koten-grammar.js'
import {
  KOTEN_GRAMMAR_CONTEXT_QUESTIONS,
  KOTEN_GRAMMAR_FOUNDATION_QUESTIONS,
  KOTEN_GRAMMAR_QUESTIONS,
} from '../src/data/koten-grammar-questions.js'
import { KOTEN_GRAMMAR_CONTEXT_MORE } from '../src/data/koten-grammar-questions-more.js'
import { kotenGrammarChoiceNoteFor } from '../src/lib/kotenGrammarChoiceNotes.js'

const normalize = (text) => String(text ?? '').replace(/\s+/gu, '')

test('古典文法の文脈問題：全130項目に、本文の中で見抜く問題が1問以上ある', () => {
  assert.equal(KOTEN_GRAMMAR_CONTEXT_QUESTIONS.length, 62 + 72)
  assert.equal(KOTEN_GRAMMAR_CONTEXT_MORE.length, 72)
  const covered = new Set(KOTEN_GRAMMAR_CONTEXT_QUESTIONS.flatMap((question) => question.grammarIds))
  const missing = KOTEN_GRAMMAR.filter((item) => !covered.has(item.id)).map((item) => item.id)
  assert.deepEqual(missing, [], '文脈問題のない項目がある')
  // 追加の問題は、1問ずつ別の項目を主に問う（最初の id が重ならない）。
  const leads = KOTEN_GRAMMAR_CONTEXT_MORE.map((question) => question.grammarIds[0])
  assert.equal(new Set(leads).size, leads.length, '追加の文脈問題が同じ項目を重ねて問うている')
  // 基礎問題も全項目にある。
  assert.deepEqual(
    new Set(KOTEN_GRAMMAR_FOUNDATION_QUESTIONS.map((question) => question.grammarIds[0])),
    new Set(KOTEN_GRAMMAR.map((item) => item.id)),
  )
})

test('古典文法の文脈問題：4択・正解1つ・全選択肢に問題ごとの説明がある', () => {
  let notes = 0
  for (const question of KOTEN_GRAMMAR_QUESTIONS) {
    assert.equal(question.choices.length, 4, question.id)
    assert.equal(new Set(question.choices).size, 4, `${question.id}: 選択肢が重なっている`)
    assert.ok(question.choices.includes(question.answer), `${question.id}: 正解が選択肢にない`)
    assert.ok(question.grammarIds.every((id) => KOTEN_GRAMMAR_BY_ID[id]), `${question.id}: 項目がない`)
    assert.ok(normalize(question.passage) && normalize(question.question) && normalize(question.explanation), question.id)
    const texts = question.choices.map((choice) => normalize(kotenGrammarChoiceNoteFor(question, choice)))
    texts.forEach((text, index) => assert.ok(text.length >= 5, `${question.id}「${question.choices[index]}」の説明がない`))
    assert.equal(new Set(texts).size, 4, `${question.id}: 選択肢の説明が重なっている`)
    notes += texts.length
  }
  assert.equal(notes, KOTEN_GRAMMAR_QUESTIONS.length * 4)
  // 追加の問題は、選択肢と説明を同じ所に書き、説明の書かれていない選択肢を作らない。
  for (const entry of KOTEN_GRAMMAR_CONTEXT_MORE) {
    assert.ok(Object.hasOwn(entry.choices, entry.answer), `${entry.id}: 正解の説明がない`)
    for (const [choice, note] of Object.entries(entry.choices)) {
      assert.ok(normalize(note).length >= 10, `${entry.id}「${choice}」の説明が短い`)
    }
  }
})

test('古典文法の文脈問題：本文は項目の用例と別で、問題どうしでも使い回さない', () => {
  const examples = new Map(KOTEN_GRAMMAR.map((item) => [normalize(item.example.ja), item.id]))
  assert.equal(examples.size, KOTEN_GRAMMAR.length, '項目の用例が重なっている')
  const passages = new Map()
  for (const question of KOTEN_GRAMMAR_CONTEXT_QUESTIONS) {
    const key = normalize(question.passage)
    assert.equal(examples.get(key), undefined, `${question.id} の本文が ${examples.get(key)} の用例と同じ`)
    assert.equal(passages.get(key), undefined, `${question.id} と ${passages.get(key)} が同じ本文`)
    passages.set(key, question.id)
  }
})

test('古典文法の説明：已然形と書いた形はエ段（または「しか」「ましか」）で終わり、ア段＋「ば」を確定と書かない', () => {
  const texts = [
    ...KOTEN_GRAMMAR.flatMap((item) => [item.forms, item.connection, item.meaning, item.summary, item.usage, item.background]),
    ...KOTEN_GRAMMAR_QUESTIONS.flatMap((question) => [
      question.explanation,
      ...question.choices.map((choice) => kotenGrammarChoiceNoteFor(question, choice)),
    ]),
  ].filter(Boolean)
  const E_ROW = /[えけせてねへめれゑげぜでべぺ]$/u
  for (const text of texts) {
    for (const match of text.matchAll(/已然形「([^」]+)」/gu)) {
      const form = match[1]
      assert.ok(E_ROW.test(form) || /しか$/u.test(form), `「${match[0]}」：已然形がエ段で終わっていない（${text}）`)
    }
    for (const match of text.matchAll(/「[^」]*[あかさたなはまやらわがざだばぱ]ば」[^。]*確定/gu)) {
      assert.fail(`ア段＋「ば」を確定と書いている：${match[0]}`)
    }
  }
})
