// 社会・理科の文で、常用漢字にない字をふくむ語に読みがな（ルビ）を重ねる。
// 教材の文そのものは変えず、表示するときに src/data/subjects/readings.js の辞書を当てる。
// すでに「琵琶湖（びわこ）」のように読みを書いてある語には、重ねない。
import { SUBJECT_READINGS } from '../data/subjects/readings.js'

const ENTRIES = Object.freeze(
  [...SUBJECT_READINGS]
    .map(([text, reading]) => ({ text, reading }))
    .sort((a, b) => b.text.length - a.text.length),
)
const INLINE_READING = /^[(（][ぁ-ゖー・]/u

/** 文を、読みがなを付ける語と、そのままの文に分ける。 */
export function tokenizeSubjectText(value) {
  const text = value == null ? '' : String(value)
  if (!text) return []
  const segments = []
  let cursor = 0
  let plainStart = 0
  while (cursor < text.length) {
    const match = ENTRIES.find((entry) => text.startsWith(entry.text, cursor))
    if (!match || INLINE_READING.test(text.slice(cursor + match.text.length, cursor + match.text.length + 2))) {
      cursor += match ? match.text.length : 1
      continue
    }
    if (cursor > plainStart) segments.push({ text: text.slice(plainStart, cursor) })
    segments.push({ text: match.text, reading: match.reading })
    cursor += match.text.length
    plainStart = cursor
  }
  if (plainStart < text.length) segments.push({ text: text.slice(plainStart) })
  return segments
}

// 社会・理科の教材（単語帳・学習の記録の domain と、一覧の教材 ID）。
// この教材の文は、一覧・単語帳・学習の記録の画面でも読みがなを付けて出す。
const SUBJECT_TEXT_SOURCES = new Set([
  'socialTerms', 'socialPractice', 'scienceTerms', 'sciencePractice',
  'social-terms', 'social-practice', 'science-terms', 'science-practice',
])

/** 社会・理科の教材の項目か（domain・教材 ID のどちらでも引ける）。 */
export const isSubjectTextSource = (source) => SUBJECT_TEXT_SOURCES.has(source)

/** 検索用：文と、読みがなに置きかえた文をつなげたもの（「あそさん」でも「阿蘇山」を見つけられる）。 */
export function subjectTextForSearch(value) {
  const text = value == null ? '' : String(value)
  const reading = tokenizeSubjectText(text).map((segment) => segment.reading ?? segment.text).join('')
  return `${text} ${reading}`
}
