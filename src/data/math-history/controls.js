// 数学の歴史の話の「動かしてみよう」で使う操作と、数の書き方の小さな道具。

export const range = (id, label, min, max, step, initial, valueLabel) => ({
  id, label, type: 'range', min, max, step, initial, valueLabel,
})

export const options = (id, label, initial, items) => ({
  id, label, type: 'options', initial, options: items,
})

/** 小数を桁数で丸めて文字にする（-0 は 0）。 */
export const nice = (value, digits = 2) => {
  const rounded = Number(Number(value).toFixed(digits))
  return Object.is(rounded, -0) ? '0' : String(rounded)
}

/** 丸めた値が元の値と同じなら =、違えば ≈（KaTeX）。 */
export const approxTex = (value, digits = 2) =>
  Math.abs(Number(nice(value, digits)) - Number(value)) < 1e-10 ? '=' : '\\approx'

/** 丸めた値が元の値と同じなら =、違えば ≈（文章）。 */
export const approxText = (value, digits = 2) => (approxTex(value, digits) === '=' ? '=' : '≈')

/** 正の数に + を付ける。 */
export const signed = (value) => (Number(value) >= 0 ? `+${nice(value)}` : nice(value))

/** 3けたごとにコンマを入れる。 */
export const withCommas = (value) => Number(value).toLocaleString('en-US')

/** 最大公約数。 */
export const gcd = (a, b) => {
  let x = Math.abs(Math.round(a))
  let y = Math.abs(Math.round(b))
  while (y) [x, y] = [y, x % y]
  return x
}

/** 最小公倍数。 */
export const lcm = (a, b) => Math.abs(Math.round(a) * Math.round(b)) / gcd(a, b)

/**
 * 1より小さい分数 p/q を、引ける中でいちばん大きい単位分数を引いていく方法（フィボナッチの方法）で
 * 単位分数の和に分け、分母の並びを返す。p/q が単位分数ならその分母だけ。
 */
export function unitFractionDenominators(p, q) {
  const denominators = []
  let n = Math.round(p)
  let d = Math.round(q)
  while (n > 0 && denominators.length < 12) {
    const unit = Math.ceil(d / n)
    denominators.push(unit)
    n = n * unit - d
    d *= unit
    const divisor = gcd(n, d) || 1
    n /= divisor
    d /= divisor
  }
  return denominators
}

/** 「3/4」の形の文字を [分子, 分母] にする。 */
export const parseFraction = (text) => String(text).split('/').map(Number)

/** KaTeX の分数。 */
export const fracTex = (numerator, denominator) => `\\frac{${numerator}}{${denominator}}`

const KANJI_DIGITS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']

/** 1〜9999 を漢数字（位の名前を読む書き方）にする。0 は「零」。 */
export function toKanjiNumeral(value) {
  const n = Math.floor(Number(value))
  if (n === 0) return '零'
  const places = [[1000, '千'], [100, '百'], [10, '十'], [1, '']]
  let rest = n
  let text = ''
  for (const [unit, name] of places) {
    const digit = Math.floor(rest / unit)
    rest %= unit
    if (!digit) continue
    text += unit === 1 ? KANJI_DIGITS[digit] : `${digit === 1 ? '' : KANJI_DIGITS[digit]}${name}`
  }
  return text
}

/** 1〜3999 をローマ数字にする。0 は書けないので空文字。 */
export function toRomanNumeral(value) {
  let rest = Math.floor(Number(value))
  if (rest <= 0) return ''
  const table = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let text = ''
  for (const [unit, symbol] of table) {
    while (rest >= unit) {
      text += symbol
      rest -= unit
    }
  }
  return text
}

/** 小数の位の数字の並び（10分の1の位から）を「0.325」の形にする。後ろの0は書かない。すべて0なら「0」。 */
export function decimalText(digits) {
  const trimmed = [...digits]
  while (trimmed.length && Number(trimmed.at(-1)) === 0) trimmed.pop()
  return trimmed.length ? `0.${trimmed.join('')}` : '0'
}

const SIEVE_PRIMES = [2, 3, 5, 7]

/** 2〜100 を並べ、2・3・5・7 の倍数を step 個目の素数まで消したとき（素数そのものは残す）に残る数。 */
export function sieveRemovedBy(value, step) {
  for (const prime of SIEVE_PRIMES.slice(0, step)) {
    if (value !== prime && value % prime === 0) return prime
  }
  return null
}

/** ふるいを step 段まで進めたときに残る数の個数（2〜100）。 */
export function sieveRemaining(step) {
  let count = 0
  for (let value = 2; value <= 100; value += 1) if (!sieveRemovedBy(value, step)) count += 1
  return count
}

/** 円に内接・外接する正 n 角形の周の長さ ÷ 直径（アルキメデスのはさみうち）。 */
export const inscribedPerimeterRatio = (n) => n * Math.sin(Math.PI / n)
export const circumscribedPerimeterRatio = (n) => n * Math.tan(Math.PI / n)

/** 小数第 digits 位で切り捨て・切り上げ（はさみうちの幅を正しく保つため）。 */
// 計算の誤差（2.9999999…）で1つ下にずれないよう、ごく小さい幅を足し引きしてから丸める。
export const floorTo = (value, digits) => (Math.floor(value * 10 ** digits + 1e-9) / 10 ** digits).toFixed(digits)
export const ceilTo = (value, digits) => (Math.ceil(value * 10 ** digits - 1e-9) / 10 ** digits).toFixed(digits)
