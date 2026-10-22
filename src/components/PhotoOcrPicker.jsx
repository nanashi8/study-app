import { useEffect, useRef, useState } from 'react'
import { createOcrReader } from '../lib/ocrEngine.js'
import { loadEnglishTagger } from '../lib/ocrContext.js'
import { loadEnglishWordSet } from '../lib/englishWordList.js'
import { prepareImageForOcr } from '../lib/ocrImage.js'
import { Button, ProgressBar } from './ui.jsx'
import { Sparkles, Upload } from './Icons.jsx'

// 写真の文字を読み取る部品。「教科書から単語追加」（VocabCamera.jsx）と自作カードの「写真から作る」が同じものを使う。
// 写真を選ぶ（カメラで撮る・写真を選ぶ）→ 読み取りエンジン（PaddleOCR）を準備する → 読む、までを受け持ち、
// 読んだ結果をどう使うか（辞書と照らす・カードの候補にする）は画面が決める。

const MAX_FILE_BYTES = 20 * 1024 * 1024

// 読み取りの進み具合。エンジンの準備（初回はモデルの読み込み）の間は、読み込んだ量で進める。
const PREPARE_PROGRESS = [0.05, 0.6]
const READ_PROGRESS = 0.7

/**
 * 写真を選んで読む。readingStatus は読んでいる間の知らせ。
 * scan() は読み終えたら { text, page, englishWords, tagger }（page は ocrEngine.js の行と語、englishWords は実在する英単語の表、
 * tagger は英文の品詞を決める道具）を返し、読めなかったときと画面を離れたときは null を返す。
 */
export function usePhotoOcr({ readingStatus = '写真の文字を読み取り中…' } = {}) {
  const previewUrlRef = useRef('')
  // 読み取りエンジン（PaddleOCR）。最初の読み取りで作り、同じ画面で2枚目からは使い回す。画面を離れたら片付ける。
  const readerRef = useRef(null)
  const mountedRef = useRef(true)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  // 画面が出ているあいだだけ、読み取りの結果を画面へ書く。開発版の StrictMode は effect を「付ける→外す→付ける」と
  // 2回走らせるので、付けるたびに true へ戻す（戻さないと読み取りが写真の読み込みの直後で止まる）。
  useEffect(() => {
    mountedRef.current = true
    readerRef.current = null
    return () => {
      mountedRef.current = false
      readerRef.current?.then((reader) => reader.dispose()).catch(() => {})
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  /** 写真を選んだとき（input の onChange）。新しい写真に替えたら true。 */
  const pickImage = (event) => {
    const nextFile = event.target.files?.[0]
    event.target.value = ''
    if (!nextFile) return false
    if (!nextFile.type.startsWith('image/') && !/\.(heic|heif|jpe?g|png|webp)$/i.test(nextFile.name)) {
      setError('画像ファイルを選んでください。')
      return false
    }
    if (nextFile.size > MAX_FILE_BYTES) {
      setError('画像が大きすぎます。20MB以下の写真を選んでください。')
      return false
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const nextUrl = URL.createObjectURL(nextFile)
    previewUrlRef.current = nextUrl
    setFile(nextFile)
    setPreviewUrl(nextUrl)
    setError('')
    setProgress(0)
    setStatus('')
    return true
  }

  const scan = async () => {
    if (!file || scanning) return null
    setScanning(true)
    setError('')
    setProgress(0.02)
    setStatus('写真を読み込んでいます…')

    // 実在する英単語かを確かめる単語表と、文脈で読み分ける品詞の道具は、写真の下ごしらえと並べて読み込む。
    const englishWordsLoading = loadEnglishWordSet()
    englishWordsLoading.catch(() => {})
    const taggerLoading = loadEnglishTagger()
    taggerLoading.catch(() => {})
    try {
      const image = await prepareImageForOcr(file)
      if (!mountedRef.current) return null

      setStatus('文字認識エンジンを準備中…')
      setProgress(PREPARE_PROGRESS[0])
      readerRef.current ??= import('@paddleocr/paddleocr-js').then((paddle) => createOcrReader(paddle, {
        // 初回はモデル（約 23MB）を読み込むので、読み込んだ量で進み具合を出す。2回目からは端末に残ったものを使う。
        onDownload: (fraction) => {
          if (!mountedRef.current) return
          setStatus('英語と日本語の認識データを読み込み中…')
          setProgress((current) => Math.max(current, PREPARE_PROGRESS[0] + (PREPARE_PROGRESS[1] - PREPARE_PROGRESS[0]) * fraction))
        },
      }))
      readerRef.current.catch(() => {
        readerRef.current = null
      })
      const reader = await readerRef.current
      if (!mountedRef.current) return null

      setStatus(readingStatus)
      setProgress(READ_PROGRESS)
      const [page, englishWords, tagger] = await Promise.all([reader.read(image), englishWordsLoading, taggerLoading])
      if (!mountedRef.current) return null

      setProgress(1)
      setStatus('読み取りが完了しました')
      return { text: page.text.trim(), page, englishWords, tagger }
    } catch (reason) {
      console.warn('photo OCR failed', reason)
      if (mountedRef.current) {
        setError('文字を読み取れませんでした。通信を確認するか、明るく正面から撮り直してください。')
        setStatus('')
        setProgress(0)
      }
      return null
    } finally {
      if (mountedRef.current) setScanning(false)
    }
  }

  return { file, previewUrl, scanning, progress, status, error, pickImage, scan }
}

/**
 * 写真のプレビュー・「カメラで撮る」「写真を選ぶ」・読み取るボタン・進み具合・読めなかった知らせ。
 *   ocr        usePhotoOcr の戻り値
 *   onPicked   新しい写真を選んだとき（前の結果を消す）
 *   onRead     読み取るボタン（showRead のときだけ出す）
 */
export function PhotoOcrPicker({ ocr, onPicked, onRead, showRead, readLabel, previewAlt = '読み取る写真' }) {
  const cameraInput = useRef(null)
  const photoInput = useRef(null)
  const pick = (event) => {
    if (ocr.pickImage(event)) onPicked?.()
  }
  return (
    <>
      {ocr.previewUrl ? (
        <div className="overflow-hidden rounded-2xl bg-ink/5 ring-1 ring-ink/10">
          <img
            src={ocr.previewUrl}
            alt={previewAlt}
            className="max-h-72 w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/60 px-6 text-center">
          <div>
            <div className="text-5xl">📖</div>
            <p className="mt-3 text-sm font-extrabold text-brand-800">写真はまだ選ばれていません</p>
            <p className="mt-1 text-xs font-bold text-brand-700/60">
              写真は端末内で処理し、保存・送信しません
            </p>
          </div>
        </div>
      )}

      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={pick}
      />
      <input
        ref={photoInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={pick}
      />

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          size="sm"
          disabled={ocr.scanning}
          onClick={() => cameraInput.current?.click()}
        >
          <span aria-hidden="true">📷</span> {ocr.previewUrl ? '撮り直す' : 'カメラで撮る'}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={ocr.scanning}
          onClick={() => photoInput.current?.click()}
        >
          <Upload size={16} /> 写真を選ぶ
        </Button>
      </div>

      {showRead && (
        <Button full className="mt-3" disabled={ocr.scanning} onClick={onRead}>
          {ocr.scanning ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
              読み取り中
            </>
          ) : (
            <>
              <Sparkles size={18} /> {readLabel}
            </>
          )}
        </Button>
      )}

      {ocr.scanning && (
        <div className="mt-4 rounded-2xl bg-brand-50 p-3 ring-1 ring-brand-100">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-extrabold text-brand-800">{ocr.status}</p>
            <span className="shrink-0 text-xs font-extrabold tabular-nums text-brand-700">
              {Math.round(ocr.progress * 100)}%
            </span>
          </div>
          <ProgressBar value={ocr.progress} />
          <p className="mt-2 text-[11px] font-bold text-brand-700/60">
            初回は英語と日本語の認識データを準備するため、少し時間がかかります。
          </p>
        </div>
      )}

      {ocr.error && (
        <div role="alert" className="mt-3 rounded-2xl bg-rose-50 p-3 text-xs font-bold leading-relaxed text-rose-600 ring-1 ring-rose-100">
          {ocr.error}
        </div>
      )}
    </>
  )
}
