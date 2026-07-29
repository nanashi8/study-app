import test from 'node:test'
import assert from 'node:assert/strict'

import { DICTATION_ITEMS } from '../src/data/dictation.js'
import { scoreDictationSelection } from '../src/lib/dictation.js'
import {
  buildWritingTokenText,
  shuffledWritingTokens,
  writingTokenPositionResults,
  writingWordTokens,
} from '../src/lib/writing.js'

test('全ディクテーション英文を単語カードに分けて欠落なく並べ替えられる', () => {
  let tokenCount = 0

  for (const item of DICTATION_ITEMS) {
    const ordered = writingWordTokens(item.text)
    const shuffled = shuffledWritingTokens(item.text, item.id)

    tokenCount += ordered.length
    assert.equal(ordered.length, item.text.trim().split(/\s+/).length, item.id)
    assert.equal(buildWritingTokenText(ordered), item.text, item.id)
    assert.deepEqual(
      shuffled.map((token) => token.word).sort(),
      ordered.map((token) => token.word).sort(),
      item.id,
    )
    assert.equal(
      shuffled.every((token, index) => token.originalIndex === index),
      false,
      `${item.id}: 最初から正解順にしない`,
    )
    assert.ok(
      writingTokenPositionResults(ordered, item.text).every(Boolean),
      item.id,
    )
    assert.equal(
      scoreDictationSelection(item.text, 0).correctWords,
      ordered.length,
      `${item.id}: カード枚数と採点語数`,
    )
  }

  assert.equal(DICTATION_ITEMS.length, 140)
  assert.ok(tokenCount > DICTATION_ITEMS.length)
})

test('単語選択式ディクテーションは誤った選択回数を進捗用の得点へ反映する', () => {
  const target = 'My sister walks to school every morning.'
  const exact = scoreDictationSelection(target, 0)
  const oneMistake = scoreDictationSelection(target, 1)
  const manyMistakes = scoreDictationSelection(target, 99)

  assert.equal(exact.exact, true)
  assert.equal(exact.passed, true)
  assert.equal(exact.score, 100)
  assert.equal(exact.correctWords, 7)

  assert.equal(oneMistake.exact, false)
  assert.equal(oneMistake.passed, false)
  assert.equal(oneMistake.score, 86)
  assert.equal(oneMistake.correctWords, 6)
  assert.equal(oneMistake.wrongSelections, 1)

  assert.equal(manyMistakes.score, 0)
  assert.equal(manyMistakes.correctWords, 0)
})
