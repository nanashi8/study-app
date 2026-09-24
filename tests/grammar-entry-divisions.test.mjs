// 文法の入口は1つ。「級別」と「単元別」の2区分を、同じ並び・同じ部品で出し、
// 画面遷移なしで切り替える。どちらの区分からも参考書の全単元に入れる。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { LEVELS } from '../src/data/levels.js'
import { GRAMMAR_STRANDS, grammarTopicKey, grammarTopicPairs } from '../src/data/grammar-strands.js'
import { GRAMMAR_REFERENCE_UNITS, grammarReferenceByLevel } from '../src/data/grammar-reference/index.js'
import { completedSessionDestination } from '../src/lib/navigationPolicy.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const grammar = read('src/screens/Grammar.jsx')

test('文法の入口は「級別」「単元別」の2区分で、画面遷移なしに切り替わる', () => {
  // 区分は params に置くので、参考書やテストから戻っても同じ区分に戻る。
  assert.match(grammar, /const \[division, setDivision\] = useScreenParam\('view', readDivision\)/)
  assert.match(grammar, /data-grammar-division-switch/)
  for (const id of ['level', 'strand']) {
    assert.match(grammar, new RegExp(`\\{ id: '${id}', label: '(級別|単元別)'`))
  }
  assert.match(grammar, /data-grammar-division=\{division\.id\}/)
  // 切り替えは状態の更新だけ。別画面へ飛ばさない。
  assert.match(grammar, /onChange=\{setDivision\}/)
  assert.doesNotMatch(grammar, /navigate\('grammarStrands'/)

  // 級をまたぐ学習（系統）の画面は、この入口に統合して無くす。
  assert.throws(() => read('src/screens/GrammarStrands.jsx'))
  assert.doesNotMatch(read('src/App.jsx'), /GrammarStrands\.jsx/)
})

test('どちらの区分も「タブ→まとめのカード→単元の行」の同じ並びで、同じ部品を使う', () => {
  // タブは共通の部品。級別は7級、単元別は25系統。
  const tabs = [...grammar.matchAll(/<DivisionTabs\s+tabs=\{(level|strand)Tabs\}/g)].map((m) => m[1])
  assert.deepEqual(tabs, ['level', 'strand'])
  assert.equal(LEVELS.filter((level) => grammarReferenceByLevel(level.id).length > 0).length, 7)
  assert.equal(GRAMMAR_STRANDS.length, 25)

  // まとめのカードも単元の行も LearningEntryCard。行は共通の UnitRow。
  for (const division of ['LevelDivision', 'StrandDivision']) {
    const block = grammar.slice(grammar.indexOf(`function ${division}(`))
    assert.match(block, /<LearningEntryCard/, division)
    assert.match(block, /<UnitRow/, division)
    assert.match(block, /目次/, division)
  }
  assert.match(grammar, /function UnitRow\(/)
  assert.match(grammar, /studyLabel="学習"/)
  assert.match(grammar, /quizAriaLabel=\{`「\$\{unit\.topic\}」を\$\{typeMeta\.label\}でテスト/)

  // テストの問題の種類は区分をまたいで持ち越し、どちらの区分でも同じ位置に置く。
  assert.equal([...grammar.matchAll(/<QuestionTypePicker/g)].length, 1)
  assert.match(grammar, /const \[questionType, setQuestionType\] = useScreenParam\('questionType', readQuestionType\)/)
  assert.match(grammar, /division === 'level'\n\s*\? grammarPracticeByLevel\(level, type\)\.length/)
})

test('参考書の全127単元が、級別からも単元別からも入口を持つ', () => {
  assert.equal(GRAMMAR_REFERENCE_UNITS.length, 127)

  // 級別：級タブ → その級の目次。
  const byLevel = LEVELS.flatMap((level) => grammarReferenceByLevel(level.id))
  assert.equal(byLevel.length, GRAMMAR_REFERENCE_UNITS.length)

  // 単元別：系統タブ → その系統の段（級ごとの単元）。
  const strandUnits = GRAMMAR_STRANDS.flatMap((strand) =>
    strand.topics.map(([level, topic]) => grammarTopicKey(level, topic)))
  assert.equal(new Set(strandUnits).size, strandUnits.length, '同じ単元が2つの系統に入っている')
  const reachable = new Set(strandUnits)
  const missing = GRAMMAR_REFERENCE_UNITS
    .filter((unit) => !reachable.has(grammarTopicKey(unit.level, unit.topic)))
    .map((unit) => `${unit.level}/${unit.topic}`)
  assert.deepEqual(missing, [], '単元別から入れない単元がある')
  assert.equal(reachable.size, 127)

  // 出題在庫の(級,単元)とも過不足なく一致する。
  assert.deepEqual([...reachable].sort(), [...grammarTopicPairs()].sort())
})

test('系統のテストを終えると、別画面ではなく単元別の区分へ戻る', () => {
  assert.deepEqual(
    completedSessionDestination({
      engine: 'grammar',
      replayScreen: 'grammarQuiz',
      source: { type: 'grammarStrand', strandId: 'comparison' },
    }),
    { screen: 'grammar', params: { view: 'strand', strand: 'comparison' } },
  )
  assert.deepEqual(
    completedSessionDestination({ engine: 'grammar', replayScreen: 'grammarQuiz', source: { type: 'grammar' } }),
    { screen: 'grammar', params: {} },
  )
})
