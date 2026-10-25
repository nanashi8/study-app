// ── 数学の誘導問題（基本の型）の計算の経過 ─────────────────────────────
// 全問を、手で計算せずに、計算の経過を1行ずつ穴埋めして解く。形は src/lib/mathWork.js の冒頭を参照。学年ごとのファイルに分ける。
import { normalizeWork } from '../lib/mathWork.js'
import { MATH_GUIDED_WORK_JUNIOR1 } from './math-guided-work/junior1.js'
import { MATH_GUIDED_WORK_JUNIOR2 } from './math-guided-work/junior2.js'
import { MATH_GUIDED_WORK_JUNIOR3 } from './math-guided-work/junior3.js'
import { MATH_GUIDED_WORK_MATHIA } from './math-guided-work/mathIA.js'
import { MATH_GUIDED_WORK_SENIOR } from './math-guided-work/senior.js'

export const MATH_GUIDED_WORK_ROWS = Object.freeze({
  ...MATH_GUIDED_WORK_JUNIOR1,
  ...MATH_GUIDED_WORK_JUNIOR2,
  ...MATH_GUIDED_WORK_JUNIOR3,
  ...MATH_GUIDED_WORK_MATHIA,
  ...MATH_GUIDED_WORK_SENIOR,
})

const BY_ID = new Map(Object.entries(MATH_GUIDED_WORK_ROWS).map(([id, rows]) => [id, Object.freeze(normalizeWork(rows))]))

/** 誘導問題の計算の経過（無ければ空の配列）。 */
export const mathGuidedWork = (problemId) => BY_ID.get(problemId) ?? []
