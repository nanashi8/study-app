// 入試演習の図の座標を作る小さな道具（図は src/components/MathExamFigure.jsx が描く）。

const rad = (deg) => (deg * Math.PI) / 180

/** 中心 (cx, cy)・半径 r の円周上で、角 deg（度、x 軸の正の向きから反時計回り）の点。 */
export const polar = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))]

/** 中心 (cx, cy)・半径 r の弧を、角 from から to まで細かく区切った点の列（ぬりつぶす形の輪郭に使う）。 */
export const arcPts = (cx, cy, r, from, to, steps = 32) => Array.from(
  { length: steps + 1 },
  (_, k) => polar(cx, cy, r, from + ((to - from) * k) / steps),
)

/** 2点の中点。 */
export const mid = ([x1, y1], [x2, y2]) => [(x1 + x2) / 2, (y1 + y2) / 2]

/** 点 p を点 q の方へ t の割合だけ進めた点（t=0 で p、t=1 で q）。 */
export const lerp = ([x1, y1], [x2, y2], t) => [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]

/** 点 p から角 degP（度）の向きへのびる半直線と、点 q から角 degQ の向きへのびる半直線の交点。 */
export function rayMeet([px, py], degP, [qx, qy], degQ) {
  const [ux, uy] = [Math.cos(rad(degP)), Math.sin(rad(degP))]
  const [vx, vy] = [Math.cos(rad(degQ)), Math.sin(rad(degQ))]
  const det = vx * uy - ux * vy
  const s = (vx * (qy - py) - vy * (qx - px)) / det
  return [px + s * ux, py + s * uy]
}

/** 箱ひげ図1本（高さ y の位置に、最小値・第1四分位数・中央値・第3四分位数・最大値）の線と箱。 */
export function boxplot(y, [min, q1, med, q3, max], half = 0.3) {
  return {
    polygons: [{ pts: [[q1, y - half], [q3, y - half], [q3, y + half], [q1, y + half]], fill: true }],
    segments: [
      [[min, y], [q1, y]], [[q3, y], [max, y]], [[med, y - half], [med, y + half]],
      [[min, y - half / 2], [min, y + half / 2]], [[max, y - half / 2], [max, y + half / 2]],
    ],
  }
}

/** 直線 AB と直線 CD の交点。 */
export function lineMeet([ax, ay], [bx, by], [cx, cy], [dx, dy]) {
  const [rx, ry] = [bx - ax, by - ay]
  const [sx, sy] = [dx - cx, dy - cy]
  const det = rx * sy - ry * sx
  const t = ((cx - ax) * sy - (cy - ay) * sx) / det
  return [ax + t * rx, ay + t * ry]
}

/** 3点を通る円の中心。 */
export function circumcenter([ax, ay], [bx, by], [cx, cy]) {
  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
  const a2 = ax * ax + ay * ay
  const b2 = bx * bx + by * by
  const c2 = cx * cx + cy * cy
  return [
    (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d,
    (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d,
  ]
}
