import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import {
  APP_MENU_ACTIONS,
  APP_MENU_SECTIONS,
  APP_MENU_ITEMS,
  APP_MENU_SCREEN_DESTINATIONS,
} from '../src/lib/appMenu.js'
import {
  ALL_PROGRESS_RESET_GROUP_IDS,
  PROGRESS_RESET_GROUPS,
} from '../src/lib/progressReset.js'

const read = (path) =>
  readFileSync(new URL(path, import.meta.url), 'utf8')

test('上部の一つの共通メニューを全画面から開き、その中の設定へ進む', () => {
  const app = read('../src/App.jsx')
  const header = read('../src/components/AppShell.jsx')
  const sheet = read('../src/components/Sheet.jsx')
  const settings = read('../src/components/SpeechSettings.jsx')
  const css = read('../src/index.css')

  assert.match(app, /<SpeechSettingsSheet \/>/)
  assert.match(app, /<AppShell>/)
  assert.doesNotMatch(app, /BottomNav|nav=\{/)
  assert.match(header, /data-global-menu-bar/)
  assert.match(header, /study-app-global-menu-bar relative z-\[60\]/)
  assert.match(sheet, /app-viewport-overlay fixed inset-x-0 z-\[70\]/)
  assert.match(sheet, /data-sheet-scroll-area/)
  assert.match(sheet, /pb-\[calc\(1\.5rem\+var\(--app-bottom-clearance\)\)\]/)
  assert.match(header, /data-global-back-button/)
  assert.match(header, /<ChevronLeft size=\{19\} \/> 戻る/)
  assert.match(header, /data-global-menu-button/)
  assert.match(header, /aria-label="メニューを開く"/)
  assert.match(header, /<Menu size=\{18\} \/> メニュー/)
  assert.match(header, /onClick=\{\(\) => openSpeechSettings\(\)\}/)
  assert.doesNotMatch(header, /SpeechSettingsButton|data-global-bottom-nav/)
  assert.match(settings, /const sheetTitles = \{/)
  assert.match(settings, /menu: 'メニュー'/)
  assert.match(css, /\.study-app-content \[data-settings-menu-trigger\]/)
  assert.match(settings, /data-app-menu-panel/)
  assert.match(settings, /data-menu-settings-entry/)
  assert.doesNotMatch(settings, /data-menu-extras|screen: 'storyAlbum'|screen: 'afterSchoolChronicle'|GameSettingsPanel|龍脈/)
  assert.doesNotMatch(settings, />\s*おまけ\s*</)
  assert.doesNotMatch(app, /storyAlbum: StoryAlbumScreen|afterSchoolChronicle: AfterSchoolChronicleScreen/)
  assert.match(settings, /data-settings-menu-trigger/)
  assert.match(settings, /<Menu /)
  assert.match(settings, /data-speech-settings-trigger/)
})

test('学習途中に戻るボタンを押したら進捗破棄を確認し、メニュー移動では保存できる', () => {
  const header = read('../src/components/AppShell.jsx')
  const settings = read('../src/components/SpeechSettings.jsx')
  const backup = read('../src/components/ProgressBackup.jsx')
  const policy = read('../src/lib/navigationPolicy.js')
  const progress = read('../src/lib/progressCode.js')

  assert.match(settings, /requiresProgressSaveConfirmation\(currentScreen, screen\)/)
  assert.match(header, /requiresProgressSaveConfirmation\(screen, '__back__'\)/)
  assert.match(header, /openSpeechSettings\('back'\)/)
  assert.match(header, /disabled=\{!canGoBack \|\| menuOpen\}/)
  assert.match(settings, /data-progress-save-confirmation/)
  assert.match(settings, /data-progress-discard-confirmation/)
  assert.match(settings, /途中で戻るボタンを押した場合は、進捗は破棄されます。戻りますか？/)
  assert.match(settings, />\s*戻る\s*</)
  assert.match(settings, />\s*続ける\s*</)
  assert.match(settings, /途中の進捗を保存しますか？/)
  assert.match(settings, /<ProgressBackupPanel/)
  assert.match(settings, /continueLabel=\{`保存を終えて\$\{pendingLabel\}へ`\}/)
  assert.match(settings, /goPortal\(\)/)
  assert.match(policy, /targetScreen !== currentScreen/)
  for (const screen of ['vocabStudy', 'vocabQuiz', 'reader', 'grammarQuiz', 'mathSolve', 'diagnostic']) {
    assert.match(policy, new RegExp(`'${screen}'`))
  }
  assert.match(backup, /QRCodeCanvas/)
  assert.match(backup, /コードをコピー/)
  assert.match(backup, /useStore\(useShallow\(selectProgressState\)\)/)
  assert.match(progress, /export const PERSISTED_PROGRESS_FIELDS/)
})

test('全教材・学習アドバイザー・定着分析・管理機能を一段のメニューへ整理する', () => {
  const app = read('../src/App.jsx')
  const menu = read('../src/components/SpeechSettings.jsx')
  const advisor = read('../src/components/LearningAdvisor.jsx')
  const home = read('../src/screens/Home.jsx')
  const portal = read('../src/screens/Portal.jsx')

  assert.match(menu, /data-menu-advisor-entry/)
  assert.match(menu, /data-menu-retention-entry/)
  assert.match(menu, /<LearningAnalyticsPanel/)
  assert.match(advisor, /data-advisor-weakness/)
  assert.match(advisor, /data-advisor-next-unit/)
  const expectedScreens = [
    'portal', 'home', 'mathMap', 'kotenList', 'kanbunHome', 'literatureLibrary',
    'vocabLevels', 'vocabSearch', 'writing', 'roots', 'readingList', 'phrases', 'grammar', 'listening',
    'diagnostic', 'dictation', 'vocabCamera', 'wordRequests',
    'myList', 'myLearning', 'myGrammar', 'kotenSaved', 'kanbunSaved', 'progress',
  ]
  assert.deepEqual(APP_MENU_SECTIONS.map(({ id, label }) => [id, label]), [
    ['apps', 'スタディアプリ'],
    ['english', '英語の学習'],
    ['support', '学習サポート'],
    ['records', '保存・記録'],
    ['settings', '設定・アカウント'],
  ])
  assert.deepEqual(
    APP_MENU_SECTIONS.map((section) => section.items.length),
    [6, 8, 6, 6, 3],
  )
  assert.equal(APP_MENU_ITEMS.length, 29)
  assert.deepEqual(APP_MENU_SCREEN_DESTINATIONS, expectedScreens)
  assert.deepEqual(APP_MENU_ACTIONS, ['advisor', 'analytics', 'settings', 'account', 'reset'])
  assert.equal(new Set(APP_MENU_SCREEN_DESTINATIONS).size, expectedScreens.length)
  assert.equal(APP_MENU_ITEMS.find((item) => item.screen === 'portal')?.label, 'スタディアプリ ホーム')
  assert.match(menu, /data-menu-section-list/)
  assert.match(menu, /data-menu-section=\{menuSection\.id\}/)
  assert.match(menu, /data-menu-item/)
  assert.match(menu, /data-menu-settings-entry/)
  assert.match(menu, /data-menu-account-entry/)
  assert.match(menu, /data-menu-reset-entry/)
  assert.match(menu, /data-menu-reset-confirmation/)
  assert.doesNotMatch(menu, /data-menu-group-list|data-menu-direct-list|data-menu-group-entry|data-menu-group-panel|AppMenuGroupPanel|appMenuGroupById/)
  assert.doesNotMatch(menu, /DataManagementPanel|data-data-management-panel|data-clear-learning-scope/)
  assert.match(menu, /data-reset-selection-list/)
  assert.match(menu, /data-reset-select-all/)
  assert.match(menu, /data-reset-group=\{group\.id\}/)
  assert.match(menu, /allSelected \? \[\] : \[\.\.\.ALL_PROGRESS_RESET_GROUP_IDS\]/)
  assert.deepEqual(ALL_PROGRESS_RESET_GROUP_IDS, [
    'review', 'completion', 'results', 'saved', 'dictionary', 'legacy',
  ])
  assert.equal(PROGRESS_RESET_GROUPS.length, 6)
  assert.match(menu, /resetProgressEverywhere\(account, selectedGroups\)/)
  assert.match(menu, /data-menu-reset-complete/)
  assert.match(menu, /学習履歴をリセットしました/)
  assert.doesNotMatch(app, /BottomNav|nav=\{/)
  assert.doesNotMatch(home, /EXTRA_LEARNING_MODES|screen: 'diagnostic'|screen: 'myList'|screen: 'myGrammar'/)
  assert.doesNotMatch(portal, /useAuth|navigate\('login'\)/)
})

test('共通メニューから保存される学習・音声・コンテンツ設定を変更できる', () => {
  const source = read('../src/components/SpeechSettings.jsx')
  const game = read('../src/components/GameSettings.jsx')
  const portal = read('../src/components/PortalSettings.jsx')
  const settingsScreen = read('../src/screens/Settings.jsx')
  const store = read('../src/store/useStore.js')
  const defaultSettings = store.slice(
    store.indexOf('const DEFAULT_SETTINGS'),
    store.indexOf('export const createInitialLearningState'),
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
    'sessionSize',
    'revealAnswers',
  ])

  assert.match(source, /data-settings-central-panel/)
  assert.match(source, /setSetting\('revealAnswers'/)
  assert.match(source, /setSetting\('dailyGoal'/)
  assert.match(source, /setSetting\('sessionSize'/)
  assert.match(source, /title="読み上げの速さ"/)
  assert.match(source, /setSetting\('ttsRate'/)
  assert.match(source, /setSetting\('ttsVoiceURI'/)
  assert.match(source, /setSetting\('ttsJapaneseVoiceURI'/)
  assert.match(source, /setSetting\('autoSpeak'/)
  assert.match(source, /setSetting\('showPhonetic'/)
  assert.match(source, /英語をテスト/)
  assert.match(source, /日本語をテスト/)
  assert.doesNotMatch(source, /GameSettingsPanel|title="ゲーム"|龍脈/)
  assert.doesNotMatch(game, /setSetting/)
  assert.doesNotMatch(game, /setBattleRelicLevel|setBattleThemeId|raiseBattleTrait|resetBattleStudentTraits/)
  assert.match(portal, /moveContent/)
  assert.match(portal, /togglePortalHidden/)
  assert.match(portal, /resetPortal/)
  assert.match(settingsScreen, /<SettingsMenuPanel \/>/)
  assert.doesNotMatch(settingsScreen, /resetProgress|進捗をリセット|<Sheet/)
})

test('永続設定の変更処理は共通メニューへ集約し、廃止した対戦設定を表示しない', () => {
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
      'components/SessionSize.jsx',
      // 問題数と同じく、カード画面から共通設定を切り替える共通部品。
      'components/RevealAnswers.jsx',
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
  const gameSettings = read('../src/components/GameSettings.jsx')
  assert.match(gameSettings, /龍脈調査の設定/)
  assert.match(gameSettings, /対戦・攻撃・HPの演出はありません/)
  assert.doesNotMatch(gameSettings, /setBattleRelicLevel|setBattleThemeId|raiseBattleTrait|resetBattleStudentTraits|BattleCompanionPicker/)
  assert.doesNotMatch(read('../src/components/SpeechSettings.jsx'), /GameSettingsPanel|龍脈調査/)
})

test('終了した龍脈調査はメニューと公開ルートから外し、保存互換コードだけを残す', () => {
  const menu = read('../src/components/SpeechSettings.jsx')
  const app = read('../src/App.jsx')
  const visibility = read('../src/lib/learnerVisibility.js')
  const progressCode = read('../src/lib/progressCode.js')
  const cloud = read('../src/lib/cloudSync.js')

  assert.doesNotMatch(menu, /GameSettingsPanel|afterSchoolChronicle|storyAlbum|龍脈/)
  assert.doesNotMatch(app, /englishMap:|afterSchoolChronicle:|afterSchoolInterlude:|characterTalk:|storyAlbum:/)
  assert.match(visibility, /RETIRED_GAME_SCREENS/)
  assert.match(visibility, /RETIRED_GAME_SOURCE_TYPES/)
  assert.match(progressCode, /dragonVeinProgress/)
  assert.match(cloud, /dragonVeinProgress:\s*normalizeDragonVeinProgress/)
})

test('音声設定シートの開閉状態は学習データとは別の一時状態として動く', () => {
  const store = read('../src/store/useStore.js')
  const progressCode = read('../src/lib/progressCode.js')

  assert.match(store, /speechSettingsOpen:\s*false/)
  assert.match(store, /speechSettingsRequest:\s*'menu'/)
  assert.match(store, /openSpeechSettings:\s*\(request = 'menu'\) => set/)
  assert.match(store, /closeSpeechSettings:\s*\(\) => set/)
  assert.doesNotMatch(progressCode, /['"]speechSettingsOpen['"]/)
  assert.doesNotMatch(progressCode, /['"]speechSettingsRequest['"]/)
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
  assert.equal(screenCount, 20)
  assert.ok(speechUi.some(({ path }) => path === 'components/LiteratureVocabularySheet.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'screens/Reader.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'screens/LiteratureReader.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'screens/ListeningQuiz.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'screens/DictationPlay.jsx'))
  assert.doesNotMatch(read('../src/screens/Reader.jsx'), /const stopPlay|stepChunk/)
  assert.doesNotMatch(read('../src/screens/LiteratureReader.jsx'), /PACES|paceId/)
})
