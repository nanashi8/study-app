import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readJson = async (relative) => JSON.parse(await readFile(new URL(relative, import.meta.url), 'utf8'))

test('全教材監査台帳は18カテゴリの母数・ゲート・ハッシュ・合否を保持する', async () => {
  const ledger = await readJson('../docs/audits/content-audit-ledger.json')
  assert.equal(ledger.schemaVersion, 1)
  assert.equal(ledger.result, 'pass')
  assert.equal(ledger.failureCount, 0)
  assert.equal(ledger.scope.categoryCount, 18)
  assert.equal(ledger.categories.length, 18)
  assert.equal(ledger.scope.learningItemCount, 23_234)
  assert.equal(ledger.scope.quizItemCount, 23_352)
  assert.ok(ledger.scope.overallContentSha256)
  assert.ok(ledger.auditImplementation.sha256)
  for (const category of ledger.categories) {
    assert.equal(category.result, 'pass', category.id)
    assert.equal(category.failureCount, 0, category.id)
    assert.ok(category.learningItemCount > 0, category.id)
    assert.ok(category.contentSha256, category.id)
    assert.ok(category.auditGateIds.includes('inventory'), category.id)
  }
})

test('問題別解説と選択肢別根拠を混同せず、文法全4択の監査数を残す', async () => {
  const ledger = await readJson('../docs/audits/content-audit-ledger.json')
  const grammar = ledger.questionBanks.find((bank) => bank.id === 'grammar')
  const reading = ledger.questionBanks.find((bank) => bank.id === 'reading')
  assert.equal(grammar.questionCount, 3_450)
  assert.equal(grammar.choiceCount, 13_800)
  assert.equal(grammar.generalRationaleCount, 3_450)
  assert.equal(grammar.choiceSpecificRationaleCount, 13_800)
  assert.equal(reading.generalRationaleCount, 105)
  assert.equal(reading.choiceSpecificRationaleCount, 0)
  assert.equal(ledger.grammarDetail.correctChoiceRationaleCount, 3_450)
  assert.equal(ledger.grammarDetail.distractorRationaleCount, 10_350)
  assert.equal(ledger.grammarDetail.answerPathCount, 17_250)
  assert.equal(ledger.grammarDetail.uniqueDecisionFailureCount, 0)
})

test('全選択式教材の正解・全誤答・わからない経路数を教材別に残す', async () => {
  const ledger = await readJson('../docs/audits/content-audit-ledger.json')
  const paths = ledger.instructorAnswerPaths
  assert.equal(paths.coverageTest, 'tests/instructor-explanations.test.mjs')
  assert.equal(paths.result, 'pass')
  assert.equal(paths.questionCount, 14_636)
  assert.equal(paths.displayedChoiceCount, 48_286)
  assert.equal(paths.unknownPathCount, 14_636)
  assert.equal(paths.answerPathCount, 62_922)
  assert.deepEqual(
    paths.families.map(({ id }) => id),
    [
      'vocab',
      'phrases',
      'grammar',
      'koten-vocab',
      'koten-grammar',
      'koten-culture',
      'koten-reading',
      'listening',
      'reading',
      'diagnostic',
      'math',
    ],
  )
})

test('全教材監査コマンドは成功後だけ台帳を書き、通常checkは陳腐化を検査する', async () => {
  const packageJson = await readJson('../package.json')
  assert.equal(packageJson.scripts['audit:all-content'], 'node scripts/record-content-audit.mjs')
  assert.equal(packageJson.scripts['audit:content-ledger'], 'node scripts/content-audit-ledger.mjs')
  assert.match(packageJson.scripts.check, /check:content.*audit:content-ledger/)
})
