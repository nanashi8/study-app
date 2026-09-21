// ── その単語を含む熟語・構文 ────────────────────────────────────────
// 単語カードから「その語が実際にどう使われるか」へ一度でつながるように、
// 見出し語をそのまま含む熟語・構文を全部集める。
//   go   → go abroad / go ahead / go on …
//   take → take care of / take part in …
// 語形が変わって使われる語（be composed of の compose）も拾えるよう、
// 規則的な変化形（-s / -ed / -ing …）まで見る。
// 不規則な形（there is の is、be made of の made）でしか現れない熟語・構文は、
// 1件ずつ読んだ台帳（phrase-irregular-links.js）でつなぐと決めたものだけを足す。
// ほかの品詞の形を使う熟語・構文（decide に対する make a decision）は、形ごとに分けて返す。
import { PHRASES } from '../data/phrases.js'
import { HOMOGRAPH_WORDS } from '../data/homograph-words.js'
import { IRREGULAR_PLURALS } from '../data/duplicate-forms.js'
import { IRREGULAR_PHRASE_LINKS, IRREGULAR_WORD_FORMS } from '../data/phrase-irregular-links.js'
import { getWord } from '../data/vocab.js'
import { wordFormOwnNote, wordFormsFor } from './wordRelations.js'

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

// 同じつづりの別の語（homograph-words.js）は、つづりでは元の語と区別できない。
// その語の意味で使う熟語は人が phraseIds に書いてあるので、それだけをその語のものとして扱う。
const HOMOGRAPH_PHRASE_IDS = new Map(
  HOMOGRAPH_WORDS.map((word) => [word.id, new Set(word.phraseIds ?? [])]),
)
const PHRASE_IDS_OWNED_BY_HOMOGRAPHS = new Map()
for (const word of HOMOGRAPH_WORDS) {
  if (!PHRASE_IDS_OWNED_BY_HOMOGRAPHS.has(word.word)) PHRASE_IDS_OWNED_BY_HOMOGRAPHS.set(word.word, new Set())
  for (const phraseId of word.phraseIds ?? []) PHRASE_IDS_OWNED_BY_HOMOGRAPHS.get(word.word).add(phraseId)
}

const comparePhrases = (a, b) =>
  (LEVEL_RANK[a.level] ?? 99) - (LEVEL_RANK[b.level] ?? 99)
  || a.phrase.localeCompare(b.phrase, 'en')

// 規則的な変化形の見出しで拾える熟語・構文。
function regularPhrasesForWord(word, { kind } = {}) {
  const head = typeof word === 'string' ? word : word?.word
  if (!head) return []
  if (ARTICLES.has(head.toLowerCase().trim())) return []
  // 同じつづりの別の語のカードには、その語の意味で使う熟語だけを出す。元の語のカードからは外す。
  const homographPhraseIds = typeof word === 'string' ? null : HOMOGRAPH_PHRASE_IDS.get(word?.id)
  const ownedByHomographs = PHRASE_IDS_OWNED_BY_HOMOGRAPHS.get(head.toLowerCase().trim())
  const found = new Map()
  for (const form of inflectedForms(head)) {
    for (const phrase of PHRASES_BY_TOKEN.get(form) ?? []) {
      if (kind && phrase.kind !== kind) continue
      if (homographPhraseIds ? !homographPhraseIds.has(phrase.id) : ownedByHomographs?.has(phrase.id)) continue
      found.set(phrase.id, phrase)
    }
  }
  return [...found.values()]
}

/**
 * 規則の変化形では作れない形。台帳に書いた不規則な過去形・過去分詞（go → went・gone）、
 * 子音字を重ねる長い語（commit → committed）、-ie → -ying（die → dying）、不規則な複数形（tooth → teeth）。
 */
export function irregularFormsForWord(word) {
  const base = String(word?.word ?? '').toLowerCase()
  if (!word?.id || !/^[a-z]+$/.test(base)) return []
  const forms = new Set(IRREGULAR_WORD_FORMS[word.id] ?? [])
  if (word.pos === '動') {
    if (base.endsWith('ie')) forms.add(`${base.slice(0, -2)}ying`)
    const doubled = base.match(/[^aeiou][aeiou]([bdglmnprt])$/)
    if (doubled && base.length > 5) {
      forms.add(`${base}${doubled[1]}ed`)
      forms.add(`${base}${doubled[1]}ing`)
    }
    if (/[aeiou]c$/.test(base)) {
      forms.add(`${base}ked`)
      forms.add(`${base}king`)
    }
  }
  if (word.pos === '名') {
    for (const [plural, singular] of Object.entries(IRREGULAR_PLURALS)) if (singular === base) forms.add(plural)
  }
  const regular = new Set(inflectedForms(base))
  return [...forms].filter((form) => !regular.has(form))
}

/** 不規則な形でしか現れない熟語・構文の候補。台帳（phrase-irregular-links.js）で1件ずつ、つなぐかどうかを決める。 */
export function irregularPhraseCandidates(word) {
  if (!word?.id || word.custom) return []
  const regular = new Set(regularPhrasesForWord(word).map((phrase) => phrase.id))
  const found = new Map()
  for (const form of irregularFormsForWord(word)) {
    for (const phrase of PHRASES_BY_TOKEN.get(form) ?? []) {
      if (!regular.has(phrase.id)) found.set(phrase.id, phrase)
    }
  }
  return [...found.values()]
}

/**
 * その単語を含む熟語・構文を全部返す。やさしい級から順に並べる。
 * word は単語オブジェクトでも文字列でもよい。
 */
export function phrasesForWord(word, { kind } = {}) {
  const found = regularPhrasesForWord(word, { kind })
  if (typeof word !== 'string') {
    for (const phrase of irregularPhraseCandidates(word)) {
      if (kind && phrase.kind !== kind) continue
      if (IRREGULAR_PHRASE_LINKS[`${word.id}|${phrase.id}`] === true) found.push(phrase)
    }
  }
  return found.sort(comparePhrases)
}

const FORM_POS_RANK = { 動: 0, 名: 1, 形: 2, 副: 3 }

/**
 * form が word から作られた形か。つづりが長い形（decide → decision）、同じ長さなら
 * 動詞 → 名詞 → 形容詞 → 副詞の順で後ろの品詞（good → well）を、作られた形とみなす。
 * 作られた形の熟語だけを元の語に出し、逆向き（being のカードに be の熟語を全部）は出さない。
 */
export function isDerivedForm(word, form) {
  const base = String(word?.word ?? '')
  const other = String(form?.word ?? '')
  if (other.length !== base.length) return other.length > base.length
  return (FORM_POS_RANK[form.pos] ?? -1) > (FORM_POS_RANK[word.pos] ?? 99)
}

/**
 * form を使う熟語・構文を word のカードに出すか。word から作られた、品詞のちがう形（isDerivedForm）で、
 * どちらも意味がずれた形でないときだけ（クマの bear に born の be born、committee に committed の
 * be committed to を出さない）。意味がずれた形や同じ品詞の形（sensible と sensitive）の熟語は、
 * その形の見出し語のカードで引ける。
 */
export function sharesFormPhrases(word, form) {
  if (!form || form.pos === word?.pos) return false
  if (wordFormOwnNote(word) || form.formNote) return false
  return isDerivedForm(word, form)
}

/**
 * ほかの品詞の形を使う熟語・構文（decide に対する make a decision）を、形ごとにまとめて返す。
 * その語を含む熟語・構文と、前の形で出した熟語・構文は重ねない。
 */
export function formPhraseGroupsForWord(word) {
  if (!word?.id || word.custom) return []
  const shown = new Set(phrasesForWord(word).map((phrase) => phrase.id))
  const groups = []
  for (const form of wordFormsFor(word)) {
    if (!sharesFormPhrases(word, form)) continue
    const target = form.extra ? form.word : getWord(form.id)
    const phrases = phrasesForWord(target).filter((phrase) => !shown.has(phrase.id))
    if (!phrases.length) continue
    for (const phrase of phrases) shown.add(phrase.id)
    groups.push({ form, phrases })
  }
  return groups
}

/** 熟語だけ・構文だけに分けて返す（表示で見出しを分けるため）。ほかの品詞の形を使う熟語・構文も添える。 */
export function phraseGroupsForWord(word) {
  const all = phrasesForWord(word)
  return {
    all,
    idioms: all.filter((phrase) => phrase.kind === 'idiom'),
    syntax: all.filter((phrase) => phrase.kind === 'syntax'),
    viaForms: typeof word === 'string' ? [] : formPhraseGroupsForWord(word),
  }
}
