// 入試演習（高校入試）：中2の単元。問題の形は src/lib/mathExam.js の冒頭を参照。
// 角の図は、問題の角の大きさから座標を計算して描く（図の角・長さは問題の条件どおり）。
import { boxplot, polar, rayMeet } from './figure-helpers.js'

const rad = (deg) => (deg * Math.PI) / 180
const SQRT3 = Math.sqrt(3)

// 平行線と角（くの字）：ℓ は y=3、m は y=0。P から見て ℓ 側が 40°、m 側が 35°。
const ANGLE3_P = [3.4, 1.2]
const ANGLE3_A = [ANGLE3_P[0] - (3 - ANGLE3_P[1]) / Math.tan(rad(40)), 3]
const ANGLE3_B = [ANGLE3_P[0] - ANGLE3_P[1] / Math.tan(rad(35)), 0]
// 三角形の外角：∠B=80°、∠C=50°（外角130°）。
const ANGLE4_A = rayMeet([0, 0], 80, [5, 0], 130)
// くさび形：正三角形ABCの中の点Dで、∠ABD=20°、∠ACD=25°。
const ANGLE5_D = rayMeet([0, 0], 40, [6, 0], 145)
// 紙テープの折り返し：上の辺 y=2、下の辺 y=0。折り目PQが上の辺と50°。
const FOLD_P = [3, 2]
const FOLD_Q = [3 + 2 / Math.tan(rad(50)), 0]
const FOLD_R = [3 + (2 * Math.cos(rad(100))) / Math.sin(rad(100)), 0]
// 角の二等分線の交点：∠B=70°、∠C=46°。
const ANGLE8_A = rayMeet([0, 0], 70, [6, 0], 134)
const ANGLE8_P = rayMeet([0, 0], 35, [6, 0], 157)
// 二等辺三角形（頂角36°）と底角の二等分線。
const GOLD_A = [2, 2 * Math.tan(rad(72))]
const GOLD_D = rayMeet([0, 0], 36, [4, 0], 108)
// 平行四辺形と角の二等分線。
const PARA_A = [3, 3 * SQRT3]
const PARA_D = [13, 3 * SQRT3]
const PARA_E = [9, 3 * SQRT3]
// 角の二等分線上の点から2辺への垂線。
const BISECT_P = polar(0, 0, 6, 30)
const BISECT_B = polar(0, 0, 6 * Math.cos(rad(30)), 60)
// 箱ひげ図。
const BOX3 = boxplot(0.8, [20, 35, 45, 60, 80], 0.35)
const BOX5 = [boxplot(3.4, [4, 6, 12, 16, 20], 0.3), boxplot(2.2, [4, 7, 10, 16, 20], 0.3), boxplot(1, [4, 7, 12, 16, 20], 0.3)]
const BOX30 = boxplot(0.8, [30, 50, 62, 75, 95], 0.35)
const BOX30_FIGURE = {
  label: '30人の得点の箱ひげ図。最小値30点、第1四分位数50点、中央値62点、第3四分位数75点、最大値95点',
  size: [320, 130],
  stretch: true,
  view: [18, 102, -0.6, 1.4],
  points: {},
  polygons: BOX30.polygons,
  segments: [...BOX30.segments, [[20, 0], [100, 0]], ...[20, 30, 40, 50, 60, 70, 80, 90, 100].map((x) => [[x, -0.05], [x, 0.05]])],
}
const BOX7 = [boxplot(2.2, [40, 55, 65, 70, 90], 0.3), boxplot(1, [45, 50, 60, 80, 85], 0.3)]
const ticks = (values, y, size = 10) => values.map((value) => ({ at: [value, y], text: String(value), size }))

export const MATH_EXAM_JUNIOR2 = {
  patterns: {
    calc2: [
      { id: 'poly', title: '多項式・単項式の計算' },
      { id: 'value', title: '式を簡単にしてから値を求める' },
      { id: 'transform', title: '等式の変形' },
      { id: 'proof', title: '文字式を使った説明' },
    ],
    simul: [
      { id: 'solve', title: '連立方程式を解く（加減法・代入法）' },
      { id: 'param', title: '解から係数を求める' },
      { id: 'word', title: '文章題（代金・速さ・割合）' },
    ],
    lin: [
      { id: 'formula', title: '一次関数の式を求める' },
      { id: 'rate', title: '変化の割合と変域' },
      { id: 'intersect', title: '2直線の交点' },
      { id: 'area', title: 'グラフと図形の面積' },
      { id: 'apply', title: '一次関数の利用' },
    ],
    angle: [
      { id: 'parallel', title: '平行線と角' },
      { id: 'fold', title: '折り返した図形の角' },
      { id: 'polygon', title: '多角形の内角と外角' },
      { id: 'triangle', title: '三角形の内角と外角' },
    ],
    congr: [
      { id: 'condition', title: '三角形の合同条件' },
      { id: 'proofstep', title: '証明の根拠' },
      { id: 'isosceles', title: '二等辺三角形の性質' },
      { id: 'parallelogram', title: '平行四辺形の性質と条件' },
    ],
    prob: [
      { id: 'dice', title: '2つのさいころ' },
      { id: 'coin', title: '硬貨を投げる' },
      { id: 'draw', title: '玉・カードを取り出す' },
      { id: 'arrange', title: '選び方と並べ方' },
      { id: 'apply', title: '図形・座標と確率' },
    ],
    data2: [
      { id: 'quartile', title: '四分位数を求める' },
      { id: 'iqr', title: '四分位範囲と範囲' },
      { id: 'boxplot', title: '箱ひげ図を読む' },
      { id: 'compare', title: '箱ひげ図で比べる' },
    ],
  },
  problems: [
    // ── 式の計算 ──
    {
      id: 'mx-calc2-01', unit: 'calc2', level: 'basic', pattern: 'poly', minutes: 2,
      text: '次の計算をしなさい。',
      math: '(3a^2-2ab+b^2)-(a^2-5ab+4b^2)',
      parts: [{ answer: '[ア]a^2+[イ]ab-[ウ]b^2' }],
      boxes: { ア: 2, イ: 3, ウ: 3 },
      hints: [
        'ひく方のかっこをはずすと、中のすべての項の符号が変わる。',
        '$a^2$ の項、$ab$ の項、$b^2$ の項をそれぞれまとめる。',
      ],
      solution: [
        { text: 'かっこをはずす。', math: '3a^2-2ab+b^2-a^2+5ab-4b^2' },
        { text: '同類項をまとめる。', math: '2a^2+3ab-3b^2' },
      ],
      point: '多項式のひき算は、ひく式の各項の符号を変えて足す。',
      pitfall: '$-(-5ab)$ を $-5ab$ のままにしない。符号を変えると $+5ab$。',
    },
    {
      id: 'mx-calc2-02', unit: 'calc2', level: 'basic', pattern: 'poly', minutes: 2,
      text: '次の計算をしなさい。',
      math: '12x^2y\\div(-4xy)\\times3y',
      parts: [{ answer: '[ア]xy' }],
      boxes: { ア: -9 },
      hints: [
        'わり算は逆数のかけ算に直して、1つの分数の形にする。',
        '符号・数・文字の順に計算する。負の数は1つなので符号は $-$。',
      ],
      solution: [
        { text: 'わる式を分母にして、1つの分数にする。', math: '-\\dfrac{12x^2y\\times3y}{4xy}' },
        { text: '数と文字をそれぞれ約分する。', math: '-\\dfrac{36x^2y^2}{4xy}=-9xy' },
      ],
      point: 'かけ算とわり算がまざった単項式の計算は、1つの分数にまとめてから約分する。',
      pitfall: '左から順に $12x^2y\\div(-4xy)$ を計算したあと、$\\times3y$ を分母に入れない。$3y$ は分子にかかる。',
    },
    {
      id: 'mx-calc2-03', unit: 'calc2', level: 'basic', pattern: 'transform', minutes: 2,
      text: '等式 $3x-2y=6$ を、$y$ について解きなさい。',
      parts: [{ answer: 'y=\\dfrac{[ア]}{[イ]}x-[ウ]' }],
      boxes: { ア: 3, イ: 2, ウ: 3 },
      hints: [
        '$y$ をふくむ項だけを左辺に残し、ほかの項を右辺に移項する。',
        '最後に両辺を $y$ の係数でわる。',
      ],
      solution: [
        { text: '$3x$ を移項する。', math: '-2y=-3x+6' },
        { text: '両辺を $-2$ でわる。', math: 'y=\\dfrac{3}{2}x-3' },
      ],
      point: '「$y$ について解く」は、$y=\\ \\cdots$ の形にすること。方程式を解くのと同じ手順で変形する。',
      pitfall: '両辺を $-2$ でわるとき、右辺の $6$ の符号も変わる。$6\\div(-2)=-3$。',
    },
    {
      id: 'mx-calc2-04', unit: 'calc2', level: 'basic', pattern: 'value', minutes: 3,
      text: '$x=3,\\ y=-2$ のとき、$2(x-3y)-3(2x-y)$ の値を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: -6 },
      hints: [
        '先に式を簡単にしてから代入する。',
        'かっこをはずして、$x$ の項と $y$ の項をまとめる。',
      ],
      solution: [
        { text: '式を簡単にする。', math: '2x-6y-6x+3y=-4x-3y' },
        { text: '代入する。', math: '-4\\times3-3\\times(-2)=-12+6=-6' },
      ],
      point: '式を簡単にしてから代入すると、計算の量が減る。',
      pitfall: '$-3(2x-y)$ の $-y$ に $-3$ をかけると $+3y$。',
    },
    {
      id: 'mx-calc2-05', unit: 'calc2', level: 'standard', pattern: 'poly', minutes: 3,
      text: '次の計算をしなさい。',
      math: '\\dfrac{2x-y}{3}-\\dfrac{x-3y}{4}',
      parts: [{ answer: '\\dfrac{[ア]x+[イ]y}{[ウ]}' }],
      boxes: { ア: 5, イ: 5, ウ: 12 },
      hints: [
        '分母を $12$ にそろえて、分子をかっこでくくる。',
        'ひく方の分子 $x-3y$ の、両方の項の符号を変える。',
      ],
      solution: [
        { text: '通分する。', math: '\\dfrac{4(2x-y)-3(x-3y)}{12}' },
        { text: '分子のかっこをはずしてまとめる。', math: '\\dfrac{8x-4y-3x+9y}{12}=\\dfrac{5x+5y}{12}' },
      ],
      point: '分数の形の式は、分子をかっこでくくって通分し、最後に約分できるか確かめる。',
      pitfall: '通分するとき、分母だけ $12$ にして分子に $4$ や $3$ をかけ忘れない。',
    },
    {
      id: 'mx-calc2-06', unit: 'calc2', level: 'standard', pattern: 'transform', minutes: 3,
      text: '台形の面積の公式 $S=\\dfrac{1}{2}(a+b)h$ を、$a$ について解きなさい。',
      parts: [{ answer: 'a=\\dfrac{[ア]S}{h}-b' }],
      boxes: { ア: 2 },
      hints: [
        'まず両辺を2倍して、分数をなくす。',
        '次に両辺を $h$ でわって、$a+b$ だけを残す。',
      ],
      solution: [
        { text: '両辺を2倍する。', math: '2S=(a+b)h' },
        { text: '両辺を $h$ でわる。', math: '\\dfrac{2S}{h}=a+b' },
        { text: '$b$ を移項する。', math: 'a=\\dfrac{2S}{h}-b' },
      ],
      point: '公式の変形も、方程式と同じく「両辺に同じ数をかける・わる、移項する」でできる。',
      pitfall: '両辺を $h$ でわるとき、$a+b$ 全体がわられることに注意。$a$ だけをわらない。',
    },
    {
      id: 'mx-calc2-07', unit: 'calc2', level: 'standard', pattern: 'proof', minutes: 4,
      text: '「連続する3つの整数の和は、3の倍数である」ことを説明する。いちばん小さい整数を $n$ とするとき、3つの整数の和を次の形に表しなさい。',
      parts: [{ answer: 'n+(n+1)+(n+2)=[ア]n+[イ]=[ウ](n+[エ])' }],
      boxes: { ア: 3, イ: 3, ウ: 3, エ: 1 },
      hints: [
        '3つの整数は $n,\\ n+1,\\ n+2$ と表せる。',
        '和を計算したら、3の倍数であることがわかるように「$3\\times$（整数）」の形にくくる。',
      ],
      solution: [
        { text: '3つの整数の和を計算する。', math: 'n+(n+1)+(n+2)=3n+3' },
        { text: '3でくくる。$n+1$ は整数なので、$3(n+1)$ は3の倍数。', math: '3n+3=3(n+1)' },
      ],
      point: '「〜の倍数」を説明するには、「〜×（整数）」の形に変形する。',
      pitfall: '$3n+3$ で止めない。$3(n+1)$ とくくって、かっこの中が整数だと言えて説明が完成する。',
    },
    {
      id: 'mx-calc2-08', unit: 'calc2', level: 'standard', pattern: 'proof', minutes: 4,
      text: '2けたの自然数の十の位の数を $a$、一の位の数を $b$ とする。この数と、十の位と一の位を入れかえた数について、次の式を完成させなさい。',
      parts: [
        { q: '2つの数の和', answer: '(10a+b)+(10b+a)=[ア](a+b)' },
        { q: '2つの数の差（もとの数－入れかえた数）', answer: '(10a+b)-(10b+a)=[イ](a-b)' },
      ],
      boxes: { ア: 11, イ: 9 },
      hints: [
        '十の位が $a$、一の位が $b$ の数は $10a+b$。入れかえた数は $10b+a$。',
        '計算したあと、$a+b$ や $a-b$ でくくれる形にする。',
      ],
      solution: [
        { text: '和を計算する。', math: '10a+b+10b+a=11a+11b=11(a+b)' },
        { text: '差を計算する。', math: '10a+b-10b-a=9a-9b=9(a-b)' },
        { text: '和は11の倍数、差は9の倍数になる。' },
      ],
      point: '位取りのある数は「$10a+b$」のように、位の値×数字で表す。',
      pitfall: '十の位が $a$ の数を $ab$ と書かない。$ab$ は $a\\times b$ の意味になる。',
    },

    // ── 連立方程式 ──
    {
      id: 'mx-simul-01', unit: 'simul', level: 'basic', pattern: 'solve', minutes: 2,
      text: '次の連立方程式を解きなさい。',
      math: '\\begin{cases}3x+2y=7\\\\x-2y=5\\end{cases}',
      parts: [{ answer: 'x=[ア],\\quad y=[イ]' }],
      boxes: { ア: 3, イ: -1 },
      hints: [
        '$y$ の係数が $+2$ と $-2$ なので、2つの式をたすと $y$ が消える。',
        '$x$ を求めたら、どちらかの式に代入して $y$ を求める。',
      ],
      solution: [
        { text: '2つの式をたす（加減法）。', math: '4x=12,\\quad x=3' },
        { text: '$x-2y=5$ に代入する。', math: '3-2y=5,\\quad y=-1' },
      ],
      point: '係数の絶対値がそろっている文字は、たすかひくかで消せる。',
      pitfall: '代入したあとの $-2y=2$ を $y=1$ としない。両辺を $-2$ でわって $y=-1$。',
    },
    {
      id: 'mx-simul-02', unit: 'simul', level: 'basic', pattern: 'solve', minutes: 3,
      text: '次の連立方程式を解きなさい。',
      math: '\\begin{cases}y=2x-5\\\\4x-3y=11\\end{cases}',
      parts: [{ answer: 'x=[ア],\\quad y=[イ]' }],
      boxes: { ア: 2, イ: -1 },
      hints: [
        '1つ目の式は $y=\\ \\cdots$ の形なので、代入法が使える。',
        '2つ目の式の $y$ に、かっこをつけて $2x-5$ を入れる。',
      ],
      solution: [
        { text: '代入する。', math: '4x-3(2x-5)=11' },
        { text: '解く。', math: '4x-6x+15=11,\\quad -2x=-4,\\quad x=2' },
        { text: '$y=2x-5$ に代入する。', math: 'y=2\\times2-5=-1' },
      ],
      point: '$y=\\cdots$ や $x=\\cdots$ の形の式があるときは、代入法が速い。',
      pitfall: '$-3(2x-5)$ を $-6x-15$ としない。$(-3)\\times(-5)=+15$。',
    },
    {
      id: 'mx-simul-03', unit: 'simul', level: 'basic', pattern: 'solve', minutes: 4,
      text: '次の連立方程式を解きなさい。',
      math: '\\begin{cases}0.2x+0.3y=1.3\\\\\\dfrac{x}{2}-\\dfrac{y}{3}=0\\end{cases}',
      parts: [{ answer: 'x=[ア],\\quad y=[イ]' }],
      boxes: { ア: 2, イ: 3 },
      hints: [
        '1つ目の式は両辺を $10$ 倍、2つ目の式は両辺を $6$ 倍して、係数を整数にする。',
        '整数の係数になったら、加減法で1つの文字を消す。',
      ],
      solution: [
        { text: '係数を整数にする。', math: '2x+3y=13,\\qquad 3x-2y=0' },
        { text: '1つ目を2倍、2つ目を3倍してたす。', math: '4x+6y=26,\\ 9x-6y=0\\ \\Rightarrow\\ 13x=26,\\ x=2' },
        { text: '$3x-2y=0$ に代入する。', math: '6-2y=0,\\quad y=3' },
      ],
      point: '小数や分数の係数は、まず整数に直す。右辺にもかけ忘れないこと。',
      pitfall: '1つ目の式を10倍するとき、右辺の $1.3$ も $13$ にする。',
    },
    {
      id: 'mx-simul-04', unit: 'simul', level: 'basic', pattern: 'param', minutes: 3,
      text: '$x,\\ y$ についての連立方程式 $\\begin{cases}ax+by=7\\\\bx+ay=8\\end{cases}$ の解が $x=2,\\ y=1$ であるとき、$a,\\ b$ の値を求めなさい。',
      parts: [{ answer: 'a=[ア],\\quad b=[イ]' }],
      boxes: { ア: 2, イ: 3 },
      hints: [
        '解を代入すると、$a$ と $b$ についての連立方程式ができる。',
        '$2a+b=7$ と $a+2b=8$ を解く。',
      ],
      solution: [
        { text: '$x=2,\\ y=1$ を代入する。', math: '\\begin{cases}2a+b=7\\\\2b+a=8\\end{cases}' },
        { text: '1つ目を2倍して2つ目をひく。', math: '4a+2b-(a+2b)=14-8,\\quad 3a=6,\\quad a=2' },
        { text: '$2a+b=7$ に代入する。', math: 'b=3' },
      ],
      point: '解がわかっているときは、代入して係数についての連立方程式をつくる。',
      pitfall: '2つ目の式は $bx+ay$ なので、代入すると $2b+a$。$a$ と $b$ の位置を入れかえない。',
    },
    {
      id: 'mx-simul-05', unit: 'simul', level: 'standard', pattern: 'word', minutes: 5,
      text: '1個120円のりんごと1個80円のみかんを合わせて15個買ったところ、代金の合計は1480円だった。りんごとみかんを、それぞれ何個買ったか。',
      parts: [{ answer: '\\text{りんご}\\ [ア]\\ \\text{個},\\quad\\text{みかん}\\ [イ]\\ \\text{個}' }],
      boxes: { ア: 7, イ: 8 },
      hints: [
        'りんごを $x$ 個、みかんを $y$ 個として、「個数」と「代金」の2つの式をつくる。',
        '$x+y=15$ と、代金の合計の式を連立させる。',
      ],
      solution: [
        { text: '2つの式をつくる。', math: '\\begin{cases}x+y=15\\\\120x+80y=1480\\end{cases}' },
        { text: '2つ目の式を $40$ でわり、1つ目の式の2倍をひく。', math: '3x+2y=37,\\quad 3x+2y-(2x+2y)=37-30,\\quad x=7' },
        { text: '$y=15-7=8$。' },
      ],
      point: '文章題は「何が等しいか」を2つ見つけて、2つの式にする。',
      pitfall: '代金の式で、単価と個数を取りちがえない。りんごの代金は $120x$ 円。',
    },
    {
      id: 'mx-simul-06', unit: 'simul', level: 'standard', pattern: 'word', minutes: 6,
      text: '家から学校まで $1500$ m ある。家から途中の公園までは分速 $60$ m で歩き、公園から学校までは分速 $150$ m で走ったところ、全部で16分かかった。家から公園まで、公園から学校までの道のりを求めなさい。',
      parts: [{ answer: '\\text{家から公園}\\ [ア]\\ \\text{m},\\quad\\text{公園から学校}\\ [イ]\\ \\text{m}' }],
      boxes: { ア: 600, イ: 900 },
      hints: [
        '家から公園を $x$ m、公園から学校を $y$ m とする。道のりの合計と、時間の合計で2つの式をつくる。',
        '時間は「道のり÷速さ」。$\\dfrac{x}{60}+\\dfrac{y}{150}=16$。',
      ],
      solution: [
        { text: '2つの式をつくる。', math: '\\begin{cases}x+y=1500\\\\\\dfrac{x}{60}+\\dfrac{y}{150}=16\\end{cases}' },
        { text: '2つ目の式を $300$ 倍する。', math: '5x+2y=4800' },
        { text: '1つ目の式の2倍をひく。', math: '3x=1800,\\quad x=600,\\quad y=900' },
      ],
      point: '速さの文章題は「道のり」と「時間」で式をつくる。表にまとめると整理しやすい。',
      pitfall: '時間の式を $60x+150y=16$ としない。時間は道のりを速さでわる。',
    },
    {
      id: 'mx-simul-07', unit: 'simul', level: 'standard', pattern: 'word', minutes: 6,
      text: 'ある中学校の昨年の生徒数は、男女合わせて500人だった。今年は、昨年に比べて男子が $5$ % 減り、女子が $10$ % 増えたので、全体では5人増えた。今年の男子と女子の人数をそれぞれ求めなさい。',
      parts: [{ answer: '\\text{男子}\\ [ア]\\ \\text{人},\\quad\\text{女子}\\ [イ]\\ \\text{人}' }],
      boxes: { ア: 285, イ: 220 },
      hints: [
        '昨年の男子を $x$ 人、女子を $y$ 人とする。求めるのは今年の人数なので、最後に計算し直す。',
        '増えた人数で式をつくる：$-\\dfrac{5}{100}x+\\dfrac{10}{100}y=5$。',
      ],
      solution: [
        { text: '昨年の人数で2つの式をつくる。', math: '\\begin{cases}x+y=500\\\\-\\dfrac{5}{100}x+\\dfrac{10}{100}y=5\\end{cases}' },
        { text: '2つ目の式を $20$ 倍する。', math: '-x+2y=100' },
        { text: '1つ目の式とたす。', math: '3y=600,\\quad y=200,\\quad x=300' },
        { text: '今年の人数を求める。', math: '300\\times0.95=285,\\qquad 200\\times1.1=220' },
      ],
      point: '割合の問題は、もとにする量（昨年の人数）を文字にするとよい。',
      pitfall: '昨年の人数 $300$ 人・$200$ 人を答えにしない。問われているのは今年の人数。',
    },
    {
      id: 'mx-simul-08', unit: 'simul', level: 'standard', pattern: 'param', minutes: 5,
      text: '2つの連立方程式 $\\begin{cases}x+y=5\\\\ax+by=7\\end{cases}$ と $\\begin{cases}x-y=1\\\\bx+ay=8\\end{cases}$ が同じ解をもつとき、$a,\\ b$ の値を求めなさい。',
      parts: [{ answer: 'a=[ア],\\quad b=[イ]' }],
      boxes: { ア: 1, イ: 2 },
      hints: [
        '同じ解をもつので、$a,\\ b$ をふくまない2つの式 $x+y=5$、$x-y=1$ を組にして、先に解を求める。',
        '求めた解を $a,\\ b$ をふくむ2つの式に代入し、$a,\\ b$ の連立方程式を解く。',
      ],
      solution: [
        { text: '$x+y=5$ と $x-y=1$ を解く。', math: 'x=3,\\quad y=2' },
        { text: '残りの2つの式に代入する。', math: '\\begin{cases}3a+2b=7\\\\3b+2a=8\\end{cases}' },
        { text: '解く。', math: '9a+6b-(4a+6b)=21-16,\\quad a=1,\\quad b=2' },
      ],
      point: '「同じ解をもつ」問題は、文字をふくまない式どうしを組みかえて、先に解を出す。',
      pitfall: 'はじめの組のまま解こうとしない。$a,\\ b$ が残ったままでは解けない。',
    },

    // ── 一次関数 ──
    {
      id: 'mx-lin-01', unit: 'lin', level: 'basic', pattern: 'formula', minutes: 3,
      text: '2点 $(-1,\\ 5)$、$(3,\\ -3)$ を通る直線の式を求めなさい。',
      parts: [{ answer: 'y=[ア]x+[イ]' }],
      boxes: { ア: -2, イ: 3 },
      hints: [
        '傾きは $\\dfrac{y\\text{の増加量}}{x\\text{の増加量}}$。',
        '傾きがわかったら、$y=ax+b$ に1点の座標を代入して $b$ を求める。',
      ],
      solution: [
        { text: '傾きを求める。', math: '\\dfrac{-3-5}{3-(-1)}=\\dfrac{-8}{4}=-2' },
        { text: '$y=-2x+b$ に $(-1,\\ 5)$ を代入する。', math: '5=2+b,\\quad b=3' },
      ],
      point: '2点を通る直線は「傾き → 切片」の順に求める。',
      pitfall: '傾きの分母と分子を逆にしない。$y$ の増加量が分子。',
    },
    {
      id: 'mx-lin-02', unit: 'lin', level: 'basic', pattern: 'rate', minutes: 3,
      text: '一次関数 $y=-3x+2$ について答えなさい。',
      parts: [
        { q: '$x$ の値が $2$ から $5$ まで増加するときの、$y$ の増加量を求めなさい。', answer: '[ア]' },
        { q: '$x$ の変域が $-1\\leqq x\\leqq 3$ のとき、$y$ の変域を求めなさい。', answer: '[イ]\\leqq y\\leqq[ウ]' },
      ],
      boxes: { ア: -9, イ: -7, ウ: 5 },
      hints: [
        '一次関数では、$y$ の増加量＝変化の割合（傾き）×$x$ の増加量。',
        '変域は、$x$ の両はしの値を代入する。傾きが負なので大小が入れかわる。',
      ],
      solution: [
        { text: '$x$ の増加量は $3$。', math: '-3\\times3=-9' },
        { text: '$x=-1$ のとき $y=5$、$x=3$ のとき $y=-7$。', math: '-7\\leqq y\\leqq5' },
      ],
      point: '一次関数の変化の割合は一定で、傾き $a$ に等しい。',
      pitfall: '増加量を $y$ の値そのもの（$x=5$ のときの $-13$）と取りちがえない。',
    },
    {
      id: 'mx-lin-03', unit: 'lin', level: 'basic', pattern: 'intersect', minutes: 2,
      text: '2直線 $y=2x-1$ と $y=-x+5$ の交点の座標を求めなさい。',
      parts: [{ answer: '([ア],\\ [イ])' }],
      boxes: { ア: 2, イ: 3 },
      hints: [
        '交点は、2つの式を両方満たす点。連立方程式として解く。',
        '$2x-1=-x+5$ から $x$ を求める。',
      ],
      solution: [
        { text: '$y$ を消す。', math: '2x-1=-x+5,\\quad 3x=6,\\quad x=2' },
        { text: '$y=2\\times2-1=3$。' },
      ],
      point: '2直線の交点の座標は、2つの式の連立方程式の解。',
      pitfall: '$x$ だけ求めて終わらない。交点は $(x,\\ y)$ の組で答える。',
    },
    {
      id: 'mx-lin-04', unit: 'lin', level: 'basic', pattern: 'formula', minutes: 2,
      text: '直線 $y=3x-2$ に平行で、点 $(2,\\ 1)$ を通る直線の式を求めなさい。',
      parts: [{ answer: 'y=[ア]x-[イ]' }],
      boxes: { ア: 3, イ: 5 },
      hints: [
        '平行な直線は、傾きが等しい。',
        '$y=3x+b$ に点の座標を代入して $b$ を求める。',
      ],
      solution: [
        { text: '傾きは $3$。$y=3x+b$ に $(2,\\ 1)$ を代入する。', math: '1=6+b,\\quad b=-5' },
        { text: 'よって', math: 'y=3x-5' },
      ],
      point: '平行 → 傾きが同じ。あとは通る1点で切片を決める。',
      pitfall: '切片まで同じ $-2$ にしない。切片が同じだと同じ直線になってしまう。',
    },
    {
      id: 'mx-lin-05', unit: 'lin', level: 'standard', pattern: 'area', minutes: 6,
      text: '図のように、直線 $\\ell:\\ y=-x+6$ と直線 $m:\\ y=2x$ が点Aで交わり、直線 $\\ell$ と $x$ 軸が点Bで交わっている。原点をOとする。',
      figure: {
        label: '直線 y=-x+6 と直線 y=2x が点Aで交わり、直線 y=-x+6 がx軸と点Bで交わる。三角形OABに色がついている',
        size: [300, 250],
        view: [-1, 7.5, -1, 7.5],
        axes: { x: 'x', y: 'y' },
        points: { A: [2, 4], B: [6, 0] },
        labels: { A: 'ne', B: 's' },
        polygons: [{ pts: [[0, 0], 'A', 'B'], fill: true }],
        curves: [
          { fn: (x) => -x + 6, from: -0.5, to: 7, label: 'ℓ', at: 0.6 },
          { fn: (x) => 2 * x, from: -0.4, to: 3.5, label: 'm', at: 3.2 },
        ],
      },
      parts: [
        { q: '$\\triangle$OAB の面積を求めなさい。', answer: '[ア]' },
        { q: '原点Oを通り、$\\triangle$OAB の面積を2等分する直線の式を求めなさい。', answer: 'y=\\dfrac{[イ]}{[ウ]}x' },
      ],
      boxes: { ア: 12, イ: 1, ウ: 2 },
      hints: [
        'Aの座標は2直線の交点、Bの座標は $y=0$ を代入して求める。$\\triangle$OAB は底辺OB、高さはAの $y$ 座標。',
        '頂点Oを通って面積を2等分する直線は、向かいの辺ABの中点を通る。',
      ],
      solution: [
        { text: 'A：$-x+6=2x$ より $x=2$、$y=4$。B：$0=-x+6$ より $x=6$。' },
        { text: '面積。', math: '\\dfrac{1}{2}\\times6\\times4=12' },
        { text: 'ABの中点は $\\left(\\dfrac{2+6}{2},\\ \\dfrac{4+0}{2}\\right)=(4,\\ 2)$。原点とこの点を通る直線は', math: 'y=\\dfrac{1}{2}x' },
      ],
      point: '三角形の頂点を通って面積を2等分する直線は、向かい合う辺の中点を通る（底辺が半分になる）。',
      pitfall: '2等分する直線の傾きを、AやBの座標から直接とらない。通るのはABの中点。',
    },
    {
      id: 'mx-lin-06', unit: 'lin', level: 'standard', pattern: 'apply', minutes: 6,
      text: 'Aさんは9時に家を出て、分速 $80$ m で歩いて図書館へ向かった。兄は9時10分に家を出て、同じ道を自転車で分速 $240$ m で追いかけた。図は、9時から $x$ 分後の家からの道のりを $y$ m として、2人の進み方をグラフに表したものである。兄がAさんに追いつくのは、9時何分で、家から何 m の地点か。',
      figure: {
        label: '横軸が9時からの時間（分）、縦軸が家からの道のり（m）。Aさんは原点から、兄は10分の点から、それぞれ直線で進むグラフ',
        size: [320, 230],
        stretch: true,
        view: [-4, 32, -350, 2700],
        axes: { x: 'x（分）', y: 'y（m）' },
        points: {},
        curves: [
          { fn: (x) => 80 * x, from: 0, to: 30, label: 'Aさん', at: 27 },
          { fn: (x) => 240 * (x - 10), from: 10, to: 20, label: '兄', at: 19 },
        ],
        texts: [...ticks([10, 20], -170, 10), { at: [-2.2, 800], text: '800', size: 10 }, { at: [-2.4, 1600], text: '1600', size: 10 }, { at: [-2.4, 2400], text: '2400', size: 10 }],
      },
      parts: [{ answer: '9\\text{時}\\ [ア]\\ \\text{分},\\quad\\text{家から}\\ [イ]\\ \\text{m}' }],
      boxes: { ア: 15, イ: 1200 },
      hints: [
        'Aさんのグラフは $y=80x$、兄のグラフは、10分後に出発するので $y=240(x-10)$。',
        '追いつくのは、2つのグラフの交点。連立方程式で求める。',
      ],
      solution: [
        { text: '2つの式を等しくおく。', math: '80x=240(x-10)' },
        { text: '解く。', math: '80x=240x-2400,\\quad 160x=2400,\\quad x=15' },
        { text: '道のりは', math: 'y=80\\times15=1200' },
      ],
      point: '「追いつく」「出会う」は、グラフの交点。出発時刻のずれは、式の中の $x-10$ で表す。',
      pitfall: '兄の式を $y=240x$ としない。兄は10分おくれて出発するので、$x=10$ のとき $y=0$。',
    },
    {
      id: 'mx-lin-07', unit: 'lin', level: 'standard', pattern: 'area', minutes: 6,
      text: '図のように、2点A$(1,\\ 4)$、B$(5,\\ 2)$ と原点Oがある。$y$ 軸上に原点と異なる点Pをとり、$\\triangle$PAB の面積が $\\triangle$OAB の面積と等しくなるようにする。点Pの $y$ 座標を求めなさい。',
      figure: {
        label: '点A(1,4)、点B(5,2)と原点Oを頂点とする三角形OAB',
        size: [280, 260],
        view: [-1, 6.5, -1, 10],
        axes: { x: 'x', y: 'y' },
        points: { A: [1, 4], B: [5, 2] },
        labels: { A: 'n', B: 'ne' },
        polygons: [{ pts: [[0, 0], 'A', 'B'], fill: true }],
      },
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 9 },
      hints: [
        '底辺ABが共通なので、ABからの距離（高さ）が等しければ面積も等しい。',
        '直線ABと $y$ 軸の交点をCとすると、Pは「Cについて原点と反対側で、Cから同じ距離」の点になる。',
      ],
      solution: [
        { text: '直線ABの式を求める。傾きは $\\dfrac{2-4}{5-1}=-\\dfrac12$。', math: 'y=-\\dfrac{1}{2}x+\\dfrac{9}{2}' },
        { text: '直線ABと $y$ 軸の交点は C$\\left(0,\\ \\dfrac92\\right)$。OからABまでと、PからABまでの高さを等しくするには、CP＝COとなる反対側にPをとる。' },
        { text: 'Pの $y$ 座標は', math: '\\dfrac{9}{2}+\\dfrac{9}{2}=9' },
      ],
      point: '底辺が共通の三角形は、高さが等しいと面積が等しい（等積変形）。平行線や対称な位置を使う。',
      pitfall: 'Oを通りABに平行な直線と $y$ 軸の交点はO自身。もう1つの答えは、ABの反対側にある。',
    },
    {
      id: 'mx-lin-08', unit: 'lin', level: 'standard', pattern: 'apply', minutes: 5,
      text: 'ある月の電気料金は、Aプランが「基本料金1000円＋使用量1 kWhあたり20円」、Bプランが「基本料金400円＋使用量1 kWhあたり30円」である。',
      parts: [
        { q: '2つのプランの料金が等しくなるのは、使用量が何 kWh のときか。', answer: '[ア]\\ \\text{kWh}' },
        { q: '使用量が $100$ kWh のとき、安い方のプランの料金は何円か。', answer: '[イ]\\ \\text{円}' },
      ],
      boxes: { ア: 60, イ: 3000 },
      hints: [
        '使用量を $x$ kWh、料金を $y$ 円とすると、Aは $y=20x+1000$、Bは $y=30x+400$。',
        '料金が等しくなるのは2つのグラフの交点。そこより使用量が多いと、傾きの小さいプランが安くなる。',
      ],
      solution: [
        { text: '等しくおく。', math: '20x+1000=30x+400,\\quad 10x=600,\\quad x=60' },
        { text: '$x=100$ のとき、A：$20\\times100+1000=3000$、B：$30\\times100+400=3400$。安いのはAで $3000$ 円。' },
      ],
      point: '料金の比べは、一次関数のグラフの交点を境に、どちらが安いかが入れかわる。',
      pitfall: '基本料金が安いBがいつも安いとは限らない。使用量が交点をこえると逆になる。',
    },

    // ── 平行線と角 ──
    {
      id: 'mx-angle-01', unit: 'angle', level: 'basic', pattern: 'polygon', minutes: 2,
      text: '正十二角形について答えなさい。',
      parts: [
        { q: '内角の和', answer: '[ア]^\\circ' },
        { q: '1つの内角の大きさ', answer: '[イ]^\\circ' },
      ],
      boxes: { ア: 1800, イ: 150 },
      hints: [
        '$n$ 角形の内角の和は $180^\\circ\\times(n-2)$。',
        '正多角形は内角がすべて等しいので、内角の和を角の数でわる。',
      ],
      solution: [
        { text: '内角の和。', math: '180^\\circ\\times(12-2)=1800^\\circ' },
        { text: '1つの内角。', math: '1800^\\circ\\div12=150^\\circ' },
      ],
      point: '正多角形の1つの内角は、$180^\\circ$ から1つの外角（$360^\\circ\\div n$）をひいても求められる。',
      pitfall: '内角の和を $180^\\circ\\times12$ としない。$n$ 角形は $(n-2)$ 個の三角形に分けられる。',
    },
    {
      id: 'mx-angle-02', unit: 'angle', level: 'basic', pattern: 'polygon', minutes: 2,
      text: '1つの外角が $24^\\circ$ である正多角形は、正何角形か。',
      parts: [{ answer: '\\text{正}[ア]\\text{角形}' }],
      boxes: { ア: 15 },
      hints: [
        '多角形の外角の和は、何角形でも $360^\\circ$。',
        '正多角形は外角がすべて等しい。',
      ],
      solution: [
        { text: '多角形の外角の和は、何角形でも $360^\\circ$。正多角形では、どの外角も等しい。' },
        { text: '外角の和を、1つの外角でわる。', math: '360^\\circ\\div24^\\circ=15' },
      ],
      point: '外角の和がいつも $360^\\circ$ であることを使うと、正多角形の角の数がすぐわかる。',
      pitfall: '内角の和の式に $24^\\circ$ を入れない。$24^\\circ$ は外角。',
    },
    {
      id: 'mx-angle-03', unit: 'angle', level: 'basic', pattern: 'parallel', minutes: 3,
      text: '図で、$\\ell\\parallel m$ のとき、$\\angle x$ の大きさを求めなさい。',
      figure: {
        label: '平行な2直線ℓとmの間に点Pがあり、ℓ上の点AとPを結ぶ線がℓと40度、m上の点BとPを結ぶ線がmと35度をつくる。角APBがx',
        size: [300, 200],
        view: [-1.2, 5.6, -0.8, 3.8],
        points: { A: ANGLE3_A, P: ANGLE3_P, B: ANGLE3_B },
        labels: { A: 'n', P: 'e', B: 's' },
        segments: [[[-1, 3], [5.4, 3]], [[-1, 0], [5.4, 0]], ['A', 'P'], ['P', 'B']],
        angles: [
          { at: 'A', from: [5.4, 3], to: 'P', label: '40°', r: 22 },
          { at: 'B', from: [5.4, 0], to: 'P', label: '35°', r: 22 },
          { at: 'P', from: 'A', to: 'B', label: 'x', r: 16 },
        ],
        texts: [{ at: [5.2, 3.35], text: 'ℓ' }, { at: [5.2, 0.35], text: 'm' }],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 75 },
      hints: [
        '点Pを通り、$\\ell$ と $m$ に平行な直線をひいてみる。',
        '平行線の錯角は等しいので、$\\angle x$ は2つの角に分けられる。',
      ],
      solution: [
        { text: 'Pを通り $\\ell$ に平行な直線をひくと、$\\angle x$ はその直線で上下2つに分かれる。' },
        { text: '上の角は $\\ell$ との錯角で $40^\\circ$、下の角は $m$ との錯角で $35^\\circ$。', math: '\\angle x=40^\\circ+35^\\circ=75^\\circ' },
      ],
      point: '折れ曲がった線（くの字）では、へこんだ角＝両側の錯角の和。補助線は平行線をひく。',
      pitfall: '$40^\\circ$ と $35^\\circ$ の差をとらない。補助線で上下に分けた2つの角を足したものが $\\angle x$。',
    },
    {
      id: 'mx-angle-04', unit: 'angle', level: 'basic', pattern: 'triangle', minutes: 2,
      text: '図の $\\triangle$ABC で、辺BCをCの方へのばした。$\\angle$A$=50^\\circ$、$\\angle$ACDの大きさが $130^\\circ$ のとき、$\\angle x$ の大きさを求めなさい。',
      figure: {
        label: '三角形ABCで、辺BCをCの先へのばした点をDとする。角Aが50度、角ACDが130度、角Bがx',
        size: [300, 210],
        view: [-0.8, 7.6, -0.8, 5.6],
        points: { A: ANGLE4_A, B: [0, 0], C: [5, 0], D: [7.2, 0] },
        labels: { A: 'n', B: 'sw', C: 's', D: 's' },
        segments: [['A', 'B'], ['B', 'D'], ['A', 'C']],
        angles: [
          { at: 'A', from: 'B', to: 'C', label: '50°', r: 20 },
          { at: 'C', from: 'A', to: 'D', label: '130°', r: 18 },
          { at: 'B', from: 'C', to: 'A', label: 'x', r: 18 },
        ],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 80 },
      hints: [
        '三角形の外角は、となりにない2つの内角の和に等しい。',
        '$\\angle$ACD＝$\\angle$A＋$\\angle$B の関係を使う。',
      ],
      solution: [
        { text: '外角の性質より', math: '\\angle\\text{ACD}=\\angle\\text{A}+\\angle x' },
        { text: '代入する。', math: '130^\\circ=50^\\circ+\\angle x,\\quad\\angle x=80^\\circ' },
      ],
      point: '三角形の外角＝となりにない2つの内角の和。内角の和 $180^\\circ$ から求めるより速い。',
      pitfall: '$\\angle$ACB（$50^\\circ$）と取りちがえない。$\\angle$ACB$=180^\\circ-130^\\circ=50^\\circ$ で、$x$ はBの角。',
    },
    {
      id: 'mx-angle-05', unit: 'angle', level: 'standard', pattern: 'triangle', minutes: 4,
      text: '図のように、正三角形ABCの内部に点Dをとる。$\\angle$ABD$=20^\\circ$、$\\angle$ACD$=25^\\circ$ のとき、$\\angle x=\\angle$BDC の大きさを求めなさい。',
      figure: {
        label: '正三角形ABCの内部の点DとB、Cを結んだ図。角ABDが20度、角ACDが25度、角BDCがx',
        size: [260, 240],
        view: [-0.8, 6.8, -0.8, 6],
        points: { A: [3, 3 * SQRT3], B: [0, 0], C: [6, 0], D: ANGLE5_D },
        labels: { A: 'n', B: 'sw', C: 'se', D: 'n' },
        polygons: [{ pts: ['A', 'B', 'C'] }],
        segments: [['B', 'D'], ['D', 'C']],
        angles: [
          { at: 'B', from: 'A', to: 'D', label: '20°', r: 30 },
          { at: 'C', from: 'D', to: 'A', label: '25°', r: 30 },
          { at: 'D', from: 'B', to: 'C', label: 'x', r: 14 },
        ],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 105 },
      hints: [
        '正三角形の角はすべて $60^\\circ$。$\\angle$DBC と $\\angle$DCB を求める。',
        '$\\triangle$DBC の内角の和から $\\angle x$ を求める。',
      ],
      solution: [
        { text: '$\\angle$DBC$=60^\\circ-20^\\circ=40^\\circ$、$\\angle$DCB$=60^\\circ-25^\\circ=35^\\circ$。' },
        { text: '$\\triangle$DBC の内角の和より', math: '\\angle x=180^\\circ-40^\\circ-35^\\circ=105^\\circ' },
        { text: '「$\\angle x=\\angle$A$+20^\\circ+25^\\circ$」（くさび形の角）とも一致する。', math: '60^\\circ+20^\\circ+25^\\circ=105^\\circ' },
      ],
      point: 'くさび形（ブーメランの形）では、へこんだ所の角 $\\angle$BDC＝残りの3つの角（$\\angle$A・$\\angle$ABD・$\\angle$ACD）の和。',
      pitfall: '$20^\\circ+25^\\circ=45^\\circ$ を答えにしない。$\\angle$A の $60^\\circ$ も足す。',
    },
    {
      id: 'mx-angle-06', unit: 'angle', level: 'standard', pattern: 'fold', minutes: 5,
      text: '図のように、幅が一定の紙テープを、線分PQを折り目として折り返した。折り目PQとテープの上の辺がつくる角が $50^\\circ$ のとき、折り返した辺PRとテープの下の辺がつくる $\\angle x$ の大きさを求めなさい。',
      figure: {
        label: '平行な2本の辺をもつ紙テープを、上の辺の点Pと下の辺の点Qを結ぶ折り目で折り返した図。折り返した辺PRが下の辺と点Rで交わる。折り目と上の辺の角が50度、角PRQがx',
        size: [320, 170],
        view: [0, 7, -0.8, 2.8],
        points: { P: FOLD_P, Q: FOLD_Q, R: FOLD_R },
        labels: { P: 'n', Q: 's', R: 's' },
        polygons: [{ pts: ['P', 'R', 'Q'], fill: true }],
        segments: [[[0.2, 2], [6.8, 2]], [[0.2, 0], [6.8, 0]], ['P', 'Q', { dash: true }], ['P', 'R']],
        angles: [
          { at: 'P', from: [6.8, 2], to: 'Q', label: '50°', r: 26 },
          { at: 'R', from: 'Q', to: 'P', label: 'x', r: 18 },
        ],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 80 },
      hints: [
        '折り返すと、折り目をはさむ2つの角は等しくなる。',
        'テープの上の辺と下の辺は平行なので、錯角や同側内角の関係が使える。',
      ],
      solution: [
        { text: '折り返しで、$\\angle$QPR＝$50^\\circ$（折り目をはさむ角が等しい）。' },
        { text: '上の辺の右側からPRまでの角は $50^\\circ+50^\\circ=100^\\circ$。上の辺と下の辺は平行なので、同側内角の和は $180^\\circ$。', math: '\\angle x=180^\\circ-100^\\circ=80^\\circ' },
      ],
      point: '折り返しの問題は「折り目の両側の角が等しい」と「平行線の角」を組み合わせる。',
      pitfall: '$\\angle x$ を $50^\\circ$ としない。折り返した辺は、上の辺から $100^\\circ$ 回った向きにある。',
    },
    {
      id: 'mx-angle-07', unit: 'angle', level: 'standard', pattern: 'polygon', minutes: 4,
      text: '内角の和が $1440^\\circ$ の多角形について答えなさい。',
      parts: [
        { q: '何角形か。', answer: '[ア]\\ \\text{角形}' },
        { q: '対角線は全部で何本あるか。', answer: '[イ]\\ \\text{本}' },
      ],
      boxes: { ア: 10, イ: 35 },
      hints: [
        '$180^\\circ\\times(n-2)=1440^\\circ$ から $n$ を求める。',
        '1つの頂点からひける対角線は $(n-3)$ 本。どの対角線も2回ずつ数えることになる。',
      ],
      solution: [
        { text: '$n$ を求める。', math: '180(n-2)=1440,\\quad n-2=8,\\quad n=10' },
        { text: '1つの頂点から $10-3=7$ 本。10個の頂点で数えると同じ対角線を2回ずつ数えるので', math: '\\dfrac{10\\times7}{2}=35' },
      ],
      point: '$n$ 角形の対角線の本数は $\\dfrac{n(n-3)}{2}$。',
      pitfall: '$10\\times7=70$ 本としない。対角線ABとBAは同じ1本なので、2でわる。',
    },
    {
      id: 'mx-angle-08', unit: 'angle', level: 'standard', pattern: 'triangle', minutes: 5,
      text: '図の $\\triangle$ABC で、$\\angle$B と $\\angle$C の二等分線の交点をPとする。$\\angle$A$=64^\\circ$ のとき、$\\angle x=\\angle$BPC の大きさを求めなさい。',
      figure: {
        label: '三角形ABCで、角Bの二等分線と角Cの二等分線が点Pで交わる。角Aが64度、角BPCがx。角Bの半分をa、角Cの半分をbで示す',
        size: [280, 230],
        view: [-0.8, 6.8, -0.8, 5.6],
        points: { A: ANGLE8_A, B: [0, 0], C: [6, 0], P: ANGLE8_P },
        labels: { A: 'n', B: 'sw', C: 'se', P: 'n' },
        polygons: [{ pts: ['A', 'B', 'C'] }],
        segments: [['B', 'P'], ['P', 'C']],
        angles: [
          { at: 'A', from: 'B', to: 'C', label: '64°', r: 18 },
          { at: 'B', from: 'C', to: 'P', label: 'a', r: 26 },
          { at: 'B', from: 'P', to: 'A', label: 'a', r: 34 },
          { at: 'C', from: 'P', to: 'B', label: 'b', r: 26 },
          { at: 'C', from: 'A', to: 'P', label: 'b', r: 34 },
          { at: 'P', from: 'B', to: 'C', label: 'x', r: 14 },
        ],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 122 },
      hints: [
        '$\\angle$B$=2a$、$\\angle$C$=2b$ とおくと、$\\triangle$ABC の内角の和から $a+b$ がわかる。',
        '$\\triangle$PBC の内角の和から $\\angle x$ を求める。',
      ],
      solution: [
        { text: '$\\triangle$ABC の内角の和より', math: '2a+2b=180^\\circ-64^\\circ=116^\\circ,\\quad a+b=58^\\circ' },
        { text: '$\\triangle$PBC の内角の和より', math: '\\angle x=180^\\circ-(a+b)=180^\\circ-58^\\circ=122^\\circ' },
      ],
      point: '二等分線の交点の角は $90^\\circ+\\dfrac12\\angle\\text{A}$ になる。$a+b$ をひとまとまりで求めるのがこつ。',
      pitfall: '$\\angle$B、$\\angle$C を1つずつ求めようとしない。わかるのは和の $a+b$ だけで十分。',
    },

    // ── 合同と証明 ──
    {
      id: 'mx-congr-01', unit: 'congr', level: 'basic', pattern: 'condition', minutes: 2,
      text: '$\\triangle$ABC と $\\triangle$DEF で、AB＝DE、BC＝EF、$\\angle$B＝$\\angle$E である。このとき使える三角形の合同条件を、⓪〜②から1つ選びなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 2 },
      choices: {
        ア: {
          options: ['3組の辺がそれぞれ等しい', '1組の辺とその両端の角がそれぞれ等しい', '2組の辺とその間の角がそれぞれ等しい'],
          notes: [
            '3組の辺が等しいことを言うには、CA＝FD もわかっている必要がある。この問題でわかっているのは2組の辺だけ。',
            'この条件には、1組の辺と、その辺の両はしにある2つの角が必要。わかっている角は $\\angle$B と $\\angle$E の1組だけ。',
            'AB、BC と、その間にある $\\angle$B がそれぞれ DE、EF、$\\angle$E に等しい。「2組の辺とその間の角」にあたる。',
          ],
        },
      },
      hints: [
        '等しいとわかっている辺と角が、三角形のどこにあるかを確かめる。',
        '$\\angle$B は、辺ABと辺BCの間にある角かどうかを見る。',
      ],
      solution: [
        { text: 'わかっているのは、2組の辺（AB＝DE、BC＝EF）と1組の角（$\\angle$B＝$\\angle$E）。' },
        { text: '$\\angle$B は辺ABと辺BCにはさまれた角なので、「2組の辺とその間の角がそれぞれ等しい」。' },
      ],
      point: '合同条件は、等しい辺・角の数だけでなく、角が辺の「間」にあるか「両端」にあるかで決まる。',
      pitfall: '2組の辺と「間でない」角が等しくても、合同とは限らない。角の位置を必ず確かめる。',
    },
    {
      id: 'mx-congr-02', unit: 'congr', level: 'basic', pattern: 'isosceles', minutes: 2,
      text: '図の $\\triangle$ABC は、AB＝AC の二等辺三角形で、$\\angle$A$=40^\\circ$ である。$\\angle x=\\angle$B の大きさを求めなさい。',
      figure: {
        label: 'AB=ACの二等辺三角形ABC。頂角Aが40度、底角Bがx',
        size: [220, 240],
        view: [-0.8, 4.8, -0.8, 6.2],
        points: { A: [2, 2 * Math.tan(rad(70))], B: [0, 0], C: [4, 0] },
        labels: { A: 'n', B: 'sw', C: 'se' },
        polygons: [{ pts: ['A', 'B', 'C'] }],
        ticks: [{ seg: ['A', 'B'], n: 1 }, { seg: ['A', 'C'], n: 1 }],
        angles: [
          { at: 'A', from: 'B', to: 'C', label: '40°', r: 20 },
          { at: 'B', from: 'C', to: 'A', label: 'x', r: 18 },
        ],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 70 },
      hints: [
        '二等辺三角形の2つの底角は等しい。',
        '内角の和 $180^\\circ$ から頂角をひいて、2でわる。',
      ],
      solution: [
        { text: 'AB＝AC なので、底角 $\\angle$B と $\\angle$C は等しい。2つの底角の和は', math: '180^\\circ-40^\\circ=140^\\circ' },
        { text: '2でわる。', math: '\\angle x=140^\\circ\\div2=70^\\circ' },
      ],
      point: '二等辺三角形では、等しい辺の向かいにある2つの角（底角）が等しい。',
      pitfall: '頂角と底角を取りちがえない。等しい2辺にはさまれた角が頂角。',
    },
    {
      id: 'mx-congr-03', unit: 'congr', level: 'basic', pattern: 'parallelogram', minutes: 3,
      text: '四角形ABCDが次の条件を満たすとき、いつでも平行四辺形になるとはいえないものを、⓪〜③から1つ選びなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 1 },
      choices: {
        ア: {
          options: [
            '2組の対辺がそれぞれ平行である',
            '1組の対辺が平行で、もう1組の対辺が等しい',
            '2組の対角がそれぞれ等しい',
            '対角線がそれぞれの中点で交わる',
          ],
          notes: [
            '平行四辺形の定義そのもの。いつでも平行四辺形になる。',
            '等脚台形（上底と下底が平行で、残りの2辺が等しい台形）もこの条件を満たす。平行四辺形になるとはいえない。',
            '平行四辺形になるための条件の1つ。いつでも平行四辺形になる。',
            '平行四辺形になるための条件の1つ。対角線が互いに他を2等分すれば平行四辺形。',
          ],
        },
      },
      hints: [
        '平行四辺形になるための条件は5つある（2組の対辺が平行・2組の対辺が等しい・2組の対角が等しい・対角線が中点で交わる・1組の対辺が平行で等しい）。',
        '条件に合っているのに平行四辺形でない図形（反例）がかけるかを考える。',
      ],
      solution: [
        { text: '⓪・②・③は、平行四辺形になるための条件そのもの。' },
        { text: '①は、「1組の対辺が平行で長さも等しい」ではない。上底と下底が平行で、脚の長さが等しい等脚台形は①を満たすが、平行四辺形ではない。' },
      ],
      point: '「1組の対辺が平行でその長さが等しい」なら平行四辺形。平行な辺と等しい辺が別の組だと成り立たない。',
      pitfall: '条件の言葉が似ていても、どの辺が平行でどの辺が等しいかで結論が変わる。反例（等脚台形）を思いうかべる。',
    },
    {
      id: 'mx-congr-04', unit: 'congr', level: 'basic', pattern: 'parallelogram', minutes: 2,
      text: '図の平行四辺形ABCDで、$\\angle$A$=110^\\circ$、AB$=5$ cm、BC$=8$ cm である。',
      figure: {
        label: '平行四辺形ABCD。角Aが110度、ABが5cm、BCが8cm',
        size: [300, 180],
        view: [-0.8, 10.6, -0.8, 5.6],
        points: { A: polar(0, 0, 5, 70), B: [0, 0], C: [8, 0], D: [8 + 5 * Math.cos(rad(70)), 5 * Math.sin(rad(70))] },
        labels: { A: 'nw', B: 'sw', C: 'se', D: 'ne' },
        polygons: [{ pts: ['A', 'B', 'C', 'D'] }],
        angles: [
          { at: 'A', from: 'D', to: 'B', label: '110°', r: 18 },
          { at: 'B', from: 'C', to: 'A', label: 'x', r: 18 },
        ],
        texts: [{ at: ['A', 'B'], text: '5 cm' }, { at: ['B', 'C'], text: '8 cm' }],
      },
      parts: [
        { q: '$\\angle x=\\angle$B の大きさを求めなさい。', answer: '\\angle x=[ア]^\\circ' },
        { q: '平行四辺形ABCDの周の長さを求めなさい。', answer: '[イ]\\ \\text{cm}' },
      ],
      boxes: { ア: 70, イ: 26 },
      hints: [
        '平行四辺形では、となり合う角の和が $180^\\circ$（AD$\\parallel$BC の同側内角）。',
        '平行四辺形の対辺はそれぞれ等しい。',
      ],
      solution: [
        { text: 'AD$\\parallel$BC なので、$\\angle$A＋$\\angle$B$=180^\\circ$。', math: '\\angle x=180^\\circ-110^\\circ=70^\\circ' },
        { text: 'CD＝AB＝5 cm、AD＝BC＝8 cm。', math: '(5+8)\\times2=26' },
      ],
      point: '平行四辺形の性質：対辺が等しい・対角が等しい・となり合う角の和が $180^\\circ$・対角線が中点で交わる。',
      pitfall: '$\\angle$B を $\\angle$A と同じ $110^\\circ$ としない。等しいのは向かい合う角（$\\angle$A＝$\\angle$C）。',
    },
    {
      id: 'mx-congr-05', unit: 'congr', level: 'standard', pattern: 'proofstep', minutes: 5,
      text: '図で、AB$\\parallel$DC、線分ACとBDの交点をOとし、AO＝COである。$\\triangle$OAB$\\equiv\\triangle$OCD を次のように証明した。［ア］〜［ウ］にあてはまるものを、それぞれの選択肢から選びなさい。',
      math: '\\begin{array}{l}\\triangle\\text{OAB と }\\triangle\\text{OCD で}\\\\\\text{仮定より AO＝CO}\\ \\cdots\\text{①}\\\\\\angle\\text{OAB}=\\angle\\text{OCD}\\ （［ア］）\\cdots\\text{②}\\\\\\angle\\text{AOB}=\\angle\\text{COD}\\ （［イ］）\\cdots\\text{③}\\\\\\text{①②③より、［ウ］がそれぞれ等しいので}\\\\\\triangle\\text{OAB}\\equiv\\triangle\\text{OCD}\\end{array}',
      figure: {
        label: '平行な線分ABとDCがあり、線分ACとBDが点Oで交わる。AOとCOが等しい',
        size: [280, 180],
        view: [-0.8, 6.8, -0.8, 3.8],
        points: { A: [0, 3], B: [5, 3], C: [6, 0], D: [1, 0], O: [3, 1.5] },
        labels: { A: 'nw', B: 'ne', C: 'se', D: 'sw', O: 'e' },
        segments: [['A', 'B'], ['D', 'C'], ['A', 'C'], ['B', 'D']],
        ticks: [{ seg: ['A', 'O'], n: 1 }, { seg: ['O', 'C'], n: 1 }],
      },
      parts: [
        { q: '［ア］', answer: '[ア]' },
        { q: '［イ］', answer: '[イ]' },
        { q: '［ウ］', answer: '[ウ]' },
      ],
      boxes: { ア: 1, イ: 2, ウ: 1 },
      choices: {
        ア: {
          options: ['対頂角', '平行線の錯角', '平行線の同位角'],
          notes: [
            '対頂角は、2直線が交わってできる向かい合う角。$\\angle$OAB と $\\angle$OCD は交点Oの角ではない。',
            'AB$\\parallel$DC で、直線ACに対して反対側にある角どうし。平行線の錯角は等しい。',
            '同位角は、平行線と交わる直線に対して同じ側・同じ位置にある角。$\\angle$OAB と $\\angle$OCD は反対側にあるので錯角。',
          ],
        },
        イ: {
          options: ['平行線の錯角', '二等辺三角形の底角', '対頂角'],
          notes: [
            '$\\angle$AOB と $\\angle$COD は、平行線ABとDCがつくる角ではなく、ACとBDの交点Oの角。',
            '$\\triangle$OAB も $\\triangle$OCD も、二等辺三角形とはいえない。',
            '直線ACとBDが点Oで交わってできる、向かい合う角。対頂角は等しい。',
          ],
        },
        ウ: {
          options: ['2組の辺とその間の角', '1組の辺とその両端の角', '3組の辺'],
          notes: [
            '等しいとわかった辺は AO＝CO の1組だけなので、この条件は使えない。',
            '辺AOとCO、その両端の角（Aの角とOの角、Cの角とOの角）がそれぞれ等しい。',
            '等しいとわかった辺は1組だけで、3組の辺はそろっていない。',
          ],
        },
      },
      hints: [
        'AB$\\parallel$DC と直線ACでできる角は、同位角か錯角のどちらかを図で確かめる。',
        '①は辺、②③は角。辺AOの両端にある角かどうかを見る。',
      ],
      solution: [
        { text: '②：AB$\\parallel$DC なので、直線ACでできる錯角 $\\angle$OAB と $\\angle$OCD は等しい。' },
        { text: '③：直線ACとBDの交点Oにできる対頂角 $\\angle$AOB と $\\angle$COD は等しい。' },
        { text: '①の辺AO（CO）の両端の角が②③なので、「1組の辺とその両端の角がそれぞれ等しい」。' },
      ],
      point: '証明では、等しい理由（仮定・平行線の角・対頂角など）を1つずつ書き、最後に合同条件へまとめる。',
      pitfall: '錯角と同位角を取りちがえない。平行線の間で「Z」の形になるのが錯角。',
    },
    {
      id: 'mx-congr-06', unit: 'congr', level: 'standard', pattern: 'isosceles', minutes: 5,
      text: '図の $\\triangle$ABC は、AB＝AC、$\\angle$A$=36^\\circ$ の二等辺三角形である。$\\angle$B の二等分線と辺ACの交点をDとする。BC$=4$ cm のとき、BDとADの長さを求めなさい。',
      figure: {
        label: 'AB=AC、頂角36度の二等辺三角形ABC。角Bの二等分線が辺ACと点Dで交わる。BCが4cm',
        size: [220, 250],
        view: [-0.8, 4.8, -0.8, 6.8],
        points: { A: GOLD_A, B: [0, 0], C: [4, 0], D: GOLD_D },
        labels: { A: 'n', B: 'sw', C: 'se', D: 'e' },
        polygons: [{ pts: ['A', 'B', 'C'] }],
        segments: [['B', 'D']],
        angles: [{ at: 'A', from: 'B', to: 'C', label: '36°', r: 26 }],
        texts: [{ at: ['B', 'C'], text: '4 cm' }],
      },
      parts: [
        { q: 'BD', answer: '[ア]\\ \\text{cm}' },
        { q: 'AD', answer: '[イ]\\ \\text{cm}' },
      ],
      boxes: { ア: 4, イ: 4 },
      hints: [
        'まず角をすべて求める。底角は $72^\\circ$、二等分した角は $36^\\circ$。',
        '2つの角が等しい三角形は二等辺三角形。どの三角形が二等辺三角形になるかを探す。',
      ],
      solution: [
        { text: '$\\angle$B＝$\\angle$C＝$72^\\circ$。二等分して $\\angle$ABD＝$\\angle$DBC＝$36^\\circ$。$\\triangle$DBC で $\\angle$BDC$=180^\\circ-36^\\circ-72^\\circ=72^\\circ$。' },
        { text: '$\\triangle$BCD は $\\angle$C＝$\\angle$BDC＝$72^\\circ$ の二等辺三角形なので、BD＝BC＝4 cm。' },
        { text: '$\\triangle$ABD は $\\angle$A＝$\\angle$ABD＝$36^\\circ$ の二等辺三角形なので、AD＝BD＝4 cm。' },
      ],
      point: '「2つの角が等しい三角形は二等辺三角形」を使うと、角から長さがわかる。',
      pitfall: 'BDとADを、BCと関係のない長さだと思いこまない。角を全部書きこむと、二等辺三角形が2つ見つかる。',
    },
    {
      id: 'mx-congr-07', unit: 'congr', level: 'standard', pattern: 'parallelogram', minutes: 5,
      text: '図の平行四辺形ABCDで、AB$=6$ cm、AD$=10$ cm である。$\\angle$ABC の二等分線と辺ADの交点をEとするとき、AEとEDの長さを求めなさい。',
      figure: {
        label: '平行四辺形ABCD。角ABCの二等分線が辺ADと点Eで交わる。ABが6cm、ADが10cm',
        size: [320, 180],
        view: [-0.8, 13.8, -0.8, 6],
        points: { A: PARA_A, B: [0, 0], C: [10, 0], D: PARA_D, E: PARA_E },
        labels: { A: 'nw', B: 'sw', C: 'se', D: 'ne', E: 'n' },
        polygons: [{ pts: ['A', 'B', 'C', 'D'] }],
        segments: [['B', 'E']],
        texts: [{ at: ['A', 'B'], text: '6 cm' }, { at: ['B', 'C'], text: '10 cm' }],
      },
      parts: [
        { q: 'AE', answer: '[ア]\\ \\text{cm}' },
        { q: 'ED', answer: '[イ]\\ \\text{cm}' },
      ],
      boxes: { ア: 6, イ: 4 },
      hints: [
        'AD$\\parallel$BC なので、$\\angle$AEB と $\\angle$EBC は錯角で等しい。',
        '$\\angle$ABE＝$\\angle$EBC（二等分）と合わせると、$\\triangle$ABE はどんな三角形か。',
      ],
      solution: [
        { text: 'AD$\\parallel$BC より $\\angle$AEB＝$\\angle$EBC（錯角）。BEは二等分線なので $\\angle$ABE＝$\\angle$EBC。' },
        { text: 'よって $\\angle$ABE＝$\\angle$AEB で、$\\triangle$ABE は AB＝AE の二等辺三角形。AE$=6$ cm。' },
        { text: 'AD＝BC＝10 cm なので', math: '\\text{ED}=10-6=4' },
      ],
      point: '平行線と角の二等分線が出てきたら、二等辺三角形ができていないかを探す。',
      pitfall: 'EがADの中点だと決めつけない。長さは二等辺三角形から決まる。',
    },
    {
      id: 'mx-congr-08', unit: 'congr', level: 'standard', pattern: 'condition', minutes: 4,
      text: '図のように、$\\angle$XOY の二等分線上の点Pから、半直線OX、OYにそれぞれ垂線PA、PBをひいた。',
      figure: {
        label: '角XOYの二等分線上の点Pから、OXへ垂線PA、OYへ垂線PBをひいた図',
        size: [280, 220],
        view: [-0.6, 7.4, -0.8, 5.6],
        points: { O: [0, 0], P: BISECT_P, A: [BISECT_P[0], 0], B: BISECT_B },
        labels: { O: 'sw', P: 'e', A: 's', B: 'nw' },
        segments: [['O', [7.2, 0]], ['O', polar(0, 0, 6.4, 60)], ['O', 'P', { dash: true }], ['P', 'A'], ['P', 'B']],
        rights: [{ at: 'A', from: 'O', to: 'P' }, { at: 'B', from: 'O', to: 'P' }],
        texts: [{ at: [7.2, 0.35], text: 'X' }, { at: polar(0, 0, 6.7, 62), text: 'Y' }],
      },
      parts: [
        { q: '$\\triangle$POA$\\equiv\\triangle$POB を示すのに使う合同条件を、⓪〜②から1つ選びなさい。', answer: '[ア]' },
        { q: 'PA$=3$ cm のとき、PBの長さを求めなさい。', answer: '[イ]\\ \\text{cm}' },
      ],
      boxes: { ア: 1, イ: 3 },
      choices: {
        ア: {
          options: ['斜辺と他の1辺がそれぞれ等しい', '斜辺と1つの鋭角がそれぞれ等しい', '2組の辺とその間の角がそれぞれ等しい'],
          notes: [
            '等しいとわかっている辺は、斜辺OPだけ。PA＝PB はこれから示すことなので、使えない。',
            '$\\angle$PAO＝$\\angle$PBO$=90^\\circ$ の直角三角形で、斜辺OPが共通、$\\angle$POA＝$\\angle$POB（二等分線）。',
            'わかっている辺は斜辺OPの1組だけで、2組の辺はそろっていない。',
          ],
        },
      },
      hints: [
        '2つの三角形は、どちらも直角三角形。共通の辺と、等しい角を探す。',
        '直角三角形の合同条件は「斜辺と1つの鋭角」「斜辺と他の1辺」の2つ。',
      ],
      solution: [
        { text: '$\\triangle$POA と $\\triangle$POB は、$\\angle$PAO＝$\\angle$PBO$=90^\\circ$ の直角三角形。' },
        { text: '斜辺OPは共通、OPは二等分線なので $\\angle$POA＝$\\angle$POB。よって「斜辺と1つの鋭角がそれぞれ等しい」。' },
        { text: '合同な図形の対応する辺は等しいので、PB＝PA＝3 cm。' },
      ],
      point: '直角三角形は、斜辺をふくむ2つの条件だけで合同がいえる。',
      pitfall: '証明したいこと（PA＝PB）を、証明の途中の根拠に使わない。',
    },

    // ── 確率 ──
    {
      id: 'mx-prob-01', unit: 'prob', level: 'basic', pattern: 'dice', minutes: 2,
      text: '大小2つのさいころを同時に投げるとき、出た目の数の和が7になる確率を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 1, イ: 6 },
      hints: [
        '目の出方は全部で $6\\times6=36$ 通りで、どれも同じ程度に起こる。',
        '和が7になる組（大, 小）を書き出して数える。',
      ],
      solution: [
        { text: '和が7になるのは (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) の6通り。' },
        { text: '確率は', math: '\\dfrac{6}{36}=\\dfrac{1}{6}' },
      ],
      point: '2つのさいころは、表（6×6のます目）にすると数えもれがない。',
      pitfall: '(1,6) と (6,1) を同じものとして数えない。大小2つのさいころは区別する。',
    },
    {
      id: 'mx-prob-02', unit: 'prob', level: 'basic', pattern: 'coin', minutes: 2,
      text: '3枚の硬貨を同時に投げるとき、2枚が表で1枚が裏になる確率を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 3, イ: 8 },
      hints: [
        '3枚の硬貨を区別すると、表裏の出方は $2\\times2\\times2$ 通り。',
        'どの1枚が裏になるかで、場合を数える。',
      ],
      solution: [
        { text: '出方は全部で $8$ 通り。' },
        { text: '1枚だけが裏になるのは、裏になる硬貨の選び方で3通り。', math: '\\dfrac{3}{8}' },
      ],
      point: '硬貨も区別して数える。樹形図をかくと全体が見える。',
      pitfall: '「表3枚・表2枚・表1枚・表0枚」の4通りで考えて $\\dfrac14$ としない。それぞれの起こりやすさはちがう。',
    },
    {
      id: 'mx-prob-03', unit: 'prob', level: 'basic', pattern: 'draw', minutes: 3,
      text: '赤玉3個と白玉2個が入った袋から、同時に2個の玉を取り出すとき、2個とも赤玉である確率を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 3, イ: 10 },
      hints: [
        '赤玉を $r_1,r_2,r_3$、白玉を $w_1,w_2$ と区別して、2個の組を全部書き出す。',
        '同時に取り出すので、組の順番は考えない。',
      ],
      solution: [
        { text: '5個から2個を選ぶ組は', math: '\\dfrac{5\\times4}{2}=10\\ \\text{通り}' },
        { text: '2個とも赤玉の組は $\\{r_1,r_2\\},\\{r_1,r_3\\},\\{r_2,r_3\\}$ の3通り。', math: '\\dfrac{3}{10}' },
      ],
      point: '同じ色の玉も区別して数える。「同時に取り出す」は順番を考えない組で数える。',
      pitfall: '「赤と赤・赤と白・白と白」の3通りで $\\dfrac13$ としない。それぞれの起こりやすさがちがう。',
    },
    {
      id: 'mx-prob-04', unit: 'prob', level: 'basic', pattern: 'arrange', minutes: 2,
      text: 'A、B、C、Dの4人の中から、くじで代表を2人選ぶとき、Aが選ばれる確率を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 1, イ: 2 },
      hints: [
        '2人の選び方を全部書き出す（順番は考えない）。',
        'その中で、Aが入っている組を数える。',
      ],
      solution: [
        { text: '選び方は AB, AC, AD, BC, BD, CD の6通り。' },
        { text: 'Aが入るのは AB, AC, AD の3通り。', math: '\\dfrac{3}{6}=\\dfrac{1}{2}' },
      ],
      point: '「選ぶ」は組み合わせ（順番なし）、「並べる」は順列（順番あり）。',
      pitfall: 'AB と BA を別々に数えない。代表2人を選ぶだけなので、順番は関係ない。',
    },
    {
      id: 'mx-prob-05', unit: 'prob', level: 'standard', pattern: 'dice', minutes: 5,
      text: '大小2つのさいころを同時に投げ、大きいさいころの出た目の数を $a$、小さいさいころの出た目の数を $b$ とする。$\\dfrac{b}{a}$ が整数になる確率を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 7, イ: 18 },
      hints: [
        '$\\dfrac{b}{a}$ が整数になるのは、$b$ が $a$ の倍数のとき。',
        '$a=1,2,3,4,5,6$ のそれぞれについて、あてはまる $b$ の個数を数える。',
      ],
      solution: [
        { text: '$a=1$：6通り、$a=2$：$b=2,4,6$ の3通り、$a=3$：$b=3,6$ の2通り、$a=4,5,6$：それぞれ1通り。' },
        { text: '合計は $6+3+2+1+1+1=14$ 通り。', math: '\\dfrac{14}{36}=\\dfrac{7}{18}' },
      ],
      point: '条件に合う場合は、一方の値を固定して、もう一方を数えると整理しやすい。',
      pitfall: '$a=1$ のときを忘れない。$b$ がどの目でも $\\dfrac{b}{1}$ は整数。',
    },
    {
      id: 'mx-prob-06', unit: 'prob', level: 'standard', pattern: 'draw', minutes: 5,
      text: '1、2、3、4、5の数字を1つずつ書いた5枚のカードから、1枚ずつ続けて2枚取り出す（取り出したカードはもどさない）。1枚目の数字を十の位、2枚目の数字を一の位として2けたの整数をつくるとき、その整数が3の倍数になる確率を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 2, イ: 5 },
      hints: [
        'つくれる2けたの整数は $5\\times4$ 通り。',
        '3の倍数は、各位の数の和が3の倍数。和が3の倍数になる2枚の組を探す。',
      ],
      solution: [
        { text: 'できる整数は $5\\times4=20$ 通り。' },
        { text: '2枚の和が3の倍数になる組は $\\{1,2\\},\\{1,5\\},\\{2,4\\},\\{4,5\\}$ の4組。それぞれ並べ方が2通りで8通り（12, 21, 15, 51, 24, 42, 45, 54）。', math: '\\dfrac{8}{20}=\\dfrac{2}{5}' },
      ],
      point: '「続けて取り出す」は順番のある並べ方。倍数の判定法（3の倍数は各位の和）を組み合わせる。',
      pitfall: '同じカードを2回使う 33 などを数えない。取り出したカードはもどさない。',
    },
    {
      id: 'mx-prob-07', unit: 'prob', level: 'standard', pattern: 'apply', minutes: 5,
      text: '1つのさいころを2回投げ、1回目に出た目の数を $a$、2回目に出た目の数を $b$ とする。点 P$(a,\\ b)$ が、関数 $y=\\dfrac{12}{x}$ のグラフ上にある確率を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 1, イ: 9 },
      hints: [
        '点がグラフ上にあるのは、$b=\\dfrac{12}{a}$、つまり $ab=12$ のとき。',
        '積が12になる目の組を数える。',
      ],
      solution: [
        { text: '$ab=12$ となるのは (2,6)(3,4)(4,3)(6,2) の4通り。' },
        { text: '確率は', math: '\\dfrac{4}{36}=\\dfrac{1}{9}' },
      ],
      point: '「グラフ上にある」は「式に代入して成り立つ」と読みかえる。',
      pitfall: '(1,12) や (12,1) は、さいころの目にないので数えない。',
    },
    {
      id: 'mx-prob-08', unit: 'prob', level: 'standard', pattern: 'apply', minutes: 6,
      text: '図のような正方形ABCDの頂点Aに点Pがある。1つのさいころを2回投げ、出た目の数の和だけ、点Pを A→B→C→D→A→… の順に頂点から頂点へ動かす。点Pが頂点Cで止まる確率を求めなさい。',
      figure: {
        label: '正方形ABCD。Aが左下、Bが右下、Cが右上、Dが左上で、点PはAにある',
        size: [200, 190],
        view: [-0.6, 2.6, -0.6, 2.6],
        points: { A: [0, 0], B: [2, 0], C: [2, 2], D: [0, 2] },
        labels: { A: 'sw', B: 'se', C: 'ne', D: 'nw' },
        polygons: [{ pts: ['A', 'B', 'C', 'D'] }],
        texts: [{ at: [0.35, 0.3], text: 'P', size: 12 }],
      },
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 1, イ: 4 },
      hints: [
        'Cで止まるのは、動く回数（目の和）を4でわった余りが2のとき。',
        '和が 2、6、10 になる目の出方を数える。',
      ],
      solution: [
        { text: '目の和は2〜12。Cに止まるのは和が 2、6、10 のとき。' },
        { text: '和が2：1通り、6：5通り、10：3通りで、合計9通り。', math: '\\dfrac{9}{36}=\\dfrac{1}{4}' },
      ],
      point: '周期的に動く問題は、「何でわった余り」で止まる位置が決まるかを見つける。',
      pitfall: '和が2のときだけを数えない。1周（4つ）ごとに同じ頂点へもどる。',
    },

    // ── 箱ひげ図 ──
    {
      id: 'mx-data2-01', unit: 'data2', level: 'basic', pattern: 'quartile', minutes: 3,
      text: '次のデータは、9人の生徒が1か月に読んだ本の冊数である。第1四分位数、第2四分位数（中央値）、第3四分位数を求めなさい。',
      math: '12,\\ 4,\\ 9,\\ 18,\\ 6,\\ 2,\\ 14,\\ 7,\\ 11\\ \\text{（冊）}',
      parts: [{ answer: '\\text{第1}\\ [ア],\\quad\\text{第2}\\ [イ],\\quad\\text{第3}\\ [ウ]' }],
      boxes: { ア: 5, イ: 9, ウ: 13 },
      hints: [
        'まず小さい順に並べ、まん中（5番目）の値が中央値。',
        '中央値より前の4個の中央値が第1四分位数、後ろの4個の中央値が第3四分位数。',
      ],
      solution: [
        { text: '並べかえる。', math: '2,\\ 4,\\ 6,\\ 7,\\ \\underline{9},\\ 11,\\ 12,\\ 14,\\ 18' },
        { text: '前半 $2,4,6,7$ の中央値は $\\dfrac{4+6}{2}=5$、後半 $11,12,14,18$ の中央値は $\\dfrac{12+14}{2}=13$。' },
      ],
      point: 'データが奇数個のときは、中央値そのものを前半にも後半にも入れずに四分位数を求める。',
      pitfall: '並べかえずに、書かれた順のまん中をとらない。',
    },
    {
      id: 'mx-data2-02', unit: 'data2', level: 'basic', pattern: 'iqr', minutes: 3,
      text: '次のデータは、10人の生徒のゲームの得点である。四分位範囲と範囲を求めなさい。',
      math: '20,\\ 15,\\ 26,\\ 12,\\ 18,\\ 30,\\ 21,\\ 17,\\ 25,\\ 23\\ \\text{（点）}',
      parts: [
        { q: '四分位範囲', answer: '[ア]\\ \\text{点}' },
        { q: '範囲', answer: '[イ]\\ \\text{点}' },
      ],
      boxes: { ア: 8, イ: 18 },
      hints: [
        'データが10個（偶数個）なので、前半5個・後半5個に分けて、それぞれの中央値を求める。',
        '四分位範囲＝第3四分位数－第1四分位数、範囲＝最大値－最小値。',
      ],
      solution: [
        { text: '並べかえる。', math: '12,\\ 15,\\ 17,\\ 18,\\ 20\\ \\big|\\ 21,\\ 23,\\ 25,\\ 26,\\ 30' },
        { text: '第1四分位数は前半の中央値 $17$、第3四分位数は後半の中央値 $25$。', math: '25-17=8' },
        { text: '範囲は', math: '30-12=18' },
      ],
      point: '四分位範囲は、まん中のおよそ半分のデータの散らばり。極端な値の影響を受けにくい。',
      pitfall: '四分位範囲と範囲を取りちがえない。範囲は最大値と最小値の差。',
    },
    {
      id: 'mx-data2-03', unit: 'data2', level: 'basic', pattern: 'boxplot', minutes: 2,
      text: '図は、あるクラスの小テストの得点を箱ひげ図に表したものである。中央値と四分位範囲を読みとりなさい。',
      figure: {
        label: '箱ひげ図。最小値20点、第1四分位数35点、中央値45点、第3四分位数60点、最大値80点',
        size: [320, 130],
        stretch: true,
        view: [8, 94, -0.6, 1.4],
        points: {},
        ...BOX3,
        segments: [...BOX3.segments, [[10, 0], [90, 0]], ...[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => [[x, -0.05], [x, 0.05]])],
        texts: ticks([10, 20, 30, 40, 50, 60, 70, 80, 90], -0.3),
      },
      parts: [
        { q: '中央値', answer: '[ア]\\ \\text{点}' },
        { q: '四分位範囲', answer: '[イ]\\ \\text{点}' },
      ],
      boxes: { ア: 45, イ: 25 },
      hints: [
        '箱の中の線が中央値、箱の左はしが第1四分位数、右はしが第3四分位数。',
        '四分位範囲は箱の長さ。',
      ],
      solution: [
        { text: '箱の中の線は $45$ 点。' },
        { text: '箱の左はしは $35$ 点、右はしは $60$ 点。', math: '60-35=25' },
      ],
      point: '箱ひげ図は「最小値・第1四分位数・中央値・第3四分位数・最大値」の5つの値を表す。',
      pitfall: '四分位範囲をひげの長さ（最大値－最小値＝範囲）と取りちがえない。',
    },
    {
      id: 'mx-data2-04', unit: 'data2', level: 'basic', pattern: 'boxplot', minutes: 3,
      text: '図は、30人のテストの得点を箱ひげ図に表したもので、最小値30点、第1四分位数50点、中央値62点、第3四分位数75点、最大値95点である。正しいものを⓪〜②から1つ選びなさい。',
      figure: { ...BOX30_FIGURE, texts: ticks([20, 30, 40, 50, 60, 70, 80, 90, 100], -0.3) },
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 2 },
      choices: {
        ア: {
          options: ['四分位範囲は45点である', '中央値は62.5点である', '範囲は65点である'],
          notes: [
            '四分位範囲は第3四分位数－第1四分位数で $75-50=25$ 点。45点は第3四分位数－最小値。',
            '箱ひげ図の中央値は62点と読みとれる。62.5点になる理由はない。',
            '範囲は最大値－最小値で、$95-30=65$ 点。',
          ],
        },
      },
      hints: [
        '範囲＝最大値－最小値、四分位範囲＝第3四分位数－第1四分位数。',
        'それぞれの選択肢を、5つの値から計算して確かめる。',
      ],
      solution: [
        { text: '範囲は $95-30=65$ 点、四分位範囲は $75-50=25$ 点、中央値は62点。' },
        { text: '正しいのは②。' },
      ],
      point: '範囲と四分位範囲は、どちらもデータの散らばりを表す。どの2つの値の差かを覚えておく。',
      pitfall: '「範囲」と「四分位範囲」を同じものとしない。',
    },
    {
      id: 'mx-data2-05', unit: 'data2', level: 'standard', pattern: 'quartile', minutes: 5,
      text: '次の11個のデータを表した箱ひげ図として正しいものを、図の⓪〜②から1つ選びなさい。',
      math: '4,\\ 6,\\ 7,\\ 9,\\ 10,\\ 12,\\ 13,\\ 15,\\ 16,\\ 18,\\ 20',
      figure: {
        label: '3つの箱ひげ図⓪①②。⓪は第1四分位数6・中央値12・第3四分位数16、①は第1四分位数7・中央値10・第3四分位数16、②は第1四分位数7・中央値12・第3四分位数16。どれも最小値4、最大値20',
        size: [320, 210],
        stretch: true,
        view: [0, 23, -0.5, 4],
        points: {},
        polygons: BOX5.flatMap((box) => box.polygons),
        segments: [...BOX5.flatMap((box) => box.segments), [[2, 0], [22, 0]], ...[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((x) => [[x, -0.05], [x, 0.05]])],
        texts: [...ticks([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22], -0.3), { at: [1, 3.4], text: '⓪' }, { at: [1, 2.2], text: '①' }, { at: [1, 1], text: '②' }],
      },
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 2 },
      choices: {
        ア: {
          options: ['⓪の箱ひげ図', '①の箱ひげ図', '②の箱ひげ図'],
          notes: [
            '第1四分位数が6になっている。前半5個 $4,6,7,9,10$ の中央値は7なので合わない。',
            '中央値が10になっている。11個の中央値は6番目の12なので合わない。',
            '最小値4、第1四分位数7、中央値12、第3四分位数16、最大値20がすべて合っている。',
          ],
        },
      },
      hints: [
        '11個のデータの中央値は6番目。四分位数は、中央値を除いた前半5個・後半5個の中央値。',
        '5つの値を求めてから、図の箱の位置と見比べる。',
      ],
      solution: [
        { text: '中央値は6番目の $12$。前半 $4,6,7,9,10$ の中央値 $7$ が第1四分位数、後半 $13,15,16,18,20$ の中央値 $16$ が第3四分位数。' },
        { text: '最小値4・7・12・16・最大値20の箱ひげ図は②。' },
      ],
      point: '箱ひげ図を選ぶ問題は、先に5つの値を計算してから、図の目もりと1つずつ照らし合わせる。',
      pitfall: '箱の両はしだけ見て決めない。中央値の線の位置もちがうことがある。',
    },
    {
      id: 'mx-data2-06', unit: 'data2', level: 'standard', pattern: 'boxplot', minutes: 5,
      text: '図は、30人のテストの得点を箱ひげ図に表したもので、最小値30点、第1四分位数50点、中央値62点、第3四分位数75点、最大値95点である。得点はすべて整数である。',
      figure: { ...BOX30_FIGURE, texts: ticks([20, 30, 40, 50, 60, 70, 80, 90, 100], -0.3) },
      parts: [
        { q: '50点以下の生徒は、少なくとも何人いるか。', answer: '[ア]\\ \\text{人}' },
        { q: '62点以上の生徒は、少なくとも何人いるか。', answer: '[イ]\\ \\text{人}' },
      ],
      boxes: { ア: 8, イ: 15 },
      hints: [
        '30人を小さい順に並べると、中央値は15番目と16番目の平均、第1四分位数は前半15人の中央値（8番目）。',
        '第1四分位数が50点なので、8番目の人は50点。中央値62点のとき、16番目の人は62点以上。',
      ],
      solution: [
        { text: '前半15人（1〜15番目）の中央値は8番目。第1四分位数が50点なので、8番目は50点で、1〜8番目の8人は50点以下。' },
        { text: '中央値62点は15番目と16番目の平均。16番目は62点以上なので、16〜30番目の15人は62点以上。' },
      ],
      point: '四分位数が「何番目の値か」を考えると、箱ひげ図から人数についていえることがわかる。',
      pitfall: '「50点以下は全体の4分の1」だから7.5人としない。何番目の値かで考えると、少なくとも8人いる。',
    },
    {
      id: 'mx-data2-07', unit: 'data2', level: 'standard', pattern: 'compare', minutes: 5,
      text: '図は、A組とB組のテストの得点を箱ひげ図に表したものである。',
      figure: {
        label: 'A組とB組の箱ひげ図。A組は最小値40・第1四分位数55・中央値65・第3四分位数70・最大値90、B組は最小値45・第1四分位数50・中央値60・第3四分位数80・最大値85',
        size: [320, 170],
        stretch: true,
        view: [26, 96, -0.5, 2.8],
        points: {},
        polygons: BOX7.flatMap((box) => box.polygons),
        segments: [...BOX7.flatMap((box) => box.segments), [[35, 0], [95, 0]], ...[40, 50, 60, 70, 80, 90].map((x) => [[x, -0.05], [x, 0.05]])],
        texts: [...ticks([40, 50, 60, 70, 80, 90], -0.3), { at: [30, 2.2], text: 'A組' }, { at: [30, 1], text: 'B組' }],
      },
      parts: [
        { q: '正しいものを、⓪〜②から1つ選びなさい。', answer: '[ア]' },
        { q: 'B組の四分位範囲を求めなさい。', answer: '[イ]\\ \\text{点}' },
      ],
      boxes: { ア: 1, イ: 30 },
      choices: {
        ア: {
          options: ['範囲が大きいのはB組である', '四分位範囲が大きいのはB組である', '中央値が大きいのはB組である'],
          notes: [
            '範囲はA組 $90-40=50$ 点、B組 $85-45=40$ 点。大きいのはA組。',
            '四分位範囲はA組 $70-55=15$ 点、B組 $80-50=30$ 点。大きいのはB組。',
            '中央値はA組65点、B組60点。大きいのはA組。',
          ],
        },
      },
      hints: [
        '範囲はひげの両はしの間、四分位範囲は箱の長さ、中央値は箱の中の線。',
        'A組・B組の値を読みとって、1つずつ比べる。',
      ],
      solution: [
        { text: '範囲：A組50点、B組40点。四分位範囲：A組15点、B組30点。中央値：A組65点、B組60点。' },
        { text: '正しいのは①。B組の四分位範囲は', math: '80-50=30' },
      ],
      point: '2つの集団を比べるときは、中央値（真ん中）と四分位範囲（まん中の半分の広がり）を見る。',
      pitfall: 'ひげの長さだけで散らばりを比べない。極端な値があると範囲は大きくなる。',
    },
    {
      id: 'mx-data2-08', unit: 'data2', level: 'standard', pattern: 'quartile', minutes: 5,
      text: '次の8個のデータは小さい順に並んでいて、$a$ は整数である。このデータの中央値が $9$ のとき、$a$ の値と第3四分位数を求めなさい。',
      math: '3,\\ 5,\\ 7,\\ a,\\ 10,\\ 12,\\ 14,\\ 16',
      parts: [{ answer: 'a=[ア],\\quad\\text{第3四分位数}\\ [イ]' }],
      boxes: { ア: 8, イ: 13 },
      hints: [
        'データが8個なので、中央値は4番目と5番目の平均。',
        '第3四分位数は、後半4個（5〜8番目）の中央値。',
      ],
      solution: [
        { text: '中央値は4番目と5番目の平均。', math: '\\dfrac{a+10}{2}=9,\\quad a=8' },
        { text: '後半 $10,\\ 12,\\ 14,\\ 16$ の中央値。', math: '\\dfrac{12+14}{2}=13' },
      ],
      point: '偶数個のデータでは、中央値・四分位数が「2つの値の平均」になることが多い。',
      pitfall: '中央値を4番目の $a$ そのものとしない。8個のときは4番目と5番目の平均。',
    },
  ],
}
