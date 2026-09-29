// 名作の本文を「押して解説を開く単位」（文）に分け、段落ごとにまとめる。
// 英語は構造台帳（literature-structures/）、古文・漢文は文ごとの解説台帳（literature-classics-notes.js）が
// 文の区切り・段落・訳・解説を持つ。朗読の区切り（場面の narrationSegments）は文をまたがないので、
// 文ごとに、その文を作る区切りをそのまま持たせる（交互朗読・語順訳・区切りの現代語訳に使う）。

import { normalizeStructureText, parseSentenceStructure } from '../lib/reading-sentence-structure.js'
import { LITERATURE_SENTENCE_STRUCTURES } from './literature-structures/index.js'
import { LITERATURE_CLASSICS_NOTES } from './literature-classics-notes.js'

const CACHE = new WeakMap()

const plainEnglish = (text) => normalizeStructureText(text).replace(/\s+/g, ' ').trim()
const plainJapanese = (text) => `${text}`.replace(/\s+/g, '')

// 場面をまたいで、区切りを本文の順に並べる。
function orderedSegments(work) {
  return work.scenes.flatMap((scene, sceneIndex) =>
    scene.narrationSegments.map((segment, segmentIndex) => ({
      ...segment,
      sceneIndex,
      segmentIndex,
    })))
}

const nodeText = (nodes) => nodes
  .map((node) => (node.kind === 'text' ? node.text : node.kind === 'separator' ? '' : nodeText(node.children)))
  .join('')

// 台帳の文の本文。英語は構造の記法から語句だけを取り出したもの。
function entryText(work, entry) {
  if (work.kind === 'english') {
    const { root, error } = parseSentenceStructure(entry.markup)
    return error ? entry.markup : nodeText(root)
  }
  return entry.text
}

// 英語は台帳が本文の正本。段落を場面にし、文の語順訳のまとまりを朗読の区切りにしている
// （public-domain-literature.js）ので、台帳の順に場面番号・区切り番号を振り直すだけでよい。
function buildEnglishSentences(work, entries) {
  const errors = []
  const sentences = []
  let sceneIndex = -1
  let segmentIndex = 0
  for (const [index, entry] of entries.entries()) {
    if (index === 0 || entry.p) {
      sceneIndex++
      segmentIndex = 0
    }
    const chunks = entry.chunks ?? []
    const scene = work.scenes[sceneIndex]
    const own = chunks.map((chunk) => {
      const segment = scene?.narrationSegments[segmentIndex]
      if (!segment || segment.original !== chunk.en) {
        errors.push(`${work.id}#${index + 1}: 語順訳「${chunk.en}」が朗読の区切りと合いません`)
      }
      const item = { ...(segment ?? { original: chunk.en, translation: chunk.ja, speech: chunk.en }), sceneIndex, segmentIndex }
      segmentIndex++
      return Object.freeze(item)
    })
    const text = own.map((segment) => segment.original).join(' ')
    if (plainEnglish(text) !== plainEnglish(entryText(work, entry))) {
      errors.push(`${work.id}#${index + 1}: 語順訳をつないだ英文が台帳の文と違います`)
    }
    sentences.push({
      index,
      number: index + 1,
      id: `${work.id}#${index + 1}`,
      reviewId: `${work.id}#${index + 1}`,
      kind: work.kind,
      text,
      en: text,
      ja: entry.ja,
      paragraphStart: Boolean(entry.p) || index === 0,
      paragraphIndex: sceneIndex,
      continues: Boolean(entry.part),
      partIndex: 0,
      partCount: 1,
      fragment: Boolean(entry.fragment),
      segments: Object.freeze(own),
      sceneIndexes: Object.freeze([sceneIndex]),
      speech: text,
      marked: '',
      entry,
    })
  }
  return { sentences, errors }
}

function numberParts(sentences) {
  // 長い文を分けた部分に、同じ文の中の番号と部分の数を持たせる。
  for (let start = 0; start < sentences.length;) {
    let end = start
    while (sentences[end].continues && end + 1 < sentences.length) end++
    for (let at = start; at <= end; at++) {
      sentences[at].partIndex = at - start
      sentences[at].partCount = end - start + 1
    }
    start = end + 1
  }
}

// 文の台帳がまだない作品は、場面を1つの単位として出す（台帳を書き終えるまでの間だけ。
// tests/literature-full-text-reader.test.mjs が全作品に台帳があることを確かめる）。
function sceneSentences(work) {
  const sentences = work.scenes.map((scene, sceneIndex) => ({
    index: sceneIndex,
    number: sceneIndex + 1,
    id: `${work.id}#${sceneIndex + 1}`,
    reviewId: `${work.id}#${sceneIndex + 1}`,
    kind: work.kind,
    text: scene.original,
    en: work.kind === 'english' ? scene.original : '',
    ja: scene.translation,
    paragraphStart: true,
    paragraphIndex: sceneIndex,
    continues: false,
    partIndex: 0,
    partCount: 1,
    fragment: false,
    segments: Object.freeze(scene.narrationSegments.map((segment, segmentIndex) => Object.freeze({ ...segment, sceneIndex, segmentIndex }))),
    sceneIndexes: Object.freeze([sceneIndex]),
    speech: scene.speech ?? scene.original,
    marked: scene.marked ?? '',
    entry: { text: scene.original, ja: scene.translation, kakikudashi: scene.kakikudashi ?? '', words: [], grammar: [], point: scene.guide, markup: '', chunks: null },
    provisional: true,
  }))
  return Object.freeze({
    sentences: Object.freeze(sentences.map((sentence) => Object.freeze(sentence))),
    errors: Object.freeze([`${work.id}: 文の台帳がありません`]),
  })
}

function buildSentences(work) {
  const english = work.kind === 'english'
  if (!(english ? LITERATURE_SENTENCE_STRUCTURES : LITERATURE_CLASSICS_NOTES)[work.id]?.length) {
    return sceneSentences(work)
  }
  if (english && LITERATURE_SENTENCE_STRUCTURES[work.id]?.length) {
    const { sentences, errors } = buildEnglishSentences(work, LITERATURE_SENTENCE_STRUCTURES[work.id])
    numberParts(sentences)
    return Object.freeze({
      sentences: Object.freeze(sentences.map((sentence) => Object.freeze(sentence))),
      errors: Object.freeze(errors),
    })
  }
  const entries = english
    ? LITERATURE_SENTENCE_STRUCTURES[work.id]
    : LITERATURE_CLASSICS_NOTES[work.id]
  if (!entries?.length) return Object.freeze({ sentences: Object.freeze([]), errors: Object.freeze([`${work.id}: 文の台帳がありません`]) })
  const segments = orderedSegments(work)
  const normalize = english ? plainEnglish : plainJapanese
  const joiner = english ? ' ' : ''
  const errors = []
  const sentences = []
  let cursor = 0
  let paragraphIndex = -1
  for (const [index, entry] of entries.entries()) {
    const expected = normalize(entryText(work, entry))
    const own = []
    let actual = ''
    while (cursor < segments.length && actual.length < expected.length) {
      own.push(segments[cursor])
      cursor++
      actual = normalize(own.map((segment) => segment.original).join(joiner))
    }
    if (actual !== expected) {
      errors.push(`${work.id}#${index + 1}: 朗読の区切りが文の終わりと合いません（台帳「${expected.slice(0, 40)}」／区切り「${actual.slice(0, 40)}」）`)
    }
    if (entry.p || index === 0) paragraphIndex++
    const text = own.map((segment) => segment.original).join(joiner)
    sentences.push({
      index,
      number: index + 1,
      id: `${work.id}#${index + 1}`,
      reviewId: `${work.id}#${index + 1}`,
      kind: work.kind,
      text,
      en: english ? text : '',
      ja: entry.ja,
      paragraphStart: Boolean(entry.p) || index === 0,
      paragraphIndex,
      continues: false,
      partIndex: 0,
      partCount: 1,
      fragment: false,
      segments: Object.freeze(own.map((segment) => Object.freeze(segment))),
      sceneIndexes: Object.freeze([...new Set(own.map((segment) => segment.sceneIndex))]),
      speech: own.map((segment) => segment.speech ?? segment.original).join(joiner),
      marked: work.kind === 'kanbun' ? own.map((segment) => segment.marked ?? '').join('') : '',
      entry,
    })
  }
  if (cursor !== segments.length) {
    errors.push(`${work.id}: 台帳の文のあとに、文に入っていない区切りが ${segments.length - cursor} 個あります`)
  }
  numberParts(sentences)
  return Object.freeze({
    sentences: Object.freeze(sentences.map((sentence) => Object.freeze(sentence))),
    errors: Object.freeze(errors),
  })
}

function cached(work) {
  if (!work) return { sentences: [], errors: [] }
  if (!CACHE.has(work)) CACHE.set(work, buildSentences(work))
  return CACHE.get(work)
}

// 押して解説を開く単位（文）の並び。
export function literatureSentences(work) {
  return cached(work).sentences
}

// 台帳と朗読の区切りが合わないときの誤り（テストで空を確かめる）。
export function literatureSentenceErrors(work) {
  return cached(work).errors
}

// 段落ごとの文の並び。
export function literatureParagraphs(work) {
  const groups = []
  for (const sentence of literatureSentences(work)) {
    if (!groups.length || sentence.paragraphStart) groups.push({ index: groups.length, sentences: [] })
    groups.at(-1).sentences.push(sentence)
  }
  return groups
}

// 長い1文を分けたとき、どこで分けたか（分けた部分どうしの境目の記号・語）。
function partBreakLabel(before, after) {
  const last = before.trim().slice(-1)
  if (last === ';') return 'セミコロン（;）のところ'
  if (last === ':') return 'コロン（:）のところ'
  if (last === '—') return 'ダッシュ（—）のところ'
  if (last === ')' || after.trim().startsWith('(')) return 'かっこに入った語りの前後'
  const word = after.trim().match(/^[A-Za-z]+/)?.[0]
  return word ? `${word} の前` : '区切りのところ'
}

// 分けた文の境目の説明（同じ説明はまとめる）。分けていない文は空。
export function literaturePartBreaks(sentences, index) {
  const sentence = sentences?.[index]
  if (!sentence || sentence.partCount < 2) return []
  const start = index - sentence.partIndex
  const labels = []
  for (let at = start; at < start + sentence.partCount - 1; at++) {
    labels.push(partBreakLabel(sentences[at].text, sentences[at + 1].text))
  }
  return [...new Set(labels)]
}

// 朗読の区切り（場面番号・区切り番号）から、その区切りを含む文の番号を引く。
export function literatureSentenceIndexForSegment(work, sceneIndex, segmentIndex) {
  return literatureSentences(work).findIndex((sentence) =>
    sentence.segments.some((segment) =>
      segment.sceneIndex === sceneIndex && segment.segmentIndex === segmentIndex))
}
