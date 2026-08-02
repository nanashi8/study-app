import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

async function jsxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory)
    if (entry.isDirectory()) return jsxFiles(url)
    return entry.name.endsWith('.jsx') ? [url] : []
  }))
  return nested.flat()
}

test('全62ルートは共通の可読性レイヤーと簡潔な共通ヘッダーを通る', async () => {
  const [app, shell] = await Promise.all([
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/AppShell.jsx', import.meta.url), 'utf8'),
  ])
  const screenMap = app.slice(app.indexOf('const SCREENS = {'), app.indexOf('// ボトムナビ'))
  const routeCount = (screenMap.match(/^  [A-Za-z][A-Za-z0-9]*:/gm) ?? []).length

  assert.equal(routeCount, 62)
  assert.match(app, /<AppShell nav=/)
  assert.match(shell, /study-app-surface/)
  assert.match(shell, /study-app-content/)
  assert.match(shell, /min-h-16/)
  assert.match(shell, /text-xl font-extrabold/)
  assert.doesNotMatch(shell, /linear-gradient\(to bottom/)
})

test('画面・共通部品の6〜11px指定は全件を共通拡大規則で受ける', async () => {
  const [css, screenFiles, componentFiles] = await Promise.all([
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
    jsxFiles(new URL('../src/screens/', import.meta.url)),
    jsxFiles(new URL('../src/components/', import.meta.url)),
  ])
  const sources = await Promise.all([...screenFiles, ...componentFiles].map((url) => readFile(url, 'utf8')))
  const sizes = []
  for (const source of sources) {
    for (const match of source.matchAll(/text-\[(\d+)px\]/g)) {
      const size = Number(match[1])
      if (size <= 11) sizes.push(size)
    }
  }
  const uniqueSizes = [...new Set(sizes)].sort((a, b) => a - b)

  assert.ok(sizes.length >= 700, `audited ${sizes.length} compact labels`)
  assert.deepEqual(uniqueSizes, [6, 7, 8, 9, 10, 11])
  for (const size of uniqueSizes) {
    assert.equal(css.includes(`.text-\\[${size}px\\]`), true, `${size}px override`)
  }
  assert.match(css, /\.study-app-surface \.text-xs/)
  assert.match(css, /\.study-app-surface \.text-sm/)
  assert.match(css, /font-size: 0\.8125rem/)
  assert.match(css, /font-size: 0\.9375rem/)
})

test('共通カード・ボタン・下部ナビは装飾を減らし文字優先にする', async () => {
  const [ui, nav, css] = await Promise.all([
    readFile(new URL('../src/components/ui.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/BottomNav.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
  ])

  assert.match(ui, /'bg-brand-600 text-white shadow-sm active:bg-brand-700'/)
  assert.match(ui, /rounded-2xl border border-slate-200\/70 bg-white/)
  assert.doesNotMatch(ui.slice(ui.indexOf('const VARIANTS'), ui.indexOf('const SIZES')), /bg-gradient-to-b/)
  assert.match(nav, /bg-white pb-/)
  assert.match(nav, /text-xs/)
  assert.doesNotMatch(nav, /scale-110/)
  assert.match(css, /--shadow-card: 0 2px 8px -5px/)
})

test('ホームは主要6モードを先に出し、残り6モードを一つの開閉欄へまとめる', async () => {
  const home = await readFile(new URL('../src/screens/Home.jsx', import.meta.url), 'utf8')
  const primary = home.match(/data-home-mode-group="primary">([\s\S]*?)<\/div>\s*<details/)?.[1] ?? ''
  const secondary = home.match(/data-home-mode-group="secondary">([\s\S]*?)<\/div>\s*<\/details>/)?.[1] ?? ''

  assert.equal((primary.match(/<ModeTile/g) ?? []).length, 6)
  assert.equal((secondary.match(/<ModeTile/g) ?? []).length, 6)
  assert.match(home, /home-more-modes/)
  assert.match(home, /ほかの学習メニュー/)
  assert.doesNotMatch(home, /hero\.xpToNext|hero\.progress/)
})

test('五芒星マップは選択中の地点名だけを表示し、ボタン名は保持する', async () => {
  const [css, map] = await Promise.all([
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8'),
  ])

  assert.match(css, /\.school-barrier-marker-label\s*{\s*display: none;/)
  assert.match(css, /\.school-barrier-marker-selected \.school-barrier-marker-label/)
  assert.match(map, /aria-label=\{`\$\{location\.name\}・\$\{location\.role\}`\}/)
})

test('ゲーム入口は開始操作を詳細設定より先に見せ、低い画面でも4択を保つ', async () => {
  const [css, map, quiz] = await Promise.all([
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/VocabQuiz.jsx', import.meta.url), 'utf8'),
  ])

  assert.match(map, /school-battle-context/)
  assert.match(map, /school-battle-start order-4/)
  assert.match(map, /school-battle-options order-5/)
  assert.match(quiz, /battle-command-grid mt-2 grid grid-cols-2/)
  assert.match(quiz, /\{options\.map\(/)
  assert.match(quiz, /<UnknownChoiceButton/)
  assert.match(css, /@media \(max-height: 640px\)[\s\S]*height: 72px;[\s\S]*grid-auto-rows: 58px;/)
})
