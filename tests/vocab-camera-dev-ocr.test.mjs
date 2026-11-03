// 開発版で「教科書から単語追加」の読み取りが「写真を読み込んでいます…」2% で止まった不具合の依頼
// （requests/2026-09-28-vocab-camera-dev-ocr.json）の受け入れ条件。
// 原因：src/screens/VocabCamera.jsx の生存フラグ mountedRef は useRef(true) で作り、effect の後始末だけで false に
// していた。src/main.jsx の StrictMode は開発版で effect を「付ける→外す→付ける」と2回走らせるので、印は false の
// まま残り、scanImage は写真を読み込んだ直後の `if (!mountedRef.current) return` で抜け、scanning も true のまま
// 残っていた。本番ビルドは effect を2回走らせないので、公開版では起きていなかった。
// 2026-10-22 に、写真を選んで読む部分を src/components/PhotoOcrPicker.jsx の usePhotoOcr へ移した（自作カードの「写真から作る」と
// 共通）。生存フラグもそこにあるので、直す前の作りはそのファイルから1行を抜いて作る。
//
// 開発サーバー（StrictMode のまま）を立て、実ブラウザ（Playwright の Chromium・スマホの大きさ）で画面を動かす。
// 文字認識エンジン（PaddleOCR）は、モデルと ONNX Runtime を読み込むので、決まった文を返す代わりのものに差し替える。
// 外への通信は止める（開発版の Firebase は本番のデータベースにつながっている）。辞書にない語の送信ボタンは押さない。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { OCR_STUB_KEY, ocrWorkerStub } from './ocr-worker-stub.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SENTENCE = 'The student reads zorblax books.'
// 代わりのエンジン（PaddleOCR の代わり）が返す読み取りの結果。行ごとの文字と確からしさ（score 0〜1）。
// 依頼 requests/2026-10-13-camera-ocr-japanese.json・2026-10-14-camera-ocr-hard-photos.json：日本語は日本語のまま、辞書の語
// （saw は文脈で see、at・the・zoo・we・like・tea）は候補、実在するが辞書にない語（walrus）はリクエストの候補、確からしさの低い行の
// hot は「不確か」で選ばず、実在しない並び（xqzrt）と人名（Emi）は「英単語として確かめられなかった文字」に分ける。
const OCR_ITEMS = [
  { text: '動物園でセイウチを見ました。', score: 0.95 },
  { text: 'Emi saw a walrus at the zoo. xqzrt', score: 0.93 },
  { text: 'We like tea', score: 0.92 },
  { text: 'hot', score: 0.3 },
].map((item, i) => ({ ...item, poly: [[10, i * 50], [400, i * 50], [400, i * 50 + 30], [10, i * 50 + 30]] }))
const OCR_TEXT = OCR_ITEMS.map((item) => item.text).join('\n')

let vite
let browser
let base

const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    server.close(() => resolve(port))
  })
})

// スマホの大きさの画面を開き、メニューから「教科書から単語追加」へ進む。
// beforeFix なら、画面の JS から「付けたときに生きている印を true に戻す」1行を抜いて、直す前の作りにする。
const setStub = (page, patch) => page.evaluate(([key, value]) => {
  localStorage.setItem(key, JSON.stringify({ ...JSON.parse(localStorage.getItem(key) || '{}'), ...value }))
}, [OCR_STUB_KEY, patch])

async function openCamera({ beforeFix = false } = {}) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  })
  await context.route((url) => !url.href.startsWith(base), (route) => route.abort())
  const revert = { replaced: 0 }
  if (beforeFix) {
    await context.route((url) => url.pathname === '/src/components/PhotoOcrPicker.jsx', async (route) => {
      const response = await route.fetch()
      const body = (await response.text()).replace(/\bmountedRef\.current = true;?/g, () => {
        revert.replaced += 1
        return ''
      })
      await route.fulfill({ response, body })
    })
  }
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    // 止めた外への通信（フォントなど）の読み込みの失敗は数えない。
    if (message.type() === 'error' && !/Failed to load resource/.test(message.text())) errors.push(message.text())
  })
  // 画面を離れたときの後始末で、写真のプレビューの URL を消したかを数える。
  await page.addInitScript(() => {
    window.__revokedUrls = []
    const revoke = URL.revokeObjectURL.bind(URL)
    URL.revokeObjectURL = (url) => {
      window.__revokedUrls.push(url)
      return revoke(url)
    }
  })
  await page.goto(base)
  await page.locator('[data-global-menu-button]').click({ timeout: 30_000 })
  await page.locator('[data-menu-destination="vocabCamera"]').click()
  await page.getByText('撮影した写真から英単語を読み取る').waitFor()
  await setStub(page, { items: OCR_ITEMS, reads: [], hold: false })
  return { context, page, errors, revert }
}

// 画面の中で英文の画像を作り、「写真を選ぶ」から選んで「英単語を読み取る」を押す。
async function scanSentence(page) {
  const dataUrl = await page.evaluate((sentence) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 260
    const context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#000'
    context.font = '64px Georgia, serif'
    context.fillText(sentence, 30, 150)
    return canvas.toDataURL('image/png')
  }, SENTENCE)
  await page.locator('input[type=file]:not([capture])').setInputFiles({
    name: 'page.png',
    mimeType: 'image/png',
    buffer: Buffer.from(dataUrl.split(',')[1], 'base64'),
  })
  await page.getByRole('button', { name: '英単語を読み取る' }).click()
}

before(async () => {
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    plugins: [ocrWorkerStub()],
    // 動かしている開発サーバーの依存の置き場を書き換えない。
    cacheDir: 'node_modules/.vite-camera-test',
    // 依存を最初に見つけておく（途中で見つけるとページを読み直し、開いた画面が入口へ戻る）。
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'] },
    // ファイルの変更を見張らない。ほかの作業でファイルが変わっても、ページを読み直さない。
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null },
  })
  await vite.listen()
  base = `http://127.0.0.1:${port}/`
  browser = await chromium.launch()
})

after(async () => {
  await browser?.close()
  await vite?.close()
})

test('開発版は StrictMode で画面を描く（effect が2回走る場合を確かめている）', () => {
  const main = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8')
  assert.match(main, /<StrictMode>/)
  assert.equal(vite.config.command, 'serve')
  assert.equal(vite.config.mode, 'development')
})

test('直す前の作りでは、開発版で読み取りから戻っても結果が出ない（StrictMode の effect が2回走るため）', async () => {
  const { context, page, errors, revert } = await openCamera({ beforeFix: true })
  try {
    assert.ok(revert.replaced >= 1, '画面の JS に「付けたときに true に戻す」行が見つからず、直す前の作りを再現できていない')
    await scanSentence(page)
    await page.waitForURL(/ocr\.html/)
    await page.getByText('撮影した写真から英単語を読み取る').waitFor({ timeout: 30_000 })
    await page.waitForTimeout(2_500)
    assert.equal(await page.locator('#ocr-candidates-title').count(), 0)
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
})

test('開発版（StrictMode）でも、PaddleOCR で読み、辞書と一致した語・辞書にない語・確かめられなかった文字の結果まで進む', async () => {
  const { context, page, errors, revert } = await openCamera()
  try {
    assert.equal(revert.replaced, 0)
    await scanSentence(page)
    await page.locator('#ocr-candidates-title').waitFor({ timeout: 15_000 })
    const main = await page.locator('main').innerText()
    assert.match(main, /8語が辞書と一致/)
    assert.match(main, /読み取った英語 11 語のうち、辞書にある単語を候補にしました。/)
    assert.doesNotMatch(main, /写真を読み込んでいます…/)
    // 読み取った文字の欄には、日本語は日本語のまま出る。
    assert.equal(await page.locator('#ocr-text').inputValue(), OCR_TEXT)
    // 候補：確かな辞書の語は選んだ状態、確からしさの低い hot は「不確か」と示して選ばない。saw は文脈から see。
    const candidates = page.locator('section', { has: page.locator('#ocr-candidates-title') })
    const row = (headword) => candidates.locator('label', { hasText: new RegExp(`^${headword}(?![a-z])`) })
    for (const headword of ['see', 'at', 'the', 'zoo', 'we', 'like', 'tea']) assert.equal(await row(headword).locator('input').isChecked(), true, headword)
    assert.match(await row('see').innerText(), /saw → see/)
    assert.equal(await row('hot').locator('input').isChecked(), false)
    assert.equal(await row('hot').locator('[data-ocr-uncertain]').count(), 1)
    const requests = await page.locator('section', { has: page.locator('#ocr-requests-title') }).innerText()
    assert.match(requests, /辞書にない単語/)
    assert.match(requests, /walrus/)
    assert.match(requests, /辞書にまだない英単語です。選んだ語だけを辞書登録リクエストへ送ります。写真や教科書の本文、メールアドレスは送信しません。/)
    assert.doesNotMatch(requests, /xqzrt|Emi/)
    // 実在しない並びと人名は、リクエストに出さず、確かめられなかった文字として示す。
    const rejected = await page.locator('[data-ocr-rejected] li').allInnerTexts()
    assert.deepEqual(rejected, ['Emi', 'xqzrt'])
    // 読み取り専用のページで1度だけ読み、元の画面へ戻っている。
    assert.deepEqual((await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), OCR_STUB_KEY)).reads, [false])
    assert.doesNotMatch(page.url(), /ocr\.html/)
    // 送信ボタンは押さない（開発版の Firebase は本番）。外への通信も止めてある。
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
})

test('読み取りの途中で「やめる」を押すと、元の画面へ戻って写真は残し、結果は出さない', async () => {
  const { context, page, errors } = await openCamera()
  try {
    await setStub(page, { hold: true })
    await scanSentence(page)
    await page.waitForURL(/ocr\.html/)
    await page.getByText('教科書の文字を読み取り中…').waitFor({ timeout: 15_000 })
    await page.getByRole('button', { name: 'やめる' }).click()
    await page.getByText('撮影した写真から英単語を読み取る').waitFor({ timeout: 30_000 })
    await page.locator('main img[src^="blob:"]').first().waitFor()
    assert.equal(await page.locator('#ocr-candidates-title').count(), 0)
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
})
