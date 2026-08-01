import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

import {
  SCHOOL_LIFE_VISUAL_CATEGORIES,
  SCHOOL_LIFE_VISUALS,
  schoolLifeVisualById,
} from '../src/data/school-life-visuals.js'

const EXPECTED_VISUAL_IDS = [
  'school-gate-arrival',
  'bicycle-commute',
  'train-commute',
  'shoe-lockers',
  'morning-assembly',
  'morning-homeroom',
  'pop-quiz',
  'test-prep',
  'midterm-exam',
  'test-return',
  'lunch-classroom',
  'school-store',
  'cafeteria',
  'cleaning-time',
  'committee-meeting',
  'track-club',
  'basketball-club',
  'art-club',
  'science-club',
  'sports-festival',
  'culture-festival',
  'school-trip',
  'entrance-ceremony',
  'school-gate-dismissal',
]

function pixelSizeOfWebp(path) {
  const buffer = readFileSync(new URL(`../public${path}`, import.meta.url))
  const signature = buffer.indexOf(Buffer.from([0x9d, 0x01, 0x2a]))
  assert.ok(signature >= 0, `${path}: VP8 frame header`)
  return {
    width: buffer.readUInt16LE(signature + 3) & 0x3fff,
    height: buffer.readUInt16LE(signature + 5) & 0x3fff,
  }
}

test('学校生活アルバムは指定された24場面を重複なく収録する', () => {
  assert.deepEqual(
    SCHOOL_LIFE_VISUALS.map((visual) => visual.id),
    EXPECTED_VISUAL_IDS,
  )
  assert.equal(SCHOOL_LIFE_VISUALS.length, 24)
  assert.equal(new Set(SCHOOL_LIFE_VISUALS.map((visual) => visual.id)).size, 24)
  assert.equal(new Set(SCHOOL_LIFE_VISUALS.map((visual) => visual.image)).size, 24)
  assert.equal(SCHOOL_LIFE_VISUALS.some((visual) => visual.id === 'music-club'), false)
  assert.equal(schoolLifeVisualById('basketball-club').shortName, 'バスケ部')
  assert.equal(schoolLifeVisualById('unknown').id, 'school-gate-arrival')
})

test('全カテゴリが空でなく、全画像が960×540のWebPとして存在する', () => {
  assert.deepEqual(
    SCHOOL_LIFE_VISUAL_CATEGORIES.map((category) => category.id),
    ['all', 'commute', 'learning', 'lunch', 'routine', 'club', 'event'],
  )

  const categoryCounts = new Map()
  for (const visual of SCHOOL_LIFE_VISUALS) {
    assert.ok(visual.name && visual.shortName && visual.description, visual.id)
    assert.match(visual.time, /^\d{2}:\d{2}$/, visual.id)
    assert.match(
      visual.image,
      /^\/assets\/battle\/school-life\/[a-z0-9-]+\.webp$/,
      visual.id,
    )
    assert.equal(
      existsSync(new URL(`../public${visual.image}`, import.meta.url)),
      true,
      visual.image,
    )
    assert.deepEqual(
      pixelSizeOfWebp(visual.image),
      { width: 960, height: 540 },
      visual.image,
    )
    categoryCounts.set(visual.category, (categoryCounts.get(visual.category) ?? 0) + 1)
  }

  assert.deepEqual(
    Object.fromEntries(categoryCounts),
    { commute: 5, routine: 3, learning: 5, lunch: 3, club: 4, event: 4 },
  )
})

test('学校生活アルバムはカテゴリ選択とモバイル向け遅延読込を備える', () => {
  const mapSource = readFileSync(
    new URL('../src/screens/EnglishMap.jsx', import.meta.url),
    'utf8',
  )
  const cssSource = readFileSync(
    new URL('../src/index.css', import.meta.url),
    'utf8',
  )

  assert.match(mapSource, /<SchoolLifeAlbum/)
  assert.match(mapSource, /SCHOOL_LIFE_VISUAL_CATEGORIES\.map/)
  assert.match(mapSource, /filteredVisuals\.map/)
  assert.match(mapSource, /aria-controls="school-life-album-scene"/)
  assert.match(mapSource, /loading="lazy"/)
  assert.match(mapSource, /BATTLE_DAILY_SCENES\.length \+ SCHOOL_LIFE_VISUALS\.length/)
  assert.match(cssSource, /\.school-life-category-list/)
  assert.match(cssSource, /\.school-life-visual-choice\[aria-pressed='true'\]/)
})

test('ビジュアル指導はリポジトリ内の拒否ゲートとして継続利用できる', () => {
  const agentGuide = readFileSync(new URL('../AGENTS.md', import.meta.url), 'utf8')
  const visualGuide = readFileSync(
    new URL('../docs/game-visual-direction.md', import.meta.url),
    'utf8',
  )

  assert.match(agentGuide, /docs\/game-visual-direction\.md/)
  assert.match(agentGuide, /Hard rejection gates/)
  assert.match(visualGuide, /No cloned or near-duplicate people/)
  assert.match(visualGuide, /Social framing stays relationship-neutral/)
  assert.match(visualGuide, /Classroom geometry is explicit/)
  assert.match(visualGuide, /Assembly and ceremony protagonists/)
  assert.match(visualGuide, /standard school uniform is always the same sailor uniform/)
  assert.match(visualGuide, /one continuous conversation span/)
})
