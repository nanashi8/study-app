import { ls } from './entry.js'

export default Object.freeze([
  // 1
  ls('[V Call] [O me] [C Ishmael].', {
    p: true,
    ja: '私をイシュメールと呼んでくれ。',
    chunks: [
      ['Call me Ishmael.', '私をイシュメールと呼んでくれ'],
    ],
    notes: {
      'Call me Ishmael.': 'call A B で「A を B と呼ぶ」。語り手が読者に直接呼びかけて、物語が始まります。',
    },
  }),
  // 2
  ls('[M Some years ago] — [M {挿入| never mind how long precisely}] — [M {分詞構文:理由| [V having] [O {並列| {成句| little or no} money {前| in my purse}, | and nothing particular {to:形容詞>nothing particular| [V to interest] [O me] [M {前| on shore}]}}]}], [S I] [V thought] [O {that省略| [S I] [V would sail] [M about] [M a little] [接 and] [V see] [O the watery part {前| of the world}]}].', {
    ja: '何年か前のこと——正確に何年前かは気にしないでくれ——財布にはほとんど金がなく、陸には特に心を引くものもなかったので、少し船で回って、世界の水の部分、つまり海を見てこようと思った。',
    chunks: [
      ['Some years ago —', '何年か前——'],
      ['never mind how long precisely —', '正確に何年前かは気にしないでくれ——'],
      ['having little or no money in my purse,', '財布にほとんど金がなく'],
      ['and nothing particular to interest me on shore,', '陸には特に心を引くものもなかったので'],
      ['I thought I would sail about a little', '私は少し船であちこち回ってみようと思った'],
      ['and see the watery part of the world.', 'そして世界の水の部分を見てこようと'],
    ],
    unitNotes: {
      'little or no': '「ほとんど〜ない」。little（わずかな）と no（まったくない）を or でつないだ決まった言い方です。',
    },
    marks: [
      ['— —', '2つのダッシュが never mind how long precisely（正確に何年前かは気にしないで）をはさみ、話の途中に語り手のひと言を差し込んでいます。外して読むと Some years ago, having … とつながります。'],
    ],
    notes: {
      'having little or no money in my purse,': 'having で始まる分詞構文が「〜なので」と理由を表します。',
      'and nothing particular to interest me on shore,': 'to interest me が nothing particular を後ろから説明し、「私の心を引く特別なもの（は何もない）」。having の目的語が and で2つ並んでいます。',
      'I thought I would sail about a little': 'would は過去から見た未来で「〜しよう」。sail about は「船であちこち回る」。',
      'and see the watery part of the world.': 'the watery part of the world（世界の水の部分）は海のこと。see は would を共有しています。',
    },
  }),
  // 3
  ls('[S It] [V is] [C a way {関係省略:目的格>a way| [S I] [V have]} {前| of {並列| {動名詞| [V driving off] [O the spleen]} | and {動名詞| [V regulating] [O the circulation]}}}].', {
    ja: 'それは、憂うつを追い払い、血の巡りを整えるための、私なりのやり方なのだ。',
    chunks: [
      ['It is a way I have', 'それは私なりのやり方だ（何のやり方かは次へ）'],
      ['of driving off the spleen and regulating the circulation.', '憂うつを追い払い、血の巡りを整えるための'],
    ],
    notes: {
      'It is a way I have': 'It は前の文の「船に乗って海を見ること」を指します。of 以下も a way を説明し、「〜するやり方」になります。',
      'of driving off the spleen and regulating the circulation.': 'the spleen は「憂うつ・ふさぎ」。昔は脾臓（spleen）が憂うつな気分を生むと考えられていました。drive off は「追い払う」。',
    },
  }),
  // 4
  ls('{並列| [M {副詞節:時| [接 Whenever] [S I] [V find] [O myself] [C {現在分詞:補語| [V growing] [C grim] [M {前| about the mouth}]}]}]; | [M {副詞節:時| [接 whenever] [S it] [V is] [C a damp, drizzly November {前| in my soul}]}]; | [M {副詞節:時| [接 whenever] [S I] [V find] [O myself] [C {並列| {現在分詞:補語| [M involuntarily] [V pausing] [M {前| before coffin warehouses}]}, | and {現在分詞:補語| [V bringing up] [O the rear {前| of every funeral {関係省略:目的格>every funeral| [S I] [V meet]}}]}}]}]; | [接 and] [M especially {副詞節:時| [接 whenever] [S my hypos] [V get] [O such an upper hand {前| of me}], [M {副詞節:結果| [接 that] [仮S it] [V requires] [O a strong moral principle] [真S {to:名詞| [V to prevent] [O me] [M {前| from {並列| {動名詞| [M deliberately] [V stepping] [M {前| into the street}]}, | and {動名詞| [M methodically] [V knocking] [O people’s hats] [M off]}}}]}]}]}]} — [M then], [S I] [V account] [仮O it] [C high time] [真O {to:名詞| [V to get] [M {前| to sea}] [M as soon {副詞節:比較| [接 as] [S I] [V can]}]}].', {
    ja: '口元がこわばってくるのに気づくたびに、魂の中がじめじめと霧雨の降る十一月になるたびに、思わず棺桶屋の前で立ち止まり、出会う葬列のしんがりについて歩いている自分に気づくたびに、そしてとりわけ、ふさぎの虫にひどく取りつかれて、わざと通りへ踏み出して人々の帽子を片っ端からたたき落とさずにいるには強い道徳心が要るほどになったときには——そういうときには、できるだけ早く海へ出る潮時だと考えるのだ。',
    chunks: [
      ['Whenever I find myself growing grim about the mouth;', '口元がこわばってくるのに気づくたびに'],
      ['whenever it is a damp, drizzly November in my soul;', '魂の中がじめじめと霧雨の降る十一月になるたびに'],
      ['whenever I find myself involuntarily pausing before coffin warehouses,', '思わず棺桶屋の前で立ち止まり'],
      ['and bringing up the rear of every funeral I meet;', '出会う葬列のしんがりについて歩いている自分に気づくたびに'],
      ['and especially whenever my hypos get such an upper hand of me,', 'そしてとりわけ、ふさぎの虫にひどく取りつかれて'],
      ['that it requires a strong moral principle', '強い道徳心が要るほどになったときには（何のためかは次へ）'],
      ['to prevent me from deliberately stepping into the street,', '私がわざと通りへ踏み出したり'],
      ['and methodically knocking people’s hats off —', '人々の帽子を片っ端からたたき落としたりしないように——'],
      ['then, I account it high time', 'そういうときには、今が潮時だと考える（何の潮時かは次へ）'],
      ['to get to sea as soon as I can.', 'できるだけ早く海へ出る'],
    ],
    marks: [
      [';', 'セミコロンが whenever で始まる節を区切って並べます。主節はまだ来ておらず、「〜するたびに」がこのあとも続きます。'],
      [';', '2つ目の whenever の節の終わりです。コンマより強い区切りで、長い節どうしを見分けやすくしています。'],
      [';', '3つ目の whenever の節の終わりです。次の and especially whenever で、最後にいちばん強い場合を足します。'],
      ['—', 'ダッシュで長い前置き（4つの whenever の節）を締めくくり、then「そういうときには」で受け直して主節 I account … を始めます。'],
    ],
    notes: {
      'Whenever I find myself growing grim about the mouth;': 'find myself doing で「気がつくと自分が〜している」。grim about the mouth は「口元がこわばって険しい」。',
      'whenever it is a damp, drizzly November in my soul;': '心の中の暗く沈んだ気分を、じめじめと霧雨の降る11月の天気にたとえています。',
      'and bringing up the rear of every funeral I meet;': 'bring up the rear は「列のいちばん後ろにつく」。bringing は find myself の後ろの pausing と並んでいます。',
      'and especially whenever my hypos get such an upper hand of me,': 'hypos は hypochondria（ふさぎこみ）の略。get the upper hand of A で「A を支配する」。such … that ～ で「とても…なので～」。',
      'that it requires a strong moral principle': 'it は形式主語で、中身は to prevent 以下「〜を防ぐこと」。「〜を防ぐには強い道徳心が要る」と読みます。',
      'and methodically knocking people’s hats off —': 'knock A off で「A をたたき落とす」。off が目的語 people’s hats の後ろに置かれています。',
      'then, I account it high time': 'account it high time to do で「〜すべき潮時だと考える」。it は形式目的語で、中身は to get to sea 以下です。',
    },
  }),
  // 5
  ls('[S This] [V is] [C my substitute {前| for {並列| pistol | and ball}}].', {
    ja: 'これが、私にとって拳銃と弾丸の代わりなのだ。',
    chunks: [
      ['This is my substitute for pistol and ball.', 'これが私にとって拳銃と弾丸の代わりなのだ'],
    ],
    notes: {
      'This is my substitute for pistol and ball.': 'substitute for A で「A の代わり」。pistol and ball（拳銃と弾丸）は命を絶つ手段のたとえで、海へ出ることがその代わりだと言っています。',
    },
  }),
  // 6
  ls('[M {前| With a philosophical flourish}] [S Cato] [V throws] [O himself] [M {前| upon his sword}]; [S I] [M quietly] [V take] [M {前| to the ship}].', {
    ja: 'カトーは哲学者らしい華々しさで自分の剣に身を投げるが、私は静かに船に乗る。',
    chunks: [
      ['With a philosophical flourish Cato throws himself upon his sword;', '哲学者らしい華々しさで、カトーは自分の剣に身を投げる'],
      ['I quietly take to the ship.', '私は静かに船に乗る'],
    ],
    marks: [
      [';', 'セミコロンが、カトーの死に方と「私」のやり方という対になる2つの文をつなぎます。接続詞を使わずに並べて、違いをくっきり見せています。'],
    ],
    notes: {
      'With a philosophical flourish Cato throws himself upon his sword;': 'カトーは古代ローマの政治家で、敵に屈するより自分の剣で命を絶ちました。flourish は「大げさな身ぶり」。',
      'I quietly take to the ship.': 'take to A で「A に頼る・A へ向かう」。命を絶つ代わりに、船に乗って海へ出るという意味です。',
    },
  }),
  // 7
  ls('[M There] [V is] [S nothing surprising] [M {前| in this}].', {
    ja: 'これには何の不思議もない。',
    chunks: [
      ['There is nothing surprising in this.', 'これには何の不思議もない'],
    ],
    notes: {
      'There is nothing surprising in this.': '-thing で終わる語（nothing）は、形容詞（surprising）を後ろに置きます。',
    },
  }),
  // 8
  ls('[M {副詞節:条件| [接 If] [S they] [M but] [V knew] [O it]}], [S almost all men {前| in their degree}], [M {成句| some time or other}], [V cherish] [O very nearly the same feelings {前| towards the ocean} {前| with me}].', {
    ja: '本人たちが気づきさえすれば、ほとんどすべての人が、程度の差こそあれ、いつかは私とほとんど同じ海への思いを抱くのだ。',
    chunks: [
      ['If they but knew it,', '本人たちが気づきさえすれば'],
      ['almost all men in their degree,', 'ほとんどすべての人が、程度の差はあれ'],
      ['some time or other,', 'いつかは'],
      ['cherish very nearly the same feelings towards the ocean with me.', '私とほとんど同じ海への思いを抱くのだ'],
    ],
    unitNotes: {
      'some time or other': '「いつか・そのうち」。some time（いつか）に or other を添えて、はっきりしない時を表します。',
    },
    notes: {
      'If they but knew it,': 'but は only と同じで「〜さえ」。knew は過去形ですが、今の事実に反する仮定（仮定法過去）で「気づきさえすれば」。',
      'almost all men in their degree,': 'in their degree は「それぞれの程度に応じて・程度の差はあれ」。',
      'cherish very nearly the same feelings towards the ocean with me.': 'the same A with me で「私と同じ A」。cherish は「（気持ちを）大切に抱く」。',
    },
  }),
  // 9
  ls('[M There] [M now] [V is] [S your insular city {前| of the Manhattoes}, {過去分詞>your insular city| [V belted round] [M {前| by wharves}] [M {副詞節:様態(省略)| [接 as] [S Indian isles] [M {前| by coral reefs}]}]}] — [S commerce] [V surrounds] [O it] [M {前| with her surf}].', {
    p: true,
    ja: 'さあ、ここに諸君の島の町マンハッタンがある。インド洋の島々が珊瑚礁に取り巻かれているように、町は波止場にぐるりと取り巻かれている——商業が、打ち寄せる波となってこの町を取り囲んでいるのだ。',
    chunks: [
      ['There now is your insular city of the Manhattoes,', 'さあ、ここに諸君の島の町マンハッタンがある'],
      ['belted round by wharves', '波止場にぐるりと取り巻かれて'],
      ['as Indian isles by coral reefs —', 'ちょうどインド洋の島々が珊瑚礁に取り巻かれているように——'],
      ['commerce surrounds it with her surf.', '商業がその打ち寄せる波で町を取り囲んでいる'],
    ],
    marks: [
      ['—', 'ダッシュのあとに、前の内容を言いかえる新しい文 commerce surrounds it with her surf が続きます。珊瑚礁のたとえを「商業が波となって町を取り巻く」とさらに押し広げています。'],
    ],
    notes: {
      'There now is your insular city of the Manhattoes,': 'your は読者に語りかける言い方で「諸君の」。Manhattoes はマンハッタンの古い呼び名、insular は「島の」。',
      'belted round by wharves': 'belt round は「帯のようにぐるりと取り巻く」。belted round は過去分詞で、your insular city を後ろから説明します。',
      'as Indian isles by coral reefs —': 'as Indian isles (are belted round) by coral reefs の are belted round が省かれています。Indian isles はインド洋や東インドの島々。',
      'commerce surrounds it with her surf.': 'commerce（商業）を her で受けて女性にたとえ、商業の活気を打ち寄せる波（surf）に見立てています。',
    },
  }),
  // 10
  ls('[M {並列| Right | and left}], [S the streets] [V take] [O you] [M waterward].', {
    ja: '右へ行っても左へ行っても、通りは人を水辺へと導く。',
    chunks: [
      ['Right and left, the streets take you waterward.', '右へ行っても左へ行っても、通りは人を水辺へ連れていく'],
    ],
    notes: {
      'Right and left, the streets take you waterward.': 'waterward は「水のほうへ」。-ward は「〜の方向へ」を表します（homeward・northward）。you は読者を含む「人」一般です。',
    },
  }),
  // 11
  ls('[S Its extreme downtown] [V is] [C the battery, {関係,>the battery| [M where] [S that noble mole] [V is washed] [M {前| by waves}], [接 and] [V cooled] [M {前| by breezes, {関係,>breezes| [S which] [M a few hours previous] [V were] [M {前| out of sight {前| of land}}]}}]}].', {
    ja: '町のいちばん南の端はバッテリーで、そこではあの立派な防波堤が波に洗われ、数時間前には陸の見えない沖にあったそよ風に冷やされている。',
    chunks: [
      ['Its extreme downtown is the battery,', '町のいちばん南の端はバッテリーだ'],
      ['where that noble mole is washed by waves,', 'そこではあの立派な防波堤が波に洗われ'],
      ['and cooled by breezes,', 'そよ風に冷やされている'],
      ['which a few hours previous were out of sight of land.', 'その風は数時間前には陸の見えない沖にあった'],
    ],
    notes: {
      'Its extreme downtown is the battery,': 'downtown はここでは「町の南の端のあたり」。the battery は昔の砲台の跡地で、マンハッタン南端の公園の名前です。',
      'where that noble mole is washed by waves,': 'mole は「防波堤」。noble は「堂々とした・立派な」。',
      'which a few hours previous were out of sight of land.': 'a few hours previous は「数時間前に」（previous を副詞のように使っています）。out of sight of land は「陸が見えない所に」。',
    },
  }),
  // 12
  ls('[V Look] [M {前| at the crowds {前| of water-gazers}}] [M there].', {
    ja: 'そこに群がる、水を見つめる人々を見てみよ。',
    chunks: [
      ['Look at the crowds of water-gazers there.', 'そこに群がる、水を見つめる人々を見てみよ'],
    ],
    notes: {
      'Look at the crowds of water-gazers there.': 'water-gazers は「水をじっと見つめる人々」。gaze（見つめる）に -er が付いた語を、ハイフンで water とつないでいます。',
    },
  }),
  // 13
  ls('[V Circumambulate] [O the city] [M {前| of a dreamy Sabbath afternoon}].', {
    p: true,
    ja: '夢見るような安息日の午後に、町をぐるりと一回りしてみよ。',
    chunks: [
      ['Circumambulate the city of a dreamy Sabbath afternoon.', '夢見るような安息日の午後に、町をぐるりと歩いてみよ'],
    ],
    notes: {
      'Circumambulate the city of a dreamy Sabbath afternoon.': 'circumambulate は「ぐるりと歩いて回る」。of a … afternoon の of は「〜に」と時を表す古い言い方です。Sabbath は安息日（キリスト教では日曜日）。',
    },
  }),
  // 14
  ls('[V Go] [M {前| from Corlears Hook}] [M {前| to Coenties Slip}], [接 and] [M {前| from thence}], [M {前| by Whitehall}], [M northward].', {
    ja: 'コーリアーズ・フックからコエンティーズ・スリップへ、そこからホワイトホールを通って北へと歩いてみよ。',
    chunks: [
      ['Go from Corlears Hook to Coenties Slip,', 'コーリアーズ・フックからコエンティーズ・スリップへ行き'],
      ['and from thence, by Whitehall, northward.', 'そこからホワイトホールを通って北へ'],
    ],
    notes: {
      'Go from Corlears Hook to Coenties Slip,': 'Corlears Hook・Coenties Slip・Whitehall は、マンハッタンの水辺の地名です。',
      'and from thence, by Whitehall, northward.': 'from thence は「そこから」の古い言い方。and のあとでは動詞 go が省かれています。',
    },
  }),
  // 15
  ls('[O What] [V do] [S you] [V see]? — [M {分詞構文:付帯状況| [V Posted] [M {前| like silent sentinels}] [M all {前| around the town}]}], [V stand] [S thousands {前| upon thousands} {前| of mortal men} {過去分詞>mortal men| [V fixed] [M {前| in ocean reveries}]}].', {
    ja: '何が見えるだろう？——町のぐるり一帯に、もの言わぬ番兵のように並んで、何千何万という人間たちが、海の夢想に心を奪われて立ちつくしているのだ。',
    chunks: [
      ['What do you see?', '何が見える？'],
      ['— Posted like silent sentinels all around the town,', '——町のぐるり一帯に、もの言わぬ番兵のように配置されて'],
      ['stand thousands upon thousands of mortal men', '何千何万という人間たちが立っている'],
      ['fixed in ocean reveries.', '海の夢想に心を奪われたまま'],
    ],
    marks: [
      ['—', '問い What do you see?（何が見える？）のあとにダッシュを置き、答えにあたる文をすぐに続けます。'],
    ],
    notes: {
      '— Posted like silent sentinels all around the town,': 'posted は「（見張りとして）配置された」。この分詞のまとまりを文の頭に出し、動詞 stand を主語より前に置いた倒置の文です。',
      'stand thousands upon thousands of mortal men': 'thousands upon thousands は「何千何万もの」。主語が長いので、動詞 stand が先に来ています。mortal men は「死すべき人間たち」、つまりふつうの人々です。',
      'fixed in ocean reveries.': 'fixed in A は「A に心を奪われた」。reverie は「夢想・物思い」。',
    },
  }),
  // 16
  ls('[独 Some {現在分詞>Some| [V leaning] [M {前| against the spiles}]}]; [独 some {過去分詞>some| [V seated] [M {前| upon the pier-heads}]}]; [独 some {現在分詞>some| [V looking] [M {前| over the bulwarks {前| of ships {前| from China}}}]}]; [独 some {形容詞>some| high aloft {前| in the rigging}}, {副詞節:様態| [接 as if] [V striving] [O {to:名詞| [V to get] [O a still better seaward peep]}]}].', {
    fragment: true,
    ja: 'ある者は杭にもたれ、ある者は桟橋の先に腰を下ろし、ある者は中国から来た船の舷側越しに眺め、ある者は帆綱の高いところにのぼって、まるで海をもっとよくのぞこうとしているかのようだ。',
    chunks: [
      ['Some leaning against the spiles;', 'ある者は杭にもたれ'],
      ['some seated upon the pier-heads;', 'ある者は桟橋の先に腰を下ろし'],
      ['some looking over the bulwarks of ships from China;', 'ある者は中国から来た船の舷側越しに眺め'],
      ['some high aloft in the rigging,', 'ある者は帆綱の高いところにいて'],
      ['as if striving to get a still better seaward peep.', 'まるで海をもっとよくのぞこうと努めているかのようだ'],
    ],
    marks: [
      [';', 'セミコロンが、Some（ある者は）で始まる語句を区切って並べます。前の文の人々の様子を1人ずつ描いていきます。'],
      [';', '2つ目の some の語句の終わりです。人々の居場所と姿勢を、区切りながら順に足していきます。'],
      [';', '3つ目の some の語句の終わりです。最後の some high aloft … で、いちばん高い所にいる人を描いて締めくくります。'],
    ],
    notes: {
      'Some leaning against the spiles;': '前の文の thousands of mortal men の様子を、動詞のない語句で並べています（Some are leaning … の are が省かれた形とも読めます）。spile は「杭」。',
      'some seated upon the pier-heads;': 'seated は「座っている」（be seated で「座る」）。pier-head は「桟橋の先端」。',
      'some looking over the bulwarks of ships from China;': 'bulwarks は「舷側（船べりの囲い）」。',
      'some high aloft in the rigging,': 'aloft は「高い所に」。rigging は帆を張るための綱や柱の全体（索具）。',
      'as if striving to get a still better seaward peep.': 'as if (they were) striving … の they were が省かれています。still better は比較級を強めて「さらによい」、seaward peep は「海のほうをのぞくこと」。',
    },
  }),
  // 17
  ls('[接 But] [S these] [V are] [C all landsmen]; [M {前| of week days}] [M {分詞構文:付帯状況| [V pent up] [M {前| in {並列| lath | and plaster}}] — [V tied] [M {前| to counters}], [V nailed] [M {前| to benches}], [V clinched] [M {前| to desks}]}].', {
    ja: 'だが、彼らはみな陸の人間だ。平日には木ずりと漆喰の建物に閉じこめられ——売り台に縛りつけられ、仕事台に釘づけにされ、机に留めつけられている。',
    chunks: [
      ['But these are all landsmen;', 'だが彼らはみな陸の人間だ'],
      ['of week days pent up in lath and plaster —', '平日には木ずりと漆喰の中に閉じこめられ——'],
      ['tied to counters, nailed to benches, clinched to desks.', '売り台に縛りつけられ、仕事台に釘づけにされ、机に留めつけられている'],
    ],
    marks: [
      [';', 'セミコロンのあとで、陸の人間である彼らが、ふだんどんな暮らしをしているかを付け足します。'],
      ['—', 'ダッシュのあとに、「閉じこめられている」様子を tied・nailed・clinched の3つで具体的に言いかえています。'],
    ],
    notes: {
      'of week days pent up in lath and plaster —': 'of week days は「平日には」（時を表す古い of）。pent up は「閉じこめられて」。lath and plaster（木ずりと漆喰）は建物の壁、つまり屋内の仕事場を表します。',
      'tied to counters, nailed to benches, clinched to desks.': 'tied（縛られ）→ nailed（釘づけにされ）→ clinched（留めつけられ）と、仕事場から離れられない様子を強めながら3回くり返しています。',
    },
  }),
  // 18
  ls('[C How] [M then] [V is] [S this]?', {
    ja: 'では、これはどういうことか？',
    chunks: [
      ['How then is this?', 'では、これはどういうことか？'],
    ],
    notes: {
      'How then is this?': 'How is this? は「これはどういうことか」。then は「それなら・では」。',
    },
  }),
  // 19
  ls('[V Are] [S the green fields] [C gone]?', {
    ja: '緑の野は消えてしまったのか？',
    chunks: [
      ['Are the green fields gone?', '緑の野は消えてしまったのか？'],
    ],
    notes: {
      'Are the green fields gone?': 'be gone は「なくなっている・消えてしまった」。gone は形容詞のように補語になっています。',
    },
  }),
  // 20
  ls('[O What] [V do] [S they] [M here]?', {
    ja: '彼らはここで何をしているのか？',
    chunks: [
      ['What do they here?', '彼らはここで何をしているのか？'],
    ],
    notes: {
      'What do they here?': '古い英語の疑問文で、今の What are they doing here? にあたります。do は「する」という意味の動詞で、主語 they の前に出ています。',
    },
  }),
  // 21
  ls('[接 But] [V look]! [M here] [V come] [S more crowds], [M {分詞構文:付帯状況| [V pacing] [M straight {前| for the water}]}], [接 and] [M {分詞構文:付帯状況| [M seemingly] [V bound] [M {前| for a dive}]}].', {
    p: true,
    ja: 'だが見よ！さらに多くの人の群れがやって来る。水のほうへまっすぐ歩き、今にも飛び込もうとしているかのようだ。',
    chunks: [
      ['But look!', 'だが見よ！'],
      ['here come more crowds,', 'ほら、もっと多くの人の群れがやって来る'],
      ['pacing straight for the water,', '水のほうへまっすぐ歩いて'],
      ['and seemingly bound for a dive.', '今にも飛び込もうとしているかのように'],
    ],
    notes: {
      'here come more crowds,': 'here を文の頭に出し、動詞 come を主語 more crowds の前に置いた倒置の文。「ほら、〜がやって来る」と目の前の様子を示します。',
      'pacing straight for the water,': 'pace は「一歩一歩歩く」。for the water は「水のほうへ」。',
      'and seemingly bound for a dive.': 'bound for A は「A へ向かっている」。seemingly は「見たところ」で、「飛び込もうとしているように見える」。',
    },
  }),
  // 22
  ls('[独 Strange]!', {
    fragment: true,
    ja: '不思議なことだ！',
    chunks: [
      ['Strange!', '不思議だ！'],
    ],
    notes: {
      'Strange!': 'It is strange! の It is を省いて、驚きをそのまま声に出した一語の文です。',
    },
  }),
  // 23
  ls('[S Nothing] [V will content] [O them] [M {前| but the extremest limit {前| of the land}}]; [S {動名詞| [V loitering] [M {前| under the shady lee {前| of yonder warehouses}}]}] [V will not suffice].', {
    ja: '陸のいちばん果てでなければ、彼らは満足しない。あそこの倉庫の風下の日陰でぶらぶらするくらいでは足りないのだ。',
    chunks: [
      ['Nothing will content them', '何ものも彼らを満足させない'],
      ['but the extremest limit of the land;', '陸のいちばん果てのほかには'],
      ['loitering under the shady lee of yonder warehouses', 'あそこの倉庫の風下の日陰でぶらぶらすることは'],
      ['will not suffice.', '足りないのだ'],
    ],
    marks: [
      [';', 'セミコロンのあとで、前の文を裏から言い直します。「陸の果てでなければ満足しない」＝「倉庫の日陰でぶらつくくらいでは足りない」。'],
    ],
    notes: {
      'Nothing will content them': 'content は動詞で「満足させる」。Nothing … but A で「A のほかに…するものはない」、つまり「A だけが…する」。',
      'but the extremest limit of the land;': 'この but は前置詞で「〜を除いて」。extremest は extreme の最上級で「いちばん端の」。',
      'loitering under the shady lee of yonder warehouses': 'loitering は動名詞で、この文の主語です。lee は「風下（風の当たらない側）」、yonder は「あそこの」という古い語。',
      'will not suffice.': 'suffice は「足りる・十分である」。',
    },
  }),
  // 24
  ls('[独 No].', {
    fragment: true,
    ja: 'だめなのだ。',
    chunks: [
      ['No.', 'だめなのだ'],
    ],
    notes: {
      'No.': '前の文の「足りない」を、一語で強く言い切っています。答えの No と同じく、文の骨組みの外にある独立語です。',
    },
  }),
  // 25
  ls('[S They] [V must get] [M just as nigh the water {副詞節:比較| [接 as] [S they] [M possibly] [V can]} {前| without {動名詞| [V falling in]}}].', {
    ja: '彼らは、水に落ちないぎりぎりのところまで、できる限り水へ近づかずにはいられないのだ。',
    chunks: [
      ['They must get just as nigh the water', '彼らは水のすぐそばまで行かずにはいられない'],
      ['as they possibly can without falling in.', 'できる限り、落ちないぎりぎりまで'],
    ],
    notes: {
      'They must get just as nigh the water': 'nigh は near の古い言い方で「〜の近くに」。as … as they possibly can で「できる限り…」。must はここでは「どうしても〜せずにはいられない」。',
      'as they possibly can without falling in.': 'without falling in は「落ちることなく」。fall in は「（水に）落ちる」。',
    },
  }),
  // 26
  ls('[接 And] [M there] [S they] [V stand] — [独 miles {前| of them}] — [独 leagues].', {
    ja: 'そして、そこに彼らは立ち並んでいる——何マイルにもわたって——いや、何リーグにもわたって。',
    chunks: [
      ['And there they stand — miles of them — leagues.', 'そしてそこに彼らは立っている——何マイル分も——何リーグ分も'],
    ],
    marks: [
      ['— —', '2つのダッシュで miles of them（何マイル分もの人々）をはさみ、そのあとに leagues（何リーグ分も）を足して、立ち並ぶ人の列の長さを大げさに言い直しています。'],
    ],
    notes: {
      'And there they stand — miles of them — leagues.': 'miles of them は「何マイル分もの彼ら」。league は約3マイル（約4.8km）の昔の長さの単位で、マイルからリーグへ言い直して人の多さを誇張しています。',
    },
  }),
  // 27
  ls('[M Inlanders all], [S they] [V come] [M {前| from {並列| lanes | and alleys}, {並列| streets | and avenues}}] — [M {並列| north, | east, | south, | and west}].', {
    ja: 'みな内陸の人でありながら、彼らは小道や路地から、通りや大通りから——北から、東から、南から、西からやって来る。',
    chunks: [
      ['Inlanders all,', 'みな内陸の人でありながら'],
      ['they come from lanes and alleys, streets and avenues —', '彼らは小道や路地から、通りや大通りからやって来る——'],
      ['north, east, south, and west.', '北から、東から、南から、西から'],
    ],
    marks: [
      ['—', 'ダッシュのあとに north, east, south, and west（北・東・南・西から）を足し、人々があらゆる方角から来ることを言い添えています。'],
    ],
    notes: {
      'Inlanders all,': 'Inlanders all は「みな内陸の人で」。being（〜であって）が省かれた形で、「内陸の人なのに」と文全体にかかります。',
      'they come from lanes and alleys, streets and avenues —': 'lanes and alleys（小道や路地）と streets and avenues（通りや大通り）を2つずつ組にして並べています。',
    },
  }),
  // 28
  ls('[接 Yet] [M here] [S they] [M all] [V unite].', {
    ja: 'それなのに、ここで彼らはみな一つに集まるのだ。',
    chunks: [
      ['Yet here they all unite.', 'それなのにここで彼らはみな一つになる'],
    ],
    notes: {
      'Yet here they all unite.': 'Yet は「それでも・それなのに」。あらゆる方角から来た人々が、水辺の一か所でまとまることを言います。',
    },
  }),
  // 29
  ls('[V Tell] [O me], [V does] [S the magnetic virtue {前| of the needles} {前| of the compasses} {前| of all those ships}] [V attract] [O them] [M thither]?', {
    ja: '教えてくれ。あの船という船の羅針盤の針が持つ磁力が、彼らをあそこへ引き寄せるのだろうか？',
    chunks: [
      ['Tell me,', '教えてくれ'],
      ['does the magnetic virtue of the needles', '針の持つ磁力が'],
      ['of the compasses of all those ships', 'あのすべての船の羅針盤の'],
      ['attract them thither?', '彼らをそこへ引き寄せるのか？'],
    ],
    notes: {
      'does the magnetic virtue of the needles': 'virtue はここでは「力・効き目」。of が3回重なり、磁力の持ち主を「針 → 羅針盤 → あの船々」とたどります。',
      'attract them thither?': 'thither は「そこへ」の古い言い方（今の there）。',
    },
  }),
  // 30
  ls('[M Once more].', {
    p: true,
    fragment: true,
    ja: 'もう一つ話そう。',
    chunks: [
      ['Once more.', 'もう一度'],
    ],
    notes: {
      'Once more.': '「もう一度（例を挙げよう）」。動詞を省いた短い文で、話題を変えて例を重ねる合図です。',
    },
  }),
  // 31
  ls('[V Say] [O {that省略| [S you] [V are] [M {前| in the country}]; [M {前| in some high land {前| of lakes}}]}].', {
    ja: 'たとえば、あなたが田舎に、どこか湖の多い高地にいるとしよう。',
    chunks: [
      ['Say you are in the country;', 'たとえばあなたが田舎にいるとしよう'],
      ['in some high land of lakes.', 'どこか湖の多い高地に'],
    ],
    marks: [
      [';', 'セミコロンのあとで、in the country（田舎に）を in some high land of lakes（湖の多い高地に）と具体的に言い直しています。'],
    ],
    notes: {
      'Say you are in the country;': 'Say は命令文の形で「たとえば〜としよう」。',
    },
  }),
  // 32
  ls('[V Take] [O almost any path {関係省略:目的格>almost any path| [S you] [V please]}], [接 and] [M {成句| ten to one}] [S it] [V carries] [O you] [M down] [M {前| in a dale}], [接 and] [V leaves] [O you] [M there] [M {前| by a pool {前| in the stream}}].', {
    ja: 'ほとんどどんな道でも好きな道をたどってみよ。十中八九、その道は人を谷へと下らせ、小川のよどみのほとりに置いていく。',
    chunks: [
      ['Take almost any path you please,', 'ほとんどどんな道でも好きな道を行ってみよ'],
      ['and ten to one it carries you down in a dale,', 'すると十中八九、その道は人を谷へと下らせ'],
      ['and leaves you there by a pool in the stream.', 'そこの小川のよどみのほとりに置いていく'],
    ],
    unitNotes: {
      'ten to one': '「十中八九・きっと」。10対1の賭けの割合から来た決まった言い方です。',
    },
    notes: {
      'Take almost any path you please,': 'please はここでは「好む・望む」で、any path you please は「好きなどの道でも」。命令文＋and で「〜すれば、…」と続きます。',
      'and ten to one it carries you down in a dale,': 'dale は「谷」の詩的な言い方。it は path（道）を指します。',
      'and leaves you there by a pool in the stream.': 'leave A there で「A をそこに置いていく」。pool はここでは「（川の）よどみ・ふち」。',
    },
  }),
  // 33
  ls('[M There] [V is] [S magic] [M {前| in it}].', {
    ja: 'そこには魔法のような力がある。',
    chunks: [
      ['There is magic in it.', 'そこには魔法のような力がある'],
    ],
    notes: {
      'There is magic in it.': 'it は前の文の「どの道も水辺へ導くこと」を指します。magic は「魔法・不思議な力」。',
    },
  }),
  // 34
  ls('[V Let] [O the most absent-minded {前| of men}] [C {原形| [V be plunged] [M {前| in his deepest reveries}]}] — [V stand] [O that man] [M {前| on his legs}], [V set] [O his feet] [C a-going], [接 and] [S he] [V will] [M infallibly] [V lead] [O you] [M {前| to water}], [M {副詞節:条件| [接 if] [S water] [M there] [V be] [M {前| in all that region}]}].', {
    ja: 'この世でいちばんぼんやりした人を、深い深い物思いに沈ませておくがいい——その人を立たせ、足を動かしてやれば、その一帯のどこかに水がある限り、その人は間違いなくあなたを水辺へ導くだろう。',
    chunks: [
      ['Let the most absent-minded of men be plunged', 'どんなにぼんやりした人でもいい、沈ませておけ'],
      ['in his deepest reveries —', 'いちばん深い物思いの中に——'],
      ['stand that man on his legs,', 'その人を立たせ'],
      ['set his feet a-going,', '足を動かしてやれ'],
      ['and he will infallibly lead you to water,', 'そうすればその人は間違いなくあなたを水辺へ導くだろう'],
      ['if water there be in all that region.', 'もしその一帯のどこかに水があるならば'],
    ],
    marks: [
      ['—', 'ダッシュの前は「どんなにぼんやりした人でも物思いに沈ませておけ」という場面の設定、後ろは「立たせて歩かせれば、必ず水辺へ連れて行く」という結果です。設定から結果へ、話を一気に進めます。'],
    ],
    notes: {
      'Let the most absent-minded of men be plunged': 'let＋人＋原形で「〜させておく」。the most absent-minded of men は「人の中でいちばんぼんやりした者」。',
      'stand that man on his legs,': 'stand はここでは「立たせる」という意味の他動詞。命令文を並べ、最後の and で「そうすれば〜」と結果を続けます。',
      'set his feet a-going,': 'set A going で「A を動かし始める」。a-going は going の古い形です。',
      'and he will infallibly lead you to water,': 'infallibly は「間違いなく・必ず」。',
      'if water there be in all that region.': 'if there be water の古い語順で、be は仮定法の形「もし〜があるなら」。',
    },
  }),
  // 35
  ls('[M {副詞節:条件| [V Should] [S you] [M ever] [V be] [C athirst] [M {前| in the great American desert}]}], [V try] [O this experiment], [M {副詞節:条件| [接 if] [S your caravan] [V happen] [C {to:補語| [V to be supplied] [M {前| with a metaphysical professor}]}]}].', {
    ja: 'もしも広大なアメリカの砂漠で喉が渇くことがあったら、この実験を試してみるといい。隊商にたまたま形而上学の教授が一人加わっていればの話だが。',
    chunks: [
      ['Should you ever be athirst in the great American desert,', 'もしも広大なアメリカの砂漠で喉が渇いたら'],
      ['try this experiment,', 'この実験を試してみよ'],
      ['if your caravan happen to be supplied with a metaphysical professor.', 'もし隊商にたまたま形而上学の教授が加わっているならだが'],
    ],
    notes: {
      'Should you ever be athirst in the great American desert,': 'athirst は「喉が渇いて」の古い言い方。should は「万一〜なら」と、起こりそうにないことを仮定します。',
      'if your caravan happen to be supplied with a metaphysical professor.': 'happen は仮定法（-s が付かない形）で、happen to do は「たまたま〜する」。形而上学の教授は、いつも物思いにふける人の代表として冗談めかして出しています。',
    },
  }),
  // 36
  ls('[独 Yes], [M {副詞節:様態| [接 as] [S every one] [V knows]}], [S {並列| meditation | and water}] [V are wedded] [M {前| for ever}].', {
    ja: 'そうだ、誰もが知っているように、瞑想と水とは永遠に結ばれているのだ。',
    chunks: [
      ['Yes, as every one knows,', 'そうだ、誰もが知っているように'],
      ['meditation and water are wedded for ever.', '瞑想と水とは永遠に結ばれているのだ'],
    ],
    notes: {
      'Yes, as every one knows,': 'as every one knows は「誰もが知っているように」。as は「〜するように」という接続詞です。',
      'meditation and water are wedded for ever.': 'be wedded は「結婚している・固く結びついている」。物思い（瞑想）と水が切り離せないことを、夫婦にたとえています。',
    },
  }),
  // 37
  ls('[接 But] [M here] [V is] [S an artist].', {
    p: true,
    ja: 'だが、ここに一人の画家がいる。',
    chunks: [
      ['But here is an artist.', 'だがここに一人の画家がいる'],
    ],
    notes: {
      'But here is an artist.': 'artist はここでは「画家」。here is A で「ここに A がいる」と、例として人物を登場させます。',
    },
  }),
  // 38
  ls('[S He] [V desires] [O {to:名詞| [V to paint] [O1 you] [O2 the dreamiest, shadiest, quietest, most enchanting bit {前| of romantic landscape} {前| in all the valley {前| of the Saco}}]}].', {
    ja: '彼は、サコ川の谷じゅうでいちばん夢のようで、いちばん木陰が深く、いちばん静かで、いちばん心を奪う、ロマンチックな風景の一角をあなたに描いてみせたいと思っている。',
    chunks: [
      ['He desires to paint you', '彼はあなたに描いてみせたいと思っている（何をかは次へ）'],
      ['the dreamiest, shadiest, quietest, most enchanting bit', 'いちばん夢のようで、木陰が深く、静かで、心を奪う一角を'],
      ['of romantic landscape in all the valley of the Saco.', 'サコ川の谷じゅうのロマンチックな風景の中で'],
    ],
    notes: {
      'He desires to paint you': 'paint＋人＋もので「人にものを描いてみせる」。you は間接目的語です。',
      'the dreamiest, shadiest, quietest, most enchanting bit': '最上級（dreamiest・shadiest・quietest・most enchanting）を4つ重ねて、風景の美しさを強めています。bit は「一部分・一角」。',
      'of romantic landscape in all the valley of the Saco.': 'the Saco は、アメリカ北東部を流れるサコ川です。',
    },
  }),
  // 39
  ls('[C What] [V is] [S the chief element {関係省略:目的格>the chief element| [S he] [V employs]}]?', {
    ja: '彼が使ういちばん大事な材料は何だろう？',
    chunks: [
      ['What is the chief element he employs?', '彼が使ういちばん大事な材料は何だろう？'],
    ],
    notes: {
      'What is the chief element he employs?': 'element は「要素・材料」、employ はここでは「（絵の材料として）用いる」。',
    },
  }),
  // 40
  ls('[M There] [V stand] [S his trees, {同格>his trees| each {前| with a hollow trunk}}], [M {副詞節:様態| [接 as if] [S {並列| a hermit | and a crucifix}] [V were] [M within]}]; [接 and] [M here] [V sleeps] [S his meadow], [接 and] [M there] [V sleep] [S his cattle]; [接 and] [M up] [M {前| from yonder cottage}] [V goes] [S a sleepy smoke].', {
    ja: 'そこには彼の木々が立ち、どの木の幹にも、中に隠者と十字架があるかのような洞がある。ここには彼の牧場が眠り、あそこには彼の牛たちが眠っている。そして向こうの小屋からは、眠たげな煙が立ちのぼっている。',
    chunks: [
      ['There stand his trees, each with a hollow trunk,', 'そこに彼の木々が立っている、どれも幹に洞があり'],
      ['as if a hermit and a crucifix were within;', 'まるで中に隠者と十字架があるかのようだ'],
      ['and here sleeps his meadow, and there sleep his cattle;', 'ここには彼の牧場が眠り、あそこには彼の牛たちが眠る'],
      ['and up from yonder cottage goes a sleepy smoke.', 'そして向こうの小屋からは、眠たげな煙が立ちのぼる'],
    ],
    marks: [
      [';', 'セミコロンが、木々の描写と、牧場・牛の描写を区切ります。絵の中の物を、区切りながら一つずつ見せていきます。'],
      [';', 'セミコロンのあとで、最後の描写（小屋から立ちのぼる煙）を加えます。and を重ねて、絵の中を見回すように続けています。'],
    ],
    notes: {
      'There stand his trees, each with a hollow trunk,': 'There stand his trees は、動詞 stand が主語 his trees の前に出た倒置の文。each with a hollow trunk は「どれも幹に洞があって」と、his trees を言いかえて説明します。',
      'as if a hermit and a crucifix were within;': 'as if の後ろの were は仮定法で「まるで〜であるかのように」。hermit は「隠者（人里を離れて暮らす修行者）」、crucifix は「十字架」。',
      'and here sleeps his meadow, and there sleep his cattle;': 'here sleeps his meadow・there sleep his cattle も、動詞が主語の前に出た倒置。単数の meadow には sleeps、複数の cattle には sleep と、動詞の形が主語に合っています。',
      'and up from yonder cottage goes a sleepy smoke.': 'up from yonder cottage を前に出し、goes を主語 a sleepy smoke の前に置いた倒置。yonder は「あそこの」。',
    },
  }),
  // 41
  ls('[M Deep {前| into distant woodlands}] [V winds] [S a mazy way], [M {分詞構文:付帯状況| [V reaching] [M {前| to overlapping spurs {前| of mountains} {過去分詞>mountains| [V bathed] [M {前| in their hill-side blue}]}}]}].', {
    ja: '遠くの森の奥深くへと、迷路のような道がくねくねと続き、山肌の青に染まった山々の、重なり合う尾根まで延びている。',
    chunks: [
      ['Deep into distant woodlands winds a mazy way,', '遠くの森の奥深くへ、迷路のような道がくねくねと続き'],
      ['reaching to overlapping spurs of mountains', '山々の重なり合う尾根まで届いている'],
      ['bathed in their hill-side blue.', '山肌の青に染まった'],
    ],
    notes: {
      'Deep into distant woodlands winds a mazy way,': '場所を表す Deep into distant woodlands を文の頭に出し、動詞 winds（くねくね進む）を主語 a mazy way の前に置いた倒置。mazy は「迷路のような」。',
      'reaching to overlapping spurs of mountains': 'spur は「（山の）尾根の張り出し」。reaching 以下は、道がどこまで続くかを付け足す分詞構文です。',
      'bathed in their hill-side blue.': 'bathed in A は「A に浸された・A に包まれた」。遠くの山肌が青く見える様子です。',
    },
  }),
  // 42
  ls('[接 But] [M {副詞節:譲歩| [接 though] [S the picture] [V lies] [C thus tranced]}], [接 and] [M {副詞節:譲歩| [接 though] [S this pine-tree] [V shakes down] [O its sighs] [M {前| like leaves}] [M {前| upon this shepherd’s head}]}], [M yet] [S all] [V were] [C vain], [M {副詞節:条件| [接 unless] [S the shepherd’s eye] [V were fixed] [M {前| upon the magic stream {前| before him}}]}].', {
    ja: 'だが、この絵がそうして夢見心地に横たわり、この松の木が羊飼いの頭上にため息を木の葉のように振り落としていても、羊飼いの目が目の前の不思議な流れに注がれていなければ、すべてはむだになるだろう。',
    chunks: [
      ['But though the picture lies thus tranced,', 'だが、絵がそうして夢見心地に横たわっていても'],
      ['and though this pine-tree shakes down its sighs like leaves', 'この松の木がため息を木の葉のように振り落としても'],
      ['upon this shepherd’s head, yet all were vain,', 'この羊飼いの頭の上に、それでもすべてはむだだろう'],
      ['unless the shepherd’s eye were fixed upon the magic stream before him.', 'もし羊飼いの目が目の前の不思議な流れに注がれていなければ'],
    ],
    notes: {
      'But though the picture lies thus tranced,': 'though は「〜だけれども」。tranced は「うっとりと夢見心地の」。',
      'and though this pine-tree shakes down its sighs like leaves': '松の木の風の音を「ため息」にたとえ、それが木の葉のように降るという詩的な表現です。',
      'upon this shepherd’s head, yet all were vain,': 'yet は though と組んで「それでも」。were は仮定法で、「〜だろう」と今の事実に反することを想像しています。vain は「むだな」。',
      'unless the shepherd’s eye were fixed upon the magic stream before him.': 'unless は「〜しない限り」。before him は「彼の目の前に」。絵の主役は結局「水」だという答えです。',
    },
  }),
  // 43
  ls('[V Go visit] [O the Prairies] [M {前| in June}], [M {関係,>June| [M when] [M {前| for scores {前| on scores} {前| of miles}}] [S you] [V wade] [M knee-deep] [M {前| among Tiger-lilies}]}] — [C what] [V is] [S the one charm {現在分詞>the one charm| [V wanting]}]? — [独 Water] — [M there] [V is not] [S a drop {前| of water}] [M there]!', {
    ja: '六月に大草原へ行ってみよ。何十マイル、何百マイルと、オニユリの中を膝まで分け入って進むとき——足りないただ一つの魅力は何だろう？——水だ——そこには水が一滴もないのだ！',
    chunks: [
      ['Go visit the Prairies in June,', '六月に大草原へ行ってみよ'],
      ['when for scores on scores of miles', 'そのとき何十マイル、何百マイルにもわたって'],
      ['you wade knee-deep among Tiger-lilies —', 'オニユリの中を膝まで分け入って進む——'],
      ['what is the one charm wanting?', '欠けているただ一つの魅力は何か？'],
      ['— Water — there is not a drop of water there!', '——水だ——そこには水が一滴もない！'],
    ],
    marks: [
      ['—', '1つ目のダッシュで情景の描写を打ち切り、読者への問い what is the one charm wanting? を差し込みます。'],
      ['—', '2つ目のダッシュのあとに、問いの答え Water を一語で置きます。'],
      ['—', '3つ目のダッシュのあとで、答えの理由 there is not a drop of water there! を続けます。ダッシュで区切ることで、問い→答え→理由を間を置いて見せています。'],
    ],
    notes: {
      'Go visit the Prairies in June,': 'Go visit は Go and visit と同じで「行って訪ねてみよ」。the Prairies は北アメリカの大草原です。',
      'when for scores on scores of miles': 'when は June を受ける関係副詞で「その六月には」。score は「20」で、scores on scores of miles は「何十マイルも何十マイルも」。',
      'you wade knee-deep among Tiger-lilies —': 'wade は「（水や草の中を）かき分けて歩く」。knee-deep は「膝まで浸かって」。',
      'what is the one charm wanting?': 'wanting は「欠けている」で、後ろから the one charm（ただ一つの魅力）を説明します。',
    },
  }),
  // 44
  ls('[M {副詞節:条件| [V Were] [S Niagara] [M but] [C a cataract {前| of sand}]}], [V would] [S you] [V travel] [O your thousand miles] [M {to:副詞(目的)| [V to see] [O it]}]?', {
    ja: 'もしナイアガラの滝がただの砂の滝だったら、あなたはそれを見るために、わざわざ千マイルも旅をするだろうか？',
    chunks: [
      ['Were Niagara but a cataract of sand,', 'もしナイアガラがただの砂の滝にすぎなかったら'],
      ['would you travel your thousand miles to see it?', 'あなたはそれを見るために千マイルも旅をするだろうか？'],
    ],
    notes: {
      'Were Niagara but a cataract of sand,': 'but はここでは「ただ〜にすぎない」（only）。cataract は「大きな滝」。',
      'would you travel your thousand miles to see it?': 'would は仮定法で「〜するだろうか」。your thousand miles の your は「あなたがわざわざ行く」という気持ちを込めた言い方です。',
    },
  }),
  // 45
  ls('[M Why] [V did] [S the poor poet {前| of Tennessee}], [M {前| upon {動名詞| [M suddenly] [V receiving] [O two handfuls {前| of silver}]}}], [V deliberate] [O {疑問詞to| [接 whether] [V to buy] [O1 him] [O2 a coat, {関係,>a coat| [O which] [S he] [M sadly] [V needed]}], [接 or] [V invest] [O his money] [M {前| in a pedestrian trip {前| to Rockaway Beach}}]}]?', {
    ja: 'テネシーの貧しい詩人は、思いがけず銀貨をふたつかみ手にしたとき、どうしても必要だった上着を買おうか、それともそのお金をロッカウェイ・ビーチへの徒歩旅行につぎこもうかと、なぜ思い迷ったのだろう？',
    chunks: [
      ['Why did the poor poet of Tennessee,', 'なぜテネシーの貧しい詩人は'],
      ['upon suddenly receiving two handfuls of silver,', '思いがけず銀貨をふたつかみ手にしたとき'],
      ['deliberate whether to buy him a coat,', '上着を買おうかと思い迷ったのか'],
      ['which he sadly needed,', 'その上着が彼にはどうしても必要だったのに'],
      ['or invest his money in a pedestrian trip to Rockaway Beach?', 'それともお金をロッカウェイ・ビーチへの徒歩旅行につぎこもうかと'],
    ],
    notes: {
      'upon suddenly receiving two handfuls of silver,': 'upon doing で「〜するとすぐに・〜したとき」。silver は「銀貨」。',
      'deliberate whether to buy him a coat,': 'deliberate は動詞で「よく考える・迷う」。whether to A or B で「A すべきか B すべきか」。buy him a coat の him は「自分に」（今なら himself）。',
      'which he sadly needed,': 'sadly はここでは「ひどく・とても」。',
      'or invest his money in a pedestrian trip to Rockaway Beach?': 'invest A in B で「A を B につぎこむ」。pedestrian trip は「徒歩旅行」。Rockaway Beach はニューヨークの海辺です。',
    },
  }),
  // 46
  ls('[M Why] [V is] [S almost every robust healthy boy {前| with a robust healthy soul {前| in him}}], [M {前| at {成句| some time or other}}] [C crazy {to:副詞(形容詞)| [V to go] [M {前| to sea}]}]?', {
    ja: '元気で健康な魂を内に持った、元気で健康な少年なら、ほとんど誰もが、いつかは海へ出たくてたまらなくなるのはなぜだろう？',
    chunks: [
      ['Why is almost every robust healthy boy', 'なぜ、ほとんどどの元気で健康な少年も'],
      ['with a robust healthy soul in him,', '元気で健康な魂を内に持った'],
      ['at some time or other crazy to go to sea?', 'いつかは海へ出たくてたまらなくなるのか？'],
    ],
    unitNotes: {
      'some time or other': '「いつか・そのうち」という決まった言い方です。',
    },
    notes: {
      'Why is almost every robust healthy boy': 'robust healthy（たくましく健康な）を boy と soul にくり返し使い、調子をそろえています。',
      'at some time or other crazy to go to sea?': 'be crazy to do で「〜したくてたまらない」。',
    },
  }),
  // 47
  ls('[M Why] [M {前| upon your first voyage {前| as a passenger}}], [V did] [S you yourself] [V feel] [O such a mystical vibration], [M {副詞節:時| [接 when] [M first] [V told] [O {that節| [接 that] [S {並列| you | and your ship}] [V were] [M now] [M {前| out of sight {前| of land}}]}]}]?', {
    ja: '乗客として初めて航海に出たとき、あなたとあなたの船がもう陸の見えない所にいると初めて告げられて、あなた自身もあれほど神秘的な震えを感じたのはなぜだろう？',
    chunks: [
      ['Why upon your first voyage as a passenger,', 'なぜ、乗客として初めて航海に出たとき'],
      ['did you yourself feel such a mystical vibration,', 'あなた自身もあれほど神秘的な震えを感じたのか'],
      ['when first told', '初めて告げられたとき（何をかは次へ）'],
      ['that you and your ship were now out of sight of land?', 'あなたとあなたの船がもう陸の見えない所にいると'],
    ],
    notes: {
      'did you yourself feel such a mystical vibration,': 'yourself は you を強めて「あなた自身も」。vibration はここでは「（心の）震え」。',
      'when first told': 'when (you were) first told の you were が省かれた形で、「初めて告げられたとき」。',
    },
  }),
  // 48
  ls('[M Why] [V did] [S the old Persians] [V hold] [O the sea] [C holy]?', {
    ja: '古代ペルシャの人々は、なぜ海を神聖なものとみなしたのだろう？',
    chunks: [
      ['Why did the old Persians hold the sea holy?', 'なぜ古代ペルシャの人々は海を神聖なものとみなしたのか？'],
    ],
    notes: {
      'Why did the old Persians hold the sea holy?': 'hold A B で「A を B だとみなす」。holy は「神聖な」。',
    },
  }),
  // 49
  ls('[M Why] [V did] [S the Greeks] [V give] [O1 it] [O2 {並列| a separate deity, | and own brother {前| of Jove}}]?', {
    ja: 'ギリシャ人は、なぜ海に専用の神を、しかもジョーヴの実の兄弟を与えたのだろう？',
    chunks: [
      ['Why did the Greeks give it a separate deity,', 'なぜギリシャ人は海に専用の神を与えたのか'],
      ['and own brother of Jove?', 'しかもジョーヴの実の兄弟を'],
    ],
    notes: {
      'Why did the Greeks give it a separate deity,': 'give A B で「A に B を与える」。it は前の文の the sea、deity は「神」。',
      'and own brother of Jove?': 'own brother は「実の兄弟」。Jove はローマ神話の最高神ユピテル（ギリシャ神話のゼウス）の英語名で、その兄弟が海の神ポセイドンです。',
    },
  }),
  // 50
  ls('[M Surely] [S all this] [V is not] [C {前| without meaning}].', {
    ja: 'きっと、こうしたことのすべてに意味がないはずはない。',
    chunks: [
      ['Surely all this is not without meaning.', 'きっと、こうしたことすべてに意味がないわけではない'],
    ],
    notes: {
      'Surely all this is not without meaning.': 'not without A は「A がないわけではない」、つまり「A がある」。否定を2つ重ねて、控えめに強く言っています。',
    },
  }),
  // 51
  ls('[接 And] [C still deeper] [S the meaning {前| of that story {前| of Narcissus}}, {関係,>Narcissus| [S who] [M {副詞節:理由| [接 because] [S he] [V could not grasp] [O the tormenting, mild image {関係省略:目的格>the tormenting, mild image| [S he] [V saw] [M {前| in the fountain}]}]}], [V plunged] [M {前| into it}] [接 and] [V was drowned]}].', {
    fragment: true,
    ja: 'そして、さらに深いのは、あのナルキッソスの物語の意味だ。泉に映った、心を苦しめる穏やかな姿をつかめなかったナルキッソスは、その中へ飛び込んでおぼれてしまったのだ。',
    chunks: [
      ['And still deeper the meaning of that story of Narcissus,', 'そしてさらに深いのは、あのナルキッソスの物語の意味だ'],
      ['who because he could not grasp', 'ナルキッソスは、つかめなかったので'],
      ['the tormenting, mild image he saw in the fountain,', '泉の中に見た、心を苦しめる穏やかな姿を'],
      ['plunged into it and was drowned.', 'その中へ飛び込み、おぼれてしまった'],
    ],
    notes: {
      'And still deeper the meaning of that story of Narcissus,': 'the meaning … is still deeper の is が省かれ、比較級 still deeper（さらに深い）が前に出ています。ナルキッソスはギリシャ神話の美少年で、水に映った自分の姿に恋をしました。',
      'who because he could not grasp': 'who は Narcissus を受ける関係代名詞で、節の動詞は plunged と was drowned。間に because 以下の理由の節がはさまっています。',
      'the tormenting, mild image he saw in the fountain,': 'tormenting は「心を苦しめる」、mild は「穏やかな」。fountain はここでは「泉」。',
    },
  }),
  // 52
  ls('[接 But] [O that same image], [S we ourselves] [V see] [M {前| in {並列| all rivers | and oceans}}].', {
    ja: 'だが、それと同じ姿を、私たち自身もあらゆる川や海の中に見ているのだ。',
    chunks: [
      ['But that same image, we ourselves see in all rivers and oceans.', 'だがその同じ姿を、私たち自身もあらゆる川や海に見る'],
    ],
    notes: {
      'But that same image, we ourselves see in all rivers and oceans.': '目的語 that same image を文の頭に出して強めています。ourselves は we を強めて「私たち自身も」。',
    },
  }),
  // 53
  ls('[S It] [V is] [C the image {前| of the ungraspable phantom {前| of life}}]; [接 and] [S this] [V is] [C the key {前| to it all}].', {
    ja: 'それは、つかむことのできない生の幻の姿なのだ。そしてこれこそが、すべてを解く鍵である。',
    chunks: [
      ['It is the image of the ungraspable phantom of life;', 'それは、つかむことのできない生の幻の姿だ'],
      ['and this is the key to it all.', 'そしてこれが、すべてを解く鍵なのだ'],
    ],
    marks: [
      [';', 'セミコロンのあとで、前の文の「つかめない生の幻」こそが、すべてを解く鍵だと結論づけます。and と組んで、前の文を受けて締めくくる区切りです。'],
    ],
    notes: {
      'It is the image of the ungraspable phantom of life;': 'ungraspable は「つかむことができない」、phantom は「幻・幽霊」。',
      'and this is the key to it all.': 'the key to A で「A を解く鍵」。it all は「そのすべて」。',
    },
  }),
  // 54
  ls('[M Now], [M {副詞節:時| [接 when] [S I] [V say] [O {that節| [接 that] [S I] [V am] [C {前| in the habit {前| of {動名詞| [V going] [M {前| to sea}] [M {副詞節:時| [接 whenever] [S I] [V begin] [O {to:名詞| [V to grow] [C hazy {前| about the eyes}]}], [接 and] [V begin] [O {to:名詞| [V to be] [M over] [C conscious {前| of my lungs}]}]}]}}}]}]}], [S I] [V do not mean] [O {to:名詞| [V to have] [仮O it] [C inferred] [真O {that節| [接 that] [S I] [M ever] [V go] [M {前| to sea}] [M {前| as a passenger}]}]}].', {
    p: true,
    ja: 'さて、目のあたりがかすみ始め、自分の肺が気になりすぎるようになるたびに海へ出る習慣がある、と私が言っても、乗客として海へ出るのだと受け取ってもらっては困る。',
    chunks: [
      ['Now, when I say', 'さて、私が言うとき（何をかは次へ）'],
      ['that I am in the habit of going to sea', '私には海へ出る習慣があると'],
      ['whenever I begin to grow hazy about the eyes,', '目のあたりがかすみ始めるたびに'],
      ['and begin to be over conscious of my lungs,', 'そして自分の肺が気になりすぎ始めるたびに'],
      ['I do not mean to have it inferred', '私は、推し量られるつもりはない（何をかは次へ）'],
      ['that I ever go to sea as a passenger.', '自分が乗客として海へ出るのだと'],
    ],
    notes: {
      'Now, when I say': 'Now は「さて」と話を切りかえる語です。',
      'that I am in the habit of going to sea': 'be in the habit of doing で「〜する習慣がある」。',
      'whenever I begin to grow hazy about the eyes,': 'grow hazy は「かすむ」。目のかすみや肺の不調は、第1段落の「憂うつ」と同じく、心や体の不調の言いかえです。',
      'I do not mean to have it inferred': 'have it inferred that … は「…だと推し量られるようにする」。it は形式目的語で、中身は that 以下です。do not mean to do は「〜するつもりはない」。',
    },
  }),
  // 55
  ls('[接 For] [M {to:副詞(目的)| [V to go] [M {前| as a passenger}]}] [S you] [V must] [M needs] [V have] [O a purse], [接 and] [S a purse] [V is] [M but] [C a rag] [M {副詞節:条件| [接 unless] [S you] [V have] [O something] [M {前| in it}]}].', {
    ja: 'というのも、乗客として行くには、どうしても財布がなければならないが、財布など、中に何か入っていなければただのぼろ切れにすぎないからだ。',
    chunks: [
      ['For to go as a passenger', 'というのも、乗客として行くには'],
      ['you must needs have a purse,', 'どうしても財布を持っていなければならず'],
      ['and a purse is but a rag', 'そして財布はただのぼろ切れにすぎない'],
      ['unless you have something in it.', '中に何か入っていなければ'],
    ],
    notes: {
      'For to go as a passenger': 'to go as a passenger は「乗客として行くには」と目的を表す不定詞で、文の頭に出ています。',
      'you must needs have a purse,': 'must needs は「どうしても〜しなければならない」という古い言い方。needs は「必ず」という副詞です。',
      'and a purse is but a rag': 'but はここでは「ただ〜にすぎない」（only）。',
    },
  }),
  // 56
  ls('[M Besides], [S passengers] [V get] [C sea-sick] — [V grow] [C quarrelsome] — [V don’t sleep] [M {前| of nights}] — [V do not enjoy] [O themselves] [M much], [M {前| as a general thing}]; — [独 no], [S I] [M never] [V go] [M {前| as a passenger}]; [接 nor], [M {副詞節:譲歩| [接 though] [S I] [V am] [C something {前| of a salt}]}], [V do] [S I] [M ever] [V go] [M {前| to sea}] [M {前| as {並列| a Commodore, | or a Captain, | or a Cook}}].', {
    ja: 'それに、乗客は船酔いするし——けんか腰になるし——夜は眠れないし——たいていはあまり楽しめない。——そう、私は決して乗客としては行かない。また、少しは船乗りの心得があるとはいえ、提督としても、船長としても、コックとしても、海へ出ることは決してない。',
    chunks: [
      ['Besides, passengers get sea-sick —', 'それに、乗客は船酔いするし——'],
      ['grow quarrelsome —', 'けんか腰になるし——'],
      ['don’t sleep of nights —', '夜は眠れないし——'],
      ['do not enjoy themselves much, as a general thing; —', 'たいていはあまり楽しめない——'],
      ['no, I never go as a passenger;', 'そう、私は決して乗客としては行かない'],
      ['nor, though I am something of a salt,', 'また、少しは船乗りの心得があるとはいえ'],
      ['do I ever go to sea as a Commodore,', '提督として海へ出ることも決してない'],
      ['or a Captain, or a Cook.', '船長としても、コックとしても'],
    ],
    marks: [
      ['—', 'ダッシュで区切りながら、乗客の困ったところを get sea-sick（船酔いする）から次々に並べていきます。'],
      ['—', '2つ目のダッシュ。grow quarrelsome（けんか腰になる）に続けて、さらに困ったところを足します。'],
      ['—', '3つ目のダッシュ。接続詞を使わずにダッシュで並べ、思いつくまま一気に言い立てる調子を出しています。'],
      [';', 'セミコロンで、乗客の困ったところの並びを締めくくります。'],
      ['—', 'セミコロンのすぐあとのダッシュで間を置き、「私は決して乗客としては行かない」という結論へ話を切りかえます。'],
      [';', 'セミコロンのあとで nor（〜もまた…ない）を続け、乗客としてだけでなく、提督・船長・コックとしても行かないと付け足します。'],
    ],
    notes: {
      'don’t sleep of nights —': 'of nights は「夜に」という古い言い方（時を表す of）。',
      'do not enjoy themselves much, as a general thing; —': 'enjoy oneself は「楽しむ」。as a general thing は「たいていは」。',
      'nor, though I am something of a salt,': 'nor のあとは do I ever go … と疑問文と同じ語順になります。something of A は「ちょっとした A」、salt はここでは「船乗り」の意味です。',
      'do I ever go to sea as a Commodore,': 'Commodore は艦隊を率いる「提督」。',
    },
  }),
  // 57
  ls('[S I] [V abandon] [O the {並列| glory | and distinction} {前| of such offices}] [M {前| to those {関係>those| [S who] [V like] [O them]}}].', {
    ja: 'そういう役職の栄誉や名声は、それを好む人たちにお譲りする。',
    chunks: [
      ['I abandon the glory and distinction of such offices', '私はそうした役職の栄誉や名声を手放す'],
      ['to those who like them.', 'それを好む人たちに'],
    ],
    notes: {
      'I abandon the glory and distinction of such offices': 'abandon A to B で「A を B にゆだねる・譲る」。offices はここでは「役職」、distinction は「名声・栄誉」。',
    },
  }),
  // 58
  ls('[M {前| For my part}], [S I] [V abominate] [O all honorable respectable {並列| toils, | trials, | and tribulations} {前| of every kind whatsoever}].', {
    ja: '私はといえば、名誉ある立派な苦労や試練や難儀なら、どんな種類のものでも大嫌いだ。',
    chunks: [
      ['For my part, I abominate all honorable respectable toils,', '私はといえば、名誉ある立派な苦労も'],
      ['trials, and tribulations of every kind whatsoever.', '試練も難儀も、どんな種類のものでも大嫌いだ'],
    ],
    notes: {
      'For my part, I abominate all honorable respectable toils,': 'for my part は「私としては」。abominate は「ひどく嫌う」。',
      'trials, and tribulations of every kind whatsoever.': 'toils, trials, and tribulations は、頭の音をそろえた言い方で「苦労、試練、難儀」。whatsoever は every kind を強めて「どんなものでも」。',
    },
  }),
  // 59
  ls('[仮S It] [V is] [C quite as much {副詞節:比較| [接 as] [S I] [V can do]}] [真S {to:名詞| [V to take care of] [O myself], [M {前| without {動名詞| [V taking care of] [O {並列| ships, | barques, | brigs, | schooners, | and what not}]}}]}].', {
    ja: '自分の面倒を見るだけで精いっぱいで、船だの、バーク船だの、ブリッグ船だの、スクーナー船だのの面倒まで見てはいられない。',
    chunks: [
      ['It is quite as much as I can do', '私にできるのはせいぜいのところ'],
      ['to take care of myself, without taking care of ships,', '自分の面倒を見ることで、船の面倒までは見られない'],
      ['barques, brigs, schooners, and what not.', 'バーク船、ブリッグ船、スクーナー船、そのほか何でも'],
    ],
    notes: {
      'It is quite as much as I can do': 'It is as much as I can do to do で「〜するのが精いっぱいだ」。It は形式主語で、中身は to take care of myself です。',
      'barques, brigs, schooners, and what not.': 'barque・brig・schooner は帆船の種類。and what not は「〜など」。',
    },
  }),
  // 60
  ls('[接 And] [M {前| as for {動名詞| [V going] [M {前| as cook}]}}], — [M {副詞節:譲歩| [接 though] [S I] [V confess] [O {that省略| [M there] [V is] [S considerable glory] [M {前| in that}]}], [M {分詞構文:理由| [S a cook] [V being] [C a sort {前| of officer} {前| on ship-board}]}]}] — [M yet], [M somehow], [S I] [M never] [V fancied] [O {動名詞| [V broiling] [O fowls]}]; — [M {副詞節:譲歩| [接 though] [M once] [V {並列| broiled, | judiciously buttered, | and judgmatically {並列| salted | and peppered}}]}], [M there] [V is] [S no one {関係>no one| [S who] [V will speak] [M more respectfully], [M {成句| not to say} reverentially], [M {前| of a broiled fowl}] [M {副詞節:比較| [接 than] [S I] [V will]}]}].', {
    ja: 'そして、コックとして行くことについては——たしかにコックは船の上ではいわば士官で、かなりの栄誉があることは認めるけれど——それでも、どういうわけか、鶏をあぶり焼きにするのは好きになれなかった。——もっとも、ひとたびこんがり焼けて、ほどよくバターを塗られ、塩と胡椒を見事に振られたなら、焼いた鶏について、私ほどうやうやしく、いや崇めんばかりに語る者はいないだろう。',
    chunks: [
      ['And as for going as cook, —', 'そして、コックとして行くことについては——'],
      ['though I confess there is considerable glory in that,', 'それにかなりの栄誉があることは認めるし'],
      ['a cook being a sort of officer on ship-board —', 'コックは船の上ではいわば士官なのだが——'],
      ['yet, somehow, I never fancied broiling fowls; —', 'それでも、どういうわけか、鶏をあぶり焼きにするのは好きになれなかった——'],
      ['though once broiled, judiciously buttered,', 'もっとも、ひとたび焼き上がり、ほどよくバターを塗られ'],
      ['and judgmatically salted and peppered,', '塩と胡椒を見事に振られたなら'],
      ['there is no one who will speak more respectfully,', 'もっとうやうやしく語る者はいない（何についてかは次へ）'],
      ['not to say reverentially, of a broiled fowl than I will.', '崇めんばかりにとは言わずとも、焼いた鶏について、私以上に'],
    ],
    unitNotes: {
      'not to say': '「〜とは言わないまでも」。後ろの reverentially（崇めるように）をやわらげて添える決まった言い方です。',
    },
    marks: [
      ['— —', 'コンマのすぐあとのダッシュと ship-board のあとのダッシュが一対になり、コックの仕事の良いところ（though … ship-board）を話の途中に差し込んでいます。外して読むと And as for going as cook, yet, somehow, I never fancied … とつながります。'],
      [';', 'セミコロンで「鶏を焼くのは好きになれなかった」という文を区切ります。'],
      ['—', 'セミコロンのあとのダッシュで間を置き、「それでも焼けた鶏を語らせたら私が一番」という冗談めいた付け足しへ移ります。'],
    ],
    notes: {
      'though I confess there is considerable glory in that,': 'confess は「（しぶしぶ）認める」。that は「コックとして行くこと」を指します。',
      'a cook being a sort of officer on ship-board —': 'a cook being … は、分詞 being の前に意味上の主語 a cook を置いた分詞構文（独立分詞構文）で、「コックは〜なので」と理由を表します。',
      'yet, somehow, I never fancied broiling fowls; —': 'fancy doing は「〜するのを好む」。broil は「あぶり焼きにする」、fowl は「鶏」。',
      'though once broiled, judiciously buttered,': 'though (a fowl is) once broiled の a fowl is が省かれた形。once は「ひとたび」、judiciously は「ほどよく」。',
      'and judgmatically salted and peppered,': 'judgmatically は「うまく判断して」という、おどけた感じの語です。',
      'not to say reverentially, of a broiled fowl than I will.': 'speak of A は「A について語る」。than I will で「私（が語る）より」。',
    },
  }),
  // 61
  ls('[S It] [V is] [C {前| out of the idolatrous dotings {前| of the old Egyptians} {前| upon {並列| broiled ibis | and roasted river horse}}}], [M {強調| [接 that] [S you] [V see] [O the mummies {前| of those creatures}] [M {前| in their huge bake-houses {同格>their huge bake-houses| the pyramids}}]}].', {
    ja: '古代エジプト人が焼いたトキやあぶったカバを偶像のように溺愛していたからこそ、今もそうした生き物のミイラが、彼らの巨大なかまど、つまりピラミッドの中に見られるのだ。',
    chunks: [
      ['It is out of the idolatrous dotings', 'それは、偶像を崇めるような溺愛からなのだ'],
      ['of the old Egyptians upon broiled ibis and roasted river horse,', '古代エジプト人が焼いたトキやあぶったカバに寄せた'],
      ['that you see the mummies of those creatures', 'そうした生き物のミイラが見られるのは'],
      ['in their huge bake-houses the pyramids.', '彼らの巨大なかまど、ピラミッドの中に'],
    ],
    notes: {
      'It is out of the idolatrous dotings': 'It is A that … の強調構文で、A（out of 以下＝〜のために）を強めています。doting は「溺愛」、idolatrous は「偶像崇拝のような」。',
      'of the old Egyptians upon broiled ibis and roasted river horse,': 'dote upon A で「A を溺愛する」。ibis（トキ）と river horse（カバ）は、古代エジプトで神聖とされた動物です。',
      'in their huge bake-houses the pyramids.': 'bake-house は「パン焼き場・かまど」。ピラミッドを、鳥を焼くかまどにたとえた冗談で、the pyramids が their huge bake-houses を言いかえています。',
    },
  }),
  // 62
  ls('[独 No], [M {副詞節:時| [接 when] [S I] [V go] [M {前| to sea}]}], [S I] [V go] [M {前| as a simple sailor}], [M right {前| before the mast}], [M plumb down] [M {前| into the forecastle}], [M aloft there {前| to the royal mast-head}].', {
    p: true,
    ja: 'いや、海へ出るときは、ただの平水夫として行く。マストのすぐ前の持ち場へ、船首楼の中へまっすぐ下り、上はいちばん高い帆柱のてっぺんまで登っていく。',
    chunks: [
      ['No, when I go to sea,', 'いや、私が海へ出るときは'],
      ['I go as a simple sailor,', 'ただの水夫として行く'],
      ['right before the mast, plumb down into the forecastle,', 'マストのすぐ前に、船首楼の中へまっすぐ下り'],
      ['aloft there to the royal mast-head.', '上はいちばん高い帆柱のてっぺんまで'],
    ],
    notes: {
      'right before the mast, plumb down into the forecastle,': 'before the mast は「マストの前（の水夫部屋）で」、つまり平水夫として働くことを表す言い方です。plumb は「まっすぐに」、forecastle は船首の水夫部屋（船首楼）。',
      'aloft there to the royal mast-head.': 'aloft は「高い所へ」。royal mast-head は、いちばん上の帆（ロイヤル）を張る帆柱の先端です。',
    },
  }),
  // 63
  ls('[独 True], [S they] [M rather] [V order] [O me] [M about] [M some], [接 and] [V make] [O me] [C {原形| [V jump] [M {反復| from spar to spar}]}], [M {前| like a grasshopper {前| in a May meadow}}].', {
    ja: 'たしかに、彼らは私をいくらかあれこれこき使い、五月の牧場のバッタのように、帆桁から帆桁へと跳び移らせる。',
    chunks: [
      ['True, they rather order me about some,', 'たしかに、彼らは私をいくらかこき使うし'],
      ['and make me jump from spar to spar,', '帆桁から帆桁へ跳び移らせる'],
      ['like a grasshopper in a May meadow.', '五月の牧場のバッタのように'],
    ],
    notes: {
      'True, they rather order me about some,': 'True は It is true（たしかに）の略。order A about は「A をあれこれこき使う」。rather と some は「いくらか」と程度をやわらげる語です。',
      'and make me jump from spar to spar,': 'make＋人＋原形で「人に〜させる」。spar は帆を張る「帆桁」。',
    },
  }),
  // 64
  ls('[接 And] [M {前| at first}], [S this sort {前| of thing}] [V is] [C unpleasant enough].', {
    ja: 'そして、はじめのうち、こういうことはなかなか不愉快なものだ。',
    chunks: [
      ['And at first, this sort of thing is unpleasant enough.', 'そして最初のうち、こういうことはかなり不愉快だ'],
    ],
    notes: {
      'And at first, this sort of thing is unpleasant enough.': 'enough は形容詞の後ろに置いて「十分に・かなり」。',
    },
  }),
  // 65
  ls('[S It] [V touches] [O one’s sense {前| of honor}], [M particularly {副詞節:条件| [接 if] [S you] [V come] [M {前| of an old established family {前| in the land}, {同格>an old established family| the {並列| Van Rensselaers, | or Randolphs, | or Hardicanutes}}}]}].', {
    ja: 'それは人の名誉心を傷つける。とりわけ、ヴァン・レンセラー家やランドルフ家やハーディカヌート家のような、その土地の古い名家の出であればなおさらだ。',
    chunks: [
      ['It touches one’s sense of honor,', 'それは人の名誉心を傷つける'],
      ['particularly if you come of an old established family in the land,', 'とりわけ、その土地の古い名家の出なら'],
      ['the Van Rensselaers, or Randolphs, or Hardicanutes.', 'ヴァン・レンセラー家やランドルフ家やハーディカヌート家のような'],
    ],
    notes: {
      'It touches one’s sense of honor,': 'touch はここでは「（感情を）傷つける」。one’s は「人の」。',
      'particularly if you come of an old established family in the land,': 'come of A で「A の出である」。old established family は「古くから続く名家」。',
      'the Van Rensselaers, or Randolphs, or Hardicanutes.': 'the＋名字の複数形で「〜家の人々」。アメリカやイギリスの名家の名前を並べています。',
    },
  }),
  // 66
  ls('[接 And] [M {成句| more than all}], [M {副詞節:条件| [接 if] [M just previous {前| to {動名詞| [V putting] [O your hand] [M {前| into the tar-pot}]}}], [S you] [V have been lording] [O it] [M {前| as a country schoolmaster}], [M {分詞構文:付帯状況| [V making] [O the tallest boys] [C {原形| [V stand] [M {前| in awe {前| of you}}]}]}]}].', {
    fragment: true,
    ja: 'しかも何より、タールのつぼに手を突っこむ直前まで、田舎の学校の先生として、いちばん背の高い少年たちまでおそれ入らせて威張っていたとなれば、なおさらだ。',
    chunks: [
      ['And more than all,', 'しかも何より'],
      ['if just previous to putting your hand into the tar-pot,', 'もしタールのつぼに手を突っこむ直前まで'],
      ['you have been lording it as a country schoolmaster,', '田舎の学校の先生として威張っていたなら'],
      ['making the tallest boys stand in awe of you.', 'いちばん背の高い少年たちまでおそれ入らせて'],
    ],
    unitNotes: {
      'more than all': '「何よりも」。than のあとの all（すべて）と比べて、いちばん強いことを表す決まった言い方です。',
    },
    notes: {
      'And more than all,': '前の文の「名誉心を傷つける」を受けて、主節（It touches …）を省いた形です。',
      'if just previous to putting your hand into the tar-pot,': 'previous to A で「A の前に」。tar-pot は船の手入れに使うタール（黒い油）のつぼで、水夫の仕事を表します。',
      'you have been lording it as a country schoolmaster,': 'lord it は「殿様のように威張る」。it は特定のものを指さない決まった形です。',
      'making the tallest boys stand in awe of you.': 'make＋人＋原形で「人に〜させる」。stand in awe of A は「A を恐れ敬う」。',
    },
  }),
  // 67
  ls('[S The transition] [V is] [C a keen one], [M {挿入| I assure you}], [M {前| from a schoolmaster} {前| to a sailor}], [接 and] [V requires] [O a strong decoction {前| of {並列| Seneca | and the Stoics}}] [M {to:副詞(目的)| [V to enable] [O you] [C {to:補語| [V to {並列| grin | and bear}] [O it]}]}].', {
    ja: '学校の先生から水夫への転身は、請け合ってもいいが、なかなか身にこたえるもので、にっこり笑って耐えられるようになるには、セネカやストア派の哲学を濃く煎じたものが必要だ。',
    chunks: [
      ['The transition is a keen one, I assure you,', 'その変わり目はなかなか身にこたえる、請け合おう'],
      ['from a schoolmaster to a sailor,', '学校の先生から水夫への'],
      ['and requires a strong decoction of Seneca', 'そしてセネカの濃い煎じ薬が必要になる'],
      ['and the Stoics to enable you to grin and bear it.', 'ストア派の哲学も、にっこり笑って耐えられるようになるために'],
    ],
    notes: {
      'The transition is a keen one, I assure you,': 'keen はここでは「身にしみる・つらい」。one は transition のくり返しを避ける語。I assure you は「請け合うが」と話の途中に差し込まれています。',
      'from a schoolmaster to a sailor,': 'from A to B は The transition を説明し、「A から B への変わり目」。',
      'and requires a strong decoction of Seneca': 'decoction は「煎じ薬」。セネカはローマのストア派の哲学者で、その教えを薬のように煎じて飲む、というたとえです。',
      'and the Stoics to enable you to grin and bear it.': 'enable＋人＋to do で「人が〜できるようにする」。grin and bear it は「にっこり笑って耐える」という決まった言い方です。',
    },
  }),
  // 68
  ls('[接 But] [S even this] [V wears off] [M {前| in time}].', {
    ja: 'だが、それさえも、やがて薄れていく。',
    chunks: [
      ['But even this wears off in time.', 'だがそれさえもやがて薄れていく'],
    ],
    notes: {
      'But even this wears off in time.': 'wear off は「（感情などが）だんだん薄れる」。in time は「やがて」。',
    },
  }),
  // 69
  ls('[独 What {前| of it}], [M {副詞節:条件| [接 if] [S some old hunks {前| of a sea-captain}] [V orders] [O me] [C {to:補語| [V to get] [O a broom] [接 and] [V sweep down] [O the decks]}]}]?', {
    p: true,
    fragment: true,
    ja: 'どこかの気むずかしい老船長が、ほうきを持って甲板を掃除しろと私に命じたとしても、それがどうしたというのだ？',
    chunks: [
      ['What of it,', 'それがどうした'],
      ['if some old hunks of a sea-captain orders me', 'もしどこかの気むずかしい老船長が私に命じても'],
      ['to get a broom and sweep down the decks?', 'ほうきを取って甲板を掃除しろと'],
    ],
    notes: {
      'What of it,': 'What of it? は「それがどうした（かまわない）」という決まった言い方で、動詞が省かれています。',
      'if some old hunks of a sea-captain orders me': 'hunks は「気むずかしい老人」。A of a B で「A のような B」、つまり「気むずかしい老人のような船長」。order＋人＋to do で「人に〜するよう命じる」。',
    },
  }),
  // 70
  ls('[O What] [V does] [S that indignity] [V amount to], [M {分詞構文:条件| [V weighed], [M {挿入| I mean}], [M {前| in the scales {前| of the New Testament}}]}]?', {
    ja: 'そんな屈辱など、どれほどのものだろう。つまり、新約聖書の秤で量ってみたら？',
    chunks: [
      ['What does that indignity amount to, weighed,', 'その屈辱はどれほどのものになるか、量ってみたら'],
      ['I mean, in the scales of the New Testament?', 'つまり、新約聖書の秤で'],
    ],
    notes: {
      'What does that indignity amount to, weighed,': 'amount to A で「A に達する・A ほどのものになる」。indignity は「屈辱」。weighed は「量られると」という条件の分詞構文です。',
      'I mean, in the scales of the New Testament?': 'I mean は「つまり」と言い直す合図。新約聖書の教え（へりくだりを大切にする）で量れば、人に仕えるのは恥ではない、という含みです。',
    },
  }),
  // 71
  ls('[V Do] [S you] [V think] [O {that省略| [S the archangel Gabriel] [V thinks] [O anything] [M the less {前| of me}], [M {副詞節:理由| [接 because] [S I] [M {並列| promptly | and respectfully}] [V obey] [O that old hunks] [M {前| in that particular instance}]}]}]?', {
    ja: '私がその場ですぐに、うやうやしくあの気むずかしい老人に従ったからといって、大天使ガブリエルが少しでも私を見下げると思うかね？',
    chunks: [
      ['Do you think the archangel Gabriel thinks anything the less of me,', '大天使ガブリエルが少しでも私を見下げると思うかね'],
      ['because I promptly and respectfully obey that old hunks', '私がすぐに、うやうやしくあの気むずかしい老人に従うからといって'],
      ['in that particular instance?', 'その場合に'],
    ],
    notes: {
      'Do you think the archangel Gabriel thinks anything the less of me,': 'think less of A は「A を見下げる」。anything the less で「少しでも」と否定の気持ちを強めます。Gabriel は神の言葉を伝える大天使です。',
      'because I promptly and respectfully obey that old hunks': 'promptly は「すぐに」、respectfully は「うやうやしく」。',
    },
  }),
  // 72
  ls('[S Who] [V ain’t] [C a slave]?', {
    ja: '奴隷でない者などいるだろうか？',
    chunks: [
      ['Who ain’t a slave?', '奴隷でない者などいるか？'],
    ],
    notes: {
      'Who ain’t a slave?': 'ain’t は isn’t のくだけた言い方。「奴隷でない者は誰か」と問いながら「誰もが奴隷だ」と言う反語の疑問文です。',
    },
  }),
  // 73
  ls('[V Tell] [O1 me] [O2 that].', {
    ja: 'さあ、答えてみてくれ。',
    chunks: [
      ['Tell me that.', 'それを教えてくれ'],
    ],
    notes: {
      'Tell me that.': 'tell＋人＋もので「人にものを教える」。that は前の問い「奴隷でない者はいるか」を指します。',
    },
  }),
  // 74
  ls('[独 Well], [M then], [M {副詞節:譲歩| [M however] [S the old sea-captains] [V may order] [O me] [M about]}] — [M {副詞節:譲歩| [M however] [S they] [V may {並列| thump | and punch}] [O me] [M about]}], [S I] [V have] [O the satisfaction {前| of {動名詞| [V knowing] [O {that節| [接 that] [S it] [V is] [C all right]}; {that節| [接 that] [S everybody else] [V is] [M {成句| one way or other}] [V served] [M {前| in much the same way}] — [M either {前| in a {並列| physical | or metaphysical} point {前| of view}}], [M {成句| that is}]}]}}]; [接 and] [M so] [S the universal thump] [V is passed round], [接 and] [S all hands] [V should rub] [O each other’s shoulder-blades], [接 and] [V be] [C content].', {
    ja: 'さて、それなら、老船長たちがどんなに私をこき使おうと——どんなに殴ったりこづいたりしようと、私にはそれで構わないのだと分かっているという満足がある。ほかの誰もが、何らかの形で——つまり肉体的にか、形而上的にかという意味でだが——ほとんど同じように扱われているのだと分かっているのだ。だから、げんこつは世の中の皆にぐるりと回ってくるのであり、みんな互いの肩甲骨をさすり合って、満足していればよいのだ。',
    chunks: [
      ['Well, then, however the old sea-captains may order me about —', 'さて、それなら、老船長たちがどんなに私をこき使おうと——'],
      ['however they may thump and punch me about,', 'どんなに私を殴ったりこづいたりしようと'],
      ['I have the satisfaction of knowing that it is all right;', '私には、それで構わないのだと分かっている満足がある'],
      ['that everybody else is one way or other served', 'ほかの誰もが何らかの形で扱われているのだと'],
      ['in much the same way —', 'ほとんど同じように——'],
      ['either in a physical or metaphysical point of view, that is;', 'つまり、肉体的にか、形而上的にかという意味でだが'],
      ['and so the universal thump is passed round,', 'だから、皆へのげんこつはぐるりと回され'],
      ['and all hands should rub each other’s shoulder-blades, and be content.', 'みんな互いの肩甲骨をさすり合って、満足すべきなのだ'],
    ],
    unitNotes: {
      'one way or other': '「何らかの形で・どうにかして」という決まった言い方です。',
      'that is': '「つまり」と前の語句を言い直す決まった言い方です。',
    },
    marks: [
      ['—', 'ダッシュのあとに、同じ however … の形をもう一度重ねて（どんなに殴られようと）、譲歩を強めています。'],
      [';', 'セミコロンのあとの that 節は、前の that it is all right と並んで knowing の目的語になります。「満足」の中身を2つ目として付け足しています。'],
      ['—', 'ダッシュのあとで、in much the same way（ほとんど同じように）の中身を「肉体的にか、形而上的にか」と補っています。'],
      [';', 'セミコロンで補足を閉じ、and so（だから）で結論（げんこつは皆に回ってくる）へ進みます。'],
    ],
    notes: {
      'Well, then, however the old sea-captains may order me about —': 'however＋主語＋may … で「どんなに〜しても」。order A about は「A をこき使う」。',
      'however they may thump and punch me about,': 'thump と punch はどちらも「げんこつで殴る」。about は「あちこち」。',
      'I have the satisfaction of knowing that it is all right;': 'the satisfaction of doing で「〜するという満足」。it is all right は「それで構わない」。',
      'that everybody else is one way or other served': 'serve はここでは「（人を）扱う」。is served で「扱われる」。',
      'either in a physical or metaphysical point of view, that is;': 'either A or B で「A か B のどちらか」。physical（肉体的な）と metaphysical（形而上の・精神的な）を対にしています。',
      'and so the universal thump is passed round,': 'universal thump は「誰もが受けるげんこつ」。pass round は「順に回す」。',
      'and all hands should rub each other’s shoulder-blades, and be content.': 'all hands は「全員」（船では乗組員全員）。互いの肩をさすり合う、つまり慰め合うということです。',
    },
  }),
  // 75
  ls('[M Again], [S I] [M always] [V go] [M {前| to sea}] [M {前| as a sailor}], [M {副詞節:理由| [接 because] [S they] [V make] [O a point] [M {前| of {動名詞| [V paying] [O me] [M {前| for my trouble}]}}], [M {副詞節:対比| [接 whereas] [S they] [M never] [V pay] [O1 passengers] [O2 a single penny {関係>a single penny| [M that] [S I] [M ever] [V heard] [M of]}]}]}].', {
    p: true,
    ja: 'もう一つ、私がいつも水夫として海へ出るのは、苦労に対して必ず給金を払ってくれるからだ。乗客には、私の聞いたかぎり、一ペニーも払ったためしがないのに。',
    chunks: [
      ['Again, I always go to sea as a sailor,', 'また、私がいつも水夫として海へ出るのは'],
      ['because they make a point of paying me for my trouble,', '苦労に対して必ず給金を払ってくれるからだ'],
      ['whereas they never pay passengers a single penny', '一方、乗客には一ペニーも払わない'],
      ['that I ever heard of.', '私の聞いたかぎりでは'],
    ],
    notes: {
      'because they make a point of paying me for my trouble,': 'make a point of doing で「必ず〜するようにしている」。trouble はここでは「骨折り・手間」。',
      'whereas they never pay passengers a single penny': 'whereas は「〜なのに対して」。pay＋人＋お金で「人にお金を払う」。',
      'that I ever heard of.': 'that は a single penny を受ける関係代名詞で、of の目的語です。hear of A は「A のことを耳にする」。',
    },
  }),
  // 76
  ls('[M {前| On the contrary}], [S passengers themselves] [V must pay].', {
    ja: 'それどころか、乗客は自分でお金を払わなければならない。',
    chunks: [
      ['On the contrary, passengers themselves must pay.', 'それどころか、乗客は自分で払わなければならない'],
    ],
    notes: {
      'On the contrary, passengers themselves must pay.': 'on the contrary は「それどころか・逆に」。themselves は passengers を強めて「自分たちで」。',
    },
  }),
  // 77
  ls('[接 And] [M there] [V is] [S all the difference {前| in the world}] [M {前| between {並列| {動名詞| [V paying]} | and {動名詞| [V being paid]}}}].', {
    ja: 'そして、払うことと払ってもらうことの間には、天と地ほどの違いがある。',
    chunks: [
      ['And there is all the difference', 'そして、まったくの違いがある'],
      ['in the world between paying and being paid.', 'この世で、払うことと払ってもらうことの間には'],
    ],
    notes: {
      'And there is all the difference': 'all the difference in the world は「天と地ほどの違い」という言い方です。',
      'in the world between paying and being paid.': 'paying（払うこと）と being paid（払ってもらうこと）は、どちらも前置詞 between の目的語になる動名詞です。',
    },
  }),
  // 78
  ls('[S The act {前| of {動名詞| [V paying]}}] [V is] [M perhaps] [C the most uncomfortable infliction {関係>the most uncomfortable infliction| [O that] [S the two orchard thieves] [V entailed] [M {前| upon us}]}].', {
    ja: 'お金を払うという行為は、あの果樹園の二人の盗人が私たちに負わせた苦しみの中でも、おそらくいちばん居心地の悪いものだろう。',
    chunks: [
      ['The act of paying is perhaps the most uncomfortable infliction', '払うという行為は、おそらくいちばん居心地の悪い苦しみだ'],
      ['that the two orchard thieves entailed upon us.', 'あの果樹園の二人の盗人が私たちにもたらした'],
    ],
    notes: {
      'The act of paying is perhaps the most uncomfortable infliction': 'infliction は「（与えられた）苦しみ・罰」。',
      'that the two orchard thieves entailed upon us.': 'the two orchard thieves は、禁じられた木の実を食べたアダムとイブのこと（旧約聖書）。entail A upon B で「A を B に負わせる」。',
    },
  }),
  // 79
  ls('[接 But] [独 {動名詞| [V being paid]}], — [S what] [V will compare] [M {前| with it}]?', {
    ja: 'だが、払ってもらうこと——これに比べられるものがあるだろうか？',
    chunks: [
      ['But being paid, —', 'だが、払ってもらうこと——'],
      ['what will compare with it?', 'それに比べられるものがあるだろうか？'],
    ],
    marks: [
      ['—', 'コンマのあとのダッシュで間を置き、being paid（払ってもらうこと）という話題を示してから、問い what will compare with it? を投げかけます。'],
    ],
    notes: {
      'But being paid, —': 'being paid（払ってもらうこと）を話題として先に出し、あとの it で受け直しています。',
      'what will compare with it?': 'compare with A は「A に匹敵する」。「何も比べものにならない」という反語です。',
    },
  }),
  // 80
  ls('[S The urbane activity {関係>The urbane activity| [M with which] [S a man] [V receives] [O money]}] [V is] [M really] [C marvellous], [M {分詞構文:条件| [V considering] [O {並列| {that節| [接 that] [S we] [M so earnestly] [V believe] [O money] [C {to:補語| [V to be] [C the root {前| of all earthly ills}]}]}, | and {that節| [接 that] [M {前| on no account}] [V can] [S a monied man] [V enter] [O heaven]}}]}].', {
    ja: '人がお金を受け取るときの愛想のよい振る舞いは、実にみごとなものだ。お金こそ地上のあらゆる悪の根だと大まじめに信じ、金持ちは決して天国に入れないと信じていることを考えればなおさらだ。',
    chunks: [
      ['The urbane activity with which a man receives money', '人がお金を受け取るときの愛想のよい振る舞いは'],
      ['is really marvellous,', '実にみごとだ'],
      ['considering that we so earnestly believe money', '考えてみれば、私たちは大まじめにお金を信じているのに'],
      ['to be the root of all earthly ills,', 'この世のあらゆる悪の根だと'],
      ['and that on no account can a monied man enter heaven.', 'そして、金持ちは決して天国に入れないと'],
    ],
    notes: {
      'The urbane activity with which a man receives money': 'with which は前置詞＋関係代名詞で、a man receives money with the urbane activity（愛想よく受け取る）の with が前に出た形です。urbane は「如才ない・愛想のよい」。',
      'considering that we so earnestly believe money': 'considering that … は「〜ということを考えると」。believe A to be B で「A が B だと信じる」。',
      'to be the root of all earthly ills,': '「金はあらゆる悪の根」という聖書の言葉をふまえています。',
      'and that on no account can a monied man enter heaven.': 'on no account（決して〜ない）が前に出たので、can a monied man enter と疑問文の語順（倒置）になっています。monied は「金持ちの」。',
    },
  }),
  // 81
  ls('[独 Ah]! [M how cheerfully] [S we] [V consign] [O ourselves] [M {前| to perdition}]!', {
    ja: 'ああ！私たちは、なんと嬉々として自分を地獄へ送りこむことか！',
    chunks: [
      ['Ah! how cheerfully we consign ourselves to perdition!', 'ああ！私たちはなんと嬉々として自分を地獄へ送りこむことか！'],
    ],
    notes: {
      'Ah! how cheerfully we consign ourselves to perdition!': 'how＋副詞＋主語＋動詞！で「なんと〜に…することか」という感嘆文。consign A to B は「A を B へ引き渡す」、perdition は「地獄・破滅」。お金を受け取って喜ぶことを、自分から地獄へ進むことにたとえた冗談です。',
    },
  }),
  // 82
  ls('[M Finally], [S I] [M always] [V go] [M {前| to sea}] [M {前| as a sailor}], [M {前| because of the {並列| wholesome exercise | and pure air} {前| of the fore-castle deck}}].', {
    p: true,
    ja: '最後に、私がいつも水夫として海へ出るのは、船首楼の甲板での健やかな運動と、きれいな空気のためだ。',
    chunks: [
      ['Finally, I always go to sea as a sailor,', '最後に、私がいつも水夫として海へ出るのは'],
      ['because of the wholesome exercise and pure air of the fore-castle deck.', '船首楼の甲板での健やかな運動ときれいな空気のためだ'],
    ],
    notes: {
      'because of the wholesome exercise and pure air of the fore-castle deck.': 'because of A は「A のために」。wholesome は「健康によい」。fore-castle deck は船首楼の甲板で、水夫たちの持ち場です。',
    },
  }),
  // 83
  ls('[接 For] [M {副詞節:様態| [接 as] [M {前| in this world}], [S head winds] [V are] [C far more prevalent {前| than winds {前| from astern}}] [M ({成句| that is}, {副詞節:条件| [接 if] [S you] [M never] [V violate] [O the Pythagorean maxim]})]}], [M so] [M {前| for the most part}] [S the Commodore {前| on the quarter-deck}] [V gets] [O his atmosphere] [M {前| at second hand}] [M {前| from the sailors {前| on the forecastle}}].', {
    ja: 'というのも、この世では向かい風のほうが追い風よりはるかに多いように（ピタゴラスの教えをけっして破らなければの話だが）、たいていの場合、後甲板にいる提督は、船首楼にいる水夫たちから、空気をお下がりで受け取っているのだから。',
    chunks: [
      ['For as in this world,', 'というのも、この世では'],
      ['head winds are far more prevalent than winds from astern', '向かい風のほうが追い風よりはるかに多いように'],
      ['(that is, if you never violate the Pythagorean maxim),', '（つまり、ピタゴラスの教えをけっして破らなければだが）'],
      ['so for the most part the Commodore on the quarter-deck', 'それと同じく、たいていの場合、後甲板の提督は'],
      ['gets his atmosphere at second hand', '空気をお下がりで受け取る'],
      ['from the sailors on the forecastle.', '船首楼の水夫たちから'],
    ],
    unitNotes: {
      'that is': '「つまり」と前の語句を言い直す決まった言い方です。',
    },
    notes: {
      'For as in this world,': 'as …, so ～ で「…のように、～も」。For は「というのも」と前の文の理由を続けます。',
      'head winds are far more prevalent than winds from astern': 'head wind は「向かい風」、wind from astern は「後ろからの風（追い風）」。far は比較級を強めて「はるかに」、prevalent は「よく起こる」。',
      '(that is, if you never violate the Pythagorean maxim),': 'ピタゴラスには「豆を食べるな」という教えがあったとされ、それを守っていれば（おならをしなければ）、という冗談です。',
      'so for the most part the Commodore on the quarter-deck': 'quarter-deck は船尾の甲板で、上官の場所です。Commodore は「提督」。',
      'gets his atmosphere at second hand': 'at second hand は「人を通して・お下がりで」。風下の後甲板にいる提督は、風上の船首楼にいる水夫が吸ったあとの空気を吸う、という冗談です。',
    },
  }),
  // 84
  ls('[S He] [V thinks] [O {that省略| [S he] [V breathes] [O it] [M first]}]; [接 but] [M not so].', {
    ja: '提督は、自分が真っ先に空気を吸っていると思っている。だが、そうではないのだ。',
    chunks: [
      ['He thinks he breathes it first;', '提督は、自分が真っ先にそれを吸っていると思っている'],
      ['but not so.', 'だがそうではない'],
    ],
    marks: [
      [';', 'セミコロンのあとに but not so（だがそうではない）を短く置き、提督の思い込みをきっぱり打ち消します。'],
    ],
    notes: {
      'but not so.': 'but it is not so の it is が省かれた形です。',
    },
  }),
  // 85
  ls('[M {前| In much the same way}] [V do] [S the commonalty] [V lead] [O their leaders] [M {前| in many other things}], [M {前| at the same time {関係>the same time| [M that] [S the leaders] [M little] [V suspect] [O it]}}].', {
    ja: 'まったく同じように、ほかの多くのことでも、民衆が指導者を導いているのに、指導者のほうはそれにほとんど気づいていないのだ。',
    chunks: [
      ['In much the same way do the commonalty lead their leaders', 'ほぼ同じように、民衆は指導者を導いている'],
      ['in many other things,', 'ほかの多くのことでも'],
      ['at the same time that the leaders little suspect it.', 'その一方で、指導者たちはそれにほとんど気づいていない'],
    ],
    notes: {
      'In much the same way do the commonalty lead their leaders': '方法を表す語句を前に出し、do を主語 the commonalty の前に置いて強めた倒置です。commonalty は「一般の民衆」。',
      'at the same time that the leaders little suspect it.': 'at the same time that … は「〜している一方で」。little は「ほとんど〜ない」という否定の副詞です。',
    },
  }),
  // 86
  ls('[接 But] [O {疑問詞節| [M wherefore] [S it] [V was] [M {強調| [接 that] [M {前| after {動名詞| [V having] [M repeatedly] [V smelt] [O the sea] [M {前| as a merchant sailor}]}}], [S I] [V should] [M now] [V take] [仮O it] [M {前| into my head}] [真O {to:名詞| [V to go] [M {前| on a whaling voyage}]}]}]}]; [O this] [独 the invisible police officer {前| of the Fates}, {関係,>the invisible police officer| [S who] [V has] [O the constant surveillance {前| of me}], [接 and] [M secretly] [V dogs] [O me], [接 and] [V influences] [O me] [M {前| in some unaccountable way}]}] — [S he] [V can] [M better] [V answer] [M {前| than any one else}].', {
    ja: 'だが、商船の水夫として何度も海のにおいをかいできた私が、なぜ今になって捕鯨の航海に出ようなどと思い立ったのか。このことには、運命の女神たちに仕える目に見えない警官——いつも私を見張り、ひそかにつけ回し、何か説明のつかないやり方で私を動かすあの警官なら、ほかの誰よりもうまく答えられるだろう。',
    chunks: [
      ['But wherefore it was that', 'だが、なぜだったのか'],
      ['after having repeatedly smelt the sea as a merchant sailor,', '商船の水夫として何度も海のにおいをかいだあとで'],
      ['I should now take it into my head', '私が今になって思い立ったのは'],
      ['to go on a whaling voyage;', '捕鯨の航海に出ようと'],
      ['this the invisible police officer of the Fates,', 'このことは、運命の女神たちの見えない警官が'],
      ['who has the constant surveillance of me,', '私をいつも見張っていて'],
      ['and secretly dogs me, and influences me in some unaccountable way —', 'ひそかに私をつけ回し、何か説明のつかないやり方で私を動かす警官——'],
      ['he can better answer than any one else.', 'その警官なら、ほかの誰よりもうまく答えられる'],
    ],
    marks: [
      [';', 'セミコロンの前は「なぜ今になって捕鯨の航海に出ようと思い立ったのか」という問い、後ろはその問いに答えられる者（運命の見えない警官）です。問いを先に出してから、答え手を示しています。'],
      ['—', 'ダッシュで、長く説明した「運命の見えない警官」を he で受け直し、文の本当の述語 can better answer へつなぎます。'],
    ],
    notes: {
      'But wherefore it was that': 'wherefore は why の古い言い方。wherefore it was that … で「…だったのはなぜなのか」と、理由を強めて問う形です。この問い全体が、後ろの answer の目的語になっています。',
      'after having repeatedly smelt the sea as a merchant sailor,': 'after having ＋過去分詞で「〜したあとで」。smelt は smell の過去分詞、merchant sailor は「商船の水夫」。',
      'I should now take it into my head': 'take it into one’s head to do で「〜しようと思い立つ」。it は形式目的語で、中身は to go on a whaling voyage です。',
      'this the invisible police officer of the Fates,': 'this は前の問いを指し、answer の目的語が前に出たもの。the Fates はギリシャ神話で運命をつかさどる女神たちです。',
      'and secretly dogs me, and influences me in some unaccountable way —': 'dog は動詞で「（犬のように）つけ回す」。unaccountable は「説明のつかない」。',
      'he can better answer than any one else.': 'he は前の the invisible police officer … を受け直した主語です。',
    },
  }),
  // 87
  ls('[接 And], [M doubtless], [S my {動名詞| [V going] [M {前| on this whaling voyage}]}], [V formed] [O part {前| of the grand programme {前| of Providence} {関係>the grand programme| [S that] [V was drawn up] [M a long time ago]}}].', {
    ja: 'そして、私がこの捕鯨の航海に出ることは、疑いなく、ずっと昔に組まれた神の摂理という壮大な番組の一部になっていたのだ。',
    chunks: [
      ['And, doubtless, my going on this whaling voyage,', 'そして疑いなく、私がこの捕鯨の航海に出ることは'],
      ['formed part of the grand programme of Providence', '神の摂理という壮大な番組の一部をなしていた'],
      ['that was drawn up a long time ago.', 'ずっと昔に組まれた'],
    ],
    notes: {
      'And, doubtless, my going on this whaling voyage,': 'my going … は「私が〜すること」。動名詞 going の前の my が、意味の上の主語を表します。doubtless は「疑いなく」。',
      'formed part of the grand programme of Providence': 'form part of A で「A の一部をなす」。Providence は「神の摂理（神が定めた運命）」。programme は劇場などの「番組・演目表」で、次の文の芝居のたとえにつながります。',
      'that was drawn up a long time ago.': 'draw up は「（計画・書類などを）作成する」。',
    },
  }),
  // 88
  ls('[S It] [V came in] [M {前| as a sort {前| of brief {並列| interlude | and solo}}}] [M {前| between more extensive performances}].', {
    ja: 'それは、もっと大がかりな出し物の合間にはさまれた、短い幕間劇か独奏のようなものだった。',
    chunks: [
      ['It came in as a sort of brief interlude', 'それは一種の短い幕間劇として入った'],
      ['and solo between more extensive performances.', 'あるいは独奏として、もっと大がかりな出し物の合間に'],
    ],
    notes: {
      'It came in as a sort of brief interlude': 'come in as A で「A として入る」。interlude は「幕間の短い劇」。',
      'and solo between more extensive performances.': 'solo は「独奏」。自分の航海を、世界の大事件の合間の小さな出し物にたとえています。',
    },
  }),
  // 89
  ls('[S I] [V take] [仮O it] [真O {that節| [接 that] [S this part {前| of the bill}] [V must have run] [M something {前| like this}]}]:', {
    ja: 'この番組表のその部分は、きっと次のようなものだったのだろうと私は思う。',
    chunks: [
      ['I take it that this part of the bill', '思うに、番組表のこの部分は'],
      ['must have run something like this:', '次のような文句だったにちがいない'],
    ],
    marks: [
      [':', 'コロンのあとに、次の3行（芝居の番組表の文句）が続くことを予告します。「次のようなものだったろう——」と、中身を見せる合図です。'],
    ],
    notes: {
      'I take it that this part of the bill': 'take it that … は「…だと思う」。it は形式目的語で、中身は that 以下です。bill はここでは「（芝居の）番組表・ビラ」。',
      'must have run something like this:': 'must have ＋過去分詞で「〜だったにちがいない」。run はここでは「（文句が）〜となっている」。',
    },
  }),
  // 90
  ls('“[独 Grand Contested Election {前| for the Presidency {前| of the United States}}].', {
    p: true,
    fragment: true,
    ja: '「合衆国大統領をめぐる大接戦の選挙。',
    chunks: [
      ['“Grand Contested Election for the Presidency of the United States.', '「合衆国大統領をめぐる大接戦の選挙'],
    ],
    notes: {
      '“Grand Contested Election for the Presidency of the United States.': '芝居の番組表の文句をまねた一行で、世界の大きな出し物（大統領選挙）の見出しです。contested は「激しく争われた」。',
    },
  }),
  // 91
  ls('“[独 WHALING VOYAGE {前| BY ONE ISHMAEL}].', {
    p: true,
    fragment: true,
    ja: '「イシュメールなる者による捕鯨航海。',
    chunks: [
      ['“WHALING VOYAGE BY ONE ISHMAEL.', '「イシュメールなる者による捕鯨航海'],
    ],
    notes: {
      '“WHALING VOYAGE BY ONE ISHMAEL.': 'one Ishmael の one は「〜という名の（ある）」。大きな出し物の合間の、小さな出し物です。',
    },
  }),
  // 92
  ls('“[独 BLOODY BATTLE {前| IN AFFGHANISTAN}].”', {
    p: true,
    fragment: true,
    ja: '「アフガニスタンにおける血みどろの戦い。」',
    chunks: [
      ['“BLOODY BATTLE IN AFFGHANISTAN.”', '「アフガニスタンにおける血みどろの戦い」'],
    ],
    notes: {
      '“BLOODY BATTLE IN AFFGHANISTAN.”': '当時のアフガニスタンでの戦争を指す見出しで、AFFGHANISTAN は昔のつづりです。大事件の間に自分の捕鯨航海が小さくはさまっている、という冗談です。',
    },
  }),
  // 93
  ls('[M {副詞節:譲歩| [接 Though] [S I] [V cannot tell] [O {疑問詞節| [M why] [S it] [V was] [M exactly] [M {強調| [接 that] [S those stage managers, {同格>those stage managers| the Fates},] [V put] [O me] [M down] [M {前| for this shabby part {前| of a whaling voyage}}], [M {副詞節:時| [接 when] [S others] [V were set down] [M {前| for {並列| magnificent parts {前| in high tragedies}, | and {並列| short | and easy} parts {前| in genteel comedies}, | and jolly parts {前| in farces}}}]}]}]}]}] — [M {副詞節:譲歩| [接 though] [S I] [V cannot tell] [O {疑問詞節| [M why] [S this] [V was] [M exactly]}]}]; [M yet], [M {副詞節:理由| [接 now that] [S I] [V recall] [O all the circumstances]}], [S I] [V think] [O {that省略| [S I] [V can see] [M a little] [M {前| into the {並列| springs | and motives} {関係>the springs and motives| [S which] [M {分詞構文:理由| [V being] [M cunningly] [V presented] [M {前| to me}] [M {前| under various disguises}]}], [V induced] [O me] [C {to:補語| [V to set about] [O {動名詞| [V performing] [O the part {関係省略:目的格>the part| [S I] [V did]}]}]}], [M {前| besides {動名詞| [V cajoling] [O me] [M {前| into the delusion {同格that>the delusion| [接 that] [S it] [V was] [C a choice {現在分詞>a choice| [V resulting] [M {前| from my own unbiased {並列| freewill | and discriminating judgment}}]}]}}]}}]}}]}].', {
    p: true,
    ja: 'ほかの者たちには格調高い悲劇の堂々たる役や、上品な喜劇の短く楽な役や、笑劇の陽気な役が割り当てられたというのに、なぜあの舞台監督たち、つまり運命の女神たちが、私には捕鯨の航海というこのみすぼらしい役を割り当てたのか、はっきりとは言えない——それがなぜなのか、はっきりとは言えないのだけれど、それでも、今こうしていきさつを残らず思い返すと、物事を動かしたぜんまいや動機がいくらか見通せる気がする。それらはさまざまに姿を変えて巧みに私の前に差し出され、私があの役を演じ始めるよう仕向けただけでなく、それが私自身のかたよりのない自由意志と、よく見分ける判断から生まれた選択なのだと、私をおだてて思い込ませたのだ。',
    chunks: [
      ['Though I cannot tell why it was exactly', 'はっきりとは言えないのだが、それがなぜなのか'],
      ['that those stage managers, the Fates,', 'あの舞台監督たち、つまり運命の女神たちが'],
      ['put me down for this shabby part of a whaling voyage,', '私に捕鯨の航海というこのみすぼらしい役を割り当てたのは'],
      ['when others were set down for magnificent parts in high tragedies,', 'ほかの者たちには、格調高い悲劇の堂々たる役や'],
      ['and short and easy parts in genteel comedies,', '上品な喜劇の短くて楽な役や'],
      ['and jolly parts in farces —', '笑劇の陽気な役が割り当てられたというのに——'],
      ['though I cannot tell why this was exactly;', 'それがなぜなのかは、はっきりとは言えないけれど'],
      ['yet, now that I recall all the circumstances,', 'それでも、今こうしていきさつを残らず思い返すと'],
      ['I think I can see a little', '私にもいくらか見通せる気がする（何をかは次へ）'],
      ['into the springs and motives', '物事を動かしたぜんまいや動機を'],
      ['which being cunningly presented to me under various disguises,', 'それらは、さまざまに姿を変えて巧みに私に差し出され'],
      ['induced me to set about performing the part I did,', '私が演じたあの役を演じ始めるよう私を仕向け'],
      ['besides cajoling me into the delusion', 'そのうえ私をおだてて思い込ませた'],
      ['that it was a choice resulting', 'それは生まれた選択なのだと'],
      ['from my own unbiased freewill and discriminating judgment.', '私自身のかたよりのない自由意志と、よく見分ける判断から'],
    ],
    marks: [
      ['—', 'ダッシュのあとで、前の Though I cannot tell why it was exactly … をもう一度 though I cannot tell why this was exactly と短く言い直し、長くなった譲歩の節をまとめ直しています。'],
      [';', 'セミコロンで長い譲歩の部分（Though …）を締めくくり、yet（それでも）から主節 I think I can see … を始めます。'],
    ],
    notes: {
      'Though I cannot tell why it was exactly': 'tell はここでは「はっきり分かる・言える」。why it was exactly that … は、理由を強めて問う形です。',
      'that those stage managers, the Fates,': 'the Fates は those stage managers を言いかえた同格の語句。運命の女神たちを、役を割り振る舞台監督にたとえています。',
      'put me down for this shabby part of a whaling voyage,': 'put A down for B で「A を B に割り当てる」。shabby は「みすぼらしい」。',
      'when others were set down for magnificent parts in high tragedies,': 'when はここでは「〜だというのに」という対比の気持ちを含みます。set down for は put down for の受け身と同じ意味です。',
      'and short and easy parts in genteel comedies,': 'genteel は「上品ぶった」、comedy は「喜劇」、farce は「笑劇・どたばた喜劇」。',
      'yet, now that I recall all the circumstances,': 'now that … は「今や〜なので」。yet は Though と組んで「それでも」。',
      'into the springs and motives': 'springs はここでは「（時計の）ぜんまい」、つまり物事を動かすもとです。',
      'which being cunningly presented to me under various disguises,': 'which は springs and motives を受ける関係代名詞で、節の動詞は induced。間に being … disguises の分詞構文がはさまっています。',
      'induced me to set about performing the part I did,': 'induce＋人＋to do で「人に〜させる」。set about doing で「〜に取りかかる」。the part I did の did は performed の代わりです。',
      'besides cajoling me into the delusion': 'besides doing で「〜するうえに」。cajole A into B で「A をおだてて B させる」。delusion は「思い違い」。',
      'from my own unbiased freewill and discriminating judgment.': 'unbiased は「かたよりのない」、discriminating は「よく見分ける」。本当は運命に操られていたのに、自分で選んだと思い込まされた、という皮肉です。',
    },
  }),
  // 94
  ls('[C Chief {前| among these motives}] [V was] [S the overwhelming idea {前| of the great whale himself}].', {
    p: true,
    ja: 'そうした動機の中でいちばん大きかったのは、あの巨大な鯨そのものへの圧倒的な思いだった。',
    chunks: [
      ['Chief among these motives was the overwhelming idea', 'これらの動機の中でいちばん大きかったのは、圧倒的な思いだった'],
      ['of the great whale himself.', '巨大な鯨そのものについての'],
    ],
    notes: {
      'Chief among these motives was the overwhelming idea': '補語 Chief among these motives（これらの動機の中で主なもの）を前に出し、動詞 was を主語 the overwhelming idea … の前に置いた倒置です。',
      'of the great whale himself.': 'whale を himself で受け、人のように扱っています。',
    },
  }),
  // 95
  ls('[S Such a {並列| portentous | and mysterious} monster] [V roused] [O all my curiosity].', {
    ja: 'あれほど不吉で謎めいた怪物は、私の好奇心をすっかりかき立てた。',
    chunks: [
      ['Such a portentous and mysterious monster roused all my curiosity.', 'あれほど不吉で謎めいた怪物が、私の好奇心をすっかりかき立てた'],
    ],
    notes: {
      'Such a portentous and mysterious monster roused all my curiosity.': 'portentous は「不吉な・ただならぬ」。rouse は「（感情を）かき立てる」。',
    },
  }),
  // 96
  ls('[M Then] [独 the {並列| wild | and distant} seas {関係>the wild and distant seas| [M where] [S he] [V rolled] [O his island bulk]}]; [独 the undeliverable, nameless perils {前| of the whale}]; [S these], [M {前| with all the attending marvels {前| of a thousand Patagonian {並列| sights | and sounds}}}], [V helped] [O {to:名詞| [V to sway] [O me] [M {前| to my wish}]}].', {
    ja: 'それから、鯨が島のような巨体をうねらせる、荒々しく遠い海。鯨にまつわる、言いようもなく名もない危険。これらが、パタゴニアの数えきれない眺めや物音にまつわるあらゆる驚異とともに、私の心を望みのほうへと傾けたのだ。',
    chunks: [
      ['Then the wild and distant seas', 'それから、荒々しく遠い海'],
      ['where he rolled his island bulk;', '鯨が島のような巨体をうねらせる'],
      ['the undeliverable, nameless perils of the whale;', '鯨の、言いようもない、名もない危険'],
      ['these, with all the attending marvels', 'これらが、それに伴うあらゆる驚異とともに'],
      ['of a thousand Patagonian sights and sounds,', '数えきれないパタゴニアの眺めや物音の'],
      ['helped to sway me to my wish.', '私の心を望みのほうへ傾ける助けとなった'],
    ],
    marks: [
      [';', 'セミコロンで、捕鯨へ誘ったものを1つずつ区切って並べます。まず「鯨が島のような巨体をうねらせる、荒々しく遠い海」。'],
      [';', '2つ目の区切りです。「鯨の、言いようもなく名もない危険」を並べたあと、these（これらが）でまとめて受け直します。'],
    ],
    notes: {
      'Then the wild and distant seas': '文の頭に並べた語句（the wild … seas と the undeliverable … perils）を、あとの these で受け直して主語にしています。',
      'where he rolled his island bulk;': 'where は seas を受ける関係副詞。he は鯨、island bulk は「島のような巨体」。',
      'the undeliverable, nameless perils of the whale;': 'undeliverable は「（言葉で）伝えようのない」、nameless は「名づけようのない」。',
      'of a thousand Patagonian sights and sounds,': 'a thousand は「数えきれないほどの」。パタゴニアは南アメリカの南端の地方です。',
      'helped to sway me to my wish.': 'help to do で「〜する助けになる」。sway は「（心を）傾ける・動かす」。',
    },
  }),
  // 97
  ls('[M {前| With other men}], [M perhaps], [S such things] [V would not have been] [C inducements]; [接 but] [M {前| as for me}], [S I] [V am tormented] [M {前| with an everlasting itch {前| for things {形容詞>things| remote}}}].', {
    ja: 'ほかの人なら、おそらくこうしたものは誘いにならなかっただろう。だが私はといえば、遠くのものを求める、いつまでも消えないうずきに苦しめられているのだ。',
    chunks: [
      ['With other men, perhaps,', 'ほかの人の場合なら、おそらく'],
      ['such things would not have been inducements;', 'こうしたものは誘いにはならなかっただろう'],
      ['but as for me,', 'だが私はといえば'],
      ['I am tormented with an everlasting itch for things remote.', '遠くのものへの、いつまでも消えないうずきに苦しめられている'],
    ],
    marks: [
      [';', 'セミコロンの前は「ほかの人なら動機にならなかっただろう」、後ろは but as for me（だが私はといえば）で自分の場合を対比させています。'],
    ],
    notes: {
      'such things would not have been inducements;': 'would not have ＋過去分詞で「（もし〜だったら）〜しなかっただろう」。With other men が条件の役目をしています。inducement は「誘因・動機」。',
      'I am tormented with an everlasting itch for things remote.': 'itch for A は「A がほしくてうずうずすること」。things remote は remote things と同じで、形容詞 remote が後ろから説明しています。',
    },
  }),
  // 98
  ls('[S I] [V love] [O {to:名詞| [V to sail] [O forbidden seas], [接 and] [V land] [M {前| on barbarous coasts}]}].', {
    ja: '私は、禁じられた海を航海し、未開の岸に上陸するのが大好きなのだ。',
    chunks: [
      ['I love to sail forbidden seas, and land on barbarous coasts.', '私は禁じられた海を航海し、未開の岸に上陸するのが大好きだ'],
    ],
    notes: {
      'I love to sail forbidden seas, and land on barbarous coasts.': 'sail はここでは他動詞で「（海を）航海する」。land は to を共有して「上陸する」。barbarous は「未開の・荒々しい」。',
    },
  }),
  // 99
  ls('[M {分詞構文:付帯状況| [M Not] [V ignoring] [O {what節| [S what] [V is] [C good]}]}], [S I] [V am] [C quick {to:副詞(形容詞)| [V to perceive] [O a horror]}], [接 and] [V could] [M still] [V be] [C social {前| with it}] — [M {副詞節:条件| [V would] [S they] [V let] [O me]}] — [M {副詞節:理由| [接 since] [仮S it] [V is] [M but] [C well] [真S {to:名詞| [V to be] [M {前| on friendly terms {前| with all the inmates {前| of the place {関係省略:目的格(lodges)>the place| [S one] [V lodges] [M in]}}}}]}]}].', {
    ja: '私は、良いものを無視するわけではないが、恐ろしいものにもすぐ気づくし、それでもそれと仲よく付き合うこともできる——向こうがそうさせてくれるなら——なにしろ、自分が身を寄せる場所の住人とは、誰とでも仲よくしておくに越したことはないのだから。',
    chunks: [
      ['Not ignoring what is good,', '良いものを無視するわけではないが'],
      ['I am quick to perceive a horror,', '私は恐ろしいものをすぐに見抜くし'],
      ['and could still be social with it —', 'それとも仲よく付き合える——'],
      ['would they let me —', '向こうがそうさせてくれるなら——'],
      ['since it is but well to be', 'というのも、〜するのがよいだけのことだからだ（何がかは次へ）'],
      ['on friendly terms with all the inmates', 'すべての住人と仲よくしているのが'],
      ['of the place one lodges in.', '自分が身を寄せる場所の'],
    ],
    marks: [
      ['— —', '2つのダッシュが would they let me（向こうがそうさせてくれるなら）をはさみ、「付き合える」に条件をそっと差し込んでいます。'],
    ],
    notes: {
      'Not ignoring what is good,': 'Not ignoring … は「〜を無視するわけではなく」という分詞構文。分詞を打ち消すときは not を前に置きます。what is good は「良いもの」。',
      'I am quick to perceive a horror,': 'be quick to do で「すぐに〜する」。horror はここでは「恐ろしいもの」。',
      'and could still be social with it —': 'be social with A で「A と打ち解けて付き合う」。could は「（その気になれば）〜できる」。',
      'would they let me —': 'they は「恐ろしいもの」たちを人のように言っています。',
      'since it is but well to be': 'since は理由「〜なので」。it is but well to do で「〜するのがよいだけのことだ」、but は「ただ〜にすぎない」。',
      'of the place one lodges in.': 'one は「人（一般）」、lodge は「泊まる・身を寄せる」。in が関係詞節の最後に残っています。',
    },
  }),
  // 100
  ls('[M {前| By reason of these things}], [M then], [S the whaling voyage] [V was] [C welcome]; [S the great flood-gates {前| of the wonder-world}] [V swung] [C open], [接 and] [M {前| in the wild conceits {関係>the wild conceits| [S that] [V swayed] [O me] [M {前| to my purpose}]}}], [M {成句| two and two}] [M there] [V floated] [M {前| into my inmost soul}], [S {並列| endless processions {前| of the whale}, | and, {挿入| mid most {前| of them all}}, one grand hooded phantom, {前| like a snow hill {前| in the air}}}].', {
    p: true,
    ja: 'こうした理由から、捕鯨の航海は願ってもないものだった。驚異の世界の大きな水門がぱっと開き、私を目的へと駆り立てた奔放な空想の中で、果てしない鯨の行列が二頭ずつ組になって私の魂の奥底へ漂いこんできた。そしてそのまん中には、頭巾をかぶったような大きな幻が一つ、空に浮かぶ雪山のように浮かんでいた。',
    chunks: [
      ['By reason of these things, then,', 'こうした理由で、だから'],
      ['the whaling voyage was welcome;', '捕鯨の航海は願ってもないものだった'],
      ['the great flood-gates of the wonder-world swung open,', '驚異の世界の大きな水門がぱっと開き'],
      ['and in the wild conceits that swayed me to my purpose,', '私を目的へと動かした奔放な空想の中で'],
      ['two and two there floated into my inmost soul,', '二頭ずつ組になって、私の魂のいちばん奥へ漂いこんできた'],
      ['endless processions of the whale,', '果てしなく続く鯨の行列が'],
      ['and, mid most of them all,', 'そして、そのすべてのまん中には'],
      ['one grand hooded phantom, like a snow hill in the air.', '頭巾をかぶったような大きな幻が一つ、空に浮かぶ雪山のように'],
    ],
    unitNotes: {
      'two and two': '「二つずつ・二人ずつ」。同じ数を and でつなぐ決まった言い方です。',
    },
    marks: [
      [';', 'セミコロンの前は「だから捕鯨の航海は願ってもなかった」という結論、後ろはそのとき心に起きたこと（驚異の世界の水門が開いた）を描きます。'],
    ],
    notes: {
      'By reason of these things, then,': 'by reason of A は「A の理由で」。',
      'the great flood-gates of the wonder-world swung open,': 'flood-gate は「水門」。swing open は「（戸などが）さっと開く」。',
      'and in the wild conceits that swayed me to my purpose,': 'conceit はここでは「空想・奇抜な思いつき」。',
      'two and two there floated into my inmost soul,': 'two and two と there を前に出し、主語 endless processions … を動詞 floated の後ろに回した倒置です。inmost は「いちばん奥の」。',
      'and, mid most of them all,': 'mid most は「まん中に」（midmost の古い書き方）。of them all は「それらすべての」。',
      'one grand hooded phantom, like a snow hill in the air.': 'hooded は「頭巾をかぶった」。この大きな白い幻は、のちに登場する白い鯨モービィ・ディックを予告しています。',
    },
  }),
])
