// 中3の入試演習の検算。問題文の条件だけから欄の値を計算する（教材の答えは見ない）。
import {
  angleDeg, assert, assertNear, dist, int, near, q, range, realRoots, simplifySqrt,
} from './helpers.mjs'

function onlyOption(checks, message) {
  const hits = checks.map((check, index) => (check() ? index : -1)).filter((index) => index >= 0)
  assert(hits.length === 1, `${message}: 当てはまる選択肢が ${hits.length} 個`)
  return hits[0]
}
// 多項式を数値で調べて係数を取り出す（次数 deg まで）。f は1変数の関数。
function coefficients(f, deg) {
  // x = 0..deg の値から、差分で係数を解く（ラグランジュ補間ではなく連立方程式）。
  const xs = range(0, deg)
  const rows = xs.map((x) => [...range(0, deg).map((k) => x ** k), f(x)])
  for (let col = 0; col <= deg; col += 1) {
    const pivot = rows.findIndex((row, index) => index >= col && Math.abs(row[col]) > 1e-12)
    ;[rows[col], rows[pivot]] = [rows[pivot], rows[col]]
    for (let r = 0; r <= deg; r += 1) {
      if (r === col) continue
      const factor = rows[r][col] / rows[col][col]
      rows[r] = rows[r].map((value, index) => value - factor * rows[col][index])
    }
  }
  return rows.map((row, index) => int(row[deg + 1] / row[index], '係数が整数にならない'))
}
// 二次方程式の実数解（小さい順）。
const roots2 = (a, b, c) => realRoots((x) => a * x * x + b * x + c, -1000, 1000, 400000)
const circlePoint = (deg) => [3 * Math.cos((deg * Math.PI) / 180), 3 * Math.sin((deg * Math.PI) / 180)]

export const answers = {
  'mx-expand-01': () => {
    const [c, b] = coefficients((x) => (x + 5) * (x - 3), 2)
    return { ア: b, イ: -c }
  },
  'mx-expand-02': () => {
    // (2x-3y)^2 を y=1 として x の多項式に、x^2 と x、定数の係数（xy・y^2 の係数）を読む。
    const [c, b, a] = coefficients((x) => (2 * x - 3) ** 2, 2)
    return { ア: a, イ: -b, ウ: c }
  },
  'mx-expand-03': () => {
    const [c, b, a] = coefficients((x) => (x + 4) * (x - 4) - (x - 2) ** 2, 2)
    assert(a === 0, 'x^2 が消えない')
    return { ア: b, イ: -c }
  },
  'mx-expand-04': () => ({ ア: 103 * 97 }),
  'mx-expand-05': () => {
    // a の多項式として（b=1）：(a+1-3)(a+1+3) = a^2 + 2a + (1-9)。ab の係数は a の1次の係数、定数から b^2=1 を引く。
    const [c, b1] = coefficients((a) => (a + 1 - 3) * (a + 1 + 3), 2)
    return { ア: b1, イ: -(c - 1) }
  },
  'mx-expand-06': () => {
    const [x, y] = roots2(1, -5, 3) // x+y=5、xy=3 を満たす実数
    return { ア: int(x * x + y * y), イ: int((x - y) ** 2) }
  },
  'mx-expand-07': () => {
    const [c, b, a] = coefficients((x) => (3 * x + 1) ** 2 - (3 * x + 2) * (3 * x - 2), 2)
    assert(a === 0, 'x^2 が消えない')
    return { ア: b, イ: c }
  },
  'mx-expand-08': () => {
    const a = q(1, 3)
    const b = q(-2)
    const value = a.add(b.mul(2)).pow(2).sub(a.sub(b.mul(2)).pow(2))
    return { ア: value.n, イ: value.d }
  },

  'mx-factor-01': () => {
    const [r1, r2] = roots2(1, -7, 12).map((r) => int(r))
    return { ア: r1, イ: r2 }
  },
  'mx-factor-02': () => {
    // 4x^2-9y^2 = (px+qy)(px-qy)：p^2=4、q^2=9（p,q>0）
    return { ア: int(Math.sqrt(4)), イ: int(Math.sqrt(9)) }
  },
  'mx-factor-03': () => {
    const g = [6, 9].reduce((a, b) => (b ? (function f(x, y) { return y ? f(y, x % y) : x })(a, b) : a))
    return { ア: g, イ: 6 / g, ウ: 9 / g }
  },
  'mx-factor-04': () => {
    const k = 2
    const [r1, r2] = roots2(1, 0, -8 / k).map((r) => int(r))
    assert(r1 === -r2, '2乗の差にならない')
    return { ア: k, イ: r2 }
  },
  'mx-factor-05': () => {
    const k = 3
    const [r1, r2] = roots2(1, -12 / k, -36 / k).map((r) => int(r)) // x = -2, 6
    return { ア: k, イ: -r1, ウ: r2 }
  },
  'mx-factor-06': () => {
    const [r1, r2] = realRoots((x) => (x + 1) ** 2 - 5 * (x + 1) + 6, -50, 50).map((r) => int(r))
    return { ア: r1, イ: r2 }
  },
  'mx-factor-07': () => ({ ア: 57 ** 2 - 43 ** 2 }),
  'mx-factor-08': () => ({ ア: 23 ** 2 - 6 * 23 + 9 }),

  'mx-sqrt-01': () => {
    const value = Math.sqrt(18) + Math.sqrt(50) - Math.sqrt(8)
    const k = int(value / Math.sqrt(2))
    return { ア: k, イ: 2 }
  },
  'mx-sqrt-02': () => {
    const value = 6 / Math.sqrt(3)
    const [a, b] = simplifySqrt(int(value * value))
    return { ア: a, イ: b }
  },
  'mx-sqrt-03': () => {
    const value = (Math.sqrt(3) + 1) ** 2
    // value = p + r√3 の p と r（有理数部分は整数）
    const r = int((value - 4) / Math.sqrt(3))
    return { ア: int(value - r * Math.sqrt(3)), イ: r, ウ: 3 }
  },
  'mx-sqrt-04': () => ({ ア: range(1, 100).filter((a) => Math.sqrt(a) > 3 && Math.sqrt(a) < 4).length }),
  'mx-sqrt-05': () => {
    const x = Math.sqrt(5) + 2
    const y = Math.sqrt(5) - 2
    const value = x * x - y * y
    const [a, b] = simplifySqrt(int(value * value))
    return { ア: a, イ: b }
  },
  'mx-sqrt-06': () => ({ ア: range(1, 1000).find((n) => Number.isInteger(Math.sqrt(60 * n))) }),
  'mx-sqrt-07': () => {
    const ok = range(1, 15).filter((a) => Number.isInteger(Math.sqrt(45 - 3 * a)))
    return { ア: ok.length, イ: ok.reduce((s, a) => s + a, 0) }
  },
  'mx-sqrt-08': () => {
    const a = Math.sqrt(7) - Math.floor(Math.sqrt(7))
    return { ア: int(a * (a + 4)) }
  },

  'mx-eq2-01': () => {
    const [r1, r2] = roots2(1, 2, -15).map((r) => int(r))
    return { ア: r1, イ: r2 }
  },
  'mx-eq2-02': () => {
    // (p ± √s)/d の形：解の和の半分と差から。
    const [r1, r2] = roots2(2, -5, 1)
    const d = 4
    const p = int(((r1 + r2) / 2) * d)
    const s = int((((r2 - r1) / 2) * d) ** 2)
    return { ア: p, イ: s, ウ: d }
  },
  'mx-eq2-03': () => {
    const [r1, r2] = realRoots((x) => (x - 3) ** 2 - 5, -50, 50)
    return { ア: int((r1 + r2) / 2), イ: int(((r2 - r1) / 2) ** 2) }
  },
  'mx-eq2-04': () => {
    const [r1, r2] = realRoots((x) => x * (x + 3) - 10, -50, 50).map((r) => int(r))
    return { ア: r1, イ: r2 }
  },
  'mx-eq2-05': () => {
    const a = range(-50, 50).find((value) => 9 + 3 * value - 12 === 0)
    const other = roots2(1, a, -12).map((r) => int(r)).find((r) => r !== 3)
    return { ア: a, イ: other }
  },
  'mx-eq2-06': () => {
    const x = realRoots((w) => w * (w + 3) - 40, 0.01, 100).map((r) => int(r))[0]
    return { ア: x, イ: x + 3 }
  },
  'mx-eq2-07': () => {
    const widths = realRoots((x) => (20 - x) * (30 - x) - 504, 0.001, 19.999).map((r) => int(r))
    assert(widths.length === 1, '道の幅が1つに決まらない')
    return { ア: widths[0] }
  },
  'mx-eq2-08': () => {
    const found = realRoots((x) => x * x - 15 - 2 * x, 0.001, 100).map((r) => int(r))
    assert(found.length === 1, '正の解が1つでない')
    return { ア: found[0] }
  },

  'mx-qfn0-01': () => {
    const a = 12 / (-2) ** 2
    return { ア: int(a), イ: int(a * 9) }
  },
  'mx-qfn0-02': () => {
    const ys = range(-100, 300).map((k) => k / 100).map((x) => 2 * x * x)
    return { ア: int(Math.min(...ys)), イ: int(Math.max(...ys)) }
  },
  'mx-qfn0-03': () => ({ ア: (4 ** 2 - 1 ** 2) / (4 - 1) }),
  'mx-qfn0-04': () => ({ ア: -18 / 9 }),
  'mx-qfn0-05': () => {
    const [xa, xb] = realRoots((x) => x * x / 2 - (x + 4), -20, 20).map((r) => int(r))
    const A = [xa, xa * xa / 2]
    const B = [xb, xb * xb / 2]
    return { ア: xa, イ: xb, ウ: int(Math.abs(A[0] * B[1] - B[0] * A[1]) / 2) }
  },
  'mx-qfn0-06': () => {
    const a = range(-20, 20).find((value) => value !== 0 && (value * 9 - value * 1) / 2 === 8)
    const p = range(-50, 50).find((value) => (2 * (value + 2) ** 2 - 2 * value ** 2) / 2 === 20)
    return { ア: a, イ: p }
  },
  'mx-qfn0-07': () => {
    const t = realRoots((x) => 5 * x * x - 45, 0.001, 100).map((r) => int(r))[0]
    return { ア: t, イ: int((5 * 16 - 5 * 4) / 2) }
  },
  'mx-qfn0-08': () => {
    const A = [-1, 1]
    const B = [2, 4]
    const area = (P) => Math.abs((A[0] - P[0]) * (B[1] - P[1]) - (B[0] - P[0]) * (A[1] - P[1])) / 2
    const target = area([0, 0])
    const xs = realRoots((x) => area([x, x * x]) - target, 0.0001, 1.9999).filter((x) => near(area([x, x * x]), target, 1e-6))
    assert(xs.length === 1, `候補 ${xs}`)
    const x = int(xs[0])
    return { ア: x, イ: x * x }
  },

  'mx-simil-01': () => ({ ア: q(8 * 9, 6).toInt() }),
  'mx-simil-02': () => ({ ア: q(6 * 2, 4).toInt(), イ: q(9 * 4, 6).toInt() }),
  'mx-simil-03': () => ({ ア: 10 / 2 }),
  'mx-simil-04': () => ({ ア: 4, イ: 9, ウ: 8, エ: 27 }),
  'mx-simil-05': () => {
    // 図と同じ台形の座標で、AE:EB=1:2 の点を通る BC に平行な線分の長さを測る。
    const [A, B, C, D] = [[2, 4.5], [0, 0], [10, 0], [6, 4.5]]
    const E = [A[0] + (B[0] - A[0]) / 3, A[1] + (B[1] - A[1]) / 3]
    const F = [D[0] + (C[0] - D[0]) / 3, D[1] + (C[1] - D[1]) / 3]
    assertNear(E[1], F[1], 'EF が BC に平行でない')
    return { ア: int(dist(E, F)) }
  },
  'mx-simil-06': () => {
    const small = q(2, 5).pow(2)
    const rest = q(1).sub(small)
    const ratio = small.div(rest)
    return { ア: ratio.n, イ: ratio.d }
  },
  'mx-simil-07': () => {
    const P = { A: [0, 0], B: [3, 4], C: [8, 0], D: [3, -2] }
    assertNear(dist(P.A, P.C), 8, 'AC')
    assertNear(dist(P.B, P.D), 6, 'BD')
    const m = (u, v) => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2]
    const E = m(P.A, P.B)
    const F = m(P.B, P.C)
    const G = m(P.C, P.D)
    const H = m(P.D, P.A)
    return { ア: int(dist(E, F) + dist(F, G) + dist(G, H) + dist(H, E)) }
  },
  'mx-simil-08': () => {
    const B = [0, 0]
    const C = [13, 0]
    const D = [4, 0]
    const h = Math.sqrt(4 * 9) // 直角の条件 (AD)^2 = BD·DC を、∠A=90° から座標で確かめる
    const A = [4, h]
    assertNear(angleDeg(A, B, C), 90, '∠A が直角でない')
    const [a, b] = simplifySqrt(int(dist(A, B) ** 2))
    return { ア: int(dist(A, D)), イ: a, ウ: b }
  },

  'mx-circ-01': () => {
    const [A, B, C] = [circlePoint(120), circlePoint(245), circlePoint(15)]
    assertNear(angleDeg([0, 0], B, C), 130, '中心角')
    return { ア: int(angleDeg(A, B, C)) }
  },
  'mx-circ-02': () => {
    const [A, B, C] = [circlePoint(180), circlePoint(0), circlePoint(56)]
    assertNear(angleDeg(A, B, C), 28, '∠CAB')
    return { ア: int(angleDeg(B, C, A)) }
  },
  'mx-circ-03': () => {
    const [A, B, C, D] = [circlePoint(120), circlePoint(200), circlePoint(270), circlePoint(20)]
    assertNear(angleDeg(A, B, C), 35, '∠BAC')
    assertNear(angleDeg(B, D, A), 50, '∠ABD')
    // AC と BD の交点 P。
    const cross = (u, v) => u[0] * v[1] - u[1] * v[0]
    const r = [C[0] - A[0], C[1] - A[1]]
    const s = [D[0] - B[0], D[1] - B[1]]
    const t = cross([B[0] - A[0], B[1] - A[1]], s) / cross(r, s)
    const P = [A[0] + t * r[0], A[1] + t * r[1]]
    return { ア: int(angleDeg(D, B, C)), イ: int(angleDeg(P, C, D)) }
  },
  'mx-circ-04': () => {
    const unit = 360 / (3 + 4 + 5)
    return { ア: int((3 * unit) / 2) }
  },
  'mx-circ-05': () => {
    const [A, B, C, D] = [circlePoint(200), circlePoint(300), circlePoint(40), circlePoint(100)]
    assertNear(angleDeg(C, A, B), 50, '∠ACB')
    assertNear(angleDeg(D, A, B), 50, '∠ADB')
    assertNear(angleDeg(A, C, D), 30, '∠CAD')
    return { ア: int(angleDeg(B, C, D)) }
  },
  'mx-circ-06': () => {
    const [A, B, C, D] = [circlePoint(180), circlePoint(0), circlePoint(50), circlePoint(300)]
    assertNear(angleDeg(A, B, C), 25, '∠BAC')
    return { ア: int(angleDeg(D, A, C)) }
  },
  'mx-circ-07': () => {
    const P = [3 / Math.sin((25 * Math.PI) / 180), 0]
    const [A, B, C] = [circlePoint(65), circlePoint(-65), circlePoint(180)]
    assertNear(angleDeg(P, A, B), 50, '∠APB')
    return { ア: int(angleDeg([0, 0], A, B)), イ: int(angleDeg(C, A, B)) }
  },
  'mx-circ-08': () => {
    const at = (index) => circlePoint(90 - 30 * index)
    return { ア: int(angleDeg(at(3), at(7), at(0))) }
  },

  'mx-tri-01': () => ({ ア: int(Math.hypot(5, 12)) }),
  'mx-tri-02': () => {
    const h = Math.sqrt(36 - 9)
    const [a, b] = simplifySqrt(int(h * h))
    const area = (6 * h) / 2
    const [c, d] = simplifySqrt(int(area * area))
    return { ア: a, イ: b, ウ: c, エ: d }
  },
  'mx-tri-03': () => ({ ア: int(dist([-1, 2], [3, -1])) }),
  'mx-tri-04': () => ({ ア: int(Math.hypot(3, 4, 12)) }),
  'mx-tri-05': () => ({ ア: int(2 * Math.sqrt(25 - 9)), イ: int(Math.sqrt(169 - 25)) }),
  'mx-tri-06': () => {
    const halfDiagonal = Math.sqrt(8)
    const h = Math.sqrt(36 - halfDiagonal ** 2)
    const [a, b] = simplifySqrt(int(h * h))
    // 体積 = (1/3)·16·h = (16a/3)√b
    const volume = q(16 * a, 3)
    return { ア: a, イ: b, ウ: volume.n, エ: b, オ: volume.d }
  },
  'mx-tri-07': () => {
    const BF = Math.sqrt(10 ** 2 - 6 ** 2)
    const FC = 10 - BF
    // DE = x：x^2 = (6-x)^2 + FC^2 を解く。
    const x = q(36 + int(FC * FC), 12)
    return { ア: int(BF), イ: x.n, ウ: x.d }
  },
  'mx-tri-08': () => {
    const angle = (360 * 2) / 8
    const chord = 2 * 8 * Math.sin(((angle / 2) * Math.PI) / 180)
    const [a, b] = simplifySqrt(int(chord * chord))
    return { ア: a, イ: b }
  },

  'mx-sample-01': () => ({ ア: 1 }),
  'mx-sample-02': () => ({ ア: q(20000 * 2, 50).toInt() }),
  'mx-sample-03': () => ({ ア: q(60 * 50, 6).toInt() }),
  'mx-sample-04': () => ({ ア: 600, イ: 60 }),
  'mx-sample-05': () => ({ ア: q(2400 * 102, 120).toInt() }),
  'mx-sample-06': () => ({ ア: q(400 * (30 - 12), 30).toInt() }),
  'mx-sample-07': () => ({ ア: 1 }),
  'mx-sample-08': () => ({ ア: q(300 * 170, 6).toInt() - 300 }),
}

// 図の点・長さ・角が問題の条件と合うか。
export const figures = {
  'mx-eq2-07': (f) => {
    const outer = f.polygons.at(-1).pts
    assert(JSON.stringify(outer) === JSON.stringify([[0, 0], [30, 0], [30, 20], [0, 20]]), '土地の大きさ')
    const beds = f.polygons.slice(0, 4).reduce((s, polygon) => {
      const [p, , r] = polygon.pts
      return s + Math.abs((r[0] - p[0]) * (r[1] - p[1]))
    }, 0)
    assertNear(beds, 504, '花だんの面積')
  },
  'mx-qfn0-05': (f) => {
    const { A, B } = f.points
    for (const P of [A, B]) {
      assertNear(P[1], P[0] * P[0] / 2, '放物線上にない')
      assertNear(P[1], P[0] + 4, '直線上にない')
    }
  },
  'mx-qfn0-08': (f) => {
    const { A, B } = f.points
    for (const P of [A, B]) assertNear(P[1], P[0] * P[0], '放物線上にない')
    assert(!('P' in f.points), '答えの点Pを図に描いている')
  },
  'mx-simil-02': (f) => {
    const { A, B, C, D, E } = f.points
    assertNear(dist(A, D), 4, 'AD')
    assertNear(dist(D, B), 2, 'DB')
    assertNear(dist(A, E), 6, 'AE')
    assertNear(dist(B, C), 9, 'BC')
    assertNear(D[1], E[1], 'DE が BC に平行でない')
  },
  'mx-simil-05': (f) => {
    const { A, B, C, D, E, F } = f.points
    assertNear(dist(A, D), 4, 'AD')
    assertNear(dist(B, C), 10, 'BC')
    assertNear(dist(A, E) / dist(E, B), 0.5, 'AE:EB')
    assertNear(E[1], F[1], 'EF が BC に平行でない')
  },
  'mx-simil-07': (f) => {
    const { A, B, C, D } = f.points
    assertNear(dist(A, C), 8, 'AC')
    assertNear(dist(B, D), 6, 'BD')
  },
  'mx-simil-08': (f) => {
    const { A, B, C, D } = f.points
    assertNear(angleDeg(A, B, C), 90, '∠BAC')
    assertNear(dist(B, D), 4, 'BD')
    assertNear(dist(D, C), 9, 'DC')
    assertNear(angleDeg(D, A, C), 90, 'AD ⊥ BC')
  },
  'mx-circ-01': (f) => {
    const { O, A, B, C } = f.points
    for (const P of [A, B, C]) assertNear(dist(O, P), 3, '円周上にない')
    assertNear(angleDeg(O, B, C), 130, '∠BOC')
  },
  'mx-circ-02': (f) => {
    const { O, A, B, C } = f.points
    for (const P of [A, B, C]) assertNear(dist(O, P), 3, '円周上にない')
    assertNear(dist(A, B), 6, 'AB が直径でない')
    assertNear(angleDeg(A, B, C), 28, '∠CAB')
  },
  'mx-circ-03': (f) => {
    const { A, B, C, D } = f.points
    for (const P of [A, B, C, D]) assertNear(dist([0, 0], P), 3, '円周上にない')
    assertNear(angleDeg(A, B, C), 35, '∠BAC')
    assertNear(angleDeg(B, D, A), 50, '∠ABD')
  },
  'mx-circ-04': (f) => {
    const { A, B, C } = f.points
    // 弧の中心角 AB:BC:CA = 90:120:150
    assertNear(angleDeg([0, 0], A, B), 90, '弧AB')
    assertNear(angleDeg([0, 0], B, C), 120, '弧BC')
    assertNear(angleDeg([0, 0], C, A), 150, '弧CA')
  },
  'mx-circ-05': (f) => {
    const { A, B, C, D } = f.points
    assertNear(angleDeg(C, A, B), 50, '∠ACB')
    assertNear(angleDeg(D, A, B), 50, '∠ADB')
    assertNear(angleDeg(A, C, D), 30, '∠CAD')
    assert(!f.circles, '円周角の定理の逆の問題に円を描いている')
  },
  'mx-circ-06': (f) => {
    const { O, A, B, C, D } = f.points
    for (const P of [A, B, C, D]) assertNear(dist(O, P), 3, '円周上にない')
    assertNear(dist(A, B), 6, 'AB が直径でない')
    assertNear(angleDeg(A, B, C), 25, '∠BAC')
  },
  'mx-circ-07': (f) => {
    const { O, A, B, P } = f.points
    assertNear(angleDeg(A, O, P), 90, 'PA が接線でない')
    assertNear(angleDeg(B, O, P), 90, 'PB が接線でない')
    assertNear(angleDeg(P, A, B), 50, '∠APB')
  },
  'mx-circ-08': (f) => {
    const names = 'ABCDEFGHIJKL'.split('')
    for (let i = 0; i < 12; i += 1) {
      assertNear(angleDeg([0, 0], f.points[names[i]], f.points[names[(i + 1) % 12]]), 30, '12等分でない')
    }
  },
  'mx-tri-07': (f) => {
    const { A, B, C, D, E, F } = f.points
    assertNear(dist(A, B), 6, 'AB')
    assertNear(dist(A, D), 10, 'AD')
    assertNear(dist(A, F), dist(A, D), 'AF=AD（折り返し）')
    assertNear(dist(E, F), dist(E, D), 'EF=ED（折り返し）')
    assertNear(F[1], B[1], 'F が BC 上にない')
    assertNear(E[0], C[0], 'E が CD 上にない')
  },
  'mx-tri-08': (f) => {
    const { O, Rt } = f.points
    assertNear(dist(O, Rt), 8, '母線')
    assertNear(f.ellipses[0].rx, 2, '底面の半径')
  },
}
