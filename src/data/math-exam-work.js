// ── 数学の入試演習の計算の経過 ─────────────────────────────────────────
// 全問を、手で計算せずに、計算の経過を1行ずつ穴埋めして解く。最後の行の空所が解答欄の正解に行き着く。
// 形は src/lib/mathWork.js の冒頭を参照。単元の学年ごとのファイルに分ける。
import { normalizeWork } from '../lib/mathWork.js'
import { MATH_EXAM_WORK_JUNIOR1 } from './math-exam-work/junior1.js'
import { MATH_EXAM_WORK_JUNIOR2 } from './math-exam-work/junior2.js'
import { MATH_EXAM_WORK_JUNIOR3 } from './math-exam-work/junior3.js'
import { MATH_EXAM_WORK_MATH1 } from './math-exam-work/math1.js'
import { MATH_EXAM_WORK_MATHA } from './math-exam-work/mathA.js'
import { MATH_EXAM_WORK_MATH2 } from './math-exam-work/math2.js'
import { MATH_EXAM_WORK_MATHB } from './math-exam-work/mathB.js'
import { MATH_EXAM_WORK_MATHC } from './math-exam-work/mathC.js'
import { MATH_EXAM_WORK_MATH3 } from './math-exam-work/math3.js'

export const MATH_EXAM_WORK_ROWS = Object.freeze({
  ...MATH_EXAM_WORK_JUNIOR1,
  ...MATH_EXAM_WORK_JUNIOR2,
  ...MATH_EXAM_WORK_JUNIOR3,
  ...MATH_EXAM_WORK_MATH1,
  ...MATH_EXAM_WORK_MATHA,
  ...MATH_EXAM_WORK_MATH2,
  ...MATH_EXAM_WORK_MATHB,
  ...MATH_EXAM_WORK_MATHC,
  ...MATH_EXAM_WORK_MATH3,
})

const BY_ID = new Map(Object.entries(MATH_EXAM_WORK_ROWS).map(([id, rows]) => [id, Object.freeze(normalizeWork(rows))]))

/** 入試演習の計算の経過（無ければ空の配列）。 */
export const mathExamWork = (problemId) => BY_ID.get(problemId) ?? []
