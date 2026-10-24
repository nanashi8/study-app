// 数学の歴史をたどるコース：第3部「高校の数学」の中ほど（三角関数・微分・積分・数列）。
// 話の形は basic-number.js の冒頭を参照。
import { nice, options, range } from './controls.js'

// ── 三角関数と波：サイン波をたし合わせる（フーリエ級数） ─────────────────────
export const WAVE_SHAPES = Object.freeze({
  square: { label: '四角い波', target: (x) => (Math.sin(x) >= 0 ? 1 : -1) },
  // のこぎりの波：-π＜x＜π で x/2 をくり返す形。
  saw: { label: 'のこぎりの波', target: (x) => ((((x + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) - Math.PI) / 2 },
})

/** k 番目の波（1から）の、何倍の振動数か・係数。 */
export function waveTerm(shape, index) {
  if (shape === 'square') {
    const k = 2 * index - 1
    return { k, amp: 4 / (Math.PI * k) }
  }
  const k = index
  return { k, amp: (index % 2 ? 1 : -1) / k }
}

export function waveSum(shape, terms, x) {
  let y = 0
  for (let index = 1; index <= terms; index += 1) {
    const { k, amp } = waveTerm(shape, index)
    y += amp * Math.sin(k * x)
  }
  return y
}

// ── 積分：長方形の和 ────────────────────────────────────────────────
export function riemannSum(n, side) {
  let sum = 0
  for (let k = 0; k < n; k += 1) {
    const x = side === 'right' ? (k + 1) / n : k / n
    sum += (x * x) / n
  }
  return sum
}

// ── 微分積分学の基本定理：面積の関数 ─────────────────────────────────
export const AREA_FUNCTIONS = Object.freeze({
  x: { label: 'f(x)＝x', f: (x) => x, S: (x) => (x * x) / 2, tex: 't', antiTex: (x) => `\\frac{${x}^2}{2}` },
  x2: { label: 'f(x)＝x²', f: (x) => x * x, S: (x) => (x * x * x) / 3, tex: 't^2', antiTex: (x) => `\\frac{${x}^3}{3}` },
})

// ── 最大・最小：箱の体積 ───────────────────────────────────────────
export const boxVolume = (x) => x * (12 - 2 * x) ** 2
export const boxSlope = (x) => (12 - 2 * x) * (12 - 6 * x)

// ── フィボナッチ数列 ───────────────────────────────────────────────
export function fibonacci(count) {
  const list = [1, 1]
  while (list.length < count) list.push(list.at(-1) + list.at(-2))
  return list.slice(0, count)
}

const signedText = (value) => (value < 0 ? `(${nice(value, 2)})` : nice(value, 2))

export const MATH_HISTORY_SENIOR_CALCULUS = [
  {
    id: 'mh-waves',
    part: 'senior',
    theme: '三角比',
    emoji: '🌊',
    title: '三角関数と波',
    headline: '円をまわる点の高さが波になる——フーリエの「サイン波をたし合わせる」',
    era: '1748年（オイラー）・1807年（フーリエ）',
    year: 1807,
    place: 'スイス・フランス',
    people: ['オイラー', 'フーリエ'],
    question: 'くり返し変化する音や波を、数の式で表せないか？',
    story: [
      '半径1の円（単位円）の上を、一定の速さでまわる点を考える。点の高さは $\\sin\\theta$、横の位置は $\\cos\\theta$。角 $\\theta$ を横にとって高さをグラフにすると、同じ形がくり返される波（正弦曲線）になる。',
      '三角比は、はじめは直角三角形の辺の比だった。スイス生まれのオイラーは、1748年の本などで sin や cos を角の大きさの関数として扱い、今の三角関数の考え方と書き方の多くをまとめた。',
      '1807年、フランスのフーリエは、熱の伝わり方を研究するなかで、くり返す形の変化は、いろいろな周期のサイン波・コサイン波をたし合わせて表せると考えた。これを今、フーリエ級数という。',
      '音の高さは波の振動数で、音色はふくまれるサイン波の組み合わせで決まる。音楽や写真のデータを小さくする方法にも、波に分けて考えるしくみが使われている。',
    ],
    visual: {
      scene: 'fourier-waves',
      instruction: 'めざす形とたし合わせる波の数を選び、角 θ を動かして、円をまわる点の高さとサイン波の和を見くらべよう。',
      controls: [
        options('shape', 'めざす形', 'square', Object.entries(WAVE_SHAPES).map(([value, meta]) => ({ value, label: meta.label }))),
        options('terms', 'たし合わせる波の数', 1, [1, 2, 3, 5, 10].map((value) => ({ value, label: `${value}個` }))),
        range('theta', '角 θ', 0, 360, 30, 60, (value) => `${value}°`),
      ],
      formula: ({ shape, terms }) => {
        const count = Number(terms)
        const shown = Array.from({ length: Math.min(count, 3) }, (_, index) => waveTerm(shape, index + 1))
        const pieces = shown.map(({ k }, index) => {
          const body = k === 1 ? '\\sin x' : `\\frac{\\sin ${k}x}{${k}}`
          if (index === 0) return body
          return shape === 'saw' && (index + 1) % 2 === 0 ? `-${body}` : `+${body}`
        })
        if (count > 3) {
          const last = waveTerm(shape, count)
          const sign = shape === 'saw' && count % 2 === 0 ? '-' : '+'
          pieces.push(`+\\cdots${sign}\\frac{\\sin ${last.k}x}{${last.k}}`)
        }
        return shape === 'square' ? `y=\\frac{4}{\\pi}\\left(${pieces.join('')}\\right)` : `y=${pieces.join('')}`
      },
      insight: ({ shape, terms, theta }) => {
        const t = (Number(theta) * Math.PI) / 180
        const lead = Number(terms) === 1
          ? `波1つだけでは、ただのサイン波。`
          : `${terms}個のサイン波をたし合わせると、${WAVE_SHAPES[shape].label}の形に近づいてくる。`
        return `${lead}θ＝${theta}° で、円をまわる点の高さ sinθ≈${nice(Math.sin(t), 3)}。`
      },
    },
    uses: [
      { emoji: '🎵', title: '音と音色', text: '同じ高さの音でも楽器によって音色がちがうのは、ふくまれるサイン波の組み合わせがちがうから。' },
      { emoji: '📱', title: '音楽や写真のデータ', text: 'データを小さくするとき、波に分けて、聞こえにくい・見えにくい成分をけずっている。' },
      { emoji: '🌊', title: '潮の満ち引き', text: '潮の満ち引きの予測は、周期のちがういくつもの波をたし合わせて計算する。' },
    ],
    units: ['trigfn'],
    basics: [],
  },
  {
    id: 'mh-derivative',
    part: 'senior',
    theme: '微分・積分',
    emoji: '🔬',
    title: '微分と接線',
    headline: 'ある瞬間の速さを求める——ニュートンとライプニッツの微分',
    era: '1665年ごろ（ニュートン）・1684年（ライプニッツ）',
    year: 1684,
    place: 'イギリス・ドイツ',
    people: ['フェルマー', 'ニュートン', 'ライプニッツ'],
    question: '「ちょうどその瞬間の速さ」や「曲線の傾き」を、どうすれば求められるか？',
    story: [
      '平均の速さは、（進んだ距離）÷（かかった時間）で求められる。では、落ちていくボールの「ちょうどその瞬間」の速さはどうか。時間の幅をそのまま0にすると、0÷0になってしまう。',
      '17世紀の前半、フランスのフェルマーやデカルトは、曲線に接する直線（接線）の求め方を工夫していた。',
      'イギリスのニュートンは1665年ごろから、変化する量の、その瞬間の変わる割合を求める方法（流率法）を考えた。ドイツのライプニッツは別に同じ考えにたどり着き、1684年に「微分」の方法を論文で発表した。$\\frac{dy}{dx}$ という書き方は、ライプニッツが考えたものだ。',
      '$y=x^2$ で、$x$ から $x+h$ までの平均の変化の割合は $\\frac{(x+h)^2-x^2}{h}=2x+h$。$h$ を0に近づけると $2x$ に近づく。これが接線の傾きで、$(x^2)^{\\prime}=2x$ と書く。',
    ],
    visual: {
      scene: 'secant-tangent',
      instruction: '点の位置と幅 h を変えて、2点を結ぶ直線の傾きが、h を小さくすると接線の傾きに近づく様子を見よう。',
      controls: [
        range('x', '点の x', -2, 2, 0.5, 1, (value) => nice(value, 1)),
        options('h', '幅 h', 1, [1, 0.5, 0.1, 0.01].map((value) => ({ value, label: String(value) }))),
      ],
      formula: ({ x, h }) => {
        const X = Number(x)
        const H = Number(h)
        return `\\frac{(${signedText(X)}+${H})^2-${signedText(X)}^2}{${H}}=${nice(2 * X + H, 3)}\\ \\to\\ 2\\times${signedText(X)}=${nice(2 * X, 2)}`
      },
      insight: ({ x, h }) => {
        const X = Number(x)
        const H = Number(h)
        return `幅 h＝${H} のとき、2点を結ぶ直線の傾きは ${nice(2 * X + H, 3)}。h を小さくするほど、x＝${nice(X, 1)} での接線の傾き ${nice(2 * X, 2)} に近づく。`
      },
    },
    uses: [
      { emoji: '🚗', title: '速度計', text: '車の速度計が示すのは、その瞬間の速さ。位置の変化を時間で微分したものにあたる。' },
      { emoji: '📈', title: '変化の勢い', text: '人の数や売り上げが「どれだけの勢いでふえているか」は、グラフの傾き（微分）で表される。' },
    ],
    units: ['diff'],
    basics: [],
  },
  {
    id: 'mh-integral',
    part: 'senior',
    theme: '微分・積分',
    emoji: '🟩',
    title: '積分と面積',
    headline: '細い長方形を集めて面積を求める——アルキメデスからリーマンまで',
    era: '紀元前3世紀（アルキメデス）・1675年（ライプニッツ）・1854年（リーマン）',
    year: 1675,
    place: 'ギリシャ・ドイツ',
    people: ['アルキメデス', 'ライプニッツ', 'リーマン'],
    question: '曲線で囲まれた形の面積を、どうすれば正確に求められるか？',
    story: [
      '紀元前3世紀のアルキメデスは、放物線と直線で囲まれた部分の面積が、中に入る三角形の $\\frac{4}{3}$ 倍になることを、三角形をどんどん細かく入れていく方法で示した。',
      '1675年、ライプニッツは、細い長方形の面積をたし合わせることを表す記号 $\\int$ を考えた。ラテン語で「和」を表す summa の頭文字 S を、縦にのばした形だ。',
      '$y=x^2$ の、$x=0$ から1までの下の部分の面積を、幅 $\\frac{1}{n}$ の細い長方形 $n$ 本で近づけると、$n$ をふやすほど $\\frac{1}{3}$ に近づく。これを $\\int_0^1x^2\\,dx=\\frac{1}{3}$ と書く。',
      '1854年、リーマンは、この「長方形の面積の和が近づく値」として、積分をきちんと決めた。今、リーマン積分とよばれている。',
    ],
    visual: {
      scene: 'riemann-sum',
      instruction: '長方形の本数と高さのとり方を変えて、長方形の面積の和が、本当の面積 1/3 にどう近づくかを見よう。',
      controls: [
        options('n', '長方形の数', 4, [2, 4, 8, 16, 32].map((value) => ({ value, label: `${value}本` }))),
        options('side', '高さのとり方', 'right', [
          { value: 'left', label: '左はしの高さ' },
          { value: 'right', label: '右はしの高さ' },
        ]),
      ],
      formula: ({ n, side }) => `\\text{長方形の和}=${nice(riemannSum(Number(n), side), 4)}\\quad\\left(\\int_0^1x^2\\,dx=\\frac{1}{3}\\approx0.3333\\right)`,
      insight: ({ n, side }) => {
        const S = riemannSum(Number(n), side)
        return `${n}本の長方形の面積の和は ${nice(S, 4)}。${side === 'right' ? '右はし' : '左はし'}の高さを使うと、本当の面積 1/3 より${S > 1 / 3 ? '大きく' : '小さく'}なる。差は ${nice(Math.abs(S - 1 / 3), 4)}で、本数をふやすほど小さくなる。`
      },
    },
    uses: [
      { emoji: '🏗️', title: '建物やダム', text: '曲がった形の断面の面積や、壁全体にかかる水の力の合計を、積分で求める。' },
      { emoji: '🚀', title: '速さと距離', text: '速さのグラフの下の面積（積分）が、進んだ距離になる。' },
    ],
    units: ['integ', 'integ3'],
    basics: [],
  },
  {
    id: 'mh-ftc',
    part: 'senior',
    theme: '微分・積分',
    emoji: '🔁',
    title: '微分と積分は逆の計算',
    headline: '面積の増え方は高さに等しい——微分積分学の基本定理',
    era: '1670年（バロウ）・17世紀後半（ニュートン・ライプニッツ）',
    year: 1670,
    place: 'イギリス・ドイツ',
    people: ['バロウ', 'ニュートン', 'ライプニッツ'],
    question: '接線を求める計算（微分）と、面積を求める計算（積分）には、どんな関係があるのか？',
    story: [
      '面積を求める問題と、接線の傾きを求める問題は、長い間、別々の難しい問題だと考えられていた。',
      'ニュートンの先生だったとされるイギリスのバロウは、1670年の本で、この2つが逆の関係にあることを、図形の性質として示していた。',
      'ニュートンとライプニッツは、それぞれ、この関係を計算の方法として使えるようにした。0から $x$ までの面積を $S(x)$ とすると、$x$ を少し動かしたときの面積の増え方は、そのときの高さ $f(x)$ に等しい。つまり $S^{\\prime}(x)=f(x)$。',
      'だから積分は、微分するとその関数になる関数（原始関数）を見つければ計算できる。$\\int_0^1x^2\\,dx=\\left[\\frac{x^3}{3}\\right]_0^1=\\frac{1}{3}$。長方形を何百本もたす代わりに、式1つで答えが出る。',
    ],
    visual: {
      scene: 'area-function',
      instruction: '関数と右はし x を変えて、上の図の面積と、下の図の面積の関数のグラフの傾きを見くらべよう。',
      controls: [
        options('f', '関数', 'x', Object.entries(AREA_FUNCTIONS).map(([value, meta]) => ({ value, label: meta.label }))),
        range('x', '右はし x', 0.5, 3, 0.5, 2, (value) => nice(value, 1)),
      ],
      formula: ({ f, x }) => {
        const meta = AREA_FUNCTIONS[f]
        const X = Number(x)
        return `S(${nice(X, 1)})=\\int_0^{${nice(X, 1)}}${meta.tex}\\,dt=${meta.antiTex(nice(X, 1))}\\approx${nice(meta.S(X), 3)},\\quad S^{\\prime}(${nice(X, 1)})=f(${nice(X, 1)})=${nice(meta.f(X), 2)}`
      },
      insight: ({ f, x }) => {
        const meta = AREA_FUNCTIONS[f]
        const X = Number(x)
        return `0から${nice(X, 1)}までの面積は約${nice(meta.S(X), 3)}。x を少し動かすと、面積は高さ f(${nice(X, 1)})＝${nice(meta.f(X), 2)} の割合でふえる。下のグラフの接線の傾きが、上のグラフの高さと同じになっている。`
      },
    },
    uses: [
      { emoji: '🧮', title: '積分の計算', text: '面積や体積を、長方形を細かくたす代わりに、原始関数を使ってすばやく計算できる。' },
      { emoji: '🛰️', title: '位置・速さ・加速度', text: '加速度を積分すると速さ、速さを積分すると位置が分かる。逆に、位置を微分すると速さ。ロケットや人工衛星の計算の土台。' },
    ],
    units: ['integ', 'diff'],
    basics: [],
  },
  {
    id: 'mh-optimization',
    part: 'senior',
    theme: '微分・積分',
    emoji: '🛢️',
    title: '微分で最大・最小を求める',
    headline: 'いちばん多く入るのはどんな形か——ケプラーのワインだるとフェルマーの方法',
    era: '1615年（ケプラー）・1636年ごろ（フェルマー）',
    year: 1615,
    place: 'オーストリア・フランス',
    people: ['ケプラー', 'フェルマー'],
    question: '同じ材料で、いちばん多く入る入れ物の形はどう決まるか？',
    story: [
      'ケプラーは、1613年に結婚の祝いのワインを買ったとき、商人がたるに棒をななめに差しこんだ長さだけで量を決めるのを見てふしぎに思ったと、1615年の本に書いている。',
      'ケプラーはその本で、たるの体積を求め、いちばん体積が大きくなる形の近くでは、寸法を少し変えても体積がほとんど変わらないことに気づいた。',
      '1636年ごろ、フランスのフェルマーは、最大・最小になる点では、少し動かしても値がほとんど変わらないことを使って、その点を求める方法を考えた。今の言葉では「微分して0になる点」をさがすことにあたる。',
      'たとえば、1辺12cmの正方形の紙の4すみから1辺 $x$ cmの正方形を切り取って、ふたのない箱を作る。体積 $V=x(12-2x)^2$ を微分すると $V^{\\prime}=(12-2x)(12-6x)$ で、$x=2$ のとき体積は最大の128cm³になる。',
    ],
    visual: {
      scene: 'box-volume',
      instruction: '切り取る正方形の大きさ x を変えて、箱の体積と、体積のグラフの接線の傾き V′ の変わり方を見よう。',
      controls: [range('x', '切り取る正方形の1辺（cm）', 0.5, 5.5, 0.5, 1, (value) => nice(value, 1))],
      formula: ({ x }) => {
        const X = Number(x)
        return `V=${nice(X, 1)}\\times(12-2\\times${nice(X, 1)})^2=${nice(boxVolume(X), 2)},\\quad V^{\\prime}=${nice(boxSlope(X), 2)}`
      },
      insight: ({ x }) => {
        const X = Number(x)
        const slope = boxSlope(X)
        const lead = `x＝${nice(X, 1)} cm のとき、体積は ${nice(boxVolume(X), 2)} cm³。`
        if (slope > 0) return `${lead}V′＞0 なので、x をふやすと体積はまだふえる。`
        if (slope === 0) return `${lead}V′＝0。ここで体積がいちばん大きくなる。`
        return `${lead}V′＜0 なので、x をふやすと体積はへっていく。`
      },
    },
    uses: [
      { emoji: '🥫', title: '缶の形', text: '決まった量が入るふたつきの缶で、材料をいちばん少なくするのは、高さと直径が同じ形。微分で求められる。' },
      { emoji: '🚚', title: '費用と利益', text: '費用がいちばん少なく、利益がいちばん大きくなる量を、関数の最大・最小として求める。' },
    ],
    units: ['diff', 'diff3'],
    basics: [],
  },
  {
    id: 'mh-sum',
    part: 'senior',
    theme: '数列',
    emoji: '🪜',
    title: '等差数列の和',
    headline: '1から100までの和を一瞬で——ガウスの逸話と、並べて2倍にする考え',
    era: '1780年代（ガウスの子どものころ）',
    year: 1786,
    place: 'ドイツ',
    people: ['ガウス'],
    question: '1＋2＋3＋…＋100 のような長いたし算を、1つずつたさずに求められないか？',
    story: [
      'ドイツのガウスが小学生のころ、先生が「1から100までの数を全部たしなさい」という問題を出したところ、ガウスがすぐに5050と答えたという逸話がある。',
      'ガウスは、1＋100、2＋99、3＋98、…のように両はしから組にすると、どの組も101になることに気づいたとされる。組は50組あるので、101×50＝5050。',
      '同じ数の並びを逆の順にして下にそろえると、上下の和はどこも $1+n$ になり、それが $n$ 個ある。だから和の2倍は $n(n+1)$、和は $\\frac{n(n+1)}{2}$。階段の形を2つ組み合わせると長方形になる、と考えても同じだ。',
      '一定の数ずつ増える数の並び（等差数列）の和は、（はじめの数＋おわりの数）×（個数）÷2 で求められる。この求め方は、ガウスよりずっと前から知られていた。',
    ],
    visual: {
      scene: 'staircase-sum',
      instruction: '最後の数 n を変えて、階段の形と、同じ階段を2つ組み合わせた長方形を見くらべよう。',
      controls: [
        range('n', '最後の数 n', 1, 12, 1, 6),
        options('view', '見方', 'stairs', [
          { value: 'stairs', label: '階段' },
          { value: 'double', label: '2つ組み合わせる' },
        ]),
      ],
      formula: ({ n }) => {
        const N = Number(n)
        return `1+2+\\cdots+${N}=\\frac{${N}\\times${N + 1}}{2}=${(N * (N + 1)) / 2}`
      },
      insight: ({ n, view }) => {
        const N = Number(n)
        const sum = (N * (N + 1)) / 2
        return view === 'double'
          ? `同じ階段をさかさまにして組み合わせると、たて${N}・横${N + 1}の長方形（${N * (N + 1)}ます）になる。その半分が和の ${sum}。`
          : `1から${N}までをたすと${sum}。階段のます目の数と同じ。`
      },
    },
    uses: [
      { emoji: '🏟️', title: '客席の数', text: '前から1列ごとに2席ずつふえる客席の、全部の席の数を、等差数列の和で求められる。' },
      { emoji: '💰', title: '積み立て', text: '毎月の積み立ての額を一定ずつふやすときの合計を、等差数列の和で計算できる。' },
    ],
    units: ['seq'],
    basics: [],
  },
  {
    id: 'mh-fibonacci',
    part: 'senior',
    theme: '数列',
    emoji: '🐇',
    title: 'フィボナッチ数列',
    headline: 'うさぎのつがいの数え方——フィボナッチの『算盤の書』と黄金比',
    era: '1202年（『算盤の書』）',
    year: 1202,
    place: 'イタリア（ピサ）',
    people: ['フィボナッチ', 'ケプラー'],
    question: 'うさぎのつがいが毎月子を産むと、1年後に何つがいになるか？',
    story: [
      '1202年、イタリアのピサのフィボナッチ（レオナルド）は『算盤の書』を書き、インドやアラビアから伝わった0から9の数字と、それを使った計算の方法をヨーロッパに紹介した。',
      'その本に、うさぎの問題がある。生まれて2か月目から毎月1つがいの子を産むうさぎを1つがいから育てると、つがいの数は、前の2つをたした数になっていく。1年後には377つがいになる。',
      'この数の並び 1, 1, 2, 3, 5, 8, 13, … をフィボナッチ数列という。17世紀のケプラーは、となり合う数の比が $\\frac{1+\\sqrt{5}}{2}=1.618\\cdots$（黄金比）に近づくことに気づいていた。',
      'ひまわりの種の並びや松ぼっくりのうずの数には、フィボナッチ数が現れることが多い。',
    ],
    visual: {
      scene: 'fibonacci-squares',
      instruction: 'n を変えて、フィボナッチ数を1辺とする正方形を並べた形と、となり合う数の比が黄金比に近づく様子を見よう。',
      controls: [range('n', 'n（何番目の数）', 2, 12, 1, 6)],
      formula: ({ n }) => {
        const N = Number(n)
        const list = fibonacci(N + 1)
        return `F_{${N}}=${list[N - 1]},\\quad \\frac{F_{${N + 1}}}{F_{${N}}}=\\frac{${list[N]}}{${list[N - 1]}}\\approx${nice(list[N] / list[N - 1], 5)}`
      },
      insight: ({ n }) => {
        const N = Number(n)
        const list = fibonacci(N + 1)
        return `${N}番目のフィボナッチ数は${list[N - 1]}。次の数 ${list[N]} との比は約${nice(list[N] / list[N - 1], 5)}で、黄金比 1.61803… に近づいていく。`
      },
    },
    uses: [
      { emoji: '🌻', title: '植物の並び', text: 'ひまわりの種や松ぼっくりのうずの数には、13・21・34・55 などのフィボナッチ数が現れることが多い。' },
      { emoji: '💻', title: '計算の手順', text: 'フィボナッチ数列は、くり返しの計算の手順（アルゴリズム）を学ぶときの、定番の例になっている。' },
    ],
    units: ['seq'],
    basics: [],
  },
]
