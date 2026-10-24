// 続き表示のボタンを押さなくても、一覧の下までスクロールしたら続きを足す（依頼台帳 requests/2026-10-24-load-more-on-scroll.json）。
// 2026-10-24 利用者: 次の⚪︎枚を押さなくても、下までスクロールしたら追加で表示できるようにならないか？
// 続き表示のボタンはすべて共通の部品 LoadMoreButton を使う。部品を通らない続き表示のボタンを足すと、ここで止まる。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SRC = new URL('../src/', import.meta.url).pathname
const jsxFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = join(dir, entry.name)
  if (entry.isDirectory()) return jsxFiles(path)
  return entry.name.endsWith('.jsx') ? [path] : []
})

// 続きを足して表示するボタンの文言。
const MORE_LABEL = /次の.{0,60}枚を表示|さらに.{0,120}を表示|さらに表示|続きを表示|もっと見る/
// 2026-10-24 時点の続き表示ボタン（依頼の母集団）。
const EXPECTED = [
  'components/LearningAnalytics.jsx',
  'components/LearningContentCatalog.jsx',
  'components/NormalLearningRecordList.jsx',
  'screens/CustomWords.jsx',
  'screens/MyList.jsx',
  'screens/Roots.jsx',
  'screens/VocabDecks.jsx',
  'screens/VocabSearch.jsx',
]

test('続き表示のボタンはすべて LoadMoreButton を通る', () => {
  const found = []
  const bare = []
  for (const path of jsxFiles(SRC)) {
    const lines = readFileSync(path, 'utf8').split('\n')
    lines.forEach((line, index) => {
      if (/^\s*(\/\/|\*)/.test(line) || !MORE_LABEL.test(line)) return
      const rel = path.slice(SRC.length)
      const opener = lines.slice(Math.max(0, index - 12), index).reverse().find((text) => /<(LoadMoreButton|Button|button)\b/.test(text))
      if (opener?.includes('<LoadMoreButton')) found.push(rel)
      else bare.push(`${rel}:${index + 1}`)
    })
  }
  assert.deepEqual(bare, [], '部品を通らない続き表示のボタン')
  assert.deepEqual([...new Set(found)].sort(), EXPECTED)
})

test('LoadMoreButton は見えたら押さなくても足し、ボタンも残す', () => {
  const source = readFileSync(join(SRC, 'components/LoadMoreButton.jsx'), 'utf8')
  assert.match(source, /new IntersectionObserver/)
  assert.match(source, /onClick=\{\(\) => onMoreRef\.current\(\)\}/)
  assert.match(source, /\}, \[count\]\)/, '並べる数が変わるたびに見張り直す')
})
