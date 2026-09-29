import test from 'node:test'
import assert from 'node:assert/strict'

import { literatureByKind } from '../src/data/public-domain-literature.js'
import { getLiteratureReadingQuestions } from '../src/data/literature-reading.js'
import { literatureSentences } from '../src/data/literature-sentences.js'
import { analyzeLiteratureSentence } from '../src/lib/literature-sentence-analysis.js'
import { buildReadingRoleAnnotation } from '../src/lib/reading-role-annotations.js'
import { STRUCTURE_DISPLAY_ROLE, normalizeStructureText } from '../src/lib/reading-sentence-structure.js'

// 一文の構文解説（ReadingSentenceDetail）と同じ組み立て：構造図つきの英文に、台帳の主節の要素を当てる。
const displayParts = (elements) => elements.map((part) => ({
  role: STRUCTURE_DISPLAY_ROLE[part.role] ?? part.role,
  text: part.text,
  connector: part.connector ?? '',
}))
// 構造図の記号（節の ( )・句の < >）を外した英文。本文にもとからあるかっこは、構造図では全角の（ ）で見せる。
const plain = (text) => normalizeStructureText(text).replace(/\s+/g, ' ').trim()
const withoutMarks = (marked) => plain(marked.replace(/[()<>]/g, '').replace(/（/g, '(').replace(/）/g, ')'))

// 英語名作の構文解説は、場面ごとではなく本文の1文ごと。文の要素は手で書いた構造台帳から作る。
test('英語名作6作品の全624文は、原文を変えずに文の要素（S・V・O・C・M）を示す', () => {
  const works = literatureByKind('english')
  assert.equal(works.length, 6)
  let total = 0
  for (const work of works) {
    for (const sentence of literatureSentences(work)) {
      total += 1
      const { structure } = analyzeLiteratureSentence(sentence)
      const parts = displayParts(structure.displayElements)
      const annotation = buildReadingRoleAnnotation(structure.markedSentence, parts, {
        allowVerbOmission: sentence.entry.fragment,
      })
      assert.deepEqual(annotation.errors, [], `${sentence.id}: ${JSON.stringify(annotation.errors)}`)
      assert.equal(
        annotation.segments.map((segment) => segment.sourceText).join(''),
        structure.markedSentence,
        `${sentence.id}: 構造図つきの英文をそのまま示す`,
      )
      assert.equal(
        withoutMarks(structure.markedSentence),
        plain(sentence.text),
        `${sentence.id}: 構造図の記号を外すと原文に戻る`,
      )
      if (!sentence.entry.fragment) {
        assert.ok(parts.some((part) => part.role === 'V'), `${sentence.id}: V`)
      }
    }
  }
  assert.equal(total, 624)
})

test('英語名作は各作品3問・4択・根拠の文付きの読解チェックを持ち、根拠の文は本文で押せる文', () => {
  for (const work of literatureByKind('english')) {
    const questions = getLiteratureReadingQuestions(work.id, work)
    const sentences = literatureSentences(work)
    assert.equal(questions.length, 3, work.id)
    assert.equal(new Set(questions.map((item) => item.id)).size, questions.length)
    for (const item of questions) {
      assert.equal(item.choices.length, 4, item.id)
      assert.equal(new Set(item.choices).size, 4, item.id)
      assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < 4, item.id)
      assert.ok(item.explanation.length >= 20, item.id)
      assert.ok(sentences[item.evidenceSentence]?.text, `${item.id}: 根拠の文`)
      assert.equal('evidenceScene' in item, false, `${item.id}: 場面の番号は使わない`)
      assert.doesNotMatch(item.explanation, /第\d+(?:・\d+)*場面/u, `${item.id}: 解説が場面の番号で根拠を示している`)
    }
  }
})

test('白鯨の最後の文も、長い文のまま1文として原文を復元して役割を示す', () => {
  const moby = literatureByKind('english').find((work) => work.id === 'lit_en_moby_dick_water_gazers')
  const sentence = literatureSentences(moby).at(-1)
  assert.match(sentence.text, /^By reason of these things, then, the whaling voyage was welcome;/)
  assert.match(sentence.text, /like a snow hill in the air\.$/)
  const { structure } = analyzeLiteratureSentence(sentence)
  const parts = displayParts(structure.displayElements)
  const annotation = buildReadingRoleAnnotation(structure.markedSentence, parts, { allowVerbOmission: false })
  assert.deepEqual(annotation.errors, [])
  assert.equal(annotation.segments.map((segment) => segment.sourceText).join(''), structure.markedSentence)
  assert.equal(withoutMarks(structure.markedSentence), plain(sentence.text))
  assert.ok(parts.some((part) => part.role === 'V'))
})
