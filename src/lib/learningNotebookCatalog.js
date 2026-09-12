import { ALL_WORDS, ETYMOLOGY_PACKS, customWordList, getCustomWord } from '../data/vocab.js'
import { isCustomWordId } from './customWords.js'
import { LEVELS } from '../data/levels.js'
import { PHRASES } from '../data/phrases.js'
import { GRAMMAR_PRACTICE } from '../data/grammar.js'
import { LISTENING_ITEMS } from '../data/listening.js'
import { DICTATION_ITEMS } from '../data/dictation.js'
import { KOTEN_CATEGORIES, KOTEN_WORDS } from '../data/koten.js'
import { KOTEN_GRAMMAR, KOTEN_GRAMMAR_CATEGORIES } from '../data/koten-grammar.js'
import { KOTEN_CULTURE, KOTEN_CULTURE_CATEGORIES } from '../data/koten-culture.js'
import {
  KOTEN_INTERPRETATIONS,
  KOTEN_INTERPRETATION_FOCUS,
  KOTEN_INTERPRETATION_LEVELS,
} from '../data/koten-interpretations.js'
import { KANBUN_VOCAB, KANBUN_VOCAB_CATEGORIES } from '../data/kanbun-vocab.js'
import { KANBUN_GRAMMAR, KANBUN_GRAMMAR_CATEGORIES } from '../data/kanbun-grammar.js'
import { KANBUN_CULTURE, KANBUN_CULTURE_CATEGORIES } from '../data/kanbun-culture.js'
import { KANBUN_KUNDOKU_EXERCISES, KANBUN_KUNDOKU_LEVELS } from '../data/kanbun-kundoku.js'
import { KANBUN_LEVEL_BY_ID } from '../data/kanbun-meta.js'
import { kanbunSearchText } from '../data/kanbun-content.js'
import {
  NOTEBOOK_DOMAINS,
  NOTEBOOK_DOMAIN_BY_ID,
  NOTEBOOK_DOMAIN_IDS,
  notebookRef,
  parseNotebookRef,
} from './learningNotebook.js'
import { grammarQuestionExplanationFor } from './grammarQuestionExplanations.js'

// 教材の名前・単位は、教材データを読まずに使えるよう learningNotebook.js に置いている。ここからも同じものを出す。
export { NOTEBOOK_DOMAINS, NOTEBOOK_DOMAIN_BY_ID }

const compact = (values) => values
  .flat(Infinity)
  .filter((value) => value !== null && value !== undefined && value !== false)
  .map((value) => String(value).trim())
  .filter(Boolean)

const searchable = (...values) => compact(values).join(' ').toLocaleLowerCase('ja')

const byId = (items) => new Map(items.map((item) => [item.id, item]))

const wordById = byId(ALL_WORDS)
const levelById = byId(LEVELS)
const kotenCategoryById = byId(KOTEN_CATEGORIES)
const kotenGrammarCategoryById = byId(KOTEN_GRAMMAR_CATEGORIES)
const kotenCultureCategoryById = byId(KOTEN_CULTURE_CATEGORIES)
const interpretationLevelById = byId(KOTEN_INTERPRETATION_LEVELS)
const kundokuLevelById = byId(KANBUN_KUNDOKU_LEVELS)

// 級は「英検準2級」のように、画面の級カードと同じ名前で出す。
const examLevel = (levelId) => {
  const level = levelById.get(levelId)
  return level ? `英検${level.label}` : ''
}

const adapt = (domain, items, mapper) => items.map((raw) => {
  const mapped = mapper(raw)
  const item = {
    domain,
    id: raw.id,
    ref: notebookRef(domain, raw.id),
    title: mapped.title,
    subtitle: mapped.subtitle ?? '',
    detail: mapped.detail ?? '',
    category: mapped.category ?? '',
    level: mapped.level ?? '',
    raw,
  }
  return {
    ...item,
    searchText: searchable(
      item.title,
      item.subtitle,
      item.detail,
      item.category,
      item.level,
      mapped.search,
    ),
  }
})

const vocabEntry = (item) => ({
  title: item.word,
  subtitle: item.meaning,
  detail: item.example?.en ?? '',
  category: compact([item.pos, item.field]).join('・'),
  level: examLevel(item.level),
  search: [item.meanings, item.example?.ja, item.phonetic],
})

// 漢語・漢文法・漢文常識は同じ形（見出し・答え・解説・分野・段階）なので、分野の表だけ差し替える。
const kanbunEntry = (categoryById) => (item) => ({
  title: item.title,
  subtitle: item.answer,
  detail: item.detail ?? '',
  category: categoryById.get(item.category)?.label ?? '',
  level: KANBUN_LEVEL_BY_ID[item.level]?.label ?? '',
  search: [kanbunSearchText(item)],
})

const CATALOG = Object.freeze({
  vocab: adapt('vocab', ALL_WORDS, vocabEntry),
  phrases: adapt('phrases', PHRASES, (item) => ({
    title: item.phrase,
    subtitle: item.meaning,
    detail: item.example?.en ?? item.note ?? '',
    category: item.kind === 'syntax' ? '構文' : item.category === 'expression' ? '表現' : '熟語',
    level: examLevel(item.level),
    search: [item.meanings, item.example?.ja, item.origin, item.note],
  })),
  grammar: adapt('grammar', GRAMMAR_PRACTICE, (item) => ({
    title: item.sentence?.en ?? item.q,
    subtitle: `${item.topic}｜答え：${item.answer}`,
    detail: item.questionType === 'word-order'
      ? item.explain
      : grammarQuestionExplanationFor(item),
    category: item.topic,
    level: examLevel(item.level),
    search: [item.q, item.choices, item.sentence?.ja],
  })),
  listening: adapt('listening', LISTENING_ITEMS, (item) => ({
    title: item.topic || item.question,
    subtitle: item.questionJa || item.question,
    detail: item.question,
    category: item.type === 'conversation' ? '会話' : 'ナレーション',
    level: examLevel(item.level),
    search: [item.audio?.map((segment) => segment.text), item.choices?.map((choice) => choice.text), item.explain],
  })),
  dictation: adapt('dictation', DICTATION_ITEMS, (item) => ({
    title: item.text,
    subtitle: item.ja,
    detail: item.focus ?? '',
    category: compact([item.topic, item.kind]).join('・'),
    level: examLevel(item.level),
    search: [item.topic, item.kind],
  })),
  etymology: adapt('etymology', ETYMOLOGY_PACKS, (item) => {
    const words = item.studyIds.map((id) => wordById.get(id)?.word).filter(Boolean)
    return {
      title: item.title,
      subtitle: item.description,
      detail: words.slice(0, 7).join('・'),
      category: '語根',
      level: item.rootId ? `語源カード ${item.rootForm}` : '',
      search: [item.caution, item.subtitle, words],
    }
  }),
  kotenVocab: adapt('kotenVocab', KOTEN_WORDS, (item) => ({
    title: item.word,
    subtitle: item.meaning,
    detail: item.example?.ja ?? item.note ?? '',
    category: kotenCategoryById.get(item.category)?.label ?? item.pos,
    level: item.pos,
    search: [item.kana, item.meanings, item.note, item.example?.gendai],
  })),
  kotenGrammar: adapt('kotenGrammar', KOTEN_GRAMMAR, (item) => ({
    title: item.title,
    subtitle: item.meaning,
    detail: item.summary,
    category: kotenGrammarCategoryById.get(item.category)?.label ?? item.category,
    level: item.connection,
    search: [item.forms, item.example?.ja, item.example?.gendai],
  })),
  kotenCulture: adapt('kotenCulture', KOTEN_CULTURE, (item) => ({
    title: item.title,
    subtitle: item.keyword,
    detail: item.core,
    category: kotenCultureCategoryById.get(item.category)?.label ?? item.category,
    level: item.level === 'basic' ? '基礎' : '標準',
    search: [item.prompt, item.detail, item.examTip, item.scene?.text, item.scene?.note],
  })),
  kotenInterpretation: adapt('kotenInterpretation', KOTEN_INTERPRETATIONS, (item) => ({
    title: item.text,
    subtitle: item.translation,
    detail: item.question ?? '',
    category: KOTEN_INTERPRETATION_FOCUS[item.focus]?.label ?? '',
    level: interpretationLevelById.get(item.level)?.label ?? '',
    search: [item.source, item.choices, item.vocabTip, item.grammarTip],
  })),
  kanbunVocab: adapt('kanbunVocab', KANBUN_VOCAB, kanbunEntry(byId(KANBUN_VOCAB_CATEGORIES))),
  kanbunGrammar: adapt('kanbunGrammar', KANBUN_GRAMMAR, kanbunEntry(byId(KANBUN_GRAMMAR_CATEGORIES))),
  kanbunCulture: adapt('kanbunCulture', KANBUN_CULTURE, kanbunEntry(byId(KANBUN_CULTURE_CATEGORIES))),
  kanbunKundoku: adapt('kanbunKundoku', KANBUN_KUNDOKU_EXERCISES, (item) => ({
    title: item.title,
    subtitle: item.kakikudashi,
    detail: item.translation ?? '',
    category: kundokuLevelById.get(item.level)?.label ?? '',
    level: KANBUN_LEVEL_BY_ID[item.level]?.label ?? '',
    search: [item.marked, item.clue, item.pitfall],
  })),
})

const CATALOG_MAPS = Object.freeze(
  Object.fromEntries(
    NOTEBOOK_DOMAIN_IDS.map((domain) => [
      domain,
      new Map((CATALOG[domain] ?? []).map((item) => [item.id, item])),
    ]),
  ),
)

export const NOTEBOOK_CATALOG_COUNTS = Object.freeze(
  Object.fromEntries(NOTEBOOK_DOMAIN_IDS.map((domain) => [domain, CATALOG[domain].length])),
)

export const NOTEBOOK_TOTAL_ITEMS = Object.values(NOTEBOOK_CATALOG_COUNTS)
  .reduce((sum, count) => sum + count, 0)

// 自作単語は「全教材の件数」には数えない（NOTEBOOK_TOTAL_ITEMS は辞書の固定値）。
// 一覧と引き当てにだけ後ろから足し、メモ・単語帳・学習導線を共有する。
const customVocabItems = () => adapt('vocab', customWordList(), vocabEntry)

const customVocabItem = (itemId) => {
  if (!isCustomWordId(itemId)) return null
  const word = getCustomWord(itemId)
  return word ? adapt('vocab', [word], vocabEntry)[0] : null
}

export function notebookItemsForDomain(domain) {
  const items = CATALOG[domain] ?? []
  return domain === 'vocab' ? [...customVocabItems(), ...items] : items
}

export function resolveNotebookItem(domainOrRef, itemId) {
  if (itemId !== undefined) {
    return CATALOG_MAPS[domainOrRef]?.get(itemId)
      ?? (domainOrRef === 'vocab' ? customVocabItem(itemId) : null)
  }
  const parsed = parseNotebookRef(domainOrRef)
  if (!parsed) return null
  return CATALOG_MAPS[parsed.domain]?.get(parsed.itemId)
    ?? (parsed.domain === 'vocab' ? customVocabItem(parsed.itemId) : null)
}

export function searchNotebookItems(domain, query = '') {
  const items = notebookItemsForDomain(domain)
  const normalized = String(query).trim().toLocaleLowerCase('ja')
  if (!normalized) return items
  const terms = normalized.split(/\s+/).filter(Boolean)
  return items.filter((item) => terms.every((term) => item.searchText.includes(term)))
}

// 以前の「マイ単語」や古典・漢文の登録リストは、読み込むときにノートの保存と単語帳へ移している。
// 保存中かどうかは、ノートの保存だけを見ればよい。
export function isNotebookItemSaved(state, domain, itemId) {
  const ref = notebookRef(domain, itemId)
  if (!ref) return false
  return state?.learningNotebook?.entries?.[ref]?.saved === true
}

export function notebookSavedRefs(state = {}) {
  const result = []
  for (const [ref, entry] of Object.entries(state.learningNotebook?.entries ?? {})) {
    if (entry?.saved && resolveNotebookItem(ref)) result.push(ref)
  }
  return result
}

export function notebookSavedCounts(state = {}) {
  const counts = Object.fromEntries(NOTEBOOK_DOMAIN_IDS.map((domain) => [domain, 0]))
  for (const ref of notebookSavedRefs(state)) {
    const parsed = parseNotebookRef(ref)
    if (parsed) counts[parsed.domain] += 1
  }
  return counts
}

// 教材ごとの復習記録の置き場所。英単語・熟語・文法・リスニング・ディクテーションは同じ記録を共有する。
const SRS_FIELD_BY_DOMAIN = Object.freeze({
  vocab: 'srs',
  phrases: 'srs',
  grammar: 'srs',
  listening: 'srs',
  dictation: 'srs',
  etymology: 'etymologySrs',
  kotenVocab: 'kotenSrs',
  kotenGrammar: 'kotenGrammarSrs',
  kotenCulture: 'kotenCultureSrs',
  kotenInterpretation: 'kotenInterpretationSrs',
  kanbunVocab: 'kanbunVocabSrs',
  kanbunGrammar: 'kanbunGrammarSrs',
  kanbunCulture: 'kanbunCultureSrs',
  kanbunKundoku: 'kanbunKundokuSrs',
})

const srsForDomain = (state, domain) => state?.[SRS_FIELD_BY_DOMAIN[domain]] ?? {}

export function notebookItemProgress(state, domain, itemId, day) {
  const entry = srsForDomain(state, domain)[itemId]
  const correct = Math.max(0, Number(entry?.correct) || 0)
  const wrong = Math.max(0, Number(entry?.wrong) || 0)
  const attempts = correct + wrong
  return {
    entry: entry ?? null,
    correct,
    wrong,
    attempts,
    accuracy: attempts ? correct / attempts : null,
    box: Math.max(0, Number(entry?.box) || 0),
    due: Boolean(entry && Number.isFinite(entry.due) && entry.due <= day),
    lastAt: Number.isFinite(entry?.lastAt)
      ? entry.lastAt
      : Number.isFinite(entry?.last)
        ? entry.last * 86400000
        : null,
  }
}

export function notebookRecentItems(state = {}, { limit = 80, day = Infinity } = {}) {
  const result = []
  for (const domain of NOTEBOOK_DOMAIN_IDS) {
    const srs = srsForDomain(state, domain)
    for (const [itemId, entry] of Object.entries(srs)) {
      if (!CATALOG_MAPS[domain].has(itemId)) continue
      const progress = notebookItemProgress(state, domain, itemId, day)
      if (!progress.attempts && !Number.isFinite(entry?.lastAt) && !Number.isFinite(entry?.last)) continue
      result.push({ item: CATALOG_MAPS[domain].get(itemId), progress })
    }
  }
  return result
    .sort((a, b) => (b.progress.lastAt ?? 0) - (a.progress.lastAt ?? 0))
    .slice(0, Math.max(0, limit))
}

export function notebookLearningSummary(state = {}, day = Infinity) {
  const domains = Object.fromEntries(
    NOTEBOOK_DOMAIN_IDS.map((domain) => [domain, {
      studied: 0,
      attempts: 0,
      correct: 0,
      wrong: 0,
      due: 0,
    }]),
  )
  for (const domain of NOTEBOOK_DOMAIN_IDS) {
    const srs = srsForDomain(state, domain)
    for (const itemId of Object.keys(srs)) {
      if (!CATALOG_MAPS[domain].has(itemId)) continue
      const progress = notebookItemProgress(state, domain, itemId, day)
      if (!progress.entry) continue
      const summary = domains[domain]
      summary.studied += 1
      summary.attempts += progress.attempts
      summary.correct += progress.correct
      summary.wrong += progress.wrong
      if (progress.due) summary.due += 1
    }
  }
  return {
    domains,
    studied: Object.values(domains).reduce((sum, item) => sum + item.studied, 0),
    attempts: Object.values(domains).reduce((sum, item) => sum + item.attempts, 0),
    correct: Object.values(domains).reduce((sum, item) => sum + item.correct, 0),
    wrong: Object.values(domains).reduce((sum, item) => sum + item.wrong, 0),
    due: Object.values(domains).reduce((sum, item) => sum + item.due, 0),
  }
}

export function notebookSetDomainGroups(set) {
  const groups = Object.fromEntries(NOTEBOOK_DOMAIN_IDS.map((domain) => [domain, []]))
  for (const ref of Array.isArray(set?.refs) ? set.refs : []) {
    const parsed = parseNotebookRef(ref)
    const item = parsed ? resolveNotebookItem(parsed.domain, parsed.itemId) : null
    if (item) groups[parsed.domain].push(item)
  }
  return groups
}
