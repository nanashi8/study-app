// 暗記カードの輪：「まだ」「覚えた」を押したカードはその回の輪から抜け、
// 上部の数字は「位置/残り枚数」になる。押していないカードだけを何周でも回れる。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  canTurnRing,
  ringAnsweredCount,
  ringIndexAfter,
  ringIndexes,
  ringPosition,
  ringProgress,
  ringRemaining,
} from '../src/lib/studyRing.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// 英単語・熟語構文・語源・古文単語・古文文法・古典常識・漢文の7画面。
const CARD_STUDY_SCREENS = [
  ['src/screens/VocabStudy.jsx', 'i'],
  ['src/screens/PhraseStudy.jsx', 'i'],
  ['src/screens/EtymologyStudy.jsx', 'index'],
  ['src/screens/KotenStudy.jsx', 'i'],
  ['src/screens/KotenGrammarStudy.jsx', 'index'],
  ['src/screens/KotenCultureStudy.jsx', 'index'],
  ['src/screens/KanbunStudy.jsx', 'index'],
]

test('押したカードは輪から抜け、残り枚数が減っていく', () => {
  const answers = {}
  assert.equal(ringRemaining(20, answers), 20)
  assert.equal(ringAnsweredCount(20, answers), 0)
  assert.equal(ringProgress(20, answers), 0)

  answers[3] = true
  answers[7] = false
  assert.equal(ringRemaining(20, answers), 18)
  assert.equal(ringAnsweredCount(20, answers), 2)
  assert.equal(ringProgress(20, answers), 0.1)
  assert.deepEqual(ringIndexes(5, answers), [0, 1, 2, 4])

  // 「まだ」も「覚えた」も同じく1枚として抜ける。
  assert.equal(ringRemaining(20, { 0: false, 1: false, 2: false }), 17)
  assert.equal(ringRemaining(0, {}), 0)
})

test('位置は残っているカードの中での順番で、押すと詰まる', () => {
  // 20枚の1枚目は 1/20。
  assert.equal(ringPosition(0, 20, {}), 1)
  assert.equal(ringRemaining(20, {}), 20)
  // 1枚目を押すと2枚目へ進み、その2枚目が残り19枚の1枚目になる＝1/19。
  const answers = { 0: true }
  assert.equal(ringPosition(1, 20, answers), 1)
  assert.equal(ringRemaining(20, answers), 19)
  // 押していない先のカードも、抜けた分だけ前へ詰まる。
  assert.equal(ringPosition(5, 20, answers), 5)
  assert.equal(ringPosition(5, 20, { 0: true, 2: false, 4: true }), 3)
  // 押したカードを開いているとき（選び直し）は、輪へ戻ったときの位置。
  assert.equal(ringPosition(2, 5, { 2: true }), 3)
  assert.equal(ringPosition(0, 5, { 0: true }), 1)
  assert.equal(ringPosition(0, 0, {}), 0)
})

test('輪は末尾まで行ったら先頭へ戻り、押したカードは飛ばす', () => {
  const answers = { 1: true, 2: true }
  assert.equal(ringIndexAfter(0, 5, answers, 'next'), 3)
  assert.equal(ringIndexAfter(4, 5, answers, 'next'), 0)
  assert.equal(ringIndexAfter(0, 5, answers, 'previous'), 4)
  assert.equal(ringIndexAfter(3, 5, answers, 'previous'), 0)
  // 向きを渡さなければ動かさない。
  assert.equal(ringIndexAfter(3, 5, answers), 3)
})

test('残り1枚になったら前へ・次へは押せず、その場から動かない', () => {
  const answers = { 0: true, 1: true, 3: true, 4: true }
  assert.equal(ringRemaining(5, answers), 1)
  assert.equal(ringIndexAfter(2, 5, answers, 'next'), 2)
  assert.equal(ringIndexAfter(2, 5, answers, 'previous'), 2)
  assert.equal(canTurnRing(2, 5, answers, 'next'), false)
  assert.equal(canTurnRing(2, 5, answers, 'previous'), false)
  assert.equal(canTurnRing(2, 5, { 0: true }, 'next'), true)
})

test('押したカードを開いて選び直したあとも、次へで輪へ戻れる', () => {
  // 3・0 を押したあと、選び直しで 3 を開いている。
  const answers = { 0: true, 3: true }
  assert.equal(ringIndexAfter(3, 5, answers, 'next'), 4)
  assert.equal(ringIndexAfter(3, 5, answers, 'previous'), 2)
})

test('1枚ずつ押していくと、残り枚数が0になったところでその回が終わる', () => {
  const total = 6
  const answers = {}
  let card = 0
  const seen = []
  for (let turn = 0; turn < total; turn += 1) {
    seen.push(card)
    answers[card] = true
    if (ringRemaining(total, answers) === 0) break
    // 画面と同じ進み方（答えたら次の未処理カードへ＝nextUnansweredSessionIndex）。
    card = ringIndexAfter(card, total, answers, 'next')
  }
  assert.deepEqual(seen, [0, 1, 2, 3, 4, 5])
  assert.equal(ringRemaining(total, answers), 0)
  assert.equal(ringProgress(total, answers), 1)
})

test('何周しても押さないかぎり減らず、同じカードがまた出てくる', () => {
  const answers = {}
  let card = 0
  for (let turn = 0; turn < 12; turn += 1) card = ringIndexAfter(card, 4, answers, 'next')
  assert.equal(card, 0)
  assert.equal(ringRemaining(4, answers), 4)
})

test('全7暗記カードが、残りの枚数を出して未処理のカードだけを回す', () => {
  assert.equal(CARD_STUDY_SCREENS.length, 7)
  for (const [path, indexName] of CARD_STUDY_SCREENS) {
    const source = read(path)
    // 数字はデッキの番号ではなく「位置/残り枚数」。
    assert.match(
      source,
      /remaining=\{ringRemaining\(deck\.length, recordedAnswers\)\}/,
      `${path}: 残り枚数を出していない`,
    )
    assert.match(
      source,
      new RegExp(`position=\\{ringPosition\\(${indexName}, deck\\.length, recordedAnswers\\)\\}`),
      `${path}: 残りの中での位置を出していない`,
    )
    // 読み上げも見えている数字と同じことば。
    assert.match(
      source,
      new RegExp(`statusLabel=\\{\`残り\\$\\{ringRemaining\\(deck\\.length, recordedAnswers\\)\\}枚の\\$\\{ringPosition\\(${indexName}, deck\\.length, recordedAnswers\\)\\}枚目\`\\}`),
      `${path}: 読み上げの位置が数字と食い違う`,
    )
    // 前へ・次へ・スワイプは輪を回る。
    assert.match(source, /onPrevious=\{\(\) => turnRing\('previous'\)\}/, `${path}: 前へが輪を回らない`)
    assert.match(source, /onNext=\{\(\) => turnRing\('next'\)\}/, `${path}: 次へが輪を回らない`)
    assert.match(
      source,
      new RegExp(`const turnRing = \\(direction\\) => moveToCard\\(ringIndexAfter\\(${indexName}, deck\\.length, recordedAnswers, direction\\)\\)`),
      `${path}: 輪の回し方が共通でない`,
    )
    assert.match(source, /<CardSwipeRegion[\s\S]{0,120}answered=\{recordedAnswers\}/, `${path}: スワイプが輪を回らない`)
    // 残り1枚では前へ・次へを押せない。
    assert.match(
      source,
      new RegExp(`previousDisabled=\\{!canTurnRing\\(${indexName}, deck\\.length, recordedAnswers, 'previous'\\)\\}`),
      `${path}: 残り1枚でも前へが押せる`,
    )
    assert.match(
      source,
      new RegExp(`nextDisabled=\\{!canTurnRing\\(${indexName}, deck\\.length, recordedAnswers, 'next'\\)\\}`),
      `${path}: 残り1枚でも次へが押せる`,
    )
    // 進み具合の線は、処理した枚数の割合。
    assert.match(source, /progress=\{ringProgress\(deck\.length, recordedAnswers\)\}/, `${path}: 進み具合が枚数の割合でない`)
    // 端で止める古い動かし方を残さない。
    assert.doesNotMatch(source, /moveToCard\(Math\.(?:max|min)\(/, `${path}: 端で止まる前後移動が残っている`)
    // 押し間違えたときの戻り先。
    assert.match(source, new RegExp(`setLastAnswered\\(${indexName}\\)`), `${path}: 直前に押した1枚を覚えていない`)
    assert.match(source, /setLastAnswered\(null\)/, `${path}: 並びを組み直しても戻り先が残る`)
    assert.match(
      source,
      /\{recordedAnswer === null && lastAnswered !== null && \(\s*<LastAnsweredReturn onOpen=\{\(\) => moveToCard\(lastAnswered\)\}/,
      `${path}: 直前の1枚へ戻れない`,
    )
  }
})

test('共通部品が輪の枚数を数え、番号での頭打ちを持たない', () => {
  // 上部バーの「次の未処理カードへ」も、輪と同じ1つの決まりで動かす。
  const bar = read('src/components/QuestionSessionControls.jsx')
  assert.match(bar, /export function nextUnansweredSessionIndex\(index, total, answeredValues\) \{\n  return ringIndexAfter\(index, total, answeredValues, 'next'\)/)
  const controls = read('src/components/CardStudyControls.jsx')
  assert.match(controls, /ringIndexAfter, ringPosition, ringRemaining/)
  assert.match(controls, /const turnTo = \(direction\) => ringIndexAfter\(index, total, answered, direction\)/)
  assert.match(controls, /data-card-swipe-remaining=\{remaining\}/)
  assert.match(controls, /export function LastAnsweredReturn/)
  assert.match(controls, /直前の1枚を選び直す/)

  const counter = read('src/components/SessionSize.jsx')
  // 「位置/残り枚数」の作り方は session.js の1か所だけ（remaining を渡した画面がこの形になる）。
  assert.match(counter, /sessionCounterDisplay\(\{ index, total, remaining, position \}\)/)
  assert.match(read('src/lib/session.js'), /text: `\$\{place\}\/\$\{remainingCards\}`/)
  assert.match(counter, /data-session-remaining/)
  assert.match(bar, /\{statusLabel \?\? `\$\{itemLabel\} \$\{index \+ 1\}\/\$\{total\}`\}/)

  // 端で止める計算は使わない（輪は studyRing.js が決める）。
  assert.doesNotMatch(read('src/lib/cardSwipe.js'), /cardIndexAfterSwipe/)
  assert.doesNotMatch(controls, /cardIndexAfterSwipe/)
})
