import { useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { QRCodeCanvas } from 'qrcode.react'
import { useStore } from '../store/useStore.js'
import { encodeProgress, selectProgressState } from '../lib/progressCode.js'
import { Button } from './ui.jsx'
import { Check, Download, Share } from './Icons.jsx'

// QRコードに収まる上限の目安（バイト／英数字混在で安全側）。
// 超えた場合もコード文字列では必ず保存できる。
export const PROGRESS_QR_MAX = 2800

const CAN_SHARE_IMAGE =
  typeof navigator !== 'undefined' && !!navigator.canShare

export function ProgressBackupPanel({
  progressState,
  onContinue,
  continueLabel = 'スタディアプリ ホームへ戻る',
}) {
  const storedProgress = useStore(useShallow(selectProgressState))
  const full = progressState ?? storedProgress
  const code = useMemo(() => encodeProgress(full), [full])
  const shareUrl = useMemo(
    () => `${location.origin}${location.pathname}#code=${code}`,
    [code],
  )
  const qrFits = shareUrl.length <= PROGRESS_QR_MAX
  const qrWrap = useRef(null)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const saveQr = async () => {
    setError('')
    const canvas = qrWrap.current?.querySelector('canvas')
    if (!canvas) return
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) return
    const file = new File([blob], 'study-app-progress-qr.png', { type: 'image/png' })

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'スタディアプリの学習記録',
          text: 'このQRコードを読み取ると、保存時点の学習記録を復元できます。',
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 1800)
      } catch {
        // 共有シートを本人が閉じた場合は、意図しないダウンロードを始めない。
      }
      return
    }

    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'study-app-progress-qr.png'
    anchor.click()
    URL.revokeObjectURL(url)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const copyCode = async () => {
    setError('')
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setError('コピーに失敗しました。コード欄を長押ししてコピーしてください。')
    }
  }

  return (
    <section data-progress-backup-output>
      <div className="mb-1 flex items-center gap-2 text-brand-600">
        <Download size={18} />
        <h2 className="font-display text-base font-extrabold">進捗を保存</h2>
      </div>
      <p className="mb-3 text-xs font-bold leading-relaxed text-ink/50">
        ここまでに確定した学習結果をQR画像またはコードで保存できます。どちらも同じ進捗を復元します。
      </p>

      {qrFits ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 ring-1 ring-brand-100">
          <div ref={qrWrap} className="rounded-xl bg-white p-2">
            <QRCodeCanvas value={shareUrl} size={180} level="L" includeMargin marginSize={2} />
          </div>
          <Button className="mt-1" variant={saved ? 'success' : 'secondary'} onClick={saveQr}>
            {saved ? (
              <><Check size={18} /> 保存しました</>
            ) : CAN_SHARE_IMAGE ? (
              <><Share size={18} /> QR画像を保存</>
            ) : (
              <><Download size={18} /> QR画像を保存</>
            )}
          </Button>
          <p className="text-center text-[11px] font-bold leading-relaxed text-ink/40">
            写真またはファイルに残すと、別端末から読み取って再開できます。
          </p>
        </div>
      ) : (
        <p className="rounded-2xl bg-amber-50 p-3 text-center text-xs font-bold text-amber-700 ring-1 ring-amber-100">
          進捗が大きいためQR画像にはできません。下のコードを保存してください。
        </p>
      )}

      <textarea
        readOnly
        value={code}
        onFocus={(event) => event.target.select()}
        aria-label="現在の進捗コード"
        className="mt-3 h-24 w-full resize-none rounded-2xl bg-paper p-3 font-mono text-xs text-ink/70 ring-1 ring-brand-100"
      />
      <Button full className="mt-2" variant={copied ? 'success' : 'primary'} onClick={copyCode}>
        {copied ? <><Check size={18} /> コピーしました</> : 'コードをコピー'}
      </Button>
      {error && <p className="mt-2 text-xs font-bold text-rose-500">{error}</p>}

      {onContinue && (
        <Button full className="mt-4" variant="secondary" onClick={onContinue}>
          {continueLabel}
        </Button>
      )}
    </section>
  )
}
