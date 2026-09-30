// 自作カードの保存と持ち出し（依頼台帳 requests/2026-09-30-custom-card-templates.json の data-kept）。
// カード（英単語・ほかのテンプレート）・作ったカテゴリー・暗記とテストの記録を、
// 端末保存・進捗コード（QR）・クラウド同期・JSONファイルの書き出しと読み込み・リセットで正しく扱う。
// 以前の自作単語（テンプレートも分類も持たない保存）は、教科「英語」の英単語のカードとしてそのまま残り、以前のJSONファイルも読める。
// 以前のテンプレート（用語と意味・用語・意味・解説）のカード・カテゴリーは、どの経路から読んでも「その他」になり、中身・記録を残す
// （requests/2026-09-30-custom-card-form-followup.json の saved-cards-kept。端末の読み戻しそのものは tests/custom-cards-hydrate.test.mjs）。
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  PERSISTED_PROGRESS_FIELDS,
  decodeProgress,
  encodeProgress,
} from '../src/lib/progressCode.js'
import { PROGRESS_RESET_GROUPS } from '../src/lib/progressReset.js'
import { progressStateFromCloud } from '../src/lib/cloudSync.js'
import {
  buildCustomLibraryFile,
  customLibraryFileName,
  customLibraryFileText,
  mergeCustomLibrary,
  parseCustomLibraryFile,
} from '../src/lib/customLibrary.js'
import {
  migratePersistedState,
  progressStateFromPayload,
  resetProgressState,
  useStore,
} from '../src/store/useStore.js'

const CATEGORY = { id: 'cat-midterm', title: '2学期中間英語', subject: 'english', template: 'english', createdAt: 1, updatedAt: 1 }
const WORD = { id: 'u-word1', word: 'glimmer', meanings: ['かすかな光'], pos: '名', level: '2', field: '自然・環境・地理', category: 'cat-midterm', synonyms: [{ w: 'gleam', m: '光' }], etymology: '古い語から' }
const CARD = { id: 'c-card1', template: 'qa', category: 'subject:social', front: '鎌倉幕府を開いた人物は？', back: '源頼朝', note: '1192年ごろ' }
const LEGACY_WORD = { id: 'u-legacy', word: 'serendipity', meanings: ['思いがけない発見'], pos: '名', level: '1', field: '心・コミュニケーション' }
const SRS = { 'c-card1': { box: 2, correct: 1, wrong: 0, due: 20000, last: 19990 } }

const libraryState = (patch = {}) => ({
  ...useStore.getInitialState(),
  customWords: [WORD],
  customCards: [CARD],
  customCategories: [CATEGORY],
  customCardSrs: SRS,
  ...patch,
})

const summary = (state) => ({
  words: state.customWords.map((word) => [word.id, word.word, word.category, word.synonyms, word.etymology]),
  cards: state.customCards.map((card) => [card.id, card.template, card.category, card.front, card.back, card.note]),
  categories: state.customCategories.map((category) => [category.id, category.title, category.subject, category.template]),
  srs: state.customCardSrs,
})

test('カード・カテゴリー・記録は、端末保存・進捗コード・クラウド同期の同じ保存項目の一覧に載る', () => {
  for (const field of ['customCardSrs', 'customWords', 'customCards', 'customCategories']) {
    assert.ok(PERSISTED_PROGRESS_FIELDS.includes(field), field)
  }
})

test('端末保存：読み戻すと同じまとまりになり、以前の自作単語は教科「英語」の英単語のカードになる', () => {
  const restored = migratePersistedState(libraryState())
  assert.deepEqual(summary(restored), summary(libraryState()))
  const legacy = migratePersistedState({ customWords: [LEGACY_WORD] })
  assert.equal(legacy.customWords[0].category, 'subject:english')
  assert.deepEqual(legacy.customCards, [])
  assert.deepEqual(legacy.customCategories, [])
  assert.deepEqual(legacy.customCardSrs, {})
  // 以前の自作単語は、新しい欄を空のまま持つ。
  assert.deepEqual(legacy.customWords[0].synonyms, [])
  assert.equal(legacy.customWords[0].etymology, '')
})

test('進捗コード（QR）：書き出して読み戻すと、カード・カテゴリー・記録がそろう', () => {
  const state = libraryState()
  const restored = progressStateFromPayload(decodeProgress(encodeProgress(state)))
  assert.deepEqual(summary(restored), summary(state))
  // 以前の進捗コード（自作単語だけ）も読める。
  const legacy = progressStateFromPayload({ customWords: [LEGACY_WORD] })
  assert.equal(legacy.customWords[0].category, 'subject:english')
  assert.deepEqual(legacy.customCards, [])
})

test('クラウド同期：保存にある項目を読み、古い保存に項目が無ければ端末のカードを消さない', () => {
  const current = libraryState()
  const fromCloud = progressStateFromCloud({
    customWords: [WORD],
    customCards: [CARD],
    customCategories: [CATEGORY],
    customCardSrs: SRS,
  }, current)
  assert.deepEqual(summary(fromCloud), summary(current))
  const oldCloud = progressStateFromCloud({}, current)
  assert.deepEqual(summary(oldCloud), summary(current))
})

test('JSONファイル：英単語・カード・カテゴリーを1つのファイルで書き出し、読み戻せる。以前の自作単語のファイルも読める', () => {
  const file = buildCustomLibraryFile({ words: [WORD], cards: [CARD], categories: [CATEGORY] }, { now: Date.UTC(2026, 8, 30) })
  assert.equal(file.kind, 'custom-cards')
  assert.equal(file.version, 2)
  assert.equal(customLibraryFileName(new Date(2026, 8, 30).getTime()), 'study-app-custom-cards-20260930.json')
  const parsed = parseCustomLibraryFile(customLibraryFileText({ words: [WORD], cards: [CARD], categories: [CATEGORY] }))
  assert.equal(parsed.status, 'ok')
  assert.deepEqual(summary({ customWords: parsed.library.words, customCards: parsed.library.cards, customCategories: parsed.library.categories, customCardSrs: SRS }), summary(libraryState()))

  const legacyFile = JSON.stringify({ app: 'study-app', kind: 'custom-words', version: 1, words: [LEGACY_WORD] })
  const legacy = parseCustomLibraryFile(legacyFile)
  assert.equal(legacy.status, 'ok')
  assert.equal(legacy.library.words[0].category, 'subject:english')
  assert.equal(parseCustomLibraryFile(JSON.stringify([LEGACY_WORD])).status, 'ok')

  assert.equal(parseCustomLibraryFile('{壊れた').status, 'broken')
  assert.equal(parseCustomLibraryFile('{"kind":"progress","words":[]}').status, 'other')
  assert.equal(parseCustomLibraryFile('{"kind":"custom-cards"}').status, 'other')
  assert.equal(parseCustomLibraryFile('{"words":[],"cards":[],"categories":[]}').status, 'empty')

  // 足す（同じ ID は書き換え）と、まるごと入れ替える。
  const merged = mergeCustomLibrary(
    { words: [WORD], cards: [], categories: [CATEGORY] },
    { words: [{ ...WORD, meanings: ['書き換え'] }, LEGACY_WORD], cards: [CARD], categories: [{ id: 'cat-new', title: '期末社会' }] },
  )
  assert.equal(merged.addedCount, 2)
  assert.equal(merged.updatedCount, 1)
  assert.equal(merged.categoryCount, 1)
  assert.deepEqual(merged.library.words.find((word) => word.id === WORD.id).meanings, ['書き換え'])
  assert.deepEqual(merged.library.categories.map((category) => category.id), ['cat-midterm', 'cat-new'])
  const replaced = mergeCustomLibrary({ words: [WORD], cards: [CARD], categories: [CATEGORY] }, { words: [LEGACY_WORD] }, { mode: 'replace' })
  assert.deepEqual(replaced.library.words.map((word) => word.id), ['u-legacy'])
  assert.deepEqual(replaced.library.cards, [])
  assert.deepEqual(replaced.library.categories, [])

  // ストアの読み込み操作も同じ数を返す。
  const original = useStore.getState()
  try {
    useStore.setState(libraryState(), true)
    const result = useStore.getState().importCustomLibrary(parsed.library, 'merge')
    assert.equal(result.updatedCount, 2)
    assert.equal(useStore.getState().customWords.length, 1)
  } finally {
    useStore.setState(original, true)
  }
})

test('以前のテンプレートのカード・カテゴリーは、端末・進捗コード・クラウド・JSON ファイルのどこから読んでも「その他」になる', () => {
  const legacyCards = [
    { id: 'c-old1', template: 'term', category: 'subject:social', front: '三角州', back: '河口の平らな土地' },
    { id: 'c-old2', template: 'termNote', category: 'cat-old', front: '扇状地', back: '扇の形の土地', note: '果樹園に使われる' },
  ]
  const legacyCategory = { id: 'cat-old', title: '期末社会', subject: 'social', template: 'term' }
  const legacySrs = { 'c-old2': { box: 4, correct: 3, wrong: 1, due: 30000, last: 29990 } }
  const expected = {
    cards: [
      ['c-old1', 'other', 'subject:social', '三角州', '河口の平らな土地', ''],
      ['c-old2', 'other', 'cat-old', '扇状地', '扇の形の土地', '果樹園に使われる'],
    ],
    categories: [['cat-old', '期末社会', 'social', 'other']],
    srs: legacySrs,
  }
  const view = (state) => {
    const { cards, categories, srs } = summary(state)
    return { cards, categories, srs }
  }
  const stored = { customWords: [], customCards: legacyCards, customCategories: [legacyCategory], customCardSrs: legacySrs }
  // 端末（保存の版が古いときの移し替え）
  assert.deepEqual(view(migratePersistedState(stored)), expected, '端末')
  // 進捗コード（QR）：以前の形のまま書かれたコード
  assert.deepEqual(view(progressStateFromPayload(stored)), expected, '進捗コード')
  // クラウド同期
  assert.deepEqual(view(progressStateFromCloud(stored, libraryState())), expected, 'クラウド')
  // JSON ファイル
  const parsed = parseCustomLibraryFile(JSON.stringify({ kind: 'custom-cards', version: 2, words: [], cards: legacyCards, categories: [legacyCategory] }))
  assert.equal(parsed.status, 'ok')
  assert.deepEqual(
    view({ customWords: [], customCards: parsed.library.cards, customCategories: parsed.library.categories, customCardSrs: legacySrs }),
    expected,
    'JSON ファイル',
  )
})

test('リセット：「自作カード」でカードとカテゴリー、「復習の記録と予定」で自作カードの記録を消す', () => {
  const custom = PROGRESS_RESET_GROUPS.find((group) => group.id === 'customWords')
  assert.equal(custom.label, '自作カード')
  assert.deepEqual(custom.fields, ['customWords', 'customCards', 'customCategories'])
  const review = PROGRESS_RESET_GROUPS.find((group) => group.id === 'review')
  assert.ok(review.fields.includes('customCardSrs'))
  const state = libraryState()
  const afterCustom = resetProgressState(state, ['customWords'])
  assert.deepEqual([afterCustom.customWords, afterCustom.customCards, afterCustom.customCategories], [[], [], []])
  assert.equal(afterCustom.customCardSrs, undefined)
  const afterReview = resetProgressState(state, ['review'])
  assert.deepEqual(afterReview.customCardSrs, {})
  assert.equal(afterReview.customCards, undefined)
})
