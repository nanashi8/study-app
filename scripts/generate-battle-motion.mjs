import { spawn, spawnSync } from 'node:child_process'
import { once } from 'node:events'
import { access, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_ROOT = path.join(ROOT, 'public/assets/battle/cast/students')
const OUTPUT_ROOT = path.join(ROOT, 'public/assets/battle/motion/students')
const FPS = 12

const STUDENT_IDS = [
  'mio',
  'ren',
  'haru',
  'akari',
  'kaito',
  'rei',
  'nao',
  'tsubaki',
  'noa',
  'yuu',
]

// 既存の表情差分を短い一回再生の映像へまとめる。
// 最終フレームを行動表情に戻し、再生後も戦況が読み取れる構成にする。
const MOTION_SEQUENCES = {
  attack: [
    ['idle', 1],
    ['focused', 2],
    ['attack', 4],
    ['confident', 2],
    ['attack', 3],
  ],
  guard: [
    ['idle', 1],
    ['surprised', 2],
    ['guard', 4],
    ['determined', 2],
    ['guard', 3],
  ],
  healing: [
    ['worried', 2],
    ['healing', 5],
    ['relieved', 2],
    ['healing', 3],
  ],
  hurt: [
    ['idle', 1],
    ['surprised', 2],
    ['hurt', 4],
    ['worried', 2],
    ['hurt', 3],
  ],
  victory: [
    ['determined', 1],
    ['surprised', 2],
    ['victory', 5],
    ['delighted', 2],
    ['victory', 4],
  ],
}

function executableWorks(command) {
  if (!command) return false
  const result = spawnSync(command, ['-version'], { stdio: 'ignore' })
  return !result.error && result.status === 0
}

function playwrightFfmpegCandidates() {
  const cacheRoots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    path.join(homedir(), 'Library/Caches/ms-playwright'),
    path.join(homedir(), '.cache/ms-playwright'),
  ].filter(Boolean)
  const names = process.platform === 'win32'
    ? ['ffmpeg.exe']
    : process.platform === 'darwin'
      ? ['ffmpeg-mac', 'ffmpeg']
      : ['ffmpeg-linux', 'ffmpeg']
  const candidates = []

  for (const cacheRoot of cacheRoots) {
    let entries = []
    try {
      entries = spawnSync('find', [cacheRoot, '-maxdepth', '3', '-type', 'f'], {
        encoding: 'utf8',
      }).stdout?.trim().split('\n').filter(Boolean) ?? []
    } catch {
      entries = []
    }
    for (const entry of entries) {
      if (names.includes(path.basename(entry))) candidates.push(entry)
    }
  }
  return candidates
}

function findFfmpeg() {
  const candidates = [
    process.env.FFMPEG_PATH,
    'ffmpeg',
    ...playwrightFfmpegCandidates(),
  ]
  const ffmpeg = candidates.find(executableWorks)
  if (!ffmpeg) {
    throw new Error('ffmpeg が見つかりません。FFMPEG_PATH を指定してください。')
  }
  return ffmpeg
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' })
  if (result.error || result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim() || result.error?.message
    throw new Error(`${command} の実行に失敗しました: ${detail}`)
  }
}

async function convertPortraitsToJpeg(studentId, states, tempRoot) {
  const outputDir = path.join(tempRoot, studentId)
  await mkdir(outputDir, { recursive: true })
  const frames = new Map()

  for (const state of states) {
    const source = path.join(SOURCE_ROOT, studentId, `${state}.webp`)
    const output = path.join(outputDir, `${state}.jpg`)
    await access(source)
    run('/usr/bin/sips', [
      '-s', 'format', 'jpeg',
      '-s', 'formatOptions', '92',
      source,
      '--out', output,
    ])
    frames.set(state, await readFile(output))
  }

  return frames
}

async function encodeMotion(ffmpeg, frames, sequence, output) {
  await mkdir(path.dirname(output), { recursive: true })
  const encoder = spawn(ffmpeg, [
    '-hide_banner',
    '-loglevel', 'error',
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(FPS),
    '-vcodec', 'mjpeg',
    '-i', 'pipe:0',
    '-an',
    '-c:v', 'libvpx',
    '-deadline', 'good',
    '-cpu-used', '4',
    '-crf', '18',
    '-b:v', '420k',
    '-pix_fmt', 'yuv420p',
    '-r', String(FPS),
    output,
  ], { stdio: ['pipe', 'ignore', 'pipe'] })

  let stderr = ''
  encoder.stderr.on('data', (chunk) => {
    stderr += chunk.toString()
  })

  for (const [state, count] of sequence) {
    const frame = frames.get(state)
    if (!frame) throw new Error(`${state} のJPEGフレームがありません。`)
    for (let index = 0; index < count; index += 1) {
      if (!encoder.stdin.write(frame)) await once(encoder.stdin, 'drain')
    }
  }
  encoder.stdin.end()

  const [exitCode] = await once(encoder, 'close')
  if (exitCode !== 0) {
    throw new Error(`WebMの生成に失敗しました (${output}): ${stderr.trim()}`)
  }
}

async function main() {
  if (process.platform !== 'darwin') {
    throw new Error('この生成スクリプトは画像変換に macOS の sips を使用します。')
  }

  const ffmpeg = findFfmpeg()
  const tempRoot = await mkdtemp(path.join(tmpdir(), 'study-app-battle-motion-'))
  const requiredStates = new Set(
    Object.values(MOTION_SEQUENCES).flatMap((sequence) =>
      sequence.map(([state]) => state),
    ),
  )
  let created = 0

  try {
    for (const studentId of STUDENT_IDS) {
      const frames = await convertPortraitsToJpeg(studentId, requiredStates, tempRoot)
      for (const [motionId, sequence] of Object.entries(MOTION_SEQUENCES)) {
        await encodeMotion(
          ffmpeg,
          frames,
          sequence,
          path.join(OUTPUT_ROOT, studentId, `${motionId}.webm`),
        )
        created += 1
      }
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true })
  }

  console.log(`battle motion: ${created} WebM clips (${STUDENT_IDS.length} students × ${Object.keys(MOTION_SEQUENCES).length} actions)`)
}

await main()
