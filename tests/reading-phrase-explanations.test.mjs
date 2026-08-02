import test from 'node:test'
import assert from 'node:assert/strict'

import { PASSAGES } from '../src/data/passages.js'
import {
  READING_PHRASE_EXPLANATIONS,
  READING_PHRASE_OPEN_QUESTIONS,
} from '../src/data/reading-phrase-explanations.js'
import { READING_PHRASE_RULES } from '../src/data/reading-phrase-rules.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'

const words = (text) =>
  (text.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []).map((word) => word.toLowerCase())

const sentenceByEnglish = (english) => PASSAGES
  .flatMap((passage) => passage.sentences)
  .find((sentence) => sentence.en === english)

const guideBySentence = () => Object.fromEntries(
  READING_PHRASE_EXPLANATIONS.map((guide) => [guide.sentence, guide]),
)

test('12文の回帰例は全363文と同じSVOCM役割列へ接続する', () => {
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
    assert.match(analysis.phraseMethod, /^corpus-svocm-(?:reviewed|confirmed)$/)
    const visibleFields = ({ en, role, ja, displayEn, spokenEn }) => ({
      en, role, ja, displayEn, spokenEn,
    })
    assert.deepEqual(
      analysis.phraseSequence.map(visibleFields),
      guide.phrases.map(visibleFields),
      `${guide.id}: 実出力が回帰例の英語・役割・直訳・表示・音声と一致しない`,
    )
    assert.ok(analysis.phraseSequence.every((phrase) =>
      ['reviewed', 'confirmed'].includes(phrase.status) && phrase.reviewState))
  }
})

test('SとVを一律結合せず、S→V→O/C/Mの役割境界を固定する', () => {
  const bySentence = guideBySentence()

  assert.deepEqual(
    bySentence['She goes to school by bus every morning.'].phrases
      .map(({ en, role, ja }) => ({ en, role, ja })),
    [
      { en: 'She', role: 'S', ja: '彼女は' },
      { en: 'goes', role: 'V', ja: '行きます' },
      { en: 'to school', role: 'M', ja: '学校へ' },
      { en: 'by bus', role: 'M', ja: 'バスで' },
      { en: 'every morning', role: 'M', ja: '毎朝' },
    ],
  )

  assert.deepEqual(
    bySentence['Rina is a junior high school student.'].phrases
      .map(({ en, role, ja }) => ({ en, role, ja })),
    [
      { en: 'Rina', role: 'S', ja: 'リナは' },
      { en: 'is', role: 'V', ja: '〜です（内容は次へ）' },
      { en: 'a junior high school student', role: 'C', ja: '一人の中学生' },
    ],
  )

  assert.deepEqual(
    bySentence['She likes English because her teacher uses many pictures.'].phrases
      .map(({ en, role }) => [en, role]),
    [
      ['She', 'S'], ['likes', 'V'], ['English', 'O'], ['because', 'LINK'],
      ['her teacher', 'S'], ['uses', 'V'], ['many pictures', 'O'],
    ],
  )
})

test('形式目的語・共有to・比較・前置詞＋whatの確定例を回帰固定する', () => {
  const bySentence = guideBySentence()
  const evidence = bySentence[
    'This evidence makes it easier to improve a design or decide that a simpler solution would work better.'
  ]
  assert.deepEqual(
    evidence.phrases.map(({ en, role }) => [en, role]),
    [
      ['This evidence', 'S'], ['makes', 'V'], ['it', 'O'], ['easier', 'C'],
      ['to improve', 'V'], ['a design', 'O'], ['or', 'LINK'], ['decide', 'V'],
      ['that', 'LINK'], ['a simpler solution', 'S'], ['would work', 'V'], ['better', 'M'],
    ],
  )
  const decide = evidence.phrases.find((phrase) => phrase.en === 'decide')
  assert.equal(decide.displayEn, '(to) decide')
  assert.equal(decide.spokenEn, 'decide')
  assert.match(decide.grammar, /共通の to|共有to|共有され/)
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
  assert.equal(memory.phrases[8].role, 'C')

  const learn = bySentence[
    'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.'
  ]
  assert.deepEqual(learn.phrases.slice(-4).map(({ en, role }) => [en, role]), [
    ['from what', 'M'], ['they', 'S'], ['once', 'M'], ['knew', 'V'],
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
