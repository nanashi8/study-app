// 自作カードの編集：カードの一覧で選んだカードの移動・統合・削除と、カテゴリーの統合。
// 画面（screens/CustomWords.jsx）とストア（store/useStore.js）の間の、状態を持たない計算だけを置く。
//
// 移動  … カードを別の分類（教科・作ったカテゴリー）へ。ID は変えないので、記録・単語帳・メモはそのまま。
// 統合  … 同じテンプレートのカード2枚以上（英単語は英単語どうし）を、選んだ1枚（残すカード）にまとめる。
//          中身は消さない：残すカードの欄が空ならほかのカードの中身を入れ、文がちがうときは、
//          複数行の欄は行を重ねずに並べ、1行の欄は残すカードの文のまま、ほかの文を解説（英単語は使い方・メモ）へ
//          「欄の名前：文」で足す。欄の字数の上限を超えるときは cut で知らせる（画面が統合の前に見せる）。
// 記録  … 統合で残すのは、残すカードの記録。残すカードに記録がなければ、ほかのカードのうち学習の進んだ記録。
import { VOCAB_POS } from '../data/vocab.js'
import {
  CUSTOM_CARD_LIMITS,
  currentTemplateId,
  isCategoryKey,
  normalizeCustomCard,
  templateFor,
} from './customCards.js'
import { CUSTOM_WORD_LIMITS, normalizeCustomWord } from './customWords.js'
import { contentQuizKey } from './contentProgress.js'

const POS_LABEL = new Map(VOCAB_POS.map((pos) => [pos.id, pos.label]))
const posLabel = (pos) => POS_LABEL.get(pos) ?? pos

// 選んだカードの鍵（英単語のカードとほかのカードは ID の形がちがうので、種類を前につける）。
export const entryKey = (kind, id) => `${kind}:${id}`
export function parseEntryKey(key) {
  const text = String(key ?? '')
  const at = text.indexOf(':')
  const kind = text.slice(0, at)
  const id = text.slice(at + 1)
  return (kind === 'word' || kind === 'card') && id ? { kind, id } : null
}

/** 選んだ鍵を、英単語のカードの ID とほかのカードの ID に分ける。 */
export function splitEntryKeys(keys) {
  const wordIds = []
  const cardIds = []
  for (const key of keys ?? []) {
    const parsed = parseEntryKey(key)
    if (!parsed) continue
    if (parsed.kind === 'word' && !wordIds.includes(parsed.id)) wordIds.push(parsed.id)
    if (parsed.kind === 'card' && !cardIds.includes(parsed.id)) cardIds.push(parsed.id)
  }
  return { wordIds, cardIds }
}

// ── 移動 ─────────────────────────────────────────────

/**
 * 選んだカードを別の分類へ移す。移し先がすでにその分類のカードは数えない。
 * 戻り値の movedCount は、分類が変わった枚数。
 */
export function moveEntriesToCategory({ words = [], cards = [] } = {}, { wordIds = [], cardIds = [], category, now = Date.now() } = {}) {
  if (!isCategoryKey(category)) return { words, cards, movedCount: 0 }
  const wordSet = new Set(wordIds)
  const cardSet = new Set(cardIds)
  let movedCount = 0
  const move = (item, selected) => {
    if (!selected.has(item.id) || item.category === category) return item
    movedCount += 1
    return { ...item, category, updatedAt: now }
  }
  return {
    words: words.map((word) => move(word, wordSet)),
    cards: cards.map((card) => move(card, cardSet)),
    movedCount,
  }
}

// ── 統合できるか ───────────────────────────────────────

export const MERGE_BLOCKER_TEXT = Object.freeze({
  count: '統合するカードを2枚以上選んでください。',
  kind: '英単語のカードと、ほかのテンプレートのカードは統合できません。',
  template: '統合できるのは、同じテンプレートのカードどうしです。先に「書き換える」でテンプレートをそろえてください。',
})

/**
 * 選んだカード（{ kind, entry } の並び）を統合できるか。できるときは null、できないときは理由の鍵
 * （count＝2枚に足りない / kind＝英単語とほかのカードが混ざる / template＝テンプレートがちがう）。
 */
export function mergeBlocker(selected) {
  const items = Array.isArray(selected) ? selected : []
  if (items.length < 2) return 'count'
  const kinds = new Set(items.map((item) => item.kind))
  if (kinds.size > 1) return 'kind'
  if (kinds.has('card')) {
    const templates = new Set(items.map((item) => currentTemplateId(item.entry.template)))
    if (templates.size > 1) return 'template'
  }
  return null
}

// ── 文をまとめる ────────────────────────────────────────

const clean = (value) => String(value ?? '').trim()
const sameText = (a, b) => clean(a).normalize('NFKC').toLowerCase() === clean(b).normalize('NFKC').toLowerCase()

/** 複数行の欄：行ごとに、同じ行を重ねずに順に並べる。 */
function joinLines(values) {
  const lines = []
  for (const value of values) {
    for (const line of String(value ?? '').split(/\r?\n/u)) {
      const text = line.trim()
      if (text && !lines.some((kept) => sameText(kept, text))) lines.push(text)
    }
  }
  return lines.join('\n')
}

/** 1行の文をいくつか：同じ文を重ねずに、区切りでつなぐ。 */
function joinInline(values, separator) {
  const kept = []
  for (const value of values) {
    const text = clean(value).replace(/\s+/gu, ' ')
    if (text && !kept.some((item) => sameText(item, text))) kept.push(text)
  }
  return kept.join(separator)
}

// ── 統合（英単語以外のカード） ─────────────────────────────

const CARD_MULTILINE_KEYS = new Set(['back', 'example', 'exampleTranslation', 'note'])
const cardFieldIsMultiline = (template, item) => CARD_MULTILINE_KEYS.has(item.key) || item.multiline

/**
 * 同じテンプレートのカードを、残すカード（targetId）へ統合した中身。
 * 戻り値 { card, sources, cut }。cut は字数の上限を超えて入りきらない欄（{ key, label, limit, length }）。
 */
export function mergeCardsPreview(cards, targetId, { now = Date.now() } = {}) {
  const list = Array.isArray(cards) ? cards : []
  const target = list.find((card) => card.id === targetId)
  if (!target) return null
  const sources = list.filter((card) => card.id !== targetId)
  const template = templateFor(target.template)
  const merged = { ...target, template: template.id }
  const extraNotes = []
  for (const item of template.fields) {
    if (item.key === 'note') continue
    const values = [target, ...sources].map((card) => card[item.key])
    if (cardFieldIsMultiline(template, item)) {
      merged[item.key] = joinLines(values)
      continue
    }
    // 1行の欄：残すカードの文（空ならほかのカードの最初の文）。ほかのちがう文は解説へ。
    const kept = clean(target[item.key]) || clean(sources.map((card) => card[item.key]).find((value) => clean(value)))
    merged[item.key] = kept
    for (const value of sources.map((card) => card[item.key])) {
      if (clean(value) && !sameText(value, kept)) extraNotes.push(`${item.label}：${clean(value)}`)
    }
  }
  const hasNote = template.fields.some((item) => item.key === 'note')
  if (hasNote) merged.note = joinLines([target.note, ...sources.map((card) => card.note), ...extraNotes])
  const cut = template.fields
    .map((item) => ({ key: item.key, label: item.label, limit: CUSTOM_CARD_LIMITS[item.key] ?? 200, length: clean(merged[item.key]).length }))
    .filter((item) => item.length > item.limit)
  const card = normalizeCustomCard({ ...merged, updatedAt: now }, { now })
  return { card, sources, cut }
}

// ── 統合（英単語のカード） ────────────────────────────────

const pairText = (pair) => (pair.m ? `${pair.w}（${pair.m}）` : pair.w)
const PAIR_LABEL = Object.freeze({
  derivatives: '派生語',
  synonyms: '類義語',
  antonyms: '反意語',
  confusables: 'つづりが似た語',
})

/** 語と意味の組を、同じ語を重ねずに足す。意味が空の組は、あとのカードの意味で埋める。 */
function unionPairs(lists, limit) {
  const kept = []
  for (const list of lists) {
    for (const pair of list ?? []) {
      const found = kept.find((item) => sameText(item.w, pair.w))
      if (found) {
        if (!found.m && pair.m) found.m = pair.m
        continue
      }
      kept.push({ w: pair.w, m: pair.m ?? '' })
    }
  }
  return { kept: kept.slice(0, limit), over: kept.slice(limit) }
}

/**
 * 英単語のカードを、残すカード（targetId）へ統合した中身。
 * 意味は4つまで（品詞が同じカードの意味）、品詞のちがうカードの意味とあふれた意味は「ほかの意味」へ、
 * 関連する語・熟語は同じものを重ねずに足す。上限を超えた分と、ちがう例文・発音記号・つづりは使い方・メモへ。
 */
export function mergeWordsPreview(words, targetId, { now = Date.now() } = {}) {
  const list = Array.isArray(words) ? words : []
  const target = list.find((word) => word.id === targetId)
  if (!target) return null
  const sources = list.filter((word) => word.id !== targetId)
  const notes = []

  // 意味と、ほかの意味。
  const meanings = []
  const senses = []
  const addMeaning = (meaning) => {
    if (!meanings.some((item) => sameText(item, meaning))) meanings.push(meaning)
  }
  const addSense = (pos, meaning) => {
    if (sameText(pos, target.pos) && meanings.some((item) => sameText(item, meaning))) return
    if (!senses.some((item) => item.pos === pos && sameText(item.meaning, meaning))) senses.push({ pos, meaning })
  }
  for (const meaning of target.meanings ?? []) addMeaning(meaning)
  for (const word of sources) {
    for (const meaning of word.meanings ?? []) {
      if (word.pos === target.pos) addMeaning(meaning)
      else addSense(word.pos, meaning)
    }
  }
  const overflowMeanings = meanings.splice(CUSTOM_WORD_LIMITS.meanings)
  const otherSenses = []
  for (const sense of [...(target.otherSenses ?? []), ...sources.flatMap((word) => word.otherSenses ?? [])]) {
    if (!otherSenses.some((item) => item.pos === sense.pos && sameText(item.meaning, sense.meaning))) otherSenses.push({ ...sense })
  }
  for (const sense of senses) {
    if (!otherSenses.some((item) => item.pos === sense.pos && sameText(item.meaning, sense.meaning))) otherSenses.push(sense)
  }
  for (const meaning of overflowMeanings) {
    if (!otherSenses.some((item) => item.pos === target.pos && sameText(item.meaning, meaning))) otherSenses.push({ pos: target.pos, meaning })
  }
  const keptSenses = otherSenses.slice(0, CUSTOM_WORD_LIMITS.otherSenses)
  for (const sense of otherSenses.slice(CUSTOM_WORD_LIMITS.otherSenses)) notes.push(`ほかの意味：${posLabel(sense.pos)}・${sense.meaning}`)

  // つづり・発音記号・例文：残すカードのものを使い、ちがうものはメモへ。
  for (const word of sources) {
    if (clean(word.word) && !sameText(word.word, target.word)) notes.push(`ほかの書き方：${clean(word.word)}`)
  }
  const phonetic = clean(target.phonetic) || clean(sources.map((word) => word.phonetic).find((value) => clean(value)))
  for (const word of sources) {
    if (clean(word.phonetic) && !sameText(word.phonetic, phonetic)) notes.push(`発音記号：${clean(word.phonetic)}`)
  }
  const hasExample = (word) => clean(word?.example?.en) || clean(word?.example?.ja)
  const example = hasExample(target) ? target.example : sources.find(hasExample)?.example ?? null
  for (const word of sources) {
    if (!hasExample(word) || word.example === example) continue
    if (sameText(word.example.en, example?.en) && sameText(word.example.ja, example?.ja)) continue
    notes.push(`例文：${joinInline([word.example.en, word.example.ja && `（${word.example.ja}）`], '')}`)
  }

  // 関連する語・熟語。
  const merged = {
    ...target,
    meanings,
    otherSenses: keptSenses,
    phonetic,
    example,
  }
  for (const key of ['derivatives', 'synonyms', 'antonyms', 'confusables']) {
    const { kept, over } = unionPairs([target[key], ...sources.map((word) => word[key])], CUSTOM_WORD_LIMITS.relatedWords)
    merged[key] = kept
    for (const pair of over) notes.push(`${PAIR_LABEL[key]}：${pairText(pair)}`)
  }
  const phrases = []
  for (const phrase of [...(target.phrases ?? []), ...sources.flatMap((word) => word.phrases ?? [])]) {
    const found = phrases.find((item) => sameText(item.phrase, phrase.phrase))
    if (found) {
      if (!found.meaning && phrase.meaning) found.meaning = phrase.meaning
      continue
    }
    phrases.push({ phrase: phrase.phrase, meaning: phrase.meaning ?? '' })
  }
  merged.phrases = phrases.slice(0, CUSTOM_WORD_LIMITS.phrases)
  for (const phrase of phrases.slice(CUSTOM_WORD_LIMITS.phrases)) {
    notes.push(`熟語・構文：${phrase.meaning ? `${phrase.phrase}（${phrase.meaning}）` : phrase.phrase}`)
  }

  merged.etymology = joinInline([target.etymology, ...sources.map((word) => word.etymology)], ' ／ ')
  merged.note = joinInline([target.note, ...sources.map((word) => word.note), ...notes], ' ／ ')
  const cut = [
    { key: 'note', label: '使い方・メモ', limit: CUSTOM_WORD_LIMITS.note, length: merged.note.length },
    { key: 'etymology', label: '語の成り立ち', limit: CUSTOM_WORD_LIMITS.etymology, length: merged.etymology.length },
  ].filter((item) => item.length > item.limit)
  const word = normalizeCustomWord({ ...merged, updatedAt: now }, { now })
  return { word, sources, cut }
}

// ── 記録（暗記・テスト） ─────────────────────────────────

// 記録の最後に学んだ時刻（暗記・テストのどちらか新しい方）。
const lastStudiedAt = (record) => Math.max(
  Number(record?.memory?.lastAt) || 0,
  Number(record?.test?.lastAt) || 0,
  Number(record?.lastAt) || 0,
)

/**
 * 統合で残す記録（SRS の1件）。残すカードの記録があればそれ、なければほかのカードのうち学習の進んだもの
 * （箱が大きい → 最後に学んだのが新しい）。どれにも記録がなければ null。
 */
export function mergedReviewRecord(records, targetId, sourceIds) {
  if (records?.[targetId]) return records[targetId]
  const candidates = (sourceIds ?? []).map((id) => records?.[id]).filter(Boolean)
  if (!candidates.length) return null
  return [...candidates].sort((a, b) => (Number(b.box) || 0) - (Number(a.box) || 0) || lastStudiedAt(b) - lastStudiedAt(a))[0]
}

/** 記録の表（ID → 記録）から、統合したカードの記録を残すカードへ寄せ、ほかのカードの記録を外す。 */
export function mergeReviewRecords(records, targetId, sourceIds) {
  const current = records && typeof records === 'object' ? records : {}
  const kept = mergedReviewRecord(current, targetId, sourceIds)
  const next = { ...current }
  for (const id of sourceIds ?? []) delete next[id]
  if (kept) next[targetId] = kept
  return next
}

/** 記録の表から、消したカードの記録を外す。 */
export function dropReviewRecords(records, ids) {
  const current = records && typeof records === 'object' ? records : {}
  const remove = new Set(ids ?? [])
  if (![...remove].some((id) => id in current)) return current
  return Object.fromEntries(Object.entries(current).filter(([id]) => !remove.has(id)))
}

/** 辞書の履歴（英単語の ID の並び）で、統合したカードを残すカードへ置き換える（同じ ID は1つに）。 */
export function mergeHistoryIds(history, targetId, sourceIds) {
  const sources = new Set(sourceIds ?? [])
  const next = []
  for (const id of Array.isArray(history) ? history : []) {
    const value = sources.has(id) ? targetId : id
    if (!next.includes(value)) next.push(value)
  }
  return next
}

/**
 * テストの問題ごとの結果（contentQuizResults）で、統合したカードの結果を残すカードへ寄せる。
 * 残すカードの結果があればそれ、なければほかのカードのうち最後に答えたのが新しい結果。ほかのカードの結果は外す。
 */
export function mergeQuizResults(results, domain, targetId, sourceIds) {
  const current = results && typeof results === 'object' ? results : {}
  const targetKey = contentQuizKey(domain, targetId)
  const sourceKeys = (sourceIds ?? []).map((id) => contentQuizKey(domain, id)).filter(Boolean)
  if (!targetKey || !sourceKeys.some((key) => key in current)) return current
  const next = { ...current }
  const latest = sourceKeys
    .map((key) => current[key])
    .filter(Boolean)
    .sort((a, b) => (Number(b.lastAt) || 0) - (Number(a.lastAt) || 0))[0]
  for (const key of sourceKeys) delete next[key]
  if (!next[targetKey] && latest) next[targetKey] = latest
  return next
}

/** テストの問題ごとの結果から、消したカードの結果を外す。 */
export function dropQuizResults(results, domain, ids) {
  const current = results && typeof results === 'object' ? results : {}
  const keys = new Set((ids ?? []).map((id) => contentQuizKey(domain, id)).filter(Boolean))
  if (![...keys].some((key) => key in current)) return current
  return Object.fromEntries(Object.entries(current).filter(([key]) => !keys.has(key)))
}
