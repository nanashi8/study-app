// 音声合成（Web Speech API / SpeechSynthesis）ラッパー。
// iOS Safari / Android Chrome / PC いずれも SpeechSynthesis は概ね対応。
// 音声リストは非同期で読み込まれるためキャッシュし、変化を購読できるようにする。

let cachedVoices = []
const listeners = new Set()

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
  return cachedVoices.filter((v) => /^en(-|_|$)/i.test(v.lang))
}

export function subscribeVoices(fn) {
  listeners.add(fn)
  if (cachedVoices.length) fn(cachedVoices)
  return () => listeners.delete(fn)
}

function preferredVoice(voiceURI) {
  const en = getEnglishVoices()
  if (voiceURI) {
    const exact = en.find((v) => v.voiceURI === voiceURI)
    if (exact) return exact
  }
  // 自然な声を優先（端末によって名前は様々なので緩めに）
  const pref =
    en.find((v) => /natural|enhanced|samantha|google us english/i.test(v.name)) ||
    en.find((v) => /en-US/i.test(v.lang)) ||
    en[0]
  return pref || null
}

/** 英語テキストを読み上げる。成功なら true。 */
export function speak(text, { rate = 0.9, voiceURI = null, lang = 'en-US' } = {}) {
  if (!isTTSSupported() || !text) return false
  const synth = window.speechSynthesis
  synth.cancel() // 連打時に重ならないように
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = rate
  const v = preferredVoice(voiceURI)
  if (v) u.voice = v
  synth.speak(u)
  return true
}

export function stopSpeaking() {
  if (isTTSSupported()) window.speechSynthesis.cancel()
}
