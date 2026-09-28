// 形は似ているが元の語がちがう語（src/data/lookalike-forms.js）を、画面と確認スクリプトのために引く。
// contempt の画面なら「contemp で始まる語」「tempt の形を含む語」のまとまりごとに、
// 同じ由来の語と、ほかの由来の語（つながり・説明）を返す。
import { etymologyStoryForWord, getWord } from '../data/vocab.js'
import { LOOKALIKE_FORMS, LOOKALIKE_LINKS, LOOKALIKE_NOTES } from '../data/lookalike-forms.js'
import { lookalikeKindLabel } from './lookalikeOrigins.js'

const splitWords = (text) => String(text ?? '').trim().split(/\s+/).filter(Boolean)
const pairKey = (a, b) => [String(a), String(b)].sort().join('|')

/**
 * 形の似た語のまとまり。[{ form, groups: [{ ids, part }], ids, tip }]
 * groups は由来ごとの語。part は、似て見える部分だけが同じ由来のまとまり（over- の語など。台帳では頭に ~）。
 */
export const lookalikeForms = LOOKALIKE_FORMS.map(([form, groups, tip]) => {
  const parsed = groups.map((text) => ({ part: String(text).startsWith('~'), ids: splitWords(String(text).replace(/^~/, '')) }))
  return { form, groups: parsed, ids: parsed.flatMap((group) => group.ids), tip: tip ?? '' }
})

const LINKS = new Map(LOOKALIKE_LINKS.map(([a, b, kind, note]) => [pairKey(a, b), { kind, note }]))

/** 同じまとまりの2つの由来のつながり。台帳に書いたつながりがあればそれ、なければ別の語源。 */
export function lookalikeGroupRelation(x, y) {
  for (const a of x.ids) {
    for (const b of y.ids) {
      const link = LINKS.get(pairKey(a, b))
      if (link) return link
    }
  }
  return { kind: 'unrelated', note: '' }
}

/**
 * 1つの形の似た語のまとまりで決まる、2語のつながり。{ kind, note } か null。
 * 同じ由来 → 同じ語源（似て見える部分だけが同じ由来の語どうしは、後ろの部分がちがうので決めない）。
 */
export function relationInForm(entry, a, b) {
  const x = entry.groups.find((group) => group.ids.includes(a))
  const y = entry.groups.find((group) => group.ids.includes(b))
  if (!x || !y) return null
  if (x === y) return x.part ? null : { kind: 'same', note: '' }
  return lookalikeGroupRelation(x, y)
}

const FORMS_BY_WORD = new Map()
lookalikeForms.forEach((entry, index) => {
  for (const id of entry.ids) {
    if (!FORMS_BY_WORD.has(id)) FORMS_BY_WORD.set(id, [])
    FORMS_BY_WORD.get(id).push(index)
  }
})

/** 語が入る形の似た語のまとまり（lookalikeForms の番号）。 */
export const lookalikeFormIndexesOf = (id) => FORMS_BY_WORD.get(id) ?? []

/** 2語のつながり（どれかの形の似た語のまとまりで決まるもの）。{ kind, note } か null。 */
export function lookalikeFormRelation(a, b) {
  for (const index of lookalikeFormIndexesOf(a)) {
    const relation = relationInForm(lookalikeForms[index], a, b)
    if (relation) return relation
  }
  return null
}

/** 由来の説明。台帳に書いた説明があればそれ、なければその語の「語の成り立ち」。 */
export const lookalikeFamilyNote = (id) => LOOKALIKE_NOTES[id] ?? etymologyStoryForWord(id)?.note ?? ''

// 似ている形で始まる語だけのまとまりは「〜で始まる語」、接頭辞のあとに形が続く語を含むなら「〜の形を含む語」。
const headingOf = (entry) => {
  const startsAll = entry.ids.every((id) => String(getWord(id)?.word ?? '').toLowerCase().startsWith(entry.form))
  return startsAll ? `${entry.form} で始まる語` : `${entry.form} の形を含む語`
}

const KIND_ORDER = { same: 0, distant: 1, unclear: 2, unrelated: 3 }
const wordsOf = (ids) => ids.map((id) => getWord(id)).filter(Boolean)

/**
 * 単語の画面に出す「形は似ているが元の語がちがう語」。語が入る形の似た語のまとまりごとに1つ。
 * [{ form, heading, tip, siblings: [語], rows: [{ kind, label, words, relationNote, note }] }]
 * - siblings … 同じまとまりで、同じ由来の語（contempt に対する contemptible）。似て見える部分だけが同じ由来の
 *              まとまり（over- の語）では、後ろの部分がちがう語なので並べない。
 * - rows     … ほかの由来の語。この語とのつながり（遠い親戚・はっきりしない・別の語源）の近い順。
 *              relationNote は由来どうしのつながりの説明（書いた組だけ）、note はその由来の説明（語の成り立ち）。
 */
export function lookalikeFormSectionsForWord(word) {
  if (!word?.id || word.custom) return []
  const sections = []
  for (const index of lookalikeFormIndexesOf(word.id)) {
    const entry = lookalikeForms[index]
    const own = entry.groups.find((group) => group.ids.includes(word.id))
    const rows = entry.groups
      .filter((group) => group !== own)
      .map((group) => {
        const relation = lookalikeGroupRelation(own, group)
        return {
          kind: relation.kind,
          label: lookalikeKindLabel(relation.kind),
          words: wordsOf(group.ids),
          relationNote: relation.note,
          note: lookalikeFamilyNote(group.ids[0]),
        }
      })
      .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind])
    sections.push({
      form: entry.form,
      heading: headingOf(entry),
      tip: entry.tip,
      siblings: own.part ? [] : wordsOf(own.ids.filter((id) => id !== word.id)),
      rows,
    })
  }
  return sections
}
