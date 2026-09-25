// 一文の構文解説の意味フレーズ欄。フレーズごとの文法の説明に「フレーズ内の文法：」の見出しを付けない。
// 2026-09-25 利用者「『フレーズ内の文法』と繰り返し表示されるのは冗長的なので削除しなさい」。
// 見出しだけを消し、説明の本文は全フレーズに残す。受験長文（Reader）と語彙強化ロングリーディング
// （ExtendedReader）は同じ部品 ReadingSentenceDetail を使うので、構文解説を開ける全長文の全文を描いて確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const LABEL = 'フレーズ内の文法'
const read = (file) => readFileSync(join(ROOT, file), 'utf8')

const unescapeHtml = (text) => text
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#x27;/g, "'")
  .replace(/&amp;/g, '&')

let vite
let rendered

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  const { ReadingSentenceDetail } = await vite.ssrLoadModule('/src/components/ReadingSentenceDetail.jsx')
  const { ANNOTATED_PASSAGES } = await vite.ssrLoadModule('/src/data/passages.js')
  const { analyzeReadingSentence } = await vite.ssrLoadModule('/src/lib/reading-grammar.js')
  rendered = {
    passages: ANNOTATED_PASSAGES,
    sentences: ANNOTATED_PASSAGES.flatMap((passage) => passage.sentences.map((sentence) => {
      const analysis = analyzeReadingSentence(sentence)
      const html = renderToStaticMarkup(
        React.createElement(ReadingSentenceDetail, { sentence, sentenceAnalysis: analysis }),
      )
      return { passage, sentence, analysis, html }
    })),
  }
})

after(async () => {
  await vite?.close()
})

test('構文解説を開ける長文は、受験長文と語彙強化ロングリーディングの全文（同じ部品で描く）', () => {
  const reader = read('src/screens/Reader.jsx')
  const extended = read('src/components/ExtendedReader.jsx')
  for (const [name, source] of [['Reader', reader], ['ExtendedReader', extended]]) {
    assert.match(source, /title="一文の構文解説"/, `${name} の構文解説の窓`)
    assert.match(source, /<ReadingSentenceDetail\b/, `${name} は共通の部品で描く`)
  }
  // 受験長文は全本（!passage.extended）、語彙強化は散文へ書き直した本（passage.annotated）の文を解析する。
  assert.match(reader, /!passage\.extended\s*\?\s*passage\.sentences\.map\(\(item\) => analyzeReadingSentence\(item\)\)/)
  assert.match(extended, /passage\.annotated \? passage\.sentences\.map\(\(item\) => analyzeReadingSentence\(item\)\)/)
  const { passages, sentences } = rendered
  const extendedCount = passages.filter((passage) => passage.extended).length
  assert.ok(passages.length - extendedCount >= 38, `受験長文 ${passages.length - extendedCount}本`)
  assert.ok(extendedCount >= 4, `語彙強化ロングリーディング ${extendedCount}本`)
  assert.ok(passages.every((passage) => !passage.extended || passage.annotated))
  assert.ok(sentences.length >= 1518, `描いた文 ${sentences.length}文`)
})

test('全文の意味フレーズに「フレーズ内の文法」の見出しを出さない', () => {
  const shown = rendered.sentences
    .filter(({ html }) => html.includes(LABEL))
    .map(({ sentence }) => sentence.reviewId)
  assert.deepEqual(shown.slice(0, 20), [], `見出しが出る文 ${shown.length}文`)
})

test('全フレーズで文法の説明の本文は残り、英語と日本語のすぐ下に1つずつ出る', () => {
  let phrases = 0
  let explained = 0
  const problems = []
  for (const { sentence, analysis, html } of rendered.sentences) {
    const structure = analysis.structure
    assert.ok(structure, `${sentence.reviewId} は構造台帳から描く`)
    const articles = html.split('<article').slice(1)
      .filter((part) => part.includes('data-reading-phrase-status'))
    assert.equal(articles.length, analysis.meaningPhraseSequence.length, `${sentence.reviewId} のフレーズ数`)
    analysis.meaningPhraseSequence.forEach((phraseItem, index) => {
      phrases += 1
      const at = `${sentence.reviewId} のフレーズ${index + 1}`
      const note = structure.notes[phraseItem.spokenEn ?? phraseItem.en] ?? ''
      const expected = [analysis.structurePhrases[index]?.explanation, note].filter(Boolean).join(' ')
      const article = articles[index].split('</article>')[0]
      const boxes = [...article.matchAll(/<p[^>]*data-reading-phrase-grammar(?:="[^"]*")?[^>]*>([\s\S]*?)<\/p>/g)]
        .map((match) => unescapeHtml(match[1]))
      if (!expected) {
        if (boxes.length) problems.push(`${at}: 説明がないのに欄が出る`)
        return
      }
      explained += 1
      if (boxes.length !== 1) {
        problems.push(`${at}: 説明の欄が ${boxes.length}個`)
        return
      }
      if (boxes[0] !== expected) problems.push(`${at}: 「${boxes[0]}」（本文は「${expected}」）`)
      const jaAt = unescapeHtml(article).indexOf(phraseItem.ja)
      const boxAt = unescapeHtml(article).indexOf(expected)
      if (jaAt < 0 || boxAt < jaAt) problems.push(`${at}: 説明が日本語の下にない`)
    })
  }
  assert.deepEqual(problems.slice(0, 20), [], `説明の本文の食い違い ${problems.length}件`)
  // 2026-09-25 時点で全 4,825フレーズに説明がある。フレーズを足しても説明が付いているかを見る。
  assert.ok(phrases >= 4825, `フレーズ ${phrases}件`)
  assert.equal(explained, phrases, '説明のないフレーズ')
})

test('どの画面のコード・データにも「フレーズ内の文法」を残さない（文学朗読の構文解説も含む）', () => {
  const TEXT = new Set(['.js', '.jsx', '.mjs', '.json', '.html', '.css', '.md', '.txt', '.svg', '.webmanifest'])
  const files = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name)
      if (statSync(path).isDirectory()) walk(path)
      else if (TEXT.has(extname(name))) files.push(path)
    }
  }
  walk(join(ROOT, 'src'))
  walk(join(ROOT, 'public'))
  files.push(join(ROOT, 'index.html'))
  assert.ok(files.some((file) => file.endsWith('LiteratureReader.jsx')))
  const found = files
    .filter((file) => readFileSync(file, 'utf8').includes(LABEL))
    .map((file) => relative(ROOT, file))
  assert.deepEqual(found, [])
})
