// 「1回の問題数」の選択肢の回帰テスト。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { buildEtymologyDeck } from '../src/lib/etymologyProgress.js'
import { ETYMOLOGY_PACKS } from '../src/data/vocab.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('選べる問題数は 5・10・20・30・50・100・200 と「全部」', () => {
  const source = read('src/components/SessionSize.jsx')
  const options = /SESSION_SIZE_OPTIONS = \[([^\]]+)\]/.exec(source)?.[1]
  assert.ok(options, '選択肢の一覧が見つからない')
  assert.deepEqual(
    options.split(',').map((value) => Number(value.trim())),
    [5, 10, 20, 30, 50, 100, 200],
  )
  // 並びの最後は必ず「全部」。
  assert.match(source, /size === SESSION_SIZE_ALL \? '全部'/)
  assert.match(source, /SESSION_SIZE_OPTIONS\.filter\(\(size\) => !pool \|\| size < pool\),\s*\n\s*SESSION_SIZE_ALL,/)
})

test('設定メニューの「1回の問題数」も同じ並びを使う', () => {
  const panel = read('src/components/SpeechSettings.jsx')
  assert.match(panel, /import \{ SESSION_SIZE_ALL, SESSION_SIZE_OPTIONS \}/)
  assert.match(panel, /const SESSION_SIZES = \[\.\.\.SESSION_SIZE_OPTIONS, SESSION_SIZE_ALL\]/)
  assert.doesNotMatch(panel, /\[5, 10, 15, 20\]/)
  assert.match(panel, /SESSION_SIZE_ALL \? '全部'/)
})

test('「全部」を選ぶと、その教材の在庫すべてで組み直す', () => {
  const sizes = read('src/components/SessionSize.jsx')
  // 保存は0（全部）。画面ごとの在庫数へ読み替えてから使う。
  assert.match(sizes, /if \(size === SESSION_SIZE_ALL\) return max/)
  assert.match(sizes, /onResize\?\.\(size === SESSION_SIZE_ALL \? \(pool \?\? SESSION_SIZE_ALL\) : size\)/)
  // 在庫数を数えてから設定を読む（あとに読むと「全部」が10に潰れる）
  for (const name of ['VocabStudy', 'VocabQuiz', 'PhraseStudy', 'PhraseQuiz', 'DictationPlay', 'GrammarQuiz', 'ListeningQuiz', 'EtymologyStudy', 'EtymologyQuiz']) {
    const source = read(`src/screens/${name}.jsx`)
    assert.doesNotMatch(source, /useSessionSize\(\)/, `${name} が在庫数を渡していない`)
    assert.ok(
      source.indexOf('const [poolSize]') < source.indexOf('useSessionSize('),
      `${name} は在庫数を数えてから設定を読む`,
    )
  }
})

test('学習マップの「一度に解く問題数」も同じ並びを使う', () => {
  const map = read('src/screens/EnglishMap.jsx')
  assert.match(map, /import \{ SESSION_SIZE_ALL, SESSION_SIZE_OPTIONS \}/)
  assert.match(map, /\[\.\.\.SESSION_SIZE_OPTIONS, SESSION_SIZE_ALL\]/)
  assert.match(map, /一度に解く問題数/)
  assert.match(map, /'全部を解読'/)
  assert.doesNotMatch(map, /\[10, 20, 100\]/)
  // 「全部」は0で渡し、デッキ作成側が在庫すべてを出す。
  const sizes = read('src/components/SessionSize.jsx')
  assert.match(sizes, /export const SESSION_SIZE_ALL = 0/)
  const session = read('src/lib/session.js')
  assert.ok(session.includes('return size ? pool.slice(0, size) : pool'))
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
