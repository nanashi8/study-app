import { useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { QRCodeCanvas } from 'qrcode.react'
import jsQR from 'jsqr'
import { useStore } from '../store/useStore.js'
import { LEVELS } from '../data/levels.js'
import { getWord } from '../data/vocab.js'
import { levelProgress, overallProgress } from '../lib/session.js'
import { encodeProgress, decodeProgress, summarizePayload } from '../lib/progressCode.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { LearningAnalyticsPanel } from '../components/LearningAnalytics.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { Card, Button, ProgressBar } from '../components/ui.jsx'
import { Star, Flame, Trophy, Download, Upload, Check, Share } from '../components/Icons.jsx'

// 画像ファイルを共有できる端末（主にスマホ）なら共有シート経由でアルバムに保存できる。
const CAN_SHARE_IMG = typeof navigator !== 'undefined' && !!navigator.canShare

// QRコードに収まる上限の目安（バイト/英数字混在で安全側）。これを超えたら
// QR化はあきらめてコード文字列のコピーに誘導する。
const QR_MAX = 2800

function Stat({ icon, value, label, color }) {
  return (
    <Card className="flex flex-1 flex-col items-center gap-1 p-3">
      <span style={{ color }}>{icon}</span>
      <span className="font-display text-xl font-extrabold text-ink">{value}</span>
      <span className="text-[11px] font-bold text-ink/45">{label}</span>
    </Card>
  )
}

export function ProgressScreen() {
  const srs = useStore((s) => s.srs)
  const myList = useStore((s) => s.myList)
  const stats = useStore((s) => s.stats)
  // 進捗コードは全データを持ち運ぶため、永続スライスをまとめて購読する。
  // useShallow で浅い比較にし、毎回新オブジェクト→再レンダーループを防ぐ。
  const full = useStore(useShallow((s) => ({
    srs: s.srs, kotenSrs: s.kotenSrs,
    kotenGrammarSrs: s.kotenGrammarSrs,
    kotenCultureSrs: s.kotenCultureSrs,
    kotenInterpretationSrs: s.kotenInterpretationSrs, myList: s.myList,
    myGrammarList: s.myGrammarList, writingProgress: s.writingProgress,
    kotenWordList: s.kotenWordList, kotenGrammarList: s.kotenGrammarList,
    kotenCultureList: s.kotenCultureList,
    readingsDone: s.readingsDone, mathDone: s.mathDone, mathMastery: s.mathMastery,
    skillStats: s.skillStats, learningAnalytics: s.learningAnalytics,
    diagnosticHistory: s.diagnosticHistory,
    diagnosticAttempt: s.diagnosticAttempt, diagnosticSeed: s.diagnosticSeed,
    engPos: s.engPos,
    portalOrder: s.portalOrder, portalHidden: s.portalHidden,
    stats: s.stats, settings: s.settings,
  })))
  const importCode = useStore((s) => s.importCode)

  const prog = overallProgress(srs)
  const code = useMemo(() => encodeProgress(full), [full])
  // QRはアプリURL＋コード。別端末でカメラ読み取り→アプリが開いて復元確認が出る。
  const shareUrl = useMemo(
    () => `${location.origin}${location.pathname}#code=${code}`,
    [code],
  )

  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null) // {summary} 確認シート
  const qrWrap = useRef(null)
  const fileInput = useRef(null)
  const qrFits = shareUrl.length <= QR_MAX
  const summarize = (payload) => summarizePayload(payload, (id) => !!getWord(id))

  // 保存したQR画像を選んで読み込む。画像をcanvasに描いてjsQRでデコード→
  // 中身（URL or 生コード）からEQ1-コードを取り出し、貼り付けたときと同じ
  // プレビュー確認フローに乗せる（勝手に上書きはしない）。
  const onPickQrImage = async (e) => {
    setError('')
    const file = e.target.files?.[0]
    e.target.value = '' // 同じ画像を続けて選べるようにクリア
    if (!file) return
    try {
      const bitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0)
      const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const result = jsQR(data, width, height)
      if (!result) {
        setError('画像からQRコードを読み取れませんでした。別の画像で試してください。')
        return
      }
      // QRの中身はURL（#code=EQ1-...）か、生のEQ1-コード。どちらからも取り出す。
      const m = result.data.match(/(EQ1-[^&\s]+)/)
      if (!m) {
        setError('このQRコードはえいごクエストの進捗コードではないようです。')
        return
      }
      const incoming = decodeURIComponent(m[1])
      const payload = decodeProgress(incoming)
      setInput(incoming)
      setPreview({ summary: summarize(payload) })
    } catch {
      setError('画像の読み込みに失敗しました。')
    }
  }

  // QRを画像（PNG）として保存。端末の「写真／ファイル」に残せば、機種変更や
  // 別端末でカメラ読み取り→続きから復元できる。
  // スマホ（特にiOS）は a.download だとアルバムに入らないため、対応端末では
  // Web Share API でファイル共有→「画像を保存」でカメラロールに入れられる。
  // 非対応端末（主にPCブラウザ）は従来どおりダウンロードにフォールバック。
  const saveQr = async () => {
    const canvas = qrWrap.current?.querySelector('canvas')
    if (!canvas) return
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'))
    if (!blob) return
    const file = new File([blob], 'eigo-quest-progress-qr.png', { type: 'image/png' })
    // 画像ファイルを共有できる端末なら共有シートを開く（「画像を保存」でアルバムへ）。
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'えいごクエストの学習記録',
          text: 'この画像（QRコード）をカメラで読み取ると続きから復元できます。',
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 1800)
        return
      } catch {
        // ユーザーがキャンセル→何もしない（ダウンロードに落とさない）。
        return
      }
    }
    // フォールバック：PNGをダウンロード（PCのダウンロードフォルダ等）。
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'eigo-quest-progress-qr.png'
    a.click()
    URL.revokeObjectURL(url)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setError('コピーに失敗しました。コードを長押しで選択してコピーしてください。')
    }
  }

  const tryLoad = () => {
    setError('')
    try {
      const payload = decodeProgress(input)
      setPreview({ summary: summarize(payload) })
    } catch (e) {
      setError(e.message || 'コードを読み込めませんでした。')
    }
  }

  const confirmLoad = () => {
    try {
      importCode(input)
      setPreview(null)
      setInput('')
      setError('')
    } catch (e) {
      setError(e.message || '復元に失敗しました。')
      setPreview(null)
    }
  }

  // QRのURL（#code=...）で開かれたら、そのコードを読み込んで復元確認を出す。
  // 勝手に上書きしないよう、必ずプレビュー→本人の確認を挟む。
  useEffect(() => {
    const m = location.hash.match(/[#&]code=(EQ1-[^&]+)/)
    if (!m) return
    const incoming = decodeURIComponent(m[1])
    // 再読み込みで再発火しないよう、ハッシュは消す。
    history.replaceState(null, '', location.pathname + location.search)
    try {
      const payload = decodeProgress(incoming)
      setInput(incoming)
      setPreview({ summary: summarize(payload) })
    } catch {
      /* 壊れたコードは無視（通常の画面のまま） */
    }
  }, [])

  return (
    <div className="pb-6">
      <ScreenHeader title="学習の記録" />

      <div className="space-y-5 px-4">
        {/* 統計 */}
        <div className="flex gap-3">
          <Stat icon={<Star size={22} />} value={stats.xp} label="XP" color="#f59e0b" />
          <Stat icon={<Flame size={22} />} value={`${stats.streak}日`} label="連続" color="#f43f5e" />
          <Stat icon={<Trophy size={22} />} value={prog.mastered} label="習得" color="#6366f1" />
        </div>

        <LearningAnalyticsPanel
          learningAnalytics={full.learningAnalytics}
          srs={srs}
          kotenSrs={full.kotenSrs}
          kotenGrammarSrs={full.kotenGrammarSrs}
          kotenCultureSrs={full.kotenCultureSrs}
          kotenInterpretationSrs={full.kotenInterpretationSrs}
          skillStats={full.skillStats}
          diagnosticHistory={full.diagnosticHistory}
          stats={stats}
          dueCount={prog.due}
        />

        {/* 級別の進捗 */}
        <Card className="p-4">
          <h2 className="mb-3 font-display text-base font-extrabold text-ink/80">級ごとの進捗</h2>
          <div className="space-y-2.5">
            {LEVELS.map((l) => {
              const p = levelProgress(l.id, srs)
              return (
                <div key={l.id}>
                  <div className="mb-1 flex justify-between text-xs font-bold">
                    <span className="text-ink/70">
                      {l.emoji} {l.label}
                    </span>
                    <span className="text-ink/40">
                      {p.mastered}/{p.total}
                    </span>
                  </div>
                  <ProgressBar value={p.total ? p.mastered / p.total : 0} color={l.color} />
                </div>
              )
            })}
          </div>
        </Card>

        {/* 進捗コード：発行 */}
        <Card className="p-4">
          <div className="mb-1 flex items-center gap-2 text-brand-600">
            <Download size={18} />
            <h2 className="font-display text-base font-extrabold">進捗コードを発行</h2>
          </div>
          <p className="mb-3 text-xs font-bold text-ink/50">
            ログインしなくても、これを保存しておけば別の端末や次回にそのまま続きから再開できます。
          </p>

          {/* QRコード：画像で保存→カメラで読み取って復元できる */}
          {qrFits ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 ring-1 ring-brand-100">
              <div ref={qrWrap} className="rounded-xl bg-white p-2">
                <QRCodeCanvas value={shareUrl} size={180} level="L" includeMargin marginSize={2} />
              </div>
              <Button className="mt-1" variant={saved ? 'success' : 'secondary'} onClick={saveQr}>
                {saved ? (
                  <><Check size={18} /> 保存しました</>
                ) : CAN_SHARE_IMG ? (
                  <><Share size={18} /> 画像をアルバムに保存</>
                ) : (
                  <><Download size={18} /> QRコードを画像で保存</>
                )}
              </Button>
              <p className="text-center text-[11px] font-bold text-ink/40">
                {CAN_SHARE_IMG
                  ? '共有メニューの「画像を保存」でカメラロールに残せます。'
                  : '画像を「写真／ファイル」に保存しておけば、'}
                <br />別端末でカメラで読み取る→アプリが開いて続きから復元できます。
              </p>
            </div>
          ) : (
            <p className="rounded-2xl bg-amber-50 p-3 text-center text-xs font-bold text-amber-700 ring-1 ring-amber-100">
              進捗が大きいためQRコードにできません。<br />下の「コードをコピー」で保存してください。
            </p>
          )}

          <textarea
            readOnly
            value={code}
            onFocus={(e) => e.target.select()}
            className="mt-3 h-24 w-full resize-none rounded-2xl bg-paper p-3 font-mono text-xs text-ink/70 ring-1 ring-brand-100"
          />
          <Button full className="mt-2" variant={copied ? 'success' : 'primary'} onClick={copy}>
            {copied ? <><Check size={18} /> コピーしました</> : 'コードをコピー'}
          </Button>
        </Card>

        {/* 進捗コード：読込 */}
        <Card className="p-4">
          <div className="mb-1 flex items-center gap-2 text-brand-600">
            <Upload size={18} />
            <h2 className="font-display text-base font-extrabold">進捗コードを読み込む</h2>
          </div>
          <p className="mb-3 text-xs font-bold text-ink/50">
            保存したQR画像を選ぶか、発行したコードを貼り付けて読み込むと、その時点から再開できます（今の進捗は上書きされます）。
          </p>

          {/* 保存したQR画像（アルバム/ファイル）を選んで読み込む */}
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickQrImage}
          />
          <Button full variant="secondary" onClick={() => fileInput.current?.click()}>
            <Upload size={18} /> QR画像から読み込む
          </Button>

          <div className="my-3 flex items-center gap-2 text-[11px] font-bold text-ink/30">
            <span className="h-px flex-1 bg-ink/10" />または<span className="h-px flex-1 bg-ink/10" />
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="EQ1-...（コードを貼り付け）"
            className="h-24 w-full resize-none rounded-2xl bg-paper p-3 font-mono text-xs text-ink ring-1 ring-brand-100 placeholder:text-ink/30"
          />
          {error && <p className="mt-2 text-xs font-bold text-rose-500">{error}</p>}
          <Button full className="mt-2" variant="secondary" disabled={!input.trim()} onClick={tryLoad}>
            コードを読み込む
          </Button>
        </Card>
      </div>

      {/* 上書き確認 */}
      <Sheet open={!!preview} onClose={() => setPreview(null)} title="この内容で再開しますか？">
        {preview && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-brand-50 p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-brand-700">{preview.summary.words}</div>
                <div className="text-[11px] font-bold text-ink/50">学習済みの単語</div>
              </div>
              <div className="rounded-2xl bg-brand-50 p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-brand-700">{preview.summary.mastered}</div>
                <div className="text-[11px] font-bold text-ink/50">習得した単語</div>
              </div>
              <div className="rounded-2xl bg-hint-soft p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-amber-700">{preview.summary.xp}</div>
                <div className="text-[11px] font-bold text-ink/50">XP</div>
              </div>
              <div className="rounded-2xl bg-hint-soft p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-amber-700">{preview.summary.myList}</div>
                <div className="text-[11px] font-bold text-ink/50">マイ単語</div>
              </div>
              <div className="rounded-2xl bg-violet-50 p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-violet-700">{preview.summary.myGrammar}</div>
                <div className="text-[11px] font-bold text-ink/50">マイ文法</div>
              </div>
              <div className="rounded-2xl bg-cyan-50 p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-cyan-700">{preview.summary.writing}</div>
                <div className="text-[11px] font-bold text-ink/50">完成した英作文</div>
              </div>
            </div>
            <p className="text-xs font-bold text-rose-500">
              ※ 現在のこの端末の進捗は上書きされます。心配な場合は先に「発行」で今のコードを保存してください。
            </p>
            <Button full onClick={confirmLoad}>この内容で再開する</Button>
            <Button full variant="ghost" onClick={() => setPreview(null)}>キャンセル</Button>
          </div>
        )}
      </Sheet>
    </div>
  )
}
