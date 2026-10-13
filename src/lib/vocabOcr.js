const IRREGULAR_BASES = {
  am: 'be',
  are: 'be',
  is: 'be',
  was: 'be',
  were: 'be',
  been: 'be',
  did: 'do',
  done: 'do',
  went: 'go',
  gone: 'go',
  had: 'have',
  made: 'make',
  took: 'take',
  taken: 'take',
  came: 'come',
  saw: 'see',
  seen: 'see',
  gave: 'give',
  given: 'give',
  wrote: 'write',
  written: 'write',
  spoke: 'speak',
  spoken: 'speak',
  bought: 'buy',
  brought: 'bring',
  taught: 'teach',
  thought: 'think',
  caught: 'catch',
  found: 'find',
  knew: 'know',
  known: 'know',
  got: 'get',
  gotten: 'get',
  left: 'leave',
  felt: 'feel',
  kept: 'keep',
  held: 'hold',
  heard: 'hear',
  met: 'meet',
  paid: 'pay',
  sent: 'send',
  built: 'build',
  became: 'become',
  began: 'begin',
  begun: 'begin',
  broke: 'break',
  broken: 'break',
  chose: 'choose',
  chosen: 'choose',
  drove: 'drive',
  driven: 'drive',
  ate: 'eat',
  eaten: 'eat',
  fell: 'fall',
  fallen: 'fall',
  forgot: 'forget',
  forgotten: 'forget',
  grew: 'grow',
  grown: 'grow',
  lost: 'lose',
  ran: 'run',
  sold: 'sell',
  sat: 'sit',
  slept: 'sleep',
  stood: 'stand',
  swam: 'swim',
  swum: 'swim',
  understood: 'understand',
  wore: 'wear',
  worn: 'wear',
  won: 'win',
  children: 'child',
  people: 'person',
  men: 'man',
  women: 'woman',
  feet: 'foot',
  teeth: 'tooth',
  mice: 'mouse',
  geese: 'goose',
  better: 'good',
  best: 'good',
  worse: 'bad',
  worst: 'bad',
}

// 読み取りエンジンが付けた確からしさ（0〜100）がこれより低い語は「読み取りが不確か」として、候補に出しても最初は選ばない。
// PaddleOCR は行ごとの確からしさを返し、正しく読めた行はほぼ 90 以上になる。実写真28枚で 85・90 は最初から選ぶ正しい語を
// 減らさずに写真にない語（手書きの hot を読み違えた hat）を不確かにし、93 以上は正しい語まで選ばなくなった（2026-10-14）。
export const OCR_LOW_CONFIDENCE = 90

// 読み違えやすい文字の組（読み取った形 → 正しい形）。実在しない並びを辞書の見出し語へ戻すときだけ使う。
const CONFUSIONS = [
  ['rn', 'm'],
  ['cl', 'd'],
  ['vv', 'w'],
  ['0', 'o'],
  ['1', 'l'],
  ['1', 'i'],
  ['5', 's'],
]
const MAX_CONFUSION_FIXES = 2
// かぎかっこ・かっこ・縦線などが語の端で英字に読まれやすい文字（「decide → fdecide、Tdecide）。
const EDGE_MISREADS = new Set(['f', 'i', 'j', 'l', 'r', 't'])
const MIN_EDGE_TRIM_LENGTH = 4

// 2文字の語は、単語表には略語（ls・od など）がまじるので、アプリの辞書にあるときだけ英単語とみなす。
const MIN_LISTED_WORD_LENGTH = 3
// くっついて読まれた語を分ける対象の長さと、分けた1つ1つに使える1文字の語。
const MIN_SPLIT_LENGTH = 5
const ONE_LETTER_WORDS = new Set(['a', 'i'])

export function normalizeOcrToken(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[‐‑‒–—―]/g, '-')
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '')
    .replace(/^[0-9]+|[0-9]+$/g, '')
}

// 英字の並び（アポストロフィ・ハイフンでつながる形を含む）を取り出す。英字のあいだにはさまった数字（rn0dern）は
// 読み違いの手がかりとして残し、数字で始まる並び（3rd・10th）と、数字だけの並びは取り出さない。日本語は取り出さない。
const ENGLISH_TOKEN = /(?<![A-Za-z0-9])[A-Za-z]+(?:[0-9]+[A-Za-z]+)*(?:['-][A-Za-z]+(?:[0-9]+[A-Za-z]+)*)*/g

// 並びと、その文の中の位置（index）。NFKC などで文字数が変わらない字だけを置きかえるので、位置は元の text と同じ。
export function extractEnglishTokenMatches(text) {
  const source = String(text ?? '')
    .replace(/[’‘]/g, "'")
    .replace(/[‐‑‒–—―]/g, '-')
    .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
  return [...source.matchAll(ENGLISH_TOKEN)].map((match) => ({ surface: match[0], index: match.index }))
}

export function extractEnglishTokens(text) {
  const normalized = String(text ?? '')
    .normalize('NFKC')
    .replace(/[’‘]/g, "'")
    .replace(/[‐‑‒–—―]/g, '-')
  return normalized.match(ENGLISH_TOKEN) ?? []
}

// 読み取りエンジンの語（{ text, confidence }）から、取り出す語ごとの確からしさ（同じ語が何度も出たら高いほう）を作る。
export function ocrTokenConfidences(ocrWords) {
  const confidences = new Map()
  for (const word of ocrWords ?? []) {
    const confidence = Number(word?.confidence)
    if (!Number.isFinite(confidence)) continue
    for (const surface of extractEnglishTokens(word.text)) {
      const token = normalizeOcrToken(surface)
      if (!token) continue
      confidences.set(token, Math.max(confidences.get(token) ?? 0, confidence))
    }
  }
  return confidences
}

const CONTRACTION_BASES = { "can't": 'can', "won't": 'will', "shan't": 'shall', "ain't": 'be' }

function possibleBaseForms(token) {
  const forms = []
  const add = (value) => {
    const normalized = normalizeOcrToken(value)
    if (normalized.length >= 2 && normalized !== token && !forms.includes(normalized)) {
      forms.push(normalized)
    }
  }

  add(IRREGULAR_BASES[token])
  add(CONTRACTION_BASES[token])

  if (token.endsWith("'s")) add(token.slice(0, -2))
  if (token.endsWith("s'")) add(token.slice(0, -1))
  if (token.endsWith("n't")) add(token.slice(0, -3))
  for (const suffix of ["'re", "'ve", "'ll", "'m", "'d"]) {
    if (token.endsWith(suffix)) add(token.slice(0, -suffix.length))
  }

  if (token.length > 3 && token.endsWith('s')) add(token.slice(0, -1))
  if (token.length > 4 && token.endsWith('ies')) add(`${token.slice(0, -3)}y`)
  if (token.length > 4 && token.endsWith('ves')) {
    add(`${token.slice(0, -3)}f`)
    add(`${token.slice(0, -3)}fe`)
  }
  if (token.length > 3 && token.endsWith('es')) add(token.slice(0, -2))

  if (token.length > 4 && token.endsWith('ied')) add(`${token.slice(0, -3)}y`)
  if (token.length > 4 && token.endsWith('ed')) {
    add(token.slice(0, -1))
    const withoutEd = token.slice(0, -2)
    add(withoutEd)
    if (withoutEd.at(-1) === withoutEd.at(-2)) add(withoutEd.slice(0, -1))
  }

  if (token.length > 5 && token.endsWith('ying')) add(`${token.slice(0, -4)}ie`)
  if (token.length > 4 && token.endsWith('ing')) {
    const withoutIng = token.slice(0, -3)
    add(withoutIng)
    add(`${withoutIng}e`)
    if (withoutIng.at(-1) === withoutIng.at(-2)) add(withoutIng.slice(0, -1))
  }

  for (const suffix of ['est', 'er']) {
    if (token.length <= suffix.length + 2 || !token.endsWith(suffix)) continue
    if (token.endsWith(`i${suffix}`)) add(`${token.slice(0, -(suffix.length + 1))}y`)
    const stem = token.slice(0, -suffix.length)
    add(stem)
    add(`${stem}e`)
    if (stem.at(-1) === stem.at(-2)) add(stem.slice(0, -1))
  }

  return forms
}

function buildHeadwordIndex(words) {
  const index = new Map()
  for (const word of words) {
    const headword = normalizeOcrToken(word?.word)
    if (!headword || /[^a-z'-]/.test(headword) || index.has(headword)) continue
    index.set(headword, word)
  }
  return index
}

// 読み違えやすい文字の組を最大 MAX_CONFUSION_FIXES か所まで入れ替えた形を、すべて作る。
function confusionVariants(token) {
  let current = new Set([token])
  const all = new Set()
  for (let step = 0; step < MAX_CONFUSION_FIXES; step += 1) {
    const next = new Set()
    for (const form of current) {
      for (const [from, to] of CONFUSIONS) {
        let at = form.indexOf(from)
        while (at !== -1) {
          const variant = form.slice(0, at) + to + form.slice(at + from.length)
          if (!all.has(variant) && variant !== token) {
            all.add(variant)
            next.add(variant)
          }
          at = form.indexOf(from, at + 1)
        }
      }
    }
    current = next
  }
  return [...all].filter((form) => /^[a-z]+(?:['-][a-z]+)*$/.test(form))
}

// 語の端の1文字が、かっこなどの読み違いだったときの形。
function edgeTrimmedVariants(token) {
  if (token.length < MIN_EDGE_TRIM_LENGTH) return []
  const variants = []
  if (EDGE_MISREADS.has(token[0])) variants.push(token.slice(1))
  if (EDGE_MISREADS.has(token.at(-1))) variants.push(token.slice(0, -1))
  return variants
}

// 語を、読み取った1つの並び（token）ごとに次のどれかへ分ける。
//   dictionary  アプリの辞書の見出し語（そのまま・変化形）
//   listed      アプリの辞書にはないが、英語の単語表にある実在の語（辞書登録をリクエストできる。読み取りが不確かなら rejected へ）
//   corrected   実在しない並びを、読み違えやすい文字の組を入れ替えるか、端のかっこの読み違いを外して、辞書の見出し語へ1つに戻せたもの
//   split       実在しない並びを、続けて読まれた2〜3語（辞書の語）に分けられたもの（最初は選ばない）
//   rejected    英単語として確かめられない並び（日本語や図の読み違い・人名・地名など）
function createClassifier(words, englishWords) {
  const index = buildHeadwordIndex(words)
  const listed = englishWords ?? new Set()
  const cache = new Map()

  const lookupDictionary = (token) => {
    const word = index.get(token)
    if (word) return word
    for (const base of possibleBaseForms(token)) {
      const found = index.get(base)
      if (found) return found
    }
    return null
  }

  const isListed = (token) => token.length >= MIN_LISTED_WORD_LENGTH && listed.has(token)

  // 分けた1つ1つに使える語は、辞書の語（a・i をふくむ）だけ。単語表の語まで使うと、読み違えた並びが
  // 実在の語の組に分かれてしまう（Noticell → no・tic・ell、seaso → sea・so。2026-10-14 に実写真で確かめた）。
  const pieceKind = (piece) => {
    if (piece.length < 2 && !ONE_LETTER_WORDS.has(piece)) return null
    return lookupDictionary(piece) ? 'dictionary' : null
  }

  const splitToken = (token) => {
    if (token.length < MIN_SPLIT_LENGTH || !/^[a-z]+$/.test(token)) return null
    let best = null
    const consider = (pieces) => {
      const kinds = pieces.map(pieceKind)
      if (kinds.some((kind) => !kind)) return
      const score = [
        -pieces.length,
        Math.min(...pieces.map((piece) => piece.length)),
        kinds.filter((kind) => kind === 'dictionary').length,
      ]
      if (!best || score.some((value, i) => value !== best.score[i]) && compareScores(score, best.score) > 0) {
        best = { pieces, score }
      }
    }
    for (let i = 1; i < token.length; i += 1) {
      consider([token.slice(0, i), token.slice(i)])
    }
    if (!best) {
      // 3つに分けるときは、1文字の語（a・i）を使わない（Themistress を them・i・stress に分けない）。
      for (let i = 2; i < token.length - 3; i += 1) {
        for (let j = i + 2; j < token.length - 1; j += 1) {
          consider([token.slice(0, i), token.slice(i, j), token.slice(j)])
        }
      }
    }
    return best?.pieces ?? null
  }

  const classify = (token) => {
    if (cache.has(token)) return cache.get(token)
    let result
    const word = /^[a-z'-]+$/.test(token) ? lookupDictionary(token) : null
    if (word) {
      result = { kind: 'dictionary', word }
    } else if (isListed(token)) {
      result = { kind: 'listed' }
    } else if (token.includes('-') && !token.includes('--')) {
      // 行の終わりで切れた語（inter-esting）は、つないだ形を先に試し、だめなら部分ごとに分ける。
      const joined = token.replaceAll('-', '')
      const joinedResult = classify(joined)
      if (joinedResult.kind === 'dictionary' || joinedResult.kind === 'listed') {
        result = { kind: 'parts', parts: [joined] }
      } else {
        const parts = token.split('-').filter(Boolean)
        result = parts.every((part) => {
          const kind = classify(part).kind
          return kind !== 'rejected'
        })
          ? { kind: 'parts', parts }
          : { kind: 'rejected' }
      }
    } else {
      const fixes = new Map()
      for (const variant of [...confusionVariants(token), ...edgeTrimmedVariants(token)]) {
        const fixed = lookupDictionary(variant)
        if (fixed) fixes.set(fixed.id, fixed)
      }
      if (fixes.size === 1) {
        result = { kind: 'corrected', word: [...fixes.values()][0] }
      } else {
        const pieces = fixes.size ? null : splitToken(token)
        result = pieces ? { kind: 'parts', parts: pieces.filter((piece) => !ONE_LETTER_WORDS.has(piece) || lookupDictionary(piece)), split: true } : { kind: 'rejected' }
      }
    }
    cache.set(token, result)
    return result
  }

  return { classify }
}

function compareScores(a, b) {
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i]
  }
  return 0
}

// 読み取った文字から、単語帳へ入れる候補（辞書の語）・辞書登録をリクエストできる語（実在するが辞書にない語）・
// 英単語として確かめられなかった並びを作る。実在しない並びは、候補にもリクエストにも出さない。
//   options.englishWords  英語の単語表（englishWordList.js の Set）。無いときは、辞書にない語はすべて確かめられない側へ
//   options.confidences   ocrTokenConfidences の結果。無い語（利用者が直した文字など）は確かな語として扱う
//   options.contextReading (index, token) → カードの id。文の中の位置 index の並びを、前後の語から読み分けたカード
//                         （ocrContext.js の createContextReading の結果。saw → see など）。null ならふつうに読む
export function matchOcrTextToWords(text, words, options = {}) {
  const { classify } = createClassifier(words, options.englishWords)
  const confidences = options.confidences ?? new Map()
  const tokens = extractEnglishTokenMatches(text)
  const byId = options.contextReading ? new Map(words.map((word) => [word.id, word])) : null
  const matches = new Map()
  const unmatched = new Map()
  const rejected = new Map()
  let matchedTokenCount = 0
  let tokenCount = 0

  const confidenceOf = (token) => confidences.get(token)
  const isUncertain = (token) => {
    const confidence = confidenceOf(token)
    return confidence != null && confidence < OCR_LOW_CONFIDENCE
  }

  const addCandidate = (word, surface, { uncertain = false, corrected = false, split = false } = {}) => {
    matchedTokenCount += 1
    const current = matches.get(word.id) ?? {
      id: word.id,
      headword: word.word,
      meaning: word.meaning,
      level: word.level,
      occurrences: 0,
      observed: [],
      uncertain: true,
      corrected: true,
      split: true,
    }
    current.occurrences += 1
    // 1回でも確かに・そのまま読めていれば、不確か・直した・分けたの印は外す。
    current.uncertain &&= uncertain
    current.corrected &&= corrected
    current.split &&= split
    if (!current.observed.includes(surface)) current.observed.push(surface)
    matches.set(word.id, current)
  }

  const addListed = (token, surface, { split = false } = {}) => {
    const current = unmatched.get(token) ?? {
      token,
      q: split ? token : surface,
      occurrences: 0,
      observed: [],
      split: true,
    }
    current.occurrences += 1
    current.split &&= split
    if (!current.observed.includes(surface)) current.observed.push(surface)
    unmatched.set(token, current)
  }

  const addRejected = (token, surface) => {
    const current = rejected.get(token) ?? { token, q: surface, occurrences: 0, observed: [] }
    current.occurrences += 1
    if (!current.observed.includes(surface)) current.observed.push(surface)
    rejected.set(token, current)
  }

  const place = (token, surface, flags) => {
    const result = classify(token)
    if (result.kind === 'dictionary') {
      addCandidate(result.word, surface, flags)
    } else if (result.kind === 'corrected') {
      addCandidate(result.word, surface, { ...flags, corrected: true })
    } else if (result.kind === 'listed') {
      // 辞書にない語は、読み取りが不確かなら（日本語や図の読み違いが実在の語にたまたま重なったもの）リクエストに出さない。
      if (flags.uncertain) addRejected(token, surface)
      else addListed(token, surface, flags)
    } else if (result.kind === 'parts') {
      for (const part of result.parts) place(part, surface, { ...flags, split: flags.split || Boolean(result.split) })
    } else {
      addRejected(token, surface)
    }
  }

  // 大文字が語の途中から始まる並び（ToriMeshi・SmileyMenu・cArms）は、写真で2語がくっついて読まれたもの。大文字の所で分け、
  // 1つずつ読む（語の途中では分けない）。
  const pieces = []
  for (const { surface, index } of tokens) {
    const parts = surface.split(/(?<=[a-z])(?=[A-Z])/)
    let offset = index
    for (const part of parts) {
      pieces.push({ surface: part, index: offset })
      offset += part.length
    }
  }
  for (const { surface, index } of pieces) {
    const normalized = normalizeOcrToken(surface)
    if (normalized.length < 2) continue
    tokenCount += 1
    const flags = { uncertain: isUncertain(normalized), split: false }
    const contextual = byId?.get(options.contextReading(index, normalized))
    if (contextual) addCandidate(contextual, surface, flags)
    else place(normalized, surface, flags)
  }

  return {
    candidates: [...matches.values()],
    tokenCount,
    matchedTokenCount,
    unmatchedTokenCount: [...unmatched.values()].reduce((sum, item) => sum + item.occurrences, 0),
    unmatched: [...unmatched.values()],
    rejectedTokenCount: [...rejected.values()].reduce((sum, item) => sum + item.occurrences, 0),
    rejected: [...rejected.values()],
  }
}
