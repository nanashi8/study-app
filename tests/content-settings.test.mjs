import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { APP_MENU_CONTENT_ITEMS } from '../src/lib/appMenu.js'
import {
  ENGLISH_SETTING_SCOPES,
  SCOPE_SCREENS,
  SETTING_SCOPES,
  SHARED_SCREENS,
  applySettingChange,
  effectiveSettings,
  settingsScopeFor,
} from '../src/lib/contentSettings.js'
import { decodeProgress, encodeProgress, selectProgressState } from '../src/lib/progressCode.js'
import { normalizeSettings, useStore } from '../src/store/useStore.js'

const at = (screen, ...below) => ({
  screen,
  stack: below.reverse().map((name) => ({ screen: name, params: {} })),
})

test('どの画面も、開いた教材の値を使う（共通の暗記・テスト・結果・辞書は開いた教材から）', () => {
  const cases = [
    [at('vocabStudy', 'vocabLevels', 'home', 'portal'), 'vocabLevels'],
    [at('vocabStudy', 'readingPrep', 'readingList', 'home'), 'readingList'],
    [at('sessionResult', 'vocabStudy', 'readingPrep', 'readingList'), 'readingList'],
    [at('vocabQuiz', 'etymologyPack', 'roots'), 'roots'],
    [at('wordDetail', 'vocabStudy', 'vocabLevels'), 'vocabLevels'],
    [at('phraseStudy', 'vocabSearch', 'home'), 'vocabSearch'],
    [at('kotenStudy', 'literatureReader', 'literatureLibrary'), 'literatureLibrary'],
    [at('kotenStudy', 'kotenList'), 'kotenList'],
    [at('sessionResult', 'grammarQuiz', 'grammar'), 'grammar'],
    [at('kanbunQuiz', 'kanbunHome'), 'kanbunHome'],
    [at('reader', 'readingList'), 'readingList'],
    // 教材の画面を通らずに開いたとき（単語帳・記録）は、その画面の教材を使う。
    // 古い教材が履歴の奥に残っていても拾わない。
    [at('vocabStudy', 'myList', 'kotenStudy', 'kotenList'), 'vocabLevels'],
    [at('kotenStudy', 'myLearning', 'vocabStudy', 'vocabLevels'), 'kotenList'],
    [at('vocabStudy', 'diagnostic'), 'vocabLevels'],
    [at('wordDetail', 'myList'), 'vocabSearch'],
    [at('myList'), 'vocabLevels'],
    [at('portal'), null],
    [at('progress'), null],
  ]
  for (const [state, expected] of cases) {
    assert.equal(
      settingsScopeFor(state),
      expected,
      [state.screen, ...[...state.stack].reverse().map((entry) => entry.screen)].join(' ← '),
    )
  }
})

test('値を持つ教材は、メニューの教材の行と画面の持ち主で食い違わない', () => {
  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
  const routes = [...app.slice(app.indexOf('const SCREENS = {')).matchAll(/^  ([a-zA-Z]+):/gm)]
    .map((match) => match[1])
  assert.deepEqual(
    [...SETTING_SCOPES].sort(),
    APP_MENU_CONTENT_ITEMS.filter((item) => item.screen !== 'home' && item.settings.length).map((item) => item.screen).sort(),
  )
  assert.deepEqual(Object.keys(SCOPE_SCREENS).sort(), [...SETTING_SCOPES].sort())
  assert.deepEqual(ENGLISH_SETTING_SCOPES, [
    'vocabLevels', 'vocabSearch', 'writing', 'roots', 'readingList', 'phrases', 'grammar', 'listening', 'diagnostic', 'dictation',
  ])
  // 1つの画面の持ち主は1教材だけ。共通の画面は持ち主を持たない。
  const owned = Object.values(SCOPE_SCREENS).flat()
  assert.equal(new Set(owned).size, owned.length)
  for (const screen of Object.keys(SHARED_SCREENS)) assert.ok(!owned.includes(screen), screen)
  // どの公開画面も、持ち主の教材・共通の画面・教材を持たない画面のどれかに分ける。
  const unscoped = [
    'portal', 'login', 'home', 'myLearning', 'myList', 'customWords', 'vocabCamera', 'progress', 'settings',
    'wordRequests', 'mathMap', 'mathUnits', 'mathIntro', 'mathSolve', 'mathHistory', 'mathStory', 'mathStoryQuiz',
  ]
  for (const route of routes) {
    assert.ok(
      owned.includes(route) || Object.hasOwn(SHARED_SCREENS, route) || unscoped.includes(route),
      `${route} がどの教材の設定を使うか決まっていない`,
    )
  }
  for (const shared of Object.values(SHARED_SCREENS)) {
    for (const scope of [shared.primary, ...(shared.scopes ?? [])].filter(Boolean)) {
      assert.ok(SETTING_SCOPES.includes(scope), scope)
    }
  }
})

test('教材の値は、その教材だけを変え、無い値は全体の値を使う', () => {
  const base = normalizeSettings({ sessionSize: 10, ttsVoiceURI: 'voice-a' })
  const grammar = applySettingChange(base, 'sessionSize', 20, { scopes: ['grammar'] })
  assert.equal(effectiveSettings(grammar, 'grammar').sessionSize, 20)
  assert.equal(effectiveSettings(grammar, 'vocabLevels').sessionSize, 10)
  assert.equal(effectiveSettings(grammar, null).sessionSize, 10)

  // 「自動」の声（null）は、クラウドが消さない空文字で持ち、読むときに null へ戻す。
  const autoVoice = applySettingChange(grammar, 'ttsVoiceURI', null, { scopes: ['grammar'] })
  assert.equal(autoVoice.byContent.grammar.ttsVoiceURI, '')
  assert.equal(effectiveSettings(autoVoice, 'grammar').ttsVoiceURI, null)
  assert.equal(effectiveSettings(autoVoice, 'listening').ttsVoiceURI, 'voice-a')

  // 片方をONにすると、同じ教材のもう片方が外れる。
  const reveal = applySettingChange(base, 'hideSpelling', true, { scopes: ['vocabLevels'] })
  const both = applySettingChange(reveal, 'revealAnswers', true, { scopes: ['vocabLevels'] })
  assert.equal(effectiveSettings(both, 'vocabLevels').revealAnswers, true)
  assert.equal(effectiveSettings(both, 'vocabLevels').hideSpelling, false)

  // 全体の設定は、教材ごとの同じ設定を外して、すべての教材をそろえる。ほかの設定は残す。
  const withVoice = applySettingChange(autoVoice, 'ttsRate', 0.7, { scopes: ['grammar'] })
  const all = applySettingChange(withVoice, 'sessionSize', 30, { scopes: null, clearOverrides: true })
  assert.equal(effectiveSettings(all, 'grammar').sessionSize, 30)
  assert.equal(effectiveSettings(all, 'vocabLevels').sessionSize, 30)
  assert.equal(effectiveSettings(all, 'grammar').ttsRate, 0.7)

  // 知らない教材・知らない設定は読み込まない。両方ONで届いたら「開いたまま」を残す。
  const normalized = normalizeSettings({
    byContent: {
      grammar: { sessionSize: 5, unknown: 1 },
      notAContent: { sessionSize: 50 },
      vocabLevels: { revealAnswers: true, hideSpelling: true, vocabMix: 'nope' },
      phrases: {},
    },
  })
  assert.deepEqual(normalized.byContent, {
    vocabLevels: { revealAnswers: true, hideSpelling: false, vocabMix: 'auto' },
    grammar: { sessionSize: 5 },
  })
  assert.deepEqual(normalizeSettings({}).byContent, {})

  // 読み上げる範囲は教材ごとに持ち、知らない値は「単語のみ」に直して読む。
  const ranges = normalizeSettings({
    speechRange: 'all',
    byContent: { phrases: { speechRange: 'example' }, vocabLevels: { speechRange: 'nope' } },
  })
  assert.equal(ranges.speechRange, 'word')
  assert.equal(effectiveSettings(ranges, 'phrases').speechRange, 'example')
  assert.equal(effectiveSettings(ranges, 'vocabLevels').speechRange, 'word')
  assert.equal(effectiveSettings(ranges, 'readingList').speechRange, 'word')
  const meaningOnly = applySettingChange(ranges, 'speechRange', 'meaning', { scopes: ['readingList'] })
  assert.equal(effectiveSettings(meaningOnly, 'readingList').speechRange, 'meaning')
  assert.equal(effectiveSettings(meaningOnly, 'phrases').speechRange, 'example')
})

test('学習画面の切り替えはいまの教材の値を、メニューは選んだ教材の値を変え、進捗コードでも持ち運べる', () => {
  const original = useStore.getState()
  try {
    useStore.setState({ settings: normalizeSettings({ sessionSize: 10 }) })
    // 英文法のテスト中に「1/10」から20問へ変えても、ほかの教材は10問のまま。
    useStore.setState({ screen: 'grammarQuiz', params: {}, stack: [{ screen: 'grammar', params: {} }] })
    useStore.getState().setSetting('sessionSize', 20)
    assert.equal(effectiveSettings(useStore.getState().settings, 'grammar').sessionSize, 20)
    assert.equal(effectiveSettings(useStore.getState().settings, 'vocabLevels').sessionSize, 10)

    // 長文読解から開いた単語の暗記は、長文読解の値を変える。
    useStore.setState({
      screen: 'vocabStudy',
      params: {},
      stack: [{ screen: 'readingList', params: {} }, { screen: 'readingPrep', params: {} }],
    })
    useStore.getState().setSetting('revealAnswers', true)
    assert.equal(effectiveSettings(useStore.getState().settings, 'readingList').revealAnswers, true)
    assert.equal(effectiveSettings(useStore.getState().settings, 'vocabLevels').revealAnswers, false)

    // 英語アプリの行は英語の教材すべてを、全体の設定はすべての教材をそろえる。
    useStore.getState().setContentSetting(ENGLISH_SETTING_SCOPES, 'autoAdvanceCorrect', false)
    for (const scope of ['vocabLevels', 'grammar', 'dictation']) {
      assert.equal(effectiveSettings(useStore.getState().settings, scope).autoAdvanceCorrect, false, scope)
    }
    assert.equal(effectiveSettings(useStore.getState().settings, 'kotenList').autoAdvanceCorrect, true)
    useStore.getState().setContentSetting(null, 'autoAdvanceCorrect', true)
    for (const scope of SETTING_SCOPES) {
      assert.equal(effectiveSettings(useStore.getState().settings, scope).autoAdvanceCorrect, true, scope)
    }

    const restored = decodeProgress(encodeProgress(selectProgressState(useStore.getState())))
    assert.equal(effectiveSettings(normalizeSettings(restored.settings), 'grammar').sessionSize, 20)
    assert.equal(effectiveSettings(normalizeSettings(restored.settings), 'readingList').revealAnswers, true)
  } finally {
    useStore.setState(original, true)
  }
})

test('設定を読む画面と部品は、いまの教材の値を読む', () => {
  const read = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8')
  const readers = [
    'screens/LiteratureReader.jsx', 'screens/PhraseStudy.jsx', 'screens/DictationPlay.jsx', 'screens/SessionResult.jsx',
    'screens/KotenCultureStudy.jsx', 'screens/KotenStudy.jsx', 'screens/EtymologyStudy.jsx', 'screens/KotenGrammarStudy.jsx',
    'screens/Reader.jsx', 'screens/ListeningQuiz.jsx', 'screens/VocabStudy.jsx', 'screens/VocabQuiz.jsx', 'screens/KanbunStudy.jsx',
    'components/SpeakButton.jsx', 'components/SpeechConsole.jsx', 'components/VocabMixConsole.jsx', 'components/ExtendedReader.jsx',
    'components/LongSentenceTranslation.jsx', 'components/RevealAnswers.jsx', 'components/SessionSize.jsx',
    'components/QuestionSessionControls.jsx', 'components/LiteratureVocabularySheet.jsx',
    'components/useCardAutoSpeech.js',
  ]
  for (const path of readers) assert.match(read(path), /useContentSettings\(\)/, path)
  // 画面や部品から全体の値を直接読まない（メニューの設定画面だけが全教材の値を見比べる）。
  for (const path of readers) {
    assert.doesNotMatch(read(path), /state\.settings|s\.settings\b|store\.settings|getState\(\)\.settings/, path)
  }
})
