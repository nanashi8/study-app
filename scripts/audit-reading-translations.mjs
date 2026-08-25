import { auditReadingTranslations } from '../src/lib/reading-translation-audit.js'

const audit = auditReadingTranslations()

console.log('長文読解・和訳解説の全件監査')
console.log(`  完成判定: ${audit.complete ? '完了' : '未完了'}`)
console.log(`  長文: ${audit.passageCount}本`)
console.log(`  本文自然訳: ${audit.sentenceTranslationCount}/${audit.sentenceCount}文`)
console.log(`  設問和訳: ${audit.questionTranslationCount}/${audit.questionCount}問`)
console.log(`  根拠解説: ${audit.evidenceExplanationCount}/${audit.questionCount}問`)
console.log(`  選択肢和訳: ${audit.choiceTranslationCount}/${audit.choiceCount}件`)
console.log(`  選択肢正誤解説: ${audit.choiceExplanationCount}/${audit.choiceCount}経路`)
console.log(`  欠落・対応ずれ: ${audit.issues.length}件`)

for (const issue of audit.issues.slice(0, 20)) {
  const location = [
    issue.passageId,
    Number.isInteger(issue.sentenceIndex) ? `文${issue.sentenceIndex + 1}` : '',
    Number.isInteger(issue.questionIndex) ? `問${issue.questionIndex + 1}` : '',
    Number.isInteger(issue.choiceIndex) ? `選択肢${issue.choiceIndex + 1}` : '',
  ].filter(Boolean).join(' / ')
  console.log(`    - ${issue.type}: ${location}${issue.source ? `: ${issue.source}` : ''}`)
}

if (!audit.complete) process.exitCode = 1
