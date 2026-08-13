// 8分野を横断する「マイ学習ノート」の保存形式。
// 教材本文は既存データを正本とし、ここには安定ID・ユーザーのメモ・問題集だけを保存する。

export const NOTEBOOK_SCHEMA_VERSION = 1

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
  }
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
  }
}

export function notebookEntryFor(notebook, domain, itemId) {
  const ref = notebookRef(domain, itemId)
  if (!ref) return null
  return normalizeLearningNotebook(notebook).entries[ref] ?? null
}

// 教材データを読み込まずに、旧リストを含む保存参照を数える軽量セレクタ。
// 共通メニューなど、全16,071項目のカタログをロードしたくない場所で使う。
export function notebookStoredSavedRefs(state = {}) {
  const refs = new Set()
  const legacy = [
    ['vocab', state.myList],
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
