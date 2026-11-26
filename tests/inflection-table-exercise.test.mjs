// 語形変化の表の問題の答え方：空所を押して選び、タイルを押して入れ、3か所が埋まったら答え合わせ。
// 入れた語は「|」でつないで GrammarQuiz の答えになり、round.answer と同じなら正解になる。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test, { after, before } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { inflectionQuestions, inflectionRound } from '../src/lib/inflectionQuiz.js'

let vite
let InflectionTableExercise
let InflectionTableExplanations
let splitFills
before(async () => {
  vite = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
  ;({ InflectionTableExercise, InflectionTableExplanations, splitFills } = await vite.ssrLoadModule('/src/components/InflectionTableExercise.jsx'))
})
after(async () => {
  await vite?.close()
})

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const round = inflectionRound(inflectionQuestions()[0], () => 0.42)

test('表は空所3か所をボタンで、ほかのマスは形を出し、タイルを並べる', () => {
  const html = renderToStaticMarkup(React.createElement(InflectionTableExercise, { item: round, value: '', onChange: () => {} }))
  assert.equal((html.match(/data-inflection-blank="/g) ?? []).length, 3)
  assert.equal((html.match(/data-inflection-tile="/g) ?? []).length, round.bank.length)
  for (const row of round.rows) assert.match(html, new RegExp(`data-inflection-table-row="${row.wordId}"`))
})

test('入れた語が答えと同じなら正解として印が付き、答え合わせの説明が空所ごとに出る', () => {
  const answers = round.answer.split('|')
  assert.deepEqual(splitFills(round.answer, 3), answers)
  const wrong = [answers[0], answers[1], round.bank.find((tile) => !answers.includes(tile)) ?? 'x'].join('|')
  const checked = renderToStaticMarkup(React.createElement(InflectionTableExercise, { item: round, value: wrong, checked: true }))
  assert.match(checked, /border-emerald-400/)
  assert.match(checked, /border-rose-400/)
  const notes = renderToStaticMarkup(React.createElement(InflectionTableExplanations, { item: round, value: wrong }))
  assert.equal((notes.match(/data-inflection-blank-explanation="/g) ?? []).length, 3)
  assert.match(notes, /あなたの答え/)
})

test('GrammarQuiz は表の問題を、並べ替えと同じく「答え合わせ」で答え、選択肢の説明のかわりに空所ごとの解説を出す', () => {
  const quiz = read('src/screens/GrammarQuiz.jsx')
  assert.match(quiz, /const tableQuestion = Boolean\(item\.table\)/)
  assert.match(quiz, /<InflectionTableExercise/)
  assert.match(quiz, /onClick=\{draftQuestion && \(!answered \|\| rearranging\) \? \(\) => choose\(activeOrderDraft\.text\) : next\}/)
  assert.match(quiz, /\{tableQuestion && <InflectionTableExplanations/)
  const deck = read('src/lib/grammarDeck.js')
  assert.match(deck, /item\.table \? inflectionRound\(item, rng\) : item/)
})
