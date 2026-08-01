import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

const read = (path) =>
  readFileSync(new URL(path, import.meta.url), 'utf8')

test('音声設定メニューは一つの共通シートを全画面から開く', () => {
  const app = read('../src/App.jsx')
  const header = read('../src/components/AppShell.jsx')
  const settings = read('../src/components/SpeechSettings.jsx')
  const screenDirectory = new URL('../src/screens/', import.meta.url)
  const missing = readdirSync(screenDirectory)
    .filter((filename) => filename.endsWith('.jsx'))
    .filter((filename) => {
      const source = read(`../src/screens/${filename}`)
      return !/ScreenHeader|LevelPicker|SpeechSettingsButton|SpeechSettingsPanel/.test(source)
    })

  assert.match(app, /<SpeechSettingsSheet \/>/)
  assert.match(header, /<SpeechSettingsButton \/>/)
  assert.match(settings, /data-speech-settings-trigger/)
  assert.deepEqual(missing, [])
})

test('共通メニューから既存の発音設定をすべて変更できる', () => {
  const source = read('../src/components/SpeechSettings.jsx')

  assert.match(source, /title="読み上げの速さ"/)
  assert.match(source, /setSetting\('ttsRate'/)
  assert.match(source, /setSetting\('ttsVoiceURI'/)
  assert.match(source, /setSetting\('ttsJapaneseVoiceURI'/)
  assert.match(source, /setSetting\('autoSpeak'/)
  assert.match(source, /setSetting\('showPhonetic'/)
  assert.match(source, /英語をテスト/)
  assert.match(source, /日本語をテスト/)
})

test('音声設定シートの開閉状態は学習データとは別の一時状態として動く', () => {
  const store = read('../src/store/useStore.js')
  const persistedFields = store.slice(store.indexOf('partialize:'))

  assert.match(store, /speechSettingsOpen:\s*false/)
  assert.match(store, /openSpeechSettings:\s*\(\) => set\(\{ speechSettingsOpen: true \}\)/)
  assert.match(store, /closeSpeechSettings:\s*\(\) => set\(\{ speechSettingsOpen: false \}\)/)
  assert.doesNotMatch(persistedFields, /speechSettingsOpen:\s*st\.speechSettingsOpen/)
})

test('リスニングとディクテーションも共通速度を級別速度へ掛け合わせる', () => {
  const listening = read('../src/screens/ListeningQuiz.jsx')
  const dictation = read('../src/screens/DictationPlay.jsx')

  assert.match(listening, /const userRateScale = \(settings\.ttsRate \?\? 0\.9\) \/ 0\.9/)
  assert.match(dictation, /const userRateScale = \(settings\.ttsRate \?\? 0\.9\) \/ 0\.9/)
})
