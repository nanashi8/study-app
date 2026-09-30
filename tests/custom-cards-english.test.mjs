// 自作カードのテンプレート「英単語」（依頼台帳 requests/2026-09-30-custom-card-templates.json の english-template-full-info）。
// 利用者：「英単語で使われている情報を登録するテンプレートを表示させたり」。
// 英単語の辞書ページ・暗記カードに出る情報のうち、学習者が書ける16欄をすべて登録でき、
// 辞書ページと暗記カードの裏には16欄すべてを、テストの答え合わせには辞書の語と同じく意味と語の成り立ちを出す。
// 書く欄にしないもの（学習の記録・辞書の前後・同じつづりの別の語・語根カード・使い分けガイド・カタカナ語・読み分け）は、
// 辞書の並びや人が1語ずつ決めた台帳から出る欄なので、台帳の notes に理由を書いてある。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  CUSTOM_WORD_LIMITS,
  ENGLISH_WORD_FIELDS,
  ENGLISH_WORD_SECTIONS,
  customWordToStudyWord,
  normalizeCustomWord,
} from '../src/lib/customWords.js'
import { customWordInput } from '../src/lib/customEntryForm.js'
import { registerCustomWords } from '../src/data/vocab.js'
import { wordRelationsFor } from '../src/lib/wordRelations.js'
import { entryValues, startCustomCardBrowser } from './custom-cards-browser.mjs'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

// 16欄（英単語の辞書ページ・暗記カードが使う情報のうち、学習者が書けるもの）。
const ENGLISH_FIELD_KEYS = [
  'word', 'meanings', 'pos', 'level', 'field', 'phonetic', 'exampleEn', 'exampleJa', 'note',
  'otherSenses', 'derivatives', 'synonyms', 'antonyms', 'confusables', 'phrases', 'etymology',
]

// 16欄をすべて書いた英単語のカード（辞書に無いつづり）。
const VALUES = entryValues({
  front: 'glimmerous',
  back: 'かすかに光る・ほのかな',
  posId: '形',
  level: 'pre1',
  field: '自然・環境・地理',
  phonetic: '/ˈɡlɪmərəs/',
  example: 'A glimmerous light came from the window.',
  exampleTranslation: '窓からほのかな光がもれていた。',
  note: '詩や物語で使うことが多い',
  otherSenses: [{ pos: '名', meaning: 'かすかな光を放つもの' }],
  derivatives: [{ w: 'glimmer', m: 'かすかな光' }],
  synonyms: [{ w: 'faint', m: 'かすかな' }],
  antonyms: [{ w: 'bright', m: '明るい' }],
  confusables: [{ w: 'glamorous', m: '魅力的な' }],
  phrases: [{ phrase: 'a glimmerous hope', meaning: 'ほのかな希望' }],
  etymology: 'glimmer（かすかに光る）に、形容詞をつくる -ous がついた形。',
})

// 画面に出るはずの文（16欄の中身）。
const SHOWN = {
  word: 'glimmerous',
  meanings: 'かすかに光る・ほのかな',
  phonetic: '/ˈɡlɪmərəs/',
  level: '準1級',
  field: '自然・環境・地理',
  exampleEn: 'A glimmerous light came from the window.',
  exampleJa: '窓からほのかな光がもれていた。',
  note: '詩や物語で使うことが多い',
  otherSenses: 'かすかな光を放つもの',
  derivatives: 'glimmer',
  synonyms: 'faint',
  antonyms: 'bright',
  confusables: 'glamorous',
  phrases: 'a glimmerous hope',
  etymology: 'glimmer（かすかに光る）に、形容詞をつくる -ous がついた形。',
}

test('英単語のテンプレートは16欄で、まとまり（単語と意味・例文・関連する語・使い方と語の成り立ち）に分けて並べる', () => {
  assert.deepEqual(ENGLISH_WORD_FIELDS.map((item) => item.key), ENGLISH_FIELD_KEYS)
  assert.deepEqual(ENGLISH_WORD_SECTIONS.map((section) => section.id), ['basic', 'example', 'related', 'note'])
  for (const item of ENGLISH_WORD_FIELDS) {
    assert.ok(ENGLISH_WORD_SECTIONS.some((section) => section.id === item.section), item.key)
  }
  const form = read('../src/components/CustomCardForm.jsx')
  // 登録欄は16欄すべてを出す（行を足して書く欄は RowListField、ほかは欄ごと）。
  for (const key of ['word', 'meanings', 'pos', 'level', 'field', 'phonetic', 'exampleEn', 'exampleJa', 'note', 'etymology']) {
    assert.match(form, new RegExp(`case '${key}':`), `${key} の欄`)
  }
  assert.match(form, /default:\s*return <RowListField/)
  assert.deepEqual(
    ENGLISH_WORD_FIELDS.filter((item) => item.list).map((item) => item.key),
    ['otherSenses', 'derivatives', 'synonyms', 'antonyms', 'confusables', 'phrases'],
  )
})

test('16欄はすべて保存され、辞書の語と同じ形（学習画面が使う形）になる', () => {
  const word = normalizeCustomWord(customWordInput(VALUES, 'subject:english'))
  assert.equal(word.word, 'glimmerous')
  assert.deepEqual(word.meanings, ['かすかに光る', 'ほのかな'])
  assert.equal(word.pos, '形')
  assert.equal(word.level, 'pre1')
  assert.equal(word.field, '自然・環境・地理')
  assert.equal(word.phonetic, '/ˈɡlɪmərəs/')
  assert.deepEqual(word.example, { en: VALUES.example, ja: VALUES.exampleTranslation })
  assert.equal(word.note, VALUES.note)
  assert.deepEqual(word.otherSenses, [{ pos: '名', meaning: 'かすかな光を放つもの' }])
  assert.deepEqual(word.derivatives, [{ w: 'glimmer', m: 'かすかな光' }])
  assert.deepEqual(word.synonyms, [{ w: 'faint', m: 'かすかな' }])
  assert.deepEqual(word.antonyms, [{ w: 'bright', m: '明るい' }])
  assert.deepEqual(word.confusables, [{ w: 'glamorous', m: '魅力的な' }])
  assert.deepEqual(word.phrases, [{ phrase: 'a glimmerous hope', meaning: 'ほのかな希望' }])
  assert.equal(word.etymology, VALUES.etymology)

  const study = customWordToStudyWord(word)
  assert.equal(study.usage, VALUES.note)
  assert.deepEqual(study.otherSenses, [{ pos: '名', meaning: 'かすかな光を放つもの', level: 'pre1' }])
  assert.deepEqual(study.customPhrases, word.phrases)
  assert.equal(study.customEtymology, VALUES.etymology)
  try {
    registerCustomWords([study])
    const relations = wordRelationsFor(study)
    assert.deepEqual(relations.derivatives.map((item) => item.w), ['glimmer'])
    assert.deepEqual(relations.synonyms.map((item) => item.w), ['faint'])
    assert.deepEqual(relations.antonyms.map((item) => item.w), ['bright'])
    assert.deepEqual(relations.confusables.map((item) => item.word.word), ['glamorous'])
  } finally {
    registerCustomWords([])
  }

  // 行を足して書く欄は、上限まで・空の行は落とす・同じ語は1つ。
  const many = normalizeCustomWord({
    word: 'x', meanings: 'y',
    synonyms: [...Array.from({ length: 12 }, (_, index) => ({ w: `w${index}`, m: '' })), { w: '', m: '空' }, { w: 'W0', m: '同じ語' }],
    otherSenses: Array.from({ length: 6 }, (_, index) => ({ pos: '名', meaning: `意味${index}` })),
    phrases: Array.from({ length: 10 }, (_, index) => ({ phrase: `p${index}`, meaning: '' })),
  })
  assert.equal(many.synonyms.length, CUSTOM_WORD_LIMITS.relatedWords)
  assert.equal(many.otherSenses.length, CUSTOM_WORD_LIMITS.otherSenses)
  assert.equal(many.phrases.length, CUSTOM_WORD_LIMITS.phrases)
})

test('辞書ページ・暗記カード・答え合わせは、英単語のカードの欄を出す作りになっている', () => {
  const detail = read('../src/screens/WordDetail.jsx')
  const study = read('../src/screens/VocabStudy.jsx')
  const quiz = read('../src/screens/VocabQuiz.jsx')
  assert.match(detail, /<CustomPhraseSection word=\{word\} \/>/)
  assert.match(detail, /<CustomEtymology word=\{word\} \/>/)
  assert.match(study, /<CustomPhraseSection word=\{word\} \/>/)
  assert.match(study, /<CustomEtymology word=\{word\} \/>/)
  assert.match(study, /<CustomDerivativeSection items=\{relations\.derivatives\}/)
  assert.match(quiz, /<CustomEtymology word=\{word\} \/>/)
})

let ui
before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-custom-english-test' })
})

after(async () => {
  await ui?.close()
})

async function registerWord() {
  const result = await ui.act('saveCustomEntry', { template: 'english', category: 'subject:english', values: VALUES })
  assert.equal(result.status, 'saved')
  return result.id
}

test('辞書ページに16欄すべてが出る', async () => {
  const id = await registerWord()
  await ui.open('wordDetail', { id })
  const text = await ui.mainText()
  for (const [key, value] of Object.entries(SHOWN)) assert.ok(text.includes(value), `辞書ページの ${key}：${value}`)
  assert.ok(text.includes('形'), '品詞')
  for (const heading of ['例文', '使い方・使い分け', '派生語', 'ほかの意味', '意味が同じ・近い語', '意味が反対・対照の語', 'つづりが似ていて間違えやすい語', 'カードに書いた熟語・構文', '語の成り立ち']) {
    assert.ok(text.includes(heading), `辞書ページの欄の見出し：${heading}`)
  }
  await ui.checkWidth('英単語のカードの辞書ページ')
})

test('暗記カードの裏に16欄すべてが出る', async () => {
  const [id] = (await ui.state(['customWords'])).customWords.map((word) => word.id)
  await ui.act('setContentSetting', null, 'revealAnswers', true)
  try {
    await ui.open('vocabStudy', { source: { type: 'mylist', ids: [id] }, title: '英単語のカード', mode: 'study' })
    await ui.page.waitForSelector('[data-custom-word-etymology]')
    const text = await ui.mainText()
    for (const [key, value] of Object.entries(SHOWN)) {
      // 分野は辞書ページのヒーローだけに出す（暗記カードの表は級と品詞）。
      if (key === 'field') continue
      assert.ok(text.includes(value), `暗記カードの ${key}：${value}`)
    }
    await ui.checkWidth('英単語のカードの暗記カード')
  } finally {
    await ui.act('setContentSetting', null, 'revealAnswers', false)
  }
})

test('テストの答え合わせに、意味と自分で書いた語の成り立ちが出る', async () => {
  const [id] = (await ui.state(['customWords'])).customWords.map((word) => word.id)
  await ui.open('vocabQuiz', { source: { type: 'mylist', ids: [id] }, title: '英単語のカード', mode: 'quiz' })
  await ui.page.locator('.study-app-content button', { hasText: 'かすかに光る' }).first().click()
  await ui.page.waitForSelector('[data-custom-word-etymology]')
  const text = await ui.mainText()
  assert.ok(text.includes('glimmerous'))
  assert.ok(text.includes(SHOWN.meanings))
  assert.ok(text.includes(SHOWN.etymology))
  await ui.checkWidth('英単語のカードのテストの答え合わせ')
})

test('英単語のカードの画面は、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
