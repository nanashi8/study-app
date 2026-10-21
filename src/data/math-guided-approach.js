// ── 数学の誘導問題（基本の型）の方針の段 ───────────────────────────────
// 全問を、計算せずに解き方の方針を3択で選ぶ段で解く。1段目は方針の確認、2段目からは解き方の手順。
// 形は入試演習と同じ（src/lib/mathExamApproach.js の冒頭を参照）。学年ごとのファイルに分ける。
import { normalizeApproach } from '../lib/mathExamApproach.js'
import { MATH_GUIDED_APPROACH_JUNIOR1 } from './math-guided-approach/junior1.js'
import { MATH_GUIDED_APPROACH_JUNIOR2 } from './math-guided-approach/junior2.js'
import { MATH_GUIDED_APPROACH_JUNIOR3 } from './math-guided-approach/junior3.js'
import { MATH_GUIDED_APPROACH_MATHIA } from './math-guided-approach/mathIA.js'
import { MATH_GUIDED_APPROACH_SENIOR } from './math-guided-approach/senior.js'

export const MATH_GUIDED_APPROACH_ROWS = Object.freeze({
  ...MATH_GUIDED_APPROACH_JUNIOR1,
  ...MATH_GUIDED_APPROACH_JUNIOR2,
  ...MATH_GUIDED_APPROACH_JUNIOR3,
  ...MATH_GUIDED_APPROACH_MATHIA,
  ...MATH_GUIDED_APPROACH_SENIOR,
})

const BY_ID = new Map(Object.entries(MATH_GUIDED_APPROACH_ROWS).map(([id, rows]) => [id, Object.freeze(normalizeApproach(rows))]))

/** 誘導問題の方針の段（無ければ空の配列）。 */
export const mathGuidedApproach = (problemId) => BY_ID.get(problemId) ?? []
