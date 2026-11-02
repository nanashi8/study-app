// 写真1枚を専用の別スレッドで読む。読み終えたらスレッドごと捨てる。
// 2026-11-02、iPhone で読み取りが落ちた。アプリ本体と同じスレッドだと JavaScript の領域が大きいぶん不要なメモリの回収が遅れ、
// 認識の1行ごとの大きな出力がたまる。別スレッドなら回収が早く、捨てればメモリが丸ごと返る。画面も固まらない。

/**
 * 1枚読む。{ promise, cancel } を返す。promise は読んだページ（ocrEngine.js の行と語）になる。
 *   onDownload  モデルの読み込みの進み具合（0〜1）
 *   onReading   読み取りを始めたとき
 */
export function readPhotoInWorker(image, { lowMemory = false, onDownload, onReading } = {}) {
  const worker = new Worker(new URL('./ocrWorker.js', import.meta.url), { type: 'module' })
  let settle
  const promise = new Promise((resolve, reject) => {
    settle = { resolve, reject }
    worker.onmessage = ({ data }) => {
      if (data.type === 'download') onDownload?.(data.fraction)
      if (data.type === 'reading') onReading?.()
      if (data.type === 'done') resolve(data.page)
      if (data.type === 'failed') reject(new Error(data.message))
    }
    worker.onerror = (event) => reject(new Error(event.message || 'photo OCR worker failed'))
  }).finally(() => worker.terminate())
  // 別スレッドからはこのページの場所が見えないので、モデルの置き場所は絶対の URL で渡す。
  const base = new URL(import.meta.env?.BASE_URL ?? './', document.baseURI).href
  worker.postMessage({ image, lowMemory, base })
  return { promise, cancel: () => settle.reject(new Error('cancelled')) }
}
