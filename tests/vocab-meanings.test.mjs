import test from 'node:test'
import assert from 'node:assert/strict'

import { hasBalancedParentheses, splitMeanings } from '../src/data/compact.js'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'

test('括弧内の中黒は語義の区切りにしない', () => {
  assert.deepEqual(splitMeanings('(王位・責任を)放棄する・退位する'), [
    '(王位・責任を)放棄する',
    '退位する',
  ])
  assert.deepEqual(splitMeanings('〜です（be動詞 複数・二人称）'), [
    '〜です（be動詞 複数・二人称）',
  ])
})

test('単語の意味とテスト用語義は全件で括弧が対応する', () => {
  for (const word of ALL_WORDS) {
    assert.ok(hasBalancedParentheses(word.meaning), `${word.id}: ${word.meaning}`)
    assert.equal(word.meanings.join('・'), word.meaning, word.id)
    for (const meaning of word.meanings) {
      assert.ok(hasBalancedParentheses(meaning), `${word.id}: ${meaning}`)
    }
  }
})

test('括弧内に中黒がある既知語も選択肢用の意味を壊さない', () => {
  assert.deepEqual(getWord('elicit').meanings, ['（情報・反応を）引き出す'])
  assert.deepEqual(getWord('appointment').meanings, ['(面会・診察の)予約'])
  assert.deepEqual(getWord('you').meanings, ['あなた(は・を)', 'あなたたち'])
  assert.deepEqual(getWord('abdicate').meanings, ['(王位・責任を)放棄する', '退位する'])
})
