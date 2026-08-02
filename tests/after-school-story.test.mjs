import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { BATTLE_DAILY_SCENES } from '../src/lib/battleCast.js'
import {
  AFTER_SCHOOL_CHRONICLE,
  AFTER_SCHOOL_STORY_PHASES,
  MAX_BATTLE_STORY_STEP,
  afterSchoolEpisodeNumber,
  afterSchoolSceneForStep,
  normalizeBattleStoryStep,
} from '../src/lib/afterSchoolStory.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import { useStore } from '../src/store/useStore.js'

test('放課後ことば探検記は日常・対決・日誌の3段階を持つ', () => {
  assert.equal(AFTER_SCHOOL_CHRONICLE.title, '放課後ことば探検記')
  assert.equal(AFTER_SCHOOL_CHRONICLE.keyVisual.endsWith('.webp'), true)
  assert.deepEqual(
    AFTER_SCHOOL_STORY_PHASES.map((phase) => phase.id),
    ['daily', 'challenge', 'journal'],
  )
})

test('ゲーム入口の主要アイコンはOS絵文字に依存せず、絵文字フォントも明示する', async () => {
  const [map, css] = await Promise.all([
    readFile(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
  ])
  const chronicleScreen = map.slice(
    map.indexOf('export function AfterSchoolChronicleScreen'),
    map.indexOf('function ChroniclePortalCard'),
  )

  assert.match(map, /function ChronicleIcon/)
  assert.match(map, /data-chronicle-icon=\{kind\}/)
  assert.match(chronicleScreen, /className="after-school-game-icons pb-8"/)
  assert.match(map, /<ChronicleIcon kind=\{phase\.id\}/)
  assert.doesNotMatch(map, /<span className="text-xl" aria-hidden="true">\{phase\.emoji\}<\/span>/)
  assert.match(css, /\.chronicle-vector-icon/)
  assert.match(css, /font-variant-emoji:\s*emoji/)
  assert.match(css, /"Apple Color Emoji"/)
  assert.match(css, /"Segoe UI Emoji"/)
  assert.match(css, /"Noto Color Emoji"/)
})

test('放課後日誌は12場面を保存済み進行順に循環する', () => {
  assert.deepEqual(
    BATTLE_DAILY_SCENES.map((scene, step) => afterSchoolSceneForStep(step).id),
    BATTLE_DAILY_SCENES.map((scene) => scene.id),
  )
  assert.equal(afterSchoolSceneForStep(BATTLE_DAILY_SCENES.length).id, BATTLE_DAILY_SCENES[0].id)
  assert.equal(afterSchoolEpisodeNumber(0), 1)
  assert.equal(normalizeBattleStoryStep(-1), 0)
  assert.equal(normalizeBattleStoryStep(MAX_BATTLE_STORY_STEP + 1), MAX_BATTLE_STORY_STEP)
})

test('放課後日誌の進行は進捗コードで往復し、不正値を拒否する', () => {
  const restored = decodeProgress(encodeProgress({ battleStoryStep: 17 }))
  assert.equal(restored.battleStoryStep, 17)
  assert.throws(
    () => decodeProgress(encodeProgress({ battleStoryStep: -1 })),
    /battleStoryStep/,
  )
})

test('対決結果から採点なしの日常パートを経てゲーム画面へ戻る', async () => {
  const [app, result, interlude, map, store, cloud] = await Promise.all([
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/SessionResult.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/AfterSchoolInterlude.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/store/useStore.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/lib/cloudSync.js', import.meta.url), 'utf8'),
  ])

  assert.match(app, /afterSchoolChronicle: AfterSchoolChronicleScreen/)
  assert.match(app, /afterSchoolInterlude: AfterSchoolInterludeScreen/)
  assert.match(result, /放課後のつづきへ/)
  assert.match(result, /navigate\('afterSchoolInterlude'/)
  assert.match(interlude, /episode\.choices\.map/)
  assert.match(interlude, /採点なし・学習評価には影響しません/)
  assert.match(interlude, /advanceBattleStory\(\)/)
  assert.match(interlude, /returnToAfterSchoolChronicle/)
  assert.match(map, /AFTER_SCHOOL_CHRONICLE\.keyVisual/)
  assert.match(store.slice(store.indexOf('partialize:')), /battleStoryStep:\s*st\.battleStoryStep/)
  assert.match(cloud, /battleStoryStep:\s*normalizeBattleStoryStep/)
})

test('日誌から校内へ戻ると対決画面の履歴を捨て、次の戻る操作はホームへ進む', () => {
  useStore.setState({
    screen: 'afterSchoolInterlude',
    params: { fromBattle: true },
    stack: [
      { screen: 'portal', params: {} },
      { screen: 'home', params: {} },
      { screen: 'afterSchoolChronicle', params: {} },
      { screen: 'vocabQuiz', params: {} },
      { screen: 'sessionResult', params: {} },
    ],
  })

  useStore.getState().returnToAfterSchoolChronicle()
  assert.equal(useStore.getState().screen, 'afterSchoolChronicle')
  assert.deepEqual(useStore.getState().stack, [
    { screen: 'portal', params: {} },
    { screen: 'home', params: {} },
  ])

  useStore.getState().back()
  assert.equal(useStore.getState().screen, 'home')
})
