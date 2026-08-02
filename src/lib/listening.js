import { listeningSpokenSegments } from '../data/listening.js'
import { isTTSSupported } from './tts.js'
import {
  dismissSpeechPlayer,
  playSpeechItems,
} from './speech-player.js'

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
  {
    rate = 0.9,
    rateFactor = 1,
    voiceURI = null,
    japaneseVoiceURI = null,
    navigationLocked = false,
    onSegment,
    onStatusChange,
    onEnd,
  } = {},
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

  return playSpeechItems(
    segments.map((segment) => ({
      label: segment.text,
      meta: segment,
      text: segment.text,
      pitch: PITCH_BY_SPEAKER[segment.speaker] ?? 1,
      rateFactor,
      minRate: 0.55,
      maxRate: 1.25,
      style: 'listening',
    })),
    {
      title: 'リスニング',
      rate,
      voiceURI,
      japaneseVoiceURI,
      autoAdvance: true,
      allowReplay: false,
      navigationLocked,
      onIndexChange: (index, speechItem) => onSegment?.(speechItem.meta, index),
      onStatusChange,
      onComplete: onEnd,
    },
  )
}

export function stopListeningAudio() {
  dismissSpeechPlayer()
}
