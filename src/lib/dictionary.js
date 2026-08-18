// ── 英和辞書の見出し索引 ────────────────────────────────────────────────
// 単語・熟語・構文を1本の見出しリストにまとめ、紙の辞書と同じABC順に並べる。
//   go → go abroad → go ahead → go along with → goal → goat …
// 単語だけ・熟語だけを別の場所に置かず、同じ並びの中で引けるようにするための土台。
import { ALL_WORDS } from '../data/vocab.js'
import { PHRASES } from '../data/phrases.js'
import {
  normalizeVocabQuery,
  phraseMatchRank,
  vocabMatchRank,
} from './vocabSearch.js'

export const DICTIONARY_TYPES = [
  { id: 'word', label: '単語', color: '#6366f1' },
  { id: 'idiom', label: '熟語', color: '#0ea5e9' },
  { id: 'syntax', label: '構文', color: '#8b5cf6' },
]

export const DICTIONARY_TYPE_META = Object.fromEntries(
  DICTIONARY_TYPES.map((type) => [type.id, type]),
)

const TYPE_ORDER = Object.fromEntries(DICTIONARY_TYPES.map((type, i) => [type.id, i]))

// ABC順に並べるためのキー。
//   ・大文字小文字は区別しない
//   ・構文の「〜」「…」は語の切れ目（スペース）として扱う
//   ・アポストロフィやハイフンなどの記号は無視する
// スペースはどの英字より前に来るので、"go" → "go abroad" → "goal" の順になる。
export function dictionarySortKey(head = '') {
  return String(head)
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[’]/g, "'")
    .replace(/[~〜…]/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// 見出しの頭文字（A〜Z）。英字で始まらない見出しは「#」にまとめる。
export function dictionaryInitial(head = '') {
  const first = dictionarySortKey(head).charAt(0)
  return first >= 'a' && first <= 'z' ? first.toUpperCase() : '#'
}

// ABC順。つづりが同じときは 単語 → 熟語 → 構文、最後は id で並びを固定する。
export function compareDictionaryEntries(a, b) {
  if (a.sortKey !== b.sortKey) return a.sortKey < b.sortKey ? -1 : 1
  const order = TYPE_ORDER[a.type] - TYPE_ORDER[b.type]
  if (order) return order
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
}

const buildEntry = (source) =>
  source.type === 'word'
    ? {
        id: `word:${source.word.id}`,
        type: 'word',
        head: source.word.word,
        level: source.word.level,
        meaning: source.word.meaning,
        sortKey: dictionarySortKey(source.word.word),
        word: source.word,
      }
    : {
        id: `${source.phrase.kind}:${source.phrase.id}`,
        type: source.phrase.kind,
        head: source.phrase.phrase,
        level: source.phrase.level,
        meaning: source.phrase.meaning,
        sortKey: dictionarySortKey(source.phrase.phrase),
        phrase: source.phrase,
      }

// 単語・熟語・構文をまぜたまま、通しでABC順に並べた全見出し。
export const DICTIONARY_ENTRIES = [
  ...ALL_WORDS.map((word) => buildEntry({ type: 'word', word })),
  ...PHRASES.map((phrase) => buildEntry({ type: 'phrase', phrase })),
].sort(compareDictionaryEntries)

export const DICTIONARY_COUNTS = DICTIONARY_ENTRIES.reduce(
  (counts, entry) => ({ ...counts, [entry.type]: (counts[entry.type] ?? 0) + 1 }),
  { word: 0, idiom: 0, syntax: 0 },
)

// 頭文字ごとの索引（A〜Z、その他は #）。見出しの並びはABC順のまま。
const ENTRIES_BY_INITIAL = new Map()
for (const entry of DICTIONARY_ENTRIES) {
  const initial = dictionaryInitial(entry.head)
  if (!ENTRIES_BY_INITIAL.has(initial)) ENTRIES_BY_INITIAL.set(initial, [])
  ENTRIES_BY_INITIAL.get(initial).push(entry)
}

export const DICTIONARY_INITIALS = [...ENTRIES_BY_INITIAL.keys()]
  .sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a < b ? -1 : 1))
  .map((letter) => ({ letter, count: ENTRIES_BY_INITIAL.get(letter).length }))

const matchesType = (entry, type) => type === 'all' || entry.type === type

export function dictionaryByInitial(letter, { type = 'all' } = {}) {
  const entries = ENTRIES_BY_INITIAL.get(letter) ?? []
  return type === 'all' ? entries : entries.filter((entry) => matchesType(entry, type))
}

// 見出し一致 → 意味一致 → 例文・成り立ちなど、の順。小さいほど上位。
export function dictionaryMatchRank(entry, query) {
  return entry.type === 'word'
    ? vocabMatchRank(entry.word, query)
    : phraseMatchRank(entry.phrase, query)
}

/**
 * 単語・熟語・構文をまとめて検索する。
 * 一致の強さでまとめたうえで、同じ強さのものは辞書と同じABC順に並べる。
 */
export function searchDictionary(rawQuery, { type = 'all' } = {}) {
  const query = normalizeVocabQuery(rawQuery)
  if (!query) return []
  const hits = []
  for (const entry of DICTIONARY_ENTRIES) {
    if (!matchesType(entry, type)) continue
    const rank = dictionaryMatchRank(entry, query)
    if (rank >= 0) hits.push({ entry, rank })
  }
  hits.sort((a, b) => a.rank - b.rank || compareDictionaryEntries(a.entry, b.entry))
  return hits.map((hit) => hit.entry)
}
