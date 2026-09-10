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
  assert.equal(describeVocabMix('even'), '10問中 復習5・未修5')
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
  // 切り替えは各パネルの見出し行の先頭に入れ、切り替えだけの段を作らない。
  assert.match(dock, /export function SpeechConsole\(\{ state, onRateChange, leading = null \}\)/)
  assert.match(mix, /export function VocabMixConsole\(\{ leading = null \} = \{\}\)/)
  assert.equal((dock.match(/leading=\{tabs\}/g) ?? []).length, 2)
  assert.doesNotMatch(dock, /grid grid-cols-2 gap-1 px-2 pt-1\.5/)
  // 再生の6操作は残し、アイコンと名前を横に並べて押せる高さ44pxの1段に収める。
  assert.match(dock, /flex min-h-11 min-w-0 items-center justify-center/)
  assert.doesNotMatch(dock, /flex min-h-11 min-w-0 flex-col/)
  assert.match(dock, /読み上げ/)
  assert.match(dock, /出題バランス/)
  assert.match(dock, /vocabMixApplies\(screen, params\)/)
  // 読み上げも出題バランスも無い画面では、これまでどおり何も出さない。
  assert.match(dock, /if \(!state\.visible && !mixAvailable\) return null/)
  assert.match(mix, /data-vocab-mix-range/)
  assert.match(mix, /setSetting\('vocabMix'/)
  assert.match(mix, /次の出題から/)
  // 読み上げ欄と同じ枠を分け合うので、見出し1行＋操作1行の高さから増やさない。
  assert.match(mix, /data-vocab-mix-console-controls/)
  assert.doesNotMatch(mix, /<p className="mt-0\.5/)
  // 出す語が決まっている画面（マイ単語・復習など）ではバーを出さない。
  assert.match(mix, /isAutomaticVocabularySource/)
  for (const source of [study, quiz]) {
    assert.match(source, /freshShareOverride: vocabMixFreshShare\(useStore\.getState\(\)\.settings\.vocabMix\)/)
  }
})

test('マイ単語は単語帳の1冊として扱い、単語帳の保存先は既存の問題集を使う', () => {
  const sheet = read('../src/components/WordListSheet.jsx')
  const study = read('../src/screens/VocabStudy.jsx')
  const detail = read('../src/screens/WordDetail.jsx')
  const levels = read('../src/screens/VocabLevels.jsx')

  assert.match(sheet, /title="単語帳"/)
  assert.match(sheet, /MY_WORDS_BOOK_TITLE = 'マイ単語'/)
  // 先頭の1冊はマイ単語（アプリ全体の保存先 myList をそのまま使う）。
  assert.match(sheet, /onClick=\{\(\) => toggleMyList\(wordId\)\}/)
  assert.match(sheet, /createNotebookSet/)
  assert.match(sheet, /setNotebookSetItem\(set\.id, DOMAIN, wordId, !included\)/)
  assert.match(sheet, /data-word-list-new-title/)
  assert.match(sheet, /マイ学習ノートの問題集と同じもの/)
  // 新しい保存領域は作らない（進捗コード・クラウド同期の契約を増やさない）。
  assert.doesNotMatch(sheet, /useStore\.setState/)
  for (const source of [study, detail]) {
    assert.match(source, /<WordListSheet/)
    assert.match(source, /wordId=\{word\.id\}/)
    assert.match(source, /useWordInAnyBook/)
    // マイ単語だけを直接切り替える2つ目の保存ボタンは置かない。
    assert.doesNotMatch(source, /toggleMyList/)
  }
  assert.match(study, /label="単語帳"/)
  assert.match(detail, /単語帳に入れる/)
  assert.doesNotMatch(detail, /マイ単語リストに保存|マイ単語帳に入れる/)

  // 単語画面のショートカットは「今日の復習」の右隣で、単語帳を選んで学ぶ。
  assert.match(levels, /<WordBookStudySheet/)
  assert.match(levels, /data-vocab-word-books-shortcut/)
  assert.doesNotMatch(levels, /title: 'マイ単語'/)
  assert.ok(levels.indexOf('今日の復習') < levels.indexOf('data-vocab-word-books-shortcut'))
})
