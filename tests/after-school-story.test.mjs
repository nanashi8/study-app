import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'

import { BATTLE_DAILY_SCENES, BATTLE_STUDENTS } from '../src/lib/battleCast.js'
import {
  AFTER_SCHOOL_INTERLUDE_CHANCE,
  AFTER_SCHOOL_CHRONICLE,
  MAX_BATTLE_STORY_STEP,
  afterSchoolBattleChapter,
  afterSchoolBattleEpilogue,
  afterSchoolDailyChapter,
  afterSchoolEpisodeNumber,
  afterSchoolPrologue,
  afterSchoolSceneForStep,
  normalizeBattleStoryLastDay,
  normalizeBattleStoryStep,
  shouldContinueToAfterSchoolInterlude,
} from '../src/lib/afterSchoolStory.js'
import {
  AFTER_SCHOOL_BRANCHES,
  afterSchoolBattleSkill,
  afterSchoolBondState,
  afterSchoolBranchOptions,
  afterSchoolBranchScene,
  isValidAfterSchoolBonds,
  resolveAfterSchoolReward,
} from '../src/lib/afterSchoolBonds.js'
import { resolveBattleState } from '../src/lib/rpg.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import { useStore } from '../src/store/useStore.js'

test('放課後と魔法の言葉は先生課題から友達との日常へつながる', () => {
  assert.equal(AFTER_SCHOOL_CHRONICLE.title, '放課後と魔法の言葉')
  assert.equal(AFTER_SCHOOL_CHRONICLE.shortTitle, '放課後と魔法の言葉')
  assert.equal(AFTER_SCHOOL_CHRONICLE.keyVisual.endsWith('.webp'), true)
  assert.match(AFTER_SCHOOL_CHRONICLE.subtitle, /対決後は友達との日常/)
})

test('導入・対決直前・結果後・日常をライトノベルのページとして構成する', () => {
  const prologue = afterSchoolPrologue({ studentName: '音羽ミオ' })
  const battle = afterSchoolBattleChapter({
    storyStep: 4,
    studentName: '音羽ミオ',
    rivalName: '神田エイジ',
    encounterName: '英語準備室',
    move: 'アクセントブレイク',
    subject: '英語',
    affinityLabel: '得意',
    questSize: 10,
  })
  const victory = afterSchoolBattleEpilogue({
    storyStep: 4,
    studentName: '音羽ミオ',
    rivalName: '神田エイジ',
    verdictId: 'victory',
  })
  const retreat = afterSchoolBattleEpilogue({
    storyStep: 4,
    studentName: '音羽ミオ',
    rivalName: '神田エイジ',
    verdictId: 'retreat',
  })
  const daily = afterSchoolDailyChapter({
    storyStep: 4,
    studentName: '音羽ミオ',
    routeLabel: '商店街へ',
    location: '帰り道',
    situation: '対決を終え、商店街の灯りの下で足を止めた。',
    opening: '「少し話していかない？」',
  })
  const allText = [prologue, battle, victory, retreat, daily]
    .flatMap((story) => story.pages.map((page) => page.text))
    .join('\n')

  assert.equal(prologue.pages.length, 4)
  assert.equal(battle.pages.length, 4)
  assert.equal(victory.pages.length, 4)
  assert.equal(daily.pages.length, 3)
  assert.match(prologue.title, /チャイムのあと/)
  assert.match(allText, /先生を倒すんじゃない/)
  assert.match(allText, /影だけをほどく/)
  assert.match(allText, /現実の校舎には傷ひとつない/)
  assert.match(victory.pages[0].text, /まなざしにいつもの穏やかさ/)
  assert.match(retreat.pages[0].text, /術式はまだ/)
  assert.match(daily.chapterLabel, /DAILY STORY/)
  assert.doesNotMatch(allText, /放課後の一日|七不思議/)
})

test('旧ランダム分岐ヘルパーは保存互換のためだけに残す', () => {
  assert.equal(AFTER_SCHOOL_INTERLUDE_CHANCE, 1 / 3)
  assert.equal(shouldContinueToAfterSchoolInterlude({
    storyStep: 0,
    currentDay: 100,
    roll: 0.99,
  }), true)
  assert.equal(shouldContinueToAfterSchoolInterlude({
    storyStep: 1,
    lastDay: 99,
    currentDay: 100,
    roll: AFTER_SCHOOL_INTERLUDE_CHANCE - 0.01,
  }), true)
  assert.equal(shouldContinueToAfterSchoolInterlude({
    storyStep: 1,
    lastDay: 99,
    currentDay: 100,
    roll: AFTER_SCHOOL_INTERLUDE_CHANCE,
  }), false)
  assert.equal(shouldContinueToAfterSchoolInterlude({
    storyStep: 1,
    lastDay: 100,
    currentDay: 100,
    roll: 0,
  }), false)
  assert.equal(normalizeBattleStoryLastDay(-1), null)
})

test('ゲーム入口の主要アイコンはOS絵文字に依存せず、絵文字フォントも明示する', async () => {
  const [map, css] = await Promise.all([
    readFile(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
  ])
  const chronicleScreen = map.slice(
    map.indexOf('export function AfterSchoolChronicleScreen'),
    map.indexOf('function ChroniclePortalCard'),
  )

  assert.match(map, /function ChronicleIcon/)
  assert.match(map, /data-chronicle-icon=\{kind\}/)
  assert.match(chronicleScreen, /className="after-school-game-icons pb-8"/)
  assert.match(map, /<ChronicleIcon kind="chapter"/)
  assert.match(css, /\.chronicle-vector-icon/)
  assert.match(css, /font-variant-emoji:\s*emoji/)
  assert.match(css, /"Apple Color Emoji"/)
  assert.match(css, /"Segoe UI Emoji"/)
  assert.match(css, /"Noto Color Emoji"/)
})

test('10人全員に固有の放課後分岐・共感エピソード・監査済み舞台画像がある', async () => {
  assert.equal(AFTER_SCHOOL_BRANCHES.length, BATTLE_STUDENTS.length)
  assert.deepEqual(
    new Set(AFTER_SCHOOL_BRANCHES.map((profile) => profile.studentId)),
    new Set(BATTLE_STUDENTS.map((student) => student.id)),
  )
  assert.equal(new Set(AFTER_SCHOOL_BRANCHES.map((profile) => profile.id)).size, 10)

  for (const profile of AFTER_SCHOOL_BRANCHES) {
    const scene = afterSchoolBranchScene(profile)
    assert.equal(BATTLE_DAILY_SCENES.some((item) => item.id === scene.id), true, profile.id)
    assert.match(profile.time, /^16:/, profile.id)
    assert.ok(profile.situation.length >= 25, profile.id)
    assert.ok(profile.opening.length >= 15, profile.id)
    assert.equal(profile.choices.length, 3, profile.id)
    assert.deepEqual(
      new Set(profile.choices.map((choice) => choice.styleId)),
      new Set(['empathy', 'idea', 'together']),
      profile.id,
    )
    for (const choice of profile.choices) {
      assert.ok(choice.reply.length >= 15, `${profile.id}/${choice.id}`)
    }
    const assetPath = scene.image.replace(/^\/(?:study-app\/)?/, '')
    await access(new URL(`../public/${assetPath}`, import.meta.url))
  }
})

test('任意のルート一覧は3候補を提示し、同行者を先頭にしながら候補を循環する', () => {
  const seenAlternatives = new Set()
  for (let step = 0; step < 10; step += 1) {
    const options = afterSchoolBranchOptions({ step, currentStudentId: 'kaito' })
    assert.equal(options.length, 3)
    assert.equal(options[0].studentId, 'kaito')
    assert.equal(new Set(options.map((option) => option.id)).size, 3)
    options.slice(1).forEach((option) => seenAlternatives.add(option.studentId))
  }
  assert.equal(seenAlternatives.size, 9)
})

test('声掛けは全て報酬を得て、性格一致・絆LV・思い出アイテムで伸びる', () => {
  const profile = AFTER_SCHOOL_BRANCHES.find((item) => item.studentId === 'mio')
  const preferred = profile.choices.find((choice) => choice.styleId === profile.preferredStyleId)
  const other = profile.choices.find((choice) => choice.styleId !== profile.preferredStyleId)
  const matched = resolveAfterSchoolReward({ bonds: {}, branchId: profile.id, choiceId: preferred.id })
  const unmatched = resolveAfterSchoolReward({ bonds: {}, branchId: profile.id, choiceId: other.id })

  assert.equal(matched.bondPointsGained, 2)
  assert.equal(unmatched.bondPointsGained, 1)
  assert.ok(matched.xpGained > unmatched.xpGained)

  const skillUnlock = resolveAfterSchoolReward({
    bonds: { mio: { points: 2, visits: 1 } },
    branchId: profile.id,
    choiceId: preferred.id,
  })
  assert.equal(skillUnlock.unlockedSkill.id, profile.skill.id)
  assert.equal(afterSchoolBattleSkill('mio', { mio: skillUnlock.nextBondEntry }).id, profile.skill.id)

  const itemUnlock = resolveAfterSchoolReward({
    bonds: { mio: { points: 7, visits: 3 } },
    branchId: profile.id,
    choiceId: other.id,
  })
  assert.equal(itemUnlock.unlockedItem.id, profile.item.id)
  const withItem = resolveAfterSchoolReward({
    bonds: { mio: itemUnlock.nextBondEntry },
    branchId: profile.id,
    choiceId: other.id,
  })
  assert.equal(withItem.itemXpBonus, profile.item.xpBonus)
  assert.equal(withItem.xpGained, 6 + 3 * 2 + profile.item.xpBonus)
  assert.ok(withItem.xpGained > itemUnlock.xpGained)
})

test('関係特技は実HP・実ダメージだけに作用し、正答数と決着条件を変えない', () => {
  const powerSkill = AFTER_SCHOOL_BRANCHES.find((item) => item.studentId === 'ren').skill
  const healSkill = AFTER_SCHOOL_BRANCHES.find((item) => item.studentId === 'mio').skill
  const guardSkill = AFTER_SCHOOL_BRANCHES.find((item) => item.studentId === 'haru').skill
  const answers = ['wrong', 'correct', 'correct', 'correct', 'correct']
  const normal = resolveBattleState({ answers, total: 5, tacticId: 'combo' })
  const powered = resolveBattleState({ answers, total: 5, tacticId: 'combo', bondSkill: powerSkill })
  const healed = resolveBattleState({ answers, total: 5, tacticId: 'combo', bondSkill: healSkill })
  const guarded = resolveBattleState({ answers: ['wrong'], total: 5, tacticId: 'combo', bondSkill: guardSkill })
  const unguarded = resolveBattleState({ answers: ['wrong'], total: 5, tacticId: 'combo' })

  assert.equal(powered.correct, normal.correct)
  assert.equal(powered.misses, normal.misses)
  assert.equal(powered.enemyHp, normal.enemyHp)
  assert.ok(powered.bondBonusDamage > 0)
  assert.ok(powered.damageDealt > normal.damageDealt)
  assert.ok(healed.bondHealing > 0)
  assert.ok(guarded.damageTaken < unguarded.damageTaken)

  const lost = resolveBattleState({
    answers: Array(5).fill('wrong'),
    total: 5,
    tacticId: 'combo',
    bondSkill: guardSkill,
  })
  assert.equal(lost.heroDefeated, true)
  assert.equal(lost.heroCurrentHp, 0)
})

test('放課後の関係と日常進行は進捗コードで往復し、不正値を拒否する', () => {
  const afterSchoolBonds = { mio: { points: 9, visits: 4 }, kaito: { points: 3, visits: 2 } }
  const restored = decodeProgress(encodeProgress({
    battleStoryStep: 17,
    battleStoryLastDay: 20_000,
    afterSchoolBonds,
  }))
  assert.equal(restored.battleStoryStep, 17)
  assert.equal(restored.battleStoryLastDay, 20_000)
  assert.deepEqual(restored.afterSchoolBonds, afterSchoolBonds)
  assert.equal(isValidAfterSchoolBonds(restored.afterSchoolBonds), true)
  assert.equal(isValidAfterSchoolBonds({ mio: { points: -1, visits: 0 } }), false)
  assert.throws(
    () => decodeProgress(encodeProgress({ battleStoryStep: -1 })),
    /battleStoryStep/,
  )
  assert.throws(
    () => decodeProgress(encodeProgress({ battleStoryLastDay: -1 })),
    /battleStoryLastDay/,
  )
})

test('放課後報酬は一度だけ原子的に確定し、正答・SRS・分析値へ混ぜない', () => {
  const original = useStore.getState()
  const profile = AFTER_SCHOOL_BRANCHES.find((item) => item.studentId === 'mio')
  const preferred = profile.choices.find((choice) => choice.styleId === profile.preferredStyleId)
  const srs = { sample: { box: 2, correct: 3, wrong: 1, due: 10, last: 9 } }
  try {
    useStore.setState({
      battleStoryStep: 40,
      afterSchoolBonds: { mio: { points: 2, visits: 1 } },
      srs,
      stats: { ...original.stats, xp: 100, answered: 12, correct: 9 },
    })
    const reward = useStore.getState().completeAfterSchoolRoute({
      step: 40,
      branchId: profile.id,
      choiceId: preferred.id,
    })
    const after = useStore.getState()
    assert.equal(reward.unlockedSkill.id, profile.skill.id)
    assert.equal(after.battleStoryStep, 41)
    assert.equal(after.stats.xp, 100 + reward.xpGained)
    assert.equal(after.stats.answered, 12)
    assert.equal(after.stats.correct, 9)
    assert.strictEqual(after.srs, srs)
    assert.deepEqual(after.afterSchoolBonds.mio, reward.nextBondEntry)
    assert.equal(useStore.getState().completeAfterSchoolRoute({
      step: 40,
      branchId: profile.id,
      choiceId: preferred.id,
    }), null)
    assert.equal(useStore.getState().stats.xp, 100 + reward.xpGained)
  } finally {
    useStore.setState(original, true)
  }
})

test('対決結果は毎回ライトノベルを経て友達との日常へ進み、特技・関係・報酬を全保存経路へ通す', async () => {
  const [app, result, interlude, map, novel, quiz, store, cloud] = await Promise.all([
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/SessionResult.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/AfterSchoolInterlude.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/LightNovelScene.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/VocabQuiz.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/store/useStore.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/lib/cloudSync.js', import.meta.url), 'utf8'),
  ])

  assert.match(app, /afterSchoolChronicle: AfterSchoolChronicleScreen/)
  assert.match(app, /afterSchoolInterlude: AfterSchoolInterludeScreen/)
  assert.match(result, /友達と過ごす日常へ/)
  assert.match(result, /onClick=\{continueAfterBattle\}/)
  assert.match(result, /navigate\('afterSchoolInterlude'/)
  assert.doesNotMatch(result, /shouldContinueToAfterSchoolInterlude/)
  assert.doesNotMatch(result, /continueToInterlude/)
  assert.match(result, /battleReport\.bondSummary/)
  assert.match(interlude, /title="友達と過ごす日常"/)
  assert.match(interlude, /afterSchoolBattleEpilogue/)
  assert.match(interlude, /afterSchoolDailyChapter/)
  assert.match(interlude, /<LightNovelScene/)
  assert.match(interlude, /afterSchoolBranchOptions/)
  assert.match(interlude, /useState\(null\)/)
  assert.match(interlude, /profile\.choices\.map/)
  assert.match(interlude, /どの声掛けでも絆とXPを得られ/)
  assert.match(interlude, /completeAfterSchoolRoute/)
  assert.match(interlude, /navigate\('characterTalk'/)
  assert.match(map, /function AfterSchoolBondBoard/)
  assert.match(map, /bondSkillId:\s*battleBondSkill/)
  assert.doesNotMatch(map, /interludeRoll:\s*Math\.random\(\)/)
  assert.match(map, /afterSchoolPrologue/)
  assert.match(map, /afterSchoolBattleChapter/)
  assert.match(map, /onBattle=\{setPendingQuest\}/)
  assert.match(map, /対決後は友達と過ごす3つの日常へ/)
  assert.match(novel, /data-light-novel-scene/)
  assert.match(novel, /次のページ/)
  assert.match(novel, /前のページ/)
  assert.match(quiz, /afterSchoolSkillById/)
  assert.match(quiz, /bondSkill:\s*battleBondSkill/)
  assert.match(store, /completeAfterSchoolRoute/)
  assert.match(store.slice(store.indexOf('partialize:')), /battleStoryLastDay:\s*st\.battleStoryLastDay/)
  assert.match(store.slice(store.indexOf('partialize:')), /afterSchoolBonds:\s*st\.afterSchoolBonds/)
  assert.match(cloud, /battleStoryLastDay:\s*normalizeBattleStoryLastDay/)
  assert.match(cloud, /afterSchoolBonds:\s*normalizeAfterSchoolBonds/)
})

test('現在の放課後場面は保存済み進行順に循環し、校内へ戻る履歴も安全に畳む', () => {
  assert.deepEqual(
    BATTLE_DAILY_SCENES.map((scene, step) => afterSchoolSceneForStep(step).id),
    BATTLE_DAILY_SCENES.map((scene) => scene.id),
  )
  assert.equal(afterSchoolSceneForStep(BATTLE_DAILY_SCENES.length).id, BATTLE_DAILY_SCENES[0].id)
  assert.equal(afterSchoolEpisodeNumber(0), 1)
  assert.equal(normalizeBattleStoryStep(-1), 0)
  assert.equal(normalizeBattleStoryStep(MAX_BATTLE_STORY_STEP + 1), MAX_BATTLE_STORY_STEP)

  const original = useStore.getState()
  try {
    useStore.setState({
      screen: 'afterSchoolInterlude',
      params: { fromBattle: true },
      stack: [
        { screen: 'portal', params: {} },
        { screen: 'home', params: {} },
        { screen: 'afterSchoolChronicle', params: {} },
        { screen: 'vocabQuiz', params: {} },
        { screen: 'sessionResult', params: {} },
      ],
    })
    useStore.getState().returnToAfterSchoolChronicle()
    assert.equal(useStore.getState().screen, 'afterSchoolChronicle')
    assert.deepEqual(useStore.getState().stack, [
      { screen: 'portal', params: {} },
      { screen: 'home', params: {} },
    ])
    useStore.getState().back()
    assert.equal(useStore.getState().screen, 'home')
  } finally {
    useStore.setState(original, true)
  }
})

test('絆メーターは次LVまでの進捗と特技・アイテム解放を返す', () => {
  const state = afterSchoolBondState({ kaito: { points: 8, visits: 5 } }, 'kaito')
  assert.equal(state.level.level, 3)
  assert.equal(state.skillUnlocked, true)
  assert.equal(state.itemUnlocked, true)
  assert.equal(state.pointsToNext, 7)
  assert.equal(state.visits, 5)
})
