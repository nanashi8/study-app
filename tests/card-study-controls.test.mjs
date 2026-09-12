import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  CARD_SWIPE_MIN_DISTANCE,
  SWIPE_AXIS_LOCK_DISTANCE,
  SWIPE_FLICK_MIN_DISTANCE,
  beginSwipeGesture,
  cardIndexAfterSwipe,
  cardSwipeDirection,
  finishSwipeGesture,
  moveSwipeGesture,
  swipeGestureOffset,
} from '../src/lib/cardSwipe.js'

const CARD_SCREENS = [
  'VocabStudy.jsx',
  'PhraseStudy.jsx',
  'KotenStudy.jsx',
  'KotenGrammarStudy.jsx',
  'KotenCultureStudy.jsx',
  'KanbunStudy.jsx',
]

// 時刻つきの点列で指の動きを再現し、最後の点で離したときの判定を返す。
function swipeAlong(points) {
  const [first, ...rest] = points
  const last = rest.pop()
  const gesture = beginSwipeGesture(first)
  for (const point of rest) moveSwipeGesture(gesture, point)
  return finishSwipeGesture(gesture, last)
}

test('横方向へ十分に動かした操作だけをカードスワイプと判定する', () => {
  assert.equal(cardSwipeDirection({ x: 250, y: 100 }, { x: 120, y: 108 }), 'next')
  assert.equal(cardSwipeDirection({ x: 120, y: 100 }, { x: 250, y: 92 }), 'previous')
  assert.equal(cardSwipeDirection({ x: 100, y: 100 }, { x: 100 + CARD_SWIPE_MIN_DISTANCE - 1, y: 100 }), null)
  assert.equal(cardSwipeDirection({ x: 100, y: 100 }, { x: 160, y: 180 }), null)
})

test('短くても素早くはじけばスワイプ、ゆっくり少し動かしただけならスワイプにしない', () => {
  // 24px を 60ms ではじく
  assert.equal(swipeAlong([
    { x: 200, y: 300, t: 0 },
    { x: 192, y: 301, t: 20 },
    { x: 184, y: 302, t: 40 },
    { x: 176, y: 302, t: 60 },
  ]), 'next')
  // 同じ 24px を 600ms かけて動かす
  assert.equal(swipeAlong([
    { x: 200, y: 300, t: 0 },
    { x: 192, y: 301, t: 200 },
    { x: 184, y: 302, t: 400 },
    { x: 176, y: 302, t: 600 },
  ]), null)
  // 速くても、はじいたと見なす距離に届かない
  assert.equal(swipeAlong([
    { x: 200, y: 300, t: 0 },
    { x: 200 + SWIPE_FLICK_MIN_DISTANCE - 1, y: 300, t: 10 },
  ]), null)
})

test('横と決まったあとは縦へずれても取りこぼさず、縦から始めた動きはスクロールのままにする', () => {
  // 親指で弧を描くように、横へ引き始めてから大きく下へずれる
  assert.equal(swipeAlong([
    { x: 300, y: 200, t: 0 },
    { x: 285, y: 204, t: 30 },
    { x: 255, y: 230, t: 90 },
    { x: 240, y: 262, t: 150 },
    { x: 230, y: 290, t: 210 },
  ]), 'next')
  // 縦に動かし始めてから横へ流れる
  assert.equal(swipeAlong([
    { x: 100, y: 200, t: 0 },
    { x: 104, y: 215, t: 30 },
    { x: 170, y: 240, t: 120 },
    { x: 220, y: 250, t: 200 },
  ]), null)
})

test('引いたあと戻す向きへはじいたら、スワイプをやめたと見なす', () => {
  assert.equal(swipeAlong([
    { x: 300, y: 200, t: 0 },
    { x: 280, y: 200, t: 40 },
    { x: 230, y: 200, t: 120 },
    { x: 245, y: 200, t: 160 },
    { x: 255, y: 200, t: 180 },
  ]), null)
})

test('横と決まるまではカードも行も動かさない', () => {
  const gesture = beginSwipeGesture({ x: 100, y: 100, t: 0 })
  moveSwipeGesture(gesture, { x: 100 - (SWIPE_AXIS_LOCK_DISTANCE - 2), y: 100, t: 10 })
  assert.equal(swipeGestureOffset(gesture), 0)
  moveSwipeGesture(gesture, { x: 70, y: 104, t: 30 })
  assert.equal(swipeGestureOffset(gesture), -30)
})

test('カード番号はデッキの先頭と末尾を越えない', () => {
  assert.equal(cardIndexAfterSwipe(0, 5, 'previous'), 0)
  assert.equal(cardIndexAfterSwipe(0, 5, 'next'), 1)
  assert.equal(cardIndexAfterSwipe(4, 5, 'next'), 4)
  assert.equal(cardIndexAfterSwipe(4, 5, 'previous'), 3)
})

test('全暗記カードと一覧の行が、指を離すまで追う共通の左右スワイプを使う', () => {
  const controls = readFileSync(
    new URL('../src/components/CardStudyControls.jsx', import.meta.url),
    'utf8',
  )
  const swipe = readFileSync(
    new URL('../src/components/useHorizontalSwipe.js', import.meta.url),
    'utf8',
  )
  assert.match(controls, /touch-pan-y/)
  assert.match(controls, /useHorizontalSwipe\(regionRef/)
  assert.match(controls, /px-4 py-2/)
  // iPhone の Safari が途中で打ち切る pointer イベントに頼らず、指はタッチイベントで追う。
  assert.match(swipe, /event\.pointerType === 'touch'/)
  assert.match(swipe, /'touchmove', onTouchMove, \{ passive: false \}/)
  // 除くのは文字入力から始めた操作だけ。ボタンや語源チップの上から始めてもスワイプできる。
  assert.match(swipe, /event\.target\?\.closest\?\.\(TEXT_ENTRY_TARGETS\)/)
  assert.doesNotMatch(swipe, /'button'|\[role="button"\]/)

  for (const filename of CARD_SCREENS) {
    const source = readFileSync(
      new URL(`../src/screens/${filename}`, import.meta.url),
      'utf8',
    )
    assert.match(source, /CardSwipeRegion/, `${filename} に左右スワイプがない`)
    assert.match(source, /CardStudyFooter/, `${filename} の判定欄が共通化されていない`)
  }
  for (const filename of ['VocabularyHistoryRow.jsx', 'LearningContentCatalog.jsx']) {
    const source = readFileSync(
      new URL(`../src/components/${filename}`, import.meta.url),
      'utf8',
    )
    assert.match(source, /useHorizontalSwipe\(rowRef/, `${filename} の行が共通の左右スワイプを使っていない`)
    assert.doesNotMatch(source, /onPointerDown=/, `${filename} に古いスワイプ判定が残っている`)
  }
})
