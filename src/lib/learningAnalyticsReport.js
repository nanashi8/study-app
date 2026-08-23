import {
  ETYMOLOGY_MODE_META,
  getEtymologyPack,
  getWord,
} from '../data/vocab.js'
import { getPhrase } from '../data/phrases.js'
import { getGrammar } from '../data/grammar.js'
import {
  LISTENING_TYPE_META,
  getListeningItem,
} from '../data/listening.js'
import { getDictation } from '../data/dictation.js'
import { KOTEN_CATEGORIES, getKoten } from '../data/koten.js'
import {
  KOTEN_GRAMMAR_CATEGORIES,
  getKotenGrammar,
} from '../data/koten-grammar.js'
import {
  KOTEN_CULTURE_CATEGORIES,
  getKotenCulture,
} from '../data/koten-culture.js'
import {
  KOTEN_INTERPRETATION_FOCUS,
  KOTEN_INTERPRETATION_LEVELS,
  getKotenInterpretation,
} from '../data/koten-interpretations.js'
import { KANBUN_VOCAB_CATEGORIES, getKanbunVocab } from '../data/kanbun-vocab.js'
import { KANBUN_GRAMMAR_CATEGORIES, getKanbunGrammar } from '../data/kanbun-grammar.js'
import { KANBUN_CULTURE_CATEGORIES, getKanbunCulture } from '../data/kanbun-culture.js'
import { KANBUN_LEVEL_BY_ID } from '../data/kanbun-meta.js'
import { getKanbunKundokuExercise } from '../data/kanbun-kundoku.js'
import { unitById } from '../data/math.js'
import { analyzeLearning, learningSkillForItem } from './learningAnalytics.js'
import {
  LONG_TERM_SRS_BOX,
  MAX_SRS_BOX,
} from './srs.js'

const DAY_MS = 86400000
const MIN_PREDICTION = 0.08
const HALF_LIFE_DAYS = [0.4, 1.2, 2.6, 5.5, 11, 24, 50, 100, 180, 365]
const CURVE_DAYS = [0, 1, 3, 7, 14, 30]
// 既存0〜6段階の成績点を変えず、維持復習の差は半減期モデルで反映する。
const GRADE_STAGE_CAP = 6

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const count = (value) => Math.max(0, Number(value) || 0)
const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value))

export const LEARNING_REPORT_SUBJECTS = Object.freeze({
  english: { label: '英語', emoji: '🔤', color: '#2563eb' },
  koten: { label: '古典', emoji: '📜', color: '#b45309' },
  kanbun: { label: '漢文', emoji: '📕', color: '#9f1239' },
  math: { label: '数学', emoji: '📐', color: '#7c3aed' },
})

export const LEARNING_REPORT_DOMAINS = Object.freeze({
  vocab: { label: '英単語', subject: 'english', skill: 'vocab', memory: true, test: true, color: '#4f46e5' },
  phrases: { label: '英熟語・構文', subject: 'english', skill: 'usage', memory: true, test: true, color: '#7c3aed' },
  grammar: { label: '英文法', subject: 'english', skill: 'grammar', memory: false, test: true, color: '#d97706' },
  listening: { label: 'リスニング', subject: 'english', skill: 'listening', memory: false, test: true, color: '#0284c7' },
  dictation: { label: 'ディクテーション', subject: 'english', skill: 'dictation', memory: false, test: true, color: '#0f766e' },
  etymology: { label: '語源知識', subject: 'english', skill: 'etymology', memory: true, test: false, color: '#a21caf' },
  reading: { label: '長文読解', subject: 'english', skill: 'reading', memory: false, test: true, color: '#059669' },
  writing: { label: '英作文', subject: 'english', skill: 'writing', memory: false, test: true, color: '#db2777' },
  kotenVocab: { label: '古典単語', subject: 'koten', skill: 'koten', memory: true, test: true, color: '#c2410c' },
  kotenGrammar: { label: '古典文法', subject: 'koten', skill: 'koten_grammar', memory: true, test: true, color: '#b45309' },
  kotenCulture: { label: '古典常識', subject: 'koten', skill: 'koten_culture', memory: true, test: true, color: '#6d28d9' },
  kotenReading: { label: '古典読解', subject: 'koten', skill: 'koten_reading', memory: false, test: true, color: '#a16207' },
  kanbunVocab: { label: '漢語', subject: 'kanbun', skill: 'kanbun_vocab', memory: true, test: true, color: '#0f766e' },
  kanbunGrammar: { label: '漢文法', subject: 'kanbun', skill: 'kanbun_grammar', memory: true, test: true, color: '#be123c' },
  kanbunCulture: { label: '漢文常識', subject: 'kanbun', skill: 'kanbun_culture', memory: true, test: true, color: '#7c3aed' },
  kanbunKundoku: { label: '返り点・訓読', subject: 'kanbun', skill: 'kanbun_kundoku', memory: false, test: true, color: '#0369a1' },
  math: { label: '数学', subject: 'math', skill: 'math', memory: false, test: true, color: '#7c3aed' },
})

const domainForSkill = Object.fromEntries(
  Object.entries(LEARNING_REPORT_DOMAINS).map(([domain, meta]) => [meta.skill, domain]),
)

const kotenCategoryById = new Map(KOTEN_CATEGORIES.map((item) => [item.id, item]))
const kotenGrammarCategoryById = new Map(
  KOTEN_GRAMMAR_CATEGORIES.map((item) => [item.id, item]),
)
const kotenCultureCategoryById = new Map(
  KOTEN_CULTURE_CATEGORIES.map((item) => [item.id, item]),
)
const kotenInterpretationLevelById = new Map(
  KOTEN_INTERPRETATION_LEVELS.map((item) => [item.id, item]),
)
const kanbunVocabCategoryById = new Map(
  KANBUN_VOCAB_CATEGORIES.map((item) => [item.id, item]),
)
const kanbunGrammarCategoryById = new Map(
  KANBUN_GRAMMAR_CATEGORIES.map((item) => [item.id, item]),
)
const kanbunCultureCategoryById = new Map(
  KANBUN_CULTURE_CATEGORIES.map((item) => [item.id, item]),
)

function descriptor(domain, item, fallbackId) {
  const id = item?.id ?? fallbackId
  if (domain === 'vocab') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.word ?? fallbackId,
    subtitle: item?.meaning ?? '',
    field: item?.field || item?.pos || '語彙全般',
    level: item?.level ? `英検${item.level}級` : '',
  }
  if (domain === 'phrases') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.phrase ?? fallbackId,
    subtitle: item?.meaning ?? '',
    field: item?.kind === 'syntax' ? '構文' : item?.category === 'expression' ? '表現' : '熟語',
    level: item?.level ? `英検${item.level}級` : '',
  }
  if (domain === 'grammar') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.sentence?.en ?? item?.q ?? fallbackId,
    subtitle: item?.topic ?? '',
    field: item?.topic || '英文法全般',
    level: item?.level ? `英検${item.level}級` : '',
  }
  if (domain === 'listening') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.topic ?? item?.question ?? fallbackId,
    subtitle: item?.questionJa ?? '',
    field: LISTENING_TYPE_META[item?.type]?.label ?? item?.type ?? 'リスニング全般',
    level: item?.level ? `英検${item.level}級` : '',
  }
  if (domain === 'dictation') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.text ?? fallbackId,
    subtitle: item?.ja ?? '',
    field: item?.topic || item?.focus || '書き取り全般',
    level: item?.level ? `英検${item.level}級` : '',
  }
  if (domain === 'etymology') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.title ?? fallbackId,
    subtitle: item?.description ?? '',
    field: ETYMOLOGY_MODE_META[item?.mode]?.label ?? item?.mode ?? '語源全般',
    level: item?.rootId ? `語根 ${item.rootId}` : '',
  }
  if (domain === 'kotenVocab') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.word ?? fallbackId,
    subtitle: item?.meaning ?? '',
    field: kotenCategoryById.get(item?.category)?.label ?? item?.pos ?? '古典単語全般',
    level: item?.pos ?? '',
  }
  if (domain === 'kotenGrammar') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.title ?? fallbackId,
    subtitle: item?.meaning ?? '',
    field: kotenGrammarCategoryById.get(item?.category)?.label ?? item?.category ?? '古典文法全般',
    level: item?.connection ?? '',
  }
  if (domain === 'kotenCulture') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.title ?? fallbackId,
    subtitle: item?.keyword ?? '',
    field: kotenCultureCategoryById.get(item?.category)?.label ?? item?.category ?? '古典常識全般',
    level: item?.level === 'basic' ? '基礎' : item?.level === 'advanced' ? '発展' : '標準',
  }
  if (domain === 'kotenReading') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.text ?? fallbackId,
    subtitle: item?.source ?? '',
    field: KOTEN_INTERPRETATION_FOCUS[item?.focus]?.label ?? '古典読解全般',
    level: kotenInterpretationLevelById.get(item?.level)?.label ?? '',
  }
  if (domain === 'kanbunVocab' || domain === 'kanbunGrammar' || domain === 'kanbunCulture') {
    const categoryMaps = {
      kanbunVocab: kanbunVocabCategoryById,
      kanbunGrammar: kanbunGrammarCategoryById,
      kanbunCulture: kanbunCultureCategoryById,
    }
    return {
      catalogResolved: Boolean(item),
      id,
      title: item?.title ?? fallbackId,
      subtitle: item?.answer ?? '',
      field: categoryMaps[domain].get(item?.category)?.label ?? '漢文全般',
      level: KANBUN_LEVEL_BY_ID[item?.level]?.label ?? '',
    }
  }
  if (domain === 'kanbunKundoku') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.title ?? fallbackId,
    subtitle: item?.marked ?? '',
    field: '返り点・訓読',
    level: KANBUN_LEVEL_BY_ID[item?.level]?.label ?? '',
  }
  if (domain === 'math') return {
    catalogResolved: Boolean(item),
    id,
    title: item?.title ?? fallbackId,
    subtitle: item?.desc ?? '',
    field: item?.strand ?? '数学全般',
    level: item?.grade ?? '',
  }
  return { id, catalogResolved: false, title: fallbackId, subtitle: '', field: '分類未確定', level: '' }
}

function sharedSrsDescriptor(itemId) {
  const dictation = getDictation(itemId)
  if (dictation) return { domain: 'dictation', ...descriptor('dictation', dictation, itemId) }
  const grammar = getGrammar(itemId)
  if (grammar) return { domain: 'grammar', ...descriptor('grammar', grammar, itemId) }
  const phrase = getPhrase(itemId)
  if (phrase) return { domain: 'phrases', ...descriptor('phrases', phrase, itemId) }
  const listening = getListeningItem(itemId)
  if (listening) return { domain: 'listening', ...descriptor('listening', listening, itemId) }
  const word = getWord(itemId)
  if (word) return { domain: 'vocab', ...descriptor('vocab', word, itemId) }
  const skill = learningSkillForItem(itemId)
  const domain = domainForSkill[skill] ?? 'vocab'
  return { domain, ...descriptor(domain, null, itemId) }
}

function entryOutcome(entry) {
  const memoryAt = Number(entry.memory?.lastAt) || 0
  const testAt = Number(entry.test?.lastAt) || 0
  if (memoryAt >= testAt && memoryAt > 0) return entry.memory?.lastJudgment
  if (testAt > 0) return entry.test?.lastResult
  return null
}

function startRecallFor(entry) {
  const outcome = entryOutcome(entry)
  if (outcome === 'forgot') return 0.35
  if (outcome === 'unknown') return 0.25
  if (outcome === 'wrong') return 0.45
  if (outcome === 'remembered' || outcome === 'correct') return 0.98
  return count(entry.box) === 0 ? 0.45 : 0.9
}

function retentionModel(entry, analysis, now) {
  const box = clamp(Math.floor(count(entry.box)), 0, MAX_SRS_BOX)
  const testAttempts = count(entry.test?.attempts)
  const testAccuracy = testAttempts ? count(entry.test?.correct) / testAttempts : null
  const memoryPasses = count(entry.memory?.passes)
  const personalAccuracy = analysis?.activity?.test?.scored >= 5
    ? analysis.activity.test.correct / analysis.activity.test.scored
    : analysis?.retentionRate
  const personalFactor = personalAccuracy == null
    ? 1
    : clamp(0.65 + personalAccuracy * 0.7, 0.65, 1.35)
  const itemFactor = testAccuracy == null
    ? 1
    : clamp(0.7 + testAccuracy * 0.6, 0.7, 1.3)
  const passFactor = 1 + Math.min(memoryPasses, 8) * 0.035
  const halfLifeDays = HALF_LIFE_DAYS[box] * personalFactor * itemFactor * passFactor
  const lastAt = Number.isFinite(entry.lastAt)
    ? entry.lastAt
    : Number.isFinite(entry.last)
      ? entry.last * DAY_MS
      : now
  const elapsedDays = Math.max(0, (now - lastAt) / DAY_MS)
  const start = startRecallFor(entry)
  const current = MIN_PREDICTION
    + (start - MIN_PREDICTION) * (2 ** (-elapsedDays / halfLifeDays))
  return {
    halfLifeDays,
    elapsedDays,
    current: clamp(current, MIN_PREDICTION, 0.99),
  }
}

function localDayIndex(timestamp) {
  const offset = new Date(timestamp).getTimezoneOffset()
  return Math.floor((timestamp - offset * 60000) / DAY_MS)
}

function gradeFor(score) {
  if (score == null) return '—'
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  return 'D'
}

function itemRow(domain, item, entry, analysis, now, overrides = {}) {
  const meta = LEARNING_REPORT_DOMAINS[domain]
  const source = isRecord(entry) ? entry : {}
  const memory = isRecord(source.memory) ? source.memory : null
  const test = isRecord(source.test) ? source.test : null
  const memoryAttempts = count(memory?.passes)
  const memoryRemembered = count(memory?.remembered)
  const memoryForgot = count(memory?.forgot)
  const testAttempts = count(test?.attempts)
  const testCorrect = count(test?.correct)
  const overallCorrect = count(source.correct)
  const overallWrong = count(source.wrong)
  const overallAttempts = overallCorrect + overallWrong
  const modeAttempts = memoryAttempts + testAttempts
  const legacyAttempts = Math.max(0, overallAttempts - modeAttempts)
  const model = retentionModel(source, analysis, now)
  const testAccuracy = testAttempts ? testCorrect / testAttempts : null
  const overallAccuracy = overallAttempts ? overallCorrect / overallAttempts : null
  const box = clamp(Math.floor(count(source.box)), 0, MAX_SRS_BOX)
  const accuracyForGrade = testAccuracy ?? overallAccuracy
  const gradeScore = accuracyForGrade == null
    ? Math.round(model.current * 100)
    : Math.round((accuracyForGrade * 0.55 + model.current * 0.35 + (Math.min(box, GRADE_STAGE_CAP) / GRADE_STAGE_CAP) * 0.1) * 100)
  const due = Number.isFinite(source.due) && source.due <= localDayIndex(now)
  const lastJudgment = memory?.lastJudgment === 'remembered'
    ? '覚えた'
    : memory?.lastJudgment === 'forgot'
      ? 'まだ'
      : '未記録'
  const confidence = testAttempts >= 5 || overallAttempts >= 10
    ? 'stable'
    : modeAttempts >= 3 || overallAttempts >= 3
      ? 'growing'
      : legacyAttempts
        ? 'legacy'
        : 'starting'
  const status = due || model.current < 0.55
    ? 'review'
    : model.current >= 0.8 && box >= LONG_TERM_SRS_BOX
      ? 'stable'
      : 'building'

  return {
    key: `${domain}:${item.id}`,
    id: item.id,
    domain,
    subject: meta.subject,
    typeLabel: meta.label,
    color: meta.color,
    title: item.title,
    catalogResolved: item.catalogResolved !== false,
    subtitle: item.subtitle,
    field: item.field || '全般',
    level: item.level || '',
    entry: source,
    box,
    due,
    status,
    memoryAttempts,
    memoryRemembered,
    memoryForgot,
    memoryRate: memoryAttempts ? memoryRemembered / memoryAttempts : null,
    lastJudgment,
    testAttempts,
    testCorrect,
    testAccuracy,
    overallAttempts,
    overallCorrect,
    overallAccuracy,
    legacyAttempts,
    hasModeBreakdown: Boolean(memory || test),
    predictedRetention: model.current,
    halfLifeDays: model.halfLifeDays,
    elapsedDays: model.elapsedDays,
    gradeScore,
    grade: gradeFor(gradeScore),
    confidence,
    supportsMemory: meta.memory,
    supportsTest: meta.test,
    ...overrides,
  }
}

function collectSrsRows(state, analysis, now) {
  const rows = []
  for (const [id, entry] of Object.entries(state.srs ?? {})) {
    const item = sharedSrsDescriptor(id)
    rows.push(itemRow(item.domain, item, entry, analysis, now))
  }
  const stores = [
    ['etymology', state.etymologySrs, (id) => descriptor('etymology', getEtymologyPack(id), id)],
    ['kotenVocab', state.kotenSrs, (id) => descriptor('kotenVocab', getKoten(id), id)],
    ['kotenGrammar', state.kotenGrammarSrs, (id) => descriptor('kotenGrammar', getKotenGrammar(id), id)],
    ['kotenCulture', state.kotenCultureSrs, (id) => descriptor('kotenCulture', getKotenCulture(id), id)],
    ['kotenReading', state.kotenInterpretationSrs, (id) => descriptor('kotenReading', getKotenInterpretation(id), id)],
    ['kanbunVocab', state.kanbunVocabSrs, (id) => descriptor('kanbunVocab', getKanbunVocab(id), id)],
    ['kanbunGrammar', state.kanbunGrammarSrs, (id) => descriptor('kanbunGrammar', getKanbunGrammar(id), id)],
    ['kanbunCulture', state.kanbunCultureSrs, (id) => descriptor('kanbunCulture', getKanbunCulture(id), id)],
    ['kanbunKundoku', state.kanbunKundokuSrs, (id) => descriptor('kanbunKundoku', getKanbunKundokuExercise(id), id)],
  ]
  for (const [domain, store, resolve] of stores) {
    for (const [id, entry] of Object.entries(store ?? {})) {
      rows.push(itemRow(domain, resolve(id), entry, analysis, now))
    }
  }
  return rows
}

function supplementalRows(state, analysis, now, srsRows) {
  const rows = []
  for (const [unitId, masteryValue] of Object.entries(state.mathMastery ?? {})) {
    const unit = unitById(unitId)
    if (!unit) continue
    const mastery = clamp(Number(masteryValue) || 0, 0, 100)
    const item = descriptor('math', unit, unitId)
    rows.push({
      ...itemRow('math', item, { box: mastery >= 85 ? 5 : mastery >= 70 ? 4 : mastery >= 50 ? 2 : 0 }, analysis, now),
      predictedRetention: null,
      halfLifeDays: null,
      gradeScore: Math.round(mastery),
      grade: gradeFor(mastery),
      testAttempts: 0,
      testCorrect: 0,
      testAccuracy: mastery / 100,
      overallAccuracy: mastery / 100,
      confidence: 'reference',
      status: mastery >= 70 ? 'stable' : 'review',
      isMasteryReference: true,
    })
  }

  const presentDomains = new Set(srsRows.map((row) => row.domain))
  for (const skill of analysis.skills ?? []) {
    const domain = domainForSkill[skill.id]
    if (!domain || presentDomains.has(domain) || domain === 'math') continue
    const meta = LEARNING_REPORT_DOMAINS[domain]
    const accuracy = skill.accuracy
    rows.push({
      key: `aggregate:${domain}`,
      id: `aggregate:${domain}`,
      domain,
      subject: meta.subject,
      typeLabel: meta.label,
      color: meta.color,
      title: `${meta.label}・累計`,
      subtitle: '項目別IDを持たないセッション集計',
      field: '全体',
      level: '',
      entry: {},
      box: 0,
      due: false,
      status: accuracy != null && accuracy >= 0.7 ? 'stable' : 'review',
      memoryAttempts: 0,
      memoryRemembered: 0,
      memoryForgot: 0,
      memoryRate: null,
      lastJudgment: '対象外',
      testAttempts: skill.scored,
      testCorrect: skill.correct,
      testAccuracy: accuracy,
      overallAttempts: skill.scored,
      overallCorrect: skill.correct,
      overallAccuracy: accuracy,
      legacyAttempts: 0,
      hasModeBreakdown: true,
      predictedRetention: null,
      halfLifeDays: null,
      elapsedDays: null,
      gradeScore: accuracy == null ? null : Math.round(accuracy * 100),
      grade: gradeFor(accuracy == null ? null : accuracy * 100),
      confidence: skill.scored >= 20 ? 'stable' : 'growing',
      supportsMemory: meta.memory,
      supportsTest: meta.test,
      aggregateOnly: true,
    })
  }
  return rows
}

function average(values) {
  const usable = values.filter(Number.isFinite)
  return usable.length ? usable.reduce((sum, value) => sum + value, 0) / usable.length : null
}

function groupRows(rows, dimension) {
  const groups = new Map()
  for (const row of rows) {
    const subject = LEARNING_REPORT_SUBJECTS[row.subject]
    const keys = {
      subject: [row.subject, `${subject?.emoji ?? ''} ${subject?.label ?? row.subject}`, subject?.color],
      type: [row.domain, row.typeLabel, row.color],
      field: [`${row.domain}:${row.field}`, `${row.typeLabel}｜${row.field}`, row.color],
      item: [row.key, row.title, row.color],
    }
    const [id, label, color] = keys[dimension]
    const group = groups.get(id) ?? { id, label, color, dimension, rows: [] }
    group.rows.push(row)
    groups.set(id, group)
  }

  return [...groups.values()].map((group) => {
    const testAttempts = group.rows.reduce((sum, row) => sum + row.testAttempts, 0)
    const testCorrect = group.rows.reduce((sum, row) => sum + row.testCorrect, 0)
    const overallAttempts = group.rows.reduce((sum, row) => sum + row.overallAttempts, 0)
    const overallCorrect = group.rows.reduce((sum, row) => sum + row.overallCorrect, 0)
    const memoryAttempts = group.rows.reduce((sum, row) => sum + row.memoryAttempts, 0)
    const memoryRemembered = group.rows.reduce((sum, row) => sum + row.memoryRemembered, 0)
    const legacyAttempts = group.rows.reduce((sum, row) => sum + row.legacyAttempts, 0)
    const prediction = average(group.rows.map((row) => row.predictedRetention))
    const gradeScore = average(group.rows.map((row) => row.gradeScore))
    const sorted = [...group.rows].sort(
      (a, b) => Number(b.due) - Number(a.due) || a.gradeScore - b.gradeScore,
    )
    return {
      ...group,
      count: group.rows.length,
      memoryAttempts,
      memoryRemembered,
      memoryRate: memoryAttempts ? memoryRemembered / memoryAttempts : null,
      testAttempts,
      testCorrect,
      testAccuracy: testAttempts ? testCorrect / testAttempts : null,
      overallAttempts,
      overallCorrect,
      evidenceAttempts: testAttempts || overallAttempts,
      evidenceAccuracy: testAttempts
        ? testCorrect / testAttempts
        : overallAttempts
          ? overallCorrect / overallAttempts
          : null,
      legacyAttempts,
      prediction,
      due: group.rows.filter((row) => row.due).length,
      gradeScore,
      grade: gradeFor(gradeScore),
      primaryDomain: sorted[0]?.domain ?? null,
      idsByDomain: Object.fromEntries(
        Object.keys(LEARNING_REPORT_DOMAINS).map((domain) => [
          domain,
          group.rows.filter((row) => row.domain === domain && !row.aggregateOnly).map((row) => row.id),
        ]),
      ),
      weakest: sorted[0] ?? null,
      confidence: testAttempts >= 20 || memoryAttempts >= 20
        ? 'stable'
        : testAttempts + memoryAttempts + legacyAttempts >= 5
          ? 'growing'
          : 'starting',
    }
  }).sort((a, b) => b.due - a.due || (a.gradeScore ?? 101) - (b.gradeScore ?? 101))
}

export function forgettingCurveForRows(rows) {
  const memoryRows = (rows ?? []).filter(
    (row) => Number.isFinite(row.predictedRetention) && Number.isFinite(row.halfLifeDays),
  )
  return CURVE_DAYS.map((day) => ({
    day,
    retention: memoryRows.length
      ? average(memoryRows.map((row) => (
          MIN_PREDICTION
          + (row.predictedRetention - MIN_PREDICTION) * (2 ** (-day / row.halfLifeDays))
        )))
      : null,
  }))
}

/**
 * 英単語の暗記サイクル終了時に必要な情報だけを、既存SRSと分析モデルから作る。
 * 新しい保存形式は増やさず、今回の開始時段階は一時的な画面パラメータだけで比較する。
 */
export function buildVocabCompletionReport({
  srs = {},
  learningAnalytics = null,
  skillStats = {},
  wordIds = [],
  reviewIds = [],
  beforeBoxes = {},
  correct = 0,
  wrong = 0,
  dailyGoal = 20,
  now = Date.now(),
} = {}) {
  const uniqueIds = [...new Set(Array.isArray(wordIds) ? wordIds : [])]
    .filter((id) => Boolean(getWord(id)))
  const reviewSet = new Set(
    (Array.isArray(reviewIds) ? reviewIds : []).filter((id) => uniqueIds.includes(id)),
  )
  const analysis = analyzeLearning({
    learningAnalytics,
    srsStores: [srs],
    skillStats,
  })
  const rows = uniqueIds.map((id) => {
    const word = getWord(id)
    return itemRow('vocab', descriptor('vocab', word, id), srs[id], analysis, now)
  })
  const today = localDayIndex(now)
  const dueInDays = (row) => Number.isFinite(row.entry?.due)
    ? Math.max(0, Math.floor(row.entry.due - today))
    : 0
  const beforeBoxFor = (id) => {
    if (!isRecord(beforeBoxes) || !Object.hasOwn(beforeBoxes, id)) return null
    const value = beforeBoxes[id]
    return Number.isFinite(value) ? clamp(Math.floor(value), 0, MAX_SRS_BOX) : null
  }

  const todayRows = Object.entries(isRecord(srs) ? srs : {}).flatMap(([id, entry]) => {
    if (!getWord(id) || !Number.isFinite(entry?.memory?.lastAt)) return []
    return localDayIndex(entry.memory.lastAt) === today ? [{ id, entry }] : []
  })
  const goal = Number.isFinite(Number(dailyGoal)) && Number(dailyGoal) > 0
    ? Math.floor(Number(dailyGoal))
    : 20
  const todayUniqueWords = todayRows.length
  const advancedCount = rows.filter((row) => {
    const before = beforeBoxFor(row.id)
    return row.box > (before ?? 0)
  }).length
  const newCount = rows.filter((row) => beforeBoxFor(row.id) == null).length
  const newlyMasteredCount = rows.filter((row) => {
    const before = beforeBoxFor(row.id)
    return row.box >= LONG_TERM_SRS_BOX && (before == null || before < LONG_TERM_SRS_BOX)
  }).length

  const priorityRows = [...rows].sort((a, b) => {
    const aRank = reviewSet.has(a.id) ? 0 : a.due ? 1 : a.box < LONG_TERM_SRS_BOX ? 2 : 3
    const bRank = reviewSet.has(b.id) ? 0 : b.due ? 1 : b.box < LONG_TERM_SRS_BOX ? 2 : 3
    if (aRank !== bRank) return aRank - bRank
    const retentionDifference = a.predictedRetention - b.predictedRetention
    if (Math.abs(retentionDifference) > 0.0001) return retentionDifference
    return dueInDays(a) - dueInDays(b) || a.title.localeCompare(b.title, 'en')
  })
  const priorityItems = priorityRows.slice(0, 5).map((row) => ({
    id: row.id,
    word: row.title,
    meaning: row.subtitle,
    box: row.box,
    predictedRetention: row.predictedRetention,
    dueInDays: dueInDays(row),
    needsReviewNow: reviewSet.has(row.id) || row.due,
    reason: reviewSet.has(row.id)
      ? '今回「まだ」'
      : row.due
        ? '復習期限'
        : row.box < LONG_TERM_SRS_BOX
          ? `長期定着まであと${LONG_TERM_SRS_BOX - row.box}段階`
          : '維持段階',
  }))
  const schedule = [
    { id: 'now', label: '今日', matches: (days) => days === 0 },
    { id: 'tomorrow', label: '明日', matches: (days) => days === 1 },
    { id: 'soon', label: '2〜3日後', matches: (days) => [2, 3].includes(days) },
    { id: 'later', label: '4日後以降', matches: (days) => days >= 4 },
  ].map(({ matches, ...item }) => {
    const ids = rows.filter((row) => matches(dueInDays(row))).map((row) => row.id)
    return { ...item, count: ids.length, ids }
  })

  return {
    completedAt: now,
    session: {
      wordIds: uniqueIds,
      total: uniqueIds.length,
      remembered: Math.max(0, Number(correct) || 0),
      forgot: Math.max(0, Number(wrong) || 0),
      newCount,
      advancedCount,
      newlyMasteredCount,
      longTermCount: rows.filter((row) => row.box >= LONG_TERM_SRS_BOX).length,
      reviewNowCount: reviewSet.size,
    },
    today: {
      uniqueWords: todayUniqueWords,
      newWords: todayRows.filter(({ entry }) => (
        Number.isFinite(entry.firstAt) && localDayIndex(entry.firstAt) === today
      )).length,
      rememberedLatest: todayRows.filter(({ entry }) => entry.memory?.lastJudgment === 'remembered').length,
      needsReviewLatest: todayRows.filter(({ entry }) => entry.memory?.lastJudgment === 'forgot').length,
      goal,
      goalRate: clamp(todayUniqueWords / goal, 0, 1),
      goalReached: todayUniqueWords >= goal,
    },
    priorityItems,
    hiddenPriorityCount: Math.max(0, rows.length - priorityItems.length),
    schedule,
    nextReviewInDays: rows.length ? Math.min(...rows.map(dueInDays)) : null,
    curve: forgettingCurveForRows(rows),
  }
}

export function learningLaunchFor(domain, ids = [], mode = 'test', title = '') {
  const uniqueIds = [...new Set(ids)].filter(Boolean).slice(0, 24)
  if (domain === 'vocab') return {
    screen: mode === 'memory' ? 'vocabStudy' : 'vocabQuiz',
    params: {
      source: uniqueIds.length
        ? { type: 'mylist', ids: uniqueIds }
        : { type: 'level', levelId: '5' },
      title: title || '分析から学習',
      size: uniqueIds.length || 10,
    },
  }
  if (domain === 'phrases') return {
    screen: mode === 'memory' ? 'phraseStudy' : 'phraseQuiz',
    params: {
      source: uniqueIds.length
        ? { type: 'phraseList', ids: uniqueIds }
        : { type: 'phrase', kind: 'idiom' },
      title: title || '分析から学習',
      size: uniqueIds.length || 10,
      engine: 'phrase',
    },
  }
  if (domain === 'grammar') return {
    screen: 'grammarQuiz', params: { source: { type: 'grammarList', ids: uniqueIds }, title: title || '分析から復習' },
  }
  if (domain === 'listening') return {
    screen: 'listeningQuiz', params: { source: { type: 'listeningList', ids: uniqueIds }, title: title || '分析から復習', engine: 'listening' },
  }
  if (domain === 'dictation') return {
    screen: 'dictationPlay', params: { source: { type: 'dictationList', ids: uniqueIds }, title: title || '分析から復習', engine: 'dictation' },
  }
  if (domain === 'etymology') {
    const wordIds = [...new Set(uniqueIds.flatMap(
      (id) => getEtymologyPack(id)?.studyIds ?? [],
    ))]
    if (!wordIds.length) return { screen: 'roots', params: {} }
    return {
      screen: 'vocabStudy',
      params: {
        source: { type: 'deck', ids: wordIds },
        title: title || '語源から単語を覚える',
        mode: 'study',
        size: Math.min(20, wordIds.length),
        returnTo: { screen: 'roots', params: {} },
      },
    }
  }
  if (domain === 'kotenVocab') return {
    screen: mode === 'memory' ? 'kotenStudy' : 'kotenQuiz', params: { ids: uniqueIds, title: title || '分析から学習' },
  }
  if (domain === 'kotenGrammar') return {
    screen: mode === 'memory' ? 'kotenGrammarStudy' : 'kotenGrammarQuiz', params: { ids: uniqueIds, title: title || '分析から学習', size: uniqueIds.length },
  }
  if (domain === 'kotenCulture') return {
    screen: mode === 'memory' ? 'kotenCultureStudy' : 'kotenCultureQuiz', params: { ids: uniqueIds, title: title || '分析から学習', size: uniqueIds.length },
  }
  if (domain === 'kotenReading') return {
    screen: 'kotenInterpretationPrep', params: { ids: uniqueIds, title: title || '分析から古典読解' },
  }
  if (domain === 'kanbunVocab' || domain === 'kanbunGrammar' || domain === 'kanbunCulture') {
    const kanbunDomain = domain === 'kanbunVocab'
      ? 'vocab'
      : domain === 'kanbunGrammar'
        ? 'grammar'
        : 'culture'
    return {
      screen: mode === 'memory' ? 'kanbunStudy' : 'kanbunQuiz',
      params: { domain: kanbunDomain, ids: uniqueIds, title: title || '分析から漢文学習', size: uniqueIds.length },
    }
  }
  if (domain === 'kanbunKundoku') return {
    screen: 'kanbunKundokuQuiz',
    params: { ids: uniqueIds, title: title || '分析から返り点復習', size: uniqueIds.length },
  }
  if (domain === 'math') return {
    screen: uniqueIds[0] && unitById(uniqueIds[0]) ? 'mathIntro' : 'mathMap',
    params: uniqueIds[0] && unitById(uniqueIds[0]) ? { unitId: uniqueIds[0] } : {},
  }
  if (domain === 'writing') return { screen: 'writing', params: {} }
  return { screen: 'readingList', params: {} }
}

export function launchForGradeGroup(group, preferredMode = 'test') {
  if (!group) return null
  const domain = group.primaryDomain ?? group.weakest?.domain
  if (!domain) return null
  const meta = LEARNING_REPORT_DOMAINS[domain]
  const mode = preferredMode === 'memory' && meta.memory ? 'memory' : 'test'
  const ids = group.idsByDomain?.[domain] ?? (group.weakest?.id ? [group.weakest.id] : [])
  return learningLaunchFor(domain, ids, mode, group.label)
}

function bestMeasured(items, minSample = 5) {
  return [...(items ?? [])]
    .filter((item) => item.scored >= minSample && item.accuracy != null)
    .sort((a, b) => b.accuracy - a.accuracy || b.scored - a.scored)[0] ?? null
}

function buildPrescriptions(report, analysis) {
  const prescriptions = []
  const push = (item) => {
    if (!prescriptions.some((current) => current.id === item.id)) prescriptions.push(item)
  }
  const items = report.itemRows.filter((row) => !row.aggregateOnly)
  const due = items.filter((row) => row.due)
  const memoryOnly = items.filter((row) => row.memoryAttempts > 0 && row.testAttempts === 0 && row.supportsTest)
  const overconfident = items.filter(
    (row) => row.memoryRate != null && row.memoryRate >= 0.75 && row.testAttempts >= 2 && row.testAccuracy < 0.6,
  )
  const underconfident = items.filter(
    (row) => row.memoryRate != null && row.memoryRate < 0.5 && row.testAttempts >= 2 && row.testAccuracy >= 0.8,
  )
  const weakSubject = report.groups.subject.find(
    (group) => group.evidenceAttempts >= 3 && group.evidenceAccuracy < 0.65,
  )
  const weakType = report.groups.type.find(
    (group) => group.evidenceAttempts >= 3 && group.evidenceAccuracy < 0.65,
  )
  const weakField = report.groups.field.find(
    (group) => group.evidenceAttempts >= 3 && group.evidenceAccuracy < 0.65,
  )
  const strongType = report.groups.type.find(
    (group) => group.evidenceAttempts >= 5 && group.evidenceAccuracy >= 0.85,
  )
  const bestMemoryHour = bestMeasured(analysis.memoryCohortHourly)
  const measuredHours = (analysis.memoryCohortHourly ?? []).filter((item) => item.scored >= 5)
  const worstMemoryHour = [...measuredHours].sort((a, b) => a.accuracy - b.accuracy)[0]
  const bestPass = bestMeasured(analysis.memoryPasses)

  if (!items.length && !(analysis.scored > 0)) push({
    id: 'measure', priority: 1, angle: '測定', scope: '全体',
    title: 'まず暗記10項目と確認テストを記録',
    evidence: '項目別の学習履歴がまだありません。',
    action: '英単語を10語暗記し、同じ10語をテストして基準値を作ります。',
    launch: learningLaunchFor('vocab', [], 'memory', '最初の測定'),
  })
  if (due.length) push({
    id: 'due', priority: 1, angle: '忘却', scope: `${due.length}項目`,
    title: '期限を迎えた項目から想起',
    evidence: `定着予測またはSRS期限で、${due.length}項目が復習時期です。`,
    action: '答えを見る前に思い出し、1回の上限を20項目にして処理します。',
    launch: launchForGradeGroup(groupRows(due, 'type')[0], 'memory'),
  })
  if (memoryOnly.length) push({
    id: 'memory-only', priority: 1, angle: '暗記→テスト', scope: `${memoryOnly.length}項目`,
    title: '暗記判定をテストで照合',
    evidence: `暗記済みで採点テストがまだない項目が${memoryOnly.length}件あります。`,
    action: '表示を見ずに答えるテストで、自己判定と実際の想起を照合します。',
    launch: launchForGradeGroup(groupRows(memoryOnly, 'type')[0], 'test'),
  })
  if (overconfident.length) push({
    id: 'overconfidence', priority: 1, angle: '自己判定', scope: `${overconfident.length}項目`,
    title: '「覚えた」を無答えテストで再確認',
    evidence: `自己判定75%以上に対し、テスト60%未満の項目が${overconfident.length}件あります。`,
    action: '意味を隠した状態で答えてから、誤答だけを短く再暗記します。',
    launch: launchForGradeGroup(groupRows(overconfident, 'type')[0], 'test'),
  })
  if (underconfident.length) push({
    id: 'underconfidence', priority: 3, angle: '自己判定', scope: `${underconfident.length}項目`,
    title: '正解できる項目は間隔を広げる',
    evidence: `自己判定50%未満でも、テスト80%以上の項目が${underconfident.length}件あります。`,
    action: '同日反復を減らし、翌日以降の想起へ移して学習時間を節約します。',
    launch: launchForGradeGroup(groupRows(underconfident, 'type')[0], 'test'),
  })
  if (weakSubject) push({
    id: `subject:${weakSubject.id}`, priority: 1, angle: '科目', scope: weakSubject.label,
    title: `${weakSubject.label}の最弱分野から立て直す`,
    evidence: `科目内の採点・旧履歴${weakSubject.evidenceAttempts}回で再現率${Math.round(weakSubject.evidenceAccuracy * 100)}%です。`,
    action: '科目全体を一度にやり直さず、成績表で最も弱い種類の最大12項目に絞ります。',
    launch: launchForGradeGroup(weakSubject, 'memory'),
  })
  if (weakField) push({
    id: `field:${weakField.id}`, priority: 1, angle: '分野', scope: weakField.label,
    title: `${weakField.label}を小単位で補強`,
    evidence: `採点・旧履歴${weakField.evidenceAttempts}回で再現率${Math.round(weakField.evidenceAccuracy * 100)}%です。`,
    action: '弱い項目を最大12件に絞り、暗記可能なら暗記後にテストします。',
    launch: launchForGradeGroup(weakField, 'memory'),
  })
  if (weakType) push({
    id: `type:${weakType.id}`, priority: 2, angle: '種類', scope: weakType.label,
    title: `${weakType.label}の基礎を優先`,
    evidence: `種類別の採点・旧履歴で再現率${Math.round(weakType.evidenceAccuracy * 100)}%です。`,
    action: '1セッションだけ取り組み、終了後に同じ成績表で改善を確認します。',
    launch: launchForGradeGroup(weakType, 'test'),
  })
  if (
    bestMemoryHour && worstMemoryHour
    && bestMemoryHour.hour !== worstMemoryHour.hour
    && bestMemoryHour.accuracy - worstMemoryHour.accuracy >= 0.15
  ) push({
    id: 'time-effect', priority: 2, angle: '時間帯', scope: `${bestMemoryHour.hour}時台`,
    title: `${bestMemoryHour.hour}時台に新規暗記を寄せる`,
    evidence: `その時間に暗記した語句の後続テストは${Math.round(bestMemoryHour.accuracy * 100)}%（n=${bestMemoryHour.scored}）で、最低時間帯より15ポイント以上高い結果です。`,
    action: '新規暗記は得意時刻、復習は都合のよい時刻に分け、2週間後に再比較します。',
    launch: learningLaunchFor('vocab', [], 'memory', '得意時間の暗記'),
  })
  if (bestPass) push({
    id: 'pass-effect', priority: 2, angle: '周回数', scope: bestPass.label,
    title: `${bestPass.label}を暗記の比較基準にする`,
    evidence: `${bestPass.label}後のテストが${Math.round(bestPass.accuracy * 100)}%（n=${bestPass.scored}）で、現在もっとも高い観測値です。`,
    action: '全項目を同じ回数に固定せず、正答できた項目は間隔を広げ、弱い項目だけ追加します。',
    launch: learningLaunchFor('vocab', [], 'memory', '周回数を調整'),
  })
  if ((analysis.activeDays ?? 0) > 0 && (analysis.averageInputsPerActiveDay ?? 0) > 35) push({
    id: 'session-load', priority: 3, angle: '活動量', scope: '学習日',
    title: '一日の学習を2回に分散',
    evidence: `記録日の平均入力が${Math.round(analysis.averageInputsPerActiveDay)}回です。`,
    action: '同じ総量でも朝夕など2回に分け、翌日の想起率で比較します。',
    launch: null,
  })
  if (!bestMemoryHour && analysis.activity?.memory?.scored > 0) push({
    id: 'hour-sample', priority: 3, angle: '時間帯', scope: '24時間計',
    title: '暗記時刻ごとに後続テストを5回集める',
    evidence: '暗記時刻と後日のテストを結ぶ標本が、時間帯ごとに5件未満です。',
    action: '朝・昼・夜の2〜3条件で同程度の項目を暗記し、後で同じ方法でテストします。',
    launch: null,
  })
  if (strongType) push({
    id: `maintain:${strongType.id}`, priority: 3, angle: '得意維持', scope: strongType.label,
    title: `${strongType.label}は間隔を広げて維持`,
    evidence: `採点・旧履歴${strongType.evidenceAttempts}回で再現率${Math.round(strongType.evidenceAccuracy * 100)}%です。`,
    action: '同日反復を増やさず、期限到来時の短い確認だけにして弱点へ時間を移します。',
    launch: launchForGradeGroup(strongType, 'test'),
  })

  return prescriptions
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 8)
}

export function buildLearningAnalyticsReport(state = {}, analysis = {}, now = Date.now()) {
  const srsRows = collectSrsRows(state, analysis, now)
  const itemRows = [...srsRows, ...supplementalRows(state, analysis, now, srsRows)]
  const groups = {
    subject: groupRows(itemRows, 'subject'),
    type: groupRows(itemRows, 'type'),
    field: groupRows(itemRows, 'field'),
    item: groupRows(itemRows, 'item'),
  }
  const report = {
    itemRows,
    memoryItemRows: srsRows,
    groups,
    totals: {
      items: srsRows.length,
      memoryAttempts: srsRows.reduce((sum, row) => sum + row.memoryAttempts, 0),
      testAttempts: srsRows.reduce((sum, row) => sum + row.testAttempts, 0),
      legacyAttempts: srsRows.reduce((sum, row) => sum + row.legacyAttempts, 0),
      due: srsRows.filter((row) => row.due).length,
      stable: srsRows.filter((row) => row.status === 'stable').length,
    },
  }
  report.prescriptions = buildPrescriptions(report, analysis)
  return report
}

export { CURVE_DAYS, gradeFor }
