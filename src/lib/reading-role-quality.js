import { readingSentenceRoleParts } from './reading-role-annotations.js'
import {
  READING_FOCUS_ROLE_CORRECTIONS,
  READING_FOCUS_ROLE_CORRECTION_COUNT,
} from '../data/reading-focus-role-corrections.js'
import {
  READING_FOCUS_ROLE_REVIEW_FINGERPRINTS,
  READING_FOCUS_ROLE_REVIEW_FINGERPRINT_COUNT,
} from '../data/reading-focus-role-review-fingerprints.js'

export const CHOICE_ONLY_REVIEW_SENTENCE =
  'People often describe choice as if it begins only when a person consciously compares several options.'

// only は置かれた場所によって、焦点を示すM、not onlyの接続、
// または名詞句内部の「唯一の」になります。現在の本文全23出現を
// 一文ずつ確認した正解表に固定し、新規出現は未監査のまま通さない。
export const READING_ONLY_ROLE_REVIEWS = Object.freeze([
  ['Sometimes a product is badly damaged, but in other cases only a small part has stopped working.', 'M'],
  ['A device no longer seems like a closed box that only its manufacturer understands.', 'M'],
  ['If only wealthy areas receive the newest systems, technology may make public services more unequal instead of more convenient.', 'M'],
  ['Planners must therefore examine not only whether an intervention works physically but also how its costs and benefits are distributed.', 'LINK'],
  ['A city that takes resilience seriously must therefore evaluate projects over a long period rather than only during the year in which they are introduced.', 'M'],
  ['The reason is that memory depends not only on preservation but also on repeated interpretation within families, schools, media, and political institutions.', 'M'],
  ['This civic dimension explains why collective memory cannot be measured only by the number of documents preserved or people reached.', 'M'],
  ['Training provides only limited value in rural areas with weak mobile service or during payment system failures after serious natural disasters and emergencies.', 'M'],
  ['The broader lesson is that innovation should be judged by the range of people who can use it, not only by the speed of its average transaction.', 'M'],
  ['Regular audits should look not only for false reports but also for neglected tasks, displaced risks, and groups that disappear from the data.', 'LINK'],
  ['They understood the English but sometimes missed a turn shown only by a street name.', 'M'],
  ['The school revealed the comparison group only after the four-week trial ended.', 'M'],
  ['The organizers reported successful exchanges and waste they could not process; they did not publish only a cheerful total.', 'M'],
  ['However, a policy should not protect only places where darkness can be sold as an experience.', 'M'],
  [CHOICE_ONLY_REVIEW_SENTENCE, 'M'],
  ['Collecting such data creates its own privacy risks, so evaluation must use only what is necessary and protect it carefully.', 'M'],
  ['Public explanation should describe not only what the system does but why that architecture was chosen over plausible alternatives.', 'LINK'],
  ['Convenience becomes ethically defensible only when the people whose behavior is shaped can understand, refuse, and contest the terms of that convenience.', 'M'],
  ['The town then asked the bus company to add two morning buses for residents only.', 'M'],
  ['In many rural areas, the local bus is the only way for people without cars to reach a hospital.', 'C'],
  ['The village then tested a small bus that comes only when someone books it.', 'M'],
  ['Most jobs consist of many tasks, and only some of them can be automated well.', 'M'],
  ['Students who only learn to produce text that a machine can also produce are poorly prepared.', 'M'],
].map(([sentence, role]) => Object.freeze({ sentence, role })))

export const CHOICE_ONLY_EXPECTED_ROLE_PARTS = Object.freeze([
  ['S', 'People'],
  ['M', 'often'],
  ['V', 'describe'],
  ['O', 'choice'],
  ['LINK', 'as'],
  ['LINK', 'if'],
  ['S', 'it'],
  ['V', 'begins'],
  ['M', 'only'],
  ['LINK', 'when'],
  ['S', 'a person'],
  ['M', 'consciously'],
  ['V', 'compares'],
  ['O', 'several options'],
].map(([role, text]) => Object.freeze({ role, text })))

const ONLY_WORD = /\bonly\b/i
const FOCUS_EXPLANATION = /(?:限定|だけ|のみ|唯一|一つ目|対照|呼応)/u

// only と同じ誤分類を起こしやすい焦点・頻度・様態副詞について、
// 本文全件を手で確認した時点の語別母数と許容される下線境界を固定する。
export const READING_FOCUS_ROLE_EXPECTED_COUNTS = Object.freeze({
  also: 74,
  always: 5,
  consciously: 1,
  even: 16,
  merely: 7,
  never: 4,
  often: 27,
  only: 23,
  simply: 12,
})

export const READING_FOCUS_ROLE_EXPECTED_OCCURRENCE_COUNT = 169
export const READING_FOCUS_ROLE_EXPECTED_CORRECTION_COUNT = 74
export const READING_FOCUS_ROLE_EXPECTED_SENTENCE_COUNT = 153
export const READING_FOCUS_ROLE_EXPECTED_REVIEW_FINGERPRINT_COUNT = 134

const FOCUS_CARRIER_REVIEWS = Object.freeze({
  also: Object.freeze(['also', 'but also', 'but also on repeated interpretation']),
  always: Object.freeze(['always', 'not always']),
  consciously: Object.freeze(['consciously']),
  even: Object.freeze(['even', 'even when', 'even though', 'even without a phone nearby']),
  merely: Object.freeze(['merely', 'not merely']),
  never: Object.freeze(['never']),
  often: Object.freeze(['often', 'more often', 'most often', 'how often']),
  only: Object.freeze([
    'only',
    'not only',
    'only during the year',
    'not only on preservation',
    'not only by the speed of its average transaction',
    'for residents only',
    'the only way',
  ]),
  simply: Object.freeze(['simply', 'not simply', 'instead of simply', 'more than simply']),
})

const FOCUS_EXPLANATION_CUES = Object.freeze({
  also: /(?:副詞M|焦点|追加|加え|さらに|同時|同じ|呼応|加算)/u,
  always: /(?:副詞M|頻度|いつも|常に)/u,
  consciously: /(?:副詞M|意識|仕方|方法)/u,
  even: /(?:焦点|意外|さえ|強調|譲歩|場合にも|にも)/u,
  merely: /(?:副詞M|限定|だけ|単に|範囲)/u,
  never: /(?:副詞M|頻度|決して|一度も|全面)/u,
  often: /(?:副詞M|頻度|しばしば|よく)/u,
  only: /(?:限定|だけ|のみ|唯一|焦点|範囲|対照|呼応|一つ目)/u,
  simply: /(?:副詞M|限定|だけ|単に|仕方|容易)/u,
})

function expectedFocusRole(word, carrier) {
  if (word === 'only' && carrier === 'the only way') return 'C'
  if (word === 'only' && carrier === 'not only') return 'LINK'
  if (word === 'also' && carrier === 'but also') return 'LINK'
  if (word === 'even' && (carrier === 'even when' || carrier === 'even though')) return 'LINK'
  return 'M'
}

function includesRoleSequence(actual, expected) {
  for (let start = 0; start <= actual.length - expected.length; start++) {
    if (expected.every((part, offset) =>
      actual[start + offset]?.role === part.role && actual[start + offset]?.text === part.en)) {
      return true
    }
  }
  return false
}

function phraseContainsOnlyWithRole(phrase, expectedRole) {
  return phrase?.roleParts?.some((part) =>
    part.role === expectedRole && ONLY_WORD.test(part.en ?? ''))
}

function sameRoleParts(actual, expected) {
  return actual.length === expected.length && actual.every((part, index) =>
    part.role === expected[index].role && part.text === expected[index].text)
}

export function auditReadingRoleQuality(passages, analyzeReadingSentence) {
  const errors = []
  const reviewBySentence = new Map(
    READING_ONLY_ROLE_REVIEWS.map((review) => [review.sentence, review]),
  )
  const seenReviewedSentences = new Set()
  let sentenceCount = 0
  let rolePartCount = 0
  let onlyOccurrenceCount = 0
  let reviewedOnlyOccurrenceCount = 0
  let focusOccurrenceCount = 0
  let reviewedFocusOccurrenceCount = 0
  let appliedFocusCorrectionCount = 0
  const focusCounts = Object.fromEntries(
    Object.keys(READING_FOCUS_ROLE_EXPECTED_COUNTS).map((word) => [word, 0]),
  )
  const seenFocusCorrectionSentences = new Set()
  const focusSentenceIds = new Set()
  let choiceAnalysis = null
  let choiceSentence = null

  for (const passage of passages) {
    for (const [sentenceIndex, sentence] of passage.sentences.entries()) {
      sentenceCount++
      const analysis = analyzeReadingSentence(sentence)
      const parts = readingSentenceRoleParts(analysis)
      rolePartCount += parts.length
      const at = `${passage.id}#${sentenceIndex + 1}`

      const focusDecisions = READING_FOCUS_ROLE_CORRECTIONS[sentence.en] ?? []
      if (focusDecisions.length) seenFocusCorrectionSentences.add(sentence.en)
      for (const decision of focusDecisions) {
        if (includesRoleSequence(parts, decision.parts)) {
          appliedFocusCorrectionCount++
        } else {
          errors.push(
            `${at}: 手動焦点語訂正が出力へ反映されていない: ${decision.parts.map((part) => `${part.role}:${part.en}`).join(' / ')}`,
          )
        }
      }

      for (const word of Object.keys(READING_FOCUS_ROLE_EXPECTED_COUNTS)) {
        const wordPattern = new RegExp(`\\b${word}\\b`, 'gi')
        const sourceCount = sentence.en.match(wordPattern)?.length ?? 0
        if (!sourceCount) continue
        focusSentenceIds.add(at)
        focusCounts[word] += sourceCount
        focusOccurrenceCount += sourceCount

        const matchingParts = parts.filter((part) =>
          new RegExp(`\\b${word}\\b`, 'i').test(part.text))
        if (matchingParts.length !== sourceCount) {
          errors.push(`${at}: ${word} ${sourceCount}語に対して役割区分が${matchingParts.length}件`)
          continue
        }
        for (const part of matchingParts) {
          reviewedFocusOccurrenceCount++
          const carrier = part.text.trim().toLowerCase()
          if (!FOCUS_CARRIER_REVIEWS[word].includes(carrier)) {
            errors.push(`${at}: ${word}を含む下線境界が手動正解表にない: ${part.role}:${part.text}`)
            continue
          }
          const expectedRole = expectedFocusRole(word, carrier)
          if (part.role !== expectedRole) {
            errors.push(`${at}: ${word}は${expectedRole}であるべきだが${part.role}（${part.text}）`)
          }
        }

        const explanationPhrases = [
          ...analysis.phraseSequence,
          ...analysis.meaningPhraseSequence,
        ].filter((phrase) => phrase.roleParts?.some((part) =>
          new RegExp(`\\b${word}\\b`, 'i').test(part.en ?? '')))
        const explanation = explanationPhrases
          .map((phrase) => phrase.explanation ?? phrase.grammarNote ?? phrase.note ?? '')
          .join(' ')
        if (
          !new RegExp(`\\b${word}\\b`, 'i').test(explanation) ||
          !FOCUS_EXPLANATION_CUES[word].test(explanation)
        ) {
          errors.push(`${at}: ${word}の係り先・焦点・頻度を説明する解説がない`)
        }
      }

      const sourceOnlyCount = sentence.en.match(/\bonly\b/gi)?.length ?? 0
      if (!sourceOnlyCount) continue

      onlyOccurrenceCount += sourceOnlyCount
      const review = reviewBySentence.get(sentence.en)
      if (!review) {
        errors.push(`${at}: onlyが正解表に未登録`)
        continue
      }
      seenReviewedSentences.add(sentence.en)

      const matchingParts = parts.filter((part) => ONLY_WORD.test(part.text))
      if (matchingParts.length !== sourceOnlyCount) {
        errors.push(`${at}: only ${sourceOnlyCount}語に対して役割区分が${matchingParts.length}件`)
        continue
      }
      for (const part of matchingParts) {
        reviewedOnlyOccurrenceCount++
        if (part.role !== review.role) {
          errors.push(`${at}: onlyは${review.role}であるべきだが${part.role}（${part.text}）`)
        }
      }

      const explanationPhrases = [
        ...analysis.phraseSequence,
        ...analysis.meaningPhraseSequence,
      ].filter((phrase) => phraseContainsOnlyWithRole(phrase, review.role))
      const explanation = explanationPhrases
        .map((phrase) => phrase.explanation ?? phrase.grammarNote ?? phrase.note ?? '')
        .join(' ')
      if (!/\bonly\b/i.test(explanation) || !FOCUS_EXPLANATION.test(explanation)) {
        errors.push(`${at}: onlyの係り先・限定範囲を説明する解説がない`)
      }

      if (sentence.en === CHOICE_ONLY_REVIEW_SENTENCE) {
        choiceAnalysis = analysis
        choiceSentence = sentence
      }
    }
  }

  for (const review of READING_ONLY_ROLE_REVIEWS) {
    if (!seenReviewedSentences.has(review.sentence)) {
      errors.push(`only正解表の本文がコーパスにない: ${review.sentence}`)
    }
  }

  if (onlyOccurrenceCount !== READING_ONLY_ROLE_REVIEWS.length) {
    errors.push(
      `only全件数が正解表と不一致: 本文${onlyOccurrenceCount}件 / 正解表${READING_ONLY_ROLE_REVIEWS.length}件`,
    )
  }

  for (const [word, expectedCount] of Object.entries(READING_FOCUS_ROLE_EXPECTED_COUNTS)) {
    if (focusCounts[word] !== expectedCount) {
      errors.push(`${word}全件数が手動監査時と不一致: 本文${focusCounts[word]}件 / 正解表${expectedCount}件`)
    }
  }
  if (focusOccurrenceCount !== READING_FOCUS_ROLE_EXPECTED_OCCURRENCE_COUNT) {
    errors.push(
      `焦点・頻度・様態副詞の全件数が不一致: 本文${focusOccurrenceCount}件 / 正解表${READING_FOCUS_ROLE_EXPECTED_OCCURRENCE_COUNT}件`,
    )
  }
  if (READING_FOCUS_ROLE_CORRECTION_COUNT !== READING_FOCUS_ROLE_EXPECTED_CORRECTION_COUNT) {
    errors.push(
      `手動焦点語訂正台帳の件数が不一致: 台帳${READING_FOCUS_ROLE_CORRECTION_COUNT}件 / 正解表${READING_FOCUS_ROLE_EXPECTED_CORRECTION_COUNT}件`,
    )
  }
  if (focusSentenceIds.size !== READING_FOCUS_ROLE_EXPECTED_SENTENCE_COUNT) {
    errors.push(
      `焦点語を含む文数が手動監査時と不一致: 本文${focusSentenceIds.size}文 / 正解表${READING_FOCUS_ROLE_EXPECTED_SENTENCE_COUNT}文`,
    )
  }
  if (READING_FOCUS_ROLE_REVIEW_FINGERPRINT_COUNT !== READING_FOCUS_ROLE_EXPECTED_REVIEW_FINGERPRINT_COUNT) {
    errors.push(
      `焦点語レビューfingerprint数が不一致: 台帳${READING_FOCUS_ROLE_REVIEW_FINGERPRINT_COUNT}文 / 正解表${READING_FOCUS_ROLE_EXPECTED_REVIEW_FINGERPRINT_COUNT}文`,
    )
  }
  for (const reviewId of Object.keys(READING_FOCUS_ROLE_REVIEW_FINGERPRINTS)) {
    if (!focusSentenceIds.has(reviewId)) {
      errors.push(`焦点語レビューfingerprintの対象文に監査語がない: ${reviewId}`)
    }
  }
  if (appliedFocusCorrectionCount !== READING_FOCUS_ROLE_CORRECTION_COUNT) {
    errors.push(
      `手動焦点語訂正の反映件数が不一致: 反映${appliedFocusCorrectionCount}件 / 台帳${READING_FOCUS_ROLE_CORRECTION_COUNT}件`,
    )
  }
  for (const sentence of Object.keys(READING_FOCUS_ROLE_CORRECTIONS)) {
    if (!seenFocusCorrectionSentences.has(sentence)) {
      errors.push(`手動焦点語訂正台帳の本文がコーパスにない: ${sentence}`)
    }
  }

  if (!choiceAnalysis || !choiceSentence) {
    errors.push('choice architecture第1文の役割監査対象が見つからない')
  } else {
    const actualParts = readingSentenceRoleParts(choiceAnalysis)
    if (!sameRoleParts(actualParts, CHOICE_ONLY_EXPECTED_ROLE_PARTS)) {
      errors.push(`choice architecture第1文の役割列が不正: ${actualParts.map((part) => `${part.role}:${part.text}`).join(' / ')}`)
    }
    if (choiceAnalysis.mainPattern !== 'SVO') {
      errors.push(`choice architecture第1文の主節はSVOだが${choiceAnalysis.mainPattern}`)
    }
    const expectedBlockRoles = [null, 'M', 'M', 'M']
    const actualBlockRoles = choiceAnalysis.blocks.map((block) => block.role)
    if (JSON.stringify(actualBlockRoles) !== JSON.stringify(expectedBlockRoles)) {
      errors.push(`choice architecture第1文のブロック役割が不正: ${actualBlockRoles.join(' / ')}`)
    }
    const expectedBlockSvocParts = [
      [
        { role: 'S', text: 'People' },
        { role: 'M', text: 'often' },
        { role: 'V', text: 'describe' },
        { role: 'O', text: 'choice' },
      ],
      [{ role: 'LINK', text: 'as' }],
      [
        { role: 'LINK', text: 'if' },
        { role: 'S', text: 'it' },
        { role: 'V', text: 'begins' },
        { role: 'M', text: 'only' },
      ],
      [
        { role: 'LINK', text: 'when' },
        { role: 'S', text: 'a person' },
        { role: 'M', text: 'consciously' },
        { role: 'V', text: 'compares' },
        { role: 'O', text: 'several options' },
      ],
    ]
    const actualBlockSvocParts = choiceAnalysis.blocks.map((block) => block.svoc.parts)
    if (JSON.stringify(actualBlockSvocParts) !== JSON.stringify(expectedBlockSvocParts)) {
      errors.push('choice architecture第1文の下段ブロック内役割列が人手正解表と不一致')
    }
    const expectedMarked =
      'People often describe choice (as if it begins only when a person consciously compares several options)'
    if (choiceAnalysis.marked !== expectedMarked) {
      errors.push(`choice architecture第1文の構造表示が不正: ${choiceAnalysis.marked}`)
    }

    const asPhrase = choiceAnalysis.phraseSequence.find((phrase) => phrase.en === 'as')
    const ifPhrase = choiceAnalysis.phraseSequence.find((phrase) => phrase.en === 'if')
    const onlyPhrase = choiceAnalysis.phraseSequence.find((phrase) => phrase.en === 'only')
    const asExplanation = `${asPhrase?.explanation ?? ''}`
    const ifExplanation = `${ifPhrase?.explanation ?? ''}`
    const onlyExplanation = `${onlyPhrase?.explanation ?? ''}`
    if (!/as if/.test(asExplanation) || !/副詞節M/u.test(asExplanation)) {
      errors.push('choice architecture第1文: asをas if副詞節の一部と説明していない')
    }
    if (!/as if/.test(ifExplanation) || !/独立した条件節.*ではなく/u.test(ifExplanation)) {
      errors.push('choice architecture第1文: ifを独立した条件と誤読しない説明がない')
    }
    if (
      onlyPhrase?.role !== 'M' ||
      !/M（修飾語）/u.test(onlyExplanation) ||
      !/when節全体/u.test(onlyExplanation) ||
      !/限定/u.test(onlyExplanation) ||
      onlyPhrase?.focusBinding?.target !== 'when a person consciously compares several options' ||
      onlyPhrase?.focusBinding?.governor !== 'begins'
    ) {
      errors.push('choice architecture第1文: onlyのM・when節限定解説または係り先が不完全')
    }
    if (!/ときにだけ/u.test(choiceSentence.ja)) {
      errors.push('choice architecture第1文: 自然訳にonlyの限定が反映されていない')
    }
  }

  return Object.freeze({
    passageCount: passages.length,
    sentenceCount,
    rolePartCount,
    onlyOccurrenceCount,
    reviewedOnlyOccurrenceCount,
    focusOccurrenceCount,
    reviewedFocusOccurrenceCount,
    focusCorrectionCount: READING_FOCUS_ROLE_CORRECTION_COUNT,
    appliedFocusCorrectionCount,
    focusSentenceCount: focusSentenceIds.size,
    focusReviewFingerprintCount: READING_FOCUS_ROLE_REVIEW_FINGERPRINT_COUNT,
    focusCounts: Object.freeze({ ...focusCounts }),
    errors: Object.freeze(errors),
  })
}
