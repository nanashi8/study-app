// 入試演習（大学入試）：数学Cの単元。問題の形は src/lib/mathExam.js の冒頭を参照。
import { lineMeet } from './figure-helpers.js'

// 位置ベクトル：OC:CA=2:1、D は OB の中点、P は AD と BC の交点。
const VEC = { O: [0, 0], A: [6, 0], B: [2, 5] }
const VEC_C = [4, 0]
const VEC_D = [1, 2.5]
const VEC_P = lineMeet(VEC.A, VEC_D, VEC.B, VEC_C)

export const MATH_EXAM_MATHC = {
  patterns: {
    vector: [
      { id: 'component', title: '成分と大きさ・平行と垂直' },
      { id: 'inner', title: '内積となす角' },
      { id: 'position', title: '位置ベクトルと交点' },
      { id: 'space', title: '空間ベクトル' },
      { id: 'minimum', title: '内積の利用（面積・大きさの最小）' },
    ],
    curveC: [
      { id: 'parabola', title: '放物線の焦点と準線' },
      { id: 'ellipse', title: '楕円・双曲線' },
      { id: 'polar', title: '極座標と極方程式' },
      { id: 'complex', title: '複素数平面と極形式' },
      { id: 'geometry', title: '複素数と図形' },
    ],
  },
  problems: [
    // ── ベクトル ──
    {
      id: 'mx-vector-01', unit: 'vector', level: 'basic', pattern: 'component', minutes: 2,
      text: '$\\vec{a}=(2,\\ -1)$、$\\vec{b}=(1,\\ 3)$ のとき、$2\\vec{a}-\\vec{b}$ の成分と大きさを求めなさい。',
      parts: [{ answer: '2\\vec{a}-\\vec{b}=([ア],\\ [イ]),\\quad|2\\vec{a}-\\vec{b}|=\\sqrt{[ウ]}' }],
      boxes: { ア: 3, イ: -5, ウ: 34 },
      hints: [
        '成分ごとに計算する：$2\\vec{a}=(4,\\ -2)$。',
        '大きさは $\\sqrt{x^2+y^2}$。',
      ],
      solution: [
        { text: '成分。', math: '2\\vec{a}-\\vec{b}=(4-1,\\ -2-3)=(3,\\ -5)' },
        { text: '大きさ。', math: '\\sqrt{3^2+(-5)^2}=\\sqrt{34}' },
      ],
      point: 'ベクトルの和・差・実数倍は、成分ごとに計算する。',
      pitfall: '$-2-3$ を $1$ としない。$y$ 成分は $-5$。',
    },
    {
      id: 'mx-vector-02', unit: 'vector', level: 'basic', pattern: 'inner', minutes: 3,
      text: '$|\\vec{a}|=2$、$|\\vec{b}|=3$、$\\vec{a}\\cdot\\vec{b}=-3$ のとき、$\\vec{a}$ と $\\vec{b}$ のなす角 $\\theta$ と、$|\\vec{a}+\\vec{b}|$ を求めなさい。',
      parts: [{ answer: '\\theta=[ア]^\\circ,\\quad|\\vec{a}+\\vec{b}|=\\sqrt{[イ]}' }],
      boxes: { ア: 120, イ: 7 },
      hints: [
        '$\\cos\\theta=\\dfrac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}||\\vec{b}|}$。',
        '$|\\vec{a}+\\vec{b}|^2=|\\vec{a}|^2+2\\vec{a}\\cdot\\vec{b}+|\\vec{b}|^2$。',
      ],
      solution: [
        { text: 'なす角。', math: '\\cos\\theta=\\dfrac{-3}{2\\times3}=-\\dfrac{1}{2},\\quad\\theta=120^\\circ' },
        { text: '大きさ。', math: '|\\vec{a}+\\vec{b}|^2=4-6+9=7' },
      ],
      point: 'ベクトルの大きさは、2乗して内積で展開する。',
      pitfall: '$|\\vec{a}+\\vec{b}|=|\\vec{a}|+|\\vec{b}|=5$ としない。',
    },
    {
      id: 'mx-vector-03', unit: 'vector', level: 'basic', pattern: 'component', minutes: 3,
      text: '$\\vec{a}=(1,\\ 2)$、$\\vec{b}=(x,\\ 6)$ について答えなさい。',
      parts: [
        { q: '$\\vec{a}\\parallel\\vec{b}$ となる $x$', answer: 'x=[ア]' },
        { q: '$\\vec{a}\\perp\\vec{b}$ となる $x$', answer: 'x=[イ]' },
      ],
      boxes: { ア: 3, イ: -12 },
      hints: [
        '平行：$\\vec{b}=k\\vec{a}$、または成分で $1\\times6-2\\times x=0$。',
        '垂直：内積が $0$。',
      ],
      solution: [
        { text: '平行の条件。', math: '1\\times6-2x=0,\\quad x=3' },
        { text: '垂直の条件。', math: '1\\times x+2\\times6=0,\\quad x=-12' },
      ],
      point: '平行は「成分の比が等しい」、垂直は「内積が0」。',
      pitfall: '平行と垂直の条件を取りちがえない。',
    },
    {
      id: 'mx-vector-04', unit: 'vector', level: 'basic', pattern: 'position', minutes: 2,
      text: '$\\triangle$ABC で、辺BCを2：1に内分する点をDとする。$\\overrightarrow{\\text{AB}}=\\vec{b}$、$\\overrightarrow{\\text{AC}}=\\vec{c}$ とするとき、$\\overrightarrow{\\text{AD}}$ を $\\vec{b},\\ \\vec{c}$ で表しなさい。',
      parts: [{ answer: '\\overrightarrow{\\text{AD}}=\\dfrac{[ア]}{[イ]}\\vec{b}+\\dfrac{[ウ]}{[エ]}\\vec{c}' }],
      boxes: { ア: 1, イ: 3, ウ: 2, エ: 3 },
      hints: [
        '線分を $m:n$ に内分する点の位置ベクトルは $\\dfrac{n\\vec{b}+m\\vec{c}}{m+n}$。',
        'BD：DC＝2：1 なので、Cに近い点。$\\vec{c}$ の係数が大きくなる。',
      ],
      solution: [
        { text: '内分の公式より', math: '\\overrightarrow{\\text{AD}}=\\dfrac{1\\cdot\\vec{b}+2\\cdot\\vec{c}}{2+1}=\\dfrac{1}{3}\\vec{b}+\\dfrac{2}{3}\\vec{c}' },
        { text: '係数の和が $1$ になっていることで確かめられる（Dは直線BC上）。' },
      ],
      point: '内分点の公式は「たすき掛け」：遠い方の比を近い方の点にかける。',
      pitfall: '$\\dfrac{2\\vec{b}+\\vec{c}}{3}$ と逆にしない。',
    },
    {
      id: 'mx-vector-05', unit: 'vector', level: 'standard', pattern: 'position', minutes: 7,
      text: '図の $\\triangle$OAB で、辺OAを2：1に内分する点をC、辺OBの中点をDとし、線分ADとBCの交点をPとする。$\\overrightarrow{\\text{OA}}=\\vec{a}$、$\\overrightarrow{\\text{OB}}=\\vec{b}$ とするとき、$\\overrightarrow{\\text{OP}}$ を $\\vec{a},\\ \\vec{b}$ で表しなさい。',
      figure: {
        label: '三角形OABで、OAを2:1に内分する点C、OBの中点Dをとり、ADとBCの交点をPとした図',
        size: [300, 220],
        view: [-0.6, 6.6, -0.8, 5.6],
        points: { O: VEC.O, A: VEC.A, B: VEC.B, C: VEC_C, D: VEC_D, P: VEC_P },
        labels: { O: 'sw', A: 'se', B: 'n', C: 's', D: 'w', P: 'ne' },
        polygons: [{ pts: ['O', 'A', 'B'] }],
        segments: [['A', 'D'], ['B', 'C']],
      },
      parts: [{ answer: '\\overrightarrow{\\text{OP}}=\\dfrac{[ア]}{[イ]}\\vec{a}+\\dfrac{[ウ]}{[エ]}\\vec{b}' }],
      boxes: { ア: 1, イ: 2, ウ: 1, エ: 4 },
      hints: [
        'PはAD上にあるので $\\overrightarrow{\\text{OP}}=(1-s)\\vec{a}+\\dfrac{s}{2}\\vec{b}$、BC上にあるので $\\overrightarrow{\\text{OP}}=\\dfrac{2}{3}(1-t)\\vec{a}+t\\vec{b}$ と表せる。',
        '$\\vec{a},\\ \\vec{b}$ は1次独立なので、係数を比べて $s,\\ t$ を求める。',
      ],
      solution: [
        { text: '2通りの表し方の係数を比べる。', math: '1-s=\\dfrac{2}{3}(1-t),\\qquad\\dfrac{s}{2}=t' },
        { text: '解く。', math: 's=\\dfrac{1}{2},\\quad t=\\dfrac{1}{4}' },
        { text: 'よって', math: '\\overrightarrow{\\text{OP}}=\\dfrac{1}{2}\\vec{a}+\\dfrac{1}{4}\\vec{b}' },
      ],
      point: '交点の位置ベクトルは「2つの直線上にある」ことを別々の文字で表し、係数を比較する。',
      pitfall: '係数を比べられるのは、$\\vec{a},\\ \\vec{b}$ が1次独立（平行でなく $\\vec{0}$ でない）だから。この前提を忘れない。',
    },
    {
      id: 'mx-vector-06', unit: 'vector', level: 'standard', pattern: 'space', minutes: 6,
      text: '空間の3点 A$(1,\\ 0,\\ 0)$、B$(0,\\ 2,\\ 0)$、C$(0,\\ 0,\\ 3)$ を頂点とする $\\triangle$ABC の面積を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 7, イ: 2 },
      hints: [
        '$\\overrightarrow{\\text{AB}}$ と $\\overrightarrow{\\text{AC}}$ を成分で求める。',
        '三角形の面積 $S=\\dfrac12\\sqrt{|\\overrightarrow{\\text{AB}}|^2|\\overrightarrow{\\text{AC}}|^2-(\\overrightarrow{\\text{AB}}\\cdot\\overrightarrow{\\text{AC}})^2}$。',
      ],
      solution: [
        { text: '$\\overrightarrow{\\text{AB}}=(-1,2,0)$、$\\overrightarrow{\\text{AC}}=(-1,0,3)$。', math: '|\\overrightarrow{\\text{AB}}|^2=5,\\quad|\\overrightarrow{\\text{AC}}|^2=10,\\quad\\overrightarrow{\\text{AB}}\\cdot\\overrightarrow{\\text{AC}}=1' },
        { text: '面積の公式に代入する。', math: 'S=\\dfrac{1}{2}\\sqrt{5\\times10-1^2}=\\dfrac{7}{2}' },
      ],
      point: '内積を使った面積の公式は、平面でも空間でも同じ形で使える。',
      pitfall: '内積を2乗し忘れない。$(\\overrightarrow{\\text{AB}}\\cdot\\overrightarrow{\\text{AC}})^2$。',
    },
    {
      id: 'mx-vector-07', unit: 'vector', level: 'standard', pattern: 'minimum', minutes: 5,
      text: '$|\\vec{a}|=3$、$|\\vec{b}|=4$、$|\\vec{a}-\\vec{b}|=\\sqrt{13}$ のとき、内積 $\\vec{a}\\cdot\\vec{b}$ と、$\\vec{a},\\ \\vec{b}$ がつくる三角形の面積を求めなさい。',
      parts: [{ answer: '\\vec{a}\\cdot\\vec{b}=[ア],\\quad\\text{面積}\\ [イ]\\sqrt{[ウ]}' }],
      boxes: { ア: 6, イ: 3, ウ: 3 },
      hints: [
        '$|\\vec{a}-\\vec{b}|^2=|\\vec{a}|^2-2\\vec{a}\\cdot\\vec{b}+|\\vec{b}|^2$ から内積を求める。',
        '面積 $S=\\dfrac12\\sqrt{|\\vec{a}|^2|\\vec{b}|^2-(\\vec{a}\\cdot\\vec{b})^2}$。',
      ],
      solution: [
        { text: '内積。', math: '13=9-2\\vec{a}\\cdot\\vec{b}+16,\\quad\\vec{a}\\cdot\\vec{b}=6' },
        { text: '面積。', math: 'S=\\dfrac{1}{2}\\sqrt{9\\times16-36}=\\dfrac{1}{2}\\sqrt{108}=3\\sqrt{3}' },
      ],
      point: '大きさの条件は2乗して内積の式にする。内積がわかれば面積も求まる。',
      pitfall: '$\\sqrt{108}$ を簡単にするのを忘れない。$\\sqrt{108}=6\\sqrt3$。',
    },
    {
      id: 'mx-vector-08', unit: 'vector', level: 'standard', pattern: 'minimum', minutes: 6,
      text: '$\\vec{a}=(2,\\ 1)$、$\\vec{b}=(1,\\ -1)$ とする。実数 $t$ を動かすとき、$|\\vec{a}+t\\vec{b}|$ の最小値と、そのときの $t$ の値を求めなさい。',
      parts: [{ answer: 't=\\dfrac{[ア]}{[イ]},\\quad\\text{最小値}\\ \\dfrac{[ウ]\\sqrt{[エ]}}{[オ]}' }],
      boxes: { ア: -1, イ: 2, ウ: 3, エ: 2, オ: 2 },
      hints: [
        '$|\\vec{a}+t\\vec{b}|^2$ を $t$ の2次式で表す。',
        '平方完成して、最小となる $t$ と最小値を求め、最後に平方根をとる。',
      ],
      solution: [
        { text: '2乗して展開する。', math: '|\\vec{a}+t\\vec{b}|^2=|\\vec{a}|^2+2t\\,\\vec{a}\\cdot\\vec{b}+t^2|\\vec{b}|^2=5+2t+2t^2' },
        { text: '平方完成する。', math: '2\\left(t+\\dfrac{1}{2}\\right)^2+\\dfrac{9}{2}' },
        { text: '$t=-\\dfrac12$ で最小。', math: '\\sqrt{\\dfrac{9}{2}}=\\dfrac{3\\sqrt{2}}{2}' },
      ],
      point: 'ベクトルの大きさの最小は、2乗して2次関数の最小値にもちこむ。',
      pitfall: '最小値 $\\dfrac92$ で止めない。求めるのは2乗する前の大きさ。',
    },

    // ── 式と曲線 ──
    {
      id: 'mx-curveC-01', unit: 'curveC', level: 'basic', pattern: 'parabola', minutes: 2,
      text: '放物線 $y^2=8x$ の焦点の座標と準線の方程式を求めなさい。',
      parts: [{ answer: '\\text{焦点}\\ ([ア],\\ 0),\\quad\\text{準線}\\ x=[イ]' }],
      boxes: { ア: 2, イ: -2 },
      hints: [
        '放物線 $y^2=4px$ の焦点は $(p,\\ 0)$、準線は $x=-p$。',
        '$4p=8$ から $p$ を求める。',
      ],
      solution: [
        { text: '$4p=8$ より $p=2$。' },
        { text: '焦点 $(2,\\ 0)$、準線 $x=-2$。' },
      ],
      point: '放物線は「焦点からの距離＝準線からの距離」となる点の集まり。',
      pitfall: '焦点を $(8,\\ 0)$ としない。$4p=8$ なので $p=2$。',
    },
    {
      id: 'mx-curveC-02', unit: 'curveC', level: 'basic', pattern: 'ellipse', minutes: 3,
      text: '楕円 $\\dfrac{x^2}{25}+\\dfrac{y^2}{9}=1$ の焦点の座標と、長軸の長さを求めなさい。',
      parts: [{ answer: '\\text{焦点}\\ (\\pm[ア],\\ 0),\\quad\\text{長軸}\\ [イ]' }],
      boxes: { ア: 4, イ: 10 },
      hints: [
        '$\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1\\ (a>b>0)$ の焦点は $(\\pm\\sqrt{a^2-b^2},\\ 0)$。',
        '長軸の長さは $2a$。',
      ],
      solution: [
        { text: '$a=5,\\ b=3$。', math: '\\sqrt{25-9}=4' },
        { text: '焦点 $(\\pm4,\\ 0)$、長軸の長さ $2\\times5=10$。' },
      ],
      point: '楕円の焦点は $\\sqrt{a^2-b^2}$、双曲線の焦点は $\\sqrt{a^2+b^2}$。',
      pitfall: '楕円で $\\sqrt{a^2+b^2}$ としない。それは双曲線の焦点。',
    },
    {
      id: 'mx-curveC-03', unit: 'curveC', level: 'basic', pattern: 'complex', minutes: 2,
      text: '複素数 $z=1+\\sqrt{3}i$ の絶対値と偏角（$0\\leqq\\arg z<2\\pi$）を求めなさい。',
      parts: [{ answer: '|z|=[ア],\\quad\\arg z=\\dfrac{\\pi}{[イ]}' }],
      boxes: { ア: 2, イ: 3 },
      hints: [
        '絶対値は $\\sqrt{(\\text{実部})^2+(\\text{虚部})^2}$。',
        '極形式 $z=r(\\cos\\theta+i\\sin\\theta)$ で、$\\cos\\theta=\\dfrac12$、$\\sin\\theta=\\dfrac{\\sqrt3}{2}$。',
      ],
      solution: [
        { text: '絶対値。', math: '|z|=\\sqrt{1+3}=2' },
        { text: '$z=2\\left(\\dfrac12+\\dfrac{\\sqrt3}{2}i\\right)$ より', math: '\\arg z=\\dfrac{\\pi}{3}' },
      ],
      point: '極形式は、絶対値でくくってから $\\cos,\\ \\sin$ の値を読む。',
      pitfall: '偏角を $\\dfrac{\\pi}{6}$ としない。実部が $\\cos$、虚部が $\\sin$。',
    },
    {
      id: 'mx-curveC-04', unit: 'curveC', level: 'basic', pattern: 'complex', minutes: 3,
      text: '$(1+i)^8$ を計算しなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 16 },
      hints: [
        '$1+i$ を極形式で表す：$\\sqrt2\\left(\\cos\\dfrac{\\pi}{4}+i\\sin\\dfrac{\\pi}{4}\\right)$。',
        'ド・モアブルの定理：$\\{r(\\cos\\theta+i\\sin\\theta)\\}^n=r^n(\\cos n\\theta+i\\sin n\\theta)$。',
      ],
      solution: [
        { text: 'ド・モアブルの定理より', math: '(\\sqrt{2})^8(\\cos2\\pi+i\\sin2\\pi)' },
        { text: '計算する。', math: '16\\times1=16' },
      ],
      point: '複素数の累乗は、極形式にしてド・モアブルの定理を使う。',
      pitfall: '$(\\sqrt2)^8$ を $8$ としない。$(\\sqrt2)^8=2^4=16$。',
    },
    {
      id: 'mx-curveC-05', unit: 'curveC', level: 'standard', pattern: 'ellipse', minutes: 4,
      text: '双曲線 $\\dfrac{x^2}{16}-\\dfrac{y^2}{9}=1$ の焦点の座標と漸近線の方程式を求めなさい。',
      parts: [{ answer: '\\text{焦点}\\ (\\pm[ア],\\ 0),\\quad\\text{漸近線}\\ y=\\pm\\dfrac{[イ]}{[ウ]}x' }],
      boxes: { ア: 5, イ: 3, ウ: 4 },
      hints: [
        '$\\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2}=1$ の焦点は $(\\pm\\sqrt{a^2+b^2},\\ 0)$。',
        '漸近線は $y=\\pm\\dfrac{b}{a}x$。',
      ],
      solution: [
        { text: '$a=4,\\ b=3$。', math: '\\sqrt{16+9}=5' },
        { text: '焦点 $(\\pm5,\\ 0)$、漸近線 $y=\\pm\\dfrac34x$。' },
      ],
      point: '双曲線の漸近線は、右辺の1を0にした式 $\\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2}=0$ から出てくる。',
      pitfall: '漸近線を $y=\\pm\\dfrac43x$ としない。傾きは $\\dfrac{b}{a}$。',
    },
    {
      id: 'mx-curveC-06', unit: 'curveC', level: 'standard', pattern: 'polar', minutes: 4,
      text: '極方程式 $r=4\\cos\\theta$ が表す図形を、直交座標で答えなさい。',
      parts: [{ answer: '\\text{中心}\\ ([ア],\\ [イ]),\\ \\text{半径}\\ [ウ]\\ \\text{の円}' }],
      boxes: { ア: 2, イ: 0, ウ: 2 },
      hints: [
        '両辺に $r$ をかけると $r^2=4r\\cos\\theta$。',
        '$r^2=x^2+y^2$、$r\\cos\\theta=x$ を使う。',
      ],
      solution: [
        { text: '直交座標に直す。', math: 'x^2+y^2=4x' },
        { text: '平方完成する。', math: '(x-2)^2+y^2=4' },
      ],
      point: '極方程式は、$r^2,\\ r\\cos\\theta,\\ r\\sin\\theta$ が出るように変形してから $x,\\ y$ に直す。',
      pitfall: '両辺を $r$ でわって $1=4\\cos\\theta/r$ のような形にしない。$r$ をかけて直す。',
    },
    {
      id: 'mx-curveC-07', unit: 'curveC', level: 'standard', pattern: 'complex', minutes: 6,
      text: '方程式 $z^3=8i$ について答えなさい。',
      parts: [
        { q: '解のうち、実部が正であるもの', answer: 'z=\\sqrt{[ア]}+[イ]i' },
        { q: '3つの解を複素数平面上の点とするとき、それらを頂点とする三角形の面積', answer: '[ウ]\\sqrt{[エ]}' },
      ],
      boxes: { ア: 3, イ: 1, ウ: 3, エ: 3 },
      hints: [
        '$z=r(\\cos\\theta+i\\sin\\theta)$ とおき、$8i=8\\left(\\cos\\dfrac{\\pi}{2}+i\\sin\\dfrac{\\pi}{2}\\right)$ と比べる。',
        '3つの解は、原点を中心とする半径2の円周上に、等間隔に並ぶ（正三角形）。',
      ],
      solution: [
        { text: '$r^3=8$、$3\\theta=\\dfrac{\\pi}{2}+2k\\pi$ より $r=2$、$\\theta=\\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6},\\ \\dfrac{3\\pi}{2}$。' },
        { text: '実部が正なのは $\\theta=\\dfrac{\\pi}{6}$ のとき。', math: 'z=2\\left(\\dfrac{\\sqrt{3}}{2}+\\dfrac{1}{2}i\\right)=\\sqrt{3}+i' },
        { text: '3点は半径2の円に内接する正三角形で、1辺は $2\\sqrt3$。', math: '\\dfrac{\\sqrt{3}}{4}\\times(2\\sqrt{3})^2=3\\sqrt{3}' },
      ],
      point: '$z^n=w$ の解は、極形式で「絶対値の $n$ 乗根」「偏角を $n$ 等分（$2\\pi$ ずつずらす）」で求める。',
      pitfall: '偏角を $\\dfrac{\\pi}{6}$ の1つだけにしない。$2k\\pi$ を加えた3つがある。',
    },
    {
      id: 'mx-curveC-08', unit: 'curveC', level: 'standard', pattern: 'geometry', minutes: 7,
      text: '複素数平面上で、3点 $0,\\ \\alpha=2+i,\\ \\beta$ が正三角形の頂点になっている。$\\beta$ の虚部が正のとき、$\\beta$ を求めなさい。',
      parts: [{ answer: '\\beta=\\dfrac{[ア]-\\sqrt{[イ]}}{[ウ]}+\\dfrac{[エ]+[オ]\\sqrt{[カ]}}{[キ]}i' }],
      boxes: { ア: 2, イ: 3, ウ: 2, エ: 1, オ: 2, カ: 3, キ: 2 },
      hints: [
        '$\\beta$ は、$\\alpha$ を原点のまわりに $\\pm\\dfrac{\\pi}{3}$ 回転した点。',
        '$\\dfrac{\\pi}{3}$ 回転は $\\cos\\dfrac{\\pi}{3}+i\\sin\\dfrac{\\pi}{3}=\\dfrac12+\\dfrac{\\sqrt3}{2}i$ をかける。どちらの回転で虚部が正になるかを確かめる。',
      ],
      solution: [
        { text: '$\\dfrac{\\pi}{3}$ 回転する。', math: '(2+i)\\left(\\dfrac{1}{2}+\\dfrac{\\sqrt{3}}{2}i\\right)=1+\\sqrt{3}i+\\dfrac{1}{2}i-\\dfrac{\\sqrt{3}}{2}' },
        { text: '整理する。虚部 $\\sqrt3+\\dfrac12>0$ なので条件に合う。', math: '\\beta=\\dfrac{2-\\sqrt{3}}{2}+\\dfrac{1+2\\sqrt{3}}{2}i' },
        { text: '$-\\dfrac{\\pi}{3}$ 回転では虚部が $\\dfrac12-\\sqrt3<0$ になるので合わない。' },
      ],
      point: '複素数平面での回転は、絶対値1の複素数をかけること。正三角形は $\\pm60^\\circ$ の回転でつくれる。',
      pitfall: '回転の向きを1つだけにしない。2つの候補から、条件（虚部が正）に合う方を選ぶ。',
    },
  ],
}
