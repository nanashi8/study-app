#!/usr/bin/env node
// 英単語の解説の英字の語を、1件ずつ読んで決めるための道具（requests/2026-10-08-explanation-word-links.json）。
//   node scripts/explanation-words-review.mjs sheet [件数] > シート.txt
//       読んでいない所を、文ごとにまとめて出す。文の行「## 指紋 [ページの語] 文」の下に、決める語を1行ずつ
//       「鍵⇥理由⇥語⇥既定（リンク先＝添える意味）⇥同じつづりの見出し語」で並べる。
//   node scripts/explanation-words-review.mjs apply シート.txt 決定.tsv
//       決定.tsv の行は「鍵⇥値」。値は台帳 src/data/explanation-words.js の書き方（x・ok・=id・-・意味）。
//       値を「.」にした行と、シートにあって決定.tsv にない行は「既定のままでよい」と読んだ記録だけを残す
//       （句の意味・見出しのない語の意味は既定がないので、決定.tsv に書かないと止まる）。
//       読んだ鍵は docs/audits/explanation-words-review.json に記録する。
//   node scripts/explanation-words-review.mjs prune
//       文が書き換わってどこにも出なくなった読んだ記録を消す。
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { analyze, collectExplanationParagraphs, loadReview, REVIEW_PATH } from './checks/explanation-words.mjs'

const LEDGER_PATH = new URL('../src/data/explanation-words.js', import.meta.url)
const NEEDS_VALUE = new Set(['句の意味', '見出しのない語の意味'])

function readLedger() {
  const source = readFileSync(LEDGER_PATH, 'utf8')
  const start = source.indexOf('export const EXPLANATION_WORD_DECISIONS = {')
  const body = source.slice(source.indexOf('{', start) + 1, source.lastIndexOf('}'))
  const entries = {}
  for (const line of body.split('\n')) {
    const match = line.match(/^\s*("(?:[^"\\]|\\.)*"):\s*("(?:[^"\\]|\\.)*"),?\s*$/u)
    if (match) entries[JSON.parse(match[1])] = JSON.parse(match[2])
  }
  return { head: source.slice(0, start), entries }
}

function writeLedger(head, entries) {
  const lines = Object.keys(entries).sort().map((key) => `  ${JSON.stringify(key)}: ${JSON.stringify(entries[key])},`)
  writeFileSync(LEDGER_PATH, `${head}export const EXPLANATION_WORD_DECISIONS = {\n${lines.join('\n')}\n}\n`)
}

const [command, ...rest] = process.argv.slice(2)

if (command === 'sheet') {
  const limit = Number(rest[0]) || 300
  const data = await collectExplanationParagraphs()
  const { problems } = analyze(data)
  const { vocab, lib } = data
  // 同じ文の所をまとめ、文の順に並べる。
  const byText = new Map()
  for (const item of problems.unread) {
    const textKey = item.key.split('|')[0]
    if (!byText.has(textKey)) byText.set(textKey, { text: item.text, wordId: item.wordId, items: [] })
    byText.get(textKey).items.push(item)
  }
  let count = 0
  for (const [textKey, group] of byText) {
    if (count >= limit) break
    console.log(`## ${textKey} [${group.wordId}] ${group.text}`)
    for (const item of group.items) {
      const run = item.key.slice(textKey.length + 1)
      const target = item.link ? vocab.WORDS_BY_ID[item.link] : null
      const spelling = run.replace(/#\d+$/u, '').split('>').pop().toLowerCase()
      const homographs = vocab.ALL_WORDS.filter((word) => word.word.toLowerCase() === spelling)
      const others = homographs.length > 1 ? homographs.map((word) => `${word.id}=${word.meaning}`).join(' | ') : ''
      const fallback = target ? `${target.id}＝${lib.defaultMeaningOf(target)}` : (homographs[0] ? `(${homographs[0].id}＝${homographs[0].meaning})` : '')
      console.log([item.key, item.reason, run, fallback, others].join('\t').replace(/\t+$/u, ''))
      count += 1
    }
  }
  process.exit(0)
}

if (command === 'apply') {
  const [sheetPath, decisionPath] = rest
  const sheetKeys = new Map()
  for (const line of readFileSync(sheetPath, 'utf8').split('\n')) {
    if (!line || line.startsWith('## ')) continue
    const [key, reason] = line.split('\t')
    sheetKeys.set(key, reason)
  }
  const decisions = new Map()
  if (decisionPath && existsSync(decisionPath)) {
    for (const line of readFileSync(decisionPath, 'utf8').split('\n')) {
      if (!line.trim() || line.startsWith('#')) continue
      const tab = line.indexOf('\t')
      if (tab < 0) throw new Error(`タブのない行: ${line}`)
      const key = line.slice(0, tab)
      const value = line.slice(tab + 1).trim()
      if (decisions.has(key)) throw new Error(`同じ鍵が2回: ${key}`)
      if (!sheetKeys.has(key) && !key.includes('|')) throw new Error(`鍵の形でない: ${key}`)
      decisions.set(key, value)
    }
  }
  const missing = [...sheetKeys].filter(([key, reason]) => NEEDS_VALUE.has(reason) && (!decisions.has(key) || decisions.get(key) === '.'))
  if (missing.length) {
    console.error(`値の要る行に決定がない: ${missing.length}件`)
    for (const [key, reason] of missing.slice(0, 30)) console.error(`  ${key} ${reason}`)
    process.exit(1)
  }
  const { head, entries } = readLedger()
  const review = loadReview()
  review.reviewed ??= {}
  for (const [key, value] of decisions) {
    if (value === '.') delete entries[key]
    else entries[key] = value
    review.reviewed[key] = 1
  }
  for (const key of sheetKeys.keys()) review.reviewed[key] = 1
  writeLedger(head, entries)
  const sorted = Object.fromEntries(Object.keys(review.reviewed).sort().map((key) => [key, 1]))
  writeFileSync(REVIEW_PATH, `${JSON.stringify({ ...review, reviewed: sorted }, null, 1)}\n`)
  console.log(`読んだ所 ${sheetKeys.size}件（台帳に書いた決定 ${[...decisions.values()].filter((value) => value !== '.').length}件）。読んだ記録は全部で ${Object.keys(sorted).length}件`)
  process.exit(0)
}

if (command === 'prune') {
  // 文が書き換わって、もうどこにも出ない読んだ記録を消す（台帳の行は消さない。check の --ledger が止める）。
  const { staleReviews } = analyze(await collectExplanationParagraphs())
  const review = loadReview()
  for (const key of staleReviews) delete review.reviewed[key]
  writeFileSync(REVIEW_PATH, `${JSON.stringify(review, null, 1)}\n`)
  console.log(`どこにも出ない読んだ記録を ${staleReviews.length}件消した: ${staleReviews.map((key) => JSON.stringify(key)).join(' ')}`)
  process.exit(0)
}

console.error('使い方: sheet [件数] | apply シート.txt 決定.tsv | prune')
process.exit(1)
