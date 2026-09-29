// 依頼 2026-09-29-literature-full-text-tap の条件 english-structure-detail。
// 英語6作品の全文の各文に、長文読解と同じ手書きの構造台帳（主節の要素 S・V・O・C・M、節・句の入れ子、並列、
// 語順訳のまとまりと日本語、自然な和訳）を書き、長文読解の台帳と同じ検査（前置詞句の囲み・並列・
// 関係詞節の主語・つなぐ語の説明）を通す。自動の解析だけで付けた役割は出さない。
import test from 'node:test'
import assert from 'node:assert/strict'

import { literatureByKind } from '../src/data/public-domain-literature.js'
import { literatureSentences } from '../src/data/literature-sentences.js'
import { LITERATURE_SENTENCE_STRUCTURES } from '../src/data/literature-structures/index.js'
import { analyzeLiteratureSentence } from '../src/lib/literature-sentence-analysis.js'
import {
  buildSentenceStructure,
  normalizeStructureText,
  structureWords,
  unbracketedPrepositions,
} from '../src/lib/reading-sentence-structure.js'
import { READING_RULES_BY_ID } from '../src/data/reading-rules.js'

const nodeText = (nodes) => nodes
  .map((node) => (node.kind === 'text' ? node.text : node.kind === 'separator' ? '' : nodeText(node.children)))
  .join('')

// 成句（sooner or later など）の中の and・or と、前置詞の but（〜を除いて）は並列の接続詞ではない。
function exemptWordNodes(root) {
  const exempt = new Set()
  const mark = (nodes) => nodes.forEach((child) => {
    if (child.kind === 'text') exempt.add(child)
    if (child.children) mark(child.children)
  })
  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.kind === 'unit' && node.base === '成句') mark(node.children)
      if (node.kind === 'unit' && node.base === '前' && node.children[0]?.kind === 'text' && /^\s*but\b/i.test(node.children[0].text)) {
        exempt.add(node.children[0])
      }
      if (node.children) walk(node.children)
    }
  }
  walk(root)
  return exempt
}

// 並列 {並列| …} に入れ忘れた and・or・but・nor（文頭の接続詞・つなぐ語 [接 …]・副詞の but は除く）。
function unmarkedCoordinators(structure) {
  const exempt = exemptWordNodes(structure.root)
  const leads = new Set()
  for (const group of structure.parallel) {
    for (const conjunct of group.conjuncts) {
      for (let at = conjunct.start; at < conjunct.start + conjunct.lead; at++) leads.add(at)
    }
  }
  const missing = []
  structure.words.forEach((word, index) => {
    if (!/^(?:and|or|but|nor)$/i.test(word.word) || leads.has(index) || index === 0) return
    if (exempt.has(word.node)) return
    if (word.elements.some((element) => element.role === '接')) return
    const inner = word.elements.at(-1)
    if (inner?.role === 'M' && normalizeStructureText(nodeText(inner.children)).replace(/[,.;:!?]/g, '').trim().toLowerCase() === word.word.toLowerCase()) return
    const around = structure.words.slice(Math.max(0, index - 1), index + 2).map((item) => item.word).join(' ')
    if (/\bor not\b|\bsooner or later\b/i.test(around)) return
    missing.push(around)
  })
  return missing
}

const englishSentences = () => literatureByKind('english').flatMap((work) =>
  literatureSentences(work).map((sentence) => ({ work, sentence, entry: sentence.entry })))

test('英語6作品の全624文に手書きの構造台帳があり、書き方の誤りがない（文型・節と句の働き・読解ルール）', () => {
  const works = literatureByKind('english')
  assert.deepEqual(
    works.map((work) => LITERATURE_SENTENCE_STRUCTURES[work.id]?.length ?? 0),
    [100, 57, 27, 79, 210, 151],
  )
  const all = englishSentences()
  assert.equal(all.length, 624)
  for (const { sentence, entry } of all) {
    const structure = buildSentenceStructure(sentence.text, entry.markup, entry)
    assert.deepEqual(structure.errors, [], `${sentence.id}: ${sentence.text}`)
    if (entry.fragment) {
      assert.equal(structure.patterns.length, 0, `${sentence.id}: 動詞のない言い切り（fragment）に文型がある`)
    } else {
      assert.ok(structure.patterns.length > 0, `${sentence.id}: 文型を決められない`)
    }
    for (const unit of structure.units) {
      assert.ok(unit.functionText, `${sentence.id}: 「${unit.text}」の働きが空`)
    }
    for (const id of entry.rules ?? []) {
      assert.ok(READING_RULES_BY_ID[id], `${sentence.id}: 読解ルール ${id} がない`)
    }
  }
})

test('長文読解と同じ検査：前置詞はすべて前置詞句で囲み、並列はすべて {並列} に入れる', () => {
  const prepositions = []
  const coordinators = []
  for (const { sentence, entry } of englishSentences()) {
    const structure = buildSentenceStructure(sentence.text, entry.markup, entry)
    for (const issue of unbracketedPrepositions(structure)) prepositions.push(`${sentence.id} [${issue.word}] ${issue.text}`)
    for (const around of unmarkedCoordinators(structure)) coordinators.push(`${sentence.id} …${around}…`)
  }
  assert.deepEqual(prepositions, [])
  assert.deepEqual(coordinators, [])
})

test('節のまとまりには、つなぐ語の種類と見分け方があり、つなぐ語の説明が空でない（関係詞節の主語を含む）', () => {
  for (const { sentence, entry } of englishSentences()) {
    const structure = buildSentenceStructure(sentence.text, entry.markup, entry)
    for (const unit of structure.units) {
      if (!unit.clause) continue
      assert.ok(unit.connector, `${sentence.id}: 「${unit.text}」のつなぐ語がない`)
      assert.ok(unit.connector.kind, `${sentence.id}: 「${unit.text}」の種類が空`)
      assert.ok(unit.connector.explanation.length > 20, `${sentence.id}: 「${unit.text}」の見分け方が短い`)
      assert.doesNotMatch(
        unit.connector.explanation,
        /(?:主語 と|動詞 と|直前の （|「」)/u,
        `${sentence.id}: 「${unit.text}」の説明に空欄が残っている`,
      )
    }
    for (const link of structure.links) {
      assert.ok(link.explanation.length > 15, `${sentence.id}: ${link.word} の説明が短い`)
    }
  }
})

test('語順訳のまとまりは12語以内で英語と日本語が対になり、つなぐと原文に戻る。和訳・語順訳の日本語に英字や半角の記号がない', () => {
  let chunkCount = 0
  for (const { sentence, entry } of englishSentences()) {
    assert.ok(entry.chunks?.length, `${sentence.id}: 語順訳がない`)
    assert.equal(
      normalizeStructureText(entry.chunks.map((chunk) => chunk.en).join(' ')),
      normalizeStructureText(sentence.text),
      `${sentence.id}: 語順訳をつないだ英文が本文と違う`,
    )
    for (const chunk of entry.chunks) {
      chunkCount += 1
      assert.ok(chunk.en.trim().split(/\s+/).length <= 12, `${sentence.id}: 語順訳が長い: ${chunk.en}`)
      assert.ok(chunk.ja?.trim(), `${sentence.id}: 語順訳の日本語がない: ${chunk.en}`)
      assert.doesNotMatch(chunk.ja, /[A-Za-z;:,!?]/, `${sentence.id}: 語順訳の日本語: ${chunk.ja}`)
    }
    assert.ok(entry.ja?.trim(), `${sentence.id}: 和訳がない`)
    assert.doesNotMatch(entry.ja, /[A-Za-z;:,!?]/, `${sentence.id}: 和訳: ${entry.ja}`)
    for (const key of Object.keys(entry.notes ?? {})) {
      assert.ok(entry.chunks.some((chunk) => chunk.en === key), `${sentence.id}: notes のキーが語順訳にない: ${key}`)
    }
  }
  assert.equal(chunkCount, 1575)
})

test('一文の構文解説は台帳から作る：構造図・要素・語順訳の役割がすべて台帳どおりで、自動の解析を使わない', () => {
  for (const { sentence, entry } of englishSentences()) {
    const analysis = analyzeLiteratureSentence(sentence)
    assert.equal(analysis.phraseMethod, 'literature-structure-ledger', sentence.id)
    assert.equal(analysis.marked, analysis.structure.marked, `${sentence.id}: 構造図が台帳と違う`)
    assert.deepEqual(
      structureWords(analysis.meaningPhraseSequence.map((phrase) => phrase.en).join(' ')),
      structureWords(sentence.text),
      `${sentence.id}: 語順訳のまとまりから原文に戻せない`,
    )
    assert.deepEqual(
      analysis.meaningPhraseSequence.map((phrase) => [phrase.en, phrase.ja]),
      entry.chunks.map((chunk) => [chunk.en, chunk.ja]),
      `${sentence.id}: 台帳の語順訳が画面に出ない`,
    )
    assert.equal(analysis.structurePhrases.length, entry.chunks.length, `${sentence.id}: 語順訳の役割が足りない`)
    for (const phrase of analysis.structurePhrases) {
      assert.ok(phrase.parts.length > 0 && phrase.explanation, `${sentence.id}: 役割の説明が空`)
    }
    for (const key of Object.keys(entry.unitNotes ?? {})) {
      assert.ok(analysis.structure.units.some((unit) => unit.text === key), `${sentence.id}: unitNotes のキーが節・句にない: ${key}`)
    }
  }
})

test('白鯨の Call me Ishmael. は命令文の V・O・C（修飾語 M にしない）', () => {
  const moby = literatureByKind('english').find((work) => work.id === 'lit_en_moby_dick_water_gazers')
  const sentence = literatureSentences(moby)[0]
  const structure = buildSentenceStructure(sentence.text, sentence.entry.markup, sentence.entry)
  assert.deepEqual(structure.elements.map((element) => [element.role, element.trimmed]), [
    ['V', 'Call'],
    ['O', 'me'],
    ['C', 'Ishmael'],
  ])
})
