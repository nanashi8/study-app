// 本物の Excel（Mac の Microsoft Excel）で、自作カードの書き出し（CSV）を開いて保存し直し、読み戻せるかを確かめる材料を作る。
// 依頼台帳 requests/2026-10-16-custom-cards-excel-io-audit.json の excel-real-roundtrip・excel-real-encodings。
//
// 使い方（Microsoft Excel のある Mac で）: node scripts/checks/excel-roundtrip.mjs
//   1. Excel が日付・数・通貨などに書きかえる値と、Shift_JIS にない字を入れたカードを書き出す（tests/fixtures/custom-cards-excel/export.csv）
//   2. AppleScript で Excel に開かせ、見えている値（display.json）を読み、4つの形で保存させる
//      mac-csv.csv（「CSV」＝Mac の日本語）・utf8-csv.csv（「CSV UTF-8」）・unicode-text.txt（「Unicode テキスト」＝UTF-16）・
//      tab-text.txt（「タブ区切りテキスト」＝Mac の日本語。AppleScript の名前つきの形はエラーになるので番号 -4158・62・42 で指定する）
//   3. tests/custom-cards-excel-real.test.mjs が、この材料を読み戻して元のカードと比べる
// 書き出しの形を変えたら、これを流し直して材料を作り直す（テストが export.csv と今の書き出しの食い違いで止める）。
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { customCardsCsvText } from '../../src/lib/customCardsCsv.js'
import { normalizeCustomCard, normalizeCustomCategories } from '../../src/lib/customCards.js'
import { normalizeCustomWord } from '../../src/lib/customWords.js'

const NOW = 1_800_000_000_000
const FIXTURES = fileURLToPath(new URL('../../tests/fixtures/custom-cards-excel/', import.meta.url))

// Excel が開くときに書きかえそうな値・区切りや括弧・Shift_JIS にない字を1つずつ、その他のカードの「表」に入れる。
export const TRICKY_VALUES = Object.freeze([
  '1-2', '3/4', '1/2', '2026-10-18', '10月18日', 'Mar-5', 'May 5', '007', '0123', '1E5', '1e-3', '12345678901234567890',
  '3.14159265358979323846', '1,234', '50%', '$100', '¥100', '12:30', '9:00 AM', '1 1/2', '(100)', '-5', '+81', '=1+1', '@user',
  "'quoted", "'-s", 'TRUE', 'false', '#N/A', '#DIV/0!', '1.0', '1.50', '100.', '.5', ' 前後の空白 ', 'タブ\tいり', '改行\nいり',
  '"引用"', 'a,b', 'a;b', 'ˈpɑːpjələr', '①②③', '髙﨑', '𠮷野家', '🙂', 'é', 'ß', '〜～', '－', '—',
])

export function excelRoundtripSource() {
  const cards = TRICKY_VALUES.map((front, index) => normalizeCustomCard({
    id: `c-x${index}`, template: 'other', category: 'subject:social', front, back: `答え${index}`, note: index % 2 ? `解説 ${front}` : '', createdAt: index,
  }, { now: NOW }))
  const categories = normalizeCustomCategories([
    { id: 'cat-1', title: '2学期 中間', subject: 'english', template: 'english', createdAt: 1, updatedAt: 1 },
    { id: 'cat-2', title: '空', subject: 'math', template: 'qa', createdAt: 2, updatedAt: 2 },
  ], { now: NOW })
  const words = [
    normalizeCustomWord({
      id: 'u-w1', word: 'popular', meanings: ['人気のある', '大衆の'], pos: '形', level: '4', field: '基本・日常', phonetic: '/ˈpɑːpjələr/',
      example: { en: 'It is "popular", isn\'t it?', ja: 'それは「人気」だ。' }, note: '-er がつく', category: 'cat-1',
      otherSenses: [{ pos: '名', meaning: '人気者（愛称）' }], synonyms: [{ w: 'famous', m: '有名な' }, { w: 'well-known', m: '' }],
      phrases: [{ phrase: 'be fond of (doing)', meaning: '' }, { phrase: 'a;b', meaning: 'x；y' }],
      derivatives: [{ w: 'popularity', m: '人気（こと）（もの）' }], etymology: 'ラテン語 populus（人々）', createdAt: 100,
    }, { now: NOW }),
    normalizeCustomWord({ id: 'u-w2', word: 'one-two', meanings: ['1-2', '3/4'], pos: '名', level: '5', field: '基本・日常', category: 'cat-1', createdAt: 101 }, { now: NOW }),
  ]
  return { words, cards, categories }
}

const APPLESCRIPT = `
on run argv
  set srcPath to item 1 of argv
  set outDir to item 2 of argv
  tell application "Microsoft Excel"
    set display alerts to false
    open (POSIX file srcPath)
    delay 1
    set ws to active sheet
    set shown to ""
    set rowCount to count of rows of used range of ws
    set colCount to count of columns of used range of ws
    repeat with r from 1 to rowCount
      repeat with c from 1 to colCount
        set shown to shown & (string value of (cell r of column c of ws)) & (ASCII character 31)
      end repeat
      set shown to shown & (ASCII character 30)
    end repeat
    save workbook as active workbook filename (outDir & "/mac-csv.csv") file format CSV file format
    close every workbook saving no
    open (POSIX file srcPath)
    delay 1
    save workbook as active workbook filename (outDir & "/utf8-csv.csv") file format 62
    close every workbook saving no
    open (POSIX file srcPath)
    delay 1
    save workbook as active workbook filename (outDir & "/unicode-text.txt") file format 42
    close every workbook saving no
    open (POSIX file srcPath)
    delay 1
    save workbook as active workbook filename (outDir & "/tab-text.txt") file format -4158
    close every workbook saving no
  end tell
  return shown
end run
`

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Excel は箱（サンドボックス）の外へ保存するとき許可を求めるので、Excel の箱の中で作業する。
  const work = join(homedir(), 'Library/Containers/com.microsoft.Excel/Data/study-app-excel-roundtrip')
  rmSync(work, { recursive: true, force: true })
  mkdirSync(work, { recursive: true })
  mkdirSync(FIXTURES, { recursive: true })
  const source = excelRoundtripSource()
  writeFileSync(join(work, 'export.csv'), customCardsCsvText(source))
  writeFileSync(join(work, 'roundtrip.applescript'), APPLESCRIPT)
  const shown = execFileSync('osascript', [join(work, 'roundtrip.applescript'), join(work, 'export.csv'), work], { encoding: 'utf8' })
  const display = shown.replace(/\n$/u, '').split('\u001e').filter((row, index, rows) => index < rows.length - 1 || row)
    .map((row) => row.split('\u001f').slice(0, -1))
  writeFileSync(join(FIXTURES, 'display.json'), `${JSON.stringify(display, null, 1)}\n`)
  writeFileSync(join(FIXTURES, 'source.json'), `${JSON.stringify(source, null, 1)}\n`)
  for (const name of ['export.csv', 'mac-csv.csv', 'utf8-csv.csv', 'unicode-text.txt', 'tab-text.txt']) copyFileSync(join(work, name), join(FIXTURES, name))
  const version = execFileSync('defaults', ['read', '/Applications/Microsoft Excel.app/Contents/Info', 'CFBundleShortVersionString'], { encoding: 'utf8' }).trim()
  writeFileSync(join(FIXTURES, 'excel.json'), `${JSON.stringify({ app: 'Microsoft Excel for Mac', version, madeAt: new Date().toISOString().slice(0, 10) }, null, 1)}\n`)
  console.log(`Excel ${version} で ${display.length} 行を開き、4つの形で保存しました: ${FIXTURES}`)
  console.log(readFileSync(join(FIXTURES, 'excel.json'), 'utf8'))
}
