// 数学の各単元を「動かしてから解く」ための導入データ。
// 描画は MathVisual.jsx が kind / variant を解釈し、このファイルは
// 1単元につき「何を動かすか」「何を発見してほしいか」だけを持つ。

const range = (id, label, min, max, step, initial, valueLabel) => ({
  id, label, type: 'range', min, max, step, initial, valueLabel,
})

const options = (id, label, initial, items) => ({
  id, label, type: 'options', initial, options: items,
})

const nice = (value, digits = 2) => {
  const rounded = Number(Number(value).toFixed(digits))
  return Object.is(rounded, -0) ? '0' : String(rounded)
}

const signed = (value) => Number(value) >= 0 ? `+${nice(value)}` : nice(value)
const degree = (value) => `${value}°`
const stepLabel = (labels) => (value) => labels[value] ?? String(value)

export const MATH_INTROS = {
  pn: {
    kind: 'number', variant: 'signed-add',
    question: '足す数の符号で、数はどちらへ動く？',
    instruction: '「足す数」を左右に動かして、数直線の矢印を見よう。',
    controls: [range('b', '足す数', -6, 6, 1, 4, signed)],
    formula: ({ b }) => `-3${signed(b)}=${nice(-3 + Number(b))}`,
    insight: ({ b }) => Number(b) === 0
      ? '0を足すと、場所は変わらない。'
      : `${b > 0 ? '正の数は右' : '負の数は左'}へ${Math.abs(b)}だけ進む。`,
  },
  expr1: {
    kind: 'algebra', variant: 'groups',
    question: '文字は「まだ決めていない数」として動かせる',
    instruction: 'x の値を変えて、3(x+2) が同じまとまり3個になることを確かめよう。',
    controls: [range('x', 'x の値', 1, 5, 1, 2)],
    formula: ({ x }) => `3(x+2)=3\\times(${x}+2)=${3 * (Number(x) + 2)}`,
    insight: () => '文字のままでも、同じまとまりを3倍する構造は変わらない。',
  },
  eq1: {
    kind: 'balance', variant: 'linear',
    question: '方程式は、つり合いを保ったまま軽くする',
    instruction: '手順を進めて、左右に同じ操作をする様子を見よう。',
    controls: [range('step', '変形の手順', 0, 2, 1, 0, stepLabel(['もとの式', '両辺から3を引く', '両辺を2で割る']))],
    formula: ({ step }) => ['2x+3=9', '2x=6', 'x=3'][step],
    insight: ({ step }) => [
      '左右が同じ重さなので、天びんはつり合っている。',
      '左右から同じ3を取り除いても、つり合いは保たれる。',
      '左右を同じ2等分にすると、xが1つ分になる。',
    ][step],
  },
  prop: {
    kind: 'graph', variant: 'proportion',
    question: '比例定数は、グラフの向きと急さを決める',
    instruction: '比例・反比例を切り替え、a を動かして形の違いを比べよう。',
    controls: [
      options('mode', '関係', 'direct', [
        { value: 'direct', label: '比例' },
        { value: 'inverse', label: '反比例' },
      ]),
      range('a', '比例定数 a', -3, 3, 0.5, 1.5, nice),
    ],
    formula: ({ mode, a }) => mode === 'direct' ? `y=${nice(a)}x` : `y=\\dfrac{${nice(a)}}{x}`,
    insight: ({ mode, a }) => mode === 'direct'
      ? `a=${nice(a)} は、xが1増えたときのyの変化量。`
      : `xとyの積はいつも a=${nice(a)} になる。`,
  },
  plane1: {
    kind: 'geometry', variant: 'sector',
    question: 'おうぎ形は、円を角度の割合で切り取ったもの',
    instruction: '中心角を動かして、円周と面積の割合を見よう。',
    controls: [range('theta', '中心角', 30, 330, 15, 120, degree)],
    formula: ({ theta }) => `\\dfrac{${theta}}{360}=\\dfrac{${nice(theta / 360)}}{1}`,
    insight: ({ theta }) => `中心角が円全体の${nice(theta / 3.6)}%なので、弧と面積も同じ割合になる。`,
  },
  space1: {
    kind: 'solid', variant: 'prism',
    question: '体積は「底面が何段積み重なるか」',
    instruction: '高さを変えて、同じ底面の層が増える様子を見よう。',
    controls: [range('h', '高さ', 1, 6, 1, 3, (v) => `${v}段`)],
    formula: ({ h }) => `V=4\\times3\\times${h}=${12 * Number(h)}`,
    insight: ({ h }) => `面積12の底面が${h}段。高さに比例して体積も増える。`,
  },
  data1: {
    kind: 'data', variant: 'histogram',
    question: '同じデータでも、階級の幅で見え方が変わる',
    instruction: '階級の幅を変えて、山のまとまり方を比べよう。',
    controls: [range('width', '階級の幅', 1, 4, 1, 2)],
    formula: ({ width }) => `\\text{階級幅}=${width}`,
    insight: ({ width }) => width === 1
      ? '細かい幅では個々の凸凹がよく見える。'
      : `幅${width}では近い値がまとまり、全体の傾向が見やすくなる。`,
  },
  calc2: {
    kind: 'algebra', variant: 'combine',
    question: '同類項は、同じ種類のタイルとしてまとめられる',
    instruction: '2つ目の x の係数を変えて、x項と定数項を別々にまとめよう。',
    controls: [range('k', '2つ目の x の係数', -2, 4, 1, 3, signed)],
    formula: ({ k }) => `(2x+3)+(${nice(k)}x-1)=${nice(2 + Number(k))}x+2`,
    insight: ({ k }) => `xタイルは${2 + Number(k)}枚、1タイルは2枚。種類の違う項は混ぜない。`,
  },
  simul: {
    kind: 'graph', variant: 'intersection',
    question: '連立方程式の解は、2本の直線が出会う場所',
    instruction: '2本目の切片を動かし、交点が移る様子を見よう。',
    controls: [range('b', '2本目の切片 b', -3, 5, 0.5, 3, nice)],
    formula: ({ b }) => `\\begin{cases}y=x+1\\\\y=-x+${nice(b)}\\end{cases}`,
    insight: ({ b }) => `交点は (${nice((Number(b) - 1) / 2)}, ${nice((Number(b) + 1) / 2)})。両方の式を同時に満たす。`,
  },
  lin: {
    kind: 'graph', variant: 'line',
    question: '傾きは、右へ1進んだときの上下の動き',
    instruction: '傾きを動かして、直線の向きと急さを見よう。',
    controls: [range('a', '傾き a', -3, 3, 0.5, 1, nice)],
    formula: ({ a }) => `y=${nice(a)}x+1`,
    insight: ({ a }) => Number(a) === 0
      ? '傾き0では、xが変わってもyは変わらない。'
      : `右へ1進むと、${a > 0 ? '上' : '下'}へ${Math.abs(a)}動く。`,
  },
  angle: {
    kind: 'geometry', variant: 'angles',
    question: '平行線では、同じ角と180°になる角が連鎖する',
    instruction: '1つの角を動かして、対応する角を追いかけよう。',
    controls: [range('theta', '基準の角', 25, 155, 5, 55, degree)],
    formula: ({ theta }) => `${theta}^\\circ+${180 - Number(theta)}^\\circ=180^\\circ`,
    insight: ({ theta }) => `同位角・錯角は${theta}°、隣り合う角は${180 - Number(theta)}°になる。`,
  },
  congr: {
    kind: 'geometry', variant: 'congruence',
    question: '合同は、動かして重ねても形と大きさが同じ',
    instruction: 'コピーを移動して、元の三角形へぴったり重ねよう。',
    controls: [range('slide', '重ねる', 0, 100, 5, 0, (v) => `${v}%`)],
    formula: () => '\\triangle ABC\\equiv\\triangle DEF',
    insight: ({ slide }) => Number(slide) >= 95
      ? '位置や向きが違っても、重なれば対応する辺と角はすべて等しい。'
      : '同じ三辺を保ったまま移動しているので、形と大きさは変わらない。',
  },
  prob: {
    kind: 'probability', variant: 'die',
    question: '確率は「同様に確からしい結果」のうち何個か',
    instruction: '「この数以下」を動かし、有利な目の数を数えよう。',
    controls: [range('favorable', 'この数以下', 1, 6, 1, 3)],
    formula: ({ favorable }) => `P=\\dfrac{${favorable}}{6}=${nice(favorable / 6)}`,
    insight: ({ favorable }) => `6通りの目のうち、条件に合うのは${favorable}通り。`,
  },
  data2: {
    kind: 'data', variant: 'boxplot',
    question: '箱ひげ図は、並べたデータの「位置」を5点でつかむ',
    instruction: '最大値を動かして、箱とひげの変化を観察しよう。',
    controls: [range('outlier', '最大値', 12, 30, 1, 18)],
    formula: ({ outlier }) => `\\min=2,\\ Q_1=5,\\ Q_2=7,\\ Q_3=9,\\ \\max=${outlier}`,
    insight: ({ outlier }) => Number(outlier) > 20
      ? '最大値が遠くへ動いても、中央50%を表す箱は変わりにくい。'
      : '箱は中央50%の広がり、ひげは端までの広がりを表す。',
  },
  expand: {
    kind: 'algebra', variant: 'expand',
    question: '展開は、大きな長方形を4つの面積へ分けること',
    instruction: 'a と b を動かし、4つの部分の面積を足そう。',
    controls: [
      range('a', '横に足す a', 1, 4, 1, 2),
      range('b', '縦に足す b', 1, 4, 1, 3),
    ],
    formula: ({ a, b }) => `(x+${a})(x+${b})=x^2+${Number(a) + Number(b)}x+${Number(a) * Number(b)}`,
    insight: ({ a, b }) => `中央の係数は${a}+${b}=${Number(a) + Number(b)}、定数は${a}×${b}=${Number(a) * Number(b)}。`,
  },
  factor: {
    kind: 'algebra', variant: 'factor',
    question: '因数分解は、ばらばらの面積を長方形へ戻すこと',
    instruction: '共通の辺 m を動かし、共通因数としてくくる様子を見よう。',
    controls: [range('m', '共通の辺 m', 1, 5, 1, 3)],
    formula: ({ m }) => `${m}x+${2 * Number(m)}=${m}(x+2)`,
    insight: ({ m }) => `2つの項に共通する${m}を辺として外へ出すと、1つの長方形になる。`,
  },
  sqrt: {
    kind: 'number', variant: 'square-root',
    question: '平方根は、面積から正方形の一辺を逆算した数',
    instruction: '面積を変えて、一辺 √n の長さを比べよう。',
    controls: [range('n', '正方形の面積 n', 1, 16, 1, 8)],
    formula: ({ n }) => `(\\sqrt{${n}})^2=${n}`,
    insight: ({ n }) => Number.isInteger(Math.sqrt(Number(n)))
      ? `${n}は平方数なので、一辺はちょうど${Math.sqrt(Number(n))}。`
      : `√${n}は${Math.floor(Math.sqrt(Number(n)))}と${Math.ceil(Math.sqrt(Number(n)))}の間にある。`,
  },
  eq2: {
    kind: 'graph', variant: 'quadratic-roots',
    question: '二次方程式の実数解は、放物線とx軸の交点',
    instruction: '定数 c を動かし、交点の個数を見よう。',
    controls: [range('c', '定数 c', -4, 4, 0.5, -2, nice)],
    formula: ({ c }) => `x^2${signed(c)}=0`,
    insight: ({ c }) => Number(c) < 0
      ? `x軸と2点で交わり、実数解は x=±${nice(Math.sqrt(-Number(c)))}。`
      : Number(c) === 0
        ? 'x軸に1点で接し、重解 x=0 をもつ。'
        : 'x軸と交わらないので、実数解はない。',
  },
  qfn0: {
    kind: 'graph', variant: 'parabola',
    question: 'a は、放物線の向きと開き方を決める',
    instruction: 'a を動かして y=ax² の形を比べよう。',
    controls: [range('a', '係数 a', -2, 2, 0.25, 1, nice)],
    formula: ({ a }) => `y=${nice(a)}x^2`,
    insight: ({ a }) => Number(a) === 0
      ? 'a=0では二次関数ではなく、x軸そのものになる。'
      : `${a > 0 ? '上' : '下'}に開き、|a|が大きいほど細くなる。`,
  },
  simil: {
    kind: 'geometry', variant: 'similarity',
    question: '相似では、長さは同じ倍率、角度はそのまま',
    instruction: '拡大率 k を動かして、対応する辺を比べよう。',
    controls: [range('k', '拡大率 k', 0.5, 2, 0.1, 1.5, (v) => `${nice(v)}倍`)],
    formula: ({ k }) => `3:4:5=${nice(3 * k)}:${nice(4 * k)}:${nice(5 * k)}`,
    insight: ({ k }) => `すべての辺を${nice(k)}倍しても、3つの角は変わらない。`,
  },
  circ: {
    kind: 'geometry', variant: 'circle-angle',
    question: '同じ弧を見る円周角は、頂点を動かしても同じ',
    instruction: '円周上の点Pを動かし、∠APBを見比べよう。',
    controls: [range('theta', '点Pの位置', 35, 145, 5, 85, degree)],
    formula: () => '\\angle APB=\\dfrac{1}{2}\\angle AOB',
    insight: () => '頂点Pが円周上を動いても、同じ弧ABを見る円周角は一定になる。',
  },
  tri: {
    kind: 'geometry', variant: 'pythagorean',
    question: '直角三角形では、2つの正方形の面積が1つに合わさる',
    instruction: '縦の辺 b を動かし、3辺の平方を比べよう。',
    controls: [range('b', '縦の辺 b', 2, 6, 1, 4)],
    formula: ({ b }) => {
      const total = 9 + Number(b) ** 2
      const root = Math.sqrt(total)
      return Number.isInteger(root)
        ? `3^2+${b}^2=${total}=${root}^2`
        : `3^2+${b}^2=${total}=(\\sqrt{${total}})^2`
    },
    insight: ({ b }) => `斜辺の長さは√${9 + Number(b) ** 2}。長さではなく「平方」を足す。`,
  },
  sample: {
    kind: 'data', variant: 'sample',
    question: '標本が大きいほど、母集団の姿を安定して推測できる',
    instruction: '標本サイズを増やし、推定のぶれ幅を見よう。',
    controls: [range('n', '標本サイズ n', 5, 50, 5, 10)],
    formula: ({ n }) => `\\text{ぶれの目安}\\propto\\dfrac{1}{\\sqrt{${n}}}`,
    insight: ({ n }) => `n=${n}では推定の帯の幅は約${nice(100 / Math.sqrt(Number(n)), 1)}。数を増やすほど狭くなる。`,
  },
  realexpr: {
    kind: 'number', variant: 'absolute',
    question: '絶対値は、0からの距離だから負にならない',
    instruction: 'x を左右へ動かし、0からの距離を見よう。',
    controls: [range('x', 'x の位置', -6, 6, 1, -4, nice)],
    formula: ({ x }) => `|${nice(x)}|=${Math.abs(Number(x))}`,
    insight: ({ x }) => `x=${x}は0から${Math.abs(Number(x))}離れている。向きは捨てて距離だけを見る。`,
  },
  setlogic: {
    kind: 'set', variant: 'implication',
    question: '十分条件は、条件の集合が結論の集合に入ること',
    instruction: '命題の状態を切り替え、集合の包含関係で見よう。',
    controls: [options('case', '命題', 'sufficient', [
      { value: 'sufficient', label: '十分条件' },
      { value: 'necessary', label: '必要条件' },
      { value: 'equivalent', label: '必要十分' },
    ])],
    formula: ({ case: mode }) => mode === 'sufficient'
      ? 'P\\subset Q\\Rightarrow(P\\Rightarrow Q)'
      : mode === 'necessary'
        ? 'Q\\subset P\\Rightarrow(P\\Leftarrow Q)'
        : 'P=Q\\Rightarrow(P\\Leftrightarrow Q)',
    insight: ({ case: mode }) => ({
      sufficient: 'Pを満たす点がすべてQの内側なら、PはQの十分条件。',
      necessary: 'Qを満たすにはPの内側にいる必要があるので、PはQの必要条件。',
      equivalent: '2つの集合が一致すると、どちら向きの命題も成り立つ。',
    })[mode],
  },
  qfn: {
    kind: 'graph', variant: 'vertex',
    question: '平方完成すると、放物線の頂点がそのまま読める',
    instruction: 'h を動かして、式と頂点の横移動を結びつけよう。',
    controls: [range('h', 'h の値', -3, 3, 0.5, 1.5, nice)],
    formula: ({ h }) => `y=(x${Number(h) >= 0 ? `-${nice(h)}` : `+${nice(-Number(h))}`})^2-2`,
    insight: ({ h }) => `頂点は (${nice(h)}, -2)。式の (x-h) と横位置の符号に注意。`,
  },
  trig: {
    kind: 'geometry', variant: 'trig',
    question: 'sin・cos・tan は、直角三角形の辺の比',
    instruction: '角度を動かし、3つの比がどう変わるか見よう。',
    controls: [range('theta', '角度 θ', 10, 80, 5, 35, degree)],
    formula: ({ theta }) => `\\sin${theta}^\\circ=${nice(Math.sin(theta * Math.PI / 180))},\\quad\\cos${theta}^\\circ=${nice(Math.cos(theta * Math.PI / 180))}`,
    insight: ({ theta }) => `斜辺を1とすると、横がcos=${nice(Math.cos(theta * Math.PI / 180))}、縦がsin=${nice(Math.sin(theta * Math.PI / 180))}。`,
  },
  dataI: {
    kind: 'data', variant: 'correlation',
    question: '相関係数は、点の並びが直線にどれだけ近いか',
    instruction: '相関の強さを動かし、散布図のまとまりを見よう。',
    controls: [range('strength', '相関の強さ', -100, 100, 10, 70, (v) => nice(v / 100))],
    formula: ({ strength }) => `r\\approx${nice(strength / 100)}`,
    insight: ({ strength }) => Math.abs(Number(strength)) < 20
      ? '点が一定の向きに並ばず、直線的な関係は弱い。'
      : `${strength > 0 ? '右上がり' : '右下がり'}にまとまり、|r|が1に近いほど強い相関。`,
  },
  count: {
    kind: 'probability', variant: 'tree',
    question: '場合の数は、選択肢を枝分かれさせると漏れなく数えられる',
    instruction: '色の選択肢を増やし、2段の樹形図の葉を数えよう。',
    controls: [range('n', '1段目の選択肢', 2, 5, 1, 3)],
    formula: ({ n }) => `${n}\\times2=${2 * Number(n)}`,
    insight: ({ n }) => `1段目が${n}通り、その先が各2通りなので、葉は${2 * Number(n)}個。`,
  },
  geomA: {
    kind: 'geometry', variant: 'cevian',
    question: '三角形の比は、点を動かすと線分の分け方として見える',
    instruction: '辺上の点Dを動かし、AD:DB と面積比を比べよう。',
    controls: [range('t', 'AD の割合', 0.2, 0.8, 0.1, 0.4, (v) => `${nice(v * 100)}%`)],
    formula: ({ t }) => `AD:DB=${nice(t)}:${nice(1 - Number(t))}`,
    insight: ({ t }) => `高さが共通なので、2つの三角形の面積比も ${nice(t)}:${nice(1 - Number(t))}。`,
  },
  intA: {
    kind: 'integer', variant: 'euclid',
    question: '最大公約数は、余りへ置き換えても変わらない',
    instruction: '互除法の手順を進め、数が小さくなる流れを見よう。',
    controls: [range('step', '互除法の手順', 0, 3, 1, 0, stepLabel(['開始', '1回目', '2回目', '3回目']))],
    formula: ({ step }) => [
      '\\gcd(1071,462)',
      '1071=462\\times2+147',
      '462=147\\times3+21',
      '147=21\\times7+0',
    ][step],
    insight: ({ step }) => [
      '大きい2数から始める。',
      '最大公約数は gcd(462,147) と同じ。',
      '最大公約数は gcd(147,21) と同じ。',
      '余りが0になったので、最後の0でない余り21が最大公約数。',
    ][step],
  },
  proof: {
    kind: 'algebra', variant: 'binomial',
    question: '二項展開の係数は、パスカルの三角形に並んでいる',
    instruction: '次数 n を動かし、係数の並びを見よう。',
    controls: [range('n', '次数 n', 2, 6, 1, 4)],
    formula: ({ n }) => `(a+b)^{${n}}=\\sum_{k=0}^{${n}}{}_{${n}}C_k a^{${n}-k}b^k`,
    insight: ({ n }) => `n=${n}の係数は、上の段で隣り合う2数を足してできる。`,
  },
  complex: {
    kind: 'complex', variant: 'rotation',
    question: '複素数に i を掛けることは、平面上で90°回転すること',
    instruction: 'i を掛ける回数を進め、点の回転を追おう。',
    controls: [range('turn', 'i を掛ける回数', 0, 4, 1, 1, (v) => `${v}回`)],
    formula: ({ turn }) => `1\\times i^{${turn}}=${['1', 'i', '-1', '-i', '1'][turn]}`,
    insight: ({ turn }) => `${turn}回で${turn * 90}°回転。4回で元の位置へ戻る。`,
  },
  coordII: {
    kind: 'geometry', variant: 'circle-equation',
    question: '円の方程式は、中心からの距離が一定という意味',
    instruction: '半径 r を動かし、円周上の点までの距離を見よう。',
    controls: [range('r', '半径 r', 1, 4, 0.5, 2.5, nice)],
    formula: ({ r }) => `(x-1)^2+(y+1)^2=${nice(Number(r) ** 2)}`,
    insight: ({ r }) => `中心(1,-1)から円周までの距離は、どの方向でも${nice(r)}。`,
  },
  trigfn: {
    kind: 'trig-wave', variant: 'unit-circle',
    question: '三角関数の波は、円周上の高さを横へ記録したもの',
    instruction: '角度を1周動かして、円の高さとsinの波を結びつけよう。',
    controls: [range('theta', '角度 θ', 0, 360, 5, 60, degree)],
    formula: ({ theta }) => `\\sin${theta}^\\circ=${nice(Math.sin(theta * Math.PI / 180))}`,
    insight: ({ theta }) => `円周上の点の高さ ${nice(Math.sin(theta * Math.PI / 180))} が、波の同じ位置の値になる。`,
  },
  explog: {
    kind: 'graph', variant: 'exp-log',
    question: '指数関数と対数関数は、xとyを入れ替えた逆関数',
    instruction: '底を切り替え、2つのグラフが y=x に対称なことを見よう。',
    controls: [options('base', '底 a', 2, [
      { value: 0.5, label: '1/2' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
    ])],
    formula: ({ base }) => `y=${nice(base)}^x\\quad\\Longleftrightarrow\\quad y=\\log_{${nice(base)}}x`,
    insight: ({ base }) => Number(base) > 1
      ? '底が1より大きいと、指数も対数も右上がり。2つは y=x に線対称。'
      : '底が0と1の間では、指数も対数も右下がり。2つは y=x に線対称。',
  },
  diff: {
    kind: 'calculus', variant: 'derivative',
    question: '微分係数は、曲線に触れる直線の傾き',
    instruction: '接点 x を動かし、接線の傾きを見よう。',
    controls: [range('x', '接点 x', -2.5, 2.5, 0.25, 1, nice)],
    formula: ({ x }) => `f(x)=x^2,\\quad f'(${nice(x)})=${nice(2 * Number(x))}`,
    insight: ({ x }) => `x=${nice(x)}での接線の傾きは${nice(2 * Number(x))}。左・頂点・右で符号が変わる。`,
  },
  integ: {
    kind: 'calculus', variant: 'integral',
    question: '定積分は、細い短冊を足した面積',
    instruction: '右端 b を動かし、塗られる面積を増減させよう。',
    controls: [range('b', '右端 b', 0.5, 3, 0.25, 2, nice)],
    formula: ({ b }) => `\\int_0^{${nice(b)}}x\\,dx=${nice(Number(b) ** 2 / 2)}`,
    insight: ({ b }) => `0から${nice(b)}までの短冊を合計すると、三角形の面積${nice(Number(b) ** 2 / 2)}になる。`,
  },
  seq: {
    kind: 'sequence', variant: 'arithmetic',
    question: '等差数列は、同じ差を繰り返して伸びる',
    instruction: '公差 d を動かし、項の並びとグラフを見よう。',
    controls: [range('d', '公差 d', -2, 4, 1, 2, signed)],
    formula: ({ d }) => `a_n=3+(n-1)\\times${nice(d)}`,
    insight: ({ d }) => Number(d) === 0
      ? '公差0なら、すべての項が同じ。'
      : `隣り合う項は毎回${Math.abs(d)}ずつ${d > 0 ? '増える' : '減る'}。`,
  },
  statB: {
    kind: 'data', variant: 'normal',
    question: '標本数が増えると、推定区間は狭くなる',
    instruction: '標本数 n を増やし、平均の信頼区間を見よう。',
    controls: [range('n', '標本数 n', 10, 100, 10, 30)],
    formula: ({ n }) => `\\text{標準誤差}\\propto\\dfrac{1}{\\sqrt{${n}}}`,
    insight: ({ n }) => `n=${n}の区間幅は n=10 の約${nice(Math.sqrt(10 / Number(n)) * 100, 0)}%。`,
  },
  vector: {
    kind: 'vector', variant: 'addition',
    question: 'ベクトルの和は、矢印をつないだ到着点',
    instruction: '2本目の向きを動かし、平行四辺形の対角線を見よう。',
    controls: [range('theta', 'ベクトル b の向き', 0, 180, 10, 60, degree)],
    formula: ({ theta }) => `\\vec a+\\vec b,\\quad |\\vec a|=3,\\ |\\vec b|=2,\\ \\theta=${theta}^\\circ`,
    insight: ({ theta }) => `bをaの先へ平行移動すると、始点から終点への矢印が a+b。`,
  },
  curveC: {
    kind: 'geometry', variant: 'conic',
    question: '二次曲線は、焦点までの距離の条件で姿が変わる',
    instruction: '離心率 e を動かし、楕円・放物線・双曲線の境目を見よう。',
    controls: [range('e', '離心率 e', 0.4, 1.6, 0.1, 0.7, nice)],
    formula: ({ e }) => `e=${nice(e)}\\quad(${e < 1 ? '\\text{楕円}' : e > 1 ? '\\text{双曲線}' : '\\text{放物線}'})`,
    insight: ({ e }) => Number(e) < 1
      ? 'e<1では閉じた楕円になる。'
      : Number(e) > 1
        ? 'e>1では2つに分かれた双曲線になる。'
        : 'e=1が楕円と双曲線の境目で、放物線になる。',
  },
  limit: {
    kind: 'number', variant: 'limit',
    question: '極限は、到達するかではなく「いくらでも近づけるか」',
    instruction: '近づく段階を進め、穴のある関数の値を追おう。',
    controls: [range('level', 'xを1へ近づける', 0, 4, 1, 1, stepLabel(['1桁', '2桁', '3桁', '4桁', '5桁']))],
    formula: ({ level }) => `x=${nice(1 + 10 ** -(Number(level) + 1), 5)},\\quad\\dfrac{x^2-1}{x-1}=${nice(2 + 10 ** -(Number(level) + 1), 5)}`,
    insight: ({ level }) => `x=1では式が未定義でも、値は2との差を${nice(10 ** -(Number(level) + 1), 5)}まで小さくできる。`,
  },
  diff3: {
    kind: 'calculus', variant: 'derivative3',
    question: '1階微分は増減、2階微分は曲がり方を読む',
    instruction: '接点 x を動かし、傾きと凹凸を同時に見よう。',
    controls: [range('x', '接点 x', -2, 2, 0.25, -1, nice)],
    formula: ({ x }) => `f=x^3-3x,\\ f'=${nice(3 * Number(x) ** 2 - 3)},\\ f''=${nice(6 * Number(x))}`,
    insight: ({ x }) => `傾きは${nice(3 * Number(x) ** 2 - 3)}、曲がり方は${Number(x) < 0 ? '上に凸' : Number(x) > 0 ? '下に凸' : '切り替わる点'}。`,
  },
  integ3: {
    kind: 'solid', variant: 'revolution',
    question: '回転体の体積は、円盤の面積を積み重ねる',
    instruction: '右端 b を動かし、回転してできる円盤の集まりを見よう。',
    controls: [range('b', '積み重ねる範囲 b', 0.5, 3, 0.25, 2, nice)],
    formula: ({ b }) => `V=\\pi\\int_0^{${nice(b)}}x^2dx=${nice(Number(b) ** 3 / 3)}\\pi`,
    insight: ({ b }) => `半径y=xの円盤を0から${nice(b)}まで積む。上ほど円盤が大きい。`,
  },
}

export const introForUnit = (unitId) => MATH_INTROS[unitId] ?? null
