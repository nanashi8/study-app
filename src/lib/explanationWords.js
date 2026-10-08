// 英単語の解説（使い方・使い分け・関連語の解説・語の成り立ち・つづりが似た語の説明など）の文に出てくる英字を、
// 1つずつ「何の語か」に分ける（requests/2026-10-08-explanation-word-links.json）。
// - 英語の語（1語）：辞書に見出しがあれば、その語の辞書ページへのリンクにする。
//   すぐ後に意味（「」・（）・「X は「…」」）がなければ、意味を小さく添える（既定は見出し語の最初の意味）。
// - 英語の句・例（2語以上が空白でつながったもの）：見出しのある内容語をリンクにし、句の意味がなければ句の後ろに添える。
// - 英語でない語（ラテン語などの言語名のあとの語・発音の記号のついた語）と語の部品（ad-・-tion）：リンクも添え書きもしない。
// 機械で決められない所（ちがう意味で使っている・同じつづりの別の語・言語名のない外国語・見出しのない語の意味）は、
// 1件ずつ読んで決めた台帳 src/data/explanation-words.js が決める。台帳の鍵は「文の指紋|語（句）」。
import { ALL_WORDS, getWord } from '../data/vocab.js'
import { EXPLANATION_WORD_DECISIONS } from '../data/explanation-words.js'
import { sha256Hex } from './hash.js'

// 英字の語。アポストロフィ・ハイフン・ピリオドの入った見出し（o'clock・well-being・a.m.）も1語として拾う。
const LETTER = "A-Za-zÀ-ɏḀ-ỿ"
const WORD_SOURCE = `[${LETTER}](?:[${LETTER}'’]|-(?=[${LETTER}])|\\.(?=[${LETTER}]\\.))*\\.?`
// 空白1つでつながる英字の語の並び（句・例）。
const RUN = new RegExp(`${WORD_SOURCE}(?: ${WORD_SOURCE})*`, 'gu')
const WORD = new RegExp(WORD_SOURCE, 'gu')
// 英語のつづりにない文字（ā・þ・æ など）を含む語は、英語でない語。
const NON_ENGLISH_LETTER = /[^A-Za-z'’.-]/u

// 英語でない言語の名前（古英語・中英語は今の英語ではないので含める。「アメリカ英語」などは含めない）。
const LANGUAGE_NAME = /(?:ラテン|ギリシャ|ギリシア|フランス|ノルド|オランダ|ドイツ|イタリア|スペイン|ポルトガル|アラビア|タミル|サンスクリット|アイスランド|ペルシャ|ヒンディー|トルコ|スウェーデン|ゲルマン|チェコ|ゲール|マレー|ナワトル|イロコイ|中国|プロバンス|デンマーク|イディッシュ|ヘブライ|広東|ウェールズ|セルビア|ロシア|ノルウェー|ハンガリー|ケルト|古英|中英|ラテン系の)語$|語根$|(?:古い|隠)語$/u
// 言語名のあと、語が続いているあいだ（語・意味の「」・（）・＋・・・／）は同じ言語の語とみなす。
const CHAIN_CHAR = new RegExp(`[\\s${LETTER}'’.+＋・/／-]`, 'u')
const CHAIN_OPEN = { '」': '「', '）': '（', ')': '(' }

// 語の頭につく形（in-・un-・be- など）。「in「否定」＋ correct」のように＋でつながるときは語の部品。
const PREFIX_FORMS = new Set(['in', 'im', 'il', 'ir', 'un', 'dis', 'de', 're', 'be', 'en', 'em', 'a', 'ab', 'ad', 'ex', 'co', 'con', 'com', 'pro', 'pre', 'sub', 'ob', 'per', 'non', 'mis', 'fore'])

// 型の記号（A を B から分ける）。リンクも意味もつけない。
const PLACEHOLDERS = new Set(['A', 'B', 'C', 'D', 'X', 'Y', 'Z'])
// 句の中でリンクにしない語（冠詞・前置詞・代名詞・be・do などの働きの語と、型の語）。
export const PHRASE_FUNCTION_WORDS = new Set([
  'a', 'an', 'the', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'by', 'from', 'as', 'and', 'or', 'but', 'nor', 'so',
  'be', 'is', 'am', 'are', 'was', 'were', 'been', 'being', 'do', 'does', 'did', 'doing', 'done', 'have', 'has', 'had',
  'it', 'its', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
  'we', 'us', 'our', 'they', 'them', 'their', "one's", 'oneself', 'one', 'someone', 'something', 'sb', 'sth',
  'not', 'no', 'up', 'out', 'off', 'over', 'into', 'onto', 'than', 'about', 'will', 'would', 'can', 'could',
  'shall', 'should', 'may', 'might', 'must', 'if', 'when', 'what', 'who', 'which', 'there', 'here', 'all', 'very',
])

// つづり（小文字）→ 見出し語。同じつづりの別の語（light_2 など）は元の語を既定にし、別の語は台帳で指す。
const HEADWORDS = new Map()
for (const word of ALL_WORDS) {
  const key = word.word.toLowerCase()
  const current = HEADWORDS.get(key)
  if (!current || (/_\d+$/.test(current.id) && !/_\d+$/.test(word.id))) HEADWORDS.set(key, word)
}
const SPELLING_COUNTS = new Map()
for (const word of ALL_WORDS) {
  const key = word.word.toLowerCase()
  SPELLING_COUNTS.set(key, (SPELLING_COUNTS.get(key) ?? 0) + 1)
}

export const headwordForSpelling = (spelling) => HEADWORDS.get(String(spelling).toLowerCase().replace(/’/g, "'")) ?? null
export const spellingHasHomographs = (spelling) => (SPELLING_COUNTS.get(String(spelling).toLowerCase()) ?? 0) > 1

/** 文の指紋（台帳の鍵の前半）。 */
export const explanationTextKey = (text) => sha256Hex(String(text)).slice(0, 10)

/** 見出し語に添える既定の意味（最初の意味）。 */
export const defaultMeaningOf = (word) => word?.meanings?.[0] ?? word?.meaning ?? ''

/** 「ブナの木（beech）」のように、日本語のすぐ後の（）に語だけが入っていれば、前の日本語がその語の意味。 */
export function meaningBefore(text, start, end) {
  const open = text[start - 1]
  const close = text[end]
  if (!((open === '（' && close === '）') || (open === '(' && close === ')'))) return false
  return /[\u3040-\u30ff\u4e00-\u9fff]/u.test(text[start - 2] ?? '')
}

/**
 * すぐ後に意味が書いてあるか。「X「意味」」「X（意味）」「X は「意味」」「X の「意味」」「X＝意味」
 * 「X は苦しみに「耐える」」（読点・句点の前に「」が来る）を、意味ありとみなす。
 */
export function meaningFollows(text, end) {
  const after = text.slice(end).replace(/^ /, '')
  if (/^[「（(]/u.test(after)) return true
  // 「(beef up で)強化する」「refer to 〜で「言及する」」のように、その句・語で使うときの意味が続く。
  if (/^で[)）]/u.test(after)) return true
  if (/^[〜～~]?\s*で\s*「/u.test(after)) return true
  // 「be capable of 〜ing は「…」」「A of B は「…」」のように、型の記号のあとに意味が続く。
  if (/^(?:[〜～~][a-z]*|[A-Z]|do|doing|one's)(?: (?:[〜～~][a-z]*|[A-Z]|do|doing|one's))*\s*(?:は|で)\s*「/u.test(after)) return true
  if (/^[＝=]\s*\S/u.test(after)) return true
  if (/^(?:は|の|が|も|を)\s*[「（(]/u.test(after)) return true
  if (/^(?:は|が|も)[^、。，,；;（(「」A-Za-z]{0,14}「/u.test(after)) return true
  return false
}

/** その位置の語が、言語名のあとに続く外国語の並びの中にあるか。 */
function afterLanguageName(text, start) {
  // 語の前を後ろへたどり、語・空白・＋・・と、閉じた「」（）だけが続くあいだは同じ並びとみなす。
  let index = start
  while (index > 0) {
    const char = text[index - 1]
    if (CHAIN_CHAR.test(char)) {
      index -= 1
      continue
    }
    const open = CHAIN_OPEN[char]
    if (!open) break
    const at = text.lastIndexOf(open, index - 2)
    if (at < 0) break
    index = at
  }
  return LANGUAGE_NAME.test(text.slice(Math.max(0, index - 24), index).replace(/\s+$/u, ''))
}

/** 台帳の決定。キーは `指紋|語（句）`（その文で1回目）、同じ文の2回目からは `指紋|語#2`・`#3`…。 */
export function decisionFor(textKey, run, occurrence = 1) {
  return EXPLANATION_WORD_DECISIONS[occurrence > 1 ? `${textKey}|${run}#${occurrence}` : `${textKey}|${run}`] ?? null
}

// 台帳の書き方: 'x' 英語でない語・語の部品・固有名詞（リンクも添え書きもしない）
//              'ok' 意味は文の中に別の形で書いてある（添え書きしない。リンクはする）
//              '=id' リンク先の見出し語（同じつづりの別の語・変化形の元の語）
//              '-' リンクしない（同じページの語の変化形など）
//              それ以外の文字列＝添える意味。'=id 意味' のように並べてもよい（空白1つで区切る）。
export function parseDecision(value) {
  if (value == null) return null
  if (value === 'x') return { foreign: true }
  const result = {}
  let rest = String(value)
  const target = rest.match(/^=(\S+)(?: |$)/u)
  if (target) {
    result.to = target[1]
    rest = rest.slice(target[0].length)
  } else if (rest === '-' || rest.startsWith('- ')) {
    result.noLink = true
    rest = rest.slice(2)
  }
  if (rest === 'ok') result.ok = true
  else if (rest) result.meaning = rest
  return result
}

/**
 * 解説の文を、表示用の並びに分ける。
 * 返り値の各要素は { text }（ふつうの文）か、英字の語・句 1つ分の
 * { text, kind, key, wordId?, meaning?, source, parts? }。
 *   kind: 'link'（見出し語へのリンク）・'word'（見出しのない英語の語）・'self'（そのページの語）・
 *         'foreign'（英語でない語・語の部品・型の記号）・'phrase'（英語の句・例。parts に語ごとの要素）・
 *         'phrase-word'（句の中のリンクにしない語）
 *   key: 台帳の鍵（`文の指紋|語`）。
 *   meaning: 語（句）の後ろに小さく添える意味。
 *   source: 意味の出どころ。follows（すぐ後に書いてある）・ok（文の中に別の形で書いてある）・
 *           ledger（台帳）・default（見出しの最初の意味）・none（意味なし）・rule（規則で英語でない語）
 * selfId は、そのページ（カード）の語の id。
 */
export function explanationSegments(text, { selfId = null } = {}) {
  const source = String(text ?? '')
  if (!source) return []
  const textKey = explanationTextKey(source)
  const segments = []
  const seen = new Map()
  const firstOf = new Map()
  let cursor = 0
  const pushText = (value) => {
    if (value) segments.push({ text: value })
  }
  const keyOf = (run) => {
    const occurrence = (seen.get(run) ?? 0) + 1
    seen.set(run, occurrence)
    return { key: `${textKey}|${run}${occurrence > 1 ? `#${occurrence}` : ''}`, decision: parseDecision(decisionFor(textKey, run, occurrence)) }
  }
  for (const match of source.matchAll(RUN)) {
    const run = match[0]
    const start = match.index
    const end = start + run.length
    pushText(source.slice(cursor, start))
    cursor = end
    const { key, decision } = keyOf(run)
    const single = !run.includes(' ') || headwordForSpelling(run.replace(/\.$/u, ''))
    let segment = single
      ? wordSegment(source, run, start, end, decision, selfId, key)
      : phraseSegment(source, run, start, end, decision, selfId, key, keyOf)
    // 同じ文に2回目に出た語は、1回目と同じ扱いにする（意味は1回目に書いてある・添えてある）。
    const earlier = firstOf.get(run)
    if (!decision && earlier && segment.source !== 'follows') {
      if (earlier.kind === 'foreign') segment = { ...segment, kind: 'foreign', source: 'earlier', meaning: '' }
      else if (earlier.source !== 'none') segment = { ...segment, meaning: '', source: 'earlier' }
    }
    if (!firstOf.has(run)) firstOf.set(run, segment)
    segments.push(segment)
  }
  pushText(source.slice(cursor))
  return segments
}

/**
 * 規則で英語でない語・記号と分かるもの（台帳がないときだけ使う）。理由を返す（当たらなければ null）。
 * placeholder 型の記号（A・B）／part 語の部品（ad-・-tion・at- の at）／letter 1文字の記号（t の前で）／
 * spelling 英語のつづりにない文字（ā・þ）／phonetic 発音記号の中／card 語根カードの名前／
 * language 言語名のあとの語の並び（ラテン語 ad「〜に」＋ visum）
 */
export function foreignRuleOf(text, run, start, end) {
  const bare = run.replace(/\.$/u, '')
  if (PLACEHOLDERS.has(bare)) return 'placeholder'
  if (/[-‐〜～~]/u.test(text[start - 1] ?? '') || /[-‐]/u.test(text[end] ?? '')) return 'part'
  // 「in「否定」＋ correct」「be＋ low」のように、接頭辞の形が＋でつながるもの。
  if (PREFIX_FORMS.has(bare.toLowerCase()) && /^(?:「[^「」]*」)?\s*[＋+]/u.test(text.slice(end))) return 'part'
  // 「tend のカード」「語根 port のカード」の語は、語根カードの名前（英語の語ではない）。
  if (/^ ?の(?:カード|仲間のカード)/u.test(text.slice(end)) || /^ ?\/ ?[A-Za-z]+ ?の(?:カード)/u.test(text.slice(end))) return 'card'
  if (bare.length === 1 && bare !== 'a' && bare !== 'I') return 'letter'
  // 発音記号（/waɪnd/）の中の英字。
  if (/\/[^\s/]*$/u.test(text.slice(0, start)) && /^[^\s/]*\//u.test(text.slice(end))) return 'phonetic'
  if (NON_ENGLISH_LETTER.test(bare.replace(/ /g, ''))) return 'spelling'
  return afterLanguageName(text, start) ? 'language' : null
}

/** 1語の言及。 */
function wordSegment(text, run, start, end, decision, selfId, key) {
  const bare = run.replace(/\.$/u, '')
  if (decision?.foreign) return { text: run, kind: 'foreign', key, source: 'ledger' }
  const rule = decision ? null : foreignRuleOf(text, run, start, end)
  if (rule) return { text: run, kind: 'foreign', key, source: `rule:${rule}` }
  const follows = meaningFollows(text, end) || meaningBefore(text, start, end)
  const target = decision?.noLink ? null : (decision?.to ? getWord(decision.to) : headwordForSpelling(bare) ?? headwordForSpelling(run))
  if (target && selfId && target.id === selfId) return { text: run, kind: 'self', key, wordId: target.id, source: 'self' }
  let meaning = ''
  let source = 'none'
  if (follows) source = 'follows'
  else if (decision?.ok) source = 'ok'
  else if (decision?.meaning) { meaning = decision.meaning; source = 'ledger' }
  else if (target) { meaning = defaultMeaningOf(target); source = 'default' }
  if (target) return { text: run, kind: 'link', key, wordId: target.id, meaning, source }
  return { text: run, kind: 'word', key, meaning, source }
}

/** 英語の句・例。見出しのある内容語をリンクにし、句の意味がなければ句の後ろに添える。 */
function phraseSegment(text, run, start, end, decision, selfId, key, keyOf) {
  if (decision?.foreign) return { text: run, kind: 'foreign', key, source: 'ledger' }
  const rule = decision ? null : foreignRuleOf(text, run, start, end)
  if (rule) return { text: run, kind: 'foreign', key, source: `rule:${rule}` }
  const parts = []
  const tokens = run.split(' ')
  let index = 0
  while (index < tokens.length) {
    if (index > 0) parts.push({ text: ' ' })
    // 2〜3語の見出し（ice cream・arts and crafts）を先に見る。
    let matched = null
    for (let size = Math.min(3, tokens.length - index); size >= 2; size -= 1) {
      const candidate = headwordForSpelling(tokens.slice(index, index + size).join(' '))
      if (candidate) { matched = { size, word: candidate }; break }
    }
    const piece = matched ? tokens.slice(index, index + matched.size).join(' ') : tokens[index]
    const bare = piece.replace(/\.$/u, '')
    // 句の中の語ごとの台帳（鍵は `指紋|句>語`）。
    const own = keyOf(`${run}>${piece}`)
    const plain = own.decision?.foreign || own.decision?.noLink
      || (!own.decision?.to && !matched && (PHRASE_FUNCTION_WORDS.has(bare.toLowerCase()) || PLACEHOLDERS.has(bare)))
    const target = plain ? null : own.decision?.to ? getWord(own.decision.to) : (matched?.word ?? headwordForSpelling(bare))
    if (target && selfId && target.id === selfId) parts.push({ text: piece, kind: 'self', key: own.key, wordId: target.id, source: 'self' })
    else if (target) parts.push({ text: piece, kind: 'link', key: own.key, wordId: target.id, meaning: '', source: 'phrase' })
    else parts.push({ text: piece, kind: 'phrase-word', key: own.key, source: 'phrase' })
    index += matched?.size ?? 1
  }
  let meaning = ''
  let source = 'none'
  // 句・例文は、前の日本語が意味とは限らない（「動詞の前に置く（I also like it.）」）ので、（）の前は見ない。
  if (meaningFollows(text, end)) source = 'follows'
  else if (decision?.ok) source = 'ok'
  else if (decision?.meaning) { meaning = decision.meaning; source = 'ledger' }
  // 働きの語と型の記号だけの並び（to do・A of B）は、文型の枠なので句の意味を求めない。
  else if (parts.every((part) => !part.kind || part.kind === 'phrase-word')) source = 'pattern'
  return { text: run, kind: 'phrase', key, parts, meaning, source }
}
