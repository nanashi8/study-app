import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'

import { getPassage } from '../src/data/passages.js'
import { READING_SENTENCE_STRUCTURES } from '../src/data/reading-structures/index.js'
import { buildSentenceStructure } from '../src/lib/reading-sentence-structure.js'
import {
  layoutParallel,
  layoutPlainText,
  parallelLayoutLines,
  tokenPieces,
} from '../src/lib/structure-parallel-layout.js'
import { ReadingRoleSentence } from '../src/components/ReadingRoleSentence.js'
import { StructureDiagram } from '../src/components/StructureDiagram.js'

const STRUCTURE_ROLE_CODES = Object.freeze({
  S: 'S', V: 'V', O: 'O', O1: 'O1', O2: 'O2', C: 'C', M: 'M', 接: 'LINK',
  仮S: 'S_FORMAL', 真S: 'S_REAL', 仮O: 'O_FORMAL', 真O: 'O_REAL',
})

function ledgerStructure(passageId, number) {
  const passage = getPassage(passageId)
  const entry = READING_SENTENCE_STRUCTURES[passageId][number - 1]
  return buildSentenceStructure(passage.sentences[number - 1].en, entry.markup, entry)
}

function diagramLines(structure) {
  return parallelLayoutLines(layoutParallel(tokenPieces(structure.structureTokens), structure.parallel))
}

// 2026-09-18 利用者が図で決めた3つの形（接続詞は単独の行、並ぶものは1つ目の先頭にそろえる、
// 文どうしは左端から、並びの後ろに続く語句は左端に戻って次の行）。
test('利用者が図で決めた並列の3つの形を、そのとおりに組む', () => {
  assert.deepEqual(diagramLines(ledgerStructure('p_pre2_pond_comeback', 5)), [
    'The students measured the water level',
    '             and',
    '             recorded the temperature every week',
  ])
  assert.deepEqual(diagramLines(ledgerStructure('p_pre2_pond_comeback', 8)), [
    'The prefecture now bans that action,',
    'but',
    'the official rule was too late',
  ])
  const farmers = buildSentenceStructure(
    'Farmers from nearby villages bring vegetables, fruit and flowers in small trucks.',
    '[S Farmers {前| from nearby villages}] [V bring] [O {並列| vegetables, | fruit | and flowers}] [M {前| in small trucks}].',
  )
  assert.deepEqual(farmers.errors, [])
  assert.equal(farmers.marked, 'Farmers <from nearby villages> bring vegetables, fruit and flowers <in small trucks>')
  assert.deepEqual(diagramLines(farmers), [
    'Farmers <from nearby villages> bring vegetables,',
    '                                     fruit',
    '                                     and',
    '                                     flowers',
    '<in small trucks>',
  ])
})

test('並ぶものの始まりは、共有する助動詞・対になる語・コンマの並び・倒置・文末の修飾語で決まる', () => {
  // 共有する can のあとの本動詞にそろえる。
  assert.deepEqual(diagramLines(ledgerStructure('p_4_library_event', 2)), [
    'Children can listen <to stories>,',
    '             make small cards,',
    '             and',
    "             borrow books <about the month's topic>",
  ])
  // コンマのあとで文全体にかかる while 節は、並びの後ろ（左端）へ出す。
  assert.deepEqual(diagramLines(ledgerStructure('p_1_collective_memory', 12)), [
    'A file may still exist',
    '       but',
    '       become unreadable (when software changes),',
    '(while a searchable collection can effectively disappear (if its indexing system is neglected))',
  ])
  // not only … but の not only は1つ目に入れる。
  assert.deepEqual(diagramLines(ledgerStructure('p_ext_1000_civic_decisions', 24)).slice(1), [
    '                                                           but',
    '                                                           (who must act)',
  ])
  assert.match(diagramLines(ledgerStructure('p_ext_1000_civic_decisions', 24))[0], /is not only \(what it forbids\)$/)
  // and so does X（倒置）は文どうし。
  assert.deepEqual(diagramLines(ledgerStructure('p_ext_2000_customs_across_borders', 64)), [
    'Catastrophe accelerates this kind <of loss>,',
    'and',
    'so, much less obviously, does a period <of sudden wealth>',
  ])
  // by A, by B, by C, and by D は4つとも並べる。
  assert.equal(ledgerStructure('p_ext_2000_customs_across_borders', 95).parallel[0].conjuncts.length, 4)
})

test('{並列| …} の書き方の誤りを止める', () => {
  const errors = (markup, sentence) => buildSentenceStructure(sentence, markup).errors
  assert.ok(errors('[S We] [V like] [O {並列| tea and coffee}].', 'We like tea and coffee.').some((error) => error.includes('2つ以上')))
  assert.ok(errors('[S We] [V like] [O {並列| tea, | coffee}].', 'We like tea, coffee.').some((error) => error.includes('and・or・but')))
  assert.ok(errors('[S We] [V like] [O {並列| tea | and}].', 'We like tea and.').some((error) => error.includes('接続語のほかの語')))
  assert.deepEqual(errors('[S We] [V like] [O {並列| tea | and coffee}].', 'We like tea and coffee.'), [])
  // 要素どうしを手で並べるときは、要素の並びに置く。
  assert.deepEqual(
    errors('[S It] [V went] {並列| [M {前| into a ditch}], | [M then] [M {前| into a stream}], | [接 and] [M finally] [M {前| into the sea}]}.',
      'It went into a ditch, then into a stream, and finally into the sea.'),
    [],
  )
})

test('全台帳の並列は、語を落とさず、括弧の出力を変えずに組める', () => {
  let groups = 0
  for (const [passageId, entries] of Object.entries(READING_SENTENCE_STRUCTURES)) {
    const passage = getPassage(passageId)
    entries.forEach((entry, index) => {
      const structure = buildSentenceStructure(passage.sentences[index].en, entry.markup, entry)
      const at = `${passageId}#${index + 1}`
      assert.deepEqual(structure.errors, [], at)
      if (!structure.parallel.length) return
      groups += structure.parallel.length
      const layout = layoutParallel(tokenPieces(structure.structureTokens), structure.parallel)
      assert.equal(layoutPlainText(layout).replace(/\s+/g, ''), structure.marked.replace(/\s+/g, ''), at)
      // 節・句の行の並列は、そのまとまりの語の中に収まる。
      for (const unit of structure.units) {
        const words = unit.marked.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*(?:[-‐][A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*)*/g) ?? []
        for (const group of unit.parallel) assert.ok(group.start >= 0 && group.end <= words.length, `${at} ${unit.text}`)
      }
    })
  }
  assert.ok(groups >= 356, `並列 ${groups}`)
})

test('文の要素と構造図は、並列を改行してそろえ、要素ごとの札は1回だけ出す', () => {
  const structure = ledgerStructure('p_pre2_pond_comeback', 5)
  const parts = structure.elements.map((element) => ({
    role: STRUCTURE_ROLE_CODES[element.role],
    text: element.text,
    connector: element.connector,
  }))
  const html = renderToStaticMarkup(ReadingRoleSentence({
    sentence: structure.markedSentence,
    parts,
    parallel: structure.parallel,
  }))
  assert.match(html, /data-reading-role-layout="parallel"/)
  assert.match(html, /data-reading-role-status="complete"/)
  assert.equal(html.match(/data-reading-role="/g)?.length ?? 0, structure.elements.length)
  assert.equal(html.match(/data-reading-parallel-line="coordinator"/g)?.length ?? 0, 1)
  assert.equal(html.match(/data-reading-parallel-line="item"/g)?.length ?? 0, 2)
  const diagram = renderToStaticMarkup(StructureDiagram({
    tokens: structure.structureTokens,
    parallel: structure.parallel,
  }))
  assert.match(diagram, /data-structure-diagram="parallel-layout"/)
  assert.equal(diagram.match(/data-structure-parallel-line="item"/g)?.length ?? 0, 2)
  // 並列のない文は、これまでどおりの1行の表示。
  const plain = ledgerStructure('p_pre2_pond_comeback', 1)
  assert.equal(plain.parallel.length, 0)
  assert.match(renderToStaticMarkup(StructureDiagram({ tokens: plain.structureTokens, parallel: plain.parallel })), /nested-markers/)
})
