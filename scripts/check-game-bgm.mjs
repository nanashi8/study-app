#!/usr/bin/env node
// ゲームBGMの全曲・全場面対応をbuild前に監査する。
// 楽譜イベントと完成済みAACの双方を全件検査し、音源欠落・破損・尺ずれを通さない。
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'

import { BATTLE_DAILY_SCENES } from '../src/lib/battleCast.js'
import { LEVELS } from '../src/data/levels.js'
import { TEACHER_RIVALS } from '../src/lib/rpg.js'
import {
  BOSS_BGM_BY_ENEMY_ID,
  DAILY_BGM_BY_SCENE_ID,
  GAME_BGM_STEPS_PER_BAR,
  GAME_BGM_TRACKS,
  RANK_BGM_BY_LEVEL_ID,
  RESULT_BGM_BY_VERDICT_ID,
  dailyBgmTrack,
  rankBgmTrack,
  resultBgmTrack,
} from '../src/data/game-bgm.js'
import {
  GAME_SOUNDTRACK_PRODUCTION_BY_TRACK_ID,
  GAME_SOUNDTRACK_VERSION,
} from '../src/data/game-soundtrack-production.js'
import {
  BGM_SCALES,
  bgmEventsAtStep,
  bgmStepSeconds,
  bgmTotalSteps,
} from '../src/lib/gameBgmSequencer.js'
import { buildSoundtrackArrangement } from './game-soundtrack-arrangement.mjs'

const failures = []
const fail = (message) => failures.push(message)
const soundtrackDirectory = new URL('../public/assets/bgm/school-ensemble/', import.meta.url)
const soundtrackManifestUrl = new URL('manifest.json', soundtrackDirectory)

function m4aDurationSeconds(buffer) {
  const marker = Buffer.from('mvhd')
  const index = buffer.indexOf(marker)
  if (index < 0 || index + 36 > buffer.length) return null
  const version = buffer[index + 4]
  if (version === 0) {
    const timescale = buffer.readUInt32BE(index + 16)
    const duration = buffer.readUInt32BE(index + 20)
    return timescale > 0 ? duration / timescale : null
  }
  if (version === 1) {
    const timescale = buffer.readUInt32BE(index + 24)
    const duration = buffer.readBigUInt64BE(index + 28)
    return timescale > 0 ? Number(duration) / timescale : null
  }
  return null
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

function expectExactSet(label, actualValues, expectedValues) {
  const actual = [...new Set(actualValues)].sort()
  const expected = [...new Set(expectedValues)].sort()
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label}: ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`)
  }
}

const expectedCategoryCounts = {
  daily: BATTLE_DAILY_SCENES.length,
  rank: 7,
  boss: 11,
  result: 3,
}
const expectedTrackCount = Object.values(expectedCategoryCounts)
  .reduce((sum, count) => sum + count, 0)
const ids = new Set()
const titles = new Set()
const arrangementSignatures = new Set()
const categoryCounts = {}
let eventCount = 0
let soundtrackNoteCount = 0
let totalSeconds = 0
let totalAudioBytes = 0

if (!existsSync(soundtrackManifestUrl)) fail('完成済みBGMのmanifest.jsonがありません')
const soundtrackManifest = existsSync(soundtrackManifestUrl)
  ? JSON.parse(readFileSync(soundtrackManifestUrl, 'utf8'))
  : { tracks: [] }
const manifestById = new Map((soundtrackManifest.tracks ?? []).map((entry) => [entry.id, entry]))

if (GAME_BGM_TRACKS.length !== expectedTrackCount) {
  fail(`曲数は${expectedTrackCount}曲必須です (${GAME_BGM_TRACKS.length})`)
}

for (const track of GAME_BGM_TRACKS) {
  const at = track.id || '(idなし)'
  categoryCounts[track.category] = (categoryCounts[track.category] ?? 0) + 1
  totalSeconds += track.durationSeconds

  if (!track.id?.trim()) fail('idなしの曲があります')
  else if (ids.has(track.id)) fail(`曲idが重複しています: ${track.id}`)
  ids.add(track.id)

  if (!track.title?.trim()) fail(`${at}: 曲名なし`)
  else if (titles.has(track.title)) fail(`曲名が重複しています: ${track.title}`)
  titles.add(track.title)

  if (!Object.hasOwn(BGM_SCALES, track.mode)) fail(`${at}: 不明な音階 ${track.mode}`)
  if (track.progression.length !== 4) fail(`${at}: コード進行は4小節必要です`)
  if (track.motif.length !== 16) fail(`${at}: モチーフは16ステップ必要です`)
  if (track.bars % 4 !== 0) fail(`${at}: 小節数は4の倍数にしてください`)
  if (track.stepsPerBar !== GAME_BGM_STEPS_PER_BAR) fail(`${at}: stepsPerBarが不一致です`)
  if (track.license !== 'original-rendered-soundtrack') fail(`${at}: オリジナル曲の権利表示がありません`)
  if (track.soundtrackVersion !== GAME_SOUNDTRACK_VERSION) fail(`${at}: 音源バージョンが不一致です`)
  if (!track.audioPath?.endsWith(`/${track.id}.m4a`)) fail(`${at}: AAC音源パスが不正です`)
  if (!track.ensemble?.trim()) fail(`${at}: 楽器編成の説明がありません`)
  if (!GAME_SOUNDTRACK_PRODUCTION_BY_TRACK_ID[track.id]) fail(`${at}: 音源プロファイルがありません`)
  if (track.durationSeconds < 170 || track.durationSeconds > 190) {
    fail(`${at}: 約3分の範囲外です (${track.durationSeconds}秒)`)
  }

  const soundtrackArrangement = buildSoundtrackArrangement(track)
  soundtrackNoteCount += soundtrackArrangement.noteCount
  if (soundtrackArrangement.instruments.length < 6) fail(`${at}: サウンドトラックが6パート未満です`)
  if (soundtrackArrangement.noteCount < 1_000) fail(`${at}: サウンドトラックの演奏音が少なすぎます`)

  const audioUrl = new URL(`../public/${track.audioPath}`, import.meta.url)
  if (!existsSync(audioUrl)) {
    fail(`${at}: 完成済みAACがありません (${track.audioPath})`)
  } else {
    const audio = readFileSync(audioUrl)
    totalAudioBytes += audio.length
    if (audio.subarray(4, 8).toString('ascii') !== 'ftyp') fail(`${at}: M4Aヘッダーが不正です`)
    const audioDuration = m4aDurationSeconds(audio)
    if (!Number.isFinite(audioDuration) || Math.abs(audioDuration - track.durationSeconds) > 0.15) {
      fail(`${at}: AACの尺が設計値と一致しません (${audioDuration} != ${track.durationSeconds})`)
    }
    if (audio.length < 2_000_000 || audio.length > 5_000_000) {
      fail(`${at}: AACのファイルサイズが想定外です (${audio.length} bytes)`)
    }
    const manifestEntry = manifestById.get(track.id)
    if (!manifestEntry) {
      fail(`${at}: manifestに収録情報がありません`)
    } else {
      if (manifestEntry.path !== track.audioPath) fail(`${at}: manifestのパスが不一致です`)
      if (manifestEntry.bytes !== audio.length) fail(`${at}: manifestのバイト数が不一致です`)
      if (manifestEntry.sha256 !== sha256(audio)) fail(`${at}: AACのSHA-256が不一致です`)
      if ((manifestEntry.instruments?.length ?? 0) < 6) fail(`${at}: 6パート未満の簡易編成です`)
      if (manifestEntry.noteCount !== soundtrackArrangement.noteCount) {
        fail(`${at}: manifestの演奏音数が編曲データと不一致です`)
      }
    }
  }

  const calculatedDuration = bgmTotalSteps(track) * bgmStepSeconds(track)
  if (Math.abs(calculatedDuration - track.durationSeconds) > 0.001) {
    fail(`${at}: 保存時間と演奏時間が一致しません`)
  }

  const signature = JSON.stringify([
    track.tempo,
    track.rootMidi,
    track.mode,
    track.progression,
    track.motif,
    track.lead,
    track.pad,
    track.bass,
    track.drums,
    track.ornament,
  ])
  if (arrangementSignatures.has(signature)) fail(`${at}: 他曲と編曲設計が重複しています`)
  arrangementSignatures.add(signature)

  const kinds = new Set()
  const roles = new Set()
  for (let step = 0; step < bgmTotalSteps(track); step += 1) {
    const first = bgmEventsAtStep(track, step)
    const second = bgmEventsAtStep(track, step)
    if (JSON.stringify(first) !== JSON.stringify(second)) {
      fail(`${at}: step ${step} の演奏が決定論的ではありません`)
      break
    }
    for (const event of first) {
      eventCount += 1
      kinds.add(event.kind)
      if (event.role) roles.add(event.role)
      const values = [event.midi, event.durationSteps, event.velocity, ...(event.notes ?? [])]
        .filter((value) => value !== undefined)
      if (values.some((value) => !Number.isFinite(value))) {
        fail(`${at}: step ${step} に有限値でないイベントがあります`)
      }
      for (const note of [event.midi, ...(event.notes ?? [])].filter(Number.isFinite)) {
        if (note < 0 || note > 127) fail(`${at}: MIDI音程が範囲外です (${note})`)
      }
    }
  }
  if (!kinds.has('chord')) fail(`${at}: 和音イベントがありません`)
  if (!kinds.has('tone') || !roles.has('lead') || !roles.has('bass')) {
    fail(`${at}: メロディーまたはベースがありません`)
  }
  if (track.drums !== 'none' && !kinds.has('drum')) fail(`${at}: ドラムイベントがありません`)
}

for (const [category, expected] of Object.entries(expectedCategoryCounts)) {
  if (categoryCounts[category] !== expected) {
    fail(`${category}曲は${expected}曲必須です (${categoryCounts[category] ?? 0})`)
  }
}

if (soundtrackManifest.version !== GAME_SOUNDTRACK_VERSION) {
  fail(`manifestの音源バージョンが不一致です (${soundtrackManifest.version})`)
}
if (!soundtrackManifest.renderer?.includes('FluidSynth')) {
  fail(`完成音源が高品質FluidSynthレンダラーではありません (${soundtrackManifest.renderer})`)
}
if (!Number.isFinite(soundtrackManifest.soundBank?.bytes)
  || soundtrackManifest.soundBank.bytes < 10 * 1024 * 1024) {
  fail('完成音源の実サンプルSoundFontが10 MiB未満、または記録されていません')
}
if (soundtrackManifest.renderedTrackCount !== expectedTrackCount) {
  fail(`manifestは全${expectedTrackCount}曲を収録していません`)
}
expectExactSet(
  '完成済みAACファイル',
  existsSync(soundtrackDirectory)
    ? readdirSync(soundtrackDirectory).filter((name) => name.endsWith('.m4a')).map((name) => name.slice(0, -4))
    : [],
  GAME_BGM_TRACKS.map((track) => track.id),
)
expectExactSet(
  '音源プロファイル',
  Object.keys(GAME_SOUNDTRACK_PRODUCTION_BY_TRACK_ID),
  GAME_BGM_TRACKS.map((track) => track.id),
)

expectExactSet(
  '日常場面BGM',
  DAILY_BGM_BY_SCENE_ID.keys(),
  BATTLE_DAILY_SCENES.map((scene) => scene.id),
)
expectExactSet(
  '英検級BGM',
  RANK_BGM_BY_LEVEL_ID.keys(),
  LEVELS.map((level) => level.id),
)
expectExactSet('先生ボスBGM', BOSS_BGM_BY_ENEMY_ID.keys(), Object.keys(TEACHER_RIVALS))
expectExactSet(
  '結果BGM',
  RESULT_BGM_BY_VERDICT_ID.keys(),
  ['victory', 'draw', 'retreat'],
)

for (const track of GAME_BGM_TRACKS) {
  const mapped = track.category === 'daily'
    ? DAILY_BGM_BY_SCENE_ID.get(track.contextId)
    : track.category === 'rank'
      ? RANK_BGM_BY_LEVEL_ID.get(track.contextId)
      : track.category === 'boss'
        ? BOSS_BGM_BY_ENEMY_ID.get(track.contextId)
        : RESULT_BGM_BY_VERDICT_ID.get(track.contextId)
  if (mapped !== track) fail(`${track.id}: 場面マッピングが正規化済み曲を参照していません`)
}

for (const fallback of [dailyBgmTrack('unknown'), rankBgmTrack('unknown'), resultBgmTrack('unknown')]) {
  if (!fallback?.bars || !fallback?.durationSeconds) fail('フォールバック曲が演奏可能な形式ではありません')
}
if (resultBgmTrack('legendary') !== resultBgmTrack('victory')) {
  fail('legendary結果がvictory曲へ統合されていません')
}

if (failures.length > 0) {
  console.error(`❌ ゲームBGM監査に失敗しました (${failures.length}件)`)
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exitCode = 1
} else {
  console.log(
    `✅ ゲームBGM監査OK: ${GAME_BGM_TRACKS.length}曲 / ${(totalSeconds / 60).toFixed(1)}分 / ${(totalAudioBytes / 1024 / 1024).toFixed(1)} MiB / ${soundtrackNoteCount.toLocaleString()}演奏音 / ${eventCount.toLocaleString()}元譜イベント`,
  )
}
