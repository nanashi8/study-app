import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getGrammar,
  grammarByLevel,
  grammarByTopic,
  topicsForLevel,
} from '../src/data/grammar.js'
import {
  buildGrammarDeck,
  grammarCandidates,
  grammarVariationKey,
} from '../src/lib/grammarDeck.js'

const LEVELS = ['5', '4', '3', 'pre2', '2', 'pre1', '1']

function seededRng(seed) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

function assertNoRepeatedVariation(deck, label) {
  const keys = deck.map(grammarVariationKey)
  assert.equal(new Set(keys).size, keys.length, label)
}

test('固定seedで再現した連続同型を、級別デッキから完全に除く', () => {
  const deck = buildGrammarDeck(
    { type: 'grammar', level: '5' },
    { day: 0, rng: seededRng(2) },
  )
  assert.equal(deck.length, 10)
  assertNoRepeatedVariation(deck, '英検5級 seed=2')
  assert.ok(
    deck.every((item, index) => index === 0 || item.topic !== deck[index - 1].topic),
    '異なる単元を選べる級別デッキでは同じ単元も連続させない',
  )
})

test('全級・多数の並び順で、語句差し替えだけの同型は1セッション1問にする', () => {
  for (const level of LEVELS) {
    for (let seed = 1; seed <= 100; seed++) {
      const deck = buildGrammarDeck(
        { type: 'grammar', level },
        { day: 0, rng: seededRng(seed) },
      )
      assert.equal(deck.length, 10, `英検${level}級 seed=${seed}`)
      assertNoRepeatedVariation(deck, `英検${level}級 seed=${seed}`)
    }
  }
})

test('単元別クイズは同型で10問に水増しせず、異なる出題型だけを選ぶ', () => {
  for (const level of LEVELS) {
    for (const topic of topicsForLevel(level)) {
      const source = { type: 'grammar', level, topic }
      const candidates = grammarByTopic(level, topic)
      const expected = Math.min(
        10,
        new Set(candidates.map(grammarVariationKey)).size,
      )
      const deck = buildGrammarDeck(source, { day: 0, rng: seededRng(7) })
      assert.equal(deck.length, expected, `英検${level}級「${topic}」`)
      assertNoRepeatedVariation(deck, `英検${level}級「${topic}」`)
    }
  }
})

test('期限切れ・未着手・既習の優先順位を保ち、期限切れ復習も同型を重ねない', () => {
  const levelItems = grammarByLevel('5')
  const uniqueDue = []
  const seen = new Set()
  for (const item of levelItems) {
    const key = grammarVariationKey(item)
    if (seen.has(key)) continue
    seen.add(key)
    uniqueDue.push(item)
    if (uniqueDue.length === 10) break
  }
  const dueIds = new Set(uniqueDue.map((item) => item.id))
  const srs = Object.fromEntries(uniqueDue.map((item) => [item.id, { due: 20, box: 1 }]))

  const levelDeck = buildGrammarDeck(
    { type: 'grammar', level: '5' },
    { srs, day: 20, rng: seededRng(11) },
  )
  assert.ok(levelDeck.every((item) => dueIds.has(item.id)), '期限切れ10問を未着手より優先する')

  const repeatedFamily = levelItems.filter(
    (item) => item.pattern === 'auto:5_third_present',
  ).slice(0, 3)
  const dueOnlySrs = Object.fromEntries(
    [...repeatedFamily, uniqueDue[0]].map((item) => [item.id, { due: 20, box: 1 }]),
  )
  const dueDeck = buildGrammarDeck(
    { type: 'grammarDue' },
    { srs: dueOnlySrs, day: 20, rng: seededRng(13) },
  )
  assert.equal(dueDeck.length, 2, '同型3問は代表1問だけにする')
  assertNoRepeatedVariation(dueDeck, '期限切れ復習')
  assert.ok(dueDeck.every((item) => dueOnlySrs[item.id]), '期限切れ以外を混ぜない')
})

test('候補抽出は級・単元・指定IDを正確に保つ', () => {
  const levelItems = grammarByLevel('4')
  assert.equal(
    grammarCandidates({ type: 'grammar', level: '4' }).length,
    levelItems.length,
  )
  const topic = levelItems[0].topic
  assert.deepEqual(
    grammarCandidates({ type: 'grammar', level: '4', topic }).map((item) => item.id),
    grammarByTopic('4', topic).map((item) => item.id),
  )
  const ids = [levelItems[2].id, 'missing-grammar-id', levelItems[0].id]
  assert.deepEqual(
    grammarCandidates({ type: 'grammarList', ids }).map((item) => item.id),
    [levelItems[2].id, levelItems[0].id],
  )
})

test('既存手作り・生成・入試型にまたがる同じ文法判断も1問に束ねる', () => {
  const equivalentGroups = [
    ['gr_5_pron_1', 'gr_auto_5_pronoun_001', 'gr_exam_eiken_5_pronoun_form_001'],
    ['gr_5_neg_1', 'gr_exam_eiken_5_present_negative_001'],
    ['gr_4_comp_6', 'gr_exam_eiken_4_equal_comparison_001'],
    ['gr_4_have_to_1', 'gr_exam_eiken_4_have_to_001'],
    ['gr_3_perf_6', 'gr_exam_eiken_3_perfect_question_001'],
    ['gr_pre2_ger_5', 'gr_auto_4_used_to_001', 'gr_exam_eiken_pre2_used_to_contrast_001'],
    ['gr_1_subj_1', 'gr_auto_1_mandative_001', 'gr_exam_university_pre1_mandative_001'],
    ['gr_1_invc_1', 'gr_exam_university_1_not_until_inversion_001'],
    ['gr_more_pre1_conc_01', 'gr_exam_university_pre1_concession_as_001'],
  ]

  for (const ids of equivalentGroups) {
    const items = ids.map(getGrammar)
    assert.ok(items.every(Boolean), ids.join(', '))
    assert.equal(
      new Set(items.map(grammarVariationKey)).size,
      1,
      ids.join(', '),
    )
  }

  const ids = equivalentGroups.flat()
  const deck = buildGrammarDeck(
    { type: 'grammarList', ids },
    { size: ids.length, rng: seededRng(29) },
  )
  assert.equal(deck.length, equivalentGroups.length)
  assertNoRepeatedVariation(deck, '級をまたぐ保存リスト')
})
