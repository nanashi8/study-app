// 入試演習の正解を、問題文の条件から計算し直すための道具。
// 教材の答え（problem.boxes）を見ずに、ここの計算だけで欄の値を出す。

export const gcd = (a, b) => {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) [x, y] = [y, x % y]
  return x
}
export const lcm = (a, b) => Math.abs(a * b) / gcd(a, b)

/** 分数（既約・分母は正）。 */
export class Q {
  constructor(n, d = 1) {
    if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) throw new Error(`分数にできない: ${n}/${d}`)
    const sign = d < 0 ? -1 : 1
    const g = gcd(n, d) || 1
    this.n = (sign * n) / g
    this.d = (sign * d) / g
    if (Object.is(this.n, -0)) this.n = 0
  }
  static of(value) {
    if (value instanceof Q) return value
    if (Number.isInteger(value)) return new Q(value, 1)
    throw new Error(`整数でも分数でもない: ${value}`)
  }
  add(other) { const o = Q.of(other); return new Q(this.n * o.d + o.n * this.d, this.d * o.d) }
  sub(other) { const o = Q.of(other); return new Q(this.n * o.d - o.n * this.d, this.d * o.d) }
  mul(other) { const o = Q.of(other); return new Q(this.n * o.n, this.d * o.d) }
  div(other) { const o = Q.of(other); return new Q(this.n * o.d, this.d * o.n) }
  neg() { return new Q(-this.n, this.d) }
  pow(k) { let r = new Q(1); for (let i = 0; i < k; i += 1) r = r.mul(this); return r }
  eq(other) { const o = Q.of(other); return this.n === o.n && this.d === o.d }
  lt(other) { const o = Q.of(other); return this.n * o.d < o.n * this.d }
  get value() { return this.n / this.d }
  get isInteger() { return this.d === 1 }
  toInt() { if (this.d !== 1) throw new Error(`整数でない: ${this.n}/${this.d}`); return this.n }
}
export const q = (n, d = 1) => new Q(n, d)

/** √n を a√b（b はできるだけ小さい自然数）に。[a, b] を返す。 */
export function simplifySqrt(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error(`√ の中が自然数でない: ${n}`)
  let outside = 1
  let inside = n
  for (let k = 2; k * k <= inside; k += 1) {
    while (inside % (k * k) === 0) {
      inside /= k * k
      outside *= k
    }
  }
  return [outside, inside]
}
export const isSquareFree = (n) => simplifySqrt(n)[0] === 1

export const near = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b))
export function assertNear(a, b, message, eps = 1e-6) {
  if (!near(a, b, eps)) throw new Error(`${message}: ${a} ≠ ${b}`)
}
export function assert(condition, message) {
  if (!condition) throw new Error(message)
}

/** 数値で求めた値を整数に（整数でなければ失敗）。 */
export function int(value, message = '整数にならない') {
  const rounded = Math.round(value)
  if (!near(value, rounded, 1e-9)) throw new Error(`${message}: ${value}`)
  return Object.is(rounded, -0) ? 0 : rounded
}

export const dist = ([x1, y1], [x2, y2]) => Math.hypot(x2 - x1, y2 - y1)
/** 点 at を頂点とする角 ∠p-at-q（度）。 */
export function angleDeg(at, p, q2) {
  const a = Math.atan2(p[1] - at[1], p[0] - at[0])
  const b = Math.atan2(q2[1] - at[1], q2[0] - at[0])
  let d = Math.abs(a - b) * (180 / Math.PI)
  if (d > 180) d = 360 - d
  return d
}
export const polygonArea = (pts) => Math.abs(pts.reduce((sum, [x, y], i) => {
  const [nx, ny] = pts[(i + 1) % pts.length]
  return sum + x * ny - nx * y
}, 0)) / 2

export const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1))
export const nPr = (n, r) => (r < 0 || r > n ? 0 : factorial(n) / factorial(n - r))
export const nCr = (n, r) => (r < 0 || r > n ? 0 : Math.round(factorial(n) / (factorial(r) * factorial(n - r))))

/** 配列の直積（総当たり）。 */
export function product(...lists) {
  return lists.reduce((acc, list) => acc.flatMap((prefix) => list.map((item) => [...prefix, item])), [[]])
}
/** 順列（k 個を並べる）。 */
export function permutations(list, k = list.length) {
  if (k === 0) return [[]]
  return list.flatMap((item, index) => permutations([...list.slice(0, index), ...list.slice(index + 1)], k - 1).map((rest) => [item, ...rest]))
}
/** 組合せ（k 個を選ぶ）。 */
export function combinations(list, k) {
  if (k === 0) return [[]]
  if (list.length < k) return []
  const [first, ...rest] = list
  return [...combinations(rest, k - 1).map((combo) => [first, ...combo]), ...combinations(rest, k)]
}
export const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i)
export const sum = (list) => list.reduce((a, b) => a + b, 0)
export const mean = (list) => sum(list) / list.length
export function median(list) {
  const sorted = [...list].sort((a, b) => a - b)
  const m = sorted.length
  return m % 2 ? sorted[(m - 1) / 2] : (sorted[m / 2 - 1] + sorted[m / 2]) / 2
}
export function mode(list) {
  const counts = new Map()
  for (const value of list) counts.set(value, (counts.get(value) ?? 0) + 1)
  const top = Math.max(...counts.values())
  const modes = [...counts].filter(([, c]) => c === top).map(([v]) => v)
  if (modes.length !== 1) throw new Error(`最頻値が1つに決まらない: ${modes}`)
  return modes[0]
}
/** 四分位数（中学・高校の教科書の方法：前半・後半の中央値）。 */
export function quartiles(list) {
  const sorted = [...list].sort((a, b) => a - b)
  const m = sorted.length
  const half = Math.floor(m / 2)
  const lower = sorted.slice(0, half)
  const upper = sorted.slice(m % 2 ? half + 1 : half)
  return [median(lower), median(sorted), median(upper)]
}

/** シンプソン則の数値積分。 */
export function integrate(f, a, b, n = 2000) {
  const h = (b - a) / n
  let s = f(a) + f(b)
  for (let i = 1; i < n; i += 1) s += (i % 2 ? 4 : 2) * f(a + i * h)
  return (s * h) / 3
}
/** 数値微分（中心差分）。 */
export const derivative = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h)
/** 区間 [a, b] で f の符号が変わる点（二分法）。 */
export function bisect(f, a, b, iterations = 200) {
  let lo = a
  let hi = b
  let flo = f(lo)
  if (flo === 0) return lo
  for (let i = 0; i < iterations; i += 1) {
    const midX = (lo + hi) / 2
    const fm = f(midX)
    if (fm === 0) return midX
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = midX
      flo = fm
    } else hi = midX
  }
  return (lo + hi) / 2
}
/** 区間を細かく区切って、f の実数解をすべて探す。 */
export function realRoots(f, a, b, steps = 20000) {
  const roots = []
  let prevX = a
  let prevY = f(a)
  for (let i = 1; i <= steps; i += 1) {
    const x = a + ((b - a) * i) / steps
    const y = f(x)
    if (prevY === 0) roots.push(prevX)
    else if (Math.sign(y) !== Math.sign(prevY) && y !== 0) roots.push(bisect(f, prevX, x))
    prevX = x
    prevY = y
  }
  if (prevY === 0) roots.push(prevX)
  return roots.filter((root, index) => index === 0 || !near(root, roots[index - 1], 1e-7))
}
/** 区間での最大値・最小値（細かく調べる）。 */
export function extremes(f, a, b, steps = 200000) {
  let max = -Infinity
  let min = Infinity
  for (let i = 0; i <= steps; i += 1) {
    const y = f(a + ((b - a) * i) / steps)
    if (y > max) max = y
    if (y < min) min = y
  }
  return { max, min }
}

/** 実数 value を p/q（q ≦ maxDen）の既約分数として探す。 */
export function toFraction(value, maxDen = 2000) {
  for (let d = 1; d <= maxDen; d += 1) {
    const n = Math.round(value * d)
    if (near(n / d, value, 1e-9)) return new Q(n, d)
  }
  throw new Error(`分数にならない: ${value}`)
}

/** 小さな乱数（検算で同じ値を再現するため）。 */
export function seeded(seed = 1) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}
