import { auditEnglishQuestionFormats } from '../src/lib/english-question-format-audit.js'

const audit = auditEnglishQuestionFormats()

console.log('長文・文法の追加形式を全件監査')
console.log(`  完成判定: ${audit.complete ? '完了' : '未完了'}`)
console.log(`  時事長文: ${audit.currentAffairsPassageCount}本・${audit.readingSentenceCount}文`)
console.log(`  時事分野: ${Object.entries(audit.currentAffairsDomainCounts).map(([domain, count]) => `${domain} ${count}本`).join(' / ')}`)
console.log(`  既存語彙: ${audit.existingReadingVocabOccurrenceCount}/${audit.readingVocabOccurrenceCount}登録（異なる語 ${audit.uniqueExistingReadingVocabCount}/${audit.uniqueReadingVocabCount}）`)
console.log(`  長文の追加問題: ${audit.readingPracticeQuestionCount}問（${Object.entries(audit.readingPracticeTypeCounts).map(([type, count]) => `${type} ${count}`).join(' / ')}）`)
console.log(`  読解ルール: ${audit.readingRuleCount}種類`)
console.log(`  文法の追加問題: ${audit.grammarFormatQuestionCount}問（${Object.entries(audit.grammarFormatTypeCounts).map(([type, count]) => `${type} ${count}`).join(' / ')}）`)
console.log(`  級ごと: ${Object.entries(audit.grammarFormatLevelCounts).map(([level, count]) => `${level} ${count}`).join(' / ')}`)
console.log(`  文法選択肢の用法解説: ${audit.grammarChoicePathCount}/${audit.grammarChoicePathCount}経路（うち誤答 ${audit.grammarWrongChoicePathCount}経路）`)
console.log(`  問題: ${audit.issues.length}件`)

for (const issue of audit.issues.slice(0, 40)) {
  console.log(`    - ${issue.type}: ${issue.id}${issue.detail ? ` (${issue.detail})` : ''}`)
}

if (!audit.complete) process.exitCode = 1
