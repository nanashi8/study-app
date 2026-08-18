// ── その単語を含む熟語・構文 ────────────────────────────────────────
// 単語カードから「その語が実際にどう使われるか」へ一度でつながるように、
// 見出し語をそのまま含む熟語・構文を全部集める。
//   go   → go abroad / go ahead / go on …
//   take → take care of / take part in …
// 語形が変わって使われる語（be composed of の compose）も拾えるよう、
// 規則的な変化形（-s / -ed / -ing …）まで見る。
import { PHRASES } from '../data/phrases.js'

const LEVEL_RANK = { 5: 0, 4: 1, 3: 2, pre2: 3, 2: 4, pre1: 5, 1: 6 }

// 冠詞は熟語の中で数合わせに出てくるだけで、「a を含む熟語」として
// take a bath や go for a walk を並べても覚える助けにならないので対象外。
// 前置詞・副詞（at / out / up …）は熟語の意味そのものなので対象に残す。
const ARTICLES = new Set(['a', 'an', 'the'])

// 見出しを単語の並びに分ける。「〜」「…」やハイフンは区切りとして扱う。
export function phraseTokens(phrase = '') {
  return String(phrase)
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[’]/g, "'")
    .replace(/[~〜…—–-]/g, ' ')
    .replace(/[^a-z' ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

/** 規則的な語形変化。実際に熟語側へ出てくる形だけを作る。 */
export function inflectedForms(rawWord = '') {
  const word = String(rawWord).toLowerCase().normalize('NFKC').trim()
  if (!/^[a-z][a-z']*$/.test(word)) return []
  const forms = new Set([word])
  const last = word.at(-1)
  const prev = word.at(-2)
  const vowels = 'aeiou'

  forms.add(`${word}s`)
  forms.add(`${word}ed`)
  forms.add(`${word}ing`)
  if (/(s|x|z|ch|sh|o)$/.test(word)) forms.add(`${word}es`)
  if (last === 'e') {
    const stem = word.slice(0, -1)
    forms.add(`${word}d`)
    forms.add(`${stem}ing`)
  }
  if (last === 'y' && prev && !vowels.includes(prev)) {
    const stem = word.slice(0, -1)
    forms.add(`${stem}ies`)
    forms.add(`${stem}ied`)
  }
  // stop → stopping / stopped（短い語で子音が重なる形）
  if (word.length <= 5 && last && !vowels.includes(last) && prev && vowels.includes(prev)) {
    forms.add(`${word}${last}ing`)
    forms.add(`${word}${last}ed`)
  }
  return [...forms]
}

// 文法から自動生成した構文カードは見出しが例文そのもの（1文まるごと）で、
// 「その語を含む熟語」として並べると読み手の助けにならないので外す。
const isHeadwordPhrase = (phrase) => phrase.category !== 'grammar-example'

// トークン → その語を含む熟語・構文（読み込み時に一度だけ作る）
const PHRASES_BY_TOKEN = new Map()
for (const phrase of PHRASES.filter(isHeadwordPhrase)) {
  for (const token of new Set(phraseTokens(phrase.phrase))) {
    if (!PHRASES_BY_TOKEN.has(token)) PHRASES_BY_TOKEN.set(token, [])
    PHRASES_BY_TOKEN.get(token).push(phrase)
  }
}

const comparePhrases = (a, b) =>
  (LEVEL_RANK[a.level] ?? 99) - (LEVEL_RANK[b.level] ?? 99)
  || a.phrase.localeCompare(b.phrase, 'en')

/**
 * その単語を含む熟語・構文を全部返す。やさしい級から順に並べる。
 * word は単語オブジェクトでも文字列でもよい。
 */
export function phrasesForWord(word, { kind } = {}) {
  const head = typeof word === 'string' ? word : word?.word
  if (!head) return []
  if (ARTICLES.has(head.toLowerCase().trim())) return []
  const found = new Map()
  for (const form of inflectedForms(head)) {
    for (const phrase of PHRASES_BY_TOKEN.get(form) ?? []) {
      if (kind && phrase.kind !== kind) continue
      found.set(phrase.id, phrase)
    }
  }
  return [...found.values()].sort(comparePhrases)
}

/** 熟語だけ・構文だけに分けて返す（表示で見出しを分けるため）。 */
export function phraseGroupsForWord(word) {
  const all = phrasesForWord(word)
  return {
    all,
    idioms: all.filter((phrase) => phrase.kind === 'idiom'),
    syntax: all.filter((phrase) => phrase.kind === 'syntax'),
  }
}
