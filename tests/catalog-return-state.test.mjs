import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  catalogReturnState,
  readCatalogReturnState,
} from '../src/lib/catalogReturnState.js'
import { learningContentCatalogLaunch } from '../src/lib/learningContentCatalog.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

const LEVEL_LIST = {
  key: '5',
  sorts: ['weight', 'memoryAt'],
  defaultSort: 'weight',
  defaultDirections: { weight: 'desc', memoryAt: 'asc' },
  pageSize: 80,
}

test('一覧を離れる前のしぼり込み・並び・隠した行・表示件数・スクロール位置を読み戻せる', () => {
  const saved = catalogReturnState({
    key: '5',
    activity: 'test',
    sort: 'memoryAt',
    direction: 'desc',
    filters: { fieldFilter: 'food', statusFilter: 'testIncorrect' },
    toolsOpen: true,
    visible: 160,
    dismissedByActivity: { memory: new Set(['a']), test: new Set(['b', 'c']) },
    scrollTop: 812.4,
  })
  // 画面の履歴（params）に載せるので、ただの値だけでできている。
  assert.deepEqual(JSON.parse(JSON.stringify(saved)), saved)

  const restored = readCatalogReturnState(saved, LEVEL_LIST)
  assert.equal(restored.activity, 'test')
  assert.equal(restored.sort, 'memoryAt')
  assert.equal(restored.direction, 'desc')
  assert.deepEqual(restored.filters, { fieldFilter: 'food', statusFilter: 'testIncorrect' })
  assert.equal(restored.toolsOpen, true)
  assert.equal(restored.visible, 160)
  assert.deepEqual([...restored.dismissedByActivity.memory], ['a'])
  assert.deepEqual([...restored.dismissedByActivity.test], ['b', 'c'])
  assert.equal(restored.scrollTop, 812)
})

test('別の一覧で残した見え方や、崩れた値は使わない', () => {
  assert.equal(readCatalogReturnState(undefined, LEVEL_LIST), null)
  assert.equal(
    readCatalogReturnState(
      catalogReturnState({ key: '4', sort: 'weight', direction: 'desc', visible: 80 }),
      LEVEL_LIST,
    ),
    null,
  )
  const restored = readCatalogReturnState({
    key: '5',
    activity: 'quiz',
    sort: 'unknown',
    direction: 'sideways',
    filters: { fieldFilter: 3, statusFilter: 'all' },
    visible: 7,
    dismissed: { memory: 'a', test: ['b', 4] },
    scrollTop: -20,
  }, LEVEL_LIST)
  assert.equal(restored.activity, 'memory')
  assert.equal(restored.sort, 'weight')
  assert.equal(restored.direction, 'desc')
  assert.deepEqual(restored.filters, { statusFilter: 'all' })
  assert.equal(restored.visible, 80)
  assert.equal(restored.dismissedByActivity.memory.size, 0)
  assert.deepEqual([...restored.dismissedByActivity.test], ['b'])
  assert.equal(restored.scrollTop, 0)
})

test('一覧から学習へ移るときは、戻り先に一覧の見え方を一緒に載せる', () => {
  const content = { id: 'usage', label: '熟語・構文' }
  const catalogState = catalogReturnState({
    key: 'usage:all',
    sort: 'weight',
    direction: 'desc',
    filters: { query: 'take' },
    visible: 80,
  })
  const launch = learningContentCatalogLaunch(content, [{ id: 'take-off' }], {
    catalogView: 'all',
    catalogState,
  })
  assert.deepEqual(launch.params.returnTo, {
    screen: 'myLearning',
    params: { view: 'catalog', contentId: 'usage', catalogView: 'all', catalogState },
  })
  // 見え方を渡さない呼び出しの戻り先は、これまでと同じ形のまま。
  assert.deepEqual(
    learningContentCatalogLaunch(content, [{ id: 'take-off' }], { catalogView: 'all' }).params.returnTo,
    { screen: 'myLearning', params: { view: 'catalog', contentId: 'usage', catalogView: 'all' } },
  )
})

test('単語と18教材の一覧は、語の詳細や学習へ移る前に見え方を残し、戻ったら読み戻す', () => {
  const decks = read('../src/screens/VocabDecks.jsx')
  const catalog = read('../src/components/LearningContentCatalog.jsx')
  const myLearning = read('../src/screens/MyLearning.jsx')

  // 級・10分野・単語帳の一覧から語の詳細へ
  assert.match(decks, /replaceParams\(\{ \.\.\.params, view, fieldFilter: listFieldFilter, catalogState \}\)/)
  assert.match(decks, /onOpen=\{\(\) => openWord\(row\.word\.id\)\}/)
  assert.equal((decks.match(/returnState=\{params\.catalogState\}/g) ?? []).length, 3)
  assert.match(decks, /readCatalogReturnState\(returnState/)
  assert.match(decks, /ref=\{listRef\}/)

  // 暗記・テストの記録の「一覧を確認」から語の詳細や学習へ
  assert.match(myLearning, /returnState=\{params\.catalogState\}/)
  assert.match(catalog, /readCatalogReturnState\(returnState/)
  assert.equal((catalog.match(/catalogState: currentReturnState\(\)/g) ?? []).length, 3)
  assert.match(catalog, /ref=\{listRef\}/)
})
