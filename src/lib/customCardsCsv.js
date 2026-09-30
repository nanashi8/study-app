// 自作カードの一覧を、Excel やテキストエディタで作る・直すための表（CSV・タブ区切り）。
//
// 1行が1枚のカード。1行目は列の名前（見出し）で、列の順は自由（見出しの名前で読む）。見出しのない表は「表・裏・解説」の3列として読む。
// 書き出しは Excel で文字化けしない UTF-8（BOM つき）の CSV。読み込みは UTF-8（BOM あり・なし）と Shift_JIS、カンマ区切りとタブ区切り。
// 分類の列は教科の名前（英語・古典・漢文・数学・社会・理科）か自分のカテゴリーの名前。ないカテゴリーの名前は、読み込むときに作る。
// テンプレートの列は名前（用語と意味・用語・意味・解説・一問一答・英単語・古典単語・漢語）。空なら分類の最初のテンプレート。
// ID の列は書き出したカードの ID。消さずに読み込むと同じカードを書き換える（暗記・テストの記録が残る）。新しい行は空のまま。
import {
  CUSTOM_CARD_LIMITS,
  CUSTOM_CARD_TEMPLATES,
  CUSTOM_SUBJECTS,
  ENGLISH_TEMPLATE_ID,
  SUBJECT_CATEGORIES,
  createCustomCategoryId,
  customCategoryChoices,
  defaultTemplateFor,
  isCustomCardId,
  normalizeCustomCard,
  normalizeCustomCategories,
  subjectCategoryId,
  templateFor,
} from './customCards.js'
import {
  CUSTOM_WORD_FIELDS,
  CUSTOM_WORD_LEVELS,
  CUSTOM_WORD_LIMITS,
  CUSTOM_WORD_POS,
  isCustomWordId,
  normalizeCustomWord,
} from './customWords.js'

// 列。name は見出しの名前（かっこの前）、aliases はほかに受け付ける名前。english は英単語のカードだけが使う列。
const column = (key, header, aliases = [], english = false) => Object.freeze({
  key,
  header,
  name: header.replace(/[（(].*$/u, ''),
  aliases: Object.freeze(aliases),
  english,
})

export const CUSTOM_CARD_TABLE_COLUMNS = Object.freeze([
  column('category', '分類（教科・カテゴリー）', ['カテゴリー', '教科']),
  column('template', 'テンプレート'),
  column('front', '表（用語・問題・単語・古語・漢語）', ['用語', '問題', '単語', '古語', '漢語', '漢語・句法', '見出し']),
  column('back', '裏（意味・答え）', ['意味', '答え']),
  column('reading', '読み', ['読み（現代仮名遣い）']),
  column('kanji', '漢字'),
  column('pos', '品詞', ['品詞・活用']),
  column('example', '例文', ['用例', '用例（書き下し文）']),
  column('exampleTranslation', '例文の訳', ['用例の訳', '訳']),
  column('note', '解説・メモ', ['解説', 'メモ', '使い方・メモ']),
  column('level', '級（英単語）', [], true),
  column('field', '分野（英単語）', [], true),
  column('phonetic', '発音記号（英単語）', [], true),
  column('otherSenses', 'ほかの意味（英単語）', [], true),
  column('derivatives', '派生語（英単語）', ['派生語・ほかの品詞の形'], true),
  column('synonyms', '類義語（英単語）', [], true),
  column('antonyms', '反意語（英単語）', [], true),
  column('confusables', 'つづりが似た語（英単語）', ['つづりが似ていて間違えやすい語'], true),
  column('phrases', '熟語・構文（英単語）', ['熟語'], true),
  column('etymology', '語の成り立ち（英単語）', [], true),
  column('id', 'ID（書き換えるときは消さない）'),
])

// 見出しのない表は、この3列として読む（「用語,意味」のような簡単な一覧）。
const HEADERLESS_KEYS = Object.freeze(['front', 'back', 'note'])
// 1つの欄に並べる語の区切り（「；」か「;」）と、語と意味の書き方「語（意味）」、ほかの意味の書き方「品詞：意味」。
const LIST_SEPARATOR = '；'

const POS_BY_TEXT = new Map(CUSTOM_WORD_POS.flatMap((pos) => [[pos.id, pos.id], [pos.label, pos.id]]))
const POS_LABEL = new Map(CUSTOM_WORD_POS.map((pos) => [pos.id, pos.label]))
const LEVEL_LABEL = new Map(CUSTOM_WORD_LEVELS.map((level) => [level.id, level.label]))
const TEMPLATE_BY_TEXT = new Map(CUSTOM_CARD_TEMPLATES.flatMap((template) => [[template.id, template.id], [template.label, template.id]]))

const cleanHeader = (value) => String(value ?? '').normalize('NFKC').replace(/^﻿/u, '').replace(/\s+/gu, '').trim()
const headerBase = (value) => cleanHeader(value).replace(/[（(].*$/u, '')

/** 見出しの欄1つが、どの列か（知らない見出しは null）。 */
function columnForHeader(value) {
  const base = headerBase(value)
  if (!base) return null
  return CUSTOM_CARD_TABLE_COLUMNS.find((item) => (
    item.name === base || item.aliases.some((alias) => headerBase(alias) === base) || cleanHeader(item.header) === cleanHeader(value)
  )) ?? null
}

// ── 表の文字（CSV・タブ区切り） ─────────────────────────────────

/**
 * ファイルの中身（バイト列）を文字にする。UTF-8（BOM あり・なし）で読めなければ Shift_JIS（日本語の Excel が保存する形）で読む。
 */
export function decodeTableBytes(bytes) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(view).replace(/^﻿/u, '')
  } catch {
    return new TextDecoder('shift_jis').decode(view)
  }
}

/** 表の区切り（最初の行にタブがあればタブ、なければカンマ）。 */
export function tableDelimiter(text) {
  const firstLine = String(text ?? '').replace(/^﻿/u, '').split(/\r?\n/u).find((line) => line.trim()) ?? ''
  return firstLine.includes('\t') ? '\t' : ','
}

/**
 * CSV・タブ区切りを行と欄に分ける（"" で囲んだ欄の中の区切り・改行・"" も読む）。
 * 行ごとに、元のファイルでの行の番号（line）を持たせる（知らせに使う）。空の行は落とす。
 */
export function parseDelimitedText(text, delimiter = tableDelimiter(text)) {
  const source = String(text ?? '').replace(/^﻿/u, '')
  const rows = []
  let cells = []
  let cell = ''
  let quoted = false
  let line = 1
  let rowLine = 1
  const endCell = () => {
    cells.push(cell)
    cell = ''
  }
  const endRow = () => {
    endCell()
    if (cells.some((value) => value.trim())) rows.push({ line: rowLine, cells })
    cells = []
  }
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    if (quoted) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          cell += '"'
          index += 1
        } else {
          quoted = false
        }
      } else {
        if (char === '\n') line += 1
        cell += char
      }
      continue
    }
    if (char === '"' && cell.trim() === '') {
      quoted = true
      cell = ''
    } else if (char === delimiter) {
      endCell()
    } else if (char === '\r') {
      // \r\n の \r は読み飛ばす。
    } else if (char === '\n') {
      endRow()
      line += 1
      rowLine = line
    } else {
      cell += char
    }
  }
  if (cell || cells.length) endRow()
  return rows
}

// Excel が数式として読まないよう、= + - @ で始まる欄は ' を前に付けて書き出し、読み込むときに外す。
const FORMULA_START = /^[=+\-@\t\r]/u
const guardCell = (value) => (FORMULA_START.test(value) ? `'${value}` : value)
const unguardCell = (value) => (/^'[=+\-@]/u.test(value) ? value.slice(1) : value)

const csvCell = (value) => {
  const text = guardCell(String(value ?? ''))
  return /[",\r\n]|^\s|\s$/u.test(text) ? `"${text.replace(/"/gu, '""')}"` : text
}

// ── 欄の中身の書き方 ─────────────────────────────────────────

const splitList = (value) => String(value ?? '')
  .split(/[;；]/u)
  .map((item) => item.trim())
  .filter(Boolean)

// 「語（意味）」「語(意味)」「語：意味」のどれでも読む。意味の無い「語」だけでもよい。
function parsePair(text) {
  const withParen = /^(.*?)\s*[（(]([^（）()]*)[）)]\s*$/u.exec(text)
  if (withParen && withParen[1].trim()) return { first: withParen[1].trim(), second: withParen[2].trim() }
  const withColon = /^(.*?)\s*[：:]\s*(.*)$/u.exec(text)
  if (withColon && withColon[1].trim()) return { first: withColon[1].trim(), second: withColon[2].trim() }
  return { first: text.trim(), second: '' }
}

const pairText = (first, second) => (second ? `${first}（${second}）` : first)

/** 級の欄（「準2級」「英検準2級」「2」「pre2」のどれでも）。読めなければ null。 */
export function levelFromText(value) {
  const text = String(value ?? '').normalize('NFKC').replace(/\s+/gu, '').replace(/^英検/u, '').replace(/級$/u, '')
  if (!text) return null
  const found = CUSTOM_WORD_LEVELS.find((level) => (
    level.id === text || level.label.replace(/級$/u, '') === text
  ))
  return found?.id ?? null
}

// ── 書き出し ───────────────────────────────────────────────

function wordRow(word, categories) {
  return {
    category: customCategoryChoices(categories).find((choice) => choice.id === word.category)?.title ?? '',
    template: templateFor(ENGLISH_TEMPLATE_ID).label,
    front: word.word,
    back: word.meanings.join('・'),
    pos: POS_LABEL.get(word.pos) ?? word.pos,
    example: word.example?.en ?? '',
    exampleTranslation: word.example?.ja ?? '',
    note: word.note,
    level: LEVEL_LABEL.get(word.level) ?? '',
    field: word.field,
    phonetic: word.phonetic,
    otherSenses: word.otherSenses.map((sense) => `${POS_LABEL.get(sense.pos) ?? sense.pos}：${sense.meaning}`).join(LIST_SEPARATOR),
    derivatives: word.derivatives.map((pair) => pairText(pair.w, pair.m)).join(LIST_SEPARATOR),
    synonyms: word.synonyms.map((pair) => pairText(pair.w, pair.m)).join(LIST_SEPARATOR),
    antonyms: word.antonyms.map((pair) => pairText(pair.w, pair.m)).join(LIST_SEPARATOR),
    confusables: word.confusables.map((pair) => pairText(pair.w, pair.m)).join(LIST_SEPARATOR),
    phrases: word.phrases.map((phrase) => pairText(phrase.phrase, phrase.meaning)).join(LIST_SEPARATOR),
    etymology: word.etymology,
    id: word.id,
  }
}

function cardRow(card, categories) {
  return {
    category: customCategoryChoices(categories).find((choice) => choice.id === card.category)?.title ?? '',
    template: templateFor(card.template).label,
    front: card.front,
    back: card.back,
    reading: card.reading,
    kanji: card.kanji,
    pos: card.pos,
    example: card.example,
    exampleTranslation: card.exampleTranslation,
    note: card.note,
    id: card.id,
  }
}

const tableText = (rows) => {
  const lines = [CUSTOM_CARD_TABLE_COLUMNS.map((item) => csvCell(item.header)).join(',')]
  for (const row of rows) lines.push(CUSTOM_CARD_TABLE_COLUMNS.map((item) => csvCell(row[item.key] ?? '')).join(','))
  // Excel が UTF-8 と見分けられるよう、先頭に BOM を付ける。行の終わりは CRLF。
  return `﻿${lines.join('\r\n')}\r\n`
}

/** 全カード（英単語のカードとほかのカード）を、分類の並び（教科 → 作ったカテゴリー）・登録した順に1行ずつ書き出す。 */
export function customCardsCsvText({ words = [], cards = [], categories = [] } = {}) {
  const order = new Map(customCategoryChoices(categories).map((choice, index) => [choice.id, index]))
  const entries = [
    ...words.map((word) => ({ at: word.createdAt ?? 0, category: word.category, row: wordRow(word, categories) })),
    ...cards.map((card) => ({ at: card.createdAt ?? 0, category: card.category, row: cardRow(card, categories) })),
  ].sort((a, b) => (order.get(a.category) ?? 999) - (order.get(b.category) ?? 999) || a.at - b.at)
  return tableText(entries.map((entry) => entry.row))
}

/** 一から作るための見本（6つのテンプレートを1行ずつ）。 */
export function customCardsCsvSample() {
  return tableText([
    { category: '社会', template: '用語と意味', front: '三角州', back: '川の河口に、土砂が積もってできた低く平らな土地' },
    { category: '社会', template: '用語・意味・解説', front: '扇状地', back: '川が山地から平地へ出る所に、土砂が積もってできた扇の形の土地', note: '水はけがよく、果樹園に使われる' },
    { category: '2学期中間英語', template: '一問一答', front: 'I have lived here ( ) 2010. の（ ）に入る語は？', back: 'since', note: '起点を表すときは since、期間を表すときは for' },
    {
      category: '2学期中間英語',
      template: '英単語',
      front: 'popular',
      back: '人気のある・大衆の',
      pos: '形容詞',
      example: 'This song is popular with young people.',
      exampleTranslation: 'この歌は若い人たちに人気がある。',
      note: 'be popular with ～ の形でよく使う',
      level: '4級',
      field: '心・コミュニケーション',
      phonetic: '/ˈpɑːpjələr/',
      otherSenses: '名詞：人気者',
      derivatives: 'popularity（人気）',
      synonyms: 'famous（有名な）；well-known（よく知られた）',
      antonyms: 'unpopular（人気のない）',
      confusables: 'populate（住む）',
      phrases: 'be popular with ～（～に人気がある）',
      etymology: 'ラテン語の populus（人々）から。「人々の」→「人気のある」',
    },
    { category: '古典', template: '古典単語', front: 'をかし', reading: 'おかし', pos: '形容詞・シク活用', back: '趣がある・かわいらしい', example: '春はあけぼの。やうやう白くなりゆく山ぎは、少しあかりて', exampleTranslation: '春は明け方がよい。', note: '明るく知的な美しさ' },
    { category: '漢文', template: '漢語', front: '未だ〜ず', reading: 'いまだ〜ず', back: 'まだ〜ない', example: '未だ学を好む者を聞かざるなり', exampleTranslation: 'まだ学問を好む者を聞いたことがない', note: '再読文字' },
  ])
}

export const customCardsCsvFileName = (now = Date.now(), sample = false) => {
  const date = new Date(now)
  const pad = (value) => String(value).padStart(2, '0')
  return sample
    ? 'study-app-custom-cards-sample.csv'
    : `study-app-custom-cards-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}.csv`
}

// ── 読み込み ───────────────────────────────────────────────

const categoryKeyOf = (title) => String(title ?? '').normalize('NFKC').replace(/\s+/gu, ' ').trim()

/**
 * 表（CSV・タブ区切りの文字）を読んで、足す・入れ替えるためのまとまりにする。
 * categories は今あるカテゴリー（同じ名前のカテゴリーへ入れる）、subject は教科から開いたときの教科（分類が空の行の入れ先）。
 * status は ok（読めたカードがある）/ empty（カードになる行がない）。
 * errors は読めなかった行（行の番号と理由）、warnings は読んだが一部の欄を読まなかった行。
 */
export function parseCustomCardsTable(text, { categories = [], subject = null, now = Date.now() } = {}) {
  const rows = parseDelimitedText(text)
  const errors = []
  const warnings = []
  if (!rows.length) return { status: 'empty', library: { words: [], cards: [], categories: [] }, errors, warnings, newCategories: [], rowCount: 0 }

  // 見出しの行：知っている列の名前が2つ以上あれば見出しとして読む。なければ「表・裏・解説」の3列。
  const headerColumns = rows[0].cells.map(columnForHeader)
  const hasHeader = headerColumns.filter(Boolean).length >= 2
  const keys = hasHeader ? headerColumns.map((item) => item?.key ?? null) : HEADERLESS_KEYS
  if (hasHeader) {
    headerColumns.forEach((item, index) => {
      const label = rows[0].cells[index]
      if (!item && String(label ?? '').trim()) warnings.push({ line: rows[0].line, message: `「${label.trim()}」の列は読みません（知らない列の名前です）` })
    })
  }
  const body = hasHeader ? rows.slice(1) : rows

  const existing = normalizeCustomCategories(categories, { now })
  const categoryByTitle = new Map([
    ...SUBJECT_CATEGORIES.map((category) => [categoryKeyOf(category.title), category.id]),
    ...existing.map((category) => [categoryKeyOf(category.title), category.id]),
  ])
  const created = []
  const usedIds = new Set()
  const words = []
  const cards = []
  const defaultCategory = subject ? subjectCategoryId(subject) : SUBJECT_CATEGORIES[0].id

  body.forEach(({ line, cells }, rowIndex) => {
    const values = {}
    keys.forEach((key, index) => {
      if (!key) return
      const cell = unguardCell(String(cells[index] ?? '').trim())
      if (cell) values[key] = cell
    })
    if (!Object.keys(values).length) return

    // 分類：教科の名前か、今あるカテゴリーの名前。ない名前はカテゴリーを作る。
    let category = defaultCategory
    if (values.category) {
      const key = categoryKeyOf(values.category)
      if (categoryByTitle.has(key)) {
        category = categoryByTitle.get(key)
      } else if (existing.length + created.length >= CUSTOM_CARD_LIMITS.categories) {
        errors.push({ line, message: `カテゴリーは${CUSTOM_CARD_LIMITS.categories}個までなので、「${values.category}」を作れません` })
        return
      } else {
        const id = createCustomCategoryId({ now, randomPart: `csv${created.length}${rowIndex}` })
        created.push({ id, title: values.category.slice(0, CUSTOM_CARD_LIMITS.categoryTitle), subject: null, template: null, createdAt: now, updatedAt: now })
        categoryByTitle.set(key, id)
        category = id
      }
    }

    // テンプレート：名前か ID。空なら分類の最初のテンプレート。
    let template = defaultTemplateFor([...existing, ...created], category)
    if (values.template) {
      const found = TEMPLATE_BY_TEXT.get(values.template.normalize('NFKC').replace(/\s+/gu, ''))
      if (!found) {
        errors.push({ line, message: `テンプレート「${values.template}」はありません（${CUSTOM_CARD_TEMPLATES.map((item) => item.label).join('・')}のどれか）` })
        return
      }
      template = found
    }
    if (!values.front || !values.back) {
      errors.push({ line, message: '表（用語・問題・単語など）と裏（意味・答え）の両方を書いてください' })
      return
    }

    // ID：書き出したカードの ID なら同じカードを書き換える（テンプレートの種類がちがう・同じ ID が2回出たら新しいカード）。
    const english = template === ENGLISH_TEMPLATE_ID
    let id
    if (values.id) {
      const fits = english ? isCustomWordId(values.id) : isCustomCardId(values.id)
      if (fits && !usedIds.has(values.id)) {
        id = values.id
        usedIds.add(values.id)
      } else {
        warnings.push({ line, message: 'ID の列が合わないので、新しいカードとして読みます' })
      }
    }

    if (english) {
      const pos = values.pos ? POS_BY_TEXT.get(values.pos.normalize('NFKC').trim()) : undefined
      if (values.pos && !pos) warnings.push({ line, message: `品詞「${values.pos}」は英単語の品詞にないので、名詞にします` })
      const level = values.level ? levelFromText(values.level) : undefined
      if (values.level && !level) warnings.push({ line, message: `級「${values.level}」を読めないので、5級にします` })
      if (values.field && !CUSTOM_WORD_FIELDS.includes(values.field)) warnings.push({ line, message: `分野「${values.field}」はないので、基本・日常にします` })
      const pairs = (key) => splitList(values[key]).map(parsePair).map((pair) => ({ w: pair.first, m: pair.second }))
      const word = normalizeCustomWord({
        id,
        word: values.front,
        meanings: values.back,
        pos,
        level,
        field: values.field,
        phonetic: values.phonetic,
        example: { en: values.example ?? '', ja: values.exampleTranslation ?? '' },
        note: values.note,
        category,
        otherSenses: splitList(values.otherSenses).map(parsePair).map((pair) => (
          pair.second
            ? { pos: POS_BY_TEXT.get(pair.first) ?? pos, meaning: pair.second }
            : { pos, meaning: pair.first }
        )),
        derivatives: pairs('derivatives'),
        synonyms: pairs('synonyms'),
        antonyms: pairs('antonyms'),
        confusables: pairs('confusables'),
        phrases: splitList(values.phrases).map(parsePair).map((pair) => ({ phrase: pair.first, meaning: pair.second })),
        etymology: values.etymology,
        createdAt: now + rowIndex,
        updatedAt: now + rowIndex,
      }, { now })
      if (!id) word.id = `u-${now.toString(36)}csv${rowIndex}`
      words.push(word)
      return
    }

    // 英単語以外：テンプレートにない欄に書いた中身は読まない（知らせる）。
    const allowed = new Set(templateFor(template).fields.map((item) => item.key))
    const dropped = CUSTOM_CARD_TABLE_COLUMNS
      .filter((item) => values[item.key] && !['category', 'template', 'id'].includes(item.key) && !allowed.has(item.key))
      .map((item) => item.name)
    if (dropped.length) warnings.push({ line, message: `「${dropped.join('」「')}」はテンプレート「${templateFor(template).label}」にない欄なので読みません` })
    const card = normalizeCustomCard({
      id,
      template,
      category,
      ...Object.fromEntries([...allowed].map((key) => [key, values[key] ?? ''])),
      createdAt: now + rowIndex,
      updatedAt: now + rowIndex,
    }, { now })
    if (!id) card.id = `c-${now.toString(36)}csv${rowIndex}`
    cards.push(card)
  })

  // 使ったカテゴリー（今あるもの・新しく作るもの）をまとまりに入れる。
  const usedCategories = new Set([...words, ...cards].map((entry) => entry.category))
  const libraryCategories = [
    ...existing.filter((category) => usedCategories.has(category.id)),
    ...created.filter((category) => usedCategories.has(category.id)),
  ]
  const library = {
    words: words.slice(0, CUSTOM_WORD_LIMITS.words),
    cards: cards.slice(0, CUSTOM_CARD_LIMITS.cards),
    categories: libraryCategories,
  }
  return {
    status: words.length || cards.length ? 'ok' : 'empty',
    library,
    errors,
    warnings,
    newCategories: created.filter((category) => usedCategories.has(category.id)).map((category) => category.title),
    rowCount: body.length,
  }
}

/** 教科の名前（分類の列に書ける名前の一覧に使う）。 */
export const CUSTOM_SUBJECT_TITLES = Object.freeze(CUSTOM_SUBJECTS.map((subject) => subject.label))
