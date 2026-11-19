import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { MEANING_SPEECH_KANA } from '../src/data/meaning-speech-kana.js'
import { applyMeaningSpeechKana, cardJapaneseSpeechTexts, cardSpeechItems } from '../src/lib/cardSpeech.js'
import { meaningSpeechKanaProblems, reviewProblems } from '../scripts/checks/meaning-speech-kana.mjs'

const review = JSON.parse(readFileSync(new URL('../docs/audits/meaning-speech-kana-review.json', import.meta.url), 'utf8'))
const spokenMeaning = (id) => {
  const word = getWord(id)
  return cardJapaneseSpeechTexts({ id: word.id, meanings: word.meanings, meaningReadings: true }).meaning
}

test('英単語の全見出し語で、意味の漢字はすべて台帳のかなで読み、声に漢字の読みを決めさせない', () => {
  const { problems, wordsWithKanji, runs } = meaningSpeechKanaProblems()
  assert.deepEqual(problems, [])
  assert.equal(ALL_WORDS.length, 8929)
  // 意味を足したり書き直したりして数が変わったら、その語の読みを文の中で読んで台帳へ足し、--stamp で押し直す。
  assert.equal(wordsWithKanji, 8325)
  assert.equal(runs, 16322)
  assert.equal(Object.keys(MEANING_SPEECH_KANA).length, 8325)
  const withKanji = ALL_WORDS.filter((word) => /\p{Script=Han}/u.test(spokenMeaning(word.id)))
  assert.deepEqual(withKanji.map((word) => word.id), [])
})

test('台帳は人が全件読んだ版のままで、読んで直した読みが入っている', () => {
  assert.deepEqual(reviewProblems(review), [])
  assert.equal(review.population.reviewedGroups, 9702)
  assert.equal(review.corrections.length, 154)
})

test('辞書も端末の声も読み違える語を、文の中の読みで読む（画面の文字は変えない）', () => {
  assert.equal(spokenMeaning('step'), 'かいだん、いっぽ、だんかい')
  assert.equal(spokenMeaning('treasure'), 'たからもの、ざいほう')
  assert.equal(spokenMeaning('pair'), 'ひとくみ、いっつい')
  assert.equal(spokenMeaning('edge'), 'はし、ふち、は')
  assert.equal(spokenMeaning('sphere'), 'きゅう、りょういき、ぶんや')
  assert.equal(spokenMeaning('japanese'), 'にほんご、にほんじん、にほんの')
  assert.equal(spokenMeaning('monday'), 'げつようび')
  assert.deepEqual(getWord('step').meanings, ['階段', '一歩', '段階'])
  // 暗記カード・辞書ページの読み上げ列（cardSpeechItems）にも、かなの意味が入る。
  const word = getWord('treasure')
  const items = cardSpeechItems({
    id: word.id, head: word.word, meanings: word.meanings, meaningReadings: true, example: word.example, range: 'meaning', answerOpen: true,
  })
  assert.deepEqual(items[0].segments.filter((segment) => segment.lang === 'ja-JP').map((segment) => segment.text), ['たからもの、ざいほう'])
})

test('意味を書き直して台帳と合わなくなった文は、読みを当てずにそのまま返す（テストが止める）', () => {
  assert.equal(applyMeaningSpeechKana('一歩、段階', '一歩=いっぽ,段階=だんかい'), 'いっぽ、だんかい')
  assert.equal(applyMeaningSpeechKana('一歩、前進', '一歩=いっぽ,段階=だんかい'), '一歩、前進')
  assert.equal(applyMeaningSpeechKana('一歩', '一歩=いっぽ,段階=だんかい'), '一歩')
  // 熟語・構文や自作単語（meaningReadings なし・台帳なし）は、これまでどおりの文。
  assert.equal(cardJapaneseSpeechTexts({ id: 'custom-1', meanings: ['一歩'], meaningReadings: true }).meaning, '一歩')
})

test('英単語の意味を読む画面は、すべて英単語の読み（meaningReadings）で読み上げ列を作る', () => {
  for (const file of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    const calls = source.split('cardSpeechItems({').slice(1)
    assert.ok(calls.length >= 1, file)
    for (const call of calls) assert.match(call.slice(0, 400), /meaningReadings: true/, file)
  }
  // ほかに英単語の意味を cardSpeechItems で読む画面ができたら、ここに足す。
  const users = ['src/screens/PhraseStudy.jsx', 'src/components/PhraseDetailSheet.jsx', 'src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']
  for (const file of users) assert.match(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), /cardSpeechItems/)
})
