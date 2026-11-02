import { useEffect, useRef, useState } from 'react'
import { loadEnglishTagger } from '../lib/ocrContext.js'
import { loadEnglishWordSet } from '../lib/englishWordList.js'
import { startOcrPage, takeOcrResult } from '../lib/ocrPageBridge.js'
import { useStore } from '../store/useStore.js'
import { Button, ProgressBar } from './ui.jsx'
import { Sparkles, Upload } from './Icons.jsx'

// 写真の文字を読み取る部品。「教科書から単語追加」（VocabCamera.jsx）と自作カードの「写真から作る」が同じものを使う。
// 写真を選ぶ（カメラで撮る・写真を選ぶ）→ 読み取り専用のページ（ocr.html）で読む → 戻ってくる、までを受け持ち、
// 読んだ結果をどう使うか（辞書と照らす・カードの候補にする）は画面が決める。

const MAX_FILE_BYTES = 20 * 1024 * 1024

/**
 * 写真を選んで読む。key は画面の名前（結果の受け取り先）、readingStatus は読んでいる間の知らせ。
 * scan(resume) で読み取り専用のページへ移る（アプリはいったん閉じる）。読み終えて戻ると、onRead(read, resume) を呼ぶ。
 * read は { text, page, englishWords, tagger }（page は ocrEngine.js の行と語、englishWords は実在する英単語の表、
 * tagger は英文の品詞を決める道具）、resume は scan に渡した、画面の選びを戻すための値。
 */
export function usePhotoOcr({ key, readingStatus = '写真の文字を読み取り中…', onRead }) {
  const previewUrlRef = useRef('')
  const mountedRef = useRef(true)
  const takenRef = useRef(false)
  const onReadRef = useRef(onRead)
  onReadRef.current = onRead
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const showFile = (nextFile) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const nextUrl = URL.createObjectURL(nextFile)
    previewUrlRef.current = nextUrl
    setFile(nextFile)
    setPreviewUrl(nextUrl)
  }

  const failed = () => {
    setError('文字を読み取れませんでした。通信を確認するか、明るく正面から撮り直してください。')
    setStatus('')
    setProgress(0)
  }

  // 読み取りから戻ってきたら、結果を受け取る。実在する英単語かを確かめる単語表と、文脈で読み分ける品詞の道具はここで読み込む。
  const receive = async (result) => {
    showFile(result.file)
    if (result.cancelled) return
    if (result.failed) {
      failed()
      return
    }
    setScanning(true)
    setStatus('読み取った文字を整えています…')
    setProgress(0.9)
    try {
      const [englishWords, tagger] = await Promise.all([loadEnglishWordSet(), loadEnglishTagger()])
      if (!mountedRef.current) return
      setProgress(1)
      setStatus('読み取りが完了しました')
      onReadRef.current?.({ text: result.page.text.trim(), page: result.page, englishWords, tagger }, result.resume)
    } catch (reason) {
      console.warn('photo OCR failed', reason)
      if (mountedRef.current) failed()
    } finally {
      if (mountedRef.current) setScanning(false)
    }
  }

  // 開発版の StrictMode は effect を「付ける→外す→付ける」と2回走らせるので、付けるたびに true へ戻す。
  useEffect(() => {
    mountedRef.current = true
    if (!takenRef.current) {
      takenRef.current = true
      takeOcrResult(key).then((result) => {
        if (result && mountedRef.current) receive(result)
      })
    }
    return () => {
      mountedRef.current = false
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

    showFile(nextFile)
    setError('')
    setProgress(0)
    setStatus('')
    return true
  }

  const scan = async (resume) => {
    if (!file || scanning) return
    setScanning(true)
    setError('')
    setProgress(0.02)
    setStatus('写真を読み込んでいます…')
    try {
      const { screen, params, stack } = useStore.getState()
      await startOcrPage({
        key,
        file,
        readingStatus,
        returnUrl: location.href,
        navigation: JSON.parse(JSON.stringify({ screen, params, stack })),
        resume,
      })
    } catch (reason) {
      console.warn('photo OCR failed', reason)
      setScanning(false)
      failed()
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
