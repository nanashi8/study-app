// 数学の歴史をたどるコース：第1部「算数の基本」のうち、数と計算の話。
//
// 話（chapter）の形：
//   id        … 'mh-…'（学習の記録のキー。変えない）
//   part      … 'basic' | 'junior' | 'senior'
//   theme     … 分野（MATH_HISTORY_THEME_COLORS のキー）
//   emoji / title / headline … 目次と話の見出し
//   era / year / place / people … 年代の表示・年代順に並べる年（紀元前は負）・場所・人物
//   question  … 困っていたこと（この話の問い）
//   story     … 発見・発明の筋道（段落の配列。$...$ は数式）
//   visual    … 動かす図 { scene, instruction, controls, formula(values), insight(values) }
//               scene は src/components/MathHistoryVisual.jsx の図の名前
//   uses      … 今の使われ方 [{ emoji, title, text }]
//   units     … つながる数学の単元（MATH_UNITS の id）
//   basics    … この話で学べる算数の基本の項目（MATH_BASICS の id）
// 伝説や説が分かれることは「〜と伝えられる」「〜と考えられている」と書き分ける。

import {
  decimalText,
  fracTex,
  gcd,
  lcm,
  options,
  parseFraction,
  range,
  sieveRemaining,
  unitFractionDenominators,
} from './controls.js'

const ZERO_OPERATIONS = {
  add: { label: 'たす', tex: '+' },
  subtract: { label: 'ひく', tex: '-' },
  multiply: { label: 'かける', tex: '\\times' },
  divide: { label: 'わる', tex: '\\div' },
}

export const MATH_HISTORY_BASIC_NUMBER = [
  {
    id: 'mh-counting',
    part: 'basic',
    theme: '数と計算',
    emoji: '✋',
    title: '数えることのはじまり',
    headline: '1つずつ対応させ、5や10のまとまりで数える',
    era: '数万年前から',
    year: -40000,
    place: 'アフリカ・メソポタミアなど',
    people: [],
    question: '数の言葉や数字がまだないころ、羊や穀物がいくつあるかを、どうやって記録したのか？',
    story: [
      'アフリカなどでは、数万年前の骨に刻み目がいくつも並んだものが見つかっている。何かの数を記録したしるしではないかと考えられている。',
      '数を記録するいちばん古い工夫は、1つずつ対応させることだ。羊を1頭出すたびに小石を1つ袋に入れ、帰ってきた羊1頭ごとに小石を1つ取り出す。小石が残れば、まだ帰っていない羊がいると分かる。数の名前を知らなくても、多い・少ないが比べられる。',
      'メソポタミア（今のイラクのあたり）では、紀元前8000年ごろから、粘土で作った小さな玉や円すいの形を、穀物や家畜の数の記録に使ったと考えられている。これがのちに粘土板に書く数字へつながったという説がある。',
      'しるしが増えると、ひと目では数えにくくなる。そこで人は5や10のまとまりを作った。手の指が片手に5本、両手で10本あることが、5や10でまとめる数え方のもとになったと考えられている。',
    ],
    visual: {
      scene: 'tally',
      instruction: '数を変えて、小石・刻み目・「正」の字が5ずつまとまる様子を見よう。',
      controls: [range('n', '数えるものの数', 1, 30, 1, 17)],
      formula: ({ n }) => {
        const groups = Math.floor(Number(n) / 5)
        const rest = Number(n) % 5
        if (!groups) return `${n}`
        return rest ? `${n}=5\\times${groups}+${rest}` : `${n}=5\\times${groups}`
      },
      insight: ({ n }) => {
        const groups = Math.floor(Number(n) / 5)
        const rest = Number(n) % 5
        if (!groups) return `まだ5に届かない。あと${5 - rest}で、最初のまとまりができる。`
        return rest
          ? `5のまとまりが${groups}つと、あと${rest}。まとまりで見ると、1つずつ数えなくても数が分かる。`
          : `ちょうど5のまとまりが${groups}つ。まとまりの数×5で数が出る。`
      },
    },
    uses: [
      { emoji: '🗳️', title: '票を数える', text: '学級の投票などで、票を1つ読むごとに「正」の字を1画ずつ書く。5画で1字になるので、字の数×5で合計がすぐに出る。' },
      { emoji: '🖐️', title: '指で数える', text: '指を折って数えるのは、指1本をもの1つに対応させる数え方。片手で5、両手で10のまとまりができる。' },
      { emoji: '💺', title: '座席と人を比べる', text: '座席と人の数が同じかどうかは、1人ずつ座ってもらえば、数えなくても分かる。1つずつ対応させる考え方は、今もものの数を比べる基本。' },
    ],
    units: [],
    basics: ['b-count'],
  },
  {
    id: 'mh-place-value',
    part: 'basic',
    theme: '数と計算',
    emoji: '🔟',
    title: '位取りの書き方',
    headline: '10個の数字と「位」で、どんなに大きな数も書ける',
    era: '6〜7世紀ごろ（インド）',
    year: 600,
    place: 'インド → アラビア → ヨーロッパ',
    people: ['アル・フワーリズミー', 'フィボナッチ'],
    question: '大きな数を、少ない種類の記号で、しかも計算しやすく書くにはどうすればよいか？',
    story: [
      'ローマ数字では、I（1）・V（5）・X（10）・L（50）・C（100）・D（500）・M（1000）の記号を並べ、その合計で数を表した。たとえば2026は MMXXVI と書く。書くことはできても、このまま筆算をするのは難しく、計算には板の上で小石を動かす道具が使われた。英語で「計算する」を表す calculate は、ラテン語の「小石」から来た言葉だ。',
      'インドでは、遅くとも6〜7世紀ごろまでに、1から9までの数字と0の10個だけで数を書く方法が使われていた。同じ3でも、右から1番目なら3、2番目なら30、3番目なら300を表す。書く場所（位）が値を決めるので、これを位取りの書き方という。',
      '9世紀のバグダッドで、アル・フワーリズミーがインドの数字を使った計算の本を書いた。この本はのちにラテン語に訳され、計算の手順を表す「アルゴリズム」という言葉は、彼の名前から生まれた。1202年には、イタリアのフィボナッチが『計算の書』で、この数字と筆算をヨーロッパに紹介した。',
      '日本では漢数字で「二千二十六」と書き、千・百・十という位の名前もいっしょに書くので、空いた位に何も書かなくてもよかった。今の数字（算用数字）は明治時代に広まり、1872年に始まった学校の制度で、西洋の算術が教えられるようになった。',
    ],
    visual: {
      scene: 'place-value',
      instruction: '百の位・十の位・一の位の数字を変えて、ブロックと3つの書き方を比べよう。',
      controls: [
        range('h', '百の位', 0, 9, 1, 3),
        range('t', '十の位', 0, 9, 1, 0),
        range('o', '一の位', 0, 9, 1, 5),
      ],
      formula: ({ h, t, o }) => {
        const n = Number(h) * 100 + Number(t) * 10 + Number(o)
        return `${n}=${h}\\times100+${t}\\times10+${o}\\times1`
      },
      insight: ({ h, t, o }) => {
        const [H, T, O] = [h, t, o].map(Number)
        const n = H * 100 + T * 10 + O
        if (n === 0) return 'どの位も0。ローマ数字には0を書く記号がない。'
        if (H > 0 && T === 0 && O === 0) return `十の位と一の位が空いている。0を書かないと、${n} と ${H} の区別がつかない。`
        if (H > 0 && T === 0) return `十の位が空いている。0を書かないと、${n} と ${H * 10 + O} の区別がつかない。`
        if (T > 0 && O === 0) return `一の位が空いている。0を書かないと、${n} と ${H * 10 + T} の区別がつかない。`
        const parts = [[H, 100, '百'], [T, 10, '十'], [O, 1, '一']]
          .filter(([digit]) => digit > 0)
          .map(([digit, unit, name]) => `${name}の位の${digit}は${digit * unit}`)
        return parts.length === 1
          ? `${parts[0]}を表す。同じ数字でも、1つ左の位に書くと10倍の値になる。`
          : `${parts.join('、')}を表す。同じ数字でも、位で値が変わる。`
      },
    },
    uses: [
      { emoji: '💴', title: '筆算', text: '位をそろえて縦に並べると、一の位から順に計算できる。位取りの書き方があるから、紙の上で大きな数の計算ができる。' },
      { emoji: '🏦', title: '大きな数の読み方', text: '日本語では4けたごとに万・億・兆と位の名前が変わる。123456789 は「1億2345万6789」。英語は3けたごとに区切るので、数字にコンマを3けたごとに入れる。' },
      { emoji: '💻', title: 'コンピューターの2進法', text: 'コンピューターは0と1の2個の数字だけで、位取りの書き方をしている。10ではなく2のまとまりで位が上がる。' },
    ],
    units: [],
    basics: ['b-place'],
  },
  {
    id: 'mh-zero',
    part: 'basic',
    theme: '数と計算',
    emoji: '⭕',
    title: 'ゼロ',
    headline: '「何もない」を1つの数として計算する',
    era: '628年',
    year: 628,
    place: 'インド',
    people: ['ブラーマグプタ'],
    question: '「何もない」ことを、どう書き、どう計算すればよいのか？',
    story: [
      '位取りの書き方では、空いた位に何かを書かないと、305 と 35 の区別がつかない。メソポタミアでは、紀元前300年ごろまでに、空いた位を示す記号を書くようになった。ただしそれは「ここは空き」という目印で、計算に使う数ではなかった。',
      '628年、インドの天文学者ブラーマグプタは、0を1つの数として、計算の決まりを本に書いた。「ある数に0をたしても、ある数から0をひいても、数は変わらない」「どんな数に0をかけても0になる」。財産を正の数、借金を負の数として計算する決まりも、いっしょに書いた。',
      'ブラーマグプタは0でわる計算にも答えを書こうとしたが、今の数学では0でわることはしない。$6\\div0$ の答えを □ とすると $\\square\\times0=6$ となるはずだが、0に何をかけても0なので、そんな □ はない。',
      '中央アメリカのマヤでも、暦の計算の中で0を表す記号が使われた。0を数として扱うインドの考えは、位取りの数字といっしょに、アラビアを通ってヨーロッパへ伝わった。',
    ],
    visual: {
      scene: 'zero-rules',
      instruction: '計算の種類とはじめの数を変えて、0がどうはたらくかを確かめよう。',
      controls: [
        options('op', '計算', 'multiply', Object.entries(ZERO_OPERATIONS).map(([value, meta]) => ({ value, label: meta.label }))),
        range('a', 'はじめの数', 1, 9, 1, 6),
      ],
      formula: ({ op, a }) => {
        if (op === 'add') return `${a}+0=${a}`
        if (op === 'subtract') return `${a}-0=${a}`
        if (op === 'multiply') return `${a}\\times0=0`
        return `\\begin{gathered}${a}\\div0=\\ ?\\\\\\square\\times0=${a}\\ \\text{となる}\\ \\square\\ \\text{はない}\\end{gathered}`
      },
      insight: ({ op, a }) => {
        if (op === 'add') return `${a}に0をたしても、数は変わらない。`
        if (op === 'subtract') return `${a}から0をひいても、数は変わらない。`
        if (op === 'multiply') return `${a}の0こ分は、何もない。どんな数に0をかけても0になる。`
        return `0に何をかけても0なので、${a}にはならない。0でわる計算の答えは決められない。`
      },
    },
    uses: [
      { emoji: '🌡️', title: '気温の0度', text: 'ふだん使う温度（セ氏）は、水がこおる温度を0度とした。0度より低い温度は、負の数で表す。' },
      { emoji: '🏔️', title: '標高0メートル', text: '山の高さは、海面の高さを0メートルとしてはかる。0は「何もない」だけでなく、はかるときの基準にもなる。' },
      { emoji: '💻', title: '0と1のコンピューター', text: 'コンピューターは、文字も画像もすべて0と1の並びで表す。0がなければ、この書き方はできない。' },
    ],
    units: ['pn'],
    basics: ['b-place'],
  },
  {
    id: 'mh-soroban',
    part: 'basic',
    theme: '数と計算',
    emoji: '🧮',
    title: 'たし算・ひき算とそろばん',
    headline: '10たまったら1つ上の位へ——くり上がりの仕組み',
    era: '1627年（『塵劫記（じんこうき）』）',
    year: 1627,
    place: '中国 → 日本',
    people: ['吉田光由（よしだみつよし）'],
    question: 'くり上がりやくり下がりのある計算を、速く、まちがえずにするにはどうすればよいか？',
    story: [
      '古代の中国では、算木（さんぎ）という短い棒を板の上に並べて計算し、ローマでは線を引いた板の上で小石を動かして計算した。位ごとの列に置いたものが10たまったら、1つ上の位へ1つにまとめて移す。これがくり上がりの仕組みだ。',
      '玉を棒にさして枠に入れた「算盤（そろばん）」は中国で使われるようになり、日本には16世紀ごろに伝わったと考えられている。1本の棒が1つの位で、梁（はり）の上の玉は1つで5、下の玉は1つで1を表す。',
      '1627年、京都の吉田光由（よしだみつよし）が『塵劫記（じんこうき）』を出した。そろばんでのかけ算・わり算や、田の面積、米や材木の量の計算を、絵を入れて分かりやすく説明したこの本はよく売れ、まねた本もたくさん出て、多くの人がそろばんと計算を学んだ。',
      '紙に数字を縦に並べる筆算も、そろばんと同じ仕組みで計算する。一の位から順に計算し、10になったら1つ上の位へ1くり上げる。ひき算でひけないときは、1つ上の位から10を借りてくる（くり下がり）。',
    ],
    visual: {
      scene: 'soroban',
      instruction: '計算の種類と2つの数を変えて、そろばんの玉と筆算のくり上がり・くり下がりを見よう。',
      controls: [
        options('op', '計算', 'add', [{ value: 'add', label: 'たし算' }, { value: 'subtract', label: 'ひき算' }]),
        range('a', 'はじめの数', 20, 99, 1, 47),
        range('b', 'たす数・ひく数', 1, 19, 1, 8),
      ],
      formula: ({ op, a, b }) => (op === 'add' ? `${a}+${b}=${Number(a) + Number(b)}` : `${a}-${b}=${Number(a) - Number(b)}`),
      insight: ({ op, a, b }) => {
        const ao = Number(a) % 10
        const bo = Number(b) % 10
        const at = Math.floor(Number(a) / 10)
        const bt = Math.floor(Number(b) / 10)
        if (op === 'add') {
          const carry = ao + bo >= 10 ? 1 : 0
          const ones = carry
            ? `一の位は ${ao}+${bo}=${ao + bo}。10をこえたので${(ao + bo) % 10}を書き、十の位へ1くり上げる。`
            : `一の位は ${ao}+${bo}=${ao + bo}。10にならないので、くり上がりはない。`
          const tens = at + bt + carry >= 10 ? '十の位も10をこえるので、百の位へ1くり上げる。' : ''
          return ones + tens
        }
        return ao < bo
          ? `一の位は ${ao} から ${bo} がひけないので、十の位から10を借りて ${ao + 10}-${bo}=${ao + 10 - bo}。十の位は1へる。`
          : `一の位は ${ao}-${bo}=${ao - bo}。ひけるので、くり下がりはない。`
      },
    },
    uses: [
      { emoji: '🧠', title: 'そろばん式の暗算', text: 'そろばんに慣れると、頭の中に玉の形を思いうかべて、速く暗算ができるようになる。' },
      { emoji: '🧾', title: 'お金の計算', text: '代金とおつりの計算は、くり上がり・くり下がりのあるたし算・ひき算そのもの。' },
      { emoji: '💻', title: 'コンピューターのたし算', text: 'コンピューターも、0と1の2進法で、位ごとにたしてくり上がりを次の位へ送る回路でたし算をしている。' },
    ],
    units: [],
    basics: ['b-add', 'b-soroban'],
  },
  {
    id: 'mh-multiply',
    part: 'basic',
    theme: '数と計算',
    emoji: '✖️',
    title: 'かけ算',
    headline: '同じ数のたし算をまとめる——九九と倍々の計算',
    era: '紀元前1550年ごろ（エジプト）・奈良時代（日本の九九）',
    year: -1550,
    place: 'エジプト・中国・日本',
    people: ['アーメス'],
    question: '同じ数を何度もたす計算を、もっと速くするにはどうすればよいか？',
    story: [
      'かけ算は、同じ数をくり返したすたし算をまとめたものだ。$4\\times3$ は $4+4+4$。点を縦に4つ、横に3列並べると、長方形の点の数として見える。',
      'エジプトの書記アーメスが紀元前1550年ごろに写した「リンド・パピルス」には、2倍をくり返してかけ算をする方法が書かれている。たとえば $13\\times12$ なら、12・24・48・96（1倍・2倍・4倍・8倍）を作り、$1+4+8=13$ になる行の12・48・96をたして156とする。',
      '中国では、かけ算の答えを覚える「九九」が古くから使われた。日本にも伝わり、奈良時代の平城宮（へいじょうきゅう）のあとからは、九九を書いた木簡（もっかん）が見つかっている。『万葉集』には、「八十一」と書いて「くく」と読ませる歌もある。',
      '位取りの数字が広まると、九九と「かける数を位ごとに分けて、あとでたす」方法を組み合わせて、大きな数のかけ算も紙の上でできるようになった。',
    ],
    visual: {
      scene: 'multiply',
      instruction: '見方を選び、2つの数を変えて、長方形の点の数と、倍々の計算を確かめよう。',
      controls: [
        options('mode', '見方', 'grid', [{ value: 'grid', label: '点の長方形' }, { value: 'double', label: '倍々の方法' }]),
        range('a', 'かける回数（縦）', 1, 15, 1, 13),
        range('b', '1回分の数（横）', 1, 15, 1, 12),
      ],
      formula: ({ mode, a, b }) => {
        const product = Number(a) * Number(b)
        if (mode === 'grid') return `${a}\\times${b}=${product}`
        const parts = [8, 4, 2, 1].filter((power) => Number(a) & power).reverse().map((power) => power * Number(b))
        return parts.length > 1 ? `${a}\\times${b}=${parts.join('+')}=${product}` : `${a}\\times${b}=${product}`
      },
      insight: ({ mode, a, b }) => {
        const product = Number(a) * Number(b)
        if (mode === 'grid') {
          return `縦${a}・横${b}に並んだ点は${product}こ。長方形を横にして${b}×${a}と見ても、点の数は同じ。`
        }
        const powers = [1, 2, 4, 8].filter((power) => Number(a) & power)
        return powers.length > 1
          ? `${a}=${powers.join('+')}。2倍をくり返して作った行のうち、この${powers.length}行をたすと${product}になる。`
          : `${a}は2倍をくり返した数そのもの。${b}を2倍していくだけで${product}になる。`
      },
    },
    uses: [
      { emoji: '🛒', title: '代金の計算', text: '1個120円のパンを6個買うと、$120\\times6=720$ 円。同じ値段のものをいくつか買う計算は、かけ算になる。' },
      { emoji: '📐', title: '面積', text: '長方形の面積は「縦×横」。1cm四方の正方形が何こ並ぶかを、かけ算で数えている。' },
      { emoji: '💻', title: 'コンピューターのかけ算', text: 'コンピューターは2進法で、2倍（位を1つずらす）とたし算を組み合わせてかけ算をする。エジプトの倍々の方法と同じ考え方だ。' },
    ],
    units: [],
    basics: ['b-multiply'],
  },
  {
    id: 'mh-divide',
    part: 'basic',
    theme: '数と計算',
    emoji: '➗',
    title: 'わり算とあまり',
    headline: '同じ数ずつ分けて、分けきれない分が「あまり」',
    era: '紀元前1550年ごろ（エジプト）・1659年（÷の記号）',
    year: -1540,
    place: 'エジプト・スイス',
    people: ['アーメス', 'ヨハン・ラーン'],
    question: 'ものを同じ数ずつ分けるとき、何人分できて、いくつ残るかを、どう求めればよいか？',
    story: [
      'わり算は、かけ算の逆だ。「12個を3人で同じ数ずつ分ける」のは、「3に何をかけると12になるか」を考えることと同じで、答えは4。',
      'エジプトのリンド・パピルスでは、わり算もかけ算の逆として計算している。わる数を1倍・2倍・4倍…と倍にしていき、たしてわられる数になる組み合わせをさがす。',
      'いつも分けきれるとは限らない。23個を4個ずつ分けると5組できて3個残る。この残りが「あまり」で、あまりはいつもわる数より小さい。',
      'わり算の記号「÷」は、1659年にスイスのヨハン・ラーンが本の中で使い、イギリスで広まった。ヨーロッパの多くの国では、今も「:」や「/」でわり算を表すことが多い。',
    ],
    visual: {
      scene: 'divide',
      instruction: '全部の数と1組の数を変えて、何組できて、いくつあまるかを見よう。',
      controls: [
        range('n', '全部の数', 1, 40, 1, 23),
        range('k', '1組の数', 2, 9, 1, 4),
      ],
      formula: ({ n, k }) => {
        const q = Math.floor(Number(n) / Number(k))
        const r = Number(n) % Number(k)
        return r
          ? `\\begin{gathered}${n}\\div${k}=${q}\\ \\text{あまり}\\ ${r}\\\\${k}\\times${q}+${r}=${n}\\end{gathered}`
          : `\\begin{gathered}${n}\\div${k}=${q}\\\\${k}\\times${q}=${n}\\end{gathered}`
      },
      insight: ({ n, k }) => {
        const q = Math.floor(Number(n) / Number(k))
        const r = Number(n) % Number(k)
        if (!q) return `${k}こずつの組は1つもできない。${n}こすべてがあまり（あまりは${k}より小さい）。`
        return r
          ? `${k}こずつ${q}組できて、${r}こあまる。あまりはいつも${k}より小さい。`
          : `${k}こずつちょうど${q}組に分けられる。あまりは0。`
      },
    },
    uses: [
      { emoji: '📅', title: '曜日の計算', text: '今日が月曜日なら、100日後は $100\\div7=14$ あまり2 で、2日後と同じ水曜日。曜日は7日ごとにくり返すので、あまりだけを見ればよい。' },
      { emoji: '🕘', title: '時計の時刻', text: '今が9時なら、50時間後は $50\\div24=2$ あまり2 で、2時間後と同じ11時になる。' },
      { emoji: '🍬', title: '同じ数ずつ配る', text: 'お菓子を1人何個ずつ配れて、何個残るかは、あまりのあるわり算で求める。' },
    ],
    units: ['intA'],
    basics: ['b-divide'],
  },
  {
    id: 'mh-laws',
    part: 'basic',
    theme: '数と計算',
    emoji: '🧱',
    title: '計算のきまり',
    headline: '長方形を切り分けると見える、分配のきまり',
    era: '紀元前300年ごろ（『原論』）・1814年（名前）',
    year: -300,
    place: 'ギリシャ（アレクサンドリア）・フランス',
    people: ['ユークリッド', 'セルボワ'],
    question: '$98\\times7$ のような計算を、暗算で楽にする方法はないか？',
    story: [
      '紀元前300年ごろ、アレクサンドリアのユークリッドは、それまでの幾何学をまとめた『原論』を書いた。その第2巻には、長方形の面積を使った計算の決まりが並んでいる。',
      '長方形の1つの辺を2つに切り分けると、長方形も2つの長方形に分かれ、面積はその和になる。式で書くと $a\\times(b+c)=a\\times b+a\\times c$。今の「分配のきまり」だ。',
      '$a\\times b=b\\times a$（交換のきまり）も、長方形を横にすれば分かる。これらに「交換」「分配」という名前をつけたのは、1814年のフランスの数学者セルボワだ。',
      'このきまりを使うと、$98\\times7=(100-2)\\times7=700-14=686$ のように、計算しやすい形に直せる。文字の式を展開・因数分解するときも、同じきまりを使っている。',
    ],
    visual: {
      scene: 'distributive',
      instruction: '縦の長さと、横の2つの長さを変えて、長方形を切り分けても面積の合計が変わらないことを確かめよう。',
      controls: [
        range('a', '縦', 1, 8, 1, 3),
        range('b', '横の左の部分', 1, 8, 1, 5),
        range('c', '横の右の部分', 1, 8, 1, 2),
      ],
      formula: ({ a, b, c }) => {
        const [A, B, C] = [a, b, c].map(Number)
        return `\\begin{aligned}${A}\\times(${B}+${C})&=${A}\\times${B}+${A}\\times${C}\\\\&=${A * B}+${A * C}=${A * (B + C)}\\end{aligned}`
      },
      insight: ({ a, b, c }) => {
        const [A, B, C] = [a, b, c].map(Number)
        return `縦${A}・横${B + C}の長方形は、横${B}と横${C}の2つの長方形に切り分けられる。面積は${A * B}と${A * C}の和で${A * (B + C)}。`
      },
    },
    uses: [
      { emoji: '🧠', title: '暗算の工夫', text: '$98\\times7$ は $(100-2)\\times7=700-14=686$。キリのよい数に直してから分配のきまりを使うと、暗算しやすい。' },
      { emoji: '🛍️', title: 'まとめて買う代金', text: '120円のパンと80円の牛乳を3人分買うと、$3\\times(120+80)=3\\times120+3\\times80=600$ 円。どちらの順に計算しても同じ。' },
      { emoji: '🔣', title: '文字の式の展開', text: '中学で学ぶ $a(b+c)=ab+ac$ や $(x+2)(x+3)$ の展開は、この長方形の切り分けと同じ形をしている。' },
    ],
    units: ['expr1', 'calc2', 'expand'],
    basics: ['b-laws'],
  },
  {
    id: 'mh-fractions',
    part: 'basic',
    theme: '数と計算',
    emoji: '🍕',
    title: '分数',
    headline: 'はんぱを表す——エジプトの単位分数',
    era: '紀元前1550年ごろ',
    year: -1530,
    place: 'エジプト',
    people: ['アーメス', 'フィボナッチ'],
    question: 'パンを人数で分けて、1人分がはんぱになったとき、その大きさをどう表せばよいか？',
    story: [
      '分けたときの「はんぱ」を表すのが分数だ。古代エジプトでは、$\\frac{1}{2}$・$\\frac{1}{3}$・$\\frac{1}{4}$ のように分子が1の分数（単位分数）を使い、ほかの大きさは単位分数の和で表した。$\\frac{2}{3}$ にだけは特別な記号があった。',
      'リンド・パピルスには、何個かのパンを10人で分ける問題や、$\\frac{2}{5}=\\frac{1}{3}+\\frac{1}{15}$ のように、分子が2の分数を単位分数の和に直した表がのっている。',
      '1202年、フィボナッチは『計算の書』で、どんな分数も「引ける中でいちばん大きい単位分数を引く」ことをくり返せば、単位分数の和に直せる方法を書いた。',
      '分子と分母を横線で区切る今の書き方は、アラビアの数学で使われるようになり、フィボナッチの本などでヨーロッパに広まったとされる。',
    ],
    visual: {
      scene: 'unit-fractions',
      instruction: '分子と分母を変えて、分数の大きさと、単位分数の和への分け方を見よう。',
      controls: [
        range('p', '分子', 1, 11, 1, 3),
        range('q', '分母', 2, 12, 1, 4),
      ],
      formula: ({ p, q }) => {
        const [P, Q] = [p, q].map(Number)
        const whole = Math.floor(P / Q)
        const rest = P % Q
        if (!rest) return `\\frac{${P}}{${Q}}=${whole}`
        const units = unitFractionDenominators(rest, Q).map((d) => `\\frac{1}{${d}}`)
        const restTex = units.join('+')
        if (!whole) return units.length === 1 && rest === 1 ? `\\frac{${P}}{${Q}}\\ \\text{は単位分数}` : `\\frac{${P}}{${Q}}=${restTex}`
        return `\\frac{${P}}{${Q}}=${whole}+\\frac{${rest}}{${Q}}=${whole}+${restTex}`
      },
      insight: ({ p, q }) => {
        const [P, Q] = [p, q].map(Number)
        const whole = Math.floor(P / Q)
        const rest = P % Q
        if (!rest) return `${P}/${Q} は、1がちょうど${whole}こ分。分子が分母でわり切れると整数になる。`
        const denominators = unitFractionDenominators(rest, Q)
        const head = whole ? `1が${whole}こと、あと${rest}/${Q}。` : ''
        if (rest === 1) return `${head}${P === 1 ? `1/${Q} は、1を${Q}等分した1つ分（単位分数）。` : `あまりの 1/${Q} は単位分数。`}`
        return `${head}${rest}/${Q} は ${denominators.map((d) => `1/${d}`).join(' と ')} の和。引ける中でいちばん大きい単位分数を引いていくと、必ず終わる。`
      },
    },
    uses: [
      { emoji: '🎵', title: '音符の長さ', text: '2分音符・4分音符・8分音符は、全音符の $\\frac{1}{2}$・$\\frac{1}{4}$・$\\frac{1}{8}$ の長さ。楽譜は単位分数でできている。' },
      { emoji: '🥛', title: '料理の分量', text: '計量カップの $\\frac{1}{2}$ カップや $\\frac{1}{4}$ カップのように、分量は分数で表すことが多い。' },
      { emoji: '🍰', title: '同じ大きさに分ける', text: 'ケーキを8等分した3切れは $\\frac{3}{8}$。はんぱな量を、分ける数と取る数で正確に表せる。' },
    ],
    units: [],
    basics: ['b-fraction'],
  },
  {
    id: 'mh-fraction-calc',
    part: 'basic',
    theme: '数と計算',
    emoji: '🍰',
    title: '分数の計算',
    headline: '分母をそろえてたす、分子と分母を同じ数でわる',
    era: '紀元1世紀ごろ（『九章算術』）',
    year: 50,
    place: '中国',
    people: ['劉徽（りゅうき）'],
    question: '分母がちがう分数を、どうすればたしたりひいたりできるのか？',
    story: [
      '中国の『九章算術』は、紀元1世紀ごろまでにまとめられた数学の本で、田の面積や税、工事の計算など246の問題と解き方がのっている。3世紀には劉徽（りゅうき）が、解き方の理由を説明する注をつけた。',
      'その第1章には、分数を簡単にする「約分」や、分母をそろえてたす方法が書かれている。約分では、分子と分母のうち大きい方から小さい方をくり返しひき、2つが同じ数になったら、その数で分子と分母をわる。',
      '分母がちがう分数をたすには、分母を同じ数にそろえる（通分）。$\\frac{1}{2}+\\frac{1}{3}=\\frac{3}{6}+\\frac{2}{6}=\\frac{5}{6}$。そろえる分母は、2と3の公倍数の6にする。',
      '分数でわるときは、わる数の分子と分母を入れかえてかける。$\\frac{3}{4}\\div\\frac{1}{2}=\\frac{3}{4}\\times2=\\frac{3}{2}$。「$\\frac{1}{2}$ がいくつ分あるか」を考えると、2倍になる理由が分かる。',
    ],
    visual: {
      scene: 'common-denominator',
      instruction: '2つの分数を選んで、分母をそろえてたす様子を見よう。',
      controls: [
        options('x', '1つ目の分数', '1/2', ['1/2', '1/3', '2/3', '1/4', '3/4', '2/5', '5/6'].map((value) => ({ value, label: value }))),
        options('y', '2つ目の分数', '1/3', ['1/2', '1/3', '2/3', '1/4', '3/4', '2/5', '5/6'].map((value) => ({ value, label: value }))),
      ],
      formula: ({ x, y }) => {
        const [a, b] = parseFraction(x)
        const [c, d] = parseFraction(y)
        const L = lcm(b, d)
        const sum = a * (L / b) + c * (L / d)
        const g = gcd(sum, L)
        const tail = g > 1 ? `=${fracTex(sum / g, L / g)}` : ''
        return `${fracTex(a, b)}+${fracTex(c, d)}=${fracTex(a * (L / b), L)}+${fracTex(c * (L / d), L)}=${fracTex(sum, L)}${tail}`
      },
      insight: ({ x, y }) => {
        const [, b] = parseFraction(x)
        const [, d] = parseFraction(y)
        const L = lcm(b, d)
        const [a] = parseFraction(x)
        const [c] = parseFraction(y)
        const sum = a * (L / b) + c * (L / d)
        const g = gcd(sum, L)
        const head = b === d
          ? `分母がはじめから${b}でそろっているので、分子をたすだけでよい。`
          : `分母を${b}と${d}の最小公倍数${L}にそろえると、同じ大きさの区切りで数えられる。`
        return g > 1 ? `${head}答えの${sum}/${L}は、${g}でわって${sum / g}/${L / g}に約分できる。` : head
      },
    },
    uses: [
      { emoji: '⏱️', title: '時間の計算', text: '$\\frac{1}{2}$ 時間と $\\frac{1}{3}$ 時間をたすと $\\frac{5}{6}$ 時間。60分の $\\frac{5}{6}$ で50分になる。' },
      { emoji: '🧪', title: '分量を合わせる', text: '料理や実験で、$\\frac{1}{4}$ リットルと $\\frac{1}{3}$ リットルを合わせると $\\frac{7}{12}$ リットル。分母をそろえると量が比べられる。' },
    ],
    units: ['intA'],
    basics: ['b-fraction-calc', 'b-integer'],
  },
  {
    id: 'mh-decimals',
    part: 'basic',
    theme: '数と計算',
    emoji: '🔍',
    title: '小数',
    headline: '1を10ずつに分けていく書き方',
    era: '1585年',
    year: 1585,
    place: 'オランダ',
    people: ['シモン・ステヴィン'],
    question: '分母がちがう分数は、大きさを比べたり計算したりしにくい。もっと楽な書き方はないか？',
    story: [
      '1を10に分けて数える考えは、中国やアラビアの数学にもあった。1585年、オランダで活やくしたシモン・ステヴィンは『十分の一』という小さな本を出し、1を10等分した「10分の1」、それをまた10等分した「100分の1」…を使えば、分数の計算も整数と同じ筆算でできると広く説いた。',
      'ステヴィンは、お金や長さ・重さの単位も10ずつで区切るべきだと主張した。この考えは、約200年後にフランスでできたメートル法で実現する。',
      '小数点の書き方は人によってちがったが、1617年ごろにはスコットランドのネイピアが点を使った書き方を用い、しだいに広まった。',
      '日本では、割・分・厘・毛という言い方が使われてきた。0.325は「3割2分5厘」。野球の打率を「3割」と言うのは、この言い方の名残だ。',
    ],
    visual: {
      scene: 'decimal-zoom',
      instruction: '10分の1・100分の1・1000分の1の位を変えて、1を10等分していく様子を見よう。',
      controls: [
        range('t', '10分の1の位', 0, 9, 1, 3),
        range('h', '100分の1の位', 0, 9, 1, 2),
        range('th', '1000分の1の位', 0, 9, 1, 5),
      ],
      formula: ({ t, h, th }) => {
        const digits = [t, h, th].map(Number)
        const value = decimalText(digits)
        const terms = digits.map((digit, index) => (digit ? `\\frac{${digit}}{${10 ** (index + 1)}}` : '')).filter(Boolean)
        return terms.length ? `${value}=${terms.join('+')}` : '0'
      },
      insight: ({ t, h, th }) => {
        const digits = [t, h, th].map(Number)
        if (digits.every((digit) => digit === 0)) return 'どの位も0。1を10等分した区切りを1つも取っていない。'
        const names = ['1を10等分した', 'そのまた10等分した', 'そのまた10等分した']
        const parts = digits.map((digit, index) => (digit ? `${names[index]}${digit}つ分` : '')).filter(Boolean)
        const buai = [['割', digits[0]], ['分', digits[1]], ['厘', digits[2]]]
          .filter(([, digit]) => digit)
          .map(([name, digit]) => `${digit}${name}`)
          .join('')
        return `${decimalText(digits)} は、${parts.join('と、')}。割・分・厘で言うと${buai}。`
      },
    },
    uses: [
      { emoji: '⚾', title: '打率と割合', text: '打率0.325は「3割2分5厘」。10回に約3回ヒットを打つ割合で、割・分・厘は小数の位の名前になっている。' },
      { emoji: '🌡️', title: '体温や記録', text: '体温36.5度、100m走の11.84秒のように、はかった量は小数で細かく表す。' },
      { emoji: '💱', title: 'お金', text: '1ドル＝100セントのように、今のお金の多くは10や100ずつで区切られ、小数で計算できる。' },
    ],
    units: [],
    basics: ['b-decimal'],
  },
  {
    id: 'mh-primes',
    part: 'basic',
    theme: '数と計算',
    emoji: '🔢',
    title: '約数と倍数・素数',
    headline: '倍数をふるい落として、素数を見つける',
    era: '紀元前3世紀',
    year: -240,
    place: 'ギリシャ（アレクサンドリア）',
    people: ['ユークリッド', 'エラトステネス'],
    question: '1とその数自身でしかわり切れない「素数」を、もれなく見つけるにはどうすればよいか？',
    story: [
      '1とその数自身でしかわり切れない数を素数という（2, 3, 5, 7, 11, …）。1より大きいほかの整数は、$12=2\\times2\\times3$ のように素数のかけ算で表せる。',
      '紀元前300年ごろ、ユークリッドは『原論』の中で、素数が限りなくあることを証明した。どれだけ素数を集めても、それらを全部かけて1をたした数は、集めたどの素数でもわり切れないからだ。',
      '紀元前3世紀、アレクサンドリアの図書館長だったエラトステネスは、素数を見つける方法を考えたと伝えられる。数を並べ、2の倍数、3の倍数、5の倍数…と消していくと、残った数が素数になる。粉をふるいにかけるようなので、「エラトステネスのふるい」とよばれる。',
      '2つの数に共通な倍数（公倍数）も身近にある。十干（じっかん・10種類）と十二支（12種類）を組み合わせる干支（えと）は、10と12の最小公倍数の60年で一回りする。60歳を「還暦」というのは、このためだ。',
    ],
    visual: {
      scene: 'sieve',
      instruction: 'ふるいの段階を進めて、倍数が消え、素数が残っていく様子を見よう。',
      controls: [
        range('step', 'ふるいの段階', 0, 4, 1, 0, (value) => ['並べる', '2の倍数', '3の倍数', '5の倍数', '7の倍数'][value] ?? String(value)),
      ],
      formula: ({ step }) => {
        const primes = [2, 3, 5, 7]
        const s = Number(step)
        if (!s) return '2,\\ 3,\\ 4,\\ 5,\\ \\dots,\\ 100'
        const p = primes[s - 1]
        const rest = sieveRemaining(s)
        return s === 4
          ? `\\begin{gathered}${p}\\times2,\\ ${p}\\times3,\\ \\dots\\ \\text{を消す}\\\\\\text{残りは素数}\\ ${rest}\\ \\text{個}\\end{gathered}`
          : `\\begin{gathered}${p}\\times2,\\ ${p}\\times3,\\ \\dots\\ \\text{を消す}\\\\\\text{残り}\\ ${rest}\\ \\text{個}\\end{gathered}`
      },
      insight: ({ step }) => {
        const s = Number(step)
        if (!s) return '1は素数ではないので、2から始める。まだどの数も消していない。'
        if (s === 1) return `2を残して、2の倍数（2以外の偶数）を消した。残りは${sieveRemaining(1)}個。`
        if (s === 2) return `3を残して、3の倍数を消した。6や12のように、2の倍数と重なる数はもう消えている。残りは${sieveRemaining(2)}個。`
        if (s === 3) return `5を残して、5の倍数を消した。残りは${sieveRemaining(3)}個。`
        return '7の倍数まで消すと、残った25個がすべて素数。$11\\times11=121$ は100より大きいので、11の倍数を消す必要はない。'
      },
    },
    uses: [
      { emoji: '🔐', title: 'インターネットの暗号', text: '大きな2つの素数をかけた数から、もとの素数を見つけるのはとても難しい。この性質が、ネットで買い物をするときの暗号に使われている。' },
      { emoji: '⚙️', title: '歯車', text: '歯の数が12と18の歯車をかみ合わせると、はじめと同じ組み合わせにもどるのは、12と18の最小公倍数の36歯分だけ回ったとき。' },
      { emoji: '🎎', title: '干支（えと）と還暦', text: '十干（じっかん）と十二支の組み合わせは60年で一回りする。10と12の最小公倍数が60だからだ。' },
    ],
    units: ['intA', 'factor', 'sqrt'],
    basics: ['b-integer'],
  },
  {
    id: 'mh-letters',
    part: 'basic',
    theme: '数と計算',
    emoji: '🔤',
    title: '□や文字を使った式',
    headline: '分からない数を記号で表すと、どんな数でも成り立つことが示せる',
    era: '1557年（=）・1591年（文字の式）・1637年（x）',
    year: 1591,
    place: 'ギリシャ・イギリス・フランス',
    people: ['ディオファントス', 'レコード', 'ヴィエト', 'デカルト'],
    question: 'まだ分からない数や、どんな数でも成り立つ決まりを、どうすれば短く正確に書けるか？',
    story: [
      '昔の数学は、式を言葉で書いた。「ある数にその半分をたすと…」と文章で書くので、長くて読みにくかった。3世紀ごろのギリシャのディオファントスは、分からない数を表す記号を使い始めた。',
      'そのあと記号が次々に生まれた。「+」「−」は1489年のドイツの本に印刷されたものが古い。「=」は1557年、イギリスのレコードが「2本の平行線ほど等しいものはない」として使い始めた。',
      '1591年、フランスのヴィエトは、分かっている数にも分からない数にも文字を使い、式のまま計算できるようにした。1637年にはデカルトが、分からない数を $x,y,z$、分かっている数を $a,b,c$ で表し、今の書き方のもとになった。',
      '文字を使うと、「どんな数でも成り立つ」ことを1つの式で示せる。小学校で使う □ も、同じ考え方だ。',
    ],
    visual: {
      scene: 'think-number',
      instruction: '思った数とたす数を変えて、数当ての答えがいつも同じになる理由を、文字の式で確かめよう。',
      controls: [
        range('x', '思った数', 1, 20, 1, 7),
        options('k', 'たす数', 6, [2, 4, 6, 8, 10].map((value) => ({ value, label: String(value) }))),
      ],
      formula: ({ k }) => `\\frac{2x+${k}}{2}-x=${Number(k) / 2}`,
      insight: ({ x, k }) => {
        const X = Number(x)
        const K = Number(k)
        return `思った数が${X}なら、${2 * X} → ${2 * X + K} → ${X + K / 2} → ${K / 2}。ほかの数にしても答えは${K / 2}。文字 $x$ で書くと、はじめの数がひかれて消えるので、いつも同じになる。`
      },
    },
    uses: [
      { emoji: '📊', title: '表計算ソフトの式', text: '「=B2*3」のように、ます目の名前（文字）で式を書くと、中の数を変えても計算し直してくれる。' },
      { emoji: '💻', title: 'プログラムの変数', text: 'プログラムでは、変わる数に名前（文字）をつけて式を書く。文字の式と同じ考え方だ。' },
      { emoji: '📏', title: '公式', text: '長方形の面積 $S=ab$ のように、公式は「どんな長さでも成り立つ」ことを文字で表している。' },
    ],
    units: ['expr1', 'calc2'],
    basics: ['b-letters'],
  },
]
