import { st } from './entry.js'

// 語彙強化ロングリーディング（約3,000語）の構造台帳。節ごとに手で確かめて足していく。
// いまは #1〜#80 まで。残りは台帳ができるまで解析器の表示のまま。
export default Object.freeze([
  st('[S A river basin] [V is] [C the whole area {前| of land} {関係>the whole area of land| [M from which] [S rain and melting snow] [V drain] [M {前| into one single river}]}].', {
    chunks: [
      ['A river basin is the whole area of land', '流域とは土地全体のことです（どんな土地かは次へ）'],
      ['from which rain and melting snow drain', 'そこから雨と解けた雪が流れ込む'],
      ['into one single river', '一本の川へ'],
    ],
    notes: {
      'from which rain and melting snow drain': 'from which は「前置詞＋関係代名詞」で、from the area（その土地から）の意味です。',
    },
  }),
  st('[S Its outer boundary] [V is marked] [M {前| by ridges {前| of high ground}}] [M {前| rather than {前| by any line {関係>any line| [O that] [S a government] [V has] [M ever] [V set out and agreed on]}}}].', {
    chunks: [
      ['Its outer boundary is marked by ridges', 'その外側の境は尾根で示されます'],
      ['of high ground', '高い土地の'],
      ['rather than by any line', 'どんな線によってでもなく'],
      ['that a government has ever set out and agreed on', '政府が定めて合意した（線）'],
    ],
    notes: {
      'Its outer boundary is marked by ridges': 'ridge は「尾根」、boundary は「境目」。',
    },
  }),
  st('[S That single difference] [V explains] [O a great deal {前| of the trouble {関係>the trouble| [O that] [S shared river basins] [V tend] [O {to:名詞| [V to produce]}] [M later]}}].', {
    chunks: [
      ['That single difference explains a great deal', 'このたった一つの違いが多くを説明します（何のかは次へ）'],
      ['of the trouble', '厄介ごとの'],
      ['that shared river basins tend to produce later', '共有される流域がのちに生みがちな（厄介ごとの）'],
    ],
    notes: {
      'that shared river basins tend to produce later': 'tend to ＋ 動詞 で「〜しがちである」。that は to produce の目的語にあたります。',
    },
  }),
  st('[S Rain {関係>Rain| [S that] [V falls] [M {前| on a forest}]}] [V does not reach] [O the channel] [M {前| in the same way {関係>the same way| [M that] [S rain {現在分詞>rain| [V falling] [M {前| on a paved road}]}] [V does]}}].', {
    chunks: [
      ['Rain that falls on a forest', '森に降る雨は'],
      ['does not reach the channel', '川筋に届きません（どう届かないかは次へ）'],
      ['in the same way that rain', '雨と同じようには'],
      ['falling on a paved road does', '舗装された道路に降る（雨と）'],
    ],
    notes: {
      'in the same way that rain': 'the same way that ＋ 主語 ＋ 動詞 で「〜するのと同じように」。',
    },
  }),
  st('[S Leaves, roots, and the loose floor {前| of a forest}] [M all] [V slow] [O the water] [M down] [接 and] [V let] [O a large part {前| of it}] [C {原形| [V sink] [M {前| into the ground}]}].', {
    chunks: [
      ['Leaves, roots, and the loose floor of a forest', '葉と根と、森のやわらかい地面が'],
      ['all slow the water down', 'どれも水の流れを遅くし'],
      ['and let a large part of it sink into the ground', 'その多くを地下へしみ込ませます'],
    ],
    notes: {
      'and let a large part of it sink into the ground': 'let ＋ 目的語 ＋ 動詞の原形 で「〜が…するのを許す」。',
    },
  }),
  st('[S Water {関係>Water| [S that] [V sinks] [M {前| into the ground}]}] [V is stored up] [M {前| for later}], [M {副詞節:対比| [接 while] [S water {関係>water| [S that] [V runs off] [O the surface]}] [V arrives] [M quickly and all {前| at once}]}].', {
    chunks: [
      ['Water that sinks into the ground', '地下にしみ込む水は'],
      ['is stored up for later,', 'のちのために蓄えられます'],
      ['while water that runs off the surface', '一方、地表を流れ去る水は'],
      ['arrives quickly and all at once', '速く、一度に到達します'],
    ],
    notes: {
      'while water that runs off the surface': 'run off … で「…の表面を流れ去る」。',
    },
  }),
  st('[S A basin] [M therefore] [V behaves] [M far less] [M {前| like a simple pipe}] [M than {前| like a sponge {前| with a very uneven surface}}].', {
    chunks: [
      ['A basin therefore behaves far less like a simple pipe', 'したがって流域は単純な管のようにはふるまいません'],
      ['than like a sponge', 'むしろ海綿のようです'],
      ['with a very uneven surface', '表面がひどく不揃いな'],
    ],
    notes: {
      'A basin therefore behaves far less like a simple pipe': 'less like A than like B で「AというよりB」。',
    },
  }),
  st('[S Snow] [V adds] [O a delay {前| of several months} {関係>a delay| [M that] [S farmers {現在分詞>farmers| [V living] [M downstream]}] [V have depended] [M on] [M {前| for many centuries}]}].', {
    chunks: [
      ['Snow adds a delay of several months', '雪は数か月の遅れをもたらします（どんな遅れかは次へ）'],
      ['that farmers living downstream', '下流に暮らす農民が'],
      ['have depended on for many centuries', '何世紀も頼ってきた（遅れを）'],
    ],
    notes: {
      'have depended on for many centuries': 'depend on … で「…に頼る」。文の終わりに on が残っています。',
    },
  }),
  st('[S A deep layer {前| of winter snow}] [V collects] [O several months {前| of rainfall}] [接 and] [M then] [V releases] [O it] [M slowly] [M {前| through the spring and the early summer}].', {
    chunks: [
      ['A deep layer of winter snow', '冬の深い積雪は'],
      ['collects several months of rainfall', '数か月分の降水を集め'],
      ['and then releases it slowly', 'そしてそのあとゆっくり放出します'],
      ['through the spring and the early summer', '春から初夏にかけて'],
    ],
    notes: {
      'collects several months of rainfall': 'rainfall は「降水量」。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S more {前| of that rainfall}] [V arrives] [M {前| as rain}] [M {前| instead of snow}]}], [S the same annual total] [V reaches] [O the fields] [M {前| at the wrong time {前| of year}}].', {
    chunks: [
      ['When more of that rainfall arrives as rain', 'その降水がより多く雨として降ると'],
      ['instead of snow,', '雪ではなく'],
      ['the same annual total reaches the fields', '年間の総量は同じでも、畑に届くのは'],
      ['at the wrong time of year', '一年のうち都合の悪い時期です'],
    ],
    notes: {
      'instead of snow,': 'instead of … で「…の代わりに」。',
    },
  }),
  st('[S The contrast {前| between those two patterns}] [V matters] [M far more] [M {前| than the average figure {関係>the average figure| [O that] [S most reports] [V choose] [O {to:名詞| [V to quote]}]}}].', {
    chunks: [
      ['The contrast between those two patterns', 'この二つの型の対比は'],
      ['matters far more', 'はるかに重要です（何よりかは次へ）'],
      ['than the average figure', '平均値よりも'],
      ['that most reports choose to quote', '多くの報告が引く（平均値よりも）'],
    ],
    notes: {
      'that most reports choose to quote': 'quote は「引用する・数字を挙げる」。that は to quote の目的語にあたります。',
    },
  }),
  st('[S Fog, pollen, and fine sand] [V are] [M all] [V carried] [M {前| into the basin}] [M {前| by the same moving air {関係>the same moving air| [S that] [M also] [V brings] [O the rain]}}].', {
    chunks: [
      ['Fog, pollen, and fine sand are all carried', '霧と花粉と細かな砂は、どれも運ばれます'],
      ['into the basin', '流域の中へ'],
      ['by the same moving air that also brings the rain', '雨を運ぶのと同じ動く空気によって'],
    ],
    notes: {
      'Fog, pollen, and fine sand are all carried': 'pollen は「花粉」、fine sand は「細かな砂」。',
    },
  }),
  st('[S {what節| [O What] [S a river] [M actually] [V contains]}] [V is] [M therefore] [M partly] [C a record {前| of {what節| [O what] [S the wind] [V has picked up] [M {前| along the way}]}}].', {
    chunks: [
      ['What a river actually contains', '川が実際に含んでいるものは'],
      ['is therefore partly a record', 'したがって一部は記録です（何のかは次へ）'],
      ['of what the wind has picked up along the way', '風が道々拾い上げてきたものの'],
    ],
    notes: {
      'of what the wind has picked up along the way': 'pick up … で「…を拾い上げる」。along the way は「途中で」。',
    },
  }),
  st('[S A lake {前| near the middle {前| of a basin}}] [V acts] [M {前| as a quiet pool {関係>a quiet pool| [M in which] [S much {前| of this drifting material}] [V can settle]}}].', {
    chunks: [
      ['A lake near the middle of a basin', '流域の中ほどにある湖は'],
      ['acts as a quiet pool', '静かな水たまりの役目をします（どんな役目かは次へ）'],
      ['in which much of this drifting material can settle', 'その中でこの漂う物質の多くが沈む'],
    ],
    notes: {
      'acts as a quiet pool': 'act as … で「…の役目をする」。settle は「沈む」。',
    },
  }),
  st('[S Its water] [V leaves] [O the lake] [M much clearer] [M {副詞節:比較| [接 than] [S it] [V entered]}], [接 and] [S its bed] [M slowly] [V gains] [O a layer {関係>a layer| [O that] [S scientists] [V can] [M later] [V read]}].', {
    chunks: [
      ['Its water leaves the lake much clearer', '湖から出る水はずっと澄んでいます'],
      ['than it entered,', '入ってきたときよりも'],
      ['and its bed slowly gains a layer', 'そして湖底にはゆっくり層が積もります'],
      ['that scientists can later read', '科学者がのちに読み取れる（層が）'],
    ],
    notes: {
      'and its bed slowly gains a layer': 'bed はここでは「湖底」。',
    },
  }),
  st('[S An anomaly {前| in a single season}] [V is] [C quite ordinary], [接 but] [S a long run {前| of them}] [V is] [C an indication {前| of something else}].', {
    chunks: [
      ['An anomaly in a single season is quite ordinary,', '一つの季節の異常はごくありふれたことです'],
      ['but a long run of them', 'しかしそれが長く続けば'],
      ['is an indication of something else', '別の何かの兆しです'],
    ],
    notes: {
      'but a long run of them': 'a long run of … で「…が長く続くこと」。',
    },
  }),
  st('[S {動名詞| [V Separating] [O an ordinary season] [M {前| from a real change}]}] [V requires] [O records {関係>records| [S that] [V run] [M longer] [M {前| than any single working career}]}].', {
    chunks: [
      ['Separating an ordinary season from a real change', 'ふつうの季節と本当の変化を見分けるには'],
      ['requires records that run longer', '長く続く記録が要ります'],
      ['than any single working career', 'どんな一人の職業人生よりも'],
    ],
    notes: {
      'requires records that run longer': 'run はここでは「（期間が）続く」。',
    },
  }),
  st('[S Communities {関係>Communities| [S that] [V begin] [O {動名詞| [V keeping] [O such records] [M early]}]}] [V can see] [O a crisis] [C approaching] [M {副詞節:時| [接 while] [S it] [V is] [M still] [C relatively cheap] [M {to:副詞(形容詞)| [V to answer]}]}].', {
    chunks: [
      ['Communities that begin keeping such records early', '早くからそうした記録を取り始める地域は'],
      ['can see a crisis approaching', '危機が近づくのを見て取れます'],
      ['while it is still relatively cheap to answer', 'まだ比較的安く対処できるうちに'],
    ],
    notes: {
      'can see a crisis approaching': 'see ＋ 目的語 ＋ -ing で「〜が…しているのを見る」。',
    },
  }),
  st('[S Those {関係>Those| [S that] [V begin] [O {動名詞| [V measuring]}] [M only] [M {前| after a flood}]}] [V must argue] [M {前| about the past}] [M {前| as well as {前| about the future}}].', {
    chunks: [
      ['Those that begin measuring only after a flood', '洪水のあとで初めて測り始める地域は'],
      ['must argue about the past', '過去について争わねばなりません'],
      ['as well as about the future', '未来についてだけでなく'],
    ],
    notes: {
      'as well as about the future': 'A as well as B で「BだけでなくAも」。',
    },
  }),
  st('[S The first practical step {前| in any river basin}] [V is] [M therefore] [C a plain one], [M {関係,>a plain one| [S which] [V is] [C {to:補語| [M simply] [V to keep] [O the numbers] [M year {前| after year}]}]}].', {
    chunks: [
      ['The first practical step in any river basin', 'どの流域でも最初の実際的な一歩は'],
      ['is therefore a plain one,', 'したがって地味なものです'],
      ['which is simply to keep the numbers', 'すなわち、ただ数値を取り続けること'],
      ['year after year', '毎年'],
    ],
    notes: {
      'which is simply to keep the numbers': 'コンマの後ろの which は、直前の a plain one を言いかえています。',
    },
  }),
  st('[S A river] [V is not] [M merely] [C a volume {前| of moving water}], [M {副詞節:理由| [接 because] [S it] [V is] [M also] [C a corridor {関係>a corridor| [M along which] [S living things] [V travel]}]}].', {
    chunks: [
      ['A river is not merely a volume of moving water,', '川は単に動く水の量ではありません'],
      ['because it is also a corridor', 'なぜならそれは通り道でもあるからです'],
      ['along which living things travel', 'そこを生き物が移動する'],
    ],
    notes: {
      'along which living things travel': 'along which は「前置詞＋関係代名詞」で、along the corridor（その通り道に沿って）の意味です。',
    },
  }),
  st('[S Fish, insects, birds, and seeds] [M all] [V use] [O the same narrow channel] [M {前| for purposes {関係>purposes| [S that] [V have] [O nothing {to:形容詞>nothing| [V to do] [M {前| with each other}]}]}}].', {
    chunks: [
      ['Fish, insects, birds, and seeds', '魚と昆虫と鳥と種子は'],
      ['all use the same narrow channel', 'どれも同じ狭い川筋を使います'],
      ['for purposes that have nothing to do with each other', '互いに関係のない目的で'],
    ],
    notes: {
      'for purposes that have nothing to do with each other': 'have nothing to do with … で「…と何の関係もない」。',
    },
  }),
  st('[S A change {関係>A change| [S that] [V seems] [C small] [M {前| to an engineer}]}] [V can be] [C devastating] [M {前| to a species {関係>a species| [S that] [V depends] [M {前| on one narrow stage {前| of it}}]}}].', {
    chunks: [
      ['A change that seems small to an engineer', '技術者には小さく見える変化が'],
      ['can be devastating to a species', 'ある種にとっては壊滅的になりえます'],
      ['that depends on one narrow stage of it', '川の狭い一段階に頼る（種にとっては）'],
    ],
    notes: {
      'can be devastating to a species': 'devastating は「壊滅的な」。',
    },
  }),
  st('[S Temperature] [V is] [M perhaps] [C the clearest example {前| of a quiet variable {関係>a quiet variable| [S that] [V produces] [O genuinely dramatic effects]}}].', {
    chunks: [
      ['Temperature is perhaps the clearest example', '温度はおそらく最も明確な例です（何のかは次へ）'],
      ['of a quiet variable', '静かな変数の'],
      ['that produces genuinely dramatic effects', '本当に劇的な影響を生む（変数の）'],
    ],
    notes: {
      'of a quiet variable': 'variable は「変わりうるもの・変数」。',
    },
  }),
  st('[S Many aquatic animals] [V are] [M highly] [C susceptible {前| to thermal change}] [M {副詞節:理由| [接 because] [S they] [V cannot regulate] [O their own body heat]}].', {
    chunks: [
      ['Many aquatic animals are highly susceptible', '多くの水生動物はきわめて影響を受けやすいのです'],
      ['to thermal change', '温度の変化に'],
      ['because they cannot regulate their own body heat', '自分の体温を調節できないので'],
    ],
    notes: {
      'to thermal change': 'be susceptible to … で「…の影響を受けやすい」。thermal は「熱の」。',
    },
  }),
  st('[S A rise {前| of only two degrees}] [V may be] [C adequate {to:副詞(形容詞)| [V to end] [O reproduction] [M {前| for one species}]}] [M {副詞節:対比| [接 while] [S another] [V becomes] [C more energetic]}].', {
    chunks: [
      ['A rise of only two degrees may be adequate', 'わずか二度の上昇でも十分でありえます'],
      ['to end reproduction for one species', 'ある種の繁殖を終わらせるのに'],
      ['while another becomes more energetic', '一方で別の種はより活発になります'],
    ],
    notes: {
      'A rise of only two degrees may be adequate': 'adequate は「十分な」。',
    },
  }),
  st('[S The result] [V is] [C not simply a loss but a new arrangement {関係>a new arrangement| [S whose winners] [V are] [C very hard {to:副詞(形容詞)| [V to predict] [M {前| in advance}]}]}].', {
    chunks: [
      ['The result is not simply a loss', 'その結果は単なる喪失ではなく'],
      ['but a new arrangement', '新しい組み替えです'],
      ['whose winners are very hard to predict in advance', 'その勝者は前もって予測するのがとても難しい（組み替え）'],
    ],
    notes: {
      'whose winners are very hard to predict in advance': 'whose ＋ 名詞 で「その〜の…」。ここは組み替えの勝者を指します。',
    },
  }),
  st('[S The vegetation {前| along a river bank}] [V does] [O far more useful work] [M {副詞節:比較| [接 than] [S its modest appearance] [V suggests]}].', {
    chunks: [
      ['The vegetation along a river bank', '川岸に沿った植生は'],
      ['does far more useful work', 'はるかに役立つ働きをします'],
      ['than its modest appearance suggests', '地味な見かけから思われるよりも'],
    ],
    notes: {
      'The vegetation along a river bank': 'vegetation は「（ある場所の）植物全体」。bank はここでは「岸」。',
    },
  }),
  st('[S Roots] [V hold] [O the soil] [M {前| in place}], [S shade] [V cools] [O the water], [接 and] [S fallen leaves] [V feed] [O the insects {関係>the insects| [M that] [S fish] [V depend] [M on]}].', {
    chunks: [
      ['Roots hold the soil in place,', '根は土をその場につなぎとめ'],
      ['shade cools the water,', '日陰は水を冷やし'],
      ['and fallen leaves feed the insects', 'そして落ち葉は昆虫を養います'],
      ['that fish depend on', '魚が頼る（昆虫を）'],
    ],
    notes: {
      'Roots hold the soil in place,': 'hold … in place で「…をその場に固定する」。',
    },
  }),
  st('[S {動名詞| [V Removing] [O that narrow strip]}] [V is] [C cheap and quick], [M {副詞節:対比| [接 while] [S {動名詞| [V restoring] [O the same function]}] [V may take] [O several decades]}].', {
    chunks: [
      ['Removing that narrow strip is cheap and quick,', 'その細い帯を取り除くのは安く速いのですが'],
      ['while restoring the same function', '一方、同じ働きを取り戻すには'],
      ['may take several decades', '数十年かかることがあります'],
    ],
    notes: {
      'Removing that narrow strip is cheap and quick,': 'strip はここでは「細長い帯状の土地」。',
    },
  }),
  st('[S This asymmetry {前| between damage and repair}] [V is] [M probably] [C the single most important fact {前| about all living systems}].', {
    chunks: [
      ['This asymmetry between damage and repair', '損なう側と直す側のあいだのこの非対称は'],
      ['is probably the single most important fact', 'おそらく最も重要なただ一つの事実です'],
      ['about all living systems', '生きた仕組みすべてについて'],
    ],
    notes: {
      'This asymmetry between damage and repair': 'asymmetry は「つり合っていないこと」。',
    },
  }),
  st('[S Species {関係>Species| [S that] [V arrive] [M {前| from elsewhere}]}] [V are described] [M {前| as harmful}] [M only] [M {副詞節:時| [接 after] [S they] [V have already spread] [M widely]}].', {
    chunks: [
      ['Species that arrive from elsewhere', 'よそから来た種が'],
      ['are described as harmful only', '有害だと言われるのはようやく（いつかは次へ）'],
      ['after they have already spread widely', 'すでに広く広がったあとです'],
    ],
    notes: {
      'are described as harmful only': 'describe A as B で「AをBだと言う」。ここは受け身です。',
    },
  }),
  st('[M {前| Before that point}] [S they] [M simply] [V look] [M {前| like an ordinary addition {前| to a long list {関係>a long list| [O that] [S nobody] [V has] [O the time {to:形容詞>the time| [V to read]}]}}}].', {
    chunks: [
      ['Before that point they simply look', 'その時点までは、ただ〜のように見えます'],
      ['like an ordinary addition', 'ありふれた追加'],
      ['to a long list that nobody has the time to read', 'だれも読む時間のない長い目録への'],
    ],
    notes: {
      'to a long list that nobody has the time to read': 'the time to read で「読むための時間」。that は to read の目的語にあたります。',
    },
  }),
  st('[S A prevalent new species] [V can push] [O a native population] [M {前| toward the verge {前| of collapse}}] [M {前| within a few short seasons}].', {
    chunks: [
      ['A prevalent new species can push', '広く行きわたった新しい種は押しやることがあります'],
      ['a native population', '在来の個体群を'],
      ['toward the verge of collapse', '崩壊の瀬戸際へ'],
      ['within a few short seasons', 'わずか数季のうちに'],
    ],
    notes: {
      'toward the verge of collapse': 'the verge of … で「…の瀬戸際」。',
    },
  }),
  st('[S {動名詞| [V Preventing] [O the arrival]}] [V is] [C far cheaper] [M {前| than any campaign {前| of removal} {関係>any campaign| [S that] [V follows] [O a failure {to:形容詞>a failure| [V to prevent] [O it]}]}}].', {
    chunks: [
      ['Preventing the arrival is far cheaper', '到達を防ぐほうがはるかに安上がりです'],
      ['than any campaign of removal', 'どんな駆除の取り組みよりも'],
      ['that follows a failure to prevent it', '防ぎ損ねたあとに続く（取り組みよりも）'],
    ],
    notes: {
      'that follows a failure to prevent it': 'a failure to ＋ 動詞 で「〜しそこねること」。',
    },
  }),
  st('[S Long chains {前| of cause and effect}] [V make] [O the whole system] [C genuinely difficult {to:副詞(形容詞)| [V to describe] [M {前| with any confidence}]}].', {
    chunks: [
      ['Long chains of cause and effect', '原因と結果の長い連なりが'],
      ['make the whole system genuinely difficult', 'その仕組み全体を本当に難しくします'],
      ['to describe with any confidence', '自信を持って書き表すのが'],
    ],
    notes: {
      'make the whole system genuinely difficult': 'make ＋ 目的語 ＋ 形容詞 で「〜を…にする」。',
    },
  }),
  st('[S A cautious scientist] [V will] [M therefore] [V call] [O an early conclusion] [C tentative], [接 and] [S that careful word] [V is not] [C a weakness] [M {前| at all}].', {
    chunks: [
      ['A cautious scientist will therefore call', 'それゆえ慎重な科学者は呼びます（何をどうかは次へ）'],
      ['an early conclusion tentative,', '早い段階の結論を「暫定的」と'],
      ['and that careful word is not a weakness at all', 'そしてその慎重な語は弱さなどではありません'],
    ],
    notes: {
      'an early conclusion tentative,': 'call ＋ 目的語 ＋ 形容詞 で「〜を…と呼ぶ」。tentative は「暫定的な」。',
    },
  }),
  st('[S It] [V records] [O {疑問詞節| [S how much {前| of the evidence}] [V has already arrived]} and {疑問詞節| [S how much {前| of it}] [V is] [M still] [M {前| on the way}]}].', {
    chunks: [
      ['It records how much of the evidence', 'それは証拠のどれだけが〜かを記録します'],
      ['has already arrived', 'すでに届いている'],
      ['and how much of it is still on the way', 'そしてどれだけがまだ途中かを'],
    ],
    notes: {
      'and how much of it is still on the way': 'on the way で「途中で・向かっているところ」。',
    },
  }),
  st('[S Readers {関係>Readers| [S who] [V treat] [O every careful wording] [C {前| as doubt}]}] [V will misread] [O the most responsible work {前| in the whole field}].', {
    chunks: [
      ['Readers who treat every careful wording', '慎重な言い回しをどれも〜と受け取る読者は'],
      ['as doubt', '疑いだと'],
      ['will misread the most responsible work', '最も責任ある仕事を読み違えます'],
      ['in the whole field', 'この分野全体で'],
    ],
    notes: {
      'as doubt': 'treat A as B で「AをBとして扱う」。',
    },
  }),
  st('[S The useful question] [V is] [M never] [C {whether節| [接 whether] [S the science] [V is] [M fully] [C certain]}, but rather {疑問詞節| [S which parts {前| of it}] [V are] [C settled enough {to:副詞(程度)| [V to act] [M on]}]}].', {
    chunks: [
      ['The useful question is never', '役に立つ問いは決して〜ではありません'],
      ['whether the science is fully certain,', '科学が完全に確実かどうか'],
      ['but rather which parts of it', 'そうではなく、そのどの部分が'],
      ['are settled enough to act on', '行動できるほど固まっているか、です'],
    ],
    notes: {
      'are settled enough to act on': 'act on … で「…に基づいて行動する」。文の終わりに on が残っています。',
    },
  }),
  st('[S Agriculture] [V takes] [O more water] [M out] [M {前| of most river basins}] [M {前| than every city and every factory {過去分詞>every city and every factory| [V combined]}}].', {
    chunks: [
      ['Agriculture takes more water', '農業はより多くの水を取り出します'],
      ['out of most river basins', 'たいていの流域から'],
      ['than every city and every factory combined', 'すべての都市と工場を合わせたよりも'],
    ],
    notes: {
      'than every city and every factory combined': 'combined は「合わせた」で、直前の名詞を後ろから説明します。',
    },
  }),
  st('[S That single fact] [V decides] [O {疑問詞節| [M how] [S any serious argument {前| about water scarcity {前| in a basin}}] [V has to begin]}].', {
    chunks: [
      ['That single fact decides how', 'このたった一つの事実が決めます（何をかは次へ）'],
      ['any serious argument about water scarcity', '水不足についての真剣な議論を'],
      ['in a basin has to begin', '流域でどう始めねばならないかを'],
    ],
    notes: {
      'any serious argument about water scarcity': 'scarcity は「足りないこと」。',
    },
  }),
  st('[S A change {前| in the crops {関係>the crops| [O that] [S farmers] [V plant]}}] [V will move] [O more water] [M {前| than any campaign {過去分詞>any campaign| [V aimed] [M {前| at households}]}}].', {
    chunks: [
      ['A change in the crops that farmers plant', '農民が植える作物が変わることは'],
      ['will move more water', 'より多くの水を動かします'],
      ['than any campaign aimed at households', '家庭に向けたどんな取り組みよりも'],
    ],
    notes: {
      'than any campaign aimed at households': 'aimed at … は「…に向けた」で、campaign を後ろから説明します。',
    },
  }),
  st('[S Soil] [V is] [C the part {前| of the whole system} {関係>the part| [S that] [V is] [C easiest {to:副詞(形容詞)| [V to damage]} and hardest {to:副詞(形容詞)| [V to replace]}]}].', {
    chunks: [
      ['Soil is the part of the whole system', '土はこの仕組み全体の中の部分です（どんな部分かは次へ）'],
      ['that is easiest to damage', '最も傷つけやすく'],
      ['and hardest to replace', '最も取り替えにくい（部分）'],
    ],
    notes: {
      'that is easiest to damage': 'easiest to ＋ 動詞 で「最も〜しやすい」。',
    },
  }),
  st('[仮S It] [V takes] [O several centuries] [真S {to:名詞| [V to build up] [O a few centimeters {前| of good soil}]}] [接 and] [O a single wet season] [真S {to:名詞| [V to lose] [O them] [M again]}].', {
    chunks: [
      ['It takes several centuries to build up', '何世紀もかかります、作り上げるのに'],
      ['a few centimeters of good soil', '数センチのよい土を'],
      ['and a single wet season to lose them again', 'そして失うには一度の雨季で足ります'],
    ],
    notes: {
      'It takes several centuries to build up': 'It takes ＋ 時間 ＋ to ＋ 動詞 で「〜するのに…かかる」。',
    },
  }),
  st('[S Bare ground {前| between two harvests}] [V is] [C the moment {関係>the moment| [M at which] [S a field] [V is] [M most likely] [V to wash away]}].', {
    chunks: [
      ['Bare ground between two harvests', '収穫と収穫のあいだの裸の地面こそ'],
      ['is the moment', 'その瞬間です（どんな瞬間かは次へ）'],
      ['at which a field is most likely to wash away', '畑が最も流されやすい'],
    ],
    notes: {
      'at which a field is most likely to wash away': 'be likely to ＋ 動詞 で「〜しそうだ」。wash away は「流される」。',
    },
  }),
  st('[S Farmers {関係>Farmers| [S who] [V keep] [O a cover crop] [C growing] [M {前| through that gap}]}] [V lose] [O far less {前| of the layer {関係省略:目的格(depend)>the layer| [S they] [V depend] [M on]}}].', {
    chunks: [
      ['Farmers who keep a cover crop growing', '被覆作物を育て続ける農民は'],
      ['through that gap', 'その空いた期間ずっと'],
      ['lose far less of the layer', 'その層をはるかに少なくしか失いません'],
      ['they depend on', '自分が頼っている（層を）'],
    ],
    notes: {
      'Farmers who keep a cover crop growing': 'keep ＋ 目的語 ＋ -ing で「〜を…させ続ける」。cover crop は「土を覆うための作物」。',
    },
  }),
  st('[S Fertilizer {関係>Fertilizer| [O that] [S a plant] [V does not take up]}] [V does not] [M simply] [V vanish] [M {前| from the field {関係>the field| [M where] [S it] [V was spread]}}].', {
    chunks: [
      ['Fertilizer that a plant does not take up', '作物が吸い上げなかった肥料は'],
      ['does not simply vanish', 'ただ消えてなくなるわけではありません'],
      ['from the field where it was spread', 'まかれた畑から'],
    ],
    notes: {
      'Fertilizer that a plant does not take up': 'take up … で「…を吸い上げる」。',
    },
  }),
  st('[S It] [V travels] [M {前| with the next heavy rain}] [M {前| into a ditch}], [M then] [M {前| into a stream}], [接 and] [M finally] [M {前| into water {関係>water| [O that] [S other people] [V use]}}].', {
    chunks: [
      ['It travels with the next heavy rain', 'それは次の大雨とともに移動します'],
      ['into a ditch, then into a stream,', '用水路へ、次に小川へ'],
      ['and finally into water that other people use', 'そして最後にほかの人が使う水へ'],
    ],
    notes: {
      'into a ditch, then into a stream,': 'ditch は「溝・用水路」。',
    },
  }),
  st('[M Downstream] [S the very same chemical {関係>the very same chemical| [S that] [V raised] [O a yield]}] [V can feed] [O an enormous growth {前| of water plants and weeds}].', {
    chunks: [
      ['Downstream the very same chemical', '下流では、まったく同じ化学物質が'],
      ['that raised a yield', '収量を上げた（その物質が）'],
      ['can feed an enormous growth of water plants and weeds', '水草や雑草の膨大な繁殖を養いえます'],
    ],
    notes: {
      'that raised a yield': 'yield は名詞で「収穫量」。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S that growth] [V dies] [接 and] [V decays]}], [S it] [V removes] [O the oxygen {関係>the oxygen| [M on which] [S the fish and insects] [V depend]}].', {
    chunks: [
      ['When that growth dies and decays,', 'その繁殖が枯れて分解するとき'],
      ['it removes the oxygen', 'それは酸素を奪います（どんな酸素かは次へ）'],
      ['on which the fish and insects depend', '魚や昆虫が頼っている（酸素を）'],
    ],
    notes: {
      'on which the fish and insects depend': 'on which は「前置詞＋関係代名詞」で、depend on … の on です。',
    },
  }),
  st('[S Irrigation] [V raises] [O yields] [M surely and steadily], [接 and] [M yet] [S it] [M also] [V concentrates] [O salt] [M {前| in the very ground {関係>the very ground| [O that] [S it] [V waters]}}].', {
    chunks: [
      ['Irrigation raises yields surely and steadily,', '灌漑は確実に着実に収量を上げます'],
      ['and yet it also concentrates salt', 'それでいて塩も集めてしまいます'],
      ['in the very ground that it waters', 'まさに水をやっている土地に'],
    ],
    notes: {
      'in the very ground that it waters': 'water はここでは動詞で「水をやる」。',
    },
  }),
  st('[S Every drop {前| of water} {関係>Every drop of water| [S that] [V evaporates]}] [V leaves] [M behind] [O any minerals {関係>any minerals| [O that] [S it] [V happened] [C {to:補語| [V to be carrying]}]}].', {
    chunks: [
      ['Every drop of water that evaporates', '蒸発する水の一滴ごとに'],
      ['leaves behind any minerals', '鉱物を残していきます'],
      ['that it happened to be carrying', 'たまたま運んでいた（鉱物を）'],
    ],
    notes: {
      'leaves behind any minerals': 'leave behind … で「…を後に残す」。',
    },
  }),
  st('[S A field] [V can] [M therefore] [V become] [C steadily less productive] [M {副詞節:対比| [接 while] [S every single season] [M still] [V looks] [C successful] [M {前| at harvest}]}].', {
    chunks: [
      ['A field can therefore become steadily less productive', 'そのため畑は着実に実らなくなっていきます'],
      ['while every single season still looks successful', 'どの季節も成功に見えながら'],
      ['at harvest', '収穫のときには'],
    ],
    notes: {
      'A field can therefore become steadily less productive': 'less productive で「生産力が落ちた」。',
    },
  }),
  st('[S Drainage {関係>Drainage| [S that] [V carries] [O the salt] [M away]}] [V is] [C expensive], [接 and] [S it] [V moves] [O the problem] [M {前| to someone further {前| down the valley}}].', {
    chunks: [
      ['Drainage that carries the salt away', '塩を運び去る排水は'],
      ['is expensive,', '費用がかかります'],
      ['and it moves the problem', 'そして問題を移すだけです'],
      ['to someone further down the valley', '谷のさらに下流のだれかへ'],
    ],
    notes: {
      'Drainage that carries the salt away': 'carry … away で「…を運び去る」。',
    },
  }),
  st('[S Trade] [V hides] [O much {前| of this}], [M {副詞節:理由| [接 because] [S a country {関係>a country| [S that] [V imports] [O grain]}] [V is] [M also] [V importing] [O water {関係>water| [O that] [S it] [M never] [V sees]}]}].', {
    chunks: [
      ['Trade hides much of this,', '貿易はこの多くを覆い隠します'],
      ['because a country that imports grain', 'なぜなら穀物を輸入する国は'],
      ['is also importing water that it never sees', '目にすることのない水も輸入しているからです'],
    ],
    notes: {
      'is also importing water that it never sees': 'that は sees の目的語にあたる関係代名詞です。',
    },
  }),
  st('[S A dry region] [V can eat] [M well] [M {前| for many decades}] [M {前| by {動名詞| [V buying] [O {what節| [O what] [S its own rainfall] [V could] [M never] [V support]}]}}].', {
    chunks: [
      ['A dry region can eat well for many decades', '乾いた地域も何十年もよく食べられます'],
      ['by buying what', '〜ものを買うことで'],
      ['its own rainfall could never support', '自らの降水では決して支えられない'],
    ],
    notes: {
      'by buying what': 'what は先行詞を含む関係代名詞で、「〜するもの」というまとまりを作ります。',
    },
  }),
  st('[S That arrangement] [V is] [C neither dishonest nor unstable], [接 but] [S it] [V does depend] [M {前| on a market {関係>a market| [S that] [V stays] [C open]}}].', {
    chunks: [
      ['That arrangement is neither dishonest nor unstable,', 'その仕組みは不誠実でも不安定でもありません'],
      ['but it does depend on a market', 'しかし市場に頼ってはいます（どんな市場かは次へ）'],
      ['that stays open', '開かれたままの（市場に）'],
    ],
    notes: {
      'That arrangement is neither dishonest nor unstable,': 'neither A nor B で「AでもBでもない」。',
    },
  }),
  st('[S A single export restriction] [V can turn] [O an ordinary shortage] [M {前| into a full crisis}] [M several borders away].', {
    chunks: [
      ['A single export restriction can turn', '一度の輸出制限が変えることがあります'],
      ['an ordinary shortage into a full crisis', 'ありふれた不足を本格的な危機に'],
      ['several borders away', '国境をいくつも越えた先で'],
    ],
    notes: {
      'several borders away': 'several borders away で「国境をいくつも隔てた所で」。',
    },
  }),
  st('[S {動名詞| [V Reading] [O a food price]}] [M therefore] [V means] [O {動名詞| [V reading] [O rainfall, soil, policy, and shipping costs] [M all] [M {前| at the same time}]}].', {
    chunks: [
      ['Reading a food price therefore means', 'したがって食料の値段を読むとは'],
      ['reading rainfall, soil, policy, and shipping costs', '降水と土と政策と輸送費を読むことです'],
      ['all at the same time', 'どれも同時に'],
    ],
    notes: {
      'reading rainfall, soil, policy, and shipping costs': 'mean ＋ -ing で「〜することを意味する」。',
    },
  }),
  st('[S The clearest link {前| between a river and a human body}] [V is] [C an infection {過去分詞>an infection| [V carried] [M {前| by water}]}].', {
    chunks: [
      ['The clearest link between a river and a human body', '川と人の体を結ぶ最も明確なつながりは'],
      ['is an infection carried by water', '水が運ぶ感染です'],
    ],
    notes: {
      'is an infection carried by water': 'carried by water は an infection を後ろから説明する過去分詞のまとまりです。',
    },
  }),
  st('[S A pathogen {関係>A pathogen| [S that] [V survives] [O a short journey] [M downstream]}] [V can reach] [O thousands {前| of households}] [M {前| within a single day}].', {
    chunks: [
      ['A pathogen that survives a short journey downstream', '下流への短い旅を生き延びる病原体は'],
      ['can reach thousands of households', '何千もの家庭に届きえます'],
      ['within a single day', 'たった一日のうちに'],
    ],
    notes: {
      'A pathogen that survives a short journey downstream': 'pathogen は「病原体」。downstream は「下流へ」。',
    },
  }),
  st('[S {動名詞| [V Separating] [O drinking water] [M {前| from waste water}]}] [V is] [M therefore] [C the oldest and cheapest public health measure {関係>the oldest and cheapest public health measure| [S that] [V is known]}].', {
    chunks: [
      ['Separating drinking water from waste water', '飲み水を排水から切り離すことは'],
      ['is therefore the oldest and cheapest public health measure', 'したがって最も古く最も安い公衆衛生の手だてです'],
      ['that is known', '知られている（手だての中で）'],
    ],
    notes: {
      'is therefore the oldest and cheapest public health measure': 'measure はここでは「対策・手だて」。',
    },
  }),
  st('[S Every later advance {前| in medicine}] [V rests] [M {前| on that basic separation}] [M {前| rather than {動名詞| [V replacing] [O it] [M {前| in any way}]}}].', {
    chunks: [
      ['Every later advance in medicine rests', '医学のその後のどの進歩も成り立っています（何の上かは次へ）'],
      ['on that basic separation', 'その基本の分離の上に'],
      ['rather than replacing it in any way', 'それに取って代わるのではなく'],
    ],
    notes: {
      'on that basic separation': 'rest on … で「…の上に成り立つ」。',
    },
  }),
  st('[S Incidence] [V tells] [O1 a community] [O2 {疑問詞節| [S how many new cases {前| of an illness}] [V appeared] [M {前| inside a clearly stated period {前| of time}}]}].', {
    chunks: [
      ['Incidence tells a community', '発生率は地域に伝えます（何をかは次へ）'],
      ['how many new cases of an illness appeared', '病気の新しい例が何件現れたかを'],
      ['inside a clearly stated period of time', 'はっきり示された期間の中で'],
    ],
    notes: {
      'Incidence tells a community': 'tell ＋ 人 ＋ 内容 で「人に〜を伝える」。incidence は「発生率」。',
    },
  }),
  st('[S A number {前| with no such period {過去分詞>no such period| [V attached] [M {前| to it}]}}] [V can be read] [C {to:補語| [V to mean] [O almost anything] [M {前| at all}]}].', {
    chunks: [
      ['A number with no such period attached to it', 'そうした期間が添えられていない数字は'],
      ['can be read to mean almost anything at all', 'ほとんど何とでも読めてしまいます'],
    ],
    notes: {
      'A number with no such period attached to it': 'attached to it は period を後ろから説明して「それに添えられた」。',
    },
  }),
  st('[S Reports {関係>Reports| [S that] [V compare] [O two regions]}] [V must] [M also] [V state] [O {疑問詞節| [M how hard] [S each {前| of them}] [M actually] [V looked] [M {前| for cases}]}].', {
    chunks: [
      ['Reports that compare two regions', '二つの地域を比べる報告は'],
      ['must also state how hard', 'どれほど熱心に〜かも述べねばなりません'],
      ['each of them actually looked for cases', 'それぞれが実際に患者を探したか'],
    ],
    notes: {
      'each of them actually looked for cases': 'look for … で「…を探す」。',
    },
  }),
  st('[S A place {関係>A place| [S that] [V tests] [O its own people] [M carefully]}] [V will] [M always] [V appear] [C less healthy] [M {前| than a place {関係>a place| [S that] [V tests] [M rarely]}}].', {
    chunks: [
      ['A place that tests its own people carefully', '自分の住民を丁寧に検査する場所は'],
      ['will always appear less healthy', 'いつも不健康に見えます'],
      ['than a place that tests rarely', 'めったに検査しない場所よりも'],
    ],
    notes: {
      'will always appear less healthy': 'appear ＋ 形容詞 で「〜に見える」。',
    },
  }),
  st('[S Nutrition] [V connects] [O the same river] [M {前| to the same human body}] [M {前| along a much slower and much quieter path}].', {
    chunks: [
      ['Nutrition connects the same river', '栄養は同じ川を結びます'],
      ['to the same human body', '同じ人の体へ'],
      ['along a much slower and much quieter path', 'もっと遅く、もっと静かな道筋で'],
    ],
    notes: {
      'Nutrition connects the same river': 'connect A to B で「AをBに結び付ける」。',
    },
  }),
  st('[S Malnutrition] [V weakens] [O the immune response], [M {副詞節:結果| [接 so that] [S an otherwise mild infection] [V can become] [C a serious one]}].', {
    chunks: [
      ['Malnutrition weakens the immune response,', '栄養不良は免疫の反応を弱めます'],
      ['so that an otherwise mild infection', 'その結果、ふだんなら軽い感染が'],
      ['can become a serious one', '重いものになりえます'],
    ],
    notes: {
      'so that an otherwise mild infection': 'so that … で「その結果…」。otherwise は「そうでなければ」。',
    },
  }),
  st('[S Protein and clean water] [V are] [M therefore] [V treated] [M together] [M {前| in any program {関係>any program| [S that] [M seriously] [V expects] [O {to:名詞| [V to see] [O results]}]}}].', {
    chunks: [
      ['Protein and clean water are therefore treated together', 'したがってたんぱく質と清潔な水は一緒に扱われます'],
      ['in any program that seriously expects', '本気で〜を見込むどの計画でも'],
      ['to see results', '成果が出ると'],
    ],
    notes: {
      'to see results': 'expect to ＋ 動詞 で「〜すると見込む」。',
    },
  }),
  st('[S {動名詞| [V Treating] [O either {前| of them}] [M alone]}] [V produces] [O figures {関係>figures| [S that] [V look] [C encouraging] [M {前| on paper}] [接 and] [V change] [O very little]}].', {
    chunks: [
      ['Treating either of them alone', 'どちらか一方だけを扱うと'],
      ['produces figures that look encouraging', '励みになるように見える数字が出ますが'],
      ['on paper and change very little', '紙の上だけで、実際はほとんど変わりません'],
    ],
    notes: {
      'on paper and change very little': 'on paper は「書類の上では」。',
    },
  }),
  st('[S A flood] [V does] [O a kind {前| of damage} {関係>a kind of damage| [O that] [S no clinic] [V can] [M ever] [V record] [M {前| on an ordinary chart {前| of injuries}}]}].', {
    chunks: [
      ['A flood does a kind of damage', '洪水はある種の害をもたらします（どんな害かは次へ）'],
      ['that no clinic can ever record', 'どの診療所も記録できない'],
      ['on an ordinary chart of injuries', 'ふつうの外傷の記録票には'],
    ],
    notes: {
      'A flood does a kind of damage': 'do damage で「害を与える」。',
    },
  }),
  st('[S Families {関係>Families| [S that] [V have lost] [O a house]}] [V carry] [O a strain {関係>a strain| [S that] [V lasts] [M long] [M {副詞節:時| [接 after] [S the water itself] [V has disappeared]}]}].', {
    chunks: [
      ['Families that have lost a house', '家を失った家族は'],
      ['carry a strain that lasts long', '長く続く負担を抱えます'],
      ['after the water itself has disappeared', '水そのものが引いたあとも'],
    ],
    notes: {
      'carry a strain that lasts long': 'strain は「重い負担・張りつめた状態」。',
    },
  }),
  st('[S Grief, fear {前| of the next season}, and the loss {前| of ordinary routine}] [V can] [M all] [V be measured] [M {副詞節:条件| [接 if] [S anyone] [V chooses] [O {to:名詞| [V to measure] [O them]}]}].', {
    chunks: [
      ['Grief, fear of the next season,', '悲しみと、次の季節への恐れと'],
      ['and the loss of ordinary routine', 'ふだんの暮らしの型が失われることは'],
      ['can all be measured', 'どれも測ることができます'],
      ['if anyone chooses to measure them', 'だれかが測ろうとしさえすれば'],
    ],
    notes: {
      'and the loss of ordinary routine': 'routine は「決まった日々の過ごし方」。',
    },
  }),
  st('[S Programs {関係>Programs| [S that] [V ignore] [O this part {前| of the harm}]}] [V will] [M consistently] [V underestimate] [O {what節| [O what] [S a full recovery] [V is going to cost]}].', {
    chunks: [
      ['Programs that ignore this part of the harm', '害のこの部分を無視する計画は'],
      ['will consistently underestimate', '決まって低く見積もります（何をかは次へ）'],
      ['what a full recovery is going to cost', '完全な回復にかかる費用を'],
    ],
    notes: {
      'what a full recovery is going to cost': 'cost はここでは動詞で「（費用が）かかる」。',
    },
  }),
  st('[S Distance] [M quietly] [V decides] [O {疑問詞節| [O how much {前| of any {前| of this treatment}}] [S a household] [V is actually able to obtain]}].', {
    chunks: [
      ['Distance quietly decides how much', '距離が静かに決めます、どれだけを（次へ）'],
      ['of any of this treatment', 'こうした手当てのうち'],
      ['a household is actually able to obtain', '家庭が実際に受けられるかを'],
    ],
    notes: {
      'a household is actually able to obtain': 'be able to obtain で「手に入れられる」。',
    },
  }),
  st('[S A clinic two hours away] [V is used] [M only] [M {前| for emergencies}] [接 and] [M almost never] [M {前| for the small problems {関係>the small problems| [S that] [V precede] [O them]}}].', {
    chunks: [
      ['A clinic two hours away is used only', '二時間かかる診療所が使われるのは'],
      ['for emergencies', '緊急のときだけで'],
      ['and almost never for the small problems', '小さな不調にはほとんど使われません'],
      ['that precede them', 'その前に起こる（不調には）'],
    ],
    notes: {
      'that precede them': 'precede … で「…より先に起こる」。',
    },
  }),
  st('[S Telemedicine] [V narrows] [O part {前| of that gap}], [M {副詞節:譲歩| [接 although] [S it] [V can] [M neither] [V set] [O a fracture] [接 nor] [V deliver] [O a vaccine]}].', {
    chunks: [
      ['Telemedicine narrows part of that gap,', '遠隔医療はその隔たりの一部を狭めます'],
      ['although it can neither set a fracture', 'ただし骨折を治すことも'],
      ['nor deliver a vaccine', 'ワクチンを届けることもできません'],
    ],
    notes: {
      'although it can neither set a fracture': 'neither A nor B で「AもBも〜ない」。set a fracture は「骨折を整える」。',
    },
  }),
  st('[S The remaining distance] [V has to be closed] [M {前| by better roads}], [M {前| by more staff}], [接 or] [M {前| by {動名詞| [V moving] [O the service itself] [M closer]}}].', {
    chunks: [
      ['The remaining distance has to be closed', '残った距離は埋めるほかありません（どうやってかは次へ）'],
      ['by better roads, by more staff,', 'よりよい道路か、より多くの人員か'],
      ['or by moving the service itself closer', 'あるいは提供の場そのものを近づけることで'],
    ],
    notes: {
      'The remaining distance has to be closed': 'close a distance で「隔たりを埋める」。',
    },
  }),
])
