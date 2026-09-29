import { ls } from './entry.js'

export default Object.freeze([
  // 1
  ls('[独 {並列| One dollar | and eighty-seven cents}].', {
    p: true,
    fragment: true,
    ja: '一ドル八十七セント。',
    chunks: [
      ['One dollar and eighty-seven cents.', '一ドル八十七セント'],
    ],
    notes: {
      'One dollar and eighty-seven cents.': '動詞のない、金額だけの文です。短く言い切って、お金の少なさを印象づけています。',
    },
  }),
  // 2
  ls('[S That] [V was] [C all].', {
    ja: 'それで全部だった。',
    chunks: [
      ['That was all.', 'それで全部だった'],
    ],
    notes: {
      'That was all.': 'all は「全部」。「持っているお金はそれだけだった」という意味です。',
    },
  }),
  // 3
  ls('[接 And] [S sixty cents {前| of it}] [V was] [C {前| in pennies}].', {
    ja: 'しかも、そのうち六十セントは一セント玉だった。',
    chunks: [
      ['And sixty cents of it was in pennies.', 'しかも、そのうち六十セントは一セント玉だった'],
    ],
    notes: {
      'And sixty cents of it was in pennies.': 'penny はここではアメリカの1セント硬貨。細かいお金を少しずつためたことが分かります。',
    },
  }),
  // 4
  ls('[独 Pennies {過去分詞>Pennies| [V saved] [M {成句| one and two at a time}] [M {前| by {動名詞| [V bulldozing] [O {並列| the grocer | and the vegetable man | and the butcher}]}}] [M {副詞節:時| [接 until] [S one’s cheeks] [V burned] [M {前| with the silent imputation {前| of parsimony} {関係>the silent imputation of parsimony| [O that] [S such close dealing] [V implied]}}]}]}].', {
    fragment: true,
    ja: '食料品屋や八百屋や肉屋にしつこく値切って、一枚、二枚とためた一セント玉だ。そんなけちくさいやり取りに、口には出さないが「しみったれ」と言われている気がして、ほおが赤くなるほどだった。',
    chunks: [
      ['Pennies saved one and two at a time', '一枚、二枚とためた一セント玉'],
      ['by bulldozing the grocer and the vegetable man', '食料品屋や八百屋にしつこく値切って'],
      ['and the butcher until one’s cheeks burned', 'そして肉屋にも。ほおが熱くなるまで'],
      ['with the silent imputation of parsimony', '口には出さない「しみったれ」という非難で'],
      ['that such close dealing implied.', 'そんなけちくさいやり取りが暗に示す（非難で）'],
    ],
    notes: {
      'Pennies saved one and two at a time': '動詞のない文で、Pennies を saved … が後ろから説明しています（「〜してためた1セント玉」）。one and two at a time は「一枚、二枚と」。',
      'by bulldozing the grocer and the vegetable man': 'bulldoze は「（相手を）押しきる」で、ここではしつこく値切ること。grocer は食料品屋です。',
      'and the butcher until one’s cheeks burned': 'until one’s cheeks burned は「ほおが熱くなるまで」。one は「（一般に）人」です。',
      'with the silent imputation of parsimony': 'imputation は「（悪いことを）人のせいにすること」、parsimony は「けち」。silent は「口には出さない」。',
      'that such close dealing implied.': 'that は the silent imputation of parsimony を説明する関係代名詞です。close dealing は「けちけちした取り引き」、imply は「暗に意味する」。',
    },
  }),
  // 5
  ls('[M Three times] [S Della] [V counted] [O it].', {
    ja: 'デラは三度、数えなおした。',
    chunks: [
      ['Three times Della counted it.', '三度、デラはそれを数えた'],
    ],
    notes: {
      'Three times Della counted it.': 'Three times（三度）を文の頭に出して強めています。何度数えても同じだった、ということです。',
    },
  }),
  // 6
  ls('[独 {並列| One dollar | and eighty-seven cents}].', {
    fragment: true,
    ja: '一ドル八十七セント。',
    chunks: [
      ['One dollar and eighty-seven cents.', '一ドル八十七セント'],
    ],
    notes: {
      'One dollar and eighty-seven cents.': '最初の文と同じ言葉をくり返して、どうしようもない現実を示しています。',
    },
  }),
  // 7
  ls('[接 And] [S the next day] [V would be] [C Christmas].', {
    ja: 'そして、あしたはクリスマスだった。',
    chunks: [
      ['And the next day would be Christmas.', 'そして、あしたはクリスマスだった'],
    ],
    notes: {
      'And the next day would be Christmas.': 'would be は、過去から見た未来「〜になる」を表します。',
    },
  }),
  // 8
  ls('[M There] [V was] [M clearly] [S nothing {to:形容詞>nothing| [V to do]} {前| but {並列| {原形| [V flop down] [M {前| on the shabby little couch}]} | and {原形| [V howl]}}}].', {
    p: true,
    ja: 'みすぼらしい小さな長いすに身を投げだして、わんわん泣くよりほかに、することはどう見てもなかった。',
    chunks: [
      ['There was clearly nothing to do but flop down', 'どさっと倒れこむよりほかに、することはどう見てもなかった'],
      ['on the shabby little couch and howl.', 'みすぼらしい小さな長いすに。そして、わんわん泣くより'],
    ],
    notes: {
      'There was clearly nothing to do but flop down': 'nothing to do but do で「〜するよりほかにすることがない」。but は「〜以外に」で、後ろは to のない不定詞です。flop down は「どさっと倒れこむ」。',
      'on the shabby little couch and howl.': 'shabby は「みすぼらしい」、couch は「長いす」。howl は「わんわん泣く」。',
    },
  }),
  // 9
  ls('[接 So] [S Della] [V did] [O it].', {
    ja: 'だから、デラはそうした。',
    chunks: [
      ['So Della did it.', 'だから、デラはそうした'],
    ],
    notes: {
      'So Della did it.': 'did it は「（倒れこんで泣くことを）した」。',
    },
  }),
  // 10
  ls('[S Which] [V instigates] [O the moral reflection {同格that>the moral reflection| [接 that] [S life] [V is made up] [M {前| of {並列| sobs, | sniffles, | and smiles}}], [M {前| with sniffles {現在分詞>sniffles| [V predominating]}}]}].', {
    ja: 'そこで、人生とは、しゃくり泣きと、すすり泣きと、ほほえみでできていて、中でもすすり泣きがいちばん多い、という教訓めいた考えが浮かんでくる。',
    chunks: [
      ['Which instigates the moral reflection', 'そしてそのことが、教訓めいた考えを呼び起こす'],
      ['that life is made up of sobs, sniffles, and smiles,', '人生はしゃくり泣きと、すすり泣きと、ほほえみでできていて'],
      ['with sniffles predominating.', 'すすり泣きがいちばん多い、という（考えを）'],
    ],
    notes: {
      'Which instigates the moral reflection': 'Which は、デラが泣いたという前の内容を受けて「そしてそのことが」と続ける関係代名詞です。instigate は「引き起こす」、moral reflection は「教訓めいた考え」。',
      'that life is made up of sobs, sniffles, and smiles,': 'that 以下は reflection の中身を表す同格の節です。be made up of A で「A でできている」。sob は「しゃくり泣き」、sniffle は「すすり泣き・鼻をすすること」。',
      'with sniffles predominating.': 'with A doing で「A が〜していて」。predominate は「いちばん多い・優勢である」。',
    },
  }),
  // 11
  ls('[M {副詞節:時| [接 While] [S the mistress {前| of the home}] [V is] [M gradually] [V subsiding] [M {前| from the first stage}] [M {前| to the second}]}], [V take] [O a look] [M {前| at the home}].', {
    p: true,
    ja: 'この家の奥さんが、最初の段階から二番めの段階へと少しずつ落ちついていくあいだに、この家を見てみよう。',
    chunks: [
      ['While the mistress of the home is gradually subsiding', 'この家の奥さんが少しずつ落ちついていくあいだに'],
      ['from the first stage to the second,', '最初の段階から二番めの段階へと'],
      ['take a look at the home.', 'この家を見てみよう'],
    ],
    notes: {
      'While the mistress of the home is gradually subsiding': 'mistress of the home は「家の女主人・奥さん」。subside は「（泣き声などが）おさまる」。',
      'from the first stage to the second,': 'the first stage は大泣き、the second はすすり泣きの段階のことです。',
      'take a look at the home.': 'take a look at A で「A を見てみる」。語り手が読者に呼びかける命令文です。',
    },
  }),
  // 12
  ls('[独 A furnished flat {前| at $8 {前| per week}}].', {
    fragment: true,
    ja: '家具つきの部屋で、週八ドル。',
    chunks: [
      ['A furnished flat at $8 per week.', '週八ドルの家具つきの部屋'],
    ],
    notes: {
      'A furnished flat at $8 per week.': '動詞のない文です。flat は「アパートの一室」。per week は「一週間につき」。',
    },
  }),
  // 13
  ls('[S It] [V did not] [M exactly] [V beggar] [O description], [接 but] [S it] [M certainly] [V had] [O that word] [M {前| on the lookout {前| for the mendicancy squad}}].', {
    ja: '言葉にできないほどみすぼらしい、というわけではなかったが、たしかに「物ごい」という言葉が、物ごい取りしまり隊を警戒しているような部屋だった。',
    chunks: [
      ['It did not exactly beggar description,', '言葉にできないほど、というわけではなかった'],
      ['but it certainly had that word on the lookout', 'けれど、たしかにその言葉に警戒させていた'],
      ['for the mendicancy squad.', '物ごい取りしまり隊を'],
    ],
    notes: {
      'It did not exactly beggar description,': 'beggar description は「言葉で言い表せない（ほどひどい）」という決まった言い方です。not exactly は「必ずしも〜ではない」。',
      'but it certainly had that word on the lookout': 'that word は beggar（物ごい）という言葉のことです。on the lookout for A で「A を見張って・警戒して」。',
      'for the mendicancy squad.': 'mendicancy squad は「物ごいを取りしまる警官隊」。「物ごい」という言葉が警官隊を警戒するほど、この部屋はみすぼらしい、というしゃれです。',
    },
  }),
  // 14
  ls('[M {前| In the vestibule {形容詞>the vestibule| below}}] [V was] [S {並列| a letter-box {関係>a letter-box| [M {前| into which}] [S no letter] [V would go]}, | and an electric button {関係>an electric button| [M {前| from which}] [S no mortal finger] [V could coax] [O a ring]}}].', {
    p: true,
    ja: '階下の玄関には、手紙の一通も入りそうにない郵便受けと、人間の指ではどうやっても鳴らせそうにない呼びりんのボタンがあった。',
    chunks: [
      ['In the vestibule below was a letter-box', '階下の玄関には郵便受けがあった'],
      ['into which no letter would go,', 'どんな手紙も入りそうにない（郵便受けが）'],
      ['and an electric button', 'そして呼びりんのボタンが'],
      ['from which no mortal finger could coax a ring.', '人間の指ではどうやっても鳴らせそうにない（ボタンが）'],
    ],
    notes: {
      'In the vestibule below was a letter-box': 'In the vestibule below を文の頭に出した倒置で、was のあとに主語 a letter-box と an electric button が並んでいます。vestibule は「玄関」。',
      'into which no letter would go,': 'into which は「その中へ」で、which は a letter-box を指します。would は「どうしても〜しようとしない」という意味で使われています。',
      'and an electric button': 'electric button は呼びりんのボタンです。',
      'from which no mortal finger could coax a ring.': 'from which は「そこから」。coax は「なだめて〜させる」で、coax a ring は「なんとか鳴らす」。mortal は「人間の」。こわれていて鳴らない、ということです。',
    },
  }),
  // 15
  ls('[M Also] [C {現在分詞:補語| [V appertaining] [M thereunto]}] [V was] [S a card {現在分詞>a card| [V bearing] [O the name “Mr. James Dillingham Young.”]}]', {
    ja: 'そのうえ、そこには「ミスター・ジェームズ・ディリングハム・ヤング」と書いた名札がついていた。',
    chunks: [
      ['Also appertaining thereunto was a card', 'そのうえ、それには名札がついていた'],
      ['bearing the name “Mr. James Dillingham Young.”', '「ミスター・ジェームズ・ディリングハム・ヤング」という名前を記した'],
    ],
    notes: {
      'Also appertaining thereunto was a card': 'appertain thereunto は「それに付属する」という、わざと大げさにした古い言い方です。appertaining thereunto（それに付いている）を前に出し、was が主語 a card の前に来ています。',
      'bearing the name “Mr. James Dillingham Young.”': 'bearing … が a card を後ろから説明し、「〜という名前が書かれた名札」。bear はここでは「（文字などを）記している」。',
    },
  }),
  // 16
  ls('[S The “Dillingham”] [V had been flung] [M {前| to the breeze}] [M {前| during a former period {前| of prosperity} {関係>a former period of prosperity| [M when] [S its possessor] [V was being paid] [O $30 {前| per week}]}}].', {
    p: true,
    ja: 'この「ディリングハム」という名前は、持ち主が週に三十ドルもらっていた、以前の景気のいいころに、堂々と風になびかせたものだった。',
    chunks: [
      ['The “Dillingham” had been flung to the breeze', 'この「ディリングハム」は、堂々と風になびかせたものだった'],
      ['during a former period of prosperity', '以前の景気のいいころに'],
      ['when its possessor was being paid $30 per week.', 'その持ち主が週に三十ドルもらっていたころに'],
    ],
    notes: {
      'The “Dillingham” had been flung to the breeze': 'fling A to the breeze は「A を風になびかせる（旗をかかげる）」から、「堂々と見せる」。had been flung は過去完了の受け身です。',
      'during a former period of prosperity': 'former は「以前の」、prosperity は「景気のよさ・豊かさ」。',
      'when its possessor was being paid $30 per week.': 'when は a former period of prosperity を説明する関係副詞です。possessor は「持ち主」。was being paid は過去進行形の受け身で「支払われていた」。',
    },
  }),
  // 17
  ls('[M Now], [M {副詞節:時| [接 when] [S the income] [V was shrunk] [M {前| to $20}]}], [M though], [S they] [V were thinking] [M seriously] [M {前| of {動名詞| [V contracting] [M {前| to a {並列| modest | and unassuming} D}]}}].', {
    ja: 'ところが今、収入が二十ドルに減ってしまったので、二人は、ひかえめで目立たない「Ｄ」一文字にちぢめようかと、まじめに考えていた。',
    chunks: [
      ['Now, when the income was shrunk to $20, though,', 'ところが今、収入が二十ドルに減ってしまったので'],
      ['they were thinking seriously of contracting', '二人は、ちぢめようかとまじめに考えていた'],
      ['to a modest and unassuming D.', 'ひかえめで目立たない「Ｄ」一文字に'],
    ],
    notes: {
      'Now, when the income was shrunk to $20, though,': 'shrink は「縮む・減る」。though は文の途中に入れて「けれども」。',
      'they were thinking seriously of contracting': 'think of doing で「〜しようかと考える」。contract は「縮める」。',
      'to a modest and unassuming D.': 'modest は「ひかえめな」、unassuming は「出しゃばらない」。長い名前 Dillingham を頭文字 D だけにしようというのです。',
    },
  }),
  // 18
  ls('[接 But] [M {副詞節:時| [接 whenever] [S Mr. James Dillingham Young] [V came] [M home] [接 and] [V reached] [O his flat {形容詞>his flat| above}]}] [S he] [V was called] [C “Jim”] [接 and] [M greatly] [V hugged] [M {前| by Mrs. James Dillingham Young, {過去分詞>Mrs. James Dillingham Young| [M already] [V introduced] [M {前| to you}] [M {前| as Della}]}}].', {
    ja: 'けれども、ジェームズ・ディリングハム・ヤング氏が帰ってきて、上の部屋にたどり着くと、いつでも「ジム」と呼ばれて、ジェームズ・ディリングハム・ヤング夫人、つまり、すでにデラとしてご紹介した人に、ぎゅっと抱きしめられるのだった。',
    chunks: [
      ['But whenever Mr. James Dillingham Young came home', 'けれども、ジェームズ・ディリングハム・ヤング氏が帰ってきて'],
      ['and reached his flat above', '上の部屋にたどり着くと、いつでも'],
      ['he was called “Jim” and greatly hugged', '彼は「ジム」と呼ばれて、ぎゅっと抱きしめられた'],
      ['by Mrs. James Dillingham Young,', 'ジェームズ・ディリングハム・ヤング夫人に'],
      ['already introduced to you as Della.', 'すでにデラとしてご紹介した（夫人に）'],
    ],
    notes: {
      'But whenever Mr. James Dillingham Young came home': 'whenever は「〜するときはいつでも」。',
      'and reached his flat above': 'his flat above は「上の階の自分の部屋」。',
      'he was called “Jim” and greatly hugged': 'was called と (was) greatly hugged が並んでいます。家では長い名前ではなく、Jim と呼ばれるのです。',
      'already introduced to you as Della.': 'introduced … が Mrs. James Dillingham Young を後ろから説明し、「すでにデラとして紹介した」。語り手が読者に話しかけています。',
    },
  }),
  // 19
  ls('[S Which] [V is] [M all] [C very good].', {
    ja: 'それは、まことにけっこうなことである。',
    chunks: [
      ['Which is all very good.', 'そしてそれは、まことにけっこうなことだ'],
    ],
    notes: {
      'Which is all very good.': 'Which は前の内容（家ではジムと呼ばれ、抱きしめられること）を受けて「そしてそれは」と続けます。',
    },
  }),
  // 20
  ls('[S Della] [V finished] [O her cry] [接 and] [V attended to] [O her cheeks] [M {前| with the powder rag}].', {
    p: true,
    ja: 'デラは泣きやむと、おしろいのパフでほおの手入れをした。',
    chunks: [
      ['Della finished her cry and attended to her cheeks', 'デラは泣きやんで、ほおの手入れをした'],
      ['with the powder rag.', 'おしろいのパフで'],
    ],
    notes: {
      'Della finished her cry and attended to her cheeks': 'finish one’s cry は「泣き終える」。attend to A で「A の手入れをする」。',
      'with the powder rag.': 'powder rag は「おしろいのパフ（布）」です。',
    },
  }),
  // 21
  ls('[S She] [V stood] [M {前| by the window}] [接 and] [V looked out] [M dully] [M {前| at a gray cat {現在分詞>a gray cat| [V walking] [O a gray fence] [M {前| in a gray backyard}]}}].', {
    ja: '窓のそばに立って、灰色の裏庭の灰色の塀の上を歩いていく灰色の猫を、ぼんやりとながめた。',
    chunks: [
      ['She stood by the window and looked out dully', '彼女は窓のそばに立って、ぼんやりと外をながめた'],
      ['at a gray cat walking a gray fence in a gray backyard.', '灰色の裏庭で、灰色の塀の上を歩く灰色の猫を'],
    ],
    notes: {
      'She stood by the window and looked out dully': 'stood と looked out が並んでいます。dully は「ぼんやりと・どんよりと」。',
      'at a gray cat walking a gray fence in a gray backyard.': 'walking … が a gray cat を後ろから説明します。gray を3回くり返して、デラの沈んだ気分を表しています。',
    },
  }),
  // 22
  ls('[S Tomorrow] [V would be] [C Christmas Day], [接 and] [S she] [V had] [O only $1.87 {関係>only $1.87| [M {前| with which}] [V to buy] [O1 Jim] [O2 a present]}].', {
    ja: 'あしたはクリスマスだというのに、ジムへの贈り物を買うお金が、たった一ドル八十七セントしかないのだ。',
    chunks: [
      ['Tomorrow would be Christmas Day,', 'あしたはクリスマスだった'],
      ['and she had only $1.87 with which to buy Jim a present.', 'そしてジムに贈り物を買うお金は、たった一ドル八十七セントしかなかった'],
    ],
    notes: {
      'Tomorrow would be Christmas Day,': 'would be は、過去から見た未来を表します。',
      'and she had only $1.87 with which to buy Jim a present.': 'with which to buy Jim a present は「それでジムに贈り物を買うための」。前置詞＋関係代名詞のあとに to不定詞が続く形で、$1.87 を後ろから説明します。buy A B で「A に B を買う」。',
    },
  }),
  // 23
  ls('[S She] [V had been saving] [O every penny {関係省略:目的格>every penny| [S she] [V could]}] [M {前| for months}], [M {前| with this result}].', {
    ja: '何か月も前から、ためられる一セントは残らずためてきたのに、結果はこれだった。',
    chunks: [
      ['She had been saving every penny she could for months,', '何か月も、ためられる一セントは残らずためてきた'],
      ['with this result.', 'その結果がこれだった'],
    ],
    notes: {
      'She had been saving every penny she could for months,': 'had been saving は過去完了進行形で「（それまで）ずっとためてきた」。every penny she could は「ためられる1セントは残らず」で、could のあとに save が省かれています。',
      'with this result.': 'with this result は「その結果がこれ」。',
    },
  }),
  // 24
  ls('[S Twenty dollars a week] [V doesn’t go] [M far].', {
    ja: '週に二十ドルでは、たいしたことはできない。',
    chunks: [
      ['Twenty dollars a week doesn’t go far.', '週に二十ドルでは、たいしてもたない'],
    ],
    notes: {
      'Twenty dollars a week doesn’t go far.': 'a week は「一週につき」。go far は「（お金が）長くもつ・役に立つ」。',
    },
  }),
  // 25
  ls('[S Expenses] [V had been] [C greater {副詞節:比較| [接 than] [S she] [V had calculated]}].', {
    ja: '出費は、デラが見積もっていたより多かった。',
    chunks: [
      ['Expenses had been greater than she had calculated.', '出費は、彼女が見積もっていたより多かった'],
    ],
    notes: {
      'Expenses had been greater than she had calculated.': 'greater than … で「…より大きい」。calculate は「計算する・見積もる」。',
    },
  }),
  // 26
  ls('[S They] [M always] [V are].', {
    ja: '出費というものは、いつだってそうなのだ。',
    chunks: [
      ['They always are.', 'いつだってそうなのだ'],
    ],
    notes: {
      'They always are.': 'are のあとに greater than calculated（見積もりより多い）が省かれています。語り手のひとことです。',
    },
  }),
  // 27
  ls('[独 Only $1.87 {to:形容詞>Only $1.87| [V to buy] [O a present] [M {前| for Jim}]}].', {
    fragment: true,
    ja: 'ジムへの贈り物を買うのに、たった一ドル八十七セント。',
    chunks: [
      ['Only $1.87 to buy a present for Jim.', 'ジムへの贈り物を買うのに、たった一ドル八十七セント'],
    ],
    notes: {
      'Only $1.87 to buy a present for Jim.': '動詞のない文です。to buy … が $1.87 を後ろから説明します。',
    },
  }),
  // 28
  ls('[独 Her Jim].', {
    fragment: true,
    ja: 'デラの、大切なジムなのに。',
    chunks: [
      ['Her Jim.', '彼女の、大切なジム'],
    ],
    notes: {
      'Her Jim.': '動詞のない文で、デラにとってジムがどれほど大切かを表します。',
    },
  }),
  // 29
  ls('[O Many a happy hour] [S she] [V had spent] [M {分詞構文:付帯状況| [V planning] [M {前| for something nice {前| for him}}]}].', {
    ja: 'ジムに何かすてきなものをと考えて、楽しい時間を何時間すごしたことだろう。',
    chunks: [
      ['Many a happy hour she had spent planning', '楽しい時間を何時間も、彼女は考えて過ごしてきた'],
      ['for something nice for him.', 'ジムのための何かすてきなものを'],
    ],
    notes: {
      'Many a happy hour she had spent planning': 'many a＋単数名詞で「たくさんの〜」。Many a happy hour（楽しい時間をいくつも）を文の頭に出して強めています。spend A doing で「〜して A（時間）を過ごす」。',
      'for something nice for him.': 'plan for A で「A のことを考えて計画する」。something nice は「何かすてきなもの」。',
    },
  }),
  // 30
  ls('[独 Something {形容詞>Something| {並列| fine | and rare | and sterling}}] — [独 something {形容詞>something| just a little bit near {前| to {動名詞| [V being] [C worthy {前| of the honor {前| of {動名詞| [V being owned] [M {前| by Jim}]}}}]}}}].', {
    fragment: true,
    ja: 'すてきで、めずらしくて、本物の何か——ジムに持ってもらえる名誉に、ほんの少しでもふさわしいような何か。',
    chunks: [
      ['Something fine and rare and sterling —', 'すてきで、めずらしくて、本物の何か——'],
      ['something just a little bit near to being worthy', 'ほんの少しでもふさわしいのに近い何か'],
      ['of the honor of being owned by Jim.', 'ジムに持ってもらえるという名誉に'],
    ],
    marks: [
      ['—', 'ダッシュで、「すてきで、めずらしく、本物のもの」を、「ジムの持ち物になる名誉に少しでもふさわしいもの」と言いかえて、どんな贈り物がほしいのかをくわしくします。'],
    ],
    notes: {
      'Something fine and rare and sterling —': '動詞のない文です。形容詞 fine・rare・sterling が Something を後ろから説明します。sterling は「本物の・純銀の」。',
      'something just a little bit near to being worthy': 'near to doing で「〜に近い」。be worthy of A で「A にふさわしい」。',
      'of the honor of being owned by Jim.': 'the honor of being owned by Jim は「ジムに持ってもらえるという名誉」。being owned は受け身の動名詞です。',
    },
  }),
  // 31
  ls('[M There] [V was] [S a pier glass] [M {前| between the windows {前| of the room}}].', {
    p: true,
    ja: '部屋の窓と窓のあいだには、細長い壁かけの鏡があった。',
    chunks: [
      ['There was a pier glass between the windows of the room.', '部屋の窓と窓のあいだには、細長い壁かけの鏡があった'],
    ],
    notes: {
      'There was a pier glass between the windows of the room.': 'pier glass は、窓と窓のあいだの壁にかける細長い鏡です。',
    },
  }),
  // 32
  ls('[M Perhaps] [S you] [V have seen] [O a pier glass] [M {前| in an $8 flat}].', {
    ja: '週八ドルの部屋にある壁かけ鏡を、見たことがあるかもしれない。',
    chunks: [
      ['Perhaps you have seen a pier glass in an $8 flat.', 'ひょっとすると、週八ドルの部屋の壁かけ鏡を見たことがあるかもしれない'],
    ],
    notes: {
      'Perhaps you have seen a pier glass in an $8 flat.': 'have seen は現在完了で「見たことがある」。語り手が読者に話しかけています。an $8 flat は「週八ドルの部屋」で、$8 は eight dollars と読むので an を使います。',
    },
  }),
  // 33
  ls('[S A {並列| very thin | and very agile} person] [V may], [M {前| by {動名詞| [V observing] [O his reflection] [M {前| in a rapid sequence {前| of longitudinal strips}}]}}], [V obtain] [O a fairly accurate conception {前| of his looks}].', {
    ja: 'とてもやせていて、とても身のこなしの軽い人なら、細長い縦の帯に分かれて映る自分の姿を、すばやく順番に見ていくことで、自分の顔かたちを、かなり正確に知ることができる。',
    chunks: [
      ['A very thin and very agile person may,', 'とてもやせていて、とても身軽な人なら'],
      ['by observing his reflection', '映った自分の姿を見ることで'],
      ['in a rapid sequence of longitudinal strips,', '細長い縦の帯に分かれて、すばやく続く（姿を）'],
      ['obtain a fairly accurate conception of his looks.', '自分の顔かたちを、かなり正確につかむことができる'],
    ],
    notes: {
      'A very thin and very agile person may,': 'agile は「身のこなしの軽い」。助動詞 may と動詞 obtain の間に、by … の句がはさまっています。',
      'by observing his reflection': 'by doing で「〜することによって」。reflection は「（鏡に）映った姿」。',
      'in a rapid sequence of longitudinal strips,': 'a rapid sequence of A で「すばやく続く A」。longitudinal strips は「縦に細長い帯」。細い鏡なので、体を動かしながら少しずつ見るのです。',
      'obtain a fairly accurate conception of his looks.': 'obtain a conception of A で「A について考えをつかむ」。looks は「顔かたち・容姿」。安い部屋の鏡をからかう、大げさな言い方です。',
    },
  }),
  // 34
  ls('[S Della], [M {分詞構文:理由| [V being] [C slender]}], [V had mastered] [O the art].', {
    ja: 'デラはほっそりしていたので、そのこつを身につけていた。',
    chunks: [
      ['Della, being slender, had mastered the art.', 'デラはほっそりしていたので、そのこつを身につけていた'],
    ],
    notes: {
      'Della, being slender, had mastered the art.': 'being slender は分詞構文で「ほっそりしているので」。master は「身につける・習得する」。the art は「（細い鏡で自分を見る）こつ」。',
    },
  }),
  // 35
  ls('[M Suddenly] [S she] [V whirled] [M {前| from the window}] [接 and] [V stood] [M {前| before the glass}].', {
    p: true,
    ja: '突然、デラは窓からくるりとふり向いて、鏡の前に立った。',
    chunks: [
      ['Suddenly she whirled from the window and stood before the glass.', '突然、彼女は窓からくるりとふり向いて、鏡の前に立った'],
    ],
    notes: {
      'Suddenly she whirled from the window and stood before the glass.': 'whirl は「くるりと回る」。glass はここでは「鏡」のことです。',
    },
  }),
  // 36
  ls('[S Her eyes] [V were shining] [M brilliantly], [接 but] [S her face] [V had lost] [O its color] [M {前| within twenty seconds}].', {
    ja: '目はきらきらと輝いていたが、顔は二十秒もしないうちに血の気を失っていた。',
    chunks: [
      ['Her eyes were shining brilliantly,', '目はきらきらと輝いていた'],
      ['but her face had lost its color within twenty seconds.', 'けれど顔は二十秒もしないうちに血の気を失っていた'],
    ],
    notes: {
      'Her eyes were shining brilliantly,': 'brilliantly は「きらきらと」。',
      'but her face had lost its color within twenty seconds.': 'lose one’s color で「顔が青ざめる」。within A で「A 以内に」。何かを決心したことが表れています。',
    },
  }),
  // 37
  ls('[M Rapidly] [S she] [V pulled down] [O her hair] [接 and] [V let] [O it] [C {原形| [V fall] [M {前| to its full length}]}].', {
    ja: 'すばやく髪をほどいて、長い髪をいっぱいに垂らした。',
    chunks: [
      ['Rapidly she pulled down her hair', 'すばやく、彼女は髪をほどいた'],
      ['and let it fall to its full length.', 'そして、髪をいっぱいの長さまで垂らした'],
    ],
    notes: {
      'Rapidly she pulled down her hair': 'pull down A はここでは「（結った髪を）ほどく」。',
      'and let it fall to its full length.': 'let A do で「A が〜するままにする」。to its full length は「いっぱいの長さまで」。',
    },
  }),
  // 38
  ls('[M Now], [M there] [V were] [S two possessions {前| of the James Dillingham Youngs} {関係>two possessions| [M {前| in which}] [S they] [M both] [V took] [O a mighty pride]}].', {
    p: true,
    ja: 'さて、ジェームズ・ディリングハム・ヤング夫妻には、二人ともたいへんな自慢にしている持ち物が二つあった。',
    chunks: [
      ['Now, there were two possessions of the James Dillingham Youngs', 'さて、ジェームズ・ディリングハム・ヤング夫妻には、持ち物が二つあった'],
      ['in which they both took a mighty pride.', '二人ともたいへんな自慢にしている（持ち物が）'],
    ],
    notes: {
      'Now, there were two possessions of the James Dillingham Youngs': 'possession は「持ち物」。the James Dillingham Youngs は「ジェームズ・ディリングハム・ヤング家（夫妻）」で、the＋名字の複数形で「〜家の人々」。',
      'in which they both took a mighty pride.': 'take pride in A で「A を自慢にする」。in which の which が two possessions を指します。mighty は「たいへんな」。',
    },
  }),
  // 39
  ls('[S One] [V was] [C Jim’s gold watch {関係>Jim’s gold watch| [S that] [V had been] [C {並列| his father’s | and his grandfather’s}]}].', {
    ja: '一つは、父親から、そのまた父親から受けついだ、ジムの金の懐中時計。',
    chunks: [
      ['One was Jim’s gold watch that had been his father’s', '一つはジムの金の懐中時計で、それは父親のものだった'],
      ['and his grandfather’s.', 'そして祖父のものだった'],
    ],
    notes: {
      'One was Jim’s gold watch that had been his father’s': 'that は Jim’s gold watch を説明する関係代名詞。his father’s は「父親のもの」。',
      'and his grandfather’s.': '父から祖父へ、代々受けつがれてきた時計だということです。',
    },
  }),
  // 40
  ls('[S The other] [V was] [C Della’s hair].', {
    ja: 'もう一つは、デラの髪だった。',
    chunks: [
      ['The other was Della’s hair.', 'もう一つはデラの髪だった'],
    ],
    notes: {
      'The other was Della’s hair.': 'one … the other ～ で「（2つのうち）一つは…、もう一つは～」。',
    },
  }),
  // 41
  ls('[M {副詞節:条件| [V Had] [S the queen {前| of Sheba}] [V lived] [M {前| in the flat {前| across the airshaft}}]}], [S Della] [V would have let] [O her hair] [C {原形| [V hang] [M {成句| out the window}]}] [M some day] [M {to:副詞(目的)| [V to dry]}] [M just {to:副詞(目的)| [V to depreciate] [O {並列| Her Majesty’s jewels | and gifts}]}].', {
    ja: 'もしシバの女王が通風孔の向かいの部屋に住んでいたら、デラは、女王陛下の宝石や贈り物の値打ちを下げてやるためだけに、いつか髪を窓の外へ垂らして乾かしたことだろう。',
    chunks: [
      ['Had the queen of Sheba lived in the flat across the airshaft,', 'もしシバの女王が通風孔の向かいの部屋に住んでいたら'],
      ['Della would have let her hair hang out the window', 'デラは髪を窓の外へ垂らしたことだろう'],
      ['some day to dry', 'いつか、乾かすために'],
      ['just to depreciate Her Majesty’s jewels and gifts.', '女王陛下の宝石や贈り物の値打ちを下げてやるためだけに'],
    ],
    notes: {
      'Had the queen of Sheba lived in the flat across the airshaft,': 'Had the queen of Sheba lived … は If the queen of Sheba had lived … の if を省き、had を前に出した形です（仮定法過去完了）。シバの女王は、宝物で有名な古代の女王です。airshaft は建物の間の通風孔（吹きぬけ）。',
      'Della would have let her hair hang out the window': 'would have let は「〜させただろう」。let A do で「A を〜させておく」。hang out the window は「窓の外へ垂れる」。',
      'some day to dry': 'some day は「いつか」。to dry は「乾かすために」。',
      'just to depreciate Her Majesty’s jewels and gifts.': 'depreciate は「値打ちを下げる」。Her Majesty は「女王陛下」。デラの髪が女王の宝物よりすばらしい、ということを大げさに言っています。',
    },
  }),
  // 42
  ls('[M {副詞節:条件| [V Had] [S King Solomon] [V been] [C the janitor], [M {前| with all his treasures {過去分詞>all his treasures| [V piled up] [M {前| in the basement}]}}]}], [S Jim] [V would have pulled out] [O his watch] [M {副詞節:時| [接 every time] [S he] [V passed]}], [M just {to:副詞(目的)| [V to see] [O him] [C {原形| [V pluck] [M {前| at his beard}] [M {前| from envy}]}]}].', {
    ja: 'もしソロモン王が、地下室に宝物を山と積みあげたこのアパートの管理人だったら、ジムは、王がうらやましさにあごひげをかきむしるのを見てやるためだけに、そばを通るたびに懐中時計を取り出したことだろう。',
    chunks: [
      ['Had King Solomon been the janitor,', 'もしソロモン王が管理人だったら'],
      ['with all his treasures piled up in the basement,', '宝物を残らず地下室に積みあげて'],
      ['Jim would have pulled out his watch every time he passed,', 'ジムは、そばを通るたびに懐中時計を取り出しただろう'],
      ['just to see him pluck at his beard from envy.', '王がうらやましさにあごひげをかきむしるのを見るためだけに'],
    ],
    notes: {
      'Had King Solomon been the janitor,': 'Had King Solomon been … は If King Solomon had been … の if を省いた形です。ソロモン王は、ばく大な富で有名な古代の王です。janitor は建物の管理人。',
      'with all his treasures piled up in the basement,': 'with A done で「A が〜された状態で」。pile up は「積みあげる」、basement は「地下室」。',
      'Jim would have pulled out his watch every time he passed,': 'pull out A で「A を取り出す」。every time … は「〜するたびに」という接続詞のはたらきをします。',
      'just to see him pluck at his beard from envy.': 'see A do で「A が〜するのを見る」。pluck at one’s beard は「あごひげをひっぱる」、from envy は「うらやましさから」。',
    },
  }),
  // 43
  ls('[接 So] [M now] [S Della’s beautiful hair] [V fell] [M {前| about her}] [M {分詞構文:付帯状況| [V rippling] [接 and] [V shining] [M {前| like a cascade {前| of brown waters}}]}].', {
    p: true,
    ja: 'さて今、デラの美しい髪は、茶色の水の滝のように波うち、輝きながら、体のまわりに垂れさがっていた。',
    chunks: [
      ['So now Della’s beautiful hair fell about her', 'さて今、デラの美しい髪は、体のまわりに垂れていた'],
      ['rippling and shining like a cascade of brown waters.', '茶色の水の滝のように、波うち、輝きながら'],
    ],
    notes: {
      'So now Della’s beautiful hair fell about her': 'fall about A で「A のまわりに垂れる」。',
      'rippling and shining like a cascade of brown waters.': 'rippling と shining が並ぶ分詞構文で「波うち、輝きながら」。cascade は「小さな滝」。',
    },
  }),
  // 44
  ls('[S It] [V reached] [M {前| below her knee}] [接 and] [V made] [O itself] [C almost a garment {前| for her}].', {
    ja: '髪はひざの下までとどき、まるでデラの着物のようになった。',
    chunks: [
      ['It reached below her knee', '髪はひざの下までとどいた'],
      ['and made itself almost a garment for her.', 'そして、ほとんどデラの衣服のようになった'],
    ],
    notes: {
      'It reached below her knee': 'reach は「とどく」。below は「〜より下に」。',
      'and made itself almost a garment for her.': 'make A B で「A を B にする」。made itself almost a garment は「ほとんど衣服のようになった」。garment は「衣服」。',
    },
  }),
  // 45
  ls('[接 And] [M then] [S she] [V did] [O it] [M up] [M again] [M {並列| nervously | and quickly}].', {
    ja: 'それからデラは、そわそわしながら、急いでまた髪を結いあげた。',
    chunks: [
      ['And then she did it up again nervously and quickly.', 'それから、そわそわと急いで、また髪を結いあげた'],
    ],
    notes: {
      'And then she did it up again nervously and quickly.': 'do A up で「（髪を）結いあげる」。nervously は「そわそわと」。',
    },
  }),
  // 46
  ls('[M Once] [S she] [V faltered] [M {前| for a minute}] [接 and] [V stood] [C still] [M {副詞節:時| [接 while] [S {成句| a tear or two}] [V splashed] [M {前| on the worn red carpet}]}].', {
    ja: '一度だけ、デラはしばらくためらって、じっと立ちつくした。そのあいだに、涙がひとつぶ、ふたつぶ、すり切れた赤いじゅうたんに落ちた。',
    chunks: [
      ['Once she faltered for a minute and stood still', '一度だけ、彼女はしばらくためらって、じっと立ちつくした'],
      ['while a tear or two splashed on the worn red carpet.', 'そのあいだに、涙がひとつぶかふたつぶ、すり切れた赤いじゅうたんに落ちた'],
    ],
    notes: {
      'Once she faltered for a minute and stood still': 'falter は「ためらう・ぐらつく」。for a minute は「少しのあいだ」。stand still で「じっと立っている」。',
      'while a tear or two splashed on the worn red carpet.': 'a tear or two は「涙がひとつぶかふたつぶ」。splash は「ぽたりと落ちる」、worn は「すり切れた」。',
    },
  }),
  // 47
  ls('[M On] [V went] [S her old brown jacket]; [M on] [V went] [S her old brown hat].', {
    p: true,
    ja: '古い茶色の上着を着て、古い茶色の帽子をかぶった。',
    chunks: [
      ['On went her old brown jacket; on went her old brown hat.', '古い茶色の上着を着て、古い茶色の帽子をかぶった'],
    ],
    marks: [
      [';', 'セミコロンで、同じ形の2つの文（上着を着た、帽子をかぶった）を並べ、手早く身じたくをする様子を表します。'],
    ],
    notes: {
      'On went her old brown jacket; on went her old brown hat.': 'On went A は on（身につけて）を文の頭に出した倒置で、「A をさっと身につけた」。同じ形をくり返して、急いでいる様子を表します。',
    },
  }),
  // 48
  ls('[M {並列| {前| With a whirl {前| of skirts}} | and {前| with the brilliant sparkle {形容詞>the brilliant sparkle| still {前| in her eyes}}}}], [S she] [V fluttered] [M {並列| {成句| out the door} | and {前| down the stairs}}] [M {前| to the street}].', {
    ja: 'スカートをひるがえし、目にはまだきらきらした輝きを残したまま、デラはひらりと戸口を出て、階段をおり、通りへと向かった。',
    chunks: [
      ['With a whirl of skirts', 'スカートをひるがえし'],
      ['and with the brilliant sparkle still in her eyes,', '目にはまだきらきらした輝きを残したまま'],
      ['she fluttered out the door', '彼女はひらりと戸口を出た'],
      ['and down the stairs to the street.', 'そして階段をおりて、通りへ'],
    ],
    notes: {
      'With a whirl of skirts': 'a whirl of skirts は「スカートがくるりとひるがえること」。',
      'and with the brilliant sparkle still in her eyes,': 'with A in B で「A を B に残したまま」。sparkle は「輝き」。',
      'she fluttered out the door': 'flutter は「（鳥のように）ひらひらと動く」。out the door は「ドアから外へ」。',
      'and down the stairs to the street.': 'out the door と down the stairs が and で並び、to the street（通りへ）と続きます。',
    },
  }),
  // 49
  ls('[M {副詞節:場所| [接 Where] [S she] [V stopped]}] [S the sign] [V read]: [O {引用| “[独 Mme. Sofronie]. [独 Hair Goods {前| of All Kinds}].”}]', {
    p: true,
    ja: 'デラが立ちどまった店の看板には、「マダム・ソフロニー。かつら・毛髪製品一式」と書いてあった。',
    chunks: [
      ['Where she stopped the sign read:', '彼女が立ちどまった所の看板には、こう書いてあった'],
      ['“Mme. Sofronie. Hair Goods of All Kinds.”', '「マダム・ソフロニー。毛髪製品一式」'],
    ],
    marks: [
      [':', 'コロンで、「看板にはこう書いてあった」と前置きしてから、看板の文字そのものを示します。'],
    ],
    notes: {
      'Where she stopped the sign read:': 'Where she stopped は「彼女が立ちどまった所で」。read はここでは「（看板などに）〜と書いてある」。',
      '“Mme. Sofronie. Hair Goods of All Kinds.”': 'Mme. は Madame（マダム）を短くした書き方です。Hair Goods of All Kinds は「あらゆる種類の髪製品」。',
    },
  }),
  // 50
  ls('[M One flight up] [S Della] [V ran], [接 and] [V collected] [O herself], [M {分詞構文:付帯状況| [V panting]}].', {
    ja: 'デラは一階分の階段をかけあがると、はあはあ息をきらしながら、気をおちつけた。',
    chunks: [
      ['One flight up Della ran, and collected herself, panting.', '階段を一つ、デラはかけあがり、息をきらしながら気をおちつけた'],
    ],
    notes: {
      'One flight up Della ran, and collected herself, panting.': 'One flight up（階段を一つ上へ）を文の頭に出しています。flight は「ひと続きの階段」。collect oneself で「気をおちつける」。panting は分詞構文で「息をきらしながら」。',
    },
  }),
  // 51
  ls('[S Madame, {形容詞>Madame| large, too white, chilly},] [M hardly] [V looked] [C the “Sofronie.”]', {
    ja: 'マダムは大がらで、色が白すぎて、冷たい感じで、とても「ソフロニー」という名前には見えなかった。',
    chunks: [
      ['Madame, large, too white, chilly, hardly looked the “Sofronie.”', 'マダムは大がらで、白すぎ、冷たい感じで、「ソフロニー」らしくは見えなかった'],
    ],
    notes: {
      'Madame, large, too white, chilly, hardly looked the “Sofronie.”': 'large, too white, chilly が Madame を後ろから説明します。chilly は「冷たい・よそよそしい」。hardly は「ほとんど〜ない」。look the “Sofronie” は「『ソフロニー』らしく見える」。しゃれた名前と本人の感じが合わない、というおかしさです。',
    },
  }),
  // 52
  ls('[O {引用| “[V Will] [S you] [V buy] [O my hair]?”}] [V asked] [S Della].', {
    p: true,
    ja: '「わたしの髪を買っていただけますか」とデラはたずねた。',
    chunks: [
      ['“Will you buy my hair?” asked Della.', '「わたしの髪を買っていただけますか」とデラはたずねた'],
    ],
    notes: {
      '“Will you buy my hair?” asked Della.': 'Will you …? で「〜してくれますか」。',
    },
  }),
  // 53
  ls('[O {引用| “[S I] [V buy] [O hair],”}] [V said] [S Madame].', {
    p: true,
    ja: '「髪なら買うよ」とマダムは言った。',
    chunks: [
      ['“I buy hair,” said Madame.', '「髪なら買うよ」とマダムは言った'],
    ],
    notes: {
      '“I buy hair,” said Madame.': 'I buy hair は現在形で「（商売として）髪を買っている」。',
    },
  }),
  // 54
  ls('“[V Take] [O yer hat] [M off] [接 and] [V let][O ’s] [C {原形| [V have] [O a sight] [M {前| at the looks {前| of it}}]}].”', {
    ja: '「帽子をとって、どんな髪か見せてごらん」',
    chunks: [
      ['“Take yer hat off and let’s have a sight', '「帽子をとって、ちょっと見せてごらん'],
      ['at the looks of it.”', 'どんな髪か」'],
    ],
    notes: {
      '“Take yer hat off and let’s have a sight': 'yer は your のくだけた発音をそのまま書いたものです。let’s は let us の短縮形で「〜しよう」。have a sight at A は「A をちょっと見る」。',
      'at the looks of it.”': 'the looks of it は「その見た目」。',
    },
  }),
  // 55
  ls('[M Down] [V rippled] [S the brown cascade].', {
    p: true,
    ja: '茶色の滝が、さらさらと流れ落ちた。',
    chunks: [
      ['Down rippled the brown cascade.', '茶色の滝が、さらさらと流れ落ちた'],
    ],
    notes: {
      'Down rippled the brown cascade.': 'Down を文の頭に出して、動詞 rippled が主語 the brown cascade の前に来た倒置の形です。the brown cascade（茶色の滝）はデラの髪のことです。',
    },
  }),
  // 56
  ls('[O {引用| “[独 Twenty dollars],”}] [V said] [S Madame], [M {分詞構文:付帯状況| [V lifting] [O the mass] [M {前| with a practised hand}]}].', {
    p: true,
    ja: '「二十ドル」とマダムは、なれた手つきで髪のたばを持ちあげながら言った。',
    chunks: [
      ['“Twenty dollars,” said Madame,', '「二十ドル」とマダムは言った'],
      ['lifting the mass with a practised hand.', 'なれた手つきで髪のたばを持ちあげながら'],
    ],
    notes: {
      '“Twenty dollars,” said Madame,': '金額だけを言う、そっけない値づけです。',
      'lifting the mass with a practised hand.': 'lifting … は分詞構文で「持ちあげながら」。mass は「かたまり・たば」。practised は「なれた」（イギリスのつづり）。',
    },
  }),
  // 57
  ls('[O {引用| “[V Give] [O it] [M {前| to me}] [M quick],”}] [V said] [S Della].', {
    p: true,
    ja: '「早くください」とデラは言った。',
    chunks: [
      ['“Give it to me quick,” said Della.', '「早くください」とデラは言った'],
    ],
    notes: {
      '“Give it to me quick,” said Della.': 'Give it to me は「それ（二十ドル）をください」。quick は「早く」（quickly のくだけた言い方）。',
    },
  }),
  // 58
  ls('[独 Oh], [接 and] [S the next two hours] [V tripped by] [M {前| on rosy wings}].', {
    p: true,
    ja: 'ああ、それからの二時間は、ばら色のつばさに乗って、軽やかに過ぎていった。',
    chunks: [
      ['Oh, and the next two hours tripped by on rosy wings.', 'ああ、それからの二時間は、ばら色のつばさに乗って軽やかに過ぎていった'],
    ],
    notes: {
      'Oh, and the next two hours tripped by on rosy wings.': 'trip by は「軽い足どりで過ぎていく」。on rosy wings は「ばら色のつばさに乗って」。時間が楽しく過ぎたことを、たとえで表しています。',
    },
  }),
  // 59
  ls('[V Forget] [O the hashed metaphor].', {
    ja: 'このごちゃまぜのたとえは、忘れてください。',
    chunks: [
      ['Forget the hashed metaphor.', 'このごちゃまぜのたとえは忘れてください'],
    ],
    notes: {
      'Forget the hashed metaphor.': 'hashed は「ごちゃまぜの」、metaphor は「たとえ」。「足どり（tripped）」と「つばさ（wings）」をまぜてしまった、と語り手がおどけています。',
    },
  }),
  // 60
  ls('[S She] [V was ransacking] [O the stores] [M {前| for Jim’s present}].', {
    ja: 'デラは、ジムへの贈り物を探して、店という店をかき回していた。',
    chunks: [
      ['She was ransacking the stores for Jim’s present.', '彼女はジムへの贈り物を探して、店をくまなくかき回していた'],
    ],
    notes: {
      'She was ransacking the stores for Jim’s present.': 'ransack は「くまなく探し回る」。for A は「A を求めて」。',
    },
  }),
  // 61
  ls('[S She] [V found] [O it] [M {前| at last}].', {
    p: true,
    ja: 'とうとう、デラはそれを見つけた。',
    chunks: [
      ['She found it at last.', 'とうとう、彼女はそれを見つけた'],
    ],
    notes: {
      'She found it at last.': 'at last は「とうとう」。it は、ジムへの贈り物のことです。',
    },
  }),
  // 62
  ls('[S It] [M surely] [V had been made] [M {前| for {並列| Jim | and no one else}}].', {
    ja: 'それはまちがいなく、ほかの誰でもない、ジムのために作られたものだった。',
    chunks: [
      ['It surely had been made for Jim and no one else.', 'それはまちがいなく、ジムのためだけに作られたものだった'],
    ],
    notes: {
      'It surely had been made for Jim and no one else.': 'had been made は過去完了の受け身です。for Jim and no one else は「ジムのためで、ほかの誰のためでもない」。',
    },
  }),
  // 63
  ls('[M There] [V was] [S no other {前| like it}] [M {前| in any {前| of the stores}}], [接 and] [S she] [V had turned] [O all {前| of them}] [C {成句| inside out}].', {
    ja: 'それに似たものは、どの店にもなかった。店という店を、くまなく探し回ったのだから、まちがいない。',
    chunks: [
      ['There was no other like it in any of the stores,', 'それに似たものは、どの店にもなかった'],
      ['and she had turned all of them inside out.', 'そして彼女は、店という店をくまなく探し回っていた'],
    ],
    notes: {
      'There was no other like it in any of the stores,': 'no other like it は「それのようなほかの物は一つも（ない）」。',
      'and she had turned all of them inside out.': 'turn A inside out で「A を裏返す」から、「A をくまなく探す」。',
    },
  }),
  // 64
  ls('[S It] [V was] [C a platinum fob chain {形容詞>a platinum fob chain| {並列| simple | and chaste} {前| in design}}], [M {分詞構文:付帯状況| [M properly] [V proclaiming] [O its value] [M {並列| {前| by substance} alone | and not {前| by meretricious ornamentation}}]}] — [M {副詞節:様態| [接 as] [S all good things] [V should do]}].', {
    ja: 'それは、プラチナの懐中時計用の鎖で、デザインは簡素で上品、けばけばしい飾りではなく、素材そのものだけで値打ちをきちんと示していた——よい物はみな、そうあるべきなのだ。',
    chunks: [
      ['It was a platinum fob chain', 'それはプラチナの時計用の鎖だった'],
      ['simple and chaste in design,', 'デザインが簡素で上品な'],
      ['properly proclaiming its value by substance alone', '素材そのものだけで値打ちをきちんと示していて'],
      ['and not by meretricious ornamentation —', 'けばけばしい飾りによってではなく——'],
      ['as all good things should do.', 'よい物はみな、そうあるべきなのだ'],
    ],
    marks: [
      ['—', 'ダッシュで、鎖の説明のあとに、語り手の考え（よい物はみなそうあるべきだ）を付け足します。'],
    ],
    notes: {
      'It was a platinum fob chain': 'fob chain は懐中時計につける鎖。platinum は「プラチナ（白金）」。',
      'simple and chaste in design,': 'simple and chaste in design は a platinum fob chain を後ろから説明し、「デザインが簡素で上品な」。',
      'properly proclaiming its value by substance alone': 'proclaim は「はっきり示す」。by substance alone は「素材だけで」。',
      'and not by meretricious ornamentation —': 'meretricious は「けばけばしい・見かけだおしの」、ornamentation は「飾り」。',
      'as all good things should do.': 'as … should do で「…がそうするべきように」。do は「素材で値打ちを示す」ことを受けます。',
    },
  }),
  // 65
  ls('[S It] [V was] [M even] [C worthy {前| of The Watch}].', {
    ja: 'あの「時計」にさえ、ふさわしい品だった。',
    chunks: [
      ['It was even worthy of The Watch.', 'それはあの「時計」にさえふさわしかった'],
    ],
    notes: {
      'It was even worthy of The Watch.': 'be worthy of A で「A にふさわしい」。The Watch と大文字で書いて、ジムの大切な時計を特別なものとして強めています。',
    },
  }),
  // 66
  ls('[M {副詞節:時| [接 As soon as] [S she] [V saw] [O it]}] [S she] [V knew] [O {that節| [接 that] [S it] [V must be] [C Jim’s]}].', {
    ja: 'ひと目見たとたん、デラには、これこそジムのものだと分かった。',
    chunks: [
      ['As soon as she saw it she knew', '見たとたん、彼女には分かった'],
      ['that it must be Jim’s.', 'それはジムのものにちがいないと'],
    ],
    notes: {
      'As soon as she saw it she knew': 'as soon as … で「〜するとすぐに」。',
      'that it must be Jim’s.': 'must be は「〜にちがいない」。Jim’s は「ジムのもの」。',
    },
  }),
  // 67
  ls('[S It] [V was] [C {前| like him}].', {
    ja: 'それは、まるでジムそのものだった。',
    chunks: [
      ['It was like him.', 'それは彼らしかった'],
    ],
    notes: {
      'It was like him.': 'like A で「A に似ている・A らしい」。',
    },
  }),
  // 68
  ls('[独 {並列| Quietness | and value}] — [S the description] [V applied] [M {前| to both}].', {
    ja: '落ち着きと、値打ち——その言葉は、鎖にもジムにも当てはまった。',
    chunks: [
      ['Quietness and value — the description applied to both.', '落ち着きと値打ち——その言葉は両方に当てはまった'],
    ],
    marks: [
      ['—', 'ダッシュで、「落ち着きと値打ち」という言葉を先に出してから、それが鎖にもジムにも当てはまる、と説明を続けます。'],
    ],
    notes: {
      'Quietness and value — the description applied to both.': 'the description は「その言いあらわし（落ち着きと値打ち）」。apply to A で「A に当てはまる」。both は「鎖とジムの両方」です。',
    },
  }),
  // 69
  ls('[O Twenty-one dollars] [S they] [V took] [M {前| from her}] [M {前| for it}], [接 and] [S she] [V hurried] [M home] [M {前| with the 87 cents}].', {
    ja: '店はその鎖の代金に二十一ドルを受けとり、デラは残りの八十七セントを持って、急いで家に帰った。',
    chunks: [
      ['Twenty-one dollars they took from her for it,', '二十一ドルを、店は彼女からその代金に受けとった'],
      ['and she hurried home with the 87 cents.', 'そして彼女は八十七セントを持って、急いで家に帰った'],
    ],
    notes: {
      'Twenty-one dollars they took from her for it,': '目的語 Twenty-one dollars を文の頭に出しています。they は店の人たちです。',
      'and she hurried home with the 87 cents.': 'the 87 cents は「（残った）その八十七セント」。',
    },
  }),
  // 70
  ls('[M {前| With that chain {前| on his watch}}] [S Jim] [V might be] [M properly] [C anxious {前| about the time}] [M {前| in any company}].', {
    ja: 'この鎖を時計につければ、ジムはどんな人の前でも、堂々と時間を気にすることができるだろう。',
    chunks: [
      ['With that chain on his watch', 'この鎖を時計につけていれば'],
      ['Jim might be properly anxious about the time', 'ジムは堂々と時間を気にすることができるだろう'],
      ['in any company.', 'どんな人の前でも'],
    ],
    notes: {
      'With that chain on his watch': 'with A on B で「A を B につけていれば」。',
      'Jim might be properly anxious about the time': 'be anxious about the time は「時間を気にする」。properly は「ちゃんと・堂々と」。',
      'in any company.': 'in any company は「どんな人たちの前でも」。',
    },
  }),
  // 71
  ls('[M {副詞節:譲歩| [C Grand] [接 as] [S the watch] [V was]}], [S he] [M sometimes] [V looked] [M {前| at it}] [M {前| on the sly}] [M {前| on account of the old leather strap {関係>the old leather strap| [O that] [S he] [V used] [M {前| in place of a chain}]}}].', {
    ja: '時計はりっぱなものだったが、鎖の代わりに古い革ひもをつけていたので、ジムはときどき、こっそりと時計を見ることがあった。',
    chunks: [
      ['Grand as the watch was,', '時計はりっぱだったけれど'],
      ['he sometimes looked at it on the sly', '彼はときどき、こっそりとそれを見た'],
      ['on account of the old leather strap', '古い革ひものせいで'],
      ['that he used in place of a chain.', '鎖の代わりに使っていた（革ひもの）'],
    ],
    notes: {
      'Grand as the watch was,': '形容詞＋as＋主語＋動詞で「〜だけれども」。Grand as the watch was は「時計はりっぱだったけれども」。',
      'he sometimes looked at it on the sly': 'on the sly は「こっそりと」。',
      'on account of the old leather strap': 'on account of A で「A のせいで」。strap は「ひも・バンド」。',
      'that he used in place of a chain.': 'in place of A で「A の代わりに」。that は the old leather strap を説明する関係代名詞です。',
    },
  }),
  // 72
  ls('[M {副詞節:時| [接 When] [S Della] [V reached] [O home]}] [S her intoxication] [V gave way] [M a little] [M {前| to {並列| prudence | and reason}}].', {
    p: true,
    ja: '家に着くと、デラの浮かれた気分は少しおさまって、用心深さと分別が戻ってきた。',
    chunks: [
      ['When Della reached home her intoxication gave way a little', 'デラが家に着くと、浮かれた気分は少しおさまった'],
      ['to prudence and reason.', '用心深さと分別に（場所をゆずって）'],
    ],
    notes: {
      'When Della reached home her intoxication gave way a little': 'reach home で「家に着く」。intoxication は「酔ったような夢中の気分」。give way to A で「A に場所をゆずる」。',
      'to prudence and reason.': 'prudence は「用心深さ」、reason は「分別」。',
    },
  }),
  // 73
  ls('[S She] [V got out] [O her curling irons] [接 and] [V lighted] [O the gas] [接 and] [V went] [M {前| to work}] [M {分詞構文:付帯状況| [V repairing] [O the ravages {過去分詞>the ravages| [V made] [M {前| by generosity {過去分詞>generosity| [V added] [M {前| to love}]}}]}]}].', {
    ja: 'デラはヘアアイロンを取り出し、ガスに火をつけて、愛に気前のよさが加わったことでできた、ひどい傷あとの手当てに取りかかった。',
    chunks: [
      ['She got out her curling irons', '彼女はヘアアイロンを取り出した'],
      ['and lighted the gas and went to work', 'そしてガスに火をつけて、仕事に取りかかった'],
      ['repairing the ravages', 'ひどい傷あとを直す（仕事に）'],
      ['made by generosity added to love.', '愛に加わった気前のよさがつくった（傷あとを）'],
    ],
    notes: {
      'She got out her curling irons': 'curling irons は髪を巻くためのこて（ヘアアイロン）です。',
      'and lighted the gas and went to work': 'light the gas は「ガスに火をつける」。go to work は「仕事に取りかかる」。',
      'repairing the ravages': 'ravages は「ひどい被害・荒れたあと」。短く切った髪のことです。',
      'made by generosity added to love.': 'made by … が the ravages を、added to love が generosity を後ろから説明します。「愛に気前のよさが加わってできた被害」。',
    },
  }),
  // 74
  ls('[S Which] [V is] [M always] [C a tremendous task, {挿入| dear friends} — {同格>a tremendous task| a mammoth task}].', {
    ja: 'これはいつだってたいへんな仕事なのです、みなさん——とてつもなく大きな仕事なのです。',
    chunks: [
      ['Which is always a tremendous task, dear friends — a mammoth task.', 'それはいつもたいへんな仕事です、みなさん——とてつもない仕事です'],
    ],
    marks: [
      ['—', 'ダッシュで、「たいへんな仕事」を「とてつもなく大きな仕事」と言いかえて強めます。'],
    ],
    notes: {
      'Which is always a tremendous task, dear friends — a mammoth task.': 'Which は前の内容（髪の傷あとを直すこと）を受けます。dear friends は語り手の読者への呼びかけ。mammoth は「巨大な（マンモスのような）」で、a tremendous task を言いかえて強めています。',
    },
  }),
  // 75
  ls('[M {前| Within forty minutes}] [S her head] [V was covered] [M {前| with tiny, close-lying curls {関係>tiny, close-lying curls| [S that] [V made] [O her] [C {原形| [V look] [M wonderfully] [C {前| like a truant schoolboy}]}]}}].', {
    p: true,
    ja: '四十分もすると、デラの頭は小さな、ぴったりとした巻き毛でおおわれて、まるで学校をずる休みした男の子のように見えた。',
    chunks: [
      ['Within forty minutes her head was covered', '四十分もすると、彼女の頭はおおわれた'],
      ['with tiny, close-lying curls', '小さな、ぴったりとした巻き毛で'],
      ['that made her look wonderfully like a truant schoolboy.', 'その巻き毛で、彼女は学校をずる休みした男の子にそっくりに見えた'],
    ],
    notes: {
      'Within forty minutes her head was covered': 'within A で「A 以内に」。',
      'with tiny, close-lying curls': 'close-lying は「頭にぴったりついた」。curl は「巻き毛」。',
      'that made her look wonderfully like a truant schoolboy.': 'make A do で「A を〜させる」。look like A で「A のように見える」。truant は「ずる休みをする」。wonderfully は「驚くほど」。',
    },
  }),
  // 76
  ls('[S She] [V looked] [M {前| at her reflection {前| in the mirror}}] [M {並列| long, | carefully, | and critically}].', {
    ja: 'デラは鏡に映った自分の姿を、長いこと、注意深く、きびしい目で見つめた。',
    chunks: [
      ['She looked at her reflection in the mirror long, carefully, and critically.', '彼女は鏡に映った自分の姿を、長く、注意深く、きびしく見つめた'],
    ],
    notes: {
      'She looked at her reflection in the mirror long, carefully, and critically.': 'long・carefully・critically の3つの副詞が並んでいます。critically は「きびしく（欠点をさがすように）」。',
    },
  }),
  // 77
  ls('[O {引用| “[M {副詞節:条件| [接 If] [S Jim] [V doesn’t kill] [O me]}],”}] [S she] [V said] [M {前| to herself}], [O {引用| “[M {副詞節:時| [接 before] [S he] [V takes] [O a second look] [M {前| at me}]}], [S he][V ’ll say] [O {that省略| [S I] [V look] [C {前| like a Coney Island chorus girl}]}].}]', {
    p: true,
    ja: '「ジムにひと目で殺されなかったら」とデラはひとりごとを言った。「二度めに見たとき、コニーアイランドのコーラスガールみたいだって言われちゃうわ。',
    chunks: [
      ['“If Jim doesn’t kill me,” she said to herself,', '「もしジムに殺されなかったら」と彼女はひとりごとを言った'],
      ['“before he takes a second look at me,', '「二度めにわたしを見る前に'],
      ['he’ll say I look like a Coney Island chorus girl.', 'わたしがコニーアイランドのコーラスガールみたいだって言うわ'],
    ],
    notes: {
      '“If Jim doesn’t kill me,” she said to herself,': 'she said to herself は「ひとりごとを言った」。',
      '“before he takes a second look at me,': 'before he takes a second look at me は、前の If Jim doesn’t kill me に続いて「二度めに見る前に（ひと目見たときに）殺されなかったら」という意味です。',
      'he’ll say I look like a Coney Island chorus girl.': 'he’ll は he will の短縮形。say のあとに that が省かれています。Coney Island はニューヨークの遊園地のある海辺で、chorus girl は舞台で歌い踊る娘です。',
    },
  }),
  // 78
  ls('[接 But] [O what] [V could] [S I] [V do] — [独 oh]! [O what] [V could] [S I] [V do] [M {前| with {並列| a dollar | and eighty-seven cents}}]?”', {
    ja: 'でも、どうしようもなかったのよ——ああ、一ドル八十七セントで、ほかにどうしようがあったっていうの？」',
    chunks: [
      ['But what could I do — oh!', 'でも、どうすることができたっていうの——ああ'],
      ['what could I do with a dollar and eighty-seven cents?”', '一ドル八十七セントで、何ができたっていうの」'],
    ],
    marks: [
      ['—', 'ダッシュで、言いかけた問いをいったん止め、「ああ」と気持ちをこめて同じ問いをもう一度くり返します。'],
    ],
    notes: {
      'But what could I do — oh!': 'What could I do? は「どうすることができただろうか（どうしようもなかった）」という反語の問いです。',
      'what could I do with a dollar and eighty-seven cents?”': '同じ問いをくり返して、せつない気持ちを強めています。',
    },
  }),
  // 79
  ls('[M {前| At 7 o’clock}] [S the coffee] [V was made] [接 and] [S the frying-pan] [V was] [M {前| on the back {前| of the stove}}] [C {並列| hot | and ready {to:副詞(形容詞)| [V to cook] [O the chops]}}].', {
    p: true,
    ja: '七時には、コーヒーがいれてあって、フライパンはこんろの奥で熱くなり、骨つき肉を焼くばかりになっていた。',
    chunks: [
      ['At 7 o’clock the coffee was made', '七時には、コーヒーがいれてあった'],
      ['and the frying-pan was on the back of the stove', 'そしてフライパンはこんろの奥にあった'],
      ['hot and ready to cook the chops.', '熱くなって、骨つき肉を焼くばかりになって'],
    ],
    notes: {
      'At 7 o’clock the coffee was made': 'o’clock は「〜時」。was made は「いれてあった」。',
      'and the frying-pan was on the back of the stove': 'the back of the stove は「こんろの奥」。',
      'hot and ready to cook the chops.': 'hot and ready は「熱くなって準備ができて」。ready to do で「すぐ〜できる」。chop は骨つきの肉です。',
    },
  }),
  // 80
  ls('[S Jim] [V was] [M never] [C late].', {
    p: true,
    ja: 'ジムは決して遅れて帰ってくることはなかった。',
    chunks: [
      ['Jim was never late.', 'ジムは決して遅れなかった'],
    ],
    notes: {
      'Jim was never late.': 'never は「決して〜ない」。late は「遅れた」。',
    },
  }),
  // 81
  ls('[S Della] [V doubled] [O the fob chain] [M {前| in her hand}] [接 and] [V sat] [M {前| on the corner {前| of the table} {前| near the door {関係>the door| [O that] [S he] [M always] [V entered]}}}].', {
    ja: 'デラは時計の鎖を二つ折りにして手ににぎり、ジムがいつも入ってくるドアに近いテーブルの角に腰かけた。',
    chunks: [
      ['Della doubled the fob chain in her hand', 'デラは時計の鎖を手の中で二つ折りにした'],
      ['and sat on the corner of the table', 'そしてテーブルの角に腰かけた'],
      ['near the door that he always entered.', 'ジムがいつも入ってくるドアの近くの'],
    ],
    notes: {
      'Della doubled the fob chain in her hand': 'double は「二つ折りにする」。',
      'and sat on the corner of the table': 'sit on the corner of A で「A の角に腰かける」。',
      'near the door that he always entered.': 'that は the door を説明する関係代名詞で、「彼がいつも入ってくるドア」。',
    },
  }),
  // 82
  ls('[M Then] [S she] [V heard] [O his step {前| on the stair}] [M away down {前| on the first flight}], [接 and] [S she] [V turned] [C white] [M {前| for just a moment}].', {
    ja: 'やがて、ずっと下の一階の階段にジムの足音が聞こえた。デラはほんの一瞬、顔が青ざめた。',
    chunks: [
      ['Then she heard his step on the stair', 'やがて、階段に彼の足音が聞こえた'],
      ['away down on the first flight,', 'ずっと下の一階の（階段に）'],
      ['and she turned white for just a moment.', 'そして彼女はほんの一瞬、顔が青ざめた'],
    ],
    notes: {
      'Then she heard his step on the stair': 'step は「足音」。',
      'away down on the first flight,': 'away down は「ずっと下の」。the first flight は一階の階段です。',
      'and she turned white for just a moment.': 'turn white で「（顔が）青ざめる」。',
    },
  }),
  // 83
  ls('[S She] [V had] [O a habit {前| of {動名詞| [V saying] [O a little silent prayer] [M {前| about the simplest everyday things}]}}], [接 and] [M now] [S she] [V whispered]: [O {引用| “[独 Please God], [V make] [O him] [C {原形| [V think] [O {that省略| [S I] [V am] [M still] [C pretty]}]}].”}]', {
    ja: 'デラには、ごくありふれた毎日のことでも、声に出さない小さなお祈りをする癖があった。そして今、こうささやいた。「神さま、どうかジムが、わたしをまだきれいだと思ってくれますように」',
    chunks: [
      ['She had a habit of saying a little silent prayer', '彼女には、声に出さない小さなお祈りをする癖があった'],
      ['about the simplest everyday things,', 'ごくありふれた毎日のことについて'],
      ['and now she whispered:', 'そして今、ささやいた'],
      ['“Please God, make him think I am still pretty.”', '「神さま、ジムがわたしをまだきれいだと思ってくれますように」'],
    ],
    marks: [
      [':', 'コロンで、「ささやいた」ことに続けて、そのささやいた祈りの言葉そのものを示します。'],
    ],
    notes: {
      'She had a habit of saying a little silent prayer': 'have a habit of doing で「〜する癖がある」。silent prayer は「声に出さない祈り」。',
      'about the simplest everyday things,': 'the simplest everyday things は「ごくありふれた毎日のこと」。',
      'and now she whispered:': 'whisper は「ささやく」。',
      '“Please God, make him think I am still pretty.”': 'make A do で「A に〜させる」。think のあとに that が省かれています。',
    },
  }),
  // 84
  ls('[S The door] [V opened] [接 and] [S Jim] [V stepped in] [接 and] [V closed] [O it].', {
    p: true,
    ja: 'ドアが開き、ジムが入ってきて、ドアを閉めた。',
    chunks: [
      ['The door opened and Jim stepped in and closed it.', 'ドアが開き、ジムが入ってきて、ドアを閉めた'],
    ],
    notes: {
      'The door opened and Jim stepped in and closed it.': 'step in は「入ってくる」。stepped in と closed が、主語 Jim を共通にして並んでいます。',
    },
  }),
  // 85
  ls('[S He] [V looked] [C {並列| thin | and very serious}].', {
    ja: 'ジムはやせていて、とても深刻な顔つきだった。',
    chunks: [
      ['He looked thin and very serious.', '彼はやせていて、とても深刻に見えた'],
    ],
    notes: {
      'He looked thin and very serious.': 'look A で「A に見える」。thin は「やせた」、serious は「深刻な・まじめな」。',
    },
  }),
  // 86
  ls('[独 Poor fellow], [S he] [V was] [M only] [C twenty-two] — [接 and] [独 {to:名詞| [V to be burdened] [M {前| with a family}]}]!', {
    ja: 'かわいそうに、まだたった二十二歳なのだ——それなのに、一家をしょって立たなければならないなんて！',
    chunks: [
      ['Poor fellow, he was only twenty-two —', 'かわいそうに、彼はまだ二十二歳だった——'],
      ['and to be burdened with a family!', 'それなのに、家族を背負わされるなんて'],
    ],
    marks: [
      ['—', 'ダッシュで、「まだ二十二歳だった」と言ったあとに、語り手の同情の声（それなのに家族を背負うなんて）を付け足します。'],
    ],
    notes: {
      'Poor fellow, he was only twenty-two —': 'Poor fellow は「かわいそうなやつ」という語り手の同情の声です。',
      'and to be burdened with a family!': 'to be burdened with A は「A を背負わされるなんて」。to不定詞だけで、驚きや同情を表す言い方です。burden は「重荷を負わせる」。',
    },
  }),
  // 87
  ls('[S He] [V needed] [O a new overcoat] [接 and] [S he] [V was] [C {前| without gloves}].', {
    ja: '新しいオーバーが必要だったし、手袋もしていなかった。',
    chunks: [
      ['He needed a new overcoat and he was without gloves.', '新しいオーバーが必要で、手袋もしていなかった'],
    ],
    notes: {
      'He needed a new overcoat and he was without gloves.': 'be without A で「A を持っていない」。',
    },
  }),
  // 88
  ls('[S Jim] [V stopped] [M {前| inside the door}], [M as immovable {前| as a setter {前| at the scent {前| of quail}}}].', {
    p: true,
    ja: 'ジムはドアを入ったところで立ちどまった。ウズラのにおいをかぎつけたセッター犬のように、ぴくりとも動かなかった。',
    chunks: [
      ['Jim stopped inside the door,', 'ジムはドアを入ったところで立ちどまった'],
      ['as immovable as a setter at the scent of quail.', 'ウズラのにおいをかぎつけたセッター犬のように動かずに'],
    ],
    notes: {
      'Jim stopped inside the door,': 'inside the door は「ドアを入ったところで」。',
      'as immovable as a setter at the scent of quail.': 'as … as A で「A と同じくらい…」。immovable は「動かない」。setter は猟犬の一種で、獲物のにおいをかぐと、ぴたりと止まって知らせます。quail は「ウズラ」。',
    },
  }),
  // 89
  ls('[S His eyes] [V were fixed] [M {前| upon Della}], [接 and] [M there] [V was] [S an expression {前| in them} {関係>an expression| [O that] [S she] [V could not read]}], [接 and] [S it] [V terrified] [O her].', {
    ja: 'ジムの目はデラにくぎづけになっていた。その目には、デラには読みとれない表情が浮かんでいて、それがデラをおびえさせた。',
    chunks: [
      ['His eyes were fixed upon Della,', '彼の目はデラにじっと向けられていた'],
      ['and there was an expression in them that she could not read,', 'そしてその目には、彼女には読みとれない表情があった'],
      ['and it terrified her.', 'そして、それが彼女をおびえさせた'],
    ],
    notes: {
      'His eyes were fixed upon Della,': 'be fixed upon A で「A にじっと向けられている」。',
      'and there was an expression in them that she could not read,': 'that は an expression を説明する関係代名詞で、間に in them がはさまっています。read はここでは「（表情を）読みとる」。',
      'and it terrified her.': 'terrify は「おびえさせる」。',
    },
  }),
  // 90
  ls('[S It] [V was not] [C {並列| anger, | nor surprise, | nor disapproval, | nor horror, | nor any {前| of the sentiments {関係>the sentiments| [O that] [S she] [V had been prepared for]}}}].', {
    ja: 'それは怒りでも、驚きでも、非難でも、恐怖でもなく、デラが覚悟していたどんな気持ちでもなかった。',
    chunks: [
      ['It was not anger, nor surprise, nor disapproval,', 'それは怒りでも、驚きでも、非難でもなかった'],
      ['nor horror, nor any of the sentiments', '恐怖でも、どんな気持ちでもなかった'],
      ['that she had been prepared for.', '彼女が覚悟していた（気持ちの）'],
    ],
    notes: {
      'It was not anger, nor surprise, nor disapproval,': 'not A, nor B で「A でもなく、B でもない」。disapproval は「非難・不賛成」。',
      'nor horror, nor any of the sentiments': 'sentiment は「気持ち・感情」。',
      'that she had been prepared for.': 'be prepared for A で「A を覚悟している」。for の目的語が、前の関係代名詞 that です。',
    },
  }),
  // 91
  ls('[S He] [M simply] [V stared] [M {前| at her}] [M fixedly] [M {前| with that peculiar expression {前| on his face}}].', {
    ja: 'ジムはただ、あの妙な表情を顔に浮かべたまま、じっとデラを見つめていた。',
    chunks: [
      ['He simply stared at her fixedly', '彼はただ、じっと彼女を見つめていた'],
      ['with that peculiar expression on his face.', 'あの妙な表情を顔に浮かべたまま'],
    ],
    notes: {
      'He simply stared at her fixedly': 'stare at A で「A をじっと見つめる」。fixedly は「じっと」。',
      'with that peculiar expression on his face.': 'peculiar は「奇妙な・独特の」。with A on one’s face で「顔に A を浮かべて」。',
    },
  }),
  // 92
  ls('[S Della] [V wriggled] [M {前| off the table}] [接 and] [V went] [M {前| for him}].', {
    p: true,
    ja: 'デラは身をよじってテーブルからおりると、ジムのほうへかけよった。',
    chunks: [
      ['Della wriggled off the table and went for him.', 'デラは身をよじってテーブルからおり、ジムのほうへ向かった'],
    ],
    notes: {
      'Della wriggled off the table and went for him.': 'wriggle off A で「身をよじって A からおりる」。go for A はここでは「A のほうへ向かっていく」。',
    },
  }),
  // 93
  ls('[O {引用| “[独 Jim], [独 darling],”}] [S she] [V cried], [O {引用| “[V don’t look] [M {前| at me}] [M that way].}]', {
    p: true,
    ja: '「ジム、あなた」とデラは叫んだ。「そんな目で見ないで。',
    chunks: [
      ['“Jim, darling,” she cried,', '「ジム、あなた」と彼女は叫んだ'],
      ['“don’t look at me that way.', '「そんなふうにわたしを見ないで'],
    ],
    notes: {
      '“Jim, darling,” she cried,': 'darling は「あなた・いとしい人」という呼びかけです。',
      '“don’t look at me that way.': 'don’t＋動詞の原形で「〜しないで」という否定の命令文。that way は「そんなふうに」。',
    },
  }),
  // 94
  ls('[S I] [V had] [O my hair] [C {過去分詞:補語| [V cut off] [接 and] [V sold]}] [M {副詞節:理由| [接 because] [S I] [V couldn’t have lived] [M {前| through Christmas}] [M {前| without {動名詞| [V giving] [O1 you] [O2 a present]}}]}].', {
    ja: '髪を切ってもらって、売ったの。あなたに贈り物をしないでクリスマスを過ごすなんて、とてもできなかったんだもの。',
    chunks: [
      ['I had my hair cut off and sold', 'わたし、髪を切ってもらって、売ったの'],
      ['because I couldn’t have lived through Christmas', 'クリスマスを過ごすなんてできなかったから'],
      ['without giving you a present.', 'あなたに贈り物をしないで'],
    ],
    notes: {
      'I had my hair cut off and sold': 'have A done で「A を〜してもらう」。had my hair cut off and sold は「髪を切ってもらって、売った」。',
      'because I couldn’t have lived through Christmas': 'couldn’t have lived through A は「A を過ごすことはできなかっただろう」（仮定法過去完了）。',
      'without giving you a present.': 'without doing で「〜しないで」。give A B で「A に B をあげる」。',
    },
  }),
  // 95
  ls('[S It][V ’ll grow out] [M again] — [S you] [V won’t mind], [M {成句| will you}]?', {
    ja: 'また伸びてくるわ——気にしないでしょう、ね？',
    chunks: [
      ['It’ll grow out again — you won’t mind, will you?', 'また伸びてくるわ——気にしないでしょう、ね'],
    ],
    marks: [
      ['—', 'ダッシュで、「また伸びるわ」と言ったあと、気にしないでしょう、と相手の気持ちをたずねる言葉へつなぎます。'],
    ],
    notes: {
      'It’ll grow out again — you won’t mind, will you?': 'It’ll は It will の短縮形で、It は髪のこと。grow out は「（髪が）伸びる」。…, will you? は付加疑問で「〜でしょう？」と念を押します。',
    },
  }),
  // 96
  ls('[S I] [M just] [V had to do] [O it].', {
    ja: 'どうしても、そうしなくちゃいけなかったの。',
    chunks: [
      ['I just had to do it.', 'どうしても、そうしなくちゃいけなかったの'],
    ],
    notes: {
      'I just had to do it.': 'have to do で「〜しなければならない」。just は「どうしても・とにかく」と強めます。',
    },
  }),
  // 97
  ls('[S My hair] [V grows] [M awfully fast].', {
    ja: 'わたしの髪って、すごく早く伸びるのよ。',
    chunks: [
      ['My hair grows awfully fast.', 'わたしの髪はすごく早く伸びるの'],
    ],
    notes: {
      'My hair grows awfully fast.': 'awfully は「ものすごく」。',
    },
  }),
  // 98
  ls('[V Say] [O ‘Merry Christmas!’] [独 Jim], [接 and] [V let][O ’s] [C {原形| [V be] [C happy]}].', {
    ja: '「メリー・クリスマス」って言って、ジム。そして楽しくしましょうよ。',
    chunks: [
      ['Say ‘Merry Christmas!’ Jim,', '「メリー・クリスマス」って言って、ジム'],
      ['and let’s be happy.', 'そして楽しくしましょう'],
    ],
    notes: {
      'Say ‘Merry Christmas!’ Jim,': 'Say A で「A と言って」という命令文です。Jim は呼びかけです。',
      'and let’s be happy.': 'let’s は let us の短縮形で「〜しよう」。',
    },
  }),
  // 99
  ls('[S You] [V don’t know] [独 what a nice] — [O {疑問詞節| [O what a beautiful, nice gift] [S I][V ’ve got] [M {前| for you}]}].”', {
    ja: 'あなたのために、どんなにすてきな——どんなにきれいで、すてきな贈り物を用意したか、あなたには分からないでしょうね」',
    chunks: [
      ['You don’t know what a nice —', 'あなたには分からないでしょう、なんてすてきな——'],
      ['what a beautiful, nice gift I’ve got for you.”', 'なんてきれいで、すてきな贈り物をあなたに用意したか」'],
    ],
    marks: [
      ['—', 'ダッシュで、「なんてすてきな…」と言いかけてやめ、「なんてきれいで、すてきな贈り物か」と言い直します。'],
    ],
    notes: {
      'You don’t know what a nice —': 'what a nice … は「なんてすてきな…」と言いかけて、途中でやめています。',
      'what a beautiful, nice gift I’ve got for you.”': 'what a＋形容詞＋名詞 … で「なんと〜な…を」という感嘆の意味の名詞節で、know の目的語です。I’ve got は I have got で「持っている・用意してある」。',
    },
  }),
  // 100
  ls('[O {引用| “[S You][V ’ve cut off] [O your hair]?”}] [V asked] [S Jim], [M laboriously], [M {副詞節:様態| [接 as if] [S he] [V had not arrived] [M {前| at that patent fact}] [M yet] [M even {前| after the hardest mental labor}]}].', {
    p: true,
    ja: '「髪を、切ったのかい」とジムは、やっとのことでたずねた。どんなに頭をしぼっても、まだそのはっきりした事実にたどり着けないかのようだった。',
    chunks: [
      ['“You’ve cut off your hair?”', '「髪を切ったのかい」'],
      ['asked Jim, laboriously,', 'とジムは、やっとのことでたずねた'],
      ['as if he had not arrived at that patent fact yet', 'まるで、そのはっきりした事実にまだたどり着いていないかのように'],
      ['even after the hardest mental labor.', 'どんなに頭をしぼったあとでも'],
    ],
    notes: {
      '“You’ve cut off your hair?”': 'You’ve は You have の短縮形。平叙文の形のまま、語尾を上げてたずねています。',
      'asked Jim, laboriously,': 'laboriously は「骨を折って・やっとのことで」。',
      'as if he had not arrived at that patent fact yet': 'as if … で「まるで…かのように」。arrive at A で「A にたどり着く」。patent はここでは「明らかな」。',
      'even after the hardest mental labor.': 'mental labor は「頭を使う苦労」。',
    },
  }),
  // 101
  ls('[O {引用:主語省略| “[V Cut] [O it] [M off] [接 and] [V sold] [O it],”}] [V said] [S Della].', {
    p: true,
    ja: '「切って、売ったの」とデラは言った。',
    chunks: [
      ['“Cut it off and sold it,” said Della.', '「切って、売ったの」とデラは言った'],
    ],
    notes: {
      '“Cut it off and sold it,” said Della.': '主語 I（わたしは）が省かれた答えで、命令文ではありません。cut は過去形も cut のままです。',
    },
  }),
  // 102
  ls('“[V Don’t] [S you] [V like] [O me] [M just as well], [M anyhow]?', {
    ja: '「それでも、前と同じくらい、わたしのことを好きでいてくれるでしょう？',
    chunks: [
      ['“Don’t you like me just as well, anyhow?', '「それでも、前と同じくらいわたしを好きでしょう'],
    ],
    notes: {
      '“Don’t you like me just as well, anyhow?': 'Don’t you …? は「〜してくれないの？（してくれるでしょう）」という問いです。just as well は「（髪があったときと）ちょうど同じくらい」。anyhow は「それでも・とにかく」。',
    },
  }),
  // 103
  ls('[S I][V ’m] [C me] [M {前| without my hair}], [M {成句| ain’t I}]?”', {
    ja: '髪がなくたって、わたしはわたしでしょう？」',
    chunks: [
      ['I’m me without my hair, ain’t I?”', '髪がなくても、わたしはわたしでしょう」'],
    ],
    notes: {
      'I’m me without my hair, ain’t I?”': 'I’m は I am の短縮形です。ain’t I? は「〜でしょう？」と念を押す付加疑問のくだけた言い方です（正式には aren’t I?）。',
    },
  }),
  // 104
  ls('[S Jim] [V looked] [M {前| about the room}] [M curiously].', {
    p: true,
    ja: 'ジムは、ものめずらしそうに部屋を見回した。',
    chunks: [
      ['Jim looked about the room curiously.', 'ジムはものめずらしそうに部屋を見回した'],
    ],
    notes: {
      'Jim looked about the room curiously.': 'look about A で「A を見回す」。curiously は「不思議そうに」。髪がどこかにあるかのように探しているのです。',
    },
  }),
  // 105
  ls('[O {引用| “[S You] [V say] [O {that省略| [S your hair] [V is] [C gone]}]?”}] [S he] [V said], [M {前| with an air almost {前| of idiocy}}].', {
    p: true,
    ja: '「髪がなくなったって言うのかい」とジムは、ほとんどぼうぜんとした様子で言った。',
    chunks: [
      ['“You say your hair is gone?”', '「髪がなくなったって言うのかい」'],
      ['he said, with an air almost of idiocy.', 'と彼は、ほとんどぼうぜんとした様子で言った'],
    ],
    notes: {
      '“You say your hair is gone?”': 'say のあとに that が省かれています。be gone は「なくなっている」。',
      'he said, with an air almost of idiocy.': 'with an air of A で「A の様子で」。idiocy は「まぬけな状態」で、ぼうぜんとしている様子です。',
    },
  }),
  // 106
  ls('[O {引用| “[S You] [V needn’t look for] [O it],”}] [V said] [S Della].', {
    p: true,
    ja: '「探さなくてもいいのよ」とデラは言った。',
    chunks: [
      ['“You needn’t look for it,” said Della.', '「探さなくてもいいのよ」とデラは言った'],
    ],
    notes: {
      '“You needn’t look for it,” said Della.': 'needn’t は need not の短縮形で「〜する必要はない」。look for A で「A を探す」。',
    },
  }),
  // 107
  ls('“[S It][V ’s] [C sold], [M {挿入| I tell you}] — [C {並列| sold | and gone}], [M too].', {
    ja: '「売ったのよ、ほんとうに——売ってしまって、もうないの。',
    chunks: [
      ['“It’s sold, I tell you — sold and gone, too.', '「売ったのよ、ほんとうに——売って、もうないの'],
    ],
    marks: [
      ['—', 'ダッシュで、「売ったのよ」を「売って、もうないの」と言い直して強めます。'],
    ],
    notes: {
      '“It’s sold, I tell you — sold and gone, too.': 'It’s sold は「それは売られた（売った）」。I tell you は「ほんとうに」と強める挿入です。sold and gone は「売られて、なくなった」。',
    },
  }),
  // 108
  ls('[S It][V ’s] [C Christmas Eve], [独 boy].', {
    ja: 'クリスマス・イブなのよ、あなた。',
    chunks: [
      ['It’s Christmas Eve, boy.', 'クリスマス・イブなのよ、あなた'],
    ],
    notes: {
      'It’s Christmas Eve, boy.': 'It は日時を表す主語です。boy はここでは夫への親しい呼びかけです。',
    },
  }),
  // 109
  ls('[V Be] [C good] [M {前| to me}], [接 for] [S it] [V went] [M {前| for you}].', {
    ja: 'やさしくしてね。あなたのために、なくなったんだから。',
    chunks: [
      ['Be good to me, for it went for you.', 'やさしくしてね。あなたのためになくなったんだから'],
    ],
    notes: {
      'Be good to me, for it went for you.': 'Be good to A で「A にやさしくして」という命令文。for は「というのも」。it は髪のことで、go for A はここでは「A のために使われる」。',
    },
  }),
  // 110
  ls('[O {引用| [M Maybe] [S the hairs {前| of my head}] [V were numbered],”}] [S she] [V went on] [M {前| with sudden serious sweetness}], [O {引用| “[接 but] [S nobody] [V could] [M ever] [V count] [O my love {前| for you}].}]', {
    ja: 'わたしの髪の毛の数は数えられたかもしれない」とデラは、急にまじめな、やさしい調子になって続けた。「でも、わたしのあなたへの愛は、誰にも数えられないわ。',
    chunks: [
      ['Maybe the hairs of my head were numbered,”', 'わたしの髪の毛は、数えられていたかもしれない」'],
      ['she went on with sudden serious sweetness,', 'と彼女は、急にまじめなやさしさで続けた'],
      ['“but nobody could ever count my love for you.', '「でも、あなたへのわたしの愛は、誰にも数えられないわ'],
    ],
    notes: {
      'Maybe the hairs of my head were numbered,”': 'the hairs of my head were numbered は「わたしの髪の毛は数えられていた」。聖書の「あなたがたの髪の毛までも、一本残らず数えられている」という言葉をふまえています。',
      'she went on with sudden serious sweetness,': 'go on で「（話を）続ける」。sweetness は「やさしさ」。',
      '“but nobody could ever count my love for you.': 'nobody could ever … で「誰も決して〜できない」。髪は数えられても、愛は数えられない、という対比です。',
    },
  }),
  // 111
  ls('[V Shall] [S I] [V put] [O the chops] [M on], [独 Jim]?”', {
    ja: 'お肉を焼きましょうか、ジム？」',
    chunks: [
      ['Shall I put the chops on, Jim?”', 'お肉を火にかけましょうか、ジム」'],
    ],
    notes: {
      'Shall I put the chops on, Jim?”': 'Shall I …? で「〜しましょうか」。put A on はここでは「A を火にかける」。chops は骨つきの肉です。',
    },
  }),
  // 112
  ls('[M {前| Out of his trance}] [S Jim] [V seemed] [M quickly] [C {to:補語| [V to wake]}].', {
    p: true,
    ja: 'ジムは、ぼうぜんとした状態から、すぐに目がさめたようだった。',
    chunks: [
      ['Out of his trance Jim seemed quickly to wake.', 'ぼうぜんとした状態から、ジムはすぐに目がさめたようだった'],
    ],
    notes: {
      'Out of his trance Jim seemed quickly to wake.': 'trance は「ぼうぜんとした状態」。out of A で「A から抜け出して」。seem to do で「〜するようだ」。quickly が、ふつうとちがって seemed と to wake の間に入っています。',
    },
  }),
  // 113
  ls('[S He] [V enfolded] [O his Della].', {
    ja: 'ジムは、いとしいデラを抱きしめた。',
    chunks: [
      ['He enfolded his Della.', '彼はいとしいデラを抱きしめた'],
    ],
    notes: {
      'He enfolded his Della.': 'enfold は「包みこむ・抱きしめる」。his Della は「彼のデラ」で、愛情がこもっています。',
    },
  }),
  // 114
  ls('[M {前| For ten seconds}] [V let] [O us] [C {原形| [V regard] [M {前| with discreet scrutiny}] [O some inconsequential object {前| in the other direction}]}].', {
    ja: 'ここで十秒ほど、わたしたちは遠慮して、反対の方向にある何かどうでもいいものを、しげしげとながめていることにしよう。',
    chunks: [
      ['For ten seconds let us regard', '十秒ほど、ながめることにしよう'],
      ['with discreet scrutiny', '遠慮して、しげしげと'],
      ['some inconsequential object in the other direction.', '反対の方向にある、何かどうでもいいものを'],
    ],
    notes: {
      'For ten seconds let us regard': 'let us do で「〜しよう」。regard は「じっと見る」。',
      'with discreet scrutiny': 'discreet は「遠慮した・ひかえめな」、scrutiny は「じっくり調べること」。',
      'some inconsequential object in the other direction.': 'inconsequential は「どうでもいい」。二人が抱き合う場面から、語り手が読者といっしょに目をそらそう、と言っています。',
    },
  }),
  // 115
  ls('[独 {並列| Eight dollars a week | or a million a year}] — [C what] [V is] [S the difference]?', {
    ja: '週に八ドルか、年に百万ドルか——その違いは何だろう？',
    chunks: [
      ['Eight dollars a week or a million a year —', '週に八ドルか、年に百万ドルか——'],
      ['what is the difference?', 'その違いは何だろう'],
    ],
    marks: [
      ['—', 'ダッシュで、「週八ドルか年百万ドルか」を持ち出してから、「その違いは何か」と問いかけます。'],
    ],
    notes: {
      'Eight dollars a week or a million a year —': 'a week は「一週につき」、a year は「一年につき」。',
      'what is the difference?': 'What is the difference? は「何が違うのか（違いはない）」という問いかけです。',
    },
  }),
  // 116
  ls('[S {並列| A mathematician | or a wit}] [V would give] [O1 you] [O2 the wrong answer].', {
    ja: '数学者や才人なら、まちがった答えを出すだろう。',
    chunks: [
      ['A mathematician or a wit would give you the wrong answer.', '数学者や才人なら、まちがった答えを出すだろう'],
    ],
    notes: {
      'A mathematician or a wit would give you the wrong answer.': 'wit は「機知に富んだ人・才人」。would は「（聞けば）〜だろう」という推量です。',
    },
  }),
  // 117
  ls('[S The magi] [V brought] [O valuable gifts], [接 but] [S that] [V was not] [C {前| among them}].', {
    ja: '東方の三博士は高価な贈り物を持ってきたが、その中にそれはなかった。',
    chunks: [
      ['The magi brought valuable gifts, but that was not among them.', '三博士は高価な贈り物を持ってきたが、その中にそれはなかった'],
    ],
    notes: {
      'The magi brought valuable gifts, but that was not among them.': 'the magi は、キリストの誕生を祝って贈り物を届けた東方の三博士です。that は「その答え（ほんとうの違い）」を指します。among A で「A の中に」。',
    },
  }),
  // 118
  ls('[S This dark assertion] [V will be illuminated] [M later on].', {
    ja: 'このなぞめいた言葉の意味は、あとで明らかになるだろう。',
    chunks: [
      ['This dark assertion will be illuminated later on.', 'このなぞめいた言葉は、あとで明らかにされるだろう'],
    ],
    notes: {
      'This dark assertion will be illuminated later on.': 'dark assertion は「なぞめいた言葉」。illuminate は「明らかにする」（もとは「照らす」で、dark と対になっています）。later on は「あとで」。',
    },
  }),
  // 119
  ls('[S Jim] [V drew] [O a package] [M {前| from his overcoat pocket}] [接 and] [V threw] [O it] [M {前| upon the table}].', {
    p: true,
    ja: 'ジムはオーバーのポケットから包みを取り出して、テーブルの上にほうった。',
    chunks: [
      ['Jim drew a package from his overcoat pocket', 'ジムはオーバーのポケットから包みを取り出した'],
      ['and threw it upon the table.', 'そしてテーブルの上にほうった'],
    ],
    notes: {
      'Jim drew a package from his overcoat pocket': 'draw A from B で「B から A を取り出す」。',
      'and threw it upon the table.': 'threw は throw（投げる）の過去形です。',
    },
  }),
  // 120
  ls('[O {引用| “[V Don’t make] [O any mistake], [独 Dell],”}] [S he] [V said], [O {引用| “[M {前| about me}].}]', {
    p: true,
    ja: '「思いちがいしないでくれよ、デル」とジムは言った。「ぼくのことをさ。',
    chunks: [
      ['“Don’t make any mistake, Dell,” he said,', '「思いちがいしないでくれよ、デル」と彼は言った'],
      ['“about me.', '「ぼくのことをさ'],
    ],
    notes: {
      '“Don’t make any mistake, Dell,” he said,': 'Don’t make any mistake で「思いちがいをしないで」。Dell は Della の愛称です。',
      '“about me.': 'about me は、前の mistake に続いて「ぼくのことで（思いちがいしないで）」。',
    },
  }),
  // 121
  ls('[S I] [V don’t think] [O {that省略| [M there][V ’s] [S anything {前| in the way {前| of {並列| a haircut | or a shave | or a shampoo}}} {関係>anything| [S that] [V could make] [O me] [C {原形| [V like] [O my girl] [M any less]}]}]}].', {
    ja: '髪を切ったって、ひげをそったって、髪を洗ったって、そんなことで、ぼくが自分の奥さんを少しでも好きじゃなくなるなんてことはないと思うよ。',
    chunks: [
      ['I don’t think there’s anything in the way', 'そんなものは何もないと思う'],
      ['of a haircut or a shave or a shampoo', '散髪とか、ひげそりとか、洗髪とかのたぐいで'],
      ['that could make me like my girl any less.', 'ぼくが奥さんを少しでも好きでなくなるようなものは'],
    ],
    notes: {
      'I don’t think there’s anything in the way': 'I don’t think … で「…ではないと思う」。there’s は there is の短縮形です。in the way of A で「A のようなもの（のたぐい）で」。',
      'of a haircut or a shave or a shampoo': 'haircut（散髪）・shave（ひげそり）・shampoo（洗髪）が or で並んでいます。',
      'that could make me like my girl any less.': 'that は anything を説明する関係代名詞です。make A do で「A に〜させる」。any less は「少しでも少なく」。my girl は「ぼくの奥さん（彼女）」。',
    },
  }),
  // 122
  ls('[接 But] [M {副詞節:条件| [接 if] [S you][V ’ll unwrap] [O that package]}] [S you] [V may see] [O {疑問詞節| [M why] [S you] [V had] [O me] [C {現在分詞:補語| [V going]}] [M a while] [M {前| at first}]}].”', {
    ja: 'でも、その包みを開けてみれば、どうしてさっき、ぼくがしばらくぼうぜんとしていたのか、分かるかもしれない」',
    chunks: [
      ['But if you’ll unwrap that package', 'でも、その包みを開けてくれれば'],
      ['you may see why you had me going', 'どうしてきみがぼくをまごつかせたのか、分かるかもしれない'],
      ['a while at first.”', '最初、しばらくのあいだ」'],
    ],
    notes: {
      'But if you’ll unwrap that package': 'if you’ll … の will は「〜してくれるなら」という相手の意志を表します。unwrap は「（包みを）開ける」。',
      'you may see why you had me going': 'why … は「なぜ…なのか」という疑問詞の節で、see の目的語です。have A going は「A をまごつかせる」。',
      'a while at first.”': 'a while は「しばらく」、at first は「最初は」。',
    },
  }),
  // 123
  ls('[S White fingers {形容詞>White fingers| [接 and] [M nimble]}] [V tore at] [O {並列| the string | and paper}].', {
    p: true,
    ja: '白くすばしこい指が、ひもと包み紙をむしるようにほどいた。',
    chunks: [
      ['White fingers and nimble tore at the string and paper.', '白くすばしこい指が、ひもと包み紙をむしるようにほどいた'],
    ],
    notes: {
      'White fingers and nimble tore at the string and paper.': 'White fingers and nimble は white and nimble fingers（白くすばしこい指）の形容詞 nimble を、詩のように後ろに回した言い方です。tear at A で「A を引きちぎろうとする」。tore は tear の過去形です。',
    },
  }),
  // 124
  ls('[接 And] [M then] [独 an ecstatic scream {前| of joy}]; [接 and] [M then], [独 alas]! [独 a quick feminine change {前| to hysterical {並列| tears | and wails}}, {現在分詞>a quick feminine change| [V necessitating] [O the immediate employment {前| of all the comforting powers {前| of the lord {前| of the flat}}}]}].', {
    fragment: true,
    ja: 'そして、うっとりとした喜びの叫び声。それから、ああ、たちまち女らしくヒステリックな涙と泣き声に変わってしまい、この家のあるじは、ありったけのなぐさめの力をすぐに使わなければならなかった。',
    chunks: [
      ['And then an ecstatic scream of joy;', 'そして、うっとりとした喜びの叫び声'],
      ['and then, alas!', 'それから、ああ'],
      ['a quick feminine change to hysterical tears and wails,', 'たちまち女らしく、ひどく取り乱した涙と泣き声に変わって'],
      ['necessitating the immediate employment', 'すぐに使わなければならなくなった'],
      ['of all the comforting powers of the lord of the flat.', 'この部屋のあるじの、ありったけのなぐさめの力を'],
    ],
    marks: [
      [';', 'セミコロンで、「歓喜の叫び」と、その直後の「涙と泣き声への急な変化」という2つの場面を区切って並べます。'],
    ],
    notes: {
      'And then an ecstatic scream of joy;': '動詞のない文です。ecstatic は「うっとりするほどの」、scream of joy は「喜びの叫び」。',
      'and then, alas!': 'alas は「ああ（悲しいかな）」。',
      'a quick feminine change to hysterical tears and wails,': 'change to A で「A への変化」。hysterical は「ひどく取り乱した」、wail は「泣き叫ぶ声」。',
      'necessitating the immediate employment': 'necessitating … は a quick feminine change を説明し、「〜を必要とさせる（変化）」。employment はここでは「使うこと」。',
      'of all the comforting powers of the lord of the flat.': 'the lord of the flat は「この部屋のあるじ」で、ジムのことをおどけて言っています。',
    },
  }),
  // 125
  ls('[接 For] [M there] [V lay] [S The Combs — {同格>The Combs| the set {前| of combs}, {並列| side | and back}, {関係>the set of combs| [O that] [S Della] [V had worshipped] [M long] [M {前| in a Broadway window}]}}].', {
    p: true,
    ja: 'というのも、そこにあったのは、あの「くし」だったのだ——横と後ろにさす一そろいのくしで、デラがブロードウェイの店の窓で、長いあいだあこがれていたものだった。',
    chunks: [
      ['For there lay The Combs —', 'というのも、そこにはあの「くし」があったのだ——'],
      ['the set of combs, side and back,', '横と後ろにさす、一そろいのくし'],
      ['that Della had worshipped long in a Broadway window.', 'デラがブロードウェイの店の窓で、長いあいだあこがれていた（くし）'],
    ],
    marks: [
      ['—', 'ダッシュで、「あのくし」がどんなものかを、「横と後ろにさす一そろいのくしで、デラが長いあいだ店の窓であこがれていたもの」と言いかえて説明します。'],
    ],
    notes: {
      'For there lay The Combs —': 'For は「というのも」。there lay A は「そこに A があった」（there is の形で、動詞 lie の過去形 lay を使っています）。The Combs と大文字で書いて、特別なものだと強めています。',
      'the set of combs, side and back,': 'the set of combs は The Combs を言いかえた同格の語句です。side and back は「横にさすのと、後ろにさすの」。',
      'that Della had worshipped long in a Broadway window.': 'that は the set of combs を説明する関係代名詞です。worship は「あがめる」で、ここでは「うっとりながめる」。Broadway はニューヨークのにぎやかな大通りです。',
    },
  }),
  // 126
  ls('[独 Beautiful combs, {同格>Beautiful combs| pure tortoise shell}, {前| with jewelled rims}] — [独 just the shade {to:形容詞>the shade| [V to wear] [M {前| in the beautiful vanished hair}]}].', {
    fragment: true,
    ja: '美しいくしで、本物のべっこうでできていて、ふちには宝石がはめこんである——今はもうない、あの美しい髪にさすのに、ちょうどぴったりの色合いだった。',
    chunks: [
      ['Beautiful combs, pure tortoise shell, with jewelled rims —', '美しいくし、本物のべっこう、宝石をはめたふち——'],
      ['just the shade to wear in the beautiful vanished hair.', '消えてしまった美しい髪にさすのに、ちょうどいい色合い'],
    ],
    marks: [
      ['—', 'ダッシュで、くしの見た目の説明に、「今はなくなった美しい髪にさすのにぴったりの色合い」という説明を付け足します。'],
    ],
    notes: {
      'Beautiful combs, pure tortoise shell, with jewelled rims —': '動詞のない文です。tortoise shell は「べっこう」、jewelled rims は「宝石をはめたふち」（jewelled はイギリスのつづり）。',
      'just the shade to wear in the beautiful vanished hair.': 'shade は「色合い」。to wear が the shade を後ろから説明します。vanished は「消えてしまった」。',
    },
  }),
  // 127
  ls('[S They] [V were] [C expensive combs], [M {挿入| she knew}], [接 and] [S her heart] [V had] [M simply] [V craved] [接 and] [V yearned] [M {前| over them}] [M {前| without the least hope {前| of possession}}].', {
    ja: '高価なくしだということは、デラも分かっていた。自分のものになる望みなどまったくないまま、ただほしくて、ほしくて、心の中であこがれていたのだ。',
    chunks: [
      ['They were expensive combs, she knew,', '高価なくしだと、彼女は分かっていた'],
      ['and her heart had simply craved', 'そして心はただ、ほしくてたまらなかった'],
      ['and yearned over them without the least hope of possession.', 'そして自分のものになる望みもないまま、あこがれていた'],
    ],
    notes: {
      'They were expensive combs, she knew,': 'she knew は「（それを）彼女は知っていた」という挿入です。',
      'and her heart had simply craved': 'crave は「強くほしがる」。',
      'and yearned over them without the least hope of possession.': 'yearn over A で「A にあこがれる」。without the least hope of A で「A の望みがまったくないまま」。possession は「自分のものにすること」。',
    },
  }),
  // 128
  ls('[接 And] [M now], [S they] [V were] [C hers], [接 but] [S the tresses {関係>the tresses| [S that] [V should have adorned] [O the coveted adornments]}] [V were] [C gone].', {
    ja: 'そして今、くしはデラのものになった。けれども、そのあこがれの飾りを飾るはずだった髪は、もうなくなっていた。',
    chunks: [
      ['And now, they were hers,', 'そして今、それは彼女のものだった'],
      ['but the tresses that should have adorned', 'けれど、飾るはずだった髪は'],
      ['the coveted adornments were gone.', 'あこがれの飾りを（飾るはずだった髪は）、もうなかった'],
    ],
    notes: {
      'And now, they were hers,': 'hers は「彼女のもの」。',
      'but the tresses that should have adorned': 'tresses は「（女性の長い）髪」。should have done は「〜するはずだった（のにしなかった）」。adorn は「飾る」。',
      'the coveted adornments were gone.': 'coveted adornments は「ほしくてたまらなかった飾り」で、くしのこと。髪がくしを飾る、と逆に言っているところがおもしろい言い方です。',
    },
  }),
  // 129
  ls('[接 But] [S she] [V hugged] [O them] [M {前| to her bosom}], [接 and] [M {前| at length}] [S she] [V was able to look up] [M {前| with {並列| dim eyes | and a smile}}] [接 and] [V say]: [O {引用| “[S My hair] [V grows] [M so fast], [独 Jim]!”}]', {
    p: true,
    ja: 'それでもデラは、くしを胸にしっかりと抱きしめた。そしてやっと、涙にかすんだ目で顔を上げ、ほほえんで言うことができた。「わたしの髪って、ほんとうに早く伸びるのよ、ジム！」',
    chunks: [
      ['But she hugged them to her bosom,', 'それでも彼女は、くしを胸に抱きしめた'],
      ['and at length she was able to look up', 'そしてやっと、顔を上げることができた'],
      ['with dim eyes and a smile and say:', 'かすんだ目とほほえみで。そして言うことができた'],
      ['“My hair grows so fast, Jim!”', '「わたしの髪って、ほんとうに早く伸びるのよ、ジム」'],
    ],
    marks: [
      [':', 'コロンで、「こう言った」の中身として、デラの言葉そのものを示します。'],
    ],
    notes: {
      'But she hugged them to her bosom,': 'hug A to one’s bosom で「A を胸に抱きしめる」。',
      'and at length she was able to look up': 'at length は「やっと・ようやく」。be able to do で「〜することができる」。',
      'with dim eyes and a smile and say:': 'dim eyes は「（涙で）かすんだ目」。look up と say が並んでいます。',
      '“My hair grows so fast, Jim!”': '髪がすぐ伸びるから、くしはまた使える、と自分をはげましています。',
    },
  }),
  // 130
  ls('[接 And] [M then] [S Della] [V leaped up] [M {前| like a little singed cat}] [接 and] [V cried], [O {引用| “[独 Oh], [独 oh]!”}]', {
    p: true,
    ja: 'それからデラは、毛をこがした子猫のようにとび上がって、「そうだ、そうだった！」と叫んだ。',
    chunks: [
      ['And then Della leaped up like a little singed cat and cried,', 'それからデラは、毛をこがした子猫のようにとび上がって叫んだ'],
      ['“Oh, oh!”', '「そうだ、そうだった」'],
    ],
    notes: {
      'And then Della leaped up like a little singed cat and cried,': 'leap up は「とび上がる」。singed は「（毛を）こがした」。like A で「A のように」。',
      '“Oh, oh!”': 'Oh, oh! は、大事なことを思い出したときの声です。',
    },
  }),
  // 131
  ls('[S Jim] [V had not] [M yet] [V seen] [O his beautiful present].', {
    p: true,
    ja: 'ジムは、まだ自分へのすてきな贈り物を見ていなかったのだ。',
    chunks: [
      ['Jim had not yet seen his beautiful present.', 'ジムは、まだ自分へのすてきな贈り物を見ていなかった'],
    ],
    notes: {
      'Jim had not yet seen his beautiful present.': 'had not yet seen は過去完了で「（そのときまで）まだ見ていなかった」。his beautiful present は、デラがジムに買った鎖のことです。',
    },
  }),
  // 132
  ls('[S She] [V held] [O it] [M out] [M {前| to him}] [M eagerly] [M {前| upon her open palm}].', {
    ja: 'デラは、広げた手のひらにのせて、それをいそいそとジムに差し出した。',
    chunks: [
      ['She held it out to him eagerly upon her open palm.', '彼女は広げた手のひらにのせて、それをいそいそとジムに差し出した'],
    ],
    notes: {
      'She held it out to him eagerly upon her open palm.': 'hold A out で「A を差し出す」。eagerly は「いそいそと・熱心に」。palm は「手のひら」。',
    },
  }),
  // 133
  ls('[S The dull precious metal] [V seemed] [C {to:補語| [V to flash] [M {前| with a reflection {前| of her {並列| bright | and ardent} spirit}}]}].', {
    ja: 'くすんだ色の貴金属が、デラの明るく熱い心を映して、きらりと光ったようだった。',
    chunks: [
      ['The dull precious metal seemed to flash', 'くすんだ色の貴金属が、きらりと光ったようだった'],
      ['with a reflection of her bright and ardent spirit.', '彼女の明るく熱い心を映して'],
    ],
    notes: {
      'The dull precious metal seemed to flash': 'dull は「つやのない・くすんだ」。precious metal は「貴金属」で、プラチナのこと。seem to do で「〜するように見える」。',
      'with a reflection of her bright and ardent spirit.': 'reflection は「映り・反射」。ardent は「熱い・熱烈な」。spirit は「心・気持ち」。',
    },
  }),
  // 134
  ls('“[V Isn’t] [S it] [C a dandy], [独 Jim]?', {
    p: true,
    ja: '「すてきでしょう、ジム？',
    chunks: [
      ['“Isn’t it a dandy, Jim?', '「すてきでしょう、ジム'],
    ],
    notes: {
      '“Isn’t it a dandy, Jim?': 'Isn’t it …? は「〜でしょう？」と同意を求める言い方です。dandy はくだけた言い方で「すてきなもの・逸品」。',
    },
  }),
  // 135
  ls('[S I] [V hunted] [M all {前| over town}] [M {to:副詞(目的)| [V to find] [O it]}].', {
    ja: '町じゅうを探し回って、見つけたのよ。',
    chunks: [
      ['I hunted all over town to find it.', 'それを見つけるために、町じゅうを探し回ったのよ'],
    ],
    notes: {
      'I hunted all over town to find it.': 'hunt は「探し回る」。all over A で「A じゅうを」。to find it は目的で「見つけるために」。',
    },
  }),
  // 136
  ls('[S You][V ’ll have to look] [M {前| at the time}] [M a hundred times a day] [M now].', {
    ja: 'これからは、一日に百回は時間を見なくちゃいけないわね。',
    chunks: [
      ['You’ll have to look at the time', '時間を見なくちゃいけないわね'],
      ['a hundred times a day now.', 'これからは一日に百回は'],
    ],
    notes: {
      'You’ll have to look at the time': 'You’ll は You will の短縮形です。have to do で「〜しなければならない」。',
      'a hundred times a day now.': 'a hundred times a day は「一日に百回」。すてきな鎖ができたので、何度も時計を見たくなるでしょう、というのです。',
    },
  }),
  // 137
  ls('[V Give] [O1 me] [O2 your watch].', {
    ja: '時計を貸して。',
    chunks: [
      ['Give me your watch.', '時計を貸して'],
    ],
    notes: {
      'Give me your watch.': 'Give A B で「A に B をちょうだい」。',
    },
  }),
  // 138
  ls('[S I] [V want] [O {to:名詞| [V to see] [O {疑問詞節| [C how] [S it] [V looks] [M {前| on it}]}]}].”', {
    ja: '時計につけたら、どんなふうに見えるか見たいの」',
    chunks: [
      ['I want to see how it looks on it.”', '時計につけたらどう見えるか、見たいの」'],
    ],
    notes: {
      'I want to see how it looks on it.”': 'how it looks on it は「それ（鎖）がそれ（時計）につけるとどう見えるか」。how は looks の補語です。',
    },
  }),
  // 139
  ls('[M {前| Instead of {動名詞| [V obeying]}}], [S Jim] [V tumbled down] [M {前| on the couch}] [接 and] [V put] [O his hands] [M {前| under the back {前| of his head}}] [接 and] [V smiled].', {
    p: true,
    ja: 'ジムは言われたとおりにはせずに、長いすにどさりとたおれこむと、両手を頭のうしろに組んで、にっこりほほえんだ。',
    chunks: [
      ['Instead of obeying,', '言われたとおりにするかわりに'],
      ['Jim tumbled down on the couch', 'ジムは長いすにどさりとたおれこんだ'],
      ['and put his hands under the back of his head and smiled.', 'そして両手を頭のうしろに組んで、ほほえんだ'],
    ],
    notes: {
      'Instead of obeying,': 'instead of doing で「〜するかわりに」。obey は「（言われたことに）従う」。',
      'Jim tumbled down on the couch': 'tumble down は「どさりとたおれこむ」。',
      'and put his hands under the back of his head and smiled.': 'tumbled・put・smiled の3つの動詞が並んでいます。',
    },
  }),
  // 140
  ls('[O {引用| “[独 Dell],”}] [V said] [S he], [O {引用| “[V let][O ’s] [C {原形| [V put] [O our Christmas presents] [M away] [接 and] [V keep] [O ’em] [M a while]}].}]', {
    p: true,
    ja: '「デル」とジムは言った。「クリスマスの贈り物は、二人ともしばらくしまっておこうよ。',
    chunks: [
      ['“Dell,” said he,', '「デル」と彼は言った'],
      ['“let’s put our Christmas presents away', '「クリスマスの贈り物をしまっておこう'],
      ['and keep ’em a while.', 'そして、しばらく取っておこう'],
    ],
    notes: {
      '“Dell,” said he,': 'said he は動詞が主語の前に出た形です。',
      '“let’s put our Christmas presents away': 'let’s は let us の短縮形で「〜しよう」。put A away で「A をしまう」。',
      'and keep ’em a while.': '’em は them のくだけた言い方です。a while は「しばらく」。',
    },
  }),
  // 141
  ls('[S They][V ’re] [C too nice {to:副詞(程度)| [V to use]}] [M just {前| at present}].', {
    ja: '今すぐ使うには、すてきすぎるからね。',
    chunks: [
      ['They’re too nice to use just at present.', '今のところ、使うにはすてきすぎるよ'],
    ],
    notes: {
      'They’re too nice to use just at present.': 'too … to do で「〜するには…すぎる」。at present は「今のところ」。本当は、使えないからしまっておこう、と言っています。',
    },
  }),
  // 142
  ls('[S I] [V sold] [O the watch] [M {to:副詞(目的)| [V to get] [O the money {to:形容詞>the money| [V to buy] [O your combs]}]}].', {
    ja: 'きみのくしを買うお金をつくるために、時計を売ったんだ。',
    chunks: [
      ['I sold the watch to get the money to buy your combs.', 'きみのくしを買うお金を手に入れるために、時計を売ったんだ'],
    ],
    notes: {
      'I sold the watch to get the money to buy your combs.': 'to get … は目的で「〜を手に入れるために」。to buy your combs が the money を後ろから説明し、「くしを買うためのお金」。デラが時計の鎖を買ったのに、ジムはその時計を売っていたのです。',
    },
  }),
  // 143
  ls('[接 And] [M now] [V suppose] [O {that省略| [S you] [V put] [O the chops] [M on]}].”', {
    ja: 'さあ、それじゃあ、お肉を焼いてくれないか」',
    chunks: [
      ['And now suppose you put the chops on.”', 'さあ、それじゃあ、お肉を火にかけてくれないか」'],
    ],
    notes: {
      'And now suppose you put the chops on.”': 'suppose (that) … はここでは「〜したらどうだろう」という提案の言い方です。put the chops on は「肉を火にかける」。',
    },
  }),
  // 144
  ls('[S The magi], [M {副詞節:様態| [接 as] [S you] [V know]}], [V were] [C wise men — {同格>wise men| wonderfully wise men} — {関係>wise men| [S who] [V brought] [O gifts] [M {前| to the Babe {前| in the manger}}]}].', {
    p: true,
    ja: '東方の三博士は、ご存じのように、賢い人たち——驚くほど賢い人たち——で、飼い葉おけに寝ている赤ん坊のイエスに、贈り物を届けた人たちだった。',
    chunks: [
      ['The magi, as you know, were wise men —', '東方の三博士は、ご存じのように、賢い人たちだった——'],
      ['wonderfully wise men —', '驚くほど賢い人たち——'],
      ['who brought gifts to the Babe in the manger.', '飼い葉おけの赤ん坊に贈り物を届けた（人たち）'],
    ],
    marks: [
      ['— —', 'ダッシュ2つで、「賢い人たち」を「驚くほど賢い人たち」と言い直して強める語句をはさみます。'],
    ],
    notes: {
      'The magi, as you know, were wise men —': 'as you know は「ご存じのように」。the magi は東方の三博士です。',
      'wonderfully wise men —': 'wise men を「驚くほど賢い人たち」と言い直して強めています。',
      'who brought gifts to the Babe in the manger.': 'who は wise men を説明する関係代名詞です。the Babe in the manger は「飼い葉おけに寝ている赤ん坊（イエス）」。',
    },
  }),
  // 145
  ls('[S They] [V invented] [O the art {前| of {動名詞| [V giving] [O Christmas presents]}}].', {
    ja: 'クリスマスに贈り物をするならわしを始めたのは、この人たちだ。',
    chunks: [
      ['They invented the art of giving Christmas presents.', '彼らが、クリスマスに贈り物をするならわしを始めた'],
    ],
    notes: {
      'They invented the art of giving Christmas presents.': 'invent は「考え出す・始める」。the art of doing は「〜するわざ・ならわし」。',
    },
  }),
  // 146
  ls('[M {分詞構文:理由| [V Being] [C wise]}], [S their gifts] [V were] [M {成句| no doubt}] [C wise ones], [M {分詞構文:付帯状況| [M possibly] [V bearing] [O the privilege {前| of exchange}] [M {前| in case of duplication}]}].', {
    ja: '賢い人たちなのだから、その贈り物もきっと賢いもので、もしかすると、ほかの人の贈り物とかち合ったときには取りかえてもらえる特典まで付いていたかもしれない。',
    chunks: [
      ['Being wise, their gifts were no doubt wise ones,', '賢い人たちなので、その贈り物もきっと賢いものだった'],
      ['possibly bearing the privilege of exchange', 'もしかすると、取りかえてもらえる特典が付いていて'],
      ['in case of duplication.', '贈り物がかち合った場合には'],
    ],
    notes: {
      'Being wise, their gifts were no doubt wise ones,': 'Being wise は分詞構文で「賢いので」。意味の上の主語は三博士ですが、文の主語は their gifts になっています（語り手のくだけた書き方）。no doubt は「きっと」。ones は gifts のことです。',
      'possibly bearing the privilege of exchange': 'bear the privilege of A で「A の特典が付いている」。exchange は「交換」。',
      'in case of duplication.': 'in case of A で「A の場合には」。duplication は「（贈り物の）重なり」。',
    },
  }),
  // 147
  ls('[接 And] [M here] [S I] [V have] [M lamely] [V related] [M {前| to you}] [O the uneventful chronicle {前| of two foolish children {前| in a flat} {関係>two foolish children| [S who] [M most unwisely] [V sacrificed] [M {前| for each other}] [O the greatest treasures {前| of their house}]}}].', {
    ja: 'さて、ここにわたしは、部屋を借りて暮らす二人のおろかな子どもたちの、何ということもない話を、へたなりにお話しした。二人は、自分たちの家のいちばんの宝物を、まことに賢くないやり方で、おたがいのためにぎせいにしてしまったのだった。',
    chunks: [
      ['And here I have lamely related', 'さて、ここにわたしは、へたなりにお話しした'],
      ['to you the uneventful chronicle of two foolish children', 'みなさんに、二人のおろかな子どもたちの、何ということもない話を'],
      ['in a flat who most unwisely sacrificed', '部屋を借りて暮らす（二人）で、まことに賢くないやり方でぎせいにした'],
      ['for each other the greatest treasures of their house.', 'おたがいのために、家のいちばんの宝物を'],
    ],
    notes: {
      'And here I have lamely related': 'have related は現在完了で「（今まで）語ってきた」。lamely は「へたに・ぎこちなく」。',
      'to you the uneventful chronicle of two foolish children': 'relate A to B で「A を B に話す」で、ここでは to you が先に来ています。uneventful chronicle は「特に事件もない記録（話）」。',
      'in a flat who most unwisely sacrificed': 'who は two foolish children を説明する関係代名詞です。most unwisely は「まことに賢くないやり方で」。',
      'for each other the greatest treasures of their house.': 'sacrifice A for B で「B のために A をぎせいにする」。',
    },
  }),
  // 148
  ls('[接 But] [M {前| in a last word {前| to the wise {前| of these days}}}] [V let] [仮O it] [C {原形| [V be said]}] [真O {that節| [接 that] [M {前| of all {関係>all| [S who] [V give] [O gifts]}}] [S these two] [V were] [C the wisest]}].', {
    ja: 'けれども、今の世の賢い人たちに、最後にひとこと言っておこう。贈り物をする人たちのうちで、この二人こそ、いちばん賢かったのだ、と。',
    chunks: [
      ['But in a last word to the wise of these days', 'けれども、今の世の賢い人たちへの最後のひとことで'],
      ['let it be said that', 'こう言わせてもらおう'],
      ['of all who give gifts these two were the wisest.', '贈り物をする人すべてのうちで、この二人がいちばん賢かったと'],
    ],
    notes: {
      'But in a last word to the wise of these days': 'a last word は「最後のひとこと」。the wise は「賢い人たち」（the＋形容詞）。of these days は「今の時代の」。',
      'let it be said that': 'let it be said that … で「…と言わせてもらおう」。it は形式目的語で、中身は that 以下です。',
      'of all who give gifts these two were the wisest.': 'of all who give gifts は「贈り物をする人すべてのうちで」。the wisest は「いちばん賢い」。',
    },
  }),
  // 149
  ls('[M {前| Of all {関係>all| [S who] [V give] [接 and] [V receive] [O gifts]}}], [S {成句| such as they}] [V are] [C wisest].', {
    ja: '贈り物をしたり、もらったりする人たちのうちで、こういう人たちこそ、いちばん賢いのだ。',
    chunks: [
      ['Of all who give and receive gifts, such as they are wisest.', '贈り物をしたりもらったりする人のうちで、こういう人たちがいちばん賢い'],
    ],
    notes: {
      'Of all who give and receive gifts, such as they are wisest.': 'Of all who … は「…する人すべてのうちで」。such as they は「彼らのような人たち」。wisest は最上級で、ここでは the が省かれています。',
    },
  }),
  // 150
  ls('[M Everywhere] [S they] [V are] [C wisest].', {
    ja: 'どこにいようと、この人たちがいちばん賢い。',
    chunks: [
      ['Everywhere they are wisest.', 'どこでも、この人たちがいちばん賢い'],
    ],
    notes: {
      'Everywhere they are wisest.': 'everywhere は「どこでも」。同じ wisest をくり返して、強く言い切っています。',
    },
  }),
  // 151
  ls('[S They] [V are] [C the magi].', {
    ja: 'この人たちこそ、東方の三博士なのだ。',
    chunks: [
      ['They are the magi.', 'この人たちこそ、東方の三博士なのだ'],
    ],
    notes: {
      'They are the magi.': 'the magi（東方の三博士）は、賢い贈り物の元祖です。自分のいちばんの宝物を手放して相手に贈った二人こそ、本当の賢者だ、と物語は結ばれます。',
    },
  }),
])
