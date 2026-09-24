#!/usr/bin/env node
// 類義語・反対語・同じ意味の熟語の見直しと、説明文が名指しした語の見直しの結果を台帳へ書き込む。
//   node scripts/relation-review-apply.mjs <決めたことのファイル>...
// 1行1件、タブ区切り。行の頭の記号で種類を分ける。
//   N  a|b  解説                       … 類義語・反対語の行の解説（src/data/word-relation-notes.js の WORD_RELATION_NOTES）
//   N! a|b  解説                       … 書いてある解説を書き直す
//   I  見出し語id|熟語id  解説          … 同じ意味の熟語の行の解説（WORD_IDIOM_NOTES）。I! で書き直す
//   A  見出し語id  syn|ant  英単語  意味  理由   … 欄に足す（src/data/word-relation-edits.js の RELATION_ADDITIONS）
//   D  見出し語id  syn|ant  英単語  理由        … 欄から外す（RELATION_REMOVALS）
//   M  見出し語id  syn|ant  英単語  意味        … 添えた意味を直す（RELATION_MEANING_FIXES）
//   E  見出し語id>語  略号                     … 語の成り立ちが名指しした語を欄に出さない理由（docs/audits/named-word-relations.json）
//   U  見出し語id>語  略号                     … 使い方の欄が名指しした語を欄に出さない理由
// 略号は scripts/checks/named-word-relations.mjs の NAMED_WORD_REASONS。
import { readFileSync, writeFileSync } from 'node:fs'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { WORD_IDIOM_NOTES, WORD_RELATION_NOTES } from '../src/data/word-relation-notes.js'
import { RELATION_ADDITIONS, RELATION_MEANING_FIXES, RELATION_REMOVALS } from '../src/data/word-relation-edits.js'
import { NAMED_WORD_LEDGER_PATH, NAMED_WORD_REASONS } from './checks/named-word-relations.mjs'

const ROOT = new URL('../', import.meta.url)
const files = process.argv.slice(2)
if (!files.length) {
  console.error('使い方: node scripts/relation-review-apply.mjs <決めたことのファイル>...')
  process.exit(1)
}
const q = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const lower = (text) => String(text ?? '').trim().toLowerCase()
const ids = new Set(ALL_WORDS.map((word) => word.id))
const KIND = { syn: 'synonyms', ant: 'antonyms' }

const notes = { ...WORD_RELATION_NOTES }
const idiomNotes = { ...WORD_IDIOM_NOTES }
const additions = RELATION_ADDITIONS.map((row) => [...row])
const removals = RELATION_REMOVALS.map((row) => [...row])
const fixes = RELATION_MEANING_FIXES.map((row) => [...row])
const ledger = JSON.parse(readFileSync(NAMED_WORD_LEDGER_PATH, 'utf8'))
const errors = []
const counts = { N: 0, I: 0, A: 0, D: 0, M: 0, E: 0, U: 0 }

const checkNote = (text, at) => {
  if (!text || !text.trim()) errors.push(`${at}: 解説が空`)
  else if (/\t/.test(text)) errors.push(`${at}: 解説にタブがある`)
}
const itemsOf = (id, kind) => (getWord(id)?.[KIND[kind]] ?? []).map((item) => lower(item.w))

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, index) => {
    if (!line.trim() || line.startsWith('#')) return
    const at = `${file}:${index + 1}`
    const [type, ...cols] = line.split('\t')
    const base = type.replace('!', '')
    const overwrite = type.endsWith('!')
    if (base === 'N') {
      const [key, note] = cols
      const [a, b] = String(key).split('|')
      if (!a || !b || [a, b].sort().join('|') !== key || key !== key.toLowerCase()) { errors.push(`${at}: 組は小文字を並べ替えて | でつなぐ（${key}）`); return }
      checkNote(note, at)
      if (notes[key] && notes[key] !== note && !overwrite) { errors.push(`${at}: ${key} の解説はもうある（書き直すなら N!）`); return }
      notes[key] = note
    } else if (base === 'I') {
      const [key, note] = cols
      const [id] = String(key).split('|')
      if (!ids.has(id)) { errors.push(`${at}: 見出し語 ${id} が辞書にない`); return }
      checkNote(note, at)
      if (idiomNotes[key] && idiomNotes[key] !== note && !overwrite) { errors.push(`${at}: ${key} の解説はもうある（書き直すなら I!）`); return }
      idiomNotes[key] = note
    } else if (base === 'A') {
      const [id, kind, w, m, reason] = cols
      if (!ids.has(id)) { errors.push(`${at}: 見出し語 ${id} が辞書にない`); return }
      if (!KIND[kind] || !w || !m || !reason) { errors.push(`${at}: A は 見出し語id・syn|ant・英単語・意味・理由`); return }
      if (lower(w) === lower(getWord(id).word)) { errors.push(`${at}: 自分自身は足せない`); return }
      if (itemsOf(id, kind).includes(lower(w)) || additions.some((row) => row[0] === id && row[1] === kind && lower(row[2]) === lower(w))) {
        errors.push(`${at}: ${id} の ${kind} に ${w} はもうある`); return
      }
      additions.push([id, kind, w, m, reason])
    } else if (base === 'D') {
      const [id, kind, w, reason] = cols
      if (!ids.has(id)) { errors.push(`${at}: 見出し語 ${id} が辞書にない`); return }
      if (!KIND[kind] || !w || !reason) { errors.push(`${at}: D は 見出し語id・syn|ant・英単語・理由`); return }
      const addedHere = additions.findIndex((row) => row[0] === id && row[1] === kind && lower(row[2]) === lower(w))
      if (addedHere >= 0) { additions.splice(addedHere, 1); return }
      if (!itemsOf(id, kind).includes(lower(w))) { errors.push(`${at}: ${id} の ${kind} に ${w} がない`); return }
      removals.push([id, kind, w, reason])
    } else if (base === 'M') {
      const [id, kind, w, m] = cols
      if (!ids.has(id)) { errors.push(`${at}: 見出し語 ${id} が辞書にない`); return }
      if (!KIND[kind] || !w || !m) { errors.push(`${at}: M は 見出し語id・syn|ant・英単語・意味`); return }
      const added = additions.find((row) => row[0] === id && row[1] === kind && lower(row[2]) === lower(w))
      if (added) { added[3] = m; return }
      if (!itemsOf(id, kind).includes(lower(w))) { errors.push(`${at}: ${id} の ${kind} に ${w} がない`); return }
      const existing = fixes.find((row) => row[0] === id && row[1] === kind && lower(row[2]) === lower(w))
      if (existing) existing[3] = m
      else fixes.push([id, kind, w, m])
    } else if (base === 'E' || base === 'U') {
      const [key, code] = cols
      if (!NAMED_WORD_REASONS[code]) { errors.push(`${at}: 略号がちがう（${code}）`); return }
      const source = base === 'E' ? 'etymology' : 'usage'
      ledger[source] = ledger[source] ?? {}
      ledger[source][key] = code
    } else {
      errors.push(`${at}: 行の種類がわからない（${type}）`)
      return
    }
    counts[base] += 1
  })
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

const replaceBlock = (source, start, end, body) => {
  const from = source.indexOf(start)
  if (from < 0) throw new Error(`見つからない: ${start}`)
  const to = source.indexOf(end, from + start.length)
  return source.slice(0, from + start.length) + body + source.slice(to)
}
const sortedEntries = (object) => Object.entries(object).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))

const notesPath = new URL('src/data/word-relation-notes.js', ROOT)
let notesSource = readFileSync(notesPath, 'utf8')
notesSource = replaceBlock(notesSource, 'export const WORD_RELATION_NOTES = {\n', '}\n',
  sortedEntries(notes).map(([key, note]) => `  ${q(key)}: ${q(note)},\n`).join(''))
notesSource = replaceBlock(notesSource, 'export const WORD_IDIOM_NOTES = {\n', '}\n',
  sortedEntries(idiomNotes).map(([key, note]) => `  ${q(key)}: ${q(note)},\n`).join(''))
writeFileSync(notesPath, notesSource)

const editsPath = new URL('src/data/word-relation-edits.js', ROOT)
let editsSource = readFileSync(editsPath, 'utf8')
const rows = (list) => [...list]
  .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1].localeCompare(b[1]) || lower(a[2]).localeCompare(lower(b[2]))))
  .map((row) => `  [${row.map(q).join(', ')}],\n`).join('')
editsSource = replaceBlock(editsSource, 'export const RELATION_ADDITIONS = [\n', ']\n', rows(additions))
editsSource = replaceBlock(editsSource, 'export const RELATION_REMOVALS = [\n', ']\n', rows(removals))
editsSource = replaceBlock(editsSource, 'export const RELATION_MEANING_FIXES = [\n', ']\n', rows(fixes))
writeFileSync(editsPath, editsSource)

for (const source of Object.keys(ledger)) {
  ledger[source] = Object.fromEntries(sortedEntries(ledger[source]))
}
writeFileSync(NAMED_WORD_LEDGER_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
console.log('書き込んだ', counts)
