// 写真の読み取りに使う PaddleOCR のモデルの名前・ファイル・中身の指紋（sha256）。
// 画面（ocrEngine.js）と、モデルを取り込んで公開版に入れる道具（scripts/ocr-models.mjs・vite.config.js）が同じ表を使う。
export const OCR_MODEL_NAMES = Object.freeze({ det: 'PP-OCRv6_tiny_det', rec: 'PP-OCRv6_small_rec' })
// 配布元のファイル（tar）。取り込むときに sha256 を確かめる。
export const OCR_MODEL_FILES = Object.freeze({ det: 'PP-OCRv6_tiny_det_onnx_infer.tar', rec: 'PP-OCRv6_small_rec_onnx_infer.tar' })
export const OCR_MODEL_SHA256 = Object.freeze({
  det: 'ff6ab415b0a6e0c488550f2fb5d5046f1719848df220b2dc21b56402a65bc05d',
  rec: 'd267ab077a44a0eedb1ea8f8c542d263f211de8e9d7a029bf9fcfff7e5a88fb1',
})
// 公開版で配るファイル（scripts/ocr-models.mjs の ocrServedFiles が tar から作る）。端末で tar を開いたりモデルを書き足したりすると、
// 21MB の写しが何枚もでき、読み取りの前からメモリを食う（2026-11-03）。ビルドのときに済ませておく。
// - det：検出モデル（.onnx）
// - rec：認識モデルの最後に「最も確かな1字」（TopK）を足したもの（ocrPipeline.js の withTopOutput）
// - chars：認識の字の一覧（JSON）
// 名前に配布元の指紋を入れるので、モデルを変えると名前が変わり、端末に置いた古いものは使われない。
export const OCR_SERVED_FILES = Object.freeze({
  det: `ocr-det-${OCR_MODEL_SHA256.det.slice(0, 8)}.onnx`,
  rec: `ocr-rec-${OCR_MODEL_SHA256.rec.slice(0, 8)}-top1.onnx`,
  chars: `ocr-chars-${OCR_MODEL_SHA256.rec.slice(0, 8)}.json`,
})
// 配るファイルの大きさ（バイト）。初回の読み込みの進み具合に使う（tests/ocr-pipeline.test.mjs が実物と照らす）。
export const OCR_SERVED_BYTES = Object.freeze({ det: 1780590, rec: 21159536, chars: 112367 })
