import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readJson = async (relative) => JSON.parse(await readFile(new URL(relative, import.meta.url), 'utf8'))

test('全教材監査台帳は18カテゴリの母数・ゲート・ハッシュ・合否を保持する', async () => {
  const ledger = await readJson('../docs/audits/content-audit-ledger.json')
  assert.equal(ledger.schemaVersion, 1)
  assert.equal(ledger.result, 'pass')
  assert.equal(ledger.failureCount, 0)
  assert.equal(ledger.scope.categoryCount, 19)
  assert.equal(ledger.categories.length, 19)
  assert.equal(ledger.scope.learningItemCount, 17_660)
  assert.equal(ledger.scope.quizItemCount, 17_947)
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

test('問題別解説と選択肢別根拠を混同せず、記録済み台帳の監査数を残す', async () => {
  const ledger = await readJson('../docs/audits/content-audit-ledger.json')
  const grammar = ledger.questionBanks.find((bank) => bank.id === 'grammar')
  const reading = ledger.questionBanks.find((bank) => bank.id === 'reading')
  const extendedReading = ledger.questionBanks.find((bank) => bank.id === 'extended-reading')
  const mathFill = ledger.questionBanks.find((bank) => bank.id === 'math-fill')
  // 数学の歴史のテストは、どの問題も3択で、3択すべてに問題ごとの説明がある。
  const mathHistory = ledger.questionBanks.find((bank) => bank.id === 'math-history')
  assert.ok(mathHistory.questionCount > 0)
  assert.equal(mathHistory.choiceCount, mathHistory.questionCount * 3)
  assert.equal(mathHistory.generalRationaleCount, mathHistory.questionCount)
  assert.equal(mathHistory.choiceSpecificRationaleCount, mathHistory.choiceCount)
  assert.equal(grammar.questionCount, 3_450)
  assert.equal(grammar.choiceCount, 13_800)
  assert.equal(grammar.generalRationaleCount, 3_450)
  assert.equal(grammar.choiceSpecificRationaleCount, 13_800)
  assert.equal(reading.generalRationaleCount, 167)
  assert.equal(extendedReading.questionCount, 16)
  assert.equal(extendedReading.choiceCount, 64)
  assert.equal(extendedReading.generalRationaleCount, 16)
  assert.equal(extendedReading.choiceSpecificRationaleCount, 64)
  assert.equal(mathFill.questionCount, 440)
  assert.equal(mathFill.choiceCount, 1_745)
  assert.equal(mathFill.generalRationaleCount, 440)
  assert.equal(mathFill.choiceSpecificRationaleCount, 1_745)
  assert.deepEqual(ledger.extendedReadingDetail.actualWords, [987, 1_977, 2_956, 3_940])
  assert.equal(ledger.extendedReadingDetail.totalWords, 9_860)
  assert.equal(ledger.extendedReadingDetail.sentenceCount, 528)
  assert.equal(ledger.extendedReadingDetail.targetVocabularyCount, 1_484)
  assert.equal(ledger.extendedReadingDetail.baselineCoveredVocabulary, 1_942)
  assert.equal(ledger.extendedReadingDetail.baselineCoveragePercent, 21.75)
  assert.equal(ledger.extendedReadingDetail.combinedCoveredVocabulary, 3_943)
  assert.equal(ledger.extendedReadingDetail.combinedCoveragePercent, 44.16)
  assert.equal(ledger.extendedReadingDetail.coverageGain, 2_001)
  assert.equal(ledger.extendedReadingDetail.unresolvedExtendedTokenCount, 0)
  assert.deepEqual(ledger.extendedReadingDetail.practiceTypeCounts, {
    'word-order': 4,
    grammar: 4,
    usage: 4,
  })
  assert.ok(ledger.extendedReadingDetail.contentSha256)
  assert.equal(ledger.grammarDetail.correctChoiceRationaleCount, 3_450)
  assert.equal(ledger.grammarDetail.distractorRationaleCount, 10_350)
  assert.equal(ledger.grammarDetail.answerPathCount, 17_250)
  assert.equal(ledger.grammarDetail.uniqueDecisionFailureCount, 0)
})

test('次回の台帳算定は長文の全和訳ゲートと全選択肢解説を必須にする', async () => {
  const source = await readFile(new URL('../scripts/content-audit-ledger.mjs', import.meta.url), 'utf8')
  assert.match(source, /readingTranslations:\s*\{[\s\S]*?npm run audit:reading-translations/)
  assert.match(source, /extendedReading:\s*\{[\s\S]*?npm run audit:extended-reading/)
  assert.match(source, /questionFormats:\s*\{[\s\S]*?npm run audit:question-formats/)
  assert.match(source, /reading: \['english', 'readingTranslations', 'extendedReading', 'questionFormats'\]/)
  assert.match(source, /grammar: \['english', 'grammar', 'questionFormats'\]/)
  assert.match(source, /stringBank\('reading'[\s\S]*?choiceRationalesFor:/)
  assert.match(source, /既存英語長文560択、語彙強化長文64択で全択監査/)
})

test('長文と診断の読解の正解・全誤答・わからない経路数と、選択肢の説明の数を残す', async () => {
  const ledger = await readJson('../docs/audits/content-audit-ledger.json')
  const paths = ledger.readingAnswerPaths
  assert.equal(ledger.instructorAnswerPaths, undefined)
  assert.equal(paths.coverageTest, 'tests/reading-question-translations.test.mjs')
  assert.equal(paths.result, 'pass')
  assert.equal(paths.failureCount, 0)
  // 長文42本の183問と、学習診断の読解28問。どの経路でも根拠の解説と出題した選択肢すべての説明を出す。
  assert.equal(paths.questionCount, 211)
  assert.equal(paths.displayedChoiceCount, 823)
  assert.equal(paths.choiceNoteCount, 823)
  assert.equal(paths.unknownPathCount, 211)
  assert.equal(paths.answerPathCount, 1_034)
  assert.deepEqual(
    paths.families.map(({ id }) => id),
    [
      'reading',
      'diagnostic',
    ],
  )
})

test('全教材監査コマンドは成功後だけ台帳を書き、通常checkは陳腐化を検査する', async () => {
  const packageJson = await readJson('../package.json')
  assert.equal(packageJson.scripts['audit:all-content'], 'node scripts/record-content-audit.mjs')
  assert.equal(packageJson.scripts['audit:content-ledger'], 'node scripts/content-audit-ledger.mjs')
  assert.match(packageJson.scripts.check, /check:content.*audit:content-ledger/)
})
