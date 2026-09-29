// ── 数学の入試演習 ─────────────────────────────────────────────────────
// 単元ごとに、入試でよく出る問題の型（出題パターン）と、基礎・標準の問題を持つ。
// 中学の単元は高校入試、高校の単元は大学入試の問題。どれも入試によく出る型をもとに作った問題。
// 問題の形は src/lib/mathExam.js の冒頭を参照。問題の正解は tests/math-exam-verify/ が問題文の条件から計算し直して確かめる。
import { MATH_UNITS, unitById } from './math.js'
import { MATH_EXAM_JUNIOR1 } from './math-exam/junior1.js'
import { MATH_EXAM_JUNIOR2 } from './math-exam/junior2.js'
import { MATH_EXAM_JUNIOR3 } from './math-exam/junior3.js'
import { MATH_EXAM_MATH1 } from './math-exam/math1.js'
import { MATH_EXAM_MATHA } from './math-exam/mathA.js'
import { MATH_EXAM_MATH2 } from './math-exam/math2.js'
import { MATH_EXAM_MATHB } from './math-exam/mathB.js'
import { MATH_EXAM_MATHC } from './math-exam/mathC.js'
import { MATH_EXAM_MATH3 } from './math-exam/math3.js'

export { MATH_EXAM_QUIZ_DOMAIN } from '../lib/mathExam.js'

const SOURCES = [
  MATH_EXAM_JUNIOR1,
  MATH_EXAM_JUNIOR2,
  MATH_EXAM_JUNIOR3,
  MATH_EXAM_MATH1,
  MATH_EXAM_MATHA,
  MATH_EXAM_MATH2,
  MATH_EXAM_MATHB,
  MATH_EXAM_MATHC,
  MATH_EXAM_MATH3,
]

// 単元 → 出題パターン（[{ id, title }]）。
export const MATH_EXAM_PATTERNS = Object.freeze(Object.assign({}, ...SOURCES.map((source) => source.patterns)))

// 単元の並び（math.js の MATH_UNITS の順）→ 単元の中は基礎 → 標準、書いた順。
const UNIT_ORDER = new Map(MATH_UNITS.map((unit, index) => [unit.id, index]))
const LEVEL_ORDER = { basic: 0, standard: 1 }
export const MATH_EXAM_PROBLEMS = Object.freeze(
  SOURCES.flatMap((source) => source.problems)
    .map((problem, index) => ({ problem, index }))
    .sort((a, b) => (
      (UNIT_ORDER.get(a.problem.unit) ?? 999) - (UNIT_ORDER.get(b.problem.unit) ?? 999)
      || LEVEL_ORDER[a.problem.level] - LEVEL_ORDER[b.problem.level]
      || a.index - b.index
    ))
    .map(({ problem }) => Object.freeze(problem)),
)

const BY_ID = new Map(MATH_EXAM_PROBLEMS.map((problem) => [problem.id, problem]))
export const mathExamProblem = (id) => BY_ID.get(id) ?? null

export const MATH_EXAM_LEVELS = Object.freeze({
  basic: Object.freeze({ id: 'basic', label: '基礎', note: '入試の小問。公式や基本の考え方を1〜2段で使う', color: '#0369a1' }),
  standard: Object.freeze({ id: 'standard', label: '標準', note: '入試の大問でよく出る型。いくつかの考えを組み合わせる', color: '#6d28d9' }),
})
export const MATH_EXAM_LEVEL_FILTERS = Object.freeze([
  { id: 'all', label: 'すべて' },
  { id: 'basic', label: '基礎' },
  { id: 'standard', label: '標準' },
])

// 入試の種類と、単元を混ぜて解く範囲。
const JUNIOR_GRADES = ['中1', '中2', '中3']
export const MATH_EXAM_KINDS = Object.freeze([
  Object.freeze({ id: 'high', title: '高校入試', note: '中学の数学（中1〜中3）', emoji: '🏫' }),
  Object.freeze({ id: 'univ', title: '大学入試', note: '高校の数学（数I〜数III・A〜C）', emoji: '🎓' }),
])
export const MATH_EXAM_SCOPES = Object.freeze([
  Object.freeze({ id: 'high', kind: 'high', title: '中学の全範囲', grades: Object.freeze(['中1', '中2', '中3']) }),
  Object.freeze({ id: 'ia', kind: 'univ', title: '数学I・A', grades: Object.freeze(['数I', '数A']) }),
  Object.freeze({ id: 'iibc', kind: 'univ', title: '数学II・B・C', grades: Object.freeze(['数II', '数B', '数C']) }),
  Object.freeze({ id: 'iii', kind: 'univ', title: '数学III', grades: Object.freeze(['数III']) }),
])

/** 単元の入試の種類（中学は高校入試、高校は大学入試）。 */
export const mathExamKindOf = (unitId) => {
  const unit = unitById(unitId)
  if (!unit) return null
  return JUNIOR_GRADES.includes(unit.grade) ? 'high' : 'univ'
}
export const mathExamKind = (kindId) => MATH_EXAM_KINDS.find((kind) => kind.id === kindId) ?? null
export const mathExamScope = (scopeId) => MATH_EXAM_SCOPES.find((scope) => scope.id === scopeId) ?? null
export const scopesForKind = (kindId) => MATH_EXAM_SCOPES.filter((scope) => scope.kind === kindId)

const matchesLevel = (problem, level) => !level || level === 'all' || problem.level === level

/** 単元の問題（基礎 → 標準）。level で絞れる。 */
export const mathExamProblemsForUnit = (unitId, level = 'all') => MATH_EXAM_PROBLEMS
  .filter((problem) => problem.unit === unitId && matchesLevel(problem, level))

/** 範囲（単元を混ぜて解く）の問題。 */
export function mathExamProblemsForScope(scopeId, level = 'all') {
  const scope = mathExamScope(scopeId)
  if (!scope) return []
  const units = new Set(MATH_UNITS.filter((unit) => scope.grades.includes(unit.grade)).map((unit) => unit.id))
  return MATH_EXAM_PROBLEMS.filter((problem) => units.has(problem.unit) && matchesLevel(problem, level))
}

/** 入試の種類の問題。 */
export const mathExamProblemsForKind = (kindId, level = 'all') => scopesForKind(kindId)
  .flatMap((scope) => mathExamProblemsForScope(scope.id, level))

/** 入試の種類の単元（学年ごと）。 */
export function mathExamUnitsByGrade(kindId) {
  const grades = kindId === 'high' ? JUNIOR_GRADES : ['数I', '数A', '数II', '数B', '数C', '数III']
  return grades.map((grade) => ({ grade, units: MATH_UNITS.filter((unit) => unit.grade === grade) }))
}

/** 単元の出題パターン。 */
export const mathExamPatternsForUnit = (unitId) => MATH_EXAM_PATTERNS[unitId] ?? []
export const mathExamPattern = (unitId, patternId) => mathExamPatternsForUnit(unitId).find((pattern) => pattern.id === patternId) ?? null
