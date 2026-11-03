// 「教科書から単語追加」で、写真1枚を読み取りエンジン（PaddleOCR の PP-OCRv6、ONNX Runtime Web で動かす）で読む手順。
// 画面（VocabCamera.jsx）とテストが同じ手順で読む。
//
// 2026-10-14 に Tesseract から置きかえた。ウェブで集めた実写真28枚（tests/fixtures/vocab-ocr/photos.json）の正解と照らして、
// 写真の英単語 394→547/582 語、横書きの日本語 1,029→1,618/1,794 字。Tesseract は文書向けで、色地に白い字の標識・傾いた写真・
// 曲がった紙面・縦書き・遠くの字では「どこに字があるか」を見つけられなかった。PaddleOCR は字のある所を先に探す（検出）ので、
// これらも読める。
// モデルは、検出が PP-OCRv6_tiny（1.8MB）、認識が PP-OCRv6_small（21MB。日本語・英語・中国語を1つで読む）。認識の tiny は
// ひらがなを漢字に読み違え（「は」→「注」）、PP-OCRv5_mobile の認識は英単語が少し落ちた。検出は tiny でも small とほぼ同じだった。
// wasm で動かす（パソコンで1枚平均 約 2.6 秒）。WebGPU は使わない：GPU 対応版の ONNX Runtime は本体だけでメモリを大きく食い、
// 2026-11-02 に iPhone で落ちた（WebKit のメモリの山 1,415MB → GPU なしの版 759MB、読める量と時間は同じ）。vite.config.js の resolve.alias も参照。
import { OCR_MODEL_BYTES, OCR_MODEL_FILES, OCR_MODEL_NAMES, OCR_MODEL_SHA256 } from './ocrModels.js'

// ONNX Runtime Web の本体（wasm）は、ビルドが同じサイトの assets/ に入れたものを読む（外のサイトに頼らない）。

// モデルは同じサイトの ocr-models/ に置く（vite.config.js がビルドに入れる）。
export function ocrModelUrl(file, base = import.meta.env?.BASE_URL ?? './') {
  return new URL(`${base}ocr-models/${file}`, globalThis.location?.href ?? 'http://localhost/').href
}

// 読み取りの負荷。2026-11-02、615語の教科書のページ（長い行が約40行）をスマホで読むとアプリが落ちた。
// - 認識は1行ずつ（textRecognitionBatchSize: 1）。モデルの既定は6行ずつで、6行を一番長い行の幅にそろえて計算するので、
//   長い行が並ぶページほどメモリを食う。
// - 検出は長い辺 1600px まで（モデルの既定は写真の大きさのまま）。ピクセル数が減るぶん軽くなる。
// - 箱のしきい値は 0.4（既定 0.6）。既定では文字の詰まったページの行が丸ごと抜けた（42か所中36か所 → 42か所）。
export const OCR_READ_PARAMS = Object.freeze({ textDetLimitSideLen: 1600, textDetLimitType: 'max', textDetBoxThresh: 0.4 })
// 前の読み取りが途中で止まった端末や、読み取りが失敗したときの読み方。検出の解像度を下げる。
export const OCR_LOW_MEMORY_READ_PARAMS = Object.freeze({ ...OCR_READ_PARAMS, textDetLimitSideLen: 1280 })

export function ocrCreateOptions({ base } = {}) {
  return {
    textDetectionModelName: OCR_MODEL_NAMES.det,
    textDetectionModelAsset: { url: ocrModelUrl(OCR_MODEL_FILES.det, base) },
    textRecognitionModelName: OCR_MODEL_NAMES.rec,
    textRecognitionModelAsset: { url: ocrModelUrl(OCR_MODEL_FILES.rec, base) },
    textRecognitionBatchSize: 1,
    // 読み取り全体を専用の別スレッド（ocrWorker.js）で動かすので、計算をさらに別スレッドへ移さない。
    ortOptions: { backend: 'wasm', proxy: false },
  }
}

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

let ortQuiet = null
// ONNX Runtime の知らせを、エラーのときだけにする。セッションごとの知らせの度合いは作るときの設定（logSeverityLevel、指定がなければ警告）で決まり、
// SDK はそれを渡さないので、セッションを作る関数を包んで渡す（3 ＝ エラー）。
async function quietOrt() {
  ortQuiet ??= import('onnxruntime-web/wasm').then((ort) => {
    ort.env.logLevel = 'error'
    const create = ort.InferenceSession.create
    if (!create.quiet) {
      const quiet = (model, options) => create.call(ort.InferenceSession, model, { logSeverityLevel: 3, ...(options ?? {}) })
      quiet.quiet = true
      ort.InferenceSession.create = quiet
    }
    return ort
  })
  return ortQuiet
}

// 1枚読むごとにエンジンを作り直すので、モデルは端末の Cache Storage に置き、2回目からはそこから読む（2026-11-02、
// 公開版で1枚ごとに約30秒かけてモデルを読み直していた）。ファイル名に指紋がないので、置き場所の名前にモデルの指紋を入れる。
// 置くのは読み取りのページの側（loadOcrModels）。WebKit では別スレッドの中で置いた分が次の回に残らなかった。
const MODEL_CACHE = `ocr-models-${OCR_MODEL_SHA256.det.slice(0, 8)}-${OCR_MODEL_SHA256.rec.slice(0, 8)}`

// 中身はいつもバイト列で受け渡す。WebKit の別スレッドでは、保存しながら読む（clone）・Blob から返すと
// 「Blob loading failed」で読めなかった。
async function readBytes(response, onBytes) {
  if (!onBytes || !response.body) return response.arrayBuffer()
  const reader = response.body.getReader()
  const chunks = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length
    onBytes(received)
  }
  const bytes = new Uint8Array(received)
  let at = 0
  for (const chunk of chunks) {
    bytes.set(chunk, at)
    at += chunk.length
  }
  return bytes.buffer
}

// 読み込んだ量（0〜1）を onDownload に知らせながら、モデル2つを読み込む。
function downloadProgress(onDownload) {
  const loaded = new Map()
  const total = OCR_MODEL_BYTES.det + OCR_MODEL_BYTES.rec
  return (url) => onDownload && ((received) => {
    loaded.set(url, received)
    onDownload(Math.min(1, [...loaded.values()].reduce((sum, value) => sum + value, 0) / total))
  })
}

/** モデル2つを { URL: バイト列 } で返す。端末に置いたものがあればそれを使い、なければ取りに行って置く。 */
export async function loadOcrModels({ base, onDownload } = {}) {
  const cache = await globalThis.caches?.open(MODEL_CACHE).catch(() => null)
  const progress = downloadProgress(onDownload)
  const urls = [OCR_MODEL_FILES.det, OCR_MODEL_FILES.rec].map((file) => ocrModelUrl(file, base))
  const entries = await Promise.all(urls.map(async (url) => {
    const hit = await cache?.match(url, { ignoreVary: true }).catch(() => null)
    if (hit) return [url, await hit.arrayBuffer()]
    const response = await fetch(url)
    if (!response.ok) throw new Error(`model ${response.status}`)
    const bytes = await readBytes(response, progress(url))
    // 置けなくても（容量・プライベートな表示など）、今回は読める。次も取りに行くだけ。
    await cache?.put(url, new Response(bytes.slice(0))).catch(() => {})
    return [url, bytes]
  }))
  return Object.fromEntries(entries)
}

// エンジンがモデルを読み込む fetch。models（loadOcrModels の結果）にあればそれを使い、なければ進み具合を知らせながら取りに行く。
function modelFetch(onDownload, models = {}) {
  const progress = downloadProgress(onDownload)
  return async (input, init) => {
    const url = String(input?.url ?? input)
    if (!/\/ocr-models\//.test(url)) return fetch(input, init)
    if (models[url]) return new Response(models[url])
    const response = await fetch(input, init)
    if (!response.ok) return response
    return new Response(await readBytes(response, progress(url)), { status: response.status, headers: response.headers })
  }
}

// 読み取りエンジンを作る（モデルと ONNX Runtime を読み込む）。paddle は import('@paddleocr/paddleocr-js') の中身。
//   options.onDownload  初回のモデルの読み込みの進み具合（0〜1）
//   options.lowMemory   検出の解像度を下げて読む
//   options.models      読み込んだモデル（loadOcrModels の結果）
export async function createOcrReader(paddle, options = {}) {
  await quietOrt()
  const ocr = await paddle.PaddleOCR.create({
    ...ocrCreateOptions(options),
    fetch: modelFetch(options.onDownload, options.models),
    ...(options.createOptions ?? {}),
  })
  return {
    async read(image) {
      const [result] = await ocr.predict(image, options.lowMemory ? OCR_LOW_MEMORY_READ_PARAMS : OCR_READ_PARAMS)
      return { ...ocrPageFromItems(result?.items), metrics: result?.metrics ?? null, runtime: result?.runtime ?? null }
    },
    async dispose() {
      await ocr.dispose?.()
    },
  }
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
