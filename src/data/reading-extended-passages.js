// 語彙強化ロングリーディング（1,000／2,000／3,000／4,000語）。
//
// 本文は初期長文と同じく「一つづきの説明文」で、一文ごとに語順訳・5文型・
// 構文詳細を持つ。共通辞書の監査済み例文は本文から切り離し、節ごとの
// 「重点語ケース」として学習者に提示する。語彙カバレッジはケース層が担う。
//
// annotated: true の長文は初期長文と同じ一文監査の対象。まだ散文へ書き直して
// いない長文は、従来どおり辞書例文を連結した本文のまま暫定表示する。

import { EXTENDED_READING_GENERATED } from './reading-extended-sentences.generated.js'
import { CIVIC_DECISIONS_BODY } from './reading-extended-body-civic.js'
import { CUSTOMS_ACROSS_BORDERS_BODY } from './reading-extended-body-customs.js'
import { SHARED_WATERSHED_BODY } from './reading-extended-body-watershed.js'
import { GENERATIONAL_CITY_BODY } from './reading-extended-body-city.js'

const WORD_PATTERN = /[A-Za-z]+(?:['’][A-Za-z]+)*/g
const countWords = (text = '') => text.match(WORD_PATTERN)?.length ?? 0

const BODIES = Object.freeze({
  [CIVIC_DECISIONS_BODY.id]: CIVIC_DECISIONS_BODY,
  [CUSTOMS_ACROSS_BORDERS_BODY.id]: CUSTOMS_ACROSS_BORDERS_BODY,
  [SHARED_WATERSHED_BODY.id]: SHARED_WATERSHED_BODY,
  [GENERATIONAL_CITY_BODY.id]: GENERATIONAL_CITY_BODY,
})

const PASSAGE_META = Object.freeze({
  p_ext_1000_civic_decisions: Object.freeze({
    level: '2',
    emoji: '🗳️',
    title: 'A Civic Vocabulary Atlas',
    titleJa: '公共の決定を読む語彙地図',
    blurb: '声と代表、法と権利、情報、予算、見直しの5節を、辞書連動の語彙事例で読み進める約1,000語の多読教材。',
    theme: '政治・法・メディア・公共の選択',
    extendedReadingDomain: '政治・法・経済',
    examTypes: Object.freeze(['大学受験', '英検']),
    examLabel: '大学受験・英検2級以上・語彙強化',
    examFocus: Object.freeze(['節ごとの主題', '権利と責任の対比', '根拠と見直し']),
  }),
  p_ext_2000_customs_across_borders: Object.freeze({
    level: 'pre1',
    emoji: '🧭',
    title: 'Customs Across Borders',
    titleJa: '国境を越える風習',
    blurb: '挨拶、もてなし、祭り、芸術、移動、決めつけない比較の6節を読む約2,000語の多読教材。',
    theme: '海外の風習・文化交流・移民・ステレオタイプ',
    extendedReadingDomain: '海外文化・社会・歴史',
    examTypes: Object.freeze(['大学受験', '英検']),
    examLabel: '大学受験・英検準1級以上・語彙強化',
    examFocus: Object.freeze(['具体例の分類', '文化の変化', '過度な一般化の回避']),
  }),
  p_ext_3000_shared_watershed: Object.freeze({
    level: 'pre1',
    emoji: '🌊',
    title: 'One River, Many Lives',
    titleJa: '一つの流域を共有する',
    blurb: '気象から生態系、農業、公衆衛生、基盤設備、技術、測定、協力までを横断する約3,000語の多読教材。',
    theme: '環境問題・流域・農業・公衆衛生・科学技術',
    extendedReadingDomain: '環境・科学・医療・政策',
    examTypes: Object.freeze(['大学受験', '英検']),
    examLabel: '大学受験・英検準1級以上・語彙強化',
    examFocus: Object.freeze(['見える変化と隠れた変化', '因果の連鎖', '測定の限界と協力']),
  }),
  p_ext_4000_generational_city: Object.freeze({
    level: '1',
    emoji: '🏙️',
    title: 'A City for More Than One Generation',
    titleJa: '世代を越えて都市を考える',
    blurb: '時間、心理、労働、経済、制度、教育、医療、技術、文化を世代間の選択として読む約4,000語の多読教材。',
    theme: '世代間政策・都市・経済・医療・技術・文化',
    extendedReadingDomain: '社会総合・経済・心理・科学技術',
    examTypes: Object.freeze(['大学受験', '英検']),
    examLabel: '大学受験難関・英検1級以上・語彙強化',
    examFocus: Object.freeze(['現在と将来の対比', '分野を越えた因果', '条件付きの結論']),
  }),
})

// 共通辞書の監査済み例文を、節ごとの「重点語ケース」としてまとめる。
// 本文の散文とは別の層で、語彙カバレッジの根拠になる。
const vocabularyCasesBySection = (generated) => {
  const bySection = new Map()
  for (const row of generated.rows) {
    if (row.source !== 'shared-vocabulary-example') continue
    if (!bySection.has(row.sectionId)) bySection.set(row.sectionId, [])
    bySection.get(row.sectionId).push(Object.freeze({
      id: row.targetId,
      word: row.targetWord,
      field: row.field,
      en: row.en,
      ja: row.ja,
    }))
  }
  return bySection
}

const buildAnnotatedSections = (body, generated) => {
  const cases = vocabularyCasesBySection(generated)
  const sections = []
  let cursor = 0
  for (const section of body.sections) {
    const sectionCases = Object.freeze(cases.get(section.id) ?? [])
    sections.push(Object.freeze({
      id: section.id,
      title: section.title,
      titleJa: section.titleJa,
      summaryJa: section.summaryJa,
      startSentenceIndex: cursor,
      endSentenceIndex: cursor + section.sentences.length - 1,
      sentences: Object.freeze(section.sentences),
      wordCount: section.sentences.reduce((sum, sentence) => sum + countWords(sentence.en), 0),
      vocabularyCases: sectionCases,
      vocabularyCaseWordCount: sectionCases.reduce((sum, item) => sum + countWords(item.en), 0),
      targetVocabularyIds: Object.freeze(sectionCases.map((item) => item.id)),
      allowedFields: Object.freeze([...(generated.sectionFields[section.id] ?? [])]),
    }))
    cursor += section.sentences.length
  }
  return Object.freeze(sections)
}

const hydrateAnnotated = (id, body, generated) => {
  const meta = PASSAGE_META[id]
  const sentences = Object.freeze(body.sections.flatMap((section) => section.sentences))
  const sections = buildAnnotatedSections(body, generated)
  const vocab = Object.freeze(sections.flatMap((section) => [...section.targetVocabularyIds]))

  return Object.freeze({
    id,
    ...meta,
    extended: true,
    annotated: true,
    extendedFormat: 'themed-long-reading',
    targetWords: generated.targetWords,
    actualWords: sentences.reduce((sum, sentence) => sum + countWords(sentence.en), 0),
    vocabularyCaseCount: vocab.length,
    vocabularyCaseWords: sections.reduce((sum, section) => sum + section.vocabularyCaseWordCount, 0),
    targetVocabularyCount: generated.targetVocabularyCount,
    vocab,
    sentences,
    sections,
  })
}

// --- 未変換の長文（従来の辞書例文連結）を暫定表示するための組み立て ---

const buildLegacySections = (sentences, sectionFields) => {
  const sections = []
  for (const [sentenceIndex, sentence] of sentences.entries()) {
    let section = sections.at(-1)
    if (!section || section.id !== sentence.sectionId) {
      section = {
        id: sentence.sectionId,
        title: sentence.sectionTitle,
        titleJa: sentence.sectionTitleJa,
        startSentenceIndex: sentenceIndex,
        sentences: [],
      }
      sections.push(section)
    }
    section.sentences.push(sentence)
  }

  return Object.freeze(sections.map((section) => {
    const targetVocabularyIds = [...new Set(section.sentences
      .map((sentence) => sentence.targetId)
      .filter(Boolean))]
    return Object.freeze({
      ...section,
      sentences: Object.freeze(section.sentences),
      endSentenceIndex: section.startSentenceIndex + section.sentences.length - 1,
      wordCount: section.sentences.reduce((sum, sentence) => sum + countWords(sentence.en), 0),
      targetVocabularyIds: Object.freeze(targetVocabularyIds),
      allowedFields: Object.freeze([...(sectionFields[section.id] ?? [])]),
    })
  }))
}

const hydrateLegacy = (id, generated) => {
  const meta = PASSAGE_META[id]
  const sentences = Object.freeze(generated.rows.map((row, index) => Object.freeze({
    ...row,
    chunks: Object.freeze([Object.freeze({ en: row.en, ja: row.ja })]),
    gloss: Object.freeze({}),
    reviewId: `${id}#${index + 1}`,
  })))
  const vocab = Object.freeze([...new Set(sentences
    .map((sentence) => sentence.targetId)
    .filter(Boolean))])

  return Object.freeze({
    id,
    ...meta,
    extended: true,
    annotated: false,
    extendedFormat: 'themed-vocabulary-cases',
    targetWords: generated.targetWords,
    actualWords: generated.actualWords,
    targetVocabularyCount: generated.targetVocabularyCount,
    vocab,
    sentences,
    sections: buildLegacySections(sentences, generated.sectionFields),
  })
}

export const EXTENDED_PASSAGES = Object.freeze(Object.entries(EXTENDED_READING_GENERATED)
  .map(([id, generated]) => (BODIES[id]
    ? hydrateAnnotated(id, BODIES[id], generated)
    : hydrateLegacy(id, generated))))

export const EXTENDED_PASSAGES_BY_ID = Object.freeze(Object.fromEntries(
  EXTENDED_PASSAGES.map((passage) => [passage.id, passage]),
))

export const ANNOTATED_EXTENDED_PASSAGES = Object.freeze(
  EXTENDED_PASSAGES.filter((passage) => passage.annotated),
)
