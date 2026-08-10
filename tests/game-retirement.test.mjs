import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  RETIRED_GAME_SCREENS,
  isRetiredGameSource,
  learnerDestination,
} from '../src/lib/learnerVisibility.js'

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('終了したゲームの全画面は学習ホームへ退避する', () => {
  assert.deepEqual(RETIRED_GAME_SCREENS, [
    'englishMap',
    'afterSchoolChronicle',
    'afterSchoolInterlude',
    'characterTalk',
    'storyAlbum',
  ])
  for (const screen of RETIRED_GAME_SCREENS) {
    assert.deepEqual(learnerDestination(screen, { retained: true }), {
      screen: 'home',
      params: {},
    })
  }
  assert.deepEqual(learnerDestination('readingList', { levelId: '2' }), {
    screen: 'readingList',
    params: { levelId: '2' },
  })
})

test('旧ゲーム出題は汎用クイズ・結果画面からも再表示しない', () => {
  const sources = [
    { type: 'battle' },
    { type: 'dragonVein' },
    { type: 'dragonVeinPhrase' },
    { type: 'level', gameMode: 'dragonVein' },
  ]
  for (const source of sources) {
    assert.equal(isRetiredGameSource(source), true)
    for (const screen of ['vocabQuiz', 'phraseQuiz', 'sessionResult']) {
      assert.deepEqual(learnerDestination(screen, { source }), {
        screen: 'home',
        params: {},
      })
    }
  }
  assert.equal(isRetiredGameSource({ type: 'level' }), false)
})

test('ホーム・共通メニュー・診断からゲーム導線を除き、保存互換性は維持する', async () => {
  const [app, home, menu, diagnostic, progressCode, cloud, store] = await Promise.all([
    read('../src/App.jsx'),
    read('../src/screens/Home.jsx'),
    read('../src/components/SpeechSettings.jsx'),
    read('../src/lib/diagnostic.js'),
    read('../src/lib/progressCode.js'),
    read('../src/lib/cloudSync.js'),
    read('../src/store/useStore.js'),
  ])

  assert.doesNotMatch(app, /EnglishMapScreen|AfterSchoolChronicleScreen|AfterSchoolInterludeScreen|CharacterTalkScreen|StoryAlbumScreen/)
  assert.doesNotMatch(home, /afterSchoolChronicle|englishMap|data-home-mode-group="game"|龍脈/)
  assert.doesNotMatch(menu, /GameSettingsPanel|afterSchoolChronicle|storyAlbum|龍脈/)
  assert.doesNotMatch(diagnostic, /englishMap|学習マップ|龍脈/)

  for (const source of [progressCode, cloud, store]) {
    assert.match(source, /dragonVeinProgress/)
  }
  assert.match(progressCode, /PERSISTED_PROGRESS_FIELDS/)
  assert.match(store, /partialize:\s*selectProgressState/)
})
