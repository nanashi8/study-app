// 数Iの入試演習の検算。問題文の条件だけから欄の値を計算する（教材の答えは見ない）。
import {
  angleDeg, assert, assertNear, combinations, dist, extremes, int, mean, near, q, range, realRoots, simplifySqrt,
} from './helpers.mjs'

function onlyOption(checks, message) {
  const hits = checks.map((check, index) => (check() ? index : -1)).filter((index) => index >= 0)
  assert(hits.length === 1, `${message}: 当てはまる選択肢が ${hits.length} 個`)
  return hits[0]
}
const rad = (deg) => (deg * Math.PI) / 180
const variance = (list) => mean(list.map((v) => v * v)) - mean(list) ** 2
// 数値 value を (a√b)/c の形の a, b, c に（b は平方因数なし）。候補の b・c を試す。
function asSurd(value, { maxC = 12 } = {}) {
  for (let c = 1; c <= maxC; c += 1) {
    const squared = (value * c) ** 2
    const n = Math.round(squared)
    if (near(squared, n, 1e-9)) {
      const [a, b] = simplifySqrt(n)
      const g = [a, c].reduce((x, y) => (y ? (function f(u, v) { return v ? f(v, u % v) : u })(x, y) : x))
      return { a: a / g, b, c: c / g }
    }
  }
  throw new Error(`a√b/c の形にならない: ${value}`)
}

export const answers = {
  'mx-realexpr-01': () => {
    // 6x^2+x-2 の根（有理数）から (ax-b)(cx+d) を組む。
    const [r1, r2] = realRoots((x) => 6 * x * x + x - 2, -10, 10)
    const neg = q(Math.round(r1 * 3), 3) // -2/3
    const pos = q(Math.round(r2 * 2), 2) // 1/2
    assertNear(neg.value, r1, '負の根')
    assertNear(pos.value, r2, '正の根')
    return { ア: pos.d, イ: pos.n, ウ: neg.d, エ: -neg.n }
  },
  'mx-realexpr-02': () => {
    const value = (Math.sqrt(5) + Math.sqrt(3)) / (Math.sqrt(5) - Math.sqrt(3))
    const integer = Math.round(value - Math.sqrt(15))
    assertNear(value, integer + Math.sqrt(15), 'a+√15 の形にならない')
    return { ア: integer, イ: 15 }
  },
  'mx-realexpr-03': () => {
    const xs = range(-50, 50).filter((x) => Math.abs(2 * x - 3) === 5)
    return { ア: xs[0], イ: xs[1] }
  },
  'mx-realexpr-04': () => {
    const ok = (x) => 3 * x - 1 < 2 * x + 4 && 2 * (x + 1) >= x - 3
    const ints = range(-100, 100).filter(ok)
    // 端：左端はふくむ（≧）、右端はふくまない（<）ことを小数でも確かめる。
    assert(ok(-5) && !ok(-5.001) && ok(4.999) && !ok(5), '範囲の端')
    return { ア: Math.min(...ints), イ: Math.max(...ints) + 1, ウ: ints.length }
  },
  'mx-realexpr-05': () => {
    const x = 1 / (Math.sqrt(5) - 2)
    const y = 1 / (Math.sqrt(5) + 2)
    const cube = asSurd(x ** 3 + y ** 3)
    assert(cube.c === 1, '分母がある')
    return { ア: int(x * x + y * y), イ: cube.a, ウ: cube.b }
  },
  'mx-realexpr-06': () => {
    const P = (x, y) => x * x + x * y - 2 * y * y + 2 * x + 7 * y - 3
    // (x+ay-b)(x-y+c) を、いくつかの (x,y) で比べて a,b,c を総当たりで決める。
    const samples = [[0, 0], [1, 2], [-3, 5], [4, -1], [2, 7]]
    const found = []
    for (const a of range(-5, 5)) for (const b of range(-5, 5)) for (const c of range(-5, 5)) {
      if (samples.every(([x, y]) => (x + a * y - b) * (x - y + c) === P(x, y))) found.push([a, b, c])
    }
    assert(found.length === 1, `候補 ${JSON.stringify(found)}`)
    return { ア: found[0][0], イ: found[0][1], ウ: found[0][2] }
  },
  'mx-realexpr-07': () => {
    const xs = realRoots((x) => Math.abs(x - 1) + Math.abs(x - 3) - 6, -50, 50).map((r) => int(r))
    return { ア: xs[0], イ: xs[1] }
  },
  'mx-realexpr-08': () => {
    // a を細かく動かし、正の整数解がちょうど3個になる範囲の端を調べる。
    const count = (a) => range(1, 100).filter((x) => 3 * x - a < x).length
    const good = range(0, 2000).map((k) => k / 100).filter((a) => count(a) === 3)
    const lo = Math.min(...good)
    const hi = Math.max(...good)
    assert(count(6) !== 3 && count(8) === 3 && count(8.001) !== 3, '端の等号')
    return { ア: int(lo - 0.01), イ: int(hi) }
  },

  'mx-setlogic-01': () => {
    const U = range(1, 20)
    const union = U.filter((n) => n % 2 === 0 || n % 3 === 0)
    return { ア: union.length, イ: U.length - union.length }
  },
  'mx-setlogic-02': () => {
    const reals = range(-400, 400).map((k) => k / 100)
    const p = (x) => x === 2
    const qq = (x) => near(x * x, 4)
    const sufficient = reals.every((x) => !p(x) || qq(x))
    const necessary = reals.every((x) => !qq(x) || p(x))
    return { ア: [sufficient && necessary, !sufficient && necessary, sufficient && !necessary, !sufficient && !necessary].indexOf(true) }
  },
  'mx-setlogic-03': () => {
    const reals = range(-300, 300).map((k) => k / 100)
    const p = (x) => !near(x * x, 1) // x^2 ≠ 1
    const qq = (x) => !near(x, 1) // x ≠ 1
    const original = (x) => !p(x) || qq(x)
    // 選択肢：⓪ x≠1 ⇒ x²≠1、① x=1 ⇒ x²=1、② x²=1 ⇒ x=1。対偶は、どの x でも、もとの命題と真偽が一致する。
    const options = [
      (x) => !qq(x) || p(x),
      (x) => qq(x) || !p(x),
      (x) => p(x) || !qq(x),
    ]
    const ア = onlyOption(options.map((option) => () => reals.every((x) => option(x) === original(x))), 'setlogic-03')
    return { ア, イ: reals.every(original) ? 0 : 1 }
  },
  'mx-setlogic-04': () => ({ ア: range(1, 100).filter((n) => n % 4 !== 0 && n % 6 !== 0).length }),
  'mx-setlogic-05': () => {
    const reals = range(-500, 500).map((k) => k / 100)
    const p = (x) => Math.abs(x) < 2
    const qq = (x) => x > -3 && x < 3
    const sufficient = reals.every((x) => !p(x) || qq(x))
    const necessary = reals.every((x) => !qq(x) || p(x))
    // 選択肢の並び：⓪必要のみ ①十分のみ ②必要十分 ③どちらでもない
    return { ア: [necessary && !sufficient, sufficient && !necessary, sufficient && necessary, !sufficient && !necessary].indexOf(true) }
  },
  'mx-setlogic-06': () => {
    const pairs = range(-5, 5).flatMap((x) => range(-5, 5).map((y) => [x, y]))
    const p = ([x, y]) => x * y === 0
    const qq = ([x]) => x === 0
    const sufficient = pairs.every((pair) => !p(pair) || qq(pair))
    const necessary = pairs.every((pair) => !qq(pair) || p(pair))
    return { ア: [necessary && !sufficient, sufficient && !necessary, sufficient && necessary, !sufficient && !necessary].indexOf(true) }
  },
  'mx-setlogic-07': () => {
    const union = 40 - 7
    const both = 23 + 18 - union
    return { ア: both, イ: 23 - both }
  },
  'mx-setlogic-08': () => {
    // p=2k を p^2=2q^2 に入れる：4k^2 = 2q^2 → q^2 = 2k^2。k=1..5 で係数を確かめる。
    const ratios = range(1, 5).map((k) => ((2 * k) ** 2 / 2) / (k * k))
    assert(new Set(ratios).size === 1, '係数が一定でない')
    return { ア: 0, イ: ratios[0] }
  },

  'mx-qfn-01': () => {
    const f = (x) => 2 * x * x - 8 * x + 5
    const vertexX = 8 / (2 * 2)
    return { ア: vertexX, イ: f(vertexX) }
  },
  'mx-qfn-02': () => {
    const f = (x) => x * x - 4 * x + 1
    const xs = range(0, 500).map((k) => k / 100)
    const ys = xs.map(f)
    const max = Math.max(...ys)
    const min = Math.min(...ys)
    return { ア: int(max), イ: int(xs[ys.indexOf(max)]), ウ: int(min), エ: int(xs[ys.indexOf(min)]) }
  },
  'mx-qfn-03': () => {
    // y=ax^2+bx+c が3点を通る：c=-6、a+b+c=0、9a-3b+c=0
    const c = -6
    // a+b=6, 9a-3b=6 → a = (6*3+6)/(3+9)
    const a = q(6 * 3 + 6, 12)
    const b = q(6).sub(a)
    return { ア: a.toInt(), イ: b.toInt(), ウ: -c }
  },
  'mx-qfn-04': () => {
    const ok = range(-1000, 1000).map((k) => k / 100).filter((x) => x * x - x - 6 < 0)
    return { ア: int(Math.min(...ok) - 0.01), イ: int(Math.max(...ok) + 0.01) }
  },
  'mx-qfn-05': () => {
    const minOf = (a) => extremes((x) => x * x - 2 * a * x + 3, 0, 2, 4000).min
    // a を細かく動かして、最小値が -6 になる a を探す。
    const candidates = range(-2000, 2000).map((k) => k / 400).filter((a) => Math.abs(minOf(a) + 6) < 1e-6)
    assert(candidates.length === 1, `候補 ${candidates}`)
    const a = q(Math.round(candidates[0] * 4), 4)
    return { ア: a.n, イ: a.d }
  },
  'mx-qfn-06': () => {
    const noCross = (k) => (2 * k) ** 2 - 4 * (3 * k + 4) < 0
    const ok = range(-1000, 1000).map((k) => k / 100).filter(noCross)
    return { ア: int(Math.min(...ok) - 0.01), イ: int(Math.max(...ok) + 0.01) }
  },
  'mx-qfn-07': () => {
    const twoPositive = (m) => {
      const roots = realRoots((x) => x * x - 2 * m * x + m + 2, -100, 100, 20000)
      return roots.length === 2 && roots.every((r) => r > 1e-9)
    }
    const ok = range(-500, 600).map((k) => k / 100).filter(twoPositive)
    assert(!twoPositive(2) && twoPositive(2.01), '境目')
    return { ア: int(Math.min(...ok) - 0.01) }
  },
  'mx-qfn-08': () => {
    // もとの放物線上の点 (x, y) を (x+3, y-2) へ移し、x^2 + bx + c の b, c を求める。
    const moved = (X) => {
      const x = X - 3
      return x * x - 4 * x + 3 - 2
    }
    const c = moved(0)
    const b = moved(1) - 1 - c
    return { ア: -b, イ: c }
  },

  'mx-trig-01': () => {
    const theta = Math.asin(3 / 5)
    const c = q(Math.round(Math.cos(theta) * 5), 5)
    const t = q(Math.round(Math.tan(theta) * 4), 4)
    assertNear(c.value, Math.cos(theta), 'cos')
    assertNear(t.value, Math.tan(theta), 'tan')
    return { ア: c.n, イ: c.d, ウ: t.n, エ: t.d }
  },
  'mx-trig-02': () => {
    const R = 6 / Math.sin(rad(30)) / 2
    const b = 2 * R * Math.sin(rad(45))
    const s = asSurd(b)
    return { ア: int(R), イ: s.a, ウ: s.b }
  },
  'mx-trig-03': () => ({ ア: int(Math.sqrt(25 + 64 - 2 * 5 * 8 * Math.cos(rad(60)))) }),
  'mx-trig-04': () => {
    const s = asSurd(0.5 * 6 * 5 * Math.sin(rad(120)))
    return { ア: s.a, イ: s.b, ウ: s.c }
  },
  'mx-trig-05': () => {
    // 座標に置いて測る：B(0,0)、C(7,0)、AB=3、AC=5。
    const x = (49 + 9 - 25) / 14
    const A = [x, Math.sqrt(9 - x * x)]
    const angleA = angleDeg(A, [0, 0], [7, 0])
    const S = (7 * A[1]) / 2
    const s = asSurd(S)
    const r = asSurd((2 * S) / 15)
    assert(r.a === 1, 'r の係数')
    return { ア: int(angleA), イ: s.a, ウ: s.b, エ: s.c, オ: r.b, カ: r.c }
  },
  'mx-trig-06': () => {
    const roots = realRoots((t) => 2 * Math.sin(rad(t)) ** 2 - 3 * Math.cos(rad(t)), 0, 180, 18000)
    assert(roots.length === 1, `解 ${roots}`)
    return { ア: int(roots[0]) }
  },
  'mx-trig-07': () => {
    const a = Math.sqrt(9 + 64 - 2 * 3 * 8 * Math.cos(rad(60)))
    const R = asSurd(a / (2 * Math.sin(rad(60))))
    return { ア: int(a), イ: R.a, ウ: R.b, エ: R.c }
  },
  'mx-trig-08': () => {
    // AH - BH = 20：h/tan30 - h/tan45 = 20
    const h = 20 / (1 / Math.tan(rad(30)) - 1 / Math.tan(rad(45)))
    // h = a√3 + c の形（a、c は整数）
    const a = int((h - Math.round(h - 10 * Math.sqrt(3))) / Math.sqrt(3))
    const c = int(h - a * Math.sqrt(3))
    return { ア: a, イ: 3, ウ: c }
  },

  'mx-dataI-01': () => {
    const data = [4, 6, 8, 10, 12]
    const s = asSurd(Math.sqrt(variance(data)))
    return { ア: int(mean(data)), イ: int(variance(data)), ウ: s.a, エ: s.b }
  },
  'mx-dataI-02': () => {
    // 平均5・分散4になるデータ（3,7 など）を実際に変換して確かめる。
    const x = [3, 7, 3, 7]
    assert(mean(x) === 5 && variance(x) === 4, '例のデータ')
    const y = x.map((v) => 3 * v - 2)
    return { ア: int(mean(y)), イ: int(variance(y)), ウ: int(Math.sqrt(variance(y))) }
  },
  'mx-dataI-03': () => {
    const pts = [[1, 9], [2, 9.5], [3, 8], [4, 8.5], [5, 6], [6, 7], [7, 4.5], [8, 6], [9, 3], [10, 4]]
    const xs = pts.map((p) => p[0])
    const ys = pts.map((p) => p[1])
    const cov = mean(pts.map(([x, y]) => x * y)) - mean(xs) * mean(ys)
    const r = cov / Math.sqrt(variance(xs) * variance(ys))
    const options = [-0.9, -0.2, 0.3, 0.9]
    const distances = options.map((option) => Math.abs(option - r))
    return { ア: distances.indexOf(Math.min(...distances)) }
  },
  'mx-dataI-04': () => {
    const iqr = 30 - 20
    return { ア: 20 - 1.5 * iqr, イ: 30 + 1.5 * iqr }
  },
  'mx-dataI-05': () => {
    const xs = [2, 4, 6, 8, 10]
    const ys = [3, 7, 5, 11, 9]
    const cov = mean(xs.map((x, i) => x * ys[i])) - mean(xs) * mean(ys)
    const r = cov / Math.sqrt(variance(xs) * variance(ys))
    return { ア: Math.floor(cov), イ: int((cov - Math.floor(cov)) * 10), ウ: int(r * 10) }
  },
  'mx-dataI-06': () => {
    // 平均6・分散4 の5個と、平均10・分散8 の5個の例をつくり、合わせた10個の平均と分散を実際に計算する。
    const A = [6 - Math.sqrt(10), 6 + Math.sqrt(10), 6, 6, 6]
    const B = [10 - Math.sqrt(20), 10 + Math.sqrt(20), 10, 10, 10]
    assertNear(mean(A), 6, 'Aの平均')
    assertNear(variance(A), 4, 'Aの分散')
    assertNear(mean(B), 10, 'Bの平均')
    assertNear(variance(B), 8, 'Bの分散')
    const all = [...A, ...B]
    return { ア: int(mean(all)), イ: int(variance(all)) }
  },
  'mx-dataI-07': () => {
    const x = [50, 70, 50, 70]
    assert(mean(x) === 60 && variance(x) === 100, '例のデータ')
    const y = x.map((v) => 1.2 * v + 5)
    return { ア: int(mean(y)), イ: int(variance(y)), ウ: int(Math.sqrt(variance(y))) }
  },
  'mx-dataI-08': () => {
    const count = combinations(range(1, 10), 9).length + combinations(range(1, 10), 10).length
    const p = q(count, 2 ** 10)
    return { ア: p.n, イ: p.d, ウ: p.value < 0.05 ? 0 : 1 }
  },
}

// 図の点・長さ・角が問題の条件と合うか。
export const figures = {
  'mx-trig-08': (f) => {
    const { A, B, H, P } = f.points
    assertNear(dist(A, B), 20, 'AB')
    assertNear(angleDeg(A, H, P), 30, 'Aから見上げる角')
    assertNear(angleDeg(B, H, P), 45, 'Bから見上げる角')
    assertNear(angleDeg(H, A, P), 90, '塔が地面に垂直でない')
  },
  'mx-dataI-03': (f) => {
    assert(f.dots.length === 10, '点の数')
  },
}
