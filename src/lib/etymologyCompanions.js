// ── 語源カードの補助関連語 ──────────────────────────────────────────
// 表示数を埋めるための推測はしない。次の、全件監査できる関係だけを使う。
//   1. 同じ語根IDを持つ
//   2. 接頭辞・接尾辞の形と意味がともに一致する
//   3. 収録データで類義語・反義語として明記されている
// 単なる部分一致、同じ分野・級・品詞、広い由来分類の一致は関係の根拠にしない。
import { ALL_WORDS, getRoot, rootIdsForWord } from '../data/vocab.js'

// 1枚で読み切れる数に絞る。根拠のある候補が無いカードは空でよい。
export const COMPANION_LIMIT = 8

export const ETYMOLOGY_COMPANION_KINDS = Object.freeze([
  'shared-root',
  'shared-part',
  'synonym',
  'antonym',
])

const KIND_RANK = {
  'shared-root': 0,
  'shared-part': 1,
  synonym: 2,
  antonym: 3,
}

const LEVEL_RANK = { 5: 0, 4: 1, 3: 2, pre2: 3, 2: 4, pre1: 5, 1: 6 }

const compact = (value = '') =>
  String(value).toLowerCase().normalize('NFKC').replace(/[^a-z]/g, '')

// 意味が書かれていない部品や語幹は「同じ部品」の教材根拠にしない。
const reusableAffixParts = (word) =>
  (word.etymology?.parts ?? []).filter((part) =>
    ['prefix', 'suffix'].includes(part.kind) &&
    compact(part.t).length > 0 &&
    String(part.gloss ?? '').trim().length > 0)

// つづりと意味の両方が同じときだけ、同じ部品として扱う。
// river の -er と teacher の -er のような同形異義を混ぜない。
export const etymologyPartKey = (part) =>
  `${part.kind}:${compact(part.t)}:${String(part.gloss ?? '').trim()}`

const partLabel = (part) => {
  const form = part.kind === 'prefix' ? `${part.t}-` : `-${part.t}`
  const kind = part.kind === 'prefix' ? '接頭辞' : '接尾辞'
  return `${kind} ${form}（${String(part.gloss).trim()}）`
}

const HEAD_INDEX = new Map()
const ID_INDEX = new Map()
const byRoot = new Map()
const byPart = new Map()

const push = (map, key, word) => {
  if (!key) return
  if (!map.has(key)) map.set(key, [])
  map.get(key).push(word)
}

for (const word of ALL_WORDS) {
  const key = compact(word.word)
  if (key && !HEAD_INDEX.has(key)) HEAD_INDEX.set(key, word)
  ID_INDEX.set(word.id, word)
  for (const rootId of rootIdsForWord(word)) push(byRoot, rootId, word)
  for (const part of reusableAffixParts(word)) push(byPart, etymologyPartKey(part), word)
}

const headword = (value) => HEAD_INDEX.get(compact(value))

/**
 * カードの語との関係を機械検証できる補助関連語だけを返す。
 * 戻り値: { word, reason, kind, rank, evidence }
 */
export function etymologyCompanions(pack, { limit = COMPANION_LIMIT } = {}) {
  if (!pack || limit <= 0) return []
  const studyIds = new Set(pack.studyIds ?? [])
  const studyWords = (pack.studyIds ?? []).map((id) => ID_INDEX.get(id)).filter(Boolean)
  const found = new Map()

  const add = (word, reason, kind, evidence) => {
    if (!word || studyIds.has(word.id) || !ETYMOLOGY_COMPANION_KINDS.includes(kind)) return
    const rank = KIND_RANK[kind]
    const current = found.get(word.id)
    if (!current || rank < current.rank) {
      found.set(word.id, { word, reason, kind, rank, evidence })
    }
  }

  // 1. 同じ語根ID。語根の形だけでなく意味も理由に表示する。
  for (const source of studyWords) {
    for (const rootId of rootIdsForWord(source)) {
      const root = getRoot(rootId)
      const label = root
        ? `${root.form}（${root.meaning}）`
        : rootId
      for (const other of byRoot.get(rootId) ?? []) {
        add(other, `同じ語根 ${label}`, 'shared-root', {
          sourceWordId: source.id,
          rootId,
        })
      }
    }
  }

  // 2. 接頭辞・接尾辞は、形と意味がともに一致する場合だけ使う。
  for (const source of studyWords) {
    for (const part of reusableAffixParts(source)) {
      const key = etymologyPartKey(part)
      for (const other of byPart.get(key) ?? []) {
        add(other, `同じ${partLabel(part)}`, 'shared-part', {
          sourceWordId: source.id,
          partKey: key,
        })
      }
    }
  }

  // 3. 意味の関係は、各語のデータに明記された相手だけを使う。
  for (const source of studyWords) {
    for (const item of source.synonyms ?? []) {
      const other = headword(item?.w ?? item)
      add(other, `「${source.word}」の一つの意味に近い`, 'synonym', {
        sourceWordId: source.id,
      })
    }
    for (const item of source.antonyms ?? []) {
      const other = headword(item?.w ?? item)
      add(other, `「${source.word}」の一つの意味と反対・対照`, 'antonym', {
        sourceWordId: source.id,
      })
    }
  }

  return [...found.values()]
    .sort((a, b) =>
      a.rank - b.rank ||
      (LEVEL_RANK[a.word.level] ?? 99) - (LEVEL_RANK[b.word.level] ?? 99) ||
      a.word.word.localeCompare(b.word.word, 'en'))
    .slice(0, Math.min(limit, COMPANION_LIMIT))
}
