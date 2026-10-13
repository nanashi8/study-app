// node のテストで読み取りエンジン（tesseract.js）を動かす入口。画面（ブラウザ）と同じエンジン本体を使うために、
// tesseract.js の node 版がエンジン本体を選ぶところを、決まった版へ差し替える（既定は画面と同じ tesseract-core-simd）。
// tesseract.js 7.0.0 の node 版は、本体を選ぶ関数 getCore(oem, …) に lstmOnly（true/false）を渡しているため、
// LSTM だけの版ではなく旧エンジン入りの relaxed SIMD 版（tesseract-core-relaxedsimd）を読んでいた。ブラウザは既定で
// LSTM だけの版を読むので、同じ画像でも node とブラウザで読み取りが食い違った（2026-10-14）。
// VOCAB_OCR_CORE_VARIANT で別の版（simd-lstm など）を選べる（直す前の画面の読み取りを再現する確かめに使う）。
const Module = require('node:module')
const path = require('node:path')

const variant = process.env.VOCAB_OCR_CORE_VARIANT || 'simd'
const originalResolve = Module._resolveFilename
Module._resolveFilename = function resolve(request, ...rest) {
  if (/^tesseract\.js-core\/tesseract-core(?:-[a-z-]+)?$/.test(request)) {
    return originalResolve.call(this, `tesseract.js-core/tesseract-core-${variant}`, ...rest)
  }
  return originalResolve.call(this, request, ...rest)
}

require(path.join(path.dirname(require.resolve('tesseract.js/package.json')), 'src', 'worker-script', 'node', 'index.js'))
