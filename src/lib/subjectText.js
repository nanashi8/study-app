// 社会・理科の文で、常用漢字にない字をふくむ語や読み方が特別な語に読みがな（ルビ）を重ねる。
// 教材の文そのものは変えず、表示するときに src/data/subjects/readings.js の辞書を当てる。
// すでに「琵琶湖（びわこ）」「シャンハイ（上海）」のように読みを書いてある語には、重ねない。
import { SUBJECT_READINGS } from '../data/subjects/readings.js'

const ENTRIES = Object.freeze(
  [...SUBJECT_READINGS]
    .map(([text, reading]) => ({ text, reading }))
    .sort((a, b) => b.text.length - a.text.length),
)
// 「シャンハイ（上海）」のように読みが先に書いてあるか、「上海（シャンハイ）」のように後に書いてあるか。
// かっこの中が辞書の読みで始まるときだけ、読みとみなす。「九十九里浜（いわし）」「年貢（その年の収穫で変わる）」の
// ように、かっこの中のひらがなが産物や説明のときは、読みがなを付ける（2026-10-01 に教材の全文で確かめた）。
const writtenAround = (text, start, entry) => {
  const end = start + entry.text.length
  if (text.startsWith(`（${entry.reading}`, end) || text.startsWith(`(${entry.reading}`, end)) return true
  const before = text.slice(Math.max(0, start - entry.reading.length - 1), start)
  return before === `${entry.reading}（` || before === `${entry.reading}(`
}

/** 文を、読みがなを付ける語と、そのままの文に分ける。 */
export function tokenizeSubjectText(value) {
  const text = value == null ? '' : String(value)
  if (!text) return []
  const segments = []
  let cursor = 0
  let plainStart = 0
  while (cursor < text.length) {
    const match = ENTRIES.find((entry) => text.startsWith(entry.text, cursor))
    if (!match || writtenAround(text, cursor, match)) {
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
