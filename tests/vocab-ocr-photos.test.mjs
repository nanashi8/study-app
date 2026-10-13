// 「教科書から単語追加」の読み取りを、実際のブラウザ（Playwright の Chromium）と本物の読み取りエンジン（PaddleOCR の PP-OCRv6）で、
// ウェブで集めた実際の写真28枚（tests/fixtures/vocab-ocr/photos.json）と試料の画像7枚（samples.json）に当てる。
// 依頼 requests/2026-10-13-camera-ocr-japanese.json と requests/2026-10-14-camera-ocr-hard-photos.json の受け入れ条件。
//
// ブラウザでは画面と同じ部品（ocrImage.js の下ごしらえ → ocrEngine.js の createOcrReader）で読む。モデルは開発サーバーが
// /ocr-models/ から配り（vite.config.js・scripts/ocr-models.mjs が取り込んで sha256 を確かめる）、ONNX Runtime の本体も同じサイトから
// 読み込む。写真は scripts/vocab-ocr-photos.mjs が node_modules/.cache へ取り込む（取り込みには通信が要る）。
// テストのブラウザには WebGPU がないので wasm で読む（WebGPU で読んでも結果が同じことは 2026-10-14 に確かめた）。
// Safari のエンジン（WebKit）でも、試料を1枚読めることを確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium, webkit } from 'playwright'
import nlp from 'compromise/two'

import { ALL_WORDS } from '../src/data/vocab.js'
import { createContextReading } from '../src/lib/ocrContext.js'
import { extractEnglishTokens, normalizeOcrToken } from '../src/lib/vocabOcr.js'
import { fetchPhotos } from '../scripts/vocab-ocr-photos.mjs'
import { ensureOcrModels } from '../scripts/ocr-models.mjs'
import { englishWordSetForTests } from './english-word-set.mjs'
import { japaneseHits, loadOcrTruth, scoreOcrResult, sumScores } from './vocab-ocr-scoring.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

// 画面と同じ部品で写真1枚を読むページ（開発サーバーの中だけで出す）。
const CHECK_PAGE = `
import * as paddle from '@paddleocr/paddleocr-js'
import { prepareImageForOcr } from '/src/lib/ocrImage.js'
import { createOcrReader } from '/src/lib/ocrEngine.js'
let reader
window.readPhoto = async (url) => {
  reader ??= createOcrReader(paddle)
  const ready = await reader
  const file = await (await fetch(url)).blob()
  const image = await prepareImageForOcr(file)
  const started = performance.now()
  const page = await ready.read(image)
  return { text: page.text, words: page.words, ms: performance.now() - started, type: image.type, runtime: page.runtime }
}
window.checkReady = true
`

let vite
let base
const browsers = []
const externalRequests = []
const consoleMessages = []
const browserResults = new Map()
let webkitResult
let webkitMessages = []
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

async function openCheckPage(browserType) {
  const browser = await browserType.launch()
  const context = await browser.newContext()
  // 自分のサーバーにだけ通す（モデルも ONNX Runtime の本体も同じサイトから読む）。外へ出ようとした数を数える。
  await context.route((url) => !url.href.startsWith(base) && !url.href.startsWith('blob:') && !url.href.startsWith('data:'), (route) => {
    externalRequests.push(route.request().url())
    return route.abort()
  })
  const page = await context.newPage()
  const messages = []
  page.on('console', (message) => {
    if (!/\[vite\]/.test(message.text())) messages.push(`${message.type()}: ${message.text()}`)
  })
  page.on('pageerror', (error) => messages.push(`pageerror: ${error.message}`))
  await page.goto(`${base}__ocr-check.html`)
  await page.waitForFunction(() => window.checkReady, null, { timeout: 120_000 })
  return { browser, page, messages }
}

before(async () => {
  await ensureOcrModels()
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
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'], include: ['@paddleocr/paddleocr-js'] },
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

  const chrome = await openCheckPage(chromium)
  browsers.push(chrome.browser)
  consoleMessages.push(...chrome.messages)
  for (const truth of truths) {
    browserResults.set(truth.id, await chrome.page.evaluate((url) => window.readPhoto(url), `/@fs${truth.path}`))
  }
  consoleMessages.push(...chrome.messages.splice(0))

  const safari = await openCheckPage(webkit)
  browsers.push(safari.browser)
  const fixture = truths.find((truth) => truth.id === 'inline-mixed')
  webkitResult = await safari.page.evaluate((url) => window.readPhoto(url), `/@fs${fixture.path}`)
  webkitMessages = safari.messages
}, { timeout: 1_200_000 })

after(async () => {
  await Promise.all(browsers.map((browser) => browser.close()))
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

test('ブラウザは画面と同じ下ごしらえ（PNG）で読み、Safari のエンジン（WebKit）でも同じ文字を読む', () => {
  for (const truth of truths) assert.equal(browserResults.get(truth.id).type, 'image/png', truth.id)
  assert.equal(webkitResult.text, browserResults.get('inline-mixed').text)
  assert.match(webkitResult.text, /「decide to/)
})

// 「No available adapters.」は、テストのブラウザに GPU がないとき、WebGPU を探したブラウザ自身が出す知らせ（GPU のある端末では
// 出ない）。それ以外の知らせ・エラーは1行も出さない。
test('読み取りは外のサイトへ通信しない（モデルも ONNX Runtime の本体も同じサイトから読む）', () => {
  assert.deepEqual(externalRequests, [])
})

test('読み取りのあいだ、ブラウザのコンソールに知らせ・エラーを出さない（Chromium・WebKit）', () => {
  const ours = (messages) => messages.filter((message) => message !== 'warning: No available adapters.')
  assert.deepEqual(ours(consoleMessages), [])
  assert.deepEqual(ours(webkitMessages), [])
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
  assert.ok(offered > 700, `${offered}`)
})

test('試料7枚：英単語は全部候補になり、写真にない語は出さず、日本語を読む', (t) => {
  const total = sumScores(scoresOf('fixture'))
  t.diagnostic(JSON.stringify(total))
  assert.equal(total.found, total.expected)
  assert.equal(total.wrongSelected + total.wrongRequests, 0)
  assert.ok(total.japaneseHits >= total.japaneseTotal - 1, `日本語 ${total.japaneseHits}/${total.japaneseTotal}`)
})

// 2026-10-14 の結果（写真28枚、wasm）：英単語 546/582（93.8%）、最初から選ぶ正しい語 536、写真にない語を最初から選ぶ誤り 3
// （古い看板の THE を HE・THEN、手書きの hot を not）、リクエストの誤り 1（手書きの Show case を showcase）、横書きの日本語
// 1,618/1,794 字（90.2%）。前の作り（Tesseract・2つのエンジン×2通り）は英単語 394・選ぶ正しい語 346・選ぶ誤り 1・リクエストの誤り 1・
// 日本語 1,029 字、その前の公開版は 348・334・22・21・882 字だった。下の境目は、この結果を下回ったら止める。
const PHOTO_FLOOR = { found: 546, selectedRight: 536, wrongSelected: 3, wrongRequests: 1, japaneseHits: 1618 }
// 前の作りが読めなかった9枚の、写真ごとの英字の辞書の語と日本語の字（縦書きをふくむ）。2026-10-14 の結果：
// p03 4/4・21/24、p05 14/14・46/47、p10 2/2・12/12、p12 6/6・31/33（縦書き）、p15 0/0・8/8（縦書き）、p20 は字が読めない遠景で正解なし、
// p24 8/15・27/116（曲がった紙面の接写で、半分ほど）、p25 0/0・9/11（縦書きの題）、p28 1/1・8/8。
const HARD_FLOOR = [['p03', 4, 21], ['p05', 14, 46], ['p10', 2, 12], ['p12', 6, 31], ['p15', 0, 8], ['p24', 8, 27], ['p25', 0, 9], ['p28', 1, 8]]
test('写真28枚：英単語と日本語を前の作りより多く読み、写真にない語をほとんど選ばない', (t) => {
  const scores = scoresOf('photo')
  const total = sumScores(scores)
  t.diagnostic(JSON.stringify(total))
  for (const score of scores) if (score.wrongSelected.length || score.wrongRequests.length) t.diagnostic(`${score.id} ${score.wrongSelected} | ${score.wrongRequests}`)
  assert.ok(total.found >= PHOTO_FLOOR.found, `英単語 ${total.found}/${total.expected}`)
  assert.ok(total.selectedRight >= PHOTO_FLOOR.selectedRight, `最初から選ぶ正しい語 ${total.selectedRight}`)
  assert.ok(total.wrongSelected <= PHOTO_FLOOR.wrongSelected, `写真にない語を最初から選んだ ${total.wrongSelected}`)
  assert.ok(total.wrongRequests <= PHOTO_FLOOR.wrongRequests, `写真にない語をリクエストの候補に出した ${total.wrongRequests}`)
  assert.ok(total.japaneseHits >= PHOTO_FLOOR.japaneseHits, `日本語 ${total.japaneseHits}/${total.japaneseTotal}`)
})

// 前の作り（Tesseract）が読めなかった9枚。英字の辞書の語と、横書き・縦書きの日本語の字を、写真ごとに数える。
const HARD_PHOTOS = ['p03', 'p05', 'p10', 'p12', 'p15', 'p20', 'p24', 'p25', 'p28']
test('前の作りが読めなかった9枚（色地に白い字・傾き・曲がった紙面・縦書き・遠くの小さい字）を読む', (t) => {
  const rows = []
  for (const id of HARD_PHOTOS) {
    const truth = truths.find((item) => item.id === id)
    const result = browserResults.get(id)
    const score = scoreOcrResult(truth, result, { englishWords, contextReading })
    const japanese = truth.japanese ? japaneseHits(truth.japanese, result.text) : null
    rows.push({ id, english: `${score.found}/${score.expected}`, japanese: japanese ? `${japanese.hits}/${japanese.total}` : '-' })
  }
  t.diagnostic(JSON.stringify(rows))
  for (const [id, english, japanese] of HARD_FLOOR) {
    const row = rows.find((item) => item.id === id)
    const [foundEnglish] = row.english.split('/').map(Number)
    const [foundJapanese] = row.japanese === '-' ? [0] : row.japanese.split('/').map(Number)
    assert.ok(foundEnglish >= english, `${id} 英単語 ${row.english}`)
    assert.ok(foundJapanese >= japanese, `${id} 日本語 ${row.japanese}`)
  }
})

test('英字のない写真（日本語だけ・縦書き・景色）からは、写真にない語を選ばず、リクエストも出さない', () => {
  const noLatin = truths.filter((truth) => truth.set === 'photo' && !extractEnglishTokens(truth.latin).some((token) => normalizeOcrToken(token).length >= 2))
  assert.ok(noLatin.length >= 7, `${noLatin.length}`)
  for (const truth of noLatin) {
    const score = scoreOcrResult(truth, browserResults.get(truth.id), { englishWords, contextReading })
    assert.deepEqual(score.wrongSelected, [], truth.id)
    assert.deepEqual(score.match.unmatched.map((item) => item.token), [], truth.id)
  }
})
