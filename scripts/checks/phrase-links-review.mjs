#!/usr/bin/env node
// 単語から熟語・構文へのつながりを全件1件ずつ読んだかを確かめる。
// 読んだ語は docs/audits/phrase-links-review.json の reviewed に id を入れる（つながりが1件もない語は入れない）。
// 外したつながりは src/data/phrase-link-exclusions.js に理由つきで書く。同じつづりの別の語の熟語は
// homograph-words.js の phraseIds でその語へ移す（元の語のカードからは外れる）。
// 見出し語や熟語・構文を足すと、つながりのある語を読むまでこの確認は通らない。
import { readFileSync } from 'node:fs'
import { ALL_WORDS, getWord } from '../../src/data/vocab.js'
import { PHRASE_LINK_EXCLUDED } from '../../src/data/phrase-link-exclusions.js'
import { phraseLinkCandidates } from '../../src/lib/wordPhrases.js'

export const PHRASE_LINKS_REVIEW_PATH = new URL('../../docs/audits/phrase-links-review.json', import.meta.url)

/** つながりの全件・読んでいない語・台帳に残った古い行。 */
export function phraseLinksReviewGap() {
  const ledger = JSON.parse(readFileSync(PHRASE_LINKS_REVIEW_PATH, 'utf8'))
  const reviewed = new Set(ledger.reviewed ?? [])
  const keys = new Set()
  const words = []
  for (const word of ALL_WORDS) {
    const links = phraseLinkCandidates(word)
    if (!links.length) continue
    words.push(word.id)
    for (const phrase of links) keys.add(`${word.id}|${phrase.id}`)
  }
  const missing = words.filter((id) => !reviewed.has(id))
  const staleReviewed = [...reviewed].filter((id) => !getWord(id) || !words.includes(id))
  const staleExcluded = Object.keys(PHRASE_LINK_EXCLUDED).filter((key) => !keys.has(key))
  const noReason = Object.entries(PHRASE_LINK_EXCLUDED).filter(([, reason]) => !String(reason ?? '').trim()).map(([key]) => key)
  // 同じつづりの別の語へ移すと決めたつながりは、移す先の見出し語ができ、その語の熟語になっているまで止める。
  const unmoved = Object.entries(ledger.moves ?? {}).filter(([key, targetId]) => {
    const phraseId = key.split('|')[1]
    const target = getWord(targetId)
    return !target || !phraseLinkCandidates(target).some((phrase) => phrase.id === phraseId) || keys.has(key)
  }).map(([key, targetId]) => `${key}→${targetId}`)
  return {
    words: words.length,
    links: keys.size,
    excluded: Object.keys(PHRASE_LINK_EXCLUDED).length,
    reviewed: words.length - missing.length,
    missing,
    staleReviewed,
    staleExcluded,
    noReason,
    unmoved,
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const gap = phraseLinksReviewGap()
  console.log(`熟語・構文のつながりの見直し: ${gap.reviewed}/${gap.words} 語（つながり ${gap.links} 件・外したもの ${gap.excluded} 件）`)
  if (gap.missing.length) console.log(`まだ読んでいない語（先頭20）: ${gap.missing.slice(0, 20).join(', ')}`)
  if (gap.staleReviewed.length) console.log(`つながりのない語・辞書にない id: ${gap.staleReviewed.join(', ')}`)
  if (gap.staleExcluded.length) console.log(`つながりでなくなった外した行: ${gap.staleExcluded.join(' ')}`)
  if (gap.noReason.length) console.log(`理由のない行: ${gap.noReason.join(' ')}`)
  if (gap.unmoved.length) console.log(`同じつづりの別の語へまだ移していないつながり: ${gap.unmoved.join(' ')}`)
  process.exit(gap.missing.length || gap.staleReviewed.length || gap.staleExcluded.length || gap.noReason.length || gap.unmoved.length ? 1 : 0)
}
