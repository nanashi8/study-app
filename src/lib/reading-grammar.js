import { getWord } from '../data/vocab.js'
import { lemmaCandidates, resolvePassageWord } from '../data/passage-gloss.js'
import { normalizeToken } from './text.js'

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
])

const DOUBLE_OBJECT_VERBS = new Set([
  'ask', 'give', 'offer', 'send', 'show', 'teach', 'tell',
])

const OBJECT_COMPLEMENT_VERBS = new Set([
  'allow', 'call', 'consider', 'encourage', 'expect', 'help', 'keep', 'make', 'treat',
])

const AUXILIARIES = new Set([
  'am', 'are', 'be', 'been', 'being', 'can', 'could', 'did', 'do', 'does',
  'had', 'has', 'have', 'is', 'may', 'might', 'must', 'shall', 'should',
  'was', 'were', 'will', 'would', 'cannot',
])

const IRREGULAR_VERBS = new Set([
  'became', 'began', 'begun', 'brought', 'built', 'came', 'chose', 'did', 'felt',
  'forgot', 'found', 'gave', 'grew', 'had', 'held', 'kept', 'knew', 'led', 'left',
  'made', 'met', 'paid', 'put', 'ran', 'read', 'said', 'saw', 'sent',
  'showed', 'stood', 'taught', 'thought', 'told', 'took', 'understood',
  'went', 'wrote',
])

const IRREGULAR_LEMMAS = {
  am: 'be', are: 'be', became: 'become', been: 'be', began: 'begin',
  begun: 'begin', brought: 'bring', built: 'build', came: 'come', chose: 'choose', did: 'do',
  does: 'do', felt: 'feel', forgot: 'forget', found: 'find', gave: 'give', grew: 'grow',
  had: 'have', has: 'have', held: 'hold', is: 'be', kept: 'keep', knew: 'know',
  led: 'lead', left: 'leave', made: 'make', met: 'meet', paid: 'pay',
  ran: 'run', said: 'say', saw: 'see', sent: 'send', showed: 'show',
  stood: 'stand', taught: 'teach', thought: 'think', told: 'tell', took: 'take',
  understood: 'understand', was: 'be', were: 'be', went: 'go', wrote: 'write',
}

const MID_SENTENCE_ADVERBS = new Set([
  'also', 'always', 'already', 'automatically', 'clearly', 'consequently',
  'effectively', 'equally', 'even', 'frequently', 'generally', 'hardly',
  'never', 'normally', 'now', 'often', 'only', 'probably', 'rarely', 'really',
  'sometimes', 'still', 'then', 'therefore', 'traditionally', 'usually',
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

  if (/^[A-Za-z'’-]+ing\b/i.test(body)) {
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

export function analyzeReadingSentence(sentence) {
  const split = splitEnglish(sentence)
  const japanese = alignJapanese(split, sentence)
  const classifications = split.map((unit, index) => classifyUnit(unit, index, split))
  const blocks = split.map((unit, index) => {
    const classification = classifications[index]
    const inheritedSubject =
      classification.kind === 'core' &&
      startsWithPredicate(unit.text) &&
      classifications.slice(0, index).some((item) => item.role === 'S')
    const svoc = classification.kind === 'phrase'
      ? { parts: [{ role: classification.role, text: bare(unit.text) }], pattern: classification.role, name: classification.label }
      : analyzeSvoc(unit.text, { implicitSubject: inheritedSubject })
    return {
      id: index,
      en: bare(unit.text),
      ja: unit.manualJa ?? japanese[index]?.text ?? roughJapanese(unit.text, sentence.gloss),
      jaSource: unit.manualJa ? 'manual' : (japanese[index]?.source ?? 'gloss'),
      displayEn: classification.kind === 'core'
        ? displayCoreWithEmbeddedClause(unit.text, svoc)
        : displayText(unit.text, classification.kind),
      ...classification,
      svoc,
    }
  })

  return {
    blocks,
    marked: blocks.map((block) => block.displayEn).join(' '),
    pattern: sentencePattern(blocks),
    mainPattern: mainClausePattern(blocks),
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
