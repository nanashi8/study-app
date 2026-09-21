// 品詞のある全見出し語を「ほかの品詞の形」「関連語の使い分け」「同じ品詞の派生語」「別の品詞の意味」について
// 1語ずつ読んだ記録が、母集団の全語をおおっているか。見出し語を足すと、その語を読んで
// docs/audits/word-forms-review.json に入れるまで止まる（入れ方は scripts/word-forms-review-apply.mjs）。
import assert from 'node:assert/strict'
import test from 'node:test'
import { wordFormsReviewGap } from '../scripts/checks/word-forms-review.mjs'

for (const [kind, label] of [['forms', 'ほかの品詞の形'], ['usage', '関連語の使い分け'], ['derivatives', '同じ品詞の派生語'], ['secondary', '別の品詞の意味']]) {
  test(`品詞のある全見出し語を、${label}について1語ずつ読んだ`, async () => {
    const gap = await wordFormsReviewGap({ kind })
    assert.deepEqual(gap.missing, [], 'まだ読んでいない語')
    assert.deepEqual(gap.stale, [], '辞書にない id')
    assert.equal(gap.reviewed, gap.population)
    if (kind === 'derivatives') {
      // 語尾の規則で拾った派生語の候補は、載せるか、載せない理由（略号）を1件ずつ書いてある。
      assert.deepEqual(gap.undecided, [], '載せず理由もない候補')
      assert.deepEqual(gap.staleSkips, [], '候補でなくなった理由の行')
      assert.deepEqual(gap.badCodes, [], '略号がちがう行')
    }
  })
}
