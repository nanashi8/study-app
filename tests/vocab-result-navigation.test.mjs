import test from 'node:test'
import assert from 'node:assert/strict'

import { useStore } from '../src/store/useStore.js'

test('単語結果の「戻る」は終了済みセッションを履歴に残さない', () => {
  const before = useStore.getState()
  try {
    useStore.setState({ screen: 'home', params: {}, stack: [] })
    useStore.getState().navigate('vocabLevels')
    useStore.getState().navigate('vocabStudy', { source: { type: 'level', levelId: '5' } })
    useStore.getState().navigate('sessionResult', { engine: 'word' })
    useStore.getState().returnTo('vocabLevels')

    assert.equal(useStore.getState().screen, 'vocabLevels')
    assert.deepEqual(useStore.getState().stack.map((item) => item.screen), ['home'])

    useStore.getState().globalBack()
    assert.equal(useStore.getState().screen, 'home')
    assert.deepEqual(useStore.getState().stack, [])
  } finally {
    useStore.setState({
      screen: before.screen,
      params: before.params,
      stack: before.stack,
    })
  }
})
