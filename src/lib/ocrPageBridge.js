// アプリの画面と読み取り専用のページ（ocr.html）の受け渡し。写真・読み取りの結果・戻る画面を IndexedDB に置く。
// 2026-11-02、iPhone で読み取りが落ちた。アプリ本体は開いただけで約 590MB を使うので、読むあいだだけアプリ本体のいないページへ移る。
// WebKit のメモリの山（メモリ不足の知らせを受けた状態）は、読み取り中 1,904MB → 約 930MB。読み終えて戻ると 249MB。
import { transientStore } from './appStorage.js'

const JOB = 'job'
const RESULT = 'result'
const bridge = transientStore('eigo-quest-ocr')

// 写真は Blob のままだと保存できない環境がある（Safari のプライベートな表示など）ので、バイト列にして置く。
const packFile = async (file) => ({ bytes: await file.arrayBuffer(), type: file.type, name: file.name })
const unpackFile = (packed) => new File([packed.bytes], packed.name ?? 'photo', { type: packed.type })

const read = (key) => bridge.get(key)
const write = (key, value) => bridge.set(key, value)
const remove = (key) => bridge.remove(key)

export const ocrPageUrl = (base = import.meta.env?.BASE_URL ?? './') => new URL(`${base}ocr.html`, document.baseURI).href

/** 読み取り専用のページへ移る。job は { key, file, readingStatus, returnUrl, navigation, resume }。 */
export async function startOcrPage(job) {
  await write(RESULT, null)
  await write(JOB, { ...job, file: await packFile(job.file), attempts: 0 })
  location.replace(ocrPageUrl())
}

export async function loadOcrJob() {
  const job = await read(JOB)
  return job ? { ...job, photo: unpackFile(job.file) } : null
}
export const saveOcrJob = ({ photo, ...job }) => write(JOB, job)

/** 読み取りを終えて（読めた・読めなかった・やめた）アプリへ戻る。outcome は { page } か { failed: true } か { cancelled: true }。 */
export async function finishOcrJob(job, outcome) {
  await write(RESULT, { key: job.key, file: job.file, navigation: job.navigation, resume: job.resume, ...outcome })
  await remove(JOB)
  location.replace(job.returnUrl)
}

/** アプリの起動時：読み取りから戻ってきたなら、戻る画面（navigation）を返す。 */
export async function pendingOcrNavigation() {
  try {
    return (await read(RESULT))?.navigation ?? null
  } catch {
    return null
  }
}

const taking = new Map()
/** 画面（key）あての結果を受け取る（1度だけ）。開発版の StrictMode で2回呼ばれても同じ結果を返す。 */
export function takeOcrResult(key) {
  if (!taking.has(key)) {
    taking.set(key, (async () => {
      try {
        const result = await read(RESULT)
        if (result?.key !== key) return null
        await write(RESULT, null)
        return { ...result, file: unpackFile(result.file) }
      } catch {
        return null
      }
    })().finally(() => setTimeout(() => taking.delete(key), 0)))
  }
  return taking.get(key)
}
