// 「教科書から単語追加」で、写真1枚を読み取りエンジン（PaddleOCR の PP-OCRv6、ONNX Runtime Web で動かす）で読む手順。
// 画面（VocabCamera.jsx）とテストが同じ手順で読む。
//
// 2026-10-14 に Tesseract から置きかえた。ウェブで集めた実写真28枚（tests/fixtures/vocab-ocr/photos.json）の正解と照らして、
// 写真の英単語 394→547/582 語、横書きの日本語 1,029→1,618/1,794 字。Tesseract は文書向けで、色地に白い字の標識・傾いた写真・
// 曲がった紙面・縦書き・遠くの字では「どこに字があるか」を見つけられなかった。PaddleOCR は字のある所を先に探す（検出）ので、
// これらも読める。
// モデルは、検出が PP-OCRv6_tiny（1.8MB）、認識が PP-OCRv6_small（21MB。日本語・英語・中国語を1つで読む）。認識の tiny は
// ひらがなを漢字に読み違え（「は」→「注」）、PP-OCRv5_mobile の認識は英単語が少し落ちた。検出は tiny でも small とほぼ同じだった。
// 端末に WebGPU があれば GPU で、なければ wasm で動かす（パソコンで1枚平均 0.46 秒と約 2.6 秒）。
import { OCR_MODEL_BYTES, OCR_MODEL_FILES, OCR_MODEL_NAMES } from './ocrModels.js'

// ONNX Runtime Web の本体（wasm）は、ビルドが同じサイトの assets/ に入れたものを読む（外のサイトに頼らない）。

// モデルは同じサイトの ocr-models/ に置く（vite.config.js がビルドに入れる）。
export function ocrModelUrl(file, base = import.meta.env?.BASE_URL ?? './') {
  return new URL(`${base}ocr-models/${file}`, globalThis.location?.href ?? 'http://localhost/').href
}

// 読み取りの負荷。2026-11-02、615語の教科書のページ（長い行が約40行）をスマホで読むとアプリが落ちた。
// - 認識は1行ずつ（textRecognitionBatchSize: 1）。モデルの既定は6行ずつで、6行を一番長い行の幅にそろえて計算するので、
//   長い行が並ぶページほどメモリを食う。GPU で読むときのメモリの山は 3,781MB から 1,755MB に下がった（ソフトの GPU で測定）。
// - 検出は長い辺 1600px まで（モデルの既定は写真の大きさのまま）。ピクセル数が減るぶん軽くなる。
// - 箱のしきい値は 0.4（既定 0.6）。既定では文字の詰まったページの行が丸ごと抜けた（42か所中36か所 → 42か所）。
export const OCR_READ_PARAMS = Object.freeze({ textDetLimitSideLen: 1600, textDetLimitType: 'max', textDetBoxThresh: 0.4 })
// 前の読み取りが途中で止まった端末や、読み取りが失敗したときの読み方。GPU を使わず、検出の解像度も下げる。
export const OCR_LOW_MEMORY_READ_PARAMS = Object.freeze({ ...OCR_READ_PARAMS, textDetLimitSideLen: 1280 })

export function ocrCreateOptions({ base, lowMemory = false } = {}) {
  return {
    textDetectionModelName: OCR_MODEL_NAMES.det,
    textDetectionModelAsset: { url: ocrModelUrl(OCR_MODEL_FILES.det, base) },
    textRecognitionModelName: OCR_MODEL_NAMES.rec,
    textRecognitionModelAsset: { url: ocrModelUrl(OCR_MODEL_FILES.rec, base) },
    textRecognitionBatchSize: 1,
    // WebGPU があれば GPU で動かす。wasm で動かすときは、計算を別スレッドに移して画面が固まらないようにする（proxy）。
    ortOptions: { backend: lowMemory ? 'wasm' : 'auto', proxy: true },
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
// ONNX Runtime の知らせ（WebGPU で一部の計算を CPU に回したときの「Some nodes were not assigned…」など）を、
// エラーのときだけにする。セッションごとの知らせの度合いは作るときの設定（logSeverityLevel、指定がなければ警告）で決まり、
// SDK はそれを渡さないので、セッションを作る関数を包んで渡す（3 ＝ エラー）。
async function quietOrt() {
  ortQuiet ??= import('onnxruntime-web').then((ort) => {
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

// モデルを読み込む fetch。読み込んだ量（0〜1）を onDownload に知らせる。
function progressFetch(onDownload) {
  if (!onDownload) return undefined
  const total = OCR_MODEL_BYTES.det + OCR_MODEL_BYTES.rec
  const loaded = new Map()
  return async (input, init) => {
    const response = await fetch(input, init)
    const url = String(input?.url ?? input)
    if (!/\/ocr-models\//.test(url) || !response.ok || !response.body) return response
    const reader = response.body.getReader()
    const chunks = []
    let received = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      received += value.length
      loaded.set(url, received)
      onDownload(Math.min(1, [...loaded.values()].reduce((sum, bytes) => sum + bytes, 0) / total))
    }
    return new Response(new Blob(chunks), { status: response.status, statusText: response.statusText, headers: response.headers })
  }
}

// 読み取りエンジンを作る（モデルと ONNX Runtime を読み込む）。paddle は import('@paddleocr/paddleocr-js') の中身。
//   options.onDownload  初回のモデルの読み込みの進み具合（0〜1）
//   options.lowMemory   GPU を使わず、検出の解像度を下げて読む
export async function createOcrReader(paddle, options = {}) {
  await quietOrt()
  const fetchWithProgress = progressFetch(options.onDownload)
  const ocr = await paddle.PaddleOCR.create({
    ...ocrCreateOptions(options),
    ...(fetchWithProgress ? { fetch: fetchWithProgress } : {}),
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
