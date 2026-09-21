#!/usr/bin/env node
// 全語見直しの表を作る。品詞のある全見出し語を級のやさしい順に並べ、関連語欄をすべて1行に出す。
//   node scripts/word-forms-review-sheet.mjs > 表.tsv
// 列: id  級  品詞  意味  ほかの品詞の形  意味が同じ・近い語  意味が反対の語  つづりが似た語  既存の使い分け
import { ALL_WORDS } from '../src/data/vocab.js'
import { wordRelationsFor } from '../src/lib/wordRelations.js'

const POS = new Set(['名', '動', '形', '副'])
const ORDER = ['5', '4', '3', 'pre2', '2', 'pre1', '1']
const words = ALL_WORDS.filter((word) => POS.has(word.pos)).sort((a, b) =>
  ORDER.indexOf(String(a.level)) - ORDER.indexOf(String(b.level)) || a.word.localeCompare(b.word))
for (const word of words) {
  const relations = wordRelationsFor(word)
  const forms = relations.forms.map((item) => `${item.word}${item.extra ? '*' : ''}(${item.pos})${item.usageNote ? '[使]' : ''}`).join(' ')
  const synonyms = relations.synonyms.map((item) => `${item.w}${item.usageNote ? '[使]' : ''}`).join(',')
  const antonyms = relations.antonyms.map((item) => `${item.w}${item.usageNote ? '[使]' : ''}`).join(',')
  const confusables = relations.confusables.map((item) => item.word.word).join(',')
  const existing = [word.usage ? '使い方文' : '', ...(word.usageGuides ?? []).map((guide) => guide.title)].filter(Boolean).join('／')
  console.log([word.id, word.level, word.pos, word.meaning, forms, synonyms, antonyms, confusables, existing].join('\t'))
}
