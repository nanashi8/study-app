// 中1の入試演習の検算。問題文の条件だけから欄の値を計算する（教材の答えは見ない）。
import {
  Q, angleDeg, assert, assertNear, dist, gcd, int, mean, median, mode, polygonArea, q, range, seeded,
} from './helpers.mjs'

// 選択式：条件を満たす選択肢がちょうど1つであることを確かめて、その番号を返す。
function onlyOption(checks, message) {
  const hits = checks.map((check, index) => (check() ? index : -1)).filter((index) => index >= 0)
  assert(hits.length === 1, `${message}: 当てはまる選択肢が ${hits.length} 個`)
  return hits[0]
}

export const answers = {
  'mx-pn-01': () => ({ ア: 7 - (-4) * (-3) }),
  'mx-pn-02': () => ({ ア: -(3 ** 2) + (-2) ** 3 }),
  'mx-pn-03': () => ({ ア: q(2, 3).sub(q(5, 6).div(q(-5, 2))).toInt() }),
  'mx-pn-04': () => {
    let n = 252
    const exps = {}
    for (const p of [2, 3, 5, 7, 11, 13]) while (n % p === 0) { exps[p] = (exps[p] ?? 0) + 1; n /= p }
    assert(n === 1, '252 が小さい素数だけで分けきれない')
    const others = Object.keys(exps).map(Number).filter((p) => p !== 2 && p !== 3)
    assert(others.length === 1 && exps[others[0]] === 1, '2・3 以外の素因数が1つ（1乗）でない')
    return { ア: exps[2], イ: exps[3], ウ: others[0] }
  },
  'mx-pn-05': () => {
    const diffs = [8, -5, 12, -3, 3]
    return { ア: int(70 + mean(diffs)), イ: Math.max(...diffs) - Math.min(...diffs) }
  },
  'mx-pn-06': () => {
    for (let n = 1; n < 1000; n += 1) {
      const root = Math.round(Math.sqrt(180 * n))
      if (root * root === 180 * n) return { ア: n, イ: root }
    }
    throw new Error('見つからない')
  },
  'mx-pn-07': () => ({ ア: q(-2).pow(3).mul(q(-3, 4).pow(2)).div(q(-3, 2)).toInt() }),
  'mx-pn-08': () => {
    const rand = seeded(8)
    const samples = Array.from({ length: 4000 }, () => [-(rand() * 20 + 0.01), rand() * 20 + 0.01])
    const always = (f) => samples.every(([a, b]) => f(a, b) < 0)
    return {
      ア: onlyOption([
        () => always((a, b) => a + b),
        () => always((a, b) => a - b),
        () => always((a, b) => b - a),
        () => always((a, b) => a * a * b),
      ], 'pn-08'),
    }
  },

  'mx-expr1-01': () => {
    // 3(2x-5)-2(4x-7) を x=0,1 で調べて ax+b を決める。
    const f = (x) => 3 * (2 * x - 5) - 2 * (4 * x - 7)
    const b = f(0)
    const a = f(1) - b
    return { ア: a, イ: -b }
  },
  'mx-expr1-02': () => {
    // (x+3)/2-(2x-1)/3 を (-x+c)/d の形に。x=0 の値と x の係数から。
    const at = (x) => q(x + 3, 2).sub(q(2 * x - 1, 3))
    const slope = at(1).sub(at(0)) // -1/d
    const d = slope.neg().div(1)
    assert(d.n === 1, '分子の x の係数が -1 にならない')
    const denominator = d.d
    const c = at(0).mul(denominator).toInt()
    return { ア: c, イ: denominator }
  },
  'mx-expr1-03': () => ({ ア: 2 * (-3) ** 2 - 5 * -3 }),
  'mx-expr1-04': () => {
    // おつり 1000-(3a+2b) を、a と b にいろいろな値を入れて確かめる。
    const change = (a, b) => 1000 - (a * 3 + b * 2)
    return { ア: change(0, 0), イ: change(0, 0) - change(1, 0), ウ: change(0, 0) - change(0, 1) }
  },
  'mx-expr1-05': () => {
    const minutes = (x, y) => (x / 4 + y / 12) * 60
    return { ア: int(minutes(1, 0)), イ: int(minutes(0, 1)) }
  },
  'mx-expr1-06': () => {
    const statement = (a, b) => 3 * a - 5 > 2 * b
    const options = [
      (a, b) => 3 * a - 5 > 2 * b,
      (a, b) => 3 * a - 5 < 2 * b,
      (a, b) => 3 * (a - 5) > 2 * b,
      (a, b) => 3 * a - 5 >= 2 * b,
    ]
    const samples = range(-6, 6).flatMap((a) => range(-8, 8).map((b) => [a, b]))
    return { ア: onlyOption(options.map((option) => () => samples.every(([a, b]) => option(a, b) === statement(a, b))), 'expr1-06') }
  },
  'mx-expr1-07': () => {
    const a = q(1, 5)
    const b = q(-3, 2)
    return { ア: q(4).mul(q(2).mul(a).sub(b)).sub(q(3).mul(a.sub(q(2).mul(b)))).toInt() }
  },
  'mx-expr1-08': () => {
    // 正方形 n 個の棒の数を、図の並べ方どおりに数える（横の棒 2n 本＋縦の棒 n+1 本）。
    const sticks = (n) => 2 * n + (n + 1)
    const a = sticks(2) - sticks(1)
    const b = sticks(1) - a
    return { ア: a, イ: b, ウ: sticks(20) }
  },

  'mx-eq1-01': () => ({ ア: range(-50, 50).find((x) => 5 * x - 7 === 2 * x + 8) }),
  'mx-eq1-02': () => ({ ア: range(-100, 100).find((x) => q(x - 1, 3).eq(q(x + 2, 4))) }),
  'mx-eq1-03': () => ({ ア: range(-100, 100).find((x) => (x + 2) * 3 === 6 * 5) }),
  'mx-eq1-04': () => {
    // 3a-7 = 6+a を満たす a（分数）。
    const a = q(6 + 7).div(3 - 1)
    assert(a.mul(3).sub(7).eq(a.add(6)), '代入して成り立たない')
    return { ア: a.n, イ: a.d }
  },
  'mx-eq1-05': () => {
    const x = range(1, 200).find((n) => 3 * n + 8 === 4 * n - 5)
    return { ア: x, イ: 3 * x + 8 }
  },
  'mx-eq1-06': () => ({ ア: range(1, 10000).find((x) => q(x, 60).add(q(x, 90)).eq(50)) }),
  'mx-eq1-07': () => ({ ア: range(0, 1000).find((x) => q(200 * 8, 100).eq(q((200 + x) * 5, 100))) }),
  'mx-eq1-08': () => ({ ア: range(-100, 100).find((x) => q(3, 10).mul(x - 2).eq(q(5, 10).mul(x).add(q(14, 10)))) }),

  'mx-prop-01': () => {
    const a = q(12, -4).toInt()
    return { ア: a, イ: a * 6 }
  },
  'mx-prop-02': () => {
    const a = 3 * -8
    return { ア: a, イ: q(a, -6).toInt() }
  },
  'mx-prop-03': () => {
    const ys = range(-3, 2).map((x) => -2 * x)
    return { ア: Math.min(...ys), イ: Math.max(...ys) }
  },
  'mx-prop-04': () => {
    const a = q(-6, 4)
    return { ア: a.n, イ: a.d }
  },
  'mx-prop-05': () => {
    const a = 2 * 9
    const count = range(-a, a).filter((x) => x !== 0 && a % x === 0).length
    return { ア: a, イ: count }
  },
  'mx-prop-06': () => {
    const A = [3, 2 * 3]
    const a = A[0] * A[1]
    const B = [6, a / 6]
    const area = Q.of(0).add(int(polygonArea([[0, 0], A, B]) * 2)).div(2)
    return { ア: a, イ: area.n, ウ: area.d }
  },
  'mx-prop-07': () => {
    const y = (x) => (x * 6) / 2
    return { ア: y(1), イ: y(0), ウ: y(10) }
  },
  'mx-prop-08': () => {
    const k = 24 * 15
    return { ア: k, イ: q(k, 40).toInt() }
  },

  'mx-plane1-01': () => ({ ア: q(2 * 6 * 120, 360).toInt(), イ: q(36 * 120, 360).toInt() }),
  'mx-plane1-02': () => ({ ア: range(1, 359).find((x) => q(2 * 9 * x, 360).eq(6)) }),
  'mx-plane1-03': () => {
    // A 左上・B 左下・C 右下・D 右上、O は中心。時計回り 90°：(dx, dy) → (dy, -dx)。
    const P = { A: [0, 2], B: [0, 0], C: [2, 0], D: [2, 2] }
    const rotate = ([x, y]) => [1 + (y - 1), 1 - (x - 1)]
    const nameOf = (point) => Object.keys(P).find((key) => dist(P[key], point) < 1e-9)
    const image = new Set([nameOf(rotate(P.A)), nameOf(rotate(P.B))])
    const options = [['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'B']]
    return { ア: onlyOption(options.map((pair) => () => pair.every((name) => image.has(name)) && image.size === 2), 'plane1-03') }
  },
  'mx-plane1-04': () => {
    // ∠XOY を 70° として、二等分線上の点で3つの性質を調べる。
    const deg = 70
    const X = [1, 0]
    const Y = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
    const points = [0.5, 1, 2, 3.7].map((t) => [t * Math.cos((deg * Math.PI) / 360), t * Math.sin((deg * Math.PI) / 360)])
    const distToRay = ([x, y], [ux, uy]) => Math.abs(x * uy - y * ux)
    return {
      ア: onlyOption([
        () => points.every((p) => Math.abs(distToRay(p, X) - distToRay(p, Y)) < 1e-9),
        () => points.every((p) => Math.abs(dist(p, [0, 0]) - dist(p, [4, 0])) < 1e-9),
        () => points.every((p) => Math.abs(angleDeg([0, 0], p, X) - 90) < 1e-9),
      ], 'plane1-04'),
    }
  },
  'mx-plane1-05': () => {
    // 面積 = 18π - 36 を、数値で色のついた部分の面積（格子点で数える）と照らす。
    const inside = (x, y) => Math.hypot(x, y) <= 6 && Math.hypot(x - 6, y - 6) <= 6
    const n = 1200
    let count = 0
    for (let i = 0; i < n; i += 1) for (let j = 0; j < n; j += 1) {
      if (inside(((i + 0.5) * 6) / n, ((j + 0.5) * 6) / n)) count += 1
    }
    const area = (count * 36) / (n * n)
    assertNear(area, 18 * Math.PI - 36, 'plane1-05 の面積', 1e-3)
    return { ア: 18, イ: 36 }
  },
  'mx-plane1-06': () => {
    const r = q(12 * 2, 4).toInt() // 12π = (1/2)(4π) r
    return { ア: r, イ: range(1, 359).find((x) => q(2 * r * x, 360).eq(4)) }
  },
  'mx-plane1-07': () => {
    // Cを中心に、CAが直線上（Cの右側）に重なるまで回す角。
    const A = [3, 3 * Math.sqrt(3)]
    const C = [6, 0]
    const turn = angleDeg(C, A, [12, 0])
    return { ア: q(2 * 6 * int(turn), 360).toInt() }
  },
  'mx-plane1-08': () => {
    const area = q(36 * 90, 360).sub(q(9, 2))
    return { ア: area.n, イ: area.d }
  },

  'mx-space1-01': () => ({ ア: q(6 * 6 * 8, 3).toInt() }),
  'mx-space1-02': () => ({ ア: q(4 * 27, 3).toInt(), イ: 4 * 9 }),
  'mx-space1-03': () => {
    // 直方体の頂点を座標に置き、12辺のうちABとねじれの位置にある辺を数える。
    const V = { A: [0, 0, 1], B: [1, 0, 1], C: [1, 1, 1], D: [0, 1, 1], E: [0, 0, 0], F: [1, 0, 0], G: [1, 1, 0], H: [0, 1, 0] }
    const edges = ['AB', 'BC', 'CD', 'DA', 'EF', 'FG', 'GH', 'HE', 'AE', 'BF', 'CG', 'DH']
    const vec = (e) => V[e[1]].map((c, i) => c - V[e[0]][i])
    const parallel = (e, f) => {
      const [a, b] = [vec(e), vec(f)]
      const cross = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
      return cross.every((c) => c === 0)
    }
    const meet = (e, f) => e[0] === f[0] || e[0] === f[1] || e[1] === f[0] || e[1] === f[1]
    return { ア: edges.filter((e) => e !== 'AB' && !parallel(e, 'AB') && !meet(e, 'AB')).length }
  },
  'mx-space1-04': () => ({ ア: 2 * 16 + 2 * 4 * 5 }),
  'mx-space1-05': () => ({ ア: q(360 * 3, 9).toInt(), イ: q(81 * 3, 9).add(9).toInt() }),
  'mx-space1-06': () => {
    const [r, h, l] = [3, 4, 5]
    assert(r * r + h * h === l * l, '直角三角形になっていない')
    return { ア: q(r * r * h, 3).toInt(), イ: l * r + r * r }
  },
  'mx-space1-07': () => {
    const v = q(3 * 3, 2).mul(3).div(3)
    return { ア: v.n, イ: v.d }
  },
  'mx-space1-08': () => {
    const cylinder = 3 * 3 * 6
    const sphere = q(4 * 27, 3).toInt()
    const g = gcd(cylinder, sphere)
    return { ア: cylinder, イ: cylinder / g, ウ: sphere / g }
  },

  'mx-data1-01': () => {
    const data = [4, 9, 6, 12, 9, 7, 8, 10, 6, 9]
    const m = median(data)
    return { ア: int(mean(data)), イ: Math.floor(m), ウ: int((m - Math.floor(m)) * 10), エ: mode(data) }
  },
  'mx-data1-02': () => {
    const counts = [3, 8, 6, 5, 3]
    const total = counts.reduce((a, b) => a + b, 0)
    return { ア: int((counts[2] / total) * 100), イ: int(((counts[0] + counts[1] + counts[2]) / total) * 100) }
  },
  'mx-data1-03': () => {
    const counts = [3, 8, 6, 5, 3]
    const mids = [5, 15, 25, 35, 45]
    const total = counts.reduce((a, b) => a + b, 0)
    const avg = mids.reduce((s, m, i) => s + m * counts[i], 0) / total
    const top = counts.indexOf(Math.max(...counts))
    return { ア: Math.floor(avg), イ: int((avg - Math.floor(avg)) * 10), ウ: mids[top] }
  },
  'mx-data1-04': () => ({ ア: int(2000 * 0.4) }),
  'mx-data1-05': () => ({ ア: int(7.3 * 10 - 7 * 9) }),
  'mx-data1-06': () => {
    const counts = [2, 6, 9, 5, 3]
    const total = counts.reduce((a, b) => a + b, 0)
    const position = (total + 1) / 2
    let cumulative = 0
    const medianClass = counts.findIndex((count) => (cumulative += count) >= position)
    // 選択肢は 60点台(1)・70点台(2)・80点台(3) の階級（counts の番号）。
    return { ア: [1, 2, 3].indexOf(medianClass), イ: int(((counts[3] + counts[4]) / total) * 100) }
  },
  'mx-data1-07': () => {
    const others = [5, 8, 6, 9, 4, 7]
    const ok = range(0, 100).filter((a) => median([...others, a]) === 6)
    const a = Math.max(...ok)
    const all = [...others, a]
    return { ア: a, イ: Math.max(...all) - Math.min(...all) }
  },
  'mx-data1-08': () => {
    const first = [6, 8, 14, 9, 3]
    const second = [5, 11, 17, 12, 5]
    const share = (list) => (list[0] + list[1]) / list.reduce((a, b) => a + b, 0)
    const [s1, s2] = [share(first), share(second)]
    return { ア: int(s1 * 100), イ: int(s2 * 100), ウ: s1 > s2 ? 0 : s1 < s2 ? 1 : 2 }
  },
}

// 図の点・長さ・角が問題の条件と合うか。
export const figures = {
  'mx-expr1-08': (f) => {
    assert(f.segments.length === 10, '正方形3個の棒は10本')
  },
  'mx-prop-06': (f) => {
    const { A, B } = f.points
    assertNear(A[1], 2 * A[0], 'Aが y=2x 上にない')
    assertNear(A[0], 3, 'Aの x 座標が3でない')
    assertNear(A[0] * A[1], B[0] * B[1], 'A、Bが同じ反比例のグラフ上にない')
    assertNear(B[0], 6, 'Bの x 座標が6でない')
  },
  'mx-prop-07': (f) => {
    const { A, B, C, D, P } = f.points
    assertNear(dist(A, B), 6, 'AB')
    assertNear(dist(B, C), 10, 'BC')
    assertNear(dist(C, D), 6, 'CD')
    assertNear(angleDeg(B, A, C), 90, '∠B')
    assertNear(P[1], 0, 'PがBC上にない')
  },
  'mx-plane1-01': (f) => {
    const { O, A, B } = f.points
    assertNear(dist(O, A), 6, 'OA')
    assertNear(dist(O, B), 6, 'OB')
    assertNear(angleDeg(O, A, B), 120, '中心角')
  },
  'mx-plane1-03': (f) => {
    const { A, B, C, D, O } = f.points
    for (const [p, r] of [[A, B], [B, C], [C, D], [D, A]]) assertNear(dist(p, r), 2, '正方形の辺')
    assertNear(dist(O, A), dist(O, C), 'Oが対角線の交点でない')
    assertNear(dist(O, B), dist(O, D), 'Oが対角線の交点でない')
  },
  'mx-plane1-05': (f) => {
    const { A, B, C, D } = f.points
    for (const [p, r] of [[A, B], [B, C], [C, D], [D, A]]) assertNear(dist(p, r), 6, '正方形の辺')
    assertNear(angleDeg(B, A, C), 90, '∠B')
  },
  'mx-plane1-07': (f) => {
    const { A, B, C } = f.points
    const A2 = f.points['A′']
    assertNear(dist(A, B), 6, 'AB')
    assertNear(dist(B, C), 6, 'BC')
    assertNear(dist(C, A), 6, 'CA')
    assertNear(dist(C, A2), 6, 'CA′')
    assertNear(A2[1], 0, 'A′が直線上にない')
  },
  'mx-plane1-08': (f) => {
    const { O, A, B } = f.points
    assertNear(dist(O, A), 6, 'OA')
    assertNear(dist(O, B), 6, 'OB')
    assertNear(angleDeg(O, A, B), 90, '中心角')
  },
  'mx-space1-01': (f) => {
    const { P1, P2, T, M } = f.points
    assertNear(dist(P1, P2), 6, '底面の手前の辺')
    assertNear(dist(T, M), 8, '高さ')
  },
  'mx-space1-03': (f) => {
    const { A, B, E, F } = f.points
    assertNear(dist(A, B), dist(E, F), '上下の辺の長さ')
    assertNear(dist(A, E), dist(B, F), '縦の辺の長さ')
  },
  'mx-space1-05': (f) => {
    const { T, L, R, M } = f.points
    assertNear(dist(M, R), 3, '底面の半径')
    assertNear(dist(M, L), 3, '底面の半径')
    assertNear(dist(T, R), 9, '母線', 1e-2)
  },
  'mx-space1-06': (f) => {
    const { A, B, C } = f.points
    assertNear(dist(A, B), 4, 'AB')
    assertNear(dist(B, C), 3, 'BC')
    assertNear(dist(C, A), 5, 'CA')
  },
  'mx-space1-07': (f) => {
    const { A, B, D, E, P, Q: Qp, R } = f.points
    assertNear(dist(A, B), 6, 'AB')
    assertNear(dist(A, E), 6, 'AE')
    assertNear(P[0], (A[0] + B[0]) / 2, 'PがABの中点でない')
    assertNear(Qp[1], (A[1] + D[1]) / 2, 'QがADの中点でない')
    assertNear(R[1], (A[1] + E[1]) / 2, 'RがAEの中点でない')
  },
  'mx-space1-08': (f) => {
    assert(f.circles[0].r === 3, '球の半径')
    const [left, right] = [f.segments[0], f.segments[1]]
    assertNear(right[0][0] - left[0][0], 6, '円柱の直径')
    assertNear(left[1][1] - left[0][1], 6, '円柱の高さ')
  },
  'mx-data1-06': (f) => {
    const heights = f.polygons.map((polygon) => polygon.pts[1][1])
    assert(JSON.stringify(heights) === JSON.stringify([2, 6, 9, 5, 3]), `柱の高さ ${heights}`)
  },
}
