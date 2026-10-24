// 数学の歴史をたどるコース：第1部「算数の基本」のうち、変化と関係の話。話の形は basic-number.js の冒頭を参照。
import { approxTex, approxText, gcd, nice, options, range } from './controls.js'

// 速さの話で比べる乗り物（時速 km）。
export const SPEED_VEHICLES = {
  walk: { label: '歩く', speed: 4 },
  run: { label: '走る', speed: 10 },
  bike: { label: '自転車', speed: 15 },
  car: { label: '自動車', speed: 60 },
}

// 比例の話のばね（おもり1こあたりののび cm）。
export const SPRINGS = {
  soft: { label: 'やわらかいばね', stretch: 3 },
  hard: { label: 'かたいばね', stretch: 1 },
}

export const MATH_HISTORY_BASIC_CHANGE = [
  {
    id: 'mh-ratio',
    part: 'basic',
    theme: '変化と関係',
    emoji: '⚙️',
    title: '比と縮図',
    headline: '「何対何」で比べる——歯車と地図の縮尺',
    era: '紀元前4世紀（比の理論）・1800年（全国の測量）',
    year: -350,
    place: 'ギリシャ・日本',
    people: ['エウドクソス', '伊能忠敬（いのうただたか）'],
    question: '大きさのちがう2つのものを、どうすれば正しく比べたり、縮めたりできるのか？',
    story: [
      '比は、2つの量を「何対何」で比べる表し方だ。$3:2$ のように書き、両方に同じ数をかけても、同じ数でわっても、比は変わらない（$6:4$ も $3:2$ と同じ）。',
      'ギリシャでは紀元前4世紀に、エウドクソスが比の理論を作り、ユークリッドの『原論』第5巻にまとめられた。わり切れない長さどうしの比まで正しく扱える考え方だった。',
      '1901年、ギリシャのアンティキティラ島の近くの沈没船から、たくさんの歯車を組み合わせた青銅の機械が見つかった。紀元前2〜1世紀ごろに作られたと考えられ、歯の数の比を使って、太陽や月の動きを計算していたとみられている。',
      '江戸時代の伊能忠敬（いのうただたか）は、1800年から全国を歩いて測量した。その測量をもとに、実際の長さを36000分の1などに縮めた地図が作られた。形を変えずに縮めた図（縮図）では、どの長さも同じ比で縮まるので、地図の上の長さから本当の距離が分かる。',
    ],
    visual: {
      scene: 'gears',
      instruction: '2つの歯車の歯の数を変え、左の歯車を回して、右の歯車が何回転するかを見よう。',
      controls: [
        range('a', '左の歯車の歯の数', 12, 36, 6, 36),
        range('b', '右の歯車の歯の数', 12, 36, 6, 12),
        range('turn', '左の歯車を回す', 0, 8, 1, 4, (value) => `${nice(Number(value) / 4, 2)}回転`),
      ],
      formula: ({ a, b }) => {
        const g = gcd(a, b)
        return g > 1 ? `${a}:${b}=${Number(a) / g}:${Number(b) / g}` : `${a}:${b}`
      },
      insight: ({ a, b, turn }) => {
        const A = Number(a)
        const B = Number(b)
        const g = gcd(A, B)
        const left = Number(turn) / 4
        const right = (left * A) / B
        const about = approxText(right) === '=' ? '' : '約'
        return `歯の数の比は ${A}:${B}＝${A / g}:${B / g}。左の歯車が${nice(left, 2)}回転すると、かみ合う歯は${nice(left * A, 1)}こ分進むので、右の歯車は${about}${nice(right, 2)}回転する。`
      },
    },
    uses: [
      { emoji: '🗾', title: '地図の縮尺', text: '縮尺2万5000分の1の地図では、地図の上の4cmが、実際には $4\\times25000=100000$ cm＝1kmになる。' },
      { emoji: '🚲', title: '自転車のギア', text: 'ペダル側の歯車と後輪側の歯車の歯の数の比で、ペダル1回転で後輪が何回転するかが決まる。' },
      { emoji: '🍳', title: '料理の分量', text: '2人分のレシピを5人分にするときは、材料をすべて同じ比（$\\frac{5}{2}$ 倍）でふやす。' },
    ],
    units: ['simil'],
    basics: ['b-ratio', 'b-scale'],
  },
  {
    id: 'mh-percent',
    part: 'basic',
    theme: '変化と関係',
    emoji: '💯',
    title: '割合と百分率',
    headline: '「100あたりいくつ」で比べる',
    era: '紀元前後（ローマ）・15世紀（イタリア）',
    year: 1450,
    place: 'ローマ・イタリア',
    people: ['アウグストゥス'],
    question: '全体の大きさがちがうものどうしを、どうすれば公平に比べられるか？',
    story: [
      '割合は、もとにする量を1としたとき、比べる量がどれだけにあたるかを表す数だ。割合＝比べる量÷もとにする量。40人中30人なら $30\\div40=0.75$。',
      '100あたりで表すと、ちがう大きさのものも比べやすい。ローマの初代皇帝アウグストゥスは、競売で売れたものに、その値段の100分の1の税をかけた。',
      '15世紀のイタリアの商人たちは、「100につき」を表す per cento という言葉で、利息や利益を表した。今の「パーセント（%）」はこの言葉から来ていて、記号の % も、この言葉を略して書いた形から生まれたと考えられている。',
      '割合は小数・百分率・歩合で言いかえられる。0.75＝75%＝7割5分。',
    ],
    visual: {
      scene: 'percent-grid',
      instruction: '割合と値段を変えて、100のます目のうち何こ分かと、割り引いた値段を確かめよう。',
      controls: [
        range('p', '割合（%）', 0, 100, 5, 30, (value) => `${value}%`),
        options('price', '定価', 2000, [1000, 2000, 5000].map((value) => ({ value, label: `${value}円` }))),
      ],
      formula: ({ p, price }) => {
        const part = (Number(price) * Number(p)) / 100
        return `${price}\\times\\frac{${p}}{100}=${part}`
      },
      insight: ({ p, price }) => {
        const part = (Number(price) * Number(p)) / 100
        return `${price}円の${p}%は${part}円。${p}%引きなら、${price}−${part}＝${Number(price) - part}円になる。`
      },
    },
    uses: [
      { emoji: '🧾', title: '消費税', text: '税率10%なら、1000円の品物の税は $1000\\times0.1=100$ 円。' },
      { emoji: '☔', title: '降水確率', text: '天気予報の「降水確率30%」は、同じような予報が100回出たら、そのうち約30回は1mm以上の雨が降る、という意味。' },
      { emoji: '🏷️', title: 'セールの値段', text: '2000円の30%引きは、$2000\\times(1-0.3)=1400$ 円。「何%引き」は、残りの割合をかけても求められる。' },
    ],
    units: [],
    basics: ['b-percent'],
  },
  {
    id: 'mh-speed',
    part: 'basic',
    theme: '変化と関係',
    emoji: '💡',
    title: '速さと単位量あたり',
    headline: '1時間あたりに進む道のり——光の速さをはかった話',
    era: '1676年',
    year: 1676,
    place: 'フランス（パリ天文台）',
    people: ['レーマー', 'ホイヘンス'],
    question: '一瞬で届くように見える光に、速さはあるのか？ あるなら、どうはかるのか？',
    story: [
      '速さは、1時間あたり・1秒あたりに進む道のりで表す。速さ＝道のり÷時間。人口密度（1km²あたりの人数）や1個あたりの値段も、同じ「単位量あたり」の考え方だ。',
      '光はとても速く、昔は一瞬で届くと考える人も多かった。1676年、パリ天文台にいたデンマークのレーマーは、木星の月イオが木星のかげに入る時刻が、地球と木星がはなれているときほど遅れて見えることに気づいた。',
      '遅れるのは、光が遠い道のりを進むのに時間がかかるからだ。レーマーは、光が地球の通り道の直径を横切るのに約22分かかると考えた。オランダのホイヘンスはこれをもとに、光の速さを秒速20万kmあまりと計算した。',
      '今知られている値は秒速約30万km。太陽の光が地球に届くまでには、約8分20秒かかる。',
    ],
    visual: {
      scene: 'speed-graph',
      instruction: '乗り物と時間を変えて、進む道のりと、時間と道のりのグラフを見よう。',
      controls: [
        options('vehicle', '乗り物', 'bike', Object.entries(SPEED_VEHICLES).map(([value, meta]) => ({ value, label: meta.label }))),
        range('t', '時間（分）', 0, 60, 5, 30, (value) => `${value}分`),
      ],
      formula: ({ vehicle, t }) => {
        const { speed } = SPEED_VEHICLES[vehicle]
        return `${speed}\\times\\frac{${t}}{60}=${nice((speed * Number(t)) / 60, 2)}\\ (\\text{km})`
      },
      insight: ({ vehicle, t }) => {
        const { label: name, speed } = SPEED_VEHICLES[vehicle]
        const distance = nice((speed * Number(t)) / 60, 2)
        return Number(t)
          ? `${name}（時速${speed}km）で${t}分進むと${distance}km。時間が2倍になると、道のりも2倍（道のりは時間に比例する）。`
          : '0分では、まだ進んでいない。どの乗り物のグラフも0から始まる直線で、速いほど傾きが急になる。'
      },
    },
    uses: [
      { emoji: '🛰️', title: 'GPSの位置', text: '人工衛星からの電波が届くまでの時間に、電波の速さ（光と同じ）をかけて距離を出し、今いる場所を求めている。' },
      { emoji: '🏙️', title: '人口密度', text: '人口を面積でわると、1km²あたりの人数になる。広さのちがう町どうしの混み具合を比べられる。' },
      { emoji: '🚅', title: '乗り物の時刻表', text: '平均の速さが分かれば、道のりから、かかる時間の見当がつく。' },
    ],
    units: ['lin', 'prop'],
    basics: ['b-per-unit', 'b-change'],
  },
  {
    id: 'mh-hooke',
    part: 'basic',
    theme: '変化と関係',
    emoji: '🪝',
    title: '比例',
    headline: 'ばねののびは、おもりの重さに比例する',
    era: '1676年・1678年',
    year: 1678,
    place: 'イギリス',
    people: ['ロバート・フック'],
    question: 'ばねは、つるすおもりの重さによって、どれだけのびるのか？',
    story: [
      '2つの量があって、一方が2倍・3倍になると、もう一方も2倍・3倍になるとき、2つの量は比例するという。$y=ax$ の形の式で表せ、グラフは0を通る直線になる。',
      'イギリスのロバート・フックは、ばねにおもりをつるすと、ばねののびがおもりの重さに比例することを確かめた。',
      'フックは1676年、この決まりを「ceiiinosssttuv」という文字の並べかえで発表し、1678年に、ラテン語の「ut tensio, sic vis（のびるほど、力がかかっている）」の文字を並べかえたものだと明かした。',
      'ばねばかりは、この比例を使って重さをはかる道具だ。ただし、ばねを引きのばしすぎると、比例がくずれ、元の長さにもどらなくなる。',
    ],
    visual: {
      scene: 'spring',
      instruction: 'ばねの種類とおもりの数を変えて、のびと、比例のグラフを見よう。',
      controls: [
        options('spring', 'ばね', 'soft', Object.entries(SPRINGS).map(([value, meta]) => ({ value, label: meta.label }))),
        range('w', 'おもりの数', 0, 6, 1, 3, (value) => `${value}こ`),
      ],
      formula: ({ spring, w }) => {
        const { stretch } = SPRINGS[spring]
        return `y=${stretch}x\\qquad x=${w}\\ \\text{のとき}\\ y=${stretch * Number(w)}`
      },
      insight: ({ spring, w }) => {
        const { label: name, stretch } = SPRINGS[spring]
        const W = Number(w)
        return W
          ? `${name}は、おもり1こで${stretch}cmのびる。${W}こなら${stretch * W}cm。おもりを2倍にすると、のびも2倍になる。`
          : 'おもりが0こなら、のびも0。比例のグラフは0を通る。'
      },
    },
    uses: [
      { emoji: '⚖️', title: 'ばねばかり', text: 'のびが重さに比例するので、のびに目盛りをつければ重さがはかれる。' },
      { emoji: '🏢', title: '建物のゆれの計算', text: '建物や橋を、力に比例して変形するばねのように考えて、地震のときのゆれ方を計算する。' },
      { emoji: '🛒', title: '代金と個数', text: '1個50円のパンの代金は個数に比例する。$y=50x$ で、個数が2倍なら代金も2倍。' },
    ],
    units: ['prop', 'lin'],
    basics: ['b-proportion', 'b-change'],
  },
  {
    id: 'mh-lever',
    part: 'basic',
    theme: '変化と関係',
    emoji: '⚖️',
    title: '反比例',
    headline: 'てこは「重さ×支点からの距離」が等しいとつり合う',
    era: '紀元前3世紀・1662年',
    year: -248,
    place: 'ギリシャ（シラクサ）・イギリス',
    people: ['アルキメデス', 'ボイル'],
    question: '重いものを小さな力で持ち上げるには、どうすればよいか？',
    story: [
      '2つの量があって、一方が2倍・3倍になると、もう一方が $\\frac{1}{2}$・$\\frac{1}{3}$ になるとき、2つの量は反比例するという。2つの量の積 $x\\times y$ は、いつも同じ数になる。',
      'アルキメデスは『平面の釣り合いについて』で、てこがつり合うのは「重さ×支点からの距離」が左右で等しいときだと示した。「立つ場所をくれれば、地球を動かしてみせる」と言ったと伝えられている。',
      '同じ重さの荷物を持ち上げるとき、支点から2倍遠い所をおせば、必要な力は半分ですむ。つり合う力は、支点からの距離に反比例する。',
      '1662年、イギリスのボイルは、温度が同じなら、気体の体積は圧力に反比例することを示した（ボイルの法則）。',
    ],
    visual: {
      scene: 'lever',
      instruction: '荷物の重さと、力を加える位置を変えて、つり合う力の大きさと反比例のグラフを見よう。',
      controls: [
        options('load', '荷物（支点から1の所）', 12, [6, 12].map((value) => ({ value, label: `${value}kg` }))),
        range('d', '力を加える位置（支点からの距離）', 1, 12, 1, 3),
      ],
      formula: ({ load, d }) => {
        const force = Number(load) / Number(d)
        return `\\begin{gathered}${load}\\times1=F\\times${d}\\\\F=\\frac{${load}}{${d}}${approxTex(force)}${nice(force, 2)}\\end{gathered}`
      },
      insight: ({ load, d }) => {
        const force = Number(load) / Number(d)
        const about = approxText(force) === '=' ? '' : '約'
        return `支点から${d}の所なら、${about}${nice(force, 2)}kgの力でつり合う。距離を2倍にすると、必要な力は半分（反比例）。力×距離はいつも${load}。`
      },
    },
    uses: [
      { emoji: '✂️', title: 'はさみ・くぎぬき・せんぬき', text: '支点から遠い所を持つほど、小さな力で大きな力を出せる。てこの原理を使った道具だ。' },
      { emoji: '🫧', title: '空気入れ・深い海', text: 'ボイルの法則。空気をおし縮めると圧力が上がる。深くもぐるほど、肺の空気は圧力で小さくなる。' },
      { emoji: '🪑', title: 'シーソー', text: '重い人は支点の近くに、軽い人は遠くに座ると、つり合う。' },
    ],
    units: ['prop'],
    basics: ['b-proportion'],
  },
]
