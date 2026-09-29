// 数Aの入試演習の検算。問題文の条件だけから欄の値を計算する（教材の答えは見ない）。
import {
  angleDeg, assert, assertNear, combinations, dist, gcd, int, permutations, product, q, range,
} from './helpers.mjs'

const DICE = range(1, 6)
const fraction = (value) => ({ n: value.n, d: value.d })
// 並びを回転して同じものを1つにまとめる（円順列の総当たり用）。
const rotations = (list) => list.map((_, index) => [...list.slice(index), ...list.slice(0, index)])
const canonical = (list) => rotations(list).map((r) => r.join('')).sort()[0]
const lineMeetAt = ([ax, ay], [bx, by], [cx, cy], [dx, dy]) => {
  const [rx, ry] = [bx - ax, by - ay]
  const [sx, sy] = [dx - cx, dy - cy]
  const det = rx * sy - ry * sx
  const t = ((cx - ax) * sy - (cy - ay) * sx) / det
  return [ax + t * rx, ay + t * ry]
}
const ratioAsInts = (a, b, max = 20) => {
  for (let d = 1; d <= max; d += 1) {
    for (let n = 1; n <= max; n += 1) {
      if (Math.abs(a * d - b * n) < 1e-9 * Math.max(1, a, b)) return [n, d]
    }
  }
  throw new Error(`整数の比にならない ${a}:${b}`)
}

export const answers = {
  'mx-count-01': () => {
    const people = ['M1', 'M2', 'M3', 'W1', 'W2']
    const lines = permutations(people)
    return { ア: lines.filter((line) => Math.abs(line.indexOf('W1') - line.indexOf('W2')) === 1).length }
  },
  'mx-count-02': () => {
    const V = range(0, 7)
    const triangles = combinations(V, 3).length
    const diagonals = combinations(V, 2).filter(([a, b]) => ![1, 7].includes(Math.abs(a - b))).length
    return { ア: triangles, イ: diagonals }
  },
  'mx-count-03': () => {
    const all = product(DICE, DICE, DICE)
    const p = q(all.filter((roll) => roll.includes(6)).length, all.length)
    return { ア: p.n, イ: p.d }
  },
  'mx-count-04': () => {
    const all = product(DICE, DICE, DICE, DICE)
    const p = q(all.filter((roll) => roll.filter((v) => v === 1).length === 2).length, all.length)
    return { ア: p.n, イ: p.d }
  },
  'mx-count-05': () => {
    const people = ['A', 'B', 'C', 'D', 'E', 'F']
    const seatings = new Set(permutations(people).map(canonical))
    const list = [...seatings].map((s) => s.split(''))
    const adjacent = list.filter((s) => {
      const i = s.indexOf('A')
      return s[(i + 1) % 6] === 'B' || s[(i + 5) % 6] === 'B'
    }).length
    const opposite = list.filter((s) => s[(s.indexOf('A') + 3) % 6] === 'B').length
    return { ア: adjacent, イ: opposite }
  },
  'mx-count-06': () => {
    // 右(R)5回・上(U)3回の並べ方を総当たりで数える。
    const routes = new Set(permutations(['R', 'R', 'R', 'R', 'R', 'U', 'U', 'U']).map((r) => r.join('')))
    const passP = [...routes].filter((r) => {
      let x = 0
      let y = 0
      for (const step of r) {
        if (x === 2 && y === 1) return true
        if (step === 'R') x += 1
        else y += 1
      }
      return x === 2 && y === 1
    })
    return { ア: routes.size, イ: passP.length }
  },
  'mx-count-07': () => {
    // さいころ6通り × くじ5本 を同じ重みで総当たり。
    const outcomes = product(DICE, range(0, 4)).map(([die, ticket]) => {
      const box = die <= 2 ? 'A' : 'B'
      const win = box === 'A' ? ticket < 3 : ticket < 1
      return { box, win }
    })
    const wins = outcomes.filter((o) => o.win)
    const pWin = q(wins.length, outcomes.length)
    const pAgivenWin = q(wins.filter((o) => o.box === 'A').length, wins.length)
    return { ア: pWin.n, イ: pWin.d, ウ: pAgivenWin.n, エ: pAgivenWin.d }
  },
  'mx-count-08': () => {
    const rolls = product(DICE, DICE)
    const e = rolls.reduce((sum, [a, b]) => sum.add(Math.max(a, b)), q(0)).div(rolls.length)
    return { ア: e.n, イ: e.d }
  },

  'mx-geomA-01': () => {
    const [B, C] = [[0, 0], [5, 0]]
    const x = (36 - 16 + 25) / 10
    const A = [x, Math.sqrt(36 - x * x)]
    // A の角の二等分線の方向（単位ベクトルの和）と BC の交点。
    const u = [(B[0] - A[0]) / 6, (B[1] - A[1]) / 6]
    const v = [(C[0] - A[0]) / 4, (C[1] - A[1]) / 4]
    const D = lineMeetAt(A, [A[0] + u[0] + v[0], A[1] + u[1] + v[1]], B, C)
    return { ア: int(dist(B, D)), イ: int(dist(D, C)) }
  },
  'mx-geomA-02': () => {
    // 重心：A(0,9)、M(0,0) の中線で、G は B,C の取り方によらず A から 2/3。
    const A = [0, 9]
    const B = [-4, 0]
    const C = [4, 0]
    const G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3]
    // 内心：∠A=50°、∠B=70°、∠C=60° の三角形で ∠BIC を測る。
    const Bp = [0, 0]
    const Cp = [6, 0]
    const rad = (deg) => (deg * Math.PI) / 180
    const I = lineMeetAt(Bp, [Math.cos(rad(35)), Math.sin(rad(35))], Cp, [6 - Math.cos(rad(30)), Math.sin(rad(30))])
    return { ア: int(dist(A, G)), イ: int(angleDeg(I, Bp, Cp)) }
  },
  'mx-geomA-03': () => {
    // 座標で、AD と CF の交点を通る直線 BP が CA を分ける比を測る。
    const A = [2, 5]
    const B = [0, 0]
    const C = [8, 0]
    const D = [B[0] + (C[0] - B[0]) * 0.75, 0]
    const F = [A[0] + (B[0] - A[0]) / 3, A[1] + (B[1] - A[1]) / 3]
    const P = lineMeetAt(A, D, C, F)
    const E = lineMeetAt(B, P, C, A)
    const [n, d] = ratioAsInts(dist(C, E), dist(E, A))
    return { ア: n, イ: d }
  },
  'mx-geomA-04': () => ({ ア: q(4 * 6, 3).toInt() }),
  'mx-geomA-05': () => {
    const A = [1, 5]
    const B = [0, 0]
    const C = [8, 0]
    const D = [B[0] + (C[0] - B[0]) * 0.4, 0]
    const E = [C[0] + (A[0] - C[0]) / 3, C[1] + (A[1] - C[1]) / 3]
    const P = lineMeetAt(A, D, B, E)
    const [a1, a2] = ratioAsInts(dist(A, P), dist(P, D))
    const [b1, b2] = ratioAsInts(dist(B, P), dist(P, E))
    return { ア: a1, イ: a2, ウ: b1, エ: b2 }
  },
  'mx-geomA-06': () => ({ ア: int(Math.sqrt(4 * (4 + 5))) }),
  'mx-geomA-07': () => {
    const d = 9
    const outer = d * d - (5 - 2) ** 2
    const inner = d * d - (5 + 2) ** 2
    const split = (n) => {
      let a = 1
      let b = n
      for (let k = 2; k * k <= b; k += 1) while (b % (k * k) === 0) { b /= k * k; a *= k }
      return [a, b]
    }
    const [a, b] = split(outer)
    const [c, e] = split(inner)
    return { ア: a, イ: b, ウ: c, エ: e }
  },
  'mx-geomA-08': () => {
    const [a, b, c] = [3, 4, 5]
    assert(a * a + b * b === c * c, '直角三角形でない')
    const r = q(a * b, a + b + c) // S = ab/2 = r(a+b+c)/2
    const R = q(c, 2)
    return { ア: r.toInt(), イ: R.n, ウ: R.d }
  },

  'mx-intA-01': () => {
    const divisors = range(1, 360).filter((d) => 360 % d === 0)
    return { ア: divisors.length, イ: divisors.reduce((s, d) => s + d, 0) }
  },
  'mx-intA-02': () => {
    const g = gcd(1071, 1029)
    return { ア: g, イ: (1071 * 1029) / g }
  },
  'mx-intA-03': () => ({ ア: Number.parseInt('110101', 2), イ: Number((25).toString(3)) }),
  'mx-intA-04': () => {
    let r = 1
    for (let k = 0; k < 100; k += 1) r = (r * 7) % 5
    return { ア: r }
  },
  'mx-intA-05': () => {
    // 整数解を総当たりで集め、x=5k+a、y=-7k-b の形に合う a,b（0≦a<5）を決める。
    const sols = range(-40, 40).flatMap((x) => range(-60, 60).map((y) => [x, y])).filter(([x, y]) => 7 * x + 5 * y === 1)
    const base = sols.find(([x]) => x >= 0 && x < 5)
    for (const [x, y] of sols) {
      const k = (x - base[0]) / 5
      assert(Number.isInteger(k) && y === base[1] - 7 * k, '一般解の形にならない')
    }
    return { ア: base[0], イ: -base[1] }
  },
  'mx-intA-06': () => {
    const sols = range(1, 100).flatMap((x) => range(1, 100).map((y) => [x, y])).filter(([x, y]) => 11 * x + 7 * y === 100)
    assert(sols.length === 1, `解 ${JSON.stringify(sols)}`)
    return { ア: sols[0][0], イ: sols[0][1] }
  },
  'mx-intA-07': () => {
    const values = range(2, 60).map((n) => n ** 3 - n)
    return { ア: values.reduce((g, v) => gcd(g, v)) }
  },
  'mx-intA-08': () => {
    const count = (n) => range(1, n).filter((d) => n % d === 0).length
    return { ア: range(1, 1000).find((n) => count(n) === 6), イ: range(1, 1000).find((n) => count(n) === 10) }
  },
}

// 図の点・長さ・角が問題の条件と合うか。
export const figures = {
  'mx-count-06': (f) => {
    const { A, B, P } = f.points
    assert(B[0] - A[0] === 5 && B[1] - A[1] === 3, 'AからBまでの区画数')
    assert(P[0] === 2 && P[1] === 1, 'Pの位置')
  },
  'mx-geomA-01': (f) => {
    const { A, B, C, D } = f.points
    assertNear(dist(A, B), 6, 'AB')
    assertNear(dist(A, C), 4, 'AC')
    assertNear(dist(B, C), 5, 'BC')
    assertNear(angleDeg(A, B, D), angleDeg(A, D, C), 'AD が二等分線でない')
  },
  'mx-geomA-03': (f) => {
    const { A, B, C, D, E, F, P } = f.points
    assertNear(dist(A, F) / dist(F, B), 1 / 2, 'AF:FB')
    assertNear(dist(B, D) / dist(D, C), 3, 'BD:DC')
    assertNear(dist(C, E) / dist(E, A), 2 / 3, 'CE:EA')
    const onLine = (U, V, W) => Math.abs((V[0] - U[0]) * (W[1] - U[1]) - (V[1] - U[1]) * (W[0] - U[0])) < 1e-9
    assert(onLine(A, D, P) && onLine(B, E, P) && onLine(C, F, P), '3本が1点で交わらない')
  },
  'mx-geomA-04': (f) => {
    const { A, B, C, D, P } = f.points
    assertNear(dist(P, A), 4, 'PA')
    assertNear(dist(P, B), 6, 'PB')
    assertNear(dist(P, C), 3, 'PC')
    const center = f.circles[0].c
    const radius = dist(center, A)
    for (const X of [B, C, D]) assertNear(dist(center, X), radius, '円周上にない')
  },
  'mx-geomA-05': (f) => {
    const { A, B, C, D, E } = f.points
    assertNear(dist(B, D) / dist(D, C), 2 / 3, 'BD:DC')
    assertNear(dist(C, E) / dist(E, A), 1 / 2, 'CE:EA')
  },
  'mx-geomA-06': (f) => {
    const { P, T, A, B } = f.points
    const r = f.circles[0].r
    for (const X of [T, A, B]) assertNear(dist([0, 0], X), r, '円周上にない')
    assertNear(angleDeg(T, [0, 0], P), 90, 'PT が接線でない')
    assertNear(dist(P, A), 4, 'PA')
    assertNear(dist(A, B), 5, 'AB')
  },
}
