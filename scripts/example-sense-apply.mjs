#!/usr/bin/env node
// 例文が学ぶ意味で使われているかを読んだ結果を、台帳とデータへ書き込む（scripts/checks/example-learned-sense.mjs の候補が対象）。
//   node scripts/example-sense-apply.mjs <決めたことのファイル>...
// 1行1件、タブ区切り。行の頭の記号で種類を分ける。
//   K  key  和訳の語=意味の訳語     … 同じ意味を言い換えた和訳。docs/audits/example-sense-review.json に残す
//   J  key  新しい和訳               … 英文は学ぶ意味で使っているが、和訳が別の意味に見える。和訳だけ直す
//   E  key  新しい英文  新しい和訳    … 英文が別の意味で使っている。英文と和訳を書き直す
// key は候補の一覧（node scripts/checks/example-learned-sense.mjs --list）の1列目。
//   node scripts/example-sense-apply.mjs --prune … 和訳に意味の訳語が入って候補でなくなった項目の行を台帳から外す
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import {
  EXAMPLE_SENSE_REVIEW_PATH,
  exampleSenseCandidates,
  exampleSenseItems,
  reviewEntryProblem,
} from './checks/example-learned-sense.mjs'

const DATA_DIR = new URL('../src/data/', import.meta.url)
// 例文を写しているだけのファイル（元の例文を直したあとで、写しを合わせる）。
const COPY_FILES = new Set(['reading-extended-sentences.generated.js'])

const files = process.argv.slice(2).filter((arg) => !arg.startsWith('--'))
const dryRun = process.argv.includes('--dry-run')
if (process.argv.includes('--prune')) {
  const current = JSON.parse(readFileSync(EXAMPLE_SENSE_REVIEW_PATH, 'utf8'))
  const candidateKeys = new Set(exampleSenseCandidates().map((item) => item.key))
  const kept = Object.entries(current.reviewed ?? {}).filter(([key]) => candidateKeys.has(key))
  const dropped = Object.keys(current.reviewed ?? {}).filter((key) => !candidateKeys.has(key))
  for (const key of dropped) console.log(`候補でなくなった: ${key}（${current.reviewed[key]}）`)
  if (!dryRun) writeFileSync(EXAMPLE_SENSE_REVIEW_PATH, `${JSON.stringify({ ...current, reviewed: Object.fromEntries(kept) }, null, 2)}\n`)
  console.log(`${dryRun ? '（試し）' : ''}台帳から ${dropped.length} 行を外した`)
  process.exit(0)
}
if (!files.length) {
  console.error('使い方: node scripts/example-sense-apply.mjs [--dry-run] <決めたことのファイル>...')
  process.exit(1)
}

const itemsByKey = new Map(exampleSenseItems().map((item) => [item.key, item]))
const ledger = JSON.parse(readFileSync(EXAMPLE_SENSE_REVIEW_PATH, 'utf8'))
const reviewed = { ...(ledger.reviewed ?? {}) }
const errors = []
const counts = { K: 0, J: 0, E: 0 }

// ソースでの書き方（テンプレート文字列・単引用符・二重引用符）ごとの文字列。
const ENCODINGS = [
  { name: 'raw', encode: (text) => text },
  { name: 'single', encode: (text) => text.replace(/\\/g, '\\\\').replace(/'/g, "\\'") },
  { name: 'double', encode: (text) => text.replace(/\\/g, '\\\\').replace(/"/g, '\\"') },
]
const sources = new Map()
for (const name of readdirSync(DATA_DIR)) {
  if (!name.endsWith('.js') || COPY_FILES.has(name)) continue
  sources.set(name, readFileSync(new URL(name, DATA_DIR), 'utf8'))
}
const changed = new Set()

/** 古い英文と和訳が近く（同じ行か3行以内）に並ぶ場所を探す。 */
function locate(en, ja) {
  const found = []
  for (const [name, text] of sources) {
    for (const encoding of ENCODINGS) {
      const oldEn = encoding.encode(en)
      const oldJa = encoding.encode(ja)
      let from = 0
      for (;;) {
        const at = text.indexOf(oldEn, from)
        if (at < 0) break
        from = at + 1
        const window = text.slice(at, at + oldEn.length + 400)
        const jaAt = window.indexOf(oldJa, oldEn.length)
        if (jaAt < 0) continue
        const between = window.slice(oldEn.length, jaAt)
        if ((between.match(/\n/g) ?? []).length > 3) continue
        found.push({ name, encoding, enAt: at, jaAt: at + jaAt, oldEn, oldJa })
      }
    }
  }
  // 同じ場所を別の書き方で二重に数えない。
  const unique = new Map(found.map((spot) => [`${spot.name}:${spot.enAt}`, spot]))
  return [...unique.values()]
}

// 書き換えるのは、その項目を定義するファイルだけ。同じ例文がほかの教材にもあるとき（how の How are you? は
// 熟語の会話表現にもある）や、長文辞書語の例文が長文の本文から引かれているときに、ほかの教材の文を書き換えない。
// 長文辞書語の例文を変えるときは、長文辞書語の定義（reading-words.js など）のその語に example を書く。
const OWN_FILES = {
  word: /^(words|homograph-words|exam-lexicon|reading-words|reading-[a-z-]+-word-definitions)/,
  sense: /^(word-senses|homograph-words)/,
  phrase: /^(phrases|syntax-families)/,
}
// 長文辞書語の定義（1行の { id: '語', ... }）。例文を持たない語は本文の最初の出現を例文にしているので、example を書き足す。
const PASSAGE_DEFINITION_FILES = ['reading-words.js', 'reading-expansion-word-definitions.js', 'reading-current-affairs-word-definitions.js', 'reading-fields-word-definitions.js']
const single = (text) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
function addPassageExample(key, newEn, newJa) {
  const id = key.slice('word:'.length)
  const found = []
  for (const name of PASSAGE_DEFINITION_FILES) {
    const lines = sources.get(name).split('\n')
    lines.forEach((line, index) => {
      if (line.trimStart().startsWith(`{ id: '${id}',`) && line.trimEnd().endsWith('},') && !line.includes('example:')) found.push({ name, index })
    })
  }
  if (found.length !== 1) return false
  const [{ name, index }] = found
  const lines = sources.get(name).split('\n')
  lines[index] = lines[index].replace(/\s*},\s*$/, `, example: { en: ${single(newEn)}, ja: ${single(newJa)} } },`)
  sources.set(name, lines.join('\n'))
  changed.add(name)
  return true
}
function rewrite(key, item, newEn, newJa) {
  const spots = locate(item.example.en, item.example.ja).filter((spot) => OWN_FILES[key.split(':')[0]]?.test(spot.name))
  if (!spots.length && key.startsWith('word:') && addPassageExample(key, newEn, newJa)) return
  if (spots.length !== 1) {
    errors.push(`${key}: 例文の場所が ${spots.length} か所（${spots.map((spot) => spot.name).join(', ')}）`)
    return
  }
  const [spot] = spots
  const text = sources.get(spot.name)
  const encodedEn = spot.encoding.encode(newEn)
  const encodedJa = spot.encoding.encode(newJa)
  const next = text.slice(0, spot.enAt) + encodedEn + text.slice(spot.enAt + spot.oldEn.length, spot.jaAt) + encodedJa + text.slice(spot.jaAt + spot.oldJa.length)
  sources.set(spot.name, next)
  changed.add(spot.name)
}

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n')
  for (const [index, line] of lines.entries()) {
    if (!line.trim() || line.startsWith('#')) continue
    const [code, key, ...rest] = line.split('\t')
    const where = `${file}:${index + 1}`
    const item = itemsByKey.get(key)
    if (!item) {
      errors.push(`${where}: key が見つからない (${key})`)
      continue
    }
    if (code === 'K') {
      const problem = reviewEntryProblem(item, rest[0])
      if (problem) errors.push(`${where}: ${key} ${problem}`)
      else reviewed[key] = rest[0]
      counts.K += 1
    } else if (code === 'J') {
      if (!rest[0]?.trim()) errors.push(`${where}: 新しい和訳がない`)
      else rewrite(key, item, item.example.en, rest[0].trim())
      delete reviewed[key]
      counts.J += 1
    } else if (code === 'E') {
      if (!rest[0]?.trim() || !rest[1]?.trim()) errors.push(`${where}: 新しい英文か和訳がない`)
      else rewrite(key, item, rest[0].trim(), rest[1].trim())
      delete reviewed[key]
      counts.E += 1
    } else {
      errors.push(`${where}: 記号がちがう (${code})`)
    }
  }
}

if (errors.length) {
  for (const error of errors) console.error(error)
  process.exit(1)
}
if (!dryRun) {
  for (const name of changed) writeFileSync(new URL(name, DATA_DIR), sources.get(name))
  const sorted = Object.fromEntries(Object.entries(reviewed).sort(([a], [b]) => a.localeCompare(b)))
  writeFileSync(EXAMPLE_SENSE_REVIEW_PATH, `${JSON.stringify({ ...ledger, reviewed: sorted }, null, 2)}\n`)
}
console.log(`${dryRun ? '（試し）' : ''}台帳 ${counts.K} 件・和訳の書き直し ${counts.J} 件・例文の書き直し ${counts.E} 件（変えたファイル: ${[...changed].join(', ') || 'なし'}）`)
