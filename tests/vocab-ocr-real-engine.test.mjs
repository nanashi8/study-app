// 「教科書から単語追加」の写真の文字の読み取りで、日本語も読み、日本語などを読み違えた存在しない英単語を候補に出さない依頼
// （requests/2026-10-13-camera-ocr-japanese.json）の受け入れ条件のうち、node で本物の読み取りエンジンを動かして確かめるもの。
//
// 試料の画像7枚（tests/fixtures/vocab-ocr/。作り方は scripts/vocab-ocr-fixtures.mjs）を、画面と同じ手順（ocrEngine.js の
// readOcrPage）と、画面と同じエンジン本体（旧エンジン入りの SIMD 版。tests/tesseract-node-worker.cjs で選ぶ）で読む。
// 認識データは初回だけ jsdelivr から読み込み、node_modules/.cache に置く（通信が要る）。
// 直す前の作り（英語だけで読む・LSTM だけの版で読む）も同じ画像で読み、直す前の不具合と食い違いの原因を確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as tesseract from 'tesseract.js'

import { ALL_WORDS } from '../src/data/vocab.js'
import { OCR_INIT_CONFIG, readOcrPage } from '../src/lib/ocrEngine.js'
import { createOcrWordTest, extractEnglishTokens, matchOcrTextToWords, OCR_ENGINES, ocrTokenConfidences } from '../src/lib/vocabOcr.js'
import { englishWordSetForTests } from './english-word-set.mjs'
import { japaneseChars, loadOcrTruth, scoreOcrResult, sumScores } from './vocab-ocr-scoring.mjs'

const FIXTURES = fileURLToPath(new URL('./fixtures/vocab-ocr/', import.meta.url))
const ROOT = fileURLToPath(new URL('..', import.meta.url))
const workerOptions = { cachePath: `${ROOT}node_modules/.cache/vocab-ocr-tessdata/`, workerPath: `${ROOT}tests/tesseract-node-worker.cjs` }
const samples = loadOcrTruth().filter((truth) => truth.set === 'fixture')
const results = new Map()
let englishWords
const workers = []

async function readWith(variant, languages, init) {
  process.env.VOCAB_OCR_CORE_VARIANT = variant
  const worker = await tesseract.createWorker([...languages], tesseract.OEM.LSTM_ONLY, workerOptions, init)
  workers.push(worker)
  await worker.setParameters({ tessedit_pageseg_mode: tesseract.PSM.AUTO, preserve_interword_spaces: '1' })
  const texts = {}
  for (const sample of samples) texts[sample.id] = (await worker.recognize(`${FIXTURES}${sample.id}.png`)).data.text
  return texts
}

before(async () => {
  mkdirSync(workerOptions.cachePath, { recursive: true })
  englishWords = englishWordSetForTests()
  const isEnglishWord = createOcrWordTest(ALL_WORDS, englishWords)
  delete process.env.VOCAB_OCR_CORE_VARIANT
  for (const sample of samples) {
    results.set(sample.id, await readOcrPage(tesseract, `${FIXTURES}${sample.id}.png`, { isEnglishWord, workerOptions }))
  }
  // 直す前の作り：最初の画面は英語だけで1回読んだ。公開した画面（0d8b60e2）は LSTM だけの版で日本語＋英語を1回読んだ。
  results.set('englishOnly', await readWith('simd', ['eng']))
  results.set('lstmOnly', await readWith('simd-lstm', ['jpn', 'eng']))
  results.set('fullCore', await readWith('simd', ['jpn', 'eng']))
  results.set('fullCoreQuiet', await readWith('simd', ['jpn', 'eng'], OCR_INIT_CONFIG))
  delete process.env.VOCAB_OCR_CORE_VARIANT
}, { timeout: 600_000 })

after(async () => {
  await Promise.all(workers.map((worker) => worker.terminate().catch(() => {})))
})

test('試料は日本語と英語がまざったページを含み、英語のないページと日本語のないページもある', () => {
  assert.equal(samples.length, 7)
  assert.ok(samples.filter((sample) => sample.japanese && extractEnglishTokens(sample.latin).length).length >= 5)
  assert.ok(samples.some((sample) => !extractEnglishTokens(sample.latin).length))
  assert.ok(samples.some((sample) => !sample.japanese))
})

test('画面と同じ手順は、2つのエンジン（日本語＋英語・英語だけ）を白黒の決め方2通りで読む', () => {
  assert.deepEqual(OCR_ENGINES.map((engine) => [engine.id, [...engine.languages], [...engine.thresholdings]]), [
    ['ja', ['jpn', 'eng'], ['0', '2']],
    ['en', ['eng'], ['0', '2']],
  ])
  const screen = readFileSync(new URL('../src/screens/VocabCamera.jsx', import.meta.url), 'utf8')
  assert.match(screen, /await readOcrPage\(tesseract, image, \{/)
  assert.match(screen, /workerOptions,/)
  assert.doesNotMatch(screen, /createWorker\(/)
})

test('試料7枚：日本語の字を全部読み、英単語は全部候補になり、写真にない語・存在しない語を出さない', () => {
  const scores = samples.map((sample) => scoreOcrResult(sample, results.get(sample.id), { englishWords }))
  const total = sumScores(scores)
  assert.equal(total.japaneseHits, total.japaneseTotal, `日本語 ${total.japaneseHits}/${total.japaneseTotal}`)
  assert.equal(total.found, total.expected)
  assert.equal(total.wrongSelected, 0)
  assert.equal(total.wrongRequests, 0)
  for (const score of scores) {
    for (const item of score.match.unmatched) assert.ok(englishWords.has(item.token), `${score.id}: ${item.token}`)
  }
  const japaneseOnly = scores.find((score) => score.id === 'japanese-only').match
  assert.deepEqual([japaneseOnly.candidates.length, japaneseOnly.unmatched.length], [0, 0])
})

test('直す前（英語だけで読む）は、日本語が英字の並びや実在の英単語に化けていた', () => {
  const texts = results.get('englishOnly')
  let japanese = 0
  let misreadWords = 0
  for (const sample of samples.filter((item) => item.japanese)) {
    japanese += japaneseChars(texts[sample.id]).length
    const expected = new Set(matchOcrTextToWords(sample.latin, ALL_WORDS, { englishWords }).candidates.map((item) => item.id))
    misreadWords += matchOcrTextToWords(texts[sample.id], ALL_WORDS, { englishWords }).candidates.filter((item) => !expected.has(item.id)).length
  }
  assert.equal(japanese, 0)
  assert.ok(misreadWords > 0)
})

test('node とブラウザが食い違った原因：LSTM だけの版は日本語まじりの行を英字に化けさせ、画面が使う旧エンジン入りの版は読む', () => {
  // 4行目「「decide to ～」は「～することに決める」という意味です。」
  const lstm = results.get('lstmOnly')['inline-mixed']
  const full = results.get('fullCore')['inline-mixed']
  assert.match(lstm, /Tdecide to/)
  assert.doesNotMatch(lstm, /することに決める/)
  assert.match(full, /「decide to .」は「.することに決める」という意味です。/)
})

test('エンジンの知らせを止める設定（OCR_INIT_CONFIG）は、読み取りの結果を1字も変えない', () => {
  assert.deepEqual(OCR_INIT_CONFIG, { debug_file: '/dev/null' })
  for (const sample of samples) assert.equal(results.get('fullCoreQuiet')[sample.id], results.get('fullCore')[sample.id], sample.id)
})

test('読み取った語ごとに、ほかの読み方でも同じ場所に読めた数と元の確からしさを残す', () => {
  const words = results.get('textbook-translation').words.filter((word) => /[A-Za-z]{3,}/.test(word.text))
  assert.ok(words.length > 10)
  for (const word of words) {
    assert.ok(word.support >= 1 && word.support <= 4, word.text)
    assert.ok(Number.isFinite(word.rawConfidence), word.text)
  }
  assert.ok(ocrTokenConfidences(words).size > 10)
})
