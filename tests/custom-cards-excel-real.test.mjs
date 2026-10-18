// 本物の Excel で開いて保存し直した自作カードの CSV を読み戻す（依頼台帳 requests/2026-10-16-custom-cards-excel-io-audit.json）。
// 2026-10-18 利用者:「未確認を確認しなさい。」→ この Mac の Microsoft Excel 16.114 に、書き出した CSV を AppleScript で開かせ、
// 見えている値を読み、「CSV」（Mac の日本語）・「CSV UTF-8」・「Unicode テキスト」（UTF-16）で保存させた（scripts/checks/excel-roundtrip.mjs）。
// 確かめて分かったこと：Excel は開いた時点で 1-2→1月2日・007→7・1E5→1.00E+05・$100→¥100・(100)→-100・false→FALSE などに書きかえ、
// 「CSV」で保存すると発音記号・é・丸数字・絵文字・髙などが「_」になる。書き出しを ="…" の形にし、Shift_JIS の行は元のカードから戻すようにした。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  CUSTOM_CARD_TABLE_COLUMNS,
  customCardsCsvText,
  decodeTableFile,
  excelWouldConvert,
  parseCustomCardsTable,
} from '../src/lib/customCardsCsv.js'
import { excelRoundtripSource, TRICKY_VALUES } from '../scripts/checks/excel-roundtrip.mjs'

const fixture = (name) => readFileSync(new URL(`./fixtures/custom-cards-excel/${name}`, import.meta.url))
const SOURCE = excelRoundtripSource()
const ENTRIES = [...SOURCE.words, ...SOURCE.cards]
const comparable = ({ createdAt, updatedAt, category, ...rest }) => rest

function differences(parsed) {
  const byId = new Map([...parsed.library.words, ...parsed.library.cards].map((entry) => [entry.id, entry]))
  return ENTRIES
    .filter((entry) => JSON.stringify(comparable(entry)) !== JSON.stringify(comparable(byId.get(entry.id) ?? {})))
    .map((entry) => entry.id)
}

test('材料は今の書き出しで作ったもの（書き出しを変えたら scripts/checks/excel-roundtrip.mjs を Excel のある Mac で流し直す）', () => {
  assert.equal(fixture('export.csv').toString('utf8'), customCardsCsvText(SOURCE))
  assert.equal(ENTRIES.length, 53)
  const excel = JSON.parse(fixture('excel.json'))
  assert.equal(excel.app, 'Microsoft Excel for Mac')
})

test('Excel で開いたとき、どの欄も書き出した文字のまま見える（日付・数・通貨・真偽に書きかわらない）', () => {
  const display = JSON.parse(fixture('display.json'))
  const header = display[0]
  assert.deepEqual(header, CUSTOM_CARD_TABLE_COLUMNS.map((column) => column.header))
  const idColumn = header.length - 1
  const front = header.indexOf(CUSTOM_CARD_TABLE_COLUMNS.find((column) => column.key === 'front').header)
  const note = header.indexOf(CUSTOM_CARD_TABLE_COLUMNS.find((column) => column.key === 'note').header)
  const rows = new Map(display.slice(1).map((row) => [row[idColumn], row]))
  // 「'」で始まり、そのあとに = + - @ ' が続く文字は、「'」を1つ足して書き出すので、Excel ではその「'」が見える。
  const shownAs = (text) => (/^'['=+\-@]/u.test(text) ? `'${text}` : text).replace(/\r\n?/gu, '\n')
  const wrong = []
  for (const card of SOURCE.cards) {
    const row = rows.get(card.id)
    assert.ok(row, card.id)
    if (row[front].replace(/\r\n?/gu, '\n') !== shownAs(card.front)) wrong.push(`${card.id} 表 ${JSON.stringify(card.front)} → ${JSON.stringify(row[front])}`)
    if (row[note].replace(/\r\n?/gu, '\n') !== shownAs(card.note)) wrong.push(`${card.id} 解説 ${JSON.stringify(card.note)} → ${JSON.stringify(row[note])}`)
  }
  assert.deepEqual(wrong, [])
  // Excel が書きかえると確かめた値は、どれも ="…" の形で書き出す。
  for (const value of ['1-2', '3/4', '1/2', '2026-10-18', 'Mar-5', 'May 5', '007', '0123', '1E5', '1e-3', '12345678901234567890',
    '3.14159265358979323846', '$100', '(100)', 'false', '1.0', '1.50', '100.', '.5']) {
    assert.ok(TRICKY_VALUES.includes(value), value)
    assert.ok(excelWouldConvert(value), value)
  }
})

test('「CSV UTF-8」と「Unicode テキスト」（UTF-16）で保存したファイルは、53枚すべてが元のカードと同じになる', () => {
  for (const [name, encoding] of [['utf8-csv.csv', 'utf-8'], ['unicode-text.txt', 'utf-16le']]) {
    const decoded = decodeTableFile(fixture(name))
    assert.equal(decoded.encoding, encoding, name)
    for (const library of [SOURCE, null]) {
      const parsed = parseCustomCardsTable(decoded.text, { encoding: decoded.encoding, library, now: 1 })
      assert.deepEqual(parsed.errors, [], name)
      assert.deepEqual(parsed.notices, [], name)
      assert.deepEqual(differences(parsed), [], `${name}（元のカード${library ? 'あり' : 'なし'}）`)
      assert.deepEqual(
        parsed.library.categories.map((category) => [category.title, category.subject, category.template]).sort(),
        [['2学期 中間', 'english', 'english'], ['空', 'math', 'qa']],
      )
    }
  }
})

for (const name of ['mac-csv.csv', 'tab-text.txt']) test(`「${name === 'mac-csv.csv' ? 'CSV' : 'タブ区切りテキスト'}」（Mac の日本語）で保存したファイルは、知らせを出し、同じ ID の行は「_」に変わった字を元のカードから戻す`, () => {
  const decoded = decodeTableFile(fixture(name))
  assert.equal(decoded.encoding, 'mac-japanese')
  const restored = parseCustomCardsTable(decoded.text, { encoding: decoded.encoding, library: SOURCE, now: 1 })
  assert.equal(restored.notices.length, 1)
  assert.match(restored.notices[0], /CSV UTF-8（コンマ区切り）/u)
  assert.deepEqual(restored.errors, [])
  assert.deepEqual(differences(restored), [], '元のカードがあれば53枚すべて戻る')
  assert.ok(restored.warnings.some((warning) => /元のカードの字に戻しました/u.test(warning.message)))
  // 元のカードがない端末で読むと、Shift_JIS にない字の行だけが変わる（知らせで確かめるよう伝える）。
  const fresh = parseCustomCardsTable(decoded.text, { encoding: decoded.encoding, library: null, now: 1 })
  assert.equal(fresh.notices.length, 1)
  assert.deepEqual(differences(fresh).sort(), ['c-x41', 'c-x42', 'c-x43', 'c-x44', 'c-x45', 'c-x46', 'c-x47', 'c-x48', 'c-x50', 'u-w1'].sort())
  // 「\」（0x80）と「¥」（0x5C）は Mac の日本語のバイトで読むので、区切りの「\」と ¥100 は崩れない。
  const byId = new Map([...fresh.library.words, ...fresh.library.cards].map((entry) => [entry.id, entry]))
  assert.equal(byId.get('c-x16').front, '¥100')
  assert.deepEqual(byId.get('u-w1').phrases, SOURCE.words[0].phrases)
})

test('Windows の Excel の「CSV」（Shift_JIS。ない字は「?」）でも、同じ ID の行は元のカードから戻す（バイトを組み立てて確かめる）', () => {
  // Shift_JIS のバイト表（デコーダから逆に引く）。ない字は Windows の Excel と同じく「?」にする。
  const decoder = new TextDecoder('shift_jis')
  const table = new Map()
  for (const byte of [0x09, 0x0a, 0x0d]) table.set(String.fromCharCode(byte), [byte])
  for (let byte = 0x20; byte < 0x7f; byte += 1) table.set(String.fromCharCode(byte), [byte])
  for (let lead = 0x81; lead <= 0xfc; lead += 1) {
    if (lead > 0x9f && lead < 0xe0) continue
    for (let trail = 0x40; trail <= 0xfc; trail += 1) {
      const ch = decoder.decode(new Uint8Array([lead, trail]))
      if (ch.length === 1 && ch !== '�' && !table.has(ch)) table.set(ch, [lead, trail])
    }
  }
  const text = fixture('utf8-csv.csv').toString('utf8').replace(/^﻿/u, '')
  const bytes = []
  for (let index = 0; index < text.length; index += 1) bytes.push(...(table.get(text[index]) ?? [0x3f]))
  const decoded = decodeTableFile(new Uint8Array(bytes))
  assert.equal(decoded.encoding, 'shift_jis')
  const restored = parseCustomCardsTable(decoded.text, { encoding: decoded.encoding, library: SOURCE, now: 1 })
  assert.equal(restored.notices.length, 1)
  assert.deepEqual(differences(restored), [])
})
