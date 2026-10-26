import test from 'node:test'
import assert from 'node:assert/strict'

import {
  USAGE_GUIDE_SKIP_REASONS,
  readUsageGuideSurvey,
  usageGuideSurveyGap,
} from '../scripts/checks/usage-guide-survey.mjs'

// 使い分けカードにする組の候補を全件読んだ（requests/2026-10-26-usage-guide-cards.json）。
// 候補は scripts/checks/usage-guide-survey.mjs が辞書・熟語・関連語の台帳から拾い、
// カードに2つとも入っていれば決まり、入れない組は docs/audits/usage-guide-survey.json に理由の略号を残す。
// 語や熟語を足すと新しい組が出るので、読むまでここで止まる。

const gap = usageGuideSurveyGap()

test('見出し語どうしの候補の組はすべて、カードに入れたか理由を残した', () => {
  // 2026-10-26 に 26,934組を全件読んだ。
  assert.ok(gap.wordPairs >= 26900, `単語どうしの候補が ${gap.wordPairs}組に減った`)
  assert.deepEqual(gap.undecided.word.slice(0, 20), [], `決めていない単語の組 ${gap.undecided.word.length}組`)
})

test('熟語・構文を含む候補の組はすべて、カードに入れたか理由を残した', () => {
  // 2026-10-26 に 4,373組を全件読んだ。
  assert.ok(gap.phrasePairs >= 4300, `熟語を含む候補が ${gap.phrasePairs}組に減った`)
  assert.deepEqual(gap.undecided.phrase.slice(0, 20), [], `決めていない熟語の組 ${gap.undecided.phrase.length}組`)
})

test('理由の台帳に、候補にない古い行・知らない略号・カードと重なる行がない', () => {
  assert.deepEqual(gap.stale.slice(0, 20), [], `古い行 ${gap.stale.length}`)
  assert.deepEqual(gap.badCodes.slice(0, 20), [], `略号ちがい ${gap.badCodes.length}`)
  assert.deepEqual(gap.both.slice(0, 20), [], `カードと理由の両方 ${gap.both.length}`)
  const { reviewed } = readUsageGuideSurvey()
  for (const code of new Set(Object.values(reviewed))) assert.ok(USAGE_GUIDE_SKIP_REASONS[code], code)
})

test('カードに入った組がある（全部を理由で外していない）', () => {
  assert.ok(gap.carded >= 570, `カードに入った組が ${gap.carded}組に減った`)
})
