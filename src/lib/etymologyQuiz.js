import { ETYMOLOGY_PACKS, getWord } from '../data/vocab.js'
import { QUIZ_CHOICE_COUNT } from './quizChoices.js'

// 語源そのもののテスト。出題も選択肢も、手動確認済みカードの
// 「語根の形・語根の意味・紐づく確認済み単語」だけから作る。
// 単語データ側の未承認な自由記述の語源メモは、ここでは一切参照しない。

export const ETYMOLOGY_QUIZ_FORMATS = Object.freeze([
  Object.freeze({ id: 'meaning', label: '語根から意味', prompt: 'この語根が表す意味は？' }),
  Object.freeze({ id: 'form', label: '意味から語根', prompt: 'この意味を表す語根は？' }),
  Object.freeze({ id: 'word', label: '単語から語根', prompt: 'この単語に入っている語根は？' }),
])

const FORMAT_BY_ID = Object.fromEntries(ETYMOLOGY_QUIZ_FORMATS.map((format) => [format.id, format]))

// 同じカードはいつ解いても同じ問題にする。復習のたびに形式が変わると
// 「覚えたか」ではなく「当てられたか」の記録になるため、IDから決める。
function hashText(text = '') {
  let hash = 2166136261
  const value = String(text)
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const meaningLabel = (card) => card?.rootMeaning ?? ''
const formLabel = (card) => card?.rootForm ?? ''
const labelFor = (formatId) => (formatId === 'meaning' ? meaningLabel : formLabel)

const rootFormVariants = (card) => new Set(
  String(card?.rootForm ?? '').split('/').map((form) => form.trim().toLowerCase()).filter(Boolean),
)

export function etymologyQuizExampleFor(card) {
  const ids = card?.exampleIds?.length ? card.exampleIds : card?.coverageIds ?? []
  const words = ids.map(getWord).filter(Boolean)
  if (!words.length) return null
  // 語根そのものと同じ綴りの語（script / part など）は、問題として成り立たない。
  const forms = rootFormVariants(card)
  const usable = words.filter((word) => !forms.has(word.word.toLowerCase()))
  const pool = usable.length ? usable : words
  return pool[hashText(`etymology-example:${card.id}`) % pool.length]
}

export function etymologyQuizFormatFor(card) {
  if (!card) return ETYMOLOGY_QUIZ_FORMATS[0]
  // 例語を出せないカードでは「単語から語根」を作れない。
  const usable = etymologyQuizExampleFor(card)
    ? ETYMOLOGY_QUIZ_FORMATS
    : ETYMOLOGY_QUIZ_FORMATS.filter((format) => format.id !== 'word')
  return usable[hashText(`etymology-format:${card.id}`) % usable.length]
}

// 誤答は別の語源カードから取る。意味が同じ語根（serv と servire など）は
// 見分けようがないので、正解や既出と同じ表示になる候補は外す。
function pickDistractors(card, cards, label, count, { excludeWordId = null } = {}) {
  const answerLabel = label(card)
  const seen = new Set([answerLabel])
  const answerForms = rootFormVariants(card)
  const pool = []
  for (const other of cards) {
    if (other.id === card.id) continue
    // 例語が誤答カードにも紐づいていると、正解が2つある問題になる。
    if (excludeWordId && other.coverageIds?.includes(excludeWordId)) continue
    // 同じ綴りを含む語根（cur / curr など）は、どちらも正解に見えてしまう。
    if ([...rootFormVariants(other)].some((form) => answerForms.has(form))) continue
    const value = label(other)
    if (!value || seen.has(value)) continue
    seen.add(value)
    pool.push(other)
  }
  return pool
    .map((other) => ({ other, rank: hashText(`etymology-distractor:${card.id}:${other.id}`) }))
    .sort((left, right) => left.rank - right.rank || left.other.id.localeCompare(right.other.id))
    .slice(0, count)
    .map(({ other }) => other)
}

export function buildEtymologyQuizQuestion(card, cards = ETYMOLOGY_PACKS) {
  if (!card) throw new Error('unknown: 出題する語源カードがありません。')
  const format = etymologyQuizFormatFor(card)
  const label = labelFor(format.id)
  const example = format.id === 'word' ? etymologyQuizExampleFor(card) : null
  const distractors = pickDistractors(card, cards, label, QUIZ_CHOICE_COUNT - 1, {
    excludeWordId: example?.id ?? null,
  })
  if (!distractors.length) throw new Error(`${card.id}: 誤答を作れる語源カードがありません。`)

  return {
    cardId: card.id,
    format: format.id,
    formatLabel: format.label,
    prompt: format.prompt,
    cue: format.id === 'form'
      ? card.rootMeaning
      : format.id === 'word'
        ? example.word
        : card.rootForm,
    cueNote: format.id === 'word' ? (example.meanings?.[0] ?? example.meaning ?? '') : '',
    exampleWordId: example?.id ?? null,
    answerId: card.id,
    answerLabel: label(card),
    options: [card, ...distractors].map((option) => ({ id: option.id, label: label(option) })),
    explanation: format.id === 'word'
      ? `${example.word} は ${card.rootForm}（${card.rootMeaning}）を含む語です。${card.rootOrigin}にさかのぼります。`
      : `${card.rootForm} ＝ ${card.rootMeaning}。${card.rootOrigin}にさかのぼります。`,
  }
}

export const buildAllEtymologyQuizQuestions = (cards = ETYMOLOGY_PACKS) =>
  cards.map((card) => buildEtymologyQuizQuestion(card, cards))

export const etymologyQuizFormatLabel = (formatId) => FORMAT_BY_ID[formatId]?.label ?? '語源'
