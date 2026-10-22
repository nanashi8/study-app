// 「教科書から単語追加」の読み取りを、本番のビルド（公開版と同じ作り）で確かめる。
// 依頼 requests/2026-10-14-camera-ocr-hard-photos.json の受け入れ条件 production-build-reads。
//
// 2026-10-14 に PaddleOCR へ置きかえて公開したところ、公開版では「文字を読み取れませんでした」になった（コンソールに
// 「no available backend found. ERR: [wasm]」「document is not defined」）。vite はビルドで import() を先読みの関数
// （\0vite/preload-helper.js）で包み、その関数がアプリ本体の塊（index）に入っていた。ONNX Runtime は別スレッド（proxy）で
// 自分の塊を読み込むので、別スレッドでアプリ本体まで動き、document がなくて止まった。開発版にはこの包みがなく、
// ほかのテスト（vocab-ocr-photos・vocab-camera-dev-ocr）は開発版で読んでいたので見落とした。
// vite.config.js で先読みの関数を別の小さな塊にした。このテストはビルドを作って配り、実際の画面で写真を読む。
// 2026-10-22 に、写真を読む部品（PhotoOcrPicker.jsx）を自作カードの「写真から作る」と共通にした（依頼
// requests/2026-10-22-custom-cards-photo-ocr.json）。読み取りエンジンを読み込む import() がその部品へ移ったので、自作カードの画面でも
// 本番のビルドで写真を読み、単語表がカードの候補になることを確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import net from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, preview } from 'vite'
import { chromium, webkit } from 'playwright'
import nlp from 'compromise/two'

import { ALL_WORDS } from '../src/data/vocab.js'
import { createContextReading } from '../src/lib/ocrContext.js'
import { fetchPhotos } from '../scripts/vocab-ocr-photos.mjs'
import { ensureOcrModels } from '../scripts/ocr-models.mjs'
import { englishWordSetForTests } from './english-word-set.mjs'
import { loadOcrTruth, scoreOcrResult } from './vocab-ocr-scoring.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
// 試料1枚と、前の作りが読めなかった実写真（赤地に白い字の標識・傾いた写真・縦書き）。
const READS = [
  { id: 'inline-mixed', browser: 'chromium' },
  { id: 'p05', browser: 'chromium' },
  { id: 'p03', browser: 'chromium' },
  { id: 'p12', browser: 'chromium' },
  { id: 'inline-mixed', browser: 'webkit' },
]
// 自作カードの「写真から作る」で読む試料（新出単語の表）。
const PHOTO_READS = [
  { id: 'word-list', browser: 'chromium' },
  { id: 'word-list', browser: 'webkit' },
]

let outDir
let server
let base
const browsers = []
const externalRequests = []
const messages = { chromium: [], webkit: [] }
// 外への通信とコンソールの行は、「英単語を読み取る」を押してから結果が出るまでの間だけを数える
// （アプリを開いたときのフォントなどは読み取りではない。テストはそれも止めるので、読み込めなかった知らせが出る）。
let reading = false
const results = []
const photoResults = []
let truths

const freePort = () => new Promise((resolve, reject) => {
  const probe = net.createServer()
  probe.on('error', reject)
  probe.listen(0, '127.0.0.1', () => {
    const { port } = probe.address()
    probe.close(() => resolve(port))
  })
})

// スマホの大きさの画面でアプリを開き、メニューから「教科書から単語追加」へ進む。
async function openCamera(context) {
  const page = await context.newPage()
  await page.goto(base)
  await page.locator('[data-global-menu-button]').click({ timeout: 60_000 })
  await page.locator('[data-menu-destination="vocabCamera"]').click()
  await page.getByText('撮影した写真から英単語を読み取る').waitFor()
  return page
}

// 写真を選んで「英単語を読み取る」を押し、結果（読み取った文字の欄）か、読めなかった知らせが出るまで待つ。
async function readOnScreen(page, path) {
  await page.locator('input[type=file]:not([capture])').setInputFiles({
    name: path.split('/').pop(),
    mimeType: path.endsWith('.png') ? 'image/png' : 'image/jpeg',
    buffer: readFileSync(path),
  })
  reading = true
  await page.getByRole('button', { name: '英単語を読み取る' }).click()
  const failed = page.getByText('文字を読み取れませんでした')
  await page.locator('#ocr-text').or(failed).first().waitFor({ timeout: 300_000 })
  reading = false
  if (await failed.count()) return { failed: true, text: '' }
  return { failed: false, text: await page.locator('#ocr-text').inputValue() }
}

// メニューから自作カードを開き、「写真から作る」で試料を読む。読み取った候補（表・裏・選んだか）か、読めなかった知らせを返す。
async function readCustomPhoto(context, path) {
  const page = await context.newPage()
  await page.goto(base)
  await page.locator('[data-global-menu-button]').click({ timeout: 60_000 })
  await page.locator('[data-menu-destination="customWords"]').click()
  await page.locator('[data-custom-photo-open]').click()
  await page.locator('[data-custom-photo]').waitFor()
  await page.locator('[data-custom-photo] input[type=file]:not([capture])').setInputFiles(path)
  reading = true
  await page.getByRole('button', { name: '文字を読み取る' }).click()
  const failed = page.getByText('文字を読み取れませんでした')
  await page.locator('#custom-photo-text').or(failed).first().waitFor({ timeout: 300_000 })
  reading = false
  const result = (await failed.count())
    ? { failed: true, rows: [] }
    : {
        failed: false,
        rows: await page.locator('[data-custom-photo-candidate]').evaluateAll((items) => items.map((item) => [
          item.querySelector('[data-custom-photo-front]').value,
          item.querySelector('[data-custom-photo-back]').value,
          item.querySelector('[data-custom-photo-check]').checked,
        ])),
      }
  await page.close()
  return result
}

before(async () => {
  await ensureOcrModels()
  const photos = await fetchPhotos()
  truths = loadOcrTruth().map((truth) => ({
    ...truth,
    path: truth.set === 'photo' ? photos.find((photo) => photo.id === truth.id).path : `${ROOT}tests/fixtures/vocab-ocr/${truth.id}.png`,
  }))

  outDir = mkdtempSync(join(tmpdir(), 'study-app-ocr-build-'))
  await build({ root: ROOT, logLevel: 'silent', build: { outDir, emptyOutDir: true } })
  const port = await freePort()
  server = await preview({ root: ROOT, logLevel: 'silent', build: { outDir }, preview: { port, host: '127.0.0.1', strictPort: true } })
  base = `http://127.0.0.1:${port}/`

  for (const type of ['chromium', 'webkit']) {
    const browser = await { chromium, webkit }[type].launch()
    browsers.push(browser)
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: type === 'chromium', hasTouch: true })
    // 自分のサーバーにだけ通す（モデルも ONNX Runtime の本体も同じサイトから読む）。外へ出ようとした数を数える。
    await context.route((url) => !url.href.startsWith(base) && !url.href.startsWith('blob:') && !url.href.startsWith('data:'), (route) => {
      if (reading) externalRequests.push(route.request().url())
      return route.abort()
    })
    context.on('console', (message) => reading && messages[type].push(`${message.type()}: ${message.text()}`))
    context.on('weberror', (error) => reading && messages[type].push(`pageerror: ${error.error().message}`))
    for (const read of READS.filter((item) => item.browser === type)) {
      const page = await openCamera(context)
      const truth = truths.find((item) => item.id === read.id)
      const started = Date.now()
      const result = await readOnScreen(page, truth.path)
      results.push({ ...read, ...result, seconds: (Date.now() - started) / 1000, truth })
      await page.close()
    }
    for (const read of PHOTO_READS.filter((item) => item.browser === type)) {
      const started = Date.now()
      const result = await readCustomPhoto(context, `${ROOT}tests/fixtures/vocab-ocr/${read.id}.png`)
      photoResults.push({ ...read, ...result, seconds: (Date.now() - started) / 1000 })
    }
  }
}, { timeout: 1_800_000 })

after(async () => {
  await Promise.all(browsers.map((browser) => browser.close()))
  await new Promise((resolve) => (server ? server.httpServer.close(resolve) : resolve()))
  if (outDir) rmSync(outDir, { recursive: true, force: true })
})

// 塊が静的に読み込む塊（import … from "./x.js"）をたどる。
function staticImports(file, seen = new Set()) {
  const code = readFileSync(join(outDir, 'assets', file), 'utf8')
  for (const [, name] of code.matchAll(/(?:\bfrom|\bimport)\s*"\.\/([^"]+\.js)"/g)) {
    if (seen.has(name)) continue
    seen.add(name)
    staticImports(name, seen)
  }
  return seen
}

test('ONNX Runtime の塊（別スレッドでも読み込む）は、アプリ本体の塊を読み込まない', () => {
  const assets = readdirSync(join(outDir, 'assets'))
  const html = readFileSync(join(outDir, 'index.html'), 'utf8')
  const entry = html.match(/<script type="module"[^>]*src="\.\/assets\/([^"]+\.js)"/)[1]
  const ort = assets.filter((file) => /^ort\.bundle\.min-.*\.js$/.test(file))
  assert.equal(ort.length, 1, assets.join(' '))
  const reached = [...staticImports(ort[0])]
  assert.ok(!reached.includes(entry), `${ort[0]} が ${entry} を読み込む：${reached.join(' ')}`)
  // 読み込むのは rolldown の下回りと先読みの関数だけ（どちらも読み込んだときに document を使わない）。
  for (const file of reached) assert.match(file, /^(rolldown-runtime|preload-helper)-/, file)
})

test('本番のビルドの画面で、写真を読み取りエンジンで読む（Chromium・WebKit）', (t) => {
  assert.equal(results.length, READS.length)
  for (const result of results) {
    t.diagnostic(`${result.browser} ${result.id} ${result.seconds.toFixed(1)}秒`)
    assert.equal(result.failed, false, `${result.browser} ${result.id}：文字を読み取れませんでした`)
    assert.ok(result.text.trim(), `${result.browser} ${result.id}：読み取った文字がない`)
  }
})

test('本番のビルドの自作カードの「写真から作る」でも読み、新出単語の表の7行を7枚の候補にする（Chromium・WebKit）', (t) => {
  assert.equal(photoResults.length, PHOTO_READS.length)
  for (const result of photoResults) {
    t.diagnostic(`${result.browser} 写真から作る ${result.id} ${result.seconds.toFixed(1)}秒`)
    assert.equal(result.failed, false, `${result.browser}：文字を読み取れませんでした`)
    assert.deepEqual(result.rows, [
      ['library', '図書館', true],
      ['borrow', '借りる', true],
      ['animal', '動物', true],
      ['interesting', 'おもしろい', true],
      ['librarian', '司書', true],
      ['wanted', 'want の過去形', true],
      ['showed', 'show の過去形', true],
    ], result.browser)
  }
})

// 開発版で読んだ数（tests/vocab-ocr-photos.test.mjs の HARD_FLOOR・試料）と同じだけ、画面の候補にする。
test('本番のビルドでも、開発版と同じだけの英単語を候補にする', () => {
  const englishWords = englishWordSetForTests()
  const contextReading = (text) => createContextReading(nlp, text, ALL_WORDS)
  const floor = { 'inline-mixed': null, p05: 14, p03: 4, p12: 6 }
  for (const result of results) {
    const score = scoreOcrResult(result.truth, { text: result.text, words: [] }, { englishWords, contextReading })
    const want = floor[result.id] ?? score.expected
    assert.ok(score.found >= want, `${result.browser} ${result.id}：${score.found}/${score.expected}（${score.missing}）`)
    assert.deepEqual(score.wrongRequests, [], `${result.browser} ${result.id}`)
    if (result.truth.set === 'fixture') assert.deepEqual(score.wrongSelected, [], `${result.browser} ${result.id}`)
  }
})

test('本番のビルドの読み取りは外のサイトへ通信しない（モデルも ONNX Runtime の本体も同じサイトから読む）', () => {
  assert.deepEqual(externalRequests, [])
})

// 「No available adapters.」は、テストのブラウザに GPU がないとき、WebGPU を探したブラウザ自身が出す知らせ。
// 「Successfully preconnected to https://fonts.googleapis.com/」は、アプリを開いたときのフォントの先読み（index.html）を WebKit が
// 知らせる行で、読み取りとは関係がない。開いてすぐ読む自作カードの「写真から作る」では、読んでいる間に届くことがある（2026-10-22）。
test('本番のビルドの読み取りのあいだ、コンソールに知らせ・エラーを出さない（Chromium・WebKit）', () => {
  const ours = (lines) => lines.filter((line) => line !== 'warning: No available adapters.'
    && line !== 'info: Successfully preconnected to https://fonts.googleapis.com/')
  assert.deepEqual(ours(messages.chromium), [])
  assert.deepEqual(ours(messages.webkit), [])
})
