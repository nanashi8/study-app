#!/usr/bin/env node
// 熟語・構文の中で、見出し語がカードにない品詞として使われていないかを洗い出す。
// 名詞・形容詞だけの語が熟語の先頭で前置詞・副詞を従える（spring from・face up to）か to のあとにある → 動詞の意味が要る
// 動詞・形容詞だけの語が冠詞・前置詞のあとにある（at will・fall in love）→ 名詞の意味が要る
// be・get などのあとにある（be subject to・be late for）→ 形容詞の意味が要る
// 拾った行は、見出し語にその品詞の意味（意味欄の印・word-senses.js・word-forms.js の WORD_FORM_SENSES）を足すか、
// 足さない理由を docs/audits/phrase-senses-review.json に略号で書く。見出し語や熟語を足すと、読むまでこの確認は通らない。
import { readFileSync } from 'node:fs'
import { ALL_WORDS } from '../../src/data/vocab.js'
import { phrasesForWord } from '../../src/lib/wordPhrases.js'
import { posSensesFor } from '../../src/lib/wordRelations.js'

export const PHRASE_SENSES_REVIEW_PATH = new URL('../../docs/audits/phrase-senses-review.json', import.meta.url)

// 足さない理由の略号。
export const PHRASE_SENSE_REASONS = {
  機能語: '前置詞・接続詞・代名詞・数量を表す語などで、熟語の中の働きを品詞の意味として足す語ではない',
  成句: '決まった言い方の一部で、熟語として覚える（at first・for sure・in short など）',
  意味あり: 'その品詞の意味は、意味欄やほかの意味にすでにある',
  同品詞: '熟語の中でも、見出し語と同じ品詞で使っている',
}

const PARTICLES = new Set(['up', 'down', 'out', 'off', 'on', 'in', 'into', 'with', 'for', 'from', 'to', 'at', 'by', 'about', 'over', 'away', 'back',
  'through', 'around', 'upon', 'after', 'against', 'under', 'along', 'across', 'of'])
const NOUN_SLOT = new Set(['a', 'an', 'the', 'at', 'in', 'on', 'by', 'of', 'my', 'your', 'his', 'her', 'our', 'their', 'its', "one's", 'with', 'no',
  'free', 'good', 'bad', 'own', 'against', 'for'])
const ADJECTIVE_SLOT = new Set(['be', 'is', 'are', 'was', 'get', 'feel', 'become', 'seem'])

/** 熟語の中の位置から、カードにない品詞で使っていそうな行（語 id|熟語 id → 足りない品詞）。 */
export function phraseSenseHits() {
  const hits = new Map()
  for (const word of ALL_WORDS) {
    const head = word.word.toLowerCase()
    if (!/^[a-z]+$/.test(head)) continue
    const posSet = new Set(posSensesFor(word).map((sense) => sense.pos))
    for (const phrase of phrasesForWord(word)) {
      if (phrase.kind && phrase.kind !== 'idiom') continue
      const tokens = phrase.phrase.toLowerCase().replace(/[~.?!,]/g, ' ').split(/\s+/).filter(Boolean)
      const at = tokens.indexOf(head)
      if (at < 0) continue
      const next = tokens[at + 1]
      const prev = tokens[at - 1]
      const key = `${word.id}|${phrase.id}`
      if (!posSet.has('動') && ((at === 0 && next && PARTICLES.has(next)) || ['to', 'will', "can't"].includes(prev))) hits.set(key, '動')
      else if (!posSet.has('名') && prev && NOUN_SLOT.has(prev) && !['前', '代'].includes(word.pos)) hits.set(key, '名')
      else if (!posSet.has('形') && ADJECTIVE_SLOT.has(prev) && word.pos !== '動') hits.set(key, '形')
    }
  }
  return hits
}

/** 拾った行のうち、理由のないもの・拾われなくなった理由の行・略号がちがう行。 */
export function phraseSensesGap() {
  const ledger = JSON.parse(readFileSync(PHRASE_SENSES_REVIEW_PATH, 'utf8'))
  const reviewed = ledger.reviewed ?? {}
  const hits = phraseSenseHits()
  return {
    hits: hits.size,
    undecided: [...hits.keys()].filter((key) => !reviewed[key]),
    stale: Object.keys(reviewed).filter((key) => !hits.has(key)),
    badCodes: Object.entries(reviewed).filter(([, code]) => !PHRASE_SENSE_REASONS[code]).map(([key]) => key),
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--list')) {
    for (const [key, pos] of phraseSenseHits()) console.log(`${key}\t${pos}`)
    process.exit(0)
  }
  const gap = phraseSensesGap()
  console.log(`熟語の中の品詞の洗い出し: ${gap.hits} 行（理由のない行 ${gap.undecided.length}・拾われなくなった理由の行 ${gap.stale.length}・略号ちがい ${gap.badCodes.length}）`)
  for (const key of gap.undecided.slice(0, 30)) console.log(`  理由がない: ${key}`)
  for (const key of gap.stale) console.log(`  拾われなくなった: ${key}`)
  process.exit(gap.undecided.length || gap.stale.length || gap.badCodes.length ? 1 : 0)
}
