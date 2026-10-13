// 写真の文字の読み取り（vocabOcr.js）で、不規則な変化形が別の見出し語と同じつづりになる語（saw ＝ see の過去形／のこぎり、
// left ＝ leave の過去形／左の／残っている、found ＝ find の過去形／見つかった／設立する など）を、前後の語から読み分ける。
// 対象は、src/data/phrase-irregular-links.js の IRREGULAR_WORD_FORMS の不規則形のうち、動詞の原形のカードとは別の見出し語に
// なっているもの（be 動詞の形・比較級は、それぞれのカードがそのまま学ぶ語なので読み分けない）。
// 前後の語の品詞は compromise（英文の品詞を決める道具、MIT）で決め、文法の決まり（a・the・my の後は名詞、主語の後は動詞、
// have の後は過去分詞、get lost は形容詞…）と組み合わせる。compromise は読み取りを始めたときにだけ読み込む。
// 正解は tests/fixtures/vocab-ocr/context-labels.json（辞書の全例文に出る 280 か所・手作りの文・決まりを作るのに使わなかった文・
// アプリの長文に出る所、計 408 か所）。正解の付け方：
//   - 文の中で動詞として働く所（過去形、have＋過去分詞、受け身の be＋過去分詞の found）は原形のカード（I saw → see、has driven → drive）。
//   - 名詞の前に置く形容詞・get lost・be の後の状態・文頭の分詞（the lost dog、got lost、is bound for、Lost in …）はそのままのカード。
//   - 名詞のすぐ後に場所が続く過去分詞（a mammoth found in Siberia、a pit hidden under the leaves）はそのままのカード（見つかった・隠れた）。
//   - left は、左（Turn left、on the left、left wrist）なら left、「残っている」（are left、no milk left、bread left each day）なら left_2、
//     去る・置いていく・取り残される（She left、litter left on the beach、be left out）なら leave。
//   - being は、名詞（a living being、every human being）なら being、それ以外（for being late、being tested）は be。
//   - lay は、後ろに down・on・in などが続けば lie の過去形、目的語が続けば lay。

const DETERMINERS = new Set([
  'a', 'an', 'the', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'some', 'any', 'no', 'every', 'each', 'another', 'one', 'such', 'what', 'whose', 'which', "poem's",
])
const SUBJECT_PRONOUNS = new Set(['i', 'you', 'he', 'she', 'it', 'we', 'they', 'who', 'nobody', 'someone', 'everyone', 'somebody'])
const OBJECT_WORDS = new Set(['me', 'you', 'him', 'her', 'it', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'nothing', 'something', 'everything'])
const HAVE = new Set(['have', 'has', 'had', "'ve", "'d", 'having'])
const BE = new Set(['am', 'is', 'are', 'was', 'were', 'be', 'been', "'s", "'re", "'m"])
const GET = new Set(['get', 'gets', 'got', 'gotten', 'getting', 'become', 'becomes', 'became', 'feel', 'feels', 'felt', 'seem', 'seems', 'seemed', 'look', 'looks', 'looked', 'remain', 'remains', 'remained', 'stay', 'stays', 'stayed', 'keep', 'kept'])
const BASE_FORM_TRIGGERS = new Set(['to', 'will', 'would', 'can', 'could', 'should', 'must', 'may', 'might', 'shall', 'did', 'do', 'does', "n't", 'not'])
const RELATIVES = new Set(['that', 'which', 'who'])
const DIRECTION_VERBS = new Set(['turn', 'turns', 'turned', 'turning', 'go', 'goes', 'went', 'move', 'moves', 'moved', 'veer', 'veers', 'swing', 'curve', 'curves', 'curved', 'bear', 'pull', 'twist', 'align', 'steer', 'head', 'look', 'keep'])
const LEFT_NOUNS = new Set(['hand', 'hands', 'side', 'foot', 'feet', 'leg', 'arm', 'eye', 'ear', 'wrist', 'lane', 'turn', 'wing', 'field', 'bank', 'shoulder', 'knee', 'corner', 'column', 'page', 'margin', 'half'])
const INTRANSITIVE_AFTER_LAY = new Set(['down', 'on', 'in', 'under', 'beside', 'back', 'at', 'still', 'there', 'awake', 'flat', 'motionless', 'quietly', 'asleep', 'dead', 'face', 'near', 'by', 'across', 'against', 'outside', 'inside'])
const QUANTITY_WORDS = new Set(['no', 'some', 'any', 'much', 'many', 'little', 'few', 'enough', 'nothing', 'anything', 'something', 'none', 'plenty', 'more', 'less'])
const TIME_WORDS = new Set(['each', 'every', 'per', 'today', 'tonight', 'now', 'yet', 'after', 'until', 'till', 'by'])
const PARTICLES = new Set(['down', 'up', 'over', 'backward', 'backwards', 'forward', 'forwards', 'away', 'back', 'low'])
const PREPOSITIONS = new Set(['in', 'on', 'at', 'under', 'inside', 'beneath', 'behind', 'near', 'by', 'from', 'among', 'within', 'throughout', 'nowhere', 'everywhere', 'only', 'across', 'along', 'around', 'during', 'for', 'into', 'of', 'over', 'with', 'without'])

const ADVERB_SKIP = new Set(['already', 'just', 'finally', 'also', 'never', 'often', 'once', 'still', 'ever', 'allegedly', 'recently', 'quickly', 'rarely', 'really', 'not', "n't", 'always', 'suddenly', 'first', 'usually', 'nearly', 'almost', 'probably', 'actually'])

// 文の英語の部分を語に分け、compromise の品詞を付ける。日本語などは文の区切りとして空白にする（位置はずらさない）。
export function tagEnglishText(nlp, text) {
  const source = String(text ?? '').replace(/[^\x20-\x7e\n]/g, ' ')
  const doc = nlp(source)
  const words = []
  for (const sentence of doc.json({ offset: true, terms: { offset: true } })) {
    const start = words.length
    for (const term of sentence.terms ?? []) {
      // 's を is の短縮と見たときにはさまる空の語は、読み分けに使わない。
      if (term.offset?.start == null || !String(term.text ?? '').trim()) continue
      words.push({
        start: term.offset.start,
        text: String(term.text ?? '').toLowerCase(),
        tags: new Set(term.tags ?? []),
        possessive: /'s?\s*$/.test(term.post ?? '') || /'s$/.test(String(term.text ?? '')),
        sentenceStart: words.length === start,
        // 句読点で文や節が切れているか（Turn left. の後ろ）
        clauseEnd: /[.!?;:,]/.test(term.post ?? ''),
      })
    }
  }
  return words
}

const isNounLike = (word) => Boolean(word) && (word.tags.has('Noun') || word.tags.has('Pronoun') || word.tags.has('ProperNoun')) && !DETERMINERS.has(word.text)
const isAdjectiveLike = (word) => Boolean(word) && word.tags.has('Adjective') && !word.tags.has('Verb')

// words[i] が読み分ける語。前後の語（i-1・i+1、間の副詞は読み飛ばす）を返す。
function neighbors(words, i) {
  let p = i - 1
  while (p >= 0 && !words[p + 1].sentenceStart && (ADVERB_SKIP.has(words[p].text) || (words[p].tags.has('Adverb') && /ly$/.test(words[p].text)))) p -= 1
  const prev = p >= 0 && !words[i].sentenceStart ? words[p] : null
  const prev2 = p >= 1 && !words[p].sentenceStart ? words[p - 1] : null
  const next = words[i + 1] && !words[i + 1].sentenceStart && !words[i].clauseEnd ? words[i + 1] : null
  const next2 = next && words[i + 2] && !words[i + 2].sentenceStart && !next.clauseEnd ? words[i + 2] : null
  const window = words.slice(Math.max(0, i - 3), i).filter((word, k, list) => !list.slice(k + 1).some((later) => later.sentenceStart))
  return { prev, prev2, next, next2, window, self: words[i] }
}

// 前後の語の形を、読み分けに使う問いにまとめる。
function contextOf(words, i) {
  const n = neighbors(words, i)
  const prevText = n.prev?.text ?? ''
  // a mammoth found in … の mammoth のように、限定詞のすぐ後の語は、読み分ける語の後ろに前置詞が続くなら、形容詞と判定されても
  // 名詞として扱う（a red rose. や a good thought. は形容詞のまま）。
  const prevIsHeadNoun = isAdjectiveLike(n.prev) && Boolean(n.prev2) && DETERMINERS.has(n.prev2.text) && Boolean(n.next) && PREPOSITIONS.has(n.next.text)
  const determined = Boolean(n.prev) && !prevIsHeadNoun && (DETERMINERS.has(prevText) || n.prev.possessive || n.prev.tags.has('Possessive') || isAdjectiveLike(n.prev))
    // the very ground・the same thought のように、限定詞の後の強めの語をはさんでも名詞の前。
    || (['very', 'same', 'whole', 'only', 'entire', 'own'].includes(prevText) && Boolean(n.prev2) && DETERMINERS.has(n.prev2.text))
  const nounContext = determined || prevText === 'of'
  const nextIsNoun = Boolean(n.next) && isNounLike(n.next) && !OBJECT_WORDS.has(n.next.text)
  const nextIsObject = Boolean(n.next) && (DETERMINERS.has(n.next.text) || OBJECT_WORDS.has(n.next.text) || isNounLike(n.next) || n.next.tags.has('Value'))
  return {
    ...n,
    nounContext,
    determined,
    nextIsNoun,
    nextIsObject,
    afterHave: HAVE.has(prevText),
    afterBe: BE.has(prevText) || prevText === 'being',
    afterBeStrict: BE.has(prevText),
    afterGet: GET.has(prevText),
    afterBaseTrigger: BASE_FORM_TRIGGERS.has(prevText),
    afterSubjectPronoun: SUBJECT_PRONOUNS.has(prevText) || RELATIVES.has(prevText),
    afterNoun: (isNounLike(n.prev) || prevIsHeadNoun) && !nounContext,
    atStart: !n.prev,
  }
}

// 読み分けの決まり。reading(id) は、そのカードが辞書にあれば id を、なければ null を返す。
// 返すのはカードの id（決められないときは null で、ふつうの読み方＝そのままの見出し語にまかせる）。
const RULES = {
  // 名詞のカードと、動詞の過去形
  saw: (c) => nounOrVerb(c, 'saw', 'see', { selfVerbAfterTo: true }),
  rose: (c) => nounOrVerb(c, 'rose', 'rise'),
  bit: (c) => nounOrVerb(c, 'bit', 'bite'),
  ground: (c) => nounOrVerb(c, 'ground', 'grind', { selfVerbAfterTo: true }),
  thought: (c) => nounOrVerb(c, 'thought', 'think'),
  // a living being、every human being（限定詞＋名詞の後）は名詞。for being late、of being sent は be。
  // ただし後ろに過去分詞が続けば受け身の be（the product being tested）。
  being: (c) => {
    if (c.next && (c.next.tags.has('Participle') || c.next.tags.has('PastTense'))) return 'be'
    return c.determined || (isNounLike(c.prev) && c.prev2 && DETERMINERS.has(c.prev2.text)) ? 'being' : 'be'
  },
  lay: (c) => {
    if (c.afterBaseTrigger) return 'lay'
    if (c.next && (INTRANSITIVE_AFTER_LAY.has(c.next.text) || c.next.tags.has('Preposition'))) return 'lie'
    if (c.nextIsObject) return 'lay'
    return 'lie'
  },
  left: (c) => {
    // be left out・left behind・left alone は leave（取り残される・置いていく）。
    if (c.next && ['out', 'behind', 'alone'].includes(c.next.text)) return 'leave'
    if (c.prev?.text === 'the' && c.prev2 && ['to', 'on', 'at', 'from', 'in'].includes(c.prev2.text)) return 'left'
    if (c.next && LEFT_NOUNS.has(c.next.text)) return 'left'
    if (c.nounContext && c.nextIsNoun) return 'left'
    if (c.window.some((word) => DIRECTION_VERBS.has(word.text)) && !c.nextIsObject) return 'left'
    if (c.afterBeStrict) return 'left_2'
    // 名詞のすぐ後で、時を表す語が続けば「残っている」（bread left each day）。場所が続けば leave（litter left on the beach）、
    // 文の切れ目なら主語の後の過去形（when its owner left.）。
    if (c.afterNoun && c.next && TIME_WORDS.has(c.next.text)) return 'left_2'
    // no milk left、nothing left（量を表す語＋名詞の後や、nothing・anything の後）は「残っている」。
    if (c.prev && (QUANTITY_WORDS.has(c.prev.text) || (isNounLike(c.prev) && c.prev2 && QUANTITY_WORDS.has(c.prev2.text)))) return 'left_2'
    return 'leave'
  },
  lost: (c) => {
    if (c.afterHave) return 'lose'
    if (c.nounContext && c.nextIsNoun) return 'lost'
    if (!c.nounContext && !c.afterGet && !c.afterBe && c.next && (DETERMINERS.has(c.next.text) || OBJECT_WORDS.has(c.next.text))) return 'lose'
    if (c.afterGet || c.afterBe || c.atStart) return 'lost'
    if (c.afterSubjectPronoun || c.afterNoun) return 'lose'
    if (c.nextIsNoun) return 'lost'
    return null
  },
  found: (c) => {
    if (c.afterBaseTrigger) return 'found_2'
    if (c.afterHave || c.afterBe) return 'find'
    if (c.afterSubjectPronoun) return 'find'
    if (c.nextIsNoun && !c.afterNoun && !c.atStart) return 'found'
    if (c.afterNoun && c.next && PREPOSITIONS.has(c.next.text)) return 'found'
    return 'find'
  },
  hidden: (c) => participleAdjective(c, 'hidden', 'hide'),
  frozen: (c) => participleAdjective(c, 'frozen', 'freeze'),
  bent: (c) => participleAdjective(c, 'bent', 'bend'),
  driven: (c) => participleAdjective(c, 'driven', 'drive'),
  // be mistaken for … は「〜と取り違えられる」で mistake。You are mistaken.・the mistaken belief は形容詞。
  mistaken: (c) => (c.next?.text === 'for' ? 'mistake' : participleAdjective(c, 'mistaken', 'mistake')),
  bound: (c) => {
    if (c.next?.text === 'for') return 'bound'
    if (c.next?.text === 'to' && !c.afterSubjectPronoun) return 'bound_2'
    return participleAdjective(c, 'bound', 'bind')
  },
}

function nounOrVerb(c, noun, verb, { selfVerbAfterTo = false } = {}) {
  if (c.nounContext) return noun
  // 名詞のカードなら、ふつうは後ろに動詞が続くか、文の終わりの the・a の後に来る。主語らしい語の後で、文の終わり・副詞・前置詞が
  // 続けば動詞（Prices rose. / Costs rose, and … / rose to fame）。
  if (c.afterBaseTrigger) return selfVerbAfterTo ? noun : verb
  if (c.afterHave || c.afterSubjectPronoun || c.afterNoun) return verb
  if (c.prev && !c.atStart && !c.prev.tags.has('Adverb') && c.prev.text !== 'very'
    && (!c.next || c.next.tags.has('Adverb') || c.next.tags.has('Preposition'))) return verb
  if (c.atStart && c.nextIsNoun) return noun
  if (c.self.tags.has('Verb') && !c.self.tags.has('Noun')) return verb
  return noun
}

// 形容詞のカード（hidden ＝ 隠れた）と、動詞の過去形・過去分詞（hide）。
function participleAdjective(c, adjective, verb) {
  if (c.afterHave) return verb
  if (c.nounContext && c.nextIsNoun) return adjective
  if (c.afterBe || c.afterGet || c.atStart) return adjective
  if (c.afterSubjectPronoun) return verb
  if (c.afterNoun) {
    // 名詞の後で目的語や down・backward などが続けば、その名詞が主語の過去形（The storm bent the antenna、He bent down）。
    // 前置詞と名詞が続けば、名詞を後ろから説明する過去分詞（a pit hidden under the leaves）。
    if (c.nextIsObject) return verb
    if (c.next && PARTICLES.has(c.next.text) && !(c.next2 && DETERMINERS.has(c.next2.text))) return verb
    return adjective
  }
  return adjective
}

export const CONTEXT_FORMS = Object.freeze(Object.keys(RULES))

// text の中の、位置 start から始まる並び token の読みのカード id を返す（読み分けない並びや、決められないときは null）。
export function contextReadingAt(words, start, token, hasCard) {
  const rule = RULES[token]
  if (!rule) return null
  const i = words.findIndex((word) => word.start === start)
  if (i < 0) return null
  const id = rule(contextOf(words, i))
  return id && hasCard(id) ? id : null
}

// 読み取った文字 text の英語に品詞を付け、matchOcrTextToWords の options.contextReading に渡す関数を作る。
export function createContextReading(nlp, text, words) {
  const tagged = tagEnglishText(nlp, text)
  const ids = new Set(words.map((word) => word.id))
  return (index, token) => contextReadingAt(tagged, index, token, (id) => ids.has(id))
}

let loading = null
export function loadEnglishTagger() {
  loading ??= import('compromise/two').then((module) => module.default).catch((reason) => {
    loading = null
    throw reason
  })
  return loading
}
