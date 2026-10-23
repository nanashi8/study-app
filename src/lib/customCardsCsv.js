// 自作カードの一覧を、Excel やテキストエディタで作る・直すための表（CSV・タブ区切り）。
//
// 1行が1枚のカード。1行目は列の名前（見出し）で、列の順は自由（見出しの名前で読む）。見出しのない表は「表・裏・解説」の3列として読む。
// 書き出しは Excel で文字化けしない UTF-8（BOM つき）の CSV。読み込みは UTF-8（BOM あり・なし）と Shift_JIS、カンマ区切りとタブ区切り。
// 分類の列は教科の名前（英語・古典・漢文・数学・社会・理科）か自分のカテゴリーの名前。ないカテゴリーの名前は、読み込むときに作る。
// テンプレートの列は名前（英単語・古文単語・漢語・その他・一問一答）。空なら分類の最初のテンプレート。
// 以前の名前（用語と意味・用語・意味・解説はその他、古典単語は古文単語）も読む。
// ID の列は書き出したカードの ID。消さずに読み込むと同じカードを書き換える（暗記・テストの記録が残る）。新しい行は空のまま。
// テンプレートを英単語とほかの間で変えて ID を残した行は、元のカードを新しいカードへ置き換える（replaces）。
// カテゴリーの「表示する教科」「最初のテンプレート」は専用の列に書く。カードのないカテゴリーは、分類（とこの2列）だけの行になる。
// 切り捨て（上限・個数・字数）と読まなかった欄は、行の番号と理由を warnings / errors に必ず入れる（黙って落とさない）。
import {
  CUSTOM_CARD_LIMITS,
  CUSTOM_CARD_TEMPLATES,
  CUSTOM_SUBJECT_BY_ID,
  CUSTOM_SUBJECTS,
  ENGLISH_TEMPLATE_ID,
  LEGACY_TEMPLATE_IDS,
  SUBJECT_CATEGORIES,
  createCustomCategoryId,
  customCategoryChoices,
  defaultTemplateFor,
  isCustomCardId,
  isCustomCategoryId,
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
  column('categorySubject', 'カテゴリーの教科（カテゴリーだけ）', ['表示する教科']),
  column('categoryTemplate', 'カテゴリーの最初のテンプレート（カテゴリーだけ）', ['カテゴリーの最初のテンプレ']),
  column('id', 'ID（書き換えるときは消さない）'),
])

// 見出しのない表は、この3列として読む（「用語,意味」のような簡単な一覧）。
const HEADERLESS_KEYS = Object.freeze(['front', 'back', 'note'])

const POS_BY_TEXT = new Map(CUSTOM_WORD_POS.flatMap((pos) => [[pos.id, pos.id], [pos.label, pos.id]]))
const POS_LABEL = new Map(CUSTOM_WORD_POS.map((pos) => [pos.id, pos.label]))
const LEVEL_LABEL = new Map(CUSTOM_WORD_LEVELS.map((level) => [level.id, level.label]))
const templateKey = (value) => String(value ?? '').normalize('NFKC').replace(/\s+/gu, '')
// テンプレートの名前（と id）から今のテンプレート。以前の名前も今のテンプレートへ読む。
const LEGACY_TEMPLATE_NAMES = Object.freeze([
  ['用語と意味', 'other'],
  ['用語・意味・解説', 'other'],
  ['古典単語', 'koten'],
  ...Object.entries(LEGACY_TEMPLATE_IDS),
])
const TEMPLATE_BY_TEXT = new Map([
  ...CUSTOM_CARD_TEMPLATES.flatMap((template) => [[templateKey(template.id), template.id], [templateKey(template.label), template.id]]),
  ...LEGACY_TEMPLATE_NAMES.map(([name, id]) => [templateKey(name), id]),
])

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

// Shift_JIS のうち、JIS X 0208 の字（どの Excel でも同じバイトになる字）。Mac の Excel の「CSV」は、
// 丸数字・ローマ数字・髙などの機種ごとの字や、日本語以外の字（発音記号・é・絵文字など）を「_」などに置きかえて保存する。
let SHIFT_JIS_SAFE = null
function shiftJisSafe() {
  if (SHIFT_JIS_SAFE) return SHIFT_JIS_SAFE
  const safe = new Set()
  for (let code = 0x20; code < 0x7f; code += 1) safe.add(String.fromCharCode(code))
  const decoder = new TextDecoder('shift_jis')
  for (let byte = 0xa1; byte <= 0xdf; byte += 1) safe.add(decoder.decode(new Uint8Array([byte])))
  const leads = [[0x81, 0x84], [0x88, 0x9f], [0xe0, 0xea]]
  for (const [from, to] of leads) {
    for (let lead = from; lead <= to; lead += 1) {
      for (let trail = 0x40; trail <= 0xfc; trail += 1) {
        if (trail === 0x7f) continue
        const ch = decoder.decode(new Uint8Array([lead, trail]))
        if (ch.length === 1 && ch !== '�') safe.add(ch)
      }
    }
  }
  // Mac と Windows でバイトが入れかわる字は、確かではない字として扱う。
  for (const ch of ['\\', '~', '¥', '‾', '〜', '～', '—', '―', '‖', '∥', '－', '−', '¢', '￠', '£', '￡', '¬', '￢']) safe.delete(ch)
  SHIFT_JIS_SAFE = safe
  return safe
}

// Shift_JIS を1字ずつ読む。2バイトの字は2バイトで1字にし、読めない組は「�」1字にする
// （ブラウザの読み方だと、読めない組が「�」と英数字の2字に分かれ、元のカードと字数が合わなくなる）。
// mac は Mac の Excel の「CSV」（Mac の日本語）：1バイトの 0x80 が「\」、0x5C が「¥」になる。
const isLeadByte = (byte) => (byte >= 0x81 && byte <= 0x9f) || (byte >= 0xe0 && byte <= 0xfc)
const MAC_SINGLE_BYTES = Object.freeze({ 0x80: '\\', 0x5c: '¥', 0xa0: ' ', 0xfd: '©', 0xfe: '™', 0xff: '…' })
function decodeShiftJis(view, { mac = false } = {}) {
  const decoder = new TextDecoder('shift_jis')
  const pairs = new Map()
  const parts = []
  for (let index = 0; index < view.length; index += 1) {
    const byte = view[index]
    if (isLeadByte(byte) && index + 1 < view.length) {
      const key = byte * 256 + view[index + 1]
      let ch = pairs.get(key)
      if (ch === undefined) {
        ch = decoder.decode(view.subarray(index, index + 2))
        if (ch.length !== 1) ch = '�'
        pairs.set(key, ch)
      }
      parts.push(ch)
      index += 1
    } else if (mac && MAC_SINGLE_BYTES[byte]) {
      parts.push(MAC_SINGLE_BYTES[byte])
    } else if (byte < 0x80) {
      parts.push(String.fromCharCode(byte))
    } else if (byte >= 0xa1 && byte <= 0xdf) {
      parts.push(String.fromCharCode(0xff61 + byte - 0xa1))
    } else {
      parts.push('�')
    }
  }
  return parts.join('')
}

/**
 * ファイルの中身（バイト列）を文字にし、どの文字の形だったかも返す。
 * UTF-8（BOM あり・なし）、UTF-16（BOM あり・なし。Excel の「Unicode テキスト」）、
 * どれでもなければ Shift_JIS（Windows の Excel の「CSV」）か、Mac の日本語（Mac の Excel の「CSV」。0x80 の「\」があるとき）。
 * encoding は utf-8 / utf-16le / utf-16be / shift_jis / mac-japanese。
 */
export function decodeTableFile(bytes) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  if (view.length >= 2 && view[0] === 0xff && view[1] === 0xfe) return { text: new TextDecoder('utf-16le').decode(view.subarray(2)), encoding: 'utf-16le' }
  if (view.length >= 2 && view[0] === 0xfe && view[1] === 0xff) return { text: new TextDecoder('utf-16be').decode(view.subarray(2)), encoding: 'utf-16be' }
  // BOM のない UTF-16：英数字の相手側のバイトが 0 になる。
  const sample = view.subarray(0, Math.min(view.length, 400))
  if (sample.length >= 4) {
    let even = 0
    let odd = 0
    for (let index = 0; index < sample.length; index += 1) {
      if (sample[index] === 0) {
        if (index % 2 === 0) even += 1
        else odd += 1
      }
    }
    const pairs = Math.floor(sample.length / 2)
    if (odd > pairs * 0.3 && even === 0) return { text: new TextDecoder('utf-16le').decode(view), encoding: 'utf-16le' }
    if (even > pairs * 0.3 && odd === 0) return { text: new TextDecoder('utf-16be').decode(view), encoding: 'utf-16be' }
  }
  try {
    return { text: new TextDecoder('utf-8', { fatal: true }).decode(view).replace(/^﻿/u, ''), encoding: 'utf-8' }
  } catch {
    // 0x80 は Shift_JIS では使わない（1バイトの字にも、2バイトの字の1バイト目にもならない）。あれば Mac の日本語。
    let mac = false
    for (let index = 0; index < view.length; index += 1) {
      const byte = view[index]
      if ((byte >= 0x81 && byte <= 0x9f) || (byte >= 0xe0 && byte <= 0xfc)) index += 1
      else if (byte === 0x80) {
        mac = true
        break
      }
    }
    return mac
      ? { text: decodeShiftJis(view, { mac: true }), encoding: 'mac-japanese' }
      : { text: decodeShiftJis(view), encoding: 'shift_jis' }
  }
}

/** ファイルの中身を文字にする（文字の形は decodeTableFile）。 */
export const decodeTableBytes = (bytes) => decodeTableFile(bytes).text

/**
 * 表の区切り。最初の行にタブがあればタブ。なければカンマとセミコロンのうち、見出しの名前をより多く読めるほう
 * （同じなら、その文字が多いほう。どちらもなければカンマ）。
 */
export function tableDelimiter(text) {
  const firstLine = String(text ?? '').replace(/^\uFEFF/u, '').split(/\r?\n/u).find((line) => line.trim()) ?? ''
  if (firstLine.includes('\t')) return '\t'
  const known = (delimiter) => firstLine.split(delimiter).filter((cell) => columnForHeader(cell.replace(/^"|"$/gu, ''))).length
  const countOf = (delimiter) => firstLine.split(delimiter).length - 1
  const commaKnown = known(',')
  const semicolonKnown = known(';')
  if (semicolonKnown > commaKnown) return ';'
  if (semicolonKnown === commaKnown && countOf(';') > countOf(',')) return ';'
  return ','
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
// もともと「'」のあとに = + - @ ' が続く文字で始まる欄も、「'」を1つ足して書き出す（読み込むと1つ外れて元に戻る）。
const FORMULA_START = /^(?:[=+\-@\t\r]|'['=+\-@\t\r])/u
const guardCell = (value) => (FORMULA_START.test(value) ? `'${value}` : value)
const unguardCell = (value) => (/^'['=+\-@\t\r]/u.test(value) ? value.slice(1) : value)

// Excel は CSV を開いた時点で、数・日付・時刻・通貨・真偽に見える欄を書きかえる（本物の Excel で確かめた：
// 1-2→1月2日、007→7、1E5→1.00E+05、12345678901234567890→1.23457E+19、$100→¥100、(100)→-100、false→FALSE、1.50→1.5）。
// そう見える欄と = + - @ で始まる欄は ="…" の形で書き出す。Excel はそのままの文字を見せ、保存するとそのままの文字に戻る。
// Excel の式の文字は255字までなので、それより長い欄・改行のある欄・「'」で始まる欄は、これまでどおり「'」を付ける。
const MONTH = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?'
const MONTH_DATE = new RegExp(`^(?:${MONTH}[\\s\\-/,]*\\d{1,4}(?:[\\s\\-/,]+\\d{1,4})?|\\d{1,4}[\\s\\-/]*${MONTH}(?:[\\s\\-/,]*\\d{1,4})?)$`, 'iu')
export function excelWouldConvert(value) {
  const text = String(value ?? '').trim()
  if (!text) return false
  if (/^(?:true|false)$/iu.test(text)) return true
  if (/\d/u.test(text) && /^[\s\d\-+.,:/()$¥€£%eE]+$/u.test(text)) return true
  if (/^(?:\d{1,4}\s*[年/.-]\s*)?\d{1,2}\s*月\s*\d{1,2}\s*日?$/u.test(text)) return true
  if (/^\d{1,4}\s*年\s*\d{1,2}\s*月$/u.test(text)) return true
  if (/^\d{1,2}(?::\d{2}){0,2}\s*(?:am|pm|a|p)$/iu.test(text)) return true
  return MONTH_DATE.test(text)
}
const EXCEL_TEXT_FORMULA_LIMIT = 250
const asExcelText = (value) => `="${value.replace(/"/gu, '""')}"`

const csvCell = (value) => {
  const raw = String(value ?? '')
  const formulaLike = /^[=+\-@]/u.test(raw)
  const text = (formulaLike || excelWouldConvert(raw)) && raw.length <= EXCEL_TEXT_FORMULA_LIMIT && !/[\r\n\t]/u.test(raw)
    ? asExcelText(raw)
    : guardCell(raw)
  return /[",;\r\n\t]|^\s|\s$/u.test(text) ? `"${text.replace(/"/gu, '""')}"` : text
}
// ="…" の形（書き出したまま Excel 以外で直した表）は、中の文字にする。
const unwrapExcelText = (value) => {
  const match = /^="((?:[^"]|"")*)"$/u.exec(value)
  return match ? match[1].replace(/""/gu, '"') : value
}

// ── 欄の中身の書き方 ─────────────────────────────────────────
// 1つの欄に並べる語は「；」か「;」で区切る。括弧（）( ) の中の区切りは区切りにしない。
// 語と意味は「語（意味）」「語(意味)」「語：意味」のどれでも読む。意味の中に入れ子の括弧があってもよい。
// 区切り・括弧・コロンを文字として使いたいときは、前に「\」を付ける（書き出しは、そのままでは読み戻せないときだけ付ける）。

const LIST_SEPARATOR = '；'
const ESCAPABLE = new Set(['\\', '；', ';', '（', '(', '）', ')', '：', ':', '・', '、', ','])
const OPENERS = new Set(['（', '('])
const CLOSERS = new Set(['）', ')'])
const COLONS = new Set(['：', ':'])
const LIST_SEPARATORS = new Set(['；', ';'])
const MEANING_SEPARATORS = new Set(['・', '、', ','])

/** 文字の並び。「\」のあとの区切り・括弧・コロンは esc（文字そのもの）にする。 */
function tokensOf(value) {
  const chars = Array.from(String(value ?? ''))
  const tokens = []
  for (let index = 0; index < chars.length; index += 1) {
    if (chars[index] === '\\' && index + 1 < chars.length && ESCAPABLE.has(chars[index + 1])) {
      tokens.push({ ch: chars[index + 1], esc: true })
      index += 1
    } else {
      tokens.push({ ch: chars[index], esc: false })
    }
  }
  return tokens
}
const plainOf = (tokens) => tokens.map((token) => token.ch).join('')
const isSpace = (token) => !token.esc && /\s/u.test(token.ch)
function trimTokens(tokens) {
  let from = 0
  let to = tokens.length
  while (from < to && isSpace(tokens[from])) from += 1
  while (to > from && isSpace(tokens[to - 1])) to -= 1
  return tokens.slice(from, to)
}
const escapeText = (value) => Array.from(String(value ?? '')).map((ch) => (ESCAPABLE.has(ch) ? `\\${ch}` : ch)).join('')

/** 括弧の外（深さ 0）にある区切りで分ける。 */
function splitTokens(tokens, separators) {
  const items = []
  let current = []
  let depth = 0
  for (const token of tokens) {
    if (!token.esc && OPENERS.has(token.ch)) depth += 1
    else if (!token.esc && CLOSERS.has(token.ch)) depth = Math.max(0, depth - 1)
    if (!token.esc && depth === 0 && separators.has(token.ch)) {
      items.push(current)
      current = []
    } else {
      current.push(token)
    }
  }
  items.push(current)
  return items.map(trimTokens).filter((item) => item.length)
}

const splitList = (value) => splitTokens(tokensOf(value), LIST_SEPARATORS)

/** 「語（意味）」「語：意味」「語」。最後の括弧のまとまり（入れ子も1つ）を意味にする。 */
function parsePairTokens(source) {
  const tokens = trimTokens(source)
  const last = tokens.length - 1
  if (last > 0 && !tokens[last].esc && CLOSERS.has(tokens[last].ch)) {
    let depth = 0
    for (let index = last; index >= 0; index -= 1) {
      const token = tokens[index]
      if (token.esc) continue
      if (CLOSERS.has(token.ch)) depth += 1
      else if (OPENERS.has(token.ch)) {
        depth -= 1
        if (depth === 0) {
          const first = plainOf(trimTokens(tokens.slice(0, index)))
          if (first) return { first, second: plainOf(trimTokens(tokens.slice(index + 1, last))) }
          break
        }
      }
    }
  }
  let depth = 0
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]
    if (token.esc) continue
    if (OPENERS.has(token.ch)) depth += 1
    else if (CLOSERS.has(token.ch)) depth = Math.max(0, depth - 1)
    else if (depth === 0 && COLONS.has(token.ch)) {
      const first = plainOf(trimTokens(tokens.slice(0, index)))
      if (first) return { first, second: plainOf(trimTokens(tokens.slice(index + 1))) }
      break
    }
  }
  return { first: plainOf(tokens), second: '' }
}

/** 「品詞：意味」。品詞の名前で始まらなければ、全部を意味にする（品詞は語の品詞と同じ）。 */
function parseSenseTokens(source) {
  const tokens = trimTokens(source)
  let depth = 0
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]
    if (token.esc) continue
    if (OPENERS.has(token.ch)) depth += 1
    else if (CLOSERS.has(token.ch)) depth = Math.max(0, depth - 1)
    else if (depth === 0 && COLONS.has(token.ch)) {
      const left = plainOf(trimTokens(tokens.slice(0, index))).normalize('NFKC')
      if (POS_BY_TEXT.has(left)) return { pos: POS_BY_TEXT.get(left), meaning: plainOf(trimTokens(tokens.slice(index + 1))) }
      break
    }
  }
  return { pos: undefined, meaning: plainOf(tokens) }
}

/** 意味の欄（「・」「、」「,」で区切る）。 */
const parseMeanings = (value) => splitTokens(tokensOf(value), MEANING_SEPARATORS).map(plainOf).filter(Boolean)

// 書き出し：そのまま読み戻せればそのまま、だめなら「語（）」、それもだめなら区切りに「\」を付ける。
const sameAs = (list, expected) => list.length === expected.length && list.every((item, index) => item === expected[index])
function encodePair(first, second) {
  const reads = (text) => {
    const items = splitList(text)
    if (items.length !== 1) return false
    const pair = parsePairTokens(items[0])
    return pair.first === first && pair.second === second
  }
  const plain = second ? `${first}（${second}）` : first
  if (reads(plain)) return plain
  const empty = `${first}（${second}）`
  if (reads(empty)) return empty
  return `${escapeText(first)}（${escapeText(second)}）`
}

function encodeSense(posLabel, meaning, pos) {
  const reads = (text) => {
    const items = splitList(text)
    if (items.length !== 1) return false
    const sense = parseSenseTokens(items[0])
    return sense.pos === pos && sense.meaning === meaning
  }
  const plain = `${posLabel}：${meaning}`
  return reads(plain) ? plain : `${posLabel}：${escapeText(meaning)}`
}

function encodeMeanings(meanings) {
  const plain = meanings.join('・')
  if (sameAs(parseMeanings(plain), meanings)) return plain
  return meanings.map(escapeText).join('・')
}

const encodeList = (items) => items.join(LIST_SEPARATOR)

/** 「ー」や「-」だけの欄は、決めていない印として読む。 */
const isUnsetText = (value) => /^[ー\-―‐]*$/u.test(String(value ?? '').normalize('NFKC').trim())

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

// カテゴリーの設定の列（作ったカテゴリーだけ。教科の分類は空）。
function categorySettings(categories, id) {
  const category = normalizeCustomCategories(categories).find((item) => item.id === id)
  if (!category) return {}
  return {
    categorySubject: category.subject ? CUSTOM_SUBJECT_BY_ID[category.subject].label : '',
    categoryTemplate: category.template ? templateFor(category.template).label : '',
  }
}

function wordRow(word, categories) {
  const sense = (item) => encodeSense(POS_LABEL.get(item.pos) ?? item.pos, item.meaning, item.pos)
  return {
    category: customCategoryChoices(categories).find((choice) => choice.id === word.category)?.title ?? '',
    ...categorySettings(categories, word.category),
    template: templateFor(ENGLISH_TEMPLATE_ID).label,
    front: word.word,
    back: encodeMeanings(word.meanings),
    pos: POS_LABEL.get(word.pos) ?? word.pos,
    example: word.example?.en ?? '',
    exampleTranslation: word.example?.ja ?? '',
    note: word.note,
    level: LEVEL_LABEL.get(word.level) ?? '',
    field: word.field,
    phonetic: word.phonetic,
    otherSenses: encodeList(word.otherSenses.map(sense)),
    derivatives: encodeList(word.derivatives.map((pair) => encodePair(pair.w, pair.m))),
    synonyms: encodeList(word.synonyms.map((pair) => encodePair(pair.w, pair.m))),
    antonyms: encodeList(word.antonyms.map((pair) => encodePair(pair.w, pair.m))),
    confusables: encodeList(word.confusables.map((pair) => encodePair(pair.w, pair.m))),
    phrases: encodeList(word.phrases.map((phrase) => encodePair(phrase.phrase, phrase.meaning))),
    etymology: word.etymology,
    id: word.id,
  }
}

function cardRow(card, categories) {
  return {
    category: customCategoryChoices(categories).find((choice) => choice.id === card.category)?.title ?? '',
    ...categorySettings(categories, card.category),
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

/**
 * 全カード（英単語のカードとほかのカード）を、分類の並び（教科 → 作ったカテゴリー）・登録した順に1行ずつ書き出す。
 * カードが1枚もない作ったカテゴリーは、分類（と教科・最初のテンプレート）だけの行にして、消えないようにする。
 */
export function customCardsCsvText({ words = [], cards = [], categories = [] } = {}) {
  const order = new Map(customCategoryChoices(categories).map((choice, index) => [choice.id, index]))
  const used = new Set([...words, ...cards].map((entry) => entry.category))
  const entries = [
    ...words.map((word) => ({ at: word.createdAt ?? 0, category: word.category, row: wordRow(word, categories) })),
    ...cards.map((card) => ({ at: card.createdAt ?? 0, category: card.category, row: cardRow(card, categories) })),
    ...normalizeCustomCategories(categories)
      .filter((category) => !used.has(category.id))
      .map((category) => ({
        at: -1,
        category: category.id,
        row: { category: category.title, ...categorySettings(categories, category.id) },
      })),
  ].sort((a, b) => (order.get(a.category) ?? 999) - (order.get(b.category) ?? 999) || a.at - b.at)
  return tableText(entries.map((entry) => entry.row))
}

/** 一から作るための見本（5つのテンプレートを1行以上ずつ。その他は解説のある行とない行）。 */
export function customCardsCsvSample() {
  return tableText([
    { category: '社会', template: 'その他', front: '三角州', back: '川の河口に、土砂が積もってできた低く平らな土地' },
    { category: '社会', template: 'その他', front: '扇状地', back: '川が山地から平地へ出る所に、土砂が積もってできた扇の形の土地', note: '水はけがよく、果樹園に使われる' },
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
    { category: '古典', template: '古文単語', front: 'をかし', reading: 'おかし', pos: '形容詞・シク活用', back: '趣がある・かわいらしい', example: '春はあけぼの。やうやう白くなりゆく山ぎは、少しあかりて', exampleTranslation: '春は明け方がよい。', note: '明るく知的な美しさ' },
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

// 保存の形にそろえたあとの字数（上限で切る前）。上限を超えて読まない中身を知らせるのに使う。
const oneLineLength = (value) => String(value ?? '').normalize('NFC').trim().replace(/\s+/gu, ' ').length
const multiLineLength = (value) => String(value ?? '').normalize('NFC')
  .split(/\r?\n/u)
  .map((line) => line.trim().replace(/[ \t　]+/gu, ' '))
  .join('\n')
  .replace(/\n{3,}/gu, '\n\n')
  .trim().length
const SUBJECT_BY_TEXT = new Map(CUSTOM_SUBJECTS.flatMap((item) => [[item.id, item.id], [categoryKeyOf(item.label), item.id]]))

// Shift_JIS で保存したときに変わった欄が、元の欄と同じか（変わったのは、Shift_JIS にない字が「_」「?」などになった所だけか）。
const REPLACED_MARKS = new Set(['_', '?', '�'])
const SAME_IN_SHIFT_JIS = [['\\', '¥'], ['~', '‾'], ['〜', '～'], ['—', '―'], ['‖', '∥'], ['－', '−'], ['¢', '￠'], ['£', '￡'], ['¬', '￢']]
function savedFromOriginal(original, saved) {
  if (original === saved || original.length !== saved.length) return false
  const safe = shiftJisSafe()
  for (let index = 0; index < original.length; index += 1) {
    const before = original[index]
    const after = saved[index]
    if (before === after) continue
    if (SAME_IN_SHIFT_JIS.some((pair) => pair.includes(before) && pair.includes(after))) continue
    if (!safe.has(before) && REPLACED_MARKS.has(after)) continue
    return false
  }
  return true
}
const LEGACY_ENCODINGS = new Set(['shift_jis', 'mac-japanese'])

/**
 * 表（CSV・タブ区切りの文字）を読んで、足す・入れ替えるためのまとまりにする。
 * categories は今あるカテゴリー（同じ名前のカテゴリーへ入れる）、subject は教科から開いたときの教科（分類が空の行の入れ先）。
 * status は ok（読めたカードがある）/ empty（カードになる行がない）。
 * errors は読めなかった行（行の番号と理由。上限を超えた行も）、warnings は読んだが一部を読まなかった行（切り捨てた中身も）。
 * replaces は、テンプレートを英単語とほかの間で変えた行の { from（元の ID）, to（新しい ID）}。
 * encoding は decodeTableFile の文字の形。Shift_JIS（Excel の「CSV」）なら notices で知らせ、library（いまのカード）と
 * 同じ ID の行は、保存で「_」などに変わった字を元のカードの字に戻す。
 */
export function parseCustomCardsTable(text, { categories = [], subject = null, now = Date.now(), encoding = 'utf-8', library: current = null } = {}) {
  const rows = parseDelimitedText(text)
  const errors = []
  const warnings = []
  const notices = []
  const legacy = LEGACY_ENCODINGS.has(encoding)
  if (legacy) {
    notices.push('Excel の「CSV」か「タブ区切りテキスト」（Shift_JIS）で保存されたファイルです。この形では、発音記号・é・①などの記号・絵文字・一部の漢字が「_」などに変わります。'
      + 'もとのカードと同じ ID の行は、変わった字を元のカードの字に戻して読みます。新しく書いた行は確かめてください。次からは「CSV UTF-8（コンマ区切り）」で保存してください。')
  }
  const currentById = new Map([
    ...(current?.words ?? []).map((entry) => [entry.id, { kind: 'word', entry }]),
    ...(current?.cards ?? []).map((entry) => [entry.id, { kind: 'card', entry }]),
  ])
  const empty = { status: 'empty', library: { words: [], cards: [], categories: [] }, errors, warnings, notices, newCategories: [], rowCount: 0, replaces: [] }
  if (!rows.length) return empty

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
  const defined = new Set()
  const updates = new Map()
  const usedIds = new Set()
  const words = []
  const cards = []
  const replaces = []
  const defaultCategory = subject ? subjectCategoryId(subject) : SUBJECT_CATEGORIES[0].id

  // 上限で切る中身を知らせる（行の番号と、どの欄の何字目・何個目からか）。
  const cutText = (line, label, length, limit, unit = '字') => {
    if (length > limit) warnings.push({ line, message: `「${label}」は${limit}${unit}までなので、${limit + 1}${unit}目からは読みません（${length}${unit}ありました）` })
  }
  const cutList = (line, label, count, limit) => {
    if (count > limit) warnings.push({ line, message: `「${label}」は${limit}個までなので、${limit + 1}個目からは読みません（${count}個ありました）` })
  }
  const cutItems = (line, label, items, limit) => {
    items.forEach((item) => cutText(line, `${label}の「${item.slice(0, 12)}」`, oneLineLength(item), limit))
  }

  body.forEach(({ line, cells }, rowIndex) => {
    const values = {}
    keys.forEach((key, index) => {
      if (!key) return
      const cell = unguardCell(unwrapExcelText(String(cells[index] ?? '').trim()))
      if (cell) values[key] = cell
    })
    if (!Object.keys(values).length) return

    // Shift_JIS で保存したファイル：同じ ID のカードがあれば、保存で変わった字を元のカードの字に戻す。
    if (legacy && values.id && currentById.has(values.id)) {
      const { kind, entry } = currentById.get(values.id)
      const before = kind === 'word' ? wordRow(entry, categories) : cardRow(entry, categories)
      const restored = []
      for (const [key, value] of Object.entries(values)) {
        const original = String(before[key] ?? '')
        if (key !== 'id' && savedFromOriginal(original, value)) {
          values[key] = original
          restored.push(CUSTOM_CARD_TABLE_COLUMNS.find((item) => item.key === key)?.name ?? key)
        }
      }
      if (restored.length) warnings.push({ line, message: `「${restored.join('」「')}」は、Excel の保存で「_」などに変わった字を、元のカードの字に戻しました` })
    }

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
        if (values.category.length > CUSTOM_CARD_LIMITS.categoryTitle) {
          cutText(line, 'カテゴリーの名前', values.category.length, CUSTOM_CARD_LIMITS.categoryTitle)
        }
        categoryByTitle.set(key, id)
        category = id
      }
    }

    // カテゴリーの設定（作ったカテゴリーだけ）：表示する教科と最初のテンプレート。同じカテゴリーでは最初に書いた値を使う。
    if (isCustomCategoryId(category) && (values.categorySubject || values.categoryTemplate)) {
      const setting = updates.get(category) ?? { subject: undefined, template: undefined }
      if (values.categorySubject) {
        const found = SUBJECT_BY_TEXT.get(categoryKeyOf(values.categorySubject))
        if (!found) warnings.push({ line, message: `カテゴリーの教科「${values.categorySubject}」はありません（${CUSTOM_SUBJECT_TITLES.join('・')}のどれか）` })
        else if (setting.subject === undefined) setting.subject = found
      }
      if (values.categoryTemplate) {
        const found = TEMPLATE_BY_TEXT.get(templateKey(values.categoryTemplate))
        if (!found) warnings.push({ line, message: `カテゴリーの最初のテンプレート「${values.categoryTemplate}」はありません` })
        else if (setting.template === undefined) setting.template = found
      }
      updates.set(category, setting)
    }

    // カードのない行（分類と、カテゴリーの設定だけ）は、カテゴリーの定義として読む。
    const cardKeys = Object.keys(values).filter((key) => !['category', 'categorySubject', 'categoryTemplate'].includes(key))
    if (values.category && !cardKeys.length) {
      if (isCustomCategoryId(category)) defined.add(category)
      else warnings.push({ line, message: `「${values.category}」は教科の名前だけの行なので読みません` })
      return
    }

    // テンプレート：名前か ID。空なら分類の最初のテンプレート（この行で決めたカテゴリーの設定も使う）。
    const withSettings = [...existing, ...created].map((item) => {
      const setting = updates.get(item.id)
      return setting?.template ? { ...item, template: setting.template } : item
    })
    let template = defaultTemplateFor(withSettings, category)
    if (values.template) {
      const found = TEMPLATE_BY_TEXT.get(templateKey(values.template))
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

    // ID：書き出したカードの ID なら同じカードを書き換える。同じ ID が2回出たら新しいカード。
    // テンプレートを英単語とほかの間で変えたときは、元のカードを新しいカードへ置き換える。
    const english = template === ENGLISH_TEMPLATE_ID
    let id
    let replacedId = null
    if (values.id) {
      const fits = english ? isCustomWordId(values.id) : isCustomCardId(values.id)
      const otherKind = english ? isCustomCardId(values.id) : isCustomWordId(values.id)
      if (fits && !usedIds.has(values.id)) {
        id = values.id
        usedIds.add(values.id)
      } else if (otherKind && !usedIds.has(values.id)) {
        replacedId = values.id
        usedIds.add(values.id)
        warnings.push({ line, message: 'テンプレートが英単語とほかの間で変わったので、元のカードを新しいカードに置き換えます（単語帳・メモは付け替えます。暗記の記録は新しいカードから数えます）' })
      } else {
        warnings.push({ line, message: 'ID の列が合わないので、新しいカードとして読みます' })
      }
    }

    if (english) {
      if (words.length >= CUSTOM_WORD_LIMITS.words) {
        errors.push({ line, message: `英単語のカードは${CUSTOM_WORD_LIMITS.words}語までなので、この行は読みません` })
        return
      }
      // 「ー」（または空）は、品詞・級・分野を決めない印。
      const posText = isUnsetText(values.pos) ? '' : values.pos
      const levelText = isUnsetText(values.level) ? '' : values.level
      const fieldText = isUnsetText(values.field) ? '' : values.field
      const pos = posText ? POS_BY_TEXT.get(posText.normalize('NFKC').trim()) : undefined
      if (posText && !pos) warnings.push({ line, message: `品詞「${values.pos}」は英単語の品詞にないので、ーにします` })
      const level = levelText ? levelFromText(levelText) : undefined
      if (levelText && !level) warnings.push({ line, message: `級「${values.level}」を読めないので、ーにします` })
      if (fieldText && !CUSTOM_WORD_FIELDS.includes(fieldText)) warnings.push({ line, message: `分野「${values.field}」はないので、ーにします` })

      const meanings = parseMeanings(values.back)
      const pairLists = Object.fromEntries(['derivatives', 'synonyms', 'antonyms', 'confusables'].map((key) => [
        key,
        splitList(values[key]).map(parsePairTokens).map((pair) => ({ w: pair.first, m: pair.second })),
      ]))
      const phraseList = splitList(values.phrases).map(parsePairTokens).map((pair) => ({ phrase: pair.first, meaning: pair.second }))
      const senseList = splitList(values.otherSenses).map(parseSenseTokens).map((sense) => ({ pos: sense.pos ?? pos, meaning: sense.meaning }))

      // 上限を超える中身を知らせる。
      cutText(line, '単語', oneLineLength(values.front), CUSTOM_WORD_LIMITS.word)
      cutList(line, '意味', new Set(meanings).size, CUSTOM_WORD_LIMITS.meanings)
      cutItems(line, '意味', meanings, CUSTOM_WORD_LIMITS.meaning)
      cutText(line, '発音記号', oneLineLength(values.phonetic), CUSTOM_WORD_LIMITS.phonetic)
      cutText(line, '例文', oneLineLength(values.example), CUSTOM_WORD_LIMITS.example)
      cutText(line, '例文の訳', oneLineLength(values.exampleTranslation), CUSTOM_WORD_LIMITS.example)
      cutText(line, '解説・メモ', oneLineLength(values.note), CUSTOM_WORD_LIMITS.note)
      cutText(line, '語の成り立ち', oneLineLength(values.etymology), CUSTOM_WORD_LIMITS.etymology)
      cutList(line, 'ほかの意味', senseList.length, CUSTOM_WORD_LIMITS.otherSenses)
      cutItems(line, 'ほかの意味', senseList.map((sense) => sense.meaning), CUSTOM_WORD_LIMITS.meaning)
      for (const [key, label] of [['derivatives', '派生語'], ['synonyms', '類義語'], ['antonyms', '反意語'], ['confusables', 'つづりが似た語']]) {
        cutList(line, label, pairLists[key].length, CUSTOM_WORD_LIMITS.relatedWords)
        cutItems(line, `${label}の語`, pairLists[key].map((pair) => pair.w), CUSTOM_WORD_LIMITS.relatedWord)
        cutItems(line, `${label}の意味`, pairLists[key].map((pair) => pair.m), CUSTOM_WORD_LIMITS.relatedMeaning)
      }
      cutList(line, '熟語・構文', phraseList.length, CUSTOM_WORD_LIMITS.phrases)
      cutItems(line, '熟語・構文', phraseList.map((phrase) => phrase.phrase), CUSTOM_WORD_LIMITS.phrase)
      cutItems(line, '熟語・構文の意味', phraseList.map((phrase) => phrase.meaning), CUSTOM_WORD_LIMITS.phraseMeaning)

      const word = normalizeCustomWord({
        id,
        word: values.front,
        meanings,
        pos,
        level,
        field: fieldText,
        phonetic: values.phonetic,
        example: { en: values.example ?? '', ja: values.exampleTranslation ?? '' },
        note: values.note,
        category,
        otherSenses: senseList,
        ...pairLists,
        phrases: phraseList,
        etymology: values.etymology,
        createdAt: now + rowIndex,
        updatedAt: now + rowIndex,
      }, { now })
      if (!word) {
        errors.push({ line, message: '単語と意味を読めませんでした' })
        return
      }
      // 同じ語・語のない項目を省いたとき。
      const kept = { derivatives: word.derivatives.length, synonyms: word.synonyms.length, antonyms: word.antonyms.length, confusables: word.confusables.length }
      for (const [key, label] of [['derivatives', '派生語'], ['synonyms', '類義語'], ['antonyms', '反意語'], ['confusables', 'つづりが似た語']]) {
        const wanted = Math.min(pairLists[key].length, CUSTOM_WORD_LIMITS.relatedWords)
        if (kept[key] < wanted) warnings.push({ line, message: `「${label}」の同じ語（または語のない項目）は1つにまとめました` })
      }
      if (word.phrases.length < Math.min(phraseList.length, CUSTOM_WORD_LIMITS.phrases)) warnings.push({ line, message: '「熟語・構文」の同じ句は1つにまとめました' })
      if (word.otherSenses.length < Math.min(senseList.length, CUSTOM_WORD_LIMITS.otherSenses)) warnings.push({ line, message: '「ほかの意味」の同じ意味は1つにまとめました' })
      if (!id) word.id = `u-${now.toString(36)}csv${rowIndex}`
      if (replacedId) replaces.push({ from: replacedId, to: word.id })
      words.push(word)
      return
    }

    // 英単語以外：テンプレートにない欄に書いた中身は読まない（知らせる）。
    const allowed = new Set(templateFor(template).fields.map((item) => item.key))
    const dropped = CUSTOM_CARD_TABLE_COLUMNS
      .filter((item) => values[item.key] && !['category', 'template', 'id', 'categorySubject', 'categoryTemplate'].includes(item.key) && !allowed.has(item.key))
      .map((item) => item.name)
    if (dropped.length) warnings.push({ line, message: `「${dropped.join('」「')}」はテンプレート「${templateFor(template).label}」にない欄なので読みません` })
    if (cards.length >= CUSTOM_CARD_LIMITS.cards) {
      errors.push({ line, message: `カードは${CUSTOM_CARD_LIMITS.cards}枚までなので、この行は読みません` })
      return
    }
    const fields = templateFor(template).fields
    for (const item of fields) {
      if (!values[item.key]) continue
      const multi = item.multiline || ['back', 'example', 'exampleTranslation', 'note'].includes(item.key)
      cutText(line, item.label, multi ? multiLineLength(values[item.key]) : oneLineLength(values[item.key]), CUSTOM_CARD_LIMITS[item.key] ?? 200)
    }
    const card = normalizeCustomCard({
      id,
      template,
      category,
      ...Object.fromEntries([...allowed].map((key) => [key, values[key] ?? ''])),
      createdAt: now + rowIndex,
      updatedAt: now + rowIndex,
    }, { now })
    if (!id) card.id = `c-${now.toString(36)}csv${rowIndex}`
    if (replacedId) replaces.push({ from: replacedId, to: card.id })
    cards.push(card)
  })

  // 使ったカテゴリー（今あるもの・新しく作るもの・カテゴリーだけの行で書かれたもの）をまとまりに入れる。設定の列は反映する。
  const usedCategories = new Set([...words, ...cards].map((entry) => entry.category))
  for (const id of defined) usedCategories.add(id)
  const applySetting = (item) => {
    const setting = updates.get(item.id)
    if (!setting) return item
    return {
      ...item,
      subject: setting.subject ?? item.subject,
      template: setting.template ?? item.template,
    }
  }
  const libraryCategories = [
    ...existing.filter((item) => usedCategories.has(item.id)).map(applySetting),
    ...created.filter((item) => usedCategories.has(item.id)).map(applySetting),
  ]
  const library = { words, cards, categories: libraryCategories }
  return {
    status: words.length || cards.length || libraryCategories.length ? 'ok' : 'empty',
    library,
    errors,
    warnings,
    notices,
    newCategories: created.filter((item) => usedCategories.has(item.id)).map((item) => item.title),
    rowCount: body.length,
    replaces,
  }
}

/** 教科の名前（分類の列に書ける名前の一覧に使う）。 */
export const CUSTOM_SUBJECT_TITLES = Object.freeze(CUSTOM_SUBJECTS.map((subject) => subject.label))
