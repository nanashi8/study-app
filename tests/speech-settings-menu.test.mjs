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

test('永続設定の変更処理は共通メニューへ集約し、同行者変更だけ対決前の作戦会議に置く', () => {
  const files = ['components', 'screens'].flatMap((directory) =>
    readdirSync(new URL(`../src/${directory}/`, import.meta.url))
      .filter((filename) => filename.endsWith('.jsx'))
      .map((filename) => ({
        path: `${directory}/${filename}`,
        source: read(`../src/${directory}/${filename}`),
      })),
  )
  const allowed = new Map([
    ['setSetting', [
      'components/SpeechSettings.jsx',
      'components/SpeechConsole.jsx',
      'components/GameSettings.jsx',
    ]],
    ['setBattleRelicLevel', ['components/GameSettings.jsx']],
    ['setBattleThemeId', ['components/GameSettings.jsx']],
    ['raiseBattleTrait', ['components/GameSettings.jsx']],
    ['resetBattleStudentTraits', ['components/GameSettings.jsx']],
    ['moveContent', ['components/PortalSettings.jsx']],
    ['togglePortalHidden', ['components/PortalSettings.jsx']],
    ['resetPortal', ['components/PortalSettings.jsx']],
    ['setBattleStudentId', ['screens/EnglishMap.jsx']],
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
  assert.doesNotMatch(read('../src/screens/SessionResult.jsx'), /<BattleCompanionPicker/)
  assert.match(read('../src/components/BattleCompanionPicker.jsx'), /この対決の同行者を選ぶ/)
  assert.match(read('../src/screens/EnglishMap.jsx'), /同行者の選択は次の相手が分かるバトル前の作戦会議/)
})

test('簡易UIとゲーミングUIは共通設定から切り替わり戦闘計算を変えない', () => {
  const store = read('../src/store/useStore.js')
  const settings = read('../src/components/GameSettings.jsx')
  const quiz = read('../src/screens/VocabQuiz.jsx')
  const result = read('../src/screens/SessionResult.jsx')
  const css = read('../src/index.css')

  assert.match(store, /battleUiMode:\s*'gaming'/)
  assert.match(settings, /title="バトル画面"/)
  assert.match(settings, /簡易UI/)
  assert.match(settings, /ゲーミングUI/)
  assert.match(quiz, /data-battle-ui-mode=/)
  assert.match(result, /s\.settings\.battleUiMode === 'simple'/)
  assert.match(result, /data-testid="battle-result-console"/)
  assert.match(result, /data-battle-ui-mode=\{battleUiMode\}/)
  assert.match(css, /data-battle-ui-mode='simple'/)
  assert.doesNotMatch(read('../src/lib/rpg.js'), /battleUiMode/)
})

test('音声設定シートの開閉状態は学習データとは別の一時状態として動く', () => {
  const store = read('../src/store/useStore.js')
  const progressCode = read('../src/lib/progressCode.js')

  assert.match(store, /speechSettingsOpen:\s*false/)
  assert.match(store, /openSpeechSettings:\s*\(\) => set\(\{ speechSettingsOpen: true \}\)/)
  assert.match(store, /closeSpeechSettings:\s*\(\) => set\(\{ speechSettingsOpen: false \}\)/)
  assert.doesNotMatch(progressCode, /['"]speechSettingsOpen['"]/)
})

test('リスニングとディクテーションも共通速度を級別速度へ掛け合わせる', () => {
  const listening = read('../src/screens/ListeningQuiz.jsx')
  const dictation = read('../src/screens/DictationPlay.jsx')

  assert.match(listening, /const userRateScale = \(settings\.ttsRate \?\? 0\.9\) \/ 0\.9/)
  assert.match(dictation, /const userRateScale = \(settings\.ttsRate \?\? 0\.9\) \/ 0\.9/)
})

test('全画面共通の読み上げコンソールに6操作を一つずつ備える', () => {
  const shell = read('../src/components/AppShell.jsx')
  const consoleSource = read('../src/components/SpeechConsole.jsx')
  const player = read('../src/lib/speech-player.js')
  const speakButton = read('../src/components/SpeakButton.jsx')

  assert.match(shell, /<GlobalSpeechConsole \/>/)
  assert.match(consoleSource, /aria-label="読み上げコンソール"/)
  for (const label of ['再生', '一時停止', '前へ', '次へ', '停止', '速度']) {
    assert.match(consoleSource, new RegExp(`(?:label=|<span>)"?${label}`), label)
  }
  assert.match(player, /pauseSpeaking\(\)/)
  assert.match(player, /resumeSpeaking\(\)/)
  assert.match(player, /previousSpeechItem/)
  assert.match(player, /nextSpeechItem/)
  assert.match(player, /setSpeechPlayerRate/)
  assert.match(speakButton, /data-speech-text=/)
  assert.match(speakButton, /visibleSpeechButtons/)
})

test('読み上げを持つ全25 UIモジュールが共通プレイヤー経由になる', () => {
  const files = ['components', 'screens'].flatMap((directory) =>
    readdirSync(new URL(`../src/${directory}/`, import.meta.url))
      .filter((filename) => filename.endsWith('.jsx'))
      .map((filename) => ({
        path: `${directory}/${filename}`,
        source: read(`../src/${directory}/${filename}`),
      })),
  )
  const speechUi = files.filter(({ source }) =>
    /<SpeakButton|playSpeechItems\(|playListeningItem\(/.test(source),
  )
  const screenCount = speechUi.filter(({ path }) => path.startsWith('screens/')).length

  assert.equal(speechUi.length, 25)
  assert.equal(screenCount, 21)
  assert.ok(speechUi.some(({ path }) => path === 'screens/Reader.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'screens/LiteratureReader.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'screens/ListeningQuiz.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'screens/DictationPlay.jsx'))
  assert.doesNotMatch(read('../src/screens/Reader.jsx'), /const stopPlay|stepChunk/)
  assert.doesNotMatch(read('../src/screens/LiteratureReader.jsx'), /PACES|paceId/)
})
