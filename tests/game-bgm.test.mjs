import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { BATTLE_DAILY_SCENES } from '../src/lib/battleCast.js'
import { LEVELS } from '../src/data/levels.js'
import {
  BOSS_BGM_BY_ENEMY_ID,
  DAILY_BGM_BY_SCENE_ID,
  GAME_BGM_TRACKS,
  RANK_BGM_BY_LEVEL_ID,
  RESULT_BGM_BY_VERDICT_ID,
} from '../src/data/game-bgm.js'
import { bgmEventsAtStep, bgmTotalSteps } from '../src/lib/gameBgmSequencer.js'
import { gameBgmTrackForState } from '../src/lib/gameBgmRouter.js'
import { CHAPTERS, TEACHER_RIVALS } from '../src/lib/rpg.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

test('ゲームBGMは12日常・7級・11先生・3結果の全33曲を持つ', () => {
  assert.equal(GAME_BGM_TRACKS.length, 33)
  assert.deepEqual(
    Object.fromEntries(
      ['daily', 'rank', 'boss', 'result'].map((category) => [
        category,
        GAME_BGM_TRACKS.filter((track) => track.category === category).length,
      ]),
    ),
    { daily: 12, rank: 7, boss: 11, result: 3 },
  )
  assert.equal(new Set(GAME_BGM_TRACKS.map((track) => track.id)).size, 33)
  assert.equal(new Set(GAME_BGM_TRACKS.map((track) => track.title)).size, 33)
  assert.deepEqual(
    new Set(DAILY_BGM_BY_SCENE_ID.keys()),
    new Set(BATTLE_DAILY_SCENES.map((scene) => scene.id)),
  )
  assert.deepEqual(
    new Set(RANK_BGM_BY_LEVEL_ID.keys()),
    new Set(LEVELS.map((level) => level.id)),
  )
  assert.deepEqual(
    new Set(BOSS_BGM_BY_ENEMY_ID.keys()),
    new Set(Object.keys(TEACHER_RIVALS)),
  )
  assert.deepEqual(
    new Set(RESULT_BGM_BY_VERDICT_ID.keys()),
    new Set(['victory', 'draw', 'retreat']),
  )
})

test('全曲が約3分で、全音符イベントを有限値だけで生成する', () => {
  let totalSeconds = 0
  let eventCount = 0
  for (const track of GAME_BGM_TRACKS) {
    totalSeconds += track.durationSeconds
    assert.ok(track.durationSeconds >= 170 && track.durationSeconds <= 190, track.id)
    assert.equal(track.license, 'original-procedural', track.id)

    const kinds = new Set()
    for (let step = 0; step < bgmTotalSteps(track); step += 1) {
      for (const event of bgmEventsAtStep(track, step)) {
        eventCount += 1
        kinds.add(event.kind)
        for (const value of [event.midi, event.durationSteps, event.velocity, ...(event.notes ?? [])]) {
          if (value !== undefined) assert.equal(Number.isFinite(value), true, `${track.id}: ${step}`)
        }
      }
    }
    assert.equal(kinds.has('chord'), true, track.id)
    assert.equal(kinds.has('tone'), true, track.id)
    assert.equal(kinds.has('drum'), track.drums !== 'none', track.id)
  }
  assert.ok(totalSeconds >= 96 * 60 && totalSeconds <= 103 * 60)
  assert.ok(eventCount > 60_000)
})

test('放課後マップは12の日常曲を日替わりで循環する', () => {
  const firstCycle = BATTLE_DAILY_SCENES.map((scene, day) => {
    const track = gameBgmTrackForState({ screen: 'englishMap', day })
    assert.equal(track, DAILY_BGM_BY_SCENE_ID.get(scene.id))
    return track.id
  })
  assert.equal(new Set(firstCycle).size, 12)
  assert.equal(
    gameBgmTrackForState({ screen: 'englishMap', day: 12 }).id,
    firstCycle[0],
  )
  assert.equal(
    gameBgmTrackForState({ screen: 'englishMap', day: -1 }).id,
    firstCycle.at(-1),
  )
})

test('通常戦は英検級曲、章末戦は先生ごとの専用曲を選ぶ', () => {
  for (const [levelIndex, level] of LEVELS.entries()) {
    const track = gameBgmTrackForState({
      screen: 'vocabQuiz',
      params: {
        source: {
          type: 'battle',
          levelIndex,
          levelId: level.id,
          heroLevel: 1,
          adventureDay: 0,
        },
      },
    })
    assert.equal(track, RANK_BGM_BY_LEVEL_ID.get(level.id), level.id)
  }

  for (const chapter of CHAPTERS) {
    const track = gameBgmTrackForState({
      screen: 'vocabQuiz',
      params: {
        source: {
          type: 'battle',
          levelIndex: 0,
          levelId: '5',
          heroLevel: chapter.maxLevel,
          adventureDay: 0,
        },
      },
    })
    assert.equal(track, BOSS_BGM_BY_ENEMY_ID.get(chapter.boss.id), chapter.boss.id)
  }
})

test('バトル結果は勝利・互角・撤退の3曲へ正答率で切り替わる', () => {
  const resultTrack = (correct, total = 10) => gameBgmTrackForState({
    screen: 'sessionResult',
    params: { source: { type: 'battle' }, correct, total },
  })
  assert.equal(resultTrack(10), RESULT_BGM_BY_VERDICT_ID.get('victory'))
  assert.equal(resultTrack(7), RESULT_BGM_BY_VERDICT_ID.get('victory'))
  assert.equal(resultTrack(4), RESULT_BGM_BY_VERDICT_ID.get('draw'))
  assert.equal(resultTrack(3), RESULT_BGM_BY_VERDICT_ID.get('retreat'))
  assert.equal(resultTrack(0, 0), RESULT_BGM_BY_VERDICT_ID.get('retreat'))
  assert.equal(gameBgmTrackForState({ screen: 'home' }), null)
})

test('全画面コントローラー・音量設定・読み上げダッキングを備える', () => {
  const app = read('../src/App.jsx')
  const settings = read('../src/components/SpeechSettings.jsx')
  const store = read('../src/store/useStore.js')
  const player = read('../src/lib/gameBgmPlayer.js')

  assert.match(app, /<GameBgmController \/>/)
  assert.match(settings, />\s*ゲームBGM\s*</)
  assert.match(settings, /setSetting\('bgmEnabled'/)
  assert.match(settings, /setSetting\('bgmVolume'/)
  assert.match(store, /bgmEnabled:\s*true/)
  assert.match(store, /bgmVolume:\s*0\.35/)
  assert.match(store.slice(store.indexOf('partialize:')), /settings:\s*st\.settings/)
  assert.match(player, /speechSynthesis\?\.speaking/)
  assert.match(player, /SPEECH_DUCK_FACTOR/)
})

test('BGM設定は進捗コードで端末間を移動できる', () => {
  const settings = { bgmEnabled: false, bgmVolume: 0.65 }
  const restored = decodeProgress(encodeProgress({ settings }))
  assert.deepEqual(restored.settings, settings)
})
