import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import {
  APP_MENU_ACTIONS,
  APP_MENU_CONTENT_ITEMS,
  APP_MENU_SECTIONS,
  APP_MENU_ITEMS,
  APP_MENU_SCREEN_DESTINATIONS,
  CONTENT_SETTING_GROUPS,
  contentSettingsSummary,
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

test('学習の途中で戻る・メニューから移るときも、保存確認を挟まない', () => {
  const header = read('../src/components/AppShell.jsx')
  const settings = read('../src/components/SpeechSettings.jsx')
  const backup = read('../src/components/ProgressBackup.jsx')
  const policy = read('../src/lib/navigationPolicy.js')
  const progress = read('../src/lib/progressCode.js')

  // 答えた分は1問ごとに保存されるので、戻る・アプリ名・メニューのどこから移っても確認を出さない。
  assert.doesNotMatch(
    `${header}\n${settings}\n${policy}`,
    /requiresProgressSaveConfirmation|data-progress-save-confirmation|途中の進捗を保存しますか？/,
  )
  assert.doesNotMatch(header, /openSpeechSettings\('back'\)/)
  assert.match(header, /const goBack = \(\) => \{\n    if \(!canGoBack \|\| menuOpen\) return\n    globalBack\(\)\n  \}/)
  assert.match(header, /disabled=\{!canGoBack \|\| menuOpen\}/)
  assert.doesNotMatch(settings, /data-progress-discard-confirmation/)
  assert.doesNotMatch(settings, /進捗は破棄されます/)
  assert.match(settings, /const openScreen = \(screen, params = \{\}\) => \{\n    close\(\)\n    if \(screen === 'portal'\) goPortal\(\)/)
  for (const screen of ['vocabStudy', 'vocabQuiz', 'reader', 'grammarQuiz', 'mathSolve', 'diagnostic']) {
    assert.match(policy, new RegExp(`'${screen}'`))
  }
  // QR・コードは「学習記録・バックアップ」と、リセット前のバックアップから持ち出す。
  assert.match(settings, /<ProgressBackupPanel/)
  assert.match(backup, /QRCodeCanvas/)
  assert.match(backup, /コードをコピー/)
  assert.match(backup, /useStore\(useShallow\(selectProgressState\)\)/)
  assert.match(progress, /export const PERSISTED_PROGRESS_FIELDS/)
})

test('途中でやめたテストも、答えた分だけを一度その分野の記録へ残す', () => {
  const controls = read('../src/components/QuestionSessionControls.jsx')
  const store = read('../src/store/useStore.js')
  const app = read('../src/App.jsx')

  assert.match(controls, /export function useUnfinishedSessionRecord/)
  assert.match(controls, /keepInterruptedSession\(\s*\n?\s*skill && answered > 0 \? \{ screen, skill, answered, correct \} : null,/)
  // 預けは画面を離れるときに一度だけ記録し、同じ画面に居る間は記録しない。
  assert.match(store, /interruptedSession: null,/)
  assert.match(store, /keepInterruptedSession: \(session\) => set\(\{ interruptedSession: session \}\)/)
  assert.match(store, /if \(!session \|\| session\.screen === st\.screen\) return/)
  assert.match(store, /st\.recordSkillResult\(session\.skill, session\.correct, session\.answered, \{\n\s*trackLearning: false,\n\s*\}\)/)
  assert.match(app, /useEffect\(\(\) => \{\n    commitInterruptedSession\(\)\n  \}, \[screen, commitInterruptedSession\]\)/)
  // 進行中の記録は端末保存へ持ち出さず、全リセットのときだけ一緒に消す。
  assert.doesNotMatch(read('../src/lib/progressCode.js'), /interruptedSession/)
  assert.match(store, /\{ quizSession: null, interruptedSession: null \}/)

  const screens = [
    ['../src/screens/VocabQuiz.jsx', 'vocab'],
    ['../src/screens/PhraseQuiz.jsx', 'usage'],
    ['../src/screens/ListeningQuiz.jsx', 'listening'],
    ['../src/screens/DictationPlay.jsx', 'dictation'],
    ['../src/screens/GrammarQuiz.jsx', 'grammar'],
  ]
  assert.equal(screens.length, 5)
  for (const [relative, skill] of screens) {
    const source = read(relative)
    assert.match(source, /const handOffSession = useUnfinishedSessionRecord\(\{/, relative)
    assert.match(source, new RegExp(`skill: '${skill}'`), relative)
    // 最後まで進んだときは結果画面が数えるので、この画面では数えない。
    assert.match(source, /const finish = \(\) => \{\n    handOffSession\(\)/, relative)
  }
  // 単語の詳細を見て戻る間は続きを退避するので、そこでも数えない。
  assert.match(
    read('../src/screens/VocabQuiz.jsx'),
    /const saveBeforeDetail = \(\) => \{\n[^}]*handOffSession\(\)/,
  )
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
    'diagnostic', 'dictation', 'vocabCamera', 'customWords', 'wordRequests',
    'myList', 'myLearning', 'myGrammar', 'progress',
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
    [6, 8, 7, 4, 3],
  )
  assert.equal(APP_MENU_ITEMS.length, 28)
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
    'review', 'completion', 'results', 'saved', 'customWords', 'dictionary', 'legacy',
  ])
  assert.equal(PROGRESS_RESET_GROUPS.length, 7)
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
    'speechRange',
    'dailyGoal',
    'sessionSize',
    'revealAnswers',
    'hideSpelling',
    'autoAdvanceCorrect',
    'vocabMix',
  ])

  assert.match(source, /data-settings-central-panel/)
  // 学習画面の上や下で切り替えられる設定も、保存される設定はすべてメニューの「設定」から変えられる。
  for (const key of settingKeys) {
    assert.ok(source.includes(`useSettingField('${key}')`), `メニューの設定で ${key} を変えられない`)
  }
  // 全体の設定は、すべての教材をまとめてそろえる。
  assert.match(source, /const ALL_CONTENTS_TARGET = \{ scopes: null \}/)
  assert.match(source, /<SettingTargetContext\.Provider value=\{ALL_CONTENTS_TARGET\}>/)
  assert.match(source, /ここで変えると、すべての教材がその値にそろいます/)
  assert.match(source, /set: \(value\) => setContentSetting\(scopes \? targets : null, key, value\)/)
  assert.match(source, /title="読み上げの速さ"/)
  assert.match(source, /title="正解したら自動で次へ"/)
  assert.match(source, /title="英単語の出題バランス"/)
  // トグルのつまみは左端から動かす（中央から始まるとオフでも右に寄り、オンでは枠からはみ出す）。
  assert.match(source, /'absolute left-0 top-0\.5 h-6 w-6 rounded-full/)
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

test('教材の行はその教材で効く設定を開き、設定のいちばん上から教材へ進める', () => {
  const menu = read('../src/components/SpeechSettings.jsx')
  const store = read('../src/store/useStore.js')
  const defaultSettings = store.slice(
    store.indexOf('const DEFAULT_SETTINGS'),
    store.indexOf('export const createInitialLearningState'),
  )
  const settingKeys = [...defaultSettings.matchAll(/^  (\w+):/gm)]
    .map((match) => match[1])
  const groupedKeys = CONTENT_SETTING_GROUPS.flatMap((group) => group.settings)
  const settingsOf = (screen) => APP_MENU_CONTENT_ITEMS.find((item) => item.screen === screen).settings
  const screensUsing = (key) => APP_MENU_CONTENT_ITEMS
    .filter((item) => item.settings.includes(key))
    .map((item) => item.screen)

  // 学ぶ内容の行だけが設定を開く。ホーム・道具・保存・記録・設定の行は押すとそのまま開く。
  assert.deepEqual(APP_MENU_CONTENT_ITEMS.map((item) => item.screen), [
    'home', 'mathMap', 'kotenList', 'kanbunHome', 'literatureLibrary',
    'vocabLevels', 'vocabSearch', 'writing', 'roots', 'readingList', 'phrases', 'grammar', 'listening',
    'diagnostic', 'dictation',
  ])
  assert.equal(APP_MENU_ITEMS.find((item) => item.screen === 'portal').settings, undefined)
  // 保存される設定は、どれもいずれかの教材の設定に並ぶ。
  assert.deepEqual([...groupedKeys].sort(), [...settingKeys].sort())
  for (const key of settingKeys) assert.ok(screensUsing(key).length > 0, `${key} を使う教材がない`)
  assert.deepEqual(settingsOf('home'), groupedKeys)
  for (const item of APP_MENU_SECTIONS.find((menuSection) => menuSection.id === 'english').items) {
    for (const key of item.settings) assert.ok(settingsOf('home').includes(key), `英語アプリに ${item.label} の ${key} が無い`)
  }
  assert.deepEqual(settingsOf('mathMap'), [])
  assert.deepEqual(settingsOf('kotenList'), ['revealAnswers', 'sessionSize', 'autoAdvanceCorrect'])
  assert.deepEqual(settingsOf('kanbunHome'), ['revealAnswers', 'sessionSize', 'autoAdvanceCorrect'])
  assert.deepEqual(settingsOf('diagnostic'), ['ttsRate', 'ttsVoiceURI'])
  // 出題バランスは級・分野から始める英単語だけ。日本語の声は、訳や古典・漢文を読み上げる教材と、
  // 意味・例文の意味を読む英単語・熟語・構文の暗記カードを開く教材だけ。読み上げる範囲は、その暗記カードを開く教材だけ。
  assert.deepEqual(screensUsing('vocabMix'), ['home', 'vocabLevels'])
  assert.deepEqual(
    screensUsing('ttsJapaneseVoiceURI'),
    ['home', 'literatureLibrary', 'vocabLevels', 'vocabSearch', 'roots', 'readingList', 'phrases'],
  )
  assert.deepEqual(
    screensUsing('speechRange'),
    ['home', 'literatureLibrary', 'vocabLevels', 'vocabSearch', 'roots', 'readingList', 'phrases'],
  )
  assert.deepEqual(screensUsing('speechRange'), screensUsing('autoSpeak').filter((screen) => screen !== 'dictation'))
  assert.equal(contentSettingsSummary({ settings: settingsOf('writing') }), '問題数・読み上げ')
  assert.equal(contentSettingsSummary({ settings: settingsOf('kotenList') }), '答えの表示・問題数・自動で次へ')
  assert.equal(contentSettingsSummary({ settings: [] }), '変えられる設定はありません')

  // 教材の画面が読んでいる設定は、その教材の設定に必ず並ぶ（画面へ設定を足したら台帳にも足す）。
  // 日本語の声はどの読み上げにも引数で渡るため、ソースの字面では判定しない。
  const markers = [
    ['revealAnswers', /revealAnswers/],
    ['hideSpelling', /hideSpelling/],
    ['sessionSize', /sessionSize|useSessionSize/],
    ['autoAdvanceCorrect', /showAutoAdvance/],
    ['vocabMix', /vocabMix/],
    ['dailyGoal', /dailyGoal/],
    ['autoSpeak', /autoSpeak|useCardAutoSpeech/],
    ['speechRange', /speechRange|useCardAutoSpeech/],
    ['showPhonetic', /showPhonetic/],
    ['ttsRate', /<SpeakButton|ttsRate|playSpeechItems/],
    ['ttsVoiceURI', /<SpeakButton|ttsVoiceURI|playSpeechItems/],
  ]
  const ownFiles = {
    mathMap: ['screens/MathMap', 'screens/MathUnits', 'screens/MathSolve', 'screens/MathIntro'],
    kotenList: [
      'screens/KotenList', 'screens/KotenStudy', 'screens/KotenQuiz',
      'screens/KotenGrammar', 'screens/KotenGrammarStudy', 'screens/KotenGrammarQuiz',
      'screens/KotenCulture', 'screens/KotenCultureStudy', 'screens/KotenCultureQuiz',
      'screens/KotenInterpretationList', 'screens/KotenInterpretationPrep', 'screens/KotenInterpretationQuiz',
    ],
    kanbunHome: [
      'screens/KanbunHome', 'screens/KanbunCatalog', 'screens/KanbunStudy', 'screens/KanbunQuiz',
      'screens/KanbunKundoku', 'screens/KanbunKundokuQuiz',
    ],
    literatureLibrary: ['screens/LiteratureLibrary', 'screens/LiteratureReader', 'components/LiteratureVocabularySheet'],
    vocabLevels: ['screens/VocabLevels', 'screens/VocabGroups', 'screens/VocabDecks', 'screens/VocabStudy', 'screens/VocabQuiz'],
    vocabSearch: ['screens/VocabSearch', 'screens/WordDetail'],
    writing: ['screens/Writing', 'screens/WritingPlay', 'screens/WritingExam', 'screens/WritingGrammarReview'],
    roots: ['screens/Roots', 'screens/RootDetail', 'screens/EtymologyPack', 'screens/EtymologyStudy', 'screens/EtymologyQuiz'],
    readingList: [
      'screens/ReadingList', 'screens/ReadingPrep', 'screens/Reader', 'screens/ReadingSummary', 'screens/SceneBundles',
      'components/ExtendedReader', 'components/LongSentenceTranslation', 'components/SceneBundles',
    ],
    phrases: ['screens/Phrases', 'screens/PhraseStudy', 'screens/PhraseQuiz'],
    grammar: ['screens/Grammar', 'screens/GrammarLessons', 'screens/GrammarQuiz', 'screens/GrammarStrands'],
    listening: ['screens/Listening', 'screens/ListeningQuiz'],
    diagnostic: ['screens/Diagnostic'],
    dictation: ['screens/Dictation', 'screens/DictationPlay'],
  }
  assert.deepEqual(Object.keys(ownFiles).sort(), APP_MENU_CONTENT_ITEMS.map((item) => item.screen).filter((screen) => screen !== 'home').sort())
  for (const [screen, files] of Object.entries(ownFiles)) {
    for (const file of files) {
      const source = read(`../src/${file}.jsx`)
      for (const [key, pattern] of markers) {
        if (pattern.test(source)) {
          assert.ok(settingsOf(screen).includes(key), `${file} は ${key} を読むのに、${screen} の設定に無い`)
        }
      }
    }
  }
  // 語源学習の入口は1回の数を決め打ちせず、「1回の問題数」の設定で組む。
  for (const file of ['screens/Roots', 'screens/EtymologyPack', 'screens/RootDetail']) {
    assert.doesNotMatch(read(`../src/${file}.jsx`), /SESSION_SIZE\b|LEARN_BATCH/, file)
  }

  // 行は設定を開き、設定画面のいちばん上の「◯◯を開く」から教材へ進む。
  assert.match(menu, /const opensSettings = Array\.isArray\(item\.settings\)/)
  assert.match(menu, /onOpenContentSettings\?\.\(item\)/)
  assert.match(menu, /data-menu-content-settings=\{opensSettings \? item\.screen : undefined\}/)
  assert.match(menu, /data-content-settings=\{item\.screen\}/)
  assert.match(menu, /data-content-settings-open/)
  assert.match(menu, /\{item\.label\}を開く/)
  assert.match(menu, /onOpen=\{\(\) => openScreen\(contentSettingsItem\.screen\)\}/)
  assert.match(menu, /'content-settings': contentSettingsItem \? `\$\{contentSettingsItem\.label\}の設定` : '設定'/)
  // 教材の設定はその教材だけの値を変え、英語アプリの行は英語の教材すべてをまとめて変える。
  assert.match(menu, /\{ scopes: englishApp \? ENGLISH_SETTING_SCOPES : \[item\.screen\] \}/)
  assert.match(menu, /<SettingTargetContext\.Provider value=\{target\}>/)
  assert.match(menu, /この教材だけの設定です。ほかの教材の設定は変わりません。/)
  assert.match(menu, /英語の教材すべてに、まとめて反映します。/)
  assert.match(menu, /教材ごとに異なります。選ぶと、まとめてそろえます/)
  assert.doesNotMatch(menu, /同じ設定を使うほかの教材にも反映されます/)
  // 教材ごとの設定と全体の設定は、同じ部品（保存される設定1つにつき1つ）を並べる。
  for (const key of settingKeys) assert.match(menu, new RegExp(`\\n  ${key}: [A-Za-z]+Setting,`), key)
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
      // 正解後の自動送りは、問題画面の上部でもすぐ切り替える（メニューの設定にも置く）。
      'components/QuestionSessionControls.jsx',
      // 復習と未修の配分は、読み上げ欄と同じ画面下部の枠でも切り替える（メニューの設定にも置く）。
      'components/VocabMixConsole.jsx',
    ]],
    // メニューの教材の設定と全体の設定は、選んだ教材の値を変える。
    ['setContentSetting', ['components/SpeechSettings.jsx']],
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
  assert.match(gameSettings, /生徒の考え方や表情と、先生からの手掛かりを表示します/)
  assert.doesNotMatch(gameSettings, /対戦・攻撃・HP/)
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

test('全画面共通の読み上げ再生パネルに6操作を一つずつ備える', () => {
  const shell = read('../src/components/AppShell.jsx')
  const consoleSource = read('../src/components/SpeechConsole.jsx')
  const player = read('../src/lib/speech-player.js')
  const speakButton = read('../src/components/SpeakButton.jsx')

  assert.match(shell, /<GlobalSpeechConsole \/>/)
  assert.match(consoleSource, /aria-label="読み上げ再生パネル"/)
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

test('読み上げを持つ全30 UIモジュールが共通プレイヤー経由になる', () => {
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

  assert.equal(speechUi.length, 30)
  assert.equal(screenCount, 22)
  assert.ok(speechUi.some(({ path }) => path === 'components/LiteratureVocabularySheet.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'screens/Reader.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'components/ReadingSentenceDetail.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'screens/LiteratureReader.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'screens/ListeningQuiz.jsx'))
  assert.ok(speechUi.some(({ path }) => path === 'screens/DictationPlay.jsx'))
  assert.doesNotMatch(read('../src/screens/Reader.jsx'), /const stopPlay|stepChunk/)
  assert.doesNotMatch(read('../src/screens/LiteratureReader.jsx'), /PACES|paceId/)
})
