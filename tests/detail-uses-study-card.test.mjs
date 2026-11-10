// 英和辞書や一覧から開く英単語・熟語・構文のカードは、暗記で使うカードと同じもの（2026-11-10 の依頼）。
// requests/2026-11-10-detail-uses-study-card.json の check。
//  1. 英単語：暗記（VocabStudy）と詳細（WordDetail）が同じ部品 WordStudyCard でカードを描く。
//     すべての navigate('wordDetail') は1つの画面 WordDetail へ行く。
//  2. 熟語・構文：暗記（PhraseStudy）と、詳細を出す全か所（PhraseDetailSheet・英和辞書・読解の準備）が
//     同じ部品 PhraseStudyCard でカードを描く。別のレイアウトの詳細を残さない。
//  3. 辞書の全見出し語・全熟語・構文・読解の準備の熟語で、開いた面のカードが描ける。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const root = new URL('../', import.meta.url)
const read = (file) => readFileSync(new URL(file, root), 'utf8')

const sourceFiles = (dir) => readdirSync(new URL(dir, root)).flatMap((name) => {
  const rel = join(dir, name)
  if (statSync(new URL(rel, root)).isDirectory()) return sourceFiles(`${rel}/`)
  return /\.(jsx?|mjs)$/.test(name) ? [rel] : []
})

let vite
let wordCard
let phraseDetail
let vocab
let phrases
let readingStudy
let passages

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  wordCard = await vite.ssrLoadModule('/src/components/WordStudyCard.jsx')
  phraseDetail = await vite.ssrLoadModule('/src/components/PhraseDetailSheet.jsx')
  vocab = await vite.ssrLoadModule('/src/data/vocab.js')
  phrases = await vite.ssrLoadModule('/src/data/phrases.js')
  readingStudy = await vite.ssrLoadModule('/src/data/reading-study.js')
  passages = await vite.ssrLoadModule('/src/data/passages.js')
})

after(async () => {
  await vite?.close()
})

test('英単語の暗記カードと詳細の画面は、同じ部品 WordStudyCard でカードを描く', () => {
  const study = read('src/screens/VocabStudy.jsx')
  const detail = read('src/screens/WordDetail.jsx')
  for (const [name, text] of [['VocabStudy', study], ['WordDetail', detail]]) {
    assert.match(text, /import \{ WordStudyCard \} from '\.\.\/components\/WordStudyCard\.jsx'/, `${name} が WordStudyCard を読まない`)
    assert.match(text, /<WordStudyCard\b/, `${name} が WordStudyCard を描かない`)
  }
  // 詳細は開いた面で出す。
  assert.match(detail, /<WordStudyCard[\s\S]*?\n\s+flipped\n/)
  // カードの部品（級と品詞の行・意味の箱）を画面の側に持たない。
  for (const marker of ['data-vocab-card-level', 'data-vocab-spelling-hidden', 'word.meanings.join']) {
    assert.ok(!study.includes(marker), `VocabStudy に ${marker} が残っている`)
    assert.ok(!detail.includes(marker), `WordDetail に ${marker} が残っている`)
  }
})

test('英単語の詳細へのすべての入口は、1つの画面 WordDetail へ行く', () => {
  const app = read('src/App.jsx')
  assert.match(app, /wordDetail: WordDetailScreen,/)
  assert.match(app, /const WordDetailScreen = lazyScreen\(\(\) => import\('\.\/screens\/WordDetail\.jsx'\), 'WordDetailScreen'\)/)
  const callers = sourceFiles('src/').filter((file) => /['"]wordDetail['"]/.test(read(file)))
  // 入口が1つもないと確かめにならない。
  assert.ok(callers.length >= 15, `wordDetail の入口が ${callers.length} か所しか見つからない`)
  // 英単語の詳細を別の画面名で開く所がない。
  for (const file of sourceFiles('src/')) {
    assert.ok(!/navigate\(['"](wordInfo|wordCard|vocabDetail)['"]/.test(read(file)), `${file} が別の詳細画面を開く`)
  }
})

test('熟語・構文の暗記カードと、詳細を出す全か所が同じ部品 PhraseStudyCard を使う', () => {
  const study = read('src/screens/PhraseStudy.jsx')
  assert.match(study, /<PhraseStudyCard\b/)
  const sheet = read('src/components/PhraseDetailSheet.jsx')
  assert.match(sheet, /<PhraseStudyCard\b[\s\S]*?\n\s+flipped\n/)
  // 詳細を出す画面は、どれも PhraseDetailSheet を通る。
  for (const file of [
    'src/screens/VocabSearch.jsx',
    'src/screens/Phrases.jsx',
    'src/screens/ReadingPrep.jsx',
    'src/screens/BasicReadingPrep.jsx',
    'src/components/WordRelations.jsx',
  ]) {
    assert.match(read(file), /<PhraseDetailSheet\b/, `${file} が熟語の詳細を PhraseDetailSheet で出さない`)
  }
  // 熟語・構文の成り立ちの見出しを描く所は、カードの部品とテストの答え合わせ（PhraseQuiz）だけ。
  // 英和辞書の行の中や読解の準備のシートに、別のレイアウトの詳細を残さない。
  const owners = sourceFiles('src/')
    .filter((file) => !file.startsWith('src/data/'))
    .filter((file) => /kind === 'syntax' \? 'この文のポイント' : '成り立ち'/.test(read(file)))
    .sort()
  assert.deepEqual(owners, ['src/components/PhraseStudyCard.jsx', 'src/screens/PhraseQuiz.jsx'])
  // 英和辞書の熟語の行は、その場で開く別の詳細を持たない。
  const search = read('src/screens/VocabSearch.jsx')
  assert.ok(!search.includes('SyntaxFamilyGuide'), '英和辞書の行に熟語の詳細が残っている')
  assert.ok(!search.includes("'▲' : '▼'"), '英和辞書の行がその場で開く')
})

test('辞書の全見出し語で、詳細のカード（開いた面）が描ける', async () => {
  const { wordRelationsFor } = await vite.ssrLoadModule('/src/lib/wordRelations.js')
  const { phraseGroupsForWord } = await vite.ssrLoadModule('/src/lib/wordPhrases.js')
  const words = vocab.ALL_WORDS
  assert.ok(words.length > 8000, `見出し語が ${words.length} 語しかない`)
  let rendered = 0
  for (const word of words) {
    const html = renderToStaticMarkup(React.createElement(wordCard.WordStudyCard, {
      word,
      flipped: true,
      relations: wordRelationsFor(word),
      relatedPhrases: phraseGroupsForWord(word),
      openWord: () => {},
      navigateTo: () => {},
    }))
    assert.ok(html.includes(`data-word-study-card="${word.id}"`), `${word.id} のカードが描けない`)
    assert.ok(html.includes('意味'), `${word.id} のカードに意味の欄がない`)
    rendered += 1
  }
  assert.equal(rendered, words.length)
})

test('全熟語・構文と読解の準備の熟語で、詳細のカード（開いた面）が描ける', () => {
  const items = new Map(phrases.PHRASES.map((p) => [p.id, p]))
  for (const passage of passages.PASSAGES) {
    for (const p of readingStudy.getReadingStudy(passage).phrases) items.set(p.id, p)
  }
  assert.ok(items.size > phrases.PHRASES.length - 1)
  for (const phrase of items.values()) {
    const html = renderToStaticMarkup(React.createElement(phraseDetail.PhraseDetail, { phrase }))
    assert.ok(html.includes(`data-phrase-study-card="${phrase.id}"`), `${phrase.id} のカードが描けない`)
    assert.ok(html.includes(phrase.phrase.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')), `${phrase.id} の見出しがない`)
  }
})
