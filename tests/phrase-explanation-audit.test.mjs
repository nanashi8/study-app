import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'

import { auditPhraseExplanations } from '../src/lib/phrase-explanation-audit.js'
import { PASSAGES } from '../src/data/passages.js'
import {
  READING_MANUAL_BLOCK_FINGERPRINTS,
  READING_MANUAL_REVIEW_LEDGER,
  readingManualReviewEvidence,
  reviewedBlockFingerprint,
} from '../src/data/reading-phrase-review-ledger.js'
import {
  analyzeReadingSentence,
  applyReadingManualReviewState,
} from '../src/lib/reading-grammar.js'
import { StructureDiagram } from '../src/components/StructureDiagram.js'
import {
  serializeStructureTokens,
  structureGroupOutline,
} from '../src/lib/structure-markers.js'

const sentenceByEnglish = (english) => PASSAGES
  .flatMap((passage) => passage.sentences)
  .find((sentence) => sentence.en === english)

const analysisFor = (english) => analyzeReadingSentence(sentenceByEnglish(english))

const substantiveReadingIssueNames = [
  'reconstructionErrors', 'missingFields', 'spokenMismatches', 'overWordLimit',
  'mixedRoles', 'splitAuxiliaryVerb', 'prepositionFragments', 'missingSpecialGrammar',
  'invalidCoordinationBindings', 'missingConditionClosures', 'missingClauseClosures',
  'unreviewedConnectorClosures',
  'adjacentJapaneseCaseCollisions',
  'missingPunctuationBoundaries', 'semanticBindingErrors',
  'invalidJapaneseFallbacks', 'structuralDisplayMismatches',
  'staleGrammarBlockPayloads', 'grammarBlockStructureMismatches',
  'misclassifiedGrammarBlocks', 'correctionMismatches',
  'missingManualReviewEvidence',
  'meaningReconstructionErrors', 'meaningMissingFields', 'meaningSpokenMismatches',
  'meaningOverWordLimit', 'unnecessaryMeaningFragmentation', 'invalidMeaningJapanese',
  'staleMeaningBlockPayloads', 'meaningRegressionMismatches',
]

const substantiveLongIssueNames = [
  'missingGuides', 'reconstructionErrors', 'missingFields', 'spokenMismatches',
  'overWordLimit', 'mixedRoles', 'splitAuxiliaryVerb', 'prepositionFragments',
  'missingSpecialGrammar', 'invalidCoordinationBindings', 'missingClauseClosures',
  'adjacentJapaneseCaseCollisions',
  'missingPunctuationBoundaries',
  'semanticBindingErrors',
  'missingManualReviewEvidence',
  'meaningReconstructionErrors', 'meaningMissingFields', 'meaningSpokenMismatches',
  'meaningOverWordLimit', 'unnecessaryMeaningFragmentation', 'invalidMeaningJapanese',
  'nonConfirmedMeaningSteps',
]

test('全長文・長い一文・文学の意味フレーズと内部SVOCMを監査する', () => {
  const audit = auditPhraseExplanations()
  assert.equal(audit.reading.passageCount, 16)
  assert.equal(audit.reading.sentenceCount, 363)
  assert.equal(audit.reading.phraseCount, 3238)
  assert.equal(audit.reading.meaningPhraseCount, 2290)
  assert.equal(audit.reading.meaningMultiRoleCount, 775)
  assert.equal(audit.reading.grammarBlockCount, 1042)
  assert.equal(audit.reading.correctionDecisionCount, 732)
  assert.equal(audit.reading.appliedCorrectionCount, 732)
  assert.deepEqual(audit.reading.connectorClosureReview, {
    candidateCount: 102,
    backReferenceCount: 53,
    alreadyClearCount: 49,
  })
  assert.equal(audit.longSentences.sentenceCount, 33)
  assert.equal(audit.longSentences.phraseCount, 236)
  assert.equal(audit.longSentences.meaningPhraseCount, 103)
  assert.equal(audit.longSentences.meaningMultiRoleCount, 65)
  assert.equal(audit.literature.workCount, 9)
  assert.equal(audit.literature.sceneCount, 59)
  assert.equal(audit.literature.segmentCount, 257)
  assert.equal(audit.literature.englishSegmentCount, 106)

  for (const issueName of substantiveReadingIssueNames) {
    assert.equal(audit.reading.issues[issueName].length, 0, `長文: ${issueName}`)
  }
  for (const issueName of substantiveLongIssueNames) {
    assert.equal(audit.longSentences.issues[issueName].length, 0, `長い一文: ${issueName}`)
  }
  for (const [issueName, issues] of Object.entries(audit.literature.issues)) {
    assert.equal(issues.length, 0, `文学朗読: ${issueName}`)
  }
})

test('全規則と全文を監査確認済みにし、台帳外変更は別状態として扱う', () => {
  const audit = auditPhraseExplanations()
  assert.equal(audit.complete, true)
  assert.equal(audit.rules.total, 17)
  assert.equal(audit.rules.confirmed, 17)
  assert.equal(audit.rules.reviewNeeded, 0)
  assert.equal(audit.reading.manuallyReviewedSentenceCount, 363)
  assert.equal(audit.longSentences.manuallyReviewedSentenceCount, 33)
  assert.equal(audit.reading.confirmedSentenceCount, 363)
  assert.equal(audit.longSentences.confirmedSentenceCount, 33)
  assert.equal(audit.reading.confirmedPhraseCount, 3238)
  assert.equal(audit.longSentences.confirmedPhraseCount, 236)
  assert.equal(audit.reading.issues.unreviewedSentences.length, 0)
  assert.equal(audit.longSentences.issues.unreviewedGuides.length, 0)
  const phrases = PASSAGES.flatMap((passage) => passage.sentences)
    .flatMap((sentence) => analysisFor(sentence.en).phraseSequence)
  const meaningPhrases = PASSAGES.flatMap((passage) => passage.sentences)
    .flatMap((sentence) => analysisFor(sentence.en).meaningPhraseSequence)
  const pending = phrases.filter((phrase) => phrase.pendingRule)
  assert.deepEqual(pending, [])
  assert.ok(phrases.every((phrase) =>
    phrase.status === 'confirmed' && phrase.reviewState === 'audit-confirmed'))
  assert.ok(meaningPhrases.every((phrase) =>
    phrase.status === 'confirmed' && phrase.reviewState === 'audit-confirmed'))
})

test('明示台帳外の新規文と、既存文のJA・role・文法ブロック変更はreview-neededへ戻る', () => {
  assert.equal(Object.keys(READING_MANUAL_REVIEW_LEDGER).length, 363)
  assert.equal(
    Object.values(READING_MANUAL_BLOCK_FINGERPRINTS)
      .reduce((total, fingerprints) => total + fingerprints.length, 0),
    363,
  )
  assert.ok(Object.values(READING_MANUAL_REVIEW_LEDGER)
    .every((evidence) => evidence.blockFingerprint))
  const sourceSentence = sentenceByEnglish('She goes to school by bus every morning.')
  const analysis = analyzeReadingSentence(sourceSentence)
  assert.ok(readingManualReviewEvidence(
    sourceSentence,
    analysis.phraseSequence,
    analysis.blocks,
  ))

  const changedJa = analysis.phraseSequence.map((phrase, index) => ({
    ...phrase,
    ja: index === 0 ? `${phrase.ja}（変更）` : phrase.ja,
  }))
  assert.equal(readingManualReviewEvidence(sourceSentence, changedJa, analysis.blocks), null)
  assert.ok(applyReadingManualReviewState(changedJa, sourceSentence, analysis.blocks)
    .every((phrase) => phrase.status === 'review-needed'))

  const changedRole = analysis.phraseSequence.map((phrase, index) => ({
    ...phrase,
    role: index === 0 ? 'M' : phrase.role,
  }))
  assert.equal(readingManualReviewEvidence(sourceSentence, changedRole, analysis.blocks), null)
  assert.ok(applyReadingManualReviewState(changedRole, sourceSentence, analysis.blocks)
    .every((phrase) => phrase.status === 'review-needed'))

  const changedBlocks = analysis.blocks.map((block, index) => ({
    ...block,
    note: index === 0 ? `${block.note}（変更）` : block.note,
  }))
  assert.notEqual(
    reviewedBlockFingerprint(changedBlocks),
    reviewedBlockFingerprint(analysis.blocks),
  )
  assert.equal(
    readingManualReviewEvidence(sourceSentence, analysis.phraseSequence, changedBlocks),
    null,
  )
  assert.ok(applyReadingManualReviewState(
    analysis.phraseSequence,
    sourceSentence,
    changedBlocks,
  ).every((phrase) => phrase.status === 'review-needed'))

  const addedSentence = {
    ...sourceSentence,
    reviewId: 'p_5_lost_notebook#10',
    reviewPassageFingerprint: 'new-source',
  }
  const addedAnalysis = analyzeReadingSentence(addedSentence)
  assert.ok(addedAnalysis.phraseSequence.every((phrase) =>
    phrase.status === 'review-needed' && phrase.reviewState === 'unregistered'))
})

test('複合主語・動名詞主語・目的so・名詞修飾不定詞の実role列を固定する', () => {
  const garden = analysisFor(
    'The students began to understand how temperature, rain, and insects affected the vegetables.',
  )
  assert.deepEqual(garden.phraseSequence.map(({ en, role }) => [en, role]), [
    ['The students', 'S'], ['began', 'V'], ['to understand', 'V'], ['how', 'M'],
    ['temperature, rain', 'S'], ['and', 'LINK'], ['insects', 'S'],
    ['affected', 'V'], ['the vegetables', 'O'],
  ])
  assert.equal(garden.phraseSequence.find((item) => item.en === 'began')?.ja,
    '始めました（何を始めたかは次へ）')

  const gerunds = analysisFor(
    'Setting review dates and publishing results allows governments to revise policies without treating revision as failure.',
  )
  assert.deepEqual(gerunds.phraseSequence.slice(0, 3).map(({ en, role, ja }) => ({ en, role, ja })), [
    { en: 'Setting review dates', role: 'S', ja: '見直しの日程を定めること' },
    { en: 'and', role: 'LINK', ja: 'そして' },
    { en: 'publishing results', role: 'S', ja: '結果を公表することは' },
  ])

  const purpose = analysisFor(
    'The cafeteria also put pictures of both portions near the entrance so students could choose before reaching the counter.',
  )
  assert.deepEqual(purpose.phraseSequence.slice(6, 9).map(({ en, role, ja }) => ({ en, role, ja })), [
    { en: 'so', role: 'LINK', ja: 'その目的で' },
    { en: 'students', role: 'S', ja: '生徒が' },
    { en: 'could choose', role: 'V', ja: '選べるように' },
  ])

  const way = analysisFor(
    'It also gives independent researchers a way to test whether alternative definitions would tell a substantially different story.',
  )
  const wayStart = way.phraseSequence.findIndex((item) => item.en === 'a way')
  assert.deepEqual(way.phraseSequence.slice(wayStart, wayStart + 2).map(({ en, role }) => [en, role]), [
    ['a way', 'O2'], ['to test', 'M'],
  ])
  assert.deepEqual(way.phraseSequence[wayStart + 1].infinitiveBinding, {
    type: 'noun-modifier', governor: 'a way', semanticSubject: 'independent researchers',
  })
})

test('比較・部分否定・並列の支配関係を本文別bindingで固定する', () => {
  const busStop = analysisFor(
    'In some cases, a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service.',
  ).phraseSequence.find((item) => item.en === 'more than an expensive digital service')
  assert.deepEqual(busStop.comparisonBinding, {
    type: 'np-comparison-with-ellipsis',
    left: 'a simple repair / a clearer sign may help residents',
    right: 'an expensive digital service (may help residents)',
    head: 'may help ... more',
    ellipsis: 'may help residents',
  })

  const online = analysisFor(
    'Readers can check a university report that describes its methods more easily than a video with no named source.',
  )
  for (const english of ['more easily', 'than', 'a video']) {
    assert.equal(online.phraseSequence.find((item) => item.en === english)?.scope, '')
  }
  assert.match(online.phraseSequence.find((item) => item.en === 'more easily')?.explanation,
    /主節 can check/)

  const partial = analysisFor(
    'A reading test captures some forms of comprehension, for example, but not every capacity that makes someone a thoughtful reader.',
  ).phraseSequence.find((item) => item.en === 'not')
  assert.deepEqual(partial.focusBinding, {
    type: 'partial-negation',
    scope: 'every capacity that makes someone a thoughtful reader',
    contrast: 'some forms of comprehension',
    governor: 'captures',
  })
  assert.match(partial.ja, /すべてを捉えるわけではありません/)

  const conclude = analysisFor(
    'Critics sometimes conclude that quantification itself is the problem and that experienced professionals should simply be trusted to exercise judgment.',
  ).phraseSequence.find((item) => item.en === 'and')
  assert.equal(conclude.coordinationBinding.governor, 'conclude')

  const neglect = analysisFor(
    'A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.',
  ).phraseSequence.find((item) => item.en === 'or')
  assert.equal(neglect.coordinationBinding.governor, 'neglecting')
})

test('下段ブロックは内部SVOCMと学習者向け意味フレーズの双方を同じpayloadで使う', () => {
  for (const passage of PASSAGES) {
    for (const sentence of passage.sentences) {
      const analysis = analyzeReadingSentence(sentence)
      const visible = ({ en, spokenEn, displayEn, role, ja, roleHeading, roleNote, explanation, grammarNote }) => ({
        en,
        spokenEn: spokenEn ?? en,
        displayEn: displayEn ?? en,
        role,
        ja,
        roleHeading,
        roleNote,
        explanation: explanation ?? grammarNote ?? '',
      })
      assert.deepEqual(
        analysis.blocks.flatMap((block) => block.phrasePairs).map(visible),
        analysis.phraseSequence.map(visible),
        sentence.en,
      )
      assert.ok(analysis.blocks.every((block) => block.phrasePairs.length > 0), sentence.en)
      const visibleMeaning = ({ en, spokenEn, displayEn, roles, ja, explanation }) => ({
        en,
        spokenEn: spokenEn ?? en,
        displayEn: displayEn ?? en,
        roles,
        ja,
        explanation,
      })
      assert.deepEqual(
        analysis.blocks.flatMap((block) => block.meaningPhrasePairs).map(visibleMeaning),
        analysis.meaningPhraseSequence.map(visibleMeaning),
        sentence.en,
      )
    }
  }

  const formalObject = analysisFor(
    'This evidence makes it easier to improve a design or decide that a simpler solution would work better.',
  )
  assert.deepEqual(formalObject.blocks[1].phrasePairs.map(({ en, ja }) => [en, ja]), [
    ['to improve', '改善すること（何をかは次へ）'],
    ['a design', '設計を（改善することを）'],
    ['or', 'または'],
    ['decide', '判断すること（内容は次へ）'],
  ])
  assert.equal(formalObject.blocks[2].label, 'decideの目的語となる内容節')
  assert.equal(formalObject.blocks[2].role, 'O')
  assert.doesNotMatch(formalObject.blocks[2].note, /関係詞節/)
  assert.equal(
    formalObject.marked,
    'This evidence makes it easier <to improve a design or decide (that a simpler solution would work better)>',
  )
  assert.deepEqual(structureGroupOutline(formalObject.structureTokens), [
    {
      kind: 'phrase', depth: 0, parentKind: null,
      text: 'to improve a design or decide that a simpler solution would work better',
    },
    {
      kind: 'clause', depth: 1, parentKind: 'phrase',
      text: 'that a simpler solution would work better',
    },
  ])

  const comparison = analysisFor(
    'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.',
  )
  assert.deepEqual(comparison.blocks.flatMap((block) => block.phrasePairs.map((pair) => pair.en)), [
    'The integrity of public memory', 'is then shaped', 'less',
    'by what', 'is available', 'than',
    'by what', 'is repeatedly presented', 'as relevant',
  ])
  assert.match(comparison.blocks[1].label, /融合関係詞節/)
  assert.match(comparison.blocks[2].note, /present A as C/)
  assert.equal(
    comparison.marked,
    'The integrity of public memory is then shaped less (by what is available) than (by what is repeatedly presented as relevant)',
  )
  assert.deepEqual(structureGroupOutline(comparison.structureTokens), [
    { kind: 'clause', depth: 0, parentKind: null, text: 'by what is available' },
    {
      kind: 'clause', depth: 0, parentKind: null,
      text: 'by what is repeatedly presented as relevant',
    },
  ])

  const fusedRelative = analysisFor(
    'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.',
  )
  assert.deepEqual(fusedRelative.blocks.slice(-3).map((block) => block.label), [
    'abilityを説明する不定詞',
    'from what融合関係詞節・前半',
    'from what融合関係詞節・後半',
  ])
  assert.doesNotMatch(fusedRelative.blocks.at(-1).note, /時・条件の副詞節/)
  assert.equal(
    fusedRelative.marked,
    '(If that practice declines) even perfect archives will not prevent societies <from losing their ability> <to learn> (from what they once knew)',
  )
  assert.deepEqual(structureGroupOutline(fusedRelative.structureTokens), [
    { kind: 'clause', depth: 0, parentKind: null, text: 'If that practice declines' },
    { kind: 'phrase', depth: 0, parentKind: null, text: 'from losing their ability' },
    { kind: 'phrase', depth: 0, parentKind: null, text: 'to learn' },
    { kind: 'clause', depth: 0, parentKind: null, text: 'from what they once knew' },
  ])

  for (const analysis of [formalObject, comparison, fusedRelative]) {
    assert.deepEqual(analysis.structureMarkerErrors, [])
    assert.equal(serializeStructureTokens(analysis.structureTokens), analysis.marked)
    const html = renderToStaticMarkup(StructureDiagram({
      tokens: analysis.structureTokens,
    }))
    const renderedText = html
      .replace(/<[^>]+>/g, '')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&amp;', '&')
    assert.equal(renderedText, analysis.marked)
  }

  const formalHtml = renderToStaticMarkup(StructureDiagram({
    tokens: formalObject.structureTokens,
  }))
  const phraseStart = formalHtml.indexOf('data-structure-kind="phrase"')
  const nestedClauseStart = formalHtml.indexOf('data-structure-kind="clause"')
  const phraseClose = formalHtml.indexOf('&gt;</span>', nestedClauseStart)
  assert.ok(phraseStart >= 0 && nestedClauseStart > phraseStart)
  assert.ok(phraseClose > nestedClauseStart)
  assert.match(formalHtml, /data-structure-depth="1"/)
})
