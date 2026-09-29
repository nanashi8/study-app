// 数IIIの入試演習の検算。問題文の条件だけから欄の値を計算する（教材の答えは見ない）。
import {
  assert, assertNear, derivative, extremes, int, integrate, near, range, realRoots, toFraction,
} from './helpers.mjs'

const limitAtInfinity = (f) => f(1e7)
const piFraction = (angle) => toFraction(angle / Math.PI, 24)

export const answers = {
  'mx-limit-01': () => ({ ア: int(Math.round(limitAtInfinity((n) => (3 * n * n + 2 * n) / (n * n - 1)) * 1e4) / 1e4) }),
  'mx-limit-02': () => {
    let s = 0
    for (let n = 1; n <= 200; n += 1) s += 3 * (-0.5) ** (n - 1)
    return { ア: int(Math.round(s * 1e9) / 1e9) }
  },
  'mx-limit-03': () => {
    const f = (x) => (x * x - 4) / (x - 2)
    const g = (x) => Math.sin(3 * x) / x
    return { ア: int(Math.round(f(2 + 1e-7) * 1e5) / 1e5), イ: int(Math.round(g(1e-7) * 1e5) / 1e5) }
  },
  'mx-limit-04': () => {
    const n = 1e6
    return { ア: int(Math.round((Math.sqrt(n * n + 4 * n) - n) * 1e4) / 1e4) }
  },
  'mx-limit-05': () => {
    // 部分和が収束する x の範囲を調べ、和を 1/(k - x) の形にする。
    const converges = (x) => Math.abs(x - 1) < 1
    const xs = range(-100, 300).map((k) => k / 100).filter(converges)
    const lo = int(Math.min(...xs) - 0.01)
    const hi = int(Math.max(...xs) + 0.01)
    const sum = (x) => {
      let s = 0
      for (let n = 0; n < 2000; n += 1) s += (x - 1) ** n
      return s
    }
    const k = int(0.5 + 1 / sum(0.5))
    assertNear(sum(1.3), 1 / (k - 1.3), '和の形', 1e-6)
    return { ア: lo, イ: hi, ウ: k }
  },
  'mx-limit-06': () => {
    for (const a of range(-10, 10)) {
      const b = 2 * a
      const f = (x) => (a * Math.sqrt(x + 3) - b) / (x - 1)
      if (a !== 0 && near(f(1 + 1e-7), 1, 1e-5)) return { ア: a, イ: b }
    }
    throw new Error('見つからない')
  },
  'mx-limit-07': () => {
    let a = 1
    for (let n = 0; n < 200; n += 1) a = a / 2 + 3
    return { ア: int(Math.round(a * 1e9) / 1e9) }
  },
  'mx-limit-08': () => {
    for (const a of range(-10, 10)) for (const b of range(-20, 20)) {
      if (4 + 2 * a + b !== 0) continue
      const f = (x) => (x * x + a * x + b) / (x - 2)
      if (near(f(2 + 1e-7), 5, 1e-5) && near(f(2 - 1e-7), 5, 1e-5)) return { ア: a, イ: b }
    }
    throw new Error('見つからない')
  },

  'mx-diff3-01': () => ({
    ア: int(Math.round(derivative((x) => (2 * x + 1) ** 3, 0) * 1e6) / 1e6),
    イ: int(Math.round(derivative((x) => x / (x * x + 1), 0) * 1e6) / 1e6),
  }),
  'mx-diff3-02': () => ({
    ア: int(Math.round(derivative((x) => Math.exp(2 * x) * Math.sin(x), 0) * 1e6) / 1e6),
    イ: int(Math.round(derivative((x) => x * Math.log(x), Math.E) * 1e6) / 1e6),
  }),
  'mx-diff3-03': () => {
    const m = derivative(Math.sqrt, 4)
    const c = 2 - m * 4
    return { ア: int(Math.round((1 / m) * 1e6) / 1e6), イ: int(Math.round(c * 1e6) / 1e6) }
  },
  'mx-diff3-04': () => {
    const f = (x) => x ** 3 - 3 * x * x
    const second = (x) => derivative((t) => derivative(f, t), x, 1e-3)
    const [x0] = realRoots(second, -10, 10, 20000)
    assert(second(x0 - 0.1) * second(x0 + 0.1) < 0, '凹凸が入れかわらない')
    return { ア: int(Math.round(x0 * 1e5) / 1e5), イ: int(Math.round(f(x0) * 1e5) / 1e5) }
  },
  'mx-diff3-05': () => {
    const f = (x) => x + 2 * Math.cos(x)
    const crit = realRoots((x) => derivative(f, x), 1e-6, Math.PI - 1e-6, 20000)
    assert(crit.length === 2, `臨界点 ${crit.length}`)
    const [a, b] = crit
    assert(derivative(f, a - 0.01) > 0 && derivative(f, a + 0.01) < 0, '極大の確認')
    assert(derivative(f, b - 0.01) < 0 && derivative(f, b + 0.01) > 0, '極小の確認')
    const fa = piFraction(a)
    const fb = piFraction(b)
    assert(fa.n === 1, 'π/k の形でない')
    return { ア: fa.d, イ: fb.n, ウ: fb.d }
  },
  'mx-diff3-06': () => {
    const slope = derivative(Math.log, 1)
    const normalSlope = -1 / slope
    assertNear(normalSlope, -1, '法線の傾き')
    const c = 0 - normalSlope * 1
    const ts = realRoots((t) => Math.exp(t) * (0 - t) + Math.exp(t), -10, 10)
    assert(ts.length === 1, '接点が1つでない')
    return { ア: int(Math.round(c * 1e6) / 1e6), イ: int(Math.round(ts[0] * 1e6) / 1e6) }
  },
  'mx-diff3-07': () => {
    const f = (x) => (x * x + 1) / x
    const pos = extremes(f, 0.01, 10, 400000)
    const neg = extremes(f, -10, -0.01, 400000)
    const minAt = realRoots((x) => derivative(f, x), 0.01, 10)[0]
    const maxAt = realRoots((x) => derivative(f, x), -10, -0.01)[0]
    return { ア: int(Math.round(pos.min * 1e6) / 1e6), イ: int(Math.round(minAt * 1e5) / 1e5), ウ: int(Math.round(neg.max * 1e6) / 1e6), エ: int(Math.round(maxAt * 1e5) / 1e5) }
  },
  'mx-diff3-08': () => {
    const f = (x) => x - 2 * Math.sin(x)
    const { min } = extremes(f, 0, 2 * Math.PI, 400000)
    // min = π/a - √b の a, b を探す。
    for (const a of range(1, 12)) for (const b of range(1, 12)) {
      if (near(Math.PI / a - Math.sqrt(b), min, 1e-6)) return { ア: a, イ: b }
    }
    throw new Error('形にならない')
  },

  'mx-integ3-01': () => {
    const v = toFraction(integrate((x) => x * (x * x + 1) ** 3, 0, 1), 50)
    return { ア: v.n, イ: v.d }
  },
  'mx-integ3-02': () => ({ ア: int(Math.round(integrate((x) => x * Math.exp(x), 0, 1) * 1e9) / 1e9) }),
  'mx-integ3-03': () => {
    const v = piFraction(integrate((x) => Math.sin(x) ** 2, 0, Math.PI / 2))
    assert(v.n === 1, 'π/k の形でない')
    return { ア: v.d }
  },
  'mx-integ3-04': () => ({
    ア: int(Math.round(integrate((x) => 1 / x, 1, Math.E ** 2, 20000) * 1e8) / 1e8),
    イ: int(Math.round(Math.exp(integrate((x) => 1 / (x + 1), 0, 1)) * 1e8) / 1e8),
  }),
  'mx-integ3-05': () => ({
    ア: int(Math.round(integrate(Math.sin, 0, Math.PI) * 1e9) / 1e9),
    イ: int(Math.round(integrate(Math.log, 1, Math.E) * 1e9) / 1e9),
  }),
  'mx-integ3-06': () => ({ ア: int(Math.round((integrate((x) => Math.PI * x, 0, 4) / Math.PI) * 1e9) / 1e9) }),
  'mx-integ3-07': () => {
    const v = integrate((x) => x * Math.cos(x), 0, Math.PI / 2)
    for (const a of range(1, 8)) for (const b of range(0, 5)) {
      if (near(Math.PI / a - b, v, 1e-9)) return { ア: a, イ: b }
    }
    throw new Error('形にならない')
  },
  'mx-integ3-08': () => {
    const v = toFraction(integrate((x) => x * x - x ** 4, 0, 1), 50)
    return { ア: v.n, イ: v.d }
  },
}

export const figures = {}
