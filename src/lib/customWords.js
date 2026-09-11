// 自作単語（ユーザーが自分で登録した英単語）。
//
// 辞書本体（data/vocab.js の ALL_WORDS）には決して混ぜない。級ごとの語数・
// 語源カード・全教材監査台帳は英検の公表値や手動監査に合わせた固定値なので、
// そこへ利用者の語を足すと「英検5級 全606語」のような約束が崩れる。
// 自作語は別の保存領域に持ち、ID の引き当て（getWord）にだけ載せて
// 単語帳・暗記・テスト・復習日の仕組みを共有する。
//
// JSONファイルはこの形で書き出し、同じ形だけを読み戻す。
//   { app, kind, version, exportedAt, words: [ { id, word, meanings, ... } ] }
import { LEVELS } from '../data/levels.js'
import { VOCAB_FIELDS, VOCAB_POS } from '../data/vocab.js'

export const CUSTOM_WORD_PREFIX = 'u-'

export const CUSTOM_WORD_LIMITS = Object.freeze({
  words: 300,
  word: 64,
  meaning: 60,
  meanings: 4,
  phonetic: 48,
  example: 200,
  note: 300,
})

export const CUSTOM_WORDS_FILE = Object.freeze({
  app: 'study-app',
  kind: 'custom-words',
  version: 1,
  name: 'study-app-custom-words.json',
})

const LEVEL_IDS = LEVELS.map((level) => level.id)
const POS_IDS = VOCAB_POS.map((pos) => pos.id)

export const CUSTOM_WORD_LEVELS = LEVELS
export const CUSTOM_WORD_POS = VOCAB_POS
export const CUSTOM_WORD_FIELDS = VOCAB_FIELDS

export const DEFAULT_CUSTOM_WORD = Object.freeze({
  word: '',
  meanings: [],
  pos: POS_IDS[0],
  level: LEVEL_IDS[0],
  field: VOCAB_FIELDS[0],
  phonetic: '',
  example: null,
  note: '',
})

export const isCustomWordId = (id) => (
  typeof id === 'string' && id.startsWith(CUSTOM_WORD_PREFIX)
)

const text = (value, limit) => (
  typeof value === 'string' ? value.trim().replace(/\s+/gu, ' ').slice(0, limit) : ''
)

const isRecord = (value) => (
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)
)

const timestamp = (value, fallback = null) => (
  Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback
)

/** 「本・帳簿」「本, 帳簿」どちらの書き方でも同じ意味の並びとして読む。 */
export function splitCustomMeanings(value) {
  const source = Array.isArray(value) ? value : String(value ?? '').split(/[・,、]/u)
  const seen = new Set()
  const meanings = []
  for (const raw of source) {
    const clean = text(raw, CUSTOM_WORD_LIMITS.meaning)
    if (!clean || seen.has(clean)) continue
    seen.add(clean)
    meanings.push(clean)
    if (meanings.length >= CUSTOM_WORD_LIMITS.meanings) break
  }
  return meanings
}

export function createCustomWordId({
  now = Date.now(),
  randomPart = Math.random().toString(36).slice(2),
} = {}) {
  const time = Math.floor(now).toString(36)
  const tail = String(randomPart).replace(/[^a-z0-9]/gu, '').slice(0, 6) || 'local'
  return `${CUSTOM_WORD_PREFIX}${time}${tail}`
}

/** 保存形。語と意味が無いものは登録として成り立たないので落とす。 */
export function normalizeCustomWord(value, { now = Date.now() } = {}) {
  if (!isRecord(value)) return null
  const word = text(value.word, CUSTOM_WORD_LIMITS.word)
  const meanings = splitCustomMeanings(value.meanings ?? value.meaning)
  if (!word || !meanings.length) return null
  const exampleEn = text(value.example?.en, CUSTOM_WORD_LIMITS.example)
  const exampleJa = text(value.example?.ja, CUSTOM_WORD_LIMITS.example)
  const id = isCustomWordId(value.id) ? value.id : createCustomWordId({ now })
  const createdAt = timestamp(value.createdAt, now)
  return {
    id,
    word,
    meanings,
    pos: POS_IDS.includes(value.pos) ? value.pos : DEFAULT_CUSTOM_WORD.pos,
    level: LEVEL_IDS.includes(value.level) ? value.level : DEFAULT_CUSTOM_WORD.level,
    field: VOCAB_FIELDS.includes(value.field) ? value.field : DEFAULT_CUSTOM_WORD.field,
    phonetic: text(value.phonetic, CUSTOM_WORD_LIMITS.phonetic),
    example: exampleEn || exampleJa ? { en: exampleEn, ja: exampleJa } : null,
    note: text(value.note, CUSTOM_WORD_LIMITS.note),
    createdAt,
    updatedAt: timestamp(value.updatedAt, createdAt),
  }
}

export function normalizeCustomWords(value, { now = Date.now() } = {}) {
  const seen = new Set()
  const words = []
  for (const raw of Array.isArray(value) ? value : []) {
    const word = normalizeCustomWord(raw, { now })
    if (!word || seen.has(word.id)) continue
    seen.add(word.id)
    words.push(word)
    if (words.length >= CUSTOM_WORD_LIMITS.words) break
  }
  return words
}

/**
 * 追加と書き換えの単一入口。
 * status は saved（保存した） / invalid（語か意味が空） / full（上限）。
 */
export function upsertCustomWord(list, input, { now = Date.now() } = {}) {
  const words = normalizeCustomWords(list, { now })
  const index = isCustomWordId(input?.id)
    ? words.findIndex((word) => word.id === input.id)
    : -1
  const normalized = normalizeCustomWord(
    {
      ...input,
      id: index >= 0 ? input.id : createCustomWordId({ now }),
      createdAt: index >= 0 ? words[index].createdAt : now,
      updatedAt: now,
    },
    { now },
  )
  if (!normalized) return { words, id: null, status: 'invalid' }
  if (index < 0 && words.length >= CUSTOM_WORD_LIMITS.words) {
    return { words, id: null, status: 'full' }
  }
  const next = index >= 0
    ? words.map((word, at) => (at === index ? normalized : word))
    : [...words, normalized]
  return { words: next, id: normalized.id, status: 'saved' }
}

export function removeCustomWord(list, id, { now = Date.now() } = {}) {
  return normalizeCustomWords(list, { now }).filter((word) => word.id !== id)
}

export function findCustomWord(list, id) {
  return (Array.isArray(list) ? list : []).find((word) => word?.id === id) ?? null
}

/**
 * 学習画面が扱う単語の形へ変える。辞書の語と同じ鍵をそろえるので、
 * 暗記カード・テストの誤答作り・単語帳の一覧がそのまま動く。
 */
export function customWordToStudyWord(entry) {
  const word = normalizeCustomWord(entry)
  if (!word) return null
  return {
    id: word.id,
    word: word.word,
    pos: word.pos,
    level: word.level,
    meaning: word.meanings.join('・'),
    meanings: word.meanings,
    example: word.example,
    field: word.field,
    phonetic: word.phonetic,
    etymology: null,
    roots: [],
    referenceRoots: [],
    synonyms: [],
    antonyms: [],
    derivatives: [],
    family: [],
    usage: word.note,
    usageGuides: [],
    otherSenses: [],
    custom: true,
  }
}

export function customStudyWords(list) {
  return normalizeCustomWords(list).map(customWordToStudyWord).filter(Boolean)
}

// ── JSONファイル ────────────────────────────────────────────────
export function buildCustomWordsFile(list, { now = Date.now() } = {}) {
  return {
    app: CUSTOM_WORDS_FILE.app,
    kind: CUSTOM_WORDS_FILE.kind,
    version: CUSTOM_WORDS_FILE.version,
    exportedAt: new Date(now).toISOString(),
    words: normalizeCustomWords(list, { now }),
  }
}

export function customWordsFileText(list, options) {
  return `${JSON.stringify(buildCustomWordsFile(list, options), null, 2)}\n`
}

export function customWordsFileName(now = Date.now()) {
  const date = new Date(now)
  const pad = (value) => String(value).padStart(2, '0')
  return `study-app-custom-words-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}.json`
}

/**
 * 読み込み。status は ok / broken（JSONとして読めない）
 * / other（別の種類のファイル） / empty（登録できる語が無い）。
 */
export function parseCustomWordsFile(rawText, { now = Date.now() } = {}) {
  let parsed = null
  try {
    parsed = JSON.parse(String(rawText ?? ''))
  } catch {
    return { status: 'broken', words: [] }
  }
  const source = Array.isArray(parsed) ? { words: parsed } : parsed
  if (!isRecord(source)) return { status: 'broken', words: [] }
  const looksLikeOurs = Array.isArray(source.words)
    && (!source.kind || source.kind === CUSTOM_WORDS_FILE.kind)
  if (!looksLikeOurs) return { status: 'other', words: [] }
  const words = normalizeCustomWords(source.words, { now })
  return words.length ? { status: 'ok', words } : { status: 'empty', words: [] }
}

/**
 * 読み込んだ語を今の一覧へ合わせる。
 * mode='merge' は同じIDを書き換えて残りを足す。mode='replace' は入れ替える。
 */
export function mergeCustomWords(current, incoming, { mode = 'merge', now = Date.now() } = {}) {
  const existing = normalizeCustomWords(current, { now })
  const added = normalizeCustomWords(incoming, { now })
  if (mode === 'replace') {
    return { words: added, addedCount: added.length, updatedCount: 0, skippedCount: 0 }
  }
  const byId = new Map(existing.map((word) => [word.id, word]))
  let addedCount = 0
  let updatedCount = 0
  let skippedCount = 0
  for (const word of added) {
    if (byId.has(word.id)) {
      byId.set(word.id, word)
      updatedCount += 1
    } else if (byId.size >= CUSTOM_WORD_LIMITS.words) {
      skippedCount += 1
    } else {
      byId.set(word.id, word)
      addedCount += 1
    }
  }
  return { words: [...byId.values()], addedCount, updatedCount, skippedCount }
}
