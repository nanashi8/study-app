#!/usr/bin/env node
// 熟語・構文のつながりの見直しの結果を台帳へ書き込む。
//   node scripts/phrase-links-review-apply.mjs <見直した語の id 一覧ファイル> [<決めたことのファイル>]
// 決めたことのファイルは1行1件、タブ区切り（熟語・構文は見出しの文字どおりに書く。その語のつながりの中から探す）:
//   X  見出し語id  熟語・構文  外す理由            → src/data/phrase-link-exclusions.js
//   M  見出し語id  熟語・構文  移す先の見出し語id  → 同じつづりの別の語の熟語。docs/audits/phrase-links-review.json の moves に残し、
//                                                   移す先の語（homograph-words.js の phraseIds）ができるまで確認が止める
// 見直した語の id は docs/audits/phrase-links-review.json の reviewed に足す。
import { readFileSync, writeFileSync } from 'node:fs'
import { getWord } from '../src/data/vocab.js'
import { PHRASE_LINK_EXCLUDED } from '../src/data/phrase-link-exclusions.js'
import { phraseLinkCandidates } from '../src/lib/wordPhrases.js'

const ROOT = new URL('../', import.meta.url)
const [reviewedFile, decisionsFile] = process.argv.slice(2)
if (!reviewedFile) {
  console.error('使い方: node scripts/phrase-links-review-apply.mjs <見直した語の id 一覧> [<決めたこと>]')
  process.exit(1)
}
const q = (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const excluded = { ...PHRASE_LINK_EXCLUDED }
const reviewPath = new URL('docs/audits/phrase-links-review.json', ROOT)
const review = JSON.parse(readFileSync(reviewPath, 'utf8'))
const moves = { ...(review.moves ?? {}) }
const errors = []
const lines = decisionsFile ? readFileSync(decisionsFile, 'utf8').split('\n').filter((line) => line.trim()) : []
for (const line of lines) {
  const [kind, wordId, text, value] = line.split('\t')
  const word = getWord(wordId)
  if (!word || !['X', 'M'].includes(kind) || !text || !value) { errors.push(`行が足りない: ${line}`); continue }
  const phrase = phraseLinkCandidates(word).find((item) => item.phrase === text)
  if (!phrase) { errors.push(`${wordId} のつながりにない: ${text}`); continue }
  const key = `${word.id}|${phrase.id}`
  if (kind === 'X') excluded[key] = value
  else moves[key] = value
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
const body = Object.keys(excluded).sort().map((key) => `  ${q(key)}: ${q(excluded[key])},\n`).join('')
writeFileSync(new URL('src/data/phrase-link-exclusions.js', ROOT), readFileSync(new URL('src/data/phrase-link-exclusions.js', ROOT), 'utf8')
  .replace(/export const PHRASE_LINK_EXCLUDED = Object\.freeze\(\{\n[\s\S]*?\}\)\n/, `export const PHRASE_LINK_EXCLUDED = Object.freeze({\n${body}})\n`))
const reviewed = new Set(review.reviewed ?? [])
for (const id of readFileSync(reviewedFile, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean)) {
  if (!getWord(id)) { console.error(`見直した語の id が辞書にない: ${id}`); process.exit(1) }
  reviewed.add(id)
}
review.reviewed = [...reviewed].sort()
review.moves = Object.fromEntries(Object.keys(moves).sort().map((key) => [key, moves[key]]))
writeFileSync(reviewPath, `${JSON.stringify(review, null, 1)}\n`)
console.log(`読んだ語 ${review.reviewed.length}・外したつながり ${Object.keys(excluded).length}・別の語へ移すつながり ${Object.keys(moves).length}`)
