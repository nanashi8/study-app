import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildEtymologyDeck,
  etymologyKnowledgeStatus,
  etymologyProgress,
  filterEtymologyPacks,
  isEtymologyDue,
} from '../src/lib/etymologyProgress.js'
import { createLearningAnalytics } from '../src/lib/learningAnalytics.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import { useStore } from '../src/store/useStore.js'

const packs = [
  { id: 'formula:one', mode: 'formula' },
  { id: 'root:one', mode: 'root' },
  { id: 'family:one', mode: 'family' },
  { id: 'origin:one', mode: 'origin' },
]

const entry = (box, due) => ({
  box,
  correct: box,
  wrong: 0,
  due,
  last: due - 1,
})

test('語源知識を未着手・学習中・習得・復習待ちへ分類する', () => {
  const day = 100
  const srs = {
    'root:one': entry(2, 101),
    'family:one': entry(4, 100),
    'origin:one': entry(0, 99),
  }
  const progress = etymologyProgress(packs, srs, day)

  assert.deepEqual(
    {
      total: progress.total,
      started: progress.started,
      unstarted: progress.unstarted,
      learning: progress.learning,
      mastered: progress.mastered,
      due: progress.due,
      points: progress.points,
    },
    {
      total: 4,
      started: 3,
      unstarted: 1,
      learning: 2,
      mastered: 1,
      due: 2,
      points: 6,
    },
  )
  assert.equal(progress.ratio, 6 / 16)
  assert.equal(etymologyKnowledgeStatus(), 'unstarted')
  assert.equal(etymologyKnowledgeStatus(srs['root:one']), 'learning')
  assert.equal(etymologyKnowledgeStatus(srs['family:one']), 'mastered')
  assert.equal(isEtymologyDue(srs['origin:one'], day), true)
  assert.deepEqual(
    filterEtymologyPacks(packs, srs, { status: 'due', day }).map((pack) => pack.id),
    ['family:one', 'origin:one'],
  )
})

test('語源カードは復習待ち→未着手→学習中の順で出す', () => {
  const day = 100
  const srs = {
    'root:one': entry(2, 101),
    'family:one': entry(4, 100),
    'origin:one': entry(0, 99),
  }
  const deck = buildEtymologyDeck(packs, srs, {
    status: 'priority',
    day,
    size: 4,
  })
  assert.deepEqual(
    deck.map((pack) => pack.id),
    ['origin:one', 'family:one', 'formula:one', 'root:one'],
  )
  assert.deepEqual(
    buildEtymologyDeck(packs, srs, {
      mode: 'formula',
      status: 'unstarted',
      day,
    }).map((pack) => pack.id),
    ['formula:one'],
  )
})

test('語源レビューは単語SRSと分離し、進捗コードでも持ち運べる', () => {
  const previous = useStore.getState()
  useStore.setState({
    srs: { word: entry(3, 200) },
    etymologySrs: {},
    stats: {
      xp: 0,
      streak: 0,
      day: null,
      todayCount: 0,
      answered: 0,
      correct: 0,
    },
    learningAnalytics: createLearningAnalytics(),
  })

  try {
    useStore.getState().reviewEtymology('formula:one', 'remembered')
    const state = useStore.getState()

    assert.equal(state.srs.word.box, 3)
    assert.equal(state.etymologySrs['formula:one'].box, 1)
    assert.equal(state.learningAnalytics.skills.etymology.scored, 1)
    assert.equal(state.learningAnalytics.skills.etymology.correct, 1)

    const decoded = decodeProgress(encodeProgress(state))
    assert.deepEqual(decoded.etymologySrs, state.etymologySrs)
    assert.throws(
      () => decodeProgress(encodeProgress({ ...state, etymologySrs: [] })),
      /etymologySrs/,
    )
  } finally {
    useStore.setState({
      srs: previous.srs,
      etymologySrs: previous.etymologySrs,
      stats: previous.stats,
      learningAnalytics: previous.learningAnalytics,
    })
  }
})
