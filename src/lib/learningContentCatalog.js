import { vocabFieldFor } from '../data/vocab.js'
import { ETYMOLOGY_MODE_META } from '../data/etymology-compression.js'
import { KOTEN_CATEGORIES } from '../data/koten.js'
import { KOTEN_GRAMMAR_CATEGORIES } from '../data/koten-grammar.js'
import {
  KOTEN_CULTURE_CATEGORIES,
  KOTEN_CULTURE_LEVELS,
} from '../data/koten-culture.js'
import {
  KOTEN_INTERPRETATION_FOCUS,
  KOTEN_INTERPRETATION_LEVELS,
} from '../data/koten-interpretations.js'
import { KANBUN_VOCAB_CATEGORIES } from '../data/kanbun-vocab.js'
import { KANBUN_GRAMMAR_CATEGORIES } from '../data/kanbun-grammar.js'
import { KANBUN_CULTURE_CATEGORIES } from '../data/kanbun-culture.js'
import { KANBUN_LEVEL_BY_ID } from '../data/kanbun-meta.js'
import { LITERATURE_KIND_META } from '../data/public-domain-literature.js'
import { MATH_PROBLEMS, MATH_UNITS } from '../data/math.js'
import {
  contentQuizKey,
  learningStatusForSrsEntry,
  normalizeContentQuizResults,
  quizStatusForSrsEntry,
} from './contentProgress.js'
import { vocabularyReviewMetrics } from './vocabScheduler.js'
import { learningContentPlanEntry } from './learningContentPlan.js'
import { etymologyWordCardReviewState } from './etymologyProgress.js'

export const LEARNING_CONTENT_CATALOG_SORT_OPTIONS = Object.freeze([
  { id: 'weight', label: '復習のおすすめ順' },
  { id: 'memoryAt', label: '最終学習日' },
  { id: 'testAt', label: '最終テスト日' },
  { id: 'field', label: '分野' },
])

export const LEARNING_CONTENT_CATALOG_DEFAULT_DIRECTIONS = Object.freeze({
  weight: 'desc',
  memoryAt: 'desc',
  testAt: 'desc',
  field: 'asc',
})

const DAY_MS = 86_400_000
const JA_COLLATOR = new Intl.Collator('ja', { sensitivity: 'base', numeric: true })
const EN_COLLATOR = new Intl.Collator('en', { sensitivity: 'base', numeric: true })
const LEVEL_BY_RANK = Object.freeze(['5級', '4級', '3級', '準2級', '2級', '準1級', '1級'])
const EXAM_LEVEL_LABELS = Object.freeze({
  '5': '5級',
  '4': '4級',
  '3': '3級',
  pre2: '準2級',
  '2': '2級',
  pre1: '準1級',
  '1': '1級',
})

const categoryLabels = (categories) => Object.freeze(
  Object.fromEntries(categories.map((category) => [category.id, category.label])),
)

const KOTEN_CATEGORY_LABELS = categoryLabels(KOTEN_CATEGORIES)
const KOTEN_GRAMMAR_CATEGORY_LABELS = categoryLabels(KOTEN_GRAMMAR_CATEGORIES)
const KOTEN_CULTURE_CATEGORY_LABELS = categoryLabels(KOTEN_CULTURE_CATEGORIES)
const KOTEN_READING_LEVEL_LABELS = categoryLabels(KOTEN_INTERPRETATION_LEVELS)
const KANBUN_VOCAB_CATEGORY_LABELS = categoryLabels(KANBUN_VOCAB_CATEGORIES)
const KANBUN_GRAMMAR_CATEGORY_LABELS = categoryLabels(KANBUN_GRAMMAR_CATEGORIES)
const KANBUN_CULTURE_CATEGORY_LABELS = categoryLabels(KANBUN_CULTURE_CATEGORIES)

const MATH_ITEM_META = new Map()
for (const unit of MATH_UNITS) {
  for (const item of MATH_PROBLEMS[unit.id] ?? []) {
    MATH_ITEM_META.set(item.id, unit)
  }
}

const finiteTimestamp = (value) => Number.isFinite(value) ? value : null

const localDayTimestamp = (value) => (
  Number.isFinite(value) ? Number(value) * DAY_MS : null
)

const labelFor = (labels, id, fallback = 'その他') => labels[id] ?? fallback

const examLevel = (level) => EXAM_LEVEL_LABELS[level]
  ? `英検${EXAM_LEVEL_LABELS[level]}`
  : ''

function presentationFor(contentId, item) {
  if (contentId === 'vocab') {
    return {
      title: item.word,
      subtitle: item.meaning,
      field: vocabFieldFor(item),
      level: examLevel(item.level),
    }
  }
  if (contentId === 'usage') {
    return {
      title: item.phrase,
      subtitle: item.meaning,
      field: item.kind === 'idiom' ? '熟語' : '構文',
      level: examLevel(item.level),
    }
  }
  if (contentId === 'grammar') {
    return {
      title: item.q,
      subtitle: item.sentence?.ja || item.explain,
      field: item.topic || '英文法',
      level: examLevel(item.level),
    }
  }
  if (contentId === 'listening') {
    return {
      title: item.questionJa || item.question,
      subtitle: item.question,
      field: item.topic || 'リスニング',
      level: examLevel(item.level),
    }
  }
  if (contentId === 'dictation') {
    return {
      title: item.text,
      subtitle: item.ja,
      field: item.topic || item.kind || 'ディクテーション',
      level: examLevel(item.level),
    }
  }
  if (contentId === 'etymology') {
    return {
      title: item.title,
      subtitle: item.subtitle || item.description,
      field: ETYMOLOGY_MODE_META[item.mode]?.label || '語源',
      level: LEVEL_BY_RANK[item.levelRank] || '',
    }
  }
  if (contentId === 'reading') {
    return {
      title: item.titleJa || item.title,
      subtitle: item.titleJa ? item.title : item.blurb,
      field: '英語長文',
      level: examLevel(item.level),
    }
  }
  if (contentId === 'writing') {
    return {
      title: item.title,
      subtitle: item.task || item.scene,
      field: item.genre || '英作文',
      level: examLevel(item.level),
    }
  }
  if (contentId === 'koten-vocab') {
    return {
      title: item.word,
      subtitle: item.meaning || item.meanings?.[0],
      field: labelFor(KOTEN_CATEGORY_LABELS, item.category),
      level: item.pos || '',
    }
  }
  if (contentId === 'koten-grammar') {
    return {
      title: item.title,
      subtitle: item.meaning || item.summary,
      field: labelFor(KOTEN_GRAMMAR_CATEGORY_LABELS, item.category),
      level: '',
    }
  }
  if (contentId === 'koten-culture') {
    return {
      title: item.title,
      subtitle: item.keyword || item.core,
      field: labelFor(KOTEN_CULTURE_CATEGORY_LABELS, item.category),
      level: KOTEN_CULTURE_LEVELS[item.level]?.label || '',
    }
  }
  if (contentId === 'koten-reading') {
    return {
      title: item.text,
      subtitle: item.question,
      field: KOTEN_INTERPRETATION_FOCUS[item.focus]?.label || '古典短文',
      level: labelFor(KOTEN_READING_LEVEL_LABELS, item.level, ''),
    }
  }
  if (contentId.startsWith('kanbun-') && contentId !== 'kanbun-kundoku') {
    const labels = contentId === 'kanbun-vocab'
      ? KANBUN_VOCAB_CATEGORY_LABELS
      : contentId === 'kanbun-grammar'
        ? KANBUN_GRAMMAR_CATEGORY_LABELS
        : KANBUN_CULTURE_CATEGORY_LABELS
    return {
      title: item.title,
      subtitle: item.answer || item.detail,
      field: labelFor(labels, item.category),
      level: KANBUN_LEVEL_BY_ID[item.level]?.shortLabel || '',
    }
  }
  if (contentId === 'kanbun-kundoku') {
    return {
      title: item.title,
      subtitle: item.kakikudashi || item.translation,
      field: '返り点・訓読',
      level: KANBUN_LEVEL_BY_ID[item.level]?.shortLabel || '',
    }
  }
  if (contentId === 'literature') {
    const kind = LITERATURE_KIND_META[item.kind]
    return {
      title: item.titleJa || item.title,
      subtitle: [item.titleJa ? item.title : '', item.authorJa || item.author].filter(Boolean).join('・'),
      field: kind?.label || '名作',
      level: item.level || '',
    }
  }
  if (contentId === 'math') {
    const unit = MATH_ITEM_META.get(item.id)
    return {
      title: item.text || item.prompt || `${unit?.title || '数学'}の問題`,
      subtitle: unit ? `${unit.title}・${unit.desc}` : '数学の問題',
      field: unit?.strand || '数学',
      level: unit?.grade || '',
      unitId: unit?.id || null,
    }
  }
  return {
    title: item.title || item.word || item.id,
    subtitle: '',
    field: 'その他',
    level: '',
  }
}

function srsReviewState(entry, options) {
  const metrics = vocabularyReviewMetrics(entry, options)
  const learningStatus = learningStatusForSrsEntry(entry)
  const testStatus = quizStatusForSrsEntry(entry)
  const failed = entry?.memory?.lastJudgment === 'forgot'
    || entry?.test?.lastResult === 'wrong'
    || entry?.test?.lastResult === 'unknown'
  const weight = learningStatus === 'unlearned' && testStatus === 'unanswered'
    ? 0
    : 20
      + (metrics.needsReview ? 200 : 0)
      + (failed ? 100 : 0)
      + (metrics.due ? 30 : 0)
      + (100 - metrics.score)
  return {
    memoryAt: finiteTimestamp(entry?.memory?.lastAt),
    testAt: finiteTimestamp(entry?.test?.lastAt),
    memoryStatus: learningStatus,
    testStatus,
    learningRecorded: learningStatus !== 'unlearned',
    testRecorded: testStatus !== 'unanswered',
    needsReview: metrics.needsReview,
    priority: failed
      ? 'retry'
      : metrics.needsReview
        ? 'due'
        : learningStatus !== 'unlearned' || testStatus !== 'unanswered'
          ? 'waiting'
          : 'unlearned',
    weight,
  }
}

function completionReviewState(content, item, state, normalizedQuiz) {
  const completedIds = new Set(content.completedIds(state) ?? [])
  const result = normalizedQuiz[contentQuizKey(content.quizDomain, item.id)]
  const completed = completedIds.has(item.id)
  const wrong = result?.lastResult === 'wrong'
  const learningAt = content.id === 'writing'
    ? localDayTimestamp(state.writingProgress?.[item.id]?.lastDay)
    : null
  return {
    memoryAt: learningAt,
    testAt: finiteTimestamp(result?.lastAt),
    learningRecorded: completed,
    testRecorded: Boolean(result),
    needsReview: wrong,
    priority: wrong ? 'retry' : completed || result ? 'waiting' : 'unlearned',
    weight: wrong ? 320 : completed || result ? 20 : 0,
  }
}

function compareNullableNumber(a, b, direction) {
  const hasA = Number.isFinite(a)
  const hasB = Number.isFinite(b)
  // 日付記録のない項目は、古い順・新しい順のどちらでも最後に置く。
  if (hasA !== hasB) return hasA ? -1 : 1
  if (!hasA) return 0
  return direction === 'asc' ? a - b : b - a
}

export function learningContentCatalogRows(
  content,
  state = {},
  {
    sort = 'weight',
    direction = LEARNING_CONTENT_CATALOG_DEFAULT_DIRECTIONS[sort] ?? 'desc',
    now = Date.now(),
    day,
  } = {},
) {
  if (!content?.id || !Array.isArray(content.items)) return []
  const normalizedSort = LEARNING_CONTENT_CATALOG_SORT_OPTIONS.some((option) => option.id === sort)
    ? sort
    : 'weight'
  const normalizedDirection = direction === 'asc' ? 'asc' : 'desc'
  const normalizedQuiz = normalizeContentQuizResults(state.contentQuizResults)
  const metricOptions = day === undefined ? { now } : { now, day }
  const rows = content.items.map((item) => {
    const presentation = presentationFor(content.id, item)
    const reviewState = content.kind === 'srs'
      ? content.id === 'etymology'
        ? etymologyWordCardReviewState(item, state.srs, metricOptions)
        : srsReviewState(state[content.store]?.[item.id], metricOptions)
      : completionReviewState(content, item, state, normalizedQuiz)
    const planEntry = learningContentPlanEntry(
      state.learningNotebook?.contentPlan,
      content.id,
      item.id,
    )
    const manualPriority = planEntry?.registered ? planEntry.priority : 0
    const searchText = [
      presentation.title,
      presentation.subtitle,
      presentation.field,
      presentation.level,
      item.id,
    ].filter(Boolean).join(' ').toLocaleLowerCase('ja')
    return {
      id: item.id,
      item,
      ...presentation,
      ...reviewState,
      registered: planEntry?.registered === true,
      hidden: planEntry?.hidden === true,
      manualPriority,
      weight: reviewState.weight + manualPriority * 1000,
      searchText,
    }
  })

  return rows.sort((a, b) => {
    let compared = 0
    if (normalizedSort === 'memoryAt' || normalizedSort === 'testAt') {
      compared = compareNullableNumber(a[normalizedSort], b[normalizedSort], normalizedDirection)
    } else if (normalizedSort === 'field') {
      compared = JA_COLLATOR.compare(a.field, b.field)
      if (normalizedDirection === 'desc') compared *= -1
    } else {
      compared = normalizedDirection === 'asc'
        ? a.weight - b.weight
        : b.weight - a.weight
    }
    return compared
      || EN_COLLATOR.compare(a.title, b.title)
      || String(a.id).localeCompare(String(b.id))
  })
}

export const LEARNING_CONTENT_CATALOG_ACTIONS = Object.freeze({
  vocab: { selection: 'many', verb: '復習' },
  usage: { selection: 'many', verb: '暗記' },
  grammar: { selection: 'many', verb: 'テスト' },
  listening: { selection: 'many', verb: 'テスト' },
  dictation: { selection: 'many', verb: '練習' },
  etymology: { selection: 'many', verb: '暗記' },
  reading: { selection: 'one', verb: '読む' },
  writing: { selection: 'one', verb: '書く' },
  'koten-vocab': { selection: 'many', verb: '暗記' },
  'koten-grammar': { selection: 'many', verb: '暗記' },
  'koten-culture': { selection: 'many', verb: '暗記' },
  'koten-reading': { selection: 'many', verb: '問題へ' },
  'kanbun-vocab': { selection: 'many', verb: '暗記' },
  'kanbun-grammar': { selection: 'many', verb: '暗記' },
  'kanbun-culture': { selection: 'many', verb: '暗記' },
  'kanbun-kundoku': { selection: 'many', verb: '問題へ' },
  literature: { selection: 'one', verb: '読む' },
  math: { selection: 'one', verb: '解く' },
})

export function learningContentCatalogLaunch(
  content,
  rows = [],
  { catalogView = 'all' } = {},
) {
  if (!content?.id || !rows.length) return null
  const action = LEARNING_CONTENT_CATALOG_ACTIONS[content.id]
  if (!action) return null
  const selectedRows = action.selection === 'one' ? rows.slice(0, 1) : rows
  const ids = selectedRows.map((row) => row.id)
  const returnTo = {
    screen: 'myLearning',
    params: { view: 'catalog', contentId: content.id, catalogView },
  }
  const common = {
    title: `${content.label}・一覧で選択`,
    size: ids.length,
    returnTo,
  }

  if (content.id === 'vocab') {
    return {
      screen: 'vocabStudy',
      params: { ...common, mode: 'study', source: { type: 'deck', ids, preserveOrder: true } },
    }
  }
  if (content.id === 'usage') {
    return {
      screen: 'phraseStudy',
      params: { ...common, source: { type: 'phraseList', ids, preserveOrder: true } },
    }
  }
  if (content.id === 'grammar') {
    return {
      screen: 'grammarQuiz',
      params: { ...common, source: { type: 'grammarList', ids, preserveOrder: true } },
    }
  }
  if (content.id === 'listening') {
    return {
      screen: 'listeningQuiz',
      params: { ...common, source: { type: 'listeningList', ids, preserveOrder: true } },
    }
  }
  if (content.id === 'dictation') {
    return {
      screen: 'dictationPlay',
      params: { ...common, source: { type: 'dictationList', ids, preserveOrder: true } },
    }
  }
  if (content.id === 'etymology') {
    const wordIds = [...new Set(selectedRows.flatMap(
      (row) => row.item?.studyIds ?? row.item?.coverageIds ?? [],
    ))]
    if (!wordIds.length) return { screen: 'roots', params: { returnTo } }
    return {
      screen: 'vocabStudy',
      params: {
        ...common,
        size: wordIds.length,
        mode: 'study',
        source: { type: 'deck', ids: wordIds, preserveOrder: true },
      },
    }
  }
  if (content.id === 'reading') {
    return { screen: 'readingPrep', params: { passageId: ids[0], returnTo } }
  }
  if (content.id === 'writing') {
    return { screen: 'writingPlay', params: { exerciseId: ids[0], mode: 'guide', returnTo } }
  }
  if (content.id === 'koten-vocab') {
    return { screen: 'kotenStudy', params: { ...common, ids, preserveOrder: true } }
  }
  if (content.id === 'koten-grammar') {
    return { screen: 'kotenGrammarStudy', params: { ...common, ids, preserveOrder: true } }
  }
  if (content.id === 'koten-culture') {
    return { screen: 'kotenCultureStudy', params: { ...common, ids, preserveOrder: true } }
  }
  if (content.id === 'koten-reading') {
    return { screen: 'kotenInterpretationPrep', params: { ...common, ids, preserveOrder: true } }
  }
  if (content.id.startsWith('kanbun-') && content.id !== 'kanbun-kundoku') {
    return {
      screen: 'kanbunStudy',
      params: {
        ...common,
        domain: content.id.replace('kanbun-', ''),
        ids,
        preserveOrder: true,
      },
    }
  }
  if (content.id === 'kanbun-kundoku') {
    return { screen: 'kanbunKundokuQuiz', params: { ...common, ids, preserveOrder: true } }
  }
  if (content.id === 'literature') {
    return { screen: 'literatureReader', params: { workId: ids[0], returnTo } }
  }
  if (content.id === 'math') {
    return {
      screen: 'mathSolve',
      params: {
        unitId: selectedRows[0].unitId,
        problemIds: ids,
        title: `${content.label}・一覧で選択`,
        returnTo,
      },
    }
  }
  return null
}

export function learningContentCatalogTotal(contents = []) {
  return contents.reduce((sum, content) => sum + (content.items?.length ?? 0), 0)
}
