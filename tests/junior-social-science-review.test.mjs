// 社会・理科の全102単元の内容を精査したことの確認
// （依頼台帳 requests/2026-09-30-subject-katakana-quality.json の content-review）。
// 2026-09-30 利用者「コンテンツの品質を精査しなさい。」
// 1単元ずつ、めあて・要点・図と図の読み方・語句・演習を読み、事実・数値・年代・用語・表記・中学の範囲・日本語、
// 要点と図と語句と演習の食いちがい、問題の正誤を確かめた。記録は docs/audits/junior-social-science-review.json。
import test from 'node:test'
import assert from 'node:assert/strict'
import { ALL_SUBJECT_UNITS } from '../src/data/subjects/index.js'
import { readReviewLedger, reviewLedgerProblems } from '../scripts/checks/junior-social-science-review.mjs'

test('全102単元を読み直した記録と、今の中身が一致する', () => {
  assert.equal(ALL_SUBJECT_UNITS.length, 102)
  assert.deepEqual(reviewLedgerProblems(), [])
})

test('見つけた誤りと直し方が、単元ごとに記録されている', () => {
  const ledger = readReviewLedger()
  assert.ok(Array.isArray(ledger.fixes))
  for (const fix of ledger.fixes) {
    assert.ok(fix.unit && fix.what && fix.fix, JSON.stringify(fix))
  }
})
