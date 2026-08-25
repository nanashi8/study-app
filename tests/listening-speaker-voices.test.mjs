import test from 'node:test'
import assert from 'node:assert/strict'

import { LISTENING_ITEMS } from '../src/data/listening.js'
import {
  createListeningSpeechItems,
  listeningSpeakerVoiceURIs,
} from '../src/lib/listening.js'

const voice = (name, voiceURI, lang = 'en-US') => ({
  name,
  voiceURI,
  lang,
  default: false,
  localService: true,
})

const alex = voice('Alex', 'voice-alex')
const samantha = voice('Samantha', 'voice-samantha')
const daniel = voice('Daniel', 'voice-daniel', 'en-GB')

test('複数話者は設定音声と同じ言語地域の別音声を話者A・Bへ割り当てる', () => {
  const voices = listeningSpeakerVoiceURIs(
    [daniel, samantha, alex],
    alex.voiceURI,
  )

  assert.equal(voices.A, alex.voiceURI)
  assert.equal(voices.B, samantha.voiceURI)
  assert.notEqual(voices.A, voices.B)
  assert.equal(voices.N, alex.voiceURI)
  assert.equal(voices.Q, alex.voiceURI)
})

test('話者Bには演出用の低音質音声を選ばない', () => {
  const boing = voice('Boing', 'voice-boing')
  const voices = listeningSpeakerVoiceURIs(
    [boing, daniel, alex],
    alex.voiceURI,
  )

  assert.equal(voices.A, alex.voiceURI)
  assert.equal(voices.B, daniel.voiceURI)
})

test('全66件の複数話者リスニングで話者A・Bを別音声にする', () => {
  const multiSpeakerItems = LISTENING_ITEMS.filter((item) => {
    const speakers = new Set(item.audio.map((segment) => segment.speaker))
    return speakers.has('A') && speakers.has('B')
  })

  assert.equal(multiSpeakerItems.length, 66)
  for (const item of multiSpeakerItems) {
    const speechItems = createListeningSpeechItems(item, {
      voiceURI: alex.voiceURI,
      voices: [alex, samantha],
    })
    const characterVoices = Object.fromEntries(
      speechItems
        .filter((speechItem) => ['A', 'B'].includes(speechItem.meta.speaker))
        .map((speechItem) => [speechItem.meta.speaker, speechItem.voiceURI]),
    )

    assert.equal(characterVoices.A, alex.voiceURI, `${item.id}: 話者A`)
    assert.equal(characterVoices.B, samantha.voiceURI, `${item.id}: 話者B`)
  }
})

test('自然な第2音声がない端末では同じ声のpitch差へ戻す', () => {
  const item = LISTENING_ITEMS.find((candidate) => {
    const speakers = new Set(candidate.audio.map((segment) => segment.speaker))
    return speakers.has('A') && speakers.has('B')
  })
  const speechItems = createListeningSpeechItems(item, {
    voiceURI: alex.voiceURI,
    voices: [alex],
  })
  const speakerA = speechItems.find((speechItem) => speechItem.meta.speaker === 'A')
  const speakerB = speechItems.find((speechItem) => speechItem.meta.speaker === 'B')

  assert.equal(speakerA.voiceURI, alex.voiceURI)
  assert.equal(speakerB.voiceURI, undefined)
  assert.equal(speakerA.pitch, 0.94)
  assert.equal(speakerB.pitch, 1.06)
})
