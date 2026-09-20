import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  CARD_SWIPE_MIN_DISTANCE,
  SWIPE_AXIS_LOCK_DISTANCE,
  SWIPE_FLICK_MIN_DISTANCE,
  beginSwipeGesture,
  cardSwipeDirection,
  finishSwipeGesture,
  moveSwipeGesture,
  swipeGestureOffset,
} from '../src/lib/cardSwipe.js'
import { studyAnswerGroups } from '../src/lib/studyAnswerList.js'

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

test('全カードを終えたあとの一覧は、選び直した項目を最後の答えで「まだ」「覚えた」に分ける', () => {
  const apple = { id: 'apple', title: 'apple' }
  const book = { id: 'book', title: 'book' }
  const cat = { id: 'cat', title: 'cat' }
  const groups = studyAnswerGroups([
    { item: apple, remembered: true },
    { item: book, remembered: false },
    { item: cat, remembered: false },
    // 前へ戻って book を「覚えた」に選び直す。並びは最初に答えた順のまま。
    { item: book, remembered: true },
    { item: { title: 'IDのない記録' }, remembered: false },
  ])
  assert.deepEqual(groups.forgot.map((item) => item.id), ['cat'])
  assert.deepEqual(groups.remembered.map((item) => item.id), ['apple', 'book'])
  assert.deepEqual(studyAnswerGroups(), { forgot: [], remembered: [] })
})

test('全暗記カードの終わりに「一覧で確認」があり、答えるたびに残して、やり直しで消す', () => {
  const read = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')
  const controls = read('components/CardStudyControls.jsx')
  assert.match(controls, /export function useStudyAnswerLog/)
  assert.match(controls, /export function StudyAnswerListButton/)
  assert.match(controls, /一覧で確認/)
  assert.match(controls, /label="まだ"/)
  assert.match(controls, /label="覚えた"/)

  // 画面の中に共通の暗記完了レポートを出す暗記カード
  for (const filename of [
    'KotenStudy.jsx',
    'KotenGrammarStudy.jsx',
    'KotenCultureStudy.jsx',
    'KanbunStudy.jsx',
    'EtymologyStudy.jsx',
  ]) {
    const source = read(`screens/${filename}`)
    assert.match(source, /const answerLog = useStudyAnswerLog\(\)/, `${filename}: 答えを残していない`)
    // 最初の答えと、前へ戻って選び直した答えの両方を残す
    assert.equal((source.match(/answerLog\.record\(/g) ?? []).length, 2, `${filename}: 答えを残す場所が2か所でない`)
    assert.match(source, /answerLog\.reset\(\)/, `${filename}: やり直しで一覧を消していない`)
    assert.match(source, /<StudyCompletionReport[\s\S]*?answerGroups=\{answerLog\.groups\(\)\}/, `${filename}: 終わりの画面に一覧がない`)
  }

  // 熟語・構文と英単語は、共通の結果画面で並べる
  const phrase = read('screens/PhraseStudy.jsx')
  assert.equal((phrase.match(/answerLog\.record\(/g) ?? []).length, 2)
  assert.match(phrase, /studyAnswers: answerLog\.entries\(\)/)
  const result = read('screens/SessionResult.jsx')
  assert.match(result, /studyAnswerGroups\(params\.studyAnswers\)/)
  assert.match(result, /<StudyAnswerListButton groups=\{studyAnswers\}/)
  assert.match(result, /answerGroups=\{studyAnswers\}/)
  assert.match(read('components/StudyCompletionReport.jsx'), /<StudyAnswerListButton[\s\S]*?groups=\{answerGroups\}/)

  // 名作の本文語彙カードも同じ一覧
  const literature = read('components/LiteratureVocabularySheet.jsx')
  assert.match(literature, /answerLog\.record\(entry, rememberedNow\)/)
  assert.match(literature, /answerLog\.reset\(\)/)
  assert.match(literature, /<StudyAnswerListButton[\s\S]*?groups=\{answerLog\.groups\(\)\}/)
})
