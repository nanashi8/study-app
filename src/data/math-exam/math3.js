// 入試演習（大学入試）：数学IIIの単元。問題の形は src/lib/mathExam.js の冒頭を参照。

export const MATH_EXAM_MATH3 = {
  patterns: {
    limit: [
      { id: 'sequence', title: '数列の極限' },
      { id: 'series', title: '無限等比級数' },
      { id: 'function', title: '関数の極限' },
      { id: 'continuity', title: '極限と係数決定・連続性' },
    ],
    diff3: [
      { id: 'rules', title: '積・商・合成関数の微分' },
      { id: 'special', title: '三角・指数・対数関数の微分' },
      { id: 'tangent', title: '接線と法線' },
      { id: 'graph', title: '増減・凹凸とグラフ' },
      { id: 'apply', title: '最大・最小への応用' },
    ],
    integ3: [
      { id: 'substitution', title: '置換積分' },
      { id: 'parts', title: '部分積分' },
      { id: 'special', title: '三角・分数関数の積分' },
      { id: 'area', title: '面積' },
      { id: 'volume', title: '回転体の体積' },
    ],
  },
  problems: [
    // ── 極限 ──
    {
      id: 'mx-limit-01', unit: 'limit', level: 'basic', pattern: 'sequence', minutes: 2,
      text: '極限 $\\displaystyle\\lim_{n\\to\\infty}\\dfrac{3n^2+2n}{n^2-1}$ を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 3 },
      hints: [
        '分母の最高次の項 $n^2$ で、分母と分子をわる。',
        '$\\dfrac{1}{n}\\to0$、$\\dfrac{1}{n^2}\\to0$ を使う。',
      ],
      solution: [
        { text: '分母・分子を $n^2$ でわる。', math: '\\lim_{n\\to\\infty}\\dfrac{3+\\dfrac{2}{n}}{1-\\dfrac{1}{n^2}}' },
        { text: '極限をとる。', math: '\\dfrac{3+0}{1-0}=3' },
      ],
      point: '分数式の極限は、分母の最高次の項で分母・分子をわる。',
      pitfall: '「$\\dfrac{\\infty}{\\infty}=1$」としない。最高次の係数の比で決まる。',
    },
    {
      id: 'mx-limit-02', unit: 'limit', level: 'basic', pattern: 'series', minutes: 2,
      text: '無限等比級数 $\\displaystyle\\sum_{n=1}^{\\infty}3\\left(-\\dfrac{1}{2}\\right)^{n-1}$ の和を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 2 },
      hints: [
        '初項 $a$、公比 $r$ の無限等比級数は、$|r|<1$ のとき収束し、和は $\\dfrac{a}{1-r}$。',
        '初項 $3$、公比 $-\\dfrac12$。',
      ],
      solution: [
        { text: '初項は $n=1$ のときの $3$、公比は $-\\dfrac12$。$|r|=\\dfrac12<1$ なので収束する。' },
        { text: '和の公式に代入する。', math: '\\dfrac{3}{1-\\left(-\\dfrac{1}{2}\\right)}=\\dfrac{3}{\\dfrac{3}{2}}=2' },
      ],
      point: '無限等比級数は、まず $|r|<1$ を確かめてから和の公式を使う。',
      pitfall: '分母を $1-\\dfrac12$ としない。公比は $-\\dfrac12$。',
    },
    {
      id: 'mx-limit-03', unit: 'limit', level: 'basic', pattern: 'function', minutes: 3,
      text: '次の極限を求めなさい。',
      parts: [
        { q: '$\\displaystyle\\lim_{x\\to2}\\dfrac{x^2-4}{x-2}$', answer: '[ア]' },
        { q: '$\\displaystyle\\lim_{x\\to0}\\dfrac{\\sin3x}{x}$', answer: '[イ]' },
      ],
      boxes: { ア: 4, イ: 3 },
      hints: [
        '(1) 分子を因数分解して、$x-2$ で約分する。',
        '(2) $\\displaystyle\\lim_{\\theta\\to0}\\dfrac{\\sin\\theta}{\\theta}=1$ を使う形にする。',
      ],
      solution: [
        { text: '(1)', math: '\\lim_{x\\to2}\\dfrac{(x-2)(x+2)}{x-2}=\\lim_{x\\to2}(x+2)=4' },
        { text: '(2)', math: '\\lim_{x\\to0}\\dfrac{\\sin3x}{3x}\\times3=1\\times3=3' },
      ],
      point: '$\\dfrac00$ の形は、約分や公式の形への変形で極限を求める。',
      pitfall: '(2) を $\\dfrac{\\sin3x}{x}\\to1$ としない。角が $3x$ なので分母も $3x$ にそろえる。',
    },
    {
      id: 'mx-limit-04', unit: 'limit', level: 'basic', pattern: 'sequence', minutes: 3,
      text: '極限 $\\displaystyle\\lim_{n\\to\\infty}(\\sqrt{n^2+4n}-n)$ を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 2 },
      hints: [
        '$\\infty-\\infty$ の形なので、分子の有理化をする：$\\dfrac{(\\sqrt{n^2+4n}-n)(\\sqrt{n^2+4n}+n)}{\\sqrt{n^2+4n}+n}$。',
        '分母・分子を $n$ でわる。',
      ],
      solution: [
        { text: '有理化する。', math: '\\dfrac{4n}{\\sqrt{n^2+4n}+n}' },
        { text: '$n$ でわって極限をとる。', math: '\\dfrac{4}{\\sqrt{1+\\dfrac{4}{n}}+1}\\to\\dfrac{4}{2}=2' },
      ],
      point: '根号をふくむ $\\infty-\\infty$ は、有理化して $\\dfrac{\\infty}{\\infty}$ の形に直す。',
      pitfall: '$\\sqrt{n^2+4n}\\fallingdotseq n$ として $0$ としない。差は有理化しないとわからない。',
    },
    {
      id: 'mx-limit-05', unit: 'limit', level: 'standard', pattern: 'series', minutes: 5,
      text: '無限等比級数 $\\displaystyle\\sum_{n=0}^{\\infty}(x-1)^n$ が収束するような $x$ の値の範囲と、そのときの和を求めなさい。',
      parts: [
        { q: '収束する範囲', answer: '[ア]<x<[イ]' },
        { q: 'そのときの和', answer: '\\dfrac{1}{[ウ]-x}' },
      ],
      boxes: { ア: 0, イ: 2, ウ: 2 },
      hints: [
        '初項 $1$、公比 $x-1$ の無限等比級数。収束の条件は $|x-1|<1$。',
        '和は $\\dfrac{1}{1-(x-1)}$。',
      ],
      solution: [
        { text: '$|x-1|<1$ より', math: '0<x<2' },
        { text: '和は', math: '\\dfrac{1}{1-(x-1)}=\\dfrac{1}{2-x}' },
      ],
      point: '初項が $0$ でない無限等比級数は、$|$公比$|<1$ で収束する。',
      pitfall: '$|x-1|\\leqq1$ と等号をふくめない。$|r|=1$ では収束しない。',
    },
    {
      id: 'mx-limit-06', unit: 'limit', level: 'standard', pattern: 'continuity', minutes: 6,
      text: '等式 $\\displaystyle\\lim_{x\\to1}\\dfrac{a\\sqrt{x+3}-b}{x-1}=1$ が成り立つように、定数 $a,\\ b$ の値を定めなさい。',
      parts: [{ answer: 'a=[ア],\\quad b=[イ]' }],
      boxes: { ア: 4, イ: 8 },
      hints: [
        '分母 $\\to0$ で極限が有限なので、分子も $\\to0$：$2a-b=0$。',
        '$b=2a$ を代入して分子を有理化し、極限を $a$ で表す。',
      ],
      solution: [
        { text: '分子 $\\to0$ より $b=2a$。', math: '\\dfrac{a(\\sqrt{x+3}-2)}{x-1}=\\dfrac{a(x-1)}{(x-1)(\\sqrt{x+3}+2)}' },
        { text: '極限をとる。', math: '\\lim_{x\\to1}\\dfrac{a}{\\sqrt{x+3}+2}=\\dfrac{a}{4}=1' },
        { text: 'よって $a=4,\\ b=8$。' },
      ],
      point: '「分母 $\\to0$ で極限が有限」なら「分子 $\\to0$」が必要条件。まずこれで文字を減らす。',
      pitfall: '必要条件 $b=2a$ だけで終わらない。極限の値の条件でもう1つの式をつくる。',
    },
    {
      id: 'mx-limit-07', unit: 'limit', level: 'standard', pattern: 'sequence', minutes: 5,
      text: '$a_1=1,\\ a_{n+1}=\\dfrac12a_n+3$ で定められる数列 $\\{a_n\\}$ の極限 $\\displaystyle\\lim_{n\\to\\infty}a_n$ を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 6 },
      hints: [
        '$\\alpha=\\dfrac12\\alpha+3$ を満たす $\\alpha$ を求め、$a_{n+1}-\\alpha=\\dfrac12(a_n-\\alpha)$ と変形する。',
        '$a_n-\\alpha=(a_1-\\alpha)\\left(\\dfrac12\\right)^{n-1}\\to0$。',
      ],
      solution: [
        { text: '$\\alpha=6$。', math: 'a_{n+1}-6=\\dfrac{1}{2}(a_n-6)' },
        { text: '一般項。', math: 'a_n=6-5\\left(\\dfrac{1}{2}\\right)^{n-1}\\to6' },
      ],
      point: '漸化式の極限は、一般項を求めてから極限をとる（特性方程式の解が極限の候補）。',
      pitfall: '「極限を $\\alpha$ とおいて $\\alpha=\\dfrac12\\alpha+3$」だけで答えにしない。収束することを一般項で確かめる。',
    },
    {
      id: 'mx-limit-08', unit: 'limit', level: 'standard', pattern: 'continuity', minutes: 5,
      text: '関数 $f(x)=\\begin{cases}\\dfrac{x^2+ax+b}{x-2}&(x\\neq2)\\\\5&(x=2)\\end{cases}$ が $x=2$ で連続となるように、定数 $a,\\ b$ の値を定めなさい。',
      parts: [{ answer: 'a=[ア],\\quad b=[イ]' }],
      boxes: { ア: 1, イ: -6 },
      hints: [
        '連続 ⇔ $\\displaystyle\\lim_{x\\to2}f(x)=f(2)=5$。分母 $\\to0$ なので分子も $\\to0$：$4+2a+b=0$。',
        '$b=-2a-4$ を代入すると、分子は $(x-2)(x+a+2)$ と因数分解できる。',
      ],
      solution: [
        { text: '分子 $\\to0$ より $b=-2a-4$。', math: 'x^2+ax-2a-4=(x-2)(x+a+2)' },
        { text: '極限は', math: '\\lim_{x\\to2}(x+a+2)=a+4=5' },
        { text: 'よって $a=1,\\ b=-6$。' },
      ],
      point: '連続の条件は「極限値＝関数の値」。分母が0になる点では、まず分子も0になる条件を使う。',
      pitfall: '$f(2)=5$ を分数の式に代入しない。$x=2$ では分数の式は定義されていない。',
    },

    // ── 微分法（III）──
    {
      id: 'mx-diff3-01', unit: 'diff3', level: 'basic', pattern: 'rules', minutes: 3,
      text: '次の関数の、$x=0$ における微分係数を求めなさい。',
      parts: [
        { q: '$y=(2x+1)^3$', answer: '[ア]' },
        { q: '$y=\\dfrac{x}{x^2+1}$', answer: '[イ]' },
      ],
      boxes: { ア: 6, イ: 1 },
      hints: [
        '(1) 合成関数の微分：$\\{f(g(x))\\}\'=f\'(g(x))g\'(x)$。',
        '(2) 商の微分：$\\left(\\dfrac{u}{v}\\right)\'=\\dfrac{u\'v-uv\'}{v^2}$。',
      ],
      solution: [
        { text: '(1)', math: "y'=3(2x+1)^2\\times2=6(2x+1)^2,\\quad y'(0)=6" },
        { text: '(2)', math: "y'=\\dfrac{(x^2+1)-x\\cdot2x}{(x^2+1)^2}=\\dfrac{1-x^2}{(x^2+1)^2},\\quad y'(0)=1" },
      ],
      point: '合成関数は「外側の微分×内側の微分」。商の微分は分子の順番に注意。',
      pitfall: '(1) で内側の微分 $2$ をかけ忘れて $3$ としない。',
    },
    {
      id: 'mx-diff3-02', unit: 'diff3', level: 'basic', pattern: 'special', minutes: 3,
      text: '次の値を求めなさい。',
      parts: [
        { q: '$y=e^{2x}\\sin x$ の $x=0$ における微分係数', answer: '[ア]' },
        { q: '$y=x\\log x$ の $x=e$ における微分係数', answer: '[イ]' },
      ],
      boxes: { ア: 1, イ: 2 },
      hints: [
        '積の微分：$(uv)\'=u\'v+uv\'$。$(e^{2x})\'=2e^{2x}$、$(\\sin x)\'=\\cos x$。',
        '$(\\log x)\'=\\dfrac1x$。',
      ],
      solution: [
        { text: '(1)', math: "y'=2e^{2x}\\sin x+e^{2x}\\cos x,\\quad y'(0)=0+1=1" },
        { text: '(2)', math: "y'=\\log x+x\\cdot\\dfrac{1}{x}=\\log x+1,\\quad y'(e)=1+1=2" },
      ],
      point: '指数・対数・三角関数の導関数と、積の微分の組み合わせ。',
      pitfall: '(1) で $(e^{2x})\'=e^{2x}$ としない。合成関数なので $2$ が出る。',
    },
    {
      id: 'mx-diff3-03', unit: 'diff3', level: 'basic', pattern: 'tangent', minutes: 3,
      text: '曲線 $y=\\sqrt{x}$ 上の点 $(4,\\ 2)$ における接線の方程式を求めなさい。',
      parts: [{ answer: 'y=\\dfrac{1}{[ア]}x+[イ]' }],
      boxes: { ア: 4, イ: 1 },
      hints: [
        '$y=x^{\\frac12}$ として、$y\'=\\dfrac{1}{2\\sqrt{x}}$。',
        '接線は $y-2=y\'(4)(x-4)$。',
      ],
      solution: [
        { text: '傾きは', math: "y'(4)=\\dfrac{1}{2\\sqrt{4}}=\\dfrac{1}{4}" },
        { text: '接線。', math: 'y-2=\\dfrac{1}{4}(x-4),\\quad y=\\dfrac{1}{4}x+1' },
      ],
      point: '累乗根は分数の指数に直して微分する。',
      pitfall: '$(\\sqrt{x})\'=\\dfrac{1}{\\sqrt{x}}$ としない。係数 $\\dfrac12$ がつく。',
    },
    {
      id: 'mx-diff3-04', unit: 'diff3', level: 'basic', pattern: 'graph', minutes: 3,
      text: '曲線 $y=x^3-3x^2$ の変曲点の座標を求めなさい。',
      parts: [{ answer: '([ア],\\ [イ])' }],
      boxes: { ア: 1, イ: -2 },
      hints: [
        '第2次導関数 $y\'\'$ の符号が変わる点が変曲点。',
        '$y\'\'=6x-6$。',
      ],
      solution: [
        { text: '$y\'=3x^2-6x$、$y\'\'=6x-6$。$x=1$ の前後で $y\'\'$ の符号が変わる。' },
        { text: '$x=1$ のとき $y=1-3=-2$。', math: '(1,\\ -2)' },
      ],
      point: '変曲点は「凹凸が入れかわる点」。$y\'\'=0$ で、前後の符号が変わることを確かめる。',
      pitfall: '$y\'=0$ の点（極値）と取りちがえない。変曲点は $y\'\'$ で調べる。',
    },
    {
      id: 'mx-diff3-05', unit: 'diff3', level: 'standard', pattern: 'graph', minutes: 5,
      text: '$0\\leqq x\\leqq\\pi$ で、関数 $f(x)=x+2\\cos x$ が極大となる $x$ と、極小となる $x$ を求めなさい。',
      parts: [
        { q: '極大となる $x$', answer: 'x=\\dfrac{\\pi}{[ア]}' },
        { q: '極小となる $x$', answer: 'x=\\dfrac{[イ]\\pi}{[ウ]}' },
      ],
      boxes: { ア: 6, イ: 5, ウ: 6 },
      hints: [
        '$f\'(x)=1-2\\sin x$。$f\'(x)=0$ となる $x$ を範囲内で求める。',
        '増減表をかき、符号が＋→－なら極大、－→＋なら極小。',
      ],
      solution: [
        { text: '$\\sin x=\\dfrac12$ より $x=\\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6}$。' },
        { text: '$0<x<\\dfrac{\\pi}{6}$ で $f\'>0$、$\\dfrac{\\pi}{6}<x<\\dfrac{5\\pi}{6}$ で $f\'<0$、$\\dfrac{5\\pi}{6}<x<\\pi$ で $f\'>0$。' },
        { text: '極大は $x=\\dfrac{\\pi}{6}$、極小は $x=\\dfrac{5\\pi}{6}$。' },
      ],
      point: '三角関数をふくむ関数の増減は、$f\'(x)$ の符号を単位円で調べる。',
      pitfall: '$f\'(x)=1+2\\sin x$ としない。$(\\cos x)\'=-\\sin x$。',
    },
    {
      id: 'mx-diff3-06', unit: 'diff3', level: 'standard', pattern: 'tangent', minutes: 5,
      text: '次の問いに答えなさい。',
      parts: [
        { q: '曲線 $y=\\log x$ 上の点 $(1,\\ 0)$ における法線の方程式を $y=-x+c$ の形で表したときの $c$', answer: 'c=[ア]' },
        { q: '原点から曲線 $y=e^x$ に引いた接線の、接点の $x$ 座標', answer: 'x=[イ]' },
      ],
      boxes: { ア: 1, イ: 1 },
      hints: [
        '法線は接線に垂直。接線の傾きが $m$ なら、法線の傾きは $-\\dfrac1m$。',
        '接点を $(t,\\ e^t)$ とおくと、接線は $y=e^t(x-t)+e^t$。これが原点を通る条件を立てる。',
      ],
      solution: [
        { text: '(1) $y\'=\\dfrac1x$ より接線の傾きは $1$、法線の傾きは $-1$。', math: 'y=-(x-1)=-x+1' },
        { text: '(2) 原点を通るので', math: '0=e^t(0-t)+e^t=e^t(1-t),\\quad t=1' },
      ],
      point: '曲線外の点からの接線は、接点を文字でおいて通過条件を立てる。',
      pitfall: '(1) で法線と接線を取りちがえない。法線は接点で接線に垂直な直線。',
    },
    {
      id: 'mx-diff3-07', unit: 'diff3', level: 'standard', pattern: 'graph', minutes: 6,
      text: '関数 $y=\\dfrac{x^2+1}{x}$ の極値を求めなさい。',
      parts: [
        { q: '極小値', answer: '[ア]\\quad(x=[イ])' },
        { q: '極大値', answer: '[ウ]\\quad(x=[エ])' },
      ],
      boxes: { ア: 2, イ: 1, ウ: -2, エ: -1 },
      hints: [
        '$y=x+\\dfrac1x$ と分けると微分しやすい。$y\'=1-\\dfrac{1}{x^2}$。',
        '$x=0$ は定義域の外。$x=\\pm1$ の前後で $y\'$ の符号を調べる。',
      ],
      solution: [
        { text: '$y\'=\\dfrac{x^2-1}{x^2}$。$y\'=0$ となるのは $x=\\pm1$。' },
        { text: '$x=-1$ で＋→－（極大値 $-2$）、$x=1$ で－→＋（極小値 $2$）。' },
      ],
      point: '分数関数は、定義されない点（$x=0$）で増減表を区切って調べる。',
      pitfall: '極大値 $-2$ が極小値 $2$ より小さくてもまちがいではない。極値は「その近くで」の最大・最小。',
    },
    {
      id: 'mx-diff3-08', unit: 'diff3', level: 'standard', pattern: 'apply', minutes: 6,
      text: '$0\\leqq x\\leqq2\\pi$ で、関数 $f(x)=x-2\\sin x$ の最小値を求めなさい。',
      parts: [{ answer: '\\dfrac{\\pi}{[ア]}-\\sqrt{[イ]}' }],
      boxes: { ア: 3, イ: 3 },
      hints: [
        '$f\'(x)=1-2\\cos x=0$ となる $x$ を求める。',
        '極小値と、区間の両端 $f(0),\\ f(2\\pi)$ を比べる。',
      ],
      solution: [
        { text: '$\\cos x=\\dfrac12$ より $x=\\dfrac{\\pi}{3},\\ \\dfrac{5\\pi}{3}$。$x=\\dfrac{\\pi}{3}$ で－→＋なので極小。', math: 'f\\left(\\dfrac{\\pi}{3}\\right)=\\dfrac{\\pi}{3}-\\sqrt{3}' },
        { text: '両端は $f(0)=0$、$f(2\\pi)=2\\pi$。$\\dfrac{\\pi}{3}-\\sqrt3<0$ なので、これが最小値。' },
      ],
      point: '区間での最小値は、極小値と端の値を比べる。',
      pitfall: '$f\\left(\\dfrac{\\pi}{3}\\right)$ で $2\\sin\\dfrac{\\pi}{3}=\\sqrt3$ を忘れない。',
    },

    // ── 積分法（III）──
    {
      id: 'mx-integ3-01', unit: 'integ3', level: 'basic', pattern: 'substitution', minutes: 3,
      text: '定積分 $\\displaystyle\\int_0^1x(x^2+1)^3\\,dx$ を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 15, イ: 8 },
      hints: [
        '$t=x^2+1$ とおくと $dt=2x\\,dx$。',
        '積分区間も $t$ に直す：$x=0\\to t=1$、$x=1\\to t=2$。',
      ],
      solution: [
        { text: '置換する。', math: '\\int_1^2t^3\\cdot\\dfrac{1}{2}\\,dt=\\dfrac{1}{2}\\left[\\dfrac{t^4}{4}\\right]_1^2' },
        { text: '計算する。', math: '\\dfrac{1}{8}(16-1)=\\dfrac{15}{8}' },
      ],
      point: '「中身の微分」が外にあるときは置換積分。区間も新しい文字に直す。',
      pitfall: '積分区間を $0$ から $1$ のままにしない。$t$ の区間は $1$ から $2$。',
    },
    {
      id: 'mx-integ3-02', unit: 'integ3', level: 'basic', pattern: 'parts', minutes: 3,
      text: '定積分 $\\displaystyle\\int_0^1xe^x\\,dx$ を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 1 },
      hints: [
        '部分積分：$\\displaystyle\\int f g\'\\,dx=fg-\\int f\'g\\,dx$。$f=x$、$g\'=e^x$ とする。',
        '$\\displaystyle\\int xe^x\\,dx=xe^x-e^x+C$。',
      ],
      solution: [
        { text: '部分積分する。', math: '\\left[xe^x\\right]_0^1-\\int_0^1e^x\\,dx=e-(e-1)' },
        { text: '計算する。', math: '1' },
      ],
      point: '「多項式×指数関数」は、多項式を微分する側にして部分積分する。',
      pitfall: '$f=e^x$、$g\'=x$ と逆に選ばない。積分が複雑になる。',
    },
    {
      id: 'mx-integ3-03', unit: 'integ3', level: 'basic', pattern: 'special', minutes: 3,
      text: '定積分 $\\displaystyle\\int_0^{\\frac{\\pi}{2}}\\sin^2x\\,dx$ を求めなさい。',
      parts: [{ answer: '\\dfrac{\\pi}{[ア]}' }],
      boxes: { ア: 4 },
      hints: [
        '半角の公式 $\\sin^2x=\\dfrac{1-\\cos2x}{2}$ で次数を下げる。',
        '$\\displaystyle\\int\\cos2x\\,dx=\\dfrac12\\sin2x$。',
      ],
      solution: [
        { text: '次数を下げる。', math: '\\int_0^{\\frac{\\pi}{2}}\\dfrac{1-\\cos2x}{2}\\,dx=\\left[\\dfrac{x}{2}-\\dfrac{\\sin2x}{4}\\right]_0^{\\frac{\\pi}{2}}' },
        { text: '計算する。', math: '\\dfrac{\\pi}{4}-0=\\dfrac{\\pi}{4}' },
      ],
      point: '$\\sin^2x,\\ \\cos^2x$ の積分は、半角の公式で1次の三角関数に直す。',
      pitfall: '$\\displaystyle\\int\\sin^2x\\,dx=\\dfrac{\\sin^3x}{3}$ としない。微分すると $\\sin^2x\\cos x$ になり、もとの式にもどらない。',
    },
    {
      id: 'mx-integ3-04', unit: 'integ3', level: 'basic', pattern: 'special', minutes: 2,
      text: '次の定積分を求めなさい。',
      parts: [
        { q: '$\\displaystyle\\int_1^{e^2}\\dfrac{dx}{x}$', answer: '[ア]' },
        { q: '$\\displaystyle\\int_0^1\\dfrac{dx}{x+1}$', answer: '\\log[イ]' },
      ],
      boxes: { ア: 2, イ: 2 },
      hints: [
        '$\\displaystyle\\int\\dfrac{dx}{x}=\\log|x|+C$。',
        '$\\displaystyle\\int\\dfrac{dx}{x+1}=\\log|x+1|+C$。',
      ],
      solution: [
        { text: '(1)', math: '\\left[\\log x\\right]_1^{e^2}=2-0=2' },
        { text: '(2)', math: '\\left[\\log(x+1)\\right]_0^1=\\log2-\\log1=\\log2' },
      ],
      point: '$\\dfrac{1}{x}$ の積分は対数。$\\dfrac{f\'(x)}{f(x)}$ の形は $\\log|f(x)|$。',
      pitfall: '$\\dfrac1x=x^{-1}$ に $\\dfrac{x^{n+1}}{n+1}$ の公式を使わない（$n=-1$ では分母が0）。',
    },
    {
      id: 'mx-integ3-05', unit: 'integ3', level: 'standard', pattern: 'area', minutes: 5,
      text: '次の面積を求めなさい。',
      parts: [
        { q: '曲線 $y=\\sin x\\ (0\\leqq x\\leqq\\pi)$ と $x$ 軸で囲まれた部分', answer: '[ア]' },
        { q: '曲線 $y=\\log x$、$x$ 軸、直線 $x=e$ で囲まれた部分', answer: '[イ]' },
      ],
      boxes: { ア: 2, イ: 1 },
      hints: [
        '(1) $\\displaystyle\\int_0^\\pi\\sin x\\,dx$。',
        '(2) $\\log x$ は $x=1$ で $x$ 軸と交わる。$\\displaystyle\\int_1^e\\log x\\,dx$ は部分積分（$\\log x=1\\cdot\\log x$）。',
      ],
      solution: [
        { text: '(1)', math: '\\left[-\\cos x\\right]_0^\\pi=1-(-1)=2' },
        { text: '(2)', math: '\\left[x\\log x-x\\right]_1^e=(e-e)-(0-1)=1' },
      ],
      point: '$\\log x$ の積分は、$1\\times\\log x$ と見て部分積分する。',
      pitfall: '(2) の区間を $0$ から $e$ としない。$\\log x$ が $x$ 軸と交わるのは $x=1$。',
    },
    {
      id: 'mx-integ3-06', unit: 'integ3', level: 'standard', pattern: 'volume', minutes: 4,
      text: '曲線 $y=\\sqrt{x}\\ (0\\leqq x\\leqq4)$ と $x$ 軸、直線 $x=4$ で囲まれた部分を、$x$ 軸のまわりに1回転させてできる立体の体積を求めなさい。',
      parts: [{ answer: '[ア]\\pi' }],
      boxes: { ア: 8 },
      hints: [
        '$x$ 軸のまわりの回転体の体積は $V=\\pi\\displaystyle\\int_a^by^2\\,dx$。',
        '$y^2=x$。',
      ],
      solution: [
        { text: '体積の公式。', math: 'V=\\pi\\int_0^4x\\,dx=\\pi\\left[\\dfrac{x^2}{2}\\right]_0^4' },
        { text: '計算する。', math: '8\\pi' },
      ],
      point: '回転体の体積は、断面の円の面積 $\\pi y^2$ を積分する。',
      pitfall: '$\\pi\\displaystyle\\int y\\,dx$ としない。断面積なので $y$ を2乗する。',
    },
    {
      id: 'mx-integ3-07', unit: 'integ3', level: 'standard', pattern: 'parts', minutes: 5,
      text: '定積分 $\\displaystyle\\int_0^{\\frac{\\pi}{2}}x\\cos x\\,dx$ を求めなさい。',
      parts: [{ answer: '\\dfrac{\\pi}{[ア]}-[イ]' }],
      boxes: { ア: 2, イ: 1 },
      hints: [
        '部分積分：$x$ を微分する側、$\\cos x$ を積分する側にする。',
        '$\\displaystyle\\int x\\cos x\\,dx=x\\sin x-\\int\\sin x\\,dx$。',
      ],
      solution: [
        { text: '部分積分する。', math: '\\left[x\\sin x\\right]_0^{\\frac{\\pi}{2}}-\\int_0^{\\frac{\\pi}{2}}\\sin x\\,dx=\\dfrac{\\pi}{2}-\\left[-\\cos x\\right]_0^{\\frac{\\pi}{2}}' },
        { text: '計算する。', math: '\\dfrac{\\pi}{2}-(0+1)=\\dfrac{\\pi}{2}-1' },
      ],
      point: '「$x$×三角関数」は、$x$ を微分して消える側にする部分積分。',
      pitfall: '$\\displaystyle\\int\\sin x\\,dx=\\cos x$ と符号をまちがえない。$-\\cos x$。',
    },
    {
      id: 'mx-integ3-08', unit: 'integ3', level: 'standard', pattern: 'volume', minutes: 6,
      text: '放物線 $y=x^2$ と直線 $y=x$ で囲まれた部分を、$x$ 軸のまわりに1回転させてできる立体の体積を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}\\pi' }],
      boxes: { ア: 2, イ: 15 },
      hints: [
        '交点は $x=0,\\ 1$。$0\\leqq x\\leqq1$ では直線が上。',
        '体積は「外側の回転体」－「内側の回転体」：$\\pi\\displaystyle\\int_0^1(x^2-x^4)\\,dx$。',
      ],
      solution: [
        { text: '外側から内側を引く。', math: 'V=\\pi\\int_0^1\\{x^2-(x^2)^2\\}\\,dx=\\pi\\left[\\dfrac{x^3}{3}-\\dfrac{x^5}{5}\\right]_0^1' },
        { text: '計算する。', math: '\\pi\\left(\\dfrac{1}{3}-\\dfrac{1}{5}\\right)=\\dfrac{2}{15}\\pi' },
      ],
      point: '2曲線の間を回転させると、穴のあいた立体になる。断面は円から円を除いた形。',
      pitfall: '$\\pi\\displaystyle\\int_0^1(x-x^2)^2\\,dx$ としない。引いてから2乗するのではなく、それぞれを2乗してから引く。',
    },
  ],
}
