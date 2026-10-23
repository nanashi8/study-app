#!/usr/bin/env node
// カタカナ語の見直し結果を台帳へ書く。
//   node scripts/loanword-survey-apply.mjs ids.txt [add.tsv]
// ids.txt: 読んだ語の id（1行1語）。add.tsv: id⇥kana⇥note（タブか | 区切り）（note は省略できる。すでにある語は上書き）。
// 書き換えるのは src/data/loanword-hints.js の HINTS と docs/audits/loanword-survey.json の read。
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { ALL_WORDS } from '../src/data/vocab.js'
import { LOANWORD_HINTS } from '../src/data/loanword-hints.js'

const [idsPath, addPath] = process.argv.slice(2)
if (!idsPath) {
  console.error('使い方: node scripts/loanword-survey-apply.mjs ids.txt [add.tsv]')
  process.exit(1)
}
const wordIds = new Set(ALL_WORDS.map((word) => word.id))
const ids = readFileSync(idsPath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean)
for (const id of ids) if (!wordIds.has(id)) throw new Error(`辞書にない id: ${id}`)

const force = new Set()
const conflicts = []
const hints = Object.fromEntries(Object.entries(LOANWORD_HINTS).map(([id, hint]) => [id, { ...hint }]))
if (addPath) {
  for (const rawLine of readFileSync(addPath, 'utf8').split('\n')) {
    if (!rawLine.trim() || rawLine.startsWith('#')) continue
    const line = rawLine.startsWith('!') ? rawLine.slice(1) : rawLine
    if (rawLine.startsWith('!')) force.add(line.split(/[|\t]/)[0])
    // 区切りはタブか縦棒（id|kana|note）。注意書きに縦棒は使わない。
    const cells = line.includes('\t') ? line.split('\t') : line.split('|')
    const [id, kana, ...noteCells] = cells
    const note = noteCells.join('|')
    if (!wordIds.has(id)) throw new Error(`辞書にない id: ${id}`)
    if (!/^[ァ-ヺー・]+$/u.test(kana ?? '')) throw new Error(`${id}: カタカナだけではない (${kana})`)
    const before = hints[id]
    // 人が書いた注意書きを黙って上書きしない。上書きするときは行の先頭に ! をつける。
    if (before?.note && note?.trim() && before.note !== note.trim() && !force.has(id)) {
      conflicts.push(`${id}: すでにある注意書きと違う。上書きするなら先頭に ! を付ける\n  いま: ${before.note}\n  新: ${note.trim()}`)
      continue
    }
    if (before?.note && !note?.trim() && !force.has(id)) continue
    hints[id] = note?.trim() ? { kana, note: note.trim() } : { kana }
    if (!ids.includes(id)) ids.push(id)
  }
}

if (conflicts.length) {
  console.error(conflicts.join('\n'))
  process.exit(1)
}
const quote = (text) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const keyOf = (id) => (/^[A-Za-z_][A-Za-z0-9_]*$/.test(id) ? id : quote(id))
const lines = Object.keys(hints).sort().map((id) => {
  const { kana, note } = hints[id]
  return `  ${keyOf(id)}: { kana: ${quote(kana)}${note ? `, note: ${quote(note)}` : ''} },`
})
const HINTS_PATH = new URL('../src/data/loanword-hints.js', import.meta.url)
const source = readFileSync(HINTS_PATH, 'utf8')
const start = source.indexOf('const HINTS = {\n')
const end = source.indexOf('\n}\n\nexport const LOANWORD_HINTS')
if (start < 0 || end < 0) throw new Error('loanword-hints.js の形が想定と違う')
writeFileSync(HINTS_PATH, `${source.slice(0, start)}const HINTS = {\n${lines.join('\n')}${source.slice(end)}`)

const SURVEY_PATH = new URL('../docs/audits/loanword-survey.json', import.meta.url)
const survey = existsSync(SURVEY_PATH) ? JSON.parse(readFileSync(SURVEY_PATH, 'utf8')) : { read: [] }
survey.read = [...new Set([...(survey.read ?? []), ...ids])].sort()
writeFileSync(SURVEY_PATH, `${JSON.stringify(survey, null, 1)}\n`)
console.log(`読んだ語 ${survey.read.length} / ${wordIds.size}、台帳 ${Object.keys(hints).length}語`)
