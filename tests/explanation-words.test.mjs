// 依頼 2026-10-08-explanation-word-links（英単語の解説に出てくる英単語の意味とリンク）の条件を守るテスト。
// 「英単語の解説に表示される英単語に、単語の意味が漏れなく書かれているか確認しなさい。
//   また、単語のリンクが漏れなく表示されているか確認しなさい。」
// 「また、リンクを伴う語は統一された見た目でよいのではないか。」という依頼から。
//  1) 全件 … 全見出し語の辞書ページと語根カードの欄の解説で、見出しのある英単語はすべてリンク、英単語・英語の句はすべて意味つき、
//     読んで決める所はすべて読んだ記録があり、台帳に古い行がない（scripts/checks/explanation-words.mjs と同じ判定）
//  2) 取り違え … 同じつづりの別の語は台帳で決めた語へつなぎ、ラテン語などの同じつづりはリンクにしない
//  3) 部品 … 辞書ページ・暗記カードの裏・テストの答え合わせは同じ部品で解説を出し、リンクの付いた語は WordLink 1つの見た目
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { analyze, collectExplanationParagraphs, loadReview } from '../scripts/checks/explanation-words.mjs'

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const h = React.createElement

let data
let result
let vite
let explained
let bits

before(async () => {
  data = await collectExplanationParagraphs()
  result = analyze(data, loadReview())
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  explained = await vite.ssrLoadModule('/src/components/ExplainedText.jsx')
  bits = await vite.ssrLoadModule('/src/components/WordBits.jsx')
})

after(async () => {
  await vite?.close()
})

// 段落の中の、ある語の言及（同じ語が2回目なら #2 の鍵）。
const mentionIn = (wordId, textPart, run) => {
  const paragraph = data.paragraphs.find((item) => item.wordId === wordId && item.text.includes(textPart))
  assert.ok(paragraph, `${wordId} の「${textPart}」を含む解説がない`)
  const mention = paragraph.mentions.find((item) => item.key.endsWith(`|${run}`))
  assert.ok(mention, `${wordId} の解説に ${run} の言及がない`)
  return mention
}

test('全件：全見出し語の辞書ページと語根カードの欄の解説で、印のない英字・リンクのない見出し語・意味のない語・読んでいない所・古い台帳の行が0件', () => {
  const vocabCount = data.vocab.ALL_WORDS.length
  const pages = new Set(data.paragraphs.map((paragraph) => paragraph.wordId))
  assert.ok(vocabCount >= 8900, `見出し語が少ない: ${vocabCount}`)
  assert.ok(data.paragraphs.length >= 48000, `解説の段落が少ない: ${data.paragraphs.length}`)
  assert.ok([...pages].some((id) => id.startsWith('root:')), '語根カードの欄を描いていない')
  const { problems, staleReviews } = result
  for (const [name, items] of Object.entries(problems)) {
    assert.deepEqual(items.slice(0, 5).map((item) => item.key ?? item.text ?? item), [], `${name}: ${items.length}件`)
  }
  assert.deepEqual(staleReviews, [])
  // 見出しのある語へのリンクと、画面で添えた意味が実際に出ている。
  assert.ok((result.counts['link・follows'] ?? 0) > 15000)
  assert.ok((result.counts['link・default'] ?? 0) > 3000)
})

test('取り違え：同じつづりの別の語は文の意味どおりの見出しへつなぎ、ラテン語などの同じつづりはリンクにしない', () => {
  // rain「雨」＋ bow「弓」→「虹」の bow は「お辞儀する」ではなく「弓」の bow_2。
  assert.equal(mentionIn('rainbow', 'rain「雨」', 'bow').link, 'bow_2')
  // twist の使い分けの「wind は /waɪnd/ と読み…巻く」は「風」ではなく wind_2。
  assert.equal(mentionIn('twist', '/waɪnd/', 'wind').link, 'wind_2')
  // 「「意味する」の mean とは別の語」は、意味を書いた「意味する」の mean へつなぐ。
  assert.equal(mentionIn('meanwhile', '中間の時間', 'mean#2').link, 'mean')
  // ラテン語 tenet「彼は持っている」は英単語 tenet（主義）ではない。
  assert.equal(mentionIn('root:tain', 'tenēre', 'tenet').kind, 'foreign')
  // 「「大群」の host は」は host_2、文に内部の id（host_2）は書かない。
  assert.equal(mentionIn('root:hospit', '「大群」の host', 'host').link, 'host_2')
  assert.ok(!data.paragraphs.some((paragraph) => /[A-Za-z]_\d/u.test(paragraph.text)))
})

test('意味：すぐ後に意味がない語には見出しの意味を添え、見出しのない語・英語の句には台帳の意味を添える', () => {
  // 「senior と同じ語源。」の senior は、見出しの意味を添えたリンク。
  const senior = mentionIn('senator', 'senior と同じ語源', 'senior')
  assert.equal(senior.link, 'senior')
  assert.equal(senior.addedMeaning, true)
  // 見出しのない語（helix の使い分けの DNA）と英語の句（a stack of plates）にも意味を添える。
  const dna = mentionIn('spiral', 'DNA', 'DNA')
  assert.equal(dna.kind, 'word')
  assert.equal(dna.addedMeaning, true)
  const plates = mentionIn('stack', 'a stack of plates', 'a stack of plates')
  assert.equal(plates.kind, 'phrase')
  assert.equal(plates.addedMeaning, true)
  assert.equal(data.decisions['602a0a5a1a|a stack of plates'], '積み重ねた皿')
})

test('部品：辞書ページ・暗記カードの裏・テストの答え合わせは、いま見ている語を伝える ExplanationScope の中で同じ部品を使う', () => {
  for (const file of ['src/screens/WordDetail.jsx', 'src/screens/VocabStudy.jsx', 'src/screens/VocabQuiz.jsx']) {
    const source = read(file)
    assert.match(source, /import \{[^}]*ExplanationScope[^}]*\} from '..\/components\/ExplainedText.jsx'/u, file)
    assert.match(source, /<ExplanationScope selfId=\{word\.id\} onWord=\{\w+\}>/u, file)
    assert.match(source, /<EtymologyBlock\b/u, file)
  }
  // 解説の文を出す部品は、どれも ExplainedText を通す。
  for (const file of ['WordRelations', 'LookalikeOrigins', 'WordBits', 'UsageGuideCards', 'GrammarRoles']) {
    assert.match(read(`src/components/${file}.jsx`), /<ExplainedText>/u, file)
  }
  // 語の使い方の文（usage）も同じ部品で出す。
  assert.match(read('src/screens/WordDetail.jsx'), /<ExplainedText>\{word\.usage\}<\/ExplainedText>/u)
  assert.match(read('src/screens/VocabStudy.jsx'), /<ExplainedText>\{word\.usage\}<\/ExplainedText>/u)
})

test('見た目：リンクの付いた語は WordLink 1つで描き、どの欄でも同じ見た目。いま見ている語はリンクにしない', () => {
  const html = renderToStaticMarkup(h(explained.ExplanationScope, { selfId: 'rainbow', onWord: () => {} },
    h(bits.EtymologyBlock, { word: data.vocab.getWord('rainbow') })))
  const links = [...html.matchAll(/<button[^>]*data-explain-kind="link"[^>]*>/g)].map((match) => match[0])
  assert.ok(links.length >= 2, 'rainbow の成り立ちにリンクがない')
  const classes = new Set(links.map((tag) => tag.match(/class="([^"]*)"/u)?.[1]))
  assert.equal(classes.size, 1, `リンクの見た目が1つでない: ${[...classes].join(' / ')}`)
  assert.ok(html.includes('data-explain-link="bow_2"'))
  assert.ok(!html.includes('data-explain-link="rainbow"'), 'いま見ている語がリンクになっている')
  // 見た目のクラスは WordLink にだけ書き、ほかの部品は WordLink を使う。
  const className = [...classes][0]
  const sources = ['WordRelations', 'LookalikeOrigins', 'WordBits', 'UsageGuideCards', 'GrammarRoles'].map((file) => read(`src/components/${file}.jsx`))
  assert.ok(sources.every((source) => !source.includes(className)))
  assert.match(read('src/components/LookalikeOrigins.jsx'), /<WordLink wordId=\{sibling\.id\}/u)
})
