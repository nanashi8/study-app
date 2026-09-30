// 自作カードのうち、テンプレート「英単語」のカード（これまでの自作単語）。
//
// 辞書本体（data/vocab.js の ALL_WORDS）には決して混ぜない。級ごとの語数・
// 語源カード・全教材監査台帳は手動監査に合わせた固定値なので、
// そこへ利用者の語を足すと「英検5級 全606語」のような約束が崩れる。
// 自作語は別の保存領域に持ち、ID の引き当て（getWord）にだけ載せて
// 単語帳・暗記・テスト・復習日・辞書ページの仕組みを共有する。
// 英単語以外のテンプレートのカードと、カードの分類（教科・カテゴリー）は lib/customCards.js。
// JSONファイルの書き出し・読み込みは lib/customLibrary.js（英単語・カード・カテゴリーをまとめて持つ）。
import { LEVELS } from '../data/levels.js'
import { VOCAB_FIELDS, VOCAB_POS } from '../data/vocab.js'
import { DEFAULT_CATEGORY_ID, isCategoryKey } from './customCards.js'

export const CUSTOM_WORD_PREFIX = 'u-'

export const CUSTOM_WORD_LIMITS = Object.freeze({
  words: 300,
  word: 64,
  meaning: 60,
  meanings: 4,
  phonetic: 48,
  example: 200,
  note: 300,
  // 関連する語（派生語・類義語・反意語・つづりが似た語）は1欄8語まで、熟語・構文は8つまで、ほかの意味は4つまで。
  relatedWords: 8,
  relatedWord: 64,
  relatedMeaning: 60,
  otherSenses: 4,
  phrases: 8,
  phrase: 80,
  phraseMeaning: 80,
  etymology: 400,
})

// 英単語のテンプレートの欄。英単語の辞書ページ・暗記カードが使う情報のうち、学習者が書けるもの（16欄）。
// section は登録の画面のまとまり。list は、行を足して書く欄（pair＝語と意味、sense＝品詞と意味、phrase＝熟語・構文と意味）。
// 学習の記録・辞書の前後・同じつづりの別の語・語根カード・使い分けガイド・カタカナ語・読み分けは、
// 辞書の並びや人が1語ずつ決めた台帳から出る欄なので、書く欄にしない（書きたいことは「使い方・メモ」に書ける）。
const englishField = (key, label, section, extra = {}) => Object.freeze({ key, label, section, required: false, ...extra })
export const ENGLISH_WORD_FIELDS = Object.freeze([
  englishField('word', '単語', 'basic', { required: true }),
  englishField('meanings', '意味', 'basic', { required: true }),
  englishField('pos', '品詞', 'basic'),
  englishField('level', '級', 'basic'),
  englishField('field', '分野', 'basic'),
  englishField('phonetic', '発音記号', 'basic'),
  englishField('exampleEn', '例文', 'example'),
  englishField('exampleJa', '例文の訳', 'example'),
  englishField('note', '使い方・メモ', 'note'),
  englishField('otherSenses', 'ほかの意味', 'related', { list: 'sense' }),
  englishField('derivatives', '派生語・ほかの品詞の形', 'related', { list: 'pair' }),
  englishField('synonyms', '類義語', 'related', { list: 'pair' }),
  englishField('antonyms', '反意語', 'related', { list: 'pair' }),
  englishField('confusables', 'つづりが似ていて間違えやすい語', 'related', { list: 'pair' }),
  englishField('phrases', '熟語・構文', 'related', { list: 'phrase' }),
  englishField('etymology', '語の成り立ち', 'note'),
])

export const ENGLISH_WORD_SECTIONS = Object.freeze([
  Object.freeze({ id: 'basic', label: '単語と意味' }),
  Object.freeze({ id: 'example', label: '例文' }),
  Object.freeze({ id: 'related', label: '関連する語・ほかの意味' }),
  Object.freeze({ id: 'note', label: '使い方・語の成り立ち' }),
])

// 語と意味の組で書く欄（派生語・類義語・反意語・つづりが似た語）。
export const ENGLISH_PAIR_KEYS = Object.freeze(['derivatives', 'synonyms', 'antonyms', 'confusables'])

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
  category: DEFAULT_CATEGORY_ID,
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

/** 語と意味の組の欄（派生語・類義語・反意語・つづりが似た語）。語が空の行は落とし、同じ語は1つにする。 */
export function normalizeWordPairs(value, { exclude = '' } = {}) {
  const seen = new Set([String(exclude).toLowerCase()])
  const pairs = []
  for (const raw of Array.isArray(value) ? value : []) {
    if (!isRecord(raw)) continue
    const w = text(raw.w ?? raw.word, CUSTOM_WORD_LIMITS.relatedWord)
    const key = w.toLowerCase()
    if (!w || seen.has(key)) continue
    seen.add(key)
    pairs.push({ w, m: text(raw.m ?? raw.meaning, CUSTOM_WORD_LIMITS.relatedMeaning) })
    if (pairs.length >= CUSTOM_WORD_LIMITS.relatedWords) break
  }
  return pairs
}

/** ほかの意味（品詞と意味）。意味が空の行は落とす。 */
export function normalizeOtherSenses(value, { fallbackPos = POS_IDS[0] } = {}) {
  const seen = new Set()
  const senses = []
  for (const raw of Array.isArray(value) ? value : []) {
    if (!isRecord(raw)) continue
    const meaning = text(raw.meaning, CUSTOM_WORD_LIMITS.meaning)
    const pos = POS_IDS.includes(raw.pos) ? raw.pos : fallbackPos
    const key = `${pos}|${meaning}`
    if (!meaning || seen.has(key)) continue
    seen.add(key)
    senses.push({ pos, meaning })
    if (senses.length >= CUSTOM_WORD_LIMITS.otherSenses) break
  }
  return senses
}

/** 熟語・構文（句と意味）。句が空の行は落とす。 */
export function normalizeWordPhrases(value) {
  const seen = new Set()
  const phrases = []
  for (const raw of Array.isArray(value) ? value : []) {
    if (!isRecord(raw)) continue
    const phrase = text(raw.phrase, CUSTOM_WORD_LIMITS.phrase)
    const key = phrase.toLowerCase()
    if (!phrase || seen.has(key)) continue
    seen.add(key)
    phrases.push({ phrase, meaning: text(raw.meaning, CUSTOM_WORD_LIMITS.phraseMeaning) })
    if (phrases.length >= CUSTOM_WORD_LIMITS.phrases) break
  }
  return phrases
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
  const pos = POS_IDS.includes(value.pos) ? value.pos : DEFAULT_CUSTOM_WORD.pos
  return {
    id,
    word,
    meanings,
    pos,
    level: LEVEL_IDS.includes(value.level) ? value.level : DEFAULT_CUSTOM_WORD.level,
    field: VOCAB_FIELDS.includes(value.field) ? value.field : DEFAULT_CUSTOM_WORD.field,
    phonetic: text(value.phonetic, CUSTOM_WORD_LIMITS.phonetic),
    example: exampleEn || exampleJa ? { en: exampleEn, ja: exampleJa } : null,
    note: text(value.note, CUSTOM_WORD_LIMITS.note),
    // 以前の自作単語（分類を持たない保存）は、教科「英語」のカードとして読む。
    category: isCategoryKey(value.category) ? value.category : DEFAULT_CATEGORY_ID,
    otherSenses: normalizeOtherSenses(value.otherSenses, { fallbackPos: pos }),
    derivatives: normalizeWordPairs(value.derivatives, { exclude: word }),
    synonyms: normalizeWordPairs(value.synonyms, { exclude: word }),
    antonyms: normalizeWordPairs(value.antonyms, { exclude: word }),
    confusables: normalizeWordPairs(value.confusables, { exclude: word }),
    phrases: normalizeWordPhrases(value.phrases),
    etymology: text(value.etymology, CUSTOM_WORD_LIMITS.etymology),
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

const headwordText = (value) => String(value ?? '')
  .normalize('NFKC')
  .replace(/[’]/gu, "'")
  .replace(/\s+/gu, ' ')
  .trim()

// 英字の語。語の間の空白・ハイフン・アポストロフィは使える。
const ENGLISH_HEADWORD = /^[a-z]+(?:[-' ][a-z]+)*$/iu

/**
 * 英和辞書で引いた語を、自作単語の登録欄へ入れられるか。
 * 英語のつづりで、辞書の見出しにも登録済みの自作単語にも同じ語が無いときだけ { word } を返す。
 */
export function customWordDraftFromQuery(rawQuery, { headwords = [], customWords = [] } = {}) {
  const word = headwordText(rawQuery)
  if (!word || word.length > CUSTOM_WORD_LIMITS.word || !ENGLISH_HEADWORD.test(word)) return null
  const key = word.toLowerCase()
  const sameWord = (value) => headwordText(value).toLowerCase() === key
  if (headwords.some(sameWord)) return null
  if ((Array.isArray(customWords) ? customWords : []).some((entry) => sameWord(entry?.word))) return null
  return { word }
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
    // 類義語・反意語・派生語は辞書の語と同じ欄（{ w, m }）に入れ、辞書ページ・暗記カードの同じ欄に出す。
    synonyms: word.synonyms,
    antonyms: word.antonyms,
    derivatives: word.derivatives,
    family: [],
    usage: word.note,
    usageGuides: [],
    // ほかの意味は、カードの級で習う意味として出す。
    otherSenses: word.otherSenses.map((sense) => ({ ...sense, level: word.level })),
    // 辞書の台帳から出す欄の代わりに、自分で書いた中身を持つ（つづりが似た語・熟語と構文・語の成り立ち）。
    customConfusables: word.confusables,
    customPhrases: word.phrases,
    customEtymology: word.etymology,
    category: word.category,
    custom: true,
  }
}

export function customStudyWords(list) {
  return normalizeCustomWords(list).map(customWordToStudyWord).filter(Boolean)
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
