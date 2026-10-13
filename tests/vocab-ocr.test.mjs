import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { CREDIT_SECTIONS } from '../src/data/credits.js'
import { ALL_WORDS } from '../src/data/vocab.js'
import { ENGLISH_WORD_LIST_FILES } from '../src/lib/englishWordList.js'
import { englishWordSetForTests, screenLoaderFiles } from './english-word-set.mjs'
import {
  extractEnglishTokens,
  matchOcrTextToWords,
  normalizeOcrToken,
  OCR_LOW_CONFIDENCE,
  ocrTokenConfidences,
  ocrWordsFromResult,
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

test('実在しない並びは、候補にもリクエストにも出さず、確かめられなかった文字として数える', () => {
  const dictionary = [
    { id: 'modern', word: 'modern', meaning: '現代の', level: 'pre2' },
  ]
  const englishWords = new Set(['modern', 'walrus'])
  const result = matchOcrTextToWords('rnodern modern xxqzz walrus Emi', dictionary, { englishWords })

  // rnodern は読み違えやすい文字の組（rn → m）を直して辞書の modern へ戻す。
  assert.deepEqual(result.candidates.map((item) => item.id), ['modern'])
  assert.equal(result.candidates[0].occurrences, 2)
  assert.deepEqual(result.candidates[0].observed, ['rnodern', 'modern'])
  assert.deepEqual(result.unmatched.map((item) => item.token), ['walrus'])
  assert.deepEqual(result.rejected.map((item) => item.token), ['xxqzz', 'emi'])
  assert.equal(result.unmatchedTokenCount, 1)
  assert.equal(result.rejectedTokenCount, 2)
})

test('英語の単語表が無いときは、辞書にない語をすべて確かめられなかった側へ入れる（存在しない語をリクエストに出さない）', () => {
  const result = matchOcrTextToWords('student zorblax walrus', ALL_WORDS)
  assert.deepEqual(result.candidates.map((item) => item.headword.toLowerCase()), ['student'])
  assert.deepEqual(result.unmatched, [])
  assert.deepEqual(result.rejected.map((item) => item.token), ['zorblax', 'walrus'])
})

test('日本語の文字は取り出さず、数字で始まる並び・数字だけの並びも語にしない', () => {
  assert.deepEqual(
    extractEnglishTokens('「study」は「勉強する」。3rd 10th 2024 rn0dern Part2'),
    ['study', 'rn0dern', 'Part'],
  )
  assert.equal(normalizeOcrToken('Part2'), 'part')
  const result = matchOcrTextToWords('私は毎日英語を勉強します。', ALL_WORDS, { englishWords: new Set() })
  assert.equal(result.tokenCount, 0)
})

test('続けて読まれた語（schoolevery・playingthe）は、実在する語に分けて候補にする', () => {
  const result = matchOcrTextToWords('I go to schoolevery day and enjoy playingthe piano.', ALL_WORDS, { englishWords: new Set() })
  const byHead = new Map(result.candidates.map((item) => [item.headword.toLowerCase(), item]))
  for (const head of ['school', 'every', 'play', 'the', 'piano']) assert.ok(byHead.has(head), head)
  assert.equal(byHead.get('school').split, true)
  assert.deepEqual(byHead.get('school').observed, ['schoolevery'])
  // the は「playingthe」のほかに1回そのまま読めているので、分けた印を付けない。
  assert.equal(byHead.get('piano').split, false)
  assert.deepEqual(result.rejected, [])
})

test('読み違えやすい文字（0→o・1→i・rn→m・cl→d・vv→w）は、辞書の見出し語に1つに戻せるときだけ直す', () => {
  const result = matchOcrTextToWords('sch00l l1brary rnodern cloor vvater', ALL_WORDS, { englishWords: new Set() })
  const fixed = result.candidates.map((item) => [item.headword.toLowerCase(), item.corrected])
  assert.deepEqual(fixed, [['school', true], ['library', true], ['modern', true], ['door', true], ['water', true]])
})

test('語の端のかっこが英字に読まれた形（「decide → fdecide・Tdecide）は、外して辞書の見出し語に戻す', () => {
  const result = matchOcrTextToWords('fdecide Tdecide decidel', ALL_WORDS, { englishWords: new Set() })
  assert.deepEqual(result.candidates.map((item) => [item.headword, item.corrected, item.occurrences]), [['decide', true, 3]])
  // 実在する語（trend・list）は端を外さない。
  const real = matchOcrTextToWords('trend list', ALL_WORDS, { englishWords: new Set() })
  assert.deepEqual(real.candidates.map((item) => [item.headword, item.corrected]), [['trend', false], ['list', false]])
})

test('確からしさが低い辞書の語は「不確か」の印を付け（確かな出現が1回でもあれば外す）、辞書にない語ならリクエストに出さない', () => {
  const confidences = ocrTokenConfidences([
    { text: 'hot', confidence: 8 },
    { text: 'school.', confidence: 20 },
    { text: 'School', confidence: 91 },
    { text: 'walrus', confidence: 12 },
  ])
  assert.equal(confidences.get('school'), 91)
  assert.ok(OCR_LOW_CONFIDENCE > 8 && OCR_LOW_CONFIDENCE < 91)
  const result = matchOcrTextToWords('hot school walrus', ALL_WORDS, { englishWords: new Set(['walrus']), confidences })
  const flags = Object.fromEntries(result.candidates.map((item) => [item.headword.toLowerCase(), item.uncertain]))
  assert.deepEqual(flags, { hot: true, school: false })
  assert.deepEqual(result.unmatched, [])
  assert.deepEqual(result.rejected.map((item) => item.token), ['walrus'])
})

test('読み取りエンジンの結果から、語と確からしさを順に取り出す', () => {
  const data = {
    blocks: [{ paragraphs: [{ lines: [
      { words: [{ text: '図書館', confidence: 93 }, { text: 'library', confidence: 91 }] },
      { words: [{ text: 'borrow', confidence: 87 }] },
    ] }] }],
  }
  assert.deepEqual(ocrWordsFromResult(data).map((word) => word.text), ['図書館', 'library', 'borrow'])
  assert.deepEqual(ocrWordsFromResult({}), [])
})

test('英語の単語表は、小文字の英字の語だけを持ち、語形変化を含む。画面は 24 のファイルを全部読む', () => {
  assert.deepEqual(screenLoaderFiles(), [...ENGLISH_WORD_LIST_FILES])
  assert.equal(ENGLISH_WORD_LIST_FILES.length, 24)
  const words = englishWordSetForTests()
  assert.ok(words.size > 100_000, `${words.size}`)
  for (const word of ['school', 'went', 'studies', 'walrus', 'colour', 'color']) assert.ok(words.has(word), word)
  for (const word of ['zorblax', 'schoolevery', 'emi', 'kyoto', 'ok']) assert.equal(words.has(word), false, word)
  assert.ok([...words].every((word) => /^[a-z]+(?:['-][a-z]+)*$/.test(word)))
})

test('英語の単語表の著作権と利用許諾の文を、メニューの「出典」ページに載せる', () => {
  const section = CREDIT_SECTIONS.find((item) => item.items.some((credit) => credit.id === 'scowl-wordlist'))
  assert.ok(section, '出典に英語の単語表がない')
  assert.match(section.note, /^Copyright 2000-2016 by Kevin Atkinson\. Permission to use, copy, modify, distribute and sell these word lists/)
  assert.match(section.note, /this permission notice appear in supporting documentation/)
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  assert.ok(packageJson.dependencies['wordlist-english'], '単語表のパッケージが dependencies にない')
})
