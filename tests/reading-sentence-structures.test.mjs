import test from 'node:test'
import assert from 'node:assert/strict'

import { ANNOTATED_PASSAGES } from '../src/data/passages.js'
import { READING_SENTENCE_STRUCTURES } from '../src/data/reading-structures/index.js'
import { READING_PARAGRAPH_GUIDES } from '../src/data/reading-paragraph-guides.js'
import { READING_RULES_BY_ID } from '../src/data/reading-rules.js'
import { READING_GRAMMAR_EXPECTATIONS } from '../src/data/reading-grammar-expectations.js'
import { analyzeReadingSentence, analyzePassageParagraphs } from '../src/lib/reading-grammar.js'
import {
  buildSentenceStructure,
  structurePatternName,
  structureWords,
  structureRolesForWordSpan,
  unbracketedPrepositions,
} from '../src/lib/reading-sentence-structure.js'

const passageById = new Map(ANNOTATED_PASSAGES.map((passage) => [passage.id, passage]))

// 語彙強化ロングリーディングは節ごとに手で確かめて台帳へ移す。
// ここに書いた文数までが台帳、その先は台帳ができるまで解析器の表示のまま。
const LEDGERS_IN_PROGRESS = Object.freeze({})

// 台帳がある文（途中までの長文は、その文数まで）。
function ledgerSentences(passageId, passage) {
  const covered = LEDGERS_IN_PROGRESS[passageId] ?? passage.sentences.length
  return passage.sentences.slice(0, covered)
}

test('構造台帳は本文と同じ順番・同じ英文で、書き方の誤りがない', () => {
  for (const [passageId, entries] of Object.entries(READING_SENTENCE_STRUCTURES)) {
    const passage = passageById.get(passageId)
    assert.ok(passage, `${passageId}: 本文がない`)
    assert.equal(
      entries.length,
      LEDGERS_IN_PROGRESS[passageId] ?? passage.sentences.length,
      `${passageId}: 文の数が本文と違う`,
    )
    ledgerSentences(passageId, passage).forEach((sentence, index) => {
      const entry = entries[index]
      const structure = buildSentenceStructure(sentence.en, entry.markup, entry)
      assert.deepEqual(structure.errors, [], `${sentence.reviewId}: ${sentence.en}`)
      assert.ok(structure.patterns.length > 0, `${sentence.reviewId}: 文型を決められない`)
      for (const unit of structure.units) {
        assert.ok(unit.functionText, `${sentence.reviewId}: 「${unit.text}」の働きが空`)
      }
      for (const id of entry.rules ?? []) {
        assert.ok(READING_RULES_BY_ID[id], `${sentence.reviewId}: 読解ルール ${id} がない`)
      }
    })
  }
})

test('構造台帳のある文は、画面の要素・構造図・語順訳の役割を台帳から作る', () => {
  for (const [passageId, entries] of Object.entries(READING_SENTENCE_STRUCTURES)) {
    const passage = passageById.get(passageId)
    ledgerSentences(passageId, passage).forEach((sentence, index) => {
      const analysis = analyzeReadingSentence(sentence)
      assert.ok(analysis.structure, `${sentence.reviewId}: 台帳が解析へ届かない`)
      assert.equal(analysis.marked, analysis.structure.marked, `${sentence.reviewId}: 構造図が台帳と違う`)
      assert.deepEqual(
        structureWords(analysis.meaningPhraseSequence.map((phrase) => phrase.spokenEn ?? phrase.en).join(' ')),
        structureWords(sentence.en),
        `${sentence.reviewId}: 語順訳のまとまりから原文に戻せない`,
      )
      assert.equal(
        analysis.structurePhrases.length,
        analysis.meaningPhraseSequence.length,
        `${sentence.reviewId}: 語順訳の役割が足りない`,
      )
      for (const phrase of analysis.structurePhrases) {
        assert.ok(phrase.parts.length > 0 && phrase.explanation, `${sentence.reviewId}: 役割の説明が空`)
      }
      const chunks = entries[index].chunks
      if (chunks) {
        assert.deepEqual(
          analysis.meaningPhraseSequence.map((phrase) => [phrase.spokenEn ?? phrase.en, phrase.ja]),
          chunks.map((chunk) => [chunk.en, chunk.ja]),
          `${sentence.reviewId}: 台帳で指定した語順訳が画面に出ない`,
        )
      }
    })
  }
})

test('構造台帳の主節の文型は、5文型の正解表と一致する', () => {
  for (const [passageId, entries] of Object.entries(READING_SENTENCE_STRUCTURES)) {
    const passage = passageById.get(passageId)
    const expected = READING_GRAMMAR_EXPECTATIONS[passageId]
    assert.ok(expected, `${passageId}: 5文型の正解表がない`)
    ledgerSentences(passageId, passage).forEach((sentence, index) => {
      const structure = buildSentenceStructure(sentence.en, entries[index].markup, entries[index])
      // 命令文は主語 you を省いた形として照らす。正解表は1文に1つなので、
      // 述語が並ぶ文（teach … and show 人 もの など）は、主節の文型のどれかと一致すればよい。
      const mainPatterns = structure.patterns.map((pattern) => pattern.replace(/^\(you\)/, 'S'))
      assert.ok(mainPatterns.includes(expected[index]), `${sentence.reviewId}: 正解表 ${expected[index]}／台帳 ${structure.patterns.join('／')}`)
    })
  }
})

test('段落解説の台帳は段落の数と一致し、4項目すべてを書いている', () => {
  for (const [passageId, guides] of Object.entries(READING_PARAGRAPH_GUIDES)) {
    const passage = passageById.get(passageId)
    assert.ok(passage, `${passageId}: 本文がない`)
    const paragraphs = analyzePassageParagraphs(passage)
    assert.equal(guides.length, paragraphs.length, `${passageId}: 段落の数が違う`)
    for (const [index, item] of paragraphs.entries()) {
      for (const field of ['role', 'summary', 'connection', 'strategy']) {
        assert.ok(`${item[field]}`.trim(), `${passageId} P${index + 1}: ${field} が空`)
      }
    }
  }
})

test('関係代名詞の節は先行詞を含む名詞のまとまりの中に置き、その要素の一部として説明する', () => {
  const structure = buildSentenceStructure(
    'A screen near the office reports the power that the school makes each day.',
    '[S A screen near the office] [V reports] [O the power {関係>the power| [O that] [S the school] [V makes] [M each day]}].',
  )
  assert.deepEqual(structure.errors, [])
  assert.deepEqual(
    structure.elements.map((element) => [element.role, element.trimmed]),
    [
      ['S', 'A screen near the office'],
      ['V', 'reports'],
      ['O', 'the power that the school makes each day'],
    ],
  )
  assert.deepEqual(structure.patterns.map(structurePatternName), ['第3文型（SVO）'])
  const [relative] = structure.units
  assert.equal(relative.label, '関係代名詞の節（形容詞節）')
  assert.deepEqual(
    relative.parts.map((part) => [part.role, part.text]),
    [['O', 'that'], ['S', 'the school'], ['V', 'makes'], ['M', 'each day']],
  )
  assert.match(relative.functionText, /the power を後ろから説明します/)
  const makesEachDay = structureRolesForWordSpan(structure, 11, 14)
  assert.equal(makesEachDay.pattern, 'V＋M')
  assert.equal(makesEachDay.scope, '関係代名詞の節（形容詞節）')
  const reportsThePower = structureRolesForWordSpan(structure, 5, 8)
  assert.equal(reportsThePower.pattern, 'V＋O')
  assert.match(reportsThePower.explanation, /目的語Oは「the power that the school makes each day」全体/)
})

test('台帳の英文が本文と違う・役割のない語がある・説明する名詞が前にない場合は落とす', () => {
  assert.notDeepEqual(
    buildSentenceStructure('We learned that.', '[S We] [V learned] [O this].').errors,
    [],
  )
  assert.notDeepEqual(
    buildSentenceStructure('We learned that.', '[S We] learned [O that].').errors,
    [],
  )
  assert.notDeepEqual(
    buildSentenceStructure(
      'They saw a dog that ran.',
      '[S They] [V saw] [O a dog {関係>a cat| [S that] [V ran]}].',
    ).errors,
    [],
  )
})

// 利用者と例文で確かめた括弧の付け方。
// 2026-09-18、利用者が次を決めた：句 < > の中の句は入れ子にせず、句ごとに閉じて並べる
// （節 ( ) の中の句は < > でくくる）。help・let・make＋人＋原形の原形の部分は < >。
// 数の前の more than＋数は全体を < >。
// 変えるときは、必ず利用者に例文を見せて確認する。勝手に期待値を書き換えない。
const CONFIRMED_BRACKETS = Object.freeze({
  'p_1_collective_memory#5':
    '(When these mechanisms weaken), the past becomes a collection <of isolated facts> <rather than a resource> <for judgment>',
  'p_1_collective_memory#10':
    'The integrity <of public memory> is then shaped less <by (what is available)> than <by (what is repeatedly presented <as relevant>)>',
  'p_1_collective_memory#46':
    '(If that practice declines), even perfect archives will not prevent societies <from losing their ability> <to learn> <from (what they once knew)>',
  'p_pre1_cashless_inclusion#19':
    'Some governments therefore require essential businesses <to accept cash> (while encouraging digital innovation elsewhere)',
  'p_pre2plus_repair_cafes#5':
    '<At these events>, local volunteers help visitors <examine broken things and, (when possible), repair them>',
  'p_1_metric_fixation#17':
    'Judgment can remain informed and humane, but it can also become inconsistent, biased, and difficult <for outsiders> <to challenge>',
  // 名詞を説明する節は句の外（2026-09-18 利用者が決定）。
  'p_pre1_resilient_cities#25':
    'A city (that takes resilience seriously) must therefore evaluate projects <over a long period> <rather than only during the year> (in which they are introduced)',
  'p_2_quiet_technology#17':
    '<In some cases>, a simple repair <to an old bus stop or a clearer sign> may help residents more <than an expensive digital service>',
  'p_pre2_museum_volunteers#15':
    'The museum has also changed the way (it prepares labels <for new displays>)',
  'p_2_space_debris#1':
    '<More than ten thousand> satellites now travel <around the Earth>, and thousands more are planned',
  'p_3_multilingual_town_guide#2':
    'Local students wanted <to help them> <explore the town> <without getting lost>',
  // 2026-09-18 利用者が year after year を一つの句 < > にすると決めた（該当部分の3文を見て選んだ）。
  'p_ext_2000_customs_across_borders#42':
    'Neither change makes the festival false, (since meaning is assigned <by the people> (who actually keep it <year after year>))',
  // 2026-09-18 利用者が示した正しい形：名詞を説明する節は句の外、同格の名詞は括らない。
  'p_4_library_event#4': 'Ms. Brown, one <of the librarians>, will show old pictures <of the town>',
  'p_4_library_event#5': 'She will also talk <about the old station> (that stood <near the river> fifty years ago)',
})

test('利用者と例文で確認した括弧の付け方を保つ', () => {
  for (const [reviewId, expected] of Object.entries(CONFIRMED_BRACKETS)) {
    const [passageId, number] = reviewId.split('#')
    const passage = passageById.get(passageId)
    const sentence = passage.sentences[Number(number) - 1]
    const entry = READING_SENTENCE_STRUCTURES[passageId][Number(number) - 1]
    const structure = buildSentenceStructure(sentence.en, entry.markup, entry)
    assert.equal(structure.marked, expected, reviewId)
  }
})

test('台帳の前置詞は、すべて前置詞句 {前| …} でくくる', () => {
  const issues = []
  for (const [passageId, entries] of Object.entries(READING_SENTENCE_STRUCTURES)) {
    const passage = passageById.get(passageId)
    ledgerSentences(passageId, passage).forEach((sentence, index) => {
      for (const issue of unbracketedPrepositions(
        buildSentenceStructure(sentence.en, entries[index].markup, entries[index]),
      )) {
        issues.push(`${sentence.reviewId} [${issue.word}] ${issue.text}`)
      }
    })
  }
  assert.deepEqual(issues, [])
})

test('節のまとまりには、つなぐ語の種類と見分け方がある', () => {
  for (const [passageId, entries] of Object.entries(READING_SENTENCE_STRUCTURES)) {
    const passage = passageById.get(passageId)
    ledgerSentences(passageId, passage).forEach((sentence, index) => {
      const structure = buildSentenceStructure(sentence.en, entries[index].markup, entries[index])
      for (const unit of structure.units) {
        if (!unit.clause) continue
        assert.ok(unit.connector, `${sentence.reviewId}: 「${unit.text}」のつなぐ語がない`)
        assert.ok(unit.connector.kind, `${sentence.reviewId}: 「${unit.text}」の種類が空`)
        assert.ok(
          unit.connector.explanation.length > 20,
          `${sentence.reviewId}: 「${unit.text}」の見分け方が短い`,
        )
        assert.doesNotMatch(
          unit.connector.explanation,
          /(?:主語 と|動詞 と|直前の （|「」)/u,
          `${sentence.reviewId}: 「${unit.text}」の説明に空欄が残っている`,
        )
      }
      for (const link of structure.links) {
        assert.ok(link.explanation.length > 15, `${sentence.reviewId}: ${link.word} の説明が短い`)
      }
    })
  }
})
