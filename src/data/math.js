// ── 数学（中学＋高校）データ ───────────────────────────────────────────
// 設計思想は単語データと同じく「データ駆動」。1問を
//   ① recall（必要な知識の確認＝着眼点・公式を思い出し、方針を3択で選ぶ）
//   ② steps（穴埋めで解答を組み立てる。タイルを空所にタップ。3択も可）
//   ③ answer / pitfall（最終解とつまずきポイント）
// に分解して持つ。数式はすべて KaTeX 記法の文字列。
//
// これにより「答え合わせ」ではなく「どう考えれば解けるか」を学べる。
// 中学→高校へは MATH_UNITS と MATH_PROBLEMS にデータを足すだけで広がる。
//
// recall = {
//   points: ['着眼点…'],                     // 思い出すべき見方（読む）
//   formula?: { name, tex },                 // 必要な公式カード（読む・任意）
//   quiz?: { q, choices, answer, why },      // 方針/知識の確認（3択・反応必須・任意）
// }
// step（穴埋め） = {
//   fill: {
//     ask, tex,        // tex の \square が空所（左から①②…）
//     blanks: ['+2'],  // 各空所の正解（符号込み。例 '+2','-3','2\\sqrt2'）
//     tiles: [...],    // タップ候補（distractor 込み）
//     unordered?: true,// 空所の順不同を許す（因数の入れ替えなど）
//   },
//   note,              // 解説
// }
// step（3択） = { ask, choices, answer, math, note }  // 従来形式も使える
// 問題 = { id, prompt?, text?, recall, steps, answer, pitfall }
//   prompt = 中央に大きく出す数式（任意）／ text = 日本語の問題文（$...$でinline数式・任意）

// 学年・単元のカタログ（中学＋高校の全単元。problems があるものから挑戦できる）。
// 色は分野ごと：数と式=藍 / 方程式=紫 / 関数=空 / 図形=緑 / 確率データ=琥珀 /
//   三角=桃 / 微積=teal / ベクトル=薔薇 / 数列=cyan。
export const MATH_UNITS = [
  // ── 中1 ──
  { id: 'pn', grade: '中1', strand: '数と式', title: '正負の数', emoji: '➕', color: '#6366f1', desc: '符号のルールと四則計算' },
  { id: 'expr1', grade: '中1', strand: '数と式', title: '文字と式', emoji: '🔤', color: '#6366f1', desc: '文字式の表し方と計算' },
  { id: 'eq1', grade: '中1', strand: '方程式', title: '一次方程式', emoji: '⚖️', color: '#7c3aed', desc: '移項で解く・文章題' },
  { id: 'prop', grade: '中1', strand: '関数', title: '比例と反比例', emoji: '📊', color: '#0ea5e9', desc: 'y=ax と y=a/x' },
  { id: 'plane1', grade: '中1', strand: '図形', title: '平面図形', emoji: '📐', color: '#10b981', desc: '作図・おうぎ形' },
  { id: 'space1', grade: '中1', strand: '図形', title: '空間図形', emoji: '🧊', color: '#10b981', desc: '体積・表面積' },
  { id: 'data1', grade: '中1', strand: '確率・データ', title: 'データの活用', emoji: '📈', color: '#f59e0b', desc: '度数分布・代表値' },
  // ── 中2 ──
  { id: 'calc2', grade: '中2', strand: '数と式', title: '式の計算', emoji: '✖️', color: '#6366f1', desc: '単項式・多項式の計算' },
  { id: 'simul', grade: '中2', strand: '方程式', title: '連立方程式', emoji: '⚖️', color: '#7c3aed', desc: '代入法・加減法・文章題' },
  { id: 'lin', grade: '中2', strand: '関数', title: '一次関数', emoji: '📈', color: '#0ea5e9', desc: '傾きと切片・交点・文章題' },
  { id: 'angle', grade: '中2', strand: '図形', title: '平行線と角', emoji: '📐', color: '#10b981', desc: '角度・多角形の内角' },
  { id: 'congr', grade: '中2', strand: '図形', title: '合同と証明', emoji: '📝', color: '#10b981', desc: '三角形の合同条件・証明' },
  { id: 'prob', grade: '中2', strand: '確率・データ', title: '確率', emoji: '🎲', color: '#f59e0b', desc: '場合の数と確率' },
  { id: 'data2', grade: '中2', strand: '確率・データ', title: '箱ひげ図', emoji: '📦', color: '#f59e0b', desc: '四分位数・データの比較' },
  // ── 中3 ──
  { id: 'expand', grade: '中3', strand: '数と式', title: '式の展開', emoji: '🧮', color: '#6366f1', desc: '乗法公式' },
  { id: 'factor', grade: '中3', strand: '数と式', title: '因数分解', emoji: '🧩', color: '#6366f1', desc: '共通因数・公式' },
  { id: 'sqrt', grade: '中3', strand: '数と式', title: '平方根', emoji: '√', color: '#6366f1', desc: '根号の計算・有理化' },
  { id: 'eq2', grade: '中3', strand: '方程式', title: '二次方程式', emoji: '🟰', color: '#7c3aed', desc: '因数分解と解の公式の使い分け' },
  { id: 'qfn0', grade: '中3', strand: '関数', title: '関数 y=ax²', emoji: '📉', color: '#0ea5e9', desc: '放物線・変化の割合' },
  { id: 'simil', grade: '中3', strand: '図形', title: '相似', emoji: '🔺', color: '#10b981', desc: '相似比・平行線と比' },
  { id: 'circ', grade: '中3', strand: '図形', title: '円周角', emoji: '⭕', color: '#10b981', desc: '円周角の定理' },
  { id: 'tri', grade: '中3', strand: '図形', title: '三平方の定理', emoji: '📐', color: '#10b981', desc: '直角三角形の辺の関係' },
  { id: 'sample', grade: '中3', strand: '確率・データ', title: '標本調査', emoji: '🔍', color: '#f59e0b', desc: '母集団の推定' },
  // ── 数I ──
  { id: 'realexpr', grade: '数I', strand: '数と式', title: '数と式', emoji: '🧮', color: '#6366f1', desc: '展開・因数分解・絶対値' },
  { id: 'setlogic', grade: '数I', strand: '数と式', title: '集合と命題', emoji: '🔗', color: '#6366f1', desc: '必要十分・対偶・背理法' },
  { id: 'qfn', grade: '数I', strand: '関数', title: '二次関数', emoji: '🟣', color: '#0ea5e9', desc: '頂点・最大最小・判別式' },
  { id: 'trig', grade: '数I', strand: '三角比', title: '三角比', emoji: '🔺', color: '#ec4899', desc: '正弦・余弦定理' },
  { id: 'dataI', grade: '数I', strand: '確率・データ', title: 'データの分析', emoji: '📊', color: '#f59e0b', desc: '分散・相関係数' },
  // ── 数A ──
  { id: 'count', grade: '数A', strand: '確率・データ', title: '場合の数と確率', emoji: '🎲', color: '#f59e0b', desc: '順列・組合せ・条件付き確率' },
  { id: 'geomA', grade: '数A', strand: '図形', title: '図形の性質', emoji: '📐', color: '#10b981', desc: 'チェバ・メネラウス・方べき' },
  { id: 'intA', grade: '数A', strand: '数と式', title: '整数の性質', emoji: '🔢', color: '#6366f1', desc: '約数倍数・合同式・互除法' },
  // ── 数II ──
  { id: 'proof', grade: '数II', strand: '数と式', title: '式と証明', emoji: '🧮', color: '#6366f1', desc: '二項定理・恒等式・不等式の証明' },
  { id: 'complex', grade: '数II', strand: '方程式', title: '複素数と方程式', emoji: '🆑', color: '#7c3aed', desc: '複素数・解と係数・剰余定理' },
  { id: 'coordII', grade: '数II', strand: '図形', title: '図形と方程式', emoji: '📐', color: '#10b981', desc: '直線と円・軌跡・領域' },
  { id: 'trigfn', grade: '数II', strand: '三角比', title: '三角関数', emoji: '〽️', color: '#ec4899', desc: '弧度法・加法定理・合成' },
  { id: 'explog', grade: '数II', strand: '関数', title: '指数・対数関数', emoji: '📈', color: '#0ea5e9', desc: '指数法則・対数の計算' },
  { id: 'diff', grade: '数II', strand: '微分・積分', title: '微分法', emoji: '➗', color: '#0d9488', desc: '微分係数・接線・増減' },
  { id: 'integ', grade: '数II', strand: '微分・積分', title: '積分法', emoji: '∫', color: '#0d9488', desc: '不定積分・定積分・面積' },
  // ── 数B ──
  { id: 'seq', grade: '数B', strand: '数列', title: '数列', emoji: '🔢', color: '#06b6d4', desc: '等差・等比・Σ・漸化式' },
  { id: 'statB', grade: '数B', strand: '確率・データ', title: '統計的な推測', emoji: '📊', color: '#f59e0b', desc: '確率分布・正規分布・推定' },
  // ── 数C ──
  { id: 'vector', grade: '数C', strand: 'ベクトル', title: 'ベクトル', emoji: '➡️', color: '#f43f5e', desc: '内積・位置ベクトル・空間' },
  { id: 'curveC', grade: '数C', strand: '関数', title: '式と曲線', emoji: '🌀', color: '#0ea5e9', desc: '二次曲線・複素数平面' },
  // ── 数III ──
  { id: 'limit', grade: '数III', strand: '微分・積分', title: '極限', emoji: '♾️', color: '#0d9488', desc: '数列・関数の極限' },
  { id: 'diff3', grade: '数III', strand: '微分・積分', title: '微分法（III）', emoji: '➗', color: '#0d9488', desc: '積商合成の微分・増減凹凸' },
  { id: 'integ3', grade: '数III', strand: '微分・積分', title: '積分法（III）', emoji: '∫', color: '#0d9488', desc: '置換・部分積分・体積' },
]

// 単元IDごとの問題配列。MVPでは「二次方程式」を縦に作り込み、
// 他単元はデータを足していく（メタだけ先に置いて"準備中"表示）。
export const MATH_PROBLEMS = {
  pn: [
    {
      id: 'pn-1',
      text: '次を計算しよう：$(-7)+(+3)$',
      recall: {
        points: [
          '異符号の和 → 絶対値の大きい方から小さい方を引く',
          '答えの符号は、絶対値が大きい方に合わせる',
        ],
        formula: { name: '異符号の加法', tex: '(-a)+(+b)=-(a-b)\\quad(a>b)' },
        quiz: {
          q: '$(-7)+(+3)$ の符号はどうなる？',
          choices: ['$-$（$7$ の方が大きい）', '$+$', 'どちらでもない'],
          answer: 0,
          why: '絶対値は $7>3$。大きい方の $-7$ に合わせて符号は $-$。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず絶対値の差を求めよう',
            tex: '7-3=\\square',
            blanks: ['4'],
            tiles: ['4', '10', '-4', '21'],
          },
          note: '異符号だから「引く」。$7-3=4$。',
        },
        {
          fill: {
            ask: '符号をつけて答えにしよう',
            tex: '(-7)+(+3)=\\square',
            blanks: ['-4'],
            tiles: ['-4', '4', '-10', '10'],
          },
          note: '絶対値の大きい $-7$ に合わせて $-$。',
        },
      ],
      answer: '-4',
      pitfall: '同符号は絶対値を「足す」、異符号は「引く」。ここを混同しやすい。',
    },
    {
      id: 'pn-2',
      text: '次を計算しよう：$(-5)-(-8)$',
      recall: {
        points: [
          '引き算は「ひく数の符号を変えて足す」に直す',
          '$-(-8)$ は $+8$ になる',
        ],
        formula: { name: '減法→加法', tex: 'a-(-b)=a+b' },
        quiz: {
          q: '$-(-8)$ は？',
          choices: ['$+8$', '$-8$', '$0$'],
          answer: 0,
          why: 'ひく数の符号を変える。$-(-8)=+8$。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'たし算に直そう',
            tex: '(-5)-(-8)=(-5)+\\square',
            blanks: ['+8'],
            tiles: ['+8', '-8', '+5', '-5'],
          },
          note: 'ひく数 $-8$ の符号を変えて $+8$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '=\\square',
            blanks: ['3'],
            tiles: ['3', '-3', '13', '-13'],
          },
          note: '異符号の和：$8-5=3$、大きい方が $+$。',
        },
      ],
      answer: '3',
      pitfall: '符号を変えるのは「ひく数」だけ。前の数 $-5$ はそのまま。',
    },
    {
      id: 'pn-3',
      text: '次を計算しよう：$(-3)\\times(-4)$',
      recall: {
        points: [
          '同符号の積は $+$、異符号の積は $-$',
          '先に符号を決め、あとから絶対値どうしを計算',
        ],
        formula: { name: '積の符号', tex: '(-)\\times(-)=+,\\quad (-)\\times(+)=-' },
        quiz: {
          q: '$(-3)\\times(-4)$ の符号は？',
          choices: ['$+$', '$-$', '決まらない'],
          answer: 0,
          why: '負×負＝正。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず符号を決めよう',
            tex: '(-3)\\times(-4)\\ \\text{の符号は}\\ \\square',
            blanks: ['+'],
            tiles: ['+', '-'],
          },
          note: '同符号（負どうし）だから $+$。',
        },
        {
          fill: {
            ask: '絶対値どうしを計算して答えにしよう',
            tex: '(-3)\\times(-4)=\\square',
            blanks: ['12'],
            tiles: ['12', '-12', '7', '1'],
          },
          note: '$3\\times4=12$、符号は $+$。',
        },
      ],
      answer: '12',
      pitfall: '符号を先に決めてから数を掛ける。負×負＝正を忘れない。',
    },
    {
      id: 'pn-4',
      text: '次を計算しよう：$(-2)^3$',
      recall: {
        points: [
          '$(-2)^3$ は $-2$ を $3$ 回かけること',
          '負の数の累乗：指数が偶数→正、奇数→負',
        ],
        formula: { name: '累乗の符号', tex: '(-a)^{\\text{偶数}}>0,\\quad (-a)^{\\text{奇数}}<0' },
        quiz: {
          q: '$(-2)^3$ の符号は？',
          choices: ['$-$（奇数乗）', '$+$'],
          answer: 0,
          why: '負の数を奇数回かけると負。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'かけ算に開いて計算しよう',
            tex: '(-2)\\times(-2)\\times(-2)=\\square',
            blanks: ['-8'],
            tiles: ['-8', '8', '-6', '6'],
          },
          note: '$(-2)\\times(-2)=+4$、さらに $\\times(-2)=-8$。',
        },
      ],
      answer: '-8',
      pitfall: '$(-2)^2=4$ だが $-2^2=-4$。カッコの有無で意味が変わる（$-2^2$ は $2^2$ にマイナス）。',
    },
    {
      id: 'pn-5',
      text: '次を計算しよう：$-6+4\\times(-2)$',
      recall: {
        points: [
          '計算の順序：累乗 → かけ算・わり算 → たし算・ひき算',
          'たし引きより、かけ算を先に行う',
        ],
        formula: { name: '計算の順序', tex: '\\text{累乗}\\ \\to\\ \\times\\,\\div\\ \\to\\ +\\,-' },
        quiz: {
          q: '最初に計算するのは？',
          choices: ['$4\\times(-2)$', '$-6+4$', '左から順に'],
          answer: 0,
          why: 'たし引きより、かけ算が先。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まずかけ算をしよう',
            tex: '4\\times(-2)=\\square',
            blanks: ['-8'],
            tiles: ['-8', '8', '-2', '2'],
          },
          note: '異符号の積で $-8$。',
        },
        {
          fill: {
            ask: '残りのたし算をしよう',
            tex: '-6+(-8)=\\square',
            blanks: ['-14'],
            tiles: ['-14', '14', '-2', '2'],
          },
          note: '同符号の和：絶対値を足して $-14$。',
        },
      ],
      answer: '-14',
      pitfall: '左から順に計算してはいけない。かけ算・わり算を先に。',
    },
    {
      id: 'pn-6',
      text: 'ある $5$ 日間の最高気温を基準 $15^\\circ\\text{C}$ との差で表すと $+3,\\ -1,\\ +2,\\ -4,\\ 0\\,(^\\circ\\text{C})$ だった。平均の最高気温を求めよう。',
      recall: {
        points: [
          '基準とのズレ（正負）の平均を出し、基準に足す',
          '平均 ＝ 合計 ÷ 個数',
        ],
        formula: { name: '基準を使う平均', tex: '\\text{平均}=\\text{基準}+\\dfrac{\\text{ズレの合計}}{\\text{個数}}' },
        quiz: {
          q: 'まず計算するのは？',
          choices: ['ズレの合計', '基準 × 個数', '最大値'],
          answer: 0,
          why: 'ズレを合計し、個数で割って平均のズレを出す。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'ズレの合計を求めよう',
            tex: '(+3)+(-1)+(+2)+(-4)+0=\\square',
            blanks: ['0'],
            tiles: ['0', '10', '-10', '4'],
          },
          note: '$3-1+2-4+0=0$。',
        },
        {
          fill: {
            ask: 'ズレの平均（合計 ÷ $5$）は？',
            tex: '\\dfrac{0}{5}=\\square',
            blanks: ['0'],
            tiles: ['0', '5', '1', '-1'],
          },
          note: 'ズレの平均は $0$。',
        },
        {
          fill: {
            ask: '基準を足して実際の平均にしよう',
            tex: '15+0=\\square',
            blanks: ['15'],
            tiles: ['15', '0', '30', '5'],
          },
          note: '基準 $15$ にズレの平均 $0$ を足す。',
        },
      ],
      answer: '15^\\circ\\text{C}',
      pitfall: '基準を足し忘れない。求めるのはズレではなく実際の平均。',
    },
    {
      id: 'pn-7',
      text: '次を計算しよう：$(-3)+(-5)$',
      recall: {
        points: [
          '同符号の和は、絶対値を足す',
          '符号は共通の符号（ここでは負）',
        ],
        formula: { name: '同符号の加法', tex: '(-a)+(-b)=-(a+b)' },
        quiz: {
          q: '$(-3)+(-5)$ の符号は？',
          choices: ['$-$（どちらも負）', '$+$', '$0$'],
          answer: 0,
          why: '同符号なので符号はそのまま。',
        },
      },
      steps: [
        {
          fill: {
            ask: '絶対値の和を求めよう',
            tex: '3+5=\\square',
            blanks: ['8'],
            tiles: ['8', '2', '15', '3'],
          },
          note: '同符号だから「足す」。',
        },
        {
          fill: {
            ask: '符号をつけて答えにしよう',
            tex: '(-3)+(-5)=\\square',
            blanks: ['-8'],
            tiles: ['-8', '8', '-2', '2'],
          },
          note: 'どちらも負なので $-8$。',
        },
      ],
      answer: '-8',
      pitfall: '同符号は絶対値を「足す」。異符号（引く）と混同しない。',
    },
    {
      id: 'pn-8',
      text: '次を計算しよう：$(-12)\\div 4$',
      recall: {
        points: [
          'わり算の符号も「同符号 → ＋、異符号 → −」',
          '先に符号を決め、絶対値どうしを割る',
        ],
        formula: { name: '除法の符号', tex: '(-)\\div(+)=-' },
        quiz: {
          q: '$(-12)\\div4$ の符号は？',
          choices: ['$-$', '$+$', '$0$'],
          answer: 0,
          why: '異符号の商は負。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず符号を決めよう',
            tex: '(-12)\\div4\\ \\text{の符号は}\\ \\square',
            blanks: ['-'],
            tiles: ['-', '+'],
          },
          note: '異符号（負 ÷ 正）なので $-$。',
        },
        {
          fill: {
            ask: '絶対値どうしを割ろう',
            tex: '12\\div4=\\square',
            blanks: ['3'],
            tiles: ['3', '-3', '48', '8'],
          },
          note: '$12\\div4=3$、符号は $-$。',
        },
      ],
      answer: '-3',
      pitfall: '符号を先に決める。異符号の商は負。',
    },
    {
      id: 'pn-9',
      text: '次を計算しよう：$(-2)^2-3^2$',
      recall: {
        points: [
          '$(-2)^2$ はカッコごと $2$ 乗 → $+4$',
          '$3^2=9$。そのあと引き算する',
        ],
        formula: { name: '累乗の注意', tex: '(-2)^2=4,\\quad 3^2=9' },
        quiz: {
          q: '$(-2)^2$ は？',
          choices: ['$4$', '$-4$', '$-2$'],
          answer: 0,
          why: 'カッコごと $2$ 乗なので正。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$3^2$ は？',
            tex: '(-2)^2=4,\\ 3^2=\\square',
            blanks: ['9'],
            tiles: ['9', '6', '3', '-9'],
          },
          note: '$3^2=9$。',
        },
        {
          fill: {
            ask: '$4-9$ を計算しよう',
            tex: '4-9=\\square',
            blanks: ['-5'],
            tiles: ['-5', '5', '13', '-13'],
          },
          note: '$4-9=-5$。',
        },
      ],
      answer: '-5',
      pitfall: '$(-2)^2=4$（カッコあり → 正）。$-2^2=-4$ と区別する。',
    },
    {
      id: 'pn-10',
      text: '次を計算しよう：$5-(-2)^2\\times 3$',
      recall: {
        points: [
          '計算の順序：累乗 → かけ算 → ひき算',
          '$(-2)^2=4$ を先に求める',
        ],
        formula: { name: '計算の順序', tex: '\\text{累乗}\\ \\to\\ \\times\\ \\to\\ -' },
        quiz: {
          q: '最初に計算するのは？',
          choices: ['$(-2)^2$（累乗）', '$5-(-2)^2$', '左から順に'],
          answer: 0,
          why: '累乗が最優先。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず累乗を計算しよう',
            tex: '(-2)^2=\\square',
            blanks: ['4'],
            tiles: ['4', '-4', '2', '8'],
          },
          note: 'カッコごと $2$ 乗で $+4$。',
        },
        {
          fill: {
            ask: 'かけ算をしよう',
            tex: '4\\times3=\\square',
            blanks: ['12'],
            tiles: ['12', '7', '-12', '1'],
          },
          note: '$4\\times3=12$。',
        },
        {
          fill: {
            ask: '最後にひき算をしよう',
            tex: '5-12=\\square',
            blanks: ['-7'],
            tiles: ['-7', '7', '17', '-17'],
          },
          note: '$5-12=-7$。',
        },
      ],
      answer: '-7',
      pitfall: '累乗 → かけ算 → ひき算の順。$5-12=-7$。',
    },
  ],
  expr1: [
    {
      id: 'expr1-1',
      text: '$a\\times b\\times 3$ と $x\\div 5$ を、文字式の表し方にしたがって書こう。',
      recall: {
        points: [
          '×（かける記号）は省く',
          '数は文字の前に書く（文字はアルファベット順）',
          'わり算は分数の形にする',
        ],
        formula: { name: '表し方', tex: 'a\\times b\\times 3=3ab,\\quad x\\div5=\\dfrac{x}{5}' },
        quiz: {
          q: '数と文字、どちらを前に書く？',
          choices: ['数を前', '文字を前', 'どちらでもよい'],
          answer: 0,
          why: '数を文字の前に。$3ab$ のように書く。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$a\\times b\\times 3$ を書こう',
            tex: 'a\\times b\\times 3=\\square',
            blanks: ['3ab'],
            tiles: ['3ab', 'ab3', '3ba', 'abc'],
          },
          note: '×を省き、数 $3$ を前に。文字はアルファベット順で $ab$。',
        },
        {
          fill: {
            ask: '$x\\div 5$ を分数で書こう',
            tex: 'x\\div 5=\\square',
            blanks: ['\\dfrac{x}{5}'],
            tiles: ['\\dfrac{x}{5}', '\\dfrac{5}{x}', '5x', 'x5'],
          },
          note: 'わる数 $5$ が分母。$\\dfrac{x}{5}$。',
        },
      ],
      answer: '3ab,\\quad \\dfrac{x}{5}',
      pitfall: '$1\\times a$ は $a$、$-1\\times a$ は $-a$（$1$ は書かない）。わり算は必ず分数に。',
    },
    {
      id: 'expr1-2',
      text: '次を計算しよう：$3x+5-x+2$',
      recall: {
        points: [
          '文字の部分が同じ項（同類項）どうしをまとめる',
          '数だけの項（定数項）どうしもまとめる',
        ],
        formula: { name: '同類項', tex: 'ax+bx=(a+b)x' },
        quiz: {
          q: '$3x$ と $-x$ はまとめられる？',
          choices: ['まとめられる（同類項）', 'まとめられない', '$x$ が消える'],
          answer: 0,
          why: '文字部分が同じ $x$ なので同類項。係数どうしを計算する。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x$ の項をまとめよう',
            tex: '3x-x=\\square',
            blanks: ['2x'],
            tiles: ['2x', '4x', '3x', '2'],
          },
          note: '$x$ は $1x$。$3-1=2$ で $2x$。',
        },
        {
          fill: {
            ask: '数の項をまとめよう',
            tex: '5+2=\\square',
            blanks: ['7'],
            tiles: ['7', '3', '10', '7x'],
          },
          note: '定数項どうし $5+2=7$。',
        },
        {
          fill: {
            ask: '合わせて答えにしよう',
            tex: '3x+5-x+2=\\square',
            blanks: ['2x+7'],
            tiles: ['2x+7', '2x-7', '4x+7', '9x'],
          },
          note: '$2x$ と $7$ はこれ以上まとめられない。',
        },
      ],
      answer: '2x+7',
      pitfall: '$x$ の項と数の項は別物。$2x+7$ を $9x$ などにまとめない。',
    },
    {
      id: 'expr1-3',
      text: '次を計算しよう：$2(3x-4)$',
      recall: {
        points: [
          '分配法則：カッコの外の数を、中の各項にかける',
          '後ろの項の符号もそのままかける',
        ],
        formula: { name: '分配法則', tex: 'a(b+c)=ab+ac' },
        quiz: {
          q: '$2$ をかける相手は？',
          choices: ['$3x$ と $-4$ の両方', '$3x$ だけ', '$-4$ だけ'],
          answer: 0,
          why: 'カッコの中の全部の項にかける。',
        },
      },
      steps: [
        {
          fill: {
            ask: '前の項にかけよう',
            tex: '2\\times 3x=\\square',
            blanks: ['6x'],
            tiles: ['6x', '5x', '6', '8x'],
          },
          note: '$2\\times3=6$ で $6x$。',
        },
        {
          fill: {
            ask: '後ろの項にかけよう（符号に注意）',
            tex: '2\\times(-4)=\\square',
            blanks: ['-8'],
            tiles: ['-8', '8', '-2', '-6'],
          },
          note: '$2\\times(-4)=-8$。',
        },
        {
          fill: {
            ask: '合わせて答えにしよう',
            tex: '2(3x-4)=\\square',
            blanks: ['6x-8'],
            tiles: ['6x-8', '6x+8', '5x-8', '6x-4'],
          },
          note: '$6x$ と $-8$ を並べる。',
        },
      ],
      answer: '6x-8',
      pitfall: '後ろの項 $-4$ へのかけ忘れが多い。符号 $-$ もそのままかける。',
    },
    {
      id: 'expr1-4',
      text: '$1$ 個 $a$ 円のりんごを $3$ 個買い、$1000$ 円札で払う。おつりを $a$ を使った式で表そう。',
      recall: {
        points: [
          '代金 ＝ 単価 × 個数',
          'おつり ＝ 出した金額 − 代金',
        ],
        formula: { name: 'おつり', tex: '\\text{おつり}=\\text{出した金額}-\\text{代金}' },
        quiz: {
          q: 'りんご $3$ 個の代金は？',
          choices: ['$3a$ 円', '$a+3$ 円', '$\\dfrac{a}{3}$ 円'],
          answer: 0,
          why: '単価 $a$ × 個数 $3$ ＝ $3a$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '代金を式にしよう',
            tex: '\\text{代金}=a\\times 3=\\square',
            blanks: ['3a'],
            tiles: ['3a', 'a3', '3+a', '\\dfrac{a}{3}'],
          },
          note: '数を前にして $3a$ 円。',
        },
        {
          fill: {
            ask: 'おつりを式にしよう',
            tex: '\\text{おつり}=1000-\\square',
            blanks: ['3a'],
            tiles: ['3a', 'a3', '1000a', '3a-1000'],
          },
          note: '出した $1000$ から代金 $3a$ を引く。',
        },
      ],
      answer: '(1000-3a)\\ \\text{円}',
      pitfall: '$1000-3a$ を $997a$ などとまとめない（数と文字の項は別）。',
    },
    {
      id: 'expr1-5',
      text: '$x=-2$ のとき、$3x+5$ の値を求めよう。',
      recall: {
        points: [
          '文字に数を代入するときはカッコをつけて入れる',
          '負の数の代入は符号ミスに注意',
        ],
        formula: { name: '代入', tex: 'x=-2\\ \\Rightarrow\\ 3x+5=3\\times(-2)+5' },
        quiz: {
          q: '$x=-2$ を $3x$ に代入すると？',
          choices: ['$3\\times(-2)$', '$3-2$', '$32$'],
          answer: 0,
          why: '$3x$ は $3\\times x$。カッコをつけて代入する。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'かけ算の部分を計算しよう',
            tex: '3\\times(-2)=\\square',
            blanks: ['-6'],
            tiles: ['-6', '6', '-5', '1'],
          },
          note: '異符号の積で $-6$。',
        },
        {
          fill: {
            ask: '$+5$ をして答えにしよう',
            tex: '-6+5=\\square',
            blanks: ['-1'],
            tiles: ['-1', '1', '-11', '11'],
          },
          note: '$-6+5=-1$。',
        },
      ],
      answer: '-1',
      pitfall: '$3x$ は $3\\times x$。$x=-2$ を「$32$」のように並べない。カッコ必須。',
    },
    {
      id: 'expr1-6',
      text: 'マッチ棒で正方形を横に並べる。$1$ 個で $4$ 本、$2$ 個で $7$ 本、$3$ 個で $10$ 本…。$n$ 個のときの本数を式で表そう。',
      recall: {
        points: [
          '毎回いくつ増えるか → それが $n$ の係数になる',
          '$n=1$ のとき合うように、定数項で調整する',
        ],
        formula: { name: '一定に増える式', tex: '\\text{本数}=(\\text{毎回の増加})\\times n+(\\text{調整})' },
        quiz: {
          q: '正方形が $1$ 個増えると本数は？',
          choices: ['$3$ 本増える', '$4$ 本増える', '$1$ 本増える'],
          answer: 0,
          why: '$4\\to7\\to10$ で毎回 $3$ ずつ増える。係数は $3$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '式を作ろう（係数と調整の数）',
            tex: '\\text{本数}=\\square\\,n+\\square',
            blanks: ['3', '1'],
            tiles: ['3', '1', '4', '2'],
          },
          note: '毎回 $3$ 増 → $3n$。$n=1$ で $4$ になるよう $+1$（$3\\times1+1=4$）。',
        },
        {
          fill: {
            ask: '$n=10$ のとき何本？',
            tex: '3\\times 10+1=\\square',
            blanks: ['31'],
            tiles: ['31', '30', '40', '13'],
          },
          note: '式に $n=10$ を代入して確かめる。',
        },
      ],
      answer: '3n+1\\ \\text{本}',
      pitfall: '係数は「増える数」、定数項は「$n=1$ に合わせる調整」。$4n$ としない。',
    },
  ],
  eq1: [
    {
      id: 'eq1-1',
      text: '次の方程式を解こう：$x+4=9$',
      recall: {
        points: [
          '等式は両辺に同じ操作をしてよい',
          'ある項を反対側へ移すと符号が変わる（移項）',
        ],
        formula: { name: '移項', tex: 'x+a=b\\ \\Rightarrow\\ x=b-a' },
        quiz: {
          q: '$+4$ を右辺へ移すとどうなる？',
          choices: ['$-4$ になる', '$+4$ のまま', '消える'],
          answer: 0,
          why: '移項すると符号が反転する。$+4 \\to -4$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$+4$ を右へ移項しよう',
            tex: 'x=9-\\square',
            blanks: ['4'],
            tiles: ['4', '-4', '9', '13'],
          },
          note: '$+4$ を移すと $-4$。',
        },
        {
          fill: {
            ask: '計算して答えにしよう',
            tex: 'x=\\square',
            blanks: ['5'],
            tiles: ['5', '13', '-5', '4'],
          },
          note: '$9-4=5$。',
        },
      ],
      answer: 'x=5',
      pitfall: '移項は符号が変わる。$x=9+4$ としない。',
    },
    {
      id: 'eq1-2',
      text: '次の方程式を解こう：$2x-3=7$',
      recall: {
        points: [
          'まず数の項を移項する',
          '次に $x$ の係数で両辺を割る（移項 → 割るの順）',
        ],
        formula: { name: '解く手順', tex: 'ax+b=c\\ \\Rightarrow\\ ax=c-b\\ \\Rightarrow\\ x=\\dfrac{c-b}{a}' },
        quiz: {
          q: '最初にすることは？',
          choices: ['$-3$ を移項する', 'いきなり $2$ で割る', '$x$ を移項する'],
          answer: 0,
          why: '数の項を先に右へ移す。割るのは最後。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$-3$ を移項しよう',
            tex: '2x=7+\\square',
            blanks: ['3'],
            tiles: ['3', '-3', '7', '10'],
          },
          note: '$-3$ を移すと $+3$。',
        },
        {
          fill: {
            ask: '右辺を計算しよう',
            tex: '2x=\\square',
            blanks: ['10'],
            tiles: ['10', '4', '7', '-10'],
          },
          note: '$7+3=10$。',
        },
        {
          fill: {
            ask: '両辺を $2$ で割ろう',
            tex: 'x=\\square',
            blanks: ['5'],
            tiles: ['5', '20', '10', '2.5'],
          },
          note: '$10\\div2=5$。',
        },
      ],
      answer: 'x=5',
      pitfall: '「移項してから割る」。先に割ると分数が出てミスしやすい。',
    },
    {
      id: 'eq1-3',
      text: '次の方程式を解こう：$5x-2=2x+7$',
      recall: {
        points: [
          '文字の項を左、数の項を右に集める',
          '移項のたびに符号が変わる',
        ],
        formula: { name: '両辺に文字', tex: '\\text{文字は左へ・数は右へ}' },
        quiz: {
          q: '$2x$ を左辺へ移すと？',
          choices: ['$-2x$ になる', '$+2x$ のまま', '$2$ になる'],
          answer: 0,
          why: '移項で符号反転、$-2x$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '文字を左・数を右に集めよう',
            tex: '5x-2x=7+\\square',
            blanks: ['2'],
            tiles: ['2', '-2', '7', '9'],
          },
          note: '$2x \\to -2x$、$-2 \\to +2$。',
        },
        {
          fill: {
            ask: '両辺をまとめよう',
            tex: '3x=\\square',
            blanks: ['9'],
            tiles: ['9', '5', '7', '3'],
          },
          note: '$5x-2x=3x$、$7+2=9$。',
        },
        {
          fill: {
            ask: '両辺を $3$ で割ろう',
            tex: 'x=\\square',
            blanks: ['3'],
            tiles: ['3', '9', '27', '1'],
          },
          note: '$9\\div3=3$。',
        },
      ],
      answer: 'x=3',
      pitfall: '移すときは全部の項の符号を変える。$5x-2x=3x$（$7x$ にしない）。',
    },
    {
      id: 'eq1-4',
      text: '次の方程式を解こう：$2(x+3)=10$',
      recall: {
        points: [
          'まずカッコを分配法則で外す',
          'そのあとは移項 → 割るの手順',
        ],
        formula: { name: '分配法則', tex: 'a(b+c)=ab+ac' },
        quiz: {
          q: 'まず何をする？',
          choices: ['カッコを外す（展開）', '$x$ を移項', '何も要らない'],
          answer: 0,
          why: '分配法則でカッコを外してから解くのが基本。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'カッコを外そう',
            tex: '2x+\\square=10',
            blanks: ['6'],
            tiles: ['6', '3', '5', '8'],
          },
          note: '$2\\times3=6$。$2x+6$ になる。',
        },
        {
          fill: {
            ask: '$+6$ を移項して計算しよう',
            tex: '2x=10-6=\\square',
            blanks: ['4'],
            tiles: ['4', '16', '6', '-4'],
          },
          note: '$10-6=4$。',
        },
        {
          fill: {
            ask: '両辺を $2$ で割ろう',
            tex: 'x=\\square',
            blanks: ['2'],
            tiles: ['2', '8', '4', '1'],
          },
          note: '$4\\div2=2$。',
        },
      ],
      answer: 'x=2',
      pitfall: '$2(x+3)$ は $2x+6$。$2x+3$ としない（$3$ にもかける）。',
    },
    {
      id: 'eq1-5',
      text: '次の方程式を解こう：$\\dfrac{1}{2}x+1=\\dfrac{1}{3}x+2$',
      recall: {
        points: [
          '分数があるときは両辺に分母の最小公倍数をかけて整数にする',
          '$\\dfrac{1}{2},\\dfrac{1}{3}$ なら両辺を $6$ 倍',
        ],
        formula: { name: '分母を払う', tex: '\\text{両辺}\\times(\\text{分母の最小公倍数})' },
        quiz: {
          q: '両辺に何をかける？',
          choices: ['$6$', '$2$', '$5$'],
          answer: 0,
          why: '$2$ と $3$ の最小公倍数 $6$ をかければ分母が消える。',
        },
      },
      steps: [
        {
          fill: {
            ask: '両辺を $6$ 倍しよう',
            tex: '3x+6=2x+\\square',
            blanks: ['12'],
            tiles: ['12', '6', '2', '3'],
          },
          note: '各項に $6$：$\\frac12x\\to3x$, $1\\to6$, $\\frac13x\\to2x$, $2\\to12$。',
        },
        {
          fill: {
            ask: '文字を左・数を右に集めよう',
            tex: '3x-2x=12-\\square',
            blanks: ['6'],
            tiles: ['6', '12', '3', '-6'],
          },
          note: '$2x\\to-2x$、$6\\to-6$。',
        },
        {
          fill: {
            ask: 'まとめて答えにしよう',
            tex: 'x=\\square',
            blanks: ['6'],
            tiles: ['6', '18', '1', '-6'],
          },
          note: '$3x-2x=x$、$12-6=6$。',
        },
      ],
      answer: 'x=6',
      pitfall: 'かけるのは「両辺の全部の項」。$+1$ や $+2$ にもかけ忘れない。',
    },
    {
      id: 'eq1-6',
      text: '$1$ 本 $80$ 円の鉛筆を何本かと、$150$ 円のノート $1$ 冊を買うと合計 $710$ 円だった。鉛筆は何本？',
      recall: {
        points: [
          '求めるもの（鉛筆の本数）を $x$ とおく',
          '「合計＝○○」の関係を式にして方程式にする',
        ],
        formula: { name: '立式', tex: '\\text{単価}\\times x+\\text{他}=\\text{合計}' },
        quiz: {
          q: '何を $x$ とおく？',
          choices: ['鉛筆の本数', '合計金額', 'ノートの値段'],
          answer: 0,
          why: '求めたいもの（本数）を $x$ にすると式が立てやすい。',
        },
      },
      steps: [
        {
          fill: {
            ask: '合計の式を立てよう',
            tex: '80x+150=\\square',
            blanks: ['710'],
            tiles: ['710', '560', '150', '80'],
          },
          note: '鉛筆代 $80x$ ＋ ノート $150$ ＝ 合計 $710$。',
        },
        {
          fill: {
            ask: '$150$ を移項して計算しよう',
            tex: '80x=710-150=\\square',
            blanks: ['560'],
            tiles: ['560', '860', '710', '150'],
          },
          note: '$710-150=560$。',
        },
        {
          fill: {
            ask: '両辺を $80$ で割ろう',
            tex: 'x=\\square',
            blanks: ['7'],
            tiles: ['7', '8', '70', '6'],
          },
          note: '$560\\div80=7$。',
        },
      ],
      answer: '7\\ \\text{本}',
      pitfall: '$x$ が何を表すか最初に決める。出た数に単位（本）をつけて答える。',
    },
  ],
  prop: [
    {
      id: 'prop-1',
      text: '$y$ は $x$ に比例し、$x=2$ のとき $y=6$ である。$y$ を $x$ の式で表そう。',
      recall: {
        points: [
          '比例の式は $y=ax$（$a$ は比例定数）',
          '$1$ 組の値を代入して $a=\\dfrac{y}{x}$ を求める',
        ],
        formula: { name: '比例', tex: 'y=ax,\\quad a=\\dfrac{y}{x}' },
        quiz: {
          q: '比例の式の形は？',
          choices: ['$y=ax$', '$y=\\dfrac{a}{x}$', '$y=ax+b$'],
          answer: 0,
          why: '比例は原点を通る $y=ax$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '比例定数 $a$ を求めよう',
            tex: 'a=\\dfrac{6}{2}=\\square',
            blanks: ['3'],
            tiles: ['3', '12', '2', '\\tfrac{1}{3}'],
          },
          note: '$a=\\dfrac{y}{x}=\\dfrac{6}{2}=3$。',
        },
        {
          fill: {
            ask: '式を完成させよう',
            tex: 'y=\\square x',
            blanks: ['3'],
            tiles: ['3', '6', '2', '-3'],
          },
          note: '比例定数 $3$ を使って $y=3x$。',
        },
      ],
      answer: 'y=3x',
      pitfall: '比例定数は $\\dfrac{y}{x}$。$\\dfrac{x}{y}$ と逆にしない。',
    },
    {
      id: 'prop-2',
      text: '$y=3x$ について、$x=-4$ のときの $y$ を求めよう。',
      recall: {
        points: [
          '式に $x$ の値を代入するだけ',
          '負の数の代入はカッコをつけて',
        ],
        formula: { name: '代入', tex: 'y=3x' },
        quiz: {
          q: 'どうやって求める？',
          choices: ['$x=-4$ を式に代入', '$a$ を求め直す', 'グラフをかく'],
          answer: 0,
          why: '式に代入すれば $y$ が出る。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x=-4$ を代入しよう',
            tex: 'y=3\\times(-4)=\\square',
            blanks: ['-12'],
            tiles: ['-12', '12', '-7', '-1'],
          },
          note: '異符号の積で $-12$。',
        },
        {
          fill: {
            ask: '逆に $y=-12$ のとき $x$ は？',
            tex: '-12=3x\\ \\Rightarrow\\ x=\\square',
            blanks: ['-4'],
            tiles: ['-4', '4', '-36', '-15'],
          },
          note: '両辺を $3$ で割ると $x=-4$。',
        },
      ],
      answer: 'y=-12',
      pitfall: '比例は $x$ が $2$ 倍なら $y$ も $2$ 倍。負の符号も忘れない。',
    },
    {
      id: 'prop-3',
      text: '$y$ は $x$ に反比例し、$x=3$ のとき $y=4$ である。$y$ を $x$ の式で表そう。',
      recall: {
        points: [
          '反比例の式は $y=\\dfrac{a}{x}$',
          '$a=xy$（積が一定）で比例定数を求める',
        ],
        formula: { name: '反比例', tex: 'y=\\dfrac{a}{x},\\quad a=xy' },
        quiz: {
          q: '反比例で一定になるのは？',
          choices: ['積 $xy$', '和 $x+y$', '商 $\\dfrac{y}{x}$'],
          answer: 0,
          why: '反比例は $xy=a$ が一定。',
        },
      },
      steps: [
        {
          fill: {
            ask: '比例定数 $a=xy$ を求めよう',
            tex: 'a=3\\times 4=\\square',
            blanks: ['12'],
            tiles: ['12', '7', '1', '\\tfrac{3}{4}'],
          },
          note: '$a=xy=3\\times4=12$。',
        },
        {
          fill: {
            ask: '式を完成させよう',
            tex: 'y=\\dfrac{\\square}{x}',
            blanks: ['12'],
            tiles: ['12', '3', '4', '7'],
          },
          note: '$y=\\dfrac{12}{x}$。',
        },
      ],
      answer: 'y=\\dfrac{12}{x}',
      pitfall: '比例は $\\dfrac{y}{x}=a$、反比例は $xy=a$。求め方を混同しやすい。',
    },
    {
      id: 'prop-4',
      text: '$y=\\dfrac{12}{x}$ について、$x=-2$ のときの $y$ を求めよう。',
      recall: {
        points: [
          '式に $x$ を代入する',
          '分母が負なら $y$ も負になる',
        ],
        formula: { name: '反比例', tex: 'y=\\dfrac{12}{x}' },
        quiz: {
          q: '$x=-2$ のとき $y$ の符号は？',
          choices: ['$y<0$', '$y>0$', '$y=0$'],
          answer: 0,
          why: '正 ÷ 負 ＝ 負。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x=-2$ を代入しよう',
            tex: 'y=\\dfrac{12}{-2}=\\square',
            blanks: ['-6'],
            tiles: ['-6', '6', '-24', '-10'],
          },
          note: '$12\\div(-2)=-6$。',
        },
        {
          fill: {
            ask: '逆に $y=2$ のとき $x$ は？',
            tex: '2=\\dfrac{12}{x}\\ \\Rightarrow\\ x=\\square',
            blanks: ['6'],
            tiles: ['6', '24', '2', '-6'],
          },
          note: '$xy=12$ より $x=\\dfrac{12}{2}=6$。',
        },
      ],
      answer: 'y=-6',
      pitfall: '$\\dfrac{12}{x}$ は $x$ が負なら $y$ も負。積 $xy$ は常に $12$。',
    },
    {
      id: 'prop-5',
      text: '比例 $y=2x$ のグラフが原点のほかに通る点を、$x=3$ のときで求めよう。',
      recall: {
        points: [
          '比例のグラフは原点を通る直線',
          '式に値を入れて通る点を $1$ つ求めれば直線が引ける',
        ],
        formula: { name: '比例のグラフ', tex: 'y=ax\\ \\text{は原点を通る直線}' },
        quiz: {
          q: '比例のグラフが必ず通る点は？',
          choices: ['原点 $(0,0)$', '$(1,0)$', '$(0,1)$'],
          answer: 0,
          why: '$x=0$ なら $y=0$。原点を通る。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x=3$ のときの $y$ を求めよう',
            tex: 'y=2\\times 3=\\square',
            blanks: ['6'],
            tiles: ['6', '5', '3', '2'],
          },
          note: '$y=2x$ に $x=3$ を代入。',
        },
        {
          fill: {
            ask: '通る点の座標を完成させよう',
            tex: '\\text{点}\\,(3,\\ \\square)',
            blanks: ['6'],
            tiles: ['6', '3', '0', '2'],
          },
          note: '原点 $(0,0)$ と $(3,6)$ を結べばグラフになる。',
        },
      ],
      answer: '(3,\\ 6)',
      pitfall: '比例のグラフは原点スタート。切片はない（$y=ax+b$ の $b=0$）。',
    },
    {
      id: 'prop-6',
      text: '$120$ km の道のりを時速 $x$ km で進むと $y$ 時間かかる。$y$ を $x$ の式で表し、時速 $40$ km のときの時間を求めよう。',
      recall: {
        points: [
          '道のりが一定 → 速さ × 時間 ＝ 一定 ＝ 反比例',
          '$xy=120$ なので $y=\\dfrac{120}{x}$',
        ],
        formula: { name: '速さの関係', tex: '\\text{速さ}\\times\\text{時間}=\\text{道のり}' },
        quiz: {
          q: '速さと時間の関係は？',
          choices: ['反比例', '比例', '一次関数'],
          answer: 0,
          why: '道のりが一定なら速さ×時間が一定 ＝ 反比例。',
        },
      },
      steps: [
        {
          fill: {
            ask: '式を作ろう（$xy=120$）',
            tex: 'y=\\dfrac{\\square}{x}',
            blanks: ['120'],
            tiles: ['120', '40', '3', '60'],
          },
          note: '道のり $120$ が比例定数。$y=\\dfrac{120}{x}$。',
        },
        {
          fill: {
            ask: '時速 $40$ km のときの時間は？',
            tex: 'y=\\dfrac{120}{40}=\\square',
            blanks: ['3'],
            tiles: ['3', '80', '4', '2'],
          },
          note: '$120\\div40=3$ 時間。',
        },
      ],
      answer: 'y=\\dfrac{120}{x},\\quad 3\\ \\text{時間}',
      pitfall: '速くなるほど時間は短い（反比例）。比例と取り違えない。',
    },
  ],
  plane1: [
    {
      id: 'plane1-1',
      text: '半径 $5$ cm の円の周の長さを求めよう。',
      recall: {
        points: [
          '円周 ＝ 直径 × 円周率 ＝ $2\\pi r$',
          '半径 $r$ の $2$ 倍が直径',
        ],
        formula: { name: '円周', tex: '\\ell=2\\pi r' },
        quiz: {
          q: '円周の式は？',
          choices: ['$2\\pi r$', '$\\pi r^2$', '$\\pi r$'],
          answer: 0,
          why: '円周は $2\\pi r$。$\\pi r^2$ は面積。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$r=5$ を代入しよう',
            tex: '\\ell=2\\pi\\times 5=\\square',
            blanks: ['10\\pi'],
            tiles: ['10\\pi', '25\\pi', '5\\pi', '10'],
          },
          note: '$2\\times5=10$ で $10\\pi$。',
        },
      ],
      answer: '10\\pi\\ \\text{cm}',
      pitfall: '円周は $2\\pi r$、面積は $\\pi r^2$。式を取り違えない。',
    },
    {
      id: 'plane1-2',
      text: '半径 $5$ cm の円の面積を求めよう。',
      recall: {
        points: [
          '円の面積 ＝ $\\pi r^2$',
          '半径を $2$ 乗してから $\\pi$ をかける',
        ],
        formula: { name: '円の面積', tex: 'S=\\pi r^2' },
        quiz: {
          q: '円の面積の式は？',
          choices: ['$\\pi r^2$', '$2\\pi r$', '$\\pi r$'],
          answer: 0,
          why: '面積は半径の $2$ 乗 × $\\pi$。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず半径を $2$ 乗しよう',
            tex: '5^2=\\square',
            blanks: ['25'],
            tiles: ['25', '10', '5', '20'],
          },
          note: '$5^2=5\\times5=25$。',
        },
        {
          fill: {
            ask: '$\\pi$ をかけよう',
            tex: 'S=\\square\\pi',
            blanks: ['25'],
            tiles: ['25', '10', '5', '50'],
          },
          note: '$25\\pi$。',
        },
      ],
      answer: '25\\pi\\ \\text{cm}^2',
      pitfall: '$5^2=25$（$5\\times2=10$ ではない）。$2$ 乗を先に。',
    },
    {
      id: 'plane1-3',
      text: '半径 $6$ cm、中心角 $60^\\circ$ のおうぎ形の弧の長さを求めよう。',
      recall: {
        points: [
          'おうぎ形は円の一部。中心角の割合 $\\dfrac{a}{360}$ をかける',
          '弧 ＝ 円周 × $\\dfrac{\\text{中心角}}{360}$',
        ],
        formula: { name: '弧の長さ', tex: '\\ell=2\\pi r\\times\\dfrac{a}{360}' },
        quiz: {
          q: '$60^\\circ$ は円全体のどれだけ？',
          choices: ['$\\dfrac{1}{6}$', '$\\dfrac{1}{60}$', '$\\dfrac{1}{3}$'],
          answer: 0,
          why: '$\\dfrac{60}{360}=\\dfrac{1}{6}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '中心角の割合を求めよう',
            tex: '\\dfrac{60}{360}=\\square',
            blanks: ['\\tfrac{1}{6}'],
            tiles: ['\\tfrac{1}{6}', '\\tfrac{1}{3}', '\\tfrac{1}{60}', '6'],
          },
          note: '約分して $\\dfrac{1}{6}$。',
        },
        {
          fill: {
            ask: '弧の長さを求めよう',
            tex: '\\ell=2\\pi\\times 6\\times\\tfrac{1}{6}=\\square',
            blanks: ['2\\pi'],
            tiles: ['2\\pi', '12\\pi', '6\\pi', '2'],
          },
          note: '$12\\pi\\times\\dfrac{1}{6}=2\\pi$。',
        },
      ],
      answer: '2\\pi\\ \\text{cm}',
      pitfall: '中心角の割合は $\\dfrac{a}{360}$。$\\dfrac{a}{180}$ にしない。',
    },
    {
      id: 'plane1-4',
      text: '半径 $6$ cm、中心角 $60^\\circ$ のおうぎ形の面積を求めよう。',
      recall: {
        points: [
          'おうぎ形の面積 ＝ 円の面積 × $\\dfrac{\\text{中心角}}{360}$',
          '$S=\\pi r^2\\times\\dfrac{a}{360}$',
        ],
        formula: { name: 'おうぎ形の面積', tex: 'S=\\pi r^2\\times\\dfrac{a}{360}' },
        quiz: {
          q: 'おうぎ形の面積は円の面積に何をかける？',
          choices: ['$\\dfrac{\\text{中心角}}{360}$', '$\\dfrac{\\text{中心角}}{180}$', '$2$'],
          answer: 0,
          why: '中心角の割合をかける。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず円の面積を求めよう',
            tex: '\\pi\\times 6^2=\\square\\pi',
            blanks: ['36'],
            tiles: ['36', '12', '6', '18'],
          },
          note: '$6^2=36$ で $36\\pi$。',
        },
        {
          fill: {
            ask: '中心角の割合をかけよう',
            tex: 'S=36\\pi\\times\\tfrac{1}{6}=\\square',
            blanks: ['6\\pi'],
            tiles: ['6\\pi', '36\\pi', '12\\pi', '6'],
          },
          note: '$36\\pi\\times\\dfrac{1}{6}=6\\pi$。',
        },
      ],
      answer: '6\\pi\\ \\text{cm}^2',
      pitfall: '半径は $2$ 乗、中心角は割合。$6^2=36$ を忘れない。',
    },
    {
      id: 'plane1-5',
      text: '半径 $4$ cm、弧の長さ $\\pi$ cm のおうぎ形の中心角を求めよう。',
      recall: {
        points: [
          '弧 ＝ 円周 × $\\dfrac{a}{360}$ を $a$ について考える',
          '弧が円周の何分のいくつか（割合）から中心角を出す',
        ],
        formula: { name: '中心角', tex: 'a=360\\times\\dfrac{\\ell}{2\\pi r}' },
        quiz: {
          q: 'まず求めるのは？',
          choices: ['弧 ÷ 円周（割合）', '半径 ×2', '面積'],
          answer: 0,
          why: '弧が円周の何分のいくつかが、そのまま中心角の割合。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず円周を求めよう',
            tex: '2\\pi\\times 4=\\square\\pi',
            blanks: ['8'],
            tiles: ['8', '4', '16', '2'],
          },
          note: '円周は $8\\pi$。',
        },
        {
          fill: {
            ask: '弧 ÷ 円周（割合）を求めよう',
            tex: '\\dfrac{\\pi}{8\\pi}=\\square',
            blanks: ['\\tfrac{1}{8}'],
            tiles: ['\\tfrac{1}{8}', '\\tfrac{1}{4}', '8', '\\tfrac{1}{2}'],
          },
          note: '$\\pi$ どうしが約分されて $\\dfrac{1}{8}$。',
        },
        {
          fill: {
            ask: '中心角を求めよう',
            tex: 'a=360\\times\\tfrac{1}{8}=\\square',
            blanks: ['45'],
            tiles: ['45', '60', '90', '30'],
          },
          note: '$360\\div8=45$ で $45^\\circ$。',
        },
      ],
      answer: '45^\\circ',
      pitfall: '弧と円周の比が中心角の割合。最後に $360$ をかけ忘れない。',
    },
    {
      id: 'plane1-6',
      text: '半径 $6$ cm、中心角 $60^\\circ$ のおうぎ形の「まわりの長さ」（周の長さ）を求めよう。',
      recall: {
        points: [
          'おうぎ形のまわり ＝ 弧 ＋ 半径 ×2（切り口の半径2本）',
          '弧だけで終わらせない',
        ],
        formula: { name: 'おうぎ形の周', tex: '(\\text{周})=\\ell+2r' },
        quiz: {
          q: 'おうぎ形のまわりに含むのは？',
          choices: ['弧 ＋ 半径2本', '弧だけ', '直径'],
          answer: 0,
          why: '切り口の半径2本も「まわり」に含む。',
        },
      },
      steps: [
        {
          fill: {
            ask: '弧の長さを求めよう',
            tex: '\\ell=2\\pi\\times 6\\times\\tfrac{1}{6}=\\square',
            blanks: ['2\\pi'],
            tiles: ['2\\pi', '12\\pi', '6\\pi', '2'],
          },
          note: '弧は $2\\pi$。',
        },
        {
          fill: {
            ask: '半径 $2$ 本の長さは？',
            tex: '2\\times 6=\\square',
            blanks: ['12'],
            tiles: ['12', '6', '36', '3'],
          },
          note: '半径 $6$ が $2$ 本で $12$。',
        },
        {
          fill: {
            ask: 'まわりの長さを完成させよう',
            tex: '(\\text{周})=2\\pi+\\square',
            blanks: ['12'],
            tiles: ['12', '6', '2\\pi', '24'],
          },
          note: '弧 $2\\pi$ ＋ 半径2本 $12$。',
        },
      ],
      answer: '(2\\pi+12)\\ \\text{cm}',
      pitfall: 'おうぎ形のまわりは弧だけではない。半径 $2$ 本を必ず足す。',
    },
  ],
  space1: [
    {
      id: 'space1-1',
      text: 'たて $3$ cm、横 $4$ cm、高さ $5$ cm の直方体の体積を求めよう。',
      recall: {
        points: [
          '直方体の体積 ＝ たて × 横 × 高さ',
          '＝ 底面積 × 高さ とも見られる',
        ],
        formula: { name: '直方体', tex: 'V=\\text{たて}\\times\\text{横}\\times\\text{高さ}' },
        quiz: {
          q: '体積の求め方は？',
          choices: ['たて × 横 × 高さ', 'たて ＋ 横 ＋ 高さ', '底面積 × 2'],
          answer: 0,
          why: '$3$ つの辺をかける。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず底面積（たて × 横）を求めよう',
            tex: '3\\times 4=\\square',
            blanks: ['12'],
            tiles: ['12', '7', '60', '24'],
          },
          note: '底面積は $12$。',
        },
        {
          fill: {
            ask: '高さをかけよう',
            tex: '12\\times 5=\\square',
            blanks: ['60'],
            tiles: ['60', '17', '12', '120'],
          },
          note: '$12\\times5=60$。',
        },
      ],
      answer: '60\\ \\text{cm}^3',
      pitfall: '体積は $3$ 辺の積。単位は cm³（$3$ 乗）。',
    },
    {
      id: 'space1-2',
      text: '底面の半径 $3$ cm、高さ $5$ cm の円柱の体積を求めよう。',
      recall: {
        points: [
          '柱の体積 ＝ 底面積 × 高さ',
          '円柱の底面積は $\\pi r^2$',
        ],
        formula: { name: '柱の体積', tex: 'V=\\pi r^2\\times h' },
        quiz: {
          q: '円柱の底面積は？',
          choices: ['$\\pi r^2$', '$2\\pi r$', '$\\pi r^2 h$'],
          answer: 0,
          why: '底面は円なので $\\pi r^2$。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず底面積を求めよう',
            tex: '\\pi\\times 3^2=\\square\\pi',
            blanks: ['9'],
            tiles: ['9', '6', '3', '12'],
          },
          note: '$3^2=9$ で $9\\pi$。',
        },
        {
          fill: {
            ask: '高さをかけよう',
            tex: 'V=9\\pi\\times 5=\\square',
            blanks: ['45\\pi'],
            tiles: ['45\\pi', '14\\pi', '9\\pi', '45'],
          },
          note: '$9\\times5=45$ で $45\\pi$。',
        },
      ],
      answer: '45\\pi\\ \\text{cm}^3',
      pitfall: '底面積は $\\pi r^2$（$r^2$ を忘れない）。それに高さをかける。',
    },
    {
      id: 'space1-3',
      text: '底面の半径 $3$ cm、高さ $6$ cm の円錐の体積を求めよう。',
      recall: {
        points: [
          '錐（とがった立体）の体積は、同じ底面・高さの柱の $\\dfrac{1}{3}$',
          '$V=\\dfrac{1}{3}\\times\\text{底面積}\\times\\text{高さ}$',
        ],
        formula: { name: '錐の体積', tex: 'V=\\dfrac{1}{3}\\pi r^2 h' },
        quiz: {
          q: '円錐の体積は同じ円柱の何倍？',
          choices: ['$\\dfrac{1}{3}$', '$\\dfrac{1}{2}$', '同じ'],
          answer: 0,
          why: '錐は柱の $\\dfrac{1}{3}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず底面積を求めよう',
            tex: '\\pi\\times 3^2=\\square\\pi',
            blanks: ['9'],
            tiles: ['9', '6', '3', '12'],
          },
          note: '$9\\pi$。',
        },
        {
          fill: {
            ask: '柱として 底面積 × 高さ を計算しよう',
            tex: '9\\pi\\times 6=\\square',
            blanks: ['54\\pi'],
            tiles: ['54\\pi', '15\\pi', '9\\pi', '54'],
          },
          note: '$9\\times6=54$。',
        },
        {
          fill: {
            ask: '$\\dfrac{1}{3}$ をかけよう',
            tex: 'V=54\\pi\\times\\tfrac{1}{3}=\\square',
            blanks: ['18\\pi'],
            tiles: ['18\\pi', '54\\pi', '27\\pi', '18'],
          },
          note: '$54\\div3=18$ で $18\\pi$。',
        },
      ],
      answer: '18\\pi\\ \\text{cm}^3',
      pitfall: '錐は最後に $\\dfrac{1}{3}$ をかけ忘れない。',
    },
    {
      id: 'space1-4',
      text: '底面の半径 $3$ cm、高さ $5$ cm の円柱の表面積を求めよう。',
      recall: {
        points: [
          '表面積 ＝ 側面積 ＋ 底面積 ×2（上下2つ）',
          '側面を展開すると長方形：たて＝高さ、横＝底面の円周 $2\\pi r$',
        ],
        formula: { name: '円柱の表面積', tex: 'S=2\\pi r h+2\\times\\pi r^2' },
        quiz: {
          q: '円柱の側面を展開すると？',
          choices: ['長方形', '円', '三角形'],
          answer: 0,
          why: '側面は長方形（横が底面の円周）。',
        },
      },
      steps: [
        {
          fill: {
            ask: '側面積（円周 × 高さ）を求めよう',
            tex: '2\\pi\\times 3\\times 5=\\square\\pi',
            blanks: ['30'],
            tiles: ['30', '15', '6', '9'],
          },
          note: '円周 $2\\pi\\times3=6\\pi$、$\\times5=30\\pi$。',
        },
        {
          fill: {
            ask: '底面（円）$2$ つ分を求めよう',
            tex: '2\\times\\pi\\times 3^2=\\square\\pi',
            blanks: ['18'],
            tiles: ['18', '9', '6', '12'],
          },
          note: '底面 $9\\pi$ が $2$ つで $18\\pi$。',
        },
        {
          fill: {
            ask: '合計しよう',
            tex: 'S=30\\pi+18\\pi=\\square',
            blanks: ['48\\pi'],
            tiles: ['48\\pi', '12\\pi', '540\\pi', '48'],
          },
          note: '$30\\pi+18\\pi=48\\pi$。',
        },
      ],
      answer: '48\\pi\\ \\text{cm}^2',
      pitfall: '底面は上下 $2$ つ。側面の横は底面の円周 $2\\pi r$。',
    },
    {
      id: 'space1-5',
      text: '底面の半径 $3$ cm、母線 $5$ cm の円錐の表面積を求めよう。',
      recall: {
        points: [
          '表面積 ＝ 側面（おうぎ形）＋ 底面の円',
          '円錐の側面積 ＝ $\\pi\\times(\\text{母線})\\times(\\text{半径})$ と覚えると速い',
        ],
        formula: { name: '円錐の表面積', tex: 'S=\\pi R r+\\pi r^2\\quad(R=\\text{母線})' },
        quiz: {
          q: '円錐の側面積の便利な式は？',
          choices: ['$\\pi\\times(\\text{母線})\\times(\\text{半径})$', '$\\pi r^2$', '$2\\pi r$'],
          answer: 0,
          why: '側面のおうぎ形の面積は $\\pi R r$ にまとまる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '側面積（$\\pi\\times$母線$\\times$半径）を求めよう',
            tex: '\\pi\\times 5\\times 3=\\square\\pi',
            blanks: ['15'],
            tiles: ['15', '8', '9', '25'],
          },
          note: '$5\\times3=15$ で $15\\pi$。',
        },
        {
          fill: {
            ask: '底面（円）の面積を求めよう',
            tex: '\\pi\\times 3^2=\\square\\pi',
            blanks: ['9'],
            tiles: ['9', '6', '3', '15'],
          },
          note: '$3^2=9$ で $9\\pi$。',
        },
        {
          fill: {
            ask: '合計しよう',
            tex: 'S=15\\pi+9\\pi=\\square',
            blanks: ['24\\pi'],
            tiles: ['24\\pi', '135\\pi', '6\\pi', '24'],
          },
          note: '$15\\pi+9\\pi=24\\pi$。',
        },
      ],
      answer: '24\\pi\\ \\text{cm}^2',
      pitfall: '側面積は母線（斜めの長さ）を使う。高さと取り違えない。',
    },
    {
      id: 'space1-6',
      text: '半径 $3$ cm の球の体積と表面積を求めよう。',
      recall: {
        points: [
          '球の体積 ＝ $\\dfrac{4}{3}\\pi r^3$',
          '球の表面積 ＝ $4\\pi r^2$',
        ],
        formula: { name: '球', tex: 'V=\\dfrac{4}{3}\\pi r^3,\\quad S=4\\pi r^2' },
        quiz: {
          q: '球の表面積の式は？',
          choices: ['$4\\pi r^2$', '$\\dfrac{4}{3}\\pi r^3$', '$\\pi r^2$'],
          answer: 0,
          why: '表面積は $4\\pi r^2$、体積は $\\dfrac{4}{3}\\pi r^3$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '体積を求めよう（$r^3$ に注意）',
            tex: 'V=\\dfrac{4}{3}\\pi\\times 3^3=\\square',
            blanks: ['36\\pi'],
            tiles: ['36\\pi', '27\\pi', '12\\pi', '36'],
          },
          note: '$3^3=27$、$\\dfrac{4}{3}\\times27=36$。',
        },
        {
          fill: {
            ask: '表面積を求めよう（$r^2$ に注意）',
            tex: 'S=4\\pi\\times 3^2=\\square',
            blanks: ['36\\pi'],
            tiles: ['36\\pi', '12\\pi', '9\\pi', '36'],
          },
          note: '$3^2=9$、$4\\times9=36$。',
        },
      ],
      answer: 'V=36\\pi\\ \\text{cm}^3,\\quad S=36\\pi\\ \\text{cm}^2',
      pitfall: '体積は $r^3$、表面積は $r^2$。係数 $\\dfrac{4}{3}$ と $4$ を取り違えない。',
    },
  ],
  data1: [
    {
      id: 'data1-1',
      text: '$5$ 人のテストの点が $6, 8, 7, 9, 10$ 点。平均値を求めよう。',
      recall: {
        points: [
          '平均値 ＝ 合計 ÷ 個数',
          'まず全部の値を足す',
        ],
        formula: { name: '平均値', tex: '\\text{平均}=\\dfrac{\\text{合計}}{\\text{個数}}' },
        quiz: {
          q: '平均値の求め方は？',
          choices: ['合計 ÷ 個数', '真ん中の値', '一番多い値'],
          answer: 0,
          why: '合計を個数で割る。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず合計を求めよう',
            tex: '6+8+7+9+10=\\square',
            blanks: ['40'],
            tiles: ['40', '35', '45', '30'],
          },
          note: '合計は $40$ 点。',
        },
        {
          fill: {
            ask: '個数で割ろう',
            tex: '\\dfrac{40}{5}=\\square',
            blanks: ['8'],
            tiles: ['8', '7', '9', '40'],
          },
          note: '$40\\div5=8$。',
        },
      ],
      answer: '8\\ \\text{点}',
      pitfall: '平均は合計 ÷ 個数。個数で割り忘れない。',
    },
    {
      id: 'data1-2',
      text: 'データ $3, 7, 4, 9, 5$ の中央値（メジアン）を求めよう。',
      recall: {
        points: [
          '中央値 ＝ 小さい順に並べて真ん中にくる値',
          'データが偶数個なら、中央 $2$ つの平均',
        ],
        formula: { name: '中央値', tex: '\\text{並べた真ん中の値}' },
        quiz: {
          q: '中央値を求めるにはまず？',
          choices: ['小さい順に並べる', '合計を出す', '一番多い値を探す'],
          answer: 0,
          why: '並べ替えてから真ん中を見る。',
        },
      },
      steps: [
        {
          fill: {
            ask: '小さい順に並べて真ん中の値は？',
            tex: '3,\\ 4,\\ 5,\\ 7,\\ 9\\ \\text{の真ん中は}\\ \\square',
            blanks: ['5'],
            tiles: ['5', '4', '7', '3'],
          },
          note: '$5$ 個の真ん中（$3$ 番目）は $5$。',
        },
        {
          fill: {
            ask: 'もし $3,4,5,7$ の $4$ 個なら、中央 $2$ つの平均は？',
            tex: '\\dfrac{4+5}{2}=\\square',
            blanks: ['4.5'],
            tiles: ['4.5', '4', '5', '9'],
          },
          note: '偶数個は中央 $2$ つ（$4$ と $5$）の平均。',
        },
      ],
      answer: '5',
      pitfall: '並べ替えてから真ん中を取る。偶数個は中央 $2$ つの平均。',
    },
    {
      id: 'data1-3',
      text: 'データ $2, 3, 3, 5, 3, 7, 5$ の最頻値（モード）を求めよう。',
      recall: {
        points: [
          '最頻値 ＝ 最も多く現れる値',
          '各値が何回出るかを数える',
        ],
        formula: { name: '最頻値', tex: '\\text{最も度数が大きい値}' },
        quiz: {
          q: '最頻値とは？',
          choices: ['一番多く出る値', '真ん中の値', '平均'],
          answer: 0,
          why: '出現回数が最大の値。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$3$ は何回出てくる？',
            tex: '3\\ \\text{は}\\ \\square\\ \\text{回}',
            blanks: ['3'],
            tiles: ['3', '2', '1', '5'],
          },
          note: '$3$ が $3$ 回で最も多い（$5$ は $2$ 回）。',
        },
        {
          fill: {
            ask: '最頻値を答えよう',
            tex: '\\text{最頻値}=\\square',
            blanks: ['3'],
            tiles: ['3', '5', '7', '2'],
          },
          note: '最も多く出る「値」は $3$。',
        },
      ],
      answer: '3',
      pitfall: '最頻値は「値」であって「回数」ではない。回数 $3$ 回と混同しない。',
    },
    {
      id: 'data1-4',
      text: 'データ $12, 18, 9, 15, 20$ の範囲を求めよう。',
      recall: {
        points: [
          '範囲（レンジ）＝ 最大値 − 最小値',
          'データの散らばりの大きさを表す',
        ],
        formula: { name: '範囲', tex: '\\text{範囲}=\\text{最大値}-\\text{最小値}' },
        quiz: {
          q: '範囲の式は？',
          choices: ['最大値 − 最小値', '最大値 ＋ 最小値', '真ん中の値'],
          answer: 0,
          why: '最大から最小を引く。',
        },
      },
      steps: [
        {
          fill: {
            ask: '最大値 − 最小値 を計算しよう',
            tex: '20-9=\\square',
            blanks: ['11'],
            tiles: ['11', '29', '9', '20'],
          },
          note: '最大 $20$、最小 $9$。$20-9=11$。',
        },
      ],
      answer: '11',
      pitfall: '範囲は引き算（最大 − 最小）。足さない。',
    },
    {
      id: 'data1-5',
      text: '$40$ 人のうち、ある階級の度数が $10$ 人だった。この階級の相対度数を求めよう。',
      recall: {
        points: [
          '相対度数 ＝ その階級の度数 ÷ 全体の度数',
          'すべての相対度数を合計すると $1$ になる',
        ],
        formula: { name: '相対度数', tex: '\\text{相対度数}=\\dfrac{\\text{その階級の度数}}{\\text{度数の合計}}' },
        quiz: {
          q: '相対度数の求め方は？',
          choices: ['度数 ÷ 合計', '度数 × 合計', '度数 − 合計'],
          answer: 0,
          why: 'その階級が全体に占める割合。',
        },
      },
      steps: [
        {
          fill: {
            ask: '度数 ÷ 合計 を計算しよう',
            tex: '\\dfrac{10}{40}=\\square',
            blanks: ['0.25'],
            tiles: ['0.25', '0.4', '2.5', '4'],
          },
          note: '$10\\div40=0.25$。',
        },
      ],
      answer: '0.25',
      pitfall: '相対度数は割合（合計で割る）。全部足すと $1$ になるか確認できる。',
    },
    {
      id: 'data1-6',
      text: '点数の階級値が $2, 4, 6$ 点、度数がそれぞれ $1, 3, 1$ 人。この $5$ 人の平均を求めよう。',
      recall: {
        points: [
          '度数分布からの平均 ＝（階級値 × 度数）の合計 ÷ 度数合計',
          '各階級で「階級値 × 度数」を出して足す',
        ],
        formula: { name: '度数分布の平均', tex: '\\text{平均}=\\dfrac{\\sum(\\text{階級値}\\times\\text{度数})}{\\text{度数合計}}' },
        quiz: {
          q: 'まず計算するのは？',
          choices: ['階級値 × 度数 の合計', '階級値だけの合計', '度数の最大'],
          answer: 0,
          why: '各階級で 階級値×度数 を出して合計する。',
        },
      },
      steps: [
        {
          fill: {
            ask: '（階級値 × 度数）の合計を求めよう',
            tex: '2\\cdot 1+4\\cdot 3+6\\cdot 1=\\square',
            blanks: ['20'],
            tiles: ['20', '12', '30', '10'],
          },
          note: '$2+12+6=20$。',
        },
        {
          fill: {
            ask: '度数合計 $5$ で割ろう',
            tex: '\\dfrac{20}{5}=\\square',
            blanks: ['4'],
            tiles: ['4', '5', '20', '3'],
          },
          note: '$20\\div5=4$ 点。',
        },
      ],
      answer: '4\\ \\text{点}',
      pitfall: '「階級値 × 度数」を足す。度数だけ足して割らない。',
    },
  ],
  calc2: [
    {
      id: 'calc2-1',
      text: '次を計算しよう：$(3x+2y)+(x-5y)$',
      recall: {
        points: [
          '加法はカッコをそのまま外して並べる',
          '同類項（$x$ どうし・$y$ どうし）をまとめる',
        ],
        formula: { name: '同類項', tex: 'ax+bx=(a+b)x' },
        quiz: {
          q: '$x$ の項と $y$ の項はまとめられる？',
          choices: ['まとめられない（別の文字）', 'まとめられる', '消える'],
          answer: 0,
          why: '文字が違う項は同類項ではない。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x$ の項をまとめよう',
            tex: '3x+x=\\square',
            blanks: ['4x'],
            tiles: ['4x', '3x', '2x', '4'],
          },
          note: '$x$ は $1x$。$3+1=4$ で $4x$。',
        },
        {
          fill: {
            ask: '$y$ の項をまとめよう',
            tex: '2y-5y=\\square',
            blanks: ['-3y'],
            tiles: ['-3y', '3y', '-7y', '-3'],
          },
          note: '$2-5=-3$ で $-3y$。',
        },
        {
          fill: {
            ask: '合わせて答えにしよう',
            tex: '\\square',
            blanks: ['4x-3y'],
            tiles: ['4x-3y', '4x+3y', '3x-3y', 'x-3y'],
          },
          note: '$4x$ と $-3y$ はこれ以上まとめられない。',
        },
      ],
      answer: '4x-3y',
      pitfall: '$x$ と $y$ は別物。$4x-3y$ を $1xy$ などにまとめない。',
    },
    {
      id: 'calc2-2',
      text: '次を計算しよう：$(5a-3b)-(2a-7b)$',
      recall: {
        points: [
          '引くカッコは、中の各項の符号を変えて外す',
          '$-(2a-7b)=-2a+7b$',
        ],
        formula: { name: 'カッコを外す', tex: '-(a-b)=-a+b' },
        quiz: {
          q: '$-(2a-7b)$ を外すと？',
          choices: ['$-2a+7b$', '$-2a-7b$', '$2a-7b$'],
          answer: 0,
          why: '引くカッコは全部の項の符号を変える。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'カッコを外そう（$-7b$ の符号は？）',
            tex: '5a-3b-2a\\square 7b',
            blanks: ['+'],
            tiles: ['+', '-'],
          },
          note: '$-(-7b)=+7b$。',
        },
        {
          fill: {
            ask: '$a$ の項をまとめよう',
            tex: '5a-2a=\\square',
            blanks: ['3a'],
            tiles: ['3a', '7a', '3', '-3a'],
          },
          note: '$5-2=3$ で $3a$。',
        },
        {
          fill: {
            ask: '$b$ の項をまとめよう',
            tex: '-3b+7b=\\square',
            blanks: ['4b'],
            tiles: ['4b', '-4b', '10b', '4'],
          },
          note: '$-3+7=4$ で $4b$。',
        },
      ],
      answer: '3a+4b',
      pitfall: '引くカッコは「全部の項」の符号を変える。後ろの $-7b$ を $+7b$ に。',
    },
    {
      id: 'calc2-3',
      text: '次を計算しよう：$4x\\times(-3x)$',
      recall: {
        points: [
          '係数どうし・文字どうしを分けてかける',
          '$x\\times x=x^2$',
        ],
        formula: { name: '単項式の乗法', tex: 'ax\\times bx=ab\\,x^2' },
        quiz: {
          q: '$x\\times x$ は？',
          choices: ['$x^2$', '$2x$', '$x$'],
          answer: 0,
          why: '同じ文字の積は $2$ 乗。',
        },
      },
      steps: [
        {
          fill: {
            ask: '係数どうしをかけよう',
            tex: '4\\times(-3)=\\square',
            blanks: ['-12'],
            tiles: ['-12', '12', '-7', '1'],
          },
          note: '異符号の積で $-12$。',
        },
        {
          fill: {
            ask: '文字どうしをかけよう',
            tex: 'x\\times x=\\square',
            blanks: ['x^2'],
            tiles: ['x^2', '2x', 'x', 'x^3'],
          },
          note: '$x\\times x=x^2$。',
        },
        {
          fill: {
            ask: '合わせて答えにしよう',
            tex: '\\square',
            blanks: ['-12x^2'],
            tiles: ['-12x^2', '12x^2', '-12x', '-7x^2'],
          },
          note: '$-12x^2$。',
        },
      ],
      answer: '-12x^2',
      pitfall: '係数は掛け算、文字は $x\\times x=x^2$。$x\\times x=2x$ としない。',
    },
    {
      id: 'calc2-4',
      text: '次を計算しよう：$8a^2\\div 2a$',
      recall: {
        points: [
          'わり算は分数にして約分する',
          '係数どうし、文字どうしで約分',
        ],
        formula: { name: '単項式の除法', tex: '\\dfrac{8a^2}{2a}=4a' },
        quiz: {
          q: '$\\dfrac{a^2}{a}$ は？',
          choices: ['$a$', '$a^2$', '$1$'],
          answer: 0,
          why: '$a^2\\div a=a$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '分数の形にしよう',
            tex: '8a^2\\div 2a=\\dfrac{8a^2}{\\square}',
            blanks: ['2a'],
            tiles: ['2a', '2', 'a', '8a'],
          },
          note: 'わる式 $2a$ が分母。',
        },
        {
          fill: {
            ask: '約分しよう',
            tex: '=\\square',
            blanks: ['4a'],
            tiles: ['4a', '4', '4a^2', '16a'],
          },
          note: '係数 $8\\div2=4$、文字 $a^2\\div a=a$。',
        },
      ],
      answer: '4a',
      pitfall: '$a^2\\div a=a$（$1$ ではない）。係数と文字を別々に約分。',
    },
    {
      id: 'calc2-5',
      text: '次を計算しよう：$2(3x-1)-3(x-4)$',
      recall: {
        points: [
          '各カッコを分配法則で外す',
          '$-3(x-4)$ の $-3$ は後ろの項にもかける（符号注意）',
        ],
        formula: { name: '分配 ＋ 同類項', tex: 'a(b+c)=ab+ac' },
        quiz: {
          q: '$-3\\times(-4)$ は？',
          choices: ['$+12$', '$-12$', '$-7$'],
          answer: 0,
          why: '負 × 負 ＝ 正で $+12$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '前のカッコを外そう（$2\\times(-1)$ の符号は？）',
            tex: '2(3x-1)=6x\\square 2',
            blanks: ['-'],
            tiles: ['-', '+'],
          },
          note: '$2\\times(-1)=-2$。',
        },
        {
          fill: {
            ask: '後ろのカッコを外そう（$-3\\times(-4)$ は？）',
            tex: '-3(x-4)=-3x+\\square',
            blanks: ['12'],
            tiles: ['12', '-12', '4', '7'],
          },
          note: '$-3\\times(-4)=+12$。',
        },
        {
          fill: {
            ask: '同類項をまとめよう',
            tex: '6x-2-3x+12=\\square',
            blanks: ['3x+10'],
            tiles: ['3x+10', '3x-10', '9x+10', '3x+14'],
          },
          note: '$6x-3x=3x$、$-2+12=10$。',
        },
      ],
      answer: '3x+10',
      pitfall: '$-3(x-4)$ の後ろは $+12$（符号反転）。最後に同類項をまとめる。',
    },
    {
      id: 'calc2-6',
      text: '等式 $2x+3y=12$ を $y$ について解こう。',
      recall: {
        points: [
          '解きたい文字 $y$ の項だけを左に残す',
          '他を移項し、最後に $y$ の係数で両辺を割る',
        ],
        formula: { name: '等式変形', tex: 'y=\\dfrac{\\cdots}{\\cdots}' },
        quiz: {
          q: '「$y$ について解く」とは？',
          choices: ['$y=\\ldots$ の形にする', '$y$ を消す', '$x$ を求める'],
          answer: 0,
          why: '$y=$（残りの式）の形に変形すること。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2x$ を移項しよう',
            tex: '3y=12-\\square',
            blanks: ['2x'],
            tiles: ['2x', '3y', '12', '-2x'],
          },
          note: '$2x$ を右へ移すと $-2x$。',
        },
        {
          fill: {
            ask: '両辺を $y$ の係数で割ろう',
            tex: 'y=\\dfrac{12-2x}{\\square}',
            blanks: ['3'],
            tiles: ['3', '2', '12', 'y'],
          },
          note: '両辺を $3$ で割る。',
        },
      ],
      answer: 'y=\\dfrac{12-2x}{3}',
      pitfall: '割るときは「右辺全体」を $3$ で割る。$12$ だけ割らない。',
    },
  ],
  simul: [
    {
      id: 'simul-1',
      text: '連立方程式を解こう：$\\begin{cases}x+y=7\\\\ x-y=1\\end{cases}$',
      recall: {
        points: [
          '同じ文字の係数に注目する',
          '$y$ の係数が $+1,\\ -1$ → たすと $y$ が消える（加減法）',
        ],
        formula: { name: '加減法', tex: '\\text{係数をそろえて たす/ひく}' },
        quiz: {
          q: '$y$ を消すには？',
          choices: ['2式をたす', '2式をかける', 'そのまま代入'],
          answer: 0,
          why: '$+y$ と $-y$ はたすと消える。',
        },
      },
      steps: [
        {
          fill: {
            ask: '2式をたして $y$ を消そう',
            tex: '(x+y)+(x-y)=7+1\\ \\Rightarrow\\ 2x=\\square',
            blanks: ['8'],
            tiles: ['8', '6', '7', '2'],
          },
          note: '$y$ が消えて $2x=8$。',
        },
        {
          fill: {
            ask: '$x$ を求めよう',
            tex: 'x=\\square',
            blanks: ['4'],
            tiles: ['4', '8', '3', '2'],
          },
          note: '$8\\div2=4$。',
        },
        {
          fill: {
            ask: '$x=4$ を代入して $y$ を求めよう',
            tex: '4+y=7\\ \\Rightarrow\\ y=\\square',
            blanks: ['3'],
            tiles: ['3', '4', '11', '-3'],
          },
          note: '$y=7-4=3$。',
        },
      ],
      answer: 'x=4,\\ y=3',
      pitfall: '$x$ を求めたら元の式に戻して $y$ も出す。解は $x,y$ の両方。',
    },
    {
      id: 'simul-2',
      text: '連立方程式を解こう：$\\begin{cases}2x+y=8\\\\ x+y=5\\end{cases}$',
      recall: {
        points: [
          '$y$ の係数がどちらも $+1$ → ひくと $y$ が消える',
          '係数が同じ・同符号なら「ひく」',
        ],
        formula: { name: '加減法', tex: '\\text{係数が同じ → ひく}' },
        quiz: {
          q: '$y$ を消すには？',
          choices: ['2式をひく', '2式をたす', '2式をかける'],
          answer: 0,
          why: '同係数・同符号なら引くと消える。',
        },
      },
      steps: [
        {
          fill: {
            ask: '上の式から下の式をひこう',
            tex: '(2x+y)-(x+y)=8-5\\ \\Rightarrow\\ x=\\square',
            blanks: ['3'],
            tiles: ['3', '13', '5', '2'],
          },
          note: '$y$ が消えて $x=3$。',
        },
        {
          fill: {
            ask: '$x=3$ を代入して $y$ を求めよう',
            tex: '3+y=5\\ \\Rightarrow\\ y=\\square',
            blanks: ['2'],
            tiles: ['2', '3', '8', '-2'],
          },
          note: '$y=5-3=2$。',
        },
      ],
      answer: 'x=3,\\ y=2',
      pitfall: '係数が同じなら「ひく」。たすと文字が残ってしまう。',
    },
    {
      id: 'simul-3',
      text: '連立方程式を解こう：$\\begin{cases}y=2x-1\\\\ 3x+y=9\\end{cases}$',
      recall: {
        points: [
          '$y=\\cdots$ の形がある → 代入法が速い',
          '下の式の $y$ に $2x-1$ をそのまま代入',
        ],
        formula: { name: '代入法', tex: 'y=\\cdots\\ \\text{を他方の式へ代入}' },
        quiz: {
          q: '代入法が向くのは？',
          choices: ['$y=\\cdots$ の形があるとき', '係数が同じとき', '分数のとき'],
          answer: 0,
          why: '一方が $y=$ の形なら代入が速い。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$y$ に $2x-1$ を代入して整理しよう',
            tex: '3x+(2x-1)=9\\ \\Rightarrow\\ 5x=\\square',
            blanks: ['10'],
            tiles: ['10', '9', '8', '5'],
          },
          note: '$-1$ を移項して $9+1=10$。',
        },
        {
          fill: {
            ask: '$x$ を求めよう',
            tex: 'x=\\square',
            blanks: ['2'],
            tiles: ['2', '10', '5', '-2'],
          },
          note: '$10\\div5=2$。',
        },
        {
          fill: {
            ask: '$y=2x-1$ に代入して $y$ を求めよう',
            tex: 'y=2\\times 2-1=\\square',
            blanks: ['3'],
            tiles: ['3', '5', '1', '4'],
          },
          note: '$4-1=3$。',
        },
      ],
      answer: 'x=2,\\ y=3',
      pitfall: '代入するときはカッコをつける。$-1$ の移項を忘れない。',
    },
    {
      id: 'simul-4',
      text: '連立方程式を解こう：$\\begin{cases}3x+2y=13\\\\ x+y=5\\end{cases}$',
      recall: {
        points: [
          '係数がそろっていない → 一方を何倍かしてそろえる',
          '下の式を $2$ 倍すると $2y$ がそろう',
        ],
        formula: { name: '係数をそろえる', tex: '\\text{一方を何倍かしてそろえる}' },
        quiz: {
          q: '$y$ をそろえるには下の式を？',
          choices: ['$2$ 倍する', '$3$ 倍する', 'そのまま'],
          answer: 0,
          why: '$2y$ にそろえるため下の式を $2$ 倍。',
        },
      },
      steps: [
        {
          fill: {
            ask: '下の式を $2$ 倍しよう',
            tex: 'x+y=5\\ \\Rightarrow\\ 2x+2y=\\square',
            blanks: ['10'],
            tiles: ['10', '5', '7', '2'],
          },
          note: '両辺を $2$ 倍。$2x+2y=10$。',
        },
        {
          fill: {
            ask: '上の式からひいて $y$ を消そう',
            tex: '(3x+2y)-(2x+2y)=13-10\\ \\Rightarrow\\ x=\\square',
            blanks: ['3'],
            tiles: ['3', '23', '5', '2'],
          },
          note: '$2y$ が消えて $x=3$。',
        },
        {
          fill: {
            ask: '$x=3$ を代入して $y$ を求めよう',
            tex: '3+y=5\\ \\Rightarrow\\ y=\\square',
            blanks: ['2'],
            tiles: ['2', '3', '8', '-2'],
          },
          note: '$y=2$。',
        },
      ],
      answer: 'x=3,\\ y=2',
      pitfall: '何倍かするときは「両辺の全部の項」を倍にする。片方だけ倍にしない。',
    },
    {
      id: 'simul-5',
      text: 'りんご $2$ 個とみかん $3$ 個で $320$ 円、りんご $1$ 個とみかん $2$ 個で $190$ 円。りんご $1$ 個の値段は？',
      recall: {
        points: [
          'りんごを $x$ 円、みかんを $y$ 円とおく',
          '$2$ つの場面から式を $2$ つ立てて連立にする',
        ],
        formula: { name: '立式', tex: '\\begin{cases}2x+3y=320\\\\ x+2y=190\\end{cases}' },
        quiz: {
          q: '何を文字でおく？',
          choices: ['りんごとみかんの値段', '合計金額', '買った個数'],
          answer: 0,
          why: '求めたい値段を $x,y$ にすると式が立つ。',
        },
      },
      steps: [
        {
          fill: {
            ask: '下の式を $2$ 倍して $x$ をそろえよう',
            tex: 'x+2y=190\\ \\Rightarrow\\ 2x+4y=\\square',
            blanks: ['380'],
            tiles: ['380', '190', '320', '200'],
          },
          note: '両辺を $2$ 倍。',
        },
        {
          fill: {
            ask: '上の式からひいて $y$ を求めよう',
            tex: '(2x+4y)-(2x+3y)=380-320\\ \\Rightarrow\\ y=\\square',
            blanks: ['60'],
            tiles: ['60', '700', '40', '30'],
          },
          note: 'みかん $1$ 個は $60$ 円。',
        },
        {
          fill: {
            ask: '$y=60$ を代入してりんご $x$ を求めよう',
            tex: 'x+2\\times 60=190\\ \\Rightarrow\\ x=\\square',
            blanks: ['70'],
            tiles: ['70', '120', '190', '60'],
          },
          note: '$x=190-120=70$。',
        },
      ],
      answer: 'x=70\\ \\text{円}',
      pitfall: '文字が何を表すか明記。問われているのはりんご（$x$）の値段。',
    },
    {
      id: 'simul-6',
      text: '大小 $2$ つの数があり、和は $20$、差は $4$。大きい数を $x$、小さい数を $y$ として求めよう。',
      recall: {
        points: [
          '和と差から式を $2$ つ立てる',
          '$x+y=20,\\ x-y=4$ を連立にする',
        ],
        formula: { name: '和差算（連立）', tex: '\\begin{cases}x+y=20\\\\ x-y=4\\end{cases}' },
        quiz: {
          q: '「差が $4$」の式は？',
          choices: ['$x-y=4$', '$x+y=4$', '$xy=4$'],
          answer: 0,
          why: '大 − 小 ＝ 差。',
        },
      },
      steps: [
        {
          fill: {
            ask: '2式をたして $y$ を消そう',
            tex: '(x+y)+(x-y)=20+4\\ \\Rightarrow\\ 2x=\\square',
            blanks: ['24'],
            tiles: ['24', '16', '20', '4'],
          },
          note: '$y$ が消えて $2x=24$。',
        },
        {
          fill: {
            ask: '$x$ を求めよう',
            tex: 'x=\\square',
            blanks: ['12'],
            tiles: ['12', '24', '8', '6'],
          },
          note: '$24\\div2=12$。',
        },
        {
          fill: {
            ask: '$x=12$ を代入して $y$ を求めよう',
            tex: '12+y=20\\ \\Rightarrow\\ y=\\square',
            blanks: ['8'],
            tiles: ['8', '12', '32', '-8'],
          },
          note: '$y=20-12=8$。',
        },
      ],
      answer: 'x=12,\\ y=8',
      pitfall: '「和差算」は連立にすると確実。たし算で大きい数が先に出る。',
    },
  ],
  angle: [
    {
      id: 'angle-1',
      text: '$2$ 直線が $1$ 点で交わるとき、一方の角が $50^\\circ$ である。その対頂角の大きさを求めよう。',
      recall: {
        points: [
          '対頂角（向かい合う角）は等しい',
          'となり合う角は一直線で和が $180^\\circ$',
        ],
        formula: { name: '対頂角', tex: '\\text{対頂角は等しい}' },
        quiz: {
          q: '対頂角の関係は？',
          choices: ['等しい', '和が $180^\\circ$', '和が $90^\\circ$'],
          answer: 0,
          why: '向かい合う角（対頂角）は等しい。',
        },
      },
      steps: [
        {
          fill: {
            ask: '対頂角の大きさは？',
            tex: '\\text{対頂角}=\\square^\\circ',
            blanks: ['50'],
            tiles: ['50', '130', '40', '90'],
          },
          note: '対頂角は等しいので $50^\\circ$。',
        },
        {
          fill: {
            ask: 'となり合う角（一直線）は？',
            tex: '180-50=\\square^\\circ',
            blanks: ['130'],
            tiles: ['130', '50', '90', '230'],
          },
          note: 'となり合う角は和が $180^\\circ$。',
        },
      ],
      answer: '50^\\circ',
      pitfall: '対頂角は等しい、となり合う角は和が $180^\\circ$。混同しない。',
    },
    {
      id: 'angle-2',
      text: '$\\ell\\parallel m$ のとき、同位角の $1$ つが $70^\\circ$ である。その錯角の大きさを求めよう。',
      recall: {
        points: [
          '平行線では同位角・錯角が等しい',
          '同側内角は和が $180^\\circ$',
        ],
        formula: { name: '平行線の角', tex: '\\ell\\parallel m\\ \\Rightarrow\\ \\text{同位角・錯角は等しい}' },
        quiz: {
          q: '平行線で等しい角は？',
          choices: ['同位角・錯角', '対頂角だけ', 'すべて $90^\\circ$'],
          answer: 0,
          why: '平行なら同位角・錯角が等しい。',
        },
      },
      steps: [
        {
          fill: {
            ask: '錯角の大きさは？',
            tex: '\\text{錯角}=\\square^\\circ',
            blanks: ['70'],
            tiles: ['70', '110', '20', '90'],
          },
          note: '同位角＝錯角なので $70^\\circ$。',
        },
        {
          fill: {
            ask: '同側内角（となりの内角）は？',
            tex: '180-70=\\square^\\circ',
            blanks: ['110'],
            tiles: ['110', '70', '90', '20'],
          },
          note: '同側内角は和が $180^\\circ$。',
        },
      ],
      answer: '70^\\circ',
      pitfall: '同位角・錯角が等しいのは「平行」のときだけ。同側内角は和が $180^\\circ$。',
    },
    {
      id: 'angle-3',
      text: '三角形の $2$ つの内角が $50^\\circ$ と $60^\\circ$ のとき、残りの内角を求めよう。',
      recall: {
        points: [
          '三角形の内角の和は $180^\\circ$',
          '残り ＝ $180^\\circ$ −（$2$ 角の和）',
        ],
        formula: { name: '内角の和', tex: '\\text{三角形の内角の和}=180^\\circ' },
        quiz: {
          q: '三角形の内角の和は？',
          choices: ['$180^\\circ$', '$360^\\circ$', '$90^\\circ$'],
          answer: 0,
          why: 'どんな三角形でも $180^\\circ$。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず $2$ 角の和を求めよう',
            tex: '50+60=\\square',
            blanks: ['110'],
            tiles: ['110', '120', '100', '90'],
          },
          note: '$2$ 角で $110^\\circ$。',
        },
        {
          fill: {
            ask: '$180^\\circ$ から引こう',
            tex: '180-110=\\square^\\circ',
            blanks: ['70'],
            tiles: ['70', '110', '60', '80'],
          },
          note: '残りの角は $70^\\circ$。',
        },
      ],
      answer: '70^\\circ',
      pitfall: '内角の和 $180^\\circ$ から $2$ 角を引く。',
    },
    {
      id: 'angle-4',
      text: '三角形で、ある外角ととなり合わない $2$ つの内角が $40^\\circ$ と $75^\\circ$ である。この外角を求めよう。',
      recall: {
        points: [
          '三角形の外角 ＝ となり合わない $2$ つの内角の和',
          '外角の定理',
        ],
        formula: { name: '外角の定理', tex: '\\text{外角}=\\text{となり合わない2内角の和}' },
        quiz: {
          q: '外角は何に等しい？',
          choices: ['となり合わない $2$ 内角の和', '$3$ つの内角の和', '$90^\\circ$'],
          answer: 0,
          why: '外角は、離れた $2$ つの内角の和に等しい。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2$ つの内角の和を求めよう',
            tex: '40+75=\\square^\\circ',
            blanks: ['115'],
            tiles: ['115', '105', '125', '65'],
          },
          note: '外角は $115^\\circ$。',
        },
      ],
      answer: '115^\\circ',
      pitfall: '外角＝「となり合わない」$2$ 内角の和。となりの内角は足さない。',
    },
    {
      id: 'angle-5',
      text: '六角形の内角の和を求めよう。',
      recall: {
        points: [
          '$n$ 角形の内角の和 ＝ $180^\\circ\\times(n-2)$',
          '$1$ つの頂点から対角線を引くと $(n-2)$ 個の三角形に分かれる',
        ],
        formula: { name: '内角の和', tex: '180^\\circ\\times(n-2)' },
        quiz: {
          q: '$n$ 角形の内角の和は？',
          choices: ['$180(n-2)$', '$180n$', '$360(n-2)$'],
          answer: 0,
          why: '$(n-2)$ 個の三角形に分かれる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$n-2$ を計算しよう（$n=6$）',
            tex: '6-2=\\square',
            blanks: ['4'],
            tiles: ['4', '6', '8', '3'],
          },
          note: '三角形 $4$ 個分。',
        },
        {
          fill: {
            ask: '$180^\\circ$ をかけよう',
            tex: '180\\times 4=\\square',
            blanks: ['720'],
            tiles: ['720', '1080', '540', '360'],
          },
          note: '$180\\times4=720$。',
        },
      ],
      answer: '720^\\circ',
      pitfall: '$(n-2)$ を使う。$180\\times n$ にしない。',
    },
    {
      id: 'angle-6',
      text: '正十二角形の $1$ つの外角の大きさを求めよう。',
      recall: {
        points: [
          '多角形の外角の和は、何角形でも $360^\\circ$',
          '正多角形なら $1$ つの外角 ＝ $\\dfrac{360^\\circ}{n}$',
        ],
        formula: { name: '外角', tex: '\\text{外角の和}=360^\\circ,\\quad \\text{1つ}=\\dfrac{360}{n}' },
        quiz: {
          q: '多角形の外角の和は？',
          choices: ['$360^\\circ$', '$180(n-2)$', 'その都度違う'],
          answer: 0,
          why: 'どんな多角形でも外角の和は $360^\\circ$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$360^\\circ \\div n$ を計算しよう（$n=12$）',
            tex: '\\dfrac{360}{12}=\\square^\\circ',
            blanks: ['30'],
            tiles: ['30', '60', '15', '150'],
          },
          note: '$1$ つの外角は $30^\\circ$。',
        },
      ],
      answer: '30^\\circ',
      pitfall: '外角の和は常に $360^\\circ$。$1$ つの内角を出すなら $180-30=150^\\circ$。',
    },
  ],
  congr: [
    {
      id: 'congr-1',
      text: '$\\triangle ABC$ と $\\triangle DEF$ で、$AB=DE,\\ BC=EF,\\ \\angle B=\\angle E$ のとき使える合同条件は？',
      recall: {
        points: [
          '三角形の合同条件は $3$ つ',
          '①3組の辺 ②2組の辺とその間の角 ③1組の辺とその両端の角',
          '「間の角」は $2$ 辺にはさまれた角',
        ],
        formula: { name: '合同条件', tex: '\\text{3辺／2辺と夾角／1辺と両端角}' },
        quiz: {
          q: '$\\angle B$ は辺 $AB,\\ BC$ の…',
          choices: ['間の角（はさむ角）', '向かいの角', '関係ない角'],
          answer: 0,
          why: '$\\angle B$ は辺 $AB$ と $BC$ の間にある。',
        },
      },
      steps: [
        {
          ask: '使える合同条件はどれ？',
          choices: [
            '2組の辺とその間の角がそれぞれ等しい',
            '3組の辺がそれぞれ等しい',
            '1組の辺とその両端の角がそれぞれ等しい',
          ],
          answer: 0,
          note: '$2$ 辺（$AB,BC$）と、その間の角（$\\angle B$）が等しいので「2辺と夾角」。',
        },
      ],
      answer: '\\text{2組の辺とその間の角がそれぞれ等しい}',
      pitfall: '「間の角」は $2$ 辺にはさまれた角。別の角では条件を満たさない。',
    },
    {
      id: 'congr-2',
      text: '$\\triangle ABC\\equiv\\triangle DEF$ で $AB=5,\\ BC=7$。対応から $DE$ の長さを求めよう。',
      recall: {
        points: [
          '合同な図形では対応する辺・角が等しい',
          '頂点の順 $ABC\\leftrightarrow DEF$ で対応を読む（$A\\leftrightarrow D$ など）',
        ],
        formula: { name: '対応', tex: 'ABC\\leftrightarrow DEF' },
        quiz: {
          q: '$AB$ に対応する辺は？',
          choices: ['$DE$', '$EF$', '$DF$'],
          answer: 0,
          why: '$A\\to D,\\ B\\to E$ なので $AB\\to DE$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$DE$ の長さは？',
            tex: 'DE=AB=\\square',
            blanks: ['5'],
            tiles: ['5', '7', '12', '35'],
          },
          note: '対応する辺は等しいので $DE=AB=5$。',
        },
      ],
      answer: 'DE=5',
      pitfall: '対応は頂点の順で読む。$AB\\leftrightarrow DE$、$BC\\leftrightarrow EF$。',
    },
    {
      id: 'congr-3',
      text: '二等辺三角形で頂角が $40^\\circ$ のとき、$1$ つの底角を求めよう。',
      recall: {
        points: [
          '二等辺三角形の $2$ つの底角は等しい',
          '底角 ＝（$180^\\circ$ − 頂角）÷ $2$',
        ],
        formula: { name: '底角', tex: '\\text{底角}=\\dfrac{180^\\circ-\\text{頂角}}{2}' },
        quiz: {
          q: '$2$ つの底角の関係は？',
          choices: ['等しい', '和が $90^\\circ$', '頂角と等しい'],
          answer: 0,
          why: '二等辺三角形の底角は等しい。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず $180^\\circ$ から頂角を引こう',
            tex: '180-40=\\square',
            blanks: ['140'],
            tiles: ['140', '220', '100', '70'],
          },
          note: '底角 $2$ つ分で $140^\\circ$。',
        },
        {
          fill: {
            ask: '$2$ で割って $1$ つの底角を求めよう',
            tex: '\\dfrac{140}{2}=\\square^\\circ',
            blanks: ['70'],
            tiles: ['70', '140', '35', '110'],
          },
          note: '底角は $70^\\circ$。',
        },
      ],
      answer: '70^\\circ',
      pitfall: '底角は $2$ つあるので（$180$ − 頂角）を $2$ で割る。',
    },
    {
      id: 'congr-4',
      text: '二等辺三角形の $1$ つの底角が $50^\\circ$ のとき、頂角を求めよう。',
      recall: {
        points: [
          '底角は $2$ つとも等しい',
          '頂角 ＝ $180^\\circ$ −（底角 × $2$）',
        ],
        formula: { name: '頂角', tex: '\\text{頂角}=180^\\circ-\\text{底角}\\times 2' },
        quiz: {
          q: '一方の底角が $50^\\circ$。もう $1$ つの底角は？',
          choices: ['$50^\\circ$（等しい）', '$130^\\circ$', '$80^\\circ$'],
          answer: 0,
          why: '底角は等しいので $50^\\circ$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '底角 $2$ つ分を求めよう',
            tex: '50\\times 2=\\square',
            blanks: ['100'],
            tiles: ['100', '50', '130', '25'],
          },
          note: '底角 $2$ つで $100^\\circ$。',
        },
        {
          fill: {
            ask: '$180^\\circ$ から引いて頂角を求めよう',
            tex: '180-100=\\square^\\circ',
            blanks: ['80'],
            tiles: ['80', '100', '130', '50'],
          },
          note: '頂角は $80^\\circ$。',
        },
      ],
      answer: '80^\\circ',
      pitfall: '底角は $2$ つとも等しい。両方足してから $180^\\circ$ から引く。',
    },
    {
      id: 'congr-5',
      text: '平行四辺形 $ABCD$ で $\\angle A=110^\\circ$ のとき、$\\angle B$ を求めよう。',
      recall: {
        points: [
          '平行四辺形：対角は等しい、となり合う角は和が $180^\\circ$',
          '$\\angle A$ と $\\angle B$ はとなり合う角',
        ],
        formula: { name: '平行四辺形の角', tex: '\\text{対角は等しい},\\ \\text{隣り合う角の和}=180^\\circ' },
        quiz: {
          q: '$\\angle A$ と $\\angle C$（対角）の関係は？',
          choices: ['等しい', '和が $180^\\circ$', '直角'],
          answer: 0,
          why: '平行四辺形の対角は等しい。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'となり合う角の和は $180^\\circ$。$\\angle B$ は？',
            tex: '\\angle B=180-110=\\square^\\circ',
            blanks: ['70'],
            tiles: ['70', '110', '90', '250'],
          },
          note: 'となり合う角なので $180-110=70$。',
        },
      ],
      answer: '\\angle B=70^\\circ',
      pitfall: '対角は等しい（$\\angle A=\\angle C$）、となり合う角は和が $180^\\circ$。',
    },
    {
      id: 'congr-6',
      text: '平行四辺形 $ABCD$ で $AB=6,\\ AD=4$。$CD$ と $BC$ の長さを求めよう。',
      recall: {
        points: [
          '平行四辺形：向かい合う辺（対辺）は等しい',
          '$AB=CD,\\ AD=BC$',
        ],
        formula: { name: '対辺', tex: 'AB=CD,\\quad AD=BC' },
        quiz: {
          q: '$AB$ に等しい辺は？',
          choices: ['$CD$', '$AD$', '$AC$'],
          answer: 0,
          why: '対辺 $AB=CD$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$CD$ の長さは？',
            tex: 'CD=AB=\\square',
            blanks: ['6'],
            tiles: ['6', '4', '10', '24'],
          },
          note: '対辺なので $CD=AB=6$。',
        },
        {
          fill: {
            ask: '$BC$ の長さは？',
            tex: 'BC=AD=\\square',
            blanks: ['4'],
            tiles: ['4', '6', '10', '2'],
          },
          note: '対辺なので $BC=AD=4$。',
        },
      ],
      answer: 'CD=6,\\ BC=4',
      pitfall: '対辺どうしが等しい。となり合う辺は等しいとは限らない。',
    },
  ],
  prob: [
    {
      id: 'prob-1',
      text: 'さいころを $1$ 回投げて、$3$ の目が出る確率を求めよう。',
      recall: {
        points: [
          '確率 ＝ あてはまる場合 ÷ 全部の場合',
          'さいころの目は全部で $6$ 通り（同様に確からしい）',
        ],
        formula: { name: '確率', tex: 'P=\\dfrac{\\text{あてはまる場合}}{\\text{全部の場合}}' },
        quiz: {
          q: 'さいころの全部の場合は？',
          choices: ['$6$ 通り', '$3$ 通り', '$1$ 通り'],
          answer: 0,
          why: '$1$〜$6$ の $6$ 通り。',
        },
      },
      steps: [
        {
          fill: {
            ask: '確率を求めよう（$3$ の目は $1$ 通り）',
            tex: 'P=\\dfrac{1}{\\square}',
            blanks: ['6'],
            tiles: ['6', '3', '1', '2'],
          },
          note: 'あてはまる $1$ ÷ 全部 $6$。',
        },
      ],
      answer: '\\dfrac{1}{6}',
      pitfall: '分母は「全部の場合」。あてはまる ÷ 全部 の順。',
    },
    {
      id: 'prob-2',
      text: 'さいころを $1$ 回投げて、偶数の目が出る確率を求めよう。',
      recall: {
        points: [
          '偶数の目は $2,4,6$ の $3$ 通り',
          '求めた確率は約分する',
        ],
        formula: { name: '確率', tex: 'P=\\dfrac{\\text{あてはまる}}{\\text{全部}}' },
        quiz: {
          q: '偶数の目は何通り？',
          choices: ['$3$ 通り', '$2$ 通り', '$6$ 通り'],
          answer: 0,
          why: '$2,4,6$ の $3$ 通り。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{3}{6}$ を約分しよう',
            tex: 'P=\\dfrac{3}{6}=\\square',
            blanks: ['\\tfrac{1}{2}'],
            tiles: ['\\tfrac{1}{2}', '\\tfrac{1}{3}', '\\tfrac{1}{6}', '3'],
          },
          note: '$\\dfrac{3}{6}=\\dfrac{1}{2}$。',
        },
      ],
      answer: '\\dfrac{1}{2}',
      pitfall: '約分を忘れない。$\\dfrac{3}{6}=\\dfrac{1}{2}$。',
    },
    {
      id: 'prob-3',
      text: '$2$ 枚のコインを投げて、$2$ 枚とも表が出る確率を求めよう。',
      recall: {
        points: [
          '樹形図で全部の場合を数える',
          '表・裏で $2\\times2=4$ 通り',
        ],
        formula: { name: '確率', tex: 'P=\\dfrac{\\text{あてはまる}}{\\text{全部}}' },
        quiz: {
          q: '$2$ 枚のコインの出方は全部で？',
          choices: ['$4$ 通り', '$2$ 通り', '$3$ 通り'],
          answer: 0,
          why: '（表表）（表裏）（裏表）（裏裏）の $4$ 通り。',
        },
      },
      steps: [
        {
          fill: {
            ask: '全部の場合を求めよう',
            tex: '2\\times 2=\\square',
            blanks: ['4'],
            tiles: ['4', '2', '3', '6'],
          },
          note: '$2$ 枚で $4$ 通り。',
        },
        {
          fill: {
            ask: '確率を求めよう（$2$ 枚とも表は $1$ 通り）',
            tex: 'P=\\dfrac{1}{\\square}',
            blanks: ['4'],
            tiles: ['4', '2', '3', '1'],
          },
          note: 'あてはまる $1$ ÷ 全部 $4$。',
        },
      ],
      answer: '\\dfrac{1}{4}',
      pitfall: '（表裏）と（裏表）は別の場合。全部で $4$ 通り（$3$ 通りではない）。',
    },
    {
      id: 'prob-4',
      text: '大小 $2$ 個のさいころを投げて、目の和が $7$ になる確率を求めよう。',
      recall: {
        points: [
          '$2$ 個のさいころは $6\\times6=36$ 通り',
          '和が $7$：$(1,6)(2,5)(3,4)(4,3)(5,2)(6,1)$ の $6$ 通り',
        ],
        formula: { name: '確率', tex: 'P=\\dfrac{\\text{あてはまる}}{36}' },
        quiz: {
          q: '$2$ 個のさいころの全部の場合は？',
          choices: ['$36$ 通り', '$12$ 通り', '$6$ 通り'],
          answer: 0,
          why: '$6\\times6=36$ 通り。',
        },
      },
      steps: [
        {
          fill: {
            ask: '和が $7$ になるのは何通り？',
            tex: '\\text{和が7：}\\ \\square\\ \\text{通り}',
            blanks: ['6'],
            tiles: ['6', '5', '7', '11'],
          },
          note: '$(1,6)$ から $(6,1)$ までの $6$ 通り。',
        },
        {
          fill: {
            ask: '確率を求めて約分しよう',
            tex: 'P=\\dfrac{6}{36}=\\square',
            blanks: ['\\tfrac{1}{6}'],
            tiles: ['\\tfrac{1}{6}', '\\tfrac{1}{36}', '\\tfrac{6}{36}', '\\tfrac{1}{12}'],
          },
          note: '$\\dfrac{6}{36}=\\dfrac{1}{6}$。',
        },
      ],
      answer: '\\dfrac{1}{6}',
      pitfall: '（大,小）の順で区別＝$36$ 通り。$(1,6)$ と $(6,1)$ は別の場合。',
    },
    {
      id: 'prob-5',
      text: 'さいころを $1$ 回投げて、$1$ の目が出ない確率を求めよう。',
      recall: {
        points: [
          '「○○でない」＝ 余事象。$1-(\\text{○○の確率})$',
          'すべての確率の合計は $1$',
        ],
        formula: { name: '余事象', tex: 'P(\\text{でない})=1-P(\\text{である})' },
        quiz: {
          q: '「出ない確率」の求め方は？',
          choices: ['$1-$（出る確率）', '出る確率と同じ', '常に $0$'],
          answer: 0,
          why: '余事象は $1$ から引く。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず $1$ の目が出る確率は？',
            tex: 'P(1)=\\dfrac{1}{\\square}',
            blanks: ['6'],
            tiles: ['6', '5', '1', '2'],
          },
          note: '$1$ の目は $\\dfrac{1}{6}$。',
        },
        {
          fill: {
            ask: '$1$ から引いて「出ない確率」を求めよう',
            tex: '1-\\dfrac{1}{6}=\\square',
            blanks: ['\\tfrac{5}{6}'],
            tiles: ['\\tfrac{5}{6}', '\\tfrac{1}{6}', '\\tfrac{6}{5}', '\\tfrac{4}{6}'],
          },
          note: '$1-\\dfrac{1}{6}=\\dfrac{5}{6}$。',
        },
      ],
      answer: '\\dfrac{5}{6}',
      pitfall: '「でない」確率は $1$ から引く。$\\dfrac{1}{6}$ のままにしない。',
    },
    {
      id: 'prob-6',
      text: '赤玉 $3$ 個、白玉 $2$ 個の合計 $5$ 個から $1$ 個取り出すとき、赤玉が出る確率を求めよう。',
      recall: {
        points: [
          '全部の場合 ＝ 玉の総数',
          '赤玉の場合 ＝ 赤玉の個数',
        ],
        formula: { name: '確率', tex: 'P=\\dfrac{\\text{赤玉の数}}{\\text{全部の数}}' },
        quiz: {
          q: '全部の玉は何個？',
          choices: ['$5$ 個', '$3$ 個', '$2$ 個'],
          answer: 0,
          why: '$3+2=5$ 個。',
        },
      },
      steps: [
        {
          fill: {
            ask: '確率を求めよう（赤玉は $3$ 個）',
            tex: 'P=\\dfrac{3}{\\square}',
            blanks: ['5'],
            tiles: ['5', '3', '2', '6'],
          },
          note: '赤 $3$ ÷ 全部 $5$。',
        },
      ],
      answer: '\\dfrac{3}{5}',
      pitfall: '分母は全部の玉（赤 ＋ 白 ＝ $5$）。赤だけにしない。',
    },
  ],
  data2: [
    {
      id: 'data2-1',
      text: 'データ $3, 5, 8, 10, 12, 15, 18$（$7$ 個）の中央値（第 $2$ 四分位数 $Q_2$）を求めよう。',
      recall: {
        points: [
          'まず小さい順に並べる（このデータは並んでいる）',
          '奇数個の中央値は、ちょうど真ん中の値',
        ],
        formula: { name: '中央値', tex: 'Q_2=\\text{真ん中の値}' },
        quiz: {
          q: '$7$ 個のデータの中央値は何番目？',
          choices: ['$4$ 番目', '$3$ 番目', '真ん中 $2$ つの平均'],
          answer: 0,
          why: '$7$ 個なら $4$ 番目が真ん中。',
        },
      },
      steps: [
        {
          fill: {
            ask: '真ん中（$4$ 番目）の値は？',
            tex: '3,\\,5,\\,8,\\,\\square,\\,12,\\,15,\\,18',
            blanks: ['10'],
            tiles: ['10', '8', '12', '9'],
          },
          note: '$4$ 番目は $10$。',
        },
      ],
      answer: 'Q_2=10',
      pitfall: '奇数個は真ん中 $1$ つ。$7$ 個なら $4$ 番目。',
    },
    {
      id: 'data2-2',
      text: 'データ $3, 5, 8, 10, 12, 15, 18$ の第 $1$ 四分位数 $Q_1$ を求めよう。',
      recall: {
        points: [
          '$Q_1$ ＝ 中央値より下のグループの中央値',
          '中央値 $10$ を除いた下半分 $3,5,8$ で考える',
        ],
        formula: { name: '第1四分位数', tex: 'Q_1=\\text{下半分の中央値}' },
        quiz: {
          q: '$Q_1$ は何のグループの中央値？',
          choices: ['中央値より小さい方', 'データ全体', '大きい方'],
          answer: 0,
          why: '下半分（中央値より下）の中央値。',
        },
      },
      steps: [
        {
          fill: {
            ask: '下半分 $3,\\ \\square,\\ 8$ の真ん中は？',
            tex: '3,\\ \\square,\\ 8',
            blanks: ['5'],
            tiles: ['5', '3', '8', '10'],
          },
          note: '下半分 $3,5,8$ の中央は $5$。',
        },
        {
          fill: {
            ask: '$Q_1$ を答えよう',
            tex: 'Q_1=\\square',
            blanks: ['5'],
            tiles: ['5', '3', '8', '6.5'],
          },
          note: '$Q_1=5$。',
        },
      ],
      answer: 'Q_1=5',
      pitfall: '$Q_1$ は下半分の中央値。全体の真ん中ではない。',
    },
    {
      id: 'data2-3',
      text: '同じデータ $3, 5, 8, 10, 12, 15, 18$ の第 $3$ 四分位数 $Q_3$ を求めよう。',
      recall: {
        points: [
          '$Q_3$ ＝ 中央値より上のグループの中央値',
          '上半分 $12,15,18$ で考える',
        ],
        formula: { name: '第3四分位数', tex: 'Q_3=\\text{上半分の中央値}' },
        quiz: {
          q: '$Q_3$ は何のグループの中央値？',
          choices: ['中央値より大きい方', 'データ全体', '小さい方'],
          answer: 0,
          why: '上半分の中央値。',
        },
      },
      steps: [
        {
          fill: {
            ask: '上半分 $12,\\ \\square,\\ 18$ の真ん中は？',
            tex: '12,\\ \\square,\\ 18',
            blanks: ['15'],
            tiles: ['15', '12', '18', '16'],
          },
          note: '上半分 $12,15,18$ の中央は $15$。',
        },
        {
          fill: {
            ask: '$Q_3$ を答えよう',
            tex: 'Q_3=\\square',
            blanks: ['15'],
            tiles: ['15', '12', '18', '16.5'],
          },
          note: '$Q_3=15$。',
        },
      ],
      answer: 'Q_3=15',
      pitfall: '$Q_3$ は上半分の中央値。中央値 $Q_2$ は含めない。',
    },
    {
      id: 'data2-4',
      text: '$Q_1=5,\\ Q_3=15$ のとき、四分位範囲を求めよう。',
      recall: {
        points: [
          '四分位範囲（IQR）＝ $Q_3-Q_1$',
          '箱ひげ図の「箱」の長さにあたる',
        ],
        formula: { name: '四分位範囲', tex: '\\text{IQR}=Q_3-Q_1' },
        quiz: {
          q: '四分位範囲の式は？',
          choices: ['$Q_3-Q_1$', '$Q_3+Q_1$', '最大 − 最小'],
          answer: 0,
          why: '上下の四分位数の差。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$Q_3-Q_1$ を計算しよう',
            tex: '15-5=\\square',
            blanks: ['10'],
            tiles: ['10', '20', '5', '3'],
          },
          note: '四分位範囲は $10$。',
        },
      ],
      answer: '10',
      pitfall: '四分位範囲は $Q_3-Q_1$。範囲（最大 − 最小）とは別物。',
    },
    {
      id: 'data2-5',
      text: 'ある箱ひげ図で 最小値 $2$、$Q_1=6$、中央値 $9$、$Q_3=13$、最大値 $20$。範囲を求めよう。',
      recall: {
        points: [
          '範囲 ＝ 最大値 − 最小値',
          '箱ひげ図ではひげの両端（先）が最大・最小',
        ],
        formula: { name: '範囲', tex: '\\text{範囲}=\\text{最大値}-\\text{最小値}' },
        quiz: {
          q: '範囲は箱ひげ図のどこ？',
          choices: ['ひげの両端（最大 − 最小）', '箱の両端', '中央の線'],
          answer: 0,
          why: 'ひげの先（最大・最小）の差。',
        },
      },
      steps: [
        {
          fill: {
            ask: '最大値 − 最小値 を計算しよう',
            tex: '20-2=\\square',
            blanks: ['18'],
            tiles: ['18', '22', '7', '11'],
          },
          note: '範囲は $18$。',
        },
      ],
      answer: '18',
      pitfall: '範囲はひげの両端（最大 − 最小）。箱の長さ（四分位範囲）と混同しない。',
    },
    {
      id: 'data2-6',
      text: 'A組の四分位範囲は $8$、B組は $4$。どちらが「中央付近のデータの散らばり」が大きい？',
      recall: {
        points: [
          '四分位範囲（IQR）が大きいほど、中央 $50\\%$ の散らばりが大きい',
          '散らばりの比較には IQR を使う',
        ],
        formula: { name: '散らばり', tex: '\\text{IQR 大}\\ \\Rightarrow\\ \\text{散らばり大}' },
        quiz: {
          q: '四分位範囲が大きいと？',
          choices: ['散らばりが大きい', '散らばりが小さい', '関係ない'],
          answer: 0,
          why: 'IQR が大きい＝中央 $50\\%$ が広く散らばる。',
        },
      },
      steps: [
        {
          ask: '散らばりが大きいのはどちら？',
          choices: ['A組（IQR $8$）', 'B組（IQR $4$）', '同じ'],
          answer: 0,
          note: 'IQR が大きい A組 の方が散らばりが大きい。',
        },
      ],
      answer: '\\text{A組}',
      pitfall: '四分位範囲が大きいほど散らばりが大きい。平均が同じでも散らばりは違う。',
    },
  ],
  expand: [
    {
      id: 'expand-1',
      text: '次を展開しよう：$(x+2)(x+5)$',
      recall: {
        points: [
          '$(x+a)(x+b)=x^2+(a+b)x+ab$',
          '$x$ の係数は和 $a+b$、定数は積 $ab$',
        ],
        formula: { name: '乗法公式①', tex: '(x+a)(x+b)=x^2+(a+b)x+ab' },
        quiz: {
          q: '$x$ の係数になるのは？',
          choices: ['和 $a+b$', '積 $ab$', '差 $a-b$'],
          answer: 0,
          why: '真ん中の項の係数は $a+b$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x$ の係数（和）を求めよう',
            tex: 'x^2+(2+5)x=x^2+\\square x',
            blanks: ['7'],
            tiles: ['7', '10', '2', '5'],
          },
          note: '$2+5=7$。',
        },
        {
          fill: {
            ask: '定数項（積）を求めよう',
            tex: '2\\times 5=\\square',
            blanks: ['10'],
            tiles: ['10', '7', '25', '3'],
          },
          note: '$2\\times5=10$。',
        },
        {
          fill: {
            ask: '合わせて答えにしよう',
            tex: '\\square',
            blanks: ['x^2+7x+10'],
            tiles: ['x^2+7x+10', 'x^2+10x+7', 'x^2+7x+7', 'x^2+7'],
          },
          note: '$x^2+7x+10$。',
        },
      ],
      answer: 'x^2+7x+10',
      pitfall: '真ん中は和（$2+5$）、定数は積（$2\\times5$）。逆にしない。',
    },
    {
      id: 'expand-2',
      text: '次を展開しよう：$(x+3)^2$',
      recall: {
        points: [
          '$(x+a)^2=x^2+2ax+a^2$',
          '真ん中は $2a$（$2$ 倍を忘れない）',
        ],
        formula: { name: '乗法公式②', tex: '(x+a)^2=x^2+2ax+a^2' },
        quiz: {
          q: '$(x+3)^2$ の真ん中の項は？',
          choices: ['$6x$（$2\\times3$）', '$3x$', '$9x$'],
          answer: 0,
          why: '$2a=2\\times3=6$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '真ん中の項の係数（$2a$）は？',
            tex: '2\\times 3=\\square',
            blanks: ['6'],
            tiles: ['6', '3', '9', '5'],
          },
          note: '$2\\times3=6$ で $6x$。',
        },
        {
          fill: {
            ask: '最後の項（$a^2$）は？',
            tex: '3^2=\\square',
            blanks: ['9'],
            tiles: ['9', '6', '3', '12'],
          },
          note: '$3^2=9$。',
        },
        {
          fill: {
            ask: '合わせて答えにしよう',
            tex: '\\square',
            blanks: ['x^2+6x+9'],
            tiles: ['x^2+6x+9', 'x^2+3x+9', 'x^2+9', 'x^2+6x+6'],
          },
          note: '$x^2+6x+9$。',
        },
      ],
      answer: 'x^2+6x+9',
      pitfall: '$(x+3)^2\\ne x^2+9$。真ん中の $2ax=6x$ を忘れない。',
    },
    {
      id: 'expand-3',
      text: '次を展開しよう：$(x-4)^2$',
      recall: {
        points: [
          '$(x-a)^2=x^2-2ax+a^2$',
          '真ん中はマイナス、最後の $a^2$ はプラス',
        ],
        formula: { name: '乗法公式③', tex: '(x-a)^2=x^2-2ax+a^2' },
        quiz: {
          q: '$(x-4)^2$ の最後の項の符号は？',
          choices: ['$+16$（$2$ 乗は正）', '$-16$', '$-8$'],
          answer: 0,
          why: '$(-4)^2=+16$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '真ん中の項の係数は？',
            tex: '-2\\times 4=\\square',
            blanks: ['-8'],
            tiles: ['-8', '8', '-4', '16'],
          },
          note: '真ん中は $-8x$。',
        },
        {
          fill: {
            ask: '最後の項（$a^2$）は？',
            tex: '(-4)^2=\\square',
            blanks: ['16'],
            tiles: ['16', '-16', '8', '4'],
          },
          note: '$2$ 乗なので $+16$。',
        },
        {
          fill: {
            ask: '合わせて答えにしよう',
            tex: '\\square',
            blanks: ['x^2-8x+16'],
            tiles: ['x^2-8x+16', 'x^2+8x+16', 'x^2-8x-16', 'x^2-16'],
          },
          note: '$x^2-8x+16$。',
        },
      ],
      answer: 'x^2-8x+16',
      pitfall: '真ん中は $-8x$、最後は $+16$（$2$ 乗は正）。',
    },
    {
      id: 'expand-4',
      text: '次を展開しよう：$(x+6)(x-6)$',
      recall: {
        points: [
          '$(x+a)(x-a)=x^2-a^2$（和と差の積）',
          '真ん中の項が打ち消し合って消える',
        ],
        formula: { name: '乗法公式④', tex: '(x+a)(x-a)=x^2-a^2' },
        quiz: {
          q: '和と差の積の結果は？',
          choices: ['$x^2-a^2$（真ん中が消える）', '$x^2+a^2$', '$x^2-2ax$'],
          answer: 0,
          why: '$+ax$ と $-ax$ が打ち消し合う。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$a^2$ を計算しよう',
            tex: '6^2=\\square',
            blanks: ['36'],
            tiles: ['36', '12', '6', '-36'],
          },
          note: '$6^2=36$。',
        },
        {
          fill: {
            ask: '結果を完成させよう',
            tex: 'x^2-\\square',
            blanks: ['36'],
            tiles: ['36', '12', '6', '36x'],
          },
          note: '$x^2-36$。',
        },
      ],
      answer: 'x^2-36',
      pitfall: '真ん中の項は消える。$x^2-36$（$-12x$ などは出ない）。',
    },
    {
      id: 'expand-5',
      text: '次を展開しよう：$(2x+3)(2x-3)$',
      recall: {
        points: [
          '和と差の積：$(A+B)(A-B)=A^2-B^2$',
          '$A=2x,\\ B=3$ とみる。係数も $2$ 乗する',
        ],
        formula: { name: '和と差の積', tex: '(A+B)(A-B)=A^2-B^2' },
        quiz: {
          q: '$A=2x$ のとき $A^2$ は？',
          choices: ['$4x^2$', '$2x^2$', '$4x$'],
          answer: 0,
          why: '$(2x)^2=4x^2$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$A^2=(2x)^2$ は？',
            tex: '(2x)^2=\\square',
            blanks: ['4x^2'],
            tiles: ['4x^2', '2x^2', '4x', '2x'],
          },
          note: '係数も $2$ 乗。$(2x)^2=4x^2$。',
        },
        {
          fill: {
            ask: '$B^2=3^2$ は？',
            tex: '3^2=\\square',
            blanks: ['9'],
            tiles: ['9', '6', '3', '12'],
          },
          note: '$3^2=9$。',
        },
        {
          fill: {
            ask: '結果を完成させよう',
            tex: '\\square',
            blanks: ['4x^2-9'],
            tiles: ['4x^2-9', '4x^2+9', '2x^2-9', '4x^2-6'],
          },
          note: '$4x^2-9$。',
        },
      ],
      answer: '4x^2-9',
      pitfall: '$(2x)^2=4x^2$（$2x^2$ ではない）。係数も $2$ 乗する。',
    },
    {
      id: 'expand-6',
      text: '次を展開しよう：$(2x-1)(x+4)$',
      recall: {
        points: [
          '公式が使えないときは、各項をすべてかける（分配）',
          '$2x\\cdot x,\\ 2x\\cdot4,\\ -1\\cdot x,\\ -1\\cdot4$ の $4$ つ',
        ],
        formula: { name: '分配（展開）', tex: '(a+b)(c+d)=ac+ad+bc+bd' },
        quiz: {
          q: 'まず何をする？',
          choices: ['各項をすべてかける', '公式④を使う', 'そのまま足す'],
          answer: 0,
          why: 'すべての組をかけて足す。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x^2$ の項を求めよう',
            tex: '2x\\times x=\\square',
            blanks: ['2x^2'],
            tiles: ['2x^2', '2x', 'x^2', '4x'],
          },
          note: '$2x\\times x=2x^2$。',
        },
        {
          fill: {
            ask: '$x$ の項をまとめよう（$8x-x$）',
            tex: '2x\\times 4+(-1)\\times x=8x-x=\\square',
            blanks: ['7x'],
            tiles: ['7x', '9x', '8x', '-7x'],
          },
          note: '$8x-x=7x$。',
        },
        {
          fill: {
            ask: '合わせて答えにしよう（定数は $-1\\times4$）',
            tex: '\\square',
            blanks: ['2x^2+7x-4'],
            tiles: ['2x^2+7x-4', '2x^2-7x-4', '2x^2+7x+4', '2x^2+9x-4'],
          },
          note: '定数は $-1\\times4=-4$。',
        },
      ],
      answer: '2x^2+7x-4',
      pitfall: '$x$ の項は $8x$ と $-x$ を合わせて $7x$。定数は $-1\\times4=-4$。',
    },
  ],
  factor: [
    {
      id: 'factor-1',
      text: '次を因数分解しよう：$6x^2+9x$',
      recall: {
        points: [
          'まず共通因数をさがす（これが最優先）',
          '各項に共通する数・文字でくくる',
        ],
        formula: { name: '共通因数', tex: 'ma+mb=m(a+b)' },
        quiz: {
          q: '$6x^2$ と $9x$ の共通因数は？',
          choices: ['$3x$', '$3$', '$x^2$'],
          answer: 0,
          why: '数 $3$ と文字 $x$ が共通。最大の共通因数は $3x$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$3x$ でくくった中身は？',
            tex: '6x^2+9x=3x(\\square)',
            blanks: ['2x+3'],
            tiles: ['2x+3', '2x+9', 'x+3', '6x+9'],
          },
          note: '$6x^2\\div3x=2x$、$9x\\div3x=3$。',
        },
      ],
      answer: '3x(2x+3)',
      pitfall: '共通因数はできる限り大きくくくる（$3x$ まで）。$3(2x^2+3x)$ で止めない。',
    },
    {
      id: 'factor-2',
      text: '次を因数分解しよう：$x^2+7x+12$',
      recall: {
        points: [
          '$x^2+(a+b)x+ab=(x+a)(x+b)$',
          'たして $7$・かけて $12$ になる $2$ 数をさがす',
        ],
        formula: { name: '因数分解①', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        quiz: {
          q: 'さがすのは？',
          choices: ['たして $7$・かけて $12$ の $2$ 数', 'たして $12$・かけて $7$', '差が $7$'],
          answer: 0,
          why: '和が中央の $7$、積が定数の $12$。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'たして $7$・かけて $12$ の $2$ 数を入れよう',
            tex: 'x^2+7x+12=(x\\square)(x\\square)',
            blanks: ['+3', '+4'],
            tiles: ['+3', '+4', '+2', '+6'],
            unordered: true,
          },
          note: '$3+4=7,\\ 3\\times4=12$。',
        },
      ],
      answer: '(x+3)(x+4)',
      pitfall: 'たして中央・かけて定数。$3+4=7,\\ 3\\times4=12$。',
    },
    {
      id: 'factor-3',
      text: '次を因数分解しよう：$x^2+10x+25$',
      recall: {
        points: [
          '$x^2+2ax+a^2=(x+a)^2$（完全平方）',
          '定数が平方数・真ん中が $2a$ なら完全平方を疑う',
        ],
        formula: { name: '因数分解②', tex: 'x^2+2ax+a^2=(x+a)^2' },
        quiz: {
          q: '$25=5^2$、$10=2\\times5$。これは？',
          choices: ['完全平方 $(x+5)^2$', '$(x+5)(x-5)$', 'ふつうの $2$ 数'],
          answer: 0,
          why: '$2a=10,\\ a^2=25$ で $a=5$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$(x+\\square)^2$ の空所は？',
            tex: 'x^2+10x+25=(x+\\square)^2',
            blanks: ['5'],
            tiles: ['5', '10', '25', '2'],
          },
          note: '$\\sqrt{25}=5$、$2\\times5=10$ で一致。',
        },
      ],
      answer: '(x+5)^2',
      pitfall: '真ん中が $2a$、定数が $a^2$ の関係を確認。$(x+5)^2$。',
    },
    {
      id: 'factor-4',
      text: '次を因数分解しよう：$x^2-49$',
      recall: {
        points: [
          '$x^2-a^2=(x+a)(x-a)$（$2$ 乗の差）',
          '$49=7^2$',
        ],
        formula: { name: '因数分解③', tex: 'x^2-a^2=(x+a)(x-a)' },
        quiz: {
          q: '$x^2-49$ の形は？',
          choices: ['$2$ 乗の差', '完全平方', '共通因数でくくる'],
          answer: 0,
          why: '$49=7^2$。差の形。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$49$ は何の $2$ 乗？',
            tex: '49=\\square^2',
            blanks: ['7'],
            tiles: ['7', '49', '24', '14'],
          },
          note: '$49=7^2$。',
        },
        {
          fill: {
            ask: '和と差の積に分解しよう（符号は？）',
            tex: 'x^2-49=(x+7)(x\\square 7)',
            blanks: ['-'],
            tiles: ['-', '+'],
          },
          note: '$x^2-a^2=(x+a)(x-a)$。',
        },
      ],
      answer: '(x+7)(x-7)',
      pitfall: '$x^2-49=(x+7)(x-7)$。$(x-7)^2$ ではない。',
    },
    {
      id: 'factor-5',
      text: '次を因数分解しよう：$2x^2-18$',
      recall: {
        points: [
          'まず共通因数 $2$ でくくる',
          '残りが $2$ 乗の差なら、さらに分解する',
        ],
        formula: { name: '共通因数 → 公式', tex: '\\text{まず共通因数、次に公式}' },
        quiz: {
          q: '最初にすることは？',
          choices: ['共通因数 $2$ でくくる', 'いきなり公式', 'そのまま'],
          answer: 0,
          why: '共通因数をくくるのが最優先。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2$ でくくった中身は？',
            tex: '2x^2-18=2(x^2-\\square)',
            blanks: ['9'],
            tiles: ['9', '18', '3', '81'],
          },
          note: '$18\\div2=9$。',
        },
        {
          fill: {
            ask: '$x^2-9$ をさらに分解しよう（符号は？）',
            tex: '2(x+3)(x\\square 3)',
            blanks: ['-'],
            tiles: ['-', '+'],
          },
          note: '$x^2-9=(x+3)(x-3)$。',
        },
      ],
      answer: '2(x+3)(x-3)',
      pitfall: '共通因数でくくった後、中身がまだ分解できないか必ず確認する。',
    },
    {
      id: 'factor-6',
      text: '次を因数分解しよう：$x^2-2x-15$',
      recall: {
        points: [
          'たして $-2$・かけて $-15$ の $2$ 数をさがす',
          'かけて負 → 符号が異なる $2$ 数',
        ],
        formula: { name: '因数分解①', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        quiz: {
          q: 'かけて $-15$（負）なら $2$ 数は？',
          choices: ['符号が異なる', 'どちらも正', 'どちらも負'],
          answer: 0,
          why: '積が負＝符号が違う $2$ 数。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'たして $-2$・かけて $-15$ の $2$ 数を入れよう',
            tex: 'x^2-2x-15=(x\\square)(x\\square)',
            blanks: ['+3', '-5'],
            tiles: ['+3', '-5', '-3', '+5'],
            unordered: true,
          },
          note: '$3+(-5)=-2,\\ 3\\times(-5)=-15$。',
        },
      ],
      answer: '(x+3)(x-5)',
      pitfall: 'かけて負なら符号違い。たして $-2$ になるよう大きい方を負に。',
    },
  ],
  sqrt: [
    {
      id: 'sqrt-1',
      text: '次を簡単にしよう：$\\sqrt{12}$',
      recall: {
        points: [
          '$\\sqrt{a^2 b}=a\\sqrt{b}$（平方数を外に出す）',
          '根号の中を「平方数 × 残り」に分ける',
        ],
        formula: { name: '根号の整理', tex: '\\sqrt{a^2 b}=a\\sqrt{b}' },
        quiz: {
          q: '$12$ をどう分ける？',
          choices: ['$4\\times3$', '$6\\times2$', '$2\\times6$'],
          answer: 0,
          why: '平方数 $4$ を取り出せる形に分ける。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\sqrt{4}$ を外に出そう',
            tex: '\\sqrt{12}=\\sqrt{4\\times 3}=\\square\\sqrt{3}',
            blanks: ['2'],
            tiles: ['2', '4', '3', '6'],
          },
          note: '$\\sqrt{4}=2$。',
        },
      ],
      answer: '2\\sqrt{3}',
      pitfall: '平方数（$4$）を見つけて外に出す。$\\sqrt{4}=2$。',
    },
    {
      id: 'sqrt-2',
      text: '次を計算しよう：$\\sqrt{3}\\times\\sqrt{6}$',
      recall: {
        points: [
          '$\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}$',
          '計算後にさらに簡単にできるか確認',
        ],
        formula: { name: '根号の乗法', tex: '\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}' },
        quiz: {
          q: '$\\sqrt{3}\\times\\sqrt{6}$ は？',
          choices: ['$\\sqrt{18}$', '$\\sqrt{9}$', '$\\sqrt{3}$'],
          answer: 0,
          why: '中どうしをかけて $\\sqrt{18}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '中どうしをかけよう',
            tex: '\\sqrt{3}\\times\\sqrt{6}=\\sqrt{\\square}',
            blanks: ['18'],
            tiles: ['18', '9', '3', '6'],
          },
          note: '$3\\times6=18$。',
        },
        {
          fill: {
            ask: '$\\sqrt{18}$ を簡単にしよう',
            tex: '\\sqrt{18}=\\square\\sqrt{2}',
            blanks: ['3'],
            tiles: ['3', '2', '9', '6'],
          },
          note: '$\\sqrt{9\\times2}=3\\sqrt{2}$。',
        },
      ],
      answer: '3\\sqrt{2}',
      pitfall: '計算後に $\\sqrt{18}=3\\sqrt{2}$ まで簡単にする。',
    },
    {
      id: 'sqrt-3',
      text: '次を計算しよう：$\\sqrt{20}\\div\\sqrt{5}$',
      recall: {
        points: [
          '$\\dfrac{\\sqrt{a}}{\\sqrt{b}}=\\sqrt{\\dfrac{a}{b}}$',
          '中どうしを割る',
        ],
        formula: { name: '根号の除法', tex: '\\dfrac{\\sqrt{a}}{\\sqrt{b}}=\\sqrt{\\dfrac{a}{b}}' },
        quiz: {
          q: '$\\sqrt{20}\\div\\sqrt{5}$ は？',
          choices: ['$\\sqrt{4}$', '$\\sqrt{25}$', '$\\sqrt{100}$'],
          answer: 0,
          why: '$20\\div5=4$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '中どうしを割ろう',
            tex: '\\sqrt{20}\\div\\sqrt{5}=\\sqrt{\\square}',
            blanks: ['4'],
            tiles: ['4', '25', '100', '15'],
          },
          note: '$20\\div5=4$。',
        },
        {
          fill: {
            ask: '$\\sqrt{4}$ を計算しよう',
            tex: '\\sqrt{4}=\\square',
            blanks: ['2'],
            tiles: ['2', '4', '16', '8'],
          },
          note: '$\\sqrt{4}=2$。',
        },
      ],
      answer: '2',
      pitfall: '中どうしを割る（$20\\div5=4$）。$\\sqrt{4}=2$。',
    },
    {
      id: 'sqrt-4',
      text: '次を計算しよう：$2\\sqrt{3}+5\\sqrt{3}$',
      recall: {
        points: [
          '根号が同じ（同類）どうしは、係数を足す',
          '$\\sqrt{3}$ を文字のように扱う',
        ],
        formula: { name: '根号の加減', tex: 'a\\sqrt{c}+b\\sqrt{c}=(a+b)\\sqrt{c}' },
        quiz: {
          q: '$2\\sqrt{3}+5\\sqrt{3}$ は？',
          choices: ['$7\\sqrt{3}$（係数を足す）', '$7\\sqrt{6}$', '$10\\sqrt{3}$'],
          answer: 0,
          why: '同類なので係数 $2+5=7$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '係数を足そう',
            tex: '2\\sqrt{3}+5\\sqrt{3}=\\square\\sqrt{3}',
            blanks: ['7'],
            tiles: ['7', '10', '3', '35'],
          },
          note: '$2+5=7$。',
        },
      ],
      answer: '7\\sqrt{3}',
      pitfall: '根号の中は足さない。$\\sqrt{3}+\\sqrt{3}=2\\sqrt{3}$（$\\sqrt{6}$ ではない）。',
    },
    {
      id: 'sqrt-5',
      text: '次を有理化しよう：$\\dfrac{6}{\\sqrt{3}}$',
      recall: {
        points: [
          '有理化 ＝ 分母の根号をなくすこと',
          '分母と同じ根号を、分母と分子の両方にかける',
        ],
        formula: { name: '有理化', tex: '\\dfrac{a}{\\sqrt{b}}=\\dfrac{a\\sqrt{b}}{b}' },
        quiz: {
          q: '何を上下にかける？',
          choices: ['$\\sqrt{3}$', '$3$', '$6$'],
          answer: 0,
          why: '分母の $\\sqrt{3}$ をかけると分母が有理数に。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\sqrt{3}$ を上下にかけた分母は？',
            tex: '\\dfrac{6}{\\sqrt{3}}=\\dfrac{6\\sqrt{3}}{\\square}',
            blanks: ['3'],
            tiles: ['3', '9', '6', '\\sqrt{3}'],
          },
          note: '$\\sqrt{3}\\times\\sqrt{3}=3$。',
        },
        {
          fill: {
            ask: '約分しよう',
            tex: '\\dfrac{6\\sqrt{3}}{3}=\\square\\sqrt{3}',
            blanks: ['2'],
            tiles: ['2', '6', '3', '18'],
          },
          note: '$6\\div3=2$。',
        },
      ],
      answer: '2\\sqrt{3}',
      pitfall: '分母の $\\sqrt{3}$ を上下にかける（$\\sqrt{3}\\times\\sqrt{3}=3$）。最後に約分。',
    },
    {
      id: 'sqrt-6',
      text: '次を計算しよう：$(\\sqrt{5}+2)(\\sqrt{5}-2)$',
      recall: {
        points: [
          '和と差の積：$(A+B)(A-B)=A^2-B^2$',
          '$(\\sqrt{5})^2=5$（$2$ 乗で根号が外れる）',
        ],
        formula: { name: '和と差の積', tex: '(A+B)(A-B)=A^2-B^2' },
        quiz: {
          q: '$(\\sqrt{5})^2$ は？',
          choices: ['$5$', '$\\sqrt{5}$', '$25$'],
          answer: 0,
          why: '$2$ 乗すると根号が外れて $5$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$A^2=(\\sqrt{5})^2$ は？',
            tex: '(\\sqrt{5})^2=\\square',
            blanks: ['5'],
            tiles: ['5', '25', '\\sqrt{5}', '10'],
          },
          note: '$(\\sqrt{5})^2=5$。',
        },
        {
          fill: {
            ask: '$B^2=2^2$ は？',
            tex: '2^2=\\square',
            blanks: ['4'],
            tiles: ['4', '2', '8', '16'],
          },
          note: '$2^2=4$。',
        },
        {
          fill: {
            ask: '$A^2-B^2$ を計算しよう',
            tex: '5-4=\\square',
            blanks: ['1'],
            tiles: ['1', '9', '3', '-1'],
          },
          note: '$5-4=1$。',
        },
      ],
      answer: '1',
      pitfall: '$(\\sqrt{5})^2=5$（根号が外れる）。$A^2-B^2=5-4=1$。',
    },
  ],
  qfn0: [
    {
      id: 'qfn0-1',
      text: '$y=ax^2$ で、$x=2$ のとき $y=12$ である。$a$ を求めよう。',
      recall: {
        points: [
          '$y=ax^2$ に $x,y$ の値を代入する',
          '$a=\\dfrac{y}{x^2}$（$x^2$ で割る）',
        ],
        formula: { name: 'y=ax^2', tex: 'y=ax^2' },
        quiz: {
          q: '$a$ の求め方は？',
          choices: ['$y\\div x^2$', '$y\\div x$', '$y\\times x^2$'],
          answer: 0,
          why: '代入して $a=\\dfrac{y}{x^2}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず $x^2$ を計算しよう',
            tex: '12=a\\times 2^2=a\\times\\square',
            blanks: ['4'],
            tiles: ['4', '2', '8', '12'],
          },
          note: '$2^2=4$。',
        },
        {
          fill: {
            ask: '$a$ を求めよう',
            tex: 'a=\\dfrac{12}{4}=\\square',
            blanks: ['3'],
            tiles: ['3', '4', '12', '48'],
          },
          note: '$12\\div4=3$。',
        },
      ],
      answer: 'a=3',
      pitfall: '代入するのは $x^2$（$2^2=4$）。$x=2$ をそのまま使わない。',
    },
    {
      id: 'qfn0-2',
      text: '$y=2x^2$ で、$x=-3$ のときの $y$ を求めよう。',
      recall: {
        points: [
          '$x$ を代入する。$x^2$ は必ず正',
          '$(-3)^2=9$',
        ],
        formula: { name: 'y=2x^2', tex: 'y=2x^2' },
        quiz: {
          q: '$(-3)^2$ は？',
          choices: ['$9$', '$-9$', '$6$'],
          answer: 0,
          why: '$2$ 乗は正で $9$。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず $x^2$ を計算しよう',
            tex: '(-3)^2=\\square',
            blanks: ['9'],
            tiles: ['9', '-9', '6', '-6'],
          },
          note: '$(-3)^2=9$。',
        },
        {
          fill: {
            ask: '$2$ をかけよう',
            tex: 'y=2\\times 9=\\square',
            blanks: ['18'],
            tiles: ['18', '-18', '11', '36'],
          },
          note: '$y=18$。',
        },
      ],
      answer: 'y=18',
      pitfall: '$x^2$ は正。$y=2x^2$ は $x$ が負でも $y$ は正。',
    },
    {
      id: 'qfn0-3',
      text: '$y=x^2$ で、$x$ が $1$ から $3$ まで変わるときの変化の割合を求めよう。',
      recall: {
        points: [
          '変化の割合 ＝ $\\dfrac{y\\,\\text{の増加量}}{x\\,\\text{の増加量}}$',
          '$y=x^2$ の変化の割合は区間によって変わる（一定でない）',
        ],
        formula: { name: '変化の割合', tex: '\\dfrac{y\\,\\text{の増加量}}{x\\,\\text{の増加量}}' },
        quiz: {
          q: '変化の割合の式は？',
          choices: ['$\\dfrac{y\\,\\text{の増加量}}{x\\,\\text{の増加量}}$', 'いつも一定の傾き', '$a$ の値'],
          answer: 0,
          why: '縦の変化 ÷ 横の変化。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x=3$ のときの $y$ は？',
            tex: 'x=1\\to y=1,\\quad x=3\\to y=\\square',
            blanks: ['9'],
            tiles: ['9', '3', '6', '1'],
          },
          note: '$3^2=9$。',
        },
        {
          fill: {
            ask: '変化の割合を求めよう',
            tex: '\\dfrac{9-1}{3-1}=\\dfrac{8}{2}=\\square',
            blanks: ['4'],
            tiles: ['4', '8', '2', '3'],
          },
          note: '$\\dfrac{8}{2}=4$。',
        },
      ],
      answer: '4',
      pitfall: '$y=x^2$ の変化の割合は区間で変わる（一次関数のように一定ではない）。',
    },
    {
      id: 'qfn0-4',
      text: '$y=x^2$ で、$x$ の変域が $-1\\le x\\le 2$ のとき、$y$ の変域を求めよう。',
      recall: {
        points: [
          '放物線 $y=x^2$ は $x=0$ で最小（$y=0$）',
          '変域に $0$ を含むと最小は $0$、最大は端の大きい方',
        ],
        formula: { name: 'y=x^2 の変域', tex: '\\text{最小は頂点、最大は端}' },
        quiz: {
          q: '$x=0$ を含むとき $y$ の最小値は？',
          choices: ['$0$', '端の値', '負の数'],
          answer: 0,
          why: '頂点（原点）が最小で $y=0$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '端の大きい方 $x=2$ での $y$ は？',
            tex: 'x=2\\to y=\\square',
            blanks: ['4'],
            tiles: ['4', '2', '1', '-4'],
          },
          note: '$2^2=4$。$x=-1$ では $1$ なので最大は $4$。',
        },
        {
          fill: {
            ask: '$y$ の変域を完成させよう',
            tex: '0\\le y\\le\\square',
            blanks: ['4'],
            tiles: ['4', '2', '1', '9'],
          },
          note: '最小 $0$、最大 $4$。',
        },
      ],
      answer: '0\\le y\\le 4',
      pitfall: '$x$ の変域に $0$ を含むと最小は $0$。端の値だけで決めない。',
    },
    {
      id: 'qfn0-5',
      text: '$y=ax^2$ のグラフ（放物線）で、$a<0$ のときの形を考えよう。',
      recall: {
        points: [
          '$a>0$ なら上に開く（谷）、$a<0$ なら下に開く（山）',
          '原点が頂点で、$y$ 軸について対称',
        ],
        formula: { name: '放物線', tex: 'a>0:\\text{上に開く},\\quad a<0:\\text{下に開く}' },
        quiz: {
          q: '$a<0$ の放物線は？',
          choices: ['下に開く（上に凸）', '上に開く', '直線'],
          answer: 0,
          why: '$a<0$ で下向き。',
        },
      },
      steps: [
        {
          ask: '$a<0$ のとき、頂点（原点）は？',
          choices: ['最大値をとる', '最小値をとる', '関係ない'],
          answer: 0,
          note: '下に開くので原点が一番高い＝最大値。',
        },
      ],
      answer: '\\text{下に開く（頂点が最大）}',
      pitfall: '$a$ の符号で開く向きが決まる。$a<0$ は下向き（頂点が最大）。',
    },
    {
      id: 'qfn0-6',
      text: '$y=x^2$ と $y=x+2$ の交点の $x$ 座標を求めよう。',
      recall: {
        points: [
          '交点は連立 ＝ $x^2=x+2$',
          '移項して二次方程式にして解く',
        ],
        formula: { name: '交点', tex: 'x^2=x+2' },
        quiz: {
          q: '交点を求めるには？',
          choices: ['$x^2=x+2$ を解く', '傾きを比べる', '代入するだけ'],
          answer: 0,
          why: '両式を等しいとおいて解く。',
        },
      },
      steps: [
        {
          fill: {
            ask: '移項して因数分解しよう',
            tex: 'x^2-x-2=0\\ \\Rightarrow\\ (x-2)(x\\square)=0',
            blanks: ['+1'],
            tiles: ['+1', '-1', '+2', '-2'],
          },
          note: 'たして $-1$・かけて $-2$ は $-2,1$。$(x-2)(x+1)$。',
        },
        {
          fill: {
            ask: '解（正の方）を入れよう',
            tex: 'x=\\square,\\ -1',
            blanks: ['2'],
            tiles: ['2', '-2', '1', '-1'],
          },
          note: '$x=2$ と $x=-1$。',
        },
      ],
      answer: 'x=2,\\ -1',
      pitfall: '交点は連立。$x^2=x+2$ を移項して因数分解する。',
    },
  ],
  simil: [
    {
      id: 'simil-1',
      text: '$\\triangle ABC\\sim\\triangle DEF$ で相似比が $2:3$。$AB=4$ のとき $DE$ を求めよう。',
      recall: {
        points: [
          '相似な図形は対応する辺の比が一定（＝相似比）',
          '$AB:DE=2:3$ から比例式で求める',
        ],
        formula: { name: '相似比', tex: 'AB:DE=2:3' },
        quiz: {
          q: '相似な図形の対応する辺の比は？',
          choices: ['一定（相似比に等しい）', 'バラバラ', '常に $1:1$'],
          answer: 0,
          why: '相似なら対応する辺の比は一定。',
        },
      },
      steps: [
        {
          fill: {
            ask: '比例式から $DE$ を求めよう',
            tex: '4:DE=2:3\\ \\Rightarrow\\ DE=\\dfrac{4\\times 3}{2}=\\square',
            blanks: ['6'],
            tiles: ['6', '12', '8', '2'],
          },
          note: '内項の積＝外項の積。$DE=6$。',
        },
      ],
      answer: 'DE=6',
      pitfall: '比例式は「内項の積＝外項の積」。$DE=\\dfrac{4\\times3}{2}$。',
    },
    {
      id: 'simil-2',
      text: '$2$ つの三角形で「$3$ 組の辺の比がすべて等しい」とき、相似といえる？',
      recall: {
        points: [
          '三角形の相似条件は $3$ つ',
          '①3組の辺の比 ②2組の辺の比とその間の角 ③2組の角',
        ],
        formula: { name: '相似条件', tex: '\\text{3辺比／2辺比と夾角／2角}' },
        quiz: {
          q: '相似条件にあるのは？',
          choices: ['3組の辺の比が等しい', '3組の辺が等しい（合同）', '面積が等しい'],
          answer: 0,
          why: '辺の「比」が等しければ相似。',
        },
      },
      steps: [
        {
          ask: '「$2$ 組の角がそれぞれ等しい」とき相似といえる？',
          choices: ['相似といえる', 'いえない', '合同になる'],
          answer: 0,
          note: '$2$ 角が等しければ残りの角も等しく、相似条件③にあたる。',
        },
      ],
      answer: '\\text{相似といえる（3組の辺の比）}',
      pitfall: '合同は「辺が等しい」、相似は「辺の比が等しい」。区別する。',
    },
    {
      id: 'simil-3',
      text: '$\\triangle ABC$ で $DE\\parallel BC$。$AD=2,\\ DB=3,\\ AE=4$ のとき $EC$ を求めよう。',
      recall: {
        points: [
          '$DE\\parallel BC$ なら $AD:DB=AE:EC$',
          '平行線で分けられた線分の比は等しい',
        ],
        formula: { name: '平行線と比', tex: 'AD:DB=AE:EC' },
        quiz: {
          q: '$DE\\parallel BC$ のとき成り立つのは？',
          choices: ['$AD:DB=AE:EC$', '$AD=AE$', '$DB=EC$'],
          answer: 0,
          why: '平行なので比が等しい。',
        },
      },
      steps: [
        {
          fill: {
            ask: '比例式から $EC$ を求めよう',
            tex: '2:3=4:EC\\ \\Rightarrow\\ EC=\\dfrac{3\\times 4}{2}=\\square',
            blanks: ['6'],
            tiles: ['6', '8', '12', '5'],
          },
          note: '$EC=6$。',
        },
      ],
      answer: 'EC=6',
      pitfall: '対応をそろえる：$AD:DB=AE:EC$。上下を逆にしない。',
    },
    {
      id: 'simil-4',
      text: '$\\triangle ABC$ で $M,N$ が辺 $AB,AC$ の中点。$BC=10$ のとき $MN$ を求めよう。',
      recall: {
        points: [
          '中点連結定理：$MN\\parallel BC$ かつ $MN=\\dfrac{1}{2}BC$',
          '$2$ 辺の中点を結ぶと、底辺の半分の長さ',
        ],
        formula: { name: '中点連結定理', tex: 'MN=\\dfrac{1}{2}BC' },
        quiz: {
          q: '中点を結んだ線分は底辺の？',
          choices: ['半分', '同じ', '$2$ 倍'],
          answer: 0,
          why: '$MN=\\dfrac{1}{2}BC$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$MN$ を求めよう',
            tex: 'MN=\\dfrac{1}{2}\\times 10=\\square',
            blanks: ['5'],
            tiles: ['5', '10', '20', '2'],
          },
          note: '$\\dfrac{1}{2}\\times10=5$。',
        },
      ],
      answer: 'MN=5',
      pitfall: '中点連結は「半分」。$BC$ と同じ長さにしない。',
    },
    {
      id: 'simil-5',
      text: '相似比が $2:3$ の $2$ つの図形の面積比を求めよう。',
      recall: {
        points: [
          '相似比 $m:n$ → 面積比 $m^2:n^2$',
          '長さの比を $2$ 乗する',
        ],
        formula: { name: '面積比', tex: 'm:n\\ \\Rightarrow\\ m^2:n^2' },
        quiz: {
          q: '面積比は相似比をどうする？',
          choices: ['$2$ 乗する', 'そのまま', '$3$ 乗する'],
          answer: 0,
          why: '面積は長さの $2$ 乗で変わる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '相似比を $2$ 乗しよう',
            tex: '2^2:3^2=\\square:9',
            blanks: ['4'],
            tiles: ['4', '2', '6', '8'],
          },
          note: '$2^2=4,\\ 3^2=9$。',
        },
      ],
      answer: '4:9',
      pitfall: '面積比は相似比の $2$ 乗（$4:9$）。$2:3$ のままにしない。',
    },
    {
      id: 'simil-6',
      text: '相似比が $2:3$ の $2$ つの立体の体積比を求めよう。',
      recall: {
        points: [
          '相似比 $m:n$ → 体積比 $m^3:n^3$',
          '長さの比を $3$ 乗する',
        ],
        formula: { name: '体積比', tex: 'm:n\\ \\Rightarrow\\ m^3:n^3' },
        quiz: {
          q: '体積比は相似比をどうする？',
          choices: ['$3$ 乗する', '$2$ 乗する', 'そのまま'],
          answer: 0,
          why: '体積は長さの $3$ 乗で変わる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '相似比を $3$ 乗しよう',
            tex: '2^3:3^3=\\square:27',
            blanks: ['8'],
            tiles: ['8', '6', '4', '9'],
          },
          note: '$2^3=8,\\ 3^3=27$。',
        },
      ],
      answer: '8:27',
      pitfall: '体積比は相似比の $3$ 乗（$8:27$）。面積比（$2$ 乗）と混同しない。',
    },
  ],
  circ: [
    {
      id: 'circ-1',
      text: '弧 AB に対する中心角が $80^\\circ$ のとき、同じ弧の円周角を求めよう。',
      recall: {
        points: [
          '円周角 ＝ 中心角の半分',
          '$\\text{円周角}=\\dfrac{1}{2}\\times\\text{中心角}$',
        ],
        formula: { name: '円周角の定理', tex: '\\text{円周角}=\\dfrac{1}{2}\\times\\text{中心角}' },
        quiz: {
          q: '円周角と中心角の関係は？',
          choices: ['円周角 ＝ 中心角の半分', '等しい', '円周角が $2$ 倍'],
          answer: 0,
          why: '同じ弧では円周角は中心角の半分。',
        },
      },
      steps: [
        {
          fill: {
            ask: '中心角の半分を求めよう',
            tex: '\\dfrac{1}{2}\\times 80=\\square^\\circ',
            blanks: ['40'],
            tiles: ['40', '160', '80', '20'],
          },
          note: '$80\\div2=40$。',
        },
      ],
      answer: '40^\\circ',
      pitfall: '円周角は中心角の「半分」。$2$ 倍にしない。',
    },
    {
      id: 'circ-2',
      text: '弧 AB に対する円周角が $35^\\circ$ のとき、中心角を求めよう。',
      recall: {
        points: [
          '中心角 ＝ 円周角の $2$ 倍',
          '円周角の定理の逆向き',
        ],
        formula: { name: '円周角の定理', tex: '\\text{中心角}=2\\times\\text{円周角}' },
        quiz: {
          q: '中心角は円周角の？',
          choices: ['$2$ 倍', '半分', '同じ'],
          answer: 0,
          why: '中心角 ＝ 円周角 × $2$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '円周角の $2$ 倍を求めよう',
            tex: '2\\times 35=\\square^\\circ',
            blanks: ['70'],
            tiles: ['70', '17.5', '35', '140'],
          },
          note: '$35\\times2=70$。',
        },
      ],
      answer: '70^\\circ',
      pitfall: '中心角は円周角の $2$ 倍。半分にしない。',
    },
    {
      id: 'circ-3',
      text: '同じ弧 AB に対する円周角の $1$ つが $50^\\circ$ のとき、別の点から見た円周角は？',
      recall: {
        points: [
          '同じ弧に対する円周角はすべて等しい',
          '点が違っても、弧が同じなら円周角は等しい',
        ],
        formula: { name: '円周角', tex: '\\text{同じ弧 → 円周角は等しい}' },
        quiz: {
          q: '同じ弧に対する円周角は？',
          choices: ['すべて等しい', '点ごとに変わる', '和が $180^\\circ$'],
          answer: 0,
          why: '弧が同じなら円周角は等しい。',
        },
      },
      steps: [
        {
          fill: {
            ask: '別の点から見た円周角は？',
            tex: '\\text{別の円周角}=\\square^\\circ',
            blanks: ['50'],
            tiles: ['50', '100', '25', '130'],
          },
          note: '同じ弧なので $50^\\circ$ のまま。',
        },
      ],
      answer: '50^\\circ',
      pitfall: '同じ弧なら円周角は等しい（点が違っても変わらない）。',
    },
    {
      id: 'circ-4',
      text: '線分 AB が円の直径のとき、円周上の点 P での角 $\\angle APB$ を求めよう。',
      recall: {
        points: [
          '直径に対する円周角は $90^\\circ$',
          '半円の弧の中心角は $180^\\circ$、その半分',
        ],
        formula: { name: '直径と円周角', tex: '\\text{直径の円周角}=90^\\circ' },
        quiz: {
          q: '直径に対する円周角は？',
          choices: ['$90^\\circ$', '$180^\\circ$', '$45^\\circ$'],
          answer: 0,
          why: '中心角 $180^\\circ$ の半分。',
        },
      },
      steps: [
        {
          fill: {
            ask: '中心角 $180^\\circ$ の半分を求めよう',
            tex: '\\dfrac{1}{2}\\times 180=\\square^\\circ',
            blanks: ['90'],
            tiles: ['90', '180', '45', '360'],
          },
          note: '直径の円周角は $90^\\circ$（直角）。',
        },
      ],
      answer: '90^\\circ',
      pitfall: '直径（半円）に対する円周角は必ず $90^\\circ$。',
    },
    {
      id: 'circ-5',
      text: '円に内接する四角形 ABCD で $\\angle A=85^\\circ$ のとき、向かい合う $\\angle C$ を求めよう。',
      recall: {
        points: [
          '円に内接する四角形は、向かい合う角の和が $180^\\circ$',
          '$\\angle A+\\angle C=180^\\circ$',
        ],
        formula: { name: '内接四角形', tex: '\\angle A+\\angle C=180^\\circ' },
        quiz: {
          q: '内接四角形の向かい合う角の和は？',
          choices: ['$180^\\circ$', '$90^\\circ$', '$360^\\circ$'],
          answer: 0,
          why: '対角の和は $180^\\circ$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$180^\\circ$ から $\\angle A$ を引こう',
            tex: '\\angle C=180-85=\\square^\\circ',
            blanks: ['95'],
            tiles: ['95', '85', '90', '265'],
          },
          note: '$\\angle C=95^\\circ$。',
        },
      ],
      answer: '\\angle C=95^\\circ',
      pitfall: '内接四角形は「向かい合う角」の和が $180^\\circ$（となりの角ではない）。',
    },
    {
      id: 'circ-6',
      text: '円周上の $3$ 点でできる三角形で、$\\angle A=30^\\circ,\\ \\angle B=70^\\circ$（ともに円周角）。$\\angle C$ を求めよう。',
      recall: {
        points: [
          '円周角も三角形の内角の $1$ つ',
          '三角形の内角の和は $180^\\circ$',
        ],
        formula: { name: '内角の和', tex: '\\angle A+\\angle B+\\angle C=180^\\circ' },
        quiz: {
          q: '$\\angle C$ の求め方は？',
          choices: ['$180-(\\angle A+\\angle B)$', '円周角 × $2$', '直径だから $90^\\circ$'],
          answer: 0,
          why: '三角形の内角の和を使う。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず $2$ 角の和を求めよう',
            tex: '30+70=\\square',
            blanks: ['100'],
            tiles: ['100', '110', '40', '90'],
          },
          note: '$2$ 角で $100^\\circ$。',
        },
        {
          fill: {
            ask: '$180^\\circ$ から引こう',
            tex: '180-100=\\square^\\circ',
            blanks: ['80'],
            tiles: ['80', '100', '60', '280'],
          },
          note: '$\\angle C=80^\\circ$。',
        },
      ],
      answer: '\\angle C=80^\\circ',
      pitfall: '円周角も三角形の内角。内角の和 $180^\\circ$ を使える。',
    },
  ],
  tri: [
    {
      id: 'tri-1',
      text: '直角三角形で、直角をはさむ $2$ 辺が $3$ と $4$ のとき、斜辺の長さを求めよう。',
      recall: {
        points: [
          '三平方の定理：$a^2+b^2=c^2$（$c$ は斜辺）',
          '斜辺は直角の向かい側で、一番長い辺',
        ],
        formula: { name: '三平方の定理', tex: 'a^2+b^2=c^2' },
        quiz: {
          q: '斜辺はどこ？',
          choices: ['直角の向かい側', '一番短い辺', '直角をはさむ辺'],
          answer: 0,
          why: '斜辺＝直角の対辺で最長。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2$ 辺の $2$ 乗の和を求めよう',
            tex: '3^2+4^2=9+16=\\square',
            blanks: ['25'],
            tiles: ['25', '7', '12', '49'],
          },
          note: '$9+16=25$。',
        },
        {
          fill: {
            ask: '平方根をとって斜辺を求めよう',
            tex: 'c=\\sqrt{25}=\\square',
            blanks: ['5'],
            tiles: ['5', '25', '625', '10'],
          },
          note: '$\\sqrt{25}=5$。',
        },
      ],
      answer: 'c=5',
      pitfall: '$c^2=25$ の後、$\\sqrt{\\ }$ を忘れず $c=5$ にする。',
    },
    {
      id: 'tri-2',
      text: '直角三角形で、斜辺が $13$、他の $1$ 辺が $5$ のとき、残りの辺を求めよう。',
      recall: {
        points: [
          '$a^2+b^2=c^2$ を移項：$b^2=c^2-a^2$',
          '斜辺がわかっているときは「引く」',
        ],
        formula: { name: '三平方の定理', tex: 'b^2=c^2-a^2' },
        quiz: {
          q: '残りの辺を求めるには？',
          choices: ['斜辺² − 他辺²', '斜辺² ＋ 他辺²', '斜辺 − 他辺'],
          answer: 0,
          why: '斜辺の $2$ 乗から引く。',
        },
      },
      steps: [
        {
          fill: {
            ask: '斜辺² − 他辺² を計算しよう',
            tex: '13^2-5^2=169-25=\\square',
            blanks: ['144'],
            tiles: ['144', '194', '24', '169'],
          },
          note: '$169-25=144$。',
        },
        {
          fill: {
            ask: '平方根をとろう',
            tex: 'b=\\sqrt{144}=\\square',
            blanks: ['12'],
            tiles: ['12', '144', '24', '11'],
          },
          note: '$\\sqrt{144}=12$。',
        },
      ],
      answer: 'b=12',
      pitfall: '斜辺がわかっているときは「引く」（$c^2-a^2$）。足さない。',
    },
    {
      id: 'tri-3',
      text: '直角二等辺三角形（$45^\\circ,45^\\circ,90^\\circ$）で、等しい $2$ 辺が $2$ のとき、斜辺を求めよう。',
      recall: {
        points: [
          '$45^\\circ:45^\\circ:90^\\circ$ の辺の比は $1:1:\\sqrt{2}$',
          '斜辺 ＝ $1$ 辺 $\\times\\sqrt{2}$',
        ],
        formula: { name: '直角二等辺', tex: '1:1:\\sqrt{2}' },
        quiz: {
          q: '$1:1:\\sqrt{2}$ で斜辺は？',
          choices: ['$\\sqrt{2}$ の位置', '$1$ の位置', '一番短い辺'],
          answer: 0,
          why: '斜辺は比 $\\sqrt{2}$ にあたる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '斜辺を求めよう',
            tex: '\\text{斜辺}=2\\times\\sqrt{2}=\\square',
            blanks: ['2\\sqrt{2}'],
            tiles: ['2\\sqrt{2}', '\\sqrt{2}', '4', '2'],
          },
          note: '$1$ 辺の $\\sqrt{2}$ 倍。',
        },
      ],
      answer: '2\\sqrt{2}',
      pitfall: '比 $1:1:\\sqrt{2}$。斜辺は $1$ 辺の $\\sqrt{2}$ 倍。',
    },
    {
      id: 'tri-4',
      text: '$30^\\circ,60^\\circ,90^\\circ$ の直角三角形で、最短辺（$30^\\circ$ の対辺）が $3$ のとき、斜辺を求めよう。',
      recall: {
        points: [
          '$30^\\circ:60^\\circ:90^\\circ$ の辺の比は $1:\\sqrt{3}:2$',
          '斜辺は最短辺の $2$ 倍',
        ],
        formula: { name: '30-60-90', tex: '1:\\sqrt{3}:2' },
        quiz: {
          q: '$1:\\sqrt{3}:2$ で斜辺は？',
          choices: ['$2$ の位置', '$1$ の位置', '$\\sqrt{3}$ の位置'],
          answer: 0,
          why: '斜辺は比 $2$、最短辺の $2$ 倍。',
        },
      },
      steps: [
        {
          fill: {
            ask: '斜辺を求めよう',
            tex: '\\text{斜辺}=3\\times 2=\\square',
            blanks: ['6'],
            tiles: ['6', '3', '9', '\\sqrt{3}'],
          },
          note: '最短辺 $3$ の $2$ 倍。',
        },
      ],
      answer: '6',
      pitfall: '比 $1:\\sqrt{3}:2$。斜辺は最短辺の $2$ 倍、$\\sqrt{3}$ 倍は中間の辺。',
    },
    {
      id: 'tri-5',
      text: '$2$ 点 $A(1,2)$、$B(4,6)$ の間の距離を求めよう。',
      recall: {
        points: [
          '横の差・縦の差を直角の $2$ 辺とみる',
          '距離 $=\\sqrt{(\\Delta x)^2+(\\Delta y)^2}$',
        ],
        formula: { name: '2点間の距離', tex: '\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}' },
        quiz: {
          q: '距離の求め方は？',
          choices: ['横の差と縦の差で三平方', '差を足すだけ', '差をかける'],
          answer: 0,
          why: '差を $2$ 辺とする直角三角形をつくる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '横の差² ＋ 縦の差² を求めよう',
            tex: '(4-1)^2+(6-2)^2=9+16=\\square',
            blanks: ['25'],
            tiles: ['25', '7', '49', '5'],
          },
          note: '$3^2+4^2=25$。',
        },
        {
          fill: {
            ask: '平方根をとろう',
            tex: '\\sqrt{25}=\\square',
            blanks: ['5'],
            tiles: ['5', '25', '10', '625'],
          },
          note: '距離は $5$。',
        },
      ],
      answer: '5',
      pitfall: '横の差² ＋ 縦の差² の平方根。差をそのまま足さない。',
    },
    {
      id: 'tri-6',
      text: 'たて $6$、横 $8$ の長方形の対角線の長さを求めよう。',
      recall: {
        points: [
          '対角線は長方形を $2$ つの直角三角形に分ける',
          '対角線² ＝ たて² ＋ 横²',
        ],
        formula: { name: '長方形の対角線', tex: 'd^2=\\text{たて}^2+\\text{横}^2' },
        quiz: {
          q: '対角線の求め方は？',
          choices: ['たて² ＋ 横² の平方根', 'たて ＋ 横', 'たて × 横'],
          answer: 0,
          why: '直角三角形で三平方の定理。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'たて² ＋ 横² を求めよう',
            tex: '6^2+8^2=36+64=\\square',
            blanks: ['100'],
            tiles: ['100', '14', '48', '10'],
          },
          note: '$36+64=100$。',
        },
        {
          fill: {
            ask: '平方根をとろう',
            tex: 'd=\\sqrt{100}=\\square',
            blanks: ['10'],
            tiles: ['10', '100', '50', '14'],
          },
          note: '対角線は $10$。',
        },
      ],
      answer: 'd=10',
      pitfall: '対角線は たて² ＋ 横² の平方根。$6+8=14$ としない。',
    },
  ],
  sample: [
    {
      id: 'sample-1',
      text: '「電球の寿命検査」は全数調査・標本調査のどちら？',
      recall: {
        points: [
          '全部を調べる＝全数調査、一部を調べて推定＝標本調査',
          'こわす検査・対象が多すぎる → 標本調査',
        ],
        formula: { name: '調査の種類', tex: '\\text{全数調査／標本調査}' },
        quiz: {
          q: '電球の寿命検査は？',
          choices: ['標本調査（こわれるため一部）', '全数調査', 'どちらも不可'],
          answer: 0,
          why: '全部こわすと売れないので、一部を調べる標本調査。',
        },
      },
      steps: [
        {
          ask: '「国勢調査（全国民を対象）」はどちら？',
          choices: ['全数調査', '標本調査', 'どちらでもない'],
          answer: 0,
          note: '全員を対象にするので全数調査。',
        },
      ],
      answer: '\\text{標本調査}',
      pitfall: 'こわす検査・数が多すぎる → 標本調査。全員必須 → 全数調査。',
    },
    {
      id: 'sample-2',
      text: 'ある中学の生徒 $600$ 人から $50$ 人を選んでアンケートをとる。母集団と標本の大きさは？',
      recall: {
        points: [
          '母集団 ＝ 調べたい全体',
          '標本 ＝ そこから取り出した一部',
        ],
        formula: { name: '母集団と標本', tex: '\\text{母集団}\\supset\\text{標本}' },
        quiz: {
          q: '母集団はどれ？',
          choices: ['$600$ 人（全体）', '$50$ 人（選んだ人）', 'アンケート'],
          answer: 0,
          why: '調べたい全体が母集団。',
        },
      },
      steps: [
        {
          fill: {
            ask: '母集団の大きさは？',
            tex: '\\text{母集団}=\\square\\ \\text{人}',
            blanks: ['600'],
            tiles: ['600', '50', '650', '12'],
          },
          note: '全体の $600$ 人。',
        },
        {
          fill: {
            ask: '標本の大きさは？',
            tex: '\\text{標本}=\\square\\ \\text{人}',
            blanks: ['50'],
            tiles: ['50', '600', '550', '25'],
          },
          note: '選んだ $50$ 人。',
        },
      ],
      answer: '\\text{母集団}\\ 600,\\ \\text{標本}\\ 50',
      pitfall: '母集団＝全体（$600$）、標本＝選んだ一部（$50$）。逆にしない。',
    },
    {
      id: 'sample-3',
      text: '製品 $500$ 個から $40$ 個を調べたら不良品が $2$ 個。$500$ 個中の不良品はおよそ何個と推定できる？',
      recall: {
        points: [
          '標本の比率 ＝ 母集団の比率 と考える',
          '$\\dfrac{\\text{不良}}{\\text{標本}}=\\dfrac{\\text{推定不良}}{\\text{全体}}$',
        ],
        formula: { name: '比率の推定', tex: '\\dfrac{2}{40}=\\dfrac{x}{500}' },
        quiz: {
          q: '推定の考え方は？',
          choices: ['標本の比率を全体にあてはめる', '標本数を足す', '関係ない'],
          answer: 0,
          why: '標本と母集団で比率が同じと考える。',
        },
      },
      steps: [
        {
          fill: {
            ask: '標本の不良率を約分しよう',
            tex: '\\dfrac{2}{40}=\\dfrac{1}{\\square}',
            blanks: ['20'],
            tiles: ['20', '40', '2', '10'],
          },
          note: '$\\dfrac{2}{40}=\\dfrac{1}{20}$。',
        },
        {
          fill: {
            ask: '全体 $500$ にかけて推定しよう',
            tex: '500\\times\\dfrac{1}{20}=\\square\\ \\text{個}',
            blanks: ['25'],
            tiles: ['25', '20', '50', '2'],
          },
          note: '$500\\div20=25$。',
        },
      ],
      answer: '\\text{約}\\ 25\\ \\text{個}',
      pitfall: '標本の不良率（$\\dfrac{1}{20}$）を全体 $500$ にかける。',
    },
    {
      id: 'sample-4',
      text: '池の魚を $30$ 匹つかまえ印をつけて戻す。後日 $40$ 匹つかまえたら印つきが $5$ 匹。池の魚はおよそ何匹？',
      recall: {
        points: [
          '印つきの割合が、池全体でも同じと考える',
          '$\\dfrac{\\text{印つき}}{\\text{全体}}=\\dfrac{\\text{再捕の印つき}}{\\text{再捕数}}$',
        ],
        formula: { name: '標識再捕獲法', tex: '\\dfrac{30}{x}=\\dfrac{5}{40}' },
        quiz: {
          q: '何を等しいとおく？',
          choices: ['印つきの割合', '魚の重さ', '池の広さ'],
          answer: 0,
          why: '印つきの割合が全体でも同じと考える。',
        },
      },
      steps: [
        {
          fill: {
            ask: '比例式を立てよう（内項の積＝外項の積）',
            tex: '\\dfrac{30}{x}=\\dfrac{5}{40}\\ \\Rightarrow\\ x=\\dfrac{30\\times 40}{\\square}',
            blanks: ['5'],
            tiles: ['5', '40', '30', '8'],
          },
          note: '$x=\\dfrac{30\\times40}{5}$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: 'x=\\dfrac{1200}{5}=\\square\\ \\text{匹}',
            blanks: ['240'],
            tiles: ['240', '120', '60', '1200'],
          },
          note: '$1200\\div5=240$。',
        },
      ],
      answer: '\\text{約}\\ 240\\ \\text{匹}',
      pitfall: '印つきの割合が全体でも同じ、と考えて比例式を立てる。',
    },
    {
      id: 'sample-5',
      text: '袋の玉から無作為に $20$ 個を取り出したら、重さの平均が $15$ g だった。母集団（全部）の平均はおよそ？',
      recall: {
        points: [
          '標本平均は母集団平均の推定値になる',
          '無作為に選べば、標本平均で全体を推定できる',
        ],
        formula: { name: '標本平均', tex: '\\text{母平均}\\approx\\text{標本平均}' },
        quiz: {
          q: '母集団の平均はおよそ？',
          choices: ['標本平均と同じくらい', '標本平均の $2$ 倍', 'まったくわからない'],
          answer: 0,
          why: '標本平均で母集団平均を推定する。',
        },
      },
      steps: [
        {
          fill: {
            ask: '母集団の平均をおよそで答えよう',
            tex: '\\text{母平均}\\approx\\square\\ \\text{g}',
            blanks: ['15'],
            tiles: ['15', '30', '20', '7.5'],
          },
          note: '標本平均 $15$ g で推定。',
        },
      ],
      answer: '\\text{約}\\ 15\\ \\text{g}',
      pitfall: '標本平均（$15$ g）をそのまま母集団の推定値とする。',
    },
    {
      id: 'sample-6',
      text: '標本を選ぶときに大切な「無作為抽出」とは？',
      recall: {
        points: [
          'かたよりなく、どの個体も同じ確率で選ぶこと',
          'くじ引きや乱数を使って選ぶ',
        ],
        formula: { name: '無作為抽出', tex: '\\text{かたよりなく選ぶ}' },
        quiz: {
          q: '無作為抽出とは？',
          choices: ['かたよりなく等確率で選ぶ', '背の高い順に選ぶ', '好きなものを選ぶ'],
          answer: 0,
          why: 'かたよりがあると正しく推定できない。',
        },
      },
      steps: [
        {
          ask: 'かたよった標本だと、推定は？',
          choices: ['正しくなくなる', 'より正確になる', '変わらない'],
          answer: 0,
          note: 'かたよりは推定を狂わせる。だから無作為に選ぶ。',
        },
      ],
      answer: '\\text{かたよりなく等確率で選ぶ}',
      pitfall: 'かたよった選び方（背の順など）はダメ。乱数・くじで無作為に選ぶ。',
    },
  ],
  realexpr: [
    {
      id: 'realexpr-1',
      text: '次を展開しよう：$(a+b+c)^2$',
      recall: {
        points: [
          '$(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)$',
          '各項の $2$ 乗 ＋ 異なる $2$ 項の積の $2$ 倍',
        ],
        formula: { name: '3項の平方', tex: '(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)' },
        quiz: {
          q: '異なる $2$ 項の積（$ab$ など）は何倍？',
          choices: ['$2$ 倍', '$1$ 倍', '$3$ 倍'],
          answer: 0,
          why: '各組の積が $2$ 回ずつ出るので $2$ 倍。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$3$ つめの積の項を入れよう',
            tex: 'a^2+b^2+c^2+2(ab+bc+\\square)',
            blanks: ['ca'],
            tiles: ['ca', 'ab', 'bc', 'abc'],
          },
          note: '積は $ab,\\ bc,\\ ca$ の $3$ 組。',
        },
      ],
      answer: 'a^2+b^2+c^2+2ab+2bc+2ca',
      pitfall: '積の項（$ab,bc,ca$）はそれぞれ $2$ 倍。$ca$ を忘れやすい。',
    },
    {
      id: 'realexpr-2',
      text: '次を因数分解しよう：$3x^2+7x+2$',
      recall: {
        points: [
          '$ax^2+bx+c$（$a\\ne1$）はたすき掛け',
          '内側・外側の積の和が中央の項になるよう分ける',
        ],
        formula: { name: 'たすき掛け', tex: 'acx^2+(ad+bc)x+bd=(ax+b)(cx+d)' },
        quiz: {
          q: '$3x^2$ をどう分ける？',
          choices: ['$3x\\times x$', '$x\\times x$', '$3\\times x$'],
          answer: 0,
          why: '係数 $3=3\\times1$ なので $3x$ と $x$。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'たすき掛けで分解しよう',
            tex: '3x^2+7x+2=(3x+\\square)(x+2)',
            blanks: ['+1'],
            tiles: ['+1', '+2', '+3', '+6'],
          },
          note: '$(3x+1)(x+2)$：$3x\\cdot2+1\\cdot x=7x$ で一致。',
        },
      ],
      answer: '(3x+1)(x+2)',
      pitfall: 'たすき掛けは「内側 ＋ 外側の積」が中央（$7x$）になるか必ず確認。',
    },
    {
      id: 'realexpr-3',
      text: '$|-3|+|2-5|$ を計算しよう。',
      recall: {
        points: [
          '絶対値は原点からの距離（必ず $0$ 以上）',
          '中に式があるときは、先に中を計算する',
        ],
        formula: { name: '絶対値', tex: '|a|=\\begin{cases}a&(a\\ge0)\\\\ -a&(a<0)\\end{cases}' },
        quiz: {
          q: '$|-3|$ は？',
          choices: ['$3$', '$-3$', '$0$'],
          answer: 0,
          why: '距離なので正の $3$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$|2-5|$ を計算しよう（中を先に）',
            tex: '|2-5|=|-3|=\\square',
            blanks: ['3'],
            tiles: ['3', '-3', '7', '1'],
          },
          note: '$2-5=-3$、絶対値で $3$。',
        },
        {
          fill: {
            ask: '$|-3|+|2-5|$ を求めよう',
            tex: '3+3=\\square',
            blanks: ['6'],
            tiles: ['6', '0', '9', '-6'],
          },
          note: '$3+3=6$。',
        },
      ],
      answer: '6',
      pitfall: '$|2-5|$ は中を先に計算（$=|-3|=3$）。負号を外して正にする。',
    },
    {
      id: 'realexpr-4',
      text: '方程式 $|x|=4$ を解こう。',
      recall: {
        points: [
          '$|x|=a$（$a>0$）の解は $x=\\pm a$',
          '原点からの距離が $a$ の点は $2$ つ',
        ],
        formula: { name: '絶対値方程式', tex: '|x|=a\\ \\Rightarrow\\ x=\\pm a' },
        quiz: {
          q: '$|x|=4$ の解の個数は？',
          choices: ['$2$ 個', '$1$ 個', '$0$ 個'],
          answer: 0,
          why: '$+4$ と $-4$ の $2$ つ。',
        },
      },
      steps: [
        {
          fill: {
            ask: '解を入れよう',
            tex: 'x=\\pm\\square',
            blanks: ['4'],
            tiles: ['4', '16', '2', '8'],
          },
          note: '$x=4$ と $x=-4$。',
        },
      ],
      answer: 'x=\\pm 4',
      pitfall: '$|x|=a$ は $x=\\pm a$。プラス側だけにしない。',
    },
    {
      id: 'realexpr-5',
      text: '$x+y=5,\\ xy=6$ のとき $x^2+y^2$ を求めよう。',
      recall: {
        points: [
          '$x^2+y^2=(x+y)^2-2xy$',
          '和 $x+y$ と積 $xy$ から対称式を計算する',
        ],
        formula: { name: '対称式', tex: 'x^2+y^2=(x+y)^2-2xy' },
        quiz: {
          q: '$x^2+y^2$ を和と積で表すと？',
          choices: ['$(x+y)^2-2xy$', '$(x+y)^2$', '$(x+y)^2+2xy$'],
          answer: 0,
          why: '$(x+y)^2=x^2+2xy+y^2$ から $2xy$ を引く。',
        },
      },
      steps: [
        {
          fill: {
            ask: '値を代入しよう（$2xy$ の部分）',
            tex: '(x+y)^2-2xy=5^2-2\\times 6=25-\\square',
            blanks: ['12'],
            tiles: ['12', '6', '24', '2'],
          },
          note: '$2\\times6=12$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '25-12=\\square',
            blanks: ['13'],
            tiles: ['13', '37', '11', '1'],
          },
          note: '$25-12=13$。',
        },
      ],
      answer: '13',
      pitfall: '$x^2+y^2\\ne(x+y)^2$。必ず $-2xy$ を引く。',
    },
    {
      id: 'realexpr-6',
      text: '$\\dfrac{1}{\\sqrt{3}-1}$ を有理化しよう。',
      recall: {
        points: [
          '分母が $\\sqrt{a}-b$ の形 → 共役 $\\sqrt{a}+b$ を上下にかける',
          '$(\\sqrt{3}-1)(\\sqrt{3}+1)=3-1$（和と差の積）',
        ],
        formula: { name: '共役で有理化', tex: '\\dfrac{1}{\\sqrt{a}-b}\\times\\dfrac{\\sqrt{a}+b}{\\sqrt{a}+b}' },
        quiz: {
          q: '上下に何をかける？',
          choices: ['$\\sqrt{3}+1$（共役）', '$\\sqrt{3}-1$', '$\\sqrt{3}$'],
          answer: 0,
          why: '共役をかけると分母が和と差の積で有理数になる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '分母（和と差の積）を計算しよう',
            tex: '(\\sqrt{3}-1)(\\sqrt{3}+1)=3-1=\\square',
            blanks: ['2'],
            tiles: ['2', '4', '3', '\\sqrt{3}'],
          },
          note: '$(\\sqrt{3})^2-1^2=3-1=2$。',
        },
        {
          fill: {
            ask: '結果を完成させよう',
            tex: '\\dfrac{\\sqrt{3}+1}{\\square}',
            blanks: ['2'],
            tiles: ['2', '1', '3', '4'],
          },
          note: '分子は $\\sqrt{3}+1$、分母は $2$。',
        },
      ],
      answer: '\\dfrac{\\sqrt{3}+1}{2}',
      pitfall: '分母には共役（符号違い）をかける。$\\sqrt{3}-1$ をかけない。',
    },
  ],
  setlogic: [
    {
      id: 'setlogic-1',
      text: '$A=\\{1,2,3,4\\}$、$B=\\{3,4,5\\}$ のとき、共通部分 $A\\cap B$ を求めよう。',
      recall: {
        points: [
          '$A\\cap B$ ＝ 両方に共通する要素',
          '$A\\cup B$ ＝ どちらかに入る要素すべて',
        ],
        formula: { name: '集合', tex: 'A\\cap B:\\text{共通},\\quad A\\cup B:\\text{合併}' },
        quiz: {
          q: '$A\\cap B$ は？',
          choices: ['両方に共通する要素', 'どちらかに入る要素', '$A$ だけの要素'],
          answer: 0,
          why: '$\\cap$ は共通部分。',
        },
      },
      steps: [
        {
          fill: {
            ask: '共通する要素を入れよう',
            tex: 'A\\cap B=\\{\\square\\}',
            blanks: ['3,4'],
            tiles: ['3,4', '1,2', '5', '1,2,3,4,5'],
          },
          note: '両方にあるのは $3,4$。',
        },
      ],
      answer: 'A\\cap B=\\{3,4\\}',
      pitfall: '$\\cap$（共通）と $\\cup$（合併）を取り違えない。',
    },
    {
      id: 'setlogic-2',
      text: '全体集合 $U$ の要素数が $30$、$A$ の要素数が $12$ のとき、補集合 $\\overline{A}$ の要素数は？',
      recall: {
        points: [
          '補集合 ＝ 全体から $A$ を除いたもの',
          '$n(\\overline{A})=n(U)-n(A)$',
        ],
        formula: { name: '補集合', tex: 'n(\\overline{A})=n(U)-n(A)' },
        quiz: {
          q: '補集合の要素数は？',
          choices: ['全体 − $A$', '全体 ＋ $A$', '$A$ と同じ'],
          answer: 0,
          why: '全体から $A$ を引く。',
        },
      },
      steps: [
        {
          fill: {
            ask: '全体 − $A$ を計算しよう',
            tex: '30-12=\\square',
            blanks: ['18'],
            tiles: ['18', '42', '12', '30'],
          },
          note: '$30-12=18$。',
        },
      ],
      answer: 'n(\\overline{A})=18',
      pitfall: '補集合は全体から引く（$30-12$）。足さない。',
    },
    {
      id: 'setlogic-3',
      text: '$n(A)=10,\\ n(B)=8,\\ n(A\\cap B)=3$ のとき $n(A\\cup B)$ を求めよう。',
      recall: {
        points: [
          '$n(A\\cup B)=n(A)+n(B)-n(A\\cap B)$',
          '共通部分を $2$ 回数えているので $1$ 回引く',
        ],
        formula: { name: '和集合の要素数', tex: 'n(A\\cup B)=n(A)+n(B)-n(A\\cap B)' },
        quiz: {
          q: 'なぜ $n(A\\cap B)$ を引く？',
          choices: ['共通部分を $2$ 回数えたから', '足りないから', '関係ない'],
          answer: 0,
          why: '$A$ と $B$ で共通部分を重複して数えている。',
        },
      },
      steps: [
        {
          fill: {
            ask: '公式に代入しよう',
            tex: '10+8-3=\\square',
            blanks: ['15'],
            tiles: ['15', '21', '18', '5'],
          },
          note: '$18-3=15$。',
        },
      ],
      answer: 'n(A\\cup B)=15',
      pitfall: '共通部分を引き忘れると $2$ 重に数えてしまう。',
    },
    {
      id: 'setlogic-4',
      text: '「$x=2$」は「$x^2=4$」であるための何条件？',
      recall: {
        points: [
          '$p\\Rightarrow q$ が真なら $p$ は十分条件、$q$ は必要条件',
          '$p\\Rightarrow q$ だけ真なら $p$ は「十分条件（必要でない）」',
        ],
        formula: { name: '必要十分', tex: 'p\\Rightarrow q:\\ p\\text{は十分},\\ q\\text{は必要}' },
        quiz: {
          q: '$x=2\\Rightarrow x^2=4$ は？',
          choices: ['真', '偽', 'どちらでもない'],
          answer: 0,
          why: '$2$ 乗すれば $4$。真。',
        },
      },
      steps: [
        {
          ask: '逆「$x^2=4\\Rightarrow x=2$」は真？偽？',
          choices: ['偽（$x=-2$ もある）', '真', '不明'],
          answer: 0,
          note: '$x=-2$ でも $x^2=4$。逆は偽。',
        },
        {
          ask: 'よって「$x=2$」は「$x^2=4$」の？',
          choices: ['十分条件（必要でない）', '必要条件', '必要十分条件'],
          answer: 0,
          note: '$p\\Rightarrow q$ のみ真 ＝ 十分条件。',
        },
      ],
      answer: '\\text{十分条件}',
      pitfall: '$p\\Rightarrow q$ が真で逆が偽 → $p$ は「十分条件（必要でない）」。',
    },
    {
      id: 'setlogic-5',
      text: '命題「$x>0$ ならば $x>1$」の真偽を、反例を考えて判定しよう。',
      recall: {
        points: [
          '$1$ つでも成り立たない例（反例）があれば偽',
          '反例 ＝ 仮定は満たすが結論は満たさない例',
        ],
        formula: { name: '反例', tex: '\\text{反例が1つあれば偽}' },
        quiz: {
          q: '反例にできるのは？',
          choices: ['$x=0.5$（$0<x<1$）', '$x=2$', '$x=-1$'],
          answer: 0,
          why: '$x=0.5$ は $x>0$ だが $x>1$ でない。',
        },
      },
      steps: [
        {
          ask: 'この命題の真偽は？',
          choices: ['偽（反例 $x=0.5$ がある）', '真', '決まらない'],
          answer: 0,
          note: '$x=0.5$ が反例なので偽。',
        },
      ],
      answer: '\\text{偽（反例あり）}',
      pitfall: '反例は「仮定 OK・結論 NG」の例。$1$ つで偽が確定する。',
    },
    {
      id: 'setlogic-6',
      text: '命題「$x=1$ ならば $x^2=1$」の対偶を作ろう。',
      recall: {
        points: [
          '対偶：「$\\overline{q}$ ならば $\\overline{p}$」（両方を否定して入れ替え）',
          '元の命題と対偶の真偽は一致する',
        ],
        formula: { name: '対偶', tex: 'p\\Rightarrow q\\ \\text{の対偶}:\\ \\overline{q}\\Rightarrow\\overline{p}' },
        quiz: {
          q: '対偶の作り方は？',
          choices: ['否定して入れ替え', 'そのまま入れ替え（逆）', '否定だけ（裏）'],
          answer: 0,
          why: '対偶 ＝ 逆かつ裏（否定して入れ替え）。',
        },
      },
      steps: [
        {
          ask: '対偶はどれ？',
          choices: [
            '$x^2\\ne1$ ならば $x\\ne1$',
            '$x^2=1$ ならば $x=1$',
            '$x\\ne1$ ならば $x^2\\ne1$',
          ],
          answer: 0,
          note: '結論を否定 → 仮定を否定、そして入れ替える。',
        },
      ],
      answer: 'x^2\\ne1\\ \\Rightarrow\\ x\\ne1',
      pitfall: '対偶は「否定して入れ替え」。逆（入れ替えだけ）・裏（否定だけ）と区別する。',
    },
  ],
  qfn: [
    {
      id: 'qfn-1',
      text: '$y=x^2-6x+5$ を平方完成しよう。',
      recall: {
        points: [
          '$x^2+bx$ は $\\left(x+\\dfrac{b}{2}\\right)^2-\\left(\\dfrac{b}{2}\\right)^2$',
          '$x$ の係数の半分を $2$ 乗して、足して引く',
        ],
        formula: { name: '平方完成', tex: 'x^2+bx=\\left(x+\\tfrac{b}{2}\\right)^2-\\left(\\tfrac{b}{2}\\right)^2' },
        quiz: {
          q: '$-6$ の半分は？',
          choices: ['$-3$', '$-6$', '$3$'],
          answer: 0,
          why: '$x$ の係数 $-6$ の半分は $-3$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$-9+5$ の符号は？（$(x-3)^2-9+5$）',
            tex: 'x^2-6x+5=(x-3)^2-9+5=(x-3)^2\\square 4',
            blanks: ['-'],
            tiles: ['-', '+'],
          },
          note: '$-9+5=-4$。',
        },
      ],
      answer: 'y=(x-3)^2-4',
      pitfall: '足した $\\left(\\dfrac{b}{2}\\right)^2$（$9$）を引き忘れない。',
    },
    {
      id: 'qfn-2',
      text: '$y=(x-3)^2-4$ の頂点の座標を求めよう。',
      recall: {
        points: [
          '$y=(x-p)^2+q$ の頂点は $(p,\\ q)$',
          'カッコの中が $0$ になる $x$ が頂点の $x$ 座標',
        ],
        formula: { name: '頂点', tex: 'y=(x-p)^2+q\\ \\Rightarrow\\ \\text{頂点}(p,q)' },
        quiz: {
          q: '$(x-3)^2$ の頂点の $x$ 座標は？',
          choices: ['$3$', '$-3$', '$0$'],
          answer: 0,
          why: '$x-3=0$ より $x=3$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '頂点の $y$ 座標を入れよう',
            tex: '\\text{頂点}=(3,\\ \\square)',
            blanks: ['-4'],
            tiles: ['-4', '4', '3', '-3'],
          },
          note: '$q=-4$。',
        },
      ],
      answer: '(3,\\ -4)',
      pitfall: '$(x-3)^2$ の頂点 $x$ は $+3$（符号反転）。$y$ は $q=-4$。',
    },
    {
      id: 'qfn-3',
      text: '$y=(x-3)^2-4$ の最小値を求めよう（下に凸）。',
      recall: {
        points: [
          '下に凸（$a>0$）は頂点で最小になる',
          '最小値 ＝ 頂点の $y$ 座標',
        ],
        formula: { name: '最小値', tex: '\\text{下に凸 → 頂点で最小}' },
        quiz: {
          q: '最小値はどこ？',
          choices: ['頂点の $y$ 座標', '頂点の $x$ 座標', '$x=0$ のとき'],
          answer: 0,
          why: '頂点で最小、その $y$ 座標が最小値。',
        },
      },
      steps: [
        {
          fill: {
            ask: '最小値を入れよう',
            tex: '\\text{最小値}=\\square',
            blanks: ['-4'],
            tiles: ['-4', '3', '4', '0'],
          },
          note: '$x=3$ のとき最小値 $-4$。',
        },
      ],
      answer: '\\text{最小値}\\ -4\\ (x=3)',
      pitfall: '最小「値」は $y$ 座標（$-4$）。$x$ 座標（$3$）と混同しない。',
    },
    {
      id: 'qfn-4',
      text: '$y=x^2$ を $x$ 方向に $2$、$y$ 方向に $3$ 平行移動した式を求めよう。',
      recall: {
        points: [
          '$x$ 方向に $p$ → $x$ を $x-p$ に置きかえる',
          '$y$ 方向に $q$ → $+q$ を加える',
        ],
        formula: { name: '平行移動', tex: 'y=(x-p)^2+q' },
        quiz: {
          q: '$x$ 方向に $+2$ は？',
          choices: ['$x-2$ に置きかえ', '$x+2$ に置きかえ', '$y-2$'],
          answer: 0,
          why: '$x$ 方向の移動は符号が逆になる。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'カッコの中の数を入れよう',
            tex: 'y=(x-\\square)^2+3',
            blanks: ['2'],
            tiles: ['2', '-2', '3', '-3'],
          },
          note: '$x$ 方向 $+2$ → $x-2$。',
        },
      ],
      answer: 'y=(x-2)^2+3',
      pitfall: '$x$ 方向の移動は符号が逆（$+2$ なら $x-2$）。$y$ 方向はそのまま。',
    },
    {
      id: 'qfn-5',
      text: '$y=x^2-4x+5$ のグラフと $x$ 軸の共有点の個数を、判別式で調べよう。',
      recall: {
        points: [
          '判別式 $D=b^2-4ac$',
          '$D>0$：$2$ 個、$D=0$：$1$ 個、$D<0$：$0$ 個',
        ],
        formula: { name: '判別式', tex: 'D=b^2-4ac' },
        quiz: {
          q: '共有点の個数は何で決まる？',
          choices: ['判別式 $D$ の符号', '$a$ の符号', '頂点の $x$'],
          answer: 0,
          why: '$D$ の符号で $2,1,0$ 個。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$4ac$ の部分を計算しよう',
            tex: 'D=(-4)^2-4\\times 1\\times 5=16-\\square',
            blanks: ['20'],
            tiles: ['20', '5', '16', '4'],
          },
          note: '$4\\times1\\times5=20$。',
        },
        {
          fill: {
            ask: '$D$ を計算しよう',
            tex: 'D=16-20=\\square',
            blanks: ['-4'],
            tiles: ['-4', '4', '36', '0'],
          },
          note: '$D=-4<0$。',
        },
        {
          ask: '共有点の個数は？',
          choices: ['$0$ 個（$D<0$）', '$1$ 個', '$2$ 個'],
          answer: 0,
          note: '$D<0$ なので $x$ 軸と交わらない。',
        },
      ],
      answer: '\\text{0 個（}D<0\\text{）}',
      pitfall: '$D<0$ は共有点なし。$D$ の符号で個数を判断する。',
    },
    {
      id: 'qfn-6',
      text: '$y=x^2-5x+6$ のグラフと $x$ 軸との交点の $x$ 座標を求めよう。',
      recall: {
        points: [
          '$x$ 軸との交点は $y=0$ ＝ 二次方程式の解',
          '因数分解して解く',
        ],
        formula: { name: 'x軸との交点', tex: 'y=0\\ \\Rightarrow\\ x^2-5x+6=0' },
        quiz: {
          q: '交点を求めるには？',
          choices: ['$y=0$ とおいて解く', '頂点を求める', '$x=0$ を代入'],
          answer: 0,
          why: '$x$ 軸上は $y=0$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '因数分解しよう',
            tex: 'x^2-5x+6=(x-2)(x\\square)=0',
            blanks: ['-3'],
            tiles: ['-3', '+3', '-2', '+2'],
          },
          note: 'たして $-5$・かけて $6$ は $-2,-3$。',
        },
        {
          fill: {
            ask: 'もう一方の解を入れよう',
            tex: 'x=2,\\ \\square',
            blanks: ['3'],
            tiles: ['3', '-3', '2', '6'],
          },
          note: '$x=2$ と $x=3$。',
        },
      ],
      answer: 'x=2,\\ 3',
      pitfall: '$x$ 軸との交点は $y=0$ とおく。頂点と混同しない。',
    },
  ],
  trig: [
    {
      id: 'trig-1',
      text: '直角三角形で、斜辺 $5$、$\\theta$ の対辺 $3$、隣辺 $4$ のとき $\\sin\\theta$ を求めよう。',
      recall: {
        points: [
          '$\\sin\\theta=\\dfrac{\\text{対辺}}{\\text{斜辺}}$',
          'sin＝対辺/斜辺、cos＝隣辺/斜辺、tan＝対辺/隣辺',
        ],
        formula: { name: '三角比', tex: '\\sin\\theta=\\dfrac{\\text{対辺}}{\\text{斜辺}}' },
        quiz: {
          q: '$\\sin\\theta$ は？',
          choices: ['対辺 / 斜辺', '隣辺 / 斜辺', '対辺 / 隣辺'],
          answer: 0,
          why: 'sin ＝ 対辺 ÷ 斜辺。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\sin\\theta$ の分母（斜辺）を入れよう',
            tex: '\\sin\\theta=\\dfrac{3}{\\square}',
            blanks: ['5'],
            tiles: ['5', '4', '3', '25'],
          },
          note: '対辺 $3$ ÷ 斜辺 $5$。',
        },
      ],
      answer: '\\sin\\theta=\\dfrac{3}{5}',
      pitfall: 'sin は対辺 / 斜辺。隣辺（cos）と取り違えない。',
    },
    {
      id: 'trig-2',
      text: '$\\sin 30^\\circ$ の値を求めよう。',
      recall: {
        points: [
          '$30^\\circ:60^\\circ:90^\\circ$ の辺の比は $1:\\sqrt{3}:2$',
          '$\\sin30^\\circ=\\dfrac{1}{2}$',
        ],
        formula: { name: '特別角', tex: '\\sin30^\\circ=\\tfrac{1}{2},\\ \\cos30^\\circ=\\tfrac{\\sqrt{3}}{2}' },
        quiz: {
          q: '$\\sin30^\\circ$ は？',
          choices: ['$\\dfrac{1}{2}$', '$\\dfrac{\\sqrt{3}}{2}$', '$1$'],
          answer: 0,
          why: '対辺 $1$ / 斜辺 $2$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\sin30^\\circ$ の分母を入れよう',
            tex: '\\sin30^\\circ=\\dfrac{1}{\\square}',
            blanks: ['2'],
            tiles: ['2', '\\sqrt{3}', '1', '\\sqrt{2}'],
          },
          note: '$\\sin30^\\circ=\\dfrac{1}{2}$。',
        },
      ],
      answer: '\\dfrac{1}{2}',
      pitfall: '$\\sin30^\\circ=\\dfrac{1}{2}$、$\\cos30^\\circ=\\dfrac{\\sqrt{3}}{2}$。混同に注意。',
    },
    {
      id: 'trig-3',
      text: '$\\sin\\theta=\\dfrac{3}{5}$（$\\theta$ は鋭角）のとき $\\cos\\theta$ を求めよう。',
      recall: {
        points: [
          '$\\sin^2\\theta+\\cos^2\\theta=1$',
          '鋭角なら $\\cos\\theta=\\sqrt{1-\\sin^2\\theta}$（正）',
        ],
        formula: { name: '相互関係', tex: '\\sin^2\\theta+\\cos^2\\theta=1' },
        quiz: {
          q: '相互関係の式は？',
          choices: ['$\\sin^2\\theta+\\cos^2\\theta=1$', '$\\sin\\theta+\\cos\\theta=1$', '$\\sin\\theta\\cos\\theta=1$'],
          answer: 0,
          why: '$2$ 乗の和が $1$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\cos^2\\theta=1-\\dfrac{9}{25}$ の分子は？',
            tex: '\\cos^2\\theta=1-\\tfrac{9}{25}=\\tfrac{\\square}{25}',
            blanks: ['16'],
            tiles: ['16', '9', '25', '4'],
          },
          note: '$25-9=16$。',
        },
        {
          fill: {
            ask: '平方根をとろう',
            tex: '\\cos\\theta=\\sqrt{\\tfrac{16}{25}}=\\tfrac{\\square}{5}',
            blanks: ['4'],
            tiles: ['4', '16', '5', '3'],
          },
          note: '$\\sqrt{16}=4$。',
        },
      ],
      answer: '\\cos\\theta=\\dfrac{4}{5}',
      pitfall: '鋭角なら $\\cos\\theta>0$。$\\sqrt{\\ }$ で正の値を取る。',
    },
    {
      id: 'trig-4',
      text: '三角形で $a=4$、$A=30^\\circ$ のとき、外接円の直径 $2R$ を正弦定理で求めよう。',
      recall: {
        points: [
          '正弦定理 $\\dfrac{a}{\\sin A}=2R$',
          '辺 ÷ 対角の sin ＝ 外接円の直径',
        ],
        formula: { name: '正弦定理', tex: '\\dfrac{a}{\\sin A}=2R' },
        quiz: {
          q: '$\\dfrac{a}{\\sin A}$ は何に等しい？',
          choices: ['$2R$（外接円の直径）', '$R$', '$1$'],
          answer: 0,
          why: '正弦定理より $2R$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2R=\\dfrac{4}{\\sin30^\\circ}=\\dfrac{4}{1/2}$ を計算しよう',
            tex: '2R=\\dfrac{4}{1/2}=\\square',
            blanks: ['8'],
            tiles: ['8', '2', '4', '16'],
          },
          note: '$\\dfrac{4}{1/2}=4\\times2=8$。',
        },
      ],
      answer: '2R=8',
      pitfall: '$\\dfrac{a}{\\sin A}$ は $2R$（直径）。$R$（半径）ではない。',
    },
    {
      id: 'trig-5',
      text: '三角形で $b=3$、$c=5$、$A=60^\\circ$ のとき、辺 $a$ を余弦定理で求めよう。',
      recall: {
        points: [
          '余弦定理 $a^2=b^2+c^2-2bc\\cos A$',
          '$2$ 辺とその間の角から、対辺を求める',
        ],
        formula: { name: '余弦定理', tex: 'a^2=b^2+c^2-2bc\\cos A' },
        quiz: {
          q: '$\\cos60^\\circ$ は？',
          choices: ['$\\dfrac{1}{2}$', '$\\dfrac{\\sqrt{3}}{2}$', '$1$'],
          answer: 0,
          why: '$\\cos60^\\circ=\\dfrac{1}{2}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2bc\\cos A=2\\cdot3\\cdot5\\cdot\\tfrac12$ を引こう',
            tex: 'a^2=9+25-2\\cdot 3\\cdot 5\\cdot\\tfrac12=34-\\square',
            blanks: ['15'],
            tiles: ['15', '30', '9', '25'],
          },
          note: '$2\\cdot3\\cdot5\\cdot\\tfrac12=15$。',
        },
        {
          fill: {
            ask: '$a^2=19$ から $a$ を求めよう',
            tex: 'a=\\square',
            blanks: ['\\sqrt{19}'],
            tiles: ['\\sqrt{19}', '19', '\\sqrt{34}', '\\sqrt{15}'],
          },
          note: '$a=\\sqrt{19}$。',
        },
      ],
      answer: 'a=\\sqrt{19}',
      pitfall: '$2bc\\cos A$ の項を引く。$\\cos60^\\circ=\\dfrac{1}{2}$ を代入。',
    },
    {
      id: 'trig-6',
      text: '$b=4$、$c=6$、間の角 $A=30^\\circ$ の三角形の面積を求めよう。',
      recall: {
        points: [
          '$S=\\dfrac{1}{2}bc\\sin A$',
          '$2$ 辺とその間の角から面積（sin を使う）',
        ],
        formula: { name: '三角形の面積', tex: 'S=\\tfrac{1}{2}bc\\sin A' },
        quiz: {
          q: '面積の式は？',
          choices: ['$\\tfrac{1}{2}bc\\sin A$', '$\\tfrac{1}{2}bc\\cos A$', '$bc\\sin A$'],
          answer: 0,
          why: '間の角の sin を使う。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\tfrac12\\cdot4\\cdot6\\cdot\\sin30^\\circ=12\\cdot\\tfrac12$ を計算しよう',
            tex: 'S=12\\cdot\\tfrac{1}{2}=\\square',
            blanks: ['6'],
            tiles: ['6', '12', '24', '3'],
          },
          note: '$\\tfrac12\\cdot4\\cdot6=12$、$\\times\\tfrac12=6$。',
        },
      ],
      answer: 'S=6',
      pitfall: '面積は $\\sin$（cos ではない）。間の角を使う。',
    },
  ],
  dataI: [
    {
      id: 'dataI-1',
      text: 'データ $2,4,6,8,10$ の平均値を求めよう。',
      recall: {
        points: [
          '平均 ＝ 合計 ÷ 個数',
          '平均は偏差・分散を求める基準になる',
        ],
        formula: { name: '平均', tex: '\\bar{x}=\\dfrac{\\text{合計}}{n}' },
        quiz: {
          q: '平均値の求め方は？',
          choices: ['合計 ÷ 個数', '真ん中の値', '最大 − 最小'],
          answer: 0,
          why: '合計を個数で割る。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'まず合計を求めよう',
            tex: '2+4+6+8+10=\\square',
            blanks: ['30'],
            tiles: ['30', '40', '25', '20'],
          },
          note: '合計は $30$。',
        },
        {
          fill: {
            ask: '個数で割ろう',
            tex: '\\dfrac{30}{5}=\\square',
            blanks: ['6'],
            tiles: ['6', '5', '30', '3'],
          },
          note: '$30\\div5=6$。',
        },
      ],
      answer: '\\bar{x}=6',
      pitfall: '平均は合計 ÷ 個数。これが偏差・分散の基準になる。',
    },
    {
      id: 'dataI-2',
      text: 'データ $2,4,6$（平均 $4$）の分散を求めよう。',
      recall: {
        points: [
          '分散 ＝（偏差）² の平均',
          '偏差 ＝ 各値 − 平均',
        ],
        formula: { name: '分散', tex: 's^2=\\dfrac{1}{n}\\sum(x-\\bar{x})^2' },
        quiz: {
          q: '分散は何の平均？',
          choices: ['偏差の $2$ 乗', '偏差そのもの', 'データそのもの'],
          answer: 0,
          why: '偏差を $2$ 乗してから平均する。',
        },
      },
      steps: [
        {
          fill: {
            ask: '偏差の $2$ 乗の和を求めよう',
            tex: '(2-4)^2+(4-4)^2+(6-4)^2=4+0+4=\\square',
            blanks: ['8'],
            tiles: ['8', '4', '16', '0'],
          },
          note: '$4+0+4=8$。',
        },
        {
          fill: {
            ask: '個数 $3$ で割ろう',
            tex: 's^2=\\dfrac{8}{3}=\\square',
            blanks: ['\\tfrac{8}{3}'],
            tiles: ['\\tfrac{8}{3}', '8', '3', '\\tfrac{3}{8}'],
          },
          note: '分散は $\\dfrac{8}{3}$。',
        },
      ],
      answer: 's^2=\\dfrac{8}{3}',
      pitfall: '分散は偏差を $2$ 乗してから平均。偏差の和は必ず $0$ になる。',
    },
    {
      id: 'dataI-3',
      text: '分散が $9$ のとき、標準偏差を求めよう。',
      recall: {
        points: [
          '標準偏差 ＝ √分散',
          '単位をデータと同じに戻す役割',
        ],
        formula: { name: '標準偏差', tex: 's=\\sqrt{s^2}' },
        quiz: {
          q: '標準偏差は？',
          choices: ['√分散', '分散の $2$ 乗', '分散 × $2$'],
          answer: 0,
          why: '分散の平方根。',
        },
      },
      steps: [
        {
          fill: {
            ask: '分散の平方根をとろう',
            tex: 's=\\sqrt{9}=\\square',
            blanks: ['3'],
            tiles: ['3', '81', '9', '4.5'],
          },
          note: '$\\sqrt{9}=3$。',
        },
      ],
      answer: 's=3',
      pitfall: '標準偏差は分散の平方根。分散とそのまま混同しない。',
    },
    {
      id: 'dataI-4',
      text: '$2$ 変数で、$x$ の偏差が $2$、$y$ の偏差が $3$ のとき、偏差の積を求めよう。',
      recall: {
        points: [
          '共分散は「$x,y$ の偏差の積」の平均',
          '偏差の積が正なら同じ向きに動く傾向',
        ],
        formula: { name: '共分散', tex: 's_{xy}=\\dfrac{1}{n}\\sum(x-\\bar{x})(y-\\bar{y})' },
        quiz: {
          q: '共分散に使うのは？',
          choices: ['偏差の積', '偏差の和', 'データそのものの積'],
          answer: 0,
          why: '$x,y$ の偏差どうしの積。',
        },
      },
      steps: [
        {
          fill: {
            ask: '偏差の積を求めよう',
            tex: '2\\times 3=\\square',
            blanks: ['6'],
            tiles: ['6', '5', '9', '1'],
          },
          note: '$2\\times3=6$。',
        },
      ],
      answer: '6',
      pitfall: '共分散は「偏差の積」の平均。データそのものの積ではない。',
    },
    {
      id: 'dataI-5',
      text: '共分散 $s_{xy}=12$、$x$ の標準偏差 $s_x=3$、$y$ の標準偏差 $s_y=8$ のとき、相関係数を求めよう。',
      recall: {
        points: [
          '$r=\\dfrac{s_{xy}}{s_x s_y}$',
          '相関係数は必ず $-1\\le r\\le1$',
        ],
        formula: { name: '相関係数', tex: 'r=\\dfrac{s_{xy}}{s_x s_y}' },
        quiz: {
          q: '相関係数の範囲は？',
          choices: ['$-1$ 〜 $1$', '$0$ 〜 $100$', '制限なし'],
          answer: 0,
          why: '$-1$ から $1$ の間。',
        },
      },
      steps: [
        {
          fill: {
            ask: '分母（標準偏差の積）を求めよう',
            tex: 's_x s_y=3\\times 8=\\square',
            blanks: ['24'],
            tiles: ['24', '11', '12', '16'],
          },
          note: '$3\\times8=24$。',
        },
        {
          fill: {
            ask: '相関係数を求めよう',
            tex: 'r=\\dfrac{12}{24}=\\square',
            blanks: ['0.5'],
            tiles: ['0.5', '2', '0.25', '12'],
          },
          note: '$\\dfrac{12}{24}=0.5$。',
        },
      ],
      answer: 'r=0.5',
      pitfall: '相関係数は共分散 ÷（標準偏差の積）。必ず $-1$〜$1$ に収まる。',
    },
    {
      id: 'dataI-6',
      text: '相関係数が $r=-0.9$ のとき、$2$ 変数の関係は？',
      recall: {
        points: [
          '$r$ が $1$ に近い → 正の相関、$-1$ に近い → 負の相関',
          '$0$ に近い → 相関が弱い',
        ],
        formula: { name: '相関', tex: 'r>0:\\text{正の相関},\\ r<0:\\text{負の相関}' },
        quiz: {
          q: '$r=-0.9$ は？',
          choices: ['強い負の相関', '強い正の相関', '相関なし'],
          answer: 0,
          why: '$-1$ に近いので強い負の相関。',
        },
      },
      steps: [
        {
          ask: '$r=-0.9$ のとき、一方が増えると他方は？',
          choices: ['減る傾向（負の相関）', '増える傾向', '変わらない'],
          answer: 0,
          note: '$r<0$ なので逆向き。$-0.9$ は強い。',
        },
      ],
      answer: '\\text{強い負の相関}',
      pitfall: '$r$ の符号が「向き」、絶対値が「強さ」。$-0.9$ は強い負の相関。',
    },
  ],
  count: [
    {
      id: 'count-1',
      text: '$5$ 人から $3$ 人を選んで $1$ 列に並べる方法は何通り？（順列）',
      recall: {
        points: [
          '順列は「並べる」＝順番を区別する',
          '${}_nP_r=n(n-1)\\cdots$（$r$ 個分かける）',
        ],
        formula: { name: '順列', tex: '{}_nP_r=n(n-1)\\cdots(n-r+1)' },
        quiz: {
          q: '順列は順番を？',
          choices: ['区別する', '区別しない', '関係ない'],
          answer: 0,
          why: '並べるので順番が大事。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$r=3$ 個分かけよう',
            tex: '{}_5P_3=5\\times 4\\times\\square',
            blanks: ['3'],
            tiles: ['3', '5', '2', '1'],
          },
          note: '$5$ から $1$ ずつ減らし $3$ 個分。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '5\\times 4\\times 3=\\square',
            blanks: ['60'],
            tiles: ['60', '20', '120', '15'],
          },
          note: '$60$ 通り。',
        },
      ],
      answer: '60\\ \\text{通り}',
      pitfall: '順列は $r$ 個分だけかける（$5\\times4\\times3$）。全部の階乗にしない。',
    },
    {
      id: 'count-2',
      text: '$5$ 人から $3$ 人を選ぶ方法は何通り？（組合せ）',
      recall: {
        points: [
          '組合せは「選ぶだけ」＝順番を区別しない',
          '${}_nC_r=\\dfrac{{}_nP_r}{r!}$',
        ],
        formula: { name: '組合せ', tex: '{}_nC_r=\\dfrac{{}_nP_r}{r!}' },
        quiz: {
          q: '組合せは順番を？',
          choices: ['区別しない', '区別する', '関係ある'],
          answer: 0,
          why: '選ぶだけなので順番は無視。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$3!$（分母）を求めよう',
            tex: '{}_5C_3=\\dfrac{5\\times 4\\times 3}{3\\times 2\\times 1}=\\dfrac{60}{\\square}',
            blanks: ['6'],
            tiles: ['6', '3', '60', '1'],
          },
          note: '$3!=6$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '\\dfrac{60}{6}=\\square',
            blanks: ['10'],
            tiles: ['10', '60', '6', '20'],
          },
          note: '$10$ 通り。',
        },
      ],
      answer: '10\\ \\text{通り}',
      pitfall: '組合せは順列を $r!$ で割る。順列（$60$）と混同しない。',
    },
    {
      id: 'count-3',
      text: '「AABBC」の $5$ 文字を $1$ 列に並べる方法は何通り？',
      recall: {
        points: [
          '同じものがあるときは、それぞれの個数の階乗で割る',
          '$\\dfrac{n!}{p!\\,q!\\cdots}$',
        ],
        formula: { name: '同じものを含む順列', tex: '\\dfrac{n!}{p!\\,q!}' },
        quiz: {
          q: 'A が $2$ 個・B が $2$ 個。何で割る？',
          choices: ['$2!\\times2!$', '$2!$ だけ', '割らない'],
          answer: 0,
          why: '各重複の個数の階乗で割る。',
        },
      },
      steps: [
        {
          fill: {
            ask: '分母 $2!\\,2!$ を求めよう',
            tex: '\\dfrac{5!}{2!\\,2!}=\\dfrac{120}{\\square}',
            blanks: ['4'],
            tiles: ['4', '2', '24', '6'],
          },
          note: '$2!\\times2!=4$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '\\dfrac{120}{4}=\\square',
            blanks: ['30'],
            tiles: ['30', '24', '120', '60'],
          },
          note: '$30$ 通り。',
        },
      ],
      answer: '30\\ \\text{通り}',
      pitfall: '同じ文字の個数の階乗で割る（A $2$ 個 → $2!$、B $2$ 個 → $2!$）。',
    },
    {
      id: 'count-4',
      text: '赤玉 $3$ 個、白玉 $2$ 個から $2$ 個取り出すとき、$2$ 個とも赤である確率は？',
      recall: {
        points: [
          '全体は ${}_5C_2$、赤 $2$ 個は ${}_3C_2$',
          '確率 ＝ あてはまる組合せ ÷ 全組合せ',
        ],
        formula: { name: '確率', tex: 'P=\\dfrac{{}_3C_2}{{}_5C_2}' },
        quiz: {
          q: '分母（全体）は？',
          choices: ['${}_5C_2$', '${}_3C_2$', '$5\\times2$'],
          answer: 0,
          why: '$5$ 個から $2$ 個選ぶ全通り。',
        },
      },
      steps: [
        {
          fill: {
            ask: '全体 ${}_5C_2$ を求めよう',
            tex: '{}_5C_2=\\dfrac{5\\times 4}{2}=\\square',
            blanks: ['10'],
            tiles: ['10', '20', '5', '12'],
          },
          note: '$\\dfrac{20}{2}=10$。',
        },
        {
          fill: {
            ask: '赤 $2$ 個 ${}_3C_2$ を求めよう',
            tex: '{}_3C_2=\\square',
            blanks: ['3'],
            tiles: ['3', '6', '1', '9'],
          },
          note: '$3$ 通り。',
        },
        {
          fill: {
            ask: '確率を求めよう',
            tex: 'P=\\dfrac{3}{\\square}',
            blanks: ['10'],
            tiles: ['10', '3', '5', '6'],
          },
          note: '$P=\\dfrac{3}{10}$。',
        },
      ],
      answer: 'P=\\dfrac{3}{10}',
      pitfall: '確率は組合せで（順番なし）。分母は全体の ${}_5C_2$。',
    },
    {
      id: 'count-5',
      text: '異なる $4$ 人が円形のテーブルに座る並び方は何通り？（円順列）',
      recall: {
        points: [
          '円順列は $(n-1)!$',
          '回転して同じものは $1$ つと数える',
        ],
        formula: { name: '円順列', tex: '(n-1)!' },
        quiz: {
          q: '円順列の公式は？',
          choices: ['$(n-1)!$', '$n!$', '$\\dfrac{n!}{2}$'],
          answer: 0,
          why: '回転分を除くので $(n-1)!$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$(4-1)!=3!$ を計算しよう',
            tex: '(4-1)!=3!=\\square',
            blanks: ['6'],
            tiles: ['6', '24', '3', '4'],
          },
          note: '$3!=6$。',
        },
      ],
      answer: '6\\ \\text{通り}',
      pitfall: '円順列は $(n-1)!$。$n!$ にしない（回転で重複する）。',
    },
    {
      id: 'count-6',
      text: 'くじ $10$ 本中当たり $3$ 本。$1$ 本目が当たりのとき、$2$ 本目も当たりの確率は？（戻さない）',
      recall: {
        points: [
          '$1$ 本目が当たった後、残りは $9$ 本中当たり $2$ 本',
          '条件付き確率は「残り」で考える',
        ],
        formula: { name: '条件付き確率', tex: 'P=\\dfrac{\\text{残り当たり}}{\\text{残り全部}}' },
        quiz: {
          q: '$2$ 本目を引くとき残りは？',
          choices: ['$9$ 本中当たり $2$ 本', '$10$ 本中当たり $3$ 本', '$9$ 本中当たり $3$ 本'],
          answer: 0,
          why: '$1$ 本目で当たりが $1$ 本減る。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2$ 本目の確率の分母を入れよう',
            tex: 'P=\\dfrac{2}{\\square}',
            blanks: ['9'],
            tiles: ['9', '10', '3', '8'],
          },
          note: '残り $9$ 本中、当たり $2$ 本。',
        },
      ],
      answer: 'P=\\dfrac{2}{9}',
      pitfall: '戻さないので分母・分子とも $1$ 減る（残り $9$ 本中当たり $2$ 本）。',
    },
  ],
  geomA: [
    {
      id: 'geomA-1',
      text: '$\\triangle ABC$ で $AB=6$、$AC=4$、$\\angle A$ の二等分線が $BC$ と $D$ で交わる。$BD:DC$ を求めよう。',
      recall: {
        points: [
          '角の二等分線は対辺を「隣り合う $2$ 辺の比」に分ける',
          '$BD:DC=AB:AC$',
        ],
        formula: { name: '角の二等分線', tex: 'BD:DC=AB:AC' },
        quiz: {
          q: '$BD:DC$ は何の比？',
          choices: ['$AB:AC$', '$AC:AB$', '$1:1$'],
          answer: 0,
          why: '$\\angle A$ をはさむ $2$ 辺の比。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$BD:DC=AB:AC$ の右側を入れよう',
            tex: 'BD:DC=6:\\square',
            blanks: ['4'],
            tiles: ['4', '6', '3', '2'],
          },
          note: '$AB:AC=6:4$。',
        },
        {
          fill: {
            ask: '約分しよう',
            tex: '6:4=3:\\square',
            blanks: ['2'],
            tiles: ['2', '4', '3', '1'],
          },
          note: '$6:4=3:2$。',
        },
      ],
      answer: 'BD:DC=3:2',
      pitfall: '二等分線の比は対応をそろえる（$BD:DC=AB:AC$）。逆にしない。',
    },
    {
      id: 'geomA-2',
      text: '三角形の重心は中線を頂点側から何対何に分ける？',
      recall: {
        points: [
          '重心は $3$ 本の中線の交点',
          '重心は中線を頂点側から $2:1$ に分ける',
        ],
        formula: { name: '重心', tex: '\\text{中線を}\\ 2:1\\ \\text{に分ける}' },
        quiz: {
          q: '重心は中線をどう分ける？',
          choices: ['$2:1$（頂点側が $2$）', '$1:1$', '$1:2$'],
          answer: 0,
          why: '頂点側が $2$、対辺側が $1$。',
        },
      },
      steps: [
        {
          ask: '中線の長さが $9$ のとき、頂点から重心までの長さは？',
          choices: ['$6$（$2:1$ の $2$ の方）', '$3$', '$4.5$'],
          answer: 0,
          note: '$2:1$ なので $9\\times\\dfrac{2}{3}=6$。',
        },
      ],
      answer: '2:1',
      pitfall: '重心は頂点側 $2$：対辺側 $1$。比の向きに注意。',
    },
    {
      id: 'geomA-3',
      text: 'チェバの定理で $\\dfrac{BD}{DC}=2$、$\\dfrac{CE}{EA}=3$ のとき $\\dfrac{AF}{FB}$ を求めよう。',
      recall: {
        points: [
          'チェバの定理：$3$ つの比の積が $1$',
          '残り ＝ $1\\div$（他 $2$ つの積）',
        ],
        formula: { name: 'チェバの定理', tex: '\\dfrac{BD}{DC}\\cdot\\dfrac{CE}{EA}\\cdot\\dfrac{AF}{FB}=1' },
        quiz: {
          q: '$3$ つの比の積は？',
          choices: ['$1$', '$0$', '$3$'],
          answer: 0,
          why: 'チェバの定理は積が $1$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2\\times3\\times\\dfrac{AF}{FB}=1$ より $\\dfrac{AF}{FB}$ の分母は？',
            tex: '\\dfrac{AF}{FB}=\\dfrac{1}{\\square}',
            blanks: ['6'],
            tiles: ['6', '5', '1', '2'],
          },
          note: '$2\\times3=6$ なので $\\dfrac{1}{6}$。',
        },
      ],
      answer: '\\dfrac{AF}{FB}=\\dfrac{1}{6}',
      pitfall: 'チェバは積が $1$。残りは $1\\div$（他の積）。',
    },
    {
      id: 'geomA-4',
      text: 'チェバの定理とメネラウスの定理の違いを確認しよう。',
      recall: {
        points: [
          'どちらも $3$ つの比の積が $1$',
          'チェバ ＝ $3$ 直線が $1$ 点で交わる、メネラウス ＝ $1$ 直線が三角形を切る',
        ],
        formula: { name: 'メネラウスの定理', tex: '\\dfrac{BP}{PC}\\cdot\\dfrac{CQ}{QA}\\cdot\\dfrac{AR}{RB}=1' },
        quiz: {
          q: 'メネラウスの比の積は？',
          choices: ['$1$', '$-1$', '$0$'],
          answer: 0,
          why: '一周して積は $1$。',
        },
      },
      steps: [
        {
          ask: 'チェバとメネラウスの違いは？',
          choices: ['チェバ＝1点で交わる、メネラウス＝1直線で切る', '同じもの', '無関係'],
          answer: 0,
          note: '$1$ 点で交わる → チェバ、$1$ 直線で切る → メネラウス。',
        },
      ],
      answer: '\\text{どちらも積}=1',
      pitfall: 'どちらも積 $1$。チェバ（共点）とメネラウス（共線）を区別する。',
    },
    {
      id: 'geomA-5',
      text: '円外の点 $P$ から引いた割線が円と $A,B$ で交わり $PA=2$、$PB=8$。同じ点からの接線の長さ $PT$ を求めよう。',
      recall: {
        points: [
          '方べきの定理：$PA\\cdot PB=PT^2$',
          '割線の積 ＝ 接線の $2$ 乗',
        ],
        formula: { name: '方べきの定理', tex: 'PA\\cdot PB=PT^2' },
        quiz: {
          q: '方べきの定理で接線は？',
          choices: ['$PT^2=PA\\cdot PB$', '$PT=PA+PB$', '$PT=PB-PA$'],
          answer: 0,
          why: '接線の $2$ 乗 ＝ 割線の積。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$PT^2=PA\\cdot PB$ を計算しよう',
            tex: 'PT^2=2\\times 8=\\square',
            blanks: ['16'],
            tiles: ['16', '10', '6', '4'],
          },
          note: '$2\\times8=16$。',
        },
        {
          fill: {
            ask: '平方根をとろう',
            tex: 'PT=\\sqrt{16}=\\square',
            blanks: ['4'],
            tiles: ['4', '16', '8', '2'],
          },
          note: '$\\sqrt{16}=4$。',
        },
      ],
      answer: 'PT=4',
      pitfall: '$PA\\cdot PB=PT^2$。接線は積の平方根（$PT^2$ のままにしない）。',
    },
    {
      id: 'geomA-6',
      text: '円外の点から引いた $2$ 本の接線の長さの関係を確認しよう。',
      recall: {
        points: [
          '同じ点から引いた $2$ 本の接線の長さは等しい',
          '接点までの距離が左右対称',
        ],
        formula: { name: '2接線', tex: 'PT_1=PT_2' },
        quiz: {
          q: '同じ点からの $2$ 本の接線は？',
          choices: ['長さが等しい', '直交する', '片方が長い'],
          answer: 0,
          why: '対称なので等しい。',
        },
      },
      steps: [
        {
          ask: '一方の接線が $5$ のとき、もう一方は？',
          choices: ['$5$（等しい）', '$10$', '分からない'],
          answer: 0,
          note: '同じ点からの $2$ 接線は等長。',
        },
      ],
      answer: 'PT_1=PT_2',
      pitfall: '同じ点からの $2$ 本の接線は必ず等しい長さ。',
    },
  ],
  intA: [
    {
      id: 'intA-1',
      text: '$12$ の正の約数の個数を求めよう。',
      recall: {
        points: [
          '素因数分解して「指数 ＋1」の積をとる',
          '$12=2^2\\times3$ → $(2+1)(1+1)$',
        ],
        formula: { name: '約数の個数', tex: 'p^a q^b\\ \\Rightarrow\\ (a+1)(b+1)' },
        quiz: {
          q: '約数の個数は指数を？',
          choices: ['＋1 して掛ける', '掛けるだけ', '足す'],
          answer: 0,
          why: '$(a+1)(b+1)$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$(2+1)(1+1)$ の後ろの数は？',
            tex: '(2+1)(1+1)=3\\times\\square',
            blanks: ['2'],
            tiles: ['2', '3', '6', '1'],
          },
          note: '$1+1=2$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '3\\times 2=\\square',
            blanks: ['6'],
            tiles: ['6', '5', '12', '3'],
          },
          note: '約数は $6$ 個。',
        },
      ],
      answer: '6\\ \\text{個}',
      pitfall: '指数に ＋1 してから掛ける。$12=2^2\\times3$。',
    },
    {
      id: 'intA-2',
      text: '$18$ と $24$ の最大公約数を求めよう。',
      recall: {
        points: [
          '素因数分解して、共通する素因数を「最小の指数」でとる',
          '$18=2\\times3^2$、$24=2^3\\times3$',
        ],
        formula: { name: '最大公約数', tex: '\\gcd:\\ \\text{共通素因数の最小指数}' },
        quiz: {
          q: '最大公約数は？',
          choices: ['共通因数の積（最小指数）', '大きい方の数', '$2$ 数の和'],
          answer: 0,
          why: '共通する素因数だけを最小指数で。',
        },
      },
      steps: [
        {
          fill: {
            ask: '共通因数 $2\\times3$ を計算しよう',
            tex: '\\gcd=2\\times3=\\square',
            blanks: ['6'],
            tiles: ['6', '2', '3', '12'],
          },
          note: '共通は $2$ と $3$。$\\gcd=6$。',
        },
      ],
      answer: '\\gcd=6',
      pitfall: '最大公約数は「共通・最小指数」。最小公倍数（最大指数）と区別する。',
    },
    {
      id: 'intA-3',
      text: 'ユークリッドの互除法で $\\gcd(91, 28)$ を求めよう。',
      recall: {
        points: [
          '大きい数を小さい数で割り、余りで繰り返す',
          '余りが $0$ になったときの「割る数」が最大公約数',
        ],
        formula: { name: '互除法', tex: '\\gcd(a,b)=\\gcd(b,\\ a\\bmod b)' },
        quiz: {
          q: '互除法は何を繰り返す？',
          choices: ['割って余りを次へ', '足す', '掛ける'],
          answer: 0,
          why: '割り算の余りを使って繰り返す。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$91=28\\times3+?$ の余りは？',
            tex: '91=28\\times 3+\\square',
            blanks: ['7'],
            tiles: ['7', '3', '28', '21'],
          },
          note: '$84+7=91$。',
        },
        {
          fill: {
            ask: '$28=7\\times4+?$ の余りは？',
            tex: '28=7\\times 4+\\square',
            blanks: ['0'],
            tiles: ['0', '7', '4', '1'],
          },
          note: '余り $0$。割る数 $7$ が GCD。',
        },
      ],
      answer: '\\gcd=7',
      pitfall: '余りが $0$ のときの「割る数」が GCD（最後の余り $0$ ではない）。',
    },
    {
      id: 'intA-4',
      text: '$23$ を $5$ で割った余りを求めよう（$23\\equiv\\square\\pmod 5$）。',
      recall: {
        points: [
          '$a\\equiv r\\pmod m$ は「$a$ を $m$ で割った余り $r$」',
          '$23=5\\times4+3$',
        ],
        formula: { name: '合同式', tex: 'a\\equiv r\\pmod m' },
        quiz: {
          q: '$23\\div5$ の余りは？',
          choices: ['$3$', '$4$', '$2$'],
          answer: 0,
          why: '$20+3$ なので余り $3$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$23=5\\times4+?$ の余りは？',
            tex: '23=5\\times 4+\\square',
            blanks: ['3'],
            tiles: ['3', '4', '5', '2'],
          },
          note: '余りは $3$。',
        },
      ],
      answer: '23\\equiv3\\pmod 5',
      pitfall: '余りは $0\\le r<m$（$0$ 以上 $m$ 未満）の範囲にとる。',
    },
    {
      id: 'intA-5',
      text: '$3x+5y=1$ の整数解を $1$ 組見つけよう。',
      recall: {
        points: [
          '$ax+by=1$ はまず特殊解を $1$ 組見つける',
          '小さい数で代入して試す',
        ],
        formula: { name: '不定方程式', tex: '3x+5y=1' },
        quiz: {
          q: 'まず何をする？',
          choices: ['解を $1$ 組見つける', '両辺を割る', '因数分解する'],
          answer: 0,
          why: '特殊解を探すのが第一歩。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x=2,\\ y=-1$ を代入：$6-5$ は？',
            tex: '3\\times 2+5\\times(-1)=6-5=\\square',
            blanks: ['1'],
            tiles: ['1', '11', '0', '-1'],
          },
          note: '$=1$ なので解になる。',
        },
      ],
      answer: 'x=2,\\ y=-1',
      pitfall: '$ax+by=1$ はまず特殊解を $1$ 組見つける（$x=2,\\ y=-1$）。',
    },
    {
      id: 'intA-6',
      text: '$2$ 進法の $1011_{(2)}$ を $10$ 進法で表そう。',
      recall: {
        points: [
          '各桁に位の重み（$2$ の累乗）をかけて足す',
          '右から $2^0,2^1,2^2,2^3$',
        ],
        formula: { name: 'n進法', tex: '1011_{(2)}=1\\cdot2^3+0\\cdot2^2+1\\cdot2+1' },
        quiz: {
          q: '$2$ 進法の各桁の重みは？',
          choices: ['$2$ の累乗', '$10$ の累乗', 'すべて同じ'],
          answer: 0,
          why: '$2$ 進法は $2$ の累乗。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$1\\cdot8+0\\cdot4+1\\cdot2+1$ の最後の項は？',
            tex: '8+0+2+\\square',
            blanks: ['1'],
            tiles: ['1', '0', '4', '3'],
          },
          note: '$1$ の位は $1\\cdot2^0=1$。',
        },
        {
          fill: {
            ask: '合計しよう',
            tex: '8+2+1=\\square',
            blanks: ['11'],
            tiles: ['11', '1011', '13', '9'],
          },
          note: '$10$ 進法で $11$。',
        },
      ],
      answer: '11',
      pitfall: '各桁に $2$ の累乗をかけて足す。$1011_{(2)}=11$。',
    },
  ],
  proof: [
    {
      id: 'proof-1',
      text: '$(x+2)^3$ を展開したときの $x^2$ の係数を、二項定理で求めよう。',
      recall: {
        points: [
          '$(a+b)^n$ の一般項は ${}_nC_r\\,a^{n-r}b^r$',
          '$x^2$ の項は $x^{3-r}=x^2$ より $r=1$',
        ],
        formula: { name: '二項定理', tex: '(a+b)^n=\\sum {}_nC_r\\,a^{n-r}b^r' },
        quiz: {
          q: '$x^2$ の項は $r$ がいくつ？',
          choices: ['$r=1$', '$r=2$', '$r=0$'],
          answer: 0,
          why: '$x^{3-1}=x^2$ なので $r=1$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '${}_3C_1\\times2^1=3\\times?$',
            tex: '{}_3C_1\\times 2^1=3\\times\\square',
            blanks: ['2'],
            tiles: ['2', '1', '4', '3'],
          },
          note: '${}_3C_1=3$、$2^1=2$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '3\\times 2=\\square',
            blanks: ['6'],
            tiles: ['6', '3', '8', '12'],
          },
          note: '係数は $6$。',
        },
      ],
      answer: '6',
      pitfall: '$x^2$ の項は $r=1$。${}_3C_1\\cdot2^1=6$。',
    },
    {
      id: 'proof-2',
      text: '$P(x)=x^3-2x+1$ を $x-2$ で割った余りを、剰余の定理で求めよう。',
      recall: {
        points: [
          '$x-a$ で割った余りは $P(a)$（剰余の定理）',
          '$x-2$ なら $x=2$ を代入',
        ],
        formula: { name: '剰余の定理', tex: 'P(x)\\div(x-a)\\ \\text{の余り}=P(a)' },
        quiz: {
          q: '$x-2$ で割った余りは？',
          choices: ['$P(2)$', '$P(-2)$', '$P(0)$'],
          answer: 0,
          why: '$x=2$ を代入した値。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$P(2)=8-4+1$ を計算しよう',
            tex: 'P(2)=8-4+1=\\square',
            blanks: ['5'],
            tiles: ['5', '13', '4', '1'],
          },
          note: '余りは $5$。',
        },
      ],
      answer: '5',
      pitfall: '$x-2$ なら $P(2)$（$x=2$）を代入。符号に注意（$x+2$ なら $P(-2)$）。',
    },
    {
      id: 'proof-3',
      text: '$a(x+1)+b=2x+5$ がすべての $x$ で成り立つとき、$a$ を求めよう。',
      recall: {
        points: [
          '恒等式は両辺の同じ次数の係数が等しい',
          '$x$ の係数を比較する',
        ],
        formula: { name: '恒等式', tex: '\\text{各次数の係数を比較}' },
        quiz: {
          q: '恒等式では何を比較？',
          choices: ['同じ次数の係数', '定数だけ', '解'],
          answer: 0,
          why: 'すべての $x$ で成立 ＝ 係数が一致。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x$ の係数を比較しよう（左 $ax$、右 $2x$）',
            tex: 'a=\\square',
            blanks: ['2'],
            tiles: ['2', '5', '3', '1'],
          },
          note: '$x$ の係数より $a=2$。',
        },
      ],
      answer: 'a=2',
      pitfall: '恒等式は「すべての $x$ で成立」＝係数比較。$1$ 点代入だけでは不十分なことも。',
    },
    {
      id: 'proof-4',
      text: '$x>0$ のとき $x+\\dfrac{4}{x}$ の最小値を、相加・相乗平均で求めよう。',
      recall: {
        points: [
          '相加平均 ≥ 相乗平均：$a+b\\ge2\\sqrt{ab}$（$a,b>0$）',
          '$x\\cdot\\dfrac{4}{x}=4$ と積が一定なので使える',
        ],
        formula: { name: '相加・相乗平均', tex: 'a+b\\ge2\\sqrt{ab}\\ (a,b>0)' },
        quiz: {
          q: '相加・相乗平均の右辺は？',
          choices: ['$2\\sqrt{ab}$', '$ab$', '$\\sqrt{a+b}$'],
          answer: 0,
          why: '$2\\sqrt{ab}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2\\sqrt{x\\cdot\\frac{4}{x}}=2\\sqrt{?}$ の中身は？',
            tex: 'x+\\dfrac{4}{x}\\ge 2\\sqrt{x\\cdot\\tfrac{4}{x}}=2\\sqrt{\\square}',
            blanks: ['4'],
            tiles: ['4', 'x', '16', '2'],
          },
          note: '$x$ が消えて $\\sqrt{4}$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '2\\sqrt{4}=\\square',
            blanks: ['4'],
            tiles: ['4', '2', '8', '16'],
          },
          note: '最小値は $4$。',
        },
      ],
      answer: '\\text{最小値}\\ 4',
      pitfall: '相加・相乗は $a,b>0$ が条件。等号成立は $a=b$（$x=2$）のとき。',
    },
    {
      id: 'proof-5',
      text: '$a^2+b^2\\ge2ab$ を示そう。$(a-b)^2$ を考える。',
      recall: {
        points: [
          '実数の $2$ 乗は必ず $0$ 以上',
          '$(a-b)^2\\ge0$ を展開して整理する',
        ],
        formula: { name: '平方の性質', tex: '(\\text{実数})^2\\ge0' },
        quiz: {
          q: '$(a-b)^2$ は？',
          choices: ['$\\ge0$（$0$ 以上）', '$<0$', '負になりうる'],
          answer: 0,
          why: '$2$ 乗は必ず $0$ 以上。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$(a-b)^2=a^2-2ab+b^2$ は何以上？',
            tex: '(a-b)^2=a^2-2ab+b^2\\ge\\square',
            blanks: ['0'],
            tiles: ['0', '1', '2ab', '-1'],
          },
          note: '$2$ 乗なので $\\ge0$。',
        },
        {
          ask: 'よって $a^2+b^2$ と $2ab$ の関係は？',
          choices: ['$a^2+b^2\\ge2ab$', '$a^2+b^2<2ab$', '等しい'],
          answer: 0,
          note: '$a^2-2ab+b^2\\ge0$ を移項すると示せる。',
        },
      ],
      answer: 'a^2+b^2\\ge2ab',
      pitfall: '実数の $2$ 乗は $\\ge0$。等号は $a=b$ のとき。',
    },
    {
      id: 'proof-6',
      text: '$\\dfrac{1}{x}+\\dfrac{1}{x+1}$ を $1$ つの分数にまとめよう。',
      recall: {
        points: [
          '通分して分子をたす',
          '分母は最小公倍数 $x(x+1)$',
        ],
        formula: { name: '分数式の加法', tex: '\\dfrac{1}{x}+\\dfrac{1}{x+1}=\\dfrac{(x+1)+x}{x(x+1)}' },
        quiz: {
          q: '通分の分母は？',
          choices: ['$x(x+1)$', '$x+x+1$', '$2x+1$'],
          answer: 0,
          why: '分母どうしの積（最小公倍数）。',
        },
      },
      steps: [
        {
          fill: {
            ask: '分子 $(x+1)+x$ をまとめよう',
            tex: '\\dfrac{(x+1)+x}{x(x+1)}=\\dfrac{\\square}{x(x+1)}',
            blanks: ['2x+1'],
            tiles: ['2x+1', '2x', 'x+1', '2x+2'],
          },
          note: '$(x+1)+x=2x+1$。',
        },
      ],
      answer: '\\dfrac{2x+1}{x(x+1)}',
      pitfall: '通分したら分子を「足す」。分母はそのまま積で残す。',
    },
  ],
  complex: [
    {
      id: 'complex-1',
      text: '$(2+3i)+(1-i)$ を計算しよう。',
      recall: {
        points: [
          '実部どうし・虚部どうしをそれぞれ足す',
          '$i$ は虚数単位（$i^2=-1$）',
        ],
        formula: { name: '複素数の加法', tex: '(a+bi)+(c+di)=(a+c)+(b+d)i' },
        quiz: {
          q: '$i^2$ は？',
          choices: ['$-1$', '$1$', '$i$'],
          answer: 0,
          why: '虚数単位の定義で $i^2=-1$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '実部 $2+1$ は？',
            tex: '(2+1)+(3-1)i=\\square+2i',
            blanks: ['3'],
            tiles: ['3', '2', '1', '5'],
          },
          note: '実部は $3$。',
        },
        {
          fill: {
            ask: '虚部 $3-1$ は？',
            tex: '3+(3-1)i=3+\\square i',
            blanks: ['2'],
            tiles: ['2', '3', '4', '1'],
          },
          note: '虚部は $2$。',
        },
      ],
      answer: '3+2i',
      pitfall: '実部どうし・虚部どうしを足す。$i^2=-1$ を忘れない。',
    },
    {
      id: 'complex-2',
      text: '$z=3+4i$ の絶対値 $|z|$ を求めよう。',
      recall: {
        points: [
          '$|a+bi|=\\sqrt{a^2+b^2}$',
          '共役は $\\bar{z}=a-bi$',
        ],
        formula: { name: '絶対値', tex: '|a+bi|=\\sqrt{a^2+b^2}' },
        quiz: {
          q: '$|z|$ は？',
          choices: ['$\\sqrt{a^2+b^2}$', '$a+b$', '$a^2+b^2$'],
          answer: 0,
          why: '原点からの距離。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$3^2+4^2$ を求めよう',
            tex: '|z|=\\sqrt{3^2+4^2}=\\sqrt{\\square}',
            blanks: ['25'],
            tiles: ['25', '7', '12', '49'],
          },
          note: '$9+16=25$。',
        },
        {
          fill: {
            ask: '平方根をとろう',
            tex: '\\sqrt{25}=\\square',
            blanks: ['5'],
            tiles: ['5', '25', '10', '7'],
          },
          note: '$|z|=5$。',
        },
      ],
      answer: '|z|=5',
      pitfall: '絶対値は $2$ 乗の和の平方根。$\\sqrt{\\ }$ を忘れない。',
    },
    {
      id: 'complex-3',
      text: '$x^2-5x+6=0$ の $2$ 解の和と積を、解と係数の関係で求めよう。',
      recall: {
        points: [
          '$ax^2+bx+c=0$ で 和 $=-\\dfrac{b}{a}$、積 $=\\dfrac{c}{a}$',
          '解かなくても係数から分かる',
        ],
        formula: { name: '解と係数の関係', tex: '\\alpha+\\beta=-\\tfrac{b}{a},\\ \\alpha\\beta=\\tfrac{c}{a}' },
        quiz: {
          q: '$2$ 解の和は？',
          choices: ['$-\\dfrac{b}{a}$', '$\\dfrac{b}{a}$', '$\\dfrac{c}{a}$'],
          answer: 0,
          why: '和は $-\\dfrac{b}{a}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '和 $-\\dfrac{-5}{1}$ は？',
            tex: '\\alpha+\\beta=-\\dfrac{-5}{1}=\\square',
            blanks: ['5'],
            tiles: ['5', '-5', '6', '1'],
          },
          note: '和は $5$。',
        },
        {
          fill: {
            ask: '積 $\\dfrac{6}{1}$ は？',
            tex: '\\alpha\\beta=\\dfrac{6}{1}=\\square',
            blanks: ['6'],
            tiles: ['6', '5', '-6', '1'],
          },
          note: '積は $6$。',
        },
      ],
      answer: '\\text{和}\\ 5,\\ \\text{積}\\ 6',
      pitfall: '和は $-\\dfrac{b}{a}$（符号反転）、積は $\\dfrac{c}{a}$。',
    },
    {
      id: 'complex-4',
      text: '$x^2+x+1=0$ の解の種類を、判別式で調べよう。',
      recall: {
        points: [
          '$D=b^2-4ac<0$ なら異なる $2$ つの虚数解',
          '$D$ の符号で解の種類が決まる',
        ],
        formula: { name: '判別式', tex: 'D<0\\ \\Rightarrow\\ \\text{虚数解}' },
        quiz: {
          q: '$D<0$ のとき解は？',
          choices: ['異なる $2$ つの虚数解', '重解', '実数解 $2$ つ'],
          answer: 0,
          why: '$D<0$ で虚数解。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$4ac$ の部分を計算しよう',
            tex: 'D=1^2-4\\times 1\\times 1=1-\\square',
            blanks: ['4'],
            tiles: ['4', '1', '3', '0'],
          },
          note: '$D=1-4=-3$。',
        },
        {
          ask: '$D=-3$ なので解は？',
          choices: ['虚数解', '実数解', '重解'],
          answer: 0,
          note: '$D<0$ なので異なる $2$ つの虚数解。',
        },
      ],
      answer: '\\text{異なる2つの虚数解}',
      pitfall: '$D<0$ は虚数解（実数解なし）。$D$ の符号で判断する。',
    },
    {
      id: 'complex-5',
      text: '$P(x)=x^3-x^2-x+1$ について、$P(1)$ を求めて $x-1$ が因数か調べよう。',
      recall: {
        points: [
          '$P(a)=0$ なら $x-a$ は因数（因数定理）',
          'まず代入して $0$ かどうか確認',
        ],
        formula: { name: '因数定理', tex: 'P(a)=0\\ \\Leftrightarrow\\ (x-a)\\,\\text{は因数}' },
        quiz: {
          q: '$x-1$ が因数になる条件は？',
          choices: ['$P(1)=0$', '$P(0)=1$', '$P(-1)=0$'],
          answer: 0,
          why: '$x=1$ を代入して $0$ なら因数。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$P(1)=1-1-1+1$ を計算しよう',
            tex: 'P(1)=1-1-1+1=\\square',
            blanks: ['0'],
            tiles: ['0', '1', '2', '-1'],
          },
          note: '$P(1)=0$ なので因数。',
        },
      ],
      answer: 'P(1)=0\\ \\text{より}\\ x-1\\ \\text{は因数}',
      pitfall: '$P(a)=0$ なら $x-a$ が因数。代入で $0$ になるか確認する。',
    },
    {
      id: 'complex-6',
      text: '$\\dfrac{1}{1+i}$ を $a+bi$ の形にしよう。',
      recall: {
        points: [
          '分母の共役 $1-i$ を上下にかける',
          '$(1+i)(1-i)=1-i^2=2$（実数化）',
        ],
        formula: { name: '複素数の割り算', tex: '\\dfrac{1}{1+i}\\times\\dfrac{1-i}{1-i}' },
        quiz: {
          q: '分母に何をかける？',
          choices: ['共役 $1-i$', '$1+i$', '$i$'],
          answer: 0,
          why: '共役をかけて分母を実数にする。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$(1+i)(1-i)=1-i^2$ は？',
            tex: '(1+i)(1-i)=1-i^2=\\square',
            blanks: ['2'],
            tiles: ['2', '0', '1', '-1'],
          },
          note: '$1-(-1)=2$。',
        },
        {
          fill: {
            ask: '$\\dfrac{1-i}{2}$ の虚部の分子は？',
            tex: '\\dfrac{1-i}{2}=\\dfrac{1}{2}-\\dfrac{\\square}{2}i',
            blanks: ['1'],
            tiles: ['1', 'i', '2', '-1'],
          },
          note: '$\\dfrac{1}{2}-\\dfrac{1}{2}i$。',
        },
      ],
      answer: '\\dfrac{1}{2}-\\dfrac{1}{2}i',
      pitfall: '分母の共役をかける。$i^2=-1$ で分母が実数になる。',
    },
  ],
  coordII: [
    {
      id: 'coordII-1',
      text: '$2$ 点 $A(1,2)$、$B(4,6)$ の距離を求めよう。',
      recall: {
        points: [
          '距離 $=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$',
          '座標の差を $2$ 辺とする三平方の定理',
        ],
        formula: { name: '2点間の距離', tex: '\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}' },
        quiz: {
          q: '距離は何で求める？',
          choices: ['差の $2$ 乗の和の平方根', '差の和', '差の積'],
          answer: 0,
          why: '横の差・縦の差で三平方。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$3^2+4^2$ を求めよう',
            tex: '\\sqrt{3^2+4^2}=\\sqrt{\\square}',
            blanks: ['25'],
            tiles: ['25', '7', '5', '49'],
          },
          note: '$9+16=25$。',
        },
        {
          fill: {
            ask: '平方根をとろう',
            tex: '\\sqrt{25}=\\square',
            blanks: ['5'],
            tiles: ['5', '25', '10', '7'],
          },
          note: '距離は $5$。',
        },
      ],
      answer: '5',
      pitfall: '差を $2$ 乗してから足し、最後に平方根。',
    },
    {
      id: 'coordII-2',
      text: '$A(1,2)$、$B(7,8)$ を $1:2$ に内分する点を求めよう。',
      recall: {
        points: [
          '$m:n$ に内分する点は $\\left(\\dfrac{nx_1+mx_2}{m+n},\\ \\dfrac{ny_1+my_2}{m+n}\\right)$',
          '重みが「たすき」になる（$n$ が $x_1$ 側）',
        ],
        formula: { name: '内分点', tex: '\\left(\\dfrac{nx_1+mx_2}{m+n},\\ \\dfrac{ny_1+my_2}{m+n}\\right)' },
        quiz: {
          q: '$1:2$ 内分の分母は？',
          choices: ['$1+2=3$', '$1\\times2$', '$2-1$'],
          answer: 0,
          why: '$m+n$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x=\\dfrac{2\\cdot1+1\\cdot7}{3}=\\dfrac{9}{?}$ の分母は？',
            tex: 'x=\\dfrac{2\\cdot 1+1\\cdot 7}{3}=\\dfrac{9}{\\square}',
            blanks: ['3'],
            tiles: ['3', '9', '2', '1'],
          },
          note: '分母は $m+n=3$。',
        },
        {
          fill: {
            ask: '$x$ 座標を計算しよう',
            tex: '\\dfrac{9}{3}=\\square',
            blanks: ['3'],
            tiles: ['3', '9', '2', '6'],
          },
          note: '$x=3$（同様に $y=4$）。',
        },
      ],
      answer: '(3,\\ 4)',
      pitfall: '内分は重みがたすき掛け（$n$ が $x_1$ 側）。比の向きに注意。',
    },
    {
      id: 'coordII-3',
      text: '$2$ 点 $(1,3)$、$(3,7)$ を通る直線の傾きを求めよう。',
      recall: {
        points: [
          '傾き $=\\dfrac{y_2-y_1}{x_2-x_1}$',
          '縦の差 ÷ 横の差',
        ],
        formula: { name: '傾き', tex: 'a=\\dfrac{y_2-y_1}{x_2-x_1}' },
        quiz: {
          q: '傾きは？',
          choices: ['縦の差 ÷ 横の差', '横 ÷ 縦', '差の積'],
          answer: 0,
          why: '$\\dfrac{\\Delta y}{\\Delta x}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{7-3}{3-1}=\\dfrac{4}{?}$ の分母は？',
            tex: 'a=\\dfrac{7-3}{3-1}=\\dfrac{4}{\\square}',
            blanks: ['2'],
            tiles: ['2', '4', '3', '1'],
          },
          note: '$3-1=2$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '\\dfrac{4}{2}=\\square',
            blanks: ['2'],
            tiles: ['2', '4', '1', '8'],
          },
          note: '傾きは $2$。',
        },
      ],
      answer: 'a=2',
      pitfall: '傾きは縦 ÷ 横。逆にしない。',
    },
    {
      id: 'coordII-4',
      text: '傾き $2$ の直線に垂直な直線の傾きを求めよう。',
      recall: {
        points: [
          '垂直なら傾きの積が $-1$',
          '$m_1 m_2=-1$ より $m_2=-\\dfrac{1}{m_1}$',
        ],
        formula: { name: '垂直条件', tex: 'm_1 m_2=-1' },
        quiz: {
          q: '垂直な $2$ 直線の傾きの積は？',
          choices: ['$-1$', '$1$', '$0$'],
          answer: 0,
          why: '積が $-1$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2\\times m=-1$ より $m=-\\dfrac{1}{?}$',
            tex: '2\\times m=-1\\ \\Rightarrow\\ m=-\\dfrac{1}{\\square}',
            blanks: ['2'],
            tiles: ['2', '1', '-2', '4'],
          },
          note: '$m=-\\dfrac{1}{2}$。',
        },
      ],
      answer: 'm=-\\dfrac{1}{2}',
      pitfall: '垂直は傾きの積が $-1$（逆数の符号反転）。平行は傾きが等しい。',
    },
    {
      id: 'coordII-5',
      text: '中心 $(2,-3)$、半径 $4$ の円の方程式を求めよう。',
      recall: {
        points: [
          '$(x-a)^2+(y-b)^2=r^2$',
          '中心の符号は逆、右辺は半径の $2$ 乗',
        ],
        formula: { name: '円の方程式', tex: '(x-a)^2+(y-b)^2=r^2' },
        quiz: {
          q: '中心 $(2,-3)$ なら？',
          choices: ['$(x-2)^2+(y+3)^2$', '$(x+2)^2+(y-3)^2$', '$(x-2)^2+(y-3)^2$'],
          answer: 0,
          why: '中心の符号が逆になる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '右辺 $4^2$ を計算しよう',
            tex: '(x-2)^2+(y+3)^2=4^2=\\square',
            blanks: ['16'],
            tiles: ['16', '8', '4', '12'],
          },
          note: '$r^2=16$。',
        },
      ],
      answer: '(x-2)^2+(y+3)^2=16',
      pitfall: '中心の符号は逆（$-3$ → $+3$）、右辺は半径の $2$ 乗（$16$）。',
    },
    {
      id: 'coordII-6',
      text: '点 $(0,0)$ と直線 $3x+4y-10=0$ の距離を求めよう。',
      recall: {
        points: [
          '$d=\\dfrac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}$',
          '分子は絶対値、分母は係数の $2$ 乗和の平方根',
        ],
        formula: { name: '点と直線の距離', tex: 'd=\\dfrac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}' },
        quiz: {
          q: '分母は？',
          choices: ['$\\sqrt{a^2+b^2}$', '$a+b$', '$ab$'],
          answer: 0,
          why: '係数の $2$ 乗和の平方根。',
        },
      },
      steps: [
        {
          fill: {
            ask: '分子 $|3\\cdot0+4\\cdot0-10|$ は？',
            tex: '|3\\cdot 0+4\\cdot 0-10|=\\square',
            blanks: ['10'],
            tiles: ['10', '-10', '0', '14'],
          },
          note: '絶対値なので $10$。',
        },
        {
          fill: {
            ask: '分母 $\\sqrt{3^2+4^2}$ は？',
            tex: '\\sqrt{3^2+4^2}=\\square',
            blanks: ['5'],
            tiles: ['5', '7', '25', '12'],
          },
          note: '$\\sqrt{25}=5$。',
        },
        {
          fill: {
            ask: '距離を求めよう',
            tex: 'd=\\dfrac{10}{5}=\\square',
            blanks: ['2'],
            tiles: ['2', '5', '10', '50'],
          },
          note: '$d=2$。',
        },
      ],
      answer: 'd=2',
      pitfall: '分子は絶対値（必ず正）。分母は係数の $2$ 乗和の平方根。',
    },
  ],
  trigfn: [
    {
      id: 'trigfn-1',
      text: '$180^\\circ$ を弧度法（ラジアン）で表そう。',
      recall: {
        points: [
          '$180^\\circ=\\pi$ ラジアン',
          '度数に $\\dfrac{\\pi}{180}$ をかけるとラジアン',
        ],
        formula: { name: '弧度法', tex: '180^\\circ=\\pi\\ \\text{rad}' },
        quiz: {
          q: '$180^\\circ$ は？',
          choices: ['$\\pi$', '$2\\pi$', '$\\dfrac{\\pi}{2}$'],
          answer: 0,
          why: '半周が $\\pi$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$90^\\circ=\\dfrac{\\pi}{?}$ の分母は？',
            tex: '90^\\circ=\\dfrac{\\pi}{\\square}',
            blanks: ['2'],
            tiles: ['2', '4', '3', '1'],
          },
          note: '$90^\\circ=\\dfrac{\\pi}{2}$。',
        },
      ],
      answer: '180^\\circ=\\pi',
      pitfall: '$180^\\circ=\\pi$、$90^\\circ=\\dfrac{\\pi}{2}$、$60^\\circ=\\dfrac{\\pi}{3}$。',
    },
    {
      id: 'trigfn-2',
      text: '$\\sin\\dfrac{\\pi}{6}$ の値を求めよう。',
      recall: {
        points: [
          '$\\dfrac{\\pi}{6}=30^\\circ$',
          '$\\sin30^\\circ=\\dfrac{1}{2}$',
        ],
        formula: { name: '弧度と値', tex: '\\dfrac{\\pi}{6}=30^\\circ' },
        quiz: {
          q: '$\\dfrac{\\pi}{6}$ は何度？',
          choices: ['$30^\\circ$', '$60^\\circ$', '$45^\\circ$'],
          answer: 0,
          why: '$\\dfrac{\\pi}{6}=30^\\circ$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\sin30^\\circ=\\dfrac{1}{?}$ の分母は？',
            tex: '\\sin\\dfrac{\\pi}{6}=\\sin30^\\circ=\\dfrac{1}{\\square}',
            blanks: ['2'],
            tiles: ['2', '\\sqrt{3}', '1', '\\sqrt{2}'],
          },
          note: '$\\sin30^\\circ=\\dfrac{1}{2}$。',
        },
      ],
      answer: '\\dfrac{1}{2}',
      pitfall: 'ラジアンを度に直してから特別角の値を使う。',
    },
    {
      id: 'trigfn-3',
      text: '$y=\\sin 2x$ の周期を求めよう。',
      recall: {
        points: [
          '$y=\\sin kx$ の周期は $\\dfrac{2\\pi}{k}$',
          '係数 $k$ で $2\\pi$ を割る',
        ],
        formula: { name: '周期', tex: 'y=\\sin kx\\ \\text{の周期}=\\dfrac{2\\pi}{k}' },
        quiz: {
          q: '$\\sin kx$ の周期は？',
          choices: ['$\\dfrac{2\\pi}{k}$', '$2\\pi k$', '$\\dfrac{\\pi}{k}$'],
          answer: 0,
          why: '$\\dfrac{2\\pi}{k}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{2\\pi}{2}$ を計算しよう',
            tex: '\\dfrac{2\\pi}{2}=\\square',
            blanks: ['\\pi'],
            tiles: ['\\pi', '2\\pi', '4\\pi', '\\tfrac{\\pi}{2}'],
          },
          note: '周期は $\\pi$。',
        },
      ],
      answer: '\\pi',
      pitfall: '周期は $\\dfrac{2\\pi}{k}$。$y=\\sin2x$ は $k=2$ で周期 $\\pi$。',
    },
    {
      id: 'trigfn-4',
      text: '$\\sin75^\\circ$ を加法定理で求めよう（$75^\\circ=45^\\circ+30^\\circ$）。',
      recall: {
        points: [
          '$\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$',
          '$75^\\circ=45^\\circ+30^\\circ$ に分解',
        ],
        formula: { name: '加法定理', tex: '\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta' },
        quiz: {
          q: '$\\sin(\\alpha+\\beta)$ は？',
          choices: ['$\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$', '$\\sin\\alpha\\sin\\beta$', '$\\sin\\alpha+\\sin\\beta$'],
          answer: 0,
          why: '加法定理の形。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\sin30^\\circ=\\dfrac{?}{2}$ の分子は？',
            tex: '\\tfrac{\\sqrt{2}}{2}\\cdot\\tfrac{\\sqrt{3}}{2}+\\tfrac{\\sqrt{2}}{2}\\cdot\\tfrac{\\square}{2}',
            blanks: ['1'],
            tiles: ['1', '\\sqrt{3}', '2', '\\sqrt{2}'],
          },
          note: '$\\sin30^\\circ=\\dfrac{1}{2}$。',
        },
        {
          fill: {
            ask: 'まとめた分母は？',
            tex: '=\\dfrac{\\sqrt{6}+\\sqrt{2}}{\\square}',
            blanks: ['4'],
            tiles: ['4', '2', '8', '6'],
          },
          note: '分母は $4$。',
        },
      ],
      answer: '\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}',
      pitfall: '$\\sin(\\alpha+\\beta)$ は「sin cos ＋ cos sin」。掛ける順番に注意。',
    },
    {
      id: 'trigfn-5',
      text: '$\\sin\\theta=\\dfrac{3}{5}$、$\\cos\\theta=\\dfrac{4}{5}$ のとき $\\sin2\\theta$ を求めよう。',
      recall: {
        points: [
          '$\\sin2\\theta=2\\sin\\theta\\cos\\theta$',
          '$2$ 倍角は sin・cos の積の $2$ 倍',
        ],
        formula: { name: '2倍角', tex: '\\sin2\\theta=2\\sin\\theta\\cos\\theta' },
        quiz: {
          q: '$\\sin2\\theta$ は？',
          choices: ['$2\\sin\\theta\\cos\\theta$', '$\\sin^2\\theta$', '$2\\sin\\theta$'],
          answer: 0,
          why: '$2$ 倍角公式。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2\\times\\dfrac{3}{5}\\times\\dfrac{4}{5}=\\dfrac{?}{25}$ の分子は？',
            tex: '2\\times\\tfrac{3}{5}\\times\\tfrac{4}{5}=\\dfrac{\\square}{25}',
            blanks: ['24'],
            tiles: ['24', '12', '7', '25'],
          },
          note: '$2\\times3\\times4=24$。',
        },
      ],
      answer: '\\sin2\\theta=\\dfrac{24}{25}',
      pitfall: '$\\sin2\\theta=2\\sin\\theta\\cos\\theta$。$2\\sin\\theta$ ではない。',
    },
    {
      id: 'trigfn-6',
      text: '$\\sin\\theta+\\cos\\theta$ を $r\\sin(\\theta+\\alpha)$ に合成するとき、$r$ を求めよう。',
      recall: {
        points: [
          '$a\\sin\\theta+b\\cos\\theta=\\sqrt{a^2+b^2}\\sin(\\theta+\\alpha)$',
          '$r=\\sqrt{a^2+b^2}$',
        ],
        formula: { name: '三角関数の合成', tex: 'r=\\sqrt{a^2+b^2}' },
        quiz: {
          q: '合成の $r$ は？',
          choices: ['$\\sqrt{a^2+b^2}$', '$a+b$', '$ab$'],
          answer: 0,
          why: '係数の $2$ 乗和の平方根。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$r=\\sqrt{1^2+1^2}=\\sqrt{?}$',
            tex: 'r=\\sqrt{1^2+1^2}=\\sqrt{\\square}',
            blanks: ['2'],
            tiles: ['2', '1', '4', '\\sqrt{2}'],
          },
          note: '$1+1=2$。',
        },
      ],
      answer: 'r=\\sqrt{2}',
      pitfall: '合成の $r$ は $\\sqrt{a^2+b^2}$（係数の $2$ 乗和の平方根）。',
    },
  ],
  explog: [
    {
      id: 'explog-1',
      text: '$2^3\\times 2^4$ を計算しよう（指数法則）。',
      recall: {
        points: [
          '$a^m\\times a^n=a^{m+n}$',
          '同じ底のかけ算は指数を足す',
        ],
        formula: { name: '指数法則', tex: 'a^m\\times a^n=a^{m+n}' },
        quiz: {
          q: '同じ底のかけ算は指数を？',
          choices: ['足す', 'かける', '引く'],
          answer: 0,
          why: '指数の和になる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '指数 $3+4$ は？',
            tex: '2^3\\times 2^4=2^{3+4}=2^{\\square}',
            blanks: ['7'],
            tiles: ['7', '12', '1', '3'],
          },
          note: '$3+4=7$。',
        },
        {
          fill: {
            ask: '$2^7$ を計算しよう',
            tex: '2^7=\\square',
            blanks: ['128'],
            tiles: ['128', '14', '64', '256'],
          },
          note: '$2^7=128$。',
        },
      ],
      answer: '2^7=128',
      pitfall: '指数は足す（$3+4=7$）。掛けない。',
    },
    {
      id: 'explog-2',
      text: '$8^{\\frac{1}{3}}$ を計算しよう。',
      recall: {
        points: [
          '$a^{1/n}=\\sqrt[n]{a}$',
          '$8^{1/3}$ は $8$ の $3$ 乗根',
        ],
        formula: { name: '分数指数', tex: 'a^{1/n}=\\sqrt[n]{a}' },
        quiz: {
          q: '$8^{1/3}$ は？',
          choices: ['$\\sqrt[3]{8}$', '$8\\div3$', '$8^3$'],
          answer: 0,
          why: '$3$ 乗根。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\sqrt[3]{8}$ を求めよう',
            tex: '8^{1/3}=\\sqrt[3]{8}=\\square',
            blanks: ['2'],
            tiles: ['2', '3', '8', '4'],
          },
          note: '$2^3=8$ なので $2$。',
        },
      ],
      answer: '2',
      pitfall: '$a^{1/n}$ は $n$ 乗根。$8^{1/3}=2$（$2^3=8$）。',
    },
    {
      id: 'explog-3',
      text: '$\\log_2 8$ の値を求めよう。',
      recall: {
        points: [
          '$\\log_a b=x$ は $a^x=b$ の意味',
          '「$2$ を何乗したら $8$ か」を考える',
        ],
        formula: { name: '対数の定義', tex: '\\log_a b=x\\ \\Leftrightarrow\\ a^x=b' },
        quiz: {
          q: '$\\log_2 8$ は何を問う？',
          choices: ['$2$ を何乗で $8$', '$8$ を何乗で $2$', '$2\\times8$'],
          answer: 0,
          why: '指数を求める。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2^{?}=8$ の指数は？',
            tex: '\\log_2 8=\\square',
            blanks: ['3'],
            tiles: ['3', '2', '8', '4'],
          },
          note: '$2^3=8$ なので $3$。',
        },
      ],
      answer: '\\log_2 8=3',
      pitfall: '$\\log_2 8$ は「$2$ を何乗で $8$」＝$3$。',
    },
    {
      id: 'explog-4',
      text: '$\\log_{10}2+\\log_{10}5$ を計算しよう。',
      recall: {
        points: [
          '$\\log M+\\log N=\\log(MN)$',
          '対数の和は「積」の対数',
        ],
        formula: { name: '対数の性質', tex: '\\log_a M+\\log_a N=\\log_a MN' },
        quiz: {
          q: '対数の和は？',
          choices: ['積の対数', '和の対数', '差の対数'],
          answer: 0,
          why: '$\\log MN$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2\\times5$ は？',
            tex: '\\log_{10}2+\\log_{10}5=\\log_{10}(2\\times5)=\\log_{10}\\square',
            blanks: ['10'],
            tiles: ['10', '7', '25', '2'],
          },
          note: '$2\\times5=10$。',
        },
        {
          fill: {
            ask: '$\\log_{10}10$ を求めよう',
            tex: '\\log_{10}10=\\square',
            blanks: ['1'],
            tiles: ['1', '10', '0', '2'],
          },
          note: '底と真数が同じなので $1$。',
        },
      ],
      answer: '1',
      pitfall: '対数の和は「積」の対数。$\\log_{10}10=1$。',
    },
    {
      id: 'explog-5',
      text: '$\\log_4 8$ を底 $2$ にそろえて計算しよう。',
      recall: {
        points: [
          '底の変換 $\\log_a b=\\dfrac{\\log_c b}{\\log_c a}$',
          '分母は「元の底」の対数',
        ],
        formula: { name: '底の変換', tex: '\\log_a b=\\dfrac{\\log_c b}{\\log_c a}' },
        quiz: {
          q: '底の変換で分母は？',
          choices: ['$\\log_c a$（元の底）', '$\\log_c b$', '$a$'],
          answer: 0,
          why: '元の底 $a$ の対数。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{\\log_2 8}{\\log_2 4}=\\dfrac{3}{?}$ の分母は？',
            tex: '\\log_4 8=\\dfrac{\\log_2 8}{\\log_2 4}=\\dfrac{3}{\\square}',
            blanks: ['2'],
            tiles: ['2', '3', '4', '1'],
          },
          note: '$\\log_2 4=2$。よって $\\dfrac{3}{2}$。',
        },
      ],
      answer: '\\dfrac{3}{2}',
      pitfall: '底の変換は $\\dfrac{\\log b}{\\log a}$（分母が元の底）。',
    },
    {
      id: 'explog-6',
      text: '方程式 $\\log_2 x=3$ を解こう。',
      recall: {
        points: [
          '定義に戻す：$\\log_2 x=3\\ \\Leftrightarrow\\ x=2^3$',
          '真数は正（$x>0$）',
        ],
        formula: { name: '対数方程式', tex: '\\log_a x=p\\ \\Leftrightarrow\\ x=a^p' },
        quiz: {
          q: '$\\log_2 x=3$ は？',
          choices: ['$x=2^3$', '$x=3^2$', '$x=2\\times3$'],
          answer: 0,
          why: '定義より $x=a^p$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x=2^3$ を計算しよう',
            tex: 'x=2^3=\\square',
            blanks: ['8'],
            tiles: ['8', '6', '9', '16'],
          },
          note: '$x=8$。',
        },
      ],
      answer: 'x=8',
      pitfall: '定義 $x=a^p$ に戻す。真数 $x>0$ の確認も忘れない。',
    },
  ],
  diff: [
    {
      id: 'diff-1',
      text: '$y=x^3$ を微分しよう。',
      recall: {
        points: [
          '$\\dfrac{d}{dx}x^n=nx^{n-1}$',
          '指数を前に出して、指数を $1$ 減らす',
        ],
        formula: { name: '微分の公式', tex: '\\dfrac{d}{dx}x^n=nx^{n-1}' },
        quiz: {
          q: '$x^n$ の微分は？',
          choices: ['$nx^{n-1}$', '$x^{n-1}$', '$nx^n$'],
          answer: 0,
          why: '指数を前に出して $1$ 減らす。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$y^{\\prime}=3x^{?}$ の指数は？',
            tex: 'y^{\\prime}=3x^{\\square}',
            blanks: ['2'],
            tiles: ['2', '3', '1', '4'],
          },
          note: '指数 $3$ を前に、指数は $3-1=2$。',
        },
      ],
      answer: 'y^{\\prime}=3x^2',
      pitfall: '指数を前に出して $1$ 減らす。$x^3\\to3x^2$。',
    },
    {
      id: 'diff-2',
      text: '$y=x^2-4x+3$ を微分しよう。',
      recall: {
        points: [
          '各項をそれぞれ微分して足す',
          '定数項は微分すると $0$',
        ],
        formula: { name: '多項式の微分', tex: '\\text{各項を微分して足す}' },
        quiz: {
          q: '定数 $3$ の微分は？',
          choices: ['$0$', '$3$', '$1$'],
          answer: 0,
          why: '定数は微分すると $0$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$y^{\\prime}=2x-?$ の定数は？',
            tex: 'y^{\\prime}=2x-\\square',
            blanks: ['4'],
            tiles: ['4', '2', '3', '1'],
          },
          note: '$-4x\\to-4$、$+3\\to0$。',
        },
      ],
      answer: 'y^{\\prime}=2x-4',
      pitfall: '定数項は微分すると $0$。$-4x$ は $-4$。',
    },
    {
      id: 'diff-3',
      text: '$y=x^2$ の $x=3$ における微分係数（接線の傾き）を求めよう。',
      recall: {
        points: [
          '微分係数 ＝ 導関数に $x$ の値を代入',
          '$y^{\\prime}=2x$ に $x=3$',
        ],
        formula: { name: '微分係数', tex: 'f^{\\prime}(a)=\\text{接線の傾き}' },
        quiz: {
          q: '微分係数は何を表す？',
          choices: ['接線の傾き', '$y$ 切片', '面積'],
          answer: 0,
          why: 'その点での接線の傾き。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$y^{\\prime}(3)=2\\times3$ は？',
            tex: 'y^{\\prime}=2x\\ \\Rightarrow\\ y^{\\prime}(3)=2\\times 3=\\square',
            blanks: ['6'],
            tiles: ['6', '9', '3', '2'],
          },
          note: '$2\\times3=6$。',
        },
      ],
      answer: 'y^{\\prime}(3)=6',
      pitfall: '微分係数は導関数に代入。$x=3$ で $2\\times3=6$。',
    },
    {
      id: 'diff-4',
      text: '$y=x^2$ 上の点 $(1,1)$ における接線の方程式を求めよう。',
      recall: {
        points: [
          '接線：$y-f(a)=f^{\\prime}(a)(x-a)$',
          '傾き $=f^{\\prime}(1)$、接点 $(1,1)$ を通る',
        ],
        formula: { name: '接線', tex: 'y-f(a)=f^{\\prime}(a)(x-a)' },
        quiz: {
          q: '接線の傾きは？',
          choices: ['$f^{\\prime}(1)$', '$f(1)$', '$1$'],
          answer: 0,
          why: '微分係数が傾き。',
        },
      },
      steps: [
        {
          fill: {
            ask: '傾き $y^{\\prime}(1)$ は？',
            tex: 'y^{\\prime}=2x\\ \\Rightarrow\\ y^{\\prime}(1)=\\square',
            blanks: ['2'],
            tiles: ['2', '1', '3', '4'],
          },
          note: '$2\\times1=2$。',
        },
        {
          fill: {
            ask: '$y-1=2(x-1)$ を整理：$y=2x-?$',
            tex: 'y-1=2(x-1)\\ \\Rightarrow\\ y=2x-\\square',
            blanks: ['1'],
            tiles: ['1', '2', '3', '0'],
          },
          note: '$y=2x-2+1=2x-1$。',
        },
      ],
      answer: 'y=2x-1',
      pitfall: '接線は「傾き＝微分係数」「接点を通る」。$y-1=2(x-1)$。',
    },
    {
      id: 'diff-5',
      text: '$y=x^3-3x$ が極値をとる $x$ を求めよう（$y^{\\prime}=0$）。',
      recall: {
        points: [
          '極値は $y^{\\prime}=0$ となる点',
          '$y^{\\prime}=3x^2-3=0$ を解く',
        ],
        formula: { name: '極値', tex: 'y^{\\prime}=0\\ \\text{となる}\\ x' },
        quiz: {
          q: '極値の条件は？',
          choices: ['$y^{\\prime}=0$', '$y=0$', '$y\\to\\infty$'],
          answer: 0,
          why: '接線が水平（傾き $0$）。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$y^{\\prime}=3x^2-?$ の定数は？',
            tex: 'y^{\\prime}=3x^2-\\square',
            blanks: ['3'],
            tiles: ['3', '1', '9', '6'],
          },
          note: '$x^3\\to3x^2$、$-3x\\to-3$。',
        },
        {
          fill: {
            ask: '$3x^2-3=0\\Rightarrow x^2=1\\Rightarrow x=\\pm?$',
            tex: 'x=\\pm\\square',
            blanks: ['1'],
            tiles: ['1', '3', '2', '9'],
          },
          note: '$x^2=1$ より $x=\\pm1$。',
        },
      ],
      answer: 'x=\\pm 1',
      pitfall: '極値は $y^{\\prime}=0$。$x=\\pm1$ で極大・極小をとる。',
    },
    {
      id: 'diff-6',
      text: '微分係数の定義 $f^{\\prime}(a)=\\lim\\limits_{h\\to0}\\dfrac{f(a+h)-f(a)}{h}$ は何を表す？',
      recall: {
        points: [
          '平均変化率（割線の傾き）の極限 ＝ 瞬間の変化率',
          'それが接線の傾き ＝ 微分係数',
        ],
        formula: { name: '微分係数の定義', tex: 'f^{\\prime}(a)=\\lim_{h\\to0}\\dfrac{f(a+h)-f(a)}{h}' },
        quiz: {
          q: 'この極限は何？',
          choices: ['接線の傾き（瞬間変化率）', '面積', '平均値'],
          answer: 0,
          why: '微分係数の定義そのもの。',
        },
      },
      steps: [
        {
          ask: '$\\dfrac{f(a+h)-f(a)}{h}$ は $h\\to0$ で何に近づく？',
          choices: ['接線の傾き', '割線のまま', '$0$'],
          answer: 0,
          note: '割線の傾きが、接線の傾きに近づく。',
        },
      ],
      answer: 'f^{\\prime}(a)=\\text{接線の傾き}',
      pitfall: '平均変化率（割線）の極限が微分係数（接線の傾き）。',
    },
  ],
  integ: [
    {
      id: 'integ-1',
      text: '$\\displaystyle\\int x^2\\,dx$ を求めよう。',
      recall: {
        points: [
          '$\\displaystyle\\int x^n\\,dx=\\dfrac{x^{n+1}}{n+1}+C$',
          '指数を $1$ 増やして割る。積分定数 $C$ を忘れない',
        ],
        formula: { name: '不定積分', tex: '\\int x^n\\,dx=\\dfrac{x^{n+1}}{n+1}+C' },
        quiz: {
          q: '$\\int x^n\\,dx$ は指数を？',
          choices: ['$1$ 増やして割る', '$1$ 減らす', 'そのまま'],
          answer: 0,
          why: '微分の逆操作。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{x^{?}}{3}$ の指数は？',
            tex: '\\int x^2\\,dx=\\dfrac{x^{\\square}}{3}+C',
            blanks: ['3'],
            tiles: ['3', '2', '1', '4'],
          },
          note: '$n+1=3$。',
        },
      ],
      answer: '\\dfrac{x^3}{3}+C',
      pitfall: '指数を $1$ 増やして割る。積分定数 $C$ を忘れない。',
    },
    {
      id: 'integ-2',
      text: '$\\displaystyle\\int(2x+3)\\,dx$ を求めよう。',
      recall: {
        points: [
          '各項をそれぞれ積分する',
          '$2x\\to x^2$、$3\\to3x$',
        ],
        formula: { name: '多項式の積分', tex: '\\int(2x+3)\\,dx=x^2+3x+C' },
        quiz: {
          q: '定数 $3$ の積分は？',
          choices: ['$3x$', '$3$', '$0$'],
          answer: 0,
          why: '定数は積分すると $1$ 次式。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x^2+?\\,x+C$ の係数は？',
            tex: '\\int(2x+3)\\,dx=x^2+\\square x+C',
            blanks: ['3'],
            tiles: ['3', '2', '1', '6'],
          },
          note: '$3\\to3x$。',
        },
      ],
      answer: 'x^2+3x+C',
      pitfall: '定数 $3$ は積分すると $3x$。$C$ を忘れない。',
    },
    {
      id: 'integ-3',
      text: '$\\displaystyle\\int_0^2 2x\\,dx$ を求めよう。',
      recall: {
        points: [
          'まず不定積分 $x^2$ を求める',
          '上端 − 下端を代入：$[x^2]_0^2$',
        ],
        formula: { name: '定積分', tex: '\\int_a^b f(x)\\,dx=[F(x)]_a^b=F(b)-F(a)' },
        quiz: {
          q: '定積分は？',
          choices: ['$F(\\text{上})-F(\\text{下})$', '$F(\\text{下})-F(\\text{上})$', '$F(\\text{上})+F(\\text{下})$'],
          answer: 0,
          why: '上端から下端を引く。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$[x^2]_0^2=2^2-0^2$ は？',
            tex: '[x^2]_0^2=2^2-0^2=\\square',
            blanks: ['4'],
            tiles: ['4', '2', '0', '8'],
          },
          note: '$4-0=4$。',
        },
      ],
      answer: '4',
      pitfall: '定積分は上端 − 下端。積分定数 $C$ は消える。',
    },
    {
      id: 'integ-4',
      text: '$\\displaystyle\\int_1^3 2x\\,dx$ を求めよう。',
      recall: {
        points: [
          '不定積分 $x^2$ に上端・下端を代入',
          '$F(3)-F(1)$',
        ],
        formula: { name: '定積分', tex: '[F(x)]_a^b=F(b)-F(a)' },
        quiz: {
          q: '代入は？',
          choices: ['上端 − 下端', '下端 − 上端', '足す'],
          answer: 0,
          why: '$F(b)-F(a)$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$3^2-1^2=9-?$ の下端の値は？',
            tex: '[x^2]_1^3=3^2-1^2=9-\\square',
            blanks: ['1'],
            tiles: ['1', '3', '9', '8'],
          },
          note: '$1^2=1$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '9-1=\\square',
            blanks: ['8'],
            tiles: ['8', '10', '1', '9'],
          },
          note: '$8$。',
        },
      ],
      answer: '8',
      pitfall: '上端² − 下端²。引く順番に注意。',
    },
    {
      id: 'integ-5',
      text: '曲線 $y=x^2$ と $x$ 軸、$x=0$ から $x=3$ で囲まれた面積を求めよう。',
      recall: {
        points: [
          '面積 ＝ 定積分 $\\displaystyle\\int_0^3 x^2\\,dx$',
          '$x$ 軸より上なら定積分がそのまま面積',
        ],
        formula: { name: '面積', tex: 'S=\\int_a^b f(x)\\,dx' },
        quiz: {
          q: '面積は何で求める？',
          choices: ['定積分', '微分', '傾き'],
          answer: 0,
          why: '積分で面積。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\left[\\dfrac{x^3}{3}\\right]_0^3=\\dfrac{27}{?}$ の分母は？',
            tex: '\\int_0^3 x^2\\,dx=\\left[\\dfrac{x^3}{3}\\right]_0^3=\\dfrac{27}{\\square}',
            blanks: ['3'],
            tiles: ['3', '27', '9', '1'],
          },
          note: '$3^3=27$、分母 $3$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '\\dfrac{27}{3}=\\square',
            blanks: ['9'],
            tiles: ['9', '27', '3', '18'],
          },
          note: '面積は $9$。',
        },
      ],
      answer: 'S=9',
      pitfall: '面積は定積分。$x$ 軸より下の部分は負になるので符号に注意。',
    },
    {
      id: 'integ-6',
      text: '$\\dfrac{d}{dx}\\displaystyle\\int_a^x f(t)\\,dt$ は何になる？（微分と積分の関係）',
      recall: {
        points: [
          '積分してから微分すると元に戻る',
          '$\\dfrac{d}{dx}\\displaystyle\\int_a^x f(t)\\,dt=f(x)$',
        ],
        formula: { name: '微積分の基本定理', tex: '\\dfrac{d}{dx}\\int_a^x f(t)\\,dt=f(x)' },
        quiz: {
          q: '積分の後に微分すると？',
          choices: ['元の関数 $f(x)$', '$0$', '定数'],
          answer: 0,
          why: '微分と積分は逆操作。',
        },
      },
      steps: [
        {
          ask: '微分と積分は互いに？',
          choices: ['逆の操作', '同じ操作', '無関係'],
          answer: 0,
          note: '積分 → 微分で元の関数に戻る。',
        },
      ],
      answer: 'f(x)',
      pitfall: '微分と積分は逆操作。積分してから微分すると $f(x)$ に戻る。',
    },
  ],
  seq: [
    {
      id: 'seq-1',
      text: '初項 $3$、公差 $2$ の等差数列の第 $5$ 項を求めよう。',
      recall: {
        points: [
          '等差数列の一般項 $a_n=a_1+(n-1)d$',
          '初項に公差を $(n-1)$ 回足す',
        ],
        formula: { name: '等差の一般項', tex: 'a_n=a_1+(n-1)d' },
        quiz: {
          q: '一般項の式は？',
          choices: ['$a_1+(n-1)d$', '$a_1+nd$', '$a_1 d^{n-1}$'],
          answer: 0,
          why: '公差を $(n-1)$ 回足す。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$(5-1)\\times2$ は？',
            tex: 'a_5=3+(5-1)\\times 2=3+\\square',
            blanks: ['8'],
            tiles: ['8', '10', '4', '6'],
          },
          note: '$4\\times2=8$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '3+8=\\square',
            blanks: ['11'],
            tiles: ['11', '8', '5', '13'],
          },
          note: '$a_5=11$。',
        },
      ],
      answer: 'a_5=11',
      pitfall: '公差は $(n-1)$ 回足す（$n$ 回ではない）。$a_5$ は $4$ 回。',
    },
    {
      id: 'seq-2',
      text: '初項 $1$、末項 $10$、項数 $10$ の等差数列の和を求めよう。',
      recall: {
        points: [
          '和 $S_n=\\dfrac{n(a_1+a_n)}{2}$',
          '（初項 ＋ 末項）× 項数 ÷ $2$',
        ],
        formula: { name: '等差の和', tex: 'S_n=\\dfrac{n(a_1+a_n)}{2}' },
        quiz: {
          q: '等差数列の和は？',
          choices: ['$\\dfrac{n(\\text{初項}+\\text{末項})}{2}$', '初項 × 末項', '$n\\times$初項'],
          answer: 0,
          why: '台形の面積のイメージ。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{10\\times11}{?}$ の分母は？',
            tex: 'S=\\dfrac{10(1+10)}{2}=\\dfrac{110}{\\square}',
            blanks: ['2'],
            tiles: ['2', '10', '11', '110'],
          },
          note: '分母は $2$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '\\dfrac{110}{2}=\\square',
            blanks: ['55'],
            tiles: ['55', '110', '11', '50'],
          },
          note: '和は $55$。',
        },
      ],
      answer: '55',
      pitfall: '（初項 ＋ 末項）× 項数 ÷ $2$。$1$〜$10$ の和は $55$。',
    },
    {
      id: 'seq-3',
      text: '初項 $2$、公比 $3$ の等比数列の第 $4$ 項を求めよう。',
      recall: {
        points: [
          '等比数列の一般項 $a_n=a_1 r^{n-1}$',
          '公比を $(n-1)$ 回かける',
        ],
        formula: { name: '等比の一般項', tex: 'a_n=a_1 r^{n-1}' },
        quiz: {
          q: '等比数列の一般項は？',
          choices: ['$a_1 r^{n-1}$', '$a_1+(n-1)r$', '$a_1 rn$'],
          answer: 0,
          why: '公比を $(n-1)$ 回かける。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$3^{4-1}$ の指数は？',
            tex: 'a_4=2\\times 3^{4-1}=2\\times 3^{\\square}',
            blanks: ['3'],
            tiles: ['3', '4', '2', '1'],
          },
          note: '指数は $4-1=3$。',
        },
        {
          fill: {
            ask: '$2\\times27$ を計算しよう',
            tex: '2\\times 27=\\square',
            blanks: ['54'],
            tiles: ['54', '27', '6', '81'],
          },
          note: '$a_4=54$。',
        },
      ],
      answer: 'a_4=54',
      pitfall: '公比は $(n-1)$ 乗（$3^3=27$）。$a_4$ は $3$ 回かける。',
    },
    {
      id: 'seq-4',
      text: '初項 $1$、公比 $2$、項数 $4$ の等比数列の和を求めよう。',
      recall: {
        points: [
          '$S_n=\\dfrac{a_1(r^n-1)}{r-1}$（$r\\ne1$）',
          '$1+2+4+8$ と確かめられる',
        ],
        formula: { name: '等比の和', tex: 'S_n=\\dfrac{a_1(r^n-1)}{r-1}' },
        quiz: {
          q: '等比数列の和の分母は？',
          choices: ['$r-1$', '$r+1$', '$n$'],
          answer: 0,
          why: '公比 $-1$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '分母 $2-1$ は？',
            tex: 'S=\\dfrac{1\\times(2^4-1)}{2-1}=\\dfrac{16-1}{\\square}',
            blanks: ['1'],
            tiles: ['1', '2', '16', '15'],
          },
          note: '分母は $r-1=1$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '\\dfrac{15}{1}=\\square',
            blanks: ['15'],
            tiles: ['15', '16', '30', '8'],
          },
          note: '$1+2+4+8=15$。',
        },
      ],
      answer: '15',
      pitfall: '$1+2+4+8=15$。分母は $r-1$。',
    },
    {
      id: 'seq-5',
      text: '$\\displaystyle\\sum_{k=1}^{n}k=\\dfrac{n(n+1)}{2}$ を使い、$\\displaystyle\\sum_{k=1}^{10}k$ を求めよう。',
      recall: {
        points: [
          '$\\displaystyle\\sum_{k=1}^{n}k=\\dfrac{n(n+1)}{2}$',
          '$1$ から $n$ までの自然数の和',
        ],
        formula: { name: 'Σの公式', tex: '\\sum_{k=1}^{n}k=\\dfrac{n(n+1)}{2}' },
        quiz: {
          q: '$\\displaystyle\\sum_{k=1}^{n}k$ は？',
          choices: ['$\\dfrac{n(n+1)}{2}$', '$n^2$', '$\\dfrac{n}{2}$'],
          answer: 0,
          why: '自然数の和の公式。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{10\\times11}{?}$ の分母は？',
            tex: '\\dfrac{10\\times 11}{2}=\\dfrac{110}{\\square}',
            blanks: ['2'],
            tiles: ['2', '10', '11', '110'],
          },
          note: '分母は $2$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '\\dfrac{110}{2}=\\square',
            blanks: ['55'],
            tiles: ['55', '110', '50', '11'],
          },
          note: '$\\displaystyle\\sum_{k=1}^{10}k=55$。',
        },
      ],
      answer: '55',
      pitfall: '$\\displaystyle\\sum k=\\dfrac{n(n+1)}{2}$。$n=10$ で $55$。',
    },
    {
      id: 'seq-6',
      text: '$a_1=2$、$a_{n+1}=a_n+3$ で定まる数列の $a_3$ を求めよう。',
      recall: {
        points: [
          '漸化式は前の項から次の項を作る',
          '$a_{n+1}=a_n+3$ は公差 $3$ の等差数列',
        ],
        formula: { name: '漸化式', tex: 'a_{n+1}=a_n+3' },
        quiz: {
          q: '$a_{n+1}=a_n+3$ はどんな数列？',
          choices: ['公差 $3$ の等差数列', '等比数列', '一定の数列'],
          answer: 0,
          why: '毎回 $+3$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$a_2=2+3$ は？',
            tex: 'a_2=a_1+3=2+3=\\square',
            blanks: ['5'],
            tiles: ['5', '6', '2', '8'],
          },
          note: '$a_2=5$。',
        },
        {
          fill: {
            ask: '$a_3=5+3$ は？',
            tex: 'a_3=a_2+3=5+3=\\square',
            blanks: ['8'],
            tiles: ['8', '5', '11', '6'],
          },
          note: '$a_3=8$。',
        },
      ],
      answer: 'a_3=8',
      pitfall: '漸化式は順に計算。$a_1\\to a_2\\to a_3$ と $1$ つずつ。',
    },
  ],
  statB: [
    {
      id: 'statB-1',
      text: 'さいころの目 $X$ の期待値 $E(X)$ を求めよう（$1$〜$6$ が等確率）。',
      recall: {
        points: [
          '$E(X)=\\sum x\\,P(x)$',
          '各値 × 確率 の合計（加重平均）',
        ],
        formula: { name: '期待値', tex: 'E(X)=\\sum x\\,P(x)' },
        quiz: {
          q: '期待値は？',
          choices: ['各値 × 確率 の和', '値の単純な和', '最大値'],
          answer: 0,
          why: '確率で重みづけした平均。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{1+2+3+4+5+6}{?}$ の分母は？',
            tex: 'E(X)=\\dfrac{1+2+3+4+5+6}{6}=\\dfrac{21}{\\square}',
            blanks: ['6'],
            tiles: ['6', '21', '3', '7'],
          },
          note: '分母は $6$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '\\dfrac{21}{6}=\\square',
            blanks: ['3.5'],
            tiles: ['3.5', '3', '21', '7'],
          },
          note: '$E(X)=3.5$。',
        },
      ],
      answer: 'E(X)=3.5',
      pitfall: '期待値は「値 × 確率」の和。等確率なら平均と同じ。',
    },
    {
      id: 'statB-2',
      text: '確率変数 $X$ で $E(X)=2$、$E(X^2)=6$ のとき分散 $V(X)$ を求めよう。',
      recall: {
        points: [
          '$V(X)=E(X^2)-\\{E(X)\\}^2$',
          '「$2$ 乗の期待値」 − 「期待値の $2$ 乗」',
        ],
        formula: { name: '分散', tex: 'V(X)=E(X^2)-\\{E(X)\\}^2' },
        quiz: {
          q: '分散の式は？',
          choices: ['$E(X^2)-\\{E(X)\\}^2$', '$E(X)^2$', '$E(X^2)$'],
          answer: 0,
          why: '公式どおり。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$6-2^2=6-?$ の値は？',
            tex: 'V(X)=6-2^2=6-\\square',
            blanks: ['4'],
            tiles: ['4', '2', '6', '8'],
          },
          note: '$2^2=4$。$V(X)=2$。',
        },
      ],
      answer: 'V(X)=2',
      pitfall: '分散は $E(X^2)-\\{E(X)\\}^2$。引く順番に注意。',
    },
    {
      id: 'statB-3',
      text: '二項分布 $B(10,\\,0.2)$ に従う $X$ の期待値 $E(X)$ を求めよう。',
      recall: {
        points: [
          '二項分布 $B(n,p)$ の期待値は $np$',
          '分散は $np(1-p)$',
        ],
        formula: { name: '二項分布の期待値', tex: 'E(X)=np' },
        quiz: {
          q: '$B(n,p)$ の期待値は？',
          choices: ['$np$', '$n+p$', '$p$'],
          answer: 0,
          why: '$np$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$10\\times0.2$ は？',
            tex: 'E(X)=10\\times 0.2=\\square',
            blanks: ['2'],
            tiles: ['2', '20', '0.2', '12'],
          },
          note: '$E(X)=2$。',
        },
      ],
      answer: 'E(X)=2',
      pitfall: '二項分布の期待値は $np$。分散は $np(1-p)$ と混同しない。',
    },
    {
      id: 'statB-4',
      text: '$X$ が平均 $50$、標準偏差 $10$ のとき、$X=70$ を標準化（$Z$ 値）しよう。',
      recall: {
        points: [
          '$Z=\\dfrac{X-\\mu}{\\sigma}$',
          '平均を引いて標準偏差で割る',
        ],
        formula: { name: '標準化', tex: 'Z=\\dfrac{X-\\mu}{\\sigma}' },
        quiz: {
          q: '標準化の式は？',
          choices: ['$\\dfrac{X-\\mu}{\\sigma}$', '$X-\\mu$', '$X\\sigma$'],
          answer: 0,
          why: '平均を引いて $\\sigma$ で割る。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{70-50}{?}$ の分母は？',
            tex: 'Z=\\dfrac{70-50}{10}=\\dfrac{20}{\\square}',
            blanks: ['10'],
            tiles: ['10', '20', '50', '2'],
          },
          note: '分母は $\\sigma=10$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '\\dfrac{20}{10}=\\square',
            blanks: ['2'],
            tiles: ['2', '20', '10', '0.2'],
          },
          note: '$Z=2$（平均より $2\\sigma$ 上）。',
        },
      ],
      answer: 'Z=2',
      pitfall: '標準化は「平均を引いて $\\sigma$ で割る」。$Z=2$ は平均より $2\\sigma$ 上。',
    },
    {
      id: 'statB-5',
      text: '母平均の信頼区間 $\\bar{x}\\pm1.96\\dfrac{\\sigma}{\\sqrt{n}}$ で、$\\sigma=10,\\ n=100$ のとき片側の幅 $1.96\\dfrac{\\sigma}{\\sqrt{n}}$ を求めよう。',
      recall: {
        points: [
          '$\\dfrac{\\sigma}{\\sqrt{n}}$ は標準誤差',
          '$n=100$ なら $\\sqrt{100}=10$',
        ],
        formula: { name: '信頼区間', tex: '\\bar{x}\\pm1.96\\dfrac{\\sigma}{\\sqrt{n}}' },
        quiz: {
          q: '$\\sqrt{100}$ は？',
          choices: ['$10$', '$100$', '$50$'],
          answer: 0,
          why: '$10^2=100$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{10}{\\sqrt{100}}=\\dfrac{10}{?}$ の分母は？',
            tex: '\\dfrac{\\sigma}{\\sqrt{n}}=\\dfrac{10}{\\sqrt{100}}=\\dfrac{10}{\\square}',
            blanks: ['10'],
            tiles: ['10', '100', '50', '1'],
          },
          note: '$\\sqrt{100}=10$。標準誤差は $1$。',
        },
        {
          fill: {
            ask: '$1.96\\times1$ は？',
            tex: '1.96\\times\\dfrac{10}{10}=1.96\\times 1=\\square',
            blanks: ['1.96'],
            tiles: ['1.96', '19.6', '1', '10'],
          },
          note: '片側の幅は $1.96$。',
        },
      ],
      answer: '1.96',
      pitfall: '標準誤差は $\\dfrac{\\sigma}{\\sqrt{n}}$。$\\sqrt{100}=10$（$100$ ではない）。',
    },
    {
      id: 'statB-6',
      text: '標本平均は母平均の何にあたる？（推定の考え方）',
      recall: {
        points: [
          '標本平均は母平均の推定量',
          '標本サイズ $n$ が大きいほど推定が安定する',
        ],
        formula: { name: '推定', tex: '\\bar{x}\\approx\\mu' },
        quiz: {
          q: '標本平均は母平均の？',
          choices: ['推定値', '正確な値', '無関係な値'],
          answer: 0,
          why: '母平均を推定するのに使う。',
        },
      },
      steps: [
        {
          ask: '標本サイズ $n$ を大きくすると推定は？',
          choices: ['より正確（誤差が小さく）', '悪くなる', '変わらない'],
          answer: 0,
          note: '$n$ が大きいほど標準誤差 $\\dfrac{\\sigma}{\\sqrt{n}}$ が小さい。',
        },
      ],
      answer: '\\bar{x}\\approx\\mu\\ \\text{の推定値}',
      pitfall: '標本平均は母平均の「推定値」。$n$ を増やすと誤差 $\\dfrac{\\sigma}{\\sqrt{n}}$ が小さくなる。',
    },
  ],
  vector: [
    {
      id: 'vector-1',
      text: '$\\vec{a}=(1,2)$、$\\vec{b}=(3,-1)$ のとき $\\vec{a}+\\vec{b}$ を求めよう。',
      recall: {
        points: [
          '成分どうしを足す',
          '$x$ 成分・$y$ 成分をそれぞれ計算',
        ],
        formula: { name: '成分の和', tex: '(a_1,a_2)+(b_1,b_2)=(a_1+b_1,\\ a_2+b_2)' },
        quiz: {
          q: 'ベクトルの和は？',
          choices: ['成分どうしを足す', '大きさを足す', '内積をとる'],
          answer: 0,
          why: '成分ごとに足す。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x$ 成分 $1+3$ は？',
            tex: '\\vec{a}+\\vec{b}=(1+3,\\ 2-1)=(\\square,\\ 1)',
            blanks: ['4'],
            tiles: ['4', '3', '2', '1'],
          },
          note: '$x$ 成分は $4$。',
        },
        {
          fill: {
            ask: '$y$ 成分 $2-1$ は？',
            tex: '(4,\\ \\square)',
            blanks: ['1'],
            tiles: ['1', '3', '2', '4'],
          },
          note: '$y$ 成分は $1$。',
        },
      ],
      answer: '(4,\\ 1)',
      pitfall: '成分どうしを足す。大きさを足すのではない。',
    },
    {
      id: 'vector-2',
      text: '$\\vec{a}=(3,4)$ の大きさ $|\\vec{a}|$ を求めよう。',
      recall: {
        points: [
          '$|\\vec{a}|=\\sqrt{a_1^2+a_2^2}$',
          '成分の $2$ 乗和の平方根',
        ],
        formula: { name: '大きさ', tex: '|\\vec{a}|=\\sqrt{a_1^2+a_2^2}' },
        quiz: {
          q: '大きさは？',
          choices: ['成分の $2$ 乗和の平方根', '成分の和', '内積'],
          answer: 0,
          why: '三平方の定理と同じ。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$3^2+4^2$ は？',
            tex: '|\\vec{a}|=\\sqrt{3^2+4^2}=\\sqrt{\\square}',
            blanks: ['25'],
            tiles: ['25', '7', '5', '49'],
          },
          note: '$9+16=25$。',
        },
        {
          fill: {
            ask: '平方根をとろう',
            tex: '\\sqrt{25}=\\square',
            blanks: ['5'],
            tiles: ['5', '25', '10', '7'],
          },
          note: '$|\\vec{a}|=5$。',
        },
      ],
      answer: '|\\vec{a}|=5',
      pitfall: '大きさは成分の $2$ 乗和の平方根。',
    },
    {
      id: 'vector-3',
      text: '$\\vec{a}=(1,2)$、$\\vec{b}=(3,4)$ の内積 $\\vec{a}\\cdot\\vec{b}$ を求めよう。',
      recall: {
        points: [
          '$\\vec{a}\\cdot\\vec{b}=a_1 b_1+a_2 b_2$',
          '成分の積の和（結果はスカラー＝数）',
        ],
        formula: { name: '内積（成分）', tex: '\\vec{a}\\cdot\\vec{b}=a_1 b_1+a_2 b_2' },
        quiz: {
          q: '内積は？',
          choices: ['成分の積の和', '成分の和', 'ベクトル'],
          answer: 0,
          why: '積の和で、結果はスカラー。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$1\\times3+2\\times4=3+?$',
            tex: '1\\times 3+2\\times 4=3+\\square',
            blanks: ['8'],
            tiles: ['8', '6', '4', '11'],
          },
          note: '$2\\times4=8$。',
        },
        {
          fill: {
            ask: '計算しよう',
            tex: '3+8=\\square',
            blanks: ['11'],
            tiles: ['11', '8', '5', '24'],
          },
          note: '内積は $11$。',
        },
      ],
      answer: '\\vec{a}\\cdot\\vec{b}=11',
      pitfall: '内積はスカラー（数）。$x$ 成分の積 ＋ $y$ 成分の積。',
    },
    {
      id: 'vector-4',
      text: '$\\vec{a}=(2,3)$ と $\\vec{b}=(3,k)$ が垂直になる $k$ を求めよう。',
      recall: {
        points: [
          '垂直 ⇔ 内積が $0$',
          '$\\vec{a}\\cdot\\vec{b}=0$ を解く',
        ],
        formula: { name: '垂直条件', tex: '\\vec{a}\\perp\\vec{b}\\ \\Leftrightarrow\\ \\vec{a}\\cdot\\vec{b}=0' },
        quiz: {
          q: '垂直の条件は？',
          choices: ['内積 $=0$', '大きさが等しい', '成分が等しい'],
          answer: 0,
          why: '内積が $0$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$6+3k=0$ を解こう',
            tex: '6+3k=0\\ \\Rightarrow\\ k=\\square',
            blanks: ['-2'],
            tiles: ['-2', '2', '-6', '6'],
          },
          note: '$3k=-6$ より $k=-2$。',
        },
      ],
      answer: 'k=-2',
      pitfall: '垂直は内積 $=0$。$6+3k=0$ を解く。',
    },
    {
      id: 'vector-5',
      text: '$|\\vec{a}|=2$、$|\\vec{b}|=3$、なす角 $60^\\circ$ のとき内積 $\\vec{a}\\cdot\\vec{b}$ を求めよう。',
      recall: {
        points: [
          '$\\vec{a}\\cdot\\vec{b}=|\\vec{a}||\\vec{b}|\\cos\\theta$',
          '$\\cos60^\\circ=\\dfrac{1}{2}$',
        ],
        formula: { name: '内積（なす角）', tex: '\\vec{a}\\cdot\\vec{b}=|\\vec{a}||\\vec{b}|\\cos\\theta' },
        quiz: {
          q: '$\\cos60^\\circ$ は？',
          choices: ['$\\dfrac{1}{2}$', '$\\dfrac{\\sqrt{3}}{2}$', '$1$'],
          answer: 0,
          why: '$\\cos60^\\circ=\\dfrac{1}{2}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2\\times3\\times\\dfrac{1}{2}=6\\times\\dfrac{1}{2}$ は？',
            tex: '2\\times 3\\times\\tfrac{1}{2}=6\\times\\tfrac{1}{2}=\\square',
            blanks: ['3'],
            tiles: ['3', '6', '1', '12'],
          },
          note: '内積は $3$。',
        },
      ],
      answer: '\\vec{a}\\cdot\\vec{b}=3',
      pitfall: '内積は $|\\vec{a}||\\vec{b}|\\cos\\theta$。$\\cos$ を忘れない。',
    },
    {
      id: 'vector-6',
      text: '$\\vec{a}$、$\\vec{b}$ を位置ベクトルとする $A,B$ の中点 $M$ の位置ベクトルを求めよう。',
      recall: {
        points: [
          '中点は $\\dfrac{\\vec{a}+\\vec{b}}{2}$',
          '内分点の公式（$1:1$）',
        ],
        formula: { name: '中点の位置ベクトル', tex: '\\vec{m}=\\dfrac{\\vec{a}+\\vec{b}}{2}' },
        quiz: {
          q: '中点の位置ベクトルは？',
          choices: ['$\\dfrac{\\vec{a}+\\vec{b}}{2}$', '$\\vec{a}+\\vec{b}$', '$\\vec{a}-\\vec{b}$'],
          answer: 0,
          why: '$2$ つの平均。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{\\vec{a}+\\vec{b}}{?}$ の分母は？',
            tex: '\\vec{m}=\\dfrac{\\vec{a}+\\vec{b}}{\\square}',
            blanks: ['2'],
            tiles: ['2', '1', '3', '4'],
          },
          note: '和を $2$ で割る。',
        },
      ],
      answer: '\\vec{m}=\\dfrac{\\vec{a}+\\vec{b}}{2}',
      pitfall: '中点は和を $2$ で割る。$m:n$ 内分は $\\dfrac{n\\vec{a}+m\\vec{b}}{m+n}$。',
    },
  ],
  curveC: [
    {
      id: 'curveC-1',
      text: '放物線 $y^2=4px$ の焦点が $(2,0)$ のとき $p$ を求めよう。',
      recall: {
        points: [
          '$y^2=4px$ の焦点は $(p,0)$',
          '標準形と比較する',
        ],
        formula: { name: '放物線', tex: 'y^2=4px\\ \\text{の焦点}(p,0)' },
        quiz: {
          q: '$y^2=4px$ の焦点は？',
          choices: ['$(p,0)$', '$(0,p)$', '$(2p,0)$'],
          answer: 0,
          why: '焦点は $(p,0)$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$(p,0)=(2,0)$ より $p$ は？',
            tex: '(p,0)=(2,0)\\ \\Rightarrow\\ p=\\square',
            blanks: ['2'],
            tiles: ['2', '4', '1', '8'],
          },
          note: '$p=2$。',
        },
      ],
      answer: 'p=2',
      pitfall: '$y^2=4px$ の焦点は $(p,0)$。係数 $4p$ と混同しない。',
    },
    {
      id: 'curveC-2',
      text: '楕円 $\\dfrac{x^2}{9}+\\dfrac{y^2}{4}=1$ の $x$ 軸方向の頂点の座標を求めよう。',
      recall: {
        points: [
          '$\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1$ で $x$ 軸の端は $(\\pm a,0)$',
          '分母が $a^2$。$a^2=9$ より $a=3$',
        ],
        formula: { name: '楕円', tex: '\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1' },
        quiz: {
          q: '$a^2=9$ なら $a$ は？',
          choices: ['$3$', '$9$', '$81$'],
          answer: 0,
          why: '$\\sqrt{9}=3$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$a=\\sqrt{9}$ は？（頂点 $(\\pm a,0)$）',
            tex: 'a=\\sqrt{9}=\\square',
            blanks: ['3'],
            tiles: ['3', '9', '81', '6'],
          },
          note: '頂点は $(\\pm3,0)$。',
        },
      ],
      answer: '(\\pm 3,\\ 0)',
      pitfall: '分母は $a^2$。頂点は $\\pm a$（$\\pm\\sqrt{9}=\\pm3$）。',
    },
    {
      id: 'curveC-3',
      text: '双曲線 $\\dfrac{x^2}{4}-\\dfrac{y^2}{9}=1$ の漸近線の傾きを求めよう。',
      recall: {
        points: [
          '$\\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2}=1$ の漸近線は $y=\\pm\\dfrac{b}{a}x$',
          '$a=\\sqrt{4}=2,\\ b=\\sqrt{9}=3$',
        ],
        formula: { name: '双曲線の漸近線', tex: 'y=\\pm\\dfrac{b}{a}x' },
        quiz: {
          q: '漸近線の傾きは？',
          choices: ['$\\pm\\dfrac{b}{a}$', '$\\pm\\dfrac{a}{b}$', '$\\pm ab$'],
          answer: 0,
          why: '$\\dfrac{b}{a}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{b}{a}=\\dfrac{3}{?}$ の分母は？',
            tex: '\\dfrac{b}{a}=\\dfrac{3}{\\square}',
            blanks: ['2'],
            tiles: ['2', '3', '4', '9'],
          },
          note: '$a=\\sqrt{4}=2$。',
        },
      ],
      answer: 'y=\\pm\\dfrac{3}{2}x',
      pitfall: '漸近線の傾きは $\\dfrac{b}{a}$。$a=\\sqrt{4}=2,\\ b=\\sqrt{9}=3$。',
    },
    {
      id: 'curveC-4',
      text: '複素数 $z=3+4i$ の絶対値 $|z|$ を求めよう。',
      recall: {
        points: [
          '$|a+bi|=\\sqrt{a^2+b^2}$',
          '複素数平面の原点からの距離',
        ],
        formula: { name: '複素数の絶対値', tex: '|a+bi|=\\sqrt{a^2+b^2}' },
        quiz: {
          q: '$|z|$ は？',
          choices: ['$\\sqrt{a^2+b^2}$', '$a+b$', '$a^2+b^2$'],
          answer: 0,
          why: '原点からの距離。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$3^2+4^2$ は？',
            tex: '|z|=\\sqrt{3^2+4^2}=\\sqrt{\\square}',
            blanks: ['25'],
            tiles: ['25', '7', '5', '49'],
          },
          note: '$9+16=25$。',
        },
        {
          fill: {
            ask: '平方根をとろう',
            tex: '\\sqrt{25}=\\square',
            blanks: ['5'],
            tiles: ['5', '25', '10', '7'],
          },
          note: '$|z|=5$。',
        },
      ],
      answer: '|z|=5',
      pitfall: '複素数の絶対値は 実部² ＋ 虚部² の平方根。',
    },
    {
      id: 'curveC-5',
      text: '$z=1+i$ を極形式 $r(\\cos\\theta+i\\sin\\theta)$ にするとき、$r=|z|$ を求めよう。',
      recall: {
        points: [
          '$r=|z|=\\sqrt{a^2+b^2}$',
          '偏角 $\\theta$ は $\\tan\\theta=\\dfrac{b}{a}$',
        ],
        formula: { name: '極形式', tex: 'z=r(\\cos\\theta+i\\sin\\theta)' },
        quiz: {
          q: '極形式の $r$ は？',
          choices: ['絶対値 $|z|$', '偏角', '実部'],
          answer: 0,
          why: '$r=|z|$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$1^2+1^2$ は？',
            tex: 'r=\\sqrt{1^2+1^2}=\\sqrt{\\square}',
            blanks: ['2'],
            tiles: ['2', '1', '4', '\\sqrt{2}'],
          },
          note: '$r=\\sqrt{2}$。',
        },
      ],
      answer: 'r=\\sqrt{2}',
      pitfall: '$r$ は絶対値。偏角 $\\theta$（$45^\\circ$）と区別する。',
    },
    {
      id: 'curveC-6',
      text: '複素数に $i$ をかけると、複素数平面で何度回転する？',
      recall: {
        points: [
          '$i$ をかける ＝ 原点中心に $90^\\circ$ 回転',
          '偏角が $90^\\circ$ 増える',
        ],
        formula: { name: 'i 倍の意味', tex: '\\times i\\ =\\ 90^\\circ\\ \\text{回転}' },
        quiz: {
          q: '$i$ をかけると？',
          choices: ['$90^\\circ$ 回転', '$180^\\circ$ 回転', '変わらない'],
          answer: 0,
          why: '$i$ の偏角が $90^\\circ$。',
        },
      },
      steps: [
        {
          ask: '$i^2=-1$ は何度回転に相当？',
          choices: ['$180^\\circ$（$90^\\circ\\times2$）', '$90^\\circ$', '$0^\\circ$'],
          answer: 0,
          note: '$i$ 倍を $2$ 回で $180^\\circ$、符号が反転。',
        },
      ],
      answer: '90^\\circ\\ \\text{回転}',
      pitfall: '$i$ 倍は $90^\\circ$ 回転。$i^2=-1$ は $180^\\circ$（符号反転）。',
    },
  ],
  limit: [
    {
      id: 'limit-1',
      text: '$\\lim\\limits_{n\\to\\infty}\\dfrac{1}{n}$ を求めよう。',
      recall: {
        points: [
          '$n\\to\\infty$ で $\\dfrac{1}{n}\\to0$',
          '分母が大きくなると全体は $0$ に近づく',
        ],
        formula: { name: '基本の極限', tex: '\\lim_{n\\to\\infty}\\dfrac{1}{n}=0' },
        quiz: {
          q: '$\\dfrac{1}{n}$ は $n\\to\\infty$ で？',
          choices: ['$0$', '$\\infty$', '$1$'],
          answer: 0,
          why: '分母が大きく → $0$ に近づく。',
        },
      },
      steps: [
        {
          fill: {
            ask: '極限値を入れよう',
            tex: '\\lim_{n\\to\\infty}\\dfrac{1}{n}=\\square',
            blanks: ['0'],
            tiles: ['0', '1', '\\infty', 'n'],
          },
          note: '$0$ に収束。',
        },
      ],
      answer: '0',
      pitfall: '分母が $\\infty$ なら全体は $0$。',
    },
    {
      id: 'limit-2',
      text: '$\\lim\\limits_{x\\to2}(x^2+1)$ を求めよう。',
      recall: {
        points: [
          '連続な関数は代入してよい',
          '$x=2$ を代入する',
        ],
        formula: { name: '代入', tex: '\\lim_{x\\to a}f(x)=f(a)\\ (\\text{連続なら})' },
        quiz: {
          q: '連続関数の極限は？',
          choices: ['代入すればよい', '常に $0$', '常に $\\infty$'],
          answer: 0,
          why: '連続なら代入で求まる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$2^2+1$ は？',
            tex: '2^2+1=\\square',
            blanks: ['5'],
            tiles: ['5', '4', '3', '9'],
          },
          note: '$4+1=5$。',
        },
      ],
      answer: '5',
      pitfall: '連続なら代入してよい。$2^2+1=5$。',
    },
    {
      id: 'limit-3',
      text: '$\\lim\\limits_{x\\to2}\\dfrac{x^2-4}{x-2}$ を求めよう。',
      recall: {
        points: [
          '代入すると $\\dfrac{0}{0}$ → 因数分解して約分',
          '$x^2-4=(x+2)(x-2)$',
        ],
        formula: { name: '0/0型', tex: '\\dfrac{x^2-4}{x-2}=x+2' },
        quiz: {
          q: '$\\dfrac{0}{0}$ のときまず？',
          choices: ['因数分解して約分', 'そのまま代入', '$0$ にする'],
          answer: 0,
          why: '共通因数を消す。',
        },
      },
      steps: [
        {
          fill: {
            ask: '約分すると $x+?$',
            tex: '\\dfrac{(x+2)(x-2)}{x-2}=x+\\square',
            blanks: ['2'],
            tiles: ['2', '4', '-2', '1'],
          },
          note: '$x-2$ が約分されて $x+2$。',
        },
        {
          fill: {
            ask: '$x=2$ を代入しよう',
            tex: '2+2=\\square',
            blanks: ['4'],
            tiles: ['4', '2', '0', '5'],
          },
          note: '極限は $4$。',
        },
      ],
      answer: '4',
      pitfall: '$\\dfrac{0}{0}$ は因数分解で約分してから代入する。',
    },
    {
      id: 'limit-4',
      text: '$\\lim\\limits_{x\\to\\infty}\\dfrac{2x^2+1}{x^2+3}$ を求めよう。',
      recall: {
        points: [
          '分母・分子を最高次 $x^2$ で割る',
          '$\\dfrac{1}{x^2}\\to0$',
        ],
        formula: { name: '∞/∞型', tex: '\\text{最高次で割る}' },
        quiz: {
          q: '$\\dfrac{\\infty}{\\infty}$ 型はまず？',
          choices: ['最高次で割る', 'そのまま代入', '因数分解'],
          answer: 0,
          why: '最高次で割って $0$ に飛ばす。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{2+0}{1+0}$ は？',
            tex: '\\dfrac{2+\\frac{1}{x^2}}{1+\\frac{3}{x^2}}\\to\\dfrac{2+0}{1+0}=\\square',
            blanks: ['2'],
            tiles: ['2', '1', '3', '0'],
          },
          note: '最高次の係数の比 $\\dfrac{2}{1}=2$。',
        },
      ],
      answer: '2',
      pitfall: '$\\dfrac{\\infty}{\\infty}$ は最高次の係数の比（$\\dfrac{2}{1}=2$）。',
    },
    {
      id: 'limit-5',
      text: '無限等比級数 $1+\\dfrac{1}{2}+\\dfrac{1}{4}+\\cdots$ の和を求めよう（初項 $1$、公比 $\\dfrac{1}{2}$）。',
      recall: {
        points: [
          '$|r|<1$ なら和は $\\dfrac{a}{1-r}$',
          'この級数は収束する',
        ],
        formula: { name: '無限等比級数', tex: 'S=\\dfrac{a}{1-r}\\ (|r|<1)' },
        quiz: {
          q: '無限等比級数の収束条件は？',
          choices: ['$|r|<1$', '$r>1$', '常に収束'],
          answer: 0,
          why: '$|r|<1$ のとき収束。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{1}{1-\\frac{1}{2}}=\\dfrac{1}{\\frac{1}{2}}$ は？',
            tex: 'S=\\dfrac{1}{1-\\frac{1}{2}}=\\dfrac{1}{\\frac{1}{2}}=\\square',
            blanks: ['2'],
            tiles: ['2', '1', '\\tfrac{1}{2}', '4'],
          },
          note: '$1\\div\\dfrac{1}{2}=2$。',
        },
      ],
      answer: '2',
      pitfall: '和は $\\dfrac{a}{1-r}$。$1\\div\\dfrac{1}{2}=2$。',
    },
    {
      id: 'limit-6',
      text: '$\\lim\\limits_{x\\to0}\\dfrac{\\sin x}{x}$ を求めよう。',
      recall: {
        points: [
          '有名な極限 $\\dfrac{\\sin x}{x}\\to1$（$x\\to0$）',
          '微分や級数の土台になる',
        ],
        formula: { name: '三角関数の極限', tex: '\\lim_{x\\to0}\\dfrac{\\sin x}{x}=1' },
        quiz: {
          q: '$\\dfrac{\\sin x}{x}$ は $x\\to0$ で？',
          choices: ['$1$', '$0$', '$\\infty$'],
          answer: 0,
          why: '有名な極限で $1$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '極限値を入れよう',
            tex: '\\lim_{x\\to0}\\dfrac{\\sin x}{x}=\\square',
            blanks: ['1'],
            tiles: ['1', '0', '\\infty', 'x'],
          },
          note: '$1$ に収束。',
        },
      ],
      answer: '1',
      pitfall: '$\\dfrac{\\sin x}{x}\\to1$（$0$ ではない）。重要な極限。',
    },
  ],
  diff3: [
    {
      id: 'diff3-1',
      text: '積の微分公式を使い、$y=x\\cdot e^x$ を微分しよう。',
      recall: {
        points: [
          '$(fg)^{\\prime}=f^{\\prime}g+fg^{\\prime}$',
          '「前を微分 × 後」＋「前 × 後を微分」',
        ],
        formula: { name: '積の微分', tex: '(fg)^{\\prime}=f^{\\prime}g+fg^{\\prime}' },
        quiz: {
          q: '積の微分の公式は？',
          choices: ['$f^{\\prime}g+fg^{\\prime}$', '$f^{\\prime}g^{\\prime}$', '$f^{\\prime}+g^{\\prime}$'],
          answer: 0,
          why: '前微分 × 後 ＋ 前 × 後微分。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$(x)^{\\prime}=?$（前を微分）',
            tex: 'y^{\\prime}=1\\cdot e^x+x\\cdot e^x=(\\square+x)e^x',
            blanks: ['1'],
            tiles: ['1', 'x', '0', 'e^x'],
          },
          note: '$(x)^{\\prime}=1$、$(e^x)^{\\prime}=e^x$。',
        },
      ],
      answer: 'y^{\\prime}=(1+x)e^x',
      pitfall: '積の微分は「前微分 × 後 ＋ 前 × 後微分」。$f^{\\prime}g^{\\prime}$ ではない。',
    },
    {
      id: 'diff3-2',
      text: '商の微分 $\\left(\\dfrac{f}{g}\\right)^{\\prime}$ の公式を確認しよう。',
      recall: {
        points: [
          '分子は $f^{\\prime}g-fg^{\\prime}$（マイナス）',
          '分母は $g^2$',
        ],
        formula: { name: '商の微分', tex: '\\left(\\dfrac{f}{g}\\right)^{\\prime}=\\dfrac{f^{\\prime}g-fg^{\\prime}}{g^2}' },
        quiz: {
          q: '商の微分の分子は？',
          choices: ['$f^{\\prime}g-fg^{\\prime}$', '$f^{\\prime}g+fg^{\\prime}$', '$fg^{\\prime}-f^{\\prime}g$'],
          answer: 0,
          why: '分子はマイナス。',
        },
      },
      steps: [
        {
          ask: '分母は？',
          choices: ['$g^2$', '$g$', '$2g$'],
          answer: 0,
          note: '分母は $g$ の $2$ 乗。',
        },
      ],
      answer: '\\dfrac{f^{\\prime}g-fg^{\\prime}}{g^2}',
      pitfall: '商の微分の分子はマイナス（$f^{\\prime}g-fg^{\\prime}$）。順番に注意。',
    },
    {
      id: 'diff3-3',
      text: '合成関数の微分（連鎖律）で $y=(2x+1)^3$ を微分しよう。',
      recall: {
        points: [
          '$\\{f(g(x))\\}^{\\prime}=f^{\\prime}(g)\\cdot g^{\\prime}(x)$',
          '外側を微分 × 中身の微分',
        ],
        formula: { name: '連鎖律', tex: '\\{f(g(x))\\}^{\\prime}=f^{\\prime}(g)\\cdot g^{\\prime}(x)' },
        quiz: {
          q: '合成関数の微分は？',
          choices: ['外 × 中身の微分', '外だけ微分', '中だけ微分'],
          answer: 0,
          why: '連鎖律で中身の微分もかける。',
        },
      },
      steps: [
        {
          fill: {
            ask: '中身 $(2x+1)^{\\prime}$ は？',
            tex: 'y^{\\prime}=3(2x+1)^2\\cdot\\square',
            blanks: ['2'],
            tiles: ['2', '3', '1', '2x'],
          },
          note: '$(2x+1)^{\\prime}=2$。',
        },
      ],
      answer: 'y^{\\prime}=6(2x+1)^2',
      pitfall: '合成関数は「中身の微分」を忘れない（$\\times2$）。',
    },
    {
      id: 'diff3-4',
      text: '$y=\\sin x$ を微分しよう。',
      recall: {
        points: [
          '$(\\sin x)^{\\prime}=\\cos x$',
          '$(\\cos x)^{\\prime}=-\\sin x$（cos はマイナス）',
        ],
        formula: { name: '三角関数の微分', tex: '(\\sin x)^{\\prime}=\\cos x' },
        quiz: {
          q: '$(\\sin x)^{\\prime}$ は？',
          choices: ['$\\cos x$', '$-\\cos x$', '$-\\sin x$'],
          answer: 0,
          why: '$\\cos x$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '導関数を入れよう',
            tex: 'y^{\\prime}=\\square',
            blanks: ['\\cos x'],
            tiles: ['\\cos x', '-\\sin x', '\\sin x', '-\\cos x'],
          },
          note: '$(\\sin x)^{\\prime}=\\cos x$。',
        },
      ],
      answer: 'y^{\\prime}=\\cos x',
      pitfall: '$(\\sin x)^{\\prime}=\\cos x$、$(\\cos x)^{\\prime}=-\\sin x$（cos はマイナス）。',
    },
    {
      id: 'diff3-5',
      text: '$y=\\log x$ を微分しよう（自然対数）。',
      recall: {
        points: [
          '$(\\log x)^{\\prime}=\\dfrac{1}{x}$',
          '$(e^x)^{\\prime}=e^x$（指数は変わらない）',
        ],
        formula: { name: '対数・指数の微分', tex: '(\\log x)^{\\prime}=\\dfrac{1}{x}' },
        quiz: {
          q: '$(\\log x)^{\\prime}$ は？',
          choices: ['$\\dfrac{1}{x}$', '$\\log x$', '$x$'],
          answer: 0,
          why: '$\\dfrac{1}{x}$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\dfrac{1}{?}$ の分母は？',
            tex: 'y^{\\prime}=\\dfrac{1}{\\square}',
            blanks: ['x'],
            tiles: ['x', 'x^2', '1', '\\log x'],
          },
          note: '$(\\log x)^{\\prime}=\\dfrac{1}{x}$。',
        },
      ],
      answer: 'y^{\\prime}=\\dfrac{1}{x}',
      pitfall: '$(\\log x)^{\\prime}=\\dfrac{1}{x}$、$(e^x)^{\\prime}=e^x$（指数は変わらない）。',
    },
    {
      id: 'diff3-6',
      text: '関数のグラフが下に凸になるのは、第 $2$ 次導関数 $f^{\\prime\\prime}(x)$ がどうなるとき？',
      recall: {
        points: [
          '$f^{\\prime\\prime}>0$ で下に凸',
          '$f^{\\prime\\prime}<0$ で上に凸',
        ],
        formula: { name: '凹凸', tex: 'f^{\\prime\\prime}>0:\\ \\text{下に凸}' },
        quiz: {
          q: '下に凸の条件は？',
          choices: ['$f^{\\prime\\prime}>0$', '$f^{\\prime\\prime}<0$', '$f^{\\prime}=0$'],
          answer: 0,
          why: '第 $2$ 次導関数が正。',
        },
      },
      steps: [
        {
          ask: '$f^{\\prime\\prime}<0$ のとき？',
          choices: ['上に凸', '下に凸', '直線'],
          answer: 0,
          note: '$f^{\\prime\\prime}<0$ で上に凸。変曲点は $f^{\\prime\\prime}=0$。',
        },
      ],
      answer: 'f^{\\prime\\prime}>0',
      pitfall: '第 $2$ 次導関数 $f^{\\prime\\prime}$ の符号で凹凸。$f^{\\prime\\prime}=0$ は変曲点の候補。',
    },
  ],
  integ3: [
    {
      id: 'integ3-1',
      text: '$\\displaystyle\\int(2x+1)^3\\,dx$ を求めよう。',
      recall: {
        points: [
          '$\\displaystyle\\int(ax+b)^n\\,dx=\\dfrac{(ax+b)^{n+1}}{a(n+1)}+C$',
          '中身の係数 $a$ で割る（合成関数の積分の逆）',
        ],
        formula: { name: '1次式の累乗の積分', tex: '\\int(ax+b)^n\\,dx=\\dfrac{(ax+b)^{n+1}}{a(n+1)}+C' },
        quiz: {
          q: '中身 $2x+1$ の係数 $2$ で？',
          choices: ['割る', 'かける', '足す'],
          answer: 0,
          why: '微分の連鎖律の逆なので割る。',
        },
      },
      steps: [
        {
          fill: {
            ask: '分母 $2\\times4$ は？',
            tex: '\\int(2x+1)^3\\,dx=\\dfrac{(2x+1)^4}{2\\times 4}=\\dfrac{(2x+1)^4}{\\square}+C',
            blanks: ['8'],
            tiles: ['8', '4', '2', '16'],
          },
          note: '$2\\times4=8$。',
        },
      ],
      answer: '\\dfrac{(2x+1)^4}{8}+C',
      pitfall: '中身の係数 $2$ で割る（$\\dfrac{1}{2\\cdot4}$）。連鎖律の逆。',
    },
    {
      id: 'integ3-2',
      text: '部分積分 $\\displaystyle\\int f g^{\\prime}\\,dx=fg-\\int f^{\\prime}g\\,dx$ の符号を確認しよう。',
      recall: {
        points: [
          '$\\displaystyle\\int fg^{\\prime}\\,dx=fg-\\int f^{\\prime}g\\,dx$',
          '後ろの積分の前はマイナス',
        ],
        formula: { name: '部分積分', tex: '\\int f g^{\\prime}\\,dx=fg-\\int f^{\\prime}g\\,dx' },
        quiz: {
          q: '部分積分の第 $2$ 項の符号は？',
          choices: ['マイナス', 'プラス', 'つかない'],
          answer: 0,
          why: '$-\\displaystyle\\int f^{\\prime}g$ とマイナスがつく。',
        },
      },
      steps: [
        {
          ask: '$\\displaystyle\\int f^{\\prime}g\\,dx$ の前の符号は？',
          choices: ['$-$（マイナス）', '$+$', 'どちらでも'],
          answer: 0,
          note: '部分積分は第 $2$ 項にマイナスがつく。',
        },
      ],
      answer: 'fg-\\int f^{\\prime}g\\,dx',
      pitfall: '部分積分の第 $2$ 項はマイナス。符号ミスが多い。',
    },
    {
      id: 'integ3-3',
      text: '$\\displaystyle\\int\\cos x\\,dx$ を求めよう。',
      recall: {
        points: [
          '$\\displaystyle\\int\\cos x\\,dx=\\sin x+C$',
          '$\\displaystyle\\int\\sin x\\,dx=-\\cos x+C$',
        ],
        formula: { name: '三角関数の積分', tex: '\\int\\cos x\\,dx=\\sin x+C' },
        quiz: {
          q: '$\\displaystyle\\int\\cos x\\,dx$ は？',
          choices: ['$\\sin x+C$', '$-\\sin x+C$', '$\\cos x+C$'],
          answer: 0,
          why: '$\\sin x$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '積分結果を入れよう',
            tex: '\\int\\cos x\\,dx=\\square+C',
            blanks: ['\\sin x'],
            tiles: ['\\sin x', '-\\cos x', '\\cos x', '-\\sin x'],
          },
          note: '$\\displaystyle\\int\\cos x\\,dx=\\sin x+C$。',
        },
      ],
      answer: '\\sin x+C',
      pitfall: '$\\displaystyle\\int\\cos x=\\sin x$、$\\displaystyle\\int\\sin x=-\\cos x$（sin はマイナス）。微分と逆。',
    },
    {
      id: 'integ3-4',
      text: '$\\displaystyle\\int\\dfrac{1}{x}\\,dx$ を求めよう。',
      recall: {
        points: [
          '$\\displaystyle\\int\\dfrac{1}{x}\\,dx=\\log|x|+C$',
          '$\\dfrac{1}{x}$ だけは対数になる（特別）',
        ],
        formula: { name: '1/x の積分', tex: '\\int\\dfrac{1}{x}\\,dx=\\log|x|+C' },
        quiz: {
          q: '$\\displaystyle\\int\\dfrac{1}{x}\\,dx$ は？',
          choices: ['$\\log|x|+C$', '$\\dfrac{1}{x^2}$', '$-\\dfrac{1}{x^2}$'],
          answer: 0,
          why: '対数になる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '積分結果を入れよう',
            tex: '\\int\\dfrac{1}{x}\\,dx=\\square+C',
            blanks: ['\\log|x|'],
            tiles: ['\\log|x|', '\\dfrac{1}{x^2}', 'x', '\\dfrac{x^2}{2}'],
          },
          note: '$\\log|x|$。',
        },
      ],
      answer: '\\log|x|+C',
      pitfall: '$\\dfrac{1}{x}$ の積分だけは対数 $\\log|x|$。$\\dfrac{x^{n+1}}{n+1}$ の公式は $n=-1$ で使えない。',
    },
    {
      id: 'integ3-5',
      text: '$\\displaystyle\\int_0^{\\frac{\\pi}{2}}\\cos x\\,dx$ を求めよう。',
      recall: {
        points: [
          '不定積分 $\\sin x$ に上端・下端を代入',
          '$[\\sin x]_0^{\\pi/2}=\\sin\\dfrac{\\pi}{2}-\\sin 0$',
        ],
        formula: { name: '定積分', tex: '[\\sin x]_a^b=\\sin b-\\sin a' },
        quiz: {
          q: '$\\sin\\dfrac{\\pi}{2}$ は？',
          choices: ['$1$', '$0$', '$\\dfrac{1}{2}$'],
          answer: 0,
          why: '$90^\\circ$ の $\\sin$ は $1$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$1-\\sin0=1-?$ の値は？',
            tex: '[\\sin x]_0^{\\pi/2}=1-\\square',
            blanks: ['0'],
            tiles: ['0', '1', '\\tfrac{1}{2}', '-1'],
          },
          note: '$\\sin0=0$。',
        },
      ],
      answer: '1',
      pitfall: '$\\sin\\dfrac{\\pi}{2}=1$、$\\sin0=0$。上端 − 下端。',
    },
    {
      id: 'integ3-6',
      text: '$y=x$（$0\\le x\\le1$）を $x$ 軸まわりに回転した立体の体積を求めよう。',
      recall: {
        points: [
          '回転体の体積 $V=\\pi\\displaystyle\\int_a^b y^2\\,dx$',
          '断面は半径 $y$ の円（面積 $\\pi y^2$）',
        ],
        formula: { name: '回転体の体積', tex: 'V=\\pi\\int_a^b y^2\\,dx' },
        quiz: {
          q: '回転体の体積は？',
          choices: ['$\\pi\\displaystyle\\int y^2\\,dx$', '$\\displaystyle\\int y\\,dx$', '$2\\pi\\displaystyle\\int y\\,dx$'],
          answer: 0,
          why: '円の面積 $\\pi y^2$ の積分。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$\\pi\\left[\\dfrac{x^3}{3}\\right]_0^1=\\dfrac{\\pi}{?}$ の分母は？',
            tex: 'V=\\pi\\int_0^1 x^2\\,dx=\\pi\\left[\\dfrac{x^3}{3}\\right]_0^1=\\dfrac{\\pi}{\\square}',
            blanks: ['3'],
            tiles: ['3', '1', '9', '2'],
          },
          note: '$\\dfrac{1^3}{3}=\\dfrac{1}{3}$。',
        },
      ],
      answer: 'V=\\dfrac{\\pi}{3}',
      pitfall: '回転体は $\\pi\\displaystyle\\int y^2\\,dx$（$y$ を $2$ 乗）。$\\pi$ を忘れない。',
    },
  ],
  lin: [
    {
      id: 'lin-1',
      text: '2点 $(1,\\ 1)$, $(3,\\ 7)$ を通る直線の傾き $a$ を求めよう。',
      recall: {
        points: [
          '傾き ＝（$y$ の増加量）÷（$x$ の増加量）',
          '右へ $1$ 進むと上がる量。座標の差で計算する',
        ],
        formula: { name: '傾き', tex: 'a=\\dfrac{y_2-y_1}{x_2-x_1}' },
        quiz: {
          q: '傾き $a$ の求め方は？',
          choices: ['$\\dfrac{y_2-y_1}{x_2-x_1}$', '$\\dfrac{x_2-x_1}{y_2-y_1}$', '$y_2-y_1$'],
          answer: 0,
          why: '傾きは「縦の変化 ÷ 横の変化」。割り算であって引き算ではない。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$y$ の増加量と $x$ の増加量を入れよう',
            tex: 'a=\\dfrac{\\square}{\\square}',
            blanks: ['7-1', '3-1'],
            tiles: ['7-1', '3-1', '1-7', '3+1'],
          },
          note: '$(x_1,y_1)=(1,1)$、$(x_2,y_2)=(3,7)$。上が $y$ の差、下が $x$ の差。',
        },
        {
          fill: {
            ask: '約分しよう',
            tex: 'a=\\square',
            blanks: ['3'],
            tiles: ['3', '2', '\\tfrac{1}{3}', '6'],
          },
          note: '$\\dfrac{6}{2}=3$。',
        },
      ],
      answer: 'a=3',
      pitfall: '縦と横を逆にしない（$\\dfrac{\\Delta y}{\\Delta x}$）。引き算の順番も $y_2,x_2$ をそろえる。',
    },
    {
      id: 'lin-2',
      text: '傾きが $2$ で点 $(1,\\ 5)$ を通る直線の式を求めよう。',
      recall: {
        points: [
          '直線の式は $y=ax+b$。傾き $a$ はもう分かっている',
          '通る点の座標を代入して、切片 $b$ を求める',
        ],
        formula: { name: '直線の式', tex: 'y=ax+b' },
        quiz: {
          q: '切片 $b$ はどうやって求める？',
          choices: ['通る点を式に代入する', '傾きと同じ値', 'いつも $0$'],
          answer: 0,
          why: '$y=2x+b$ に通る点 $(1,5)$ を代入すれば $b$ が出る。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$y=2x+b$ に $(1,5)$ を代入。$b$ を求めよう',
            tex: '5=2\\cdot 1+b \\ \\Rightarrow\\ b=\\square',
            blanks: ['3'],
            tiles: ['3', '5', '7', '-3'],
          },
          note: '$5=2+b$ より $b=3$。',
        },
        {
          fill: {
            ask: '直線の式を完成させよう',
            tex: 'y=2x+\\square',
            blanks: ['3'],
            tiles: ['3', '-3', '5', '2'],
          },
          note: '傾き $2$、切片 $3$。',
        },
      ],
      answer: 'y=2x+3',
      pitfall: '傾きが分かっているので代入する点は $1$ つでよい。$b$ は「$x=0$ のときの $y$」。',
    },
    {
      id: 'lin-3',
      text: '2点 $(2,\\ 3)$, $(4,\\ 7)$ を通る直線の式を求めよう。',
      recall: {
        points: [
          'まず2点から傾き $a$ を求める',
          '次に通る1点を代入して切片 $b$ を求める',
        ],
        formula: { name: '直線の式', tex: 'y=ax+b,\\quad a=\\dfrac{y_2-y_1}{x_2-x_1}' },
        quiz: {
          q: '最初に求めるのは？',
          choices: ['傾き $a$', '切片 $b$', '$x$ 切片'],
          answer: 0,
          why: '2点が分かるときは、まず傾き → そのあと切片の順。',
        },
      },
      steps: [
        {
          fill: {
            ask: '傾きを求めよう',
            tex: 'a=\\dfrac{7-3}{4-2}=\\square',
            blanks: ['2'],
            tiles: ['2', '3', '\\tfrac{1}{2}', '4'],
          },
          note: '$\\dfrac{4}{2}=2$。',
        },
        {
          fill: {
            ask: '$y=2x+b$ に $(2,3)$ を代入。$b$ は？',
            tex: '3=2\\cdot 2+b \\ \\Rightarrow\\ b=\\square',
            blanks: ['-1'],
            tiles: ['-1', '1', '3', '-7'],
          },
          note: '$3=4+b$ より $b=-1$。',
        },
        {
          fill: {
            ask: '式を完成させよう',
            tex: 'y=2x\\square',
            blanks: ['-1'],
            tiles: ['-1', '+1', '-7', '+7'],
          },
          note: '$b=-1$ なので $y=2x-1$。',
        },
      ],
      answer: 'y=2x-1',
      pitfall: '傾きを出して満足しない。切片 $b$ まで求めて式を完成させる。',
    },
    {
      id: 'lin-4',
      text: '2直線 $y=x+1$ と $y=-2x+7$ の交点の座標を求めよう。',
      recall: {
        points: [
          '交点は2式を同時に満たす点 ＝ 連立方程式の解',
          '$y$ を消去して $x$ を先に求める',
        ],
        formula: { name: '交点', tex: '\\begin{cases}y=x+1\\\\ y=-2x+7\\end{cases}' },
        quiz: {
          q: '交点を求めるには？',
          choices: ['連立方程式を解く', '傾きを足す', '切片を比べる'],
          answer: 0,
          why: '両方の式が同時に成り立つ点が交点。連立の解。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$x+1=-2x+7$ を整理しよう',
            tex: '3x=\\square',
            blanks: ['6'],
            tiles: ['6', '8', '-6', '3'],
          },
          note: '$-2x$ を左へ、$1$ を右へ。$3x=6$。',
        },
        {
          fill: {
            ask: '$x$ を求めよう',
            tex: 'x=\\square',
            blanks: ['2'],
            tiles: ['2', '3', '6', '-2'],
          },
          note: '両辺を $3$ で割る。',
        },
        {
          fill: {
            ask: '$y=x+1$ に代入して $y$ を求めよう',
            tex: 'y=\\square',
            blanks: ['3'],
            tiles: ['3', '2', '1', '5'],
          },
          note: '$x=2$ を代入 → $y=3$。交点 $(2,3)$。',
        },
      ],
      answer: '(2,\\ 3)',
      pitfall: '$x$ を求めたら必ず $y$ も出す。座標は数が $2$ つ。',
    },
    {
      id: 'lin-5',
      text: '直線 $y=-\\dfrac{1}{2}x+3$ が $x$ 軸・$y$ 軸と交わる点を求めよう。',
      recall: {
        points: [
          '$y$ 軸との交点：$x=0$ を代入（＝切片 $b$）',
          '$x$ 軸との交点：$y=0$ を代入して $x$ を解く',
        ],
        formula: { name: '軸との交点', tex: 'y\\text{軸}:x=0,\\quad x\\text{軸}:y=0' },
        quiz: {
          q: '$x$ 軸との交点では何が $0$？',
          choices: ['$y=0$', '$x=0$', '$x=y$'],
          answer: 0,
          why: '$x$ 軸上の点は高さ $0$、つまり $y=0$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$y$ 軸との交点（$x=0$）の $y$ は？',
            tex: 'y=\\square',
            blanks: ['3'],
            tiles: ['3', '-3', '6', '0'],
          },
          note: '$x=0$ を代入すると $y=3$。点 $(0,3)$。',
        },
        {
          fill: {
            ask: '$x$ 軸との交点（$y=0$）：$0=-\\dfrac{1}{2}x+3$ より $x$ は？',
            tex: 'x=\\square',
            blanks: ['6'],
            tiles: ['6', '3', '-6', '\\tfrac{3}{2}'],
          },
          note: '$\\dfrac{1}{2}x=3$ より $x=6$。点 $(6,0)$。',
        },
      ],
      answer: 'y\\text{軸}\\,(0,\\,3),\\ \\ x\\text{軸}\\,(6,\\,0)',
      pitfall: 'ただ「切片」と言えば普通は $y$ 切片。$x$ 切片は $y=0$ とおいて求める。',
    },
    {
      id: 'lin-6',
      text: '水が $20$ L 入った水そうから毎分 $4$ L 排水する。$x$ 分後の水量を $y$ L とする。$y$ を $x$ の式で表し、空になる時間を求めよう。',
      recall: {
        points: [
          '一定の割合で変化 → 一次関数 $y=ax+b$',
          '初めの量が切片 $b$、毎分の変化が傾き $a$（減るので負）',
        ],
        formula: { name: '変化の様子', tex: 'y=(\\text{毎分の変化})\\,x+(\\text{初めの量})' },
        quiz: {
          q: '傾き $a$ は？',
          choices: ['$-4$（毎分 $4$L 減る）', '$4$', '$20$'],
          answer: 0,
          why: '減っていくので傾きは負。毎分 $4$L 減るから $a=-4$。',
        },
      },
      steps: [
        {
          fill: {
            ask: '式を作ろう（傾き → 切片の順）',
            tex: 'y=\\square\\,x+\\square',
            blanks: ['-4', '20'],
            tiles: ['-4', '20', '4', '-20'],
          },
          note: '初めの量 $20$ が切片、毎分 $-4$ が傾き。',
        },
        {
          fill: {
            ask: '空になる（$y=0$）。$0=-4x+20$ より $x$ は？',
            tex: 'x=\\square',
            blanks: ['5'],
            tiles: ['5', '4', '20', '-5'],
          },
          note: '$4x=20$ より $x=5$。$5$ 分後に空。',
        },
      ],
      answer: 'y=-4x+20,\\quad 5\\text{分後}',
      pitfall: '減る量は傾きをマイナスに。初期値は切片 $b$ に入る。',
    },
  ],
  eq2: [
    {
      id: 'eq2-1',
      prompt: 'x^2 + 5x + 6 = 0',
      recall: {
        points: [
          '$x^2$ の係数が $1$ → まず「因数分解」を狙う',
          'たして真ん中の係数・かけて定数項 になる2数を探す',
        ],
        formula: { name: '因数分解の型', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        quiz: {
          q: 'まず、どの方法で解く？',
          choices: ['因数分解', '解の公式', '平方完成'],
          answer: 0,
          why: '定数項 $6$ が小さく、たして $5$・かけて $6$ の整数が見つかりそう。因数分解が最速。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'たして $5$・かけて $6$ になる2数を空所に入れよう',
            tex: 'x^2+5x+6=(x\\square)(x\\square)',
            blanks: ['+2', '+3'],
            tiles: ['+2', '+3', '+1', '+6'],
            unordered: true,
          },
          note: '$2+3=5,\\ 2\\times3=6$ でぴったり。たし算が真ん中・かけ算が定数項。',
        },
        {
          fill: {
            ask: '積が $0$ ⇒ 各因数が $0$。解を入れよう',
            tex: 'x=\\square,\\ \\square',
            blanks: ['-2', '-3'],
            tiles: ['-2', '-3', '2', '3'],
            unordered: true,
          },
          note: '$x+2=0 \\Rightarrow x=-2$。符号が反転することに注意。',
        },
      ],
      answer: 'x=-2,\\ -3',
      pitfall: '$(x+2)=0$ から $x=-2$。$+2$ ではなく $-2$。符号ミスが一番多い。',
    },
    {
      id: 'eq2-2',
      prompt: 'x^2 - 7x + 12 = 0',
      recall: {
        points: [
          'たして $-7$・かけて $+12$ → 符号に注目',
          'かけて正・たして負 ⇒ 2数はどちらもマイナス',
        ],
        formula: { name: '因数分解の型', tex: 'x^2+(a+b)x+ab=(x+a)(x+b)' },
        quiz: {
          q: 'どの方法で解く？',
          choices: ['因数分解', '解の公式', 'グラフをかく'],
          answer: 0,
          why: '整数の組（$-3,-4$）が見つかる。因数分解でいける。',
        },
      },
      steps: [
        {
          fill: {
            ask: 'たして $-7$・かけて $+12$ になる2数を入れよう',
            tex: 'x^2-7x+12=(x\\square)(x\\square)',
            blanks: ['-3', '-4'],
            tiles: ['-3', '-4', '+3', '+4'],
            unordered: true,
          },
          note: 'かけて正・たして負 ⇒ どちらも負。$-3-4=-7,\\ (-3)(-4)=12$。',
        },
        {
          fill: {
            ask: '$(x-3)(x-4)=0$ より、解を入れよう',
            tex: 'x=\\square,\\ \\square',
            blanks: ['3', '4'],
            tiles: ['3', '4', '-3', '-4'],
            unordered: true,
          },
          note: '$x-3=0 \\Rightarrow x=3$、$x-4=0 \\Rightarrow x=4$。',
        },
      ],
      answer: 'x=3,\\ 4',
      pitfall: '「かけて正・たして負」なら2数はどちらもマイナス、と判断できると速い。',
    },
    {
      id: 'eq2-3',
      prompt: 'x^2 - 9 = 0',
      recall: {
        points: [
          '$1$次の項（$x$ の項）が無い → $x^2=$（数）にして平方根',
          '平方根をとるときは $\\pm$ を必ずつける',
        ],
        formula: { name: '平方根', tex: 'x^2=a \\ \\Rightarrow\\ x=\\pm\\sqrt{a}' },
        quiz: {
          q: '$x$ の項が無い。どう解く？',
          choices: ['$x^2=9$ にして平方根', '解の公式', 'そのままでは解けない'],
          answer: 0,
          why: '移項して $x^2=9$、平方根をとるのが最短。因数分解 $ (x+3)(x-3)$ でも同じ答え。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$-9$ を移項しよう',
            tex: 'x^2=\\square',
            blanks: ['9'],
            tiles: ['9', '-9', '3', '81'],
          },
          note: '$-9$ を右辺へ移すと $+9$。',
        },
        {
          fill: {
            ask: '平方根をとろう（$\\pm$ を忘れずに）',
            tex: 'x=\\pm\\square',
            blanks: ['3'],
            tiles: ['3', '9', '81', '\\sqrt{3}'],
          },
          note: '$2$乗して $9$ になる数は $\\pm3$。マイナス側を落とさない。',
        },
      ],
      answer: 'x=\\pm 3',
      pitfall: '平方根をとるときの $\\pm$ 忘れは超頻出。解は必ず2つあると意識する。',
    },
    {
      id: 'eq2-4',
      prompt: 'x^2 + 2x - 1 = 0',
      recall: {
        points: [
          'たして $2$・かけて $-1$ の整数が無い → 因数分解できない',
          '因数分解できないときは「解の公式」。まず判別式 $b^2-4ac$ を計算',
        ],
        formula: { name: '解の公式', tex: 'x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}' },
        quiz: {
          q: 'うまい2数が無い。どうする？',
          choices: ['解の公式を使う', '因数分解を頑張る', '解は無い'],
          answer: 0,
          why: '整数で因数分解できないときは解の公式 $x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$ の出番。',
        },
      },
      steps: [
        {
          fill: {
            ask: '$a=1,\\ b=2,\\ c=-1$。判別式 $b^2-4ac$ は？',
            tex: 'b^2-4ac=\\square',
            blanks: ['8'],
            tiles: ['8', '0', '-8', '4'],
          },
          note: '$2^2-4\\cdot1\\cdot(-1)=4-(-4)=8$。$0$より大きく実数解は2つ。',
        },
        {
          fill: {
            ask: '$\\sqrt{8}$ を簡単にすると？',
            tex: '\\sqrt{8}=\\square',
            blanks: ['2\\sqrt{2}'],
            tiles: ['2\\sqrt{2}', '4\\sqrt{2}', '\\sqrt{2}', '8'],
          },
          note: '$8=4\\times2$、$\\sqrt{4}=2$ を外へ。',
        },
        {
          fill: {
            ask: '$x=\\dfrac{-2\\pm 2\\sqrt{2}}{2}$ を約分すると？',
            tex: 'x=\\square',
            blanks: ['-1\\pm\\sqrt{2}'],
            tiles: ['-1\\pm\\sqrt{2}', '-2\\pm\\sqrt{2}', '-1\\pm 2\\sqrt{2}'],
          },
          note: '分子・分母を $2$ で割る。$\\dfrac{-2}{2}=-1$、$\\dfrac{2\\sqrt2}{2}=\\sqrt2$。',
        },
      ],
      answer: 'x=-1\\pm\\sqrt{2}',
      pitfall: '約分は「分子の全部の項」を割る。$-2$ だけ割って $2\\sqrt2$ を割り忘れない。',
    },
    {
      id: 'eq2-5',
      prompt: '2x^2 - 5x + 2 = 0',
      recall: {
        points: [
          '$x^2$ の係数が $1$ でない → まず「たすき掛け」を試す',
          '入れ替えると別の式になる ＝ 空所の順番が大事',
        ],
        formula: { name: 'たすき掛け', tex: 'acx^2+(ad+bc)x+bd=(ax+b)(cx+d)' },
        quiz: {
          q: '$x^2$ の係数が $2$。まずどうする？',
          choices: ['たすき掛けで因数分解', 'いきなり解の公式', '両辺を $2$ で割る'],
          answer: 0,
          why: '$x^2$の係数が$1$でなくても、たすき掛けで因数分解できることが多い。ダメなら解の公式へ。',
        },
      },
      steps: [
        {
          fill: {
            ask: '因数分解しよう（左の空所は $2x$ 側、右は $x$ 側）',
            tex: '2x^2-5x+2=(2x\\square)(x\\square)',
            blanks: ['-1', '-2'],
            tiles: ['-1', '-2', '+1', '+2'],
          },
          note: '$(2x-1)(x-2)$：内外の積の和 $2x\\cdot(-2)+(-1)\\cdot x=-5x$。順番を入れ替えると合わない。',
        },
        {
          fill: {
            ask: '$(2x-1)(x-2)=0$ より、解を入れよう',
            tex: 'x=\\square,\\ \\square',
            blanks: ['\\tfrac{1}{2}', '2'],
            tiles: ['\\tfrac{1}{2}', '2', '1', '-\\tfrac{1}{2}'],
            unordered: true,
          },
          note: '$2x-1=0 \\Rightarrow x=\\tfrac12$、$x-2=0 \\Rightarrow x=2$。',
        },
      ],
      answer: 'x=\\tfrac{1}{2},\\ 2',
      pitfall: '$2x-1=0$ は $x=\\tfrac12$。$x=1$ にしない（係数 $2$ で割る）。',
    },
    {
      id: 'eq2-6',
      prompt: 'x^2 - 6x + 9 = 0',
      recall: {
        points: [
          'たして $-6$・かけて $9$ で「同じ数が2回」→ 完全平方',
          '完全平方 $(x-a)^2=0$ は解が1つに重なる「重解」',
        ],
        formula: { name: '完全平方', tex: 'x^2-2ax+a^2=(x-a)^2' },
        quiz: {
          q: 'たして $-6$・かけて $9$… 何か気づく？',
          choices: ['完全平方（同じ数が2回）', '解の公式しかない', '因数分解できない'],
          answer: 0,
          why: '$-3$ と $-3$ でたして $-6$・かけて $9$。$(x-3)^2$ の形になる。',
        },
      },
      steps: [
        {
          fill: {
            ask: '完全平方の形にしよう',
            tex: 'x^2-6x+9=(x\\square)^2',
            blanks: ['-3'],
            tiles: ['-3', '+3', '-9', '-6'],
          },
          note: '$(x-3)(x-3)=(x-3)^2$。$2$乗の形。',
        },
        {
          ask: '$(x-3)^2=0$ より $x$ は？',
          choices: ['$x=3$（重解）', '$x=\\pm3$', '$x=3,\\ -3$'],
          answer: 0,
          math: 'x=3',
          note: '$(x-3)^2=0$ なら $x-3=0$ のみ。解が1つに重なるので「重解」。',
        },
      ],
      answer: 'x=3',
      pitfall: '$(x-3)^2=0$ は $x=3$ ただ1つ。$\\pm$ はつかない（$x^2=9$ と混同しない）。',
    },
  ],
}

// ── 単元のつながり（前提関係）。学習マップで「どの単元の上に立つか」を可視化する。 ──
// prereqOf(id) = その単元を学ぶ前に身につけておきたい単元id。
export const PREREQ = {
  expr1: ['pn'], eq1: ['expr1'], prop: ['eq1'], data1: [],
  calc2: ['expr1'], simul: ['eq1'], lin: ['prop', 'eq1'], congr: ['angle'],
  angle: ['plane1'], prob: ['data1'], data2: ['data1'],
  expand: ['calc2'], factor: ['expand'], sqrt: ['pn'], eq2: ['factor', 'sqrt'],
  qfn0: ['eq2'], simil: ['congr'], circ: ['angle'], tri: ['sqrt'], sample: ['prob'],
  realexpr: ['expand', 'factor'], setlogic: [], qfn: ['eq2', 'qfn0'], trig: ['tri'], dataI: ['data1'],
  count: ['prob'], geomA: ['simil', 'circ'], intA: [],
  proof: ['expand'], complex: ['eq2', 'sqrt'], coordII: ['lin', 'tri'],
  trigfn: ['trig'], explog: [], diff: ['qfn'], integ: ['diff'],
  seq: [], statB: ['count', 'dataI'],
  vector: ['trig', 'coordII'], curveC: ['complex'],
  limit: ['seq'], diff3: ['diff', 'limit'], integ3: ['integ', 'diff3'],
}
export const prereqOf = (unitId) => PREREQ[unitId] ?? []

// ── 学習マップ用：分野（strand）ごとに学習順で並べる ──
const STRAND_ORDER = ['数と式', '方程式', '関数', '図形', '確率・データ', '三角比', '微分・積分', 'ベクトル', '数列']
const GRADE_RANK = { 中1: 0, 中2: 1, 中3: 2, 数I: 3, 数A: 4, 数II: 5, 数B: 6, 数C: 7, 数III: 8 }
export const strandsWithUnits = () => {
  const groups = {}
  for (const u of MATH_UNITS) (groups[u.strand] ??= []).push(u)
  return STRAND_ORDER.filter((s) => groups[s]).map((strand) => ({
    strand,
    color: groups[strand][0].color,
    units: groups[strand].slice().sort((a, b) => (GRADE_RANK[a.grade] ?? 99) - (GRADE_RANK[b.grade] ?? 99)),
  }))
}

// その単元でクリア済みの問題数。
export const unitDoneCount = (unitId, mathDone = []) =>
  (mathDone ?? []).filter((x) => x.startsWith(`${unitId}-`)).length

// ── 弱点ナビ：前提（前の単元）が足を引っ張っていないか検知する ──
export const MASTERY_OK = 70 // この正答率以上＆全クリアで「身についた」とみなす

// 単元が弱点か（問題があるのに 未クリア or 正答率不足）。準備中(total=0)は対象外。
export const unitWeak = (unitId, mathDone = [], mathMastery = {}) => {
  const total = unitCount(unitId)
  if (!total) return false
  const done = unitDoneCount(unitId, mathDone)
  const mastery = mathMastery[unitId] ?? 0
  return done < total || mastery < MASTERY_OK
}

// その単元の前提のうち、弱点になっているもの（＝先に固めるべき前の単元）。
export const weakPrereqs = (unitId, mathDone = [], mathMastery = {}) =>
  prereqOf(unitId)
    .map(unitById)
    .filter((p) => p && unitWeak(p.id, mathDone, mathMastery))

// 学習マップ上部の「復習がおすすめ」＝着手済みの単元が前提にしている弱点単元を、
// 依存している単元数の多い順に返す（多くの単元の土台になっている＝影響大）。
export const reviewSuggestions = (mathDone = [], mathMastery = {}) => {
  const started = MATH_UNITS.filter((u) => unitDoneCount(u.id, mathDone) > 0).map((u) => u.id)
  const counts = {}
  for (const id of started) {
    for (const pid of prereqOf(id)) {
      if (unitWeak(pid, mathDone, mathMastery)) counts[pid] = (counts[pid] ?? 0) + 1
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([id, dependents]) => ({ unit: unitById(id), dependents }))
    .filter((x) => x.unit)
}

// ── 派生セレクタ（純関数） ──
export const unitsByGrade = () => {
  const order = ['中1', '中2', '中3', '数I', '数A', '数II', '数B', '数C', '数III']
  const groups = {}
  for (const u of MATH_UNITS) (groups[u.grade] ??= []).push(u)
  return order
    .filter((g) => groups[g])
    .map((grade) => ({ grade, units: groups[grade] }))
}

export const problemsForUnit = (unitId) => MATH_PROBLEMS[unitId] ?? []
export const unitById = (unitId) => MATH_UNITS.find((u) => u.id === unitId) ?? null
export const unitCount = (unitId) => problemsForUnit(unitId).length
