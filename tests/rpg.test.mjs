import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

import { battleProgression, battleTrend } from '../src/lib/adaptive.js'
import {
  BATTLE_QUESTS,
  BATTLE_TACTICS,
  CHAPTERS,
  MAX_HERO_LEVEL,
  MAX_LEVEL_XP,
  MOB_PROFILES,
  RELICS,
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
  heroProgress,
  maxEnemyRankIndexForHeroLevel,
  mobProfile,
  nextEnemyRankUnlockForHeroLevel,
  relicBattleAbility,
  resolveBattleState,
  xpAtLevel,
  xpNeededForNextLevel,
} from '../src/lib/rpg.js'
import {
  BATTLE_STAR_PER_CORRECT,
  BATTLE_STARS_PER_EXCHANGE,
  BATTLE_THEMES,
  BATTLE_XP_PER_EXCHANGE,
  battleXpExchange,
  battleStarsEarned,
  battleThemeById,
  newlyUnlockedBattleThemes,
  nextBattleTheme,
  unlockedBattleThemes,
} from '../src/lib/battleThemes.js'
import {
  BATTLE_EMOTION_STATES,
  BATTLE_RIVAL_GROUPS,
  BATTLE_RIVALS,
  BATTLE_STUDENTS,
  battleRivalForEncounter,
  battleStudentPortrait,
  battleStudentState,
} from '../src/lib/battleCast.js'

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
  }
})

test('未変換の学習XPを一度だけ放課後スターへまとめて変換する', () => {
  assert.equal(BATTLE_XP_PER_EXCHANGE, 50)
  assert.equal(BATTLE_STARS_PER_EXCHANGE, 25)

  const exchange = battleXpExchange(289, 40, 100)
  assert.deepEqual(
    {
      availableXp: exchange.availableXp,
      exchanges: exchange.exchanges,
      xpCost: exchange.xpCost,
      starsGained: exchange.starsGained,
      availableAfter: exchange.availableAfter,
      nextSpentXp: exchange.nextSpentXp,
      nextBattleStars: exchange.nextBattleStars,
    },
    {
      availableXp: 249,
      exchanges: 4,
      xpCost: 200,
      starsGained: 100,
      availableAfter: 49,
      nextSpentXp: 240,
      nextBattleStars: 200,
    },
  )
  assert.equal(exchange.canExchange, true)

  const remainder = battleXpExchange(289, exchange.nextSpentXp, exchange.nextBattleStars)
  assert.equal(remainder.canExchange, false)
  assert.equal(remainder.xpUntilNext, 1)
  assert.equal(battleXpExchange(100, 999, 0).availableXp, 0)
  assert.equal(battleXpExchange(500, 0, 9_999_990).starCapacityReached, true)
})

test('主役10人×24状態と先生・敵役50人の全290画像が揃う', () => {
  assert.equal(BATTLE_STUDENTS.length, 10)
  assert.equal(BATTLE_EMOTION_STATES.length, 24)
  assert.equal(BATTLE_RIVALS.length, 50)
  assert.equal(BATTLE_RIVAL_GROUPS.length, 5)
  assert.equal(new Set(BATTLE_STUDENTS.map((student) => student.id)).size, 10)
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

test('冒険者LVはXPとともに1〜99まで単調に上がる', () => {
  assert.equal(heroProgress(-100).level, 1)
  assert.equal(heroProgress(0).level, 1)
  assert.equal(heroProgress(MAX_LEVEL_XP).level, MAX_HERO_LEVEL)
  assert.equal(heroProgress(MAX_LEVEL_XP + 999999).level, MAX_HERO_LEVEL)
  assert.equal(heroProgress(MAX_LEVEL_XP).isMax, true)

  let previous = 1
  for (let xp = 0; xp <= MAX_LEVEL_XP; xp += 7) {
    const current = heroProgress(xp)
    assert.ok(current.level >= previous)
    assert.ok(current.level >= 1 && current.level <= MAX_HERO_LEVEL)
    assert.ok(current.progress >= 0 && current.progress <= 1)
    previous = current.level
  }
})

test('各LVの境界と次LVまでのXPが一致する', () => {
  for (let level = 1; level < MAX_HERO_LEVEL; level += 1) {
    const start = xpAtLevel(level)
    const next = xpAtLevel(level + 1)
    assert.equal(next - start, xpNeededForNextLevel(level), `LV${level}`)
    assert.equal(heroProgress(start).level, level)
    assert.equal(heroProgress(next - 1).level, level)
    assert.equal(heroProgress(next).level, level + 1)
  }
})

test('レベルアップと戦利品でHP・攻撃・防御が成長する', () => {
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
  assert.deepEqual(
    heroProgress(xpAtLevel(50)).battleStats,
    heroBattleStats(50),
  )
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

test('章ボスは各章の最終LVに固定される', () => {
  for (let level = 1; level <= MAX_HERO_LEVEL; level += 1) {
    const chapter = chapterForLevel(level)
    const encounter = encounterFor({ level, day: 100, enemyRankIndex: 2 })
    assert.equal(encounter.isBoss, level === chapter.maxLevel, `LV${level}`)
  }
})

test('全11章のボスが固有備品で攻撃する架空の先生ライバルになる', () => {
  const bossIds = CHAPTERS.map((chapter) => chapter.boss.id)
  assert.deepEqual(Object.keys(TEACHER_RIVALS).sort(), [...bossIds].sort())

  const moves = new Set()
  const attackLines = new Set()
  for (const chapter of CHAPTERS) {
    const encounter = encounterFor({
      level: chapter.maxLevel,
      day: 100,
      enemyRankIndex: 2,
    })
    assert.equal(encounter.id, chapter.boss.id)
    assert.equal(encounter.isTeacher, true)
    assert.ok(encounter.teacherSubject)
    assert.ok(encounter.portraitEmoji)
    assert.ok(encounter.attackEmoji)
    assert.ok(encounter.attackLine.endsWith('！'))
    moves.add(encounter.move)
    attackLines.add(encounter.attackLine)
  }

  assert.equal(moves.size, CHAPTERS.length)
  assert.equal(attackLines.size, CHAPTERS.length)
  assert.match(TEACHER_RIVALS['grass-wolf'].attackLine, /チョークを投げた/)
  assert.match(TEACHER_RIVALS['forest-keeper'].attackLine, /黒板消し/)
  assert.match(TEACHER_RIVALS['endless-book'].move, /朝礼ロングスピーチ/)
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

test('作戦カードは3種類から選べ、日替わり推薦が循環する', () => {
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
  assert.equal(battleSceneCue('not-registered').label, 'READY')
})

test('バトル画面は共通クイズ進捗を重ねずHUDのターン表示へ一本化する', () => {
  const source = readFileSync(
    new URL('../src/screens/VocabQuiz.jsx', import.meta.url),
    'utf8',
  )
  const standardStart = source.indexOf('{!isBattle && (')
  const battleStart = source.indexOf('{isBattle && (', standardStart)
  const questionStart = source.indexOf('{/* 出題語 */}', battleStart)

  assert.ok(standardStart >= 0)
  assert.ok(battleStart > standardStart)
  assert.ok(questionStart > battleStart)

  const standardHeader = source.slice(standardStart, battleStart)
  const battleHeader = source.slice(battleStart, questionStart)
  assert.match(standardHeader, /<ProgressBar\b/)
  assert.match(battleHeader, /<BattleHud\b/)
  assert.doesNotMatch(battleHeader, /<ProgressBar\b/)
  assert.match(battleHeader, /onExit=\{back\}/)
  assert.match(source, /aria-label="バトルをやめる"/)
})

test('バトル中は出題カードと4つの回答をコンパクト表示する', () => {
  const source = readFileSync(
    new URL('../src/screens/VocabQuiz.jsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /isBattle && 'battle-quiz-screen'/)
  assert.match(source, /isBattle \? 'mt-2 grid grid-cols-2 gap-2'/)
  assert.match(source, /min-h-12 rounded-xl/)
  assert.match(source, /className=\{isBattle \? 'pixel-battle-choice min-h-12 py-2 leading-snug'/)
  assert.match(source, /<Button full size="md" disabled=\{!answered\}/)
  assert.match(source, /<Button full size="lg" disabled=\{!answered\}/)
})

test('放課後スターはバトル正解とXP変換で増え、演出選択と全保存経路へつながる', () => {
  const mapSource = readFileSync(
    new URL('../src/screens/EnglishMap.jsx', import.meta.url),
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

  assert.match(quizSource, /if \(isBattle\) addBattleStars\(BATTLE_STAR_PER_CORRECT\)/)
  assert.match(quizSource, /pixel-battle-portrait/)
  assert.match(quizSource, /battleTheme\.stage/)
  assert.match(mapSource, /BATTLE_THEMES\.map/)
  assert.match(mapSource, /themeId: battleTheme\.id/)
  assert.match(mapSource, /正解1問 \+\{BATTLE_STAR_PER_CORRECT\}/)
  assert.match(mapSource, /<XpExchangeCard/)
  assert.match(mapSource, /exchangeXpForBattleStars/)
  assert.match(resultSource, /<BattleStarsCard/)
  for (const source of [storeSource, progressSource, cloudSource]) {
    assert.match(source, /battleStars/)
    assert.match(source, /battleXpSpent/)
    assert.match(source, /battleThemeId/)
    assert.match(source, /battleStudentId/)
  }
})

test('キャラ選択・全24表情・50人図鑑・3場面演出が実際のバトルへつながる', () => {
  const mapSource = readFileSync(
    new URL('../src/screens/EnglishMap.jsx', import.meta.url),
    'utf8',
  )
  const quizSource = readFileSync(
    new URL('../src/screens/VocabQuiz.jsx', import.meta.url),
    'utf8',
  )
  const cssSource = readFileSync(
    new URL('../src/index.css', import.meta.url),
    'utf8',
  )

  assert.match(mapSource, /<BattleCastRoster/)
  assert.match(mapSource, /BATTLE_STUDENTS\.map/)
  assert.match(mapSource, /BATTLE_EMOTION_STATES\.map/)
  assert.match(mapSource, /BATTLE_RIVAL_GROUPS\.map/)
  assert.match(mapSource, /studentId: battleStudent\.id/)
  assert.match(mapSource, /rivalId: battleRival\.id/)
  assert.match(mapSource, /theme\.actorsSheet/)
  assert.match(mapSource, /theme\.scenes\.map/)

  assert.match(quizSource, /battleStudentState\(\{ battleState, eventActive \}\)/)
  assert.match(quizSource, /battleStudentPortrait\(battleStudent\.id, studentState\)/)
  assert.match(quizSource, /battleTheme\.particles\.map/)
  assert.match(quizSource, /battleTheme\.actorsSheet/)
  assert.match(quizSource, /battleTheme\.scenes\[sceneIndex\]/)
  assert.match(quizSource, /battleRival\.portrait/)

  assert.match(cssSource, /@keyframes battle-expression-in/)
  assert.match(cssSource, /@keyframes battle-particle-float/)
  assert.match(cssSource, /@keyframes battle-ability-cut-in/)
  assert.match(cssSource, /prefers-reduced-motion: reduce/)
})

test('学校アイテムをシンプルに選択し、バトルで1回使い、戦果で確認できる', () => {
  const mapSource = readFileSync(
    new URL('../src/screens/EnglishMap.jsx', import.meta.url),
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

  assert.match(mapSource, /id="school-battle-item"/)
  assert.match(mapSource, /onRelic=\{setBattleRelicLevel\}/)
  assert.match(mapSource, /1バトル1回/)
  assert.match(mapSource, /<details className="school-battle-options/)
  assert.match(mapSource, /問題数をえらぶ/)
  assert.match(mapSource, /問バトルをはじめる/)
  assert.match(quizSource, /onClick=\{useBattleItem\}/)
  assert.match(quizSource, /battleState\.itemUsed/)
  assert.match(quizSource, /encounter\.attackLine/)
  assert.match(resultSource, /battleReport\.itemSummary/)
  assert.match(resultSource, /必殺技：\{encounter\.move\}/)
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
