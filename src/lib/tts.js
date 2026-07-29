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
  /^(?:Kyoko|Otoya|Albert|Fred|Junior|Kathy|Ralph|Bad News|Bahh|Boing|Bubbles|Cellos|Good News|Zarvox|Whisper|Organ|Bells|Trinoids|Jester|Superstar|Wobble|オルガン|ささやき声|スーパースター|トリノイド|ベル|震え|道化)$/i
const NATURAL_STANDARD_VOICE_HINT =
  /(?:samantha|alex|ava|allison|olivia|serena|daniel|karen|moira|tessa|rishi|sayaka|haruka|nanami|keita|mizuki|ayumi|ichiro|kyoko|otoya)/i

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

/** 英語テキストを読み上げる。成功なら true。 */
export function speak(text, { rate = 0.9, voiceURI = null, lang = 'en-US' } = {}) {
  if (!isTTSSupported() || !text) return false
  const synth = window.speechSynthesis
  synth.cancel() // 連打時に重ならないように
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = rate
  const v = voiceForLang(lang, voiceURI)
  if (v) u.voice = v
  synth.speak(u)
  return true
}

/** 終了コールバック付きで読み上げる（連続再生・言語切替に対応）。
 *  speak() と違って synth.cancel() を呼ばないので、onend で次を繋いで連続再生できる。
 *  lang が ja-* なら日本語の声を、それ以外なら英語の好みの声を使う。 */
export function speakWith(
  text,
  { rate = 0.9, pitch = 1, voiceURI = null, lang = 'en-US', onstart, onend } = {},
) {
  if (!isTTSSupported() || !text) {
    onend?.()
    return false
  }
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = rate
  u.pitch = pitch
  const v = voiceForLang(lang, voiceURI)
  if (v) u.voice = v
  if (onstart) u.onstart = () => onstart()
  // onend / onerror どちらでも次へ進めるようにする（cancel時の取りこぼし防止）
  let fired = false
  const finish = () => {
    if (fired) return
    fired = true
    onend?.()
  }
  u.onend = finish
  u.onerror = finish
  window.speechSynthesis.speak(u)
  return true
}

export function stopSpeaking() {
  if (isTTSSupported()) window.speechSynthesis.cancel()
}
