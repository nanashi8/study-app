#!/usr/bin/env node
// カタカナ語の見直し表。辞書の全見出し語を id 順に1行ずつ出す。
//   node scripts/loanword-survey-sheet.mjs [--from 0] [--count 600] [--unread]
// 出力は1行1語: 番号  id  級品詞  意味  ★カタカナ（台帳にあれば。注意書きありは ★★）
// --unread をつけると、まだ読んだと記録していない語だけを出す。
import { readFileSync, existsSync } from 'node:fs'
import { ALL_WORDS } from '../src/data/vocab.js'
import { LOANWORD_HINTS } from '../src/data/loanword-hints.js'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const at = args.indexOf(name)
  return at < 0 ? fallback : Number(args[at + 1])
}
const from = flag('--from', 0)
const count = flag('--count', 600)
const unreadOnly = args.includes('--unread')

const SURVEY_PATH = new URL('../docs/audits/loanword-survey.json', import.meta.url)
const read = new Set(existsSync(SURVEY_PATH) ? JSON.parse(readFileSync(SURVEY_PATH, 'utf8')).read ?? [] : [])

const rows = [...ALL_WORDS].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
let shown = 0
rows.forEach((word, index) => {
  if (index < from || shown >= count) return
  if (unreadOnly && read.has(word.id)) return
  const hint = LOANWORD_HINTS[word.id]
  const mark = hint ? ` ${hint.note ? '★★' : '★'}${hint.kana}` : ''
  const meaning = (word.meanings ?? [word.meaning]).slice(0, 3).join('/')
  console.log(`${index}\t${word.id}\t${word.pos ?? ''}\t${meaning}${mark}`)
  shown += 1
})
