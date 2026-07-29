import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  choosePreferredVoice,
  sortVoicesByQuality,
  voiceQuality,
  voiceQualityLabel,
} from '../src/lib/tts.js'

const voice = (
  name,
  {
    voiceURI = name,
    lang = 'ja-JP',
    isDefault = false,
    localService = true,
  } = {},
) => ({
  name,
  voiceURI,
  lang,
  default: isDefault,
  localService,
})

test('自動選択は高品質、標準、低音質の順を必ず守る', () => {
  const compact = voice('Kyoko', {
    voiceURI: 'com.apple.voice.compact.ja-JP.Kyoko',
    isDefault: true,
  })
  const standard = voice('Hana')
  const premium = voice('Zoe (Premium)', {
    voiceURI: 'com.apple.voice.premium.ja-JP.Zoe',
  })

  assert.deepEqual(
    sortVoicesByQuality([compact, standard, premium]),
    [premium, standard, compact],
  )
  assert.equal(
    choosePreferredVoice([compact, standard, premium]).voice,
    premium,
  )
})

test('高品質がなければ標準を使い、低音質は代替音声しかない場合だけ使う', () => {
  const compact = voice('Kyoko', {
    voiceURI: 'com.apple.voice.compact.ja-JP.Kyoko',
    isDefault: true,
  })
  const standard = voice('Hana')

  const standardChoice = choosePreferredVoice([compact, standard])
  assert.equal(standardChoice.voice, standard)
  assert.equal(standardChoice.quality, 'standard')
  assert.equal(standardChoice.source, 'automatic')

  const fallbackChoice = choosePreferredVoice([compact])
  assert.equal(fallbackChoice.voice, compact)
  assert.equal(fallbackChoice.quality, 'low')
  assert.equal(fallbackChoice.source, 'fallback')
})

test('品質表記のない音声同士でも、教育向けの自然な声を効果音声より優先する', () => {
  const novelty = voice('Boing', {
    lang: 'en-US',
    isDefault: true,
  })
  const british = voice('Daniel', { lang: 'en-GB' })
  const american = voice('Samantha', { lang: 'en-US' })

  const choice = choosePreferredVoice([novelty, british, american])
  assert.equal(voiceQuality(novelty), 'low')
  assert.equal(choice.voice, american)
  assert.equal(choice.quality, 'standard')
})

test('保存済みの低音質指定も、より良い音声が使えるときは自動で置き換える', () => {
  const compact = voice('Kyoko', {
    voiceURI: 'com.apple.voice.compact.ja-JP.Kyoko',
  })
  const enhanced = voice('Kyoko (Enhanced)', {
    voiceURI: 'com.apple.voice.enhanced.ja-JP.Kyoko',
  })

  const choice = choosePreferredVoice(
    [compact, enhanced],
    compact.voiceURI,
  )
  assert.equal(choice.voice, enhanced)
  assert.equal(choice.quality, 'high')
  assert.equal(choice.source, 'upgraded')
})

test('利用可能な音声が低音質だけなら、その手動指定を尊重する', () => {
  const kyoko = voice('Kyoko', {
    voiceURI: 'com.apple.voice.compact.ja-JP.Kyoko',
  })
  const otoya = voice('Otoya', {
    voiceURI: 'com.apple.voice.compact.ja-JP.Otoya',
  })

  const choice = choosePreferredVoice([kyoko, otoya], otoya.voiceURI)
  assert.equal(choice.voice, otoya)
  assert.equal(choice.quality, 'low')
  assert.equal(choice.source, 'manual')
})

test('品質表記を音声名とURIから判定して設定画面向けに表示する', () => {
  const natural = voice('Google US English Natural')
  const legacy = voice('Legacy English')
  const ordinary = voice('Alex')

  assert.equal(voiceQuality(natural), 'high')
  assert.equal(voiceQualityLabel(natural), '高品質')
  assert.equal(voiceQuality(legacy), 'low')
  assert.equal(voiceQualityLabel(legacy), '低音質・代替用')
  assert.equal(voiceQuality(ordinary), 'standard')
  assert.equal(voiceQualityLabel(ordinary), '標準')
})

test('英語と日本語の選択設定が読み上げ画面まで接続されている', () => {
  const store = readFileSync(
    new URL('../src/store/useStore.js', import.meta.url),
    'utf8',
  )
  const settings = readFileSync(
    new URL('../src/screens/Settings.jsx', import.meta.url),
    'utf8',
  )
  const reader = readFileSync(
    new URL('../src/screens/Reader.jsx', import.meta.url),
    'utf8',
  )
  const literature = readFileSync(
    new URL('../src/screens/LiteratureReader.jsx', import.meta.url),
    'utf8',
  )

  assert.match(store, /ttsJapaneseVoiceURI:\s*null/)
  assert.match(settings, /自動（高品質優先）/)
  assert.match(settings, /低音質は高品質・標準音声が使えない場合だけ使用します/)
  assert.equal(
    reader.match(/voiceURI:\s*settings\.ttsJapaneseVoiceURI/g)?.length,
    3,
  )
  assert.match(literature, /step\.lang === 'ja-JP'/)
  assert.match(literature, /settings\.ttsJapaneseVoiceURI/)
})
