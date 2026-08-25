import { auditExtendedReadings } from '../src/lib/extendedReadingAudit.js'

const result = auditExtendedReadings()

if (!result.ok) {
  console.error('語彙強化ロングリーディング監査: NG')
  for (const error of result.errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  const metrics = result.metrics
  console.log('語彙強化ロングリーディング監査: OK')
  console.log(`- 追加: ${metrics.passageCount}本 / ${metrics.actualWords.map((count) => `${count.toLocaleString()}語`).join('・')} / 合計${metrics.totalWords.toLocaleString()}語`)
  console.log(`- 本文語彙カバー: ${metrics.baselineCoveredVocabulary.toLocaleString()}/${metrics.dictionarySize.toLocaleString()} (${metrics.baselineCoveragePercent}%) → ${metrics.combinedCoveredVocabulary.toLocaleString()}/${metrics.dictionarySize.toLocaleString()} (${metrics.combinedCoveragePercent}%)`)
  console.log(`- 純増: ${metrics.coverageGain.toLocaleString()}語 / 重点語: ${metrics.targetVocabularyCount.toLocaleString()}語 / 未解決トークン: ${metrics.unresolvedExtendedTokenCount}`)
  console.log(`- 問題: 内容${metrics.contentQuestionCount}問・並び替え${metrics.practiceTypeCounts['word-order']}問・文法${metrics.practiceTypeCounts.grammar}問・語法${metrics.practiceTypeCounts.usage}問`)
  for (const [level, coverage] of Object.entries(metrics.coverageByLevel)) {
    console.log(`  ${level}: ${coverage.before}/${coverage.total} (${coverage.beforePercent}%) → ${coverage.after}/${coverage.total} (${coverage.afterPercent}%) / +${coverage.gain}`)
  }
}
