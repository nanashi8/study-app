#!/usr/bin/env node
// 全語見直しの表を作る。品詞のある全見出し語を級のやさしい順に並べ、関連語欄をすべて1行に出す。
//   node scripts/word-forms-review-sheet.mjs > 表.tsv
// 列: id  級  品詞  意味  ほかの品詞の形  意味が同じ・近い語  意味が反対の語  つづりが似た語  既存の使い分け
//
//   node scripts/word-forms-review-sheet.mjs --pass2 > 表.tsv
// 2回目の見直し（同じ品詞の派生語・別の品詞の意味・同じ品詞の組の使い分け）の表。
// 列: id  級  品詞  意味  別の品詞の意味  ほかの品詞の形  同じ品詞の派生語  派生語の候補  使い分けを決めていない同じ品詞の組
//   候補は語尾の規則で拾った語（* は辞書に見出しのない、発音辞書にある語。derivative-candidates.mjs）。候補に出ない語も、読んで足す。
//   載せない候補は理由を R 行で書く（[略号] つきで出る）。
import { readFileSync } from 'node:fs'
import { ALL_WORDS } from '../src/data/vocab.js'
import { WORD_USAGE_NOTES, WORD_USAGE_NOT_NEEDED } from '../src/data/word-usage-notes.js'
import { posSensesFor, wordFamilyFor, wordRelationsFor } from '../src/lib/wordRelations.js'
import { derivativeCandidates } from './derivative-candidates.mjs'

const POS = new Set(['名', '動', '形', '副'])
const ORDER = ['5', '4', '3', 'pre2', '2', 'pre1', '1']
const words = ALL_WORDS.filter((word) => POS.has(word.pos)).sort((a, b) =>
  ORDER.indexOf(String(a.level)) - ORDER.indexOf(String(b.level)) || a.word.localeCompare(b.word))

if (!process.argv.includes('--pass2')) {
  for (const word of words) {
    const relations = wordRelationsFor(word)
    const forms = relations.forms.map((item) => `${item.word}${item.extra ? '*' : ''}(${item.pos})${item.usageNote ? '[使]' : ''}`).join(' ')
    const synonyms = relations.synonyms.map((item) => `${item.w}${item.usageNote ? '[使]' : ''}`).join(',')
    const antonyms = relations.antonyms.map((item) => `${item.w}${item.usageNote ? '[使]' : ''}`).join(',')
    const confusables = relations.confusables.map((item) => item.word.word).join(',')
    const existing = [word.usage ? '使い方文' : '', ...(word.usageGuides ?? []).map((guide) => guide.title)].filter(Boolean).join('／')
    console.log([word.id, word.level, word.pos, word.meaning, forms, synonyms, antonyms, confusables, existing].join('\t'))
  }
  process.exit(0)
}

// ── 2回目の見直し ──
const pairKey = (a, b) => [String(a).toLowerCase(), String(b).toLowerCase()].sort().join('|')
const candidates = derivativeCandidates()
const ledger = JSON.parse(readFileSync(new URL('../docs/audits/word-forms-review.json', import.meta.url), 'utf8'))
const skippedCandidates = ledger.derivativeCandidatesSkipped ?? {}

for (const word of words) {
  const family = wordFamilyFor(word)
  const senses = posSensesFor(word).slice(1).map((sense) => `${sense.pos}:${sense.meaning}`).join(' ')
  const other = family.other.map((item) => `${item.word}${item.extra ? '*' : ''}(${item.pos})`).join(' ')
  const same = family.same.map((item) => {
    const key = pairKey(word.word, item.word)
    return `${item.word}${item.extra ? '*' : ''}(${item.pos})${WORD_USAGE_NOTES[key] ? '[使]' : WORD_USAGE_NOT_NEEDED[key] ? '[理]' : ''}`
  }).join(' ')
  const undecided = family.same.filter((item) => {
    const key = pairKey(word.word, item.word)
    return !WORD_USAGE_NOTES[key] && !WORD_USAGE_NOT_NEEDED[key]
  }).map((item) => item.word).join(' ')
  // 載せない理由を書いた候補は、理由の略号を [ ] で添える。
  const found = (candidates.get(word.id) ?? []).map(({ spelling, pos }) => {
    const reason = skippedCandidates[`${word.id}|${spelling}`]
    return `${spelling}${pos ? `(${pos})` : '*'}${reason ? `[${reason}]` : ''}`
  }).join(' ')
  console.log([word.id, word.level, word.pos, word.meaning, senses, other, same, found, undecided].join('\t'))
}
