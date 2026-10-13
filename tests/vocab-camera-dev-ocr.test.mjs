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
// 代わりのエンジンが返す読み取りの結果（日本語まじり・語ごとの確からしさと位置つき）。
// 依頼 requests/2026-10-13-camera-ocr-japanese.json：画面は「日本語＋英語」と「英語だけ」の2つのエンジンを、白黒の決め方2通り
// （'0'・'2'）で読み、行ごとにまとめる。日本語＋英語のエンジンは日本語の行を読み、英語だけのエンジンは日本語の行を英字に化けて
// 読む（EKTT Licikd BZ）。まとめた結果では、日本語は日本語のまま、化けた英字は出さず、辞書の語（saw は文脈で see、at・the・zoo・
// we・like・tea）は候補、実在するが辞書にない語（walrus）はリクエストの候補、確からしさの低い hot は「不確か」で選ばず、
// 実在しない並び（xqzrt）と人名（Emi）は「英単語として確かめられなかった文字」に分ける。
const lineOf = (y, words) => ({
  text: words.map(([text]) => text).join(/[a-z]/i.test(words[0][0]) ? ' ' : ''),
  bbox: { x0: 10, y0: y, x1: 10 + words.length * 70, y1: y + 30 },
  words: words.map(([text, confidence], i) => ({ text, confidence, bbox: { x0: 10 + i * 70, y0: y, x1: 70 + i * 70, y1: y + 30 } })),
})
const JAPANESE_LINE = lineOf(0, [['動物園', 95], ['で', 95], ['セイウチ', 94], ['を', 95], ['見', 95], ['まし', 95], ['た', 95], ['。', 95]])
const GARBLED_LINE = lineOf(0, [['EKTT', 5], ['Licikd', 0], ['BZ', 21]])
const ENGLISH_LINES = [
  lineOf(50, [['Emi', 93], ['saw', 93], ['a', 93], ['walrus', 92], ['at', 92], ['the', 92], ['zoo.', 92], ['xqzrt', 20]]),
  lineOf(100, [['We', 92], ['like', 92], ['hot', 30], ['tea', 92]]),
]
const OCR_LINES = { ja: [JAPANESE_LINE, ...ENGLISH_LINES], en: [GARBLED_LINE, ...ENGLISH_LINES] }
const OCR_TEXT = [JAPANESE_LINE, ...ENGLISH_LINES].map((line) => line.text).join('\n')

// 文字認識エンジンの代わり。画面が渡す進み具合の知らせを本物と同じ順に返し、呼ばれた回数・言語・設定を window に残す。
// window.__cameraOcrHold に Promise を置くと、読み取りをそこで待たせる（途中で画面を離れる確かめに使う）。
const TESSERACT_STUB = `
const state = () => (window.__cameraOcr ??= { created: 0, recognized: 0, terminated: 0, languages: [], thresholdings: [], configs: [], corePaths: [] })
export const OEM = { LSTM_ONLY: 1 }
export const PSM = { AUTO: 3 }
const LINES = ${JSON.stringify(OCR_LINES)}
export async function createWorker(language, oem, options = {}, config) {
  const languages = Array.isArray(language) ? language : [language]
  const engine = languages.includes('jpn') ? 'ja' : 'en'
  state().created += 1
  state().languages.push(languages)
  state().configs.push(config)
  state().corePaths.push(options.corePath)
  const log = options.logger ?? (() => {})
  log({ status: 'loading tesseract core', progress: 1 })
  log({ status: 'initializing api', progress: 1 })
  return {
    async setParameters(parameters) {
      state().thresholdings.push(engine + parameters.thresholding_method)
    },
    async recognize() {
      log({ status: 'recognizing text', progress: 0.5 })
      if (window.__cameraOcrHold) await window.__cameraOcrHold
      state().recognized += 1
      log({ status: 'recognizing text', progress: 1 })
      const lines = LINES[engine]
      return { data: { text: lines.map((line) => line.text).join('\\n'), blocks: [{ paragraphs: [{ lines }] }] } }
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

test('開発版（StrictMode）でも、2つのエンジン×2通りで読み、辞書と一致した語・辞書にない語・確かめられなかった文字の結果まで進む', async () => {
  const { context, page, errors, revert } = await openCamera()
  try {
    assert.equal(revert.replaced, 0)
    await scanSentence(page)
    await page.locator('#ocr-candidates-title').waitFor({ timeout: 15_000 })
    const main = await page.locator('main').innerText()
    assert.match(main, /8語が辞書と一致/)
    assert.match(main, /読み取った英語 11 語のうち、辞書にある単語を候補にしました。/)
    assert.doesNotMatch(main, /写真を読み込んでいます…/)
    // 読み取った文字の欄には、日本語は日本語のまま出て、英語だけのエンジンが化けさせた英字は出ない。
    assert.equal(await page.locator('#ocr-text').inputValue(), OCR_TEXT)
    assert.doesNotMatch(main, /EKTT|Licikd/)
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
    // エンジンは「日本語＋英語」と「英語だけ」の2つ。どちらも白黒の決め方2通りで読み、知らせを止める設定で作り、終えたら止める。
    const state = await page.evaluate(() => window.__cameraOcr)
    assert.deepEqual([state.created, state.recognized, state.terminated], [2, 4, 2])
    assert.deepEqual(state.languages, [['jpn', 'eng'], ['eng']])
    assert.deepEqual([...state.thresholdings].sort(), ['en0', 'en2', 'ja0', 'ja2'])
    assert.deepEqual(state.configs, [{ debug_file: '/dev/null' }, { debug_file: '/dev/null' }])
    for (const corePath of state.corePaths) assert.match(corePath, /^https:\/\/cdn\.jsdelivr\.net\/npm\/tesseract\.js-core@7\.0\.0\/tesseract-core(-simd)?\.wasm\.js$/)
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
    assert.equal(afterLeaving.created, 2)
    assert.ok(afterLeaving.terminated >= 2, '画面を離れても2つのエンジンを止めていない')
    assert.equal(afterLeaving.recognized, 0)
    assert.ok(afterLeaving.revoked.includes(previewUrl), '画面を離れても写真のプレビューの URL を消していない')
    // 待たせていた読み取りを終わらせても、離れた画面の結果は出さず、エラーも出ない。
    await page.evaluate(() => window.__cameraOcrRelease())
    await page.waitForTimeout(500)
    // 待っていた2つのエンジンの1回目の読み取りだけが終わり、2回目（白黒の決め方の2通り目）へは進まない。
    assert.equal(await page.evaluate(() => window.__cameraOcr.recognized), 2)
    assert.equal(await page.locator('#ocr-candidates-title').count(), 0)
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
})
