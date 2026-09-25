#!/usr/bin/env node
// 例文が、カードで学ぶ意味で使われているかを確かめる（requests/2026-09-25-example-learned-sense.json）。
// preliminary「予備の・準備の」の例文が These are preliminary results.／「これらは暫定の結果だ。」で、
// 学習者には「暫定の」という、カードにない意味の例文に見えていた。
// 例文の和訳に、カードの意味の訳語（別の品詞の印 (名)(動)(形)(副) を付けた訳語は除く）が入っていれば、
// 学んだ意味で使われている例文として通す。入っていないものは1件ずつ読み、
//   ・別の意味で使っている例文 → 英文と和訳を書き直す
//   ・同じ意味を言い換えた和訳 → docs/audits/example-sense-review.json に「和訳の語=意味の訳語」を書く
// 見出し語・熟語・例文を足したり変えたりすると、読むまでこの確認は通らない。
import { readFileSync } from 'node:fs'
import { ALL_WORDS } from '../../src/data/vocab.js'
import { PHRASES } from '../../src/data/phrases.js'
import { splitMeanings } from '../../src/data/compact.js'

export const EXAMPLE_SENSE_REVIEW_PATH = new URL('../../docs/audits/example-sense-review.json', import.meta.url)

const OTHER_POS_MARK = /[（(](名|動|形|副)[）)]$/u
const HIRAGANA = /^[ぁ-ゟ]+$/u
const KANJI = /[一-鿿々]/u
const KANJI_RUN = /[一-鿿々]+/gu
const toHalfWidthDigits = (text) => String(text ?? '').replace(/[０-９]/gu, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xFEE0))
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')

// 訳語から、和訳に現れるはずの部分を取り出す。括弧の注記は外し、〜・…・—・A・B で区切る
// （「〜でない限り」→「でない限り」、「AだけでなくBも」→「だけでなく」「も」）。
const partsOf = (gloss) => toHalfWidthDigits(gloss)
  .replace(/[（(][^）)]*[）)]/gu, '')
  .split(/[〜～…—―]+|(?<![A-Za-z])[A-Z](?![A-Za-z])/u)
  .map((part) => part.replace(/\s+/gu, '').trim())
  .filter(Boolean)

// 活用で変わる語尾。落とした形（語幹）でも探す（「旅行する」→「旅行した」、「静かな」→「静かに」、「疲れた」→「疲れている」、「一般的な」→「一般常識」）。
const ENDINGS = ['させる', 'される', 'する', 'して', 'られる', 'れる', 'である', '的な', '的に', '的', '性', 'った', 'んで', 'いで', 'な', 'の', 'に', 'と', 'だ', 'た', 'て', 'い', 'う', 'く', 'ぐ', 'す', 'つ', 'ぬ', 'ぶ', 'む', 'る']
// かなだけの動詞は、語幹のあとに同じ行の活用のかなが続けば通す（「みなす」→「みなして」、「ためらう」→「ためらわず」）。
const VERB_ROWS = { う: 'わいうえおっ', く: 'かきくけこい', ぐ: 'がぎぐげごい', す: 'さしすせそ', つ: 'たちつてとっ', ぬ: 'なにぬねのん', ぶ: 'ばびぶべぼん', む: 'まみむめもん', る: 'らりるれろったてなまよず' }
const variantsOf = (part) => {
  const variants = [part]
  for (const ending of ENDINGS) {
    if (!part.endsWith(ending) || part.length <= ending.length) continue
    const stem = part.slice(0, -ending.length)
    // 漢字1字の語幹は、送りがなが続くときだけ（「見る」→「見た」は通し、「見物」は通さない）。
    if (stem.length === 1 && KANJI.test(stem)) variants.push(new RegExp(`${escape(stem)}[\\u3041-\\u309F]`, 'u'))
    else if (stem.length >= 2 && !HIRAGANA.test(stem)) variants.push(stem)
    else if (stem.length >= 3) variants.push(stem)
    else if (stem.length === 2 && VERB_ROWS[ending]) variants.push(new RegExp(`${escape(stem)}[${VERB_ROWS[ending]}]`, 'u'))
  }
  // 漢字が2字以上ある訳語は、漢字のかたまりが近くに同じ順で並べば通す（「気前のよい」→「気前がよい」、「目に見える」→「目に見えない」）。
  const runs = part.match(KANJI_RUN) ?? []
  if (runs.join('').length >= 2) variants.push(new RegExp(runs.map(escape).join('[\\u3041-\\u309F]{0,4}'), 'u'))
  return variants
}
const contains = (text, variant) => (typeof variant === 'string' ? text.includes(variant) : variant.test(text))

/** 訳語が和訳に現れているか（語尾の活用・漢字のかたまりまで見る）。 */
export function glossShownIn(gloss, ja) {
  const text = toHalfWidthDigits(ja)
  const parts = partsOf(gloss)
  if (!parts.length) return false
  // 「も」「の」だけのような、どこにでも出る部分しかない訳語では判定しない。
  if (!parts.some((part) => part.length >= 2 || KANJI.test(part) || /\d/u.test(part))) return false
  return parts.every((part) => variantsOf(part).some((variant) => contains(text, variant)))
}

/** 例文を持つ全項目（見出し語・ほかの意味・熟語・構文）。 */
export function exampleSenseItems() {
  const items = []
  for (const word of ALL_WORDS) {
    items.push({ key: `word:${word.id}`, head: word.word, level: word.level, pos: word.pos, meaning: word.meaning, glosses: splitMeanings(word.meaning), example: word.example })
    for (const sense of word.otherSenses ?? []) {
      if (!sense.example) continue
      items.push({ key: `sense:${word.id}:${sense.meaning}`, head: word.word, level: sense.level, pos: sense.pos, meaning: sense.meaning, glosses: splitMeanings(sense.meaning), example: sense.example })
    }
  }
  for (const phrase of PHRASES) {
    const glosses = phrase.meanings?.length ? phrase.meanings : splitMeanings(phrase.meaning)
    items.push({ key: `phrase:${phrase.id}`, head: phrase.phrase, level: phrase.level, pos: phrase.kind, meaning: glosses.join('・'), glosses, example: phrase.example })
  }
  return items
}

/** カードで学ぶ意味（別の品詞の印を付けた訳語を除く）。 */
export const learnedGlosses = (item) => item.glosses.filter((gloss) => !OTHER_POS_MARK.test(gloss))

/** 和訳に、学ぶ意味の訳語が入っていない項目。 */
export function exampleSenseCandidates(items = exampleSenseItems()) {
  return items.filter((item) => !learnedGlosses(item).some((gloss) => glossShownIn(gloss, item.example?.ja ?? '')))
}

const coreOf = (gloss) => gloss.replace(/[（(][^）)]*[）)]/gu, '').trim()

/** 台帳の「和訳の語=意味の訳語」が、その項目の和訳と意味に合っているか。合わなければ理由を返す。 */
export function reviewEntryProblem(item, entry) {
  const match = /^([^=]+)=(.+)$/u.exec(String(entry ?? ''))
  if (!match) return '「和訳の語=意味の訳語」の形になっていない'
  const [, shown, gloss] = match
  if (!String(item.example?.ja ?? '').includes(shown)) return `和訳に「${shown}」がない`
  const glosses = learnedGlosses(item)
  if (!glosses.includes(gloss) && !glosses.map(coreOf).includes(gloss)) return `「${gloss}」がカードの意味にない`
  return ''
}

export function exampleSenseGap() {
  const ledger = JSON.parse(readFileSync(EXAMPLE_SENSE_REVIEW_PATH, 'utf8'))
  const reviewed = ledger.reviewed ?? {}
  const items = exampleSenseItems()
  const candidates = exampleSenseCandidates(items)
  const candidateKeys = new Set(candidates.map((item) => item.key))
  return {
    items: items.length,
    candidates: candidates.length,
    reviewed: candidates.filter((item) => reviewed[item.key]).length,
    undecided: candidates.filter((item) => !reviewed[item.key]).map((item) => item.key),
    stale: Object.keys(reviewed).filter((key) => !candidateKeys.has(key)),
    wrong: candidates
      .filter((item) => reviewed[item.key])
      .map((item) => [item.key, reviewEntryProblem(item, reviewed[item.key])])
      .filter(([, problem]) => problem)
      .map(([key, problem]) => `${key}: ${problem}`),
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--list')) {
    const ledger = JSON.parse(readFileSync(EXAMPLE_SENSE_REVIEW_PATH, 'utf8'))
    const onlyUndecided = process.argv.includes('--undecided')
    for (const item of exampleSenseCandidates()) {
      if (onlyUndecided && ledger.reviewed?.[item.key]) continue
      console.log([item.key, item.meaning, item.example?.en, item.example?.ja, item.level, item.pos].join('\t'))
    }
    process.exit(0)
  }
  const gap = exampleSenseGap()
  console.log(`例文が学ぶ意味で使われているか: 例文 ${gap.items} 件のうち和訳に意味の訳語がない ${gap.candidates} 件（読んだもの ${gap.reviewed}・未読 ${gap.undecided.length}・拾われなくなった台帳の行 ${gap.stale.length}・合わない行 ${gap.wrong.length}）`)
  for (const key of gap.undecided.slice(0, 30)) console.log(`  未読: ${key}`)
  for (const key of gap.stale.slice(0, 30)) console.log(`  拾われなくなった: ${key}`)
  for (const line of gap.wrong.slice(0, 30)) console.log(`  合わない: ${line}`)
  process.exit(gap.undecided.length || gap.stale.length || gap.wrong.length ? 1 : 0)
}
