// 文法の参考書の文を、タップできる英単語・文法用語と、そのままの文字に分ける。
// 英単語の意味は、例文ごとの gloss → 参考書の語義表（be・助動詞・短縮形・不規則変化など）→
// 長文と同じ辞書の引き方、の順に引く。用語は本文の日本語から長いものを先に当て、
// 同じ節（まとまり）の中では最初の1回だけをタップできる形にする。

import { resolvePassageWord } from '../data/passage-gloss.js'
import { getWord } from '../data/vocab.js'
import { GRAMMAR_REFERENCE_WORDS } from '../data/grammar-reference/words.js'
import { GRAMMAR_REFERENCE_TERMS } from '../data/grammar-reference/terms.js'

const ENGLISH_WORD = /[A-Za-z][A-Za-z0-9]*(?:['’][A-Za-z]+)*(?:-[A-Za-z0-9]+(?:['’][A-Za-z]+)*)*/g
const TERMS_LONGEST_FIRST = [...GRAMMAR_REFERENCE_TERMS].sort((a, b) => b.term.length - a.term.length)

export const referenceWordKey = (surface) => String(surface ?? '').toLowerCase().replace(/’/g, "'")

function dictionaryMeaning(key) {
  return resolvePassageWord(key) ?? resolvePassageWord(key.replace(/'/g, '’'))
}

function withHeadword(entry) {
  const word = entry.id ? getWord(entry.id) : null
  const headword = word?.word && referenceWordKey(word.word) !== entry.key ? word.word : null
  return { ...entry, id: word ? entry.id : null, headword }
}

/**
 * 英単語1語の意味。見つからなければ null（その語はタップできない形で出す）。
 * gloss は例文ごとの指定 { 語: '意味' } または { 語: ['見出し語ID', '意味'] }。
 */
export function resolveReferenceWord(surface, gloss = null) {
  const key = referenceWordKey(surface)
  if (!key) return null
  const own = gloss ? (gloss[surface] ?? gloss[key]) : undefined
  if (own != null) {
    if (Array.isArray(own)) return withHeadword({ surface, key, ja: own[1], id: own[0] ?? null })
    return withHeadword({ surface, key, ja: own, id: dictionaryMeaning(key)?.id ?? null })
  }
  const fixed = GRAMMAR_REFERENCE_WORDS.get(key)
  if (fixed) return withHeadword({ surface, key, ja: fixed.ja, id: fixed.id })
  const possessive = key.match(/^(.+)'s$/)
  if (possessive) {
    const base = resolveReferenceWord(possessive[1])
    return base ? { ...base, surface, key, ja: `${base.ja}（’s が付いて「〜の」）` } : null
  }
  const found = dictionaryMeaning(key)
  return found ? withHeadword({ surface, key, ja: found.ja, id: found.id }) : null
}

// 本文の中の1文字の大文字（S・V・O・C や A and B の A・B）は記号なので引かない。I と a は語として引く。
// 「y → ies」「動詞ing」のような語尾の断片も語ではないので引かない。
const SUFFIX_FRAGMENTS = new Set(['s', 'es', 'ies', 'ves', 'ing', 'ed', 'd', 'er', 'est', 'ly', 'en', 'n'])
function isSymbolLetter(surface) {
  return (surface.length === 1 && surface !== 'I' && surface !== 'a') || SUFFIX_FRAGMENTS.has(surface)
}

// 大文字の May は、in May・on May 5 のように月の名前として使うことが多い。
// 前の語が in・on・of・since・until か、後ろが数字なら「5月」として引く。
const MONTH_MAY = Object.freeze({ key: 'may', ja: '5月', id: null, headword: null })
function contextualWord(parts, index, gloss) {
  const surface = parts[index].text
  if (surface === 'May' && !gloss?.May) {
    const previous = parts.slice(0, index).reverse().find((part) => part.kind === 'en')?.text?.toLowerCase()
    const after = parts.slice(index + 1).map((part) => part.text).join('')
    if (['in', 'on', 'of', 'since', 'until', 'by'].includes(previous) || /^\s*\d/.test(after)) {
      return { ...MONTH_MAY, surface }
    }
  }
  return resolveReferenceWord(surface, gloss)
}

/** 英語の部分と日本語の部分に分ける。 */
export function splitEnglish(text) {
  const parts = []
  let last = 0
  for (const match of String(text).matchAll(ENGLISH_WORD)) {
    if (match.index > last) parts.push({ kind: 'plain', text: text.slice(last, match.index) })
    parts.push({ kind: 'en', text: match[0] })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ kind: 'plain', text: text.slice(last) })
  return parts
}

function coveredByOtherWord(text, index, term, words) {
  return words.some((word) => {
    let from = text.indexOf(word)
    while (from !== -1) {
      if (from <= index && from + word.length >= index + term.length) return true
      from = text.indexOf(word, from + 1)
    }
    return false
  })
}

/** 用語の部分とそれ以外に分ける。用語の中に英字を含むもの（be動詞）も1つの用語として当てる。 */
export function splitTerms(text) {
  const source = String(text)
  const parts = []
  let buffer = ''
  let index = 0
  while (index < source.length) {
    const hit = TERMS_LONGEST_FIRST.find((entry) => (
      source.startsWith(entry.term, index)
      && !coveredByOtherWord(source, index, entry.term, entry.notIn)
      // be動詞の be のように、英単語の途中から当てない（maybe動詞 などを避ける）。
      && !(/^[A-Za-z]/.test(entry.term) && /[A-Za-z]/.test(source[index - 1] ?? ''))
    ))
    if (hit) {
      if (buffer) parts.push({ kind: 'text', text: buffer })
      parts.push({ kind: 'term', text: hit.term, term: hit.term })
      buffer = ''
      index += hit.term.length
      continue
    }
    buffer += source[index]
    index += 1
  }
  if (buffer) parts.push({ kind: 'text', text: buffer })
  return parts
}

/**
 * 解説の文を部品に分ける。seen はそのまとまりで既に出した用語（最初の1回だけをタップできるようにする）。
 * 返す部品: { kind: 'plain', text } / { kind: 'word', text, word } / { kind: 'term', text, term }
 */
export function explanationParts(text, seen = new Set()) {
  const parts = []
  for (const piece of splitTerms(text)) {
    if (piece.kind === 'term') {
      if (seen.has(piece.term)) {
        parts.push({ kind: 'plain', text: piece.text })
      } else {
        seen.add(piece.term)
        parts.push(piece)
      }
      continue
    }
    const pieces = splitEnglish(piece.text)
    pieces.forEach((part, index) => {
      if (part.kind !== 'en' || isSymbolLetter(part.text)) {
        parts.push({ kind: 'plain', text: part.text })
        return
      }
      const word = contextualWord(pieces, index, null)
      parts.push(word ? { kind: 'word', text: part.text, word } : { kind: 'plain', text: part.text })
    })
  }
  return mergePlain(parts)
}

/** 例文の英語を部品に分ける。例文の語はすべて引く（1文字の大文字も語として引く）。 */
export function exampleParts(en, gloss = null) {
  const parts = []
  const pieces = splitEnglish(en)
  pieces.forEach((part, index) => {
    if (part.kind !== 'en') {
      parts.push({ kind: 'plain', text: part.text })
      return
    }
    const word = contextualWord(pieces, index, gloss)
    parts.push(word ? { kind: 'word', text: part.text, word } : { kind: 'plain', text: part.text })
  })
  return mergePlain(parts)
}

function mergePlain(parts) {
  const merged = []
  for (const part of parts) {
    const previous = merged.at(-1)
    if (part.kind === 'plain' && previous?.kind === 'plain') previous.text += part.text
    else merged.push({ ...part })
  }
  return merged
}

// ページ1枚分を、描く順に部品へ分けておく。用語は、まとまり（ここで学ぶことと基本の形／ポイント1つ／
// 言いかえ／間違えやすいところ／発展／チェック）ごとに最初の1回だけをタップできる形にする。
const prepareExample = (example) => (example
  ? { ...example, parts: exampleParts(example.en, example.gloss) }
  : null)

function prepareBlock(block) {
  const seen = new Set()
  const title = explanationParts(block.title, seen)
  const text = block.text.map((paragraph) => explanationParts(paragraph, seen))
  const table = block.table
    ? {
        head: block.table.head.map((cell) => explanationParts(cell, seen)),
        rows: block.table.rows.map((row) => row.map((cell) => explanationParts(cell, seen))),
      }
    : null
  return { ...block, titleParts: title, textParts: text, tableParts: table, examples: block.examples.map(prepareExample) }
}

export function prepareReferenceUnit(unit) {
  const intro = new Set()
  const leadParts = explanationParts(unit.lead, intro)
  const forms = unit.forms.map((form) => ({
    ...form,
    labelParts: explanationParts(form.label, intro),
    formParts: explanationParts(form.form, intro),
    example: prepareExample(form.example),
  }))
  const rewriteSeen = new Set()
  const mistakeSeen = new Set()
  const checkSeen = new Set()
  return {
    ...unit,
    leadParts,
    forms,
    points: unit.points.map(prepareBlock),
    rewrites: unit.rewrites.map((rewrite) => ({
      ...rewrite,
      fromParts: exampleParts(rewrite.from),
      toParts: exampleParts(rewrite.to),
      noteParts: explanationParts(rewrite.note, rewriteSeen),
    })),
    mistakes: unit.mistakes.map((mistake) => ({
      ...mistake,
      wrongParts: exampleParts(mistake.wrong),
      rightParts: exampleParts(mistake.right),
      whyParts: explanationParts(mistake.why, mistakeSeen),
    })),
    advanced: unit.advanced ? prepareBlock(unit.advanced) : null,
    checkParts: unit.check.map((item) => explanationParts(item, checkSeen)),
  }
}
