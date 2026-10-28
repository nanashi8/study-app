import test from 'node:test'
import assert from 'node:assert/strict'

import {
  BASIC_READING_LEVEL_IDS,
  BASIC_READING_PASSAGES,
  BASIC_READING_THEMES,
  basicReadingPassagesForLevel,
} from '../src/data/basic-reading/index.js'
import { basicReadingLevelWords, basicReadingTokens, levelRank } from '../src/lib/basicReading.js'
import { MIN_LEVEL_WORDS, fieldCoverage, themeProblems, vocabProblems } from '../scripts/checks/basic-reading.mjs'

// 基礎長文の語彙：本文の語はすべて級以下の見出し語（固有名詞と、推測の問題で推測させる語だけを名前を挙げて外す）、
// 本文に当たる熟語は載せるか使っていない理由を書く、テーマの一覧を全部扱い、級の語がある分野をすべて確かめられる。

test('本文の全語が、その級かそれより下の級の見出し語で読める', () => {
  assert.deepEqual(vocabProblems(), [])
  let tokens = 0
  for (const passage of BASIC_READING_PASSAGES) {
    const infer = new Set(passage.inferWords ?? [])
    for (const token of basicReadingTokens(passage)) {
      tokens += 1
      if (token.isName) continue
      assert.ok(token.word, `${passage.id}: ${token.surface}`)
      assert.ok(levelRank(token.word.level) <= levelRank(passage.level) || infer.has(token.word.id), `${passage.id}: ${token.surface}`)
    }
  }
  assert.ok(tokens > 7000, `本文の語 ${tokens}`)
})

test('級より上の語は、推測の問題で推測させる語だけ（どの級も1語）', () => {
  for (const level of BASIC_READING_LEVEL_IDS) {
    const infer = basicReadingPassagesForLevel(level).flatMap((passage) => passage.inferWords ?? [])
    assert.equal(infer.length, 1, `${level}級 ${infer.join('・')}`)
  }
})

test('テーマの一覧を全部、1本ずつ扱い、級の語がある分野をすべて確かめられる', () => {
  assert.deepEqual(themeProblems(), [])
  for (const level of BASIC_READING_LEVEL_IDS) {
    assert.equal(BASIC_READING_THEMES[level].length, 10, level)
    const { fields, missing } = fieldCoverage(level)
    assert.deepEqual(missing, [], `${level}級`)
    assert.ok(fields.length >= 9, `${level}級の分野 ${fields.length}`)
  }
})

test('どの長文も、その級の語を語彙の確認の欄に8語以上出す', () => {
  for (const passage of BASIC_READING_PASSAGES) {
    const words = basicReadingLevelWords(passage)
    assert.ok(words.length >= MIN_LEVEL_WORDS, `${passage.id}: ${words.length}語`)
    assert.ok(words.every((word) => word.level === passage.level), passage.id)
  }
})
