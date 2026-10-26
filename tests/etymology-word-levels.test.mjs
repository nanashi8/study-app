// 語源カードに出てくる単語カードに、英検の級の印を出す（requests/2026-10-26-etymology-word-levels.json）。
// 紐づく単語の行（カード詳細・語根の一覧）と、語源の暗記カードの裏の「この形を使う語」が対象。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { ETYMOLOGY_PACKS, getWord } from '../src/data/vocab.js'
import { LEVELS } from '../src/data/levels.js'

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const LEVEL_LABEL = new Map(LEVELS.map((level) => [level.id, level.label]))

let vite
let screens

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  screens = {
    store: await vite.ssrLoadModule('/src/store/useStore.js'),
    pack: await vite.ssrLoadModule('/src/screens/EtymologyPack.jsx'),
    root: await vite.ssrLoadModule('/src/screens/RootDetail.jsx'),
  }
})

after(async () => {
  await vite?.close()
})

test('all-linked-words-have-level: 紐づく単語と代表の語はすべて7つの級のどれかを持つ', () => {
  assert.equal(ETYMOLOGY_PACKS.length, 340)
  const ids = new Set(ETYMOLOGY_PACKS.flatMap((pack) => pack.studyIds))
  const examples = new Set(ETYMOLOGY_PACKS.flatMap((pack) => pack.exampleIds))
  assert.equal(ids.size, 4026)
  assert.equal(examples.size, 1173)
  const missing = [...new Set([...ids, ...examples])]
    .filter((id) => !LEVEL_LABEL.has(getWord(id)?.level))
  assert.deepEqual(missing, [])
})

// 画面に並んだ行ごとに、その行の中の級の印の文字を取り出す。
const rowLevels = (html, attr) => {
  const rows = html.split('data-learning-record-item="').slice(1)
  return rows.map((chunk) => {
    const id = chunk.slice(0, chunk.indexOf('"'))
    const badge = chunk.match(new RegExp(`${attr}="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>([^<]*)<`))
    return { id, label: badge?.[1] ?? null }
  })
}

// サーバー描画では、zustand はストアの今の値ではなく初期値（getInitialState）を読む。初期値を一時的に差し替えて描く。
const renderScreen = (Screen, params) => {
  const initial = screens.store.useStore.getInitialState()
  const saved = initial.params
  initial.params = params
  try {
    return renderToStaticMarkup(React.createElement(Screen))
  } finally {
    initial.params = saved
  }
}

test('level-badge-on-every-word-card: カード詳細の全340枚で、行ごとに級の印を出す', () => {
  let rows = 0
  for (const pack of ETYMOLOGY_PACKS) {
    const html = renderScreen(screens.pack.EtymologyPackScreen, { packId: pack.id })
    const shown = rowLevels(html, 'data-etymology-pack-word-level')
    assert.ok(shown.length > 0, `${pack.id}: 行がある`)
    assert.equal(shown.length, Math.min(pack.studyIds.length, 80), `${pack.id}: 最初の表示の行の数`)
    for (const row of shown) {
      assert.equal(row.label, LEVEL_LABEL.get(getWord(row.id).level), `${pack.id}:${row.id}`)
    }
    rows += shown.length
  }
  assert.ok(rows > 3000)
})

test('level-badge-on-every-word-card: 語根の一覧の全カードで、行ごとに級の印を出す', () => {
  const rootCards = ETYMOLOGY_PACKS.filter((pack) => pack.id === `root:${pack.rootId}`)
  assert.ok(rootCards.length > 0)
  for (const card of rootCards) {
    const html = renderScreen(screens.root.RootDetailScreen, { rootId: card.rootId })
    const shown = rowLevels(html, 'data-root-detail-word-level')
    assert.equal(shown.length, Math.min(card.studyIds.length, 80), `${card.id}: 最初の表示の行の数`)
    for (const row of shown) {
      assert.equal(row.label, LEVEL_LABEL.get(getWord(row.id).level), `${card.id}:${row.id}`)
    }
  }
})

test('level-badge-on-every-word-card: 3画面とも共通の部品の級の印を使う', () => {
  const pack = read('src/screens/EtymologyPack.jsx')
  const root = read('src/screens/RootDetail.jsx')
  const study = read('src/screens/EtymologyStudy.jsx')
  const summary = read('src/screens/ReadingSummary.jsx')
  for (const source of [pack, root, study, summary]) {
    assert.match(source, /import \{ WordLevelBadge \} from '\.\.\/components\/WordLevelBadge\.jsx'/)
    assert.doesNotMatch(source, /function WordLevelBadge/)
  }
  assert.match(pack, /badgeFor=\{\(item\) => <WordLevelBadge word=\{item\}/)
  assert.match(root, /badgeFor=\{\(item\) => <WordLevelBadge word=\{item\}/)
  // 暗記カードの裏の「この形を使う語」は、代表の語の1語ずつに印を出す。
  const examples = study.slice(study.indexOf('{examples.map((word) => ('), study.indexOf('</ul>', study.indexOf('{examples.map((word) => (')))
  assert.match(examples, /<WordLevelBadge word=\{word\} marks=\{\{ 'data-etymology-study-word-level': word\.id \}\} \/>/)
  const badge = read('src/components/WordLevelBadge.jsx')
  assert.match(badge, /getLevel\(word\.level\)/)
  assert.match(badge, /\{level\.label\}/)
})
