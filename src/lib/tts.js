// 音声合成（Web Speech API / SpeechSynthesis）ラッパー。
// iOS Safari / Android Chrome / PC いずれも SpeechSynthesis は概ね対応。
// 音声リストは非同期で読み込まれるためキャッシュし、変化を購読できるようにする。

let cachedVoices = []
const listeners = new Set()

const HIGH_QUALITY_VOICE_HINT =
  /(?:premium|enhanced|natural|neural|wavenet|studio|siri|high[-\s]?quality|高品質|高音質|拡張)/i
const LOW_QUALITY_VOICE_HINT =
  /(?:compact|basic|legacy|classic|eSpeak|low[-\s]?quality|低品質|低音質)/i
const KNOWN_LOW_QUALITY_VOICE_NAME =
  /^(?:Kyoko|Otoya|Albert|Eddy(?:\s+\(.+\))?|Flo(?:\s+\(.+\))?|Fred|Grandma(?:\s+\(.+\))?|Grandpa(?:\s+\(.+\))?|Junior|Kathy|Ralph|Reed(?:\s+\(.+\))?|Rocko(?:\s+\(.+\))?|Sandy(?:\s+\(.+\))?|Shelley(?:\s+\(.+\))?|Bad News|Bahh|Boing|Bubbles|Cellos|Good News|Zarvox|Whisper|Organ|Bells|Trinoids|Jester|Superstar|Wobble|オルガン|ささやき声|スーパースター|トリノイド|ベル|震え|道化)$/i
const NATURAL_STANDARD_VOICE_HINT =
  /(?:google|microsoft|samantha|alex|ava|allison|olivia|serena|daniel|karen|moira|tessa|rishi|sayaka|haruka|nanami|keita|mizuki|ayumi|ichiro|kyoko|otoya)/i

const SPEECH_STYLE_PROFILES = Object.freeze({
  word: Object.freeze({
    rateFactor: 1,
    basePauseMs: 0,
    terminal: 'none',
    splitSentences: false,
  }),
  phrase: Object.freeze({
    rateFactor: 0.99,
    basePauseMs: 0,
    terminal: 'none',
    splitSentences: false,
  }),
  sentence: Object.freeze({
    rateFactor: 0.98,
    basePauseMs: 300,
    terminal: 'sentence',
    splitSentences: true,
  }),
  passage: Object.freeze({
    rateFactor: 0.96,
    basePauseMs: 340,
    terminal: 'sentence',
    splitSentences: true,
  }),
  narration: Object.freeze({
    rateFactor: 0.97,
    basePauseMs: 330,
    terminal: 'continuation',
    splitSentences: true,
  }),
  translation: Object.freeze({
    rateFactor: 0.96,
    basePauseMs: 370,
    terminal: 'continuation',
    splitSentences: true,
  }),
  explanation: Object.freeze({
    rateFactor: 0.96,
    basePauseMs: 360,
    terminal: 'sentence',
    splitSentences: true,
  }),
  listening: Object.freeze({
    rateFactor: 1,
    basePauseMs: 260,
    terminal: 'sentence',
    splitSentences: true,
  }),
})

const TERMINAL_PUNCTUATION = /[.!?。！？…,:;、，：；]/
const SENTENCE_ENDING = /[.!?。！？…]/
const TRAILING_CLOSERS = /["”»」』]+$/u
const TRAILING_QUOTE_MARKS = /["“”«»「」『』]+$/u
const TRAILING_OPEN_QUOTES = /[“«「『]+$/u

const qualityRank = {
  high: 3,
  standard: 2,
  low: 1,
}

const voiceDescriptor = (voice) =>
  `${voice?.name ?? ''} ${voice?.voiceURI ?? ''}`.trim()

/**
 * Web Speech API には標準化された音質フィールドがないため、音声名・URIに
 * ブラウザが付ける品質表記から判定する。判定できないものは低品質と決めつけず
 * standard とし、compact / legacy 表記や既知の旧式・効果音声だけを低品質として扱う。
 */
export function voiceQuality(voice) {
  const descriptor = voiceDescriptor(voice)
  if (HIGH_QUALITY_VOICE_HINT.test(descriptor)) return 'high'
  if (
    LOW_QUALITY_VOICE_HINT.test(descriptor) ||
    KNOWN_LOW_QUALITY_VOICE_NAME.test(voice?.name ?? '')
  ) {
    return 'low'
  }
  return 'standard'
}

export function voiceQualityLabel(voice) {
  const quality = voiceQuality(voice)
  if (quality === 'high') return '高品質'
  if (quality === 'low') return '低音質・代替用'
  return '標準'
}

function compareVoiceQuality(a, b) {
  const qualityDifference = qualityRank[voiceQuality(b)] - qualityRank[voiceQuality(a)]
  if (qualityDifference) return qualityDifference
  const naturalDifference =
    Number(NATURAL_STANDARD_VOICE_HINT.test(voiceDescriptor(b))) -
    Number(NATURAL_STANDARD_VOICE_HINT.test(voiceDescriptor(a)))
  if (naturalDifference) return naturalDifference
  if (Boolean(a.default) !== Boolean(b.default)) return a.default ? -1 : 1
  const usEnglishDifference =
    Number(/^en-US$/i.test(b.lang ?? '')) - Number(/^en-US$/i.test(a.lang ?? ''))
  if (usEnglishDifference) return usEnglishDifference
  if (Boolean(a.localService) !== Boolean(b.localService)) return a.localService ? -1 : 1
  return (a.name ?? '').localeCompare(b.name ?? '')
}

export function sortVoicesByQuality(voices) {
  return [...(voices ?? [])].sort(compareVoiceQuality)
}

/**
 * 自動選択は必ず high → standard → low の順。
 * 保存済みの手動指定が低音質でも、より良い声が現在使えるなら低音質へ戻さない。
 * 低音質の明示指定を許すのは、利用可能な声が低音質だけの場合に限る。
 */
export function choosePreferredVoice(voices, voiceURI = null) {
  const ranked = sortVoicesByQuality(voices)
  const selected = voiceURI
    ? ranked.find((voice) => voice.voiceURI === voiceURI)
    : null
  const hasNonLowVoice = ranked.some((voice) => voiceQuality(voice) !== 'low')

  if (selected && (voiceQuality(selected) !== 'low' || !hasNonLowVoice)) {
    return {
      voice: selected,
      quality: voiceQuality(selected),
      source: 'manual',
    }
  }

  const voice = ranked[0] ?? null
  return {
    voice,
    quality: voice ? voiceQuality(voice) : 'system',
    source:
      selected && voiceQuality(selected) === 'low' && hasNonLowVoice
        ? 'upgraded'
        : voiceQuality(voice) === 'low'
          ? 'fallback'
          : 'automatic',
  }
}

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const v = window.speechSynthesis.getVoices()
  if (v && v.length) {
    cachedVoices = v
    listeners.forEach((fn) => fn(cachedVoices))
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
}

// iOS Safari 対策：最初のユーザー操作で無音の発話を一度流し、音声エンジンを起こす。
// これをしないと、画面遷移直後の自動読み上げが鳴らないことがある。
let ttsUnlocked = false
function unlockTTS() {
  if (ttsUnlocked || !isTTSSupported()) return
  ttsUnlocked = true
  try {
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    window.speechSynthesis.resume()
    window.speechSynthesis.speak(u)
  } catch {
    // ignore
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlockTTS, { once: true })
}

export const isTTSSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window

export function getEnglishVoices() {
  return sortVoicesByQuality(cachedVoices.filter((v) => /^en(-|_|$)/i.test(v.lang)))
}

export function getJapaneseVoices() {
  return sortVoicesByQuality(cachedVoices.filter((v) => /^ja(-|_|$)/i.test(v.lang)))
}

export function subscribeVoices(fn) {
  listeners.add(fn)
  if (cachedVoices.length) fn(cachedVoices)
  return () => listeners.delete(fn)
}

// 言語に応じて声を選ぶ。日本語なら日本語の声、それ以外は英語の好みの声。
function voiceForLang(lang, voiceURI) {
  const voices = /^ja/i.test(lang) ? getJapaneseVoices() : getEnglishVoices()
  return choosePreferredVoice(voices, voiceURI).voice
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const rounded = (value) => Math.round(value * 1000) / 1000

function normalizedSpeechText(text) {
  return String(text ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n+ */g, '\n\n')
    .trim()
}

function textWithoutTrailingClosers(text) {
  return text.trim().replace(TRAILING_QUOTE_MARKS, '')
}

function hasTerminalPunctuation(text) {
  return TERMINAL_PUNCTUATION.test(textWithoutTrailingClosers(text).slice(-1))
}

function terminalizeSpeechText(text, terminal, lang) {
  if (!text || terminal === 'none' || hasTerminalPunctuation(text)) return text
  const punctuation =
    terminal === 'continuation'
      ? /^ja/i.test(lang)
        ? '、'
        : ','
      : /^ja/i.test(lang)
        ? '。'
        : '.'
  const closers = text.match(TRAILING_CLOSERS)?.[0] ?? ''
  return closers
    ? `${text.slice(0, -closers.length)}${punctuation}${closers}`
    : `${text}${punctuation}`
}

function fallbackSentenceSegments(text) {
  return (
    text.match(
      /[^.!?。！？…]+?(?:(?:\.\.\.|…+|[.!?。！？]+)(?:["”»」』】）)\]]+)?(?=\s|$)|$)/gu,
    ) ?? [text]
  )
}

function splitIntoSentenceUnits(text, lang) {
  const paragraphs = text.split(/\n{2,}/).filter(Boolean)
  return paragraphs.flatMap((paragraph, paragraphIndex) => {
    let segments
    try {
      const segmenter = new Intl.Segmenter(lang, { granularity: 'sentence' })
      segments = [...segmenter.segment(paragraph)].map(({ segment }) => segment)
    } catch {
      segments = fallbackSentenceSegments(paragraph)
    }
    const clean = segments.map((segment) => segment.trim()).filter(Boolean)
    for (let index = 0; index < clean.length - 1; index += 1) {
      const openingQuotes = clean[index].match(TRAILING_OPEN_QUOTES)?.[0]
      if (!openingQuotes) continue
      clean[index] = clean[index].slice(0, -openingQuotes.length).trimEnd()
      clean[index + 1] = `${openingQuotes}${clean[index + 1]}`
    }
    return clean.map((segment, index) => ({
      text: segment,
      paragraphEnd:
        paragraphIndex < paragraphs.length - 1 && index === clean.length - 1,
    }))
  })
}

/**
 * テキストの長さと句読点から、指定のない一般ボタン向けの読み方を推定する。
 * 名作・長文・解説・リスニングは呼び出し側が用途を明示する。
 */
export function inferSpeechStyle(text, lang = 'en-US') {
  const normalized = normalizedSpeechText(text)
  if (!normalized) return 'phrase'
  const withoutPunctuation = normalized.replace(/[^\p{L}\p{N}'’-]+/gu, ' ').trim()
  const wordCount = withoutPunctuation ? withoutPunctuation.split(/\s+/).length : 0
  const sentenceEndCount = (normalized.match(/[.!?。！？]/g) ?? []).length
  const isJapanese = /^ja/i.test(lang)

  if (
    !SENTENCE_ENDING.test(normalized) &&
    ((isJapanese && normalized.length <= 8) || (!isJapanese && wordCount <= 1))
  ) {
    return 'word'
  }
  if (
    sentenceEndCount > 1 ||
    normalized.includes('\n\n') ||
    (isJapanese ? normalized.length > 70 : wordCount > 26)
  ) {
    return 'passage'
  }
  if (SENTENCE_ENDING.test(normalized) || (isJapanese ? normalized.length > 20 : wordCount > 7)) {
    return 'sentence'
  }
  return 'phrase'
}

function pauseForUnit(text, basePauseMs, paragraphEnd) {
  if (!basePauseMs) return 0
  const bare = textWithoutTrailingClosers(text)
  let pause = basePauseMs
  if (/(?:\.\.\.|…+)$/.test(bare)) pause += 180
  else if (/[?？]$/.test(bare)) pause += 70
  else if (/[!！]$/.test(bare)) pause += 35
  if (paragraphEnd) pause += 180
  return pause
}

function pitchForUnit(text, pitch) {
  const bare = textWithoutTrailingClosers(text)
  if (/[?？]$/.test(bare)) return pitch + 0.025
  if (/[!！]$/.test(bare)) return pitch + 0.012
  return pitch
}

/**
 * ブラウザへ渡す発話を、文境界・段落・句読点に応じた複数の発話単位へ変換する。
 * 短い名作区切りには継続の読点を補い、長文は文ごとに適切な間を置く。
 */
export function createNaturalSpeechPlan(
  text,
  {
    rate = 0.9,
    pitch = 1,
    lang = 'en-US',
    style = 'auto',
  } = {},
) {
  const normalized = normalizedSpeechText(text)
  if (!normalized) return []
  const resolvedStyle =
    style === 'auto' ? inferSpeechStyle(normalized, lang) : style
  const profile = SPEECH_STYLE_PROFILES[resolvedStyle] ?? SPEECH_STYLE_PROFILES.sentence
  const units = profile.splitSentences
    ? splitIntoSentenceUnits(normalized, lang)
    : [{ text: normalized.replace(/\n+/g, ' '), paragraphEnd: false }]

  return units.map((unit, index) => {
    const spokenText = terminalizeSpeechText(unit.text, profile.terminal, lang)
    const isLast = index === units.length - 1
    return Object.freeze({
      text: spokenText,
      lang,
      style: resolvedStyle,
      rate: rounded(clamp(rate * profile.rateFactor, 0.5, 1.4)),
      pitch: rounded(clamp(pitchForUnit(spokenText, pitch), 0.75, 1.25)),
      pauseAfterMs: isLast
        ? 0
        : pauseForUnit(spokenText, profile.basePauseMs, unit.paragraphEnd),
    })
  })
}

let playbackGeneration = 0
let speechManuallyPaused = false
const pendingSpeechTimers = new Set()

function clearPendingSpeechTimers() {
  pendingSpeechTimers.forEach((timer) => window.clearTimeout(timer))
  pendingSpeechTimers.clear()
}

function scheduleSpeechContinuation(callback, delay) {
  const timer = window.setTimeout(() => {
    pendingSpeechTimers.delete(timer)
    callback()
  }, delay)
  pendingSpeechTimers.add(timer)
}

function playSpeechPlan(
  plan,
  {
    voiceURI = null,
    lang = 'en-US',
    onstart,
    onend,
    generation = playbackGeneration,
  } = {},
) {
  const voice = voiceForLang(lang, voiceURI)
  let finished = false
  let started = false

  const finishPlan = () => {
    if (finished || generation !== playbackGeneration) return
    finished = true
    onend?.()
  }

  const playAt = (index) => {
    if (finished || generation !== playbackGeneration) return
    if (index >= plan.length) {
      finishPlan()
      return
    }

    const unit = plan[index]
    const utterance = new SpeechSynthesisUtterance(unit.text)
    utterance.lang = unit.lang
    utterance.rate = unit.rate
    utterance.pitch = unit.pitch
    if (voice) utterance.voice = voice
    if (!started && onstart) {
      utterance.onstart = () => {
        if (started || generation !== playbackGeneration) return
        started = true
        onstart()
      }
    }

    let unitFinished = false
    const continuePlan = () => {
      if (unitFinished) return
      unitFinished = true
      if (generation !== playbackGeneration) return
      if (index >= plan.length - 1) {
        finishPlan()
        return
      }
      if (unit.pauseAfterMs > 0) {
        scheduleSpeechContinuation(() => playAt(index + 1), unit.pauseAfterMs)
      } else {
        playAt(index + 1)
      }
    }
    utterance.onend = continuePlan
    utterance.onerror = continuePlan
    try {
      if (!speechManuallyPaused) window.speechSynthesis.resume()
      window.speechSynthesis.speak(utterance)
    } catch {
      continuePlan()
    }
  }

  playAt(0)
}

/** 英語または日本語のテキストを、用途に合う自然な間で読み上げる。 */
export function speak(
  text,
  {
    rate = 0.9,
    pitch = 1,
    voiceURI = null,
    lang = 'en-US',
    style = 'auto',
  } = {},
) {
  if (!isTTSSupported() || !text) return false
  stopSpeaking() // 連打時に重ならないよう、旧発話と内部の間タイマーを止める
  const plan = createNaturalSpeechPlan(text, { rate, pitch, lang, style })
  playSpeechPlan(plan, {
    voiceURI,
    lang,
    generation: playbackGeneration,
  })
  return true
}

/** 終了コールバック付きで読み上げる（連続再生・言語切替に対応）。
 *  speak() と違って synth.cancel() を呼ばないので、onend で次を繋いで連続再生できる。
 *  lang が ja-* なら日本語の声を、それ以外なら英語の好みの声を使う。 */
export function speakWith(
  text,
  {
    rate = 0.9,
    pitch = 1,
    voiceURI = null,
    lang = 'en-US',
    style = 'auto',
    onstart,
    onend,
  } = {},
) {
  if (!isTTSSupported() || !text) {
    onend?.()
    return false
  }
  const plan = createNaturalSpeechPlan(text, { rate, pitch, lang, style })
  playSpeechPlan(plan, {
    voiceURI,
    lang,
    onstart,
    onend,
    generation: playbackGeneration,
  })
  return true
}

export function stopSpeaking() {
  playbackGeneration += 1
  speechManuallyPaused = false
  if (typeof window !== 'undefined') clearPendingSpeechTimers()
  if (isTTSSupported()) window.speechSynthesis.cancel()
}

/** 現在の発話位置を保ったまま一時停止する。 */
export function pauseSpeaking() {
  if (!isTTSSupported()) return false
  try {
    speechManuallyPaused = true
    window.speechSynthesis.pause()
    return true
  } catch {
    speechManuallyPaused = false
    return false
  }
}

/** 一時停止した発話を同じ位置から再開する。 */
export function resumeSpeaking() {
  if (!isTTSSupported()) return false
  try {
    speechManuallyPaused = false
    window.speechSynthesis.resume()
    return true
  } catch {
    return false
  }
}
