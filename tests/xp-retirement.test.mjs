import test from 'node:test'
import assert from 'node:assert/strict'

import { auditXpRetirement } from '../scripts/check-xp-retirement.mjs'
import { AFTER_SCHOOL_BRANCHES } from '../src/lib/afterSchoolBonds.js'
import { progressStateFromCloud } from '../src/lib/cloudSync.js'
import {
  decodeProgress,
  encodeProgress,
  summarizePayload,
} from '../src/lib/progressCode.js'
import { migratePersistedState, useStore } from '../src/store/useStore.js'

test('回答5種・全SRS分野・英作文・放課後で旧XP互換値を変更しない', () => {
  const original = useStore.getState()
  const legacyXp = 987
  const profile = AFTER_SCHOOL_BRANCHES[0]
  const choice = profile.choices[0]

  try {
    useStore.setState({
      srs: {},
      etymologySrs: {},
      kotenSrs: {},
      kotenGrammarSrs: {},
      kotenCultureSrs: {},
      kotenInterpretationSrs: {},
      writingProgress: {},
      afterSchoolBonds: {},
      battleStoryStep: 0,
      stats: { ...original.stats, xp: legacyXp },
    })

    for (const [index, result] of [
      'correct',
      'wrong',
      'unknown',
      'remembered',
      'forgot',
    ].entries()) {
      useStore.getState().review(`xp-retirement-${index}`, result, 'vocab')
      assert.equal(useStore.getState().stats.xp, legacyXp, result)
    }

    const domainReviews = [
      ['reviewEtymology', 'legacy-etymology'],
      ['reviewKoten', 'legacy-koten-word'],
      ['reviewKotenGrammar', 'legacy-koten-grammar'],
      ['reviewKotenCulture', 'legacy-koten-culture'],
      ['reviewKotenInterpretation', 'legacy-koten-reading'],
    ]
    for (const [action, id] of domainReviews) {
      useStore.getState()[action](id, 'correct')
      assert.equal(useStore.getState().stats.xp, legacyXp, action)
    }

    useStore.getState().recordWritingCompletion({
      exerciseId: 'xp-retirement-writing',
      text: 'I keep a learning record.',
      mode: 'guide',
      wordCount: 6,
      grammarIds: [],
    })
    assert.equal(useStore.getState().stats.xp, legacyXp)
    assert.equal(useStore.getState().writingProgress['xp-retirement-writing'].completed, 1)

    const reward = useStore.getState().completeAfterSchoolRoute({
      step: 0,
      branchId: profile.id,
      choiceId: choice.id,
    })
    assert.ok(reward)
    assert.equal('xpGained' in reward, false)
    assert.equal('itemXpBonus' in reward, false)
    assert.equal(useStore.getState().stats.xp, legacyXp)
    assert.equal(useStore.getState().exchangeXpForBattleStars, undefined)

    assert.equal(Object.keys(useStore.getState().srs).length, 5)
    assert.equal(Object.keys(useStore.getState().etymologySrs).length, 1)
    assert.equal(Object.keys(useStore.getState().kotenSrs).length, 1)
    assert.equal(Object.keys(useStore.getState().kotenGrammarSrs).length, 1)
    assert.equal(Object.keys(useStore.getState().kotenCultureSrs).length, 1)
    assert.equal(Object.keys(useStore.getState().kotenInterpretationSrs).length, 1)
  } finally {
    useStore.setState(original, true)
  }
})

test('旧XP値は端末・EQ1コード・クラウド間で保持し、要約には出さない', () => {
  const original = useStore.getState()
  const portable = {
    ...original,
    stats: { ...original.stats, xp: 4321, streak: 8 },
    battleXpSpent: 250,
  }
  const restored = decodeProgress(encodeProgress(portable))
  assert.equal(restored.stats.xp, 4321)
  assert.equal(restored.battleXpSpent, 250)

  const summary = summarizePayload(restored)
  assert.equal(summary.streak, 8)
  assert.equal('xp' in summary, false)
  assert.equal('battleXpSpent' in summary, false)

  const cloud = progressStateFromCloud({
    stats: { xp: 4321, streak: 8 },
    battleXpSpent: 250,
  }, original)
  assert.equal(cloud.stats.xp, 4321)
  assert.equal(cloud.battleXpSpent, 250)

  const migrated = migratePersistedState({
    stats: { xp: 4321.9 },
    battleXpSpent: -20,
  })
  assert.equal(migrated.stats.xp, 4321)
  assert.equal(migrated.battleXpSpent, 0)
})

test('XP廃止専用監査は互換専用箇所以外の利用を0件と判定する', async () => {
  const result = await auditXpRetirement()
  assert.ok(result.filesScanned > 0)
  assert.ok(result.compatibilityReferences.length > 0)
  assert.deepEqual(result.failures, [])
})
