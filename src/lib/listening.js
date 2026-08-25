import { listeningSpokenSegments } from '../data/listening.js'
import {
  choosePreferredVoice,
  getEnglishVoices,
  isTTSSupported,
  sortVoicesByQuality,
  voiceQuality,
} from './tts.js'
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
 * 話者Aは利用者が選んだ英語音声、話者Bは別の自然な英語音声を使う。
 * Web Speech API は声の性別を標準化していないため、性別ではなく音声URIで
 * 確実に話者を分ける。適切な第2音声がない端末では pitch の差へ戻す。
 */
export function listeningSpeakerVoiceURIs(voices, preferredVoiceURI = null) {
  const ranked = sortVoicesByQuality(voices)
  const primary = choosePreferredVoice(ranked, preferredVoiceURI).voice
  const primaryVoiceURI = primary?.voiceURI ?? preferredVoiceURI ?? null
  const secondaryCandidates = ranked.filter(
    (voice) =>
      voice.voiceURI &&
      voice.voiceURI !== primaryVoiceURI &&
      voiceQuality(voice) !== 'low',
  )
  const secondary =
    secondaryCandidates.find((voice) => primary?.lang && voice.lang === primary.lang) ??
    secondaryCandidates[0] ??
    null

  return Object.freeze({
    A: primaryVoiceURI,
    B: secondary?.voiceURI ?? null,
    N: primaryVoiceURI,
    Q: primaryVoiceURI,
  })
}

export function createListeningSpeechItems(
  item,
  {
    rateFactor = 1,
    voiceURI = null,
    voices = getEnglishVoices(),
  } = {},
) {
  const speakerVoices = listeningSpeakerVoiceURIs(voices, voiceURI)

  return listeningSpokenSegments(item).map((segment) => {
    const speakerVoiceURI = speakerVoices[segment.speaker]
    return {
      label: segment.text,
      meta: segment,
      text: segment.text,
      pitch: PITCH_BY_SPEAKER[segment.speaker] ?? 1,
      rateFactor,
      minRate: 0.55,
      maxRate: 1.25,
      style: 'listening',
      ...(speakerVoiceURI ? { voiceURI: speakerVoiceURI } : {}),
    }
  })
}

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
    createListeningSpeechItems(item, { rateFactor, voiceURI }),
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
