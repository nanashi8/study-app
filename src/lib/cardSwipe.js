// 左右スワイプの判定。暗記カードの前後移動と、一覧の行の記録で同じ手ざわりにする。

// 置いた指がこの距離を動くまでは向きを決めない（タップのぶれを拾わない）。
export const SWIPE_AXIS_LOCK_DISTANCE = 10
// ゆっくり引いて離したとき、スワイプと決める横の距離。
export const CARD_SWIPE_MIN_DISTANCE = 40
// 素早くはじいたときは、この距離からスワイプと決める。
export const SWIPE_FLICK_MIN_DISTANCE = 16
// はじいたと見なす速さ（px/ms）。離す直前 SWIPE_VELOCITY_WINDOW_MS の動きで測る。
export const SWIPE_FLICK_VELOCITY = 0.3
export const SWIPE_VELOCITY_WINDOW_MS = 100

function readPoint(point) {
  const x = Number(point?.x)
  const y = Number(point?.y)
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null
  return { x, y, t: Number(point?.t) }
}

/** 指（またはマウス）を置いた位置から、1回分の動きの記録を始める。 */
export function beginSwipeGesture(point) {
  const start = readPoint(point)
  if (!start) return null
  return { x: start.x, y: start.y, axis: null, samples: [start] }
}

/**
 * 動いた位置を記録し、決まっていれば向き（横 'x'・縦 'y'）を返す。
 * 向きは遊びを越えた最初の動きで決め、そのあと斜めや縦にずれても変えない。
 * 親指で弧を描くように動かしても、横に引き始めたスワイプを取りこぼさないため。
 */
export function moveSwipeGesture(gesture, point) {
  const current = readPoint(point)
  if (!gesture || !current) return gesture?.axis ?? null
  if (!gesture.axis) {
    const deltaX = current.x - gesture.x
    const deltaY = current.y - gesture.y
    if (Math.hypot(deltaX, deltaY) >= SWIPE_AXIS_LOCK_DISTANCE) {
      gesture.axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y'
    }
  }
  const { samples } = gesture
  samples.push(current)
  // 速さは離す直前の動きで測るので、窓より古い記録は1つだけ残して捨てる。
  while (samples.length > 2 && samples[1].t < current.t - SWIPE_VELOCITY_WINDOW_MS) {
    samples.shift()
  }
  return gesture.axis
}

/** 横スワイプと決まっていれば、置いた位置からの横の移動量を返す。 */
export function swipeGestureOffset(gesture) {
  if (gesture?.axis !== 'x') return 0
  return gesture.samples[gesture.samples.length - 1].x - gesture.x
}

// 離す直前の横の速さ（px/ms）。時刻が分からない記録では 0。
function releaseVelocity(samples) {
  const last = samples[samples.length - 1]
  if (!Number.isFinite(last?.t)) return 0
  let from = samples.findIndex((sample) => sample.t >= last.t - SWIPE_VELOCITY_WINDOW_MS)
  // 窓の中に離した点しかない（止めてから離した）ときは、1つ前の点から測る。
  if (from === samples.length - 1 && from > 0) from -= 1
  const elapsed = last.t - samples[from].t
  return elapsed > 0 ? (last.x - samples[from].x) / elapsed : 0
}

/**
 * 離した位置で判定する。'next'＝左へ、'previous'＝右へ、スワイプでなければ null。
 * 横へ CARD_SWIPE_MIN_DISTANCE 引いたか、短くても素早くはじいたらスワイプ。
 * 引いたあと戻す向きへはじいたときは、やめたと見なす。
 */
export function finishSwipeGesture(gesture, point) {
  if (!gesture) return null
  moveSwipeGesture(gesture, point)
  if (gesture.axis !== 'x') return null
  const deltaX = swipeGestureOffset(gesture)
  const distance = Math.abs(deltaX)
  if (!distance) return null
  const forwardVelocity = releaseVelocity(gesture.samples) * Math.sign(deltaX)
  if (forwardVelocity <= -SWIPE_FLICK_VELOCITY) return null
  if (
    distance < CARD_SWIPE_MIN_DISTANCE
    && (distance < SWIPE_FLICK_MIN_DISTANCE || forwardVelocity < SWIPE_FLICK_VELOCITY)
  ) {
    return null
  }
  return deltaX < 0 ? 'next' : 'previous'
}

/** 置いた位置と離した位置の2点だけで判定する。 */
export function cardSwipeDirection(start, end) {
  return finishSwipeGesture(beginSwipeGesture(start), end)
}

export function cardIndexAfterSwipe(index, total, direction) {
  if (!Number.isInteger(index) || !Number.isInteger(total) || total <= 0) return index
  if (direction === 'next') return Math.min(total - 1, index + 1)
  if (direction === 'previous') return Math.max(0, index - 1)
  return index
}
