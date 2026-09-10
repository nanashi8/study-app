import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { wordsByLevel } from '../src/data/vocab.js'
import { automaticVocabSessionPlan, buildDeck } from '../src/lib/session.js'
import {
  VOCAB_MIX_DEFAULT,
  VOCAB_MIX_STEPS,
  describeVocabMix,
  normalizeVocabMix,
  vocabMixAtIndex,
  vocabMixFreshShare,
  vocabMixIndex,
} from '../src/lib/vocabMix.js'
import { normalizeSettings, todayIndex } from '../src/store/useStore.js'

const read = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8')

test('出題バランスの目盛りは自動を既定にし、割合を6段で示す', () => {
  assert.equal(VOCAB_MIX_DEFAULT, 'auto')
  assert.deepEqual(VOCAB_MIX_STEPS.map((step) => step.id), [
    'auto',
    'review-only',
    'review-heavy',
    'even',
    'fresh-heavy',
    'fresh-only',
  ])
  assert.equal(vocabMixFreshShare('auto'), null)
  assert.equal(vocabMixFreshShare('review-only'), 0)
  assert.equal(vocabMixFreshShare('fresh-only'), 1)
  assert.equal(vocabMixIndex('even'), 3)
  assert.equal(vocabMixAtIndex('3'), 'even')
  assert.equal(describeVocabMix('even'), '10問なら 復習5問 : 未修5問')
  // 知らない保存値・古い保存値は自動へ戻す（配分を勝手に固定しない）。
  assert.equal(normalizeVocabMix('unknown'), 'auto')
  assert.equal(normalizeSettings({ vocabMix: 'nope' }).vocabMix, 'auto')
  assert.equal(normalizeSettings({}).vocabMix, 'auto')
  assert.equal(normalizeSettings({ vocabMix: 'review-only' }).vocabMix, 'review-only')
})

test('バーで指定した割合は、自動プロファイルより優先して出題を組む', () => {
  const now = new Date(2026, 7, 24, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const words = wordsByLevel('4')
  const dueWords = words.slice(0, 8)
  const dueIds = new Set(dueWords.map((word) => word.id))
  const srs = Object.fromEntries(dueWords.map((word) => [word.id, {
    box: 1,
    due: day,
    last: day - 2,
    lastAt: now - 2 * 86_400_000,
  }]))

  // 同じ在庫でも、自動なら balanced（新しい語4問）になる場面。
  assert.equal(
    automaticVocabSessionPlan(words, { srs, size: 10, purpose: 'study', day }).profile,
    'balanced',
  )

  const cases = [
    { mix: 'review-only', reviewCount: 8, varietyCount: 2 },
    { mix: 'review-heavy', reviewCount: 8, varietyCount: 2 },
    { mix: 'even', reviewCount: 5, varietyCount: 5 },
    { mix: 'fresh-only', reviewCount: 0, varietyCount: 10 },
  ]

  for (const expected of cases) {
    const freshShareOverride = vocabMixFreshShare(expected.mix)
    const plan = automaticVocabSessionPlan(words, {
      srs, size: 10, purpose: 'study', day, freshShareOverride,
    })
    const deck = buildDeck(
      { type: 'level', levelId: '4' },
      { srs, size: 10, purpose: 'study', now, day, freshShareOverride },
    )
    assert.equal(plan.profile, 'manual', expected.mix)
    assert.equal(plan.freshShare, freshShareOverride, expected.mix)
    assert.equal(deck.filter((word) => dueIds.has(word.id)).length, expected.reviewCount, expected.mix)
    assert.equal(deck.filter((word) => !dueIds.has(word.id)).length, expected.varietyCount, expected.mix)
  }
})

test('画面下部の同じ枠で、読み上げと出題バランスを切り替える', () => {
  const dock = read('../src/components/SpeechConsole.jsx')
  const mix = read('../src/components/VocabMixConsole.jsx')
  const study = read('../src/screens/VocabStudy.jsx')
  const quiz = read('../src/screens/VocabQuiz.jsx')

  assert.match(dock, /data-study-dock-tabs/)
  assert.match(dock, /読み上げ/)
  assert.match(dock, /出題バランス/)
  assert.match(dock, /vocabMixApplies\(screen, params\)/)
  // 読み上げも出題バランスも無い画面では、これまでどおり何も出さない。
  assert.match(dock, /if \(!state\.visible && !mixAvailable\) return null/)
  assert.match(mix, /data-vocab-mix-range/)
  assert.match(mix, /setSetting\('vocabMix'/)
  assert.match(mix, /次に組む出題から反映します/)
  // 出す語が決まっている画面（マイ単語・復習など）ではバーを出さない。
  assert.match(mix, /isAutomaticVocabularySource/)
  for (const source of [study, quiz]) {
    assert.match(source, /freshShareOverride: vocabMixFreshShare\(useStore\.getState\(\)\.settings\.vocabMix\)/)
  }
})

test('マイ単語帳は既存の問題集を保存先にし、単語側から作って選べる', () => {
  const sheet = read('../src/components/WordListSheet.jsx')
  const study = read('../src/screens/VocabStudy.jsx')
  const detail = read('../src/screens/WordDetail.jsx')

  assert.match(sheet, /createNotebookSet/)
  assert.match(sheet, /setNotebookSetItem\(set\.id, DOMAIN, wordId, !included\)/)
  assert.match(sheet, /data-word-list-new-title/)
  assert.match(sheet, /マイ学習ノートの問題集と同じもの/)
  // 新しい保存領域は作らない（進捗コード・クラウド同期の契約を増やさない）。
  assert.doesNotMatch(sheet, /useStore\.setState/)
  for (const source of [study, detail]) {
    assert.match(source, /<WordListSheet/)
    assert.match(source, /wordId=\{word\.id\}/)
  }
  assert.match(study, /data-vocab-word-list-button/)
})
