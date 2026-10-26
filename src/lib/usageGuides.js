// 使い分けカード（data/usage-guides.js）を、語・熟語から引く。
// 関連語の欄では、カードに入っている相手の行に「使い分けカード」を添え、ほかの欄に出ない相手も並べる。
import { getWord } from '../data/vocab.js'
import { getPhrase } from '../data/phrases.js'
import { USAGE_GUIDES_BY_PHRASE, USAGE_GUIDES_BY_WORD } from '../data/usage-guides.js'

/** 見出し語が入っている使い分けカード。 */
export function usageGuidesForWord(word) {
  if (!word?.id || word.custom) return []
  return USAGE_GUIDES_BY_WORD[word.id] ?? []
}

/** 熟語・構文が入っている使い分けカード。 */
export function usageGuidesForPhrase(phrase) {
  if (!phrase?.id) return []
  return USAGE_GUIDES_BY_PHRASE[phrase.id] ?? []
}

/**
 * カードに入っている、自分以外の語と熟語（カードの並び順）。
 * self は { wordId } か { phraseId }。
 */
export function usageGuideMembers(guide, self = {}) {
  return [
    ...guide.wordIds.filter((id) => id !== self.wordId).map((id) => getWord(id)).filter(Boolean).map((word) => ({ kind: 'word', id: word.id, text: word.word, entry: word })),
    ...guide.phraseIds.filter((id) => id !== self.phraseId).map((id) => getPhrase(id)).filter(Boolean).map((phrase) => ({ kind: 'phrase', id: phrase.id, text: phrase.phrase, entry: phrase })),
  ]
}

const spelling = (text) => String(text ?? '').trim().toLowerCase()

/**
 * guides のうち、相手（つづり・見出し語の id・熟語の id のどれか）が入っているカード。
 * 関連語の行は、類義語欄のようにつづりしか持たない行もあるので、つづりでも引く。
 */
export function usageGuidesWith(guides, { text = '', wordId = null, phraseId = null } = {}) {
  const key = spelling(text)
  return guides.filter((guide) => (
    (wordId && guide.wordIds.includes(wordId)) ||
    (phraseId && guide.phraseIds.includes(phraseId)) ||
    (key && guide.wordIds.some((id) => spelling(getWord(id)?.word) === key))
  ))
}
