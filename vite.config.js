import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ensureOcrModels, OCR_MODELS } from './scripts/ocr-models.mjs'

// 「教科書から単語追加」の読み取りのモデル（scripts/ocr-models.mjs）を、開発サーバーでは /ocr-models/ から配り、
// ビルドでは dist/ocr-models/ に入れる。
function ocrModels() {
  return {
    name: 'ocr-models',
    async buildStart() {
      if (this.meta.watchMode) return
      for (const model of await ensureOcrModels()) {
        this.emitFile({ type: 'asset', fileName: `ocr-models/${model.file}`, source: readFileSync(model.path) })
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const model = OCR_MODELS.find((item) => req.url?.split('?')[0].endsWith(`/ocr-models/${item.file}`))
        if (!model) return next()
        try {
          const [ready] = (await ensureOcrModels()).filter((item) => item.file === model.file)
          res.setHeader('content-type', 'application/x-tar')
          res.end(readFileSync(ready.path))
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
  build: {
    rolldownOptions: {
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
