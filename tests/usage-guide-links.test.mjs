import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { getWord } from '../src/data/vocab.js'
import { getPhrase } from '../src/data/phrases.js'
import { ALL_USAGE_GUIDES } from '../src/data/usage-guides.js'
import { usageGuideMembers, usageGuidesForPhrase, usageGuidesForWord } from '../src/lib/usageGuides.js'

// 使い分けカードを関連語の欄からつなぐ（requests/2026-10-26-usage-guide-cards.json）。
// 単語の暗記カードの裏（VocabStudy）と辞書ページ（WordDetail）は、語の使い分けカードを関連語の欄に出し、
// 類義語などの行の相手が同じカードに入っていれば行に「使い分けカード」のボタンを添える。
// 熟語の暗記カードの裏（PhraseStudy）と熟語の詳細シート（PhraseDetailSheet）は、熟語の使い分けカードを出す。

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const unescape = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')

let vite
let cards
let links

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  cards = await vite.ssrLoadModule('/src/components/UsageGuideCards.jsx')
  links = await vite.ssrLoadModule('/src/components/UsageGuideLink.jsx')
})

after(async () => {
  await vite?.close()
})

const memberEntries = (guide) => [
  ...guide.wordIds.map((id) => ({ kind: 'word', id, self: { wordId: id }, guides: usageGuidesForWord(getWord(id)) })),
  ...guide.phraseIds.map((id) => ({ kind: 'phrase', id, self: { phraseId: id }, guides: usageGuidesForPhrase(getPhrase(id)) })),
]

test('カードに入っている語・熟語のどれからも、そのカードが出て、ほかの全員が「このカードで比べる語」に並ぶ', () => {
  let views = 0
  for (const guide of ALL_USAGE_GUIDES) {
    for (const member of memberEntries(guide)) {
      assert.ok(member.guides.includes(guide), `${member.id} に ${guide.id} が出ない`)
      const html = renderToStaticMarkup(React.createElement(cards.UsageGuideSection, { guides: [guide], self: member.self, onWord: () => {} }))
      assert.ok(html.includes(`data-usage-guide="${guide.id}"`), `${member.id}: ${guide.id} のカードがない`)
      const others = usageGuideMembers(guide, member.self)
      assert.equal(others.length, guide.wordIds.length + guide.phraseIds.length - 1, `${member.id}: ${guide.id} の相手の数`)
      const footer = html.split(`data-usage-guide-members="${guide.id}"`)[1] ?? ''
      const text = unescape(footer)
      for (const other of others) assert.ok(text.includes(other.text), `${member.id} から ${guide.id} の ${other.text} が並ばない`)
      views += 1
    }
  }
  // 2026-10-26: 195枚・語と熟語の延べ 535。
  assert.equal(views, 535)
})

test('見出し語どうしは、相手の行（つづりか見出し語の id）に「使い分けカード」のボタンが出る（語×相手の全組）', () => {
  let pairs = 0
  for (const guide of ALL_USAGE_GUIDES) {
    for (const wordId of guide.wordIds) {
      const word = getWord(wordId)
      for (const partnerId of guide.wordIds.filter((id) => id !== wordId)) {
        const partner = getWord(partnerId)
        for (const props of [{ text: partner.word }, { wordId: partner.id }]) {
          const html = renderToStaticMarkup(React.createElement(
            links.UsageGuideProvider,
            { guides: word.usageGuides },
            React.createElement(links.UsageGuideLink, props),
          ))
          assert.ok(html.includes(`data-usage-guide-link="${guide.id}"`), `${word.word} の ${partner.word} の行に ${guide.id} がない`)
        }
        pairs += 1
      }
    }
  }
  // 2026-10-26: 語×相手 736組。
  assert.equal(pairs, 736)
})

test('見ている語のカードに入っていない相手の行には、ボタンを出さない', () => {
  const see = getWord('see')
  const html = renderToStaticMarkup(React.createElement(
    links.UsageGuideProvider,
    { guides: see.usageGuides },
    React.createElement(links.UsageGuideLink, { text: 'apple' }),
  ))
  assert.equal(html, '')
})

test('熟語の行は、単語のカードに一緒に入っていればボタン、どの熟語も詳細シートからカードが開く', () => {
  for (const guide of ALL_USAGE_GUIDES) {
    for (const phraseId of guide.phraseIds) {
      assert.ok(usageGuidesForPhrase(getPhrase(phraseId)).includes(guide), `${phraseId} の詳細に ${guide.id} が出ない`)
      for (const wordId of guide.wordIds) {
        const html = renderToStaticMarkup(React.createElement(
          links.UsageGuideProvider,
          { guides: getWord(wordId).usageGuides },
          React.createElement(links.UsageGuideLink, { phraseId }),
        ))
        assert.ok(html.includes(`data-usage-guide-link="${guide.id}"`), `${wordId} の熟語の欄の ${phraseId} に ${guide.id} がない`)
      }
    }
  }
})

test('see と watch のように類義語の欄にない相手も、see のカードから並ぶ', () => {
  const see = getWord('see')
  const guide = see.usageGuides.find((item) => item.wordIds.includes('watch'))
  assert.ok(guide, 'see と watch のカードがない')
  const html = renderToStaticMarkup(React.createElement(cards.UsageGuideSection, { guides: see.usageGuides, self: { wordId: 'see' }, onWord: () => {} }))
  assert.match(unescape(html.split(`data-usage-guide-members="${guide.id}"`)[1]), /\bwatch\b/)
})

test('4つの画面と熟語の欄が、使い分けカードとボタンを出す', () => {
  for (const path of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']) {
    const source = read(path)
    assert.match(source, /<UsageGuideProvider guides=\{word\.usageGuides\}>/, path)
    assert.match(source, /<UsageGuideSection guides=\{word\.usageGuides\} self=\{\{ wordId: word\.id \}\}/, path)
  }
  assert.match(read('src/screens/PhraseStudy.jsx'), /<UsageGuideSection guides=\{usageGuidesForPhrase\(item\)\} self=\{\{ phraseId: item\.id \}\}/)
  assert.match(read('src/components/PhraseDetailSheet.jsx'), /<UsageGuideSection guides=\{usageGuidesForPhrase\(phrase\)\} self=\{\{ phraseId: phrase\.id \}\}/)
  const relations = read('src/components/WordRelations.jsx')
  assert.match(relations, /<UsageGuideLink text=\{row\.text\} wordId=\{row\.entry\?\.id \?\? null\} \/>/)
  assert.match(relations, /<UsageGuideLink phraseId=\{phrase\.id\} \/>/)
  assert.match(relations, /<UsageGuideLink text=\{item\.word\.word\} wordId=\{item\.word\.id \?\? null\} \/>/)
})
