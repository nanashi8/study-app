#!/usr/bin/env node
// 英単語の解説に出てくる英字の語を全件確かめる（requests/2026-10-08-explanation-word-links.json）。
// 全見出し語の辞書ページと語根カードの「つづりが似た語」の欄をサーバーで描き、解説の段落（日本語と英字が混ざる <p>）の英字を1つずつ、
// 表示の部品（components/ExplainedText.jsx）が付けた印（data-explain-kind・data-explain-key・data-explain-source）と照らす。
// 暗記カードの裏・テストの答え合わせは辞書ページと同じ部品で解説を出す（tests/explanation-words.test.mjs が確かめる）。
//   --summary   数を表示する（いつも通る）
//   --links     辞書に見出しのある英単語が、すべてリンク（またはそのページの語）になっている
//   --meanings  英単語・英語の句のすべてに意味がある（すぐ後に書いてある・台帳・見出しの最初の意味）
//   --ledger    読んで決める所をすべて読んだ記録があり、台帳にどこにも出ない古い行がない
//   --sheet [件数] 読んでいない所のシート（TSV）を出す
//   引数なし … --links --meanings --ledger
import { readFileSync, existsSync } from 'node:fs'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const ROOT = new URL('../../', import.meta.url)
export const REVIEW_PATH = new URL('docs/audits/explanation-words-review.json', ROOT)

const JAPANESE = /[぀-ヿ一-鿿]/u
const LATIN = /[A-Za-zÀ-ɏḀ-ỿ]/u

const decode = (value) => value
  .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

const attrsOf = (source) => {
  const attrs = {}
  for (const match of source.matchAll(/([a-zA-Z-]+)="([^"]*)"/g)) attrs[match[1]] = decode(match[2])
  return attrs
}

/** 解説の段落1つを読む。英字の語の印と、印のない英字を返す。 */
export function readParagraph(inner) {
  const mentions = []
  const unmarked = []
  const stack = []
  let text = ''
  for (const match of inner.matchAll(/<(\/?)([a-z0-9]+)([^>]*?)(\/?)>|([^<]+)/g)) {
    if (match[5] !== undefined) {
      const value = decode(match[5])
      // 部品が添えた意味は元の文ではないので、文には入れない（意味があることは addedMeaning で数える）。
      if (stack.some((entry) => entry.attrs['data-explain-meaning'])) continue
      text += value
      const marked = stack.some((entry) => entry.attrs['data-explain-kind'])
      if (!marked && LATIN.test(value)) unmarked.push(value.trim())
      const top = [...stack].reverse().find((entry) => entry.mention)
      if (top) top.mention.text += value
      continue
    }
    const [, closing, tag, rawAttrs, selfClosing] = match
    if (closing) {
      const entry = stack.pop()
      if (entry?.mention && entry.meaningAfter === undefined) entry.mention.end = text.length
      continue
    }
    if (selfClosing || ['br', 'img', 'path', 'svg'].includes(tag) && selfClosing) continue
    const attrs = attrsOf(rawAttrs)
    const entry = { tag, attrs }
    if (attrs['data-explain-kind']) {
      const parent = [...stack].reverse().find((item) => item.mention)
      entry.mention = {
        kind: attrs['data-explain-kind'],
        key: attrs['data-explain-key'] ?? '',
        source: attrs['data-explain-source'] ?? '',
        link: attrs['data-explain-link'] ?? null,
        inPhrase: parent?.mention?.kind === 'phrase',
        text: '',
        addedMeaning: false,
      }
      mentions.push(entry.mention)
    }
    if (attrs['data-explain-meaning']) {
      const owner = [...stack].reverse().find((item) => item.mention)
      if (owner) owner.mention.addedMeaning = true
    }
    stack.push(entry)
  }
  for (const mention of mentions) mention.text = mention.text.trim()
  return { text, mentions, unmarked }
}

/** 全見出し語の辞書ページを描き、解説の段落を集める。 */
export async function collectExplanationParagraphs() {
  const vite = await createServer({
    root: new URL('.', ROOT).pathname,
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  try {
    const store = await vite.ssrLoadModule('/src/store/useStore.js')
    const screen = await vite.ssrLoadModule('/src/screens/WordDetail.jsx')
    const vocab = await vite.ssrLoadModule('/src/data/vocab.js')
    const lib = await vite.ssrLoadModule('/src/lib/explanationWords.js')
    const ledger = await vite.ssrLoadModule('/src/data/explanation-words.js')
    const lookalike = await vite.ssrLoadModule('/src/components/LookalikeOrigins.jsx')
    const origins = await vite.ssrLoadModule('/src/lib/lookalikeOrigins.js')
    const paragraphs = []
    const collect = (wordId, word, html) => {
      for (const match of html.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)) {
        const attrs = attrsOf(match[1])
        const paragraph = readParagraph(match[2])
        if (!JAPANESE.test(paragraph.text) || !LATIN.test(paragraph.text)) continue
        paragraphs.push({ wordId, word, exempt: attrs['data-explain-exempt'] ?? null, ...paragraph })
      }
    }
    for (const word of vocab.ALL_WORDS) {
      // サーバーで描くときは、ストアの初期の状態が使われる。
      store.useStore.getInitialState().params = { id: word.id }
      collect(word.id, word.word, renderToStaticMarkup(React.createElement(screen.WordDetailScreen)))
    }
    // 語源の語根カード（暗記・テスト・カードの詳細・語根のページ）の「つづりが似た語は同じ語源？」も、同じ部品の解説の文。
    for (const rootId of new Set(origins.LOOKALIKE_ROOT_CARDS.map((card) => card.rootId))) {
      collect(`root:${rootId}`, rootId, renderToStaticMarkup(React.createElement(lookalike.LookalikeCardSection, { rootId })))
    }
    return { paragraphs, vocab, lib, decisions: ledger.EXPLANATION_WORD_DECISIONS }
  } finally {
    await vite.close()
  }
}

export function loadReview() {
  if (!existsSync(REVIEW_PATH)) return { reviewed: {} }
  return JSON.parse(readFileSync(REVIEW_PATH, 'utf8'))
}

// 見出し語の意味と、すぐ後に書いた意味が1字も重ならないか（取り違え・ラテン語の同じつづり・別の意味の見張り）。
const CONTENT_CHARS = /[ぁ-ゖァ-ヺ一-鿿]/gu
const STOP_CHARS = new Set([...'のをにはがでとるするいたなもへやかられ〜・'])
const charsOf = (value) => new Set((String(value).match(CONTENT_CHARS) ?? []).filter((char) => !STOP_CHARS.has(char)))
function meaningAfter(text, mentionText) {
  const index = text.indexOf(mentionText)
  if (index < 0) return ''
  const after = text.slice(index + mentionText.length).replace(/^ /, '')
  const quoted = after.match(/^(?:は|の|が|も|を)?[^「（(]{0,14}[「（(]([^」）)]*)/u)
  return quoted?.[1] ?? after.slice(0, 20)
}

/** 段落の言及を数え、守るべきことに外れた所と、読んで決める所を返す。 */
export function analyze({ paragraphs, vocab, lib, decisions }, review = loadReview()) {
  const headwords = new Set(vocab.ALL_WORDS.map((word) => word.word.toLowerCase()))
  const byId = new Map(vocab.ALL_WORDS.map((word) => [word.id, word]))
  const counts = {}
  const bump = (name) => { counts[name] = (counts[name] ?? 0) + 1 }
  const problems = { unmarked: [], notLinked: [], noMeaning: [], unread: [], stale: [], internalIds: [] }
  const toRead = new Map()
  const seenKeys = new Set()
  const seenMention = new Set()
  const usedLedgerKeys = new Set()
  for (const paragraph of paragraphs) {
    // 例文・用例・熟語の見出しは、解説の文ではなく英語そのもの（数だけ数える）。
    if (paragraph.exempt) { bump(`外した段落（${paragraph.exempt}）`); continue }
    for (const value of paragraph.unmarked) problems.unmarked.push({ wordId: paragraph.wordId, value, text: paragraph.text })
    // 同じつづりの別の語の id（host_2）を、学習者に見える文に書かない。
    if (/[A-Za-z]_\d/u.test(paragraph.text)) problems.internalIds.push({ wordId: paragraph.wordId, text: paragraph.text })
    for (const mention of paragraph.mentions) {
      seenKeys.add(mention.key)
      if (decisions[mention.key] !== undefined) usedLedgerKeys.add(mention.key)
      const unique = `${mention.key}@${mention.kind}`
      const first = !seenMention.has(unique)
      seenMention.add(unique)
      const spelling = mention.text.toLowerCase().replace(/\.$/u, '')
      const isHeadword = headwords.has(spelling)
      const needRead = (reason) => {
        // 鍵のない語は、部品が id で決めて出した語（同じ由来の語の並び・そのページの語）なので読まなくてよい。
        if (!mention.key || review.reviewed?.[mention.key]) return
        if (!toRead.has(mention.key)) toRead.set(mention.key, { ...mention, reason, wordId: paragraph.wordId, text: paragraph.text })
      }
      if (first) bump(`${mention.kind}${mention.inPhrase ? '（句の中）' : ''}・${mention.source}`)
      switch (mention.kind) {
        case 'link': {
          if (!mention.inPhrase) {
            if (!['follows', 'ok', 'ledger', 'default', 'list', 'earlier'].includes(mention.source)) problems.noMeaning.push({ ...mention, wordId: paragraph.wordId })
            if (['ledger', 'default', 'list'].includes(mention.source) && !mention.addedMeaning) problems.noMeaning.push({ ...mention, wordId: paragraph.wordId })
            if (mention.source === 'default') needRead('添える意味')
            // すぐ後に「」（）で書いた意味が見出しの意味と1字も重ならない（ラテン語などの同じつづり・別の意味の見張り）。
            // 「X は「…」」の形は使い分けの説明で、英語の語について書いているので見張らない。
            if (mention.source === 'follows' && /^ ?[「（(]/u.test(paragraph.text.slice(paragraph.text.indexOf(mention.text) + mention.text.length))) {
              const target = byId.get(mention.link)
              const written = charsOf(meaningAfter(paragraph.text, mention.text))
              const own = charsOf([target?.meaning, ...(target?.otherSenses ?? []).map((sense) => sense.meaning)].join('・'))
              if (written.size && ![...written].some((char) => own.has(char))) needRead('書いた意味が見出しと重ならない')
            }
          }
          // 並び（同じ由来の語）の語は id で決まっているので、取り違えはない。
          if (mention.source !== 'list' && lib.spellingHasHomographs(spelling)) needRead('同じつづりの別の語')
          break
        }
        case 'self':
          if (lib.spellingHasHomographs(spelling)) needRead('同じつづりの別の語')
          break
        case 'word':
          if (isHeadword && !decisions[mention.key]) problems.notLinked.push({ ...mention, wordId: paragraph.wordId })
          if (mention.source === 'none') {
            problems.noMeaning.push({ ...mention, wordId: paragraph.wordId })
            needRead('見出しのない語の意味')
          } else if (!['follows', 'earlier'].includes(mention.source)) needRead('見出しのない語')
          break
        case 'phrase':
          if (mention.source === 'none') {
            problems.noMeaning.push({ ...mention, wordId: paragraph.wordId })
            needRead('句の意味')
          }
          break
        case 'foreign':
          // 言語名のあとの並びとして英語でないとした語のうち、見出しと同じつづりのもの（英語の語を取り違えていないか）。
          // すぐ後に意味が書いてあるもの（ラテン語 ad「〜に」）は、元の言語の語の説明なので見ない。
          if (isHeadword && mention.source === 'rule:language' && !mention.inPhrase && !/^ ?[「（(]/u.test(paragraph.text.slice(paragraph.text.indexOf(mention.text) + mention.text.length))) needRead('言語名のあとの語（見出しと同じつづり）')
          break
        default:
          break
      }
    }
  }
  problems.unread = [...toRead.values()]
  problems.stale = Object.keys(decisions).filter((key) => !usedLedgerKeys.has(key))
  const staleReviews = Object.keys(review.reviewed ?? {}).filter((key) => !seenKeys.has(key))
  return { counts, problems, staleReviews, paragraphs: paragraphs.length }
}

const uniqueBy = (items, keyOf) => [...new Map(items.map((item) => [keyOf(item), item])).values()]

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const flags = new Set(args.filter((arg) => arg.startsWith('--')))
  const data = await collectExplanationParagraphs()
  const result = analyze(data)
  const { problems } = result
  const unmarked = uniqueBy(problems.unmarked, (item) => `${item.text}|${item.value}`)
  const notLinked = uniqueBy(problems.notLinked, (item) => item.key)
  const noMeaning = uniqueBy(problems.noMeaning, (item) => item.key)
  if (flags.has('--sheet')) {
    const limit = Number(args[args.indexOf('--sheet') + 1]) || Infinity
    const rows = problems.unread.slice(0, limit)
    for (const item of rows) {
      const word = data.vocab.WORDS_BY_ID[item.link]
      console.log([item.key, item.wordId, item.reason, item.kind, item.text ? '' : '', item.link ?? '', word ? data.lib.defaultMeaningOf(word) : '', item.text?.length ? '' : ''].join('\t').replace(/\t+$/, '') + `\t${item.text}`)
    }
    process.exit(0)
  }
  console.log(`解説の段落: ${result.paragraphs}（全見出し語の辞書ページと語根カードの「つづりが似た語」の欄）`)
  for (const [name, count] of Object.entries(result.counts).sort((a, b) => b[1] - a[1])) console.log(`  ${name}: ${count}`)
  console.log(`印のない英字: ${unmarked.length}件・文に出た内部の id: ${problems.internalIds.length}件`)
  console.log(`見出しがあるのにリンクでない語: ${notLinked.length}件`)
  console.log(`意味のない語・句: ${noMeaning.length}件`)
  console.log(`読んでいない所: ${problems.unread.length}件`)
  console.log(`どこにも出ない台帳の行: ${problems.stale.length}件・どこにも出ない読んだ記録: ${result.staleReviews.length}件`)
  if (flags.has('--summary')) process.exit(0)
  const checks = flags.size ? flags : new Set(['--links', '--meanings', '--ledger'])
  const show = (label, items, format) => {
    if (!items.length) return false
    console.log(`${label}（先頭20）:`)
    for (const item of items.slice(0, 20)) console.log(`  ${format(item)}`)
    return true
  }
  let failed = false
  if (checks.has('--links')) {
    failed = show('印のない英字', unmarked, (item) => `${item.wordId}: ${item.value} … ${item.text.slice(0, 80)}`) || failed
    failed = show('リンクでない見出し語', notLinked, (item) => `${item.wordId}: ${item.key}`) || failed
    failed = show('文に出た内部の id', problems.internalIds, (item) => `${item.wordId}: ${item.text.slice(0, 80)}`) || failed
  }
  if (checks.has('--meanings')) {
    failed = show('印のない英字', unmarked, (item) => `${item.wordId}: ${item.value} … ${item.text.slice(0, 80)}`) || failed
    failed = show('意味のない語・句', noMeaning, (item) => `${item.wordId}: ${item.key}`) || failed
  }
  if (checks.has('--ledger')) {
    failed = show('読んでいない所', problems.unread, (item) => `${item.key} ${item.reason}`) || failed
    failed = show('どこにも出ない台帳の行', problems.stale, (item) => item) || failed
    failed = show('どこにも出ない読んだ記録', result.staleReviews, (item) => item) || failed
  }
  process.exit(failed ? 1 : 0)
}
