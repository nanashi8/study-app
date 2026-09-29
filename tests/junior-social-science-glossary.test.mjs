// 社会・理科の重要語句の解説を、中学生向けの用語集の程度にしたことの確認
// （依頼台帳 requests/2026-09-30-subject-figures-glossary.json の glossary-terms）。
// 2026-09-30 利用者「中学生の理科・社会に用語集があるならば、その程度の解説にしなさい。」
// 中学生向けの用語集（旺文社『中学社会 用語・資料集』『中学理科 用語・資料集』など）は、1語ごとに意味に背景・関連事項を添える。
// 語句 = [語句, 意味, { note: 解説 }]。意味は語句テストの問題文になる短い定義のまま、解説に背景・特徴・関連する語句・
// まちがえやすい語との見分け方を書く。1語ずつ読み直した記録は docs/audits/junior-social-science-glossary.json。
import test from 'node:test'
import assert from 'node:assert/strict'
import { ALL_SUBJECT_TERMS } from '../src/data/subjects/index.js'
import { glossaryLedgerProblems } from '../scripts/checks/junior-social-science-glossary.mjs'

// 解説の長さの下限（字）。用語集の1項目の程度（意味と合わせて2〜4文）に足りない短い解説を止める。
const NOTE_MIN = 50
const ENTRY_MIN = 80

test('全1,151語句（社会649・理科502）に、用語集の程度の解説がある', () => {
  assert.equal(ALL_SUBJECT_TERMS.length, 1151)
  assert.equal(ALL_SUBJECT_TERMS.filter((term) => term.subject === 'social').length, 649)
  const problems = []
  for (const term of ALL_SUBJECT_TERMS) {
    const note = term.note?.trim() ?? ''
    if (!note) {
      problems.push(`${term.id}（${term.term}）: 解説がない`)
      continue
    }
    if (note.length < NOTE_MIN) problems.push(`${term.id}（${term.term}）: 解説が短い（${note.length}字）`)
    if (term.meaning.length + note.length < ENTRY_MIN) problems.push(`${term.id}（${term.term}）: 意味と解説を合わせても短い`)
    if (!note.endsWith('。')) problems.push(`${term.id}（${term.term}）: 解説が文で終わっていない`)
  }
  assert.deepEqual(problems, [])
})

test('解説は意味をくり返さず、背景や関連することを足している', () => {
  const problems = []
  for (const term of ALL_SUBJECT_TERMS) {
    if (!term.note) continue
    const firstMeaning = term.meaning.split('。')[0]
    if (term.note.includes(term.meaning) || (firstMeaning.length >= 10 && term.note.startsWith(firstMeaning))) {
      problems.push(`${term.id}（${term.term}）: 解説が意味の文をくり返している`)
    }
  }
  assert.deepEqual(problems, [])
})

test('同じ解説の文を、ちがう語句に使い回していない', () => {
  const seen = new Map()
  const problems = []
  for (const term of ALL_SUBJECT_TERMS) {
    if (!term.note) continue
    for (const sentence of term.note.split('。').map((part) => part.trim()).filter((part) => part.length >= 25)) {
      if (seen.has(sentence) && seen.get(sentence) !== term.id) problems.push(`${term.id} と ${seen.get(sentence)}: 「${sentence}」`)
      seen.set(sentence, term.id)
    }
  }
  assert.deepEqual(problems, [])
})

test('全語句の解説を1語ずつ読み直した記録と、今の解説が一致する', () => {
  assert.deepEqual(glossaryLedgerProblems(), [])
})
