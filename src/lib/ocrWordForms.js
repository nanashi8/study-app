// 写真の文字の読み取り（vocabOcr.js・ocrPhrases.js）で、変化形から元の見出し語を引くための表。
// 動詞の3単現・過去形・過去分詞・ing形、名詞の複数形、形容詞・副詞の比較級・最上級を、見出し語ごとにつづりの決まりで作り、
// 不規則な形は台帳（phrase-irregular-links.js の IRREGULAR_WORD_FORMS・duplicate-forms.js の IRREGULAR_PLURALS）と下の表から足す。
// 全見出し語の変化形が元の語へ戻ることは tests/ocr-forms-phrases.test.mjs が確かめる。
import { IRREGULAR_WORD_FORMS } from '../data/phrase-irregular-links.js'
import { IRREGULAR_PLURALS } from '../data/duplicate-forms.js'

// IRREGULAR_WORD_FORMS にない不規則な形（見出し語の id ごと）。IRREGULAR_WORD_FORMS は熟語を語につなぐ台帳で、
// 足すと熟語の候補が増えて1件ずつ読み直すことになるので、読み取りだけで使う形はここに書く。
export const OCR_IRREGULAR_FORMS = Object.freeze({
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'],
  have: ['has', 'had', 'having'],
  do: ['does', 'did', 'done', 'doing'],
  go: ['goes', 'went', 'gone'],
  make: ['made'],
  take: ['took', 'taken'],
  come: ['came'],
  see: ['saw', 'seen'],
  give: ['gave', 'given'],
  write: ['wrote', 'written'],
  speak: ['spoke', 'spoken'],
  teach: ['taught'],
  think: ['thought'],
  know: ['knew', 'known'],
  leave: ['left'],
  keep: ['kept'],
  hear: ['heard'],
  meet: ['met'],
  pay: ['paid'],
  say: ['said'],
  tell: ['told'],
  lay: ['laid'],
  lie_2: ['lying'],
  ring_2: ['rang', 'rung'],
  wind_2: ['wound'],
  bear_2: ['bore', 'borne', 'born'],
  awaken: ['awoke', 'awoken'],
  run: ['ran'],
  sit: ['sat'],
  sleep: ['slept'],
  stand: ['stood'],
  understand: ['understood'],
  win: ['won'],
  lose: ['lost'],
  sell: ['sold'],
  child: ['children'],
  person: ['people'],
  man: ['men'],
  woman: ['women'],
  good: ['better', 'best'],
  well: ['better', 'best'],
  bad: ['worse', 'worst'],
  ill: ['worse', 'worst'],
  far: ['farther', 'farthest', 'further', 'furthest'],
  little: ['less', 'least'],
  many: ['more', 'most'],
  much: ['more', 'most'],
  old: ['elder', 'eldest'],
  late: ['latter', 'last'],
})

// 前に付いても変化が元の動詞と同じになる部分（undergo → underwent、withdraw → withdrew、overcome → overcame）。
const VERB_PREFIXES = ['under', 'over', 'with', 'out', 'up', 'mis', 're', 'fore', 'be', 'for', 'un', 'in']

const VOWELS = 'aeiou'
const isConsonant = (ch) => Boolean(ch) && !VOWELS.includes(ch)
const syllables = (word) => (word.match(/[aeiouy]+/g) ?? []).length
// 子音・母音1つ・子音で終わる（stop・admit・travel）。w・x・y で終わる語は重ねない。
// qu の u は子音として数える（quit → quitting）。
const endsCvc = (word) => /(?:^|[^aeiou]|qu)[aeiou][^aeiouwxy]$/.test(word)

function doubled(word) {
  return `${word}${word.at(-1)}`
}

// 語尾を重ねる形（stopped）と重ねない形（visited）。1音節は重ね、2音節以上はどちらの書き方もある（admitted・visited）。
function cvcStems(word) {
  if (!endsCvc(word)) return [word]
  return syllables(word) === 1 ? [doubled(word)] : [word, doubled(word)]
}

export function verbForms(word) {
  const forms = new Set()
  const last = word.at(-1)
  const prev = word.at(-2)
  // 3単現
  if (/(s|x|z|ch|sh|o)$/.test(word)) forms.add(`${word}es`)
  else if (last === 'y' && isConsonant(prev)) forms.add(`${word.slice(0, -1)}ies`)
  else forms.add(`${word}s`)
  // 過去形・過去分詞
  if (last === 'e') forms.add(`${word}d`)
  else if (last === 'y' && isConsonant(prev)) forms.add(`${word.slice(0, -1)}ied`)
  else if (/[aeiou]c$/.test(word)) forms.add(`${word}ked`)
  else for (const stem of cvcStems(word)) forms.add(`${stem}ed`)
  // ing形
  if (word.endsWith('ie')) forms.add(`${word.slice(0, -2)}ying`)
  else if (last === 'e' && !/(ee|ye|oe)$/.test(word) && word.length > 2) forms.add(`${word.slice(0, -1)}ing`)
  else if (/[aeiou]c$/.test(word)) forms.add(`${word}king`)
  else for (const stem of cvcStems(word)) forms.add(`${stem}ing`)
  if (last === 'e' && /(ee|ye|oe)$/.test(word)) forms.add(`${word}ing`)
  return forms
}

export function nounForms(word) {
  const forms = new Set()
  const last = word.at(-1)
  const prev = word.at(-2)
  if (/[aeiou]z$/.test(word)) forms.add(`${word}zes`)
  if (/(s|x|z|ch|sh)$/.test(word)) forms.add(`${word}es`)
  else if (last === 'y' && isConsonant(prev)) forms.add(`${word.slice(0, -1)}ies`)
  else {
    forms.add(`${word}s`)
    if (last === 'o') forms.add(`${word}es`)
    if (last === 'f') forms.add(`${word.slice(0, -1)}ves`)
    if (word.endsWith('fe')) forms.add(`${word.slice(0, -2)}ves`)
  }
  if (/(sis)$/.test(word)) forms.add(`${word.slice(0, -2)}es`)
  if (word.length >= 5) {
    // ラテン語・ギリシャ語の複数形（medium → media・stimulus → stimuli・phenomenon → phenomena）。
    if (/um$/.test(word)) forms.add(`${word.slice(0, -2)}a`)
    if (/us$/.test(word)) forms.add(`${word.slice(0, -2)}i`)
    if (/on$/.test(word)) forms.add(`${word.slice(0, -2)}a`)
  }
  if (/a$/.test(word)) forms.add(`${word}e`)
  if (/[ei]x$/.test(word)) forms.add(`${word.slice(0, -2)}ices`)
  if (/man$/.test(word)) forms.add(`${word.slice(0, -3)}men`)
  return forms
}

export function comparativeForms(word) {
  const forms = new Set()
  const last = word.at(-1)
  const prev = word.at(-2)
  if (last === 'e') {
    forms.add(`${word}r`)
    forms.add(`${word}st`)
  } else if (last === 'y' && (isConsonant(prev) || word.endsWith('ey'))) {
    // pricey → priciest も y を i にする。
    const stem = word.endsWith('ey') ? word.slice(0, -2) : word.slice(0, -1)
    forms.add(`${stem}ier`)
    forms.add(`${stem}iest`)
    if (word.endsWith('ey')) {
      forms.add(`${word.slice(0, -1)}ier`)
      forms.add(`${word.slice(0, -1)}iest`)
    }
  } else {
    const stem = endsCvc(word) && syllables(word) === 1 ? doubled(word) : word
    forms.add(`${stem}er`)
    forms.add(`${stem}est`)
  }
  return forms
}

// 変化形を作らない品詞（代名詞・前置詞・接続詞）。I の変化形に見える is、us の used を拾わない。
const UNINFLECTED_POS = new Set(['代', '前', '接'])

const regularFormsByPos = (word, pos) => {
  if (pos === '動') return verbForms(word)
  if (pos === '名') return nounForms(word)
  if (pos === '形' || pos === '副') return comparativeForms(word)
  return new Set()
}

/** 見出し語の不規則な変化形（台帳と OCR_IRREGULAR_FORMS、前に付いた形 undergo → underwent をふくむ）。 */
function irregularFormsOf(word, irregularById, irregularVerbByHead) {
  const forms = new Set(irregularById.get(word.id) ?? [])
  if (word.pos === '動' && !forms.size) {
    for (const prefix of VERB_PREFIXES) {
      if (!word.word.startsWith(prefix) || word.word.length - prefix.length < 2) continue
      const rest = word.word.slice(prefix.length)
      for (const form of irregularVerbByHead.get(rest) ?? []) forms.add(`${prefix}${form}`)
    }
  }
  return forms
}

const cache = new WeakMap()

/**
 * 見出し語の並び words から、変化形 → 元の語 の表を作る（同じ words には1度だけ）。
 *   basesOf(form)  [{ word, kind }]。kind は 'irregular'（不規則な形）・'strict'（その語の品詞の変化形）・
 *                  'loose'（名詞・形容詞を動詞として使ったときの形。planned → plan）。不規則・動詞・そのほかの順
 *   formsOf(head)  見出し語のつづり head の変化形の Set（irregular と strict。同じつづりの語をまとめて）
 *   formsOfWord(id) 見出し語 id の変化形の Set（irregular と strict）
 *   allFormsOf(head) loose もふくむ変化形
 *   phraseFormsOf(head) 熟語の語に当てる変化形（loose をふくみ、比較級・最上級を除く。result in の resulted、many times に more を当てない）
 *   pluralsOf(head)  名詞の複数形
 *   isHeadword(head)  そのつづりの見出し語があるか
 *   isVerb(head)・isNoun(head)  そのつづりに動詞・名詞の見出し語があるか
 */
export function wordFormIndex(words) {
  const cached = cache.get(words)
  if (cached) return cached

  // 同じつづりの別の語（bear クマ／bear_2 耐える）も、それぞれの品詞で変化形を作る。
  const entries = words.filter((word) => word?.id && /^[a-z]+$/.test(String(word.word ?? '')))
  const byId = new Map(entries.map((word) => [word.id, word]))
  const irregularById = new Map()
  const addIrregular = (id, form) => {
    if (!byId.has(id)) return
    if (!irregularById.has(id)) irregularById.set(id, new Set())
    irregularById.get(id).add(form)
  }
  for (const [id, forms] of Object.entries(IRREGULAR_WORD_FORMS)) for (const form of forms) addIrregular(id, form)
  for (const [id, forms] of Object.entries(OCR_IRREGULAR_FORMS)) for (const form of forms) addIrregular(id, form)
  for (const [plural, singular] of Object.entries(IRREGULAR_PLURALS)) {
    const noun = entries.find((word) => word.word === singular && word.pos === '名') ?? entries.find((word) => word.word === singular)
    if (noun) addIrregular(noun.id, plural)
  }
  const irregularVerbByHead = new Map()
  for (const [id, forms] of irregularById) {
    const word = byId.get(id)
    if (word.pos === '動' && !irregularVerbByHead.has(word.word)) irregularVerbByHead.set(word.word, forms)
  }

  const RANK = { irregular: 0, strict: 1, loose: 2 }
  const byForm = new Map()
  const byHead = new Map()
  const byWordId = new Map()
  const looseByHead = new Map()
  const phraseByHead = new Map()
  const pluralByHead = new Map()
  const addPlural = (word, form) => {
    if (!pluralByHead.has(word.word)) pluralByHead.set(word.word, new Set())
    pluralByHead.get(word.word).add(form)
  }
  const add = (form, word, kind, comparative = false) => {
    if (!/^[a-z]+$/.test(form) || form === word.word) return
    if (!comparative) {
      if (!phraseByHead.has(word.word)) phraseByHead.set(word.word, new Set())
      phraseByHead.get(word.word).add(form)
    }
    const list = byForm.get(form) ?? []
    const existing = list.find((entry) => entry.word === word)
    if (existing) {
      if (RANK[kind] < RANK[existing.kind]) existing.kind = kind
    } else {
      list.push({ word, kind })
      byForm.set(form, list)
    }
    if (!looseByHead.has(word.word)) looseByHead.set(word.word, new Set())
    looseByHead.get(word.word).add(form)
    if (kind !== 'loose') {
      if (!byHead.has(word.word)) byHead.set(word.word, new Set())
      byHead.get(word.word).add(form)
      if (!byWordId.has(word.id)) byWordId.set(word.id, new Set())
      byWordId.get(word.id).add(form)
    }
  }
  for (const word of entries) {
    // 1文字の語（a・i）は変化形を作らない（as を a の複数形にしない）。
    if (UNINFLECTED_POS.has(word.pos) || word.word.length < 2) continue
    const graded = word.pos === '形' || word.pos === '副'
    for (const form of irregularFormsOf(word, irregularById, irregularVerbByHead)) add(form, word, 'irregular', graded)
    // 規則の形は不規則な動詞にも作る（learn → learned・learnt、goed のような実在しない形は読み取りに出てこない）。
    for (const form of regularFormsByPos(word.word, word.pos)) add(form, word, 'strict', graded)
    if (word.pos === '名') {
      for (const form of nounForms(word.word)) addPlural(word, form)
      for (const form of irregularById.get(word.id) ?? []) addPlural(word, form)
    }
    if (word.pos === '名' || word.pos === '形') {
      for (const form of verbForms(word.word)) add(form, word, 'loose')
    }
  }
  const headSet = new Set(entries.map((word) => word.word))
  const verbHeads = new Set(entries.filter((word) => word.pos === '動').map((word) => word.word))
  const nounHeads = new Set(entries.filter((word) => word.pos === '名').map((word) => word.word))
  for (const list of byForm.values()) {
    list.sort((a, b) => RANK[a.kind] - RANK[b.kind] || (a.word.pos === '動' ? 0 : 1) - (b.word.pos === '動' ? 0 : 1))
  }

  const index = {
    basesOf: (form) => byForm.get(form) ?? [],
    formsOf: (head) => byHead.get(head) ?? new Set(),
    formsOfWord: (id) => byWordId.get(id) ?? new Set(),
    allFormsOf: (head) => looseByHead.get(head) ?? new Set(),
    phraseFormsOf: (head) => phraseByHead.get(head) ?? new Set(),
    pluralsOf: (head) => pluralByHead.get(head) ?? new Set(),
    isHeadword: (head) => headSet.has(head),
    isVerb: (head) => verbHeads.has(head),
    isNoun: (head) => nounHeads.has(head),
  }
  cache.set(words, index)
  return index
}
