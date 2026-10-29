// 基礎長文の一文の構文解説を、構造台帳だけから組み立てる（名作の英語と同じ作り。自動の解析器は使わない）。
// 長文の構文解説と同じ部品（ReadingSentenceDetail）へ渡す形にそろえる。
import { basicReadingStructureEntry } from '../data/basic-reading/structures/index.js'
import { READING_RULE_PHASES, READING_RULES, readingRulesForSentence } from '../data/reading-rules.js'
import { resolvePassageWord } from '../data/passage-gloss.js'
import { buildSentenceStructure, structureRolesForPhrases } from './reading-sentence-structure.js'
import { resolveBasicReadingToken } from './basicReading.js'

const CACHE = new Map()

/** 一文の構文解説に渡す文（reviewId は「長文id#文の番号」）。 */
export function basicReadingSentence(passage, index) {
  const sentence = passage?.sentences?.[index]
  if (!sentence) return null
  return { ...sentence, reviewId: `${passage.id}#${index + 1}`, gloss: {} }
}

/** 台帳に読解ルールを書いていない文は、その文を使う基礎長文のルールの学習から選ぶ。 */
function rulesFor(passage, index, entry) {
  if (entry.rules?.length) return entry.rules
  const rules = passage.lessons.filter((lesson) => lesson.sentences.includes(index)).map((lesson) => lesson.rule)
  return rules.length ? rules : null
}

export function analyzeBasicReadingSentence(passage, index) {
  const key = `${passage?.id}#${index}`
  if (CACHE.has(key)) return CACHE.get(key)
  const sentence = passage?.sentences?.[index]
  const entry = basicReadingStructureEntry(passage?.id, index)
  if (!sentence || !entry) return null
  const structure = buildSentenceStructure(sentence.en, entry.markup, { ...entry, rules: rulesFor(passage, index, entry) })
  const meaningPhraseSequence = Object.freeze((entry.chunks ?? []).map((chunk, chunkIndex) => Object.freeze({
    id: `${key}-${chunkIndex}`,
    en: chunk.en,
    spokenEn: chunk.en,
    displayEn: chunk.displayEn ?? chunk.en,
    ja: chunk.ja,
    status: 'confirmed',
    reviewState: 'reviewed',
    label: '',
    pattern: '',
  })))
  const analysis = Object.freeze({
    structure,
    structurePhrases: Object.freeze(structureRolesForPhrases(structure, meaningPhraseSequence)),
    meaningPhraseSequence,
    blocks: Object.freeze([]),
    phraseMethod: 'basic-reading-structure-ledger',
    marked: structure.marked,
    structureTokens: structure.structureTokens,
  })
  CACHE.set(key, analysis)
  return analysis
}

/** 一文の構文解説で押した語の意味（基礎長文の forms・固有名詞を先に見る）。 */
export function basicReadingWordMeaning(passage, key) {
  const word = resolveBasicReadingToken(key, passage)
  if (word) return { id: word.id, ja: word.meaning }
  return resolvePassageWord(key)
}

const PHASE_ORDER = new Map(READING_RULE_PHASES.map((phase, index) => [phase.id, index]))
const RULE_ORDER = new Map(READING_RULES.map((rule, index) => [rule.id, index]))

/**
 * 読解の準備に出す「この本文で使う読解ルール」。一文の構文解説が文ごとに出すルール（同じ選び方）と、
 * ルールの問題で学ぶ3つを集める。段の順に並べ、段の中は問題で学ぶルール→本文で出会う文の多い順。
 * 返す形は { rule, lesson（問題で学ぶか）, sentences（そのルールが出る文の番号、1から）}。
 */
export function basicReadingPassageRules(passage) {
  const uses = new Map()
  const use = (rule) => {
    if (!uses.has(rule.id)) uses.set(rule.id, { rule, lesson: false, sentences: [] })
    return uses.get(rule.id)
  }
  for (const index of (passage?.sentences ?? []).keys()) {
    const analysis = analyzeBasicReadingSentence(passage, index)
    for (const rule of readingRulesForSentence(basicReadingSentence(passage, index), 3, analysis?.structure ?? null)) {
      use(rule).sentences.push(index + 1)
    }
  }
  for (const lesson of passage?.lessons ?? []) {
    const rule = READING_RULES.find((item) => item.id === lesson.rule)
    if (rule) use(rule).lesson = true
  }
  return [...uses.values()].sort((a, b) => (
    PHASE_ORDER.get(a.rule.phase) - PHASE_ORDER.get(b.rule.phase) ||
    Number(b.lesson) - Number(a.lesson) ||
    b.sentences.length - a.sentences.length ||
    RULE_ORDER.get(a.rule.id) - RULE_ORDER.get(b.rule.id)
  ))
}
