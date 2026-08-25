import test from 'node:test'
import assert from 'node:assert/strict'

import { BATTLE_STUDENTS } from '../src/lib/battleCast.js'
import { chooseCharacterTalkCompanion } from '../src/lib/characterTalk.js'
import {
  AFTER_SCHOOL_BRANCHES,
  LEGACY_UNLOCKED_BATTLE_STUDENT_IDS,
  isValidUnlockedBattleStudentIds,
  normalizeUnlockedBattleStudentIds,
} from '../src/lib/afterSchoolBonds.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import {
  isValidStoryKeyVisualAlbum,
  recordAfterSchoolEventMemory,
  recordTeacherVictoryMemory,
  storyKeyVisualAlbumCapacity,
  storyKeyVisualAlbumFromLegacyBonds,
} from '../src/lib/storyAlbum.js'
import { AFTER_SCHOOL_STORY_ARCS } from '../src/lib/storyProgression.js'
import { migratePersistedState, useStore } from '../src/store/useStore.js'

const STORY_TITLES = [
  '当たり前だった英語の消失',
  '記憶を保った生徒たち',
  '先生たちに残った専門の違和感',
  '日常に生じる小さな歪み',
  '学校を中心にした五芒星',
  '図書館・5級の記憶層',
  '駅前・4級の記憶層',
  '中央公園・3級の記憶層',
  '神社・準2級の記憶層',
  '競技場・2級の記憶層',
  '五地点の記憶を取り戻し、1級EXTRAへ',
]

test('物語は指定された11段階を順番どおり進む', () => {
  assert.deepEqual(
    AFTER_SCHOOL_STORY_ARCS.map((arc) => arc.title),
    STORY_TITLES,
  )
  assert.deepEqual(
    AFTER_SCHOOL_STORY_ARCS.map((arc) => arc.number),
    STORY_TITLES.map((_, index) => index + 1),
  )
  for (const arc of AFTER_SCHOOL_STORY_ARCS) {
    assert.ok(arc.summary.length >= 25, arc.id)
    assert.ok(arc.investigation.length >= 20, arc.id)
    assert.ok(arc.discovery.length >= 20, arc.id)
    assert.ok(arc.nextLead.length >= 20, arc.id)
  }
})

test('新しい冒険はミオ一人から始まり、旧保存データでは10人を維持する', () => {
  assert.deepEqual(normalizeUnlockedBattleStudentIds(), ['mio'])
  assert.deepEqual(
    normalizeUnlockedBattleStudentIds(undefined, { legacyFallback: true }),
    BATTLE_STUDENTS.map((student) => student.id),
  )
  assert.deepEqual(
    LEGACY_UNLOCKED_BATTLE_STUDENT_IDS,
    BATTLE_STUDENTS.map((student) => student.id),
  )
  assert.equal(isValidUnlockedBattleStudentIds(['mio']), true)
  assert.equal(isValidUnlockedBattleStudentIds(['ren']), false)
  assert.equal(isValidUnlockedBattleStudentIds(['mio', 'mio']), false)
})

test('仲間トークへ未解放キャラクターが混ざらない', () => {
  const candidateIds = ['mio', 'ren', 'haru']
  for (let seed = 0; seed < 30; seed += 1) {
    const companion = chooseCharacterTalkCompanion(
      'mio',
      seed,
      null,
      candidateIds,
    )
    assert.equal(candidateIds.includes(companion.id), true)
    assert.notEqual(companion.id, 'mio')
  }
})

test('出会いと先生撃破のキービジュアルは一件ずつ重複なくアルバムへ残る', () => {
  const renRoute = AFTER_SCHOOL_BRANCHES.find((branch) => branch.studentId === 'ren')
  const eventAlbum = recordAfterSchoolEventMemory(
    { events: [], teacherVictories: [] },
    { branchId: renRoute.id, storyStep: 6 },
  )
  assert.deepEqual(eventAlbum.events, [{
    branchId: renRoute.id,
    storyArcId: AFTER_SCHOOL_STORY_ARCS[6].id,
    studentId: 'ren',
  }])
  assert.equal(
    recordAfterSchoolEventMemory(eventAlbum, {
      branchId: renRoute.id,
      storyStep: 7,
    }).events.length,
    1,
  )

  const victoryAlbum = recordTeacherVictoryMemory(eventAlbum, {
    teacherId: 'grass-wolf',
    studentId: 'ren',
    themeId: 'music-pastel',
  })
  assert.deepEqual(victoryAlbum.teacherVictories, [{
    teacherId: 'grass-wolf',
    studentId: 'ren',
    themeId: 'music-pastel',
  }])
  assert.equal(
    recordTeacherVictoryMemory(victoryAlbum, {
      teacherId: 'grass-wolf',
      studentId: 'mio',
      themeId: 'music-pastel',
    }).teacherVictories.length,
    1,
  )
  assert.equal(isValidStoryKeyVisualAlbum(victoryAlbum), true)
  assert.equal(storyKeyVisualAlbumCapacity(), 21)
})

test('仲間とアルバムは進捗コードで一緒に往復する', () => {
  const renRoute = AFTER_SCHOOL_BRANCHES.find((branch) => branch.studentId === 'ren')
  const album = recordTeacherVictoryMemory(
    recordAfterSchoolEventMemory(
      { events: [], teacherVictories: [] },
      { branchId: renRoute.id, storyStep: 3 },
    ),
    {
      teacherId: 'grass-wolf',
      studentId: 'ren',
      themeId: 'music-pastel',
    },
  )
  const restored = decodeProgress(encodeProgress({
    unlockedBattleStudentIds: ['mio', 'ren'],
    storyKeyVisualAlbum: album,
  }))
  assert.deepEqual(restored.unlockedBattleStudentIds, ['mio', 'ren'])
  assert.deepEqual(restored.storyKeyVisualAlbum, album)
})

test('旧保存データは仲間を失わず、既存の放課後履歴をアルバムへ移す', () => {
  const legacy = migratePersistedState({
    battleStudentId: 'ren',
    afterSchoolBonds: { ren: { points: 4, visits: 2 } },
  })
  assert.deepEqual(
    legacy.unlockedBattleStudentIds,
    BATTLE_STUDENTS.map((student) => student.id),
  )
  assert.deepEqual(
    legacy.storyKeyVisualAlbum,
    storyKeyVisualAlbumFromLegacyBonds(legacy.afterSchoolBonds),
  )

  const current = migratePersistedState({
    battleStudentId: 'ren',
    unlockedBattleStudentIds: ['mio'],
    storyKeyVisualAlbum: { events: [], teacherVictories: [] },
  })
  assert.deepEqual(current.unlockedBattleStudentIds, ['mio', 'ren'])
  assert.deepEqual(current.storyKeyVisualAlbum, { events: [], teacherVictories: [] })
})

test('出会い完了は仲間解放・イベント保存・絆報酬を原子的に確定する', () => {
  const original = useStore.getState()
  const renRoute = AFTER_SCHOOL_BRANCHES.find((branch) => branch.studentId === 'ren')
  const choice = renRoute.choices[0]
  const srs = { sample: { box: 2, correct: 3, wrong: 1, due: 10, last: 9 } }
  try {
    useStore.setState({
      battleStudentId: 'mio',
      battleStoryStep: 0,
      afterSchoolBonds: {},
      unlockedBattleStudentIds: ['mio'],
      storyKeyVisualAlbum: { events: [], teacherVictories: [] },
      srs,
      stats: { ...original.stats, xp: 100, answered: 12, correct: 9 },
    })

    useStore.getState().setBattleStudentId('ren')
    assert.equal(useStore.getState().battleStudentId, 'mio')

    const reward = useStore.getState().completeAfterSchoolRoute({
      step: 0,
      branchId: renRoute.id,
      choiceId: choice.id,
    })
    const after = useStore.getState()
    assert.equal(reward.companionUnlocked, true)
    assert.equal(reward.unlockedCompanion, 'ren')
    assert.deepEqual(after.unlockedBattleStudentIds, ['mio', 'ren'])
    assert.equal(after.storyKeyVisualAlbum.events[0].branchId, renRoute.id)
    assert.equal(after.stats.xp, 100)
    assert.equal(after.stats.answered, 12)
    assert.equal(after.stats.correct, 9)
    assert.strictEqual(after.srs, srs)

    useStore.getState().recordTeacherKeyVisual({
      teacherId: 'grass-wolf',
      studentId: 'ren',
      themeId: 'music-pastel',
    })
    assert.deepEqual(useStore.getState().storyKeyVisualAlbum.teacherVictories, [{
      teacherId: 'grass-wolf',
      studentId: 'ren',
      themeId: 'music-pastel',
    }])

    useStore.getState().setBattleStudentId('ren')
    assert.equal(useStore.getState().battleStudentId, 'ren')
    assert.equal(useStore.getState().completeAfterSchoolRoute({
      step: 0,
      branchId: renRoute.id,
      choiceId: choice.id,
    }), null)
  } finally {
    useStore.setState(original, true)
  }
})
