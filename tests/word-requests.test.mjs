// 辞書リクエストの回帰テスト。
// ボタンを押さずに自動で送るぶん、受付を絞る歯止めが効いていることを確かめる。
// 通信を伴う経路（実際の書き込み）は呼ばない。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  WORD_REQUEST_DEVICE_DAILY_LIMIT,
  WORD_REQUEST_TOTAL_LIMIT,
  normalizeRequestWord,
  readDeviceDailyCount,
  requestWord,
} from '../src/lib/wordRequests.js'

const DAILY_KEY = 'sa-word-requests-day'

// localStorage を差し替えて、端末側の控えだけを再現する。
function useStorage(initial = {}) {
  const store = new Map(Object.entries(initial))
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
  })
  return store
}

const dayKeyFor = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

test('英単語の形だけを受け付ける', () => {
  assert.equal(normalizeRequestWord(' Apply '), 'apply')
  assert.equal(normalizeRequestWord('GO'), 'go')
  assert.equal(normalizeRequestWord("don't"), "don't")
  assert.equal(normalizeRequestWord('go-getter'), 'go-getter')
  assert.equal(normalizeRequestWord('go2'), '')
  assert.equal(normalizeRequestWord('こんにちは'), '')
  assert.equal(normalizeRequestWord('a'.repeat(65)), '')
  assert.equal(normalizeRequestWord(''), '')
})

test('打ちかけの1文字と見知らぬ流入元は自動リクエストしない', async () => {
  useStorage()
  assert.equal((await requestWord('a')).status, 'invalid')
  assert.equal((await requestWord('go2')).status, 'invalid')
  assert.equal((await requestWord('apple', { source: 'unknown-source' })).status, 'invalid')
})

test('端末の1日の上限に達したら、それ以上は自動で送らない', async () => {
  const today = dayKeyFor(new Date())
  useStorage({
    [DAILY_KEY]: JSON.stringify({ day: today, count: WORD_REQUEST_DEVICE_DAILY_LIMIT }),
  })
  assert.equal(readDeviceDailyCount(), WORD_REQUEST_DEVICE_DAILY_LIMIT)
  const result = await requestWord('unlikelyheadword')
  assert.equal(result.status, 'limit')
})

test('日付が変わると端末の数えは0に戻る', () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
  useStorage({ [DAILY_KEY]: JSON.stringify({ day: dayKeyFor(yesterday), count: 99 }) })
  assert.equal(readDeviceDailyCount(), 0)

  useStorage({ [DAILY_KEY]: 'こわれた値' })
  assert.equal(readDeviceDailyCount(), 0)
})

test('全体の上限はセキュリティルールと同じ数値にそろえる', () => {
  const rules = readFileSync(new URL('../database.rules.json', import.meta.url), 'utf8')
  assert.ok(rules.includes(String(WORD_REQUEST_TOTAL_LIMIT)))
  assert.ok(WORD_REQUEST_DEVICE_DAILY_LIMIT < WORD_REQUEST_TOTAL_LIMIT)
})

test('辞書画面はリクエストボタンを持たず、入力が止まってから自動で送る', () => {
  const src = readFileSync(new URL('../src/screens/VocabSearch.jsx', import.meta.url), 'utf8')
  assert.ok(!src.includes('この単語をリクエスト'), 'リクエストボタンは廃止')
  assert.ok(!src.includes('ログイン画面へ'), 'リクエストにログインは求めない')
  assert.ok(src.includes('AUTO_REQUEST_DELAY_MS'), '入力が止まるまで待ってから送る')
  assert.ok(src.includes('clearTimeout'), '検索語が変わったら待ち時間を数え直す')
  for (const status of ['sent', 'already', 'full', 'limit', 'invalid', 'offline']) {
    assert.ok(src.includes(`${status}:`), `${status} の案内文がある`)
  }
})

test('写真の読み取りは選んだ語だけを送る（自動送信ではない）', () => {
  const src = readFileSync(new URL('../src/screens/VocabCamera.jsx', import.meta.url), 'utf8')
  assert.ok(src.includes("source: 'camera-ocr'"))
  assert.ok(src.includes('selectedRequests'), '選択した語だけを送る')
})
