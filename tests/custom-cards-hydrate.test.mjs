// 端末の保存を読み戻したとき（zustand の persist）、自作カードが今の形にそろうか
// （依頼台帳 requests/2026-09-30-custom-card-form-followup.json の saved-cards-kept）。
//
// persist の migrate は、保存の版が古いときにしか通らない。前の作り（2026-09-30 公開の 0899a02）は自作カードのそろえを
// migrate にだけ置いたので、保存の版が今と同じ端末（09-12 からの利用者）では、以前の自作単語（分類なし）が分類に入らず
// 自作カードの画面に出なかった。今は読み戻すたびにそろえる（store の mergePersistedState）。ここでは本物の読み戻しで確かめる。
//
// このファイルは、ストアを読み込む前に端末の保存（localStorage）を用意する。ほかのテストと同じプロセスで動かさない
// （node --test はファイルごとにプロセスを分ける）。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const STORAGE_KEY = 'eigo-quest'
const memory = new Map()
globalThis.window ??= globalThis
globalThis.localStorage = {
  getItem: (key) => (memory.has(key) ? memory.get(key) : null),
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key),
  clear: () => memory.clear(),
  key: (index) => [...memory.keys()][index] ?? null,
  get length() { return memory.size },
}

const storeSource = readFileSync(new URL('../src/store/useStore.js', import.meta.url), 'utf8')
const CURRENT_VERSION = Number(storeSource.match(/name: 'eigo-quest',\s*version: (\d+),/)[1])

// 以前の自作単語（分類も新しい欄もない）、以前のテンプレートのカード2枚、以前のテンプレートを最初に選ぶカテゴリー。
const LEGACY_WORD = { id: 'u-legacy1', word: 'glimmer', meanings: ['かすかな光'], pos: '名', level: '2', field: '自然・環境・地理', phonetic: '', example: null, note: 'メモ', createdAt: 1, updatedAt: 1 }
const TERM_CARD = { id: 'c-legacy1', template: 'term', category: 'subject:social', front: '三角州', back: '河口の平らな土地', createdAt: 2, updatedAt: 2 }
const TERM_NOTE_CARD = { id: 'c-legacy2', template: 'termNote', category: 'cat-legacy', front: '扇状地', back: '扇の形の土地', note: '果樹園に使われる', createdAt: 3, updatedAt: 3 }
const LEGACY_CATEGORY = { id: 'cat-legacy', title: '期末社会', subject: 'social', template: 'termNote', createdAt: 4, updatedAt: 4 }
const RECORD = { box: 3, correct: 2, wrong: 0, due: 99999, last: 1 }

function storedState(version) {
  return JSON.stringify({
    version,
    state: {
      customWords: [LEGACY_WORD],
      customCards: [TERM_CARD, TERM_NOTE_CARD],
      customCategories: [LEGACY_CATEGORY],
      srs: { [LEGACY_WORD.id]: RECORD },
      customCardSrs: { [TERM_NOTE_CARD.id]: RECORD },
      learningNotebook: {
        sets: [{ id: 'notebook-set-1', title: 'マイ単語', refs: [`vocab:${LEGACY_WORD.id}`, `customCards:${TERM_NOTE_CARD.id}`] }],
        entries: { [`customCards:${TERM_NOTE_CARD.id}`]: { saved: false, note: '単語帳のメモ', tags: [] } },
      },
    },
  })
}

function assertSettled(state, label) {
  // 以前の自作単語は、教科「英語」の英単語のカードとして、新しい欄を空のまま持つ。
  const word = state.customWords.find((item) => item.id === LEGACY_WORD.id)
  assert.equal(word?.category, 'subject:english', `${label}：以前の自作単語は教科「英語」`)
  for (const key of ['otherSenses', 'derivatives', 'synonyms', 'antonyms', 'confusables', 'phrases']) {
    assert.deepEqual(word[key], [], `${label}：以前の自作単語の ${key}`)
  }
  assert.equal(word.note, 'メモ')
  // 以前のテンプレートのカードは「その他」になり、中身・分類を残す。
  const term = state.customCards.find((item) => item.id === TERM_CARD.id)
  const termNote = state.customCards.find((item) => item.id === TERM_NOTE_CARD.id)
  assert.deepEqual([term.template, term.front, term.back, term.note, term.category], ['other', '三角州', '河口の平らな土地', '', 'subject:social'], label)
  assert.deepEqual([termNote.template, termNote.front, termNote.back, termNote.note, termNote.category], ['other', '扇状地', '扇の形の土地', '果樹園に使われる', 'cat-legacy'], label)
  assert.equal(state.customCategories.find((item) => item.id === LEGACY_CATEGORY.id)?.template, 'other', `${label}：カテゴリーの最初のテンプレート`)
  // 記録・単語帳・メモはそのまま。
  assert.deepEqual(state.srs[LEGACY_WORD.id], RECORD, `${label}：英単語の記録`)
  assert.deepEqual(state.customCardSrs[TERM_NOTE_CARD.id], RECORD, `${label}：カードの記録`)
  assert.deepEqual(state.learningNotebook.sets[0].refs, [`vocab:${LEGACY_WORD.id}`, `customCards:${TERM_NOTE_CARD.id}`], `${label}：単語帳`)
  assert.equal(state.learningNotebook.entries[`customCards:${TERM_NOTE_CARD.id}`]?.note, '単語帳のメモ', `${label}：メモ`)
}

test('保存の版が今と同じ端末でも、以前の自作単語は教科「英語」に、以前のテンプレートのカード・カテゴリーは「その他」にそろう', async () => {
  memory.set(STORAGE_KEY, storedState(CURRENT_VERSION))
  const { useStore } = await import('../src/store/useStore.js')
  assert.equal(useStore.persist.getOptions().version, CURRENT_VERSION)
  assert.equal(useStore.persist.hasHydrated(), true)
  assertSettled(useStore.getState(), '版が同じ')

  // 画面の数え方：以前の自作単語は、英語アプリの自作カード（教科「英語」）に数えられる。
  const { customEntryCountForSubject } = await import('../src/lib/customCards.js')
  const state = useStore.getState()
  const library = { words: state.customWords, cards: state.customCards, categories: state.customCategories }
  assert.equal(customEntryCountForSubject(library, 'english'), 1)
  assert.equal(customEntryCountForSubject(library, 'social'), 2)
})

test('保存の版が古い端末も、読み戻すと同じ形にそろう', async () => {
  const { useStore } = await import('../src/store/useStore.js')
  memory.set(STORAGE_KEY, storedState(CURRENT_VERSION - 1))
  await useStore.persist.rehydrate()
  assertSettled(useStore.getState(), '版が古い')
})

test('ストアの読み戻しは、保存の版に関係なく自作カードをそろえる merge を持つ', () => {
  assert.match(storeSource, /migrate: migratePersistedState,\s*merge: mergePersistedState,/)
  assert.match(storeSource, /export function mergePersistedState\(persistedState, currentState\)/)
})
