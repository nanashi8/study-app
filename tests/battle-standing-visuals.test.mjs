import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  BATTLE_STANDING_POSES,
  BATTLE_STANDING_VISUAL_COUNT,
  BATTLE_STUDENTS,
  battleStandingPoseForPhase,
} from '../src/lib/battleCast.js'

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8')

function publicAsset(path) {
  return new URL(`../public${path}`, import.meta.url)
}

function pngMetadata(buffer) {
  assert.deepEqual(
    [...buffer.subarray(0, 8)],
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    'PNG signature',
  )
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    colorType: buffer[25],
  }
}

test('全10人に背中・風・戦闘・マナの40姿を実装する', async () => {
  assert.equal(BATTLE_STUDENTS.length, 10)
  assert.deepEqual(
    BATTLE_STANDING_POSES.map(({ id }) => id),
    ['back', 'wind', 'battle', 'mana'],
  )
  assert.equal(BATTLE_STANDING_VISUAL_COUNT, 40)

  const sheets = await Promise.all(BATTLE_STUDENTS.map(async (student) => {
    const expected = `/assets/battle/standing/students/${student.id}-poses.png`
    assert.equal(student.standingSheet, expected)
    const buffer = await readFile(publicAsset(expected))
    assert.deepEqual(
      pngMetadata(buffer),
      { width: 1254, height: 1254, colorType: 6 },
      `${student.name}: 透過RGBAの2×2姿シート`,
    )
    assert.ok(buffer.length > 100_000, `${student.name}: 空でない立ち絵素材`)
    return expected
  }))

  assert.equal(new Set(sheets).size, 10)
})

test('戦況ごとに4姿を使い分け、マナ技は集中姿へ切り替える', () => {
  assert.equal(battleStandingPoseForPhase('entry'), 'back')
  assert.equal(battleStandingPoseForPhase('enemy-action'), 'back')
  assert.equal(battleStandingPoseForPhase('defeat'), 'back')
  assert.equal(battleStandingPoseForPhase('ready'), 'wind')
  assert.equal(battleStandingPoseForPhase('victory'), 'wind')
  assert.equal(battleStandingPoseForPhase('hero-action'), 'battle')
  assert.equal(battleStandingPoseForPhase('guard'), 'battle')
  assert.equal(battleStandingPoseForPhase('healing'), 'mana')

  for (const event of [
    'burst',
    'shield',
    'counter',
    'item-power',
    'item-guard',
    'item-heal',
  ]) {
    assert.equal(battleStandingPoseForPhase('ready', event), 'mana', event)
  }
})

test('入口・実戦・結果の全バトル経路が共通立ち絵と動画モーションを使う', async () => {
  const [entry, battle, result, actor, css] = await Promise.all([
    readSource('../src/screens/EnglishMap.jsx'),
    readSource('../src/screens/VocabQuiz.jsx'),
    readSource('../src/screens/SessionResult.jsx'),
    readSource('../src/components/BattleStandingActor.jsx'),
    readSource('../src/index.css'),
  ])

  assert.match(entry, /data-battle-standing-entry/)
  assert.match(entry, /<BattleStandingActor[\s\S]*?pose="back"[\s\S]*?phase="entry"/)
  assert.match(battle, /battleStandingPoseForPhase\(battlePhase, eventKind\)/)
  assert.match(battle, /<BattleStandingActor[\s\S]*?motionSrc=\{studentMotion\}[\s\S]*?motionActive=\{presentationActive\}/)
  assert.match(result, /battleStandingPoseForPhase\(/)
  assert.match(result, /data-testid="battle-result-lead-student"/)
  assert.match(result, /<BattleStandingActor[\s\S]*?motionSrc=\{standingMotion\}/)

  assert.match(actor, /data-battle-standing-student=\{student\.id\}/)
  assert.match(actor, /data-battle-standing-pose=\{pose\}/)
  assert.match(actor, /data-battle-standing-phase=\{phase\}/)
  assert.match(actor, /<video[\s\S]*?autoPlay[\s\S]*?muted[\s\S]*?playsInline/)
  assert.match(actor, /prefers-reduced-motion: reduce/)

  for (const pose of ['back', 'wind', 'battle', 'mana']) {
    assert.match(css, new RegExp(`data-battle-standing-pose='${pose}'`), pose)
  }
  assert.match(css, /@keyframes battle-standing-wind/)
  assert.match(css, /@keyframes battle-standing-strike/)
  assert.match(css, /@keyframes battle-standing-mana/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.battle-standing-actor,/)
  assert.match(css, /@media \(max-width: 350px\)[\s\S]*\.battle-result-standing-student > \.battle-standing-actor/)
})
