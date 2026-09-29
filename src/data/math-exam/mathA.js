// 入試演習（大学入試）：数学Aの単元。問題の形は src/lib/mathExam.js の冒頭を参照。
// 図形の図は、問題の比・長さから座標を計算して描く（図の点・長さは問題の条件どおり）。
import { circumcenter, lerp, lineMeet, polar } from './figure-helpers.js'

// 角の二等分線：AB=6、AC=4、BC=5。
const BIS_A = [4.5, Math.sqrt(36 - 4.5 * 4.5)]
// チェバ：AF:FB=1:2、BD:DC=3:1、CE:EA=2:3。
const CEVA = { A: [2, 5], B: [0, 0], C: [8, 0] }
const CEVA_D = lerp(CEVA.B, CEVA.C, 3 / 4)
const CEVA_E = lerp(CEVA.C, CEVA.A, 2 / 5)
const CEVA_F = lerp(CEVA.A, CEVA.B, 1 / 3)
const CEVA_P = lineMeet(CEVA.A, CEVA_D, CEVA.B, CEVA_E)
// 方べき（交わる弦）：PA=4、PB=6、PC=3、PD=8。
const CHORD_A = polar(0, 0, 4, 20)
const CHORD_B = polar(0, 0, 6, 200)
const CHORD_C = polar(0, 0, 3, 110)
const CHORD_D = polar(0, 0, 8, 290)
const CHORD_O = circumcenter(CHORD_A, CHORD_B, CHORD_C)
// メネラウス：BD:DC=2:3、CE:EA=1:2。
const MEN = { A: [1, 5], B: [0, 0], C: [8, 0] }
const MEN_D = lerp(MEN.B, MEN.C, 2 / 5)
const MEN_E = lerp(MEN.C, MEN.A, 1 / 3)
const MEN_P = lineMeet(MEN.A, MEN_D, MEN.B, MEN_E)
// 方べき（接線と割線）：半径4の円、PT=6、PA=4、PB=9。
const TAN_R = 4
const TAN_D = Math.sqrt(36 + TAN_R * TAN_R)
const TAN_P = [TAN_D, 0]
const TAN_T = polar(0, 0, TAN_R, (Math.acos(TAN_R / TAN_D) * 180) / Math.PI)
const TAN_PHI = Math.asin(Math.sqrt(TAN_R * TAN_R - 2.5 * 2.5) / TAN_D) // 割線と PO のなす角
const TAN_DIR = [-Math.cos(TAN_PHI), -Math.sin(TAN_PHI)]
const TAN_A = [TAN_P[0] + 4 * TAN_DIR[0], TAN_P[1] + 4 * TAN_DIR[1]]
const TAN_B = [TAN_P[0] + 9 * TAN_DIR[0], TAN_P[1] + 9 * TAN_DIR[1]]
// 最短経路の格子：右へ5、上へ3。
const GRID = [
  ...[0, 1, 2, 3].map((y) => [[0, y], [5, y]]),
  ...[0, 1, 2, 3, 4, 5].map((x) => [[x, 0], [x, 3]]),
]

export const MATH_EXAM_MATHA = {
  patterns: {
    count: [
      { id: 'perm', title: '順列（となり合う・円順列）' },
      { id: 'comb', title: '組合せ（図形の個数・道順）' },
      { id: 'prob', title: '確率と余事象' },
      { id: 'repeat', title: '反復試行の確率' },
      { id: 'cond', title: '条件付き確率と期待値' },
    ],
    geomA: [
      { id: 'bisector', title: '角の二等分線と線分の比' },
      { id: 'center', title: '三角形の重心・内心・外心' },
      { id: 'ceva', title: 'チェバの定理・メネラウスの定理' },
      { id: 'power', title: '方べきの定理' },
      { id: 'circles', title: '2つの円と共通接線' },
    ],
    intA: [
      { id: 'divisor', title: '約数の個数と総和' },
      { id: 'gcd', title: '最大公約数と互除法' },
      { id: 'mod', title: '余りによる分類と合同式' },
      { id: 'diophantine', title: '1次不定方程式' },
      { id: 'base', title: '記数法（n進法）' },
    ],
  },
  problems: [
    // ── 場合の数と確率 ──
    {
      id: 'mx-count-01', unit: 'count', level: 'basic', pattern: 'perm', minutes: 2,
      text: '男子3人と女子2人の5人が1列に並ぶとき、女子2人がとなり合う並び方は何通りあるか。',
      parts: [{ answer: '[ア]\\ \\text{通り}' }],
      boxes: { ア: 48 },
      hints: [
        'となり合う女子2人を、1人とみなして並べる。',
        '最後に、ひとまとめにした女子2人の中の並び方をかける。',
      ],
      solution: [
        { text: '女子2人を1組にすると、男子3人と合わせて4つを並べる。', math: '4!=24' },
        { text: '女子2人の並び方は $2!=2$ 通り。', math: '24\\times2=48' },
      ],
      point: '「となり合う」はひとまとめにして並べ、まとめた中の並び方をかける。',
      pitfall: 'まとめた中の並び方（2通り）をかけ忘れない。',
    },
    {
      id: 'mx-count-02', unit: 'count', level: 'basic', pattern: 'comb', minutes: 3,
      text: '正八角形について答えなさい。',
      parts: [
        { q: '頂点のうち3つを結んでできる三角形は何個あるか。', answer: '[ア]\\ \\text{個}' },
        { q: '対角線は何本あるか。', answer: '[イ]\\ \\text{本}' },
      ],
      boxes: { ア: 56, イ: 20 },
      hints: [
        'どの3頂点も一直線上にないので、3頂点の選び方の数だけ三角形ができる。',
        '2頂点を結ぶ線分の数から、辺の数を引くと対角線の数。',
      ],
      solution: [
        { text: '三角形の個数。', math: '{}_8\\mathrm{C}_3=\\dfrac{8\\times7\\times6}{3\\times2\\times1}=56' },
        { text: '対角線の本数。', math: '{}_8\\mathrm{C}_2-8=28-8=20' },
      ],
      point: '図形の個数は「頂点をいくつ選ぶか」の組合せで数える。',
      pitfall: '対角線の数で、辺（となり合う頂点を結ぶ線分）を引き忘れない。',
    },
    {
      id: 'mx-count-03', unit: 'count', level: 'basic', pattern: 'prob', minutes: 2,
      text: '3個のさいころを同時に投げるとき、少なくとも1個は6の目が出る確率を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 91, イ: 216 },
      hints: [
        '「少なくとも1個」は、余事象「1個も6が出ない」を考える。',
        '1個も6が出ない確率は $\\left(\\dfrac56\\right)^3$。',
      ],
      solution: [
        { text: '1個も6が出ない確率は', math: '\\left(\\dfrac{5}{6}\\right)^3=\\dfrac{125}{216}' },
        { text: '余事象の確率を1から引く。', math: '1-\\dfrac{125}{216}=\\dfrac{91}{216}' },
      ],
      point: '「少なくとも〜」は余事象で考えると、場合分けがいらない。',
      pitfall: '「1個だけ6」「2個6」「3個6」を足そうとして、場合を落とさない。余事象の方が確実。',
    },
    {
      id: 'mx-count-04', unit: 'count', level: 'basic', pattern: 'repeat', minutes: 3,
      text: '1個のさいころを4回投げるとき、1の目がちょうど2回出る確率を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 25, イ: 216 },
      hints: [
        '4回のうち、どの2回で1の目が出るかの選び方は ${}_4\\mathrm{C}_2$ 通り。',
        '反復試行の確率：${}_n\\mathrm{C}_r\\,p^r(1-p)^{n-r}$。',
      ],
      solution: [
        { text: '反復試行の確率の公式にあてはめる。', math: '{}_4\\mathrm{C}_2\\left(\\dfrac{1}{6}\\right)^2\\left(\\dfrac{5}{6}\\right)^2=6\\times\\dfrac{1}{36}\\times\\dfrac{25}{36}' },
        { text: '約分する。', math: '\\dfrac{150}{1296}=\\dfrac{25}{216}' },
      ],
      point: '同じ試行のくり返しは、「何回目に起こるか」の組合せ×確率の積。',
      pitfall: '${}_4\\mathrm{C}_2$ をかけ忘れて $\\left(\\dfrac16\\right)^2\\left(\\dfrac56\\right)^2$ だけにしない。1回目と2回目に出る場合だけになってしまう。',
    },
    {
      id: 'mx-count-05', unit: 'count', level: 'standard', pattern: 'perm', minutes: 5,
      text: 'A、Bをふくむ6人が、円形のテーブルのまわりに等間隔に座る。',
      parts: [
        { q: 'AとBがとなり合う座り方は何通りあるか。', answer: '[ア]\\ \\text{通り}' },
        { q: 'AとBが向かい合う座り方は何通りあるか。', answer: '[イ]\\ \\text{通り}' },
      ],
      boxes: { ア: 48, イ: 24 },
      hints: [
        '円順列は、1人を固定して残りを並べる。$n$ 個の円順列は $(n-1)!$ 通り。',
        '向かい合う場合は、Aを固定するとBの席は1つに決まる。',
      ],
      solution: [
        { text: 'AとBを1組にすると5つの円順列で $(5-1)!=24$ 通り。AとBの並び方が2通り。', math: '24\\times2=48' },
        { text: 'Aの席を固定すると、Bは真向かいの1席。残り4人の並べ方は', math: '4!=24' },
      ],
      point: '円順列は「回転して同じになるものは1通り」と数えるので、1人を固定して考える。',
      pitfall: '円に座る並び方を $6!$ としない。回転して重なる並びを重複して数えている。',
    },
    {
      id: 'mx-count-06', unit: 'count', level: 'standard', pattern: 'comb', minutes: 5,
      text: '図のような道がある。AからBまで、右か上にだけ進んで遠回りをせずに行く道順について答えなさい。',
      figure: {
        label: '横に5区画、縦に3区画の格子状の道。左下がA、右上がB、途中の点Pは左から2区画、下から1区画の交差点',
        size: [300, 200],
        view: [-0.6, 5.6, -0.6, 3.6],
        points: { A: [0, 0], B: [5, 3], P: [2, 1] },
        labels: { A: 'sw', B: 'ne', P: 'se' },
        segments: GRID,
      },
      parts: [
        { q: '道順は全部で何通りあるか。', answer: '[ア]\\ \\text{通り}' },
        { q: '点Pを通る道順は何通りあるか。', answer: '[イ]\\ \\text{通り}' },
      ],
      boxes: { ア: 56, イ: 30 },
      hints: [
        'AからBへは、右へ5回・上へ3回の合わせて8回進む。8回のうち、どの3回で上へ進むかを選ぶ。',
        'Pを通る道順は、「AからP」と「PからB」の道順の数の積。',
      ],
      solution: [
        { text: '全部の道順。', math: '{}_8\\mathrm{C}_3=56' },
        { text: 'AからPは右2・上1で ${}_3\\mathrm{C}_1=3$ 通り、PからBは右3・上2で ${}_5\\mathrm{C}_2=10$ 通り。', math: '3\\times10=30' },
      ],
      point: '最短経路は「右と上の並べ方」＝同じものをふくむ順列（組合せ）で数える。',
      pitfall: '通る点があるときは、その点で道順を2つに分けてかけ算する。足し算にしない。',
    },
    {
      id: 'mx-count-07', unit: 'count', level: 'standard', pattern: 'cond', minutes: 6,
      text: '箱Aには当たりくじ3本とはずれくじ2本、箱Bには当たりくじ1本とはずれくじ4本が入っている。さいころを1回投げ、1か2の目が出たら箱Aから、それ以外なら箱Bから、くじを1本引く。',
      parts: [
        { q: '当たりくじを引く確率を求めなさい。', answer: '\\dfrac{[ア]}{[イ]}' },
        { q: '当たりくじを引いたとき、それが箱Aのくじである条件付き確率を求めなさい。', answer: '\\dfrac{[ウ]}{[エ]}' },
      ],
      boxes: { ア: 1, イ: 3, ウ: 3, エ: 5 },
      hints: [
        '「箱Aを選んで当たる」と「箱Bを選んで当たる」の2つの場合の確率を足す。',
        '条件付き確率 $P_{\\text{当たり}}(\\text{A})=\\dfrac{P(\\text{Aで当たり})}{P(\\text{当たり})}$。',
      ],
      solution: [
        { text: '箱Aで当たる確率は $\\dfrac{2}{6}\\times\\dfrac{3}{5}=\\dfrac{3}{15}$、箱Bで当たる確率は $\\dfrac{4}{6}\\times\\dfrac{1}{5}=\\dfrac{2}{15}$。', math: '\\dfrac{3}{15}+\\dfrac{2}{15}=\\dfrac{1}{3}' },
        { text: '条件付き確率は', math: '\\dfrac{3}{15}\\div\\dfrac{5}{15}=\\dfrac{3}{5}' },
      ],
      point: '「結果から原因の確率を求める」問題は、条件付き確率の定義に、場合ごとの確率をあてはめる。',
      pitfall: '(2) の答えは箱Aの当たりの割合 $\\dfrac35$ と同じ値になるが、これはたまたま。条件付き確率の分母は、当たりを引く確率全体。',
    },
    {
      id: 'mx-count-08', unit: 'count', level: 'standard', pattern: 'cond', minutes: 6,
      text: '1個のさいころを2回投げ、出た目の大きい方（同じ目なら、その目）を $X$ とする。$X$ の期待値を求めなさい。',
      parts: [{ answer: '\\dfrac{[ア]}{[イ]}' }],
      boxes: { ア: 161, イ: 36 },
      hints: [
        '$X\\leqq k$ となるのは、2回とも $k$ 以下のとき。確率は $\\dfrac{k^2}{36}$。',
        '$P(X=k)=P(X\\leqq k)-P(X\\leqq k-1)=\\dfrac{2k-1}{36}$。',
      ],
      solution: [
        { text: '$P(X=k)=\\dfrac{k^2-(k-1)^2}{36}=\\dfrac{2k-1}{36}$（$k=1,2,\\ldots,6$）。' },
        { text: '期待値は', math: '\\dfrac{1\\cdot1+2\\cdot3+3\\cdot5+4\\cdot7+5\\cdot9+6\\cdot11}{36}=\\dfrac{161}{36}' },
      ],
      point: '「最大値が $k$」の確率は、「$k$ 以下」の確率の差で求めると数えもれがない。',
      pitfall: '$P(X=k)$ を $\\dfrac{2}{36}$ のように一定としない。同じ目の場合もふくめて数える。',
    },

    // ── 図形の性質 ──
    {
      id: 'mx-geomA-01', unit: 'geomA', level: 'basic', pattern: 'bisector', minutes: 3,
      text: '図の $\\triangle$ABC で、AB$=6$、AC$=4$、BC$=5$ である。$\\angle$A の二等分線と辺BCの交点をDとするとき、BDとDCの長さを求めなさい。',
      figure: {
        label: 'AB=6、AC=4、BC=5の三角形ABCで、角Aの二等分線が辺BCと点Dで交わる',
        size: [280, 200],
        view: [-0.6, 5.6, -0.8, 4.6],
        points: { A: BIS_A, B: [0, 0], C: [5, 0], D: [3, 0] },
        labels: { A: 'n', B: 'sw', C: 'se', D: 's' },
        polygons: [{ pts: ['A', 'B', 'C'] }],
        segments: [['A', 'D']],
        angles: [{ at: 'A', from: 'B', to: 'D', label: '●', r: 20 }, { at: 'A', from: 'D', to: 'C', label: '●', r: 26 }],
        texts: [{ at: ['A', 'B'], text: '6', size: 11 }, { at: ['A', 'C'], text: '4', size: 11 }],
      },
      parts: [{ answer: '\\text{BD}=[ア],\\quad\\text{DC}=[イ]' }],
      boxes: { ア: 3, イ: 2 },
      hints: [
        '角の二等分線は、向かいの辺を、はさむ2辺の比に分ける：BD：DC＝AB：AC。',
        'BC$=5$ を $6:4$ に分ける。',
      ],
      solution: [
        { text: 'BD：DC＝AB：AC＝6：4＝3：2。' },
        { text: 'BCを3：2に分ける。', math: '\\text{BD}=5\\times\\dfrac{3}{5}=3,\\quad\\text{DC}=5\\times\\dfrac{2}{5}=2' },
      ],
      point: '三角形の内角の二等分線は、向かい合う辺を、角をはさむ2辺の比に内分する。',
      pitfall: 'BD：DC＝AC：AB と逆にしない。Bに近い方の線分BDは、Bの側の辺ABに対応する。',
    },
    {
      id: 'mx-geomA-02', unit: 'geomA', level: 'basic', pattern: 'center', minutes: 3,
      text: '$\\triangle$ABC について答えなさい。',
      parts: [
        { q: '重心をG、辺BCの中点をMとする。中線AM$=9$ のとき、AGの長さを求めなさい。', answer: '\\text{AG}=[ア]' },
        { q: '内心をIとする。$\\angle$A$=50^\\circ$ のとき、$\\angle$BIC を求めなさい。', answer: '\\angle\\text{BIC}=[イ]^\\circ' },
      ],
      boxes: { ア: 6, イ: 115 },
      hints: [
        '重心は中線を $2:1$ に内分する。',
        '内心は3つの内角の二等分線の交点。$\\triangle$IBC で $\\angle$IBC＋$\\angle$ICB＝$\\dfrac12(\\angle$B＋$\\angle$C$)$。',
      ],
      solution: [
        { text: 'AG：GM＝2：1 なので', math: '\\text{AG}=9\\times\\dfrac{2}{3}=6' },
        { text: '$\\angle$B＋$\\angle$C$=130^\\circ$。$\\triangle$IBC で', math: '\\angle\\text{BIC}=180^\\circ-\\dfrac{130^\\circ}{2}=115^\\circ' },
      ],
      point: '重心は中線を2：1、内心は角の二等分線の交点、外心は辺の垂直二等分線の交点。',
      pitfall: '重心の比を $1:2$ と逆にしない。頂点に近い側が $2$。',
    },
    {
      id: 'mx-geomA-03', unit: 'geomA', level: 'basic', pattern: 'ceva', minutes: 4,
      text: '図の $\\triangle$ABC で、辺AB上の点F、辺BC上の点D、辺CA上の点Eについて、線分AD、BE、CFが1点Pで交わっている。AF：FB＝1：2、BD：DC＝3：1 のとき、CE：EA を求めなさい。',
      figure: {
        label: '三角形ABCの3本の線分AD、BE、CFが1点Pで交わる図。AF:FB=1:2、BD:DC=3:1',
        size: [300, 210],
        view: [-0.6, 8.6, -0.8, 5.6],
        points: { A: CEVA.A, B: CEVA.B, C: CEVA.C, D: CEVA_D, E: CEVA_E, F: CEVA_F, P: CEVA_P },
        labels: { A: 'n', B: 'sw', C: 'se', D: 's', E: 'ne', F: 'nw', P: 'n' },
        polygons: [{ pts: ['A', 'B', 'C'] }],
        segments: [['A', 'D'], ['B', 'E'], ['C', 'F']],
      },
      parts: [{ answer: '\\text{CE}:\\text{EA}=[ア]:[イ]' }],
      boxes: { ア: 2, イ: 3 },
      hints: [
        'チェバの定理：$\\dfrac{\\text{AF}}{\\text{FB}}\\cdot\\dfrac{\\text{BD}}{\\text{DC}}\\cdot\\dfrac{\\text{CE}}{\\text{EA}}=1$。',
        '頂点A→F→B→D→C→E→A と、三角形の周をひとまわりする順に比をかける。',
      ],
      solution: [
        { text: 'チェバの定理に代入する。', math: '\\dfrac{1}{2}\\cdot\\dfrac{3}{1}\\cdot\\dfrac{\\text{CE}}{\\text{EA}}=1' },
        { text: '解く。', math: '\\dfrac{\\text{CE}}{\\text{EA}}=\\dfrac{2}{3},\\quad\\text{CE}:\\text{EA}=2:3' },
      ],
      point: 'チェバの定理は、頂点と分点を交互にたどって一周する。順番をまちがえなければ機械的に使える。',
      pitfall: '比の分母と分子の順を、たどる向きとずらさない。一周の向きをそろえる。',
    },
    {
      id: 'mx-geomA-04', unit: 'geomA', level: 'basic', pattern: 'power', minutes: 2,
      text: '図のように、円の2つの弦AB、CDが点Pで交わっている。PA$=4$、PB$=6$、PC$=3$ のとき、PDの長さを求めなさい。',
      figure: {
        label: '円の中で、弦ABと弦CDが点Pで交わる図。PAが4、PBが6、PCが3',
        size: [240, 230],
        view: [-7.6, 6.6, -8.6, 5.6],
        points: { A: CHORD_A, B: CHORD_B, C: CHORD_C, D: CHORD_D, P: [0, 0] },
        labels: { A: 'e', B: 'w', C: 'n', D: 's', P: 'se' },
        circles: [{ c: CHORD_O, through: CHORD_A }],
        segments: [['A', 'B'], ['C', 'D']],
      },
      parts: [{ answer: '\\text{PD}=[ア]' }],
      boxes: { ア: 8 },
      hints: [
        '方べきの定理：円の2つの弦が点Pで交わるとき、PA・PB＝PC・PD。',
        '$4\\times6=3\\times\\text{PD}$ を解く。',
      ],
      solution: [
        { text: '方べきの定理より', math: '\\text{PA}\\cdot\\text{PB}=\\text{PC}\\cdot\\text{PD}' },
        { text: '代入して解く。', math: '4\\times6=3\\times\\text{PD},\\quad\\text{PD}=8' },
      ],
      point: '交わる2弦では、交点から両はしまでの長さの積が等しい（相似な三角形から導ける）。',
      pitfall: 'PA・PC＝PB・PD のように組み合わせをまちがえない。同じ弦の2つの部分をかける。',
    },
    {
      id: 'mx-geomA-05', unit: 'geomA', level: 'standard', pattern: 'ceva', minutes: 6,
      text: '図の $\\triangle$ABC で、辺BCを2：3に内分する点をD、辺CAを1：2に内分する点をEとし、ADとBEの交点をPとする。AP：PD と BP：PE を求めなさい。',
      figure: {
        label: '三角形ABCで、BCを2:3に内分する点D、CAを1:2に内分する点Eをとり、ADとBEの交点をPとした図',
        size: [300, 210],
        view: [-0.6, 8.6, -0.8, 5.6],
        points: { A: MEN.A, B: MEN.B, C: MEN.C, D: MEN_D, E: MEN_E, P: MEN_P },
        labels: { A: 'n', B: 'sw', C: 'se', D: 's', E: 'ne', P: 'ne' },
        polygons: [{ pts: ['A', 'B', 'C'] }],
        segments: [['A', 'D'], ['B', 'E']],
      },
      parts: [
        { q: 'AP：PD', answer: '[ア]:[イ]' },
        { q: 'BP：PE', answer: '[ウ]:[エ]' },
      ],
      boxes: { ア: 5, イ: 1, ウ: 1, エ: 1 },
      hints: [
        '$\\triangle$ADC と直線BEにメネラウスの定理を使うと、AP：PD が求まる。',
        '$\\triangle$BCE と直線ADにメネラウスの定理を使うと、BP：PE が求まる。',
      ],
      solution: [
        { text: '$\\triangle$ADC と直線BPE で、', math: '\\dfrac{\\text{AP}}{\\text{PD}}\\cdot\\dfrac{\\text{DB}}{\\text{BC}}\\cdot\\dfrac{\\text{CE}}{\\text{EA}}=\\dfrac{\\text{AP}}{\\text{PD}}\\cdot\\dfrac{2}{5}\\cdot\\dfrac{1}{2}=1' },
        { text: 'よって AP：PD＝5：1。' },
        { text: '$\\triangle$BCE と直線APD で、', math: '\\dfrac{\\text{BP}}{\\text{PE}}\\cdot\\dfrac{\\text{EA}}{\\text{AC}}\\cdot\\dfrac{\\text{CD}}{\\text{DB}}=\\dfrac{\\text{BP}}{\\text{PE}}\\cdot\\dfrac{2}{3}\\cdot\\dfrac{3}{2}=1' },
        { text: 'よって BP：PE＝1：1。' },
      ],
      point: '交点が線分をどんな比に分けるかは、メネラウスの定理で求める。どの三角形とどの直線を使うかを図で決める。',
      pitfall: 'メネラウスの定理で、三角形の外にある点（延長線上の点）をふくむ比を落とさない。',
    },
    {
      id: 'mx-geomA-06', unit: 'geomA', level: 'standard', pattern: 'power', minutes: 4,
      text: '図のように、円の外の点Pから円に接線PTをひき（Tは接点）、Pを通る直線が円と2点A、Bで交わっている（PA＜PB）。PA$=4$、AB$=5$ のとき、PTの長さを求めなさい。',
      figure: {
        label: '円の外の点Pから、接線PTと、円と2点A、Bで交わる直線をひいた図。PAが4、ABが5',
        size: [320, 200],
        view: [-4.8, 7.8, -4.8, 4.8],
        points: { P: TAN_P, T: TAN_T, A: TAN_A, B: TAN_B },
        labels: { P: 'e', T: 'n', A: 's', B: 'sw' },
        circles: [{ c: [0, 0], r: TAN_R }],
        segments: [['P', 'T'], ['P', 'B']],
      },
      parts: [{ answer: '\\text{PT}=[ア]' }],
      boxes: { ア: 6 },
      hints: [
        '接線と割線についての方べきの定理：PT$^2$＝PA・PB。',
        'PBは PA＋AB。',
      ],
      solution: [
        { text: 'PB＝4＋5＝9。方べきの定理より', math: '\\text{PT}^2=\\text{PA}\\cdot\\text{PB}=4\\times9=36' },
        { text: 'PT$>0$ なので PT＝6。' },
      ],
      point: '接線の長さの2乗＝割線の2つの交点までの長さの積。',
      pitfall: 'PB を AB と取りちがえない。PB は Pから遠い方の交点までの長さ。',
    },
    {
      id: 'mx-geomA-07', unit: 'geomA', level: 'standard', pattern: 'circles', minutes: 5,
      text: '半径5の円Oと半径2の円O′があり、中心間の距離OO′$=9$ である。',
      parts: [
        { q: '共通外接線の、2つの接点の間の長さを求めなさい。', answer: '[ア]\\sqrt{[イ]}' },
        { q: '共通内接線の、2つの接点の間の長さを求めなさい。', answer: '[ウ]\\sqrt{[エ]}' },
      ],
      boxes: { ア: 6, イ: 2, ウ: 4, エ: 2 },
      hints: [
        '接点を結ぶ線分を平行移動して、中心を結ぶ線分を斜辺とする直角三角形をつくる。',
        '外接線では半径の差、内接線では半径の和が、その直角三角形の1辺になる。',
      ],
      solution: [
        { text: '共通外接線：直角三角形の斜辺9、1辺 $5-2=3$。', math: '\\sqrt{9^2-3^2}=\\sqrt{72}=6\\sqrt{2}' },
        { text: '共通内接線：斜辺9、1辺 $5+2=7$。', math: '\\sqrt{9^2-7^2}=\\sqrt{32}=4\\sqrt{2}' },
      ],
      point: '共通接線の長さは、接点での直角を使って三平方の定理にもちこむ。',
      pitfall: '外接線と内接線で、半径の差と和を取りちがえない。',
    },
    {
      id: 'mx-geomA-08', unit: 'geomA', level: 'standard', pattern: 'center', minutes: 4,
      text: '3辺の長さが $3,\\ 4,\\ 5$ の直角三角形について、内接円の半径 $r$ と外接円の半径 $R$ を求めなさい。',
      parts: [{ answer: 'r=[ア],\\quad R=\\dfrac{[イ]}{[ウ]}' }],
      boxes: { ア: 1, イ: 5, ウ: 2 },
      hints: [
        '内接円の半径は、面積 $S=\\dfrac12r(a+b+c)$ から求められる。',
        '直角三角形の外接円の中心は、斜辺の中点（直径に対する円周角が直角）。',
      ],
      solution: [
        { text: '面積は $\\dfrac12\\times3\\times4=6$。', math: '6=\\dfrac{1}{2}r(3+4+5),\\quad r=1' },
        { text: '斜辺が外接円の直径なので', math: 'R=\\dfrac{5}{2}' },
      ],
      point: '直角三角形では、外接円の直径＝斜辺。内接円の半径は面積から。',
      pitfall: '外接円の半径を斜辺の $5$ としない。斜辺は直径。',
    },

    // ── 整数の性質 ──
    {
      id: 'mx-intA-01', unit: 'intA', level: 'basic', pattern: 'divisor', minutes: 3,
      text: '360の正の約数について答えなさい。',
      parts: [
        { q: '正の約数の個数', answer: '[ア]\\ \\text{個}' },
        { q: '正の約数の総和', answer: '[イ]' },
      ],
      boxes: { ア: 24, イ: 1170 },
      hints: [
        '素因数分解すると $360=2^3\\times3^2\\times5$。',
        '約数の個数は（指数＋1）の積、総和は $(1+2+2^2+2^3)(1+3+3^2)(1+5)$。',
      ],
      solution: [
        { text: '個数。', math: '(3+1)(2+1)(1+1)=24' },
        { text: '総和。', math: '(1+2+4+8)(1+3+9)(1+5)=15\\times13\\times6=1170' },
      ],
      point: '約数は、素因数の指数をそれぞれ0から選ぶ組合せで表せる。',
      pitfall: '個数を指数の積 $3\\times2\\times1$ としない。指数が0の場合も選べるので、それぞれ＋1。',
    },
    {
      id: 'mx-intA-02', unit: 'intA', level: 'basic', pattern: 'gcd', minutes: 4,
      text: '1071と1029について答えなさい。',
      parts: [
        { q: 'ユークリッドの互除法で、最大公約数を求めなさい。', answer: '[ア]' },
        { q: '最小公倍数を求めなさい。', answer: '[イ]' },
      ],
      boxes: { ア: 21, イ: 52479 },
      hints: [
        '大きい方を小さい方でわった余りと、小さい方の最大公約数は、もとの2数の最大公約数に等しい。',
        '最小公倍数＝2数の積÷最大公約数。',
      ],
      solution: [
        { text: '互除法。', math: '1071=1029\\times1+42,\\quad1029=42\\times24+21,\\quad42=21\\times2' },
        { text: 'わり切れた直前の余り $21$ が最大公約数。' },
        { text: '最小公倍数。', math: '\\dfrac{1071\\times1029}{21}=1071\\times49=52479' },
      ],
      point: '互除法は、余りが0になるまで「わる数を余りでわる」をくり返す。最後にわった数が最大公約数。',
      pitfall: '最後の余り $0$ を最大公約数としない。最大公約数は、0になる直前の余り（最後のわる数）。',
    },
    {
      id: 'mx-intA-03', unit: 'intA', level: 'basic', pattern: 'base', minutes: 3,
      text: '次の問いに答えなさい。',
      parts: [
        { q: '2進法で表された $110101_{(2)}$ を10進法で表しなさい。', answer: '[ア]' },
        { q: '10進法の $25$ を3進法で表しなさい。', answer: '[イ]_{(3)}' },
      ],
      boxes: { ア: 53, イ: 221 },
      hints: [
        '2進法の各位は、右から $1,\\ 2,\\ 4,\\ 8,\\ 16,\\ 32$ の位。',
        '3進法へは、3でわった余りを下の位から順に並べる。',
      ],
      solution: [
        { text: '10進法に直す。', math: '32+16+4+1=53' },
        { text: '$25=2\\times9+2\\times3+1$ なので', math: '25=221_{(3)}' },
      ],
      point: '$n$ 進法の位は、右から $n^0,\\ n^1,\\ n^2,\\ldots$。',
      pitfall: '3進法で、余りを上から順に並べない。最初に出た余りが一の位。',
    },
    {
      id: 'mx-intA-04', unit: 'intA', level: 'basic', pattern: 'mod', minutes: 3,
      text: '$7^{100}$ を5でわった余りを求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 1 },
      hints: [
        '$7\\equiv2\\pmod5$ なので、$2^{100}$ を5でわった余りと同じ。',
        '$2^4=16\\equiv1\\pmod5$ を使う。',
      ],
      solution: [
        { text: '合同式で考える。', math: '7^{100}\\equiv2^{100}=(2^4)^{25}\\pmod5' },
        { text: '$2^4\\equiv1$ なので', math: '(2^4)^{25}\\equiv1^{25}=1' },
      ],
      point: '累乗の余りは、余りが1になる指数を見つけて、その倍数でくくる。',
      pitfall: '$7^{100}$ を計算しようとしない。余りだけを追えばよい。',
    },
    {
      id: 'mx-intA-05', unit: 'intA', level: 'standard', pattern: 'diophantine', minutes: 5,
      text: '方程式 $7x+5y=1$ の整数解をすべて求めなさい。ただし、$k$ を整数とする。',
      parts: [{ answer: 'x=5k+[ア],\\quad y=-7k-[イ]' }],
      boxes: { ア: 3, イ: 4 },
      hints: [
        'まず1組の整数解を見つける（$x=3$ のとき $5y=-20$）。',
        'もとの式から、見つけた解を代入した式を引くと、$7(x-3)=-5(y+4)$。7と5は互いに素。',
      ],
      solution: [
        { text: '$x=3,\\ y=-4$ は解の1つ。', math: '7\\times3+5\\times(-4)=1' },
        { text: '引き算する。', math: '7(x-3)+5(y+4)=0,\\quad7(x-3)=-5(y+4)' },
        { text: '7と5は互いに素なので、$x-3=5k$。このとき $y+4=-7k$。', math: 'x=5k+3,\\quad y=-7k-4' },
      ],
      point: '1次不定方程式は「特殊解を1つ見つける → 引き算 → 互いに素を使う」の3段。',
      pitfall: '$x-3$ が5の倍数になる理由（7と5が互いに素）を落とさない。',
    },
    {
      id: 'mx-intA-06', unit: 'intA', level: 'standard', pattern: 'diophantine', minutes: 5,
      text: '$11x+7y=100$ を満たす自然数の組 $(x,\\ y)$ を求めなさい。',
      parts: [{ answer: '(x,\\ y)=([ア],\\ [イ])' }],
      boxes: { ア: 4, イ: 8 },
      hints: [
        '$x,\\ y$ は自然数なので、$11x<100$ より $x$ は1から9のどれか。',
        '$100-11x$ が7の倍数になる $x$ を探す。',
      ],
      solution: [
        { text: '$7y=100-11x$ が7の倍数になる $x$ を $1\\leqq x\\leqq9$ で探すと、$x=4$ のとき $100-44=56$。' },
        { text: '$y=56\\div7=8$。ほかの $x$ ではわり切れない。', math: '(x,\\ y)=(4,\\ 8)' },
      ],
      point: '自然数解は、範囲がせまいので、係数の大きい方の文字を動かして調べるのが速い。',
      pitfall: '$y=0$ や負の数の解を答えにふくめない。自然数は1以上。',
    },
    {
      id: 'mx-intA-07', unit: 'intA', level: 'standard', pattern: 'mod', minutes: 5,
      text: '$n$ を整数とする。$n^3-n$ がいつでもわり切れる自然数のうち、最大のものを求めなさい。',
      parts: [{ answer: '[ア]' }],
      boxes: { ア: 6 },
      hints: [
        '$n^3-n=(n-1)n(n+1)$ は、連続する3つの整数の積。',
        '連続する2整数には偶数、連続する3整数には3の倍数がふくまれる。それより大きい数でいつもわり切れるかは、$n=2$ で確かめる。',
      ],
      solution: [
        { text: '$n^3-n=(n-1)n(n+1)$ は連続する3整数の積なので、2の倍数かつ3の倍数、つまり6の倍数。' },
        { text: '$n=2$ のとき $n^3-n=6$ なので、6より大きい数でいつもわり切れることはない。最大は6。' },
      ],
      point: '「いつでもわり切れる最大の数」は、①その数でわり切れることの証明と、②それ以上は無理（具体例）の2つで決まる。',
      pitfall: '$n=3$ のときの $24$ を答えにしない。$n=2$ では $6$ にしかならない。',
    },
    {
      id: 'mx-intA-08', unit: 'intA', level: 'standard', pattern: 'divisor', minutes: 5,
      text: '次の条件を満たす最小の自然数を求めなさい。',
      parts: [
        { q: '正の約数がちょうど6個', answer: '[ア]' },
        { q: '正の約数がちょうど10個', answer: '[イ]' },
      ],
      boxes: { ア: 12, イ: 48 },
      hints: [
        '約数の個数は（指数＋1）の積。6＝6×1＝3×2、10＝10×1＝5×2 と分けて、指数の組を考える。',
        '小さい数にするには、大きい指数を小さい素数（2）に使う。',
      ],
      solution: [
        { text: '6個：$p^5$ か $p^2q$。最小はそれぞれ $2^5=32$、$2^2\\times3=12$。よって12。' },
        { text: '10個：$p^9$ か $p^4q$。最小はそれぞれ $2^9=512$、$2^4\\times3=48$。よって48。' },
      ],
      point: '約数の個数の分解（積の分け方）ごとに、最小の数を比べる。',
      pitfall: '$2\\times3^2=18$ のように、大きい指数を大きい素数に使わない。$2^2\\times3=12$ の方が小さい。',
    },
  ],
}
