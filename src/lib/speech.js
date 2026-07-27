// 音声認識（Web Speech API / SpeechRecognition）ラッパーと認識文字列の一致度計算。
// Chrome / Edge は対応。iOS Safari / Firefox は未対応のことが多い → 要 feature-detect。

const SR =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export const isRecognitionSupported = () => !!SR

/** プッシュトゥトーク式の音声認識を開始する。
 *  押している間だけ録音し、stop() で確定 → result が resolve する。
 *  返り値 { stop, abort, result }。result は {transcript, confidence} か {error}。
 *  start/stop の競合（押した直後に離す）に備え、開始前の stop は保留して開始後に実行する。 */
export function startRecognition({ lang = 'en-US' } = {}) {
  if (!SR) return { stop() {}, abort() {}, result: Promise.resolve({ error: 'unsupported' }) }

  const rec = new SR()
  rec.lang = lang
  rec.interimResults = true // 押している間の取りこぼしを減らし、短い発話も拾う
  rec.continuous = false
  rec.maxAlternatives = 3

  let started = false
  let pendingStop = false
  let settled = false
  let finalText = ''
  let interimText = ''
  let confidence = 0
  let resolveResult
  const result = new Promise((res) => { resolveResult = res })
  const settle = (val) => { if (!settled) { settled = true; resolveResult(val) } }

  rec.onstart = () => {
    started = true
    if (pendingStop) { try { rec.stop() } catch {} }
  }
  rec.onresult = (e) => {
    let interim = ''
    for (let k = e.resultIndex; k < e.results.length; k++) {
      const r = e.results[k]
      if (r.isFinal) {
        finalText += (finalText ? ' ' : '') + r[0].transcript
        confidence = r[0].confidence
      } else {
        interim += r[0].transcript
      }
    }
    interimText = interim
  }
  rec.onerror = (e) => settle({ error: e.error || 'recognition-error' })
  rec.onend = () => {
    const transcript = (finalText || interimText).trim()
    settle(transcript ? { transcript, confidence } : { error: 'no-speech' })
  }

  try {
    rec.start()
  } catch (e) {
    settle({ error: e?.name === 'InvalidStateError' ? 'no-speech' : 'recognition-error' })
  }

  return {
    stop() {
      if (started) { try { rec.stop() } catch {} }
      else pendingStop = true
    },
    abort() { try { rec.abort() } catch {} },
    result,
  }
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

/** お手本 target と、認識結果 transcript を比べて認識一致度を返す。
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
