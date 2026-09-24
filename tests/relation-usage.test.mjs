import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { WORD_USAGE_NOTES } from '../src/data/word-usage-notes.js'
import { WORD_RELATION_NOTES } from '../src/data/word-relation-notes.js'
import { wordRelationsFor } from '../src/lib/wordRelations.js'
import { RELATION_USAGE_KINDS, relationUsageGaps } from '../scripts/checks/relation-usage.mjs'
import { NAMED_WORD_SOURCES, namedWordGaps } from '../scripts/checks/named-word-relations.mjs'

// 類義語・反対語・同じ意味の熟語の全行に使い分けの解説を出す（requests/2026-09-24-relation-explanations.json）。
// 解説は word-relation-notes.js、足した・外した・直した関連語は word-relation-edits.js、
// 語の成り立ち・使い方の欄が名指しした語を欄に出さない理由は docs/audits/named-word-relations.json が持つ。

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const pairKey = (a, b) => [String(a).toLowerCase(), String(b).toLowerCase()].sort().join('|')

let vite
let sections

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  sections = await vite.ssrLoadModule('/src/components/WordRelations.jsx')
})

after(async () => {
  await vite?.close()
})

test('類義語・反対語・同じ意味の熟語の欄の全行に解説があり、台帳に古い行がない', () => {
  const gaps = relationUsageGaps()
  for (const kind of RELATION_USAGE_KINDS) {
    assert.deepEqual(gaps[kind].missing.slice(0, 20), [], `${kind} の解説のない行`)
  }
  assert.ok(gaps.synonyms.rows > 10_000, `類義語の欄の行数 ${gaps.synonyms.rows}`)
  assert.ok(gaps.antonyms.rows > 4_000, `反対語の欄の行数 ${gaps.antonyms.rows}`)
  assert.ok(gaps.idioms.rows > 400, `同じ意味の熟語の組数 ${gaps.idioms.rows}`)
  assert.deepEqual(gaps.stale, [], 'どの欄にも出ない解説')
  assert.deepEqual(gaps.ledgerProblems, [], '足した・外した・直した関連語の台帳')
})

test('語の成り立ち・使い方の欄が名指しした語は、関連語の欄に出るか、出さない理由が台帳にある', () => {
  for (const source of NAMED_WORD_SOURCES) {
    const gap = namedWordGaps(source)
    assert.ok(gap.mentions > 0, source)
    assert.deepEqual(gap.missing.slice(0, 20).map((mention) => mention.key), [], `${source} の未決`)
    assert.deepEqual(gap.stale, [], `${source} の名指しでなくなった理由の行`)
    assert.deepEqual(gap.shownButReasoned, [], `${source} の欄に出たのに理由が残っている行`)
    assert.deepEqual(gap.badCodes, [], `${source} の略号ちがい`)
  }
  // 見つけたきっかけ: rupture の語源は「erupt と同じ語源」なのに、類義語の欄に erupt がなかった。
  const rupture = wordRelationsFor(getWord('rupture'))
  assert.ok([...rupture.synonyms, ...rupture.antonyms].some((item) => item.w === 'erupt'))
})

test('暗記カードの裏と辞書ページは、同じ関連語の部品で欄を出す', () => {
  for (const path of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']) {
    const source = read(path)
    assert.match(source, /wordRelationsFor\(word\)/, path)
    assert.match(source, /<SynonymSection items=\{relations\.synonyms\}/, path)
    assert.match(source, /<IdiomEquivalentSection phrases=\{relations\.idioms\}/, path)
    assert.match(source, /<AntonymSection items=\{relations\.antonyms\}/, path)
    assert.match(source, /<UsagePartnerSection items=\{relations\.usagePartners\}/, path)
  }
})

test('全見出し語で、類義語・反対語・同じ意味の熟語の行の数だけ解説が描かれる', () => {
  const { SynonymSection, AntonymSection, IdiomEquivalentSection } = sections
  const notesIn = (html) => (html.match(/data-word-usage-note/g) ?? []).length
  const totals = { synonyms: 0, antonyms: 0, idioms: 0 }
  for (const word of ALL_WORDS) {
    const relations = wordRelationsFor(word)
    const rendered = {
      synonyms: renderToStaticMarkup(React.createElement(SynonymSection, { items: relations.synonyms, onWord: () => {} })),
      antonyms: renderToStaticMarkup(React.createElement(AntonymSection, { items: relations.antonyms, onWord: () => {} })),
      idioms: renderToStaticMarkup(React.createElement(IdiomEquivalentSection, { phrases: relations.idioms })),
    }
    for (const kind of RELATION_USAGE_KINDS) {
      assert.equal(notesIn(rendered[kind]), relations[kind].length, `${word.id} の ${kind}`)
      totals[kind] += relations[kind].length
    }
  }
  const gaps = relationUsageGaps()
  for (const kind of RELATION_USAGE_KINDS) assert.equal(totals[kind], gaps[kind].rows, kind)
  // 解説は行の下に「使い分け」の見出しつきで出る。
  const tart = wordRelationsFor(getWord('tart'))
  const html = renderToStaticMarkup(React.createElement(SynonymSection, { items: tart.synonyms, onWord: () => {} }))
  assert.match(html, /使い分け/)
  assert.ok(html.includes('すっぱい'))
})

test('類義語・反対語の解説を書いた組で、「使い分けに注意する語」の欄は増えない', () => {
  let partners = 0
  for (const word of ALL_WORDS) {
    for (const partner of wordRelationsFor(word).usagePartners) {
      const key = pairKey(word.word, partner.word)
      assert.ok(WORD_USAGE_NOTES[key], `${word.id} の使い分けに注意する語 ${partner.word} は使い分けの台帳にある組`)
      assert.equal(partner.usageNote, WORD_USAGE_NOTES[key], key)
      partners += 1
    }
  }
  assert.ok(partners > 0)
  // 類義語の解説だけを書いた組（scurry と scamper）は、互いの「使い分けに注意する語」に出ない。
  assert.ok(WORD_RELATION_NOTES['scamper|scurry'])
  assert.equal(WORD_USAGE_NOTES['scamper|scurry'], undefined)
  const scurry = wordRelationsFor(getWord('scurry'))
  assert.ok(scurry.synonyms.some((item) => item.w === 'scamper' && item.usageNote))
  assert.equal(scurry.usagePartners.some((item) => item.word === 'scamper'), false)
})

test('外した関連語は、見出しのない別の語や、つづりの誤りを指していた行', () => {
  const edits = read('src/data/word-relation-edits.js')
  // 同じつづりの別の語で、その意味の見出し語がない（リンク先がちがう語になる）。
  for (const [id, w] of [['fetid', 'rank'], ['fulminate', 'rail']]) {
    assert.ok(new RegExp(`\\['${id}', 'syn', '${w}'`).test(edits), `${id} の ${w}`)
    assert.equal(getWord(id).synonyms.some((item) => item.w === w), false, `${id} の ${w}`)
  }
  assert.equal(getWord('sully').synonyms.some((item) => item.w === 'soil'), false)
  // ハイフンの抜けたつづりは、正しいつづりに書き直した。
  for (const [id, kind, wrong, right] of [
    ['choleric', 'synonyms', 'badtempered', 'bad-tempered'],
    ['complacent', 'synonyms', 'selfsatisfied', 'self-satisfied'],
    ['panacea', 'synonyms', 'cureall', 'cure-all'],
    ['recidivist', 'antonyms', 'firsttimer', 'first offender'],
  ]) {
    const items = getWord(id)[kind].map((item) => item.w)
    assert.equal(items.includes(wrong), false, `${id} の ${wrong}`)
    assert.ok(items.includes(right), `${id} の ${right}`)
  }
  // 「健全な」の sound は、「音」の sound ではなく同じつづりの別の見出し語へつなぐ。
  const fallacious = wordRelationsFor(getWord('fallacious'))
  assert.equal(fallacious.antonyms.find((item) => item.w === 'sound')?.id, 'sound_2')
})
