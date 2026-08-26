import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

import { battleProgression, battleTrend } from '../src/lib/adaptive.js'
import {
  BATTLE_QUESTS,
  BATTLE_ITEM_FILTERS,
  BATTLE_ITEM_SORTS,
  BATTLE_TACTICS,
  CHAPTERS,
  MAX_HERO_LEVEL,
  MOB_PROFILES,
  RELICS,
  SCHOOL_TEACHERS,
  TEACHER_RIVALS,
  battleQuest,
  battleRelicForLevel,
  battleSceneCue,
  battleTactic,
  battleVerdict,
  capEnemyPositionForHeroLevel,
  chapterForLevel,
  encounterFor,
  featuredBattleTacticId,
  featuredQuestId,
  heroBattleStats,
  heroEquipmentForLevel,
  maxEnemyRankIndexForHeroLevel,
  mobProfile,
  nextEnemyRankUnlockForHeroLevel,
  organizeBattleItems,
  relicBattleAbility,
  resolveBattleState,
  teacherBattleResultLine,
} from '../src/lib/rpg.js'
import {
  BATTLE_BARRIER_CENTER,
  BATTLE_BARRIER_MAP_IMAGE,
  BATTLE_BARRIER_NODES,
  BATTLE_BARRIER_STAR_ORDER,
  BATTLE_BARRIER_TRAFFIC_LIGHTS,
  BATTLE_BARRIER_WINDOW_LIGHTS,
  BATTLE_STAR_PER_CORRECT,
  BATTLE_STAGE_BACKGROUNDS,
  BATTLE_THEMES,
  battleBarrierLocationById,
  battleStageForEncounter,
  battleStarsEarned,
  battleThemeById,
  newlyUnlockedBattleThemes,
  nextBattleTheme,
  unlockedBattleThemes,
} from '../src/lib/battleThemes.js'
import {
  BATTLE_DAILY_SCENES,
  BATTLE_CHARACTER_VISUAL_COUNT,
  BATTLE_EMOTION_STATES,
  BATTLE_GRADE_SUBJECTS,
  BATTLE_LIFESTYLE_OUTFITS,
  BATTLE_MOTION_STATES,
  BATTLE_RESULT_ANIMATION_STYLES,
  BATTLE_RIVAL_GROUPS,
  BATTLE_RIVALS,
  BATTLE_STUDENTS,
  BATTLE_SUPPORT_STYLES,
  BATTLE_TEACHER_AFFINITIES,
  battleDailySceneById,
  battleOpponentForEncounter,
  battleRivalForEncounter,
  battleRivalTeacherSubject,
  battleStudentLifestylePortrait,
  battleStudentBestSubjects,
  battleStudentMotion,
  battleStudentPortrait,
  battleStudentResultAnimation,
  battleStudentResultState,
  battleStudentState,
  battleStudentSubjectGrade,
  battleSupportStyleById,
  battleTeacherAffinity,
  isBattleStudentId,
  isRestorableBattleStudentId,
  normalizeBattleStudentId,
} from '../src/lib/battleCast.js'
import {
  BATTLE_STUDENT_BASE_TRAITS,
  BATTLE_TRAITS,
  BATTLE_TRAIT_POINT_STARS,
  MAX_BATTLE_TRAIT_LEVEL,
  battleStudentTraitProfile,
  battleTraitPointBudget,
  battleTraitPointSummary,
  canRaiseBattleTrait,
  isValidBattleTraitInvestments,
  normalizeBattleTraitInvestments,
  raiseBattleTrait,
  resetBattleStudentTraits,
} from '../src/lib/battleTraits.js'
import {
  BATTLE_MANA_AFFINITIES,
  BATTLE_MANA_SEQUENCES,
  battleManaPresentation,
  battleManaSequenceFor,
} from '../src/lib/battleMana.js'
import { SCHOOL_SUBJECT_NAMES } from '../src/lib/schoolSubjects.js'
import { hasTeacherPortrait } from '../src/lib/teacherPortraits.js'

function pixelSizeOfWebp(path) {
  const buffer = readFileSync(new URL(`../public${path}`, import.meta.url))
  const signature = buffer.indexOf(Buffer.from([0x9d, 0x01, 0x2a]))
  assert.ok(signature >= 0, `${path}: VP8 frame header`)
  return {
    width: buffer.readUInt16LE(signature + 3) & 0x3fff,
    height: buffer.readUInt16LE(signature + 5) & 0x3fff,
  }
}

test('正解スターで採用済み3演出を順番に解放する', () => {
  assert.equal(BATTLE_STAR_PER_CORRECT, 10)
  assert.deepEqual(BATTLE_THEMES.map((theme) => theme.id), [
    'music-pastel',
    'art-tactics',
    'library-cinema',
  ])
  assert.deepEqual(BATTLE_THEMES.map((theme) => theme.unlockAt), [0, 150, 400])
  assert.deepEqual(BATTLE_THEMES.map((theme) => theme.ability.id), [
    'encore',
    'draft-guard',
    'page-burst',
  ])
  assert.deepEqual(BATTLE_THEMES.map((theme) => theme.presentation.layout), [
    'music-duel',
    'art-grid',
    'library-duel',
  ])
  assert.deepEqual(BATTLE_THEMES.map((theme) => theme.presentation.commandLabel), [
    'MELODY',
    'TOOLS',
    'FORMULA',
  ])
  assert.equal(battleStarsEarned(5), 50)
  assert.deepEqual(unlockedBattleThemes(149).map((theme) => theme.id), ['music-pastel'])
  assert.deepEqual(unlockedBattleThemes(150).map((theme) => theme.id), [
    'music-pastel',
    'art-tactics',
  ])
  assert.equal(battleThemeById('art-tactics', 149).id, 'music-pastel')
  assert.equal(battleThemeById('library-cinema', 399).id, 'art-tactics')
  assert.equal(nextBattleTheme(150).id, 'library-cinema')
  assert.deepEqual(
    newlyUnlockedBattleThemes(140, 410).map((theme) => theme.id),
    ['art-tactics', 'library-cinema'],
  )

  for (const theme of BATTLE_THEMES) {
    for (const path of [
      theme.preview,
      theme.stage,
      theme.heroPortrait,
      theme.rivalPortrait,
      theme.actorsSheet,
    ]) {
      assert.equal(existsSync(new URL(`../public${path}`, import.meta.url)), true, path)
    }
    assert.equal(theme.scenes.length, 3, theme.id)
    assert.ok(theme.particles.length >= 6, theme.id)
    assert.equal(theme.presentation.choiceGlyphs.length, 3, theme.id)
    assert.equal(theme.presentation.effectGlyphs.length, 3, theme.id)
    assert.ok(theme.presentation.unknownGlyph, theme.id)
  }
})

test('バトル背景は人物なしの独立プレートを12地点ぶん持ち、敵ごとに固定される', () => {
  assert.equal(BATTLE_STAGE_BACKGROUNDS.length, 12)
  assert.equal(new Set(BATTLE_STAGE_BACKGROUNDS.map(({ id }) => id)).size, 12)
  assert.ok(new Set(BATTLE_STAGE_BACKGROUNDS.map(({ location }) => location)).size >= 7)

  for (const stage of BATTLE_STAGE_BACKGROUNDS) {
    assert.equal(
      existsSync(new URL(`../public${stage.image}`, import.meta.url)),
      true,
      stage.id,
    )
    const size = pixelSizeOfWebp(stage.image)
    assert.equal(size.width, 1280, `${stage.id}: 横解像度`)
    assert.ok(size.height >= 590 && size.height <= 600, `${stage.id}: 超横長背景`)
  }

  const first = battleStageForEncounter('math-takagi', 'stem')
  assert.equal(battleStageForEncounter('math-takagi', 'stem'), first)
  assert.ok(BATTLE_STAGE_BACKGROUNDS.includes(first))
})

test('学校を中央核として街の五地点が五芒星の龍脈を構成する', () => {
  assert.equal(BATTLE_BARRIER_CENTER.id, 'school')
  assert.deepEqual(
    BATTLE_BARRIER_NODES.map((location) => location.id),
    ['library', 'station', 'central-park', 'shrine', 'stadium'],
  )
  assert.deepEqual(BATTLE_BARRIER_STAR_ORDER, [
    'library',
    'central-park',
    'stadium',
    'station',
    'shrine',
    'library',
  ])
  assert.equal(
    existsSync(new URL(`../public${BATTLE_BARRIER_MAP_IMAGE}`, import.meta.url)),
    true,
  )
  assert.deepEqual(
    pixelSizeOfWebp(BATTLE_BARRIER_MAP_IMAGE),
    { width: 1672, height: 941 },
  )

  const nodeIds = new Set(BATTLE_BARRIER_NODES.map((location) => location.id))
  assert.deepEqual(new Set(BATTLE_BARRIER_STAR_ORDER.slice(0, -1)), nodeIds)
  assert.equal(BATTLE_BARRIER_STAR_ORDER.at(0), BATTLE_BARRIER_STAR_ORDER.at(-1))
  assert.equal(
    new Set(BATTLE_BARRIER_NODES.map((location) => `${location.x}:${location.y}`)).size,
    5,
  )

  for (const location of [BATTLE_BARRIER_CENTER, ...BATTLE_BARRIER_NODES]) {
    assert.ok(location.name && location.role && location.description, location.id)
    assert.ok(location.x > 0 && location.x < 100, `${location.id}: x`)
    assert.ok(location.y > 0 && location.y < 100, `${location.id}: y`)
    assert.equal(battleBarrierLocationById(location.id), location)
  }
  assert.equal(battleBarrierLocationById('unknown'), BATTLE_BARRIER_CENTER)

  const mapSource = readFileSync(
    new URL('../src/screens/EnglishMap.jsx', import.meta.url),
    'utf8',
  )
  assert.match(mapSource, /dragon-vein-district|BATTLE_BARRIER_MAP_IMAGE/)
  assert.doesNotMatch(mapSource, /BATTLE_BARRIER_WINDOW_LIGHTS\.map|BATTLE_BARRIER_TRAFFIC_LIGHTS\.map|animateMotion/)
})
test('五つの星彩パラメータは全10人に固有の初期形と発現色を与える', () => {
  assert.equal(BATTLE_TRAITS.length, 5)
  assert.equal(new Set(BATTLE_TRAITS.map((trait) => trait.id)).size, 5)
  assert.equal(new Set(BATTLE_TRAITS.map((trait) => trait.color)).size, 5)
  assert.deepEqual(
    BATTLE_TRAITS.map((trait) => trait.name),
    ['知性', '共感', '調和', '信念', '勇気'],
  )
  assert.equal(Object.keys(BATTLE_STUDENT_BASE_TRAITS).length, BATTLE_STUDENTS.length)

  for (const student of BATTLE_STUDENTS) {
    const profile = battleStudentTraitProfile(student.id, {}, 0)
    assert.equal(profile.studentId, student.id)
    assert.ok(profile.dominant.color && profile.voice, student.id)
    for (const trait of BATTLE_TRAITS) {
      assert.ok(profile.levels[trait.id] >= 1, `${student.id}: ${trait.id}`)
      assert.ok(
        profile.levels[trait.id] <= MAX_BATTLE_TRAIT_LEVEL,
        `${student.id}: ${trait.id}`,
      )
    }
  }
  assert.equal(battleStudentTraitProfile('kaito', {}, 0).colorLabel, '橙・勇気')
})

test('五属性×6動作の30通りでマナ術式を段階演出できる', () => {
  assert.deepEqual(
    BATTLE_MANA_AFFINITIES.map((affinity) => affinity.id),
    BATTLE_TRAITS.map((trait) => trait.id),
  )
  assert.deepEqual(
    BATTLE_MANA_SEQUENCES.map((sequence) => sequence.id),
    ['focus', 'cast', 'ward', 'restore', 'break', 'triumph'],
  )
  for (const sequence of BATTLE_MANA_SEQUENCES) {
    assert.equal(sequence.phases.length, 4, sequence.id)
    assert.equal(new Set(sequence.phases).size, 4, sequence.id)
  }

  const scenarios = [
    [{}, 'focus'],
    [{ eventActive: true, eventKind: 'hit' }, 'cast'],
    [{ eventActive: true, eventKind: 'block' }, 'ward'],
    [{ eventActive: true, eventKind: 'counter', healing: 3 }, 'restore'],
    [{ eventActive: true, eventKind: 'damage' }, 'break'],
    [{ eventActive: true, eventKind: 'hit', enemyDefeated: true }, 'triumph'],
  ]
  for (const [input, expected] of scenarios) {
    assert.equal(battleManaSequenceFor(input).id, expected)
  }

  const presentations = BATTLE_MANA_AFFINITIES.flatMap((affinity, index) =>
    scenarios.map(([input]) => battleManaPresentation({
      traitId: affinity.id,
      secondaryTraitId: BATTLE_MANA_AFFINITIES[
        (index + 1) % BATTLE_MANA_AFFINITIES.length
      ].id,
      ...input,
    })),
  )
  assert.equal(presentations.length, 30)
  assert.equal(new Set(presentations.map(({ label }) => label)).size, 30)
  for (const presentation of presentations) {
    assert.notEqual(presentation.affinity.id, presentation.secondaryAffinity.id)
    assert.match(presentation.ariaLabel, /マナを操る/)
  }
})

test('放課後スター100個ごとの星彩ポイントを五芒星へ安全に配分・振り直しできる', () => {
  assert.equal(BATTLE_TRAIT_POINT_STARS, 100)
  assert.equal(battleTraitPointBudget(99), 0)
  assert.equal(battleTraitPointBudget(300), 3)

  let investments = {}
  investments = raiseBattleTrait({
    battleStars: 300,
    investments,
    studentId: 'kaito',
    traitId: 'courage',
  })
  investments = raiseBattleTrait({
    battleStars: 300,
    investments,
    studentId: 'kaito',
    traitId: 'courage',
  })
  investments = raiseBattleTrait({
    battleStars: 300,
    investments,
    studentId: 'mio',
    traitId: 'empathy',
  })

  assert.deepEqual(investments, {
    mio: { empathy: 1 },
    kaito: { courage: 2 },
  })
  assert.equal(battleStudentTraitProfile('kaito', investments, 300).levels.courage, 5)
  assert.deepEqual(
    battleTraitPointSummary(300, investments),
    {
      budget: 3,
      spent: 3,
      available: 0,
      starsUntilNext: 100,
      investments,
    },
  )
  assert.equal(canRaiseBattleTrait({
    battleStars: 300,
    investments,
    studentId: 'mio',
    traitId: 'insight',
  }), false)

  const noFourthPoint = raiseBattleTrait({
    battleStars: 300,
    investments,
    studentId: 'mio',
    traitId: 'insight',
  })
  assert.deepEqual(noFourthPoint, investments)

  const reset = resetBattleStudentTraits({
    battleStars: 300,
    investments,
    studentId: 'kaito',
  })
  assert.deepEqual(reset, { mio: { empathy: 1 } })
  assert.equal(battleTraitPointSummary(300, reset).available, 2)
})

test('星彩パラメータは旧sora IDをkaitoへ移し、不正値や未獲得ポイントを拒否する', () => {
  assert.deepEqual(
    normalizeBattleTraitInvestments({ sora: { courage: 1 } }, 100),
    { kaito: { courage: 1 } },
  )
  assert.equal(
    isValidBattleTraitInvestments({ kaito: { courage: 1 } }, 100),
    true,
  )
  assert.equal(
    isValidBattleTraitInvestments({ kaito: { courage: 2 } }, 100),
    false,
  )
  assert.equal(
    isValidBattleTraitInvestments({ kaito: { unknown: 1 } }, 100),
    false,
  )
})

test('主役10人×24状態と先生・敵役50人の全290画像が揃う', () => {
  assert.equal(BATTLE_STUDENTS.length, 10)
  assert.equal(BATTLE_EMOTION_STATES.length, 24)
  assert.equal(BATTLE_RIVALS.length, 50)
  assert.equal(BATTLE_RIVAL_GROUPS.length, 5)
  assert.equal(new Set(BATTLE_STUDENTS.map((student) => student.id)).size, 10)
  const kaito = BATTLE_STUDENTS.find((student) => student.id === 'kaito')
  assert.deepEqual(
    kaito && { name: kaito.name, reading: kaito.reading, club: kaito.club },
    { name: '風間カイト', reading: 'かざま かいと', club: '陸上部' },
  )
  assert.equal(isBattleStudentId('sora'), false)
  assert.equal(isRestorableBattleStudentId('sora'), true)
  assert.equal(normalizeBattleStudentId('sora'), 'kaito')
  assert.equal(battleStudentPortrait('sora', 'idle'), battleStudentPortrait('kaito', 'idle'))
  assert.equal(new Set(BATTLE_EMOTION_STATES.map((emotion) => emotion.id)).size, 24)
  assert.equal(new Set(BATTLE_RIVALS.map((rival) => rival.id)).size, 50)
  assert.equal(new Set(BATTLE_RIVALS.map((rival) => rival.name)).size, 50)
  assert.deepEqual(
    new Set(BATTLE_EMOTION_STATES.map((emotion) => emotion.id)),
    new Set([
      'idle', 'gentle', 'delighted', 'playful', 'healing', 'relieved',
      'confident', 'focused', 'curious', 'thinking', 'surprised',
      'embarrassed', 'worried', 'sad', 'crying', 'angry', 'determined',
      'scared', 'hurt', 'exhausted', 'attack', 'guard', 'victory', 'cheering',
    ]),
  )

  const studentAssets = BATTLE_STUDENTS.flatMap((student) =>
    BATTLE_EMOTION_STATES.map((emotion) =>
      battleStudentPortrait(student.id, emotion.id),
    ),
  )
  const rivalAssets = BATTLE_RIVALS.map((rival) => rival.portrait)
  const allAssets = [...studentAssets, ...rivalAssets]
  assert.equal(studentAssets.length, 240)
  assert.equal(rivalAssets.length, 50)
  assert.equal(new Set(allAssets).size, 290)

  for (const path of allAssets) {
    assert.equal(existsSync(new URL(`../public${path}`, import.meta.url)), true, path)
    assert.deepEqual(pixelSizeOfWebp(path), { width: 256, height: 256 }, path)
  }

  for (const group of BATTLE_RIVAL_GROUPS) {
    assert.equal(
      BATTLE_RIVALS.filter((rival) => rival.groupId === group.id).length,
      10,
      group.id,
    )
  }
})

test('旧七不思議枠の10人は街と学校を運営する現実の役職として登場する', () => {
  const councilGroup = BATTLE_RIVAL_GROUPS.find((group) => group.id === 'mystery')
  const council = BATTLE_RIVALS.filter((rival) => rival.groupId === 'mystery')

  assert.equal(councilGroup.name, '学園都市・運営評議会')
  assert.equal(council.length, 10)
  assert.ok(council.some((rival) => rival.title.includes('街区管理官')))
  assert.ok(council.some((rival) => rival.title.includes('学校法人理事長')))
  for (const rival of council) {
    assert.match(rival.title, /管理官|委員長|館長|センター長|監査役|局長|管理部長|理事長/)
    assert.doesNotMatch(`${rival.name} ${rival.title}`, /七不思議|幽霊|幻影|仮面|錬金|託宣|魔術師|影の/)
  }
})

test('全10人の12科目評定と全12担当教員が欠けなく対応する', () => {
  assert.deepEqual(SCHOOL_SUBJECT_NAMES, [
    '国語', '英語', '数学', '物理', '化学', '生物',
    '地学', '地理', '日本史', '世界史', '古文', '英コミュ',
  ])
  assert.deepEqual(BATTLE_GRADE_SUBJECTS, SCHOOL_SUBJECT_NAMES)
  assert.deepEqual(
    BATTLE_TEACHER_AFFINITIES.map(({ id, damageBonusPercent }) => [id, damageBonusPercent]),
    [
      ['excellent', 20],
      ['good', 10],
      ['standard', 0],
      ['challenge', 0],
    ],
  )

  for (const student of BATTLE_STUDENTS) {
    assert.deepEqual(Object.keys(student.grades), BATTLE_GRADE_SUBJECTS, student.id)
    for (const subject of BATTLE_GRADE_SUBJECTS) {
      assert.equal(Number.isInteger(student.grades[subject]), true, `${student.id}/${subject}`)
      assert.ok(student.grades[subject] >= 1 && student.grades[subject] <= 5)
    }
    const bestSubjects = battleStudentBestSubjects(student.id)
    assert.ok(bestSubjects.length >= 1 && bestSubjects.length <= 3, student.id)
  }

  assert.deepEqual(
    new Set(BATTLE_STUDENTS.flatMap((student) => battleStudentBestSubjects(student.id))),
    new Set(SCHOOL_SUBJECT_NAMES),
  )
  assert.deepEqual(
    Object.fromEntries(BATTLE_STUDENTS.map((student) => [
      student.id,
      battleStudentBestSubjects(student.id),
    ])),
    {
      mio: ['英コミュ'],
      ren: ['生物', '地学'],
      haru: ['国語', '英語', '古文'],
      akari: ['数学', '物理', '化学'],
      kaito: ['物理'],
      rei: ['日本史', '世界史'],
      nao: ['英語', '地理', '英コミュ'],
      tsubaki: ['国語', '日本史', '古文'],
      noa: ['数学', '物理', '地学'],
      yuu: ['国語', '世界史', '古文'],
    },
  )

  const teacherSubjects = Object.values(TEACHER_RIVALS).map(({ teacherSubject }) => teacherSubject)
  assert.equal(teacherSubjects.length, 11)
  assert.deepEqual(
    new Set(teacherSubjects),
    new Set(SCHOOL_SUBJECT_NAMES.filter((subject) => subject !== '古文')),
  )
  assert.equal(Object.keys(SCHOOL_TEACHERS).length, 12)
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(SCHOOL_TEACHERS).map(([id, teacher]) => [id, teacher.teacherSubject]),
    ),
    {
      'grass-wolf': '英語',
      'forest-keeper': '国語',
      chronos: '数学',
      leviathan: '地理',
      librarian: '化学',
      'silent-dragon': '英コミュ',
      tempest: '物理',
      'nameless-king': '地学',
      'archive-angel': '生物',
      'word-emperor': '日本史',
      'endless-book': '世界史',
      'classical-ogura': '古文',
    },
  )
  assert.deepEqual(
    new Set(Object.values(SCHOOL_TEACHERS).map(({ teacherSubject }) => teacherSubject)),
    new Set(SCHOOL_SUBJECT_NAMES),
  )
  const allAffinities = BATTLE_STUDENTS.flatMap((student) => (
    teacherSubjects.map((subject) => battleTeacherAffinity(student.id, subject))
  ))
  assert.equal(allAffinities.length, 110)
  for (const affinity of allAffinities) {
    assert.equal(affinity.active, true)
    assert.ok(affinity.grade >= 1 && affinity.grade <= 5)
    assert.match(affinity.label, /^相性/)
    assert.ok(affinity.gradeSubjects.length >= 1)
    assert.ok(affinity.gradeBasisLabel.length >= 1)
  }

  const rivalSubjects = BATTLE_RIVALS.map((rival) => battleRivalTeacherSubject(rival.id))
  assert.equal(rivalSubjects.length, 50)
  assert.equal(rivalSubjects.every(Boolean), true)
  for (const student of BATTLE_STUDENTS) {
    assert.equal(
      BATTLE_RIVALS.every((rival) => (
        battleTeacherAffinity(student.id, battleRivalTeacherSubject(rival.id)).active
      )),
      true,
      student.id,
    )
  }

  assert.equal(battleStudentSubjectGrade('mio', '英コミュ'), 5)
  assert.equal(battleTeacherAffinity('mio', '英コミュ').damageBonusPercent, 20)
  assert.equal(battleTeacherAffinity('mio', '英コミュ').gradeBasisLabel, '英コミュ')
  assert.equal(battleStudentSubjectGrade('akari', '古文'), 2)
  assert.equal(battleTeacherAffinity('akari', '古文').damageBonusPercent, 0)
  assert.equal(battleTeacherAffinity('mio', '理科').gradeBasisLabel, '物理・化学・生物・地学平均')
  assert.equal(battleTeacherAffinity('mio', '音楽').gradeBasisLabel, '12科目平均')
  assert.equal(battleStudentSubjectGrade('rei', '総合'), 4)
  assert.equal(battleStudentSubjectGrade('rei', '卒業試験'), 4)
  assert.equal(battleTeacherAffinity('mio', null).active, false)
})

test('主役10人×5行動の表情差分動画が揃い、戦闘状態から選べる', () => {
  assert.deepEqual(
    BATTLE_MOTION_STATES,
    ['attack', 'guard', 'healing', 'hurt', 'victory'],
  )
  assert.equal(battleStudentMotion('mio', 'idle'), null)
  assert.match(battleStudentMotion('mio', 'attack'), /mio\/attack\.webm$/)
  assert.match(battleStudentMotion('mio', 'determined'), /mio\/attack\.webm$/)
  assert.match(battleStudentMotion('mio', 'relieved'), /mio\/healing\.webm$/)
  assert.match(battleStudentMotion('mio', 'exhausted'), /mio\/hurt\.webm$/)
  assert.match(battleStudentMotion('sora', 'victory'), /kaito\/victory\.webm$/)

  const motionAssets = BATTLE_STUDENTS.flatMap((student) =>
    BATTLE_MOTION_STATES.map((motionId) =>
      `${student.motionBase}/${motionId}.webm`,
    ),
  )
  assert.equal(motionAssets.length, 50)
  assert.equal(new Set(motionAssets).size, 50)

  for (const path of motionAssets) {
    const buffer = readFileSync(new URL(`../public${path}`, import.meta.url))
    assert.equal(buffer.length > 2_000, true, `${path}: non-trivial video`)
    assert.deepEqual(
      [...buffer.subarray(0, 4)],
      [0x1a, 0x45, 0xdf, 0xa3],
      `${path}: WebM header`,
    )
  }
})

test('学校・放課後・休日まで11の日常ビジュアルが共同動作と衣装文脈を保つ', () => {
  assert.deepEqual(
    BATTLE_DAILY_SCENES.map((scene) => scene.id),
    [
      'morning',
      'commute',
      'classroom',
      'everyday',
      'club',
      'cafe',
      'snack',
      'shopping',
      'library',
      'arcade',
      'homeward',
    ],
  )
  assert.equal(new Set(BATTLE_DAILY_SCENES.map((scene) => scene.image)).size, 11)
  assert.equal(battleDailySceneById('commute').image, '/assets/battle/scenes/commute-v2.webp')
  assert.equal(battleDailySceneById('classroom').image, '/assets/battle/scenes/classroom-v3.webp')
  assert.equal(battleDailySceneById('snack').image, '/assets/battle/scenes/snack-v2.webp')
  assert.equal(battleDailySceneById('homeward').image, '/assets/battle/scenes/homeward-v2.webp')
  assert.equal(battleDailySceneById('park').id, 'morning')
  assert.equal(battleDailySceneById('shopping').image, '/assets/battle/scenes/shopping-casual.webp')
  assert.equal(battleDailySceneById('library').shortName, '図書館')
  assert.equal(battleDailySceneById('unknown').id, 'morning')

  const studentIds = new Set(BATTLE_STUDENTS.map((student) => student.id))
  const emotionIds = new Set(BATTLE_EMOTION_STATES.map((emotion) => emotion.id))
  const supportStyleIds = new Set(BATTLE_SUPPORT_STYLES.map((style) => style.id))
  const featuredStudentIds = new Set()
  const episodeTitles = new Set()
  const episodeChoiceIds = new Set()

  assert.deepEqual(
    BATTLE_SUPPORT_STYLES.map((style) => style.id),
    ['empathy', 'idea', 'together'],
  )
  assert.equal(battleSupportStyleById('idea').label, '小さな工夫を提案')
  assert.equal(battleSupportStyleById('unknown').id, 'empathy')

  for (const scene of BATTLE_DAILY_SCENES) {
    assert.ok(scene.name && scene.shortName && scene.description, scene.id)
    assert.match(scene.time, /^\d{2}:\d{2}$/)
    assert.equal(['school', 'afterschool', 'weekend'].includes(scene.contextId), true, scene.id)
    assert.equal(
      scene.outfitId,
      scene.contextId === 'weekend' ? 'weekend' : 'uniform',
      `${scene.id}: outfit follows setting`,
    )
    assert.ok(scene.cast.length >= 2, scene.id)
    assert.equal(existsSync(new URL(`../public${scene.image}`, import.meta.url)), true, scene.image)
    assert.deepEqual(pixelSizeOfWebp(scene.image), { width: 960, height: 540 }, scene.image)

    const episode = scene.episode
    assert.ok(episode?.title && episode.situation && episode.opening, `${scene.id}: episode`)
    assert.equal(episodeTitles.has(episode.title), false, `${scene.id}: unique title`)
    episodeTitles.add(episode.title)
    assert.equal(
      scene.cast.some((member) => member.studentId === episode.speakerId),
      true,
      `${scene.id}: episode speaker appears in scene`,
    )
    assert.equal(emotionIds.has(episode.openingEmotionId), true, `${scene.id}: opening emotion`)
    assert.equal(episode.choices.length, 3, `${scene.id}: choices`)
    assert.deepEqual(
      new Set(episode.choices.map((choice) => choice.styleId)),
      supportStyleIds,
      `${scene.id}: three support styles`,
    )

    for (const choice of episode.choices) {
      assert.equal(episodeChoiceIds.has(choice.id), false, `${scene.id}: unique choice id`)
      episodeChoiceIds.add(choice.id)
      assert.ok(choice.label && choice.reply, `${scene.id}: choice copy`)
      assert.equal(choice.label.length <= 30, true, `${scene.id}: mobile choice length`)
      assert.equal(choice.reply.length >= 18, true, `${scene.id}: meaningful reply`)
      assert.equal(supportStyleIds.has(choice.styleId), true, `${scene.id}: support style`)
      assert.equal(emotionIds.has(choice.emotionId), true, `${scene.id}: reply emotion`)
    }

    for (const castMember of scene.cast) {
      assert.equal(studentIds.has(castMember.studentId), true, `${scene.id}: student`)
      assert.equal(emotionIds.has(castMember.emotionId), true, `${scene.id}: emotion`)
      featuredStudentIds.add(castMember.studentId)
    }
  }

  assert.deepEqual(featuredStudentIds, studentIds)
  assert.equal(episodeTitles.size, BATTLE_DAILY_SCENES.length)
  assert.equal(episodeChoiceIds.size, BATTLE_DAILY_SCENES.length * 3)

  assert.doesNotMatch(JSON.stringify(BATTLE_DAILY_SCENES), /シンボルカード/)
})

test('全10人に自宅・休日・部活動の固有ビジュアルがある', () => {
  const paths = BATTLE_STUDENTS.flatMap((student) => (
    BATTLE_LIFESTYLE_OUTFITS.map((outfit) => (
      battleStudentLifestylePortrait(student.id, outfit.id)
    ))
  ))
  assert.equal(BATTLE_LIFESTYLE_OUTFITS.length, 3)
  assert.equal(BATTLE_CHARACTER_VISUAL_COUNT, 270)
  assert.equal(paths.length, 30)
  assert.equal(new Set(paths).size, 30)
  assert.equal(battleStudentLifestylePortrait('mio', 'uniform'), battleStudentPortrait('mio', 'idle'))
  for (const path of paths) {
    assert.equal(existsSync(new URL(`../public${path}`, import.meta.url)), true, path)
    assert.deepEqual(pixelSizeOfWebp(path), { width: 512, height: 512 }, path)
  }
})

test('回答イベントは生徒の喜怒哀楽・癒し・戦闘状態へ決定的に切り替わる', () => {
  const state = (lastEvent = null, extra = {}) => ({
    answered: 1,
    streak: 0,
    enemyDefeated: false,
    heroDefeated: false,
    lastEvent,
    ...extra,
  })
  assert.equal(battleStudentState(), 'idle')
  assert.equal(
    battleStudentState({
      battleState: state({ kind: 'hit', themeAbility: 'encore' }),
      eventActive: true,
    }),
    'healing',
  )
  assert.equal(
    battleStudentState({ battleState: state({ kind: 'block' }), eventActive: true }),
    'guard',
  )
  assert.equal(
    battleStudentState({
      battleState: state({ kind: 'damage' }),
      eventActive: true,
      eventKind: 'item-heal',
    }),
    'healing',
  )
  assert.equal(
    battleStudentState({ battleState: state({ kind: 'unknown' }), eventActive: true }),
    'worried',
  )
  assert.equal(
    battleStudentState({ battleState: state({ kind: 'damage' }), eventActive: true }),
    'hurt',
  )
  assert.equal(
    battleStudentState({ battleState: state(null, { enemyDefeated: true }) }),
    'victory',
  )
  assert.equal(
    battleStudentState({ battleState: state(null, { heroDefeated: true }) }),
    'exhausted',
  )
  assert.equal(
    battleStudentState({ battleState: state(null, { streak: 3 }) }),
    'confident',
  )

  const encounter = { id: 'teacher-math', name: '数学の試練', teacherSubject: '数学' }
  const first = battleRivalForEncounter(encounter, 7)
  assert.equal(battleRivalForEncounter(encounter, 7).id, first.id)
  assert.equal(first.groupId, 'stem')
})

test('生徒の待機表情はHP差に合い、優勢時のわからないを困り顔にしない', () => {
  const state = ({ heroHealthPercent, enemyHealthPercent, ...extra }) => ({
    answered: 3,
    streak: 0,
    enemyDefeated: false,
    heroDefeated: false,
    lastEvent: null,
    heroHealthPercent,
    enemyHealthPercent,
    ...extra,
  })
  const advantage = state({ heroHealthPercent: 80, enemyHealthPercent: 40 })
  const even = state({ heroHealthPercent: 60, enemyHealthPercent: 55, streak: 2 })
  const disadvantage = state({ heroHealthPercent: 30, enemyHealthPercent: 70 })

  assert.equal(battleStudentState({ battleState: advantage }), 'confident')
  assert.equal(battleStudentState({ battleState: even }), 'focused')
  assert.equal(battleStudentState({ battleState: disadvantage }), 'worried')
  assert.equal(
    battleStudentState({
      battleState: {
        ...advantage,
        lastEvent: { kind: 'unknown' },
      },
      eventActive: true,
    }),
    'focused',
  )
  assert.equal(
    battleStudentState({
      battleState: {
        ...disadvantage,
        lastEvent: { kind: 'unknown' },
      },
      eventActive: true,
    }),
    'worried',
  )
})

test('バトル結果は決着に合う生徒の表情へ切り替わる', () => {
  assert.equal(
    battleStudentResultState({ battleState: { heroDefeated: true }, accuracy: 1 }),
    'exhausted',
  )
  assert.equal(
    battleStudentResultState({ battleState: { enemyDefeated: true }, accuracy: 0 }),
    'victory',
  )
  assert.equal(battleStudentResultState({ accuracy: 0.8 }), 'delighted')
  assert.equal(battleStudentResultState({ accuracy: 0.5 }), 'relieved')
  assert.equal(battleStudentResultState({ accuracy: 0.2 }), 'sad')
})

test('バトル結果は全10人の性格に合わせてかわいいまたはかっこいい演出を選ぶ', () => {
  assert.deepEqual(BATTLE_RESULT_ANIMATION_STYLES, ['cute', 'cool'])

  const profiles = BATTLE_STUDENTS.map((student) => (
    battleStudentResultAnimation({
      studentId: student.id,
      battleState: { enemyDefeated: true },
      accuracy: 1,
    })
  ))
  assert.equal(profiles.length, 10)
  assert.deepEqual(new Set(profiles.map((profile) => profile.style)), new Set(['cute', 'cool']))
  assert.equal(profiles.every((profile) => profile.phase === 'victory'), true)
  assert.equal(profiles.every((profile) => profile.motionEmotion === 'victory'), true)
  assert.equal(profiles.every((profile) => profile.glyphs.length === 4), true)

  assert.deepEqual(
    battleStudentResultAnimation({
      studentId: 'mio',
      battleState: { enemyDefeated: true },
      accuracy: 1,
    }),
    {
      id: 'cute-victory',
      style: 'cute',
      phase: 'victory',
      label: 'きらめきフィニッシュ！',
      motionEmotion: 'victory',
      glyphs: ['🎼', '♥', '✦', '☆'],
    },
  )
  assert.equal(
    battleStudentResultAnimation({
      studentId: 'tsubaki',
      battleState: { enemyDefeated: true },
      accuracy: 1,
    }).id,
    'cool-victory',
  )
  assert.deepEqual(
    battleStudentResultAnimation({
      studentId: 'kaito',
      battleState: { heroDefeated: true },
      accuracy: 1,
    }),
    {
      id: 'cool-recovery',
      style: 'cool',
      phase: 'recovery',
      label: '態勢を整えて再挑戦',
      motionEmotion: 'healing',
      glyphs: ['👟', '◇', '✦', '↑'],
    },
  )
  assert.equal(
    battleStudentResultAnimation({ studentId: 'rei', accuracy: 0.5 }).motionEmotion,
    'guard',
  )
  assert.equal(
    battleStudentResultAnimation({ studentId: 'akari', accuracy: 0.5 }).motionEmotion,
    'healing',
  )
  assert.equal(
    battleStudentResultAnimation({ studentId: 'sora', accuracy: 1 }).style,
    'cool',
  )
})

test('3エリア固有能力は戦闘演出だけを変え、学習評価を変えない', () => {
  const answers = ['wrong', 'correct', 'correct', 'correct']
  const states = BATTLE_THEMES.map((theme) =>
    resolveBattleState({
      answers,
      total: 5,
      tacticId: 'combo',
      heroLevel: 20,
      themeId: theme.id,
    }),
  )

  assert.deepEqual(states.map((state) => state.correct), [3, 3, 3])
  assert.deepEqual(states.map((state) => state.misses), [1, 1, 1])
  assert.deepEqual(states.map((state) => state.enemyHp), [40, 40, 40])
  assert.deepEqual(states.map((state) => state.heroHp), [80, 80, 80])
  assert.ok(states[0].themeHealing > 0)
  assert.ok(states[1].themeBlockedDamage > 0)
  assert.ok(states[2].themeBonusDamage > 0)
  for (const state of states) {
    assert.equal(state.themeActivations, 1)
    assert.match(state.themeSummary, new RegExp(state.themeAbility.name))
  }
})

test('先生の担当教科との相性は実ダメージだけを支援し、学習評価と決着条件を変えない', () => {
  const shared = {
    answers: ['correct'],
    total: 5,
    tacticId: 'combo',
    heroLevel: 20,
    isBoss: true,
    studentId: 'akari',
  }
  const excellent = resolveBattleState({ ...shared, teacherSubject: '数学' })
  const challenge = resolveBattleState({ ...shared, teacherSubject: '古文' })

  assert.equal(excellent.teacherAffinity.id, 'excellent')
  assert.equal(challenge.teacherAffinity.id, 'challenge')
  assert.ok(excellent.damageDealt > challenge.damageDealt)
  assert.ok(excellent.affinityBonusDamage > 0)
  assert.equal(challenge.affinityBonusDamage, 0)
  assert.equal(excellent.correct, challenge.correct)
  assert.equal(excellent.misses, challenge.misses)
  assert.equal(excellent.enemyHp, challenge.enemyHp)
  assert.equal(excellent.enemyDefeated, false)

  const partial = resolveBattleState({
    ...shared,
    answers: ['correct', 'correct', 'correct', 'correct', 'wrong'],
  })
  const perfect = resolveBattleState({
    ...shared,
    answers: Array(5).fill('correct'),
  })
  assert.ok(partial.enemyCurrentHp > 0)
  assert.equal(partial.enemyDefeated, false)
  assert.equal(perfect.enemyCurrentHp, 0)
  assert.equal(perfect.enemyDefeated, true)
})

test('指定レベルと戦利品でHP・攻撃・防御が決まる', () => {
  let previous = heroBattleStats(1)
  assert.ok(previous.bonus.maxHp > 0)

  for (let level = 2; level <= MAX_HERO_LEVEL; level += 1) {
    const current = heroBattleStats(level)
    assert.ok(current.maxHp > previous.maxHp, `LV${level} HP`)
    assert.ok(current.attack > previous.attack, `LV${level} ATK`)
    assert.ok(current.defense > previous.defense, `LV${level} DEF`)
    previous = current
  }

  assert.equal(heroBattleStats(4).bonus.attack, 0)
  assert.equal(heroBattleStats(5).bonus.attack, 2)
  assert.equal(heroBattleStats(89).bonus.defense, 18)
  assert.equal(heroBattleStats(90).bonus.defense, 26)
})

test('獲得した学校アイテムに合わせて主人公の装備外見が変わる', () => {
  assert.equal(heroEquipmentForLevel(4).weapon, null)
  assert.equal(heroEquipmentForLevel(5).weapon.name, '勝負チョーク')
  assert.equal(heroEquipmentForLevel(49).weapon.name, '勝負チョーク')
  assert.equal(heroEquipmentForLevel(50).weapon.name, '添削の赤ペン')
  assert.equal(heroEquipmentForLevel(89).offhand.name, '校内見取り図')
  assert.equal(heroEquipmentForLevel(90).offhand.name, '生徒会の通学かばん')
  assert.equal(heroEquipmentForLevel(99).head.name, 'ことばの卒業帽')
})

test('取得済み学校アイテムから持ち込みと効果を選べる', () => {
  assert.equal(battleRelicForLevel(4, 5).name, '保健室のばんそうこう')
  assert.equal(battleRelicForLevel(15, 1).name, '保健室のばんそうこう')
  assert.equal(battleRelicForLevel(15, 15).name, '無音の黒板消し')
  assert.equal(battleRelicForLevel(15, null).name, '無音の黒板消し')

  assert.equal(relicBattleAbility(battleRelicForLevel(1, 1)).kind, 'heal')
  assert.equal(relicBattleAbility(battleRelicForLevel(5, 5)).kind, 'power')
  assert.equal(relicBattleAbility(battleRelicForLevel(15, 15)).kind, 'guard')
})

test('全21戦利品を取得LVから選べ、アクティブ効果に未対応品がない', () => {
  const kindCounts = { heal: 0, power: 0, guard: 0 }

  assert.equal(RELICS.length, 21)
  assert.equal(new Set(RELICS.map((relic) => relic.name)).size, 21)
  assert.doesNotMatch(
    RELICS.map((relic) => relic.name).join('、'),
    /旅人|騎士|王冠|水晶|羽根ペン/,
  )
  for (const relic of RELICS) {
    assert.equal(battleRelicForLevel(relic.level, relic.level), relic)
    const ability = relicBattleAbility(relic)
    assert.ok(ability.description)
    assert.ok(ability.short)
    assert.ok(ability.kind in kindCounts)
    kindCounts[ability.kind] += 1
  }

  assert.deepEqual(kindCounts, { heal: 6, power: 9, guard: 6 })
})

test('アイテムボックスは効果で絞り込み、取得順・新しい順・種類順に整理できる', () => {
  const originalLevels = RELICS.map((relic) => relic.level)

  assert.deepEqual(
    BATTLE_ITEM_FILTERS.map(({ id }) => id),
    ['all', 'power', 'guard', 'heal'],
  )
  assert.deepEqual(
    BATTLE_ITEM_SORTS.map(({ id }) => id),
    ['acquired', 'newest', 'kind'],
  )
  assert.deepEqual(
    organizeBattleItems(RELICS, { filterId: 'power' })
      .map((relic) => relic.level),
    [5, 25, 40, 45, 50, 60, 75, 95, 99],
  )
  assert.deepEqual(
    organizeBattleItems(RELICS, { filterId: 'guard' })
      .map((relic) => relic.level),
    [15, 30, 35, 65, 85, 90],
  )
  assert.deepEqual(
    organizeBattleItems(RELICS, { filterId: 'heal' })
      .map((relic) => relic.level),
    [1, 10, 20, 55, 70, 80],
  )
  assert.deepEqual(
    organizeBattleItems(RELICS, { sortId: 'newest' })
      .map((relic) => relic.level),
    [...originalLevels].reverse(),
  )
  assert.deepEqual(
    organizeBattleItems(RELICS, { sortId: 'kind' })
      .map((relic) => relicBattleAbility(relic).kind),
    [
      ...Array(9).fill('power'),
      ...Array(6).fill('guard'),
      ...Array(6).fill('heal'),
    ],
  )
  assert.deepEqual(RELICS.map((relic) => relic.level), originalLevels)
  assert.deepEqual(
    organizeBattleItems(RELICS, { filterId: 'unknown', sortId: 'unknown' })
      .map((relic) => relic.level),
    originalLevels,
  )
})

test('章ボスは各章の最終LVに固定される', () => {
  for (let level = 1; level <= MAX_HERO_LEVEL; level += 1) {
    const chapter = chapterForLevel(level)
    const encounter = encounterFor({ level, day: 100, enemyRankIndex: 2 })
    assert.equal(encounter.isBoss, level === chapter.maxLevel, `LV${level}`)
  }
})

test('全11章の先生は担当分野から記憶復元を助ける協力者になる', () => {
  const bossIds = CHAPTERS.map((chapter) => chapter.boss.id)
  assert.deepEqual(Object.keys(TEACHER_RIVALS).sort(), [...bossIds].sort())

  const specialtyNotes = new Set()
  for (const chapter of CHAPTERS) {
    const encounter = encounterFor({
      level: chapter.maxLevel,
      day: 100,
      enemyRankIndex: 2,
    })
    assert.equal(encounter.id, chapter.boss.id)
    assert.equal(encounter.isTeacher, true)
    assert.ok(encounter.teacherSubject)
    assert.equal(encounter.portraitId, encounter.id)
    assert.equal(hasTeacherPortrait(encounter), true)
    assert.equal(encounter.role, '龍脈解読の協力教員')
    assert.equal(encounter.move, encounter.teacherSubject + 'の専門メモ')
    assert.match(encounter.attackLine, /知識から手掛かりを示した。$/u)
    assert.match(encounter.intro, /一緒に記憶を復元しよう/u)
    assert.doesNotMatch(
      [encounter.intro, encounter.attackLine, ...Object.values(encounter.resultLines)].join('。'),
      /攻撃|倒す|悪いマナ|投げた|叩いた|勝者/u,
    )
    specialtyNotes.add(encounter.move)
  }

  assert.equal(specialtyNotes.size, CHAPTERS.length)

  const bossEncounter = encounterFor({
    level: CHAPTERS[0].maxLevel,
    day: 100,
    enemyRankIndex: 2,
  })
  const savedRival = battleRivalForEncounter(bossEncounter, 100)
  const displayedTeacher = battleOpponentForEncounter(bossEncounter, savedRival)
  assert.equal(displayedTeacher.id, savedRival.id, '保存済み一般ライバルIDは維持する')
  assert.equal(displayedTeacher.name, bossEncounter.name)
  assert.equal(displayedTeacher.teacherId, bossEncounter.id)
  assert.equal(displayedTeacher.isTeacher, true)
})
test('全章が校内ステージとして表示される', () => {
  assert.match(
    CHAPTERS.map((chapter) => chapter.name).join('、'),
    /教室.*図書室.*廊下.*プール.*理科室.*音楽室.*体育館.*校舎.*職員室.*校長室.*講堂/,
  )
})

test('日替わりエンカウントは同じ条件なら再現できる', () => {
  const args = { level: 34, day: 20661, enemyRankIndex: 3 }
  assert.deepEqual(encounterFor(args), encounterFor(args))
  assert.notEqual(
    encounterFor(args).id,
    encounterFor({ ...args, day: args.day + 1 }).id,
  )
})

test('全51体のMOBにアトラス画像と固有設定がそろっている', () => {
  const enemies = CHAPTERS.flatMap((chapter) => [...chapter.enemies, chapter.boss])
  const ids = enemies.map((enemy) => enemy.id)
  assert.equal(enemies.length, 51)
  assert.equal(new Set(ids).size, 51)
  assert.deepEqual(Object.keys(MOB_PROFILES).sort(), [...ids].sort())

  const moves = new Set()
  for (const enemy of enemies) {
    const profile = mobProfile(enemy.id)
    assert.equal(profile, MOB_PROFILES[enemy.id], enemy.id)
    assert.ok(Number.isInteger(profile.sprite), enemy.id)
    assert.ok(profile.sprite >= 0 && profile.sprite < 24, enemy.id)
    assert.ok(Number.isFinite(profile.hue), enemy.id)
    for (const key of [
      'species',
      'role',
      'element',
      'elementEmoji',
      'accent',
      'move',
      'intent',
      'lore',
    ]) {
      assert.ok(profile[key]?.length > 0, `${enemy.id}.${key}`)
    }
    moves.add(profile.move)
  }
  assert.equal(moves.size, 51)
  assert.equal(mobProfile('not-registered').species, '未確認種')
})

test('エンカウントに章の情景とMOB図鑑情報が含まれる', () => {
  const encounter = encounterFor({ level: 43, day: 20662, enemyRankIndex: 4 })
  assert.equal(encounter.chapterNumber, 5)
  assert.match(encounter.chapterGradient, /linear-gradient/)
  assert.equal(encounter.move, MOB_PROFILES[encounter.id].move)
  assert.equal(encounter.lore, MOB_PROFILES[encounter.id].lore)
})

test('戦闘時間は5・10・15問から選べ、日替わり推薦が循環する', () => {
  assert.deepEqual(BATTLE_QUESTS.map((quest) => quest.size), [5, 10, 15])
  assert.equal(battleQuest('scout').size, 5)
  assert.equal(battleQuest('unknown').id, 'duel')
  assert.deepEqual(
    [0, 1, 2, 3].map(featuredQuestId),
    ['scout', 'duel', 'expedition', 'scout'],
  )
})

test('旧作戦データは過去セッションの再現用に互換性を保つ', () => {
  assert.deepEqual(
    BATTLE_TACTICS.map((tactic) => tactic.id),
    ['combo', 'guard', 'counter'],
  )
  assert.equal(battleTactic('guard').name, '見直しモード')
  assert.equal(battleTactic('unknown').id, 'combo')
  assert.deepEqual(
    [0, 1, 2, 3].map(featuredBattleTacticId),
    ['combo', 'guard', 'counter', 'combo'],
  )
})

test('戦闘イベントはミニ戦場の攻撃方向と表示へ変換できる', () => {
  assert.equal(battleSceneCue().label, 'READY')
  assert.deepEqual(
    ['hit', 'burst', 'counter'].map((kind) => battleSceneCue(kind).target),
    ['enemy', 'enemy', 'enemy'],
  )
  assert.deepEqual(
    ['damage', 'unknown', 'block'].map((kind) => battleSceneCue(kind).target),
    ['hero', 'hero', 'hero'],
  )
  assert.equal(battleSceneCue('shield').emoji, '📒')
  assert.deepEqual(
    {
      label: battleSceneCue('item-heal').label,
      actor: battleSceneCue('item-heal').actor,
      target: battleSceneCue('item-heal').target,
    },
    { label: 'ITEM HEAL!', actor: 'hero', target: 'hero' },
  )
  assert.equal(battleSceneCue('not-registered').label, 'READY')
})

test('龍脈解読画面は通常進捗と共同解読ビジュアルを一つの流れにする', () => {
  const source = readFileSync(
    new URL('../src/screens/VocabQuiz.jsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /<ProgressBar value=\{index \/ deck\.length\}/)
  assert.match(source, /<DragonVeinCipherStage/)
  assert.match(source, /current=\{index \+ 1\}/)
  assert.match(source, /total=\{deck\.length\}/)
  assert.match(source, /aria-label=\{isDragonVein \? '解読を中断' : 'やめる'\}/)
  assert.doesNotMatch(source, /<BattleHud|heroCurrentHp|enemyCurrentHp|data-battle-ui-mode/)
})
test('龍脈解読中は記憶断片カードと4つの回答をコンパクト表示する', () => {
  const source = readFileSync(
    new URL('../src/screens/VocabQuiz.jsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /isDragonVein \? 'mt-2 grid grid-cols-2 gap-2'/)
  assert.match(source, /isDragonVein \? 'min-h-14 rounded-xl px-3 py-2\.5 text-sm'/)
  assert.match(source, /<UnknownChoiceButton/)
  assert.match(source, /この記憶断片が指す意味は？/)
  assert.match(source, /<Button full size=\{isDragonVein \? 'md' : 'lg'\}/)
  assert.doesNotMatch(source, /choiceGlyphs|unknownGlyph|battle-command-choice/)
})
test('龍脈進捗は正解結果を記録し、全保存経路へつながる', () => {
  const quizSource = readFileSync(
    new URL('../src/screens/VocabQuiz.jsx', import.meta.url),
    'utf8',
  )
  const resultSource = readFileSync(
    new URL('../src/screens/SessionResult.jsx', import.meta.url),
    'utf8',
  )
  const storeSource = readFileSync(
    new URL('../src/store/useStore.js', import.meta.url),
    'utf8',
  )
  const progressSource = readFileSync(
    new URL('../src/lib/progressCode.js', import.meta.url),
    'utf8',
  )
  const cloudSource = readFileSync(
    new URL('../src/lib/cloudSync.js', import.meta.url),
    'utf8',
  )

  assert.doesNotMatch(quizSource, /addBattleStars|BATTLE_STAR_PER_CORRECT/)
  assert.match(resultSource, /recordDragonVeinSession/)
  assert.match(resultSource, /復元断片/)
  assert.doesNotMatch(resultSource, /\bXP\b|xpGained|xpAtStart/)
  for (const source of [storeSource, progressSource, cloudSource]) {
    assert.match(source, /dragonVeinProgress/)
  }
  assert.match(progressSource, /compactDragonVeinProgress/)
  assert.match(progressSource, /expandDragonVeinProgress/)
  assert.doesNotMatch(resultSource, /battleStarsGained|enemyDefeated|damage/)
})
test('選んだ生徒は協力者として龍脈解読へ同行し、対戦相手にはしない', () => {
  const mapSource = readFileSync(
    new URL('../src/screens/EnglishMap.jsx', import.meta.url),
    'utf8',
  )
  const resultSource = readFileSync(
    new URL('../src/screens/SessionResult.jsx', import.meta.url),
    'utf8',
  )
  const quizSource = readFileSync(
    new URL('../src/screens/VocabQuiz.jsx', import.meta.url),
    'utf8',
  )
  const activeMap = mapSource.slice(
    mapSource.indexOf('export function AfterSchoolChronicleScreen'),
    mapSource.indexOf('function ChroniclePortalCard'),
  )

  assert.match(activeMap, /const battleStudent = battleStudentById\(battleStudentId\)/)
  assert.match(activeMap, /studentId: battleStudent\.id/)
  assert.match(activeMap, /協力する生徒たち/)
  assert.match(quizSource, /selectedStudentId/)
  assert.match(quizSource, /studentId=\{selectedStudentId\}/)
  assert.match(resultSource, /studentId=\{selectedStudentId\}/)
  assert.doesNotMatch(activeMap, /BattlePreparationScreen|BattleCompanionPicker|VS|対決前|次の相手/)
  assert.doesNotMatch(resultSource, /NextBattleCompanionCard|upcomingRival|戦いの結末/)
})
test('10人の豊富な表情と先生立ち絵を共同解読の状況へつなぐ', () => {
  const mapSource = readFileSync(
    new URL('../src/screens/EnglishMap.jsx', import.meta.url),
    'utf8',
  )
  const quizSource = readFileSync(
    new URL('../src/screens/VocabQuiz.jsx', import.meta.url),
    'utf8',
  )
  const stageSource = readFileSync(
    new URL('../src/components/DragonVeinCipherStage.jsx', import.meta.url),
    'utf8',
  )
  const resultSource = readFileSync(
    new URL('../src/screens/SessionResult.jsx', import.meta.url),
    'utf8',
  )
  const cssSource = readFileSync(
    new URL('../src/index.css', import.meta.url),
    'utf8',
  )

  assert.match(mapSource, /<BattleCastRoster/)
  assert.match(mapSource, /<SchoolBarrierMap/)
  assert.match(mapSource, /BATTLE_EMOTION_STATES\.map/)
  assert.match(stageSource, /thinking: '思考中'/)
  assert.match(stageSource, /worried: '焦りを抑えて再考'/)
  assert.match(stageSource, /hurt: '苦悶しながら立て直し'/)
  assert.match(stageSource, /delighted: 'とびきりの笑顔'/)
  assert.match(stageSource, /battleStudentPortrait\(student\.id, expression\)/)
  assert.match(stageSource, /guide\.standing/)
  assert.match(quizSource, /wrongStreak=\{streakState\.wrongStreak\}/)
  assert.match(quizSource, /連続.*正解/)
  assert.match(resultSource, /expressionStreak = accuracy >= 0\.9 \? 5/)
  assert.match(cssSource, /@keyframes dragon-vein-natural-breathe/)
  assert.match(cssSource, /@media \(prefers-reduced-motion: reduce\)[\s\S]*dragon-vein-student-layer/)
  assert.doesNotMatch(
    [quizSource, stageSource, resultSource].join('\n'),
    /BattleOpponentStandingActor|battle-spell|enemyDefeated|damageTaken|攻撃モーション/u,
  )
})
test('廃止した戦闘アイテムと装備効果を現行の調査画面へ出さない', () => {
  const mapSource = readFileSync(
    new URL('../src/screens/EnglishMap.jsx', import.meta.url),
    'utf8',
  )
  const settingsSource = readFileSync(
    new URL('../src/components/GameSettings.jsx', import.meta.url),
    'utf8',
  )
  const quizSource = readFileSync(
    new URL('../src/screens/VocabQuiz.jsx', import.meta.url),
    'utf8',
  )
  const resultSource = readFileSync(
    new URL('../src/screens/SessionResult.jsx', import.meta.url),
    'utf8',
  )
  const activeMap = mapSource.slice(
    mapSource.indexOf('export function AfterSchoolChronicleScreen'),
    mapSource.indexOf('function ChroniclePortalCard'),
  )

  for (const source of [activeMap, settingsSource, quizSource, resultSource]) {
    assert.doesNotMatch(
      source,
      /BattleItemBox|school-battle-item-box|useBattleItem|itemUsed|enemyCurrentHp|heroCurrentHp|damageTaken|1バトル1回/u,
    )
  }
  assert.match(settingsSource, /生徒の考え方や表情と、先生からの手掛かりを表示します/u)
  assert.doesNotMatch(settingsSource, /対戦・攻撃・HP/u)
  assert.match(quizSource, /<DragonVeinCipherStage/u)
  assert.match(resultSource, /復元断片/u)
})
test('集中モードは3連続正解ごとに花まるコンボを発動する', () => {
  const state = resolveBattleState({
    answers: ['correct', 'correct', 'correct', 'wrong', 'correct'],
    total: 5,
    tacticId: 'combo',
  })
  assert.equal(state.comboBursts, 1)
  assert.equal(state.activations, 1)
  assert.equal(state.maxStreak, 3)
  assert.equal(state.heroHp, 80)
  assert.match(state.summary, /花まるコンボ 1回/)
})

test('守護の型は2正解で盾を作り、次のミスだけを防ぐ', () => {
  const blocked = resolveBattleState({
    answers: ['correct', 'correct', 'unknown'],
    total: 5,
    tacticId: 'guard',
  })
  assert.equal(blocked.lastEvent.kind, 'block')
  assert.equal(blocked.heroHp, 100)

  const state = resolveBattleState({
    answers: ['correct', 'correct', 'wrong', 'wrong'],
    total: 5,
    tacticId: 'guard',
  })
  assert.equal(state.protectedHits, 1)
  assert.equal(state.shields, 0)
  assert.equal(state.heroHp, 80)
})

test('逆転の型はミス直後の正解でカウンターしHPを回復する', () => {
  const state = resolveBattleState({
    answers: ['wrong', 'correct', 'unknown', 'wrong', 'correct'],
    total: 5,
    tacticId: 'counter',
  })
  assert.equal(state.counters, 2)
  assert.equal(state.activations, 2)
  assert.equal(state.heroHp, 80)
  assert.match(state.summary, /HP回復 2回/)
})

test('作戦を変えても同じ正誤なら敵HPと学習評価は変わらない', () => {
  const answers = ['correct', 'correct', 'wrong', 'correct', 'unknown']
  const states = BATTLE_TACTICS.map((tactic) =>
    resolveBattleState({ answers, total: 5, tacticId: tactic.id }),
  )
  assert.deepEqual(states.map((state) => state.correct), [3, 3, 3])
  assert.deepEqual(states.map((state) => state.misses), [2, 2, 2])
  assert.deepEqual(states.map((state) => state.enemyHp), [40, 40, 40])
})

test('攻撃アイテムは次の正解まで待機し、実ダメージだけを強化する', () => {
  const answers = ['wrong', 'correct']
  const normal = resolveBattleState({
    answers,
    total: 5,
    tacticId: 'guard',
    heroLevel: 5,
  })
  const boosted = resolveBattleState({
    answers,
    total: 5,
    tacticId: 'guard',
    heroLevel: 5,
    relicLevel: 5,
    itemUsedAt: 0,
  })

  assert.equal(boosted.lastEvent.kind, 'item-power')
  assert.equal(boosted.itemTriggered, true)
  assert.ok(boosted.itemBonusDamage > 0)
  assert.ok(boosted.damageDealt > normal.damageDealt)
  assert.equal(boosted.correct, normal.correct)
  assert.equal(boosted.misses, normal.misses)
  assert.equal(boosted.enemyHp, normal.enemyHp)
})

test('防御アイテムは正解中も待機し、次の反撃を1回だけ防ぐ', () => {
  const state = resolveBattleState({
    answers: ['correct', 'wrong', 'wrong'],
    total: 5,
    tacticId: 'combo',
    heroLevel: 15,
    relicLevel: 15,
    itemUsedAt: 0,
  })

  assert.equal(state.itemBlocked, 1)
  assert.equal(state.itemTriggered, true)
  assert.equal(state.damageTaken, state.enemyStats.normalDamage)
  assert.equal(state.correct, 1)
  assert.equal(state.misses, 2)
})

test('HPアイテムは回答後でも次ターン前に1回だけ回復できる', () => {
  const damaged = resolveBattleState({
    answers: ['wrong'],
    total: 5,
    tacticId: 'combo',
    heroLevel: 1,
  })
  const healed = resolveBattleState({
    answers: ['wrong'],
    total: 5,
    tacticId: 'combo',
    heroLevel: 1,
    relicLevel: 1,
    itemUsedAt: 1,
  })

  assert.equal(healed.itemUsed, true)
  assert.equal(healed.itemTriggered, true)
  assert.equal(healed.itemHealing, 14)
  assert.equal(healed.heroCurrentHp, damaged.heroCurrentHp + healed.itemHealing)
  assert.equal(healed.correct, damaged.correct)
  assert.equal(healed.misses, damaged.misses)
})

test('高LVほど一撃の実ダメージが増えても学習上の討伐条件は変わらない', () => {
  const args = {
    answers: ['correct'],
    total: 5,
    tacticId: 'combo',
    enemyRankIndex: 0,
  }
  const novice = resolveBattleState({ ...args, heroLevel: 1 })
  const veteran = resolveBattleState({ ...args, heroLevel: 50 })

  assert.ok(veteran.lastEvent.damage > novice.lastEvent.damage)
  assert.ok(veteran.heroStats.attack > novice.heroStats.attack)
  assert.equal(veteran.correct, novice.correct)
  assert.equal(veteran.enemyHp, novice.enemyHp)
  assert.equal(veteran.enemyHp, 80)
})

test('5・10・15問のどれでも残り問題がある間はHPが0にならない', () => {
  const firstHitHealth = []

  for (const quest of BATTLE_QUESTS) {
    for (let answered = 0; answered < quest.size; answered += 1) {
      const enemyState = resolveBattleState({
        answers: Array(answered).fill('correct'),
        total: quest.size,
        tacticId: 'combo',
      })
      const heroState = resolveBattleState({
        answers: Array(answered).fill('wrong'),
        total: quest.size,
        tacticId: 'combo',
      })

      assert.ok(enemyState.enemyCurrentHp > 0, `${quest.id}: enemy ${answered}`)
      assert.ok(enemyState.enemyHealthPercent > 0, `${quest.id}: enemy% ${answered}`)
      assert.ok(heroState.heroCurrentHp > 0, `${quest.id}: hero ${answered}`)
      assert.ok(heroState.heroHealthPercent > 0, `${quest.id}: hero% ${answered}`)
      assert.equal(enemyState.complete, false)
      assert.equal(heroState.complete, false)
    }

    const wins = BATTLE_TACTICS.map((tactic) => resolveBattleState({
      answers: Array(quest.size).fill('correct'),
      total: quest.size,
      tacticId: tactic.id,
    }))
    const lost = resolveBattleState({
      answers: Array(quest.size).fill('wrong'),
      total: quest.size,
      tacticId: 'combo',
    })
    for (const won of wins) {
      assert.equal(won.enemyCurrentHp, 0, `${quest.id}/${won.tacticId}: final enemy HP`)
      assert.equal(won.enemyHealthPercent, 0, `${quest.id}/${won.tacticId}: final enemy%`)
      assert.equal(won.enemyDefeated, true)
      assert.equal(won.complete, true)
    }
    assert.equal(lost.heroCurrentHp, 0, `${quest.id}: final hero HP`)
    assert.equal(lost.heroHealthPercent, 0, `${quest.id}: final hero%`)
    assert.equal(lost.heroDefeated, true)
    assert.equal(lost.complete, true)

    firstHitHealth.push(resolveBattleState({
      answers: ['correct'],
      total: quest.size,
      tacticId: 'combo',
    }).enemyHealthPercent)
  }

  assert.ok(firstHitHealth[0] < firstHitHealth[1])
  assert.ok(firstHitHealth[1] < firstHitHealth[2])
})

test('実HP・ダメージ・回復量を戦闘ログから再現できる', () => {
  const state = resolveBattleState({
    answers: ['wrong', 'correct'],
    total: 5,
    tacticId: 'counter',
    heroLevel: 35,
    enemyRankIndex: 2,
  })

  assert.ok(state.heroMaxHp > 100)
  assert.ok(state.enemyMaxHp > 0)
  assert.ok(state.damageDealt > 0)
  assert.ok(state.damageTaken > 0)
  assert.ok(state.healingDone > 0)
  assert.equal(state.lastEvent.kind, 'counter')
  assert.ok(state.lastEvent.damage > 0)
  assert.ok(state.lastEvent.healing > 0)
  assert.equal(state.heroCurrentHp, state.heroMaxHp)
})

test('戦果メッセージは正答率の4段階を返す', () => {
  assert.equal(battleVerdict(1).id, 'legendary')
  assert.equal(battleVerdict(0.7).id, 'victory')
  assert.equal(battleVerdict(0.4).id, 'draw')
  assert.equal(battleVerdict(0).id, 'retreat')
  assert.doesNotMatch(battleVerdict(1).text, /先生|花まる/u)
})

test('先生11人は敵ではなく担当分野の共同解読者として助言する', () => {
  for (const chapter of CHAPTERS) {
    const encounter = encounterFor({
      level: chapter.maxLevel,
      day: 100,
      enemyRankIndex: 2,
    })
    assert.equal(encounter.isTeacher, true)
    assert.equal(encounter.role, '龍脈解読の協力教員')
    assert.match(encounter.intro, /専門知識を使って、一緒に記憶を復元しよう/u)
    assert.match(encounter.move, /専門メモ/u)
    assert.match(encounter.attackLine, /知識から手掛かりを示した/u)
    assert.deepEqual(
      Object.keys(encounter.resultLines).sort(),
      ['defeated', 'dominant', 'unresolved'],
    )
    const lines = Object.values(encounter.resultLines).join('。')
    assert.match(lines, /記録|文脈|資料/u)
    assert.doesNotMatch(
      [encounter.intro, encounter.attackLine, lines].join('。'),
      /悪いマナ|敵|倒|攻撃|投げた|叩いた|封じ込め|勝者/u,
      encounter.id,
    )
  }

  const resultSource = readFileSync(
    new URL('../src/screens/SessionResult.jsx', import.meta.url),
    'utf8',
  )
  assert.match(resultSource, /<DragonVeinCipherStage/u)
  assert.doesNotMatch(resultSource, /teacherBattleResultLine|enemyDefeated/u)
})
test('敵ランクは冒険者LVの解放上限を超えない', () => {
  assert.equal(maxEnemyRankIndexForHeroLevel(1), 0)
  assert.equal(maxEnemyRankIndexForHeroLevel(9), 0)
  assert.equal(maxEnemyRankIndexForHeroLevel(10), 1)
  assert.equal(maxEnemyRankIndexForHeroLevel(17), 1)
  assert.equal(capEnemyPositionForHeroLevel(6, 17), 1)
  assert.equal(maxEnemyRankIndexForHeroLevel(84), 5)
  assert.equal(maxEnemyRankIndexForHeroLevel(85), 6)
  assert.equal(nextEnemyRankUnlockForHeroLevel(17).label, '3級')
  assert.equal(nextEnemyRankUnlockForHeroLevel(99), null)
})

test('同じ級のポイント進行をランクアップと表示しない', () => {
  assert.equal(battleTrend(0, 0.3), 'advance')
  assert.equal(battleTrend(0.3, 0), 'ease')
  assert.equal(battleTrend(0.4, 0.7), 'up')
  assert.equal(battleTrend(0.7, 0.4), 'down')
  assert.equal(battleTrend(0.3, 0.3), 'flat')
})

test('ランクアップ予告後の再戦sourceも実際の次ランクへ更新される', () => {
  const battle = battleProgression(
    {
      type: 'battle',
      levelIndex: 0,
      levelId: '5',
      position: 0.4,
      questId: 'duel',
      tacticId: 'guard',
    },
    0.8,
    1,
  )

  assert.equal(battle.from, 0.4)
  assert.equal(battle.to, 0.7)
  assert.equal(battle.trend, 'up')
  assert.equal(battle.source.position, 0.7)
  assert.equal(battle.source.levelIndex, 1)
  assert.equal(battle.source.levelId, '4')
  assert.equal(battle.source.questId, 'duel')
  assert.equal(battle.source.tacticId, 'guard')
})
