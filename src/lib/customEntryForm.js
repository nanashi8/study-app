// 自作カードの登録欄の中身。どのテンプレートでも同じ1つの入れ物を使い、テンプレートを切り替えても
// 同じ意味の欄（用語・単語＝表、意味・答え＝裏、例文、例文の訳、解説・メモ、品詞）は中身を引き継ぐ。
// 保存するときに、英単語は自作単語（lib/customWords.js）、ほかはカード（lib/customCards.js）の形へ直す。
import { CUSTOM_WORD_POS, DEFAULT_CUSTOM_WORD } from './customWords.js'
import { ENGLISH_TEMPLATE_ID, templateFor } from './customCards.js'

const POS_LABEL_BY_ID = Object.fromEntries(CUSTOM_WORD_POS.map((pos) => [pos.id, pos.label]))
const POS_ID_BY_TEXT = Object.fromEntries(CUSTOM_WORD_POS.flatMap((pos) => [[pos.id, pos.id], [pos.label, pos.id]]))

/** 空の登録欄。 */
export function emptyEntryValues() {
  return {
    front: '',
    back: '',
    reading: '',
    kanji: '',
    // 英単語以外のテンプレートの品詞（自由に書く）と、英単語の品詞（選ぶ）。
    pos: '',
    posId: DEFAULT_CUSTOM_WORD.pos,
    example: '',
    exampleTranslation: '',
    note: '',
    level: DEFAULT_CUSTOM_WORD.level,
    field: DEFAULT_CUSTOM_WORD.field,
    phonetic: '',
    otherSenses: [],
    derivatives: [],
    synonyms: [],
    antonyms: [],
    confusables: [],
    phrases: [],
    etymology: '',
  }
}

/** 登録済みの英単語のカードから、登録欄の中身へ。 */
export function entryValuesFromWord(word) {
  return {
    ...emptyEntryValues(),
    front: word.word,
    back: word.meanings.join('・'),
    posId: word.pos,
    pos: POS_LABEL_BY_ID[word.pos] ?? '',
    level: word.level,
    field: word.field,
    phonetic: word.phonetic,
    example: word.example?.en ?? '',
    exampleTranslation: word.example?.ja ?? '',
    note: word.note,
    otherSenses: word.otherSenses.map((sense) => ({ ...sense })),
    derivatives: word.derivatives.map((pair) => ({ ...pair })),
    synonyms: word.synonyms.map((pair) => ({ ...pair })),
    antonyms: word.antonyms.map((pair) => ({ ...pair })),
    confusables: word.confusables.map((pair) => ({ ...pair })),
    phrases: word.phrases.map((phrase) => ({ ...phrase })),
    etymology: word.etymology,
  }
}

/** 登録済みのカード（英単語以外）から、登録欄の中身へ。 */
export function entryValuesFromCard(card) {
  return {
    ...emptyEntryValues(),
    front: card.front,
    back: card.back,
    reading: card.reading,
    kanji: card.kanji,
    pos: card.pos,
    posId: POS_ID_BY_TEXT[card.pos] ?? DEFAULT_CUSTOM_WORD.pos,
    example: card.example,
    exampleTranslation: card.exampleTranslation,
    note: card.note,
  }
}

/**
 * テンプレートを切り替えたときの中身。同じ意味の欄は引き継ぐ。
 * 英単語の品詞（選ぶ）と、ほかのテンプレートの品詞（書く）は、名前が合えば互いに写す。
 */
export function carryEntryValues(values, fromTemplate, toTemplate) {
  if (fromTemplate === toTemplate) return values
  const next = { ...values }
  if (toTemplate === ENGLISH_TEMPLATE_ID && POS_ID_BY_TEXT[values.pos]) next.posId = POS_ID_BY_TEXT[values.pos]
  if (fromTemplate === ENGLISH_TEMPLATE_ID && !values.pos) next.pos = POS_LABEL_BY_ID[values.posId] ?? ''
  return next
}

/** 英単語の登録で、1つ以上の欄が書いてある行だけを残す（語と意味の組・品詞と意味・熟語と意味）。 */
const filledRows = (rows, keys) => (Array.isArray(rows) ? rows : [])
  .filter((row) => keys.some((key) => String(row?.[key] ?? '').trim()))

/** 英単語のカードとして保存する形（lib/customWords.js の upsertCustomWord に渡す）。 */
export function customWordInput(values, category) {
  return {
    word: values.front,
    meanings: values.back,
    pos: values.posId,
    level: values.level,
    field: values.field,
    phonetic: values.phonetic,
    example: { en: values.example, ja: values.exampleTranslation },
    note: values.note,
    category,
    otherSenses: filledRows(values.otherSenses, ['meaning']),
    derivatives: filledRows(values.derivatives, ['w']),
    synonyms: filledRows(values.synonyms, ['w']),
    antonyms: filledRows(values.antonyms, ['w']),
    confusables: filledRows(values.confusables, ['w']),
    phrases: filledRows(values.phrases, ['phrase']),
    etymology: values.etymology,
  }
}

/** 英単語以外のカードとして保存する形（lib/customCards.js の upsertCustomCard に渡す）。テンプレートにない欄は入れない。 */
export function customCardInput(template, values, category) {
  const input = { template, category }
  for (const item of templateFor(template).fields) input[item.key] = values[item.key] ?? ''
  return input
}

/** 保存できるか（テンプレートの必須の欄がそろっているか）。足りない欄の名前を返す。 */
export function missingEntryFields(template, values) {
  if (template === ENGLISH_TEMPLATE_ID) {
    return [
      ...(String(values.front ?? '').trim() ? [] : ['単語']),
      ...(String(values.back ?? '').trim() ? [] : ['意味']),
    ]
  }
  return templateFor(template).fields
    .filter((item) => item.required && !String(values[item.key] ?? '').trim())
    .map((item) => item.label)
}
