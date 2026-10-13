// node のテストで、画面の englishWordList.js と同じ英語の単語表を作る（画面は vite が JSON を配るので、node では直接読む）。
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

import { buildEnglishWordSet, ENGLISH_WORD_LIST_FILES } from '../src/lib/englishWordList.js'

const require = createRequire(import.meta.url)

export function englishWordSetForTests() {
  return buildEnglishWordSet(ENGLISH_WORD_LIST_FILES.map((file) => (
    JSON.parse(readFileSync(require.resolve(`wordlist-english/${file}`), 'utf8'))
  )))
}

// 画面の読み込み（LIST_LOADERS）が、ENGLISH_WORD_LIST_FILES と同じファイルを読むか。
export function screenLoaderFiles() {
  const source = readFileSync(new URL('../src/lib/englishWordList.js', import.meta.url), 'utf8')
  return [...source.matchAll(/import\('wordlist-english\/([^']+)'\)/g)].map((match) => match[1])
}
