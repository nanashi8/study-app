// 名作（英語）の一文の構文解説を、構造台帳だけから組み立てる。
// 長文の構文解説と同じ部品（ReadingSentenceDetail）へ渡す形にそろえる。語順訳は台帳の chunks
// （＝交互朗読の区切り）で、自動の解析器は使わない。

import {
  buildSentenceStructure,
  structureRolesForPhrases,
} from './reading-sentence-structure.js'

const CACHE = new WeakMap()

export function analyzeLiteratureSentence(sentence) {
  if (!sentence?.entry) return null
  if (CACHE.has(sentence)) return CACHE.get(sentence)
  const entry = sentence.entry
  const structure = buildSentenceStructure(sentence.en, entry.markup, entry)
  const meaningPhraseSequence = Object.freeze((entry.chunks ?? []).map((chunk, index) => Object.freeze({
    id: `${sentence.id}-${index}`,
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
    phraseMethod: 'literature-structure-ledger',
    marked: structure.marked,
    structureTokens: structure.structureTokens,
  })
  CACHE.set(sentence, analysis)
  return analysis
}
