// 数IIの入試演習の検算。問題文の条件だけから欄の値を計算する（教材の答えは見ない）。
import {
  assert, assertNear, derivative, extremes, int, integrate, near, range, realRoots, simplifySqrt, toFraction,
} from './helpers.mjs'

// 多項式（係数の配列、低い次数から）どうしの積。
const polyMul = (a, b) => {
  const out = Array(a.length + b.length - 1).fill(0)
  a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y }))
  return out
}
const polyPow = (p, n) => Array.from({ length: n }).reduce((acc) => polyMul(acc, p), [1])
// 複素数。
const C = (re, im = 0) => ({ re, im })
const cmul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re)
const cdiv = (a, b) => {
  const d = b.re * b.re + b.im * b.im
  return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d)
}
const cadd = (a, b) => C(a.re + b.re, a.im + b.im)
const cpow = (a, n) => Array.from({ length: n }).reduce((acc) => cmul(acc, a), C(1))
// 2次方程式 x^2+px+q=0 の解（複素数もふくむ）。
const quadRoots = (p, qq) => {
  const D = p * p - 4 * qq
  return D >= 0
    ? [C((-p - Math.sqrt(D)) / 2), C((-p + Math.sqrt(D)) / 2)]
    : [C(-p / 2, -Math.sqrt(-D) / 2), C(-p / 2, Math.sqrt(-D) / 2)]
}
const rad = (deg) => (deg * Math.PI) / 180
const piFraction = (angle) => toFraction(angle / Math.PI, 24)

export const answers = {
  'mx-proof-01': () => ({ ア: polyPow([-1, 2], 5)[3] }),
  'mx-proof-02': () => {
    // 割られる式を x-2 で割る（組立除法を使わず、x の値で確かめる）：商 x^2+a、余り r
    const P = (x) => x ** 3 - 2 * x * x + 3 * x - 4
    const r = P(2)
    const quotient = (x) => (P(x) - r) / (x - 2)
    const a = int(quotient(0))
    for (const x of [1, 3, 5, -4]) assertNear(quotient(x), x * x + a, '商が x^2+a の形でない')
    return { ア: a, イ: r }
  },
  'mx-proof-03': () => {
    // x=-1,0,1 を代入：c = 1-3+1、a+b+c = 1、4a+2b+c = 5
    const c = 1 - 3 + 1
    const ab = 1 - c // a+b
    const a = (5 - c - 2 * ab) / 2
    const b = ab - a
    for (const x of [-3, 2, 5]) assertNear(a * (x + 1) ** 2 + b * (x + 1) + c, x * x + 3 * x + 1, '恒等式にならない')
    return { ア: a, イ: b, ウ: c }
  },
  'mx-proof-04': () => {
    const xs = range(1, 100000).map((k) => k / 1000)
    const values = xs.map((x) => x + 9 / x)
    const min = Math.min(...values)
    return { ア: int(min), イ: int(xs[values.indexOf(min)]) }
  },
  'mx-proof-05': () => {
    // 一般項 C(6,r)(x^2)^(6-r)(2/x)^r の x の指数 12-3r=0
    let constant = 0
    for (let r = 0; r <= 6; r += 1) {
      if (12 - 3 * r === 0) {
        const binom = [1, 6, 15, 20, 15, 6, 1][r]
        constant += binom * 2 ** r
      }
    }
    return { ア: constant }
  },
  'mx-proof-06': () => {
    const f = (x) => 1 / (x * (x + 1)) + 1 / ((x + 1) * (x + 2))
    // k/(x(x+m)) の k, m を x の値2つから決める。
    for (const k of range(1, 5)) for (const m of range(1, 5)) {
      if ([1, 2, 3, 7].every((x) => near(f(x), k / (x * (x + m))))) return { ア: k, イ: m }
    }
    throw new Error('見つからない')
  },
  'mx-proof-07': () => {
    const ys = range(1, 20000).map((k) => k / 1000)
    const values = ys.map((y) => 16 / y + 4 * y)
    const min = Math.min(...values)
    const y = ys[values.indexOf(min)]
    return { ア: int(min), イ: int(16 / y), ウ: int(y) }
  },
  'mx-proof-08': () => {
    // x+y=4、y+z=5、z+x=6（k=1）を解いて整数比に。
    const s = (4 + 5 + 6) / 2
    const [x, y, z] = [s - 5, s - 6, s - 4]
    const m = 2
    return { ア: x * m, イ: y * m, ウ: z * m }
  },

  'mx-complex-01': () => {
    const a = cmul(C(2, 3), C(1, -1))
    const b = cdiv(C(3, 1), C(1, -1))
    return { ア: int(a.re), イ: int(a.im), ウ: int(b.re), エ: int(b.im) }
  },
  'mx-complex-02': () => {
    const [al, be] = quadRoots(-3, 5)
    const s2 = cadd(cmul(al, al), cmul(be, be))
    const s3 = cadd(cpow(al, 3), cpow(be, 3))
    assert(near(s2.im, 0) && near(s3.im, 0), '実数にならない')
    return { ア: int(s2.re), イ: int(s3.re) }
  },
  'mx-complex-03': () => ({ ア: range(-20, 20).find((a) => (-2) ** 3 + a * 4 + 2 + 2 === 0) }),
  'mx-complex-04': () => {
    const ks = range(-50, 50).filter((k) => (2 * (k - 1)) ** 2 - 4 * (k + 5) === 0)
    return { ア: ks[0], イ: ks[1] }
  },
  'mx-complex-05': () => {
    // 条件を満たす P(x) の例：P(x) = (x-1)(x+2)(x^2+5) + ax+b を、a+b=3、-2a+b=-3 から作る代わりに、
    // 余りの条件だけを満たす1次式 r(x) を総当たりで探す（2次式で割った余りは1次以下）。
    const found = []
    for (const a of range(-10, 10)) for (const b of range(-10, 10)) {
      if (a + b === 3 && -2 * a + b === -3) found.push([a, b])
    }
    assert(found.length === 1, '余りが1つに決まらない')
    return { ア: found[0][0], イ: found[0][1] }
  },
  'mx-complex-06': () => {
    const f = (x) => x ** 3 - 3 * x * x + 4 * x - 2
    const real = realRoots(f, -10, 10)
    assert(real.length === 1, '実数解が1つでない')
    // 残りの2解：x^3-3x^2+4x-2 = (x-r)(x^2+px+q)
    const r = int(real[0])
    const p = -3 + r
    const qq = 2 / r
    const [z] = quadRoots(p, qq)
    assertNear(Math.abs(z.im), 1, '虚部が ±1 でない')
    return { ア: r, イ: int(z.re) }
  },
  'mx-complex-07': () => {
    const ms = range(-50, 50).filter((m) => {
      const roots = realRoots((x) => x * x + m * x + 12, -100, 100, 40000)
      if (roots.length !== 2) return false
      const [a, b] = roots.map(Math.abs).sort((u, v) => u - v)
      return near(b / a, 3, 1e-6)
    })
    assert(ms.length === 2 && ms[0] === -ms[1], `m ${ms}`)
    return { ア: Math.abs(ms[0]) }
  },
  'mx-complex-08': () => {
    const w = C(-1 / 2, Math.sqrt(3) / 2)
    const v = cadd(cadd(cpow(w, 100), cpow(w, 50)), C(1))
    assert(near(v.im, 0, 1e-6), '実数にならない')
    return { ア: int(v.re) }
  },

  'mx-coordII-01': () => {
    // 求める直線 x + a y - b = 0：(2,1) を通り、方向ベクトルが 3x-y+1=0 の法線 (3,-1) に平行
    const a = 3 // x + 3y：法線 (1,3) は (3,-1) と垂直
    assert(1 * 3 + a * -1 === 0, '垂直でない')
    return { ア: a, イ: 2 + a * 1 }
  },
  'mx-coordII-02': () => ({ ア: int(Math.abs(3 * 3 + 4 * 4 - 5) / Math.hypot(3, 4)) }),
  'mx-coordII-03': () => {
    const cx = 4 / 2
    const cy = -6 / 2
    return { ア: cx, イ: cy, ウ: int(Math.sqrt(cx * cx + cy * cy + 3)) }
  },
  'mx-coordII-04': () => {
    // 接線 ax + y = c：点 (3,1) を通り、中心から距離 √10
    const a = 3
    const c = a * 3 + 1
    assertNear(Math.abs(c) / Math.hypot(a, 1), Math.sqrt(10), '接していない')
    return { ア: a, イ: c }
  },
  'mx-coordII-05': () => {
    // 交点を数値で求めて弦の長さを測る。
    const xs = realRoots((y) => (5 - 2 * y) ** 2 + y * y - 25, -10, 10).map((y) => [5 - 2 * y, y])
    const length = Math.hypot(xs[0][0] - xs[1][0], xs[0][1] - xs[1][1])
    const [a, b] = simplifySqrt(int(length * length))
    return { ア: a, イ: b }
  },
  'mx-coordII-06': () => {
    // 条件を満たす点を x 軸上に2つ求め、それを直径の両はしとして中心と半径を出す（アポロニウスの円）。
    const onAxis = realRoots((x) => Math.abs(x + 2) - 2 * Math.abs(x - 4), -50, 50)
    assert(onAxis.length === 2, 'x軸上の点')
    const cx = (onAxis[0] + onAxis[1]) / 2
    const r = Math.abs(onAxis[1] - onAxis[0]) / 2
    // 円周上の別の点でも条件を満たすか確かめる。
    const P = [cx + r * Math.cos(1), r * Math.sin(1)]
    assertNear(Math.hypot(P[0] + 2, P[1]), 2 * Math.hypot(P[0] - 4, P[1]), '円周上で比が2:1にならない')
    return { ア: int(cx), イ: 0, ウ: int(r) }
  },
  'mx-coordII-07': () => {
    let best = -Infinity
    let at = null
    for (let x = 0; x <= 10; x += 0.01) for (let y = 0; y <= 10; y += 0.01) {
      if (x + 2 * y <= 8 + 1e-9 && 3 * x + y <= 9 + 1e-9 && x + y > best) {
        best = x + y
        at = [x, y]
      }
    }
    return { ア: int(best, '最大値'), イ: int(at[0]), ウ: int(at[1]) }
  },
  'mx-coordII-08': () => {
    // 円の中心は、弦の垂直二等分線の交点：(0,0)-(4,0) から x=2、(0,0)-(0,2) から y=1。
    const cx = 2
    const cy = 1
    const r2 = cx * cx + cy * cy
    assertNear(Math.hypot(4 - cx, -cy) ** 2, r2, '3点目')
    return { ア: cx, イ: cy, ウ: r2 }
  },

  'mx-trigfn-01': () => {
    const theta = (2 / 3) * Math.PI
    return { ア: int((6 * theta) / Math.PI), イ: int((0.5 * 36 * theta) / Math.PI) }
  },
  'mx-trigfn-02': () => {
    const v = Math.sin(rad(75))
    for (const a of range(1, 20)) for (const b of range(1, a - 1)) for (const c of range(1, 12)) {
      if (near((Math.sqrt(a) + Math.sqrt(b)) / c, v, 1e-12)) return { ア: a, イ: b, ウ: c }
    }
    throw new Error('見つからない')
  },
  'mx-trigfn-03': () => {
    const roots = realRoots((t) => 2 * Math.sin(t) - Math.sqrt(3), 0, 2 * Math.PI - 1e-9, 20000)
    const [f1, f2] = roots.map(piFraction)
    assert(f1.n === 1, '1つ目が π/k の形でない')
    return { ア: f1.d, イ: f2.n, ウ: f2.d }
  },
  'mx-trigfn-04': () => {
    const r = Math.hypot(1, Math.sqrt(3))
    const alpha = Math.atan2(Math.sqrt(3), 1)
    const f = piFraction(alpha)
    assert(f.n === 1, 'π/k の形でない')
    for (const t of [0.3, 1.7, 4]) assertNear(Math.sin(t) + Math.sqrt(3) * Math.cos(t), r * Math.sin(t + alpha), '合成')
    return { ア: int(r), イ: f.d }
  },
  'mx-trigfn-05': () => {
    const alpha = Math.PI - Math.asin(3 / 5)
    const s = toFraction(Math.sin(2 * alpha), 100)
    const c = toFraction(Math.cos(2 * alpha), 100)
    return { ア: s.n, イ: s.d, ウ: c.n, エ: c.d }
  },
  'mx-trigfn-06': () => {
    const f = (t) => Math.sin(t) + Math.sqrt(3) * Math.cos(t)
    const steps = 360000
    let max = -Infinity
    let at = 0
    let min = Infinity
    for (let i = 0; i <= steps; i += 1) {
      const t = (Math.PI * i) / steps
      const y = f(t)
      if (y > max) { max = y; at = t }
      if (y < min) min = y
    }
    const where = piFraction(at)
    assert(where.n === 1, 'π/k の形でない')
    return { ア: int(max), イ: where.d, ウ: int(min * min) }
  },
  'mx-trigfn-07': () => {
    const { max, min } = extremes((t) => Math.cos(2 * t) + 2 * Math.sin(t), 0, 2 * Math.PI, 400000)
    const m = toFraction(max, 10)
    return { ア: m.n, イ: m.d, ウ: int(min) }
  },
  'mx-trigfn-08': () => {
    const f = (t) => 2 * Math.cos(t) ** 2 - Math.cos(t) - 1
    // f=0 の点（範囲の境目）を求めて、区間の符号を調べる。
    const zeros = realRoots(f, 1e-6, 2 * Math.PI - 1e-6, 40000)
    assert(zeros.length === 2, `境目 ${zeros.length}`)
    assert(f(0.01) < 0 && f(Math.PI) > 0 && f(2 * Math.PI - 0.01) < 0 && !(f(0) < 0), '符号の並び')
    const [a, b] = zeros.map(piFraction)
    return { ア: a.n, イ: a.d, ウ: b.n, エ: b.d }
  },

  'mx-explog-01': () => ({ ア: int(Math.cbrt(24 * 9)), イ: int(16 ** 0.75) }),
  'mx-explog-02': () => ({ ア: int(Math.log2(12) - Math.log2(3)), イ: int((Math.log(5) / Math.log(3)) * (Math.log(27) / Math.log(5))) }),
  'mx-explog-03': () => {
    const xs = realRoots((x) => 4 ** x - 3 * 2 ** (x + 1) + 8, -10, 10).map((x) => int(x))
    return { ア: xs[0], イ: xs[1] }
  },
  'mx-explog-04': () => {
    const xs = realRoots((x) => Math.log2(x - 1) + Math.log2(x + 1) - 3, 1.0001, 100)
    assert(xs.length === 1, '解が1つでない')
    return { ア: int(xs[0]) }
  },
  'mx-explog-05': () => {
    const n = 2n ** 50n
    const text = n.toString()
    return { ア: text.length, イ: Number(text[0]) }
  },
  'mx-explog-06': () => {
    const values = [2n ** 30n, 3n ** 20n, 10n ** 9n]
    const max = values.reduce((a, b) => (a > b ? a : b))
    return { ア: values.indexOf(max) }
  },
  'mx-explog-07': () => {
    const ok = (x) => x > 2 && x < 4 && Math.log(x - 2) / Math.log(0.5) > Math.log(4 - x) / Math.log(0.5)
    const xs = range(2001, 3999).map((k) => k / 1000).filter(ok)
    return { ア: int(Math.min(...xs) - 0.001), イ: int(Math.max(...xs) + 0.001) }
  },
  'mx-explog-08': () => {
    const f = (x) => 4 ** x - 2 ** (x + 2) + 5
    const xs = range(-1000, 2000).map((k) => k / 1000)
    const ys = xs.map(f)
    const max = Math.max(...ys)
    const min = Math.min(...ys)
    return { ア: int(max), イ: int(xs[ys.indexOf(max)]), ウ: int(min), エ: int(xs[ys.indexOf(min)]) }
  },

  'mx-diff-01': () => ({ ア: int(derivative((x) => 2 * x ** 3 - 3 * x * x + 4, 2)) }),
  'mx-diff-02': () => {
    const f = (x) => x ** 3 - 3 * x
    const m = derivative(f, 2)
    return { ア: int(m), イ: int(-(f(2) - m * 2)) }
  },
  'mx-diff-03': () => {
    const f = (x) => x ** 3 - 6 * x * x + 9 * x + 1
    const crit = realRoots((x) => derivative(f, x), -10, 10).map((x) => int(x))
    const [a, b] = crit
    assert(derivative(f, a - 0.1) > 0 && derivative(f, a + 0.1) < 0, '極大の確認')
    return { ア: int(f(a)), イ: a, ウ: int(f(b)), エ: b }
  },
  'mx-diff-04': () => {
    const { max, min } = extremes((x) => x ** 3 - 3 * x, -2, 3)
    return { ア: int(max), イ: int(min) }
  },
  'mx-diff-05': () => {
    // 接点 t の接線 y = 3t^2 x - 2t^3 が (0,-2) を通る t
    const ts = realRoots((t) => -2 * t ** 3 + 2, -10, 10).map((t) => int(t))
    assert(ts.length === 1, '接点が1つでない')
    const t = ts[0]
    return { ア: 3 * t * t, イ: 2 * t ** 3 }
  },
  'mx-diff-06': () => {
    const count = (a) => realRoots((x) => x ** 3 - 3 * x - a, -10, 10, 40000).length
    const ok = range(-400, 400).map((k) => k / 100).filter((a) => count(a) === 3)
    return { ア: int(Math.min(...ok) - 0.01), イ: int(Math.max(...ok) + 0.01) }
  },
  'mx-diff-07': () => {
    const found = []
    for (const a of range(-20, 20)) for (const b of range(-30, 30)) {
      const f = (x) => x ** 3 + a * x * x + b * x
      const fp = (x) => 3 * x * x + 2 * a * x + b
      if (fp(1) === 0 && f(1) === -5 && fp(0.9) < 0 && fp(1.1) > 0) found.push([a, b])
    }
    assert(found.length === 1, `候補 ${JSON.stringify(found)}`)
    const [a, b] = found[0]
    const f = (x) => x ** 3 + a * x * x + b * x
    const crit = realRoots((x) => 3 * x * x + 2 * a * x + b, -20, 20).map((x) => int(x))
    const maxAt = crit.find((x) => x !== 1)
    return { ア: a, イ: b, ウ: f(maxAt) }
  },
  'mx-diff-08': () => {
    const V = (x) => x * (12 - 2 * x) ** 2
    const xs = range(1, 5999).map((k) => k / 1000)
    const vs = xs.map(V)
    const max = Math.max(...vs)
    return { ア: int(xs[vs.indexOf(max)]), イ: int(max) }
  },

  'mx-integ-01': () => {
    // F(x) = x^3 - a x^2 + x + c：F' と F(0) から。
    const F = (x) => integrate((t) => 3 * t * t - 4 * t + 1, 0, x) + 2
    const c = int(F(0))
    const a = int(-(F(1) - 1 - 1 - c)) // F(1) = 1 - a + 1 + c
    return { ア: a, イ: c }
  },
  'mx-integ-02': () => {
    const v = toFraction(integrate((x) => x * x - 2 * x + 3, 1, 3), 50)
    return { ア: v.n, イ: v.d }
  },
  'mx-integ-03': () => {
    const v = toFraction(integrate((x) => Math.abs(x * x - 2 * x), 0, 2), 50)
    return { ア: v.n, イ: v.d }
  },
  'mx-integ-04': () => {
    // f(x) = 3x^2 + 2k、k = ∫_0^1 f：k を数値で解く。
    const k = realRoots((kk) => integrate((t) => 3 * t * t + 2 * kk, 0, 1) - kk, -10, 10)[0]
    return { ア: int(-2 * k) }
  },
  'mx-integ-05': () => {
    const [a, b] = realRoots((x) => x * x - x - 2, -10, 10)
    const v = toFraction(integrate((x) => x + 2 - x * x, a, b), 50)
    return { ア: v.n, イ: v.d }
  },
  'mx-integ-06': () => {
    const v = toFraction(integrate((x) => Math.abs(x * x - 1), 0, 1) + integrate((x) => Math.abs(x * x - 1), 1, 3), 50)
    return { ア: v.n, イ: v.d }
  },
  'mx-integ-07': () => {
    // F(x) = x^2 - 3x + 2 の導関数 f(x) = px - q と、F(a) = 0 となる a。
    const F = (x) => x * x - 3 * x + 2
    const p = int(derivative(F, 1) - derivative(F, 0))
    const qq = -int(derivative(F, 0))
    const as = realRoots(F, -10, 10).map((x) => int(x))
    return { ア: p, イ: qq, ウ: as[0], エ: as[1] }
  },
  'mx-integ-08': () => {
    const slope = derivative((x) => x * x, 1)
    const tangent = (x) => 1 + slope * (x - 1)
    const v = toFraction(integrate((x) => x * x - tangent(x), 0, 1), 50)
    return { ア: v.n, イ: v.d }
  },
}

// 図の点・長さ・角が問題の条件と合うか。
export const figures = {
  'mx-coordII-07': (f) => {
    const region = f.polygons[0].pts
    for (const [x, y] of region) {
      assert(x >= -1e-9 && y >= -1e-9 && x + 2 * y <= 8 + 1e-9 && 3 * x + y <= 9 + 1e-9, `頂点 (${x},${y}) が領域の外`)
    }
    assert(JSON.stringify(region) === JSON.stringify([[0, 0], [3, 0], [2, 3], [0, 4]]), '頂点の並び')
    assertNear(f.curves[0].fn(2), 3, 'x+2y=8 のグラフ')
    assertNear(f.curves[1].fn(2), 3, '3x+y=9 のグラフ')
  },
}
