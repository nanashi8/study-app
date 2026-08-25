import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  CARD_SWIPE_MIN_DISTANCE,
  cardIndexAfterSwipe,
  cardSwipeDirection,
} from '../src/lib/cardSwipe.js'

const CARD_SCREENS = [
  'VocabStudy.jsx',
  'PhraseStudy.jsx',
  'KotenStudy.jsx',
  'KotenGrammarStudy.jsx',
  'KotenCultureStudy.jsx',
  'KanbunStudy.jsx',
]

test('横方向へ十分に動かした操作だけをカードスワイプと判定する', () => {
  assert.equal(cardSwipeDirection({ x: 250, y: 100 }, { x: 120, y: 108 }), 'next')
  assert.equal(cardSwipeDirection({ x: 120, y: 100 }, { x: 250, y: 92 }), 'previous')
  assert.equal(cardSwipeDirection({ x: 100, y: 100 }, { x: 100 + CARD_SWIPE_MIN_DISTANCE - 1, y: 100 }), null)
  assert.equal(cardSwipeDirection({ x: 100, y: 100 }, { x: 160, y: 180 }), null)
})

test('カード番号はデッキの先頭と末尾を越えない', () => {
  assert.equal(cardIndexAfterSwipe(0, 5, 'previous'), 0)
  assert.equal(cardIndexAfterSwipe(0, 5, 'next'), 1)
  assert.equal(cardIndexAfterSwipe(4, 5, 'next'), 4)
  assert.equal(cardIndexAfterSwipe(4, 5, 'previous'), 3)
})

test('全暗記カードが共通のスワイプ領域と省スペース判定欄を使う', () => {
  const controls = readFileSync(
    new URL('../src/components/CardStudyControls.jsx', import.meta.url),
    'utf8',
  )
  assert.match(controls, /touch-pan-y/)
  assert.match(controls, /event\.target\?\.closest\?\./)
  assert.match(controls, /px-4 py-2/)

  for (const filename of CARD_SCREENS) {
    const source = readFileSync(
      new URL(`../src/screens/${filename}`, import.meta.url),
      'utf8',
    )
    assert.match(source, /CardSwipeRegion/, `${filename} に左右スワイプがない`)
    assert.match(source, /CardStudyFooter/, `${filename} の判定欄が共通化されていない`)
  }
})
