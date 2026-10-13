// 「教科書から単語追加」の写真の文字の読み取りで、日本語も読み、日本語などを読み違えた存在しない英単語を候補に
// 出さない依頼（requests/2026-10-13-camera-ocr-japanese.json）の受け入れ条件。
//
// 本物の読み取りエンジン（tesseract.js。画面と同じ認識データ・同じ言語・同じ設定）で、試料の画像の全件
// （tests/fixtures/vocab-ocr/。日本語と英語がまざった教科書・単語表・問題・写真ふうのページなど。作り方は
// scripts/vocab-ocr-fixtures.mjs）を読む。認識データは初回だけ外から読み込み、node_modules/.cache に置く。
//
// 直す前の作り（英語だけで読む）も同じ画像で読み、日本語が英字の並びに化けていたことを数えて確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createWorker, OEM, PSM } from 'tesseract.js'

import { ALL_WORDS } from '../src/data/vocab.js'
import { englishWordSetForTests } from './english-word-set.mjs'
import {
  extractEnglishTokens,
  matchOcrTextToWords,
  normalizeOcrToken,
  OCR_LANGUAGES,
  OCR_REREAD_LANGUAGES,
  ocrTokenConfidences,
  recognizeOcrPage,
} from '../src/lib/vocabOcr.js'

const FIXTURES = fileURLToPath(new URL('./fixtures/vocab-ocr/', import.meta.url))
const CACHE = fileURLToPath(new URL('../node_modules/.cache/vocab-ocr-tessdata/', import.meta.url))
const { samples } = JSON.parse(readFileSync(`${FIXTURES}samples.json`, 'utf8'))
const JAPANESE = /[぀-ヿ㐀-鿿]/u

const sampleText = (sample) => sample.lines.map((line) => (line.cells ?? [line.text]).join(' ')).join('\n')
const japaneseChars = (text) => [...text].filter((ch) => JAPANESE.test(ch))

// 正解の日本語の文字のうち、読み取った文字に同じ順で現れた割合（最長共通部分列の長さ ÷ 正解の文字数）。
function japaneseRecall(expected, actual) {
  const a = japaneseChars(expected)
  const b = japaneseChars(actual)
  if (!a.length) return 1
  let previous = new Array(b.length + 1).fill(0)
  for (let i = 1; i <= a.length; i += 1) {
    const current = new Array(b.length + 1).fill(0)
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = a[i - 1] === b[j - 1] ? previous[j - 1] + 1 : Math.max(previous[j], current[j - 1])
    }
    previous = current
  }
  return previous[b.length] / a.length
}

const workers = []
const results = {}
let englishWords

async function startWorker(languages, pageSegMode) {
  const worker = await createWorker([...languages], OEM.LSTM_ONLY, { cachePath: CACHE })
  workers.push(worker)
  await worker.setParameters({ tessedit_pageseg_mode: pageSegMode, preserve_interword_spaces: '1' })
  return worker
}

// 画面と同じ手順（recognizeOcrPage）で全試料を読む。reread なら、英字に化けた行を日本語だけで読み直す。
async function readAll(name, languages, { reread }) {
  const worker = await startWorker(languages, PSM.AUTO)
  let rereadWorker
  const getRereadWorker = reread
    ? async () => (rereadWorker ??= await startWorker(OCR_REREAD_LANGUAGES, PSM.SINGLE_LINE))
    : undefined
  results[name] = {}
  for (const sample of samples) {
    const page = await recognizeOcrPage(worker, `${FIXTURES}${sample.id}.png`, { getRereadWorker })
    const text = page.text.trim()
    const match = matchOcrTextToWords(text, ALL_WORDS, { englishWords, confidences: ocrTokenConfidences(page.words) })
    results[name][sample.id] = { text, match, reread: page.reread, replaced: page.replaced }
  }
}

before(async () => {
  mkdirSync(CACHE, { recursive: true })
  englishWords = englishWordSetForTests()
  // 画面の手順：日本語＋英語で読み、化けた行だけ日本語で読み直す。
  await readAll('app', OCR_LANGUAGES, { reread: true })
  // 直す前の画面の手順：英語だけで読み、読み直さない。
  await readAll('englishOnly', ['eng'], { reread: false })
  // 読み直しの働きを確かめる：英語だけで読み（日本語の行はみな化ける）、化けた行を日本語で読み直す。
  await readAll('englishReread', ['eng'], { reread: true })
}, { timeout: 300_000 })

after(async () => {
  await Promise.all(workers.map((worker) => worker.terminate()))
})

test('試料は日本語と英語がまざったページを含み、どの画像にも正解の文がある', () => {
  assert.equal(samples.length, 7)
  assert.ok(samples.filter((sample) => JAPANESE.test(sampleText(sample)) && extractEnglishTokens(sampleText(sample)).length).length >= 5)
  assert.ok(samples.some((sample) => !extractEnglishTokens(sampleText(sample)).length), '英語のないページがない')
  assert.ok(samples.some((sample) => !JAPANESE.test(sampleText(sample))), '英語だけのページがない')
})

test('画面は日本語と英語の両方で読み取りエンジンを動かし（日本語を先に）、テストと同じ手順で読む', () => {
  assert.deepEqual([...OCR_LANGUAGES], ['jpn', 'eng'])
  assert.deepEqual([...OCR_REREAD_LANGUAGES], ['jpn'])
  const screen = readFileSync(new URL('../src/screens/VocabCamera.jsx', import.meta.url), 'utf8')
  assert.match(screen, /createWorker\(\[\.\.\.OCR_LANGUAGES\], OEM\.LSTM_ONLY/)
  assert.match(screen, /createWorker\(\[\.\.\.OCR_REREAD_LANGUAGES\], OEM\.LSTM_ONLY\)/)
  assert.match(screen, /tessedit_pageseg_mode: PSM\.AUTO/)
  assert.match(screen, /tessedit_pageseg_mode: PSM\.SINGLE_LINE/)
  assert.match(screen, /await recognizeOcrPage\(worker, image/)
  assert.doesNotMatch(screen, /createWorker\('eng'/)
})

test('全試料で、写真の日本語を日本語の文字として読み取る（直す前は英字の並びに化けていた）', () => {
  const rows = samples.filter((sample) => JAPANESE.test(sampleText(sample))).map((sample) => ({
    id: sample.id,
    app: japaneseRecall(sampleText(sample), results.app[sample.id].text),
    englishOnly: japaneseRecall(sampleText(sample), results.englishOnly[sample.id].text),
  }))
  assert.equal(rows.length, 6)
  for (const row of rows) {
    assert.ok(row.app >= 0.9, `${row.id}: 日本語の文字の ${Math.round(row.app * 100)}% しか読めていない`)
    assert.ok(row.englishOnly <= 0.1, `${row.id}: 直す前の作り（英語だけ）でも日本語が読めている（${row.englishOnly}）`)
  }
})

// 正解の文を読み取ったときに画面が出す語（辞書の語・リクエストできる語）を、それぞれの画像の「出してよい語」とする。
const expectedFor = (sample) => matchOcrTextToWords(sampleText(sample), ALL_WORDS, { englishWords })

test('全試料で、画面が出す語は全部、写真に実際にある実在の英単語（読み違えた語・存在しない語を出さない）', () => {
  let offered = 0
  for (const sample of samples) {
    const expected = expectedFor(sample)
    const { match } = results.app[sample.id]
    const expectedIds = new Set(expected.candidates.map((item) => item.id))
    const expectedRequests = new Set(expected.unmatched.map((item) => item.token))
    for (const item of match.candidates) {
      offered += 1
      assert.ok(expectedIds.has(item.id), `${sample.id}: 写真にない語「${item.headword}」を候補に出した（読んだ形 ${item.observed.join('・')}）`)
    }
    for (const item of match.unmatched) {
      offered += 1
      assert.ok(englishWords.has(item.token), `${sample.id}: 実在しない「${item.token}」をリクエストの候補に出した`)
      assert.ok(expectedRequests.has(item.token), `${sample.id}: 写真にない語「${item.token}」をリクエストの候補に出した`)
    }
  }
  assert.ok(offered >= 100, `出した語が少なすぎる（${offered}）`)
})

test('全試料で、写真の英単語を取りこぼさない（辞書の語は全部候補になる）', () => {
  for (const sample of samples) {
    const expected = expectedFor(sample)
    const actualIds = new Set(results.app[sample.id].match.candidates.map((item) => item.id))
    const missing = expected.candidates.filter((item) => !actualIds.has(item.id)).map((item) => item.headword)
    assert.deepEqual(missing, [], `${sample.id}: 候補にならなかった語`)
  }
  const japaneseOnly = results.app['japanese-only'].match
  assert.deepEqual([japaneseOnly.candidates.length, japaneseOnly.unmatched.length], [0, 0])
})

test('英単語として確かめられなかった並びは、写真の人名・地名など本当にある語か、日本語の読み違いだけで、画面に示す', () => {
  for (const sample of samples) {
    const { match } = results.app[sample.id]
    for (const item of match.rejected) {
      assert.ok(!englishWords.has(item.token) || item.token.length < 3, `${sample.id}: 実在する「${item.token}」を確かめられない側へ入れた`)
    }
  }
  const inline = results.app['inline-mixed'].match.rejected.map((item) => item.token)
  assert.ok(inline.includes('kyoto'), '地名 Kyoto を確かめられない側に示していない')
  const textbook = results.app['textbook-translation'].match.rejected.map((item) => item.token)
  assert.ok(textbook.includes('emi'), '人名 Emi を確かめられない側に示していない')
})

test('英字に化けた行は日本語だけで読み直して日本語へ戻す（英語だけで読んで化けた日本語の行が全試料で戻る）', () => {
  const rows = samples.filter((sample) => JAPANESE.test(sampleText(sample))).map((sample) => ({
    id: sample.id,
    before: japaneseRecall(sampleText(sample), results.englishOnly[sample.id].text),
    after: japaneseRecall(sampleText(sample), results.englishReread[sample.id].text),
    replaced: results.englishReread[sample.id].replaced,
  }))
  // 英語だけで読むと全試料の日本語が 0% だった。読み直しで戻る割合は 65〜100%（2026-10-13）。単語表（word-list）は、
  // 化けた語が同じ行の英単語（want・show）と混ざって半分に満たない行が残り、65% にとどまる。画面の手順（日本語＋英語で
  // 読む）では、その単語表も含めて全試料で 90% 以上を読む（上のテスト）。
  for (const row of rows) {
    assert.ok(row.replaced >= 1, `${row.id}: 化けた行を差し替えていない`)
    assert.ok(row.after >= 0.6 && row.after - row.before >= 0.6, `${row.id}: 読み直しても日本語の文字の ${Math.round(row.after * 100)}% しか戻らない（前は ${Math.round(row.before * 100)}%）`)
  }
  const average = rows.reduce((sum, row) => sum + row.after, 0) / rows.length
  assert.ok(average >= 0.85, `読み直しで戻った日本語の平均が ${Math.round(average * 100)}%`)
  // 英語だけのページは化けた行がなく、読み直さない。
  assert.equal(results.englishReread['english-only'].reread, 0)
  assert.equal(results.app['english-only'].reread, 0)
})

test('直す前の作り（英語だけで読む）の読み違いも、存在しない語としては出さない', () => {
  let misreadWords = 0
  let rejectedMisreads = 0
  for (const sample of samples) {
    const expected = expectedFor(sample)
    const expectedIds = new Set(expected.candidates.map((item) => item.id))
    const { match } = results.englishOnly[sample.id]
    for (const item of match.unmatched) assert.ok(englishWords.has(item.token), `${sample.id}: 実在しない「${item.token}」`)
    misreadWords += match.candidates.filter((item) => !expectedIds.has(item.id)).length
    rejectedMisreads += match.rejected.length
  }
  // 英語だけで読むと、日本語が英単語（basic・hot など）や英字の並びに化ける。直す前の画面はそれを候補・リクエストに出していた。
  assert.ok(misreadWords > 0, '英語だけで読んでも、日本語が英単語に化けなかった（直す前の不具合を再現できていない）')
  assert.ok(rejectedMisreads >= 30, `英語だけで読んだ読み違いの並びが少ない（${rejectedMisreads}）`)
})

test('日本語の文字は英単語の並びとして取り出さない', () => {
  for (const sample of samples) {
    for (const token of extractEnglishTokens(results.app[sample.id].text)) {
      assert.doesNotMatch(token, JAPANESE)
      assert.equal(normalizeOcrToken(token), normalizeOcrToken(token).replace(/[^a-z0-9'-]/g, ''))
    }
  }
})
