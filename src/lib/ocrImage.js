// 「教科書から単語追加」で、写真を読み取りエンジンへ渡す前の下ごしらえ。
// 写真の向き（EXIF）をそろえ、長い辺が 1200〜2200px に入るよう大きさを変えて、まわりに白い余白をつけた canvas に描き直し、
// PNG にする。
// - PNG にするのは、JPEG にし直すと読み取りが落ちるため（2026-10-14、写真28枚と試料7枚を同じ下ごしらえから PNG・JPEG 0.92・
//   JPEG 0.8 にして比べ、英単語の取り出し 73.0%・70.4%・72.6%、日本語 62.4%・55.4%・58.3%）。
// - 余白は、字が画像の端に近いと画像処理の部品（leptonica）が「Error in boxClipToRectangle」などを出すのを、原因から止めるため。
//   幅は 4px（2・4・8・24px を比べ、どれも知らせは消えた。24px はエンジンのページの割り付けが変わって日本語が 62.4%→59.7% に
//   下がり、4px は英単語 72.7%・日本語 64.7%・写真にない語を選ぶ誤り1件で、いちばん誤りが少なかった）。
export const OCR_IMAGE_MARGIN = 4
export const MAX_OCR_DIMENSION = 2200
export const MIN_OCR_DIMENSION = 1200
const UPSCALE_TARGET = 1600

// 長い辺が 2200px を超えたら縮め、1200px に満たなければ（最大2倍まで）広げる。あいだはそのまま。
export function ocrImageScale(width, height) {
  const largestSide = Math.max(width, height)
  if (largestSide > MAX_OCR_DIMENSION) return MAX_OCR_DIMENSION / largestSide
  if (largestSide < MIN_OCR_DIMENSION) return Math.min(2, UPSCALE_TARGET / largestSide)
  return 1
}

export async function prepareImageForOcr(file, { type = 'image/png', quality } = {}) {
  // type・quality は形式を比べる確かめのためだけに変える。画面は既定の PNG を使う。
  if (typeof createImageBitmap !== 'function') return file

  let bitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    bitmap = await createImageBitmap(file)
  }

  try {
    const scale = ocrImageScale(bitmap.width, bitmap.height)
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width + OCR_IMAGE_MARGIN * 2
    canvas.height = height + OCR_IMAGE_MARGIN * 2
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return file
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, OCR_IMAGE_MARGIN, OCR_IMAGE_MARGIN, width, height)

    return await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob ?? file), type, quality)
    })
  } finally {
    bitmap.close?.()
  }
}
