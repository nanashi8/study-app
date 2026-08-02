import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

const read = (path) =>
  readFileSync(new URL(path, import.meta.url), 'utf8')

test('一つの共通メニューを全画面から開き、その中の設定へ進む', () => {
  const app = read('../src/App.jsx')
  const header = read('../src/components/AppShell.jsx')
  const settings = read('../src/components/SpeechSettings.jsx')
  const bottomNav = read('../src/components/BottomNav.jsx')
  const screenDirectory = new URL('../src/screens/', import.meta.url)
  const missing = readdirSync(screenDirectory)
    .filter((filename) => filename.endsWith('.jsx'))
    .filter((filename) => {
      const source = read(`../src/screens/${filename}`)
      return !/ScreenHeader|LevelPicker|SpeechSettingsButton|SettingsMenuPanel/.test(source)
    })

  assert.match(app, /<SpeechSettingsSheet \/>/)
  assert.match(header, /<SpeechSettingsButton inverse=\{inverse\} \/>/)
  assert.match(settings, /title=\{view === 'settings' \? '設定' : 'メニュー'\}/)
  assert.match(settings, /data-app-menu-panel/)
  assert.match(settings, /data-menu-settings-entry/)
  assert.match(settings, /data-menu-extras/)
  assert.match(settings, /screen: 'storyAlbum'/)
  assert.match(settings, />\s*おまけ\s*</)
  assert.match(app, /storyAlbum: StoryAlbumScreen/)
  assert.match(settings, /data-settings-menu-trigger/)
  assert.match(settings, /<Menu /)
  assert.match(settings, /data-speech-settings-trigger/)
  assert.match(bottomNav, /label: 'メニュー'/)
  assert.match(bottomNav, /openSpeechSettings\(\)/)
  assert.doesNotMatch(bottomNav, /label: '設定', screen: 'settings'/)
  assert.deepEqual(missing, [])
})

test('共通メニューから保存される学習・音声・ゲーム・コンテンツ設定を変更できる', () => {
  const source = read('../src/components/SpeechSettings.jsx')
  const game = read('../src/components/GameSettings.jsx')
  const portal = read('../src/components/PortalSettings.jsx')
  const settingsScreen = read('../src/screens/Settings.jsx')
  const store = read('../src/store/useStore.js')
  const defaultSettings = store.slice(
    store.indexOf('const DEFAULT_SETTINGS'),
    store.indexOf('const initialLearning'),
  )
  const settingKeys = [...defaultSettings.matchAll(/^  (\w+):/gm)]
    .map((match) => match[1])

  assert.deepEqual(settingKeys, [
    'ttsRate',
    'ttsVoiceURI',
    'ttsJapaneseVoiceURI',
    'showPhonetic',
    'autoSpeak',
    'dailyGoal',
    'revealAnswers',
    'battleUiMode',
    'bgmEnabled',
    'bgmVolume',
  ])

  assert.match(source, /data-settings-central-panel/)
  assert.match(source, /setSetting\('revealAnswers'/)
  assert.match(source, /setSetting\('dailyGoal'/)
  assert.match(source, /title="読み上げの速さ"/)
  assert.match(source, /setSetting\('ttsRate'/)
  assert.match(source, /setSetting\('ttsVoiceURI'/)
  assert.match(source, /setSetting\('ttsJapaneseVoiceURI'/)
  assert.match(source, /setSetting\('autoSpeak'/)
  assert.match(source, /setSetting\('showPhonetic'/)
  assert.match(source, /英語をテスト/)
  assert.match(source, /日本語をテスト/)
  assert.match(game, /setSetting\('battleUiMode'/)
  assert.match(game, /setSetting\('bgmEnabled'/)
  assert.match(game, /setSetting\('bgmVolume'/)
  assert.match(game, /setBattleRelicLevel/)
  assert.match(game, /setBattleThemeId/)
  assert.match(game, /raiseBattleTrait/)
  assert.match(game, /resetBattleStudentTraits/)
  assert.match(portal, /moveContent/)
  assert.match(portal, /togglePortalHidden/)
  assert.match(portal, /resetPortal/)
  assert.match(settingsScreen, /<SettingsMenuPanel \/>/)
})

test('永続設定の変更処理は共通メニューにだけ置き、同行者だけ戦果後に残す', () => {
  const files = ['components', 'screens'].flatMap((directory) =>
    readdirSync(new URL(`../src/${directory}/`, import.meta.url))
      .filter((filename) => filename.endsWith('.jsx'))
      .map((filename) => ({
        path: `${directory}/${filename}`,
        source: read(`../src/${directory}/${filename}`),
      })),
  )
  const allowed = new Map([
    ['setSetting', ['components/SpeechSettings.jsx', 'components/GameSettings.jsx']],
    ['setBattleRelicLevel', ['components/GameSettings.jsx']],
    ['setBattleThemeId', ['components/GameSettings.jsx']],
    ['raiseBattleTrait', ['components/GameSettings.jsx']],
    ['resetBattleStudentTraits', ['components/GameSettings.jsx']],
    ['moveContent', ['components/PortalSettings.jsx']],
    ['togglePortalHidden', ['components/PortalSettings.jsx']],
    ['resetPortal', ['components/PortalSettings.jsx']],
    ['setBattleStudentId', ['screens/SessionResult.jsx']],
  ])
  const violations = []

  for (const [mutation, allowedPaths] of allowed) {
    for (const file of files) {
      if (file.source.includes(mutation) && !allowedPaths.includes(file.path)) {
        violations.push(`${mutation}:${file.path}`)
      }
    }
  }

  assert.deepEqual(violations, [])
  assert.match(read('../src/screens/SessionResult.jsx'), /次の同行者を選ぶ/)
  assert.match(read('../src/screens/EnglishMap.jsx'), /同行者の選択はバトル後の戦果画面/)
})

test('簡易UIとゲーミングUIは共通設定から切り替わり戦闘計算を変えない', () => {
  const store = read('../src/store/useStore.js')
  const settings = read('../src/components/GameSettings.jsx')
  const quiz = read('../src/screens/VocabQuiz.jsx')
  const css = read('../src/index.css')

  assert.match(store, /battleUiMode:\s*'gaming'/)
  assert.match(settings, /title="バトル画面"/)
  assert.match(settings, /簡易UI/)
  assert.match(settings, /ゲーミングUI/)
  assert.match(quiz, /data-battle-ui-mode=/)
  assert.match(css, /data-battle-ui-mode='simple'/)
  assert.doesNotMatch(read('../src/lib/rpg.js'), /battleUiMode/)
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
