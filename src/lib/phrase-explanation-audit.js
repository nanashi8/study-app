import {
  LONG_SENTENCE_CORE_WORD_LIMIT,
  LONG_SENTENCE_MODIFIER_WORD_LIMIT,
  LONG_SENTENCE_TRANSLATIONS,
  isLongSyntaxSentence,
} from '../data/long-sentence-translations.js'
import { PASSAGES } from '../data/passages.js'
import { PHRASES } from '../data/phrases.js'
import { READING_PHRASE_CORRECTIONS } from '../data/reading-phrase-corrections.js'
import {
  READING_CONNECTOR_CLOSURE_REVIEWS,
  READING_CONNECTOR_NO_BACK_REFERENCE_REVIEWS,
} from '../data/reading-connector-closure-reviews.js'
import {
  LONG_MANUAL_REVIEW_LEDGER,
  READING_MANUAL_REVIEW_LEDGER,
} from '../data/reading-phrase-review-ledger.js'
import { READING_PHRASE_RULES } from '../data/reading-phrase-rules.js'
import { LONG_SENTENCE_ROLE_EXPECTATIONS } from '../data/long-sentence-role-expectations.js'
import { PUBLIC_DOMAIN_LITERATURE } from '../data/public-domain-literature.js'
import {
  READING_CORE_PHRASE_WORD_LIMIT,
  READING_MODIFIER_PHRASE_WORD_LIMIT,
  analyzeReadingSentence,
} from './reading-grammar.js'
import {
  serializeStructureTokens,
  structureGroupOutline,
} from './structure-markers.js'
import { japanesePhraseSpeechText } from './phrase-speech.js'

const PREPOSITIONS = new Set([
  'about', 'across', 'after', 'against', 'along', 'among', 'around', 'at',
  'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'by',
  'despite', 'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'near',
  'of', 'on', 'onto', 'outside', 'over', 'through', 'throughout', 'to',
  'toward', 'under', 'until', 'upon', 'with', 'within', 'without',
])

const AUXILIARIES = new Set([
  'am', 'are', 'be', 'been', 'being', 'can', 'could', 'did', 'do', 'does',
  'had', 'has', 'have', 'is', 'may', 'might', 'must', 'shall', 'should',
  'was', 'were', 'will', 'would',
])

const AUXILIARY_INTERNAL_WORDS = new Set([
  'also', 'already', 'always', 'ever', 'merely', 'never', 'not', 'often',
  'only', 'perhaps', 'probably', 'rarely', 'sometimes', 'still', 'therefore',
  'usually', 'yet',
])

const INFINITIVE_BASE_VERBS = new Set([
  'abandon', 'accept', 'admit', 'ask', 'be', 'build', 'care', 'challenge',
  'change', 'choose', 'collect', 'combine', 'describe', 'distinguish', 'do',
  'dominate', 'drink', 'eat', 'estimate', 'examine', 'exercise', 'feel', 'fix',
  'force', 'gain', 'grow', 'hear', 'improve', 'invite', 'join', 'judge', 'learn',
  'make', 'map', 'measure', 'move', 'observe', 'open', 'optimize', 'plan',
  'prepare', 'preserve', 'prevent', 'protect', 'question', 'read', 'reduce',
  'report', 'research', 'revise', 'sell', 'share', 'sit', 'stay', 'stop',
  'store', 'study', 'talk', 'teach', 'think', 'treat', 'try', 'understand',
  'use', 'watch',
])

const SPECIAL_CLAUSE_CUES = new Set([
  'although', 'as', 'because', 'if', 'since', 'so that', 'though', 'unless',
  'when', 'where', 'whereas', 'whether', 'while',
])

const normalizeEnglish = (value = '') => value
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/\s+/g, ' ')
  .trim()

const englishWords = (value = '') =>
  value.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []

const normalizedWords = (value = '') => englishWords(value).map((word) => word.toLowerCase())
const phraseKey = (value = '') => normalizedWords(value).join(' ')
const rolesOf = (phrase) => [...new Set(phrase.roles ?? (phrase.role ? [phrase.role] : []))]

const CONNECTOR_CLOSURE_CANDIDATES = new Set([
  'after', 'although', 'as', 'because', 'before', 'even though', 'even when',
  'especially when', 'if', 'just as', 'not because', 'once', 'since',
  'so that', 'unless', 'when', 'whereas', 'while',
])

const connectorReviewKey = (sentence, connector, occurrence = 1) =>
  `${sentence}|||${phraseKey(connector)}|||${occurrence}`

const connectorBackReferenceReviewKeys = new Set(
  READING_CONNECTOR_CLOSURE_REVIEWS.map((item) =>
    connectorReviewKey(item.sentence, item.connector, item.occurrence ?? 1)),
)

const connectorNoBackReferenceReviewKeys = new Set(
  READING_CONNECTOR_NO_BACK_REFERENCE_REVIEWS.map((item) =>
    connectorReviewKey(item.sentence, item.connector, item.occurrence)),
)

function sameEnglish(left, right) {
  return JSON.stringify(normalizedWords(left)) === JSON.stringify(normalizedWords(right))
}

function wordLimitFor(phrase, coreLimit, modifierLimit) {
  if (Number.isFinite(phrase.wordLimit)) return phrase.wordLimit
  return rolesOf(phrase).some((role) => role === 'M' || role === 'LINK')
    ? modifierLimit
    : coreLimit
}

function auxiliaryOnlyPhrase(value = '') {
  const tokens = normalizedWords(value)
  if (!tokens.length) return false
  const meaningful = tokens.filter((token) => !AUXILIARY_INTERNAL_WORDS.has(token))
  if (!meaningful.length) return false
  // can do / will do の do はこの位置では本動詞。「助動詞だけ」の句ではない。
  if (meaningful.length > 1 && meaningful.at(-1) === 'do') return false
  return meaningful.every((token, index) =>
    AUXILIARIES.has(token) ||
    (token === 'to' && index > 0 && ['have', 'has', 'had', 'ought', 'used'].includes(meaningful[index - 1])))
}

function splitAuxiliaryIssue(parts, index) {
  const current = parts[index]
  if (!rolesOf(current).includes('V') || !auxiliaryOnlyPhrase(current.en)) return null
  let nextIndex = index + 1
  while (
    nextIndex < parts.length &&
    rolesOf(parts[nextIndex]).length === 1 &&
    rolesOf(parts[nextIndex]).includes('M') &&
    nextIndex - index <= 2
  ) nextIndex++
  const next = parts[nextIndex]
  if (!next || !rolesOf(next).includes('V')) return null
  // 倒置では助動詞Vと本動詞Vの間に主語Sが来る。この正しい節境界は除外する。
  if (parts.slice(index + 1, nextIndex).some((part) => rolesOf(part).includes('S'))) return null
  const localExplanation = parts.slice(index, nextIndex + 1)
    .map((part) => `${part.explanation ?? part.grammarNote ?? part.note ?? ''}`)
    .join(' ')
  if (/(?:比較|別動作|補語|挿入|助動詞.*分け|役割.*分け)/.test(localExplanation)) return null
  return { nextIndex, nextPhrase: next.en }
}

function isPrepositionFragment(parts, index) {
  const phrase = parts[index]
  const key = phraseKey(phrase.en)
  if (!(
    rolesOf(phrase).includes('M') &&
    englishWords(phrase.en).length === 1 &&
    PREPOSITIONS.has(key)
  )) return false
  // 厳密な役割境界で前置詞だけを出す場合は、本文別noteが後続の対象まで
  // 明示して付けた binding メタデータを必須にする。
  return !phrase.prepositionBinding
}

function expectedSpecialGrammar(phrase) {
  const key = phraseKey(phrase.en)
  const first = key.split(' ')[0]
  const roles = rolesOf(phrase)
  const expected = []
  const explanation = `${phrase.explanation ?? phrase.grammarNote ?? phrase.note ?? ''}`
  const correlativeAs = key === 'as' && /not so much/i.test(explanation)

  if (
    ['that', 'which', 'who', 'whom'].includes(key) &&
    roles.some((role) => role === 'S' || role === 'O')
  ) expected.push('relative-or-interrogative')
  if (first === 'whose' && key.split(' ').length > 1) expected.push('relative-determiner')
  if (['what', 'which', 'who', 'whom', 'where', 'how', 'why', 'whether'].includes(first)) {
    expected.push('clause-function')
  }
  if (/^(?:by|from|about|in|through|on|over) (?:what|which|whether|how)$/.test(key)) {
    expected.push('preposition-wh-clause')
  }
  if (['and', 'or', 'but', 'yet', 'nor'].includes(key)) expected.push('coordination-scope')
  if (
    ['even', 'even when', 'even though', 'only', 'no longer', 'not by', 'not', 'neither'].includes(key) ||
    key.startsWith('none of ')
  ) expected.push('negative-or-focus-scope')
  if (SPECIAL_CLAUSE_CUES.has(key) && !correlativeAs) expected.push('clause-relation')
  if (key === 'as long as') expected.push('clause-relation')

  const infinitive = key.match(/^to ([a-z]+)/)
  if (
    infinitive &&
    INFINITIVE_BASE_VERBS.has(infinitive[1]) &&
    (roles.includes('V') || roles.includes('C') || ['challenge', 'question', 'store'].includes(infinitive[1]))
  ) expected.push('infinitive-function')

  if (key === 'than' && /No sooner/i.test(explanation)) expected.push('correlative-sequence')
  if (
    key === 'less' || (key === 'than' && !/No sooner/i.test(explanation)) || key.startsWith('not only') ||
    key.startsWith('but also') || key.startsWith('rather than') ||
    (key !== 'as long as' && /^as .+ as(?: |$)/.test(key)) || correlativeAs
  ) expected.push('comparison')
  if (key === 'as well') expected.push('additive-idiom')
  if (/^as [a-z]/.test(key) && key !== 'as well' && !/^as .+ as(?: |$)/.test(key)) {
    expected.push(roles.includes('C') ? 'as-complement' : 'as-viewpoint-or-target')
  }

  return [...new Set(expected)]
}

function hasSpecificExplanation(phrase, expected) {
  if (!expected.length) return true
  const actualKinds = Array.isArray(phrase.specialGrammar) ? phrase.specialGrammar : []
  const compatibleKinds = {
    'relative-or-interrogative': new Set(['relative', 'relative-determiner', 'relative-adverb', 'embedded-question']),
    'relative-determiner': new Set(['relative', 'relative-determiner']),
    'clause-function': new Set(['content-clause', 'embedded-question', 'relative', 'relative-adverb']),
    'clause-relation': new Set(['clause-connector', 'content-clause', 'embedded-question', 'reduced-clause', 'relative-adverb']),
    'preposition-wh-clause': new Set(['fused-relative', 'preposition-relative', 'preposition-embedded-question']),
    'coordination-scope': new Set(['coordination']),
    'negative-or-focus-scope': new Set(['focus', 'focus-clause', 'negative-focus', 'negative-quantifier', 'negative-correlative']),
    'infinitive-function': new Set(['infinitive']),
    comparison: new Set(['comparison', 'correlative']),
    'correlative-sequence': new Set(['correlative', 'clause-connector']),
    'additive-idiom': new Set(['additive-idiom']),
    'as-complement': new Set(['as-complement']),
    'as-viewpoint-or-target': new Set(['as-viewpoint', 'comparison']),
  }
  if (
    actualKinds.length &&
    expected.every((kind) =>
      actualKinds.some((actual) => compatibleKinds[kind]?.has(actual)))
  ) return true
  const explanation = `${phrase.explanation ?? phrase.grammarNote ?? phrase.note ?? ''}`.trim()
  const roleNote = `${phrase.roleNote ?? ''}`.trim()
  const itemSpecific = roleNote && explanation.endsWith(roleNote)
    ? explanation.slice(0, -roleNote.length).trim()
    : explanation
  if (!itemSpecific) return false
  const supports = {
    'relative-or-interrogative': /(?:関係|先行詞|間接疑問|疑問詞|問い)/,
    'relative-determiner': /(?:関係限定詞|whose|先行詞)/,
    'clause-function': /(?:関係|先行詞|内容節|間接疑問|疑問詞|問い)/,
    'clause-relation': /(?:理由|条件|時の(?:節|副詞節)|対比|譲歩|同時|内容節|間接疑問|省略)/,
    'preposition-wh-clause': /(?:先行詞を含む|前置詞.*(?:関係|間接疑問)|前置詞の目的語|節全体.*対象)/,
    'coordination-scope': /(?:並列|共通|追加|選択|対比|切り替|一つ目|二つ目|新しい節)/,
    'negative-or-focus-scope': /(?:焦点|限定|否定|どちらも|どれ一つ|でさえ|もはや|後続V|範囲|neither|nor)/i,
    'infinitive-function': /(?:不定詞|\bO to do\b|\bto do\b|意味上の主語)/i,
    comparison: /(?:比較|呼応|more|less|than|not only|but also|rather than)/i,
    'correlative-sequence': /(?:No sooner|即時|後件|呼応)/i,
    'additive-idiom': /(?:as well|もまた|追加.*熟語)/i,
    'as-complement': /(?:補語C|O as C|何として|何と(?:説明|扱|発表|見))/i,
    'as-viewpoint-or-target': /(?:観点|比較対象|the same|同じ.*として|Mで)/i,
  }
  return expected.every((kind) => supports[kind]?.test(itemSpecific))
}

function patternCounts(sentences) {
  const patterns = {
    that: /\bthat\b/i,
    what: /\bwhat\b/i,
    relative: /\b(?:who|whom|whose|which|that)\b/i,
    comparison: /\b(?:more|less|than|as\s+\w+\s+as|better|worse|rather than|not only)\b/i,
    passive: /\b(?:am|are|is|was|were|be|been|being)\s+(?:\w+ly\s+)?\w+(?:ed|en)\b/i,
    infinitive: /\bto\s+[a-z]+\b/i,
    coordination: /\b(?:and|but|or|nor)\b/i,
    conditional: /\b(?:if|unless|provided that|as long as)\b/i,
    inversion: /^(?:Never|No sooner|Only|Rarely|Seldom|Hardly|Were|Had|Should)\b/i,
  }
  return Object.freeze(Object.fromEntries(
    Object.entries(patterns).map(([name, pattern]) => [
      name,
      sentences.filter((sentence) => pattern.test(sentence)).length,
    ]),
  ))
}

function correctionOccurrenceCount(phrases, parts) {
  let count = 0
  for (let start = 0; start <= phrases.length - parts.length; start++) {
    const matches = parts.every((part, offset) => {
      const phrase = phrases[start + offset]
      const actualKey = phraseKey(phrase.en)
      const expectedKey = phraseKey(part.en)
      return (
        (actualKey === expectedKey || actualKey.startsWith(`${expectedKey} `)) &&
        phrase.role === part.role
      )
    })
    if (matches) count++
  }
  return count
}

function coordinationBindingIssue(parts, index) {
  const phrase = parts[index]
  const key = phraseKey(phrase.en)
  if (!['and', 'or', 'but', 'yet', 'nor'].includes(key)) return null
  const binding = phrase.coordinationBinding
  if (!binding) return 'coordinationBinding がありません'
  if (binding.type === 'unresolved') return '並列項の支配関係が未確定です'
  for (const field of ['type', 'left', 'right', 'governor']) {
    if (!`${binding[field] ?? ''}`.trim()) return `${field} がありません`
  }
  const explanation = `${phrase.explanation ?? phrase.grammarNote ?? ''}`
  if (/構造を切り替えて/.test(explanation)) return '役割の切替だけで並列を説明しています'
  const previous = parts[index - 1]
  const next = parts[index + 1]
  if (
    previous?.role === 'S' &&
    next?.role === 'S' &&
    !['compound-subject', 'compound-gerund-subject', 'correlative-compound-subject'].includes(binding.type)
  ) {
    return 'S列挙を新しい節として扱っています'
  }
  const nextKey = phraseKey(next?.en)
  const previousWh = parts.slice(0, index).some((item) =>
    /^(?:how|what|which|who|where|when|why|whether)(?:\b|$)/.test(phraseKey(item.en)))
  if (
    /^(?:how|what|which|who|where|when|why|whether)(?:\b|$)/.test(nextKey) &&
    previousWh &&
    binding.type === 'clause-coordination'
  ) return '並列された埋込み疑問を新しい主節として扱っています'
  return null
}

// if節内のVより後ろにO/C/Mが続く場合、日本語はVで「〜なら」を早く
// 閉じず、節末の対応フレーズで条件全体を受け直す。対象の有無は横断検出し、
// 本文ごとの正しい値は READING_BINDING_EXPECTATIONS で別途deepEqualする。
function conditionalClosureIssues(parts) {
  const connectorIndexes = parts
    .map((part, index) => ({ index, key: phraseKey(part.en) }))
    .filter(({ key }) => ['if', 'unless', 'as long as'].includes(key))
    .map(({ index }) => index)
  const issues = []

  for (const start of connectorIndexes) {
    const nextConnector = connectorIndexes.find((index) => index > start)
    const mainClauseStart = parts.findIndex((part, index) =>
      index > start && `${part.scope ?? ''}` === '')
    let end = mainClauseStart > start ? mainClauseStart - 1 : parts.length - 1
    if (nextConnector && nextConnector <= end) {
      end = nextConnector - 1
      if (['and', 'or'].includes(phraseKey(parts[end]?.en))) end--
    }
    if (end <= start) continue

    let lastVerb = -1
    for (let index = start + 1; index <= end; index++) {
      if (rolesOf(parts[index]).includes('V')) lastVerb = index
    }
    if (lastVerb < 0) continue
    const hasTrailingRole = parts.slice(lastVerb + 1, end + 1)
      .some((part) => rolesOf(part).some((role) => ['O', 'O1', 'O2', 'C', 'M'].includes(role)))
    if (!hasTrailingRole) continue
    const closure = parts.slice(start, end + 1).find((part) => part.conditionBinding)
    if (!closure) issues.push({ start, end, lastVerb })
  }
  return issues
}

const PUNCTUATION_BOUNDARY_SENTENCES = new Map([
  ['Such observations do not replace scientific data; they reveal where additional measurement is needed.', ';'],
  ['Preservation, therefore, is not merely the retention of data; it includes maintaining the pathways that make data intelligible and discoverable.', ';'],
  ['A photograph may reveal suffering to one group and national achievement to another; a monument may be seen as heritage by some and as exclusion by others.', ';'],
  ['Responsible readers are not people who doubt everything; they are people who match their confidence to the quality of the evidence.', ';'],
  ['For these users, refusing cash does more than remove a familiar habit; it can limit access to food, transport, and public life.', ';'],
  ['Narrative evidence and interviews can explain why behavior changed; they do not eliminate the need for measurement.', ';'],
  ['The measurement process should therefore remain visible; its assumptions, revisions, and uncertainties should be open to challenge.', ';'],
  ['This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.', ':'],
])

const ZERO_RELATIVE_TARGETS = new Set([
  'The museum has also changed the way it prepares labels for new displays.|||it',
  'The students also record the questions visitors ask most often, and the museum uses this feedback when planning future exhibitions.|||visitors',
  'Modern institutions measure almost everything they hope to improve in complex systems with competing public purposes.|||they',
  'Evaluation systems must be adaptive because the behavior they observe changes in response to observation.|||they',
  'Those who design indicators should therefore be answerable for their consequences, including the administrative labor they create.|||they',
])

const STRUCTURAL_DISPLAY_TARGETS = new Map([
  ["Children can listen to stories, make small cards, and borrow books about the month's topic.|||make", '(can) make'],
  ["Children can listen to stories, make small cards, and borrow books about the month's topic.|||borrow", '(can) borrow'],
  ['Parents may help, but each child should write a name on the model and take it home at noon.|||take', '(should) take'],
  ['They had to choose a sunny place, remove stones from the soil, and water the young plants every day.|||remove', '(had to) remove'],
  ['They had to choose a sunny place, remove stones from the soil, and water the young plants every day.|||water', '(had to) water'],
  ['Their science teacher asked each group to make a schedule and write short notes about the weather.|||write', '(to) write'],
  ['They may not know the answer to every question, so they are taught to admit uncertainty and ask a staff member for help.|||ask', '(to) ask'],
  ['Visitors are expected to sit with volunteers and take part in the work instead of simply leaving an item at a counter.|||take part', '(to) take part'],
  ['A volunteer may show someone how to open a lamp safely, replace a worn wire, or search for instructions online.|||replace', '(how to) replace'],
  ['A volunteer may show someone how to open a lamp safely, replace a worn wire, or search for instructions online.|||search', '(how to) search'],
  ['This evidence makes it easier to improve a design or decide that a simpler solution would work better.|||decide', '(to) decide'],
  ['Visitors may not notice the system at all, yet it affects how long they can read or study without becoming tired.|||study', '(can) study'],
  ['This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.|||deepen', '(can) deepen'],
  ['A park that cools a wealthy district, for example, may increase nearby rents and force lower-income residents to move before they enjoy the benefits.|||force', '(may) force'],
  ['A document can survive for centuries and still fail to influence how later generations understand the past.|||fail to influence', '(can) fail to influence'],
  ['A file may still exist but become unreadable when software changes, while a searchable collection can effectively disappear if its indexing system is neglected.|||become', '(may) become'],
  ['It also requires citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears.|||tolerate', '(to) tolerate'],
  ['It also requires citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears.|||revise', '(to) revise'],
  ['The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.|||confronting', '(in) confronting'],
  ['The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.|||stating', '(in) stating'],
  ['Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.|||recognize', '(to) recognize'],
  ['Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.|||deliberate', '(to) deliberate'],
  ['Cash usually leaves no detailed record linking a person to a particular purchase, whereas digital payment creates data that may be stored, combined, or sold.|||combined', '(may be) combined'],
  ['Cash usually leaves no detailed record linking a person to a particular purchase, whereas digital payment creates data that may be stored, combined, or sold.|||sold', '(may be) sold'],
  ['Such records can detect fraud and improve services, yet they can also reveal medical needs, political interests, or daily movements.|||improve', '(can) improve'],
  ['A common response is to teach digital skills and provide low-cost accounts.|||provide', '(to) provide'],
  ['A hospital may transfer difficult patients or redefine when the waiting-time clock officially starts.|||redefine', '(may) redefine'],
  ['Researchers can then compare similar observations and estimate where the data may be incomplete.|||estimate', '(can) estimate'],
  ['Together, they can follow changes in biodiversity and identify places that may need conservation.|||identify', '(can) identify'],
  ['They should direct attention toward patterns that require explanation, provide feedback for revision, and reveal whether policies serve their stated mission.|||provide', '(should) provide'],
  ['They should direct attention toward patterns that require explanation, provide feedback for revision, and reveal whether policies serve their stated mission.|||reveal', '(should) reveal'],
  ['The program will teach simple traffic rules and show people how to prevent common bicycle accidents.|||show', '(will) show'],
  ['Two historians may accept the same evidence yet assign different significance to it because they ask different questions.|||assign', '(may) assign'],
  ['For example, the records may show that a species is arriving earlier in spring or disappearing from certain neighborhoods.|||disappearing', '(is) disappearing'],
  ['A community can then balance health benefits with local challenges and test whether its plan is effective.|||test', '(can) test'],
  ['Digital records can also help consumers follow their spending and allow small businesses to sell goods online.|||allow', '(can) allow'],
  ['When a decision involves serious health risks, online reading should support, not replace, advice from a qualified professional.|||replace', '(should) replace'],
  ['Once rewards or penalties depend heavily on the score, people have an incentive to optimize the proxy rather than pursue the underlying mission.|||pursue', '(to) pursue'],
  ['If measurement increases surveillance below but accountability does not increase above, the system may weaken rather than strengthen legitimacy.|||strengthen', '(may) strengthen'],
  ['The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.|||rather than merely obey', 'rather than (can) merely obey'],
])

// 生成規則とは独立した回帰期待値。値が「存在する」だけではなく、本文ごとに
// type / governor / semanticSubject / 並列scopeが一致することを検査する。
const READING_BINDING_EXPECTATIONS = new Map([
  ['Some wanted to use a strong chemical spray, but the teacher asked them to research safer choices first.|||to research', { infinitiveBinding: { type: 'object-to-infinitive', governor: 'asked', semanticSubject: 'them' } }],
  ['It also gives independent researchers a way to test whether alternative definitions would tell a substantially different story.|||to test', { infinitiveBinding: { type: 'noun-modifier', governor: 'a way', semanticSubject: 'independent researchers' } }],
  ['It also gave them a chance to talk with older people who knew many useful farming tips.|||to talk', { infinitiveBinding: { type: 'noun-modifier', governor: 'a chance', semanticSubject: 'them' } }],
  ['Extending the life of a product reduces waste and lowers demand for the energy and resources required to make new goods.|||to make', { infinitiveBinding: { type: 'adjective-complement', governor: 'required', semanticSubject: 'resourcesを必要とする生産者' } }],
  ['Because buying a new item is often easier than finding someone to fix the old one, usable products become waste.|||to fix', { infinitiveBinding: { type: 'noun-modifier', governor: 'someone', semanticSubject: 'someone' } }],
  ['Some modern products are also designed so that they are difficult to open without special tools.|||to open', { infinitiveBinding: { type: 'adjective-complement', governor: 'difficult', semanticSubject: 'productsを開ける人' } }],
  ['This evidence makes it easier to improve a design or decide that a simpler solution would work better.|||to improve', { infinitiveBinding: { type: 'anticipatory-object-content', governor: 'makes it easier', semanticSubject: '設計を改善する人' } }],
  ['This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.|||to reduce', { infinitiveBinding: { type: 'noun-modifier', governor: 'an attempt', semanticSubject: '試みを行う主体' } }],
  ['Some cities have begun to invite residents to map dangerous intersections, hot streets, and places where water remains after heavy rain.|||to map', { infinitiveBinding: { type: 'object-to-infinitive', governor: 'invite', semanticSubject: 'residents' } }],
  ['Because these measures are less dramatic, they are often the first to be reduced when budgets become tight.|||to be reduced', { infinitiveBinding: { type: 'ordinal-complement', governor: 'the first', semanticSubject: 'these measures / they' } }],
  ['It is now possible to store enormous amounts of information at little cost, and many people therefore believe that forgetting has become less likely.|||to store', { infinitiveBinding: { type: 'extraposed-subject-content', governor: 'It is now possible', semanticSubject: '情報を保存する一般の主体' } }],
  ['Institutions must be free to preserve uncomfortable evidence, while citizens must be able to ask how decisions about selection, description, and access are made.|||to preserve', { infinitiveBinding: { type: 'adjective-complement', governor: 'free', semanticSubject: 'Institutions' } }],
  ['Institutions must be free to preserve uncomfortable evidence, while citizens must be able to ask how decisions about selection, description, and access are made.|||to ask', { infinitiveBinding: { type: 'adjective-complement', governor: 'able', semanticSubject: 'citizens' } }],
  ['Accountability must consequently include transparent reasons, opportunities for challenge, and continuing efforts to hear people who were absent from the original decision.|||to hear', { infinitiveBinding: { type: 'noun-modifier', governor: 'continuing efforts', semanticSubject: '説明責任を担う主体' } }],
  ['If every account of the past is dismissed as merely political, citizens lose the capacity to distinguish careful revision from deliberate distortion.|||to distinguish', { infinitiveBinding: { type: 'noun-modifier', governor: 'the capacity', semanticSubject: 'citizens' } }],
  ['It also requires citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears.|||to read', { infinitiveBinding: { type: 'adjective-complement', governor: 'willing', semanticSubject: 'citizens' } }],
  ['If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.|||to learn', { infinitiveBinding: { type: 'noun-modifier', governor: 'their ability', semanticSubject: 'societies' } }],
  ['A science class decided to study the problem instead of simply asking everyone to eat more.|||to eat', { infinitiveBinding: { type: 'object-to-infinitive', governor: 'asking', semanticSubject: 'everyone' } }],
  ['Some parents also depend on older children to care for younger family members after school.|||to care for', { infinitiveBinding: { type: 'semantic-subject-complement', governor: 'depend on', semanticSubject: 'older children' } }],
  ['This cooperation made families more willing to try the new schedule for a full year.|||to try', { infinitiveBinding: { type: 'adjective-complement', governor: 'willing', semanticSubject: 'families' } }],
  ['They should also teach students that a later start is not an invitation to stay online longer at night.|||to stay', { infinitiveBinding: { type: 'noun-modifier', governor: 'an invitation', semanticSubject: 'students' } }],
  ['They may ask participants to watch for the same length of time and to report visits when no birds appeared.|||to watch', { infinitiveBinding: { type: 'object-to-infinitive', governor: 'ask', semanticSubject: 'participants' } }],
  ['They may ask participants to watch for the same length of time and to report visits when no birds appeared.|||to report', { infinitiveBinding: { type: 'parallel-object-to-infinitive', governor: 'ask', semanticSubject: 'participants' } }],
  ['Instead, they help readers to judge how strong a conclusion can reasonably be.|||to judge', { infinitiveBinding: { type: 'object-to-infinitive', governor: 'help', semanticSubject: 'readers' } }],
  ['Some people do not have a bank account, a suitable phone, reliable internet access, or the identity documents required to open a digital account.|||to open', { infinitiveBinding: { type: 'adjective-complement', governor: 'required / identity documents', semanticSubject: '口座を開設する人' } }],
  ['Some governments therefore require essential businesses to accept cash while encouraging digital innovation elsewhere.|||to accept', { infinitiveBinding: { type: 'object-to-infinitive', governor: 'require', semanticSubject: 'essential businesses' } }],
  ['No collection of measures eliminates judgment, but plural indicators make it harder for one narrow target to dominate behavior.|||to dominate', { infinitiveBinding: { type: 'anticipatory-object-content', governor: 'make it harder', semanticSubject: 'one narrow target' } }],
  ['Rather, a mature society keeps multiple perspectives in conversation while refusing to treat evidence as optional.|||to treat', { infinitiveBinding: { type: 'verb-complement', governor: 'refusing', semanticSubject: 'a mature society' } }],
  ['It should be to preserve meaningful alternatives while removing barriers that prevent people from choosing freely.|||to preserve', { infinitiveBinding: { type: 'subject-complement', governor: 'should be / It (= The goal)', semanticSubject: '目標を実行する主体' } }],

  ['This small difference can reduce stress, especially for elderly passengers or parents traveling with children.|||especially for elderly passengers or parents traveling', { ingBinding: { type: 'postpositive-participle', governor: 'parents', semanticSubject: 'parents' } }],
  ['It should be to preserve meaningful alternatives while removing barriers that prevent people from choosing freely.|||from choosing', { ingBinding: { type: 'preposition-gerund', governor: 'prevent people from', semanticSubject: 'people' } }],
  ['A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.|||neglecting', { ingBinding: { type: 'reduced-adverbial', governor: 'while (a school is) neglecting', semanticSubject: 'A school' } }],
  ['Without records, leaders may celebrate a program’s intentions while ignoring evidence that it repeatedly fails particular communities.|||ignoring', { ingBinding: { type: 'reduced-adverbial', governor: 'while (leaders are) ignoring', semanticSubject: 'leaders' } }],
  ['There is also a political question about who bears the burden of being measured.|||the burden of being measured', { ingBinding: { type: 'passive-gerund', governor: 'of', semanticSubject: 'who / people who bear the burden' } }],
  ['Institutions can strengthen trust by publicly stating that limit because this prevents precision from being mistaken for certainty.|||from being mistaken for certainty', { ingBinding: { type: 'passive-gerund', governor: 'prevents precision from', semanticSubject: 'precision' } }],
  ['When it remains one disciplined source of evidence among others, measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value over time.|||across changing circumstances', { ingBinding: { type: 'attributive-participle', governor: 'circumstances', semanticSubject: 'circumstances' } }],
  ['When it remains one disciplined source of evidence among others, measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value over time.|||competing interpretations', { ingBinding: { type: 'attributive-participle', governor: 'interpretations', semanticSubject: 'interpretations' } }],
  ['Sometimes a product is badly damaged, but in other cases only a small part has stopped working.|||has stopped working', { ingBinding: { type: 'gerund-complement', governor: 'stopped', semanticSubject: 'only a small part' } }],
  ['They learned that certain flowers attract insects that eat garden pests without harming the vegetables.|||without harming', { ingBinding: { type: 'preposition-gerund', governor: 'without', semanticSubject: 'insects（関係代名詞thatが受ける先行詞）' } }],
  ['If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.|||from losing', { ingBinding: { type: 'preposition-gerund', governor: 'prevent societies from', semanticSubject: 'societies' } }],
  ['Instead of simply giving the food away, the students visited the center and explained how they had grown it.|||giving', { ingBinding: { type: 'preposition-gerund', governor: 'instead of', semanticSubject: 'the students' } }],
  ['This approach is more useful than giving visitors information that may be incorrect.|||giving', { ingBinding: { type: 'comparison-gerund', governor: 'than', semanticSubject: '情報を与える不特定の案内者' } }],
  ['Because buying a new item is often easier than finding someone to fix the old one, usable products become waste.|||than finding', { ingBinding: { type: 'comparison-gerund', governor: 'than', semanticSubject: '修理人を探す人' } }],
  ['Visitors are expected to sit with volunteers and take part in the work instead of simply leaving an item at a counter.|||leaving', { ingBinding: { type: 'preposition-gerund', governor: 'instead of', semanticSubject: 'Visitors' } }],
  ['They provide shade, absorb rainwater, improve air quality, and make streets more pleasant for walking.|||for walking', { ingBinding: { type: 'preposition-gerund', governor: 'for', semanticSubject: '通りを歩く一般の利用者' } }],
  ['Setting review dates and publishing results allows governments to revise policies without treating revision as failure.|||treating', { ingBinding: { type: 'preposition-gerund', governor: 'without', semanticSubject: 'governments' } }],
  ['More subtly, platforms can revise the categories and rankings through which users encounter material without deleting a single record.|||without deleting', { ingBinding: { type: 'preposition-gerund', governor: 'without', semanticSubject: 'platforms' } }],
  ['Rather, a mature society keeps multiple perspectives in conversation while refusing to treat evidence as optional.|||while refusing', { ingBinding: { type: 'reduced-adverbial', governor: 'while (a mature society is) refusing', semanticSubject: 'a mature society' } }],
  ['Education plays a central role in sustaining that discipline, but the task is more demanding than adding a few historical dates to a curriculum.|||than adding', { ingBinding: { type: 'comparison-gerund', governor: 'than', semanticSubject: '日付を加える教育実践者' } }],
  ['The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.|||in explaining', { ingBinding: { type: 'preposition-gerund', governor: 'lies in', semanticSubject: '規律を実践する主体' } }],
  ['The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.|||confronting', { ingBinding: { type: 'preposition-gerund', governor: 'lies in', semanticSubject: '規律を実践する主体' } }],
  ['The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.|||stating', { ingBinding: { type: 'preposition-gerund', governor: 'lies in', semanticSubject: '規律を実践する主体' } }],
  ['At the same time, they need intellectual habits that prevent skepticism from turning into cynicism.|||from turning', { ingBinding: { type: 'preposition-gerund', governor: 'prevent skepticism from', semanticSubject: 'skepticism' } }],
  ['A science class decided to study the problem instead of simply asking everyone to eat more.|||asking', { ingBinding: { type: 'preposition-gerund', governor: 'instead of', semanticSubject: 'A science class' } }],
  ['Careful changes are more useful than keeping an old schedule simply because it is familiar, especially when schools review them regularly.|||than keeping', { ingBinding: { type: 'comparison-gerund', governor: 'than', semanticSubject: '学校など予定を決める主体' } }],
  ['The partnership also shows that useful science depends on recording uncertainty as honestly as discovery.|||on recording', { ingBinding: { type: 'preposition-gerund', governor: 'depends on', semanticSubject: '研究者・参加者' } }],
  ['Those who design indicators should therefore be answerable for their consequences, including the administrative labor they create.|||including', { ingBinding: { type: 'additive-participle-marker', governor: 'their consequences', semanticSubject: '追加される例 the administrative labor' } }],
  ['Company funding does not automatically make research false, but readers should check whether the company sells the product being tested.|||the product being tested', { reducedRelativeBinding: { antecedent: 'the product', omitted: 'that is', voice: 'passive progressive' }, ingBinding: undefined }],
  ['Cash usually leaves no detailed record linking a person to a particular purchase, whereas digital payment creates data that may be stored, combined, or sold.|||linking', { ingBinding: { type: 'postpositive-participle', governor: 'no detailed record', semanticSubject: 'no detailed record' } }],
  ['Modern institutions measure almost everything they hope to improve in complex systems with competing public purposes.|||with competing public purposes', { ingBinding: { type: 'attributive-participle', governor: 'public purposes', semanticSubject: 'public purposes' } }],
  ['Extending the life of a product reduces waste and lowers demand for the energy and resources required to make new goods.|||extending the life', { role: 'S', ja: '寿命を延ばすことは', ingBinding: { type: 'gerund-subject', governor: 'reduces / lowers', semanticSubject: '製品を長く使う主体' } }],

  ['In some cases, a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service.|||or', { coordinationBinding: { type: 'compound-subject', left: 'a simple repair to an old bus stop', right: 'a clearer sign', governor: 'may help' } }],
  ['In some cases, a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service.|||more than an expensive digital service', { comparisonBinding: { type: 'np-comparison-with-ellipsis', left: 'a simple repair / a clearer sign may help residents', right: 'an expensive digital service (may help residents)', head: 'may help ... more', ellipsis: 'may help residents' } }],
  ['A city that takes resilience seriously must therefore evaluate projects over a long period rather than only during the year in which they are introduced.|||rather than', { comparisonBinding: { type: 'period-contrast', left: 'over a long period', right: 'only during the year in which they are introduced', head: 'evaluate projects', ellipsis: 'evaluate projects' } }],
  ['Readers can check a university report that describes its methods more easily than a video with no named source.|||more easily', { scope: '' }],
  ['Readers can check a university report that describes its methods more easily than a video with no named source.|||than', { scope: '', comparisonBinding: { type: 'comparison-with-ellipsis', left: 'Readers can check a university report', right: 'Readers can check a video', head: 'more easily', ellipsis: 'Readers can check' } }],
  ['Readers can check a university report that describes its methods more easily than a video with no named source.|||a video', { scope: '' }],
  ['A reading test captures some forms of comprehension, for example, but not every capacity that makes someone a thoughtful reader.|||not', { focusBinding: { type: 'partial-negation', scope: 'every capacity that makes someone a thoughtful reader', contrast: 'some forms of comprehension', governor: 'captures' } }],
  ['A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.|||or', { coordinationBinding: { type: 'object-list-under-gerund', left: 'discussion / curiosity', right: 'students whose improvement is unlikely to change its ranking', governor: 'neglecting' } }],
  ['Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.|||and', { coordinationBinding: { type: 'parallel-embedded-content', left: 'what to collect / how to describe it', right: 'which materials receive scarce conservation resources', governor: 'must decide' } }],
  ['Critics sometimes conclude that quantification itself is the problem and that experienced professionals should simply be trusted to exercise judgment.|||and', { coordinationBinding: { type: 'parallel-content-clauses', left: 'that quantification itself is the problem', right: 'that experienced professionals should simply be trusted to exercise judgment', governor: 'conclude' } }],
  ['For that reason, officials should explain clearly what kind of data is collected and how it will be protected.|||and', { coordinationBinding: { type: 'parallel-embedded-questions', left: 'what kind of data is collected', right: 'how it will be protected', governor: 'should explain clearly' } }],
  ['However, planting trees is not a simple solution if maintenance money is limited or if sidewalks are too narrow for roots to grow safely.|||or', { coordinationBinding: { type: 'parallel-condition-clauses', left: 'if maintenance money is limited', right: 'if sidewalks are too narrow for roots to grow safely', governor: 'planting trees is not a simple solution' } }],
  ['Readers still need to examine how the study was designed and whether other researchers found similar results.|||and', { coordinationBinding: { type: 'parallel-embedded-questions', left: 'how the study was designed', right: 'whether other researchers found similar results', governor: 'need to examine' } }],
  ['Setting review dates and publishing results allows governments to revise policies without treating revision as failure.|||and', { coordinationBinding: { type: 'compound-gerund-subject', left: 'Setting review dates', right: 'publishing results', governor: 'allows' } }],
  ['This evidence makes it easier to improve a design or decide that a simpler solution would work better.|||or', { coordinationBinding: { type: 'shared-infinitive', left: 'to improve から始まる内容', right: '(to) decide から始まる内容', governor: '共通toを持つ不定詞列', sharedMarker: 'to' } }],
  ['The students began to understand how temperature, rain, and insects affected the vegetables.|||and', { coordinationBinding: { type: 'compound-subject', left: 'temperature, rain', right: 'insects', governor: 'affected' } }],
  ['Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.|||and', { coordinationBinding: { type: 'shared-infinitive', left: 'to question / (to) recognize', right: '(to) deliberate', governor: 'can use records', sharedSubject: 'a society', sharedMarker: 'to' } }],
  ['If it becomes full, the library will put a message on its website.|||full', { ja: '満員に（なったら）', conditionBinding: { type: 'forward-condition-closure', connector: 'if', clause: 'it becomes full', governor: 'the library will put a message on its website' } }],
  ['If the students cannot understand an important point, the staff try to make the language clearer without removing the main idea.|||an important point', { ja: '重要な点を（理解できなければ）', conditionBinding: { type: 'forward-condition-closure', connector: 'if', clause: 'the students cannot understand an important point', governor: 'the staff try to make the language clearer' } }],
  ['If only wealthy areas receive the newest systems, technology may make public services more unequal instead of more convenient.|||the newest systems', { ja: '最新のシステムを（受け取るなら）', conditionBinding: { type: 'forward-condition-closure', connector: 'if', clause: 'only wealthy areas receive the newest systems', governor: 'technology may make public services more unequal' } }],
  ['If these issues are handled carefully, quiet technology can improve public spaces without making people feel controlled by it.|||carefully', { ja: '慎重に（扱われれば）', conditionBinding: { type: 'forward-condition-closure', connector: 'if', clause: 'these issues are handled carefully', governor: 'quiet technology can improve public spaces' } }],
  ['However, planting trees is not a simple solution if maintenance money is limited or if sidewalks are too narrow for roots to grow safely.|||safely', { ja: '安全に（根を伸ばすには歩道が狭すぎるなら）', conditionBinding: { type: 'forward-condition-closure', connector: 'if', clause: 'sidewalks are too narrow for roots to grow safely', governor: 'planting trees is not a simple solution' } }],
  ['That autonomy remains essential, but it can also be misused if institutions avoid scrutiny by describing all criticism as interference.|||as interference', { ja: '干渉として（表現して検証を避けるなら）', conditionBinding: { type: 'forward-condition-closure', connector: 'if', clause: 'institutions avoid scrutiny by describing all criticism as interference', governor: 'it can also be misused' } }],
  ['A public consultation may reproduce existing inequalities if organized groups can speak more loudly than communities with less time, money, or trust in institutions.|||trust in institutions', { ja: '制度への信頼が乏しい（共同体より大きな声で話せるなら）', conditionBinding: { type: 'forward-condition-closure', connector: 'if', clause: 'organized groups can speak more loudly than communities with less time, money, or trust in institutions', governor: 'a public consultation may reproduce existing inequalities' } }],
  ['If every account of the past is dismissed as merely political, citizens lose the capacity to distinguish careful revision from deliberate distortion.|||as merely political', { ja: '単に政治的なものとして（退けられるなら）', conditionBinding: { type: 'forward-condition-closure', connector: 'if', clause: 'every account of the past is dismissed as merely political', governor: 'citizens lose the capacity to distinguish' } }],
  ['Please ask a teacher near the front door if you have any questions.|||any questions', { ja: '何か質問を（お持ちなら）', conditionBinding: { type: 'forward-condition-closure', connector: 'if', clause: 'you have any questions', governor: 'Please ask a teacher near the front door' } }],
  ['If measurement increases surveillance below but accountability does not increase above, the system may weaken rather than strengthen legitimacy.|||above', { ja: '上層では（説明責任が強まらないなら）', conditionBinding: { type: 'forward-condition-closure', connector: 'if', clause: 'measurement increases surveillance below but accountability does not increase above', governor: 'the system may weaken rather than strengthen legitimacy' } }],
  ['Instead of simply giving the food away, the students visited the center and explained how they had grown it.|||away', { role: 'M', particleBinding: { type: 'separable-phrasal-verb', verb: 'giving', particle: 'away', object: 'the food', meaning: 'give away' } }],
  ['The cooking staff had to throw the leftovers away, even though most of the food was still fresh.|||away', { role: 'M', particleBinding: { type: 'separable-phrasal-verb', verb: 'had to throw', particle: 'away', object: 'the leftovers', meaning: 'throw away' } }],
  ['Citizen science is valuable not because volunteers replace professionals, but because the two groups contribute different strengths.|||but', { coordinationBinding: { type: 'not-because-but-because-reasons', left: 'because volunteers replace professionals', right: 'because the two groups contribute different strengths', governor: 'is valuable' } }],
  ['Suppose a survey finds that people who drink more tea report less stress.|||suppose', { clauseBinding: { type: 'omitted-that-content-clause', governor: 'Suppose', marker: '(that)', clauseRole: 'O' } }],
  ['Suppose a survey finds that people who drink more tea report less stress.|||that', { clauseBinding: { type: 'explicit-that-content-clause', governor: 'finds', marker: 'that', clauseRole: 'O' } }],
  ['When a decision involves serious health risks, online reading should support, not replace, advice from a qualified professional.|||not', { focusBinding: { type: 'contrastive-verbal-negation', scope: 'replace advice from a qualified professional', contrast: 'support advice from a qualified professional', governor: 'should support / (should) replace' } }],
  ['When a decision involves serious health risks, online reading should support, not replace, advice from a qualified professional.|||replace', { ja: '置き換えるべきではありません（対象は次へ）', displayEn: '(should) replace', spokenEn: 'replace' }],
  ['When a decision involves serious health risks, online reading should support, not replace, advice from a qualified professional.|||advice', { sharedObjectBinding: { type: 'shared-object', governors: 'should support / should not replace', object: 'advice' } }],
  ['They had to choose a sunny place, remove stones from the soil, and water the young plants every day.|||remove', { ja: '取り除く必要もありました（対象は次へ）', displayEn: '(had to) remove', spokenEn: 'remove' }],
  ['They had to choose a sunny place, remove stones from the soil, and water the young plants every day.|||water', { ja: '水をやる必要もありました（対象は次へ）', displayEn: '(had to) water', spokenEn: 'water' }],
  ['Visitors may not notice the system at all, yet it affects how long they can read or study without becoming tired.|||study', { ja: '勉強も続けられる', displayEn: '(can) study', spokenEn: 'study' }],
  ['For example, several train stations have introduced sensors that measure how crowded each platform is.|||each platform', { ja: '各ホームが（どれほど混雑しているか）' }],
  ['For example, several train stations have introduced sensors that measure how crowded each platform is.|||is', { ja: '〜であるのかを（測ります）' }],
  ['A more resilient city therefore begins by assessing who is most vulnerable and which resources can serve several needs at once.|||can serve', { ja: '応えられるのか（対象は次へ）' }],
  ['A more resilient city therefore begins by assessing who is most vulnerable and which resources can serve several needs at once.|||several needs', { role: 'O', ja: '複数のニーズに' }],
  ['A more resilient city therefore begins by assessing who is most vulnerable and which resources can serve several needs at once.|||at once', { ja: '同時に（応えられるのかを評価します）' }],
  ['Planners must therefore examine not only whether an intervention works physically but also how its costs and benefits are distributed.|||works', { role: 'V', ja: '機能するか（どの面でかは次へ）' }],
  ['Planners must therefore examine not only whether an intervention works physically but also how its costs and benefits are distributed.|||physically', { role: 'M', ja: '実際の機能面で（機能するか）' }],
  ['For the museum, the benefit is clear as well.|||clear', { role: 'C', ja: '明らかです（その利点は）' }],
  ['For the museum, the benefit is clear as well.|||as well', { role: 'M', ja: '同じく（博物館にも）' }],
  ['Digital records can also help consumers follow their spending and allow small businesses to sell goods online.|||can also help', { ja: 'さらに助けることができます（誰が何をするかは次へ）' }],
  ['Digital records can also help consumers follow their spending and allow small businesses to sell goods online.|||allow', { ja: '〜できるようにすることもできます（誰が何をかは次へ）', displayEn: '(can) allow', spokenEn: 'allow' }],
  ['That objection is important, particularly for small shops with narrow profit margins.|||with narrow profit margins', { ja: '利益幅の小さい（小規模な店にとって）' }],
  ['The broader lesson is that innovation should be judged by the range of people who can use it, not only by the speed of its average transaction.|||not only by the speed of its average transaction', { role: 'M', ja: '平均的な取引速度だけでなく、利用できる人々の範囲によって評価されるべきだ（ということです）', wordLimit: 9, focusBinding: { type: 'not-only-back-reference', scope: 'by the speed of its average transaction', contrast: 'by the range of people who can use it', governor: 'should be judged' } }],
  ['Modern institutions measure almost everything they hope to improve in complex systems with competing public purposes.|||to improve', { ja: '改善したいと望んでいる（ほぼすべてを測定します）' }],
  ['That position underestimates why measurement became attractive in the first place.|||became', { ja: '〜になりました（状態は次へ）' }],
  ['That position underestimates why measurement became attractive in the first place.|||attractive', { ja: '魅力的に' }],
  ['Judgment can remain informed and humane, but it can also become inconsistent, biased, and difficult for outsiders to challenge.|||to challenge', { role: 'V', ja: '異議を唱えることが（難しい）', infinitiveBinding: { type: 'adjective-complement', governor: 'difficult', semanticSubject: 'outsiders' } }],
  ['Without records, leaders may celebrate a program’s intentions while ignoring evidence that it repeatedly fails particular communities.|||particular communities', { role: 'O', ja: '特定の共同体に対して（繰り返し期待に応えられないという証拠を無視する一方で）' }],
  ['Second, metrics should be interpreted with qualitative evidence from the people represented by them.|||by them', { ja: 'その指標によって表される（人々から得た証拠とともに）' }],
  ['Evaluation systems must be adaptive because the behavior they observe changes in response to observation.|||observe', { ja: '観察する（その行動が主節へ戻り）' }],
  ['Evaluation systems must be adaptive because the behavior they observe changes in response to observation.|||changes', { ja: 'その行動は変化します（きっかけは次へ）' }],
  ['Meaningful transparency explains why a measure was chosen, what it omits, how uncertainty was handled, and who can question its use.|||its use', { ja: 'その利用に（異議を唱えられるのかを）' }],
  ['That explanation enables public deliberation about goals instead of limiting debate to technical compliance.|||to technical compliance', { ja: '技術的な規則順守に（限定するのではなく、公開での熟議を可能にします）' }],
  ['It also gives independent researchers a way to test whether alternative definitions would tell a substantially different story.|||would tell', { ja: '示すことになるか（対象は次へ）' }],
  ['They should direct attention toward patterns that require explanation, provide feedback for revision, and reveal whether policies serve their stated mission.|||provide', { ja: '提供すべきです（対象は次へ）', displayEn: '(should) provide', spokenEn: 'provide' }],
  ['They also discover that a museum is connected to schools, shops, parks, and many other parts of the community.|||many other parts of the community', { role: 'M', ja: '地域のほかの多くの場所とも（つながっていることに気づきます）' }],
  ['The museum has also changed the way it prepares labels for new displays.|||for new displays', { ja: '新しい展示用の説明文を準備する（方法を変えました）' }],
  ['The students also record the questions visitors ask most often, and the museum uses this feedback when planning future exhibitions.|||most often', { ja: '最もよく尋ねる（質問を記録します）' }],
  ['A file may still exist but become unreadable when software changes, while a searchable collection can effectively disappear if its indexing system is neglected.|||become', { ja: '〜になる可能性もあります（状態は次へ）', displayEn: '(may) become', spokenEn: 'become' }],
  ['The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.|||explanations', { role: 'M', ja: '説明とも' }],
  ['Readers can check a university report that describes its methods more easily than a video with no named source.|||more easily', { scope: '', ja: 'より容易に（読み手は確認できます）' }],
  ['Readers can check a university report that describes its methods more easily than a video with no named source.|||a video', { scope: '', ja: '一本の動画を確認するよりも' }],
  ['A reading test captures some forms of comprehension, for example, but not every capacity that makes someone a thoughtful reader.|||makes', { ja: '〜にします（対象・状態は次へ）' }],
  ['A narrow target may consequently punish the very risk taking required for genuine learning.|||for genuine learning', { ja: '真の学習のために必要な（リスクを取る行為を）', ingBinding: undefined }],
  ['Missed medical appointments could indicate irresponsibility, but interviews might reveal that a new transport schedule made the clinic inaccessible.|||made', { ja: '〜にしました（対象・状態は次へ）' }],
  ['Missed medical appointments could indicate irresponsibility, but interviews might reveal that a new transport schedule made the clinic inaccessible.|||inaccessible', { ja: '利用しにくい状態に（したということを）' }],
  ['Good projects reduce these problems through clear training and careful design.|||through clear training and careful design', { ingBinding: undefined }],
])

const READING_BLOCK_MARKED_EXPECTATIONS = new Map([
  [
    'This evidence makes it easier to improve a design or decide that a simpler solution would work better.',
    'This evidence makes it easier <to improve a design or decide (that a simpler solution would work better)>',
  ],
  [
    'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.',
    'The integrity of public memory is then shaped less (by what is available) than (by what is repeatedly presented as relevant)',
  ],
  [
    'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.',
    '(If that practice declines) even perfect archives will not prevent societies <from losing their ability> <to learn> (from what they once knew)',
  ],
])

const READING_BLOCK_STRUCTURE_TOKEN_EXPECTATIONS = new Map([
  [
    'This evidence makes it easier to improve a design or decide that a simpler solution would work better.',
    [
      {
        kind: 'phrase', depth: 0, parentKind: null,
        text: 'to improve a design or decide that a simpler solution would work better',
      },
      {
        kind: 'clause', depth: 1, parentKind: 'phrase',
        text: 'that a simpler solution would work better',
      },
    ],
  ],
  [
    'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.',
    [
      { kind: 'clause', depth: 0, parentKind: null, text: 'by what is available' },
      {
        kind: 'clause', depth: 0, parentKind: null,
        text: 'by what is repeatedly presented as relevant',
      },
    ],
  ],
  [
    'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.',
    [
      { kind: 'clause', depth: 0, parentKind: null, text: 'If that practice declines' },
      { kind: 'phrase', depth: 0, parentKind: null, text: 'from losing their ability' },
      { kind: 'phrase', depth: 0, parentKind: null, text: 'to learn' },
      { kind: 'clause', depth: 0, parentKind: null, text: 'from what they once knew' },
    ],
  ],
])

const READING_SEQUENCE_EXPECTATIONS = new Map([
  ['The students began to understand how temperature, rain, and insects affected the vegetables.', [
    ['The students', 'S'], ['began', 'V'], ['to understand', 'V'], ['how', 'M'],
    ['temperature, rain', 'S'], ['and', 'LINK'], ['insects', 'S'], ['affected', 'V'],
    ['the vegetables', 'O'],
  ]],
  ['In some cases, a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service.', [
    ['In some cases', 'M'], ['a simple repair', 'S'], ['to an old bus stop', 'M'], ['or', 'LINK'],
    ['a clearer sign', 'S'], ['may help', 'V'], ['residents', 'O'],
    ['more than an expensive digital service', 'M'],
  ]],
  ['Setting review dates and publishing results allows governments to revise policies without treating revision as failure.', [
    ['Setting review dates', 'S'], ['and', 'LINK'], ['publishing results', 'S'],
    ['allows', 'V'], ['governments', 'O'], ['to revise', 'V'], ['policies', 'O'],
    ['without', 'M'], ['treating', 'V'], ['revision', 'O'], ['as failure', 'C'],
  ]],
  ['The cafeteria also put pictures of both portions near the entrance so students could choose before reaching the counter.', [
    ['The cafeteria', 'S'], ['also', 'M'], ['put', 'V'], ['pictures', 'O'],
    ['of both portions', 'M'], ['near the entrance', 'M'], ['so', 'LINK'], ['students', 'S'],
    ['could choose', 'V'], ['before reaching', 'M'], ['the counter', 'M'],
  ]],
  ['It also gives independent researchers a way to test whether alternative definitions would tell a substantially different story.', [
    ['It', 'S'], ['also', 'M'], ['gives', 'V'], ['independent researchers', 'O'],
    ['a way', 'O2'], ['to test', 'M'], ['whether', 'LINK'], ['alternative definitions', 'S'],
    ['would tell', 'V'], ['a substantially different story', 'O'],
  ]],
  ['For the museum, the benefit is clear as well.', [
    ['For the museum', 'M'], ['the benefit', 'S'], ['is', 'V'], ['clear', 'C'],
    ['as well', 'M'],
  ]],
  ['For example, several train stations have introduced sensors that measure how crowded each platform is.', [
    ['For example', 'LINK'], ['several train stations', 'S'], ['have introduced', 'V'],
    ['sensors', 'O'], ['that', 'S'], ['measure', 'V'], ['how', 'M'], ['crowded', 'C'],
    ['each platform', 'S'], ['is', 'V'],
  ]],
  ['Planners must therefore examine not only whether an intervention works physically but also how its costs and benefits are distributed.', [
    ['Planners', 'S'], ['must therefore examine', 'V'], ['not only', 'LINK'], ['whether', 'LINK'],
    ['an intervention', 'S'], ['works', 'V'], ['physically', 'M'], ['but also', 'LINK'],
    ['how', 'LINK'], ['its costs and benefits', 'S'], ['are distributed', 'V'],
  ]],
  ['Such debates are rarely simple because historical meaning is often ambiguous.', [
    ['Such debates', 'S'], ['are', 'V'], ['rarely', 'M'], ['simple', 'C'],
    ['because', 'LINK'], ['historical meaning', 'S'], ['is', 'V'], ['often', 'M'],
    ['ambiguous', 'C'],
  ]],
  ['Because these measures are less dramatic, they are often the first to be reduced when budgets become tight.', [
    ['Because', 'LINK'], ['these measures', 'S'], ['are', 'V'], ['less dramatic', 'C'],
    ['they', 'S'], ['are', 'V'], ['often', 'M'], ['the first', 'C'],
    ['to be reduced', 'V'], ['when', 'LINK'], ['budgets', 'S'], ['become', 'V'], ['tight', 'C'],
  ]],
  ['The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.', [
    ['The discipline', 'S'], ['lies', 'V'], ['in explaining', 'M'], ['those choices,', 'O'],
    ['confronting', 'M'], ['contrary evidence', 'O'], ['and', 'LINK'], ['stating', 'M'],
    ['where', 'LINK'], ['certainty', 'S'], ['ends', 'V'],
  ]],
  ['Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.', [
    ['Its quality', 'S'], ['depends', 'V'], ['on whether', 'M'], ['a society', 'S'],
    ['can use', 'V'], ['records', 'O'], ['to question', 'V'], ['comfortable stories,', 'O'],
    ['recognize', 'V'], ['obligations,', 'O'], ['and', 'LINK'], ['deliberate', 'V'],
    ['about future choices', 'M'],
  ]],
  ['Instead of simply giving the food away, the students visited the center and explained how they had grown it.', [
    ['Instead of simply', 'M'], ['giving', 'V'], ['the food', 'O'], ['away', 'M'],
    ['the students', 'S'], ['visited', 'V'], ['the center', 'O'], ['and', 'LINK'],
    ['explained', 'V'], ['how', 'LINK'], ['they', 'S'], ['had grown', 'V'], ['it', 'O'],
  ]],
  ['The cooking staff had to throw the leftovers away, even though most of the food was still fresh.', [
    ['The cooking staff', 'S'], ['had to throw', 'V'], ['the leftovers', 'O'], ['away', 'M'],
    ['even though', 'LINK'], ['most of the food', 'S'], ['was', 'V'], ['still', 'M'], ['fresh', 'C'],
  ]],
  ['Citizen science is valuable not because volunteers replace professionals, but because the two groups contribute different strengths.', [
    ['Citizen science', 'S'], ['is', 'V'], ['valuable', 'C'], ['not because', 'LINK'],
    ['volunteers', 'S'], ['replace', 'V'], ['professionals', 'O'], ['but', 'LINK'],
    ['because', 'LINK'], ['the two groups', 'S'], ['contribute', 'V'], ['different strengths', 'O'],
  ]],
  ['A careful reader first asks who produced the message and what evidence is actually available.', [
    ['A careful reader', 'S'], ['first', 'M'], ['asks', 'V'], ['who', 'S'], ['produced', 'V'],
    ['the message', 'O'], ['and', 'LINK'], ['what evidence', 'S'], ['is', 'V'],
    ['actually', 'M'], ['available', 'C'],
  ]],
  ['For these users, refusing cash does more than remove a familiar habit; it can limit access to food, transport, and public life.', [
    ['For these users', 'M'], ['refusing', 'S'], ['cash', 'O'], ['does more than remove', 'V'],
    ['a familiar habit', 'O'], ['it', 'S'], ['can limit', 'V'], ['access', 'O'],
    ['to food,', 'M'], ['transport', 'M'], ['and', 'LINK'], ['public life', 'M'],
  ]],
  ['A common response is to teach digital skills and provide low-cost accounts.', [
    ['A common response', 'S'], ['is', 'V'], ['to teach', 'V'], ['digital skills', 'O'],
    ['and', 'LINK'], ['provide', 'V'], ['low-cost accounts', 'O'],
  ]],
  ['A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.', [
    ['A school', 'S'], ['may devote', 'V'], ['more time', 'O'], ['to easily tested skills', 'M'],
    ['while', 'LINK'], ['neglecting', 'V'], ['discussion, curiosity', 'O'], ['or', 'LINK'],
    ['students', 'O'], ['whose improvement', 'S'], ['is unlikely', 'V'], ['to change', 'V'],
    ['its ranking', 'O'],
  ]],
  ['Judgment can remain informed and humane, but it can also become inconsistent, biased, and difficult for outsiders to challenge.', [
    ['Judgment', 'S'], ['can remain', 'V'], ['informed and humane', 'C'], ['but', 'LINK'],
    ['it', 'S'], ['can also become', 'V'], ['inconsistent,', 'C'], ['biased', 'C'],
    ['and', 'LINK'], ['difficult', 'C'], ['for outsiders', 'M'], ['to challenge', 'V'],
  ]],
  ['Without records, leaders may celebrate a program’s intentions while ignoring evidence that it repeatedly fails particular communities.', [
    ['Without records', 'M'], ['leaders', 'S'], ['may celebrate', 'V'], ['a program’s intentions', 'O'],
    ['while', 'LINK'], ['ignoring', 'V'], ['evidence', 'O'], ['that', 'LINK'],
    ['it', 'S'], ['repeatedly', 'M'], ['fails', 'V'], ['particular communities', 'O'],
  ]],
  ['Transparency is important, yet publishing more data is not sufficient.', [
    ['Transparency', 'S'], ['is', 'V'], ['important', 'C'], ['yet', 'LINK'],
    ['publishing more data', 'S'], ['is not', 'V'], ['sufficient', 'C'],
  ]],
  ['Extending the life of a product reduces waste and lowers demand for the energy and resources required to make new goods.', [
    ['Extending the life', 'S'], ['of a product', 'M'], ['reduces', 'V'], ['waste', 'O'],
    ['and', 'LINK'], ['lowers', 'V'], ['demand', 'O'], ['for the energy', 'M'],
    ['and', 'LINK'], ['resources', 'M'], ['required', 'M'], ['to make', 'V'], ['new goods', 'O'],
  ]],
  ['The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.', [
    ['The alternative', 'S'], ['is not', 'V'], ['to abandon', 'C'], ['moderation', 'O'],
    ['but', 'LINK'], ['to combine', 'C'], ['it', 'O'], ['with accessible evidence, independent review,', 'M'],
    ['and', 'LINK'], ['explanations', 'M'], ['that', 'O'], ['users', 'S'],
    ['can examine', 'V'], ['rather than merely obey', 'M'],
  ]],
])

// 節を英語順に読み、O/C/Mまで到着してから外側の支配語へ戻る本文別期待値。
// 訂正台帳から実値を生成せず、終端phrase・節種別・入口・governor・隣接JAを独立固定する。
const READING_CLOSURE_EXPECTATIONS = new Map([
  ['At first, many students thought the work would be simple, but they soon learned that plants need careful attention.|||careful attention', {
    ja: '注意深い世話を必要としている（ことを学びました）',
    binding: { type: 'content-clause', opener: 'that', governor: 'learned', clause: 'plants need careful attention' },
  }],
  ['The program shows that learning about the past can help people build stronger relationships in the present.|||in the present', {
    ja: '現在において、より強い関係を築く助けになり得る（ことを示しています）',
    binding: { type: 'content-clause', opener: 'that', governor: 'shows', clause: 'learning about the past can help people build stronger relationships in the present' },
  }],
  ['Critics therefore argue that manufacturers should make parts and instructions easier to obtain.|||easier to obtain', {
    ja: 'より入手しやすい状態にするべきだ（と主張します）',
    binding: { type: 'content-clause', opener: 'that', governor: 'argue', clause: 'manufacturers should make parts and instructions easier to obtain' },
  }],
  ['Today, many planners argue that cities need a broader framework that connects transportation, housing, energy, and public health.|||public health', {
    ja: '公衆衛生を結び付ける、より広い枠組みを必要としている（と主張しています）',
    binding: { type: 'content-clause', opener: 'that', governor: 'argue', clause: 'cities need a broader framework that connects transportation, housing, energy, and public health' },
  }],
  ['One reason is that a measure designed for a single purpose can have unexpected consequences in another area.|||in another area', {
    ja: '別の分野で予期しない結果をもたらす可能性がある（ということです）',
    binding: { type: 'content-clause', opener: 'that', governor: 'is / One reason', clause: 'a measure designed for a single purpose can have unexpected consequences in another area' },
  }],
  ['Some observers respond by demanding that platforms remove misleading historical claims more aggressively.|||more aggressively', {
    ja: 'もっと積極的に誤解を招く歴史的主張を削除するように（要求して対応します）',
    binding: { type: 'content-clause', opener: 'that', governor: 'demanding', clause: 'platforms remove misleading historical claims more aggressively' },
  }],
  ['The project taught them that reducing food waste does not require one perfect rule for everyone.|||for everyone', {
    ja: '全員に当てはまる一つの完璧な規則を必要としない（ことを教えました）',
    binding: { type: 'content-clause', opener: 'that', governor: 'taught them', clause: 'reducing food waste does not require one perfect rule for everyone' },
  }],
  ['They explain that every meal uses water, energy, and work before it reaches a plate, so even a small improvement can protect valuable resources.|||a plate', {
    ja: '皿へ届く前に水・エネルギー・労力を使う（ということを説明しています）',
    binding: { type: 'content-clause', opener: 'that', governor: 'explain', clause: 'every meal uses water, energy, and work before it reaches a plate' },
  }],
  ['Several studies report that students at these schools sleep longer on ordinary weekdays.|||on ordinary weekdays', {
    ja: '通常の平日により長く眠る（と報告しています）',
    binding: { type: 'content-clause', opener: 'that', governor: 'report', clause: 'students at these schools sleep longer on ordinary weekdays' },
  }],
  ['It is that school policies should take evidence about teenage sleep seriously.|||seriously', {
    ja: '10代の睡眠についての証拠を真剣に受け止めるべきだ（ということです）',
    binding: { type: 'content-clause', opener: 'that', governor: 'is / It', clause: 'school policies should take evidence about teenage sleep seriously' },
  }],
  ['For example, the records may show that a species is arriving earlier in spring or disappearing from certain neighborhoods.|||from certain neighborhoods', {
    ja: '特定の地域から姿を消している、または春により早く飛来している（ことを示すかもしれません）',
    binding: { type: 'content-clause', opener: 'that', governor: 'may show', clause: 'a species is arriving earlier in spring or disappearing from certain neighborhoods' },
  }],
  ['A short video claims that a certain drink improves memory, and thousands of users share it within a day.|||memory', {
    ja: '記憶力を高める（と主張します）',
    binding: { type: 'content-clause', opener: 'that', governor: 'claims', clause: 'a certain drink improves memory' },
  }],
  ['Critics argue that such rules create costs for merchants who must maintain two payment systems.|||two payment systems', {
    ja: '二つの決済方式を維持しなければならない商店に費用を生じさせる（と主張します）',
    binding: { type: 'content-clause', opener: 'that', governor: 'argue', clause: 'such rules create costs for merchants who must maintain two payment systems' },
  }],
  ['Critics sometimes conclude that quantification itself is the problem and that experienced professionals should simply be trusted to exercise judgment.|||judgment', {
    ja: '判断を行使するよう信頼されるべきだ（と結論づけます）',
    binding: { type: 'content-clause', opener: 'that', governor: 'conclude', clause: 'experienced professionals should simply be trusted to exercise judgment' },
  }],
  ['The inability to assign a clean number is not evidence that a value is unreal; it is a warning that judgment must remain visible and contestable.|||unreal', {
    ja: '実在しないという（証拠ではありません）',
    binding: { type: 'content-clause', opener: 'that', governor: 'evidence', clause: 'a value is unreal' },
  }],
  ['The inability to assign a clean number is not evidence that a value is unreal; it is a warning that judgment must remain visible and contestable.|||visible and contestable', {
    ja: '見える形で異議を申し立てられる状態のままでなければならないという（警告です）',
    binding: { type: 'content-clause', opener: 'that', governor: 'a warning', clause: 'judgment must remain visible and contestable' },
  }],
  ['This evidence makes it easier to improve a design or decide that a simpler solution would work better.|||better', {
    ja: 'よりうまく（機能するだろう）',
    binding: { type: 'content-clause', opener: 'that', governor: 'decide', clause: 'a simpler solution would work better' },
  }],
  ['Missed medical appointments could indicate irresponsibility, but interviews might reveal that a new transport schedule made the clinic inaccessible.|||inaccessible', {
    ja: '利用しにくい状態に（したということを）',
    binding: { type: 'content-clause', opener: 'that', governor: 'might reveal', clause: 'a new transport schedule made the clinic inaccessible' },
  }],
  ['They also discover that a museum is connected to schools, shops, parks, and many other parts of the community.|||many other parts of the community', {
    ja: '地域のほかの多くの場所とも（つながっていることに気づきます）',
    binding: { type: 'content-clause', opener: 'that', governor: 'discover', clause: 'a museum is connected to schools, shops, parks, and many other parts of the community' },
  }],
  ['Instead of simply giving the food away, the students visited the center and explained how they had grown it.|||it', {
    ja: 'それを（どのように育てたのかを説明しました）',
    binding: { type: 'embedded-question', opener: 'how', governor: 'explained', clause: 'how they had grown it' },
  }],
  ['A volunteer may show someone how to open a lamp safely, replace a worn wire, or search for instructions online.|||online', {
    ja: 'オンラインで説明書を探す方法を（ボランティアが示すことがあります）',
    binding: { type: 'embedded-question', opener: 'how', governor: 'may show someone', clause: 'how to open a lamp safely, replace a worn wire, or search for instructions online' },
  }],
  ['Even when an object cannot be repaired, a visitor may learn why it failed and how to choose a longer-lasting replacement.|||a longer-lasting replacement', {
    ja: 'より長持ちする代替品をどう選ぶかを（学べるかもしれません）',
    binding: { type: 'embedded-question', opener: 'how', governor: 'may learn', clause: 'how to choose a longer-lasting replacement' },
  }],
  ['Repair cafes cannot change product design by themselves, but they can show consumers what prevents repairs.|||repairs', {
    ja: '修理を妨げているものを（消費者に示せます）',
    binding: { type: 'embedded-question', opener: 'what', governor: 'can show consumers', clause: 'what prevents repairs' },
  }],
  ['City leaders therefore need to ask where a new system will have the greatest effect and who might be left out.|||the greatest effect', {
    ja: '最大の効果を持つのはどこかを（問う必要があります）',
    binding: { type: 'embedded-question', opener: 'where', governor: 'need to ask', clause: 'where a new system will have the greatest effect' },
  }],
  ['A document can survive for centuries and still fail to influence how later generations understand the past.|||the past', {
    ja: '過去をどのように理解するかに（影響を与えないことがあります）',
    binding: { type: 'embedded-question', opener: 'how', governor: 'fail to influence', clause: 'how later generations understand the past' },
  }],
  ['Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.|||scarce conservation resources', {
    ja: '限られた保存資源をどの資料が受け取るかを（決めなければならないからです）',
    binding: { type: 'embedded-question', opener: 'which materials', governor: 'must decide', clause: 'which materials receive scarce conservation resources' },
  }],
  ['Students must learn how narratives are constructed, why certain voices were ignored, and how apparently neutral categories can reflect older relations of power.|||older relations of power', {
    ja: '以前からの権力関係をどのように反映し得るかを（学ばなければなりません）',
    binding: { type: 'embedded-question', opener: 'how', governor: 'must learn', clause: 'how apparently neutral categories can reflect older relations of power' },
  }],
  ['A careful reader first asks who produced the message and what evidence is actually available.|||the message', {
    ja: 'その情報を誰が作ったのかを（最初に尋ねます）',
    binding: { type: 'embedded-question', opener: 'who', governor: 'asks', clause: 'who produced the message' },
  }],
  ['Readers still need to examine how the study was designed and whether other researchers found similar results.|||similar results', {
    ja: '同様の結果をほかの研究者も得たかどうかを（調べる必要があります）',
    binding: { type: 'embedded-question', opener: 'whether', governor: 'need to examine', clause: 'whether other researchers found similar results' },
  }],
  ['This does not make cash universally superior, but it shows why a preferred tool can depend on a person’s circumstances rather than technical knowledge alone.|||rather than technical knowledge alone', {
    ja: '技術知識だけでなく、その人の事情によって左右され得るのはなぜかを（示しています）',
    binding: { type: 'embedded-question', opener: 'why', governor: 'shows', clause: 'why a preferred tool can depend on a person’s circumstances rather than technical knowledge alone' },
  }],
  ['That position underestimates why measurement became attractive in the first place.|||in the first place', {
    ja: 'そもそも魅力的になったのはなぜかを（過小評価しています）',
    binding: { type: 'embedded-question', opener: 'why', governor: 'underestimates', clause: 'why measurement became attractive in the first place' },
  }],
  ['Third, organizations must examine how people adapt once a measure carries consequences.|||consequences', {
    ja: '測定値が結果を伴うようになったとき、人々がどのように適応するのかを（調べなければなりません）',
    binding: { type: 'embedded-question', opener: 'how', governor: 'must examine', clause: 'how people adapt once a measure carries consequences' },
  }],
  ['There is also a political question about who bears the burden of being measured.|||the burden of being measured', {
    ja: '測定される負担を誰が負うのかについて（政治的な問いがあります）',
    binding: { type: 'embedded-question', opener: 'about who', governor: 'a political question', clause: 'who bears the burden of being measured' },
  }],
  ['Researchers can then compare similar observations and estimate where the data may be incomplete.|||incomplete', {
    ja: '不完全なのはどこかを（推定できます）',
    binding: { type: 'embedded-question', opener: 'where', governor: 'estimate', clause: 'where the data may be incomplete' },
  }],
  ['Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.|||about future choices', {
    ja: '将来の選択について熟議できるかで（その質は決まります）',
    binding: { type: 'embedded-question', opener: 'on whether', governor: 'depends', clause: 'whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices' },
  }],
  ['She likes English because her teacher uses many pictures.|||many pictures', {
    ja: 'たくさんの絵を使うからです',
    binding: { type: 'reason-clause', opener: 'because', governor: 'likes English', clause: 'her teacher uses many pictures' },
  }],
  ['She is happy because she can use the story in English class.|||in english class', {
    ja: '英語の授業でその物語を使えるからです',
    binding: { type: 'reason-clause', opener: 'because', governor: 'is happy', clause: 'she can use the story in English class' },
  }],
  ['The event is popular because children can learn about their town in a fun way.|||in a fun way', {
    ja: '楽しい方法で自分たちの町について学べるからです',
    binding: { type: 'reason-clause', opener: 'because', governor: 'is popular', clause: 'children can learn about their town in a fun way' },
  }],
  ['The work is not always easy because volunteers must communicate politely even when the building is crowded.|||is crowded', {
    ja: '館内が混雑しているときでさえ丁寧に応対しなければならないからです',
    binding: { type: 'reason-clause', opener: 'because / even when', governor: 'is not always easy', clause: 'volunteers must communicate politely even when the building is crowded' },
  }],
  ['Another student decided to study history at college because he wanted to protect old buildings in his town.|||in his town', {
    ja: '自分の町にある古い建物を守ることを望んだからです',
    binding: { type: 'reason-clause', opener: 'because', governor: 'decided to study history', clause: 'he wanted to protect old buildings in his town' },
  }],
  ['Privacy is another concern because sensors can collect data about public behavior.|||about public behavior', {
    ja: '人々の行動についてのデータを集められるからです',
    binding: { type: 'reason-clause', opener: 'because', governor: 'is another concern', clause: 'sensors can collect data about public behavior' },
  }],
  ['Large infrastructure projects are attractive to politicians because they are visible and can be announced as decisive action.|||as decisive action', {
    ja: '決定的な行動として発表できるからです',
    binding: { type: 'reason-clause', opener: 'because', governor: 'are attractive to politicians', clause: 'they are visible and can be announced as decisive action' },
  }],
  ['Two historians may accept the same evidence yet assign different significance to it because they ask different questions.|||different questions', {
    ja: '異なる問いを立てるからです',
    binding: { type: 'reason-clause', opener: 'because', governor: 'may accept / assign', clause: 'they ask different questions' },
  }],
  ['Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation.|||than patient investigation', {
    ja: '粘り強い調査より、速さ・感情的確信・集団への忠誠に容易に報いるからです',
    binding: { type: 'reason-clause', opener: 'because', governor: 'intensify this risk', clause: 'they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation' },
  }],
  ['They must use bicycle lights because drivers may not notice them after dark.|||after dark', {
    ja: '暗くなったあとには子どもたちに気づかないかもしれないからです',
    binding: { type: 'reason-clause', opener: 'because', governor: 'must use bicycle lights', clause: 'drivers may not notice them after dark' },
  }],
  ['Evaluation systems must be adaptive because the behavior they observe changes in response to observation.|||in response to observation', {
    ja: '観察されることに反応して、その行動は変化するからです',
    binding: { type: 'reason-clause', opener: 'because', governor: 'must be adaptive', clause: 'the behavior they observe changes in response to observation' },
  }],
  ['Institutions can strengthen trust by publicly stating that limit because this prevents precision from being mistaken for certainty.|||from being mistaken for certainty', {
    ja: '正確さが確実さと取り違えられることを防ぐからです',
    binding: { type: 'reason-clause', opener: 'because', governor: 'can strengthen trust', clause: 'this prevents precision from being mistaken for certainty' },
  }],
  ["The students began to understand how temperature, rain, and insects affected the vegetables.|||the vegetables", { ja: "野菜にどのように影響を与えたのかを（理解し始めました）", binding: { type: "embedded-question", opener: "how", governor: "began to understand", clause: "how temperature, rain, and insects affected the vegetables" } }],
  ["Some wanted to use a strong chemical spray, but the teacher asked them to research safer choices first.|||a strong chemical spray", { ja: "強い薬品のスプレーを使うことを望みました", binding: { type: "infinitive-complement", opener: "to use", governor: "wanted", clause: "to use a strong chemical spray" } }],
  ["Some wanted to use a strong chemical spray, but the teacher asked them to research safer choices first.|||first", { ja: "まず、より安全な選択肢を調べるよう生徒たちに求めました", binding: { type: "object-to-infinitive", opener: "to research", governor: "asked", clause: "them to research safer choices first" } }],
  ["They check maps, prepare simple worksheets, and practice explaining the displays in easy words.|||in easy words", { ja: "やさしい言葉で展示を説明することを練習します", binding: { type: "gerund-complement", opener: "explaining", governor: "practice", clause: "explaining the displays in easy words" } }],
  ["Another student decided to study history at college because he wanted to protect old buildings in his town.|||at college", { ja: "大学で歴史を学ぶことを決めました", binding: { type: "infinitive-complement", opener: "to study", governor: "decided", clause: "to study history at college" } }],
  ["When young people take part, exhibitions feel more open, and visitors are more willing to ask questions.|||questions", { ja: "質問をしようという姿勢がより強いです", binding: { type: "infinitive-complement", opener: "to ask", governor: "are more willing", clause: "to ask questions" } }],
  ["At these events, local volunteers help visitors examine broken things and, when possible, repair them.|||them", { ja: "来場者が壊れた物を調べ、可能ならそれらを修理するのを手助けします", binding: { type: "help-object-bare-infinitive", opener: "examine / repair", governor: "help visitors", clause: "visitors examine broken things and repair them when possible" } }],
  ["Visitors are expected to sit with volunteers and take part in the work instead of simply leaving an item at a counter.|||at a counter", { ja: "受付に品物を置いていくだけでなく、ボランティアと座って作業に加わることを求められています", binding: { type: "infinitive-coordination", opener: "to sit / take part", governor: "are expected", clause: "to sit with volunteers and take part in the work instead of simply leaving an item at a counter" } }],
  ["This process allows participants to gain practical skills and confidence.|||practical skills and confidence", { ja: "実用的な技能と自信を参加者が身につけられるようにします", binding: { type: "object-to-infinitive", opener: "to gain", governor: "allows", clause: "participants to gain practical skills and confidence" } }],
  ["A device no longer seems like a closed box that only its manufacturer understands.|||understands", { ja: "理解しているような（閉ざされた箱のようには、もはや見えません）", binding: { type: "relative-clause", opener: "that", governor: "like a closed box / seems", clause: "that only its manufacturer understands" } }],
  ["If these issues are handled carefully, quiet technology can improve public spaces without making people feel controlled by it.|||by it", { ja: "その技術に支配されていると人々に感じさせることなく", binding: { type: "without-gerund-clause", opener: "without making", governor: "can improve public spaces", clause: "making people feel controlled by it" } }],
  ["Some cities have begun to invite residents to map dangerous intersections, hot streets, and places where water remains after heavy rain.|||after heavy rain", { ja: "大雨のあとも水が残る場所までを地図に記すよう、住民に呼びかけ始めています", binding: { type: "object-to-infinitive", opener: "to invite / to map", governor: "have begun", clause: "to invite residents to map dangerous intersections, hot streets, and places where water remains after heavy rain" } }],
  ["Local knowledge also helps officials identify failures that computer models miss.|||miss", { ja: "コンピューターモデルが見落とす不具合を、行政担当者が見つける助けになります", binding: { type: "help-object-bare-infinitive", opener: "identify", governor: "helps officials", clause: "officials identify failures that computer models miss" } }],
  ["Setting review dates and publishing results allows governments to revise policies without treating revision as failure.|||as failure", { ja: "見直しを失敗とみなさずに政策を改められるよう、政府を助けます", binding: { type: "object-to-infinitive", opener: "to revise", governor: "allows governments", clause: "governments to revise policies without treating revision as failure" } }],
  ["Societies often assume that important events will be remembered simply because they are recorded in books, archives, or digital databases.|||in books, archives, or digital databases", { ja: "本・記録保管所・デジタルデータベースに記録されているというだけで、重要な出来事は記憶されると社会は考えがちです", binding: { type: "content-with-reason-clause", opener: "that / because", governor: "assume", clause: "important events will be remembered simply because they are recorded in books, archives, or digital databases" } }],
  ["Rather, a mature society keeps multiple perspectives in conversation while refusing to treat evidence as optional.|||as optional", { ja: "証拠を任意のものとして扱うことを拒みながら", binding: { type: "infinitive-complement", opener: "to treat", governor: "refusing", clause: "to treat evidence as optional" } }],
  ["It also requires citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears.|||appears", { ja: "現れたときに自分の見解を改めようとする市民を必要とします", binding: { type: "relative-infinitive-coordination", opener: "who / willing to", governor: "requires citizens", clause: "citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears" } }],
  ["This civic dimension explains why collective memory cannot be measured only by the number of documents preserved or people reached.|||reached", { ja: "情報が届いた人々や保存文書の数だけでは、集合的記憶を測れない理由を説明します", binding: { type: "embedded-question", opener: "why", governor: "explains", clause: "why collective memory cannot be measured only by the number of documents preserved or people reached" } }],
  ["If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.|||knew", { ja: "かつて知っていたことから学ぶ能力を社会が失うのを、防げないでしょう", binding: { type: "prevent-object-from-gerund", opener: "from losing", governor: "will not prevent societies", clause: "societies from losing their ability to learn from what they once knew" } }],
  ["The program will teach simple traffic rules and show people how to prevent common bicycle accidents.|||common bicycle accidents", { ja: "よくある自転車事故をどう防ぐかを（人々に示します）", binding: { type: "embedded-question", opener: "how", governor: "show people", clause: "how to prevent common bicycle accidents" } }],
  ["A science class decided to study the problem instead of simply asking everyone to eat more.|||more", { ja: "単に全員へもっと食べるよう求めるのではなく、その問題を調べることにしました", binding: { type: "contrastive-infinitive", opener: "instead of asking", governor: "decided to study", clause: "to study the problem instead of simply asking everyone to eat more" } }],
  ["The students suggested offering two plate sizes at the start of lunch.|||at the start of lunch", { ja: "昼食の始めに二つの皿サイズを用意することを提案しました", binding: { type: "gerund-complement", opener: "offering", governor: "suggested", clause: "offering two plate sizes at the start of lunch" } }],
  ["Daily records helped the cooking staff to prepare a better amount for each menu.|||for each menu", { ja: "各献立に合うより適切な量を調理スタッフが用意する助けになりました", binding: { type: "help-object-to-infinitive", opener: "to prepare", governor: "helped the cooking staff", clause: "the cooking staff to prepare a better amount for each menu" } }],
  ["Some parents also depend on older children to care for younger family members after school.|||after school", { ja: "放課後に年下の家族の世話をすることを年上の子どもに頼っています", binding: { type: "infinitive-content", opener: "to care for", governor: "depend on older children", clause: "older children to care for younger family members after school" } }],
  ["At one school, students helped design the change, and their suggestions produced a bus timetable that protected both sleep and afternoon activities.|||the change", { ja: "その変更を設計するのを手伝いました", binding: { type: "help-bare-infinitive", opener: "design", governor: "helped", clause: "design the change" } }],
  ["Schools need to examine bus routes, club times, and family needs before choosing a new schedule.|||a new schedule", { ja: "新しい予定を選ぶ前に、バス路線・部活動の時間・家庭の必要を調べる必要があります", binding: { type: "infinitive-complement", opener: "to examine", governor: "need", clause: "to examine bus routes, club times, and family needs before choosing a new schedule" } }],
  ["Such changes can suggest that weather, food, or habitat conditions are affecting bird populations.|||bird populations", { ja: "鳥の個体数に影響している（ことを示す場合があります）", binding: { type: "content-clause", opener: "that", governor: "can suggest", clause: "weather, food, or habitat conditions are affecting bird populations" } }],
  ["They provide pictures and recordings that help volunteers identify species correctly.|||correctly", { ja: "写真と録音が、鳥の種を正しく特定する助けになります", binding: { type: "help-object-bare-infinitive", opener: "identify", governor: "help volunteers", clause: "volunteers identify species correctly" } }],
  ["Tea might reduce stress, but perhaps relaxed people simply choose to drink more tea.|||more tea", { ja: "もっと多くのお茶を飲むことを選ぶのかもしれません", binding: { type: "infinitive-complement", opener: "to drink", governor: "choose", clause: "to drink more tea" } }],
  ["Digital records can also help consumers follow their spending and allow small businesses to sell goods online.|||their spending", { ja: "自分の支出を追えるよう消費者を助けることができます", binding: { type: "help-object-bare-infinitive", opener: "follow", governor: "can also help consumers", clause: "consumers follow their spending" } }],
  ["Digital records can also help consumers follow their spending and allow small businesses to sell goods online.|||online", { ja: "小規模事業者が商品をオンラインで販売できるようにすることもできます", binding: { type: "object-to-infinitive", opener: "to sell", governor: "allow small businesses", clause: "small businesses to sell goods online" } }],
  ["Nor should inclusion mean forcing everyone into a system simply because institutions find it efficient.|||efficient", { ja: "運営側が効率的だと考えるというだけで、全員を一つの仕組みに押し込むことを意味するべきでもありません", binding: { type: "gerund-content-clause", opener: "forcing", governor: "Nor should inclusion mean", clause: "forcing everyone into a system simply because institutions find it efficient" } }],
  ["The broader lesson is that innovation should be judged by the range of people who can use it, not only by the speed of its average transaction.|||not only by the speed of its average transaction", { ja: "平均的な取引速度だけでなく、利用できる人々の範囲によって評価されるべきだ（ということです）", binding: { type: "content-clause", opener: "that", governor: "The broader lesson is", clause: "innovation should be judged by the range of people who can use it, not only by the speed of its average transaction" } }],
  ["Graduation rates may be considered alongside student surveys, samples of actual work, and information about what graduates can do later.|||later", { ja: "後に何ができるかについての情報とも、卒業率を併せて検討できます", binding: { type: "embedded-question", opener: "about what", governor: "information / may be considered", clause: "what graduates can do later" } }],
  ["No collection of measures eliminates judgment, but plural indicators make it harder for one narrow target to dominate behavior.|||behavior", { ja: "行動を一つの狭い目標が支配しにくくします", binding: { type: "formal-object-for-to-infinitive", opener: "for / to dominate", governor: "make it harder", clause: "for one narrow target to dominate behavior" } }],
  ["Context does not excuse every poor result; it helps institutions distinguish causes that demand different responses.|||different responses", { ja: "異なる対応を必要とする原因を制度が区別する助けになります", binding: { type: "help-object-bare-infinitive", opener: "distinguish", governor: "helps institutions", clause: "institutions distinguish causes that demand different responses" } }],
  ["Meaningful transparency explains why a measure was chosen, what it omits, how uncertainty was handled, and who can question its use.|||was chosen", { ja: "選ばれたのかを", binding: { type: "parallel-embedded-question", opener: "why", governor: "explains", clause: "why a measure was chosen" } }],
  ...READING_CONNECTOR_CLOSURE_REVIEWS.map((item) => [
    `${item.sentence}|||${item.target}`,
    { ja: item.ja, binding: item.closureBinding },
  ]),
].map(([key, value]) => {
  const [sentence, phrase] = key.split('|||')
  return [`${sentence}|||${phraseKey(phrase)}`, value]
}))

function stableSemanticValue(value) {
  if (value === undefined) return 'undefined'
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableSemanticValue).join(',')}]`
  return `{${Object.keys(value).sort().map((key) =>
    `${JSON.stringify(key)}:${stableSemanticValue(value[key])}`).join(',')}}`
}

function independentBindingExpectationIssue(sentence, phrase) {
  const expectation = READING_BINDING_EXPECTATIONS.get(
    `${sentence.en}|||${phraseKey(phrase.en)}`,
  )
  if (!expectation) return null
  for (const [field, expected] of Object.entries(expectation)) {
    if (stableSemanticValue(phrase[field]) !== stableSemanticValue(expected)) {
      return `${field} が本文別期待値と一致しません`
    }
  }
  return null
}

const LONG_BINDING_EXPECTATIONS = new Map([
  ['curr_syn_gr_auto_1_agreement_neither_001|||were', { agreementBinding: { type: 'proximity-agreement', controller: 'the members', number: 'plural' } }],
  ['curr_syn_gr_auto_1_agreement_neither_002|||were', { agreementBinding: { type: 'proximity-agreement', controller: 'the members', number: 'plural' } }],
  ['curr_syn_gr_more_1_emph_01|||what', { role: 'O', clauseBinding: { type: 'fused-relative-subject-clause', internalRole: 'O', outerRole: 'S', governor: 'objects to' } }],
  ['curr_syn_gr_auto_1_extent_to_which_002|||to which', { role: 'M', clauseBinding: { type: 'preposition-relative', antecedent: 'extent', preposition: 'to', whRole: 'O', clauseRole: 'M' } }],
  ['curr_syn_gr_exam_university_1_degree_adverb_001|||showed', { clauseBinding: { type: 'omitted-that-content-clause', governor: 'showed', clauseRole: 'O', marker: '(that)' } }],
  ['curr_syn_gr_exam_university_1_degree_adverb_001|||it', { punctuationBoundary: { mark: ':', relation: 'explanation', previousClause: 'the filter was useless', nextClause: 'it removed practically nothing' } }],
  ['curr_syn_gr_more_1_modal_02|||a summary', { punctuationBoundary: { mark: ';', relation: 'alternative', previousClause: 'The report need not have been so lengthy', nextClause: 'a summary would have sufficed' } }],
  ['curr_syn_gr_pre2_pron_3|||one', { punctuationBoundary: { mark: ';', relation: 'elaboration', previousClause: 'I have two cats', nextClause: 'one is white and the other is black' } }],
  ['curr_syn_gr_auto_pre1_agreement_001|||a series of reviews', { role: 'S', agreementBinding: { type: 'head-noun-agreement', controller: 'series', number: 'singular' } }],
  ['curr_syn_gr_auto_pre1_agreement_002|||a series of reviews', { role: 'S', agreementBinding: { type: 'head-noun-agreement', controller: 'series', number: 'singular' } }],
  ['curr_syn_gr_auto_2_gerund_idiom_001|||there is', { clauseBinding: { type: 'existential-there', formalElement: 'There', postposedContent: 'no denying that ...' } }],
  ['curr_syn_gr_auto_2_gerund_idiom_001|||no denying', { clauseBinding: { type: 'there-is-no-gerund', gerund: 'denying', meaning: 'cannot deny' } }],
  ['curr_syn_gr_auto_2_gerund_idiom_001|||that', { clauseBinding: { type: 'content-clause', governor: 'denying', clauseRole: 'O' } }],
  ['curr_syn_gr_auto_pre1_comparison_002|||not so much', { comparisonBinding: { type: 'not-so-much-as', left: 'expensive', right: 'impractical', head: 'evaluation of the proposal' } }],
  ['curr_syn_gr_auto_pre1_comparison_002|||as', { comparisonBinding: { type: 'not-so-much-as', left: 'expensive', right: 'impractical', head: 'evaluation of the proposal' } }],
  ['curr_syn_gr_auto_1_no_sooner_001|||no sooner', { comparisonBinding: { type: 'no-sooner-than', left: 'the committee revised the proposal', right: 'the public began to respond', head: 'No sooner ... than' } }],
  ['curr_syn_gr_auto_1_no_sooner_001|||than', { comparisonBinding: { type: 'no-sooner-than', left: 'the committee revised the proposal', right: 'the public began to respond', head: 'No sooner ... than' } }],
  ['curr_syn_gr_auto_1_superior_to_001|||to the previous one', { comparisonBinding: { type: 'superior-to', left: 'this approach', right: 'the previous one', head: 'superior' } }],
  ['curr_syn_gr_auto_pre1_whale_001|||than', { comparisonBinding: { type: 'no-more-than', left: 'a rumor is evidence', right: 'a guess is evidence', head: 'no more evidence', ellipsis: 'evidence after is' } }],
  ['curr_syn_gr_auto_1_agreement_neither_001|||to revise', { infinitiveBinding: { type: 'adjective-complement', governor: 'willing', semanticSubject: 'the chair nor the members' } }],
  ['curr_syn_gr_auto_1_no_sooner_001|||began to respond', { infinitiveBinding: { type: 'verb-complement', governor: 'began', semanticSubject: 'the public' } }],
  ['curr_syn_gr_auto_1_were_to_001|||to revise', { infinitiveBinding: { type: 'inverted-be-to-condition', governor: 'Were', semanticSubject: 'the committee' } }],
  ['curr_syn_gr_auto_1_agreement_neither_002|||to verify', { infinitiveBinding: { type: 'adjective-complement', governor: 'willing', semanticSubject: 'the chair nor the members' } }],
  ['curr_syn_gr_auto_2_inanimate_subject_001|||to revise', { infinitiveBinding: { type: 'object-to-infinitive', governor: 'enable', semanticSubject: 'the committee' } }],
  ['curr_syn_gr_auto_pre1_agreement_001|||to help', { infinitiveBinding: { type: 'passive-verb-complement', governor: 'is expected', semanticSubject: 'A series of reviews' } }],
  ['curr_syn_gr_auto_pre1_be_to_001|||is to revise', { infinitiveBinding: { type: 'be-to-condition', governor: 'is', semanticSubject: 'the committee' } }],
  ['curr_syn_gr_auto_pre1_agreement_002|||to help', { infinitiveBinding: { type: 'passive-verb-complement', governor: 'is expected', semanticSubject: 'A series of reviews' } }],
  ['curr_syn_gr_auto_pre1_be_to_002|||is to revise', { infinitiveBinding: { type: 'be-to-condition', governor: 'is', semanticSubject: 'the committee' } }],
  ['curr_syn_gr_auto_pre2_correlative_001|||call', { displayEn: '(can) call', spokenEn: 'call' }],
  ['curr_syn_gr_more_1_emph_01|||but', { coordinationBinding: { type: 'not-a-but-b-complements', left: 'the cost', right: 'the lack of evidence', governor: 'is' } }],
  ['curr_syn_gr_pre2_pron_3|||and', { coordinationBinding: { type: 'clause-coordination', left: 'one is white', right: 'the other is black', governor: 'semicolon second clause' } }],
])

const LONG_SEQUENCE_EXPECTATIONS = new Map(
  Object.entries(LONG_SENTENCE_ROLE_EXPECTATIONS),
)

// 長い一文でも、Vの直後で日本語を閉じず、O/C/Mまで読んでから節・句・述語を
// 完成する。実データから生成せず、本文別に終端JAと支配関係を独立固定する。
const LONG_CLOSURE_EXPECTATIONS = new Map([
  ['exam_syn_as_long_as|||clean', { ja: 'きれいに保つ限り', binding: { type: 'condition-clause', opener: 'as long as', governor: 'may use the room', clause: 'you keep it clean' } }],
  ['curr_syn_gr_more_1_tense_01|||is completed', { ja: '合併が完了する時までには', binding: { type: 'time-clause', opener: 'By the time', governor: 'will have operated', clause: 'the merger is completed' } }],
  ['curr_syn_gr_more_1_tense_01|||for decades', { ja: '何十年もの間、独立して操業してきたことになります', binding: { type: 'predicate-completion', opener: 'will have operated', governor: 'the firms', clause: 'the firms will have operated independently for decades' } }],
  ['curr_syn_gr_auto_1_agreement_neither_001|||the proposal', { ja: 'その提案を修正しようとする意思はありませんでした', binding: { type: 'infinitive-complement', opener: 'to revise', governor: 'were willing', clause: 'to revise the proposal' } }],
  ['curr_syn_gr_auto_1_all_the_more_001|||all the more important', { ja: 'なおさら重要です', binding: { type: 'linking-predicate', opener: 'is', governor: "The committee's decision", clause: "The committee's decision is all the more important" } }],
  ['curr_syn_gr_auto_1_future_perfect_progressive_001|||for two months', { ja: '2か月間、その提案を修正し続けていることになります', binding: { type: 'predicate-completion', opener: 'will have been revising', governor: 'the committee', clause: 'the committee will have been revising the proposal for two months' } }],
  ['curr_syn_gr_auto_1_no_sooner_001|||the proposal', { ja: 'その提案を修正し終えるとすぐに', binding: { type: 'correlative-first-clause', opener: 'No sooner', governor: 'than / the public began to respond', clause: 'the committee had revised the proposal' } }],
  ['curr_syn_gr_auto_1_provided_that_001|||is disclosed', { ja: '公開されるという条件で', binding: { type: 'condition-clause', opener: 'provided that', governor: 'may revise the proposal', clause: 'the evidence is disclosed' } }],
  ['curr_syn_gr_auto_1_superior_to_001|||the proposal', { ja: 'その提案を扱う際には', binding: { type: 'gerund-phrase', opener: 'In handling', governor: 'is superior', clause: 'handling the proposal' } }],
  ['curr_syn_gr_auto_1_were_to_001|||unexpectedly', { ja: '予想外にその提案を修正するとすれば', binding: { type: 'inverted-condition-clause', opener: 'Were', governor: 'the consequences would be serious', clause: 'the committee were to revise the proposal unexpectedly' } }],
  ['curr_syn_gr_auto_1_were_to_001|||serious', { ja: '重大になるでしょう', binding: { type: 'linking-predicate', opener: 'would be', governor: 'the consequences', clause: 'the consequences would be serious' } }],
  ['curr_syn_gr_exam_university_1_degree_adverb_001|||useless', { ja: '役に立たないものだと（試験は示しました）――', binding: { type: 'content-clause', opener: '(that)', governor: 'showed', clause: 'the filter was useless' } }],
  ['curr_syn_gr_exam_university_1_degree_adverb_001|||from the polluted water', { ja: 'その汚染水からは、ほとんど何も取り除きませんでした', binding: { type: 'predicate-completion', opener: ':', governor: 'removed', clause: 'it removed practically nothing from the polluted water' } }],
  ['curr_syn_gr_auto_1_agreement_neither_002|||the results', { ja: 'その結果を検証しようとする意思はありませんでした', binding: { type: 'infinitive-complement', opener: 'to verify', governor: 'were willing', clause: 'to verify the results' } }],
  ['curr_syn_gr_auto_1_all_the_more_002|||all the more urgent', { ja: 'なおさら緊急です', binding: { type: 'linking-predicate', opener: 'is', governor: "The committee's decision", clause: "The committee's decision is all the more urgent" } }],
  ['curr_syn_gr_auto_1_extent_to_which_002|||the proposal', { ja: 'その提案を修正した（程度は）', binding: { type: 'relative-clause', opener: 'to which', governor: 'The extent / is still disputed', clause: 'to which the committee revised the proposal' } }],
  ['curr_syn_gr_auto_1_future_perfect_progressive_002|||for a year', { ja: '1年間、その提案を修正し続けていることになります', binding: { type: 'predicate-completion', opener: 'will have been revising', governor: 'the committee', clause: 'the committee will have been revising the proposal for a year' } }],
  ['curr_syn_gr_auto_1_lest_002|||a detail', { ja: '細部を見落とす事態を避けるために', binding: { type: 'negative-purpose-clause', opener: 'lest', governor: 'explained its decision carefully', clause: 'anyone should overlook a detail' } }],
  ['curr_syn_gr_auto_2_gerund_idiom_001|||at this stage', { ja: 'この段階でその提案を修正しなければならないことは、否定できません', binding: { type: 'content-clause', opener: 'that', governor: 'There is no denying', clause: 'the committee must revise the proposal at this stage' } }],
  ['curr_syn_gr_auto_2_inanimate_subject_001|||more efficiently', { ja: 'より効率的にその提案を修正できるようにします', binding: { type: 'object-to-infinitive', opener: 'to revise', governor: 'will enable', clause: 'the committee to revise the proposal more efficiently' } }],
  ['curr_syn_gr_auto_2_past_subjunctive_001|||earlier', { ja: 'もっと早くその提案を修正していたなら', binding: { type: 'condition-clause', opener: 'If', governor: 'the outcome would have been different', clause: 'the committee had revised the proposal earlier' } }],
  ['curr_syn_gr_auto_2_past_subjunctive_001|||different', { ja: '違っていたでしょう', binding: { type: 'linking-predicate', opener: 'would have been', governor: 'the outcome', clause: 'the outcome would have been different' } }],
  ['curr_syn_gr_auto_pre2_correlative_001|||after school', { ja: '放課後にテニスをすることができるだけでなく', binding: { type: 'coordinated-predicate', opener: 'not only', governor: 'Ken can', clause: 'play tennis after school' } }],
  ['curr_syn_gr_auto_pre2_correlative_001|||in the evening', { ja: '夕方に祖母へ電話することもできます', binding: { type: 'coordinated-predicate', opener: 'but also', governor: 'Ken can', clause: 'call Grandma in the evening' } }],
  ['curr_syn_gr_pre2_pron_3|||two cats', { ja: '2匹の猫を飼っています', binding: { type: 'predicate-completion', opener: 'have', governor: 'I', clause: 'I have two cats' } }],
  ['curr_syn_gr_auto_pre1_agreement_001|||the proposal', { ja: '委員会がその提案を修正するのに役立つと期待されています', binding: { type: 'infinitive-chain', opener: 'to help', governor: 'is expected', clause: 'to help the committee revise the proposal' } }],
  ['curr_syn_gr_auto_pre1_be_to_001|||successfully', { ja: 'その提案をうまく修正するためには', binding: { type: 'condition-clause', opener: 'If', governor: 'it needs more resources', clause: 'the committee is to revise the proposal successfully' } }],
  ['curr_syn_gr_auto_pre1_conditional_inversion_001|||earlier', { ja: 'もっと早くその提案を修正していたなら', binding: { type: 'inverted-condition-clause', opener: 'Had', governor: 'the outcome would have differed', clause: 'the committee had revised the proposal earlier' } }],
  ['curr_syn_gr_auto_pre1_agreement_002|||the results', { ja: '研究チームがその結果を検証するのに役立つと期待されています', binding: { type: 'infinitive-chain', opener: 'to help', governor: 'is expected', clause: 'to help the research team verify the results' } }],
  ['curr_syn_gr_auto_pre1_appositive_that_002|||the results', { ja: 'その結果を検証するかもしれない（という事実は）', binding: { type: 'appositive-content-clause', opener: 'that', governor: 'The fact / deserves attention', clause: 'the research team may verify the results' } }],
  ['curr_syn_gr_auto_pre1_be_to_002|||by the deadline', { ja: 'その期限までにその提案を修正するためには', binding: { type: 'condition-clause', opener: 'If', governor: 'it needs more resources', clause: 'the committee is to revise the proposal by the deadline' } }],
  ['curr_syn_gr_auto_pre1_conditional_inversion_002|||more carefully', { ja: 'もっと慎重にその提案を修正していたなら', binding: { type: 'inverted-condition-clause', opener: 'Had', governor: 'the outcome would have differed', clause: 'the committee had revised the proposal more carefully' } }],
  ['curr_syn_gr_auto_pre1_ellipsis_002|||after consultation', { ja: '協議のあとで、その結果をもう一度検証するでしょう', binding: { type: 'predicate-completion', opener: 'will verify', governor: 'the research team', clause: 'the research team will verify the results again after consultation' } }],
  ['curr_syn_gr_auto_pre1_only_inversion_002|||the results', { ja: 'その結果を検証しました', binding: { type: 'inverted-predicate-completion', opener: 'Only after the final review', governor: 'did / verify', clause: 'the research team did verify the results' } }],
])

function independentLongBindingExpectationIssue(id, part) {
  const expectation = LONG_BINDING_EXPECTATIONS.get(`${id}|||${phraseKey(part.en)}`)
  if (!expectation) return null
  for (const [field, expected] of Object.entries(expectation)) {
    if (stableSemanticValue(part[field]) !== stableSemanticValue(expected)) {
      return `${field} が長い一文の本文別期待値と一致しません`
    }
  }
  return null
}

function completeBinding(binding, requiredFields) {
  return binding && requiredFields.every((field) => `${binding[field] ?? ''}`.trim())
}

function phraseSemanticIssue(sentence, phrase) {
  const key = `${sentence.en}|||${phraseKey(phrase.en)}`
  const expectedGrammar = expectedSpecialGrammar(phrase)
  if (ZERO_RELATIVE_TARGETS.has(key) && !completeBinding(
    phrase.zeroRelativeBinding,
    ['antecedent', 'gapRole', 'returnTo'],
  )) return 'zero-relative の先行詞・空所・戻り先がありません'
  if (phrase.constructionBinding && !completeBinding(
    phrase.constructionBinding,
    ['type', 'object', 'complement'],
  )) return 'SVOC構文のO・C/V関係がありません'
  if (phrase.reducedRelativeBinding && !completeBinding(
    phrase.reducedRelativeBinding,
    ['antecedent', 'omitted', 'voice'],
  )) return '省略関係詞の先行詞・省略要素・態がありません'
  if (phrase.ingBinding) {
    if (!completeBinding(phrase.ingBinding, ['type', 'governor', 'semanticSubject'])) {
      return '-ing形の機能・支配語・意味上の主語がありません'
    }
    if (phrase.ingBinding.type === 'embedded-gerund-or-participle') {
      return '-ing形の動名詞・分詞機能が未確定です'
    }
  }
  if (phrase.infinitiveBinding) {
    if (!completeBinding(phrase.infinitiveBinding, ['type', 'governor', 'semanticSubject'])) {
      return '不定詞の機能・支配語・意味上の主語がありません'
    }
    if (['context-reviewed', 'verb-or-noun-complement'].includes(phrase.infinitiveBinding.type)) {
      return '不定詞の機能分類が未確定です'
    }
  }
  if (phrase.conditionBinding && !completeBinding(
    phrase.conditionBinding,
    ['type', 'connector', 'clause', 'governor'],
  )) return '条件節末の受け直し型・節内容・主節支配先がありません'
  if (phrase.closureBinding && !completeBinding(
    phrase.closureBinding,
    ['type', 'opener', 'governor', 'clause'],
  )) return '節末受け直しの型・入口・節内容・外側支配先がありません'
  if (phrase.particleBinding) {
    if (!completeBinding(
      phrase.particleBinding,
      ['type', 'verb', 'particle', 'object', 'meaning'],
    )) return '分離句動詞の動詞・目的語・小辞・意味がありません'
    if (phrase.role !== 'M') return '句動詞の小辞を独立動詞Vとして扱っています'
  }
  if (phraseKey(phrase.en) === 'away' && !phrase.particleBinding) {
    return 'away の分離句動詞bindingがありません'
  }
  if (expectedGrammar.includes('infinitive-function') && !phrase.infinitiveBinding) {
    return '不定詞の明示的な機能台帳がありません'
  }
  if (/^than\s+/.test(phraseKey(phrase.en)) && !completeBinding(
    phrase.comparisonBinding,
    ['left', 'right', 'head'],
  )) return 'than句の比較head・前項・後項がありません'
  const expectedDisplay = STRUCTURAL_DISPLAY_TARGETS.get(key)
  if (expectedDisplay) {
    if (phrase.displayEn !== expectedDisplay) return `構造表示が ${expectedDisplay} ではありません`
    const expectedSharedMarker = expectedDisplay.match(/\(([^)]+)\)/)?.[1] ?? ''
    if (phrase.structureDisplay?.sharedMarker !== expectedSharedMarker) {
      return `共有要素が ${expectedSharedMarker} ではありません`
    }
    if (!sameEnglish(phrase.spokenEn, phrase.en)) return '補った構造語が音声へ混入しています'
  }
  if (
    sentence.en.includes('prevent societies from losing') &&
    phraseKey(phrase.en) === 'from losing' &&
    phrase.ingBinding?.semanticSubject !== 'societies'
  ) return 'from losing の意味上の主語が societies ではありません'
  if (
    sentence.en.includes('a private problem, a broken object,') &&
    phraseKey(phrase.en) === 'a broken object' &&
    (!phrase.specialGrammar?.includes('apposition') || phrase.role !== 'M')
  ) return 'a broken object が同格挿入Mとして説明されていません'
  const independentIssue = independentBindingExpectationIssue(sentence, phrase)
  if (independentIssue) return independentIssue
  return null
}

function prematureJapaneseClosure(parts, index) {
  const phrase = parts[index]
  const next = parts[index + 1]
  if (phrase?.role !== 'V' || !next || !['O', 'O1', 'O2', 'C', 'M'].includes(next.role)) {
    return null
  }
  const ja = `${phrase.ja ?? ''}`.trim()
  if (!/(?:からです|のかを|のか|かどうかを|ということを|ということです|べきだと|ことを|だと)$/.test(ja)) {
    return null
  }
  if (phrase.closureBinding) return null
  const predicateWords = normalizedWords(phrase.en).join(' ')
  const isCompletedLater = parts.slice(index + 1).some((candidate) => {
    const binding = candidate.closureBinding
    if (!binding) return false
    const clause = normalizedWords(binding.clause).join(' ')
    const governor = normalizedWords(binding.governor).join(' ')
    return clause.includes(predicateWords) || governor.includes(predicateWords)
  })
  if (isCompletedLater) return null
  return next.en
}

// 「改善することを / 設計を」のように、V/M側で先に「を」を閉じた直後に
// Oが来ると、後続のclosureBindingがあっても隣接再生時の二重格は直らない。
// 節末の受け直しとは独立したゲートとして検査する。
function adjacentJapaneseCaseCollision(parts, index) {
  const phrase = parts[index]
  const next = parts[index + 1]
  if (!['V', 'M'].includes(phrase?.role) || !['O', 'O1', 'O2'].includes(next?.role)) {
    return null
  }
  const ja = `${phrase.ja ?? ''}`.trim()
  return /(?:ことを|のを)(?:（[^）]*）)?$/.test(ja) ? next.en : null
}

function readingRef(passage, sentenceIndex, phraseIndex, sentence, phrase, extra = {}) {
  return Object.freeze({
    passageId: passage.id,
    sentenceIndex,
    phraseIndex,
    sentence: sentence.en,
    phrase: phrase.en,
    ...extra,
  })
}

function longRef(item, stepIndex, part, extra = {}) {
  return Object.freeze({
    id: item.id,
    stepIndex,
    sentence: item.example.en,
    phrase: part?.en ?? '',
    ...extra,
  })
}

function meaningPhraseFragmentation(parts, index) {
  const current = parts[index]
  const next = parts[index + 1]
  if (!current || !next) return null
  const currentRoles = rolesOf(current)
  const nextRoles = rolesOf(next)
  const combinedWords = englishWords(`${current.en} ${next.en}`).length
  if (
    currentRoles.length === 1 &&
    currentRoles[0] === 'S' &&
    nextRoles.length === 1 &&
    nextRoles[0] === 'V' &&
    combinedWords <= 6
  ) {
    return '短いS＋Vが意味の完成する一息なのに分断されています'
  }
  if (
    currentRoles.length === 1 &&
    currentRoles[0] === 'V' &&
    nextRoles.some((role) => ['O', 'O1', 'O2', 'C'].includes(role)) &&
    combinedWords <= 8
  ) {
    return '短い述語とO/Cが意味の完成前に分断されています'
  }
  return null
}

function meaningJapaneseIssue(value = '') {
  if (/(?:ますます|ですです|したした|するする|ましたました|でしょうでしょう|をを|がが|にに)/u.test(value)) {
    return '日本語の結合部に重複があります'
  }
  if (/^(?:を|へ|に|が|は|の)$/u.test(`${value}`.trim())) {
    return '助詞だけで意味フレーズになっています'
  }
  return ''
}

export function auditPhraseExplanations() {
  const readingSentences = []
  const readingPhrases = []
  const readingMeaningPhrases = []
  const readingIssues = {
    reconstructionErrors: [],
    missingFields: [],
    spokenMismatches: [],
    overWordLimit: [],
    mixedRoles: [],
    splitAuxiliaryVerb: [],
    prepositionFragments: [],
    missingSpecialGrammar: [],
    invalidCoordinationBindings: [],
    missingConditionClosures: [],
    missingClauseClosures: [],
    unreviewedConnectorClosures: [],
    adjacentJapaneseCaseCollisions: [],
    missingPunctuationBoundaries: [],
    semanticBindingErrors: [],
    structuralDisplayMismatches: [],
    staleGrammarBlockPayloads: [],
    grammarBlockStructureMismatches: [],
    misclassifiedGrammarBlocks: [],
    invalidJapaneseFallbacks: [],
    correctionMismatches: [],
    missingManualReviewEvidence: [],
    pendingRulePhrases: [],
    unreviewedSentences: [],
    nonConfirmedPhrases: [],
    meaningReconstructionErrors: [],
    meaningMissingFields: [],
    meaningSpokenMismatches: [],
    meaningOverWordLimit: [],
    unnecessaryMeaningFragmentation: [],
    invalidMeaningJapanese: [],
    staleMeaningBlockPayloads: [],
    meaningRegressionMismatches: [],
  }
  const reviewCategoryCounts = new Map()
  const seenStructuralDisplayTargets = new Set()
  const seenReadingClosureTargets = new Set()
  const seenConnectorClosureReviewKeys = new Set()
  const seenReadingReviewIds = new Set()
  const seenGrammarBlockStructureTargets = new Set()
  let manuallyReviewedReadingSentenceCount = 0
  let readingGrammarBlockCount = 0
  let readingConnectorCandidateCount = 0

  for (const passage of PASSAGES) {
    passage.sentences.forEach((sentence, sentenceIndex) => {
      const analysis = analyzeReadingSentence(sentence)
      readingSentences.push(sentence.en)
      const connectorOccurrences = new Map()
      analysis.phraseSequence.forEach((phrase, phraseIndex) => {
        const connector = phraseKey(phrase.en)
        if (phrase.role !== 'LINK' || !CONNECTOR_CLOSURE_CANDIDATES.has(connector)) return
        const occurrence = (connectorOccurrences.get(connector) ?? 0) + 1
        connectorOccurrences.set(connector, occurrence)
        readingConnectorCandidateCount++
        const key = connectorReviewKey(sentence.en, connector, occurrence)
        if (
          connectorBackReferenceReviewKeys.has(key) ||
          connectorNoBackReferenceReviewKeys.has(key)
        ) {
          seenConnectorClosureReviewKeys.add(key)
          return
        }
        readingIssues.unreviewedConnectorClosures.push(readingRef(
          passage,
          sentenceIndex,
          phraseIndex,
          sentence,
          phrase,
          { field: '接続関係の受け直し要否が全件台帳にありません' },
        ))
      })
      const sentenceReviewEvidenceMatches = analysis.phraseSequence.length > 0 &&
        analysis.phraseSequence.every((phrase) => phrase.reviewEvidenceId === sentence.reviewId)
      if (sentenceReviewEvidenceMatches) {
        manuallyReviewedReadingSentenceCount++
        seenReadingReviewIds.add(sentence.reviewId)
      } else {
        readingIssues.missingManualReviewEvidence.push(Object.freeze({
          passageId: passage.id,
          sentenceIndex,
          sentence: sentence.en,
          phrase: '(manual-review-ledger)',
          field: '原文・role・JA・表示・音声・項目解説の静的fingerprintが一致しません',
        }))
      }
      const reconstructed = analysis.phraseSequence
        .map((phrase) => phrase.spokenEn ?? phrase.en)
        .join(' ')
      if (!sameEnglish(reconstructed, sentence.en)) {
        readingIssues.reconstructionErrors.push(Object.freeze({
          passageId: passage.id,
          sentenceIndex,
          sentence: sentence.en,
          reconstructed,
        }))
      }
      const meaningReconstructed = analysis.meaningPhraseSequence
        .map((phrase) => phrase.spokenEn ?? phrase.en)
        .join(' ')
      if (!sameEnglish(meaningReconstructed, sentence.en)) {
        readingIssues.meaningReconstructionErrors.push(Object.freeze({
          passageId: passage.id,
          sentenceIndex,
          sentence: sentence.en,
          reconstructed: meaningReconstructed,
        }))
      }
      if (analysis.phraseExplanationGuide) {
        const actual = analysis.meaningPhraseSequence.map((phrase) => ({
          en: phrase.en,
          roles: rolesOf(phrase),
          ja: phrase.ja,
          displayEn: phrase.displayEn ?? phrase.en,
          spokenEn: phrase.spokenEn ?? phrase.en,
        }))
        const expected = analysis.phraseExplanationGuide.phrases.map((phrase) => ({
          en: phrase.en,
          roles: rolesOf(phrase),
          ja: phrase.ja,
          displayEn: phrase.displayEn ?? phrase.en,
          spokenEn: phrase.spokenEn ?? phrase.en,
        }))
        if (stableSemanticValue(actual) !== stableSemanticValue(expected)) {
          readingIssues.meaningRegressionMismatches.push(Object.freeze({
            passageId: passage.id,
            sentenceIndex,
            sentence: sentence.en,
            phrase: '(meaning-phrase-regression)',
            field: '学習者向け意味フレーズが独立回帰例と一致しません',
          }))
        }
      }
      analysis.meaningPhraseSequence.forEach((phrase, phraseIndex) => {
        readingMeaningPhrases.push(phrase)
        const ref = (extra = {}) => readingRef(
          passage,
          sentenceIndex,
          phraseIndex,
          sentence,
          phrase,
          extra,
        )
        for (const [field, value] of Object.entries({
          en: phrase.en,
          spokenEn: phrase.spokenEn,
          ja: phrase.ja,
          explanation: phrase.explanation ?? phrase.grammarNote,
        })) {
          if (!`${value ?? ''}`.trim()) readingIssues.meaningMissingFields.push(ref({ field }))
        }
        if (!sameEnglish(phrase.spokenEn ?? phrase.en, phrase.en)) {
          readingIssues.meaningSpokenMismatches.push(ref({ spokenEn: phrase.spokenEn }))
        }
        const wordCount = englishWords(phrase.en).length
        if (wordCount > 8) {
          readingIssues.meaningOverWordLimit.push(ref({ wordCount, limit: 8 }))
        }
        const fragmentation = meaningPhraseFragmentation(
          analysis.meaningPhraseSequence,
          phraseIndex,
        )
        if (fragmentation) {
          readingIssues.unnecessaryMeaningFragmentation.push(ref({ field: fragmentation }))
        }
        const japaneseIssue = meaningJapaneseIssue(phrase.ja)
        if (japaneseIssue) {
          readingIssues.invalidMeaningJapanese.push(ref({ field: japaneseIssue }))
        }
      })
      readingGrammarBlockCount += analysis.blocks.length
      const blockPhrases = analysis.blocks.flatMap((block) => block.phrasePairs)
      const visiblePayload = (phrase) => ({
        en: phrase.en,
        spokenEn: phrase.spokenEn ?? phrase.en,
        displayEn: phrase.displayEn ?? phrase.en,
        role: phrase.role,
        ja: phrase.ja,
        roleHeading: phrase.roleHeading,
        roleNote: phrase.roleNote,
        explanation: phrase.explanation ?? phrase.grammarNote ?? '',
      })
      const blockPayload = blockPhrases.map(visiblePayload)
      const phrasePayload = analysis.phraseSequence.map(visiblePayload)
      const blockReconstructed = blockPhrases
        .map((phrase) => phrase.spokenEn ?? phrase.en)
        .join(' ')
      if (
        analysis.blocks.some((block) => block.phrasePairs.length === 0) ||
        !sameEnglish(blockReconstructed, sentence.en) ||
        JSON.stringify(blockPayload) !== JSON.stringify(phrasePayload)
      ) {
        readingIssues.staleGrammarBlockPayloads.push(Object.freeze({
          passageId: passage.id,
          sentenceIndex,
          sentence: sentence.en,
          phrase: '(grammar-block-payload)',
          field: '下段ブロックの表示・音声payloadが最終phraseSequenceと一致しません',
        }))
      }
      const meaningBlockPhrases = analysis.blocks.flatMap(
        (block) => block.meaningPhrasePairs ?? [],
      )
      const meaningBlockPayload = meaningBlockPhrases.map(visiblePayload)
      const meaningPhrasePayload = analysis.meaningPhraseSequence.map(visiblePayload)
      const meaningBlockReconstructed = meaningBlockPhrases
        .map((phrase) => phrase.spokenEn ?? phrase.en)
        .join(' ')
      if (
        !sameEnglish(meaningBlockReconstructed, sentence.en) ||
        JSON.stringify(meaningBlockPayload) !== JSON.stringify(meaningPhrasePayload)
      ) {
        readingIssues.staleMeaningBlockPayloads.push(Object.freeze({
          passageId: passage.id,
          sentenceIndex,
          sentence: sentence.en,
          phrase: '(meaning-block-payload)',
          field: '下段ブロックの意味フレーズが主表示・音声payloadと一致しません',
        }))
      }
      analysis.blocks.forEach((block, blockIndex) => {
        const contentCue = block.phrasePairs.some((phrase) =>
          phrase.source === 'content-clause-reviewed' ||
          /(?:内容節の入口|内容節を導|内容節末|目的語となる内容節|要求内容を示す内容節)/
            .test(`${phrase.explanation ?? ''}`))
        const positivelyDescribesRelativeClause =
          /直前の名詞.*説明する関係詞節/.test(`${block.note ?? ''}`) ||
          (
            /関係代名詞/.test(`${block.note ?? ''}`) &&
            !/関係代名詞ではなく/.test(`${block.note ?? ''}`)
          )
        if (
          contentCue &&
          (
            block.label.includes('関係詞') ||
            positivelyDescribesRelativeClause
          )
        ) {
          readingIssues.misclassifiedGrammarBlocks.push(Object.freeze({
            passageId: passage.id,
            sentenceIndex,
            sentence: sentence.en,
            phrase: block.en,
            blockIndex,
            field: '内容節を関係詞節として表示しています',
          }))
        }
      })
      const expectedMarked = READING_BLOCK_MARKED_EXPECTATIONS.get(sentence.en)
      if (
        analysis.structureMarkerErrors.length > 0 ||
        serializeStructureTokens(analysis.structureTokens) !== analysis.marked
      ) {
        readingIssues.grammarBlockStructureMismatches.push(Object.freeze({
          passageId: passage.id,
          sentenceIndex,
          sentence: sentence.en,
          phrase: '(sentence-structure-tokens)',
          field: '見取り図マーカーを画面用トークンへ損失なく変換できません',
        }))
      }
      if (expectedMarked) {
        seenGrammarBlockStructureTargets.add(sentence.en)
        if (analysis.marked !== expectedMarked) {
          readingIssues.grammarBlockStructureMismatches.push(Object.freeze({
            passageId: passage.id,
            sentenceIndex,
            sentence: sentence.en,
            phrase: '(sentence-structure-display)',
            field: `見取り図が「${expectedMarked}」と一致しません`,
          }))
        }
        const expectedTokens = READING_BLOCK_STRUCTURE_TOKEN_EXPECTATIONS.get(sentence.en)
        if (
          !expectedTokens ||
          stableSemanticValue(structureGroupOutline(analysis.structureTokens)) !==
            stableSemanticValue(expectedTokens)
        ) {
          readingIssues.grammarBlockStructureMismatches.push(Object.freeze({
            passageId: passage.id,
            sentenceIndex,
            sentence: sentence.en,
            phrase: '(sentence-structure-token-tree)',
            field: '実レンダー用の節・句トークン階層が本文別期待値と一致しません',
          }))
        }
      }
      if (!analysis.phraseSequence.every((phrase) => phrase.status === 'confirmed')) {
        readingIssues.unreviewedSentences.push(Object.freeze({
          passageId: passage.id,
          sentenceIndex,
          sentence: sentence.en,
          method: analysis.phraseMethod ?? 'unreviewed',
        }))
      }
      const punctuationMark = PUNCTUATION_BOUNDARY_SENTENCES.get(sentence.en)
      if (punctuationMark) {
        const kind = punctuationMark === ';' ? 'semicolon-boundary' : 'colon-boundary'
        const boundaryPhrase = analysis.phraseSequence.find((phrase) =>
          phrase.specialGrammar?.includes(kind) &&
          `${phrase.displayEn ?? ''}`.startsWith(punctuationMark))
        if (!boundaryPhrase) {
          readingIssues.missingPunctuationBoundaries.push(Object.freeze({
            passageId: passage.id,
            sentenceIndex,
            sentence: sentence.en,
            phrase: punctuationMark,
          }))
        }
      }
      const expectedSequence = READING_SEQUENCE_EXPECTATIONS.get(sentence.en)
      if (expectedSequence) {
        const actualSequence = analysis.phraseSequence.map((phrase) => [phrase.en, phrase.role])
        if (stableSemanticValue(actualSequence) !== stableSemanticValue(expectedSequence)) {
          readingIssues.semanticBindingErrors.push(Object.freeze({
            passageId: passage.id,
            sentenceIndex,
            sentence: sentence.en,
            phrase: '(phraseSequence)',
            field: '英語フレーズとrole列が本文別期待値と一致しません',
          }))
        }
      }

      for (const issue of conditionalClosureIssues(analysis.phraseSequence)) {
        const terminal = analysis.phraseSequence[issue.end]
        readingIssues.missingConditionClosures.push(Object.freeze({
          passageId: passage.id,
          sentenceIndex,
          phraseIndex: issue.end,
          sentence: sentence.en,
          phrase: terminal?.en ?? '(条件節末)',
          field: 'Vより後ろのO/C/Mを含む条件節が、節末の受け直しで完成していません',
        }))
      }

      for (const decision of READING_PHRASE_CORRECTIONS[sentence.en] ?? []) {
        const expectedOccurrence = decision.occurrence ?? 1
        const actualOccurrences = correctionOccurrenceCount(analysis.phraseSequence, decision.parts)
        if (actualOccurrences < expectedOccurrence) {
          readingIssues.correctionMismatches.push(Object.freeze({
            passageId: passage.id,
            sentenceIndex,
            sentence: sentence.en,
            phrase: decision.parts.map((part) => part.en).join(' / '),
            expectedRoles: decision.parts.map((part) => part.role),
            expectedOccurrence,
            actualOccurrences,
          }))
        }
      }

      analysis.phraseSequence.forEach((phrase, phraseIndex) => {
        readingPhrases.push(phrase)
        const ref = (extra = {}) => readingRef(
          passage,
          sentenceIndex,
          phraseIndex,
          sentence,
          phrase,
          extra,
        )
        const semanticKey = `${sentence.en}|||${phraseKey(phrase.en)}`
        const closureExpectation = READING_CLOSURE_EXPECTATIONS.get(semanticKey)
        if (closureExpectation) {
          seenReadingClosureTargets.add(semanticKey)
          if (
            phrase.ja !== closureExpectation.ja ||
            stableSemanticValue(phrase.closureBinding) !== stableSemanticValue(closureExpectation.binding)
          ) {
            readingIssues.missingClauseClosures.push(ref({
              field: '節末のJAまたはclosureBindingが本文別期待値と一致しません',
            }))
          }
        } else if (phrase.closureBinding) {
          readingIssues.missingClauseClosures.push(ref({
            field: '独立した長文closure期待値にないbindingがあります',
          }))
        }
        const prematureNext = prematureJapaneseClosure(analysis.phraseSequence, phraseIndex)
        if (prematureNext) {
          readingIssues.missingClauseClosures.push(ref({
            field: `Vの日本語を閉じた後に ${prematureNext} が残っています`,
            nextPhrase: prematureNext,
          }))
        }
        const caseCollisionNext = adjacentJapaneseCaseCollision(
          analysis.phraseSequence,
          phraseIndex,
        )
        if (caseCollisionNext) {
          readingIssues.adjacentJapaneseCaseCollisions.push(ref({
            field: `V/M側で「を」を閉じた直後にO ${caseCollisionNext} が続いています`,
            nextPhrase: caseCollisionNext,
          }))
        }
        if (STRUCTURAL_DISPLAY_TARGETS.has(semanticKey)) {
          seenStructuralDisplayTargets.add(semanticKey)
        } else if (phrase.structureDisplay) {
          readingIssues.structuralDisplayMismatches.push(ref({
            field: '構造表示台帳にない補いがあります',
          }))
        }
        if (phrase.status !== 'confirmed') readingIssues.nonConfirmedPhrases.push(ref())
        if (phrase.pendingRule) {
          readingIssues.pendingRulePhrases.push(ref({ field: phrase.pendingRule }))
        }
        if (phrase.reviewCategory) {
          reviewCategoryCounts.set(
            phrase.reviewCategory,
            (reviewCategoryCounts.get(phrase.reviewCategory) ?? 0) + 1,
          )
        }

        const requiredFields = {
          en: phrase.en,
          spokenEn: phrase.spokenEn,
          ja: phrase.ja,
          explanation: phrase.explanation ?? phrase.grammarNote,
        }
        for (const [field, value] of Object.entries(requiredFields)) {
          if (!`${value ?? ''}`.trim()) readingIssues.missingFields.push(ref({ field }))
        }
        if (phrase.spokenEn && !sameEnglish(phrase.spokenEn, phrase.en)) {
          readingIssues.spokenMismatches.push(ref({ spokenEn: phrase.spokenEn }))
        }
        const wordCount = englishWords(phrase.en).length
        const limit = wordLimitFor(
          phrase,
          READING_CORE_PHRASE_WORD_LIMIT,
          READING_MODIFIER_PHRASE_WORD_LIMIT,
        )
        if (wordCount > limit) readingIssues.overWordLimit.push(ref({ wordCount, limit }))
        const roles = rolesOf(phrase)
        if (roles.length !== 1) readingIssues.mixedRoles.push(ref({ roles }))
        if (isPrepositionFragment(analysis.phraseSequence, phraseIndex)) {
          readingIssues.prepositionFragments.push(ref())
        }
        const expectedGrammar = expectedSpecialGrammar(phrase)
        if (!hasSpecificExplanation(phrase, expectedGrammar)) {
          readingIssues.missingSpecialGrammar.push(ref({ expectedGrammar }))
        }
        const coordinationIssue = coordinationBindingIssue(analysis.phraseSequence, phraseIndex)
        if (coordinationIssue) {
          readingIssues.invalidCoordinationBindings.push(ref({ field: coordinationIssue }))
        }
        const semanticIssue = phraseSemanticIssue(sentence, phrase)
        if (semanticIssue) {
          readingIssues.semanticBindingErrors.push(ref({ field: semanticIssue }))
        }
        if (
          /(?:5月|doの三人称単数|できる・読む|より多い・|その・問題)/.test(phrase.ja) ||
          /^(?:へ・|です・)/.test(`${phrase.ja}`.trim()) ||
          /^(?:を|へ|に|が|は|の)$/.test(`${phrase.ja}`.trim())
        ) {
          readingIssues.invalidJapaneseFallbacks.push(ref())
        }
        const auxiliaryIssue = splitAuxiliaryIssue(analysis.phraseSequence, phraseIndex)
        if (auxiliaryIssue) {
          readingIssues.splitAuxiliaryVerb.push(ref({ nextPhrase: auxiliaryIssue.nextPhrase }))
        }
      })
    })
  }

  for (const [targetKey, expectedDisplay] of STRUCTURAL_DISPLAY_TARGETS) {
    if (seenStructuralDisplayTargets.has(targetKey)) continue
    const [sentence, phrase] = targetKey.split('|||')
    readingIssues.structuralDisplayMismatches.push(Object.freeze({
      passageId: '',
      sentenceIndex: -1,
      phraseIndex: -1,
      sentence,
      phrase,
      field: `構造表示期待 ${expectedDisplay} に対応する実フレーズがありません`,
    }))
  }

  for (const [sentence, expectedMarked] of READING_BLOCK_MARKED_EXPECTATIONS) {
    if (seenGrammarBlockStructureTargets.has(sentence)) continue
    readingIssues.grammarBlockStructureMismatches.push(Object.freeze({
      passageId: '',
      sentenceIndex: -1,
      phraseIndex: -1,
      sentence,
      phrase: '(sentence-structure-display)',
      field: `見取り図期待「${expectedMarked}」に対応する実文がありません`,
    }))
  }

  for (const [targetKey] of READING_CLOSURE_EXPECTATIONS) {
    if (seenReadingClosureTargets.has(targetKey)) continue
    const [sentence, phrase] = targetKey.split('|||')
    readingIssues.missingClauseClosures.push(Object.freeze({
      passageId: '', sentenceIndex: -1, phraseIndex: -1, sentence, phrase,
      field: '節末closure期待に対応する実フレーズがありません',
    }))
  }

  for (const expectedKey of [
    ...connectorBackReferenceReviewKeys,
    ...connectorNoBackReferenceReviewKeys,
  ]) {
    if (seenConnectorClosureReviewKeys.has(expectedKey)) continue
    const [sentence, connector] = expectedKey.split('|||')
    readingIssues.unreviewedConnectorClosures.push(Object.freeze({
      passageId: '', sentenceIndex: -1, phraseIndex: -1, sentence,
      phrase: connector,
      field: '接続関係の全件台帳に対応する実フレーズがありません',
    }))
  }

  for (const reviewId of Object.keys(READING_MANUAL_REVIEW_LEDGER)) {
    if (seenReadingReviewIds.has(reviewId)) continue
    readingIssues.missingManualReviewEvidence.push(Object.freeze({
      passageId: reviewId.split('#')[0],
      sentenceIndex: Number(reviewId.split('#')[1] ?? 0) - 1,
      phraseIndex: -1,
      sentence: '',
      phrase: reviewId,
      field: '手動レビュー台帳に対応する現行文がありません',
    }))
  }

  const longTargets = PHRASES.filter(isLongSyntaxSentence)
  const longSentences = longTargets.map((item) => item.example.en)
  const longIssues = {
    missingGuides: [],
    reconstructionErrors: [],
    missingFields: [],
    spokenMismatches: [],
    overWordLimit: [],
    mixedRoles: [],
    splitAuxiliaryVerb: [],
    prepositionFragments: [],
    missingSpecialGrammar: [],
    invalidCoordinationBindings: [],
    missingClauseClosures: [],
    adjacentJapaneseCaseCollisions: [],
    missingPunctuationBoundaries: [],
    semanticBindingErrors: [],
    missingManualReviewEvidence: [],
    pendingRulePhrases: [],
    unreviewedGuides: [],
    nonConfirmedSteps: [],
    meaningReconstructionErrors: [],
    meaningMissingFields: [],
    meaningSpokenMismatches: [],
    meaningOverWordLimit: [],
    unnecessaryMeaningFragmentation: [],
    invalidMeaningJapanese: [],
    nonConfirmedMeaningSteps: [],
  }
  let longStepCount = 0
  let longMeaningStepCount = 0
  let longMeaningMultiRoleCount = 0
  const seenLongClosureTargets = new Set()
  const seenLongReviewIds = new Set()
  const seenLongSequenceIds = new Set()
  let manuallyReviewedLongSentenceCount = 0

  for (const item of longTargets) {
    const guide = LONG_SENTENCE_TRANSLATIONS[item.id]
    if (!guide) {
      longIssues.missingGuides.push(longRef(item, -1, null))
      continue
    }
    longStepCount += guide.steps.length
    longMeaningStepCount += guide.meaningSteps?.length ?? 0
    longMeaningMultiRoleCount += guide.meaningSteps?.filter(
      (part) => rolesOf(part).length > 1,
    ).length ?? 0
    const guideReviewEvidenceMatches = guide.reviewEvidenceId === item.id &&
      guide.steps.every((part) => part.reviewEvidenceId === item.id)
    if (guideReviewEvidenceMatches) {
      manuallyReviewedLongSentenceCount++
      seenLongReviewIds.add(item.id)
    } else {
      longIssues.missingManualReviewEvidence.push(longRef(item, -1, null, {
        phrase: '(manual-review-ledger)',
        field: '原文・role・JA・表示・音声・項目解説の静的fingerprintが一致しません',
      }))
    }
    const reconstructed = guide.steps.map((part) => part.spokenEn ?? part.en).join(' ')
    if (!sameEnglish(reconstructed, item.example.en)) {
      longIssues.reconstructionErrors.push(longRef(item, -1, null, { reconstructed }))
    }
    const meaningReconstructed = (guide.meaningSteps ?? [])
      .map((part) => part.spokenEn ?? part.en)
      .join(' ')
    if (!guide.meaningSteps?.length || !sameEnglish(meaningReconstructed, item.example.en)) {
      longIssues.meaningReconstructionErrors.push(longRef(item, -1, null, {
        reconstructed: meaningReconstructed,
      }))
    }
    ;(guide.meaningSteps ?? []).forEach((part, meaningIndex) => {
      const ref = (extra = {}) => longRef(item, meaningIndex, part, extra)
      for (const [field, value] of Object.entries({
        en: part.en,
        spokenEn: part.spokenEn,
        ja: part.ja,
        explanation: part.explanation ?? part.grammarNote ?? part.note,
      })) {
        if (!`${value ?? ''}`.trim()) longIssues.meaningMissingFields.push(ref({ field }))
      }
      if (!sameEnglish(part.spokenEn ?? part.en, part.en)) {
        longIssues.meaningSpokenMismatches.push(ref({ spokenEn: part.spokenEn }))
      }
      const wordCount = englishWords(part.en).length
      if (wordCount > 8) longIssues.meaningOverWordLimit.push(ref({ wordCount, limit: 8 }))
      const fragmentation = meaningPhraseFragmentation(guide.meaningSteps, meaningIndex)
      if (fragmentation) {
        longIssues.unnecessaryMeaningFragmentation.push(ref({ field: fragmentation }))
      }
      const japaneseIssue = meaningJapaneseIssue(part.ja)
      if (japaneseIssue) longIssues.invalidMeaningJapanese.push(ref({ field: japaneseIssue }))
      if (part.status !== 'confirmed') longIssues.nonConfirmedMeaningSteps.push(ref())
    })
    if (guide.status !== 'confirmed') longIssues.unreviewedGuides.push(longRef(item, -1, null))
    const expectedSequence = LONG_SEQUENCE_EXPECTATIONS.get(item.id)
    if (expectedSequence) {
      seenLongSequenceIds.add(item.id)
      const actualSequence = guide.steps.map((part) => [part.en, part.role])
      if (stableSemanticValue(actualSequence) !== stableSemanticValue(expectedSequence)) {
        longIssues.semanticBindingErrors.push(longRef(item, -1, null, {
          phrase: '(phraseSequence)',
          field: '英語フレーズとrole列が長い一文の期待値と一致しません',
        }))
      }
    } else {
      longIssues.semanticBindingErrors.push(longRef(item, -1, null, {
        phrase: '(phraseSequence)',
        field: '長い一文の独立role列期待がありません',
      }))
    }

    if (/[;:]/.test(item.example.en)) {
      const boundary = guide.steps.find((part) => part.punctuationBoundary)
      const mark = item.example.en.includes(';') ? ';' : ':'
      if (!boundary || boundary.punctuationBoundary.mark !== mark) {
        longIssues.missingPunctuationBoundaries.push(longRef(item, -1, null, {
          phrase: mark,
        }))
      }
    }

    guide.steps.forEach((part, stepIndex) => {
      const ref = (extra = {}) => longRef(item, stepIndex, part, extra)
      const closureKey = `${item.id}|||${phraseKey(part.en)}`
      const closureExpectation = LONG_CLOSURE_EXPECTATIONS.get(closureKey)
      if (closureExpectation) {
        seenLongClosureTargets.add(closureKey)
        if (
          part.ja !== closureExpectation.ja ||
          stableSemanticValue(part.closureBinding) !== stableSemanticValue(closureExpectation.binding)
        ) {
          longIssues.missingClauseClosures.push(ref({
            field: '節末のJAまたはclosureBindingが長い一文の本文別期待値と一致しません',
          }))
        }
      } else if (part.closureBinding) {
        longIssues.missingClauseClosures.push(ref({
          field: '独立した長い一文closure期待値にないbindingがあります',
        }))
      }
      const prematureNext = prematureJapaneseClosure(guide.steps, stepIndex)
      if (prematureNext) {
        longIssues.missingClauseClosures.push(ref({
          field: `Vの日本語を閉じた後に ${prematureNext} が残っています`,
          nextPhrase: prematureNext,
        }))
      }
      const caseCollisionNext = adjacentJapaneseCaseCollision(guide.steps, stepIndex)
      if (caseCollisionNext) {
        longIssues.adjacentJapaneseCaseCollisions.push(ref({
          field: `V/M側で「を」を閉じた直後にO ${caseCollisionNext} が続いています`,
          nextPhrase: caseCollisionNext,
        }))
      }
      if (part.status !== 'confirmed') longIssues.nonConfirmedSteps.push(ref())
      if (part.pendingRule) {
        longIssues.pendingRulePhrases.push(ref({ field: part.pendingRule }))
      }
      const requiredFields = {
        en: part.en,
        spokenEn: part.spokenEn,
        ja: part.ja,
        explanation: part.note,
      }
      for (const [field, value] of Object.entries(requiredFields)) {
        if (!`${value ?? ''}`.trim()) longIssues.missingFields.push(ref({ field }))
      }
      if (part.spokenEn && !sameEnglish(part.spokenEn, part.en)) {
        longIssues.spokenMismatches.push(ref({ spokenEn: part.spokenEn }))
      }
      const wordCount = englishWords(part.en).length
      const limit = wordLimitFor(
        part,
        LONG_SENTENCE_CORE_WORD_LIMIT,
        LONG_SENTENCE_MODIFIER_WORD_LIMIT,
      )
      if (wordCount > limit) longIssues.overWordLimit.push(ref({ wordCount, limit }))
      const roles = rolesOf(part)
      if (roles.length !== 1) longIssues.mixedRoles.push(ref({ roles }))
      if (isPrepositionFragment(guide.steps, stepIndex)) longIssues.prepositionFragments.push(ref())
      const expectedGrammar = expectedSpecialGrammar(part)
      if (!hasSpecificExplanation(part, expectedGrammar)) {
        longIssues.missingSpecialGrammar.push(ref({ expectedGrammar }))
      }
      const coordinationIssue = coordinationBindingIssue(guide.steps, stepIndex)
      if (coordinationIssue) {
        longIssues.invalidCoordinationBindings.push(ref({ field: coordinationIssue }))
      }
      const expectedLongIssue = independentLongBindingExpectationIssue(item.id, part)
      if (expectedLongIssue) {
        longIssues.semanticBindingErrors.push(ref({ field: expectedLongIssue }))
      }
      if (part.infinitiveBinding && !completeBinding(
        part.infinitiveBinding,
        ['type', 'governor', 'semanticSubject'],
      )) {
        longIssues.semanticBindingErrors.push(ref({
          field: '不定詞の機能・支配語・意味上の主語がありません',
        }))
      }
      if (part.comparisonBinding && !completeBinding(
        part.comparisonBinding,
        ['type', 'left', 'right', 'head'],
      )) {
        longIssues.semanticBindingErrors.push(ref({
          field: '比較の型・前項・後項・比較headがありません',
        }))
      }
      if (part.focusBinding && !`${part.focusBinding.type ?? ''}`.trim()) {
        longIssues.semanticBindingErrors.push(ref({
          field: '否定・焦点の作用域型がありません',
        }))
      }
      if (part.closureBinding && !completeBinding(
        part.closureBinding,
        ['type', 'opener', 'governor', 'clause'],
      )) {
        longIssues.semanticBindingErrors.push(ref({
          field: '節末受け直しの型・入口・節内容・外側支配先がありません',
        }))
      }
      const auxiliaryIssue = splitAuxiliaryIssue(guide.steps, stepIndex)
      if (auxiliaryIssue) {
        longIssues.splitAuxiliaryVerb.push(ref({ nextPhrase: auxiliaryIssue.nextPhrase }))
      }
    })
  }

  for (const [targetKey] of LONG_CLOSURE_EXPECTATIONS) {
    if (seenLongClosureTargets.has(targetKey)) continue
    const [id, phrase] = targetKey.split('|||')
    longIssues.missingClauseClosures.push(Object.freeze({
      id, stepIndex: -1, sentence: '', phrase,
      field: '長い一文の節末closure期待に対応する実フレーズがありません',
    }))
  }


  for (const reviewId of Object.keys(LONG_MANUAL_REVIEW_LEDGER)) {
    if (seenLongReviewIds.has(reviewId)) continue
    longIssues.missingManualReviewEvidence.push(Object.freeze({
      id: reviewId,
      stepIndex: -1,
      sentence: '',
      phrase: reviewId,
      field: '手動レビュー台帳に対応する現行ガイドがありません',
    }))
  }

  for (const expectationId of Object.keys(LONG_SENTENCE_ROLE_EXPECTATIONS)) {
    if (seenLongSequenceIds.has(expectationId)) continue
    longIssues.semanticBindingErrors.push(Object.freeze({
      id: expectationId,
      stepIndex: -1,
      sentence: '',
      phrase: '(phraseSequence)',
      field: '独立role列期待に対応する長い一文がありません',
    }))
  }

  const literatureIssues = {
    missingFields: [],
    reconstructionErrors: [],
    spokenMismatches: [],
    overWordLimit: [],
    invalidJapaneseSpeech: [],
  }
  let literatureSceneCount = 0
  let literatureSegmentCount = 0
  let literatureEnglishSegmentCount = 0
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    work.scenes.forEach((scene, sceneIndex) => {
      literatureSceneCount++
      const segments = scene.narrationSegments ?? []
      literatureSegmentCount += segments.length
      const joiner = work.kind === 'english' ? ' ' : ''
      const reconstructedOriginal = segments.map((segment) => segment.original).join(joiner)
      const reconstructedSpeech = segments.map((segment) => segment.speech).join(joiner)
      if (
        reconstructedOriginal !== scene.original ||
        reconstructedSpeech !== (scene.speech || scene.original)
      ) {
        literatureIssues.reconstructionErrors.push(Object.freeze({
          workId: work.id,
          sceneIndex,
          original: scene.original,
          reconstructedOriginal,
          reconstructedSpeech,
        }))
      }
      segments.forEach((segment, segmentIndex) => {
        const ref = (extra = {}) => Object.freeze({
          workId: work.id,
          sceneIndex,
          segmentIndex,
          phrase: segment.original,
          ...extra,
        })
        for (const [field, value] of Object.entries({
          original: segment.original,
          translation: segment.translation,
          speech: segment.speech,
        })) {
          if (!`${value ?? ''}`.trim()) literatureIssues.missingFields.push(ref({ field }))
        }
        if (work.kind === 'english') {
          literatureEnglishSegmentCount++
          const wordCount = englishWords(segment.original).length
          if (wordCount > 8) {
            literatureIssues.overWordLimit.push(ref({ wordCount, limit: 8 }))
          }
        }
        if (/（[^）]+）/u.test(segment.translation)) {
          const spokenJapanese = japanesePhraseSpeechText(segment.translation)
          if (
            /[（）()]/u.test(spokenJapanese) ||
            spokenJapanese !== segment.translation.replace(/[（）()]/gu, '')
          ) {
            literatureIssues.invalidJapaneseSpeech.push(ref({ spokenJapanese }))
          }
        }
      })
    })
  }

  const readingConfirmedSentenceCount =
    readingSentences.length - readingIssues.unreviewedSentences.length
  const longConfirmedSentenceCount = longTargets.length -
    longIssues.unreviewedGuides.length -
    longIssues.missingGuides.length
  const blockingReadingIssueCount = Object.values(readingIssues)
    .reduce((sum, items) => sum + items.length, 0)
  const blockingLongIssueCount = Object.values(longIssues)
    .reduce((sum, items) => sum + items.length, 0)
  const blockingLiteratureIssueCount = Object.values(literatureIssues)
    .reduce((sum, items) => sum + items.length, 0)
  const readingMeaningMultiRoleCount = readingMeaningPhrases
    .filter((phrase) => rolesOf(phrase).length > 1).length
  const confirmedRuleCount = READING_PHRASE_RULES
    .filter((item) => item.status === 'confirmed').length
  const complete =
    PASSAGES.length === 16 &&
    readingSentences.length === 363 &&
    longTargets.length === 33 &&
    PUBLIC_DOMAIN_LITERATURE.length === 9 &&
    literatureSceneCount === 59 &&
    literatureSegmentCount === 257 &&
    readingMeaningMultiRoleCount > 0 &&
    longMeaningMultiRoleCount > 0 &&
    confirmedRuleCount === READING_PHRASE_RULES.length &&
    blockingReadingIssueCount === 0 &&
    blockingLongIssueCount === 0 &&
    blockingLiteratureIssueCount === 0

  return Object.freeze({
    complete,
    rules: Object.freeze({
      total: READING_PHRASE_RULES.length,
      confirmed: confirmedRuleCount,
      reviewNeeded: READING_PHRASE_RULES.length - confirmedRuleCount,
    }),
    reading: Object.freeze({
      passageCount: PASSAGES.length,
      sentenceCount: readingSentences.length,
      confirmedSentenceCount: readingConfirmedSentenceCount,
      manuallyReviewedSentenceCount: manuallyReviewedReadingSentenceCount,
      phraseCount: readingPhrases.length,
      meaningPhraseCount: readingMeaningPhrases.length,
      meaningMultiRoleCount: readingMeaningMultiRoleCount,
      grammarBlockCount: readingGrammarBlockCount,
      confirmedPhraseCount: readingPhrases.length - readingIssues.nonConfirmedPhrases.length,
      patternCounts: patternCounts(readingSentences),
      reviewCategoryCounts: Object.freeze(Object.fromEntries(
        [...reviewCategoryCounts.entries()].sort((left, right) => right[1] - left[1]),
      )),
      correctionDecisionCount: Object.values(READING_PHRASE_CORRECTIONS)
        .reduce((sum, decisions) => sum + decisions.length, 0),
      connectorClosureReview: Object.freeze({
        candidateCount: readingConnectorCandidateCount,
        backReferenceCount: READING_CONNECTOR_CLOSURE_REVIEWS.length,
        alreadyClearCount: READING_CONNECTOR_NO_BACK_REFERENCE_REVIEWS.length,
      }),
      appliedCorrectionCount: Object.values(READING_PHRASE_CORRECTIONS)
        .reduce((sum, decisions) => sum + decisions.length, 0) -
        readingIssues.correctionMismatches.length,
      issues: Object.freeze(Object.fromEntries(
        Object.entries(readingIssues).map(([key, value]) => [key, Object.freeze(value)]),
      )),
    }),
    longSentences: Object.freeze({
      sentenceCount: longTargets.length,
      confirmedSentenceCount: longConfirmedSentenceCount,
      manuallyReviewedSentenceCount: manuallyReviewedLongSentenceCount,
      phraseCount: longStepCount,
      confirmedPhraseCount: longStepCount - longIssues.nonConfirmedSteps.length,
      meaningPhraseCount: longMeaningStepCount,
      meaningMultiRoleCount: longMeaningMultiRoleCount,
      patternCounts: patternCounts(longSentences),
      issues: Object.freeze(Object.fromEntries(
        Object.entries(longIssues).map(([key, value]) => [key, Object.freeze(value)]),
      )),
    }),
    literature: Object.freeze({
      workCount: PUBLIC_DOMAIN_LITERATURE.length,
      sceneCount: literatureSceneCount,
      segmentCount: literatureSegmentCount,
      englishSegmentCount: literatureEnglishSegmentCount,
      issues: Object.freeze(Object.fromEntries(
        Object.entries(literatureIssues).map(([key, value]) => [key, Object.freeze(value)]),
      )),
    }),
  })
}
