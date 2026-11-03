import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ocrServedFiles } from './scripts/ocr-models.mjs'
import { OCR_SERVED_FILES } from './src/lib/ocrModels.js'

// 写真の読み取りのモデル（scripts/ocr-models.mjs の ocrServedFiles）を、開発サーバーでは /ocr-models/ から配り、
// ビルドでは dist/ocr-models/ に入れる。
function ocrModels() {
  return {
    name: 'ocr-models',
    async buildStart() {
      if (this.meta.watchMode) return
      for (const served of await ocrServedFiles()) {
        this.emitFile({ type: 'asset', fileName: `ocr-models/${served.file}`, source: served.bytes })
      }
    },
    configureServer(server) {
      let served = null
      server.middlewares.use(async (req, res, next) => {
        const file = Object.values(OCR_SERVED_FILES).find((item) => req.url?.split('?')[0].endsWith(`/ocr-models/${item}`))
        if (!file) return next()
        try {
          served ??= ocrServedFiles()
          const found = (await served).find((item) => item.file === file)
          res.setHeader('content-type', found.type)
          res.end(found.bytes)
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

// base: './' keeps asset URLs relative so the build works under any
// GitHub Pages path (https://<user>.github.io/<repo>/) without extra config.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), ocrModels()],
  resolve: {
    // 写真の読み取りは GPU なしの版の ONNX Runtime で動かす（SDK の import もこちらへ向ける）。GPU 対応版は本体が大きく、
    // GPU を使わないときでも WebKit のメモリの山が 1,415MB になってスマホで落ちた。この版は 759MB（2026-11-02）。
    alias: [{ find: /^onnxruntime-web$/, replacement: 'onnxruntime-web/wasm' }],
  },
  // 読み取りの別スレッド（src/lib/ocrWorker.js）は ONNX Runtime を塊に分けて読むので ES モジュールにする。
  worker: { format: 'es' },
  build: {
    rolldownOptions: {
      // ocr.html は写真の読み取り専用のページ（アプリ本体を読み込まない。src/lib/ocrPageBridge.js）。
      input: { main: 'index.html', ocr: 'ocr.html' },
      output: {
        codeSplitting: {
          // vite は import() を先読みの関数（\0vite/preload-helper.js）で包む。この関数がアプリ本体の塊に入ると、
          // ONNX Runtime（教科書から単語追加の読み取り）が別スレッドで自分の塊を読み込むときにアプリ本体まで動き、
          // document がなくて止まる（2026-10-14 の公開版）。先読みの関数は別の小さな塊にする。
          groups: [{ name: 'preload-helper', test: /vite\/preload-helper/, priority: 100 }],
        },
      },
    },
  },
})
