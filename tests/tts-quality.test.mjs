import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

import {
  choosePreferredVoice,
  createNaturalSpeechPlan,
  inferSpeechStyle,
  speakWith,
  sortVoicesByQuality,
  stopSpeaking,
  voiceQuality,
  voiceQualityLabel,
} from '../src/lib/tts.js'
import {
  dismissSpeechPlayer,
  getSpeechPlayerSnapshot,
  nextSpeechItem,
  pauseSpeechPlayer,
  playSpeechItems,
  playSpeechPlayer,
  previousSpeechItem,
  setSpeechPlayerRate,
  stopSpeechPlayer,
} from '../src/lib/speech-player.js'

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

test('macOSの演出用日本語音声を通常音声より優先しない', () => {
  const noveltyVoices = [
    'Eddy (日本語（日本）)',
    'Flo (日本語（日本）)',
    'Grandma (日本語（日本）)',
    'Grandpa (日本語（日本）)',
    'Reed (日本語（日本）)',
    'Rocko (日本語（日本）)',
    'Sandy (日本語（日本）)',
    'Shelley (日本語（日本）)',
  ].map((name, index) =>
    voice(name, {
      voiceURI: `com.apple.eloquence.ja-JP.voice-${index}`,
      isDefault: index === 0,
    }))
  const kyoko = voice('Kyoko')

  for (const novelty of noveltyVoices) {
    assert.equal(voiceQuality(novelty), 'low', novelty.name)
  }
  assert.equal(
    choosePreferredVoice([...noveltyVoices, kyoko]).voice,
    kyoko,
  )
})

test('Google日本語音声があれば端末の演出用音声より優先する', () => {
  const novelty = voice('Eddy (日本語（日本）)', {
    voiceURI: 'com.apple.eloquence.ja-JP.Eddy',
    isDefault: true,
  })
  const kyoko = voice('Kyoko')
  const googleJapanese = voice('Google 日本語', {
    voiceURI: 'Google 日本語',
    localService: false,
  })

  const choice = choosePreferredVoice([novelty, kyoko, googleJapanese])
  assert.equal(choice.voice, googleJapanese)
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

test('名作の短い区切りには継続の句読点を補い、英語と直訳を自然につなぐ', () => {
  const original = createNaturalSpeechPlan('In another moment', {
    rate: 1,
    style: 'narration',
  })
  const translation = createNaturalSpeechPlan('次の瞬間', {
    lang: 'ja-JP',
    rate: 1,
    style: 'translation',
  })

  assert.deepEqual(
    original.map(({ text, style, rate }) => ({ text, style, rate })),
    [{ text: 'In another moment,', style: 'narration', rate: 0.97 }],
  )
  assert.deepEqual(
    translation.map(({ text, style, rate }) => ({ text, style, rate })),
    [{ text: '次の瞬間、', style: 'translation', rate: 0.96 }],
  )
})

test('長文は文ごとに分け、疑問・段落・文末に応じて抑揚と間を変える', () => {
  const plan = createNaturalSpeechPlan(
    'Alice paused. “Where am I?”\n\nThen she looked down.',
    { rate: 1, style: 'passage' },
  )

  assert.deepEqual(
    plan.map(({ text }) => text),
    ['Alice paused.', '“Where am I?”', 'Then she looked down.'],
  )
  assert.equal(plan[0].rate, 0.96)
  assert.equal(plan[0].pauseAfterMs, 340)
  assert.equal(plan[1].pitch, 1.025)
  assert.equal(plan[1].pauseAfterMs, 590)
  assert.equal(plan[2].pauseAfterMs, 0)
})

test('日本語の鉤括弧を次の発話へ保ち、文の途中へ余計な句点を加えない', () => {
  const plan = createNaturalSpeechPlan(
    'アリスは顔を上げました。「ここはどこ？」と、静かにたずねます。',
    { lang: 'ja-JP', style: 'passage' },
  )

  assert.deepEqual(
    plan.map(({ text }) => text),
    ['アリスは顔を上げました。', '「ここはどこ？」', 'と、静かにたずねます。'],
  )
})

test('解説向け音声は引用符・括弧を発音用テキストから除き、中の説明は残す', () => {
  const translation = createNaturalSpeechPlan(
    '前からは、「彼は（昨日）来た」と取ります。',
    { lang: 'ja-JP', style: 'translation' },
  )
  const explanation = createNaturalSpeechPlan(
    'S（主語）は「だれが・何が」を示します。',
    { lang: 'ja-JP', style: 'explanation' },
  )

  assert.deepEqual(
    translation.map(({ text }) => text),
    ['前からは、彼は昨日来たと取ります。'],
  )
  assert.deepEqual(
    explanation.map(({ text }) => text),
    ['S主語はだれが・何がを示します。'],
  )
  assert.doesNotMatch(
    [...translation, ...explanation].map(({ text }) => text).join(''),
    /[「」（）()]/u,
  )
})

test('単語・句・例文・長文を自動判別し、学習対象そのものは改変しない', () => {
  assert.equal(inferSpeechStyle('Alice'), 'word')
  assert.equal(inferSpeechStyle('look after'), 'phrase')
  assert.equal(inferSpeechStyle('Alice looked down.'), 'sentence')
  assert.equal(
    inferSpeechStyle('Alice looked down. Then she closed her eyes.'),
    'passage',
  )
  assert.equal(createNaturalSpeechPlan('Alice')[0].text, 'Alice')
  assert.equal(
    createNaturalSpeechPlan('look after', { style: 'phrase' })[0].text,
    'look after',
  )
  assert.equal(
    createNaturalSpeechPlan('Alice looked down', { style: 'sentence' })[0].text,
    'Alice looked down.',
  )
})

test('複数文の発話を順に再生し、途中停止後は古い連鎖を再開しない', () => {
  const previousWindow = globalThis.window
  const PreviousUtterance = globalThis.SpeechSynthesisUtterance
  const queued = []
  const scheduled = []
  const cleared = new Set()
  let nextTimer = 1
  let completed = 0

  class MockUtterance {
    constructor(text) {
      this.text = text
      this.lang = ''
      this.rate = 1
      this.pitch = 1
    }
  }

  globalThis.window = {
    speechSynthesis: {
      getVoices: () => [],
      cancel: () => {},
      resume: () => {},
      speak: (utterance) => queued.push(utterance),
    },
    setTimeout: (callback, delay) => {
      const id = nextTimer
      nextTimer += 1
      scheduled.push({ id, callback, delay })
      return id
    },
    clearTimeout: (id) => cleared.add(id),
  }
  globalThis.SpeechSynthesisUtterance = MockUtterance

  try {
    assert.equal(
      speakWith('Alice paused. Where am I?', {
        rate: 1,
        style: 'passage',
        onend: () => {
          completed += 1
        },
      }),
      true,
    )
    assert.equal(queued.length, 1)
    assert.equal(queued[0].text, 'Alice paused.')
    queued[0].onend()
    assert.equal(scheduled[0].delay, 340)
    scheduled[0].callback()
    assert.equal(queued.length, 2)
    assert.equal(queued[1].text, 'Where am I?')
    assert.equal(queued[1].pitch, 1.025)
    queued[1].onend()
    assert.equal(completed, 1)

    speakWith('First. Second.', {
      style: 'passage',
      onend: () => {
        completed += 1
      },
    })
    const firstOfStoppedRun = queued.at(-1)
    firstOfStoppedRun.onend()
    const stoppedTimer = scheduled.at(-1)
    stopSpeaking()
    assert.ok(cleared.has(stoppedTimer.id))
    stoppedTimer.callback()
    assert.equal(queued.at(-1), firstOfStoppedRun)
    assert.equal(completed, 1)
  } finally {
    stopSpeaking()
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
    if (PreviousUtterance === undefined) delete globalThis.SpeechSynthesisUtterance
    else globalThis.SpeechSynthesisUtterance = PreviousUtterance
  }
})

test('共通の再生パネルは同じ位置から一時停止を再開し、フレーズ前後・停止・速度を制御する', () => {
  const previousWindow = globalThis.window
  const PreviousUtterance = globalThis.SpeechSynthesisUtterance
  const queued = []
  let paused = 0
  let resumed = 0
  let cancelled = 0

  class MockUtterance {
    constructor(text) {
      this.text = text
      this.lang = ''
      this.rate = 1
      this.pitch = 1
    }
  }

  globalThis.window = {
    speechSynthesis: {
      getVoices: () => [],
      cancel: () => { cancelled += 1 },
      pause: () => { paused += 1 },
      resume: () => { resumed += 1 },
      speak: (utterance) => queued.push(utterance),
    },
    setTimeout,
    clearTimeout,
  }
  globalThis.SpeechSynthesisUtterance = MockUtterance

  try {
    assert.equal(
      playSpeechItems(['first phrase', 'second phrase'], {
        rate: 0.9,
        style: 'phrase',
      }),
      true,
    )
    assert.equal(getSpeechPlayerSnapshot().index, 0)
    assert.equal(getSpeechPlayerSnapshot().canNext, true)
    assert.equal(queued.at(-1).text, 'first phrase')

    assert.equal(pauseSpeechPlayer(), true)
    assert.equal(paused, 1)
    assert.equal(getSpeechPlayerSnapshot().status, 'paused')
    assert.equal(playSpeechPlayer(), true)
    assert.equal(getSpeechPlayerSnapshot().status, 'playing')

    assert.equal(nextSpeechItem(), true)
    assert.equal(getSpeechPlayerSnapshot().index, 1)
    assert.equal(queued.at(-1).text, 'second phrase')
    assert.equal(previousSpeechItem(), true)
    assert.equal(getSpeechPlayerSnapshot().index, 0)

    assert.equal(setSpeechPlayerRate(1.1), true)
    assert.equal(getSpeechPlayerSnapshot().rate, 1.1)
    assert.equal(queued.at(-1).rate, 1.089)

    assert.equal(stopSpeechPlayer(), true)
    assert.equal(getSpeechPlayerSnapshot().status, 'stopped')
    assert.ok(cancelled >= 4)
    assert.ok(resumed >= 1)
  } finally {
    dismissSpeechPlayer()
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
    if (PreviousUtterance === undefined) delete globalThis.SpeechSynthesisUtterance
    else globalThis.SpeechSynthesisUtterance = PreviousUtterance
  }
})

test('英語と日本語の選択設定が読み上げ画面まで接続されている', () => {
  const store = readFileSync(
    new URL('../src/store/useStore.js', import.meta.url),
    'utf8',
  )
  const settings = readFileSync(
    new URL('../src/components/SpeechSettings.jsx', import.meta.url),
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
  const player = readFileSync(
    new URL('../src/lib/speech-player.js', import.meta.url),
    'utf8',
  )

  assert.match(store, /ttsJapaneseVoiceURI:\s*null/)
  assert.match(settings, /自動（高品質優先）/)
  assert.match(settings, /「自動」は、端末で使える最も高品質な声を選びます/)
  assert.match(settings, /「拡張」「Premium」「Enhanced」/)
  assert.match(reader, /japaneseVoiceURI:\s*settings\.ttsJapaneseVoiceURI/)
  assert.match(literature, /lang:\s*step\.lang/)
  assert.match(literature, /settings\.ttsJapaneseVoiceURI/)
  assert.match(player, /\^ja\/i\.test\(segment\.lang/)
  assert.match(player, /session\.japaneseVoiceURI/)
})

test('全ての直接読み上げ経路が用途別の自然朗読スタイルを共通処理へ渡す', () => {
  const sourceDirectories = ['components', 'lib', 'screens']
  const routeFiles = sourceDirectories.flatMap((directory) =>
    readdirSync(new URL(`../src/${directory}/`, import.meta.url))
      .filter((filename) => /\.[cm]?[jt]sx?$/.test(filename))
      .map((filename) => `../src/${directory}/${filename}`),
  ).filter((path) => path !== '../src/lib/tts.js')
    .filter((path) =>
      /\b(?:speak|speakWith)\s*\(/.test(
        readFileSync(new URL(path, import.meta.url), 'utf8'),
      ))

  assert.deepEqual(routeFiles, ['../src/lib/speech-player.js'])
  const player = readFileSync(new URL(routeFiles[0], import.meta.url), 'utf8')
  assert.match(player, /speakWith\(segment\.text/)
  assert.match(player, /style:\s*segment\.style \?\? 'auto'/)

  const literature = readFileSync(
    new URL('../src/screens/LiteratureReader.jsx', import.meta.url),
    'utf8',
  )
  const settings = readFileSync(
    new URL('../src/components/SpeechSettings.jsx', import.meta.url),
    'utf8',
  )
  assert.match(
    literature,
    /style:\s*step\.phase === 'original' \? 'narration' : 'translation'/,
  )
  assert.match(settings, /端末で使える最も高品質な声/)
  assert.doesNotMatch(settings, /自然な間・抑揚補正：すべての読み上げで有効/)
})
