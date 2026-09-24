// 数学の歴史をたどるコース：第2部「中学の数学」の後半（確率・データ・二次方程式・平方根・y＝ax²・相似・円・三平方・標本調査）。
// 話の形は basic-number.js の冒頭を参照。
import { approxTex, nice, options, range } from './controls.js'

// ── 確率：途中でやめた勝負の分け方（フェルマーの方法） ──────────────────────
/** A はあと a 勝、B はあと b 勝で勝ち。残りの最大回数の勝ち負けの並び方をすべて書き出し、勝者を決める。 */
export function pointsOutcomes(a, b) {
  const n = a + b - 1
  return Array.from({ length: 2 ** n }, (_, mask) => {
    const games = Array.from({ length: n }, (__, index) => ((mask >> (n - 1 - index)) & 1 ? 'B' : 'A'))
    let winsA = 0
    let winsB = 0
    let winner = null
    let decidedAt = n
    games.forEach((game, index) => {
      if (winner) return
      if (game === 'A') winsA += 1
      else winsB += 1
      if (winsA === a) winner = 'A'
      else if (winsB === b) winner = 'B'
      if (winner) decidedAt = index + 1
    })
    return { games, winner, decidedAt }
  })
}

const gcdOf = (x, y) => (y ? gcdOf(y, x % y) : x)

function pointsSplit(a, b) {
  const rows = pointsOutcomes(a, b)
  const wa = rows.filter((row) => row.winner === 'A').length
  const wb = rows.length - wa
  const divisor = gcdOf(wa, wb)
  return { n: a + b - 1, total: rows.length, wa, wb, sa: wa / divisor, sb: wb / divisor }
}

// ── 箱ひげ図：10人の点数と、動かせる1人の点数 ─────────────────────────────
export const BOX_BASE = Object.freeze([45, 52, 56, 60, 63, 67, 70, 72, 78, 84])

/** 最小値・第1四分位数・中央値・第3四分位数・最大値（中学の教科書と同じく、中央値を除いた前半・後半の中央値で四分位数を決める）。 */
export function fiveNumbers(values) {
  const sorted = [...values].sort((x, y) => x - y)
  const medianOf = (list) => {
    const mid = Math.floor(list.length / 2)
    return list.length % 2 ? list[mid] : (list[mid - 1] + list[mid]) / 2
  }
  const half = Math.floor(sorted.length / 2)
  return {
    min: sorted[0],
    q1: medianOf(sorted.slice(0, half)),
    median: medianOf(sorted),
    q3: medianOf(sorted.slice(sorted.length - half)),
    max: sorted.at(-1),
    mean: sorted.reduce((sum, value) => sum + value, 0) / sorted.length,
  }
}

// ── 二次方程式：正方形を完成させる ─────────────────────────────────────
const SQUARE_STEPS = ['正方形と長方形', '角を補う', '1辺を求める']

export function completeSquare(b, c) {
  const h = b / 2
  const total = c + h * h
  const root = Math.sqrt(total)
  const exact = Number.isInteger(root)
  return { h, total, root, exact, x: root - h }
}

// ── 平方根の近い値：ヘロンの方法 ───────────────────────────────────────
/** 横 a・たて 1 の長方形から始め、横を「横とたての平均」にかえていく（面積 a のまま正方形に近づく）。 */
export function heronSteps(a, count) {
  const steps = [a]
  for (let index = 0; index < count; index += 1) {
    const x = steps.at(-1)
    steps.push((x + a / x) / 2)
  }
  return steps
}

// ── 相似：太陽の高さと影 ──────────────────────────────────────────────
export const PYRAMID_HEIGHT = 146
export const PYRAMID_BASE = 230
export const SUN_RATIOS = Object.freeze([
  { value: 1, label: '45度（影＝高さ）' },
  { value: 1.5, label: '約34度' },
  { value: 2, label: '約27度' },
])

// ── 標本調査：印をつけた魚 ─────────────────────────────────────────────
export const POND_TOTAL = 400
export const POND_MARKED = 80

const mulberry32 = (seed) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 池の魚の位置（楕円の中）。はじめの POND_MARKED 匹に印がついている。 */
export const POND_FISH = (() => {
  const random = mulberry32(20260924)
  const fish = []
  while (fish.length < POND_TOTAL) {
    const x = random() * 2 - 1
    const y = random() * 2 - 1
    if (x * x + y * y <= 1) fish.push({ x, y, marked: fish.length < POND_MARKED })
  }
  return Object.freeze(fish)
})()

export const RECAPTURE_ROUNDS = 10

/** 2回目の調査：n 匹を、調査の回（s）ごとに決まった乱数で選ぶ。 */
export function recaptureSample(n, s) {
  const random = mulberry32(s * 7919 + n * 104729)
  const order = Array.from({ length: POND_TOTAL }, (_, index) => index)
  for (let index = 0; index < n; index += 1) {
    const pick = index + Math.floor(random() * (POND_TOTAL - index))
    ;[order[index], order[pick]] = [order[pick], order[index]]
  }
  const chosen = order.slice(0, n)
  const marked = chosen.filter((index) => POND_FISH[index].marked).length
  return { chosen, marked, estimate: marked ? (POND_MARKED * n) / marked : null }
}

/** n 匹ずつの調査を RECAPTURE_ROUNDS 回したときの見積もり（見積もれない回は null）。 */
export const recaptureEstimates = (n) => Array.from({ length: RECAPTURE_ROUNDS }, (_, index) => recaptureSample(n, index + 1).estimate)

export const MATH_HISTORY_JUNIOR_MORE = [
  {
    id: 'mh-probability',
    part: 'junior',
    theme: '確率・データ',
    emoji: '🎲',
    title: '確率',
    headline: '途中でやめた勝負の賭け金をどう分けるか——パスカルとフェルマーの手紙',
    era: '1654年',
    year: 1654,
    place: 'フランス',
    people: ['パスカル', 'フェルマー'],
    question: 'まだ終わっていない勝負で、それぞれが勝つ見込みを数で表せるか？',
    story: [
      'サイコロの目の出方や勝負の勝ち負けは、昔から人々の関心の的だった。16世紀のイタリアのカルダーノは、サイコロの目の出方を数える本を書いたが、その本が世に出たのは100年ほどあとだった。',
      '1654年、フランスのパスカルは、知り合いから「途中でやめた勝負の賭け金を、どう分ければ公平か」という問題を聞いた。パスカルはフェルマーと手紙をやりとりして、この問題に答えを出した。',
      'フェルマーの考え方はこうだ。先に3勝した方が勝ちの勝負で、Aが2勝、Bが1勝のところでやめたとする。決着までは、あと最大2回。その2回の勝ち負けの並び方 AA・AB・BA・BB を全部書き出すと、Aが勝つのは3通り、Bが勝つのは1通り。だから賭け金は3：1に分ければよい。',
      'この手紙のやりとりが、起こりやすさを数で表す「確率」の考えの出発点になったとされる。どの場合も同じ程度に起こりやすいとき、確率は（ある場合の数）÷（全部の場合の数）で求められる。',
    ],
    visual: {
      scene: 'points-split',
      instruction: 'AとBがそれぞれ「あと何回勝てばよいか」を変えて、残りの勝ち負けの並び方を全部書き出し、どちらが勝つかを数えよう。',
      controls: [
        range('a', 'Aがあと勝てばよい回数', 1, 3, 1, 1),
        range('b', 'Bがあと勝てばよい回数', 1, 3, 1, 2),
      ],
      formula: ({ a, b }) => {
        const { n, total, wa, wb, sa, sb } = pointsSplit(Number(a), Number(b))
        const reduced = sa !== wa ? `=${sa}:${sb}` : ''
        return `2^{${n}}=${total}\\ \\text{通り}\\qquad A:B=${wa}:${wb}${reduced}`
      },
      insight: ({ a, b }) => {
        const { n, total, wa, wb, sa, sb } = pointsSplit(Number(a), Number(b))
        if (Number(a) === Number(b)) return `AもBも、あと${a}回ずつ勝てばよい。${total}通りのうち${wa}通りずつなので、半分ずつに分けるのが公平。`
        const reduced = sa !== wa ? `（${sa}：${sb}）` : ''
        return `決着までにあと最大${n}回。${total}通りの並び方のうち、Aが勝つのは${wa}通り、Bが勝つのは${wb}通り。賭け金は ${wa}：${wb}${reduced} に分けるのが公平。`
      },
    },
    uses: [
      { emoji: '🌦️', title: '降水確率', text: '「降水確率30%」は、この予報が100回出たとき、そのうちおよそ30回は1mm以上の雨や雪が降るという意味。' },
      { emoji: '🛡️', title: '保険', text: '事故や病気が起こる確率をもとに、集めるお金（保険料）と支払うお金の見積もりを立てている。' },
      { emoji: '🧪', title: '薬の効き目', text: '新しい薬が本当に効いたのか、たまたまよくなったのかを、確率の考えを使って見分ける。' },
    ],
    units: ['prob', 'count'],
    basics: [],
    quiz: [
      {
        id: 'mh-probability-1',
        question: 'サイコロを1回投げて、3の倍数の目が出る確率はいくつか。',
        choices: ['$\\frac{1}{3}$', '$\\frac{1}{2}$', '$\\frac{1}{6}$'],
        answer: 0,
        explanation: '3の倍数の目は3と6の2通り。6通りのうち2通りなので $\\frac{2}{6}=\\frac{1}{3}$。',
        notes: [
          '正解。',
          '偶数の目（2・4・6の3通り）の確率と取りちがえている。',
          '3の目だけを数えている。6も3の倍数。',
        ],
      },
      {
        id: 'mh-probability-2',
        question: '先に3勝した方が勝ちの勝負を、Aが2勝・Bが1勝のところでやめた。フェルマーの考え方では、賭け金をA：Bでどう分けるか。',
        choices: ['2：1', '3：1', '1：1'],
        answer: 1,
        explanation: 'あと最大2回の並び方 AA・AB・BA・BB のうち、Aが勝つのは3通り、Bが勝つのは BB の1通り。',
        notes: [
          'これまでに勝った回数の比で分けている。これから先の勝つ見込みを考えていない。',
          '正解。',
          'Aの方が有利なので、1：1では公平にならない。',
        ],
      },
      {
        id: 'mh-probability-3',
        question: 'コインを2回投げて、2回とも表が出る確率はいくつか。',
        choices: ['$\\frac{1}{2}$', '$\\frac{1}{3}$', '$\\frac{1}{4}$'],
        answer: 2,
        explanation: '表表・表裏・裏表・裏裏の4通りが同じ程度に起こりやすく、2回とも表はそのうち1通り。',
        notes: [
          '1回投げて表が出る確率。2回とも表になるのは、それより少ない。',
          '「2回とも表・1回だけ表・0回」の3つに分けているが、この3つは同じ程度に起こりやすくない。「1回だけ表」は2通りある。',
          '正解。',
        ],
      },
      {
        id: 'mh-probability-4',
        question: '確率の考えの出発点になったとされる、1654年の手紙のやりとりをした2人はだれか。',
        choices: ['パスカルとフェルマー', 'ニュートンとライプニッツ', 'ガリレオとケプラー'],
        answer: 0,
        explanation: '途中でやめた勝負の賭け金の分け方を、手紙で話し合った。',
        notes: [
          '正解。',
          '微分・積分の考えを、それぞれ別に見つけた2人。',
          '天文学や、ものの動きの研究で活やくした2人。',
        ],
      },
    ],
  },
  {
    id: 'mh-boxplot',
    part: 'junior',
    theme: '確率・データ',
    emoji: '📦',
    title: '箱ひげ図',
    headline: 'データを5つの数で表す——テューキーの「まず図にして眺める」',
    era: '1970年代',
    year: 1977,
    place: 'アメリカ',
    people: ['テューキー'],
    question: 'たくさんのデータの散らばりを、ひと目で比べるにはどうすればよいか？',
    story: [
      'データを小さい順に並べて4つに分ける位置の値を、四分位数という。四分位数は、19世紀の終わりごろから統計で使われてきた。',
      'アメリカの統計学者テューキーは、難しい計算の前に、まずデータを図にして眺め、特ちょうをつかむことを大切にした。この考えを「探索的データ解析」とよび、1970年代に示した箱ひげ図は、その代表的な道具になった。',
      '箱ひげ図は、最小値・第1四分位数・中央値・第3四分位数・最大値の5つの数だけでかく。箱の中には真ん中の約半分のデータが入り、箱の長さ（四分位範囲）で散らばりの大きさが分かる。',
      'テューキーは、コンピューターの情報の単位「ビット」という言葉を考えた人だと言われる。',
    ],
    visual: {
      scene: 'box-plot',
      instruction: '11人のうち1人の点数を動かして、箱ひげ図の5つの数と平均値がどう変わるかを見よう。',
      controls: [range('v', '1人の点数', 0, 100, 5, 90)],
      formula: ({ v }) => {
        const { q1, q3 } = fiveNumbers([...BOX_BASE, Number(v)])
        return `\\text{四分位範囲}=Q_3-Q_1=${q3}-${q1}=${q3 - q1}`
      },
      insight: ({ v }) => {
        const { median, mean } = fiveNumbers([...BOX_BASE, Number(v)])
        const lead = `1人の点数を${v}点にすると、平均値は${nice(mean, 1)}点、中央値は${median}点。`
        return Number(v) >= 90 || Number(v) <= 20
          ? `${lead}極端な点数に平均値は大きく引っぱられるが、中央値や箱はほとんど動かない。`
          : `${lead}箱の中に、真ん中の約半分の人が入っている。`
      },
    },
    uses: [
      { emoji: '🏫', title: 'クラスごとの成績', text: 'いくつものクラスの点数の散らばりを、箱ひげ図を並べてひと目で比べられる。' },
      { emoji: '🌡️', title: '気温の記録', text: '月ごとの最高気温を箱ひげ図で並べると、季節による変わり方と、その月の中の散らばりが同時に見える。' },
      { emoji: '🏭', title: '品質の管理', text: '工場で作った製品の大きさを箱ひげ図にすると、ばらつきや、ほかから外れた値に気づきやすい。' },
    ],
    units: ['data2', 'dataI'],
    basics: [],
    quiz: [
      {
        id: 'mh-boxplot-1',
        question: 'データ 2, 4, 5, 7, 8, 9, 11 の第1四分位数はどれか。',
        choices: ['4', '5', '7'],
        answer: 0,
        explanation: '中央値7より下の3つ 2, 4, 5 の真ん中が第1四分位数で4。上の3つ 8, 9, 11 の真ん中の9が第3四分位数。',
        notes: [
          '正解。',
          '5は下半分の最後の値。下半分の真ん中の値を取る。',
          '7は中央値（第2四分位数）。',
        ],
      },
      {
        id: 'mh-boxplot-2',
        question: '箱ひげ図の箱の中には、データのおよそどれだけが入っているか。',
        choices: ['真ん中の約半分', '全部', '大きい方の約4分の1'],
        answer: 0,
        explanation: '第1四分位数から第3四分位数までの間に、真ん中の約50%のデータが入る。',
        notes: [
          '正解。',
          '全部のデータは、ひげの左はしから右はし（最小値から最大値）までの間に入る。',
          '大きい方の約4分の1は、箱の右はしから右のひげの先までの部分。',
        ],
      },
      {
        id: 'mh-boxplot-3',
        question: '1人だけとても高い点数をとった。平均値と中央値はどうなるか。',
        choices: ['平均値は大きく変わるが、中央値はほとんど変わらない', 'どちらも大きく変わる', '中央値だけ大きく変わる'],
        answer: 0,
        explanation: '平均値は全員の合計から求めるので、極端な値に引っぱられる。中央値は並べた順番の真ん中なので、ほとんど動かない。',
        notes: [
          '正解。',
          '中央値は順番で決まるので、1人の値が極端になってもほとんど動かない。',
          '逆になっている。大きく変わるのは平均値。',
        ],
      },
      {
        id: 'mh-boxplot-4',
        question: '箱ひげ図を考えたテューキーが大切にした、データの扱い方はどれか。',
        choices: ['計算の前に、まず図にして眺める', 'データは平均値1つだけで表す', '図はかかずに表だけを使う'],
        answer: 0,
        explanation: 'テューキーは、データを図にして特ちょうを探る「探索的データ解析」を唱えた。',
        notes: [
          '正解。',
          '平均値1つだけでは、散らばりやほかから外れた値が見えない。',
          'テューキーは、図にして眺めることを大切にした。',
        ],
      },
    ],
  },
  {
    id: 'mh-square-completion',
    part: 'junior',
    theme: '方程式',
    emoji: '🧩',
    title: '二次方程式',
    headline: '正方形を完成させて解く——アル・フワーリズミーの図',
    era: '紀元前1800年ごろ（バビロニア）・9世紀（バグダッド）',
    year: 830,
    place: 'メソポタミア・バグダッド',
    people: ['アル・フワーリズミー'],
    question: '$x^2$ をふくむ方程式は、どうすれば解けるか？',
    story: [
      '紀元前1800年ごろのバビロニアの粘土板には、「正方形の面積と1辺の長さをたすと、いくつになった」という形の問題と、その解き方の手順が残っている。',
      '9世紀のアル・フワーリズミーは、$x^2+10x=39$ を図で解いてみせた。1辺 $x$ の正方形に、$10x$ を半分ずつ（$5x$ ずつ）の長方形にして2つの辺に付ける。すると、角に1辺5の正方形が欠けた形になる。',
      '欠けた角 $5\\times5=25$ を補うと、1辺 $x+5$ の大きな正方形になり、面積は $39+25=64$。だから $x+5=8$ で、$x=3$。このように正方形を完成させて解く方法を、今は「平方完成」という。',
      '当時は負の数を答えとして認めなかったので、$x=-13$ という答えは考えなかった。今は、$x^2+10x-39=0$ を $(x+13)(x-3)=0$ と因数分解したり、解の公式を使ったりして、2つの解を求める。',
    ],
    visual: {
      scene: 'complete-square',
      instruction: 'x の係数と右辺の数を決め、手順を進めて、欠けた角を補うと大きな正方形ができる様子を見よう。',
      controls: [
        range('b', 'x の係数', 2, 10, 2, 10),
        range('c', '右辺の数', 5, 40, 1, 39),
        range('step', '手順', 0, 2, 1, 0, (value) => SQUARE_STEPS[value] ?? String(value)),
      ],
      formula: ({ b, c, step }) => {
        const B = Number(b)
        const C = Number(c)
        const { h, total, root, exact, x } = completeSquare(B, C)
        if (Number(step) === 0) return `x^2+${B}x=${C}`
        if (Number(step) === 1) return `x^2+${B}x+${h}^2=${C}+${h * h}\\ \\to\\ (x+${h})^2=${total}`
        return exact
          ? `x+${h}=${root}\\ \\to\\ x=${x}`
          : `x+${h}=\\sqrt{${total}}\\approx${nice(root, 3)}\\ \\to\\ x\\approx${nice(x, 3)}`
      },
      insight: ({ b, c, step }) => {
        const B = Number(b)
        const C = Number(c)
        const { h, total, root, exact, x } = completeSquare(B, C)
        if (Number(step) === 0) return `1辺 x の正方形に、${B}x を半分ずつ（${h}x ずつ）の長方形にして2つの辺に付けた。面積の合計は${C}。角に1辺${h}の正方形が欠けている。`
        if (Number(step) === 1) return `欠けた角（1辺${h}、面積${h * h}）を補うと、1辺 x＋${h} の大きな正方形になる。面積は ${C}＋${h * h}＝${total}。`
        return exact
          ? `面積${total}の正方形の1辺は${root}なので、x＝${root}−${h}＝${x}。確かめ：${x}²＋${B}×${x}＝${x * x + B * x}。`
          : `面積${total}の正方形の1辺は √${total}≈${nice(root, 3)} なので、x≈${nice(x, 3)}。答えが整数にならなくても、同じ手順で求められる。`
      },
    },
    uses: [
      { emoji: '🏀', title: '投げたボールの高さ', text: '投げ上げたボールの高さは、時間の二次式で表される。ボールがある高さになる時刻は、二次方程式を解いて求める。' },
      { emoji: '🧮', title: '解の公式', text: '平方完成を文字のまま行うと、どんな二次方程式にも使える解の公式 $x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$ ができる。' },
      { emoji: '🏞️', title: '土地の縦と横', text: '面積と、縦と横の長さの差が分かっている土地の、辺の長さを求めるのは二次方程式になる。' },
    ],
    units: ['eq2', 'expand', 'factor'],
    basics: [],
    quiz: [
      {
        id: 'mh-square-completion-1',
        question: '$x^2+6x=16$ を平方完成で解くとき、両辺に加える数はどれか。',
        choices: ['9', '36', '3'],
        answer: 0,
        explanation: '$6x$ を半分の $3x$ ずつに分けると、欠ける角は $3\\times3=9$。$(x+3)^2=25$ で $x=2$（ほかに $x=-8$）。',
        notes: [
          '正解。',
          '$6^2=36$ としている。欠ける角の1辺は、係数の半分の3。',
          '3は角の正方形の1辺。加えるのは面積の $3^2$。',
        ],
      },
      {
        id: 'mh-square-completion-2',
        question: 'アル・フワーリズミーの図で、$x^2+10x=39$ の正の解はどれか。',
        choices: ['$x=3$', '$x=8$', '$x=5$'],
        answer: 0,
        explanation: '角の25を補うと $(x+5)^2=64$、$x+5=8$ で $x=3$。',
        notes: [
          '正解。確かめ：$9+30=39$。',
          '8は $x+5$ の値。そこから5をひく。',
          '5は、長方形の幅（10の半分）。',
        ],
      },
      {
        id: 'mh-square-completion-3',
        question: '$x^2+10x-39=0$ を因数分解するとどうなるか。',
        choices: ['$(x+13)(x-3)=0$', '$(x-13)(x+3)=0$', '$(x+10)(x-39)=0$'],
        answer: 0,
        explanation: 'かけて $-39$、たして $+10$ になる2数は $13$ と $-3$。解は $x=3,\\ -13$。',
        notes: [
          '正解。',
          '2数をたすと $-10$ になってしまう。',
          '2数をかけると $-390$、たすと $-29$ で合わない。',
        ],
      },
      {
        id: 'mh-square-completion-4',
        question: '当時、$x^2+10x=39$ の答えとして $x=-13$ を考えなかったのはなぜか。',
        choices: ['負の数を答えとして認めていなかったから', '計算をまちがえたから', '$-13$ は式を満たさないから'],
        answer: 0,
        explanation: '$(-13)^2+10\\times(-13)=169-130=39$ で式は満たすが、当時は負の数を答えと認めなかった。',
        notes: [
          '正解。',
          '計算のまちがいではない。負の答えを数として認めていなかった。',
          '入れて確かめると、式を満たしている。',
        ],
      },
    ],
  },
  {
    id: 'mh-irrational',
    part: 'junior',
    theme: '数と式',
    emoji: '🔷',
    title: '平方根と無理数',
    headline: '正方形の対角線は分数で表せない——古代ギリシャのおどろき',
    era: '紀元前5世紀ごろ',
    year: -450,
    place: 'ギリシャ',
    people: [],
    question: '1辺が1の正方形の対角線の長さは、分数で表せるか？',
    story: [
      '古代ギリシャのピタゴラス学派は、「すべてのものは数（整数とその比）で表せる」と考えていたと伝えられる。',
      'ところが、1辺が1の正方形の対角線の長さ $\\sqrt{2}$ は、どんな分数 $\\frac{p}{q}$ でも表せないことが分かった。これに気づいたのは学派のヒッパソスだと伝えられ、秘密をもらしたために海で命を落としたという伝説もある。',
      '証明の筋道はこうだ。$\\sqrt{2}=\\frac{p}{q}$（これ以上約分できない分数）とすると、$p^2=2q^2$。すると $p$ は偶数なので $p=2k$ とおくと、$q^2=2k^2$ となり、$q$ も偶数になる。約分できないはずなのに両方が偶数になってしまい、おかしい。この証明は、アリストテレスの本にも出てくる。',
      '分数で表せない数を無理数という。$\\sqrt{2}=1.41421356\\cdots$ は、小数にすると限りなく続き、同じ並びのくり返しにもならない。',
    ],
    visual: {
      scene: 'sqrt2-fractions',
      instruction: '分母 q を変えて、√2 にいちばん近い分数 p/q を作り、p² と 2q² がぴったり等しくならないことを確かめよう。',
      controls: [range('q', '分母 q', 1, 12, 1, 5)],
      formula: ({ q }) => {
        const Q = Number(q)
        const p = Math.round(Q * Math.SQRT2)
        return `\\frac{${p}}{${Q}}${approxTex(p / Q, 4)}${nice(p / Q, 4)},\\quad ${p}^2=${p * p},\\quad 2\\times${Q}^2=${2 * Q * Q}`
      },
      insight: ({ q }) => {
        const Q = Number(q)
        const p = Math.round(Q * Math.SQRT2)
        const gap = Math.abs(p * p - 2 * Q * Q)
        return `分母${Q}で √2 にいちばん近い分数は ${p}/${Q}。${p}² と 2×${Q}² の差は${gap}で、0にはならない。差が0なら √2＝${p}/${Q} になるが、証明のとおり、そうなる分数はない。`
      },
    },
    uses: [
      { emoji: '📄', title: '紙の大きさ（A判・B判）', text: 'A4やB5の紙は、長い辺と短い辺の比が $\\sqrt{2}:1$。半分に切っても、もとと同じ形になる。' },
      { emoji: '🎹', title: '音の高さ', text: '1オクターブを12の等しい比に分ける音の決め方（平均律）では、となりの音の振動数の比が $\\sqrt[12]{2}$ という無理数になる。' },
      { emoji: '💻', title: 'コンピューターの計算', text: 'コンピューターは無理数を正確には記録できず、決まった桁で丸めた近い値を使って計算している。' },
    ],
    units: ['sqrt', 'realexpr'],
    basics: [],
    quiz: [
      {
        id: 'mh-irrational-1',
        question: '$\\sqrt{2}$ についての説明で正しいものはどれか。',
        choices: ['分数で表せない数（無理数）', '$\\frac{7}{5}$ と等しい', '小数にすると 1.41 で終わる'],
        answer: 0,
        explanation: '$\\sqrt{2}=\\frac{p}{q}$ とすると $p$ も $q$ も偶数になってしまい、約分できない分数という仮定と合わない。',
        notes: [
          '正解。',
          '$\\frac{7}{5}=1.4$ で、$1.4^2=1.96$ は2にならない。近いが等しくない。',
          '$\\sqrt{2}=1.41421356\\cdots$ と限りなく続く。',
        ],
      },
      {
        id: 'mh-irrational-2',
        question: '$\\frac{17}{12}$ は $\\sqrt{2}$ に近い。$17^2$ と $2\\times12^2$ の差はいくつか。',
        choices: ['1', '0', '12'],
        answer: 0,
        explanation: '$17^2=289$、$2\\times12^2=288$。差は1で、0にはならない。',
        notes: [
          '正解。',
          '差が0なら $\\sqrt{2}=\\frac{17}{12}$ になってしまうが、そうはならない。',
          '$289-288=1$。',
        ],
      },
      {
        id: 'mh-irrational-3',
        question: 'A4の紙の長い辺と短い辺の比が $\\sqrt{2}:1$ になっているのは、なぜ便利か。',
        choices: ['半分に切っても同じ形（相似）になるから', '面積がちょうど1㎡だから', '紙が切りやすいから'],
        answer: 0,
        explanation: '$\\sqrt{2}:1$ の長方形を半分に切ると、辺の比は $1:\\frac{\\sqrt{2}}{2}=\\sqrt{2}:1$ で、もとと同じ形になる。',
        notes: [
          '正解。A4を半分に切るとA5、2枚並べるとA3になる。',
          '面積が1㎡なのはA0。A4はその16分の1。',
          '切りやすさとは関係ない。半分にしても形が変わらないことが大切。',
        ],
      },
      {
        id: 'mh-irrational-4',
        question: 'ピタゴラス学派について伝えられることで、正しいものはどれか。',
        choices: ['すべてのものは整数とその比で表せると考えていた', '負の数を最初に使った', '0を数として計算の決まりを書いた'],
        answer: 0,
        explanation: 'だから、分数で表せない長さの発見は、大きなおどろきだったと伝えられる。',
        notes: [
          '正解。',
          '負の数の計算は、中国の『九章算術』やインドのブラーマグプタに見られる。',
          '0を数として計算の決まりを書いたのは、インドのブラーマグプタ（628年）。',
        ],
      },
    ],
  },
  {
    id: 'mh-sqrt-method',
    part: 'junior',
    theme: '数と式',
    emoji: '🧱',
    title: '平方根の近い値',
    headline: '長方形を正方形に近づける——粘土板の√2とヘロンの方法',
    era: '紀元前1800年ごろ（バビロニア）・1世紀（ヘロン）',
    year: -1790,
    place: 'メソポタミア・アレクサンドリア',
    people: ['ヘロン'],
    question: '$\\sqrt{2}$ の値を、たし算とかけ算・わり算だけで、どこまでくわしく求められるか？',
    story: [
      'アメリカのイェール大学にある、紀元前1800年ごろのバビロニアの粘土板（YBC 7289）には、正方形とその対角線がかかれ、$\\sqrt{2}$ にあたる数が60進法で 1;24,51,10 と書かれている。10進法に直すと約1.41421296で、小数第5位まで正しい。',
      '1世紀のアレクサンドリアのヘロンは、平方根をくり返しの計算で求める方法を書き残した。面積が2の長方形を、面積を変えずに正方形に近づけていく、と考えると分かりやすい。',
      '横2・たて1の長方形（面積2）から始める。横とたての平均 $\\frac{2+1}{2}=1.5$ を新しい横にし、たてを $2\\div1.5$ にすると、面積は2のまま正方形に近づく。これをくり返すと、2回で $1.4166\\cdots$、3回で $1.41421568\\cdots$ と、あっという間に $\\sqrt{2}$ に近づく。',
      'この「平均をとってくり返す」方法は、のちにニュートン法とよばれる計算の方法を、平方根に使った場合にあたる。今もコンピューターで平方根などを計算するときに使われている。',
    ],
    visual: {
      scene: 'heron-rectangle',
      instruction: '平方根を求める数を選び、くり返す回数をふやして、長方形が正方形に近づく様子を見よう。',
      controls: [
        options('a', '平方根を求める数', 2, [2, 3, 5, 10].map((value) => ({ value, label: `√${value}` }))),
        range('n', 'くり返した回数', 0, 4, 1, 0),
      ],
      formula: ({ a, n }) => {
        const A = Number(a)
        const N = Number(n)
        const steps = heronSteps(A, N)
        if (N === 0) return `x_0=${A}\\quad(\\text{横}\\ ${A}\\times\\text{たて}\\ 1)`
        const x = steps[N]
        return `x_{${N}}=\\frac{1}{2}\\left(x_{${N - 1}}+\\frac{${A}}{x_{${N - 1}}}\\right)${approxTex(x, 8)}${nice(x, 8)}`
      },
      insight: ({ a, n }) => {
        const A = Number(a)
        const N = Number(n)
        const x = heronSteps(A, N)[N]
        if (N === 0) return `横${A}・たて1の長方形（面積${A}）から始める。本当の √${A} は ${nice(Math.sqrt(A), 8)}…`
        const gap = x - A / x
        const gapText = gap < 5e-9 ? 'ほぼ0（1億分の1より小さい）' : nice(gap, 8)
        return `${N}回くり返すと、横 ${nice(x, 8)}・たて ${nice(A / x, 8)}。面積は${A}のまま、横とたての差は ${gapText}。本当の √${A} は ${nice(Math.sqrt(A), 8)}…`
      },
    },
    uses: [
      { emoji: '💻', title: '電卓やコンピューター', text: '電卓やコンピューターは、くり返しの計算などを使って、平方根をあっという間に必要な桁まで求める。' },
      { emoji: '🏗️', title: '対角線の長さ', text: '正方形の対角線の長さは、1辺の約1.414倍。柱と柱の間にななめに入れる材木（筋かい）の長さを見積もるときに使う。' },
    ],
    units: ['sqrt'],
    basics: [],
    quiz: [
      {
        id: 'mh-sqrt-method-1',
        question: 'ヘロンの方法で、横2・たて1の長方形から1回くり返すと、新しい横はいくつか。',
        choices: ['1.5', '1.4', '2'],
        answer: 0,
        explanation: '横とたての平均 $\\frac{2+1}{2}=1.5$。たては $2\\div1.5=1.333\\cdots$ になり、面積は2のまま。',
        notes: [
          '正解。',
          '1.4は $\\sqrt{2}$ の近い値。1回目の平均は1.5。',
          '2はもとの横。平均をとると小さくなる。',
        ],
      },
      {
        id: 'mh-sqrt-method-2',
        question: 'バビロニアの粘土板 YBC 7289 に書かれた $\\sqrt{2}$ の近い値は、どのくらい正確か。',
        choices: ['小数第5位まで正しい', '小数第1位まで正しい', 'ぴったり正しい'],
        answer: 0,
        explanation: '60進法の 1;24,51,10 は10進法で約1.41421296。本当の値 $1.41421356\\cdots$ と、小数第5位の1.41421まで一致する。',
        notes: [
          '正解。',
          'もっと正確。1.41421まで合っている。',
          '$\\sqrt{2}$ は無理数なので、限られた桁で書いた値はぴったりにはならない。',
        ],
      },
      {
        id: 'mh-sqrt-method-3',
        question: '$\\sqrt{10}$ の値に最も近いものはどれか。',
        choices: ['3.16', '3.33', '5'],
        answer: 0,
        explanation: '$3.16^2=9.9856$ で10に近い。$\\sqrt{10}=3.1622\\cdots$。',
        notes: [
          '正解。',
          '$3.33^2=11.0889$ で、10より大きすぎる。',
          '$10\\div2=5$ としている。平方根は2でわった数ではない。',
        ],
      },
    ],
  },
  {
    id: 'mh-galileo',
    part: 'junior',
    theme: '関数',
    emoji: '⏱️',
    title: '関数 y＝ax²',
    headline: '落ちる距離は時間の2乗に比例する——ガリレオの斜面の実験',
    era: '1638年（『新科学対話』）',
    year: 1638,
    place: 'イタリア',
    people: ['ガリレオ・ガリレイ'],
    question: 'ものが落ちるとき、進む距離は時間とどんな関係にあるか？',
    story: [
      '古代ギリシャのアリストテレスは、重いものほど速く落ちると考えた。この考えは、長い間信じられていた。',
      'ガリレオは、落ちる動きをゆっくりにして調べるために、ゆるい斜面に玉を転がした。同じ時間ごとに進む距離は 1, 3, 5, 7, … と奇数の比でふえ、はじめからの距離は 1, 4, 9, 16, … と、時間の2乗に比例することを確かめた。',
      'この結果は、1638年の『新科学対話』にまとめられた。ピサの斜塔から重さのちがう玉を落としたとも言われるが、本当に行ったかどうかははっきりしない。',
      '落ちた距離 $y$ は時間 $x$ の2乗に比例し、$y=ax^2$ と表せる。空気の影響を考えなければ、地球の上では $a$ はおよそ4.9（距離はm、時間は秒）で、1秒で約4.9m、2秒で約19.6m落ちる。',
    ],
    visual: {
      scene: 'galileo-ramp',
      instruction: '斜面の傾きと時間を変えて、玉が進んだ距離と、同じ時間ごとに進む距離のふえ方を見よう。',
      controls: [
        options('a', '斜面の傾き', 1, [
          { value: 1, label: 'ゆるい（a＝1）' },
          { value: 2, label: 'ふつう（a＝2）' },
          { value: 3, label: '急（a＝3）' },
        ]),
        range('t', '時間（目もり）', 0, 5, 1, 3),
      ],
      formula: ({ a, t }) => `y=${a}x^2,\\quad y=${a}\\times${t}^2=${Number(a) * Number(t) * Number(t)}`,
      insight: ({ a, t }) => {
        const A = Number(a)
        const T = Number(t)
        if (T === 0) return 'x＝0 では、玉はまだ動いていない（y＝0）。'
        const steps = Array.from({ length: T }, (_, index) => A * (2 * index + 1)).join('・')
        return `${T}目もりまでに進んだ距離は ${A * T * T}。1目もりごとに進む距離は ${steps} で、1：3：5：…と奇数の比でふえる。`
      },
    },
    uses: [
      { emoji: '🚗', title: 'ブレーキの距離', text: 'ブレーキをかけてから止まるまでの距離は、速さのほぼ2乗に比例する。速さが2倍になると、止まるまでの距離はおよそ4倍になる。' },
      { emoji: '🏀', title: 'ボールの通り道', text: '投げたボールの通り道は放物線になる。高さの変わり方に、時間の2乗の項が入るからだ。' },
    ],
    units: ['qfn0', 'qfn'],
    basics: [],
    quiz: [
      {
        id: 'mh-galileo-1',
        question: '$y=2x^2$ で、$x=3$ のときの $y$ はいくつか。',
        choices: ['18', '12', '36'],
        answer: 0,
        explanation: '$2\\times3^2=2\\times9=18$。',
        notes: [
          '正解。',
          '$2\\times3\\times2$ と、2乗を2倍とまちがえている。',
          '$(2\\times3)^2$ と、先に2をかけてから2乗している。',
        ],
      },
      {
        id: 'mh-galileo-2',
        question: 'ガリレオの斜面で、はじめの1目もりの間に1進んだ玉は、次の1目もりの間にいくつ進むか。',
        choices: ['3', '2', '4'],
        answer: 0,
        explanation: '同じ時間ごとに進む距離は 1, 3, 5, 7, … と奇数の比でふえる。はじめからの距離は 1, 4, 9, … で、$4-1=3$。',
        notes: [
          '正解。',
          '進む距離は同じ量ずつふえるのではなく、速くなりながらふえる。',
          '4は、はじめから2目もりまでに進んだ距離の合計。',
        ],
      },
      {
        id: 'mh-galileo-3',
        question: '$y=ax^2$ で、$x$ が2倍になると $y$ は何倍になるか。',
        choices: ['4倍', '2倍', '8倍'],
        answer: 0,
        explanation: '$a(2x)^2=4ax^2$。',
        notes: [
          '正解。',
          '2倍になるのは、比例 $y=ax$ のとき。',
          '8倍になるのは、3乗に比例するとき（立方体の体積など）。',
        ],
      },
      {
        id: 'mh-galileo-4',
        question: 'ピサの斜塔から玉を落とした話について、正しいものはどれか。',
        choices: ['有名だが、本当に行ったかどうかははっきりしない', 'ガリレオが『新科学対話』にくわしく書いた', 'アリストテレスが行った'],
        answer: 0,
        explanation: 'この話はガリレオの弟子が書いた伝記で広まったもので、本当に行ったかどうかは確かめられていない。',
        notes: [
          '正解。',
          '『新科学対話』にまとめたのは、斜面の実験などから分かったこと。',
          'アリストテレスは、重いものほど速く落ちると考えた人。',
        ],
      },
    ],
  },
  {
    id: 'mh-similar',
    part: 'junior',
    theme: '図形',
    emoji: '🏜️',
    title: '相似',
    headline: '影の長さからピラミッドの高さを求める——タレスの伝え',
    era: '紀元前6世紀ごろ',
    year: -600,
    place: 'エジプト',
    people: ['タレス'],
    question: '登ることのできない高いものの高さを、どうすれば求められるか？',
    story: [
      '古代ギリシャのタレスは、エジプトを訪れたとき、ピラミッドの高さを影の長さから求めたと伝えられる。',
      '同じ時刻には、太陽の光は平行に届く。だから、地面に立てた棒とその影がつくる直角三角形と、ピラミッドの高さとその影がつくる直角三角形は、形が同じ（相似）になる。ピラミッドの影は、底の中心から影の先までの長さを使う。',
      '相似な図形では、対応する辺の長さの比が等しい。棒の高さが1m・影が2mで、ピラミッドの影が292mなら、高さは $292\\times\\frac{1}{2}=146$m と分かる。タレスは、自分の影が身長と同じ長さになる時刻を待って、ピラミッドの影を測ったとも伝えられる。',
      'エジプトのクフ王のピラミッドは、できたときの高さが約146m、底の1辺が約230mあった。相似を使うと、登ったり近づいたりしなくても、高さや距離が分かる。',
    ],
    visual: {
      scene: 'shadow-similar',
      instruction: '太陽の高さと棒の高さを変えて、2つの影の長さから、ピラミッドの高さを求めよう。',
      controls: [
        options('sun', '太陽の高さ', 1, SUN_RATIOS),
        range('stick', '棒の高さ（m）', 1, 2, 0.5, 1, (value) => `${nice(value, 1)}m`),
      ],
      formula: ({ sun, stick }) => {
        const r = Number(sun)
        const s = Number(stick)
        const shadow = s * r
        const P = PYRAMID_HEIGHT * r
        return `\\frac{H}{${P}}=\\frac{${nice(s, 1)}}{${nice(shadow, 2)}}\\ \\to\\ H=${P}\\times\\frac{${nice(s, 1)}}{${nice(shadow, 2)}}=${PYRAMID_HEIGHT}`
      },
      insight: ({ sun, stick }) => {
        const r = Number(sun)
        const s = Number(stick)
        const P = PYRAMID_HEIGHT * r
        const lead = `棒の影は${nice(s * r, 2)}mで、棒の高さの${nice(r, 1)}倍。ピラミッドの影（底の中心から）も高さの${nice(r, 1)}倍の${P}mになるので、高さは ${P}÷${nice(r, 1)}＝${PYRAMID_HEIGHT}m。`
        return r === 1
          ? `${lead}影と高さが同じ長さになる時刻なら、影の長さがそのまま高さになる。`
          : `${lead}太陽の高さが変わっても、求めた高さは変わらない。`
      },
    },
    uses: [
      { emoji: '🗺️', title: '地図と縮尺', text: '地図は実際の土地と相似な図。縮尺を使えば、地図の上の長さから実際の距離が分かる。' },
      { emoji: '🌳', title: '木の高さ', text: '木の影と、自分や棒の影の長さを比べれば、木に登らなくても高さが分かる。' },
      { emoji: '📷', title: 'カメラの像', text: '小さな穴を通った光がつくる像は、写すものと相似な形（上下左右が逆）になる。' },
    ],
    units: ['simil'],
    basics: [],
    quiz: [
      {
        id: 'mh-similar-1',
        question: '高さ1.5mの棒の影が2mのとき、影が12mの木の高さはいくつか。',
        choices: ['9m', '16m', '8m'],
        answer: 0,
        explanation: '影の長さは $12\\div2=6$ 倍。高さも6倍で $1.5\\times6=9$ m。',
        notes: [
          '正解。',
          '$12\\times\\frac{2}{1.5}$ と、比を逆にしている。',
          '$12\\times\\frac{2}{3}$ としている。',
        ],
      },
      {
        id: 'mh-similar-2',
        question: '棒の影とピラミッドの影から高さが求められるのは、2つの三角形がどんな関係だからか。',
        choices: ['相似（形が同じ）', '合同（形も大きさも同じ）', '面積が等しい'],
        answer: 0,
        explanation: '同じ時刻には太陽の光が平行なので、2つの直角三角形の角がそれぞれ等しく、相似になる。',
        notes: [
          '正解。',
          '大きさはまったくちがう。形が同じなのは相似。',
          '面積はまったくちがう。',
        ],
      },
      {
        id: 'mh-similar-3',
        question: '相似比が $1:3$ の2つの図形の、面積の比はどれか。',
        choices: ['$1:9$', '$1:3$', '$1:6$'],
        answer: 0,
        explanation: '面積は、縦と横の両方が3倍になるので $3\\times3=9$ 倍。',
        notes: [
          '正解。',
          '長さの比。面積は長さの比の2乗になる。',
          '$3\\times2$ としている。',
        ],
      },
    ],
  },
  {
    id: 'mh-thales',
    part: 'junior',
    theme: '図形',
    emoji: '⭕',
    title: '円周角の定理',
    headline: '半円の上の角はいつも直角——タレスの定理から円周角へ',
    era: '紀元前6世紀ごろ（タレス）・紀元前300年ごろ（『原論』）',
    year: -590,
    place: 'ギリシャ',
    people: ['タレス', 'ユークリッド'],
    question: '円の上で点を動かすと、2点を見こむ角の大きさはどうなるか？',
    story: [
      '円の直径の両はしと、円の上の点を結ぶと、その角はいつも直角になる。この性質は「タレスの定理」とよばれ、タレスが見つけたと伝えられる。',
      'のちに、ユークリッドの『原論』第3巻には、もっと一般的な形がまとめられた。1つの弧に対する円周角は、その弧に対する中心角の半分で、円の上のどこに点をとっても等しい。',
      '直径に対する中心角は180度なので、円周角はその半分の90度。タレスの定理は、円周角の定理の特別な場合になっている。',
      '逆に、2点を同じ角度で見こむ点を集めると、円の弧の上に並ぶ。この性質を使うと、4つの点が同じ円の上にあるかどうかも調べられる。',
    ],
    visual: {
      scene: 'inscribed-angle',
      instruction: '弧ABに対する中心角と点Pの位置を変えて、角APBの大きさがどうなるかを見よう。',
      controls: [
        range('central', '弧ABに対する中心角', 40, 320, 20, 120, (value) => `${value}°`),
        range('p', '点Pの位置', 1, 9, 1, 5),
      ],
      formula: ({ central }) => `\\angle APB=\\frac{1}{2}\\angle AOB=\\frac{${central}^\\circ}{2}=${Number(central) / 2}^\\circ`,
      insight: ({ central }) => (Number(central) === 180
        ? 'AB は直径。点Pをどこに動かしても、角APBは90度（タレスの定理）。'
        : `点Pを円の上で動かしても、角APBはいつも${Number(central) / 2}°。弧ABに対する中心角${central}°の半分。`),
    },
    uses: [
      { emoji: '🛠️', title: '円の中心の見つけ方', text: '直角の定規の角を円の周にあて、2辺が円と交わる2点を結ぶと直径になる。これを2回くり返すと、2本の直径の交わる点が円の中心。' },
      { emoji: '⚽', title: 'シュートの角度', text: 'ゴールの両はしを同じ角度で見こむ場所は、円の弧の上に並ぶ。どこから打つと角度が大きいかを考えるときに使える。' },
    ],
    units: ['circ', 'geomA'],
    basics: [],
    quiz: [
      {
        id: 'mh-thales-1',
        question: '中心角が100度の弧に対する円周角はいくつか。',
        choices: ['50度', '100度', '200度'],
        answer: 0,
        explanation: '円周角は、同じ弧に対する中心角の半分。',
        notes: [
          '正解。',
          '中心角と同じにしている。',
          '2倍にしている。円周角は中心角の半分。',
        ],
      },
      {
        id: 'mh-thales-2',
        question: 'AB が円の直径のとき、円の上の点Pについて、角APBはいくつか。',
        choices: ['90度', '180度', '点Pの位置で変わる'],
        answer: 0,
        explanation: '直径に対する中心角は180度で、円周角はその半分の90度（タレスの定理）。',
        notes: [
          '正解。',
          '180度は中心角。円周角はその半分。',
          'Pを円の上のどこにとっても90度で、変わらない。',
        ],
      },
      {
        id: 'mh-thales-3',
        question: '直角の定規の角を円の周にあてる方法で、円の中心が見つけられるのはなぜか。',
        choices: ['直角をはさむ2辺が円と交わる2点を結ぶと、直径になるから', '定規の長さが半径と同じだから', '円の中心はいつも定規の角にあるから'],
        answer: 0,
        explanation: '円周角が90度なら、その2点を結ぶ線は直径（タレスの定理の逆）。直径を2本かくと、その交わる点が中心。',
        notes: [
          '正解。',
          '定規の長さは関係ない。',
          '定規の角は円の周の上にある。中心ではない。',
        ],
      },
    ],
  },
  {
    id: 'mh-pythagoras',
    part: 'junior',
    theme: '図形',
    emoji: '📐',
    title: '三平方の定理',
    headline: '直角三角形の3辺の関係——粘土板から中国、ギリシャまで',
    era: '紀元前1800年ごろ（バビロニア）・紀元前300年ごろ（『原論』）',
    year: -1780,
    place: 'メソポタミア・中国・ギリシャ',
    people: ['ピタゴラス', 'ユークリッド'],
    question: '直角三角形の3つの辺の長さの間には、どんな関係があるか？',
    story: [
      '直角三角形の、直角をはさむ2辺を $a$・$b$、いちばん長い辺（斜辺）を $c$ とすると、$a^2+b^2=c^2$ が成り立つ。これが三平方の定理で、ピタゴラスの定理ともよばれる。',
      'この関係は、ピタゴラスより1000年以上前から知られていた。紀元前1800年ごろのバビロニアの粘土板（プリンプトン322）には、$a^2+b^2=c^2$ を満たす整数の組にあたる数が並んでいると考えられている。',
      '中国の古い天文学と数学の本『周髀算経（しゅうひさんけい）』には、「勾（こう）3・股（こ）4・弦（げん）5」の直角三角形が出てくる。中国や日本では、この定理を「勾股弦（こうこげん）の定理」ともよんできた。',
      'ギリシャでは、ピタゴラスかその学派が初めて証明したと伝えられる。今に残る最も古い証明の1つは、ユークリッドの『原論』第1巻の命題47にある。',
    ],
    visual: {
      scene: 'pythagoras-squares',
      instruction: '直角をはさむ2辺の長さと見方を変えて、3つの正方形の面積の関係と、並べかえの証明を確かめよう。',
      controls: [
        range('a', '辺 a', 1, 8, 1, 3),
        range('b', '辺 b', 1, 8, 1, 4),
        options('view', '見方', 'squares', [
          { value: 'squares', label: '3辺の正方形' },
          { value: 'proof', label: '並べかえの証明' },
        ]),
      ],
      formula: ({ a, b }) => {
        const A = Number(a)
        const B = Number(b)
        const s = A * A + B * B
        const c = Math.sqrt(s)
        const exact = Number.isInteger(c)
        return `${A}^2+${B}^2=${A * A}+${B * B}=${s}\\ \\to\\ c=${exact ? c : `\\sqrt{${s}}\\approx${nice(c, 2)}`}`
      },
      insight: ({ a, b, view }) => {
        const A = Number(a)
        const B = Number(b)
        const s = A * A + B * B
        const c = Math.sqrt(s)
        if (view === 'proof') {
          return `1辺 ${A}＋${B}＝${A + B} の正方形に、同じ直角三角形を4つ置く。残りは、左では c² の正方形1つ、右では ${A * A} と ${B * B} の正方形2つ。どちらも「大きな正方形 − 三角形4つ」なので、c²＝${A * A}＋${B * B}＝${s}。`
        }
        return Number.isInteger(c)
          ? `${A}・${B}・${c} は、a²＋b²＝c² を満たす整数の組（ピタゴラス数）。${A * A}＋${B * B}＝${c * c}。`
          : `a²＋b²＝${s} なので、c＝√${s}≈${nice(c, 2)}。辺の長さが整数でも、斜辺は整数になるとは限らない。`
      },
    },
    uses: [
      { emoji: '📺', title: 'テレビの画面の大きさ', text: 'テレビの「50型」の50は、画面の対角線の長さ（インチ）。縦と横の長さから三平方の定理で求められる。' },
      { emoji: '🗺️', title: '2点の間の距離', text: '地図や座標の上の2点の距離は、横と縦の差を2辺とする直角三角形の斜辺として求める。' },
      { emoji: '🏗️', title: '直角の確かめ', text: '3m・4m・5mになるようにひもを張ると直角ができる。建物の土台の直角を確かめるときに使われる。' },
    ],
    units: ['tri', 'coordII'],
    basics: [],
    quiz: [
      {
        id: 'mh-pythagoras-1',
        question: '直角をはさむ2辺が6と8の直角三角形の、斜辺の長さはいくつか。',
        choices: ['10', '14', '$\\sqrt{28}$'],
        answer: 0,
        explanation: '$6^2+8^2=36+64=100=10^2$。',
        notes: [
          '正解。',
          '$6+8$ と、辺の長さをそのままたしている。',
          '$8^2-6^2=28$ と、ひき算にしている。',
        ],
      },
      {
        id: 'mh-pythagoras-2',
        question: '3辺が次の長さの三角形のうち、直角三角形はどれか。',
        choices: ['5, 12, 13', '4, 5, 6', '2, 3, 4'],
        answer: 0,
        explanation: '$5^2+12^2=25+144=169=13^2$。',
        notes: [
          '正解。',
          '$4^2+5^2=41$、$6^2=36$ で等しくない。',
          '$2^2+3^2=13$、$4^2=16$ で等しくない。',
        ],
      },
      {
        id: 'mh-pythagoras-3',
        question: '『周髀算経（しゅうひさんけい）』に出てくる直角三角形の3辺の組はどれか。',
        choices: ['3・4・5', '1・2・3', '5・5・5'],
        answer: 0,
        explanation: '「勾3・股4・弦5」とあり、$3^2+4^2=5^2$ を満たす。',
        notes: [
          '正解。',
          '1・2・3では、三角形そのものができない（$1+2=3$）。',
          '3辺が等しいのは正三角形で、直角三角形ではない。',
        ],
      },
      {
        id: 'mh-pythagoras-4',
        question: '並べかえの証明で、1辺 $a+b$ の正方形から直角三角形4つを取り除いた残りについて、正しいものはどれか。',
        choices: ['$c^2$ と $a^2+b^2$ は同じ面積になる', '$c^2$ の方がいつも大きい', '$a^2+b^2$ の方がいつも大きい'],
        answer: 0,
        explanation: '大きな正方形も三角形4つも同じなので、残りの面積も同じ。だから $c^2=a^2+b^2$。',
        notes: [
          '正解。',
          '大きな正方形と三角形4つが同じなので、残りは等しい。$c^2$ だけが大きくはならない。',
          '残りは等しい。$a^2+b^2$ だけが大きくはならない。',
        ],
      },
    ],
  },
  {
    id: 'mh-sampling',
    part: 'junior',
    theme: '確率・データ',
    emoji: '🐟',
    title: '標本調査',
    headline: '一部を調べて全体を知る——ラプラスの人口の見積もりと、印をつけた魚',
    era: '1802年（ラプラス）・1896年ごろ（印をつけた魚）',
    year: 1802,
    place: 'フランス・デンマーク',
    people: ['ラプラス', 'ペーターセン'],
    question: '全部を数えられないほど多いものの数を、一部だけ調べて知ることはできるか？',
    story: [
      '1802年、フランスのラプラスは、国じゅうの人を数えずにフランスの人口を見積もった。いくつかの地域を選んで、人口と1年に生まれた子どもの数を調べ、その比を国全体の出生数にかけた。見積もりは約2800万人だった。',
      'このように、全体（母集団）から一部（標本）を取り出して調べ、全体のようすを推し量ることを標本調査という。標本は、かたよりのないように無作為に選ぶことが大切だ。',
      '1936年のアメリカ大統領選挙では、ある雑誌が200万人以上の回答をもとに予想を外した。いっぽうギャラップは、ずっと少ない人数を国全体の人々の割合に合うように選んで、当選者を当てた。人数の多さより、選び方のかたよりの少なさが大切だと分かる例だ。',
      '池の魚の数は、とった魚に印をつけてもどし、しばらくしてからもう一度とって、その中の印のある魚の割合から見積もる。この方法は、1896年ごろデンマークのペーターセンが魚の研究で使ったことで知られる。',
    ],
    visual: {
      scene: 'capture-recapture',
      instruction: '池の400匹のうち80匹に印がついている。2回目にとる数と調査の回を変えて、見積もりがどれだけ本当の数に近いかを見よう。',
      controls: [
        options('n', '2回目にとる数', 40, [10, 40, 100, 200].map((value) => ({ value, label: `${value}匹` }))),
        range('s', '調査の回', 1, RECAPTURE_ROUNDS, 1, 1, (value) => `${value}回目`),
      ],
      formula: ({ n, s }) => {
        const N = Number(n)
        const { marked, estimate } = recaptureSample(N, Number(s))
        if (!marked) return `\\text{印のある魚}\\ 0\\ \\text{匹}\\ \\to\\ \\text{見積もれない}`
        return `${POND_MARKED}\\times\\frac{${N}}{${marked}}${approxTex(estimate, 0)}${Math.round(estimate)}\\ \\text{匹}`
      },
      insight: ({ n, s }) => {
        const N = Number(n)
        const { marked, estimate } = recaptureSample(N, Number(s))
        if (!marked) return `2回目にとった${N}匹に、印のある魚が1匹もいなかった。これでは見積もれない。とる数をふやしてみよう。`
        const lead = `2回目にとった${N}匹のうち、印のある魚は${marked}匹。池全体でも印のある魚の割合が同じと考えると、全体は約${Math.round(estimate)}匹。`
        const estimates = recaptureEstimates(N).filter((value) => value !== null)
        const spread = `${N}匹ずつの調査を${RECAPTURE_ROUNDS}回すると、見積もりは${Math.round(Math.min(...estimates))}〜${Math.round(Math.max(...estimates))}匹の間でばらついた。`
        return N <= 40
          ? `${lead}${spread}とる数が少ないと、見積もりのばらつきが大きい。`
          : `${lead}${spread}とる数が多いほど、ばらつきが小さくなり、本当の数（400匹）の近くに集まりやすい。`
      },
    },
    uses: [
      { emoji: '📺', title: 'テレビの視聴率', text: '全部の家を調べずに、選んだ一部の家のデータから、番組を見ていた家の割合を見積もる。' },
      { emoji: '🗳️', title: '選挙の出口調査', text: '投票を終えた人の一部に聞いて、結果を早く見積もる。' },
      { emoji: '🥫', title: '製品の検査', text: '缶づめの中身や電球の寿命を調べるとき、全部を開けたり使い切ったりはできないので、一部を取り出して調べる。' },
    ],
    units: ['sample', 'statB'],
    basics: [],
    quiz: [
      {
        id: 'mh-sampling-1',
        question: '池で60匹に印をつけてもどした。あとで50匹とると、印のある魚が10匹いた。池の魚はおよそ何匹か。',
        choices: ['300匹', '500匹', '110匹'],
        answer: 0,
        explanation: '印のある魚の割合は $\\frac{10}{50}=\\frac{1}{5}$。池全体でも同じと考え、$60\\div\\frac{1}{5}=300$ 匹。',
        notes: [
          '正解。',
          '$50\\times10$ としている。',
          '$60+50$ と、たしている。',
        ],
      },
      {
        id: 'mh-sampling-2',
        question: '標本の選び方として大切なことはどれか。',
        choices: ['かたよりがないように選ぶ', '調べやすい人だけを選ぶ', '予想に合う人を選ぶ'],
        answer: 0,
        explanation: '標本が母集団のようすを正しく表すように、無作為に選ぶ。',
        notes: [
          '正解。',
          '調べやすい人だけでは、かたよった結果になる。',
          '予想に合わせて選ぶと、調べる意味がなくなる。',
        ],
      },
      {
        id: 'mh-sampling-3',
        question: '1936年のアメリカ大統領選挙の予想から分かることはどれか。',
        choices: ['人数が多くても、選び方がかたよると予想は外れる', '人数が多いほど、必ず正しく予想できる', '標本調査では選挙の予想はできない'],
        answer: 0,
        explanation: '200万人以上の回答を集めた雑誌の予想は外れ、ずっと少ない人数でも選び方に気をつけたギャラップが当てた。',
        notes: [
          '正解。',
          '雑誌は200万人以上の回答を集めたが、予想を外した。',
          'ギャラップは、標本調査で当選者を当てた。',
        ],
      },
      {
        id: 'mh-sampling-4',
        question: 'ラプラスが1802年に見積もったものはどれか。',
        choices: ['フランスの人口', '地球一周の長さ', '円周率'],
        answer: 0,
        explanation: 'いくつかの地域の人口と出生数の比を、国全体の出生数にかけて、約2800万人と見積もった。',
        notes: [
          '正解。',
          '地球一周の長さを影の角度から求めたのは、紀元前3世紀のエラトステネス。',
          '円周率を正多角形で求めたのは、紀元前3世紀のアルキメデス。',
        ],
      },
    ],
  },
]
