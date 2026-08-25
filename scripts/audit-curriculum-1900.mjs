import crypto from 'node:crypto'
import { ALL_WORDS } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { CURRICULUM_1900_WORDS } from '../src/data/words-curriculum-1900.js'
import { CURRICULUM_1900_IDIOMS } from '../src/data/phrases-curriculum-1900.js'
import {
  CURRICULUM_1900_PHRASE_RESOLUTIONS,
  CURRICULUM_1900_WORD_RESOLUTIONS,
} from '../src/data/curriculum-1900-resolutions.js'
import {
  CURRICULUM_1900_AUDIT_META,
  CURRICULUM_1900_PHRASE_TARGET_HASHES,
  CURRICULUM_1900_WORD_TARGET_HASHES,
} from './data/curriculum-1900-audit-hashes.js'

const clean = (value) => String(value ?? '')
  .normalize('NFKC')
  .replace(/[‘’]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/\s+/g, ' ')
  .trim()

const key = (value) => clean(value).toLowerCase()
const alphaKey = (value) => key(value).replace(/^[^a-z]+/, '')
const hash = (value) => crypto.createHash('sha256').update(key(value)).digest('hex').slice(0, 16)
const failures = []
const check = (condition, message) => {
  if (!condition) failures.push(message)
}

const uniqueWordIds = new Set(ALL_WORDS.map((item) => item.id))
const uniquePhraseIds = new Set(PHRASES.map((item) => item.id))
const appWordHashes = new Set(ALL_WORDS.map((item) => hash(item.word)))
const appPhraseHashes = new Set(PHRASES.map((item) => hash(item.phrase)))
const missingWordHashes = CURRICULUM_1900_WORD_TARGET_HASHES.filter((item) => !appWordHashes.has(item))
const missingPhraseHashes = CURRICULUM_1900_PHRASE_TARGET_HASHES.filter((item) => !appPhraseHashes.has(item))

check(CURRICULUM_1900_AUDIT_META.sourceRows.total === 4684, '添付3シートの有効行数が4,684件ではない')
check(CURRICULUM_1900_AUDIT_META.sourceUnique.total === 4428, '添付3シートのユニーク項目数が4,428件ではない')
check(CURRICULUM_1900_AUDIT_META.sourceOrderRetained === false, '出典順を保持しない契約が失われた')
check(
  CURRICULUM_1900_WORD_TARGET_HASHES.length === CURRICULUM_1900_AUDIT_META.canonicalTargets.words,
  '単語ターゲットハッシュ数が監査メタデータと一致しない',
)
check(
  CURRICULUM_1900_PHRASE_TARGET_HASHES.length === CURRICULUM_1900_AUDIT_META.canonicalTargets.phrases,
  '熟語ターゲットハッシュ数が監査メタデータと一致しない',
)
check(new Set(CURRICULUM_1900_WORD_TARGET_HASHES).size === CURRICULUM_1900_WORD_TARGET_HASHES.length, '単語ターゲットハッシュが重複している')
check(new Set(CURRICULUM_1900_PHRASE_TARGET_HASHES).size === CURRICULUM_1900_PHRASE_TARGET_HASHES.length, '熟語ターゲットハッシュが重複している')
check(missingWordHashes.length === 0, `未収録の単語ターゲットが${missingWordHashes.length}件ある`)
check(missingPhraseHashes.length === 0, `未収録の熟語ターゲットが${missingPhraseHashes.length}件ある`)
check(uniqueWordIds.size === ALL_WORDS.length, '全単語IDに重複がある')
check(uniquePhraseIds.size === PHRASES.length, '全熟語・構文IDに重複がある')

check(CURRICULUM_1900_WORDS.length === 420, `単語補完が420件ではない: ${CURRICULUM_1900_WORDS.length}`)
check(CURRICULUM_1900_IDIOMS.length === 604, `熟語補完が604件ではない: ${CURRICULUM_1900_IDIOMS.length}`)
const liveSupplementWords = CURRICULUM_1900_WORDS.map((item) =>
  ALL_WORDS.find((live) => live.id === item.id))
check(
  liveSupplementWords.every((item) =>
    item.curriculumSupplement && item.word && item.pos && item.level && item.meanings?.length &&
    item.example?.en && item.example?.ja && item.etymology?.note && item.phonetic),
  '単語補完に必須フィールドの欠落がある',
)
check(
  CURRICULUM_1900_IDIOMS.every((item) =>
    item.curriculumSupplement && item.phrase && item.level && item.meanings?.length &&
    item.example?.en && item.example?.ja && item.origin && item.note && item.category),
  '熟語補完に必須フィールドの欠落がある',
)
check(
  new Set(CURRICULUM_1900_WORDS.map((item) => item.example.en)).size === CURRICULUM_1900_WORDS.length,
  '単語補完の英語用例が重複している',
)
check(
  new Set(CURRICULUM_1900_IDIOMS.map((item) => item.example.en)).size === CURRICULUM_1900_IDIOMS.length,
  '熟語補完の英語用例が重複している',
)

const sortedWordHeads = [...CURRICULUM_1900_WORDS.map((item) => item.word)].sort((a, b) =>
  alphaKey(a).localeCompare(alphaKey(b), 'en', { sensitivity: 'base' }))
const sortedPhraseHeads = [...CURRICULUM_1900_IDIOMS.map((item) => item.phrase)].sort((a, b) =>
  alphaKey(a).localeCompare(alphaKey(b), 'en', { sensitivity: 'base' }))
check(sortedWordHeads.every((word, index) => word === CURRICULUM_1900_WORDS[index].word), '単語補完が独立した英字順ではない')
check(sortedPhraseHeads.every((phrase, index) => phrase === CURRICULUM_1900_IDIOMS[index].phrase), '熟語補完が独立した英字順ではない')

const wordByHead = new Set(ALL_WORDS.map((item) => key(item.word)))
const phraseByHead = new Set(PHRASES.map((item) => key(item.phrase)))
for (const [source, target] of Object.entries(CURRICULUM_1900_WORD_RESOLUTIONS)) {
  check(wordByHead.has(key(target)), `単語の正規形が見つからない: ${source} -> ${target}`)
}
for (const [source, target] of Object.entries(CURRICULUM_1900_PHRASE_RESOLUTIONS)) {
  check(phraseByHead.has(key(target)), `熟語の正規形が見つからない: ${source} -> ${target}`)
}

const levelCounts = Object.fromEntries(['5', '4', '3', 'pre2', '2', 'pre1', '1'].map((level) => [
  level,
  {
    words: CURRICULUM_1900_WORDS.filter((item) => item.level === level).length,
    phrases: CURRICULUM_1900_IDIOMS.filter((item) => item.level === level).length,
  },
]))

const result = {
  source: CURRICULUM_1900_AUDIT_META,
  app: { words: ALL_WORDS.length, phrases: PHRASES.length },
  coverage: {
    wordTargets: CURRICULUM_1900_WORD_TARGET_HASHES.length,
    phraseTargets: CURRICULUM_1900_PHRASE_TARGET_HASHES.length,
    missingWords: missingWordHashes.length,
    missingPhrases: missingPhraseHashes.length,
  },
  supplements: { words: CURRICULUM_1900_WORDS.length, phrases: CURRICULUM_1900_IDIOMS.length, levelCounts },
  failures,
}

console.log(JSON.stringify(result, null, 2))
if (failures.length) process.exitCode = 1
