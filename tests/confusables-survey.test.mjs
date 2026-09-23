// つづりが似た語・同じ発音の語の見直し（requests/2026-09-21-relations-remaining.json の confusables-survey）の回帰テスト。
import assert from 'node:assert/strict'
import test from 'node:test'
import { getWord } from '../src/data/vocab.js'
import { confusablesFor } from '../src/lib/wordRelations.js'
import { confusablesSurveyGap } from '../scripts/checks/confusables-survey.mjs'

test('つづりが似た組・同じ発音の組は全件、つづり注意に載せたか、載せない理由を残してある', () => {
  const gap = confusablesSurveyGap()
  assert.deepEqual(gap.undecided, [], '載せても理由もない組')
  assert.deepEqual(gap.stale, [], '母集団でなくなった理由の行')
  assert.deepEqual(gap.badCodes, [], '略号がちがう行')
  assert.ok(gap.pairs > 6_000, gap.pairs)
})

test('取り違えやすい組は、つづり注意の欄に使い分けつきで出す', () => {
  // 発音が同じ組（right と write）、聞き分けにくい音の組（base と vase）、
  // 文字の入れ替え（altitude と latitude）、意味が近く競合する組（compose と comprise）。
  const names = (id) => confusablesFor(getWord(id)).map((item) => item.word.word)
  assert.ok(names('right').includes('write'))
  assert.ok(names('base').includes('vase'))
  assert.ok(names('altitude').includes('latitude'))
  assert.ok(names('compose').includes('comprise'))
  // 使い分けのある組には、その説明を添える。
  const comprise = confusablesFor(getWord('compose')).find((item) => item.word.word === 'comprise')
  assert.match(comprise.usageNote, /から成る/)
  const emigrant = confusablesFor(getWord('emigrant')).find((item) => item.word.word === 'immigrant')
  assert.match(emigrant.usageNote, /出ていく/)
})
