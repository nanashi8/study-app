// 英語・古典・漢文の暗記・テスト教材を横断する「マイ学習ノート」の保存形式。
// 教材本文は既存データを正本とし、ここには安定ID・ユーザーのメモ・単語帳だけを保存する。
import {
  createLearningContentPlan,
  normalizeLearningContentPlan,
} from './learningContentPlan.js'

export const NOTEBOOK_SCHEMA_VERSION = 2

// 単語帳に入れられる教材の種類。並びはアプリごと（英語→古典→漢文）で、ノートの絞り込みもこの順に出す。
// 教材データを読み込まずに使える名前・単位だけをここに置く（本文の引き当ては learningNotebookCatalog.js）。
// canStudy は「暗記」で始められる教材。ほかはテスト（問題を解く形）で学ぶ。
export const NOTEBOOK_DOMAINS = Object.freeze([
  { id: 'vocab', label: '英単語', unit: '語', emoji: '📘', color: '#4f46e5', canStudy: true },
  { id: 'phrases', label: '英熟語・構文', unit: '項目', emoji: '🧩', color: '#7c3aed', canStudy: true },
  { id: 'grammar', label: '英文法', unit: '問', emoji: '✍️', color: '#d97706', canStudy: false },
  { id: 'listening', label: 'リスニング', unit: '問', emoji: '🎧', color: '#0284c7', canStudy: false },
  { id: 'dictation', label: 'ディクテーション', unit: '問', emoji: '⌨️', color: '#0d9488', canStudy: false },
  { id: 'etymology', label: '語源', unit: '項目', emoji: '🌱', color: '#a21caf', canStudy: true },
  { id: 'kotenVocab', label: '古典単語', unit: '語', emoji: '📜', color: '#c2410c', canStudy: true },
  { id: 'kotenGrammar', label: '古典文法', unit: '項目', emoji: '🪶', color: '#b45309', canStudy: true },
  { id: 'kotenCulture', label: '古典常識', unit: '項目', emoji: '🏯', color: '#6d28d9', canStudy: true },
  { id: 'kotenInterpretation', label: '短文解釈', unit: '問', emoji: '🔎', color: '#ea580c', canStudy: false },
  { id: 'kanbunVocab', label: '漢語', unit: '語', emoji: '📕', color: '#0f766e', canStudy: true },
  { id: 'kanbunGrammar', label: '漢文法', unit: '項目', emoji: '🧭', color: '#be123c', canStudy: true },
  { id: 'kanbunCulture', label: '漢文常識', unit: 'テーマ', emoji: '🏛️', color: '#7c3aed', canStudy: true },
  { id: 'kanbunKundoku', label: '返り点', unit: '題', emoji: '🔁', color: '#9f1239', canStudy: false },
].map((domain) => Object.freeze(domain)))

export const NOTEBOOK_DOMAIN_IDS = Object.freeze(NOTEBOOK_DOMAINS.map((domain) => domain.id))

export const NOTEBOOK_DOMAIN_BY_ID = Object.freeze(
  Object.fromEntries(NOTEBOOK_DOMAINS.map((domain) => [domain.id, domain])),
)

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

/** 教材 domain の項目IDを「教材:ID」の参照へ（重複と不正なIDは除く）。1つでも並びでも受け取る。 */
export function notebookRefs(domain, itemIds) {
  const ids = Array.isArray(itemIds) ? itemIds : [itemIds]
  return [...new Set(ids.map((itemId) => notebookRef(domain, itemId)).filter(Boolean))]
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

// 以前の古典・漢文の「登録リスト」（教材ごとのID配列）を移す単語帳。固定IDにして、何度読み込んでも同じ冊へまとめる。
export const KOTEN_SAVED_SET_ID = 'notebook-set-koten-saved'
export const KOTEN_SAVED_SET_TITLE = '古典の登録リスト'
export const KANBUN_SAVED_SET_ID = 'notebook-set-kanbun-saved'
export const KANBUN_SAVED_SET_TITLE = '漢文の登録リスト'

// 以前の保存項目。読み込むときに単語帳へ移し、端末保存・進捗コード・クラウドの保存項目からは外す。
export const LEGACY_SAVED_LIST_FIELDS = Object.freeze([
  'kotenWordList',
  'kotenGrammarList',
  'kotenCultureList',
  'kanbunVocabList',
  'kanbunGrammarList',
  'kanbunCultureList',
])

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
 * 以前の保存配列（「教材:ID」の並び）を、固定IDの単語帳へ移す共通の手順。
 *
 * - 1冊500項目を超える分は「名前2」「名前3」…へ続ける。40冊に届いたら、それ以上は作らない。
 * - すでに移した項目は入れ直さない（同じ保存を何度読んでも増えない）。
 * - 以前の保存はノートの「保存中」も兼ねていたので、移した項目はノートに保存したまま残す
 *   （40冊に届いて単語帳へ入らなかった項目も、ノートからは消えない）。
 * - placeFirst の冊は単語帳の先頭へ、ほかは利用者が作った冊のあとへ置く。
 */
function foldLegacyBook(notebook, legacyRefs, {
  setId,
  title,
  placeFirst = false,
  createWhenEmpty = false,
  timestamp,
}) {
  const current = normalizeLearningNotebook(notebook)
  const refs = normalizeRefs(legacyRefs, Infinity)
  if (!refs.length && !createWhenEmpty) return current
  const overflowPrefix = `${setId}-`
  const isBookId = (id) => id === setId || id.startsWith(overflowPrefix)

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
    .map((set, index) => (isBookId(set.id) ? index : -1))
    .filter((index) => index >= 0)
  if (!bookIndexes().length) {
    if (sets.length >= NOTEBOOK_LIMITS.sets) return { ...current, entries }
    const book = emptySet(setId, title, timestamp)
    if (placeFirst) sets.unshift(book)
    else sets.push(book)
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
    while (sets.some((set) => set.id === `${overflowPrefix}${number}`)) number += 1
    sets.splice(
      lastIndex + 1,
      0,
      emptySet(`${overflowPrefix}${number}`, `${title}${number}`, timestamp),
    )
  }

  return { ...current, entries, sets }
}

/**
 * 以前の「マイ単語」（英単語IDだけを並べた保存配列 myList）を、単語帳の先頭の1冊「マイ単語」へ移す。
 * legacyIds が配列でなければ（今の形式の保存）何もしない。空の配列なら空の「マイ単語」を用意する（以前は誰にでもあったため）。
 */
export function foldLegacyMyWords(notebook, legacyIds, { timestamp = Date.now() } = {}) {
  if (!Array.isArray(legacyIds)) return normalizeLearningNotebook(notebook)
  return foldLegacyBook(notebook, legacyIds.map((id) => notebookRef('vocab', id)), {
    setId: MY_WORDS_SET_ID,
    title: MY_WORDS_SET_TITLE,
    placeFirst: true,
    createWhenEmpty: true,
    timestamp,
  })
}

/**
 * 以前の古典・漢文の「登録リスト」を、単語帳「古典の登録リスト」「漢文の登録リスト」へ移す。
 * source は読み込む保存（端末・進捗コード・クラウド）そのもの。登録が1つもなければ冊は作らない。
 * 単語・文法・常識は同じ1冊に入り、学ぶときは各コンテンツの「単語帳」から教材ごとに分けて始める。
 */
export function foldLegacySavedLists(notebook, source = {}, { timestamp = Date.now() } = {}) {
  const refsFrom = (pairs) => pairs.flatMap(([domain, ids]) => (
    Array.isArray(ids) ? ids.map((id) => notebookRef(domain, id)) : []
  ))
  const withKoten = foldLegacyBook(notebook, refsFrom([
    ['kotenVocab', source?.kotenWordList],
    ['kotenGrammar', source?.kotenGrammarList],
    ['kotenCulture', source?.kotenCultureList],
  ]), { setId: KOTEN_SAVED_SET_ID, title: KOTEN_SAVED_SET_TITLE, timestamp })
  return foldLegacyBook(withKoten, refsFrom([
    ['kanbunVocab', source?.kanbunVocabList],
    ['kanbunGrammar', source?.kanbunGrammarList],
    ['kanbunCulture', source?.kanbunCultureList],
  ]), { setId: KANBUN_SAVED_SET_ID, title: KANBUN_SAVED_SET_TITLE, timestamp })
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

// 教材データを読み込まずに、ノートの保存参照を数える軽量セレクタ。
// 共通メニューなど、全教材のカタログをロードしたくない場所で使う。
// 以前の「マイ単語」（myList）と古典・漢文の登録リストは、読み込むときにノートの保存と単語帳へ移している。
export function notebookStoredSavedRefs(state = {}) {
  const refs = new Set()
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
  return setNotebookSetRefs(notebook, setId, notebookRefs(domain, itemIds ?? []), included, timestamp)
}

/** 教材をまたいでまとめて入れる・外す。refs は「教材:ID」の並び（短文解釈の重要語と文法など）。 */
export function setNotebookSetRefs(notebook, setId, itemRefs, included, timestamp = Date.now()) {
  const current = normalizeLearningNotebook(notebook)
  const refs = normalizeRefs(itemRefs, Infinity)
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
