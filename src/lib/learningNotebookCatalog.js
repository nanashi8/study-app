import { ALL_WORDS, ETYMOLOGY_MODE_META, ETYMOLOGY_PACKS } from '../data/vocab.js'
import { PHRASES } from '../data/phrases.js'
import { GRAMMAR } from '../data/grammar.js'
import { LISTENING_ITEMS } from '../data/listening.js'
import { KOTEN_CATEGORIES, KOTEN_WORDS } from '../data/koten.js'
import { KOTEN_GRAMMAR, KOTEN_GRAMMAR_CATEGORIES } from '../data/koten-grammar.js'
import { KOTEN_CULTURE, KOTEN_CULTURE_CATEGORIES } from '../data/koten-culture.js'
import {
  NOTEBOOK_DOMAIN_IDS,
  notebookRef,
  parseNotebookRef,
} from './learningNotebook.js'

export const NOTEBOOK_DOMAINS = Object.freeze([
  { id: 'vocab', label: '英単語', unit: '語', emoji: '📘', color: '#4f46e5' },
  { id: 'phrases', label: '英熟語・構文', unit: '項目', emoji: '🧩', color: '#7c3aed' },
  { id: 'grammar', label: '英文法', unit: '問', emoji: '✍️', color: '#d97706' },
  { id: 'listening', label: 'リスニング', unit: '問', emoji: '🎧', color: '#0284c7' },
  { id: 'etymology', label: '語源', unit: '項目', emoji: '🌱', color: '#a21caf' },
  { id: 'kotenVocab', label: '古典単語', unit: '語', emoji: '📜', color: '#c2410c' },
  { id: 'kotenGrammar', label: '古典文法', unit: '項目', emoji: '🪶', color: '#b45309' },
  { id: 'kotenCulture', label: '古典常識', unit: '項目', emoji: '🏯', color: '#6d28d9' },
])

export const NOTEBOOK_DOMAIN_BY_ID = Object.freeze(
  Object.fromEntries(NOTEBOOK_DOMAINS.map((domain) => [domain.id, domain])),
)

const compact = (values) => values
  .flat(Infinity)
  .filter((value) => value !== null && value !== undefined && value !== false)
  .map((value) => String(value).trim())
  .filter(Boolean)

const searchable = (...values) => compact(values).join(' ').toLocaleLowerCase('ja')

const wordById = new Map(ALL_WORDS.map((item) => [item.id, item]))
const kotenCategoryById = new Map(KOTEN_CATEGORIES.map((item) => [item.id, item]))
const kotenGrammarCategoryById = new Map(
  KOTEN_GRAMMAR_CATEGORIES.map((item) => [item.id, item]),
)
const kotenCultureCategoryById = new Map(
  KOTEN_CULTURE_CATEGORIES.map((item) => [item.id, item]),
)

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

const CATALOG = Object.freeze({
  vocab: adapt('vocab', ALL_WORDS, (item) => ({
    title: item.word,
    subtitle: item.meaning,
    detail: item.example?.en ?? item.etymology?.note ?? '',
    category: compact([item.pos, item.field]).join('・'),
    level: item.level ? `英検${item.level}級` : '',
    search: [item.meanings, item.example?.ja, item.phonetic, item.etymology?.origin],
  })),
  phrases: adapt('phrases', PHRASES, (item) => ({
    title: item.phrase,
    subtitle: item.meaning,
    detail: item.example?.en ?? item.note ?? '',
    category: item.kind === 'syntax' ? '構文' : item.category === 'expression' ? '表現' : '熟語',
    level: item.level ? `英検${item.level}級` : '',
    search: [item.meanings, item.example?.ja, item.origin, item.note],
  })),
  grammar: adapt('grammar', GRAMMAR, (item) => ({
    title: item.sentence?.en ?? item.q,
    subtitle: `${item.topic}｜答え：${item.answer}`,
    detail: item.explain,
    category: item.topic,
    level: item.level ? `英検${item.level}級` : '',
    search: [item.q, item.choices, item.sentence?.ja],
  })),
  listening: adapt('listening', LISTENING_ITEMS, (item) => ({
    title: item.topic || item.question,
    subtitle: item.questionJa || item.question,
    detail: item.question,
    category: item.type === 'conversation' ? '会話' : 'ナレーション',
    level: item.level ? `英検${item.level}級` : '',
    search: [item.audio?.map((segment) => segment.text), item.choices?.map((choice) => choice.text), item.explain],
  })),
  etymology: adapt('etymology', ETYMOLOGY_PACKS, (item) => {
    const words = item.studyIds.map((id) => wordById.get(id)?.word).filter(Boolean)
    return {
      title: item.title,
      subtitle: item.description,
      detail: words.slice(0, 7).join('・'),
      category: ETYMOLOGY_MODE_META[item.mode]?.label ?? item.mode,
      level: item.rootId ? `語根 ${item.rootId}` : '',
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

export function notebookItemsForDomain(domain) {
  return CATALOG[domain] ?? []
}

export function resolveNotebookItem(domainOrRef, itemId) {
  if (itemId !== undefined) return CATALOG_MAPS[domainOrRef]?.get(itemId) ?? null
  const parsed = parseNotebookRef(domainOrRef)
  return parsed ? CATALOG_MAPS[parsed.domain]?.get(parsed.itemId) ?? null : null
}

export function searchNotebookItems(domain, query = '') {
  const items = notebookItemsForDomain(domain)
  const normalized = String(query).trim().toLocaleLowerCase('ja')
  if (!normalized) return items
  const terms = normalized.split(/\s+/).filter(Boolean)
  return items.filter((item) => terms.every((term) => item.searchText.includes(term)))
}

export function notebookLegacySavedIds(state, domain) {
  if (domain === 'vocab') return Array.isArray(state?.myList) ? state.myList : []
  if (domain === 'kotenVocab') return Array.isArray(state?.kotenWordList) ? state.kotenWordList : []
  if (domain === 'kotenGrammar') return Array.isArray(state?.kotenGrammarList) ? state.kotenGrammarList : []
  if (domain === 'kotenCulture') return Array.isArray(state?.kotenCultureList) ? state.kotenCultureList : []
  return []
}

export function isNotebookItemSaved(state, domain, itemId) {
  const ref = notebookRef(domain, itemId)
  if (!ref) return false
  if (state?.learningNotebook?.entries?.[ref]?.saved === true) return true
  return notebookLegacySavedIds(state, domain).includes(itemId)
}

export function notebookSavedRefs(state = {}) {
  const result = []
  const seen = new Set()
  const push = (ref) => {
    if (!ref || seen.has(ref) || !resolveNotebookItem(ref)) return
    seen.add(ref)
    result.push(ref)
  }

  for (const domain of NOTEBOOK_DOMAIN_IDS) {
    for (const itemId of notebookLegacySavedIds(state, domain)) push(notebookRef(domain, itemId))
  }
  for (const [ref, entry] of Object.entries(state.learningNotebook?.entries ?? {})) {
    if (entry?.saved) push(ref)
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

const srsForDomain = (state, domain) => {
  if (['vocab', 'phrases', 'grammar', 'listening'].includes(domain)) return state?.srs ?? {}
  if (domain === 'etymology') return state?.etymologySrs ?? {}
  if (domain === 'kotenVocab') return state?.kotenSrs ?? {}
  if (domain === 'kotenGrammar') return state?.kotenGrammarSrs ?? {}
  if (domain === 'kotenCulture') return state?.kotenCultureSrs ?? {}
  return {}
}

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
