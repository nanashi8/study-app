// 数学の歴史をたどるコース：第3部「高校の数学」（数I・数A・数IIのはじめ：集合・三角比・相関・組合せ・整数・複素数・対数・e）。
// 話の形は basic-number.js の冒頭を参照。
import { approxTex, nice, options, range, withCommas } from './controls.js'

// ── 集合と命題：1からnまでの整数と、2の倍数A・3の倍数B ─────────────────────
export const SET_OPERATIONS = Object.freeze({
  and: { label: 'A∩B（AかつB）', has: (inA, inB) => inA && inB },
  or: { label: 'A∪B（AまたはB）', has: (inA, inB) => inA || inB },
  notA: { label: 'Aでない', has: (inA) => !inA },
  notAnd: { label: '「AかつB」でない', has: (inA, inB) => !(inA && inB) },
})

export function setRegions(n) {
  const numbers = Array.from({ length: n }, (_, index) => index + 1)
  const inA = (value) => value % 2 === 0
  const inB = (value) => value % 3 === 0
  return {
    numbers,
    inA,
    inB,
    onlyA: numbers.filter((value) => inA(value) && !inB(value)),
    both: numbers.filter((value) => inA(value) && inB(value)),
    onlyB: numbers.filter((value) => !inA(value) && inB(value)),
    neither: numbers.filter((value) => !inA(value) && !inB(value)),
  }
}

// ── 相関：4つの例のデータ（12組ずつ。r は親と子の身長が約0.58、気温とアイスが約0.95、気温と暖房代が約−0.92、誕生日と身長がほぼ0） ──
export const CORRELATION_DATA = Object.freeze({
  height: {
    label: '親と子の身長',
    xLabel: '両親の身長の平均（cm）',
    yLabel: '子の身長（cm）',
    x: [158, 160, 162, 164, 165, 166, 168, 169, 170, 172, 174, 176],
    y: [165, 159, 168, 161, 168, 170, 164, 174, 166, 172, 167, 172],
  },
  ice: {
    label: '気温とアイスの売り上げ',
    xLabel: '最高気温（℃）',
    yLabel: 'アイスの売り上げ（個）',
    x: [18, 20, 21, 23, 24, 26, 27, 28, 29, 31, 32, 34],
    y: [70, 64, 80, 78, 96, 88, 101, 116, 104, 128, 118, 136],
  },
  heating: {
    label: '気温と暖房の電気代',
    xLabel: '平均気温（℃）',
    yLabel: '暖房の電気代（百円）',
    x: [0, 1, 2, 4, 5, 6, 7, 9, 10, 12, 13, 15],
    y: [88, 96, 80, 86, 74, 82, 66, 72, 58, 62, 50, 55],
  },
  birthday: {
    label: '誕生日の日にちと身長',
    xLabel: '誕生日の日にち',
    yLabel: '身長（cm）',
    x: [2, 4, 7, 9, 11, 14, 16, 19, 22, 25, 27, 30],
    y: [158, 171, 163, 150, 168, 160, 173, 152, 165, 161, 149, 170],
  },
})

export function correlation(xs, ys) {
  const n = xs.length
  const mx = xs.reduce((sum, value) => sum + value, 0) / n
  const my = ys.reduce((sum, value) => sum + value, 0) / n
  let sxy = 0
  let sxx = 0
  let syy = 0
  xs.forEach((x, index) => {
    sxy += (x - mx) * (ys[index] - my)
    sxx += (x - mx) ** 2
    syy += (ys[index] - my) ** 2
  })
  return { r: sxy / Math.sqrt(sxx * syy), mx, my }
}

// ── 組合せ：nCr（r が n より大きいときは0） ─────────────────────────────
export function combination(n, r) {
  if (r < 0 || r > n) return 0
  let value = 1
  for (let index = 1; index <= r; index += 1) value = (value * (n - r + index)) / index
  return Math.round(value)
}

// ── 互除法：わり算のくり返し ──────────────────────────────────────────
export const EUCLID_PAIRS = Object.freeze([[24, 18], [30, 12], [42, 30], [35, 21], [21, 13]])

export function euclidSteps(a, b) {
  const steps = []
  let big = Math.max(a, b)
  let small = Math.min(a, b)
  while (small > 0) {
    const q = Math.floor(big / small)
    const r = big - q * small
    steps.push({ big, small, q, r })
    big = small
    small = r
  }
  return { steps, gcd: big }
}

// ── 複素数：a＋bi に i などをかける ────────────────────────────────────
export const COMPLEX_MULTIPLIERS = Object.freeze({
  i: { label: 'i をかける', re: 0, im: 1, tex: 'i', turn: 90, scale: '1' },
  minus: { label: 'i を2回かける', re: -1, im: 0, tex: 'i^2', turn: 180, scale: '1' },
  onePlusI: { label: '1＋i をかける', re: 1, im: 1, tex: '(1+i)', turn: 45, scale: '√2' },
})

/** 複素数の書き方（2+i、-3i、0 など）。tex のときは KaTeX 用。 */
export function complexText(re, im, tex = false) {
  const minus = tex ? '-' : '−'
  const number = (value) => (value < 0 ? `${minus}${-value}` : String(value))
  if (im === 0) return number(re)
  const imPart = Math.abs(im) === 1 ? 'i' : `${Math.abs(im)}i`
  if (re === 0) return im < 0 ? `${minus}${imPart}` : imPart
  return `${number(re)}${im < 0 ? minus : '+'}${imPart}`
}

// ── 対数と計算尺 ─────────────────────────────────────────────────────
export const SLIDE_A = Object.freeze([1.5, 2, 2.5, 3])
export const SLIDE_B = Object.freeze([1.5, 2, 3])

// ── 複利と e ─────────────────────────────────────────────────────────
export const COMPOUND_COUNTS = Object.freeze([
  { value: 1, label: '1回' },
  { value: 2, label: '2回（半年ごと）' },
  { value: 4, label: '4回' },
  { value: 12, label: '12回（毎月）' },
  { value: 52, label: '52回（毎週）' },
  { value: 365, label: '365回（毎日）' },
  { value: 8760, label: '8760回（毎時間）' },
])

export const compoundValue = (n) => (1 + 1 / n) ** n

export const MATH_HISTORY_SENIOR = [
  {
    id: 'mh-sets',
    part: 'senior',
    theme: '数と式',
    emoji: '🔗',
    title: '集合と命題',
    headline: '「かつ」「または」「でない」を計算する——ブールの代数とベンの図',
    era: '1847年・1854年（ブール）・1880年（ベン）',
    year: 1854,
    place: 'イギリス・アイルランド',
    people: ['ブール', 'ド・モルガン', 'ベン'],
    question: '「かつ」「または」「でない」を使った考えの筋道を、数の計算のように扱えないか？',
    story: [
      'イギリス生まれのブールは、1847年と1854年の本で、「かつ」「または」「でない」を記号で表し、考えの筋道が正しいかどうかを計算で確かめる方法を示した。この考え方は、のちに「ブール代数」とよばれる。',
      '同じ1847年、ド・モルガンは、「AかつB」でないことは「Aでない、またはBでない」ことと同じ、という決まりを本に書いた。今「ド・モルガンの法則」とよばれる。',
      '1880年、ベンは、集合を重なり合う円で表す図を論文で示した。今「ベン図」とよぶ図で、共通部分 $A\\cap B$ や和集合 $A\\cup B$ がひと目で分かる。',
      '20世紀になって、シャノンは1937年の論文で、ブールの代数が、スイッチをつないだ電気の回路の設計に使えることを示した。コンピューターの計算は、「かつ」「または」「でない」の回路の組み合わせでできている。',
    ],
    visual: {
      scene: 'venn-sets',
      instruction: '1からいくつまでの整数で考えるかと集合の作り方を選び、ベン図のどの部分が選ばれるかを見よう。Aは2の倍数、Bは3の倍数。',
      controls: [
        options('op', '集合の作り方', 'and', Object.entries(SET_OPERATIONS).map(([value, meta]) => ({ value, label: meta.label }))),
        range('n', '1からいくつまで', 10, 30, 5, 20),
      ],
      formula: ({ op, n }) => {
        const N = Number(n)
        const { numbers, inA, inB, both } = setRegions(N)
        const countA = numbers.filter(inA).length
        const countB = numbers.filter(inB).length
        if (op === 'and') return `n(A\\cap B)=${both.length}\\quad(\\text{6の倍数})`
        if (op === 'or') return `n(A\\cup B)=n(A)+n(B)-n(A\\cap B)=${countA}+${countB}-${both.length}=${countA + countB - both.length}`
        if (op === 'notA') return `n(\\overline{A})=n(U)-n(A)=${N}-${countA}=${N - countA}`
        return `\\overline{A\\cap B}=\\overline{A}\\cup\\overline{B},\\quad n=${N}-${both.length}=${N - both.length}`
      },
      insight: ({ op, n }) => {
        const N = Number(n)
        const { numbers, inA, inB, both } = setRegions(N)
        const chosen = numbers.filter((value) => SET_OPERATIONS[op].has(inA(value), inB(value)))
        if (op === 'and') return `2の倍数でも3の倍数でもある数は、6の倍数の${both.length}個（${both.join('、')}）。2つの円の重なった部分。`
        if (op === 'or') return `2の倍数か3の倍数の少なくとも一方である数は${chosen.length}個。重なりの${both.length}個を2回数えないように、ひいておく。`
        if (op === 'notA') return `1から${N}までのうち、2の倍数でない数（奇数）は${chosen.length}個。円Aの外側全部。`
        return `「2の倍数かつ3の倍数」でない数は${chosen.length}個。「2の倍数でない、または3の倍数でない」数と同じになる（ド・モルガンの法則）。`
      },
    },
    uses: [
      { emoji: '💻', title: 'コンピューターの回路', text: 'コンピューターの中の計算は、「かつ（AND）」「または（OR）」「でない（NOT）」の回路を組み合わせてできている。' },
      { emoji: '🔍', title: '検索の条件', text: '検索で「AかつB」「AまたはB」と条件をつけるのは、集合の共通部分や和集合を取ること。' },
    ],
    units: ['setlogic'],
    basics: [],
    quiz: [
      {
        id: 'mh-sets-1',
        question: '1から20までの整数で、2の倍数の集合をA、3の倍数の集合をBとする。$A\\cap B$ の要素の個数はいくつか。',
        choices: ['3', '16', '13'],
        answer: 0,
        explanation: '$A\\cap B$ は2の倍数でも3の倍数でもある数、つまり6の倍数で、6・12・18の3個。',
        notes: [
          '正解。',
          '$n(A)+n(B)=10+6$ と、2つをたしている。',
          '13は $A\\cup B$（少なくとも一方の倍数）の個数。',
        ],
      },
      {
        id: 'mh-sets-2',
        question: 'ド・モルガンの法則で、「AかつB」でない、と同じ意味になるのはどれか。',
        choices: ['Aでない、またはBでない', 'Aでない、かつBでない', 'AまたはB'],
        answer: 0,
        explanation: '$\\overline{A\\cap B}=\\overline{A}\\cup\\overline{B}$。AとBの両方がそろわなければよいので、どちらか一方が欠けていればよい。',
        notes: [
          '正解。',
          'それは「AまたはB」でない、と同じ意味（$\\overline{A\\cup B}=\\overline{A}\\cap\\overline{B}$）。',
          '「でない」が消えている。',
        ],
      },
      {
        id: 'mh-sets-3',
        question: '$n(A)=10$、$n(B)=6$、$n(A\\cap B)=3$ のとき、$n(A\\cup B)$ はいくつか。',
        choices: ['13', '16', '19'],
        answer: 0,
        explanation: '$n(A\\cup B)=n(A)+n(B)-n(A\\cap B)=10+6-3=13$。',
        notes: [
          '正解。',
          '重なりの3個を2回数えている。',
          '重なりをひかずに、さらにたしている。',
        ],
      },
      {
        id: 'mh-sets-4',
        question: 'ブールの代数が、スイッチをつないだ回路の設計に使えることを示したのはだれか。',
        choices: ['シャノン', 'ベン', 'ニュートン'],
        answer: 0,
        explanation: 'シャノンは1937年の論文で、ブールの代数と電気の回路を結びつけた。',
        notes: [
          '正解。',
          'ベンは、集合を重なり合う円で表す図を示した人。',
          'ニュートンは、ものの動きの法則や微分・積分の考えで知られる人。',
        ],
      },
    ],
  },
  {
    id: 'mh-trig',
    part: 'senior',
    theme: '三角比',
    emoji: '🗼',
    title: '三角比',
    headline: '角度から長さを求める——ヒッパルコスの弦の表からサインへ',
    era: '紀元前2世紀（ヒッパルコス）・2世紀（プトレマイオス）・5世紀（インド）',
    year: -140,
    place: 'ギリシャ・エジプト・インド',
    people: ['ヒッパルコス', 'プトレマイオス', 'アーリヤバタ'],
    question: '登れない塔の高さや、遠くの星までの方向を、角度をはかるだけで計算できないか？',
    story: [
      '紀元前2世紀のギリシャの天文学者ヒッパルコスは、円の中心角に対する弦の長さの表を初めて作ったと伝えられる。星の位置を角度で表し、長さの計算に直すためだ。',
      '2世紀のアレクサンドリアのプトレマイオスは、『アルマゲスト』に、0.5度きざみの弦の長さの表をのせた。',
      '5世紀のインドのアーリヤバタは、弦の半分（今のサイン）の表を作った。サンスクリット語の「ジーヴァー（弓のつる）」がアラビア語を経てラテン語に訳されるうちに sinus（入り江・ふところ）となり、今の sine（サイン）になったとされる。',
      '直角三角形の角 $\\theta$ について、$\\sin\\theta=\\frac{\\text{向かいの辺}}{\\text{斜辺}}$、$\\cos\\theta=\\frac{\\text{となりの辺}}{\\text{斜辺}}$、$\\tan\\theta=\\frac{\\text{向かいの辺}}{\\text{となりの辺}}$。角度が決まれば、辺の長さの比が決まる。',
    ],
    visual: {
      scene: 'trig-tower',
      instruction: '塔からの距離と見上げる角度を変えて、塔の高さがどう求まるかを見よう。',
      controls: [
        options('d', '塔からの距離', 30, [20, 30, 40].map((value) => ({ value, label: `${value}m` }))),
        range('theta', '見上げる角度', 10, 70, 5, 40, (value) => `${value}°`),
      ],
      formula: ({ d, theta }) => {
        const tan = Math.tan((Number(theta) * Math.PI) / 180)
        const h = Number(d) * tan
        return `h=${d}\\times\\tan${theta}^\\circ\\approx${d}\\times${nice(tan, 3)}\\approx${nice(h, 1)}\\ (\\text{m})`
      },
      insight: ({ d, theta }) => {
        const t = (Number(theta) * Math.PI) / 180
        const h = Number(d) * Math.tan(t)
        return `見上げる角が${theta}°なら、tan${theta}°≈${nice(Math.tan(t), 3)}。塔から${d}m離れていれば、高さは約${nice(h, 1)}m。このとき sin${theta}°≈${nice(Math.sin(t), 3)}、cos${theta}°≈${nice(Math.cos(t), 3)}。`
      },
    },
    uses: [
      { emoji: '🗺️', title: '測量', text: '三角測量では、2つの地点の距離と、遠くの目標を見る角度をはかり、山の高さや位置を計算で求める。' },
      { emoji: '🚧', title: '坂道の傾き', text: '「勾配10%」の坂は、100m進むと10m上がる。$\\tan\\theta=0.1$ から、角度は約5.7度と分かる。' },
      { emoji: '🎮', title: 'ゲームや画像', text: '画面の中でものを回したり、向きを決めたりする計算に、sin と cos が使われている。' },
    ],
    units: ['trig'],
    basics: [],
    quiz: [
      {
        id: 'mh-trig-1',
        question: '$\\sin30^\\circ$ の値はどれか。',
        choices: ['$\\frac{1}{2}$', '$\\frac{\\sqrt{3}}{2}$', '$1$'],
        answer: 0,
        explanation: '30°・60°・90°の三角形の辺の比は $1:\\sqrt{3}:2$。30°の向かいの辺が1、斜辺が2なので $\\frac{1}{2}$。',
        notes: [
          '正解。',
          '$\\frac{\\sqrt{3}}{2}$ は $\\cos30^\\circ$（または $\\sin60^\\circ$）。',
          '$1$ は $\\sin90^\\circ$。',
        ],
      },
      {
        id: 'mh-trig-2',
        question: '塔から20m離れた所で、塔の先を見上げる角が45°だった。塔の高さはいくつか（目の高さは考えない）。',
        choices: ['20m', '10m', '$20\\sqrt{2}$ m'],
        answer: 0,
        explanation: '$\\tan45^\\circ=1$ なので、高さ＝$20\\times1=20$ m。',
        notes: [
          '正解。',
          '$20\\times\\frac{1}{2}$ としている。45°の tan は1。',
          '$20\\sqrt{2}$ は、目から塔の先までのななめの長さ。',
        ],
      },
      {
        id: 'mh-trig-3',
        question: 'sine（サイン）という言葉のもとをたどると、どこに行き着くとされるか。',
        choices: ['サンスクリット語の「弓のつる」', 'ギリシャ語の「三角形」', 'ラテン語の「高さ」'],
        answer: 0,
        explanation: '「ジーヴァー（弓のつる）」がアラビア語を経て、ラテン語の sinus になったとされる。',
        notes: [
          '正解。',
          '三角形を意味する言葉から来たのではない。',
          '高さを意味する言葉から来たのではない。',
        ],
      },
      {
        id: 'mh-trig-4',
        question: '『アルマゲスト』に弦の長さの表をのせた人はだれか。',
        choices: ['プトレマイオス', 'ユークリッド', 'ピタゴラス'],
        answer: 0,
        explanation: '2世紀のプトレマイオスは、天文学の本『アルマゲスト』に0.5度きざみの弦の表をのせた。',
        notes: [
          '正解。',
          'ユークリッドは『原論』で図形の性質を証明した人。',
          'ピタゴラスは、三平方の定理の名前になっている人。',
        ],
      },
    ],
  },
  {
    id: 'mh-correlation',
    part: 'senior',
    theme: '確率・データ',
    emoji: '📈',
    title: '散布図と相関',
    headline: '親と子の身長の関係——ゴールトンの「平均への回帰」と相関係数',
    era: '1886年・1888年（ゴールトン）・1896年（ピアソン）',
    year: 1888,
    place: 'イギリス',
    people: ['ゴールトン', 'ピアソン'],
    question: '2つの量がどれくらい関係しているかを、1つの数で表せるか？',
    story: [
      'イギリスのゴールトンは、たくさんの家族の親と子の身長を集め、横に両親の身長、縦に子の身長をとって、表や図にまとめた。',
      '1886年、ゴールトンは、背の高い両親の子は背が高い傾向があるが、親ほどは高くならず、平均の方へ近づくことを示し、これを「平均への回帰」とよんだ。1888年には、2つの量の関係の強さを表す「相関」の考えを発表した。',
      'その後、ピアソンが1896年に、今の相関係数 $r$ の計算のしかたをまとめた。$r$ は $-1$ から $1$ までの数で、1に近いほど右上がりの直線に近く、$-1$ に近いほど右下がりの直線に近い。0に近いと、直線的な関係はほとんどない。',
      'ただし、相関があっても、一方が他方の原因とは限らない。アイスの売り上げと水の事故の数は、どちらも気温が高いと増えるので相関があるが、アイスが事故の原因なのではない。',
    ],
    visual: {
      scene: 'scatter-correlation',
      instruction: 'データを選んで散布図を見くらべ、平均の線を引いて、相関係数の正・負と大きさを確かめよう。',
      controls: [
        options('data', 'データ', 'height', Object.entries(CORRELATION_DATA).map(([value, meta]) => ({ value, label: meta.label }))),
        options('view', '見方', 'plain', [
          { value: 'plain', label: '点だけ' },
          { value: 'mean', label: '平均の線を引く' },
        ]),
      ],
      formula: ({ data }) => {
        const { x, y } = CORRELATION_DATA[data]
        const { r } = correlation(x, y)
        return `r=\\frac{s_{xy}}{s_x\\,s_y}\\approx${nice(r, 2)}`
      },
      insight: ({ data, view }) => {
        const meta = CORRELATION_DATA[data]
        const { r } = correlation(meta.x, meta.y)
        const strength = Math.abs(r) >= 0.7 ? '強い' : Math.abs(r) >= 0.4 ? 'ある程度の' : Math.abs(r) >= 0.2 ? '弱い' : 'ほとんどない'
        const sign = Math.abs(r) < 0.2 ? '' : r > 0 ? '正の' : '負の'
        const lead = `「${meta.label}」の相関係数は約${nice(r, 2)}。${Math.abs(r) < 0.2 ? '相関はほとんどない' : `${strength}${sign}相関がある`}。`
        return view === 'mean'
          ? `${lead}平均の線で4つに分けると、右上と左下に点が多いほど r は正、左上と右下に多いほど r は負になる。`
          : lead
      },
    },
    uses: [
      { emoji: '🏥', title: '健康の研究', text: '食事や運動と病気の関係を、たくさんの人のデータの相関から探す。原因かどうかは、さらに実験などで確かめる。' },
      { emoji: '🛒', title: '売り上げの見込み', text: '気温と飲み物の売り上げのように相関の強いデータを使って、仕入れる量を見積もる。' },
    ],
    units: ['dataI'],
    basics: [],
    quiz: [
      {
        id: 'mh-correlation-1',
        question: '相関係数 $r$ について正しいものはどれか。',
        choices: ['$-1$ から $1$ までの値をとる', '0から100までの値をとる', 'いつも正の値をとる'],
        answer: 0,
        explanation: '$r$ は $-1\\leqq r\\leqq1$。右上がりの関係なら正、右下がりなら負になる。',
        notes: [
          '正解。',
          'パーセントのような値ではない。',
          '右下がりの関係では負になる。',
        ],
      },
      {
        id: 'mh-correlation-2',
        question: '散布図の点が、右下がりの直線の近くに集まっている。相関係数に最も近いものはどれか。',
        choices: ['$-0.9$', '$0$', '$0.9$'],
        answer: 0,
        explanation: '右下がりで直線に近いので、強い負の相関。',
        notes: [
          '正解。',
          '0に近いのは、直線的な関係がほとんどないとき。',
          '0.9は、右上がりの直線に近いとき。',
        ],
      },
      {
        id: 'mh-correlation-3',
        question: 'アイスの売り上げと水の事故の数に正の相関があった。正しい考え方はどれか。',
        choices: [
          'どちらも気温と関係しているだけで、アイスが事故の原因とは言えない',
          'アイスを売るのをやめれば、事故は減る',
          '相関があるので、アイスが事故の原因である',
        ],
        answer: 0,
        explanation: '相関は「いっしょに変わる」ことを表すだけで、原因と結果の関係までは分からない。',
        notes: [
          '正解。',
          'アイスが原因でなければ、売るのをやめても事故は減らない。',
          '相関があっても、原因とは限らない。',
        ],
      },
      {
        id: 'mh-correlation-4',
        question: '「平均への回帰」を、親と子の身長のデータから示したのはだれか。',
        choices: ['ゴールトン', 'パスカル', 'プレイフェア'],
        answer: 0,
        explanation: 'ゴールトンは1886年、背の高い親の子は親ほどは高くならず、平均の方へ近づくことを示した。',
        notes: [
          '正解。',
          'パスカルは、フェルマーとの手紙で確率の考えを始めた人。',
          'プレイフェアは、棒グラフや折れ線グラフを広めた人。',
        ],
      },
    ],
  },
  {
    id: 'mh-pascal',
    part: 'senior',
    theme: '確率・データ',
    emoji: '🔺',
    title: '組合せとパスカルの三角形',
    headline: '上の2つをたして下の数に——楊輝（ようき）とパスカルの三角形',
    era: '11世紀・1261年（中国）・1654年（パスカル）',
    year: 1261,
    place: '中国・フランス',
    people: ['賈憲（かけん）', '楊輝（ようき）', 'パスカル'],
    question: '「10人から3人を選ぶ選び方」のような数を、すばやく求められないか？',
    story: [
      '数を三角形に並べ、上の2つの数をたして下の数を作っていく。この三角形は、中国では11世紀の賈憲（かけん）が使い、1261年に楊輝（ようき）が本で紹介したので、「楊輝（ようき）の三角形」とよばれる。インドやペルシャでも古くから知られていた。',
      'フランスのパスカルは1654年ごろ、この三角形の性質をくわしく調べた本を書いた。そのためヨーロッパでは「パスカルの三角形」とよばれるようになった。',
      '上から $n$ 段目（いちばん上を0段目とする）の、左から $r$ 番目（0番目から数える）の数は、$n$ 個から $r$ 個を選ぶ組合せの数 ${}_n\\mathrm{C}_r$ になる。たとえば4段目は 1, 4, 6, 4, 1 で、4個から2個を選ぶ選び方は6通り。',
      'この数は、$(a+b)^n$ を展開したときの係数にもなる。$(a+b)^4=a^4+4a^3b+6a^2b^2+4ab^3+b^4$ の係数は、4段目の 1, 4, 6, 4, 1 と同じ。',
    ],
    visual: {
      scene: 'pascal-triangle',
      instruction: '段 n と選ぶ数 r を変えて、三角形の数が組合せの数になっていることと、上の2つの数の和になっていることを確かめよう。',
      controls: [
        range('n', '段 n（全部の数）', 1, 10, 1, 5),
        range('r', '選ぶ数 r', 0, 10, 1, 2),
      ],
      formula: ({ n, r }) => {
        const N = Number(n)
        const R = Number(r)
        if (R > N) return `{}_{${N}}\\mathrm{C}_{${R}}=0`
        return `{}_{${N}}\\mathrm{C}_{${R}}=\\frac{${N}!}{${R}!\\,${N - R}!}=${combination(N, R)}`
      },
      insight: ({ n, r }) => {
        const N = Number(n)
        const R = Number(r)
        if (R > N) return `${N}個から${R}個は選べないので、0通り。r を ${N} 以下にしてみよう。`
        const value = combination(N, R)
        if (R === 0 || R === N) return `${N}個から${R}個を選ぶ選び方は1通り（${R === 0 ? '何も選ばない' : '全部選ぶ'}）。三角形の両はしはいつも1。`
        return `${N}個から${R}個を選ぶ選び方は${value}通り。上の段の ${combination(N - 1, R - 1)} と ${combination(N - 1, R)} をたした数になっている。`
      },
    },
    uses: [
      { emoji: '🍕', title: 'トッピングの選び方', text: '8種類から3種類を選ぶ組合せは ${}_8\\mathrm{C}_3=56$ 通り。' },
      { emoji: '🎫', title: 'くじの当たりやすさ', text: '1から43までの数から6個を選ぶくじの組合せは ${}_{43}\\mathrm{C}_6=6096454$ 通り。1枚で全部当てる確率は、約610万分の1。' },
    ],
    units: ['count'],
    basics: [],
    quiz: [
      {
        id: 'mh-pascal-1',
        question: '5人から2人の係を選ぶ選び方（順番は考えない）は何通りか。',
        choices: ['10通り', '20通り', '25通り'],
        answer: 0,
        explanation: '${}_5\\mathrm{C}_2=\\frac{5\\times4}{2\\times1}=10$。',
        notes: [
          '正解。',
          '20通りは、順番を考えた並べ方（${}_5\\mathrm{P}_2$）。',
          '$5\\times5$ と、同じ人を2回選ぶ場合までふくめている。',
        ],
      },
      {
        id: 'mh-pascal-2',
        question: '1, 4, 6, 4, 1 の次の段はどれか。',
        choices: ['1, 5, 10, 10, 5, 1', '1, 5, 10, 5, 1', '1, 4, 6, 4, 1, 1'],
        answer: 0,
        explanation: '両はしは1で、あいだは上の2つの和：$1+4=5$、$4+6=10$、$6+4=10$、$4+1=5$。',
        notes: [
          '正解。',
          '数が1つ足りない。次の段は数が1つふえる。',
          '上の2つをたしていない。',
        ],
      },
      {
        id: 'mh-pascal-3',
        question: '$(a+b)^3$ を展開したとき、$a^2b$ の係数はどれか。',
        choices: ['3', '1', '2'],
        answer: 0,
        explanation: '$(a+b)^3=a^3+3a^2b+3ab^2+b^3$。係数は三角形の3段目 1, 3, 3, 1。',
        notes: [
          '正解。',
          '1は $a^3$ や $b^3$ の係数。',
          '2は $(a+b)^2$ の $ab$ の係数。',
        ],
      },
      {
        id: 'mh-pascal-4',
        question: 'この三角形を本で紹介し、中国での名前になっている人はだれか。',
        choices: ['楊輝（ようき）', '劉徽（りゅうき）', '祖沖之（そちゅうし）'],
        answer: 0,
        explanation: '1261年に楊輝（ようき）が本で紹介したので、中国では「楊輝（ようき）の三角形」とよばれる。',
        notes: [
          '正解。',
          '劉徽（りゅうき）は3世紀に『九章算術』の注を書いた人。',
          '祖沖之（そちゅうし）は5世紀に円周率をくわしく求めた人。',
        ],
      },
    ],
  },
  {
    id: 'mh-cipher',
    part: 'senior',
    theme: '数と計算',
    emoji: '🔐',
    title: '互除法と暗号',
    headline: '最大公約数をわり算のくり返しで求める——ユークリッドから現代の暗号へ',
    era: '紀元前300年ごろ（『原論』）・1977年（RSA暗号）',
    year: -296,
    place: 'ギリシャ・アメリカ',
    people: ['ユークリッド', 'リベスト', 'シャミア', 'エーデルマン'],
    question: '大きな2つの数の最大公約数を、約数を全部調べずに求められないか？',
    story: [
      'ユークリッドの『原論』第7巻には、2つの数の最大公約数を、わり算（ひき算）のくり返しで求める方法がのっている。今「ユークリッドの互除法」とよばれ、記録に残るいちばん古いアルゴリズムの1つとされる。中国の『九章算術』にも、ひき算のくり返しで分数を約分する、同じ考えの方法がある。',
      'やり方は、大きい方を小さい方でわったあまりを出し、「小さい方とあまり」で同じことをくり返す。あまりが0になったときのわる数が最大公約数だ。たとえば1071と462は、1071÷462＝2あまり147、462÷147＝3あまり21、147÷21＝7あまり0で、最大公約数は21。',
      '図で考えると、長方形から、できるだけ大きな正方形を切り取っていくことにあたる。最後に残る正方形の1辺が、最大公約数になる。',
      '1977年、アメリカのリベスト、シャミア、エーデルマンは、大きな素数どうしのかけ算は簡単でも、その積をもとの素数に分けるのはとても難しいことを使った暗号（RSA暗号）を発表した。この暗号のかぎを作るときにも、互除法が使われる。',
    ],
    visual: {
      scene: 'euclid-rectangle',
      instruction: '2つの数を選び、手順を進めて、長方形から正方形を切り取っていく様子と、わり算のくり返しを見くらべよう。',
      controls: [
        options('pair', '2つの数', '42-30', EUCLID_PAIRS.map(([a, b]) => ({ value: `${a}-${b}`, label: `${a} と ${b}` }))),
        range('step', '手順', 0, 6, 1, 0),
      ],
      formula: ({ pair, step }) => {
        const [a, b] = String(pair).split('-').map(Number)
        const { steps } = euclidSteps(a, b)
        const shown = steps.slice(0, Number(step))
        if (!shown.length) return `\\text{たて}\\ ${b}\\ \\text{・横}\\ ${a}\\ \\text{の長方形}`
        return `\\begin{gathered}${shown.map(({ big, small, q, r }) => `${big}=${q}\\times${small}+${r}`).join('\\\\')}\\end{gathered}`
      },
      insight: ({ pair, step }) => {
        const [a, b] = String(pair).split('-').map(Number)
        const { steps, gcd } = euclidSteps(a, b)
        const done = Number(step) >= steps.length
        if (Number(step) === 0) return `たて${b}・横${a}の長方形から、できるだけ大きな正方形を切り取っていく。`
        if (!done) {
          const last = steps[Number(step) - 1]
          return `1辺${last.small}の正方形を${last.q}個切り取ると、${last.r}の幅が残る（${last.big}÷${last.small}＝${last.q}あまり${last.r}）。`
        }
        return gcd === 1
          ? `最後に残る正方形の1辺は1。${a}と${b}の最大公約数は1で、2つの数は「互いに素」。`
          : `あまりが0になった。最後の正方形の1辺${gcd}が、${a}と${b}の最大公約数。`
      },
    },
    uses: [
      { emoji: '🔐', title: '安全な通信', text: 'ネットで買い物をするときなどの暗号に、素数や互除法など、整数の性質が使われている。' },
      { emoji: '✂️', title: '分数の約分', text: '大きな分数も、互除法で最大公約数を求めれば一度で約分できる。例：$\\frac{462}{1071}=\\frac{22}{51}$（最大公約数21）。' },
    ],
    units: ['intA'],
    basics: [],
    quiz: [
      {
        id: 'mh-cipher-1',
        question: '互除法で、84と36の最大公約数を求めるといくつか。',
        choices: ['12', '6', '4'],
        answer: 0,
        explanation: '$84=2\\times36+12$、$36=3\\times12+0$。あまりが0になったときのわる数12が最大公約数。',
        notes: [
          '正解。',
          '6も公約数だが、最大ではない。',
          '4も公約数だが、最大ではない。',
        ],
      },
      {
        id: 'mh-cipher-2',
        question: '互除法で、あまりが0になったときの最大公約数はどれか。',
        choices: ['そのときのわる数', 'そのときの商', 'はじめの大きい方の数'],
        answer: 0,
        explanation: 'わりきれたときのわる数が、はじめの2つの数の両方をわりきる、いちばん大きな数になっている。',
        notes: [
          '正解。',
          '商は、何個の正方形が切り取れたかを表すだけ。',
          'はじめの大きい方の数は、小さい方をわりきるとは限らない。',
        ],
      },
      {
        id: 'mh-cipher-3',
        question: 'RSA暗号が安全とされる理由はどれか。',
        choices: ['大きな数を素数の積に分けるのが、とても難しいから', '素数が限られた数しかないから', 'かけ算がとても難しいから'],
        answer: 0,
        explanation: '素数どうしのかけ算は簡単だが、積からもとの素数を見つけるのは、とても大きな数では現実的な時間でできない。',
        notes: [
          '正解。',
          '素数は限りなくある（ユークリッドが証明した）。',
          'かけ算は簡単。難しいのは、その逆の素因数分解。',
        ],
      },
      {
        id: 'mh-cipher-4',
        question: 'ユークリッドの互除法がのっている本はどれか。',
        choices: ['『原論』', '『アルマゲスト』', '『新科学対話』'],
        answer: 0,
        explanation: '『原論』第7巻の、数についての巻にのっている。',
        notes: [
          '正解。',
          '『アルマゲスト』はプトレマイオスの天文学の本。',
          '『新科学対話』はガリレオが落ちる動きなどをまとめた本。',
        ],
      },
    ],
  },
  {
    id: 'mh-complex',
    part: 'senior',
    theme: '数と式',
    emoji: '🌀',
    title: '複素数',
    headline: '2乗すると −1 になる数——三次方程式の公式から、回転を表す数へ',
    era: '1545年（カルダーノ）・1572年（ボンベリ）・1799年（ヴェッセル）',
    year: 1545,
    place: 'イタリア・デンマーク・ドイツ',
    people: ['カルダーノ', 'ボンベリ', 'ヴェッセル', 'ガウス'],
    question: '2乗すると −1 になる数は、本当に「ない」のか？',
    story: [
      '1545年、イタリアのカルダーノは、三次方程式の解き方を『アルス・マグナ』という本で発表した。この公式を使うと、答えがふつうの数なのに、途中で負の数の平方根が出てくることがあった。',
      '1572年、ボンベリは、$\\sqrt{-1}$ をふくむ数も、ふつうの計算の決まりどおりに計算すれば、正しい答えにたどり着けることを示した。たとえば $x^3=15x+4$ の答え $x=4$ は、途中の計算で $(2+\\sqrt{-1})+(2-\\sqrt{-1})$ として現れる。',
      'デカルトは、こうした数を「想像上の数（imaginary）」とよんだ。今は $i^2=-1$ となる $i$ を使い、$a+bi$ の形の数を複素数という。',
      '1799年にデンマークのヴェッセルが、のちにガウスが、複素数 $a+bi$ を平面の点 $(a,\\ b)$ として表す考えを示した。すると $i$ をかけることは、点を原点のまわりに90°回すことだと分かる。',
    ],
    visual: {
      scene: 'complex-rotate',
      instruction: '複素数 z＝a＋bi の点を決め、かける数を選んで、平面の上で点がどう回るかを見よう。',
      controls: [
        range('a', '実部 a', -3, 3, 1, 2),
        range('b', '虚部 b', -3, 3, 1, 1),
        options('times', 'かける数', 'i', Object.entries(COMPLEX_MULTIPLIERS).map(([value, meta]) => ({ value, label: meta.label }))),
      ],
      formula: ({ a, b, times }) => {
        const A = Number(a)
        const B = Number(b)
        const m = COMPLEX_MULTIPLIERS[times]
        const re = A * m.re - B * m.im
        const im = A * m.im + B * m.re
        return `(${complexText(A, B, true)})\\times ${m.tex}=${complexText(re, im, true)}`
      },
      insight: ({ a, b, times }) => {
        const A = Number(a)
        const B = Number(b)
        const m = COMPLEX_MULTIPLIERS[times]
        const re = A * m.re - B * m.im
        const im = A * m.im + B * m.re
        if (A === 0 && B === 0) return '0 に何をかけても0。点は原点から動かない。'
        const where = `点 (${A}, ${B}) は (${re}, ${im}) に移る。`
        if (times === 'i') return `${where}i をかけると、原点のまわりに90°回る。`
        if (times === 'minus') return `${where}i を2回かけると180°回り、向きが反対になる。$i^2=-1$ をかけたのと同じ。`
        return `${where}1＋i をかけると、45°回って、原点からの距離が √2 倍になる。`
      },
    },
    uses: [
      { emoji: '⚡', title: '交流の電気', text: '家庭に届く交流の電気の計算では、電圧と電流のずれを複素数で表すと、計算がかんたんになる。' },
      { emoji: '🖼️', title: '回転の計算', text: '平面の上の点の回転は、複素数のかけ算で計算できる。画像やゲームの計算にも使われる。' },
    ],
    units: ['complex'],
    basics: [],
    quiz: [
      {
        id: 'mh-complex-1',
        question: '$i^2$ はいくつか。',
        choices: ['$-1$', '$1$', '$i$'],
        answer: 0,
        explanation: '$i$ は2乗すると $-1$ になる数として決めた。',
        notes: [
          '正解。',
          '2乗して1になるのは $1$ と $-1$。',
          '$i$ をもう1回かけた $i^3$ は $-i$。$i^2$ は $-1$。',
        ],
      },
      {
        id: 'mh-complex-2',
        question: '複素数平面で、$3+2i$ に $i$ をかけると、どの点に移るか。',
        choices: ['$-2+3i$', '$3-2i$', '$2+3i$'],
        answer: 0,
        explanation: '$(3+2i)i=3i+2i^2=-2+3i$。点 $(3,\\ 2)$ が原点のまわりに90°回って $(-2,\\ 3)$ に移る。',
        notes: [
          '正解。',
          '$3-2i$ は、実軸について折り返した点（共役な複素数）。',
          '$i^2=-1$ を使わずに計算している。',
        ],
      },
      {
        id: 'mh-complex-3',
        question: 'カルダーノの三次方程式の公式で、人々を困らせたことはどれか。',
        choices: ['答えがふつうの数でも、途中に負の数の平方根が出てくる', '答えが必ず分数になる', '計算に負の数が1つも出てこない'],
        answer: 0,
        explanation: 'ボンベリが、負の数の平方根もふつうの決まりで計算すれば、正しい答えにたどり着けることを示した。',
        notes: [
          '正解。',
          '答えが分数になるとは限らない。',
          '困ったのは、負の数の平方根まで出てくることだった。',
        ],
      },
      {
        id: 'mh-complex-4',
        question: '複素数を平面の点として表す考えを示した人はだれか。',
        choices: ['ヴェッセルやガウス', 'ピタゴラス', 'フェルマー'],
        answer: 0,
        explanation: '1799年にヴェッセルが示し、のちにガウスが広めた。',
        notes: [
          '正解。',
          'ピタゴラスは、古代ギリシャで三平方の定理の名前になった人。',
          'フェルマーは、座標や確率の考えで知られる人。',
        ],
      },
    ],
  },
  {
    id: 'mh-logarithm',
    part: 'senior',
    theme: '関数',
    emoji: '🎚️',
    title: '対数と計算尺',
    headline: 'かけ算をたし算に変える——ネイピアの対数と計算尺',
    era: '1614年（ネイピア）・1620年代（計算尺）',
    year: 1614,
    place: 'スコットランド・イギリス',
    people: ['ネイピア', 'ブリッグス', 'オートレッド'],
    question: '天文学に出てくる大きな数のかけ算を、どうすれば速く、まちがえずにできるか？',
    story: [
      '16世紀の天文学者や船乗りは、何けたもの数のかけ算やわり算に、たくさんの時間をかけていた。',
      '1614年、スコットランドのネイピアは、かけ算をたし算に置きかえる「対数」の表を発表した。$\\log(ab)=\\log a+\\log b$ なので、表で対数を調べてたし、それをもとの数にもどせば、かけ算の答えが出る。',
      'イギリスのブリッグスはネイピアと相談し、10を底とする対数（常用対数）の表を作った（1617年・1624年）。1620年代には、対数の目もりを定規にきざみ、2本をずらして長さをたすだけでかけ算ができる「計算尺」が作られた。',
      '計算尺は、電卓が広まる1970年代まで、技術者の道具として使われた。フランスの天文学者ラプラスは、対数は「天文学者の寿命を2倍にした」と言ったと伝えられる。',
    ],
    visual: {
      scene: 'slide-rule',
      instruction: 'かけられる数とかける数を選び、2本の対数の目もりをずらして、長さのたし算でかけ算の答えを読もう。',
      controls: [
        options('a', 'かけられる数', 2, SLIDE_A.map((value) => ({ value, label: String(value) }))),
        options('b', 'かける数', 3, SLIDE_B.map((value) => ({ value, label: String(value) }))),
      ],
      formula: ({ a, b }) => {
        const A = Number(a)
        const B = Number(b)
        const la = Math.log10(A)
        const lb = Math.log10(B)
        return `\\log_{10}${A}+\\log_{10}${B}\\approx${nice(la, 3)}+${nice(lb, 3)}=${nice(la + lb, 3)}\\ \\to\\ ${A}\\times${B}=${nice(A * B, 2)}`
      },
      insight: ({ a, b }) => {
        const A = Number(a)
        const B = Number(b)
        return `下の目もりの${A}に上の目もりの1を合わせると、上の${B}の真下に${nice(A * B, 2)}が来る。長さ（対数）のたし算で、かけ算の答えが読める。`
      },
    },
    uses: [
      { emoji: '🔊', title: '音の大きさ', text: '音の強さが10倍になると、10デシベル上がる。対数を使うと、とても大きな差を小さな数で表せる。' },
      { emoji: '🌋', title: '地震のマグニチュード', text: 'マグニチュードが1大きいと、地震のエネルギーは約32倍、2大きいと約1000倍になる。' },
      { emoji: '🧪', title: 'pH', text: '水よう液の酸性・アルカリ性を表す pH も対数。pH が1小さいと、水素イオンの濃さは10倍。' },
    ],
    units: ['explog'],
    basics: [],
    quiz: [
      {
        id: 'mh-logarithm-1',
        question: '$\\log_{10}1000$ はいくつか。',
        choices: ['3', '1000', '10'],
        answer: 0,
        explanation: '$10^3=1000$ なので $\\log_{10}1000=3$。',
        notes: [
          '正解。',
          '対数は「10を何乗すると1000になるか」の答え。',
          '10は底。答えは指数の3。',
        ],
      },
      {
        id: 'mh-logarithm-2',
        question: '$\\log_{10}2\\approx0.301$、$\\log_{10}3\\approx0.477$ のとき、$\\log_{10}6$ に最も近いのはどれか。',
        choices: ['0.778', '0.144', '0.176'],
        answer: 0,
        explanation: '$\\log_{10}6=\\log_{10}2+\\log_{10}3\\approx0.301+0.477=0.778$。',
        notes: [
          '正解。',
          '$0.301\\times0.477$ と、対数どうしをかけている。',
          '$0.477-0.301$ は $\\log_{10}1.5$。',
        ],
      },
      {
        id: 'mh-logarithm-3',
        question: '計算尺でかけ算ができるのはなぜか。',
        choices: ['目もりが対数になっていて、長さのたし算がかけ算になるから', '目もりが等しい間かくだから', '定規の中に歯車が入っているから'],
        answer: 0,
        explanation: '目もりの長さが $\\log$ に比例しているので、長さをたすと $\\log a+\\log b=\\log ab$ になる。',
        notes: [
          '正解。',
          '等しい間かくの目もりでは、長さをたしても、たし算にしかならない。',
          '計算尺は目もりをずらすだけで、歯車は使わない。',
        ],
      },
      {
        id: 'mh-logarithm-4',
        question: '対数の表を1614年に発表した人はだれか。',
        choices: ['ネイピア', 'ニュートン', 'パスカル'],
        answer: 0,
        explanation: 'スコットランドのネイピアが発表し、ブリッグスが常用対数の表に作り直した。',
        notes: [
          '正解。',
          'ニュートンは、微分・積分やものの動きの法則で知られる人。',
          'パスカルは、確率の考えや計算機で知られる人。',
        ],
      },
    ],
  },
  {
    id: 'mh-compound',
    part: 'senior',
    theme: '関数',
    emoji: '💹',
    title: '複利とネイピア数 e',
    headline: '利息を細かく分けてつけると——ヤコブ・ベルヌーイと e',
    era: '1683年（ヤコブ・ベルヌーイ）・1748年（オイラー）',
    year: 1683,
    place: 'スイス',
    people: ['ヤコブ・ベルヌーイ', 'オイラー'],
    question: '1年に100%の利息を、何回にも分けてつけると、お金はどこまでふえるか？',
    story: [
      '利息にもまた利息がつくしくみを複利という。1年に100%の利息が1回つけば、1万円は2万円になる。半年ごとに50%ずつなら $1.5^2=2.25$ 倍、毎月 $\\frac{100}{12}$%ずつなら約2.61倍になる。',
      '1683年、スイスのヤコブ・ベルヌーイは、分ける回数 $n$ をふやしたときの $\\left(1+\\frac{1}{n}\\right)^n$ を調べ、どこまでも大きくなるのではなく、2と3の間のある数に近づくことに気づいた。',
      'この数は今 $e$（ネイピア数）とよばれ、$e=2.71828\\cdots$。$e$ という記号を使い、この数の性質を1748年の本などでくわしく調べたのはオイラーだ。',
      '$e$ を底とする指数関数 $y=e^x$ は、「ふえる速さが、そのときの量に比例する」ようすを表す。人口や細菌のふえ方、放射性の物質の減り方などを表すのに使われる。',
    ],
    visual: {
      scene: 'compound-interest',
      instruction: '1年に利息をつける回数を変えて、1万円が1年でいくらになるかと、e にどこまで近づくかを見よう。',
      controls: [options('n', '1年に分ける回数', 1, COMPOUND_COUNTS)],
      formula: ({ n }) => {
        const N = Number(n)
        const value = compoundValue(N)
        return `\\left(1+\\frac{1}{${N}}\\right)^{${N}}${approxTex(value, 5)}${nice(value, 5)}`
      },
      insight: ({ n }) => {
        const N = Number(n)
        const yen = Math.round(10000 * compoundValue(N))
        return `1年を${N}回に分けると、1万円は約${withCommas(yen)}円になる。回数をどれだけふやしても、e＝2.71828…倍（約2万7183円）をこえない。`
      },
    },
    uses: [
      { emoji: '🏦', title: '預金やローン', text: '利息の計算では、複利をつける回数によって、ふえる金額や返す金額が変わる。' },
      { emoji: '🦠', title: 'ふえ方・へり方', text: '細菌のふえ方や、放射性の物質の減り方は、$e$ を底とする指数関数で表される。' },
    ],
    units: ['explog', 'limit'],
    basics: [],
    quiz: [
      {
        id: 'mh-compound-1',
        question: '年利100%の利息を、半年ごとに50%ずつ2回つけると、1万円は1年でいくらになるか。',
        choices: ['2万2500円', '2万円', '3万円'],
        answer: 0,
        explanation: '$10000\\times1.5\\times1.5=22500$。半年後の利息にも、次の半年で利息がつく。',
        notes: [
          '正解。',
          '1年に1回だけ利息をつけたときの金額。',
          '利息を回数分たしすぎている。',
        ],
      },
      {
        id: 'mh-compound-2',
        question: '$\\left(1+\\frac{1}{n}\\right)^n$ で $n$ をどこまでも大きくすると、どうなるか。',
        choices: ['約2.718に近づく', 'どこまでも大きくなる', '2に近づく'],
        answer: 0,
        explanation: 'ヤコブ・ベルヌーイが気づいたとおり、ある数 $e=2.71828\\cdots$ に近づく。',
        notes: [
          '正解。',
          'ふえていくが、上限がある。',
          '$n=1$ のときが2で、そこからふえていく。',
        ],
      },
      {
        id: 'mh-compound-3',
        question: '$e$ を底とする指数関数が表す変化はどれか。',
        choices: ['ふえる速さが、そのときの量に比例する変化', 'いつも同じ量ずつふえる変化', 'ふえたりへったりをくり返す変化'],
        answer: 0,
        explanation: '量が多いほど速くふえるので、どんどん加速してふえる。',
        notes: [
          '正解。',
          '同じ量ずつふえるのは一次関数。',
          'ふえたりへったりをくり返すのは、三角関数で表される変化。',
        ],
      },
    ],
  },
]
