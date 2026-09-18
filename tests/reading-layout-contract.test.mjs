import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { placedScrollTop } from '../src/lib/screenScroll.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

test('読解チェックは長文本体の直下・固定フッターの前にあり、回答下書きを保持する', () => {
  const reader = read('../src/screens/Reader.jsx')
  const readingCheck = read('../src/components/ReadingComprehensionCheck.jsx')
  const summary = read('../src/screens/ReadingSummary.jsx')

  const bodyIndex = reader.indexOf('{/* 本文 */}')
  const checkIndex = reader.indexOf('<ReadingComprehensionCheck')
  const footerIndex = reader.indexOf('{/* フッター */}')
  assert.ok(bodyIndex >= 0 && bodyIndex < checkIndex && checkIndex < footerIndex)
  assert.match(readingCheck, /sessionStorage\.setItem/)
  assert.match(readingCheck, /data-reading-check-under-passage/)
  assert.match(reader, /readingCheckRef\.current\?\.scrollIntoView/)
  assert.match(reader, /readingChecked \? '単語まとめへ' : '読解チェックへ'/)
  assert.doesNotMatch(summary, /getReadingQuestions|読解チェック/)
})

test('長文の用語・文要素表示・シート階層を全画面で統一する', () => {
  const reader = read('../src/screens/Reader.jsx')
  const detail = read('../src/components/ReadingSentenceDetail.jsx')
  const literature = read('../src/screens/LiteratureReader.jsx')
  const sheet = read('../src/components/Sheet.jsx')
  const combined = `${reader}\n${detail}\n${literature}`

  assert.doesNotMatch(combined, /英文・構文ラベル付き|この文で使う読解ルール/)
  assert.match(detail, /文の要素/)
  assert.match(detail, /下線の下にあるS・V・O・C・M/)
  assert.match(combined, /読解ルール/)
  assert.match(sheet, /z-\[70\]/)
  assert.match(sheet, /data-sheet-layer/)
})

test('一文解説は前後移動をスクロール領域の外へ常設し、切替時に先頭へ戻す', () => {
  const reader = read('../src/screens/Reader.jsx')
  const sheet = read('../src/components/Sheet.jsx')

  assert.match(sheet, /data-sheet-scroll-area[\s\S]*\{children\}[\s\S]*data-sheet-footer/)
  assert.match(sheet, /pb-\[calc\(0\.75rem\+var\(--app-bottom-clearance\)\)\]/)
  assert.match(reader, /scrollAreaRef=\{sentenceSheetScrollRef\}/)
  assert.match(reader, /data-reading-sentence-navigation/)
  assert.match(reader, /aria-label="文の移動"/)
  assert.match(reader, /sentenceSheetScrollRef\.current\.scrollTop = 0/)
  assert.match(reader, /← 前の文/)
  assert.match(reader, /次の文 →/)
})

test('長文一覧では準備を任意にし、各本文へ直接進める', () => {
  const list = read('../src/screens/ReadingList.jsx')

  assert.match(list, /準備を飛ばして本文からも始められます/)
  assert.match(list, /data-reading-start="prep"/)
  assert.match(list, /準備して読む/)
  assert.match(list, /navigate\('readingPrep', \{ passageId: p\.id \}\)/)
  assert.match(list, /data-reading-start="direct"/)
  assert.match(list, /本文から読む/)
  assert.match(list, /navigate\('reader', \{ passageId: p\.id \}\)/)
})

test('一覧へ戻ったら、押した欄を離れたときと同じ高さに置き、見出しの下や画面の外へは出さない', () => {
  // 上に張り付く見出しが67px、見えている高さが751px、欄の高さが247px。
  const base = { itemOffset: 4248, itemHeight: 247, viewHeight: 751, coveredTop: 67 }
  // 離れたときの高さをそのまま戻す。
  assert.equal(placedScrollTop({ ...base, savedTop: 239 }), 4009)
  // 上が見出しに隠れていた欄は、見出しのすぐ下へ下ろす。
  assert.equal(placedScrollTop({ ...base, savedTop: -130 }), 4248 - 79)
  // 下がはみ出していた欄は、欄の全体が見える所まで上げる。
  assert.equal(placedScrollTop({ ...base, savedTop: 515 }), 4248 - 492)
  // 高さが残っていなければ、見出しのすぐ下に置く。
  assert.equal(placedScrollTop({ ...base, savedTop: null }), 4248 - 79)
  // 画面より高い欄は、見出しのすぐ下にそろえる。
  assert.equal(placedScrollTop({ ...base, itemHeight: 900, savedTop: 300 }), 4248 - 79)
  // 一覧の先頭の欄は、スクロールを0より上にしない。
  assert.equal(placedScrollTop({ ...base, itemOffset: 67, savedTop: 27 }), 0)
})

test('長文一覧と場面の束は、長文や読解ルールから戻ると押した欄の位置に戻す', () => {
  const list = read('../src/screens/ReadingList.jsx')
  const bundles = read('../src/screens/SceneBundles.jsx')

  // 一覧のどの欄から別の画面へ移るときも、移る前に欄の高さを残す。
  for (const row of ['"readingRules"', '"sceneBundles"', '{p.id}']) {
    assert.ok(list.includes(`data-reading-list-row=${row}`), row)
  }
  for (const [row, destination] of [
    ["'readingRules'", "navigate('readingRules')"],
    ["'sceneBundles'", "navigate('sceneBundles')"],
    ['p.id', "navigate('readingPrep', { passageId: p.id })"],
    ['p.id', "navigate('reader', { passageId: p.id })"],
  ]) {
    assert.match(list, new RegExp(`keepListPlace\\(${escapeRegExp(row)}\\)\\s*${escapeRegExp(destination)}`))
  }
  // 欄を足しても残し忘れないよう、画面を移る呼び出しの数と高さを残す呼び出しの数をそろえる。
  assert.equal((list.match(/navigate\(/g) ?? []).length, (list.match(/keepListPlace\(/g) ?? []).length)
  assert.match(list, /restoreListItemPlace\(screenRef\.current, 'data-reading-list-row', params\.listPlace\)/)
  assert.match(list, /if \(params\.listPlace\) replaceParams\(\{ \.\.\.params, listPlace: undefined \}\)/)

  assert.match(bundles, /restoreListItemPlace\(screenRef\.current, 'data-scene-bundle-passage', params\.listPlace\)/)
  // 場面の束は戻り先（returnTo）と画面の履歴の両方に高さを入れる。準備画面の暗記のように戻り先を引き継がない画面を経ても戻れる。
  assert.match(bundles, /replaceParams\(\{ \.\.\.params, levelId, listPlace \}\)/)
  assert.match(bundles, /params: \{ levelId, listPlace, \.\.\.\(bundleId \? \{ bundleId \} : \{\}\) \}/)
})
