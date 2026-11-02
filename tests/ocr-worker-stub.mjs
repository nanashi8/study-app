// 写真の読み取りの代わり（読み取り専用のページ ocr.html の別スレッドの代わり）。アプリとページをまたぐので、状態は localStorage に置く。
//   items   読んだ箱（{ text, score, poly }）
//   fail    あと何回失敗するか
//   hold    true のあいだ読み終えない
//   reads   読んだときの lowMemory の並び（記録）
export const OCR_STUB_KEY = '__ocrStub'
const STUB = `
import { ocrPageFromItems } from '/src/lib/ocrEngine.js'
const load = () => JSON.parse(localStorage.getItem('${OCR_STUB_KEY}') || '{}')
const save = (state) => localStorage.setItem('${OCR_STUB_KEY}', JSON.stringify(state))
export function readPhotoInWorker(image, { lowMemory = false, onReading } = {}) {
  const state = load()
  state.reads = [...(state.reads ?? []), lowMemory]
  save(state)
  onReading?.()
  let stop
  const promise = new Promise((resolve, reject) => {
    stop = reject
    const finish = () => {
      const now = load()
      if (now.hold) return void setTimeout(finish, 50)
      if (now.fail > 0) {
        save({ ...now, fail: now.fail - 1 })
        return void reject(new Error('memory access out of bounds'))
      }
      resolve(ocrPageFromItems(now.items ?? []))
    }
    finish()
  })
  return { promise, cancel: () => stop(new Error('cancelled')) }
}
`
export const ocrWorkerStub = () => ({
  name: 'ocr-worker-stub',
  enforce: 'pre',
  resolveId: (id) => (/ocrWorkerClient\.js$/.test(id) ? '\0ocr-worker-stub' : null),
  load: (id) => (id === '\0ocr-worker-stub' ? STUB : null),
})
