// 「教科書から単語追加」の読み取りの結果を、人が書き起こした正解と照らす（tests/vocab-ocr-*.test.mjs が使う）。
import { readFileSync } from 'node:fs'

import { ALL_WORDS } from '../src/data/vocab.js'
import { matchOcrTextToWords, ocrTokenConfidences } from '../src/lib/vocabOcr.js'

const JAPANESE = /[぀-ヿ㐀-鿿]/u
export const japaneseChars = (text) => [...String(text ?? '')].filter((ch) => JAPANESE.test(ch))

// 正解の日本語の字のうち、読み取った字に同じ順で現れた数（最長共通部分列）。
export function japaneseHits(expected, actual) {
  const a = japaneseChars(expected)
  const b = japaneseChars(actual)
  let previous = new Array(b.length + 1).fill(0)
  for (let i = 1; i <= a.length; i += 1) {
    const current = new Array(b.length + 1).fill(0)
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = a[i - 1] === b[j - 1] ? previous[j - 1] + 1 : Math.max(previous[j], current[j - 1])
    }
    previous = current
  }
  return { hits: previous[b.length], total: a.length, read: b.length }
}

// 試料の画像（tests/fixtures/vocab-ocr/samples.json）と実際の写真（photos.json）を、同じ形の正解にそろえる。
export function loadOcrTruth() {
  const fixtures = JSON.parse(readFileSync(new URL('./fixtures/vocab-ocr/samples.json', import.meta.url), 'utf8')).samples.map((sample) => {
    const text = sample.lines.map((line) => (line.cells ?? [line.text]).join(' ')).join('\n')
    return { id: sample.id, set: 'fixture', latin: [...text].filter((ch) => !JAPANESE.test(ch)).join(''), japanese: japaneseChars(text).length ? text : '' }
  })
  const photos = JSON.parse(readFileSync(new URL('./fixtures/vocab-ocr/photos.json', import.meta.url), 'utf8')).photos
    .map((photo) => ({ ...photo, set: 'photo' }))
  return [...fixtures, ...photos]
}

// 読み取った結果（text・words）から画面が出す語を作り、正解の文字から作った語と照らす。
//   found / expected   写真の辞書の語のうち、候補になった数 / 全部
//   selectedRight      最初から選んだ状態で出る、写真にある語の数
//   wrongSelected      最初から選んだ状態で出る、写真にない語（読み違い）
//   wrongFlagged       「不確か」「読み違いを直した」の印つきで出る、写真にない語
//   wrongRequests      辞書登録リクエストの候補に出る、写真にない語
export function scoreOcrResult(truth, result, { englishWords, contextReading }) {
  const match = matchOcrTextToWords(result.text, ALL_WORDS, {
    englishWords,
    confidences: ocrTokenConfidences(result.words),
    contextReading: contextReading?.(result.text) ?? null,
  })
  const expected = matchOcrTextToWords(truth.latin ?? '', ALL_WORDS, {
    englishWords,
    contextReading: contextReading?.(truth.latin ?? '') ?? null,
  })
  // a・I は1文字なので候補の語にならないが、くっついた語を分けると候補になる（A good → Agood → a・good）。
  const single = (truth.latin ?? '').match(/(?<![A-Za-z])[AaI](?![A-Za-z])/g) ?? []
  const expectedIds = new Set([...expected.candidates.map((item) => item.id), ...single.map((ch) => (ch.toLowerCase() === 'a' ? 'a' : 'i'))])
  const expectedRequests = new Set(expected.unmatched.map((item) => item.token))
  const actualIds = new Set(match.candidates.map((item) => item.id))
  const selected = (item) => !item.uncertain && !item.corrected
  const japanese = truth.japanese && !truth.vertical ? japaneseHits(truth.japanese, result.text) : null
  return {
    id: truth.id,
    set: truth.set,
    match,
    expected: expected.candidates.length,
    found: expected.candidates.filter((item) => actualIds.has(item.id)).length,
    missing: expected.candidates.filter((item) => !actualIds.has(item.id)).map((item) => item.headword),
    selectedRight: match.candidates.filter((item) => expectedIds.has(item.id) && selected(item)).length,
    wrongSelected: match.candidates.filter((item) => !expectedIds.has(item.id) && selected(item)).map((item) => `${item.headword}<${item.observed.join('/')}`),
    wrongFlagged: match.candidates.filter((item) => !expectedIds.has(item.id) && !selected(item)).map((item) => item.headword),
    wrongRequests: match.unmatched.filter((item) => !expectedRequests.has(item.token)).map((item) => item.token),
    japanese,
  }
}

export function sumScores(scores) {
  const total = { expected: 0, found: 0, selectedRight: 0, wrongSelected: 0, wrongFlagged: 0, wrongRequests: 0, japaneseHits: 0, japaneseTotal: 0, japaneseRead: 0 }
  for (const score of scores) {
    total.expected += score.expected
    total.found += score.found
    total.selectedRight += score.selectedRight
    total.wrongSelected += score.wrongSelected.length
    total.wrongFlagged += score.wrongFlagged.length
    total.wrongRequests += score.wrongRequests.length
    if (score.japanese) {
      total.japaneseHits += score.japanese.hits
      total.japaneseTotal += score.japanese.total
      total.japaneseRead += score.japanese.read
    }
  }
  return total
}
