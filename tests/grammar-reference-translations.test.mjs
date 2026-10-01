// 文法の参考書の例文と和訳の食いちがいを守るテスト（requests/2026-10-01-grammar-reference-translations.json）。
//
// 2026-10-01、準2級の関係副詞 'I still remember the summer when we first met.' の和訳が「…初めて会った日…」、
// 間接疑問 'I wonder whether it will snow this evening.' が「午後に雨が降るだろうか。」、関係代名詞 what の
// '… twenty years ago.' が「…10年前…」になっていた。参考書の全ページと、参考書に結び付く文法の問題を1件ずつ読むと、
// 多くは同じ単元の語法問題と並び替え問題のあいだで和訳や狙いが入れかわったものだった。直したものは台帳
// docs/audits/grammar-reference-translations.json にあり、ここで次を守る。
//   読んだ記録     … 全152ページ（127単元＋25系統）の組・地の文・結び付く問題が、読んだときの指紋のまま
//   直したもの     … 直した和訳・本文・狙い・解説が、直す前に戻っていない
//   語法問題       … 385問すべてが、参考書の「語と語の決まった結び付き」の例文と英文・和訳とも同じ
//   手がかり       … 数・人名・時・天気・物の名前・彼と彼女と、語法の狙いの語で拾う候補は、直したか理由がある
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { GRAMMAR_REFERENCE_UNITS, GRAMMAR_STRAND_REFERENCES, grammarReferenceFor } from '../src/data/grammar-reference/index.js'
import { GRAMMAR_PRACTICE } from '../src/data/grammar.js'
import { grammarQuestionType } from '../src/data/grammar-format-expansion.js'
import {
  GRAMMAR_REFERENCE_TRANSLATION_REVIEW_PATH,
  focusClues,
  translationClues,
  translationReview,
} from '../scripts/checks/grammar-reference-translations.mjs'

const ledger = JSON.parse(readFileSync(GRAMMAR_REFERENCE_TRANSLATION_REVIEW_PATH, 'utf8'))
const review = translationReview(ledger)
const itemById = new Map(GRAMMAR_PRACTICE.map((item) => [item.id, item]))
const RESTAMP = 'ページを読み直してから node scripts/checks/grammar-reference-translations.mjs --stamp'

test('見つけていた準2級の3件は、英文どおりの和訳になっている', () => {
  const known = [
    ['gref_pre2_reladv', 'I still remember the summer when we first met.', '私は今でも、私たちが初めて会った夏を覚えています。', '私は今でも初めて会った日を覚えています。'],
    ['gref_pre2_indirect', 'I wonder whether it will snow this evening.', '今晩、雪が降るだろうか。', '午後に雨が降るだろうか。'],
    ['gref_pre2_what', 'The city is very different from what it was twenty years ago.', 'その都市は20年前とはすっかりちがいます。', 'その町は10年前とはすっかりちがいます。'],
  ]
  for (const [page, en, ja, wrong] of known) {
    const shown = [
      ...review.pairs.filter((pair) => pair.page === page && pair.en === en),
      ...review.quiz.filter((item) => item.en === en),
    ]
    assert.ok(shown.length >= 2, `${en}: 参考書のページと語法問題の両方にある`)
    for (const source of shown) {
      assert.equal(source.ja, ja, `${source.where ?? source.id}: ${en}`)
      assert.notEqual(source.ja, wrong)
    }
  }
})

test('全152ページの英文と和訳・地の文・結び付く問題を読んだ記録があり、読んだあとに変わったページがない', () => {
  assert.equal(GRAMMAR_REFERENCE_UNITS.length + GRAMMAR_STRAND_REFERENCES.length, 152)
  assert.deepEqual(ledger.counts, {
    pages: 152,
    pairs: 1_552,
    texts: 2_442,
    quizSentences: 1_523,
    usageFocus: 385,
  })
  assert.deepEqual(
    {
      pages: Object.keys(review.fingerprints).length,
      pairs: review.pairs.length,
      texts: review.texts.length,
      quizSentences: review.quiz.length,
      usageFocus: review.quiz.filter((item) => item.type === 'usage').length,
    },
    ledger.counts,
    `数が読んだときとちがう。${RESTAMP}`,
  )
  assert.deepEqual(review.changedPages, [], `読んだあとに変わったページ。${RESTAMP}`)
  assert.deepEqual(review.removedPages, [])
})

test('直した和訳・本文・狙い・解説は、直す前に戻っていない', () => {
  const { pairs, texts, quizJa, quizFocus, quizExplain } = ledger.fixes
  assert.deepEqual(
    [pairs.length, texts.length, quizJa.length, quizFocus.length, quizExplain.length],
    [13, 21, 22, 22, 3],
  )
  for (const fix of pairs) {
    const shown = review.pairs.filter((pair) => pair.page === fix.page && pair.en === fix.en)
    assert.ok(shown.length, `${fix.page}: ${fix.en} がない`)
    for (const pair of shown) assert.equal(pair.ja, fix.after, `${fix.page} ${pair.where}: ${fix.en}`)
    assert.ok(fix.why, `${fix.page}: 直した理由がない`)
  }
  for (const fix of texts) {
    const onPage = review.texts.filter((text) => text.page === fix.page).map((text) => text.text)
    assert.ok(onPage.includes(fix.after), `${fix.page} ${fix.where}: 直した本文がない`)
    assert.ok(!onPage.includes(fix.before), `${fix.page} ${fix.where}: 直す前の本文に戻っている`)
    assert.ok(fix.why, `${fix.page}: 直した理由がない`)
  }
  for (const fix of quizJa) assert.equal(itemById.get(fix.id)?.sentence.ja, fix.after, `${fix.id}: ${fix.en}`)
  for (const fix of quizFocus) assert.equal(itemById.get(fix.id)?.focus, fix.after, `${fix.id}: 狙い`)
  for (const fix of quizExplain) {
    const item = itemById.get(fix.id)
    assert.equal(fix.choice ? item.choiceNotes[fix.choice] : item.explain, fix.after, `${fix.id}: 解説`)
  }
})

test('語法問題385問は、参考書の「語と語の決まった結び付き」の例文と英文・和訳とも同じ', () => {
  const usage = GRAMMAR_PRACTICE.filter((item) => grammarQuestionType(item) === 'usage')
  assert.equal(usage.length, 385)
  for (const item of usage) {
    const unit = grammarReferenceFor(item.level, item.topic)
    const point = unit?.points.find((candidate) => candidate.title === '語と語の決まった結び付き')
    assert.ok(point, `${item.id}: 参考書の結び付きのポイントがない`)
    const example = point.examples.find((candidate) => candidate.en === item.sentence.en)
    assert.ok(example, `${item.id}: ${item.sentence.en} が参考書の例文にない`)
    assert.equal(example.ja, item.sentence.ja, `${item.id}: 参考書の例文と和訳がちがう`)
  }
})

test('数・人名・時・天気・物の名前・彼と彼女の手がかりで拾った和訳は、すべて直したか理由がある', () => {
  assert.deepEqual(review.unexplained.map((group) => `${group.key} ${group.en} / ${group.ja}: ${group.clues.join('・')}`), [])
  assert.deepEqual(review.stale, [], '拾われなくなった組の理由が台帳に残っている')
  for (const [key, why] of Object.entries(ledger.exceptions)) assert.match(why, /[ぁ-んァ-ヶ一-龠]/u, `${key}: 理由がない`)
})

test('語法問題の狙い（参考書の本文に並ぶ結び付き）は、例文とちがう語を言っていない（言うものは理由がある）', () => {
  assert.deepEqual(review.unexplainedFocus.map((item) => `${item.id} ${item.focus}: ${item.clues.join('・')}`), [])
  assert.deepEqual(review.staleFocus, [], '拾われなくなった狙いの理由が台帳に残っている')
})

test('手がかりは、見つけた食いちがいの型を拾う', () => {
  const wrong = [
    ['I wonder whether it will snow this evening.', '午後に雨が降るだろうか。', /snow/u],
    ['The city is very different from what it was twenty years ago.', 'その町は10年前とはすっかりちがいます。', /数/u],
    ['I still remember the summer when we first met.', '私は今でも初めて会った日を覚えています。', /summer/u],
    ['Our teacher teaches us science on Mondays.', '先生は金曜日に私たちに音楽を教えます。', /monday/u],
    ['I know who broke the vase.', '私はだれが窓を割ったか知っています。', /vase/u],
    ['She is what is called a born teacher.', '彼はいわゆる生まれながらの指導者です。', /彼と彼女/u],
    ['He acts as if he were the manager here.', '彼女はまるでここの持ち主であるかのようにふるまいます。', /彼と彼女/u],
  ]
  for (const [en, ja, clue] of wrong) assert.match(translationClues({ en, ja }).join(' '), clue, `${en} / ${ja}`)
  // 正しい和訳は拾わない。
  assert.deepEqual(translationClues({ en: 'I wonder whether it will snow this evening.', ja: '今晩、雪が降るだろうか。' }), [])

  assert.match(focusClues('電車に乗って行くは take a train', 'I took a bus which goes to the airport.').join(' '), /train/u)
  assert.match(focusClues('電車が出発するは leave', 'Do you know when the bus leaves?').join(' '), /train（狙いの日本語/u)
  assert.match(focusClues('会議を開くは hold a meeting', 'The ceremony is to be held on Friday afternoon.').join(' '), /meeting/u)
  assert.deepEqual(focusClues('バスに乗って行くは take a bus', 'I took a bus which goes to the airport.'), [])
})
