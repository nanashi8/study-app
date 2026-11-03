// 写真の文字の読み取りで、画面の側（ocr.html のページ・別スレッド）が使う部品：モデルの置き場所と読み込み、読み方、結果の形、
// 前回落ちた端末の印。読み取りそのものは ocrPipeline.js（2026-11-03 に組み直した）。
//
// モデルは PaddleOCR の検出 PP-OCRv6_tiny（1.8MB）と認識 PP-OCRv6_small（21MB。日本語・英語・中国語を1つで読む）。2026-10-14 に
// Tesseract から置きかえた（実写真28枚で英単語 394→547/582 語、日本語 1,029→1,618/1,794 字）。認識の tiny はひらがなを漢字に読み違え、
// PP-OCRv5_mobile の認識は英単語が少し落ちた。ONNX Runtime は GPU なしの wasm の版で動かす（vite.config.js の resolve.alias）。
// GPU 対応版は本体だけでメモリを大きく食い、2026-11-02 に iPhone で落ちた。
import { DET_MAX_SIDE, DET_PIXELS } from './ocrPipeline.js'
import { OCR_MODEL_SHA256, OCR_SERVED_BYTES, OCR_SERVED_FILES } from './ocrModels.js'

// モデルは同じサイトの ocr-models/ に置く（vite.config.js がビルドに入れる）。
export function ocrModelUrl(file, base = import.meta.env?.BASE_URL ?? './') {
  return new URL(`${base}ocr-models/${file}`, globalThis.location?.href ?? 'http://localhost/').href
}

// 読み方。普通は検出を長い辺 1600px・1回 約61万画素まで。前の読み取りが途中で止まった端末や、読み取りが失敗したときは、
// 検出をさらに小さくする（1280px・1回 約33万画素）。
export const OCR_READ_OPTIONS = Object.freeze({ detMaxSide: DET_MAX_SIDE, detPixels: DET_PIXELS })
export const OCR_LOW_MEMORY_READ_OPTIONS = Object.freeze({ detMaxSide: 1280, detPixels: 1280 * 256 })

// 読み取りの結果（items: [{ text, score, poly }]）を、行と語（{ text, confidence }）にする。
// PaddleOCR は行ごとの確からしさ（score 0〜1）だけを返すので、行の語はみな同じ確からしさ（0〜100）にする。
export function ocrPageFromItems(items) {
  const lines = (items ?? [])
    .map((item) => ({ text: String(item.text ?? '').trim(), confidence: Math.round(Number(item.score ?? 0) * 100), poly: item.poly }))
    .filter((line) => line.text)
  return {
    text: lines.map((line) => line.text).join('\n'),
    words: lines.flatMap((line) => line.text.split(/\s+/).filter(Boolean).map((text) => ({ text, confidence: line.confidence }))),
    lines,
  }
}

// 1枚読むごとにエンジンを作り直すので、モデルは端末の Cache Storage に置き、2回目からはそこから読む（2026-11-02、
// 公開版で1枚ごとに約30秒かけてモデルを読み直していた）。置き場所の名前にモデルの指紋を入れる。
// 置くのは読み取りのページの側（loadOcrModels）。WebKit では別スレッドの中で置いた分が次の回に残らなかった。
const MODEL_CACHE = `ocr-models-${OCR_MODEL_SHA256.det.slice(0, 8)}-${OCR_MODEL_SHA256.rec.slice(0, 8)}-top1`

// 受け取りながら onBytes に受け取った量を知らせ、1つのバイト列にする。大きさが分かれば、先に1つ用意してそこへ書く（写しを作らない）。
async function readBytes(response, onBytes) {
  if (!onBytes || !response.body) return response.arrayBuffer()
  const length = Number(response.headers.get('content-length')) || 0
  const reader = response.body.getReader()
  let bytes = new Uint8Array(length)
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    if (received + value.length > bytes.length) {
      const grown = new Uint8Array(Math.max(bytes.length * 2, received + value.length))
      grown.set(bytes.subarray(0, received))
      bytes = grown
    }
    bytes.set(value, received)
    received += value.length
    onBytes(received)
  }
  return received === bytes.length ? bytes.buffer : bytes.slice(0, received).buffer
}

// 取りに行ったモデルは、受け取りながら端末の Cache Storage へ流し込み、置いたものを1度だけ読み出す。受け取った分を
// JavaScript に集めてから置くと、23MB の写しが何枚もでき、WebKit で読み取りのページが約560MB になった（2026-11-03）。
// 置けない端末では、受け取った分をそのまま使う。
async function fetchModel(url, cache, onBytes) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`model ${response.status}`)
  if (cache && response.body && typeof TransformStream === 'function') {
    let received = 0
    const counted = response.body.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        received += chunk.length
        onBytes?.(received)
        controller.enqueue(chunk)
      },
    }))
    try {
      await cache.put(url, new Response(counted, { headers: { 'content-type': response.headers.get('content-type') ?? 'application/octet-stream' } }))
      const stored = await cache.match(url, { ignoreVary: true })
      if (stored) return stored.arrayBuffer()
    } catch {
      // 置けなかった（容量・プライベートな表示など）。下で取り直す。
    }
    return readBytes(await fetch(url), onBytes)
  }
  return readBytes(response, onBytes)
}

/**
 * 読み取りに要るファイル3つ（検出・認識のモデルと字の一覧）を { det, rec, chars }（バイト列）で返す。
 * 端末に置いたものがあればそれを使い、なければ取りに行って置く。onDownload に読み込んだ量（0〜1）を知らせる。
 */
export async function loadOcrModels({ base, onDownload } = {}) {
  const cache = await globalThis.caches?.open(MODEL_CACHE).catch(() => null)
  const total = Object.values(OCR_SERVED_BYTES).reduce((sum, value) => sum + value, 0)
  const loaded = {}
  const entries = await Promise.all(Object.entries(OCR_SERVED_FILES).map(async ([kind, file]) => {
    const url = ocrModelUrl(file, base)
    const hit = await cache?.match(url, { ignoreVary: true }).catch(() => null)
    if (hit) return [kind, await hit.arrayBuffer()]
    return [kind, await fetchModel(url, cache, onDownload && ((received) => {
      loaded[kind] = received
      onDownload(Math.min(1, Object.values(loaded).reduce((sum, value) => sum + value, 0) / total))
    }))]
  }))
  return Object.fromEntries(entries)
}

// 読み取りの途中でアプリごと落ちると（スマホのメモリ不足）、JavaScript では受け止められない。読む前に印を置き、読み終えたら消す。
// 次に読むときに印が残っていれば前回は落ちたので、その端末はしばらく軽い読み方にする。印が読み書きできない端末では普通に読む。
const OCR_READING_KEY = 'eigo-quest-ocr-reading'
const OCR_LOW_MEMORY_UNTIL_KEY = 'eigo-quest-ocr-low-memory-until'
export const OCR_LOW_MEMORY_DAYS = 30

function storageOf(env) {
  try {
    return env.localStorage ?? null
  } catch {
    return null
  }
}

/** この端末を軽い読み方にする。 */
export function rememberOcrLowMemory({ env = globalThis, now = Date.now() } = {}) {
  try {
    storageOf(env)?.setItem(OCR_LOW_MEMORY_UNTIL_KEY, String(now + OCR_LOW_MEMORY_DAYS * 86_400_000))
  } catch {
    // 覚えられなくても読み取りは続ける。
  }
}

/** 読む前に呼ぶ。この読み取りを軽い読み方にするなら true。 */
export function beginOcrReading({ env = globalThis, now = Date.now() } = {}) {
  const storage = storageOf(env)
  if (!storage) return false
  try {
    if (storage.getItem(OCR_READING_KEY)) rememberOcrLowMemory({ env, now })
    storage.setItem(OCR_READING_KEY, '1')
    return Number(storage.getItem(OCR_LOW_MEMORY_UNTIL_KEY)) > now
  } catch {
    return false
  }
}

/** 読み終えたとき（読めなかったとき・画面を離れたときも）に呼ぶ。 */
export function endOcrReading({ env = globalThis } = {}) {
  try {
    storageOf(env)?.removeItem(OCR_READING_KEY)
  } catch {
    // 消せなければ、次の読み取りが軽い読み方になるだけ。
  }
}
