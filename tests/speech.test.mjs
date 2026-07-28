import test from 'node:test'
import assert from 'node:assert/strict'
import {
  isRecognitionSupported,
  PRONUNCIATION_PASS_SCORE,
  scorePronunciation,
  startRecognition,
} from '../src/lib/speech.js'
import { ALL_WORDS, phoneticForWord } from '../src/data/vocab.js'

const resultList = (...alternatives) => {
  const result = alternatives.map(([transcript, confidence = 0]) => ({ transcript, confidence }))
  result.isFinal = true
  return [result]
}

test('音声認識の対応判定は実行時のブラウザ実装を見る', () => {
  const previousWindow = globalThis.window
  globalThis.window = {}
  assert.equal(isRecognitionSupported(), false)
  globalThis.window.SpeechRecognition = class {}
  assert.equal(isRecognitionSupported(), true)
  if (previousWindow === undefined) delete globalThis.window
  else globalThis.window = previousWindow
})

test('音声認識は複数候補を保持し、最初の候補を代表結果にする', async () => {
  class FakeRecognition {
    start() {
      this.onstart()
      this.onresult({ results: resultList(['right', 0.82], ['write', 0.61]) })
      this.onend()
    }
    stop() {}
    abort() {}
  }

  const { result } = startRecognition({}, FakeRecognition)
  assert.deepEqual(await result, {
    transcript: 'right',
    confidence: 0.82,
    alternatives: [
      { transcript: 'right', confidence: 0.82 },
      { transcript: 'write', confidence: 0.61 },
    ],
  })
})

test('開始直後の終了要求は認識開始後まで保留する', async () => {
  let instance
  class DelayedRecognition {
    constructor() {
      instance = this
      this.stopCount = 0
    }
    start() {}
    stop() {
      this.stopCount++
      this.onresult({ results: resultList(['book', 0.9]) })
      this.onend()
    }
    abort() {}
  }

  const controller = startRecognition({}, DelayedRecognition)
  controller.stop()
  assert.equal(instance.stopCount, 0)
  instance.onstart()
  assert.equal(instance.stopCount, 1)
  assert.equal((await controller.result).transcript, 'book')
})

test('認識が終了しない場合はタイムアウトして録音を解放する', async () => {
  let aborted = false
  class StuckRecognition {
    start() { this.onstart() }
    stop() {}
    abort() { aborted = true }
  }

  const { result } = startRecognition({ timeoutMs: 5 }, StuckRecognition)
  assert.deepEqual(await result, { error: 'timeout' })
  assert.equal(aborted, true)
})

test('認識候補の中から見出し語に最も近い結果を採用する', () => {
  const result = scorePronunciation('write', [
    { transcript: 'right' },
    { transcript: 'write' },
  ])
  assert.equal(result.score, 100)
  assert.equal(result.heard, 'write')
  assert.equal(result.candidateCount, 2)
})

test('同音異綴りはIPAが同じときだけ完全一致として扱う', () => {
  const phonetics = {
    write: '/ˈɹaɪt/',
    right: '/ˈɹaɪt/',
    wrong: '/ˈɹɔŋ/',
  }
  const homophone = scorePronunciation('write', 'right', {
    targetPhonetic: phonetics.write,
    phoneticFor: (word) => phonetics[word],
  })
  const different = scorePronunciation('write', 'wrong', {
    targetPhonetic: phonetics.write,
    phoneticFor: (word) => phonetics[word],
  })
  assert.equal(homophone.score, 100)
  assert.equal(homophone.matchedBySound, true)
  assert.ok(different.score < PRONUNCIATION_PASS_SCORE)
})

test('全見出し語の統合済みIPAを同音判定から参照できる', () => {
  const missing = ALL_WORDS.filter((word) => !phoneticForWord(word.word))
  assert.equal(missing.length, 0)
  assert.equal(phoneticForWord('write'), phoneticForWord('right'))
  assert.equal(phoneticForWord('sea'), phoneticForWord('see'))
})

test('ハイフン区切りと空白区切りは同じ語列として採点する', () => {
  const result = scorePronunciation('carbon-neutral', 'carbon neutral')
  assert.equal(result.score, 100)
  assert.equal(result.perWord.length, 2)
})

test('近い綴りでも合格基準未満なら正解にしない', () => {
  const result = scorePronunciation('book', 'look')
  assert.equal(result.score, 75)
  assert.equal(result.perWord[0].ok, false)
  assert.ok(result.score < PRONUNCIATION_PASS_SCORE)
})
