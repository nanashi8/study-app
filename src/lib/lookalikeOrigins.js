// つづりが似た語は語源がつながっているのか（src/data/lookalike-origins.js）を、画面と確認スクリプトのために引く。
// - 語根カードの似た語の母集団の決め方（どのカード・どの形・どの語を比べるか）もここに置き、
//   scripts/checks/lookalike-origins.mjs と画面で同じ決まりを使う。
import { ETYMOLOGY_PACKS, getWord } from '../data/vocab.js'
import { WORD_FORM_GROUPS } from '../data/word-forms.js'
import {
  CONFUSABLE_ORIGINS,
  LOOKALIKE_KINDS,
  ROOT_LOOKALIKES,
  ROOT_LOOKALIKE_LINKS,
} from '../data/lookalike-origins.js'

/** 接頭辞・接尾辞のカード（語ではなく語の一部の形を教えるカード）か。 */
export const isAffixCard = (card) =>
  card.rootId.startsWith('pf-') ||
  card.rootId.startsWith('sf-') ||
  /^-|-$/.test(String(card.rootForm).split('/')[0].trim())

const formsOf = (card) => [...new Set(
  String(card.rootForm).split('/').map((form) => form.trim().replace(/-/g, '')).filter(Boolean),
)]

/** 似た語を拾うのに使う、カードの3文字以上の形。 */
export const lookalikeFormsOf = (card) => formsOf(card).filter((form) => form.length >= 3)

/** 似た語を比べる語根カード（接頭辞・接尾辞のカードを除く）。 */
export const LOOKALIKE_ROOT_CARDS = Object.freeze(ETYMOLOGY_PACKS.filter((card) => !isAffixCard(card)))

const FORM_GROUPS_BY_WORD = new Map()
for (const group of WORD_FORM_GROUPS) {
  for (const id of group) {
    if (!FORM_GROUPS_BY_WORD.has(id)) FORM_GROUPS_BY_WORD.set(id, [])
    FORM_GROUPS_BY_WORD.get(id).push(group)
  }
}

/** カードの語と、その語の形のまとまり（humiliate に対する humiliation）。 */
export function cardFamilyIds(card) {
  const ids = new Set()
  for (const id of card.coverageIds) {
    ids.add(id)
    for (const group of FORM_GROUPS_BY_WORD.get(id) ?? []) for (const member of group) ids.add(member)
  }
  return ids
}

// 比べるつづり。大文字で始まる語（Monday）も小文字にしてカードの形と比べる。
const spellingOf = (word) => String(word.word).toLowerCase()

// 接頭辞のカードに入っている語の、頭にある接頭辞の形（suppose の sup）。
const PREFIXES_BY_WORD = new Map()
for (const card of ETYMOLOGY_PACKS.filter((pack) => pack.rootId.startsWith('pf-'))) {
  const forms = formsOf(card)
  for (const id of card.coverageIds) {
    const word = getWord(id)
    if (!word) continue
    for (const form of forms) {
      if (!spellingOf(word).startsWith(form)) continue
      if (!PREFIXES_BY_WORD.has(id)) PREFIXES_BY_WORD.set(id, new Set())
      PREFIXES_BY_WORD.get(id).add(form)
    }
  }
}

/** 語がカードの形とどう似ているか（^hum はつづりの頭、ex+hum は接頭辞のすぐあと）。似ていなければ空。 */
export function lookalikeMatches(card, word) {
  const spelling = spellingOf(word)
  const matches = []
  for (const form of lookalikeFormsOf(card)) {
    if (spelling.startsWith(form)) matches.push(`^${form}`)
    for (const prefix of PREFIXES_BY_WORD.get(word.id) ?? []) {
      if (spelling.slice(prefix.length).startsWith(form)) matches.push(`${prefix}+${form}`)
    }
  }
  return matches
}

/** 比べる見出し語（自作の単語を除く全見出し語。Monday・post office のような語も、小文字にして比べる）。 */
export const lookalikeWordPool = (words) => words.filter((word) => word?.id && !word.custom)

/**
 * 語根カードの似た語の母集団。カード id → Map(語の id → 似ている所)。
 * カードの形で始まるか、接頭辞のすぐあとにその形が続き、カードの語にもその形のまとまりにも入っていない語。
 */
export function rootLookalikeCandidates(words) {
  const pool = lookalikeWordPool(words)
  const out = new Map()
  for (const card of LOOKALIKE_ROOT_CARDS) {
    const family = cardFamilyIds(card)
    const found = new Map()
    for (const word of pool) {
      if (family.has(word.id)) continue
      const matches = lookalikeMatches(card, word)
      if (matches.length) found.set(word.id, matches)
    }
    if (found.size) out.set(card.rootId, found)
  }
  return out
}

const splitWords = (text) => String(text).trim().split(/\s+/).filter(Boolean)

/**
 * 台帳のカードごとのまとまり。[{ kind, ids, note, affix }]
 * affix は、似て見える部分が接頭辞（para-・de- など）で、まとまりの語どうしは接頭辞だけが同じもの。
 */
export function lookalikeGroupsOf(rootId) {
  return (ROOT_LOOKALIKES[rootId] ?? []).map(([kind, ids, note, flag]) => ({
    kind,
    ids: splitWords(ids),
    note,
    affix: flag === 'affix',
  }))
}

const CARDS_BY_ROOT = new Map(ETYMOLOGY_PACKS.map((card) => [card.rootId, card]))
const RELATED = new Set(['same', 'distant'])

/**
 * 同じカードの2つのまとまりのつながり（ROOT_LOOKALIKE_LINKS に書いた組はそれを使う）。
 * カードの語根を通して決まる組だけを返す。どちらもカードの語根とつながる → 遠い親戚（どちらも same なら同じ語源）、
 * 一方だけつながる → 別の語源。どちらもつながらない組・はっきりしない組は、台帳に書いたときだけ返す（ほかは null）。
 */
export function groupRelation(rootId, a, b) {
  const groups = lookalikeGroupsOf(rootId)
  const [x, y] = [groups[a], groups[b]]
  if (!x || !y) return null
  // 接頭辞だけが同じまとまりの語どうしは、後ろの語がちがうので決めない。
  if (a === b) return x.affix ? null : { kind: 'same', note: '' }
  for (const [first, second, kind, note] of ROOT_LOOKALIKE_LINKS[rootId] ?? []) {
    const hit = (group, id) => group.ids.includes(id)
    if ((hit(x, first) && hit(y, second)) || (hit(x, second) && hit(y, first))) return { kind, note }
  }
  if (RELATED.has(x.kind) && RELATED.has(y.kind)) {
    return { kind: x.kind === 'same' && y.kind === 'same' ? 'same' : 'distant', note: '' }
  }
  if ((RELATED.has(x.kind) && y.kind === 'unrelated') || (x.kind === 'unrelated' && RELATED.has(y.kind))) {
    return { kind: 'unrelated', note: '' }
  }
  return null
}

// 語の id → その語が出てくるカード（カードの語として・似た語として）。
const SECTIONS_BY_WORD = new Map()
const addSection = (id, entry) => {
  if (!SECTIONS_BY_WORD.has(id)) SECTIONS_BY_WORD.set(id, [])
  SECTIONS_BY_WORD.get(id).push(entry)
}
for (const rootId of Object.keys(ROOT_LOOKALIKES)) {
  const card = CARDS_BY_ROOT.get(rootId)
  if (!card) continue
  for (const id of cardFamilyIds(card)) addSection(id, { rootId, group: -1 })
  lookalikeGroupsOf(rootId).forEach((group, index) => {
    for (const id of group.ids) addSection(id, { rootId, group: index })
  })
}

const KIND_ORDER = { same: 0, distant: 1, unclear: 2, unrelated: 3 }
const byKind = (a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]
const wordsOf = (ids) => ids.map((id) => getWord(id)).filter(Boolean)

export const lookalikeKindLabel = (kind) => LOOKALIKE_KINDS[kind] ?? ''

/**
 * 語根カードの似た語の欄（カードの画面用）。カードの語根とのつながりの近い順に、まとまりを並べる。
 * [{ kind, label, words, note }]
 */
export function lookalikeRowsForCard(rootId) {
  return lookalikeGroupsOf(rootId)
    .map((group) => ({ kind: group.kind, label: lookalikeKindLabel(group.kind), words: wordsOf(group.ids), note: group.note }))
    .filter((row) => row.words.length)
    .sort(byKind)
}

// 「このカードと同じ stāre から」→「語根 sta のカードと同じ stāre から」
const cardNamedNotes = (card) => {
  const name = `語根 ${String(card.rootForm).split('/')[0].trim()} のカード`
  return (row) => (row.note.includes('このカード') ? { ...row, note: row.note.replaceAll('このカード', name) } : row)
}

/**
 * 単語の画面に出す「つづりが似た語は同じ語源？」。語が出てくるカードごとに1つの欄を返す。
 * - カードの語（とその形のまとまり）: カードの似た語のまとまりを、カードの語根とのつながりで並べる。
 * - 似た語: まずカードの語とのつながり（その語のまとまりの説明）、続けて同じカードのほかの似た語とのつながり。
 * [{ card, role: 'family' | 'lookalike', siblings?: [語], rows: [{ kind, label, words, note, card? }] }]
 */
export function lookalikeSectionsForWord(word) {
  if (!word?.id || word.custom) return []
  const sections = []
  for (const { rootId, group } of SECTIONS_BY_WORD.get(word.id) ?? []) {
    const card = CARDS_BY_ROOT.get(rootId)
    // 台帳の説明の「このカード」は語源カードの画面の言い方なので、単語の画面では語根の名前で言う。
    const named = cardNamedNotes(card)
    if (group < 0) {
      const rows = lookalikeRowsForCard(rootId).map(named)
      if (rows.length) sections.push({ card, role: 'family', rows })
      continue
    }
    const groups = lookalikeGroupsOf(rootId)
    const own = groups[group]
    const rows = [{
      kind: own.kind,
      label: lookalikeKindLabel(own.kind),
      words: wordsOf(card.coverageIds),
      note: own.note,
      card: true,
    }]
    const others = []
    groups.forEach((other, index) => {
      if (index === group) return
      const relation = groupRelation(rootId, group, index)
      const words = wordsOf(other.ids)
      if (!relation || !words.length) return
      others.push({
        kind: relation.kind,
        label: lookalikeKindLabel(relation.kind),
        words,
        note: relation.note ? `${relation.note}${other.note}` : other.note,
      })
    })
    // 同じまとまりのほかの語（humane に対する human）は、同じ説明なので語だけ並べる。
    // 接頭辞だけが同じまとまり（affix）の語どうしは由来がちがうので並べない。
    const siblings = own.affix ? [] : wordsOf(own.ids.filter((id) => id !== word.id))
    sections.push({ card, role: 'lookalike', siblings, rows: [...rows, ...others.sort(byKind)].map(named) })
  }
  return sections
}

const pairKey = (a, b) => [String(a), String(b)].sort().join('|')

/** つづり注意の組の語源のつながり。{ kind, label, note } か null。 */
export function confusableOriginBetween(a, b) {
  const entry = CONFUSABLE_ORIGINS[pairKey(a, b)]
  if (!entry) return null
  const [kind, note] = entry
  return { kind, label: lookalikeKindLabel(kind), note }
}
