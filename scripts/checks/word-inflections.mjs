// 変化形の台帳（src/data/word-inflections.js）が、母集団の全組をおおっているかを確かめる。
// 母集団: 品詞が名・動・形・副の全見出し語の代表の品詞と、意味欄の品詞の印（「報告(名)」）と
// ほかの意味（word-senses.js が otherSenses に入れる）で加わる品詞。
// tests/word-inflections-review.test.mjs が使う。
import { ALL_WORDS } from '../../src/data/vocab.js'
import { WORD_INFLECTIONS } from '../../src/data/word-inflections.js'

export const INFLECTED_POS = ['名', '動', '形', '副']

/** 見出し語 word が変化形を持つ品詞（代表の品詞が先）。 */
export function inflectionPosOf(word) {
  if (!INFLECTED_POS.includes(word.pos)) return []
  const list = [word.pos]
  for (const meaning of word.meanings ?? []) {
    const tag = meaning.match(/[(（](.)[)）]$/)?.[1]
    if (tag && INFLECTED_POS.includes(tag) && !list.includes(tag)) list.push(tag)
  }
  for (const sense of word.otherSenses ?? []) {
    if (INFLECTED_POS.includes(sense.pos) && !list.includes(sense.pos)) list.push(sense.pos)
  }
  return list
}

const FORM = "[A-Za-z][A-Za-z.' -]*"
const FORMS = `=?英?${FORM}(?:/=?英?${FORM})*`
const NOTE = '(?:#[^#]+)?'
const OF = `of:${FORM}:[^#:]+`
export const VALUE_PATTERNS = {
  動: new RegExp(`^(?:${FORMS}(?:\\|${FORMS}){3}|助:${FORMS}|-|${OF})${NOTE}$`),
  名: new RegExp(`^(?:(?:C|CU):${FORMS}|U|SG|PL|P)${NOTE}$`),
  形: new RegExp(`^(?:${FORMS}\\|${FORMS}|-|${OF})${NOTE}$`),
  副: new RegExp(`^(?:${FORMS}\\|${FORMS}|-|${OF})${NOTE}$`),
}

export function wordInflectionGap(words = ALL_WORDS, ledger = WORD_INFLECTIONS) {
  const byId = new Map(words.map((word) => [word.id, word]))
  const heads = new Set(words.map((word) => word.word))
  const missing = []
  const badValues = []
  const badBases = []
  let population = 0
  let covered = 0
  for (const word of words) {
    for (const pos of inflectionPosOf(word)) {
      population += 1
      const value = ledger[word.id]?.[pos]
      if (value === undefined) {
        missing.push(`${word.id}（${pos}）`)
        continue
      }
      covered += 1
      if (!VALUE_PATTERNS[pos].test(value)) badValues.push(`${word.id}（${pos}）: ${value}`)
      const base = value.match(/^of:([^:]+):/)?.[1]
      if (base && !heads.has(base)) badBases.push(`${word.id}（${pos}）: ${base}`)
    }
  }
  const extra = []
  for (const [id, record] of Object.entries(ledger)) {
    const word = byId.get(id)
    const allowed = word ? inflectionPosOf(word) : []
    for (const pos of Object.keys(record)) if (!allowed.includes(pos)) extra.push(`${id}（${pos}）`)
  }
  return { population, covered, missing, extra, badValues, badBases }
}
