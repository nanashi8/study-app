// 入試演習（大学入試）：数学IIの単元。問題の形は src/lib/mathExam.js の冒頭を参照。

export const MATH_EXAM_MATH2 = {
  patterns: {
    proof: [
      { id: 'binomial', title: '二項定理と係数' },
      { id: 'division', title: '整式の割り算と分数式' },
      { id: 'identity', title: '恒等式と比例式' },
      { id: 'ineq', title: '相加平均と相乗平均' },
    ],
    complex: [
      { id: 'calc', title: '複素数の計算' },
      { id: 'discriminant', title: '判別式と解の種類' },
      { id: 'vieta', title: '解と係数の関係' },
      { id: 'remainder', title: '剰余の定理・因数定理' },
      { id: 'highorder', title: '高次方程式' },
    ],
    coordII: [
      { id: 'line', title: '直線の方程式と点と直線の距離' },
      { id: 'circle', title: '円の方程式' },
      { id: 'tangent', title: '円と直線（接線・弦）' },
      { id: 'locus', title: '軌跡' },
      { id: 'region', title: '領域と最大・最小' },
    ],
    trigfn: [
      { id: 'radian', title: '弧度法とおうぎ形' },
      { id: 'equation', title: '三角関数の方程式・不等式' },
      { id: 'addition', title: '加法定理と2倍角の公式' },
      { id: 'synthesis', title: '三角関数の合成' },
      { id: 'substitution', title: 'おきかえによる最大・最小' },
    ],
    explog: [
      { id: 'exponent', title: '指数法則と累乗根' },
      { id: 'log', title: '対数の計算' },
      { id: 'equation', title: '指数・対数の方程式と不等式' },
      { id: 'compare', title: '数の大小比較' },
      { id: 'digits', title: '常用対数と桁数' },
      { id: 'maxmin', title: 'おきかえによる最大・最小' },
    ],
    diff: [
      { id: 'derivative', title: '導関数と微分係数' },
      { id: 'tangent', title: '接線の方程式' },
      { id: 'extremum', title: '極値と増減' },
      { id: 'maxmin', title: '最大・最小と応用' },
      { id: 'equation', title: '方程式の実数解の個数' },
    ],
    integ: [
      { id: 'indefinite', title: '不定積分' },
      { id: 'definite', title: '定積分の計算' },
      { id: 'area', title: '面積' },
      { id: 'function', title: '定積分で表された関数' },
    ],
  },
  problems: [
    // ── 式と証明 ──
    {
      id: 'mx-proof-01', unit: 'proof', level: 'basic', pattern: 'binomial', minutes: 2,
      text: '$(2x-1)^5$ の展開式における $x^3$ の係数を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 80 },
      hints: [
        '一般項は ${}_5\\mathrm{C}_r(2x)^{5-r}(-1)^r$。',
        '$x^3$ の項は $5-r=3$ のとき。',
      ],
      solution: [
        { text: '$r=2$ のときの項。', math: '{}_5\\mathrm{C}_2(2x)^3(-1)^2=10\\times8x^3' },
        { text: 'よって係数は $80$。' },
      ],
      point: '二項定理の一般項を書き、求める次数になる $r$ を決める。',
      pitfall: '$2x$ の係数 $2$ を3乗し忘れない。$(2x)^3=8x^3$。',
    },
    {
      id: 'mx-proof-02', unit: 'proof', level: 'basic', pattern: 'division', minutes: 3,
      text: '整式 $x^3-2x^2+3x-4$ を $x-2$ で割ったときの商と余りを求めなさい。',
      parts: [{ answer: '\\text{商}\\ x^2+[ア],\\quad\\text{余り}\\ [イ]' }],
      boxes: { ア: 3, イ: 2 },
      hints: [
        '筆算（または組立除法）で割る。次数の高い項から順に消していく。',
        '余りは、割る式 $x-2$ より次数が低い（定数）。',
      ],
      solution: [
        { text: '筆算で割る。$x^3\\div x=x^2$ を商に立て、$(x-2)x^2=x^3-2x^2$ を引くと $3x-4$ が残る（$x$ の項の商は $0$）。' },
        { text: '$3x\\div x=3$ を商に立て、$3(x-2)=3x-6$ を引くと余り $2$。', math: 'x^3-2x^2+3x-4=(x-2)(x^2+3)+2' },
      ],
      point: '割り算の結果は「割られる式＝割る式×商＋余り」の形で確かめられる。',
      pitfall: '$x^2$ の項を消したあと、$x$ の項が $0$ でも商に入れ忘れない。',
    },
    {
      id: 'mx-proof-03', unit: 'proof', level: 'basic', pattern: 'identity', minutes: 3,
      text: '等式 $x^2+3x+1=a(x+1)^2+b(x+1)+c$ が $x$ についての恒等式となるように、定数 $a,\\ b,\\ c$ の値を定めなさい。',
      parts: [{ answer: 'a=[ア],\\quad b=[イ],\\quad c=[ウ]' }],
      boxes: { ア: 1, イ: 1, ウ: -1 },
      hints: [
        '右辺を展開して、両辺の同じ次数の係数を比べる（係数比較法）。',
        '$x=-1,\\ 0,\\ 1$ などを代入して求める方法（数値代入法）もある。',
      ],
      solution: [
        { text: '右辺を展開する。', math: 'ax^2+(2a+b)x+(a+b+c)' },
        { text: '係数を比べる。', math: 'a=1,\\quad2a+b=3,\\quad a+b+c=1' },
        { text: 'よって $a=1,\\ b=1,\\ c=-1$。' },
      ],
      point: '恒等式は「すべての $x$ で成り立つ」ので、係数がすべて一致する。',
      pitfall: '数値代入法を使ったときは、求めた値で本当に恒等式になるかを確かめる。',
    },
    {
      id: 'mx-proof-04', unit: 'proof', level: 'basic', pattern: 'ineq', minutes: 3,
      text: '$x>0$ のとき、$x+\\dfrac{9}{x}$ の最小値と、そのときの $x$ の値を求めなさい。',
      parts: [{ answer: '\\text{最小値}\\ [ア]\\quad(x=[イ])' }],
      boxes: { ア: 6, イ: 3 },
      hints: [
        '相加平均と相乗平均の関係：$a>0,\\ b>0$ のとき $a+b\\geqq2\\sqrt{ab}$。',
        '等号は $a=b$ のとき。$x=\\dfrac9x$ を解く。',
      ],
      solution: [
        { text: '相加平均と相乗平均の関係より', math: 'x+\\dfrac{9}{x}\\geqq2\\sqrt{x\\cdot\\dfrac{9}{x}}=6' },
        { text: '等号は $x=\\dfrac9x$、$x>0$ より $x=3$ のとき。' },
      ],
      point: '積が一定の2つの正の数の和は、2数が等しいとき最小。',
      pitfall: '等号が成り立つ $x$ が実際にあるかを確かめる。等号が成り立たないと最小値ではない。',
    },
    {
      id: 'mx-proof-05', unit: 'proof', level: 'standard', pattern: 'binomial', minutes: 4,
      text: '$\\left(x^2+\\dfrac{2}{x}\\right)^6$ の展開式における定数項を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 240 },
      hints: [
        '一般項は ${}_6\\mathrm{C}_r(x^2)^{6-r}\\left(\\dfrac{2}{x}\\right)^r={}_6\\mathrm{C}_r2^rx^{12-3r}$。',
        '定数項は、$x$ の指数が $0$ になるとき。',
      ],
      solution: [
        { text: '$12-3r=0$ より $r=4$。' },
        { text: '定数項は', math: '{}_6\\mathrm{C}_4\\times2^4=15\\times16=240' },
      ],
      point: '分数をふくむ二項定理は、一般項の $x$ の指数を $r$ で表して条件を立てる。',
      pitfall: '$\\left(\\dfrac2x\\right)^r$ の $2^r$ をかけ忘れない。',
    },
    {
      id: 'mx-proof-06', unit: 'proof', level: 'standard', pattern: 'division', minutes: 4,
      text: '次の式を計算しなさい。',
      math: '\\dfrac{1}{x(x+1)}+\\dfrac{1}{(x+1)(x+2)}',
      parts: [{ answer: '\\dfrac{[ア]}{x(x+[イ])}' }],
      boxes: { ア: 2, イ: 2 },
      hints: [
        '分母を $x(x+1)(x+2)$ にそろえて通分する。',
        '分子を計算したら、分母と約分できる因数がないか確かめる。',
      ],
      solution: [
        { text: '通分する。', math: '\\dfrac{(x+2)+x}{x(x+1)(x+2)}=\\dfrac{2(x+1)}{x(x+1)(x+2)}' },
        { text: '$x+1$ で約分する。', math: '\\dfrac{2}{x(x+2)}' },
      ],
      point: '分数式の和は、通分したあと分子を因数分解して約分するまでが計算。',
      pitfall: '分子の $2x+2$ を $2(x+1)$ とくくらずに終えない。約分できる。',
    },
    {
      id: 'mx-proof-07', unit: 'proof', level: 'standard', pattern: 'ineq', minutes: 5,
      text: '$x>0,\\ y>0,\\ xy=16$ のとき、$x+4y$ の最小値と、そのときの $x,\\ y$ の値を求めなさい。',
      parts: [{ answer: '\\text{最小値}\\ [ア]\\quad(x=[イ],\\ y=[ウ])' }],
      boxes: { ア: 16, イ: 8, ウ: 2 },
      hints: [
        '$x$ と $4y$ に相加平均と相乗平均の関係を使う。積 $x\\cdot4y$ は一定。',
        '等号は $x=4y$ のとき。$xy=16$ と連立する。',
      ],
      solution: [
        { text: '相加平均と相乗平均の関係より', math: 'x+4y\\geqq2\\sqrt{4xy}=2\\sqrt{64}=16' },
        { text: '等号は $x=4y$。$xy=16$ に代入して $4y^2=16$、$y=2$、$x=8$。' },
      ],
      point: '和の最小値は、「積が一定」になる2つに分けて相加・相乗平均を使う。',
      pitfall: '$x+4y\\geqq2\\sqrt{xy}=8$ としない。組み合わせる2数は $x$ と $4y$。',
    },
    {
      id: 'mx-proof-08', unit: 'proof', level: 'standard', pattern: 'identity', minutes: 5,
      text: '$(x+y):(y+z):(z+x)=4:5:6$（ただし $x+y+z\\neq0$）のとき、$x:y:z$ を最も簡単な整数の比で表しなさい。',
      parts: [{ answer: 'x:y:z=[ア]:[イ]:[ウ]' }],
      boxes: { ア: 5, イ: 3, ウ: 7 },
      hints: [
        '比例式は、$x+y=4k,\\ y+z=5k,\\ z+x=6k$ とおく。',
        '3つの式を足すと $x+y+z$ が $k$ で表せる。',
      ],
      solution: [
        { text: '3式を足す。', math: '2(x+y+z)=15k,\\quad x+y+z=\\dfrac{15}{2}k' },
        { text: 'それぞれ引く。', math: 'z=\\dfrac{7}{2}k,\\quad x=\\dfrac{5}{2}k,\\quad y=\\dfrac{3}{2}k' },
        { text: 'よって $x:y:z=5:3:7$。' },
      ],
      point: '比例式は、比の値を $k$ とおいて等式に直すと扱いやすい。',
      pitfall: '$x:y:z=4:5:6$ としない。与えられているのは2つずつの和の比。',
    },

    // ── 複素数と方程式 ──
    {
      id: 'mx-complex-01', unit: 'complex', level: 'basic', pattern: 'calc', minutes: 3,
      text: '次の計算をしなさい。',
      parts: [
        { q: '$(2+3i)(1-i)$', answer: '[ア]+[イ]i' },
        { q: '$\\dfrac{3+i}{1-i}$', answer: '[ウ]+[エ]i' },
      ],
      boxes: { ア: 5, イ: 1, ウ: 1, エ: 2 },
      hints: [
        '$i^2=-1$ として展開する。',
        '分母が $1-i$ のときは、分母と分子に $1+i$（共役な複素数）をかける。',
      ],
      solution: [
        { text: '(1) 展開する。', math: '2-2i+3i-3i^2=2+i+3=5+i' },
        { text: '(2) 分母と分子に $1+i$ をかける。', math: '\\dfrac{(3+i)(1+i)}{(1-i)(1+i)}=\\dfrac{3+4i+i^2}{2}=\\dfrac{2+4i}{2}=1+2i' },
      ],
      point: '複素数の割り算は、分母の共役な複素数をかけて分母を実数にする。',
      pitfall: '$-3i^2$ を $-3$ としない。$i^2=-1$ なので $+3$。',
    },
    {
      id: 'mx-complex-02', unit: 'complex', level: 'basic', pattern: 'vieta', minutes: 3,
      text: '2次方程式 $x^2-3x+5=0$ の2つの解を $\\alpha,\\ \\beta$ とするとき、次の値を求めなさい。',
      parts: [
        { q: '$\\alpha^2+\\beta^2$', answer: '[ア]' },
        { q: '$\\alpha^3+\\beta^3$', answer: '[イ]' },
      ],
      boxes: { ア: -1, イ: -18 },
      hints: [
        '解と係数の関係：$\\alpha+\\beta=3$、$\\alpha\\beta=5$。',
        '$\\alpha^2+\\beta^2=(\\alpha+\\beta)^2-2\\alpha\\beta$、$\\alpha^3+\\beta^3=(\\alpha+\\beta)^3-3\\alpha\\beta(\\alpha+\\beta)$。',
      ],
      solution: [
        { text: '(1)', math: '3^2-2\\times5=-1' },
        { text: '(2)', math: '3^3-3\\times5\\times3=27-45=-18' },
      ],
      point: '解を求めずに、対称式を $\\alpha+\\beta$ と $\\alpha\\beta$ で表して計算する。',
      pitfall: '$\\alpha^2+\\beta^2$ が負になっても誤りではない。解が虚数なので、実数の2乗の和とは限らない。',
    },
    {
      id: 'mx-complex-03', unit: 'complex', level: 'basic', pattern: 'remainder', minutes: 2,
      text: '整式 $P(x)=x^3+ax^2-x+2$ が $x+2$ で割り切れるとき、定数 $a$ の値を求めなさい。',
      parts: [{ answer: 'a=[ア]' }],
      boxes: { ア: 1 },
      hints: [
        '因数定理：$P(x)$ が $x-k$ で割り切れる ⇔ $P(k)=0$。',
        '$x+2=x-(-2)$ なので、$P(-2)=0$。',
      ],
      solution: [
        { text: '$P(-2)=0$ を計算する。', math: '-8+4a+2+2=0' },
        { text: '解く。', math: '4a=4,\\quad a=1' },
      ],
      point: '「割り切れる」は因数定理で、代入するだけで条件になる。',
      pitfall: '$x+2$ で割り切れるとき、$P(2)=0$ としない。代入するのは $x=-2$。',
    },
    {
      id: 'mx-complex-04', unit: 'complex', level: 'basic', pattern: 'discriminant', minutes: 3,
      text: '2次方程式 $x^2+2(k-1)x+k+5=0$ が重解をもつような定数 $k$ の値を求めなさい。値は小さい順に答えなさい。',
      parts: [{ answer: 'k=[ア],\\ [イ]' }],
      boxes: { ア: -1, イ: 4 },
      hints: [
        '重解をもつ ⇔ 判別式 $D=0$。',
        '$x$ の係数が $2(k-1)$ なので、$\\dfrac{D}{4}=(k-1)^2-(k+5)$ が使える。',
      ],
      solution: [
        { text: '$\\dfrac{D}{4}$ を計算する。', math: '(k-1)^2-(k+5)=k^2-3k-4=(k+1)(k-4)' },
        { text: '$\\dfrac{D}{4}=0$ より', math: 'k=-1,\\ 4' },
      ],
      point: '解の種類：$D>0$ で異なる2つの実数解、$D=0$ で重解、$D<0$ で異なる2つの虚数解。',
      pitfall: '$\\dfrac{D}{4}$ の計算で、$(k-1)^2$ を $k^2-1$ としない。',
    },
    {
      id: 'mx-complex-05', unit: 'complex', level: 'standard', pattern: 'remainder', minutes: 5,
      text: '整式 $P(x)$ を $x-1$ で割ると余りが $3$、$x+2$ で割ると余りが $-3$ である。$P(x)$ を $(x-1)(x+2)$ で割ったときの余りを求めなさい。',
      parts: [{ answer: '[ア]x+[イ]' }],
      boxes: { ア: 2, イ: 1 },
      hints: [
        '2次式で割った余りは1次以下なので、$P(x)=(x-1)(x+2)Q(x)+ax+b$ とおける。',
        '剰余の定理より $P(1)=3$、$P(-2)=-3$。',
      ],
      solution: [
        { text: '$x=1,\\ -2$ を代入する。', math: 'a+b=3,\\qquad-2a+b=-3' },
        { text: '解く。', math: 'a=2,\\quad b=1' },
      ],
      point: '割る式の次数より1つ低い次数の余りを文字でおき、割る式が0になる $x$ を代入する。',
      pitfall: '余りを定数とおかない。2次式で割った余りは1次式になりうる。',
    },
    {
      id: 'mx-complex-06', unit: 'complex', level: 'standard', pattern: 'highorder', minutes: 5,
      text: '3次方程式 $x^3-3x^2+4x-2=0$ を解きなさい。',
      parts: [{ answer: 'x=[ア],\\ [イ]\\pm i' }],
      boxes: { ア: 1, イ: 1 },
      hints: [
        '定数項 $-2$ の約数（$\\pm1,\\ \\pm2$）を代入して、解を1つ見つける。',
        '見つけた解 $k$ について $x-k$ で割り、残りの2次方程式を解く。',
      ],
      solution: [
        { text: '$x=1$ を代入すると $1-3+4-2=0$ なので、$x-1$ で割り切れる。', math: 'x^3-3x^2+4x-2=(x-1)(x^2-2x+2)' },
        { text: '$x^2-2x+2=0$ を解く。', math: 'x=1\\pm\\sqrt{1-2}=1\\pm i' },
      ],
      point: '3次方程式は因数定理で1つの解を見つけ、2次方程式にもちこむ。',
      pitfall: '虚数解も解に入れる。$x^2-2x+2=0$ は「解なし」ではない。',
    },
    {
      id: 'mx-complex-07', unit: 'complex', level: 'standard', pattern: 'vieta', minutes: 5,
      text: '2次方程式 $x^2+mx+12=0$ の2つの解の比が $1:3$ であるとき、定数 $m$ の値を求めなさい。',
      parts: [{ answer: 'm=\\pm[ア]' }],
      boxes: { ア: 8 },
      hints: [
        '2つの解を $\\alpha,\\ 3\\alpha$ とおく。',
        '解と係数の関係：$\\alpha+3\\alpha=-m$、$\\alpha\\cdot3\\alpha=12$。',
      ],
      solution: [
        { text: '積から $\\alpha$ を求める。', math: '3\\alpha^2=12,\\quad\\alpha=\\pm2' },
        { text: '和から $m$ を求める。', math: 'm=-4\\alpha=\\mp8' },
        { text: 'よって $m=\\pm8$。' },
      ],
      point: '解どうしの関係が与えられたら、解を1つの文字で表し、解と係数の関係に入れる。',
      pitfall: '$\\alpha=2$ だけで $m=-8$ としない。$\\alpha=-2$ の場合もある。',
    },
    {
      id: 'mx-complex-08', unit: 'complex', level: 'standard', pattern: 'highorder', minutes: 5,
      text: '方程式 $x^3=1$ の虚数解の1つを $\\omega$ とするとき、$\\omega^{100}+\\omega^{50}+1$ の値を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 0 },
      hints: [
        '$\\omega^3=1$ と、$\\omega^2+\\omega+1=0$（$x^3-1=(x-1)(x^2+x+1)$ より）を使う。',
        '指数を3でわった余りで、$\\omega^{100}$ と $\\omega^{50}$ を簡単にする。',
      ],
      solution: [
        { text: '$100=3\\times33+1$、$50=3\\times16+2$ なので', math: '\\omega^{100}=\\omega,\\quad\\omega^{50}=\\omega^2' },
        { text: 'よって', math: '\\omega+\\omega^2+1=0' },
      ],
      point: '$\\omega$ の累乗は、$\\omega^3=1$ で指数を3でわった余りに直す。',
      pitfall: '$\\omega$ を $\\dfrac{-1+\\sqrt3i}{2}$ と具体的に入れて100乗しようとしない。',
    },

    // ── 図形と方程式 ──
    {
      id: 'mx-coordII-01', unit: 'coordII', level: 'basic', pattern: 'line', minutes: 2,
      text: '点 $(2,\\ 1)$ を通り、直線 $3x-y+1=0$ に垂直な直線の方程式を求めなさい。',
      parts: [{ answer: 'x+[ア]y-[イ]=0' }],
      boxes: { ア: 3, イ: 5 },
      hints: [
        '直線 $3x-y+1=0$ の傾きは $3$。垂直な直線の傾きは、積が $-1$ になる値。',
        '傾き $m$ で点 $(x_1,\\ y_1)$ を通る直線は $y-y_1=m(x-x_1)$。',
      ],
      solution: [
        { text: '垂直な直線の傾きは $-\\dfrac13$。', math: 'y-1=-\\dfrac{1}{3}(x-2)' },
        { text: '整理する。', math: 'x+3y-5=0' },
      ],
      point: '2直線が垂直 ⇔ 傾きの積が $-1$。',
      pitfall: '傾きを $-3$ としない。垂直な傾きは逆数に $-$ をつけた $-\\dfrac13$。',
    },
    {
      id: 'mx-coordII-02', unit: 'coordII', level: 'basic', pattern: 'line', minutes: 2,
      text: '点 $(3,\\ 4)$ と直線 $3x+4y-5=0$ の距離を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 4 },
      hints: [
        '点 $(x_1,\\ y_1)$ と直線 $ax+by+c=0$ の距離は $\\dfrac{|ax_1+by_1+c|}{\\sqrt{a^2+b^2}}$。',
        '分母は $\\sqrt{3^2+4^2}$。',
      ],
      solution: [
        { text: '直線の式は $3x+4y-5=0$ と「$=0$」の形になっているので、$a=3,\\ b=4,\\ c=-5$、点は $(3,\\ 4)$。' },
        { text: '公式に代入する。', math: '\\dfrac{|3\\times3+4\\times4-5|}{\\sqrt{9+16}}=\\dfrac{20}{5}=4' },
      ],
      point: '点と直線の距離の公式は、直線の式を「$=0$」の形にしてから使う。',
      pitfall: '分子の絶対値を忘れない。距離は負にならない。',
    },
    {
      id: 'mx-coordII-03', unit: 'coordII', level: 'basic', pattern: 'circle', minutes: 2,
      text: '円 $x^2+y^2-4x+6y-3=0$ の中心の座標と半径を求めなさい。',
      parts: [{ answer: '\\text{中心}\\ ([ア],\\ [イ]),\\quad\\text{半径}\\ [ウ]' }],
      boxes: { ア: 2, イ: -3, ウ: 4 },
      hints: [
        '$x$ の項と $y$ の項をそれぞれ平方完成する。',
        '$(x-a)^2+(y-b)^2=r^2$ の形にすると、中心 $(a,\\ b)$、半径 $r$。',
      ],
      solution: [
        { text: '平方完成する。', math: '(x-2)^2-4+(y+3)^2-9-3=0' },
        { text: '整理する。', math: '(x-2)^2+(y+3)^2=16' },
        { text: '中心 $(2,\\ -3)$、半径 $4$。' },
      ],
      point: '一般形の円は、平方完成で標準形に直して中心と半径を読む。',
      pitfall: '$(y+3)^2$ の中心の $y$ 座標を $+3$ としない。$y-(-3)$ なので $-3$。',
    },
    {
      id: 'mx-coordII-04', unit: 'coordII', level: 'basic', pattern: 'tangent', minutes: 2,
      text: '円 $x^2+y^2=10$ 上の点 $(3,\\ 1)$ における接線の方程式を求めなさい。',
      parts: [{ answer: '[ア]x+y=[イ]' }],
      boxes: { ア: 3, イ: 10 },
      hints: [
        '円 $x^2+y^2=r^2$ 上の点 $(x_1,\\ y_1)$ における接線は $x_1x+y_1y=r^2$。',
        '$x_1=3,\\ y_1=1,\\ r^2=10$ を代入する。',
      ],
      solution: [
        { text: '点 $(3,\\ 1)$ が円周上にあることを確かめる：$3^2+1^2=10$。' },
        { text: '接線の公式に代入する。', math: '3x+1\\cdot y=10' },
      ],
      point: '原点が中心の円の接線は、公式 $x_1x+y_1y=r^2$ で一度に書ける。',
      pitfall: '右辺を半径 $\\sqrt{10}$ としない。右辺は $r^2=10$。',
    },
    {
      id: 'mx-coordII-05', unit: 'coordII', level: 'standard', pattern: 'tangent', minutes: 4,
      text: '円 $x^2+y^2=25$ が直線 $x+2y=5$ から切り取る弦の長さを求めなさい。',
      parts: [{ answer: '[ア]\\sqrt{[イ]}' }],
      boxes: { ア: 4, イ: 5 },
      hints: [
        '円の中心（原点）から直線までの距離 $d$ を求める。',
        '弦の半分の長さは $\\sqrt{r^2-d^2}$（三平方の定理）。',
      ],
      solution: [
        { text: '中心から直線 $x+2y-5=0$ までの距離。', math: 'd=\\dfrac{|-5|}{\\sqrt{1+4}}=\\sqrt{5}' },
        { text: '弦の半分は $\\sqrt{25-5}=2\\sqrt5$。', math: '\\text{弦}=4\\sqrt{5}' },
      ],
      point: '弦の長さは、交点を求めるより「中心からの距離＋三平方の定理」の方が速い。',
      pitfall: '弦の半分 $2\\sqrt5$ を答えにしない。2倍する。',
    },
    {
      id: 'mx-coordII-06', unit: 'coordII', level: 'standard', pattern: 'locus', minutes: 6,
      text: '2点 A$(-2,\\ 0)$、B$(4,\\ 0)$ に対して、PA：PB＝2：1 を満たす点Pの軌跡を求めなさい。',
      parts: [{ answer: '\\text{中心}\\ ([ア],\\ [イ]),\\ \\text{半径}\\ [ウ]\\ \\text{の円}' }],
      boxes: { ア: 6, イ: 0, ウ: 4 },
      hints: [
        'P$(x,\\ y)$ とおき、PA$=2$PB の両辺を2乗した式をつくる。',
        '展開して整理し、円の方程式の標準形にする。',
      ],
      solution: [
        { text: 'PA$^2=4$PB$^2$ より', math: '(x+2)^2+y^2=4\\{(x-4)^2+y^2\\}' },
        { text: '整理する。', math: '3x^2-36x+3y^2+60=0,\\quad x^2-12x+y^2+20=0' },
        { text: '平方完成する。', math: '(x-6)^2+y^2=16' },
      ],
      point: '2点からの距離の比が一定（1：1でない）の点の軌跡は円（アポロニウスの円）。',
      pitfall: '距離の式を2乗せずに扱わない。根号が残ると整理できない。',
    },
    {
      id: 'mx-coordII-07', unit: 'coordII', level: 'standard', pattern: 'region', minutes: 6,
      text: '図の色のついた部分は、連立不等式 $x\\geqq0,\\ y\\geqq0,\\ x+2y\\leqq8,\\ 3x+y\\leqq9$ の表す領域である（境界をふくむ）。点 $(x,\\ y)$ がこの領域を動くとき、$x+y$ の最大値と、そのときの $x,\\ y$ の値を求めなさい。',
      figure: {
        label: 'x≧0、y≧0、x+2y≦8、3x+y≦9 の表す四角形の領域。頂点は原点、(3,0)、(2,3)、(0,4)',
        size: [280, 250],
        view: [-0.8, 5.5, -0.8, 5.5],
        axes: { x: 'x', y: 'y' },
        points: {},
        polygons: [{ pts: [[0, 0], [3, 0], [2, 3], [0, 4]], fill: true }],
        curves: [
          { fn: (x) => (8 - x) / 2, from: -0.4, to: 5.3, label: 'x+2y=8', at: 4.1 },
          { fn: (x) => 9 - 3 * x, from: 1.2, to: 3.4 },
        ],
        texts: [{ at: [3.55, 1.6], text: '3x+y=9', size: 11 }],
      },
      parts: [{ answer: '\\text{最大値}\\ [ア]\\quad(x=[イ],\\ y=[ウ])' }],
      boxes: { ア: 5, イ: 2, ウ: 3 },
      hints: [
        '$x+y=k$ とおくと、傾き $-1$ の直線。領域と共有点をもつ範囲で、$k$（$y$ 切片）が最大になるときを探す。',
        '最大は領域の頂点で起こる。2直線 $x+2y=8$ と $3x+y=9$ の交点を求める。',
      ],
      solution: [
        { text: '2直線の交点は、連立して', math: 'x=2,\\quad y=3' },
        { text: '頂点での $x+y$ の値：$(0,0)$ で $0$、$(3,0)$ で $3$、$(2,3)$ で $5$、$(0,4)$ で $4$。' },
        { text: '最大値は $5$（$x=2,\\ y=3$）。' },
      ],
      point: '線形の式の最大・最小は、領域の頂点（境界線の交点）で起こる。',
      pitfall: '$y$ 切片の大きい $(0,4)$ で最大と決めつけない。直線 $x+y=k$ の傾きと境界の傾きを比べる。',
    },
    {
      id: 'mx-coordII-08', unit: 'coordII', level: 'standard', pattern: 'circle', minutes: 5,
      text: '3点 $(0,\\ 0)$、$(4,\\ 0)$、$(0,\\ 2)$ を通る円の中心と半径を求めなさい。',
      parts: [{ answer: '\\text{中心}\\ ([ア],\\ [イ]),\\quad\\text{半径}\\ \\sqrt{[ウ]}' }],
      boxes: { ア: 2, イ: 1, ウ: 5 },
      hints: [
        '円の方程式を $x^2+y^2+lx+my+n=0$ とおき、3点を代入する。',
        '原点を通るので $n=0$ がすぐわかる。',
      ],
      solution: [
        { text: '代入する。', math: 'n=0,\\quad16+4l=0,\\quad4+2m=0' },
        { text: '$l=-4,\\ m=-2$。', math: 'x^2+y^2-4x-2y=0,\\quad(x-2)^2+(y-1)^2=5' },
      ],
      point: '3点を通る円は一般形 $x^2+y^2+lx+my+n=0$ に代入して連立する。',
      pitfall: '中心の座標の符号を逆にしない。$(x-2)^2$ なら中心の $x$ 座標は $2$。',
    },

    // ── 三角関数 ──
    {
      id: 'mx-trigfn-01', unit: 'trigfn', level: 'basic', pattern: 'radian', minutes: 2,
      text: '半径 $6$、中心角 $\\dfrac{2}{3}\\pi$ のおうぎ形の弧の長さ $\\ell$ と面積 $S$ を求めなさい。',
      parts: [{ answer: '\\ell=[ア]\\pi,\\quad S=[イ]\\pi' }],
      boxes: { ア: 4, イ: 12 },
      hints: [
        '弧度法では、弧の長さは $\\ell=r\\theta$、面積は $S=\\dfrac12r^2\\theta$。',
        '$r=6,\\ \\theta=\\dfrac23\\pi$ を代入する。',
      ],
      solution: [
        { text: '弧の長さ。', math: '\\ell=6\\times\\dfrac{2}{3}\\pi=4\\pi' },
        { text: '面積。', math: 'S=\\dfrac{1}{2}\\times6^2\\times\\dfrac{2}{3}\\pi=12\\pi' },
      ],
      point: '弧度法の公式 $\\ell=r\\theta$、$S=\\dfrac12r^2\\theta=\\dfrac12r\\ell$ は、度数法の $\\dfrac{\\text{中心角}}{360}$ の計算を一度で済ませる。',
      pitfall: '$\\theta$ に $120$ を代入しない。弧度法の公式には、ラジアンの値を入れる。',
    },
    {
      id: 'mx-trigfn-02', unit: 'trigfn', level: 'basic', pattern: 'addition', minutes: 3,
      text: '$\\sin75^\\circ$ の値を求めなさい。ただし、ア＞イとする。',
      parts: [{ answer: '\\dfrac{\\sqrt{[ア]}+\\sqrt{[イ]}}{[ウ]}' }],
      boxes: { ア: 6, イ: 2, ウ: 4 },
      hints: [
        '$75^\\circ=45^\\circ+30^\\circ$ と分ける。',
        '加法定理 $\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$。',
      ],
      solution: [
        { text: '加法定理を使う。', math: '\\sin45^\\circ\\cos30^\\circ+\\cos45^\\circ\\sin30^\\circ=\\dfrac{\\sqrt{2}}{2}\\cdot\\dfrac{\\sqrt{3}}{2}+\\dfrac{\\sqrt{2}}{2}\\cdot\\dfrac{1}{2}' },
        { text: '計算する。', math: '\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}' },
      ],
      point: '$15^\\circ,\\ 75^\\circ,\\ 105^\\circ$ などは、$30^\\circ,\\ 45^\\circ,\\ 60^\\circ$ の和や差に分けて加法定理を使う。',
      pitfall: '$\\sin75^\\circ=\\sin45^\\circ+\\sin30^\\circ$ としない。$\\sin$ は足し算の中に分配できない。',
    },
    {
      id: 'mx-trigfn-03', unit: 'trigfn', level: 'basic', pattern: 'equation', minutes: 2,
      text: '$0\\leqq\\theta<2\\pi$ のとき、方程式 $2\\sin\\theta=\\sqrt{3}$ を解きなさい。',
      parts: [{ answer: '\\theta=\\dfrac{\\pi}{[ア]},\\ \\dfrac{[イ]\\pi}{[ウ]}' }],
      boxes: { ア: 3, イ: 2, ウ: 3 },
      hints: [
        '$\\sin\\theta=\\dfrac{\\sqrt3}{2}$ となる角を、単位円で探す。',
        '$y$ 座標が $\\dfrac{\\sqrt3}{2}$ になる点は、単位円上に2つある。',
      ],
      solution: [
        { text: '$\\sin\\theta=\\dfrac{\\sqrt{3}}{2}$。' },
        { text: '単位円で $y=\\dfrac{\\sqrt3}{2}$ となる角は', math: '\\theta=\\dfrac{\\pi}{3},\\ \\dfrac{2\\pi}{3}' },
      ],
      point: '三角方程式は、単位円上で条件を満たす点を探し、範囲内の角をすべて答える。',
      pitfall: '$\\dfrac{\\pi}{3}$ だけで終わらない。第2象限の $\\dfrac{2\\pi}{3}$ も $\\sin$ は同じ値。',
    },
    {
      id: 'mx-trigfn-04', unit: 'trigfn', level: 'basic', pattern: 'synthesis', minutes: 2,
      text: '$\\sin\\theta+\\sqrt{3}\\cos\\theta$ を $r\\sin(\\theta+\\alpha)$ の形に表しなさい。ただし $r>0$、$0<\\alpha<\\dfrac{\\pi}{2}$ とする。',
      parts: [{ answer: '[ア]\\sin\\left(\\theta+\\dfrac{\\pi}{[イ]}\\right)' }],
      boxes: { ア: 2, イ: 3 },
      hints: [
        '$a\\sin\\theta+b\\cos\\theta=r\\sin(\\theta+\\alpha)$ で、$r=\\sqrt{a^2+b^2}$。',
        '$\\cos\\alpha=\\dfrac{a}{r}$、$\\sin\\alpha=\\dfrac{b}{r}$ となる $\\alpha$ を求める。',
      ],
      solution: [
        { text: '$r=\\sqrt{1+3}=2$。', math: '\\cos\\alpha=\\dfrac{1}{2},\\quad\\sin\\alpha=\\dfrac{\\sqrt{3}}{2}' },
        { text: '$\\alpha=\\dfrac{\\pi}{3}$ なので', math: '2\\sin\\left(\\theta+\\dfrac{\\pi}{3}\\right)' },
      ],
      point: '合成は、点 $(a,\\ b)$ を座標平面にとり、原点からの距離 $r$ と角 $\\alpha$ を読む。',
      pitfall: '$\\cos\\alpha$ と $\\sin\\alpha$ を逆にして $\\alpha=\\dfrac{\\pi}{6}$ としない。$\\sin\\theta$ の係数が $\\cos\\alpha$ 側。',
    },
    {
      id: 'mx-trigfn-05', unit: 'trigfn', level: 'standard', pattern: 'addition', minutes: 4,
      text: '$\\dfrac{\\pi}{2}<\\alpha<\\pi$ で、$\\sin\\alpha=\\dfrac{3}{5}$ のとき、$\\sin2\\alpha$ と $\\cos2\\alpha$ の値を求めなさい。',
      parts: [{ answer: '\\sin2\\alpha=\\dfrac{[ア]}{[イ]},\\quad\\cos2\\alpha=\\dfrac{[ウ]}{[エ]}' }],
      boxes: { ア: -24, イ: 25, ウ: 7, エ: 25 },
      hints: [
        'まず $\\cos\\alpha$ を求める。$\\alpha$ は第2象限なので $\\cos\\alpha<0$。',
        '2倍角の公式 $\\sin2\\alpha=2\\sin\\alpha\\cos\\alpha$、$\\cos2\\alpha=1-2\\sin^2\\alpha$。',
      ],
      solution: [
        { text: '$\\cos\\alpha=-\\sqrt{1-\\dfrac{9}{25}}=-\\dfrac{4}{5}$。' },
        { text: '$\\sin2\\alpha$。', math: '2\\times\\dfrac{3}{5}\\times\\left(-\\dfrac{4}{5}\\right)=-\\dfrac{24}{25}' },
        { text: '$\\cos2\\alpha$。', math: '1-2\\times\\dfrac{9}{25}=\\dfrac{7}{25}' },
      ],
      point: '2倍角の公式は、$\\sin\\alpha,\\ \\cos\\alpha$ の符号を角の範囲から先に決めて使う。',
      pitfall: '$\\cos\\alpha$ を正の $\\dfrac45$ としない。第2象限では $\\cos$ は負。',
    },
    {
      id: 'mx-trigfn-06', unit: 'trigfn', level: 'standard', pattern: 'synthesis', minutes: 5,
      text: '$0\\leqq\\theta\\leqq\\pi$ のとき、関数 $y=\\sin\\theta+\\sqrt{3}\\cos\\theta$ の最大値と最小値を求めなさい。',
      parts: [
        { q: '最大値とそのときの $\\theta$', answer: '[ア]\\quad\\left(\\theta=\\dfrac{\\pi}{[イ]}\\right)' },
        { q: '最小値', answer: '-\\sqrt{[ウ]}' },
      ],
      boxes: { ア: 2, イ: 6, ウ: 3 },
      hints: [
        '合成すると $y=2\\sin\\left(\\theta+\\dfrac{\\pi}{3}\\right)$。',
        '$\\theta+\\dfrac{\\pi}{3}$ の範囲は $\\dfrac{\\pi}{3}$ から $\\dfrac{4\\pi}{3}$。この範囲での $\\sin$ の最大・最小を単位円で見る。',
      ],
      solution: [
        { text: '合成する。', math: 'y=2\\sin\\left(\\theta+\\dfrac{\\pi}{3}\\right),\\quad\\dfrac{\\pi}{3}\\leqq\\theta+\\dfrac{\\pi}{3}\\leqq\\dfrac{4\\pi}{3}' },
        { text: '$\\theta+\\dfrac{\\pi}{3}=\\dfrac{\\pi}{2}$、すなわち $\\theta=\\dfrac{\\pi}{6}$ のとき最大値 $2$。' },
        { text: '$\\theta+\\dfrac{\\pi}{3}=\\dfrac{4\\pi}{3}$ のとき、$\\sin=-\\dfrac{\\sqrt3}{2}$ で最小値 $-\\sqrt{3}$。' },
      ],
      point: '合成したあとは、かっこの中の角の範囲をつくり直してから最大・最小を考える。',
      pitfall: '最小値を $-2$ としない。$\\theta$ の範囲では、$\\sin$ は $-1$ まで下がらない。',
    },
    {
      id: 'mx-trigfn-07', unit: 'trigfn', level: 'standard', pattern: 'substitution', minutes: 6,
      text: '$0\\leqq\\theta<2\\pi$ のとき、関数 $y=\\cos2\\theta+2\\sin\\theta$ の最大値と最小値を求めなさい。',
      parts: [{ answer: '\\text{最大値}\\ \\dfrac{[ア]}{[イ]},\\quad\\text{最小値}\\ [ウ]' }],
      boxes: { ア: 3, イ: 2, ウ: -3 },
      hints: [
        '$\\cos2\\theta=1-2\\sin^2\\theta$ で、$\\sin\\theta$ だけの式にする。',
        '$\\sin\\theta=t$ とおくと $-1\\leqq t\\leqq1$ の2次関数。',
      ],
      solution: [
        { text: '$t=\\sin\\theta$ とおく。', math: 'y=-2t^2+2t+1=-2\\left(t-\\dfrac{1}{2}\\right)^2+\\dfrac{3}{2}' },
        { text: '$-1\\leqq t\\leqq1$ で、$t=\\dfrac12$ のとき最大値 $\\dfrac32$。' },
        { text: '$t=-1$ のとき最小値。', math: '-2-2+1=-3' },
      ],
      point: '2倍角をふくむ式は、1種類の三角関数にそろえて2次関数にもちこむ。$t$ の範囲を忘れない。',
      pitfall: '$t$ の範囲 $-1\\leqq t\\leqq1$ を考えずに、最小値なしとしない。',
    },
    {
      id: 'mx-trigfn-08', unit: 'trigfn', level: 'standard', pattern: 'equation', minutes: 6,
      text: '$0\\leqq\\theta<2\\pi$ のとき、不等式 $2\\cos^2\\theta-\\cos\\theta-1<0$ を解きなさい。',
      parts: [{ answer: '0<\\theta<\\dfrac{[ア]\\pi}{[イ]},\\quad\\dfrac{[ウ]\\pi}{[エ]}<\\theta<2\\pi' }],
      boxes: { ア: 2, イ: 3, ウ: 4, エ: 3 },
      hints: [
        '$\\cos\\theta=t$ とおいて因数分解する：$(2t+1)(t-1)<0$。',
        '$-\\dfrac12<\\cos\\theta<1$ を満たす $\\theta$ を単位円で読む。$\\cos\\theta=1$ の $\\theta=0$ は入らない。',
      ],
      solution: [
        { text: '因数分解する。', math: '(2\\cos\\theta+1)(\\cos\\theta-1)<0,\\quad-\\dfrac{1}{2}<\\cos\\theta<1' },
        { text: '単位円で $x$ 座標が $-\\dfrac12$ より大きく $1$ より小さい角を読む。', math: '0<\\theta<\\dfrac{2\\pi}{3},\\quad\\dfrac{4\\pi}{3}<\\theta<2\\pi' },
      ],
      point: '三角不等式は、まず $\\cos\\theta$ の範囲を求め、単位円で角の範囲に直す。',
      pitfall: '$\\theta=0$ をふくめない。$\\cos0=1$ で、不等式は $<1$。',
    },

    // ── 指数関数・対数関数 ──
    {
      id: 'mx-explog-01', unit: 'explog', level: 'basic', pattern: 'exponent', minutes: 2,
      text: '次の値を求めなさい。',
      parts: [
        { q: '$\\sqrt[3]{24}\\times\\sqrt[3]{9}$', answer: '[ア]' },
        { q: '$16^{\\frac{3}{4}}$', answer: '[イ]' },
      ],
      boxes: { ア: 6, イ: 8 },
      hints: [
        '累乗根の積は、中身をまとめられる：$\\sqrt[3]{a}\\sqrt[3]{b}=\\sqrt[3]{ab}$。',
        '$16=2^4$ として、指数法則 $(a^m)^n=a^{mn}$。',
      ],
      solution: [
        { text: '(1)', math: '\\sqrt[3]{24\\times9}=\\sqrt[3]{216}=6' },
        { text: '(2)', math: '(2^4)^{\\frac{3}{4}}=2^3=8' },
      ],
      point: '底を素数の累乗で表すと、指数法則で簡単になる。',
      pitfall: '$16^{\\frac34}$ を $16\\times\\dfrac34$ としない。',
    },
    {
      id: 'mx-explog-02', unit: 'explog', level: 'basic', pattern: 'log', minutes: 2,
      text: '次の値を求めなさい。',
      parts: [
        { q: '$\\log_2 12-\\log_2 3$', answer: '[ア]' },
        { q: '$\\log_3 5\\times\\log_5 27$', answer: '[イ]' },
      ],
      boxes: { ア: 2, イ: 3 },
      hints: [
        '$\\log_a M-\\log_a N=\\log_a\\dfrac{M}{N}$。',
        '底の変換公式で、$\\log_5 27=\\dfrac{\\log_3 27}{\\log_3 5}$。',
      ],
      solution: [
        { text: '(1)', math: '\\log_2\\dfrac{12}{3}=\\log_2 4=2' },
        { text: '(2)', math: '\\log_3 5\\times\\dfrac{\\log_3 27}{\\log_3 5}=\\log_3 27=3' },
      ],
      point: '底がちがう対数の積は、底の変換公式で底をそろえる。',
      pitfall: '$\\log_2 12-\\log_2 3=\\log_2 9$ としない。対数の差は、真数の割り算。',
    },
    {
      id: 'mx-explog-03', unit: 'explog', level: 'basic', pattern: 'equation', minutes: 3,
      text: '方程式 $4^x-3\\cdot2^{x+1}+8=0$ を解きなさい。解は小さい順に答えなさい。',
      parts: [{ answer: 'x=[ア],\\ [イ]' }],
      boxes: { ア: 1, イ: 2 },
      hints: [
        '$4^x=(2^x)^2$、$2^{x+1}=2\\cdot2^x$。$2^x=t$ とおく。',
        '$t>0$ に注意して、$t$ の2次方程式を解く。',
      ],
      solution: [
        { text: '$t=2^x$ とおく。', math: 't^2-6t+8=0,\\quad(t-2)(t-4)=0' },
        { text: '$2^x=2,\\ 4$ より', math: 'x=1,\\ 2' },
      ],
      point: '指数方程式は、共通の $a^x$ を $t$ とおいて2次方程式にする（$t>0$）。',
      pitfall: '$3\\cdot2^{x+1}$ を $6^{x+1}$ としない。$3\\cdot2^{x+1}=6\\cdot2^x$。',
    },
    {
      id: 'mx-explog-04', unit: 'explog', level: 'basic', pattern: 'equation', minutes: 3,
      text: '方程式 $\\log_2(x-1)+\\log_2(x+1)=3$ を解きなさい。',
      parts: [{ answer: 'x=[ア]' }],
      boxes: { ア: 3 },
      hints: [
        'まず真数条件：$x-1>0$ かつ $x+1>0$。',
        '左辺を1つの対数にまとめると $\\log_2(x-1)(x+1)=3$。',
      ],
      solution: [
        { text: '真数条件より $x>1$。' },
        { text: 'まとめる。', math: '(x-1)(x+1)=2^3,\\quad x^2=9' },
        { text: '$x>1$ なので $x=3$。' },
      ],
      point: '対数方程式は、はじめに真数条件を書き、最後に解が合うか確かめる。',
      pitfall: '$x=-3$ を答えにふくめない。真数 $x-1$ が負になる。',
    },
    {
      id: 'mx-explog-05', unit: 'explog', level: 'standard', pattern: 'digits', minutes: 5,
      text: '$\\log_{10}2=0.3010$ とする。$2^{50}$ は何桁の整数か。また、最高位の数字を求めなさい。',
      parts: [{ answer: '[ア]\\ \\text{桁},\\quad\\text{最高位の数字}\\ [イ]' }],
      boxes: { ア: 16, イ: 1 },
      hints: [
        '$\\log_{10}2^{50}=50\\log_{10}2$ を計算する。$10^n\\leqq N<10^{n+1}$ なら $N$ は $n+1$ 桁。',
        '最高位の数字は、小数部分 $0.05$ が $\\log_{10}k\\leqq0.05<\\log_{10}(k+1)$ となる $k$ で決まる。',
      ],
      solution: [
        { text: '常用対数をとる。', math: '\\log_{10}2^{50}=50\\times0.3010=15.05' },
        { text: '$10^{15}\\leqq2^{50}<10^{16}$ なので16桁。' },
        { text: '$2^{50}=10^{15}\\times10^{0.05}$ で、$0<0.05<0.3010=\\log_{10}2$ なので $1<10^{0.05}<2$。最高位は $1$。' },
      ],
      point: '桁数は常用対数の整数部分、最高位の数字は小数部分で決まる。',
      pitfall: '$15.05$ から15桁としない。整数部分が15なら16桁。',
    },
    {
      id: 'mx-explog-06', unit: 'explog', level: 'standard', pattern: 'compare', minutes: 5,
      text: '$\\log_{10}2=0.3010$、$\\log_{10}3=0.4771$ とする。3つの数 $2^{30},\\ 3^{20},\\ 10^{9}$ のうち、最も大きいものを⓪〜②から1つ選びなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 1 },
      choices: {
        ア: {
          options: ['$2^{30}$', '$3^{20}$', '$10^{9}$'],
          notes: [
            '$\\log_{10}2^{30}=30\\times0.3010=9.03$。$10^9$ より大きいが、$3^{20}$ の $9.542$ より小さい。',
            '$\\log_{10}3^{20}=20\\times0.4771=9.542$ で、3つの中で最も大きい。',
            '$\\log_{10}10^9=9$ で、3つの中で最も小さい。',
          ],
        },
      },
      hints: [
        '底をそろえにくい数の大小は、常用対数をとって比べる。',
        '対数の底 $10$ は1より大きいので、対数の大小と数の大小は同じ向き。',
      ],
      solution: [
        { text: '常用対数をとる。', math: '\\log_{10}2^{30}=9.03,\\quad\\log_{10}3^{20}=9.542,\\quad\\log_{10}10^9=9' },
        { text: '最も大きいのは $3^{20}$。' },
      ],
      point: '大きな数の大小比較は、常用対数（または指数の底をそろえること）で行う。',
      pitfall: '指数の大きい $2^{30}$ が最大と決めつけない。底も比べる必要がある。',
    },
    {
      id: 'mx-explog-07', unit: 'explog', level: 'standard', pattern: 'equation', minutes: 5,
      text: '不等式 $\\log_{\\frac{1}{2}}(x-2)>\\log_{\\frac{1}{2}}(4-x)$ を解きなさい。',
      parts: [{ answer: '[ア]<x<[イ]' }],
      boxes: { ア: 2, イ: 3 },
      hints: [
        '真数条件：$x-2>0$ かつ $4-x>0$。',
        '底 $\\dfrac12$ は1より小さいので、真数の大小は不等号の向きが逆になる。',
      ],
      solution: [
        { text: '真数条件より $2<x<4$。' },
        { text: '底が1より小さいので、向きが逆になる。', math: 'x-2<4-x,\\quad x<3' },
        { text: '真数条件と合わせて', math: '2<x<3' },
      ],
      point: '対数不等式は「底が1より大きいか小さいか」で、はずしたあとの不等号の向きが決まる。',
      pitfall: '底が $\\dfrac12$ なのに、不等号の向きをそのままにしない。',
    },
    {
      id: 'mx-explog-08', unit: 'explog', level: 'standard', pattern: 'maxmin', minutes: 6,
      text: '$-1\\leqq x\\leqq2$ のとき、関数 $y=4^x-2^{x+2}+5$ の最大値と最小値、およびそのときの $x$ の値を求めなさい。',
      parts: [
        { q: '最大値', answer: '[ア]\\quad(x=[イ])' },
        { q: '最小値', answer: '[ウ]\\quad(x=[エ])' },
      ],
      boxes: { ア: 5, イ: 2, ウ: 1, エ: 1 },
      hints: [
        '$2^x=t$ とおくと、$t$ の範囲は $2^{-1}\\leqq t\\leqq2^2$。',
        '$y=t^2-4t+5=(t-2)^2+1$。$t$ の範囲で最大・最小を調べる。',
      ],
      solution: [
        { text: '$t=2^x$ とおくと $\\dfrac12\\leqq t\\leqq4$。', math: 'y=(t-2)^2+1' },
        { text: '$t=2$、すなわち $x=1$ で最小値 $1$。' },
        { text: '$t=4$（$x=2$）で $y=5$、$t=\\dfrac12$ で $y=\\dfrac{13}{4}$。最大値は $5$（$x=2$）。' },
      ],
      point: 'おきかえたら、新しい文字の範囲を必ず求める。$t=2^x$ は増加関数なので端は端に対応する。',
      pitfall: '$t$ の最大値に対応する $x$ を $4$ としない。$2^x=4$ なので $x=2$。',
    },

    // ── 微分法 ──
    {
      id: 'mx-diff-01', unit: 'diff', level: 'basic', pattern: 'derivative', minutes: 2,
      text: '関数 $f(x)=2x^3-3x^2+4$ について、$f\'(2)$ の値を求めなさい。',
      parts: [{ answer: "f'(2)=[ア]" }],
      boxes: { ア: 12 },
      hints: [
        '$(x^n)\'=nx^{n-1}$ で導関数を求める。',
        '導関数に $x=2$ を代入する。',
      ],
      solution: [
        { text: '導関数を求める。', math: "f'(x)=6x^2-6x" },
        { text: '代入する。', math: "f'(2)=24-12=12" },
      ],
      point: '微分係数は、導関数に値を代入して求める。',
      pitfall: '定数項 $4$ を微分して残さない。定数の微分は $0$。',
    },
    {
      id: 'mx-diff-02', unit: 'diff', level: 'basic', pattern: 'tangent', minutes: 3,
      text: '曲線 $y=x^3-3x$ 上の、$x=2$ の点における接線の方程式を求めなさい。',
      parts: [{ answer: 'y=[ア]x-[イ]' }],
      boxes: { ア: 9, イ: 16 },
      hints: [
        '接線の傾きは微分係数 $y\'(2)$。接点の $y$ 座標も求める。',
        '接線は $y-f(a)=f\'(a)(x-a)$。',
      ],
      solution: [
        { text: '$y\'=3x^2-3$ より傾きは $9$。接点は $(2,\\ 2)$。' },
        { text: '接線の式。', math: 'y-2=9(x-2),\\quad y=9x-16' },
      ],
      point: '接線は「接点の座標」と「微分係数（傾き）」の2つで決まる。',
      pitfall: '接点の $y$ 座標を $y\'$ の値と取りちがえない。',
    },
    {
      id: 'mx-diff-03', unit: 'diff', level: 'basic', pattern: 'extremum', minutes: 3,
      text: '関数 $f(x)=x^3-6x^2+9x+1$ の極大値と極小値、およびそのときの $x$ の値を求めなさい。',
      parts: [
        { q: '極大値', answer: '[ア]\\quad(x=[イ])' },
        { q: '極小値', answer: '[ウ]\\quad(x=[エ])' },
      ],
      boxes: { ア: 5, イ: 1, ウ: 1, エ: 3 },
      hints: [
        '$f\'(x)=0$ となる $x$ を求め、増減表をかく。',
        '$f\'(x)$ の符号が＋から－に変わる点で極大、－から＋に変わる点で極小。',
      ],
      solution: [
        { text: '導関数。', math: "f'(x)=3x^2-12x+9=3(x-1)(x-3)" },
        { text: '$x=1$ で＋→－（極大）、$x=3$ で－→＋（極小）。', math: 'f(1)=5,\\quad f(3)=1' },
      ],
      point: '極値は増減表で判断する。$f\'(x)=0$ でも符号が変わらなければ極値ではない。',
      pitfall: '極大値・極小値に $x$ の値を答えない。求めるのは $f(x)$ の値。',
    },
    {
      id: 'mx-diff-04', unit: 'diff', level: 'basic', pattern: 'maxmin', minutes: 4,
      text: '関数 $f(x)=x^3-3x\\ (-2\\leqq x\\leqq3)$ の最大値と最小値を求めなさい。',
      parts: [{ answer: '\\text{最大値}\\ [ア],\\quad\\text{最小値}\\ [イ]' }],
      boxes: { ア: 18, イ: -2 },
      hints: [
        '極値と、区間の両端での値を比べる。',
        '$f\'(x)=3(x+1)(x-1)$。$x=\\pm1$ と $x=-2,\\ 3$ での値を求める。',
      ],
      solution: [
        { text: '極値：$f(-1)=2$、$f(1)=-2$。両端：$f(-2)=-2$、$f(3)=18$。' },
        { text: '最大値 $18$（$x=3$）、最小値 $-2$（$x=-2,\\ 1$）。' },
      ],
      point: '区間での最大・最小は、極値と端の値をすべて比べる。',
      pitfall: '極大値 $2$ を最大値としない。区間の端の方が大きいことがある。',
    },
    {
      id: 'mx-diff-05', unit: 'diff', level: 'standard', pattern: 'tangent', minutes: 5,
      text: '点 $(0,\\ -2)$ から曲線 $y=x^3$ に引いた接線の方程式を求めなさい。',
      parts: [{ answer: 'y=[ア]x-[イ]' }],
      boxes: { ア: 3, イ: 2 },
      hints: [
        '接点を $(t,\\ t^3)$ とおいて接線の式を $t$ で書く：$y=3t^2x-2t^3$。',
        'この接線が点 $(0,\\ -2)$ を通る条件から $t$ を求める。',
      ],
      solution: [
        { text: '接点 $(t,\\ t^3)$ での接線。', math: 'y-t^3=3t^2(x-t),\\quad y=3t^2x-2t^3' },
        { text: '$(0,\\ -2)$ を通るので $-2=-2t^3$、$t=1$。', math: 'y=3x-2' },
      ],
      point: '曲線外の点から引く接線は、接点を文字でおいてから「その点を通る」条件を立てる。',
      pitfall: '点 $(0,\\ -2)$ を接点としない。この点は曲線上にない。',
    },
    {
      id: 'mx-diff-06', unit: 'diff', level: 'standard', pattern: 'equation', minutes: 6,
      text: '$x$ についての方程式 $x^3-3x-a=0$ が、異なる3つの実数解をもつような定数 $a$ の値の範囲を求めなさい。',
      parts: [{ answer: '[ア]<a<[イ]' }],
      boxes: { ア: -2, イ: 2 },
      hints: [
        '$x^3-3x=a$ と変形し、曲線 $y=x^3-3x$ と直線 $y=a$ の共有点の個数を考える。',
        '$y=x^3-3x$ の極大値と極小値を求める。',
      ],
      solution: [
        { text: '$y=x^3-3x$ の導関数は $3(x+1)(x-1)$。極大値 $2$（$x=-1$）、極小値 $-2$（$x=1$）。' },
        { text: '直線 $y=a$ が曲線と3点で交わるのは、極小値と極大値の間。', math: '-2<a<2' },
      ],
      point: '「定数 $a$ を分離」して、グラフと水平な直線の共有点で解の個数を数える。',
      pitfall: '$a=\\pm2$ をふくめない。そのとき直線は曲線に接し、実数解は2つになる。',
    },
    {
      id: 'mx-diff-07', unit: 'diff', level: 'standard', pattern: 'extremum', minutes: 6,
      text: '関数 $f(x)=x^3+ax^2+bx$ が $x=1$ で極小値 $-5$ をとるとき、定数 $a,\\ b$ の値と極大値を求めなさい。',
      parts: [{ answer: 'a=[ア],\\ b=[イ],\\quad\\text{極大値}\\ [ウ]' }],
      boxes: { ア: 3, イ: -9, ウ: 27 },
      hints: [
        '$x=1$ で極値 → $f\'(1)=0$。極小値 $-5$ → $f(1)=-5$。',
        '求めた $a,\\ b$ で増減表をかき、$x=1$ で本当に極小になるかを確かめる。',
      ],
      solution: [
        { text: '2つの条件。', math: "f'(1)=3+2a+b=0,\\qquad f(1)=1+a+b=-5" },
        { text: '解く。', math: 'a=3,\\quad b=-9' },
        { text: "$f'(x)=3(x+3)(x-1)$。$x=1$ で－→＋なので極小（条件に合う）。極大値は", math: 'f(-3)=-27+27+27=27' },
      ],
      point: '「$x=a$ で極値」は $f\'(a)=0$ だが、これは必要条件。最後に増減表で確かめる。',
      pitfall: '$f\'(1)=0$ だけから答えを出さない。極小かどうかの確認までが解答。',
    },
    {
      id: 'mx-diff-08', unit: 'diff', level: 'standard', pattern: 'maxmin', minutes: 6,
      text: '1辺が $12$ cm の正方形の厚紙の四すみから、1辺 $x$ cm の正方形を切り取り、残りを折り曲げてふたのない箱をつくる。箱の容積が最大となる $x$ の値と、そのときの容積を求めなさい。',
      parts: [{ answer: 'x=[ア],\\quad\\text{容積}\\ [イ]\\ \\text{cm}^3' }],
      boxes: { ア: 2, イ: 128 },
      hints: [
        '容積は $V=x(12-2x)^2$。$x$ の範囲は $0<x<6$。',
        '$V\'(x)=0$ となる $x$ を求め、増減を調べる。',
      ],
      solution: [
        { text: '微分する。', math: "V'(x)=(12-2x)^2-4x(12-2x)=(12-2x)(12-6x)" },
        { text: '$0<x<6$ で $V\'=0$ となるのは $x=2$。この前後で＋→－なので最大。', math: 'V(2)=2\\times8^2=128' },
      ],
      point: '文章題の最大・最小は、変数の範囲を先に決めてから微分する。',
      pitfall: '$x=6$ を候補に入れない。そのとき底面がなくなり、箱にならない。',
    },

    // ── 積分法 ──
    {
      id: 'mx-integ-01', unit: 'integ', level: 'basic', pattern: 'indefinite', minutes: 2,
      text: '$F\'(x)=3x^2-4x+1$、$F(0)=2$ を満たす関数 $F(x)$ を求めなさい。',
      parts: [{ answer: 'F(x)=x^3-[ア]x^2+x+[イ]' }],
      boxes: { ア: 2, イ: 2 },
      hints: [
        '$F(x)$ は $F\'(x)$ の不定積分：$\\displaystyle\\int x^n\\,dx=\\dfrac{x^{n+1}}{n+1}+C$。',
        '積分定数 $C$ は $F(0)=2$ から決める。',
      ],
      solution: [
        { text: '不定積分する。', math: 'F(x)=x^3-2x^2+x+C' },
        { text: '$F(0)=C=2$。', math: 'F(x)=x^3-2x^2+x+2' },
      ],
      point: '条件つきの不定積分は、積分定数 $C$ を条件で決める。',
      pitfall: '積分定数を書き忘れて $F(0)=0$ としない。',
    },
    {
      id: 'mx-integ-02', unit: 'integ', level: 'basic', pattern: 'definite', minutes: 3,
      text: '定積分 $\\displaystyle\\int_1^3(x^2-2x+3)\\,dx$ を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 20, イ: 3 },
      hints: [
        '不定積分 $\\dfrac{x^3}{3}-x^2+3x$ をつくり、上端と下端の値の差をとる。',
        '$\\left[F(x)\\right]_1^3=F(3)-F(1)$。',
      ],
      solution: [
        { text: '計算する。', math: '\\left[\\dfrac{x^3}{3}-x^2+3x\\right]_1^3=(9-9+9)-\\left(\\dfrac13-1+3\\right)' },
        { text: '計算する。', math: '9-\\dfrac{7}{3}=\\dfrac{20}{3}' },
      ],
      point: '定積分は「上端の値－下端の値」。かっこをつけて引く。',
      pitfall: '下端の値を引くとき、かっこの中の符号を変え忘れない。',
    },
    {
      id: 'mx-integ-03', unit: 'integ', level: 'basic', pattern: 'area', minutes: 3,
      text: '放物線 $y=x^2-2x$ と $x$ 軸で囲まれた部分の面積を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 4, イ: 3 },
      hints: [
        '$x$ 軸との交点は $x=0,\\ 2$。この区間でグラフは $x$ 軸より下にある。',
        '面積は $\\displaystyle\\int_0^2\\{0-(x^2-2x)\\}\\,dx$。',
      ],
      solution: [
        { text: '交点は $x^2-2x=0$ より $x=0,\\ 2$。', math: 'S=\\int_0^2(-x^2+2x)\\,dx' },
        { text: '計算する。', math: '\\left[-\\dfrac{x^3}{3}+x^2\\right]_0^2=-\\dfrac{8}{3}+4=\\dfrac{4}{3}' },
      ],
      point: '面積は「上の式－下の式」を積分する。$x$ 軸より下の部分は $-f(x)$ を積分。',
      pitfall: '$\\displaystyle\\int_0^2(x^2-2x)\\,dx=-\\dfrac43$ のまま答えない。面積は正。',
    },
    {
      id: 'mx-integ-04', unit: 'integ', level: 'basic', pattern: 'function', minutes: 4,
      text: '等式 $f(x)=3x^2+2\\displaystyle\\int_0^1 f(t)\\,dt$ を満たす関数 $f(x)$ を求めなさい。',
      parts: [{ answer: 'f(x)=3x^2-[ア]' }],
      boxes: { ア: 2 },
      hints: [
        '$\\displaystyle\\int_0^1 f(t)\\,dt$ は定数なので、$k$ とおく。すると $f(x)=3x^2+2k$。',
        '$k=\\displaystyle\\int_0^1(3t^2+2k)\\,dt$ を計算して $k$ を求める。',
      ],
      solution: [
        { text: '$k=\\displaystyle\\int_0^1 f(t)\\,dt$ とおくと $f(x)=3x^2+2k$。' },
        { text: '$k$ を計算する。', math: 'k=\\int_0^1(3t^2+2k)\\,dt=1+2k,\\quad k=-1' },
        { text: 'よって $f(x)=3x^2-2$。' },
      ],
      point: '上端・下端が定数の定積分は定数。文字でおいて方程式をつくる。',
      pitfall: '$\\displaystyle\\int_0^1 f(t)\\,dt$ を $x$ の式と思いこまない。積分の結果は数。',
    },
    {
      id: 'mx-integ-05', unit: 'integ', level: 'standard', pattern: 'area', minutes: 5,
      text: '放物線 $y=x^2$ と直線 $y=x+2$ で囲まれた部分の面積を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 9, イ: 2 },
      hints: [
        '交点の $x$ 座標は $x^2=x+2$ から $x=-1,\\ 2$。この間では直線が上。',
        '$\\displaystyle\\int_\\alpha^\\beta-(x-\\alpha)(x-\\beta)\\,dx=\\dfrac{(\\beta-\\alpha)^3}{6}$ が使える。',
      ],
      solution: [
        { text: '交点は $x=-1,\\ 2$。', math: 'S=\\int_{-1}^{2}\\{(x+2)-x^2\\}\\,dx=\\int_{-1}^{2}-(x+1)(x-2)\\,dx' },
        { text: '公式を使う。', math: '\\dfrac{\\{2-(-1)\\}^3}{6}=\\dfrac{27}{6}=\\dfrac{9}{2}' },
      ],
      point: '放物線と直線で囲まれた面積は $\\dfrac{|a|(\\beta-\\alpha)^3}{6}$ で速く求められる。',
      pitfall: '上下を逆にして $x^2-(x+2)$ を積分すると、負の値になる。上の式から下の式を引く。',
    },
    {
      id: 'mx-integ-06', unit: 'integ', level: 'standard', pattern: 'definite', minutes: 5,
      text: '定積分 $\\displaystyle\\int_0^3|x^2-1|\\,dx$ を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 22, イ: 3 },
      hints: [
        '$x^2-1$ の符号は $x=1$ で変わる。区間を $0\\leqq x\\leqq1$ と $1\\leqq x\\leqq3$ に分ける。',
        '$0\\leqq x\\leqq1$ では $|x^2-1|=1-x^2$、$1\\leqq x\\leqq3$ では $x^2-1$。',
      ],
      solution: [
        { text: '区間を分ける。', math: '\\int_0^1(1-x^2)\\,dx+\\int_1^3(x^2-1)\\,dx' },
        { text: '計算する。', math: '\\dfrac{2}{3}+\\left\\{(9-3)-\\left(\\dfrac{1}{3}-1\\right)\\right\\}=\\dfrac{2}{3}+\\dfrac{20}{3}=\\dfrac{22}{3}' },
      ],
      point: '絶対値の定積分は、中身の符号が変わる点で区間を分けて、絶対値をはずす。',
      pitfall: '絶対値をつけたまま $\\displaystyle\\int_0^3(x^2-1)\\,dx=6$ としない。負の部分が打ち消される。',
    },
    {
      id: 'mx-integ-07', unit: 'integ', level: 'standard', pattern: 'function', minutes: 5,
      text: '等式 $\\displaystyle\\int_a^x f(t)\\,dt=x^2-3x+2$ を満たす関数 $f(x)$ と定数 $a$ の値を求めなさい。$a$ は小さい順に答えなさい。',
      parts: [{ answer: 'f(x)=[ア]x-[イ],\\quad a=[ウ],\\ [エ]' }],
      boxes: { ア: 2, イ: 3, ウ: 1, エ: 2 },
      hints: [
        '両辺を $x$ で微分すると $f(x)$ がわかる：$\\dfrac{d}{dx}\\displaystyle\\int_a^x f(t)\\,dt=f(x)$。',
        '$x=a$ を代入すると左辺は $0$。$a^2-3a+2=0$ を解く。',
      ],
      solution: [
        { text: '両辺を微分する。', math: 'f(x)=2x-3' },
        { text: '$x=a$ を代入する。', math: '0=a^2-3a+2=(a-1)(a-2),\\quad a=1,\\ 2' },
      ],
      point: '上端が $x$ の定積分は、微分すると中の関数になる。$x=a$ を代入すると $0$。',
      pitfall: '$a$ を1つだけ答えない。$a=1,\\ 2$ のどちらでも等式は成り立つ。',
    },
    {
      id: 'mx-integ-08', unit: 'integ', level: 'standard', pattern: 'area', minutes: 5,
      text: '放物線 $y=x^2$ と、その上の点 $(1,\\ 1)$ における接線、および $y$ 軸で囲まれた部分の面積を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 1, イ: 3 },
      hints: [
        '接線の傾きは $y\'=2x$ より $2$。接線は $y=2x-1$。',
        '$0\\leqq x\\leqq1$ で、放物線が接線の上にある。$\\displaystyle\\int_0^1\\{x^2-(2x-1)\\}\\,dx$。',
      ],
      solution: [
        { text: '接線は $y=2x-1$。差は $x^2-2x+1=(x-1)^2$。', math: 'S=\\int_0^1(x-1)^2\\,dx' },
        { text: '計算する。', math: '\\left[\\dfrac{(x-1)^3}{3}\\right]_0^1=0-\\left(-\\dfrac{1}{3}\\right)=\\dfrac{1}{3}' },
      ],
      point: '放物線と接線の差は $(x-\\text{接点})^2$ の形になる。これを積分すると速い。',
      pitfall: '$y$ 軸と囲まれる区間を $-1\\leqq x\\leqq1$ としない。$y$ 軸は $x=0$。',
    },
  ],
}
