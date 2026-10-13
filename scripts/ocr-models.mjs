// 「教科書から単語追加」の読み取りに使う PaddleOCR のモデル（Apache-2.0）を取り込み、公開版に入れる。
// モデルはリポジトリに入れない。ビルド（vite.config.js の ocrModels プラグイン）と開発サーバーとテストが、
// PaddlePaddle の配布元から node_modules/.cache/ocr-models/ へ取り込み、sha256 で中身を確かめてから使う。
// 公開版では dist/ocr-models/<file> に置き、画面は同じサイトから読む（名前は src/lib/ocrModels.js の表）。
//
//   node scripts/ocr-models.mjs        取り込む（取り込み済みで中身が同じなら読み直さない）
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { OCR_MODEL_FILES, OCR_MODEL_NAMES, OCR_MODEL_SHA256 } from '../src/lib/ocrModels.js'

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

export async function ensureOcrModels() {
  mkdirSync(OCR_MODEL_CACHE, { recursive: true })
  for (const model of OCR_MODELS) {
    const path = ocrModelPath(model)
    if (existsSync(path) && sha256(readFileSync(path)) === model.sha256) continue
    const response = await fetch(`${SOURCE}${model.file}`)
    if (!response.ok) throw new Error(`${model.file} を取り込めない（${response.status}）`)
    const buffer = Buffer.from(await response.arrayBuffer())
    if (sha256(buffer) !== model.sha256) throw new Error(`${model.file} の中身が表の sha256 と違う`)
    writeFileSync(path, buffer)
  }
  return OCR_MODELS.map((model) => ({ ...model, path: ocrModelPath(model) }))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const models = await ensureOcrModels()
  console.log(models.map((model) => `${model.file} ${readFileSync(model.path).length} バイト`).join('\n'))
}
