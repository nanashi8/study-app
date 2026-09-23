#!/usr/bin/env node
// つづりが似た組・同じ発音の組の見直しの結果を台帳へ書き込む。
//   node scripts/confusables-survey-apply.mjs <決めたことのファイル>
// 1行1組、タブ区切り: 組(a|b)  決めたこと  [使い分け]
//   L    → src/data/spelling-confusables.js の SPELLING_CONFUSABLE_PAIRS に足す（使い分けがあれば word-usage-notes.js へ）
//   略号 → docs/audits/confusables-survey.json の reviewed に理由として書く（checks/confusables-survey.mjs の CONFUSABLE_SKIP_REASONS）
// 同じ語の形としてつなぐ組は、ここではなく word-forms-review-apply.mjs でまとまりに入れる（つなぐと母集団から外れる）。
import { readFileSync, writeFileSync } from 'node:fs'
import { ALL_WORDS } from '../src/data/vocab.js'
import { WORD_USAGE_NOTES } from '../src/data/word-usage-notes.js'
import { SPELLING_CONFUSABLE_PAIRS } from '../src/data/spelling-confusables.js'
import { confusableSurveyPairs, CONFUSABLE_SKIP_REASONS, CONFUSABLES_SURVEY_PATH } from './checks/confusables-survey.mjs'

const ROOT = new URL('../', import.meta.url)
const [decisionsFile] = process.argv.slice(2)
if (!decisionsFile) {
  console.error('使い方: node scripts/confusables-survey-apply.mjs <決めたことのファイル>')
  process.exit(1)
}
const q = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const spellings = new Set(ALL_WORDS.map((word) => word.word.toLowerCase()))
const pairs = confusableSurveyPairs()
const ledger = JSON.parse(readFileSync(CONFUSABLES_SURVEY_PATH, 'utf8'))
const reviewed = { ...(ledger.reviewed ?? {}) }
const added = []
const notes = { ...WORD_USAGE_NOTES }
const errors = []
for (const line of readFileSync(decisionsFile, 'utf8').split('\n')) {
  if (!line.trim()) continue
  const [key, decision, note] = line.split('\t')
  const [a, b] = String(key).split('|')
  if (!pairs.has(key)) { errors.push(`母集団にない組: ${key}`); continue }
  if (!spellings.has(a) || !spellings.has(b)) { errors.push(`辞書にない語: ${key}`); continue }
  if (decision === 'L') {
    added.push([a, b])
    if (note) notes[[a, b].sort().join('|')] = note
    delete reviewed[key]
    continue
  }
  if (!CONFUSABLE_SKIP_REASONS[decision]) { errors.push(`略号がちがう: ${line}`); continue }
  reviewed[key] = decision
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
if (added.length) {
  const path = new URL('src/data/spelling-confusables.js', ROOT)
  let source = readFileSync(path, 'utf8')
  const have = new Set(SPELLING_CONFUSABLE_PAIRS.map(([a, b]) => [a, b].sort().join('|')))
  const body = added
    .filter(([a, b]) => !have.has([a, b].sort().join('|')))
    .map(([a, b]) => `  [${q(a)}, ${q(b)}],\n`).join('')
  const marker = 'export const SPELLING_CONFUSABLE_PAIRS = Object.freeze([\n'
  source = source.replace(marker, marker + body)
  writeFileSync(path, source)
}
const usagePath = new URL('src/data/word-usage-notes.js', ROOT)
let usageSource = readFileSync(usagePath, 'utf8')
const start = 'export const WORD_USAGE_NOTES = {\n'
const at = usageSource.indexOf(start) + start.length
const usageBody = Object.keys(notes).sort().map((key) => `  ${q(key)}: ${q(notes[key])},\n`).join('')
usageSource = usageSource.slice(0, at) + usageBody + usageSource.slice(usageSource.indexOf('}\n', at))
writeFileSync(usagePath, usageSource)
// つづり注意へ足した組は派生語の候補から外れるので、候補でなくなった見送りの理由の行を消す。
{
  const { derivativeCandidates } = await import('./derivative-candidates.mjs')
  const formsPath = new URL('docs/audits/word-forms-review.json', ROOT)
  const formsLedger = JSON.parse(readFileSync(formsPath, 'utf8'))
  const current = new Set()
  for (const [id, list] of derivativeCandidates()) for (const { spelling } of list) current.add(`${id}|${spelling}`)
  const skipped = formsLedger.derivativeCandidatesSkipped ?? {}
  const stale = Object.keys(skipped).filter((key) => !current.has(key))
  if (stale.length) {
    for (const key of stale) delete skipped[key]
    formsLedger.derivativeCandidatesSkipped = skipped
    writeFileSync(formsPath, `${JSON.stringify(formsLedger, null, 1)}\n`)
    console.log(`候補でなくなった見送りの理由を消した: ${stale.join(' ')}`)
  }
}
ledger.reviewed = Object.fromEntries(Object.keys(reviewed).sort().map((key) => [key, reviewed[key]]))
writeFileSync(CONFUSABLES_SURVEY_PATH, `${JSON.stringify(ledger, null, 1)}\n`)
console.log(`つづり注意へ足した組 ${added.length}・理由を書いた組 ${Object.keys(ledger.reviewed).length}`)
