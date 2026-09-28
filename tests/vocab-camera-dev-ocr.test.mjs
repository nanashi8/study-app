// 開発版で「教科書から単語追加」の読み取りが「写真を読み込んでいます…」2% で止まった不具合の依頼
// （requests/2026-09-28-vocab-camera-dev-ocr.json）の受け入れ条件。
// 原因：src/screens/VocabCamera.jsx の生存フラグ mountedRef は useRef(true) で作り、effect の後始末だけで false に
// していた。src/main.jsx の StrictMode は開発版で effect を「付ける→外す→付ける」と2回走らせるので、印は false の
// まま残り、scanImage は写真を読み込んだ直後の `if (!mountedRef.current) return` で抜け、scanning も true のまま
// 残っていた。本番ビルドは effect を2回走らせないので、公開版では起きていなかった。
//
// 開発サーバー（StrictMode のまま）を立て、実ブラウザ（Playwright の Chromium・スマホの大きさ）で画面を動かす。
// 文字認識エンジン（tesseract.js）は、英語の認識データを外から読み込むので、決まった文を返す代わりのものに差し替える。
// 外への通信は止める（開発版の Firebase は本番のデータベースにつながっている）。辞書にない語の送信ボタンは押さない。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SENTENCE = 'The student reads zorblax books.'

// 文字認識エンジンの代わり。画面が渡す進み具合の知らせを本物と同じ順に返し、呼ばれた回数を window に残す。
// window.__cameraOcrHold に Promise を置くと、読み取りをそこで待たせる（途中で画面を離れる確かめに使う）。
const TESSERACT_STUB = `
const state = () => (window.__cameraOcr ??= { created: 0, recognized: 0, terminated: 0 })
export const OEM = { LSTM_ONLY: 1 }
export const PSM = { AUTO: 3 }
export async function createWorker(language, oem, options = {}) {
  state().created += 1
  const log = options.logger ?? (() => {})
  log({ status: 'loading tesseract core', progress: 1 })
  log({ status: 'initializing api', progress: 1 })
  return {
    async setParameters() {},
    async recognize() {
      log({ status: 'recognizing text', progress: 0.5 })
      if (window.__cameraOcrHold) await window.__cameraOcrHold
      state().recognized += 1
      return { data: { text: ${JSON.stringify(SENTENCE)} } }
    },
    async terminate() {
      state().terminated += 1
    },
  }
}
`

const tesseractStub = () => ({
  name: 'tesseract-stub',
  enforce: 'pre',
  resolveId: (id) => (id === 'tesseract.js' ? '\0tesseract-stub' : null),
  load: (id) => (id === '\0tesseract-stub' ? TESSERACT_STUB : null),
})

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
    await context.route((url) => url.pathname === '/src/screens/VocabCamera.jsx', async (route) => {
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
    plugins: [tesseractStub()],
    // 動かしている開発サーバーの依存の置き場を書き換えない。
    cacheDir: 'node_modules/.vite-camera-test',
    // 依存を最初に見つけておく（途中で見つけるとページを読み直し、開いた画面が入口へ戻る）。
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'], exclude: ['tesseract.js'] },
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

test('直す前の作りでは、開発版の読み取りが「写真を読み込んでいます…」2% で止まり、エンジンも呼ばれない', async () => {
  const { context, page, errors, revert } = await openCamera({ beforeFix: true })
  try {
    assert.ok(revert.replaced >= 1, '画面の JS に「付けたときに true に戻す」行が見つからず、直す前の作りを再現できていない')
    await scanSentence(page)
    await page.getByText('写真を読み込んでいます…').waitFor()
    await page.waitForTimeout(2_500)
    const main = await page.locator('main').innerText()
    assert.match(main, /写真を読み込んでいます…/)
    assert.match(main, /\b2%/)
    assert.equal(await page.locator('#ocr-candidates-title').count(), 0)
    assert.equal(await page.evaluate(() => window.__cameraOcr?.created ?? 0), 0)
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
})

test('開発版（StrictMode）でも、読み取りが辞書と一致した語と辞書にない語の結果まで進む', async () => {
  const { context, page, errors, revert } = await openCamera()
  try {
    assert.equal(revert.replaced, 0)
    await scanSentence(page)
    await page.locator('#ocr-candidates-title').waitFor({ timeout: 15_000 })
    const main = await page.locator('main').innerText()
    assert.match(main, /4語が辞書と一致/)
    assert.match(main, /読み取った 5 語のうち、辞書にある単語を候補にしました。/)
    assert.doesNotMatch(main, /写真を読み込んでいます…/)
    const requests = await page.locator('section', { has: page.locator('#ocr-requests-title') }).innerText()
    assert.match(requests, /辞書にない単語/)
    assert.match(requests, /zorblax/)
    // 読み取りを終えたら、エンジンを止める。
    assert.deepEqual(await page.evaluate(() => window.__cameraOcr), { created: 1, recognized: 1, terminated: 1 })
    // 送信ボタンは押さない（開発版の Firebase は本番）。外への通信も止めてある。
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
})

test('読み取りの途中で画面を離れると、エンジンを止めて写真のプレビューの URL を消し、結果を書かない', async () => {
  const { context, page, errors } = await openCamera()
  try {
    await page.evaluate(() => {
      window.__cameraOcrHold = new Promise((resolve) => { window.__cameraOcrRelease = resolve })
    })
    await scanSentence(page)
    await page.getByText('教科書の文字を読み取り中…').waitFor({ timeout: 15_000 })
    const previewUrl = await page.locator('main img[src^="blob:"]').first().getAttribute('src')
    assert.ok(previewUrl, '写真のプレビューが出ていない')
    await page.locator('[data-global-back-button]').click()
    await page.getByText('撮影した写真から英単語を読み取る').waitFor({ state: 'detached' })
    const afterLeaving = await page.evaluate(() => ({ ...window.__cameraOcr, revoked: window.__revokedUrls }))
    assert.equal(afterLeaving.terminated >= 1, true, '画面を離れてもエンジンを止めていない')
    assert.equal(afterLeaving.recognized, 0)
    assert.ok(afterLeaving.revoked.includes(previewUrl), '画面を離れても写真のプレビューの URL を消していない')
    // 待たせていた読み取りを終わらせても、離れた画面の結果は出さず、エラーも出ない。
    await page.evaluate(() => window.__cameraOcrRelease())
    await page.waitForTimeout(500)
    assert.equal(await page.evaluate(() => window.__cameraOcr.recognized), 1)
    assert.equal(await page.locator('#ocr-candidates-title').count(), 0)
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
})
