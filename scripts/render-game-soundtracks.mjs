#!/usr/bin/env node
// 全32曲を完成済みAACへオフラインレンダリングする。
// 高品質版はFluidSynth + SoundFont、引数なしではmacOS内蔵音源を再現用fallbackに使う。

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
const defaultOutputDir = join(projectRoot, 'public/assets/bgm/school-ensemble')
const swiftSource = join(scriptDir, 'render-game-soundtrack.swift')

const args = process.argv.slice(2)
let force = false
let requestedTrackId = null
let requestedSoundFont = process.env.GAME_SOUND_FONT || null
let requestedOutputDir = null

const usage = () => {
  console.error(
    'usage: npm run render:bgm -- [--all] [--track TRACK_ID] [--force] '
    + '[--sound-font FILE.sf2] [--output-dir DIRECTORY]',
  )
  process.exit(2)
}

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index]
  if (arg === '--force') force = true
  else if (arg === '--all') continue
  else if (['--track', '--sound-font', '--output-dir'].includes(arg)) {
    const value = args[index + 1]
    if (!value || value.startsWith('--')) usage()
    if (arg === '--track') requestedTrackId = value
    if (arg === '--sound-font') requestedSoundFont = value
    if (arg === '--output-dir') requestedOutputDir = value
    index += 1
  } else usage()
}

const soundFontPath = requestedSoundFont ? resolve(requestedSoundFont) : null
const outputDir = requestedOutputDir ? resolve(requestedOutputDir) : defaultOutputDir
const manifestPath = join(outputDir, 'manifest.json')
const usesFluidSynth = Boolean(soundFontPath)

if (soundFontPath && !existsSync(soundFontPath)) {
  console.error(`SoundFontが見つかりません: ${soundFontPath}`)
  process.exit(2)
}
if (!usesFluidSynth && process.platform !== 'darwin') {
  console.error('SoundFontを指定しないfallbackレンダラーはmacOS専用です。')
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
  if (usesFluidSynth) {
    const version = run('fluidsynth', ['--version']).split('\n')[0]
    console.log(`高品質音源レンダラー: ${version} / ${basename(soundFontPath)}`)
  } else {
    console.warn('注意: macOS内蔵の小容量GM音源を使うfallbackレンダリングです。')
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
  }

  for (const [index, track] of selectedTracks.entries()) {
    const destination = requestedOutputDir
      ? join(outputDir, `${track.id}.m4a`)
      : join(projectRoot, 'public', track.audioPath)
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
    if (!usesFluidSynth) {
      writeFileSync(configPath, `${JSON.stringify({
        trackId: track.id,
        midiPath,
        outputPath: wavPath,
        durationSeconds: track.durationSeconds,
        reverbMix: arrangement.reverbMix,
        masterGainDb: arrangement.masterGainDb,
        instruments: arrangement.instruments,
      }, null, 2)}\n`)
    }

    console.log(
      `[${index + 1}/${selectedTracks.length}] ${track.id}: ${arrangement.noteCount.toLocaleString()}音 / ${arrangement.instruments.length}パート`,
    )
    if (usesFluidSynth) {
      run('fluidsynth', [
        '-ni', '-q',
        '-F', wavPath,
        '-T', 'wav',
        '-O', 's24',
        '-r', '44100',
        '-g', '0.34',
        '-o', 'synth.cpu-cores=4',
        '-o', 'synth.polyphony=512',
        '-o', 'synth.midi-bank-select=gm',
        '-o', 'synth.reverb.active=1',
        '-o', 'synth.reverb.damp=0.3',
        '-o', 'synth.reverb.level=0.7',
        '-o', 'synth.reverb.room-size=0.5',
        '-o', 'synth.reverb.width=0.8',
        '-o', 'synth.chorus.active=1',
        '-o', 'synth.chorus.depth=3.6',
        '-o', 'synth.chorus.level=0.55',
        '-o', 'synth.chorus.nr=4',
        '-o', 'synth.chorus.speed=0.36',
        soundFontPath,
        midiPath,
      ])
    } else {
      run(rendererPath, [configPath])
    }
    if (usesFluidSynth) {
      run('ffmpeg', [
        '-hide_banner', '-loglevel', 'error', '-y',
        '-i', wavPath,
        '-af', [
          'loudnorm=I=-18:TP=-1.5:LRA=11',
          'apad=pad_dur=8',
          `atrim=duration=${track.durationSeconds.toFixed(6)}`,
          'asetpts=N/SR/TB',
        ].join(','),
        '-ar', '44100',
        '-ac', '2',
        '-c:a', 'aac',
        '-profile:a', 'aac_low',
        '-b:a', '160k',
        '-movflags', '+faststart',
        '-map_metadata', '-1',
        encodedPath,
      ])
    } else {
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
    }
    mkdirSync(dirname(destination), { recursive: true })
    copyFileSync(encodedPath, destination)

    manifestEntries.set(track.id, {
      id: track.id,
      title: track.title,
      category: track.category,
      contextId: track.contextId,
      path: requestedOutputDir ? basename(destination) : track.audioPath,
      durationSeconds: track.durationSeconds,
      tempo: track.tempo,
      bars: track.bars,
      ensemble: track.ensemble,
      groove: arrangement.groove,
      instruments: arrangement.instruments.map(({ role, name }) => ({ role, name })),
      noteCount: arrangement.noteCount,
      bytes: statSync(destination).size,
      sha256: sha256(destination),
      renderingEngine: usesFluidSynth ? 'FluidSynth' : 'AVAudioUnitSampler',
      soundBank: usesFluidSynth ? basename(soundFontPath) : 'macOS gs_instruments.dls',
    })
  }

  const orderedEntries = GAME_BGM_TRACKS
    .map((track) => manifestEntries.get(track.id))
    .filter(Boolean)
  const manifest = {
    version: GAME_SOUNDTRACK_VERSION,
    title: '放課後と魔法の言葉 Original Game Soundtrack',
    originality: 'Original compositions; no melodies or arrangements copied from referenced works.',
    renderer: usesFluidSynth
      ? 'FluidSynth 2.5+ offline render with per-part MIDI channels'
      : 'macOS AVAudioUnitSampler + General MIDI ensemble (fallback)',
    soundBank: usesFluidSynth
      ? {
          name: basename(soundFontPath),
          bytes: statSync(soundFontPath).size,
          sha256: sha256(soundFontPath),
        }
      : { name: 'macOS gs_instruments.dls' },
    codec: usesFluidSynth
      ? 'AAC-LC stereo 44.1 kHz, 160 kbps, -18 LUFS / -1.5 dBTP target'
      : 'AAC-LC stereo 44.1 kHz, target 128 kbps',
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
