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
})
