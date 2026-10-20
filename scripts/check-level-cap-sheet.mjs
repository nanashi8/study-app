// 参考にした Excel を読み直し、4つの一覧の全行が照合の台帳（scripts/data/level-cap-review.js）と同じかを確かめる。
// 使い方: node scripts/check-level-cap-sheet.mjs <Excel のパス>
// 一覧の名前は書かず、行の文字列のハッシュがいちばん重なるシートを、その一覧として比べる。
// 行は「番号の列が数字」の行だけ（見出しの行・空の番号は数えない）。
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { LEVEL_CAP_LISTS } from './data/level-cap-review.js'

const file = process.argv[2]
if (!file) {
  console.error('使い方: node scripts/check-level-cap-sheet.mjs <Excel のパス>')
  process.exit(2)
}

const readPart = (part) => {
  const result = spawnSync('unzip', ['-p', file, part], { encoding: 'utf8', maxBuffer: 1 << 28 })
  if (result.status !== 0) throw new Error(`${part} を読めない: ${result.stderr}`)
  return result.stdout
}
const decode = (text) => text
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
  .replace(/&amp;/g, '&')
// ふりがな（<rPh>）は文字に含めない。
const textOf = (xml) => [...xml.replace(/<rPh\b[\s\S]*?<\/rPh>/g, '').matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)]
  .map((match) => decode(match[1])).join('')

const shared = [...readPart('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) => textOf(match[1]))
const rels = new Map([...readPart('xl/_rels/workbook.xml.rels').matchAll(/<Relationship\b[^>]*>/g)]
  .map(([tag]) => [tag.match(/Id="([^"]+)"/)[1], tag.match(/Target="([^"]+)"/)[1]]))
const sheets = [...readPart('xl/workbook.xml').matchAll(/<sheet\b[^>]*>/g)].map(([tag], index) => {
  const target = rels.get(tag.match(/r:id="([^"]+)"/)[1]).replace(/^\/?(xl\/)?/, 'xl/')
  const rows = []
  for (const [, body] of readPart(target).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = {}
    for (const [, attrs, inner] of body.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const column = attrs.match(/r="([A-Z]+)/)[1]
      const type = attrs.match(/t="([^"]+)"/)?.[1]
      const value = inner?.match(/<v>([\s\S]*?)<\/v>/)?.[1]
      cells[column] = type === 's' ? shared[Number(value)] : type === 'inlineStr' ? textOf(inner) : value
    }
    if (/^\s*\d+\s*$/.test(cells.A ?? '') && String(cells.B ?? '').trim()) rows.push(cells.B)
  }
  return { index, rows }
})

const normalize = (text) => String(text).normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
const hash = (text) => crypto.createHash('sha256').update(normalize(text)).digest('hex').slice(0, 16)

let failed = false
for (const list of LEVEL_CAP_LISTS) {
  const ledger = new Set(list.rows.map(([rowHash]) => rowHash))
  const best = sheets
    .map((sheet) => ({ ...sheet, hashes: sheet.rows.map(hash) }))
    .map((sheet) => ({ ...sheet, overlap: sheet.hashes.filter((rowHash) => ledger.has(rowHash)).length }))
    .sort((a, b) => b.overlap - a.overlap)[0]
  const sheetHashes = new Set(best.hashes)
  const added = best.rows.filter((row) => !ledger.has(hash(row)))
  const removed = [...ledger].filter((rowHash) => !sheetHashes.has(rowHash))
  const ok = added.length === 0 && removed.length === 0 && best.rows.length === list.rows.length
  if (!ok) failed = true
  console.log(`${ok ? 'OK' : 'NG'} ${list.key}: シート${best.index + 1}の${best.rows.length}行／台帳${list.rows.length}行` +
    `（台帳に無い行${added.length}・シートに無い台帳の行${removed.length}）`)
  for (const row of added) console.log(`  台帳に無い行: ${row}`)
}
process.exit(failed ? 1 : 0)
