// 読み取りエンジンを動かす専用の別スレッド。1枚読むごとに作って捨てる（ocrWorkerClient.js）。
// 読み取りは ocrPipeline.js（ONNX Runtime の wasm の版と canvas だけで動く）。
import * as ort from 'onnxruntime-web/wasm'
import { createOcrPipeline } from './ocrPipeline.js'
import { OCR_LOW_MEMORY_READ_OPTIONS, OCR_READ_OPTIONS, ocrPageFromItems } from './ocrEngine.js'

ort.env.logLevel = 'error'
// 計算をさらに別のスレッドへ分けない（スレッドごとにメモリを持つ。このページは別スレッドの用意もしていない）。
ort.env.wasm.numThreads = 1

self.onmessage = async ({ data }) => {
  const { bitmap, models, lowMemory } = data
  try {
    const pipeline = await createOcrPipeline({
      ort,
      detModel: new Uint8Array(models.det),
      recModel: new Uint8Array(models.rec),
      chars: JSON.parse(new TextDecoder().decode(models.chars)),
      createCanvas: (width, height) => new OffscreenCanvas(width, height),
      ...(lowMemory ? OCR_LOW_MEMORY_READ_OPTIONS : OCR_READ_OPTIONS),
    })
    // モデルのバイト列は ONNX Runtime の中へ写したので手放す（21MB）。
    models.det = null
    models.rec = null
    self.postMessage({ type: 'reading' })
    const result = await pipeline.read(bitmap, { onProgress: (fraction) => self.postMessage({ type: 'progress', fraction }) })
    bitmap.close()
    const page = ocrPageFromItems(result.items)
    self.postMessage({ type: 'done', page: { text: page.text, words: page.words, lines: page.lines } })
  } catch (reason) {
    self.postMessage({ type: 'failed', message: String(reason?.message ?? reason) })
  }
}
