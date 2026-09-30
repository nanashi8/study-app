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

// 文の区切りや記号を除いた文字で比べる。
const plain = (text) => text.replace(/[。、・，,（）()「」『』\s]/g, '')
/** a のうち、b にひと続きで出てくる最も長い部分。 */
const longestCommon = (a, b) => {
  let best = ''
  for (let i = 0; i < a.length; i += 1) {
    for (let j = i + best.length + 1; j <= a.length; j += 1) {
      if (b.includes(a.slice(i, j))) best = a.slice(i, j)
      else break
    }
  }
  return best
}

test('解説は意味をくり返さず、背景や関連することを足している', () => {
  // 2026-09-30、意味をほとんどそのまま1文目で言い直してから中身に入る解説が134語あり、書き直した
  // （カードでは意味のすぐ下に解説が出るので、同じ文が2回続いて見える）。意味の文字の半分以上が、
  // 解説にひと続き（10字以上）で出てきたら言い直しとして止める。
  const problems = []
  for (const term of ALL_SUBJECT_TERMS) {
    if (!term.note) continue
    const meaning = plain(term.meaning)
    const common = longestCommon(meaning, plain(term.note))
    if (common.length >= 10 && common.length / meaning.length >= 0.5) {
      problems.push(`${term.id}（${term.term}）: 解説が意味を言い直している（「${common}」）`)
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
