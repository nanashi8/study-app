import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  BATTLE_STANDING_POSES,
  BATTLE_STANDING_VISUAL_COUNT,
  BATTLE_RIVALS,
  BATTLE_STUDENTS,
  battleStandingPoseForPhase,
} from '../src/lib/battleCast.js'
import {
  TEACHER_PORTRAIT_IDS,
  TEACHER_PORTRAIT_PROFILES,
} from '../src/lib/teacherPortraits.js'

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

test('通常ライバル50人と先生12人の全員に専用の透過全身立ち絵がある', async () => {
  assert.equal(BATTLE_RIVALS.length, 50)
  assert.equal(TEACHER_PORTRAIT_IDS.length, 12)

  const standingAssets = [
    ...BATTLE_RIVALS.map((rival) => ({
      id: rival.id,
      name: rival.name,
      expected: `/assets/battle/standing/rivals/${rival.id}.png`,
      actual: rival.standing,
    })),
    ...TEACHER_PORTRAIT_IDS.map((id) => ({
      id,
      name: id,
      expected: `/assets/battle/standing/teachers/${id}.png`,
      actual: TEACHER_PORTRAIT_PROFILES[id].standing,
    })),
  ]

  assert.equal(standingAssets.length, 62)
  assert.equal(new Set(standingAssets.map(({ actual }) => actual)).size, 62)

  await Promise.all(standingAssets.map(async ({ name, expected, actual }) => {
    assert.equal(actual, expected, `${name}: 専用立ち絵URL`)
    const buffer = await readFile(publicAsset(expected))
    const metadata = pngMetadata(buffer)
    assert.equal(metadata.colorType, 6, `${name}: 透過RGBA`)
    assert.ok(metadata.width >= 900, `${name}: 全身を保つ横解像度`)
    assert.ok(metadata.height >= 1200, `${name}: 全身を保つ縦解像度`)
    assert.ok(metadata.height > metadata.width, `${name}: 縦長の全身構図`)
    assert.ok(buffer.length > 100_000, `${name}: 空でない全身立ち絵素材`)
  }))
})

test('戦況ごとに4姿を使い分け、マナ技は集中姿へ切り替える', () => {
  assert.equal(battleStandingPoseForPhase('entry'), 'back')
  assert.equal(battleStandingPoseForPhase('enemy-action'), 'wind')
  assert.equal(battleStandingPoseForPhase('defeat'), 'back')
  assert.equal(battleStandingPoseForPhase('ready'), 'wind')
  assert.equal(battleStandingPoseForPhase('victory'), 'wind')
  assert.equal(battleStandingPoseForPhase('hero-action'), 'wind')
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

test('共同解読は生徒と先生の立ち絵を別レイヤーで使い、攻撃モーションを出さない', async () => {
  const [stage, vocab, result, actor, css] = await Promise.all([
    readSource('../src/components/DragonVeinCipherStage.jsx'),
    readSource('../src/screens/VocabQuiz.jsx'),
    readSource('../src/screens/SessionResult.jsx'),
    readSource('../src/components/BattleStandingActor.jsx'),
    readSource('../src/index.css'),
  ])

  assert.match(stage, /<BattleStandingActor[\s\S]*?pose="wind"[\s\S]*?phase="ready"/)
  assert.match(stage, /className="dragon-vein-guide-layer"/)
  assert.match(stage, /<img src=\{guide\.standing\}/)
  assert.match(stage, /battleStudentPortrait\(student\.id, expression\)/)
  assert.match(vocab, /<DragonVeinCipherStage/)
  assert.match(result, /<DragonVeinCipherStage/)
  assert.doesNotMatch(stage, /BattleOpponentStandingActor|enemy|attack|defeat|victory/)
  assert.doesNotMatch(vocab, /battleStandingPoseForPhase|battle-anime-fighter-enemy|BattleManaAnimation/)
  assert.doesNotMatch(result, /enemyDefeated|battle-result-lead-student/)

  assert.match(actor, /data-battle-standing-student=\{student\.id\}/)
  assert.match(actor, /data-battle-standing-pose=\{pose\}/)
  assert.match(actor, /data-battle-standing-phase=\{phase\}/)
  assert.doesNotMatch(actor, /<video|battle-standing-motion-cut-in/)
  assert.match(css, /\.dragon-vein-student-layer > :first-child/)
  assert.match(css, /@keyframes dragon-vein-natural-breathe/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.dragon-vein-student-layer \{ animation: none; \}/)
})
