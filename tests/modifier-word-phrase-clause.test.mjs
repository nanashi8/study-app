// 一文の構文解説の M の呼び名（依頼台帳 requests/2026-10-29-modifier-word-phrase-clause.json）。
// 1語は修飾語、2語以上で主語と動詞の組がないまとまりは修飾句、主語と動詞の組があるまとまりは修飾節。
// 基礎長文の全611文・長文（長文読解）の一文の構文解説を開く全文（語彙強化長文は注釈つきの本だけ）・名作の英語の全文について、
// 一文の構文解説をそのまま描き（サーバーで描く）、画面に出た M の札と説明の文の呼び名が、
// 画面に出た語の数と括弧（節は ( )、句は < >）に合うことを確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const h = React.createElement
const unescapeHtml = (text) => text
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#x27;/g, "'")
  .replace(/&amp;/g, '&')

let vite
let mods

before(async () => {
  vite = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
  mods = {
    detail: await vite.ssrLoadModule('/src/components/ReadingSentenceDetail.jsx'),
    basic: await vite.ssrLoadModule('/src/data/basic-reading/index.js'),
    basicSentence: await vite.ssrLoadModule('/src/lib/basicReadingSentence.js'),
    passages: await vite.ssrLoadModule('/src/data/passages.js'),
    grammar: await vite.ssrLoadModule('/src/lib/reading-grammar.js'),
    literature: await vite.ssrLoadModule('/src/data/public-domain-literature.js'),
    literatureSentences: await vite.ssrLoadModule('/src/data/literature-sentences.js'),
    literatureAnalysis: await vite.ssrLoadModule('/src/lib/literature-sentence-analysis.js'),
    roles: await vite.ssrLoadModule('/src/lib/translation-roles.js'),
  }
})

after(async () => {
  await vite?.close()
})

const render = (sentence, analysis) => renderToStaticMarkup(h(mods.detail.ReadingSentenceDetail, {
  sentence,
  sentenceAnalysis: analysis,
  activeWord: null,
  onWordTap: () => {},
  onNavigateAway: () => {},
}))

const words = (text) => (text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) ?? []).length

// 画面に出た要素の文字から、ありうる名前を決める。1語なら修飾語だけ。2語以上で節の ( が1つもなければ修飾句だけ。
// 要素が ( で始まれば修飾節だけ。そのほか（句の < > の後ろに名詞を説明する節が並ぶ <with the friend> (who …) や、
// 外側の句の括弧が付いた <as soon (as I can)>）は、画面の括弧だけでは決まらないので、どちらも認める
// （決め方そのものは、下の「構造台帳の形で決める」のテストで確かめる）。
function allowedNames(text) {
  if (words(text) <= 1) return ['修飾語']
  const body = text.replace(/^[\s<,;:—–-]+/, '')
  if (!/[(]/.test(body)) return ['修飾句']
  if (body.startsWith('(')) return ['修飾節']
  return ['修飾句', '修飾節']
}

// 一文の構文解説の HTML の M の呼び名を調べ、合わない所を返す。
function inspect(html, where, counts) {
  const problems = []
  // 文の要素の札（主節と、節・句の中の要素）。and・or・but の並列で縦にそろえるときは1つの要素が数か所に分かれ、
  // 最後の1か所だけが札を持つので（data-reading-role）、その前の部分（data-reading-role-part）をつなげて要素全体を作る。
  for (const [sentenceIndex, sentence] of html.split('data-reading-role-sentence="true"').slice(1).entries()) {
    let pieces = []
    // 節・句の中の要素の行（2つ目から）は、行の英語の先頭にそのまとまり自身の ( < が付く。
    let rowStart = sentenceIndex > 0
    let pieceName = ''
    const groups = sentence.split('data-reading-role-sentence=')[0]
      .matchAll(/aria-label="([^（"]+)（([^）]+)）：([^"]*)" data-reading-role(-part)?="([^"]+)"/g)
    for (const [, code, name, text, part, role] of groups) {
      if (role !== 'M' || code !== 'M') {
        // 札が付かないまま途切れた M の部分も、その部分の語で名前を確かめる。
        if (pieces.length) {
          const shown = pieces.join(' ')
          const allowed = allowedNames(shown)
          if (!allowed.includes(pieceName)) problems.push(`${where}: M「${shown}」が${pieceName}（${allowed.join('か')}のはず）`)
        }
        pieces = []
        rowStart = false
        continue
      }
      pieceName = name
      pieces.push(unescapeHtml(text))
      if (part) continue
      const shown = pieces.join(' ')
      pieces = []
      const allowed = allowedNames(rowStart ? shown.replace(/^[(<]/, '') : shown)
      rowStart = false
      counts[name] = (counts[name] ?? 0) + 1
      if (!allowed.includes(name)) problems.push(`${where}: M「${shown}」が${name}（${allowed.join('か')}のはず）`)
    }
  }
  // 英語順の型（SvocFlow）の「修飾句：いつ・どこで…」は、主節の札と同じ名前が同じ順に並ぶ。
  const flow = [...html.matchAll(/>M<\/span><div class="min-w-0"><p lang="en"[^>]*>[^<]*<\/p><p[^>]*>([^：<]+)：/g)].map(([, name]) => name)
  const mainSentence = html.split('data-reading-role-sentence="true"')[1]?.split('aria-label="節・句の中の要素"')[0] ?? ''
  // 札の付く M と、挿入文などで途切れて札が付かないまま終わる M の部分（on it, (“…” said Alice,) …）を、要素1つとして数える。
  const mainChips = []
  let open = false
  for (const [, code, name, part] of mainSentence.matchAll(/aria-label="([^（"]+)（([^）]+)）：[^"]*" data-reading-role(-part)?="[^"]+"/g)) {
    if (code !== 'M') { open = false; continue }
    if (!open) mainChips.push(name)
    open = Boolean(part)
  }
  if (flow.length && flow.join(',') !== mainChips.join(',')) {
    problems.push(`${where}: 英語順の型（${flow.join('・')}）が文の要素の札（${mainChips.join('・')}）と合わない`)
  }
  // 説明の文：修飾句M「…」の一部、のように中身を引いている所と、動詞の間にはさまった語句。
  // 説明の文は括弧なしの英語を引くので、語の数だけで確かめる（1語は修飾語、2語以上は修飾語と呼ばない）。
  const text = unescapeHtml(html.replace(/<[^>]+>/g, ' '))
  for (const [, name, inner] of text.matchAll(/(修飾[語句節])M「([^」]+)」/g)) {
    if ((words(inner) <= 1) !== (name === '修飾語')) problems.push(`${where}: 説明の「${name}M「${inner}」」`)
  }
  for (const [, inner, names] of text.matchAll(/間の (.+?) は(修飾[語句]M(?:・修飾[語句]M)?)）/g)) {
    const expected = [...new Set(inner.split(' と ').map((item) => (words(item) > 1 ? '修飾句M' : '修飾語M')))].join('・')
    if (names !== expected) problems.push(`${where}: 「間の ${inner} は${names}」（${expected}のはず）`)
  }
  return problems
}

test('M の呼び名は、1語が修飾語、2語以上が修飾句、節が修飾節（札の名前を決める部品）', () => {
  assert.equal(mods.roles.translationRoleMeta('M', 'word').label, '修飾語')
  assert.equal(mods.roles.translationRoleMeta('M', 'phrase').label, '修飾句')
  assert.equal(mods.roles.translationRoleMeta('M', 'clause').label, '修飾節')
  assert.equal(mods.roles.translationRoleMeta('S', 'phrase').label, '主語')
})

test('M の大きさは構造台帳の形で決める：節を直接持てば修飾節、句の中の節は句のまま、2語以上は修飾句、1語は修飾語', async () => {
  const structure = await vite.ssrLoadModule('/src/lib/reading-sentence-structure.js')
  const sizes = (en, markup) => structure.buildSentenceStructure(en, markup, {}).displayElements
    .filter((element) => element.role === 'M')
    .map((element) => `${element.trimmed}=${element.size}`)
  assert.deepEqual(sizes('He teaches English at a high school.', '[S He] [V teaches] [O English] [M {前| at a high school}].'), ['at a high school=phrase'])
  assert.deepEqual(sizes('He came home early.', '[S He] [V came] [M home] [M early].'), ['home=word', 'early=word'])
  assert.deepEqual(sizes('I stay home when it rains.', '[S I] [V stay] [M home] [M {副詞節:時| [接 when] [S it] [V rains]}].'), ['home=word', 'when it rains=clause'])
  assert.deepEqual(sizes('She lives with a friend who plays the violin.', '[S She] [V lives] [M {前| with a friend {関係>a friend| [S who] [V plays] [O the violin]}}].'), ['with a friend who plays the violin=phrase'])
  assert.deepEqual(sizes('I will go as soon as I can.', '[S I] [V will go] [M as soon {副詞節:比較| [接 as] [S I] [V can]}].'), ['as soon as I can=clause'])
  assert.deepEqual(sizes('Every Sunday, we play.', '[M Every Sunday], [S we] [V play].'), ['Every Sunday=phrase'])
})

test('基礎長文の全611文の一文の構文解説で、M を語・句・節に呼び分ける', () => {
  const problems = []
  const counts = {}
  let sentences = 0
  for (const passage of mods.basic.BASIC_READING_PASSAGES) {
    for (const index of passage.sentences.keys()) {
      const html = render(mods.basicSentence.basicReadingSentence(passage, index), mods.basicSentence.analyzeBasicReadingSentence(passage, index))
      problems.push(...inspect(html, `${passage.id}#${index + 1}`, counts))
      sentences += 1
    }
  }
  assert.equal(sentences, 611)
  assert.deepEqual(problems.slice(0, 20), [])
  for (const name of ['修飾語', '修飾句', '修飾節']) assert.ok(counts[name] > 0, `${name}の札が1つもない`)
  console.log(`基礎長文 ${sentences}文: ${JSON.stringify(counts)}`)
})

test('長文（長文読解）の一文の構文解説を開く全文で、M を語・句・節に呼び分ける', () => {
  const problems = []
  const counts = {}
  let sentences = 0
  for (const passage of mods.passages.ALL_PASSAGES) {
    // 語彙強化長文は、注釈つきの本だけが文を押して一文の構文解説を開く。
    if (passage.extended && !passage.annotated) continue
    for (const [index, sentence] of passage.sentences.entries()) {
      const html = render(sentence, mods.grammar.analyzeReadingSentence(sentence))
      problems.push(...inspect(html, `${passage.id}#${index + 1}`, counts))
      sentences += 1
    }
  }
  assert.ok(sentences > 1000, `${sentences}文`)
  assert.deepEqual(problems.slice(0, 20), [])
  for (const name of ['修飾語', '修飾句', '修飾節']) assert.ok(counts[name] > 0, `${name}の札が1つもない`)
  console.log(`長文 ${sentences}文: ${JSON.stringify(counts)}`)
})

test('名作の英語の全文の一文の構文解説で、M を語・句・節に呼び分ける', () => {
  const problems = []
  const counts = {}
  let sentences = 0
  for (const work of mods.literature.PUBLIC_DOMAIN_LITERATURE.filter((item) => item.kind === 'english')) {
    for (const [index, sentence] of mods.literatureSentences.literatureSentences(work).entries()) {
      const analysis = mods.literatureAnalysis.analyzeLiteratureSentence(sentence)
      if (!analysis) continue
      problems.push(...inspect(render(sentence, analysis), `${work.id}#${index + 1}`, counts))
      sentences += 1
    }
  }
  assert.ok(sentences > 100, `${sentences}文`)
  assert.deepEqual(problems.slice(0, 20), [])
  console.log(`名作 ${sentences}文: ${JSON.stringify(counts)}`)
})
