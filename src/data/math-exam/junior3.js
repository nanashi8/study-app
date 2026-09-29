// 入試演習（高校入試）：中3の単元。問題の形は src/lib/mathExam.js の冒頭を参照。
// 円の図は、問題の角の大きさから円周上の点の位置を決めて描く（図の角・長さは問題の条件どおり）。
import { lerp, mid, polar } from './figure-helpers.js'

const R = 3 // 円の図の半径
const on = (deg) => polar(0, 0, R, deg)
// 相似：AB=6、AC=9、BC=9 の三角形で、AD=4、AE=6。
const SIM2_A = [2, Math.sqrt(32)]
const SIM2_D = lerp(SIM2_A, [0, 0], 4 / 6)
const SIM2_E = lerp(SIM2_A, [9, 0], 6 / 9)
// 相似：台形。
const SIM5_E = lerp([2, 4.5], [0, 0], 1 / 3)
const SIM5_F = lerp([6, 4.5], [10, 0], 1 / 3)
// 相似：四角形の各辺の中点。
const Q7 = { A: [0, 0], B: [3, 4], C: [8, 0], D: [3, -2] }
// 円周角：12等分した点。A を真上から時計回りに。
const TWELVE = 'ABCDEFGHIJKL'.split('')
const twelve = Object.fromEntries(TWELVE.map((name, index) => [name, on(90 - 30 * index)]))
// 接線：∠APB=50°。
const TANGENT_P = [R / Math.sin((25 * Math.PI) / 180), 0]
// 三平方：折り返し。
const FOLD_E = [10, 6 - 10 / 3]

export const MATH_EXAM_JUNIOR3 = {
  patterns: {
    expand: [
      { id: 'formula', title: '乗法公式で展開する' },
      { id: 'combined', title: '展開してから加減する' },
      { id: 'substitute', title: '共通な部分をまとめて展開する' },
      { id: 'value', title: '展開を利用した値の計算' },
    ],
    factor: [
      { id: 'formula', title: '公式で因数分解する' },
      { id: 'common', title: '共通因数をくくり出す' },
      { id: 'twostep', title: '共通因数と公式の2段階' },
      { id: 'substitute', title: '置きかえて因数分解する' },
      { id: 'apply', title: '因数分解の利用（数の計算・式の値）' },
    ],
    sqrt: [
      { id: 'simplify', title: '根号をふくむ式の計算' },
      { id: 'rationalize', title: '分母の有理化' },
      { id: 'value', title: '平方根をふくむ式の値' },
      { id: 'integer', title: '平方根と整数（大小・自然数になる条件）' },
    ],
    eq2: [
      { id: 'factor', title: '因数分解で解く' },
      { id: 'formula', title: '解の公式で解く' },
      { id: 'square', title: '平方根の考えで解く' },
      { id: 'param', title: '解から係数・もう1つの解を求める' },
      { id: 'word', title: '二次方程式の文章題' },
    ],
    qfn0: [
      { id: 'formula', title: '式を求める・値を求める' },
      { id: 'domain', title: '変域（0をふくむとき）' },
      { id: 'rate', title: '変化の割合' },
      { id: 'graph', title: '放物線と直線・図形' },
      { id: 'apply', title: '関数 y=ax² の利用' },
    ],
    simil: [
      { id: 'ratio', title: '相似な図形の辺の長さ' },
      { id: 'parallel', title: '平行線と線分の比' },
      { id: 'midpoint', title: '中点連結定理' },
      { id: 'area', title: '相似比と面積比・体積比' },
    ],
    circ: [
      { id: 'inscribed', title: '円周角と中心角' },
      { id: 'diameter', title: '直径と円周角' },
      { id: 'arc', title: '弧の長さと円周角' },
      { id: 'converse', title: '円周角の定理の逆' },
      { id: 'tangent', title: '円の接線と角' },
    ],
    tri: [
      { id: 'basic', title: '直角三角形の辺の長さ' },
      { id: 'special', title: '特別な直角三角形' },
      { id: 'plane', title: '平面図形への利用（距離・弦・接線）' },
      { id: 'space', title: '空間図形への利用' },
      { id: 'fold', title: '折り返し・最短距離' },
    ],
    sample: [
      { id: 'terms', title: '全数調査と標本調査' },
      { id: 'estimate', title: '標本から母集団を推定する' },
      { id: 'capture', title: '印をつけて数を推定する' },
    ],
  },
  problems: [
    // ── 式の展開 ──
    {
      id: 'mx-expand-01', unit: 'expand', level: 'basic', pattern: 'formula', minutes: 1,
      text: '次の式を展開しなさい。',
      math: '(x+5)(x-3)',
      parts: [{ answer: 'x^2+[ア]x-[イ]' }],
      boxes: { ア: 2, イ: 15 },
      hints: [
        '乗法公式 $(x+a)(x+b)=x^2+(a+b)x+ab$ を使う。',
        '$a=5,\\ b=-3$ として、和と積を求める。',
      ],
      solution: [
        { text: '和は $5+(-3)=2$、積は $5\\times(-3)=-15$。' },
        { text: 'よって', math: '(x+5)(x-3)=x^2+2x-15' },
      ],
      point: '$(x+a)(x+b)$ は、$x$ の係数が「和」、定数項が「積」。',
      pitfall: '積の符号をまちがえない。$5\\times(-3)$ は負の数。',
    },
    {
      id: 'mx-expand-02', unit: 'expand', level: 'basic', pattern: 'formula', minutes: 2,
      text: '次の式を展開しなさい。',
      math: '(2x-3y)^2',
      parts: [{ answer: '[ア]x^2-[イ]xy+[ウ]y^2' }],
      boxes: { ア: 4, イ: 12, ウ: 9 },
      hints: [
        '乗法公式 $(a-b)^2=a^2-2ab+b^2$ で、$a=2x,\\ b=3y$ とする。',
        '$a^2$ は $(2x)^2$。係数も2乗する。',
      ],
      solution: [
        { text: '公式にあてはめる。', math: '(2x)^2-2\\times2x\\times3y+(3y)^2' },
        { text: '計算する。', math: '4x^2-12xy+9y^2' },
      ],
      point: '2乗の公式は「2乗・2倍の積・2乗」。まん中の項を忘れない。',
      pitfall: '$(2x-3y)^2=4x^2-9y^2$ としない。まん中の $-12xy$ が抜けている。',
    },
    {
      id: 'mx-expand-03', unit: 'expand', level: 'basic', pattern: 'combined', minutes: 3,
      text: '次の計算をしなさい。',
      math: '(x+4)(x-4)-(x-2)^2',
      parts: [{ answer: '[ア]x-[イ]' }],
      boxes: { ア: 4, イ: 20 },
      hints: [
        'それぞれを展開する。ひく方はかっこをつけたまま展開する。',
        '$(x-2)^2$ を展開した式の全体を引くので、各項の符号が変わる。',
      ],
      solution: [
        { text: 'それぞれ展開する。', math: '(x^2-16)-(x^2-4x+4)' },
        { text: 'かっこをはずしてまとめる。', math: 'x^2-16-x^2+4x-4=4x-20' },
      ],
      point: '引く式は、展開した結果をかっこでくくってから引く。',
      pitfall: '$-(x-2)^2$ を $-x^2-4x+4$ としない。かっこをはずすと $-x^2+4x-4$。',
    },
    {
      id: 'mx-expand-04', unit: 'expand', level: 'basic', pattern: 'value', minutes: 2,
      text: '乗法公式を利用して、次の計算をしなさい。',
      math: '103\\times97',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 9991 },
      hints: [
        '$103=100+3$、$97=100-3$ と表せる。',
        '$(a+b)(a-b)=a^2-b^2$ を使う。',
      ],
      solution: [
        { text: '和と差の積の形にする。', math: '103\\times97=(100+3)(100-3)' },
        { text: '公式を使う。', math: '100^2-3^2=10000-9=9991' },
      ],
      point: '100や1000に近い数のかけ算は、和と差の積や2乗の公式で速く計算できる。',
      pitfall: '$100^2-3^2$ を $10000-6$ としない。$3^2=9$。',
    },
    {
      id: 'mx-expand-05', unit: 'expand', level: 'standard', pattern: 'substitute', minutes: 3,
      text: '次の式を展開しなさい。',
      math: '(a+b-3)(a+b+3)',
      parts: [{ answer: 'a^2+[ア]ab+b^2-[イ]' }],
      boxes: { ア: 2, イ: 9 },
      hints: [
        '共通な部分 $a+b$ を $M$ とおくと、$(M-3)(M+3)$ の形になる。',
        '$M^2-9$ の $M$ をもとにもどして、$(a+b)^2$ を展開する。',
      ],
      solution: [
        { text: '$a+b=M$ とおく。', math: '(M-3)(M+3)=M^2-9' },
        { text: '$M$ をもとにもどす。', math: '(a+b)^2-9=a^2+2ab+b^2-9' },
      ],
      point: '同じ式が2か所に出てきたら、1つの文字におきかえると公式が使える。',
      pitfall: 'おきかえた文字をもとにもどし忘れない。最後は $a,\\ b$ の式で答える。',
    },
    {
      id: 'mx-expand-06', unit: 'expand', level: 'standard', pattern: 'value', minutes: 4,
      text: '$x+y=5,\\ xy=3$ のとき、次の式の値を求めなさい。',
      parts: [
        { q: '$x^2+y^2$', answer: '[ア]' },
        { q: '$(x-y)^2$', answer: '[イ]' },
      ],
      boxes: { ア: 19, イ: 13 },
      hints: [
        '$(x+y)^2=x^2+2xy+y^2$ を使うと、$x^2+y^2$ を $x+y$ と $xy$ で表せる。',
        '$(x-y)^2=x^2-2xy+y^2$。$x^2+y^2$ がわかれば計算できる。',
      ],
      solution: [
        { text: '$x^2+y^2=(x+y)^2-2xy$ に代入する。', math: '5^2-2\\times3=25-6=19' },
        { text: '$(x-y)^2=x^2+y^2-2xy$ に代入する。', math: '19-2\\times3=13' },
      ],
      point: '$x+y$ と $xy$ がわかっているときは、$x,\\ y$ を求めずに乗法公式で式を変形する。',
      pitfall: '$x^2+y^2=(x+y)^2$ としない。$2xy$ の分を引く必要がある。',
    },
    {
      id: 'mx-expand-07', unit: 'expand', level: 'standard', pattern: 'combined', minutes: 3,
      text: '次の計算をしなさい。',
      math: '(3x+1)^2-(3x+2)(3x-2)',
      parts: [{ answer: '[ア]x+[イ]' }],
      boxes: { ア: 6, イ: 5 },
      hints: [
        '$(3x+1)^2$ は2乗の公式、$(3x+2)(3x-2)$ は和と差の積の公式で展開する。',
        '引く方は、展開した式全体をかっこでくくってから引く。',
      ],
      solution: [
        { text: 'それぞれ展開する。', math: '(9x^2+6x+1)-(9x^2-4)' },
        { text: 'まとめる。', math: '9x^2+6x+1-9x^2+4=6x+5' },
      ],
      point: '公式を見分けてから展開する。どの項が消えるかを見通すと検算にもなる。',
      pitfall: '$-(9x^2-4)$ の $-4$ の符号を変え忘れて $6x-3$ としない。',
    },
    {
      id: 'mx-expand-08', unit: 'expand', level: 'standard', pattern: 'value', minutes: 4,
      text: '$a=\\dfrac{1}{3},\\ b=-2$ のとき、$(a+2b)^2-(a-2b)^2$ の値を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: -16, イ: 3 },
      hints: [
        'そのまま代入せず、先に展開して式を簡単にする。',
        '2つの2乗を展開すると、$a^2$ と $4b^2$ は消える。',
      ],
      solution: [
        { text: '展開して簡単にする。', math: '(a^2+4ab+4b^2)-(a^2-4ab+4b^2)=8ab' },
        { text: '代入する。', math: '8\\times\\dfrac{1}{3}\\times(-2)=-\\dfrac{16}{3}' },
      ],
      point: '式の値の問題は、式を簡単にしてから代入する。分数の計算が大きく減る。',
      pitfall: '$8ab$ の $b$ に $-2$ を入れて、符号を落とさない。答えは負の数。',
    },

    // ── 因数分解 ──
    {
      id: 'mx-factor-01', unit: 'factor', level: 'basic', pattern: 'formula', minutes: 2,
      text: '次の式を因数分解しなさい。ただし、ア＜イとする。',
      math: 'x^2-7x+12',
      parts: [{ answer: '(x-[ア])(x-[イ])' }],
      boxes: { ア: 3, イ: 4 },
      hints: [
        'かけて $12$、たして $-7$ になる2つの数を探す。',
        'かけて正、たして負なので、2つの数はどちらも負。',
      ],
      solution: [
        { text: 'かけて $12$、たして $-7$ になる2数は $-3$ と $-4$。' },
        { text: 'よって', math: 'x^2-7x+12=(x-3)(x-4)' },
      ],
      point: '$x^2+px+q$ の因数分解は、積が $q$ の組を書き出してから、和が $p$ になる組を選ぶ。',
      pitfall: '$(x+3)(x+4)$ としない。展開すると $x^2+7x+12$ になり、$x$ の係数の符号が合わない。',
    },
    {
      id: 'mx-factor-02', unit: 'factor', level: 'basic', pattern: 'formula', minutes: 2,
      text: '次の式を因数分解しなさい。',
      math: '4x^2-9y^2',
      parts: [{ answer: '([ア]x+[イ]y)([ア]x-[イ]y)' }],
      boxes: { ア: 2, イ: 3 },
      hints: [
        '$4x^2=(2x)^2$、$9y^2=(3y)^2$ と見る。',
        '$a^2-b^2=(a+b)(a-b)$ を使う。',
      ],
      solution: [
        { text: '2乗の差の形にする。', math: '4x^2-9y^2=(2x)^2-(3y)^2' },
        { text: '公式を使う。', math: '(2x+3y)(2x-3y)' },
      ],
      point: '2つの項がどちらも2乗の形で、引き算になっていたら $a^2-b^2$ の公式。',
      pitfall: '$4x^2-9y^2$ を $(4x+9y)(4x-9y)$ としない。$4x^2$ は $2x$ の2乗。',
    },
    {
      id: 'mx-factor-03', unit: 'factor', level: 'basic', pattern: 'common', minutes: 2,
      text: '次の式を因数分解しなさい。',
      math: '6a^2b-9ab^2',
      parts: [{ answer: '[ア]ab([イ]a-[ウ]b)' }],
      boxes: { ア: 3, イ: 2, ウ: 3 },
      hints: [
        '2つの項に共通な数と文字を探す。',
        '数は $6$ と $9$ の最大公約数、文字は $a$ と $b$ が共通。',
      ],
      solution: [
        { text: '共通因数は $3ab$。' },
        { text: 'くくり出す。', math: '6a^2b-9ab^2=3ab(2a-3b)' },
      ],
      point: '因数分解は、まず共通因数をくくり出せないかを確かめる。',
      pitfall: '$3a(2ab-3b^2)$ のように、くくり出しが不十分なまま終えない。かっこの中にまだ共通因数 $b$ がある。',
    },
    {
      id: 'mx-factor-04', unit: 'factor', level: 'basic', pattern: 'twostep', minutes: 2,
      text: '次の式を因数分解しなさい。',
      math: '2x^2-8',
      parts: [{ answer: '[ア](x+[イ])(x-[イ])' }],
      boxes: { ア: 2, イ: 2 },
      hints: [
        'まず共通因数 $2$ をくくり出す。',
        'かっこの中は $x^2-4$。2乗の差の公式が使える。',
      ],
      solution: [
        { text: '共通因数をくくり出す。', math: '2x^2-8=2(x^2-4)' },
        { text: 'かっこの中を因数分解する。', math: '2(x+2)(x-2)' },
      ],
      point: '共通因数をくくり出したあと、かっこの中がさらに因数分解できないかを確かめる。',
      pitfall: '$2(x^2-4)$ で止めない。$x^2-4$ はまだ因数分解できる。',
    },
    {
      id: 'mx-factor-05', unit: 'factor', level: 'standard', pattern: 'twostep', minutes: 3,
      text: '次の式を因数分解しなさい。',
      math: '3x^2-12x-36',
      parts: [{ answer: '[ア](x+[イ])(x-[ウ])' }],
      boxes: { ア: 3, イ: 2, ウ: 6 },
      hints: [
        'すべての係数が $3$ でわり切れる。まず $3$ をくくり出す。',
        'かっこの中の $x^2-4x-12$ は、かけて $-12$、たして $-4$ の2数を探す。',
      ],
      solution: [
        { text: '共通因数 $3$ をくくり出す。', math: '3(x^2-4x-12)' },
        { text: 'かけて $-12$、たして $-4$ の2数は $2$ と $-6$。', math: '3(x+2)(x-6)' },
      ],
      point: '係数が大きいときは、先に共通因数をくくり出すと、公式の2数が見つけやすい。',
      pitfall: 'くくり出した $3$ を答えに書き忘れない。',
    },
    {
      id: 'mx-factor-06', unit: 'factor', level: 'standard', pattern: 'substitute', minutes: 4,
      text: '次の式を因数分解しなさい。ただし、ア＜イとする。',
      math: '(x+1)^2-5(x+1)+6',
      parts: [{ answer: '(x-[ア])(x-[イ])' }],
      boxes: { ア: 1, イ: 2 },
      hints: [
        '$x+1=M$ とおくと、$M^2-5M+6$ になる。',
        '$M$ の式で因数分解してから、$M$ をもとにもどして整理する。',
      ],
      solution: [
        { text: '$x+1=M$ とおいて因数分解する。', math: 'M^2-5M+6=(M-2)(M-3)' },
        { text: '$M$ をもとにもどす。', math: '(x+1-2)(x+1-3)=(x-1)(x-2)' },
      ],
      point: '同じ式のかたまりは、1つの文字におきかえると見通しがよくなる。',
      pitfall: '$(M-2)(M-3)$ で止めない。$M$ をもどして、かっこの中を整理するまでが答え。',
    },
    {
      id: 'mx-factor-07', unit: 'factor', level: 'standard', pattern: 'apply', minutes: 2,
      text: '因数分解を利用して、次の計算をしなさい。',
      math: '57^2-43^2',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 1400 },
      hints: [
        '2乗の差は $a^2-b^2=(a+b)(a-b)$ と因数分解できる。',
        '$57+43$ と $57-43$ を先に計算する。',
      ],
      solution: [
        { text: '因数分解する。', math: '57^2-43^2=(57+43)(57-43)' },
        { text: '計算する。', math: '100\\times14=1400' },
      ],
      point: '2乗の差は、そのまま計算するより和と差の積に直した方が速い。',
      pitfall: '$57^2$ と $43^2$ をそれぞれ計算して引く方法でも同じ答えだが、計算ミスが起こりやすい。',
    },
    {
      id: 'mx-factor-08', unit: 'factor', level: 'standard', pattern: 'apply', minutes: 2,
      text: '$x=23$ のとき、$x^2-6x+9$ の値を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 400 },
      hints: [
        'そのまま代入する前に、式を因数分解できないか考える。',
        '$x^2-6x+9$ は $(x-a)^2$ の形になる。',
      ],
      solution: [
        { text: '因数分解する。', math: 'x^2-6x+9=(x-3)^2' },
        { text: '代入する。', math: '(23-3)^2=20^2=400' },
      ],
      point: '式の値は、因数分解してから代入すると、きりのよい数になることが多い。',
      pitfall: '$23^2-6\\times23+9$ をそのまま計算すると、けたの大きい計算でまちがえやすい。',
    },

    // ── 平方根 ──
    {
      id: 'mx-sqrt-01', unit: 'sqrt', level: 'basic', pattern: 'simplify', minutes: 2,
      text: '次の計算をしなさい。',
      math: '\\sqrt{18}+\\sqrt{50}-\\sqrt{8}',
      parts: [{ answer: '[ア]\\sqrt{[イ]}' }],
      boxes: { ア: 6, イ: 2 },
      hints: [
        'それぞれを $a\\sqrt{b}$（$b$ はできるだけ小さい自然数）の形に直す。',
        '$18=9\\times2$、$50=25\\times2$、$8=4\\times2$。',
      ],
      solution: [
        { text: '根号の中を小さくする。', math: '3\\sqrt{2}+5\\sqrt{2}-2\\sqrt{2}' },
        { text: 'まとめる。', math: '(3+5-2)\\sqrt{2}=6\\sqrt{2}' },
      ],
      point: '根号をふくむ式のたし算・ひき算は、根号の中を同じ数にそろえてから、同類項のようにまとめる。',
      pitfall: '$\\sqrt{18}+\\sqrt{50}=\\sqrt{68}$ のように、根号の中どうしを足さない。',
    },
    {
      id: 'mx-sqrt-02', unit: 'sqrt', level: 'basic', pattern: 'rationalize', minutes: 2,
      text: '次の数の分母を有理化しなさい。',
      math: '\\dfrac{6}{\\sqrt{3}}',
      parts: [{ answer: '[ア]\\sqrt{[イ]}' }],
      boxes: { ア: 2, イ: 3 },
      hints: [
        '分母と分子に $\\sqrt{3}$ をかける。',
        '$\\sqrt{3}\\times\\sqrt{3}=3$。最後に約分できるか確かめる。',
      ],
      solution: [
        { text: '分母と分子に $\\sqrt3$ をかける。', math: '\\dfrac{6\\times\\sqrt{3}}{\\sqrt{3}\\times\\sqrt{3}}=\\dfrac{6\\sqrt{3}}{3}' },
        { text: '約分する。', math: '2\\sqrt{3}' },
      ],
      point: '有理化は、分母の根号と同じものを分母・分子にかける。',
      pitfall: '$\\dfrac{6\\sqrt3}{3}$ で止めない。$6$ と $3$ は約分できる。',
    },
    {
      id: 'mx-sqrt-03', unit: 'sqrt', level: 'basic', pattern: 'simplify', minutes: 2,
      text: '次の計算をしなさい。',
      math: '(\\sqrt{3}+1)^2',
      parts: [{ answer: '[ア]+[イ]\\sqrt{[ウ]}' }],
      boxes: { ア: 4, イ: 2, ウ: 3 },
      hints: [
        '乗法公式 $(a+b)^2=a^2+2ab+b^2$ を使う。',
        '$(\\sqrt3)^2=3$。',
      ],
      solution: [
        { text: '公式で展開する。', math: '(\\sqrt{3})^2+2\\times\\sqrt{3}\\times1+1^2=3+2\\sqrt{3}+1' },
        { text: 'まとめる。', math: '4+2\\sqrt{3}' },
      ],
      point: '根号をふくむ式も、乗法公式で展開できる。$\\sqrt{a}$ を1つの文字と見る。',
      pitfall: '$(\\sqrt3+1)^2=3+1$ としない。まん中の $2\\sqrt3$ が抜けている。',
    },
    {
      id: 'mx-sqrt-04', unit: 'sqrt', level: 'basic', pattern: 'integer', minutes: 2,
      text: '$3<\\sqrt{a}<4$ を満たす自然数 $a$ は何個あるか。',
      parts: [{ answer: '[ア]\\ \\text{個}' }],
      boxes: { ア: 6 },
      hints: [
        '各辺は正の数なので、2乗しても大小は変わらない。',
        '$9<a<16$ を満たす自然数を数える。',
      ],
      solution: [
        { text: '各辺を2乗する。', math: '9<a<16' },
        { text: '$a=10,11,12,13,14,15$ の6個。' },
      ],
      point: '根号の大小は、2乗して比べるとわかりやすい（どちらも正のとき）。',
      pitfall: '$a=9$ や $a=16$ を入れない。$\\sqrt9=3$、$\\sqrt{16}=4$ で、不等号に等号はふくまれない。',
    },
    {
      id: 'mx-sqrt-05', unit: 'sqrt', level: 'standard', pattern: 'value', minutes: 4,
      text: '$x=\\sqrt{5}+2,\\ y=\\sqrt{5}-2$ のとき、$x^2-y^2$ の値を求めなさい。',
      parts: [{ answer: '[ア]\\sqrt{[イ]}' }],
      boxes: { ア: 8, イ: 5 },
      hints: [
        '$x^2-y^2=(x+y)(x-y)$ と因数分解してから代入する。',
        '$x+y$ と $x-y$ をそれぞれ先に計算する。',
      ],
      solution: [
        { text: '和と差を求める。', math: 'x+y=2\\sqrt{5},\\qquad x-y=4' },
        { text: '因数分解した式に代入する。', math: 'x^2-y^2=(x+y)(x-y)=2\\sqrt{5}\\times4=8\\sqrt{5}' },
      ],
      point: '根号をふくむ数の式の値は、因数分解して和・差・積の形にしてから代入する。',
      pitfall: '$x^2$ と $y^2$ をそれぞれ計算してもよいが、$(\\sqrt5+2)^2=9+4\\sqrt5$ のように展開ミスが起こりやすい。',
    },
    {
      id: 'mx-sqrt-06', unit: 'sqrt', level: 'standard', pattern: 'integer', minutes: 3,
      text: '$\\sqrt{60n}$ が自然数となるような、もっとも小さい自然数 $n$ を求めなさい。',
      parts: [{ answer: 'n=[ア]' }],
      boxes: { ア: 15 },
      hints: [
        '$60$ を素因数分解する。',
        '根号の中が自然数の2乗になれば、根号がはずれる。すべての素因数の指数が偶数になるようにする。',
      ],
      solution: [
        { text: '素因数分解する。', math: '60=2^2\\times3\\times5' },
        { text: '指数が奇数の $3$ と $5$ をかければ、2乗の形になる。', math: 'n=3\\times5=15,\\quad\\sqrt{60\\times15}=\\sqrt{900}=30' },
      ],
      point: '「$\\sqrt{\\ \\cdots\\ }$ が自然数」は「根号の中が自然数の2乗」と読みかえる。',
      pitfall: '$n=60$ としない。それでも自然数になるが、いちばん小さい $n$ ではない。',
    },
    {
      id: 'mx-sqrt-07', unit: 'sqrt', level: 'standard', pattern: 'integer', minutes: 5,
      text: '$\\sqrt{45-3a}$ が整数となるような自然数 $a$ について答えなさい。',
      parts: [
        { q: 'あてはまる自然数 $a$ は何個あるか。', answer: '[ア]\\ \\text{個}' },
        { q: 'あてはまる自然数 $a$ をすべて足すといくつか。', answer: '[イ]' },
      ],
      boxes: { ア: 3, イ: 30 },
      hints: [
        '$\\sqrt{45-3a}$ が整数になるのは、$45-3a$ が $0,1,4,9,16,\\ldots$ のような整数の2乗のとき。',
        '$a$ は自然数なので、$45-3a$ は $45$ より小さく、$3$ の倍数。2乗の数のうち $3$ の倍数を探す。',
      ],
      solution: [
        { text: '$45-3a=3(15-a)$ は $3$ の倍数で、$0$ 以上 $42$ 以下。2乗の数のうち $3$ の倍数は $0,\\ 9,\\ 36$。' },
        { text: '$45-3a=0$ のとき $a=15$、$9$ のとき $a=12$、$36$ のとき $a=3$。' },
        { text: '3個で、和は', math: '15+12+3=30' },
      ],
      point: '根号の中が「整数の2乗」になる場合を、根号の中がとれる範囲の中で全部書き出す。',
      pitfall: '$45-3a=0$（$\\sqrt0=0$ も整数）の場合を落とさない。',
    },
    {
      id: 'mx-sqrt-08', unit: 'sqrt', level: 'standard', pattern: 'value', minutes: 5,
      text: '$\\sqrt{7}$ の小数部分を $a$ とするとき、$a(a+4)$ の値を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 3 },
      hints: [
        '$\\sqrt7$ の整数部分を求める。$2^2<7<3^2$。',
        '小数部分は「もとの数－整数部分」。$a$ を根号の式で表してから代入する。',
      ],
      solution: [
        { text: '$2<\\sqrt7<3$ なので、整数部分は $2$、小数部分は', math: 'a=\\sqrt{7}-2' },
        { text: '代入する。$a+4=\\sqrt7+2$。', math: 'a(a+4)=(\\sqrt{7}-2)(\\sqrt{7}+2)=7-4=3' },
      ],
      point: '小数部分は「$\\sqrt{n}$ － 整数部分」と式で表す。小数を書き出して近似しない。',
      pitfall: '$a=0.6457\\ldots$ のように近似値で計算しない。正確な値は $\\sqrt7-2$。',
    },

    // ── 二次方程式 ──
    {
      id: 'mx-eq2-01', unit: 'eq2', level: 'basic', pattern: 'factor', minutes: 2,
      text: '二次方程式 $x^2+2x-15=0$ を解きなさい。解は小さい順に答えなさい。',
      parts: [{ answer: 'x=[ア],\\ [イ]' }],
      boxes: { ア: -5, イ: 3 },
      hints: [
        'かけて $-15$、たして $2$ になる2数を探して、左辺を因数分解する。',
        '$AB=0$ ならば $A=0$ または $B=0$。',
      ],
      solution: [
        { text: '因数分解する。', math: '(x+5)(x-3)=0' },
        { text: '$x+5=0$ または $x-3=0$。', math: 'x=-5,\\ 3' },
      ],
      point: '左辺が因数分解できるときは、因数分解して「積が0」の性質を使う。',
      pitfall: '$(x+5)(x-3)=0$ から $x=5,\\ -3$ としない。符号が逆になる。',
    },
    {
      id: 'mx-eq2-02', unit: 'eq2', level: 'basic', pattern: 'formula', minutes: 3,
      text: '二次方程式 $2x^2-5x+1=0$ を解きなさい。',
      parts: [{ answer: 'x=\\dfrac{[ア]\\pm\\sqrt{[イ]}}{[ウ]}' }],
      boxes: { ア: 5, イ: 17, ウ: 4 },
      hints: [
        '因数分解できないので、解の公式 $x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$ を使う。',
        '$a=2,\\ b=-5,\\ c=1$ を代入する。',
      ],
      solution: [
        { text: '解の公式に代入する。', math: 'x=\\dfrac{-(-5)\\pm\\sqrt{(-5)^2-4\\times2\\times1}}{2\\times2}' },
        { text: '計算する。', math: 'x=\\dfrac{5\\pm\\sqrt{17}}{4}' },
      ],
      point: '解の公式では、$-b$ と $b^2$ の符号に注意して、かっこをつけて代入する。',
      pitfall: '分母を $2$ にしない。分母は $2a=4$。',
    },
    {
      id: 'mx-eq2-03', unit: 'eq2', level: 'basic', pattern: 'square', minutes: 2,
      text: '二次方程式 $(x-3)^2=5$ を解きなさい。',
      parts: [{ answer: 'x=[ア]\\pm\\sqrt{[イ]}' }],
      boxes: { ア: 3, イ: 5 },
      hints: [
        '$x-3$ をひとまとまりと見ると、「2乗すると $5$ になる数」。',
        '$x-3=\\pm\\sqrt5$ から $x$ を求める。',
      ],
      solution: [
        { text: '平方根をとる。', math: 'x-3=\\pm\\sqrt{5}' },
        { text: '$3$ を移項する。', math: 'x=3\\pm\\sqrt{5}' },
      ],
      point: '$(x+p)^2=q$ の形は、展開せずに平方根をとる。',
      pitfall: '$\\pm$ を忘れない。2乗して $5$ になる数は2つある。',
    },
    {
      id: 'mx-eq2-04', unit: 'eq2', level: 'basic', pattern: 'factor', minutes: 3,
      text: '二次方程式 $x(x+3)=10$ を解きなさい。解は小さい順に答えなさい。',
      parts: [{ answer: 'x=[ア],\\ [イ]' }],
      boxes: { ア: -5, イ: 2 },
      hints: [
        'まず展開して、右辺を $0$ にする（$ax^2+bx+c=0$ の形にする）。',
        '$x^2+3x-10=0$ を因数分解する。',
      ],
      solution: [
        { text: '展開して移項する。', math: 'x^2+3x-10=0' },
        { text: '因数分解する。', math: '(x+5)(x-2)=0,\\quad x=-5,\\ 2' },
      ],
      point: '二次方程式は、まず「$=0$」の形に整理してから解き方を選ぶ。',
      pitfall: '$x=10$ または $x+3=10$ としない。積が $0$ のときしか、この考え方は使えない。',
    },
    {
      id: 'mx-eq2-05', unit: 'eq2', level: 'standard', pattern: 'param', minutes: 4,
      text: '$x$ についての二次方程式 $x^2+ax-12=0$ の解の1つが $3$ である。',
      parts: [
        { q: '$a$ の値を求めなさい。', answer: 'a=[ア]' },
        { q: 'もう1つの解を求めなさい。', answer: 'x=[イ]' },
      ],
      boxes: { ア: 1, イ: -4 },
      hints: [
        '解の1つが $3$ なので、$x=3$ を代入すると等式が成り立つ。',
        '$a$ がわかったら、もとの方程式を解いて、$3$ でない方の解を答える。',
      ],
      solution: [
        { text: '$x=3$ を代入する。', math: '9+3a-12=0,\\quad a=1' },
        { text: '$x^2+x-12=0$ を解く。', math: '(x+4)(x-3)=0,\\quad x=-4,\\ 3' },
        { text: 'もう1つの解は $-4$。' },
      ],
      point: '「解の1つが〜」は代入して係数を求め、方程式を解き直して残りの解を出す。',
      pitfall: 'もう1つの解を答えるときに、わかっている解の $3$ を答えない。',
    },
    {
      id: 'mx-eq2-06', unit: 'eq2', level: 'standard', pattern: 'word', minutes: 4,
      text: '縦の長さが横の長さより $3$ cm 長い長方形がある。この長方形の面積が $40$ cm$^2$ のとき、横と縦の長さを求めなさい。',
      parts: [{ answer: '\\text{横}\\ [ア]\\ \\text{cm},\\quad\\text{縦}\\ [イ]\\ \\text{cm}' }],
      boxes: { ア: 5, イ: 8 },
      hints: [
        '横を $x$ cm とすると、縦は $(x+3)$ cm。面積で方程式をつくる。',
        '解が2つ出たら、長さとして使えるか（正の数か）を確かめる。',
      ],
      solution: [
        { text: '方程式をつくって整理する。', math: 'x(x+3)=40,\\quad x^2+3x-40=0' },
        { text: '解く。', math: '(x+8)(x-5)=0,\\quad x=-8,\\ 5' },
        { text: '$x>0$ なので $x=5$。縦は $5+3=8$ cm。' },
      ],
      point: '文章題の二次方程式は、解が問題に合うか（長さは正など）を必ず確かめる。',
      pitfall: '$x=-8$ を答えにしない。長さは負にならない。',
    },
    {
      id: 'mx-eq2-07', unit: 'eq2', level: 'standard', pattern: 'word', minutes: 6,
      text: '図のように、縦 $20$ m、横 $30$ m の長方形の土地に、縦と横に同じ幅の道を1本ずつつくり、残りを花だんにする。花だんの面積を $504$ m$^2$ にするには、道の幅を何 m にすればよいか。',
      figure: {
        label: '縦20m、横30mの長方形の土地に、縦と横に同じ幅の道が1本ずつ通っている図',
        size: [320, 230],
        view: [-2, 32, -2.5, 22],
        points: {},
        polygons: [
          { pts: [[0, 0], [12, 0], [12, 8], [0, 8]], fill: true },
          { pts: [[14, 0], [30, 0], [30, 8], [14, 8]], fill: true },
          { pts: [[0, 10], [12, 10], [12, 20], [0, 20]], fill: true },
          { pts: [[14, 10], [30, 10], [30, 20], [14, 20]], fill: true },
          { pts: [[0, 0], [30, 0], [30, 20], [0, 20]] },
        ],
        texts: [{ at: [15, 21.3], text: '30 m' }, { at: [-1.2, 15], text: '20 m' }, { at: [13, -1.3], text: 'x m', size: 11 }],
      },
      parts: [{ answer: '[ア]\\ \\text{m}' }],
      boxes: { ア: 2 },
      hints: [
        '道を土地のはしに寄せて考えると、花だんは縦 $(20-x)$ m、横 $(30-x)$ m の1つの長方形になる。',
        '$(20-x)(30-x)=504$ を解き、$0<x<20$ に合う解を選ぶ。',
      ],
      solution: [
        { text: '花だんを1つの長方形に寄せて方程式をつくる。', math: '(20-x)(30-x)=504' },
        { text: '展開して整理する。', math: 'x^2-50x+96=0,\\quad(x-2)(x-48)=0' },
        { text: '$0<x<20$ なので $x=2$。' },
      ],
      point: '道で分かれた花だんは、道をはしに寄せても面積は変わらない。1つの長方形にして式をつくる。',
      pitfall: '$x=48$ を答えにしない。道の幅が土地の縦 $20$ m より広くなってしまう。',
    },
    {
      id: 'mx-eq2-08', unit: 'eq2', level: 'standard', pattern: 'word', minutes: 4,
      text: 'ある正の数を2乗するところを、まちがえて2倍したため、正しい答えより $15$ 小さくなった。ある正の数を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 5 },
      hints: [
        'ある正の数を $x$ とすると、正しく2乗した値は $x^2$、まちがえて2倍した値は $2x$。',
        '「正しい答えより15小さい」を式にする：$2x=x^2-15$。',
      ],
      solution: [
        { text: '方程式をつくって整理する。', math: 'x^2-2x-15=0' },
        { text: '解く。', math: '(x-5)(x+3)=0,\\quad x=5,\\ -3' },
        { text: '正の数なので $x=5$。' },
      ],
      point: '「〜より〜小さい」は、大きい方から小さい方を引いた差で式をつくる。',
      pitfall: '$x=-3$ を答えにしない。問題は「正の数」。',
    },

    // ── 関数 y=ax² ──
    {
      id: 'mx-qfn0-01', unit: 'qfn0', level: 'basic', pattern: 'formula', minutes: 2,
      text: '$y$ は $x$ の2乗に比例し、$x=-2$ のとき $y=12$ である。',
      parts: [
        { q: '$y$ を $x$ の式で表しなさい。', answer: 'y=[ア]x^2' },
        { q: '$x=3$ のときの $y$ の値を求めなさい。', answer: 'y=[イ]' },
      ],
      boxes: { ア: 3, イ: 27 },
      hints: [
        '$y=ax^2$ に $x=-2,\\ y=12$ を代入する。',
        '$(-2)^2=4$。求めた式に $x=3$ を代入する。',
      ],
      solution: [
        { text: '$a$ を求める。', math: '12=a\\times(-2)^2,\\quad a=3' },
        { text: '$x=3$ を代入する。', math: 'y=3\\times3^2=27' },
      ],
      point: '「$y$ は $x$ の2乗に比例」は $y=ax^2$。1組の値で $a$ が決まる。',
      pitfall: '$(-2)^2$ を $-4$ としない。2乗すると正になる。',
    },
    {
      id: 'mx-qfn0-02', unit: 'qfn0', level: 'basic', pattern: 'domain', minutes: 3,
      text: '関数 $y=2x^2$ について、$x$ の変域が $-1\\leqq x\\leqq 3$ のとき、$y$ の変域を求めなさい。',
      parts: [{ answer: '[ア]\\leqq y\\leqq[イ]' }],
      boxes: { ア: 0, イ: 18 },
      hints: [
        '$x$ の変域に $0$ がふくまれるかどうかを確かめる。',
        'グラフは原点を通る上に開いた放物線。$x=0$ のとき $y$ がいちばん小さい。',
      ],
      solution: [
        { text: '$x$ の変域に $0$ がふくまれるので、$y$ の最小値は $x=0$ のときの $0$。' },
        { text: '最大値は、$0$ から遠い $x=3$ のとき。', math: 'y=2\\times3^2=18' },
      ],
      point: '$y=ax^2$ の変域は、グラフをかいて、$x=0$ をふくむかどうかで考える。',
      pitfall: '両はしの値だけを代入して $2\\leqq y\\leqq18$ としない。$x=0$ で $y=0$ になる。',
    },
    {
      id: 'mx-qfn0-03', unit: 'qfn0', level: 'basic', pattern: 'rate', minutes: 2,
      text: '関数 $y=x^2$ について、$x$ の値が $1$ から $4$ まで増加するときの変化の割合を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 5 },
      hints: [
        '変化の割合＝$\\dfrac{y\\text{の増加量}}{x\\text{の増加量}}$。',
        '$x=1$ と $x=4$ のときの $y$ の値を求める。',
      ],
      solution: [
        { text: '$x=1$ のとき $y=1$、$x=4$ のとき $y=16$。' },
        { text: '変化の割合は', math: '\\dfrac{16-1}{4-1}=\\dfrac{15}{3}=5' },
      ],
      point: '$y=ax^2$ の変化の割合は一定ではない。区間ごとに計算する。',
      pitfall: '一次関数のように、係数 $1$ を変化の割合としない。',
    },
    {
      id: 'mx-qfn0-04', unit: 'qfn0', level: 'basic', pattern: 'formula', minutes: 2,
      text: '関数 $y=ax^2$ のグラフが点 $(-3,\\ -18)$ を通るとき、$a$ の値を求めなさい。',
      parts: [{ answer: 'a=[ア]' }],
      boxes: { ア: -2 },
      hints: [
        'グラフが点を通る → その座標を代入すると式が成り立つ。',
        '$-18=a\\times(-3)^2$ を解く。',
      ],
      solution: [
        { text: '代入する。', math: '-18=9a' },
        { text: '解く。', math: 'a=-2' },
      ],
      point: '$y$ 座標が負の点を通るとき、$a<0$ で、グラフは下に開いた放物線になる。',
      pitfall: '$(-3)^2=-9$ としない。$a$ の符号は $y$ 座標の符号で決まる。',
    },
    {
      id: 'mx-qfn0-05', unit: 'qfn0', level: 'standard', pattern: 'graph', minutes: 6,
      text: '図のように、関数 $y=\\dfrac{1}{2}x^2$ のグラフと直線 $y=x+4$ が2点A、Bで交わっている。点Aの $x$ 座標は点Bの $x$ 座標より小さく、原点をOとする。',
      figure: {
        label: '放物線 y=(1/2)x² と直線 y=x+4 が2点A、Bで交わり、三角形OABに色がついている図',
        size: [300, 250],
        view: [-4.5, 6, -1, 9.5],
        axes: { x: 'x', y: 'y' },
        points: { A: [-2, 2], B: [4, 8] },
        labels: { A: 'w', B: 'e' },
        polygons: [{ pts: [[0, 0], 'A', 'B'], fill: true }],
        curves: [
          { fn: (x) => x * x / 2, from: -4.3, to: 4.3 },
          { fn: (x) => x + 4, from: -4.4, to: 5.2 },
        ],
      },
      parts: [
        { q: '点A、Bの $x$ 座標を求めなさい。', answer: '\\text{A}\\ [ア],\\quad\\text{B}\\ [イ]' },
        { q: '$\\triangle$OAB の面積を求めなさい。', answer: '[ウ]' },
      ],
      boxes: { ア: -2, イ: 4, ウ: 12 },
      hints: [
        '交点の $x$ 座標は、$\\dfrac12x^2=x+4$ を解いて求める。',
        '直線と $y$ 軸の交点をCとすると、$\\triangle$OAB＝$\\triangle$OAC＋$\\triangle$OBC。OCを共通の底辺にする。',
      ],
      solution: [
        { text: '交点を求める。', math: '\\dfrac{1}{2}x^2=x+4,\\quad x^2-2x-8=0,\\quad(x+2)(x-4)=0' },
        { text: 'A$(-2,\\ 2)$、B$(4,\\ 8)$。直線と $y$ 軸の交点は C$(0,\\ 4)$。' },
        { text: 'OC $=4$ を底辺にして、高さはAとBの $x$ 座標の絶対値。', math: '\\dfrac{1}{2}\\times4\\times2+\\dfrac{1}{2}\\times4\\times4=4+8=12' },
      ],
      point: '放物線と直線でできる三角形は、$y$ 軸で2つに分けると、底辺が共通で高さが $x$ 座標になる。',
      pitfall: '高さに $y$ 座標を使わない。$y$ 軸上の線分OCを底辺にしたときの高さは、$x$ 座標の絶対値。',
    },
    {
      id: 'mx-qfn0-06', unit: 'qfn0', level: 'standard', pattern: 'rate', minutes: 5,
      text: '次の問いに答えなさい。',
      parts: [
        { q: '関数 $y=ax^2$ で、$x$ の値が $1$ から $3$ まで増加するときの変化の割合が $8$ である。$a$ の値を求めなさい。', answer: 'a=[ア]' },
        { q: '関数 $y=2x^2$ で、$x$ の値が $p$ から $p+2$ まで増加するときの変化の割合が $20$ である。$p$ の値を求めなさい。', answer: 'p=[イ]' },
      ],
      boxes: { ア: 2, イ: 4 },
      hints: [
        '$y=ax^2$ で $x$ が $s$ から $t$ まで増加するときの変化の割合は $\\dfrac{at^2-as^2}{t-s}=a(s+t)$。',
        '(2) は $2\\{p+(p+2)\\}=20$ を解く。',
      ],
      solution: [
        { text: '(1) 変化の割合を $a$ で表す。', math: '\\dfrac{9a-a}{3-1}=4a=8,\\quad a=2' },
        { text: '(2) 変化の割合を $p$ で表す。', math: '\\dfrac{2(p+2)^2-2p^2}{2}=2(2p+2)=4p+4' },
        { text: '$4p+4=20$ を解く。', math: 'p=4' },
      ],
      point: '$y=ax^2$ の変化の割合は $a\\times(\\text{はじめの}x+\\text{終わりの}x)$ で速く求められる。',
      pitfall: '(2) で $x$ の増加量を $p$ としない。$p$ から $p+2$ までなので増加量は $2$。',
    },
    {
      id: 'mx-qfn0-07', unit: 'qfn0', level: 'standard', pattern: 'apply', minutes: 4,
      text: 'ボールが落ち始めてから $x$ 秒間に落ちる距離を $y$ m とすると、$y=5x^2$ という関係がある。',
      parts: [
        { q: 'ボールが $45$ m 落ちるのにかかる時間は何秒か。', answer: '[ア]\\ \\text{秒}' },
        { q: '落ち始めて2秒後から4秒後までの平均の速さは、秒速何 m か。', answer: '\\text{秒速}\\ [イ]\\ \\text{m}' },
      ],
      boxes: { ア: 3, イ: 30 },
      hints: [
        '(1) $5x^2=45$ を解く。時間なので $x>0$。',
        '平均の速さ＝進んだ距離÷かかった時間。$y=5x^2$ の変化の割合と同じ。',
      ],
      solution: [
        { text: '(1) 解く。', math: '5x^2=45,\\quad x^2=9,\\quad x=3\\ (x>0)' },
        { text: '(2) 2秒後に $20$ m、4秒後に $80$ m 落ちている。', math: '\\dfrac{80-20}{4-2}=30' },
      ],
      point: '平均の速さは、グラフの2点を結ぶ直線の傾き＝変化の割合。',
      pitfall: '(2) で4秒後の落ちた距離 $80$ m をそのまま4でわらない。2秒後から4秒後の間の距離と時間を使う。',
    },
    {
      id: 'mx-qfn0-08', unit: 'qfn0', level: 'standard', pattern: 'graph', minutes: 6,
      text: '図のように、関数 $y=x^2$ のグラフ上に2点A$(-1,\\ 1)$、B$(2,\\ 4)$ があり、原点をOとする。グラフ上の点Pを、$x$ 座標が $0$ より大きく $2$ より小さい範囲にとり、$\\triangle$PAB の面積が $\\triangle$OAB の面積と等しくなるようにする。点Pの座標を求めなさい。',
      figure: {
        label: '放物線 y=x² 上の点A(-1,1)とB(2,4)、原点Oでできる三角形OAB',
        size: [280, 250],
        view: [-2.5, 3, -0.8, 5],
        axes: { x: 'x', y: 'y' },
        points: { A: [-1, 1], B: [2, 4] },
        labels: { A: 'w', B: 'e' },
        polygons: [{ pts: [[0, 0], 'A', 'B'], fill: true }],
        curves: [{ fn: (x) => x * x, from: -2.2, to: 2.2 }],
      },
      parts: [{ answer: '\\text{P}([ア],\\ [イ])' }],
      boxes: { ア: 1, イ: 1 },
      hints: [
        '底辺ABが共通なので、ABからの高さが等しければ面積も等しい。Oを通りABに平行な直線を考える。',
        '直線ABの傾きを求め、その傾きで原点を通る直線と放物線の交点を探す。',
      ],
      solution: [
        { text: '直線ABの傾きは $\\dfrac{4-1}{2-(-1)}=1$。Oを通りABに平行な直線は $y=x$。' },
        { text: 'この直線上の点は、どれもABからの距離がOと同じ。放物線との交点を求める。', math: 'x^2=x,\\quad x(x-1)=0,\\quad x=0,\\ 1' },
        { text: '$0<x<2$ なので $x=1$。P$(1,\\ 1)$。' },
      ],
      point: '面積が等しい三角形は、底辺に平行な直線を使って頂点を動かす（等積変形）。',
      pitfall: '$x=0$（原点O）を答えにしない。Pは $0<x<2$ の範囲にとる。',
    },

    // ── 相似 ──
    {
      id: 'mx-simil-01', unit: 'simil', level: 'basic', pattern: 'ratio', minutes: 2,
      text: '$\\triangle$ABC$\\backsim\\triangle$DEF で、AB$=6$ cm、BC$=8$ cm、DE$=9$ cm である。辺EFの長さを求めなさい。',
      parts: [{ answer: '[ア]\\ \\text{cm}' }],
      boxes: { ア: 12 },
      hints: [
        '相似な図形では、対応する辺の比はすべて等しい。',
        'ABとDEが対応するので、相似比は $6:9$。BCとEFも同じ比。',
      ],
      solution: [
        { text: '相似比は AB：DE $=6:9=2:3$。' },
        { text: 'BC：EF $=2:3$ なので', math: '8:\\text{EF}=2:3,\\quad\\text{EF}=12' },
      ],
      point: '相似の記号の順に頂点が対応する。$\\triangle$ABC$\\backsim\\triangle$DEF なら A↔D、B↔E、C↔F。',
      pitfall: '対応する辺を取りちがえない。BCに対応するのはEF。',
    },
    {
      id: 'mx-simil-02', unit: 'simil', level: 'basic', pattern: 'parallel', minutes: 3,
      text: '図の $\\triangle$ABC で、辺AB、AC上の点をそれぞれD、Eとし、DE$\\parallel$BC である。AD$=4$ cm、DB$=2$ cm、AE$=6$ cm、BC$=9$ cm のとき、ECとDEの長さを求めなさい。',
      figure: {
        label: '三角形ABCの辺AB上に点D、辺AC上に点Eがあり、DEとBCが平行な図',
        size: [280, 220],
        view: [-0.8, 9.8, -0.8, 6.4],
        points: { A: SIM2_A, B: [0, 0], C: [9, 0], D: SIM2_D, E: SIM2_E },
        labels: { A: 'n', B: 'sw', C: 'se', D: 'w', E: 'ne' },
        polygons: [{ pts: ['A', 'B', 'C'] }],
        segments: [['D', 'E']],
        texts: [{ at: ['A', 'D'], text: '4 cm', size: 11 }, { at: ['D', [0, 0]], text: '2 cm', size: 11 }, { at: ['A', 'E'], text: '6 cm', size: 11 }, { at: [[0, 0], [9, 0]], text: '9 cm', size: 11 }],
      },
      parts: [
        { q: 'EC', answer: '[ア]\\ \\text{cm}' },
        { q: 'DE', answer: '[イ]\\ \\text{cm}' },
      ],
      boxes: { ア: 3, イ: 6 },
      hints: [
        'DE$\\parallel$BC のとき、AD：DB＝AE：EC。',
        'DEは、AD：AB＝DE：BC を使う。DB：…としないこと。',
      ],
      solution: [
        { text: 'AD：DB＝AE：EC より', math: '4:2=6:\\text{EC},\\quad\\text{EC}=3' },
        { text: '$\\triangle$ADE$\\backsim\\triangle$ABC で、AD：AB$=4:6$。', math: '\\text{DE}=9\\times\\dfrac{4}{6}=6' },
      ],
      point: '平行線と線分の比は2種類。AD：DB＝AE：EC と、AD：AB＝AE：AC＝DE：BC。',
      pitfall: 'DEを AD：DB＝DE：BC で求めない。DEとBCの比は、AD：AB（全体）で決まる。',
    },
    {
      id: 'mx-simil-03', unit: 'simil', level: 'basic', pattern: 'midpoint', minutes: 2,
      text: '$\\triangle$ABC の辺AB、ACの中点をそれぞれM、Nとする。BC$=10$ cm のとき、MNの長さを求めなさい。',
      parts: [{ answer: '[ア]\\ \\text{cm}' }],
      boxes: { ア: 5 },
      hints: [
        '三角形の2辺の中点を結ぶ線分には、特別な性質がある（中点連結定理）。',
        'MN$\\parallel$BC で、長さはBCの何分のいくつかを考える。',
      ],
      solution: [
        { text: '中点連結定理より、MN$\\parallel$BC、MN $=\\dfrac12$BC。' },
        { text: '計算する。', math: '10\\times\\dfrac{1}{2}=5' },
      ],
      point: '中点連結定理：2辺の中点を結ぶ線分は、残りの辺に平行で、長さはその半分。',
      pitfall: 'MNをBCと同じ長さとしない。AM：AB＝1：2 なので、MNはBCの半分。',
    },
    {
      id: 'mx-simil-04', unit: 'simil', level: 'basic', pattern: 'area', minutes: 2,
      text: '相似比が $2:3$ である2つの図形について答えなさい。',
      parts: [
        { q: '2つの三角形の面積の比', answer: '[ア]:[イ]' },
        { q: '2つの立体の体積の比', answer: '[ウ]:[エ]' },
      ],
      boxes: { ア: 4, イ: 9, ウ: 8, エ: 27 },
      hints: [
        '相似比が $m:n$ のとき、面積比は $m^2:n^2$。',
        '相似な立体の体積比は $m^3:n^3$。',
      ],
      solution: [
        { text: '面積比。', math: '2^2:3^2=4:9' },
        { text: '体積比。', math: '2^3:3^3=8:27' },
      ],
      point: '長さの比が $m:n$ なら、面積の比は2乗、体積の比は3乗。',
      pitfall: '面積比を $2:3$ のままにしない。面積は縦も横も $\\dfrac32$ 倍になる。',
    },
    {
      id: 'mx-simil-05', unit: 'simil', level: 'standard', pattern: 'parallel', minutes: 5,
      text: '図のような台形ABCD（AD$\\parallel$BC）で、AD$=4$ cm、BC$=10$ cm である。辺AB上の点E、辺DC上の点Fを、EF$\\parallel$BC、AE：EB＝1：2 となるようにとる。EFの長さを求めなさい。',
      figure: {
        label: 'AD=4cm、BC=10cmの台形ABCD。辺AB上の点Eと辺DC上の点Fを結ぶ線分EFがBCに平行',
        size: [300, 180],
        view: [-0.8, 10.8, -0.8, 5.4],
        points: { A: [2, 4.5], B: [0, 0], C: [10, 0], D: [6, 4.5], E: SIM5_E, F: SIM5_F },
        labels: { A: 'nw', B: 'sw', C: 'se', D: 'ne', E: 'w', F: 'e' },
        polygons: [{ pts: ['A', 'B', 'C', 'D'] }],
        segments: [['E', 'F'], ['A', 'C', { dash: true }]],
        texts: [{ at: ['A', 'D'], text: '4 cm', size: 11 }, { at: ['B', 'C'], text: '10 cm', size: 11 }],
      },
      parts: [{ answer: '[ア]\\ \\text{cm}' }],
      boxes: { ア: 6 },
      hints: [
        '対角線ACをひき、EFとACの交点をGとすると、EFはEGとGFに分けられる。',
        '$\\triangle$ABC でEG、$\\triangle$CDA でGFを、平行線と線分の比で求める。',
      ],
      solution: [
        { text: '$\\triangle$ABC で、AE：AB$=1:3$ なので', math: '\\text{EG}=10\\times\\dfrac{1}{3}=\\dfrac{10}{3}' },
        { text: '$\\triangle$CDA で、CF：CD＝CG：CA＝EB：AB$=2:3$ なので', math: '\\text{GF}=4\\times\\dfrac{2}{3}=\\dfrac{8}{3}' },
        { text: '合わせる。', math: '\\text{EF}=\\dfrac{10}{3}+\\dfrac{8}{3}=6' },
      ],
      point: '台形の中の平行線は、対角線をひいて2つの三角形に分けると、平行線と線分の比が使える。',
      pitfall: '上底と下底の平均 $7$ cm としない。EFの位置は中央ではなく、AE：EB＝1：2 の位置。',
    },
    {
      id: 'mx-simil-06', unit: 'simil', level: 'standard', pattern: 'area', minutes: 4,
      text: '$\\triangle$ABC の辺AB、AC上にそれぞれ点D、Eがあり、DE$\\parallel$BC、AD：DB＝2：3 である。$\\triangle$ADE と四角形DBCEの面積の比を求めなさい。',
      parts: [{ answer: '[ア]:[イ]' }],
      boxes: { ア: 4, イ: 21 },
      hints: [
        '$\\triangle$ADE$\\backsim\\triangle$ABC で、相似比は AD：AB。',
        '面積比は相似比の2乗。四角形DBCEは、$\\triangle$ABC から $\\triangle$ADE を除いた部分。',
      ],
      solution: [
        { text: '相似比は AD：AB$=2:5$ なので、面積比は', math: '\\triangle\\text{ADE}:\\triangle\\text{ABC}=4:25' },
        { text: '四角形DBCEは $25-4=21$ にあたる。', math: '\\triangle\\text{ADE}:\\text{四角形DBCE}=4:21' },
      ],
      point: '「一部分と残り」の面積比は、全体を相似比の2乗で表してから引き算する。',
      pitfall: '相似比を AD：DB$=2:3$ としない。$\\triangle$ADE と $\\triangle$ABC の相似比は AD：AB$=2:5$。',
    },
    {
      id: 'mx-simil-07', unit: 'simil', level: 'standard', pattern: 'midpoint', minutes: 4,
      text: '図の四角形ABCDで、辺AB、BC、CD、DAの中点をそれぞれE、F、G、Hとする。対角線AC$=8$ cm、BD$=6$ cm のとき、四角形EFGHの周の長さを求めなさい。',
      figure: {
        label: '四角形ABCDの各辺の中点E、F、G、Hを結んだ四角形EFGHと、対角線AC、BD',
        size: [280, 220],
        view: [-0.8, 8.8, -2.8, 4.8],
        points: { A: Q7.A, B: Q7.B, C: Q7.C, D: Q7.D, E: mid(Q7.A, Q7.B), F: mid(Q7.B, Q7.C), G: mid(Q7.C, Q7.D), H: mid(Q7.D, Q7.A) },
        labels: { A: 'w', B: 'n', C: 'e', D: 's', E: 'nw', F: 'ne', G: 'se', H: 'sw' },
        polygons: [{ pts: ['A', 'B', 'C', 'D'] }, { pts: ['E', 'F', 'G', 'H'], fill: true }],
        segments: [['A', 'C', { dash: true }], ['B', 'D', { dash: true }]],
      },
      parts: [{ answer: '[ア]\\ \\text{cm}' }],
      boxes: { ア: 14 },
      hints: [
        '$\\triangle$ABC で、E、Fは2辺の中点。中点連結定理が使える。',
        'EFとHGはACの半分、EHとFGはBDの半分。',
      ],
      solution: [
        { text: '$\\triangle$ABC と $\\triangle$ACD で中点連結定理より、EF＝HG＝$\\dfrac12$AC＝4 cm。' },
        { text: '$\\triangle$ABD と $\\triangle$BCD で、EH＝FG＝$\\dfrac12$BD＝3 cm。', math: '4\\times2+3\\times2=14' },
      ],
      point: '四角形の各辺の中点を結ぶと平行四辺形ができ、周の長さは2本の対角線の和に等しい。',
      pitfall: '四角形ABCDの辺の長さを求めようとしない。必要なのは対角線の長さだけ。',
    },
    {
      id: 'mx-simil-08', unit: 'simil', level: 'standard', pattern: 'ratio', minutes: 6,
      text: '図のように、$\\angle$BAC$=90^\\circ$ の直角三角形ABCで、頂点Aから辺BCに垂線ADをひく。BD$=4$ cm、DC$=9$ cm のとき、ADとABの長さを求めなさい。',
      figure: {
        label: '角Aが直角の三角形ABCで、Aから辺BCへ垂線ADをひいた図。BDが4cm、DCが9cm',
        size: [320, 200],
        view: [-0.8, 13.8, -1.4, 6.8],
        points: { A: [4, 6], B: [0, 0], C: [13, 0], D: [4, 0] },
        labels: { A: 'n', B: 'sw', C: 'se', D: 's' },
        polygons: [{ pts: ['A', 'B', 'C'] }],
        segments: [['A', 'D']],
        rights: [{ at: 'A', from: 'B', to: 'C' }, { at: 'D', from: 'C', to: 'A' }],
        texts: [{ at: [2, -0.8], text: '4 cm', size: 11 }, { at: [8.5, -0.8], text: '9 cm', size: 11 }],
      },
      parts: [
        { q: 'AD', answer: '[ア]\\ \\text{cm}' },
        { q: 'AB', answer: '[イ]\\sqrt{[ウ]}\\ \\text{cm}' },
      ],
      boxes: { ア: 6, イ: 2, ウ: 13 },
      hints: [
        '$\\triangle$DBA$\\backsim\\triangle$DAC（2組の角がそれぞれ等しい）を使うと、BD：AD＝AD：DC。',
        'ABは、$\\triangle$DBA$\\backsim\\triangle$ABC から BD：BA＝BA：BC を使うか、三平方の定理で求める。',
      ],
      solution: [
        { text: '$\\triangle$DBA$\\backsim\\triangle$DAC より', math: '4:\\text{AD}=\\text{AD}:9,\\quad\\text{AD}^2=36,\\quad\\text{AD}=6' },
        { text: '$\\triangle$DBA$\\backsim\\triangle$ABC より', math: '4:\\text{AB}=\\text{AB}:13,\\quad\\text{AB}^2=52' },
        { text: 'よって', math: '\\text{AB}=\\sqrt{52}=2\\sqrt{13}' },
      ],
      point: '直角三角形の直角の頂点から垂線をひくと、3つの相似な直角三角形ができる。',
      pitfall: '対応する頂点を取りちがえない。$\\triangle$DBA と $\\triangle$DAC では、Bに対応するのはA。',
    },

    // ── 円周角 ──
    {
      id: 'mx-circ-01', unit: 'circ', level: 'basic', pattern: 'inscribed', minutes: 2,
      text: '図で、点A、B、Cは円Oの周上にあり、$\\angle$BOC$=130^\\circ$ である。$\\angle x=\\angle$BAC の大きさを求めなさい。',
      figure: {
        label: '円Oの周上に点A、B、Cがあり、中心角BOCが130度、円周角BACがx',
        size: [220, 220],
        view: [-3.8, 3.8, -3.8, 3.8],
        points: { O: [0, 0], A: on(120), B: on(245), C: on(15) },
        labels: { O: 'n', A: 'nw', B: 'sw', C: 'e' },
        circles: [{ c: 'O', r: R }],
        segments: [['A', 'B'], ['A', 'C'], ['O', 'B'], ['O', 'C']],
        angles: [{ at: 'O', from: 'B', to: 'C', label: '130°', r: 14 }, { at: 'A', from: 'B', to: 'C', label: 'x', r: 20 }],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 65 },
      hints: [
        '同じ弧BCに対する円周角と中心角の関係を使う。',
        '円周角は中心角の半分。',
      ],
      solution: [
        { text: '$\\angle$BAC と $\\angle$BOC は、同じ弧BCに対する円周角と中心角。' },
        { text: '円周角は中心角の半分。', math: '\\angle x=130^\\circ\\div2=65^\\circ' },
      ],
      point: '1つの弧に対する円周角は、その弧に対する中心角の半分。',
      pitfall: '中心角と円周角を逆にして $260^\\circ$ としない。円周角の方が小さい。',
    },
    {
      id: 'mx-circ-02', unit: 'circ', level: 'basic', pattern: 'diameter', minutes: 2,
      text: '図で、線分ABは円Oの直径で、点Cは円周上にある。$\\angle$CAB$=28^\\circ$ のとき、$\\angle x=\\angle$ABC の大きさを求めなさい。',
      figure: {
        label: '円Oの直径ABと円周上の点Cを結んだ三角形ABC。角CABが28度、角ABCがx',
        size: [240, 220],
        view: [-3.8, 3.8, -3.6, 3.8],
        points: { O: [0, 0], A: on(180), B: on(0), C: on(56) },
        labels: { O: 's', A: 'w', B: 'e', C: 'n' },
        circles: [{ c: 'O', r: R }],
        segments: [['A', 'B'], ['A', 'C'], ['B', 'C']],
        angles: [{ at: 'A', from: 'B', to: 'C', label: '28°', r: 26 }, { at: 'B', from: 'C', to: 'A', label: 'x', r: 20 }],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 62 },
      hints: [
        '直径に対する円周角は何度か考える。',
        '$\\triangle$ABC の内角の和から求める。',
      ],
      solution: [
        { text: 'ABは直径なので、$\\angle$ACB$=90^\\circ$。' },
        { text: '内角の和より', math: '\\angle x=180^\\circ-90^\\circ-28^\\circ=62^\\circ' },
      ],
      point: '直径に対する円周角は $90^\\circ$（半円の弧の中心角 $180^\\circ$ の半分）。',
      pitfall: '$\\angle$ACB を $\\angle$CAB と同じ $28^\\circ$ としない。直径に対する円周角は直角。',
    },
    {
      id: 'mx-circ-03', unit: 'circ', level: 'basic', pattern: 'inscribed', minutes: 3,
      text: '図で、4点A、B、C、Dは円周上にあり、線分ACとBDの交点をPとする。$\\angle$BAC$=35^\\circ$、$\\angle$ABD$=50^\\circ$ のとき、$\\angle x=\\angle$BDC と $\\angle y=\\angle$CPD の大きさを求めなさい。',
      figure: {
        label: '円周上の4点A、B、C、Dで、ACとBDが点Pで交わる。角BACが35度、角ABDが50度、角BDCがx、角CPDがy',
        size: [240, 230],
        view: [-3.8, 3.8, -3.8, 3.8],
        points: { A: on(120), B: on(200), C: on(270), D: on(20), P: [0, 0] },
        labels: { A: 'nw', B: 'w', C: 's', D: 'e', P: 'n' },
        circles: [{ c: [0, 0], r: R }],
        segments: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['D', 'C']],
        angles: [
          { at: 'A', from: 'B', to: 'C', label: '35°', r: 24 },
          { at: 'B', from: 'D', to: 'A', label: '50°', r: 24 },
          { at: 'D', from: 'B', to: 'C', label: 'x', r: 26 },
          { at: 'P', from: 'C', to: 'D', label: 'y', r: 14 },
        ],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ,\\quad\\angle y=[イ]^\\circ' }],
      boxes: { ア: 35, イ: 95 },
      hints: [
        '$\\angle$BDC と $\\angle$BAC は、どちらも弧BCに対する円周角。',
        '$\\angle$CPD は $\\angle$APB と対頂角。$\\triangle$ABP の内角の和から $\\angle$APB を求める。',
      ],
      solution: [
        { text: '弧BCに対する円周角は等しいので、$\\angle x=\\angle$BAC$=35^\\circ$。' },
        { text: '$\\triangle$ABP で', math: '\\angle\\text{APB}=180^\\circ-35^\\circ-50^\\circ=95^\\circ' },
        { text: '対頂角なので $\\angle y=\\angle$APB$=95^\\circ$。' },
      ],
      point: '同じ弧に対する円周角は等しい。どの弧に対する角かを、角の両はしの点で見分ける。',
      pitfall: '$\\angle$BDC を弧BDの円周角と見まちがえない。角の両はしがB、Cなら弧BCに対する角。',
    },
    {
      id: 'mx-circ-04', unit: 'circ', level: 'basic', pattern: 'arc', minutes: 3,
      text: '図のように、円周上に3点A、B、Cがあり、弧AB：弧BC：弧CA＝3：4：5 である（どの弧も、残りの点をふくまない方の弧）。$\\angle x=\\angle$ACB の大きさを求めなさい。',
      figure: {
        label: '円周上の3点A、B、Cを結んだ三角形ABC。弧AB、弧BC、弧CAの長さの比が3対4対5、角ACBがx',
        size: [220, 220],
        view: [-3.8, 3.8, -3.8, 3.8],
        points: { A: on(60), B: on(150), C: on(270) },
        labels: { A: 'ne', B: 'nw', C: 's' },
        circles: [{ c: [0, 0], r: R }],
        polygons: [{ pts: ['A', 'B', 'C'] }],
        angles: [{ at: 'C', from: 'A', to: 'B', label: 'x', r: 22 }],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 45 },
      hints: [
        '円周全体に対する中心角は $360^\\circ$。弧の長さの比で中心角を分ける。',
        '$\\angle$ACB は弧ABに対する円周角。',
      ],
      solution: [
        { text: '弧ABの中心角は', math: '360^\\circ\\times\\dfrac{3}{3+4+5}=90^\\circ' },
        { text: '円周角はその半分。', math: '\\angle x=45^\\circ' },
      ],
      point: '円周角の大きさは、それに対する弧の長さに比例する。',
      pitfall: '弧の比の $3$ を中心角 $30^\\circ$ などと読みかえない。まず全体 $360^\\circ$ を比で分ける。',
    },
    {
      id: 'mx-circ-05', unit: 'circ', level: 'standard', pattern: 'converse', minutes: 5,
      text: '図の4点A、B、C、Dで、点C、Dは直線ABについて同じ側にあり、$\\angle$ACB＝$\\angle$ADB＝$50^\\circ$ である。$\\angle$CAD$=30^\\circ$ のとき、$\\angle x=\\angle$CBD の大きさを求めなさい。',
      figure: {
        label: '4点A、B、C、Dと線分AC、BC、AD、BD、CD。角ACBと角ADBがどちらも50度、角CADが30度、角CBDがx',
        size: [240, 230],
        view: [-3.8, 3.8, -3.8, 3.8],
        points: { A: on(200), B: on(300), C: on(40), D: on(100) },
        labels: { A: 'w', B: 'se', C: 'ne', D: 'n' },
        segments: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'D'], ['B', 'D'], ['C', 'D']],
        angles: [
          { at: 'C', from: 'A', to: 'B', label: '50°', r: 22 },
          { at: 'D', from: 'A', to: 'B', label: '50°', r: 22 },
          { at: 'A', from: 'C', to: 'D', label: '30°', r: 34 },
          { at: 'B', from: 'C', to: 'D', label: 'x', r: 34 },
        ],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 30 },
      hints: [
        '2点C、Dが直線ABの同じ側にあって $\\angle$ACB＝$\\angle$ADB なら、4点はどうなるか（円周角の定理の逆）。',
        '4点が1つの円周上にあれば、弧CDに対する円周角どうしが等しい。',
      ],
      solution: [
        { text: '$\\angle$ACB＝$\\angle$ADB で、C、Dは直線ABの同じ側にあるので、円周角の定理の逆より、4点A、B、C、Dは1つの円周上にある。' },
        { text: '弧CDに対する円周角なので', math: '\\angle x=\\angle\\text{CAD}=30^\\circ' },
      ],
      point: '円がかかれていなくても、等しい角から「4点が同じ円周上にある」と見ぬけると、円周角の性質が使える。',
      pitfall: '円がないからといって、三角形の内角の和だけで解こうとしない。円周角の定理の逆を使う。',
    },
    {
      id: 'mx-circ-06', unit: 'circ', level: 'standard', pattern: 'diameter', minutes: 5,
      text: '図で、線分ABは円Oの直径で、点C、Dは円周上にある。$\\angle$BAC$=25^\\circ$ のとき、$\\angle x=\\angle$ADC の大きさを求めなさい。',
      figure: {
        label: '円Oの直径ABと、円周上の点C、D。角BACが25度、角ADCがx',
        size: [240, 230],
        view: [-3.8, 3.8, -3.8, 3.8],
        points: { O: [0, 0], A: on(180), B: on(0), C: on(50), D: on(300) },
        labels: { O: 'n', A: 'w', B: 'e', C: 'ne', D: 'se' },
        circles: [{ c: 'O', r: R }],
        segments: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'D'], ['C', 'D']],
        angles: [{ at: 'A', from: 'B', to: 'C', label: '25°', r: 30 }, { at: 'D', from: 'A', to: 'C', label: 'x', r: 22 }],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 65 },
      hints: [
        '直径ABに対する円周角 $\\angle$ACB は $90^\\circ$。$\\triangle$ABC で $\\angle$ABC を求める。',
        '$\\angle$ADC と $\\angle$ABC は、同じ弧ACに対する円周角。',
      ],
      solution: [
        { text: 'ABは直径なので $\\angle$ACB$=90^\\circ$。', math: '\\angle\\text{ABC}=180^\\circ-90^\\circ-25^\\circ=65^\\circ' },
        { text: '弧ACに対する円周角なので', math: '\\angle x=\\angle\\text{ABC}=65^\\circ' },
      ],
      point: '求める角と同じ弧に対する円周角を、計算しやすい三角形の中に探す。',
      pitfall: '$\\angle$ADC を $\\angle$BAC と同じ $25^\\circ$ としない。$\\angle$BAC は弧BCに対する角。',
    },
    {
      id: 'mx-circ-07', unit: 'circ', level: 'standard', pattern: 'tangent', minutes: 5,
      text: '図のように、円Oの外の点Pから円Oに2本の接線をひき、接点をA、Bとする。$\\angle$APB$=50^\\circ$ のとき、$\\angle$AOB と、弧ABをふくまない側の円周上の点Cについての $\\angle$ACB の大きさを求めなさい。',
      figure: {
        label: '円Oの外の点Pから2本の接線PA、PBをひいた図。角APBが50度。円周上の点Cと、中心OとA、Bを結んだ線',
        size: [320, 220],
        view: [-3.8, 7.8, -3.8, 3.8],
        points: { O: [0, 0], A: on(65), B: on(-65), P: TANGENT_P, C: on(180) },
        labels: { O: 'n', A: 'n', B: 's', P: 'e', C: 'w' },
        circles: [{ c: 'O', r: R }],
        segments: [['P', 'A'], ['P', 'B'], ['O', 'A'], ['O', 'B'], ['C', 'A'], ['C', 'B']],
        rights: [{ at: 'A', from: 'O', to: 'P' }, { at: 'B', from: 'O', to: 'P' }],
        angles: [{ at: 'P', from: 'A', to: 'B', label: '50°', r: 22 }],
      },
      parts: [{ answer: '\\angle\\text{AOB}=[ア]^\\circ,\\quad\\angle\\text{ACB}=[イ]^\\circ' }],
      boxes: { ア: 130, イ: 65 },
      hints: [
        '円の接線は、接点を通る半径に垂直。四角形OAPBの2つの角が $90^\\circ$。',
        '四角形の内角の和 $360^\\circ$ から $\\angle$AOB を求め、円周角はその半分。',
      ],
      solution: [
        { text: '$\\angle$OAP＝$\\angle$OBP$=90^\\circ$。四角形OAPBで', math: '\\angle\\text{AOB}=360^\\circ-90^\\circ-90^\\circ-50^\\circ=130^\\circ' },
        { text: '$\\angle$ACB は弧ABに対する円周角。', math: '130^\\circ\\div2=65^\\circ' },
      ],
      point: '接線と半径は垂直。接線が出てきたら、接点と中心を結んで直角をつくる。',
      pitfall: '$\\angle$AOB を $180^\\circ-50^\\circ$ としない。四角形なので、内角の和は $360^\\circ$。',
    },
    {
      id: 'mx-circ-08', unit: 'circ', level: 'standard', pattern: 'arc', minutes: 5,
      text: '図のように、円周を12等分する点を、時計回りに順にA、B、C、…、Lとする。$\\triangle$ADH の $\\angle x=\\angle$ADH の大きさを求めなさい。',
      figure: {
        label: '円周を12等分した点AからLのうち、A、D、Hを結んだ三角形。角ADHがx',
        size: [240, 240],
        view: [-3.9, 3.9, -3.9, 3.9],
        points: twelve,
        circles: [{ c: [0, 0], r: R }],
        polygons: [{ pts: ['A', 'D', 'H'] }],
        angles: [{ at: 'D', from: 'H', to: 'A', label: 'x', r: 20 }],
      },
      parts: [{ answer: '\\angle x=[ア]^\\circ' }],
      boxes: { ア: 75 },
      hints: [
        '12等分なので、となり合う点の間の弧に対する中心角は $30^\\circ$、円周角は $15^\\circ$。',
        '$\\angle$ADH は弧AHに対する円周角。Dをふくまない方の弧AHには、区切りがいくつあるかを数える。',
      ],
      solution: [
        { text: 'Dをふくまない弧AHは、H→I→J→K→L→A の5区切り分。中心角は', math: '30^\\circ\\times5=150^\\circ' },
        { text: '円周角はその半分。', math: '\\angle x=75^\\circ' },
      ],
      point: '等分された円では、「弧の区切りの数×（1区切りの円周角）」で角が求められる。',
      pitfall: '弧AHを、Dをふくむ方（7区切り）で数えない。円周角は、頂点をふくまない方の弧に対する角。',
    },

    // ── 三平方の定理 ──
    {
      id: 'mx-tri-01', unit: 'tri', level: 'basic', pattern: 'basic', minutes: 1,
      text: '直角三角形で、直角をはさむ2辺の長さが $5$ cm と $12$ cm のとき、斜辺の長さを求めなさい。',
      parts: [{ answer: '[ア]\\ \\text{cm}' }],
      boxes: { ア: 13 },
      hints: [
        '三平方の定理：直角をはさむ2辺を $a,\\ b$、斜辺を $c$ とすると $a^2+b^2=c^2$。',
        '$5^2+12^2$ を計算する。',
      ],
      solution: [
        { text: '三平方の定理より', math: 'c^2=5^2+12^2=25+144=169' },
        { text: '$c>0$ なので', math: 'c=13' },
      ],
      point: '$3:4:5$、$5:12:13$ などの整数の組は、覚えておくと計算が速い。',
      pitfall: '$5+12=17$ としない。辺の長さそのものでなく、2乗の和が等しい。',
    },
    {
      id: 'mx-tri-02', unit: 'tri', level: 'basic', pattern: 'special', minutes: 3,
      text: '1辺が $6$ cm の正三角形の高さと面積を求めなさい。',
      parts: [
        { q: '高さ', answer: '[ア]\\sqrt{[イ]}\\ \\text{cm}' },
        { q: '面積', answer: '[ウ]\\sqrt{[エ]}\\ \\text{cm}^2' },
      ],
      boxes: { ア: 3, イ: 3, ウ: 9, エ: 3 },
      hints: [
        '頂点から底辺に垂線をひくと、$30^\\circ,\\ 60^\\circ,\\ 90^\\circ$ の直角三角形が2つできる。',
        'その三角形の辺の比は $1:2:\\sqrt3$。斜辺は $6$ cm、底辺の半分は $3$ cm。',
      ],
      solution: [
        { text: '高さを $h$ とすると、三平方の定理より', math: 'h^2=6^2-3^2=27,\\quad h=3\\sqrt{3}' },
        { text: '面積。', math: '\\dfrac{1}{2}\\times6\\times3\\sqrt{3}=9\\sqrt{3}' },
      ],
      point: '1辺 $a$ の正三角形の高さは $\\dfrac{\\sqrt3}{2}a$、面積は $\\dfrac{\\sqrt3}{4}a^2$。',
      pitfall: '高さを求めるときに、底辺を $6$ cm のまま使わない。垂線は底辺を2等分する。',
    },
    {
      id: 'mx-tri-03', unit: 'tri', level: 'basic', pattern: 'plane', minutes: 2,
      text: '座標平面上の2点A$(-1,\\ 2)$、B$(3,\\ -1)$ の間の距離を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 5 },
      hints: [
        'ABを斜辺とし、$x$ 軸・$y$ 軸に平行な2辺をもつ直角三角形を考える。',
        '横の長さは $x$ 座標の差、縦の長さは $y$ 座標の差。',
      ],
      solution: [
        { text: '横は $3-(-1)=4$、縦は $2-(-1)=3$。' },
        { text: '三平方の定理より', math: '\\text{AB}=\\sqrt{4^2+3^2}=\\sqrt{25}=5' },
      ],
      point: '2点間の距離は、座標の差を2辺とする直角三角形の斜辺。',
      pitfall: '座標の差を $3-1=2$ のように符号を無視して計算しない。$-1$ との差は $4$。',
    },
    {
      id: 'mx-tri-04', unit: 'tri', level: 'basic', pattern: 'space', minutes: 3,
      text: '縦 $3$ cm、横 $4$ cm、高さ $12$ cm の直方体の対角線の長さを求めなさい。',
      parts: [{ answer: '[ア]\\ \\text{cm}' }],
      boxes: { ア: 13 },
      hints: [
        'まず底面の長方形の対角線の長さを求める。',
        'その対角線と高さを2辺とする直角三角形の斜辺が、直方体の対角線。',
      ],
      solution: [
        { text: '底面の対角線は', math: '\\sqrt{3^2+4^2}=5' },
        { text: '直方体の対角線は', math: '\\sqrt{5^2+12^2}=\\sqrt{169}=13' },
      ],
      point: '縦 $a$、横 $b$、高さ $c$ の直方体の対角線は $\\sqrt{a^2+b^2+c^2}$。',
      pitfall: '底面の対角線 $5$ cm を答えにしない。立体の中を通る対角線は、高さも使う。',
    },
    {
      id: 'mx-tri-05', unit: 'tri', level: 'standard', pattern: 'plane', minutes: 4,
      text: '半径 $5$ cm の円Oについて答えなさい。',
      parts: [
        { q: '中心Oからの距離が $3$ cm である弦の長さを求めなさい。', answer: '[ア]\\ \\text{cm}' },
        { q: '中心Oから $13$ cm はなれた点Pから円Oに接線をひくとき、Pから接点までの長さを求めなさい。', answer: '[イ]\\ \\text{cm}' },
      ],
      boxes: { ア: 8, イ: 12 },
      hints: [
        '中心から弦に垂線をひくと、垂線は弦を2等分する。半径・垂線・弦の半分で直角三角形ができる。',
        '接線は接点を通る半径に垂直。O・P・接点で、斜辺OPの直角三角形ができる。',
      ],
      solution: [
        { text: '弦の半分は', math: '\\sqrt{5^2-3^2}=4,\\quad\\text{弦}=8' },
        { text: '接線の長さは', math: '\\sqrt{13^2-5^2}=\\sqrt{144}=12' },
      ],
      point: '円の問題では「中心から弦への垂線」「接点への半径」をひいて直角三角形をつくる。',
      pitfall: '弦の長さを $4$ cm としない。垂線で2等分した半分の長さなので、2倍する。',
    },
    {
      id: 'mx-tri-06', unit: 'tri', level: 'standard', pattern: 'space', minutes: 6,
      text: '底面が1辺 $4$ cm の正方形で、ほかの辺の長さがすべて $6$ cm の正四角錐がある。',
      parts: [
        { q: '高さを求めなさい。', answer: '[ア]\\sqrt{[イ]}\\ \\text{cm}' },
        { q: '体積を求めなさい。', answer: '\\dfrac{[ウ]\\sqrt{[エ]}}{[オ]}\\ \\text{cm}^3' },
      ],
      boxes: { ア: 2, イ: 7, ウ: 32, エ: 7, オ: 3 },
      hints: [
        '頂点から底面に下ろした垂線は、底面の正方形の対角線の交点を通る。',
        '底面の対角線の半分・高さ・側面の辺（$6$ cm）で直角三角形ができる。',
      ],
      solution: [
        { text: '底面の対角線は $4\\sqrt2$ cm、その半分は $2\\sqrt2$ cm。' },
        { text: '高さを $h$ とすると', math: 'h^2=6^2-(2\\sqrt{2})^2=36-8=28,\\quad h=2\\sqrt{7}' },
        { text: '体積。', math: '\\dfrac{1}{3}\\times4^2\\times2\\sqrt{7}=\\dfrac{32\\sqrt{7}}{3}' },
      ],
      point: '錐体の高さは、頂点・底面の中心・底面の頂点でできる直角三角形から求める。',
      pitfall: '底面の対角線の「半分」を使う。対角線 $4\\sqrt2$ のまま使うと高さが求まらない。',
    },
    {
      id: 'mx-tri-07', unit: 'tri', level: 'standard', pattern: 'fold', minutes: 6,
      text: '図のように、AB$=6$ cm、AD$=10$ cm の長方形ABCDを、頂点Dが辺BC上の点Fに重なるように、線分AEを折り目として折り返した（点Eは辺CD上）。',
      figure: {
        label: '長方形ABCDを線分AEで折り返し、頂点Dが辺BC上の点Fに重なった図',
        size: [320, 210],
        view: [-0.8, 10.8, -1, 6.8],
        points: { A: [0, 6], B: [0, 0], C: [10, 0], D: [10, 6], E: FOLD_E, F: [8, 0] },
        labels: { A: 'nw', B: 'sw', C: 'se', D: 'ne', E: 'e', F: 's' },
        polygons: [{ pts: ['A', 'B', 'C', 'D'] }, { pts: ['A', 'F', 'E'], fill: true }],
        segments: [['A', 'E', { dash: true }]],
        texts: [{ at: ['A', 'B'], text: '6 cm', size: 11 }, { at: ['A', 'D'], text: '10 cm', size: 11 }],
      },
      parts: [
        { q: 'BFの長さを求めなさい。', answer: '[ア]\\ \\text{cm}' },
        { q: 'DEの長さを求めなさい。', answer: '\\dfrac{[イ]}{[ウ]}\\ \\text{cm}' },
      ],
      boxes: { ア: 8, イ: 10, ウ: 3 },
      hints: [
        '折り返すと、AF＝AD、EF＝ED になる。',
        '$\\triangle$ABF で三平方の定理。次にDE＝$x$ として、$\\triangle$ECF で三平方の定理。',
      ],
      solution: [
        { text: 'AF＝AD＝10 cm。$\\triangle$ABF で', math: '\\text{BF}=\\sqrt{10^2-6^2}=8' },
        { text: 'FC＝10－8＝2 cm。DE＝EF＝$x$ とすると EC＝$6-x$。$\\triangle$ECF で', math: 'x^2=(6-x)^2+2^2' },
        { text: '解く。', math: '0=36-12x+4,\\quad x=\\dfrac{10}{3}' },
      ],
      point: '折り返しの問題は「折り返した部分は合同」→ 等しい長さを書きこむ → 直角三角形で三平方の定理。',
      pitfall: 'EF をもとの ED と別の長さとしない。折り返すと EF＝ED。',
    },
    {
      id: 'mx-tri-08', unit: 'tri', level: 'standard', pattern: 'fold', minutes: 6,
      text: '図のような、底面の半径が $2$ cm、母線の長さが $8$ cm の円錐がある。底面の円周上の点Aから、側面を1周してAにもどる糸を、いちばん短くなるようにかける。糸の長さを求めなさい。',
      figure: {
        label: '底面の半径2cm、母線8cmの円錐。底面の円周上に点Aがある',
        size: [220, 240],
        view: [-3.5, 3.5, -1.8, 8.6],
        points: { O: [0, Math.sqrt(60)], A: [0, -0.9], L: [-2, 0], Rt: [2, 0] },
        hide: ['O', 'L', 'Rt'],
        labels: { A: 's' },
        segments: [['O', 'L'], ['O', 'Rt'], ['O', 'A', { dash: true }]],
        ellipses: [{ c: [0, 0], rx: 2, ry: 0.9 }],
        texts: [{ at: ['O', 'Rt'], text: '8 cm', size: 11 }, { at: [1.1, 0.4], text: '2 cm', size: 10 }],
      },
      parts: [{ answer: '[ア]\\sqrt{[イ]}\\ \\text{cm}' }],
      boxes: { ア: 8, イ: 2 },
      hints: [
        '側面を切り開くと、おうぎ形になる。糸はその展開図の上で線分になる。',
        'おうぎ形の中心角は、$360^\\circ\\times\\dfrac{\\text{底面の半径}}{\\text{母線}}$。',
      ],
      solution: [
        { text: '展開図のおうぎ形の中心角は', math: '360^\\circ\\times\\dfrac{2}{8}=90^\\circ' },
        { text: '糸は、半径 $8$ cm・中心角 $90^\\circ$ のおうぎ形の両はしを結ぶ線分。直角二等辺三角形の斜辺なので', math: '8\\sqrt{2}' },
      ],
      point: '立体の表面を通る最短の道は、展開図の上で直線（線分）になる。',
      pitfall: '底面の円周の長さ $4\\pi$ を答えにしない。糸は側面を斜めに通るので、展開図で考える。',
    },

    // ── 標本調査 ──
    {
      id: 'mx-sample-01', unit: 'sample', level: 'basic', pattern: 'terms', minutes: 1,
      text: '次の調査のうち、標本調査で行うのが適切なものを、⓪〜②から1つ選びなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 1 },
      choices: {
        ア: {
          options: ['学校で行う健康診断', 'テレビ番組の視聴率の調査', '国が行う国勢調査'],
          notes: [
            '健康診断は、一人ひとりの健康状態を知るための調査なので、全員を調べる全数調査。',
            'すべての世帯を調べるのは手間と費用がかかりすぎるので、一部の世帯を調べて全体を推定する。標本調査が適切。',
            '国勢調査は、国に住むすべての人の状況を正確に知るための全数調査。',
          ],
        },
      },
      hints: [
        '全体を調べる必要があるか、一部を調べて全体を推しはかればよいかで分ける。',
        '一人ひとりの結果が必要な調査は全数調査。',
      ],
      solution: [
        { text: '健康診断・国勢調査は、全員の結果が必要なので全数調査。' },
        { text: '視聴率は、一部の世帯を調べて全体の傾向を推定すれば十分なので、標本調査。' },
      ],
      point: '全数調査は正確だが手間がかかる。全体の傾向がわかればよいときや、調べると製品がこわれるときは標本調査。',
      pitfall: '「大事な調査だから全数調査」と考えない。目的に合わせて選ぶ。',
    },
    {
      id: 'mx-sample-02', unit: 'sample', level: 'basic', pattern: 'estimate', minutes: 2,
      text: 'ある工場で作った製品から、無作為に50個を取り出して調べたところ、不良品が2個あった。この工場で同じ製品を20000個作るとき、不良品はおよそ何個ふくまれると考えられるか。',
      parts: [{ answer: '\\text{およそ}\\ [ア]\\ \\text{個}' }],
      boxes: { ア: 800 },
      hints: [
        '標本での不良品の割合は、全体でもほぼ同じと考える。',
        '$20000$ 個に、標本の不良品の割合 $\\dfrac{2}{50}$ をかける。',
      ],
      solution: [
        { text: '標本の不良品の割合は $\\dfrac{2}{50}$。' },
        { text: '全体でも同じ割合と考える。', math: '20000\\times\\dfrac{2}{50}=800' },
      ],
      point: '無作為に取り出した標本の割合は、母集団の割合とほぼ等しいと考えて推定する。',
      pitfall: '不良品の数そのもの（2個）を全体の数にあてはめない。割合でそろえる。',
    },
    {
      id: 'mx-sample-03', unit: 'sample', level: 'basic', pattern: 'capture', minutes: 3,
      text: 'ある池の魚の数を調べるため、60匹をつかまえて印をつけ、池にもどした。数日後、同じ池で50匹をつかまえたところ、印のついた魚が6匹いた。この池の魚はおよそ何匹と考えられるか。',
      parts: [{ answer: '\\text{およそ}\\ [ア]\\ \\text{匹}' }],
      boxes: { ア: 500 },
      hints: [
        '2回目につかまえた魚の中の、印のついた魚の割合を求める。',
        '池全体でも、印のついた60匹の割合は同じと考える。池の魚を $x$ 匹として比例式をつくる。',
      ],
      solution: [
        { text: '2回目の割合は $\\dfrac{6}{50}$。池全体で $\\dfrac{60}{x}$ と等しいと考える。', math: '60:x=6:50' },
        { text: '解く。', math: '6x=3000,\\quad x=500' },
      ],
      point: '印をつけて放す方法では、「印の割合」が標本と池全体で同じと考えて比例式をつくる。',
      pitfall: '比例式の対応をまちがえない。$60$（印つき全体）に対応するのは $6$（標本の印つき）。',
    },
    {
      id: 'mx-sample-04', unit: 'sample', level: 'basic', pattern: 'terms', minutes: 2,
      text: 'ある中学校の生徒600人の中から、60人を無作為に選んで、1日の読書時間を調べた。この調査の母集団の大きさと、標本の大きさを答えなさい。',
      parts: [{ answer: '\\text{母集団}\\ [ア]\\ \\text{人},\\quad\\text{標本}\\ [イ]\\ \\text{人}' }],
      boxes: { ア: 600, イ: 60 },
      hints: [
        '母集団は、調べたいことがらの対象となる集団全体。',
        '標本は、母集団から実際に取り出して調べた一部分。',
      ],
      solution: [
        { text: '調べたい対象は生徒全体なので、母集団の大きさは $600$ 人。' },
        { text: '実際に調べた $60$ 人が標本で、標本の大きさは $60$ 人。' },
      ],
      point: '母集団の大きさ＝全体の数、標本の大きさ＝取り出して調べた数。',
      pitfall: '標本の大きさを、調べた結果の人数（例えば「読書時間が30分以上の人数」）と取りちがえない。',
    },
    {
      id: 'mx-sample-05', unit: 'sample', level: 'standard', pattern: 'estimate', minutes: 3,
      text: 'ある町の中学生2400人から、120人を無作為に選んでアンケートをとったところ、朝食を毎日食べると答えた人が102人いた。この町の中学生のうち、朝食を毎日食べる人はおよそ何人と考えられるか。',
      parts: [{ answer: '\\text{およそ}\\ [ア]\\ \\text{人}' }],
      boxes: { ア: 2040 },
      hints: [
        '標本での割合 $\\dfrac{102}{120}$ を約分すると計算しやすい。',
        '町全体の $2400$ 人に、その割合をかける。',
      ],
      solution: [
        { text: '標本の割合は', math: '\\dfrac{102}{120}=\\dfrac{17}{20}' },
        { text: '全体にかける。', math: '2400\\times\\dfrac{17}{20}=2040' },
      ],
      point: '推定の計算は、割合を約分してからかけると速く正確になる。',
      pitfall: '$2400-102$ のように引き算で求めない。割合で全体に広げる。',
    },
    {
      id: 'mx-sample-06', unit: 'sample', level: 'standard', pattern: 'estimate', minutes: 4,
      text: '袋の中に、黒玉と白玉が合わせて400個入っている。よくかき混ぜて30個を取り出したところ、白玉が12個ふくまれていた。袋の中の黒玉はおよそ何個と考えられるか。',
      parts: [{ answer: '\\text{およそ}\\ [ア]\\ \\text{個}' }],
      boxes: { ア: 240 },
      hints: [
        '取り出した30個のうち、黒玉は何個かを先に求める。',
        '黒玉の割合は袋全体でも同じと考えて、$400$ 個にかける。',
      ],
      solution: [
        { text: '取り出した30個のうち、黒玉は $30-12=18$ 個。' },
        { text: '黒玉の割合 $\\dfrac{18}{30}$ を全体にかける。', math: '400\\times\\dfrac{18}{30}=240' },
      ],
      point: '求めたいもの（黒玉）の割合を、標本から出して全体にかける。',
      pitfall: '白玉の数 $400\\times\\dfrac{12}{30}=160$ 個を答えにしない。問われているのは黒玉。',
    },
    {
      id: 'mx-sample-07', unit: 'sample', level: 'standard', pattern: 'terms', minutes: 3,
      text: 'ある市の中学生全体の、平日の平均睡眠時間を調べたい。標本の選び方としてもっとも適切なものを、⓪〜②から1つ選びなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 1 },
      choices: {
        ア: {
          options: [
            'A中学校の3年生全員を調べる',
            '市内の中学生全員に番号をつけ、乱数を使って選んだ200人を調べる',
            '運動部に入っている中学生から200人を選んで調べる',
          ],
          notes: [
            '1つの学校の1つの学年だけでは、市全体の中学生の代表にならない（学年や学校による差がある）。',
            '乱数で選ぶと、どの生徒も同じ確率で選ばれる（無作為抽出）。市全体の傾向を正しく推定できる。',
            '運動部の生徒だけにかたよるので、市全体の中学生の代表にならない。',
          ],
        },
      },
      hints: [
        '標本は、母集団の特徴をかたよりなく表すように選ぶ必要がある。',
        'だれもが同じ確率で選ばれる選び方を「無作為に抽出する」という。',
      ],
      solution: [
        { text: '⓪と②は、学年や部活動によるかたよりがあり、市全体の代表にならない。' },
        { text: '①は乱数を使った無作為抽出で、かたよりがない。' },
      ],
      point: '標本調査で大切なのは「無作為に抽出する」こと。人数が多くても、かたよった標本では正しく推定できない。',
      pitfall: '人数が多い方がよいと考えて、かたよった集団（1つの学年全員など）を選ばない。',
    },
    {
      id: 'mx-sample-08', unit: 'sample', level: 'standard', pattern: 'capture', minutes: 5,
      text: 'ある袋の中の米粒の数を調べるため、赤く色をつけた米粒300粒を袋に入れて、よくかき混ぜた。そこから米粒をひとつかみ取り出すと170粒あり、そのうち赤い米粒は6粒だった。袋の中の、もとの米粒はおよそ何粒と考えられるか。',
      parts: [{ answer: '\\text{およそ}\\ [ア]\\ \\text{粒}' }],
      boxes: { ア: 8200 },
      hints: [
        '赤い米粒を入れたあとの袋全体の数を $x$ 粒として、赤い米粒の割合で比例式をつくる。',
        '求めるのは「もとの米粒」なので、最後に入れた赤い米粒の数を引く。',
      ],
      solution: [
        { text: '赤い米粒の割合は、取り出した分と袋全体で同じと考える。', math: '300:x=6:170,\\quad x=8500' },
        { text: '赤い米粒300粒を入れる前の数は', math: '8500-300=8200' },
      ],
      point: 'あとから加えたものを目印にする推定では、目印をふくむ全体をまず求め、最後に目印の分を引く。',
      pitfall: '$8500$ 粒を答えにしない。その中には、あとから入れた赤い米粒300粒がふくまれている。',
    },
  ],
}
