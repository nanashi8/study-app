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
])

const READING_ROLE_CODE_SET = new Set(READING_ROLE_CODES)
const ENGLISH_WORD_PATTERN = /[A-Za-z][A-Za-z'’\u2010-\u2015-]*/g

function englishWordMatches(text = '') {
  return [...`${text}`.matchAll(ENGLISH_WORD_PATTERN)]
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
    const nextWordStart = sourceWords[wordCursor]?.index ?? source.length
    const sourceText = source.slice(characterCursor, nextWordStart)
    characterCursor = nextWordStart
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
  if (!roles.includes('V') && !verbOmitted) {
    errors.push(Object.freeze({ type: 'missing-verb-role' }))
  }

  return Object.freeze({
    source,
    segments: Object.freeze(segments),
    errors: Object.freeze(errors),
    sourceWordCount: sourceWords.length,
    annotatedWordCount: wordCursor,
    impliedSubject: !roles.includes('S') && roles.includes('V'),
    verbOmitted,
  })
}
