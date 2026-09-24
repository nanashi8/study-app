#!/usr/bin/env node
// 見直しの表を作る（読むための表。決めたことは relation-review-apply.mjs で書き込む）。
//   node scripts/relation-review-sheet.mjs named etymology [件数]
//     語の成り立ちが「と同じ語源」などと名指しした語のうち、関連語の欄に出ていない未決の名指し。
//     列: 見出し語id>語  見出し語[品詞 級]意味  名指しした語[品詞 級]意味（辞書にない語は —）  本文
//   node scripts/relation-review-sheet.mjs named usage [件数]
//     使い方・使い分けの欄が名指しした辞書の語のうち、未決の名指し。
//   node scripts/relation-review-sheet.mjs notes [見出し語の数]
//     類義語・反対語・同じ意味の熟語の行で、解説がまだない行を、見出し語ごとに級のやさしい順で出す。
//     同じ組が2つの語の欄に出るときは、先に出る語の下に1回だけ出す（⇄ は相手の欄にも出る組）。
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { wordRelationsFor } from '../src/lib/wordRelations.js'
import { namedWordGaps } from './checks/named-word-relations.mjs'

const ORDER = ['5', '4', '3', 'pre2', '2', 'pre1', '1']
const [mode, arg, countArg] = process.argv.slice(2)
const pairKey = (a, b) => [String(a).toLowerCase(), String(b).toLowerCase()].sort().join('|')
const toId = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
const describe = (word) => (word ? `${word.word}[${word.pos} ${word.level}]${word.meaning}` : '—')

if (mode === 'named') {
  const limit = Number(countArg ?? 200)
  const gap = namedWordGaps(arg)
  for (const mention of gap.missing.slice(0, limit)) {
    const word = getWord(mention.id)
    const named = getWord(toId(mention.token))
    // 本文は名指しした語をふくむ文だけを出す。
    const sentence = String(mention.text).split(/(?<=。)/u).find((part) => part.toLowerCase().includes(mention.token)) ?? mention.text
    console.log([mention.key, describe(word), named ? describe(named) : `${mention.token}（辞書にない）`, sentence].join('\t'))
  }
  console.error(`未決 ${gap.missing.length}件のうち ${Math.min(limit, gap.missing.length)}件を出した`)
  process.exit(0)
}

if (mode === 'notes') {
  const limit = Number(arg ?? 60)
  const words = [...ALL_WORDS].sort((a, b) =>
    ORDER.indexOf(String(a.level)) - ORDER.indexOf(String(b.level)) || a.word.localeCompare(b.word) || a.id.localeCompare(b.id))
  // 相手の欄にも出るかを見るため、先に全語の表示を集める。
  const shownFrom = new Map()
  const relationsById = new Map()
  for (const word of words) {
    const relations = wordRelationsFor(word)
    relationsById.set(word.id, relations)
    for (const kind of ['synonyms', 'antonyms']) {
      for (const item of relations[kind]) {
        const key = pairKey(word.word, item.w)
        if (!shownFrom.has(key)) shownFrom.set(key, new Set())
        shownFrom.get(key).add(word.id)
      }
    }
  }
  const printed = new Set()
  let headwords = 0
  let pending = 0
  const out = []
  for (const word of words) {
    const relations = relationsById.get(word.id)
    const lines = []
    for (const [kind, mark] of [['synonyms', 'S'], ['antonyms', 'A']]) {
      for (const item of relations[kind]) {
        const key = pairKey(word.word, item.w)
        if (item.usageNote || printed.has(key)) continue
        printed.add(key)
        const other = getWord(item.id ?? toId(item.w))
        const both = [...(shownFrom.get(key) ?? [])].some((id) => id !== word.id) ? ' ⇄' : ''
        lines.push(`${mark} ${key}\t${item.w}「${item.m}」${other ? ` = ${describe(other)}` : '（辞書にない）'}${both}`)
      }
    }
    for (const phrase of relations.idioms) {
      if (phrase.usageNote) continue
      lines.push(`I ${word.id}|${phrase.id}\t${phrase.phrase}「${phrase.meaning}」`)
    }
    if (!lines.length) continue
    pending += lines.length
    headwords += 1
    if (headwords <= limit) out.push(`# ${describe(word)}${word.example?.en ? ` / ${word.example.en}` : ''}`, ...lines)
  }
  console.log(out.join('\n'))
  console.error(`解説のない行が残る見出し語 ${headwords}語（${pending}行）のうち ${Math.min(limit, headwords)}語を出した`)
  process.exit(0)
}

console.error('使い方: node scripts/relation-review-sheet.mjs named etymology|usage [件数] ／ notes [見出し語の数]')
process.exit(1)
