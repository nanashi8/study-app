// 写真の文字の読み取り（vocabOcr.js）で、辞書にない語が「実在する英単語」かを確かめる単語表。
// wordlist-english（SCOWL の 10〜70 段。英米共通・米・英のつづり、語形変化を含む約11万語）を、
// 読み取りを始めたときにだけ読み込む（画面を開かない人には配らない）。出典はメニューの「出典」ページに載せる。
//
// 小文字の英字だけの語（ハイフン・アポストロフィつきを含む）を使う。OK・kHz などの略語と、
// café などアクセントつきの語は、読み取りの語（英字だけ）にならないので入れない。
const LIST_LOADERS = [
  () => import('wordlist-english/english-words-10.json'),
  () => import('wordlist-english/english-words-20.json'),
  () => import('wordlist-english/english-words-35.json'),
  () => import('wordlist-english/english-words-40.json'),
  () => import('wordlist-english/english-words-50.json'),
  () => import('wordlist-english/english-words-55.json'),
  () => import('wordlist-english/english-words-60.json'),
  () => import('wordlist-english/english-words-70.json'),
  () => import('wordlist-english/american-words-10.json'),
  () => import('wordlist-english/american-words-20.json'),
  () => import('wordlist-english/american-words-35.json'),
  () => import('wordlist-english/american-words-40.json'),
  () => import('wordlist-english/american-words-50.json'),
  () => import('wordlist-english/american-words-55.json'),
  () => import('wordlist-english/american-words-60.json'),
  () => import('wordlist-english/american-words-70.json'),
  () => import('wordlist-english/british-words-10.json'),
  () => import('wordlist-english/british-words-20.json'),
  () => import('wordlist-english/british-words-35.json'),
  () => import('wordlist-english/british-words-40.json'),
  () => import('wordlist-english/british-words-50.json'),
  () => import('wordlist-english/british-words-55.json'),
  () => import('wordlist-english/british-words-60.json'),
  () => import('wordlist-english/british-words-70.json'),
]

// 上の LIST_LOADERS が読むファイルの名前（node のテストは、このファイルを直接読んで同じ表を作る）。
export const ENGLISH_WORD_LIST_FILES = Object.freeze(['english', 'american', 'british'].flatMap((variant) => (
  [10, 20, 35, 40, 50, 55, 60, 70].map((size) => `${variant}-words-${size}.json`)
)))

const WORD = /^[a-z]+(?:['-][a-z]+)*$/

export function buildEnglishWordSet(lists) {
  const words = new Set()
  for (const list of lists) {
    for (const word of list) {
      if (WORD.test(word)) words.add(word)
    }
  }
  return words
}

let loading = null

// 画面（vite）から読む。JSON は vite が JS の部品にして配る（import の属性を付けると開発サーバーで読めない）。
export function loadEnglishWordSet() {
  loading ??= Promise.all(LIST_LOADERS.map((load) => load()))
    .then((modules) => buildEnglishWordSet(modules.map((module) => module.default)))
    .catch((reason) => {
      loading = null
      throw reason
    })
  return loading
}
