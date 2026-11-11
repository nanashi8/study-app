// 「教科書から単語追加」の読み取りに使う PaddleOCR のモデル（Apache-2.0）を取り込み、公開版に入れる。
// モデルはリポジトリに入れない。ビルド（vite.config.js の ocrModels プラグイン）と開発サーバーとテストが、
// PaddlePaddle の配布元から node_modules/.cache/ocr-models/ へ取り込み、sha256 で中身を確かめてから使う。
// 公開版では、tar から作った読み取り用のファイル（ocrServedFiles）を dist/ocr-models/<file> に置き、画面は同じサイトから読む
// （名前は src/lib/ocrModels.js の表）。
//
//   node scripts/ocr-models.mjs        取り込む（取り込み済みで中身が同じなら読み直さない）
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { OCR_MODEL_FILES, OCR_MODEL_NAMES, OCR_MODEL_SHA256, OCR_SERVED_FILES } from '../src/lib/ocrModels.js'
import { parseCharDict, readTarEntry, withTopOutput } from '../src/lib/ocrPipeline.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
export const OCR_MODEL_CACHE = `${ROOT}node_modules/.cache/ocr-models/`
const SOURCE = 'https://paddle-model-ecology.bj.bcebos.com/paddlex/official_inference_model/paddle3.0.0/'

// 名前・ファイル・指紋は src/lib/ocrModels.js の表（画面と同じ）。
export const OCR_MODELS = Object.freeze(['det', 'rec'].map((kind) => Object.freeze({
  kind,
  name: OCR_MODEL_NAMES[kind],
  file: OCR_MODEL_FILES[kind],
  sha256: OCR_MODEL_SHA256[kind],
})))

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex')
export const ocrModelPath = (model) => `${OCR_MODEL_CACHE}${model.file}`

// 取り寄せの一時的な失敗でビルドを落とさない。2026-11-10、公開の自動処理（run 42768524753）が、取り寄せの時間切れ
// （fetch failed・ETIMEDOUT）で落ち、そのまま気づかれなかった。1回ごとに時間を区切り、失敗したら間をあけてやり直す。
export const FETCH_ATTEMPTS = 4
export const FETCH_TIMEOUT_MS = 3 * 60 * 1000
export const FETCH_WAITS_MS = [5_000, 20_000, 60_000]

/** url を取り寄せて中身を返す。失敗（つながらない・時間切れ・200 以外）なら、間をあけて attempts 回まで試す。 */
export async function fetchWithRetry(url, {
  fetchImpl = fetch, attempts = FETCH_ATTEMPTS, timeoutMs = FETCH_TIMEOUT_MS, waitsMs = FETCH_WAITS_MS,
  wait = (ms) => new Promise((done) => setTimeout(done, ms)), log = (line) => console.error(line),
} = {}) {
  const errors = []
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) })
      if (!response.ok) throw new Error(`${response.status}`)
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      const reason = [error.message, error.cause?.code ?? error.cause?.message].filter(Boolean).join('・')
      errors.push(reason)
      if (attempt === attempts) break
      const ms = waitsMs[Math.min(attempt - 1, waitsMs.length - 1)]
      log(`${url} を取り込めない（${attempt}回目：${reason}）。${Math.round(ms / 1000)}秒後にやり直す`)
      await wait(ms)
    }
  }
  throw new Error(`${url} を ${attempts}回 試して取り込めない（${errors.join(' / ')}）`)
}

export async function ensureOcrModels() {
  mkdirSync(OCR_MODEL_CACHE, { recursive: true })
  for (const model of OCR_MODELS) {
    const path = ocrModelPath(model)
    if (existsSync(path) && sha256(readFileSync(path)) === model.sha256) continue
    const buffer = await fetchWithRetry(`${SOURCE}${model.file}`)
    if (sha256(buffer) !== model.sha256) throw new Error(`${model.file} の中身が表の sha256 と違う`)
    writeFileSync(path, buffer)
  }
  return OCR_MODELS.map((model) => ({ ...model, path: ocrModelPath(model) }))
}

/** 公開版で配るファイル [{ file, type, bytes }]（src/lib/ocrModels.js の OCR_SERVED_FILES）。 */
export async function ocrServedFiles() {
  const [det, rec] = await ensureOcrModels()
  const detTar = readFileSync(det.path)
  const recTar = readFileSync(rec.path)
  const chars = parseCharDict(new TextDecoder().decode(readTarEntry(recTar, '/inference.yml')))
  return [
    { file: OCR_SERVED_FILES.det, type: 'application/octet-stream', bytes: Buffer.from(readTarEntry(detTar, '/inference.onnx')) },
    { file: OCR_SERVED_FILES.rec, type: 'application/octet-stream', bytes: Buffer.from(withTopOutput(readTarEntry(recTar, '/inference.onnx'))) },
    { file: OCR_SERVED_FILES.chars, type: 'application/json', bytes: Buffer.from(JSON.stringify(chars)) },
  ]
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const models = await ensureOcrModels()
  console.log(models.map((model) => `${model.file} ${readFileSync(model.path).length} バイト`).join('\n'))
}
