// 出典の表示を削除した（依頼台帳 requests/2026-11-04-remove-credits-page.json）。
// 利用者「出典の表示を削除しなさい。著作者の許諾なく使用していると勘違いしないようにしなさい。」
//   no-credits-on-screen            … 出典の画面・データ・メニューの行がなく、src/ に出典の画面へ行く道が残らない。
//   license-notices-kept-off-screen … 利用条件で著作権表示が要る3件は、画面に出さず public/third-party-notices.txt に条件どおり載せる。
//   figure-sources-still-recorded   … 出典ページに載っていた資料は、管理用の台帳 docs/audits/subject-data-sources.json に全件残す。
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { APP_MENU_ITEMS, APP_MENU_SECTIONS } from '../src/lib/appMenu.js'

const ROOT = new URL('../', import.meta.url)
const read = (path) => readFileSync(new URL(path, ROOT), 'utf8')
const sourceFiles = (dir) => readdirSync(new URL(dir, ROOT)).flatMap((name) => {
  const path = `${dir}/${name}`
  return statSync(new URL(path, ROOT)).isDirectory() ? sourceFiles(path) : [path]
})

test('出典の画面・データ・メニューの行がない', () => {
  assert.equal(existsSync(new URL('src/screens/Credits.jsx', ROOT)), false)
  assert.equal(existsSync(new URL('src/data/credits.js', ROOT)), false)
  assert.ok(!APP_MENU_SECTIONS.some((section) => section.id === 'about'))
  assert.ok(!APP_MENU_ITEMS.some((item) => item.screen === 'credits' || /出典/.test(`${item.label}${item.description ?? ''}`)))
  assert.doesNotMatch(read('src/App.jsx'), /Credits|credits/)
  // src/ のどこにも、出典の画面・データを使う所や、画面の出典のページ（data-credits-page）が残らない。
  const left = sourceFiles('src').filter((path) => /\.(jsx?|mjs)$/.test(path))
    .filter((path) => /credits\.js|Credits\.jsx|CREDIT_SECTIONS|CREDIT_IDS|data-credits?|'credits'|screen: 'credits'/.test(read(path)))
  assert.deepEqual(left, [])
})

test('利用条件で著作権表示が要る3件は、公開版に入る権利表示のファイルに載せ、画面からはつながない', () => {
  const notices = read('public/third-party-notices.txt')
  // SCOWL：著作権表示と許諾の文をすべての写しと付属の文書に。
  assert.ok(notices.includes(read('node_modules/wordlist-english/Copyright')))
  // PaddleOCR のモデル：Apache-2.0 の写しと著作権表示。
  assert.match(notices, /Copyright \(c\) PaddlePaddle Authors/)
  assert.match(notices, /Apache License\s+Version 2\.0, January 2004/)
  assert.match(notices, /END OF TERMS AND CONDITIONS/)
  // 世界銀行の World Development Indicators：CC BY 4.0 の出どころの表示。
  assert.match(notices, /The World Bank, World Development Indicators[\s\S]*CC BY 4\.0/)
  // 画面（src/）からはこのファイルへつながない。
  const linked = sourceFiles('src').filter((path) => read(path).includes('third-party-notices'))
  assert.deepEqual(linked, [])
  // 公開版に入る（git が追う public/ のファイル）。
  assert.equal(execFileSync('git', ['ls-files', 'public/third-party-notices.txt'], { cwd: ROOT, encoding: 'utf8' }).trim(), 'public/third-party-notices.txt')
})

test('出典ページに載っていた資料は、管理用の台帳に全件残る', () => {
  const { sections } = JSON.parse(read('docs/audits/subject-data-sources.json'))
  const ids = sections.flatMap((section) => section.items.map((item) => item.id))
  assert.equal(new Set(ids).size, ids.length)
  // 削除の前の出典ページは 15 の区切り・36 件。
  assert.equal(sections.length, 15)
  assert.equal(ids.length, 36)
  for (const id of ['tosho-social', 'tosho-science', 'scowl-wordlist', 'paddleocr-models', 'natural-earth', 'world-bank-wdi']) assert.ok(ids.includes(id), id)
})
