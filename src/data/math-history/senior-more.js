// 数学の歴史をたどるコース：第3部「高校の数学」のおわり（統計的な推測・ベクトル・式と曲線・極限）。
// 話の形は basic-number.js の冒頭を参照。
import { approxTex, nice, options, range } from './controls.js'

const choose = (n, k) => {
  if (k < 0 || k > n) return 0
  let value = 1
  for (let index = 1; index <= k; index += 1) value = (value * (n - k + index)) / index
  return Math.round(value)
}

// ── 二項分布と正規分布 ─────────────────────────────────────────────
export const NORMAL_BANDS = Object.freeze({
  none: { label: 'なし', width: 0 },
  sd1: { label: '平均±1標準偏差', width: 1 },
  sd2: { label: '平均±2標準偏差', width: 2 },
})

export function binomialHalf(n) {
  return Array.from({ length: n + 1 }, (_, k) => choose(n, k) / 2 ** n)
}

/** 平均±width×標準偏差の範囲に入る確率（整数 k で数える）。 */
export function bandProbability(n, width) {
  const mean = n / 2
  const sd = Math.sqrt(n) / 2
  const lo = Math.ceil(mean - width * sd - 1e-9)
  const hi = Math.floor(mean + width * sd + 1e-9)
  const probs = binomialHalf(n)
  let sum = 0
  for (let k = Math.max(0, lo); k <= Math.min(n, hi); k += 1) sum += probs[k]
  return { lo: Math.max(0, lo), hi: Math.min(n, hi), sum, mean, sd }
}

// ── 仮説検定：8杯のうちミルクが先の4杯を当てる ──────────────────────────
/** ちょうど k 杯当たる選び方の数（全部で70通り）。 */
export const teaWays = (k) => choose(4, k) * choose(4, 4 - k)
export const teaAtLeast = (k) => [0, 1, 2, 3, 4].filter((value) => value >= k).reduce((sum, value) => sum + teaWays(value), 0)

// ── ベクトル ───────────────────────────────────────────────────────
export function vectorSum(a, b, angle) {
  const t = (angle * Math.PI) / 180
  const bx = b * Math.cos(t)
  const by = b * Math.sin(t)
  const rx = a + bx
  const ry = by
  return { bx, by, rx, ry, length: Math.hypot(rx, ry) }
}

// ── だ円：a＝5 のだ円と、離心率 e ────────────────────────────────────
export const ELLIPSE_A = 5

export function ellipsePoint(e, degrees) {
  const b = ELLIPSE_A * Math.sqrt(1 - e * e)
  const c = ELLIPSE_A * e
  const t = (degrees * Math.PI) / 180
  const x = ELLIPSE_A * Math.cos(t)
  const y = b * Math.sin(t)
  return { b, c, x, y, d1: Math.hypot(x + c, y), d2: Math.hypot(x - c, y) }
}

// ── 極限：無限等比級数 ─────────────────────────────────────────────
export const SERIES = Object.freeze({
  half: { label: '半分ずつ（1/2＋1/4＋…）', first: 0.5, ratio: 0.5, limit: 1 },
  achilles: { label: 'アキレスと亀（100＋10＋1＋…）', first: 100, ratio: 0.1, limit: 1000 / 9 },
})

export const partialSum = (series, n) => {
  const { first, ratio } = SERIES[series]
  return (first * (1 - ratio ** n)) / (1 - ratio)
}

export const MATH_HISTORY_SENIOR_MORE = [
  {
    id: 'mh-normal',
    part: 'senior',
    theme: '確率・データ',
    emoji: '🔔',
    title: '二項分布と正規分布',
    headline: '落ちる玉がえがく、つりがね形の山——ド・モアブルからガウスへ',
    era: '1733年（ド・モアブル）・1809年（ガウス）・1873年ごろ（ゴールトン）',
    year: 1733,
    place: 'イギリス・ドイツ',
    people: ['ド・モアブル', 'ガウス', 'ゴールトン'],
    question: 'コインを何百回も投げたとき、表の出る回数はどんなふうに散らばるか？',
    story: [
      'コインを $n$ 回投げて表が出る回数は、0回から $n$ 回までのどれかになる。ちょうど $k$ 回になる確率は ${}_n\\mathrm{C}_k\\left(\\frac{1}{2}\\right)^n$ で、この散らばり方を二項分布という。',
      '1733年、フランス生まれでイギリスで活やくしたド・モアブルは、$n$ が大きいとき、この確率のグラフが、なめらかなつりがね形の曲線に近づくことを示した。',
      '1809年、ドイツのガウスは、天体の観測の誤差がこの形に従うと考えて、観測値から最も確からしい値を求める方法を示した。そのためこの曲線は「ガウス分布」ともよばれ、今は正規分布という。',
      'イギリスのゴールトンは1873年ごろ、くぎを並べた板の上から玉を落とすと、左右に分かれながら落ちた玉が、下でつりがね形の山になる装置を作った。',
    ],
    visual: {
      scene: 'galton-board',
      instruction: 'コインを投げる回数（くぎの段の数）を変えて、表の回数の確率の棒グラフが、つりがね形の曲線に近づく様子を見よう。',
      controls: [
        options('n', '投げる回数', 16, [4, 16, 64, 256].map((value) => ({ value, label: `${value}回` }))),
        options('band', '見る範囲', 'sd1', Object.entries(NORMAL_BANDS).map(([value, meta]) => ({ value, label: meta.label }))),
      ],
      formula: ({ n }) => {
        const N = Number(n)
        return `P(X=k)={}_{${N}}\\mathrm{C}_k\\left(\\tfrac{1}{2}\\right)^{${N}},\\quad \\text{平均}\\ ${N / 2},\\ \\text{標準偏差}\\ \\tfrac{\\sqrt{${N}}}{2}${approxTex(Math.sqrt(N) / 2, 2)}${nice(Math.sqrt(N) / 2, 2)}`
      },
      insight: ({ n, band }) => {
        const N = Number(n)
        const width = NORMAL_BANDS[band].width
        if (!width) return `${N}回投げると、表の回数は平均の${N / 2}回のまわりに集まり、両はしほど起こりにくい。回数がふえるほど、グラフはなめらかなつりがね形に近づく。`
        const { lo, hi, sum } = bandProbability(N, width)
        const normal = width === 1 ? '約68%' : '約95%'
        return `平均±${width}標準偏差（${lo}回〜${hi}回）に入る確率は約${nice(sum * 100, 1)}%。正規分布では${normal}で、回数をふやすほどこれに近づく。`
      },
    },
    uses: [
      { emoji: '📏', title: 'テストの偏差値', text: '偏差値は、点数の散らばりが正規分布に近いと考えて、平均を50、標準偏差を10にそろえた目もり。' },
      { emoji: '🏭', title: '製品のばらつき', text: '工場で作る製品の大きさのばらつきは正規分布に近いことが多く、不良品の割合の見積もりに使われる。' },
    ],
    units: ['statB'],
    basics: [],
    quiz: [
      {
        id: 'mh-normal-1',
        question: 'コインを4回投げて、表がちょうど2回出る確率はどれか。',
        choices: ['$\\frac{3}{8}$', '$\\frac{1}{2}$', '$\\frac{1}{4}$'],
        answer: 0,
        explanation: '${}_4\\mathrm{C}_2\\left(\\frac{1}{2}\\right)^4=\\frac{6}{16}=\\frac{3}{8}$。',
        notes: [
          '正解。',
          '「半分は表」という感じで答えている。ちょうど2回になる確率は $\\frac{1}{2}$ より小さい。',
          '$\\frac{4}{16}$ は、表がちょうど1回（または3回）の確率。',
        ],
      },
      {
        id: 'mh-normal-2',
        question: '正規分布で、平均±1標準偏差の範囲に入る割合はおよそどれくらいか。',
        choices: ['68%', '50%', '95%'],
        answer: 0,
        explanation: '平均±1標準偏差に約68%、±2標準偏差に約95%が入る。',
        notes: [
          '正解。',
          '50%は、平均より上（または下）に入る割合。',
          '95%は、平均±2標準偏差の範囲。',
        ],
      },
      {
        id: 'mh-normal-3',
        question: '偏差値60は、平均より標準偏差いくつ分上か。',
        choices: ['1つ分', '2つ分', '10個分'],
        answer: 0,
        explanation: '偏差値は平均を50、標準偏差を10にそろえた目もりなので、60は標準偏差1つ分上。',
        notes: [
          '正解。',
          '2つ分上は偏差値70。',
          '偏差値の10が、標準偏差1つ分にあたる。',
        ],
      },
      {
        id: 'mh-normal-4',
        question: '観測の誤差がつりがね形に従うと考え、最も確からしい値を求める方法を示した人はだれか。',
        choices: ['ガウス', 'パスカル', 'ユークリッド'],
        answer: 0,
        explanation: 'ガウスは1809年、天体の観測の誤差を考えて、この方法を示した。',
        notes: [
          '正解。',
          'パスカルは、フェルマーとの手紙で確率の考えを始めた人。',
          'ユークリッドは『原論』で図形の性質を証明した人。',
        ],
      },
    ],
  },
  {
    id: 'mh-tea',
    part: 'senior',
    theme: '確率・データ',
    emoji: '🫖',
    title: '仮説検定',
    headline: 'ミルクが先か、紅茶が先か——フィッシャーの「紅茶を味わう婦人」',
    era: '1920年代・1935年（『実験計画法』）',
    year: 1935,
    place: 'イギリス',
    people: ['フィッシャー', 'ミュリエル・ブリストル'],
    question: '「見分けられる」という人の言い分が、たまたま当たっただけではないことを、どう確かめるか？',
    story: [
      'イギリスの統計学者フィッシャーの同僚ミュリエル・ブリストルは、紅茶にミルクを先に入れたか、あとに入れたかを、飲んで見分けられると言ったと伝えられる。',
      'フィッシャーは1935年の本『実験計画法』で、この話をもとに確かめ方を説明した。8杯のうち4杯をミルクが先、4杯を紅茶が先にして、でたらめな順に並べて飲んでもらい、ミルクが先の4杯を選んでもらう。',
      'まず「本当は見分けられず、あてずっぽうで選んでいる」と仮定する。そのとき、ミルクが先の4杯を全部当てるのは、選び方 ${}_8\\mathrm{C}_4=70$ 通りのうち1通りだけで、確率は $\\frac{1}{70}\\approx1.4\\%$。',
      'こんなに起こりにくいことが起きたなら、「あてずっぽう」という仮定の方を疑う。これが仮説検定の考え方で、新しい薬や方法に本当に効き目があるかを確かめるときに使われている。',
    ],
    visual: {
      scene: 'tea-test',
      instruction: '当てた杯の数を変えて、あてずっぽうでもそれ以上当たる確率がどれくらいかを見よう。',
      controls: [range('hits', 'ミルクが先と当てた杯の数（4杯中）', 0, 4, 1, 4, (value) => `${value}杯`)],
      formula: ({ hits }) => {
        const count = teaAtLeast(Number(hits))
        return `P(\\text{${hits}杯以上当たる})=\\frac{${count}}{70}${approxTex((count / 70) * 100, 1)}${nice((count / 70) * 100, 1)}\\%`
      },
      insight: ({ hits }) => {
        const k = Number(hits)
        const percent = nice((teaAtLeast(k) / 70) * 100, 1)
        if (k === 4) return `あてずっぽうで4杯全部が当たる確率は約${percent}%。とても起こりにくいので、「見分けられる」と考えてよさそうだ。`
        if (k === 3) return `あてずっぽうでも3杯以上当たる確率は約${percent}%で、4回に1回くらいは起こる。これだけでは「見分けられる」とは言いにくい。`
        return `あてずっぽうでも${k}杯以上当たる確率は約${percent}%。よく起こることなので、見分けられる証拠にはならない。`
      },
    },
    uses: [
      { emoji: '💊', title: '薬の効き目', text: '新しい薬を飲んだ人たちと飲まなかった人たちの差が、たまたまでは説明できないほど大きいかを、検定で確かめる。' },
      { emoji: '🌐', title: '画面のデザイン', text: '2つのデザインのどちらが使われやすいかを、利用者の反応のちがいが偶然かどうかで判断する。' },
    ],
    units: ['statB'],
    basics: [],
    quiz: [
      {
        id: 'mh-tea-1',
        question: '8杯（ミルクが先4杯・紅茶が先4杯）から、ミルクが先と思う4杯を選ぶ選び方は何通りか。',
        choices: ['70通り', '16通り', '8通り'],
        answer: 0,
        explanation: '${}_8\\mathrm{C}_4=\\frac{8\\times7\\times6\\times5}{4\\times3\\times2\\times1}=70$。',
        notes: [
          '正解。',
          '16通りは、4杯のうち3杯を当てる選び方の数（${}_4\\mathrm{C}_3\\times{}_4\\mathrm{C}_1$）。',
          '8は杯の数。選び方の数ではない。',
        ],
      },
      {
        id: 'mh-tea-2',
        question: 'あてずっぽうで4杯全部を当てる確率に最も近いのはどれか。',
        choices: ['約1.4%', '約25%', '50%'],
        answer: 0,
        explanation: '70通りのうち1通りなので $\\frac{1}{70}\\approx1.4\\%$。',
        notes: [
          '正解。',
          '約24%は、3杯以上当たる確率。',
          '1杯ずつ半分の確率で当たるわけではない。',
        ],
      },
      {
        id: 'mh-tea-3',
        question: '仮説検定の考え方として正しいものはどれか。',
        choices: [
          '「偶然だ」と仮定し、その下では起こりにくいことが起きたら、仮定を疑う',
          '起こりやすいことが起きたら、仮定が正しいと証明できる',
          '1回でも当たれば、見分けられると決める',
        ],
        answer: 0,
        explanation: '「偶然」という仮定の下での確率がとても小さいとき、その仮定を捨てる。',
        notes: [
          '正解。',
          '起こりやすいことが起きても、仮定が正しいことの証明にはならない。',
          '1回当たるのは偶然でもよく起こる。',
        ],
      },
      {
        id: 'mh-tea-4',
        question: '紅茶の話をもとに、確かめ方を1935年の本で説明した人はだれか。',
        choices: ['フィッシャー', 'ゴールトン', 'ナイチンゲール'],
        answer: 0,
        explanation: 'フィッシャーは『実験計画法』で、偶然を考えに入れた実験の組み立て方を説明した。',
        notes: [
          '正解。',
          'ゴールトンは、相関や平均への回帰を調べた人。',
          'ナイチンゲールは、看護と、統計のグラフで知られる人。',
        ],
      },
    ],
  },
  {
    id: 'mh-vector',
    part: 'senior',
    theme: 'ベクトル',
    emoji: '➡️',
    title: 'ベクトル',
    headline: '向きと大きさをもつ量——力の平行四辺形から、ハミルトン、ギブズへ',
    era: '1586年（ステヴィン）・1843年（ハミルトン）・1880年代（ギブズ）',
    year: 1586,
    place: 'オランダ・アイルランド・アメリカ',
    people: ['ステヴィン', 'ハミルトン', 'ギブズ'],
    question: '2つの力を同時にかけると、ものはどちらへ、どれだけの力で引かれるか？',
    story: [
      '2人が綱を別々の方向に引くと、ものはその間の方向に引かれる。2つの力を2辺とする平行四辺形をかくと、その対角線が合わせた力になる（力の平行四辺形の法則）。オランダのステヴィンは1586年の本で、力のつり合いを調べ、この法則につながる考えを示したとされる。',
      '1843年、アイルランドのハミルトンは、空間の回転などを計算するための「四元数」を考え、その研究の中で「ベクトル」という言葉を使い始めた。',
      '1880年代、アメリカのギブズやイギリスのヘヴィサイドは、物理の計算に使いやすいように、今の形のベクトルの計算（和や内積など）をまとめた。',
      'ベクトルは矢印で表し、たし算は矢印をつなぐ（または平行四辺形をかく）ことで求める。成分で表すと $(a_1,\\ a_2)+(b_1,\\ b_2)=(a_1+b_1,\\ a_2+b_2)$。',
    ],
    visual: {
      scene: 'vector-sum',
      instruction: '2つの力の大きさと、力の間の角を変えて、平行四辺形の対角線（合わせた力）の向きと大きさを見よう。',
      controls: [
        range('a', '力1の大きさ', 1, 4, 1, 3),
        range('b', '力2の大きさ', 1, 4, 1, 2),
        range('angle', '2つの力の間の角', 0, 180, 30, 60, (value) => `${value}°`),
      ],
      formula: ({ a, b, angle }) => {
        const { bx, by, rx, ry, length } = vectorSum(Number(a), Number(b), Number(angle))
        return `\\vec{a}+\\vec{b}=(${a},\\ 0)+(${nice(bx, 2)},\\ ${nice(by, 2)})=(${nice(rx, 2)},\\ ${nice(ry, 2)}),\\quad |\\vec{a}+\\vec{b}|${approxTex(length, 2)}${nice(length, 2)}`
      },
      insight: ({ a, b, angle }) => {
        const A = Number(a)
        const B = Number(b)
        const { length } = vectorSum(A, B, Number(angle))
        if (Number(angle) === 0) return `同じ向きなら、大きさはそのままたし算で ${A + B}。`
        if (Number(angle) === 180) return `反対向きなら、大きさはひき算で ${Math.abs(A - B)}。${A === B ? '同じ大きさなので、つり合って0になる。' : ''}`
        return `間の角が${angle}°のとき、合わせた力の大きさは約${nice(length, 2)}。${A}＋${B}＝${A + B} より小さく、角が大きいほど小さくなる。`
      },
    },
    uses: [
      { emoji: '✈️', title: '飛行機と風', text: '飛行機の地面に対する速さと向きは、飛行機自身の速度と、風の速度のベクトルの和で決まる。' },
      { emoji: '🎮', title: 'ゲームの動き', text: 'キャラクターの位置や速さは、ベクトルのたし算で計算されている。' },
      { emoji: '🌉', title: '橋や建物', text: '部材にかかる力をベクトルに分けて、つり合っているかを計算する。' },
    ],
    units: ['vector'],
    basics: [],
    quiz: [
      {
        id: 'mh-vector-1',
        question: '$(2,\\ 1)+(1,\\ 3)$ はどれか。',
        choices: ['$(3,\\ 4)$', '$(2,\\ 3)$', '$(3,\\ 3)$'],
        answer: 0,
        explanation: '成分ごとにたす：$(2+1,\\ 1+3)=(3,\\ 4)$。',
        notes: [
          '正解。',
          '成分をかけている（$2\\times1$、$1\\times3$）。',
          '2つ目の成分の計算をまちがえている。$1+3=4$。',
        ],
      },
      {
        id: 'mh-vector-2',
        question: '大きさ3と4の力が直角にはたらくとき、合わせた力の大きさはどれか。',
        choices: ['5', '7', '1'],
        answer: 0,
        explanation: '平行四辺形は長方形になり、対角線は $\\sqrt{3^2+4^2}=5$。',
        notes: [
          '正解。',
          '7は同じ向きにはたらくときの大きさ。',
          '1は反対向きにはたらくときの大きさ。',
        ],
      },
      {
        id: 'mh-vector-3',
        question: '四元数を考え、「ベクトル」という言葉を使い始めた人はだれか。',
        choices: ['ハミルトン', 'ニュートン', 'フェルマー'],
        answer: 0,
        explanation: 'アイルランドのハミルトンは1843年に四元数を考え、その研究の中でこの言葉を使った。',
        notes: [
          '正解。',
          'ニュートンは、微分・積分やものの動きの法則で知られる人。',
          'フェルマーは、座標や確率の考えで知られる人。',
        ],
      },
      {
        id: 'mh-vector-4',
        question: '同じ大きさの2つの力が反対向きにはたらくと、合わせた力はどうなるか。',
        choices: ['0になる（つり合う）', '2倍になる', '向きが90°変わる'],
        answer: 0,
        explanation: '矢印をつなぐと、もとの場所にもどるので、合わせた力は0。',
        notes: [
          '正解。',
          '2倍になるのは、同じ向きのとき。',
          '向きが変わるのではなく、打ち消し合う。',
        ],
      },
    ],
  },
  {
    id: 'mh-ellipse',
    part: 'senior',
    theme: '図形',
    emoji: '🪐',
    title: 'だ円と惑星の軌道',
    headline: '2本のピンと糸でかく曲線——アポロニオスの円すい曲線とケプラーの法則',
    era: '紀元前200年ごろ（アポロニオス）・1609年（ケプラー）',
    year: -200,
    place: 'ギリシャ・プラハ',
    people: ['アポロニオス', 'ケプラー'],
    question: '惑星は、太陽のまわりを、どんな形の道を通ってまわっているのか？',
    story: [
      '紀元前200年ごろ、ギリシャのアポロニオスは『円錐曲線論（えんすいきょくせんろん）』で、円すいを平面で切った切り口にできる曲線（だ円・放物線・双曲線）の性質をくわしく調べた。これらの曲線の名前も、アポロニオスが付けたとされる。',
      '2つの点（焦点）からの距離の和が一定になる点を集めると、だ円になる。2本のピンに糸の輪をかけ、鉛筆で糸をぴんと張りながら動かすと、だ円がかける。',
      '1609年、プラハで研究していたケプラーは『新天文学』で、火星は太陽を1つの焦点とするだ円の上をまわると発表した（ケプラーの第1法則）。それまで、天体の動きは、円を組み合わせて説明するものと考えられていた。',
      'だ円の式は $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$。つぶれ具合（離心率）が0なら円になる。地球の軌道は、離心率が約0.017の、ほとんど円に近いだ円だ。',
    ],
    visual: {
      scene: 'ellipse-string',
      instruction: 'つぶれ具合（離心率）と点の位置を変えて、2つの焦点からの距離の和が、いつも同じになることを確かめよう。',
      controls: [
        range('e', 'つぶれ具合（離心率）', 0, 0.9, 0.1, 0.5, (value) => nice(value, 1)),
        range('t', '点の位置', 0, 330, 30, 60, (value) => `${value}°`),
      ],
      formula: ({ e, t }) => {
        const { b, d1, d2 } = ellipsePoint(Number(e), Number(t))
        return `\\frac{x^2}{5^2}+\\frac{y^2}{${nice(b, 2)}^2}=1,\\quad PF_1+PF_2=${nice(d1, 2)}+${nice(d2, 2)}=${nice(d1 + d2, 2)}`
      },
      insight: ({ e, t }) => {
        const E = Number(e)
        const { d1, d2 } = ellipsePoint(E, Number(t))
        if (E === 0) return `離心率0では2つの焦点が中心で重なり、円になる。どの点までも距離は5で、和は10。`
        return `離心率${nice(E, 1)}。この点では、焦点までの距離が ${nice(d1, 2)} と ${nice(d2, 2)} で、和は ${nice(d1 + d2, 2)}。点をどこに動かしても、和はいつも10（糸の長さ）。`
      },
    },
    uses: [
      { emoji: '🛰️', title: '人工衛星の軌道', text: '人工衛星の多くは、地球を1つの焦点とするだ円の軌道をまわっている。' },
      { emoji: '🏛️', title: 'ささやきの回廊', text: 'だ円の形の部屋では、一方の焦点でささやいた声が、もう一方の焦点ではっきり聞こえる。' },
      { emoji: '🩺', title: '結石の治療', text: 'だ円の鏡の一方の焦点で起こした衝撃波を、もう一方の焦点に合わせた体の中の結石に集めて、くだく治療がある。' },
    ],
    units: ['curveC'],
    basics: [],
    quiz: [
      {
        id: 'mh-ellipse-1',
        question: 'だ円の上の点から、2つの焦点までの距離の和はどうなるか。',
        choices: ['どの点でも一定', '点によって変わる', 'いつも0'],
        answer: 0,
        explanation: 'だ円は、2つの焦点からの距離の和が一定になる点の集まり。',
        notes: [
          '正解。',
          'それぞれの距離は変わるが、和は変わらない。',
          '距離の和が0になることはない。',
        ],
      },
      {
        id: 'mh-ellipse-2',
        question: 'ケプラーが1609年に発表した、火星の軌道の形はどれか。',
        choices: ['太陽を1つの焦点とするだ円', '太陽を中心とする円', '放物線'],
        answer: 0,
        explanation: 'ケプラーは『新天文学』で、惑星の軌道が円ではなくだ円であることを示した。',
        notes: [
          '正解。',
          'それまでの考え方。観測と合わなかった。',
          '放物線では、太陽のまわりをまわり続けない。',
        ],
      },
      {
        id: 'mh-ellipse-3',
        question: '離心率が0のだ円は、どんな形か。',
        choices: ['円', '直線', '放物線'],
        answer: 0,
        explanation: '離心率0では2つの焦点が重なり、どの点も中心から同じ距離になる。',
        notes: [
          '正解。',
          '離心率が1に近づくほど細長くなるが、0では円。',
          '放物線は離心率が1の曲線。',
        ],
      },
    ],
  },
  {
    id: 'mh-parabola',
    part: 'senior',
    theme: '関数',
    emoji: '📡',
    title: '放物線と焦点',
    headline: '平行な光を1点に集める——放物線の焦点と、パラボラアンテナ',
    era: '紀元前2世紀ごろ（ディオクレス）・1638年（ガリレオ）',
    year: -190,
    place: 'ギリシャ・イタリア',
    people: ['ディオクレス', 'ガリレオ・ガリレイ'],
    question: '遠くから来る弱い電波や光を、1点に集めるには、どんな形の鏡がよいか？',
    story: [
      '放物線は、ある点（焦点）と、ある直線（準線）から、等しい距離にある点を集めた曲線だ。$y=\\frac{x^2}{4p}$ の焦点は $(0,\\ p)$、準線は $y=-p$。',
      '放物線には、軸に平行に入ってきた光が、はね返ってすべて焦点に集まる性質がある。紀元前2世紀ごろのディオクレスは『燃える鏡について』で、この性質を証明した。',
      '1638年、ガリレオは『新科学対話』で、投げたものの通り道が放物線になることを示した。',
      '今、パラボラアンテナや懐中電灯の反射鏡は、放物線を回した形になっている。アンテナは遠くの衛星からの電波を、焦点に置いた受信器に集め、懐中電灯は、焦点に置いた電球の光を平行にして送り出す。',
    ],
    visual: {
      scene: 'parabola-focus',
      instruction: '焦点までの距離 p と、光の入る位置を変えて、反射した光が焦点に集まる様子と、焦点と準線までの距離が等しいことを見よう。',
      controls: [
        range('p', '焦点までの距離 p', 0.5, 2, 0.5, 1, (value) => nice(value, 1)),
        range('ray', '光の入る位置 x', -3, 3, 1, 2),
      ],
      formula: ({ p }) => {
        const P = Number(p)
        return `y=\\frac{x^2}{${nice(4 * P, 1)}},\\quad \\text{焦点}\\ (0,\\ ${nice(P, 1)}),\\ \\text{準線}\\ y=-${nice(P, 1)}`
      },
      insight: ({ p, ray }) => {
        const P = Number(p)
        const X = Number(ray)
        if (X === 0) return '真ん中から入った光は、そのまま焦点を通る。'
        const y = (X * X) / (4 * P)
        return `x＝${X} から入った光は、放物線ではね返って、焦点 (0, ${nice(P, 1)}) に集まる。はね返った点から焦点までと、準線までの距離は、どちらも ${nice(y + P, 2)}。`
      },
    },
    uses: [
      { emoji: '📡', title: 'パラボラアンテナ', text: '衛星放送のアンテナは、遠くの衛星からの弱い電波を、焦点に置いた受信器に集める。' },
      { emoji: '🔦', title: '懐中電灯やライト', text: '焦点に置いた電球の光を、放物面の鏡で平行な光にして、遠くまで届ける。' },
      { emoji: '⛲', title: '噴水の水', text: '噴き出した水の通り道は、放物線をえがく。' },
    ],
    units: ['curveC', 'qfn'],
    basics: [],
    quiz: [
      {
        id: 'mh-parabola-1',
        question: '放物線 $y=\\frac{x^2}{4}$ の焦点はどれか。',
        choices: ['$(0,\\ 1)$', '$(0,\\ 4)$', '$(1,\\ 0)$'],
        answer: 0,
        explanation: '$y=\\frac{x^2}{4p}$ で $4p=4$ なので $p=1$。焦点は $(0,\\ 1)$。',
        notes: [
          '正解。',
          '4は $4p$ の値。$p=1$。',
          '焦点は軸（y軸）の上にある。',
        ],
      },
      {
        id: 'mh-parabola-2',
        question: 'パラボラアンテナが放物線を回した形をしている理由はどれか。',
        choices: ['軸に平行に来た電波を、はね返して焦点の1点に集められるから', '作るのがいちばん簡単だから', '電波を四方に広げるため'],
        answer: 0,
        explanation: '放物線の焦点の性質で、弱い電波を1点に集めて強くして受け取る。',
        notes: [
          '正解。',
          '作りやすさで選んだ形ではない。',
          '広げるのではなく、集めるための形。',
        ],
      },
      {
        id: 'mh-parabola-3',
        question: '投げたものの通り道が放物線になることを、1638年の本で示した人はだれか。',
        choices: ['ガリレオ', 'ケプラー', 'パスカル'],
        answer: 0,
        explanation: 'ガリレオは『新科学対話』で、水平方向の一定の速さと、落ちる動きを組み合わせて示した。',
        notes: [
          '正解。',
          'ケプラーは、惑星の軌道がだ円であることを示した人。',
          'パスカルは、確率の考えや計算機で知られる人。',
        ],
      },
    ],
  },
  {
    id: 'mh-limit',
    part: 'senior',
    theme: '微分・積分',
    emoji: '🏃',
    title: '極限と無限の和',
    headline: 'アキレスは亀に追いつけるか——ゼノンのパラドックスから極限へ',
    era: '紀元前5世紀（ゼノン）・1821年（コーシー）',
    year: -460,
    place: 'ギリシャ・フランス',
    people: ['ゼノン', 'コーシー', 'ワイエルシュトラス'],
    question: '限りなく続くたし算の答えが、決まった数になることはあるのか？',
    story: [
      '紀元前5世紀のギリシャのゼノンは、「足の速いアキレスも、先を行く亀には追いつけない」という話で人々を悩ませた。アキレスが亀のいた場所に着くころには、亀は少し先に進んでいる。これが限りなくくり返される、というのだ。',
      '実は、限りなく続くたし算でも、和が決まった数に近づくことがある。$\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\cdots$ は、たしていくほど1に近づく。アキレスが追いつくまでに走る距離や時間も、同じように決まった値になる。',
      'このように、ある値に限りなく近づくことを「極限」という。1821年、フランスのコーシーは『解析教程』で、極限の考えをもとに、微分・積分を組み立て直した。',
      '19世紀の後半には、ドイツのワイエルシュトラスらが、「どれだけ近く」と言われても、それより近づけられる、という言い方で、極限を正確に決めた（ε-δ論法）。',
    ],
    visual: {
      scene: 'zeno-series',
      instruction: 'たし算の種類と、たした回数を変えて、和がどの値に近づくかを見よう。',
      controls: [
        options('series', 'たし算の種類', 'half', Object.entries(SERIES).map(([value, meta]) => ({ value, label: meta.label }))),
        range('n', 'たした回数', 1, 10, 1, 4),
      ],
      formula: ({ series, n }) => {
        const N = Number(n)
        const sum = partialSum(series, N)
        if (series === 'half') return `\\frac{1}{2}+\\frac{1}{4}+\\cdots+\\frac{1}{2^{${N}}}=1-\\frac{1}{2^{${N}}}${approxTex(sum, 6)}${nice(sum, 6)}`
        return `100+10+1+\\cdots\\ (${N}\\ \\text{回})${approxTex(sum, 4)}${nice(sum, 4)}\\ \\to\\ \\frac{1000}{9}=111.1\\cdots`
      },
      insight: ({ series, n }) => {
        const N = Number(n)
        const sum = partialSum(series, N)
        if (series === 'half') return `${N}回たすと ${nice(sum, 6)}。残りは 1/${2 ** N}。回数をふやすほど1に近づくが、1をこえることはない。`
        return `亀は100m先にいて、アキレスは亀の10倍の速さ。アキレスが亀のいた場所に${N}回着くまでに走った距離は${nice(sum, 4)}m。限りなくくり返しても、合計は1000/9 m（約111.1m）をこえず、そこで追いつく。`
      },
    },
    uses: [
      { emoji: '💻', title: 'コンピューターの計算', text: '円周率や平方根などの値は、限りなく続く計算を途中で止めて、必要な桁まで求めている。' },
      { emoji: '🎾', title: 'はねるボール', text: '毎回半分の高さまではね上がるボールが止まるまでに上下する距離の合計は、無限に続く和で求められる。' },
    ],
    units: ['limit'],
    basics: [],
    quiz: [
      {
        id: 'mh-limit-1',
        question: '$\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\cdots$ を限りなく続けた和はどれか。',
        choices: ['1', '限りなく大きくなる', '2'],
        answer: 0,
        explanation: '$n$ 回たした和は $1-\\frac{1}{2^n}$ で、$n$ を大きくすると1に近づく。',
        notes: [
          '正解。',
          '1つ1つの数がどんどん小さくなるので、和は1をこえない。',
          '2は $1+\\frac{1}{2}+\\frac{1}{4}+\\cdots$（1から始めたとき）の和。',
        ],
      },
      {
        id: 'mh-limit-2',
        question: '$1+\\frac{1}{10}+\\frac{1}{100}+\\cdots$ を限りなく続けた和はどれか。',
        choices: ['$\\frac{10}{9}$', '$1$', '$\\frac{11}{10}$'],
        answer: 0,
        explanation: '$1.111\\cdots=\\frac{10}{9}$。はじめの数が1、比が $\\frac{1}{10}$ なので $\\frac{1}{1-\\frac{1}{10}}=\\frac{10}{9}$。',
        notes: [
          '正解。',
          'はじめの1つだけで止めている。',
          'はじめの2つだけで止めている。',
        ],
      },
      {
        id: 'mh-limit-3',
        question: '極限の考えをもとに、微分・積分を1821年の本で組み立て直した人はだれか。',
        choices: ['コーシー', 'ゼノン', 'ユークリッド'],
        answer: 0,
        explanation: 'コーシーは『解析教程』で、極限を土台にして微分・積分を説明し直した。',
        notes: [
          '正解。',
          'ゼノンは、アキレスと亀の話で無限の問題を投げかけた人。',
          'ユークリッドは『原論』で図形の性質を証明した人。',
        ],
      },
      {
        id: 'mh-limit-4',
        question: 'ゼノンの「アキレスと亀」の話について、正しいものはどれか。',
        choices: ['限りなく続く和でも決まった値になるので、アキレスは追いつく', 'アキレスは本当に亀に追いつけない', '亀の方が速い'],
        answer: 0,
        explanation: 'アキレスが亀のいた場所に着く回数は限りなく続くが、その距離の合計は決まった値になる。',
        notes: [
          '正解。',
          '実際には追いつく。無限に続く和が有限になることが分かれば、話のおかしさが分かる。',
          '話の中では、アキレスの方が速い。',
        ],
      },
    ],
  },
]
