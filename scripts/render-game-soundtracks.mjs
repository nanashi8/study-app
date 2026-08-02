#!/usr/bin/env node
// macOSのGeneral MIDIサンプラーを使い、全32曲を完成済みAACへオフラインレンダリングする。
// OpenAIなどの従量課金APIは呼ばない。再生成: npm run render:bgm -- --force

import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { GAME_BGM_TRACKS } from '../src/data/game-bgm.js'
import { GAME_SOUNDTRACK_VERSION } from '../src/data/game-soundtrack-production.js'
import {
  auditProductionProfiles,
  buildSoundtrackArrangement,
  soundtrackArrangementToMidi,
} from './game-soundtrack-arrangement.mjs'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '..')
const outputDir = join(projectRoot, 'public/assets/bgm/school-ensemble')
const manifestPath = join(outputDir, 'manifest.json')
const swiftSource = join(scriptDir, 'render-game-soundtrack.swift')

const args = process.argv.slice(2)
const force = args.includes('--force')
const requestedTrackIndex = args.indexOf('--track')
const requestedTrackId = requestedTrackIndex >= 0 ? args[requestedTrackIndex + 1] : null
const unknownArgs = args.filter((arg, index) => (
  !['--force', '--all', '--track'].includes(arg)
  && !(requestedTrackIndex >= 0 && index === requestedTrackIndex + 1)
))

if (unknownArgs.length > 0 || (requestedTrackIndex >= 0 && !requestedTrackId)) {
  console.error('usage: npm run render:bgm -- [--all] [--track TRACK_ID] [--force]')
  process.exit(2)
}
if (process.platform !== 'darwin') {
  console.error('このレンダラーはmacOSの内蔵General MIDI音源を使用します。')
  process.exit(2)
}

const profileAudit = auditProductionProfiles(GAME_BGM_TRACKS.map((track) => track.id))
if (!profileAudit.complete) {
  console.error('BGM曲定義と音源プロファイルが一致しません。')
  console.error(JSON.stringify(profileAudit, null, 2))
  process.exit(1)
}

const selectedTracks = requestedTrackId
  ? GAME_BGM_TRACKS.filter((track) => track.id === requestedTrackId)
  : GAME_BGM_TRACKS
if (selectedTracks.length === 0) {
  console.error(`曲が見つかりません: ${requestedTrackId}`)
  process.exit(2)
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: projectRoot,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    ...options,
  })
  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
    throw new Error(`${command} ${commandArgs.join(' ')}\n${detail}`)
  }
  return result.stdout.trim()
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function existingManifestEntries() {
  if (!existsSync(manifestPath)) return new Map()
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    return new Map((manifest.tracks ?? []).map((entry) => [entry.id, entry]))
  } catch {
    return new Map()
  }
}

mkdirSync(outputDir, { recursive: true })
const tempRoot = mkdtempSync(join(tmpdir(), 'study-app-soundtrack-'))
const rendererPath = join(tempRoot, 'render-game-soundtrack')
const swiftModuleCache = join(tmpdir(), 'study-app-soundtrack-swift-cache')
const clangModuleCache = join(tmpdir(), 'study-app-soundtrack-clang-cache')
const manifestEntries = existingManifestEntries()

try {
  console.log(`音源レンダラーをコンパイル中: ${basename(swiftSource)}`)
  mkdirSync(swiftModuleCache, { recursive: true })
  mkdirSync(clangModuleCache, { recursive: true })
  run('swiftc', [swiftSource, '-O', '-o', rendererPath], {
    env: {
      ...process.env,
      SWIFT_MODULECACHE_PATH: swiftModuleCache,
      CLANG_MODULE_CACHE_PATH: clangModuleCache,
    },
  })

  for (const [index, track] of selectedTracks.entries()) {
    const destination = join(projectRoot, 'public', track.audioPath)
    if (existsSync(destination) && !force) {
      console.log(`[${index + 1}/${selectedTracks.length}] 既存音源を保持: ${track.id}`)
      continue
    }

    const arrangement = buildSoundtrackArrangement(track)
    const midiPath = join(tempRoot, `${track.id}.mid`)
    const wavPath = join(tempRoot, `${track.id}.wav`)
    const encodedPath = join(tempRoot, `${track.id}.m4a`)
    const configPath = join(tempRoot, `${track.id}.json`)
    writeFileSync(midiPath, soundtrackArrangementToMidi(arrangement))
    writeFileSync(configPath, `${JSON.stringify({
      trackId: track.id,
      midiPath,
      outputPath: wavPath,
      durationSeconds: track.durationSeconds,
      reverbMix: arrangement.reverbMix,
      masterGainDb: arrangement.masterGainDb,
      instruments: arrangement.instruments,
    }, null, 2)}\n`)

    console.log(
      `[${index + 1}/${selectedTracks.length}] ${track.id}: ${arrangement.noteCount.toLocaleString()}音 / ${arrangement.instruments.length}パート`,
    )
    run(rendererPath, [configPath])
    run('afconvert', [
      wavPath,
      '-o', encodedPath,
      '-f', 'm4af',
      '-d', 'aac',
      '-b', '128000',
      '-q', '127',
      '-s', '2',
      '--soundcheck-generate',
      '--media-kind', 'Music',
    ])
    mkdirSync(dirname(destination), { recursive: true })
    copyFileSync(encodedPath, destination)

    manifestEntries.set(track.id, {
      id: track.id,
      title: track.title,
      category: track.category,
      contextId: track.contextId,
      path: track.audioPath,
      durationSeconds: track.durationSeconds,
      tempo: track.tempo,
      bars: track.bars,
      ensemble: track.ensemble,
      groove: arrangement.groove,
      instruments: arrangement.instruments.map(({ role, name }) => ({ role, name })),
      noteCount: arrangement.noteCount,
      bytes: statSync(destination).size,
      sha256: sha256(destination),
    })
  }

  const orderedEntries = GAME_BGM_TRACKS
    .map((track) => manifestEntries.get(track.id))
    .filter(Boolean)
  const manifest = {
    version: GAME_SOUNDTRACK_VERSION,
    title: '放課後の魔法と言葉 Original Game Soundtrack',
    originality: 'Original compositions; no melodies or arrangements copied from referenced works.',
    renderer: 'macOS AVAudioUnitSampler + General MIDI ensemble',
    codec: 'AAC-LC stereo 44.1 kHz, target 128 kbps',
    targetTrackCount: GAME_BGM_TRACKS.length,
    renderedTrackCount: orderedEntries.length,
    totalDurationSeconds: Number(
      orderedEntries.reduce((sum, entry) => sum + entry.durationSeconds, 0).toFixed(3),
    ),
    tracks: orderedEntries,
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(
    `完了: ${orderedEntries.length}/${GAME_BGM_TRACKS.length}曲 / ${manifestPath}`,
  )
} finally {
  // mkdtempSyncでこの実行専用に確定した一時ディレクトリだけを削除する。
  rmSync(tempRoot, { recursive: true, force: true })
}
