// 単語カードと辞書ページに出す、その語と組にして押さえたい語をまとめて引く。
// - 意味が同じ・近い語（単語データの類義語欄）
// - 同じ意味の熟語（人が読んで決めた word-idiom-equivalents.js）
// - つづりが似ていて間違えやすい語（spelling-confusables.js）
// - 日本語に定着したカタカナ語（loanword-hints.js）
// 自作単語は辞書の台帳に載らないので、類義語欄だけを見る。
import { getWord } from '../data/vocab.js'
import { getPhrase } from '../data/phrases.js'
import { WORD_IDIOM_EQUIVALENTS } from '../data/word-idiom-equivalents.js'
import { SPELLING_CONFUSABLE_PAIRS } from '../data/spelling-confusables.js'
import { LOANWORD_HINTS } from '../data/loanword-hints.js'

// 強勢記号や区切りを除いて、発音記号が同じかを比べる。
const IPA_MARKS = /[ˈˌ/.\s]/gu
const soundKey = (word) => String(word?.phonetic ?? '').replace(IPA_MARKS, '')

const CONFUSABLES_BY_WORD = new Map()
for (const [a, b] of SPELLING_CONFUSABLE_PAIRS) {
  for (const [from, to] of [[a, b], [b, a]]) {
    if (!CONFUSABLES_BY_WORD.has(from)) CONFUSABLES_BY_WORD.set(from, [])
    CONFUSABLES_BY_WORD.get(from).push(to)
  }
}

/**
 * other のつづりを、base と比べてちがう文字とそうでない文字に分けて返す。
 * 2語に共通する並び（最長共通部分列）に入らない文字を「ちがう文字」とする。
 */
export function spellingDifference(base, other) {
  const a = String(base ?? '').toLowerCase()
  const b = String(other ?? '')
  const lowerB = b.toLowerCase()
  const lengths = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lengths[i][j] = a[i] === lowerB[j]
        ? lengths[i + 1][j + 1] + 1
        : Math.max(lengths[i + 1][j], lengths[i][j + 1])
    }
  }
  const changed = new Array(b.length).fill(true)
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === lowerB[j]) {
      changed[j] = false
      i += 1
      j += 1
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      i += 1
    } else {
      j += 1
    }
  }
  const segments = []
  for (let k = 0; k < b.length; k += 1) {
    const last = segments[segments.length - 1]
    if (last && last.changed === changed[k]) last.text += b[k]
    else segments.push({ text: b[k], changed: changed[k] })
  }
  return segments
}

/** 類義語欄の語を {w, m} で返す。exclude にある語（同じ意味の熟語の欄に出すもの）は除く。 */
export function synonymWordsFor(word, { exclude = [] } = {}) {
  const seen = new Set([String(word?.word ?? '').toLowerCase(), ...exclude.map((text) => text.toLowerCase())])
  const items = []
  for (const item of word?.synonyms ?? []) {
    const text = String(item?.w ?? '').trim()
    const key = text.toLowerCase()
    if (!text || seen.has(key)) continue
    seen.add(key)
    items.push({ w: text, m: item.m ?? '' })
  }
  return items
}

export function idiomEquivalentsFor(word) {
  if (!word?.id || word.custom) return []
  return (WORD_IDIOM_EQUIVALENTS[word.id] ?? []).map((id) => getPhrase(id)).filter(Boolean)
}

export function confusablesFor(word) {
  if (!word?.id || word.custom) return []
  return (CONFUSABLES_BY_WORD.get(word.id) ?? [])
    .map((id) => getWord(id))
    .filter(Boolean)
    .map((other) => ({
      word: other,
      segments: spellingDifference(word.word, other.word),
      sameSound: Boolean(soundKey(word)) && soundKey(word) === soundKey(other),
    }))
}

/**
 * カタカナ語の手がかり。意味欄にすでに同じカタカナが出ていて、注意書きも無いときは重ねて出さない。
 */
export function loanwordHintFor(word) {
  if (!word?.id || word.custom) return null
  const hint = LOANWORD_HINTS[word.id]
  if (!hint) return null
  const shownInMeaning = (word.meanings ?? []).some((meaning) => meaning.includes(hint.kana))
  if (shownInMeaning && !hint.note) return null
  return { kana: hint.kana, note: hint.note ?? '' }
}

export function wordRelationsFor(word) {
  const idioms = idiomEquivalentsFor(word)
  return {
    synonyms: synonymWordsFor(word, { exclude: idioms.map((phrase) => phrase.phrase) }),
    idioms,
    confusables: confusablesFor(word),
    loanword: loanwordHintFor(word),
  }
}
