import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { HETERONYMS, HETERONYM_CANDIDATES_REVIEWED } from '../src/data/heteronyms.js'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { exampleSpeechAllowed, heteronymFor, isAmbiguousSpeechText } from '../src/lib/speechGuard.js'
import { heteronymCandidateReasons } from '../scripts/heteronym-candidates.mjs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const PHONETIC = /^\/[^/\s][^/]*\/$/u

const wordsBySpelling = new Map()
for (const word of ALL_WORDS) {
  const key = word.word.toLowerCase()
  if (!wordsBySpelling.has(key)) wordsBySpelling.set(key, [])
  wordsBySpelling.get(key).push(word)
}

test('使い方で発音が変わる語は、単語だけでは読み上げない', () => {
  for (const text of ['record', 'Record.', ' records ', 'row', 'rows', 'read', 'excuses', 'lives', 'minute']) {
    assert.equal(isAmbiguousSpeechText(text), true, text)
  }
  for (const text of ['recorded', 'apple', 'I record music every week.', 'read aloud', 'rowing', 'as', 'news']) {
    assert.equal(isAmbiguousSpeechText(text), false, text)
  }
  assert.equal(isAmbiguousSpeechText('record', 'ja-JP'), false)
  // 文の中でも品詞では読み分けられない語は、カードの例文も読まない。
  assert.equal(exampleSpeechAllowed(getWord('row_2')), false)
  assert.equal(exampleSpeechAllowed(getWord('tear')), false)
  assert.equal(exampleSpeechAllowed(getWord('record')), true)
  assert.equal(exampleSpeechAllowed(getWord('apple')), true)
  assert.deepEqual(heteronymFor(getWord('row_2')).readings.map((reading) => reading.phonetic), ['/ˈɹoʊ/', '/ˈɹaʊ/'])
})

test('読み分けの台帳は、カードの発音記号とそろっている', () => {
  for (const [spelling, entry] of Object.entries(HETERONYMS)) {
    assert.ok(wordsBySpelling.has(spelling), `${spelling} が辞書にない`)
    assert.ok(entry.readings.length >= 2, spelling)
    const phonetics = entry.readings.map((reading) => reading.phonetic)
    assert.equal(new Set(phonetics).size, phonetics.length, spelling)
    for (const reading of entry.readings) {
      assert.match(reading.phonetic, PHONETIC, spelling)
      assert.ok(reading.use.trim(), spelling)
    }
    for (const word of wordsBySpelling.get(spelling)) {
      assert.ok(phonetics.includes(word.phonetic), `${word.id} の ${word.phonetic} が読み分け ${phonetics.join(' ')} にない`)
    }
  }
  // 同じつづりで発音記号がちがう見出し語（row と row_2 など）は、必ず台帳に載せる。
  for (const [spelling, words] of wordsBySpelling) {
    if (new Set(words.map((word) => word.phonetic)).size > 1) assert.ok(HETERONYMS[spelling], spelling)
  }
  // カードの意味と食い違っていた発音記号（2026-09-16 に直した例）。
  assert.equal(getWord('minute').phonetic, '/ˈmɪnət/')
  assert.equal(getWord('subject').phonetic, '/ˈsʌbdʒɪkt/')
  assert.equal(getWord('estimate').phonetic, '/ˈɛstəˌmeɪt/')
  assert.equal(getWord('sow').phonetic, '/ˈsoʊ/')
  assert.equal(getWord('wound').phonetic, '/ˈwund/')
})

test('発音辞書で読みが分かれる見出し語は、台帳に載せるか、見直した記録に置く', () => {
  const reviewed = new Set(HETERONYM_CANDIDATES_REVIEWED)
  const spellings = [...wordsBySpelling.keys()].filter((spelling) => /^[a-z]+$/.test(spelling))
  const unreviewed = spellings.filter((spelling) =>
    heteronymCandidateReasons(spelling).length && !HETERONYMS[spelling] && !reviewed.has(spelling))
  assert.deepEqual(unreviewed, [], '読みが分かれる語 → heteronyms.js の HETERONYMS か HETERONYM_CANDIDATES_REVIEWED に置く')
  for (const spelling of reviewed) {
    assert.equal(Boolean(HETERONYMS[spelling]), false, `${spelling} が台帳と見直した記録の両方にある`)
    assert.ok(wordsBySpelling.has(spelling), `${spelling} は見出し語にない → 見直した記録から消す`)
  }
})

test('-ate で終わる動詞の発音記号は /eɪt/ で終わる', () => {
  const wrong = ALL_WORDS
    .filter((word) => word.pos === '動' && /^[a-z]{3,}ate$/.test(word.word))
    .filter((word) => !/eɪt\/$/.test(word.phonetic))
    .map((word) => `${word.id} ${word.phonetic}`)
  assert.deepEqual(wrong, [])
})

test('読み上げボタンと再生パネルは判定を通し、単語カード・テスト・辞書ページは読み分けを出す', () => {
  assert.match(read('src/components/SpeakButton.jsx'), /isAmbiguousSpeechText\(text, lang\)/)
  assert.match(read('src/lib/speech-player.js'), /isAmbiguousSpeechText\(segment\.text, segment\.lang\)/)
  for (const path of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx', 'src/screens/VocabQuiz.jsx']) {
    assert.match(read(path), /<PronunciationNote word=\{word\}/, path)
  }
  for (const path of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']) {
    assert.match(read(path), /exampleSpeechAllowed\(word\)/, path)
  }
})
