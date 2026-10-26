#!/usr/bin/env node
// 使い分けカード（src/data/usage-guides.js）にする組の候補を全部拾い、1組ずつ決めたかを確かめる。
// 母集団（requests/2026-10-26-usage-guide-cards.json）:
//   単語どうし: 類義語欄・反意語欄の全行、つづり注意の全組、使い分けの台帳（word-usage-notes.js）の全組、
//              代表義・ほかの意味の訳語が同じ組、訳語の漢字の語幹（見える・見る→見）が同じ組、使い分けカードの中の組。
//   熟語を含む組: 熟語どうしで訳語か語幹が同じ組、機能語（前置詞・副詞・冠詞など）1語だけがちがう熟語の組、
//              熟語と見出し語で訳語か語幹が同じ組、同じ意味の熟語の台帳（word-idiom-equivalents.js）の全組。
// 鍵: 単語は小文字のつづり、熟語は "p:熟語の id"。2つを並べ替えて | でつなぐ。
// 決め方: 使い分けカードに2つとも入っていれば決まり。カードにしない組は docs/audits/usage-guide-survey.json の
// reviewed に理由の略号を書く。語や熟語を足すと新しい組が出るので、読むまでこの確認は通らない。
import { readFileSync } from 'node:fs'
import { ALL_WORDS, getWord } from '../../src/data/vocab.js'
import { PHRASES } from '../../src/data/phrases.js'
import { SPELLING_CONFUSABLE_PAIRS } from '../../src/data/spelling-confusables.js'
import { WORD_USAGE_NOTES } from '../../src/data/word-usage-notes.js'
import { WORD_IDIOM_EQUIVALENTS } from '../../src/data/word-idiom-equivalents.js'
import { ALL_USAGE_GUIDES } from '../../src/data/usage-guides.js'

export const USAGE_GUIDE_SURVEY_PATH = new URL('../../docs/audits/usage-guide-survey.json', import.meta.url)

// カードにしない理由の略号。
export const USAGE_GUIDE_SKIP_REASONS = {
  別: '意味がちがう語で、訳語や漢字がたまたま重なっただけ。取り違える心配がない',
  近: 'ほぼ同じ意味で、たいていの場面で置きかえられる。注意すべき語法・場面の差がない',
  解: '差は意味の範囲だけで、関連語の行の1行の解説で足りる（例文で比べる語法・場面の罠がない）',
  ま: '片方がまれ・専門的・文語的な語で、生徒が使い分けを問われる場面がない',
  反: '反対・対照の意味の組で、取り違えることがない',
  形: '同じ語の別の形・つづり・品詞で、ほかの品詞の形の欄で覚える',
}

const pairKey = (a, b) => [a, b].sort().join('|')
const phraseKey = (id) => `p:${id}`

// 訳語を1つずつに分ける。（ ）の補足と〜を除く。
export const meaningTokens = (text) => String(text ?? '')
  .replace(/（[^）]*）|\([^)]*\)/g, '')
  .split(/[・、，,；;／/]/)
  .map((token) => token.replace(/[〜~…]/g, '').trim())
  .filter(Boolean)

// 「見える」「見る」の漢字の部分（送り仮名で終わる訳語だけ）。
const stemOf = (token) => token.match(/^([一-龯々]+)[ぁ-ん]+$/u)?.[1] ?? null

const FUNCTION_WORDS = new Set("a an the to of in on at for from with by about into onto out off up down over under away back through around along across after before as than be one's oneself it so too".split(' '))
const phraseTokens = (phrase) => phrase.toLowerCase().replace(/[~〜…]/g, '').split(/\s+/).filter(Boolean)
// 機能語1語だけがちがう（入れかわる・足される）か。
function differsByFunctionWord(a, b) {
  if (a.length === b.length) {
    const diff = a.map((token, i) => (token === b[i] ? -1 : i)).filter((i) => i >= 0)
    return diff.length === 1 && FUNCTION_WORDS.has(a[diff[0]]) && FUNCTION_WORDS.has(b[diff[0]])
  }
  const [short, long] = a.length < b.length ? [a, b] : [b, a]
  if (long.length - short.length !== 1) return false
  return long.some((token, i) => FUNCTION_WORDS.has(token) && [...long.slice(0, i), ...long.slice(i + 1)].join(' ') === short.join(' '))
}

function indexBy(items, keysOf) {
  const index = new Map()
  for (const item of items) {
    for (const key of new Set(keysOf(item))) {
      if (!index.has(key)) index.set(key, [])
      index.get(key).push(item)
    }
  }
  return index
}

/** 母集団の組（鍵 → 拾った理由の配列）。 */
export function usageGuideSurveyPairs() {
  const pairs = new Map()
  const add = (a, b, why) => {
    if (!a || !b || a === b) return
    const key = pairKey(a, b)
    if (!pairs.has(key)) pairs.set(key, new Set())
    pairs.get(key).add(why)
  }
  const spelling = (text) => String(text ?? '').trim().toLowerCase()
  for (const word of ALL_WORDS) {
    for (const item of word.synonyms ?? []) add(spelling(word.word), spelling(item.w), '類義語')
    for (const item of word.antonyms ?? []) add(spelling(word.word), spelling(item.w), '反意語')
  }
  for (const [a, b] of SPELLING_CONFUSABLE_PAIRS) add(spelling(getWord(a)?.word ?? a), spelling(getWord(b)?.word ?? b), 'つづり注意')
  for (const key of Object.keys(WORD_USAGE_NOTES)) {
    const [a, b] = key.split('|')
    add(a, b, '使い分け')
  }

  const wordMeanings = (word) => [...(word.meanings ?? []), ...(word.otherSenses ?? []).map((sense) => sense.meaning)].flatMap(meaningTokens)
  const wordsByToken = indexBy(ALL_WORDS, (word) => (word.meanings ?? []).flatMap(meaningTokens))
  const wordsByStem = indexBy(ALL_WORDS, (word) => wordMeanings(word).map(stemOf).filter(Boolean))
  const addWithin = (index, why) => {
    for (const items of index.values()) {
      for (let i = 0; i < items.length; i += 1) {
        for (let j = i + 1; j < items.length; j += 1) add(spelling(items[i].word), spelling(items[j].word), why)
      }
    }
  }
  addWithin(wordsByToken, '同じ訳語')
  addWithin(wordsByStem, '同じ語幹')

  const phrasesByToken = indexBy(PHRASES, (phrase) => (phrase.meanings ?? []).flatMap(meaningTokens))
  const phrasesByStem = indexBy(PHRASES, (phrase) => (phrase.meanings ?? []).flatMap(meaningTokens).map(stemOf).filter(Boolean))
  for (const [index, words, why] of [[phrasesByToken, wordsByToken, '同じ訳語'], [phrasesByStem, wordsByStem, '同じ語幹']]) {
    for (const [key, phrases] of index) {
      for (let i = 0; i < phrases.length; i += 1) {
        for (let j = i + 1; j < phrases.length; j += 1) add(phraseKey(phrases[i].id), phraseKey(phrases[j].id), `熟語・${why}`)
        for (const word of words.get(key) ?? []) add(phraseKey(phrases[i].id), spelling(word.word), `熟語と語・${why}`)
      }
    }
  }
  const tokens = PHRASES.map((phrase) => [phrase.id, phraseTokens(phrase.phrase)])
  for (let i = 0; i < tokens.length; i += 1) {
    for (let j = i + 1; j < tokens.length; j += 1) {
      if (differsByFunctionWord(tokens[i][1], tokens[j][1])) add(phraseKey(tokens[i][0]), phraseKey(tokens[j][0]), '機能語ちがいの熟語')
    }
  }
  for (const [wordId, phraseIds] of Object.entries(WORD_IDIOM_EQUIVALENTS)) {
    for (const phraseId of phraseIds) add(phraseKey(phraseId), spelling(getWord(wordId)?.word ?? wordId), '同じ意味の熟語')
  }
  for (const [key, members] of usageGuideMembers()) {
    for (let i = 0; i < members.length; i += 1) {
      for (let j = i + 1; j < members.length; j += 1) add(members[i], members[j], `カード ${key}`)
    }
  }
  return new Map([...pairs].map(([key, why]) => [key, [...why]]))
}

/** 使い分けカードの id → カードに入っている語・熟語の鍵。 */
export function usageGuideMembers() {
  return new Map(ALL_USAGE_GUIDES.map((guide) => [guide.id, [
    ...guide.wordIds.map((id) => String(getWord(id)?.word ?? id).toLowerCase()),
    ...guide.phraseIds.map(phraseKey),
  ]]))
}

/** 組 → その組が2つとも入っている使い分けカードの id。 */
export function usageGuidePairCards() {
  const cards = new Map()
  for (const [id, members] of usageGuideMembers()) {
    for (let i = 0; i < members.length; i += 1) {
      for (let j = i + 1; j < members.length; j += 1) {
        const key = pairKey(members[i], members[j])
        cards.set(key, [...(cards.get(key) ?? []), id])
      }
    }
  }
  return cards
}

export const isPhrasePair = (key) => key.split('|').some((part) => part.startsWith('p:'))

export function readUsageGuideSurvey() {
  try {
    return JSON.parse(readFileSync(USAGE_GUIDE_SURVEY_PATH, 'utf8'))
  } catch {
    return { reviewed: {} }
  }
}

/** 決めていない組・古い行・略号ちがい・カードと理由の両方がある組。 */
export function usageGuideSurveyGap() {
  const pairs = usageGuideSurveyPairs()
  const cards = usageGuidePairCards()
  const { reviewed = {} } = readUsageGuideSurvey()
  const undecided = { word: [], phrase: [] }
  for (const key of pairs.keys()) {
    if (cards.has(key) || reviewed[key]) continue
    undecided[isPhrasePair(key) ? 'phrase' : 'word'].push(key)
  }
  return {
    pairs: pairs.size,
    wordPairs: [...pairs.keys()].filter((key) => !isPhrasePair(key)).length,
    phrasePairs: [...pairs.keys()].filter(isPhrasePair).length,
    carded: [...pairs.keys()].filter((key) => cards.has(key)).length,
    undecided,
    stale: Object.keys(reviewed).filter((key) => !pairs.has(key)),
    badCodes: Object.entries(reviewed).filter(([, code]) => !USAGE_GUIDE_SKIP_REASONS[code]).map(([key, code]) => `${key}=${code}`),
    both: Object.keys(reviewed).filter((key) => cards.has(key)),
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const gap = usageGuideSurveyGap()
  console.log(`候補 ${gap.pairs}組（単語どうし ${gap.wordPairs}・熟語を含む ${gap.phrasePairs}）、カードに入った組 ${gap.carded}`)
  console.log(`未決: 単語 ${gap.undecided.word.length}・熟語 ${gap.undecided.phrase.length}／古い行 ${gap.stale.length}／略号ちがい ${gap.badCodes.length}／カードと理由の両方 ${gap.both.length}`)
  if (gap.undecided.word.length || gap.undecided.phrase.length || gap.stale.length || gap.badCodes.length || gap.both.length) process.exitCode = 1
}
