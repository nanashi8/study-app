import { listeningSpokenSegments } from '../data/listening.js'
import { LISTENING_ROLE_LABELS, listeningSpeakerRoles } from '../data/listening-speaker-roles.js'
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

// 設問が「the woman」「the boy」と性別で話者を指す問題（src/data/listening-speaker-roles.js）では、
// 聞こえる声と設問の人物がつながるよう、人物の性別に合う声と声の高さを選ぶ。
const FEMALE_PITCH = 1.1
const MALE_PITCH = 0.9
const GENDER_OF_ROLE = Object.freeze({ woman: 'female', girl: 'female', man: 'male', boy: 'male' })
const OPPOSITE_GENDER = Object.freeze({ female: 'male', male: 'female' })
// Web Speech API は声の性別を標準化していないので、各社の音声名から判定する。分からない声は null。
const FEMALE_VOICE_NAME = /\b(samantha|karen|moira|tessa|victoria|allison|ava|susan|zira|fiona|kate|serena|veena|joanna|salli|kendra|kimberly|ivy|emma|amy|olivia|nicky|catherine|female)\b/i
const MALE_VOICE_NAME = /\b(alex|daniel|fred|tom|oliver|aaron|david|mark|george|ryan|matthew|joey|justin|brian|russell|nathan|arthur|gordon|rishi|evan|james|male)\b/i

export function voiceGender(voice) {
  const name = String(voice?.name ?? '')
  if (FEMALE_VOICE_NAME.test(name)) return 'female'
  if (MALE_VOICE_NAME.test(name)) return 'male'
  return null
}

/**
 * 問題の話者ごとの性別（'female' | 'male'）。台帳が一方の話者だけを書く問題は、もう一方を反対の性別にして
 * 声を聞き分けられるようにする（本文の話者名には、台帳が書いた話者だけを出す）。台帳にない問題は {}。
 */
export function listeningSpeakerGenders(item) {
  const roles = listeningSpeakerRoles(item)
  const genders = {}
  for (const speaker of ['A', 'B']) {
    if (GENDER_OF_ROLE[roles[speaker]]) genders[speaker] = GENDER_OF_ROLE[roles[speaker]]
  }
  if (genders.A && !genders.B) genders.B = OPPOSITE_GENDER[genders.A]
  if (genders.B && !genders.A) genders.A = OPPOSITE_GENDER[genders.B]
  return genders
}

/** 本文の話者名。台帳が人物を書いた話者は「話者A（女性）」のように添える。 */
export function listeningSpeakerLabel(item, speaker, labels = { A: '話者A', B: '話者B', N: 'ナレーター', Q: '質問' }) {
  const base = labels[speaker] ?? speaker
  const role = listeningSpeakerRoles(item)[speaker]
  return role ? `${base}（${LISTENING_ROLE_LABELS[role]}）` : base
}

/**
 * 話者Aは利用者が選んだ英語音声、話者Bは別の自然な英語音声を使う。
 * Web Speech API は声の性別を標準化していないため、性別ではなく音声URIで
 * 確実に話者を分ける。適切な第2音声がない端末では pitch の差へ戻す。
 *
 * genders（{ A: 'female', B: 'male' }）を渡した問題は、性別が分かる声を性別に合わせて割り当てる。
 * 合う声がない話者は、もう一方の話者と別の声を使う。
 */
export function listeningSpeakerVoiceURIs(voices, preferredVoiceURI = null, genders = {}) {
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

  const fallback = { A: primaryVoiceURI, B: secondary?.voiceURI ?? null }
  let assigned = fallback

  if (genders.A || genders.B) {
    const usable = ranked.filter((voice) => voice.voiceURI && voiceQuality(voice) !== 'low')
    const bestFor = (gender) => {
      const matches = usable.filter((voice) => voiceGender(voice) === gender)
      return (
        matches.find((voice) => primary?.lang && voice.lang === primary.lang) ?? matches[0] ?? null
      )?.voiceURI ?? null
    }
    const byGender = { female: bestFor('female'), male: bestFor('male') }
    const picked = { A: genders.A ? byGender[genders.A] : null, B: genders.B ? byGender[genders.B] : null }
    // 性別の合う声がない話者には、もう一方と別の声を割り当てる（基本の割り当てを優先する）。
    const spare = (taken) =>
      [fallback.A, fallback.B, ...usable.map((voice) => voice.voiceURI)].find((uri) => uri && uri !== taken) ?? null
    assigned = {
      A: picked.A ?? spare(picked.B),
      B: picked.B ?? spare(picked.A ?? undefined),
    }
    if (assigned.A && assigned.A === assigned.B) assigned = { A: assigned.A, B: spare(assigned.A) }
  }

  return Object.freeze({
    A: assigned.A,
    B: assigned.B,
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
  const genders = listeningSpeakerGenders(item)
  const speakerVoices = listeningSpeakerVoiceURIs(voices, voiceURI, genders)

  return listeningSpokenSegments(item).map((segment) => {
    const speakerVoiceURI = speakerVoices[segment.speaker]
    const gender = genders[segment.speaker]
    return {
      label: segment.text,
      meta: segment,
      text: segment.text,
      pitch: gender ? (gender === 'female' ? FEMALE_PITCH : MALE_PITCH) : PITCH_BY_SPEAKER[segment.speaker] ?? 1,
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
