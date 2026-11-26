// 変化形の台帳（src/data/word-inflections.js）が、品詞が名・動・形・副の全見出し語の全品詞をおおい、
// 書き方の決まりに合っているか。見出し語や品詞を足すと、その語の変化形を決めて台帳に書くまで止まる。
import assert from 'node:assert/strict'
import test from 'node:test'
import { wordInflectionGap } from '../scripts/checks/word-inflections.mjs'
import { WORD_INFLECTIONS } from '../src/data/word-inflections.js'

test('全見出し語の全品詞の変化形を台帳に書いた', () => {
  const gap = wordInflectionGap()
  assert.deepEqual(gap.missing, [], 'まだ決めていない組')
  assert.deepEqual(gap.extra, [], '母集団にない組（見出し語・品詞がなくなった）')
  assert.deepEqual(gap.badValues, [], '書き方の決まりに合わない値')
  assert.deepEqual(gap.badBases, [], 'of: の元の語が見出し語にない')
  assert.equal(gap.covered, gap.population)
  // 2026-11-26 に全組を1語ずつ読んだときの母集団（8,820語・9,601組）より減っていない。
  assert.ok(gap.population >= 9601, `母集団 ${gap.population}`)
})

test('1語ずつ決めた不規則な形・数えない名詞・比較変化しない語が台帳に入っている', () => {
  const W = WORD_INFLECTIONS
  assert.equal(W.run.動, 'runs|ran|run|running')
  assert.equal(W.lie_2.動.split('#')[0], 'lies|lay|lain|lying')
  assert.equal(W.travel.動, 'travels|traveled/英travelled|traveled/英travelled|traveling/英travelling')
  assert.equal(W.control.動, 'controls|controlled|controlled|controlling')
  assert.equal(W.panic.動, 'panics|panicked|panicked|panicking')
  assert.equal(W.is.動, 'of:be:3単現')
  assert.equal(W.can.動, '助:could')
  assert.equal(W.child.名, 'C:children')
  assert.equal(W.criterion.名, 'C:criteria')
  assert.equal(W.information.名, 'U')
  assert.equal(W.sheep.名, 'C:sheep')
  assert.match(W.people.名, /^PL/)
  assert.equal(W.japan.名, 'P')
  assert.equal(W.good.形, 'better|best')
  assert.equal(W.beautiful.形, 'more|most')
  assert.equal(W.big.形, 'bigger|biggest')
  assert.equal(W.unique.形, '-')
  assert.equal(W.better.形.split('#')[0], 'of:good:比較級')
  // 意味欄の品詞の印で加わる品詞（water「〜に水をやる(動)」）
  assert.equal(W.water.動, 'waters|watered|watered|watering')
})
