// 数Bの入試演習の検算。問題文の条件だけから欄の値を計算する（教材の答えは見ない）。
import {
  assert, assertNear, combinations, int, mean, nCr, q, range, toFraction,
} from './helpers.mjs'

const variance = (list) => mean(list.map((v) => v * v)) - mean(list) ** 2

export const answers = {
  'mx-seq-01': () => {
    // 条件 a3=8、a7=20 を満たす等差数列を作って確かめる。
    const d = (20 - 8) / 4
    const a1 = 8 - 2 * d
    const a = (n) => a1 + (n - 1) * d
    const S20 = range(1, 20).reduce((s, n) => s + a(n), 0)
    return { ア: int(a(2) - a(1)), イ: int(-(a(1) - (a(2) - a(1)))), ウ: int(S20) }
  },
  'mx-seq-02': () => {
    const terms = range(1, 6).map((n) => 3 * 2 ** (n - 1))
    return { ア: terms[5], イ: terms.reduce((s, t) => s + t, 0) }
  },
  'mx-seq-03': () => ({ ア: range(1, 10).reduce((s, k) => s + k * (k + 1), 0) }),
  'mx-seq-04': () => {
    const a = [2]
    for (let n = 1; n < 10; n += 1) a.push(3 * a[n - 1] + 2)
    // a_n = p^n - c の p と c
    const p = (a[2] + 1) / (a[1] + 1)
    const c = p ** 1 - a[0]
    for (let n = 1; n <= 10; n += 1) assert(a[n - 1] === p ** n - c, '一般項の形にならない')
    return { ア: p, イ: c }
  },
  'mx-seq-05': () => {
    const seq = [1, 2, 5, 10, 17]
    // 階差が 1,3,5,7,… と続く数列を20項までのばし、n^2 - bn + c の b、c を最初の2項から決めて全項で確かめる。
    const a = [1]
    for (let n = 1; n < 20; n += 1) a.push(a[n - 1] + (2 * n - 1))
    assert(seq.every((v, i) => a[i] === v), '与えられた項と合わない')
    const b = 3 - (a[1] - a[0]) // a2 - a1 = 3 - b
    const c = a[0] - 1 + b // a1 = 1 - b + c
    for (let n = 1; n <= 20; n += 1) assert(a[n - 1] === n * n - b * n + c, '一般項の形にならない')
    return { ア: b, イ: c }
  },
  'mx-seq-06': () => {
    const S = (n) => range(1, n).reduce((s, k) => s.add(q(1, (2 * k - 1) * (2 * k + 1))), q(0))
    // n/(an+b) の a, b を n=1,2 から決めて、ほかの n でも確かめる。
    for (const a of range(1, 5)) for (const b of range(0, 5)) {
      if (range(1, 12).every((n) => S(n).eq(q(n, a * n + b)))) return { ア: a, イ: b }
    }
    throw new Error('見つからない')
  },
  'mx-seq-07': () => {
    // S_n = 2a_n - 3 から、a_n を順に決める：a_1 = 3、S_n = S_{n-1} + a_n = 2a_n - 3 → a_n = S_{n-1} + 3
    const a = []
    let S = 0
    for (let n = 1; n <= 10; n += 1) {
      const an = S + 3
      a.push(an)
      S += an
      assert(S === 2 * an - 3, '条件を満たさない')
    }
    const r = a[1] / a[0]
    for (let n = 1; n <= 10; n += 1) assert(a[n - 1] === a[0] * r ** (n - 1), '等比数列でない')
    return { ア: a[0], イ: r }
  },
  'mx-seq-08': () => {
    const groups = []
    let next = 1
    for (let g = 1; g <= 10; g += 1) {
      groups.push(range(next, next + g - 1))
      next += g
    }
    const tenth = groups[9]
    return { ア: tenth[0], イ: tenth.reduce((s, v) => s + v, 0) }
  },

  'mx-statB-01': () => {
    const faces = range(1, 6)
    const e = toFraction(mean(faces), 12)
    const v = toFraction(variance(faces), 12)
    return { ア: e.n, イ: e.d, ウ: v.n, エ: v.d }
  },
  'mx-statB-02': () => {
    // 二項分布の確率を全部足して期待値・分散を計算する。
    const n = 100
    const p = 1 / 5
    let e = 0
    let e2 = 0
    for (let k = 0; k <= n; k += 1) {
      const prob = nCr(n, k) * p ** k * (1 - p) ** (n - k)
      e += k * prob
      e2 += k * k * prob
    }
    const v = e2 - e * e
    return { ア: int(e, '期待値'), イ: int(Math.round(v * 1e6) / 1e6, '分散'), ウ: int(Math.round(Math.sqrt(v) * 1e6) / 1e6, '標準偏差') }
  },
  'mx-statB-03': () => {
    // 期待値4・分散9 の確率変数の例（1 と 7 が半々）を変換して確かめる。
    const values = [1, 7]
    assertNear(mean(values), 4, '例の期待値')
    assertNear(variance(values), 9, '例の分散')
    const y = values.map((x) => -2 * x + 5)
    return { ア: int(mean(y)), イ: int(variance(y)), ウ: int(Math.sqrt(variance(y))) }
  },
  'mx-statB-04': () => {
    const z = (70 - 50) / 10
    assert(z === 2, '標準化')
    return { ア: int((0.5 - 0.4772) * 10000) }
  },
  'mx-statB-05': () => {
    const half = (1.96 * 10) / Math.sqrt(49)
    const lo = 60 - half
    const hi = 60 + half
    return { ア: Math.floor(lo), イ: int((lo - Math.floor(lo)) * 10), ウ: Math.floor(hi), エ: int((hi - Math.floor(hi)) * 10) }
  },
  'mx-statB-06': () => {
    const mu = 400 * 0.5
    const sigma = Math.sqrt(400 * 0.5 * 0.5)
    const z = (215 - mu) / sigma
    assert(z === 1.5, '標準化')
    return { ア: int((0.5 - 0.4332) * 10000) }
  },
  'mx-statB-07': () => {
    const mu = 180 / 6
    const sigma = Math.sqrt(180 * (1 / 6) * (5 / 6))
    const z = (42 - mu) / sigma
    return { ア: Math.floor(z), イ: int((z - Math.floor(z)) * 10), ウ: Math.abs(z) > 1.96 ? 0 : 1 }
  },
  'mx-statB-08': () => {
    const pairs = combinations([1, 2, 3, 4], 2)
    const xs = pairs.map((pair) => Math.max(...pair))
    const e = toFraction(mean(xs), 20)
    const v = toFraction(variance(xs), 20)
    return { ア: e.n, イ: e.d, ウ: v.n, エ: v.d }
  },
}

export const figures = {}
