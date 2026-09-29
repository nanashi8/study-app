// 英文のダッシュ（—）・コロン（:）・セミコロン（;）が、その文で何を表すかの解説。
// 台帳の marks（[記号, 説明] の並び、本文に出る順）を本文の記号の位置へ順に当てはめる。
// 挿入をはさむ一対のダッシュは '— —' と書き、1つの説明で2つのダッシュを受け持つ。

export const PUNCTUATION_MARKS = Object.freeze(['—', ':', ';'])

const MARK_PATTERN = /[—:;]/gu
const WORD_PATTERN = /[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*(?:[-‐][A-Za-z0-9]+)*/gu

export const PUNCTUATION_MARK_NAMES = Object.freeze({
  '—': 'ダッシュ',
  '— —': '一対のダッシュ',
  ':': 'コロン',
  ';': 'セミコロン',
})

// 本文の記号の位置（出る順）。
export function punctuationOccurrences(sentence = '') {
  return [...`${sentence}`.matchAll(MARK_PATTERN)].map((match) => ({
    mark: match[0],
    index: match.index ?? 0,
  }))
}

export function countPunctuationMarks(sentence = '') {
  return punctuationOccurrences(sentence).length
}

// 記号のまわりの語を短く切り出して、どの記号の説明かが分かるようにする。
function wordsBefore(text, limit) {
  const words = [...text.matchAll(WORD_PATTERN)].map((match) => match[0])
  return words.slice(-limit).join(' ')
}

function wordsAfter(text, limit) {
  const words = [...text.matchAll(WORD_PATTERN)].map((match) => match[0])
  return words.slice(0, limit).join(' ')
}

function shorten(text, limit) {
  const words = [...text.matchAll(WORD_PATTERN)].map((match) => match[0])
  if (words.length <= limit) return words.join(' ')
  return `${words.slice(0, Math.ceil(limit / 2)).join(' ')} … ${words.slice(-Math.floor(limit / 2)).join(' ')}`
}

// marks を本文の記号へ当てはめる。errors が空なら、本文のすべての記号に説明がある。
export function buildPunctuationNotes(sentence = '', marks = []) {
  const text = `${sentence}`
  const occurrences = punctuationOccurrences(text)
  const used = new Set()
  const errors = []
  const notes = []
  for (const [index, item] of (marks ?? []).entries()) {
    const spec = `${item?.mark ?? ''}`.trim()
    const explanation = `${item?.text ?? ''}`.trim()
    if (!explanation) errors.push(`記号の説明 ${index + 1} が空です`)
    const pair = spec === '— —'
    const mark = pair ? '—' : spec
    if (!PUNCTUATION_MARKS.includes(mark)) {
      errors.push(`記号「${spec}」は — : ; か '— —' で書きます`)
      continue
    }
    const firstIndex = occurrences.findIndex((occurrence, at) => !used.has(at) && occurrence.mark === mark)
    if (firstIndex < 0) {
      errors.push(`記号「${spec}」が本文に残っていません`)
      continue
    }
    // 説明は本文に出る順に書く（先に出る記号を飛ばさない）。
    const skipped = occurrences.findIndex((_, at) => !used.has(at))
    if (skipped !== firstIndex) {
      errors.push(`記号「${spec}」の前に、説明のない記号「${occurrences[skipped].mark}」があります`)
    }
    used.add(firstIndex)
    const first = occurrences[firstIndex]
    if (pair) {
      const secondIndex = occurrences.findIndex((occurrence, at) => at > firstIndex && !used.has(at) && occurrence.mark === '—')
      if (secondIndex < 0) {
        errors.push('一対のダッシュ「— —」の2つ目がありません')
        continue
      }
      used.add(secondIndex)
      const second = occurrences[secondIndex]
      notes.push(Object.freeze({
        mark: '— —',
        name: PUNCTUATION_MARK_NAMES['— —'],
        before: wordsBefore(text.slice(0, first.index), 3),
        inside: shorten(text.slice(first.index + 1, second.index), 8),
        after: wordsAfter(text.slice(second.index + 1), 3),
        text: explanation,
      }))
      continue
    }
    notes.push(Object.freeze({
      mark,
      name: PUNCTUATION_MARK_NAMES[mark],
      before: wordsBefore(text.slice(0, first.index), 4),
      inside: '',
      after: wordsAfter(text.slice(first.index + 1), 4),
      text: explanation,
    }))
  }
  const missing = occurrences.filter((_, at) => !used.has(at))
  if (missing.length) {
    errors.push(`説明のない記号が ${missing.length} 個あります（${missing.map((item) => item.mark).join(' ')}）`)
  }
  return Object.freeze({ notes: Object.freeze(notes), errors: Object.freeze(errors), count: occurrences.length })
}
