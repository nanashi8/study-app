// 音声認識（Web Speech API / SpeechRecognition）ラッパーと発音スコア計算。
// Chrome / Edge は対応。iOS Safari / Firefox は未対応のことが多い → 要 feature-detect。

const SR =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export const isRecognitionSupported = () => !!SR

/** 一度だけ音声認識する。resolve で {transcript, confidence}。
 *  onStart は認識開始時に呼ぶ（UIの「録音中」表示用）。 */
export function recognizeOnce({ lang = 'en-US', onStart } = {}) {
  return new Promise((resolve, reject) => {
    if (!SR) {
      reject(new Error('unsupported'))
      return
    }
    const rec = new SR()
    rec.lang = lang
    rec.interimResults = false
    rec.maxAlternatives = 3
    let done = false
    const finish = (fn, arg) => {
      if (done) return
      done = true
      try { rec.stop() } catch {}
      fn(arg)
    }
    rec.onresult = (e) => {
      const r = e.results[0]
      const best = r[0]
      finish(resolve, { transcript: best.transcript, confidence: best.confidence })
    }
    rec.onerror = (e) => finish(reject, new Error(e.error || 'recognition-error'))
    rec.onend = () => finish(reject, new Error('no-speech'))
    try {
      rec.start()
      onStart?.()
    } catch (e) {
      finish(reject, e)
    }
  })
}

// ── 文字列ユーティリティ（採点用） ──
const clean = (s) =>
  (s || '').toLowerCase().replace(/[^a-z0-9'\s-]/g, '').replace(/\s+/g, ' ').trim()
const words = (s) => clean(s).split(' ').filter(Boolean)

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  const dp = Array.from({ length: m + 1 }, (_, i) => i)
  for (let j = 1; j <= n; j++) {
    let prev = dp[0]
    dp[0] = j
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i]
      dp[i] = Math.min(
        dp[i] + 1,
        dp[i - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
      prev = tmp
    }
  }
  return dp[m]
}

const similarity = (a, b) => {
  if (!a && !b) return 1
  const d = levenshtein(a, b)
  return 1 - d / Math.max(a.length, b.length)
}

/** お手本 target と、認識結果 transcript を比べて発音スコアを返す。
 *  target の各語について、transcript 中で最も近い語との類似度を平均し 0–100 に。 */
export function scorePronunciation(target, transcript) {
  const t = words(target)
  const said = words(transcript)
  if (!t.length) return { score: 0, perWord: [] }
  const perWord = t.map((w) => {
    let best = 0
    for (const s of said) best = Math.max(best, similarity(w, s))
    return { word: w, sim: best, ok: best >= 0.7 }
  })
  const avg = perWord.reduce((a, p) => a + p.sim, 0) / perWord.length
  return { score: Math.round(avg * 100), perWord, heard: said.join(' ') }
}
