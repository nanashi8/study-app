// 品詞のある全見出し語を「ほかの品詞の形」と「関連語の使い分け」について1語ずつ読んだ記録が、
// 母集団の全語をおおっているか。見出し語を足すと、その語を読んで
// docs/audits/word-forms-review.json に入れるまで止まる（入れ方は scripts/word-forms-review-apply.mjs）。
import assert from 'node:assert/strict'
import test from 'node:test'
import { wordFormsReviewGap } from '../scripts/checks/word-forms-review.mjs'

for (const [usage, label] of [[false, 'ほかの品詞の形'], [true, '関連語の使い分け']]) {
  test(`品詞のある全見出し語を、${label}について1語ずつ読んだ`, () => {
    const gap = wordFormsReviewGap({ usage })
    assert.deepEqual(gap.missing, [], 'まだ読んでいない語')
    assert.deepEqual(gap.stale, [], '辞書にない id')
    assert.equal(gap.reviewed, gap.population)
  })
}
