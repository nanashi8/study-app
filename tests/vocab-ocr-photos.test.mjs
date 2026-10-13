// 「教科書から単語追加」の読み取りを、実際のブラウザ（Playwright の Chromium）と本物の読み取りエンジンで、ウェブで集めた
// 実際の写真28枚（tests/fixtures/vocab-ocr/photos.json）と試料の画像7枚（samples.json）に当てる。
// 依頼 requests/2026-10-13-camera-ocr-japanese.json の real-photos-from-web・node-browser-same・no-engine-warnings・
// image-format-evidence の受け入れ条件。
//
// ブラウザでは画面と同じ部品（ocrImage.js の下ごしらえ → ocrEngine.js の readOcrPage）で読む。エンジン本体と認識データは
// jsdelivr から読み込む（通信が要る）。写真は scripts/vocab-ocr-photos.mjs が node_modules/.cache へ取り込む。
// 同じ下ごしらえの画像を node でも readOcrPage で読み、結果が1字も違わないことを確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import * as tesseract from 'tesseract.js'
import nlp from 'compromise/two'

import { ALL_WORDS } from '../src/data/vocab.js'
import { createContextReading } from '../src/lib/ocrContext.js'
import { readOcrPage } from '../src/lib/ocrEngine.js'
import { createOcrWordTest, extractEnglishTokens, normalizeOcrToken } from '../src/lib/vocabOcr.js'
import { fetchPhotos } from '../scripts/vocab-ocr-photos.mjs'
import { englishWordSetForTests } from './english-word-set.mjs'
import { loadOcrTruth, scoreOcrResult, sumScores } from './vocab-ocr-scoring.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PREPARED = `${ROOT}node_modules/.cache/vocab-ocr-prepared/`
const TESSDATA = `${ROOT}node_modules/.cache/vocab-ocr-tessdata/`

// 画面と同じ部品で写真1枚を読むページ（開発サーバーの中だけで出す）。
const CHECK_PAGE = `
import * as tesseract from 'tesseract.js'
import { prepareImageForOcr } from '/src/lib/ocrImage.js'
import { ocrBrowserWorkerOptions, readOcrPage } from '/src/lib/ocrEngine.js'
import { createOcrWordTest } from '/src/lib/vocabOcr.js'
import { loadEnglishWordSet } from '/src/lib/englishWordList.js'
import { ALL_WORDS } from '/src/data/vocab.js'
const toBase64 = async (blob) => {
  const bytes = new Uint8Array(await blob.arrayBuffer())
  let text = ''
  for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(text)
}
window.readPhoto = async (url) => {
  const file = await (await fetch(url)).blob()
  const image = await prepareImageForOcr(file)
  const isEnglishWord = createOcrWordTest(ALL_WORDS, await loadEnglishWordSet())
  const page = await readOcrPage(tesseract, image, { isEnglishWord, workerOptions: await ocrBrowserWorkerOptions() })
  return { text: page.text, words: page.words, image: await toBase64(image), type: image.type }
}
window.checkReady = true
`

let vite
let browser
let page
let base
const consoleMessages = []
const browserResults = new Map()
const nodeResults = new Map()
let truths
let englishWords

const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    server.close(() => resolve(port))
  })
})

before(async () => {
  const photos = await fetchPhotos()
  truths = loadOcrTruth().map((truth) => ({
    ...truth,
    path: truth.set === 'photo' ? photos.find((photo) => photo.id === truth.id).path : `${ROOT}tests/fixtures/vocab-ocr/${truth.id}.png`,
  }))
  englishWords = englishWordSetForTests()

  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    cacheDir: 'node_modules/.vite-ocr-photos-test',
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'] },
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null },
    plugins: [{
      name: 'ocr-check-page',
      resolveId: (id) => (id === '/__ocr-check.js' ? '\0ocr-check.js' : null),
      load: (id) => (id === '\0ocr-check.js' ? CHECK_PAGE : null),
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url !== '/__ocr-check.html') return next()
          const html = await server.transformIndexHtml('/__ocr-check.html', '<!doctype html><meta charset="utf-8"><script type="module" src="/__ocr-check.js"></script>')
          res.setHeader('content-type', 'text/html')
          res.end(html)
        })
      },
    }],
  })
  await vite.listen()
  base = `http://127.0.0.1:${port}/`
  browser = await chromium.launch()
  const context = await browser.newContext()
  // 自分のサーバーと、読み取りエンジンの置き場（jsdelivr）だけに通す。
  await context.route((url) => !url.href.startsWith(base) && url.hostname !== 'cdn.jsdelivr.net', (route) => route.abort())
  page = await context.newPage()
  page.on('console', (message) => {
    if (!/\[vite\]/.test(message.text())) consoleMessages.push(`${message.type()}: ${message.text()}`)
  })
  page.on('pageerror', (error) => consoleMessages.push(`pageerror: ${error.message}`))
  await page.goto(`${base}__ocr-check.html`)
  await page.waitForFunction(() => window.checkReady, null, { timeout: 120_000 })

  mkdirSync(PREPARED, { recursive: true })
  const isEnglishWord = createOcrWordTest(ALL_WORDS, englishWords)
  const workerOptions = { cachePath: TESSDATA, workerPath: `${ROOT}tests/tesseract-node-worker.cjs` }
  for (const truth of truths) {
    const result = await page.evaluate((url) => window.readPhoto(url), `/@fs${truth.path}`)
    browserResults.set(truth.id, result)
    const prepared = `${PREPARED}${truth.id}.png`
    writeFileSync(prepared, Buffer.from(result.image, 'base64'))
    nodeResults.set(truth.id, await readOcrPage(tesseract, prepared, { isEnglishWord, workerOptions }))
  }
}, { timeout: 1_200_000 })

after(async () => {
  await browser?.close()
  await vite?.close()
})

const contextReading = (text) => createContextReading(nlp, text, ALL_WORDS)
const scoresOf = (set) => truths.filter((truth) => truth.set === set).map((truth) => scoreOcrResult(truth, browserResults.get(truth.id), { englishWords, contextReading }))

test('写真は28枚・試料は7枚で、写真は自由な使用条件のものだけ', () => {
  assert.equal(truths.filter((truth) => truth.set === 'photo').length, 28)
  assert.equal(truths.filter((truth) => truth.set === 'fixture').length, 7)
  for (const truth of truths.filter((item) => item.set === 'photo')) {
    assert.match(truth.license, /^(CC BY(-SA)? [0-9.]+|CC0|Public domain)$/, truth.id)
  }
})

test('ブラウザは画面と同じ下ごしらえ（PNG）で、node とブラウザの読み取りは全35枚で1字も違わない', () => {
  const differ = []
  for (const truth of truths) {
    assert.equal(browserResults.get(truth.id).type, 'image/png')
    if (browserResults.get(truth.id).text !== nodeResults.get(truth.id).text) differ.push(truth.id)
  }
  assert.deepEqual(differ, [])
})

test('読み取りのあいだ、ブラウザのコンソールにエンジンの知らせ・エラーを1行も出さない', () => {
  assert.deepEqual(consoleMessages, [])
})

test('画面が出す語は全部、実在する英単語（辞書の語・英語の単語表の語）', () => {
  let offered = 0
  for (const score of [...scoresOf('photo'), ...scoresOf('fixture')]) {
    for (const item of score.match.unmatched) {
      offered += 1
      assert.ok(englishWords.has(item.token), `${score.id}: 実在しない「${item.token}」`)
    }
    offered += score.match.candidates.length
  }
  assert.ok(offered > 500, `${offered}`)
})

test('試料7枚：英単語は全部候補になり、写真にない語は出さず、日本語は全部読む', () => {
  const total = sumScores(scoresOf('fixture'))
  assert.equal(total.found, total.expected)
  assert.equal(total.wrongSelected + total.wrongRequests, 0)
  assert.equal(total.japaneseHits, total.japaneseTotal)
})

// 2026-10-14 の結果（写真28枚）：英単語 394/582（67.7%）、最初から選ぶ正しい語 346、写真にない語を最初から選ぶ誤り 1
// （p21 の PLEASE を lease）、印つきの誤り 35、リクエストの誤り 1（p23 の boa）、横書きの日本語 1029/1794 字（57.4%）。
// 直す前の画面（0d8b60e2：LSTM だけの版・日本語＋英語で1回読み、化けた行を日本語だけで読み直す）は、同じ写真で英単語 348/582
// （59.8%）、選ぶ正しい語 334、写真にない語を選ぶ誤り 22、リクエストの誤り 21、日本語 882/1794 字（49.2%）だった。
// 下の境目は、この結果を下回ったら止める。
test('写真28枚：写真にない語をほとんど選ばず、英単語と日本語を直す前より多く読む', (t) => {
  const scores = scoresOf('photo')
  const total = sumScores(scores)
  t.diagnostic(JSON.stringify(total))
  for (const score of scores) if (score.wrongSelected.length || score.wrongRequests.length) t.diagnostic(`${score.id} ${score.wrongSelected} ${score.wrongRequests}`)
  assert.ok(total.found >= 394, `英単語 ${total.found}/${total.expected}`)
  assert.ok(total.wrongSelected <= 1, `写真にない語を最初から選んだ ${total.wrongSelected}`)
  assert.ok(total.wrongRequests <= 1, `写真にない語をリクエストの候補に出した ${total.wrongRequests}`)
  assert.ok(total.selectedRight >= 346, `最初から選ぶ正しい語 ${total.selectedRight}`)
  assert.ok(total.japaneseHits >= 1029, `日本語 ${total.japaneseHits}/${total.japaneseTotal}`)
})

test('英字のない写真（日本語だけ・縦書き・景色）からは、候補もリクエストも出さない', () => {
  const noLatin = truths.filter((truth) => truth.set === 'photo' && !extractEnglishTokens(truth.latin).some((token) => normalizeOcrToken(token).length >= 2))
  assert.ok(noLatin.length >= 7, `${noLatin.length}`)
  for (const truth of noLatin) {
    const score = scoreOcrResult(truth, browserResults.get(truth.id), { englishWords, contextReading })
    assert.deepEqual(score.match.candidates.filter((item) => !item.uncertain && !item.corrected).map((item) => item.headword), [], truth.id)
    assert.deepEqual(score.match.unmatched.map((item) => item.token), [], truth.id)
  }
})
