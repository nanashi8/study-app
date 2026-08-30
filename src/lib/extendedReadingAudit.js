import { ALL_PASSAGES, PASSAGES } from '../data/passages.js'
import { EXTENDED_PASSAGES } from '../data/reading-extended-passages.js'
import { EXTENDED_READING_STUDY } from '../data/reading-extended-study.js'
import { EXTENDED_READING_QUESTIONS } from '../data/reading-extended-questions.js'
import {
  ALL_EXTENDED_READING_PRACTICE_QUESTIONS,
  EXTENDED_READING_PRACTICE_QUESTIONS,
} from '../data/reading-extended-practice-questions.js'
import { EXTENDED_PASSAGE_READING_APPROACHES } from '../data/reading-extended-approaches.js'
import { resolvePassageWord } from '../data/passage-gloss.js'
import { passageWordCount } from '../data/reading-study.js'
import { ALL_WORDS, getWord } from '../data/vocab.js'

const WORD_PATTERN = /[A-Za-z]+(?:['’][A-Za-z]+)*/g
const JAPANESE_PATTERN = /[ぁ-んァ-ヶ一-鿿]/
const EXPECTED_TARGETS = Object.freeze([1000, 2000, 3000, 4000])
const EXPECTED_SECTION_COUNTS = Object.freeze([5, 6, 8, 10])
const EXPECTED_PRACTICE_TYPES = Object.freeze(['word-order', 'grammar', 'usage'])
const knownIds = new Set(ALL_WORDS.map((word) => word.id))

const wordsIn = (text = '') => text.match(WORD_PATTERN) ?? []
const normalizeToken = (token) => token.toLowerCase().replaceAll('’', "'")

function resolvedIdsForSentence(sentence) {
  return wordsIn(sentence.en).map((token) =>
    resolvePassageWord(normalizeToken(token), sentence.gloss ?? {})?.id).filter(Boolean)
}
// 語彙強化長文の学習素材は「本文の散文」と「節ごとの重点語ケース」の二層。
// カバレッジはどちらの英文も学習者が読むため、両方を数える。
function coverageUnits(passage) {
  const units = [...(passage.sentences ?? [])]
  for (const section of passage.sections ?? []) {
    for (const item of section.vocabularyCases ?? []) {
      units.push({ en: item.en, ja: item.ja, gloss: {} })
    }
  }
  return units
}

function vocabularyCoverage(passages) {
  const coveredIds = new Set()
  const unresolved = []
  let tokenCount = 0
  let resolvedTokenCount = 0
  for (const passage of passages) {
    for (const sentence of coverageUnits(passage)) {
      for (const surface of wordsIn(sentence.en)) {
        tokenCount += 1
        const resolved = resolvePassageWord(normalizeToken(surface), sentence.gloss ?? {})
        if (resolved?.id && knownIds.has(resolved.id)) {
          coveredIds.add(resolved.id)
          resolvedTokenCount += 1
        } else if (!resolved?.proper) {
          unresolved.push({ passageId: passage.id, sentence: sentence.en, surface })
        }
      }
    }
  }
  return { coveredIds, unresolved, tokenCount, resolvedTokenCount }
}

const percent = (count, total) => Number(((count / total) * 100).toFixed(2))

function coverageByLevel(baseIds, combinedIds) {
  const levels = [...new Set(ALL_WORDS.map((word) => word.level))]
  return Object.fromEntries(levels.map((level) => {
    const levelIds = new Set(ALL_WORDS.filter((word) => word.level === level).map((word) => word.id))
    const base = [...baseIds].filter((id) => levelIds.has(id)).length
    const combined = [...combinedIds].filter((id) => levelIds.has(id)).length
    return [level, Object.freeze({
      total: levelIds.size,
      before: base,
      beforePercent: percent(base, levelIds.size),
      after: combined,
      afterPercent: percent(combined, levelIds.size),
      gain: combined - base,
    })]
  }))
}

export function auditExtendedReadings() {
  const errors = []
  const fail = (message) => errors.push(message)
  const allSentenceKeys = new Map()
  const allTargetIds = new Set()
  const allExpressionIds = new Set()

  if (EXTENDED_PASSAGES.length !== 4) {
    fail(`語彙強化長文は4本必要です: ${EXTENDED_PASSAGES.length}本`)
  }
  if (ALL_PASSAGES.length !== PASSAGES.length + EXTENDED_PASSAGES.length) {
    fail(`学習カタログの長文数が一致しません: ${ALL_PASSAGES.length}本`)
  }

  for (const passage of PASSAGES) {
    for (const sentence of passage.sentences) {
      const key = sentence.en.toLowerCase().replace(/\s+/g, ' ').trim()
      allSentenceKeys.set(key, passage.id)
    }
  }

  for (const [passageIndex, passage] of EXTENDED_PASSAGES.entries()) {
    const label = passage.id
    const expectedTarget = EXPECTED_TARGETS[passageIndex]
    const minimum = Math.floor(expectedTarget * 0.985)
    const maximum = Math.ceil(expectedTarget * 1.015)
    const annotated = passage.annotated === true
    const expectedFormat = annotated ? 'themed-long-reading' : 'themed-vocabulary-cases'
    if (!passage.extended || passage.extendedFormat !== expectedFormat) {
      fail(`${label}: 語彙強化長文の形式指定がありません`)
    }
    if (passage.targetWords !== expectedTarget) {
      fail(`${label}: 目標語数 ${passage.targetWords} が ${expectedTarget} と一致しません`)
    }
    if (passage.actualWords < minimum || passage.actualWords > maximum) {
      fail(`${label}: ${passage.actualWords}語は許容範囲 ${minimum}〜${maximum}語の外です`)
    }
    if (passageWordCount(passage) !== passage.actualWords) {
      fail(`${label}: 表示語数 ${passageWordCount(passage)} と監査語数 ${passage.actualWords} が一致しません`)
    }
    if (passage.sections.length !== EXPECTED_SECTION_COUNTS[passageIndex]) {
      fail(`${label}: 節数 ${passage.sections.length} が設計値 ${EXPECTED_SECTION_COUNTS[passageIndex]} と一致しません`)
    }
    if (!passage.theme || !passage.extendedReadingDomain || passage.examFocus?.length !== 3) {
      fail(`${label}: 分野・テーマ・読解焦点が不足しています`)
    }

    const passageTargetIds = []
    for (const section of passage.sections) {
      if (!section.title || !section.titleJa || !JAPANESE_PATTERN.test(section.titleJa)) {
        fail(`${label}/${section.id}: 英日見出しが不足しています`)
      }
      if (section.sentences.length < 12 || section.targetVocabularyIds.length < 10) {
        fail(`${label}/${section.id}: 節が短すぎます（${section.sentences.length}文・重点${section.targetVocabularyIds.length}語）`)
      }
      if (annotated) {
        if (!section.summaryJa || !JAPANESE_PATTERN.test(section.summaryJa)) {
          fail(`${label}/${section.id}: 節の読みどころ要約がありません`)
        }
        if (section.sentences.filter((sentence) => sentence.paragraphStart).length < 2) {
          fail(`${label}/${section.id}: 節の段落が2件未満です`)
        }
      } else if (section.sentences.filter((sentence) => sentence.source === 'editorial-transition').length !== 2) {
        fail(`${label}/${section.id}: 主題を接続する編集文は2文必要です`)
      }
      if (!section.sentences[0]?.paragraphStart) {
        fail(`${label}/${section.id}: 節冒頭が段落開始になっていません`)
      }
      const sectionWordCount = section.sentences.reduce(
        (sum, sentence) => sum + wordsIn(sentence.en).length,
        0,
      )
      if (sectionWordCount !== section.wordCount) {
        fail(`${label}/${section.id}: 節の語数 ${section.wordCount} と実測 ${sectionWordCount} が異なります`)
      }

      for (const sentence of section.sentences) {
        if (!sentence.en || !sentence.ja || !JAPANESE_PATTERN.test(sentence.ja)) {
          fail(`${label}/${section.id}: 英文または日本語訳が不足しています`)
        }
        if (!annotated && !['editorial-transition', 'shared-vocabulary-example'].includes(sentence.source)) {
          fail(`${label}/${section.id}: 本文ソース ${sentence.source} を識別できません`)
        }
        const sentenceKey = sentence.en.toLowerCase().replace(/\s+/g, ' ').trim()
        if (allSentenceKeys.has(sentenceKey)) {
          fail(`${label}/${section.id}: 英文が ${allSentenceKeys.get(sentenceKey)} と重複しています: ${sentence.en}`)
        } else {
          allSentenceKeys.set(sentenceKey, label)
        }

        if (annotated || sentence.source === 'editorial-transition') {
          if (sentence.targetId || sentence.field) {
            fail(`${label}/${section.id}: 本文の散文に辞書例文の重点IDが混入しています`)
          }
          continue
        }

        const word = getWord(sentence.targetId)
        if (!word) {
          fail(`${label}/${section.id}: 重点語ID ${sentence.targetId} が辞書にありません`)
          continue
        }
        if (word.example?.en !== sentence.en || word.example?.ja !== sentence.ja) {
          fail(`${label}/${section.id}: ${sentence.targetId} の監査済み辞書例文と本文が一致しません`)
        }
        if (word.field !== sentence.field || !section.allowedFields.includes(sentence.field)) {
          fail(`${label}/${section.id}: ${sentence.targetId} の分野 ${sentence.field} が節の主題と一致しません`)
        }
        if (!resolvedIdsForSentence(sentence).includes(sentence.targetId)) {
          fail(`${label}/${section.id}: 重点語 ${sentence.targetId} を英文内で辞書解決できません`)
        }
        if (allTargetIds.has(sentence.targetId)) {
          fail(`${label}/${section.id}: 重点語 ${sentence.targetId} が別の語彙強化長文と重複しています`)
        }
        allTargetIds.add(sentence.targetId)
        passageTargetIds.push(sentence.targetId)
      }

      if (!annotated) continue

      // 重点語ケース＝共通辞書の監査済み例文。本文から切り離しても語彙の根拠は保つ。
      for (const item of section.vocabularyCases ?? []) {
        const word = getWord(item.id)
        if (!word) {
          fail(`${label}/${section.id}: 重点語ID ${item.id} が辞書にありません`)
          continue
        }
        if (word.example?.en !== item.en || word.example?.ja !== item.ja) {
          fail(`${label}/${section.id}: ${item.id} の監査済み辞書例文とケースが一致しません`)
        }
        if (word.field !== item.field || !section.allowedFields.includes(item.field)) {
          fail(`${label}/${section.id}: ${item.id} の分野 ${item.field} が節の主題と一致しません`)
        }
        if (!resolvedIdsForSentence({ en: item.en, gloss: {} }).includes(item.id)) {
          fail(`${label}/${section.id}: 重点語 ${item.id} を例文内で辞書解決できません`)
        }
        if (allTargetIds.has(item.id)) {
          fail(`${label}/${section.id}: 重点語 ${item.id} が別の語彙強化長文と重複しています`)
        }
        allTargetIds.add(item.id)
        passageTargetIds.push(item.id)
      }
    }

    if (new Set(passageTargetIds).size !== passage.targetVocabularyCount) {
      fail(`${label}: 重点語数 ${passage.targetVocabularyCount} と実測 ${new Set(passageTargetIds).size} が異なります`)
    }
    if (passage.vocab.length !== passage.targetVocabularyCount ||
        passage.vocab.some((id) => !passageTargetIds.includes(id))) {
      fail(`${label}: 学習カードの語彙IDと本文重点語が一致しません`)
    }

    const study = EXTENDED_READING_STUDY[label]
    if (study?.expressions?.length !== 4) {
      fail(`${label}: 読解準備の重要表現は4項目必要です`)
    }
    const bodySentences = new Set(passage.sentences.map((sentence) => sentence.en))
    for (const item of study?.expressions ?? []) {
      if (allExpressionIds.has(item.id)) fail(`${label}: 重要表現ID ${item.id} が重複しています`)
      allExpressionIds.add(item.id)
      if (!bodySentences.has(item.example?.en) || !item.meaning || !item.note || !item.example?.ja) {
        fail(`${label}: ${item.id} の重要表現が本文・和訳・解説と対応しません`)
      }
    }

    const approach = EXTENDED_PASSAGE_READING_APPROACHES[label]
    if (!approach || approach.steps?.length !== 3 || approach.ruleIds?.length < 5) {
      fail(`${label}: テーマ別の読み方が不足しています`)
    }

    const questions = EXTENDED_READING_QUESTIONS[label] ?? []
    if (questions.length !== 4) fail(`${label}: 内容理解問題は4問必要です`)
    for (const item of questions) {
      if (!item.q || !item.questionJa || !JAPANESE_PATTERN.test(item.questionJa)) {
        fail(`${label}/${item.id}: 設問の英日対応が不足しています`)
      }
      if (item.choices?.length !== 4 || new Set(item.choices).size !== 4 || !item.choices.includes(item.answer)) {
        fail(`${label}/${item.id}: 4択と正答が成立していません`)
      }
      if (!item.answerJa || !item.explain || item.choices.some((choice) => !item.choiceTranslations?.[choice])) {
        fail(`${label}/${item.id}: 正答・全選択肢の和訳または根拠が不足しています`)
      }
    }

    const practice = EXTENDED_READING_PRACTICE_QUESTIONS[label] ?? []
    const typeCounts = Object.fromEntries(EXPECTED_PRACTICE_TYPES.map((type) => [
      type,
      practice.filter((item) => item.questionType === type).length,
    ]))
    if (practice.length !== 3 || Object.values(typeCounts).some((count) => count !== 1)) {
      fail(`${label}: 並び替え・文法・語法を各1問にできていません`)
    }
    for (const item of practice) {
      if (!bodySentences.has(item.sourceSentence) || item.answerJa !== item.sourceJa || !item.explain) {
        fail(`${label}/${item.id}: 本文の実文・和訳・解説が一致していません`)
      }
      const resolvedSourceIds = new Set(resolvedIdsForSentence({ en: item.sourceSentence, gloss: {} }))
      for (const id of item.vocabIds ?? []) {
        if (!knownIds.has(id) || !resolvedSourceIds.has(id)) {
          fail(`${label}/${item.id}: 対象語彙 ${id} が辞書または出典文にありません`)
        }
      }
      if (item.questionType === 'word-order') {
        if (item.answer !== item.sourceSentence || item.choices.length !== 0) {
          fail(`${label}/${item.id}: 並び替えの正答文が出典文と一致しません`)
        }
      } else if (
        item.choices.length !== 4 ||
        !item.choices.includes(item.answer) ||
        item.choices.some((choice) => !item.choiceTranslations?.[choice] || !item.choiceNotes?.[choice])
      ) {
        fail(`${label}/${item.id}: 文法・語法の4択と全選択肢解説が不足しています`)
      }
    }
  }

  const baseline = vocabularyCoverage(PASSAGES)
  const extended = vocabularyCoverage(EXTENDED_PASSAGES)
  const combinedIds = new Set([...baseline.coveredIds, ...extended.coveredIds])
  const coverageGain = combinedIds.size - baseline.coveredIds.size
  const combinedPercent = percent(combinedIds.size, ALL_WORDS.length)
  if (extended.unresolved.length > 0) {
    for (const unresolved of extended.unresolved.slice(0, 20)) {
      fail(`${unresolved.passageId}: 辞書未解決語 ${unresolved.surface} / ${unresolved.sentence}`)
    }
  }
  if (combinedPercent < 40) {
    fail(`長文本文の語彙カバー率 ${combinedPercent}% が品質基準 40% 未満です`)
  }
  if (coverageGain < 1800) {
    fail(`語彙強化長文の純増 ${coverageGain}語 が品質基準 1,800語 未満です`)
  }
  const targetAlreadyCovered = [...allTargetIds].filter((id) => baseline.coveredIds.has(id))
  if (targetAlreadyCovered.length > 0) {
    fail(`重点語に追加前から本文出現済みの語があります: ${targetAlreadyCovered.slice(0, 20).join(', ')}`)
  }
  if (ALL_EXTENDED_READING_PRACTICE_QUESTIONS.length !== 12) {
    fail(`語彙強化長文の技能問題は12問必要です: ${ALL_EXTENDED_READING_PRACTICE_QUESTIONS.length}問`)
  }

  const practiceTypeCounts = Object.fromEntries(EXPECTED_PRACTICE_TYPES.map((type) => [
    type,
    ALL_EXTENDED_READING_PRACTICE_QUESTIONS.filter((item) => item.questionType === type).length,
  ]))
  const metrics = Object.freeze({
    passageCount: EXTENDED_PASSAGES.length,
    catalogPassageCount: ALL_PASSAGES.length,
    targetWords: Object.freeze(EXTENDED_PASSAGES.map((passage) => passage.targetWords)),
    actualWords: Object.freeze(EXTENDED_PASSAGES.map((passage) => passage.actualWords)),
    totalWords: EXTENDED_PASSAGES.reduce((sum, passage) => sum + passage.actualWords, 0),
    sentenceCount: EXTENDED_PASSAGES.reduce((sum, passage) => sum + passage.sentences.length, 0),
    targetVocabularyCount: allTargetIds.size,
    baselineCoveredVocabulary: baseline.coveredIds.size,
    baselineCoveragePercent: percent(baseline.coveredIds.size, ALL_WORDS.length),
    combinedCoveredVocabulary: combinedIds.size,
    combinedCoveragePercent: combinedPercent,
    coverageGain,
    dictionarySize: ALL_WORDS.length,
    extendedTokenCount: extended.tokenCount,
    resolvedExtendedTokenCount: extended.resolvedTokenCount,
    unresolvedExtendedTokenCount: extended.unresolved.length,
    contentQuestionCount: Object.values(EXTENDED_READING_QUESTIONS).flat().length,
    practiceQuestionCount: ALL_EXTENDED_READING_PRACTICE_QUESTIONS.length,
    practiceTypeCounts: Object.freeze(practiceTypeCounts),
    coverageByLevel: Object.freeze(coverageByLevel(baseline.coveredIds, combinedIds)),
    domains: Object.freeze(EXTENDED_PASSAGES.map((passage) => passage.extendedReadingDomain)),
  })

  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors), metrics })
}
