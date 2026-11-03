// 写真の読み取りを1から組み直した部品（src/lib/ocrPipeline.js）のテスト。依頼 requests/2026-11-02-photo-ocr-dense-page-crash.json。
// 利用者：「まだ落ちる」「OCRの機能を1から見直したらどうだ？」「google翻訳とても軽快に文字を読み取るが、このアプリは重すぎるのではないか？」
// 「iphoneでもAndroidでも使えるようにしなければならない。」
//
// 既製の SDK と OpenCV を外し、前後処理を自分で書いた。ここでは前後処理の部品を1つずつ確かめ、最後に iPhone と同じ WebKit・Android と
// 同じ Chromium で文字の多いページを読んで、使用量の山を測る（WebKit は footprint の phys_footprint。パソコンはメモリに余裕があり回収を
// 急がないので、端末のメモリ不足の知らせを送り続ける）。読める量は tests/vocab-ocr-photos.test.mjs・tests/photo-ocr-dense-page.test.mjs。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import net from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium, webkit } from 'playwright'

import {
  boxesFromProbMap, decodeTop, detSize, detStrips, joinParts, minAreaRect, parseCharDict, readTarEntry, recWidths, REC_CHUNK, REC_HEIGHT,
  REC_MIN_WIDTH, REC_TOP_INDEX, REC_TOP_VALUE, sortLines, splitLine, withTopOutput,
} from '../src/lib/ocrPipeline.js'
import { OCR_SERVED_BYTES, OCR_SERVED_FILES } from '../src/lib/ocrModels.js'
import { ocrServedFiles } from '../scripts/ocr-models.mjs'
import { denseLinesFound, DENSE_PAGE_LINES, renderDensePage } from './ocr-dense-page.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

test('検出の大きさは32の倍数で、長い辺を1600pxまでに縮める（広げない）', () => {
  assert.deepEqual(detSize(1508, 2008), { width: 1216, height: 1600 })
  assert.deepEqual(detSize(640, 480), { width: 640, height: 480 })
  assert.deepEqual(detSize(3000, 100, 1280), { width: 1280, height: 32 })
})

test('帯は写真の端から端まで覆い、受け持ちはすき間も重なりもなく並ぶ', () => {
  for (const [height, strip, overlap] of [[1600, 512, 256], [2000, 384, 128], [500, 512, 256], [1601, 512, 256]]) {
    const strips = detStrips(height, strip, overlap)
    assert.equal(strips[0].top, 0)
    assert.equal(strips.at(-1).top + strips.at(-1).height, height)
    assert.equal(strips[0].coreTop, 0)
    assert.equal(strips.at(-1).coreBottom, height)
    for (let i = 1; i < strips.length; i += 1) {
      assert.equal(strips[i].coreTop, strips[i - 1].coreBottom, `${height} の ${i} 本目`)
      // 受け持ちの境目から帯の端までに、重なりの半分以上の余白がある（境目の行が切れずに入る）。
      assert.ok(strips[i].coreTop - strips[i].top >= overlap / 2 - 1)
      assert.ok(strips[i - 1].top + strips[i - 1].height - strips[i - 1].coreBottom >= overlap / 2 - 1)
    }
  }
})

test('点を囲む最小の長方形：傾いた行は向きと幅・高さを返し、幅は横に近い辺', () => {
  const rect = minAreaRect([[0, 0], [100, 0], [100, 20], [0, 20]])
  assert.equal(Math.round(rect.w), 100)
  assert.equal(Math.round(rect.h), 20)
  assert.equal(Math.round(rect.angle * 100), 0)
  const angle = Math.PI / 12
  const tilt = ([x, y]) => [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)]
  const tilted = minAreaRect([[0, 0], [200, 0], [200, 30], [0, 30]].map(tilt))
  assert.equal(Math.round(tilted.w), 200)
  assert.equal(Math.round(tilted.h), 30)
  assert.equal(Math.round(tilted.angle * 1000), Math.round(angle * 1000))
  // 縦書きの列（縦長）は、幅が横の辺で高さが縦の辺のまま（向きは -45〜45 度）。
  const column = minAreaRect([[0, 0], [30, 0], [30, 300], [0, 300]])
  assert.equal(Math.round(column.w), 30)
  assert.equal(Math.round(column.h), 300)
})

test('字らしさの地図から行の箱を取り出し、広げ、弱い箱としきい値の外の箱は捨てる', () => {
  const width = 200
  const height = 100
  const prob = new Float32Array(width * height)
  const fill = (x0, y0, x1, y1, value) => {
    for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) prob[y * width + x] = value
  }
  fill(20, 10, 180, 22, 0.9)
  fill(20, 50, 100, 60, 0.3)
  fill(150, 70, 152, 72, 0.9)
  const boxes = boxesFromProbMap(prob, width, height, { thresh: 0.2, boxThresh: 0.4, unclipRatio: 1.4 })
  assert.equal(boxes.length, 1, '0.3 の行は箱のしきい値で、2px の点は小ささで捨てる')
  const [{ rect, score }] = boxes
  // 確からしさは箱の中の画素の平均（箱のふちの画素も入るので、塗った 0.9 より少し低い）。
  assert.ok(score > 0.8 && score < 0.9, `${score}`)
  assert.ok(rect.w > 160 && rect.h > 12, `${rect.w}×${rect.h}`)
  assert.equal(Math.round(rect.cy), 16)
  assert.equal(boxesFromProbMap(prob, width, height, { keep: () => false }).length, 0)
})

test('行の並びは上から下、同じ高さなら左から右', () => {
  const line = (text, x, y) => ({ text, poly: [[x, y], [x + 50, y], [x + 50, y + 10], [x, y + 10]] })
  assert.deepEqual(sortLines([line('c', 0, 100), line('b', 300, 5), line('a', 10, 0)]).map((item) => item.text), ['a', 'b', 'c'])
})

test('認識の入力の幅：最低320、高さ48に合わせた幅、上限3200', () => {
  assert.deepEqual(recWidths(100, 48), { width: REC_MIN_WIDTH, drawn: 100 })
  assert.deepEqual(recWidths(960, 48), { width: 960, drawn: 960 })
  assert.equal(recWidths(10000, 48).width, 3200)
})

test('長い行は字のない列で REC_CHUNK 以下に分け、英語の語のあいだには空白を入れて、日本語には入れずにつなぐ', () => {
  // 白地に、幅 40px の黒い字が 60px ごとに並ぶ行（字のあいだに 20px の白）。
  const drawn = 2500
  const rgba = new Uint8ClampedArray(drawn * REC_HEIGHT * 4).fill(255)
  for (let x = 0; x < drawn; x += 1) {
    if (x % 60 >= 40) continue
    for (let y = 8; y < 40; y += 1) rgba.fill(0, (y * drawn + x) * 4, (y * drawn + x) * 4 + 3)
  }
  const parts = splitLine(rgba, drawn, drawn)
  assert.ok(parts.length >= 3)
  assert.equal(parts.reduce((sum, part) => sum + part.count, 0), drawn)
  for (const [index, part] of parts.entries()) {
    assert.ok(part.count <= REC_CHUNK, `${part.count}`)
    if (index === 0) continue
    // 字のない所（字のあいだの白）で切る。
    const at = part.from % 60
    assert.ok(at >= 40, `切った所 ${part.from}`)
    // 高さ 48px の行で 20px の白は、語のあいだの空白（高さの 2 割以上）。
    assert.equal(part.gap, true)
  }
  assert.deepEqual(splitLine(rgba, drawn, 500), [{ from: 0, count: 500, gap: false }])
  assert.equal(joinParts([{ text: 'decided to' }, { text: 'visit Kyoto', gap: true }]), 'decided to visit Kyoto')
  assert.equal(joinParts([{ text: '大きな地震の' }, { text: '発生や', gap: true }]), '大きな地震の発生や')
  assert.equal(joinParts([{ text: 'informa' }, { text: 'tion', gap: false }]), 'information')
})

test('認識の出力（字の位置ごとの最も確かな字）を文字にする：同じ字の続きと空白（0）をまとめる', () => {
  const chars = ['a', 'b', 'c']
  const result = decodeTop(Float32Array.from([0.9, 0.8, 0.99, 0.7, 0.6, 0.5]), BigInt64Array.from([1n, 1n, 0n, 1n, 2n, 3n]), chars)
  assert.equal(result.text, 'aabc')
  assert.ok(Math.abs(result.score - (0.9 + 0.7 + 0.6 + 0.5) / 4) < 1e-6)
  assert.deepEqual(decodeTop(new Float32Array(0), new BigInt64Array(0), chars), { text: '', score: 0 })
})

test('公開版で配るファイルは tar から作り、大きさは表のとおり。認識モデルは最後に TopK を足してあり、足すのは1度だけ', async () => {
  const served = await ocrServedFiles()
  assert.deepEqual(served.map((item) => item.file), Object.values(OCR_SERVED_FILES))
  assert.deepEqual(Object.fromEntries(served.map((item, index) => [Object.keys(OCR_SERVED_FILES)[index], item.bytes.length])), OCR_SERVED_BYTES)
  const rec = served.find((item) => item.file === OCR_SERVED_FILES.rec).bytes
  const text = new TextDecoder('latin1').decode(rec.subarray(rec.length - 4000))
  assert.ok(text.includes(REC_TOP_VALUE) && text.includes(REC_TOP_INDEX) && text.includes('TopK'))
  assert.equal(withTopOutput(rec), rec, '足してあるモデルには足さない')
  const chars = JSON.parse(served.find((item) => item.file === OCR_SERVED_FILES.chars).bytes.toString())
  assert.equal(chars.at(-1), ' ')
  assert.ok(chars.includes('あ') && chars.includes('A') && chars.includes('漢'))
})

test('モデルの設定から字の一覧を読み、tar から中身を取り出す', () => {
  assert.deepEqual(parseCharDict("PostProcess:\n  character_dict:\n  - '!'\n  - a\n  - ''''\n  - '\"'\nother: 1\n"), ['!', 'a', "'", '"', ' '])
  const header = (name, size) => {
    const block = new Uint8Array(512)
    block.set(new TextEncoder().encode(name))
    block.set(new TextEncoder().encode(size.toString(8).padStart(11, '0')), 124)
    return block
  }
  const body = new TextEncoder().encode('hello')
  const tar = new Uint8Array(512 * 4)
  tar.set(header('x/inference.yml', 5), 0)
  tar.set(body, 512)
  tar.set(header('x/inference.onnx', 3), 1024)
  tar.set(new Uint8Array([1, 2, 3]), 1536)
  assert.deepEqual([...readTarEntry(tar, '/inference.onnx')], [1, 2, 3])
  assert.equal(new TextDecoder().decode(readTarEntry(tar, '/inference.yml')), 'hello')
  assert.throws(() => readTarEntry(tar, '/missing'))
})

// ここから、本物のブラウザとモデルで読み、使用量の山を測る。
const freePort = () => new Promise((resolve, reject) => {
  const probe = net.createServer()
  probe.on('error', reject)
  probe.listen(0, '127.0.0.1', () => {
    const { port } = probe.address()
    probe.close(() => resolve(port))
  })
})

// 画面と同じ部品（下ごしらえ → 別スレッドで ocrPipeline.js）で1枚読むページ。
const CHECK_PAGE = `
import { prepareImageForOcr } from '/src/lib/ocrImage.js'
import { readPhotoInWorker } from '/src/lib/ocrWorkerClient.js'
window.readPhoto = async (url) => {
  const image = await prepareImageForOcr(await (await fetch(url)).blob())
  const page = await readPhotoInWorker(image).promise
  return page.text
}
window.checkReady = true
`

let vite
let base
let workDir
let pagePath

before(async () => {
  workDir = mkdtempSync(join(tmpdir(), 'study-app-ocr-pipeline-'))
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    cacheDir: 'node_modules/.vite-ocr-pipeline-test',
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'], include: ['onnxruntime-web/wasm'] },
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null, fs: { allow: [ROOT, workDir] } },
    plugins: [{
      name: 'ocr-pipeline-check-page',
      resolveId: (id) => (id === '/__ocr-pipeline-check.js' ? '\0ocr-pipeline-check.js' : null),
      load: (id) => (id === '\0ocr-pipeline-check.js' ? CHECK_PAGE : null),
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url !== '/__ocr-pipeline-check.html') return next()
          const html = await server.transformIndexHtml('/__ocr-pipeline-check.html', '<!doctype html><meta charset="utf-8"><script type="module" src="/__ocr-pipeline-check.js"></script>')
          res.setHeader('content-type', 'text/html')
          res.end(html)
        })
      },
    }],
  })
  await vite.listen()
  base = `http://127.0.0.1:${port}/`
  const painter = await chromium.launch()
  pagePath = join(workDir, 'dense.png')
  writeFileSync(pagePath, await renderDensePage(painter))
  await painter.close()
}, { timeout: 300_000 })

after(async () => {
  await vite?.close()
  if (workDir) rmSync(workDir, { recursive: true, force: true })
})

const run = (command, args) => {
  try {
    return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  } catch {
    return ''
  }
}
const processes = () => run('ps', ['-axo', 'pid=,rss=,command='])
  .split('\n').map((line) => line.trim().match(/^(\d+)\s+(\d+)\s+(.*)$/)).filter(Boolean)
  .map(([, pid, rss, command]) => ({ pid: Number(pid), rssMB: Number(rss) / 1024, command }))

// WebKit：ページを動かすプロセス（WebContent）の本当の使用量。macOS の footprint で測る。
function webkitFootprintMB(before) {
  const content = processes().filter((item) => /ms-playwright\/webkit.*WebContent/.test(item.command) && !before.has(item.pid))
  let peak = 0
  for (const { pid } of content) {
    const match = run('footprint', [String(pid)]).match(/phys_footprint:\s+([\d.]+)\s*(KB|MB|GB)/)
    if (match) peak = Math.max(peak, Number(match[1]) * { KB: 1 / 1024, MB: 1, GB: 1024 }[match[2]])
  }
  return peak
}
// Chromium：ページを動かすプロセス（renderer）の使用量（RSS）。
function chromiumRendererMB(before) {
  return Math.max(0, ...processes().filter((item) => /ms-playwright\/chromium.*--type=renderer/.test(item.command) && !before.has(item.pid)).map((item) => item.rssMB))
}

async function measure(engine, sample) {
  const before = new Set(processes().map((item) => item.pid))
  const browser = await engine.launch()
  const context = await browser.newContext()
  await context.route((url) => !url.href.startsWith(base) && !url.href.startsWith('blob:') && !url.href.startsWith('data:'), (route) => route.abort())
  const page = await context.newPage()
  await page.goto(`${base}__ocr-pipeline-check.html`)
  await page.waitForFunction(() => window.checkReady, null, { timeout: 120_000 })
  let peak = 0
  let reading = true
  const watcher = (async () => {
    while (reading) {
      if (engine === webkit) run('notifyutil', ['-p', 'org.WebKit.lowMemory'])
      peak = Math.max(peak, sample(before))
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  })()
  const text = await page.evaluate((url) => window.readPhoto(url), `/@fs${pagePath}`)
  reading = false
  await watcher
  await browser.close()
  return { text, peak: Math.round(peak) }
}

const hasFootprint = Boolean(run('which', ['footprint']).trim())
// 組み直す前（SDK と OpenCV）は、同じ大きさの教科書のページで WebKit の山が 1,514MB（公開版・メモリ不足の知らせあり）。
// 組み直した後、このページ（試料の40行）で 約380〜420MB。機械で差が出るので、上限は 480MB にする。
const WEBKIT_PEAK_LIMIT_MB = 480
test('iPhone と同じ WebKit で文字の多いページ（40行）を全行読み、使用量の山は 480MB 未満', { skip: !hasFootprint && 'footprint がない' }, async (t) => {
  const { text, peak } = await measure(webkit, webkitFootprintMB)
  t.diagnostic(`WebKit の山 ${peak}MB`)
  assert.deepEqual(DENSE_PAGE_LINES.filter((line) => !denseLinesFound(text).includes(line)), [])
  assert.ok(peak > 50, `測れていない ${peak}MB`)
  assert.ok(peak < WEBKIT_PEAK_LIMIT_MB, `WebKit の山 ${peak}MB`)
}, { timeout: 300_000 })

// Chromium（Android の Chrome と同じエンジン）は RSS で測る（GPU なしの wasm の版で読むので、端末の GPU の差は出ない）。
const CHROMIUM_PEAK_LIMIT_MB = 600
test('Android と同じ Chromium で文字の多いページ（40行）を全行読み、ページのプロセスの山は 600MB 未満', async (t) => {
  const { text, peak } = await measure(chromium, chromiumRendererMB)
  t.diagnostic(`Chromium の山 ${peak}MB`)
  assert.deepEqual(DENSE_PAGE_LINES.filter((line) => !denseLinesFound(text).includes(line)), [])
  assert.ok(peak > 50, `測れていない ${peak}MB`)
  assert.ok(peak < CHROMIUM_PEAK_LIMIT_MB, `Chromium の山 ${peak}MB`)
}, { timeout: 300_000 })
