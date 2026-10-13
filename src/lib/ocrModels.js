// 「教科書から単語追加」の読み取りに使う PaddleOCR のモデルの名前・ファイル・中身の指紋（sha256）。
// 画面（ocrEngine.js）と、モデルを取り込んで公開版に入れる道具（scripts/ocr-models.mjs・vite.config.js）が同じ表を使う。
export const OCR_MODEL_NAMES = Object.freeze({ det: 'PP-OCRv6_tiny_det', rec: 'PP-OCRv6_small_rec' })
export const OCR_MODEL_FILES = Object.freeze({ det: 'PP-OCRv6_tiny_det_onnx_infer.tar', rec: 'PP-OCRv6_small_rec_onnx_infer.tar' })
export const OCR_MODEL_SHA256 = Object.freeze({
  det: 'ff6ab415b0a6e0c488550f2fb5d5046f1719848df220b2dc21b56402a65bc05d',
  rec: 'd267ab077a44a0eedb1ea8f8c542d263f211de8e9d7a029bf9fcfff7e5a88fb1',
})
// モデルのファイルの大きさ（バイト）。初回の読み込みの進み具合に使う。
export const OCR_MODEL_BYTES = Object.freeze({ det: 1792000, rec: 21319680 })
