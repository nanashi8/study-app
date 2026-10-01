import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { decodeProgress } from '../src/lib/progressCode.js'
import { createStarterLearningNotebook } from '../src/lib/learningNotebook.js'
import {
  VOCAB_HISTORY_LIMIT,
  normalizeVocabHistory,
  prependVocabHistory,
} from '../src/lib/vocabHistory.js'
import { migratePersistedState, useStore } from '../src/store/useStore.js'

test('辞書履歴は新しい順の一意な単語IDだけを上限内で保持する', () => {
  const ids = Array.from({ length: VOCAB_HISTORY_LIMIT + 5 }, (_, index) => `word-${index}`)
  assert.deepEqual(
    normalizeVocabHistory([null, '', ids[0], ids[0], ...ids]),
    ids.slice(0, VOCAB_HISTORY_LIMIT),
  )
  assert.deepEqual(
    prependVocabHistory(['old', 'affect', 'read'], ['affect', 'access']),
    ['affect', 'access', 'old', 'read'],
  )
  assert.deepEqual(normalizeVocabHistory('affect'), [])
})

test('参照と単語帳へ入れた語は辞書履歴へ集まり、外しても履歴を消さない', () => {
  const before = useStore.getState()
  useStore.setState({ vocabHistory: [], learningNotebook: createStarterLearningNotebook() })

  try {
    useStore.getState().recordVocabHistory('affect')
    useStore.getState().recordVocabHistory('access')
    useStore.getState().recordVocabHistory('affect')
    assert.deepEqual(useStore.getState().vocabHistory, ['affect', 'access'])

    // 「マイ単語」も名前をつけた単語帳も、入れた語は同じように辞書履歴へ残る。
    const myWordsId = useStore.getState().learningNotebook.sets[0].id
    useStore.getState().setNotebookSetItem(myWordsId, 'vocab', 'say', true)
    assert.deepEqual(useStore.getState().learningNotebook.sets[0].refs, ['vocab:say'])
    assert.deepEqual(useStore.getState().vocabHistory, ['say', 'affect', 'access'])

    useStore.getState().setNotebookSetItem(myWordsId, 'vocab', 'say', false)
    assert.deepEqual(useStore.getState().learningNotebook.sets[0].refs, [])
    assert.deepEqual(useStore.getState().vocabHistory, ['say', 'affect', 'access'])

    const setId = useStore.getState().createNotebookSet('テスト範囲')
    useStore.getState().setNotebookSetItems(setId, 'vocab', ['read', 'access', 'read'], true)
    assert.deepEqual(
      useStore.getState().learningNotebook.sets.find((set) => set.id === setId).refs,
      ['vocab:read', 'vocab:access'],
    )
    assert.deepEqual(
      useStore.getState().vocabHistory,
      ['read', 'access', 'say', 'affect'],
    )

    useStore.getState().clearVocabHistory()
    assert.deepEqual(useStore.getState().vocabHistory, [])
  } finally {
    useStore.setState({ vocabHistory: before.vocabHistory, learningNotebook: before.learningNotebook })
  }
})

test('辞書履歴は端末保存・進捗コード向けに正規化して往復する', () => {
  assert.deepEqual(
    migratePersistedState({ vocabHistory: ['read', 'read', null, 'access'] }).vocabHistory,
    ['read', 'access'],
  )

  const before = useStore.getState()
  useStore.setState({ vocabHistory: ['affect', 'say'] })

  try {
    const code = useStore.getState().exportCode()
    const restored = decodeProgress(code)
    assert.deepEqual(restored.vocabHistory, ['affect', 'say'])

    useStore.setState({ vocabHistory: [] })
    useStore.getState().importCode(code)
    assert.deepEqual(useStore.getState().vocabHistory, ['affect', 'say'])
  } finally {
    useStore.setState({ vocabHistory: before.vocabHistory })
  }
})

test('英和辞書の検索結果・参照履歴の各単語から、登録先の単語帳に入れられる', () => {
  const source = readFileSync(
    new URL('../src/screens/VocabSearch.jsx', import.meta.url),
    'utf8',
  )

  // 検索結果・自作単語・履歴に同じ「単語帳」ボタン（WordRow）を置き、押すと画面下部の「単語帳」で選んだ登録先に入れる。
  // sense は、ほかの意味で当たった語の行に、当たったほかの意味を出すためのもの（requests/2026-10-02-dictionary-search-other-senses.json）。
  assert.equal((source.match(/<WordRow\b/g) ?? []).length, 3)
  assert.match(source, /function WordRow\(\{ word, custom = false, sense = null, onOpen \}\)/)
  assert.match(source, /const wordBook = useWordBookSlot\(\[`vocab:\$\{word\.id\}`\], \{ label: word\.word \}\)/)
  assert.match(source, /const wordBook = useWordBookSlot\(\[`phrases:\$\{phrase\.id\}`\], \{ label: phrase\.phrase \}\)/)
  assert.match(source, /data-dictionary-word-book/)
  assert.doesNotMatch(source, /<WordListSheet|onChooseBook|toggleMyList|マイ単語/)
})
