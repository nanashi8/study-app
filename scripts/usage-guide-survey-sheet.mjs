#!/usr/bin/env node
// 使い分けカードの候補で、まだ決めていない組を読む表にする（checks/usage-guide-survey.mjs）。
//   node scripts/usage-guide-survey-sheet.mjs [件数=200] [--phrase]
// やさしい級の組から順に出す。表は docs/audits/usage-guide-survey/batch-NNNN.tsv に残し、
// 決めたことは usage-guide-survey-apply.mjs に、1行1文字の略号の並びで渡す。
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { ALL_WORDS } from '../src/data/vocab.js'
import { getPhrase } from '../src/data/phrases.js'
import { relationNoteBetween } from '../src/lib/wordRelations.js'
import { WORD_IDIOM_NOTES } from '../src/data/word-relation-notes.js'
import { isPhrasePair, readUsageGuideSurvey, usageGuidePairCards, usageGuideSurveyPairs } from './checks/usage-guide-survey.mjs'

const args = process.argv.slice(2)
const count = Number(args.find((arg) => /^\d+$/.test(arg)) ?? 200)
const phraseMode = args.includes('--phrase')
const DIR = new URL('../docs/audits/usage-guide-survey/', import.meta.url)
mkdirSync(DIR, { recursive: true })

const LEVEL_RANK = { 5: 0, 4: 1, 3: 2, pre2: 3, 2: 4, pre1: 5, 1: 6 }
const LEVEL_LABEL = { 5: '5', 4: '4', 3: '3', pre2: '準2', 2: '2', pre1: '準1', 1: '1' }
const wordsBySpelling = new Map()
for (const word of ALL_WORDS) {
  const key = word.word.toLowerCase()
  if (!wordsBySpelling.has(key)) wordsBySpelling.set(key, word)
}
const entryOf = (part) => {
  if (part.startsWith('p:')) {
    const phrase = getPhrase(part.slice(2))
    return { text: phrase.phrase, level: phrase.level, pos: phrase.kind === 'syntax' ? '構' : '熟', meaning: phrase.meanings.join('・'), id: phrase.id }
  }
  const word = wordsBySpelling.get(part)
  return word ? { text: word.word, level: word.level, pos: word.pos, meaning: word.meaning, id: word.id } : { text: part, level: null, pos: '-', meaning: '（見出しなし）' }
}
const rank = (entry) => LEVEL_RANK[entry.level] ?? 7
const cut = (text, n) => (text.length > n ? `${text.slice(0, n)}…` : text)

const { reviewed = {}, toCard = {} } = readUsageGuideSurvey()
const cards = usageGuidePairCards()
const open = [...usageGuideSurveyPairs()]
  .filter(([key]) => isPhrasePair(key) === phraseMode && !reviewed[key] && !toCard[key] && !cards.has(key))
  .map(([key, why]) => {
    const [a, b] = key.split('|').map(entryOf)
    const [first, second] = rank(a) <= rank(b) ? [a, b] : [b, a]
    return { key, why, first, second, sort: [Math.max(rank(a), rank(b)), first.text.toLowerCase(), second.text.toLowerCase()] }
  })
  .sort((x, y) => x.sort[0] - y.sort[0] || x.sort[1].localeCompare(y.sort[1]) || x.sort[2].localeCompare(y.sort[2]))
  .slice(0, count)

const number = readdirSync(DIR).filter((name) => /^batch-\d+\.tsv$/.test(name)).length + 1
const file = `batch-${String(number).padStart(4, '0')}.tsv`
writeFileSync(new URL(file, DIR), open.map((row) => row.key).join('\n') + '\n')
console.log(`# ${file}（${open.length}組）`)
open.forEach((row, index) => {
  const note = row.first.id?.startsWith?.('p:') ? '' : (
    row.key.includes('p:')
      ? WORD_IDIOM_NOTES[`${[row.first, row.second].find((e) => e.pos !== '熟' && e.pos !== '構')?.id}|${[row.first, row.second].find((e) => e.pos === '熟' || e.pos === '構')?.id}`] ?? ''
      : relationNoteBetween(row.first.text, row.second.text)
  )
  const show = (entry) => `${entry.text}[${LEVEL_LABEL[entry.level] ?? '-'}${entry.pos}]${cut(entry.meaning, 20)}`
  console.log(`${index + 1}\t${show(row.first)}\t${show(row.second)}\t${row.why.join('・').replace(/熟語(と語)?・/g, '')}${note ? `\t${cut(note, 56)}` : ''}`)
})
