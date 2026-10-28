// 基礎長文の構造台帳の検査（名作・長文の台帳と同じ決まり）。
//   node scripts/checks/basic-reading-structures.mjs [長文idの前方一致]  … 問題をすべて出す（0件なら終了コード0）
import { BASIC_READING_PASSAGES } from '../../src/data/basic-reading/index.js'
import { BASIC_READING_STRUCTURES } from '../../src/data/basic-reading/structures/index.js'
import {
  buildSentenceStructure,
  normalizeStructureText,
  unbracketedPrepositions,
} from '../../src/lib/reading-sentence-structure.js'
import { buildPunctuationNotes, punctuationOccurrences } from '../../src/lib/punctuation-notes.js'
import { READING_RULES_BY_ID } from '../../src/data/reading-rules.js'

// 語順訳の1まとまりの語数の上限（長文の台帳と同じ）。
export const CHUNK_WORD_LIMIT = 8

const nodeText = (nodes) => nodes
  .map((node) => (node.kind === 'text' ? node.text : node.kind === 'separator' ? '' : nodeText(node.children)))
  .join('')

// 並列 {並列| …} に入れ忘れた and・or・but・nor（文頭の語・つなぐ語 [接 …]・成句の中・前置詞の but は除く）。
export function unmarkedCoordinators(structure) {
  const exempt = new Set()
  const mark = (nodes) => nodes.forEach((child) => {
    if (child.kind === 'text') exempt.add(child)
    if (child.children) mark(child.children)
  })
  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.kind === 'unit' && node.base === '成句') mark(node.children)
      if (node.children) walk(node.children)
    }
  }
  walk(structure.root)
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
    if (inner?.role === 'M' && normalizeStructureText(nodeText(inner.children)).replace(/[,.;:!?"]/g, '').trim().toLowerCase() === word.word.toLowerCase()) return
    missing.push(structure.words.slice(Math.max(0, index - 1), index + 2).map((item) => item.word).join(' '))
  })
  return missing
}

export function basicReadingStructureProblems(prefix = '') {
  const problems = []
  let sentences = 0
  let chunks = 0
  for (const passage of BASIC_READING_PASSAGES.filter((item) => item.id.startsWith(prefix))) {
    const entries = BASIC_READING_STRUCTURES[passage.id]
    if (!entries) { problems.push(`${passage.id}: 構造台帳がない`); continue }
    if (entries.length !== passage.sentences.length) problems.push(`${passage.id}: 台帳 ${entries.length}文・本文 ${passage.sentences.length}文`)
    passage.sentences.forEach((sentence, index) => {
      const entry = entries[index]
      const where = `${passage.id}#${index + 1}`
      if (!entry) return
      sentences += 1
      const structure = buildSentenceStructure(sentence.en, entry.markup, entry)
      for (const error of structure.errors) problems.push(`${where}: ${error}`)
      if (entry.fragment ? structure.patterns.length : !structure.patterns.length) {
        problems.push(`${where}: ${entry.fragment ? '動詞のない文（fragment）に文型がある' : '文型を決められない'}`)
      }
      for (const unit of structure.units) {
        if (!unit.functionText) problems.push(`${where}: 「${unit.text}」の働きが空`)
        if (unit.clause && !(unit.connector?.kind && unit.connector.explanation.length > 20)) problems.push(`${where}: 「${unit.text}」のつなぐ語の説明がない`)
      }
      for (const issue of unbracketedPrepositions(structure)) problems.push(`${where}: 前置詞句で囲んでいない [${issue.word}] ${issue.text}`)
      for (const around of unmarkedCoordinators(structure)) problems.push(`${where}: 並列に入れていない …${around}…`)
      for (const id of entry.rules ?? []) if (!READING_RULES_BY_ID[id]) problems.push(`${where}: 読解ルール ${id} がない`)
      if (!entry.chunks?.length) { problems.push(`${where}: 語順訳がない`); return }
      if (normalizeStructureText(entry.chunks.map((chunk) => chunk.en).join(' ')) !== normalizeStructureText(sentence.en)) {
        problems.push(`${where}: 語順訳をつないだ英文が本文と違う: ${entry.chunks.map((chunk) => chunk.en).join(' / ')}`)
      }
      for (const chunk of entry.chunks) {
        chunks += 1
        if (chunk.en.trim().split(/\s+/).length > CHUNK_WORD_LIMIT) problems.push(`${where}: 語順訳が${CHUNK_WORD_LIMIT}語を超える: ${chunk.en}`)
        if (!chunk.ja?.trim()) problems.push(`${where}: 語順訳の日本語がない: ${chunk.en}`)
        else if (/[A-Za-z;:,!?]/.test(chunk.ja)) problems.push(`${where}: 語順訳の日本語に英字・半角の記号: ${chunk.ja}`)
      }
      for (const key of Object.keys(entry.notes ?? {})) {
        if (!entry.chunks.some((chunk) => chunk.en === key)) problems.push(`${where}: notes のキーが語順訳にない: ${key}`)
      }
      for (const key of Object.keys(entry.unitNotes ?? {})) {
        if (!structure.units.some((unit) => unit.text === key)) problems.push(`${where}: unitNotes のキーが節・句にない: ${key}`)
      }
      const marks = buildPunctuationNotes(sentence.en, entry.marks ?? [])
      for (const error of marks.errors) problems.push(`${where}: 記号の働き: ${error}`)
      if (marks.count !== punctuationOccurrences(sentence.en).length) problems.push(`${where}: 記号の働きの数が本文の記号の数と違う`)
    })
  }
  return { problems, sentences, chunks }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { problems, sentences, chunks } = basicReadingStructureProblems(process.argv[2] ?? '')
  for (const problem of problems) console.log(problem)
  console.log(`基礎長文の構造台帳 ${sentences}文・語順訳 ${chunks}まとまり・問題 ${problems.length}件`)
  process.exitCode = problems.length ? 1 : 0
}
