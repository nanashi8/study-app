import assert from 'node:assert/strict'
import test from 'node:test'
import {
  DRAGON_VEIN_DAILY_DISTORTIONS,
  DRAGON_VEIN_MAIN_NODE_IDS,
  DRAGON_VEIN_NODES,
  DRAGON_VEIN_TARGET,
  createDragonVeinProgress,
  dragonVeinExpression,
  dragonVeinMainComplete,
  dragonVeinNodeStatus,
  dragonVeinSessionSource,
  dragonVeinSummary,
  isValidDragonVeinProgress,
  normalizeDragonVeinProgress,
  recordDragonVeinResult,
} from '../src/lib/dragonVein.js'
import { buildDeck, buildPhraseDeck } from '../src/lib/session.js'

test('five main vertices map 5, 4, 3, pre2, 2 and extra maps 1', () => {
  assert.deepEqual(
    DRAGON_VEIN_NODES.filter((node) => !node.extra).map((node) => node.levelId),
    ['5', '4', '3', 'pre2', '2'],
  )
  assert.equal(DRAGON_VEIN_NODES.find((node) => node.extra)?.levelId, '1')
  assert.equal(DRAGON_VEIN_MAIN_NODE_IDS.length, 5)
})

test('each main track caps at 100 correct while retaining attempts and sessions', () => {
  const source = dragonVeinSessionSource('library', 'vocab')
  const once = recordDragonVeinResult(createDragonVeinProgress(), source, {
    correct: 75,
    answered: 100,
  })
  const twice = recordDragonVeinResult(once, source, { correct: 40, answered: 50 })
  const status = dragonVeinNodeStatus(twice, 'library')
  assert.deepEqual(status.vocab, { correct: DRAGON_VEIN_TARGET, answered: 150, sessions: 2 })
  assert.equal(status.phrase.correct, 0)
  assert.equal(status.complete, false)
})

test('extra stage remains locked until vocab and phrase are complete at all five vertices', () => {
  let progress = createDragonVeinProgress()
  const extraSource = dragonVeinSessionSource('extra-archive', 'vocab')
  progress = recordDragonVeinResult(progress, extraSource, { correct: 100, answered: 100 })
  assert.equal(dragonVeinNodeStatus(progress, 'extra-archive').vocab.correct, 0)

  for (const nodeId of DRAGON_VEIN_MAIN_NODE_IDS) {
    progress = recordDragonVeinResult(progress, dragonVeinSessionSource(nodeId, 'vocab'), { correct: 100, answered: 100 })
    progress = recordDragonVeinResult(progress, dragonVeinSessionSource(nodeId, 'phrase'), { correct: 100, answered: 100 })
  }
  assert.equal(dragonVeinMainComplete(progress), true)
  assert.deepEqual(dragonVeinSummary(progress), {
    restored: 1000,
    target: 1000,
    completeNodes: 5,
    totalNodes: 5,
    extraUnlocked: true,
  })
  progress = recordDragonVeinResult(progress, extraSource, { correct: 100, answered: 100 })
  assert.equal(dragonVeinNodeStatus(progress, 'extra-archive').vocab.correct, 100)
})

test('daily repairs earn their own count without advancing a main vertex', () => {
  const source = dragonVeinSessionSource('station', 'phrase', { isDaily: true })
  const progress = recordDragonVeinResult(createDragonVeinProgress(), source, { correct: 8, answered: 10 })
  assert.deepEqual(progress.daily, { repairs: 1, correct: 8, answered: 10 })
  assert.equal(dragonVeinNodeStatus(progress, 'station').restored, 0)
})

test('daily distortions keep their own place, guide, stage, and level context', () => {
  for (const distortion of DRAGON_VEIN_DAILY_DISTORTIONS) {
    assert.equal(typeof distortion.place, 'string')
    assert.equal(typeof distortion.guideId, 'string')
    assert.equal(typeof distortion.stageId, 'string')
    assert.equal(typeof distortion.levelId, 'string')
    assert.equal(typeof distortion.summary, 'string')
  }
})

test('expression contract covers thought, worry, anguish, deep thought, and exceptional smile', () => {
  assert.equal(dragonVeinExpression({}), 'thinking')
  assert.equal(dragonVeinExpression({ answered: true, lastAnswer: 'wrong', wrongStreak: 1 }), 'worried')
  assert.equal(dragonVeinExpression({ answered: true, lastAnswer: 'wrong', wrongStreak: 2 }), 'hurt')
  assert.equal(dragonVeinExpression({ answered: true, lastAnswer: 'unknown', wrongStreak: 3 }), 'thinking')
  assert.equal(dragonVeinExpression({ answered: true, lastAnswer: 'correct', streak: 3 }), 'confident')
  assert.equal(dragonVeinExpression({ answered: true, lastAnswer: 'correct', streak: 5 }), 'delighted')
})

test('every vertex can build 100 vocabulary and 100 idiom/syntax questions', () => {
  for (const node of DRAGON_VEIN_NODES) {
    const vocab = buildDeck(dragonVeinSessionSource(node.id, 'vocab'), { size: 100 })
    const phrase = buildPhraseDeck(dragonVeinSessionSource(node.id, 'phrase'), { size: 100 })
    assert.equal(vocab.length, 100, `${node.levelLabel} vocabulary`)
    assert.equal(phrase.length, 100, `${node.levelLabel} phrases`)
  }
})

test('normalized dragon progress is progress-code valid', () => {
  const progress = normalizeDragonVeinProgress({
    nodes: { library: { vocab: { correct: 3, answered: 4, sessions: 1 } } },
    recentSessionIds: ['a', 'a', '', 3],
  })
  assert.equal(isValidDragonVeinProgress(progress), true)
  assert.deepEqual(progress.recentSessionIds, ['a'])
})
