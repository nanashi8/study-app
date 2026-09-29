// 入試演習（大学入試）：数学Iの単元。問題の形は src/lib/mathExam.js の冒頭を参照。

// 測量：塔の高さ h=10(√3+1)。Aから30°、Bから45°で見上げる。
const TOWER_H = 10 * (Math.sqrt(3) + 1)
const SCATTER = [[1, 9], [2, 9.5], [3, 8], [4, 8.5], [5, 6], [6, 7], [7, 4.5], [8, 6], [9, 3], [10, 4]]

export const MATH_EXAM_MATH1 = {
  patterns: {
    realexpr: [
      { id: 'factor', title: 'たすき掛け・2文字の因数分解' },
      { id: 'radical', title: '無理数の計算と対称式' },
      { id: 'abs', title: '絶対値をふくむ方程式' },
      { id: 'ineq', title: '1次不等式と整数解' },
    ],
    setlogic: [
      { id: 'set', title: '集合の要素の個数' },
      { id: 'condition', title: '必要条件と十分条件' },
      { id: 'contrapositive', title: '逆・裏・対偶と真偽' },
      { id: 'proof', title: '背理法' },
    ],
    qfn: [
      { id: 'vertex', title: '頂点と平行移動' },
      { id: 'maxmin', title: '定義域のある最大・最小（文字をふくむ場合分け）' },
      { id: 'determine', title: '2次関数の決定' },
      { id: 'ineq', title: '2次不等式' },
      { id: 'intersect', title: 'x軸との共有点と解の配置' },
    ],
    trig: [
      { id: 'ratio', title: '三角比の値と相互関係' },
      { id: 'sine', title: '正弦定理と外接円' },
      { id: 'cosine', title: '余弦定理' },
      { id: 'area', title: '三角形の面積と内接円' },
      { id: 'measure', title: '測量への応用' },
    ],
    dataI: [
      { id: 'variance', title: '分散と標準偏差' },
      { id: 'transform', title: '変量の変換' },
      { id: 'correlation', title: '散布図と相関係数' },
      { id: 'outlier', title: '四分位範囲と外れ値' },
      { id: 'hypothesis', title: '仮説検定の考え方' },
    ],
  },
  problems: [
    // ── 数と式 ──
    {
      id: 'mx-realexpr-01', unit: 'realexpr', level: 'basic', pattern: 'factor', minutes: 2,
      text: '次の式を因数分解しなさい。',
      math: '6x^2+x-2',
      parts: [{ answer: '([ア]x-[イ])([ウ]x+[エ])' }],
      boxes: { ア: 2, イ: 1, ウ: 3, エ: 2 },
      hints: [
        '$x^2$ の係数 $6$ と定数項 $-2$ を、それぞれ2つの数の積に分けて「たすき掛け」を試す。',
        'たすき掛けで、ななめにかけた積の和が $x$ の係数 $1$ になる組を探す。',
      ],
      solution: [
        { text: '$6=2\\times3$、$-2=(-1)\\times2$ と分けると、ななめの積の和は $2\\times2+3\\times(-1)=1$ で合う。' },
        { text: 'よって', math: '6x^2+x-2=(2x-1)(3x+2)' },
      ],
      point: 'たすき掛けは、$x^2$ の係数と定数項の分け方を表にして、ななめの積の和を確かめる。',
      pitfall: '符号の組み合わせを逆にすると、$x$ の係数が $-1$ になる。展開して確かめる。',
    },
    {
      id: 'mx-realexpr-02', unit: 'realexpr', level: 'basic', pattern: 'radical', minutes: 3,
      text: '次の式の分母を有理化して簡単にしなさい。',
      math: '\\dfrac{\\sqrt{5}+\\sqrt{3}}{\\sqrt{5}-\\sqrt{3}}',
      parts: [{ answer: '[ア]+\\sqrt{[イ]}' }],
      boxes: { ア: 4, イ: 15 },
      hints: [
        '分母と分子に $\\sqrt5+\\sqrt3$ をかけると、分母が $(\\sqrt5)^2-(\\sqrt3)^2$ になる。',
        '分子は $(\\sqrt5+\\sqrt3)^2$ を展開する。最後に約分する。',
      ],
      solution: [
        { text: '分母と分子に $\\sqrt5+\\sqrt3$ をかける。', math: '\\dfrac{(\\sqrt{5}+\\sqrt{3})^2}{5-3}=\\dfrac{8+2\\sqrt{15}}{2}' },
        { text: '約分する。', math: '4+\\sqrt{15}' },
      ],
      point: '分母が $\\sqrt{a}-\\sqrt{b}$ のときは、$\\sqrt{a}+\\sqrt{b}$ をかけて、和と差の積で根号を消す。',
      pitfall: '分子の2乗の展開で、まん中の $2\\sqrt{15}$ を落とさない。',
    },
    {
      id: 'mx-realexpr-03', unit: 'realexpr', level: 'basic', pattern: 'abs', minutes: 2,
      text: '方程式 $|2x-3|=5$ を解きなさい。解は小さい順に答えなさい。',
      parts: [{ answer: 'x=[ア],\\ [イ]' }],
      boxes: { ア: -1, イ: 4 },
      hints: [
        '$|A|=5$ ならば、$A=5$ または $A=-5$。',
        '$2x-3=5$ と $2x-3=-5$ をそれぞれ解く。',
      ],
      solution: [
        { text: '$2x-3=\\pm5$ より', math: '2x=8\\ \\text{または}\\ 2x=-2' },
        { text: 'よって $x=4,\\ -1$。' },
      ],
      point: '$|A|=c\\ (c>0)$ は $A=\\pm c$。絶対値の中身の正負で2つに分ける。',
      pitfall: '$2x-3=5$ の1つだけを解いて終わらない。絶対値が5になるのは2通り。',
    },
    {
      id: 'mx-realexpr-04', unit: 'realexpr', level: 'basic', pattern: 'ineq', minutes: 3,
      text: '連立不等式 $\\begin{cases}3x-1<2x+4\\\\2(x+1)\\geqq x-3\\end{cases}$ について答えなさい。',
      parts: [
        { q: '解を求めなさい。', answer: '[ア]\\leqq x<[イ]' },
        { q: 'この不等式を満たす整数 $x$ は何個あるか。', answer: '[ウ]\\ \\text{個}' },
      ],
      boxes: { ア: -5, イ: 5, ウ: 10 },
      hints: [
        'それぞれの不等式を解いて、共通する範囲を数直線で求める。',
        '等号がつく側（$\\geqq$）の端はふくむ。整数は端をふくむかどうかに注意して数える。',
      ],
      solution: [
        { text: '1つ目：$x<5$。2つ目：$2x+2\\geqq x-3$ より $x\\geqq-5$。' },
        { text: '共通部分は', math: '-5\\leqq x<5' },
        { text: '整数は $-5,-4,\\ldots,4$ の10個。' },
      ],
      point: '連立不等式は、数直線に両方の範囲をかいて重なりを見る。',
      pitfall: '$x<5$ に $5$ をふくめない。整数は $-5$ から $4$ まで。',
    },
    {
      id: 'mx-realexpr-05', unit: 'realexpr', level: 'standard', pattern: 'radical', minutes: 5,
      text: '$x=\\dfrac{1}{\\sqrt{5}-2},\\ y=\\dfrac{1}{\\sqrt{5}+2}$ のとき、次の式の値を求めなさい。',
      parts: [
        { q: '$x^2+y^2$', answer: '[ア]' },
        { q: '$x^3+y^3$', answer: '[イ]\\sqrt{[ウ]}' },
      ],
      boxes: { ア: 18, イ: 34, ウ: 5 },
      hints: [
        'まず $x,\\ y$ の分母を有理化し、$x+y$ と $xy$ を求める。',
        '$x^2+y^2=(x+y)^2-2xy$、$x^3+y^3=(x+y)^3-3xy(x+y)$ を使う。',
      ],
      solution: [
        { text: '有理化すると $x=\\sqrt5+2$、$y=\\sqrt5-2$。', math: 'x+y=2\\sqrt{5},\\qquad xy=5-4=1' },
        { text: '$x^2+y^2$ を求める。', math: '(2\\sqrt{5})^2-2\\times1=20-2=18' },
        { text: '$x^3+y^3$ を求める。', math: '(2\\sqrt{5})^3-3\\times1\\times2\\sqrt{5}=40\\sqrt{5}-6\\sqrt{5}=34\\sqrt{5}' },
      ],
      point: '$x,\\ y$ を入れかえても変わらない式（対称式）は、$x+y$ と $xy$ で表してから代入する。',
      pitfall: '$x^3+y^3=(x+y)^3$ としない。$-3xy(x+y)$ の部分が必要。',
    },
    {
      id: 'mx-realexpr-06', unit: 'realexpr', level: 'standard', pattern: 'factor', minutes: 6,
      text: '次の式を因数分解しなさい。',
      math: 'x^2+xy-2y^2+2x+7y-3',
      parts: [{ answer: '(x+[ア]y-[イ])(x-y+[ウ])' }],
      boxes: { ア: 2, イ: 1, ウ: 3 },
      hints: [
        '次数の低い文字、または1つの文字（ここでは $x$）について整理する。',
        '$x^2+(y+2)x-(2y^2-7y+3)$ とし、定数項にあたる $2y^2-7y+3$ を先に因数分解する。',
      ],
      solution: [
        { text: '$x$ について整理する。', math: 'x^2+(y+2)x-(2y^2-7y+3)' },
        { text: '$2y^2-7y+3=(2y-1)(y-3)$ なので、たして $y+2$ になるように組む。', math: '(2y-1)+\\{-(y-3)\\}=y+2' },
        { text: 'よって', math: '(x+2y-1)(x-y+3)' },
      ],
      point: '2文字の2次式は、1つの文字について降べきの順に整理し、残りを「定数」と見てたすき掛けする。',
      pitfall: '全体をいきなり組み合わせようとしない。$x$ について整理すると見通しがよくなる。',
    },
    {
      id: 'mx-realexpr-07', unit: 'realexpr', level: 'standard', pattern: 'abs', minutes: 5,
      text: '方程式 $|x-1|+|x-3|=6$ を解きなさい。解は小さい順に答えなさい。',
      parts: [{ answer: 'x=[ア],\\ [イ]' }],
      boxes: { ア: -1, イ: 5 },
      hints: [
        '絶対値の中身が $0$ になる $x=1,\\ 3$ を境に、3つの場合に分ける。',
        '場合ごとに絶対値をはずして解き、求めた解がその場合の範囲に入るかを確かめる。',
      ],
      solution: [
        { text: '$x<1$ のとき：$-(x-1)-(x-3)=6$ より $x=-1$（範囲に合う）。' },
        { text: '$1\\leqq x<3$ のとき：$(x-1)-(x-3)=2$ で、$6$ にならない。' },
        { text: '$x\\geqq3$ のとき：$(x-1)+(x-3)=6$ より $x=5$（範囲に合う）。' },
      ],
      point: '絶対値が2つ以上あるときは、中身が $0$ になる点で数直線を区切って場合分けする。',
      pitfall: '場合分けで出た解が、その場合の範囲に入っているかを確かめ忘れない。',
    },
    {
      id: 'mx-realexpr-08', unit: 'realexpr', level: 'standard', pattern: 'ineq', minutes: 5,
      text: '$x$ についての不等式 $3x-a<x$ を満たす正の整数 $x$ が、ちょうど3個となるような定数 $a$ の値の範囲を求めなさい。',
      parts: [{ answer: '[ア]<a\\leqq[イ]' }],
      boxes: { ア: 6, イ: 8 },
      hints: [
        '不等式を解くと $x<\\dfrac{a}{2}$。正の整数がちょうど3個なら、それは $1,\\ 2,\\ 3$。',
        '$3$ はふくまれ、$4$ はふくまれない：$3<\\dfrac{a}{2}\\leqq4$。端に等号がつくかを数直線で確かめる。',
      ],
      solution: [
        { text: '解くと', math: '2x<a,\\quad x<\\dfrac{a}{2}' },
        { text: '正の整数の解が $1,2,3$ だけになるのは、$\\dfrac{a}{2}$ が $3$ より大きく $4$ 以下のとき。', math: '3<\\dfrac{a}{2}\\leqq4' },
        { text: 'よって', math: '6<a\\leqq8' },
      ],
      point: '「整数解が〜個」の問題は、数直線に整数の点をかき、境目の値が入るか入らないかで等号を決める。',
      pitfall: '$\\dfrac{a}{2}=4$ のとき $x<4$ なので $4$ は入らない。だから $a=8$ はふくむ。逆に $a=6$ だと $3$ が入らない。',
    },

    // ── 集合と命題 ──
    {
      id: 'mx-setlogic-01', unit: 'setlogic', level: 'basic', pattern: 'set', minutes: 3,
      text: '全体集合を $U=\\{1,2,3,\\ldots,20\\}$ とし、$2$ の倍数の集合を $A$、$3$ の倍数の集合を $B$ とする。',
      parts: [
        { q: '$A\\cup B$ の要素の個数を求めなさい。', answer: '[ア]' },
        { q: '$\\overline{A}\\cap\\overline{B}$ の要素の個数を求めなさい。', answer: '[イ]' },
      ],
      boxes: { ア: 13, イ: 7 },
      hints: [
        '$n(A\\cup B)=n(A)+n(B)-n(A\\cap B)$。$A\\cap B$ は6の倍数の集合。',
        'ド・モルガンの法則より $\\overline{A}\\cap\\overline{B}=\\overline{A\\cup B}$。',
      ],
      solution: [
        { text: '$n(A)=10$、$n(B)=6$、$n(A\\cap B)=3$（6の倍数）。', math: 'n(A\\cup B)=10+6-3=13' },
        { text: 'ド・モルガンの法則より', math: 'n(\\overline{A}\\cap\\overline{B})=n(\\overline{A\\cup B})=20-13=7' },
      ],
      point: '和集合の個数は、重なり（共通部分）を1回引く。補集合は全体から引く。',
      pitfall: '$10+6=16$ のまま答えない。6の倍数を2回数えている。',
    },
    {
      id: 'mx-setlogic-02', unit: 'setlogic', level: 'basic', pattern: 'condition', minutes: 2,
      text: '$x$ は実数とする。「$x=2$」は「$x^2=4$」であるための何か。⓪〜③から1つ選びなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 2 },
      choices: {
        ア: {
          options: ['必要十分条件である', '必要条件であるが、十分条件ではない', '十分条件であるが、必要条件ではない', '必要条件でも十分条件でもない'],
          notes: [
            '$x^2=4$ でも $x=-2$ のことがあるので、「$x^2=4$ ならば $x=2$」は成り立たない。同値ではない。',
            '「$x^2=4$ ならば $x=2$」が偽（反例 $x=-2$）なので、必要条件ではない。',
            '「$x=2$ ならば $x^2=4$」は真、「$x^2=4$ ならば $x=2$」は偽（反例 $x=-2$）。だから十分条件であるが必要条件ではない。',
            '「$x=2$ ならば $x^2=4$」は真なので、少なくとも十分条件ではある。',
          ],
        },
      },
      hints: [
        '「$p$ ならば $q$」が真のとき、$p$ は $q$ であるための十分条件、$q$ は $p$ であるための必要条件。',
        '「$x=2\\Rightarrow x^2=4$」と「$x^2=4\\Rightarrow x=2$」の真偽を、それぞれ調べる。',
      ],
      solution: [
        { text: '$x=2\\Rightarrow x^2=4$ は真。' },
        { text: '$x^2=4\\Rightarrow x=2$ は偽（反例 $x=-2$）。' },
        { text: 'よって「$x=2$」は十分条件であるが、必要条件ではない。' },
      ],
      point: '矢印の向きで覚える：$p\\Rightarrow q$ が真なら「$p$ は十分、$q$ は必要」。',
      pitfall: '必要と十分を逆にしない。条件の範囲がせまい方（$x=2$）が十分条件になる。',
    },
    {
      id: 'mx-setlogic-03', unit: 'setlogic', level: 'basic', pattern: 'contrapositive', minutes: 3,
      text: '$x$ は実数とする。命題「$x^2\\neq1$ ならば $x\\neq1$」について答えなさい。',
      parts: [
        { q: 'この命題の対偶を、⓪〜②から1つ選びなさい。', answer: '[ア]' },
        { q: 'もとの命題の真偽を、⓪・①から選びなさい。', answer: '[イ]' },
      ],
      boxes: { ア: 1, イ: 0 },
      choices: {
        ア: {
          options: ['$x\\neq1$ ならば $x^2\\neq1$', '$x=1$ ならば $x^2=1$', '$x^2=1$ ならば $x=1$'],
          notes: [
            'これは「逆」（仮定と結論を入れかえただけ）。対偶は、入れかえたうえでどちらも否定する。',
            '仮定と結論を入れかえ、どちらも否定したもの。これが対偶。',
            'これは「裏」（仮定と結論をそれぞれ否定しただけ）。対偶は、否定したうえで仮定と結論を入れかえる。',
          ],
        },
        イ: {
          options: ['真', '偽'],
          notes: [
            '対偶「$x=1$ ならば $x^2=1$」は明らかに真。もとの命題と対偶の真偽は一致するので、もとの命題も真。',
            'もとの命題の真偽は、対偶の真偽と一致する。対偶が真なので、偽ではない。',
          ],
        },
      },
      hints: [
        '「$p$ ならば $q$」の対偶は「$q$ でないならば $p$ でない」。',
        'もとの命題と対偶は、真偽が一致する。調べやすい方で真偽を判定する。',
      ],
      solution: [
        { text: '仮定と結論を入れかえ、それぞれを否定すると「$x=1$ ならば $x^2=1$」。これが対偶。' },
        { text: '対偶は真なので、もとの命題も真。' },
      ],
      point: '直接わかりにくい命題は、対偶をつくって真偽を調べる（対偶と真偽が一致する）。',
      pitfall: '逆・裏・対偶の区別をまちがえない。逆は入れかえるだけ、裏は否定するだけ、対偶は両方。',
    },
    {
      id: 'mx-setlogic-04', unit: 'setlogic', level: 'basic', pattern: 'set', minutes: 3,
      text: '1から100までの整数のうち、4でも6でもわり切れない整数は何個あるか。',
      parts: [{ answer: '[ア]\\ \\text{個}' }],
      boxes: { ア: 67 },
      hints: [
        '4でわり切れる数の集合を $A$、6でわり切れる数の集合を $B$ とすると、求めるのは $\\overline{A\\cup B}$ の個数。',
        '$A\\cap B$ は、4と6の最小公倍数12でわり切れる数。',
      ],
      solution: [
        { text: '$n(A)=25$、$n(B)=16$、$n(A\\cap B)=8$。', math: 'n(A\\cup B)=25+16-8=33' },
        { text: '全体から引く。', math: '100-33=67' },
      ],
      point: '「〜でも〜でもない」は、「〜または〜」の補集合として数える。',
      pitfall: '$A\\cap B$ を $4\\times6=24$ の倍数としない。共通部分は最小公倍数12の倍数。',
    },
    {
      id: 'mx-setlogic-05', unit: 'setlogic', level: 'standard', pattern: 'condition', minutes: 3,
      text: '$x$ は実数とする。「$|x|<2$」は「$-3<x<3$」であるための何か。⓪〜③から1つ選びなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 1 },
      choices: {
        ア: {
          options: ['必要条件であるが、十分条件ではない', '十分条件であるが、必要条件ではない', '必要十分条件である', '必要条件でも十分条件でもない'],
          notes: [
            '「$-3<x<3$ ならば $|x|<2$」は偽（反例 $x=2.5$）なので、必要条件ではない。',
            '$|x|<2$ は $-2<x<2$。この範囲は $-3<x<3$ にふくまれるので「ならば」が真。逆は偽なので十分条件だけ。',
            '2つの範囲は等しくないので、必要十分条件ではない。',
            '「$|x|<2$ ならば $-3<x<3$」は真なので、少なくとも十分条件である。',
          ],
        },
      },
      hints: [
        '$|x|<2$ を、絶対値を使わない形に直す。',
        '範囲の包含関係を数直線で見る。せまい範囲 ⇒ 広い範囲 が成り立つ。',
      ],
      solution: [
        { text: '$|x|<2$ は $-2<x<2$。' },
        { text: '$\\{x\\mid-2<x<2\\}\\subset\\{x\\mid-3<x<3\\}$ なので「$|x|<2\\Rightarrow-3<x<3$」は真、逆は偽（反例 $x=2.5$）。' },
        { text: 'よって十分条件であるが、必要条件ではない。' },
      ],
      point: '条件を集合（範囲）で表すと、包含関係から必要・十分がすぐ判定できる。',
      pitfall: '範囲の広い方を十分条件と取りちがえない。含まれる方（せまい方）が十分条件。',
    },
    {
      id: 'mx-setlogic-06', unit: 'setlogic', level: 'standard', pattern: 'condition', minutes: 3,
      text: '$x,\\ y$ は実数とする。「$xy=0$」は「$x=0$」であるための何か。⓪〜③から1つ選びなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 0 },
      choices: {
        ア: {
          options: ['必要条件であるが、十分条件ではない', '十分条件であるが、必要条件ではない', '必要十分条件である', '必要条件でも十分条件でもない'],
          notes: [
            '「$x=0\\Rightarrow xy=0$」は真、「$xy=0\\Rightarrow x=0$」は偽（反例 $x=1,\\ y=0$）。だから $xy=0$ は必要条件。',
            '「$xy=0\\Rightarrow x=0$」は偽（反例 $x=1,\\ y=0$）なので、十分条件ではない。',
            '$xy=0$ は「$x=0$ または $y=0$」で、$x=0$ とは同じではない。',
            '「$x=0\\Rightarrow xy=0$」は真なので、少なくとも必要条件である。',
          ],
        },
      },
      hints: [
        '$xy=0$ は「$x=0$ または $y=0$」と同じ。',
        '「$xy=0\\Rightarrow x=0$」と「$x=0\\Rightarrow xy=0$」の真偽を調べる。',
      ],
      solution: [
        { text: '$x=0\\Rightarrow xy=0$ は真。' },
        { text: '$xy=0\\Rightarrow x=0$ は偽（反例 $x=1,\\ y=0$）。' },
        { text: 'よって $xy=0$ は $x=0$ であるための必要条件であるが、十分条件ではない。' },
      ],
      point: '「積が0」は「どちらかが0」。「または」をふくむ条件は範囲が広く、必要条件になりやすい。',
      pitfall: '「$xy=0$ なら $x=0$ かつ $y=0$」と読みちがえない。',
    },
    {
      id: 'mx-setlogic-07', unit: 'setlogic', level: 'standard', pattern: 'set', minutes: 4,
      text: '40人のクラスで、数学が好きな人は23人、英語が好きな人は18人、どちらも好きでない人は7人だった。',
      parts: [
        { q: '数学と英語の両方が好きな人は何人か。', answer: '[ア]\\ \\text{人}' },
        { q: '数学だけが好きな人は何人か。', answer: '[イ]\\ \\text{人}' },
      ],
      boxes: { ア: 8, イ: 15 },
      hints: [
        'どちらか一方でも好きな人（和集合）は、全体からどちらも好きでない人を引いた人数。',
        '$n(A\\cap B)=n(A)+n(B)-n(A\\cup B)$。',
      ],
      solution: [
        { text: '数学が好きな人の集合を $A$、英語を $B$ とする。', math: 'n(A\\cup B)=40-7=33' },
        { text: '両方が好きな人は', math: 'n(A\\cap B)=23+18-33=8' },
        { text: '数学だけが好きな人は', math: '23-8=15' },
      ],
      point: 'ベン図をかいて、わかっている人数を書きこむと整理しやすい。',
      pitfall: '「数学だけ」を23人としない。23人には両方好きな人がふくまれている。',
    },
    {
      id: 'mx-setlogic-08', unit: 'setlogic', level: 'standard', pattern: 'proof', minutes: 5,
      text: '$\\sqrt{2}$ が無理数であることを背理法で証明する。',
      parts: [
        { q: '最初に仮定することを、⓪〜②から1つ選びなさい。', answer: '[ア]' },
        { q: '証明の途中で $p^2=2q^2$ から $p$ が偶数とわかり、$p=2k$（$k$ は自然数）とおく。このとき $q^2$ を $k$ で表しなさい。', answer: 'q^2=[イ]k^2' },
      ],
      boxes: { ア: 0, イ: 2 },
      choices: {
        ア: {
          options: [
            '$\\sqrt2$ は有理数であり、$\\sqrt2=\\dfrac{p}{q}$（$p,\\ q$ は互いに素な自然数）と表せる',
            '$\\sqrt2$ は無理数である',
            '$\\sqrt2$ は $\\dfrac{p}{q}$ の形には表せない',
          ],
          notes: [
            '背理法では、証明したいこと（無理数である）を否定して「有理数である」と仮定し、矛盾を導く。',
            'これは証明したい結論そのもの。背理法では結論を否定したことから始める。',
            '「分数で表せない」は無理数であることと同じで、結論を否定していない。',
          ],
        },
      },
      hints: [
        '背理法は「結論を否定して、矛盾を導く」証明法。',
        '$p=2k$ を $p^2=2q^2$ に代入して、$q^2$ について解く。',
      ],
      solution: [
        { text: '$\\sqrt2$ が有理数であると仮定し、$\\sqrt2=\\dfrac{p}{q}$（互いに素な自然数）とおく。両辺を2乗して $p^2=2q^2$。' },
        { text: '$p^2$ が偶数なので $p$ も偶数。$p=2k$ とおく。', math: '4k^2=2q^2,\\quad q^2=2k^2' },
        { text: 'すると $q$ も偶数になり、「互いに素」に矛盾する。よって $\\sqrt2$ は無理数。' },
      ],
      point: '背理法は、否定した仮定から矛盾（ここでは「互いに素」なのに両方偶数）を導く。',
      pitfall: '「互いに素」という条件を最初につけておかないと、矛盾が導けない。',
    },

    // ── 二次関数 ──
    {
      id: 'mx-qfn-01', unit: 'qfn', level: 'basic', pattern: 'vertex', minutes: 2,
      text: '放物線 $y=2x^2-8x+5$ の頂点の座標を求めなさい。',
      parts: [{ answer: '([ア],\\ [イ])' }],
      boxes: { ア: 2, イ: -3 },
      hints: [
        '平方完成して $y=a(x-p)^2+q$ の形にすると、頂点は $(p,\\ q)$。',
        'まず $x^2$ の係数 $2$ で、$x$ の項までをくくる：$2(x^2-4x)+5$。',
      ],
      solution: [
        { text: '平方完成する。', math: '2(x^2-4x)+5=2\\{(x-2)^2-4\\}+5=2(x-2)^2-3' },
        { text: '頂点は $(2,\\ -3)$。' },
      ],
      point: '平方完成は「係数でくくる → $(x-p)^2$ をつくる → はみ出た分を引く」の順。',
      pitfall: 'くくった係数 $2$ を $-4$ にかけ忘れて $(x-2)^2+1$ としない。',
    },
    {
      id: 'mx-qfn-02', unit: 'qfn', level: 'basic', pattern: 'maxmin', minutes: 3,
      text: '関数 $y=x^2-4x+1\\ (0\\leqq x\\leqq5)$ の最大値と最小値を求めなさい。',
      parts: [
        { q: '最大値とそのときの $x$', answer: '[ア]\\quad(x=[イ])' },
        { q: '最小値とそのときの $x$', answer: '[ウ]\\quad(x=[エ])' },
      ],
      boxes: { ア: 6, イ: 5, ウ: -3, エ: 2 },
      hints: [
        '平方完成して頂点を求め、定義域の中に頂点があるかを確かめる。',
        '下に凸のグラフなので、最大値は軸から遠い方の端でとる。',
      ],
      solution: [
        { text: '平方完成する。', math: 'y=(x-2)^2-3' },
        { text: '軸 $x=2$ は定義域の中なので、最小値は頂点の $-3$（$x=2$）。' },
        { text: '軸から遠い端は $x=5$。', math: 'y=5^2-4\\times5+1=6' },
      ],
      point: '定義域のある2次関数は、グラフをかいて「軸の位置」と「両端」を比べる。',
      pitfall: '両端の値だけで最小値を決めない。軸が定義域にあれば、頂点が最小。',
    },
    {
      id: 'mx-qfn-03', unit: 'qfn', level: 'basic', pattern: 'determine', minutes: 3,
      text: '放物線が3点 $(0,\\ -6)$、$(1,\\ 0)$、$(-3,\\ 0)$ を通るとき、その2次関数を求めなさい。',
      parts: [{ answer: 'y=[ア]x^2+[イ]x-[ウ]' }],
      boxes: { ア: 2, イ: 4, ウ: 6 },
      hints: [
        '$x$ 軸との交点が2つわかっているので、$y=a(x-1)(x+3)$ とおける。',
        '残りの点 $(0,\\ -6)$ を代入して $a$ を求める。',
      ],
      solution: [
        { text: '$y=a(x-1)(x+3)$ に $(0,\\ -6)$ を代入する。', math: '-6=a\\times(-1)\\times3,\\quad a=2' },
        { text: '展開する。', math: 'y=2(x-1)(x+3)=2x^2+4x-6' },
      ],
      point: '$x$ 軸との交点がわかっているときは $y=a(x-\\alpha)(x-\\beta)$ とおくと、未知数が1つで済む。',
      pitfall: '3点をすべて $y=ax^2+bx+c$ に代入してもよいが、文字が3つの連立方程式になり、計算が重くなる。',
    },
    {
      id: 'mx-qfn-04', unit: 'qfn', level: 'basic', pattern: 'ineq', minutes: 2,
      text: '2次不等式 $x^2-x-6<0$ を解きなさい。',
      parts: [{ answer: '[ア]<x<[イ]' }],
      boxes: { ア: -2, イ: 3 },
      hints: [
        'まず $x^2-x-6=0$ を解いて、グラフと $x$ 軸の交点を求める。',
        '下に凸の放物線が $x$ 軸より下（$y<0$）になるのは、2つの交点の間。',
      ],
      solution: [
        { text: '因数分解する。', math: '(x+2)(x-3)<0' },
        { text: 'グラフが $x$ 軸より下になるのは、2解の間。', math: '-2<x<3' },
      ],
      point: '2次不等式は、グラフと $x$ 軸の位置関係で解く。「$<0$ は間」「$>0$ は外側」（$x^2$ の係数が正のとき）。',
      pitfall: '「$x<-2,\\ 3<x$」としない。それは $>0$ のときの解。',
    },
    {
      id: 'mx-qfn-05', unit: 'qfn', level: 'standard', pattern: 'maxmin', minutes: 8,
      text: '$a$ を定数とする。関数 $f(x)=x^2-2ax+3\\ (0\\leqq x\\leqq2)$ の最小値が $-6$ となるような $a$ の値を求めなさい。',
      parts: [{ answer: 'a=\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 13, イ: 4 },
      hints: [
        '平方完成すると $f(x)=(x-a)^2-a^2+3$。軸 $x=a$ が定義域の左・中・右のどこにあるかで場合分けする。',
        '場合ごとに最小値を $a$ で表し、$-6$ とおいて解く。解がその場合の条件に合うかを確かめる。',
      ],
      solution: [
        { text: '$a<0$ のとき、最小値は $f(0)=3$。$-6$ にならない。' },
        { text: '$0\\leqq a\\leqq2$ のとき、最小値は $f(a)=3-a^2$。$3-a^2=-6$ より $a=\\pm3$ で、条件に合わない。' },
        { text: '$a>2$ のとき、最小値は $f(2)=7-4a$。', math: '7-4a=-6,\\quad a=\\dfrac{13}{4}\\ (>2)' },
      ],
      point: '軸に文字をふくむ最大・最小は、「軸が定義域の左・中・右」の3つに場合分けする。',
      pitfall: '頂点の値 $3-a^2=-6$ だけを解いて $a=3$ としない。$a=3$ では軸が定義域の外にあり、頂点で最小にならない。',
    },
    {
      id: 'mx-qfn-06', unit: 'qfn', level: 'standard', pattern: 'intersect', minutes: 4,
      text: '放物線 $y=x^2-2kx+3k+4$ が $x$ 軸と共有点をもたないような、定数 $k$ の値の範囲を求めなさい。',
      parts: [{ answer: '[ア]<k<[イ]' }],
      boxes: { ア: -1, イ: 4 },
      hints: [
        '共有点をもたない ⇔ $x^2-2kx+3k+4=0$ が実数解をもたない ⇔ 判別式 $D<0$。',
        '$\\dfrac{D}{4}=k^2-(3k+4)$ を計算して、2次不等式を解く。',
      ],
      solution: [
        { text: '判別式を求める。', math: '\\dfrac{D}{4}=k^2-3k-4=(k+1)(k-4)' },
        { text: '$D<0$ を解く。', math: '-1<k<4' },
      ],
      point: 'グラフと $x$ 軸の共有点の個数は、判別式の符号で決まる（$D>0$ で2個、$D=0$ で1個、$D<0$ で0個）。',
      pitfall: '$\\dfrac{D}{4}$ と $D$ を混同しない。$x$ の係数が $-2k$ のとき、$\\dfrac{D}{4}$ は係数の半分 $-k$ の2乗から $ac$ を引いた値。',
    },
    {
      id: 'mx-qfn-07', unit: 'qfn', level: 'standard', pattern: 'intersect', minutes: 7,
      text: '2次方程式 $x^2-2mx+m+2=0$ が、異なる2つの正の解をもつような、定数 $m$ の値の範囲を求めなさい。',
      parts: [{ answer: 'm>[ア]' }],
      boxes: { ア: 2 },
      hints: [
        '$f(x)=x^2-2mx+m+2$ のグラフが、$x>0$ の部分で $x$ 軸と2点で交わる条件を考える。',
        '3つの条件：判別式 $D>0$、軸 $x=m>0$、$f(0)>0$。',
      ],
      solution: [
        { text: '$\\dfrac{D}{4}=m^2-m-2=(m+1)(m-2)>0$ より $m<-1$ または $m>2$。' },
        { text: '軸 $x=m$ が正：$m>0$。$f(0)=m+2>0$：$m>-2$。' },
        { text: '3つの共通部分は', math: 'm>2' },
      ],
      point: '解の配置は「判別式・軸の位置・端点の値」の3つの条件をグラフから読みとる。',
      pitfall: '判別式だけで終わらない。2つの解がどちらも正であることは、軸と $f(0)$ の条件で決まる。',
    },
    {
      id: 'mx-qfn-08', unit: 'qfn', level: 'standard', pattern: 'vertex', minutes: 4,
      text: '放物線 $y=x^2-4x+3$ を、$x$ 軸方向に $3$、$y$ 軸方向に $-2$ だけ平行移動した放物線の方程式を求めなさい。',
      parts: [{ answer: 'y=x^2-[ア]x+[イ]' }],
      boxes: { ア: 10, イ: 22 },
      hints: [
        'もとの放物線の頂点を求め、その頂点を移動させる。',
        '頂点を $(p,\\ q)$ とすると、$y=(x-p)^2+q$ の形で書いてから展開する。',
      ],
      solution: [
        { text: 'もとの頂点は、$y=(x-2)^2-1$ より $(2,\\ -1)$。' },
        { text: '移動後の頂点は $(5,\\ -3)$。', math: 'y=(x-5)^2-3=x^2-10x+22' },
      ],
      point: '平行移動では形（$x^2$ の係数）は変わらない。頂点だけを動かす。',
      pitfall: '$x$ 軸方向に $3$ 動かすとき、$x$ を $x+3$ におきかえない。$x-3$ におきかえる。',
    },

    // ── 三角比 ──
    {
      id: 'mx-trig-01', unit: 'trig', level: 'basic', pattern: 'ratio', minutes: 2,
      text: '$0^\\circ<\\theta<90^\\circ$ で、$\\sin\\theta=\\dfrac{3}{5}$ のとき、$\\cos\\theta$ と $\\tan\\theta$ の値を求めなさい。',
      parts: [{ answer: '\\cos\\theta=\\dfrac{[ア]}{[イ]},\\quad\\tan\\theta=\\dfrac{[ウ]}{[エ]}' }],
      boxes: { ア: 4, イ: 5, ウ: 3, エ: 4 },
      hints: [
        '$\\sin^2\\theta+\\cos^2\\theta=1$ を使う。$0^\\circ<\\theta<90^\\circ$ なので $\\cos\\theta>0$。',
        '$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}$。',
      ],
      solution: [
        { text: '$\\cos\\theta$ を求める。', math: '\\cos^2\\theta=1-\\dfrac{9}{25}=\\dfrac{16}{25},\\quad\\cos\\theta=\\dfrac{4}{5}' },
        { text: '$\\tan\\theta$ を求める。', math: '\\tan\\theta=\\dfrac{3}{5}\\div\\dfrac{4}{5}=\\dfrac{3}{4}' },
      ],
      point: '三角比の相互関係 $\\sin^2\\theta+\\cos^2\\theta=1$、$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}$ を使い、符号は角の範囲で決める。',
      pitfall: '$\\cos\\theta=\\pm\\dfrac45$ の符号を、$\\theta$ の範囲で1つに決め忘れない。',
    },
    {
      id: 'mx-trig-02', unit: 'trig', level: 'basic', pattern: 'sine', minutes: 3,
      text: '$\\triangle$ABC で、$a=6$、$A=30^\\circ$、$B=45^\\circ$ である。',
      parts: [
        { q: '外接円の半径 $R$ を求めなさい。', answer: 'R=[ア]' },
        { q: '$b$ を求めなさい。', answer: 'b=[イ]\\sqrt{[ウ]}' },
      ],
      boxes: { ア: 6, イ: 6, ウ: 2 },
      hints: [
        '正弦定理 $\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}=2R$。',
        '$\\sin30^\\circ=\\dfrac12$、$\\sin45^\\circ=\\dfrac{\\sqrt2}{2}$。',
      ],
      solution: [
        { text: '正弦定理より', math: '2R=\\dfrac{6}{\\sin30^\\circ}=12,\\quad R=6' },
        { text: '$b=2R\\sin B$。', math: 'b=12\\times\\dfrac{\\sqrt{2}}{2}=6\\sqrt{2}' },
      ],
      point: '「1組の辺と向かいの角」がわかれば、正弦定理で外接円の半径やほかの辺が求まる。',
      pitfall: '正弦定理の右辺は $2R$。$R$ と取りちがえて $12$ としない。',
    },
    {
      id: 'mx-trig-03', unit: 'trig', level: 'basic', pattern: 'cosine', minutes: 2,
      text: '$\\triangle$ABC で、$b=5$、$c=8$、$A=60^\\circ$ のとき、$a$ を求めなさい。',
      parts: [{ answer: 'a=[ア]' }],
      boxes: { ア: 7 },
      hints: [
        '2辺とその間の角がわかっているので、余弦定理を使う。',
        '$a^2=b^2+c^2-2bc\\cos A$。',
      ],
      solution: [
        { text: '余弦定理より', math: 'a^2=25+64-2\\times5\\times8\\times\\dfrac{1}{2}=49' },
        { text: '$a>0$ なので $a=7$。' },
      ],
      point: '2辺とその間の角 → 余弦定理で残りの辺。',
      pitfall: '$\\cos60^\\circ=\\dfrac12$ をかけ忘れて $a^2=89-80$ としない。',
    },
    {
      id: 'mx-trig-04', unit: 'trig', level: 'basic', pattern: 'area', minutes: 2,
      text: '$\\triangle$ABC で、$b=6$、$c=5$、$A=120^\\circ$ のとき、面積 $S$ を求めなさい。',
      parts: [{ answer: 'S=\\dfrac{[ア]\\sqrt{[イ]}}{[ウ]}' }],
      boxes: { ア: 15, イ: 3, ウ: 2 },
      hints: [
        '2辺とその間の角がわかるときの面積は $S=\\dfrac12bc\\sin A$。',
        '$\\sin120^\\circ=\\sin60^\\circ=\\dfrac{\\sqrt3}{2}$。',
      ],
      solution: [
        { text: '$A=120^\\circ$ は辺 $b$ と辺 $c$ の間の角なので、$S=\\dfrac12bc\\sin A$ が使える。$\\sin120^\\circ=\\dfrac{\\sqrt3}{2}$。' },
        { text: '公式に代入する。', math: 'S=\\dfrac{1}{2}\\times6\\times5\\times\\dfrac{\\sqrt{3}}{2}=\\dfrac{15\\sqrt{3}}{2}' },
      ],
      point: '三角形の面積 $S=\\dfrac12bc\\sin A$ は、高さを求めなくても使える。',
      pitfall: '$\\sin120^\\circ$ を負の数にしない。$0^\\circ<A<180^\\circ$ では $\\sin A>0$。',
    },
    {
      id: 'mx-trig-05', unit: 'trig', level: 'standard', pattern: 'area', minutes: 6,
      text: '$\\triangle$ABC で、$a=7$、$b=5$、$c=3$ である。',
      parts: [
        { q: '角 $A$ を求めなさい。', answer: 'A=[ア]^\\circ' },
        { q: '面積 $S$ を求めなさい。', answer: 'S=\\dfrac{[イ]\\sqrt{[ウ]}}{[エ]}' },
        { q: '内接円の半径 $r$ を求めなさい。', answer: 'r=\\dfrac{\\sqrt{[オ]}}{[カ]}' },
      ],
      boxes: { ア: 120, イ: 15, ウ: 3, エ: 4, オ: 3, カ: 2 },
      hints: [
        '3辺がわかっているので、余弦定理で $\\cos A$ を求める。',
        '内接円の半径は $S=\\dfrac12r(a+b+c)$ から求める。',
      ],
      solution: [
        { text: '余弦定理より', math: '\\cos A=\\dfrac{25+9-49}{2\\times5\\times3}=-\\dfrac{1}{2},\\quad A=120^\\circ' },
        { text: '面積。', math: 'S=\\dfrac{1}{2}\\times5\\times3\\times\\sin120^\\circ=\\dfrac{15\\sqrt{3}}{4}' },
        { text: '$S=\\dfrac12r(a+b+c)=\\dfrac{15}{2}r$ より', math: 'r=\\dfrac{15\\sqrt{3}}{4}\\times\\dfrac{2}{15}=\\dfrac{\\sqrt{3}}{2}' },
      ],
      point: '3辺 → 余弦定理で角 → 面積 → 内接円の半径、の順に求める典型の流れ。',
      pitfall: '$\\cos A$ が負のとき、$A$ は鈍角。$60^\\circ$ としない。',
    },
    {
      id: 'mx-trig-06', unit: 'trig', level: 'standard', pattern: 'ratio', minutes: 4,
      text: '$0^\\circ\\leqq\\theta\\leqq180^\\circ$ のとき、方程式 $2\\sin^2\\theta-3\\cos\\theta=0$ を解きなさい。',
      parts: [{ answer: '\\theta=[ア]^\\circ' }],
      boxes: { ア: 60 },
      hints: [
        '$\\sin^2\\theta=1-\\cos^2\\theta$ を使って、$\\cos\\theta$ だけの式にする。',
        '$\\cos\\theta=t$ とおくと $t$ の2次方程式。$-1\\leqq t\\leqq1$ に注意。',
      ],
      solution: [
        { text: '$\\cos\\theta$ だけの式にする。', math: '2(1-\\cos^2\\theta)-3\\cos\\theta=0,\\quad2\\cos^2\\theta+3\\cos\\theta-2=0' },
        { text: '因数分解する。', math: '(2\\cos\\theta-1)(\\cos\\theta+2)=0' },
        { text: '$-1\\leqq\\cos\\theta\\leqq1$ なので $\\cos\\theta=\\dfrac12$、$\\theta=60^\\circ$。' },
      ],
      point: '$\\sin$ と $\\cos$ がまざった方程式は、相互関係で1種類にそろえて2次方程式にする。',
      pitfall: '$\\cos\\theta=-2$ を解として残さない。$\\cos\\theta$ は $-1$ 以上 $1$ 以下。',
    },
    {
      id: 'mx-trig-07', unit: 'trig', level: 'standard', pattern: 'sine', minutes: 5,
      text: '$\\triangle$ABC で、$A=60^\\circ$、$b=3$、$c=8$ である。',
      parts: [
        { q: '$a$ を求めなさい。', answer: 'a=[ア]' },
        { q: '外接円の半径 $R$ を求めなさい。', answer: 'R=\\dfrac{[イ]\\sqrt{[ウ]}}{[エ]}' },
      ],
      boxes: { ア: 7, イ: 7, ウ: 3, エ: 3 },
      hints: [
        'まず余弦定理で $a$ を求める。',
        '$a$ と $A$ がそろったら、正弦定理 $\\dfrac{a}{\\sin A}=2R$。',
      ],
      solution: [
        { text: '余弦定理より', math: 'a^2=9+64-2\\times3\\times8\\times\\dfrac12=49,\\quad a=7' },
        { text: '正弦定理より', math: '2R=\\dfrac{7}{\\sin60^\\circ}=\\dfrac{14}{\\sqrt{3}},\\quad R=\\dfrac{7}{\\sqrt{3}}=\\dfrac{7\\sqrt{3}}{3}' },
      ],
      point: '余弦定理と正弦定理を組み合わせる。「向かい合う辺と角の組」ができたら正弦定理。',
      pitfall: '$R=\\dfrac{7}{\\sqrt3}$ のまま答えない。分母を有理化する。',
    },
    {
      id: 'mx-trig-08', unit: 'trig', level: 'standard', pattern: 'measure', minutes: 6,
      text: '図のように、塔の先端Pを地点Aから見上げた角は $30^\\circ$ で、塔に向かってまっすぐ $20$ m 進んだ地点Bから見上げた角は $45^\\circ$ だった。A、B、塔の根もとHは一直線上にある。塔の高さPHを求めなさい。',
      figure: {
        label: '塔PHと、地面の直線上の2点A、B。Aから見上げた角が30度、Bから見上げた角が45度、ABが20m',
        size: [320, 190],
        view: [-50, 4, -5, 31],
        points: { A: [-TOWER_H * Math.sqrt(3), 0], B: [-TOWER_H, 0], H: [0, 0], P: [0, TOWER_H] },
        labels: { A: 's', B: 's', H: 's', P: 'n' },
        segments: [['A', 'H'], ['H', 'P'], ['A', 'P'], ['B', 'P']],
        rights: [{ at: 'H', from: 'A', to: 'P' }],
        angles: [{ at: 'A', from: 'H', to: 'P', label: '30°', r: 30 }, { at: 'B', from: 'H', to: 'P', label: '45°', r: 22 }],
        texts: [{ at: [(-TOWER_H * Math.sqrt(3) - TOWER_H) / 2, -3.2], text: '20 m', size: 11 }],
      },
      parts: [{ answer: '[ア]\\sqrt{[イ]}+[ウ]\\ \\text{m}' }],
      boxes: { ア: 10, イ: 3, ウ: 10 },
      hints: [
        'PH＝$h$ とおくと、直角三角形PBHで BH＝$h$、直角三角形PAHで AH＝$\\sqrt3h$。',
        'AH－BH＝20 から $h$ を求め、分母を有理化する。',
      ],
      solution: [
        { text: '$\\angle$PBH$=45^\\circ$ より BH＝$h$。$\\angle$PAH$=30^\\circ$ より AH＝$\\dfrac{h}{\\tan30^\\circ}=\\sqrt{3}h$。' },
        { text: 'AB＝AH－BH＝20。', math: '\\sqrt{3}h-h=20,\\quad h=\\dfrac{20}{\\sqrt{3}-1}' },
        { text: '有理化する。', math: 'h=\\dfrac{20(\\sqrt{3}+1)}{2}=10\\sqrt{3}+10' },
      ],
      point: '測量の問題は、見えない長さを文字でおき、直角三角形ごとに $\\tan$ で辺の関係を書く。',
      pitfall: 'AB（20 m）を直角三角形の辺と思いこまない。AHとBHの差が20 m。',
    },

    // ── データの分析 ──
    {
      id: 'mx-dataI-01', unit: 'dataI', level: 'basic', pattern: 'variance', minutes: 3,
      text: '5個のデータ $4,\\ 6,\\ 8,\\ 10,\\ 12$ の平均値、分散、標準偏差を求めなさい。',
      parts: [{ answer: '\\text{平均値}\\ [ア],\\quad\\text{分散}\\ [イ],\\quad\\text{標準偏差}\\ [ウ]\\sqrt{[エ]}' }],
      boxes: { ア: 8, イ: 8, ウ: 2, エ: 2 },
      hints: [
        '分散は「偏差（値－平均値）の2乗の平均」。',
        '標準偏差は分散の正の平方根。',
      ],
      solution: [
        { text: '平均値は', math: '\\dfrac{4+6+8+10+12}{5}=8' },
        { text: '偏差は $-4,-2,0,2,4$。', math: '\\text{分散}=\\dfrac{16+4+0+4+16}{5}=8' },
        { text: '標準偏差は', math: '\\sqrt{8}=2\\sqrt{2}' },
      ],
      point: '分散＝（偏差の2乗）の平均、または（2乗の平均）－（平均の2乗）。',
      pitfall: '偏差をそのまま平均しない。偏差の和はいつも $0$ になる。',
    },
    {
      id: 'mx-dataI-02', unit: 'dataI', level: 'basic', pattern: 'transform', minutes: 2,
      text: '変量 $x$ のデータの平均値が $5$、分散が $4$ である。$y=3x-2$ で新しい変量 $y$ をつくるとき、$y$ の平均値、分散、標準偏差を求めなさい。',
      parts: [{ answer: '\\text{平均値}\\ [ア],\\quad\\text{分散}\\ [イ],\\quad\\text{標準偏差}\\ [ウ]' }],
      boxes: { ア: 13, イ: 36, ウ: 6 },
      hints: [
        '$y=ax+b$ のとき、平均値は $a\\bar{x}+b$、分散は $a^2$ 倍、標準偏差は $|a|$ 倍。',
        '$+b$（ずらすこと）は、分散・標準偏差には影響しない。',
      ],
      solution: [
        { text: '平均値。', math: '3\\times5-2=13' },
        { text: '分散は $3^2$ 倍、標準偏差は $3$ 倍。', math: '\\text{分散}=9\\times4=36,\\qquad\\text{標準偏差}=3\\times2=6' },
      ],
      point: '変量の変換で、散らばり（分散・標準偏差）は「かける数」だけで決まる。',
      pitfall: '分散を $3\\times4-2$ としない。分散は $a^2$ 倍で、$b$ は関係ない。',
    },
    {
      id: 'mx-dataI-03', unit: 'dataI', level: 'basic', pattern: 'correlation', minutes: 2,
      text: '図は、ある10人の2つの変量 $x,\\ y$ の散布図である。$x$ と $y$ の相関係数に最も近い値を、⓪〜③から1つ選びなさい。',
      figure: {
        label: '10個の点の散布図。右下がりに、ほぼ一直線に並んでいる',
        size: [280, 220],
        view: [-0.5, 11, -0.5, 10.5],
        axes: { x: 'x', y: 'y' },
        points: {},
        dots: SCATTER,
      },
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 0 },
      choices: {
        ア: {
          options: ['$-0.9$', '$-0.2$', '$0.3$', '$0.9$'],
          notes: [
            '点が右下がりの直線の近くに集まっているので、強い負の相関。相関係数は $-1$ に近い。',
            '$-0.2$ は、ほとんど相関がない（点がばらばらに散らばる）ときの値。',
            '$0.3$ は弱い正の相関。この散布図は右下がり。',
            '$0.9$ は強い正の相関で、右上がりの散布図になる。',
          ],
        },
      },
      hints: [
        '右上がりの傾向なら正の相関、右下がりなら負の相関。',
        '点が直線に近く集まるほど、相関係数の絶対値は $1$ に近い。',
      ],
      solution: [
        { text: '点は右下がりで、直線の近くに集まっている。強い負の相関なので、相関係数は $-1$ に近い。' },
        { text: '最も近いのは $-0.9$。' },
      ],
      point: '相関係数は $-1$ 以上 $1$ 以下。符号は傾向の向き、絶対値は直線への集まり具合。',
      pitfall: '点の数や散らばりの広さではなく、直線への集まり具合と向きを見る。',
    },
    {
      id: 'mx-dataI-04', unit: 'dataI', level: 'basic', pattern: 'outlier', minutes: 2,
      text: 'あるデータの第1四分位数が $20$、第3四分位数が $30$ である。「第1四分位数－1.5×四分位範囲」以下、または「第3四分位数＋1.5×四分位範囲」以上の値を外れ値とするとき、外れ値となる値の範囲を答えなさい。',
      parts: [{ answer: 'x\\leqq[ア]\\ \\text{または}\\ x\\geqq[イ]' }],
      boxes: { ア: 5, イ: 45 },
      hints: [
        '四分位範囲＝第3四分位数－第1四分位数。',
        '四分位範囲の1.5倍を、第1四分位数から引き、第3四分位数に足す。',
      ],
      solution: [
        { text: '四分位範囲は $30-20=10$、その1.5倍は $15$。' },
        { text: '基準は', math: '20-15=5,\\qquad30+15=45' },
      ],
      point: '外れ値の目安は「四分位範囲の1.5倍」だけ箱の外にはみ出した値。',
      pitfall: '平均値や範囲を使わない。基準は四分位数と四分位範囲。',
    },
    {
      id: 'mx-dataI-05', unit: 'dataI', level: 'standard', pattern: 'correlation', minutes: 6,
      text: '5人の2つの変量 $x,\\ y$ のデータが次のようになった。$x$ と $y$ の共分散と相関係数を求めなさい。',
      math: '\\begin{array}{c|ccccc}x&2&4&6&8&10\\\\\\hline y&3&7&5&11&9\\end{array}',
      parts: [{ answer: '\\text{共分散}\\ [ア].[イ],\\quad\\text{相関係数}\\ 0.[ウ]' }],
      boxes: { ア: 6, イ: 4, ウ: 8 },
      hints: [
        '平均値を求め、$x$ と $y$ の偏差の積の平均が共分散。',
        '相関係数＝共分散÷（$x$ の標準偏差×$y$ の標準偏差）。',
      ],
      solution: [
        { text: '平均値は $\\bar{x}=6$、$\\bar{y}=7$。偏差は $x:-4,-2,0,2,4$、$y:-4,0,-2,4,2$。' },
        { text: '共分散は', math: '\\dfrac{16+0+0+8+8}{5}=6.4' },
        { text: '分散はどちらも $8$ なので、標準偏差はどちらも $2\\sqrt2$。', math: 'r=\\dfrac{6.4}{2\\sqrt{2}\\times2\\sqrt{2}}=\\dfrac{6.4}{8}=0.8' },
      ],
      point: '表に偏差・偏差の2乗・偏差の積を書き出すと、共分散と相関係数が一度に計算できる。',
      pitfall: '共分散を標準偏差の積でなく分散の積でわらない。分母は標準偏差の積。',
    },
    {
      id: 'mx-dataI-06', unit: 'dataI', level: 'standard', pattern: 'variance', minutes: 6,
      text: 'グループAの5人の得点は平均値 $6$、分散 $4$、グループBの5人の得点は平均値 $10$、分散 $8$ である。2つのグループを合わせた10人の得点の平均値と分散を求めなさい。',
      parts: [{ answer: '\\text{平均値}\\ [ア],\\quad\\text{分散}\\ [イ]' }],
      boxes: { ア: 8, イ: 10 },
      hints: [
        '分散＝（2乗の平均）－（平均の2乗）を使うと、各グループの「2乗の平均」がわかる。',
        '2乗の平均は人数が同じなので、2つのグループの平均をとればよい。',
      ],
      solution: [
        { text: '全体の平均値は', math: '\\dfrac{6\\times5+10\\times5}{10}=8' },
        { text: '2乗の平均：A は $4+6^2=40$、B は $8+10^2=108$。全体は', math: '\\dfrac{40+108}{2}=74' },
        { text: '全体の分散は', math: '74-8^2=10' },
      ],
      point: 'グループを合わせた分散は、各グループの「2乗の平均」を経由して求める。',
      pitfall: '分散どうしの平均 $\\dfrac{4+8}{2}=6$ としない。平均値のずれの分だけ、全体の散らばりは大きくなる。',
    },
    {
      id: 'mx-dataI-07', unit: 'dataI', level: 'standard', pattern: 'transform', minutes: 4,
      text: 'あるテストの得点 $x$ の平均値は $60$ 点、分散は $100$ である。全員の得点を $1.2$ 倍して $5$ 点を加えたものを新しい得点 $y$ とするとき、$y$ の平均値、分散、標準偏差を求めなさい。',
      parts: [{ answer: '\\text{平均値}\\ [ア],\\quad\\text{分散}\\ [イ],\\quad\\text{標準偏差}\\ [ウ]' }],
      boxes: { ア: 77, イ: 144, ウ: 12 },
      hints: [
        '$y=1.2x+5$。平均値は $1.2\\bar{x}+5$。',
        '分散は $1.2^2$ 倍、標準偏差は $1.2$ 倍。',
      ],
      solution: [
        { text: '平均値。', math: '1.2\\times60+5=77' },
        { text: '分散は $1.44$ 倍、標準偏差は $1.2$ 倍。', math: '\\text{分散}=1.44\\times100=144,\\qquad\\text{標準偏差}=1.2\\times10=12' },
      ],
      point: '得点の調整（何倍かして何点か足す）は、変量の変換 $y=ax+b$ にあたる。',
      pitfall: '分散に5を足さない。ずらしても、データの散らばり方は変わらない。',
    },
    {
      id: 'mx-dataI-08', unit: 'dataI', level: 'standard', pattern: 'hypothesis', minutes: 6,
      text: 'あるコインを10回投げたところ、表が9回出た。「このコインは表と裏が同じ確率で出る」という仮説のもとで、10回中、表が9回以上出る確率を求め、基準となる確率を5％として、このコインが公正でないと判断できるかを答えなさい。',
      parts: [
        { q: '表が9回以上出る確率', answer: '\\dfrac{[ア]}{[イ]}' },
        { q: '判断を、⓪・①から選びなさい。', answer: '[ウ]' },
      ],
      boxes: { ア: 11, イ: 1024, ウ: 0 },
      choices: {
        ウ: {
          options: ['公正でないと判断できる', '公正でないとは判断できない'],
          notes: [
            '仮説のもとで表が9回以上出る確率は $\\dfrac{11}{1024}\\fallingdotseq0.011$ で、5％より小さい。めったに起こらないことが起きたので、仮説は正しくないと判断する。',
            '確率が5％以上なら仮説を否定できないが、この確率は約1.1％で5％より小さい。',
          ],
        },
      },
      hints: [
        '表が $k$ 回出る確率は ${}_{10}\\mathrm{C}_k\\left(\\dfrac12\\right)^{10}$。9回と10回の確率を足す。',
        '求めた確率が5％より小さければ、「仮説のもとではめったに起こらない」として仮説を否定する。',
      ],
      solution: [
        { text: '表が9回以上出る確率は', math: '\\dfrac{{}_{10}\\mathrm{C}_9+{}_{10}\\mathrm{C}_{10}}{2^{10}}=\\dfrac{10+1}{1024}=\\dfrac{11}{1024}' },
        { text: 'これは約 $0.011$ で、$0.05$ より小さい。仮説は否定され、公正でないと判断できる。' },
      ],
      point: '仮説検定は「仮説が正しいとすると、観測した結果（またはそれ以上に極端な結果）はどのくらい起こりやすいか」で判断する。',
      pitfall: 'ちょうど9回の確率だけで判断しない。「9回以上」のように、それ以上に極端な場合も足す。',
    },
  ],
}
