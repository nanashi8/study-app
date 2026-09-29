// 数Cの入試演習の検算。問題文の条件だけから欄の値を計算する（教材の答えは見ない）。
import {
  assert, assertNear, int, near, range, simplifySqrt, toFraction,
} from './helpers.mjs'

const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0)
const len = (u) => Math.sqrt(dot(u, u))
const C = (re, im = 0) => ({ re, im })
const cmul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re)
const cpow = (a, n) => Array.from({ length: n }).reduce((acc) => cmul(acc, a), C(1))
// 実数 value を (p ± √s)/d の p, s, d に（s は平方因数なし・1より大きい）。
function surdParts(value) {
  for (let d = 1; d <= 12; d += 1) for (const s of [2, 3, 5, 6, 7]) for (const sign of [1, -1]) {
    const p = value * d - sign * Math.sqrt(s)
    if (near(p, Math.round(p), 1e-9)) return { p: Math.round(p), sign, s, d }
  }
  throw new Error(`形にならない: ${value}`)
}

export const answers = {
  'mx-vector-01': () => {
    const v = [2 * 2 - 1, 2 * -1 - 3]
    return { ア: v[0], イ: v[1], ウ: dot(v, v) }
  },
  'mx-vector-02': () => {
    // |a|=2、|b|=3、a·b=-3 を満たす具体的なベクトルで測る。
    const a = [2, 0]
    const cos = -3 / (2 * 3)
    const b = [3 * cos, 3 * Math.sqrt(1 - cos * cos)]
    assertNear(dot(a, b), -3, '内積')
    const theta = (Math.acos(dot(a, b) / (len(a) * len(b))) * 180) / Math.PI
    const s = [a[0] + b[0], a[1] + b[1]]
    return { ア: int(theta), イ: int(dot(s, s)) }
  },
  'mx-vector-03': () => {
    const parallel = range(-50, 50).find((x) => 1 * 6 - 2 * x === 0)
    const perpendicular = range(-50, 50).find((x) => 1 * x + 2 * 6 === 0)
    return { ア: parallel, イ: perpendicular }
  },
  'mx-vector-04': () => {
    // 具体的な三角形で D を作り、AD = s·AB + t·AC の s, t を解く。
    const B = [5, 1] // A を原点に置く
    const Cc = [2, 4]
    const D = [B[0] + (Cc[0] - B[0]) * (2 / 3), B[1] + (Cc[1] - B[1]) * (2 / 3)]
    const det = B[0] * Cc[1] - B[1] * Cc[0]
    const s = (D[0] * Cc[1] - D[1] * Cc[0]) / det
    const t = (B[0] * D[1] - B[1] * D[0]) / det
    const fs = toFraction(s, 12)
    const ft = toFraction(t, 12)
    return { ア: fs.n, イ: fs.d, ウ: ft.n, エ: ft.d }
  },
  'mx-vector-05': () => {
    const A = [6, 0] // O を原点に置く
    const B = [2, 5]
    const Cp = [A[0] * (2 / 3), 0]
    const D = [B[0] / 2, B[1] / 2]
    // AD と BC の交点。
    const r = [D[0] - A[0], D[1] - A[1]]
    const sv = [Cp[0] - B[0], Cp[1] - B[1]]
    const t = ((B[0] - A[0]) * sv[1] - (B[1] - A[1]) * sv[0]) / (r[0] * sv[1] - r[1] * sv[0])
    const P = [A[0] + t * r[0], A[1] + t * r[1]]
    // OP = x·OA + y·OB
    const det = A[0] * B[1] - A[1] * B[0]
    const x = (P[0] * B[1] - P[1] * B[0]) / det
    const y = (A[0] * P[1] - A[1] * P[0]) / det
    const fx = toFraction(x, 12)
    const fy = toFraction(y, 12)
    return { ア: fx.n, イ: fx.d, ウ: fy.n, エ: fy.d }
  },
  'mx-vector-06': () => {
    const AB = [-1, 2, 0]
    const AC = [-1, 0, 3]
    const cross = [AB[1] * AC[2] - AB[2] * AC[1], AB[2] * AC[0] - AB[0] * AC[2], AB[0] * AC[1] - AB[1] * AC[0]]
    const area = toFraction(len(cross) / 2, 12)
    return { ア: area.n, イ: area.d }
  },
  'mx-vector-07': () => {
    const ab = (9 + 16 - 13) / 2
    const area = 0.5 * Math.sqrt(9 * 16 - ab * ab)
    const [a, b] = simplifySqrt(int(area * area))
    return { ア: ab, イ: a, ウ: b }
  },
  'mx-vector-08': () => {
    const f = (t) => len([2 + t, 1 - t])
    const ts = range(-3000, 3000).map((k) => k / 1000)
    const vs = ts.map(f)
    const min = Math.min(...vs)
    const t = toFraction(ts[vs.indexOf(min)], 10)
    // 最小値 = (a√b)/c
    for (let c = 1; c <= 6; c += 1) {
      const squared = (min * c) ** 2
      if (near(squared, Math.round(squared), 1e-6)) {
        const [a, b] = simplifySqrt(Math.round(squared))
        return { ア: t.n, イ: t.d, ウ: a, エ: b, オ: c }
      }
    }
    throw new Error('形にならない')
  },

  'mx-curveC-01': () => {
    const p = 8 / 4
    // 焦点 (p,0) と準線 x=-p から等距離にある点が放物線上にあるか確かめる。
    for (const y of [-4, 1, 6]) {
      const x = (y * y) / 8
      assertNear(Math.hypot(x - p, y), x + p, '焦点と準線の性質')
    }
    return { ア: p, イ: -p }
  },
  'mx-curveC-02': () => {
    const c = Math.sqrt(25 - 9)
    // 楕円上の点で、2焦点からの距離の和が 2a になるか確かめる。
    for (const t of [0.3, 1.2, 2.5]) {
      const P = [5 * Math.cos(t), 3 * Math.sin(t)]
      assertNear(Math.hypot(P[0] - c, P[1]) + Math.hypot(P[0] + c, P[1]), 10, '距離の和')
    }
    return { ア: int(c), イ: 10 }
  },
  'mx-curveC-03': () => {
    const r = Math.hypot(1, Math.sqrt(3))
    const theta = toFraction(Math.atan2(Math.sqrt(3), 1) / Math.PI, 12)
    assert(theta.n === 1, 'π/k の形でない')
    return { ア: int(r), イ: theta.d }
  },
  'mx-curveC-04': () => {
    const z = cpow(C(1, 1), 8)
    assert(near(z.im, 0), '実数にならない')
    return { ア: int(z.re) }
  },
  'mx-curveC-05': () => {
    const c = Math.sqrt(16 + 9)
    for (const t of [0.5, 1.4]) {
      const P = [4 * Math.cosh(t), 3 * Math.sinh(t)]
      assertNear(Math.abs(Math.hypot(P[0] - c, P[1]) - Math.hypot(P[0] + c, P[1])), 8, '距離の差')
    }
    // 漸近線の傾き：x が大きいときの y/x
    const slope = toFraction((3 * Math.sinh(20)) / (4 * Math.cosh(20)), 10)
    return { ア: int(c), イ: slope.n, ウ: slope.d }
  },
  'mx-curveC-06': () => {
    // r=4cosθ 上の点を直交座標にし、中心と半径を3点から求める。
    const pts = [0.2, 0.9, -0.7].map((t) => [4 * Math.cos(t) * Math.cos(t), 4 * Math.cos(t) * Math.sin(t)])
    const [[ax, ay], [bx, by], [cx, cy]] = pts
    const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d
    const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d
    return { ア: int(ux), イ: int(uy), ウ: int(Math.hypot(ax - ux, ay - uy)) }
  },
  'mx-curveC-07': () => {
    const roots = [0, 1, 2].map((k) => {
      const t = (Math.PI / 2 + 2 * k * Math.PI) / 3
      return C(2 * Math.cos(t), 2 * Math.sin(t))
    })
    for (const z of roots) {
      const w = cpow(z, 3)
      assertNear(w.re, 0, '実部')
      assertNear(w.im, 8, '虚部')
    }
    const positive = roots.filter((z) => z.re > 1e-9)
    assert(positive.length === 1, '実部が正の解が1つでない')
    const [z] = positive
    const [x1, y1] = [roots[0].re, roots[0].im]
    const [x2, y2] = [roots[1].re, roots[1].im]
    const [x3, y3] = [roots[2].re, roots[2].im]
    const area = Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)) / 2
    const [a, b] = simplifySqrt(int(area * area))
    return { ア: int(z.re * z.re), イ: int(z.im), ウ: a, エ: b }
  },
  'mx-curveC-08': () => {
    const alpha = C(2, 1)
    const candidates = [Math.PI / 3, -Math.PI / 3].map((t) => cmul(alpha, C(Math.cos(t), Math.sin(t))))
    const beta = candidates.find((z) => z.im > 0)
    assert(candidates.filter((z) => z.im > 0).length === 1, '候補が1つに決まらない')
    // 3点が正三角形か確かめる。
    const d = (u, v) => Math.hypot(u.re - v.re, u.im - v.im)
    assertNear(d(C(0), alpha), d(alpha, beta), '辺の長さ')
    assertNear(d(C(0), alpha), d(C(0), beta), '辺の長さ')
    const re = surdParts(beta.re)
    assert(re.sign === -1, '実部の符号の形')
    // 虚部を (e + o√s)/k（e, o, k は1から6の整数、s は2・3・5）の形で探す。
    const found = []
    for (const k of range(1, 6)) for (const e of range(1, 6)) for (const o of range(1, 6)) for (const sq of [2, 3, 5]) {
      if (near((e + o * Math.sqrt(sq)) / k, beta.im, 1e-12)) found.push([e, o, sq, k])
    }
    assert(found.length >= 1, '虚部が形にならない')
    const [e, o, sq, k] = found.sort((x, y) => x[3] - y[3])[0]
    return { ア: re.p, イ: re.s, ウ: re.d, エ: e, オ: o, カ: sq, キ: k }
  },
}

// 図の点・長さ・角が問題の条件と合うか。
export const figures = {
  'mx-vector-05': (f) => {
    const { O, A, B, C: Cp, D, P } = f.points
    assertNear(Math.hypot(Cp[0] - O[0], Cp[1] - O[1]) / Math.hypot(A[0] - Cp[0], A[1] - Cp[1]), 2, 'OC:CA')
    assertNear(D[0], (O[0] + B[0]) / 2, 'D が OB の中点でない')
    assertNear(D[1], (O[1] + B[1]) / 2, 'D が OB の中点でない')
    const onLine = (U, V, W) => Math.abs((V[0] - U[0]) * (W[1] - U[1]) - (V[1] - U[1]) * (W[0] - U[0])) < 1e-9
    assert(onLine(A, D, P) && onLine(B, Cp, P), 'P が交点でない')
  },
}
