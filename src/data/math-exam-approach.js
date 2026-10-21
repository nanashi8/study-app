// ── 数学の入試演習の「考え方で解く」 ───────────────────────────────────
// 入試演習の全問に、方針を問う3択の段を持つ。形と使い方は src/lib/mathExamApproach.js の冒頭を参照。
import { normalizeApproach } from '../lib/mathExamApproach.js'
import { MATH_EXAM_APPROACH_JUNIOR1 } from './math-exam-approach/junior1.js'
import { MATH_EXAM_APPROACH_JUNIOR2 } from './math-exam-approach/junior2.js'
import { MATH_EXAM_APPROACH_JUNIOR3 } from './math-exam-approach/junior3.js'
import { MATH_EXAM_APPROACH_MATH1 } from './math-exam-approach/math1.js'
import { MATH_EXAM_APPROACH_MATHA } from './math-exam-approach/mathA.js'
import { MATH_EXAM_APPROACH_MATH2 } from './math-exam-approach/math2.js'
import { MATH_EXAM_APPROACH_MATHB } from './math-exam-approach/mathB.js'
import { MATH_EXAM_APPROACH_MATHC } from './math-exam-approach/mathC.js'
import { MATH_EXAM_APPROACH_MATH3 } from './math-exam-approach/math3.js'

export const MATH_EXAM_APPROACH_ROWS = Object.freeze({
  ...MATH_EXAM_APPROACH_JUNIOR1,
  ...MATH_EXAM_APPROACH_JUNIOR2,
  ...MATH_EXAM_APPROACH_JUNIOR3,
  ...MATH_EXAM_APPROACH_MATH1,
  ...MATH_EXAM_APPROACH_MATHA,
  ...MATH_EXAM_APPROACH_MATH2,
  ...MATH_EXAM_APPROACH_MATHB,
  ...MATH_EXAM_APPROACH_MATHC,
  ...MATH_EXAM_APPROACH_MATH3,
})

const BY_ID = new Map(Object.entries(MATH_EXAM_APPROACH_ROWS).map(([id, rows]) => [id, Object.freeze(normalizeApproach(rows))]))

/** 問題の「考え方で解く」の段（無ければ空の配列）。 */
export const mathExamApproach = (problemId) => BY_ID.get(problemId) ?? []
