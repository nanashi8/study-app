// 単語カードと辞書ページに出す、その語と組にして押さえたい語をまとめて引く。
// - 品詞がちがうだけで同じ語から来た形（人が読んで決めた word-forms.js）
// - 意味が同じ・近い語（単語データの類義語欄）
// - 意味が反対の語（単語データの反意語欄）
// - 同じ意味の熟語（人が読んで決めた word-idiom-equivalents.js）
// 類義語・反対語・同じ意味の熟語の行には、人が1組ずつ書いた解説（word-relation-notes.js）を添える。
// - つづりが似ていて間違えやすい語（spelling-confusables.js）
// - 日本語に定着したカタカナ語（loanword-hints.js）
// 自作単語は辞書の台帳に載らないので、類義語欄だけを見る。
import { getWord } from '../data/vocab.js'
import { getPhrase } from '../data/phrases.js'
import { WORD_IDIOM_EQUIVALENTS } from '../data/word-idiom-equivalents.js'
import { SPELLING_CONFUSABLE_EXTRAS, SPELLING_CONFUSABLE_PAIRS } from '../data/spelling-confusables.js'
import { LOANWORD_HINTS } from '../data/loanword-hints.js'
import { WORD_FORM_EXTRAS, WORD_FORM_GROUPS, WORD_FORM_NOTES, WORD_FORM_SENSES } from '../data/word-forms.js'
import { WORD_SENSES } from '../data/word-senses.js'
import { WORD_USAGE_NOTES } from '../data/word-usage-notes.js'
import { WORD_IDIOM_NOTES, WORD_RELATION_NOTES } from '../data/word-relation-notes.js'

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

/**
 * 類義語・反対語の行に添える解説。使い分けの台帳（word-usage-notes.js）に書いた組はそれを、
 * なければ類義語・反対語の解説の台帳（word-relation-notes.js）を返す。なければ空文字。
 */
export function relationNoteBetween(a, b) {
  const x = String(a ?? '').toLowerCase()
  const y = String(b ?? '').toLowerCase()
  if (!x || !y || x === y) return ''
  const key = [x, y].sort().join('|')
  return WORD_USAGE_NOTES[key] ?? WORD_RELATION_NOTES[key] ?? ''
}

const withRelationNote = (base, item, text) => {
  const note = relationNoteBetween(base, text)
  return note ? { ...item, usageNote: note } : item
}

// ほかの品詞の形を並べる順。
const FORM_POS_ORDER = ['動', '名', '形', '副']
export const FORM_POS_LABELS = { 動: '動詞', 名: '名詞', 形: '形容詞', 副: '副詞' }

// 意味欄で、ほかの品詞の意味に付けた印（「夢・夢を見る(動)」の「夢を見る(動)」）。
const MARKED_SEGMENT = /^(.+)\((名|動|形|副)\)$/u

/**
 * 見出し語が使われる品詞と、その品詞の意味。先頭は見出し語の品詞（意味は印のない部分）。
 * 意味欄の「〜する(動)」の印、word-senses.js のほかの意味、人が足した WORD_FORM_SENSES を読む。
 */
export function posSensesFor(word) {
  if (!word?.id || !FORM_POS_ORDER.includes(word.pos)) return []
  const segments = String(word.meaning ?? '').split('・')
  const primary = segments.filter((segment) => !MARKED_SEGMENT.test(segment)).join('・')
  const senses = [{ pos: word.pos, meaning: primary || String(word.meaning ?? '') }]
  const add = (pos, meaning) => {
    if (!FORM_POS_ORDER.includes(pos) || !meaning) return
    const found = senses.find((sense) => sense.pos === pos)
    if (!found) senses.push({ pos, meaning })
    else if (!found.meaning.split('・').includes(meaning)) found.meaning = `${found.meaning}・${meaning}`
  }
  for (const segment of segments) {
    const marked = segment.match(MARKED_SEGMENT)
    if (marked) add(marked[2], marked[1])
  }
  for (const sense of WORD_SENSES[word.id] ?? []) add(sense.pos, sense.meaning)
  for (const [pos, meaning] of WORD_FORM_SENSES[word.id] ?? []) add(pos, meaning)
  return senses
}

const byFormOrder = (a, b) =>
  FORM_POS_ORDER.indexOf(a.pos) - FORM_POS_ORDER.indexOf(b.pos) ||
  Number(Boolean(a.extra)) - Number(Boolean(b.extra)) ||
  a.word.localeCompare(b.word)

/**
 * 同じ語から来た語を、ほかの品詞の形（other）と同じ品詞の派生語（same）に分けて返す。
 * - 品詞がちがう語（decide に対する decision）は other。
 * - 見出し語の品詞が同じでも、ほかの品詞で使う意味を持つ語（dreamer に対する dream「夢を見る」）は、
 *   その品詞の形として other に出す。
 * - それ以外の同じ品詞の語（music に対する musician、decision に対する decisiveness）は same。
 * 意味が広がった・ずれた語には、ずれ方の説明（formNote）を、使い分けがある組には使い分け（usageNote）をつける。
 * 辞書に見出しのない形（extra）は、見出し語の形のあとに並べる。
 */
export function wordFamilyFor(word) {
  if (!word?.id || word.custom) return { other: [], same: [] }
  const members = new Set([word.id])
  for (const group of FORM_GROUPS_BY_WORD.get(word.id) ?? []) for (const id of group) members.add(id)
  const seen = new Set([word.word.toLowerCase()])
  const other = []
  const same = []
  const place = (item, spelling) => {
    const withNote = withUsage(word.word, item, spelling)
    if (withNote.pos !== word.pos) other.push(withNote)
    else same.push(withNote)
  }
  for (const id of members) {
    const member = id === word.id ? null : getWord(id)
    if (!member || !FORM_POS_ORDER.includes(member.pos) || seen.has(member.word.toLowerCase())) continue
    seen.add(member.word.toLowerCase())
    const item = WORD_FORM_NOTES[id] ? { ...member, formNote: WORD_FORM_NOTES[id] } : member
    const sense = member.pos === word.pos ? posSensesFor(member).find((entry) => entry.pos !== word.pos) : null
    place(sense ? { ...item, pos: sense.pos, meaning: sense.meaning } : item, member.word)
  }
  // 辞書に見出しのない形は、まとまりのどの語から拾ったものでも並べる（decide の decisiveness など）。
  for (const id of members) {
    for (const extra of FORM_EXTRAS_BY_WORD.get(id) ?? []) {
      const key = extra.word.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      place(extra, extra.word)
    }
  }
  return { other: other.sort(byFormOrder), same: same.sort(byFormOrder) }
}

/** ほかの品詞の形（wordFamilyFor の other）。動詞・名詞・形容詞・副詞の順。 */
export function wordFormsFor(word) {
  return wordFamilyFor(word).other
}

/** 同じ品詞の派生語（wordFamilyFor の same）。 */
export function sameFormsFor(word) {
  return wordFamilyFor(word).same
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
    items.push(withRelationNote(word?.word, { w: text, m: item.m ?? '', ...(item.id ? { id: item.id } : {}) }, text))
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
    items.push(withRelationNote(word?.word, { w: text, m: item.m ?? '', ...(item.id ? { id: item.id } : {}) }, text))
  }
  return items
}

/** 同じ意味の熟語。1語との使い分け（word-relation-notes.js の WORD_IDIOM_NOTES）があれば usageNote に持たせる。 */
export function idiomEquivalentsFor(word) {
  if (!word?.id || word.custom) return []
  return (WORD_IDIOM_EQUIVALENTS[word.id] ?? [])
    .map((id) => getPhrase(id))
    .filter(Boolean)
    .map((phrase) => {
      const note = WORD_IDIOM_NOTES[`${word.id}|${phrase.id}`]
      return note ? { ...phrase, usageNote: note } : phrase
    })
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
  const family = wordFamilyFor(word)
  // 品詞がちがうだけの同じ語の形（metallic に対する metal）は、類義語・反対語ではなく、ほかの品詞の形の欄だけに出す。
  const otherPosForms = new Set(family.other.map((item) => item.word.toLowerCase()))
  const notForm = (item) => !otherPosForms.has(String(item.w).toLowerCase())
  const synonyms = synonymWordsFor(word, { exclude: idioms.map((phrase) => phrase.phrase) }).filter(notForm)
  const antonyms = antonymWordsFor(word).filter(notForm)
  const confusables = confusablesFor(word)
  // 同じ品詞の派生語のうち、類義語・反対語・つづりが似た語の欄に出る語（respectable と respectful）は、そちらだけに出す。
  const elsewhere = new Set([
    ...synonyms.map((item) => item.w),
    ...antonyms.map((item) => item.w),
    ...confusables.map((item) => item.word.word),
  ].map((text) => String(text).toLowerCase()))
  const forms = family.other
  const sameForms = family.same.filter((item) => !elsewhere.has(item.word.toLowerCase()))
  // 辞書ページの派生語欄（単語データの derivatives）には、形の欄に出す語を重ねない。
  const formWords = new Set([...family.other, ...family.same].map((item) => item.word.toLowerCase()))
  const derivatives = (word?.derivatives ?? []).filter((item) => !formWords.has(String(item.w).toLowerCase()))
  return {
    forms,
    sameForms,
    formOwnNote: wordFormOwnNote(word),
    derivatives,
    synonyms,
    antonyms,
    idioms,
    confusables,
    usagePartners: usagePartnersFor(word, [
      ...forms.map((item) => item.word),
      ...sameForms.map((item) => item.word),
      ...synonyms.map((item) => item.w),
      ...antonyms.map((item) => item.w),
      ...confusables.map((item) => item.word.word),
    ]),
    loanword: loanwordHintFor(word),
  }
}
