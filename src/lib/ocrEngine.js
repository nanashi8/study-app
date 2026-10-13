// 「教科書から単語追加」で、写真1枚を読み取りエンジン（tesseract.js）で読む手順。画面（VocabCamera.jsx）とテストが同じ手順で読む。
// vocabOcr.js の OCR_ENGINES の2つのエンジンを並べて動かし、それぞれ白黒の決め方2通りで読んで、mergeOcrPasses でまとめる。
import { mergeOcrPasses, ocrLinesFromResult, OCR_ENGINES } from './vocabOcr.js'

// エンジン本体（tesseract.js-core）の版。package-lock.json の tesseract.js-core と同じ版にする（テストが確かめる）。
export const OCR_CORE_VERSION = '7.0.0'

// エンジンを作るときだけ効く設定。debug_file は、エンジンの知らせ（日本語の認識データの設定のうちこの版にない項目の
// 「Parameter not found」、縦書きの日本語のデータ jpn_vert を置いていないことの「Failed loading language」、
// 「Estimating resolution」など）を、画面のコンソールへ出さずに捨てる。2026-10-14 に写真28枚と試料7枚を4通りで読み、
// 読み取りの結果は1字も変わらないことを確かめた。
// jpn_vert は置かない（置くと、横書きの日本語の文の行が英字に化けた。縦書きの写真も読めるようにはならなかった）。
export const OCR_INIT_CONFIG = Object.freeze({ debug_file: '/dev/null' })

// ブラウザで使うエンジン本体。LSTM だけの版（tesseract.js の既定）ではなく旧エンジン入りの版を使う。
// 旧エンジン入りの版は、日本語の認識データの設定を全部受け付け、日本語と英語のまざった行を正しく読む
// （LSTM だけの版は「「decide to ～」は…」の行を「Tdecide to ~; 1& T~F2Z…」と読み、選択肢の記号ア・イ・ウを
// 7・A・* と読んだ）。relaxed SIMD の版は使わない（計算の丸めが端末ごとに変わってよい命令で、結果が端末でずれうる）。
export function ocrCoreUrl(simdSupported) {
  const file = simdSupported ? 'tesseract-core-simd.wasm.js' : 'tesseract-core.wasm.js'
  return `https://cdn.jsdelivr.net/npm/tesseract.js-core@${OCR_CORE_VERSION}/${file}`
}

export async function ocrBrowserWorkerOptions() {
  const { simd } = await import('wasm-feature-detect')
  return { corePath: ocrCoreUrl(await simd().catch(() => false)) }
}

// 写真1枚を読む。
//   tesseract      import('tesseract.js') の中身（createWorker・OEM・PSM）
//   image          エンジンへ渡す画像（ocrImage.js の prepareImageForOcr の結果、node ではファイルのパス）
//   isEnglishWord  vocabOcr.js の createOcrWordTest の結果
//   workerOptions  createWorker の3つ目の引数（ブラウザは corePath、node のテストは cachePath・workerPath）
//   onWorker       エンジンを作るたびに呼ぶ（画面を離れたときに止めるため）
//   onProgress     ({ engine, status, progress }) を知らせる
//   isAlive        false になったら、次の読み方へ進まない
export async function readOcrPage(tesseract, image, { isEnglishWord, workerOptions = {}, onWorker, onProgress, isAlive = () => true }) {
  const { createWorker, OEM, PSM } = tesseract
  const passes = await Promise.all(OCR_ENGINES.map(async (engine) => {
    const worker = await createWorker([...engine.languages], OEM.LSTM_ONLY, {
      ...workerOptions,
      logger: (message) => onProgress?.({ engine: engine.id, ...message }),
    }, OCR_INIT_CONFIG)
    onWorker?.(worker)
    const read = []
    try {
      for (const thresholding of engine.thresholdings) {
        if (!isAlive()) break
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.AUTO,
          preserve_interword_spaces: '1',
          thresholding_method: thresholding,
        })
        const { data } = await worker.recognize(image, {}, { text: true, blocks: true })
        read.push({ key: `${engine.id}${thresholding}`, kind: engine.id, lines: ocrLinesFromResult(data) })
      }
    } finally {
      await worker.terminate().catch(() => {})
    }
    return read
  }))
  return mergeOcrPasses(passes.flat(), isEnglishWord)
}
