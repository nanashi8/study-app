// 変化形を読み上げてよいか。端末の声が正しく読めない形（使い方で発音が変わるつづり）は音声を出さず、
// 台帳（src/data/inflection-phonetics.js）の発音記号を見せる。
import { INFLECTION_PHONETICS } from '../data/inflection-phonetics.js'
import { isAmbiguousSpeechText } from './speechGuard.js'

/** 見出し語 wordId の「label」の形 text を、音声のかわりに発音記号で見せるときの発音記号。読み上げてよい形は null。 */
export function inflectionPhoneticFor(wordId, label, text) {
  if (!isAmbiguousSpeechText(text)) return null
  return INFLECTION_PHONETICS[`${wordId}|${label}`] ?? null
}
