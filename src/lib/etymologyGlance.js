import { etymologyStoryForWord } from '../data/vocab.js'

/**
 * 一覧の1行に収める語源。手動で確かめた本文があればそれを出し、
 * 本文のない語は、いま開いている語根カードの「形＝意味」で代える。
 */
export function etymologyGlanceNote(word, card = null) {
  const note = etymologyStoryForWord(word)?.note
  if (note) return note
  if (card?.rootForm) return `${card.rootForm}（${card.rootMeaning}）から。`
  return ''
}
