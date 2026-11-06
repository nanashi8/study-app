import { normalizeToken } from './text.js'

export const READING_ROLE_CODES = Object.freeze([
  'S',
  'V',
  'O',
  'O1',
  'O2',
  'C',
  'M',
  'LINK',
  'IND',
  'INS',
  'S_FORMAL',
  'S_REAL',
  'O_FORMAL',
  'O_REAL',
])

const READING_ROLE_CODE_SET = new Set(READING_ROLE_CODES)
const ENGLISH_WORD_PATTERN = /[A-Za-z][A-Za-z'’\u2010-\u2015-]*/g

// 主語と動詞の短縮形（it’s・I’ll など）は、構造台帳と同じく主語と動詞の2語に分けて数える。
// 動詞と目的語の短縮形（keep’em＝keep them）も、動詞と目的語の2語に分ける。
const VERB_CONTRACTION = /^(.+?)(['’])(ll|ve|re|m|d)$/i
const IS_CONTRACTION = /^(it|that|there|here|he|she|what|who|where|how|let)(['’])(s)$/i
const OBJECT_CONTRACTION = /^(.+?)(['’])(em)$/i

function englishWordMatches(text = '') {
  return [...`${text}`.matchAll(ENGLISH_WORD_PATTERN)].flatMap((match) => {
    const split = VERB_CONTRACTION.exec(match[0]) ?? IS_CONTRACTION.exec(match[0]) ?? OBJECT_CONTRACTION.exec(match[0])
    if (!split) return [match]
    const head = Object.assign([split[1]], { index: match.index })
    const tail = Object.assign([split[3]], { index: (match.index ?? 0) + split[1].length + split[2].length })
    return [head, tail]
  })
}

// 2つの要素の間の文字（boundary）のうち、次の語の前に付く開きの記号がどこから始まるか（なければ -1）。
// 開きの記号：構造図の「(」「<」と、開きの引用符「“」「‘」と、空白や開きの記号のあとの「"」。
// 例：says, "Please … → 「says,」と「"Please …」に分ける（「says, "」と切らない）。
// 前の語のすぐ後ろの「"」（bag." の "）は閉じの引用符なので、前の要素に残す。
function openingMarkStart(boundary = '') {
  let start = -1
  for (let at = boundary.length - 1; at >= 0; at--) {
    const mark = boundary[at]
    if (/\s/.test(mark)) continue
    const opens = '(<“‘'.includes(mark) || (mark === '"' && at > 0 && /[\s(<“‘]/.test(boundary[at - 1]))
    if (!opens) break
    start = at
  }
  return start
}

function normalizedEnglishWord(word = '') {
  return normalizeToken(word)
    .replaceAll('’', "'")
    .replace(/[\u2010-\u2015]/g, '-')
}

export function readingSentenceRoleParts(analysis) {
  return analysis?.phraseSequence.flatMap((pair) =>
    pair.roleParts.map((part) => Object.freeze({
      role: part.role,
      text: part.en,
    }))) ?? []
}

// 構文解析側の役割単位を、画面に出す原文の文字範囲へ順番どおり投影する。
// 原文を作り直さず slice するため、句読点・大文字・引用符をそのまま保てる。
export function buildReadingRoleAnnotation(sentence = '', parts = [], options = {}) {
  const source = `${sentence}`
  const sourceWords = englishWordMatches(source)
  const errors = []
  const segments = []
  let wordCursor = 0
  let characterCursor = 0

  if (!source.trim()) errors.push(Object.freeze({ type: 'empty-source' }))
  if (!parts.length) errors.push(Object.freeze({ type: 'missing-role-parts' }))

  for (const [index, part] of parts.entries()) {
    const role = `${part?.role ?? ''}`
    const expectedWords = englishWordMatches(part?.text ?? '')
    if (!READING_ROLE_CODE_SET.has(role)) {
      errors.push(Object.freeze({ type: 'invalid-role', index, role }))
    }
    if (!expectedWords.length) {
      errors.push(Object.freeze({ type: 'empty-role-part', index, role }))
      continue
    }

    const actualWords = sourceWords.slice(wordCursor, wordCursor + expectedWords.length)
    for (const [wordIndex, expected] of expectedWords.entries()) {
      const actual = actualWords[wordIndex]
      if (
        !actual ||
        normalizedEnglishWord(actual[0]) !== normalizedEnglishWord(expected[0])
      ) {
        errors.push(Object.freeze({
          type: 'word-mismatch',
          index,
          wordIndex,
          expected: expected[0],
          actual: actual?.[0] ?? '',
        }))
      }
    }

    wordCursor += expectedWords.length
    const previous = sourceWords[wordCursor - 1]
    const lastWordEnd = previous ? (previous.index ?? 0) + previous[0].length : characterCursor
    const nextWordStart = sourceWords[wordCursor]?.index ?? source.length
    // 構造図の括弧つきで表示するとき、次の語の前に付く「(」「<」と開きの引用符は次の役割の側に入れる。
    const boundary = source.slice(lastWordEnd, nextWordStart)
    const opening = openingMarkStart(boundary)
    // 2つの要素に分けた短縮形（It’s → It ／ ’s、let’s → let ／ ’s）は、アポストロフィを後ろの要素に入れる（「It’ ／ s」と切らない）。
    const contraction = /^['’]$/.test(boundary)
    const cut = opening >= 0 ? lastWordEnd + opening : contraction ? lastWordEnd : nextWordStart
    const sourceText = source.slice(characterCursor, Math.max(characterCursor, cut))
    characterCursor = Math.max(characterCursor, cut)
    segments.push(Object.freeze({
      index,
      role,
      sourceText,
      analysisText: `${part.text}`,
      wordCount: expectedWords.length,
    }))
  }

  if (wordCursor !== sourceWords.length) {
    errors.push(Object.freeze({
      type: 'word-count-mismatch',
      sourceWordCount: sourceWords.length,
      annotatedWordCount: wordCursor,
    }))
  }

  const reconstructed = segments.map((segment) => segment.sourceText).join('')
  if (reconstructed !== source) {
    errors.push(Object.freeze({ type: 'source-reconstruction-mismatch' }))
  }

  const roles = segments.map((segment) => segment.role)
  const verbOmitted = !roles.includes('V') && Boolean(options.allowVerbOmission)
  if (!roles.includes('V') && !verbOmitted && !options.allowMissingVerb) {
    errors.push(Object.freeze({ type: 'missing-verb-role' }))
  }

  return Object.freeze({
    source,
    segments: Object.freeze(segments),
    errors: Object.freeze(errors),
    sourceWordCount: sourceWords.length,
    annotatedWordCount: wordCursor,
    impliedSubject: !options.withoutImpliedSubject &&
      !roles.includes('S') && !roles.includes('S_FORMAL') && roles.includes('V'),
    verbOmitted,
  })
}
