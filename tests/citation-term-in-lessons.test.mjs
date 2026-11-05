// 学習の本文の用語としての「出典」を、出典の表示を消す決まりと取りちがえて言い換えないこと
// （依頼台帳 requests/2026-11-05-citation-term-in-lessons.json）。
// 利用者の指示（2026-11-04）「出典の表示を削除しなさい。…」は、アプリが使った資料を示す表示を消すもの。
// 11-04 に、画面のテストが「出典」の2文字で止めていたため、地理総合 gso-20（レポートのまとめ方）と地理探究 gtk-29 の本文を
// 「使った資料」「出どころ」「引用」に言い換えていた。利用者「学習の画面に「出典」の語は出すなと指示した覚えはない」（11-05）。
//   citation-term-restored       … 言い換えた全10か所が「出典」に戻り、言い換えた形が残らない。
//   credit-display-gate-narrowed … 判定の関数（tests/credit-display.mjs）は出典の表示の形を止め、本文と語句の「出典」は通す。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { getSubjectUnit, subjectUnits } from '../src/data/subjects/index.js'
import { creditDisplays } from './credit-display.mjs'

const unitText = (id) => JSON.stringify(getSubjectUnit(id))

// 11-04 に言い換えた所（元の「出典」の形と、言い換えた形）。
const RESTORED = [
  ['gso-20', 'ほかの人の資料や統計を使ったときは、出典（何から引用したか）を必ず書く。', '資料の名前・作った人・年などの出どころを必ず書く'],
  ['gso-20', '出典（使った資料や統計）', '使った資料（資料の名前・作った人・年）'],
  ['gso-20', '目的・調べ方・結果・考察・出典の順にまとめる流れを読み取る。', '考察・使った資料の順'],
  ['gso-20', '出典を書くことは、資料をつくった人への礼儀であり、', '使った資料を書くことは'],
  ['gso-20', '"レポートなどで使った資料や統計、引用した文章のもとになったもの。"', '"ほかの人の文章や資料を、自分のレポートなどの中で使うこと。"'],
  ['gso-20', '"出典を書く"', '使った資料の名前や作った人を書く'],
  ['gso-20', '出典を書かないのは不適切である。', '使った資料を書かないのは不適切である。'],
  ['gso-20', 'ほかの人がつくった統計を使ったときは、出典を必ず書く。', '使った資料の名前や作った人を必ず書く'],
  ['gtk-29', '数値の出典・年・単位を確かめ', '数値の出どころ・年・単位'],
]

test('言い換えた学習の本文が「出典」の用語に戻り、言い換えた形は社会のどの単元にも残らない', () => {
  const social = JSON.stringify(subjectUnits('social'))
  for (const [unitId, original, replaced] of RESTORED) {
    assert.ok(unitText(unitId).includes(original), `${unitId}: 「${original}」がない`)
    assert.ok(!social.includes(replaced), `「${replaced}」が残っている`)
  }
  // 答えの台帳の根拠（10か所目）。
  const answers = readFileSync(new URL('../docs/audits/junior-social-science-answers.json', import.meta.url), 'utf8')
  assert.ok(answers.includes('他人の統計を使うときは出典を明記する。数字の改変・出典の不記載・統計の削除は不適切なので誤り。'))
  assert.ok(!answers.includes('使った資料の名前や作った人を明記する'))
  // 語句「出典」は地理総合の重要語句として学ぶ。
  const term = getSubjectUnit('gso-20').terms.find((item) => item.term === '出典')
  assert.equal(term?.meaning, 'レポートなどで使った資料や統計、引用した文章のもとになったもの。')
  assert.ok(!getSubjectUnit('gso-20').terms.some((item) => item.term === '引用'))
})

test('出典の表示の判定は、資料を示す形と資料の名前を止め、学習の本文と語句の「出典」は通す', () => {
  for (const shown of ['出典：気象庁「平年値」', '図 世界の人口（出典: 国連）', 'Natural Earth のデータ', '東京書籍『新しい社会』']) {
    assert.notDeepEqual(creditDisplays(shown), [], shown)
  }
  for (const lesson of [
    'ほかの人の資料や統計を使ったときは、出典（何から引用したか）を必ず書く。',
    '出典\nレポートなどで使った資料や統計、引用した文章のもとになったもの。',
    '資料の段階では、数値の出典・年・単位を確かめ、地図で場所ごとのちがいを見る。',
  ]) {
    assert.deepEqual(creditDisplays(lesson), [], lesson)
  }
  // メニューは、出典の行そのものを止める。
  assert.deepEqual(creditDisplays('設定\n出典', { menu: true }), ['出典'])
})
