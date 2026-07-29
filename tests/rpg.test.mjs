import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { battleProgression, battleTrend } from '../src/lib/adaptive.js'
import {
  BATTLE_QUESTS,
  BATTLE_TACTICS,
  CHAPTERS,
  MAX_HERO_LEVEL,
  MAX_LEVEL_XP,
  MOB_PROFILES,
  RELICS,
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

test('獲得した戦利品に合わせて主人公の装備外見が変わる', () => {
  assert.equal(heroEquipmentForLevel(4).weapon, null)
  assert.equal(heroEquipmentForLevel(5).weapon.name, '集中の羽根ペン')
  assert.equal(heroEquipmentForLevel(49).weapon.name, '集中の羽根ペン')
  assert.equal(heroEquipmentForLevel(50).weapon.name, '語彙騎士の剣')
  assert.equal(heroEquipmentForLevel(89).offhand.name, '星読みの地図')
  assert.equal(heroEquipmentForLevel(90).offhand.name, '守護者の盾')
  assert.equal(heroEquipmentForLevel(99).head.name, 'ことばの王冠')
})

test('取得済み戦利品から持ち込みアイテムと効果を選べる', () => {
  assert.equal(battleRelicForLevel(4, 5).name, '旅人のしおり')
  assert.equal(battleRelicForLevel(15, 1).name, '旅人のしおり')
  assert.equal(battleRelicForLevel(15, 15).name, '反復の小瓶')
  assert.equal(battleRelicForLevel(15, null).name, '反復の小瓶')

  assert.equal(relicBattleAbility(battleRelicForLevel(1, 1)).kind, 'heal')
  assert.equal(relicBattleAbility(battleRelicForLevel(5, 5)).kind, 'power')
  assert.equal(relicBattleAbility(battleRelicForLevel(15, 15)).kind, 'guard')
})

test('全21戦利品を取得LVから選べ、アクティブ効果に未対応品がない', () => {
  const kindCounts = { heal: 0, power: 0, guard: 0 }

  assert.equal(RELICS.length, 21)
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
  assert.equal(battleTactic('guard').name, '守護の型')
  assert.equal(battleTactic('unknown').id, 'combo')
  assert.deepEqual(
    [0, 1, 2, 3].map(featuredBattleTacticId),
    ['combo', 'guard', 'counter', 'combo'],
  )
})

test('戦闘イベントはミニ戦場の攻撃方向と表示へ変換できる', () => {
  assert.equal(battleSceneCue().label, 'YOUR TURN')
  assert.deepEqual(
    ['hit', 'burst', 'counter'].map((kind) => battleSceneCue(kind).target),
    ['enemy', 'enemy', 'enemy'],
  )
  assert.deepEqual(
    ['damage', 'unknown', 'block'].map((kind) => battleSceneCue(kind).target),
    ['hero', 'hero', 'hero'],
  )
  assert.equal(battleSceneCue('shield').emoji, '🛡️')
  assert.equal(battleSceneCue('not-registered').label, 'YOUR TURN')
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
  assert.match(source, /className=\{isBattle \? 'min-h-12 py-2 leading-snug'/)
  assert.match(source, /<Button full size="md" disabled=\{!answered\}/)
  assert.match(source, /<Button full size="lg" disabled=\{!answered\}/)
})

test('取得アイテムを選択し、バトルで1回使い、戦果で確認できる', () => {
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

  assert.match(mapSource, /<BattleItemPicker\b/)
  assert.match(mapSource, /onRelic=\{setBattleRelicLevel\}/)
  assert.match(mapSource, /1バトル1回/)
  assert.match(quizSource, /onClick=\{useBattleItem\}/)
  assert.match(quizSource, /battleState\.itemUsed/)
  assert.match(resultSource, /battleReport\.itemSummary/)
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
  assert.equal(state.heroHp, 80)
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
