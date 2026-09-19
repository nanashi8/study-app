import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { LEVELS } from '../src/data/levels.js'
import { grammarPracticeTopicsForLevel } from '../src/data/grammar.js'
import { GRAMMAR_STRANDS } from '../src/data/grammar-strands.js'
import {
  GRAMMAR_REFERENCE_UNITS,
  GRAMMAR_STRAND_REFERENCES,
  grammarReferenceById,
  grammarReferenceByLevel,
  grammarReferenceFor,
  grammarReferenceNeighbors,
  grammarStrandReferenceFor,
  nextGrammarReferenceUnit,
  readGrammarReferenceIds,
} from '../src/data/grammar-reference/index.js'
import {
  exampleParts,
  explanationParts,
  prepareReferenceUnit,
  resolveReferenceWord,
  splitEnglish,
} from '../src/lib/grammarReferenceText.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const words = (parts) => parts.filter((part) => part.kind === 'word').map((part) => part.text)
const terms = (parts) => parts.filter((part) => part.kind === 'term').map((part) => part.term)

test('文法の参考書は、テストのある級・単元すべてに1ページずつある（127単元・級ごとに学ぶ順）', () => {
  assert.equal(GRAMMAR_REFERENCE_UNITS.length, 127)
  const counts = Object.fromEntries(LEVELS.map((level) => [level.id, grammarReferenceByLevel(level.id).length]))
  assert.deepEqual(counts, { 5: 12, 4: 15, 3: 16, pre2: 26, 2: 26, pre1: 20, 1: 12 })
  for (const level of LEVELS) {
    for (const topic of grammarPracticeTopicsForLevel(level.id, 'mixed')) {
      const unit = grammarReferenceFor(level.id, topic)
      assert.ok(unit, `${level.id}/${topic}`)
      assert.equal(grammarReferenceById(unit.id), unit)
    }
  }
  // 学ぶ順：5級は be動詞から命令文まで。前後の単元は同じ級の中だけでつなぐ。
  assert.equal(grammarReferenceByLevel('5')[0].topic, 'be動詞')
  const { previous, next } = grammarReferenceNeighbors('gref_5_be')
  assert.equal(previous, null)
  assert.equal(next.id, 'gref_5_verb')
  assert.equal(grammarReferenceNeighbors(grammarReferenceByLevel('5').at(-1).id).next, null)
})

test('級をまたいだ25系統のページは、系統の段（級・単元）と同じ順でそろい、各段の単元ページへつながる', () => {
  assert.equal(GRAMMAR_STRAND_REFERENCES.length, GRAMMAR_STRANDS.length)
  for (const strand of GRAMMAR_STRANDS) {
    const reference = grammarStrandReferenceFor(strand.id)
    assert.ok(reference, strand.id)
    assert.deepEqual(
      reference.steps.map((step) => [step.level, step.topic]),
      strand.topics,
      strand.id,
    )
    for (const step of reference.steps) assert.ok(grammarReferenceFor(step.level, step.topic), `${strand.id} ${step.topic}`)
  }
  // 系統に入っていない前置詞の単元は、前置詞の系統ページから「つながる単元」として読める。
  assert.deepEqual(
    grammarStrandReferenceFor('preposition').related.map((item) => `${item.level}:${item.topic}`),
    ['4:前置詞', '2:前置詞', 'pre1:前置詞'],
  )
})

test('例文の英単語はすべてタップで意味が出る。文脈に合わない辞書の意味は例文ごとの意味で上書きする', () => {
  for (const unit of GRAMMAR_REFERENCE_UNITS) {
    const page = prepareReferenceUnit(unit)
    const examples = [
      ...page.forms.flatMap((form) => (form.example ? [form.example] : [])),
      ...page.points.flatMap((point) => point.examples),
    ]
    for (const example of examples) {
      const english = splitEnglish(example.en).filter((part) => part.kind === 'en').map((part) => part.text)
      assert.deepEqual(words(example.parts), english, `${unit.id}: ${example.en}`)
    }
  }
  // 例文の意味 → 参考書の語義表 → 辞書 の順に引く。
  assert.equal(resolveReferenceWord('over', { over: 'over there で「あそこに」' }).ja, 'over there で「あそこに」')
  assert.match(resolveReferenceWord('went').ja, /go の過去形/)
  assert.equal(resolveReferenceWord('went').headword, 'go')
  assert.match(resolveReferenceWord('don’t').ja, /do not の短縮形/)
  assert.match(resolveReferenceWord('Ken’s').ja, /’s が付いて「〜の」/)
  assert.match(resolveReferenceWord('yet').ja, /まだ/)
})

test('本文の英語は、記号の1文字や語尾の断片を引かず、5月の May と助動詞の may を見分ける', () => {
  assert.deepEqual(words(explanationParts('y → ies（city → cities）')), ['city', 'cities'])
  assert.deepEqual(words(explanationParts('S＋V＋O、A and B')), ['and'])
  assert.deepEqual(words(explanationParts('I のときは am')), ['I', 'am'])
  const month = explanationParts('on May 5、in May').filter((part) => part.kind === 'word' && part.text === 'May')
  assert.equal(month.length, 2)
  assert.ok(month.every((part) => part.word.ja === '5月'))
  const modal = exampleParts('May I use your pen?').find((part) => part.text === 'May')
  assert.match(modal.word.ja, /してもよい/)
})

test('用語はまとまりごとに最初の1回だけタップでき、長い用語を先に当てる', () => {
  const seen = new Set()
  const first = explanationParts('主語が3人称単数なら、主語に合わせて be動詞は is。代名詞と名詞。', seen)
  assert.deepEqual(terms(first), ['主語', '3人称単数', 'be動詞', '代名詞', '名詞'])
  const second = explanationParts('主語と be動詞', seen)
  assert.deepEqual(terms(second), [])
  // 季節の「節」は用語にしない。
  assert.deepEqual(terms(explanationParts('月・季節・年には in')), [])
})

test('続きから読む単元は、最後に読んだ単元の次のまだ読んでいない単元', () => {
  assert.equal(nextGrammarReferenceUnit([]).id, 'gref_5_be')
  assert.equal(nextGrammarReferenceUnit(['gref_5_be']).id, 'gref_5_verb')
  assert.equal(nextGrammarReferenceUnit(['gref_5_verb', 'gref_5_be']).id, 'gref_5_negq')
  // 長文の読了（readingsDone を共有）は数えない。
  assert.deepEqual([...readGrammarReferenceIds(['passage-1', 'gref_5_be'])], ['gref_5_be'])
  const all = GRAMMAR_REFERENCE_UNITS.map((unit) => unit.id)
  assert.equal(nextGrammarReferenceUnit(all), null)
})

test('文法のトップは「学習」と「テスト」の2つの入口を持ち、学習は参考書、テストは問題へ進む', () => {
  const grammar = read('src/screens/Grammar.jsx')
  assert.match(grammar, /\{ id: 'learn', label: '学習'/)
  assert.match(grammar, /\{ id: 'test', label: 'テスト'/)
  assert.match(grammar, /useScreenParam\('mode', readMode\)/)
  assert.match(grammar, /navigate\('grammarReference', \{ unitId \}\)/)
  assert.match(grammar, /navigate\('grammarStrands', \{ mode \}\)/)
  const reference = read('src/screens/GrammarReference.jsx')
  // 最後まで読んだら読んだ記録、テストは同じ級・単元の3種類で出し、終わったらこのページへ戻る。
  assert.match(reference, /markReadingDone\(unit\.id\)/)
  assert.match(reference, /source: \{ type: 'grammar', level: unit\.level, topic: unit\.topic, questionType: 'mixed' \}/)
  assert.match(reference, /returnTo: \{ screen: 'grammarReference', params: \{ unitId: unit\.id \} \}/)
  const strand = read('src/screens/GrammarStrandReference.jsx')
  assert.match(strand, /source: \{ type: 'grammarStrand', strandId: strand\.id, level: overview\.currentLevel \}/)
  const app = read('src/App.jsx')
  assert.match(app, /grammarReference: GrammarReferenceScreen/)
  assert.match(app, /grammarStrandReference: GrammarStrandReferenceScreen/)
  assert.doesNotMatch(app, /grammarLessons/)
})
