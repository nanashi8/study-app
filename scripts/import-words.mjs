#!/usr/bin/env node
// CSV から単語を一括取り込み → src/data/words-imported.js を生成。
// 使い方: npm run import [path/to/file.csv]   （省略時 import.csv）
// CSV 列（1行目ヘッダー）: word, level, meaning, example_en, example_ja, pos, note
//   level は 5/4/3/準2(pre2)/2/準1(pre1)/1 を受け付け（「5級」「準2級」等も可）。
//   meaning は「・」区切りで複数可。example/pos/note は任意。
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { CURATED_IDS } from '../src/data/vocab.js'
import { splitMeanings } from '../src/data/compact.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const csvPath = resolve(root, process.argv[2] ?? 'import.csv')
const outPath = resolve(root, 'src/data/words-imported.js')

// ── 最小CSVパーサ（引用符・カンマ・改行に対応） ──
function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  const pushField = () => { row.push(field); field = '' }
  const pushRow = () => { pushField(); rows.push(row); row = [] }
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') pushField()
    else if (c === '\n') pushRow()
    else if (c === '\r') { /* skip */ }
    else field += c
  }
  if (field.length || row.length) pushRow()
  return rows.filter((r) => r.length > 1 || (r[0] && r[0].trim()))
}

const LEVEL_MAP = {
  '5': '5', '5級': '5', '4': '4', '4級': '4', '3': '3', '3級': '3',
  '準2': 'pre2', '準2級': 'pre2', 'pre2': 'pre2', 'pre-2': 'pre2', 'p2': 'pre2',
  '2': '2', '2級': '2',
  '準1': 'pre1', '準1級': 'pre1', 'pre1': 'pre1', 'pre-1': 'pre1', 'p1': 'pre1',
  '1': '1', '1級': '1',
}
const slug = (w) => w.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

let raw
try {
  raw = readFileSync(csvPath, 'utf8')
} catch {
  console.error(`❌ CSV が読めません: ${csvPath}`)
  console.error('   使い方: npm run import path/to/file.csv')
  console.error('   列: word,level,meaning,example_en,example_ja,pos,note')
  process.exit(1)
}

const rows = parseCSV(raw)
if (!rows.length) { console.error('❌ 行がありません'); process.exit(1) }
const header = rows[0].map((h) => h.trim().toLowerCase())
const idx = (name) => header.indexOf(name)
const col = { word: idx('word'), level: idx('level'), meaning: idx('meaning'),
  en: idx('example_en'), ja: idx('example_ja'), pos: idx('pos'), note: idx('note') }
if (col.word < 0 || col.meaning < 0) {
  console.error('❌ ヘッダーに word と meaning が必要です。実際:', header.join(','))
  process.exit(1)
}

const out = []
const seen = new Set()
let dupCurated = 0
let dupCsv = 0
let bad = 0
let levelGuess = 0

for (let i = 1; i < rows.length; i++) {
  const r = rows[i]
  const word = (r[col.word] ?? '').trim()
  const meaning = (r[col.meaning] ?? '').trim()
  if (!word || !meaning) { bad++; continue }
  const id = slug(word)
  if (CURATED_IDS.has(id)) { dupCurated++; continue }
  if (seen.has(id)) { dupCsv++; continue }
  seen.add(id)

  const rawLevel = (r[col.level] ?? '').trim()
  let level = LEVEL_MAP[rawLevel]
  if (!level) { level = '2'; levelGuess++ }

  const entry = {
    id, word,
    pos: (col.pos >= 0 && r[col.pos]?.trim()) || '名',
    level,
    meaning,
    meanings: splitMeanings(meaning),
  }
  const en = col.en >= 0 ? (r[col.en] ?? '').trim() : ''
  if (en) entry.example = { en, ja: col.ja >= 0 ? (r[col.ja] ?? '').trim() : '' }
  const note = col.note >= 0 ? (r[col.note] ?? '').trim() : ''
  if (note) entry.etymology = { note }
  out.push(entry)
}

const banner = `// 取り込み済み単語（自動生成 / npm run import）。手で編集しない。\n// 元CSV: ${process.argv[2] ?? 'import.csv'} / 生成語数: ${out.length}\n`
writeFileSync(outPath, banner + 'export const WORDS_IMPORTED = ' + JSON.stringify(out) + '\n')

console.log(`\n✅ 取り込み完了`)
console.log(`  追加: ${out.length} 語 → src/data/words-imported.js`)
console.log(`  スキップ: 既存と重複 ${dupCurated} / CSV内重複 ${dupCsv} / 不備 ${bad}`)
if (levelGuess) console.log(`  ⚠ 級が不明で「2級」に仮置き: ${levelGuess} 語（CSVの level 列を確認）`)
console.log(`  次の手順: npm run phonetics（IPA生成）→ npm run check（必須項目の検証）→ npm run build`)
console.log(`  ※ 語源(note列)が無い語は検証で弾かれます。CSVの note 列に簡潔な由来を入れてください。\n`)
