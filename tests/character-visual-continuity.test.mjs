import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'

import {
  BATTLE_DAILY_SCENES,
  BATTLE_EMOTION_STATES,
  BATTLE_LIFESTYLE_OUTFITS,
  BATTLE_MOTION_STATES,
  BATTLE_STUDENTS,
} from '../src/lib/battleCast.js'
import { characterDailyVisualsByStudent } from '../src/lib/characterDailyVisuals.js'
import { CHARACTER_REVEAL_SCENES } from '../src/lib/characterRevealScenes.js'

function publicAsset(path) {
  return new URL(`../public${path}`, import.meta.url)
}

function pixelSizeOfWebp(path) {
  const buffer = readFileSync(publicAsset(path))
  const signature = buffer.indexOf(Buffer.from([0x9d, 0x01, 0x2a]))
  assert.ok(signature >= 0, `${path}: VP8 frame header`)
  return {
    width: buffer.readUInt16LE(signature + 3) & 0x3fff,
    height: buffer.readUInt16LE(signature + 5) & 0x3fff,
  }
}

function contentHash(path) {
  return createHash('sha256').update(readFileSync(publicAsset(path))).digest('hex')
}

test('桐生ツバキの直毛ルールと全44アセットを継続監査する', () => {
  const tsubaki = BATTLE_STUDENTS.find((student) => student.id === 'tsubaki')
  assert.deepEqual(tsubaki?.hairProfile, {
    color: 'dark-purple-black',
    texture: 'straight',
    allowedStyles: ['down', 'high-ponytail', 'high-twin-tails'],
    forbiddenTextures: ['wavy', 'curly', 'ringlet'],
  })

  const portraits = BATTLE_EMOTION_STATES.map(
    ({ id }) => `${tsubaki.assetBase}/${id}.webp`,
  )
  const lifestyle = BATTLE_LIFESTYLE_OUTFITS.map(
    ({ id }) => `${tsubaki.lifestyleBase}/${id}.webp`,
  )
  const daily = characterDailyVisualsByStudent('tsubaki').map(({ image }) => image)
  const reveal = [CHARACTER_REVEAL_SCENES.tsubaki.image]
  const sharedScenes = BATTLE_DAILY_SCENES
    .filter((scene) => scene.cast.some(({ studentId }) => studentId === 'tsubaki'))
  assert.deepEqual(sharedScenes.map(({ id }) => id), ['everyday'])
  const shared = sharedScenes.map(({ image }) => image)
  const motion = BATTLE_MOTION_STATES.map(
    (id) => `${tsubaki.motionBase}/${id}.webm`,
  )

  const rasters = [...portraits, ...lifestyle, ...daily, ...reveal, ...shared]
  const allAssets = [...rasters, ...motion]
  assert.equal(portraits.length, 24)
  assert.equal(lifestyle.length, 3)
  assert.equal(daily.length, 10)
  assert.equal(reveal.length, 1)
  assert.equal(shared.length, 1)
  assert.equal(motion.length, 5)
  assert.equal(allAssets.length, 44)
  assert.equal(new Set(allAssets).size, 44)
  assert.equal(new Set(portraits.map(contentHash)).size, 24, 'all emotion portraits differ')
  assert.equal(new Set(daily.map(contentHash)).size, 10, 'all daily scenes differ')
  assert.equal(new Set(motion.map(contentHash)).size, 5, 'all derived motions differ')

  for (const path of allAssets) {
    assert.equal(existsSync(publicAsset(path)), true, path)
  }
  for (const path of portraits) {
    assert.deepEqual(pixelSizeOfWebp(path), { width: 256, height: 256 }, path)
  }
  for (const path of lifestyle) {
    assert.deepEqual(pixelSizeOfWebp(path), { width: 512, height: 512 }, path)
  }
  for (const path of [...daily, ...reveal, ...shared]) {
    assert.deepEqual(pixelSizeOfWebp(path), { width: 960, height: 540 }, path)
  }
  for (const path of motion) {
    const buffer = readFileSync(publicAsset(path))
    assert.equal(buffer.length > 2_000, true, `${path}: non-trivial video`)
    assert.deepEqual([...buffer.subarray(0, 4)], [0x1a, 0x45, 0xdf, 0xa3])
  }
})
