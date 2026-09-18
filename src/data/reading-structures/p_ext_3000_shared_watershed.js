import { st } from './entry.js'

// 語彙強化ロングリーディング（約3,000語）の構造台帳。節ごとに手で確かめて足していく。
// 全160文（十の節すべて）を手で確かめて書いた。残りは台帳ができるまで解析器の表示のまま。
export default Object.freeze([
  st('[S A river basin] [V is] [C the whole area {前| of land} {関係>the whole area of land| [M from which] [S {並列| rain | and melting snow}] [V drain] [M {前| into one single river}]}].', {
    chunks: [
      ['A river basin is the whole area of land', '流域とは土地全体のことです（どんな土地かは次へ）'],
      ['from which rain and melting snow drain', 'そこから雨と解けた雪が流れ込む'],
      ['into one single river', '一本の川へ'],
    ],
    notes: {
      'from which rain and melting snow drain': 'from which は「前置詞＋関係代名詞」で、from the area（その土地から）の意味です。',
    },
  }),
  st('[S Its outer boundary] [V is marked] [M {前| by ridges {前| of high ground}}] [M {前| rather than {前| by any line {関係>any line| [O that] [S a government] [V has] [M ever] [V {並列| set out | and agreed on}]}}}].', {
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
  st('[S {並列| Leaves, | roots, | and the loose floor {前| of a forest}}] [M all] [V slow] [O the water] [M down] [接 and] [V let] [O a large part {前| of it}] [C {原形| [V sink] [M {前| into the ground}]}].', {
    chunks: [
      ['Leaves, roots, and the loose floor of a forest', '葉と根と、森のやわらかい地面が'],
      ['all slow the water down', 'どれも水の流れを遅くし'],
      ['and let a large part of it sink into the ground', 'その多くを地下へしみ込ませます'],
    ],
    notes: {
      'and let a large part of it sink into the ground': 'let ＋ 目的語 ＋ 動詞の原形 で「〜が…するのを許す」。',
    },
  }),
  st('[S Water {関係>Water| [S that] [V sinks] [M {前| into the ground}]}] [V is stored up] [M {前| for later}], [M {副詞節:対比| [接 while] [S water {関係>water| [S that] [V runs off] [O the surface]}] [V arrives] [M {並列| quickly | and all {前| at once}}]}].', {
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
  st('[S A deep layer {前| of winter snow}] [V collects] [O several months {前| of rainfall}] [接 and] [M then] [V releases] [O it] [M slowly] [M {前| through {並列| the spring | and the early summer}}].', {
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
  st('[S {並列| Fog, | pollen, | and fine sand}] [V are] [M all] [V carried] [M {前| into the basin}] [M {前| by the same moving air {関係>the same moving air| [S that] [M also] [V brings] [O the rain]}}].', {
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
  st('[S The first practical step {前| in any river basin}] [V is] [M therefore] [C a plain one], [M {関係,>a plain one| [S which] [V is] [C {to:補語| [M simply] [V to keep] [O the numbers] [M {反復| year after year}]}]}].', {
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
  st('[S {並列| Fish, | insects, | birds, | and seeds}] [M all] [V use] [O the same narrow channel] [M {前| for purposes {関係>purposes| [S that] [V have] [O nothing {to:形容詞>nothing| [V to do] [M {前| with each other}]}]}}].', {
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
  st('[S The result] [V is] [C {並列| not simply a loss | but a new arrangement {関係>a new arrangement| [S whose winners] [V are] [C very hard {to:副詞(形容詞)| [V to predict] [M {前| in advance}]}]}}].', {
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
  st('[S {動名詞| [V Removing] [O that narrow strip]}] [V is] [C {並列| cheap | and quick}], [M {副詞節:対比| [接 while] [S {動名詞| [V restoring] [O the same function]}] [V may take] [O several decades]}].', {
    chunks: [
      ['Removing that narrow strip is cheap and quick,', 'その細い帯を取り除くのは安く速いのですが'],
      ['while restoring the same function', '一方、同じ働きを取り戻すには'],
      ['may take several decades', '数十年かかることがあります'],
    ],
    notes: {
      'Removing that narrow strip is cheap and quick,': 'strip はここでは「細長い帯状の土地」。',
    },
  }),
  st('[S This asymmetry {前| between {並列| damage | and repair}}] [V is] [M probably] [C the single most important fact {前| about all living systems}].', {
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
  st('[S Long chains {前| of {並列| cause | and effect}}] [V make] [O the whole system] [C genuinely difficult {to:副詞(形容詞)| [V to describe] [M {前| with any confidence}]}].', {
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
  st('[S It] [V records] [O {並列| {疑問詞節| [S how much {前| of the evidence}] [V has already arrived]} | and {疑問詞節| [S how much {前| of it}] [V is] [M still] [M {前| on the way}]}}].', {
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
  st('[S The useful question] [V is] [M never] [C {並列| {whether節| [接 whether] [S the science] [V is] [M fully] [C certain]}, | but rather {疑問詞節| [S which parts {前| of it}] [V are] [C settled enough {to:副詞(程度)| [V to act] [M on]}]}}].', {
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
  st('[S Agriculture] [V takes] [O more water] [M out] [M {前| of most river basins}] [M {前| than {並列| every city | and every factory} {過去分詞>every city and every factory| [V combined]}}].', {
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
  st('[S Soil] [V is] [C the part {前| of the whole system} {関係>the part| [S that] [V is] [C {並列| easiest {to:副詞(形容詞)| [V to damage]} | and hardest {to:副詞(形容詞)| [V to replace]}}]}].', {
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
  st('[S It] [V travels] [M {前| with the next heavy rain}] {並列| [M {前| into a ditch}], | [M then] [M {前| into a stream}], | [接 and] [M finally] [M {前| into water {関係>water| [O that] [S other people] [V use]}}]}.', {
    chunks: [
      ['It travels with the next heavy rain', 'それは次の大雨とともに移動します'],
      ['into a ditch, then into a stream,', '用水路へ、次に小川へ'],
      ['and finally into water that other people use', 'そして最後にほかの人が使う水へ'],
    ],
    notes: {
      'into a ditch, then into a stream,': 'ditch は「溝・用水路」。',
    },
  }),
  st('[M Downstream] [S the very same chemical {関係>the very same chemical| [S that] [V raised] [O a yield]}] [V can feed] [O an enormous growth {前| of {並列| water plants | and weeds}}].', {
    chunks: [
      ['Downstream the very same chemical', '下流では、まったく同じ化学物質が'],
      ['that raised a yield', '収量を上げた（その物質が）'],
      ['can feed an enormous growth of water plants and weeds', '水草や雑草の膨大な繁殖を養いえます'],
    ],
    notes: {
      'that raised a yield': 'yield は名詞で「収穫量」。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S that growth] [V dies] [接 and] [V decays]}], [S it] [V removes] [O the oxygen {関係>the oxygen| [M on which] [S the {並列| fish | and insects}] [V depend]}].', {
    chunks: [
      ['When that growth dies and decays,', 'その繁殖が枯れて分解するとき'],
      ['it removes the oxygen', 'それは酸素を奪います（どんな酸素かは次へ）'],
      ['on which the fish and insects depend', '魚や昆虫が頼っている（酸素を）'],
    ],
    notes: {
      'on which the fish and insects depend': 'on which は「前置詞＋関係代名詞」で、depend on … の on です。',
    },
  }),
  st('[S Irrigation] [V raises] [O yields] [M {並列| surely | and steadily}], [接 and yet] [S it] [M also] [V concentrates] [O salt] [M {前| in the very ground {関係>the very ground| [O that] [S it] [V waters]}}].', {
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
  st('[S That arrangement] [V is] [C {並列| neither dishonest | nor unstable}], [接 but] [S it] [V does depend] [M {前| on a market {関係>a market| [S that] [V stays] [C open]}}].', {
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
  st('[S {動名詞| [V Reading] [O a food price]}] [M therefore] [V means] [O {動名詞| [V reading] [O {並列| rainfall, | soil, | policy, | and shipping costs}] [M all] [M {前| at the same time}]}].', {
    chunks: [
      ['Reading a food price therefore means', 'したがって食料の値段を読むとは'],
      ['reading rainfall, soil, policy, and shipping costs', '降水と土と政策と輸送費を読むことです'],
      ['all at the same time', 'どれも同時に'],
    ],
    notes: {
      'reading rainfall, soil, policy, and shipping costs': 'mean ＋ -ing で「〜することを意味する」。',
    },
  }),
  st('[S The clearest link {前| between {並列| a river | and a human body}}] [V is] [C an infection {過去分詞>an infection| [V carried] [M {前| by water}]}].', {
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
  st('[S {動名詞| [V Separating] [O drinking water] [M {前| from waste water}]}] [V is] [M therefore] [C the {並列| oldest | and cheapest public health measure} {関係>the oldest and cheapest public health measure| [S that] [V is known]}].', {
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
  st('[S Nutrition] [V connects] [O the same river] [M {前| to the same human body}] [M {前| along {並列| a much slower | and much quieter path}}].', {
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
  st('[S {並列| Protein | and clean water}] [V are] [M therefore] [V treated] [M together] [M {前| in any program {関係>any program| [S that] [M seriously] [V expects] [O {to:名詞| [V to see] [O results]}]}}].', {
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
  st('[S {並列| Grief, | fear {前| of the next season}, | and the loss {前| of ordinary routine}}] [V can] [M all] [V be measured] [M {副詞節:条件| [接 if] [S anyone] [V chooses] [O {to:名詞| [V to measure] [O them]}]}].', {
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
  st('[S A clinic two hours away] [V is used] {並列| [M only] [M {前| for emergencies}] | [接 and] [M almost never] [M {前| for the small problems {関係>the small problems| [S that] [V precede] [O them]}}]}.', {
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
  st('[S Most {前| of the equipment {関係>the equipment| [S that] [V delivers] [O water] [M {前| to a house}]}}] [V is] [V buried] [M underground] [接 and] [M therefore] [C easy {to:副詞(形容詞)| [V to forget]}].', {
    chunks: [
      ['Most of the equipment that delivers water', '水を届ける設備の大半は'],
      ['to a house is buried underground', '家まで、地下に埋められていて'],
      ['and therefore easy to forget', 'そのため忘れられがちです'],
    ],
    notes: {
      'and therefore easy to forget': 'easy to ＋ 動詞 で「〜しやすい」。ここは is が省かれています。',
    },
  }),
  st('[S A pipe {過去分詞>A pipe| [V installed] [M a century ago]}] [V may] [M still] [V work] [M perfectly] [M {副詞節:対比| [接 while] [S the one {前| beside it}] [V is] [C close {前| to failure}]}].', {
    chunks: [
      ['A pipe installed a century ago', '百年前に敷かれた管が'],
      ['may still work perfectly', 'いまも完璧に働くことがあります'],
      ['while the one beside it is close to failure', '一方、その隣の管は壊れる寸前ということも'],
    ],
    notes: {
      'A pipe installed a century ago': 'installed a century ago は A pipe を後ろから説明する過去分詞のまとまりです。',
    },
  }),
  st('[S Nobody] [V can separate] [O the two] [M {前| from the surface}] [M alone] [M {前| without {並列| instruments | and a careful survey {前| of the network}}}].', {
    chunks: [
      ['Nobody can separate the two', 'その二つを見分けられる人はいません'],
      ['from the surface alone', '地表からだけでは'],
      ['without instruments and a careful survey', '器具と丁寧な調査がなければ'],
      ['of the network', '管の網の'],
    ],
    notes: {
      'from the surface alone': 'alone はここでは「〜だけでは」。',
    },
  }),
  st('[S Maintenance] [M therefore] [V competes] [M {前| for money}] [M {前| against new projects {関係>new projects| [O that] [S the public] [V can] [M actually] [V see] [接 and] [M even] [V admire]}}].', {
    chunks: [
      ['Maintenance therefore competes for money', 'したがって維持管理は予算を奪い合います'],
      ['against new projects', '新しい事業と'],
      ['that the public can actually see and even admire', '人々が実際に目にし、感心さえできる（事業と）'],
    ],
    notes: {
      'Maintenance therefore competes for money': 'compete for … で「…を求めて争う」。',
    },
  }),
  st('[S A network full {前| of small leaks}] [V loses] [O a fixed share {前| of everything {関係>everything| [S that] [V is] [M ever] [V pumped] [M {前| into its pipes}]}}].', {
    chunks: [
      ['A network full of small leaks', '小さな漏れだらけの管網は'],
      ['loses a fixed share of everything', '送り込まれたものの一定の割合を失います'],
      ['that is ever pumped into its pipes', 'その管に送り込まれた（もののうち）'],
    ],
    notes: {
      'A network full of small leaks': 'full of … で「…だらけの」。',
    },
  }),
  st('[M {前| In some cities}] [S that share] [V reaches] [O a third {前| of the total}], [M {関係,>前の内容| [S which] [V is] [C more] [M {副詞節:比較| [接 than] [S any conservation campaign] [V could save]}]}].', {
    chunks: [
      ['In some cities that share reaches a third', '都市によってはその割合が三分の一に達します'],
      ['of the total,', '全体の'],
      ['which is more than any conservation campaign could save', 'それはどんな節水の呼びかけで減らせる量より多いのです'],
    ],
    notes: {
      'which is more than any conservation campaign could save': 'コンマの後ろの which は、前の内容全体を受けています。',
    },
  }),
  st('[S {動名詞| [V Finding] [O those leaks]}] [V is] [C {並列| quiet | and patient work} {関係>quiet and patient work| [S that] [V produces] [O no photograph worth {動名詞| [V printing] [M {前| in a newspaper}]}]}].', {
    chunks: [
      ['Finding those leaks is quiet and patient work', '漏れを見つけるのは静かで根気のいる仕事です'],
      ['that produces no photograph', '写真の一枚も生まない（仕事）'],
      ['worth printing in a newspaper', '新聞に載せる価値のある'],
    ],
    notes: {
      'worth printing in a newspaper': 'worth ＋ -ing で「〜する価値がある」。',
    },
  }),
  st('[S It] [V is] [M also] [C the cheapest new supply {関係>the cheapest new supply| [S that] [V is] [C available] [M {前| to almost every older city {前| in the world}}]}].', {
    chunks: [
      ['It is also the cheapest new supply', 'それは同時に最も安い新しい水源でもあります'],
      ['that is available', '手に入る（水源の中で）'],
      ['to almost every older city in the world', '世界のほとんどすべての古い都市にとって'],
    ],
    notes: {
      'It is also the cheapest new supply': 'supply はここでは「供給・水源」。',
    },
  }),
  st('[S Roads] [V change] [O a basin] [M quite as much] [M {前| as any dam}], [M {副詞節:譲歩| [接 although] [S they] [V are] [M rarely] [V counted] [M {前| as water projects}] [M {前| at all}]}].', {
    chunks: [
      ['Roads change a basin quite as much as any dam,', '道路はどのダムにも劣らず流域を変えます'],
      ['although they are rarely counted', 'ただし数えられることはまれです'],
      ['as water projects at all', '水の事業としては'],
    ],
    notes: {
      'Roads change a basin quite as much as any dam,': 'as much as … で「…と同じくらい」。',
    },
  }),
  st('[S A hard paved surface] [V sends] [O rain] [M straight] [M {前| to the nearest drain}] [M {前| instead of {動名詞| [V letting] [O it] [C {原形| [V soak] [M {前| into the ground}]}]}}].', {
    chunks: [
      ['A hard paved surface sends rain straight', '硬い舗装は雨をまっすぐ送ります'],
      ['to the nearest drain', '最も近い排水口へ'],
      ['instead of letting it soak into the ground', '地面にしみ込ませる代わりに'],
    ],
    notes: {
      'instead of letting it soak into the ground': 'let ＋ 目的語 ＋ 動詞の原形 で「〜が…するままにする」。',
    },
  }),
  st('[S The same storm] [M therefore] [V produces] [O {並列| a higher | and much faster peak}] [M {前| in a city}] [M than {前| in an open field}].', {
    chunks: [
      ['The same storm therefore produces', 'そのため同じ嵐でも生みます（何をかは次へ）'],
      ['a higher and much faster peak', 'より高く、ずっと速い出水の頂点を'],
      ['in a city than in an open field', '開けた畑でよりも都市で'],
    ],
    notes: {
      'a higher and much faster peak': 'peak はここでは「水かさが最も高くなるとき」。',
    },
  }),
  st('[S Engineers] [V can slow] [O that peak] [M {前| with {並列| holding pools, | gardens, | and open surfaces} {関係>holding pools, gardens, and open surfaces| [S that] [V cost] [M far less] [M {前| than a concrete wall}]}}].', {
    chunks: [
      ['Engineers can slow that peak', '技術者はその頂点を緩やかにできます（何でかは次へ）'],
      ['with holding pools, gardens, and open surfaces', '調整池と庭と開いた地面で'],
      ['that cost far less than a concrete wall', 'コンクリートの壁よりはるかに安い（もので）'],
    ],
    notes: {
      'with holding pools, gardens, and open surfaces': 'holding pool は「水をためておく池」。',
    },
  }),
  st('[S Buildings] [M then] [V decide] [O {疑問詞節| [S who] [V is exposed] [M {前| on the day {関係>the day| [M when] [S the peak {前| of a flood}] [V arrives] [M {前| in any case}]}}]}].', {
    chunks: [
      ['Buildings then decide who is exposed', '建物は、だれがさらされるのかを決めます'],
      ['on the day when the peak of a flood arrives', '出水の頂点が来る日に'],
      ['in any case', 'いずれにせよ'],
    ],
    notes: {
      'Buildings then decide who is exposed': 'この who は疑問詞で、「だれがさらされるのか」という間接疑問を作ります。',
    },
  }),
  st('[S A ground floor {関係>A ground floor| [S that] [V is used] [M {前| for storage}]}] [V recovers] [M {前| from a flood}] [M far more easily] [M {前| than one {過去分詞>one| [V used] [M {前| for sleeping}]}}].', {
    chunks: [
      ['A ground floor that is used for storage', '物置として使われる一階は'],
      ['recovers from a flood far more easily', '洪水からはるかに容易に立ち直ります'],
      ['than one used for sleeping', '寝室として使われる一階よりも'],
    ],
    notes: {
      'than one used for sleeping': 'この one は a ground floor の代わりです。',
    },
  }),
  st('[S Rules {関係>Rules| [S that] [V require] [O the second {前| of these uses}] [C {to:補語| [V to sit] [M higher]}]}] [V are] [C cheap] [M {副詞節:時| [接 while] [S a district] [V is] [M still] [V being built]}].', {
    chunks: [
      ['Rules that require the second of these uses', 'この二つのうち後者の使い方に求める規則は'],
      ['to sit higher are cheap', 'より高い階に置くよう、安上がりです'],
      ['while a district is still being built', '地区がまだ建設中のあいだは'],
    ],
    notes: {
      'to sit higher are cheap': 'require ＋ 目的語 ＋ to ＋ 動詞 で「〜に…するよう求める」。',
    },
  }),
  st('[S The very same rules] [V become] [C extremely expensive] [M {副詞節:時| [接 once] [S that district] [V has been finished] [接 and] [M fully] [V occupied]}].', {
    chunks: [
      ['The very same rules become extremely expensive', 'まったく同じ規則が非常に高くつきます'],
      ['once that district has been finished', 'その地区ができあがり'],
      ['and fully occupied', '人がすっかり住んだあとでは'],
    ],
    notes: {
      'once that district has been finished': 'once は「いったん〜すると」。occupied は「人が入った」。',
    },
  }),
  st('[S Every single one {前| of these choices}] [M quietly] [V moves] [O some cost] [M {前| between {並列| the present | and the future}}].', {
    chunks: [
      ['Every single one of these choices', 'こうした選択の一つ一つが'],
      ['quietly moves some cost', '静かに費用を移します'],
      ['between the present and the future', '現在と未来のあいだで'],
    ],
    notes: {
      'Every single one of these choices': 'every single … で「一つ残らず…」。',
    },
  }),
  st('[S {動名詞| [V Deferring] [O maintenance]}] [V is not] [M really] [C {動名詞| [V saving] [O money]}], [M {副詞節:理由| [接 because] [S it] [V is borrowing] [M {前| against a repair {関係>a repair| [S that] [M only] [V grows] [C larger]}}]}].', {
    chunks: [
      ['Deferring maintenance is not really saving money,', '維持を先送りすることは、実は節約ではありません'],
      ['because it is borrowing', 'なぜならそれは借りているからです（何からかは次へ）'],
      ['against a repair that only grows larger', '大きくなる一方の修理を担保に'],
    ],
    notes: {
      'because it is borrowing': 'borrow against … で「…を当てにして借りる」。',
    },
  }),
  st('[S The interest {前| on that loan}] [V is paid] [M {前| by the family {関係>the family| [S that] [V happens] [C {to:補語| [V to be living] [M there] [M {副詞節:時| [接 when] [S the pipe] [M finally] [V breaks]}]}]}}].', {
    chunks: [
      ['The interest on that loan is paid', 'その借りの利子を払うのは'],
      ['by the family that happens to be living there', 'たまたまそこに住んでいる家族です'],
      ['when the pipe finally breaks', '管がついに壊れたとき'],
    ],
    notes: {
      'by the family that happens to be living there': 'happen to ＋ 動詞 で「たまたま〜している」。',
    },
  }),
  st('[S A budget {関係>A budget| [S that] [V states] [O all {前| of this}] [M openly]}] [V is] [C far easier {to:副詞(形容詞)| [V to defend]}] [M {前| than one {関係>one| [S that] [M simply] [V postpones] [O the question]}}].', {
    chunks: [
      ['A budget that states all of this openly', 'これをすべて率直に述べる予算は'],
      ['is far easier to defend', '守るのがはるかに簡単です'],
      ['than one that simply postpones the question', '問いをただ先送りする予算よりも'],
    ],
    notes: {
      'is far easier to defend': 'defend はここでは「（批判に対して）擁護する」。',
    },
  }),
  st('[S {並列| Water | and energy}] [V are] [M so closely] [C linked together] [M {副詞節:結果| [接 that] [S neither {前| of them}] [V can be planned] [M {前| on its own}]}].', {
    chunks: [
      ['Water and energy are so closely linked together', '水とエネルギーはとても密接に結び付いていて'],
      ['that neither of them can be planned', 'どちらも計画できません'],
      ['on its own', 'それだけでは'],
    ],
    notes: {
      'that neither of them can be planned': 'so … that 〜 で「とても…なので〜」。neither of … は「どちらも〜ない」。',
    },
  }),
  st('[S {動名詞| [V Moving] [O water] [M up] [M {前| to a higher place}]}] [V takes] [O electricity], [接 and] [S {動名詞| [V generating] [O that electricity]}] [M usually] [V takes] [O a great deal {前| of water}].', {
    chunks: [
      ['Moving water up to a higher place takes electricity,', '水を高い所へ動かすには電力が要ります'],
      ['and generating that electricity', 'そしてその電力を作るには'],
      ['usually takes a great deal of water', 'たいてい多くの水が要ります'],
    ],
    notes: {
      'Moving water up to a higher place takes electricity,': 'take はここでは「（費用や労力が）かかる」。',
    },
  }),
  st('[S A drought] [M therefore] [V reduces] [O power output] [M {前| at exactly the moment {関係>the moment| [M when] [S the demand {前| for {動名詞| [V pumping] [O water]}}] [V rises]}}].', {
    chunks: [
      ['A drought therefore reduces power output', 'そのため干ばつは発電量を減らします'],
      ['at exactly the moment', 'まさにその瞬間に'],
      ['when the demand for pumping water rises', '水をくみ上げる必要が高まる（瞬間に）'],
    ],
    notes: {
      'A drought therefore reduces power output': 'output は「産出量」。drought は「干ばつ」。',
    },
  }),
  st('[S {動名詞| [V Planning] [O either {前| of these two systems}] [M {前| without the other}]}] [V guarantees] [O a shortage {関係>a shortage| [O that] [S nobody {前| in charge}] [V predicted]}].', {
    chunks: [
      ['Planning either of these two systems', 'この二つの仕組みのどちらかを計画することは'],
      ['without the other', 'もう一方を抜きに'],
      ['guarantees a shortage that nobody in charge predicted', '責任者のだれも予測しなかった不足を確実に招きます'],
    ],
    notes: {
      'guarantees a shortage that nobody in charge predicted': 'in charge で「担当している・責任のある」。',
    },
  }),
  st('[S A dam] [V is] [C {並列| the most visible machine {前| in any basin} | and also the hardest one {to:副詞(形容詞)| [V to evaluate] [M honestly]}}].', {
    chunks: [
      ['A dam is the most visible machine in any basin', 'ダムはどの流域でも最も目につく機械であり'],
      ['and also the hardest one', '同時に最も難しい機械です'],
      ['to evaluate honestly', '誠実に評価するのが'],
    ],
    notes: {
      'and also the hardest one': 'この one は machine の代わりです。',
    },
  }),
  st('[S It] [V stores] [O water], [V produces] [O power], [V controls] [O floods], [接 and] [V blocks] [O the movement {前| of fish}] [M all] [M {前| at the same time}].', {
    chunks: [
      ['It stores water, produces power,', 'それは水を蓄え、電力を生み'],
      ['controls floods,', '洪水を抑え'],
      ['and blocks the movement of fish all at the same time', '同時に魚の移動をさえぎります'],
    ],
    notes: {
      'and blocks the movement of fish all at the same time': 'block は「さえぎる」。all at the same time で「どれも同時に」。',
    },
  }),
  st('[S Each {前| of those four effects}] [V is] [M entirely] [C real], [接 and] [S no single number] [V can combine] [O them] [M {前| into one verdict}].', {
    chunks: [
      ['Each of those four effects is entirely real,', 'その四つの影響はどれもまぎれもない事実です'],
      ['and no single number can combine them', 'そしてどんな一つの数字もそれらをまとめられません'],
      ['into one verdict', '一つの判定へと'],
    ],
    notes: {
      'into one verdict': 'verdict は「判定・結論」。',
    },
  }),
  st('[S Arguments {前| about dams}] [M usually] [V turn out] [C {to:補語| [V to be] [C arguments {前| about {疑問詞節| [S which {前| of those effects}] [V gets counted] [M first]}}]}].', {
    chunks: [
      ['Arguments about dams usually turn out', 'ダムをめぐる議論はたいてい〜だと分かります'],
      ['to be arguments about', '〜についての議論だと'],
      ['which of those effects gets counted first', 'その影響のどれを最初に数えるか'],
    ],
    notes: {
      'which of those effects gets counted first': 'get ＋ 過去分詞 で「〜される」。which of … は「…のどれが」。',
    },
  }),
  st('[S Smaller machines] [M now] [V do] [O a growing share {前| of the work {関係>the work| [S that] [V used to require] [O a large structure]}}].', {
    chunks: [
      ['Smaller machines now do a growing share', '小さな機械がいまや増えつつある割合を担っています'],
      ['of the work', '仕事のうち'],
      ['that used to require a large structure', 'かつては大きな構造物を必要とした（仕事の）'],
    ],
    notes: {
      'that used to require a large structure': 'used to ＋ 動詞 で「かつては〜した」。',
    },
  }),
  st('[S A valve {関係>A valve| [S that] [V opens] [M {前| on a fixed schedule}]}] [V can hold back] [O a flood peak {関係>a flood peak| [S that] [V would] [M otherwise] [V pass] [M downstream]}].', {
    chunks: [
      ['A valve that opens on a fixed schedule', '決まった時刻に開く弁は'],
      ['can hold back a flood peak', '出水の頂点をせき止められます'],
      ['that would otherwise pass downstream', 'そうでなければ下流へ抜けていく（頂点を）'],
    ],
    notes: {
      'that would otherwise pass downstream': 'otherwise は「そうでなければ」。hold back … で「…をせき止める」。',
    },
  }),
  st('[S A pump {関係>A pump| [S that] [V is controlled] [M {前| by a sensor}]}] [V uses] [O far less electricity] [M {前| than one {関係>one| [S that] [M simply] [V runs] [M all day]}}].', {
    chunks: [
      ['A pump that is controlled by a sensor', 'センサーで制御される揚水機は'],
      ['uses far less electricity', 'はるかに少ない電力しか使いません'],
      ['than one that simply runs all day', '一日中ただ動き続ける揚水機よりも'],
    ],
    notes: {
      'than one that simply runs all day': 'この one は pump の代わりです。',
    },
  }),
  st('[S These gains] [V are] [C quiet ones], [接 and] [M {分詞構文:条件| [V added] [M together]}] [S they] [M often] [V exceed] [O {what節| [O what] [S an entire new power plant] [V could supply]}].', {
    chunks: [
      ['These gains are quiet ones,', 'こうした改善は地味なものです'],
      ['and added together they often exceed', 'しかし合わせれば、しばしば上回ります'],
      ['what an entire new power plant could supply', '新しい発電所ひとつが供給できる量を'],
    ],
    notes: {
      'and added together they often exceed': 'added together は「合わせると」という条件を表す分詞のまとまりです。',
    },
  }),
  st('[S Control] [V has] [M now] [V moved] [M {前| from {並列| valves | and levers}}] [M {前| to software {関係>software| [S that] [V runs] [M {前| on servers far away}]}}].', {
    chunks: [
      ['Control has now moved from valves and levers', '制御はいまや弁やてこから移りました'],
      ['to software that runs', '動くソフトウェアへと'],
      ['on servers far away', '遠く離れたサーバーの上で'],
    ],
    notes: {
      'to software that runs': 'run はここでは「（プログラムが）動く」。',
    },
  }),
  st('[S That shift] [V makes] [O a system] [C quick {to:副詞(形容詞)| [V to respond]}], [接 and] [M {前| at the very same time}] [S it] [V makes] [O the whole system] [C a target].', {
    chunks: [
      ['That shift makes a system quick to respond,', 'その移り変わりは仕組みを応答の速いものにします'],
      ['and at the very same time', 'そしてまさに同時に'],
      ['it makes the whole system a target', '仕組み全体を標的にもします'],
    ],
    notes: {
      'it makes the whole system a target': 'make ＋ 目的語 ＋ 名詞 で「〜を…にする」。',
    },
  }),
  st('[S A failure {前| in connectivity}] [V can] [M now] [V stop] [O a pump {関係>a pump| [S that] [V has] [O nothing {前| at all} mechanically wrong {前| with it}]}].', {
    chunks: [
      ['A failure in connectivity can now stop a pump', '通信の不具合がいまや揚水機を止めてしまいます'],
      ['that has nothing at all mechanically wrong', '機械としてはどこも壊れていない（揚水機を）'],
      ['with it', 'その機械に'],
    ],
    notes: {
      'that has nothing at all mechanically wrong': 'nothing wrong with … で「…に悪いところは何もない」。',
    },
  }),
  st('[S Cybersecurity] [M therefore] [V belongs] [M {前| inside a water plan}] [M {前| rather than only {前| inside some separate technology plan}}].', {
    chunks: [
      ['Cybersecurity therefore belongs inside a water plan', 'したがって情報の安全は水の計画の中に入ります'],
      ['rather than only inside', '〜の中だけではなく'],
      ['some separate technology plan', '別立ての技術の計画'],
    ],
    notes: {
      'Cybersecurity therefore belongs inside a water plan': 'belong inside … で「…の中に属する」。',
    },
  }),
  st('[S Old equipment] [M usually] [V becomes] [C obsolete] [M long] [M {副詞節:時| [接 before] [S it] [M actually] [V stops] [O {動名詞| [V working]}] [M out] [M {前| in the field}]}].', {
    chunks: [
      ['Old equipment usually becomes obsolete long', '古い設備はたいていずっと前に時代遅れになります'],
      ['before it actually stops working', '実際に動かなくなるより'],
      ['out in the field', '現場で'],
    ],
    notes: {
      'Old equipment usually becomes obsolete long': 'obsolete は「時代遅れの」。',
    },
  }),
  st('[S Parts] [V stop] [O {動名詞| [V being made]}], [S the engineers {関係>the engineers| [S who] [V understand] [O it]}] [V retire], [接 and] [S the records {関係>the records| [S that] [V explain] [O it]}] [V go] [C missing].', {
    chunks: [
      ['Parts stop being made,', '部品は作られなくなり'],
      ['the engineers who understand it retire,', 'それを分かる技術者は引退し'],
      ['and the records that explain it go missing', 'そしてそれを説明する記録は行方が分からなくなります'],
    ],
    notes: {
      'and the records that explain it go missing': 'go missing で「行方が分からなくなる」。',
    },
  }),
  st('[S A prototype {関係>A prototype| [O that] [S nobody] [M ever] [M fully] [V described] [M {前| on paper}]}] [V is] [C a risk {過去分詞>a risk| [V disguised] [M {前| as a valuable asset}]}].', {
    chunks: [
      ['A prototype that nobody ever fully described', 'だれも紙の上で十分に書き表さなかった試作機は'],
      ['on paper', '書面で'],
      ['is a risk disguised as a valuable asset', '貴重な資産の姿をした危険です'],
    ],
    notes: {
      'is a risk disguised as a valuable asset': 'disguised as … で「…に見せかけた」。',
    },
  }),
  st('[S {動名詞| [V Writing down] [O {疑問詞節| [M how] [S a machine] [M actually] [V works]}]}] [V is] [M therefore] [C an {並列| ordinary | and necessary part {前| of {動名詞| [V keeping] [O the machine] [C running]}}}].', {
    chunks: [
      ['Writing down how a machine actually works', '機械が実際にどう動くのかを書き留めることは'],
      ['is therefore an ordinary and necessary part', 'したがってありふれた、欠かせない一部です'],
      ['of keeping the machine running', 'その機械を動かし続けることの'],
    ],
    notes: {
      'of keeping the machine running': 'keep ＋ 目的語 ＋ -ing で「〜を…させ続ける」。',
    },
  }),
  st('[S Every claim {前| about a river}] [M finally] [V rests] [M {前| on a measurement {関係>a measurement| [O that] [S someone] [M once] [V chose] [O {to:名詞| [V to make]}]}}].', {
    chunks: [
      ['Every claim about a river finally rests', '川についてのどの主張も、結局は成り立っています'],
      ['on a measurement', 'ある測定の上に'],
      ['that someone once chose to make', 'かつてだれかが行うと決めた（測定の）'],
    ],
    notes: {
      'that someone once chose to make': 'choose to ＋ 動詞 で「〜することに決める」。that は to make の目的語にあたります。',
    },
  }),
  st('[S {並列| {疑問詞節| [M Where] [S the gauge] [V sits]}, | {疑問詞節| [M how often] [S it] [V is read]}, | and {疑問詞節| [O what] [S it] [V ignores]}}] [M all] [V help] [O {to:名詞| [V to shape] [O the result]}].', {
    chunks: [
      ['Where the gauge sits, how often it is read,', '観測器がどこにあり、どれほど頻繁に読まれ'],
      ['and what it ignores', '何を無視するかが'],
      ['all help to shape the result', 'どれも結果を形づくる助けになります'],
    ],
    notes: {
      'Where the gauge sits, how often it is read,': '疑問詞で始まる三つのまとまりが、並んで文の主語Sになっています。',
    },
  }),
  st('[S A number] [V is] [M therefore] [C a summary {前| of a human decision} quite as much {前| as a summary {前| of the world}}].', {
    chunks: [
      ['A number is therefore a summary of a human decision', 'したがって数字は人の決定の要約です'],
      ['quite as much as a summary of the world', '世界の要約であるのと同じくらい'],
    ],
    notes: {
      'quite as much as a summary of the world': 'as much as … で「…と同じくらい」。',
    },
  }),
  st('[S An average] [V conceals] [O the distribution {関係>the distribution| [S that] [V produced] [O it]}], [接 and] [S that distribution] [V is] [M usually] [C {what節| [O what] [M really] [V matters]}].', {
    chunks: [
      ['An average conceals the distribution that produced it,', '平均はそれを生んだ散らばりを覆い隠します'],
      ['and that distribution is usually', 'そしてその散らばりこそ、たいてい'],
      ['what really matters', '本当に大切なものです'],
    ],
    notes: {
      'An average conceals the distribution that produced it,': 'conceal は「隠す」。distribution は「散らばり・分布」。',
    },
  }),
  st('[S A basin {前| with adequate rainfall} {前| on average}] [V can] [M still] [V fail] [M {前| in the three years {関係>the three years| [S that] [V happen] [C {to:補語| [V to fall] [M {前| below the minimum}]}]}}].', {
    chunks: [
      ['A basin with adequate rainfall on average', '平均すれば十分な降水のある流域も'],
      ['can still fail', 'それでも立ち行かなくなることがあります'],
      ['in the three years that happen to fall below the minimum', 'たまたま最低量を下回る三年のあいだに'],
    ],
    notes: {
      'A basin with adequate rainfall on average': 'on average で「平均すると」。adequate は「十分な」。',
    },
  }),
  st('[S {動名詞| [V Planning] [M {前| for the mean}]}] [M therefore] [V prepares] [O a community] [M {前| for a year {関係>a year| [O that] [S it] [V will] [M only rarely] [V experience]}}].', {
    chunks: [
      ['Planning for the mean therefore prepares a community', 'そのため平均に合わせた計画は、地域に備えさせます'],
      ['for a year', 'ある年に'],
      ['that it will only rarely experience', 'めったに経験しない（年に）'],
    ],
    notes: {
      'Planning for the mean therefore prepares a community': 'the mean はここでは「平均値」。prepare A for B で「AにBの備えをさせる」。',
    },
  }),
  st('[S {動名詞| [V Planning] [M {前| for the most severe year {前| on record}}]}] [V is] [C expensive], [接 and] [S it] [V is] [C the only figure {関係>the only figure| [O that] [S a household] [M actually] [V feels]}].', {
    chunks: [
      ['Planning for the most severe year on record', '記録に残る最悪の年に備えることは'],
      ['is expensive,', '高くつきます'],
      ['and it is the only figure', 'しかしそれが唯一の数字です'],
      ['that a household actually feels', '家庭が実際に感じる（数字）'],
    ],
    notes: {
      'Planning for the most severe year on record': 'on record で「記録に残る中で」。',
    },
  }),
  st('[S A baseline] [V is] [C the quiet assumption {現在分詞>the quiet assumption| [V sitting] [M {前| inside almost every comparison {関係>almost every comparison| [S that] [M ever] [V gets published] [M anywhere]}}]}].', {
    chunks: [
      ['A baseline is the quiet assumption', '基準線とは静かな前提です（どんな前提かは次へ）'],
      ['sitting inside almost every comparison', 'ほとんどどの比較の内側にもある'],
      ['that ever gets published anywhere', 'どこかで公表される（比較の）'],
    ],
    notes: {
      'sitting inside almost every comparison': 'sitting inside … は the quiet assumption を後ろから説明しています。',
    },
  }),
  st('[S {動名詞| [V Choosing] [O a wet decade] [C {前| as the starting point}]}] [V makes] [O almost any later period] [C {原形| [V look] [M {前| like a decline}]}].', {
    chunks: [
      ['Choosing a wet decade as the starting point', '雨の多い十年を出発点に選ぶと'],
      ['makes almost any later period', 'その後のほとんどどの期間も'],
      ['look like a decline', '減少のように見せます'],
    ],
    notes: {
      'look like a decline': 'make ＋ 目的語 ＋ 動詞の原形 で「〜を…のように見せる」。',
    },
  }),
  st('[S {動名詞| [V Choosing] [O a dry decade] [M instead]}] [V makes] [O exactly the same later period] [C {原形| [V look] [M {前| like a welcome recovery}]}].', {
    chunks: [
      ['Choosing a dry decade instead', '代わりに乾いた十年を選ぶと'],
      ['makes exactly the same later period', 'まったく同じその後の期間を'],
      ['look like a welcome recovery', '喜ばしい回復のように見せます'],
    ],
    notes: {
      'look like a welcome recovery': 'welcome はここでは形容詞で「歓迎すべき」。',
    },
  }),
  st('[S Honest reports] [V state] [O the baseline] [M first], [M {副詞節:理由| [接 because] [S a reader] [V cannot check] [O any {前| of the claims}] [M {前| without it}]}].', {
    chunks: [
      ['Honest reports state the baseline first,', '誠実な報告はまず基準線を述べます'],
      ['because a reader cannot check any of the claims', 'なぜなら読み手はどの主張も確かめられないからです'],
      ['without it', 'それがなければ'],
    ],
    notes: {
      'because a reader cannot check any of the claims': 'not … any で「どれも〜ない」。',
    },
  }),
  st('[S Correlation] [V appears] [M {前| in almost any pair {前| of series} {関係>almost any pair of series| [S that] [M both] [V happen] [C {to:補語| [V to rise] [M {前| over the same decades}]}]}}].', {
    chunks: [
      ['Correlation appears in almost any pair of series', '相関はほとんどどんな二つの系列にも現れます'],
      ['that both happen to rise', 'たまたま両方とも上がっている（系列に）'],
      ['over the same decades', '同じ数十年のあいだ'],
    ],
    notes: {
      'Correlation appears in almost any pair of series': 'correlation は「二つが一緒に動くこと」。series は「一続きの数値」。',
    },
  }),
  st('[S Causation] [V requires] [O {並列| a mechanism, | a clear sequence {前| in time}, | and a case {関係>a case| [S that] [V fails] [M {副詞節:時| [接 when] [S the mechanism] [V is] [C absent]}]}}].', {
    chunks: [
      ['Causation requires a mechanism,', '因果には仕組みと'],
      ['a clear sequence in time,', '時間の上のはっきりした前後と'],
      ['and a case that fails', 'そして成り立たなくなる事例が要ります'],
      ['when the mechanism is absent', 'その仕組みがないときに'],
    ],
    notes: {
      'Causation requires a mechanism,': 'causation は「原因と結果の関係」。',
    },
  }),
  st('[S Reports {関係>Reports| [S that] [V supply] [O only the first {前| of these}]}] [V are describing] [O an accident {前| of the record}] [M {前| with great confidence}].', {
    chunks: [
      ['Reports that supply only the first of these', 'このうち最初のものしか示さない報告は'],
      ['are describing an accident of the record', '記録の偶然を書いているだけです'],
      ['with great confidence', 'たいそうな自信をもって'],
    ],
    notes: {
      'are describing an accident of the record': 'accident はここでは「たまたまそうなったこと」。',
    },
  }),
  st('[S {動名詞| [V Asking] [O {疑問詞節| [S what] [V would have to be observed] [M {前:意味上の主語| for such a claim} {to:副詞(目的)| [V to fail]}]}]}] [V is] [C the fastest test available].', {
    chunks: [
      ['Asking what would have to be observed', '何が観測されねばならないかを問うことが'],
      ['for such a claim to fail', 'その主張が成り立たなくなるには'],
      ['is the fastest test available', '取りうる中で最も速い確かめ方です'],
    ],
    notes: {
      'for such a claim to fail': 'for ＋ 名詞 ＋ to ＋ 動詞 で「〜が…するには」。',
    },
  }),
  st('[S Different academic disciplines] [V measure] [O the very same basin] [接 and] [M only rarely] [V produce] [O the same picture {前| of it}].', {
    chunks: [
      ['Different academic disciplines measure the very same basin', '異なる学問の分野がまったく同じ流域を測ります'],
      ['and only rarely produce', 'それでも、めったに生みません'],
      ['the same picture of it', '同じ像を'],
    ],
    notes: {
      'Different academic disciplines measure the very same basin': 'discipline はここでは「学問の分野」。',
    },
  }),
  st('[S {並列| A water scientist, | a specialist {前| in ecology}, | and an economist}] [V will] [M each] [V treat] [O a different quantity] [C {前| as the important one}].', {
    chunks: [
      ['A water scientist, a specialist in ecology,', '水の科学者と、生態学の専門家と'],
      ['and an economist will each treat', '経済学者は、それぞれ扱います'],
      ['a different quantity as the important one', '別々の量を重要なものとして'],
    ],
    notes: {
      'a different quantity as the important one': 'treat A as B で「AをBとして扱う」。',
    },
  }),
  st('[S None {前| of them}] [V is] [M simply] [C wrong], [接 and] [S none {前| of their separate pictures}] [V is] [C complete] [M {前| on its own}].', {
    chunks: [
      ['None of them is simply wrong,', 'どの人もただ間違っているのではありません'],
      ['and none of their separate pictures', 'そして別々の像はどれも'],
      ['is complete on its own', 'それだけでは完全ではありません'],
    ],
    notes: {
      'None of them is simply wrong,': 'none of … で「…のどれも〜ない」。',
    },
  }),
  st('[S Work {前| across several disciplines}] [V is] [C slow] [M precisely] [M {副詞節:理由| [接 because] [S the separate vocabularies] [V have to be reconciled] [M first]}].', {
    chunks: [
      ['Work across several disciplines is slow', '複数の分野にまたがる仕事は遅いのです'],
      ['precisely because the separate vocabularies', 'まさに、別々の用語を'],
      ['have to be reconciled first', 'まずすり合わせねばならないからです'],
    ],
    notes: {
      'have to be reconciled first': 'reconcile は「食い違いをすり合わせる」。',
    },
  }),
  st('[S A basin {関係>A basin| [S that] [V funds] [O that slow work] [M early]}] [V avoids] [O {動名詞| [V having to argue] [M {前| about basic definitions}] [M {前| during an emergency}]}].', {
    chunks: [
      ['A basin that funds that slow work early', 'その遅い仕事に早くから資金を出す流域は'],
      ['avoids having to argue', '争わずに済みます（何をかは次へ）'],
      ['about basic definitions during an emergency', '非常時に基本の定義をめぐって'],
    ],
    notes: {
      'avoids having to argue': 'avoid ＋ -ing で「〜せずに済む」。have to ＋ 動詞 で「〜しなければならない」。',
    },
  }),
  st('[S A river] [V gives] [O1 a community {前| near its source}] [O2 an advantage {関係>an advantage| [O that] [S no argument] [V can] [M ever] [M fully] [V remove]}].', {
    chunks: [
      ['A river gives a community near its source', '川は水源に近い地域に与えます'],
      ['an advantage that no argument can ever fully remove', 'どんな議論でも完全には取り除けない有利さを'],
    ],
    notes: {
      'A river gives a community near its source': 'give ＋ 人 ＋ もの で「人にものを与える」。source は「水源」。',
    },
  }),
  st('[S Anything {関係>Anything| [S that] [V happens] [M above]}] [V arrives] [M below] [M {前| in time}], [接 and] [S nothing {関係>nothing| [S that] [V happens] [M below]}] [M ever] [V travels] [M back] [M up] [M again].', {
    chunks: [
      ['Anything that happens above arrives below in time,', '上で起きることは、やがて下に届きます'],
      ['and nothing that happens below', 'そして下で起きることは何一つ'],
      ['ever travels back up again', '上へ戻ることはありません'],
    ],
    notes: {
      'Anything that happens above arrives below in time,': 'in time はここでは「やがて」。above と below は「上流で・下流で」。',
    },
  }),
  st('[S Every treaty {前| about a shared river}] [V is] [C an attempt {to:形容詞>an attempt| [V to answer] [O that one basic asymmetry] [M somehow]}].', {
    chunks: [
      ['Every treaty about a shared river is an attempt', '共有された川についてのどの条約も試みです'],
      ['to answer that one basic asymmetry somehow', 'その根本のつり合わなさに何とか答えようとする'],
    ],
    notes: {
      'Every treaty about a shared river is an attempt': 'an attempt to ＋ 動詞 で「〜しようとする試み」。',
    },
  }),
  st('[S Agreements {関係>Agreements| [S that] [V ignore] [O this asymmetry]}] [V collapse] [M {副詞節:時| [接 as soon as] [S the first genuinely dry year] [M finally] [V arrives]}].', {
    chunks: [
      ['Agreements that ignore this asymmetry collapse', 'このつり合わなさを無視した合意は崩れます'],
      ['as soon as the first genuinely dry year finally arrives', '本当に乾いた最初の年が来たとたんに'],
    ],
    notes: {
      'as soon as the first genuinely dry year finally arrives': 'as soon as … で「…するとすぐに」。',
    },
  }),
  st('[S A workable agreement] [V gives] [O1 the side {前| near the source}] [O2 something valuable {関係>something valuable| [O that] [S it] [V cannot obtain] [M {前| on its own}]}].', {
    chunks: [
      ['A workable agreement gives the side near the source', '機能する合意は、水源に近い側に与えます'],
      ['something valuable that it cannot obtain on its own', '単独では手に入らない価値あるものを'],
    ],
    notes: {
      'A workable agreement gives the side near the source': 'workable は「実際に動く・機能する」。',
    },
  }),
  st('[S {並列| Electricity, | access {前| to markets}, | flood warnings, | and shared observations}] [V have] [M all] [V served] [O that purpose] [M rather well].', {
    chunks: [
      ['Electricity, access to markets, flood warnings,', '電力と、市場に入れること、洪水の警報'],
      ['and shared observations', 'そして共有された観測値が'],
      ['have all served that purpose rather well', 'どれもその役目をかなりよく果たしてきました'],
    ],
    notes: {
      'have all served that purpose rather well': 'serve a purpose で「役目を果たす」。',
    },
  }),
  st('[S An agreement {関係>An agreement| [S that] [M only] [V asks] [O the other side] [M {前| for restraint}]}] [V is] [C a request {前| rather than a bargain}].', {
    chunks: [
      ['An agreement that only asks the other side', '相手側にただ求めるだけの合意は'],
      ['for restraint', '自制を'],
      ['is a request rather than a bargain', '取引ではなくお願いです'],
    ],
    notes: {
      'is a request rather than a bargain': 'bargain は「互いに得のある取り決め」。',
    },
  }),
  st('[S Requests] [V hold] [M only] [M {副詞節:時| [接 while] [S relations] [V are] [C warm]}] [接 and] [V fail] [M {前| at exactly the moment {関係>the moment| [M when] [S they] [V are] [M most] [V needed]}}].', {
    chunks: [
      ['Requests hold only while relations are warm', 'お願いは関係が良いあいだしか持ちません'],
      ['and fail at exactly the moment', 'そしてまさにその瞬間に破れます'],
      ['when they are most needed', '最も必要とされる（瞬間に）'],
    ],
    notes: {
      'Requests hold only while relations are warm': 'hold はここでは「（効力が）持続する」。',
    },
  }),
  st('[S Sovereignty] [V makes] [O enforcement] [C difficult] [M even] [M {前| in cases {関係>cases| [M where] [S the text {前| of a treaty}] [V is] [C perfectly clear]}}].', {
    chunks: [
      ['Sovereignty makes enforcement difficult', '主権は履行を難しくします'],
      ['even in cases', '場合でさえ'],
      ['where the text of a treaty is perfectly clear', '条約の文言が申し分なく明確な（場合でも）'],
    ],
    notes: {
      'Sovereignty makes enforcement difficult': 'sovereignty は「主権」、enforcement は「取り決めを守らせること」。',
    },
  }),
  st('[S {what節| [O What] [V holds] [O an agreement] [M together]}] [V is] [M usually] [C the cost {前| of {動名詞| [V leaving] [O it]}} {前| rather than any penalty {過去分詞>any penalty| [V stated] [M {前| inside it}]}}].', {
    chunks: [
      ['What holds an agreement together', '合意をつなぎとめているのは'],
      ['is usually the cost of leaving it', 'たいてい、そこから抜ける費用です'],
      ['rather than any penalty stated inside it', '中に書かれた罰則ではなく'],
    ],
    notes: {
      'What holds an agreement together': 'hold … together で「…をまとめておく」。',
    },
  }),
  st('[S Joint monitoring] [V is] [C valuable] [M mainly] [M {副詞節:理由| [接 because] [S it] [V makes] [O any disagreement {前| about the basic facts}] [C {並列| expensive | and slow}]}].', {
    chunks: [
      ['Joint monitoring is valuable mainly', '共同の観測が価値を持つのは、主に'],
      ['because it makes any disagreement', 'それが意見の食い違いを〜にするからです'],
      ['about the basic facts expensive and slow', '基本の事実についての、高くつき遅いものに'],
    ],
    notes: {
      'because it makes any disagreement': 'make ＋ 目的語 ＋ 形容詞 で「〜を…にする」。',
    },
  }),
  st('[S Two governments {関係>Two governments| [S that] [V share] [O a single gauge]}] [V will argue] [M {前| about policy}] [M {前| instead of {動名詞| [V arguing] [M {前| about the numbers}]}}].', {
    chunks: [
      ['Two governments that share a single gauge', '一つの観測器を共有する二つの政府は'],
      ['will argue about policy', '政策について議論します'],
      ['instead of arguing about the numbers', '数字について争う代わりに'],
    ],
    notes: {
      'Two governments that share a single gauge': 'gauge は「測る器具」。',
    },
  }),
  st('[S Indigenous communities] [M frequently] [V hold] [O the longest continuous record {前| of {疑問詞節| [M how] [S a particular basin] [M actually] [V behaves]}}].', {
    chunks: [
      ['Indigenous communities frequently hold', '先住の人々の共同体はしばしば持っています'],
      ['the longest continuous record', '最も長く途切れない記録を'],
      ['of how a particular basin actually behaves', 'ある流域が実際にどうふるまうかの'],
    ],
    notes: {
      'the longest continuous record': 'continuous は「途切れない」。',
    },
  }),
  st('[S That record] [V is stored] [M {並列| {前| in daily practice} | and {前| in language}}] [M {前| rather than {前| in any published series {前| of numbers}}}].', {
    chunks: [
      ['That record is stored in daily practice', 'その記録は日々の営みの中に蓄えられています'],
      ['and in language', 'そして言葉の中に'],
      ['rather than in any published series of numbers', '公表された数値の並びの中ではなく'],
    ],
    notes: {
      'That record is stored in daily practice': 'practice はここでは「日々くり返される行い」。',
    },
  }),
  st('[S {動名詞| [V Treating] [O it] [C {前| as folklore}] [M {前| rather than {前| as real evidence}}]}] [V discards] [O information {関係>information| [S that] [V cannot be recovered] [M later]}].', {
    chunks: [
      ['Treating it as folklore', 'それを言い伝えとして扱い'],
      ['rather than as real evidence', '本当の証拠として扱わないことは'],
      ['discards information that cannot be recovered later', 'あとで取り戻せない情報を捨てることになります'],
    ],
    notes: {
      'Treating it as folklore': 'folklore は「言い伝え」。treat A as B で「AをBとして扱う」。',
    },
  }),
  st('[S Consultation {関係>Consultation| [S that] [V begins] [M {副詞節:時| [接 after] [S a plan] [V is] [M already] [C complete]}]}] [V is] [C a formal step] [M only], [接 and] [S everyone] [V understands] [O it] [C {前| as one}].', {
    chunks: [
      ['Consultation that begins after a plan is already complete', '計画ができあがってから始まる協議は'],
      ['is a formal step only,', '形ばかりの手続きにすぎません'],
      ['and everyone understands it as one', 'そしてだれもがそう受け取ります'],
    ],
    notes: {
      'and everyone understands it as one': 'この one は a formal step の代わりです。',
    },
  }),
  st('[S A basin authority] [V works] [M only] [M {副詞節:時| [接 when] [S the people {関係省略:目的格>the people| [S it] [V governs]}] [V can see] [O {並列| {疑問詞節| [O what] [S it] [V decides]} | and why}]}].', {
    chunks: [
      ['A basin authority works only', '流域の管理機構が働くのは'],
      ['when the people it governs can see', '統治される人々が見られるときだけです'],
      ['what it decides and why', '何を決め、なぜそう決めたのかを'],
    ],
    notes: {
      'what it decides and why': 'and why は and why it decides so の省略です。',
    },
  }),
  st('[S {動名詞| [V Publishing] [O {並列| the data, | the model, | and the reasoning}]}] [V costs] [O very little] [接 and] [V buys] [O a great deal {前| of patience}].', {
    chunks: [
      ['Publishing the data, the model, and the reasoning', '観測値と計算のモデルと考えの筋道を公表することは'],
      ['costs very little', 'ほとんど費用がかからず'],
      ['and buys a great deal of patience', '多くの辛抱強さを買います'],
    ],
    notes: {
      'and buys a great deal of patience': 'buy はここでは「（努力や費用で）手に入れる」。',
    },
  }),
  st('[S Communities] [V will accept] [O an unpopular decision] [M far more readily] [M {副詞節:時| [接 when] [S they] [V can follow] [O the whole argument {前| behind it}]}].', {
    chunks: [
      ['Communities will accept an unpopular decision', '人々は歓迎されない決定も受け入れます'],
      ['far more readily', 'はるかにたやすく'],
      ['when they can follow the whole argument behind it', 'その背後の議論を最後までたどれるときには'],
    ],
    notes: {
      'when they can follow the whole argument behind it': 'follow an argument で「議論の筋をたどる」。',
    },
  }),
  st('[S A shared river] [V is] [M finally] [V governed] [M {前| by {whether節| [接 whether] [S the neighbors {関係>the neighbors| [S who] [V live] [M {前| along it}]}] [V can] [M still] [V talk] [M {前| to one another}]}}].', {
    chunks: [
      ['A shared river is finally governed by', '共有された川を最後に治めるのは'],
      ['whether the neighbors who live along it', '川沿いに暮らす隣人たちが'],
      ['can still talk to one another', 'なお互いに話し合えるかどうかです'],
    ],
    notes: {
      'whether the neighbors who live along it': 'whether … で「〜かどうか」。ここは前置詞 by の目的語です。',
    },
  }),
])
