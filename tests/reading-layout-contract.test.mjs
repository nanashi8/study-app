import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

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
  const literature = read('../src/screens/LiteratureReader.jsx')
  const sheet = read('../src/components/Sheet.jsx')
  const combined = `${reader}\n${literature}`

  assert.doesNotMatch(combined, /英文・構文ラベル付き|この文で使う読解ルール/)
  assert.match(reader, /文の要素/)
  assert.match(reader, /下線の下にあるS・V・O・C・M/)
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
