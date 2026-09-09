// 単語の級(level)が、ほかの教材と食い違っていないかを見る。
//
// 級は学習の順番そのもので、間違うと5級の学習者に準1級の語が出たり、
// 同じ語を二つの級で二度覚えさせたりする。人が一語ずつ決めた値なので
// 機械には「正しい級」は分からないが、**ほかの教材との食い違い**は分かる。
// ここでは偽陽性の出ない2つだけを見る。
import { ALL_WORDS } from '../src/data/vocab.js'
import { ALL_PASSAGES } from '../src/data/passages.js'
import { PHRASES } from '../src/data/phrases.js'
import { DICTATION_ITEMS } from '../src/data/dictation.js'
import { LISTENING_ITEMS } from '../src/data/listening.js'
import { CURRICULUM_1900_WORDS } from '../src/data/words-curriculum-1900.js'

const LEVELS = ['5', '4', '3', 'pre2', '2', 'pre1', '1']
const LABEL = { 5: '5級', 4: '4級', 3: '3級', pre2: '準2級', 2: '2級', pre1: '準1級', 1: '1級' }
const rank = (level) => LEVELS.indexOf(level)
const errors = []
const wordByHead = new Map(ALL_WORDS.map((word) => [word.word.toLowerCase(), word]))

// ① 英検1900語の収録リストが級を挙げている語は、その級で出す。
// 食い違うと、同じ語をカリキュラムでは4級、単語帳では3級として教えることになる。
for (const listed of CURRICULUM_1900_WORDS) {
  const card = ALL_WORDS.find((word) => word.id === listed.id)
  if (!card || card.level === listed.level) continue
  errors.push(
    `${listed.id}: 英検1900語リストは${LABEL[listed.level]}だがカードは${LABEL[card.level]}`
    + ' → levels-override.js をリストに合わせる',
  )
}

// ② その級より3段以上やさしい英文に同じ語が出ていたら、級が高すぎる。
// 例: typhoon を準1級にしたまま、4級の長文で "a strong typhoon" と読ませていた。
const EN_KEYS = new Set(['en', 'text', 'title', 'phrase', 'sentence', 'script', 'answer', 'body'])
const englishOf = (value, out = [], take = false) => {
  if (typeof value === 'string') {
    if (take && /[A-Za-z]/.test(value) && !/[ぁ-んァ-ヶ一-龠]/.test(value)) out.push(value)
  } else if (Array.isArray(value)) value.forEach((item) => englishOf(item, out, take))
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) englishOf(item, out, EN_KEYS.has(key))
  }
  return out
}
const easiest = new Map()
for (const source of [DICTATION_ITEMS, LISTENING_ITEMS, ALL_PASSAGES, PHRASES]) {
  for (const item of source) {
    if (!LEVELS.includes(item.level)) continue
    const at = rank(item.level)
    for (const token of new Set(englishOf(item).join(' ').toLowerCase().match(/[a-z']+/g) ?? [])) {
      const seen = easiest.get(token)
      if (seen === undefined || at < seen) easiest.set(token, at)
    }
  }
}
// 不規則変化のうち、別の見出し語と綴りがぶつかるもの。
const IRREGULAR = {
  see: ['saw', 'seen'], find: ['found'], lie: ['lay', 'lain'], lay: ['laid'],
  fall: ['fell', 'fallen'], feel: ['felt'], leave: ['left'], bear: ['bore', 'borne'],
  rise: ['rose'], wind: ['wound'], grind: ['ground'], sink: ['sank', 'sunk'],
  spring: ['sprang', 'sprung'], strike: ['struck'], bind: ['bound'], flee: ['fled'],
}
// 規則変化。子音を重ねるのは単音節の語だけ（rid → ridding。open は openning にならない）。
const inflections = (head) => {
  const word = head.toLowerCase()
  if (!/^[a-z]+$/.test(word)) return [word]
  const oneSyllable = (word.match(/[aeiou]+/g) ?? []).length === 1
  const doubled = oneSyllable && /[^aeiou][aeiou][^aeiouwxy]$/.test(word) ? word + word.slice(-1) : null
  return [...new Set([
    word,
    /(s|x|z|ch|sh)$/.test(word) ? `${word}es` : /[^aeiou]y$/.test(word) ? `${word.slice(0, -1)}ies` : `${word}s`,
    /e$/.test(word) ? `${word.slice(0, -1)}ing` : `${doubled ?? word}ing`,
    /e$/.test(word) ? `${word}d` : /[^aeiou]y$/.test(word) ? `${word.slice(0, -1)}ied` : `${doubled ?? word}ed`,
    ...(IRREGULAR[word] ?? []),
  ])]
}
// 別の見出し語の活用形と綴りが同じ語は、その語が出た証拠にならない。
// closing(結びの) は close の -ing、opening(開始) は open の -ing として現れる。
const isInflectionOfAnotherCard = (head) => {
  const word = head.toLowerCase()
  for (const [other, card] of wordByHead) {
    if (other === word) continue
    if (inflections(other).includes(word)) return true
  }
  return false
}
for (const word of ALL_WORDS) {
  if (isInflectionOfAnotherCard(word.word)) continue
  let found
  for (const form of inflections(word.word)) {
    const at = easiest.get(form)
    if (at !== undefined && (found === undefined || at < found)) found = at
  }
  if (found === undefined) continue
  const gap = rank(word.level) - found
  if (gap >= 3) {
    errors.push(
      `${word.id}: カードは${LABEL[word.level]}だが${LABEL[LEVELS[found]]}の英文に出ている(${gap}段)`
      + ' → levels-override.js で級を下げる',
    )
  }
}

if (errors.length) {
  console.error(`❌ 単語の級: ${errors.length}件の食い違い`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
const spread = LEVELS.map((level) => `${LABEL[level]}${ALL_WORDS.filter((word) => word.level === level).length}`)
console.log(`✅ 単語の級OK: ${ALL_WORDS.length}語（${spread.join(' / ')}）／1900語リストと一致・教材と3段以上の食い違いなし`)
