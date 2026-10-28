// 基礎長文の一文の構文解説を、構造台帳だけから組み立てる（名作の英語と同じ作り。自動の解析器は使わない）。
// 長文の構文解説と同じ部品（ReadingSentenceDetail）へ渡す形にそろえる。
import { basicReadingStructureEntry } from '../data/basic-reading/structures/index.js'
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
