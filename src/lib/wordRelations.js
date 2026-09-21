// 単語カードと辞書ページに出す、その語と組にして押さえたい語をまとめて引く。
// - 品詞がちがうだけで同じ語から来た形（人が読んで決めた word-forms.js）
// - 意味が同じ・近い語（単語データの類義語欄）
// - 意味が反対の語（単語データの反意語欄）
// - 同じ意味の熟語（人が読んで決めた word-idiom-equivalents.js）
// - つづりが似ていて間違えやすい語（spelling-confusables.js）
// - 日本語に定着したカタカナ語（loanword-hints.js）
// 自作単語は辞書の台帳に載らないので、類義語欄だけを見る。
import { getWord } from '../data/vocab.js'
import { getPhrase } from '../data/phrases.js'
import { WORD_IDIOM_EQUIVALENTS } from '../data/word-idiom-equivalents.js'
import { SPELLING_CONFUSABLE_EXTRAS, SPELLING_CONFUSABLE_PAIRS } from '../data/spelling-confusables.js'
import { LOANWORD_HINTS } from '../data/loanword-hints.js'
import { WORD_FORM_EXTRAS, WORD_FORM_GROUPS, WORD_FORM_NOTES } from '../data/word-forms.js'
import { WORD_USAGE_NOTES } from '../data/word-usage-notes.js'

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

const FORM_GROUPS_BY_WORD = new Map()
for (const group of WORD_FORM_GROUPS) {
  for (const id of group) {
    if (!FORM_GROUPS_BY_WORD.has(id)) FORM_GROUPS_BY_WORD.set(id, [])
    FORM_GROUPS_BY_WORD.get(id).push(group)
  }
}

// 辞書に見出しのない形。もとの見出し語ごとにまとめる。
const FORM_EXTRAS_BY_WORD = new Map()
for (const [of, word, pos, meaning, phonetic, note] of WORD_FORM_EXTRAS) {
  if (!FORM_EXTRAS_BY_WORD.has(of)) FORM_EXTRAS_BY_WORD.set(of, [])
  FORM_EXTRAS_BY_WORD.get(of).push({ word, pos, meaning, phonetic, ...(note ? { formNote: note } : {}), extra: true })
}

// 辞書に見出しのない、つづりが似た別の語。
const CONFUSABLE_EXTRAS_BY_WORD = new Map()
for (const [of, word, meaning, phonetic] of SPELLING_CONFUSABLE_EXTRAS) {
  if (!CONFUSABLE_EXTRAS_BY_WORD.has(of)) CONFUSABLE_EXTRAS_BY_WORD.set(of, [])
  CONFUSABLE_EXTRAS_BY_WORD.get(of).push({ id: null, word, meaning, phonetic, level: null })
}

// 使い分けを書いた相手を、語ごとに引けるようにする。
const USAGE_PARTNERS = new Map()
for (const key of Object.keys(WORD_USAGE_NOTES)) {
  const [a, b] = key.split('|')
  for (const [from, to] of [[a, b], [b, a]]) {
    if (!USAGE_PARTNERS.has(from)) USAGE_PARTNERS.set(from, [])
    USAGE_PARTNERS.get(from).push(to)
  }
}
const EXTRA_BY_SPELLING = new Map()
for (const [, word, pos, meaning, phonetic] of WORD_FORM_EXTRAS) {
  if (!EXTRA_BY_SPELLING.has(word.toLowerCase())) EXTRA_BY_SPELLING.set(word.toLowerCase(), { word, pos, meaning, phonetic, extra: true })
}

/** 2語の使い分け（word-usage-notes.js）。なければ空文字。 */
export function usageNoteBetween(a, b) {
  const x = String(a ?? '').toLowerCase()
  const y = String(b ?? '').toLowerCase()
  if (!x || !y || x === y) return ''
  return WORD_USAGE_NOTES[[x, y].sort().join('|')] ?? ''
}

const withUsage = (base, item, text) => {
  const note = usageNoteBetween(base, text)
  return note ? { ...item, usageNote: note } : item
}

// ほかの品詞の形を並べる順。
const FORM_POS_ORDER = ['動', '名', '形', '副']
export const FORM_POS_LABELS = { 動: '動詞', 名: '名詞', 形: '形容詞', 副: '副詞' }

/**
 * 品詞がちがうだけで同じ語から来た形を、動詞・名詞・形容詞・副詞の順に辞書の語で返す。
 * いま見ている語と同じ品詞の語は、使い分けがあるときだけ出す（decide なら decision・decisive・decisively）。
 * 意味が広がった・ずれた形には、ずれ方の説明（formNote）をつける。
 * 辞書に見出しのない形（extra）は、見出し語の形のあとに並べる。
 */
export function wordFormsFor(word) {
  if (!word?.id || word.custom) return []
  const members = new Set([word.id])
  for (const group of FORM_GROUPS_BY_WORD.get(word.id) ?? []) for (const id of group) members.add(id)
  const seen = new Set([word.word.toLowerCase()])
  const forms = []
  const push = (item) => forms.push(withUsage(word.word, item, item.word))
  for (const id of members) {
    const other = id === word.id ? null : getWord(id)
    if (!other || !FORM_POS_ORDER.includes(other.pos) || seen.has(other.word.toLowerCase())) continue
    // 同じ品詞の形（economic と economical）は、使い分けがあるときだけ参考に出す。
    if (other.pos === word.pos && !usageNoteBetween(word.word, other.word)) continue
    seen.add(other.word.toLowerCase())
    push(WORD_FORM_NOTES[id] ? { ...other, formNote: WORD_FORM_NOTES[id] } : other)
  }
  // 辞書に見出しのない形は、まとまりのどの語から拾ったものでも並べる（decide の decisiveness など）。
  for (const id of members) {
    for (const extra of FORM_EXTRAS_BY_WORD.get(id) ?? []) {
      const key = extra.word.toLowerCase()
      if (seen.has(key)) continue
      if (extra.pos === word.pos && !usageNoteBetween(word.word, extra.word)) continue
      seen.add(key)
      push(extra)
    }
  }
  return forms.sort((a, b) =>
    FORM_POS_ORDER.indexOf(a.pos) - FORM_POS_ORDER.indexOf(b.pos) ||
    Number(Boolean(a.extra)) - Number(Boolean(b.extra)) ||
    a.word.localeCompare(b.word))
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

/**
 * 類義語欄の語を {w, m} で返す。exclude にある語（同じ意味の熟語の欄に出すもの）は除く。
 * 同じつづりの別の語を指す項目は、リンク先の id も持たせたまま返す。
 */
export function synonymWordsFor(word, { exclude = [] } = {}) {
  const seen = new Set([String(word?.word ?? '').toLowerCase(), ...exclude.map((text) => text.toLowerCase())])
  const items = []
  for (const item of word?.synonyms ?? []) {
    const text = String(item?.w ?? '').trim()
    const key = text.toLowerCase()
    if (!text || seen.has(key)) continue
    seen.add(key)
    items.push(withUsage(word?.word, { w: text, m: item.m ?? '', ...(item.id ? { id: item.id } : {}) }, text))
  }
  return items
}

/** 反意語欄の語を {w, m} で返す。つづりが同じ項目は1つにまとめる。 */
export function antonymWordsFor(word) {
  const seen = new Set([String(word?.word ?? '').toLowerCase()])
  const items = []
  for (const item of word?.antonyms ?? []) {
    const text = String(item?.w ?? '').trim()
    const key = text.toLowerCase()
    if (!text || seen.has(key)) continue
    seen.add(key)
    items.push(withUsage(word?.word, { w: text, m: item.m ?? '', ...(item.id ? { id: item.id } : {}) }, text))
  }
  return items
}

export function idiomEquivalentsFor(word) {
  if (!word?.id || word.custom) return []
  return (WORD_IDIOM_EQUIVALENTS[word.id] ?? []).map((id) => getPhrase(id)).filter(Boolean)
}

export function confusablesFor(word) {
  if (!word?.id || word.custom) return []
  const others = [
    ...(CONFUSABLES_BY_WORD.get(word.id) ?? []).map((id) => getWord(id)).filter(Boolean),
    ...(CONFUSABLE_EXTRAS_BY_WORD.get(word.id) ?? []),
  ]
  return others.map((other) => withUsage(word.word, {
    word: other,
    segments: spellingDifference(word.word, other.word),
    sameSound: Boolean(soundKey(word)) && soundKey(word) === soundKey(other),
  }, other.word))
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

/** 意味がずれた語自身の、もとの語からの筋道（party なら「part（部分）から、分かれた一団→…」）。 */
export function wordFormOwnNote(word) {
  if (!word?.id || word.custom) return ''
  return WORD_FORM_NOTES[word.id] ?? ''
}

/**
 * 使い分けを書いた相手のうち、ほかの欄（ほかの品詞の形・類義語・反対語・つづりが似た語）に出ていない語。
 * 同じ品詞の組（percent と percentage）など、ほかの欄に出ない使い分けをここで示す。
 */
export function usagePartnersFor(word, shown = []) {
  if (!word?.word || word.custom) return []
  const seen = new Set([word.word.toLowerCase(), ...shown.map((text) => String(text).toLowerCase())])
  const items = []
  for (const partner of USAGE_PARTNERS.get(word.word.toLowerCase()) ?? []) {
    if (seen.has(partner)) continue
    seen.add(partner)
    const entry = getWord(partner.replace(/[^a-z0-9]+/g, '_'))
    const note = usageNoteBetween(word.word, partner)
    if (entry) items.push({ ...entry, usageNote: note })
    else if (EXTRA_BY_SPELLING.has(partner)) items.push({ ...EXTRA_BY_SPELLING.get(partner), usageNote: note })
  }
  return items
}

export function wordRelationsFor(word) {
  const idioms = idiomEquivalentsFor(word)
  const forms = wordFormsFor(word)
  const synonyms = synonymWordsFor(word, { exclude: idioms.map((phrase) => phrase.phrase) })
  const antonyms = antonymWordsFor(word)
  const confusables = confusablesFor(word)
  return {
    forms,
    formOwnNote: wordFormOwnNote(word),
    synonyms,
    antonyms,
    idioms,
    confusables,
    usagePartners: usagePartnersFor(word, [
      ...forms.map((item) => item.word),
      ...synonyms.map((item) => item.w),
      ...antonyms.map((item) => item.w),
      ...confusables.map((item) => item.word.word),
    ]),
    loanword: loanwordHintFor(word),
  }
}
