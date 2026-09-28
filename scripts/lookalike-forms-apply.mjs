#!/usr/bin/env node
// 形の似た組を読んで決めた中身（docs/audits/lookalike-forms/dec-NNNN.tsv）を、台帳へ移す。
//   node scripts/lookalike-forms-apply.mjs          … 台帳を書き直す
//   node scripts/lookalike-forms-apply.mjs --check  … 書き直さずに、台帳が決めた中身と合うかだけを確かめる（合わなければ 1 で終わる）
// 決めた中身の全ファイルを番号の順に読み、空の台帳から作り直す（直すときは tsv を直して、もう一度動かす）。
// 行の書き方（タブ区切り。# で始まる行と空行は読まない）:
//   C  形  由来 / 由来 / …  [見分け方] … 形の似た語のまとまり。由来ごとの語を「 / 」で分ける（語は空白で区切る）。
//                                       似て見える部分だけが同じ由来の語（over- の語など）は、頭に ~ を付ける。
//   K  語  語  kind  説明     … 同じまとまりの2つの由来のつながり（distant・unclear・unrelated）。
//   N  語  説明               … 由来の説明を、その語の「語の成り立ち」の代わりに書く。
//   S  語  語  略号           … 載せない組と、その理由の略号。
//   Z  略号  語 語 …          … 並べた語どうしの、まだ決めていない組をすべて載せない（理由はその略号）。
//   A  語  略号               … その語をふくむ、まだ決めていない組をすべて載せない（理由はその略号）。
// src/data/lookalike-forms.js と docs/audits/lookalike-forms-survey.json を書き直す。
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import {
  LOOKALIKE_FORMS_SURVEY_PATH,
  LOOKALIKE_FORM_SKIP_REASONS,
  lookalikeFormPairs,
} from './checks/lookalike-forms.mjs'

const DATA_PATH = new URL('../src/data/lookalike-forms.js', import.meta.url)
const DECISIONS_DIR = new URL('../docs/audits/lookalike-forms/', import.meta.url)
const splitWords = (text) => String(text ?? '').trim().split(/\s+/).filter(Boolean)
const pairKey = (a, b) => [String(a), String(b)].sort().join('|')

const files = readdirSync(DECISIONS_DIR)
  .filter((name) => /^dec-\d{4}\.tsv$/.test(name))
  .sort()
  .map((name) => new URL(name, DECISIONS_DIR))

const forms = new Map()
const links = []
const notes = {}
const reviewed = {}
const pairs = lookalikeFormPairs(ALL_WORDS)
const errors = []

// 1つのファイルの中では C・K・N を先に当て、そのあとで S・Z・A（まだ決めていない組）を決める。
const order = { C: 0, K: 1, N: 2, S: 3, Z: 4, A: 5 }
const lines = []
files.forEach((file, fileIndex) => {
  const name = file.pathname.split('/').pop()
  readFileSync(file, 'utf8').split('\n').forEach((line, index) => {
    if (!line.trim() || line.startsWith('#')) return
    lines.push({ at: `${name}:${index + 1}`, cols: line.split('\t'), fileIndex, index })
  })
})
lines.sort((x, y) => x.fileIndex - y.fileIndex || (order[x.cols[0]] ?? 9) - (order[y.cols[0]] ?? 9) || x.index - y.index)

const covered = (a, b) => [...forms.values()].some((entry) => entry.ids.includes(a) && entry.ids.includes(b))
const skip = (key, code, at) => {
  if (!LOOKALIKE_FORM_SKIP_REASONS[code]) { errors.push(`${at}: 略号 ${code} はない`); return }
  if (!pairs.has(key)) { errors.push(`${at}: ${key} は母集団の組ではない`); return }
  reviewed[key] = code
}
const undecidedWith = (predicate) => [...pairs.keys()].filter((key) => {
  const [a, b] = key.split('|')
  return !reviewed[key] && !covered(a, b) && predicate(a, b)
})

for (const { at, cols } of lines) {
  const [kind, ...rest] = cols
  if (kind === 'C') {
    const [form, groupText, tip] = rest
    if (forms.has(form)) { errors.push(`${at}: 形 ${form} のまとまりはもうある（前の行を直す）`); continue }
    const groups = String(groupText ?? '').split(' / ').map((text) => text.trim()).filter(Boolean)
    const ids = groups.flatMap((text) => splitWords(text.replace(/^~/, '')))
    for (const id of ids) if (!getWord(id)) errors.push(`${at}: ${id} は見出し語にない`)
    if (new Set(ids).size !== ids.length) errors.push(`${at}: 同じ語が2回ある`)
    forms.set(form, { groups, ids, tip: tip ?? '' })
  } else if (kind === 'K') {
    const [a, b, linkKind, note] = rest
    if (!['distant', 'unclear', 'unrelated'].includes(linkKind)) errors.push(`${at}: kind ${linkKind}`)
    const found = links.findIndex(([x, y]) => pairKey(x, y) === pairKey(a, b))
    if (found >= 0) links.splice(found, 1)
    links.push([a, b, linkKind, note ?? ''])
  } else if (kind === 'N') {
    const [id, note] = rest
    if (!note) errors.push(`${at}: 説明がない`)
    notes[id] = note
  } else if (kind === 'S') {
    const [a, b, code] = rest
    skip(pairKey(a, b), code, at)
  } else if (kind === 'Z') {
    const [code, ids] = rest
    const set = new Set(splitWords(ids))
    for (const key of undecidedWith((a, b) => set.has(a) && set.has(b))) skip(key, code, at)
  } else if (kind === 'A') {
    const [id, code] = rest
    for (const key of undecidedWith((a, b) => a === id || b === id)) skip(key, code, at)
  } else {
    errors.push(`${at}: 行の種類 ${kind} はない`)
  }
}

// 形の似た語のまとまりに入った組は、載せない理由を消す。
for (const key of Object.keys(reviewed)) {
  const [a, b] = key.split('|')
  if (covered(a, b)) delete reviewed[key]
}
if (errors.length) {
  for (const error of errors) console.error(error)
  process.exit(1)
}

const quote = (text) => `'${String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const KIND_NAMES = { distant: 'D', unclear: 'Q', unrelated: 'U' }
const sortedForms = [...forms].sort(([a], [b]) => a.localeCompare(b))
const sortedLinks = links.sort(([a1, b1], [a2, b2]) => pairKey(a1, b1).localeCompare(pairKey(a2, b2)))

const source = readFileSync(DATA_PATH, 'utf8')
const header = source.slice(0, source.indexOf('export const LOOKALIKE_FORMS'))
const body = [
  'export const LOOKALIKE_FORMS = Object.freeze([',
  ...sortedForms.map(([form, entry]) => `  [${quote(form)}, [${entry.groups.map(quote).join(', ')}], ${quote(entry.tip)}],`),
  '])',
  '',
  'export const LOOKALIKE_LINKS = Object.freeze([',
  ...sortedLinks.map(([a, b, kind, note]) => `  [${quote(a)}, ${quote(b)}, ${KIND_NAMES[kind]}, ${quote(note)}],`),
  '])',
  '',
  'export const LOOKALIKE_NOTES = Object.freeze({',
  ...Object.entries(notes).sort(([a], [b]) => a.localeCompare(b)).map(([id, note]) => `  ${/^[a-z_][a-z0-9_]*$/.test(id) ? id : quote(id)}: ${quote(note)},`),
  '})',
  '',
]
const sortedReviewed = Object.fromEntries(Object.entries(reviewed).sort(([a], [b]) => a.localeCompare(b)))
const outputs = [
  [DATA_PATH, `${header}${body.join('\n')}`],
  [LOOKALIKE_FORMS_SURVEY_PATH, `${JSON.stringify({
    note: '形の似た組（scripts/checks/lookalike-forms.mjs の母集団）のうち、形の似た語のまとまり（src/data/lookalike-forms.js）に載せない組と、その理由の略号。略号の意味は LOOKALIKE_FORM_SKIP_REASONS。',
    reviewed: sortedReviewed,
  }, null, 2)}\n`],
]
if (process.argv.includes('--check')) {
  const stale = outputs.filter(([path, text]) => readFileSync(path, 'utf8') !== text).map(([path]) => path.pathname.split('/').slice(-2).join('/'))
  if (stale.length) {
    console.error(`決めた中身（docs/audits/lookalike-forms/dec-*.tsv）と合わない: ${stale.join('・')}。node scripts/lookalike-forms-apply.mjs で書き直す`)
    process.exit(1)
  }
} else {
  for (const [path, text] of outputs) writeFileSync(path, text)
}

const groupCount = [...forms.values()].reduce((sum, entry) => sum + entry.groups.length, 0)
console.log(`形の似た語のまとまり ${sortedForms.length}（由来 ${groupCount}）・つながり ${sortedLinks.length}・載せない組 ${Object.keys(sortedReviewed).length}`)
