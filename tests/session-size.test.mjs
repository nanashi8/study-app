// 「1回の問題数」の選択肢の回帰テスト。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { buildEtymologyDeck } from '../src/lib/etymologyProgress.js'
import { ETYMOLOGY_PACKS } from '../src/data/vocab.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('選べる問題数は 5・10・20・30・50・100・200 と「全部」', () => {
  const source = read('src/components/SessionSize.jsx')
  const options = /const SIZE_OPTIONS = \[([^\]]+)\]/.exec(source)?.[1]
  assert.ok(options, '選択肢の一覧が見つからない')
  assert.deepEqual(
    options.split(',').map((value) => Number(value.trim())),
    [5, 10, 20, 30, 50, 100, 200],
  )
  // 在庫がちょうど出し切れる数は「全部」として並べる。
  assert.match(source, /size === pool \? '全部'/)
  assert.match(source, /\.\.\.\(pool \? \[pool\] : \[\]\)/)
})

test('問題数を選ぶ画面は、教材の在庫数を渡している（渡さないと「全部」が出ない）', () => {
  const screens = readdirSync(new URL('../src/screens', import.meta.url))
    .filter((name) => name.endsWith('.jsx'))
    .map((name) => `src/screens/${name}`)
    .filter((path) => read(path).includes('<SessionCounter'))

  assert.ok(screens.length >= 20, `対象画面が少なすぎる（${screens.length}）`)
  for (const path of screens) {
    const counter = /<SessionCounter[\s\S]*?\/>/.exec(read(path))?.[0] ?? ''
    assert.match(counter, /max=\{/, `${path} が在庫数を渡していない`)
  }
})

test('語源カードも20枚を超えて出せる（1回の問題数の上限をそろえる）', () => {
  assert.equal(buildEtymologyDeck(ETYMOLOGY_PACKS, {}, { size: 30 }).length, 30)
  assert.equal(buildEtymologyDeck(ETYMOLOGY_PACKS, {}, { size: 200 }).length, 200)
  const all = buildEtymologyDeck(ETYMOLOGY_PACKS, {}, { size: Infinity })
  assert.ok(all.length > 200, `全部でも${all.length}枚しか出ない`)
  for (const path of ['src/screens/EtymologyStudy.jsx', 'src/screens/EtymologyQuiz.jsx']) {
    assert.doesNotMatch(read(path), /useSessionSize\(20\)/, `${path} に20の固定上限が残る`)
  }
})
