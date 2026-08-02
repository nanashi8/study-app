import test from 'node:test'
import assert from 'node:assert/strict'

import { decodeProgress } from '../src/lib/progressCode.js'
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

test('参照とマイ単語登録は辞書履歴へ集まり、解除では履歴を消さない', () => {
  const before = useStore.getState()
  useStore.setState({ vocabHistory: [], myList: [] })

  try {
    useStore.getState().recordVocabHistory('affect')
    useStore.getState().recordVocabHistory('access')
    useStore.getState().recordVocabHistory('affect')
    assert.deepEqual(useStore.getState().vocabHistory, ['affect', 'access'])

    useStore.getState().toggleMyList('say')
    assert.deepEqual(useStore.getState().myList, ['say'])
    assert.deepEqual(useStore.getState().vocabHistory, ['say', 'affect', 'access'])

    useStore.getState().toggleMyList('say')
    assert.deepEqual(useStore.getState().myList, [])
    assert.deepEqual(useStore.getState().vocabHistory, ['say', 'affect', 'access'])

    useStore.getState().addManyToMyList(['read', 'access', 'read'])
    assert.deepEqual(useStore.getState().myList, ['read', 'access'])
    assert.deepEqual(
      useStore.getState().vocabHistory,
      ['read', 'access', 'say', 'affect'],
    )

    useStore.getState().clearVocabHistory()
    assert.deepEqual(useStore.getState().vocabHistory, [])
  } finally {
    useStore.setState({ vocabHistory: before.vocabHistory, myList: before.myList })
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
