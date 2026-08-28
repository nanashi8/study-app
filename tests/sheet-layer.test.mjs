import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('../', import.meta.url))
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

function sourceFiles(relativeDir) {
  const files = []
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const absolute = join(dir, entry.name)
      if (entry.isDirectory()) visit(absolute)
      else if (/\.jsx?$/.test(entry.name)) {
        files.push({ path: absolute.slice(repoRoot.length), source: readFileSync(absolute, 'utf8') })
      }
    }
  }
  visit(join(repoRoot, relativeDir))
  return files
}

// シートは画面上部のバー（backdrop-blur で重なりの文脈を作る）の中から開かれる。
// 呼び出し位置に描くと、その文脈の外にある操作フッターの下へ潜り込んでしまう。
test('ボトムシートは body 直下へ描き、画面のバーに隠れない', () => {
  const sheet = read('src/components/Sheet.jsx')
  assert.match(sheet, /import \{ createPortal \} from 'react-dom'/)
  assert.match(sheet, /createPortal\(layer, document\.body\)/)
  assert.match(sheet, /app-viewport-overlay fixed inset-x-0 z-\[70\]/)
})

// シート層(70)より手前に出せるのは、全画面をふさぐ物語ダイアログ(80)だけ。
// 画面内の固定バーがこれを越えると、また同じ潜り込みが起きる。
test('画面内の固定バーはシート層より前に出ない', () => {
  const offenders = []
  for (const { path, source } of sourceFiles('src')) {
    if (path === 'src/components/Sheet.jsx' || path === 'src/screens/CharacterTalk.jsx') continue
    for (const match of source.matchAll(/\bz-(?:\[(\d+)\]|(\d+))\b/g)) {
      const level = Number(match[1] ?? match[2])
      if (level >= 70) offenders.push(`${path}: z-${level}`)
    }
  }
  assert.deepEqual(offenders, [])
})
