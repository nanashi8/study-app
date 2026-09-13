// 英単語の意味で、中高生が読みにくい語に（よみ）を添える。
// テストの正誤判定・検索・読み上げに使う元の文字列は変えず、表示するときだけ区切って読みを付ける。
import { MEANING_READINGS } from '../data/meaning-readings.js'

const KANJI = /[\p{Script=Han}々〆ヶ]/u

// 先頭の字ごとに、長い語から順に並べておく（「大喝采」を「喝采」より先に当てる）。
const ENTRIES_BY_FIRST_CHAR = new Map()
for (const [text, reading] of MEANING_READINGS) {
  const first = text[0]
  if (!ENTRIES_BY_FIRST_CHAR.has(first)) ENTRIES_BY_FIRST_CHAR.set(first, [])
  ENTRIES_BY_FIRST_CHAR.get(first).push({ text, reading })
}
for (const list of ENTRIES_BY_FIRST_CHAR.values()) {
  list.sort((left, right) => right.text.length - left.text.length)
}

// 元の文にすでに「灌漑(かんがい)」のように読みが書いてあるときは重ねない。
const readingAlreadyWritten = (text, end, reading) => (
  text.startsWith(`(${reading})`, end) || text.startsWith(`（${reading}）`, end)
)

/**
 * 意味の文を、台帳の語とそれ以外に分ける。
 * 台帳の語は { text, entry, reading } で返す（文中に読みが書いてあるときは reading を付けない）。
 * 熟語の途中からは当てない（「実施する」の「施す」、「大喝采」の「喝采」）。
 * 前に漢字が続く語は、熟語全体を台帳に載せて読みの範囲をはっきりさせる。
 */
export function meaningSegments(value) {
  const text = value == null ? '' : String(value)
  const segments = []
  let plainStart = 0
  let cursor = 0
  while (cursor < text.length) {
    const insideCompound = cursor > plainStart && KANJI.test(text[cursor - 1])
    const match = insideCompound
      ? null
      : ENTRIES_BY_FIRST_CHAR.get(text[cursor])?.find((entry) => text.startsWith(entry.text, cursor))
    if (!match) {
      cursor += 1
      continue
    }
    const end = cursor + match.text.length
    if (cursor > plainStart) segments.push({ text: text.slice(plainStart, cursor) })
    segments.push(readingAlreadyWritten(text, end, match.reading)
      ? { text: match.text, entry: match.text }
      : { text: match.text, entry: match.text, reading: match.reading })
    cursor = end
    plainStart = end
  }
  if (plainStart < text.length) segments.push({ text: text.slice(plainStart) })
  return segments
}

/** 読みを（）で添えた文字列。 */
export function meaningWithReadings(value) {
  return meaningSegments(value)
    .map((segment) => (segment.reading ? `${segment.text}（${segment.reading}）` : segment.text))
    .join('')
}
