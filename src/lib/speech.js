// 音声認識（Web Speech API / SpeechRecognition）ラッパーと認識文字列の一致度計算。
// 対応状況はブラウザ名で決め打ちせず、その時点の実装を feature-detect する。

const recognitionConstructor = () =>
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export const isRecognitionSupported = () => !!recognitionConstructor()
export const PRONUNCIATION_PASS_SCORE = 80

const candidateTranscripts = (chunks, limit = 20) => {
  let combined = [{ transcript: '', confidenceTotal: 0, confidenceCount: 0 }]
  for (const chunk of chunks.filter(Boolean)) {
    const next = []
    for (const prefix of combined) {
      for (const alternative of chunk) {
        const confidence = Number.isFinite(alternative.confidence) ? alternative.confidence : null
        next.push({
          transcript: `${prefix.transcript} ${alternative.transcript}`.trim(),
          confidenceTotal: prefix.confidenceTotal + (confidence ?? 0),
          confidenceCount: prefix.confidenceCount + (confidence === null ? 0 : 1),
        })
        if (next.length >= limit) break
      }
      if (next.length >= limit) break
    }
    combined = next
    if (!combined.length) break
  }

  const seen = new Set()
  return combined
    .map((entry) => ({
      transcript: entry.transcript.trim(),
      confidence: entry.confidenceCount
        ? entry.confidenceTotal / entry.confidenceCount
        : 0,
    }))
    .filter((entry) => entry.transcript && !seen.has(entry.transcript) && seen.add(entry.transcript))
}

/** 1回分の音声認識を開始する。
 *  無音になるとブラウザ側で確定し、必要なら stop() でも確定できる。
 *  返り値 { stop, abort, result }。result は
 *  { transcript, confidence, alternatives } または { error }。
 *  RecognitionCtor はブラウザ実装を差し替えるテスト用引数。 */
export function startRecognition(
  { lang = 'en-US', timeoutMs = 12_000 } = {},
  RecognitionCtor = recognitionConstructor(),
) {
  if (!RecognitionCtor) {
    return { stop() {}, abort() {}, result: Promise.resolve({ error: 'unsupported' }) }
  }

  let rec
  try {
    rec = new RecognitionCtor()
  } catch {
    return { stop() {}, abort() {}, result: Promise.resolve({ error: 'recognition-error' }) }
  }
  rec.lang = lang
  rec.interimResults = true
  rec.continuous = false
  rec.maxAlternatives = 5

  let started = false
  let pendingStop = false
  let settled = false
  let timeoutId = null
  let chunks = []
  let resolveResult
  const result = new Promise((res) => { resolveResult = res })
  const settle = (val) => {
    if (settled) return
    settled = true
    if (timeoutId !== null) clearTimeout(timeoutId)
    resolveResult(val)
  }
  const stopBrowserRecognition = () => {
    if (started) {
      try { rec.stop() } catch {}
    } else {
      pendingStop = true
    }
  }

  rec.onstart = () => {
    started = true
    if (timeoutMs > 0) {
      timeoutId = setTimeout(() => {
        settle({ error: 'timeout' })
        try { rec.abort() } catch {}
      }, timeoutMs)
    }
    if (pendingStop) stopBrowserRecognition()
  }
  rec.onresult = (e) => {
    const next = []
    for (let k = 0; k < e.results.length; k++) {
      const recognitionResult = e.results[k]
      const alternatives = []
      for (let j = 0; j < recognitionResult.length; j++) {
        const alternative = recognitionResult[j]
        const transcript = alternative?.transcript?.trim()
        if (transcript) {
          alternatives.push({
            transcript,
            confidence: alternative.confidence,
          })
        }
      }
      if (alternatives.length) next[k] = alternatives
    }
    if (next.length) chunks = next
  }
  rec.onerror = (e) => settle({ error: e.error || 'recognition-error' })
  rec.onend = () => {
    const alternatives = candidateTranscripts(chunks)
    const best = alternatives[0]
    settle(best
      ? { transcript: best.transcript, confidence: best.confidence, alternatives }
      : { error: 'no-speech' })
  }
  // 1語を話し終えたら待たせず確定する。stop() は得られた結果を返す。
  rec.onspeechend = stopBrowserRecognition

  try {
    rec.start()
  } catch (e) {
    settle({ error: e?.name === 'InvalidStateError' ? 'busy' : 'recognition-error' })
  }

  return {
    stop: stopBrowserRecognition,
    abort() {
      settle({ error: 'aborted' })
      try { rec.abort() } catch {}
    },
    result,
  }
}

// ── 文字列ユーティリティ（採点用） ──
const clean = (s) =>
  (s || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[-‐‑‒–—]/g, ' ')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const words = (s) => clean(s).split(' ').filter(Boolean)
const phoneticKey = (s) =>
  (s || '').normalize('NFKC').replace(/[\/[\]\s.ˈˌ]/g, '').trim()

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
 *  複数の認識候補があれば最も近い候補を採用する。同音異綴りは、呼び出し側が
 *  targetPhonetic と phoneticFor を渡した場合だけ同じ発音として扱う。 */
export function scorePronunciation(
  target,
  transcriptOrAlternatives,
  { targetPhonetic = '', phoneticFor } = {},
) {
  const targetWords = words(target)
  if (!targetWords.length) return { score: 0, perWord: [] }

  const inputs = Array.isArray(transcriptOrAlternatives)
    ? transcriptOrAlternatives
    : [transcriptOrAlternatives]
  const candidates = [...new Set(inputs
    .map((entry) => typeof entry === 'string' ? entry : entry?.transcript)
    .map(clean)
    .filter(Boolean))]

  const lookupPhonetic = (word) => {
    if (typeof phoneticFor !== 'function') return ''
    try { return phoneticKey(phoneticFor(word)) } catch { return '' }
  }
  const targetSound = targetWords.length === 1
    ? phoneticKey(targetPhonetic) || lookupPhonetic(targetWords[0])
    : ''

  let bestResult = null
  for (const candidate of candidates.length ? candidates : ['']) {
    const said = words(candidate)
    const perWord = targetWords.map((word) => {
      let best = { sim: 0, match: 'none' }
      const expectedSound = targetWords.length === 1 && word === targetWords[0]
        ? targetSound
        : lookupPhonetic(word)
      for (const spoken of said) {
        const spokenSound = lookupPhonetic(spoken)
        const soundMatch = !!expectedSound && !!spokenSound && expectedSound === spokenSound
        const sim = soundMatch ? 1 : similarity(word, spoken)
        if (sim > best.sim) best = { sim, match: soundMatch ? 'sound' : 'spelling' }
      }
      return {
        word,
        sim: best.sim,
        match: best.match,
        ok: best.sim >= PRONUNCIATION_PASS_SCORE / 100,
      }
    })
    const avg = perWord.reduce((sum, part) => sum + part.sim, 0) / perWord.length
    const scored = {
      score: Math.round(avg * 100),
      perWord,
      heard: said.join(' '),
      matchedBySound: perWord.some((part) => part.match === 'sound'),
      candidateCount: candidates.length,
    }
    const exact = clean(target) === candidate
    const bestExact = bestResult ? clean(target) === bestResult.heard : false
    if (
      !bestResult ||
      scored.score > bestResult.score ||
      (scored.score === bestResult.score && exact && !bestExact)
    ) {
      bestResult = scored
    }
  }
  return bestResult
}
