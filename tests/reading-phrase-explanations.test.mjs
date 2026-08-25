import test from 'node:test'
import assert from 'node:assert/strict'

import { PASSAGES } from '../src/data/passages.js'
import {
  READING_PHRASE_EXPLANATIONS,
  READING_PHRASE_OPEN_QUESTIONS,
} from '../src/data/reading-phrase-explanations.js'
import { READING_PHRASE_RULES } from '../src/data/reading-phrase-rules.js'
import {
  READING_CONNECTOR_CLOSURE_REVIEWS,
  READING_CONNECTOR_NO_BACK_REFERENCE_REVIEWS,
} from '../src/data/reading-connector-closure-reviews.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'
import { japanesePhraseSpeechText } from '../src/lib/phrase-speech.js'

const words = (text) =>
  (text.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []).map((word) => word.toLowerCase())

const sentenceByEnglish = (english) => PASSAGES
  .flatMap((passage) => passage.sentences)
  .find((sentence) => sentence.en === english)

const guideBySentence = () => Object.fromEntries(
  READING_PHRASE_EXPLANATIONS.map((guide) => [guide.sentence, guide]),
)

test('12文の回帰例は全794文と同じ意味・発音フレーズ列へ接続する', () => {
  assert.equal(READING_PHRASE_EXPLANATIONS.length, 12)

  for (const guide of READING_PHRASE_EXPLANATIONS) {
    const sentence = sentenceByEnglish(guide.sentence)
    assert.ok(sentence, `長文中に回帰例がない: ${guide.sentence}`)
    assert.deepEqual(
      guide.phrases.flatMap((phrase) => words(phrase.en)),
      words(guide.sentence),
      `${guide.id}: 回帰例を連結しても原文を復元できない`,
    )
    assert.ok(guide.phrases.every((phrase) =>
      phrase.en && phrase.ja && phrase.grammar && phrase.spokenEn === phrase.en))

    const analysis = analyzeReadingSentence(sentence)
    assert.equal(analysis.phraseExplanationGuide, guide)
    assert.match(analysis.phraseMethod, /^corpus-meaning-phrase-(?:reviewed|confirmed)$/)
    const visibleFields = ({ en, roles, ja, displayEn, spokenEn }) => ({
      en, roles, ja, displayEn, spokenEn,
    })
    assert.deepEqual(
      analysis.meaningPhraseSequence.map(visibleFields),
      guide.phrases.map(visibleFields),
      `${guide.id}: 実出力が回帰例の英語・内部役割・日本語・表示・音声と一致しない`,
    )
    assert.ok(analysis.meaningPhraseSequence.every((phrase) =>
      ['reviewed', 'confirmed'].includes(phrase.status) && phrase.reviewState))
  }
})

test('SVOCMを機械的に分断せず、発音できて意味が通るまとまりを固定する', () => {
  const bySentence = guideBySentence()

  assert.deepEqual(
    bySentence['She goes to school by bus every morning.'].phrases
      .map(({ en, roles, ja }) => ({ en, roles, ja })),
    [
      { en: 'She goes', roles: ['S', 'V'], ja: '彼女は行きます' },
      { en: 'to school', roles: ['M'], ja: '学校へ' },
      { en: 'by bus', roles: ['M'], ja: 'バスで' },
      { en: 'every morning', roles: ['M'], ja: '毎朝' },
    ],
  )

  assert.deepEqual(
    bySentence['Rina is a junior high school student.'].phrases
      .map(({ en, roles, ja }) => ({ en, roles, ja })),
    [
      { en: 'Rina is', roles: ['S', 'V'], ja: 'リナは〜です（内容は次へ）' },
      { en: 'a junior high school student', roles: ['C'], ja: '一人の中学生' },
    ],
  )

  assert.deepEqual(
    bySentence['She likes English because her teacher uses many pictures.'].phrases
      .map(({ en, roles }) => [en, roles]),
    [
      ['She', ['S']], ['likes English', ['V', 'O']], ['because', ['LINK']],
      ['her teacher', ['S']], ['uses many pictures', ['V', 'O']],
    ],
  )
})

test('形式目的語・共有to・比較・前置詞＋whatの確定例を回帰固定する', () => {
  const bySentence = guideBySentence()
  const evidence = bySentence[
    'This evidence makes it easier to improve a design or decide that a simpler solution would work better.'
  ]
  assert.deepEqual(
    evidence.phrases.map(({ en, roles }) => [en, roles]),
    [
      ['This evidence', ['S']], ['makes it easier', ['V', 'O', 'C']],
      ['to improve a design', ['V', 'O']], ['or', ['LINK']],
      ['decide that', ['V', 'LINK']], ['a simpler solution would work', ['S', 'V']],
      ['better', ['M']],
    ],
  )
  const decide = evidence.phrases.find((phrase) => phrase.en === 'decide that')
  assert.equal(decide.displayEn, '(to) decide that')
  assert.equal(decide.spokenEn, 'decide that')
  assert.match(decide.grammar, /二つ目のto|省略|並列/)
  assert.equal(evidence.phrases.find((phrase) => phrase.en === 'better')?.ja,
    'よりうまく（機能するだろう）')

  const memory = bySentence[
    'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.'
  ]
  assert.deepEqual(memory.phrases.map((phrase) => phrase.en), [
    'The integrity of public memory', 'is then shaped', 'less', 'by what',
    'is available', 'than', 'by what', 'is repeatedly presented', 'as relevant',
  ])
  assert.equal(memory.phrases[3].ja, 'あるものによって')
  assert.deepEqual(memory.phrases[8].roles, ['C'])

  const learn = bySentence[
    'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.'
  ]
  assert.deepEqual(learn.phrases.slice(-4).map(({ en, roles }) => [en, roles]), [
    ['societies from losing their ability', ['O', 'M']],
    ['to learn', ['V']],
    ['from what', ['M']],
    ['they once knew', ['S', 'M', 'V']],
  ])
})

test('方法台帳は確定事項と真の未解決事項だけを区別する', () => {
  assert.equal(new Set(READING_PHRASE_RULES.map((item) => item.id)).size, READING_PHRASE_RULES.length)
  assert.ok(READING_PHRASE_RULES.every((item) =>
    item.id && item.appliesTo && item.example && item.decision &&
    ['confirmed', 'review-needed'].includes(item.status)))
  assert.equal(
    READING_PHRASE_RULES.find((item) => item.id === 'subject-verb-role-boundary')?.status,
    'confirmed',
  )
  assert.equal(
    READING_PHRASE_RULES.find((item) => item.id === 'adverb-inside-verb-group')?.status,
    'confirmed',
  )
  assert.equal(
    READING_PHRASE_RULES.find((item) => item.id === 'connector-closure-back-reference')?.status,
    'confirmed',
  )
  assert.deepEqual(READING_PHRASE_OPEN_QUESTIONS, [])
  assert.ok(READING_PHRASE_OPEN_QUESTIONS.every((item) =>
    item.example && item.proposal && item.alternative && item.reason))
})

test('接続関係144件を全件判定し、必要な63件だけを括弧で受け直す', () => {
  assert.equal(READING_CONNECTOR_CLOSURE_REVIEWS.length, 63)
  assert.equal(READING_CONNECTOR_NO_BACK_REFERENCE_REVIEWS.length, 81)
  assert.ok([
    ...READING_CONNECTOR_CLOSURE_REVIEWS,
    ...READING_CONNECTOR_NO_BACK_REFERENCE_REVIEWS,
  ].every((item) => item.status === 'confirmed'))

  for (const review of READING_CONNECTOR_CLOSURE_REVIEWS) {
    const phrase = analyzeReadingSentence(sentenceByEnglish(review.sentence)).phraseSequence
      .find((item) => words(item.en).join(' ') === words(review.target).join(' '))
    assert.ok(phrase, `${review.connector}: ${review.target}`)
    assert.equal(phrase.ja, review.ja)
    assert.deepEqual(phrase.closureBinding, review.closureBinding)
    assert.match(phrase.ja, /（[^）]+）/u)
    assert.equal(
      japanesePhraseSpeechText(phrase.ja),
      phrase.ja.replace(/[（）()]/gu, ''),
    )
  }
})
