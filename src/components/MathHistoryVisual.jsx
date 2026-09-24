import { NUMBER_SCENES } from './math-history/number-scenes.jsx'
import { SHAPE_SCENES } from './math-history/shape-scenes.jsx'
import { CHANGE_SCENES } from './math-history/change-scenes.jsx'
import { DATA_SCENES } from './math-history/data-scenes.jsx'

// 数学の歴史の話の「動かしてみよう」の図。話のデータの visual.scene で図を選び、
// 操作の値（values）に合わせて描き直す。図は src/components/math-history/ に分野ごとに置く。

export const MATH_HISTORY_SCENES = Object.freeze({
  ...NUMBER_SCENES,
  ...SHAPE_SCENES,
  ...CHANGE_SCENES,
  ...DATA_SCENES,
})

export function MathHistoryVisual({ visual, values, color, label }) {
  const Scene = MATH_HISTORY_SCENES[visual?.scene]
  if (!Scene) return null
  return <Scene values={values} color={color} markerId={`math-history-${visual.scene}`} label={label} />
}
