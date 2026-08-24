import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  GRAMMAR,
  getGrammar,
  grammarChoiceGuidanceFor,
  grammarChoiceUsageFor,
} from '../src/data/grammar.js'

test('英文法3450問の誤答10350件すべてに、具体的な使う場面または不使用理由がある', () => {
  let distractorCount = 0
  let validCount = 0
  let invalidCount = 0
  const sources = new Map()

  for (const item of GRAMMAR) {
    assert.equal(item.choices.length, 4, item.id)
    for (const choice of item.choices) {
      if (choice === item.answer) {
        assert.equal(grammarChoiceGuidanceFor(item, choice), null, `${item.id}: ${choice}`)
        continue
      }

      distractorCount += 1
      const guidance = grammarChoiceGuidanceFor(item, choice)
      assert.ok(guidance, `${item.id}: ${choice}`)
      assert.match(guidance.summary, /\S/, `${item.id}: ${choice}`)
      assert.ok(
        guidance.status === 'valid' || guidance.status === 'invalid',
        `${item.id}: ${choice} (${guidance.status})`,
      )
      assert.notEqual(guidance.source, 'unresolved', `${item.id}: ${choice}`)
      assert.notEqual(guidance.source, 'related-vocabulary', `${item.id}: ${choice}`)

      sources.set(guidance.source, (sources.get(guidance.source) ?? 0) + 1)
      if (guidance.status === 'valid') {
        validCount += 1
        assert.ok(
          guidance.example?.en || guidance.pattern,
          `${item.id}: ${choice} に具体的な例・型がない`,
        )
      } else {
        invalidCount += 1
      }
    }
  }

  assert.equal(GRAMMAR.length, 3_450)
  assert.equal(distractorCount, 10_350)
  assert.ok(validCount > 0)
  assert.ok(invalidCount > 0)
  assert.ok(sources.get('grammar-corpus') > 0)
  assert.ok(sources.get('special-rule') > 0)
})

test('代表的な誤答を、別文脈で使える形と使わない形に区別する', () => {
  const beQuestion = getGrammar('gr_5_be_1')
  const isGuide = grammarChoiceGuidanceFor(beQuestion, 'is')
  assert.equal(isGuide.status, 'valid')
  assert.match(isGuide.example.en, /\bis\b/)

  const pluralQuestion = getGrammar('gr_5_plural_1')
  const boxsGuide = grammarChoiceGuidanceFor(pluralQuestion, 'boxs')
  assert.equal(boxsGuide.status, 'invalid')
  assert.match(boxsGuide.summary, /boxes/)

  const usedToQuestion = getGrammar('gr_auto_4_used_to_001')
  assert.match(
    grammarChoiceGuidanceFor(usedToQuestion, 'was used to').pattern,
    /getting up/,
  )
  assert.match(
    grammarChoiceGuidanceFor(usedToQuestion, 'use to').pattern,
    /Did he use to/,
  )
  assert.equal(
    grammarChoiceGuidanceFor(usedToQuestion, 'using to').status,
    'invalid',
  )

  const fishQuestion = getGrammar('gr_5_plural_4')
  assert.equal(grammarChoiceGuidanceFor(fishQuestion, 'fishes').status, 'valid')
  assert.match(grammarChoiceGuidanceFor(fishQuestion, 'fishes').summary, /種類|3単現/)

  const cutQuestion = getGrammar('gr_pre2_caus_2')
  assert.equal(grammarChoiceGuidanceFor(cutQuestion, 'to cut').status, 'valid')
  assert.match(grammarChoiceGuidanceFor(cutQuestion, 'to cut').summary, /不定詞/)

  const comparisonQuestion = getGrammar('gr_auto_3_comparison_004')
  assert.equal(
    grammarChoiceGuidanceFor(comparisonQuestion, 'more bright').status,
    'valid',
  )
  assert.match(
    grammarChoiceGuidanceFor(comparisonQuestion, 'more bright').summary,
    /brighter|対照/,
  )

  const negativeQuestion = getGrammar('gr_exam_eiken_5_present_negative_004')
  assert.equal(grammarChoiceGuidanceFor(negativeQuestion, 'not do').status, 'valid')
  assert.match(grammarChoiceGuidanceFor(negativeQuestion, 'not do').pattern, /must not do/)
})

test('同じ英文で誤答も成立していた既存2問を一意にする', () => {
  const pronounQuestion = getGrammar('gr_depth_4_pron_02')
  assert.match(pronounQuestion.q, /Both|___ of them practice/)
  assert.equal(pronounQuestion.answer, 'Both')

  const concessionQuestion = getGrammar('gr_pre1_conc_2')
  assert.ok(!concessionQuestion.choices.includes('Tired though'))
  assert.ok(concessionQuestion.choices.includes('Although tired'))
})

test('英文法画面は答え合わせ後に正解を含む4択すべての根拠を表示する', async () => {
  const [screenSource, explanationsSource] = await Promise.all([
    readFile(new URL('../src/screens/GrammarQuiz.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/GrammarChoiceExplanations.jsx', import.meta.url), 'utf8'),
  ])
  assert.match(screenSource, /<GrammarChoiceExplanations/)
  assert.match(screenSource, /data-grammar-target-meaning/)
  assert.match(explanationsSource, /選択肢解説（4択すべて）/)
  assert.doesNotMatch(explanationsSource, /選択肢の使い分け|別の場面で使う/)
  assert.match(explanationsSource, /この形は使わない/)
  assert.match(explanationsSource, /data-grammar-choice-guide/)
  assert.match(explanationsSource, /data-choice-correct/)
  assert.match(explanationsSource, /この文で正しい理由：/)
  assert.match(explanationsSource, /この文では：/)
  assert.match(explanationsSource, /この形の使い方：/)

  for (const item of GRAMMAR) {
    assert.equal(grammarChoiceUsageFor(item, item.answer)?.status, 'valid', item.id)
  }
})
