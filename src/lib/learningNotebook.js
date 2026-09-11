// 8分野を横断する「マイ学習ノート」の保存形式。
// 教材本文は既存データを正本とし、ここには安定ID・ユーザーのメモ・問題集だけを保存する。
import {
  createLearningContentPlan,
  normalizeLearningContentPlan,
} from './learningContentPlan.js'

export const NOTEBOOK_SCHEMA_VERSION = 2

export const NOTEBOOK_DOMAIN_IDS = Object.freeze([
  'vocab',
  'phrases',
  'grammar',
  'listening',
  'etymology',
  'kotenVocab',
  'kotenGrammar',
  'kotenCulture',
])

export const NOTEBOOK_LIMITS = Object.freeze({
  noteLength: 2000,
  tagLength: 32,
  tagsPerItem: 12,
  setTitleLength: 60,
  setDescriptionLength: 300,
  sets: 40,
  itemsPerSet: 500,
  sessions: 40,
})

const DOMAIN_SET = new Set(NOTEBOOK_DOMAIN_IDS)

const isRecord = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const cleanText = (value, limit) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : ''

const cleanTimestamp = (value, fallback = null) =>
  Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback

const uniqueStrings = (values, limit, itemLimit = Infinity) => {
  const seen = new Set()
  const result = []
  for (const value of Array.isArray(values) ? values : []) {
    const clean = cleanText(value, limit)
    if (!clean || seen.has(clean)) continue
    seen.add(clean)
    result.push(clean)
    if (result.length >= itemLimit) break
  }
  return result
}

export function notebookRef(domain, itemId) {
  const cleanDomain = cleanText(domain, 32)
  const cleanId = cleanText(itemId, 180)
  if (!DOMAIN_SET.has(cleanDomain) || !cleanId) return null
  return `${cleanDomain}:${cleanId}`
}

export function parseNotebookRef(ref) {
  if (typeof ref !== 'string') return null
  const separator = ref.indexOf(':')
  if (separator <= 0 || separator >= ref.length - 1) return null
  const domain = ref.slice(0, separator)
  const itemId = ref.slice(separator + 1)
  return DOMAIN_SET.has(domain) && itemId ? { domain, itemId } : null
}

const normalizeRefs = (refs, limit = NOTEBOOK_LIMITS.itemsPerSet) => {
  const seen = new Set()
  const result = []
  for (const value of Array.isArray(refs) ? refs : []) {
    const parsed = parseNotebookRef(value)
    if (!parsed) continue
    const ref = notebookRef(parsed.domain, parsed.itemId)
    if (!ref || seen.has(ref)) continue
    seen.add(ref)
    result.push(ref)
    if (result.length >= limit) break
  }
  return result
}

const normalizeEntry = (value) => {
  if (!isRecord(value)) return null
  const note = cleanText(value.note, NOTEBOOK_LIMITS.noteLength)
  const tags = uniqueStrings(
    value.tags,
    NOTEBOOK_LIMITS.tagLength,
    NOTEBOOK_LIMITS.tagsPerItem,
  )
  const saved = value.saved === true
  if (!saved && !note && tags.length === 0) return null
  return {
    saved,
    note,
    tags,
    createdAt: cleanTimestamp(value.createdAt),
    updatedAt: cleanTimestamp(value.updatedAt),
  }
}

const normalizeSet = (value, index) => {
  if (!isRecord(value)) return null
  const title = cleanText(value.title, NOTEBOOK_LIMITS.setTitleLength)
  if (!title) return null
  const id = cleanText(value.id, 100) || `notebook-set-${index + 1}`
  return {
    id,
    title,
    description: cleanText(value.description, NOTEBOOK_LIMITS.setDescriptionLength),
    refs: normalizeRefs(value.refs),
    createdAt: cleanTimestamp(value.createdAt),
    updatedAt: cleanTimestamp(value.updatedAt),
  }
}

const normalizeSession = (value, index) => {
  if (!isRecord(value) || !DOMAIN_SET.has(value.domain)) return null
  const count = Number.isFinite(value.count)
    ? Math.max(0, Math.min(NOTEBOOK_LIMITS.itemsPerSet, Math.floor(value.count)))
    : 0
  return {
    id: cleanText(value.id, 100) || `notebook-session-${index + 1}`,
    setId: cleanText(value.setId, 100) || null,
    setTitle: cleanText(value.setTitle, NOTEBOOK_LIMITS.setTitleLength),
    domain: value.domain,
    mode: value.mode === 'study' ? 'study' : 'quiz',
    count,
    startedAt: cleanTimestamp(value.startedAt),
  }
}

export function createLearningNotebook() {
  return {
    version: NOTEBOOK_SCHEMA_VERSION,
    entries: {},
    sets: [],
    sessions: [],
    contentPlan: createLearningContentPlan(),
  }
}

// 「マイ単語」は、ほかの単語帳と同じ1冊（名前の変更・削除・並べ替え・どの教材でも入れられる）。
// はじめて使う人にも最初から1冊用意しておき、単語カードの「単語帳」からすぐ入れられるようにする。
// ID を決めておくのは、以前の保存（myList）を何度読み込んでも同じ1冊へまとめ、二重に作らないため。
export const MY_WORDS_SET_ID = 'notebook-set-my-words'
export const MY_WORDS_SET_TITLE = 'マイ単語'
const MY_WORDS_OVERFLOW_PREFIX = `${MY_WORDS_SET_ID}-`

const isMyWordsSetId = (id) => id === MY_WORDS_SET_ID || id.startsWith(MY_WORDS_OVERFLOW_PREFIX)

const emptySet = (id, title, timestamp) => ({
  id,
  title,
  description: '',
  refs: [],
  createdAt: timestamp,
  updatedAt: timestamp,
})

/** 初めて使う端末・リセット直後のノート。空の「マイ単語」を1冊だけ持つ。 */
export function createStarterLearningNotebook() {
  return {
    ...createLearningNotebook(),
    sets: [emptySet(MY_WORDS_SET_ID, MY_WORDS_SET_TITLE, null)],
  }
}

/**
 * 以前の「マイ単語」（英単語IDだけを並べた保存配列 myList）を、単語帳の1冊「マイ単語」へ移す。
 *
 * - legacyIds が配列でなければ（今の形式の保存）何もしない。空の配列なら空の「マイ単語」を用意する。
 * - 1冊500項目を超える分は「マイ単語2」「マイ単語3」…へ続ける。40冊に届いたら、それ以上は作らない。
 * - すでに移した語は入れ直さない（同じ保存を何度読んでも増えない）。
 * - 以前のマイ単語はノートの「保存中」も兼ねていたので、移した語はノートに保存したまま残す
 *   （40冊に届いて単語帳へ入らなかった語も、ノートからは消えない）。
 */
export function foldLegacyMyWords(notebook, legacyIds, { timestamp = Date.now() } = {}) {
  const current = normalizeLearningNotebook(notebook)
  if (!Array.isArray(legacyIds)) return current
  const refs = normalizeRefs(legacyIds.map((id) => notebookRef('vocab', id)), Infinity)

  const entries = { ...current.entries }
  for (const ref of refs) {
    const previous = entries[ref]
    if (previous?.saved) continue
    entries[ref] = {
      saved: true,
      note: previous?.note ?? '',
      tags: previous?.tags ?? [],
      createdAt: previous?.createdAt ?? timestamp,
      updatedAt: timestamp,
    }
  }

  const sets = [...current.sets]
  const bookIndexes = () => sets
    .map((set, index) => (isMyWordsSetId(set.id) ? index : -1))
    .filter((index) => index >= 0)
  if (!bookIndexes().length) {
    if (sets.length >= NOTEBOOK_LIMITS.sets) return { ...current, entries }
    sets.unshift(emptySet(MY_WORDS_SET_ID, MY_WORDS_SET_TITLE, timestamp))
  }

  const alreadyMoved = new Set(bookIndexes().flatMap((index) => sets[index].refs))
  const pending = refs.filter((ref) => !alreadyMoved.has(ref))
  while (pending.length) {
    const indexes = bookIndexes()
    const lastIndex = indexes[indexes.length - 1]
    const last = sets[lastIndex]
    const room = NOTEBOOK_LIMITS.itemsPerSet - last.refs.length
    if (room > 0) {
      sets[lastIndex] = {
        ...last,
        refs: [...last.refs, ...pending.splice(0, room)],
        updatedAt: timestamp,
      }
      continue
    }
    if (sets.length >= NOTEBOOK_LIMITS.sets) break
    let number = indexes.length + 1
    while (sets.some((set) => set.id === `${MY_WORDS_OVERFLOW_PREFIX}${number}`)) number += 1
    sets.splice(
      lastIndex + 1,
      0,
      emptySet(`${MY_WORDS_OVERFLOW_PREFIX}${number}`, `${MY_WORDS_SET_TITLE}${number}`, timestamp),
    )
  }

  return { ...current, entries, sets }
}

export function normalizeLearningNotebook(value) {
  const source = isRecord(value) ? value : {}
  const entries = {}
  if (isRecord(source.entries)) {
    for (const [ref, rawEntry] of Object.entries(source.entries)) {
      if (!parseNotebookRef(ref)) continue
      const entry = normalizeEntry(rawEntry)
      if (entry) entries[ref] = entry
    }
  }

  const seenSetIds = new Set()
  const sets = []
  for (const [index, rawSet] of (Array.isArray(source.sets) ? source.sets : []).entries()) {
    const set = normalizeSet(rawSet, index)
    if (!set || seenSetIds.has(set.id)) continue
    seenSetIds.add(set.id)
    sets.push(set)
    if (sets.length >= NOTEBOOK_LIMITS.sets) break
  }

  const sessions = (Array.isArray(source.sessions) ? source.sessions : [])
    .map(normalizeSession)
    .filter(Boolean)
    .slice(0, NOTEBOOK_LIMITS.sessions)

  return {
    version: NOTEBOOK_SCHEMA_VERSION,
    entries,
    sets,
    sessions,
    contentPlan: normalizeLearningContentPlan(source.contentPlan),
  }
}

// 進捗コードでは、未使用の管理データを省いてQR化に必要な容量を守る。
// 読込時は normalizeLearningNotebook() が空の contentPlan を補うため、
// 旧コードとの互換性と端末保存時の扱いは変わらない。
export function compactLearningNotebook(value) {
  const notebook = normalizeLearningNotebook(value)
  if (Object.keys(notebook.contentPlan.entries).length > 0) return notebook
  const { contentPlan: _unusedContentPlan, ...compact } = notebook
  return compact
}

export function notebookEntryFor(notebook, domain, itemId) {
  const ref = notebookRef(domain, itemId)
  if (!ref) return null
  return normalizeLearningNotebook(notebook).entries[ref] ?? null
}

// 教材データを読み込まずに、旧リストを含む保存参照を数える軽量セレクタ。
// 共通メニューなど、全16,071項目のカタログをロードしたくない場所で使う。
// 以前の英単語の保存配列（myList）は、読み込むときに foldLegacyMyWords でノートへ移している。
export function notebookStoredSavedRefs(state = {}) {
  const refs = new Set()
  const legacy = [
    ['kotenVocab', state.kotenWordList],
    ['kotenGrammar', state.kotenGrammarList],
    ['kotenCulture', state.kotenCultureList],
  ]
  for (const [domain, ids] of legacy) {
    for (const itemId of Array.isArray(ids) ? ids : []) {
      const ref = notebookRef(domain, itemId)
      if (ref) refs.add(ref)
    }
  }
  for (const [ref, entry] of Object.entries(state.learningNotebook?.entries ?? {})) {
    if (entry?.saved && parseNotebookRef(ref)) refs.add(ref)
  }
  return [...refs]
}

export function notebookStoredSavedCount(state = {}) {
  return notebookStoredSavedRefs(state).length
}

export function setNotebookItemSaved(
  notebook,
  domain,
  itemId,
  saved,
  timestamp = Date.now(),
) {
  const ref = notebookRef(domain, itemId)
  if (!ref) return normalizeLearningNotebook(notebook)
  const current = normalizeLearningNotebook(notebook)
  const previous = current.entries[ref] ?? {
    saved: false,
    note: '',
    tags: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  const nextEntry = {
    ...previous,
    saved: Boolean(saved),
    createdAt: previous.createdAt ?? timestamp,
    updatedAt: timestamp,
  }
  const entries = { ...current.entries }
  if (!nextEntry.saved && !nextEntry.note && nextEntry.tags.length === 0) delete entries[ref]
  else entries[ref] = nextEntry
  return { ...current, entries }
}

export function updateNotebookItem(
  notebook,
  domain,
  itemId,
  patch = {},
  timestamp = Date.now(),
) {
  const ref = notebookRef(domain, itemId)
  if (!ref) return normalizeLearningNotebook(notebook)
  const current = normalizeLearningNotebook(notebook)
  const previous = current.entries[ref] ?? {
    saved: false,
    note: '',
    tags: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  const nextEntry = {
    ...previous,
    // メモやタグを残す操作は、その項目をノートへ保存する操作でもある。
    saved: patch.saved === false ? false : true,
    note: Object.hasOwn(patch, 'note')
      ? cleanText(patch.note, NOTEBOOK_LIMITS.noteLength)
      : previous.note,
    tags: Object.hasOwn(patch, 'tags')
      ? uniqueStrings(patch.tags, NOTEBOOK_LIMITS.tagLength, NOTEBOOK_LIMITS.tagsPerItem)
      : previous.tags,
    createdAt: previous.createdAt ?? timestamp,
    updatedAt: timestamp,
  }
  return {
    ...current,
    entries: { ...current.entries, [ref]: nextEntry },
  }
}

/**
 * その項目をノートから完全に外す。メモ・タグごと消し、どの問題集からも抜く。
 * 自作単語のように「教材そのものが消える」ときだけ使う。
 * 教材が残る保存の解除は setNotebookItemSaved（メモを残す）を使う。
 */
export function forgetNotebookItem(notebook, domain, itemId, timestamp = Date.now()) {
  const ref = notebookRef(domain, itemId)
  const current = normalizeLearningNotebook(notebook)
  if (!ref) return current
  const entries = { ...current.entries }
  delete entries[ref]
  return {
    ...current,
    entries,
    sets: current.sets.map((set) => (
      set.refs.includes(ref)
        ? { ...set, refs: set.refs.filter((item) => item !== ref), updatedAt: timestamp }
        : set
    )),
  }
}

const uniqueId = (prefix, timestamp, randomPart) =>
  `${prefix}-${Math.floor(timestamp).toString(36)}-${String(randomPart).replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'local'}`

export function createNotebookSet(
  notebook,
  title,
  { description = '', timestamp = Date.now(), randomPart = Math.random().toString(36).slice(2) } = {},
) {
  const current = normalizeLearningNotebook(notebook)
  const cleanTitle = cleanText(title, NOTEBOOK_LIMITS.setTitleLength)
  if (!cleanTitle || current.sets.length >= NOTEBOOK_LIMITS.sets) {
    return { notebook: current, setId: null }
  }
  let id = uniqueId('notebook-set', timestamp, randomPart)
  let suffix = 2
  const existing = new Set(current.sets.map((set) => set.id))
  while (existing.has(id)) id = `${id}-${suffix++}`
  const set = {
    id,
    title: cleanTitle,
    description: cleanText(description, NOTEBOOK_LIMITS.setDescriptionLength),
    refs: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  return {
    notebook: { ...current, sets: [...current.sets, set] },
    setId: id,
  }
}

export function updateNotebookSet(notebook, setId, patch = {}, timestamp = Date.now()) {
  const current = normalizeLearningNotebook(notebook)
  return {
    ...current,
    sets: current.sets.map((set) => {
      if (set.id !== setId) return set
      const title = Object.hasOwn(patch, 'title')
        ? cleanText(patch.title, NOTEBOOK_LIMITS.setTitleLength)
        : set.title
      return {
        ...set,
        title: title || set.title,
        description: Object.hasOwn(patch, 'description')
          ? cleanText(patch.description, NOTEBOOK_LIMITS.setDescriptionLength)
          : set.description,
        updatedAt: timestamp,
      }
    }),
  }
}

/** 単語帳の並びで、1冊を1つ上（up）か1つ下（down）へ動かす。並びはどの画面でも同じ順に使う。 */
export function moveNotebookSet(notebook, setId, direction) {
  const current = normalizeLearningNotebook(notebook)
  const step = direction === 'up' ? -1 : direction === 'down' ? 1 : 0
  const index = current.sets.findIndex((set) => set.id === setId)
  const target = index + step
  if (!step || index < 0 || target < 0 || target >= current.sets.length) return current
  const sets = [...current.sets]
  ;[sets[index], sets[target]] = [sets[target], sets[index]]
  return { ...current, sets }
}

export function deleteNotebookSet(notebook, setId) {
  const current = normalizeLearningNotebook(notebook)
  return {
    ...current,
    sets: current.sets.filter((set) => set.id !== setId),
    // 問題集そのものを消したら、その問題集の利用履歴だけも除く。
    // 各教材のSRS正誤・復習履歴は別契約なので影響しない。
    sessions: current.sessions.filter((session) => session.setId !== setId),
  }
}

export function setNotebookSetItem(
  notebook,
  setId,
  domain,
  itemId,
  included,
  timestamp = Date.now(),
) {
  const ref = notebookRef(domain, itemId)
  const current = normalizeLearningNotebook(notebook)
  if (!ref) return current
  return {
    ...current,
    sets: current.sets.map((set) => {
      if (set.id !== setId) return set
      const present = set.refs.includes(ref)
      let refs = set.refs
      if (included && !present && refs.length < NOTEBOOK_LIMITS.itemsPerSet) refs = [...refs, ref]
      if (!included && present) refs = refs.filter((item) => item !== ref)
      return refs === set.refs ? set : { ...set, refs, updatedAt: timestamp }
    }),
  }
}

/**
 * まとめて入れる・外す（長文の全語を単語帳へ、など）。1冊500項目を超える分は入れない。
 * すでに入っている項目は入れ直さず、入っていない項目を外そうとしても何も変えない。
 */
export function setNotebookSetItems(
  notebook,
  setId,
  domain,
  itemIds,
  included,
  timestamp = Date.now(),
) {
  const current = normalizeLearningNotebook(notebook)
  const refs = normalizeRefs(
    (Array.isArray(itemIds) ? itemIds : []).map((itemId) => notebookRef(domain, itemId)),
    Infinity,
  )
  if (!refs.length) return current
  return {
    ...current,
    sets: current.sets.map((set) => {
      if (set.id !== setId) return set
      let nextRefs = set.refs
      if (included) {
        const present = new Set(set.refs)
        const room = Math.max(0, NOTEBOOK_LIMITS.itemsPerSet - set.refs.length)
        const added = refs.filter((ref) => !present.has(ref)).slice(0, room)
        if (added.length) nextRefs = [...set.refs, ...added]
      } else {
        const removing = new Set(refs)
        const kept = set.refs.filter((ref) => !removing.has(ref))
        if (kept.length !== set.refs.length) nextRefs = kept
      }
      return nextRefs === set.refs ? set : { ...set, refs: nextRefs, updatedAt: timestamp }
    }),
  }
}

export function moveNotebookSetItem(notebook, setId, ref, direction, timestamp = Date.now()) {
  const current = normalizeLearningNotebook(notebook)
  const step = direction === 'up' ? -1 : direction === 'down' ? 1 : 0
  if (!step || !parseNotebookRef(ref)) return current
  return {
    ...current,
    sets: current.sets.map((set) => {
      if (set.id !== setId) return set
      const index = set.refs.indexOf(ref)
      const target = index + step
      if (index < 0 || target < 0 || target >= set.refs.length) return set
      const refs = [...set.refs]
      ;[refs[index], refs[target]] = [refs[target], refs[index]]
      return { ...set, refs, updatedAt: timestamp }
    }),
  }
}

export function recordNotebookSetLaunch(
  notebook,
  {
    setId = null,
    setTitle = '',
    domain,
    mode = 'quiz',
    count = 0,
    timestamp = Date.now(),
  } = {},
) {
  const current = normalizeLearningNotebook(notebook)
  if (!DOMAIN_SET.has(domain)) return current
  const session = {
    id: uniqueId('notebook-session', timestamp, Math.random().toString(36).slice(2)),
    setId: cleanText(setId, 100) || null,
    setTitle: cleanText(setTitle, NOTEBOOK_LIMITS.setTitleLength),
    domain,
    mode: mode === 'study' ? 'study' : 'quiz',
    count: Math.max(0, Math.min(NOTEBOOK_LIMITS.itemsPerSet, Math.floor(Number(count) || 0))),
    startedAt: timestamp,
  }
  return {
    ...current,
    sessions: [session, ...current.sessions].slice(0, NOTEBOOK_LIMITS.sessions),
  }
}
