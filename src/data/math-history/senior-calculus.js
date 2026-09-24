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
    quiz: [
      {
        id: 'mh-waves-1',
        question: '$y=\\sin x$ のグラフで、同じ形がくり返される間隔（周期）はどれか。',
        choices: ['360°（$2\\pi$）', '180°（$\\pi$）', '90°（$\\frac{\\pi}{2}$）'],
        answer: 0,
        explanation: '円を1周（360°）すると、点はもとの位置にもどるので、高さも同じ変化をくり返す。',
        notes: [
          '正解。',
          '180°で符号が逆になるが、形がくり返されるのは360°ごと。',
          '90°では、まだ円の4分の1しかまわっていない。',
        ],
      },
      {
        id: 'mh-waves-2',
        question: '単位円の上の点が角 $\\theta$ の位置にあるとき、点の高さ（y座標）を表すのはどれか。',
        choices: ['$\\sin\\theta$', '$\\cos\\theta$', '$\\tan\\theta$'],
        answer: 0,
        explanation: '単位円の上の点の座標は $(\\cos\\theta,\\ \\sin\\theta)$。',
        notes: [
          '正解。',
          '$\\cos\\theta$ は横の位置（x座標）。',
          '$\\tan\\theta$ は $\\frac{\\sin\\theta}{\\cos\\theta}$ で、原点と点を結ぶ直線の傾き。',
        ],
      },
      {
        id: 'mh-waves-3',
        question: 'フーリエの考えとして正しいものはどれか。',
        choices: ['くり返す形の変化は、いろいろな周期のサイン波をたし合わせて表せる', 'どんな波も1つのサイン波で表せる', '波は数の式では表せない'],
        answer: 0,
        explanation: '四角い波やのこぎりの波も、周期のちがうサイン波をたくさんたし合わせると表せる。',
        notes: [
          '正解。',
          '1つのサイン波では、なめらかな波の形しか表せない。',
          'サイン波の和という式で表せる。',
        ],
      },
      {
        id: 'mh-waves-4',
        question: '同じ高さの音でも、楽器によって音色がちがうのはなぜか。',
        choices: ['ふくまれるサイン波の組み合わせがちがうから', '波の振動数がちがうから', '音の大きさがちがうから'],
        answer: 0,
        explanation: '同じ高さの音は、いちばん低いサイン波の振動数が同じ。音色のちがいは、それに重なる波の組み合わせで決まる。',
        notes: [
          '正解。',
          '振動数がちがうと、音の高さがちがって聞こえる。',
          '音の大きさは波の大きさ（振幅）で決まり、音色とは別。',
        ],
      },
    ],
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
    quiz: [
      {
        id: 'mh-derivative-1',
        question: '$y=x^2$ の、$x=3$ での接線の傾きはどれか。',
        choices: ['6', '9', '3'],
        answer: 0,
        explanation: '$(x^2)^{\\prime}=2x$ なので、$x=3$ では $2\\times3=6$。',
        notes: [
          '正解。',
          '9は $x=3$ のときの $y$ の値。傾きではない。',
          '$x$ の値をそのまま答えている。',
        ],
      },
      {
        id: 'mh-derivative-2',
        question: '$\\frac{dy}{dx}$ という書き方を考えた人はだれか。',
        choices: ['ライプニッツ', 'ニュートン', 'デカルト'],
        answer: 0,
        explanation: 'ライプニッツの書き方は、使いやすさから今も広く使われている。',
        notes: [
          '正解。',
          'ニュートンは、文字の上に点をつける書き方を使った。',
          'デカルトは、座標で式と図形を結びつけた人。',
        ],
      },
      {
        id: 'mh-derivative-3',
        question: '$y=x^2$ で、$x=1$ から $x=1.1$ までの平均の変化の割合はどれか。',
        choices: ['2.1', '2', '0.21'],
        answer: 0,
        explanation: '$\\frac{1.1^2-1^2}{0.1}=\\frac{0.21}{0.1}=2.1$。幅を0に近づけると、接線の傾き2に近づく。',
        notes: [
          '正解。',
          '2は $x=1$ での接線の傾き。幅が0.1あるので、少しずれる。',
          '0.21は $y$ の増えた量。$x$ の増えた量0.1でわる。',
        ],
      },
      {
        id: 'mh-derivative-4',
        question: 'その瞬間の速さを「時間の幅0」でそのまま計算しようとすると、どうなるか。',
        choices: ['0÷0になって計算できない', 'いつも0になる', 'いつも1になる'],
        answer: 0,
        explanation: 'だから、幅を0に「近づけた」ときに近づく値として求める。これが微分の考え方。',
        notes: [
          '正解。',
          '速さが0になるわけではない。',
          '1になるわけではない。0÷0は、決まった値にならない。',
        ],
      },
    ],
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
    quiz: [
      {
        id: 'mh-integral-1',
        question: '$\\int_0^1x^2\\,dx$ の値はどれか。',
        choices: ['$\\frac{1}{3}$', '$\\frac{1}{2}$', '$1$'],
        answer: 0,
        explanation: '細い長方形の和が近づく値は $\\frac{1}{3}$。',
        notes: [
          '正解。',
          '$\\frac{1}{2}$ は $\\int_0^1x\\,dx$（直線の下の三角形）。',
          '1は1辺1の正方形全体の面積。',
        ],
      },
      {
        id: 'mh-integral-2',
        question: '積分の記号 $\\int$ のもとになった文字はどれか。',
        choices: ['「和」を表すラテン語 summa の S', 'integral の I', '関数 function の f'],
        answer: 0,
        explanation: 'ライプニッツは、細い長方形を「たし合わせる」ことから、S を縦にのばした記号を使った。',
        notes: [
          '正解。',
          'I の文字から来たのではない。',
          'f の文字から来たのではない。',
        ],
      },
      {
        id: 'mh-integral-3',
        question: '$y=x^2$ の0から1までの面積を、右はしの高さの長方形で近づけた。長方形をふやすと、和はどうなるか。',
        choices: ['大きい方から $\\frac{1}{3}$ に近づく', '小さい方から $\\frac{1}{3}$ に近づく', 'どこまでも大きくなる'],
        answer: 0,
        explanation: '$y=x^2$ は右上がりなので、右はしの高さの長方形は曲線からはみ出し、和は本当の面積より大きい。',
        notes: [
          '正解。',
          '小さい方から近づくのは、左はしの高さを使ったとき。',
          '長方形を細かくするほど、はみ出す部分は小さくなる。',
        ],
      },
      {
        id: 'mh-integral-4',
        question: 'アルキメデスが示した、放物線と直線で囲まれた部分の面積は、中に入る三角形の何倍か。',
        choices: ['$\\frac{4}{3}$ 倍', '$\\frac{3}{2}$ 倍', '$2$ 倍'],
        answer: 0,
        explanation: '三角形を細かく入れていくと、面積の和は $1+\\frac{1}{4}+\\frac{1}{16}+\\cdots=\\frac{4}{3}$ 倍になる。',
        notes: [
          '正解。',
          '計算すると $\\frac{4}{3}$ になる。',
          '2倍にはならない。',
        ],
      },
    ],
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
    quiz: [
      {
        id: 'mh-ftc-1',
        question: '0から $x$ までの面積を $S(x)$ とすると、$S^{\\prime}(x)$ はどれに等しいか。',
        choices: ['その点の高さ $f(x)$', '面積 $S(x)$ そのもの', '$f(x)$ の傾き $f^{\\prime}(x)$'],
        answer: 0,
        explanation: '$x$ を少し動かすと、面積は高さ $f(x)$、幅が少しの細い長方形の分だけふえる。',
        notes: [
          '正解。',
          '$S(x)$ そのものではなく、その増え方が $f(x)$ に等しい。',
          '$f$ の傾きではなく、$f$ の高さ。',
        ],
      },
      {
        id: 'mh-ftc-2',
        question: '$\\int_0^2x\\,dx$ の値はどれか。',
        choices: ['2', '4', '1'],
        answer: 0,
        explanation: '$\\left[\\frac{x^2}{2}\\right]_0^2=\\frac{4}{2}=2$。底辺2・高さ2の三角形の面積と同じ。',
        notes: [
          '正解。',
          '$2^2$ で、2でわるのを忘れている。',
          '$x=1$ までの面積と取りちがえている（$\\frac{1}{2}$ でもない）。',
        ],
      },
      {
        id: 'mh-ftc-3',
        question: '微分積分学の基本定理が教えてくれることはどれか。',
        choices: ['微分と積分は逆の計算になっている', '微分と積分は関係のない計算である', '積分はいつも0になる'],
        answer: 0,
        explanation: '面積の関数を微分するともとの関数にもどり、原始関数を使えば積分が計算できる。',
        notes: [
          '正解。',
          '2つは逆の関係で強く結びついている。',
          '0になるとは限らない。',
        ],
      },
      {
        id: 'mh-ftc-4',
        question: 'ニュートンの先生だったとされ、2つの計算が逆の関係にあることを図形で示していた人はだれか。',
        choices: ['バロウ', 'ガリレオ', 'ケプラー'],
        answer: 0,
        explanation: 'バロウは1670年の本で、接線と面積の関係を図形の性質として示した。',
        notes: [
          '正解。',
          'ガリレオは、落ちる動きの研究で知られる人。',
          'ケプラーは、惑星の動きの法則で知られる人。',
        ],
      },
    ],
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
    quiz: [
      {
        id: 'mh-optimization-1',
        question: 'なめらかな関数が最大になる点で、接線の傾き（微分係数）はどうなるか。',
        choices: ['0になる', 'いちばん大きくなる', '負になる'],
        answer: 0,
        explanation: '最大の点の手前では増え、その先では減るので、ちょうどその点では傾きが0。',
        notes: [
          '正解。',
          '傾きがいちばん大きいのは、いちばん急に増えているところで、最大の点ではない。',
          '負になるのは、最大の点を過ぎて減っているところ。',
        ],
      },
      {
        id: 'mh-optimization-2',
        question: '1辺12cmの紙の4すみから1辺2cmの正方形を切り取って作った、ふたのない箱の体積はどれか。',
        choices: ['128cm³', '144cm³', '200cm³'],
        answer: 0,
        explanation: '底は1辺 $12-2\\times2=8$ cm の正方形、高さは2cm。$8\\times8\\times2=128$。',
        notes: [
          '正解。',
          '144は、もとの紙の面積の数（12×12）。',
          '底の1辺を $12-2=10$ としている。両側から切り取るので $12-4=8$。',
        ],
      },
      {
        id: 'mh-optimization-3',
        question: 'ケプラーがたるの体積を調べたきっかけとして、本人が書いていることはどれか。',
        choices: ['結婚の祝いのワインの量のはかり方', '惑星の動きを調べるため', '船の荷物を積むため'],
        answer: 0,
        explanation: '商人が棒1本で量を決めるのを見てふしぎに思ったと、1615年の本に書いている。',
        notes: [
          '正解。',
          '惑星の動きは、ケプラーの別の大きな研究。',
          '船の荷物の話ではない。',
        ],
      },
    ],
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
    quiz: [
      {
        id: 'mh-sum-1',
        question: '1から100までの和はいくつか。',
        choices: ['5050', '10100', '5000'],
        answer: 0,
        explanation: '$\\frac{100\\times101}{2}=5050$。',
        notes: [
          '正解。',
          '$100\\times101$ で、2でわるのを忘れている。',
          '$\\frac{100\\times100}{2}$ としている。組の和は101。',
        ],
      },
      {
        id: 'mh-sum-2',
        question: '1から20までの和はいくつか。',
        choices: ['210', '200', '420'],
        answer: 0,
        explanation: '$\\frac{20\\times21}{2}=210$。',
        notes: [
          '正解。',
          '$\\frac{20\\times20}{2}$ としている。',
          '$20\\times21$ で、2でわるのを忘れている。',
        ],
      },
      {
        id: 'mh-sum-3',
        question: '等差数列 3, 5, 7, …, 21 の和はいくつか。',
        choices: ['120', '240', '108'],
        answer: 0,
        explanation: '個数は $\\frac{21-3}{2}+1=10$ 個。和は $\\frac{(3+21)\\times10}{2}=120$。',
        notes: [
          '正解。',
          '2でわるのを忘れている。',
          '個数を9個と数えている。はじめの3もふくめて10個。',
        ],
      },
    ],
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
    quiz: [
      {
        id: 'mh-fibonacci-1',
        question: '1, 1, 2, 3, 5, 8 の次の数はどれか。',
        choices: ['13', '11', '16'],
        answer: 0,
        explanation: '前の2つをたす：$5+8=13$。',
        notes: [
          '正解。',
          '差をもとにして、8に3をたしている。前の2つをたす。',
          '8を2倍している。',
        ],
      },
      {
        id: 'mh-fibonacci-2',
        question: 'フィボナッチの『算盤の書』がヨーロッパに広めたものはどれか。',
        choices: ['0から9の数字を使う計算', 'ローマ数字', 'そろばんを使う計算'],
        answer: 0,
        explanation: 'インドで生まれ、アラビアを経て伝わった数字（今の算用数字）と、それを書いて計算する方法を紹介した。',
        notes: [
          '正解。',
          'ローマ数字は、それより前からヨーロッパで使われていた。',
          '書名に「算盤」とあるが、広めたのは数字を書いて計算する方法。',
        ],
      },
      {
        id: 'mh-fibonacci-3',
        question: 'となり合うフィボナッチ数の比は、どんな数に近づくか。',
        choices: ['約1.618（黄金比）', '約3.14（円周率）', '約2.718（e）'],
        answer: 0,
        explanation: '$\\frac{F_{n+1}}{F_n}$ は $\\frac{1+\\sqrt{5}}{2}=1.618\\cdots$ に近づく。',
        notes: [
          '正解。',
          '円周率は、円の周の長さと直径の比。',
          'e は、複利の計算などで現れる数。',
        ],
      },
    ],
  },
]
