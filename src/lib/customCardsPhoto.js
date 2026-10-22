// 自作カードの「写真から作る」。写真の文字（「教科書から単語追加」と同じ読み取りエンジンの結果）から、カードの候補を作る。
//
// 写真で同じ高さに並ぶ文字の箱（単語表の「単語」と「意味」など）を1行にまとめ、1行を1枚のカードの候補（表・裏）にする。
// 行の中の別々の箱のあいだは全角の空白「　」でつなぐ。読み取った文字の欄で直してから作り直しても、同じ区切りで読む。
// 英単語のテンプレートは、英語と日本語が並ぶ行を単語と意味（品詞・発音記号も）に、英文の中の語を辞書の意味つきの候補にする。
// 候補は捨てない。最初は選ばない候補（意味がない・読み取りが不確か・英文の中の語など）は、画面で理由を添えて出す。
import { OCR_LOW_CONFIDENCE, matchOcrTextToWords } from './vocabOcr.js'
import { CUSTOM_CARD_LIMITS, ENGLISH_TEMPLATE_ID, templateFor } from './customCards.js'
import { CUSTOM_WORD_FIELDS, CUSTOM_WORD_LIMITS, CUSTOM_WORD_POS } from './customWords.js'
import { emptyEntryValues, missingEntryFields } from './customEntryForm.js'

// 1行の中の箱と箱のあいだ。
export const PHOTO_ROW_SEPARATOR = '　'

const JAPANESE = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u
const LATIN = /[A-Za-z]/
// 表と裏の区切り：箱のあいだ（全角の空白）・タブ・2つ以上の空白。
const SEGMENT_BREAK = /\t|　|\s{2,}/u
// 行の頭の番号・印（「1.」「(2)」「③」「□」「・」「Q1.」「問3」）。4けた以上の数（1990年）は外さない。
const LEADING_MARKS = /^(?:\s*(?:[□■☐☑✓✔・●○◯◎◇◆▶▷►*＊※]+|[(（][0-9０-９]{1,3}[)）]|[①-⑳]|[0-9０-９]{1,3}[.．)）:：、]|[0-9０-９]{1,3}(?=\s)|Q[0-9０-９]*[.．:：]|問[0-9０-９]+[.．:：)）]?)\s*)+/u
// 英語の行の品詞の印（「名 図書館」「【動】借りる」「(形) おもしろい」）。
const POS_MARKS = Object.freeze({
  名: '名', 名詞: '名', 動: '動', 動詞: '動', 形: '形', 形容詞: '形', 副: '副', 副詞: '副',
  前: '前', 前置詞: '前', 接: '接', 接続詞: '接', 代: '代', 代名詞: '代',
})
const POS_MARK_WORDS = Object.keys(POS_MARKS).sort((a, b) => b.length - a.length).join('|')
const BRACKETED_POS = new RegExp(`^[\\[［【(（〔〈<]\\s*(${POS_MARK_WORDS})\\s*[\\]］】)）〕〉>]\\s*`, 'u')
const BARE_POS = new RegExp(`^(${POS_MARK_WORDS})\\s+`, 'u')
// 英語の語句（単語・熟語）として表にできる形。数字・文の終わりの記号は持たない。
const ENGLISH_HEAD = /^[A-Za-z][A-Za-z'’\-~～〜()（）/,. ]*$/u
const MAX_HEAD_WORDS = 6
// 2行に分かれた単語と意味、問題と答えの、2行目の長さの上限。
const MAX_NEXT_ROW_MEANING = 30
const MAX_NEXT_ROW_ANSWER = 60
// 意味の頭が助詞と「 か空白なら、英語の語を説明する文（decide は「決める」…）。単語と意味の組にしない。
const SENTENCE_PARTICLE = /^[はがをにのともで](?:\s|[「『"“])/u
// 日本語で始まり、英語で終わる行（りんご apple）。
const JAPANESE_THEN_ENGLISH = /^(.*[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}])([^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]*)$/u

const LATIN_LETTERS = /[A-Za-z]/gu
const JAPANESE_CHARS = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/gu
const countMatches = (text, pattern) => (String(text).match(pattern) ?? []).length

const POS_LABEL_BY_ID = Object.fromEntries(CUSTOM_WORD_POS.map((pos) => [pos.id, pos.label]))

const squash = (value) => String(value ?? '').replace(/[\s　]+/gu, ' ').trim()
const trimEdges = (value) => squash(value)
  .replace(/^[-–—:：=＝→⇒…‥,、]+\s*/u, '')
  .replace(/\s*[-–—:：=＝→⇒…‥,、(（]+$/u, '')
  .trim()

/** 行の頭の番号・印を外す。 */
export function stripLeadingMarks(value) {
  return String(value ?? '').replace(LEADING_MARKS, '').trim()
}

// ── 写真の文字の箱を行にまとめる ─────────────────────────────

function boxOf(poly) {
  if (!Array.isArray(poly) || poly.length < 3) return null
  const xs = poly.map((point) => Number(point?.[0]))
  const ys = poly.map((point) => Number(point?.[1]))
  if (![...xs, ...ys].every(Number.isFinite)) return null
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }
}

/**
 * 読み取った箱（ocrEngine.js の ocrPageFromItems の lines：{ text, confidence, poly }）を、写真で同じ高さに並ぶものごとに
 * 1行へまとめる。箱の高さの中ほどが、行の高さの中ほどから小さいほうの高さの半分の内にあれば同じ行。行の中は左から並べる。
 * 位置のない箱があるときは、読み取った順の1箱1行にする。
 * 戻り値 [{ text, confidence, segments }]（text は箱を「　」でつないだ文、confidence は行の箱でいちばん低い確からしさ）。
 */
export function photoRowsFromLines(lines) {
  const items = (Array.isArray(lines) ? lines : [])
    .map((line, order) => ({
      text: squash(line?.text),
      confidence: Number.isFinite(Number(line?.confidence)) ? Number(line.confidence) : null,
      box: boxOf(line?.poly),
      order,
    }))
    .filter((item) => item.text)
  const finish = (row) => {
    const segments = [...row.items].sort((a, b) => (a.box?.x0 ?? 0) - (b.box?.x0 ?? 0) || a.order - b.order)
    const confidences = segments.map((item) => item.confidence).filter((value) => value != null)
    return {
      text: segments.map((item) => item.text).join(PHOTO_ROW_SEPARATOR),
      confidence: confidences.length ? Math.min(...confidences) : null,
      segments: segments.map((item) => item.text),
    }
  }
  if (items.some((item) => !item.box)) return items.map((item) => finish({ items: [item] }))

  const rows = []
  const byCenter = [...items].sort((a, b) => (a.box.y0 + a.box.y1) - (b.box.y0 + b.box.y1) || a.order - b.order)
  for (const item of byCenter) {
    const center = (item.box.y0 + item.box.y1) / 2
    const height = Math.max(1, item.box.y1 - item.box.y0)
    let best = null
    for (const row of rows) {
      const distance = Math.abs(center - row.center)
      if (distance <= Math.min(height, row.height) / 2 && (!best || distance < best.distance)) best = { row, distance }
    }
    if (best) {
      const { row } = best
      row.items.push(item)
      row.center = (row.center * (row.items.length - 1) + center) / row.items.length
      row.height = (row.height * (row.items.length - 1) + height) / row.items.length
    } else {
      rows.push({ items: [item], center, height })
    }
  }
  return rows.sort((a, b) => a.center - b.center).map(finish)
}

/** 行を、読み取った文字の欄に出す文にする（1行が1枚）。 */
export const photoTextFromRows = (rows) => rows.map((row) => row.text).join('\n')

/** 行の文 → 確からしさ。読み取った文字を直した行は入っていないので、確かな行として読む。 */
export function photoRowConfidences(rows) {
  const confidences = new Map()
  for (const row of rows) {
    if (row.confidence == null) continue
    const key = squash(row.text)
    confidences.set(key, Math.min(confidences.get(key) ?? Infinity, row.confidence))
  }
  return confidences
}

// ── 1行を表と裏に分ける ──────────────────────────────────

/** 英語の語句（単語・熟語）として表にできるか。数字・文の終わり（. ? !）は文や見出しとみなす。 */
function englishHead(value) {
  const text = trimEdges(value)
  if (!text || !ENGLISH_HEAD.test(text) || /[.!?]$/u.test(text)) return null
  const words = text.split(' ').filter((word) => LATIN.test(word))
  return words.length >= 1 && words.length <= MAX_HEAD_WORDS ? text : null
}

/** 英語の部分から発音記号（[ǽpl]・/ˈæpəl/）を取り出す。 */
function takePhonetic(value) {
  const match = String(value).match(/\s*(?:[[［]([^\]］]+)[\]］]|\/([^/]+)\/)\s*/u)
  if (!match) return { text: value, phonetic: '' }
  const inner = squash(match[1] ?? match[2])
  return {
    text: `${value.slice(0, match.index)} ${value.slice(match.index + match[0].length)}`,
    phonetic: match[2] != null ? `/${inner}/` : `[${inner}]`,
  }
}

/** 意味の頭の品詞の印を取り出す。 */
function takePosMark(value) {
  const text = squash(value)
  const match = text.match(BRACKETED_POS) ?? text.match(BARE_POS)
  if (!match) return { text, posId: null }
  return { text: trimEdges(text.slice(match[0].length)), posId: POS_MARKS[match[1]] }
}

// 品詞の印が意味にくっついて読まれた形（名図書館）。印か意味の頭の字かは、呼ぶ側が辞書と表のほかの行から決める。
const GLUED_POS = /^(名|動|形|副|前|接|代)(?=\S)/u
function gluedPosMark(back) {
  const match = String(back ?? '').match(GLUED_POS)
  if (!match) return null
  const rest = trimEdges(back.slice(match[0].length))
  return rest ? { posId: POS_MARKS[match[1]], rest } : null
}

/** 辞書で決める：意味全体が辞書の意味なら印ではない（false）、残りが辞書の意味なら印（true）、どちらでもなければ null。 */
function gluedByDictionary(glued, back, word) {
  if (!word) return null
  const meanings = String(word.meaning ?? '').split(/[・,、]/u).map(squash).filter(Boolean)
  if (meanings.includes(squash(back))) return false
  if (meanings.includes(glued.rest)) return true
  return null
}

/**
 * 英単語のテンプレートの1行を、英語（表）と日本語（裏）に分ける。組にならない行は null。
 *   「library　名 図書館」（別々の箱）・「apple [ǽpl] 名 りんご」・「りんご apple」・「look forward to ~ ～を楽しみに待つ」
 */
function splitEnglishRow(row) {
  const parts = row.split(SEGMENT_BREAK).map(squash).filter(Boolean)
  const tries = []
  if (parts.length >= 2) {
    tries.push({ english: parts[0], rest: parts.slice(1).join(' ') })
    if (!LATIN.test(parts.slice(0, -1).join(' '))) tries.push({ english: parts.at(-1), rest: parts.slice(0, -1).join(' ') })
  }
  const firstJapanese = row.search(JAPANESE)
  if (firstJapanese > 0) {
    // 意味の頭の「～」（look forward to ~ing ～を楽しみに待つ）は、意味の側に入れる。
    const english = row.slice(0, firstJapanese)
    const tilde = english.match(/\s+([~～〜…]+)\s*$/u)
    tries.push(tilde
      ? { english: english.slice(0, tilde.index), rest: `${tilde[1]}${row.slice(firstJapanese)}` }
      : { english, rest: row.slice(firstJapanese) })
  }
  const tail = row.match(JAPANESE_THEN_ENGLISH)
  if (tail && !LATIN.test(tail[1])) tries.push({ english: tail[2], rest: tail[1] })

  for (const { english, rest } of tries) {
    if (!JAPANESE.test(rest)) continue
    const { text, phonetic } = takePhonetic(english)
    const head = englishHead(text)
    if (!head) continue
    const meaning = takePosMark(trimEdges(rest))
    if (SENTENCE_PARTICLE.test(meaning.text)) continue
    // 意味は日本語が主（want の過去形）。英語のほうが多い残り（) to school every day. ア go イ goes）は意味にしない。
    if (countMatches(meaning.text, LATIN_LETTERS) > countMatches(meaning.text, JAPANESE_CHARS)) continue
    return { front: head, back: meaning.text, posId: meaning.posId, phonetic }
  }
  return null
}

/** 英単語以外のテンプレートの1行を、表と裏に分ける。裏がない行は back が空。 */
function splitCardRow(row, template) {
  let text = row
  let pos = ''
  // 古文単語の【形動ナリ】のような括弧は品詞・活用の欄へ。
  if (template === 'koten') {
    const bracket = text.match(/^(.+?)\s*【([^】]{1,30})】\s*(.*)$/u)
    if (bracket) {
      pos = squash(bracket[2])
      text = `${squash(bracket[1])}${bracket[3] ? `${PHOTO_ROW_SEPARATOR}${bracket[3]}` : ''}`
    }
  }
  const result = (front, back) => ({ front: trimEdges(front), back: trimEdges(back), pos })
  if (template === 'qa') {
    const question = text.match(/^(.+?[？?])\s*(\S.*)$/u)
    if (question) return result(question[1], question[2])
  }
  const parts = text.split(SEGMENT_BREAK).map(squash).filter(Boolean)
  if (parts.length >= 2) return result(parts[0], parts.slice(1).join(' '))
  const separated = text.match(/^(.+?)\s*[：:＝=→⇒]\s*(.+)$/u)
  if (separated) return result(separated[1], separated[2])
  // 英語の語句と日本語の境目（the Industrial Revolution 産業革命）。
  const firstJapanese = text.search(JAPANESE)
  if (firstJapanese > 0 && !JAPANESE.test(text.slice(0, firstJapanese)) && LATIN.test(text.slice(0, firstJapanese))) {
    return result(text.slice(0, firstJapanese), text.slice(firstJapanese))
  }
  const spaced = text.match(/^(\S+)\s+(.+)$/u)
  if (spaced) return result(spaced[1], spaced[2])
  return result(text, '')
}

// ── 候補 ──────────────────────────────────────────

/** 分類にもうあるか・候補どうしで同じかを見る鍵（英単語は大文字・小文字を区別しない）。 */
export function photoFrontKey(template, front) {
  const text = squash(String(front ?? '').normalize('NFKC'))
  return template === ENGLISH_TEMPLATE_ID ? text.toLowerCase() : text
}

/** 分類にもうあるカードの鍵（英単語はその分類の英単語のカード、ほかはその分類のカード）。 */
export function existingPhotoKeys({ words = [], cards = [] } = {}, category, template) {
  const english = template === ENGLISH_TEMPLATE_ID
  const entries = english
    ? words.filter((word) => word.category === category).map((word) => word.word)
    : cards.filter((card) => card.category === category).map((card) => card.front)
  return new Set(entries.map((front) => photoFrontKey(template, front)))
}

function headwordIndex(words) {
  const index = new Map()
  for (const word of words) {
    const key = photoFrontKey(ENGLISH_TEMPLATE_ID, word?.word)
    if (key && !index.has(key)) index.set(key, word)
  }
  return index
}

/** 辞書の語から、英単語のカードに入れる品詞・級・分野・発音記号。 */
function dictionaryDetails(word) {
  if (!word) return {}
  return {
    posId: POS_LABEL_BY_ID[word.pos] ? word.pos : null,
    level: word.level ?? null,
    field: CUSTOM_WORD_FIELDS.includes(word.field) ? word.field : null,
    phonetic: word.phonetic ?? '',
    dictionaryId: word.id,
  }
}

/**
 * 読み取った文字（1行が1枚）から、カードの候補を作る。
 *   template          テンプレートの id
 *   words             英単語の辞書の語（ALL_WORDS）。英単語のテンプレートで使う
 *   englishWords      実在する英単語の表（englishWordList.js の Set）。辞書にない語を確かめる
 *   tokenConfidences  vocabOcr.js の ocrTokenConfidences の結果（英文の中の語の確からしさ）
 *   rowConfidences    photoRowConfidences の結果（行の確からしさ）
 *   contextReading    (text) → vocabOcr.js の contextReading（saw → see などの読み分け）。なければ null
 * 戻り値 { candidates, rowCount, japaneseOnlyRows }。
 * 候補：{ key, front, back, posId, level, field, phonetic, pos, kind: 'row' | 'word', meaningFrom: 'photo' | 'dictionary' | null,
 *        uncertain, corrected, split, listed, rejected, observed, occurrences, suggested（最初に選ぶ） }
 */
export function buildPhotoCardCandidates(text, {
  template,
  words = [],
  englishWords = null,
  tokenConfidences = new Map(),
  rowConfidences = new Map(),
  contextReading = null,
} = {}) {
  const english = template === ENGLISH_TEMPLATE_ID
  const rows = String(text ?? '').split(/\r?\n/u)
    .map((raw) => ({ raw: squash(raw), text: stripLeadingMarks(raw) }))
    .filter((row) => row.text)
  const isUncertain = (...rawRows) => rawRows.some((raw) => {
    const confidence = rowConfidences.get(raw)
    return confidence != null && confidence < OCR_LOW_CONFIDENCE
  })

  const candidates = []
  const byKey = new Map()
  const add = (candidate) => {
    const key = photoFrontKey(template, candidate.front)
    if (!key) return
    const existing = byKey.get(key)
    if (existing) {
      existing.occurrences += candidate.occurrences ?? 1
      if (!existing.back && candidate.back) Object.assign(existing, { back: candidate.back, meaningFrom: candidate.meaningFrom })
      for (const surface of candidate.observed ?? []) if (!existing.observed.includes(surface)) existing.observed.push(surface)
      return
    }
    const full = {
      key: `p${candidates.length}`,
      front: '',
      back: '',
      posId: null,
      level: null,
      field: null,
      phonetic: '',
      pos: '',
      kind: 'row',
      meaningFrom: null,
      uncertain: false,
      corrected: false,
      split: false,
      listed: false,
      rejected: false,
      observed: [],
      occurrences: 1,
      ...candidate,
    }
    full.suggested = candidate.suggested ?? Boolean(full.front && full.back && !full.uncertain)
    byKey.set(key, full)
    candidates.push(full)
  }

  if (!english) {
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index]
      const split = splitCardRow(row.text, template)
      let uncertain = isUncertain(row.raw)
      // 一問一答で「？」で終わる行は、次の行（問いでない短い行）を答えにする。
      if (template === 'qa' && !split.back && /[？?]$/u.test(split.front)) {
        const next = rows[index + 1]
        if (next && !/[？?]/u.test(next.text) && next.text.length <= MAX_NEXT_ROW_ANSWER) {
          split.back = trimEdges(next.text)
          uncertain ||= isUncertain(next.raw)
          index += 1
        }
      }
      add({ ...split, meaningFrom: split.back ? 'photo' : null, uncertain })
    }
    return { candidates, rowCount: rows.length, japaneseOnlyRows: 0 }
  }

  const index = headwordIndex(words)
  const wordRows = []
  const sentenceRows = []
  let japaneseOnlyRows = 0
  // 英語だけの行で箱が分かれているもの（go　went　gone）は、箱ごとに1行として読む。
  const englishRows = rows.flatMap((row) => (
    !JAPANESE.test(row.text) && SEGMENT_BREAK.test(row.text)
      ? row.text.split(SEGMENT_BREAK).map(stripLeadingMarks).filter(Boolean).map((text) => ({ raw: row.raw, text }))
      : [row]
  ))
  // 行から作る候補（単語と意味の組・熟語の行）。品詞の印が意味にくっついて読まれた行（名図書館）を決めてから足す。
  const rowItems = []
  const pushRowItem = ({ front, back, posId, phonetic, meaningFrom, uncertain }) => {
    const word = index.get(photoFrontKey(template, front))
    const details = dictionaryDetails(word)
    rowItems.push({
      word,
      marked: Boolean(posId),
      glued: !posId && meaningFrom === 'photo' ? gluedPosMark(back) : null,
      candidate: {
        ...details,
        front,
        back: back || (word?.meaning ?? ''),
        posId: posId ?? details.posId ?? null,
        phonetic: phonetic || details.phonetic || '',
        meaningFrom: back ? meaningFrom : word ? 'dictionary' : null,
        uncertain,
      },
    })
  }
  for (let at = 0; at < englishRows.length; at += 1) {
    const row = englishRows[at]
    const pair = splitEnglishRow(row.text)
    if (pair) {
      pushRowItem({ ...pair, meaningFrom: 'photo', uncertain: isUncertain(row.raw) })
      continue
    }
    if (!LATIN.test(row.text)) {
      japaneseOnlyRows += 1
      continue
    }
    const { text: withoutPhonetic, phonetic } = takePhonetic(row.text)
    const head = !JAPANESE.test(row.text) ? englishHead(withoutPhonetic) : null
    const phrase = Boolean(head && head.split(' ').filter((word) => LATIN.test(word)).length > 1)
    if (head) {
      // 英語だけの語句の行。次の行が日本語だけの短い行（訳の文でないもの）なら、それを意味にする（単語の下に意味を書く表）。
      const next = englishRows[at + 1]
      if (next && !LATIN.test(next.text) && JAPANESE.test(next.text)
        && next.text.length <= MAX_NEXT_ROW_MEANING && !/[。．.]$/u.test(next.text)) {
        const meaning = takePosMark(trimEdges(next.text))
        pushRowItem({
          front: head,
          back: meaning.text,
          posId: meaning.posId,
          phonetic,
          meaningFrom: 'photo',
          uncertain: isUncertain(row.raw, next.raw),
        })
        at += 1
        continue
      }
      // 大文字で始まる複数の語だけの行は、文の切れはし（Emi went to the library）として英文の語にする。
      if (phrase && /^[A-Z]/u.test(head)) {
        sentenceRows.push(withoutPhonetic)
        continue
      }
      if (phrase) {
        // 熟語・語句だけの行。辞書の見出しにあればその意味を入れる。
        pushRowItem({ front: head, back: '', posId: null, phonetic, meaningFrom: null, uncertain: isUncertain(row.raw) })
        continue
      }
      wordRows.push(withoutPhonetic)
      continue
    }
    sentenceRows.push(row.text)
  }

  // 意味の頭の「名」「動」などが品詞の印か意味の字かは、まず辞書で決める（意味全体が辞書の意味なら意味の字：動物・動く、
  // 残りが辞書の意味なら印：名図書館）。決まらない行は、表のほかの行の半分以上に印があれば印とみなす。
  for (const item of rowItems) {
    if (item.glued) item.gluedByDictionary = gluedByDictionary(item.glued, item.candidate.back, item.word)
  }
  const markedRows = rowItems.filter((item) => item.marked || item.gluedByDictionary === true).length
  const photoMeaningRows = rowItems.filter((item) => item.candidate.meaningFrom === 'photo').length
  const tableHasMarks = markedRows >= 2 && markedRows * 2 >= photoMeaningRows
  for (const item of rowItems) {
    const strip = item.glued && (item.gluedByDictionary ?? tableHasMarks)
    add(strip ? { ...item.candidate, back: item.glued.rest, posId: item.glued.posId } : item.candidate)
  }

  // 単語だけの行（意味のない単語表）と、英文の中の語。辞書の語は辞書の見出し・意味で、辞書にない実在の語は意味を書く候補、
  // 英単語として確かめられない並び（人名・地名・読み違い）も、意味を書けば登録できる候補にする。
  const addMatches = (rowsText, kind) => {
    if (!rowsText.length) return
    const joined = rowsText.join('\n')
    const summary = matchOcrTextToWords(joined, words, {
      englishWords,
      confidences: tokenConfidences,
      contextReading: kind === 'word' && contextReading ? contextReading(joined) : null,
    })
    const byId = new Map(words.map((word) => [word.id, word]))
    for (const item of summary.candidates) {
      const word = byId.get(item.id)
      add({
        ...dictionaryDetails(word),
        front: item.headword,
        back: item.meaning,
        kind,
        meaningFrom: 'dictionary',
        uncertain: item.uncertain,
        corrected: item.corrected,
        split: item.split,
        observed: item.observed,
        occurrences: item.occurrences,
        // 単語だけの行の語は最初から選ぶ。英文の中の語は、登録する語を選んでもらう。
        suggested: kind === 'row' && !item.uncertain && !item.corrected && !item.split,
      })
    }
    for (const item of summary.unmatched) {
      add({ front: item.token, kind, listed: true, split: item.split, observed: item.observed, occurrences: item.occurrences, suggested: false })
    }
    for (const item of summary.rejected) {
      add({ front: item.q, kind, rejected: true, observed: item.observed, occurrences: item.occurrences, suggested: false })
    }
  }
  addMatches(wordRows, 'row')
  addMatches(sentenceRows, 'word')
  return { candidates, rowCount: rows.length, japaneseOnlyRows }
}

// ── 登録できるか・登録する中身 ────────────────────────────────

/** 表・裏の欄の名前（テンプレートごと）。 */
export function photoFieldLabels(template) {
  if (template === ENGLISH_TEMPLATE_ID) return { front: '単語', back: '意味' }
  const fields = templateFor(template).fields
  return {
    front: fields.find((item) => item.key === 'front')?.label ?? '表',
    back: fields.find((item) => item.key === 'back')?.label ?? '裏',
  }
}

/** 候補を、登録欄の中身（lib/customEntryForm.js の入れ物）にする。 */
export function photoEntryValues(candidate, template) {
  const values = { ...emptyEntryValues(), front: squash(candidate.front), back: squash(candidate.back) }
  if (template === ENGLISH_TEMPLATE_ID) {
    if (candidate.posId) values.posId = candidate.posId
    if (candidate.level) values.level = candidate.level
    if (candidate.field) values.field = candidate.field
    values.phonetic = squash(candidate.phonetic)
  } else if (templateFor(template).fields.some((item) => item.key === 'pos')) {
    values.pos = squash(candidate.pos)
  }
  return values
}

/**
 * 候補を登録できるか。missing は空の必須の欄、overflow は保存の上限を超えた欄（黙って切らないよう、直してもらう）。
 */
export function photoCandidateIssues(candidate, template) {
  const values = photoEntryValues(candidate, template)
  const missing = missingEntryFields(template, values)
  const overflow = []
  if (template === ENGLISH_TEMPLATE_ID) {
    if (values.front.length > CUSTOM_WORD_LIMITS.word) overflow.push(`単語は${CUSTOM_WORD_LIMITS.word}字まで`)
    const meanings = values.back.split(/[・,、]/u).map(squash).filter(Boolean)
    // 区切りだけの意味（「・」）は、保存すると意味が空になる。
    if (values.back && !meanings.length) missing.push('意味')
    if (meanings.length > CUSTOM_WORD_LIMITS.meanings) overflow.push(`意味は「・」で区切って${CUSTOM_WORD_LIMITS.meanings}つまで`)
    if (meanings.some((meaning) => meaning.length > CUSTOM_WORD_LIMITS.meaning)) overflow.push(`意味は1つ${CUSTOM_WORD_LIMITS.meaning}字まで`)
    if (values.phonetic.length > CUSTOM_WORD_LIMITS.phonetic) overflow.push(`発音記号は${CUSTOM_WORD_LIMITS.phonetic}字まで`)
  } else {
    for (const item of templateFor(template).fields) {
      const limit = CUSTOM_CARD_LIMITS[item.key]
      if (limit && String(values[item.key] ?? '').length > limit) overflow.push(`${item.label}は${limit}字まで`)
    }
  }
  return { missing, overflow, blocked: missing.length > 0 || overflow.length > 0 }
}
