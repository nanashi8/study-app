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

// 写真1枚の読み方（2026-10-14、ウェブで集めた実際の写真28枚と試料7枚の正解と照らして決めた）。
// 2つのエンジンを並べて動かす。「日本語＋英語」（日本語を先に）は日本語の行を、「英語だけ」は英語の行を読む。
// 日本語＋英語で読むと、太い英字の段落が崩れたり抜けたりする（説明板の英文で「7is 7S a reconstruction…」）。
// 英語だけで読むと、日本語の行が英字の並び（basic・hot などの実在の語を含む）に化ける。そこで両方で読み、行ごとに確かな
// 読み方を選ぶ。どちらも白黒の決め方を2通り（'0'＝画像全体で1つのしきい値、'2'＝場所ごとに決める Sauvola）で読む。
// 背景のある写真は場所ごとのほうが読めることが多く、紙の文書は全体のほうが読めることが多い。
export const OCR_ENGINES = Object.freeze([
  Object.freeze({ id: 'ja', languages: Object.freeze(['jpn', 'eng']), thresholdings: Object.freeze(['0', '2']) }),
  Object.freeze({ id: 'en', languages: Object.freeze(['eng']), thresholdings: Object.freeze(['0', '2']) }),
])

// 語を最初から選ぶ確かさ：ほかの読み方でも同じ場所に同じ語が読めた数（自分を含む）か、エンジンの確からしさ。
// どちらにも届かない語は「読み取りが不確か」にする（候補には出すが最初は選ばない）。
export const OCR_CONFIRM_PASSES = 3
export const OCR_SURE_CONFIDENCE = 85

const JAPANESE_CHAR = /[\u3040-\u30ff\u3400-\u9fff]/u
// 長音記号・中黒だけの並び（写真の模様を「ーーーー」と読んだもの）は、日本語の字として数えない。
const JAPANESE_SYMBOLS = /^[ー・ｰ]+$/u
// 行の選び方で、日本語の字を確かと数える確からしさ。
const JAPANESE_LINE_CONFIDENCE = 45
// 2つの行が同じ所を読んだとみなす重なり（短いほうの幅・高さに対する割合の積）。
const SAME_LINE_OVERLAP = 0.5
const SAME_WORD_OVERLAP = 0.3

// 読み取りエンジンの結果（blocks → paragraphs → lines → words）から、行（文字・位置・語）を並べる。
export function ocrLinesFromResult(data) {
  return (data?.blocks ?? []).flatMap((block) => (block.paragraphs ?? []).flatMap((paragraph) => (
    (paragraph.lines ?? []).map((line) => ({
      text: String(line.text ?? '').trim(),
      bbox: line.bbox ?? null,
      words: (line.words ?? []).map((word) => ({ text: word.text, confidence: word.confidence, bbox: word.bbox ?? null })),
    }))
  )))
}

function boxOverlap(a, b) {
  if (!a || !b) return 0
  const y = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0)
  const x = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)
  if (y <= 0 || x <= 0) return 0
  return (y / Math.max(1, Math.min(a.y1 - a.y0, b.y1 - b.y0))) * (x / Math.max(1, Math.min(a.x1 - a.x0, b.x1 - b.x0)))
}

// 行の確かさ：英単語として確かめられた語の字数（確からしさが低くない語だけ）、確からしい日本語の字数、
// 確かめられない英字の並びと確からしさの低い日本語の字数（悪いほう）。
function ocrLineQuality(line, isEnglishWord) {
  let english = 0
  let japanese = 0
  let bad = 0
  const tokens = []
  for (const word of line.words) {
    const confidence = Number(word.confidence)
    const japaneseText = String(word.text ?? '').replace(/[^\u3040-\u30ff\u3400-\u9fffｰ]/gu, '')
    if (JAPANESE_SYMBOLS.test(japaneseText)) {
      bad += japaneseText.length
    } else {
      for (const ch of japaneseText) {
        if (!JAPANESE_CHAR.test(ch)) continue
        if (confidence >= JAPANESE_LINE_CONFIDENCE) japanese += 1
        else bad += 1
      }
    }
    for (const surface of extractEnglishTokens(word.text)) {
      const token = normalizeOcrToken(surface)
      if (token.length < 2) continue
      if (isEnglishWord(token) && confidence >= OCR_LOW_CONFIDENCE) {
        english += token.length
        tokens.push(token)
      } else {
        bad += token.length
      }
    }
  }
  return { english, japanese, bad, tokens }
}

function pickLines(lines, score) {
  const chosen = []
  for (const line of [...lines].sort((a, b) => score(b) - score(a))) {
    if (score(line) <= 0) continue
    if (chosen.some((other) => boxOverlap(other.bbox, line.bbox) > SAME_LINE_OVERLAP)) continue
    chosen.push(line)
  }
  return chosen
}

// いくつかの読み方（passes: [{ key, kind: 'ja' | 'en', lines }]）を、行ごとに選んで1つの文字と語にまとめる。
//   日本語の行：日本語＋英語の読み方の行から、日本語と英単語が多く、確かめられない字が少ない行を選ぶ。
//   英語の行：すべての読み方の行から、英単語として確かめられた字が多い行を選ぶ。同じ所を読んだ日本語の行が
//             同じ英単語を全部持っていれば重ねて出さない。
//   語ごとに、ほかの読み方でも同じ場所に同じ語が読めた数（support）を数え、確かさが足りない語の確からしさを
//   OCR_LOW_CONFIDENCE 未満に下げる（matchOcrTextToWords が「不確か」にする）。元の値は rawConfidence に残す。
// isEnglishWord(token) は、その並びが英単語として確かめられるか（createOcrWordTest の結果）。
export function mergeOcrPasses(passes, isEnglishWord) {
  const japaneseLines = []
  const englishLines = []
  for (const pass of passes) {
    for (const line of pass.lines ?? []) {
      if (!line.bbox || !line.text) continue
      const item = { ...line, pass: pass.key, quality: ocrLineQuality(line, isEnglishWord) }
      if (pass.kind === 'ja' && item.quality.japanese > 0) japaneseLines.push(item)
      else if (item.quality.english > 0) englishLines.push(item)
    }
  }
  const japanese = pickLines(japaneseLines, (line) => line.quality.japanese + line.quality.english - line.quality.bad)
  const english = pickLines(englishLines, (line) => line.quality.english - line.quality.bad).filter((line) => {
    const host = japanese.find((other) => boxOverlap(other.bbox, line.bbox) > SAME_LINE_OVERLAP)
    if (!host) return true
    const have = new Set(host.quality.tokens)
    return line.quality.tokens.some((token) => !have.has(token))
  })

  const seen = []
  for (const pass of passes) {
    for (const line of pass.lines ?? []) {
      for (const word of line.words) {
        for (const surface of extractEnglishTokens(word.text)) seen.push({ pass: pass.key, token: normalizeOcrToken(surface), bbox: word.bbox })
      }
    }
  }
  const supportOf = (word, pass) => {
    const tokens = extractEnglishTokens(word.text).map(normalizeOcrToken)
    if (!tokens.length || !word.bbox) return 1
    const passesSeen = new Set([pass])
    for (const other of seen) {
      if (other.pass !== pass && tokens.includes(other.token) && boxOverlap(other.bbox, word.bbox) > SAME_WORD_OVERLAP) passesSeen.add(other.pass)
    }
    return passesSeen.size
  }

  const lines = [...japanese, ...english]
    .sort((a, b) => (a.bbox.y0 + a.bbox.y1) / 2 - (b.bbox.y0 + b.bbox.y1) / 2 || a.bbox.x0 - b.bbox.x0)
    .map((line) => ({
      text: line.text,
      bbox: line.bbox,
      pass: line.pass,
      words: line.words.map((word) => {
        const support = supportOf(word, line.pass)
        const raw = Number(word.confidence)
        const sure = support >= OCR_CONFIRM_PASSES || raw >= OCR_SURE_CONFIDENCE
        return { ...word, support, rawConfidence: raw, confidence: sure ? raw : Math.min(raw, OCR_LOW_CONFIDENCE - 1) }
      }),
    }))
  return { text: lines.map((line) => line.text).join('\n'), words: lines.flatMap((line) => line.words), lines }
}

// 読み取りエンジンが付けた確からしさ（0〜100）がこれより低い語は「読み取りが不確か」として、候補に出しても最初は選ばない。
export const OCR_LOW_CONFIDENCE = 45

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
//   split       実在しない並びを、続けて読まれた2〜3語（辞書の語か単語表の語）に分けられたもの
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
      for (let i = 1; i < token.length - 1; i += 1) {
        for (let j = i + 1; j < token.length; j += 1) {
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

// 読み取った並びが英単語として確かめられるか（辞書の語・単語表の語・読み違いを直した語・分けた語）を返す関数を作る。
// mergeOcrPasses の行の選び方に使う。
export function createOcrWordTest(words, englishWords) {
  const { classify } = createClassifier(words, englishWords)
  return (token) => classify(token).kind !== 'rejected'
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

  for (const { surface, index } of tokens) {
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
