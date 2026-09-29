// 中2の入試演習の検算。問題文の条件だけから欄の値を計算する（教材の答えは見ない）。
import {
  angleDeg, assert, assertNear, combinations, dist, gcd, int, median, permutations, product, q, quartiles, range,
} from './helpers.mjs'

const DICE = range(1, 6)
const fraction = (hit, total) => {
  const value = q(hit, total)
  return { ア: value.n, イ: value.d }
}
function onlyOption(checks, message) {
  const hits = checks.map((check, index) => (check() ? index : -1)).filter((index) => index >= 0)
  assert(hits.length === 1, `${message}: 当てはまる選択肢が ${hits.length} 個`)
  return hits[0]
}
// 2元1次連立方程式 a1x+b1y=c1, a2x+b2y=c2 を分数で解く。
function solve2([a1, b1, c1], [a2, b2, c2]) {
  const det = a1 * b2 - a2 * b1
  return [q(c1 * b2 - c2 * b1, det), q(a1 * c2 - a2 * c1, det)]
}

export const answers = {
  'mx-calc2-01': () => {
    // 係数を多項式として引き算する（a^2, ab, b^2）。
    const [p, r] = [[3, -2, 1], [1, -5, 4]]
    const d = p.map((c, i) => c - r[i])
    return { ア: d[0], イ: d[1], ウ: -d[2] }
  },
  'mx-calc2-02': () => {
    // 12x^2y ÷ (-4xy) × 3y を x=2,y=3 と x=5,y=7 で数値計算し、kxy の k を求める。
    const f = (x, y) => (12 * x * x * y) / (-4 * x * y) * 3 * y
    const k = f(2, 3) / (2 * 3)
    assertNear(f(5, 7) / (5 * 7), k, 'xy に比例しない')
    return { ア: int(k) }
  },
  'mx-calc2-03': () => {
    // 3x-2y=6 → y = (3x-6)/2。x=0 と x=1 から傾きと切片。
    const y = (x) => q(3 * x - 6, 2)
    const slope = y(1).sub(y(0))
    return { ア: slope.n, イ: slope.d, ウ: -y(0).toInt() }
  },
  'mx-calc2-04': () => ({ ア: 2 * (3 - 3 * -2) - 3 * (2 * 3 - -2) }),
  'mx-calc2-05': () => {
    const at = (x, y) => q(2 * x - y, 3).sub(q(x - 3 * y, 4))
    // 分母12のときの分子の係数。
    return { ア: at(1, 0).mul(12).toInt(), イ: at(0, 1).mul(12).toInt(), ウ: 12 }
  },
  'mx-calc2-06': () => {
    // S=(a+b)h/2 を満たす (a,b,h) で、a = kS/h - b の k を求める。
    const [a, b, h] = [5, 3, 4]
    const S = ((a + b) * h) / 2
    return { ア: int(((a + b) * h) / S) }
  },
  'mx-calc2-07': () => {
    // n+(n+1)+(n+2) を n=0,1 で調べて An+B、B/A を求める。
    const s = (n) => n + (n + 1) + (n + 2)
    const A = s(1) - s(0)
    const B = s(0)
    return { ア: A, イ: B, ウ: gcd(A, B), エ: B / gcd(A, B) }
  },
  'mx-calc2-08': () => {
    const pairs = range(1, 9).flatMap((a) => range(0, 9).map((b) => [a, b])).filter(([a, b]) => a !== b && b > 0)
    const sumRatio = pairs.map(([a, b]) => ((10 * a + b) + (10 * b + a)) / (a + b))
    const diffRatio = pairs.map(([a, b]) => ((10 * a + b) - (10 * b + a)) / (a - b))
    assert(new Set(sumRatio).size === 1 && new Set(diffRatio).size === 1, 'いつも同じ倍数にならない')
    return { ア: sumRatio[0], イ: diffRatio[0] }
  },

  'mx-simul-01': () => {
    const [x, y] = solve2([3, 2, 7], [1, -2, 5])
    return { ア: x.toInt(), イ: y.toInt() }
  },
  'mx-simul-02': () => {
    // y=2x-5 → 2x - y = 5
    const [x, y] = solve2([2, -1, 5], [4, -3, 11])
    return { ア: x.toInt(), イ: y.toInt() }
  },
  'mx-simul-03': () => {
    const [x, y] = solve2([2, 3, 13], [3, -2, 0])
    assert(q(2, 10).mul(x).add(q(3, 10).mul(y)).eq(q(13, 10)), '1つ目の式')
    return { ア: x.toInt(), イ: y.toInt() }
  },
  'mx-simul-04': () => {
    // 2a+b=7, a+2b=8
    const [a, b] = solve2([2, 1, 7], [1, 2, 8])
    return { ア: a.toInt(), イ: b.toInt() }
  },
  'mx-simul-05': () => {
    const found = range(0, 15).filter((x) => 120 * x + 80 * (15 - x) === 1480)
    assert(found.length === 1, '解が1つでない')
    return { ア: found[0], イ: 15 - found[0] }
  },
  'mx-simul-06': () => {
    const found = range(0, 1500).filter((x) => q(x, 60).add(q(1500 - x, 150)).eq(16))
    assert(found.length === 1, '解が1つでない')
    return { ア: found[0], イ: 1500 - found[0] }
  },
  'mx-simul-07': () => {
    const found = range(0, 500).filter((boys) => q(-5 * boys, 100).add(q(10 * (500 - boys), 100)).eq(5))
    assert(found.length === 1, '解が1つでない')
    const boys = found[0]
    return { ア: q(boys * 95, 100).toInt(), イ: q((500 - boys) * 110, 100).toInt() }
  },
  'mx-simul-08': () => {
    const [x, y] = solve2([1, 1, 5], [1, -1, 1])
    const [a, b] = solve2([x.toInt(), y.toInt(), 7], [y.toInt(), x.toInt(), 8])
    return { ア: a.toInt(), イ: b.toInt() }
  },

  'mx-lin-01': () => {
    const slope = q(-3 - 5, 3 - -1)
    const b = q(5).sub(slope.mul(-1))
    return { ア: slope.toInt(), イ: b.toInt() }
  },
  'mx-lin-02': () => {
    const f = (x) => -3 * x + 2
    const ys = [f(-1), f(3)]
    return { ア: f(5) - f(2), イ: Math.min(...ys), ウ: Math.max(...ys) }
  },
  'mx-lin-03': () => {
    const [x, y] = solve2([2, -1, 1], [1, 1, 5])
    return { ア: x.toInt(), イ: y.toInt() }
  },
  'mx-lin-04': () => ({ ア: 3, イ: -(1 - 3 * 2) }),
  'mx-lin-05': () => {
    const [ax, ay] = solve2([1, 1, 6], [2, -1, 0]).map((v) => v.toInt())
    const B = [6, 0]
    const area = Math.abs(ax * B[1] - B[0] * ay) / 2
    const M = [(ax + B[0]) / 2, (ay + B[1]) / 2]
    const slope = q(M[1], M[0])
    return { ア: int(area), イ: slope.n, ウ: slope.d }
  },
  'mx-lin-06': () => {
    const x = range(10, 60).find((t) => 80 * t === 240 * (t - 10))
    return { ア: x, イ: 80 * x }
  },
  'mx-lin-07': () => {
    const A = [1, 4]
    const B = [5, 2]
    const area = (P) => Math.abs((A[0] - P[0]) * (B[1] - P[1]) - (B[0] - P[0]) * (A[1] - P[1])) / 2
    const target = area([0, 0])
    const found = range(-50, 50).filter((y) => y !== 0 && Math.abs(area([0, y]) - target) < 1e-9)
    assert(found.length === 1, `候補が ${found}`)
    return { ア: found[0] }
  },
  'mx-lin-08': () => {
    const a = (x) => 1000 + 20 * x
    const b = (x) => 400 + 30 * x
    return { ア: range(0, 500).find((x) => a(x) === b(x)), イ: Math.min(a(100), b(100)) }
  },

  'mx-angle-01': () => ({ ア: 180 * (12 - 2), イ: (180 * (12 - 2)) / 12 }),
  'mx-angle-02': () => ({ ア: range(3, 100).find((n) => 360 / n === 24) }),
  'mx-angle-03': () => ({ ア: 40 + 35 }),
  'mx-angle-04': () => ({ ア: 130 - 50 }),
  'mx-angle-05': () => {
    const DBC = 60 - 20
    const DCB = 60 - 25
    return { ア: 180 - DBC - DCB }
  },
  'mx-angle-06': () => ({ ア: 180 - 2 * 50 }),
  'mx-angle-07': () => {
    const n = range(3, 100).find((k) => 180 * (k - 2) === 1440)
    return { ア: n, イ: (n * (n - 3)) / 2 }
  },
  'mx-angle-08': () => ({ ア: 180 - (180 - 64) / 2 }),

  'mx-congr-01': () => ({ ア: 2 }),
  'mx-congr-02': () => ({ ア: (180 - 40) / 2 }),
  'mx-congr-03': () => {
    // 等脚台形（下底6・上底2・高さ3）は「1組の対辺が平行で、もう1組の対辺が等しい」を満たすが、平行四辺形ではない。
    const T = [[0, 0], [6, 0], [4, 3], [2, 3]]
    const parallel = (p1, p2, p3, p4) => Math.abs((p2[0] - p1[0]) * (p4[1] - p3[1]) - (p2[1] - p1[1]) * (p4[0] - p3[0])) < 1e-9
    assert(parallel(T[0], T[1], T[3], T[2]), '上底と下底が平行でない')
    assertNear(dist(T[0], T[3]), dist(T[1], T[2]), '脚の長さ')
    assert(!parallel(T[0], T[3], T[1], T[2]), '平行四辺形になってしまう')
    return { ア: 1 }
  },
  'mx-congr-04': () => ({ ア: 180 - 110, イ: 2 * (5 + 8) }),
  'mx-congr-05': () => ({ ア: 1, イ: 2, ウ: 1 }),
  'mx-congr-06': () => {
    // 図と同じ作り方で座標をとり、BD・AD を測る。
    const A = [2, 2 * Math.tan((72 * Math.PI) / 180)]
    const t = (4 * Math.sin((72 * Math.PI) / 180)) / Math.sin((72 * Math.PI) / 180)
    const D = [t * Math.cos((36 * Math.PI) / 180), t * Math.sin((36 * Math.PI) / 180)]
    // D が辺AC上にあることを確かめる。
    const onAC = Math.abs((4 - A[0]) * (D[1] - A[1]) - (0 - A[1]) * (D[0] - A[0])) < 1e-9
    assert(onAC, 'D が AC 上にない')
    return { ア: int(dist([0, 0], D)), イ: int(dist(A, D)) }
  },
  'mx-congr-07': () => {
    // AB=6、∠B の二等分線が AD と交わる点 E：△ABE は二等辺三角形になる（図と同じ座標で測る）。
    const A = [3, 3 * Math.sqrt(3)]
    const E = [A[1] / Math.tan((30 * Math.PI) / 180), A[1]]
    return { ア: int(dist(A, E)), イ: int(13 - E[0]) }
  },
  'mx-congr-08': () => ({ ア: 1, イ: 3 }),

  'mx-prob-01': () => fraction(product(DICE, DICE).filter(([a, b]) => a + b === 7).length, 36),
  'mx-prob-02': () => fraction(product([0, 1], [0, 1], [0, 1]).filter((c) => c.filter(Boolean).length === 2).length, 8),
  'mx-prob-03': () => {
    const balls = ['r1', 'r2', 'r3', 'w1', 'w2']
    const pairs = combinations(balls, 2)
    return fraction(pairs.filter((pair) => pair.every((ball) => ball.startsWith('r'))).length, pairs.length)
  },
  'mx-prob-04': () => {
    const pairs = combinations(['A', 'B', 'C', 'D'], 2)
    return fraction(pairs.filter((pair) => pair.includes('A')).length, pairs.length)
  },
  'mx-prob-05': () => fraction(product(DICE, DICE).filter(([a, b]) => b % a === 0).length, 36),
  'mx-prob-06': () => {
    const orders = permutations([1, 2, 3, 4, 5], 2)
    return fraction(orders.filter(([t, o]) => (10 * t + o) % 3 === 0).length, orders.length)
  },
  'mx-prob-07': () => fraction(product(DICE, DICE).filter(([a, b]) => a * b === 12).length, 36),
  'mx-prob-08': () => fraction(product(DICE, DICE).filter(([a, b]) => (a + b) % 4 === 2).length, 36),

  'mx-data2-01': () => {
    const [q1, q2, q3] = quartiles([12, 4, 9, 18, 6, 2, 14, 7, 11])
    return { ア: int(q1), イ: int(q2), ウ: int(q3) }
  },
  'mx-data2-02': () => {
    const data = [20, 15, 26, 12, 18, 30, 21, 17, 25, 23]
    const [q1, , q3] = quartiles(data)
    return { ア: int(q3 - q1), イ: Math.max(...data) - Math.min(...data) }
  },
  'mx-data2-03': () => ({ ア: 45, イ: 60 - 35 }),
  'mx-data2-04': () => {
    const [min, q1, med, q3, max] = [30, 50, 62, 75, 95]
    return {
      ア: onlyOption([
        () => q3 - q1 === 45,
        () => med === 62.5,
        () => max - min === 65,
      ], 'data2-04'),
    }
  },
  'mx-data2-05': () => {
    const data = [4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 20]
    const [q1, q2, q3] = quartiles(data)
    const candidates = [[4, 6, 12, 16, 20], [4, 7, 10, 16, 20], [4, 7, 12, 16, 20]]
    const truth = [Math.min(...data), q1, q2, q3, Math.max(...data)]
    return { ア: onlyOption(candidates.map((box) => () => JSON.stringify(box) === JSON.stringify(truth)), 'data2-05') }
  },
  'mx-data2-06': () => {
    // 30個を小さい順に x1…x30 とすると、第1四分位数は前半15個の中央値 x8、中央値は x15 と x16 の平均。
    const n = 30
    const half = n / 2
    const q1Position = (half + 1) / 2 // 8番目
    const upperMedianPosition = half + 1 // 16番目
    const atLeastLow = q1Position // x1…x8 は 50 以下
    const atLeastHigh = n - upperMedianPosition + 1 // x16…x30 は 62 以上
    // その人数ちょうどになる例があること（「少なくとも」の最小値であること）を確かめる。
    const example = [30, 35, 40, 42, 45, 48, 49, 50, 55, 56, 57, 58, 59, 60, 61, 63, 64, 66, 68, 70, 72, 75, 75, 80, 82, 85, 88, 90, 92, 95]
    const sorted = [...example].sort((a, b) => a - b)
    assert(median(sorted.slice(0, half)) === 50 && median(sorted) === 62 && median(sorted.slice(half)) === 75, '例が条件を満たさない')
    assert(Math.min(...sorted) === 30 && Math.max(...sorted) === 95, '例の最小値・最大値')
    assert(sorted.filter((v) => v <= 50).length === atLeastLow, '例で50点以下がちょうどにならない')
    assert(sorted.filter((v) => v >= 62).length === atLeastHigh, '例で62点以上がちょうどにならない')
    return { ア: atLeastLow, イ: atLeastHigh }
  },
  'mx-data2-07': () => {
    const A = [40, 55, 65, 70, 90]
    const B = [45, 50, 60, 80, 85]
    return {
      ア: onlyOption([
        () => B[4] - B[0] > A[4] - A[0],
        () => B[3] - B[1] > A[3] - A[1],
        () => B[2] > A[2],
      ], 'data2-07'),
      イ: B[3] - B[1],
    }
  },
  'mx-data2-08': () => {
    const a = range(7, 10).find((value) => median([3, 5, 7, value, 10, 12, 14, 16]) === 9)
    const [, , q3] = quartiles([3, 5, 7, a, 10, 12, 14, 16])
    return { ア: a, イ: int(q3) }
  },
}

// 図の点・長さ・角が問題の条件と合うか。
export const figures = {
  'mx-lin-05': (f) => {
    const { A, B } = f.points
    assertNear(A[1], -A[0] + 6, 'Aが ℓ 上にない')
    assertNear(A[1], 2 * A[0], 'Aが m 上にない')
    assertNear(B[1], 0, 'Bが x 軸上にない')
    assertNear(B[1], -B[0] + 6, 'Bが ℓ 上にない')
  },
  'mx-lin-06': (f) => {
    assertNear(f.curves[0].fn(15), 1200, 'Aさんのグラフ')
    assertNear(f.curves[1].fn(10), 0, '兄の出発')
    assertNear(f.curves[1].fn(15) - f.curves[1].fn(14), 240, '兄の速さ')
  },
  'mx-lin-07': (f) => {
    assert(JSON.stringify(f.points.A) === '[1,4]' && JSON.stringify(f.points.B) === '[5,2]', 'A、B の座標')
    assert(!('P' in f.points), '答えの点Pを図に描いている')
  },
  'mx-angle-03': (f) => {
    const { A, P, B } = f.points
    assertNear(A[1], 3, 'Aが ℓ 上にない')
    assertNear(B[1], 0, 'Bが m 上にない')
    assertNear(angleDeg(A, [10, 3], P), 40, 'ℓ との角')
    assertNear(angleDeg(B, [10, 0], P), 35, 'm との角')
    assertNear(angleDeg(P, A, B), 75, '∠x')
  },
  'mx-angle-04': (f) => {
    const { A, B, C, D } = f.points
    assertNear(angleDeg(A, B, C), 50, '∠A')
    assertNear(angleDeg(C, A, D), 130, '∠ACD')
    assertNear(angleDeg(B, C, A), 80, '∠B')
  },
  'mx-angle-05': (f) => {
    const { A, B, C, D } = f.points
    assertNear(dist(A, B), 6, 'AB')
    assertNear(dist(B, C), 6, 'BC')
    assertNear(dist(C, A), 6, 'CA')
    assertNear(angleDeg(B, A, D), 20, '∠ABD')
    assertNear(angleDeg(C, A, D), 25, '∠ACD')
    assertNear(angleDeg(D, B, C), 105, '∠BDC')
  },
  'mx-angle-06': (f) => {
    const { P, Q, R } = f.points
    assertNear(angleDeg(P, [10, 2], Q), 50, '折り目と上の辺の角')
    assertNear(angleDeg(P, Q, R), 50, '折り返した角')
    assertNear(angleDeg(R, Q, P), 80, '∠x')
    assertNear(Q[1], 0, 'Qが下の辺にない')
    assertNear(R[1], 0, 'Rが下の辺にない')
  },
  'mx-angle-08': (f) => {
    const { A, B, C, P } = f.points
    assertNear(angleDeg(A, B, C), 64, '∠A')
    assertNear(angleDeg(B, C, P), angleDeg(B, P, A), 'BP が二等分線でない')
    assertNear(angleDeg(C, B, P), angleDeg(C, P, A), 'CP が二等分線でない')
    assertNear(angleDeg(P, B, C), 122, '∠BPC')
  },
  'mx-congr-02': (f) => {
    const { A, B, C } = f.points
    assertNear(dist(A, B), dist(A, C), 'AB=AC')
    assertNear(angleDeg(A, B, C), 40, '∠A')
  },
  'mx-congr-04': (f) => {
    const { A, B, C, D } = f.points
    assertNear(dist(A, B), 5, 'AB')
    assertNear(dist(B, C), 8, 'BC')
    assertNear(dist(A, D), 8, 'AD')
    assertNear(angleDeg(A, D, B), 110, '∠A')
  },
  'mx-congr-05': (f) => {
    const { A, B, C, D, O } = f.points
    assertNear(A[1] - B[1], 0, 'AB が水平でない')
    assertNear(D[1] - C[1], 0, 'DC が水平でない')
    assertNear(dist(A, O), dist(C, O), 'AO=CO')
    assertNear((B[0] - O[0]) * (D[1] - O[1]) - (B[1] - O[1]) * (D[0] - O[0]), 0, 'B、O、D が一直線上にない')
  },
  'mx-congr-06': (f) => {
    const { A, B, C, D } = f.points
    assertNear(dist(A, B), dist(A, C), 'AB=AC')
    assertNear(angleDeg(A, B, C), 36, '∠A')
    assertNear(dist(B, C), 4, 'BC')
    assertNear(angleDeg(B, A, D), angleDeg(B, D, C), 'BD が二等分線でない')
    assertNear(dist(B, D), 4, 'BD')
    assertNear(dist(A, D), 4, 'AD')
  },
  'mx-congr-07': (f) => {
    const { A, B, C, D, E } = f.points
    assertNear(dist(A, B), 6, 'AB')
    assertNear(dist(A, D), 10, 'AD')
    assertNear(dist(B, C), 10, 'BC')
    assertNear(angleDeg(B, A, E), angleDeg(B, E, C), 'BE が二等分線でない')
    assertNear(dist(A, E), 6, 'AE')
  },
  'mx-congr-08': (f) => {
    const { O, P, A, B } = f.points
    assertNear(angleDeg(O, [1, 0], P), angleDeg(O, P, [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3)]), 'OP が二等分線でない')
    assertNear(angleDeg(A, O, P), 90, 'PA ⊥ OX')
    assertNear(angleDeg(B, O, P), 90, 'PB ⊥ OY')
    assertNear(dist(P, A), dist(P, B), 'PA=PB')
  },
  'mx-prob-08': (f) => {
    const { A, B, C, D } = f.points
    for (const [p, r] of [[A, B], [B, C], [C, D], [D, A]]) assertNear(dist(p, r), 2, '正方形の辺')
  },
  'mx-data2-03': (f) => {
    const box = f.polygons[0].pts
    assertNear(box[0][0], 35, '第1四分位数')
    assertNear(box[1][0], 60, '第3四分位数')
  },
  'mx-data2-04': (f) => {
    const box = f.polygons[0].pts
    assert(box[0][0] === 50 && box[1][0] === 75, '箱の位置')
    assert(JSON.stringify(f.segments.slice(0, 5).map((segment) => segment[0][0])) === JSON.stringify([30, 75, 62, 30, 95]), 'ひげと中央値の位置')
  },
  'mx-data2-06': (f) => {
    const box = f.polygons[0].pts
    assert(box[0][0] === 50 && box[1][0] === 75, '箱の位置')
    assert(JSON.stringify(f.segments.slice(0, 5).map((segment) => segment[0][0])) === JSON.stringify([30, 75, 62, 30, 95]), 'ひげと中央値の位置')
  },
  'mx-data2-05': (f) => {
    const boxes = f.polygons.map((polygon) => [polygon.pts[0][0], polygon.pts[1][0]])
    assert(JSON.stringify(boxes) === JSON.stringify([[6, 16], [7, 16], [7, 16]]), `箱の位置 ${JSON.stringify(boxes)}`)
  },
  'mx-data2-07': (f) => {
    const boxes = f.polygons.map((polygon) => [polygon.pts[0][0], polygon.pts[1][0]])
    assert(JSON.stringify(boxes) === JSON.stringify([[55, 70], [50, 80]]), `箱の位置 ${JSON.stringify(boxes)}`)
  },
}
