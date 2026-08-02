import { auditPhraseExplanations } from '../src/lib/phrase-explanation-audit.js'

const audit = auditPhraseExplanations()
const sample = (items, count = 5) => items.slice(0, count)

console.log('フレーズ解説・全件監査')
console.log(`  完成判定: ${audit.complete ? '完了' : '未完了'}`)
console.log(
  `  方法規則: ${audit.rules.confirmed}/${audit.rules.total}件確定、` +
  `${audit.rules.reviewNeeded}件確認待ち`,
)
console.log(
  `  長文読解: ${audit.reading.confirmedSentenceCount}/${audit.reading.sentenceCount}文、` +
  `${audit.reading.confirmedPhraseCount}/${audit.reading.phraseCount}フレーズ確認済み、` +
  `手動本文照合 ${audit.reading.manuallyReviewedSentenceCount}/${audit.reading.sentenceCount}文、` +
  `本文別判断 ${audit.reading.appliedCorrectionCount}/${audit.reading.correctionDecisionCount}件適用`,
)
console.log(
  `  接続関係: ${audit.reading.connectorClosureReview.candidateCount}件全件確認、` +
  `括弧受け直し ${audit.reading.connectorClosureReview.backReferenceCount}件、` +
  `既に明確 ${audit.reading.connectorClosureReview.alreadyClearCount}件`,
)
console.log(
  `  長い一文: ${audit.longSentences.confirmedSentenceCount}/${audit.longSentences.sentenceCount}文、` +
  `${audit.longSentences.confirmedPhraseCount}/${audit.longSentences.phraseCount}フレーズ確認済み、` +
  `手動本文照合 ${audit.longSentences.manuallyReviewedSentenceCount}/${audit.longSentences.sentenceCount}文`,
)

const issueRows = [
  ['長文・原文復元エラー', audit.reading.issues.reconstructionErrors],
  ['長文・必須欄の欠落', audit.reading.issues.missingFields],
  ['長文・発音原文の不一致', audit.reading.issues.spokenMismatches],
  ['長文・語数上限超過', audit.reading.issues.overWordLimit],
  ['長文・複数役割の混在', audit.reading.issues.mixedRoles],
  ['長文・真の助動詞/本動詞分断', audit.reading.issues.splitAuxiliaryVerb],
  ['長文・目的語のない前置詞', audit.reading.issues.prepositionFragments],
  ['長文・特殊文法の項目別説明不足', audit.reading.issues.missingSpecialGrammar],
  ['長文・並列の支配関係メタデータ不備', audit.reading.issues.invalidCoordinationBindings],
  ['長文・条件節末の前から訳不足', audit.reading.issues.missingConditionClosures],
  ['長文・節／句末の前から訳不足', audit.reading.issues.missingClauseClosures],
  ['長文・接続関係の受け直し未確認', audit.reading.issues.unreviewedConnectorClosures],
  ['長文・V/M直後Oとの隣接格衝突', audit.reading.issues.adjacentJapaneseCaseCollisions],
  ['長文・セミコロン／コロン境界の欠落', audit.reading.issues.missingPunctuationBoundaries],
  ['長文・文脈機能メタデータ不整合', audit.reading.issues.semanticBindingErrors],
  ['長文・語彙glossフォールバック破損', audit.reading.issues.invalidJapaneseFallbacks],
  ['長文・構造表示台帳の相互不一致', audit.reading.issues.structuralDisplayMismatches],
  ['長文・下段文法ブロックの表示／音声payload不一致', audit.reading.issues.staleGrammarBlockPayloads],
  ['長文・文全体の構文見取り図不一致', audit.reading.issues.grammarBlockStructureMismatches],
  ['長文・内容節／関係詞節のブロック誤分類', audit.reading.issues.misclassifiedGrammarBlocks],
  ['長文・本文別SVOCM判断の未適用', audit.reading.issues.correctionMismatches],
  ['長文・手動レビュー台帳の不整合', audit.reading.issues.missingManualReviewEvidence],
  ['長文・未決規則に該当するフレーズ', audit.reading.issues.pendingRulePhrases],
  ['長文・最終監査未確認文', audit.reading.issues.unreviewedSentences],
  ['長文・最終監査未確認フレーズ', audit.reading.issues.nonConfirmedPhrases],
  ['長い一文・ガイド欠落', audit.longSentences.issues.missingGuides],
  ['長い一文・原文復元エラー', audit.longSentences.issues.reconstructionErrors],
  ['長い一文・必須欄の欠落', audit.longSentences.issues.missingFields],
  ['長い一文・発音原文の不一致', audit.longSentences.issues.spokenMismatches],
  ['長い一文・語数上限超過', audit.longSentences.issues.overWordLimit],
  ['長い一文・複数役割の混在', audit.longSentences.issues.mixedRoles],
  ['長い一文・真の助動詞/本動詞分断', audit.longSentences.issues.splitAuxiliaryVerb],
  ['長い一文・目的語のない前置詞', audit.longSentences.issues.prepositionFragments],
  ['長い一文・特殊文法の項目別説明不足', audit.longSentences.issues.missingSpecialGrammar],
  ['長い一文・並列の支配関係メタデータ不備', audit.longSentences.issues.invalidCoordinationBindings],
  ['長い一文・節／句末の前から訳不足', audit.longSentences.issues.missingClauseClosures],
  ['長い一文・V/M直後Oとの隣接格衝突', audit.longSentences.issues.adjacentJapaneseCaseCollisions],
  ['長い一文・セミコロン／コロン境界の欠落', audit.longSentences.issues.missingPunctuationBoundaries],
  ['長い一文・文脈機能メタデータ不整合', audit.longSentences.issues.semanticBindingErrors],
  ['長い一文・手動レビュー台帳の不整合', audit.longSentences.issues.missingManualReviewEvidence],
  ['長い一文・未決規則に該当するフレーズ', audit.longSentences.issues.pendingRulePhrases],
  ['長い一文・最終監査未確認文', audit.longSentences.issues.unreviewedGuides],
  ['長い一文・最終監査未確認フレーズ', audit.longSentences.issues.nonConfirmedSteps],
]

for (const [label, items] of issueRows) {
  console.log(`  ${label}: ${items.length}`)
  for (const item of sample(items)) {
    const location = item.passageId
      ? `${item.passageId} #${item.sentenceIndex + 1}`
      : item.id
    const phrase = item.nextPhrase
      ? `${item.phrase} / ${item.nextPhrase}`
      : item.phrase
    const detail = item.field
      ? ` [${item.field}]`
      : item.expectedGrammar?.length
        ? ` [${item.expectedGrammar.join(', ')}]`
        : ''
    console.log(`    - ${location}: ${phrase || item.sentence}${detail}`)
  }
}

console.log('  長文読解・構文パターン文数:')
for (const [name, count] of Object.entries(audit.reading.patternCounts)) {
  console.log(`    - ${name}: ${count}`)
}
console.log('  長い一文・構文パターン文数:')
for (const [name, count] of Object.entries(audit.longSentences.patternCounts)) {
  console.log(`    - ${name}: ${count}`)
}

// 「未完了」と表示しながら成功終了する状態を作らない。
if (!audit.complete) process.exitCode = 1
