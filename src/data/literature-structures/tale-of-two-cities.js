import { ls } from './entry.js'

export default Object.freeze([
  // 1（とても長い1文を、ダッシュの前後の2つに分けた1つ目）
  ls('[S It] [V was] [C the best {前| of times}], [S it] [V was] [C the worst {前| of times}], [S it] [V was] [C the age {前| of wisdom}], [S it] [V was] [C the age {前| of foolishness}], [S it] [V was] [C the epoch {前| of belief}], [S it] [V was] [C the epoch {前| of incredulity}], [S it] [V was] [C the season {前| of Light}], [S it] [V was] [C the season {前| of Darkness}], [S it] [V was] [C the spring {前| of hope}], [S it] [V was] [C the winter {前| of despair}], [S we] [V had] [O everything] [M {前| before us}], [S we] [V had] [O nothing] [M {前| before us}], [S we] [V were] [M all] [V going] [M direct] [M {前| to Heaven}], [S we] [V were] [M all] [V going] [M direct] [M the other way] —', {
    p: true,
    part: true,
    ja: 'それは最良の時代であり、最悪の時代でもあった。知恵の時代であり、愚かさの時代でもあった。信じる時代であり、疑う時代でもあった。光の季節であり、闇の季節でもあった。希望の春であり、絶望の冬でもあった。私たちの前にはすべてがあり、同時に何ひとつなかった。私たちはみな天国へまっすぐ向かっていたし、みなまっすぐ反対の方へも向かっていた——',
    chunks: [
      ['It was the best of times,', 'それは最良の時代であり'],
      ['it was the worst of times,', '最悪の時代でもあった'],
      ['it was the age of wisdom,', '知恵の時代であり'],
      ['it was the age of foolishness,', '愚かさの時代でもあった'],
      ['it was the epoch of belief,', '信じる時代であり'],
      ['it was the epoch of incredulity,', '疑う時代でもあった'],
      ['it was the season of Light,', '光の季節であり'],
      ['it was the season of Darkness,', '闇の季節でもあった'],
      ['it was the spring of hope,', '希望の春であり'],
      ['it was the winter of despair,', '絶望の冬でもあった'],
      ['we had everything before us, we had nothing before us,', '私たちの前にはすべてがあり、何ひとつなかった'],
      ['we were all going direct to Heaven,', '私たちはみな天国へまっすぐ向かっていたし'],
      ['we were all going direct the other way —', 'みなまっすぐ反対の方へも向かっていた——'],
    ],
    marks: [
      ['—', 'ダッシュで、「〜の時代だった」という対になる言い方の長い連なりを打ち切り、次の in short（要するに）でまとめに入ります。'],
    ],
    notes: {
      'It was the best of times,': 'It was the … of times で「〜の時代だった」。同じ形の文を、正反対の語（best と worst など）で対にしながら、コンマだけでつないで何度も重ねるのが、この書き出しの特徴です。',
      'it was the epoch of incredulity,': 'epoch は「時代」、incredulity は「疑い深さ・信じないこと」で、belief（信じること）の反対です。',
      'it was the season of Light,': 'Light と Darkness を大文字で書き、光と闇を象徴として強めています。',
      'we had everything before us, we had nothing before us,': 'before us は「私たちの前に（これからの可能性として）」。',
      'we were all going direct the other way —': 'direct は「まっすぐに」（副詞）。the other way は「反対の方へ」、つまり地獄のほうへ、という意味です。',
    },
  }),
  // 2（1つ目の文の続き）
  ls('[M {前| in short}], [S the period] [V was] [M so far] [C {前| like the present period}], [M {副詞節:結果| [接 that] [S some {前| of its noisiest authorities}] [V insisted] [M {前| on {動名詞| [M its] [V being received]}}], [M {並列| {前| for good} | or {前| for evil}}], [M {前| in the superlative degree {前| of comparison}} only]}].', {
    ja: '要するに、その時代は今の時代とあまりによく似ていて、その時代のいちばん声の大きな権威者たちの中には、良い意味でも悪い意味でも、とにかく最上級でだけ語られることを言い張る者もいたのである。',
    chunks: [
      ['in short, the period was so far like the present period,', '要するに、その時代は今の時代とあまりによく似ていたので'],
      ['that some of its noisiest authorities insisted on its being received,', 'いちばん声の大きな権威者の中には、受けとめられることを言い張る者もいた'],
      ['for good or for evil, in the superlative degree of comparison only.', '良い意味でも悪い意味でも、比較の最上級でだけ'],
    ],
    notes: {
      'in short, the period was so far like the present period,': 'in short は「要するに」。so far like A that … で「A にとてもよく似ているので…」。the present period は、作者が書いている今（1850年代）のことです。',
      'that some of its noisiest authorities insisted on its being received,': 'insist on A で「A を言い張る」。its being received は「それ（その時代）が受けとめられること」で、its が動名詞の意味の上の主語です。',
      'for good or for evil, in the superlative degree of comparison only.': 'for good or for evil は「良かれ悪しかれ」。superlative degree（最上級）は best・worst のような「いちばん〜」の形のこと。何でも「最高」か「最悪」かで語りたがる人々への皮肉です。',
    },
  }),
  // 3
  ls('[M There] [V were] [S {並列| a king {前| with a large jaw} | and a queen {前| with a plain face}}], [M {前| on the throne {前| of England}}]; [M there] [V were] [S {並列| a king {前| with a large jaw} | and a queen {前| with a fair face}}], [M {前| on the throne {前| of France}}].', {
    p: true,
    ja: 'イングランドの王座には、あごの大きな王と地味な顔の王妃がいた。フランスの王座には、あごの大きな王と美しい顔の王妃がいた。',
    chunks: [
      ['There were a king with a large jaw', 'あごの大きな王がいて'],
      ['and a queen with a plain face, on the throne of England;', '地味な顔の王妃が、イングランドの王座にいた'],
      ['there were a king with a large jaw', 'あごの大きな王がいて'],
      ['and a queen with a fair face, on the throne of France.', '美しい顔の王妃が、フランスの王座にいた'],
    ],
    marks: [
      [';', 'セミコロンで、イングランドの王座とフランスの王座という対になる2つの文を並べます。同じ形をくり返し、王妃の顔（plain と fair）だけを変えて比べています。'],
    ],
    notes: {
      'There were a king with a large jaw': 'There were A and B で「A と B がいた」。主語が2人なので were です。イギリス王ジョージ3世を指します。',
      'and a queen with a plain face, on the throne of England;': 'plain face は「地味な顔」。',
      'and a queen with a fair face, on the throne of France.': 'fair face は「美しい顔」。フランス王ルイ16世と王妃マリー・アントワネットを指します。',
    },
  }),
  // 4
  ls('[M {前| In both countries}] [仮S it] [V was] [C clearer {前| than crystal}] [M {前| to the lords {前| of the State preserves} {前| of {並列| loaves | and fishes}}}], [真S {that節| [接 that] [S things {前| in general}] [V were settled] [M {前| for ever}]}].', {
    ja: 'どちらの国でも、国家という「パンと魚の禁猟区」を支配する貴族たちには、世の中は万事このまま永久に定まっているのだということが、水晶よりもはっきりしていた。',
    chunks: [
      ['In both countries it was clearer than crystal', 'どちらの国でも、水晶よりはっきりしていた（何がかは次へ）'],
      ['to the lords of the State preserves of loaves and fishes,', '国家という「パンと魚の禁猟区」を支配する貴族たちには'],
      ['that things in general were settled for ever.', '世の中は万事永久に定まっているということが'],
    ],
    notes: {
      'In both countries it was clearer than crystal': 'it は形式主語で、中身は that 以下。clearer than crystal は「水晶よりも明らか」、つまり「分かりきった」。',
      'to the lords of the State preserves of loaves and fishes,': 'preserve は「禁猟区（持ち主だけが獲物を取れる場所）」。loaves and fishes（パンと魚）は聖書から来た言い方で、ここでは役職や利益のこと。国を自分たちの利益の囲い場にしている貴族たちへの皮肉です。',
      'that things in general were settled for ever.': 'things in general は「世の中のこと全般」、settled は「決まっている・安定している」。このあと革命が起きることを考えると、強い皮肉になっています。',
    },
  }),
  // 5
  ls('[S It] [V was] [C the year {前| of Our Lord} {成句| one thousand seven hundred and seventy-five}].', {
    p: true,
    ja: '時は、主の年、千七百七十五年であった。',
    chunks: [
      ['It was the year of Our Lord', '時は、主の年'],
      ['one thousand seven hundred and seventy-five.', '千七百七十五年であった'],
    ],
    unitNotes: {
      'one thousand seven hundred and seventy-five': '1775 を英語の言葉で書いた言い方。and は数の読み方の一部で、並べる接続詞ではありません。',
    },
    notes: {
      'It was the year of Our Lord': 'the year of Our Lord は「主（キリスト）の年」、つまり西暦のこと。1775年は、フランス革命（1789年）の少し前です。',
    },
  }),
  // 6
  ls('[S Spiritual revelations] [V were conceded] [M {前| to England}] [M {前| at that favoured period}], [M {副詞節:様態| [接 as] [M {前| at this}]}].', {
    ja: '今の時代と同じく、その恵まれた時代のイングランドにも、霊のお告げが授けられていた。',
    chunks: [
      ['Spiritual revelations were conceded to England at that favoured period,', 'その恵まれた時代に、霊のお告げがイングランドに授けられていた'],
      ['as at this.', '今の時代と同じように'],
    ],
    notes: {
      'Spiritual revelations were conceded to England at that favoured period,': 'revelation は「（神の）お告げ」、concede は「与える・認める」。favoured（恵まれた）は皮肉です。',
      'as at this.': 'as (they are conceded) at this (period) の省略で、「今の時代にそうであるように」。作者の時代にも怪しいお告げがはやっていたことへの皮肉です。',
    },
  }),
  // 7
  ls('[S Mrs. Southcott] [V had] [M recently] [V attained] [O her five-and-twentieth blessed birthday], [M {関係,>Mrs. Southcott| [M of whom] [S a prophetic private {前| in the Life Guards}] [V had heralded] [O the sublime appearance] [M {前| by {動名詞| [V announcing] [O {that節| [接 that] [S arrangements] [V were made] [M {前| for the swallowing up {前| of {並列| London | and Westminster}}}]}]}}]}].', {
    ja: 'サウスコット夫人は、少し前にめでたく二十五回目の誕生日を迎えたところで、近衛騎兵隊の予言好きの一兵卒が、ロンドンとウェストミンスターを丸のみにする手はずが整ったと告げて、夫人の崇高な出現を予告していた。',
    chunks: [
      ['Mrs. Southcott had recently attained her five-and-twentieth blessed birthday,', 'サウスコット夫人はつい先ごろ、めでたい二十五回目の誕生日を迎えていた'],
      ['of whom a prophetic private', 'その夫人については、予言好きの一兵卒が'],
      ['in the Life Guards had heralded the sublime appearance', '近衛騎兵隊の、その崇高な出現を予告していた'],
      ['by announcing that arrangements were made', '手はずが整ったと告げることで'],
      ['for the swallowing up of London and Westminster.', 'ロンドンとウェストミンスターを丸のみにする'],
    ],
    notes: {
      'Mrs. Southcott had recently attained her five-and-twentieth blessed birthday,': 'サウスコット夫人は、自分は神の使いだと名乗った実在の女性予言者です。five-and-twentieth は twenty-fifth（25回目の）の古い言い方で、「祝福された」誕生日と大げさに言う皮肉です。',
      'of whom a prophetic private': 'of whom は前置詞＋関係代名詞で、the sublime appearance of whom（夫人の崇高な出現）の of whom が前に出た形です。private は「兵卒」、prophetic は「予言する」。',
      'in the Life Guards had heralded the sublime appearance': 'the Life Guards は王を守る近衛騎兵隊。herald は「予告する・先ぶれする」、sublime は「崇高な」。',
      'for the swallowing up of London and Westminster.': 'swallow up は「丸のみにする」。the swallowing up of A で「A が丸のみにされること」で、世の終わりの予言です。',
    },
  }),
  // 8
  ls('[S Even the Cock-lane ghost] [V had been laid] [M only a round dozen {前| of years}], [M {前| after {動名詞| [V rapping out] [O its messages]}}], [M {副詞節:様態| [接 as] [S the spirits {前| of this very year last past} ({形容詞>the spirits| supernaturally deficient {前| in originality}})] [V rapped out] [O theirs]}].', {
    ja: 'あのコック・レインの幽霊でさえ、トントンと叩いて知らせを伝えたあと退治されてから、まだきっかり十二年しかたっていなかった。つい昨年の霊たちも、超自然的なほど独創性に欠けていて、同じように叩いて知らせを伝えたものだった。',
    chunks: [
      ['Even the Cock-lane ghost had been laid', 'あのコック・レインの幽霊でさえ、退治されてから'],
      ['only a round dozen of years,', 'きっかり十二年しかたっていなかった'],
      ['after rapping out its messages,', '叩いて知らせを伝えたあとで'],
      ['as the spirits of this very year last past', 'ちょうど、つい昨年の霊たちが'],
      ['(supernaturally deficient in originality) rapped out theirs.', '（超自然的なほど独創性に欠けて）自分たちの知らせを叩き出したように'],
    ],
    notes: {
      'Even the Cock-lane ghost had been laid': 'コック・レインの幽霊は、ロンドンで騒ぎになった「叩く音で答える幽霊」の事件（のちに作り事と分かった）。lay a ghost は「幽霊を鎮める・退治する」。',
      'only a round dozen of years,': 'a round dozen は「きっかり12」。',
      'after rapping out its messages,': 'rap out は「（トントン）叩いて伝える」。',
      'as the spirits of this very year last past': 'this very year last past は「つい過ぎたばかりのこの年」、つまり作者から見た「昨年」。as は「〜のように」。',
      '(supernaturally deficient in originality) rapped out theirs.': 'deficient in A は「A が欠けている」。「超自然的なほど独創性がない」と霊をからかう皮肉です。theirs は their messages のこと。',
    },
  }),
  // 9
  ls('[S Mere messages {前| in the earthly order {前| of events}}] [V had] [M lately] [V come] [M {前| to the English {並列| Crown | and People}}], [M {前| from a congress {前| of British subjects} {前| in America}}]: [M {関係,>Mere messages| [S which], [M {成句| strange to relate}], [V have proved] [C more important {前| to the human race} {前| than any communications {過去分詞>any communications| [M yet] [V received] [M {前| through any {前| of the chickens {前| of the Cock-lane brood}}}]}}]}].', {
    ja: '最近、アメリカにいるイギリス臣民の会議から、地上の出来事のふつうの順序にのっとった、ただの知らせがイギリスの王と国民のもとへ届いていた。奇妙な話だが、それが、コック・レインのひよこたちを通して受け取ったどんなお告げよりも、人類にとって重要なものとなったのである。',
    chunks: [
      ['Mere messages in the earthly order of events', '地上の出来事のふつうの順序にのっとった、ただの知らせが'],
      ['had lately come to the English Crown and People,', '最近、イギリスの王と国民のもとへ届いていた'],
      ['from a congress of British subjects in America:', 'アメリカにいるイギリス臣民の会議から'],
      ['which, strange to relate,', 'それは、奇妙な話だが'],
      ['have proved more important to the human race than any communications', '人類にとって、どんなお告げよりも重要なものとなった'],
      ['yet received through any of the chickens of the Cock-lane brood.', 'コック・レインのひよこたちの誰かを通してこれまでに受け取った'],
    ],
    unitNotes: {
      'strange to relate': '「奇妙な話だが」。話の途中に差し込む決まった言い方です。',
    },
    marks: [
      [':', 'コロンのあとの which で、アメリカから届いた知らせについて「それが意外にも人類にとってもっと重要になった」と付け足します。'],
    ],
    notes: {
      'Mere messages in the earthly order of events': 'mere は「ただの」。霊のお告げではない、ふつうの人間の知らせ、という対比です。',
      'from a congress of British subjects in America:': 'アメリカの植民地の代表者会議のことで、この知らせはのちのアメリカ独立につながりました。',
      'which, strange to relate,': 'which は Mere messages … を受ける関係代名詞です。',
      'have proved more important to the human race than any communications': 'prove A で「A だと分かる・A になる」。',
      'yet received through any of the chickens of the Cock-lane brood.': 'brood は「ひと腹のひな」。コック・レインの幽霊の仲間の霊たちを「ひよこ」とからかっています。',
    },
  }),
  // 10
  ls('[S France, {過去分詞>France| [M less] [V favoured] [M {前| on the whole}] [M {前| as to matters {形容詞>matters| spiritual}}] [M {前| than her sister {前| of the {並列| shield | and trident}}}]},] [V rolled] [M {前| with exceeding smoothness}] [M {前| down hill}], [M {分詞構文:付帯状況| [V making] [O paper money] [接 and] [V spending] [O it]}].', {
    p: true,
    ja: '精神の事柄では、盾と三叉の矛を持つ姉のイングランドほど全体として恵まれていなかったフランスは、紙幣を刷っては使いながら、実に滑らかに坂を転げ落ちていた。',
    chunks: [
      ['France, less favoured on the whole', 'フランスは、全体として恵まれていなかった（何がかは次へ）'],
      ['as to matters spiritual', '精神の事柄については'],
      ['than her sister of the shield and trident,', '盾と三叉の矛を持つ姉ほどには'],
      ['rolled with exceeding smoothness down hill,', '実に滑らかに坂を転げ落ちていた'],
      ['making paper money and spending it.', '紙幣を作っては使いながら'],
    ],
    notes: {
      'France, less favoured on the whole': 'less favoured は「（〜ほど）恵まれていない」で、France を説明する語句がコンマの間にはさまっています。',
      'as to matters spiritual': 'as to A は「A については」。matters spiritual は spiritual matters と同じで、「精神の・霊の事柄」。',
      'than her sister of the shield and trident,': '盾と三叉の矛を持つ女神ブリタニアはイギリスの象徴で、フランスの「姉」にあたるイングランドのことです。',
      'rolled with exceeding smoothness down hill,': '坂を転げ落ちるように、国が破滅へ向かっていたことのたとえです。exceeding は「非常な」。',
      'making paper money and spending it.': '紙幣を刷っては使う、つまり財政が乱れていたことを表します。',
    },
  }),
  // 11
  ls('[M {前| Under the guidance {前| of her Christian pastors}}], [S she] [V entertained] [O herself], [M besides], [M {前| with such humane achievements {前| as {動名詞| [V sentencing] [O a youth] [C {to:補語| [V to have] [O his hands] [C cut off], [O his tongue] [C torn out {前| with pincers}], [接 and] [O his body] [C burned alive]}]}}}], [M {副詞節:理由| [接 because] [S he] [V had not kneeled down] [M {前| in the rain}] [M {to:副詞(目的)| [V to do] [O honour] [M {前| to a dirty procession {前| of monks} {関係>a dirty procession of monks| [S which] [V passed] [M {前| within his view}], [M {前| at a distance {前| of some {並列| fifty | or sixty} yards}}]}}]}]}].', {
    ja: 'そのうえフランスは、キリスト教の聖職者たちの導きのもと、ある若者に、両手を切り落とされ、やっとこで舌を引き抜かれ、生きたまま体を焼かれるという刑を言い渡すといった「慈悲深い」偉業で楽しんでいた。若者の罪は、五十か六十ヤードほど先の、目の届く所を通り過ぎた薄汚い修道士の行列に敬意を表すため、雨の中でひざまずかなかったことだった。',
    chunks: [
      ['Under the guidance of her Christian pastors,', 'キリスト教の聖職者たちの導きのもとで'],
      ['she entertained herself, besides,', 'そのうえフランスは楽しんだ'],
      ['with such humane achievements as sentencing a youth', '若者に刑を言い渡すといった「慈悲深い」偉業で'],
      ['to have his hands cut off,', '両手を切り落とされ'],
      ['his tongue torn out with pincers,', 'やっとこで舌を引き抜かれ'],
      ['and his body burned alive,', '生きたまま体を焼かれるという刑を'],
      ['because he had not kneeled down in the rain', '雨の中でひざまずかなかったというので'],
      ['to do honour to a dirty procession', '薄汚い行列に敬意を表すために'],
      ['of monks which passed within his view,', '目の届く所を通った修道士たちの'],
      ['at a distance of some fifty or sixty yards.', '五十か六十ヤードほど離れた所を'],
    ],
    notes: {
      'she entertained herself, besides,': 'entertain oneself with A で「A で楽しむ」。besides は「そのうえ」。',
      'with such humane achievements as sentencing a youth': 'such A as B で「B のような A」。humane（慈悲深い・人道的な）は、残酷な刑を皮肉ってわざと使っています。',
      'to have his hands cut off,': 'sentence A to do で「A に〜の刑を言い渡す」。have＋もの＋過去分詞で「ものを〜される」。',
      'his tongue torn out with pincers,': 'to have が、3つの「もの＋過去分詞」（hands cut off・tongue torn out・body burned alive）に共通してかかっています。pincers は「やっとこ（はさむ道具）」。',
      'to do honour to a dirty procession': 'do honour to A で「A に敬意を表す」。',
      'at a distance of some fifty or sixty yards.': 'some はここでは「およそ」。1ヤードは約91cmです。',
    },
  }),
  // 12
  ls('[仮S It] [V is] [C likely enough] [真S {that節| [接 that], [M {分詞構文:付帯状況| [V rooted] [M {前| in the woods {前| of {並列| France | and Norway}}}]}], [M there] [V were growing] [S trees], [M {副詞節:時| [接 when] [S that sufferer] [V was put] [M {前| to death}]}], [M {分詞構文:付帯状況| [M already] [V marked] [M {前| by the Woodman, {同格>the Woodman| Fate},}] [M {to:副詞(目的)| [V to come down] [接 and] [V be sawn] [M {前| into boards}]}], [M {to:副詞(目的)| [V to make] [O a certain movable framework {前| with a {並列| sack | and a knife} {前| in it}}, {形容詞>a certain movable framework| terrible {前| in history}}]}]}]}].', {
    ja: 'あの受難者が処刑されたとき、フランスやノルウェーの森に根を張って育っていた木々があり、それらはすでに木こりの「運命」に目をつけられていて、切り倒され、板にひかれて、袋と刃のついた、歴史に恐ろしい名を残すある移動式の枠組みになる定めにあった、というのは十分ありそうなことである。',
    chunks: [
      ['It is likely enough that,', '十分ありそうなことだ（何がかは次へ）'],
      ['rooted in the woods of France and Norway,', 'フランスやノルウェーの森に根を張って'],
      ['there were growing trees,', '木々が育っていた'],
      ['when that sufferer was put to death,', 'あの受難者が処刑されたときに'],
      ['already marked by the Woodman, Fate,', 'すでに木こりの「運命」に目をつけられて'],
      ['to come down and be sawn into boards,', '切り倒され、板にひかれるように'],
      ['to make a certain movable framework', 'ある移動式の枠組みを作るために'],
      ['with a sack and a knife in it, terrible in history.', '袋と刃のついた、歴史に恐ろしい名を残す'],
    ],
    notes: {
      'It is likely enough that,': 'It は形式主語で、中身は that 以下。likely enough は「十分ありそうな」。',
      'there were growing trees,': 'there were growing trees は「木々が育っていた」（trees were growing there）。',
      'when that sufferer was put to death,': 'that sufferer は前の文の、処刑された若者のこと。put A to death は「A を死刑にする」。',
      'already marked by the Woodman, Fate,': 'the Woodman, Fate で「木こり、すなわち運命」。運命を、木に目印をつける木こりにたとえています。marked は trees を説明する過去分詞で、間に when … death がはさまっています。',
      'to make a certain movable framework': 'a certain movable framework（ある移動式の枠組み）は、はっきり名前を出さずにギロチン（断頭台）を指しています。',
      'with a sack and a knife in it, terrible in history.': 'sack は首を受ける袋、knife は刃。terrible in history（歴史上恐ろしい）が framework を後ろから説明します。',
    },
  }),
  // 13
  ls('[仮S It] [V is] [C likely enough] [真S {that節| [接 that] [M {前| in the rough outhouses {前| of some tillers} {前| of the heavy lands} {形容詞>the heavy lands| adjacent {前| to Paris}}}], [M there] [V were sheltered] [M {前| from the weather}] [M that very day], [S rude carts, {並列| {過去分詞>rude carts| [V bespattered] [M {前| with rustic mire}]}, | {過去分詞>rude carts| [V snuffed] [M about] [M {前| by pigs}]}, | and {過去分詞>rude carts| [V roosted] [M in] [M {前| by poultry}]}}, {関係,>rude carts| [O which] [S the Farmer, {同格>the Farmer| Death},] [V had] [M already] [V set apart] [C {to:補語| [V to be] [C his tumbrils {前| of the Revolution}]}]}]}].', {
    ja: 'パリ近郊の重い土地を耕す農夫たちの粗末な納屋の中には、まさにその日、田舎の泥をはね散らされ、豚に嗅ぎ回され、鶏にねぐらにされた粗末な荷車が、雨風をしのいで置かれていた。それは、農夫の「死」が、革命の死刑囚護送車にするため、すでに取り分けていた荷車だった、というのも十分ありそうなことである。',
    chunks: [
      ['It is likely enough that in the rough outhouses', '十分ありそうなことだ、粗末な納屋の中に'],
      ['of some tillers of the heavy lands adjacent to Paris,', 'パリに近い重い土地を耕す農夫たちの'],
      ['there were sheltered from the weather that very day,', 'まさにその日、雨風をしのいで置かれていた'],
      ['rude carts, bespattered with rustic mire,', '粗末な荷車が、田舎の泥をはね散らされ'],
      ['snuffed about by pigs, and roosted in by poultry,', '豚に嗅ぎ回され、鶏にねぐらにされて'],
      ['which the Farmer, Death,', 'その荷車は、農夫の「死」が'],
      ['had already set apart to be his tumbrils of the Revolution.', '革命の死刑囚護送車にするため、すでに取り分けていた'],
    ],
    notes: {
      'It is likely enough that in the rough outhouses': 'outhouse は「納屋・物置小屋」。',
      'of some tillers of the heavy lands adjacent to Paris,': 'tiller は「耕す人」、heavy lands は「重い（耕しにくい）土地」。adjacent to A は「A に隣接する」。',
      'there were sheltered from the weather that very day,': 'there were sheltered … rude carts で「粗末な荷車が（雨風から）かくまわれていた」。主語 rude carts が後ろに回った形です。',
      'rude carts, bespattered with rustic mire,': 'rude は「粗末な」、bespatter は「はね散らす」、rustic mire は「田舎のぬかるみ」。',
      'snuffed about by pigs, and roosted in by poultry,': 'snuff about は「嗅ぎ回る」、roost in は「（鳥が）中にとまって眠る」。in が最後に残る受け身の形です。poultry は「鶏など、家で飼う鳥」。',
      'which the Farmer, Death,': 'the Farmer, Death で「農夫、すなわち死」。死を農夫にたとえています。',
      'had already set apart to be his tumbrils of the Revolution.': 'set A apart は「A を別に取っておく」。tumbril は、フランス革命で死刑囚を運んだ荷車です。',
    },
  }),
  // 14
  ls('[接 But] [S {並列| that Woodman | and that Farmer}], [M {副詞節:譲歩| [接 though] [S they] [V work] [M unceasingly]}], [V work] [M silently], [接 and] [S no one] [V heard] [O them] [M {副詞節:時| [接 as] [S they] [V went about] [M {前| with muffled tread}]}]: [M the rather], [M {副詞節:理由| [接 forasmuch as] [S {to:名詞| [V to entertain] [O any suspicion {同格that>any suspicion| [接 that] [S they] [V were] [C awake]}]}], [V was] [C {to:補語| [V to be] [C {並列| atheistical | and traitorous}]}]}].', {
    ja: 'だが、あの木こりとあの農夫は、休みなく働いてはいても、音もなく働くので、足音を忍ばせて歩き回る彼らの音を聞いた者は誰もいなかった。なおさらのこと、彼らが目覚めているのではないかと少しでも疑えば、それは神を信じず、国にそむくことになったからである。',
    chunks: [
      ['But that Woodman and that Farmer,', 'だが、あの木こりとあの農夫は'],
      ['though they work unceasingly, work silently,', '休みなく働いてはいても、音もなく働き'],
      ['and no one heard them as they went about with muffled tread:', '足音を忍ばせて歩き回るのを、誰も聞かなかった'],
      ['the rather, forasmuch as to entertain any suspicion', 'なおさらだ、というのも、少しでも疑いを抱くことは'],
      ['that they were awake,', '彼らが目覚めているという'],
      ['was to be atheistical and traitorous.', '神を信じず、国にそむくことだったからだ'],
    ],
    marks: [
      [':', 'コロンのあとで、「誰も彼らの足音を聞かなかった」理由を、the rather, forasmuch as …（なおさらのこと、というのも…）と付け足します。'],
    ],
    notes: {
      'though they work unceasingly, work silently,': '主語 that Woodman and that Farmer に動詞 work が続き、間に though 以下がはさまっています。unceasingly は「休みなく」。',
      'and no one heard them as they went about with muffled tread:': 'go about は「歩き回る」。with muffled tread は「足音を忍ばせて」。',
      'the rather, forasmuch as to entertain any suspicion': 'the rather は「なおさら」、forasmuch as は because の古い言い方です。to entertain any suspicion（少しでも疑いを抱くこと）が節の主語です。',
      'was to be atheistical and traitorous.': 'atheistical は「神を信じない」、traitorous は「反逆的な」。運命や死が迫っていると疑うことさえ許されなかった、という皮肉です。',
    },
  }),
  // 15
  ls('[M {前| In England}], [M there] [V was] [M scarcely] [S an amount {前| of {並列| order | and protection}} {to:形容詞>an amount of order and protection| [V to justify] [O much national boasting]}].', {
    p: true,
    ja: 'イングランドには、国として大いに自慢できるほどの秩序も保護も、ほとんどなかった。',
    chunks: [
      ['In England, there was scarcely an amount', 'イングランドには、ほとんどなかった（何がかは次へ）'],
      ['of order and protection to justify much national boasting.', '国として大いに自慢できるほどの秩序や保護は'],
    ],
    notes: {
      'In England, there was scarcely an amount': 'scarcely は「ほとんど〜ない」。',
      'of order and protection to justify much national boasting.': 'to justify … が an amount of order and protection を後ろから説明し、「〜を正当化できるほどの」。boasting は「自慢」。',
    },
  }),
  // 16（とても長い1文を、セミコロンの位置で独立した節ごとに8つに分けた1つ目）
  ls('[S {並列| Daring burglaries {前| by armed men}, | and highway robberies},] [V took place] [M {前| in the capital itself}] [M every night];', {
    part: true,
    ja: '武装した男たちによる大胆な押し込み強盗や、追いはぎが、首都そのものの中で毎晩起きていた。',
    chunks: [
      ['Daring burglaries by armed men, and highway robberies,', '武装した男たちの大胆な押し込み強盗や追いはぎが'],
      ['took place in the capital itself every night;', '首都そのものの中で毎晩起きていた'],
    ],
    marks: [
      [';', 'セミコロンで区切りながら、当時のイングランドの無法ぶりを示す出来事を次々に並べていきます。まず「首都で毎晩起きる強盗」。'],
    ],
    notes: {
      'Daring burglaries by armed men, and highway robberies,': 'burglary は「押し込み強盗」、highway robbery は「追いはぎ（道で旅人を襲う強盗）」。',
      'took place in the capital itself every night;': 'take place は「起こる」。the capital itself は「首都そのもの（でさえ）」。',
    },
  }),
  // 17（2つ目）
  ls('[S families] [V were] [M publicly] [V cautioned] [C {to:補語| [M not] [V to go] [M {前| out of town}] [M {前| without {動名詞| [V removing] [O their furniture] [M {前| to upholsterers’ warehouses}] [M {前| for security}]}}]}];', {
    part: true,
    ja: '町を出るときには、安全のために家具を家具屋の倉庫へ預けてから出かけるようにと、家々に公に注意が出されていた。',
    chunks: [
      ['families were publicly cautioned', '家々は公に注意されていた（何をかは次へ）'],
      ['not to go out of town without removing their furniture', '家具を運び出さずに町を出ることのないように'],
      ['to upholsterers’ warehouses for security;', '安全のために家具屋の倉庫へ'],
    ],
    marks: [
      [';', '2つ目の出来事の終わりです。「留守の家は必ず荒らされるほど物騒だった」ことを、まじめな注意書きの形で皮肉っています。'],
    ],
    notes: {
      'families were publicly cautioned': 'caution A to do で「A に〜するよう注意する」。ここは受け身で、not to go … と打ち消しの不定詞が続きます。',
      'not to go out of town without removing their furniture': 'not … without doing で「〜せずに…しない」、つまり「必ず〜してから…する」。',
      'to upholsterers’ warehouses for security;': 'upholsterer は「家具職人・家具屋」。for security は「安全のために」。',
    },
  }),
  // 18（3つ目）
  ls('[S the highwayman {前| in the dark}] [V was] [C a City tradesman {前| in the light}], [接 and], [M {分詞構文:理由| [V being {並列| recognised | and challenged}] [M {前| by his fellow-tradesman {関係>his fellow-tradesman| [O whom] [S he] [V stopped] [M {前| in his character {前| of “the Captain,”}}]}}]}] [M gallantly] [V shot] [O him] [M {前| through the head}] [接 and] [V rode away];', {
    part: true,
    ja: '夜の追いはぎは、昼にはシティの商人であり、「隊長」と名乗って呼び止めた相手の同業者に正体を見破られ、とがめられると、勇ましくもその頭を撃ち抜いて、馬で走り去った。',
    chunks: [
      ['the highwayman in the dark was a City tradesman in the light,', '暗がりの追いはぎは、明るい所ではシティの商人で'],
      ['and, being recognised and challenged', 'そして、正体を見破られ、とがめられると'],
      ['by his fellow-tradesman whom he stopped in his character of “the Captain,”', '「隊長」として呼び止めた同業の商人に'],
      ['gallantly shot him through the head and rode away;', '勇ましくも相手の頭を撃ち抜いて馬で走り去った'],
    ],
    marks: [
      [';', '3つ目の出来事の終わりです。昼は商人、夜は追いはぎという二つの顔の話を、一つの区切りにまとめています。'],
    ],
    notes: {
      'the highwayman in the dark was a City tradesman in the light,': 'in the dark（暗がりでは）と in the light（明るい所では）を対にしています。the City はロンドンの商業の中心地区です。',
      'and, being recognised and challenged': 'being recognised … は理由・時を表す分詞構文で、「見破られ、とがめられて」。challenge はここでは「（誰かと）とがめる」。',
      'by his fellow-tradesman whom he stopped in his character of “the Captain,”': 'whom は his fellow-tradesman を受ける関係代名詞で、stopped の目的語。in his character of A は「A という役柄で」。',
      'gallantly shot him through the head and rode away;': 'gallantly（勇ましく）は、ひどい行いをわざとほめる皮肉です。',
    },
  }),
  // 19（4つ目）
  ls('[S the mail] [V was waylaid] [M {前| by seven robbers}], [接 and] [S the guard] [V shot] [O three] [C dead], [接 and] [M then] [V got shot] [C dead] [M himself] [M {前| by the other four}], [M “{前| in consequence {前| of the failure {前| of his ammunition}}}:”] [M {関係,>前の内容| [M after which] [S the mail] [V was robbed] [M {前| in peace}]}];', {
    part: true,
    ja: '郵便馬車は七人の強盗に待ち伏せされ、護衛は三人を撃ち殺したが、「弾薬が尽きたため」に、今度は自分が残りの四人に撃ち殺された。そのあと郵便馬車は悠々と略奪された。',
    chunks: [
      ['the mail was waylaid by seven robbers,', '郵便馬車は七人の強盗に待ち伏せされ'],
      ['and the guard shot three dead,', '護衛は三人を撃ち殺したが'],
      ['and then got shot dead himself by the other four,', 'そのあと自分も残りの四人に撃ち殺された'],
      ['“in consequence of the failure of his ammunition:”', '「弾薬が尽きた結果として」'],
      ['after which the mail was robbed in peace;', 'そのあと郵便馬車は悠々と略奪された'],
    ],
    marks: [
      [':', '「弾薬が尽きた結果として」という記事のような言い回しを引用し、コロンで区切って、その後に起きたこと（悠々と略奪された）を続けます。'],
      [';', '4つ目の出来事の終わりです。'],
    ],
    notes: {
      'the mail was waylaid by seven robbers,': 'the mail はここでは「郵便馬車」。waylay は「待ち伏せして襲う」。',
      'and the guard shot three dead,': 'shoot A dead で「A を撃ち殺す」（dead が補語）。',
      'and then got shot dead himself by the other four,': 'get shot は「撃たれる」（get＋過去分詞の受け身）。himself は「自分自身も」。',
      '“in consequence of the failure of his ammunition:”': 'in consequence of A は「A の結果」。当時の記事の言い回しをそのまま引いて、事件を淡々と語る皮肉です。',
      'after which the mail was robbed in peace;': 'after which は「そのあとで」。which は前の出来事全体を受けます。in peace は「邪魔されずに・悠々と」。',
    },
  }),
  // 20（5つ目）
  ls('[S that magnificent potentate, {同格>that magnificent potentate| the Lord Mayor {前| of London}},] [V was made] [C {to:補語| [V to {並列| stand | and deliver}] [M {前| on Turnham Green}]}], [M {前| by one highwayman, {関係,>one highwayman| [S who] [V despoiled] [O the illustrious creature] [M {前| in sight {前| of all his retinue}}]}}];', {
    part: true,
    ja: 'ロンドン市長という堂々たる権力者でさえ、ターンハム・グリーンで一人の追いはぎに「止まれ、金を出せ」とやられ、その高貴なお方は、お供の者全員の見ている前で身ぐるみはがされた。',
    chunks: [
      ['that magnificent potentate, the Lord Mayor of London,', 'あの堂々たる権力者、ロンドン市長が'],
      ['was made to stand and deliver on Turnham Green,', 'ターンハム・グリーンで立ち止まらされて、金品を差し出させられた'],
      ['by one highwayman,', '一人の追いはぎによって'],
      ['who despoiled the illustrious creature in sight of all his retinue;', 'その追いはぎは、お供一同の目の前で、その高貴なお方から奪い取った'],
    ],
    marks: [
      [';', '5つ目の出来事の終わりです。いちばん偉い人（ロンドン市長）でさえ襲われたという話で、無法ぶりを強めます。'],
    ],
    notes: {
      'that magnificent potentate, the Lord Mayor of London,': 'potentate は「権力者」。the Lord Mayor of London（ロンドン市長）が、that magnificent potentate を言いかえています。',
      'was made to stand and deliver on Turnham Green,': 'make＋人＋原形の受け身は be made to do（〜させられる）。Stand and deliver!（止まって金を出せ）は追いはぎの決まり文句です。',
      'who despoiled the illustrious creature in sight of all his retinue;': 'despoil は「奪い取る」、illustrious creature は「高名なお方」、retinue は「お供の一行」。',
    },
  }),
  // 21（6つ目）
  ls('[S prisoners {前| in London gaols}] [V fought] [O battles] [M {前| with their turnkeys}], [接 and] [S the majesty {前| of the law}] [V fired] [O blunderbusses] [M in {前| among them}], [M {分詞構文:付帯状況| [V loaded] [M {前| with rounds {前| of {並列| shot | and ball}}}]}];', {
    part: true,
    ja: 'ロンドンの監獄では囚人たちが看守と戦い、法の威光は、散弾と丸い弾を込めたらっぱ銃を、その中へ撃ち込んだ。',
    chunks: [
      ['prisoners in London gaols fought battles with their turnkeys,', 'ロンドンの監獄の囚人たちは看守と戦い'],
      ['and the majesty of the law fired blunderbusses in among them,', '法の威光は、そのただ中へらっぱ銃を撃ち込んだ'],
      ['loaded with rounds of shot and ball;', '散弾と丸い弾を込めた'],
    ],
    marks: [
      [';', '6つ目の出来事の終わりです。'],
    ],
    notes: {
      'prisoners in London gaols fought battles with their turnkeys,': 'gaol は jail の古いつづりで「監獄」。turnkey は「看守（鍵番）」。',
      'and the majesty of the law fired blunderbusses in among them,': 'the majesty of the law（法の威光）は、法を守る側の人々を大げさに言った皮肉です。blunderbuss は「らっぱ銃」。in among them は「彼らのただ中へ」。',
      'loaded with rounds of shot and ball;': 'loaded with A は「A を込めた」で、blunderbusses を説明します。shot は「散弾」、ball は「丸い弾」。',
    },
  }),
  // 22（7つ目）
  ls('[S thieves] [V snipped off] [O diamond crosses] [M {前| from the necks {前| of noble lords} {前| at Court drawing-rooms}}];', {
    part: true,
    ja: '盗人たちは、宮廷の謁見の間で、高貴な貴族たちの首からダイヤの十字架を切り取った。',
    chunks: [
      ['thieves snipped off diamond crosses from the necks', '盗人たちはダイヤの十字架を首から切り取った'],
      ['of noble lords at Court drawing-rooms;', '宮廷の謁見の間にいる高貴な貴族たちの'],
    ],
    marks: [
      [';', '7つ目の出来事の終わりです。'],
    ],
    notes: {
      'thieves snipped off diamond crosses from the necks': 'snip off は「ちょきんと切り取る」。',
      'of noble lords at Court drawing-rooms;': 'Court drawing-rooms は、宮廷で王が人々に会う「謁見の間」です。',
    },
  }),
  // 23（8つ目。ここで文が終わる）
  ls('[S musketeers] [V went] [M {前| into St. Giles’s}], [M {to:副詞(目的)| [V to search for] [O contraband goods]}], [接 and] [S the mob] [V fired] [M {前| on the musketeers}], [接 and] [S the musketeers] [V fired] [M {前| on the mob}], [接 and] [S nobody] [V thought] [O any {前| of these occurrences}] [C much {前| out of the common way}].', {
    ja: '銃士たちが密輸品を捜しにセント・ジャイルズへ入ると、群衆は銃士たちに発砲し、銃士たちも群衆に発砲した。それでも誰ひとり、こうした出来事のどれ一つとして、たいして変わったことだとは思わなかった。',
    chunks: [
      ['musketeers went into St. Giles’s, to search for contraband goods,', '銃士たちが密輸品を捜しにセント・ジャイルズへ入ると'],
      ['and the mob fired on the musketeers,', '群衆は銃士たちに発砲し'],
      ['and the musketeers fired on the mob,', '銃士たちも群衆に発砲した'],
      ['and nobody thought any of these occurrences', 'それでも誰ひとり、こうした出来事のどれも思わなかった'],
      ['much out of the common way.', 'たいして変わったことだとは'],
    ],
    notes: {
      'musketeers went into St. Giles’s, to search for contraband goods,': 'musketeer は「（マスケット銃を持つ）兵士」。St. Giles’s はロンドンの貧しい地区、contraband goods は「密輸品」。',
      'and nobody thought any of these occurrences': 'think A B で「A を B だと思う」。',
      'much out of the common way.': 'out of the common way は「ふつうから外れた・珍しい」。こんな無法が当たり前だったという皮肉で、長い文をしめくくります。',
    },
  }),
  // 24
  ls('[M {前| In the midst {前| of them}}], [S the hangman, {形容詞>the hangman| {並列| ever busy | and ever worse {前| than useless}}},] [V was] [C {前| in constant requisition}]; [M now], [M {分詞構文:付帯状況| [V stringing up] [O long rows {前| of miscellaneous criminals}]}]; [M now], [M {分詞構文:付帯状況| [V hanging] [O a housebreaker] [M {前| on Saturday}] [M {関係>a housebreaker| [S who] [V had been taken] [M {前| on Tuesday}]}]}]; [M now], [M {分詞構文:付帯状況| [V burning] [O people] [M {前| in the hand}] [M {前| at Newgate}] [M {前| by the dozen}]}], [接 and] [M now] [M {分詞構文:付帯状況| [V burning] [O pamphlets] [M {前| at the door {前| of Westminster Hall}}]}]; [M to-day], [M {分詞構文:付帯状況| [V taking] [O the life {前| of an atrocious murderer}], [接 and] [M to-morrow] [M {前| of a wretched pilferer {関係>a wretched pilferer| [S who] [V had robbed] [O a farmer’s boy] [M {前| of sixpence}]}}]}].', {
    ja: 'そうした中で、いつも忙しく、役に立たないどころか害をなしてばかりの死刑執行人は、ひっきりなしに呼び出されていた。あるときは雑多な罪人を長い列にしてつるし、あるときは火曜に捕まった押し込み強盗を土曜に絞首刑にし、あるときはニューゲートで人々の手に一度に十数人ずつ焼き印を押し、またあるときはウェストミンスター・ホールの門前でパンフレットを焼いた。今日は凶悪な人殺しの命を奪い、明日は農家の少年から六ペンスを盗んだ哀れなこそ泥の命を奪うのだった。',
    chunks: [
      ['In the midst of them, the hangman,', 'そうした中で、死刑執行人は'],
      ['ever busy and ever worse than useless,', 'いつも忙しく、いつも役立たずより悪く'],
      ['was in constant requisition;', 'ひっきりなしに求められていた'],
      ['now, stringing up long rows of miscellaneous criminals;', 'あるときは雑多な罪人を長い列にしてつるし'],
      ['now, hanging a housebreaker on Saturday who had been taken on Tuesday;', 'あるときは火曜に捕まった押し込み強盗を土曜に絞首刑にし'],
      ['now, burning people in the hand at Newgate by the dozen,', 'あるときはニューゲートで人々の手に、十数人ずつ焼き印を押し'],
      ['and now burning pamphlets at the door of Westminster Hall;', 'またあるときはウェストミンスター・ホールの門前でパンフレットを焼いた'],
      ['to-day, taking the life of an atrocious murderer,', '今日は凶悪な人殺しの命を奪い'],
      ['and to-morrow of a wretched pilferer', '明日は哀れなこそ泥の命を'],
      ['who had robbed a farmer’s boy of sixpence.', '農家の少年から六ペンスを盗んだ'],
    ],
    marks: [
      [';', 'セミコロンのあとで、「引っぱりだこだった」死刑執行人の仕事ぶりを、now（あるときは）で始まる語句で次々に並べます。'],
      [';', '2つ目の now の区切りです。'],
      [';', '3つ目の now の区切りです。次の now の2つ（手に焼き印・パンフレットを焼く）は and でつないで一組にしています。'],
      [';', '最後は to-day（今日は）と to-morrow（明日は）を対にして、凶悪な人殺しもこそ泥も同じように死刑にされたことを示します。'],
    ],
    notes: {
      'In the midst of them, the hangman,': 'in the midst of A は「A のただ中で」。them は前の文の無法な出来事の数々です。',
      'ever busy and ever worse than useless,': 'worse than useless は「役に立たないどころか有害な」。ever は「いつも」。この語句が the hangman を説明しています。',
      'was in constant requisition;': 'in requisition は「求められて・引っぱりだこで」。',
      'now, stringing up long rows of miscellaneous criminals;': 'now …, now … で「あるときは…、あるときは…」。string up は「（首を）つるす」、miscellaneous は「雑多な」。',
      'now, hanging a housebreaker on Saturday who had been taken on Tuesday;': 'who had been taken on Tuesday は a housebreaker を説明する関係詞節で、間に on Saturday がはさまっています。捕まってすぐ処刑されたことを表します。',
      'now, burning people in the hand at Newgate by the dozen,': 'burn A in the hand は「A の手に焼き印を押す」（当時の刑罰）。Newgate はロンドンの監獄、by the dozen は「何十人単位で」。',
      'and to-morrow of a wretched pilferer': 'and to-morrow (taking the life) of … の taking the life が省かれています。pilferer は「こそ泥」。',
      'who had robbed a farmer’s boy of sixpence.': 'rob A of B で「A から B を奪う」。六ペンスはわずかな金額で、重すぎる刑罰への皮肉です。',
    },
  }),
  // 25
  ls('[S {並列| All these things, | and a thousand {前| like them}},] [V came to pass] [M {前| {成句| in and close upon} the dear old year {成句| one thousand seven hundred and seventy-five}}].', {
    p: true,
    ja: 'こうした出来事のすべてと、それに似た数えきれない出来事が、なつかしい千七百七十五年のうちとその前後に起こったのである。',
    chunks: [
      ['All these things, and a thousand like them,', 'こうしたことすべてと、それに似た数えきれないことが'],
      ['came to pass in and close upon the dear old year', '起こった、なつかしい年のうちとその前後に'],
      ['one thousand seven hundred and seventy-five.', '千七百七十五年の'],
    ],
    unitNotes: {
      'in and close upon': '「〜のうちと、そのすぐ前後に」。前置詞 in と close upon（〜に接して）を and で組み、あとの年を共通の目的語にしています。',
      'one thousand seven hundred and seventy-five': '1775 を英語の言葉で書いた言い方。and は数の読み方の一部です。',
    },
    notes: {
      'All these things, and a thousand like them,': 'a thousand like them は「それに似た千もの（数えきれない）こと」。',
      'came to pass in and close upon the dear old year': 'come to pass は「起こる」。in and close upon A は「A のうちと、そのすぐ前後に」。dear old（なつかしい）は皮肉を含んだ言い方です。',
    },
  }),
  // 26
  ls('[M {分詞構文:付帯状況| [V Environed] [M {前| by them}]}], [M {副詞節:時| [接 while] [S {並列| the Woodman | and the Farmer}] [V worked] [M unheeded]}], [S {並列| those two {前| of the large jaws}, | and those other two {前| of {並列| the plain | and the fair} faces}},] [V trod] [M {前| with stir enough}], [接 and] [V carried] [O their divine rights] [M {前| with a high hand}].', {
    ja: 'そうした出来事に囲まれ、木こりと農夫が誰にも気づかれずに働いているあいだ、あごの大きなあの二人と、地味な顔と美しい顔のもう二人は、十分に騒ぎ立てながら歩み、神から授かった権利を高圧的にふるっていた。',
    chunks: [
      ['Environed by them,', 'そうしたものに取り囲まれて'],
      ['while the Woodman and the Farmer worked unheeded,', '木こりと農夫が誰にも気づかれずに働くあいだ'],
      ['those two of the large jaws,', 'あごの大きなあの二人と'],
      ['and those other two of the plain and the fair faces,', '地味な顔と美しい顔のもう二人は'],
      ['trod with stir enough,', 'たっぷり騒ぎ立てながら歩み'],
      ['and carried their divine rights with a high hand.', '神から授かった権利を高圧的にふるった'],
    ],
    notes: {
      'Environed by them,': 'environ は「取り囲む」。them は前の文の all these things を指します。',
      'while the Woodman and the Farmer worked unheeded,': 'unheeded は「気づかれずに」。運命と死が、人知れず準備を進めていたことを表します。',
      'those two of the large jaws,': 'those two of the large jaws は、第2段落のあごの大きな二人の王のこと。',
      'and those other two of the plain and the fair faces,': '地味な顔と美しい顔の二人の王妃のことです。',
      'trod with stir enough,': 'trod は tread（歩む）の過去形。with stir は「騒がしく」。',
      'and carried their divine rights with a high hand.': 'divine rights は、王の権力は神から授かったとする「王権神授」の考え。with a high hand は「高圧的に」。',
    },
  }),
  // 27
  ls('[M Thus] [V did] [S the year {成句| one thousand seven hundred and seventy-five}] [V conduct] [O {並列| their Greatnesses, | and myriads {前| of small creatures}} — {同格>small creatures| the creatures {前| of this chronicle} {前| among the rest}} —] [M {前| along the roads {関係>the roads| [S that] [V lay] [M {前| before them}]}}].', {
    ja: 'こうして千七百七十五年という年は、偉いお方たちと、無数の小さな生き物たち——この年代記の登場人物たちもその中にいる——を、それぞれの前に延びる道にそって導いていったのである。',
    chunks: [
      ['Thus did the year one thousand seven hundred and seventy-five', 'こうして千七百七十五年という年は導いた'],
      ['conduct their Greatnesses, and myriads of small creatures —', '偉いお方たちと、無数の小さな生き物たちを——'],
      ['the creatures of this chronicle among the rest —', 'この年代記の生き物たちもその中にいる——'],
      ['along the roads that lay before them.', '彼らの前に延びる道にそって'],
    ],
    unitNotes: {
      'one thousand seven hundred and seventy-five': '1775 を英語の言葉で書いた言い方。and は数の読み方の一部です。',
    },
    marks: [
      ['— —', '2つのダッシュで the creatures of this chronicle among the rest（この物語の登場人物たちもその中に）をはさみ、「無数の小さな生き物」の中に、これから語る物語の人々も含まれていると差し込みます。'],
    ],
    notes: {
      'Thus did the year one thousand seven hundred and seventy-five': 'Thus を文の頭に出し、did を主語 the year … の前に置いた倒置。did … conduct で「導いた」を強めています。',
      'conduct their Greatnesses, and myriads of small creatures —': 'their Greatnesses は「偉いお方たち」（王や王妃をからかった言い方）。myriads of A は「無数の A」。',
      'the creatures of this chronicle among the rest —': 'chronicle は「年代記・物語」。among the rest は「そのほかのものに混じって」。',
      'along the roads that lay before them.': 'lay は lie（延びる）の過去形。これから始まる物語へつなぐ、第1章の結びです。',
    },
  }),
])
