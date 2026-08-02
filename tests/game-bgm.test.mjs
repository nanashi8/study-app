import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'

import { BATTLE_DAILY_SCENES } from '../src/lib/battleCast.js'
import { LEVELS } from '../src/data/levels.js'
import {
  BOSS_BGM_BY_ENEMY_ID,
  DAILY_BGM_BY_SCENE_ID,
  GAME_BGM_TRACKS,
  RANK_BGM_BY_LEVEL_ID,
  RESULT_BGM_BY_VERDICT_ID,
} from '../src/data/game-bgm.js'
import {
  GAME_SOUNDTRACK_PRODUCTION_BY_TRACK_ID,
  GAME_SOUNDTRACK_VERSION,
} from '../src/data/game-soundtrack-production.js'
import { bgmEventsAtStep, bgmTotalSteps } from '../src/lib/gameBgmSequencer.js'
import { gameBgmTrackForState } from '../src/lib/gameBgmRouter.js'
import { CHAPTERS, TEACHER_RIVALS } from '../src/lib/rpg.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import { buildSoundtrackArrangement } from '../scripts/game-soundtrack-arrangement.mjs'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const soundtrackDirectory = new URL('../public/assets/bgm/school-ensemble/', import.meta.url)

function m4aDurationSeconds(buffer) {
  const index = buffer.indexOf(Buffer.from('mvhd'))
  assert.ok(index >= 0, 'M4Aにmvhd atomがありません')
  const version = buffer[index + 4]
  if (version === 0) {
    return buffer.readUInt32BE(index + 20) / buffer.readUInt32BE(index + 16)
  }
  return Number(buffer.readBigUInt64BE(index + 28)) / buffer.readUInt32BE(index + 24)
}

test('ゲームBGMは11日常・7級・11先生・3結果の全32曲を持つ', () => {
  assert.equal(GAME_BGM_TRACKS.length, 32)
  assert.deepEqual(
    Object.fromEntries(
      ['daily', 'rank', 'boss', 'result'].map((category) => [
        category,
        GAME_BGM_TRACKS.filter((track) => track.category === category).length,
      ]),
    ),
    { daily: 11, rank: 7, boss: 11, result: 3 },
  )
  assert.equal(new Set(GAME_BGM_TRACKS.map((track) => track.id)).size, 32)
  assert.equal(new Set(GAME_BGM_TRACKS.map((track) => track.title)).size, 32)
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

test('全曲が約3分で、元譜とサウンドトラック編曲を有限値だけで生成する', () => {
  let totalSeconds = 0
  let eventCount = 0
  let soundtrackNoteCount = 0
  for (const track of GAME_BGM_TRACKS) {
    totalSeconds += track.durationSeconds
    assert.ok(track.durationSeconds >= 170 && track.durationSeconds <= 190, track.id)
    assert.equal(track.license, 'original-rendered-soundtrack', track.id)
    assert.equal(track.soundtrackVersion, GAME_SOUNDTRACK_VERSION, track.id)
    assert.equal(track.audioPath, `assets/bgm/school-ensemble/${track.id}.m4a`, track.id)
    assert.ok(track.ensemble.length >= 10, track.id)

    const arrangement = buildSoundtrackArrangement(track)
    soundtrackNoteCount += arrangement.noteCount
    assert.ok(arrangement.instruments.length >= 6, track.id)
    assert.ok(arrangement.noteCount >= 1_000, track.id)
    assert.equal(arrangement.ensemble, track.ensemble, track.id)
    for (const notes of Object.values(arrangement.notesByRole)) {
      for (const note of notes) {
        assert.ok(Number.isFinite(note.startBeat), track.id)
        assert.ok(Number.isFinite(note.durationBeats), track.id)
        assert.ok(note.note >= 0 && note.note <= 127, track.id)
        assert.ok(note.velocity >= 1 && note.velocity <= 127, track.id)
      }
    }

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
  assert.ok(soundtrackNoteCount > 100_000)
})

test('32曲の完成済みAACが全件そろい、manifest・尺・容量が一致する', () => {
  assert.equal(existsSync(soundtrackDirectory), true)
  const manifest = JSON.parse(readFileSync(new URL('manifest.json', soundtrackDirectory), 'utf8'))
  const files = readdirSync(soundtrackDirectory).filter((name) => name.endsWith('.m4a'))
  assert.equal(manifest.version, GAME_SOUNDTRACK_VERSION)
  assert.equal(manifest.renderedTrackCount, GAME_BGM_TRACKS.length)
  assert.deepEqual(
    new Set(files.map((name) => name.slice(0, -4))),
    new Set(GAME_BGM_TRACKS.map((track) => track.id)),
  )
  assert.deepEqual(
    new Set(Object.keys(GAME_SOUNDTRACK_PRODUCTION_BY_TRACK_ID)),
    new Set(GAME_BGM_TRACKS.map((track) => track.id)),
  )

  const manifestById = new Map(manifest.tracks.map((entry) => [entry.id, entry]))
  let totalBytes = 0
  for (const track of GAME_BGM_TRACKS) {
    const audioUrl = new URL(`../public/${track.audioPath}`, import.meta.url)
    const audio = readFileSync(audioUrl)
    const entry = manifestById.get(track.id)
    totalBytes += statSync(audioUrl).size
    assert.equal(audio.subarray(4, 8).toString('ascii'), 'ftyp', track.id)
    assert.ok(Math.abs(m4aDurationSeconds(audio) - track.durationSeconds) < 0.15, track.id)
    assert.equal(entry.bytes, audio.length, track.id)
    assert.equal(entry.path, track.audioPath, track.id)
    assert.equal(entry.noteCount, buildSoundtrackArrangement(track).noteCount, track.id)
  }
  assert.ok(totalBytes > 85 * 1024 * 1024)
  assert.ok(totalBytes < 110 * 1024 * 1024)
})

test('放課後と魔法の言葉は11の日常曲を物語順に循環し、通常学習では鳴らない', () => {
  const firstCycle = BATTLE_DAILY_SCENES.map((scene, storyStep) => {
    const track = gameBgmTrackForState({ screen: 'afterSchoolChronicle', storyStep })
    assert.equal(track, DAILY_BGM_BY_SCENE_ID.get(scene.id))
    return track.id
  })
  assert.equal(new Set(firstCycle).size, 11)
  assert.equal(
    gameBgmTrackForState({
      screen: 'afterSchoolInterlude',
      storyStep: BATTLE_DAILY_SCENES.length,
    }).id,
    firstCycle[0],
  )
  assert.equal(
    gameBgmTrackForState({ screen: 'characterTalk', storyStep: 1 }).id,
    firstCycle[1],
  )
  assert.equal(gameBgmTrackForState({ screen: 'englishMap', storyStep: 1 }), null)
  assert.equal(gameBgmTrackForState({ screen: 'vocabStudy', storyStep: 1 }), null)
  assert.equal(gameBgmTrackForState({ screen: 'reader', storyStep: 1 }), null)
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
  const settings = read('../src/components/GameSettings.jsx')
  const store = read('../src/store/useStore.js')
  const player = read('../src/lib/gameBgmPlayer.js')

  assert.match(app, /<GameBgmController \/>/)
  assert.match(settings, />\s*放課後と魔法の言葉 BGM\s*</)
  assert.match(settings, /通常の単語・文法・長文など学習画面では鳴りません/)
  assert.match(settings, /setSetting\('bgmEnabled'/)
  assert.match(settings, /setSetting\('bgmVolume'/)
  assert.match(store, /bgmEnabled:\s*true/)
  assert.match(store, /bgmVolume:\s*0\.35/)
  assert.match(store.slice(store.indexOf('partialize:')), /settings:\s*st\.settings/)
  assert.match(app, /afterSchoolChronicle: AfterSchoolChronicleScreen/)
  assert.match(app, /afterSchoolInterlude: AfterSchoolInterludeScreen/)
  assert.match(read('../src/components/GameBgm.jsx'), /battleStoryStep/)
  assert.match(player, /speechSynthesis\?\.speaking/)
  assert.match(player, /SPEECH_DUCK_FACTOR/)
  assert.match(player, /decodeAudioData/)
  assert.match(player, /createBufferSource/)
  assert.match(player, /source\.loop = true/)
  assert.doesNotMatch(player, /createOscillator/)
})

test('BGM設定は進捗コードで端末間を移動できる', () => {
  const settings = { bgmEnabled: false, bgmVolume: 0.65 }
  const restored = decodeProgress(encodeProgress({ settings }))
  assert.deepEqual(restored.settings, settings)
})
