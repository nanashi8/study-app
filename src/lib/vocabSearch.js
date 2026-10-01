import { vocabFieldFor } from '../data/vocab.js'
import { syntaxFamilySearchText } from '../data/syntax-families.js'
import { idiomFormSearchText } from '../data/idiom-form-families.js'
import { curriculum1900PhraseAliasesFor } from '../data/curriculum-1900-resolutions.js'

const normalize = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

export function normalizeVocabQuery(value) {
  return normalize(value)
}

function usageGuideText(guides = []) {
  return guides.flatMap((guide) => [
    guide.title,
    guide.summary,
    ...guide.choices.flatMap((choice) => [
      choice.term,
      choice.rule,
      choice.example,
      choice.ja,
    ]),
    guide.preferred?.avoid,
    guide.preferred?.use,
    guide.preferred?.reason,
  ]).filter(Boolean).join(' ')
}

// 検索は1文字打つたびに全見出し（単語＋熟語・構文で約1万件）を走査する。
// 例文や語源までつないだ検索用テキストは語ごとに一度だけ作って使い回す。
const SEARCH_TEXT_CACHE = new WeakMap()

const cachedSearchText = (item, build) => {
  const cached = SEARCH_TEXT_CACHE.get(item)
  if (cached !== undefined) return cached
  const text = build()
  SEARCH_TEXT_CACHE.set(item, text)
  return text
}

export function vocabSearchText(word) {
  return cachedSearchText(word, () => normalize([
    word.meaning,
    ...(word.meanings ?? []),
    vocabFieldFor(word),
    word.field,
    word.usage,
    word.example?.en,
    word.example?.ja,
    ...(word.synonyms ?? []).flatMap((item) => [item.w, item.m]),
    ...(word.antonyms ?? []).flatMap((item) => [item.w, item.m]),
    ...(word.family ?? []).flatMap((item) => [item.w, item.m]),
    usageGuideText(word.usageGuides),
    // 疑問詞・関係詞の語は、働きの名前（関係代名詞など）・意味・形・解説からも引ける。
    ...(word.grammarRoles ?? []).flatMap((item) => [item.role, item.meaning, item.form, item.explain, item.example?.en, item.example?.ja]),
    // ほかの意味の例文も、代表義の例文と同じく例文などの一致で引ける。
    ...(word.otherSenses ?? []).flatMap((sense) => [sense.example?.en, sense.example?.ja]),
  ].filter(Boolean).join(' ')))
}

// ほかの意味（right の「権利」など）で当たった語の順位。ほかの意味はその語の意味そのものなので、
// 例文・使い方などにたまたま出てくる一致（4）より上に置く。ただ代表義はカードで最初に学ぶ意味で、
// 検索結果の行にも代表義が出るので、代表義で当たった語（3）の次にする。
export const OTHER_SENSE_RANK = 3.5

/**
 * 見出し語・代表義・ほかの意味だけで見た一致の強さ（小さいほど上位、当たらなければ -1）。
 * 例文などは見ないので、自作カードの英単語の検索にもそのまま使える。
 */
export function vocabMeaningMatchRank(word, rawQuery) {
  const query = normalize(rawQuery)
  if (!query) return -1

  const headword = normalize(word.word)
  if (headword === query) return 0
  if (headword.startsWith(query)) return 1
  if (headword.includes(query)) return 2

  const meanings = normalize([word.meaning, ...(word.meanings ?? [])].join(' '))
  if (meanings.includes(query)) return 3
  if ((word.otherSenses ?? []).some((sense) => normalize(sense.meaning).includes(query))) return OTHER_SENSE_RANK
  return -1
}

// 小さいほど上位。見出し語一致を守りつつ、語法・例文・使い分けも検索対象にする。
export function vocabMatchRank(word, rawQuery) {
  const rank = vocabMeaningMatchRank(word, rawQuery)
  if (rank >= 0) return rank
  const query = normalize(rawQuery)
  if (query && vocabSearchText(word).includes(query)) return 4
  return -1
}

/**
 * ほかの意味で当たったときの、その意味（最初に当たったもの）。見出し語か代表義で当たるときは null。
 * 検索結果の行は代表義しか見せないので、なぜ出たかが分かるよう、当たったほかの意味を添える。
 */
export function matchedOtherSense(word, rawQuery) {
  if (vocabMeaningMatchRank(word, rawQuery) !== OTHER_SENSE_RANK) return null
  const query = normalize(rawQuery)
  return (word.otherSenses ?? []).find((sense) => normalize(sense.meaning).includes(query)) ?? null
}

// ── 熟語・構文（PHRASES）の検索 ─────────────────────────────
// 単語と同じく「見出し一致 → 意味 → 例文・成り立ち・注意」の順で並べる。
export function phraseSearchText(phrase) {
  return cachedSearchText(phrase, () => normalize([
    phrase.meaning,
    ...(phrase.meanings ?? []),
    phrase.example?.en,
    phrase.example?.ja,
    phrase.origin,
    phrase.note,
    ...(phrase.aliases ?? []),
    ...curriculum1900PhraseAliasesFor(phrase.phrase),
    phrase.kind === 'syntax' ? syntaxFamilySearchText(phrase) : '',
    phrase.kind === 'idiom' ? idiomFormSearchText(phrase) : '',
  ].filter(Boolean).join(' ')))
}

export function phraseMatchRank(phrase, rawQuery) {
  const query = normalize(rawQuery)
  if (!query) return -1

  // 「〜」「to do」などの記号は打ちにくいので、比較用に緩めた形も見る。
  const head = normalize(phrase.phrase)
  const loose = head.replace(/[~〜…]/g, ' ').replace(/\s+/g, ' ').trim()
  const aliases = [...(phrase.aliases ?? []), ...curriculum1900PhraseAliasesFor(phrase.phrase)]
    .map((alias) => normalize(alias))
  if (head === query || loose === query || aliases.includes(query)) return 0
  if (head.startsWith(query) || loose.startsWith(query) || aliases.some((alias) => alias.startsWith(query))) return 1
  if (head.includes(query) || loose.includes(query) || aliases.some((alias) => alias.includes(query))) return 2

  const meanings = normalize([phrase.meaning, ...(phrase.meanings ?? [])].join(' '))
  if (meanings.includes(query)) return 3
  if (phraseSearchText(phrase).includes(query)) return 4
  return -1
}
