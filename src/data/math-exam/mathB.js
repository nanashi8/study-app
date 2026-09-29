// 入試演習（大学入試）：数学Bの単元。問題の形は src/lib/mathExam.js の冒頭を参照。

export const MATH_EXAM_MATHB = {
  patterns: {
    seq: [
      { id: 'arithmetic', title: '等差数列' },
      { id: 'geometric', title: '等比数列' },
      { id: 'sigma', title: 'Σの計算と階差数列' },
      { id: 'recurrence', title: '漸化式' },
      { id: 'group', title: '群数列' },
    ],
    statB: [
      { id: 'distribution', title: '確率変数の期待値と分散' },
      { id: 'binomial', title: '二項分布' },
      { id: 'normal', title: '正規分布' },
      { id: 'estimate', title: '母平均の推定' },
      { id: 'test', title: '仮説検定' },
    ],
  },
  problems: [
    // ── 数列 ──
    {
      id: 'mx-seq-01', unit: 'seq', level: 'basic', pattern: 'arithmetic', minutes: 3,
      text: '第3項が $8$、第7項が $20$ である等差数列 $\\{a_n\\}$ について答えなさい。',
      parts: [
        { q: '一般項を求めなさい。', answer: 'a_n=[ア]n-[イ]' },
        { q: '初項から第20項までの和を求めなさい。', answer: '[ウ]' },
      ],
      boxes: { ア: 3, イ: 1, ウ: 610 },
      hints: [
        '初項を $a$、公差を $d$ として、$a+2d=8$、$a+6d=20$。',
        '等差数列の和は $\\dfrac{n(\\text{初項}+\\text{末項})}{2}$。',
      ],
      solution: [
        { text: '2式を引くと $4d=12$、$d=3$、$a=2$。', math: 'a_n=2+3(n-1)=3n-1' },
        { text: '第20項は $59$。', math: 'S_{20}=\\dfrac{20(2+59)}{2}=610' },
      ],
      point: '等差数列は「初項と公差」の2つがわかれば決まる。',
      pitfall: '一般項を $a+nd$ としない。第 $n$ 項は $a+(n-1)d$。',
    },
    {
      id: 'mx-seq-02', unit: 'seq', level: 'basic', pattern: 'geometric', minutes: 2,
      text: '初項 $3$、公比 $2$ の等比数列について、第6項と、初項から第6項までの和を求めなさい。',
      parts: [{ answer: '\\text{第6項}\\ [ア],\\quad\\text{和}\\ [イ]' }],
      boxes: { ア: 96, イ: 189 },
      hints: [
        '第 $n$ 項は $ar^{n-1}$。',
        '和は $\\dfrac{a(r^n-1)}{r-1}$。',
      ],
      solution: [
        { text: '第6項。', math: '3\\times2^5=96' },
        { text: '和。', math: '\\dfrac{3(2^6-1)}{2-1}=189' },
      ],
      point: '等比数列の和の公式は、公比が1より大きいときは $\\dfrac{a(r^n-1)}{r-1}$ の形が使いやすい。',
      pitfall: '第6項を $3\\times2^6$ としない。指数は $n-1=5$。',
    },
    {
      id: 'mx-seq-03', unit: 'seq', level: 'basic', pattern: 'sigma', minutes: 3,
      text: '$\\displaystyle\\sum_{k=1}^{10}k(k+1)$ を求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 440 },
      hints: [
        '$k(k+1)=k^2+k$ と分けて、$\\sum k^2$ と $\\sum k$ を別々に求める。',
        '$\\sum_{k=1}^{n}k^2=\\dfrac{n(n+1)(2n+1)}{6}$、$\\sum_{k=1}^{n}k=\\dfrac{n(n+1)}{2}$。',
      ],
      solution: [
        { text: '分けて計算する。', math: '\\sum k^2+\\sum k=\\dfrac{10\\cdot11\\cdot21}{6}+\\dfrac{10\\cdot11}{2}=385+55' },
        { text: '合計。', math: '440' },
      ],
      point: 'Σは、公式が使える形（$k^2,\\ k,\\ $定数）に分けてから計算する。',
      pitfall: '$\\sum k(k+1)=\\sum k\\times\\sum(k+1)$ としない。積には分けられない。',
    },
    {
      id: 'mx-seq-04', unit: 'seq', level: 'basic', pattern: 'recurrence', minutes: 4,
      text: '$a_1=2,\\ a_{n+1}=3a_n+2$ で定められる数列 $\\{a_n\\}$ の一般項を求めなさい。',
      parts: [{ answer: 'a_n=[ア]^n-[イ]' }],
      boxes: { ア: 3, イ: 1 },
      hints: [
        '$\\alpha=3\\alpha+2$ を満たす $\\alpha$ を求めると、$a_{n+1}-\\alpha=3(a_n-\\alpha)$ と変形できる。',
        '$\\{a_n+1\\}$ は、初項 $a_1+1$、公比 $3$ の等比数列。',
      ],
      solution: [
        { text: '$\\alpha=3\\alpha+2$ より $\\alpha=-1$。', math: 'a_{n+1}+1=3(a_n+1)' },
        { text: '$a_n+1=(a_1+1)\\cdot3^{n-1}=3\\cdot3^{n-1}=3^n$。', math: 'a_n=3^n-1' },
      ],
      point: '$a_{n+1}=pa_n+q$ 型は、特性方程式 $\\alpha=p\\alpha+q$ で等比数列に直す。',
      pitfall: '$a_n+1=3^{n-1}$ としない。初項 $a_1+1=3$ をかける。',
    },
    {
      id: 'mx-seq-05', unit: 'seq', level: 'standard', pattern: 'sigma', minutes: 5,
      text: '数列 $1,\\ 2,\\ 5,\\ 10,\\ 17,\\ \\ldots$ の一般項を求めなさい。',
      parts: [{ answer: 'a_n=n^2-[ア]n+[イ]' }],
      boxes: { ア: 2, イ: 2 },
      hints: [
        '隣り合う項の差（階差数列）をとると $1,\\ 3,\\ 5,\\ 7,\\ldots$。',
        '$n\\geqq2$ のとき $a_n=a_1+\\displaystyle\\sum_{k=1}^{n-1}b_k$。最後に $n=1$ でも成り立つか確かめる。',
      ],
      solution: [
        { text: '階差数列は $b_k=2k-1$。$n\\geqq2$ のとき', math: 'a_n=1+\\sum_{k=1}^{n-1}(2k-1)=1+(n-1)^2' },
        { text: '整理すると $a_n=n^2-2n+2$。$n=1$ のとき $1$ で成り立つ。' },
      ],
      point: '規則が見えにくい数列は、階差をとる。和の上端は $n-1$。',
      pitfall: 'Σの上端を $n$ にしない。$a_n$ までの差は $n-1$ 個。',
    },
    {
      id: 'mx-seq-06', unit: 'seq', level: 'standard', pattern: 'sigma', minutes: 5,
      text: '$\\displaystyle\\sum_{k=1}^{n}\\dfrac{1}{(2k-1)(2k+1)}$ を求めなさい。',
      parts: [{ answer: '\\dfrac{n}{[ア]n+[イ]}' }],
      boxes: { ア: 2, イ: 1 },
      hints: [
        '部分分数に分ける：$\\dfrac{1}{(2k-1)(2k+1)}=\\dfrac12\\left(\\dfrac{1}{2k-1}-\\dfrac{1}{2k+1}\\right)$。',
        '和をとると、となり合う項が打ち消し合い、最初と最後だけが残る。',
      ],
      solution: [
        { text: '部分分数に分けて足す。', math: '\\dfrac{1}{2}\\left\\{\\left(1-\\dfrac13\\right)+\\left(\\dfrac13-\\dfrac15\\right)+\\cdots+\\left(\\dfrac{1}{2n-1}-\\dfrac{1}{2n+1}\\right)\\right\\}' },
        { text: '打ち消し合って', math: '\\dfrac{1}{2}\\left(1-\\dfrac{1}{2n+1}\\right)=\\dfrac{n}{2n+1}' },
      ],
      point: '分母が積の分数の和は、部分分数分解で差の形にして打ち消し合わせる。',
      pitfall: '前の $\\dfrac12$ をかけ忘れない。差の分母どうしの差が2なので $\\dfrac12$ がつく。',
    },
    {
      id: 'mx-seq-07', unit: 'seq', level: 'standard', pattern: 'recurrence', minutes: 5,
      text: '数列 $\\{a_n\\}$ の初項から第 $n$ 項までの和 $S_n$ が、$S_n=2a_n-3$ を満たしている。一般項を求めなさい。',
      parts: [{ answer: 'a_n=[ア]\\cdot[イ]^{n-1}' }],
      boxes: { ア: 3, イ: 2 },
      hints: [
        '$n=1$ のとき $S_1=a_1$ なので、$a_1=2a_1-3$。',
        '$S_{n+1}-S_n=a_{n+1}$ を使うと、$a_{n+1}$ と $a_n$ の関係がわかる。',
      ],
      solution: [
        { text: '$a_1=2a_1-3$ より $a_1=3$。' },
        { text: '$S_{n+1}-S_n=2a_{n+1}-2a_n$ で、左辺は $a_{n+1}$。', math: 'a_{n+1}=2a_n' },
        { text: '初項3、公比2の等比数列。', math: 'a_n=3\\cdot2^{n-1}' },
      ],
      point: '和 $S_n$ の式が与えられたら、$a_{n+1}=S_{n+1}-S_n$ で漸化式にする。',
      pitfall: '$a_1$ を求めずに一般項を書かない。初項は $n=1$ を代入して決める。',
    },
    {
      id: 'mx-seq-08', unit: 'seq', level: 'standard', pattern: 'group', minutes: 6,
      text: '自然数を $1\\ |\\ 2,\\ 3\\ |\\ 4,\\ 5,\\ 6\\ |\\ 7,\\ 8,\\ 9,\\ 10\\ |\\ \\cdots$ のように、第 $n$ 群に $n$ 個の数が入るように区切る。',
      parts: [
        { q: '第10群の最初の数を求めなさい。', answer: '[ア]' },
        { q: '第10群に入る数の和を求めなさい。', answer: '[イ]' },
      ],
      boxes: { ア: 46, イ: 505 },
      hints: [
        '第9群の最後までに、$1+2+\\cdots+9$ 個の数がある。',
        '第10群は、最初の数から始まる連続する10個の自然数。',
      ],
      solution: [
        { text: '第9群までの個数は $\\dfrac{9\\times10}{2}=45$ 個。第10群の最初の数は $46$。' },
        { text: '第10群は $46$ から $55$ までの10個。', math: '\\dfrac{10(46+55)}{2}=505' },
      ],
      point: '群数列は「第 $n-1$ 群までに何個あるか」を数えるのが出発点。',
      pitfall: '第10群の最初の数を $1+2+\\cdots+10=55$ としない。それは第10群の最後の数。',
    },

    // ── 統計的な推測 ──
    {
      id: 'mx-statB-01', unit: 'statB', level: 'basic', pattern: 'distribution', minutes: 3,
      text: '1個のさいころを投げて出る目を $X$ とする。$X$ の期待値 $E(X)$ と分散 $V(X)$ を求めなさい。',
      parts: [{ answer: 'E(X)=\\dfrac{[ア]}{[イ]},\\quad V(X)=\\dfrac{[ウ]}{[エ]}' }],
      boxes: { ア: 7, イ: 2, ウ: 35, エ: 12 },
      hints: [
        '$E(X)=\\sum x_kp_k$。どの目も確率 $\\dfrac16$。',
        '$V(X)=E(X^2)-\\{E(X)\\}^2$。',
      ],
      solution: [
        { text: '期待値。', math: 'E(X)=\\dfrac{1+2+3+4+5+6}{6}=\\dfrac{7}{2}' },
        { text: '$E(X^2)=\\dfrac{1+4+9+16+25+36}{6}=\\dfrac{91}{6}$。', math: 'V(X)=\\dfrac{91}{6}-\\dfrac{49}{4}=\\dfrac{35}{12}' },
      ],
      point: '分散は「2乗の期待値－期待値の2乗」で計算すると速い。',
      pitfall: '$V(X)=E(X^2)-E(X)$ としない。引くのは期待値の2乗。',
    },
    {
      id: 'mx-statB-02', unit: 'statB', level: 'basic', pattern: 'binomial', minutes: 2,
      text: '確率変数 $X$ が二項分布 $B\\left(100,\\ \\dfrac{1}{5}\\right)$ にしたがうとき、期待値、分散、標準偏差を求めなさい。',
      parts: [{ answer: 'E(X)=[ア],\\quad V(X)=[イ],\\quad\\sigma(X)=[ウ]' }],
      boxes: { ア: 20, イ: 16, ウ: 4 },
      hints: [
        '二項分布 $B(n,\\ p)$ では、$E(X)=np$、$V(X)=np(1-p)$。',
        '標準偏差は分散の正の平方根。',
      ],
      solution: [
        { text: '期待値。', math: '100\\times\\dfrac{1}{5}=20' },
        { text: '分散と標準偏差。', math: '100\\times\\dfrac{1}{5}\\times\\dfrac{4}{5}=16,\\quad\\sigma=4' },
      ],
      point: '二項分布の期待値・分散は、確率を1つずつ計算しなくても公式で求まる。',
      pitfall: '分散を $np$ としない。$(1-p)$ をかける。',
    },
    {
      id: 'mx-statB-03', unit: 'statB', level: 'basic', pattern: 'distribution', minutes: 2,
      text: '確率変数 $X$ の期待値が $4$、分散が $9$ である。$Y=-2X+5$ の期待値、分散、標準偏差を求めなさい。',
      parts: [{ answer: 'E(Y)=[ア],\\quad V(Y)=[イ],\\quad\\sigma(Y)=[ウ]' }],
      boxes: { ア: -3, イ: 36, ウ: 6 },
      hints: [
        '$E(aX+b)=aE(X)+b$、$V(aX+b)=a^2V(X)$。',
        '標準偏差は $|a|$ 倍になる。',
      ],
      solution: [
        { text: '期待値。', math: '-2\\times4+5=-3' },
        { text: '分散と標準偏差。', math: 'V(Y)=(-2)^2\\times9=36,\\quad\\sigma(Y)=6' },
      ],
      point: '1次式の変換で、分散は $a^2$ 倍、標準偏差は $|a|$ 倍。$b$ は関係しない。',
      pitfall: '標準偏差を $-2\\times3=-6$ としない。標準偏差は負にならない。',
    },
    {
      id: 'mx-statB-04', unit: 'statB', level: 'basic', pattern: 'normal', minutes: 3,
      text: '確率変数 $X$ が正規分布 $N(50,\\ 10^2)$ にしたがうとき、$P(X\\geqq70)$ を求めなさい。ただし、標準正規分布 $Z$ について $P(0\\leqq Z\\leqq2)=0.4772$ とする。',
      parts: [{ answer: 'P(X\\geqq70)=0.0[ア]' }],
      boxes: { ア: 228 },
      hints: [
        '$Z=\\dfrac{X-50}{10}$ と標準化する。',
        '$P(Z\\geqq2)=0.5-P(0\\leqq Z\\leqq2)$。',
      ],
      solution: [
        { text: '標準化する。$X=70$ のとき $Z=2$。' },
        { text: '計算する。', math: 'P(Z\\geqq2)=0.5-0.4772=0.0228' },
      ],
      point: '正規分布の確率は、標準化して正規分布表の値を使う。左右対称なので半分は $0.5$。',
      pitfall: '$P(X\\geqq70)$ を $0.4772$ としない。それは $50\\leqq X\\leqq70$ の確率。',
    },
    {
      id: 'mx-statB-05', unit: 'statB', level: 'standard', pattern: 'estimate', minutes: 5,
      text: 'ある母集団から大きさ49の標本を無作為に抽出したところ、標本平均は60だった。母標準偏差を10として、母平均 $m$ に対する信頼度95％の信頼区間を求めなさい。ただし、$P(|Z|\\leqq1.96)=0.95$ とする。',
      parts: [{ answer: '[ア].[イ]\\leqq m\\leqq[ウ].[エ]' }],
      boxes: { ア: 57, イ: 2, ウ: 62, エ: 8 },
      hints: [
        '信頼度95％の信頼区間は、標本平均 $\\pm1.96\\times\\dfrac{\\sigma}{\\sqrt{n}}$。',
        '$\\dfrac{\\sigma}{\\sqrt{n}}=\\dfrac{10}{7}$。',
      ],
      solution: [
        { text: '幅を計算する。', math: '1.96\\times\\dfrac{10}{\\sqrt{49}}=1.96\\times\\dfrac{10}{7}=2.8' },
        { text: '信頼区間。', math: '60-2.8\\leqq m\\leqq60+2.8,\\quad57.2\\leqq m\\leqq62.8' },
      ],
      point: '標本平均の標準偏差は $\\dfrac{\\sigma}{\\sqrt{n}}$。標本が大きいほど区間はせまくなる。',
      pitfall: '$\\dfrac{\\sigma}{\\sqrt n}$ を $\\dfrac{\\sigma}{n}$ としない。',
    },
    {
      id: 'mx-statB-06', unit: 'statB', level: 'standard', pattern: 'binomial', minutes: 5,
      text: '1枚の硬貨を400回投げるとき、表が215回以上出る確率を、正規分布で近似して求めなさい。ただし、$P(0\\leqq Z\\leqq1.5)=0.4332$ とする。',
      parts: [{ answer: '0.0[ア]' }],
      boxes: { ア: 668 },
      hints: [
        '表の回数 $X$ は二項分布 $B\\left(400,\\ \\dfrac12\\right)$。期待値と標準偏差を求める。',
        '近似的に $N(200,\\ 10^2)$ にしたがうとして標準化する。',
      ],
      solution: [
        { text: '$E(X)=200$、$\\sigma(X)=\\sqrt{400\\times\\dfrac12\\times\\dfrac12}=10$。' },
        { text: '$X=215$ のとき $Z=1.5$。', math: 'P(Z\\geqq1.5)=0.5-0.4332=0.0668' },
      ],
      point: '試行回数が大きい二項分布は、同じ期待値・分散の正規分布で近似できる。',
      pitfall: '標準偏差を分散の $100$ のまま使わない。標準化には $\\sigma=10$。',
    },
    {
      id: 'mx-statB-07', unit: 'statB', level: 'standard', pattern: 'test', minutes: 6,
      text: 'あるさいころを180回投げたところ、1の目が42回出た。このさいころの1の目が出る確率は $\\dfrac16$ でないと判断してよいか。有意水準5％で検定する（$P(|Z|\\leqq1.96)=0.95$）。',
      parts: [
        { q: '帰無仮説「1の目の出る確率は $\\dfrac16$」のもとで、1の目の回数を標準化した値 $z$', answer: 'z=[ア].[イ]' },
        { q: '判断を、⓪・①から選びなさい。', answer: '[ウ]' },
      ],
      boxes: { ア: 2, イ: 4, ウ: 0 },
      choices: {
        ウ: {
          options: ['確率は $\\dfrac16$ ではないと判断できる', '確率は $\\dfrac16$ ではないとは判断できない'],
          notes: [
            '$z=2.4$ は $|z|>1.96$ で棄却域に入る。帰無仮説は棄却され、$\\dfrac16$ ではないと判断できる。',
            '$|z|\\leqq1.96$ なら棄却できないが、$z=2.4$ は $1.96$ より大きい。',
          ],
        },
      },
      hints: [
        '帰無仮説のもとで、回数 $X$ は $B\\left(180,\\ \\dfrac16\\right)$。期待値30、標準偏差 $\\sqrt{180\\cdot\\dfrac16\\cdot\\dfrac56}$。',
        '$z=\\dfrac{42-30}{\\sigma}$。$|z|>1.96$ なら帰無仮説を棄却する。',
      ],
      solution: [
        { text: '期待値30、標準偏差 $\\sqrt{25}=5$。', math: 'z=\\dfrac{42-30}{5}=2.4' },
        { text: '$|z|=2.4>1.96$ なので、有意水準5％で帰無仮説を棄却する。確率は $\\dfrac16$ ではないと判断できる。' },
      ],
      point: '仮説検定は「帰無仮説のもとで、観測値がどれくらい珍しいか」を標準化した値で判断する。',
      pitfall: '「棄却できない」を「帰無仮説が正しいと証明された」と読まない。',
    },
    {
      id: 'mx-statB-08', unit: 'statB', level: 'standard', pattern: 'distribution', minutes: 6,
      text: '1、2、3、4の数字を1つずつ書いた4枚のカードから、同時に2枚を取り出し、書かれた数の大きい方を $X$ とする。$X$ の期待値と分散を求めなさい。',
      parts: [{ answer: 'E(X)=\\dfrac{[ア]}{[イ]},\\quad V(X)=\\dfrac{[ウ]}{[エ]}' }],
      boxes: { ア: 10, イ: 3, ウ: 5, エ: 9 },
      hints: [
        '2枚の取り出し方は ${}_4\\mathrm{C}_2=6$ 通り。大きい方が $2,3,4$ になる場合を数える。',
        '$P(X=2)=\\dfrac16,\\ P(X=3)=\\dfrac26,\\ P(X=4)=\\dfrac36$。',
      ],
      solution: [
        { text: '期待値。', math: 'E(X)=2\\cdot\\dfrac16+3\\cdot\\dfrac26+4\\cdot\\dfrac36=\\dfrac{20}{6}=\\dfrac{10}{3}' },
        { text: '$E(X^2)=\\dfrac{4+18+48}{6}=\\dfrac{35}{3}$。', math: 'V(X)=\\dfrac{35}{3}-\\dfrac{100}{9}=\\dfrac{5}{9}' },
      ],
      point: '確率分布表（値と確率）をつくってから、期待値・分散を計算する。',
      pitfall: '$X=1$ を入れない。2枚取り出すので、大きい方が1になることはない。',
    },
  ],
}
