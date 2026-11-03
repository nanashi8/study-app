// 読み取り専用のページ（ocr.html）。アプリ本体を読み込まず、写真1枚を読んでアプリへ戻る。ページの文言もここで出す。
// 途中でページごと落ちると端末が読み直すので、ここへもう一度来る。そのときは軽い読み方でやり直し、それでも落ちたら読めなかったことにして戻る。
import { beginOcrReading, endOcrReading, rememberOcrLowMemory } from './ocrEngine.js'
import { prepareImageForOcr } from './ocrImage.js'
import { finishOcrJob, loadOcrJob, saveOcrJob } from './ocrPageBridge.js'
import { readPhotoInWorker } from './ocrWorkerClient.js'

const MAX_ATTEMPTS = 2
const statusLine = document.querySelector('[data-ocr-status]')
const percent = document.querySelector('[data-ocr-percent]')
const bar = document.querySelector('[data-ocr-bar]')
const cancelButton = document.querySelector('[data-ocr-cancel]')
document.title = '写真の文字を読み取り中'
document.querySelector('[data-ocr-note]').textContent = '写真は端末内で処理し、保存・送信しません。読み終えると元の画面に戻ります。'
cancelButton.textContent = 'やめる'

function show(status, progress) {
  if (status) statusLine.textContent = status
  percent.textContent = `${Math.round(progress * 100)}%`
  bar.style.width = `${Math.round(progress * 100)}%`
}

async function main() {
  const job = await loadOcrJob()
  if (!job) {
    location.replace(new URL('./', location.href).href)
    return
  }
  let current = null
  cancelButton.addEventListener('click', () => {
    current?.cancel()
    endOcrReading()
    finishOcrJob(job, { cancelled: true })
  })
  if (job.attempts >= MAX_ATTEMPTS) {
    endOcrReading()
    await finishOcrJob(job, { failed: true })
    return
  }
  await saveOcrJob({ ...job, attempts: job.attempts + 1 })

  const read = (image, lowMemory) => {
    show('文字認識エンジンを準備中…', 0.05)
    current = readPhotoInWorker(image, {
      lowMemory,
      onDownload: (fraction) => show('英語と日本語の認識データを読み込み中…', 0.05 + 0.55 * fraction),
      onReading: () => show(job.readingStatus, 0.65),
      onProgress: (fraction) => show(null, 0.65 + 0.35 * fraction),
    })
    return current.promise
  }

  show('写真を読み込んでいます…', 0.02)
  try {
    const image = await prepareImageForOcr(job.photo)
    const lowMemory = beginOcrReading()
    let page
    try {
      page = await read(image, lowMemory)
    } catch (reason) {
      // メモリ不足などで失敗したら、軽い読み方で1度読み直す。
      if (lowMemory) throw reason
      console.warn('photo OCR retrying with low memory', reason)
      rememberOcrLowMemory()
      page = await read(image, true)
    }
    endOcrReading()
    show('読み取りが完了しました', 1)
    await finishOcrJob(job, { page })
  } catch (reason) {
    console.warn('photo OCR failed', reason)
    endOcrReading()
    await finishOcrJob(job, { failed: true })
  }
}

main()
