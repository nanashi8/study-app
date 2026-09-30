// 自作カード（利用者がテンプレートを選んで登録するカード）と、カードの分類（教科・独自のカテゴリー）。
//
// テンプレートは、登録の欄の組み合わせ。「用語と意味」は用語と意味の2欄だけ、「英単語」は英単語が使う情報を全部書く。
// 英単語のカードは、これまでの自作単語（lib/customWords.js）として辞書と同じ ID の引き当てに乗せ、
// 英単語の暗記・テスト・辞書ページで学ぶ。英単語以外のテンプレートのカードはここに持ち、自作カードの暗記・テストで学ぶ。
//
// 分類は、既存の教科（英語・古典・漢文・数学・社会・理科）か、利用者が作ったカテゴリー（例「2学期中間英語」）。
// 教科を選んだカードは、その教科のアプリのホームにも出る。カテゴリーも「表示する教科」を選ぶと、その教科のアプリに出る。
// 辞書の語数・教材の数などの固定の件数には、自作カードを混ぜない。
import { orderForStudy, pickInStudyOrder, rankQuestionsForStudy } from './studyOrder.js'
import { mixItemsForStudy, mixRankedForStudy, questionMixStockOf } from './studyMix.js'

export const CUSTOM_CARD_PREFIX = 'c-'
export const CUSTOM_CATEGORY_PREFIX = 'cat-'
export const SUBJECT_CATEGORY_PREFIX = 'subject:'
// テストの結果（contentQuizResults）の教材の名前。
export const CUSTOM_CARD_QUIZ_DOMAIN = 'custom-cards'

export const CUSTOM_CARD_LIMITS = Object.freeze({
  cards: 500,
  front: 120,
  back: 300,
  reading: 80,
  kanji: 40,
  pos: 30,
  example: 300,
  exampleTranslation: 300,
  note: 600,
  categories: 40,
  categoryTitle: 40,
})

// 教科＝スタディアプリに実装済みの教科のアプリ。id は上部のバーのアプリ（lib/appHome.js）と同じ。
// template は、その教科で登録を始めたときに最初に選ぶテンプレート。
export const CUSTOM_SUBJECTS = Object.freeze([
  { id: 'english', label: '英語', appScreen: 'home', appLabel: '英語アプリ', emoji: '🦉', color: '#6366f1', template: 'english' },
  { id: 'koten', label: '古典', appScreen: 'kotenList', appLabel: '古典アプリ', emoji: '📜', color: '#d97706', template: 'koten' },
  { id: 'kanbun', label: '漢文', appScreen: 'kanbunHome', appLabel: '漢文アプリ', emoji: '📕', color: '#be123c', template: 'kanbun' },
  { id: 'math', label: '数学', appScreen: 'mathMap', appLabel: '数学アプリ', emoji: '📐', color: '#7c3aed', template: 'qa' },
  { id: 'social', label: '社会', appScreen: 'socialHome', appLabel: '社会アプリ', emoji: '🗾', color: '#0f766e', template: 'termNote' },
  { id: 'science', label: '理科', appScreen: 'scienceHome', appLabel: '理科アプリ', emoji: '🔬', color: '#15803d', template: 'termNote' },
].map((subject) => Object.freeze(subject)))

export const CUSTOM_SUBJECT_IDS = Object.freeze(CUSTOM_SUBJECTS.map((subject) => subject.id))
export const CUSTOM_SUBJECT_BY_ID = Object.freeze(
  Object.fromEntries(CUSTOM_SUBJECTS.map((subject) => [subject.id, subject])),
)

// 欄。key は保存の名前（英単語以外のカードは front・back と、読み・漢字・品詞・例文・例文の訳・解説）。
const field = (key, label, { required = false, multiline = false, placeholder = '', hint = '' } = {}) => Object.freeze({
  key,
  label,
  required,
  multiline,
  placeholder,
  hint,
})

// テストの問い方。prompt の欄を読んで、answer の欄を選ぶ。kind が同じテンプレートどうしで誤答を作る。
const quiz = (prompt, answer, ask, kind) => Object.freeze({ prompt, answer, ask, kind })

// テンプレート。並びは登録の画面で選ぶ順。english は英単語の欄（lib/customWords.js の ENGLISH_WORD_FIELDS）を使う。
export const CUSTOM_CARD_TEMPLATES = Object.freeze([
  {
    id: 'term',
    label: '用語と意味',
    description: '用語と意味の2つだけを書く',
    emoji: '📝',
    fields: [
      field('front', '用語', { required: true, placeholder: '例：光合成' }),
      field('back', '意味', { required: true, multiline: true, placeholder: '例：植物が光を使って、でんぷんなどの養分をつくるはたらき' }),
    ],
    quiz: quiz('back', 'front', 'この意味の用語は？', 'term'),
  },
  {
    id: 'termNote',
    label: '用語・意味・解説',
    description: '用語と意味に、解説や覚え方を添える',
    emoji: '🗒️',
    fields: [
      field('front', '用語', { required: true, placeholder: '例：扇状地' }),
      field('back', '意味', { required: true, multiline: true, placeholder: '例：川が山地から平地へ出る所に、土砂が積もってできた扇の形の土地' }),
      field('note', '解説', { multiline: true, placeholder: '覚え方や、まちがえやすい語との見分け方' }),
    ],
    quiz: quiz('back', 'front', 'この意味の用語は？', 'term'),
  },
  {
    id: 'qa',
    label: '一問一答',
    description: '問題と答え、解説を書く',
    emoji: '❓',
    fields: [
      field('front', '問題', { required: true, multiline: true, placeholder: '例：鎌倉幕府を開いた人物は？' }),
      field('back', '答え', { required: true, placeholder: '例：源頼朝' }),
      field('note', '解説', { multiline: true, placeholder: '答えの理由や、いっしょに覚えること' }),
    ],
    quiz: quiz('front', 'back', 'この問題の答えは？', 'answer'),
  },
  {
    id: 'english',
    label: '英単語',
    description: '英単語の意味・品詞・発音・例文・関連する語・語の成り立ちまで書く',
    emoji: '🔤',
    fields: [],
    quiz: null,
  },
  {
    id: 'koten',
    label: '古典単語',
    description: '古語の読み・漢字・品詞・意味・例文と訳を書く',
    emoji: '📜',
    fields: [
      field('front', '古語', { required: true, placeholder: '例：あはれなり' }),
      field('reading', '読み（現代仮名遣い）', { placeholder: '例：あわれなり' }),
      field('kanji', '漢字', { placeholder: '例：哀れなり' }),
      field('pos', '品詞・活用', { placeholder: '例：形容動詞・ナリ活用' }),
      field('back', '意味', { required: true, multiline: true, placeholder: '例：しみじみと心を打たれる・趣深い' }),
      field('example', '例文', { multiline: true, placeholder: '例：もののあはれを知る' }),
      field('exampleTranslation', '例文の訳', { multiline: true, placeholder: '例：しみじみとした趣を理解する' }),
      field('note', '解説', { multiline: true, placeholder: '覚え方や、今の意味とのちがい' }),
    ],
    quiz: quiz('front', 'back', 'この古語の意味は？', 'meaning'),
  },
  {
    id: 'kanbun',
    label: '漢語',
    description: '漢語・句法の読み・意味・用例と訳を書く',
    emoji: '📕',
    fields: [
      field('front', '漢語・句法', { required: true, placeholder: '例：未だ〜ず' }),
      field('reading', '読み', { placeholder: '例：いまだ〜ず' }),
      field('back', '意味', { required: true, multiline: true, placeholder: '例：まだ〜ない' }),
      field('example', '用例（書き下し文）', { multiline: true, placeholder: '例：未だ学を好む者を聞かざるなり' }),
      field('exampleTranslation', '用例の訳', { multiline: true, placeholder: '例：まだ学問を好む者を聞いたことがない' }),
      field('note', '解説', { multiline: true, placeholder: '見分け方や、いっしょに覚える句法' }),
    ],
    quiz: quiz('front', 'back', 'この漢語の意味は？', 'meaning'),
  },
].map((template) => Object.freeze({ ...template, fields: Object.freeze(template.fields) })))

export const CUSTOM_CARD_TEMPLATE_IDS = Object.freeze(CUSTOM_CARD_TEMPLATES.map((template) => template.id))
export const CUSTOM_CARD_TEMPLATE_BY_ID = Object.freeze(
  Object.fromEntries(CUSTOM_CARD_TEMPLATES.map((template) => [template.id, template])),
)
// 英単語は自作単語として持つので、ここのカードのテンプレートは英単語以外の5つ。
export const ENGLISH_TEMPLATE_ID = 'english'
export const CARD_TEMPLATE_IDS = Object.freeze(CUSTOM_CARD_TEMPLATE_IDS.filter((id) => id !== ENGLISH_TEMPLATE_ID))
// カードが持つ欄（英単語以外）。テンプレートを変えても、同じ key の欄は中身を引き継ぐ。
export const CARD_FIELD_KEYS = Object.freeze(['front', 'back', 'reading', 'kanji', 'pos', 'example', 'exampleTranslation', 'note'])

export const templateFor = (templateId) => CUSTOM_CARD_TEMPLATE_BY_ID[templateId] ?? CUSTOM_CARD_TEMPLATE_BY_ID.term

/** その欄の名前（テンプレートごと）。テンプレートにない欄は null。 */
export function templateFieldLabel(templateId, key) {
  return templateFor(templateId).fields.find((item) => item.key === key)?.label ?? null
}

const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const timestamp = (value, fallback = null) => (
  Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback
)

// 1行の欄は空白をつめる。複数行の欄（意味・問題・解説など）は改行を残して、行ごとに空白をつめる。
const oneLine = (value, limit) => (
  typeof value === 'string' ? value.normalize('NFC').trim().replace(/\s+/gu, ' ').slice(0, limit) : ''
)
const multiLine = (value, limit) => (
  typeof value === 'string'
    ? value.normalize('NFC')
      .split(/\r?\n/u)
      .map((line) => line.trim().replace(/[ \t　]+/gu, ' '))
      .join('\n')
      .replace(/\n{3,}/gu, '\n\n')
      .trim()
      .slice(0, limit)
    : ''
)

const MULTILINE_KEYS = new Set(['back', 'example', 'exampleTranslation', 'note'])
/** カードの欄1つを保存の形にそろえる。問題（一問一答の front）も複数行で書ける。 */
export function cleanCardField(key, value, templateId = 'term') {
  const limit = CUSTOM_CARD_LIMITS[key] ?? 200
  const multiline = MULTILINE_KEYS.has(key)
    || templateFor(templateId).fields.some((item) => item.key === key && item.multiline)
  return multiline ? multiLine(value, limit) : oneLine(value, limit)
}

// ── 分類（教科・独自のカテゴリー） ───────────────────────────────────

export const subjectCategoryId = (subjectId) => `${SUBJECT_CATEGORY_PREFIX}${subjectId}`

export const isSubjectCategoryId = (id) => (
  typeof id === 'string'
  && id.startsWith(SUBJECT_CATEGORY_PREFIX)
  && CUSTOM_SUBJECT_IDS.includes(id.slice(SUBJECT_CATEGORY_PREFIX.length))
)

export const isCustomCategoryId = (id) => (
  typeof id === 'string' && id.startsWith(CUSTOM_CATEGORY_PREFIX) && id.length > CUSTOM_CATEGORY_PREFIX.length
)

export const isCategoryKey = (id) => isSubjectCategoryId(id) || isCustomCategoryId(id)

export const DEFAULT_CATEGORY_ID = subjectCategoryId('english')

/** 教科の分類。{ id: 'subject:social', kind: 'subject', subject, title, ... } */
export const SUBJECT_CATEGORIES = Object.freeze(CUSTOM_SUBJECTS.map((subject) => Object.freeze({
  id: subjectCategoryId(subject.id),
  kind: 'subject',
  subject: subject.id,
  title: subject.label,
  template: subject.template,
  emoji: subject.emoji,
  color: subject.color,
})))

const createId = (prefix, { now = Date.now(), randomPart = Math.random().toString(36).slice(2) } = {}) => {
  const time = Math.floor(now).toString(36)
  const tail = String(randomPart).replace(/[^a-z0-9]/gu, '').slice(0, 6) || 'local'
  return `${prefix}${time}${tail}`
}

export const createCustomCardId = (options) => createId(CUSTOM_CARD_PREFIX, options)
export const createCustomCategoryId = (options) => createId(CUSTOM_CATEGORY_PREFIX, options)

/** 作ったカテゴリー1つを保存の形に。名前がなければ成り立たない。 */
export function normalizeCustomCategory(value, { now = Date.now() } = {}) {
  if (!isRecord(value)) return null
  const title = oneLine(value.title, CUSTOM_CARD_LIMITS.categoryTitle)
  if (!title) return null
  const id = isCustomCategoryId(value.id) ? oneLine(value.id, 80) : createCustomCategoryId({ now })
  const createdAt = timestamp(value.createdAt, now)
  return {
    id,
    title,
    // 表示する教科（その教科のアプリにも出す）。なければ null。
    subject: CUSTOM_SUBJECT_IDS.includes(value.subject) ? value.subject : null,
    // このカテゴリーで登録を始めるときに最初に選ぶテンプレート。
    template: CUSTOM_CARD_TEMPLATE_IDS.includes(value.template) ? value.template : null,
    createdAt,
    updatedAt: timestamp(value.updatedAt, createdAt),
  }
}

export function normalizeCustomCategories(value, { now = Date.now() } = {}) {
  const seen = new Set()
  const categories = []
  for (const raw of Array.isArray(value) ? value : []) {
    const category = normalizeCustomCategory(raw, { now })
    if (!category || seen.has(category.id)) continue
    seen.add(category.id)
    categories.push(category)
    if (categories.length >= CUSTOM_CARD_LIMITS.categories) break
  }
  return categories
}

/**
 * 作る・書き換えるの単一入口。status は saved / invalid（名前が空） / full（上限）。
 */
export function upsertCustomCategory(list, input, { now = Date.now() } = {}) {
  const categories = normalizeCustomCategories(list, { now })
  const index = isCustomCategoryId(input?.id) ? categories.findIndex((item) => item.id === input.id) : -1
  if (index < 0 && categories.length >= CUSTOM_CARD_LIMITS.categories) {
    return { categories, id: null, status: 'full' }
  }
  const previous = index >= 0 ? categories[index] : null
  const normalized = normalizeCustomCategory({
    ...(previous ?? {}),
    ...input,
    id: previous ? previous.id : createCustomCategoryId({ now }),
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  }, { now })
  if (!normalized) return { categories, id: null, status: 'invalid' }
  const next = index >= 0
    ? categories.map((item, at) => (at === index ? normalized : item))
    : [...categories, normalized]
  return { categories: next, id: normalized.id, status: 'saved' }
}

/** カテゴリーの並びで、1つを上（up）か下（down）へ。 */
export function moveCustomCategory(list, id, direction) {
  const categories = normalizeCustomCategories(list)
  const step = direction === 'up' ? -1 : direction === 'down' ? 1 : 0
  const index = categories.findIndex((item) => item.id === id)
  const target = index + step
  if (!step || index < 0 || target < 0 || target >= categories.length) return categories
  const next = [...categories]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

export function removeCustomCategory(list, id) {
  return normalizeCustomCategories(list).filter((item) => item.id !== id)
}

/** 分類の一覧（教科6つ → 作ったカテゴリーの順）。画面の選択肢・一覧の並びはこれ1つで決める。 */
export function customCategoryChoices(categories = []) {
  return [
    ...SUBJECT_CATEGORIES,
    ...normalizeCustomCategories(categories).map((category) => ({
      ...category,
      kind: 'custom',
      emoji: '🗂️',
      color: category.subject ? CUSTOM_SUBJECT_BY_ID[category.subject].color : '#0891b2',
    })),
  ]
}

/** 分類1つ（教科か作ったカテゴリー）。見つからなければ null。 */
export function findCustomCategory(categories, id) {
  return customCategoryChoices(categories).find((category) => category.id === id) ?? null
}

/** その分類のカードを出す教科（教科そのもの、またはカテゴリーの「表示する教科」）。なければ null。 */
export function categorySubject(categories, id) {
  if (isSubjectCategoryId(id)) return id.slice(SUBJECT_CATEGORY_PREFIX.length)
  return findCustomCategory(categories, id)?.subject ?? null
}

/** 分類の名前（教科なら「社会」、作ったカテゴリーならその名前）。 */
export function categoryTitle(categories, id) {
  return findCustomCategory(categories, id)?.title ?? '分類なし'
}

/** 教科のアプリに出す分類（その教科と、その教科を「表示する教科」に選んだカテゴリー）。 */
export function categoriesForSubject(categories, subjectId) {
  return customCategoryChoices(categories).filter((category) => category.subject === subjectId)
}

/**
 * 分類ごとのカード（英単語のカード words と、ほかのテンプレートのカード cards）。画面の並びもここで決める。
 * 教科から開いたとき（subject）は、その教科 → その教科に表示するカテゴリーの順。
 * メニューから開いたときは、作ったカテゴリー（空でも出す）→ カードのある教科の順。
 */
export function customCategoryGroups({ words = [], cards = [], categories = [] } = {}, { subject = null } = {}) {
  const groupOf = (category) => ({
    category,
    words: words.filter((word) => word.category === category.id),
    cards: cards.filter((card) => card.category === category.id),
  })
  if (subject) {
    const inScope = categoriesForSubject(categories, subject).map(groupOf)
    return [
      ...inScope.filter((group) => group.category.kind === 'subject'),
      ...inScope.filter((group) => group.category.kind === 'custom'),
    ]
  }
  const all = customCategoryChoices(categories).map(groupOf)
  return [
    ...all.filter((group) => group.category.kind === 'custom'),
    ...all.filter((group) => group.category.kind === 'subject' && (group.words.length || group.cards.length)),
  ]
}

/** その教科のアプリに出すカードの数（英単語のカードとほかのカード）。 */
export function customEntryCountForSubject(library, subject) {
  return customCategoryGroups(library, { subject })
    .reduce((sum, group) => sum + group.words.length + group.cards.length, 0)
}

/** 新しく登録するときの最初のテンプレート。分類の既定 → 教科の既定 → 用語と意味。 */
export function defaultTemplateFor(categories, categoryId) {
  const category = findCustomCategory(categories, categoryId)
  if (category?.template) return category.template
  const subject = categorySubject(categories, categoryId)
  return CUSTOM_SUBJECT_BY_ID[subject]?.template ?? 'term'
}

// ── カード（英単語以外のテンプレート） ─────────────────────────────

export const isCustomCardId = (id) => (
  typeof id === 'string' && id.startsWith(CUSTOM_CARD_PREFIX) && id.length > CUSTOM_CARD_PREFIX.length
)

/** 保存形。テンプレートの必須の欄（表と裏）が空のものは登録として成り立たないので落とす。 */
export function normalizeCustomCard(value, { now = Date.now() } = {}) {
  if (!isRecord(value)) return null
  const template = CARD_TEMPLATE_IDS.includes(value.template) ? value.template : 'term'
  const allowed = new Set(templateFor(template).fields.map((item) => item.key))
  const fields = Object.fromEntries(CARD_FIELD_KEYS.map((key) => [
    key,
    allowed.has(key) ? cleanCardField(key, value[key], template) : '',
  ]))
  if (!fields.front || !fields.back) return null
  const id = isCustomCardId(value.id) ? oneLine(value.id, 80) : createCustomCardId({ now })
  const createdAt = timestamp(value.createdAt, now)
  return {
    id,
    template,
    category: isCategoryKey(value.category) ? value.category : DEFAULT_CATEGORY_ID,
    ...fields,
    createdAt,
    updatedAt: timestamp(value.updatedAt, createdAt),
  }
}

export function normalizeCustomCards(value, { now = Date.now() } = {}) {
  const seen = new Set()
  const cards = []
  for (const raw of Array.isArray(value) ? value : []) {
    const card = normalizeCustomCard(raw, { now })
    if (!card || seen.has(card.id)) continue
    seen.add(card.id)
    cards.push(card)
    if (cards.length >= CUSTOM_CARD_LIMITS.cards) break
  }
  return cards
}

/** 追加と書き換えの単一入口。status は saved / invalid（必須の欄が空） / full（上限）。 */
export function upsertCustomCard(list, input, { now = Date.now() } = {}) {
  const cards = normalizeCustomCards(list, { now })
  const index = isCustomCardId(input?.id) ? cards.findIndex((card) => card.id === input.id) : -1
  const normalized = normalizeCustomCard({
    ...input,
    id: index >= 0 ? input.id : createCustomCardId({ now }),
    createdAt: index >= 0 ? cards[index].createdAt : now,
    updatedAt: now,
  }, { now })
  if (!normalized) return { cards, id: null, status: 'invalid' }
  if (index < 0 && cards.length >= CUSTOM_CARD_LIMITS.cards) return { cards, id: null, status: 'full' }
  const next = index >= 0
    ? cards.map((card, at) => (at === index ? normalized : card))
    : [...cards, normalized]
  return { cards: next, id: normalized.id, status: 'saved' }
}

export function removeCustomCard(list, id) {
  return normalizeCustomCards(list).filter((card) => card.id !== id)
}

/**
 * カード・英単語の分類が、今ある分類を指しているかをそろえる。
 * 分類の一覧にない作ったカテゴリーを指すもの（手で書き換えたファイルなど）は、その ID のまま
 * 「名前のないカテゴリー」を作って残す。作れる数を超えたら教科「英語」へ入れる。
 */
export function reconcileCustomCategories({ categories = [], cards = [], words = [] } = {}, { now = Date.now() } = {}) {
  const nextCategories = normalizeCustomCategories(categories, { now })
  const known = new Set(nextCategories.map((category) => category.id))
  const settle = (item) => {
    if (isSubjectCategoryId(item.category) || known.has(item.category)) return item
    if (isCustomCategoryId(item.category) && nextCategories.length < CUSTOM_CARD_LIMITS.categories) {
      nextCategories.push({
        id: item.category,
        title: '名前のないカテゴリー',
        subject: null,
        template: null,
        createdAt: now,
        updatedAt: now,
      })
      known.add(item.category)
      return item
    }
    return { ...item, category: DEFAULT_CATEGORY_ID }
  }
  return {
    categories: nextCategories,
    cards: cards.map(settle),
    words: words.map(settle),
  }
}

// ── 引き当て（マイ学習ノート・暗記・テストが ID から引く） ─────────────────
// 自作単語と同じく、ストアの購読がカードと分類を登録し直す。

const CUSTOM_CARDS_BY_ID = new Map()
let registeredCategories = []

export function registerCustomCards(cards = [], categories = registeredCategories) {
  CUSTOM_CARDS_BY_ID.clear()
  for (const card of normalizeCustomCards(cards)) CUSTOM_CARDS_BY_ID.set(card.id, card)
  registeredCategories = normalizeCustomCategories(categories)
  return CUSTOM_CARDS_BY_ID.size
}

export const getCustomCard = (id) => CUSTOM_CARDS_BY_ID.get(id) ?? null
export const customCardList = () => [...CUSTOM_CARDS_BY_ID.values()]
export const registeredCustomCategories = () => registeredCategories

// ── 表示の文 ──────────────────────────────────────────────

/** カードの見出し（表の欄）。一覧・記録・ノートで使う。 */
export const cardTitle = (card) => card?.front ?? ''
/** カードの答えの欄（裏の欄）。 */
export const cardAnswerText = (card) => card?.back ?? ''

/** カードの欄を、テンプレートの順に「名前と中身」で並べる（空の欄は出さない）。 */
export function cardFieldRows(card) {
  if (!card) return []
  return templateFor(card.template).fields
    .map((item) => ({ key: item.key, label: item.label, value: card[item.key] ?? '' }))
    .filter((row) => row.value)
}

/** 検索に使う文（全部の欄）。 */
export const cardSearchText = (card) => CARD_FIELD_KEYS.map((key) => card?.[key] ?? '').join(' ')

// ── 暗記・テストの組み方（全教材共通の出題順・出題バランス） ────────────────

/** 暗記カードの束。記録（SRS）から全教材共通の出題順に並べ、出題バランスで未学習と復習を混ぜる。 */
export function pickCustomCards(ids, { srs = {}, size = 20, freshShare = null, preserveOrder = false, now = Date.now() } = {}) {
  const selected = [...new Set(ids ?? [])].map(getCustomCard).filter(Boolean)
  const ordered = preserveOrder
    ? selected
    : mixItemsForStudy(orderForStudy(selected, srs, { purpose: 'study', now }), srs, { freshShare, size, now })
  return size > 0 ? ordered.slice(0, size) : ordered
}

function hashSeed(value) {
  let hash = 2166136261
  const text = String(value)
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const seededShuffle = (list, seed) => [...list]
  .map((item, index) => ({ item, key: hashSeed(`${seed}:${index}:${item.id}`) }))
  .sort((a, b) => a.key - b.key)
  .map(({ item }) => item)

const quizOf = (card) => templateFor(card.template).quiz
const answerOf = (card) => card[quizOf(card).answer]
const promptOf = (card) => card[quizOf(card).prompt]

/**
 * 誤答のカード。同じ分類で同じテンプレート → 同じテンプレート → 同じ問い方（用語・意味・答え）→ ほかのカードの順に、
 * 問題ごとに決まった種で選ぶ（同じカードはいつも同じ選択肢）。答えと同じ文のカードは使わない。
 */
export function customCardDistractors(card, pool = customCardList(), count = 3) {
  const answer = answerOf(card)
  const others = pool.filter((other) => other.id !== card.id && answerOf(other) && answerOf(other) !== answer)
  const kind = quizOf(card).kind
  const tiers = [
    others.filter((other) => other.category === card.category && other.template === card.template),
    others.filter((other) => other.template === card.template),
    others.filter((other) => quizOf(other).kind === kind),
    others,
  ]
  const picked = []
  const seen = new Set([answer])
  for (const tier of tiers) {
    for (const other of seededShuffle(tier, card.id)) {
      if (picked.length >= count) break
      const text = answerOf(other)
      if (seen.has(text)) continue
      seen.add(text)
      picked.push(other)
    }
  }
  return picked
}

/** カード1枚から、テストの問題を作る（教材は4択。出題は3択＋わからない）。誤答が作れないカードは null。 */
export function customCardQuestion(card, pool = customCardList()) {
  if (!card || !quizOf(card)) return null
  const distractors = customCardDistractors(card, pool)
  if (!distractors.length) return null
  const options = [card, ...distractors]
  return Object.freeze({
    id: card.id,
    cardId: card.id,
    template: card.template,
    category: card.category,
    ask: quizOf(card).ask,
    text: promptOf(card),
    choices: Object.freeze(options.map(answerOf)),
    answer: answerOf(card),
    // 選択肢の説明は、その選択肢のカードの問いの欄（用語なら意味、意味なら古語・漢語、答えなら問題）。
    // 問い方のちがうテンプレートのカードは、欄の名前を添える（「問題：〜」）。
    notes: Object.freeze(Object.fromEntries(options.map((option) => [
      answerOf(option),
      option.template === card.template
        ? promptOf(option)
        : `${templateFieldLabel(option.template, quizOf(option).prompt)}：${promptOf(option)}`,
    ]))),
  })
}

/** テストに出せるカード（誤答が1つ以上作れるカード）。 */
export function quizzableCustomCardIds(ids, pool = customCardList()) {
  return [...new Set(ids ?? [])].filter((id) => customCardQuestion(getCustomCard(id), pool))
}

/** テストの問題。問題ごとの結果（contentQuizResults）とカードの記録から出題順を決める。 */
export function pickCustomCardQuestions(ids, { srs = {}, quizResults = {}, size = 20, freshShare = null, preserveOrder = false, now = Date.now() } = {}) {
  const pool = customCardList()
  const questions = [...new Set(ids ?? [])]
    .map((id) => customCardQuestion(getCustomCard(id), pool))
    .filter(Boolean)
  if (preserveOrder) return size > 0 ? questions.slice(0, size) : questions
  const ranked = mixRankedForStudy(rankQuestionsForStudy(questions, {
    quizResults,
    quizDomain: CUSTOM_CARD_QUIZ_DOMAIN,
    srs,
    itemIdOf: (question) => question.cardId,
    now,
  }), { freshShare, stockOf: questionMixStockOf })
  return pickInStudyOrder(ranked, size > 0 ? size : ranked.length).slice(0, size > 0 ? size : undefined)
}
