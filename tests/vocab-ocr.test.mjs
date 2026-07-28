import test from 'node:test'
import assert from 'node:assert/strict'

import { ALL_WORDS } from '../src/data/vocab.js'
import {
  extractEnglishTokens,
  matchOcrTextToWords,
  normalizeOcrToken,
} from '../src/lib/vocabOcr.js'

test('OCR文字列から合字・アポストロフィ・ハイフンを含む英語トークンを抽出する', () => {
  assert.deepEqual(
    extractEnglishTokens("The ﬁrst student’s well‑being matters."),
    ['The', 'first', "student's", 'well-being', 'matters'],
  )
  assert.equal(normalizeOcrToken('STUDENT’S'), "student's")
})

test('OCRで見つけた既存辞書の単語を出現順に重複なくまとめる', () => {
  const result = matchOcrTextToWords(
    'A student and another student study English.',
    ALL_WORDS,
  )
  const heads = result.candidates.map((item) => item.headword.toLowerCase())

  assert.ok(heads.includes('student'))
  assert.ok(heads.includes('study'))
  assert.ok(heads.includes('english'))
  assert.equal(
    result.candidates.find((item) => item.headword.toLowerCase() === 'student').occurrences,
    2,
  )
  assert.equal(new Set(result.candidates.map((item) => item.id)).size, result.candidates.length)
})

test('複数形・進行形・過去形・代表的な不規則変化を辞書の見出し語へ戻す', () => {
  const result = matchOcrTextToWords(
    'Students were running, studied, and went home.',
    ALL_WORDS,
  )
  const heads = new Set(result.candidates.map((item) => item.headword.toLowerCase()))

  for (const expected of ['student', 'were', 'run', 'study', 'go', 'home']) {
    assert.ok(heads.has(expected), expected)
  }
})

test('辞書に一致しないOCRノイズは候補へ混ぜず未一致として数える', () => {
  const dictionary = [
    { id: 'modern', word: 'modern', meaning: '現代の', level: 'pre2' },
  ]
  const result = matchOcrTextToWords('rn0dern modern xxqzz', dictionary)

  assert.deepEqual(result.candidates.map((item) => item.id), ['modern'])
  assert.equal(result.unmatchedTokenCount, 3)
  assert.deepEqual(result.unmatched.map((item) => item.token), ['rn', 'dern', 'xxqzz'])
})
