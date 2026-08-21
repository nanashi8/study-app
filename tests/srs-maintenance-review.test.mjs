import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ALL_WORDS } from '../src/data/vocab.js'
import { buildVocabCompletionReport } from '../src/lib/learningAnalyticsReport.js'
import { progressStateFromCloud } from '../src/lib/cloudSync.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import {
  LONG_TERM_SRS_BOX,
  MAINTENANCE_SRS_BOX,
  MAX_SRS_BOX,
  SRS_INTERVAL_DAYS,
  srsStageLabel,
} from '../src/lib/srs.js'
import { todayIndex, useStore } from '../src/store/useStore.js'

const DAY_MS = 86400000

test('長期定着後は30→60→90→180日の維持復習へ進み、完全には出題を止めない', () => {
  assert.deepEqual(SRS_INTERVAL_DAYS, [0, 1, 2, 4, 7, 15, 30, 60, 90, 180])
  assert.equal(LONG_TERM_SRS_BOX, 4)
  assert.equal(MAINTENANCE_SRS_BOX, 7)
  assert.equal(MAX_SRS_BOX, 9)
  assert.equal(srsStageLabel(6), '長期定着')
  assert.equal(srsStageLabel(7), '維持復習')

  const original = useStore.getState()
  const originalNow = Date.now
  const timestamp = new Date(2026, 7, 21, 12, 0, 0, 0).getTime()
  const day = todayIndex(timestamp)
  const word = ALL_WORDS[0]

  try {
    Date.now = () => timestamp
    useStore.setState({
      srs: {
        [word.id]: {
          box: 6,
          correct: 12,
          wrong: 0,
          due: day,
          last: day - 30,
          lastAt: timestamp - 30 * DAY_MS,
        },
      },
    })

    for (const [expectedBox, expectedDays] of [[7, 60], [8, 90], [9, 180], [9, 180]]) {
      useStore.getState().review(word.id, 'correct', 'vocab')
      const entry = useStore.getState().srs[word.id]
      assert.equal(entry.box, expectedBox)
      assert.equal(entry.due, day + expectedDays)
    }

    useStore.getState().review(word.id, 'wrong', 'vocab')
    assert.equal(useStore.getState().srs[word.id].box, 8)
    assert.equal(useStore.getState().srs[word.id].due, day + 90)

    useStore.setState({
      srs: {
        [word.id]: { ...useStore.getState().srs[word.id], box: 9, due: day + 180 },
      },
    })
    useStore.getState().review(word.id, 'forgot', 'vocab')
    assert.equal(useStore.getState().srs[word.id].box, 0)
    assert.equal(useStore.getState().srs[word.id].due, day)
  } finally {
    Date.now = originalNow
    useStore.setState(original, true)
  }
})

test('共通SRSを使う全10保存領域が維持復習の60日段階へ進む', () => {
  const original = useStore.getState()
  const originalNow = Date.now
  const timestamp = new Date(2026, 7, 21, 12, 0, 0, 0).getTime()
  const day = todayIndex(timestamp)
  const id = 'maintenance-audit-item'
  const fields = [
    'srs',
    'etymologySrs',
    'kotenSrs',
    'kotenGrammarSrs',
    'kotenCultureSrs',
    'kotenInterpretationSrs',
    'kanbunVocabSrs',
    'kanbunGrammarSrs',
    'kanbunCultureSrs',
    'kanbunKundokuSrs',
  ]
  const seeded = Object.fromEntries(fields.map((field) => [field, {
    [id]: { box: 6, correct: 8, wrong: 0, due: day, lastAt: timestamp - 30 * DAY_MS },
  }]))

  try {
    Date.now = () => timestamp
    useStore.setState(seeded)
    const actions = [
      () => useStore.getState().review(id, 'correct', 'vocab'),
      () => useStore.getState().reviewEtymology(id, 'correct'),
      () => useStore.getState().reviewKoten(id, 'correct'),
      () => useStore.getState().reviewKotenGrammar(id, 'correct'),
      () => useStore.getState().reviewKotenCulture(id, 'correct'),
      () => useStore.getState().reviewKotenInterpretation(id, 'correct'),
      () => useStore.getState().reviewKanbun('vocab', id, 'correct'),
      () => useStore.getState().reviewKanbun('grammar', id, 'correct'),
      () => useStore.getState().reviewKanbun('culture', id, 'correct'),
      () => useStore.getState().reviewKanbunKundoku(id, 'correct'),
    ]
    actions.forEach((action) => action())

    for (const field of fields) {
      assert.equal(useStore.getState()[field][id].box, MAINTENANCE_SRS_BOX, field)
      assert.equal(useStore.getState()[field][id].due, day + 60, field)
    }
  } finally {
    Date.now = originalNow
    useStore.setState(original, true)
  }
})

test('維持復習の段階・期限は端末コードとクラウド復元を往復する', () => {
  const original = useStore.getState()
  const word = ALL_WORDS[0]
  const day = todayIndex()
  try {
    useStore.setState({
      srs: {
        [word.id]: { box: 9, correct: 20, wrong: 1, due: day + 180, last: day },
      },
    })
    const decoded = decodeProgress(encodeProgress(useStore.getState()))
    assert.equal(decoded.srs[word.id].box, 9)
    assert.equal(decoded.srs[word.id].due, day + 180)

    const cloud = progressStateFromCloud({ srs: decoded.srs }, original)
    assert.equal(cloud.srs[word.id].box, 9)
    assert.equal(cloud.srs[word.id].due, day + 180)
  } finally {
    useStore.setState(original, true)
  }
})

test('維持復習へ進むほど30日後の定着予測は水平に近づき、表示も新上限を使う', () => {
  const word = ALL_WORDS[0]
  const now = new Date(2026, 7, 21, 12, 0, 0, 0).getTime()
  const row = (box) => ({
    box,
    correct: 12,
    wrong: 1,
    due: todayIndex(now) + SRS_INTERVAL_DAYS[box],
    lastAt: now,
    memory: { passes: 8, remembered: 8, forgot: 0, lastJudgment: 'remembered' },
    test: { attempts: 5, correct: 5, wrong: 0, unknown: 0, lastResult: 'correct' },
  })
  const retentionAt30 = (box) => buildVocabCompletionReport({
    srs: { [word.id]: row(box) },
    wordIds: [word.id],
    now,
  }).curve.find((point) => point.day === 30).retention

  assert.ok(retentionAt30(9) > retentionAt30(6))
  const analyticsUi = readFileSync(new URL('../src/components/LearningAnalytics.jsx', import.meta.url), 'utf8')
  const completionUi = readFileSync(new URL('../src/components/VocabCompletionReport.jsx', import.meta.url), 'utf8')
  assert.match(analyticsUi, /\{MAX_SRS_BOX\}/)
  assert.match(completionUi, /data-maintenance-review-policy/)
  assert.match(completionUi, /30→60→90→180日/)
})
