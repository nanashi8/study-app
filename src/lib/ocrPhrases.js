// 写真の文字の読み取りで、文の中に出てくる熟語・構文（phrases.js）を見つける。
// 見出しの書き方を、文の語の並びに当てる型に直して照らす。
//   語            その語と変化形（took part in の took・resulted in の resulted。ocrWordForms.js の表）。
//                 is・has は be・have のどの形でも、can・will・may・shall は could・would・might・should でもよい
//   a・an・the    2語目からは、なくても、ほかの限定詞（my・this・every など）でもよく、後ろに形容詞などが2語まで入ってよい
//                 （make a difficult decision・meet local needs・keep your promises）
//   最初の be     なくてもよい（a train bound for・was found guilty of・stay true to）
//   one's・~'s    my・your・his・her・its・our・their と、語の 's（Tom's）
//   oneself       myself・yourself・himself・herself・itself・ourselves・yourselves・themselves
//   one（2語目から）  I・you・he・she・we・they・one（before I knew it・as fast as I could）
//   ~・...・A・B・S V・— など  1〜5語（見出しの最初と最後の空きは照らさない）
//   doing・~ing   -ing の1語。2語目からの do は1語（to do・had better do）
//   比較級         比較級の1語（-er・more・less など）と、その後の4語まで（The more you read, the …）
//   x / y・(x)    どちらか（両側が2語以上なら別の見出しとして）・あってもなくてもよい
// 動詞で始まる見出しは、動詞のすぐ後に目的語が3語まで入ってよい（turn it off・help me with・tell me the truth）。
// not は語の間に入ってよい（cannot afford to）。語を間に入れて当てた熟語は、最初は選ばない。
// 語が1つしかない見出し（show A B・〜 ago）は熟語として照らさない（その語は単語の候補に出る）。
// 文法の例文カード（grammar-example）は見出しが例文そのものなので照らさない。
// 全件を、その熟語の例文と、空きを埋めて先頭の動詞を過去形にした文で tests/ocr-forms-phrases.test.mjs が確かめる。
import { nounForms, verbForms, wordFormIndex } from './ocrWordForms.js'

const BE_FORMS = ['be', 'am', 'is', 'are', 'was', 'were', 'been', 'being', "'s", "'re", "'m"]
const HAVE_FORMS = ['have', 'has', 'had', 'having', "'ve", "'d"]
const MODALS = { can: 'could', will: 'would', may: 'might', shall: 'should' }
const ARTICLES = new Set(['a', 'an', 'the'])
const DETERMINERS = new Set([
  'a', 'an', 'the', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those',
  'some', 'any', 'no', 'every', 'each', 'another', 'much', 'more', 'enough', "'s",
])
const POSSESSIVES = new Set(['my', 'your', 'his', 'her', 'its', 'our', 'their', "one's"])
const REFLEXIVES = new Set(['myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves', 'oneself'])
const PRONOUNS = new Set(['i', 'you', 'he', 'she', 'we', 'they', 'one', 'it'])
const COMPARATIVES = new Set(['more', 'less', 'better', 'worse', 'fewer', 'further', 'farther', 'later', 'sooner', 'rather'])
const GAP_MARKS = new Set(['~', '〜', '...', '…', '—', '–'])
const PLACEHOLDER_LETTERS = new Set(['A', 'B', 'C', 'D', 'S', 'V'])
const PEOPLE_THINGS = new Set(['someone', 'somebody', 'something', 'sb', 'sth'])
const NOT_INSERTED = new Set(['and', 'or', 'but', 'to', 'that', 'than', 'because', 'if', 'when', 'while'])
const MAX_GAP = 5
const OBJECT_GAP = 3
const MODIFIER_GAP = 2
const COMPARATIVE_TAIL = 4

// 縮めた形を、見出しと文で同じ語の並びにする（I'm → i 'm、don't → do not、can't・cannot → can not）。
function expandContraction(token) {
  if (token === "can't" || token === 'cannot') return ['can', 'not']
  if (token === "won't") return ['will', 'not']
  if (token === "shan't") return ['shall', 'not']
  if (token.endsWith("n't")) return [token.slice(0, -3), 'not']
  for (const suffix of ["'m", "'re", "'s", "'ve", "'ll", "'d"]) {
    if (token.endsWith(suffix) && token.length > suffix.length) return [token.slice(0, -suffix.length), suffix]
  }
  return [token]
}

const normalizeQuote = (value) => String(value ?? '').normalize('NFKC').replace(/[’‘`]/g, "'")

/** 文を語に分ける。語の間に文の区切り（. ? ! や日本語の字）があれば、別の文として seg を進める。 */
export function phraseTextTokens(text) {
  const source = normalizeQuote(text)
  const tokens = []
  let seg = 0
  let last = 0
  for (const match of source.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)*/g)) {
    const between = source.slice(last, match.index)
    if (/[.!?。！？「」『』（）()぀-ヿ㐀-鿿]/.test(between)) seg += 1
    last = match.index + match[0].length
    for (const norm of expandContraction(match[0].toLowerCase())) {
      tokens.push({ norm, seg, start: match.index, end: last })
    }
  }
  return tokens
}

function headTokens(head) {
  return normalizeQuote(head)
    .replace(/(?<=[A-Za-z'])[.,?!;:]+/g, ' ')
    .replace(/(?<=[^\s.…])[,;:?!]+(?=\s|$)/g, ' ')
    .replace(/(?<=\.\.\.|…)[,;:]/g, '')
    .replace(/(?<=\s|^)[?!]+(?=\s|$)/g, ' ')
    .replace(/\(([^)]+)\)/g, ' ($1) ')
    .split(/\s+/)
    .filter(Boolean)
}

// x / y の両側が2語以上なら別の見出し（sort of / kind of）、そうでなければ1語の言いかえ（there is / are ~）。
function headVariants(head) {
  const sides = String(head).split(/\s+\/\s+/)
  if (sides.length > 1 && sides.every((side) => side.trim().split(/\s+/).filter((t) => /[a-z]/i.test(t)).length >= 2)) {
    return sides
  }
  return [head]
}

function wordElement(lower, forms) {
  const set = new Set([lower])
  const plurals = new Set()
  // 見出しの語が変化形のとき（before one knows it の knows）は、元の語の形もすべて。
  // 見出し語そのもの（as・willing）は元の語を引かない（as を a の複数形、willing を will の ing 形にしない）。
  // ing 形の語（be going to の going）はその形だけ。見出しの語が動詞の変化形のときだけ元の動詞を引く（lots of の lots から lot を引かない）。
  const ingForm = !forms.isHeadword(lower) && /ing$/.test(lower)
  const bases = forms.isHeadword(lower) || ingForm ? []
    : forms.basesOf(lower).filter((entry) => entry.word.pos === '動').map((entry) => entry.word.word)
  const heads = ARTICLES.has(lower) || ingForm ? [] : [lower, ...bases]
  if (lower === 'a' || lower === 'an') set.add('a').add('an')
  for (const head of heads) {
    const all = forms.phraseFormsOf(head)
    // 辞書の見出し語にない語（culminate・taper）は、つづりの決まりで動詞・名詞の形を作る。
    for (const form of all.size ? all : new Set([...verbForms(head), ...nounForms(head)])) set.add(form)
    set.add(head)
    for (const form of forms.pluralsOf(head)) plurals.add(form)
  }
  if (lower === 'be' || BE_FORMS.includes(lower)) for (const form of BE_FORMS) set.add(form)
  if (HAVE_FORMS.includes(lower)) for (const form of HAVE_FORMS) set.add(form)
  if (MODALS[lower]) set.add(MODALS[lower])
  return {
    type: 'word',
    set,
    head: lower,
    verb: heads.some((head) => forms.isVerb(head)) || set.has('be') || HAVE_FORMS.includes(lower),
    noun: heads.some((head) => forms.isNoun(head)),
    plurals: [...plurals].filter((form) => form !== lower),
  }
}

/**
 * 熟語の見出しを、照らす型（要素の並び）にする。照らせない見出しは { skip: 理由 }。
 *   { type: 'word', set }  { type: 'det' }（なくてもよい限定詞）  { type: 'poss' }  { type: 'refl' }  { type: 'pron' }
 *   { type: 'ing' }  { type: 'any' }  { type: 'comp' }  { type: 'gap', min, max, or? }  { type: 'opt', set }
 *   before：その要素の前に入ってよい語の数
 */
export function compilePhrasePattern(head, forms, { category } = {}) {
  const raw = headTokens(head)
  let elements = []
  for (let i = 0; i < raw.length; i += 1) {
    const token = raw[i]
    if (token === '/') continue
    if (raw[i + 1] === '/' && raw[i + 2] && elements.length) {
      const options = [token, raw[i + 2]].flatMap((item) => expandContraction(item.toLowerCase()))
      const set = new Set(options.flatMap((item) => [...wordElement(item, forms).set]))
      elements.push({ type: 'word', set, head: options.join('/') })
      i += 2
      continue
    }
    const optional = /^\(.+\)$/.test(token)
    const bare = optional ? token.slice(1, -1) : token
    if (PLACEHOLDER_LETTERS.has(bare)) {
      elements.push({ type: 'gap', min: 1, max: MAX_GAP })
      continue
    }
    const lower = bare.toLowerCase()
    if (lower === '比較級') {
      elements.push({ type: 'comp' })
      continue
    }
    if (GAP_MARKS.has(lower) || /^[.…~〜—–,;:]+$/.test(lower)) {
      elements.push({ type: 'gap', min: 1, max: MAX_GAP })
      continue
    }
    if (/^[~〜]'s$/.test(lower) || lower === "one's") {
      elements.push({ type: 'poss' })
      continue
    }
    if (lower === 'oneself') {
      elements.push({ type: 'refl' })
      continue
    }
    if (lower === 'one' && elements.length) {
      elements.push({ type: 'pron' })
      continue
    }
    if (lower === 'doing' || /^[~〜]ing$/.test(lower)) {
      elements.push({ type: 'ing' })
      continue
    }
    if (lower === 'do' && elements.length) {
      elements.push({ type: 'any' })
      continue
    }
    if (PEOPLE_THINGS.has(lower) && elements.length && i < raw.length - 1) {
      // 見出しの途中の someone・something は、その語のほか、人・物を表す1〜5語にも当てる。
      elements.push({ type: 'gap', min: 1, max: MAX_GAP, or: lower })
      continue
    }
    if (ARTICLES.has(lower) && elements.length && !optional) {
      elements.push({ type: 'det', head: lower })
      continue
    }
    if (!/^'?[a-z]+(?:'[a-z]+)*$/.test(lower)) {
      // vis-à-vis のような、アルファベットだけの語にならない見出しの語
      elements.push({ type: 'foreign', head: lower })
      continue
    }
    for (const part of expandContraction(lower)) {
      const element = wordElement(part, forms)
      elements.push(optional ? { ...element, type: 'opt' } : element)
    }
  }
  if (elements.some((element) => element.type === 'foreign')) {
    return { skip: 'アルファベットだけの語にならない見出し（vis-à-vis。読み取りの語はアルファベットだけ）' }
  }
  // 最初と最後の空き（〜・A など）は照らさない（as soon as 〜 は as soon as を見る）。最後の doing・do・比較級は照らす（enjoy doing）。
  const edgeGap = (element) => element.type === 'gap' || element.type === 'opt' || element.type === 'det'
  let leadingGap = false
  while (elements.length && (edgeGap(elements[0]) || elements[0].type === 'any' || elements[0].type === 'ing')) {
    elements.shift()
    leadingGap = true
  }
  let trailingDet = null
  while (elements.length && edgeGap(elements.at(-1))) {
    const popped = elements.pop()
    if (popped.type === 'det' && !elements.some((element) => element.type === 'det')) trailingDet = popped
  }
  const countWords = (list) => list.filter((element) => element.type === 'word').length
  // 最初の be は、なくてもよい（be bound for → bound for）。残りの語が2つ以上のときだけ。
  const leadingBe = elements[0]?.type === 'word' && elements[0].head === 'be'
  if (leadingBe && countWords(elements.slice(1)) >= 2) elements = elements.slice(1)
  // such a 〜・many a・What a 〜 ! は、最後の a も語として照らす。
  if (trailingDet && countWords(elements) < 2) elements.push(wordElement(trailingDet.head, forms))
  const words = countWords(elements)
  const fixed = elements.filter((element) => ['poss', 'refl', 'ing', 'any', 'comp', 'pron'].includes(element.type)).length
  if (!words || words + fixed < 2) return { skip: '語が1つだけの見出し（その語は単語の候補に出る）' }

  // 名詞の複数形は、限定詞・所有格・動詞の後（keep your promises・wash one's hands）と、動詞にもなる最初の語のときだけ当てる
  // （kind of に kinds of を当てない）。
  elements = elements.map((element, i) => {
    if (element.type !== 'word' || !element.plurals?.length) return element
    const previous = elements[i - 1]
    const objectPlace = previous && (previous.type === 'det' || previous.type === 'poss' || (previous.type === 'word' && previous.verb))
    // 最初の語は動詞の3単現にもなる（accounts for・stems from）。ただし of が続けば名詞（kind of・part of）。
    const verbPlace = i === 0 && elements[1]?.head !== 'of'
    if (objectPlace || verbPlace) return element
    const set = new Set(element.set)
    for (const form of element.plurals) set.delete(form)
    return { ...element, set }
  })
  // 句動詞・連語の最初の語は動詞として扱う（set back の set は辞書では名詞の見出し）。
  if ((category === 'phrasal-verb' || category === 'collocation') && elements[0].type === 'word') elements[0] = { ...elements[0], verb: true }
  // 入ってよい語の数。
  elements = elements.map((element, i) => {
    const previous = elements[i - 1]
    let before = 0
    // 動詞の後の目的語（turn it off・help me with・It says on the sign that）。be・have は目的語をとる動詞として扱わない。
    if (previous?.type === 'word' && previous.verb && !previous.set.has('be') && !HAVE_FORMS.includes(previous.head) && element.type !== 'det') {
      before = OBJECT_GAP
    }
    // 句動詞の副詞の後の目的語（pass off copied work as）。
    if (category === 'phrasal-verb' && i >= 2) before = Math.max(before, OBJECT_GAP)
    if (previous?.type === 'det') before = Math.max(before, MODIFIER_GAP)
    // 最後の名詞の前の形容詞（of great importance・put on a little weight）。
    if (i === elements.length - 1 && i >= 1 && element.type === 'word' && element.noun) before = Math.max(before, MODIFIER_GAP)
    return before ? { ...element, before } : element
  })
  // 語（one's・oneself をふくむ）が1つだけで、あとは空き（will do・go ~ing）の見出しは、どの文にも当たりやすいので最初は選ばない。
  // 最初の空きを外して2語だけ残った見出し（... to go）も同じ。
  // 空き（〜・A・...）をはさむ見出し（as ... as・what ... is・not A but B）も、どの文にも当たりやすいので最初は選ばない。
  const named = words + elements.filter((element) => ['poss', 'refl', 'pron'].includes(element.type)).length
  const weak = named < 2 || (leadingGap && named <= 2) || elements.some((element) => element.type === 'gap' || element.type === 'any')
  return { elements, weak, crossSentence: /[.?!]\s+\S/.test(head.trim()), category }
}

function matchesElement(element, token) {
  if (!token) return false
  switch (element.type) {
    case 'word':
    case 'opt':
      return element.set.has(token.norm)
    case 'det':
      return DETERMINERS.has(token.norm) || POSSESSIVES.has(token.norm)
    case 'poss':
      return POSSESSIVES.has(token.norm) || token.norm === "'s"
    case 'refl':
      return REFLEXIVES.has(token.norm)
    case 'pron':
      return PRONOUNS.has(token.norm)
    case 'ing':
      return /ing$/.test(token.norm) && token.norm.length > 4
    case 'comp':
      return COMPARATIVES.has(token.norm) || /[a-z]{2,}er$/.test(token.norm)
    case 'any':
      return true
    default:
      return false
  }
}

// 要素 at から、語 pos 以降に当てる。当たれば { end, loose }、当たらなければ null。空き・入る語は少ない方から試す。
function matchFrom(pattern, at, tokens, pos, seg, loose) {
  const { elements } = pattern
  if (at === elements.length) return { end: pos, loose }
  const element = elements[at]
  const same = (token) => Boolean(token) && (pattern.crossSentence || token.seg === seg)
  const next = (to, extra = false) => matchFrom(pattern, at + 1, tokens, to, seg, loose || extra)

  const here = (p, inserted) => {
    const token = tokens[p]
    if (element.type === 'opt' || element.type === 'det') {
      if (same(token) && matchesElement(element, token)) {
        const result = next(p + 1, inserted || (element.type === 'det' && token.norm !== element.head && !(element.head !== 'the' && (token.norm === 'a' || token.norm === 'an'))))
        if (result) return result
      }
      return next(p, inserted || element.type === 'det')
    }
    if (element.type === 'gap') {
      if (element.or && same(token) && token.norm === element.or) {
        const result = next(p + 1, inserted)
        if (result) return result
      }
      for (let size = element.min; size <= element.max; size += 1) {
        if (!same(tokens[p + size - 1])) break
        const result = next(p + size, inserted)
        if (result) return result
      }
      return null
    }
    if (!same(token) || !matchesElement(element, token)) return null
    if (element.type === 'comp') {
      for (let size = 0; size <= COMPARATIVE_TAIL; size += 1) {
        if (size && !same(tokens[p + size])) break
        const result = next(p + 1 + size, inserted)
        if (result) return result
      }
      return null
    }
    return next(p + 1, inserted)
  }

  const maxBefore = element.before ?? 0
  for (let skip = 0; skip <= maxBefore; skip += 1) {
    // 間に入る語は、目的語・形容詞になる語だけ（and・or・but・to をまたがない）。
    if (skip && (!same(tokens[pos + skip - 1]) || NOT_INSERTED.has(tokens[pos + skip - 1].norm))) break
    const result = here(pos + skip, skip > 0)
    if (result) return result
  }
  // not は語の間に入ってよい（cannot afford to → can not afford to）。
  if (tokens[pos]?.norm === 'not' && same(tokens[pos]) && !(element.set?.has('not'))) {
    return matchFrom(pattern, at, tokens, pos + 1, seg, true)
  }
  return null
}

const compiledCache = new WeakMap()

/** 熟語の並びと見出し語の並びから、照らす型の一覧を作る（同じ組には1度だけ）。skipped は照らさない見出しと理由。 */
export function phrasePatterns(phrases, words) {
  let byWords = compiledCache.get(phrases)
  if (!byWords) {
    byWords = new WeakMap()
    compiledCache.set(phrases, byWords)
  }
  const cached = byWords.get(words)
  if (cached) return cached
  const forms = wordFormIndex(words)
  const patterns = []
  const skipped = []
  const byFirst = new Map()
  for (const phrase of phrases) {
    if (phrase.category === 'grammar-example' || !phrase.phrase) continue
    const compiledAll = headVariants(phrase.phrase).map((head) => compilePhrasePattern(head, forms, { category: phrase.category }))
    const usable = compiledAll.filter((compiled) => !compiled.skip)
    if (!usable.length) {
      skipped.push({ phrase, reason: compiledAll[0].skip })
      continue
    }
    for (const compiled of usable) {
      const pattern = { phrase, ...compiled }
      patterns.push(pattern)
      const first = compiled.elements[0]
      const keys = first.type === 'poss' ? [...POSSESSIVES, "'s"]
        : first.type === 'refl' ? [...REFLEXIVES]
          : first.type === 'pron' ? [...PRONOUNS]
            : first.type === 'comp' ? null
              : [...first.set]
      for (const key of keys ?? ['*comp']) {
        if (!byFirst.has(key)) byFirst.set(key, [])
        byFirst.get(key).push(pattern)
      }
    }
  }
  const result = { patterns, skipped, byFirst }
  byWords.set(words, result)
  return result
}

/**
 * 文 text に出てくる熟語・構文。
 *   options.confidences  vocabOcr.js の ocrTokenConfidences の結果。熟語の語のどれかが不確かなら uncertain
 * 戻り値 [{ id, phrase, meaning, level, occurrences, observed, uncertain, loose, suggested }]。
 * suggested（最初に選ぶ）は、語を間に入れずに当たり、ほかの熟語の中に入っていない並び（not at all の中の at all は選ばない）が
 * 1回でもあり、読み取りが確かなもの。
 */
export function matchOcrTextToPhrases(text, phrases, words, options = {}) {
  const { byFirst } = phrasePatterns(phrases, words)
  const confidences = options.confidences ?? new Map()
  const lowConfidence = options.lowConfidence ?? 90
  const tokens = phraseTextTokens(text)
  const source = normalizeQuote(text)
  const hits = []
  const tryPattern = (pattern, i) => {
    if (!matchesElement(pattern.elements[0], tokens[i])) return
    const result = matchFrom(pattern, 1, tokens, i + 1, tokens[i].seg, false)
    if (!result) return
    // 同じ熟語の同じ所は1回に数える（見出しの言いかえが2つとも当たったとき）。
    const loose = result.loose || pattern.weak
    const same = hits.find((hit) => hit.pattern.phrase.id === pattern.phrase.id && hit.from === i)
    if (same) {
      same.loose &&= loose
      same.to = Math.max(same.to, result.end)
    } else hits.push({ pattern, from: i, to: result.end, loose })
  }
  for (let i = 0; i < tokens.length; i += 1) {
    for (const pattern of byFirst.get(tokens[i].norm) ?? []) tryPattern(pattern, i)
    for (const pattern of byFirst.get('*comp') ?? []) tryPattern(pattern, i)
  }
  const found = new Map()
  for (const hit of hits) {
    const inside = hits.some((other) => other.pattern.phrase.id !== hit.pattern.phrase.id && other.from <= hit.from && other.to >= hit.to && other.to - other.from > hit.to - hit.from)
    const surface = source.slice(tokens[hit.from].start, tokens[hit.to - 1].end).replace(/\s+/g, ' ')
    const uncertain = tokens.slice(hit.from, hit.to).some((token) => {
      const confidence = confidences.get(token.norm)
      return confidence != null && confidence < lowConfidence
    })
    const { phrase } = hit.pattern
    const current = found.get(phrase.id) ?? {
      id: phrase.id,
      phrase: phrase.phrase,
      meaning: phrase.meaning,
      level: phrase.level,
      occurrences: 0,
      observed: [],
      uncertain: true,
      loose: true,
      suggested: false,
    }
    current.occurrences += 1
    current.uncertain &&= uncertain
    current.loose &&= hit.loose
    current.suggested ||= !inside && !uncertain && !hit.loose
    if (!current.observed.includes(surface)) current.observed.push(surface)
    found.set(phrase.id, current)
  }
  return [...found.values()]
}
