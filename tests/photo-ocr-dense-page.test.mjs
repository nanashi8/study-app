// 文字の詰まったページの写真を読むとアプリが落ちた不具合（依頼 requests/2026-11-02-photo-ocr-dense-page-crash.json）。
// 利用者：「写真からカードを作る機能で、添付したテキストは読み込みを開始するもののアプリが途中で落ちてできません。修正しなさい。」
// 「google翻訳等スムーズに翻訳できるのだから、もっと軽い動作にできるのではないか。」
//
// 原因：読み取りエンジンが認識を6行ずつ、一番長い行の幅にそろえて計算し、検出も写真の大きさのまま動かしていた。11-03 に読み取りを
// 組み直した（src/lib/ocrPipeline.js）。メモリの山は機械で差が出るので、山を決める計算の大きさ（検出の1回の画素・認識の1回の行数と幅・
// 受け取る出力）を本物のモデルで確かめる（WebKit の本当の使用量は tests/ocr-pipeline.test.mjs）。読み取りを動かす全画面
// （教科書から単語追加・写真から作る）で本物のエンジンにページを読ませ、5テンプレートの候補を確かめる。
// 途中で落ちた端末・失敗した読み取りの扱いは、エンジンの代わりで確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import net from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium, webkit } from 'playwright'

import { beginOcrReading, endOcrReading, OCR_LOW_MEMORY_DAYS, OCR_LOW_MEMORY_READ_OPTIONS, OCR_READ_OPTIONS, rememberOcrLowMemory } from '../src/lib/ocrEngine.js'
import { REC_CHUNK, REC_MIN_WIDTH, REC_TOP_INDEX, REC_TOP_VALUE } from '../src/lib/ocrPipeline.js'
import { CUSTOM_CARD_TEMPLATE_IDS } from '../src/lib/customCards.js'
import { photoRowsFromLines } from '../src/lib/customCardsPhoto.js'
import { ensureOcrModels } from '../scripts/ocr-models.mjs'
import { denseLinesFound, DENSE_PAGE_LINES, renderDensePage } from './ocr-dense-page.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

const freePort = () => new Promise((resolve, reject) => {
  const probe = net.createServer()
  probe.on('error', reject)
  probe.listen(0, '127.0.0.1', () => {
    const { port } = probe.address()
    probe.close(() => resolve(port))
  })
})

// 画面と同じ部品（ocrPipeline.js）とモデルで読み、ONNX Runtime へ渡す計算の大きさと受け取る出力を控えるページ。
const CHECK_PAGE = `
import * as ort from 'onnxruntime-web/wasm'
import { prepareImageForOcr } from '/src/lib/ocrImage.js'
import { loadOcrModels, OCR_LOW_MEMORY_READ_OPTIONS, OCR_READ_OPTIONS, ocrPageFromItems } from '/src/lib/ocrEngine.js'
import { createOcrPipeline } from '/src/lib/ocrPipeline.js'
ort.env.wasm.numThreads = 1
window.readDense = async (url, { lowMemory = false } = {}) => {
  const runs = []
  const create = ort.InferenceSession.create
  ort.InferenceSession.create = async (...args) => {
    const session = await create.apply(ort.InferenceSession, args)
    const run = session.run.bind(session)
    session.run = (feeds, ...rest) => {
      runs.push({ dims: [...Object.values(feeds)[0].dims], fetches: Array.isArray(rest[0]) ? rest[0] : null })
      return run(feeds, ...rest)
    }
    return session
  }
  const models = await loadOcrModels({ base: '/' })
  const pipeline = await createOcrPipeline({
    ort,
    detModel: new Uint8Array(models.det),
    recModel: new Uint8Array(models.rec),
    chars: JSON.parse(new TextDecoder().decode(models.chars)),
    createCanvas: (width, height) => new OffscreenCanvas(width, height),
    ...(lowMemory ? OCR_LOW_MEMORY_READ_OPTIONS : OCR_READ_OPTIONS),
  })
  ort.InferenceSession.create = create
  const image = await createImageBitmap(await prepareImageForOcr(await (await fetch(url)).blob()))
  const result = await pipeline.read(image)
  await pipeline.dispose()
  return { text: ocrPageFromItems(result.items).text, runs }
}
window.checkReady = true
`

let vite
let browser
let safari
let base
let workDir
let pagePath

before(async () => {
  await ensureOcrModels()
  workDir = mkdtempSync(join(tmpdir(), 'study-app-dense-page-'))
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    cacheDir: 'node_modules/.vite-dense-page-test',
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'], include: ['onnxruntime-web/wasm'] },
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null, fs: { allow: [ROOT, workDir] } },
    plugins: [{
      name: 'dense-check-page',
      resolveId: (id) => (id === '/__dense-check.js' ? '\0dense-check.js' : null),
      load: (id) => (id === '\0dense-check.js' ? CHECK_PAGE : null),
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url !== '/__dense-check.html') return next()
          const html = await server.transformIndexHtml('/__dense-check.html', '<!doctype html><meta charset="utf-8"><script type="module" src="/__dense-check.js"></script>')
          res.setHeader('content-type', 'text/html')
          res.end(html)
        })
      },
    }],
  })
  await vite.listen()
  base = `http://127.0.0.1:${port}/`
  browser = await chromium.launch()
  safari = await webkit.launch()
  pagePath = join(workDir, 'dense.png')
  writeFileSync(pagePath, await renderDensePage(browser))
}, { timeout: 300_000 })

after(async () => {
  await browser?.close()
  await safari?.close()
  await vite?.close()
  if (workDir) rmSync(workDir, { recursive: true, force: true })
})

async function openContext(engine) {
  const context = await engine.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true })
  await context.route((url) => !url.href.startsWith(base) && !url.href.startsWith('blob:') && !url.href.startsWith('data:'), (route) => route.abort())
  return context
}

async function readDense(options) {
  const context = await openContext(browser)
  const page = await context.newPage()
  await page.goto(`${base}__dense-check.html`)
  await page.waitForFunction(() => window.checkReady, null, { timeout: 120_000 })
  const result = await page.evaluate(([url, value]) => window.readDense(url, value), [`/@fs${pagePath}`, options])
  await context.close()
  return result
}

// 検出は1回 detPixels まで・長い辺 detMaxSide まで、認識は1行ずつ・幅 REC_CHUNK まで、認識の出力は最も確かな1字だけを受け取る。
function assertLight(result, { detMaxSide, detPixels }) {
  const det = result.runs.filter((run) => !run.fetches)
  const rec = result.runs.filter((run) => run.fetches)
  assert.ok(det.length >= 1)
  for (const { dims } of det) {
    assert.ok(dims[2] * dims[3] <= detPixels, `検出の1回 ${dims}`)
    assert.ok(Math.max(dims[2], dims[3]) <= detMaxSide + 32, `検出の画像 ${dims}`)
  }
  assert.ok(rec.length >= DENSE_PAGE_LINES.length, `認識 ${rec.length} 回`)
  for (const { dims, fetches } of rec) {
    // 長い行をまとめて計算すると、メモリの山が倍以上になる（6行ずつのとき GPU で 3,781MB、1行ずつで 1,755MB）。
    assert.equal(dims[0], 1, `認識の1回の行数 ${dims}`)
    assert.ok(dims[3] <= Math.max(REC_CHUNK, REC_MIN_WIDTH), `認識の1回の幅 ${dims}`)
    assert.deepEqual(fetches, [REC_TOP_VALUE, REC_TOP_INDEX])
  }
}

test('普通の読み方：40行のページを全行読み、検出は帯に分け、認識は1行ずつ・最も確かな1字だけを受け取る', async (t) => {
  const result = await readDense({})
  t.diagnostic(`検出 ${result.runs.filter((run) => !run.fetches).length} 回・認識 ${result.runs.filter((run) => run.fetches).length} 回`)
  assert.deepEqual(DENSE_PAGE_LINES.filter((line) => !denseLinesFound(result.text).includes(line)), [])
  assertLight(result, OCR_READ_OPTIONS)
})

test('軽い読み方：40行のページを全行読み、検出は長い辺1280px・1回 約33万画素まで', async () => {
  const result = await readDense({ lowMemory: true })
  assert.deepEqual(DENSE_PAGE_LINES.filter((line) => !denseLinesFound(result.text).includes(line)), [])
  assertLight(result, OCR_LOW_MEMORY_READ_OPTIONS)
  assert.ok(OCR_LOW_MEMORY_READ_OPTIONS.detPixels < OCR_READ_OPTIONS.detPixels)
})

// メニューから画面を開く。
async function openScreen(context, destination) {
  const page = await context.newPage()
  await page.goto(base)
  await page.locator('[data-global-menu-button]').click({ timeout: 120_000 })
  await page.locator(`[data-menu-destination="${destination}"]`).click()
  return page
}

for (const [name, engine] of [['Chromium', () => browser], ['WebKit', () => safari]]) {
  test(`${name}：写真から作るで40行のページを読み、5テンプレートすべてで候補を出し、英単語のカードを登録できる`, async () => {
    const context = await openContext(engine())
    const page = await openScreen(context, 'customWords')
    await page.locator('[data-custom-photo-open]').click()
    await page.locator('[data-custom-photo] input[type=file]:not([capture])').setInputFiles(pagePath)
    await page.getByRole('button', { name: '文字を読み取る' }).click()
    await page.locator('[data-custom-photo-summary]').waitFor({ timeout: 300_000 })
    const text = await page.locator('#custom-photo-text').inputValue()
    assert.equal(denseLinesFound(text).length, DENSE_PAGE_LINES.length, text)
    assert.equal(text.split('\n').length, DENSE_PAGE_LINES.length, '1行が1行のまま')
    for (const template of CUSTOM_CARD_TEMPLATE_IDS) {
      await page.locator(`[data-custom-photo] [data-custom-card-template="${template}"]`).click()
      assert.ok(await page.locator('[data-custom-photo-candidate]').count() > 0, template)
    }
    await page.locator('[data-custom-photo] [data-custom-card-template="english"]').click()
    const first = page.locator('[data-custom-photo-candidate]', { has: page.locator('[data-custom-photo-back]:not([value=""])') }).first()
    await first.locator('[data-custom-photo-check]').check()
    await page.locator('[data-custom-photo-save]').click()
    await page.locator('[data-custom-photo-notice]').waitFor()
    assert.match(await page.locator('[data-custom-photo-notice]').innerText(), /^1枚を/)
    await context.close()
  }, { timeout: 600_000 })

  test(`${name}：教科書から単語追加でも40行のページを全行読む`, async () => {
    const context = await openContext(engine())
    const page = await openScreen(context, 'vocabCamera')
    await page.getByText('撮影した写真から英単語を読み取る').waitFor()
    await page.locator('input[type=file]:not([capture])').setInputFiles(pagePath)
    await page.getByRole('button', { name: '英単語を読み取る' }).click()
    await page.locator('#ocr-text').waitFor({ timeout: 300_000 })
    const text = await page.locator('#ocr-text').inputValue()
    assert.equal(denseLinesFound(text).length, DENSE_PAGE_LINES.length, text)
    await context.close()
  }, { timeout: 600_000 })
}

function fakeStorage() {
  const data = new Map()
  return {
    data,
    localStorage: {
      getItem: (key) => (data.has(key) ? data.get(key) : null),
      setItem: (key, value) => data.set(key, String(value)),
      removeItem: (key) => data.delete(key),
    },
  }
}

test('読み終えた端末は普通の読み方のまま。読み取りの途中で落ちた（印が残った）端末は、30日のあいだ軽い読み方にする', () => {
  const env = fakeStorage()
  const now = 1_800_000_000_000
  assert.equal(beginOcrReading({ env, now }), false)
  endOcrReading({ env })
  assert.equal(beginOcrReading({ env, now }), false, '読み終えたら印は消える')
  // endOcrReading を呼ばないまま（アプリごと落ちた）、次に読む。
  assert.equal(beginOcrReading({ env, now: now + 1000 }), true)
  endOcrReading({ env })
  const day = 86_400_000
  assert.equal(beginOcrReading({ env, now: now + 1000 + (OCR_LOW_MEMORY_DAYS - 1) * day }), true)
  endOcrReading({ env })
  assert.equal(beginOcrReading({ env, now: now + 1000 + (OCR_LOW_MEMORY_DAYS + 1) * day }), false, '30日を過ぎたら戻す')
})

test('読み取りが失敗して軽い読み方を覚えた端末は、次から軽い読み方。端末に書けなくても例外にしない', () => {
  const env = fakeStorage()
  rememberOcrLowMemory({ env, now: 1000 })
  assert.equal(beginOcrReading({ env, now: 2000 }), true)
  const blocked = { get localStorage() { throw new Error('blocked') } }
  assert.equal(beginOcrReading({ env: blocked }), false)
  endOcrReading({ env: blocked })
  rememberOcrLowMemory({ env: blocked })
  const full = { localStorage: { getItem: () => null, setItem() { throw new Error('quota') }, removeItem() {} } }
  assert.equal(beginOcrReading({ env: full }), false)
})

test('傾いたページで同じ高さに見える上下の行は、左右に大きく重なるので1行にまとめない。表の左右の箱はまとめる', () => {
  const box = (text, x0, y0, x1, y1) => ({ text, confidence: 99, poly: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] })
  const rows = photoRowsFromLines([
    box('people, or about 800 million', 100, 380, 1360, 410),
    box('and the situation has been', 100, 388, 1360, 418),
    box('library', 100, 500, 300, 530),
    box('図書館', 600, 502, 800, 532),
  ])
  assert.deepEqual(rows.map((row) => row.segments), [['people, or about 800 million'], ['and the situation has been'], ['library', '図書館']])
})
