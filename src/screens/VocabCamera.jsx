import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useAuth } from '../store/useAuth.js'
import { ALL_WORDS } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { matchOcrTextToWords, normalizeOcrToken } from '../lib/vocabOcr.js'
import { requestWords } from '../lib/wordRequests.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Card, Chip, ProgressBar } from '../components/ui.jsx'
import { Check, Close, Refresh, Sparkles, Upload } from '../components/Icons.jsx'

const MAX_FILE_BYTES = 20 * 1024 * 1024
const MAX_OCR_DIMENSION = 2200

const STATUS_LABELS = {
  'loading tesseract core': '文字認識エンジンを準備中…',
  'initializing tesseract': '文字認識エンジンを起動中…',
  'loading language traineddata': '英語の認識データを読み込み中…',
  'initializing api': '英単語の読み取りを準備中…',
  'recognizing text': '教科書の文字を読み取り中…',
}

const STATUS_PROGRESS = {
  'loading tesseract core': [0.04, 0.16],
  'initializing tesseract': [0.16, 0.24],
  'loading language traineddata': [0.24, 0.48],
  'initializing api': [0.48, 0.56],
  'recognizing text': [0.56, 0.98],
}

function ocrProgress(message) {
  const [start, end] = STATUS_PROGRESS[message.status] ?? [0.02, 0.08]
  return start + (end - start) * (Number(message.progress) || 0)
}

async function prepareImageForOcr(file) {
  if (typeof createImageBitmap !== 'function') return file

  let bitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    bitmap = await createImageBitmap(file)
  }

  try {
    const largestSide = Math.max(bitmap.width, bitmap.height)
    const scale =
      largestSide > MAX_OCR_DIMENSION
        ? MAX_OCR_DIMENSION / largestSide
        : largestSide < 1200
          ? Math.min(2, 1600 / largestSide)
          : 1
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return file
    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.drawImage(bitmap, 0, 0, width, height)

    return await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob ?? file), 'image/jpeg', 0.92)
    })
  } finally {
    bitmap.close?.()
  }
}

export function VocabCameraScreen() {
  const back = useStore((state) => state.back)
  const myList = useStore((state) => state.myList)
  const addManyToMyList = useStore((state) => state.addManyToMyList)
  const user = useAuth((state) => state.user)
  const cameraInput = useRef(null)
  const photoInput = useRef(null)
  const previewUrlRef = useRef('')
  const workerRef = useRef(null)
  const mountedRef = useRef(true)

  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [ocrText, setOcrText] = useState('')
  const [textChanged, setTextChanged] = useState(false)
  const [summary, setSummary] = useState(null)
  const [selected, setSelected] = useState(() => new Set())
  const [selectedRequests, setSelectedRequests] = useState(() => new Set())
  const [requestedWords, setRequestedWords] = useState(() => new Set())
  const [requesting, setRequesting] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [requestedCount, setRequestedCount] = useState(0)
  const [addedCount, setAddedCount] = useState(0)

  useEffect(() => () => {
    mountedRef.current = false
    workerRef.current?.terminate()
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }, [])

  const applyMatches = (text) => {
    const next = matchOcrTextToWords(text, ALL_WORDS)
    const saved = new Set(myList)
    setSummary(next)
    setSelected(new Set(next.candidates.filter((item) => !saved.has(item.id)).map((item) => item.id)))
    setSelectedRequests(new Set(next.unmatched.map((item) => item.token)))
    setRequestedWords(new Set())
    setRequestedCount(0)
    setRequestError('')
    setTextChanged(false)
    setAddedCount(0)
  }

  const onPickImage = (event) => {
    const nextFile = event.target.files?.[0]
    event.target.value = ''
    if (!nextFile) return
    if (!nextFile.type.startsWith('image/') && !/\.(heic|heif|jpe?g|png|webp)$/i.test(nextFile.name)) {
      setError('画像ファイルを選んでください。')
      return
    }
    if (nextFile.size > MAX_FILE_BYTES) {
      setError('画像が大きすぎます。20MB以下の写真を選んでください。')
      return
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const nextUrl = URL.createObjectURL(nextFile)
    previewUrlRef.current = nextUrl
    setFile(nextFile)
    setPreviewUrl(nextUrl)
    setError('')
    setOcrText('')
    setSummary(null)
    setSelected(new Set())
    setSelectedRequests(new Set())
    setRequestedWords(new Set())
    setRequestedCount(0)
    setRequestError('')
    setAddedCount(0)
    setProgress(0)
    setStatus('')
  }

  const scanImage = async () => {
    if (!file || scanning) return
    setScanning(true)
    setError('')
    setProgress(0.02)
    setStatus('写真を読み込んでいます…')
    setOcrText('')
    setSummary(null)
    setAddedCount(0)

    let worker
    try {
      const image = await prepareImageForOcr(file)
      if (!mountedRef.current) return

      setStatus('文字認識エンジンを準備中…')
      const { createWorker, OEM, PSM } = await import('tesseract.js')
      worker = await createWorker('eng', OEM.LSTM_ONLY, {
        logger: (message) => {
          if (!mountedRef.current) return
          setStatus(STATUS_LABELS[message.status] ?? '英単語を読み取り中…')
          setProgress((current) => Math.max(current, ocrProgress(message)))
        },
      })
      workerRef.current = worker
      if (!mountedRef.current) return

      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO,
        preserve_interword_spaces: '1',
      })
      const result = await worker.recognize(image)
      if (!mountedRef.current) return

      const text = result.data.text.trim()
      setProgress(1)
      setStatus('読み取りが完了しました')
      setOcrText(text)
      applyMatches(text)
    } catch (reason) {
      console.warn('textbook OCR failed', reason)
      if (mountedRef.current) {
        setError('文字を読み取れませんでした。通信を確認するか、明るく正面から撮り直してください。')
        setStatus('')
        setProgress(0)
      }
    } finally {
      if (worker) {
        await worker.terminate().catch(() => {})
        if (workerRef.current === worker) workerRef.current = null
      }
      if (mountedRef.current) setScanning(false)
    }
  }

  const toggleCandidate = (id) => {
    if (myList.includes(id)) return
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllNew = () => {
    if (!summary) return
    const saved = new Set(myList)
    setSelected(new Set(summary.candidates.filter((item) => !saved.has(item.id)).map((item) => item.id)))
  }

  const addSelected = () => {
    const ids = [...selected].filter((id) => !myList.includes(id))
    if (!ids.length) return
    addManyToMyList(ids)
    setSelected(new Set())
    setAddedCount(ids.length)
  }

  const toggleRequest = (token) => {
    if (requestedWords.has(token)) return
    setSelectedRequests((current) => {
      const next = new Set(current)
      if (next.has(token)) next.delete(token)
      else next.add(token)
      return next
    })
  }

  const sendRequests = async () => {
    if (!summary || !selectedRequests.size || requesting) return
    const items = summary.unmatched.filter((item) => selectedRequests.has(item.token))
    if (!items.length) return
    setRequesting(true)
    setRequestError('')
    try {
      const result = await requestWords(items.map((item) => item.q), user, {
        source: 'camera-ocr',
      })
      if (result.sent !== items.length) throw new Error('request count mismatch')
      setRequestedWords((current) => new Set([...current, ...items.map((item) => item.token)]))
      setSelectedRequests(new Set())
      setRequestedCount(result.sent)
    } catch (reason) {
      console.warn('camera OCR word requests failed', reason)
      setRequestError('送信できませんでした。通信環境を確認して、もう一度お試しください。')
    } finally {
      setRequesting(false)
    }
  }

  const newCandidateCount = summary?.candidates.filter((item) => !myList.includes(item.id)).length ?? 0
  const pendingRequestCount = summary?.unmatched.filter((item) => !requestedWords.has(item.token)).length ?? 0

  return (
    <div className="pb-8">
      <ScreenHeader title="教科書から単語を追加" subtitle="撮影した写真から英単語を読み取る" />

      <div className="space-y-4 px-4">
        <Card className="overflow-hidden p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-2xl">
              📷
            </div>
            <div>
              <h2 className="font-display font-extrabold text-ink">教科書をまっすぐ撮影</h2>
              <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">
                ページの英語部分を画面いっぱいに入れると、読み取りやすくなります。
              </p>
            </div>
          </div>

          {previewUrl ? (
            <div className="overflow-hidden rounded-2xl bg-ink/5 ring-1 ring-ink/10">
              <img
                src={previewUrl}
                alt="読み取る教科書の写真"
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
            onChange={onPickImage}
          />
          <input
            ref={photoInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickImage}
          />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              size="sm"
              disabled={scanning}
              onClick={() => cameraInput.current?.click()}
            >
              <span aria-hidden="true">📷</span> {previewUrl ? '撮り直す' : 'カメラで撮る'}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={scanning}
              onClick={() => photoInput.current?.click()}
            >
              <Upload size={16} /> 写真を選ぶ
            </Button>
          </div>

          {file && !summary && (
            <Button full className="mt-3" disabled={scanning} onClick={scanImage}>
              {scanning ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                  読み取り中
                </>
              ) : (
                <>
                  <Sparkles size={18} /> 英単語を読み取る
                </>
              )}
            </Button>
          )}

          {scanning && (
            <div className="mt-4 rounded-2xl bg-brand-50 p-3 ring-1 ring-brand-100">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-extrabold text-brand-800">{status}</p>
                <span className="shrink-0 text-xs font-extrabold tabular-nums text-brand-700">
                  {Math.round(progress * 100)}%
                </span>
              </div>
              <ProgressBar value={progress} />
              <p className="mt-2 text-[11px] font-bold text-brand-700/60">
                初回は英語の認識データを準備するため、少し時間がかかります。
              </p>
            </div>
          )}

          {error && (
            <div role="alert" className="mt-3 rounded-2xl bg-rose-50 p-3 text-xs font-bold leading-relaxed text-rose-600 ring-1 ring-rose-100">
              {error}
            </div>
          )}
        </Card>

        {summary && (
          <>
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display font-extrabold text-ink">
                    {summary.candidates.length}語が辞書と一致
                  </h2>
                  <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">
                    読み取った {summary.tokenCount} 語のうち、辞書にある単語を候補にしました。
                    意味を確認して追加する語を選んでください。
                  </p>
                </div>
              </div>

              <label className="mt-4 block text-xs font-extrabold text-ink/70" htmlFor="ocr-text">
                読み取った文字（誤読は修正できます）
              </label>
              <textarea
                id="ocr-text"
                value={ocrText}
                onChange={(event) => {
                  setOcrText(event.target.value)
                  setTextChanged(true)
                }}
                className="mt-1.5 h-28 w-full resize-y rounded-2xl bg-paper p-3 text-sm font-bold leading-relaxed text-ink ring-1 ring-ink/10 focus:outline-none focus:ring-2 focus:ring-brand-300"
                placeholder="読み取った英文がここに表示されます"
              />
              {textChanged && (
                <Button
                  full
                  size="sm"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => applyMatches(ocrText)}
                >
                  <Refresh size={16} /> 修正した文字で候補を更新
                </Button>
              )}
            </Card>

            {summary.candidates.length > 0 ? (
              <section aria-labelledby="ocr-candidates-title">
                <div className="mb-2 flex items-end justify-between gap-3 px-1">
                  <div>
                    <h2 id="ocr-candidates-title" className="font-display text-lg font-extrabold text-ink">
                      追加する単語
                    </h2>
                    <p className="text-xs font-bold text-ink/45">
                      新規 {newCandidateCount}語・選択中 {selected.size}語
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={selectAllNew}
                      className="rounded-xl px-2.5 py-2 text-xs font-extrabold text-brand-700 active:bg-brand-100"
                    >
                      すべて選択
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelected(new Set())}
                      className="rounded-xl px-2.5 py-2 text-xs font-extrabold text-ink/45 active:bg-ink/5"
                    >
                      解除
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {summary.candidates.map((item) => {
                    const level = getLevel(item.level)
                    const saved = myList.includes(item.id)
                    const checked = saved || selected.has(item.id)
                    const observed = item.observed
                      .filter((surface) => normalizeOcrToken(surface) !== normalizeOcrToken(item.headword))
                      .join('・')
                    return (
                      <label
                        key={item.id}
                        className={`flex min-h-16 items-center gap-3 rounded-2xl p-3 shadow-sm ring-1 ${
                          saved
                            ? 'bg-amber-50/80 ring-amber-100'
                            : checked
                              ? 'bg-white ring-brand-200'
                              : 'bg-white/60 ring-ink/5'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={saved}
                          onChange={() => toggleCandidate(item.id)}
                          className="h-5 w-5 shrink-0 accent-indigo-600"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-display text-base font-extrabold text-ink">
                              {item.headword}
                            </span>
                            <Chip color={level.color}>{level.label}</Chip>
                            {item.occurrences > 1 && (
                              <span className="text-[11px] font-extrabold text-ink/35">
                                {item.occurrences}回
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block text-xs font-bold text-ink/55">
                            {item.meaning}
                          </span>
                          {observed && (
                            <span className="mt-0.5 block text-[11px] font-bold text-brand-600">
                              {observed} → {item.headword}
                            </span>
                          )}
                        </span>
                        {saved && (
                          <span className="shrink-0 text-[11px] font-extrabold text-amber-700">
                            追加済み
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>

                <div className="sticky bottom-3 z-10 mt-4 rounded-3xl bg-paper/90 p-2 shadow-xl backdrop-blur">
                  <Button full disabled={!selected.size} onClick={addSelected}>
                    <Check size={18} /> 選んだ {selected.size}語をマイ単語に追加
                  </Button>
                </div>
              </section>
            ) : (
              <Card className="p-5 text-center">
                <div className="text-4xl">🔎</div>
                <h2 className="mt-2 font-display font-extrabold text-ink">マイ単語へ追加できる語はありませんでした</h2>
                <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
                  上の文字を修正するか、下の未登録語を確認して辞書登録をリクエストできます。
                </p>
              </Card>
            )}

            {summary.unmatched.length > 0 && (
              <section aria-labelledby="ocr-requests-title">
                <Card className="border-2 border-sky-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xl">
                      📩
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 id="ocr-requests-title" className="font-display font-extrabold text-ink">
                        辞書にない単語
                      </h2>
                      <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">
                        選んだ語だけを辞書登録リクエストへ送ります。
                        写真や教科書の本文は送信しません。誤読や人名は選択から外してください。
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-xs font-bold text-ink/45">
                      未送信 {pendingRequestCount}語・選択中 {selectedRequests.size}語
                    </p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedRequests(new Set(
                          summary.unmatched
                            .filter((item) => !requestedWords.has(item.token))
                            .map((item) => item.token),
                        ))}
                        className="rounded-xl px-2.5 py-2 text-xs font-extrabold text-sky-700 active:bg-sky-50"
                      >
                        すべて選択
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRequests(new Set())}
                        className="rounded-xl px-2.5 py-2 text-xs font-extrabold text-ink/45 active:bg-ink/5"
                      >
                        解除
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {summary.unmatched.map((item) => {
                      const sent = requestedWords.has(item.token)
                      return (
                        <label
                          key={item.token}
                          className={`flex min-h-12 items-center gap-2 rounded-xl p-2.5 ring-1 ${
                            sent
                              ? 'bg-emerald-50 ring-emerald-100'
                              : selectedRequests.has(item.token)
                                ? 'bg-sky-50 ring-sky-200'
                                : 'bg-paper ring-ink/10'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={sent || selectedRequests.has(item.token)}
                            disabled={sent}
                            onChange={() => toggleRequest(item.token)}
                            className="h-4 w-4 shrink-0 accent-sky-600"
                          />
                          <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-ink">
                            {item.q}
                          </span>
                          {item.occurrences > 1 && (
                            <span className="shrink-0 text-[10px] font-extrabold text-ink/35">
                              {item.occurrences}回
                            </span>
                          )}
                          {sent && (
                            <span className="shrink-0 text-[10px] font-extrabold text-emerald-700">
                              送信済み
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>

                  {requestedCount > 0 && (
                    <p className="mt-3 rounded-xl bg-emerald-50 p-2.5 text-center text-xs font-extrabold text-emerald-700">
                      {requestedCount}語を送信しました。
                    </p>
                  )}
                  {requestError && (
                    <p role="alert" className="mt-3 rounded-xl bg-rose-50 p-2.5 text-xs font-bold text-rose-600">
                      {requestError}
                    </p>
                  )}
                  <Button
                    full
                    className="mt-3"
                    variant="secondary"
                    disabled={!selectedRequests.size || requesting}
                    onClick={sendRequests}
                  >
                    📩 {requesting
                      ? '送信中…'
                      : `選んだ ${selectedRequests.size}語を送る`}
                  </Button>
                </Card>
              </section>
            )}
          </>
        )}

        {addedCount > 0 && (
          <Card className="border-2 border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={21} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-extrabold text-emerald-800">
                  {addedCount}語を追加しました
                </p>
                <p className="text-xs font-bold text-emerald-700/70">
                  いつものマイ単語学習とクイズで復習できます。
                </p>
              </div>
            </div>
            <Button full className="mt-3" variant="success" onClick={back}>
              マイ単語を見る
            </Button>
          </Card>
        )}

        {!summary && !scanning && (
          <div className="rounded-2xl bg-white/60 p-3 text-xs font-bold leading-relaxed text-ink/50">
            <p className="font-extrabold text-ink/65">きれいに読み取るコツ</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>ページとカメラを平行にして、影や光の反射を避ける</li>
              <li>英語部分が小さいときは、近づいて数段落ずつ撮る</li>
              <li>追加前に候補と日本語の意味を必ず確認する</li>
            </ul>
          </div>
        )}

        {summary && (
          <Button
            full
            variant="ghost"
            onClick={() => {
              setSummary(null)
              setOcrText('')
              setSelected(new Set())
              setSelectedRequests(new Set())
              setRequestedWords(new Set())
              setRequestedCount(0)
              setRequestError('')
              setAddedCount(0)
            }}
          >
            <Close size={17} /> この結果を閉じる
          </Button>
        )}
      </div>
    </div>
  )
}
