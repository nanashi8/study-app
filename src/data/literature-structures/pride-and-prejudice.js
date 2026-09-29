import { ls } from './entry.js'

export default Object.freeze([
  // 1
  ls('[仮S It] [V is] [C a truth {過去分詞>a truth| [M universally] [V acknowledged]}], [真S {that節| [接 that] [S a single man {前| in possession {前| of a good fortune}}] [V must be] [C {前| in want {前| of a wife}}]}].', {
    p: true,
    ja: '財産のたっぷりある独身の男は、きっと妻をほしがっているにちがいない。これは世の誰もが認める真理である。',
    chunks: [
      ['It is a truth universally acknowledged,', 'それは世の誰もが認める真理である（何がかは次へ）'],
      ['that a single man in possession of a good fortune', '財産のたっぷりある独身の男は'],
      ['must be in want of a wife.', 'きっと妻をほしがっているにちがいない、ということは'],
    ],
    notes: {
      'It is a truth universally acknowledged,': 'It は形式主語で、中身は that 以下です。universally acknowledged（世間一般に認められた）が a truth を後ろから説明します。',
      'that a single man in possession of a good fortune': 'in possession of A で「A を持っている」。good fortune は「かなりの財産」。',
      'must be in want of a wife.': 'be in want of A で「A をほしがっている」。must は「〜にちがいない」。本当は周りの家族のほうが娘の結婚相手をほしがっている、という皮肉を込めた有名な書き出しです。',
    },
  }),
  // 2
  ls('[M {副詞節:譲歩| [C However little known] [S the {並列| feelings | or views} {前| of such a man}] [V may be] [M {前| on {動名詞| [M his first] [V entering] [O a neighbourhood]}}]}], [S this truth] [V is] [M so well] [V fixed] [M {前| in the minds {前| of the surrounding families}}], [M {副詞節:結果| [接 that] [S he] [V is considered] [C {前| as the rightful property {前| of {成句| some one or other}} {前| of their daughters}}]}].', {
    p: true,
    ja: 'そういう男が近所へ初めて越してきたとき、本人の気持ちや考えがどれほど知られていなくても、この真理は周りの家々の心にしっかりと根づいているので、その男は、どこかの家の娘の誰かが当然手に入れるべき財産だと見なされるのである。',
    chunks: [
      ['However little known the feelings or views', 'どれほど知られていなくても、気持ちや考えが'],
      ['of such a man may be on his first entering a neighbourhood,', 'そういう男が初めて近所へやって来たときに'],
      ['this truth is so well fixed in the minds', 'この真理は心にしっかりと根づいている'],
      ['of the surrounding families,', '周りの家々の'],
      ['that he is considered as the rightful property', 'そのため、その男は当然の持ち物と見なされる'],
      ['of some one or other of their daughters.', 'その家の娘たちの誰かの'],
    ],
    unitNotes: {
      'some one or other': '「誰か（ひとり）」という決まった言い方です。',
    },
    notes: {
      'However little known the feelings or views': 'however＋形容詞で「どれほど〜でも」。However little known … may be で「どれほど知られていなくても」。',
      'of such a man may be on his first entering a neighbourhood,': 'on doing で「〜したときに」。his first entering は「彼が初めて入ること」で、his が動名詞の意味の上の主語です。',
      'this truth is so well fixed in the minds': 'so … that ～ で「とても…なので～」。be fixed in A は「A に根づいている」。',
      'that he is considered as the rightful property': 'be considered as A で「A と見なされる」。rightful property は「当然の持ち物」で、男性を財産のように扱う皮肉です。',
    },
  }),
  // 3
  ls('[O {引用| “[独 My dear Mr. Bennet],”}] [V said] [S his lady] [M {前| to him}] [M one day], [O {引用| “[V have] [S you] [V heard] [O {that節| [接 that] [S Netherfield Park] [V is let] [M {前| at last}]}]?”}]', {
    p: true,
    ja: '「ねえ、あなた」と、ある日ベネット夫人が夫に言った。「ネザーフィールド・パークに、とうとう借り手がついたって聞きました？」',
    chunks: [
      ['“My dear Mr. Bennet,”', '「ねえ、あなた」'],
      ['said his lady to him one day,', 'とある日、夫人が夫に言った'],
      ['“have you heard that Netherfield Park is let at last?”', '「ネザーフィールド・パークがとうとう貸し出されたって聞きました？」'],
    ],
    notes: {
      '“My dear Mr. Bennet,”': 'My dear Mr. Bennet は夫への呼びかけで、文の骨組みの外にある独立語です。当時の夫婦は、改まって姓で呼び合うことがありました。',
      'said his lady to him one day,': '会話文のあとでは、said his lady のように動詞が主語の前に出ることがよくあります。his lady は「彼の妻」。',
      '“have you heard that Netherfield Park is let at last?”': 'be let は「（家が）貸し出される」。Netherfield Park は近くの大きな屋敷の名前です。',
    },
  }),
  // 4
  ls('[S Mr. Bennet] [V replied] [O {that節| [接 that] [S he] [V had not]}].', {
    p: true,
    ja: 'ベネット氏は、聞いていないと答えた。',
    chunks: [
      ['Mr. Bennet replied that he had not.', 'ベネット氏は、聞いていないと答えた'],
    ],
    notes: {
      'Mr. Bennet replied that he had not.': 'had not のあとに heard が省かれています。「聞いていなかった」。',
    },
  }),
  // 5
  ls('[O {引用| “[接 But] [S it] [V is],”}] [V returned] [S she]; [O {引用| “[接 for] [S Mrs. Long] [V has] [M just] [V been] [M here], [接 and] [S she] [V told] [O1 me] [O2 all {前| about it}].”}]', {
    p: true,
    ja: '「でも、そうなのよ」と夫人は言い返した。「だって、今しがたロングさんがここへ来て、すっかり話してくれたんですもの。」',
    chunks: [
      ['“But it is,” returned she;', '「でも、そうなのよ」と夫人は言い返した'],
      ['“for Mrs. Long has just been here,', '「だって、ロングさんがたった今ここへ来て'],
      ['and she told me all about it.”', 'すっかり話してくれたんですもの」'],
    ],
    marks: [
      [';', 'セミコロンで、夫人の言葉「でも本当よ」と、その理由「ロングさんが来て全部話してくれたから」を区切っています。2つ目の引用は for（というのも）で始まります。'],
    ],
    notes: {
      '“But it is,” returned she;': 'it is のあとに let（貸し出されている）が省かれています。return はここでは「言い返す」。returned she は動詞が主語の前に出た形です。',
      '“for Mrs. Long has just been here,': 'for は「というのも」と理由を続ける接続詞。has just been here は「たった今ここへ来たところだ」。',
      'and she told me all about it.”': 'tell＋人＋もので「人にものを話す」。all about it は「それについて全部」。',
    },
  }),
  // 6
  ls('[S Mr. Bennet] [V made] [O no answer].', {
    p: true,
    ja: 'ベネット氏は何も答えなかった。',
    chunks: [
      ['Mr. Bennet made no answer.', 'ベネット氏は何も答えなかった'],
    ],
    notes: {
      'Mr. Bennet made no answer.': 'make no answer は「何も答えない」。',
    },
  }),
  // 7
  ls('[O {引用| “[V Do not] [S you] [V want] [O {to:名詞| [V to know] [O {疑問詞節| [S who] [V has taken] [O it]}]}]?”}] [V cried] [S his wife], [M impatiently].', {
    p: true,
    ja: '「誰が借りたのか、知りたくないの？」と夫人はじれったそうに声を上げた。',
    chunks: [
      ['“Do not you want to know who has taken it?”', '「誰が借りたのか知りたくないの？」'],
      ['cried his wife, impatiently.', 'と夫人はじれったそうに声を上げた'],
    ],
    notes: {
      '“Do not you want to know who has taken it?”': 'Do not you …? は今の Don’t you …? にあたる古い語順です。who has taken it は「誰がそれを借りたのか」という間接疑問で、know の目的語です。',
      'cried his wife, impatiently.': 'cry はここでは「叫ぶ・声を上げる」。impatiently は「じれったそうに」。',
    },
  }),
  // 8
  ls('“[S You] [V want] [O {to:名詞| [V to tell] [O me]}], [接 and] [S I] [V have] [O no objection {前| to {動名詞| [V hearing] [O it]}}].”', {
    p: true,
    ja: '「おまえが話したいのだろう。聞くのなら、ちっとも構わないよ。」',
    chunks: [
      ['“You want to tell me,', '「おまえが私に話したいのだろう'],
      ['and I have no objection to hearing it.”', 'そして私は聞くことに反対はないよ」'],
    ],
    notes: {
      '“You want to tell me,': '妻の Do not you want …? の you を受けて、「話したいのはおまえのほうだろう」と言い返しています。',
      'and I have no objection to hearing it.”': 'have no objection to doing で「〜するのは構わない」。to は前置詞なので、後ろは動名詞 hearing です。',
    },
  }),
  // 9
  ls('[S This] [V was] [C invitation enough].', {
    p: true,
    ja: '夫人が話し出すには、それだけで十分な誘いだった。',
    chunks: [
      ['This was invitation enough.', 'それだけで十分な誘いだった'],
    ],
    notes: {
      'This was invitation enough.': 'invitation enough は「十分な誘い」で、enough が名詞の後ろに置かれています。夫の気のない返事でも、夫人には話し出すきっかけとして十分だった、という皮肉です。',
    },
  }),
  // 10
  ls('“[独 Why], [独 my dear], [M {挿入| you must know}], [S Mrs. Long] [V says] [O {that節| [接 that] [S Netherfield] [V is taken] [M {前| by a young man {前| of large fortune} {前| from the north {前| of England}}}]}; {that節| [接 that] [S he] [V came down] [M {前| on Monday}] [M {前| in {成句| a chaise and four}}] [M {to:副詞(目的)| [V to see] [O the place]}], [接 and] [V was] [M so much] [V delighted] [M {前| with it}] [M {副詞節:結果| [接 that] [S he] [V agreed] [M {前| with Mr. Morris}] [M immediately]}]}; {that節| [接 that] [S he] [V is to take] [O possession] [M {前| before Michaelmas}], [接 and] [S some {前| of his servants}] [V are to be] [M {前| in the house}] [M {前| by the end {前| of next week}}]}].”', {
    p: true,
    ja: '「まあ、あなた、聞いてちょうだい。ロングさんの話では、ネザーフィールドを借りたのは、イングランド北部から来た大変な財産家の若い人なんですって。月曜日に四頭立ての馬車で屋敷を見に来て、すっかり気に入って、その場でモリスさんと話をまとめたそうよ。ミカエル祭の前には入居して、来週の終わりまでには使用人の何人かが屋敷に来るんですって。」',
    chunks: [
      ['“Why, my dear, you must know,', '「まあ、あなた、聞いてちょうだい'],
      ['Mrs. Long says that Netherfield is taken', 'ロングさんが言うには、ネザーフィールドを借りたのは'],
      ['by a young man of large fortune from the north of England;', 'イングランド北部から来た、大変な財産のある若い人ですって'],
      ['that he came down on Monday in a chaise and four', 'その人は月曜日に四頭立ての馬車でやって来て'],
      ['to see the place,', '屋敷を見に'],
      ['and was so much delighted with it', 'すっかり気に入ったので'],
      ['that he agreed with Mr. Morris immediately;', 'その場でモリスさんと話をまとめたの'],
      ['that he is to take possession before Michaelmas,', 'ミカエル祭の前には入居することになっていて'],
      ['and some of his servants are to be in the house', '使用人の何人かは屋敷に来ることになっているのよ'],
      ['by the end of next week.”', '来週の終わりまでに」'],
    ],
    unitNotes: {
      'a chaise and four': '「四頭の馬が引く軽い馬車」。馬車（chaise）と四頭（four）で一つの乗り物を表す決まった言い方です。',
    },
    marks: [
      [';', 'セミコロンで区切りながら、ロングさんから聞いた知らせ（that 節）を並べます。1つ目は「北イングランドの大金持ちの若者が借りた」。'],
      [';', '2つ目の区切りです。3つ目の that 節「ミカエル祭の前に入居し、使用人も来週末までに来る」へ続け、聞いた話を一気にまくしたてる調子を出しています。'],
    ],
    notes: {
      '“Why, my dear, you must know,': 'Why はここでは「まあ」という驚きの間投詞です。you must know は「聞いてちょうだい」と話を切り出す言い方です。',
      'Mrs. Long says that Netherfield is taken': 'is taken は「借りられている」。says の目的語の that 節が、セミコロンで区切られて3つ続きます。',
      'that he came down on Monday in a chaise and four': '四頭立ての馬車は裕福さのしるしです。',
      'and was so much delighted with it': 'so … that ～ で「とても…なので～」。be delighted with A は「A がとても気に入る」。',
      'that he agreed with Mr. Morris immediately;': 'agree with A は「A と話がまとまる」。Mr. Morris は屋敷の貸し手の代理人です。',
      'that he is to take possession before Michaelmas,': 'be to do で「〜することになっている」（予定）。take possession は「入居する」。Michaelmas はミカエル祭（9月29日）です。',
    },
  }),
  // 11
  ls('“[C What] [V is] [S his name]?”', {
    p: true,
    ja: '「その人の名前は？」',
    chunks: [
      ['“What is his name?”', '「その人の名前は？」'],
    ],
    notes: {
      '“What is his name?”': '夫はそっけなく名前だけをたずねます。',
    },
  }),
  // 12
  ls('“[独 Bingley].”', {
    p: true,
    fragment: true,
    ja: '「ビングリーよ。」',
    chunks: [
      ['“Bingley.”', '「ビングリーよ」'],
    ],
    notes: {
      '“Bingley.”': '名前だけを答えた一語の文です。',
    },
  }),
  // 13
  ls('“[V Is] [S he] [C {並列| married | or single}]?”', {
    p: true,
    ja: '「その人は結婚しているのかね、独身かね？」',
    chunks: [
      ['“Is he married or single?”', '「結婚しているのかね、独身かね？」'],
    ],
    notes: {
      '“Is he married or single?”': 'married or single は「結婚しているか独身か」。夫もじつは、妻の関心のありかを見抜いています。',
    },
  }),
  // 14
  ls('“[独 Oh], [独 single], [独 my dear], [M {成句| to be sure}]!', {
    p: true,
    fragment: true,
    ja: '「ええ、もちろん独身よ、あなた！',
    chunks: [
      ['“Oh, single, my dear, to be sure!', '「ええ、独身よ、あなた、もちろん！'],
    ],
    unitNotes: {
      'to be sure': '「もちろん・確かに」という決まった言い方です。',
    },
    notes: {
      '“Oh, single, my dear, to be sure!': 'single は He is single（独身だ）の He is を省いた答えです。',
    },
  }),
  // 15
  ls('[独 A single man {前| of large fortune}]; [独 {並列| four | or five} thousand a year].', {
    fragment: true,
    ja: '大変な財産のある独身の人。年収は四千か五千ポンド。',
    chunks: [
      ['A single man of large fortune;', '大変な財産のある独身の人'],
      ['four or five thousand a year.', '年に四千か五千ポンド'],
    ],
    marks: [
      [';', 'セミコロンのあとで、「大変な財産」の中身を four or five thousand a year（年に四、五千ポンド）と具体的な数で言い足しています。'],
    ],
    notes: {
      'A single man of large fortune;': '動詞のない名詞だけの文で、うれしさのあまり要点だけを並べています。',
      'four or five thousand a year.': 'a year は「1年につき」。当時の年収四、五千ポンドは大金持ちの水準です。',
    },
  }),
  // 16
  ls('[独 What a fine thing {前| for our girls}]!”', {
    fragment: true,
    ja: 'うちの娘たちにとって、なんてすばらしいことでしょう！」',
    chunks: [
      ['What a fine thing for our girls!”', 'うちの娘たちにとって、なんてすばらしいことでしょう！」'],
    ],
    notes: {
      'What a fine thing for our girls!”': 'What a＋形容詞＋名詞！で「なんと〜な…だろう」という感嘆文。what a fine thing (it is) の it is が省かれています。our girls は「うちの娘たち」。',
    },
  }),
  // 17
  ls('“[独 How so]? [M how] [V can] [S it] [V affect] [O them]?”', {
    p: true,
    ja: '「どうしてだね？それが娘たちにどう関わるのかね？」',
    chunks: [
      ['“How so? how can it affect them?”', '「どうしてだね？それが娘たちにどう関わるのかね？」'],
    ],
    notes: {
      '“How so? how can it affect them?”': 'How so? は「どうしてそうなるのか」と聞き返す決まった言い方。affect は「影響する・関わる」。夫はわざと分からないふりをしています。',
    },
  }),
  // 18
  ls('[O {引用| “[独 My dear Mr. Bennet],”}] [V replied] [S his wife], [O {引用| “[M how] [V can] [S you] [V be] [C so tiresome]?}]', {
    p: true,
    ja: '「ねえ、あなた」と妻は答えた。「どうしてそんなに、人をうんざりさせるの？',
    chunks: [
      ['“My dear Mr. Bennet,” replied his wife,', '「ねえ、あなた」と妻は答えた'],
      ['“how can you be so tiresome?', '「どうしてそんなに人をうんざりさせるの？'],
    ],
    notes: {
      '“how can you be so tiresome?': 'How can you …? は「どうして〜なんてできるの」と相手を責める言い方。tiresome は「うんざりさせる・面倒な」。',
    },
  }),
  // 19
  ls('[S You] [V must know] [O {that節| [接 that] [S I] [V am thinking] [M {前| of {動名詞| [M his] [V marrying] [O one {前| of them}]}}]}].”', {
    ja: '分かっているでしょうに、私はあの人が娘の誰かと結婚することを考えているのよ。」',
    chunks: [
      ['You must know that I am thinking', '分かっているでしょう、私は考えているのよ'],
      ['of his marrying one of them.”', 'あの人が娘の一人と結婚することを」'],
    ],
    notes: {
      'You must know that I am thinking': 'must know は「知っているはずだ」。',
      'of his marrying one of them.”': 'his marrying … は「彼が〜と結婚すること」。動名詞 marrying の前の his が、意味の上の主語です。',
    },
  }),
  // 20
  ls('“[V Is] [S that] [C his design {前| in {動名詞| [V settling] [M here]}}]?”', {
    p: true,
    ja: '「それが、あの人がここに住む目的なのかね？」',
    chunks: [
      ['“Is that his design in settling here?”', '「それが、あの人がここに住む目的なのかね？」'],
    ],
    notes: {
      '“Is that his design in settling here?”': 'design はここでは「たくらみ・目的」。in doing は「〜するにあたって」。夫はわざととぼけています。',
    },
  }),
  // 21
  ls('“[独 Design]?', {
    p: true,
    fragment: true,
    ja: '「目的ですって？',
    chunks: [
      ['“Design?', '「目的ですって？'],
    ],
    notes: {
      '“Design?': '夫の言った design をくり返して、あきれた気持ちを表しています。',
    },
  }),
  // 22
  ls('[独 Nonsense], [M how] [V can] [S you] [V talk] [M so]!', {
    ja: 'ばかばかしい、よくもそんなことが言えるわね！',
    chunks: [
      ['Nonsense, how can you talk so!', 'ばかばかしい、よくもそんなことが言えるわね！'],
    ],
    notes: {
      'Nonsense, how can you talk so!': 'Nonsense は「ばかばかしい」という間投詞。how can you talk so! は「よくもそんなことが言えるわね」。',
    },
  }),
  // 23
  ls('[接 But] [仮S it] [V is] [C very likely] [真S {that節| [接 that] [S he] [V may fall] [M {前| in love}] [M {前| with one {前| of them}}]}], [接 and] [M therefore] [S you] [V must visit] [O him] [M {副詞節:時| [接 as soon as] [S he] [V comes]}].”', {
    ja: 'でも、あの人が娘の誰かを好きになることは大いにありそうでしょう。だから、あの人が越してきたら、すぐにあなたが訪ねなくてはいけないのよ。」',
    chunks: [
      ['But it is very likely', 'でも、大いにありそうなことよ（何がかは次へ）'],
      ['that he may fall in love with one of them,', 'あの人が娘の誰かを好きになることは'],
      ['and therefore you must visit him as soon as he comes.”', 'だから、あの人が来たらすぐにあなたが訪ねなくてはいけないの」'],
    ],
    notes: {
      'But it is very likely': 'it は形式主語で、中身は that 以下です。likely は「ありそうな」。',
      'that he may fall in love with one of them,': 'fall in love with A は「A を好きになる」。',
      'and therefore you must visit him as soon as he comes.”': '当時は、新しく来た家の主人をまず父親が訪ねてあいさつしないと、娘たちが知り合いになれませんでした。',
    },
  }),
  // 24
  ls('“[S I] [V see] [O no occasion {前| for that}].', {
    p: true,
    ja: '「その必要はないと思うね。',
    chunks: [
      ['“I see no occasion for that.', '「その必要はないと思うね'],
    ],
    notes: {
      '“I see no occasion for that.': 'see no occasion for A は「A の必要を認めない」。',
    },
  }),
  // 25
  ls('[S {並列| You | and the girls}] [V may go] — [接 or] [S you] [V may send] [O them] [M {前| by themselves}], [M {関係,>前の内容| [S which] [M perhaps] [V will be] [C still better]}]; [接 for] [M {副詞節:理由| [接 as] [S you] [V are] [C as handsome {前| as any {前| of them}}]}], [S Mr. Bingley] [V might like] [O you] [M the best {前| of the party}].”', {
    ja: 'おまえと娘たちで行けばいい——いや、娘たちだけで行かせてもいいな。そのほうがたぶんもっといい。なにしろおまえは娘の誰にも負けないくらい美人だから、ビングリーさんは一行の中でおまえをいちばん気に入るかもしれないからね。」',
    chunks: [
      ['You and the girls may go —', 'おまえと娘たちで行けばいい——'],
      ['or you may send them by themselves,', 'あるいは娘たちだけで行かせてもいい'],
      ['which perhaps will be still better;', 'そのほうがたぶんもっといい'],
      ['for as you are as handsome as any of them,', 'なにしろおまえは娘の誰にも負けないくらい美人だから'],
      ['Mr. Bingley might like you the best of the party.”', 'ビングリーさんは一行の中でおまえをいちばん気に入るかもしれない」'],
    ],
    marks: [
      ['—', 'ダッシュで間を置いて、「おまえと娘たちで行けばいい」を「いや、娘たちだけで行かせてもいい」と言い直しています。'],
      [';', 'セミコロンのあとの for（というのも）で、「そのほうがいい」理由を冗談めかして続けます。'],
    ],
    notes: {
      'or you may send them by themselves,': 'by themselves は「彼女たちだけで」。',
      'which perhaps will be still better;': 'which は前の節「娘たちだけで行かせること」全体を受ける関係代名詞です。still は比較級を強めて「さらに」。',
      'for as you are as handsome as any of them,': 'for は「というのも」。as … as any of them で「娘の誰にも劣らず…」。handsome はここでは女性に使って「美しい」。',
      'Mr. Bingley might like you the best of the party.”': 'the party はここでは「（訪問する）一行」。妻をからかう冗談です。',
    },
  }),
  // 26
  ls('“[独 My dear], [S you] [V flatter] [O me].', {
    p: true,
    ja: '「あら、お上手ね。',
    chunks: [
      ['“My dear, you flatter me.', '「あなた、お上手ね'],
    ],
    notes: {
      '“My dear, you flatter me.': 'flatter は「お世辞を言う・持ち上げる」。you flatter me で「お世辞がうまいわね」。',
    },
  }),
  // 27
  ls('[S I] [M certainly] [V have had] [O my share {前| of beauty}], [接 but] [S I] [V do not pretend] [O {to:名詞| [V to be] [C anything extraordinary]}] [M now].', {
    ja: 'たしかに私も人並みに美しかったことはあるけれど、今はもう特別なものだなんてうぬぼれていないわ。',
    chunks: [
      ['I certainly have had my share of beauty,', 'たしかに私も人並みには美しかったけれど'],
      ['but I do not pretend to be anything extraordinary now.', '今は特別なものだなんて思っていないわ'],
    ],
    notes: {
      'I certainly have had my share of beauty,': 'have had one’s share of A は「A を人並みに持っていた」。',
      'but I do not pretend to be anything extraordinary now.': 'pretend to be A は「A だと言い張る・うぬぼれる」。anything extraordinary は「何か特別なもの」。',
    },
  }),
  // 28
  ls('[M {副詞節:時| [接 When] [S a woman] [V has] [O five grown-up daughters]}], [S she] [V ought to give over] [O {動名詞| [V thinking] [M {前| of her own beauty}]}].”', {
    ja: '年ごろの娘が五人もいたら、女は自分の美しさのことなど考えるのをやめるべきなのよ。」',
    chunks: [
      ['When a woman has five grown-up daughters,', '女が大人になった娘を五人も持ったら'],
      ['she ought to give over thinking of her own beauty.”', '自分の美しさのことを考えるのはやめるべきよ」'],
    ],
    notes: {
      'she ought to give over thinking of her own beauty.”': 'ought to は「〜すべきだ」。give over doing は「〜するのをやめる」という古い言い方です。',
    },
  }),
  // 29
  ls('“[M {前| In such cases}], [S a woman] [V has not] [M often] [O much beauty {to:形容詞>much beauty| [V to think] [M of]}].”', {
    p: true,
    ja: '「そういう場合、女には考えるほどの美しさは、たいてい残っていないものさ。」',
    chunks: [
      ['“In such cases,', '「そういう場合には'],
      ['a woman has not often much beauty to think of.”', '女にはたいてい、考えるほどの美しさは残っていないものさ」'],
    ],
    notes: {
      'a woman has not often much beauty to think of.”': 'has not often much A で「たいていあまり A を持っていない」。to think of が much beauty を後ろから説明し、「考えるほどの美しさ」。妻への皮肉です。',
    },
  }),
  // 30
  ls('“[接 But], [独 my dear], [S you] [V must] [M indeed] [V {並列| go | and see}] [O Mr. Bingley] [M {副詞節:時| [接 when] [S he] [V comes] [M {前| into the neighbourhood}]}].”', {
    p: true,
    ja: '「でも、あなた、ビングリーさんがこの近所に越してきたら、本当に訪ねていってくださらなくちゃ。」',
    chunks: [
      ['“But, my dear, you must indeed go and see Mr. Bingley', '「でも、あなた、本当にビングリーさんを訪ねていかなくちゃ'],
      ['when he comes into the neighbourhood.”', 'あの人がこの近所に来たら」'],
    ],
    notes: {
      '“But, my dear, you must indeed go and see Mr. Bingley': 'go and see A は「A を訪ねていく」。indeed は must を強めて「本当に」。',
    },
  }),
  // 31
  ls('“[S It] [V is] [C more {副詞節:比較| [接 than] [S I] [V engage] [M for]}], [M {挿入| I assure you}].”', {
    p: true,
    ja: '「それは約束しかねるね、本当に。」',
    chunks: [
      ['“It is more than I engage for, I assure you.”', '「それは私が引き受ける以上のことだよ、本当に」'],
    ],
    notes: {
      '“It is more than I engage for, I assure you.”': 'It is more than I engage for で「それは私が引き受けられる以上のことだ」、つまり「約束できない」。engage for は「約束する・請け合う」。I assure you は「本当に」と念を押す言い方です。',
    },
  }),
  // 32
  ls('“[接 But] [V consider] [O your daughters].', {
    p: true,
    ja: '「でも、娘たちのことを考えてちょうだい。',
    chunks: [
      ['“But consider your daughters.', '「でも、娘たちのことを考えてちょうだい'],
    ],
    notes: {
      '“But consider your daughters.': 'consider は「よく考える」。主語 you を省いた命令文です。',
    },
  }),
  // 33
  ls('[M Only] [V think] [O {疑問詞節| [C what an establishment] [S it] [V would be] [M {前| for one {前| of them}}]}].', {
    ja: 'それが娘の一人にとって、どれほどの良縁になるか、ちょっと考えてもみて。',
    chunks: [
      ['Only think what an establishment it would be for one of them.', 'それが娘の一人にとってどんな良縁になるか、ちょっと考えてみて'],
    ],
    notes: {
      'Only think what an establishment it would be for one of them.': 'Only think … で「ちょっと考えてもみて」。establishment はここでは「身を落ち着ける先・良縁」。what an establishment it would be は「それがなんという良縁になることか」。',
    },
  }),
  // 34
  ls('[S {並列| Sir William | and Lady Lucas}] [V are] [C determined {to:副詞(形容詞)| [V to go]}], [M merely {前| on that account}]; [接 for] [M {前| in general}], [M {挿入| you know}], [S they] [V visit] [O no new comers].', {
    ja: 'サー・ウィリアムとルーカス夫人は、ただそれだけのために行くつもりでいるのよ。だって、ふだんは新しく越してきた人なんて訪ねない人たちでしょう。',
    chunks: [
      ['Sir William and Lady Lucas are determined to go,', 'サー・ウィリアムとルーカス夫人は行くと決めているのよ'],
      ['merely on that account;', 'ただそれだけのために'],
      ['for in general, you know, they visit no new comers.', 'だって、ふだんは新しく来た人は訪ねないでしょう'],
    ],
    marks: [
      [';', 'セミコロンのあとの for（というのも）で、「それだけのために行く」ことが特別である理由（ふだんは新しく来た人を訪ねない）を付け足します。'],
    ],
    notes: {
      'Sir William and Lady Lucas are determined to go,': 'be determined to do で「〜しようと決めている」。',
      'merely on that account;': 'on that account は「その理由で」。merely は「ただ〜だけ」。',
      'for in general, you know, they visit no new comers.': 'you know は「ほら」と相手に同意を求める言い方。new comer は「新しく来た人」。',
    },
  }),
  // 35
  ls('[M Indeed] [S you] [V must go], [接 for] [仮S it] [V will be] [C impossible] [真S {前:意味上の主語| for us} {to:名詞| [V to visit] [O him]}], [M {副詞節:条件| [接 if] [S you] [V do not]}].”', {
    ja: '本当に、あなたが行かなくちゃ。あなたが行かないと、私たちがあの人を訪ねることはできないんですもの。」',
    chunks: [
      ['Indeed you must go,', '本当に、あなたが行かなくちゃ'],
      ['for it will be impossible for us to visit him,', 'というのも、私たちがあの人を訪ねるのは無理だから'],
      ['if you do not.”', 'あなたが行かなければ」'],
    ],
    notes: {
      'for it will be impossible for us to visit him,': 'it は形式主語で、中身は for us to visit him。for us は不定詞の意味の上の主語で、「私たちが訪ねること」。',
      'if you do not.”': 'do not のあとに go が省かれています。',
    },
  }),
  // 36
  ls('“[S You] [V are] [M over] [C scrupulous], [M surely].', {
    p: true,
    ja: '「おまえは気にしすぎだよ、まったく。',
    chunks: [
      ['“You are over scrupulous, surely.', '「おまえは気をつかいすぎだよ、まったく'],
    ],
    notes: {
      '“You are over scrupulous, surely.': 'over scrupulous は「こだわりすぎる・気をつかいすぎる」。over は「〜しすぎ」。',
    },
  }),
  // 37
  ls('[S I] [V dare say] [O {that省略| [S Mr. Bingley] [V will be] [C very glad {to:副詞(原因)| [V to see] [O you]}]}]; [接 and] [S I] [V will send] [O a few lines] [M {前| by you}] [M {to:副詞(目的)| [V to assure] [O him] [M {前| of my hearty consent {前| to {動名詞| [M his] [V marrying] [O {what節| [O whichever] [S he] [V chooses] [M {前| of the girls}]}]}}}]}] — [M {副詞節:譲歩| [接 though] [S I] [V must throw in] [O a good word] [M {前| for my little Lizzy}]}].”', {
    ja: 'ビングリーさんは、おまえに会えばきっと大喜びするだろう。それに、娘のうちの誰を選んで結婚しようと心から賛成だと伝えるために、おまえに手紙を二、三行持たせてやろう——もっとも、かわいいリジーのことは、ひとことほめておかなくてはならないがね。」',
    chunks: [
      ['I dare say Mr. Bingley will be very glad to see you;', 'きっとビングリーさんはおまえに会えば大喜びするだろう'],
      ['and I will send a few lines by you', 'それに私もおまえに手紙を二、三行持たせよう'],
      ['to assure him of my hearty consent', '私が心から賛成していると請け合うために'],
      ['to his marrying whichever he chooses of the girls —', '娘のうちの誰を選んで結婚しようと——'],
      ['though I must throw in a good word for my little Lizzy.”', 'もっとも、かわいいリジーのことはひとことほめておかねばならないが」'],
    ],
    marks: [
      [';', 'セミコロンのあとの and で、「ビングリーさんは喜ぶだろう」に「私も手紙を託そう」と、夫の提案を付け足します。'],
      ['—', 'ダッシュのあとに though 以下を添え、「ただしリジーのことは一言ほめておこう」と、話の終わりにひと言付け加えます。'],
    ],
    notes: {
      'I dare say Mr. Bingley will be very glad to see you;': 'I dare say は「たぶん・きっと」。be glad to do で「〜してうれしい」。',
      'and I will send a few lines by you': 'a few lines は「短い手紙」。by you は「おまえに託して」。',
      'to assure him of my hearty consent': 'assure A of B で「A に B を請け合う」。hearty consent は「心からの同意」。',
      'to his marrying whichever he chooses of the girls —': 'consent to A は「A への同意」。whichever he chooses of the girls は「娘たちのうち彼が選ぶ誰でも」。',
      'though I must throw in a good word for my little Lizzy.”': 'throw in a good word for A は「A のためにひとこと口添えする」。Lizzy は次女エリザベスの愛称で、この小説の主人公です。',
    },
  }),
  // 38
  ls('“[S I] [V desire] [O {that省略| [S you] [V will do] [O no such thing]}].', {
    p: true,
    ja: '「そんなこと、絶対にしないでちょうだい。',
    chunks: [
      ['“I desire you will do no such thing.', '「そんなことは何もしないでほしいわ'],
    ],
    notes: {
      '“I desire you will do no such thing.': 'I desire (that) you will … は「〜してほしい」という強い願い。no such thing は「そんなことは何も（〜ない）」。',
    },
  }),
  // 39
  ls('[S Lizzy] [V is not] [M a bit] [C better {前| than the others}]: [接 and] [S I] [V am] [C sure {that省略| [S she] [V is not] [C {並列| half so handsome {前| as Jane}, | nor half so good-humoured {前| as Lydia}}]}].', {
    ja: 'リジーはほかの娘たちより少しもいいところなんかありません。ジェーンの半分も美人じゃないし、リディアの半分も気立てがよくないのは確かよ。',
    chunks: [
      ['Lizzy is not a bit better than the others:', 'リジーはほかの娘たちより少しもよくないわ'],
      ['and I am sure she is not half so handsome as Jane,', 'それに、ジェーンの半分も美人じゃないし'],
      ['nor half so good-humoured as Lydia.', 'リディアの半分も気立てがよくないのは確かよ'],
    ],
    marks: [
      [':', 'コロンのあとで、「リジーはほかの娘より少しもよくない」の中身を、ジェーンやリディアと比べて具体的に言います。'],
    ],
    notes: {
      'Lizzy is not a bit better than the others:': 'not a bit は「少しも〜ない」。',
      'and I am sure she is not half so handsome as Jane,': 'not half so … as A で「A の半分も…でない」。Jane は長女です。',
      'nor half so good-humoured as Lydia.': 'nor は「〜もまた…ない」。good-humoured は「機嫌のよい・気立てのよい」。Lydia は末娘で、母親のお気に入りです。',
    },
  }),
  // 40
  ls('[接 But] [S you] [V are] [M always] [V giving] [O1 her] [O2 the preference].”', {
    ja: 'なのに、あなたはいつもあの子ばかりひいきするんだから。」',
    chunks: [
      ['But you are always giving her the preference.”', 'なのに、あなたはいつもあの子をひいきしてばかり」'],
    ],
    notes: {
      'But you are always giving her the preference.”': 'be always doing は「いつも〜してばかりいる」と不満を表す言い方。give A the preference は「A をひいきする」。',
    },
  }),
  // 41
  ls('[O {引用| “[S They] [V have] [M none {前| of them}] [O much {to:形容詞>much| [V to recommend] [O them]}],”}] [V replied] [S he]: [O {引用| “[S they] [V are] [M all] [C {並列| silly | and ignorant}] [M {前| like other girls}]; [接 but] [S Lizzy] [V has] [O something more {前| of quickness} {前| than her sisters}].”}]', {
    p: true,
    ja: '「娘たちはどれも、たいしてほめるところなどないね」と夫は答えた。「ほかの娘と同じで、みんなばかで物知らずだ。だがリジーは、ほかの姉妹より少しは頭の回転が速い。」',
    chunks: [
      ['“They have none of them much to recommend them,” replied he:', '「あの子たちはどれもたいして取り柄がない」と夫は答えた'],
      ['“they are all silly and ignorant like other girls;', '「みんなほかの娘と同じで、ばかで物知らずだ'],
      ['but Lizzy has something more of quickness than her sisters.”', 'だがリジーには姉妹よりいくらか機転がある」'],
    ],
    marks: [
      [':', 'コロンのあとに、夫の言葉の続き（娘たちはみな愚かで物知らずだが、リジーは少し頭の回転が速い）を示します。'],
      [';', 'セミコロンのあとの but で、娘たちみんなの話から、リジーだけの話へ切りかえます。'],
    ],
    notes: {
      '“They have none of them much to recommend them,” replied he:': 'They have none of them … は「彼女たちは誰も〜ない」（None of them has …）。much to recommend them は「彼女たちをほめる材料」。replied he は動詞が主語の前に出た形です。',
      'but Lizzy has something more of quickness than her sisters.”': 'something more of A than B で「B よりいくらか多くの A」。quickness は「頭の回転の速さ・機転」。',
    },
  }),
  // 42
  ls('“[独 Mr. Bennet], [M how] [V can] [S you] [V abuse] [O your own children] [M {前| in such a way}]?', {
    p: true,
    ja: '「あなた、どうして自分の子どもたちをそんなふうに悪く言えるの？',
    chunks: [
      ['“Mr. Bennet, how can you abuse your own children', '「あなた、どうして自分の子どもたちを悪く言えるの'],
      ['in such a way?', 'そんなふうに'],
    ],
    notes: {
      '“Mr. Bennet, how can you abuse your own children': 'abuse はここでは「悪く言う・ののしる」。How can you …? は相手を責める言い方です。',
    },
  }),
  // 43
  ls('[S You] [V take] [O delight] [M {前| in {動名詞| [V vexing] [O me]}}].', {
    ja: 'あなたは私を困らせて楽しんでいるのね。',
    chunks: [
      ['You take delight in vexing me.', 'あなたは私を困らせて楽しんでいるのね'],
    ],
    notes: {
      'You take delight in vexing me.': 'take delight in doing で「〜して喜ぶ」。vex は「いらだたせる・困らせる」。',
    },
  }),
  // 44
  ls('[S You] [V have] [O no compassion {前| on my poor nerves}].”', {
    ja: '私のかわいそうな神経のことなんて、ちっとも思いやってくれないんだから。」',
    chunks: [
      ['You have no compassion on my poor nerves.”', '私のかわいそうな神経を少しも思いやってくれないのね」'],
    ],
    notes: {
      'You have no compassion on my poor nerves.”': 'have compassion on A は「A を気の毒に思う」。nerves（神経）は、ベネット夫人が「神経が弱い」といつも口にする言葉です。',
    },
  }),
  // 45
  ls('“[S You] [V mistake] [O me], [独 my dear].', {
    p: true,
    ja: '「それは誤解だよ、おまえ。',
    chunks: [
      ['“You mistake me, my dear.', '「それは誤解だよ、おまえ'],
    ],
    notes: {
      '“You mistake me, my dear.': 'mistake＋人で「人の言うことを誤解する」。',
    },
  }),
  // 46
  ls('[S I] [V have] [O a high respect {前| for your nerves}].', {
    ja: 'おまえの神経には、大いに敬意を払っているとも。',
    chunks: [
      ['I have a high respect for your nerves.', 'おまえの神経には大いに敬意を払っている'],
    ],
    notes: {
      'I have a high respect for your nerves.': 'have (a) high respect for A は「A を大いに尊敬する」。もちろん冗談の皮肉です。',
    },
  }),
  // 47
  ls('[S They] [V are] [C my old friends].', {
    ja: '私の古い友だちだからね。',
    chunks: [
      ['They are my old friends.', '私の古い友だちだからね'],
    ],
    notes: {
      'They are my old friends.': 'They は your nerves（おまえの神経）を指します。何度も聞かされたので古い友だちのようだ、という冗談です。',
    },
  }),
  // 48
  ls('[S I] [V have heard] [O you] [C {原形| [V mention] [O them] [M {前| with consideration}]}] [M these twenty years {前| at least}].”', {
    ja: '少なくともこの二十年、おまえがその神経のことを大事そうに口にするのを聞いてきたんだから。」',
    chunks: [
      ['I have heard you mention them', 'おまえがそれを口にするのを聞いてきた'],
      ['with consideration these twenty years at least.”', '大事そうに、少なくともこの二十年は」'],
    ],
    notes: {
      'I have heard you mention them': 'hear＋人＋原形で「人が〜するのを聞く」。',
      'with consideration these twenty years at least.”': 'with consideration は「思いやりをこめて・大事そうに」。these twenty years は「この二十年間」。',
    },
  }),
  // 49
  ls('“[独 Ah], [S you] [V do not know] [O {what節| [O what] [S I] [V suffer]}].”', {
    p: true,
    ja: '「ああ、あなたには私の苦しみが分からないのよ。」',
    chunks: [
      ['“Ah, you do not know what I suffer.”', '「ああ、あなたには私の苦しみが分からないのよ」'],
    ],
    notes: {
      '“Ah, you do not know what I suffer.”': 'what I suffer は「私が苦しんでいること」。what は先行詞を含む関係代名詞です。',
    },
  }),
  // 50
  ls('“[接 But] [S I] [V hope] [O {that省略| [S you] [V will get over] [O it], [接 and] [V live] [M {to:副詞(結果)| [V to see] [O many young men {前| of four thousand a year}] [C {原形| [V come] [M {前| into the neighbourhood}]}]}]}].”', {
    p: true,
    ja: '「だが、おまえがそれを乗り越えて、年収四千ポンドの若者が大勢この近所に越してくるのを見届けるまで、長生きしてくれるといいね。」',
    chunks: [
      ['“But I hope you will get over it,', '「だが、おまえがそれを乗り越えて'],
      ['and live to see many young men', '長生きして大勢の若者を見られるといいね'],
      ['of four thousand a year come into the neighbourhood.”', '年収四千ポンドの人たちが近所に来るのを」'],
    ],
    notes: {
      '“But I hope you will get over it,': 'get over A は「A を乗り越える・治す」。',
      'and live to see many young men': 'live to do は「生きて〜する」、つまり「〜するまで長生きする」。',
      'of four thousand a year come into the neighbourhood.”': 'see＋人＋原形で「人が〜するのを見る」。of four thousand a year は「年収四千ポンドの」。',
    },
  }),
  // 51
  ls('“[S It] [V will be] [C no use {前| to us}], [M {副詞節:条件| [接 if] [S twenty such] [V should come]}], [M {副詞節:理由| [接 since] [S you] [V will not visit] [O them]}].”', {
    p: true,
    ja: '「そんな人が二十人来たって、私たちには何の役にも立たないわ。あなたが訪ねてくれないんですもの。」',
    chunks: [
      ['“It will be no use to us,', '「私たちには何の役にも立たないわ'],
      ['if twenty such should come, since you will not visit them.”', 'たとえそんな人が二十人来ても、あなたが訪ねないんだから」'],
    ],
    notes: {
      '“It will be no use to us,': 'be no use to A は「A には役に立たない」。',
      'if twenty such should come, since you will not visit them.”': 'twenty such は「そういう人が二十人」。should は「万一〜なら」、since は「〜なので」。',
    },
  }),
  // 52
  ls('“[V Depend upon] [仮O it], [独 my dear], [真O {that節| [接 that] [M {副詞節:時| [接 when] [M there] [V are] [S twenty]}], [S I] [V will visit] [O them all]}].”', {
    p: true,
    ja: '「大丈夫だよ、おまえ。二十人来たら、みんな訪ねてやるとも。」',
    chunks: [
      ['“Depend upon it, my dear, that when there are twenty,', '「当てにしていいよ、おまえ、二十人になったら'],
      ['I will visit them all.”', '私が全員を訪ねるとも」'],
    ],
    notes: {
      '“Depend upon it, my dear, that when there are twenty,': 'Depend upon it that … は「…だと当てにしてよい・間違いない」。it は that 以下を指す形式目的語です。',
      'I will visit them all.”': '「二十人になったら訪ねる」は、結局一人目は訪ねないという、妻へのからかいです。',
    },
  }),
  // 53
  ls('[S Mr. Bennet] [V was] [C so odd a mixture {前| of {並列| quick parts, | sarcastic humour, | reserve, | and caprice}}], [M {副詞節:結果| [接 that] [S the experience {前| of three-and-twenty years}] [V had been] [C insufficient {to:副詞(形容詞)| [V to make] [O his wife] [C {原形| [V understand] [O his character]}]}]}].', {
    p: true,
    ja: 'ベネット氏は、鋭い頭の回転と、皮肉なユーモアと、無口さと、気まぐれとが実に奇妙に入りまじった人物だったので、二十三年連れ添っても、妻には夫の性格が分からずじまいだった。',
    chunks: [
      ['Mr. Bennet was so odd a mixture of quick parts,', 'ベネット氏は、頭の回転の速さの、とても奇妙な混ぜ合わせで'],
      ['sarcastic humour, reserve, and caprice,', '皮肉なユーモアと、無口さと、気まぐれとの'],
      ['that the experience of three-and-twenty years had been insufficient', 'そのため、二十三年の経験でも足りなかった'],
      ['to make his wife understand his character.', '妻に夫の性格を分からせるには'],
    ],
    notes: {
      'Mr. Bennet was so odd a mixture of quick parts,': 'so … that ～ で「とても…なので～」。so odd a mixture は「とても奇妙な混ぜ合わせ」で、so＋形容詞＋a＋名詞の語順になります。quick parts は「頭の回転の速さ」。',
      'sarcastic humour, reserve, and caprice,': 'reserve は「控えめさ・無口」、caprice は「気まぐれ」。',
      'that the experience of three-and-twenty years had been insufficient': 'three-and-twenty は twenty-three の古い言い方。insufficient to do で「〜するには不十分な」。',
      'to make his wife understand his character.': 'make＋人＋原形で「人に〜させる」。',
    },
  }),
  // 54
  ls('[S Her mind] [V was] [C less difficult {to:副詞(形容詞)| [V to develope]}].', {
    ja: '妻の心のほうは、もっと分かりやすかった。',
    chunks: [
      ['Her mind was less difficult to develope.', '妻の心のほうは、もっと分かりやすかった'],
    ],
    notes: {
      'Her mind was less difficult to develope.': 'develope は develop の古いつづりで、ここでは「（中身を）明らかにする・読み解く」。less difficult to do は「〜するのがもっと簡単な」。',
    },
  }),
  // 55
  ls('[S She] [V was] [C a woman {前| of {並列| mean understanding, | little information, | and uncertain temper}}].', {
    ja: '理解力が乏しく、物を知らず、気分の変わりやすい女性だった。',
    chunks: [
      ['She was a woman of mean understanding, little information, and uncertain temper.', '理解力が乏しく、物を知らず、気分の変わりやすい女性だった'],
    ],
    notes: {
      'She was a woman of mean understanding, little information, and uncertain temper.': 'a woman of A で「A を持った女性」。mean はここでは「劣った」、information は「知識」、uncertain temper は「変わりやすい気分」。',
    },
  }),
  // 56
  ls('[M {副詞節:時| [接 When] [S she] [V was] [C discontented]}], [S she] [V fancied] [O herself] [C nervous].', {
    ja: '気に入らないことがあると、自分は神経が弱っているのだと思いこんだ。',
    chunks: [
      ['When she was discontented, she fancied herself nervous.', '気に入らないことがあると、自分は神経が弱っていると思いこんだ'],
    ],
    notes: {
      'When she was discontented, she fancied herself nervous.': 'fancy oneself A は「自分を A だと思いこむ」。discontented は「不満な」。',
    },
  }),
  // 57
  ls('[S The business {前| of her life}] [V was] [C {to:補語| [V to get] [O her daughters] [C married]}]: [S its solace] [V was] [C {並列| visiting | and news}].', {
    ja: '夫人の生涯の仕事は、娘たちを結婚させることだった。その慰めは、人を訪ねることと、うわさ話だった。',
    chunks: [
      ['The business of her life was to get her daughters married:', '夫人の人生の仕事は娘たちを結婚させることだった'],
      ['its solace was visiting and news.', 'その慰めは、人を訪ねることとうわさ話だった'],
    ],
    marks: [
      [':', 'コロンの前は夫人の人生の「仕事」（娘たちを結婚させること）、後ろはその「慰め」（人を訪ねることとうわさ話）です。対になる2つの文をコロンで並べ、夫人の人柄をひと言でまとめています。'],
    ],
    notes: {
      'The business of her life was to get her daughters married:': 'get A married は「A を結婚させる」（get＋目的語＋過去分詞）。',
      'its solace was visiting and news.': 'its は her life を指します。solace は「慰め」、news はここでは「うわさ話」。',
    },
  }),
])
