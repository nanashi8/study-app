#!/usr/bin/env node
// 説明文が名指しした英単語が、その語の関連語の欄に出ているかを確かめる。
//   node scripts/checks/named-word-relations.mjs etymology … 語の成り立ち（表示する語源の本文）の「X と同じ語源」など
//   node scripts/checks/named-word-relations.mjs usage     … 使い方・使い分けの欄（単語データの usage）が名指しした語
//   引数なし … 両方
// 名指しした語は、関連語の欄（ほかの品詞の形・同じ品詞の派生語・意味が同じ・近い語・意味が反対・対照の語・
// つづりが似た語・使い分けに注意する語）のどれかに出ているか、出さない理由を docs/audits/named-word-relations.json に書く。
// 理由の略号は NAMED_WORD_REASONS。rupture の語源が「erupt と同じ語源」なのに類義語の欄に erupt がなかったことから作った。
import { readFileSync } from 'node:fs'
import { ALL_WORDS, etymologyStoryForWord } from '../../src/data/vocab.js'
import { wordRelationsFor } from '../../src/lib/wordRelations.js'

export const NAMED_WORD_LEDGER_PATH = new URL('../../docs/audits/named-word-relations.json', import.meta.url)
export const NAMED_WORD_SOURCES = ['etymology', 'usage']

// 関連語の欄に出さない理由。
export const NAMED_WORD_REASONS = {
  離: '意味が同じ・近い語でも、反対・対照の語でもない（語源や分野でつながるだけ）',
  品: '意味はつながるが品詞がちがい、類義語・反対語の欄に並べる語ではない',
  外: '英語の語ではない（元の言語の語・語の一部・固有名詞）',
  連: '連語・文型・例の中の語で、関連語として名指ししていない',
  否: '「同じ語源ではない」と打ち消して名指ししている（取り違えを防ぐための文）',
  変: '同じ語の変化形（比較級と最上級・過去形など）で、類義語・反対語の欄に並べる語ではない',
  別: '同じつづりの別の見出し語について名指しした語（その見出し語の欄に出る）',
}

// 「X と同じ語源」「X と同系」「X と同じ語根」「X と同じく〜から」。
const SAME_ORIGIN_MARK = /と同じ語源|と同系|と同じ語根|と同じく/g
const LATIN_TOKEN = /[\p{Script=Latin}][\p{Script=Latin}'’-]*/gu

// 印の直前の句（前の文・→・閉じていない丸かっこのあと）から、名指しした語を取り出す。
function clauseBefore(text, index) {
  const before = text.slice(0, index)
  let cut = Math.max(before.lastIndexOf('。'), before.lastIndexOf('→'))
  let depth = 0
  for (let k = before.length - 1; k > cut; k -= 1) {
    const char = before[k]
    if (char === '）' || char === ')') depth += 1
    else if (char === '（' || char === '(') {
      if (depth === 0) { cut = k; break }
      depth -= 1
    }
  }
  return before.slice(cut + 1)
}

const tokensIn = (clause) => clause
  .replace(/「[^」]*」/gu, ' ')
  .replace(/（[^）]*）/gu, ' ')
  .replace(/\([^)]*\)/gu, ' ')
  .match(LATIN_TOKEN) ?? []

const HEADWORDS = new Set(ALL_WORDS.map((word) => word.word.toLowerCase()))

/** 名指しの全件 [{ key: '見出し語 id>語', id, token, text }]。同じ語の同じ名指しは1件にまとめる。 */
export function namedWordMentions(source) {
  const mentions = new Map()
  for (const word of ALL_WORDS) {
    const self = word.word.toLowerCase()
    const add = (token, text) => {
      const lower = token.toLowerCase()
      if (lower === self) return
      const key = `${word.id}>${lower}`
      if (!mentions.has(key)) mentions.set(key, { key, id: word.id, token: lower, text })
    }
    if (source === 'etymology') {
      const note = etymologyStoryForWord(word)?.note ?? ''
      for (const match of note.matchAll(SAME_ORIGIN_MARK)) {
        for (const token of tokensIn(clauseBefore(note, match.index))) add(token, note)
      }
    } else if (source === 'usage') {
      // 使い方の欄は、辞書にある語だけを見る（連語の相手の語も含めて全件読む）。
      for (const token of String(word.usage ?? '').match(LATIN_TOKEN) ?? []) {
        if (HEADWORDS.has(token.toLowerCase())) add(token, word.usage)
      }
    }
  }
  return [...mentions.values()]
}

/** その語の関連語の欄に出ている語（つづりを小文字で）。 */
export function shownRelatedSpellings(word) {
  const relations = wordRelationsFor(word)
  return new Set([
    ...relations.forms.map((item) => item.word),
    ...relations.sameForms.map((item) => item.word),
    ...relations.synonyms.map((item) => item.w),
    ...relations.antonyms.map((item) => item.w),
    ...relations.confusables.map((item) => item.word.word),
    ...relations.usagePartners.map((item) => item.word),
  ].map((text) => String(text).toLowerCase()))
}

export function loadNamedWordLedger() {
  return JSON.parse(readFileSync(NAMED_WORD_LEDGER_PATH, 'utf8'))
}

/** 名指しの全件と、欄にも理由にもない名指し・古い理由の行・略号ちがい。 */
export function namedWordGaps(source, ledger = loadNamedWordLedger()) {
  const reasons = ledger[source] ?? {}
  const mentions = namedWordMentions(source)
  const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))
  const shownCache = new Map()
  const shown = (id) => {
    if (!shownCache.has(id)) shownCache.set(id, shownRelatedSpellings(byId.get(id)))
    return shownCache.get(id)
  }
  let inSections = 0
  const missing = []
  const keys = new Set()
  const shownButReasoned = []
  for (const mention of mentions) {
    keys.add(mention.key)
    if (shown(mention.id).has(mention.token)) {
      inSections += 1
      if (reasons[mention.key]) shownButReasoned.push(mention.key)
    } else if (!reasons[mention.key]) missing.push(mention)
  }
  const stale = Object.keys(reasons).filter((key) => !keys.has(key))
  const badCodes = Object.entries(reasons).filter(([, code]) => !NAMED_WORD_REASONS[code]).map(([key, code]) => `${key}（${code}）`)
  return { mentions: mentions.length, inSections, reasoned: mentions.length - inSections - missing.length, missing, stale, shownButReasoned, badCodes }
}

const LABELS = { etymology: '語の成り立ちの「と同じ語源」', usage: '使い方・使い分けの欄' }

if (import.meta.url === `file://${process.argv[1]}`) {
  const sources = process.argv.slice(2).filter((arg) => NAMED_WORD_SOURCES.includes(arg))
  let failed = false
  for (const source of sources.length ? sources : NAMED_WORD_SOURCES) {
    const gap = namedWordGaps(source)
    console.log(`${LABELS[source]}が名指しした語: ${gap.mentions}件（関連語の欄に出る ${gap.inSections}件・出さない理由 ${gap.reasoned}件・未決 ${gap.missing.length}件）`)
    if (gap.missing.length) console.log(`  未決（先頭30）: ${gap.missing.slice(0, 30).map((mention) => mention.key).join(' ')}`)
    if (gap.stale.length) console.log(`  名指しでなくなった理由の行: ${gap.stale.join(' ')}`)
    if (gap.shownButReasoned.length) console.log(`  欄に出たのに理由が残っている行: ${gap.shownButReasoned.join(' ')}`)
    if (gap.badCodes.length) console.log(`  略号ちがい: ${gap.badCodes.join(' ')}`)
    if (gap.missing.length || gap.stale.length || gap.shownButReasoned.length || gap.badCodes.length) failed = true
  }
  process.exit(failed ? 1 : 0)
}
