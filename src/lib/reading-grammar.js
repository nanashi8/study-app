import { getWord } from '../data/vocab.js'
import { lemmaCandidates, resolvePassageWord } from '../data/passage-gloss.js'
import { normalizeToken } from './text.js'
import {
  translationRoleExplanation,
  translationRoleHeading,
  translationRoleMeta,
} from './translation-roles.js'
import { getReadingPhraseExplanation } from '../data/reading-phrase-explanations.js'
import {
  READING_PHRASE_BACK_REFERENCES,
  READING_PHRASE_CORRECTIONS,
} from '../data/reading-phrase-corrections.js'
import {
  READING_BLOCK_STRUCTURE_OVERRIDES,
  READING_SENTENCE_STRUCTURE_OVERRIDES,
} from '../data/reading-block-structure-overrides.js'
import {
  pendingVerbGroupRule,
  readingManualReviewEvidence,
} from '../data/reading-phrase-review-ledger.js'
import { parseStructureMarkers } from './structure-markers.js'

export const READING_CORE_PHRASE_WORD_LIMIT = 5
export const READING_MODIFIER_PHRASE_WORD_LIMIT = 7

const CLAUSE_MARKERS = {
  because: {
    label: '理由の副詞節',
    role: 'M',
    note: 'because + S + V で「SがVするので」。主節の理由を示す副詞節です。',
  },
  although: {
    label: '譲歩の副詞節',
    role: 'M',
    note: 'although + S + V で「SがVするけれども」。予想に反する内容を主節へつなぎます。',
  },
  though: {
    label: '譲歩の副詞節',
    role: 'M',
    note: 'though + S + V で「SがVするけれども」。主節との対比を作ります。',
  },
  if: {
    label: '条件の副詞節',
    role: 'M',
    note: 'if + S + V で「もしSがVするなら」。主節が成り立つ条件を示します。',
  },
  unless: {
    label: '条件の副詞節',
    role: 'M',
    note: 'unless + S + V で「SがVしない限り」。否定を含む条件を示します。',
  },
  when: {
    label: '時の副詞節',
    role: 'M',
    note: 'when + S + V で「SがVするとき」。主節の時・場面を示します。',
  },
  while: {
    label: '時・対比の副詞節',
    role: 'M',
    note: 'while + S + V は「〜する間」または「一方で」。前後の時間・対比を示します。',
  },
  whereas: {
    label: '対比の副詞節',
    role: 'M',
    note: 'whereas + S + V で「一方で」。二つの事実を対照させます。',
  },
  since: {
    label: '理由・時の副詞節',
    role: 'M',
    note: 'since + S + V は文脈により「〜なので」または「〜して以来」を表します。',
  },
  before: {
    label: '時の副詞節',
    role: 'M',
    note: 'before + S + V で「SがVする前に」。出来事の順序を示します。',
  },
  after: {
    label: '時の副詞節',
    role: 'M',
    note: 'after + S + V で「SがVした後で」。出来事の順序を示します。',
  },
  once: {
    label: '時・条件の副詞節',
    role: 'M',
    note: 'once + S + V で「いったんSがVすると」。時と条件をまとめて示します。',
  },
  as: {
    label: '理由・時の副詞節',
    role: 'M',
    note: 'as + S + V は文脈により「〜なので」「〜するとき」「〜するにつれて」を表します。',
  },
}

const RELATIVE_MARKERS = new Set(['who', 'whom', 'whose', 'which', 'where'])
const NOUN_CLAUSE_MARKERS = new Set(['that', 'what', 'whether', 'why', 'how'])
const COORDINATORS = {
  and: 'and は同じ働きの語句・節を追加します。',
  but: 'but は前の内容と対照的な内容を結びます。',
  yet: 'yet は「それにもかかわらず」と逆接を強調します。',
  so: 'so は前の内容を原因として結果を導きます。',
  or: 'or は選択肢・言い換えを結びます。',
}

const PREPOSITIONS = new Set([
  'about', 'across', 'after', 'against', 'among', 'around', 'at', 'before',
  'behind', 'between', 'beyond', 'by', 'despite', 'during', 'for', 'from',
  'in', 'inside', 'into', 'near', 'of', 'on', 'outside', 'over', 'through',
  'to', 'under', 'until', 'with', 'within', 'without',
])

const DISCOURSE_PHRASES = [
  'as a result',
  'at first',
  'at these events',
  'by contrast',
  'by the end of',
  'even so',
  'finally',
  'for example',
  'for instance',
  'for the museum',
  'however',
  'in addition',
  'in contrast',
  'in fact',
  'in practice',
  'in response',
  'in the long term',
  'instead of',
  'more subtly',
  'nevertheless',
  'on the other hand',
  'rather',
  'similarly',
  'today',
]

const REPORTING_VERBS = new Set([
  'admit', 'argue', 'assume', 'believe', 'claim', 'conclude', 'discover',
  'explain', 'find', 'learn', 'mean', 'notice', 'predict', 'recognize',
  'remember', 'report', 'say', 'show', 'suggest', 'think', 'understand',
])

const LINKING_VERBS = new Set([
  'appear', 'be', 'become', 'feel', 'grow', 'look', 'remain', 'seem', 'sound',
  'stay',
])

const DOUBLE_OBJECT_VERBS = new Set([
  'ask', 'give', 'offer', 'send', 'show', 'teach', 'tell',
])

const OBJECT_COMPLEMENT_VERBS = new Set([
  'allow', 'call', 'consider', 'encourage', 'expect', 'find', 'help', 'keep', 'make', 'treat',
])

const AUXILIARIES = new Set([
  'am', 'are', 'be', 'been', 'being', 'can', 'could', 'did', 'do', 'does',
  'had', 'has', 'have', 'is', 'may', 'might', 'must', 'shall', 'should',
  'was', 'were', 'will', 'would', 'cannot',
])

const IRREGULAR_VERBS = new Set([
  'became', 'began', 'begun', 'brought', 'built', 'came', 'chose', 'did', 'felt',
  'forgot', 'found', 'gave', 'grew', 'grown', 'had', 'held', 'kept', 'knew', 'led', 'left',
  'made', 'met', 'paid', 'put', 'ran', 'read', 'said', 'saw', 'seen', 'sent',
  'showed', 'stood', 'taught', 'thought', 'told', 'took', 'understood',
  'went', 'wrote',
])

const IRREGULAR_LEMMAS = {
  am: 'be', are: 'be', became: 'become', been: 'be', began: 'begin',
  begun: 'begin', brought: 'bring', built: 'build', came: 'come', chose: 'choose', did: 'do',
  does: 'do', felt: 'feel', forgot: 'forget', found: 'find', gave: 'give', grew: 'grow',
  had: 'have', has: 'have', held: 'hold', is: 'be', kept: 'keep', knew: 'know',
  led: 'lead', left: 'leave', made: 'make', met: 'meet', paid: 'pay',
  grown: 'grow', ran: 'run', said: 'say', saw: 'see', seen: 'see', sent: 'send', showed: 'show',
  stood: 'stand', taught: 'teach', thought: 'think', told: 'tell', took: 'take',
  understood: 'understand', was: 'be', were: 'be', went: 'go', wrote: 'write',
}

const MID_SENTENCE_ADVERBS = new Set([
  'also', 'always', 'already', 'automatically', 'clearly', 'consequently',
  'effectively', 'equally', 'especially', 'even', 'frequently', 'generally', 'hardly',
  'longer', 'merely', 'necessarily', 'never', 'no', 'normally', 'now', 'often', 'only',
  'otherwise', 'probably', 'rarely', 'really',
  'sometimes', 'still', 'then', 'therefore', 'traditionally', 'usually',
  'soon',
])

const RECIPIENT_PRONOUNS = new Set([
  'her', 'him', 'me', 'someone', 'them', 'us', 'you',
])

const KNOWN_FINITE_VERBS = new Set(['lies', 'planted'])

const SVOC_NAMES = {
  SV: '第1文型',
  SVC: '第2文型',
  SVO: '第3文型',
  SVOO: '第4文型',
  SVOC: '第5文型',
}

const CLAUSE_READING_GUIDES = {
  '理由の副詞節': '理由を示す節なので、「なぜなら」「〜なので」と主節へつなぎます。',
  '譲歩の副詞節': '予想に反する内容を示す節なので、「〜だけれども」と主節へつなぎます。',
  '条件の副詞節': '主節が成り立つ条件を示す節なので、「もし〜なら」と受け取ります。',
  '時の副詞節': '主節の時を示す節なので、「〜するとき」と場面を先に置きます。',
  '時・対比の副詞節': '前後の内容を、時間または対比の関係でつなぐ節です。',
  '対比の副詞節': '二つの内容を「一方で」と対照させる節です。',
  '理由・時の副詞節': '文脈に合わせて、理由または時間の流れを主節へ足す節です。',
  '時・条件の副詞節': '「いったん〜すると」と、時と条件をまとめて示す節です。',
  '目的の副詞節': '主節の行動の目的を「〜するように」と示す節です。',
  '関係詞節': '直前の名詞がどのような人・物・場所かを、後ろから説明する節です。',
  '等位節': '前の節と同じ高さで、追加・対比・結果の内容を続ける節です。',
}

const clean = (text) => text.trim().replace(/\s+/g, ' ')
const bare = (text) => clean(text).replace(/^[,;:]\s*/, '').replace(/\s*([,;:.!?]+)$/, '')
const firstWord = (text) => normalizeToken(bare(text).split(/\s+/)[0] ?? '')
const toId = (word) => normalizeToken(word).replace(/[^a-z0-9]+/g, '_')

function wordRecord(word) {
  const key = normalizeToken(word)
  if (!key) return null
  const direct = getWord(toId(key))
  if (direct) return direct
  for (const lemma of lemmaCandidates(key)) {
    const candidate = getWord(toId(lemma))
    if (candidate) return candidate
  }
  return null
}

function hasVerbRecord(word) {
  const key = normalizeToken(word)
  const direct = getWord(toId(key))
  if (direct?.pos === '動') return true
  return lemmaCandidates(key).some((candidate) => getWord(toId(candidate))?.pos === '動')
}

function lemmaOf(word) {
  const key = normalizeToken(word)
  if (IRREGULAR_LEMMAS[key]) return IRREGULAR_LEMMAS[key]
  for (const candidate of lemmaCandidates(key)) {
    const record = getWord(toId(candidate))
    if (record?.pos === '動') return normalizeToken(record.word)
  }
  const record = wordRecord(key)
  if (record?.word) return normalizeToken(record.word)
  return lemmaCandidates(key)[0] ?? key
}

function isVerb(word) {
  const key = normalizeToken(word)
  if (!key) return false
  if (AUXILIARIES.has(key) || IRREGULAR_VERBS.has(key) || KNOWN_FINITE_VERBS.has(key)) return true
  return hasVerbRecord(key)
}

function tokenText(token) {
  return Array.isArray(token) ? token[0] : token
}

function isFiniteVerbAt(tokens, index) {
  const key = normalizeToken(tokenText(tokens[index]) ?? '')
  if (!key) return false
  const previous = normalizeToken(tokenText(tokens[index - 1]) ?? '')
  if (previous === 'to') return false
  if (AUXILIARIES.has(key) || IRREGULAR_VERBS.has(key)) return true
  if (KNOWN_FINITE_VERBS.has(key)) return true
  if (/ing$/.test(key)) return AUXILIARIES.has(previous)
  if (/en$/.test(key) && getWord(toId(key))?.pos !== '動') return AUXILIARIES.has(previous)
  return hasVerbRecord(key)
}

function isStrongFiniteVerbAt(tokens, index) {
  const key = normalizeToken(tokenText(tokens[index]) ?? '')
  const previous = normalizeToken(tokenText(tokens[index - 1]) ?? '')
  if (!key || previous === 'to') return false
  return AUXILIARIES.has(key) || IRREGULAR_VERBS.has(key) || KNOWN_FINITE_VERBS.has(key)
}

function isPastParticiple(word) {
  const key = normalizeToken(word)
  if (!key || getWord(toId(key))?.pos === '形') return false
  return /ed$/.test(key) || IRREGULAR_VERBS.has(key)
}

function words(text) {
  return bare(text).match(/[A-Za-z][A-Za-z'’-]*/g) ?? []
}

function hasFiniteVerb(text) {
  const tokens = words(text)
  return tokens.some((token, index) => isFiniteVerbAt(tokens, index))
}

function hasStrongFiniteVerb(text) {
  const tokens = words(text)
  return tokens.some((_, index) => isStrongFiniteVerbAt(tokens, index))
}

function hasClearFiniteVerb(text) {
  const tokens = words(text)
  return tokens.some((token, index) => {
    const key = normalizeToken(token)
    return (
      AUXILIARIES.has(key) ||
      IRREGULAR_VERBS.has(key) ||
      KNOWN_FINITE_VERBS.has(key) ||
      (index > 0 && /ed$/.test(key)) ||
      isFiniteVerbAt(tokens, index)
    )
  })
}

function hasLeadingClauseVerb(text, marker) {
  const tokens = words(text)
  const minimumIndex = words(marker).length + 1
  return tokens.some((_, index) => index >= minimumIndex && isFiniteVerbAt(tokens, index))
}

function lastVerbLemma(text) {
  const tokens = words(text)
  for (let index = tokens.length - 1; index >= 0; index--) {
    if (isVerb(tokens[index]) || isFiniteVerbAt(tokens, index)) return lemmaOf(tokens[index])
  }
  return ''
}

function punctuationOf(text) {
  return text.match(/([,;:.!?]+)\s*$/)?.[1] ?? ''
}

function displayText(text, kind) {
  const punctuation = punctuationOf(text)
  const body = bare(text)
  if (kind === 'clause') return `(${body})${punctuation}`
  if (kind === 'phrase') return `<${body}>${punctuation}`
  return `${body}${punctuation}`
}

function displayCoreWithEmbeddedClause(text, svoc) {
  const subject = svoc.parts.find((part) => part.role === 'S')?.text
  const marker = subject?.match(/\b(that|who|which|whose|where)\b/i)
  if (!subject || !marker || marker.index == null || marker.index === 0) return displayText(text, 'core')
  const markedSubject =
    `${subject.slice(0, marker.index).trim()} (${subject.slice(marker.index).trim()})`
  const punctuation = punctuationOf(text)
  return `${bare(text).replace(subject, markedSubject)}${punctuation}`
}

function splitJapanese(ja) {
  return ja
    .replace(/[。！？]+$/, '')
    .split(/、/)
    .map(clean)
    .filter(Boolean)
}

function shortGloss(word, sentenceGloss) {
  const key = normalizeToken(word)
  const inline = sentenceGloss?.[key]?.ja
  const resolved = resolvePassageWord(key, sentenceGloss)
  const raw = inline ?? resolved?.ja
  if (!raw) return null
  return raw
    .replace(/[（(][^）)]*[）)]/g, '')
    .split(/[・／/]/)[0]
    .replace(/[〜～]/g, '')
    .trim()
}

function glossTerms(word, sentenceGloss) {
  const key = normalizeToken(word)
  const raw = sentenceGloss?.[key]?.ja ?? resolvePassageWord(key, sentenceGloss)?.ja
  if (!raw) return []
  return raw
    .replace(/[（(][^）)]*[）)]/g, '')
    .split(/[・／/、]/)
    .map((term) => term.replace(/[〜～]/g, '').trim())
    .filter((term) => term.length >= 1)
}

const PHRASE_ALIGNMENT_CUES = {
  i: /私/,
  you: /あなた|皆|人々/,
  he: /彼(?!女)/,
  she: /彼女/,
  it: /それ|その|この/,
  we: /私たち|我々/,
  they: /彼ら|それら|人々|生徒|家族|参加者|住民/,
  because: /なぜ|ので|から|理由/,
  although: /けれど|にもかかわらず|譲歩/,
  though: /けれど|にもかかわらず|譲歩/,
  if: /もし|なら|れば|条件/,
  unless: /ない限り|でなければ/,
  when: /とき|際|すると/,
  while: /一方|間|ながら|同時/,
  whereas: /一方|対して/,
  before: /前/,
  after: /後|あと/,
  and: /そして|また|さらに|と|および/,
  but: /しかし|だが|けれど|そうではなく/,
  yet: /しかし|それでも|にもかかわらず/,
  or: /または|あるいは|もしくは/,
  so: /そのため|ですから|したがって|ように/,
  than: /より/,
  not: /ない|ません|ず|ではなく/,
  can: /でき|得る|可能/,
  could: /でき|得|かもしれ|可能/,
  may: /かもしれ|てもよい|可能/,
  might: /かもしれ|可能/,
  must: /なければ|必要/,
  should: /べき/,
  would: /だろう|でしょう|すること/,
  have: /持|ある|あります|いる|経験|必要/,
  has: /持|ある|あります|いる/,
  had: /持|あった|ありました|いた|なければ/,
  please: /どうぞ|ください/,
  is: /です|である|あります|いる|なり|状態/,
  are: /です|である|あります|いる|なり|状態/,
  was: /でした|だった|ありました|いました/,
  were: /でした|だった|ありました|いました/,
  be: /である|なる|いる|ある/,
  each: /それぞれ|一人ずつ|各/,
  every: /毎|すべて/,
  all: /すべて|全/,
  both: /両方|双方/,
  only: /だけ|のみ/,
  own: /自分|自身|独自|自ら/,
  open: /開|公開/,
  about: /について|内容|関して/,
  such: /そのよう|こうした/,
  most: /最も|ほとんど|大半/,
  more: /より|もっと|多く/,
  how: /どのよう|方法/,
  why: /なぜ|理由/,
  whether: /かどうか/,
  without: /ずに|なしに/,
  instead: /代わり/,
  rather: /よりも|むしろ/,
  from: /から/,
  with: /と|一緒|使って/,
  into: /へ|に|中へ/,
  under: /下/,
  over: /越え|以上|にわた/,
}

const PHRASE_BOUNDARY_WORDS = new Set([
  ...Object.keys(CLAUSE_MARKERS),
  ...RELATIVE_MARKERS,
  ...NOUN_CLAUSE_MARKERS,
  ...Object.keys(COORDINATORS),
  ...PREPOSITIONS,
  ...MID_SENTENCE_ADVERBS,
  'even', 'finally', 'however', 'instead', 'more', 'nevertheless', 'not',
  'only', 'rather', 'similarly', 'therefore', 'thus', 'today',
])

const PHRASE_DETERMINERS = new Set([
  'a', 'an', 'another', 'any', 'each', 'either', 'every', 'her', 'his', 'its',
  'many', 'much', 'my', 'no', 'our', 'several', 'some', 'the', 'their', 'these',
  'this', 'those', 'your',
])

const FIXED_PHRASE_PAIRS = new Set([
  'a lot', 'according to', 'as a', 'as well', 'at least', 'because of',
  'both and', 'each other', 'even though', 'even when', 'in order',
  'instead of', 'more than', 'not only', 'of the', 'on the', 'rather than',
  'so that', 'such as', 'to the',
])

function japaneseAlignmentForms(term) {
  const cleaned = term
    .replace(/[「」『』（）()\s〜～・]/g, '')
    .replace(/(?:です|ます|でした|ました)$/, '')
  const forms = [cleaned]
  const leadingKanji = cleaned.match(/^[一-龠々]+/)?.[0]
  if (leadingKanji) forms.push(leadingKanji)
  if (/する$/.test(cleaned)) forms.push(cleaned.slice(0, -2))
  if (/くる$/.test(cleaned)) forms.push(`${cleaned.slice(0, -2)}き`)
  const renyoEndings = {
    う: 'い', く: 'き', ぐ: 'ぎ', す: 'し', つ: 'ち', ぬ: 'に',
    ぶ: 'び', む: 'み', る: 'り',
  }
  const ending = cleaned.at(-1)
  if (renyoEndings[ending]) forms.push(`${cleaned.slice(0, -1)}${renyoEndings[ending]}`)
  if (/[るい]$/.test(cleaned)) forms.push(cleaned.slice(0, -1))
  return [...new Set(forms.filter(Boolean))]
}

function englishSpanAlignmentScore(tokens, start, end, ja, sentenceGloss) {
  let score = 0
  let lexicalMatches = 0
  const normalizedJa = ja.replace(/[「」『』（）()\s]/g, '')
  for (let index = start; index < end; index++) {
    const key = normalizeToken(tokenText(tokens[index]))
    const lemma = lemmaOf(key)
    const cue = PHRASE_ALIGNMENT_CUES[key] ?? PHRASE_ALIGNMENT_CUES[lemma]
    if (cue?.test(normalizedJa)) score += 7
    const terms = glossTerms(key, sentenceGloss)
    let best = 0
    for (const term of terms) {
      for (const form of japaneseAlignmentForms(term)) {
        if (!normalizedJa.includes(form)) continue
        best = Math.max(best, 5 + Math.min(form.length, 5))
      }
    }
    if (best > 0) {
      lexicalMatches++
      score += best
    }
  }

  const length = end - start
  if (lexicalMatches === 0 && length > 2) score -= length - 2
  if (length > 6) score -= (length - 6) * (length - 6) * 2

  const first = normalizeToken(tokenText(tokens[start]))
  const last = normalizeToken(tokenText(tokens[end - 1]))
  const lastCue = PHRASE_ALIGNMENT_CUES[last] ?? PHRASE_ALIGNMENT_CUES[lemmaOf(last)]
  if (
    length === 1 &&
    (Object.hasOwn(COORDINATORS, first) || CLAUSE_MARKERS[first]) &&
    !/^(?:そして|しかし|あるいは|また|さらに|一方|それでも|そうではなく|そのため|ですから|したがって|なぜなら|もし|〜するとき|するとき)$/.test(
      normalizedJa.replace(/[、。]/g, ''),
    )
  ) {
    score -= 24
  }
  if (PHRASE_DETERMINERS.has(last)) score -= 18
  if (last === 'to') score -= 18
  if (PREPOSITIONS.has(last) && !lastCue?.test(normalizedJa)) score -= 10
  if (Object.hasOwn(COORDINATORS, last) && !lastCue?.test(normalizedJa)) score -= 24
  if (AUXILIARIES.has(last) && !lastCue?.test(normalizedJa)) score -= 7
  return score
}

function englishBoundaryScore(text, tokens, index) {
  const left = normalizeToken(tokenText(tokens[index - 1]))
  const right = normalizeToken(tokenText(tokens[index]))
  const beforeLeft = normalizeToken(tokenText(tokens[index - 2]) ?? '')
  const between = text.slice(
    tokens[index - 1].index + tokenText(tokens[index - 1]).length,
    tokens[index].index,
  )
  let score = /[,;:]/.test(between) ? 9 : 0
  if (PHRASE_BOUNDARY_WORDS.has(right)) score += 4
  if (PHRASE_DETERMINERS.has(right)) score += 2
  if (isFiniteVerbAt(tokens, index)) score += 5
  if (AUXILIARIES.has(right)) score += 4
  const continuesAuxiliaryGroup =
    AUXILIARIES.has(right) ||
    IRREGULAR_VERBS.has(right) ||
    /(?:ed|ing)$/.test(right) ||
    wordRecord(right)?.pos === '動'
  if (AUXILIARIES.has(left) && continuesAuxiliaryGroup) score -= 30
  if (
    MID_SENTENCE_ADVERBS.has(left) &&
    AUXILIARIES.has(beforeLeft) &&
    isVerb(right)
  ) score -= 24
  if (!AUXILIARIES.has(left) && isVerb(left) && !PREPOSITIONS.has(right)) score += 6
  if (isPastParticiple(right) && !AUXILIARIES.has(left)) score += 6
  if (Object.hasOwn(COORDINATORS, left)) score += 2
  if (/ly$/.test(right)) score += 1

  const pair = `${left} ${right}`
  if (FIXED_PHRASE_PAIRS.has(pair)) score -= 24
  if (PHRASE_DETERMINERS.has(left)) score -= 18
  if (left === 'to') score -= 20
  if (PREPOSITIONS.has(left) && !['and', 'or'].includes(right)) score -= 13
  if (wordRecord(left)?.pos === '形' && wordRecord(right)?.pos === '名') score -= 12
  if (
    PHRASE_DETERMINERS.has(normalizeToken(tokenText(tokens[index - 2]))) &&
    wordRecord(right)?.pos === '名'
  ) score -= 10
  if (lemmaOf(left) === 'be' && isPastParticiple(right)) score -= 18
  return score
}

function alignEnglishPhrases(text, jaSegments, sentenceGloss) {
  const body = clean(text)
  const tokens = [...body.matchAll(/[A-Za-z][A-Za-z'’-]*/g)]
  const phraseCount = jaSegments.length
  if (phraseCount <= 1 || tokens.length <= 1) return [body]

  const dp = Array.from({ length: phraseCount + 1 }, () =>
    Array(tokens.length + 1).fill(null))
  dp[0][0] = { score: 0, cuts: [] }

  for (let phraseIndex = 0; phraseIndex < phraseCount; phraseIndex++) {
    const remainingPhrases = phraseCount - phraseIndex - 1
    for (let start = phraseIndex; start < tokens.length; start++) {
      const previous = dp[phraseIndex][start]
      if (!previous) continue
      const maxEnd = tokens.length - remainingPhrases
      for (let end = start + 1; end <= maxEnd; end++) {
        const proportionalEnd = ((phraseIndex + 1) * tokens.length) / phraseCount
        const alignment = englishSpanAlignmentScore(
          tokens,
          start,
          end,
          jaSegments[phraseIndex],
          sentenceGloss,
        )
        const boundary = start > 0 ? englishBoundaryScore(body, tokens, start) : 0
        const balance = -Math.abs(end - proportionalEnd) * 0.08
        const score = previous.score + alignment + boundary + balance
        const current = dp[phraseIndex + 1][end]
        if (!current || score > current.score) {
          dp[phraseIndex + 1][end] = {
            score,
            cuts: [...previous.cuts, end],
          }
        }
      }
    }
  }

  const cuts = dp[phraseCount][tokens.length]?.cuts
  if (!cuts) return [body]
  let start = 0
  return cuts.map((end) => {
    const startAt = start === 0 ? 0 : tokens[start].index
    const endAt = end === tokens.length ? body.length : tokens[end].index
    const phrase = clean(body.slice(startAt, endAt))
    start = end
    return phrase
  })
}

const STRUCTURAL_CONNECTORS = new Set([
  'after', 'although', 'and', 'as', 'as a result', 'because', 'before', 'but',
  'but also', 'even though', 'even when', 'for example', 'how', 'however', 'if', 'in addition', 'lest', 'nor',
  'not only', 'once', 'or',
  'provided that', 'rather than', 'since', 'so', 'than', 'that', 'though', 'unless', 'what',
  'when', 'where', 'whereas', 'whether', 'which', 'while', 'who', 'whom',
  'whose', 'why', 'yet',
])

function findTokenSequence(haystack, needle, from = 0) {
  if (!needle.length) return -1
  outer: for (let start = from; start <= haystack.length - needle.length; start++) {
    for (let offset = 0; offset < needle.length; offset++) {
      if (haystack[start + offset] !== needle[offset]) continue outer
    }
    return start
  }
  return -1
}

function phraseRoleSpans(en, parts) {
  const blockTokens = words(en).map(normalizeToken)
  let cursor = 0
  return (parts ?? []).flatMap((part) => {
    const partTokens = words(part.text).map(normalizeToken)
    let start = findTokenSequence(blockTokens, partTokens, cursor)
    if (start < 0) start = findTokenSequence(blockTokens, partTokens)
    if (start < 0) return []
    cursor = start + partTokens.length
    return [{ role: part.role, start, end: cursor }]
  })
}

function japaneseParticleRole(ja, english, kind, blockRole, spanRoles) {
  const normalized = ja.replace(/[、。！？\s]+$/g, '')
  const first = firstWord(english)
  const englishTokens = words(english).map(normalizeToken)
  const infinitive = first === 'to' && englishTokens.length > 1 && (
    isVerb(englishTokens[1]) ||
    japaneseLooksPredicate(ja)
  )
  const beginsAsModifier =
    (!infinitive && PREPOSITIONS.has(first)) ||
    /^(?:not only )?(?:on|in|at|by|for|from|with|without|through|across|under|over|within)\b/i.test(english)
  const endsAsModifier = /(?:によって|にとって|について|として|のもとで|を越えて|より|までには|前に|あとに|ために|ように|ながら|限り)$/.test(normalized)
  if (
    beginsAsModifier ||
    endsAsModifier
  ) return 'M'
  if (/(?:には|では|からは|までは|よりは|とは|にも)$/.test(normalized)) {
    return spanRoles.includes('M') ? 'M' : null
  }
  if (/(?:は|が|も|こそ)$/.test(normalized)) return 'S'
  if (/(?:を)$/.test(normalized)) return 'O'
  return null
}

function phraseScope(kind, blockRole) {
  if (kind === 'clause') return `${blockRole ?? 'M'}節内`
  if (kind === 'phrase') return `${blockRole ?? 'M'}句`
  return ''
}

const PHRASE_DISCOURSE_MODIFIERS = new Set([
  'early', 'finally', 'first', 'firstly', 'instead', 'later', 'next', 'now', 'perhaps',
  'please', 'recently', 'second', 'secondly', 'then', 'third', 'thirdly',
  'today', 'tomorrow', 'well', 'yesterday',
])

// The general vocabulary list intentionally gives one representative part of
// speech per headword, so common noun/verb homographs such as water and test
// cannot always be recovered from that list alone.  These are verb forms that
// occur as predicates in the reading corpus and therefore need an explicit
// structural reading here.
const READING_PREDICATE_FORMS = new Set([
  'adapt', 'appeared', 'ask', 'bears', 'bring', 'carries', 'continue', 'cools', 'decide',
  'balance', 'damage', 'declines', 'deepen', 'deliberate', 'design', 'direct', 'enter',
  'force', 'gives', 'guarantee', 'improves', 'increases', 'influence', 'limit', 'need',
  'offer', 'open', 'provide', 'question', 'redefine', 'remain', 'replace', 'review',
  'revise', 'reward', 'show', 'sound', 'suppose', 'support', 'test', 'water', 'write',
])

function leadingConnectorLength(tokens) {
  const two = tokens.slice(0, 2).join(' ')
  if (STRUCTURAL_CONNECTORS.has(two)) return 2
  return STRUCTURAL_CONNECTORS.has(tokens[0]) ? 1 : 0
}

function japaneseLooksPredicate(ja) {
  const normalized = ja
    .replace(/（[^）]*）/g, '')
    .replace(/[、。！？\s]+$/g, '')
  return /(?:ます|ました|ません|ませんでした|ましょう|ください|です|でした|である|だった|だろう|する|した|している|される|された|できる|なります|なる|なった|あります|ある|います|いる|いた|でしょう|かもしれない|べき|ない|なかった|続く|変わる|減る|増える|高すぎる|難しい|れば|なら|たら|場合|か|のか|ということ|[一-龠々ぁ-ん](?:う|く|ぐ|す|つ|ぬ|ぶ|む|る)(?:こと|の)|[ぁ-ん]た(?:こと|の)|わけではありません|可能性がある|からです|[一-龠々ぁ-ん](?:う|く|ぐ|す|つ|ぬ|ぶ|む|る)|[一-龠々ぁ-ん]い|[ぁ-ん]た|ず)(?:と|を|に|も)?$/.test(normalized)
}

function phraseVerbIndex(tokens, start, predicateHint = false) {
  for (let index = start; index < tokens.length; index++) {
    const token = tokens[index]
    if (
      AUXILIARIES.has(token) ||
      IRREGULAR_VERBS.has(token) ||
      KNOWN_FINITE_VERBS.has(token) ||
      /(?:ed|ing|s)$/.test(token) && isVerb(token)
    ) return index
  }
  for (let index = start; index < tokens.length; index++) {
    if (isVerb(tokens[index])) return index
  }
  if (predicateHint) {
    for (let index = start; index < tokens.length; index++) {
      if (READING_PREDICATE_FORMS.has(tokens[index]) || /(?:ed|ing)$/.test(tokens[index])) {
        return index
      }
    }
  }
  return -1
}

function japaneseLooksFinitePredicate(ja) {
  const normalized = ja
    .replace(/（[^）]*）/g, '')
    .replace(/[、。！？\s]+$/g, '')
  return /(?:ます|ました|ません|ませんでした|ましょう|ください|でしょう|かもしれません|なければなりませんでした|からです|可能性がある|なら|場合|か|のか)(?:と|を|に|も)?$/.test(normalized)
}

function explicitPhraseRoleParts(
  english,
  ja,
  kind,
  blockRole,
  spanRoles,
  blockStart,
  previousEnglish,
  nextEnglish,
  previousJapanese,
  nextJapanese,
  previousRoleParts,
) {
  const originalTokens = words(english)
  const tokens = originalTokens.map(normalizeToken)
  if (!tokens.length) return null
  const joined = tokens.join(' ')
  const display = (start, end = originalTokens.length) =>
    originalTokens.slice(start, end).join(' ')
  const particleRole = japaneseParticleRole(ja, english, kind, blockRole, [])
  if (joined === 'once' && /かつて/.test(ja)) {
    return [{ role: 'M', en: display(0) }]
  }
  const relativePronounAsSubject =
    ['that', 'which', 'who'].includes(joined) &&
    /^(?:そして|また|一方).*(?:は|が|には)$/.test(ja.replace(/[、。！？\s]+$/g, ''))
  if (relativePronounAsSubject) {
    return [{ role: 'S', en: display(0) }]
  }
  const interrogativeObjectBeforeSubject =
    ['what', 'which', 'whom'].includes(joined) &&
    /(?:は|が)$/.test((nextJapanese ?? '').replace(/[、。！？\s]+$/g, ''))
  if (interrogativeObjectBeforeSubject) {
    return [{ role: 'O', en: display(0) }]
  }
  const grammaticalPronounRole =
    ['that', 'what', 'which', 'who', 'whom'].includes(joined) &&
    ['S', 'O'].includes(particleRole) &&
    !/(?:ということ|かどうか)/.test(ja)
  if (grammaticalPronounRole) {
    return [{ role: particleRole, en: display(0) }]
  }
  if (STRUCTURAL_CONNECTORS.has(joined)) {
    return [{ role: 'LINK', en: display(0) }]
  }

  const demonstrativeThat =
    tokens[0] === 'that' &&
    (
      (originalTokens[0] === 'That' && kind === 'core' && blockStart === 0) ||
      /^(?:その|この|あの)/.test(ja)
    )
  const connectorLength = demonstrativeThat ? 0 : leadingConnectorLength(tokens)
  const japanesePredicate = japaneseLooksPredicate(ja)
  const infinitivePredicate =
    tokens[0] === 'to' &&
    tokens.length > 1 &&
    (isVerb(tokens[1]) || japanesePredicate)
  const prepositionalVerbal =
    PREPOSITIONS.has(tokens[0]) &&
    tokens.length > 1 &&
    (tokens[1] === 'being' || /ing$/.test(tokens[1])) &&
    japanesePredicate
  const unambiguousModifier =
    (PREPOSITIONS.has(tokens[0]) && !infinitivePredicate && !prepositionalVerbal) ||
    tokens[0] === 'alongside' ||
    normalizeToken(previousEnglish?.split(/\s+/).at(-1) ?? '') === 'toward' ||
    (/ly$/.test(tokens[0]) && PREPOSITIONS.has(tokens[1])) ||
    /^(?:less by|more than|less than|not by|online longer)\b/.test(joined) ||
    joined === 'not'
  if (unambiguousModifier) {
    return [{ role: 'M', en: display(0) }]
  }
  const simpleModifierToken = (token) =>
    MID_SENTENCE_ADVERBS.has(token) ||
    PHRASE_DISCOURSE_MODIFIERS.has(token) ||
    /ly$/.test(token) ||
    ['above', 'away', 'below', 'better', 'down', 'early', 'earlier', 'elsewhere',
      'farther', 'first', 'later', 'longer', 'more', 'most', 'out', 'soon', 'up', 'well']
      .includes(token)
  if (tokens.every(simpleModifierToken)) {
    return [{ role: 'M', en: display(0) }]
  }

  const previousTokens = words(previousEnglish ?? '').map(normalizeToken)
  const previousPredicate =
    previousRoleParts?.some((part) => part.role === 'V') ||
    (
      previousTokens.length > 0 &&
      (
        japaneseLooksPredicate(previousJapanese ?? '') ||
        /(?:前に|あとに)$/.test((previousJapanese ?? '').replace(/[、。！？\s]+$/g, ''))
      ) &&
      phraseVerbIndex(previousTokens, leadingConnectorLength(previousTokens), true) >= 0
    )
  const previousLemma = previousPredicate ? lastVerbLemma(previousEnglish ?? '') : ''
  const japaneseBare = ja.replace(/[、。！？\s]+$/g, '')
  const followingStructuralRole = spanRoles.find((role) =>
    ['O', 'O1', 'O2', 'C'].includes(role))
  const focusModifierRole =
    ['even', 'only'].includes(tokens[0]) &&
    tokens.length > 1 &&
    spanRoles.find((role) => ['S', 'O', 'O1', 'O2', 'C'].includes(role))
  if (focusModifierRole) {
    return [
      { role: 'M', en: display(0, 1) },
      { role: focusModifierRole, en: display(1) },
    ]
  }
  const nounPhraseShape =
    PHRASE_DETERMINERS.has(tokens[0]) ||
    ['anything', 'everything', 'nothing', 'someone', 'something'].includes(tokens[0]) ||
    (tokens.length > 1 && ['形', '名'].includes(wordRecord(tokens[0])?.pos)) ||
    followingStructuralRole
  const japaneseObjectShape = /を(?:[^ぁ-んァ-ヶ一-龠]*|.*(?:さえ|だけ|一つも))$/.test(japaneseBare) ||
    /(?:こと|の)を$/.test(japaneseBare)
  const firstTokenIsGerund = /ing$/.test(tokens[0]) && !/(?:thing|king|spring)$/.test(tokens[0])
  const nounRoleOverride =
    nounPhraseShape &&
    !connectorLength &&
    !AUXILIARIES.has(tokens[0]) &&
    !LINKING_VERBS.has(lemmaOf(tokens[0])) &&
    tokens[0] !== 'to' &&
    !PREPOSITIONS.has(tokens[0]) &&
    !(firstTokenIsGerund && japanesePredicate)
  if (nounRoleOverride) {
    if (
      RECIPIENT_PRONOUNS.has(normalizeToken(previousEnglish ?? '')) &&
      /に$/.test(japaneseBare)
    ) {
      return [{ role: 'C', en: display(0) }]
    }
    if (previousPredicate) {
      return [{
        role: japaneseObjectShape
          ? 'O'
          : LINKING_VERBS.has(previousLemma)
            ? 'C'
            : 'O',
        en: display(0),
      }]
    }
    if (japaneseObjectShape) {
      return [{ role: followingStructuralRole && followingStructuralRole !== 'C'
        ? followingStructuralRole
        : 'O', en: display(0) }]
    }
    if (/(?:です|でした|である|だった)$/.test(japaneseBare) && spanRoles.includes('C')) {
      return [{ role: 'C', en: display(0) }]
    }
  }

  const connectorGerundPredicate =
    connectorLength > 0 &&
    /ing$/.test(tokens[connectorLength] ?? '') &&
    /(?:こと|する|した|して|る|む|す)/.test(ja)
  const verbIndex = phraseVerbIndex(
    tokens,
    connectorLength,
    japanesePredicate || connectorGerundPredicate,
  )
  const strongEnglishPredicate = verbIndex >= 0 && (
    (verbIndex === connectorLength && AUXILIARIES.has(tokens[verbIndex])) ||
    (
      verbIndex === tokens.length - 1 &&
      tokens[verbIndex] !== 'being' &&
      AUXILIARIES.has(tokens[verbIndex])
    )
  )
  const predicateLike = verbIndex >= 0 && (
    japanesePredicate || strongEnglishPredicate || infinitivePredicate || connectorGerundPredicate
  )
  if (joined === 'but one') {
    return [
      { role: 'LINK', en: display(0, 1) },
      { role: 'C', en: display(1) },
    ]
  }
  if (joined === 'but not') {
    return [
      { role: 'LINK', en: display(0, 1) },
      { role: 'M', en: display(1) },
    ]
  }
  if (joined === 'or visitors') {
    return [
      { role: 'LINK', en: display(0, 1) },
      { role: 'O', en: display(1) },
    ]
  }
  if (joined === 'and flexibility') {
    return [
      { role: 'LINK', en: display(0, 1) },
      { role: 'O', en: display(1) },
    ]
  }
  if (/^(?:and|or) how$/.test(joined)) {
    return [{ role: 'LINK', en: display(0) }]
  }
  if (['controlled', 'inaccessible'].includes(joined)) {
    return [{ role: 'C', en: display(0) }]
  }
  if (joined === 'as well') {
    return [{ role: 'M', en: display(0) }]
  }
  if (joined === 'for change') {
    return [{ role: 'M', en: display(0) }]
  }
  if (joined === 'as relevant') {
    return [
      { role: 'LINK', en: display(0, 1) },
      { role: 'C', en: display(1) },
    ]
  }
  if (/^(?:and|or) reduced risk\b/.test(joined)) {
    return [
      { role: 'LINK', en: display(0, 1) },
      { role: 'O', en: display(1) },
    ]
  }
  if (
    kind === 'phrase' &&
    blockRole === 'M' &&
    PREPOSITIONS.has(tokens[0]) &&
    !infinitivePredicate
  ) {
    return [{ role: 'M', en: display(0) }]
  }
  const previousEndsWithPrevent = /\bprevent(?:s|ed)?$/i.test(previousEnglish ?? '')
  if (previousEndsWithPrevent && /^from\b/i.test(nextEnglish ?? '')) {
    return [{ role: 'O', en: display(0) }]
  }
  if (
    joined === 'visits' &&
    /\breport$/i.test(previousEnglish ?? '')
  ) {
    return [{ role: 'O', en: display(0) }]
  }
  if (
    ['has stopped working', 'help show', 'left out', 'take part', 'used to write']
      .includes(joined)
  ) {
    return [{ role: 'V', en: display(0) }]
  }
  if (
    ['do not have to', 'had to', 'had to remain', 'had to throw', 'have always had to respond']
      .includes(joined)
  ) {
    return [{ role: 'V', en: display(0) }]
  }
  if (joined === 'does more than') {
    return [
      { role: 'V', en: display(0, 1) },
      { role: 'M', en: display(1) },
    ]
  }
  if (joined === 'especially when') {
    return [
      { role: 'M', en: display(0, 1) },
      { role: 'LINK', en: display(1) },
    ]
  }

  if (tokens[0] === 'how' && tokens.length > 1 && tokens[1] !== 'to') {
    const tailRole = particleRole === 'S'
      ? 'S'
      : /(?:long|often|quickly|slowly|strongly)$/.test(tokens.at(-1))
        ? 'M'
        : 'C'
    return [
      { role: 'LINK', en: display(0, 1) },
      { role: tailRole, en: display(1) },
    ]
  }

  if (
    particleRole === 'S' &&
    previousPredicate &&
    !predicateLike &&
    spanRoles.some((role) => ['O', 'O1', 'O2'].includes(role))
  ) {
    const objectRole = spanRoles.find((role) => ['O', 'O1', 'O2'].includes(role))
    return [{ role: objectRole, en: display(0) }]
  }

  if (['S', 'O', 'M'].includes(particleRole) && !predicateLike) {
    if (connectorLength && connectorLength < tokens.length) {
      return [
        { role: 'LINK', en: display(0, connectorLength) },
        { role: particleRole, en: display(connectorLength) },
      ]
    }
    return [{ role: particleRole, en: display(0) }]
  }

  const subjectPronouns = new Set(['he', 'i', 'it', 'she', 'they', 'we', 'you'])
  if (
    subjectPronouns.has(tokens[0]) &&
    tokens.length > 1 &&
    tokens.slice(1).every((token) => MID_SENTENCE_ADVERBS.has(token) || /ly$/.test(token))
  ) {
    return [
      { role: 'S', en: display(0, 1) },
      { role: 'M', en: display(1) },
    ]
  }

  const currentStartsNounPhrase =
    !PREPOSITIONS.has(tokens[0]) &&
    !STRUCTURAL_CONNECTORS.has(tokens[0]) &&
    !MID_SENTENCE_ADVERBS.has(tokens[0]) &&
    !PHRASE_DISCOURSE_MODIFIERS.has(tokens[0]) &&
    !/ly$/.test(tokens[0])
  if (!predicateLike && previousPredicate && currentStartsNounPhrase) {
    return [{ role: LINKING_VERBS.has(previousLemma) ? 'C' : 'O', en: display(0) }]
  }

  if (connectorLength && connectorLength < tokens.length && !predicateLike) {
    const tail = tokens.slice(connectorLength)
    const structuralRole = [...spanRoles]
      .reverse()
      .find((role) => ['S', 'O', 'O1', 'O2', 'C', 'M'].includes(role))
    const tailRole =
      PREPOSITIONS.has(tail[0])
        ? 'M'
        : tail[0] === 'too' || wordRecord(tail.at(-1))?.pos === '形'
        ? 'C'
        : structuralRole ?? (['S', 'O', 'O1', 'O2', 'C', 'M'].includes(blockRole) ? blockRole : 'M')
    return [
      { role: 'LINK', en: display(0, connectorLength) },
      { role: tailRole, en: display(connectorLength) },
    ]
  }

  const first = tokens[0]
  const obviousModifier =
    particleRole === 'M' ||
    PREPOSITIONS.has(first) ||
    MID_SENTENCE_ADVERBS.has(first) ||
    PHRASE_DISCOURSE_MODIFIERS.has(first) ||
    /ly$/.test(first) ||
    /^(?:as well|longer|more readily)$/.test(joined) ||
    /^(?:last|next|this|every)\s+(?:day|week|month|year|morning|spring|summer|autumn|winter|night)$/.test(joined) ||
    /^(?:such as|along|rather than)\b/.test(joined)
  if (obviousModifier && !predicateLike) {
    return [{ role: 'M', en: display(0) }]
  }

  if (!predicateLike) {
    if (kind === 'phrase' && words(english).length === 1 && wordRecord(first)?.pos === '形') {
      return [{ role: 'M', en: display(0) }]
    }
    return null
  }

  const detachedParticiple =
    connectorLength === 0 &&
    /(?:ed|ing)$/.test(tokens[verbIndex]) &&
    !AUXILIARIES.has(tokens[verbIndex]) &&
    !spanRoles.includes('V') &&
    !japaneseLooksFinitePredicate(ja)
  if (detachedParticiple) {
    if (
      /ing$/.test(tokens[verbIndex]) &&
      japanesePredicate &&
      !(blockStart === 0 && spanRoles.includes('S'))
    ) {
      return [{ role: 'V', en: display(0) }]
    }
    const nominalizedAction =
      /(?:こと|の)を$/.test(ja.replace(/[、。！？\s]+$/g, '')) &&
      /ing$/.test(tokens[verbIndex])
    if (nominalizedAction) {
      return [{ role: 'V', en: display(0) }]
    }
    if (PREPOSITIONS.has(normalizeToken(previousEnglish ?? ''))) {
      return [{ role: 'V', en: display(0) }]
    }
    const gerundSubject = blockStart === 0 && spanRoles.includes('S') && /ing$/.test(tokens[verbIndex])
    return [{ role: gerundSubject ? 'S' : 'M', en: display(0) }]
  }

  const parts = []
  if (connectorLength) {
    const markerIsSubject =
      connectorLength === 1 &&
      ['that', 'which', 'who'].includes(tokens[0]) &&
      verbIndex === connectorLength
    parts.push({
      role: markerIsSubject ? 'S' : 'LINK',
      en: display(0, connectorLength),
    })
  }
  const verbStart = verbIndex > connectorLength && tokens[verbIndex - 1] === 'to'
    ? verbIndex - 1
    : verbIndex
  if (verbStart > connectorLength) {
    const beforeVerb = tokens.slice(connectorLength, verbStart)
    const modifierOnly = beforeVerb.every((token) =>
      MID_SENTENCE_ADVERBS.has(token) ||
      PHRASE_DISCOURSE_MODIFIERS.has(token) ||
      /ly$/.test(token))
    parts.push({
      role: modifierOnly || PREPOSITIONS.has(beforeVerb[0]) ? 'M' : 'S',
      en: display(connectorLength, verbStart),
    })
  }

  let verbEnd = verbIndex + 1
  while (verbEnd < tokens.length) {
    const token = tokens[verbEnd]
    const previous = tokens[verbEnd - 1]
    if (
      token === 'not' ||
      MID_SENTENCE_ADVERBS.has(token) ||
      /ly$/.test(token) ||
      AUXILIARIES.has(token) ||
      (
        (
          AUXILIARIES.has(previous) ||
          previous === 'not' ||
          MID_SENTENCE_ADVERBS.has(previous) ||
          /ly$/.test(previous)
        ) &&
        (isVerb(token) || READING_PREDICATE_FORMS.has(token) || /(?:ed|ing)$/.test(token))
      )
    ) verbEnd++
    else break
  }
  parts.push({ role: 'V', en: display(verbStart, verbEnd) })
  if (verbEnd < tokens.length) {
    const remainder = tokens.slice(verbEnd)
    if (joined === 'combined or sold') {
      return [
        { role: 'V', en: display(0, 1) },
        { role: 'LINK', en: display(1, 2) },
        { role: 'V', en: display(2) },
      ]
    }
    const verbHead = [...tokens.slice(verbIndex, verbEnd)]
      .reverse()
      .find((token) =>
        !MID_SENTENCE_ADVERBS.has(token) && token !== 'not' && !/ly$/.test(token))
    const verbLemma = lemmaOf(verbHead ?? tokens[verbIndex])
    const modifierToken = (token) =>
      MID_SENTENCE_ADVERBS.has(token) ||
      PHRASE_DISCOURSE_MODIFIERS.has(token) ||
      /ly$/.test(token) ||
      ['above', 'away', 'below', 'better', 'down', 'early', 'elsewhere', 'farther', 'later', 'longer', 'more', 'most', 'often', 'out', 'soon', 'up', 'well'].includes(token)
    const coordinatedVerb =
      ['and', 'or'].includes(remainder[0]) &&
      remainder.length > 1 &&
      (isVerb(remainder[1]) || /(?:ed|ing)$/.test(remainder[1]))
    if (coordinatedVerb) {
      parts.push({ role: 'LINK', en: display(verbEnd, verbEnd + 1) })
      parts.push({ role: 'V', en: display(verbEnd + 1) })
      return parts
    }
    const modifierRemainder = remainder.every(modifierToken)
    const invertedAuxiliary =
      verbIndex === connectorLength &&
      verbEnd === verbIndex + 1 &&
      ['can', 'could', 'did', 'do', 'does', 'may', 'might', 'must', 'shall', 'should', 'will', 'would']
        .includes(tokens[verbIndex])
    const role = invertedAuxiliary
      ? 'S'
      : PREPOSITIONS.has(remainder[0]) || modifierRemainder
      ? 'M'
      : LINKING_VERBS.has(verbLemma)
        ? 'C'
        : 'O'
    const objectComplement =
      OBJECT_COMPLEMENT_VERBS.has(verbLemma) &&
      remainder.length > 1 &&
      ['her', 'him', 'it', 'me', 'someone', 'them', 'us', 'you']
        .includes(remainder[0])
    if (objectComplement) {
      parts.push({ role: 'O', en: display(verbEnd, verbEnd + 1) })
      parts.push({ role: 'C', en: display(verbEnd + 1) })
      return parts
    }
    const trailingModifierStart = role === 'O'
      ? remainder.findIndex((token, index) => index > 0 && remainder.slice(index).every(modifierToken))
      : -1
    if (trailingModifierStart > 0) {
      parts.push({ role: 'O', en: display(verbEnd, verbEnd + trailingModifierStart) })
      parts.push({ role: 'M', en: display(verbEnd + trailingModifierStart) })
    } else {
      parts.push({ role, en: display(verbEnd) })
    }
  }
  return parts
}

function phraseRoleParts(englishTokens, start, end, spans, roles, connector, explicitParts) {
  const parts = explicitParts ?? (connector
    ? [{ role: 'LINK', en: englishTokens.join(' ') }]
    : spans
        .filter((span) => span.start < end && span.end > start)
        .map((span) => ({
          role: span.role,
          en: englishTokens
            .slice(Math.max(span.start, start) - start, Math.min(span.end, end) - start)
            .join(' '),
        }))
        .filter((part) => part.en))
  const coveredTokens = parts.flatMap((part) => words(part.en).map(normalizeToken))
  const complete =
    coveredTokens.length === englishTokens.length &&
    coveredTokens.every((token, index) => token === englishTokens[index])
  const normalized = parts.length && complete && parts.every((part) => roles.includes(part.role))
    ? parts
    : [{ role: roles[0] ?? 'M', en: englishTokens.join(' ') }]
  return Object.freeze(normalized.map((part) => {
    const meta = translationRoleMeta(part.role)
    return Object.freeze({
      ...part,
      code: meta.code,
      label: meta.label,
      question: meta.question,
      japaneseShape: meta.japaneseShape,
    })
  }))
}

const ROLE_SPLIT_CONNECTOR_JA = Object.freeze({
  and: 'そして',
  as: '〜として（内容は次へ）',
  because: 'なぜなら',
  but: 'しかし',
  if: 'もし',
  nor: 'また〜でもなく',
  or: 'または',
  so: 'そのため',
  that: '〜という内容で（中身は次へ）',
  than: '〜よりも',
  there: '存在を示します（何があるかは次へ）',
  when: '〜するとき',
  while: '〜する間に',
  yet: 'しかし',
})

const ROLE_SPLIT_MODIFIER_JA = Object.freeze({
  also: 'さらに',
  above: '上層では',
  automatically: '自動的に',
  better: 'よりうまく',
  even: '〜でさえ（対象は次へ）',
  first: '最初に',
  'more loudly': 'より大きな声で',
  'most often': '最もよく',
  'most successfully': '最もうまく',
  'no longer': 'もはや',
  now: '今では',
  often: 'しばしば',
  only: '〜だけ（対象は次へ）',
  otherwise: 'そうでなければ',
  more: 'もっと',
  'more than': '〜以上に',
  regularly: '定期的に',
  recently: '最近',
  simply: '単に',
  soon: 'すぐに',
  still: 'それでも',
  sometimes: 'ときに',
  then: 'そのあと',
  therefore: 'したがって',
  well: 'うまく',
})

const BOUND_PREPOSITION_PARTS = new Set([
  'about', 'by', 'from', 'in', 'on', 'over', 'through', 'to',
])

const PHRASAL_VERB_PARTICLES = new Set(['away', 'down', 'out', 'up'])

const BE_TO_COMPLEMENT_PAIRS = new Set([
  'is|to teach',
  'is|to treat',
  'need not be|to stop',
  'should be|to preserve',
  'should not be|to force',
])

const REVIEWED_COMBINED_VERB_JA = Object.freeze({
  'do not have to pay': '支払う必要はありません',
  'does not make': '〜にするわけではありません（対象は次へ）',
  'had to choose': '選ばなければなりませんでした',
  'might be left out': '取り残されるかもしれません',
  'should simply be': '単に〜であるべきです（状態は次へ）',
  'should therefore be': 'したがって〜であるべきです（状態は次へ）',
})

const REVIEWED_PREPOSITION_JA = Object.freeze({
  "about the month's topic": 'その月のテーマについて',
  'about definitions': '定義について',
  'about public behavior': '公共の場での人々の行動について',
  'about what': '何についてかというと',
  'about which': 'どれについてかというと',
  'about who': '誰についてかというと',
  'by what': 'あるものによって',
  'from being': '〜であることから',
  'from foreign visitors': '外国人来館者から',
  'from losing': '失うのを',
  'from what': 'あるものから',
  'in which': 'その中で',
  'on whether': '〜かどうかについて',
  'over how': 'どのようにするかをめぐって',
  'through which': 'それを通して',
  'to overlook': '見落とすことが',
})

function roleSplitGloss(en, sentenceGloss) {
  return roughJapanese(en, sentenceGloss)
    .replace(/、+/g, '・')
    .replace(/^このまとまりの意味を自然な和訳で確認$/, '')
    .trim()
}

function withJapaneseRoleParticle(value, role) {
  const base = value || 'この内容'
  if (role === 'S') return /[はがも]$/.test(base) ? base : `${base}が`
  if (role === 'O' || role === 'O2') return /[をがにとしか]$/.test(base) ? base : `${base}を`
  if (role === 'O1') return /[には]$/.test(base) ? base : `${base}に`
  return base
}

function connectorForwardJapanese(en) {
  const key = words(en).map(normalizeToken).join(' ')
  return ROLE_SPLIT_CONNECTOR_JA[key] ?? ROLE_SPLIT_CONNECTOR_JA[key.split(' ')[0]] ?? 'そして次へ'
}

function modifierForwardJapanese(en, sentenceGloss) {
  const key = words(en).map(normalizeToken).join(' ')
  return ROLE_SPLIT_MODIFIER_JA[key] ?? (roleSplitGloss(en, sentenceGloss) || '前の内容を詳しく')
}

function verbForwardJapanese(en, sentenceGloss) {
  const key = words(en).map(normalizeToken).join(' ')
  if (REVIEWED_COMBINED_VERB_JA[key]) return REVIEWED_COMBINED_VERB_JA[key]
  if (/^(?:am|are|is)$/.test(key)) return '〜です（状態・内容は次へ）'
  if (/^(?:was|were)$/.test(key)) return '〜でした（状態・内容は次へ）'
  if (/^(?:am|are|is) not always$/.test(key)) return '必ずしも〜ではありません（状態は次へ）'
  if (/^(?:am|are|is) not merely$/.test(key)) return '単なる〜ではありません（内容は次へ）'
  if (/^(?:am|are|is) not$/.test(key)) return '〜ではありません（状態は次へ）'
  if (/^(?:am|are|is) (?:also|especially|often|still|now|equally)$/.test(key)) {
    return `${modifierForwardJapanese(key.split(' ').slice(1).join(' '), sentenceGloss)}〜です（状態は次へ）`
  }
  if (/^(?:may|might) be$/.test(key)) return '〜かもしれません（状態は次へ）'
  if (/^(?:may|might) be (?:also|especially|often|sometimes)$/.test(key)) {
    return '〜かもしれません（状態は次へ）'
  }
  if (/^(?:can|could) be$/.test(key)) return '〜になりえます（状態は次へ）'
  if (/^(?:will|would) be$/.test(key)) return '〜でしょう（状態は次へ）'
  if (/^(?:must|should) be$/.test(key)) return '〜であるべきです（状態は次へ）'
  if (/^(?:has|have|had) become$/.test(key)) return '〜になっています（状態は次へ）'
  if (/^(?:may|might) (?:look|remain|seem|sound)$/.test(key)) return '〜かもしれません（状態は次へ）'
  if (/^(?:may|might) (?:appear|travel)$/.test(key)) return '〜かもしれません（動作・状態は次へ）'
  if (/^(?:may|might) sometimes appear$/.test(key)) return '〜に見えることがあります（状態は次へ）'
  if (/^(?:can|could) appear$/.test(key)) return '〜に見えることがあります（状態は次へ）'
  if (/^(?:can|could) remain$/.test(key)) return '〜のままでいられます（状態は次へ）'
  if (/^(?:will|would) (?:otherwise )?remain$/.test(key)) return '〜のままでしょう（状態は次へ）'
  if (/^(?:will|would) probably be$/.test(key)) return 'おそらく〜でしょう（内容は次へ）'
  if (/^(?:am|are|is) (?:actually|necessarily|rarely)$/.test(key)) return '〜です（判断内容は次へ）'
  if (/^(?:do|does|did) not \w+$/.test(key)) return '〜しません（動作内容は次へ）'
  if (/^(?:must|should|will|would) (?:remain|seem)$/.test(key)) return '〜の状態になります（内容は次へ）'
  if (/^(?:to )?be$/.test(key)) return '〜である（状態は次へ）'
  if (/\bbecome(?:s)?$/.test(key)) return '〜になります（状態は次へ）'
  if (/\bfeel$/.test(key)) return '〜と感じます（状態は次へ）'
  return roleSplitGloss(en, sentenceGloss) || '動作をします'
}

function fallbackRoleJapanese(part, sentenceGloss) {
  const key = words(part.en).map(normalizeToken).join(' ')
  const exact = {
    'M|more than': '〜以上に',
    'V|can read': '読書を続けられる',
    'V|does': '〜します（内容は次へ）',
    'V|may sometimes appear': '〜に見えることがあります（状態は次へ）',
    'V|to do': 'すべきか',
    'V|to open': '開けるかを',
    'V|to prevent': '防ぐかを',
  }[`${part.role}|${key}`]
  if (exact) return exact
  if (part.role === 'LINK') return connectorForwardJapanese(part.en)
  if (part.role === 'M') return modifierForwardJapanese(part.en, sentenceGloss)
  if (part.role === 'V') return verbForwardJapanese(part.en, sentenceGloss)
  if (part.role === 'O' && key === 'it') return 'それを'
  if (part.role === 'S' && key === 'there') {
    return '存在するものは後ろに'
  }
  if (part.role === 'S' && ['that', 'who', 'which'].includes(key)) {
    return 'そしてそのものが'
  }
  return withJapaneseRoleParticle(roleSplitGloss(part.en, sentenceGloss), part.role)
}

function complementForwardJapanese(en, sourceJa, verbEn, sentenceGloss) {
  const key = words(en).map(normalizeToken).join(' ')
  const exact = {
    'a complete solution': '完全な解決策',
    'almost invisible': 'ほとんど目立たない状態',
    available: '利用可能な状態',
    'clear as well': 'やはり明らか',
    'more comfortable': 'より慣れている状態',
    'more complicated': 'さらに複雑な状態',
    'more confident': 'より自信のある状態',
    'more open': 'より開かれた状態',
    'more urgent': 'さらに差し迫った状態',
    'more useful': 'より役立つもの',
    'more willing': 'もっと進んで行う姿勢',
    proud: '誇らしい状態',
    open: '開かれている状態',
    'less likely': '起こりにくい状態',
    'most valuable': '最も価値のあるもの',
    'most vulnerable': '最も弱い立場',
    relevant: '関連があるもの',
    'the same': '同じもの',
    'the problem': '問題',
    'the technology': 'その技術',
    'too large': '大きすぎる状態',
    'too narrow': '狭すぎる状態',
    'true or false': '正しいか誤りか',
    'visible and contestable': '見える形で異議を申し立てられる状態',
    waste: 'ごみ',
    'a substitute': '代わりとなるもの',
  }[key]
  if (exact) return exact

  let cleaned = stripModifierJapanese(sourceJa, words(verbEn).slice(1).join(' '))
    .replace(/(?:からです|だからです|のです|ものです)$/, '')
    .replace(/(?:かもしれません|かもしれない|に違いありません)$/, '')
    .replace(/(?:ではありません|ではない)$/, '')
    .replace(/(?:になれば|になります|になりました|になっている)$/, '')
    .replace(/(?:なら|のか|という)$/, '')
    .replace(/(?:だろうと|でしょう|でした|です)$/, '')
    .replace(/(?:に感じられます|と感じます)$/, '')
    .replace(/があります$/, 'がある')
    .trim()
  if (cleaned.length >= 2 && cleaned !== sourceJa) return cleaned
  return fallbackRoleJapanese({ role: 'C', en }, sentenceGloss)
}

function prepositionPhraseJapanese(en, right, sentenceGloss) {
  const key = words(en).map(normalizeToken).join(' ')
  if (REVIEWED_PREPOSITION_JA[key]) return REVIEWED_PREPOSITION_JA[key]
  if (key.startsWith('about which ')) return 'どれについてかというと'
  if (key.startsWith('about what ')) return '何についてかというと'
  const preposition = key.split(' ')[0]
  const targetEn = words(en).slice(1).join(' ')
  const target = roleSplitGloss(targetEn, sentenceGloss) || right.ja
  const endings = {
    about: 'について',
    by: 'によって',
    from: 'から',
    in: 'の中で',
    on: 'について',
    over: 'をめぐって',
    through: 'を通して',
  }
  if (preposition === 'to' && right.role === 'V') {
    return `${right.ja.replace(/[（(].*?[）)]/g, '').replace(/こと[がを]?$/, '')}こと`
  }
  return `${target.replace(/[はがをにと]$/, '')}${endings[preposition] ?? ''}`
}

function stripConnectorJapanese(ja, en) {
  const key = normalizeToken(words(en)[0] ?? '')
  const patterns = {
    and: /^(?:そして|さらに|また)[、，]?/,
    but: /^(?:しかし|しかしながら|だが|そうではなく)[、，]?/,
    or: /^(?:または|あるいは|また)[、，]?/,
    so: /^(?:そのため|そこで)[、，]?/,
    yet: /^(?:しかし|それでも)[、，]?/,
  }
  return (patterns[key] ? ja.replace(patterns[key], '') : ja).trim()
}

function stripModifierJapanese(ja, en) {
  const key = words(en).map(normalizeToken).join(' ')
  const patterns = {
    also: /^(?:さらに|また|やはり)/,
    above: /^(?:上位で|上層では)/,
    automatically: /^(?:自動的に)/,
    better: /^(?:よりうまく)/,
    first: /^(?:最初に)/,
    'more loudly': /^(?:より大きな声で)/,
    'most often': /^(?:最もよく)/,
    'most successfully': /^(?:最もうまく)/,
    'no longer': /^(?:もはや)/,
    now: /^(?:今では|今)/,
    often: /^(?:しばしば)/,
    otherwise: /^(?:そうでなければ)/,
    more: /^(?:もっと)/,
    regularly: /^(?:定期的に|繰り返し)/,
    recently: /^(?:最近)/,
    simply: /^(?:単に|ただ)/,
    soon: /^(?:すぐに)/,
    still: /^(?:それでも|なお)/,
    sometimes: /^(?:ときに|ときどき)/,
    then: /^(?:そのあと|その後|そのとき)/,
    therefore: /^(?:したがって|そのため)/,
    well: /^(?:うまく)/,
  }
  return (patterns[key] ? ja.replace(patterns[key], '') : ja).trim()
}

function englishSurfacesForRoleParts(en, roleParts) {
  const matches = [...en.matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)]
  let wordCursor = 0
  return roleParts.map((part, index) => {
    const partWordCount = words(part.en).length
    const start = matches[wordCursor]?.index ?? 0
    wordCursor += partWordCount
    const end = index === roleParts.length - 1
      ? en.length
      : matches[wordCursor]?.index ?? en.length
    return en.slice(start, end).trim()
  })
}

function reviewedAtomicRoleParts(pair) {
  const lower = words(pair.en).map(normalizeToken).join(' ')
  const parts = pair.roleParts.map((part) => ({ role: part.role, en: part.en }))
  if (lower === 'there is') {
    return [
      { role: 'LINK', en: parts[0].en },
      { role: 'V', en: parts[1].en },
    ]
  }
  if (lower === 'less by') {
    return [
      { role: 'M', en: 'less' },
      { role: 'LINK', en: 'by' },
    ]
  }
  if (lower === 'than by') {
    return [
      { role: 'LINK', en: 'than' },
      { role: 'M', en: 'by' },
    ]
  }
  if (/^as\s+/.test(lower) && parts[0].role === 'LINK' && parts.at(-1)?.role === 'C') {
    return [{ role: 'C', en: pair.en }]
  }
  if (lower === 'what to do') {
    return [
      { role: 'O', en: 'what' },
      { role: 'V', en: 'to do' },
    ]
  }
  if (lower === 'and still fail to influence') {
    return [
      { role: 'LINK', en: 'and' },
      { role: 'M', en: 'still' },
      { role: 'V', en: 'fail to influence' },
    ]
  }
  if (lower === 'automatically guarantee') {
    return [
      { role: 'M', en: 'automatically' },
      { role: 'V', en: 'guarantee' },
    ]
  }
  if (lower === 'take part') return [{ role: 'V', en: pair.en }]
  if (lower === 'and take part') {
    return [
      { role: 'LINK', en: 'and' },
      { role: 'V', en: 'take part' },
    ]
  }
  if (lower === 'or trust in institutions') {
    return [
      { role: 'LINK', en: 'or' },
      { role: 'M', en: 'trust in institutions' },
    ]
  }
  if (lower === 'is available') return [{ role: 'V', en: pair.en }]
  if (lower === 'remove') return [{ role: 'V', en: pair.en }]
  if (parts.length < 2) return parts

  if (/^(?:what|which|whose)\s+/.test(lower) && parts[0].role === 'LINK' && parts[1]?.role === 'S') {
    return [{ role: 'S', en: pair.en }]
  }
  if (/^how\s+/.test(lower) && parts[0].role === 'LINK') {
    return [{ role: 'M', en: parts[0].en }, ...parts.slice(1)]
  }
  if (/^(?:than|rather than|not only|but also|while|when)\b/.test(lower) && parts[0].role === 'LINK') {
    return [{ role: 'M', en: pair.en }]
  }
  if (/^as\b/.test(lower) && parts[0].role === 'LINK' && parts[1]?.role === 'M') {
    return [{ role: 'M', en: pair.en }]
  }
  if (/^(?:or\s+)?during\b/.test(lower)) {
    if (/^or\b/.test(lower)) {
      return [
        { role: 'LINK', en: words(pair.en)[0] },
        { role: 'M', en: pair.en.replace(/^or\s+/i, '') },
      ]
    }
    return [{ role: 'M', en: pair.en }]
  }
  if (/^that\s+\w+ing\b/.test(lower) && parts[0].role === 'S') {
    return [
      { role: 'LINK', en: words(pair.en)[0] },
      { role: 'S', en: pair.en.replace(/^that\s+/i, '') },
    ]
  }
  if (/^(?:and|or)\s+(?:continuing|competing)\s+/i.test(pair.en)) {
    return [
      { role: 'LINK', en: words(pair.en)[0] },
      { role: 'O', en: pair.en.replace(/^(?:and|or)\s+/i, '') },
    ]
  }
  return parts
}

function splitJapaneseForRoleParts(pair, roleParts, sentenceGloss) {
  if (roleParts.length === 1) return [pair.ja]
  const signature = roleParts.map((part) => part.role).join('+')
  const sourceJa = pair.ja.trim()

  if (roleParts[0].role === 'LINK') {
    const remainder = stripConnectorJapanese(sourceJa, roleParts[0].en) || sourceJa
    const connectorKey = words(roleParts[0].en).map(normalizeToken).join(' ')
    const linkJa = connectorKey === 'that'
      ? pair.scope?.startsWith('M節内')
        ? roleParts[1]?.role === 'S'
          ? 'そしてそのものを（説明する主語は次へ）'
          : 'そしてそのものが（説明は次へ）'
        : pair.scope?.startsWith('S節内')
          ? '〜ということが（内容は次へ）'
          : '〜ということを（内容は次へ）'
      : connectorForwardJapanese(roleParts[0].en)
    return [
      linkJa,
      ...splitJapaneseForRoleParts(
        { ...pair, ja: remainder },
        roleParts.slice(1),
        sentenceGloss,
      ),
    ]
  }

  if (signature === 'S+V') {
    const match = sourceJa.match(/^(.+?[はがも])(.+)$/)
    return match
      ? [match[1], match[2]]
      : [fallbackRoleJapanese(roleParts[0], sentenceGloss), sourceJa]
  }
  if (signature === 'V+S') {
    const auxiliary = words(roleParts[0].en).map(normalizeToken).join(' ')
    const auxiliaryJa = auxiliary === 'should'
      ? '〜すべきでしょうか（主語と本動詞は次へ）'
      : '〜するのでしょうか（主語と本動詞は次へ）'
    return [auxiliaryJa, sourceJa]
  }
  if (signature === 'M+V') {
    const remainder = stripModifierJapanese(sourceJa, roleParts[0].en)
    return [
      modifierForwardJapanese(roleParts[0].en, sentenceGloss),
      remainder && remainder !== sourceJa
        ? remainder
        : fallbackRoleJapanese(roleParts[1], sentenceGloss),
    ]
  }
  if (signature === 'V+C') {
    return [
      verbForwardJapanese(roleParts[0].en, sentenceGloss),
      complementForwardJapanese(
        roleParts[1].en,
        sourceJa,
        roleParts[0].en,
        sentenceGloss,
      ),
    ]
  }
  if (signature === 'V+O' || signature === 'V+O1' || signature === 'V+O2') {
    const match = sourceJa.match(/^(.+(?:を|が|に|と|しか))(.+)$/)
    return match
      ? [match[2], match[1]]
      : roleParts.map((part) => fallbackRoleJapanese(part, sentenceGloss))
  }
  if (signature === 'V+M') {
    const modifierJa = modifierForwardJapanese(roleParts[1].en, sentenceGloss)
    const verbJa = stripModifierJapanese(sourceJa, roleParts[1].en)
    return [
      verbJa && verbJa !== sourceJa
        ? verbJa
        : fallbackRoleJapanese(roleParts[0], sentenceGloss),
      modifierJa,
    ]
  }
  if (signature === 'M+S') {
    const subject = sourceJa
      .replace(/(?:だけ|でさえ|さえ)(?=[はがも]?$)/, '')
      .replace(/[はがも]?$/, '')
    return [
      modifierForwardJapanese(roleParts[0].en, sentenceGloss),
      withJapaneseRoleParticle(subject, 'S'),
    ]
  }
  if (signature === 'S+M') {
    const match = sourceJa.match(/^(.+?[はがも])(.+)$/)
    return match
      ? [match[1], match[2]]
      : roleParts.map((part) => fallbackRoleJapanese(part, sentenceGloss))
  }
  if (signature === 'V+O+C') {
    const match = sourceJa.match(/^(.+?を)(.+?)(?:だと|に)(.+)$/)
    return match
      ? [match[3], match[1], match[2]]
      : roleParts.map((part) => fallbackRoleJapanese(part, sentenceGloss))
  }

  return roleParts.map((part) => fallbackRoleJapanese(part, sentenceGloss))
}

function singleRolePhrasePair({ en, ja, role, sourceJa, sourceIndex, scope }) {
  const meta = translationRoleMeta(role)
  const roleParts = Object.freeze([Object.freeze({
    role,
    en,
    code: meta.code,
    label: meta.label,
    question: meta.question,
    japaneseShape: meta.japaneseShape,
  })])
  // it / that / once などは、語形だけでは文法機能を決められません。
  // 形式目的語などの項目固有の説明は、文を読んだ訂正台帳側で付けます。
  const roleNote = translationRoleExplanation([role], ja, scope)
  return Object.freeze({
    en,
    ja,
    role,
    roles: Object.freeze([role]),
    roleParts,
    scope,
    sourceJa,
    sourceIndex,
    roleHeading: translationRoleHeading([role], scope),
    roleNote,
  })
}

function expandRolePhrasePair(pair, sourceIndex, sentenceGloss) {
  const roleParts = reviewedAtomicRoleParts(pair)
  if (roleParts.length === 1) {
    const role = roleParts[0].role
    const key = `${role}|${words(pair.en).map(normalizeToken).join(' ')}`
    const reviewedJa = {
      'LINK|nor': 'また〜でもありません',
      'M|less': 'より少なく（比較は続く）',
      'M|from losing': '失うのを',
      'O|it': 'それを',
      'O|societies': '社会を',
      'O|visitors': '来館者を',
      'V|is available': '利用可能な（あるものによって）',
      'V|is repeatedly presented': '繰り返し提示される（あるものによって）',
      'V|knew': '知っていた（あるものから）',
      'V|remove': '取り除くことを',
      'V|to do': 'すべきか',
      'V|to learn': '学ぶという（能力）',
      'V|to prevent': '防ぐかを',
      'V|water': '水をやることを',
    }[key]
    return [singleRolePhrasePair({
      en: pair.en,
      ja: reviewedJa ?? pair.ja,
      role,
      sourceJa: pair.ja,
      sourceIndex,
      scope: pair.scope,
    })]
  }
  const surfaces = englishSurfacesForRoleParts(pair.en, roleParts)
  const japanese = splitJapaneseForRoleParts(pair, roleParts, sentenceGloss)
  return roleParts.map((part, index) => singleRolePhrasePair({
    en: surfaces[index] || part.en,
    ja: japanese[index] || fallbackRoleJapanese(part, sentenceGloss),
    role: part.role,
    sourceJa: pair.ja,
    sourceIndex,
    scope: pair.scope,
  }))
}

function mergeRolePhrasePair(left, right, role, ja, sentenceGloss) {
  const en = `${left.en} ${right.en}`.replace(/\s+/g, ' ').trim()
  return singleRolePhrasePair({
    en,
    ja: ja || fallbackRoleJapanese({ role, en }, sentenceGloss),
    role,
    sourceJa: left.sourceJa === right.sourceJa
      ? left.sourceJa
      : `${left.sourceJa} → ${right.sourceJa}`,
    sourceIndex: left.sourceIndex,
    scope: left.scope || right.scope,
  })
}

function mergeReviewedRolePhrasePairs(pairs, sentenceGloss) {
  const sameRoleMerged = []
  for (const pair of pairs) {
    const previous = sameRoleMerged.at(-1)
    const limit = pair.role === 'M' || pair.role === 'LINK'
      ? READING_MODIFIER_PHRASE_WORD_LIMIT
      : READING_CORE_PHRASE_WORD_LIMIT
    if (
      previous &&
      previous.sourceIndex === pair.sourceIndex &&
      previous.role === pair.role &&
      words(`${previous.en} ${pair.en}`).length <= limit
    ) {
      sameRoleMerged[sameRoleMerged.length - 1] = mergeRolePhrasePair(
        previous,
        pair,
        pair.role,
        previous.sourceJa,
        sentenceGloss,
      )
    } else {
      sameRoleMerged.push(pair)
    }
  }

  const prepositionsMerged = []
  for (let index = 0; index < sameRoleMerged.length; index++) {
    const pair = sameRoleMerged[index]
    const next = sameRoleMerged[index + 1]
    const key = words(pair.en).map(normalizeToken).join(' ')
    if (next && BOUND_PREPOSITION_PARTS.has(key)) {
      const infinitive = key === 'to' && next.role === 'V'
      prepositionsMerged.push(mergeRolePhrasePair(
        pair,
        next,
        infinitive ? 'V' : 'M',
        prepositionPhraseJapanese(`${pair.en} ${next.en}`, next, sentenceGloss),
        sentenceGloss,
      ))
      index++
      continue
    }
    const previous = prepositionsMerged.at(-1)
    if (
      previous?.role === 'V' &&
      pair.role === 'M' &&
      PHRASAL_VERB_PARTICLES.has(key) &&
      words(`${previous.en} ${pair.en}`).length <= READING_CORE_PHRASE_WORD_LIMIT
    ) {
      prepositionsMerged[prepositionsMerged.length - 1] = mergeRolePhrasePair(
        previous,
        pair,
        'V',
        previous.sourceJa === pair.sourceJa ? previous.sourceJa : `${previous.ja}${pair.ja}`,
        sentenceGloss,
      )
      continue
    }
    prepositionsMerged.push(pair)
  }

  const verbGroupsMerged = []
  for (let index = 0; index < prepositionsMerged.length; index++) {
    const pair = prepositionsMerged[index]
    const next = prepositionsMerged[index + 1]
    const pairKey = words(pair.en).map(normalizeToken).join(' ')
    const nextKey = words(next?.en ?? '').map(normalizeToken).join(' ')
    if (next && BE_TO_COMPLEMENT_PAIRS.has(`${pairKey}|${nextKey}`)) {
      verbGroupsMerged.push(pair)
      verbGroupsMerged.push(singleRolePhrasePair({
        ...next,
        role: 'C',
        ja: next.ja,
      }))
      index++
      continue
    }
    const incompleteVerb =
      /(?:\bto|\bnot|\bdo|\bdoes|\bdid|\bhad|\bmight|\bshould|\bwill|\bwould|\bcan|\bcould|\bmay|\bmust)$/.test(pairKey) ||
      /(?:have to|might be|should simply|should therefore)$/.test(pairKey)
    if (
      next &&
      pair.role === 'V' &&
      next.role === 'V' &&
      incompleteVerb &&
      words(`${pair.en} ${next.en}`).length <= READING_CORE_PHRASE_WORD_LIMIT
    ) {
      const combinedKey = `${pairKey} ${nextKey}`
      verbGroupsMerged.push(mergeRolePhrasePair(
        pair,
        next,
        'V',
        REVIEWED_COMBINED_VERB_JA[combinedKey],
        sentenceGloss,
      ))
      index++
      continue
    }
    verbGroupsMerged.push(pair)
  }
  return Object.freeze(verbGroupsMerged)
}

function buildPhrasePairs(
  en,
  jaSegments,
  sentenceGloss,
  manualEnSegments,
  { kind = 'core', blockRole = null, svoc = null } = {},
) {
  const enSegments = Array.isArray(manualEnSegments)
    ? manualEnSegments
    : alignEnglishPhrases(en, jaSegments, sentenceGloss)
  const spans = phraseRoleSpans(en, svoc?.parts)
  const scope = phraseScope(kind, blockRole)
  let tokenCursor = 0
  let previousRoleParts = null
  const sourcePairs = enSegments.map((english, index) => {
    const ja = jaSegments[index] ?? jaSegments.at(-1) ?? ''
    const englishTokens = words(english).map(normalizeToken)
    const start = tokenCursor
    const end = start + englishTokens.length
    tokenCursor = end
    const connector = STRUCTURAL_CONNECTORS.has(englishTokens.join(' '))
    const spanRoles = [...new Set(spans
      .filter((span) => span.start < end && span.end > start)
      .map((span) => span.role))]
    const explicitParts = explicitPhraseRoleParts(
      english,
      ja,
      kind,
      blockRole,
      spanRoles,
      start,
      enSegments[index - 1],
      enSegments[index + 1],
      jaSegments[index - 1],
      jaSegments[index + 1],
      previousRoleParts,
    )
    let roles = explicitParts
      ? explicitParts.map((part) => part.role)
      : connector
        ? ['LINK']
        : spanRoles
    const particleRole = explicitParts ? null : japaneseParticleRole(
      ja,
      english,
      kind,
      blockRole,
      roles,
    )
    if (particleRole && !connector) roles = [particleRole]
    if (!roles.length) roles = [kind === 'phrase' ? blockRole ?? 'M' : blockRole ?? 'M']
    const roleParts = phraseRoleParts(
      englishTokens,
      start,
      end,
      spans,
      roles,
      connector,
      explicitParts,
    )
    previousRoleParts = roleParts
    return Object.freeze({
      en: english,
      ja,
      role: roles[0],
      roles: Object.freeze(roles),
      roleParts,
      scope,
      roleHeading: translationRoleHeading(roles, scope),
      roleNote: translationRoleExplanation(roles, ja, scope),
    })
  })
  const atomicPairs = sourcePairs.flatMap((pair, index) =>
    expandRolePhrasePair(pair, index, sentenceGloss))
  return mergeReviewedRolePhrasePairs(atomicPairs, sentenceGloss)
}

function roughJapanese(text, sentenceGloss) {
  const translated = words(text)
    .map((word) => shortGloss(word, sentenceGloss))
    .filter(Boolean)
  return translated.length ? translated.join('、') : 'このまとまりの意味を自然な和訳で確認'
}

function alignmentScore(unit, jaPart, sentenceGloss) {
  const seen = new Set()
  let score = words(unit.text).reduce((total, word) => {
    for (const term of glossTerms(word, sentenceGloss)) {
      if (seen.has(term) || !jaPart.includes(term)) continue
      seen.add(term)
      total += Math.min(term.length, 5)
    }
    return total
  }, 0)
  const marker = firstWord(unit.text)
  if (
    score > 0 &&
    (CLAUSE_MARKERS[marker] || RELATIVE_MARKERS.has(marker) || NOUN_CLAUSE_MARKERS.has(marker))
  ) {
    score += 10
  }
  return score
}

function alignJapanese(units, sentence) {
  const jaParts = splitJapanese(sentence.ja)
  if (units.length === 1) {
    return [{ text: sentence.ja.replace(/[。！？]+$/, ''), source: 'natural' }]
  }

  if (jaParts.length > 1) {
    const aligned = Array(units.length).fill('')
    const usedUnits = new Set()
    const usedParts = new Set()
    const candidates = []

    for (const [unitIndex, unit] of units.entries()) {
      for (const [partIndex, jaPart] of jaParts.entries()) {
        const score = alignmentScore(unit, jaPart, sentence.gloss)
        if (score > 0) candidates.push({ unitIndex, partIndex, score })
      }
    }

    candidates
      .sort((a, b) => b.score - a.score)
      .forEach(({ unitIndex, partIndex }) => {
        if (usedUnits.has(unitIndex) || usedParts.has(partIndex)) return
        aligned[unitIndex] = jaParts[partIndex]
        usedUnits.add(unitIndex)
        usedParts.add(partIndex)
      })

    const remainingUnits = units
      .map((_, index) => index)
      .filter((index) => !usedUnits.has(index))
    const remainingParts = jaParts
      .map((_, index) => index)
      .filter((index) => !usedParts.has(index))
    if (remainingUnits.length === remainingParts.length) {
      remainingUnits.forEach((unitIndex, index) => {
        aligned[unitIndex] = jaParts[remainingParts[index]]
      })
    }

    return units.map((unit, index) => ({
      text: aligned[index] || roughJapanese(unit.text, sentence.gloss),
      source: aligned[index] ? 'natural' : 'gloss',
    }))
  }
  return units.map((unit) => ({
    text: roughJapanese(unit.text, sentence.gloss),
    source: 'gloss',
  }))
}

function markCommaBoundaries(sentence) {
  let text = sentence

  const discourseIntro = [
    ...DISCOURSE_PHRASES,
    'rather than',
  ]
    .sort((a, b) => b.length - a.length)
    .map((item) => item.replace(/\s+/g, '\\s+'))
    .join('|')

  text = text.replace(
    new RegExp(`^((?:${discourseIntro})\\b[^,]{0,90}),\\s+`, 'i'),
    '$1,\u241f',
  )
  const lower = text.toLowerCase()
  const leadingClause = ['even though', 'even when', ...Object.keys(CLAUSE_MARKERS)]
    .sort((a, b) => b.length - a.length)
    .find((marker) => lower.startsWith(`${marker} `))
  if (leadingClause && !text.includes('\u241f')) {
    for (const match of text.matchAll(/,\s+/g)) {
      const prefix = text.slice(0, match.index)
      if (!hasLeadingClauseVerb(prefix, leadingClause)) continue
      text = `${text.slice(0, match.index + 1)}\u241f${text.slice(match.index + match[0].length)}`
      break
    }
  }
  text = text.replace(
    /^((?:about|across|after|among|at|before|between|by|during|for|from|in|on|through|under|with|without)\b[^,]{1,90}),\s+/i,
    '$1,\u241f',
  )
  text = text.replace(
    /,\s+(?=(?:but|yet|so|while|whereas|which|who|whose|when|if|although|though|because|however|therefore|thus|instead)\b)/gi,
    ',\u241f',
  )
  text = text.replace(/,\s+(and|or)\s+/gi, (match, coordinator, offset, source) => {
    const suffix = source.slice(offset + match.length)
    const prefix = source.slice(0, offset).split('\u241f').at(-1)
    const prefixFirst = firstWord(prefix)
    const prefixHasVerb = CLAUSE_MARKERS[prefixFirst]
      ? hasLeadingClauseVerb(prefix, prefixFirst)
      : hasClearFiniteVerb(prefix)
    return prefixHasVerb && hasFiniteVerb(suffix)
      ? `,\u241f${coordinator} `
      : match
  })
  text = text.replace(
    /,\s+((?:one of|a|an)\b[^,]{1,90}),\s+/gi,
    ',\u241f$1,\u241f',
  )
  text = text.replace(/;\s+/g, ';\u241f')
  return text
}

function splitInternalClause(text) {
  const body = bare(text)
  const lower = body.toLowerCase()
  const candidates = []

  const addAt = (index) => {
    if (index > 2 && index < body.length - 3 && !candidates.includes(index)) candidates.push(index)
  }

  if (/^(?:that|who|which|whose|where)\b/i.test(body)) {
    const tokenMatches = [...body.matchAll(/[A-Za-z][A-Za-z'’-]*/g)]
    const firstFinite = tokenMatches.findIndex((_, index) => index > 0 && isFiniteVerbAt(tokenMatches, index))
    const nextStrong = tokenMatches.findIndex(
      (_, index) => index > firstFinite + 1 && isStrongFiniteVerbAt(tokenMatches, index),
    )
    if (firstFinite >= 0 && nextStrong > firstFinite) addAt(tokenMatches[nextStrong].index)
  }

  for (const marker of [
    'even though', 'even when', 'because', 'although', 'unless', 'whereas',
    'while', 'when', 'if', 'since', 'before', 'after', 'once', 'as',
  ]) {
    const index = lower.indexOf(` ${marker} `)
    const prefix = index >= 0 ? lower.slice(0, index).trim() : ''
    if (
      index >= 0 &&
      !(marker === 'as' && prefix.endsWith('such')) &&
      !(['when', 'though'].includes(marker) && prefix.endsWith('even')) &&
      hasFiniteVerb(body.slice(index + 1))
    ) {
      addAt(index + 1)
    }
  }

  for (const marker of [' who ', ' which ', ' whose ', ' where ']) {
    const index = lower.indexOf(marker)
    if (index >= 0 && hasFiniteVerb(body.slice(index + 1))) addAt(index + 1)
  }

  const thatMatch = lower.match(
    /\b(?:admit|argue|assume|believe|claim|conclude|discover|explain|find|learn|mean|notice|predict|recognize|remember|report|say|show|suggest|think|understand)(?:s|ed)?\s+(that|what|whether|why|how)\b/,
  )
  if (thatMatch?.index != null) {
    const markerIndex = lower.indexOf(thatMatch[1], thatMatch.index)
    addAt(markerIndex)
  }

  for (const marker of [' that ', ' what ', ' whether ', ' why ', ' how ']) {
    const index = lower.indexOf(marker)
    if (
      index >= 0 &&
      hasFiniteVerb(body.slice(0, index)) &&
      hasFiniteVerb(body.slice(index + 1))
    ) {
      addAt(index + 1)
    }
  }

  if (!candidates.length) return [text]
  const splitAt = Math.min(...candidates)
  const punctuation = punctuationOf(text)
  return [
    clean(body.slice(0, splitAt)),
    `${clean(body.slice(splitAt))}${punctuation}`,
  ].filter(Boolean)
}

function findToInfinitiveSplit(text) {
  const body = bare(text)
  const matches = [...body.matchAll(/\bto\s+([A-Za-z][A-Za-z'’-]*)/gi)]
  for (const match of matches) {
    if (!match.index || match.index < 4) continue
    if (!isVerb(match[1])) continue
    const before = body.slice(0, match.index).trim()
    if (!hasFiniteVerb(before)) continue
    if (/\b(?:how|what|where|whether|which|who|why)\s*$/i.test(before)) continue
    if (['have', 'use', 'ought'].includes(lastVerbLemma(before))) continue
    const punctuation = punctuationOf(text)
    return [before, `${body.slice(match.index).trim()}${punctuation}`]
  }
  return [text]
}

function findTrailingPhraseSplit(text) {
  const body = bare(text)
  const tokenMatches = [...body.matchAll(/[A-Za-z][A-Za-z'’-]*/g)]
  if (tokenMatches.length < 5 || !hasFiniteVerb(body)) return [text]

  for (let index = tokenMatches.length - 2; index >= 2; index--) {
    const token = normalizeToken(tokenMatches[index][0])
    if (!PREPOSITIONS.has(token) || token === 'of' || token === 'to') continue
    const splitAt = tokenMatches[index].index
    const before = body.slice(0, splitAt).trim()
    const after = body.slice(splitAt).trim()
    if (words(after).length < 2 || !hasFiniteVerb(before)) continue
    const punctuation = punctuationOf(text)
    return [before, `${after}${punctuation}`]
  }
  return [text]
}

function splitGerundSubject(text) {
  const body = bare(text)
  const tokens = [...body.matchAll(/[A-Za-z][A-Za-z'’-]*/g)]
  if (!tokens[0] || !/ing$/i.test(tokens[0][0])) return [text]
  if (wordRecord(tokens[0][0])?.pos === '名') return [text]
  for (let index = 2; index < tokens.length; index++) {
    if (!isVerb(tokens[index][0]) || /ing$/i.test(tokens[index][0])) continue
    const splitAt = tokens[index].index
    const punctuation = punctuationOf(text)
    return [
      body.slice(0, splitAt).trim(),
      `${body.slice(splitAt).trim()}${punctuation}`,
    ]
  }
  return [text]
}

function splitEnglish(sentence) {
  const manual = sentence.chunks?.length > 1
    ? sentence.chunks.map((chunk, index) => ({
        text: `${chunk.en}${index === sentence.chunks.length - 1 ? punctuationOf(sentence.en) : ''}`,
        manualJa: chunk.ja,
      }))
    : null
  if (manual) return manual

  const commaParts = markCommaBoundaries(sentence.en)
    .split('\u241f')
    .map(clean)
    .filter(Boolean)

  let clauseParts = commaParts
  for (let depth = 0; depth < 3; depth++) {
    const next = clauseParts.flatMap(splitInternalClause)
    if (next.length === clauseParts.length) break
    clauseParts = next
  }
  const infinitiveParts = clauseParts.flatMap(findToInfinitiveSplit)
  const gerundParts = infinitiveParts.flatMap(splitGerundSubject)
  const phraseParts = gerundParts.flatMap(findTrailingPhraseSplit)
  return phraseParts.map((text) => ({ text }))
}

function classifyUnit(unit, index, allUnits) {
  const text = unit.text
  const body = bare(text)
  const lower = body.toLowerCase()
  const first = firstWord(body)
  const previous = allUnits[index - 1]?.text ?? ''
  const priorText = allUnits.slice(0, index).map((item) => item.text).join(' ')

  if (
    index > 0 &&
    first === 'as' &&
    /\b(?:call|consider|describe|regard|treat)(?:ed|s)?\b/i.test(priorText)
  ) {
    return {
      kind: 'phrase',
      label: '目的格補語となるas句',
      role: 'C',
      note: 'treatなどの動詞に続く as ... は、目的語Oを「〜として」と説明する目的格補語Cです。',
    }
  }

  const multiMarker = lower.startsWith('even though ')
    ? 'although'
    : lower.startsWith('even when ')
      ? 'when'
      : first

  if (CLAUSE_MARKERS[multiMarker] && hasFiniteVerb(body)) {
    return {
      kind: 'clause',
      ...CLAUSE_MARKERS[multiMarker],
    }
  }

  if (RELATIVE_MARKERS.has(first)) {
    return {
      kind: 'clause',
      label: '関係詞節',
      role: 'M',
      note: `${first} から始まる関係詞節です。直前の名詞を後ろから説明し、全体でMとして働きます。`,
    }
  }

  if (index > 0 && NOUN_CLAUSE_MARKERS.has(first)) {
    const previousVerb = lastVerbLemma(previous)
    const purposeClause = first === 'that' && /\bso\s*$/i.test(bare(previous))
    const complementClause =
      first === 'that' &&
      previousVerb === 'be' &&
      /\b(?:am|are|be|been|is|was|were)(?:\s+(?:also|not|only|probably|still))*$/i
        .test(bare(previous))
    const previousSkeleton = analyzeSvoc(previous)
    const secondObject =
      ['show', 'teach', 'tell'].includes(previousVerb) &&
      previousSkeleton.parts.some((part) => part.role === 'O1')
    const implicitRelative =
      first === 'that' &&
      !purposeClause &&
      !complementClause &&
      !REPORTING_VERBS.has(previousVerb)
    if (purposeClause) {
      return {
        kind: 'clause',
        label: '目的の副詞節',
        role: 'M',
        note: 'so that + S + V で「SがVするように」。主節の目的を示すMです。',
      }
    }
    if (complementClause) {
      return {
        kind: 'clause',
        label: '補語となる名詞節',
        role: 'C',
        note: 'be動詞の後ろに置かれたthat節です。主語の内容を説明する補語Cとして働きます。',
      }
    }
    if (secondObject) {
      return {
        kind: 'clause',
        label: '第4文型の直接目的語となる名詞節',
        role: 'O2',
        note: `${first} 以下の名詞節が「何を」に当たり、直前の人を表すO1と組んでO2として働きます。`,
      }
    }
    return implicitRelative
      ? {
          kind: 'clause',
          label: '関係詞節',
          role: 'M',
          note: 'that 以下が直前の名詞を説明する関係詞節です。節全体はMとして働きます。',
        }
      : {
          kind: 'clause',
          label: '名詞節',
          role: 'O',
          note: `${first} 以下がひとまとまりの名詞節となり、主に動詞の目的語Oとして働きます。`,
        }
  }

  if (index > 0 && COORDINATORS[first] && hasFiniteVerb(body)) {
    return {
      kind: 'clause',
      label: '等位節',
      role: '並列',
      note: COORDINATORS[first],
    }
  }

  const startsWithToInfinitive =
    first === 'to' &&
    isVerb(words(body)[1] ?? '')
  if (
    (
      DISCOURSE_PHRASES.some((phrase) => lower.startsWith(phrase)) &&
      !hasStrongFiniteVerb(body)
    ) ||
    (
      PREPOSITIONS.has(first) &&
      !startsWithToInfinitive &&
      !hasStrongFiniteVerb(body)
    )
  ) {
    const isInstead = lower.startsWith('instead of ')
    const previousVerb = lastVerbLemma(previous)
    const objectComplement =
      previousVerb === 'keep' &&
      first === 'in' &&
      analyzeSvoc(previous).parts.some((part) => /^O/.test(part.role))
    return {
      kind: 'phrase',
      label: objectComplement
        ? '目的格補語となる前置詞句'
        : isInstead
          ? '前置詞句（対案）'
          : '前置詞句',
      role: objectComplement ? 'C' : 'M',
      note: objectComplement
        ? 'keep + O + in ... で、Oが置かれる状態を説明します。この前置詞句は目的格補語Cです。'
        : isInstead
        ? 'instead of + 名詞・動名詞で「〜の代わりに」。主節の行動を修飾するMです。'
        : '前置詞 + 名詞のまとまりです。時・場所・方法・理由などを補うMとして働きます。',
    }
  }

  if (/^to\s+[A-Za-z]/i.test(body)) {
    const previousVerb = lastVerbLemma(previous)
    const previousSkeleton = analyzeSvoc(previous)
    const followsObject =
      previousSkeleton.parts.some((part) => /^O/.test(part.role))
    const objectComplement =
      ['allow', 'ask', 'encourage', 'expect', 'help', 'invite'].includes(previousVerb) &&
      (followsObject || words(previous).length >= 2)
    const passiveComplement =
      ['allow', 'ask', 'encourage', 'expect'].includes(previousVerb) &&
      /\b(?:am|are|is|was|were|be|been)\b/i.test(previous)
    const previousPassive =
      /\b(?:am|are|be|been|being|is|was|were)(?:\s+\w+ly)*\s+[A-Za-z]+ed$/i
        .test(bare(previous))
    const linkingComplement =
      LINKING_VERBS.has(previousVerb) &&
      !previousPassive &&
      !previousSkeleton.parts.some((part) => part.role === 'C')
    const role = objectComplement || passiveComplement || linkingComplement
      ? 'C'
      : [
          'allow', 'ask', 'begin', 'continue', 'decide', 'encourage', 'expect',
          'help', 'need', 'start', 'try', 'want',
        ]
          .includes(previousVerb)
        ? 'O'
        : 'M'
    return {
      kind: 'phrase',
      label: 'to不定詞句',
      role,
      note: role === 'C'
        ? 'to + 動詞原形の不定詞句です。受け身の主語が行う内容を補う補語Cとして働きます。'
        : role === 'O'
          ? 'to + 動詞原形の不定詞句です。この位置では動詞の内容・目的語Oを補います。'
          : 'to + 動詞原形の不定詞句です。この位置では目的・結果・名詞の説明を補うMです。',
    }
  }

  if (
    /^[A-Za-z'’-]+ing\b/i.test(body) &&
    wordRecord(firstWord(body))?.pos !== '名'
  ) {
    const role =
      allUnits.length > 1 &&
      (index === 0 || startsWithPredicate(allUnits[index + 1]?.text ?? ''))
        ? 'S'
        : 'M'
    return {
      kind: 'phrase',
      label: role === 'S' ? '動名詞句' : '分詞・動名詞句',
      role,
      note: role === 'S'
        ? '動詞の-ing形を中心とする名詞のまとまりで、文の主語Sとして働きます。'
        : '-ing形を中心とするまとまりで、動作・状況を補うMとして働きます。',
    }
  }

  if (
    allUnits.length > 1 &&
    !hasStrongFiniteVerb(body) &&
    (
      !hasFiniteVerb(body) ||
      (
        words(body).length === 2 &&
        /^(?:a|an|the)\b/i.test(body) &&
        /^(?:that|who|which|whose|where)\b/i.test(bare(allUnits[index + 1]?.text ?? ''))
      )
    ) &&
    (index === 0 || /^(?:that|who|which|whose|where)\b/i.test(bare(allUnits[index + 1]?.text ?? '')))
  ) {
    return {
      kind: 'phrase',
      label: '主語の名詞句',
      role: 'S',
      note: '主語の中心となる名詞のまとまりです。後ろの述語動詞Vと結び付けて読みます。',
    }
  }

  if (
    index > 0 &&
    !hasFiniteVerb(body) &&
    ['and', 'or'].includes(first) &&
    analyzeSvoc(previous).parts.some((part) => /^O/.test(part.role))
  ) {
    return {
      kind: 'phrase',
      label: '並列された目的語',
      role: 'O',
      note: `${first} が直前の目的語と同じ働きの名詞句を追加しています。文型上は同じOの続きです。`,
    }
  }

  if (
    index > 0 &&
    !hasFiniteVerb(body) &&
    LINKING_VERBS.has(lastVerbLemma(previous))
  ) {
    return {
      kind: 'phrase',
      label: '補語となる名詞句・形容詞句',
      role: 'C',
      note: 'be動詞・連結動詞の後ろで主語の身分・性質・状態を説明するまとまりです。文型上の補語Cとして働きます。',
    }
  }

  if (index > 0 && !hasFiniteVerb(body)) {
    return {
      kind: 'phrase',
      label: '文法的な句',
      role: 'M',
      note: '主語と述語を持たない語のまとまりです。直前の内容に情報を付け足すMです。',
    }
  }

  return {
    kind: 'core',
    label: '主節・文の骨格',
    role: null,
    note: '文の中心となる主節です。S（主語）とV（述語動詞）を先に押さえます。',
  }
}

function splitObjectAndModifier(remainder) {
  const matches = [...remainder.matchAll(/[A-Za-z][A-Za-z'’-]*/g)]
  for (let index = 1; index < matches.length - 1; index++) {
    const token = normalizeToken(matches[index][0])
    if (!PREPOSITIONS.has(token) || token === 'of' || token === 'to') continue
    return [
      remainder.slice(0, matches[index].index).trim(),
      remainder.slice(matches[index].index).trim(),
    ]
  }
  return [remainder, '']
}

function analyzeSvoc(text, { implicitSubject = false } = {}) {
  const body = bare(text)
  const tokens = [...body.matchAll(/[A-Za-z][A-Za-z'’-]*/g)]
  if (!tokens.length) return { parts: [], pattern: '', name: '' }

  const firstToken = normalizeToken(tokens[0][0])
  const hasMarker =
    CLAUSE_MARKERS[firstToken] ||
    RELATIVE_MARKERS.has(firstToken) ||
    NOUN_CLAUSE_MARKERS.has(firstToken) ||
    COORDINATORS[firstToken]
  const subjectTokenIndex = hasMarker ? 1 : 0
  const scanStart = implicitSubject ? 0 : Math.min(subjectTokenIndex + 1, tokens.length - 1)
  let verbIndex = -1
  const relativeIndex = tokens.findIndex((token, index) =>
    index > subjectTokenIndex && ['that', 'who', 'which', 'whose', 'where'].includes(normalizeToken(token[0])))
  if (relativeIndex > subjectTokenIndex) {
    const relativeVerbIndex = tokens.findIndex(
      (_, index) => index > relativeIndex && isFiniteVerbAt(tokens, index),
    )
    if (relativeVerbIndex >= 0) {
      verbIndex = tokens.findIndex(
        (_, index) =>
          index > relativeVerbIndex &&
          !(
            index === relativeVerbIndex + 1 &&
            AUXILIARIES.has(normalizeToken(tokens[relativeVerbIndex][0])) &&
            isVerb(tokens[index][0])
          ) &&
          isFiniteVerbAt(tokens, index),
      )
    }
  }
  if (verbIndex < 0) {
    for (let index = scanStart; index < tokens.length; index++) {
      if (isStrongFiniteVerbAt(tokens, index)) {
        verbIndex = index
        break
      }
    }
  }
  if (verbIndex < 0) {
    const candidates = tokens
      .map((_, index) => index)
      .filter((index) => index >= scanStart && isFiniteVerbAt(tokens, index))
    const afterAdverb = candidates.find((index) => {
      const previous = normalizeToken(tokens[index - 1]?.[0] ?? '')
      return MID_SENTENCE_ADVERBS.has(previous) || /ly$/.test(previous)
    })
    verbIndex = afterAdverb ?? candidates[0] ?? -1
  }
  if (verbIndex < 0) return { parts: [{ role: 'M', text: body }], pattern: 'M', name: '修飾語句' }

  const subjectStart = implicitSubject
    ? tokens[verbIndex].index
    : hasMarker
      ? tokens[subjectTokenIndex].index
      : 0
  const subjectEnd = tokens[verbIndex].index
  let subject = body.slice(subjectStart, subjectEnd).trim().replace(/^(?:and|but|yet|so)\s+/i, '')
  let preVerbModifier = ''
  if (!implicitSubject && subject) {
    const leadingAdverb = subject.match(
      /^(?:finally|however|more subtly|nevertheless|rather|similarly|therefore|thus|today),?\s+/i,
    )
    if (leadingAdverb) {
      preVerbModifier = leadingAdverb[0].trim().replace(/,$/, '')
      subject = subject.slice(leadingAdverb[0].length).trim()
    }
    const subjectTokens = [...subject.matchAll(/[A-Za-z][A-Za-z'’-]*/g)]
    const trailing = subjectTokens.at(-1)
    const trailingKey = normalizeToken(trailing?.[0] ?? '')
    if (
      subjectTokens.length > 1 &&
      (MID_SENTENCE_ADVERBS.has(trailingKey) || /ly$/.test(trailingKey))
    ) {
      preVerbModifier = [preVerbModifier, subject.slice(trailing.index).trim()]
        .filter(Boolean)
        .join(' / ')
      subject = subject.slice(0, trailing.index).trim()
    }
  }

  let verbEndIndex = verbIndex + 1
  let lexicalVerbCount = AUXILIARIES.has(normalizeToken(tokens[verbIndex][0])) ? 0 : 1
  while (verbEndIndex < tokens.length) {
    const token = normalizeToken(tokens[verbEndIndex][0])
    const groupKeys = tokens
      .slice(verbIndex, verbEndIndex)
      .map((item) => normalizeToken(item[0]))
    const hasAuxiliary = groupKeys.some((item) => AUXILIARIES.has(item))
    const lexicalLemma = [...groupKeys]
      .reverse()
      .map(lemmaOf)
      .find((item) => !['be', 'do'].includes(item) && !MID_SENTENCE_ADVERBS.has(item))
    const hasBe = groupKeys.some((item) =>
      ['am', 'are', 'be', 'been', 'being', 'is', 'was', 'were'].includes(item))
    const auxiliary = AUXILIARIES.has(token)
    const participleAfterBe = hasBe && isPastParticiple(token)
    const firstLexicalAfterAuxiliary =
      hasAuxiliary &&
      lexicalVerbCount === 0 &&
      (isVerb(token) || participleAfterBe)
    if (
      token === 'not' ||
      MID_SENTENCE_ADVERBS.has(token) ||
      /ly$/.test(token) ||
      auxiliary ||
      firstLexicalAfterAuxiliary ||
      (token === 'to' && ['have', 'use', 'ought'].includes(lexicalLemma)) ||
      (
        normalizeToken(tokens[verbEndIndex - 1]?.[0] ?? '') === 'to' &&
        ['have', 'use', 'ought'].includes(lexicalLemma) &&
        isVerb(token)
      )
    ) {
      if (firstLexicalAfterAuxiliary && !auxiliary) lexicalVerbCount++
      verbEndIndex++
    }
    else break
  }
  const verbStart = tokens[verbIndex].index
  const verbEnd = verbEndIndex < tokens.length ? tokens[verbEndIndex].index : body.length
  const verbText = body.slice(verbStart, verbEnd).trim()
  const remainder = body.slice(verbEnd).trim()
  const firstVerb = lemmaOf(tokens[verbIndex][0])
  const verbTokens = tokens.slice(verbIndex, verbEndIndex)
  const lexicalVerb = [...verbTokens]
    .reverse()
    .find((token) => !AUXILIARIES.has(normalizeToken(token[0])) && isVerb(token[0]))
  const mainVerb = lexicalVerb ? lemmaOf(lexicalVerb[0]) : firstVerb
  const beIndex = verbTokens.findIndex((token) => lemmaOf(token[0]) === 'be')
  const passive =
    beIndex >= 0 &&
    verbTokens.slice(beIndex + 1).some((token) => {
      const key = normalizeToken(token[0])
      return isPastParticiple(key)
    })
  const hasLinkingVerb = verbTokens.some((token) => LINKING_VERBS.has(lemmaOf(token[0])))
  const existential = normalizeToken(subject) === 'there' && hasLinkingVerb

  const parts = []
  if (subject) parts.push({ role: existential ? 'M' : 'S', text: subject })
  if (preVerbModifier) parts.push({ role: 'M', text: preVerbModifier })
  parts.push({ role: 'V', text: verbText })

  if (remainder) {
    const remainderFirst = firstWord(remainder)
    if (existential) {
      parts.push({ role: 'S', text: remainder })
    } else if (!passive && (LINKING_VERBS.has(mainVerb) || hasLinkingVerb)) {
      const remainderTokens = words(remainder)
      const infinitiveComplement =
        remainderFirst === 'to' &&
        ![
          'a', 'an', 'her', 'his', 'its', 'my', 'our', 'the', 'their', 'this',
          'those', 'your',
        ].includes(normalizeToken(remainderTokens[1] ?? ''))
      if (PREPOSITIONS.has(remainderFirst) && !infinitiveComplement) {
        parts.push({ role: 'M', text: remainder })
      } else {
        const [complement, modifier] = splitObjectAndModifier(remainder)
        if (complement) parts.push({ role: 'C', text: complement })
        if (modifier) parts.push({ role: 'M', text: modifier })
      }
    } else if (
      PREPOSITIONS.has(remainderFirst) ||
      MID_SENTENCE_ADVERBS.has(remainderFirst) ||
      ['better', 'farther', 'further', 'well'].includes(remainderFirst) ||
      /ly$/.test(remainderFirst)
    ) {
      parts.push({ role: 'M', text: remainder })
    } else if (
      /^(?:and|but|or)\s+/i.test(remainder) &&
      isVerb(words(remainder)[1] ?? '')
    ) {
      parts.push({ role: 'M', text: remainder })
    } else if (passive) {
      parts.push({ role: 'M', text: remainder })
    } else if (DOUBLE_OBJECT_VERBS.has(mainVerb)) {
      const remainderWords = [...remainder.matchAll(/[A-Za-z][A-Za-z'’-]*/g)]
      const firstRemainder = normalizeToken(remainderWords[0]?.[0] ?? '')
      const recipientWords = RECIPIENT_PRONOUNS.has(firstRemainder)
        ? 1
        : ['how', 'what', 'whether', 'which', 'who', 'why']
            .includes(normalizeToken(remainderWords[1]?.[0] ?? ''))
          ? 1
        : (
            remainderWords.length >= 4 &&
            !PREPOSITIONS.has(normalizeToken(remainderWords[2]?.[0] ?? ''))
          )
          ? 2
          : 0
      const boundary = remainderWords[recipientWords]?.index
      if (recipientWords > 0 && boundary) {
        parts.push({ role: 'O1', text: remainder.slice(0, boundary).trim() })
        parts.push({ role: 'O2', text: remainder.slice(boundary).trim() })
      } else if (recipientWords > 0) {
        parts.push({ role: 'O1', text: remainder })
      } else {
        parts.push({ role: 'O', text: remainder })
      }
    } else if (OBJECT_COMPLEMENT_VERBS.has(mainVerb) && words(remainder).length >= 2) {
      const remainderWords = [...remainder.matchAll(/[A-Za-z][A-Za-z'’-]*/g)]
      const complementIndex = remainderWords.findIndex((token, index) =>
        index > 0 &&
        (
          (
            mainVerb !== 'help' &&
            ['as', 'more'].includes(normalizeToken(token[0]))
          ) ||
          (
            index === 1 &&
            ['help', 'make'].includes(mainVerb) &&
            isVerb(token[0])
          ) ||
          (
            mainVerb !== 'help' &&
            wordRecord(token[0])?.pos === '形' &&
            index === remainderWords.length - 1
          )
        ))
      const boundary = complementIndex > 0 ? remainderWords[complementIndex]?.index : null
      if (boundary != null) {
        parts.push({ role: 'O', text: remainder.slice(0, boundary).trim() })
        parts.push({ role: 'C', text: remainder.slice(boundary).trim() })
      } else {
        parts.push({ role: 'O', text: remainder })
      }
    } else {
      const [object, modifier] = splitObjectAndModifier(remainder)
      if (object) parts.push({ role: 'O', text: object })
      if (modifier) parts.push({ role: 'M', text: modifier })
    }
  }

  const coreRoles = parts
    .map((part) => part.role.replace(/[12]$/, ''))
    .filter((role) => role !== 'M')
  const pattern = existential ? 'SV' : coreRoles.join('')
  return {
    parts,
    pattern,
    name: SVOC_NAMES[pattern] ?? (pattern ? `${pattern}型` : ''),
  }
}

function sentencePattern(blocks) {
  const roles = []
  for (const block of blocks) {
    if (block.kind === 'core') {
      roles.push(...block.svoc.parts.map((part) => part.role))
    } else if (block.role === '並列') {
      roles.push(`並列節(${block.svoc.pattern})`)
    } else if (block.role) {
      roles.push(block.role)
    }
  }
  const firstCoreIndex = blocks.findIndex((block) => block.kind === 'core')
  if (
    firstCoreIndex > 0 &&
    blocks[firstCoreIndex - 1]?.role === 'S' &&
    roles[firstCoreIndex] === 'S'
  ) {
    roles.splice(firstCoreIndex, 1)
  }
  return roles.join(' + ')
}

function startsWithPredicate(text) {
  const tokens = words(text)
  if (isFiniteVerbAt(tokens, 0)) return true
  return (
    ['also', 'however', 'nevertheless', 'therefore', 'thus'].includes(normalizeToken(tokens[0] ?? '')) &&
    isFiniteVerbAt(tokens, 1)
  )
}

function mainClausePattern(blocks) {
  const coreIndex = blocks.findIndex(
    (block) => block.kind === 'core' && block.svoc.pattern.includes('V'),
  )
  if (coreIndex < 0) return ''
  const coreParts = blocks[coreIndex].svoc.parts
  if (
    blocks[coreIndex].svoc.pattern === 'SV' &&
    coreParts.some((part) => part.role === 'M' && normalizeToken(part.text) === 'there')
  ) {
    return 'SV'
  }
  const roles = coreParts
    .map((part) => part.role)
    .filter((role) => role !== 'M')
  if (!roles.includes('S') && blocks.slice(0, coreIndex).some((block) => block.role === 'S')) {
    roles.unshift('S')
  }
  const verbPartIndex = coreParts.findIndex((part) => part.role === 'V')
  if (
    coreParts.some(
      (part, index) =>
        part.role === 'M' &&
        index > verbPartIndex &&
        (
          PREPOSITIONS.has(firstWord(part.text)) ||
          /\b(?:by|from|in|on|with)\s*$/i.test(part.text)
        ),
    )
  ) {
    return roles.map((role) => role.replace(/[12]$/, '')).join('')
  }
  for (const block of blocks.slice(coreIndex + 1)) {
    if (block.kind === 'core' || block.role === '並列') break
    if (block.role === 'M') break
    const rawRole = block.role
    const role = rawRole?.replace(/[12]$/, '')
    if (rawRole === 'O2' && roles.includes('O1')) {
      roles.push('O2')
      break
    }
    const normalizedRoles = roles.map((item) => item.replace(/[12]$/, ''))
    if (
      ['O', 'C'].includes(role) &&
      !normalizedRoles.includes(role) &&
      !(role === 'O' && normalizedRoles.includes('C'))
    ) {
      roles.push(rawRole)
      break
    }
  }
  return roles.map((role) => role.replace(/[12]$/, '')).join('')
}

function roleReadingGuide(block) {
  if (block.role === 'O' || block.role === 'O2') {
    return 'このまとまり全体を、動詞の「何を」に当たる内容として受け取ります。'
  }
  if (block.role === 'O1') {
    return 'このまとまりは、動作を受ける相手、「だれに」に当たります。'
  }
  if (block.role === 'C') {
    return 'このまとまりは、前に出た主語や目的語の内容・状態を説明します。'
  }
  if (block.role === 'S') {
    return 'このまとまり全体を、文の主語、「何が」に当たる内容として受け取ります。'
  }
  if (block.role === '並列') {
    return '前の節と同じ高さで意味を続け、追加・対比・結果の関係を確かめます。'
  }
  return '文の骨格に、時・場所・手段・理由などの情報を付け足すまとまりです。'
}

function phraseReadingGuide(block) {
  if (block.label === 'to不定詞句') {
    if (block.role === 'O') return 'to以下を、前の動詞が表す「すること」の内容として受け取ります。'
    if (block.role === 'C') return 'to以下が、前に出た人や物が何をするのかを説明します。'
    return 'to以下を、目的・結果・名詞の説明として前の内容へ足します。'
  }
  if (block.label === '動名詞句') {
    return '動作を「〜すること」という名詞のまとまりにして、文の主語として受け取ります。'
  }
  if (block.label === '分詞・動名詞句') {
    return '動作や同時に起こる状況を、前の内容へ補って読みます。'
  }
  if (block.label.includes('補語')) {
    return '前に出た主語や目的語が、どのようなもの・状態かを説明するまとまりです。'
  }
  if (block.label.includes('目的語')) {
    return '前の動詞が向かう対象として、直前の内容と一続きに受け取ります。'
  }
  return roleReadingGuide(block)
}

function translationGuideFor(block) {
  const orderLead = block.kind === 'core'
    ? 'まず文の中心を、この語順のまま前からつかみます。'
    : '前の内容へ、この語順のまま意味を足します。'
  const roleRoute = block.phrasePairs
    .flatMap((pair) => pair.roleParts.map((part) => translationRoleMeta(part.role).code))
    .join('→')
  const roleGuide = roleRoute
    ? `このブロックの内部は${roleRoute}の順です。各ラベルの「だれが・どうする・何を・どんな状態・いつ／どこで」を順に置きます。`
    : ''
  const grammarGuide = block.kind === 'core'
    ? ''
    : block.kind === 'clause'
      ? CLAUSE_READING_GUIDES[block.label] ?? roleReadingGuide(block)
      : phraseReadingGuide(block)
  return [orderLead, roleGuide, grammarGuide, block.translationTip].filter(Boolean).join(' ')
}

function generatedBlockIndex(phrase) {
  return /^generated-(\d+)-/.exec(phrase.id)?.[1] ?? null
}

function rolesForPhrase(phrase) {
  return phrase.roles ?? (phrase.role ? [phrase.role] : [])
}

const CONFIRMED_PREPOSITION_OBJECT_PHRASES = new Map([
  [
    "about|the month's topic",
    {
      ja: 'その月のテーマについて',
      grammar: 'about と目的語 the month\'s topic を分断せず、「何について」を表す前置詞句として一息で取ります。',
    },
  ],
  [
    'about|public behavior',
    {
      ja: '公共の場での人々の行動について',
      grammar: 'about と目的語 public behavior を一つにし、data が何についてのものかを後ろから足します。',
    },
  ],
  [
    'from|foreign visitors',
    {
      ja: '外国人来館者からの（質問に）',
      grammar: 'from と目的語 foreign visitors を一息にします。from foreign visitors は前の questions を説明するため、括弧で「質問に」を受け直します。',
    },
  ],
])

function confirmedPrepositionObjectPhrase(left, right, decision) {
  const roleParts = Object.freeze([...left.roleParts, ...right.roleParts])
  const roles = Object.freeze([...new Set(roleParts.map((part) => part.role))])
  const en = `${left.en} ${right.en}`
  return Object.freeze({
    ...left,
    id: `${left.id}+${right.id}`,
    en,
    spokenEn: en,
    displayEn: en,
    ja: decision.ja,
    role: roles[0] ?? 'M',
    roles,
    roleParts,
    roleHeading: translationRoleHeading(roles, left.scope),
    roleNote: translationRoleExplanation(roles, decision.ja, left.scope),
    source: 'confirmed-rule',
    status: 'confirmed',
    reviewRule: 'preposition-with-object',
    label: '前置詞＋目的語',
    kind: 'confirmed-rule-phrase',
    readingGuide: '前置詞とその目的語を、発音して意味を受け取れる一つの単位として読みます。',
    grammar: decision.grammar,
    grammarNote: decision.grammar,
    explanation: decision.grammar,
  })
}

function applyConfirmedPhraseRules(phrases) {
  const merged = []
  for (let index = 0; index < phrases.length; index++) {
    const left = phrases[index]
    const right = phrases[index + 1]
    const sameBlock = right && generatedBlockIndex(left) === generatedBlockIndex(right)
    const prepositionObjectDecision = right
      ? CONFIRMED_PREPOSITION_OBJECT_PHRASES.get(`${left.en.toLowerCase()}|${right.en.toLowerCase()}`)
      : null

    if (
      sameBlock &&
      left.source === 'generated' &&
      right.source === 'generated' &&
      prepositionObjectDecision
    ) {
      merged.push(confirmedPrepositionObjectPhrase(left, right, prepositionObjectDecision))
      index += 1
      continue
    }

    merged.push(left)
  }
  return Object.freeze(merged)
}

function mergeSentenceBoundaryPhraseSequence(phrases, sentenceGloss) {
  const merged = []
  for (let index = 0; index < phrases.length; index++) {
    const left = phrases[index]
    const right = phrases[index + 1]
    const leftKey = words(left.en).map(normalizeToken).join(' ')
    const rightKey = words(right?.en ?? '').map(normalizeToken).join(' ')
    const bindAcrossBoundary =
      right &&
      BOUND_PREPOSITION_PARTS.has(leftKey) &&
      (
        ['what', 'which', 'who', 'being', 'losing'].includes(rightKey.split(' ')[0]) ||
        REVIEWED_PREPOSITION_JA[`${leftKey} ${rightKey}`]
      )
    if (!bindAcrossBoundary) {
      merged.push(left)
      continue
    }

    const en = `${left.en} ${right.en}`.replace(/\s+/g, ' ').trim()
    const ja = prepositionPhraseJapanese(en, right, sentenceGloss)
    const rolePair = singleRolePhrasePair({
      en,
      ja,
      role: 'M',
      sourceJa: `${left.sourceJa ?? left.ja} → ${right.sourceJa ?? right.ja}`,
      sourceIndex: left.sourceIndex,
      scope: left.scope || right.scope,
    })
    const explanation =
      `${left.en} と ${right.en} を、前置詞とその対象がそろう一つの意味単位として読みます。` +
      `英語を戻らず「${ja}」と取ります。`
    merged.push(Object.freeze({
      ...left,
      ...rolePair,
      id: `${left.id}+${right.id}`,
      spokenEn: en,
      displayEn: en,
      source: 'corpus-review',
      status: 'review-needed',
      grammarNote: explanation,
      explanation,
    }))
    index++
  }
  return Object.freeze(merged)
}

const reviewedPhraseKey = (value = '') => words(value).map(normalizeToken).join(' ')

const CONTEXT_RELATIVE_PRONOUNS = new Set(['that', 'which', 'who', 'whom'])
const CLAUSE_CONNECTOR_MEANINGS = Object.freeze({
  after: 'after は時の節の入口で、後ろのS→Vを「〜したあとで」と主節へ足します。',
  before: 'before は時の節の入口で、後ろのS→Vを「〜する前に」と主節へ足します。',
  because: 'because は理由節の入口で、後ろのS→Vを「なぜなら〜だから」と主節へ足します。',
  if: 'if は条件節の入口で、後ろのS→Vを「もし〜なら」と主節へ足します。',
  once: 'once は時・条件の節の入口で、後ろのS→Vを「いったん〜すると」と主節へ足します。',
  unless: 'unless は否定条件の入口で、後ろのS→Vを「〜でない限り」と主節へ足します。',
  whereas: 'whereas は対比節の入口で、前の内容と後ろのS→Vを「一方で」と対照させます。',
  although: 'although は譲歩節の入口で、後ろのS→Vを「〜だけれども」と主節へ足します。',
  though: 'though は譲歩節の入口で、後ろのS→Vを「〜だけれども」と主節へ足します。',
  'so that': 'so that は目的・結果の節を導き、後ろのS→Vを「〜するように／その結果〜」と主節へつなぎます。',
  whether: 'whether は「〜かどうか」という間接疑問の入口で、後ろのS→V全体を内容としてまとめます。',
})

const INFINITIVE_BASE_VERBS = new Set([
  'abandon', 'accept', 'admit', 'ask', 'be', 'build', 'care', 'challenge',
  'change', 'choose', 'collect', 'combine', 'describe', 'distinguish', 'do',
  'dominate', 'drink', 'eat', 'estimate', 'examine', 'exercise', 'feel', 'fix',
  'force', 'gain', 'grow', 'hear', 'improve', 'invite', 'join', 'judge', 'learn',
  'make', 'map', 'measure', 'move', 'observe', 'open', 'optimize', 'plan',
  'prepare', 'preserve', 'prevent', 'protect', 'question', 'read', 'reduce',
  'report', 'research', 'revise', 'sell', 'share', 'sit', 'stay', 'stop', 'test',
  'store', 'study', 'talk', 'teach', 'think', 'treat', 'try', 'understand',
  'use', 'watch',
])

const INFINITIVE_CONTEXT_OVERRIDES = new Map([
  [
    "After the talk, children will work in small groups to build a paper model of the station.|||to build",
    'to build は work in small groups の目的を示す不定詞で、「紙模型を作るために班で作業する」とつながります。',
  ],
  [
    'In July, they picked enough cucumbers and tomatoes to share with people at a nearby community center.|||to share',
    'to share は enough ... to do の程度・結果を完成させ、「分けられるほど十分なキュウリとトマト」とつながる不定詞です。',
  ],
  [
    'The students used this advice to plan a second garden, which made the project continue beyond one school term.|||to plan',
    'to plan は used this advice の目的を示す不定詞で、「二つ目の畑を計画するためにこの助言を使った」とつながります。',
  ],
  [
    'Some projects also send several volunteers the same observation task and compare their answers to estimate how often mistakes occur.|||to estimate',
    'to estimate は compare their answers の目的を示す不定詞で、「誤りの頻度を推定するために答えを比べる」とつながります。',
  ],
  [
    'Some people do not have a bank account, a suitable phone, reliable internet access, or the identity documents required to open a digital account.|||to open',
    'to open は required を具体化し、「デジタル口座を開設するために必要な身分証明書」という用途・条件を作る不定詞です。',
  ],
  [
    'Extending the life of a product reduces waste and lowers demand for the energy and resources required to make new goods.|||to make',
    'to make は required を具体化し、「新しい商品を作るために必要とされる資源」という形容詞補完を作る不定詞です。',
  ],
  [
    'They may not know the answer to every question, so they are taught to admit uncertainty and ask a staff member for help.|||to admit',
    'to admit は受動態 are taught の教えられる内容を示す不定詞で、「不確かさを認めるよう教えられる」とつながります。',
  ],
  [
    'Because buying a new item is often easier than finding someone to fix the old one, usable products become waste.|||to fix',
    'to fix は someone が行う動作を後ろから説明し、「古い物を直してくれる人」とまとめる不定詞です。',
  ],
  [
    'Even when an object cannot be repaired, a visitor may learn why it failed and how to choose a longer-lasting replacement.|||to choose',
    'how to choose は疑問詞＋不定詞で、why it failed と and で並ぶ二つ目の間接疑問「どう選ぶか」を作ります。',
  ],
  [
    'In recent years, however, some of the most useful technologies have been designed to be almost invisible.|||to be',
    'to be は have been designed の意図された状態を示し、「ほとんど見えないように設計されてきた」とつながる不定詞です。',
  ],
  [
    'A park that cools a wealthy district, for example, may increase nearby rents and force lower-income residents to move before they enjoy the benefits.|||to move',
    'to move は force O to do の不定詞で、目的語 lower-income residents が移るよう強いる関係を作ります。',
  ],
  [
    'Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.|||to collect',
    'what to collect は疑問詞＋不定詞で、「何を収集するか」という decide の一つ目の内容を作ります。',
  ],
  [
    'Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.|||to describe',
    'how to describe は疑問詞＋不定詞で、「それをどう記述するか」という decide の二つ目の内容を作ります。',
  ],
  [
    'Rather, a mature society keeps multiple perspectives in conversation while refusing to treat evidence as optional.|||to treat',
    'to treat は refusing の目的となる動作内容で、「証拠を任意のものとして扱うことを拒みながら」とつながる不定詞です。',
  ],
  [
    'A science class decided to study the problem instead of simply asking everyone to eat more.|||to eat',
    'to eat は ask O to do の不定詞で、目的語 everyone に「もっと食べるよう」求める関係を作ります。',
  ],
  [
    'They may ask participants to watch for the same length of time and to report visits when no birds appeared.|||to watch',
    'to watch は ask O to do の不定詞で、目的語 participants に観察するよう求める内容です。',
  ],
  [
    'They may ask participants to watch for the same length of time and to report visits when no birds appeared.|||to report',
    'to report は to watch と and で並列され、共有する ask participants に対する二つ目の動作内容です。',
  ],
  [
    'Tea might reduce stress, but perhaps relaxed people simply choose to drink more tea.|||to drink',
    'to drink は choose の選択内容を示し、「もっとお茶を飲むことを選ぶ」とつながる不定詞です。',
  ],
  [
    'Some governments therefore require essential businesses to accept cash while encouraging digital innovation elsewhere.|||to accept',
    'to accept は require O to do の不定詞で、目的語 essential businesses に現金を受け入れるよう求める関係を作ります。',
  ],
  [
    'Modern institutions measure almost everything they hope to improve in complex systems with competing public purposes.|||to improve',
    'to improve は hope の内容を示す不定詞で、目的語の空所は先行する everything を受け、「改善したいと望むすべてのもの」とつながります。',
  ],
  [
    'Once rewards or penalties depend heavily on the score, people have an incentive to optimize the proxy rather than pursue the underlying mission.|||to optimize',
    'to optimize は名詞 incentive の具体的内容を後ろから説明し、「代替指標を最適化しようとする誘因」とまとめる不定詞です。',
  ],
  [
    'No collection of measures eliminates judgment, but plural indicators make it harder for one narrow target to dominate behavior.|||to dominate',
    'to dominate は for one narrow target を意味上の主語に取り、make it harder の「何が難しいか」を示す不定詞です。',
  ],
])

const INFINITIVE_BINDING_OVERRIDES = new Map([
  ["After the talk, children will work in small groups to build a paper model of the station.|||to build", { type: 'purpose', governor: 'will work', semanticSubject: 'children' }],
  ['The students began to understand how temperature, rain, and insects affected the vegetables.|||to understand', { type: 'verb-complement', governor: 'began', semanticSubject: 'The students' }],
  ['It also gives independent researchers a way to test whether alternative definitions would tell a substantially different story.|||to test', { type: 'noun-modifier', governor: 'a way', semanticSubject: 'independent researchers' }],
  ['Some wanted to use a strong chemical spray, but the teacher asked them to research safer choices first.|||to use', { type: 'verb-complement', governor: 'wanted', semanticSubject: 'Some' }],
  ['Some wanted to use a strong chemical spray, but the teacher asked them to research safer choices first.|||to research', { type: 'object-to-infinitive', governor: 'asked', semanticSubject: 'them' }],
  ['In July, they picked enough cucumbers and tomatoes to share with people at a nearby community center.|||to share', { type: 'degree-result', governor: 'enough cucumbers and tomatoes', semanticSubject: 'they' }],
  ['The students used this advice to plan a second garden, which made the project continue beyond one school term.|||to plan', { type: 'purpose', governor: 'used this advice', semanticSubject: 'The students' }],
  ['They may not know the answer to every question, so they are taught to admit uncertainty and ask a staff member for help.|||to admit', { type: 'passive-verb-complement', governor: 'are taught', semanticSubject: 'they' }],
  ['Another student decided to study history at college because he wanted to protect old buildings in his town.|||to study', { type: 'verb-complement', governor: 'decided', semanticSubject: 'Another student' }],
  ['Another student decided to study history at college because he wanted to protect old buildings in his town.|||to protect', { type: 'verb-complement', governor: 'wanted', semanticSubject: 'he' }],
  ['Because buying a new item is often easier than finding someone to fix the old one, usable products become waste.|||to fix', { type: 'noun-modifier', governor: 'someone', semanticSubject: 'someone' }],
  ['Visitors are expected to sit with volunteers and take part in the work instead of simply leaving an item at a counter.|||to sit', { type: 'passive-verb-complement', governor: 'are expected', semanticSubject: 'Visitors' }],
  ['A volunteer may show someone how to open a lamp safely, replace a worn wire, or search for instructions online.|||to open', { type: 'wh-infinitive', governor: 'how / show someone', semanticSubject: 'someone' }],
  ['Even when an object cannot be repaired, a visitor may learn why it failed and how to choose a longer-lasting replacement.|||to choose', { type: 'wh-infinitive', governor: 'how / learn', semanticSubject: 'a visitor' }],
  ['The system does not tell people what to do, but it gives them a better source of information.|||to do', { type: 'wh-infinitive', governor: 'what / tell people', semanticSubject: 'people' }],
  ['It also gave them a chance to talk with older people who knew many useful farming tips.|||to talk', { type: 'noun-modifier', governor: 'a chance', semanticSubject: 'them' }],
  ['When young people take part, exhibitions feel more open, and visitors are more willing to ask questions.|||to ask', { type: 'adjective-complement', governor: 'willing', semanticSubject: 'visitors' }],
  ['Extending the life of a product reduces waste and lowers demand for the energy and resources required to make new goods.|||to make', { type: 'adjective-complement', governor: 'required', semanticSubject: 'resourcesを必要とする生産者' }],
  ['Some modern products are also designed so that they are difficult to open without special tools.|||to open', { type: 'adjective-complement', governor: 'difficult', semanticSubject: 'productsを開ける人' }],
  ['In recent years, however, some of the most useful technologies have been designed to be almost invisible.|||to be', { type: 'verb-complement', governor: 'have been designed', semanticSubject: 'some of the most useful technologies' }],
  ['This evidence makes it easier to improve a design or decide that a simpler solution would work better.|||to improve', { type: 'anticipatory-object-content', governor: 'makes it easier', semanticSubject: '設計を改善する人' }],
  ['This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.|||to reduce', { type: 'noun-modifier', governor: 'an attempt', semanticSubject: '試みを行う主体' }],
  ['Some cities have begun to invite residents to map dangerous intersections, hot streets, and places where water remains after heavy rain.|||to invite', { type: 'verb-complement', governor: 'have begun', semanticSubject: 'Some cities' }],
  ['Some cities have begun to invite residents to map dangerous intersections, hot streets, and places where water remains after heavy rain.|||to map', { type: 'object-to-infinitive', governor: 'invite', semanticSubject: 'residents' }],
  ['Because these measures are less dramatic, they are often the first to be reduced when budgets become tight.|||to be reduced', { type: 'ordinal-complement', governor: 'the first', semanticSubject: 'these measures / they' }],
  ['It is now possible to store enormous amounts of information at little cost, and many people therefore believe that forgetting has become less likely.|||to store', { type: 'extraposed-subject-content', governor: 'It is now possible', semanticSubject: '情報を保存する一般の主体' }],
  ['Institutions must be free to preserve uncomfortable evidence, while citizens must be able to ask how decisions about selection, description, and access are made.|||to preserve', { type: 'adjective-complement', governor: 'free', semanticSubject: 'Institutions' }],
  ['Institutions must be free to preserve uncomfortable evidence, while citizens must be able to ask how decisions about selection, description, and access are made.|||to ask', { type: 'adjective-complement', governor: 'able', semanticSubject: 'citizens' }],
  ['Accountability must consequently include transparent reasons, opportunities for challenge, and continuing efforts to hear people who were absent from the original decision.|||to hear', { type: 'noun-modifier', governor: 'continuing efforts', semanticSubject: '説明責任を担う主体' }],
  ['Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.|||to collect', { type: 'wh-infinitive', governor: 'what / must decide', semanticSubject: 'every archive' }],
  ['Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.|||to describe', { type: 'wh-infinitive', governor: 'how / must decide', semanticSubject: 'every archive' }],
  ['The aim should not be to force a single consensus that erases conflict.|||to force', { type: 'subject-complement', governor: 'should not be / The aim', semanticSubject: '合意形成を行う主体' }],
  ['Rather, a mature society keeps multiple perspectives in conversation while refusing to treat evidence as optional.|||to treat', { type: 'verb-complement', governor: 'refusing', semanticSubject: 'a mature society' }],
  ['The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.|||to abandon', { type: 'subject-complement', governor: 'is not / The alternative', semanticSubject: '代案を実行する主体' }],
  ['The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.|||to combine', { type: 'parallel-subject-complement', governor: 'is / The alternative', semanticSubject: '代案を実行する主体' }],
  ['Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.|||to question', { type: 'purpose', governor: 'can use records', semanticSubject: 'a society' }],
  ['If every account of the past is dismissed as merely political, citizens lose the capacity to distinguish careful revision from deliberate distortion.|||to distinguish', { type: 'noun-modifier', governor: 'the capacity', semanticSubject: 'citizens' }],
  ['It also requires citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears.|||to read', { type: 'adjective-complement', governor: 'willing', semanticSubject: 'citizens' }],
  ['If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.|||to learn', { type: 'noun-modifier', governor: 'their ability', semanticSubject: 'societies' }],
  ['A science class decided to study the problem instead of simply asking everyone to eat more.|||to eat', { type: 'object-to-infinitive', governor: 'asking', semanticSubject: 'everyone' }],
  ['A science class decided to study the problem instead of simply asking everyone to eat more.|||to study', { type: 'verb-complement', governor: 'decided', semanticSubject: 'A science class' }],
  ['Some parents also depend on older children to care for younger family members after school.|||to care for', { type: 'semantic-subject-complement', governor: 'depend on', semanticSubject: 'older children' }],
  ['This cooperation made families more willing to try the new schedule for a full year.|||to try', { type: 'adjective-complement', governor: 'willing', semanticSubject: 'families' }],
  ['They should also teach students that a later start is not an invitation to stay online longer at night.|||to stay', { type: 'noun-modifier', governor: 'an invitation', semanticSubject: 'students' }],
  ['They may ask participants to watch for the same length of time and to report visits when no birds appeared.|||to watch', { type: 'object-to-infinitive', governor: 'ask', semanticSubject: 'participants' }],
  ['They may ask participants to watch for the same length of time and to report visits when no birds appeared.|||to report', { type: 'parallel-object-to-infinitive', governor: 'ask', semanticSubject: 'participants' }],
  ['The program will teach simple traffic rules and show people how to prevent common bicycle accidents.|||to prevent', { type: 'wh-infinitive', governor: 'how / show people', semanticSubject: 'people' }],
  ['The brain begins to feel sleepy later at night, but students must still wake up early for school.|||to feel', { type: 'verb-complement', governor: 'begins', semanticSubject: 'The brain' }],
  ['Schools need to examine bus routes, club times, and family needs before choosing a new schedule.|||to examine', { type: 'verb-complement', governor: 'need', semanticSubject: 'Schools' }],
  ['Some projects also send several volunteers the same observation task and compare their answers to estimate how often mistakes occur.|||to estimate', { type: 'purpose', governor: 'compare their answers', semanticSubject: 'Some projects / researchers' }],
  ['Readers still need to examine how the study was designed and whether other researchers found similar results.|||to examine', { type: 'verb-complement', governor: 'need', semanticSubject: 'Readers' }],
  ['Another common mistake is to treat correlation as proof of cause.|||to treat', { type: 'subject-complement', governor: 'is / Another common mistake', semanticSubject: '誤りを犯す人' }],
  ['Tea might reduce stress, but perhaps relaxed people simply choose to drink more tea.|||to drink', { type: 'verb-complement', governor: 'choose', semanticSubject: 'relaxed people' }],
  ['Instead, they help readers to judge how strong a conclusion can reasonably be.|||to judge', { type: 'object-to-infinitive', governor: 'help', semanticSubject: 'readers' }],
  ['Some people do not have a bank account, a suitable phone, reliable internet access, or the identity documents required to open a digital account.|||to open', { type: 'adjective-complement', governor: 'required / identity documents', semanticSubject: '口座を開設する人' }],
  ['Some governments therefore require essential businesses to accept cash while encouraging digital innovation elsewhere.|||to accept', { type: 'object-to-infinitive', governor: 'require', semanticSubject: 'essential businesses' }],
  ['A common response is to teach digital skills and provide low-cost accounts.|||to teach', { type: 'subject-complement', governor: 'is / A common response', semanticSubject: '対応を行う主体' }],
  ['The goal need not be to stop the transition toward digital payment.|||to stop', { type: 'subject-complement', governor: 'need not be / The goal', semanticSubject: '移行を止める主体' }],
  ['It should be to preserve meaningful alternatives while removing barriers that prevent people from choosing freely.|||to preserve', { type: 'subject-complement', governor: 'should be / It (= The goal)', semanticSubject: '目標を実行する主体' }],
  ['Modern institutions measure almost everything they hope to improve in complex systems with competing public purposes.|||to improve', { type: 'verb-complement', governor: 'hope', semanticSubject: 'they (= Modern institutions)' }],
  ['Once rewards or penalties depend heavily on the score, people have an incentive to optimize the proxy rather than pursue the underlying mission.|||to optimize', { type: 'noun-modifier', governor: 'an incentive', semanticSubject: 'people' }],
  ['A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.|||to change', { type: 'adjective-complement', governor: 'unlikely', semanticSubject: 'improvement' }],
  ['Critics sometimes conclude that quantification itself is the problem and that experienced professionals should simply be trusted to exercise judgment.|||to exercise', { type: 'passive-verb-complement', governor: 'should simply be trusted', semanticSubject: 'experienced professionals' }],
  ['No collection of measures eliminates judgment, but plural indicators make it harder for one narrow target to dominate behavior.|||to dominate', { type: 'anticipatory-object-content', governor: 'make it harder', semanticSubject: 'one narrow target' }],
])

function nearestAntecedent(phrases, index) {
  for (let cursor = index - 1; cursor >= 0; cursor--) {
    const candidate = phrases[cursor]
    if (candidate.role === 'LINK' || !candidate.en) continue
    return candidate.en
      .replace(/[,:;.!?]+$/g, '')
      .replace(/^(?:only\s+)?(?:about|against|along|among|around|at|behind|beside|by|during|for|from|in|into|like|near|of|on|over|through|to|toward|under|with|within|without|than)\s+/i, '')
      .trim()
  }
  return '直前の名詞'
}

function looksLikeRelativePlaceOrTime(phrases, index, marker) {
  const previous = phrases[index - 1]
  if (!previous || ['LINK', 'V'].includes(previous.role)) return false
  const previousKey = reviewedPhraseKey(previous.en)
  if (marker === 'where') {
    return /(?:place|places|site|sites|point|points|area|areas|location|locations)$/.test(previousKey)
  }
  return /(?:day|days|time|times|visit|visits|year|years|occasion|occasions)$/.test(previousKey)
}

function relativeGrammarCue(phrases, index, sentenceEn) {
  const phrase = phrases[index]
  const key = reviewedPhraseKey(phrase.en)
  const first = key.split(' ')[0]
  const roles = phrase.roles ?? [phrase.role]
  const previous = phrases[index - 1]
  const antecedent = key === 'which' && /save money,\s*which\b/i.test(sentenceEn)
    ? '直前の save money という内容全体'
    : nearestAntecedent(phrases, index)
  const previousCanBeAntecedent = previous &&
    !['LINK', 'V'].includes(previous.role) &&
    !(/^(?:who|whom|which)$/.test(key) && /(?:asking|assessing|deciding|estimating|explaining|showing|stating)$/i.test(previous.en))

  if (
    CONTEXT_RELATIVE_PRONOUNS.has(key) &&
    previousCanBeAntecedent &&
    roles.some((role) => role === 'S' || role === 'O')
  ) {
    const clauseRole = roles.includes('O') ? '目的語O' : '主語S'
    const forward = roles.includes('O')
      ? '後ろのS→Vを読んだあと、先行詞を「〜を」と受け直します。'
      : `英語順では「${phrase.ja}」と補ってから節のVへ進みます。`
    return {
      kind: 'relative',
      note: `${phrase.en} は ${antecedent} を先行詞に取る関係代名詞で、この節では${clauseRole}です。${forward}`,
    }
  }

  if (first === 'whose' && key.split(' ').length > 1) {
    return {
      kind: 'relative-determiner',
      note: `${phrase.en} の whose は ${antecedent} を受ける関係限定詞で、「その人・ものの〜」という名詞句を作ります。この名詞句は後ろのVの主語Sです。`,
    }
  }

  if ((key === 'where' || key === 'when') && looksLikeRelativePlaceOrTime(phrases, index, key)) {
    return {
      kind: 'relative-adverb',
      note: `${phrase.en} は ${antecedent} を先行詞に取る関係副詞で、後ろのS→Vがその${key === 'where' ? '場所' : '時'}を説明します。`,
    }
  }

  return null
}

function interrogativeGrammarCue(phrases, index, sentenceEn) {
  const phrase = phrases[index]
  const key = reviewedPhraseKey(phrase.en)
  const first = key.split(' ')[0]
  if (!['what', 'which', 'who', 'whom', 'where', 'when', 'how', 'why', 'whether'].includes(first)) return null

  if (first === 'whether') {
    return { kind: 'embedded-question', note: CLAUSE_CONNECTOR_MEANINGS.whether }
  }
  if (first === 'how') {
    const questionKind = /^how (?:long|often|much|many|crowded|strong)\b/.test(key)
      ? '程度・数量'
      : '方法・様子'
    return {
      kind: 'embedded-question',
      note: `${phrase.en} は間接疑問の合図で、ここでは${questionKind}を問い、後ろのS→Vまたはto不定詞までを内容としてまとめます。`,
    }
  }
  if (first === 'why') {
    const governing = sentenceEn.startsWith('Students must learn how narratives are constructed, why ')
      ? 'must learn'
      : [...phrases.slice(0, index)]
      .reverse()
      .find((item) => item.role === 'V')?.en ?? '前の動詞'
    const coordination = sentenceEn.startsWith('Students must learn how narratives are constructed, why ')
      ? '一つ目の how narratives ... と並ぶ二つ目の内容として、'
      : ''
    return {
      kind: 'embedded-question',
      note: `${phrase.en} は理由を尋ねる間接疑問の入口です。${coordination}後ろのS→V全体が「なぜ〜なのか」という ${governing} の内容になります。`,
    }
  }
  if (first === 'where' || first === 'when') {
    return {
      kind: 'embedded-question',
      note: `${phrase.en} は間接疑問の中で「${first === 'where' ? 'どこで・どこに' : 'いつ'}」を表す副詞Mです。後ろのS→Vまでを内容としてまとめます。`,
    }
  }
  const clauseRole = (phrase.roles ?? [phrase.role]).includes('O') ? '目的語O' : '主語S'
  return {
    kind: 'embedded-question',
    note: `${phrase.en} は先行詞を受ける関係詞ではなく、間接疑問の中で「${phrase.ja}」を表し、この節では${clauseRole}になります。`,
  }
}

function infinitiveGrammarCue(phrases, index, sentenceEn) {
  const phrase = phrases[index]
  const key = reviewedPhraseKey(phrase.en)
  const match = key.match(/^to ([a-z]+)/)
  if (!match || !INFINITIVE_BASE_VERBS.has(match[1])) return null
  const contextKey = `${sentenceEn}|||${key}`
  const override = INFINITIVE_CONTEXT_OVERRIDES.get(contextKey)
  const bindingOverride = INFINITIVE_BINDING_OVERRIDES.get(contextKey)
  const previous = phrases[index - 1]
  const nearestGovernor = [...phrases.slice(0, index)].reverse()
    .find((item) => item.role === 'V' || item.role === 'C')
  const nearestObject = [...phrases.slice(0, index)].reverse()
    .find((item) => item.role === 'O' || item.role === 'O1')
  if (override) {
    const type = /疑問詞＋不定詞/.test(override)
      ? 'wh-infinitive'
      : /\bO to do\b|目的語 .* が|意味上の主語/i.test(override)
        ? 'object-to-infinitive'
        : /主格補語C|補語C/.test(override)
          ? 'subject-complement'
          : /enough .* to|程度・結果/.test(override)
            ? 'degree-result'
            : /required|形容詞補完/.test(override)
              ? 'adjective-complement'
              : /目的を示す|ために/.test(override)
                ? 'purpose'
                : /名詞 .*内容|名詞 .*説明|後ろから説明/.test(override)
                  ? 'noun-modifier'
                  : /目的となる|内容を示す|選択内容|教えられる内容/.test(override)
                    ? 'verb-complement'
                    : 'context-reviewed'
    return {
      kind: 'infinitive',
      note: override,
      infinitiveBinding: Object.freeze(bindingOverride ?? {
        type,
        governor: nearestGovernor?.en ?? previous?.en ?? '文脈上の支配語',
        semanticSubject: /意味上の主語|目的語 .* が/.test(override)
          ? nearestObject?.en ?? '文脈上の主体'
          : '',
      }),
    }
  }
  const nearbyComplement = [...phrases.slice(Math.max(0, index - 3), index)]
    .reverse()
    .find((item) => item.role === 'C')
  let functionNote
  let functionType
  let governor
  let semanticSubject = ''
  if (phrase.role === 'C') {
    functionNote = 'be動詞の後ろで主語の内容を説明する補語C'
    functionType = 'subject-complement'
    governor = nearestGovernor?.en ?? 'be動詞'
  } else if (previous && /^(?:how|what|where|when|which|who)(?:\b|$)/.test(reviewedPhraseKey(previous.en))) {
    functionNote = `${previous.en} と組んで「何を・どのように〜するか」を作る疑問詞＋不定詞`
    functionType = 'wh-infinitive'
    governor = previous.en
  } else if (previous?.role === 'O' && /C/.test(`${phrase.scope ?? ''}`)) {
    functionNote = `直前の目的語 ${previous.en} が行う動作を示す、Oの後ろの不定詞`
    functionType = 'object-to-infinitive'
    governor = nearestGovernor?.en ?? '前の動詞'
    semanticSubject = previous.en
  } else if (previous?.role === 'C') {
    functionNote = `直前の補語 ${previous.en} の具体的内容を示す不定詞`
    functionType = 'adjective-complement'
    governor = previous.en
  } else if (nearbyComplement && previous?.role === 'M') {
    functionNote = `${nearbyComplement.en} の具体的内容を示し、間の ${previous.en} を意味上の主語・対象として読む不定詞`
    functionType = 'adjective-complement'
    governor = nearbyComplement.en
    semanticSubject = previous.en
  } else if (previous?.role === 'V') {
    functionNote = `直前の動詞 ${previous.en} が求める動作内容を示す不定詞`
    functionType = 'verb-complement'
    governor = previous.en
  } else if (/(?:ために|ほど|には)/.test(phrase.ja)) {
    const purpose = /ために/.test(phrase.ja)
    functionNote = purpose
      ? `${nearestGovernor?.en ?? '前の動作'} の目的を示す不定詞`
      : `${nearestGovernor?.en ?? '前の表現'} の程度・結果を完成させる不定詞`
    functionType = purpose ? 'purpose' : 'degree-result'
    governor = nearestGovernor?.en ?? '前の動作・表現'
  } else {
    const governing = [...phrases.slice(Math.max(0, index - 4), index)]
      .reverse()
      .find((item) => item.role === 'V' || item.role === 'C')
    functionNote = governing
      ? `${governing.en} の内容を具体化し、後ろのO・Cと一緒に動作内容を作る不定詞`
      : '後ろのO・Cと一緒に動作内容を作る不定詞'
    functionType = 'verb-or-noun-complement'
    governor = governing?.en ?? '前の支配語'
  }
  return {
    kind: 'infinitive',
    note: `${phrase.en} は前置詞to＋名詞ではなく、to＋動詞原形の不定詞です。ここでは${functionNote}として働きます。`,
    infinitiveBinding: Object.freeze(bindingOverride ?? {
      type: functionType,
      governor,
      semanticSubject,
    }),
  }
}

function isEmbeddedQuestionContext(phrases, index) {
  const previous = phrases[index - 1]
  if (!previous) return false
  return /\b(?:ask|asks|asked|assessing|decide|decides|decided|determine|determines|determined|estimate|estimates|estimated|estimating|explain|explains|explained|know|knows|knew|learn|learns|learned|redefine|redefines|redefined|remember|remembers|remembered|reveal|reveals|revealed|show|shows|showed|state|states|stated|stating|understand|understands|understood)\b/i.test(previous.en)
}

function connectorGrammarCue(phrases, index) {
  const phrase = phrases[index]
  const key = reviewedPhraseKey(phrase.en)
  if (/^when [a-z]+ing$/.test(key)) {
    const understoodSubject = [...phrases.slice(0, index)]
      .reverse()
      .find((item) => item.role === 'S')?.en ?? '主節の主語'
    return {
      kind: 'reduced-clause',
      note: `${phrase.en} は ${understoodSubject} を意味上の主語に補う時の省略節です。主語＋be動詞を省き、「計画するとき」と読みます。`,
    }
  }
  if (key === 'before' && /^[a-z]+ing(?: |$)/.test(reviewedPhraseKey(phrases[index + 1]?.en))) {
    const understoodSubject = [...phrases.slice(0, index)]
      .reverse()
      .find((item) => item.role === 'S')?.en ?? '主節の主語'
    return {
      kind: 'reduced-clause',
      note: `before は後ろの ${phrases[index + 1].en} と組み、${understoodSubject} を意味上の主語に補う時の省略句を作ります。明示されたS→Vが続く型ではありません。`,
    }
  }
  if (/^when (?:possible|necessary|appropriate|required)$/.test(key)) {
    return {
      kind: 'reduced-clause',
      note: `${phrase.en} は when it is ${key.slice(5)} の主語 it とbe動詞を省いた時・条件の節です。`,
    }
  }
  if (CLAUSE_CONNECTOR_MEANINGS[key]) {
    return { kind: 'clause-connector', note: CLAUSE_CONNECTOR_MEANINGS[key] }
  }
  if (key === 'since') {
    const relation = /なぜなら|ので|ため/.test(phrase.ja) ? '理由' : '時'
    return {
      kind: 'clause-connector',
      note: `since はここでは${relation}の節を導き、後ろのS→Vまでを主節へつなぎます。`,
    }
  }
  if (
    key === 'when' &&
    !looksLikeRelativePlaceOrTime(phrases, index, key) &&
    !isEmbeddedQuestionContext(phrases, index)
  ) {
    return {
      kind: 'clause-connector',
      note: 'when は時の節の入口で、後ろのS→Vを「〜するとき／〜したとき」と主節へ足します。',
    }
  }
  if (key === 'while') {
    const relation = /一方|対し|けれど/.test(phrase.ja) ? '対比' : '同時進行'
    return {
      kind: 'clause-connector',
      note: `while は${relation}の節を導き、後ろのS→Vを前の内容と結びます。`,
    }
  }
  if (key === 'as') {
    const relation = /につれて/.test(phrase.ja)
      ? '変化の進行'
      : /中|ながら/.test(phrase.ja)
        ? '同時進行'
        : '比較・対応'
    return {
      kind: 'clause-connector',
      note: `as はここでは${relation}を示し、後ろのS→Vを前の内容へつなぎます。`,
    }
  }
  return null
}

const THAN_CONTEXT_OVERRIDES = new Map([
  ['In some cases, a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service.', { left: 'a simple repair / a clearer sign may help residents', right: 'an expensive digital service (may help residents)', head: 'may help ... more', ellipsis: 'may help residents', note: 'than an expensive digital service は help の程度を比較します。simple repair / clearer sign が住民を助ける度合いと、digital service が（住民を助ける）度合いを比べ、後項では may help residents が省略されています。' }],
  ['Some libraries now use quiet air-control systems that keep rooms comfortable while using less energy than older equipment.', { left: 'the systems use less energy', right: 'older equipment uses energy', head: 'less energy', ellipsis: 'uses energy', note: 'than older equipment は less energy と対応し、新しいsystemsが使うエネルギー量とolder equipmentが（使う）量を比較します。後項では uses energy が省略されています。' }],
  ['Yet collective memory is a far more fragile phenomenon than the existence of records might suggest.', { left: 'collective memory is a far more fragile phenomenon', right: 'the existence of records might suggest it is', head: 'far more fragile', ellipsis: 'collective memory is fragile', note: 'than the existence of records might suggest は far more fragile と対応します。suggest の補語「collective memory is fragile」が省略され、記録の存在から想像する以上に脆いことを示します。' }],
  ['Readers can check a university report that describes its methods more easily than a video with no named source.', { left: 'Readers can check a university report', right: 'Readers can check a video', head: 'more easily', ellipsis: 'Readers can check', note: 'than a video ... は主節 can check の容易さを比較します。more easily は関係詞節 describes ではなく can check へ戻ってかかり、後項では Readers can check が省略されています。' }],
  ['Because buying a new item is often easier than finding someone to fix the old one, usable products become waste.', { left: 'buying a new item', right: 'finding someone to fix the old one', head: 'is easier', ellipsis: '', note: 'than finding ... は easier と対応し、buying a new item と finding someone ... という二つの動名詞行為を比べます。' }],
  ['A public consultation may reproduce existing inequalities if organized groups can speak more loudly than communities with less time, money, or trust in institutions.', { left: 'organized groups', right: 'communities with less time, money, or trust', head: 'speak more loudly', ellipsis: 'can speak', note: 'than communities ... は more loudly と対応し、organized groups が話せる大きさと、communities が（話せる）大きさを比較します。後項では can speak が省略されています。' }],
  ['Education plays a central role in sustaining that discipline, but the task is more demanding than adding a few historical dates to a curriculum.', { left: 'the task', right: 'adding a few historical dates', head: 'is more demanding', ellipsis: '', note: 'than adding ... は more demanding と対応し、教育の課題全体と「日付を少し加えること」の要求度を比較します。' }],
  ['Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation.', { left: 'reward speed, emotional certainty, and loyalty', right: 'reward patient investigation', head: 'more readily', ellipsis: 'reward', note: 'than patient investigation は more readily と対応し、前の三項を報いる度合いと patient investigation を（報いる）度合いを比べます。後項では reward が省略されています。' }],
  ["A rumor that confirms a community's self-image may travel farther than a well-documented study that complicates it.", { left: 'A rumor', right: 'a well-documented study', head: 'may travel farther', ellipsis: 'may travel', note: 'than a well-documented study は farther と対応し、rumor が伝わる距離と study が（伝わる）距離を比べます。後項では may travel が省略されています。' }],
  ['Careful changes are more useful than keeping an old schedule simply because it is familiar, especially when schools review them regularly.', { left: 'Careful changes', right: 'keeping an old schedule', head: 'are more useful', ellipsis: '', note: 'than keeping ... は more useful と対応し、careful changes と「古い予定を保ち続けること」の有用さを比較します。' }],
  ['People also visit places that are easy to reach more often than distant or unsafe locations.', { left: 'visit places that are easy to reach', right: 'visit distant or unsafe locations', head: 'more often', ellipsis: 'visit', note: 'than distant or unsafe locations は more often と対応し、visit の頻度を二種類の場所で比べます。more often は関係詞節 are easy to reach ではなく主節 visit へ戻ってかかり、後項では visit が省略されています。' }],
])

const RATHER_THAN_CONTEXT_OVERRIDES = new Map([
  ['Good policy must be based on evidence from the actual community rather than on attractive ideas copied from other cities.', 'rather than on attractive ideas は based on の二つの根拠候補を対比し、「魅力的な考えにではなく、実際の地域の証拠に基づく」と選択を示します。'],
  ['A city that takes resilience seriously must therefore evaluate projects over a long period rather than only during the year in which they are introduced.', 'rather than only during the year ... は期間Mを対比し、「導入年だけでなく、長期間にわたり評価する」と前の over a long period へ戻ります。'],
  ['If measurement increases surveillance below but accountability does not increase above, the system may weaken rather than strengthen legitimacy.', 'rather than は may weaken legitimacy と (may) strengthen legitimacy を対比し、後者Bを否定して前者Aを選びます。'],
  ['Metrics are most valuable when they create questions rather than close them.', 'rather than は create questions と close them を対比し、後者Bを否定して前者Aを選びます。'],
])

function comparisonGrammarCue(phrases, index, sentenceEn) {
  const phrase = phrases[index]
  const key = reviewedPhraseKey(phrase.en)
  if (key === 'than') {
    const details = THAN_CONTEXT_OVERRIDES.get(sentenceEn)
    if (details) {
      return {
        kind: 'comparison',
        note: details.note,
        comparisonBinding: Object.freeze({
          type: 'comparison-with-ellipsis',
          left: details.left,
          right: details.right,
          head: details.head,
          ellipsis: details.ellipsis,
        }),
      }
    }
    const prior = [...phrases.slice(0, index)].reverse()
      .find((item) => /\b(?:more|less|better|worse|farther|rather)\b/i.test(item.en))
    const following = phrases[index + 1]
    return {
      kind: 'comparison',
      note: `than は ${prior?.en ?? '前の比較表現'} と対応し、${following?.en ?? '後ろの語句'} を比較対象として導きます。`,
    }
  }
  if (/\bmore than\b/.test(key)) {
    const details = THAN_CONTEXT_OVERRIDES.get(sentenceEn)
    if (details) {
      return {
        kind: 'comparison',
        note: details.note,
        comparisonBinding: Object.freeze({
          type: 'np-comparison-with-ellipsis',
          left: details.left,
          right: details.right,
          head: details.head,
          ellipsis: details.ellipsis,
        }),
      }
    }
    const note = sentenceEn.startsWith('Many museums are trying to become places')
      ? 'more than simply look は「単に見るだけを超えて」を表し、can do の内容を look at という比較相手より広げます。look は teenagers が行う別動作です。'
      : sentenceEn.startsWith('For these users, refusing cash does more than remove')
        ? 'does more than remove は「取り除くだけにとどまらない」という more than V 構文です。does と remove を別々の動作にせず、一つの述語として読みます。'
        : 'more than V は「単にVする以上のこと」を表し、前の動作・程度をVだけに限定しません。'
    return { kind: 'comparison', note }
  }
  if (key.startsWith('than ')) {
    const details = THAN_CONTEXT_OVERRIDES.get(sentenceEn)
    if (details) {
      return {
        kind: 'comparison',
        note: details.note,
        comparisonBinding: Object.freeze({
          type: 'comparison-with-ellipsis',
          left: details.left,
          right: details.right,
          head: details.head,
          ellipsis: details.ellipsis,
        }),
      }
    }
    const prior = [...phrases.slice(0, index)].reverse()
      .find((item) => /\b(?:more|less|better|worse|farther|rather|easier|harder)\b/i.test(item.en))
    return {
      kind: 'comparison',
      note: `${phrase.en} は ${prior?.en ?? '前の比較表現'} と対応して後ろの比較対象を導きます。比較する述語と省略要素は文全体から確認します。`,
      comparisonBinding: Object.freeze({ left: prior?.en ?? '前項', right: phrase.en, head: prior?.en ?? '比較表現', ellipsis: '' }),
    }
  }
  if (key === 'not only' || key.startsWith('not only ')) {
    if (sentenceEn === 'The broader lesson is that innovation should be judged by the range of people who can use it, not only by the speed of its average transaction.') {
      return {
        kind: 'correlative',
        note: 'not only by the speed ... は後続but alsoを要求する形ではありません。先に示した by the range of people ... を広い評価基準とし、「平均速度だけによって判断すべきではない」と限定否定します。',
      }
    }
    const counterpart = phrases.slice(index + 1).find((item) => reviewedPhraseKey(item.en).startsWith('but also'))
    return {
      kind: 'correlative',
      note: `not only は後ろの ${counterpart?.en ?? 'but also'} と呼応し、「AだけでなくBも」のA側を導きます。`,
    }
  }
  if (key === 'but also' || key.startsWith('but also ')) {
    return {
      kind: 'correlative',
      note: 'but also は前の not only と呼応し、「AだけでなくBも」のB側を導きます。',
    }
  }
  if (key === 'rather than' || key.startsWith('rather than ')) {
    if (sentenceEn === 'A city that takes resilience seriously must therefore evaluate projects over a long period rather than only during the year in which they are introduced.') {
      return {
        kind: 'comparison',
        note: RATHER_THAN_CONTEXT_OVERRIDES.get(sentenceEn),
        comparisonBinding: Object.freeze({
          type: 'period-contrast',
          left: 'over a long period',
          right: 'only during the year in which they are introduced',
          head: 'evaluate projects',
          ellipsis: 'evaluate projects',
        }),
      }
    }
    return {
      kind: 'comparison',
      note: RATHER_THAN_CONTEXT_OVERRIDES.get(sentenceEn) ?? 'rather than は前の選択・評価と後ろの候補を対比し、「後者ではなく前者」という優先関係を作ります。',
    }
  }
  if (key === 'less' && /\bthan\b/i.test(sentenceEn)) {
    return {
      kind: 'comparison',
      note: 'less は後ろの than と呼応し、程度がより小さいことを示します。比較対象は than の後ろで確定します。',
    }
  }
  if (/^as .+ as(?: |$)/.test(key)) {
    return {
      kind: 'comparison',
      note: `${phrase.en} は as ... as の同等比較で、前の動作・性質の程度を後ろの対象と比べます。`,
    }
  }
  if (key === 'as well') {
    return {
      kind: 'additive-idiom',
      note: 'as well は「〜もまた」を加える熟語Mで、as ... as の比較ではありません。',
    }
  }
  if (/^as [a-z]/.test(key)) {
    const previous = phrases[index - 1]
    if (/\bthe same$/i.test(previous?.en ?? '')) {
      return {
        kind: 'comparison',
        note: `${phrase.en} は the same と対応して比較対象を示します。OをCとして扱う as ではありません。`,
      }
    }
    if (phrase.role === 'C') {
      return {
        kind: 'as-complement',
        note: `${phrase.en} は前のO・受動文の主語を何として扱うか示す補語Cです。比較のasではありません。`,
      }
    }
    return {
      kind: 'as-viewpoint',
      note: `${phrase.en} は「〜として／〜という観点では」を足すMです。OをCとする補語や同等比較とは区別します。`,
    }
  }
  return null
}

function prepositionWhGrammarCue(phrases, index) {
  const phrase = phrases[index]
  const key = reviewedPhraseKey(phrase.en)
  const match = key.match(/^(by|from|about|in|through|on|over) (what|which|whether|how)$/)
  if (!match) return null
  const [, preposition, whWord] = match
  const next = phrases[index + 1]

  if ((preposition === 'by' || preposition === 'from') && whWord === 'what') {
    return {
      kind: 'fused-relative',
      note: `${phrase.en} の what は先行詞を含む関係詞で「〜するもの・こと」を表します。後ろの ${next?.en ?? '語句'} から始まる節全体が前置詞 ${preposition} の目的語です。`,
    }
  }
  if ((preposition === 'in' || preposition === 'through') && whWord === 'which') {
    const antecedent = nearestAntecedent(phrases, index)
    return {
      kind: 'preposition-relative',
      note: `${phrase.en} の which は ${antecedent} を先行詞に取る関係代名詞で、${preposition} の目的語です。後ろのS→Vを含む関係詞節全体が先行詞を説明します。`,
    }
  }
  const questionType = whWord === 'whether'
    ? '〜かどうか'
    : whWord === 'how'
      ? 'どのように'
      : whWord === 'which'
        ? 'どれ・どの〜'
        : '何を・何が'
  return {
    kind: 'preposition-embedded-question',
    note: `${phrase.en} は前置詞 ${preposition} と間接疑問の入口 ${whWord} を一緒に読みます。後ろの節全体が「${questionType}」という前置詞の対象・内容になります。`,
  }
}

function negativeFocusGrammarCue(phrases, index, sentenceEn) {
  const phrase = phrases[index]
  const key = reviewedPhraseKey(phrase.en)
  const next = phrases[index + 1]
  if (key === 'even') {
    return {
      kind: 'focus',
      note: `even は直後の ${next?.en ?? '語句'}（${next?.role ?? '次の要素'}）を焦点化し、「〜でさえ／〜も」と予想外の例を加えます。`,
    }
  }
  if (key === 'even though') {
    return {
      kind: 'focus-clause',
      note: `${phrase.en} は後ろの事実をいったん認めながら、主節では予想と逆の結果を示す譲歩節の入口です。「〜にもかかわらず」と読み、時の even when とは区別します。`,
    }
  }
  if (key === 'even when') {
    return {
      kind: 'focus-clause',
      note: `${phrase.en} は後ろのS→Vから成る時の節全体を「〜のときでさえ」と焦点化する入口です。`,
    }
  }
  if (key === 'only') {
    return {
      kind: 'focus',
      note: `only は直後の ${next?.en ?? '語句'}（${next?.role ?? '次の要素'}）だけに範囲を限定します。限定の意味を後続フレーズで重ねません。`,
    }
  }
  if (key === 'no longer') {
    const followingVerb = phrases.slice(index + 1).find((item) => item.role === 'V')
    return {
      kind: 'negative-focus',
      note: `英語では no longer が後続の ${followingVerb?.en ?? 'V'} の継続を否定します。日本語では「もはや」をここで置き、否定形「〜ない」は述語 ${followingVerb?.en ?? 'V'} で一度だけ完成させます。`,
    }
  }
  if (key === 'not by') {
    return {
      kind: 'negative-focus',
      note: `not by は後ろの内容を「評価基準ではない」と否定します。後続の but by / but 側へ本当の基準を対比させます。`,
    }
  }
  if (key === 'not') {
    const target = next?.en ?? '後ろの動作・要素'
    if (sentenceEn === 'A reading test captures some forms of comprehension, for example, but not every capacity that makes someone a thoughtful reader.') {
      return {
        kind: 'negative-focus',
        note: 'not every は「すべてではない」という部分否定です。some forms of comprehension は捉える一方、every capacity のすべてまでは捉えない、という目的語の範囲対比を作ります。',
        focusBinding: Object.freeze({
          type: 'partial-negation',
          scope: 'every capacity that makes someone a thoughtful reader',
          contrast: 'some forms of comprehension',
          governor: 'captures',
        }),
      }
    }
    return {
      kind: 'negative-focus',
      note: `not は直後の ${target} だけを否定します。否定はこのフレーズが担い、後続Vは肯定の語義で一度だけ訳します。`,
    }
  }
  if (key.startsWith('none of ')) {
    const followingVerb = phrases.slice(index + 1).find((item) => item.role === 'V')
    return {
      kind: 'negative-quantifier',
      note: `${phrase.en} は英語文法上「どれ一つ〜ない」という否定数量の主語Sです。日本語では「どれも」と置き、否定形「〜ない」は後続の述語 ${followingVerb?.en ?? 'V'} で一度だけ完成させます。`,
    }
  }
  if (key === 'neither') {
    const nor = phrases.slice(index + 1).find((item) => reviewedPhraseKey(item.en) === 'nor')
    const followingVerb = phrases.slice(index + 1).find((item) => item.role === 'V')
    if (!nor) {
      return {
        kind: 'negative-quantifier',
        note: `この neither は英語文法上「どちらも〜ない」という否定数量の主語Sです。日本語では「どちらも」と置き、否定形「〜ない」は後続の述語 ${followingVerb?.en ?? 'V'} で一度だけ完成させます。`,
      }
    }
    return {
      kind: 'negative-correlative',
      note: `neither は ${nor?.en ?? 'nor'} と呼応し、二つの候補を「どちらも〜ない」とまとめます。否定は相関表現が担い、${followingVerb?.en ?? '後続V'} で重ねません。`,
    }
  }
  return null
}

const PUNCTUATION_BOUNDARY_NOTES = new Map([
  [
    'Such observations do not replace scientific data; they reveal where additional measurement is needed.|||;',
    'セミコロンで前節を閉じ、they reveal ... という新しい独立節へ進みます。後節は「科学データの代わりではなく、追加測定の必要箇所を示す」という前節の補足・対照です。',
  ],
  [
    'Preservation, therefore, is not merely the retention of data; it includes maintaining the pathways that make data intelligible and discoverable.|||;',
    'セミコロンで前節を閉じ、it includes ... という新しい独立節へ進みます。後節は preservation の中身を具体化します。',
  ],
  [
    'A photograph may reveal suffering to one group and national achievement to another; a monument may be seen as heritage by some and as exclusion by others.|||;',
    'セミコロンで写真の例を閉じ、a monument から始まる新しい独立節へ進みます。後節は同じ主張を別の具体例で並べます。',
  ],
  [
    'Responsible readers are not people who doubt everything; they are people who match their confidence to the quality of the evidence.|||;',
    'セミコロンで否定側の定義を閉じ、they are ... という新しい独立節へ進みます。後節が責任ある読み手の肯定的な定義を示します。',
  ],
  [
    'For these users, refusing cash does more than remove a familiar habit; it can limit access to food, transport, and public life.|||;',
    'セミコロンで前節を閉じ、it can limit ... という新しい独立節へ進みます。後節は「習慣以上の問題」の具体的な結果を説明します。',
  ],
  [
    'Narrative evidence and interviews can explain why behavior changed; they do not eliminate the need for measurement.|||;',
    'セミコロンで前節を閉じ、they do not eliminate ... という新しい独立節へ進みます。後節は前節の効用に対する限界を示します。',
  ],
  [
    'The measurement process should therefore remain visible; its assumptions, revisions, and uncertainties should be open to challenge.|||;',
    'セミコロンで前節を閉じ、its assumptions ... という新しい独立節へ進みます。後節は remain visible の具体的な内容を説明します。',
  ],
  [
    'This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.|||:',
    'コロンで前の maladaptation という名称を受け、an attempt ... から始まる新しい独立節へ進みます。後節全体が maladaptation の具体的な中身を説明します。',
  ],
])

function punctuationBoundaryGrammarCue(phrases, index, sentenceEn) {
  for (const mark of [';', ':']) {
    const markerIndex = sentenceEn.indexOf(mark)
    if (markerIndex < 0) continue
    const wordsBeforeBoundary = words(sentenceEn.slice(0, markerIndex)).length
    const wordsBeforePhrase = phrases.slice(0, index)
      .reduce((count, item) => count + words(item.spokenEn ?? item.en).length, 0)
    if (wordsBeforePhrase !== wordsBeforeBoundary) continue
    const note = PUNCTUATION_BOUNDARY_NOTES.get(`${sentenceEn}|||${mark}`)
    if (!note) return null
    return {
      kind: mark === ';' ? 'semicolon-boundary' : 'colon-boundary',
      note,
      displayPrefix: `${mark} `,
    }
  }
  return null
}

function appositionGrammarCue(phrase, sentenceEn) {
  if (
    sentenceEn === 'Their greatest value may be that they turn a private problem, a broken object, into a public lesson about waste, skills, and responsibility.' &&
    reviewedPhraseKey(phrase.en) === 'a broken object'
  ) {
    return {
      kind: 'apposition',
      note: 'a broken object は直前の a private problem を言い換える同格挿入で、turn が別々の二目的語を取る形ではありません。',
    }
  }
  return null
}

const ZERO_RELATIVE_CONTEXTS = new Map([
  [
    'The museum has also changed the way it prepares labels for new displays.|||it',
    {
      antecedent: 'the way',
      gapRole: '方法を示す関係副詞 that / in which',
      returnTo: 'changed の目的語 the way',
      note: 'the way の後ろでは関係語 that / in which が省略されています。it prepares ... が「博物館が説明文を準備する方法」を限定し、節を読み終えたら changed の目的語 the way へ戻ります。',
    },
  ],
  [
    'The students also record the questions visitors ask most often, and the museum uses this feedback when planning future exhibitions.|||visitors',
    {
      antecedent: 'the questions',
      gapRole: 'ask の目的語O',
      returnTo: 'record の目的語 the questions',
      note: 'the questions の後ろで目的格関係代名詞 that / which が省略されています。visitors ask の目的語の空所が questions を受け、関係詞節後は record の目的語へ戻ります。',
    },
  ],
  [
    'Modern institutions measure almost everything they hope to improve in complex systems with competing public purposes.|||they',
    {
      antecedent: 'almost everything',
      gapRole: 'to improve の目的語O',
      returnTo: 'measure の目的語 almost everything',
      note: 'almost everything の後ろで目的格関係代名詞 that が省略されています。they hope to improve の目的語の空所が everything を受け、節全体が measure の目的語を限定します。',
    },
  ],
  [
    'Evaluation systems must be adaptive because the behavior they observe changes in response to observation.|||they',
    {
      antecedent: 'the behavior',
      gapRole: 'observe の目的語O',
      returnTo: 'changes の主語 the behavior',
      note: 'the behavior の後ろで目的格関係代名詞 that が省略されています。they observe は behavior を限定する挿入関係詞節で、読み終えたら理由節の主語 the behavior に戻り、主節V changes へ進みます。',
    },
  ],
  [
    'Those who design indicators should therefore be answerable for their consequences, including the administrative labor they create.|||they',
    {
      antecedent: 'the administrative labor',
      gapRole: 'create の目的語O',
      returnTo: 'including の対象 labor',
      note: 'the administrative labor の後ろで目的格関係代名詞 that が省略されています。they create の目的語の空所が labor を受け、節全体が including の対象を限定します。',
    },
  ],
])

function zeroRelativeGrammarCue(phrase, sentenceEn) {
  const details = ZERO_RELATIVE_CONTEXTS.get(`${sentenceEn}|||${reviewedPhraseKey(phrase.en)}`)
  if (!details) return null
  return {
    kind: 'zero-relative',
    note: details.note,
    zeroRelativeBinding: Object.freeze(Object.fromEntries(
      Object.entries(details).filter(([key]) => key !== 'note'),
    )),
  }
}

const SVOC_CONSTRUCTION_CONTEXTS = new Map([
  [
    'The students used this advice to plan a second garden, which made the project continue beyond one school term.|||made',
    { type: 'make-o-bare-v', object: 'the project', complement: 'continue', note: 'made the project continue は make O do の使役SVOCです。the project が意味上の主語となり、continue は to を付けない原形動詞Vです。' },
  ],
  [
    'Even a small design choice may make public services more unequal.|||may make',
    { type: 'make-o-c', object: 'public services', complement: 'more unequal', note: 'make public services more unequal は make O C で、public services を more unequal な状態にする関係です。' },
  ],
  [
    'This cooperation made families more willing to try the new schedule for a full year.|||made',
    { type: 'make-o-c', object: 'families', complement: 'more willing', note: 'made families more willing は make O C で、families を more willing な状態にします。後続 to try ... は willing の具体的内容です。' },
  ],
  [
    'A reading test captures some forms of comprehension, for example, but not every capacity that makes someone a thoughtful reader.|||makes',
    { type: 'make-o-c', object: 'someone', complement: 'a thoughtful reader', note: 'makes someone a thoughtful reader は make O C で、someone を a thoughtful reader にする関係です。' },
  ],
  [
    'Missed medical appointments could indicate irresponsibility, but interviews might reveal that a new transport schedule made the clinic inaccessible.|||made',
    { type: 'make-o-c', object: 'the clinic', complement: 'inaccessible', note: 'made the clinic inaccessible は make O C で、the clinic を inaccessible な状態にしたという内容です。' },
  ],
  [
    'The program shows that learning about the past can help people build stronger relationships in the present.|||can help',
    { type: 'help-o-bare-v', object: 'people', complement: 'build', note: 'help people build は help O do で、people が build の意味上の主語です。build は to を付けない原形動詞Vです。' },
  ],
  [
    'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.|||will not prevent',
    { type: 'prevent-o-from-ing', object: 'societies', complement: 'from losing', note: 'prevent societies from losing は prevent O from -ing で、societies が losing の意味上の主語です。後続 their ability ... は losing の目的語です。' },
  ],
])

function svocConstructionGrammarCue(phrase, sentenceEn) {
  const details = SVOC_CONSTRUCTION_CONTEXTS.get(`${sentenceEn}|||${reviewedPhraseKey(phrase.en)}`)
  if (!details) return null
  return {
    kind: 'svoc-construction',
    note: details.note,
    constructionBinding: Object.freeze(Object.fromEntries(
      Object.entries(details).filter(([key]) => key !== 'note'),
    )),
  }
}

const VERBAL_ING_FORMS = new Set([
  'adding', 'answering', 'arriving', 'asking', 'assessing', 'being', 'building',
  'buying', 'changing', 'choosing', 'comparing', 'competing', 'confronting',
  'deleting', 'demanding', 'describing', 'disappearing', 'doing', 'encouraging',
  'explaining', 'extending', 'feeling', 'finding', 'forcing', 'forgetting',
  'giving', 'harming', 'hiding', 'ignoring', 'improving', 'including',
  'installing', 'introducing', 'keeping', 'learning', 'leaving', 'limiting',
  'linking', 'losing', 'maintaining', 'making', 'neglecting', 'offering',
  'planning', 'planting', 'producing', 'protecting', 'publishing', 'pushing',
  'reaching', 'recording', 'reducing', 'refusing', 'removing', 'setting',
  'stating', 'sustaining', 'training', 'traveling', 'treating', 'turning',
  'using', 'walking', 'working',
])

const ING_CONTEXT_OVERRIDES = new Map([
  [
    'The students also record the questions visitors ask most often, and the museum uses this feedback when planning future exhibitions.|||when planning',
    { type: 'reduced-adverbial', governor: 'when (the museum is) planning', semanticSubject: 'the museum', note: 'when planning は when the museum is planning の主語 the museum とbe動詞を省いた時の副詞節です。planning は動名詞主語や主節Vではありません。' },
  ],
  [
    'Some libraries now use quiet air-control systems that keep rooms comfortable while using less energy than older equipment.|||using',
    { type: 'reduced-adverbial', governor: 'while (the systems are) using', semanticSubject: 'quiet air-control systems / that', note: 'while using は while the systems are using ... の主語＋be動詞を省いた同時進行節です。意味上の主語は関係詞thatが受ける quiet air-control systems です。' },
  ],
  [
    'For instance, building higher concrete walls along a river may reduce flooding in one district while pushing water toward a poorer neighborhood downstream.|||pushing',
    { type: 'reduced-adverbial', governor: 'while pushing', semanticSubject: 'building walls という施策の実行', note: 'while pushing は「壁を建てる施策が同時に水を押しやる」という省略副詞節です。主節S building ... の実行主体・作用を共有します。' },
  ],
  [
    "A warning label without a visible chain of reasoning may suppress circulation while doing little to strengthen citizens' judgment.|||doing little to strengthen",
    { type: 'reduced-adverbial', governor: 'while (a warning label is) doing', semanticSubject: 'A warning label', note: 'while doing ... は主語 A warning label とbe動詞を省いた同時・対比の副詞節です。「拡散を抑える一方、判断力強化にはほとんど役立たない」とつながります。' },
  ],
  [
    'Some governments therefore require essential businesses to accept cash while encouraging digital innovation elsewhere.|||encouraging',
    { type: 'reduced-adverbial', governor: 'while (governments are) encouraging', semanticSubject: 'Some governments', note: 'while encouraging は主語 Some governments とbe動詞を省いた同時進行節です。essential businesses が encouraging の主語ではありません。' },
  ],
  [
    'It should be to preserve meaningful alternatives while removing barriers that prevent people from choosing freely.|||removing',
    { type: 'reduced-adverbial', governor: 'while removing', semanticSubject: '目標を実行する主体', note: 'while removing は「選択肢を保つ一方で障壁を取り除く」という同時進行です。意味上の主語は goal を実行する主体で、形式主語Itを補う構文ではありません。' },
  ],
  [
    'A dashboard can appear open while hiding decisions about definitions, missing cases, statistical adjustments, and acceptable thresholds.|||hiding',
    { type: 'reduced-adverbial', governor: 'while (a dashboard is) hiding', semanticSubject: 'A dashboard', note: 'while hiding は主語 A dashboard とbe動詞を省いた対比の副詞節です。「開かれているように見えながら、決定を隠す」とつながります。' },
  ],
  [
    'Many teenagers arrive at school feeling tired, even when they try to go to bed at a reasonable time.|||feeling tired',
    { type: 'supplementary-participle', governor: 'arrive', semanticSubject: 'Many teenagers', note: 'feeling tired は arrive と同時の teenagers の状態を補足する現在分詞句です。文の主語や進行形ではありません。' },
  ],
  [
    'For example, the records may show that a species is arriving earlier in spring or disappearing from certain neighborhoods.|||is arriving',
    { type: 'progressive', governor: 'is', semanticSubject: 'a species', note: 'is arriving は be動詞＋現在分詞の進行形Vで、a species の変化を示します。後ろの disappearing と is を共有します。' },
  ],
  [
    'For example, the records may show that a species is arriving earlier in spring or disappearing from certain neighborhoods.|||disappearing',
    { type: 'shared-progressive', governor: '(is) disappearing', semanticSubject: 'a species', note: 'disappearing は前の is arriving と主語 a species・be動詞 is を共有する二つ目の進行形Vです。省略されたisは構造上だけ補います。' },
  ],
  [
    'They check maps, prepare simple worksheets, and practice explaining the displays in easy words.|||explaining',
    { type: 'gerund-complement', governor: 'practice', semanticSubject: 'They', note: 'explaining ... は practice の目的内容となる動名詞句です。「説明する練習をする」とつながり、進行形ではありません。' },
  ],
  [
    'Older residents may know how older machines were built, while younger participants may be more comfortable finding digital information.|||finding',
    { type: 'adjective-complement', governor: 'comfortable', semanticSubject: 'younger participants', note: 'finding ... は形容詞 comfortable の具体的内容を補い、「デジタル情報を見つけることに抵抗が少ない」とつながる動名詞句です。' },
  ],
  [
    'Preservation, therefore, is not merely the retention of data; it includes maintaining the pathways that make data intelligible and discoverable.|||maintaining',
    { type: 'gerund-complement', governor: 'includes', semanticSubject: 'preservation の実行主体', note: 'maintaining ... は includes の目的内容となる動名詞句で、保存に含まれる行為を示します。進行形ではありません。' },
  ],
  [
    'The students suggested offering two plate sizes at the start of lunch.|||offering',
    { type: 'gerund-complement', governor: 'suggested', semanticSubject: '提案を実行する主体', note: 'offering ... は suggested の目的内容となる動名詞句で、「二種類を提供することを提案した」とつながります。' },
  ],
  [
    'Nor should inclusion mean forcing everyone into a system simply because institutions find it efficient.|||forcing',
    { type: 'gerund-complement', governor: 'mean', semanticSubject: '制度を設計する主体', note: 'forcing ... は mean の内容を示す動名詞句で、「包摂が全員を一つの仕組みに強制することを意味する」とつながります。' },
  ],
  [
    'This small difference can reduce stress, especially for elderly passengers or parents traveling with children.|||especially for elderly passengers or parents traveling',
    { type: 'postpositive-participle', governor: 'parents', semanticSubject: 'parents', note: 'traveling with children は parents を後ろから限定する現在分詞句です。「子ども連れで移動している親」となり、主節S This small difference の動作ではありません。' },
  ],
  [
    'It should be to preserve meaningful alternatives while removing barriers that prevent people from choosing freely.|||from choosing',
    { type: 'preposition-gerund', governor: 'prevent people from', semanticSubject: 'people', note: 'from choosing は prevent people from -ing の動名詞句で、choosing の意味上の主語は people です。関係代名詞 that が受ける barriers ではありません。' },
  ],
  [
    'A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.|||neglecting',
    { type: 'reduced-adverbial', governor: 'while (a school is) neglecting', semanticSubject: 'A school', note: 'while neglecting は主語 A school とbe動詞を省いた対比の副詞節です。tested skills の後置修飾ではありません。' },
  ],
  [
    'Without records, leaders may celebrate a program’s intentions while ignoring evidence that it repeatedly fails particular communities.|||ignoring',
    { type: 'reduced-adverbial', governor: 'while (leaders are) ignoring', semanticSubject: 'leaders', note: 'while ignoring は主語 leaders とbe動詞を省いた対比の副詞節です。intentions の後置修飾ではありません。' },
  ],
  [
    'There is also a political question about who bears the burden of being measured.|||the burden of being measured',
    { type: 'passive-gerund', governor: 'of', semanticSubject: 'who / people who bear the burden', note: 'being measured は of の目的語となる受動動名詞で、「測定されること」を表します。進行形ではありません。' },
  ],
  [
    'Institutions can strengthen trust by publicly stating that limit because this prevents precision from being mistaken for certainty.|||from being mistaken for certainty',
    { type: 'passive-gerund', governor: 'prevents precision from', semanticSubject: 'precision', note: 'being mistaken は from の後ろの受動動名詞で、precision が certainty と取り違えられることを表します。進行形ではありません。' },
  ],
  [
    'When it remains one disciplined source of evidence among others, measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value over time.|||across changing circumstances',
    { type: 'attributive-participle', governor: 'circumstances', semanticSubject: 'circumstances', note: 'changing は直後の名詞 circumstances を限定する形容詞的な現在分詞です。「変化する状況」と読み、learning/accountability の後置修飾や measurement の動作ではありません。' },
  ],
  [
    'When it remains one disciplined source of evidence among others, measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value over time.|||competing interpretations',
    { type: 'attributive-participle', governor: 'interpretations', semanticSubject: 'interpretations', note: 'competing は直後の名詞 interpretations を限定する形容詞的な現在分詞です。「対立する解釈」と読み、measurement の動作ではありません。' },
  ],
  [
    'Sometimes a product is badly damaged, but in other cases only a small part has stopped working.|||has stopped working',
    { type: 'gerund-complement', governor: 'stopped', semanticSubject: 'only a small part', note: 'working は stopped の目的内容となる動名詞で、「小さな部分が機能することをやめた」とつながります。進行形ではありません。' },
  ],
  [
    'They learned that certain flowers attract insects that eat garden pests without harming the vegetables.|||without harming',
    { type: 'preposition-gerund', governor: 'without', semanticSubject: 'insects（関係代名詞thatが受ける先行詞）', note: 'harming は前置詞 without の目的語となる動名詞です。意味上の主語は関係代名詞 that が受ける insects で、「虫が野菜を害さずに」とつながります。' },
  ],
  [
    'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.|||from losing',
    { type: 'preposition-gerund', governor: 'prevent societies from', semanticSubject: 'societies', note: 'from losing は prevent societies from -ing の動名詞句で、losing の意味上の主語は societies です。主節S perfect archives ではありません。' },
  ],
  [
    'Yet smaller investments, such as training neighborhood volunteers or improving warning messages in several languages, may save more lives during an emergency.|||training',
    { type: 'gerund-example', governor: 'such as', semanticSubject: '地域の施策を実行する主体', note: 'training ... は such as が smaller investments の例として挙げる動名詞句です。文の主節Vではなく、「住民ボランティアを訓練すること」という一つ目の例です。' },
  ],
  [
    'Yet smaller investments, such as training neighborhood volunteers or improving warning messages in several languages, may save more lives during an emergency.|||improving',
    { type: 'gerund-example', governor: 'such as', semanticSubject: '地域の施策を実行する主体', note: 'improving ... は such as が挙げる二つ目の動名詞例で、training ... と or で並びます。文の主節Vではありません。' },
  ],
  [
    'The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.|||stating',
    { type: 'preposition-gerund', governor: 'lies in', semanticSubject: '規律を実践する主体', note: 'stating ... は前置詞 in を共有する三つ目の動名詞内容で、explaining / confronting / stating の列挙を完成させます。The discipline の直接述語ではありません。' },
  ],
  [
    'Instead of simply giving the food away, the students visited the center and explained how they had grown it.|||giving',
    { type: 'preposition-gerund', governor: 'instead of', semanticSubject: 'the students', note: 'giving ... は instead of の目的語となる動名詞で、意味上の主語は the students です。「ただ食べ物を渡してしまう代わりに」とつながります。' },
  ],
  [
    'This approach is more useful than giving visitors information that may be incorrect.|||giving',
    { type: 'comparison-gerund', governor: 'than', semanticSubject: '情報を与える不特定の案内者', note: 'giving ... は than の後ろで This approach と比較される行為を作る動名詞です。This approach 自体が情報を与える意味上の主語ではありません。' },
  ],
  [
    'Because buying a new item is often easier than finding someone to fix the old one, usable products become waste.|||than finding',
    { type: 'comparison-gerund', governor: 'than', semanticSubject: '修理人を探す人', note: 'finding ... は than の後ろで buying ... と比較される別の動名詞行為です。buying という行為が finding の主語になるわけではありません。' },
  ],
  [
    'Visitors are expected to sit with volunteers and take part in the work instead of simply leaving an item at a counter.|||leaving',
    { type: 'preposition-gerund', governor: 'instead of', semanticSubject: 'Visitors', note: 'leaving ... は instead of の目的語となる動名詞で、意味上の主語は Visitors です。「品を置いて立ち去るだけでなく」とつながります。' },
  ],
  [
    'They provide shade, absorb rainwater, improve air quality, and make streets more pleasant for walking.|||for walking',
    { type: 'preposition-gerund', governor: 'for', semanticSubject: '通りを歩く一般の利用者', note: 'walking は前置詞 for の目的語となる動名詞で、「歩くのに快適な通り」とつながります。歩く主体は trees / They ではなく、通りの一般利用者です。' },
  ],
  [
    'Setting review dates and publishing results allows governments to revise policies without treating revision as failure.|||treating',
    { type: 'preposition-gerund', governor: 'without', semanticSubject: 'governments', note: 'treating ... は without の目的語となる動名詞で、意味上の主語は governments です。publishing が treating の主語ではありません。' },
  ],
  [
    'More subtly, platforms can revise the categories and rankings through which users encounter material without deleting a single record.|||without deleting',
    { type: 'preposition-gerund', governor: 'without', semanticSubject: 'platforms', note: 'deleting ... は without の目的語となる動名詞で、意味上の主語は platforms です。関係詞節内の users ではありません。' },
  ],
  [
    'Rather, a mature society keeps multiple perspectives in conversation while refusing to treat evidence as optional.|||while refusing',
    { type: 'reduced-adverbial', governor: 'while (a mature society is) refusing', semanticSubject: 'a mature society', note: 'while refusing ... は主語 a mature society とbe動詞を省いた同時進行節です。前置詞 in の目的語となる動名詞ではありません。' },
  ],
  [
    'Education plays a central role in sustaining that discipline, but the task is more demanding than adding a few historical dates to a curriculum.|||than adding',
    { type: 'comparison-gerund', governor: 'than', semanticSubject: '日付を加える教育実践者', note: 'adding ... は than の後ろで the task と比較される行為を作る動名詞です。the task 自体が日付を加える意味上の主語ではありません。' },
  ],
  [
    'The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.|||in explaining',
    { type: 'preposition-gerund', governor: 'lies in', semanticSubject: '規律を実践する主体', note: 'explaining ... は lies in の前置詞 in が取る一つ目の動名詞内容です。規律を実践する人が行う動作です。' },
  ],
  [
    'The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.|||confronting',
    { type: 'preposition-gerund', governor: 'lies in', semanticSubject: '規律を実践する主体', note: 'confronting ... は in を共有する二つ目の動名詞内容で、explaining と stating の間に並びます。' },
  ],
  [
    'At the same time, they need intellectual habits that prevent skepticism from turning into cynicism.|||from turning',
    { type: 'preposition-gerund', governor: 'prevent skepticism from', semanticSubject: 'skepticism', note: 'turning ... は prevent skepticism from -ing の動名詞で、意味上の主語は skepticism です。関係代名詞 that が受ける habits ではありません。' },
  ],
  [
    'A science class decided to study the problem instead of simply asking everyone to eat more.|||asking',
    { type: 'preposition-gerund', governor: 'instead of', semanticSubject: 'A science class', note: 'asking ... は instead of の目的語となる動名詞で、意味上の主語は A science class です。' },
  ],
  [
    'Careful changes are more useful than keeping an old schedule simply because it is familiar, especially when schools review them regularly.|||than keeping',
    { type: 'comparison-gerund', governor: 'than', semanticSubject: '学校など予定を決める主体', note: 'keeping ... は than の後ろで Careful changes と比較される行為を作る動名詞です。Careful changes 自体が予定を維持する主語ではありません。' },
  ],
  [
    'The partnership also shows that useful science depends on recording uncertainty as honestly as discovery.|||on recording',
    { type: 'preposition-gerund', governor: 'depends on', semanticSubject: '研究者・参加者', note: 'recording ... は depends on の前置詞 on が取る動名詞内容です。記録する主体は useful science そのものではなく、研究者・参加者です。' },
  ],
  [
    'Those who design indicators should therefore be answerable for their consequences, including the administrative labor they create.|||including',
    { type: 'additive-participle-marker', governor: 'their consequences', semanticSubject: '追加される例 the administrative labor', note: 'including は consequences の具体例を追加する分詞・前置詞的な標識です。動名詞でも、for の目的語でもありません。' },
  ],
])

function ingGrammarCue(phrases, index, sentenceEn) {
  const phrase = phrases[index]
  const key = reviewedPhraseKey(phrase.en)
  const tokens = key.split(' ')
  const ingWord = tokens.find((token) => VERBAL_ING_FORMS.has(token))
  if (!ingWord) return null
  if (
    /^(?:working hours|tea drinking|the building|a warning label|warning messages|more demanding)$/.test(key) ||
    /\b(?:clear training|genuine learning|both learning and democratic accountability)\b/.test(key) ||
    /(?:apartment building)$/.test(key) ||
    REDUCED_RELATIVE_CONTEXTS.has(`${sentenceEn}|||${key}`)
  ) return null
  const override = ING_CONTEXT_OVERRIDES.get(`${sentenceEn}|||${key}`)
  if (override) {
    return {
      kind: 'ing-function',
      note: override.note,
      ingBinding: Object.freeze(Object.fromEntries(
        Object.entries(override).filter(([field]) => field !== 'note'),
      )),
    }
  }
  const first = tokens[0]
  const nearestSubject = [...phrases.slice(0, index)].reverse().find((item) => item.role === 'S')
  const previous = phrases[index - 1]
  const priorTwo = phrases.slice(Math.max(0, index - 2), index)
  const prepositionPhrase = [...priorTwo, phrase].find((item) =>
    /^(?:after|before|by|for|from|in|instead of|on|than|through|without)(?:\b|$)/.test(reviewedPhraseKey(item.en)))
  let details
  if (phrase.role === 'S' && VERBAL_ING_FORMS.has(first)) {
    const followingVerb = phrases.slice(index + 1).find((item) => item.role === 'V')
    details = {
      type: 'gerund-subject',
      governor: followingVerb?.en ?? '後続のV',
      semanticSubject: '動名詞句全体',
      note: `${phrase.en} は進行形ではなく、行為を名詞化した動名詞句の先頭です。後ろの目的語・修飾語までをまとめた行為全体が ${followingVerb?.en ?? '後続V'} の主語Sになります。`,
    }
  } else if (/\b(?:am|are|is|was|were|be|been|being)\b/.test(key)) {
    details = {
      type: 'progressive',
      governor: key.match(/\b(?:am|are|is|was|were|be|been|being)\b/)?.[0] ?? 'be',
      semanticSubject: nearestSubject?.en ?? '同じ節のS',
      note: `${phrase.en} はbe動詞＋現在分詞から成る進行形Vで、${nearestSubject?.en ?? '同じ節のS'} の進行中の動作を示します。`,
    }
  } else if (prepositionPhrase) {
    const preposition = reviewedPhraseKey(prepositionPhrase.en).match(/^(?:after|before|by|for|from|in|instead of|on|than|through|without)/)?.[0]
    details = {
      type: 'preposition-gerund',
      governor: preposition ?? prepositionPhrase.en,
      semanticSubject: nearestSubject?.en ?? '文脈上の主体',
      note: `${ingWord} は前置詞 ${preposition ?? prepositionPhrase.en} の後ろで行為を名詞化する動名詞です。${nearestSubject?.en ?? '文脈上の主体'} を意味上の主語として、前置詞句全体を作ります。`,
    }
  } else if (phrase.role === 'M') {
    details = {
      type: 'supplementary-participle',
      governor: previous?.en ?? '直前の名詞・動作',
      semanticSubject: nearestSubject?.en ?? '直前の名詞',
      note: `${phrase.en} の ${ingWord} は現在分詞で、${previous?.en ?? '直前の名詞・動作'} を後ろから限定・補足します。動名詞主語や主節の進行形ではありません。`,
    }
  } else {
    const governor = [...phrases.slice(Math.max(0, index - 3), index)].reverse()
      .find((item) => item.role === 'V' || item.role === 'C' || item.role === 'LINK')
    details = {
      type: phrase.role === 'V' ? 'embedded-gerund-or-participle' : 'gerund',
      governor: governor?.en ?? '前の支配語',
      semanticSubject: nearestSubject?.en ?? '文脈上の主体',
      note: `${phrase.en} の ${ingWord} は ${governor?.en ?? '前の支配語'} のもとで働く-ing形です。ここでは行為内容・補足動作として読み、単独の主節Vや名詞の字面だけで判断しません。`,
    }
  }
  return {
    kind: 'ing-function',
    note: details.note,
    ingBinding: Object.freeze(Object.fromEntries(
      Object.entries(details).filter(([field]) => field !== 'note'),
    )),
  }
}

const REDUCED_RELATIVE_CONTEXTS = new Map([
  [
    'In response, communities in several countries have created local events called repair cafes.|||called repair cafes',
    { antecedent: 'local events', omitted: 'that are', voice: 'passive', note: 'called repair cafes は local events (that are) called repair cafes の関係代名詞＋be動詞を省いた受動の過去分詞後置修飾です。' },
  ],
  [
    'These surveys belong to a wider group of projects known as citizen science.|||known as citizen science',
    { antecedent: 'projects', omitted: 'that are', voice: 'passive', note: 'known as citizen science は projects (that are) known as ... の関係代名詞＋be動詞を省いた受動の過去分詞後置修飾です。' },
  ],
  [
    'The class then measured the amount of rice, vegetables, and bread left each day for two weeks.|||left each day',
    { antecedent: 'rice, vegetables, and bread', omitted: 'that was', voice: 'passive', note: 'left each day は rice, vegetables, and bread (that was) left each day の関係代名詞＋be動詞を省いた受動の過去分詞後置修飾です。' },
  ],
  [
    'Some people do not have a bank account, a suitable phone, reliable internet access, or the identity documents required to open a digital account.|||required',
    { antecedent: 'the identity documents', omitted: 'that are', voice: 'passive', note: 'required は the identity documents (that are) required ... の関係代名詞＋be動詞を省いた受動の過去分詞後置修飾です。' },
  ],
  [
    'Extending the life of a product reduces waste and lowers demand for the energy and resources required to make new goods.|||required',
    { antecedent: 'resources', omitted: 'that are', voice: 'passive', note: 'required は resources (that are) required ... の関係代名詞＋be動詞を省いた受動の過去分詞後置修飾です。' },
  ],
  [
    'One reason is that a measure designed for a single purpose can have unexpected consequences in another area.|||designed for a single purpose',
    { antecedent: 'a measure', omitted: 'that is', voice: 'passive', note: 'designed for a single purpose は a measure (that is) designed ... の関係代名詞＋be動詞を省いた受動の過去分詞後置修飾です。' },
  ],
  [
    'A narrow target may consequently punish the very risk taking required for genuine learning.|||required',
    { antecedent: 'the very risk taking', omitted: 'that is', voice: 'passive', note: 'required for genuine learning は risk taking (that is) required ... の関係代名詞＋be動詞を省いた受動の過去分詞後置修飾です。' },
  ],
  [
    'This civic dimension explains why collective memory cannot be measured only by the number of documents preserved or people reached.|||preserved',
    { antecedent: 'documents', omitted: 'that are', voice: 'passive', note: 'preserved は documents (that are) preserved の関係代名詞＋be動詞を省いた受動の過去分詞後置修飾です。' },
  ],
  [
    'This civic dimension explains why collective memory cannot be measured only by the number of documents preserved or people reached.|||reached',
    { antecedent: 'people', omitted: 'who are', voice: 'passive', note: 'reached は people (who are) reached の関係代名詞＋be動詞を省いた受動の過去分詞後置修飾です。' },
  ],
  [
    'Company funding does not automatically make research false, but readers should check whether the company sells the product being tested.|||the product being tested',
    { antecedent: 'the product', omitted: 'that is', voice: 'passive progressive', note: 'being tested は the product (that is) being tested の関係代名詞＋be動詞を省いた受動進行の後置修飾です。' },
  ],
])

function reducedRelativeGrammarCue(phrase, sentenceEn) {
  const details = REDUCED_RELATIVE_CONTEXTS.get(`${sentenceEn}|||${reviewedPhraseKey(phrase.en)}`)
  if (!details) return null
  return {
    kind: 'reduced-relative',
    note: details.note,
    reducedRelativeBinding: Object.freeze(Object.fromEntries(
      Object.entries(details).filter(([field]) => field !== 'note'),
    )),
  }
}

const STRUCTURAL_DISPLAY_CONTEXTS = new Map([
  ['Children can listen to stories, make small cards, and borrow books about the month\'s topic.|||make', { displayEn: '(can) make', sharedMarker: 'can', note: 'make は can listen と助動詞canを共有する二つ目の述語です。構造表示だけ (can) を補います。' }],
  ['Children can listen to stories, make small cards, and borrow books about the month\'s topic.|||borrow', { displayEn: '(can) borrow', sharedMarker: 'can', note: 'borrow は can listen と助動詞canを共有する三つ目の述語です。構造表示だけ (can) を補います。' }],
  ['Parents may help, but each child should write a name on the model and take it home at noon.|||take', { displayEn: '(should) take', sharedMarker: 'should', note: 'take は should write と助動詞shouldを共有する二つ目の述語です。構造表示だけ (should) を補います。' }],
  ['They had to choose a sunny place, remove stones from the soil, and water the young plants every day.|||remove', { displayEn: '(had to) remove', sharedMarker: 'had to', note: 'remove は had to choose と had to を共有する二つ目の述語です。構造表示だけ (had to) を補います。' }],
  ['They had to choose a sunny place, remove stones from the soil, and water the young plants every day.|||water', { displayEn: '(had to) water', sharedMarker: 'had to', note: 'water は had to choose と had to を共有する三つ目の述語です。構造表示だけ (had to) を補います。' }],
  ['Their science teacher asked each group to make a schedule and write short notes about the weather.|||write', { displayEn: '(to) write', sharedMarker: 'to', note: 'write は to make と共有toを持つ二つ目の不定詞動作です。構造表示では (to) write と補いますが、原文音声は write のままです。' }],
  ['They may not know the answer to every question, so they are taught to admit uncertainty and ask a staff member for help.|||ask', { displayEn: '(to) ask', sharedMarker: 'to', note: 'ask は to admit と共有toを持つ二つ目の不定詞動作です。構造表示だけ (to) を補い、音声には足しません。' }],
  ['Visitors are expected to sit with volunteers and take part in the work instead of simply leaving an item at a counter.|||take part', { displayEn: '(to) take part', sharedMarker: 'to', note: 'take part は to sit と共有toを持つ二つ目の不定詞動作です。構造表示だけ (to) を補い、音声には足しません。' }],
  ['A volunteer may show someone how to open a lamp safely, replace a worn wire, or search for instructions online.|||replace', { displayEn: '(how to) replace', sharedMarker: 'how to', note: 'replace は how to open と同じhow-to列の二つ目の動作です。構造表示だけ (how to) を補い、音声は replace のままです。' }],
  ['A volunteer may show someone how to open a lamp safely, replace a worn wire, or search for instructions online.|||search', { displayEn: '(how to) search', sharedMarker: 'how to', note: 'search は how to open と同じhow-to列の三つ目の動作です。構造表示だけ (how to) を補い、音声は search のままです。' }],
  ['This evidence makes it easier to improve a design or decide that a simpler solution would work better.|||decide', { displayEn: '(to) decide', sharedMarker: 'to', note: 'decide は to improve と共有toを持つ二つ目の不定詞動作です。構造表示だけ (to) を補い、音声は decide のままです。' }],
  ['Visitors may not notice the system at all, yet it affects how long they can read or study without becoming tired.|||study', { displayEn: '(can) study', sharedMarker: 'can', note: 'study は can read と助動詞canを共有する二つ目の述語です。構造表示だけ (can) を補います。' }],
  ['This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.|||deepen', { displayEn: '(can) deepen', sharedMarker: 'can', note: 'deepen は can create と助動詞canを共有する二つ目の述語です。構造表示だけ (can) を補い、音声は deepen のままです。' }],
  ['A park that cools a wealthy district, for example, may increase nearby rents and force lower-income residents to move before they enjoy the benefits.|||force', { displayEn: '(may) force', sharedMarker: 'may', note: 'force は may increase と助動詞mayを共有する二つ目の主節述語です。構造表示だけ (may) を補い、音声は force のままです。' }],
  ['A document can survive for centuries and still fail to influence how later generations understand the past.|||fail to influence', { displayEn: '(can) fail to influence', sharedMarker: 'can', note: 'fail to influence は can survive と助動詞canを共有する二つ目の述語です。直前の still はこのVを修飾します。構造表示だけ (can) を補い、音声は fail to influence のままです。' }],
  ['A file may still exist but become unreadable when software changes, while a searchable collection can effectively disappear if its indexing system is neglected.|||become', { displayEn: '(may) become', sharedMarker: 'may', note: 'become は may still exist と助動詞mayを共有する二つ目の述語です。構造表示だけ (may) を補います。' }],
  ['It also requires citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears.|||tolerate', { displayEn: '(to) tolerate', sharedMarker: 'to', note: 'tolerate は to read と共有toを持つ二つ目の willing の内容です。構造表示だけ (to) を補い、音声には足しません。' }],
  ['It also requires citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears.|||revise', { displayEn: '(to) revise', sharedMarker: 'to', note: 'revise は to read と共有toを持つ三つ目の willing の内容です。構造表示だけ (to) を補い、音声には足しません。' }],
  ['The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.|||confronting', { displayEn: '(in) confronting', sharedMarker: 'in', note: 'confronting は in explaining と前置詞inを共有する二つ目の動名詞内容Mです。構造表示だけ (in) を補い、音声は confronting のままです。' }],
  ['The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.|||stating', { displayEn: '(in) stating', sharedMarker: 'in', note: 'stating は in explaining と前置詞inを共有する三つ目の動名詞内容Mです。構造表示だけ (in) を補い、音声は stating のままです。' }],
  ['Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.|||recognize', { displayEn: '(to) recognize', sharedMarker: 'to', note: 'recognize は to question と共有toを持つ二つ目の目的不定詞で、can use と並列する主節述語ではありません。構造表示だけ (to) を補います。' }],
  ['Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.|||deliberate', { displayEn: '(to) deliberate', sharedMarker: 'to', note: 'deliberate は to question と共有toを持つ三つ目の目的不定詞です。構造表示だけ (to) を補い、音声には足しません。' }],
  ['Cash usually leaves no detailed record linking a person to a particular purchase, whereas digital payment creates data that may be stored, combined, or sold.|||combined', { displayEn: '(may be) combined', sharedMarker: 'may be', note: 'combined は may be stored と助動詞＋beを共有する二つ目の受動述語です。構造表示だけ (may be) を補います。' }],
  ['Cash usually leaves no detailed record linking a person to a particular purchase, whereas digital payment creates data that may be stored, combined, or sold.|||sold', { displayEn: '(may be) sold', sharedMarker: 'may be', note: 'sold は may be stored と助動詞＋beを共有する三つ目の受動述語です。構造表示だけ (may be) を補います。' }],
  ['Such records can detect fraud and improve services, yet they can also reveal medical needs, political interests, or daily movements.|||improve', { displayEn: '(can) improve', sharedMarker: 'can', note: 'improve は can detect と助動詞canを共有する二つ目の述語です。構造表示だけ (can) を補います。' }],
  ['A common response is to teach digital skills and provide low-cost accounts.|||provide', { displayEn: '(to) provide', sharedMarker: 'to', note: 'provide は主格補語C内の to teach と共有toを持つ二つ目の不定詞動作です。構造表示だけ (to) を補います。' }],
  ['A hospital may transfer difficult patients or redefine when the waiting-time clock officially starts.|||redefine', { displayEn: '(may) redefine', sharedMarker: 'may', note: 'redefine は may transfer と助動詞mayを共有する二つ目の述語です。構造表示だけ (may) を補います。' }],
  ['Researchers can then compare similar observations and estimate where the data may be incomplete.|||estimate', { displayEn: '(can) estimate', sharedMarker: 'can', note: 'estimate は can compare と助動詞canを共有する二つ目の述語です。構造表示だけ (can) を補います。' }],
  ['Together, they can follow changes in biodiversity and identify places that may need conservation.|||identify', { displayEn: '(can) identify', sharedMarker: 'can', note: 'identify は can follow と助動詞canを共有する二つ目の述語です。構造表示だけ (can) を補います。' }],
  ['They should direct attention toward patterns that require explanation, provide feedback for revision, and reveal whether policies serve their stated mission.|||provide', { displayEn: '(should) provide', sharedMarker: 'should', note: 'provide は主節の should direct と助動詞shouldを共有する二つ目の述語です。構造表示だけ (should) を補います。' }],
  ['They should direct attention toward patterns that require explanation, provide feedback for revision, and reveal whether policies serve their stated mission.|||reveal', { displayEn: '(should) reveal', sharedMarker: 'should', note: 'reveal は主節の should direct と助動詞shouldを共有する三つ目の述語です。構造表示だけ (should) を補います。' }],
  ['The program will teach simple traffic rules and show people how to prevent common bicycle accidents.|||show', { displayEn: '(will) show', sharedMarker: 'will', note: 'show は will teach と助動詞willを共有する二つ目の述語です。構造表示だけ (will) を補い、音声は show のままです。' }],
  ['Two historians may accept the same evidence yet assign different significance to it because they ask different questions.|||assign', { displayEn: '(may) assign', sharedMarker: 'may', note: 'assign は may accept と助動詞mayを共有する二つ目の述語です。構造表示だけ (may) を補い、音声は assign のままです。' }],
  ['For example, the records may show that a species is arriving earlier in spring or disappearing from certain neighborhoods.|||disappearing', { displayEn: '(is) disappearing', sharedMarker: 'is', note: 'disappearing は is arriving と主語 a species・be動詞isを共有する二つ目の進行形です。構造表示だけ (is) を補い、音声は disappearing のままです。' }],
  ['A community can then balance health benefits with local challenges and test whether its plan is effective.|||test', { displayEn: '(can) test', sharedMarker: 'can', note: 'test は can then balance と助動詞canを共有する二つ目の述語です。構造表示だけ (can) を補い、音声は test のままです。' }],
  ['Digital records can also help consumers follow their spending and allow small businesses to sell goods online.|||allow', { displayEn: '(can) allow', sharedMarker: 'can', note: 'allow は can also help と助動詞canを共有する二つ目の述語です。構造表示だけ (can) を補い、音声は allow のままです。' }],
  ['When a decision involves serious health risks, online reading should support, not replace, advice from a qualified professional.|||replace', { displayEn: '(should) replace', sharedMarker: 'should', note: 'replace は should support と助動詞shouldを共有する対照側の述語です。構造表示だけ (should) を補い、音声は replace のままです。' }],
  ['Once rewards or penalties depend heavily on the score, people have an incentive to optimize the proxy rather than pursue the underlying mission.|||pursue', { displayEn: '(to) pursue', sharedMarker: 'to', note: 'pursue は to optimize と共有toを持つ rather than 側の不定詞動作です。構造表示だけ (to) を補い、音声は pursue のままです。' }],
  ['If measurement increases surveillance below but accountability does not increase above, the system may weaken rather than strengthen legitimacy.|||strengthen', { displayEn: '(may) strengthen', sharedMarker: 'may', note: 'strengthen は may weaken と助動詞mayを共有する rather than 側の述語です。構造表示だけ (may) を補い、音声は strengthen のままです。' }],
  ['The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.|||rather than merely obey', { displayEn: 'rather than (can) merely obey', sharedMarker: 'can', note: 'obey は can examine と助動詞canを共有する rather than 側の述語です。構造表示だけ (can) を補い、音声は原文どおり rather than merely obey のままです。' }],
])

function structuralDisplayGrammarCue(phrase, sentenceEn) {
  const details = STRUCTURAL_DISPLAY_CONTEXTS.get(`${sentenceEn}|||${reviewedPhraseKey(phrase.en)}`)
  if (!details) return null
  return {
    kind: 'structural-restoration',
    note: details.note,
    structureDisplay: Object.freeze({
      displayEn: details.displayEn,
      sharedMarker: details.sharedMarker,
    }),
  }
}

const COORDINATION_CONTEXT_OVERRIDES = new Map([
  [
    'Citizen science is valuable not because volunteers replace professionals, but because the two groups contribute different strengths.|||1',
    {
      type: 'not-because-but-because-reasons',
      left: 'because volunteers replace professionals',
      right: 'because the two groups contribute different strengths',
      governor: 'is valuable',
      note: 'but は主節 is valuable にかかる二つの理由節を対照させます。not because A, but because B で、AではなくBが価値の理由です。replace の埋込み内容を並べる接続ではありません。',
    },
  ],
  [
    'A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.|||1',
    {
      type: 'object-list-under-gerund',
      left: 'discussion / curiosity',
      right: 'students whose improvement is unlikely to change its ranking',
      governor: 'neglecting',
      note: 'or は neglecting の三つの目的語、discussion・curiosity・students ... の最後の項を加えます。主節 may devote の目的語列ではありません。',
    },
  ],
  [
    'Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.|||1',
    {
      type: 'parallel-embedded-content',
      left: 'what to collect / how to describe it',
      right: 'which materials receive scarce conservation resources',
      governor: 'must decide',
      note: 'and は must decide が支配する三つの内容の最後を加えます。左側には what to collect と how to describe it の二項があり、右側の which materials ... と並びます。',
    },
  ],
  [
    'Critics sometimes conclude that quantification itself is the problem and that experienced professionals should simply be trusted to exercise judgment.|||1',
    {
      type: 'parallel-content-clauses',
      left: 'that quantification itself is the problem',
      right: 'that experienced professionals should simply be trusted to exercise judgment',
      governor: 'conclude',
      note: 'and は conclude の目的内容となる二つの that節を並列します。is の補語を結ぶのではなく、conclude that A and that B の構造です。',
    },
  ],
  [
    'For that reason, officials should explain clearly what kind of data is collected and how it will be protected.|||1',
    {
      type: 'parallel-embedded-questions',
      left: 'what kind of data is collected',
      right: 'how it will be protected',
      governor: 'should explain clearly',
      note: 'and は should explain clearly の二つの間接疑問内容、what kind of data ... と how it ... を並列します。is collected の述語に支配される形ではありません。',
    },
  ],
  [
    'However, planting trees is not a simple solution if maintenance money is limited or if sidewalks are too narrow for roots to grow safely.|||1',
    {
      type: 'parallel-condition-clauses',
      left: 'if maintenance money is limited',
      right: 'if sidewalks are too narrow for roots to grow safely',
      governor: 'planting trees is not a simple solution',
      note: 'or は主節 planting trees is not a simple solution が成り立つ二つのif条件を並列します。is limited を支配語とする埋込み内容ではありません。',
    },
  ],
  [
    'Readers still need to examine how the study was designed and whether other researchers found similar results.|||1',
    {
      type: 'parallel-embedded-questions',
      left: 'how the study was designed',
      right: 'whether other researchers found similar results',
      governor: 'need to examine',
      note: 'and は need to examine の二つの間接疑問内容、how the study ... と whether other researchers ... を並列します。was designed の述語に支配される形ではありません。',
    },
  ],
  [
    'The students began to understand how temperature, rain, and insects affected the vegetables.|||1',
    {
      type: 'compound-subject',
      left: 'temperature, rain',
      right: 'insects',
      governor: 'affected',
      note: 'and は temperature, rain に insects を最後の項として加え、三項から成る複合主語Sを作ります。三項すべてが affected の主語です。',
    },
  ],
  [
    'In some cases, a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service.|||1',
    {
      type: 'compound-subject',
      left: 'a simple repair to an old bus stop',
      right: 'a clearer sign',
      governor: 'may help',
      note: 'or は後置修飾 to an old bus stop を含む a simple repair 全体と a clearer sign を並列し、may help を共有する複合主語Sを作ります。左側にはまだ有限動詞がなく、新しい節の開始ではありません。',
    },
  ],
  [
    'Setting review dates and publishing results allows governments to revise policies without treating revision as failure.|||1',
    {
      type: 'compound-gerund-subject',
      left: 'Setting review dates',
      right: 'publishing results',
      governor: 'allows',
      note: 'and は Setting review dates と publishing results という二つの動名詞句を並列し、allows の複合主語Sを作ります。publishing から新しい独立節が始まる形ではありません。',
    },
  ],
  [
    "A project that performs well under today's conditions may be inadequate if migration, land use, or rainfall patterns change.|||1",
    {
      type: 'compound-subject',
      left: 'migration, land use',
      right: 'rainfall patterns',
      governor: 'change',
      note: 'or は migration, land use に rainfall patterns を最後の候補として加え、change を共有する三項の複合主語Sを作ります。',
    },
  ],
  [
    'When search results, short videos, and algorithmic recommendations compete for attention, materials that require slow reading or moral reflection may become almost invisible.|||1',
    {
      type: 'compound-subject',
      left: 'search results, short videos',
      right: 'algorithmic recommendations',
      governor: 'compete',
      note: 'and は search results, short videos に algorithmic recommendations を最後の項として加え、compete の複合主語Sを作ります。',
    },
  ],
  [
    'Libraries, museums, universities, and news organizations have traditionally claimed a degree of autonomy so that they can protect records from temporary political pressure.|||1',
    {
      type: 'compound-subject',
      left: 'Libraries, museums, universities',
      right: 'news organizations',
      governor: 'have traditionally claimed',
      note: 'and は Libraries, museums, universities に news organizations を最後の項として加え、have traditionally claimed を共有する四項の複合主語Sを作ります。',
    },
  ],
  [
    'Such changes can suggest that weather, food, or habitat conditions are affecting bird populations.|||1',
    {
      type: 'compound-subject',
      left: 'weather, food',
      right: 'habitat conditions',
      governor: 'are affecting',
      note: 'or は weather, food に habitat conditions を最後の候補として加え、are affecting の複合主語Sを作ります。',
    },
  ],
  [
    'Income, working hours, and social habits might influence both tea drinking and stress as well.|||1',
    {
      type: 'compound-subject',
      left: 'Income, working hours',
      right: 'social habits',
      governor: 'might influence',
      note: 'and は Income, working hours に social habits を最後の項として加え、might influence を共有する三項の複合主語Sを作ります。',
    },
  ],
  [
    'Independent review and a clear statement of possible conflicts make the evidence easier to evaluate.|||1',
    {
      type: 'compound-subject',
      left: 'Independent review',
      right: 'a clear statement of possible conflicts',
      governor: 'make',
      note: 'and は Independent review と a clear statement of possible conflicts を結び、make を共有する複合主語Sを作ります。',
    },
  ],
  [
    'City leaders therefore need to ask where a new system will have the greatest effect and who might be left out.|||1',
    {
      type: 'embedded-content',
      left: 'where a new system will have the greatest effect',
      right: 'who might be left out',
      governor: 'need to ask',
      note: 'and は need to ask に支配される二つの間接疑問、where a new system ... と who might ... を並列します。who は新しい主節の主語ではありません。',
    },
  ],
  [
    'A more resilient city therefore begins by assessing who is most vulnerable and which resources can serve several needs at once.|||1',
    {
      type: 'embedded-content',
      left: 'who is most vulnerable',
      right: 'which resources can serve several needs at once',
      governor: 'assessing',
      note: 'and は assessing の内容となる二つの間接疑問、who is ... と which resources ... を並列します。which resources は新しい主節ではありません。',
    },
  ],
  [
    'A careful reader first asks who produced the message and what evidence is actually available.|||1',
    {
      type: 'embedded-content',
      left: 'who produced the message',
      right: 'what evidence is actually available',
      governor: 'asks',
      note: 'and は asks の内容となる二つの間接疑問、who produced ... と what evidence ... を並列します。what evidence は新しい主節ではありません。',
    },
  ],
  [
    'Meaningful transparency explains why a measure was chosen, what it omits, how uncertainty was handled, and who can question its use.|||1',
    {
      type: 'embedded-content',
      left: 'why / what / how clauses',
      right: 'who can question its use',
      governor: 'explains',
      note: 'and は explains が取る四つの間接疑問の列挙に、who can question its use を最後の内容として加えます。who は新しい主節の主語ではありません。',
    },
  ],
  [
    'A volunteer may show someone how to open a lamp safely, replace a worn wire, or search for instructions online.|||1',
    {
      type: 'shared-how-to',
      left: 'how to open / (how to) replace',
      right: '(how to) search',
      governor: 'show someone',
      sharedSubject: 'someone',
      sharedMarker: 'how to',
      note: 'or は show someone の内容となる三つの how-to 動作の最後に、(how to) search ... を加えます。意味上の主体は someone で、補う how to は構造表示だけに使い、音声には足しません。',
    },
  ],
  [
    'This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.|||1',
    {
      type: 'shared-modal-predicate',
      left: 'can create a new risk',
      right: '(can) deepen an old inequality',
      governor: 'an attempt',
      sharedSubject: 'an attempt',
      sharedMarker: 'can',
      note: 'or は an attempt を共通主語にする can create ... と (can) deepen ... を並列します。二つ目にも助動詞 can が構造上共有されますが、音声には補いません。',
    },
  ],
  [
    'A park that cools a wealthy district, for example, may increase nearby rents and force lower-income residents to move before they enjoy the benefits.|||1',
    {
      type: 'shared-modal-predicate',
      left: 'may increase nearby rents',
      right: '(may) force lower-income residents to move',
      governor: 'A park',
      sharedSubject: 'A park',
      sharedMarker: 'may',
      note: 'and は主節S A park を共有する may increase ... と (may) force ... を並列します。関係詞節内の that は共有主語ではありません。',
    },
  ],
  [
    'Yet smaller investments, such as training neighborhood volunteers or improving warning messages in several languages, may save more lives during an emergency.|||2',
    {
      type: 'gerund-examples',
      left: 'training neighborhood volunteers',
      right: 'improving warning messages',
      governor: 'such as',
      note: 'or は such as が挙げる二つの動名詞例、training ... と improving ... を並列します。smaller investments の述語を並べる接続ではありません。',
    },
  ],
  [
    'The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.|||1',
    {
      type: 'gerund-list',
      left: 'explaining / confronting',
      right: 'stating',
      governor: 'in',
      note: 'and は前置詞 in に支配される三つの動名詞内容 explaining ..., confronting ..., stating ... の最後の項を加えます。The discipline の直接の述語を三つ並べる形ではありません。',
    },
  ],
  [
    'Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.|||1',
    {
      type: 'shared-infinitive',
      left: 'to question / (to) recognize',
      right: '(to) deliberate',
      governor: 'can use records',
      sharedSubject: 'a society',
      sharedMarker: 'to',
      note: 'and は can use records に続く三つの目的動作の最後に (to) deliberate ... を加えます。to question / (to) recognize / (to) deliberate は a society を意味上の主語にし、共有toは音声に補いません。',
    },
  ],
  [
    'A common response is to teach digital skills and provide low-cost accounts.|||1',
    {
      type: 'shared-infinitive-complement',
      left: 'to teach digital skills',
      right: '(to) provide low-cost accounts',
      governor: 'is (subject complement)',
      sharedMarker: 'to',
      note: 'and は主格補語Cの中で to teach ... と (to) provide ... を並列します。A common response の主節述語を二つ並べる形ではなく、二つ目のtoだけが共有されています。',
    },
  ],
  [
    'They should direct attention toward patterns that require explanation, provide feedback for revision, and reveal whether policies serve their stated mission.|||1',
    {
      type: 'shared-modal-predicate',
      left: 'should direct / (should) provide',
      right: '(should) reveal',
      governor: 'They',
      sharedSubject: 'They',
      sharedMarker: 'should',
      note: 'and は主節S They と助動詞 should を共有する三つの述語 direct ..., (should) provide ..., (should) reveal ... の最後の項を加えます。関係詞節内の that は共有主語ではありません。',
    },
  ],
  [
    'A document can survive for centuries and still fail to influence how later generations understand the past.|||1',
    {
      type: 'shared-modal-predicate',
      left: 'can survive for centuries',
      right: '(can) still fail to influence',
      governor: 'A document',
      sharedSubject: 'A document',
      sharedMarker: 'can',
      note: 'and は A document と助動詞 can を共有する survive ... と (can) still fail ... を並列します。still は二つ目の述語に挿入されたMで、二つのMを並べる接続ではありません。',
    },
  ],
  [
    'They also discover that a museum is connected to schools, shops, parks, and many other parts of the community.|||1',
    {
      type: 'shared-preposition-list',
      left: 'schools, shops, parks',
      right: 'many other parts of the community',
      governor: 'connected to',
      sharedMarker: 'to',
      note: 'and は connected to の共通前置詞toが取る列挙に many other parts of the community を最後の対象として加えます。独立した二つのMを並べる形ではありません。',
    },
  ],
  [
    'Extending the life of a product reduces waste and lowers demand for the energy and resources required to make new goods.|||2',
    {
      type: 'shared-preposition-list',
      left: 'the energy',
      right: 'resources',
      governor: 'demand for',
      sharedMarker: 'for',
      note: 'and は demand for の共通前置詞forが取る the energy と resources を並列します。resources にも for が構造上かかります。',
    },
  ],
  [
    'A public consultation may reproduce existing inequalities if organized groups can speak more loudly than communities with less time, money, or trust in institutions.|||1',
    {
      type: 'shared-preposition-list',
      left: 'less time, money',
      right: 'trust in institutions',
      governor: 'communities with',
      sharedMarker: 'with',
      note: 'or は communities with が取る less time, money, trust の列挙に、trust in institutions を最後の対象として加えます。less は三項全体にかかります。',
    },
  ],
  [
    'The class then measured the amount of rice, vegetables, and bread left each day for two weeks.|||1',
    {
      type: 'shared-preposition-list',
      left: 'rice, vegetables',
      right: 'bread',
      governor: 'the amount of',
      sharedMarker: 'of',
      note: 'and は the amount of の共通前置詞ofが取る rice, vegetables, bread の列挙に bread を最後の項として加えます。三項全体が amount の内容です。',
    },
  ],
  [
    'Cashless payment has recently moved from a convenient option to the expected form of payment in many shops, transport systems, and public facilities.|||1',
    {
      type: 'shared-preposition-list',
      left: 'many shops, transport systems',
      right: 'public facilities',
      governor: 'in',
      sharedMarker: 'in',
      note: 'and は共通前置詞 in が取る many shops, transport systems, public facilities の列挙に public facilities を最後の場所として加えます。',
    },
  ],
  [
    'Others can use digital services but struggle with small fees, complex passwords, or interfaces that were not designed for disabilities.|||2',
    {
      type: 'shared-preposition-list',
      left: 'small fees, complex passwords',
      right: 'interfaces that were not designed for disabilities',
      governor: 'struggle with',
      sharedMarker: 'with',
      note: 'or は struggle with の共通前置詞withが取る三つの対象に、interfaces ... を最後の候補として加えます。',
    },
  ],
  [
    'For these users, refusing cash does more than remove a familiar habit; it can limit access to food, transport, and public life.|||1',
    {
      type: 'shared-preposition-list',
      left: 'food, transport',
      right: 'public life',
      governor: 'access to',
      sharedMarker: 'to',
      note: 'and は access to の共通前置詞toが取る food, transport, public life の列挙に public life を最後の対象として加えます。直接の目的語Oを三つ並べる形ではありません。',
    },
  ],
  [
    'Policy can reduce the burden through shared cash services, tax incentives, or exemptions for clearly defined cases.|||1',
    {
      type: 'shared-preposition-list',
      left: 'shared cash services, tax incentives',
      right: 'exemptions for clearly defined cases',
      governor: 'through',
      sharedMarker: 'through',
      note: 'or は共通前置詞 through が取る三つの手段に、exemptions ... を最後の候補として加えます。',
    },
  ],
  [
    'Graduation rates may be considered alongside student surveys, samples of actual work, and information about what graduates can do later.|||1',
    {
      type: 'shared-preposition-list',
      left: 'student surveys, samples of actual work',
      right: 'information about what graduates can do later',
      governor: 'considered alongside',
      sharedMarker: 'alongside',
      note: 'and は considered alongside の共通前置詞alongsideが取る列挙に information ... を最後の対象として加えます。',
    },
  ],
  [
    'Regular audits should look not only for false reports but also for neglected tasks, displaced risks, and groups that disappear from the data.|||1',
    {
      type: 'shared-preposition-list',
      left: 'neglected tasks, displaced risks',
      right: 'groups that disappear from the data',
      governor: 'but also for',
      sharedMarker: 'for',
      note: 'and は but also for が取る neglected tasks, displaced risks, groups ... の列挙に groups ... を最後の対象として加えます。',
    },
  ],
  [
    'A dashboard can appear open while hiding decisions about definitions, missing cases, statistical adjustments, and acceptable thresholds.|||1',
    {
      type: 'shared-preposition-list',
      left: 'definitions, missing cases, statistical adjustments',
      right: 'acceptable thresholds',
      governor: 'decisions about',
      sharedMarker: 'about',
      note: 'and は decisions about の共通前置詞aboutが取る列挙に acceptable thresholds を最後の対象として加えます。',
    },
  ],
  [
    'When it remains one disciplined source of evidence among others, measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value over time.|||1',
    {
      type: 'shared-preposition-list',
      left: 'changing circumstances',
      right: 'competing interpretations of public value',
      governor: 'across',
      sharedMarker: 'across',
      note: 'and は共通前置詞 across が取る changing circumstances と competing interpretations ... を並列します。二つ目にも across が構造上かかります。',
    },
  ],
  [
    'Training provides only limited value in rural areas with weak mobile service or during payment system failures after serious natural disasters and emergencies.|||1',
    {
      type: 'modifier-alternatives',
      left: 'in rural areas with weak mobile service',
      right: 'during payment system failures',
      governor: 'provides only limited value',
      note: 'or は共通前置詞を省略した列挙ではなく、in ... と during ... という別々の前置詞句を、limited value が当てはまる二つの状況として並列します。',
    },
  ],
  [
    'Such indicators give institutions a common language for judging performance across places and over time.|||1',
    {
      type: 'modifier-combination',
      left: 'across places',
      right: 'over time',
      governor: 'judging performance',
      note: 'and は共通前置詞を省略した列挙ではなく、across places と over time という別々の前置詞句を組み合わせ、判断の範囲を場所と時間の二軸で示します。',
    },
  ],
  [
    'During the afternoon, they help families who have small children or visitors who are not used to museums.|||1',
    {
      type: 'object-phrase-alternatives',
      left: 'families who have small children',
      right: 'visitors who are not used to museums',
      governor: 'help',
      note: 'or は help の目的語となる二つの名詞句、families who have small children と visitors who are not used to museums を並列します。small children は前者の関係詞節内で have のOです。',
    },
  ],
  [
    'Sometimes a product is badly damaged, but in other cases only a small part has stopped working.|||1',
    {
      type: 'clause-contrast',
      left: 'a product is badly damaged',
      right: 'in other cases only a small part has stopped working',
      governor: 'sentence coordination',
      note: 'but は a product is badly damaged という完全文と、in other cases を挟んで始まる only a small part has stopped working という完全文を対比します。',
    },
  ],
  [
    'At these events, local volunteers help visitors examine broken things and, when possible, repair them.|||1',
    {
      type: 'object-complement-predicates',
      left: 'examine broken things',
      right: '(when possible) repair them',
      governor: 'help visitors',
      sharedSubject: 'visitors',
      note: 'and は help visitors に支配される examine ... と repair ... を並列します。when possible は二つ目に挿入され、意味上の主語はどちらも visitors です。',
    },
  ],
  [
    'Technology should be judged not by how modern it appears, but by whether it solves a real problem for the people who use the space.|||1',
    {
      type: 'evaluation-criteria-contrast',
      left: 'not by how modern it appears',
      right: 'but by whether it solves a real problem',
      governor: 'should be judged',
      note: 'but は should be judged の二つの評価基準、not by how modern it appears と by whether it solves ... を対比します。後者が採るべき基準です。',
    },
  ],
  [
    'Accountability must consequently include transparent reasons, opportunities for challenge, and continuing efforts to hear people who were absent from the original decision.|||1',
    {
      type: 'object-list',
      left: 'transparent reasons, opportunities for challenge',
      right: 'continuing efforts to hear people',
      governor: 'include',
      note: 'and は include の三つの目的語、transparent reasons、opportunities for challenge、continuing efforts ... の最後の項を加えます。for challenge は二つ目の名詞だけを修飾します。',
    },
  ],
  [
    'A photograph may reveal suffering to one group and national achievement to another; a monument may be seen as heritage by some and as exclusion by others.|||1',
    {
      type: 'paired-arguments',
      left: 'suffering to one group',
      right: 'national achievement to another',
      governor: 'may reveal',
      note: '一つ目の and は may reveal の二つの対応組、suffering to one group と national achievement to another を並列します。対象と受け手を組にして読みます。',
    },
  ],
  [
    'A photograph may reveal suffering to one group and national achievement to another; a monument may be seen as heritage by some and as exclusion by others.|||2',
    {
      type: 'paired-complements',
      left: 'as heritage by some',
      right: 'as exclusion by others',
      governor: 'may be seen',
      note: '二つ目の and は may be seen の二つの対応組、as heritage by some と as exclusion by others を並列します。補語Cと見る人を組にして読みます。',
    },
  ],
  [
    'The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.|||2',
    {
      type: 'shared-preposition-list',
      left: 'accessible evidence, independent review',
      right: 'explanations that users can examine',
      governor: 'combine it with',
      sharedMarker: 'with',
      note: 'and は combine it with の共通前置詞withが取る三つの対象に、explanations ... を最後の項として加えます。',
    },
  ],
  [
    'Remembering, in this sense, is not a passive act of storage but an active practice of civic discipline.|||1',
    {
      type: 'complement-contrast',
      left: 'not a passive act of storage',
      right: 'an active practice of civic discipline',
      governor: 'is',
      note: 'but は is の二つの補語候補、not a passive act of storage と an active practice of civic discipline を対比し、後者を正しい捉え方として示します。',
    },
  ],
  [
    'Tea might reduce stress, but perhaps relaxed people simply choose to drink more tea.|||1',
    {
      type: 'clause-contrast',
      left: 'Tea might reduce stress',
      right: 'perhaps relaxed people simply choose to drink more tea',
      governor: 'sentence coordination',
      note: 'but は Tea might reduce stress という完全文と、perhaps を挟んで始まる relaxed people ... という完全文を対比します。',
    },
  ],
  [
    'A genuinely modern system is not one that eliminates older tools as quickly as possible, but one that combines convenience, privacy, inclusion, and flexibility in practice.|||1',
    {
      type: 'complement-contrast',
      left: 'not one that eliminates older tools',
      right: 'one that combines convenience, privacy, inclusion, and flexibility',
      governor: 'is',
      note: 'but は is の補語Cとなる not one that eliminates ... と one that combines ... を対比し、後者を本当の定義として示します。',
    },
  ],
  [
    'A reading test captures some forms of comprehension, for example, but not every capacity that makes someone a thoughtful reader.|||1',
    {
      type: 'object-contrast',
      left: 'some forms of comprehension',
      right: 'not every capacity that makes someone a thoughtful reader',
      governor: 'captures',
      note: 'but は captures の目的語について、some forms of comprehension は捉えるが not every capacity ... までは捉えない、という範囲の対比を作ります。for example は途中に挿入されています。',
    },
  ],
  [
    'The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.|||1',
    {
      type: 'infinitive-complement-contrast',
      left: 'not to abandon moderation',
      right: 'to combine it with ...',
      governor: 'is',
      sharedMarker: 'to',
      note: 'but は is の主格補語Cとして並ぶ not to abandon ... と to combine ... を対比します。二つとも The alternative の内容を示す不定詞で、後者が採る選択肢です。',
    },
  ],
  [
    'This civic dimension explains why collective memory cannot be measured only by the number of documents preserved or people reached.|||1',
    {
      type: 'shared-quantifier-list',
      left: 'documents (that are) preserved',
      right: 'people (who are) reached',
      governor: 'the number of',
      sharedMarker: 'the number of',
      note: 'or は the number of が共通して数える二項、documents (that are) preserved と people (who are) reached を並列します。people は新しい節の主語ではなく、両方とも省略された受動の関係詞節で限定されています。',
    },
  ],
])

function coordinationOccurrence(phrases, index) {
  return phrases.slice(0, index + 1).filter((item) =>
    ['and', 'or', 'but', 'yet', 'nor'].includes(reviewedPhraseKey(item.en))).length
}

function coordinationBinding(details) {
  return Object.freeze(Object.fromEntries(
    Object.entries(details).filter(([key]) => key !== 'note'),
  ))
}

function coordinationGrammarCue(phrases, index, sentenceEn) {
  const phrase = phrases[index]
  const key = reviewedPhraseKey(phrase.en)
  if (!['and', 'or', 'but', 'yet', 'nor'].includes(key)) return null
  const previous = phrases[index - 1]
  const next = phrases[index + 1]
  if (!next) return null
  const override = COORDINATION_CONTEXT_OVERRIDES.get(
    `${sentenceEn}|||${coordinationOccurrence(phrases, index)}`,
  )
  if (override) {
    return {
      kind: 'coordination',
      note: override.note,
      coordinationBinding: coordinationBinding(override),
    }
  }
  if (!previous && (key === 'yet' || key === 'nor')) {
    const isNor = key === 'nor'
    const binding = {
      type: 'discourse-transition',
      left: '前の文',
      right: `${next.en} から始まる倒置文`,
      governor: '文と文のつながり',
    }
    return {
      kind: 'coordination',
      note: isNor
        ? `文頭の Nor は前文の否定へ「〜もまた…ない」を追加し、後ろでは助動詞 ${next.en} を主語より前へ出す倒置を起こします。`
        : `文頭の Yet は前の文の内容と、後続の主語S ${next.en} から始まる新しい文を「しかし」と対比します。`,
      coordinationBinding: Object.freeze(binding),
    }
  }
  if (!previous) return null
  const relation = key === 'and'
    ? '追加'
    : key === 'or'
      ? '選択'
      : key === 'nor'
        ? '否定の追加'
        : '対比'
  const embedded = /節/.test(`${phrase.scope ?? ''}${previous.scope ?? ''}${next.scope ?? ''}`)

  if (next.role === 'S') {
    const nextKey = reviewedPhraseKey(next.en)
    const previousWh = [...phrases.slice(0, index)].reverse().find((item) =>
      /^(?:how|what|which|who|where|when|why|whether)(?:\b|$)/.test(reviewedPhraseKey(item.en)))
    if (previous.role === 'S') {
      const predicate = phrases.slice(index + 2).find((item) => item.role === 'V')
      const binding = {
        type: 'compound-subject',
        left: previous.en,
        right: next.en,
        governor: predicate?.en ?? '後続のV',
      }
      return {
        kind: 'coordination',
        note: `${phrase.en} は前から続く主語Sの列挙に ${next.en} を最後の項として${relation}し、後続の ${predicate?.en ?? 'V'} を共有する複合主語を作ります。`,
        coordinationBinding: Object.freeze(binding),
      }
    }
    if (
      /^(?:how|what|which|who|where|when|why|whether)(?:\b|$)/.test(nextKey) &&
      previousWh
    ) {
      const governing = [...phrases.slice(0, phrases.indexOf(previousWh))]
        .reverse()
        .find((item) => item.role === 'V')
      const binding = {
        type: 'embedded-content',
        left: `${previousWh.en} から始まる内容`,
        right: `${next.en} から始まる内容`,
        governor: governing?.en ?? '前の支配動詞',
      }
      return {
        kind: 'coordination',
        note: `${phrase.en} は ${governing?.en ?? '前の支配動詞'} のもとで、${previousWh.en} から始まる埋込み内容と ${next.en} から始まる埋込み内容を${relation}します。新しい主節の開始ではありません。`,
        coordinationBinding: Object.freeze(binding),
      }
    }
    const binding = {
      type: 'clause-coordination',
      left: `${previous.en} までの節`,
      right: `${next.en} から始まる節`,
      governor: '文と文の接続',
    }
    return {
      kind: 'coordination',
      note: `${phrase.en} は ${previous.en} までの節を閉じ、後続の主語S ${next.en} から始まる新しい節を${relation}します。`,
      coordinationBinding: Object.freeze(binding),
    }
  }
  if (next.role === 'V') {
    const priorInfinitive = [...phrases.slice(Math.max(0, index - 4), index)]
      .reverse()
      .find((item) => item.role === 'V' && /^to\b/i.test(item.en))
    if (priorInfinitive && !/^to\b/i.test(next.en)) {
      const binding = {
        type: 'shared-infinitive',
        left: `${priorInfinitive.en} から始まる内容`,
        right: `(to) ${next.en} から始まる内容`,
        governor: '共通toを持つ不定詞列',
        sharedMarker: 'to',
      }
      return {
        kind: 'coordination',
        note: `${phrase.en} は ${priorInfinitive.en} から始まる不定詞内容と、to を共有する (to) ${next.en} から始まる内容を${relation}します。省略されたtoは構造だけに補い、音声では発音しません。`,
        coordinationBinding: Object.freeze(binding),
      }
    }
    if (/^to\b/i.test(next.en)) {
      let semanticSubjectIndex = -1
      for (let cursor = index - 1; cursor >= 0; cursor--) {
        if (phrases[cursor].role === 'O' || phrases[cursor].role === 'O1') {
          semanticSubjectIndex = cursor
          break
        }
      }
      const semanticSubject = phrases[semanticSubjectIndex]
      const governingVerb = [...phrases.slice(0, semanticSubjectIndex >= 0 ? semanticSubjectIndex : index)]
        .reverse()
        .find((item) => item.role === 'V')
      const binding = {
        type: 'parallel-infinitive',
        left: '前の不定詞動作',
        right: next.en,
        governor: governingVerb?.en ?? '前の動詞',
        sharedSubject: semanticSubject?.en ?? '直前の目的語',
      }
      return {
        kind: 'coordination',
        note: `${phrase.en} は ${next.en} を前の不定詞動作と並列します。${semanticSubject?.en ?? '直前の目的語'} を意味上の主語にし、${governingVerb?.en ?? '前の動詞'} に支配される${relation}の動作です。`,
        coordinationBinding: Object.freeze(binding),
      }
    }
    const sharedSubject = [...phrases.slice(0, index)]
      .reverse()
      .find((item) => item.role === 'S')
    const precedingPredicate = [...phrases.slice(0, index)].reverse().find((item) => item.role === 'V')
    const binding = {
      type: 'shared-subject-predicate',
      left: precedingPredicate?.en ?? '前の述語',
      right: next.en,
      governor: sharedSubject?.en ?? '前のS',
      sharedSubject: sharedSubject?.en ?? '前のS',
    }
    return {
      kind: 'coordination',
      note: `${phrase.en} は後続の動詞V ${next.en} を、${sharedSubject?.en ?? '前のS'} を共有する並列述語として${relation}します。`,
      coordinationBinding: Object.freeze(binding),
    }
  }
  if (next.role === 'LINK' && embedded) {
    const governing = [...phrases.slice(0, index)].reverse().find((item) => item.role === 'V')
    const binding = {
      type: 'embedded-content',
      left: `${previous.en} までの埋込み内容`,
      right: `${next.en} から始まる埋込み内容`,
      governor: governing?.en ?? '前の支配語',
    }
    return {
      kind: 'coordination',
      note: `${phrase.en} は後続の ${next.en} から始まる内容を、前の埋込み節・間接疑問と同じ支配語のもとで${relation}します。`,
      coordinationBinding: Object.freeze(binding),
    }
  }
  if (previous.role === next.role) {
    if (previous.role === 'M') {
      const leadingPreposition = [...phrases.slice(0, index)].reverse()
        .find((item) => item.role === 'M' && REVIEWABLE_STANDALONE_PREPOSITIONS.has(
          reviewedPhraseKey(item.en).split(' ')[0],
        ))?.en.split(/\s+/)[0]
      const nextPreposition = reviewedPhraseKey(next.en).split(' ')[0]
      const independent = REVIEWABLE_STANDALONE_PREPOSITIONS.has(nextPreposition)
      const binding = independent
        ? {
            type: 'modifier-coordination',
            left: previous.en,
            right: next.en,
            governor: '前の動作・内容',
          }
        : {
            type: 'shared-preposition-list',
            left: previous.en,
            right: next.en,
            governor: `${leadingPreposition ?? '前の前置詞'} が取る列挙`,
            sharedMarker: leadingPreposition ?? '前の前置詞',
          }
      const note = independent
        ? `${phrase.en} は ${previous.en} と ${next.en} という別々の修飾句Mを${relation}し、前の動作・内容へ二つの条件や範囲を足します。`
        : `${phrase.en} は ${leadingPreposition ?? '前の前置詞'} が取る対象の列挙に ${next.en} を最後の項として${relation}します。独立した二つのMを並べる形ではありません。`
      return {
        kind: 'coordination',
        note,
        coordinationBinding: Object.freeze(binding),
      }
    }
    const governor = [...phrases.slice(0, index)].reverse().find((item) => item.role === 'V')
    const binding = {
      type: `${previous.role.toLowerCase()}-list`,
      left: previous.en,
      right: next.en,
      governor: governor?.en ?? `共通の${previous.role}支配語`,
    }
    return {
      kind: 'coordination',
      note: `${phrase.en} は前から続く${previous.role}の列挙に ${next.en} を最後の項として${relation}します。列挙全体が ${governor?.en ?? '同じ支配語'} にかかります。`,
      coordinationBinding: Object.freeze(binding),
    }
  }
  const binding = {
    type: 'unresolved',
    left: previous.en,
    right: next.en,
    governor: '',
  }
  return {
    kind: 'coordination',
    note: `${phrase.en} が結ぶ左項 ${previous.en} と右項 ${next.en} の支配関係は、文全体の並列構造と合わせて確認します。`,
    coordinationBinding: Object.freeze(binding),
  }
}

const REVIEWABLE_STANDALONE_PREPOSITIONS = new Set([
  'about', 'by', 'for', 'from', 'in', 'of', 'on', 'over', 'through', 'to',
  'with', 'without',
])

function reviewedPrepositionBinding(phrases, index) {
  const phrase = phrases[index]
  const key = reviewedPhraseKey(phrase.en)
  if (
    phrase.source === 'corpus-review' ||
    !REVIEWABLE_STANDALONE_PREPOSITIONS.has(key) ||
    words(phrase.en).length !== 1
  ) return null
  let targetIndex = index + 1
  while (
    targetIndex < phrases.length &&
    targetIndex - index <= 2 &&
    phrases[targetIndex].role === 'M'
  ) targetIndex++
  const target = phrases[targetIndex]
  if (!target) return null
  const explanation = `${phrase.explanation ?? phrase.grammarNote ?? ''}`
  const targetFirst = reviewedPhraseKey(target.en).split(' ')[0]
  if (!explanation.includes(key) || !targetFirst || !explanation.includes(targetFirst)) return null
  return Object.freeze({
    preposition: key,
    objectStart: target.en,
    objectRole: target.role,
  })
}

function applyContextualGrammarNotes(phrases, sentenceEn) {
  return Object.freeze(phrases.map((phrase, index) => {
    const cues = [
      punctuationBoundaryGrammarCue(phrases, index, sentenceEn),
      appositionGrammarCue(phrase, sentenceEn),
      zeroRelativeGrammarCue(phrase, sentenceEn),
      svocConstructionGrammarCue(phrase, sentenceEn),
      ingGrammarCue(phrases, index, sentenceEn),
      reducedRelativeGrammarCue(phrase, sentenceEn),
      structuralDisplayGrammarCue(phrase, sentenceEn),
      prepositionWhGrammarCue(phrases, index),
      negativeFocusGrammarCue(phrases, index, sentenceEn),
      coordinationGrammarCue(phrases, index, sentenceEn),
      relativeGrammarCue(phrases, index, sentenceEn),
      infinitiveGrammarCue(phrases, index, sentenceEn),
      connectorGrammarCue(phrases, index),
      comparisonGrammarCue(phrases, index, sentenceEn),
    ].filter(Boolean)
    if (!cues.length) {
      const interrogative = interrogativeGrammarCue(phrases, index, sentenceEn)
      if (interrogative) cues.push(interrogative)
    }
    const prepositionBinding = reviewedPrepositionBinding(phrases, index)
    const coordinationBinding = phrase.coordinationBinding ?? cues.find((cue) => cue.coordinationBinding)?.coordinationBinding
    const zeroRelativeBinding = phrase.zeroRelativeBinding ?? cues.find((cue) => cue.zeroRelativeBinding)?.zeroRelativeBinding
    const constructionBinding = phrase.constructionBinding ?? cues.find((cue) => cue.constructionBinding)?.constructionBinding
    const ingBinding = phrase.ingBinding ?? cues.find((cue) => cue.ingBinding)?.ingBinding
    const reducedRelativeBinding = phrase.reducedRelativeBinding ?? cues.find((cue) => cue.reducedRelativeBinding)?.reducedRelativeBinding
    const comparisonBinding = phrase.comparisonBinding ?? cues.find((cue) => cue.comparisonBinding)?.comparisonBinding
    const focusBinding = phrase.focusBinding ?? cues.find((cue) => cue.focusBinding)?.focusBinding
    const infinitiveBinding = phrase.infinitiveBinding ?? cues.find((cue) => cue.infinitiveBinding)?.infinitiveBinding
    const structureDisplay = cues.find((cue) => cue.structureDisplay)?.structureDisplay
    const displayPrefix = cues.find((cue) => cue.displayPrefix)?.displayPrefix
    const restoredDisplay = structureDisplay?.displayEn || phrase.structureEn || phrase.en
    const structuralDisplay = displayPrefix
      ? `${displayPrefix}${restoredDisplay}`
      : structureDisplay
        ? restoredDisplay
        : null
    if (!cues.length) {
      return prepositionBinding
        ? Object.freeze({ ...phrase, prepositionBinding })
        : phrase
    }
    const contextualNote = cues.map((cue) => cue.note).join(' ')
    const existingExplanation = `${phrase.explanation ?? ''}`.trim()
    const existingRoleNote = `${phrase.roleNote ?? ''}`.trim()
    const strippedExisting = existingRoleNote && existingExplanation.endsWith(existingRoleNote)
      ? existingExplanation.slice(0, -existingRoleNote.length).trim()
      : existingExplanation === existingRoleNote
        ? ''
        : existingExplanation
    const existingSpecific = strippedExisting ? `${strippedExisting} ` : ''
    // 本文別訂正には、支配語・先行詞・並列関係まで読んだ項目固有noteがある。
    // 汎用推定文を重ねず、監査用のcue種別だけを付与する。
    if (phrase.source !== 'corpus-review' && strippedExisting.length >= 20) {
      const reviewedKinds = []
      if (/関係(?:代名詞|副詞|限定詞)|先行詞/.test(strippedExisting)) reviewedKinds.push('relative')
      if (/間接疑問|疑問詞|程度を(?:尋ね|示す)|問いの対象/.test(strippedExisting)) {
        reviewedKinds.push('embedded-question')
      }
      if (/不定詞|\bO to do\b|\bto do\b/i.test(strippedExisting)) reviewedKinds.push('infinitive')
      if (/同等比較|比較対象|呼応|not only|but also|rather than|\bthan\b|\bas \.\.\. as\b/i.test(strippedExisting)) {
        reviewedKinds.push('comparison')
      }
      if (/内容節|同格節|理由節|条件節|時の(?:節|副詞節)|対比|譲歩|省略節/.test(strippedExisting)) {
        reviewedKinds.push('clause-connector')
      }
      return Object.freeze({
        ...phrase,
        ...(prepositionBinding ? { prepositionBinding } : {}),
        ...(coordinationBinding ? { coordinationBinding } : {}),
        ...(zeroRelativeBinding ? { zeroRelativeBinding } : {}),
        ...(constructionBinding ? { constructionBinding } : {}),
        ...(ingBinding ? { ingBinding } : {}),
        ...(reducedRelativeBinding ? { reducedRelativeBinding } : {}),
        ...(comparisonBinding ? { comparisonBinding } : {}),
        ...(focusBinding ? { focusBinding } : {}),
        ...(infinitiveBinding ? { infinitiveBinding } : {}),
        ...(structureDisplay ? { structureDisplay } : {}),
        ...(structuralDisplay ? { structureEn: structuralDisplay, displayEn: structuralDisplay } : {}),
        specialGrammar: Object.freeze(
          [...new Set((() => {
            let cueKinds = cues.map((cue) => cue.kind)
            if (reviewedKinds.includes('embedded-question')) {
              cueKinds = cueKinds.filter((kind) => !kind.startsWith('relative'))
            }
            if (reviewedKinds.includes('relative')) {
              cueKinds = cueKinds.filter((kind) => kind !== 'embedded-question')
            }
            return [...(phrase.specialGrammar ?? []), ...reviewedKinds, ...cueKinds]
          })())],
        ),
      })
    }
    const explanation = `${existingSpecific}${contextualNote} ${phrase.roleNote}`
    return Object.freeze({
      ...phrase,
      ...(prepositionBinding ? { prepositionBinding } : {}),
      ...(coordinationBinding ? { coordinationBinding } : {}),
      ...(zeroRelativeBinding ? { zeroRelativeBinding } : {}),
      ...(constructionBinding ? { constructionBinding } : {}),
      ...(ingBinding ? { ingBinding } : {}),
      ...(reducedRelativeBinding ? { reducedRelativeBinding } : {}),
      ...(comparisonBinding ? { comparisonBinding } : {}),
      ...(focusBinding ? { focusBinding } : {}),
      ...(infinitiveBinding ? { infinitiveBinding } : {}),
      ...(structureDisplay ? { structureDisplay } : {}),
      ...(structuralDisplay ? { structureEn: structuralDisplay, displayEn: structuralDisplay } : {}),
      specialGrammar: Object.freeze(cues.map((cue) => cue.kind)),
      grammarNote: explanation,
      explanation,
    })
  }))
}

function correctedSentencePhrase(originals, part, correctionNote, partIndex) {
  const first = originals[0]
  const sourceJa = originals.map((item) => item.sourceJa ?? item.ja).join(' → ')
  const rolePair = singleRolePhrasePair({
    en: part.en,
    ja: part.ja,
    role: part.role,
    sourceJa,
    sourceIndex: first.sourceIndex,
    scope: part.scope ?? first.scope,
  })
  const grammarNote = `${correctionNote} ${rolePair.roleNote}`
  return Object.freeze({
    ...first,
    ...rolePair,
    ...(part.conditionBinding
      ? { conditionBinding: Object.freeze({ ...part.conditionBinding }) }
      : {}),
    ...(part.particleBinding
      ? { particleBinding: Object.freeze({ ...part.particleBinding }) }
      : {}),
    ...(part.clauseBinding
      ? { clauseBinding: Object.freeze({ ...part.clauseBinding }) }
      : {}),
    ...(part.closureBinding
      ? { closureBinding: Object.freeze({ ...part.closureBinding }) }
      : {}),
    ...(part.focusBinding
      ? { focusBinding: Object.freeze({ ...part.focusBinding }) }
      : {}),
    ...(part.sharedObjectBinding
      ? { sharedObjectBinding: Object.freeze({ ...part.sharedObjectBinding }) }
      : {}),
    ...(part.ingBinding
      ? { ingBinding: Object.freeze({ ...part.ingBinding }) }
      : {}),
    ...(part.infinitiveBinding
      ? { infinitiveBinding: Object.freeze({ ...part.infinitiveBinding }) }
      : {}),
    ...(Number.isFinite(part.wordLimit) ? { wordLimit: part.wordLimit } : {}),
    ...(part.specialGrammar
      ? { specialGrammar: Object.freeze([...part.specialGrammar]) }
      : {}),
    id: `${first.id}-reviewed-${partIndex}`,
    spokenEn: part.spokenEn ?? part.en,
    displayEn: part.structureEn ?? part.en,
    structureEn: part.structureEn ?? '',
    source: 'sentence-reviewed',
    status: 'review-needed',
    label: '本文別SVOCM確認',
    kind: 'sentence-reviewed-phrase',
    readingGuide: '本文の構造と意味を照合し、英語順の役割単位で読みます。',
    grammarNote,
    explanation: grammarNote,
  })
}

function applyContentClauseJapanese(phrases) {
  return Object.freeze(phrases.map((phrase, index) => {
    if (
      phrase.role !== 'LINK' ||
      reviewedPhraseKey(phrase.en) !== 'that' ||
      phrase.source === 'sentence-reviewed'
    ) return phrase
    const previous = phrases[index - 1]
    const previousKey = reviewedPhraseKey(previous?.en)
    const appositiveContent = /(?:fact|proof|promise|idea|claim|evidence)$/.test(previousKey)
    const copularContent = /^(?:am|are|is|was|were|may be|might be|will be|would be)$/.test(previousKey)
    const ja = appositiveContent
      ? '〜という内容で（中身は次へ）'
      : copularContent
        ? '次のことです（内容は次へ）'
        : '次の内容だと（中身は次へ）'
    const corrected = correctedSentencePhrase(
      [phrase],
      { role: 'LINK', en: phrase.en, ja },
      `${previous?.en ?? '前の語句'}に続き、that は関係代名詞ではなく内容節を導きます。`,
      `content-${index}`,
    )
    return Object.freeze({ ...corrected, source: 'content-clause-reviewed' })
  }))
}

function applyReadingPhraseCorrections(phrases, sentenceEn) {
  let corrected = [...phrases]
  const decisions = READING_PHRASE_CORRECTIONS[sentenceEn] ?? []
  const seenMatches = new Map()
  for (const decision of decisions) {
    const matchKeys = decision.match.map(reviewedPhraseKey)
    const signature = matchKeys.join('|')
    const requestedOccurrence = decision.occurrence ?? ((seenMatches.get(signature) ?? 0) + 1)
    let occurrence = 0
    let matchIndex = -1
    for (let index = 0; index <= corrected.length - matchKeys.length; index++) {
      const matches = matchKeys.every(
        (key, offset) => reviewedPhraseKey(corrected[index + offset]?.en) === key,
      )
      if (!matches) continue
      occurrence++
      if (occurrence === requestedOccurrence) {
        matchIndex = index
        break
      }
    }
    if (matchIndex < 0) continue
    seenMatches.set(signature, requestedOccurrence)
    const originals = corrected.slice(matchIndex, matchIndex + matchKeys.length)
    const replacements = decision.parts.map((part, partIndex) =>
      correctedSentencePhrase(originals, part, decision.note, partIndex))
    corrected.splice(matchIndex, matchKeys.length, ...replacements)
  }
  const backReferences = READING_PHRASE_BACK_REFERENCES[sentenceEn]
  if (backReferences) {
    corrected = corrected.map((phrase, index) => {
      // 文ごとの意味判断を、後置修飾用の汎用受け直しで上書きしません。
      if (phrase.source === 'sentence-reviewed') return phrase
      const phraseKey = reviewedPhraseKey(phrase.en)
      const ja = Object.entries(backReferences)
        .find(([english]) => reviewedPhraseKey(english) === phraseKey)?.[1]
      if (!ja) return phrase
      return correctedSentencePhrase(
        [phrase],
        { role: phrase.role, en: phrase.en, ja },
        '後置修飾の係り先を括弧で受け直し、英語順のまま意味を完成させます。',
        `back-${index}`,
      )
    })
  }
  return applyContextualGrammarNotes(applyContentClauseJapanese(corrected), sentenceEn)
}

export function applyReadingManualReviewState(phrases, sentence, blocks) {
  const reviewEvidence = readingManualReviewEvidence(sentence, phrases, blocks)
  return Object.freeze(phrases.map((phrase) => {
    const pendingRule = pendingVerbGroupRule(phrase.en, phrase.role)
    return Object.freeze({
      ...phrase,
      reviewEvidenceId: reviewEvidence?.reviewId ?? '',
      pendingRule,
      reviewState: pendingRule
        ? 'rule-review-needed'
        : reviewEvidence
          ? reviewEvidence.reviewState
          : 'unregistered',
      status: reviewEvidence && !pendingRule ? reviewEvidence.status : 'review-needed',
    })
  }))
}

function buildSentencePhraseSequence(teachingBlocks, sentenceGloss, sentence) {
  const sentenceEn = sentence.en
  const generatedPhrases = teachingBlocks.flatMap((block, blockIndex) =>
    block.phrasePairs.map((pair, phraseIndex) => {
      // block.note は自動解析前のまとまり全体の説明です。役割分割後の
      // 個々のフレーズへ流用すると、that・once・it などで説明が食い違うため、
      // phraseSequence では局所の roleNote だけを基礎説明にします。
      const explanation = pair.roleNote
      return Object.freeze({
        ...pair,
        id: `generated-${blockIndex}-${phraseIndex}`,
        spokenEn: pair.en,
        displayEn: pair.en,
        source: 'corpus-review',
        status: 'review-needed',
        label: block.label,
        kind: block.kind,
        svoc: block.svoc,
        readingGuide: block.translationGuide,
        grammarNote: pair.roleNote,
        explanation,
      })
    }))
  const merged = mergeSentenceBoundaryPhraseSequence(generatedPhrases, sentenceGloss)
  return applyReadingPhraseCorrections(merged, sentenceEn)
}

function projectPhraseGroupsToSourceBlocks(blocks, phrases) {
  let blockCursor = 0
  const spans = blocks.map((block, index) => {
    const start = blockCursor
    blockCursor += words(block.en).length
    return { index, start, end: blockCursor }
  })
  const groups = blocks.map(() => [])
  let phraseCursor = 0
  for (const phrase of phrases) {
    const start = phraseCursor
    phraseCursor += words(phrase.spokenEn ?? phrase.en).length
    const end = phraseCursor
    const overlapping = spans.filter((span) =>
      Math.max(0, Math.min(end, span.end) - Math.max(start, span.start)) > 0)
    let target = overlapping[0] ?? spans.at(-1)
    for (const span of overlapping.slice(1)) {
      const currentOverlap = Math.max(0, Math.min(end, target.end) - Math.max(start, target.start))
      const candidateOverlap = Math.max(0, Math.min(end, span.end) - Math.max(start, span.start))
      if (candidateOverlap > currentOverlap) target = span
    }
    // 確定フレーズが旧境界をまたぐ場合、前ブロックに既に内容があれば
    // 後ブロックへ置く。これで1,042ブロックを空にせず、重複もさせない。
    if (overlapping.length > 1 && groups[overlapping[0].index].length > 0) {
      target = overlapping.at(-1)
    }
    groups[target.index].push(phrase)
  }
  return groups
}

function specificPhraseExplanation(phrase) {
  const explanation = `${phrase.explanation ?? phrase.grammarNote ?? ''}`.trim()
  const roleNote = `${phrase.roleNote ?? ''}`.trim()
  if (!roleNote || explanation === roleNote) return explanation === roleNote ? '' : explanation
  return explanation.endsWith(roleNote)
    ? explanation.slice(0, -roleNote.length).trim()
    : explanation
}

function contentClauseBlockMeta(block, phrases) {
  const contentPhrase = phrases.find((phrase) => {
    const explanation = `${phrase.explanation ?? ''}`
    return phrase.source === 'content-clause-reviewed' ||
      /(?:内容節の入口|内容節を導|内容節末|目的語となる内容節|要求内容を示す内容節)/.test(explanation)
  })
  if (!contentPhrase) return null
  const notes = phrases.map((phrase) => `${phrase.explanation ?? ''}`).join(' ')
  const appositive = /(?:同格|(?:proof|evidence|warning)に続き)/.test(notes)
  const indirectObjectContent = /teach の内容/.test(notes)
  const role = appositive
    ? 'M'
    : indirectObjectContent
      ? 'O2'
      : block.role === 'C'
        ? 'C'
        : 'O'
  return {
    label: appositive
      ? '同格のthat内容節'
      : role === 'C'
        ? '補語となるthat内容節'
        : '内容節',
    kind: 'clause',
    role,
    scope: appositive ? '同格の内容節内' : '内容節内',
    note: appositive
      ? 'that は関係代名詞ではなく、直前の名詞が表す内容を同格で示す節の入口です。'
      : role === 'C'
        ? 'that は関係代名詞ではなく、be動詞の後ろで主語の具体的な内容を説明する補語節の入口です。'
      : 'that は関係代名詞ではなく、前の動詞・表現が受ける内容節の入口です。節全体を目的内容として読みます。',
  }
}

function resolvedBlockMeta(sentenceEn, block, phrases, blockIndex) {
  return READING_BLOCK_STRUCTURE_OVERRIDES[sentenceEn]?.[blockIndex] ??
    contentClauseBlockMeta(block, phrases) ??
    null
}

function phraseWithReviewedBlockScope(phrase, meta) {
  if (!meta?.scope) return phrase
  const roles = rolesForPhrase(phrase)
  const roleNote = translationRoleExplanation(roles, phrase.ja, meta.scope)
  const specific = specificPhraseExplanation(phrase)
  const explanation = [specific, roleNote].filter(Boolean).join(' ')
  return Object.freeze({
    ...phrase,
    scope: meta.scope,
    label: meta.label,
    kind: meta.kind,
    roleHeading: translationRoleHeading(roles, meta.scope),
    roleNote,
    grammarNote: explanation,
    explanation,
  })
}

function applyReviewedBlockStructure(phrases, blocks, sentenceEn) {
  const groups = projectPhraseGroupsToSourceBlocks(blocks, phrases)
  return Object.freeze(groups.flatMap((group, blockIndex) => {
    const meta = resolvedBlockMeta(sentenceEn, blocks[blockIndex], group, blockIndex)
    return group.map((phrase) => phraseWithReviewedBlockScope(phrase, meta))
  }))
}

function projectedTeachingBlocks(blocks, phrases, sentenceEn) {
  const groups = projectPhraseGroupsToSourceBlocks(blocks, phrases)
  return Object.freeze(blocks.map((block, blockIndex) => {
    const phrasePairs = Object.freeze(groups[blockIndex])
    const meta = resolvedBlockMeta(sentenceEn, block, phrasePairs, blockIndex)
    const kind = meta?.kind ?? block.kind
    const label = meta?.label ?? block.label
    const role = meta ? meta.role : block.role
    const scope = meta?.scope ?? block.scope ?? ''
    const en = phrasePairs.map((phrase) => phrase.spokenEn ?? phrase.en).join(' ')
    const jaSegments = Object.freeze(phrasePairs.map((phrase) => phrase.ja))
    const specificNotes = [...new Set(
      phrasePairs.map(specificPhraseExplanation).filter(Boolean),
    )]
    const note = meta?.note ?? (specificNotes.length ? specificNotes.join(' ') : block.note)
    const projected = {
      ...block,
      en,
      ja: jaSegments.join('／'),
      jaSegments,
      phrasePairs,
      orderedSpeechJa: jaSegments.join('。'),
      displayEn: displayText(en, kind),
      kind,
      label,
      role,
      scope,
      note,
      svoc: {
        ...block.svoc,
        parts: phrasePairs.flatMap((phrase) => phrase.roleParts.map((part) => ({
          role: part.role,
          text: part.en,
        }))),
      },
    }
    const translationGuide = translationGuideFor(projected)
    return Object.freeze({
      ...projected,
      translationGuide,
      speechJa:
        `意味は、「${projected.orderedSpeechJa}」。${translationGuide} ` +
        `文法のポイントは、${note}`,
    })
  }))
}

export function analyzeReadingSentence(sentence) {
  const split = splitEnglish(sentence)
  const japanese = alignJapanese(split, sentence)
  const classifications = split.map((unit, index) => classifyUnit(unit, index, split))
  const blocks = split.map((unit, index) => {
    const classification = classifications[index]
    const teachingBlock = sentence.translationScenario?.[index]
    const hasTeachingBlock =
      teachingBlock?.en === bare(unit.text) &&
      typeof teachingBlock.ja === 'string' &&
      teachingBlock.ja.trim().length > 0
    const inheritedSubject =
      classification.kind === 'core' &&
      startsWithPredicate(unit.text) &&
      classifications.slice(0, index).some((item) => item.role === 'S')
    const svoc = classification.kind === 'phrase'
      ? { parts: [{ role: classification.role, text: bare(unit.text) }], pattern: classification.role, name: classification.label }
      : analyzeSvoc(unit.text, { implicitSubject: inheritedSubject })
    const ja = hasTeachingBlock
      ? teachingBlock.ja.trim()
      : unit.manualJa ?? japanese[index]?.text ?? roughJapanese(unit.text, sentence.gloss)
    const jaSegments =
      hasTeachingBlock && Array.isArray(teachingBlock.jaSegments)
        ? teachingBlock.jaSegments
        : [ja]
    const phrasePairs = buildPhrasePairs(
      bare(unit.text),
      jaSegments,
      sentence.gloss,
      hasTeachingBlock ? teachingBlock.enSegments : null,
      {
        kind: classification.kind,
        blockRole: classification.role,
        svoc,
      },
    )
    return {
      id: index,
      en: bare(unit.text),
      ja,
      jaSegments,
      phrasePairs,
      orderedSpeechJa:
        hasTeachingBlock && typeof teachingBlock.speechJa === 'string'
          ? teachingBlock.speechJa.trim()
          : ja,
      jaSource: hasTeachingBlock
        ? 'teaching'
        : unit.manualJa
          ? 'manual'
          : (japanese[index]?.source ?? 'gloss'),
      translationTip: hasTeachingBlock ? teachingBlock.tip?.trim() ?? '' : '',
      displayEn: classification.kind === 'core'
        ? displayCoreWithEmbeddedClause(unit.text, svoc)
        : displayText(unit.text, classification.kind),
      ...classification,
      svoc,
    }
  })

  const mainPattern = mainClausePattern(blocks)
  const mainCoreIndex = blocks.findIndex(
    (block) => block.kind === 'core' && block.svoc.pattern.includes('V'),
  )
  const explainedBlocks = blocks.map((block, index) => {
    const inheritedSubject =
      index === mainCoreIndex &&
      !block.svoc.parts.some((part) => part.role === 'S') &&
      blocks.slice(0, index).some((item) => item.role === 'S')
    const effectivePattern = `${inheritedSubject ? 'S' : ''}${block.svoc.pattern}`
    if (
      index !== mainCoreIndex ||
      !mainPattern ||
      block.svoc.pattern === mainPattern ||
      !mainPattern.startsWith(effectivePattern)
    ) {
      return block
    }
    const missingRoles = mainPattern.slice(effectivePattern.length)
    const locations = [
      inheritedSubject ? 'Sは前の句' : '',
      missingRoles ? `${missingRoles}は後続ブロック` : '',
    ].filter(Boolean).join('、')
    return {
      ...block,
      note:
        `${block.note} このブロックだけで文型を確定せず、前後の文法ブロックと合わせて` +
        `文全体を${mainPattern}（${SVOC_NAMES[mainPattern]}）と判定します。`,
      svoc: {
        ...block.svoc,
        name: `${mainPattern}の骨格（${locations}）`,
      },
    }
  })
  const teachingBlocks = explainedBlocks.map((block) => {
    const translationGuide = translationGuideFor(block)
    return {
      ...block,
      translationGuide,
      speechJa:
        `意味は、「${block.orderedSpeechJa}」。${translationGuide} ` +
        `文法のポイントは、${block.note}`,
    }
  })
  const phraseExplanationGuide = getReadingPhraseExplanation(sentence)
  const correctedPhraseSequence = buildSentencePhraseSequence(teachingBlocks, sentence.gloss, sentence)
  const structuredPhraseSequence = applyReviewedBlockStructure(
    correctedPhraseSequence,
    teachingBlocks,
    sentence.en,
  )
  const structuredBlocks = projectedTeachingBlocks(
    teachingBlocks,
    structuredPhraseSequence,
    sentence.en,
  )
  const phraseSequence = applyReadingManualReviewState(
    structuredPhraseSequence,
    sentence,
    structuredBlocks,
  )
  const projectedBlocks = projectedTeachingBlocks(teachingBlocks, phraseSequence, sentence.en)

  const marked = READING_SENTENCE_STRUCTURE_OVERRIDES[sentence.en] ??
    projectedBlocks.map((block) => block.displayEn).join(' ')
  const structureMarkerParse = parseStructureMarkers(marked)

  return {
    blocks: projectedBlocks,
    phraseSequence,
    phraseExplanationGuide,
    phraseMethod: phraseSequence.every((phrase) => phrase.status === 'confirmed')
      ? 'corpus-svocm-confirmed'
      : 'corpus-svocm-review-needed',
    marked,
    structureTokens: structureMarkerParse.tokens,
    structureMarkerErrors: structureMarkerParse.errors,
    pattern: sentencePattern(projectedBlocks),
    mainPattern,
  }
}

function paragraphRole(paragraph, index, total) {
  const en = paragraph.map(({ item }) => item.en).join(' ')
  const first = paragraph[0].item.en
  if (index === 0) return '導入・主題提示'
  if (/^(?:however|yet|nevertheless|by contrast|on the other hand)\b/i.test(first)) {
    return '対比・反論・限界'
  }
  if (/^(?:for example|for instance|one |another |a study|consider )/i.test(first)) {
    return '具体例・根拠'
  }
  if (/^(?:as a result|therefore|thus|consequently)\b/i.test(first)) {
    return '結果・帰結'
  }
  if (index === total - 1) return '結論・含意'
  if (/\b(?:benefit|advantage|supporters?|reason)\b/i.test(en)) return '利点・理由'
  return '展開・説明'
}

function paragraphConnection(firstSentence, index) {
  if (index === 0) return '文章全体の話題と読み取るべき中心を提示します。'
  const first = firstSentence.en.toLowerCase()
  if (/^(however|yet|nevertheless)/.test(first)) return '前段落の主張を受け、逆接で限界・反対面へ進みます。'
  if (/^(in addition|also|moreover|furthermore)/.test(first)) return '前段落の内容に、新しい利点・情報を追加します。'
  if (/^(for example|for instance)/.test(first)) return '前段落の一般論を、具体例で確かめます。'
  if (/^(as a result|therefore|thus)/.test(first)) return '前段落を原因として、その結果・結論を示します。'
  if (/^(one|another)/.test(first)) return '前段落の説明を、人物・事例へ具体化します。'
  return '前段落の話題を引き継ぎ、理由・例・影響のいずれかを詳しくします。'
}

export function analyzePassageParagraphs(passage) {
  const groups = []
  for (const [sentenceIndex, item] of passage.sentences.entries()) {
    if (!groups.length || item.paragraphStart) groups.push([])
    groups.at(-1).push({ item, sentenceIndex })
  }

  return groups.map((paragraph, index) => {
    const first = paragraph[0].item
    const role = paragraphRole(paragraph, index, groups.length)
    return {
      index,
      role,
      topicSentenceIndex: paragraph[0].sentenceIndex,
      summary: first.ja,
      connection: paragraphConnection(first, index),
      strategy:
        paragraph.length === 1
          ? 'この一文が段落の要旨です。主語Sと述語Vを取り、前段落とのつながりを確認します。'
          : `第1文をトピックセンテンスとして押さえ、後続${paragraph.length - 1}文を理由・具体例・結果として整理します。`,
      sentences: paragraph,
    }
  })
}

export function grammarPatternName(pattern) {
  const core = pattern
    .split(/\s*\+\s*/)
    .filter((role) => role !== 'M')
    .map((role) => role.replace(/[12]$/, ''))
    .join('')
  return SVOC_NAMES[core] ?? (core ? `${core}型` : '文法ブロック')
}
