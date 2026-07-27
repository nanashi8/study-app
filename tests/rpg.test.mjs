import test from 'node:test'
import assert from 'node:assert/strict'

import { battleTrend } from '../src/lib/adaptive.js'
import {
  BATTLE_QUESTS,
  BATTLE_TACTICS,
  MAX_HERO_LEVEL,
  MAX_LEVEL_XP,
  battleQuest,
  battleTactic,
  battleVerdict,
  capEnemyPositionForHeroLevel,
  chapterForLevel,
  encounterFor,
  featuredBattleTacticId,
  featuredQuestId,
  heroProgress,
  maxEnemyRankIndexForHeroLevel,
  nextEnemyRankUnlockForHeroLevel,
  resolveBattleState,
  xpAtLevel,
  xpNeededForNextLevel,
} from '../src/lib/rpg.js'

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

test('章ボスは各章の最終LVに固定される', () => {
  for (let level = 1; level <= MAX_HERO_LEVEL; level += 1) {
    const chapter = chapterForLevel(level)
    const encounter = encounterFor({ level, day: 100, enemyRankIndex: 2 })
    assert.equal(encounter.isBoss, level === chapter.maxLevel, `LV${level}`)
  }
})

test('日替わりエンカウントは同じ条件なら再現できる', () => {
  const args = { level: 34, day: 20661, enemyRankIndex: 3 }
  assert.deepEqual(encounterFor(args), encounterFor(args))
  assert.notEqual(
    encounterFor(args).id,
    encounterFor({ ...args, day: args.day + 1 }).id,
  )
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
  assert.equal(battleTactic('guard').name, '守護の型')
  assert.equal(battleTactic('unknown').id, 'combo')
  assert.deepEqual(
    [0, 1, 2, 3].map(featuredBattleTacticId),
    ['combo', 'guard', 'counter', 'combo'],
  )
})

test('連撃の型は3連続正解ごとに奥義を発動する', () => {
  const state = resolveBattleState({
    answers: ['correct', 'correct', 'correct', 'wrong', 'correct'],
    total: 5,
    tacticId: 'combo',
  })
  assert.equal(state.comboBursts, 1)
  assert.equal(state.activations, 1)
  assert.equal(state.maxStreak, 3)
  assert.equal(state.heroHp, 67)
  assert.match(state.summary, /奥義 1回/)
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
  assert.equal(state.heroHp, 67)
})

test('逆転の型はミス直後の正解でカウンターしHPを回復する', () => {
  const state = resolveBattleState({
    answers: ['wrong', 'correct', 'unknown', 'wrong', 'correct'],
    total: 5,
    tacticId: 'counter',
  })
  assert.equal(state.counters, 2)
  assert.equal(state.activations, 2)
  assert.equal(state.heroHp, 67)
  assert.match(state.summary, /HP回復 2回/)
})

test('作戦を変えても同じ正誤なら敵HPと学習評価は変わらない', () => {
  const answers = ['correct', 'correct', 'wrong', 'correct', 'unknown']
  const states = BATTLE_TACTICS.map((tactic) =>
    resolveBattleState({ answers, total: 5, tacticId: tactic.id }),
  )
  assert.deepEqual(states.map((state) => state.correct), [3, 3, 3])
  assert.deepEqual(states.map((state) => state.misses), [2, 2, 2])
  assert.deepEqual(states.map((state) => state.enemyHp), [25, 25, 25])
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
