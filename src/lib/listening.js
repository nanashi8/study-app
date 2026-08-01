import { listeningSpokenSegments } from '../data/listening.js'
import { isTTSSupported, speakWith, stopSpeaking } from './tts.js'

let activeRun = 0

const PITCH_BY_SPEAKER = Object.freeze({
  A: 0.94,
  B: 1.06,
  N: 1,
  Q: 0.98,
})

/**
 * 1問分の発話・設問・音声選択肢を順番に再生する。
 * 戻る操作や連打で旧コールバックが残っても、run token で次の発話へ進ませない。
 */
export function playListeningItem(
  item,
  { rate = 0.95, voiceURI = null, onSegment, onEnd } = {},
) {
  if (!item || !isTTSSupported()) {
    onEnd?.()
    return false
  }

  const segments = listeningSpokenSegments(item)
  if (!segments.length) {
    onEnd?.()
    return false
  }

  const run = ++activeRun
  stopSpeaking()

  const playAt = (index) => {
    if (run !== activeRun) return
    if (index >= segments.length) {
      onEnd?.()
      return
    }
    const segment = segments[index]
    speakWith(segment.text, {
      rate,
      pitch: PITCH_BY_SPEAKER[segment.speaker] ?? 1,
      voiceURI,
      style: 'listening',
      onstart: () => {
        if (run === activeRun) onSegment?.(segment, index)
      },
      onend: () => playAt(index + 1),
    })
  }

  playAt(0)
  return true
}

export function stopListeningAudio() {
  activeRun += 1
  stopSpeaking()
}
