// 読み取りエンジンを動かす専用の別スレッド。1枚読むごとに作って捨てる（ocrWorkerClient.js）。
import * as paddle from '@paddleocr/paddleocr-js'
import cvModule from '@techstark/opencv-js'
import { createOcrReader } from './ocrEngine.js'

// 認識の出力は1行ごとに約 12MB の配列になり（字の位置の数 × 約1.8万字の確率）、不要になっても回収されないまま積み上がって、
// 文字の多いページではこれだけで 800MB を超えた（2026-11-02、WebKit で測定）。ONNX Runtime と SDK は大きな配列を受け取ったら
// 次の計算までに読み終えるので、このスレッドの中だけ、大きな配列を新しく作らず同じ領域を順に使い回す。
const LARGE_ARRAY = 1 << 20
const POOL_SIZE = 3
const NativeFloat32Array = globalThis.Float32Array
const pool = Array.from({ length: POOL_SIZE }, () => null)
let poolAt = 0
globalThis.Float32Array = new Proxy(NativeFloat32Array, {
  construct(target, args, newTarget) {
    if (args.length !== 1 || typeof args[0] !== 'number' || args[0] < LARGE_ARRAY) return Reflect.construct(target, args, newTarget)
    const at = poolAt
    poolAt = (poolAt + 1) % POOL_SIZE
    if (!pool[at] || pool[at].length < args[0]) pool[at] = new target(args[0])
    return pool[at].subarray(0, args[0]).fill(0)
  },
})

// SDK は写真を document の canvas で開くので、別スレッドでは先に OpenCV の画像にして渡す。
async function imageToMat(bitmap) {
  // エンジンを作った後なので OpenCV は準備済み。Promise でないときに await すると戻らない（then を持つ）。
  const cv = cvModule instanceof Promise ? await cvModule : cvModule
  const context = new OffscreenCanvas(bitmap.width, bitmap.height).getContext('2d', { willReadFrequently: true })
  context.drawImage(bitmap, 0, 0)
  const mat = cv.matFromImageData(context.getImageData(0, 0, bitmap.width, bitmap.height))
  bitmap.close()
  return mat
}

self.onmessage = async ({ data }) => {
  const { bitmap, models, lowMemory, base } = data
  try {
    const reader = await createOcrReader(paddle, {
      lowMemory,
      base,
      models,
    })
    self.postMessage({ type: 'reading' })
    const mat = await imageToMat(bitmap)
    const page = await reader.read(mat)
    mat.delete()
    self.postMessage({ type: 'done', page: { text: page.text, words: page.words, lines: page.lines } })
  } catch (reason) {
    self.postMessage({ type: 'failed', message: String(reason?.message ?? reason) })
  }
}
