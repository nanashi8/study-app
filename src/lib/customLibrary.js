// 自作カードのまとまり（英単語のカード・英単語以外のカード・作ったカテゴリー）を、1つのJSONファイルで出し入れする。
//
// 書き出す形：{ app, kind: 'custom-cards', version: 2, exportedAt, words, cards, categories }
// 読み込めるもの：この形と、以前の自作単語のファイル（kind: 'custom-words'、words だけ）。
import {
  CUSTOM_CARD_LIMITS,
  normalizeCustomCards,
  normalizeCustomCategories,
  reconcileCustomCategories,
} from './customCards.js'
import { CUSTOM_WORD_LIMITS, normalizeCustomWords } from './customWords.js'

export const CUSTOM_LIBRARY_FILE = Object.freeze({
  app: 'study-app',
  kind: 'custom-cards',
  version: 2,
  // 以前の自作単語のファイル。読み込みだけ受け付ける。
  legacyKind: 'custom-words',
})

const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)

/** 端末の保存・進捗コード・ファイルから読んだまとまりを、今の形にそろえる（分類が無いものは教科「英語」かカテゴリーを作り直す）。 */
export function normalizeCustomLibrary({ words = [], cards = [], categories = [] } = {}, { now = Date.now() } = {}) {
  return reconcileCustomCategories({
    categories: normalizeCustomCategories(categories, { now }),
    cards: normalizeCustomCards(cards, { now }),
    words: normalizeCustomWords(words, { now }),
  }, { now })
}

export function buildCustomLibraryFile(library, { now = Date.now() } = {}) {
  const { words, cards, categories } = normalizeCustomLibrary(library, { now })
  return {
    app: CUSTOM_LIBRARY_FILE.app,
    kind: CUSTOM_LIBRARY_FILE.kind,
    version: CUSTOM_LIBRARY_FILE.version,
    exportedAt: new Date(now).toISOString(),
    words,
    cards,
    categories,
  }
}

export function customLibraryFileText(library, options) {
  return `${JSON.stringify(buildCustomLibraryFile(library, options), null, 2)}\n`
}

export function customLibraryFileName(now = Date.now()) {
  const date = new Date(now)
  const pad = (value) => String(value).padStart(2, '0')
  return `study-app-custom-cards-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}.json`
}

/** 1ファイルの中身の数（英単語・カード・カテゴリー）。 */
export const customLibraryCounts = (library) => ({
  words: library?.words?.length ?? 0,
  cards: library?.cards?.length ?? 0,
  categories: library?.categories?.length ?? 0,
})

/**
 * 読み込み。status は ok / broken（JSONとして読めない）/ other（別の種類のファイル）/ empty（登録できるものが無い）。
 * 以前の自作単語のファイル（words の配列だけ、または kind: 'custom-words'）も読む。
 */
export function parseCustomLibraryFile(rawText, { now = Date.now() } = {}) {
  let parsed = null
  try {
    parsed = JSON.parse(String(rawText ?? ''))
  } catch {
    return { status: 'broken', library: null }
  }
  const source = Array.isArray(parsed) ? { words: parsed } : parsed
  if (!isRecord(source)) return { status: 'broken', library: null }
  const kindOk = !source.kind || source.kind === CUSTOM_LIBRARY_FILE.kind || source.kind === CUSTOM_LIBRARY_FILE.legacyKind
  const hasLists = ['words', 'cards', 'categories'].some((key) => Array.isArray(source[key]))
  if (!kindOk || !hasLists) return { status: 'other', library: null }
  const library = normalizeCustomLibrary({
    words: source.words,
    cards: source.cards,
    categories: source.categories,
  }, { now })
  const counts = customLibraryCounts(library)
  if (!counts.words && !counts.cards && !counts.categories) return { status: 'empty', library: null }
  return { status: 'ok', library }
}

// 同じ ID は書き換え、ほかは上限まで足す。
function mergeById(current, incoming, limit) {
  const byId = new Map(current.map((item) => [item.id, item]))
  let addedCount = 0
  let updatedCount = 0
  let skippedCount = 0
  for (const item of incoming) {
    if (byId.has(item.id)) {
      byId.set(item.id, item)
      updatedCount += 1
    } else if (byId.size >= limit) {
      skippedCount += 1
    } else {
      byId.set(item.id, item)
      addedCount += 1
    }
  }
  return { items: [...byId.values()], addedCount, updatedCount, skippedCount }
}

/**
 * 読み込んだまとまりを今のまとまりへ合わせる。
 * mode='merge' は同じ ID を書き換えて残りを足す。mode='replace' はまるごと入れ替える。
 * 数は英単語・カード・カテゴリーを合わせたもの（画面の「◯件を足し」に使う）。
 */
export function mergeCustomLibrary(current, incoming, { mode = 'merge', now = Date.now() } = {}) {
  const existing = normalizeCustomLibrary(current, { now })
  const added = normalizeCustomLibrary(incoming, { now })
  if (mode === 'replace') {
    const counts = customLibraryCounts(added)
    return {
      library: added,
      addedCount: counts.words + counts.cards,
      updatedCount: 0,
      skippedCount: 0,
      categoryCount: counts.categories,
    }
  }
  // カテゴリーを先に合わせ、カードがそのカテゴリーを指せるようにする。
  const categories = mergeById(existing.categories, added.categories, CUSTOM_CARD_LIMITS.categories)
  const words = mergeById(existing.words, added.words, CUSTOM_WORD_LIMITS.words)
  const cards = mergeById(existing.cards, added.cards, CUSTOM_CARD_LIMITS.cards)
  const library = normalizeCustomLibrary({ words: words.items, cards: cards.items, categories: categories.items }, { now })
  return {
    library,
    addedCount: words.addedCount + cards.addedCount,
    updatedCount: words.updatedCount + cards.updatedCount,
    skippedCount: words.skippedCount + cards.skippedCount,
    categoryCount: categories.addedCount,
  }
}
