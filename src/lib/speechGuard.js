// 使い方（品詞・意味・時制）で発音が変わる英単語（src/data/heteronyms.js）を、単語だけで読み上げないための判定。
// 単語だけでは、どちらの発音で読むかがつづりから決まらない。文なら前後から読み分けられるので、文は対象にしない。
import { HETERONYMS } from '../data/heteronyms.js'

const tokenOf = (text) => String(text ?? '')
  .trim()
  .toLowerCase()
  .replace(/^[^a-z]+|[^a-z]+$/g, '')

/** 見出し語（または英単語の文字列）の読み分け。台帳にない語は null。 */
export function heteronymFor(wordOrText) {
  const text = typeof wordOrText === 'string' ? wordOrText : wordOrText?.word
  return HETERONYMS[tokenOf(text)] ?? null
}

/**
 * 英語の1語だけの読み上げで、つづりから発音が決まらない語か。
 * 複数形・三人称単数（records・uses）も、名詞か動詞かが決まらないので同じに扱う。
 */
export function isAmbiguousSpeechText(text, lang = 'en-US') {
  if (!/^en/i.test(String(lang || 'en-US'))) return false
  const token = tokenOf(text)
  if (!/^[a-z]+$/.test(token)) return false
  return Boolean(
    HETERONYMS[token] ||
    (token.endsWith('es') && HETERONYMS[token.slice(0, -2)]) ||
    (token.endsWith('s') && HETERONYMS[token.slice(0, -1)]),
  )
}

/** カードの例文を読み上げてよいか。文の中でも読み分けられない語（row の「列」と「口論」など）は読まない。 */
export const exampleSpeechAllowed = (word) => heteronymFor(word)?.exampleSpeech !== false
