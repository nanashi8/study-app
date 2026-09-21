#!/usr/bin/env node
// 同じまとまりに入る同じ品詞の語の組（music と musician、economic と economical）の全件について、
// 使い分けを書いた（word-usage-notes.js の WORD_USAGE_NOTES）か、書かない理由を残した（WORD_USAGE_NOT_NEEDED）かを確かめる。
// 理由の台帳に、同じ品詞の組でなくなった行が残っていても止める（台帳が実態から離れないように）。
import { ALL_WORDS } from '../../src/data/vocab.js'
import { WORD_USAGE_NOTES, WORD_USAGE_NOT_NEEDED } from '../../src/data/word-usage-notes.js'
import { wordFamilyFor } from '../../src/lib/wordRelations.js'

const pairKey = (a, b) => [String(a).toLowerCase(), String(b).toLowerCase()].sort().join('|')

/** 同じ品詞の組の全件と、使い分けも理由もない組、理由の台帳に残った組でない行。 */
export function samePosUsageGap() {
  const pairs = new Set()
  for (const word of ALL_WORDS) {
    for (const item of wordFamilyFor(word).same) pairs.add(pairKey(word.word, item.word))
  }
  const missing = [...pairs].filter((key) => !WORD_USAGE_NOTES[key] && !WORD_USAGE_NOT_NEEDED[key]).sort()
  const stale = Object.keys(WORD_USAGE_NOT_NEEDED).filter((key) => !pairs.has(key)).sort()
  return { pairs: pairs.size, missing, stale }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const gap = samePosUsageGap()
  console.log(`同じ品詞の組: ${gap.pairs - gap.missing.length}/${gap.pairs} 組（使い分けか、書かない理由がある）`)
  if (gap.missing.length) console.log(`まだ決めていない組（先頭30）: ${gap.missing.slice(0, 30).join(' ')}`)
  if (gap.stale.length) console.log(`同じ品詞の組でなくなった理由の行: ${gap.stale.join(' ')}`)
  process.exit(gap.missing.length || gap.stale.length ? 1 : 0)
}
