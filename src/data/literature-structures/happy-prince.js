import { ls } from './entry.js'

export default Object.freeze([
  // 1
  ls('[M HIGH {前| above the city}], [M {前| on a tall column}], [V stood] [S the statue {前| of the Happy Prince}].', {
    p: true,
    ja: '町を見おろす高いところ、高い円柱の上に、幸福な王子の像が立っていた。',
    chunks: [
      ['HIGH above the city, on a tall column,', '町の上の高いところ、高い円柱の上に'],
      ['stood the statue of the Happy Prince.', '幸福な王子の像が立っていた'],
    ],
    notes: {
      'HIGH above the city, on a tall column,': 'high above A で「A のはるか上に」。場所を表す語句を文の頭に出して、動詞 stood が主語の前に来ています（倒置）。HIGH と大文字で書くのは、物語の書き出しの飾りです。',
      'stood the statue of the Happy Prince.': 'stood が動詞、the statue of the Happy Prince（幸福な王子の像）が主語です。',
    },
  }),
  // 2
  ls('[S He] [V was gilded] [M all over] [M {前| with thin leaves {前| of fine gold}}], [M {前| for eyes}] [S he] [V had] [O two bright sapphires], [接 and] [S a large red ruby] [V glowed] [M {前| on his sword-hilt}].', {
    ja: '王子の像は全身に上等な金の薄い箔がはられ、目には二つの輝くサファイアがはめこまれ、剣のつかでは大きな赤いルビーが光っていた。',
    chunks: [
      ['He was gilded all over with thin leaves of fine gold,', '王子の像は、全身に上等な金の薄い箔がはられ'],
      ['for eyes he had two bright sapphires,', '目には二つの輝くサファイアがあり'],
      ['and a large red ruby glowed on his sword-hilt.', '剣のつかでは大きな赤いルビーが光っていた'],
    ],
    notes: {
      'He was gilded all over with thin leaves of fine gold,': 'gild は「金箔をはる・金めっきする」で、was gilded は受け身。all over は「全身に」。leaf はここでは「（金属の）薄い箔」。',
      'for eyes he had two bright sapphires,': 'for eyes は「目として」。for は「〜として」という意味の前置詞です。3つの節が、コンマと and だけでつながっています。',
      'and a large red ruby glowed on his sword-hilt.': 'glow は「（赤く）光る・輝く」。sword-hilt は剣のつか（にぎる部分）です。',
    },
  }),
  // 3
  ls('[S He] [V was] [M very much] [V admired] [M indeed].', {
    p: true,
    ja: '王子の像は、それはもうたいへんな評判だった。',
    chunks: [
      ['He was very much admired indeed.', '王子の像は、本当にたいそうほめたたえられていた'],
    ],
    notes: {
      'He was very much admired indeed.': 'be admired で「ほめたたえられる」。very much は受け身の過去分詞を強めます。indeed は「本当に」と文全体を強めます。',
    },
  }),
  // 4
  ls('[O {引用| “[S He] [V is] [C as beautiful {前| as a weathercock}],”}] [V remarked] [S one {前| of the Town Councillors} {関係>one of the Town Councillors| [S who] [V wished] [O {to:名詞| [V to gain] [O a reputation {前| for {動名詞| [V having] [O artistic tastes]}}]}]}]; [O {引用| “[M only] [M not quite] [C so useful],”}] [S he] [V added], [M {分詞構文:理由| [V fearing] [O {that節| [接 lest] [S people] [V should think] [O him] [C unpractical, {関係,>unpractical| [C which] [S he] [M really] [V was not]}]}]}].', {
    ja: '「あの像は風見鶏のように美しい」と、芸術の趣味がよいという評判をとりたがっている町会議員の一人が言った。「ただ、風見鶏ほど役には立たないがね」と、その議員は付け加えた。実用を軽んじる人間だと思われはしないかと心配したのだ。実際には、少しもそんな人間ではなかったのだが。',
    chunks: [
      ['“He is as beautiful as a weathercock,”', '「あの像は風見鶏のように美しい」'],
      ['remarked one of the Town Councillors who wished', 'と町会議員の一人が言った。その議員は望んでいた'],
      ['to gain a reputation for having artistic tastes;', '芸術の趣味がよいという評判を得たいと'],
      ['“only not quite so useful,” he added,', '「ただ、風見鶏ほど役には立たないが」と彼は付け加えた'],
      ['fearing lest people should think him unpractical,', '人々に実用を軽んじる人間だと思われはしないかと心配して'],
      ['which he really was not.', '実際には、そんな人間ではなかったのだが'],
    ],
    marks: [
      [';', 'セミコロンで、議員の1つ目の言葉（風見鶏のように美しい）と、あわてて付け足した2つ目の言葉（でも役には立たない）を区切ります。'],
    ],
    notes: {
      '“He is as beautiful as a weathercock,”': 'as … as A で「A と同じくらい…」。weathercock は屋根の上の、鳥の形をした風見（風向計）です。美しい像を風見鶏にたとえるところに、議員の趣味のなさが出ています。',
      'remarked one of the Town Councillors who wished': 'remark は「（感想を）述べる」。remarked one of … は動詞が主語の前に出た形です。Town Councillor は町議会の議員。who 以下が one of the Town Councillors を説明します。',
      'to gain a reputation for having artistic tastes;': 'gain a reputation for A で「A という評判を得る」。artistic tastes は「芸術の趣味（のよさ）」。',
      '“only not quite so useful,” he added,': 'only は「ただし」。not quite so useful は「（風見鶏）ほどは役に立たない」で、so のあとに as a weathercock が省かれています。',
      'fearing lest people should think him unpractical,': 'fear lest … should ～ で「…が～しないかと心配する」（古い言い方）。think A B で「A を B だと思う」。unpractical は「実用的でない」。',
      'which he really was not.': 'which は前の形容詞 unpractical を受ける関係代名詞で、「実際には、彼はそう（実用を軽んじる人間）ではなかった」。役に立つかどうかばかり気にする人だ、という皮肉です。',
    },
  }),
  // 5
  ls('[O {引用| “[M Why] [V can’t] [S you] [V be] [C {前| like the Happy Prince}]?”}] [V asked] [S a sensible mother] [M {前| of her little boy {関係>her little boy| [S who] [V was crying] [M {前| for the moon}]}}].', {
    p: true,
    ja: '「どうして幸福な王子さまのようにできないの？」と、月がほしいと泣いている小さな息子に、分別のある母親がたずねた。',
    chunks: [
      ['“Why can’t you be like the Happy Prince?”', '「どうして幸福な王子さまのようにできないの」'],
      ['asked a sensible mother of her little boy', 'と分別のある母親が小さな息子にたずねた'],
      ['who was crying for the moon.', '月がほしいと泣いていた（息子に）'],
    ],
    notes: {
      '“Why can’t you be like the Happy Prince?”': 'can’t は cannot の短縮形。like A で「A のように」。',
      'asked a sensible mother of her little boy': 'ask A of B で「B に A をたずねる」。ここでは A が前の引用です。sensible は「分別のある」。',
      'who was crying for the moon.': 'cry for the moon は「月をほしがって泣く」から、「できないことをねだる」という決まった言い方です。',
    },
  }),
  // 6
  ls('“[S The Happy Prince] [M never] [V dreams] [M {前| of {動名詞| [V crying] [M {前| for anything}]}}].”', {
    ja: '「幸福な王子さまは、何かをねだって泣くなんて、夢にも考えないのよ」',
    chunks: [
      ['“The Happy Prince never dreams of crying for anything.”', '「幸福な王子さまは、何かをねだって泣くなんて、夢にも思わないのよ」'],
    ],
    notes: {
      '“The Happy Prince never dreams of crying for anything.”': 'never dream of doing で「〜することなど夢にも思わない」。cry for A は「A をほしがって泣く」。像なのだから泣かないのは当たり前、という皮肉がこもっています。',
    },
  }),
  // 7
  ls('[O {引用| “[S I] [V am] [C glad {that省略| [M there] [V is] [S some one {前| in the world} {関係>some one| [S who] [V is] [C quite happy]}]}],”}] [V muttered] [S a disappointed man] [M {副詞節:時| [接 as] [S he] [V gazed] [M {前| at the wonderful statue}]}].', {
    p: true,
    ja: '「この世に、すっかり幸せなものがいてくれるのはうれしいことだ」と、人生に失望した男が、見事な像を見つめながらつぶやいた。',
    chunks: [
      ['“I am glad there is some one in the world', '「世の中に誰かがいるのはうれしいね'],
      ['who is quite happy,”', 'すっかり幸せな（誰かが）」'],
      ['muttered a disappointed man as he gazed at the wonderful statue.', 'と失意の男が、見事な像を見つめながらつぶやいた'],
    ],
    notes: {
      '“I am glad there is some one in the world': 'glad のあとに that が省かれていて、「〜ということがうれしい」。some one は someone（誰か）の古い書き方です。',
      'who is quite happy,”': 'who は some one を説明する関係代名詞です。間に in the world がはさまっています。',
      'muttered a disappointed man as he gazed at the wonderful statue.': 'mutter は「つぶやく」。disappointed man は「（人生に）失望した男」。gaze at A は「A をじっと見つめる」。',
    },
  }),
  // 8
  ls('[O {引用| “[S He] [V looks] [C just {前| like an angel}],”}] [V said] [S the Charity Children] [M {副詞節:時| [接 as] [S they] [V came] [M {前| out of the cathedral}] [M {前| in {並列| their bright scarlet cloaks | and their clean white pinafores}}]}].', {
    p: true,
    ja: '「まるで天使みたいだね」と、あざやかな緋色のマントにきれいな白いエプロン姿の慈善学校の子どもたちが、大聖堂から出てきながら言った。',
    chunks: [
      ['“He looks just like an angel,”', '「まるで天使みたいだ」'],
      ['said the Charity Children', 'と慈善学校の子どもたちが言った'],
      ['as they came out of the cathedral', '大聖堂から出てくるときに'],
      ['in their bright scarlet cloaks and their clean white pinafores.', 'あざやかな緋色のマントに、きれいな白いエプロン姿で'],
    ],
    notes: {
      '“He looks just like an angel,”': 'look like A で「A のように見える」。just は「まるで」と強めます。',
      'said the Charity Children': 'Charity Children は、寄付で運営される慈善学校の子どもたちです。',
      'in their bright scarlet cloaks and their clean white pinafores.': 'in A で「A を着て」。scarlet は「緋色（あざやかな赤）」、pinafore は子ども用のエプロンです。',
    },
  }),
  // 9
  ls('[O {引用| “[M How] [V do] [S you] [V know]?”}] [V said] [S the Mathematical Master], [O {引用| “[S you] [V have] [M never] [V seen] [O one].”}]', {
    p: true,
    ja: '「どうしてそんなことが分かるのかね」と数学の先生が言った。「きみたちは天使を一度も見たことがないだろう」',
    chunks: [
      ['“How do you know?”', '「どうして分かるのかね」'],
      ['said the Mathematical Master, “you have never seen one.”', 'と数学の先生が言った「一度も見たことがないだろう」'],
    ],
    notes: {
      'said the Mathematical Master, “you have never seen one.”': 'Mathematical Master は数学の先生。one は an angel（天使）を指します。have never seen は現在完了で「一度も見たことがない」。',
    },
  }),
  // 10
  ls('[O {引用| “[独 Ah]! [接 but] [S we] [V have], [M {前| in our dreams}],”}] [V answered] [S the children]; [接 and] [S the Mathematical Master] [V frowned] [接 and] [V looked] [C very severe], [接 for] [S he] [V did not approve of] [O {動名詞| [M children] [V dreaming]}].', {
    p: true,
    ja: '「ああ、でも見たことがあるよ。夢の中で」と子どもたちは答えた。すると数学の先生は顔をしかめて、とてもけわしい顔つきになった。子どもが夢を見るのを、よしとしていなかったのだ。',
    chunks: [
      ['“Ah! but we have, in our dreams,” answered the children;', '「ああ、でも見たことがあるよ、夢の中で」と子どもたちは答えた'],
      ['and the Mathematical Master frowned and looked very severe,', 'すると数学の先生は顔をしかめ、とてもけわしい顔つきになった'],
      ['for he did not approve of children dreaming.', '子どもが夢を見るのを、よく思っていなかったからだ'],
    ],
    marks: [
      [';', 'セミコロンで、子どもたちの答えと、それを聞いた先生の反応（顔をしかめた）を区切ってつなぎます。'],
    ],
    notes: {
      '“Ah! but we have, in our dreams,” answered the children;': 'we have のあとに seen one（天使を見た）が省かれています。',
      'and the Mathematical Master frowned and looked very severe,': 'frown は「顔をしかめる」。look severe で「けわしい顔つきをする」。',
      'for he did not approve of children dreaming.': 'approve of A で「A をよいと認める」。children dreaming は「子どもが夢を見ること」で、children が動名詞 dreaming の意味の上の主語です。',
    },
  }),
  // 11
  ls('[M One night] [M there] [V flew] [M {前| over the city}] [S a little Swallow].', {
    p: true,
    ja: 'ある晩のこと、町の上を一羽の小さなツバメが飛んできた。',
    chunks: [
      ['One night there flew over the city a little Swallow.', 'ある夜、町の上を小さなツバメが一羽、飛んできた'],
    ],
    notes: {
      'One night there flew over the city a little Swallow.': 'there flew … a little Swallow は、there is の文と同じ形で、主語 a little Swallow が動詞のあとに来ています。新しい登場人物を物語に出すときの言い方です。',
    },
  }),
  // 12
  ls('[S His friends] [V had gone away] [M {前| to Egypt}] [M six weeks before], [接 but] [S he] [V had stayed] [M behind], [接 for] [S he] [V was] [C {前| in love {前| with the most beautiful Reed}}].', {
    ja: '仲間たちは六週間前にエジプトへ行ってしまったが、このツバメだけはあとに残っていた。いちばん美しいアシに恋をしていたからだ。',
    chunks: [
      ['His friends had gone away to Egypt six weeks before,', '仲間たちは六週間前にエジプトへ行ってしまった'],
      ['but he had stayed behind,', 'けれど彼はあとに残っていた'],
      ['for he was in love with the most beautiful Reed.', 'というのも、いちばん美しいアシに恋をしていたからだ'],
    ],
    notes: {
      'His friends had gone away to Egypt six weeks before,': 'had gone away は過去完了で、その夜より前に行ってしまっていたことを表します。ツバメは冬になると暖かいエジプトへ渡ります。six weeks before は「（その時から）六週間前に」。',
      'but he had stayed behind,': 'stay behind で「あとに残る」。',
      'for he was in love with the most beautiful Reed.': 'for は「というのも」。be in love with A で「A に恋している」。Reed は水辺に生える草のアシ（ヨシ）で、ここでは女性のように描かれています。',
    },
  }),
  // 13
  ls('[S He] [V had met] [O her] [M early] [M {前| in the spring}] [M {副詞節:時| [接 as] [S he] [V was flying] [M {前| down the river}] [M {前| after a big yellow moth}]}], [接 and] [V had been] [M so] [V attracted] [M {前| by her slender waist}] [M {副詞節:結果| [接 that] [S he] [V had stopped] [M {to:副詞(目的)| [V to talk] [M {前| to her}]}]}].', {
    ja: '春の初め、大きな黄色い蛾を追って川を下っていたときに、ツバメはアシに出会った。そのほっそりした腰にすっかりひかれて、立ち止まって話しかけたのだった。',
    chunks: [
      ['He had met her early in the spring', '彼は春の初めに彼女に出会った'],
      ['as he was flying down the river after a big yellow moth,', '大きな黄色い蛾を追って、川を下って飛んでいたときに'],
      ['and had been so attracted by her slender waist', 'そして、そのほっそりした腰にすっかりひかれたので'],
      ['that he had stopped to talk to her.', '立ち止まって話しかけたのだった'],
    ],
    notes: {
      'He had met her early in the spring': 'had met は過去完了で、物語の今（秋）より前のことを表します。her は the Reed を指します。',
      'as he was flying down the river after a big yellow moth,': 'fly after A で「A を追って飛ぶ」。moth は「蛾」。',
      'and had been so attracted by her slender waist': 'so … that ～ で「とても…なので～」。be attracted by A で「A にひきつけられる」。slender は「ほっそりした」。',
      'that he had stopped to talk to her.': 'stop to do で「立ち止まって〜する」（stop doing「〜するのをやめる」とは違います）。',
    },
  }),
  // 14
  ls('[O {引用| “[V Shall] [S I] [V love] [O you]?”}] [V said] [S the Swallow, {関係,>the Swallow| [S who] [V liked] [O {to:名詞| [V to come] [M {前| to the point}] [M {前| at once}]}]}], [接 and] [S the Reed] [V made] [O1 him] [O2 a low bow].', {
    p: true,
    ja: '「あなたを愛してもいいですか」と、何でもすぐに本題に入るのが好きなツバメは言った。するとアシは、深々とおじぎをした。',
    chunks: [
      ['“Shall I love you?”', '「あなたを愛してもいいですか」'],
      ['said the Swallow, who liked to come to the point at once,', 'とツバメは言った。ツバメはすぐに本題に入るのが好きだった'],
      ['and the Reed made him a low bow.', 'するとアシは、深くおじぎをした'],
    ],
    notes: {
      '“Shall I love you?”': 'Shall I …? で「〜しましょうか」と相手の気持ちをたずねる言い方です。',
      'said the Swallow, who liked to come to the point at once,': 'コンマのあとの who は the Swallow に情報を付け足します。come to the point で「要点に入る」、at once は「すぐに」。',
      'and the Reed made him a low bow.': 'make A a bow で「A におじぎをする」。風に揺れるアシの様子を、おじぎにたとえています。',
    },
  }),
  // 15
  ls('[接 So] [S he] [V flew] [M {前| {成句| round and round} her}], [M {分詞構文:付帯状況| [V touching] [O the water] [M {前| with his wings}], [接 and] [V making] [O silver ripples]}].', {
    ja: 'そこでツバメは、つばさで水面にふれて銀色のさざなみを立てながら、アシのまわりをぐるぐると飛びまわった。',
    chunks: [
      ['So he flew round and round her,', 'そこでツバメは、アシのまわりをぐるぐる飛びまわった'],
      ['touching the water with his wings, and making silver ripples.', 'つばさで水にふれ、銀色のさざなみを立てながら'],
    ],
    notes: {
      'So he flew round and round her,': 'round and round A で「A のまわりをぐるぐると」。round はここでは around と同じ前置詞です。',
      'touching the water with his wings, and making silver ripples.': 'touching … と making … が and で並ぶ分詞構文で、「〜しながら」と飛び方を説明します。ripple は「さざなみ」。',
    },
  }),
  // 16
  ls('[S This] [V was] [C his courtship], [接 and] [S it] [V lasted] [M all {前| through the summer}].', {
    ja: 'これがツバメの求愛のしかたで、それは夏のあいだじゅう続いた。',
    chunks: [
      ['This was his courtship,', 'これが彼の求愛だった'],
      ['and it lasted all through the summer.', 'そしてそれは夏のあいだじゅう続いた'],
    ],
    notes: {
      'This was his courtship,': 'courtship は「求愛・求婚」。',
      'and it lasted all through the summer.': 'last は「続く」という動詞です。all through A で「A のあいだずっと」。',
    },
  }),
  // 17
  ls('[O {引用| “[S It] [V is] [C a ridiculous attachment],”}] [V twittered] [S the other Swallows]; [O {引用| “[S she] [V has] [O {並列| no money, | and far too many relations}]”}]; [接 and] [M indeed] [S the river] [V was] [C quite full {前| of Reeds}].', {
    p: true,
    ja: '「ばかげた恋だね」とほかのツバメたちはさえずった。「あの子はお金はないし、親戚ばかりやたらに多いし」実際、川にはアシがびっしり生えていたのだ。',
    chunks: [
      ['“It is a ridiculous attachment,” twittered the other Swallows;', '「ばかげた恋だよ」とほかのツバメたちはさえずった'],
      ['“she has no money, and far too many relations”;', '「お金はないし、親戚はやたらに多いし」'],
      ['and indeed the river was quite full of Reeds.', '実際、川にはアシがいっぱい生えていた'],
    ],
    marks: [
      [';', 'セミコロンで、ほかのツバメたちの1つ目の言葉（ばかげた恋だ）と、その理由を並べた2つ目の言葉を区切ります。'],
      [';', 'セミコロンで、ツバメたちの言葉のあとに、語り手の説明（実際、川はアシだらけだった）を続けます。'],
    ],
    notes: {
      '“It is a ridiculous attachment,” twittered the other Swallows;': 'attachment は「愛着・（恋の）思い入れ」。twitter は「（小鳥が）さえずる」。',
      '“she has no money, and far too many relations”;': 'far too many は「あまりにも多すぎる」。relations は「親戚」。has のあとに no money と far too many relations が並んでいます。',
      'and indeed the river was quite full of Reeds.': 'indeed は「実際に」。アシの親戚が多い、というのは、川がアシだらけだからだ、というおかしみです。',
    },
  }),
  // 18
  ls('[M Then], [M {副詞節:時| [接 when] [S the autumn] [V came]}] [S they] [M all] [V flew] [M away].', {
    ja: 'やがて秋が来ると、ツバメたちはみんな飛んで行ってしまった。',
    chunks: [
      ['Then, when the autumn came they all flew away.', 'やがて秋が来ると、みんな飛んで行ってしまった'],
    ],
    notes: {
      'Then, when the autumn came they all flew away.': 'they は、ほかのツバメたちを指します。all は they を強めて「みんな」。',
    },
  }),
  // 19
  ls('[M {副詞節:時| [接 After] [S they] [V had gone]}] [S he] [V felt] [C lonely], [接 and] [V began] [O {to:名詞| [V to tire] [M {前| of his lady-love}]}].', {
    p: true,
    ja: '仲間たちが行ってしまうと、ツバメはさびしくなって、恋人にうんざりしはじめた。',
    chunks: [
      ['After they had gone he felt lonely,', '仲間たちが行ってしまうと、彼はさびしくなった'],
      ['and began to tire of his lady-love.', 'そして恋人にうんざりしはじめた'],
    ],
    notes: {
      'After they had gone he felt lonely,': 'had gone は過去完了で、さびしく感じたときより前に行ってしまっていたことを表します。feel lonely で「さびしく感じる」。',
      'and began to tire of his lady-love.': 'tire of A で「A にあきる・うんざりする」。lady-love は「恋人（の女性）」。',
    },
  }),
  // 20
  ls('[O {引用| “[S She] [V has] [O no conversation],”}] [S he] [V said], [O {引用| “[接 and] [S I] [V am] [C afraid {that節| [接 that] [S she] [V is] [C a coquette]}], [接 for] [S she] [V is] [M always] [V flirting] [M {前| with the wind}].”}]', {
    ja: '「あの子は話し相手にならない」とツバメは言った。「それに、どうも浮気者らしい。いつも風といちゃついているんだから」',
    chunks: [
      ['“She has no conversation,” he said,', '「あの子は話がつまらない」と彼は言った'],
      ['“and I am afraid that she is a coquette,', '「それに、どうも浮気者じゃないかと思う'],
      ['for she is always flirting with the wind.”', 'いつも風といちゃついているんだから」'],
    ],
    notes: {
      '“She has no conversation,” he said,': 'have no conversation で「話がつまらない・話し相手にならない」。',
      '“and I am afraid that she is a coquette,': 'I am afraid that … で「（残念ながら）…ではないかと思う」。coquette は「男の気をひこうとする女性」。',
      'for she is always flirting with the wind.”': 'flirt with A で「A といちゃつく」。be always doing で「いつも〜してばかりいる」と、いらだちを表します。',
    },
  }),
  // 21
  ls('[接 And] [M certainly], [M {副詞節:時| [接 whenever] [S the wind] [V blew]}], [S the Reed] [V made] [O the most graceful curtseys].', {
    ja: 'たしかに、風が吹くたびに、アシはこのうえなく優雅におじぎをしていた。',
    chunks: [
      ['And certainly, whenever the wind blew,', 'そしてたしかに、風が吹くたびに'],
      ['the Reed made the most graceful curtseys.', 'アシはこのうえなく優雅におじぎをした'],
    ],
    notes: {
      'And certainly, whenever the wind blew,': 'whenever は「〜するときはいつでも」。',
      'the Reed made the most graceful curtseys.': 'make a curtsey で「（ひざを曲げて）おじぎをする」。風になびくアシを、おじぎにたとえています。',
    },
  }),
  // 22
  ls('[O {引用| “[S I] [V admit] [O {that節| [接 that] [S she] [V is] [C domestic]}],”}] [S he] [V continued], [O {引用| “[接 but] [S I] [V love] [O {動名詞| [V travelling]}], [接 and] [S my wife], [M consequently], [V should love] [O {動名詞| [V travelling]}] [M also].”}]', {
    ja: '「たしかに家庭的なのは認めるよ」とツバメは続けた。「でも、ぼくは旅が大好きなんだ。だから、ぼくの妻になる者も、旅が好きでなくちゃいけない」',
    chunks: [
      ['“I admit that she is domestic,” he continued,', '「家庭的なのは認めるよ」と彼は続けた'],
      ['“but I love travelling,', '「でもぼくは旅が大好きだ'],
      ['and my wife, consequently, should love travelling also.”', 'だから、ぼくの妻も旅が好きでなくちゃ」'],
    ],
    notes: {
      '“I admit that she is domestic,” he continued,': 'admit that … で「…だと認める」。domestic は「家庭的な・家にいるのが好きな」。アシは根が生えていて動けないのです。',
      '“but I love travelling,': 'travelling はイギリスのつづり（アメリカでは traveling）。',
      'and my wife, consequently, should love travelling also.”': 'consequently は「したがって」。should は「〜すべきだ」。',
    },
  }),
  // 23
  ls('[O {引用| “[V Will] [S you] [V come away] [M {前| with me}]?”}] [S he] [V said] [M finally] [M {前| to her}]; [接 but] [S the Reed] [V shook] [O her head], [S she] [V was] [M so] [V attached] [M {前| to her home}].', {
    p: true,
    ja: '「いっしょに来てくれるかい」と、とうとうツバメはアシに言った。けれどアシは首を横にふった。住みなれた場所に、それほど愛着があったのだ。',
    chunks: [
      ['“Will you come away with me?”', '「いっしょに来てくれるかい」'],
      ['he said finally to her;', 'とついに彼はアシに言った'],
      ['but the Reed shook her head,', 'けれどアシは首を横にふった'],
      ['she was so attached to her home.', '自分の住まいにとても愛着があったのだ'],
    ],
    marks: [
      [';', 'セミコロンで、ツバメの誘いと、それに対するアシの答え（首を横にふった）を区切ってつなぎます。'],
    ],
    notes: {
      '“Will you come away with me?”': 'Will you …? で「〜してくれますか」。come away with A は「A といっしょに（ここを離れて）来る」。',
      'but the Reed shook her head,': 'shake one’s head で「首を横にふる」（断るしぐさ）。',
      'she was so attached to her home.': 'be attached to A で「A に愛着がある」。コンマのあとに、断った理由が接続詞なしで続いています。',
    },
  }),
  // 24
  ls('[O {引用| “[S You] [V have been trifling] [M {前| with me}],”}] [S he] [V cried].', {
    p: true,
    ja: '「ぼくをもてあそんでいたんだね」とツバメは叫んだ。',
    chunks: [
      ['“You have been trifling with me,” he cried.', '「ぼくをもてあそんでいたんだな」と彼は叫んだ'],
    ],
    notes: {
      '“You have been trifling with me,” he cried.': 'trifle with A で「A をもてあそぶ・いいかげんに扱う」。have been doing は現在完了進行形で「ずっと〜していた」。',
    },
  }),
  // 25
  ls('“[S I] [V am] [M off] [M {前| to the Pyramids}].', {
    ja: '「ぼくはピラミッドへ行くよ。',
    chunks: [
      ['“I am off to the Pyramids.', '「ぼくはピラミッドへ行くよ'],
    ],
    notes: {
      '“I am off to the Pyramids.': 'be off to A で「A へ出かける」。Pyramids はエジプトのピラミッドです。',
    },
  }),
  // 26
  ls('[独 Good-bye]!” [接 and] [S he] [V flew] [M away].', {
    ja: 'さようなら」そう言って、ツバメは飛んでいった。',
    chunks: [
      ['Good-bye!” and he flew away.', 'さようなら」そして彼は飛んでいった'],
    ],
    notes: {
      'Good-bye!” and he flew away.': '引用のすぐあとに and he flew away と語りが続き、言い終わるとすぐ飛び立った様子を表します。',
    },
  }),
  // 27
  ls('[M All day long] [S he] [V flew], [接 and] [M {前| at night-time}] [S he] [V arrived] [M {前| at the city}].', {
    p: true,
    ja: '一日じゅう飛びつづけて、夜になって、ツバメはあの町に着いた。',
    chunks: [
      ['All day long he flew,', '一日じゅう彼は飛んだ'],
      ['and at night-time he arrived at the city.', 'そして夜になって、町に着いた'],
    ],
    notes: {
      'All day long he flew,': 'all day long で「一日じゅう」。',
      'and at night-time he arrived at the city.': 'arrive at A で「A に着く」。the city は、幸福な王子の像が立つ町です。',
    },
  }),
  // 28
  ls('[O {引用| “[M Where] [V shall] [S I] [V put up]?”}] [S he] [V said]; [O {引用| “[S I] [V hope] [O {that省略| [S the town] [V has made] [O preparations]}].”}]', {
    ja: '「どこに泊まろうかな」とツバメは言った。「町が歓迎の用意をしてくれているといいんだけど」',
    chunks: [
      ['“Where shall I put up?”', '「どこに泊まろうかな」'],
      ['he said; “I hope the town has made preparations.”', 'と彼は言った「町が用意をしてくれているといいんだが」'],
    ],
    marks: [
      [';', 'セミコロンで、ツバメのひとりごとの1つ目（どこに泊まろう）と、続く2つ目（町が用意してくれているといい）を区切ります。'],
    ],
    notes: {
      '“Where shall I put up?”': 'put up は「泊まる」（古い言い方）。shall I …? で「〜しようか」と自分に問いかけています。',
      'he said; “I hope the town has made preparations.”': 'hope のあとに that が省かれています。make preparations で「準備をする」。自分を歓迎してくれるはずだと思っているところが、ツバメらしいうぬぼれです。',
    },
  }),
  // 29
  ls('[M Then] [S he] [V saw] [O the statue {前| on the tall column}].', {
    p: true,
    ja: 'そのとき、高い円柱の上の像が目に入った。',
    chunks: [
      ['Then he saw the statue on the tall column.', 'そのとき、彼は高い円柱の上の像を見た'],
    ],
    notes: {
      'Then he saw the statue on the tall column.': 'the statue on the tall column は、幸福な王子の像のことです。',
    },
  }),
  // 30
  ls('[O {引用| “[S I] [V will put up] [M there],”}] [S he] [V cried]; [O {引用| “[S it] [V is] [C a fine position, {前| with plenty {前| of fresh air}}].”}]', {
    p: true,
    ja: '「あそこに泊まろう」とツバメは叫んだ。「いい場所だ。新鮮な空気もたっぷりあるし」',
    chunks: [
      ['“I will put up there,” he cried;', '「あそこに泊まろう」と彼は叫んだ'],
      ['“it is a fine position, with plenty of fresh air.”', '「いい場所だ、新鮮な空気もたっぷりある」'],
    ],
    marks: [
      [';', 'セミコロンで、「あそこに泊まろう」という言葉と、そう決めた理由（いい場所だ）を区切ります。'],
    ],
    notes: {
      '“I will put up there,” he cried;': 'will は、その場で決めたことを表します。put up は「泊まる」。',
      '“it is a fine position, with plenty of fresh air.”': 'position は「場所・位置」。with plenty of A で「A がたっぷりある」。',
    },
  }),
  // 31
  ls('[接 So] [S he] [V alighted] [M just {前| between the feet {前| of the Happy Prince}}].', {
    ja: 'そこでツバメは、幸福な王子の両足のちょうど間に舞いおりた。',
    chunks: [
      ['So he alighted just between the feet of the Happy Prince.', 'そこで彼は、幸福な王子の両足のちょうど間に舞いおりた'],
    ],
    notes: {
      'So he alighted just between the feet of the Happy Prince.': 'alight は「（鳥などが）舞いおりる」。between the feet は「両足の間に」。',
    },
  }),
  // 32
  ls('[O {引用| “[S I] [V have] [O a golden bedroom],”}] [S he] [V said] [M softly] [M {前| to himself}] [M {副詞節:時| [接 as] [S he] [V looked] [M round]}], [接 and] [S he] [V prepared] [O {to:名詞| [V to go] [M {前| to sleep}]}]; [接 but] [M just {副詞節:時| [接 as] [S he] [V was putting] [O his head] [M {前| under his wing}]}] [S a large drop {前| of water}] [V fell] [M {前| on him}].', {
    p: true,
    ja: '「金の寝室だ」とツバメはあたりを見まわしながら、そっとひとりごとを言って、眠る支度をした。ところが、ちょうど頭をつばさの下に入れようとしたとき、大きな水のしずくがぽつりと落ちてきた。',
    chunks: [
      ['“I have a golden bedroom,”', '「金の寝室だぞ」'],
      ['he said softly to himself as he looked round,', 'と彼はあたりを見まわしながら、そっとひとりごとを言った'],
      ['and he prepared to go to sleep;', 'そして眠る支度をした'],
      ['but just as he was putting his head under his wing', 'ところが、ちょうど頭をつばさの下に入れようとしたとき'],
      ['a large drop of water fell on him.', '大きな水のしずくが彼の上に落ちてきた'],
    ],
    marks: [
      [';', 'セミコロンで、「眠る支度をした」ことと、but just as …（ところが、ちょうど〜したとき）という思いがけない出来事を区切ります。'],
    ],
    notes: {
      '“I have a golden bedroom,”': '金の像の足もとなので「金の寝室」と言っています。',
      'he said softly to himself as he looked round,': 'say to oneself は「ひとりごとを言う」。look round は「あたりを見まわす」。',
      'and he prepared to go to sleep;': 'prepare to do で「〜する準備をする」。go to sleep は「眠りにつく」。',
      'but just as he was putting his head under his wing': 'just as … で「ちょうど〜しようとしたとき」。鳥は頭をつばさの下に入れて眠ります。',
      'a large drop of water fell on him.': 'drop は「しずく」。',
    },
  }),
  // 33
  ls('[O {引用| “[独 What a curious thing]!”}] [S he] [V cried]; [O {引用| “[M there] [V is not] [S a single cloud] [M {前| in the sky}], [S the stars] [V are] [C quite {並列| clear | and bright}], [接 and yet] [S it] [V is raining].}]', {
    ja: '「なんて不思議なことだ！」とツバメは叫んだ。「空には雲ひとつないし、星はくっきりと明るく輝いている。それなのに雨が降っているなんて。',
    chunks: [
      ['“What a curious thing!”', '「なんておかしなことだ」'],
      ['he cried; “there is not a single cloud in the sky,', 'と彼は叫んだ「空には雲ひとつないし'],
      ['the stars are quite clear and bright, and yet it is raining.', '星はすっかり澄んで明るい。それなのに雨が降っている'],
    ],
    marks: [
      [';', 'セミコロンで、驚きの叫びと、何が不思議なのかを説明するツバメの言葉を区切ります。'],
    ],
    notes: {
      '“What a curious thing!”': 'What a＋形容詞＋名詞！の感嘆文。curious は「不思議な・奇妙な」。',
      'he cried; “there is not a single cloud in the sky,': 'not a single A で「A がひとつもない」。',
      'the stars are quite clear and bright, and yet it is raining.': 'and yet は「それなのに」。it is raining の it は天気を表す主語で、訳しません。3つの節がコンマで並んでいます。',
    },
  }),
  // 34
  ls('[S The climate {前| in the north {前| of Europe}}] [V is] [M really] [C dreadful].', {
    ja: '北ヨーロッパの気候は、まったくひどいものだ。',
    chunks: [
      ['The climate in the north of Europe is really dreadful.', '北ヨーロッパの気候は、本当にひどい'],
    ],
    notes: {
      'The climate in the north of Europe is really dreadful.': 'climate は「気候」。dreadful は「ひどい・恐ろしい」。旅の多いツバメらしい、知ったかぶりの感想です。',
    },
  }),
  // 35
  ls('[S The Reed] [V used to like] [O the rain], [接 but] [S that] [V was] [M merely] [C her selfishness].”', {
    ja: 'アシは雨が好きだったものだけど、あれはただのわがままだったんだな」',
    chunks: [
      ['The Reed used to like the rain,', 'アシは雨が好きだったものだ'],
      ['but that was merely her selfishness.”', 'でも、あれはただのわがままだった」'],
    ],
    notes: {
      'The Reed used to like the rain,': 'used to do で「以前はよく〜したものだ」。アシは水が必要なので、雨が好きなのは当然なのですが。',
      'but that was merely her selfishness.”': 'merely は「ただ〜にすぎない」。selfishness は「わがまま・自分勝手」。',
    },
  }),
  // 36
  ls('[M Then] [S another drop] [V fell].', {
    p: true,
    ja: 'すると、もうひとしずく落ちてきた。',
    chunks: [
      ['Then another drop fell.', 'すると、もうひとしずく落ちてきた'],
    ],
    notes: {
      'Then another drop fell.': 'another drop は「もうひとつのしずく」。',
    },
  }),
  // 37
  ls('[O {引用| “[C What] [V is] [S the use {前| of a statue}] [M {副詞節:条件| [接 if] [S it] [V cannot keep] [O the rain] [M off]}]?”}] [S he] [V said]; [O {引用| “[S I] [V must look for] [O a good chimney-pot],”}] [接 and] [S he] [V determined] [O {to:名詞| [V to fly] [M away]}].', {
    p: true,
    ja: '「雨もよけられないなら、像なんて何の役に立つんだ」とツバメは言った。「どこかいい煙突の先でも探さなくちゃ」そして、飛び立つことに決めた。',
    chunks: [
      ['“What is the use of a statue', '「像なんて何の役に立つんだ'],
      ['if it cannot keep the rain off?”', '雨もよけられないなら」'],
      ['he said; “I must look for a good chimney-pot,”', 'と彼は言った「どこかいい煙突の先でも探さなくちゃ」'],
      ['and he determined to fly away.', 'そして飛び立つことに決めた'],
    ],
    marks: [
      [';', 'セミコロンで、「雨もよけられない像なんて」という不満と、「煙突を探そう」という次の考えを区切ります。'],
    ],
    notes: {
      '“What is the use of a statue': 'What is the use of A? で「A が何の役に立つのか（何の役にも立たない）」。',
      'if it cannot keep the rain off?”': 'keep A off で「A をよける・防ぐ」。',
      'he said; “I must look for a good chimney-pot,”': 'look for A で「A を探す」。chimney-pot は煙突の先に付けた筒で、雨よけの宿に使えると考えています。',
      'and he determined to fly away.': 'determine to do で「〜しようと決心する」。',
    },
  }),
  // 38
  ls('[接 But] [M {副詞節:時| [接 before] [S he] [V had opened] [O his wings]}], [S a third drop] [V fell], [接 and] [S he] [V looked up], [接 and] [V saw] — [独 Ah]! [O what] [V did] [S he] [V see]?', {
    p: true,
    ja: 'ところが、つばさを広げないうちに、三つ目のしずくが落ちてきた。ツバメは上を見上げて、そして見た——ああ、いったい何を見たのでしょう？',
    chunks: [
      ['But before he had opened his wings,', 'けれど、つばさを広げないうちに'],
      ['a third drop fell, and he looked up,', '三つ目のしずくが落ちてきて、彼は見上げた'],
      ['and saw — Ah! what did he see?', 'そして見た——ああ、何を見たのでしょう'],
    ],
    marks: [
      ['—', 'ダッシュで、「見た」と言いかけたところで話を止め、読者の気を引いてから「ああ、何を見たのでしょう」と問いかけます。'],
    ],
    notes: {
      'But before he had opened his wings,': 'before … had opened で「〜を広げてしまう前に」。',
      'a third drop fell, and he looked up,': 'a third drop は「三つ目のしずく」。look up は「見上げる」。',
      'and saw — Ah! what did he see?': 'saw のあとの目的語をわざと言わずにダッシュで止め、語り手が「何を見たのでしょう」と読者に問いかけています。',
    },
  }),
  // 39
  ls('[S The eyes {前| of the Happy Prince}] [V were filled] [M {前| with tears}], [接 and] [S tears] [V were running] [M {前| down his golden cheeks}].', {
    p: true,
    ja: '幸福な王子の目には涙があふれ、金色のほおを涙が流れ落ちていたのだ。',
    chunks: [
      ['The eyes of the Happy Prince were filled with tears,', '幸福な王子の目には涙があふれ'],
      ['and tears were running down his golden cheeks.', '金色のほおを涙が流れ落ちていた'],
    ],
    notes: {
      'The eyes of the Happy Prince were filled with tears,': 'be filled with A で「A でいっぱいだ」。',
      'and tears were running down his golden cheeks.': 'run down A で「A を流れ落ちる」。cheek は「ほお」。',
    },
  }),
  // 40
  ls('[S His face] [V was] [C so beautiful] [M {前| in the moonlight}] [M {副詞節:結果| [接 that] [S the little Swallow] [V was filled] [M {前| with pity}]}].', {
    ja: '月の光の中で、王子の顔はあまりにも美しかったので、小さなツバメはかわいそうでたまらなくなった。',
    chunks: [
      ['His face was so beautiful in the moonlight', '月の光の中で、王子の顔はとても美しかったので'],
      ['that the little Swallow was filled with pity.', '小さなツバメはあわれみでいっぱいになった'],
    ],
    notes: {
      'His face was so beautiful in the moonlight': 'so … that ～ で「とても…なので～」。moonlight は「月の光」。',
      'that the little Swallow was filled with pity.': 'be filled with pity で「あわれみの気持ちでいっぱいになる」。',
    },
  }),
  // 41
  ls('[O {引用| “[C Who] [V are] [S you]?”}] [S he] [V said].', {
    p: true,
    ja: '「あなたはどなたですか」とツバメは言った。',
    chunks: [
      ['“Who are you?” he said.', '「あなたはどなたですか」と彼は言った'],
    ],
    notes: {
      '“Who are you?” he said.': 'Who are you? は「あなたは誰ですか」。who が補語で、文の頭に出ています。',
    },
  }),
  // 42
  ls('“[S I] [V am] [C the Happy Prince].”', {
    p: true,
    ja: '「わたしは幸福な王子だ」',
    chunks: [
      ['“I am the Happy Prince.”', '「わたしは幸福な王子だ」'],
    ],
    notes: {
      '“I am the Happy Prince.”': 'the Happy Prince は、この王子の呼び名です。',
    },
  }),
  // 43
  ls('[O {引用| “[M Why] [V are] [S you] [V weeping] [M then]?”}] [V asked] [S the Swallow]; [O {引用| “[S you] [V have] [M quite] [V drenched] [O me].”}]', {
    p: true,
    ja: '「それなら、どうして泣いているんですか」とツバメはたずねた。「おかげでぼくはびしょぬれですよ」',
    chunks: [
      ['“Why are you weeping then?”', '「それなら、なぜ泣いているのですか」'],
      ['asked the Swallow; “you have quite drenched me.”', 'とツバメはたずねた「ぼくをすっかりびしょぬれにしましたよ」'],
    ],
    marks: [
      [';', 'セミコロンで、ツバメの問いと、続く文句（おかげでびしょぬれだ）を区切ります。'],
    ],
    notes: {
      '“Why are you weeping then?”': 'weep は「（涙を流して）泣く」。then は「それなら（幸福な王子なのに）」。',
      'asked the Swallow; “you have quite drenched me.”': 'drench は「びしょぬれにする」。have drenched は現在完了で、今ぬれている結果を表します。',
    },
  }),
  // 44
  ls('[O {引用| “[M {副詞節:時| [接 When] [S I] [V was] [C alive] [接 and] [V had] [O a human heart]}],”}] [V answered] [S the statue], [O {引用| “[S I] [V did not know] [O {疑問詞節| [C what] [S tears] [V were]}], [接 for] [S I] [V lived] [M {前| in the Palace {前| of Sans-Souci}, {関係,>the Palace of Sans-Souci| [M where] [S sorrow] [V is not allowed] [C {to:補語| [V to enter]}]}}].}]', {
    p: true,
    ja: '「わたしが生きていて、人間の心を持っていたころには」と像は答えた。「涙というものを知らなかった。悲しみが入ることの許されないサン・スーシの宮殿に住んでいたからね。',
    chunks: [
      ['“When I was alive and had a human heart,”', '「わたしが生きていて、人間の心を持っていたときには」'],
      ['answered the statue, “I did not know what tears were,', 'と像は答えた「涙というものを知らなかった'],
      ['for I lived in the Palace of Sans-Souci,', 'というのも、わたしはサン・スーシの宮殿に住んでいたからだ'],
      ['where sorrow is not allowed to enter.', 'そこには悲しみが入ることを許されていない'],
    ],
    notes: {
      '“When I was alive and had a human heart,”': 'when の節の中で、was alive と had a human heart が and で並んでいます。今は像なので、人間の心はない、ということです。',
      'answered the statue, “I did not know what tears were,': 'what tears were は「涙が何であるか」という疑問詞の節です。',
      'for I lived in the Palace of Sans-Souci,': 'Sans-Souci はフランス語で「憂いなし」という意味の、宮殿の名前です。',
      'where sorrow is not allowed to enter.': 'コンマのあとの where は、the Palace of Sans-Souci に「そこでは〜」と情報を付け足します。be allowed to do で「〜することを許される」。',
    },
  }),
  // 45
  ls('[M {前| In the daytime}] [S I] [V played] [M {前| with my companions}] [M {前| in the garden}], [接 and] [M {前| in the evening}] [S I] [V led] [O the dance] [M {前| in the Great Hall}].', {
    ja: '昼は庭で仲間たちと遊び、夜は大広間で踊りの先頭に立った。',
    chunks: [
      ['In the daytime I played with my companions in the garden,', '昼は庭で仲間たちと遊び'],
      ['and in the evening I led the dance in the Great Hall.', '夜は大広間で踊りの先頭に立った'],
    ],
    notes: {
      'In the daytime I played with my companions in the garden,': 'companion は「仲間・遊び相手」。',
      'and in the evening I led the dance in the Great Hall.': 'lead the dance で「踊りの先頭に立つ」。Great Hall は宮殿の大広間です。',
    },
  }),
  // 46
  ls('[M {前| Round the garden}] [V ran] [S a very lofty wall], [接 but] [S I] [M never] [V cared] [O {to:名詞| [V to ask] [O {疑問詞節| [S what] [V lay] [M {前| beyond it}]}]}], [S everything {前| about me}] [V was] [C so beautiful].', {
    ja: '庭のまわりにはとても高い塀がめぐらされていたが、その向こうに何があるのか、たずねてみようとも思わなかった。わたしのまわりのものは、何もかもがそれほど美しかったのだ。',
    chunks: [
      ['Round the garden ran a very lofty wall,', '庭のまわりには、とても高い塀がめぐっていた'],
      ['but I never cared to ask what lay beyond it,', 'けれど、その向こうに何があるのか、たずねてみようとも思わなかった'],
      ['everything about me was so beautiful.', 'わたしのまわりのものは、何もかもがとても美しかったのだ'],
    ],
    notes: {
      'Round the garden ran a very lofty wall,': 'Round the garden（庭のまわりに）を文の頭に出し、動詞 ran が主語 a very lofty wall の前に来た倒置の形です。run はここでは「（塀などが）続いている」。lofty は「非常に高い」。',
      'but I never cared to ask what lay beyond it,': 'care to do は否定の文で「〜したいと思う」。lie は「ある・位置する」で、lay はその過去形です。',
      'everything about me was so beautiful.': 'コンマのあとに、たずねなかった理由が接続詞なしで続いています。about me は「わたしのまわりの」。',
    },
  }),
  // 47
  ls('[S My courtiers] [V called] [O me] [C the Happy Prince], [接 and] [C happy] [M indeed] [S I] [V was], [M {副詞節:条件| [接 if] [S pleasure] [V be] [C happiness]}].', {
    ja: '家来たちはわたしを幸福な王子と呼んだ。楽しみが幸福だというのなら、たしかにわたしは幸福だった。',
    chunks: [
      ['My courtiers called me the Happy Prince,', '家来たちはわたしを幸福な王子と呼んだ'],
      ['and happy indeed I was, if pleasure be happiness.', 'そして、楽しみが幸福だというのなら、たしかにわたしは幸福だった'],
    ],
    notes: {
      'My courtiers called me the Happy Prince,': 'courtier は「宮廷に仕える人・家来」。call A B で「A を B と呼ぶ」。',
      'and happy indeed I was, if pleasure be happiness.': 'happy indeed I was は、補語 happy を文の頭に出して強めた形です（もとは I was happy indeed）。if pleasure be happiness の be は仮定を表す古い言い方で、今なら is を使います。楽しみと幸福は同じではない、という含みがあります。',
    },
  }),
  // 48
  ls('[M So] [S I] [V lived], [接 and] [M so] [S I] [V died].', {
    ja: 'そうやって生き、そうやって死んだのだ。',
    chunks: [
      ['So I lived, and so I died.', 'そのように生き、そのように死んだ'],
    ],
    notes: {
      'So I lived, and so I died.': 'so は「そのように」という副詞です。同じ形を2回くり返して、一生を短く言い切っています。',
    },
  }),
  // 49
  ls('[接 And] [M {副詞節:理由| [接 now that] [S I] [V am] [C dead]}] [S they] [V have set] [O me] [M up] [M here] [M so high] [M {副詞節:結果| [接 that] [S I] [V can see] [O {並列| all the ugliness | and all the misery {前| of my city}}]}], [接 and] [M {副詞節:譲歩| [接 though] [S my heart] [V is made] [M {前| of lead}]}] [M yet] [S I] [V cannot chose] [M {前| but {原形| [V weep]}}].”', {
    ja: 'そして死んでしまった今、人々はわたしをこんなに高いところに立てたので、わたしの町のみにくいものや、みじめなものが、残らず見えてしまう。わたしの心臓は鉛でできているけれど、それでも泣かずにはいられないのだ」',
    chunks: [
      ['And now that I am dead they have set me up here', 'そして死んでしまった今、人々はわたしをここに立てた'],
      ['so high that I can see all the ugliness', 'とても高いところに。だから、あらゆるみにくさが見える'],
      ['and all the misery of my city,', 'わたしの町のあらゆるみじめさも'],
      ['and though my heart is made of lead', 'そしてわたしの心臓は鉛でできているけれど'],
      ['yet I cannot chose but weep.”', 'それでも泣かずにはいられないのだ」'],
    ],
    notes: {
      'And now that I am dead they have set me up here': 'now that … で「今や…なので」。set A up で「A を（高く）立てる・すえる」。they は町の人々を指します。',
      'so high that I can see all the ugliness': 'so high that … で「とても高いので…」。ugliness は「みにくさ」。',
      'and all the misery of my city,': 'misery は「みじめさ・悲惨さ」。all the ugliness と all the misery が並んで、see の目的語になっています。',
      'and though my heart is made of lead': 'be made of A で「A でできている」。lead（レッド）は金属の「鉛」です。',
      'yet I cannot chose but weep.”': 'cannot choose but do で「〜せずにはいられない」（古い言い方）。ここではつづりが chose になっていますが、choose のことです。but は「〜以外に」で、weep は to のない不定詞です。though と yet が組んで「〜だけれども、それでも」となります。',
    },
  }),
  // 50
  ls('[O {引用| “[独 What]! [V is] [S he] [M not] [C solid gold]?”}] [V said] [S the Swallow] [M {前| to himself}].', {
    p: true,
    ja: '「なんだって、純金じゃないのか」とツバメは心の中でつぶやいた。',
    chunks: [
      ['“What! is he not solid gold?”', '「なんだって！純金じゃないのか」'],
      ['said the Swallow to himself.', 'とツバメは心の中で言った'],
    ],
    notes: {
      '“What! is he not solid gold?”': 'What! は「なんだって！」という驚きの声です。solid gold は「中まで金の・純金の」。王子が「心臓は鉛」と言ったので、驚いています。',
      'said the Swallow to himself.': 'say to oneself は「心の中で言う・ひとりごとを言う」。',
    },
  }),
  // 51
  ls('[S He] [V was] [C too polite {to:副詞(程度)| [V to make] [O any personal remarks] [M out loud]}].', {
    ja: 'ツバメは礼儀正しかったので、相手の身の上について、声に出してあれこれ言ったりはしなかった。',
    chunks: [
      ['He was too polite to make any personal remarks out loud.', '彼はとても礼儀正しかったので、声に出して相手の身の上をあれこれ言わなかった'],
    ],
    notes: {
      'He was too polite to make any personal remarks out loud.': 'too … to do で「あまりに…なので〜できない」。personal remarks は「相手の体や身の上についての（失礼な）発言」。out loud は「声に出して」。',
    },
  }),
  // 52
  ls('[O {引用| “[M Far away],”}] [V continued] [S the statue] [M {前| in a low musical voice}], [O {引用| “[M far away] [M {前| in a little street}] [M there] [V is] [S a poor house].}]', {
    p: true,
    ja: '「ずっと遠く」と像は、低い、音楽のような声で続けた。「ずっと遠くの小さな通りに、貧しい家がある。',
    chunks: [
      ['“Far away,” continued the statue in a low musical voice,', '「ずっと遠く」と像は、低い、音楽のような声で続けた'],
      ['“far away in a little street there is a poor house.', '「ずっと遠くの小さな通りに、貧しい家がある'],
    ],
    notes: {
      '“Far away,” continued the statue in a low musical voice,': 'continue はここでは「話を続ける」。in a … voice で「〜な声で」。musical は「音楽のような・美しい響きの」。',
      '“far away in a little street there is a poor house.': 'there is A で「A がある」。場所を表す語句が文の頭に出ています。',
    },
  }),
  // 53
  ls('[S One {前| of the windows}] [V is] [C open], [接 and] [M {前| through it}] [S I] [V can see] [O a woman] [C {過去分詞:補語| [V seated] [M {前| at a table}]}].', {
    ja: '窓の一つが開いていて、そこから、テーブルについている女の人が見える。',
    chunks: [
      ['One of the windows is open,', '窓の一つが開いている'],
      ['and through it I can see a woman seated at a table.', 'そこから、テーブルについている女の人が見える'],
    ],
    notes: {
      'and through it I can see a woman seated at a table.': 'see A done で「A が〜されているのを見る」。be seated で「座っている」なので、seated at a table は「テーブルについている」。',
    },
  }),
  // 54
  ls('[S Her face] [V is] [C {並列| thin | and worn}], [接 and] [S she] [V has] [O coarse, red hands, {過去分詞>coarse, red hands| [M all] [V pricked] [M {前| by the needle}]}], [接 for] [S she] [V is] [C a seamstress].', {
    ja: 'その人の顔はやせてやつれ、手はがさがさで赤く、針の刺しあとだらけだ。お針子をしているからだ。',
    chunks: [
      ['Her face is thin and worn,', 'その人の顔はやせてやつれている'],
      ['and she has coarse, red hands,', 'そして、がさがさの赤い手をしている'],
      ['all pricked by the needle, for she is a seamstress.', '針ですっかり刺されている（手を）。お針子なのだ'],
    ],
    notes: {
      'Her face is thin and worn,': 'worn は「やつれた・疲れきった」。',
      'and she has coarse, red hands,': 'coarse は「（手ざわりが）がさがさの・荒れた」。',
      'all pricked by the needle, for she is a seamstress.': 'pricked by the needle は hands を後ろから説明し、「針で刺された」。seamstress は「お針子（裁縫で生計を立てる女性）」。',
    },
  }),
  // 55
  ls('[S She] [V is embroidering] [O passion-flowers] [M {前| on a satin gown {前:意味上の主語| for the loveliest {前| of the Queen’s maids-of-honour}} {to:形容詞>a satin gown| [V to wear] [M {前| at the next Court-ball}]}}].', {
    ja: 'その人は、次の宮廷舞踏会で女王のいちばん美しい侍女が着るサテンのドレスに、トケイソウの花の刺しゅうをしているところだ。',
    chunks: [
      ['She is embroidering passion-flowers on a satin gown', '彼女はサテンのドレスにトケイソウの花を刺しゅうしている'],
      ['for the loveliest of the Queen’s maids-of-honour', '女王の侍女のうち、いちばん美しい人が'],
      ['to wear at the next Court-ball.', '次の宮廷舞踏会で着る（ドレスに）'],
    ],
    notes: {
      'She is embroidering passion-flowers on a satin gown': 'embroider は「刺しゅうする」。passion-flower はトケイソウ（時計草）という花。satin gown は「サテン（つやのある絹）のドレス」。',
      'for the loveliest of the Queen’s maids-of-honour': 'for the loveliest … は、後ろの to wear の意味の上の主語で、「いちばん美しい侍女が（着る）」。maid-of-honour は女王に仕える女性（侍女）。honour はイギリスのつづりです。',
      'to wear at the next Court-ball.': 'to wear … が a satin gown を後ろから説明します。Court-ball は宮廷の舞踏会です。',
    },
  }),
  // 56
  ls('[M {前| In a bed {前| in the corner {前| of the room}}}] [S her little boy] [V is lying] [C ill].', {
    ja: '部屋のすみのベッドでは、その人の小さな男の子が病気で寝ている。',
    chunks: [
      ['In a bed in the corner of the room', '部屋のすみのベッドで'],
      ['her little boy is lying ill.', '小さな息子が病気で寝ている'],
    ],
    notes: {
      'her little boy is lying ill.': 'lie ill で「病気で寝ている」。ill は主語の様子を表す補語です。',
    },
  }),
  // 57
  ls('[S He] [V has] [O a fever], [接 and] [V is asking for] [O oranges].', {
    ja: '熱があって、オレンジがほしいとせがんでいる。',
    chunks: [
      ['He has a fever, and is asking for oranges.', '熱があって、オレンジがほしいとせがんでいる'],
    ],
    notes: {
      'He has a fever, and is asking for oranges.': 'have a fever で「熱がある」。ask for A で「A をほしいと言う・ねだる」。',
    },
  }),
  // 58
  ls('[S His mother] [V has] [O nothing {to:形容詞>nothing| [V to give] [O him]} {前| but river water}], [接 so] [S he] [V is crying].', {
    ja: '母親には、川の水のほかに飲ませてやれるものが何もないので、男の子は泣いているのだ。',
    chunks: [
      ['His mother has nothing to give him but river water,', '母親には、川の水のほかにあげるものが何もない'],
      ['so he is crying.', 'だから男の子は泣いている'],
    ],
    notes: {
      'His mother has nothing to give him but river water,': 'nothing to give him but A で「A 以外に彼にあげるものが何もない」。but は「〜以外に」という前置詞です。',
      'so he is crying.': 'so は「それで・だから」。',
    },
  }),
  // 59
  ls('[独 Swallow], [独 Swallow], [独 little Swallow], [V will] [S you] [M not] [V bring] [O1 her] [O2 the ruby {前| out of my sword-hilt}]?', {
    ja: 'ツバメさん、ツバメさん、小さなツバメさん、わたしの剣のつかのルビーを、その人に持っていってはくれないか。',
    chunks: [
      ['Swallow, Swallow, little Swallow,', 'ツバメさん、ツバメさん、小さなツバメさん'],
      ['will you not bring her the ruby out of my sword-hilt?', 'わたしの剣のつかのルビーを、その人に持っていってくれないか'],
    ],
    notes: {
      'Swallow, Swallow, little Swallow,': 'Swallow を3回くり返して、やさしく呼びかけています。この呼びかけは、物語の中で何度も出てきます。',
      'will you not bring her the ruby out of my sword-hilt?': 'Will you not …? で「〜してくれないか」とていねいに頼む言い方です。bring A B で「A に B を持っていく」。',
    },
  }),
  // 60
  ls('[S My feet] [V are fastened] [M {前| to this pedestal}] [接 and] [S I] [V cannot move].”', {
    ja: 'わたしの足はこの台座に留めつけられていて、動けないのだ」',
    chunks: [
      ['My feet are fastened to this pedestal and I cannot move.”', 'わたしの足はこの台座に留められていて、動けないのだ」'],
    ],
    notes: {
      'My feet are fastened to this pedestal and I cannot move.”': 'be fastened to A で「A に固定されている」。pedestal は像をのせる台座です。',
    },
  }),
  // 61
  ls('[O {引用| “[S I] [V am waited for] [M {前| in Egypt}],”}] [V said] [S the Swallow].', {
    p: true,
    ja: '「エジプトで仲間が待っているんです」とツバメは言った。',
    chunks: [
      ['“I am waited for in Egypt,” said the Swallow.', '「エジプトで待たれているんです」とツバメは言った'],
    ],
    notes: {
      '“I am waited for in Egypt,” said the Swallow.': 'be waited for で「待たれている」（wait for A の受け身）。「わたしは（仲間に）待たれている」ということです。',
    },
  }),
  // 62
  ls('“[S My friends] [V are flying] [M {前| {成句| up and down} the Nile}], [接 and] [V talking] [M {前| to the large lotus-flowers}].', {
    ja: '「仲間たちは、ナイル川をあちこち飛びまわって、大きなハスの花とおしゃべりをしています。',
    chunks: [
      ['“My friends are flying up and down the Nile,', '「仲間たちはナイル川をあちこち飛びまわって'],
      ['and talking to the large lotus-flowers.', '大きなハスの花とおしゃべりしています'],
    ],
    notes: {
      '“My friends are flying up and down the Nile,': 'up and down A で「A をあちこち・行ったり来たり」。the Nile はエジプトを流れるナイル川です。',
      'and talking to the large lotus-flowers.': 'are flying と (are) talking が並んでいます。lotus-flower はハスの花です。',
    },
  }),
  // 63
  ls('[M Soon] [S they] [V will go] [M {前| to sleep}] [M {前| in the tomb {前| of the great King}}].', {
    ja: 'もうすぐ、偉大な王さまのお墓の中で眠るんです。',
    chunks: [
      ['Soon they will go to sleep in the tomb', 'もうすぐ、仲間たちはお墓の中で眠ります'],
      ['of the great King.', '偉大な王さまの（お墓で）'],
    ],
    notes: {
      'Soon they will go to sleep in the tomb': 'go to sleep で「眠りにつく」。tomb は「墓」で、ここでは古代エジプトの王の墓です。',
    },
  }),
  // 64
  ls('[S The King] [V is] [M there] [M himself] [M {前| in his painted coffin}].', {
    ja: '王さまご自身も、色をぬった棺に入って、そこにいます。',
    chunks: [
      ['The King is there himself in his painted coffin.', '王さま自身も、色をぬった棺に入ってそこにいます'],
    ],
    notes: {
      'The King is there himself in his painted coffin.': 'himself は「（王）自身が」と主語を強めます。painted coffin は「絵や色がぬられた棺」。',
    },
  }),
  // 65
  ls('[S He] [V is wrapped] [M {前| in yellow linen}], [接 and] [V embalmed] [M {前| with spices}].', {
    ja: '黄色い亜麻布にくるまれて、香料でミイラにされているんです。',
    chunks: [
      ['He is wrapped in yellow linen, and embalmed with spices.', '黄色い亜麻布にくるまれ、香料でミイラにされています'],
    ],
    notes: {
      'He is wrapped in yellow linen, and embalmed with spices.': 'be wrapped in A で「A にくるまれている」。linen は亜麻布。embalm は「（香料などで）遺体をくさらないようにする」で、is が省かれて wrapped と並んでいます。',
    },
  }),
  // 66
  ls('[M {前| Round his neck}] [V is] [S a chain {前| of pale green jade}], [接 and] [S his hands] [V are] [C {前| like withered leaves}].”', {
    ja: '首には薄緑のひすいの首飾りがかかっていて、手はしおれた木の葉のようです」',
    chunks: [
      ['Round his neck is a chain of pale green jade,', '首には、薄緑のひすいの首飾りがかかっていて'],
      ['and his hands are like withered leaves.”', '手はしおれた木の葉のようです」'],
    ],
    notes: {
      'Round his neck is a chain of pale green jade,': 'Round his neck を文の頭に出した倒置で、is が主語 a chain の前に来ています。jade は「ひすい」。',
      'and his hands are like withered leaves.”': 'withered は「しおれた・枯れた」。ミイラの手の様子です。',
    },
  }),
  // 67
  ls('[O {引用| “[独 Swallow], [独 Swallow], [独 little Swallow],”}] [V said] [S the Prince], [O {引用| “[V will] [S you] [M not] [V stay] [M {前| with me}] [M {前| for one night}], [接 and] [V be] [C my messenger]?}]', {
    p: true,
    ja: '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った。「ひと晩だけ、わたしのところにいて、使いをしてくれないか。',
    chunks: [
      ['“Swallow, Swallow, little Swallow,” said the Prince,', '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った'],
      ['“will you not stay with me for one night,', '「ひと晩だけ、わたしのそばにいてくれないか'],
      ['and be my messenger?', 'そして、わたしの使いになってくれないか'],
    ],
    notes: {
      '“will you not stay with me for one night,': 'Will you not …? で「〜してくれないか」。stay と be が並んでいます。',
      'and be my messenger?': 'messenger は「使いの者」。',
    },
  }),
  // 68
  ls('[S The boy] [V is] [C so thirsty], [接 and] [S the mother] [C so sad].”', {
    ja: '男の子はのどがからからで、母親はとても悲しんでいる」',
    chunks: [
      ['The boy is so thirsty, and the mother so sad.”', '男の子はとてものどがかわいていて、母親はとても悲しんでいる」'],
    ],
    notes: {
      'The boy is so thirsty, and the mother so sad.”': 'the mother so sad は、the mother is so sad の is が省かれた形です。同じ形が続くので、2つ目の動詞を省いています。',
    },
  }),
  // 69
  ls('[O {引用| “[S I] [V don’t think] [O {that省略| [S I] [V like] [O boys]}],”}] [V answered] [S the Swallow].', {
    p: true,
    ja: '「ぼく、男の子はどうも好きじゃないんです」とツバメは答えた。',
    chunks: [
      ['“I don’t think I like boys,” answered the Swallow.', '「男の子は好きじゃないと思います」とツバメは答えた'],
    ],
    notes: {
      '“I don’t think I like boys,” answered the Swallow.': 'I don’t think … で「…ではないと思う」。英語では not を think の側に置くのがふつうです。',
    },
  }),
  // 70
  ls('“[M Last summer], [M {副詞節:時| [接 when] [S I] [V was staying] [M {前| on the river}]}], [M there] [V were] [S two rude boys, {同格>two rude boys| the miller’s sons}, {関係,>two rude boys| [S who] [V were] [M always] [V throwing] [O stones] [M {前| at me}]}].', {
    ja: '「去年の夏、川にいたとき、粉屋の息子の乱暴な男の子が二人いて、いつもぼくに石を投げつけてきたんです。',
    chunks: [
      ['“Last summer, when I was staying on the river,', '「去年の夏、川にいたときのことです'],
      ['there were two rude boys, the miller’s sons,', '乱暴な男の子が二人いました。粉屋の息子たちです'],
      ['who were always throwing stones at me.', 'その子たちが、いつもぼくに石を投げてきたんです'],
    ],
    notes: {
      '“Last summer, when I was staying on the river,': 'stay on the river は「川（のほとり）にとどまる」。',
      'there were two rude boys, the miller’s sons,': 'rude は「乱暴な・無作法な」。the miller’s sons は two rude boys を言いかえた同格の語句で、「粉屋の息子たち」。miller は粉ひき屋です。',
      'who were always throwing stones at me.': 'who は two rude boys に情報を付け足します。be always doing で「いつも〜してばかりいる」と、いらだちを表します。',
    },
  }),
  // 71
  ls('[S They] [M never] [V hit] [O me], [M {成句| of course}]; [S we {同格>we| swallows}] [V fly] [M far too well] [M {前| for that}], [接 and] [M besides], [S I] [V come] [M {前| of a family {形容詞>a family| famous {前| for its agility}}}]; [接 but] [M still], [S it] [V was] [C a mark {前| of disrespect}].”', {
    ja: 'もちろん、一度も当たりはしませんでしたよ。ぼくたちツバメは飛ぶのがうますぎて、あんなものには当たりません。それに、ぼくは身の軽さで有名な家の出ですからね。でもやっぱり、失礼なことには変わりありません」',
    chunks: [
      ['They never hit me, of course;', 'もちろん、一度も当たりはしませんでしたよ'],
      ['we swallows fly far too well for that,', 'ぼくたちツバメは、当たるには飛ぶのがうますぎますから'],
      ['and besides, I come of a family famous for its agility;', 'それに、ぼくは身軽さで有名な家の出ですからね'],
      ['but still, it was a mark of disrespect.”', 'でも、それでも失礼なしるしでした」'],
    ],
    marks: [
      [';', 'セミコロンで、「当たったことはない」ことと、その理由（ツバメは飛ぶのがうますぎる）を区切って続けます。'],
      [';', 'セミコロンで、「当たらなかった」理由の説明を終え、but still（それでも）で始まる本当に言いたいこと（失礼なことだった）へつなぎます。'],
    ],
    notes: {
      'They never hit me, of course;': 'hit はここでは過去形です（hit は形が変わりません）。of course は「もちろん」。',
      'we swallows fly far too well for that,': 'we swallows は「ぼくたちツバメ」で、swallows が we を言いかえています。far too well for that は「それ（石に当たること）にはうますぎるほど」。far は too を強めます。',
      'and besides, I come of a family famous for its agility;': 'besides は「それに・そのうえ」。come of A で「A の出である」。famous for its agility が a family を後ろから説明し、「身軽さで有名な家」。',
      'but still, it was a mark of disrespect.”': 'still は「それでも」。a mark of disrespect は「失礼（軽べつ）のしるし」。自慢話をしながら、実は気にしているのがおかしいところです。',
    },
  }),
  // 72
  ls('[接 But] [S the Happy Prince] [V looked] [C so sad] [M {副詞節:結果| [接 that] [S the little Swallow] [V was] [C sorry]}].', {
    p: true,
    ja: 'けれども、幸福な王子がとても悲しそうだったので、小さなツバメは気の毒になった。',
    chunks: [
      ['But the Happy Prince looked so sad', 'けれども、幸福な王子がとても悲しそうだったので'],
      ['that the little Swallow was sorry.', '小さなツバメは気の毒になった'],
    ],
    notes: {
      'But the Happy Prince looked so sad': 'look sad で「悲しそうに見える」。so … that ～ で「とても…なので～」。',
      'that the little Swallow was sorry.': 'be sorry はここでは「気の毒に思う」。',
    },
  }),
  // 73
  ls('[O {引用| “[S It] [V is] [C very cold] [M here],”}] [S he] [V said]; [O {引用| “[接 but] [S I] [V will stay] [M {前| with you}] [M {前| for one night}], [接 and] [V be] [C your messenger].”}]', {
    ja: '「ここはとても寒いですね」とツバメは言った。「でも、ひと晩だけ、あなたのところにいて、お使いをしてあげましょう」',
    chunks: [
      ['“It is very cold here,” he said;', '「ここはとても寒いですね」と彼は言った'],
      ['“but I will stay with you for one night,', '「でも、ひと晩だけあなたのところにいて'],
      ['and be your messenger.”', 'お使いをしてあげましょう」'],
    ],
    marks: [
      [';', 'セミコロンで、「ここは寒い」という言葉と、but（でも）で始まる「ひと晩いてあげる」という言葉を区切ります。'],
    ],
    notes: {
      '“It is very cold here,” he said;': 'It is very cold here の It は寒暖を表す主語で、訳しません。',
      '“but I will stay with you for one night,': 'will はその場で決めたことを表します。',
      'and be your messenger.”': 'will のあとに stay と be が並んでいます。前に王子が頼んだ言葉（stay with me … and be my messenger）を、そのまま受けています。',
    },
  }),
  // 74
  ls('[O {引用| “[独 Thank you], [独 little Swallow],”}] [V said] [S the Prince].', {
    p: true,
    ja: '「ありがとう、小さなツバメさん」と王子は言った。',
    chunks: [
      ['“Thank you, little Swallow,” said the Prince.', '「ありがとう、小さなツバメさん」と王子は言った'],
    ],
    notes: {
      '“Thank you, little Swallow,” said the Prince.': 'Thank you は、主語 I を省いた決まったお礼の言い方です。little Swallow は呼びかけです。',
    },
  }),
  // 75
  ls('[接 So] [S the Swallow] [V picked out] [O the great ruby] [M {前| from the Prince’s sword}], [接 and] [V flew] [M away] [M {前| with it {前| in his beak}}] [M {前| over the roofs {前| of the town}}].', {
    p: true,
    ja: 'そこでツバメは王子の剣から大きなルビーをつつき出し、それをくちばしにくわえて、町の屋根の上を飛んでいった。',
    chunks: [
      ['So the Swallow picked out the great ruby from the Prince’s sword,', 'そこでツバメは王子の剣から大きなルビーをつつき出した'],
      ['and flew away with it in his beak', 'そしてそれをくちばしにくわえて飛んでいった'],
      ['over the roofs of the town.', '町の屋根の上を'],
    ],
    notes: {
      'So the Swallow picked out the great ruby from the Prince’s sword,': 'pick out A で「A をつつき出す・取り出す」。',
      'and flew away with it in his beak': 'with it in his beak は「それをくちばしにくわえて」（with＋名詞＋前置詞句で、そのときの様子を表します）。',
      'over the roofs of the town.': 'over A で「A の上を越えて」。',
    },
  }),
  // 76
  ls('[S He] [V passed] [M {前| by the cathedral tower, {関係,>the cathedral tower| [M where] [S the white marble angels] [V were sculptured]}}].', {
    p: true,
    ja: 'ツバメは、白い大理石の天使たちが彫られている大聖堂の塔のそばを通りすぎた。',
    chunks: [
      ['He passed by the cathedral tower,', '彼は大聖堂の塔のそばを通りすぎた'],
      ['where the white marble angels were sculptured.', 'そこには白い大理石の天使たちが彫られていた'],
    ],
    notes: {
      'He passed by the cathedral tower,': 'pass by A で「A のそばを通りすぎる」。cathedral は大聖堂です。',
      'where the white marble angels were sculptured.': 'where は the cathedral tower に「そこには〜」と情報を付け足します。marble は大理石、sculpture は「彫刻する」で、were sculptured は受け身です。',
    },
  }),
  // 77
  ls('[S He] [V passed] [M {前| by the palace}] [接 and] [V heard] [O the sound {前| of {動名詞| [V dancing]}}].', {
    ja: '宮殿のそばを通りすぎると、踊っている音が聞こえてきた。',
    chunks: [
      ['He passed by the palace and heard the sound of dancing.', '宮殿のそばを通りすぎ、踊っている音を聞いた'],
    ],
    notes: {
      'He passed by the palace and heard the sound of dancing.': 'passed と heard が、主語 He を共通にして並んでいます。the sound of dancing は「踊っている音（音楽や足音）」。',
    },
  }),
  // 78
  ls('[S A beautiful girl] [V came out] [M {前| on the balcony}] [M {前| with her lover}].', {
    ja: '美しい娘が、恋人といっしょにバルコニーに出てきた。',
    chunks: [
      ['A beautiful girl came out on the balcony with her lover.', '美しい娘が、恋人といっしょにバルコニーに出てきた'],
    ],
    notes: {
      'A beautiful girl came out on the balcony with her lover.': 'come out on A で「A に出てくる」。lover は「恋人」。',
    },
  }),
  // 79
  ls('[O {引用| “[C How wonderful] [S the stars] [V are],”}] [S he] [V said] [M {前| to her}], [O {引用| “[接 and] [C how wonderful] [V is] [S the power {前| of love}]!”}]', {
    ja: '「星はなんて美しいんだろう」と恋人は娘に言った。「そして、愛の力はなんてすばらしいんだろう」',
    chunks: [
      ['“How wonderful the stars are,” he said to her,', '「星はなんてすばらしいんだろう」と彼は娘に言った'],
      ['“and how wonderful is the power of love!”', '「そして、愛の力はなんてすばらしいんだろう」'],
    ],
    notes: {
      '“How wonderful the stars are,” he said to her,': 'How＋形容詞＋主語＋動詞で「なんと〜だろう」という感嘆文です。',
      '“and how wonderful is the power of love!”': '2つ目は is が主語 the power of love の前に出ていますが、同じ感嘆文です。',
    },
  }),
  // 80
  ls('[O {引用| “[S I] [V hope] [O {that省略| [S my dress] [V will be] [C ready] [M {前| in time {前| for the State-ball}}]}],”}] [S she] [V answered]; [O {引用| “[S I] [V have ordered] [O passion-flowers] [C {to:補語| [V to be embroidered] [M {前| on it}]}]; [接 but] [S the seamstresses] [V are] [C so lazy].”}]', {
    p: true,
    ja: '「舞踏会までにドレスが間に合うといいんだけど」と娘は答えた。「トケイソウの花を刺しゅうするように頼んであるの。でも、お針子たちって、ほんとに怠け者なんだから」',
    chunks: [
      ['“I hope my dress will be ready in time for the State-ball,”', '「公式の舞踏会に、ドレスが間に合うといいんだけど」'],
      ['she answered;', 'と娘は答えた'],
      ['“I have ordered passion-flowers to be embroidered on it;', '「トケイソウの花を刺しゅうするように頼んであるの'],
      ['but the seamstresses are so lazy.”', 'でも、お針子たちはとても怠け者なんだから」'],
    ],
    marks: [
      [';', 'セミコロンで、娘の1つ目の言葉（ドレスが間に合うといい）と、続く言葉（刺しゅうを頼んである）を区切ります。'],
      [';', 'セミコロンで、「刺しゅうを頼んである」ことと、but（でも）で始まる不満（お針子は怠け者）を区切ります。'],
    ],
    notes: {
      '“I hope my dress will be ready in time for the State-ball,”': 'hope のあとに that が省かれています。in time for A で「A に間に合って」。State-ball は国の公式の舞踏会です。',
      '“I have ordered passion-flowers to be embroidered on it;': 'order A to be done で「A が〜されるように注文する」。刺しゅうしているのは、さっきの貧しいお針子です。',
      'but the seamstresses are so lazy.”': 'so lazy は「とても怠け者だ」。お針子が夜おそくまで働いていることを、娘は知りません。',
    },
  }),
  // 81
  ls('[S He] [V passed] [M {前| over the river}], [接 and] [V saw] [O the lanterns] [C {現在分詞:補語| [V hanging] [M {前| to the masts {前| of the ships}}]}].', {
    p: true,
    ja: 'ツバメは川の上を通りすぎ、船のマストにつるされたランタンを見た。',
    chunks: [
      ['He passed over the river,', '彼は川の上を通りすぎた'],
      ['and saw the lanterns hanging to the masts of the ships.', 'そして、船のマストにランタンがつるされているのを見た'],
    ],
    notes: {
      'and saw the lanterns hanging to the masts of the ships.': 'see A doing で「A が〜しているのを見る」。hang to A は「A にぶら下がる」。mast は船の帆柱です。',
    },
  }),
  // 82
  ls('[S He] [V passed] [M {前| over the Ghetto}], [接 and] [V saw] [O the old Jews] [C {現在分詞:補語| [V bargaining] [M {前| with each other}], [接 and] [V weighing out] [O money] [M {前| in copper scales}]}].', {
    ja: 'ゲットーの上を通りすぎると、年とったユダヤ人たちがたがいに値段の交渉をしたり、銅のはかりでお金を量ったりしているのが見えた。',
    chunks: [
      ['He passed over the Ghetto,', '彼はゲットーの上を通りすぎた'],
      ['and saw the old Jews bargaining with each other,', 'そして、年とったユダヤ人たちがたがいに値段の交渉をしているのを見た'],
      ['and weighing out money in copper scales.', 'そして銅のはかりでお金を量っているのを'],
    ],
    notes: {
      'He passed over the Ghetto,': 'the Ghetto は、ヨーロッパの町でユダヤ人が住まわされた地区のことです。',
      'and saw the old Jews bargaining with each other,': 'see A doing で「A が〜しているのを見る」。bargain は「値段の交渉をする」。',
      'and weighing out money in copper scales.': 'weigh out A で「A を量って分ける」。scales は「はかり」。bargaining と weighing が and で並んでいます。',
    },
  }),
  // 83
  ls('[M {前| At last}] [S he] [V came] [M {前| to the poor house}] [接 and] [V looked in].', {
    ja: 'やっとあの貧しい家に着いて、中をのぞきこんだ。',
    chunks: [
      ['At last he came to the poor house and looked in.', 'やっと彼はあの貧しい家に着いて、中をのぞいた'],
    ],
    notes: {
      'At last he came to the poor house and looked in.': 'at last は「やっと・ついに」。look in は「中をのぞく」。',
    },
  }),
  // 84
  ls('[S The boy] [V was tossing] [M feverishly] [M {前| on his bed}], [接 and] [S the mother] [V had fallen] [C asleep], [S she] [V was] [C so tired].', {
    ja: '男の子は熱にうかされてベッドの上で寝返りをうっていて、母親は眠りこんでいた。それほど疲れていたのだ。',
    chunks: [
      ['The boy was tossing feverishly on his bed,', '男の子は熱にうかされて、ベッドの上で寝返りをうっていた'],
      ['and the mother had fallen asleep, she was so tired.', 'そして母親は眠りこんでいた。それほど疲れていたのだ'],
    ],
    notes: {
      'The boy was tossing feverishly on his bed,': 'toss は「（ベッドの上で）寝返りをうつ・身もだえする」。feverishly は「熱にうかされて」。',
      'and the mother had fallen asleep, she was so tired.': 'fall asleep で「眠りこむ」。コンマのあとの she was so tired は、眠りこんだ理由を接続詞なしで付け足しています。',
    },
  }),
  // 85
  ls('[M In] [S he] [V hopped], [接 and] [V laid] [O the great ruby] [M {前| on the table {前| beside the woman’s thimble}}].', {
    ja: 'ツバメはぴょんと中に入ると、大きなルビーを、テーブルの上の、女の人の指ぬきのそばに置いた。',
    chunks: [
      ['In he hopped,', '彼はぴょんと中に入った'],
      ['and laid the great ruby on the table beside the woman’s thimble.', 'そして大きなルビーを、テーブルの上の、女の人の指ぬきのそばに置いた'],
    ],
    notes: {
      'In he hopped,': 'In he hopped は in（中へ）を文の頭に出した形で、ぴょんと飛びこむ勢いを表します。hop は「ぴょんと跳ぶ」。',
      'and laid the great ruby on the table beside the woman’s thimble.': 'lay は「置く」で、laid はその過去形です。thimble は裁縫で指にはめる指ぬきです。',
    },
  }),
  // 86
  ls('[M Then] [S he] [V flew] [M gently] [M {前| round the bed}], [M {分詞構文:付帯状況| [V fanning] [O the boy’s forehead] [M {前| with his wings}]}].', {
    ja: 'それから、つばさで男の子のひたいをあおぎながら、ベッドのまわりをそっと飛びまわった。',
    chunks: [
      ['Then he flew gently round the bed,', 'それから、そっとベッドのまわりを飛んだ'],
      ['fanning the boy’s forehead with his wings.', 'つばさで男の子のひたいをあおぎながら'],
    ],
    notes: {
      'Then he flew gently round the bed,': 'round A で「A のまわりを」。gently は「そっと」。',
      'fanning the boy’s forehead with his wings.': 'fan は「あおぐ」。forehead は「ひたい」。',
    },
  }),
  // 87
  ls('[O {引用| “[C How cool] [S I] [V feel],”}] [V said] [S the boy], [O {引用| “[S I] [V must be getting] [C better]”}]; [接 and] [S he] [V sank] [M {前| into a delicious slumber}].', {
    ja: '「なんだか涼しいなあ」と男の子は言った。「きっとよくなってきているんだ」そして、心地よい眠りに落ちていった。',
    chunks: [
      ['“How cool I feel,” said the boy,', '「なんて涼しいんだろう」と男の子は言った'],
      ['“I must be getting better”;', '「きっとよくなってきているんだ」'],
      ['and he sank into a delicious slumber.', 'そして心地よい眠りに落ちていった'],
    ],
    marks: [
      [';', 'セミコロンで、男の子の言葉と、そのあとの様子（心地よい眠りに落ちた）を区切ってつなぎます。'],
    ],
    notes: {
      '“How cool I feel,” said the boy,': 'How cool I feel は「なんて涼しく感じるんだろう」という感嘆文です。',
      '“I must be getting better”;': 'must be doing で「〜しているにちがいない」。get better は「（病気が）よくなる」。',
      'and he sank into a delicious slumber.': 'sink into A で「A に落ちこむ」。slumber は「眠り」。',
    },
  }),
  // 88
  ls('[M Then] [S the Swallow] [V flew back] [M {前| to the Happy Prince}], [接 and] [V told] [O1 him] [O2 {what節| [O what] [S he] [V had done]}].', {
    p: true,
    ja: 'それからツバメは幸福な王子のところへ飛んで帰り、自分のしてきたことを話した。',
    chunks: [
      ['Then the Swallow flew back to the Happy Prince,', 'それからツバメは幸福な王子のところへ飛んで帰り'],
      ['and told him what he had done.', '自分のしたことを王子に話した'],
    ],
    notes: {
      'and told him what he had done.': 'tell A B で「A に B を話す」。what he had done は「彼がしたこと」で、what は先行詞を含む関係代名詞です。',
    },
  }),
  // 89
  ls('[O {引用| “[S It] [V is] [C curious],”}] [S he] [V remarked], [O {引用| “[接 but] [S I] [V feel] [C quite warm] [M now], [M {副詞節:譲歩| [接 although] [S it] [V is] [C so cold]}].”}]', {
    ja: '「不思議だなあ」とツバメは言った。「こんなに寒いのに、今はとてもぽかぽかするんです」',
    chunks: [
      ['“It is curious,” he remarked,', '「不思議だなあ」と彼は言った'],
      ['“but I feel quite warm now, although it is so cold.”', '「でも、こんなに寒いのに、今はとても暖かく感じるんです」'],
    ],
    notes: {
      '“It is curious,” he remarked,': 'curious は「不思議な」。remark は「（感想を）言う」。',
      '“but I feel quite warm now, although it is so cold.”': 'feel warm で「暖かく感じる」。although は「〜だけれども」。it is so cold の it は寒暖を表す主語です。',
    },
  }),
  // 90
  ls('[O {引用| “[S That] [V is] [C {副詞節:理由| [接 because] [S you] [V have done] [O a good action]}],”}] [V said] [S the Prince].', {
    p: true,
    ja: '「それは、きみが良いおこないをしたからだよ」と王子は言った。',
    chunks: [
      ['“That is because you have done a good action,” said the Prince.', '「それは、きみが良いおこないをしたからだよ」と王子は言った'],
    ],
    notes: {
      '“That is because you have done a good action,” said the Prince.': 'That is because … で「それは…だからだ」。because の節が補語になっています。do a good action は「良いおこないをする」。',
    },
  }),
  // 91
  ls('[接 And] [S the little Swallow] [V began] [O {to:名詞| [V to think]}], [接 and] [M then] [S he] [V fell] [C asleep].', {
    ja: 'そして小さなツバメは考えはじめたが、やがて眠りこんでしまった。',
    chunks: [
      ['And the little Swallow began to think, and then he fell asleep.', 'そして小さなツバメは考えはじめ、それから眠りこんだ'],
    ],
    notes: {
      'And the little Swallow began to think, and then he fell asleep.': 'begin to do で「〜しはじめる」。fall asleep で「眠りこむ」。',
    },
  }),
  // 92
  ls('[S {動名詞| [V Thinking]}] [M always] [V made] [O him] [C sleepy].', {
    ja: '考えごとをすると、いつも眠くなるのだった。',
    chunks: [
      ['Thinking always made him sleepy.', '考えることは、いつも彼を眠くさせた'],
    ],
    notes: {
      'Thinking always made him sleepy.': 'Thinking は動名詞で「考えること」が主語です。make A B で「A を B にする」。考えるのが苦手なツバメを、語り手がからかっています。',
    },
  }),
  // 93
  ls('[M {副詞節:時| [接 When] [S day] [V broke]}] [S he] [V flew] [M down] [M {前| to the river}] [接 and] [V had] [O a bath].', {
    p: true,
    ja: '夜が明けると、ツバメは川へ飛んでいって水浴びをした。',
    chunks: [
      ['When day broke he flew down to the river', '夜が明けると、彼は川へ飛んでおりていき'],
      ['and had a bath.', '水浴びをした'],
    ],
    notes: {
      'When day broke he flew down to the river': 'day breaks で「夜が明ける」。broke は break の過去形です。',
      'and had a bath.': 'have a bath で「水浴びをする」。',
    },
  }),
  // 94
  ls('[O {引用| “[独 What a remarkable phenomenon],”}] [V said] [S the Professor {前| of Ornithology}] [M {副詞節:時| [接 as] [S he] [V was passing] [M {前| over the bridge}]}].', {
    ja: '「なんと驚くべき現象だ」と、橋を渡っていた鳥類学の教授が言った。',
    chunks: [
      ['“What a remarkable phenomenon,”', '「なんと驚くべき現象だ」'],
      ['said the Professor of Ornithology as he was passing over the bridge.', 'と鳥類学の教授が、橋を渡りながら言った'],
    ],
    notes: {
      '“What a remarkable phenomenon,”': 'What a＋形容詞＋名詞で「なんと〜な…だろう」。phenomenon は「現象」。',
      'said the Professor of Ornithology as he was passing over the bridge.': 'ornithology は「鳥類学」。むずかしい言葉を使いたがる学者らしい言い方です。',
    },
  }),
  // 95
  ls('“[独 A swallow {前| in winter}]!”', {
    fragment: true,
    ja: '「冬にツバメとは！」',
    chunks: [
      ['“A swallow in winter!”', '「冬にツバメとは！」'],
    ],
    notes: {
      '“A swallow in winter!”': '動詞のない、驚きの叫びです。ツバメはふつう、冬には暖かい国へ渡っているはずなのです。',
    },
  }),
  // 96
  ls('[接 And] [S he] [V wrote] [O a long letter {前| about it}] [M {前| to the local newspaper}].', {
    ja: 'そして教授は、そのことについて長い手紙を地元の新聞に書き送った。',
    chunks: [
      ['And he wrote a long letter about it to the local newspaper.', 'そして彼はそのことについて長い手紙を地元の新聞に書いた'],
    ],
    notes: {
      'And he wrote a long letter about it to the local newspaper.': 'write a letter to A で「A に手紙を書く」。local newspaper は「地元の新聞」。',
    },
  }),
  // 97
  ls('[S Every one] [V quoted] [O it], [S it] [V was] [C full {前| of so many words {関係>so many words| [O that] [S they] [V could not understand]}}].', {
    ja: 'だれもがその手紙を引用した。わけの分からない言葉が、それはたくさん並んでいたからだ。',
    chunks: [
      ['Every one quoted it,', 'だれもがそれを引用した'],
      ['it was full of so many words that they could not understand.', 'みんなに分からない言葉が、それはたくさん並んでいたのだ'],
    ],
    notes: {
      'Every one quoted it,': 'quote は「引用する」。every one は everyone（だれもが）の古い書き方です。',
      'it was full of so many words that they could not understand.': 'コンマのあとに、引用された理由が接続詞なしで続いています。that は words を説明する関係代名詞で、「彼らには分からない言葉」。分からない言葉ほどありがたがる人々への皮肉です。',
    },
  }),
  // 98
  ls('[O {引用| “[M To-night] [S I] [V go] [M {前| to Egypt}],”}] [V said] [S the Swallow], [接 and] [S he] [V was] [C {前| in high spirits}] [M {前| at the prospect}].', {
    p: true,
    ja: '「今夜こそエジプトへ行くぞ」とツバメは言った。そう思うと、すっかりうきうきしてきた。',
    chunks: [
      ['“To-night I go to Egypt,” said the Swallow,', '「今夜エジプトへ行くぞ」とツバメは言った'],
      ['and he was in high spirits at the prospect.', 'そして、そう思うとうきうきしていた'],
    ],
    notes: {
      '“To-night I go to Egypt,” said the Swallow,': 'To-night は tonight の古いつづり。I go は現在形ですが、決まっている予定を表します。',
      'and he was in high spirits at the prospect.': 'in high spirits で「上機嫌で」。prospect は「これから先の見込み」で、at the prospect は「そう考えると」。',
    },
  }),
  // 99
  ls('[S He] [V visited] [O all the public monuments], [接 and] [V sat] [M a long time] [M {前| on top {前| of the church steeple}}].', {
    ja: 'ツバメは町の記念碑を残らず見物して、教会の尖塔のてっぺんに長いあいだとまっていた。',
    chunks: [
      ['He visited all the public monuments,', '彼は町の記念碑を残らず見物した'],
      ['and sat a long time on top of the church steeple.', 'そして教会の尖塔のてっぺんに長いあいだとまっていた'],
    ],
    notes: {
      'He visited all the public monuments,': 'public monuments は「公共の記念碑・記念像」。',
      'and sat a long time on top of the church steeple.': 'a long time は「長いあいだ」。on top of A で「A のてっぺんに」。steeple は教会のとがった塔です。',
    },
  }),
  // 100
  ls('[M {副詞節:場所| [接 Wherever] [S he] [V went]}] [S the Sparrows] [V chirruped], [接 and] [V said] [M {前| to each other}], [O {引用| “[独 What a distinguished stranger]!”}] [接 so] [S he] [V enjoyed] [O himself] [M very much].', {
    ja: 'どこへ行っても、スズメたちがチュンチュンさえずって、「なんと立派なよそのお方だろう」とささやき合ったので、ツバメはすっかりいい気分になった。',
    chunks: [
      ['Wherever he went the Sparrows chirruped,', 'どこへ行っても、スズメたちがチュンチュン鳴いた'],
      ['and said to each other, “What a distinguished stranger!”', 'そしてたがいに言い合った「なんと立派なよそのお方だろう」'],
      ['so he enjoyed himself very much.', 'それで、彼はとても楽しく過ごした'],
    ],
    notes: {
      'Wherever he went the Sparrows chirruped,': 'wherever は「どこへ〜しても」。chirrup は「（小鳥が）チュンチュン鳴く」。',
      'and said to each other, “What a distinguished stranger!”': 'distinguished は「立派な・気品のある」。stranger は「よそから来た人」。',
      'so he enjoyed himself very much.': 'enjoy oneself で「楽しく過ごす」。',
    },
  }),
  // 101
  ls('[M {副詞節:時| [接 When] [S the moon] [V rose]}] [S he] [V flew back] [M {前| to the Happy Prince}].', {
    p: true,
    ja: '月がのぼると、ツバメは幸福な王子のところへ飛んで帰った。',
    chunks: [
      ['When the moon rose he flew back to the Happy Prince.', '月がのぼると、彼は幸福な王子のところへ飛んで帰った'],
    ],
    notes: {
      'When the moon rose he flew back to the Happy Prince.': 'rose は rise（のぼる）の過去形です。',
    },
  }),
  // 102
  ls('[O {引用| “[V Have] [S you] [O any commissions {前| for Egypt}]?”}] [S he] [V cried]; [O {引用| “[S I] [V am] [M just] [V starting].”}]', {
    ja: '「エジプトに何かご用はありませんか」とツバメは大声で言った。「ちょうど出発するところなんです」',
    chunks: [
      ['“Have you any commissions for Egypt?”', '「エジプトに何かご用はありませんか」'],
      ['he cried; “I am just starting.”', 'と彼は大声で言った「ちょうど出発するところなんです」'],
    ],
    marks: [
      [';', 'セミコロンで、ツバメの問いかけと、そうたずねた理由（ちょうど出発するところ）を区切ります。'],
    ],
    notes: {
      '“Have you any commissions for Egypt?”': 'Have you …? は Do you have …? の古い言い方です。commission は「頼まれごと・用事」。',
      'he cried; “I am just starting.”': 'be just doing で「ちょうど〜するところだ」。',
    },
  }),
  // 103
  ls('[O {引用| “[独 Swallow], [独 Swallow], [独 little Swallow],”}] [V said] [S the Prince], [O {引用| “[V will] [S you] [M not] [V stay] [M {前| with me}] [M one night longer]?”}]', {
    p: true,
    ja: '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った。「もうひと晩、わたしのところにいてくれないか」',
    chunks: [
      ['“Swallow, Swallow, little Swallow,” said the Prince,', '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った'],
      ['“will you not stay with me one night longer?”', '「もうひと晩、わたしのところにいてくれないか」'],
    ],
    notes: {
      '“will you not stay with me one night longer?”': 'one night longer は「もうひと晩」。longer は「もっと長く」。',
    },
  }),
  // 104
  ls('[O {引用| “[S I] [V am waited for] [M {前| in Egypt}],”}] [V answered] [S the Swallow].', {
    p: true,
    ja: '「エジプトで仲間が待っているんです」とツバメは答えた。',
    chunks: [
      ['“I am waited for in Egypt,” answered the Swallow.', '「エジプトで待たれているんです」とツバメは答えた'],
    ],
    notes: {
      '“I am waited for in Egypt,” answered the Swallow.': '前と同じ言い方で断っています。be waited for は「待たれている」。',
    },
  }),
  // 105
  ls('“[M To-morrow] [S my friends] [V will fly up] [M {前| to the Second Cataract}].', {
    ja: '「あしたには、仲間たちはナイル川の第二の滝まで飛んでいきます。',
    chunks: [
      ['“To-morrow my friends will fly up to the Second Cataract.', '「あした、仲間たちは第二の滝まで飛んでいきます'],
    ],
    notes: {
      '“To-morrow my friends will fly up to the Second Cataract.': 'To-morrow は tomorrow の古いつづり。cataract は「大きな滝」で、the Second Cataract はナイル川の上流にある第二の急流（滝）です。',
    },
  }),
  // 106
  ls('[S The river-horse] [V couches] [M there] [M {前| among the bulrushes}], [接 and] [M {前| on a great granite throne}] [V sits] [S the God Memnon].', {
    ja: 'そこではカバがガマのしげみにうずくまっていて、大きな花こう岩の玉座には、メムノンの神が座っています。',
    chunks: [
      ['The river-horse couches there among the bulrushes,', 'そこではカバがガマのしげみにうずくまっている'],
      ['and on a great granite throne sits the God Memnon.', 'そして大きな花こう岩の玉座には、メムノンの神が座っている'],
    ],
    notes: {
      'The river-horse couches there among the bulrushes,': 'river-horse は「カバ」の古い言い方です。couch は「うずくまる・身を伏せる」。bulrush はガマなどの水草です。',
      'and on a great granite throne sits the God Memnon.': 'on a great granite throne を文の頭に出した倒置で、動詞 sits が主語 the God Memnon の前に来ています。granite は花こう岩。Memnon はエジプトにある巨大な石像の名で、夜明けに音を出すと言われました。',
    },
  }),
  // 107
  ls('[M All night long] [S he] [V watches] [O the stars], [接 and] [M {副詞節:時| [接 when] [S the morning star] [V shines]}] [S he] [V utters] [O one cry {前| of joy}], [接 and] [M then] [S he] [V is] [C silent].', {
    ja: 'メムノンはひと晩じゅう星を見つめていて、明けの明星が輝くと、喜びの声をひと声あげ、それからまた黙ってしまうんです。',
    chunks: [
      ['All night long he watches the stars,', 'メムノンはひと晩じゅう星を見つめている'],
      ['and when the morning star shines he utters one cry of joy,', 'そして明けの明星が輝くと、喜びの声をひと声あげる'],
      ['and then he is silent.', 'それから黙ってしまう'],
    ],
    notes: {
      'All night long he watches the stars,': 'all night long で「ひと晩じゅう」。he は Memnon の像を指します。',
      'and when the morning star shines he utters one cry of joy,': 'the morning star は「明けの明星（夜明けに見える金星）」。utter は「（声を）出す」。',
      'and then he is silent.': 'silent は「黙っている・静かな」。',
    },
  }),
  // 108
  ls('[M {前| At noon}] [S the yellow lions] [V come down] [M {前| to the water’s edge}] [M {to:副詞(目的)| [V to drink]}].', {
    ja: 'お昼には、黄色いライオンたちが水を飲みに、水ぎわまでおりてきます。',
    chunks: [
      ['At noon the yellow lions come down', 'お昼には、黄色いライオンたちがおりてくる'],
      ['to the water’s edge to drink.', '水を飲みに、水ぎわまで'],
    ],
    notes: {
      'At noon the yellow lions come down': 'at noon は「正午に」。',
      'to the water’s edge to drink.': 'the water’s edge は「水ぎわ」。to drink は目的を表し、「飲むために」。',
    },
  }),
  // 109
  ls('[S They] [V have] [O eyes {前| like green beryls}], [接 and] [S their roar] [V is] [C louder {前| than the roar {前| of the cataract}}].”', {
    ja: 'ライオンの目は緑の緑柱石のようで、そのほえ声は、滝のとどろきよりも大きいんです」',
    chunks: [
      ['They have eyes like green beryls,', 'ライオンたちは緑の緑柱石のような目をしている'],
      ['and their roar is louder than the roar of the cataract.”', 'そして、そのほえ声は滝のとどろきよりも大きい」'],
    ],
    notes: {
      'They have eyes like green beryls,': 'like A で「A のような」。beryl は緑柱石という宝石です。',
      'and their roar is louder than the roar of the cataract.”': 'roar は「ほえ声・とどろき」。louder than A で「A より大きな音の」。cataract は大きな滝です。',
    },
  }),
  // 110
  ls('[O {引用| “[独 Swallow], [独 Swallow], [独 little Swallow],”}] [V said] [S the Prince], [O {引用| “[M far away] [M {前| across the city}] [S I] [V see] [O a young man {前| in a garret}].}]', {
    p: true,
    ja: '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った。「町のずっと向こうの屋根裏部屋に、若い男が見える。',
    chunks: [
      ['“Swallow, Swallow, little Swallow,” said the Prince,', '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った'],
      ['“far away across the city', '「町のずっと向こうに'],
      ['I see a young man in a garret.', '屋根裏部屋にいる若い男が見える'],
    ],
    notes: {
      '“far away across the city': 'across the city は「町を越えた向こうに」。',
      'I see a young man in a garret.': 'garret は屋根裏部屋で、貧しい人が住む部屋です。',
    },
  }),
  // 111
  ls('[S He] [V is leaning] [M {前| over a desk {過去分詞>a desk| [V covered] [M {前| with papers}]}}], [接 and] [M {前| in a tumbler {前| by his side}}] [M there] [V is] [S a bunch {前| of withered violets}].', {
    ja: '男は、紙が散らばった机の上にかがみこんでいて、そばのコップには、しおれたスミレがひと束さしてある。',
    chunks: [
      ['He is leaning over a desk covered with papers,', '男は、紙でおおわれた机の上にかがみこんでいる'],
      ['and in a tumbler by his side', 'そして、そばのコップには'],
      ['there is a bunch of withered violets.', 'しおれたスミレがひと束ある'],
    ],
    notes: {
      'He is leaning over a desk covered with papers,': 'lean over A で「A の上にかがみこむ」。covered with papers が a desk を後ろから説明し、「紙でおおわれた机」。',
      'and in a tumbler by his side': 'tumbler は「（取っ手のない）コップ」。by his side は「そばに」。',
      'there is a bunch of withered violets.': 'a bunch of A で「ひと束の A」。withered は「しおれた」。',
    },
  }),
  // 112
  ls('[S His hair] [V is] [C {並列| brown | and crisp}], [接 and] [S his lips] [V are] [C red {前| as a pomegranate}], [接 and] [S he] [V has] [O {並列| large | and dreamy} eyes].', {
    ja: '髪は茶色で縮れていて、くちびるはザクロのように赤く、大きな、夢みるような目をしている。',
    chunks: [
      ['His hair is brown and crisp,', '髪は茶色で縮れている'],
      ['and his lips are red as a pomegranate,', 'くちびるはザクロのように赤い'],
      ['and he has large and dreamy eyes.', 'そして、大きな、夢みるような目をしている'],
    ],
    notes: {
      'His hair is brown and crisp,': 'crisp は「（髪が）縮れた」。',
      'and his lips are red as a pomegranate,': 'red as a pomegranate は「ザクロのように赤い」（as red as の1つ目の as が省かれた形）。pomegranate はザクロです。',
      'and he has large and dreamy eyes.': 'dreamy は「夢みるような」。',
    },
  }),
  // 113
  ls('[S He] [V is trying] [O {to:名詞| [V to finish] [O a play] [M {前| for the Director {前| of the Theatre}}]}], [接 but] [S he] [V is] [C too cold {to:副詞(程度)| [V to write] [M any more]}].', {
    ja: '劇場の支配人にわたす芝居を書きあげようとしているのだが、寒すぎて、もうこれ以上書けないのだ。',
    chunks: [
      ['He is trying to finish a play', '男は芝居を書きあげようとしている'],
      ['for the Director of the Theatre,', '劇場の支配人にわたすための'],
      ['but he is too cold to write any more.', 'けれど、寒すぎて、もうこれ以上書けない'],
    ],
    notes: {
      'He is trying to finish a play': 'try to do で「〜しようとする」。play は「劇・脚本」。',
      'for the Director of the Theatre,': 'the Director of the Theatre は劇場の支配人。Theatre はイギリスのつづり（アメリカでは Theater）です。',
      'but he is too cold to write any more.': 'too … to do で「あまりに…で〜できない」。any more は「これ以上」。',
    },
  }),
  // 114
  ls('[M There] [V is] [S no fire] [M {前| in the grate}], [接 and] [S hunger] [V has made] [O him] [C faint].”', {
    ja: '暖炉には火がないし、おなかがすいて、気が遠くなっている」',
    chunks: [
      ['There is no fire in the grate,', '暖炉には火がない'],
      ['and hunger has made him faint.”', 'そして空腹で、気が遠くなっている」'],
    ],
    notes: {
      'There is no fire in the grate,': 'grate は暖炉の火をたく鉄のかごです。',
      'and hunger has made him faint.”': 'make A B で「A を B にする」。faint は「気が遠くなった・ふらふらの」。hunger（空腹）が主語になっています。',
    },
  }),
  // 115
  ls('[O {引用| “[S I] [V will wait] [M {前| with you}] [M one night longer],”}] [V said] [S the Swallow, {関係,>the Swallow| [S who] [M really] [V had] [O a good heart]}].', {
    p: true,
    ja: '「もうひと晩だけ、あなたのところにいてあげましょう」と、本当は心のやさしいツバメは言った。',
    chunks: [
      ['“I will wait with you one night longer,”', '「もうひと晩、あなたのところにいてあげましょう」'],
      ['said the Swallow, who really had a good heart.', 'とツバメは言った。本当は心のやさしいツバメだったのだ'],
    ],
    notes: {
      '“I will wait with you one night longer,”': 'wait はここでは「とどまる」。',
      'said the Swallow, who really had a good heart.': 'who は the Swallow に情報を付け足します。have a good heart で「心がやさしい」。',
    },
  }),
  // 116
  ls('“[V Shall] [S I] [V take] [O1 him] [O2 another ruby]?”', {
    ja: '「その人に、またルビーを持っていきましょうか」',
    chunks: [
      ['“Shall I take him another ruby?”', '「その人に、またルビーを持っていきましょうか」'],
    ],
    notes: {
      '“Shall I take him another ruby?”': 'Shall I …? で「〜しましょうか」。take A B で「A に B を持っていく」。',
    },
  }),
  // 117
  ls('“[独 Alas]!', {
    p: true,
    fragment: true,
    ja: '「ああ！',
    chunks: [
      ['“Alas!', '「ああ！'],
    ],
    notes: {
      '“Alas!': 'Alas! は「ああ」という嘆きの声です。動詞のない、一語だけの文です。',
    },
  }),
  // 118
  ls('[O {引用| [S I] [V have] [O no ruby] [M now],”}] [V said] [S the Prince]; [O {引用| “[S my eyes] [V are] [C all {関係>all| [O that] [S I] [V have] [C left]}].}]', {
    ja: 'ルビーはもうないのだ」と王子は言った。「わたしに残っているのは、この目だけだ。',
    chunks: [
      ['I have no ruby now,” said the Prince;', 'ルビーはもうないのだ」と王子は言った'],
      ['“my eyes are all that I have left.', '「わたしに残っているのは、目だけだ'],
    ],
    marks: [
      [';', 'セミコロンで、「ルビーはもうない」という言葉と、代わりに差し出せるもの（残っているのは目だけ）の話を区切ります。'],
    ],
    notes: {
      'I have no ruby now,” said the Prince;': 'no ruby は「ルビーはひとつもない」。剣のルビーは、もうお針子にあげてしまいました。',
      '“my eyes are all that I have left.': 'all that I have left は「わたしに残っているすべて」。have A left で「A が残っている」。that は all を説明する関係代名詞です。',
    },
  }),
  // 119
  ls('[S They] [V are made] [M {前| of rare sapphires, {関係,>rare sapphires| [S which] [V were brought] [M {前| out of India}] [M a thousand years ago]}}].', {
    ja: 'この目は、千年前にインドから運ばれてきた、めずらしいサファイアでできている。',
    chunks: [
      ['They are made of rare sapphires,', 'この目は、めずらしいサファイアでできている'],
      ['which were brought out of India a thousand years ago.', 'それは千年前にインドから運ばれてきたものだ'],
    ],
    notes: {
      'They are made of rare sapphires,': 'be made of A で「A でできている」。rare は「めずらしい」。',
      'which were brought out of India a thousand years ago.': 'which は rare sapphires に情報を付け足します。bring A out of B で「A を B から持ち出す」。',
    },
  }),
  // 120
  ls('[V Pluck out] [O one {前| of them}] [接 and] [V take] [O it] [M {前| to him}].', {
    ja: 'その一つをつつき出して、あの若者のところへ持っていっておくれ。',
    chunks: [
      ['Pluck out one of them and take it to him.', 'その一つをつつき出して、若者のところへ持っていっておくれ'],
    ],
    notes: {
      'Pluck out one of them and take it to him.': 'Pluck out と take が並ぶ命令文です。pluck out A で「A を抜き取る・つつき出す」。',
    },
  }),
  // 121
  ls('[S He] [V will sell] [O it] [M {前| to the jeweller}], [接 and] [V buy] [O {並列| food | and firewood}], [接 and] [V finish] [O his play].”', {
    ja: 'あの若者はそれを宝石屋に売って、食べ物と薪を買い、芝居を書きあげるだろう」',
    chunks: [
      ['He will sell it to the jeweller,', '若者はそれを宝石屋に売るだろう'],
      ['and buy food and firewood, and finish his play.”', 'そして食べ物と薪を買い、芝居を書きあげるだろう」'],
    ],
    notes: {
      'He will sell it to the jeweller,': 'jeweller は宝石商（イギリスのつづり）です。',
      'and buy food and firewood, and finish his play.”': 'will のあとに sell・buy・finish の3つの動詞が並んでいます。firewood は「たきぎ」。',
    },
  }),
  // 122
  ls('[O {引用| “[独 Dear Prince],”}] [V said] [S the Swallow], [O {引用| “[S I] [V cannot do] [O that]”}]; [接 and] [S he] [V began] [O {to:名詞| [V to weep]}].', {
    p: true,
    ja: '「王子さま」とツバメは言った。「そんなこと、ぼくにはできません」そして、泣きだしてしまった。',
    chunks: [
      ['“Dear Prince,” said the Swallow,', '「王子さま」とツバメは言った'],
      ['“I cannot do that”;', '「そんなことはできません」'],
      ['and he began to weep.', 'そして泣きだした'],
    ],
    marks: [
      [';', 'セミコロンで、ツバメの言葉と、そのあとの様子（泣きだした）を区切ってつなぎます。'],
    ],
    notes: {
      '“Dear Prince,” said the Swallow,': 'Dear Prince は親しみをこめた呼びかけです。',
      '“I cannot do that”;': 'that は「王子の目を抜き取ること」を指します。',
      'and he began to weep.': 'begin to do で「〜しはじめる」。weep は「泣く」。',
    },
  }),
  // 123
  ls('[O {引用| “[独 Swallow], [独 Swallow], [独 little Swallow],”}] [V said] [S the Prince], [O {引用| “[V do] [M {副詞節:様態| [接 as] [S I] [V command] [O you]}].”}]', {
    p: true,
    ja: '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った。「わたしの言うとおりにしておくれ」',
    chunks: [
      ['“Swallow, Swallow, little Swallow,” said the Prince,', '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った'],
      ['“do as I command you.”', '「わたしの言うとおりにしておくれ」'],
    ],
    notes: {
      '“do as I command you.”': 'do as … で「…のとおりにしなさい」という命令文。as は「〜のように」、command は「命じる」。',
    },
  }),
  // 124
  ls('[接 So] [S the Swallow] [V plucked out] [O the Prince’s eye], [接 and] [V flew] [M away] [M {前| to the student’s garret}].', {
    p: true,
    ja: 'そこでツバメは王子の目をつつき出して、学生の屋根裏部屋へ飛んでいった。',
    chunks: [
      ['So the Swallow plucked out the Prince’s eye,', 'そこでツバメは王子の目をつつき出した'],
      ['and flew away to the student’s garret.', 'そして学生の屋根裏部屋へ飛んでいった'],
    ],
    notes: {
      'So the Swallow plucked out the Prince’s eye,': 'pluck out A で「A をつつき出す」。',
      'and flew away to the student’s garret.': 'the student は、さっき王子が話した若者のことです。',
    },
  }),
  // 125
  ls('[仮S It] [V was] [C easy enough] [真S {to:名詞| [V to get in]}], [M {副詞節:理由| [接 as] [M there] [V was] [S a hole] [M {前| in the roof}]}].', {
    ja: '屋根に穴があいていたので、中に入るのはわけもなかった。',
    chunks: [
      ['It was easy enough to get in,', '中に入るのは、じゅうぶん簡単だった'],
      ['as there was a hole in the roof.', '屋根に穴があいていたので'],
    ],
    notes: {
      'It was easy enough to get in,': 'It は形式主語で、中身は to get in（中に入ること）。easy enough は「十分に簡単な」。',
      'as there was a hole in the roof.': 'as は理由を表し「〜なので」。',
    },
  }),
  // 126
  ls('[M {前| Through this}] [S he] [V darted], [接 and] [V came] [M {前| into the room}].', {
    ja: 'その穴からさっと飛びこんで、部屋の中に入った。',
    chunks: [
      ['Through this he darted, and came into the room.', 'その穴からさっと飛びこんで、部屋に入った'],
    ],
    notes: {
      'Through this he darted, and came into the room.': 'Through this（この穴を通って）を文の頭に出しています。dart は「さっと飛ぶ」。',
    },
  }),
  // 127
  ls('[S The young man] [V had] [O his head] [C {過去分詞:補語| [V buried] [M {前| in his hands}]}], [接 so] [S he] [V did not hear] [O the flutter {前| of the bird’s wings}], [接 and] [M {副詞節:時| [接 when] [S he] [V looked up]}] [S he] [V found] [O the beautiful sapphire] [C {現在分詞:補語| [V lying] [M {前| on the withered violets}]}].', {
    ja: '若者は両手に顔をうずめていたので、鳥の羽ばたきの音は聞こえなかった。顔を上げると、しおれたスミレの上に、美しいサファイアがのっていた。',
    chunks: [
      ['The young man had his head buried in his hands,', '若者は両手に顔をうずめていた'],
      ['so he did not hear the flutter of the bird’s wings,', 'それで、鳥の羽ばたきの音が聞こえなかった'],
      ['and when he looked up he found the beautiful sapphire', 'そして顔を上げると、美しいサファイアがあるのに気づいた'],
      ['lying on the withered violets.', 'しおれたスミレの上に'],
    ],
    notes: {
      'The young man had his head buried in his hands,': 'have A done で「A を〜された状態にしている」。had his head buried in his hands は「両手に顔をうずめていた」。',
      'so he did not hear the flutter of the bird’s wings,': 'flutter は「羽ばたき（の音）」。',
      'and when he looked up he found the beautiful sapphire': 'find A doing で「A が〜しているのに気づく」。',
      'lying on the withered violets.': 'lying は lie（ある・横たわる）の -ing形で、「のっている」。',
    },
  }),
  // 128
  ls('[O {引用| “[S I] [V am beginning] [O {to:名詞| [V to be appreciated]}],”}] [S he] [V cried]; [O {引用| “[S this] [V is] [M {前| from some great admirer}].}]', {
    p: true,
    ja: '「ぼくもようやく認められはじめたぞ」と若者は叫んだ。「これは、どこかの熱心なファンからの贈り物だ。',
    chunks: [
      ['“I am beginning to be appreciated,” he cried;', '「ぼくも認められはじめたぞ」と若者は叫んだ'],
      ['“this is from some great admirer.', '「これは、どこかの熱心なファンからだ'],
    ],
    marks: [
      [';', 'セミコロンで、若者の喜びの叫びと、そう思った理由（熱心なファンからの贈り物だ）を区切ります。'],
    ],
    notes: {
      '“I am beginning to be appreciated,” he cried;': 'be appreciated は「（価値を）認められる」。be beginning to do で「〜しはじめている」。',
      '“this is from some great admirer.': 'admirer は「ほめてくれる人・ファン」。本当は王子の目なのに、自分の才能のおかげだと思っているところが皮肉です。',
    },
  }),
  // 129
  ls('[M Now] [S I] [V can finish] [O my play],” [接 and] [S he] [V looked] [C quite happy].', {
    ja: 'これで芝居を書きあげられるぞ」若者はすっかりうれしそうだった。',
    chunks: [
      ['Now I can finish my play,” and he looked quite happy.', 'これで芝居を書きあげられる」そして彼はとてもうれしそうだった'],
    ],
    notes: {
      'Now I can finish my play,” and he looked quite happy.': 'Now は「これで・もう」。引用のあとに and he looked quite happy と語りが続いています。',
    },
  }),
  // 130
  ls('[M The next day] [S the Swallow] [V flew] [M down] [M {前| to the harbour}].', {
    p: true,
    ja: '次の日、ツバメは港へ飛んでいった。',
    chunks: [
      ['The next day the Swallow flew down to the harbour.', '次の日、ツバメは港へ飛んでいった'],
    ],
    notes: {
      'The next day the Swallow flew down to the harbour.': 'harbour は「港」（イギリスのつづり。アメリカでは harbor）。',
    },
  }),
  // 131
  ls('[S He] [V sat] [M {前| on the mast {前| of a large vessel}}] [接 and] [V watched] [O the sailors] [C {現在分詞:補語| [V hauling] [O big chests] [M {前| out of the hold}] [M {前| with ropes}]}].', {
    ja: 'ツバメは大きな船のマストにとまって、水夫たちが船倉から大きな箱を綱で引き上げているのをながめた。',
    chunks: [
      ['He sat on the mast of a large vessel', '彼は大きな船のマストにとまった'],
      ['and watched the sailors hauling big chests', 'そして水夫たちが大きな箱を引き上げているのをながめた'],
      ['out of the hold with ropes.', '船倉から綱で'],
    ],
    notes: {
      'He sat on the mast of a large vessel': 'vessel は「（大きな）船」。',
      'and watched the sailors hauling big chests': 'watch A doing で「A が〜しているのを見る」。haul は「（綱で）引っぱる」。chest は大きな箱です。',
      'out of the hold with ropes.': 'hold は船の荷物を入れる船倉です。',
    },
  }),
  // 132
  ls('[O {引用| “[独 Heave a-hoy]!”}] [S they] [V shouted] [M {副詞節:時| [接 as] [S each chest] [V came up]}].', {
    ja: '箱が一つ上がってくるたびに、水夫たちは「よいしょ！」とかけ声をかけた。',
    chunks: [
      ['“Heave a-hoy!” they shouted as each chest came up.', '「よいしょ！」と、箱が上がってくるたびに水夫たちは叫んだ'],
    ],
    notes: {
      '“Heave a-hoy!” they shouted as each chest came up.': 'Heave a-hoy! は、水夫たちが力を合わせて引くときのかけ声です。as each chest came up は「箱が一つずつ上がってくるたびに」。',
    },
  }),
  // 133
  ls('[O {引用| “[S I] [V am going] [M {前| to Egypt}]”}]! [V cried] [S the Swallow], [接 but] [S nobody] [V minded], [接 and] [M {副詞節:時| [接 when] [S the moon] [V rose]}] [S he] [V flew back] [M {前| to the Happy Prince}].', {
    ja: '「ぼくはエジプトへ行くんだ！」とツバメは叫んだが、だれも気にかけなかった。そして月がのぼると、ツバメは幸福な王子のところへ飛んで帰った。',
    chunks: [
      ['“I am going to Egypt”!', '「ぼくはエジプトへ行くんだ！」'],
      ['cried the Swallow, but nobody minded,', 'とツバメは叫んだが、だれも気にしなかった'],
      ['and when the moon rose he flew back to the Happy Prince.', 'そして月がのぼると、彼は幸福な王子のところへ飛んで帰った'],
    ],
    notes: {
      '“I am going to Egypt”!': '引用のあとに ! が置かれていますが、ツバメの叫びです。',
      'cried the Swallow, but nobody minded,': 'mind は「気にする」。nobody minded で「だれも気にしなかった」。',
    },
  }),
  // 134
  ls('[O {引用| “[S I] [V am come] [M {to:副詞(目的)| [V to bid] [O1 you] [O2 good-bye]}],”}] [S he] [V cried].', {
    p: true,
    ja: '「お別れを言いにきました」とツバメは大きな声で言った。',
    chunks: [
      ['“I am come to bid you good-bye,” he cried.', '「お別れを言いにきました」と彼は大きな声で言った'],
    ],
    notes: {
      '“I am come to bid you good-bye,” he cried.': 'I am come は I have come の古い言い方です。bid A good-bye で「A に別れを告げる」。',
    },
  }),
  // 135
  ls('[O {引用| “[独 Swallow], [独 Swallow], [独 little Swallow],”}] [V said] [S the Prince], [O {引用| “[V will] [S you] [M not] [V stay] [M {前| with me}] [M one night longer]?”}]', {
    p: true,
    ja: '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った。「もうひと晩、わたしのところにいてくれないか」',
    chunks: [
      ['“Swallow, Swallow, little Swallow,” said the Prince,', '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った'],
      ['“will you not stay with me one night longer?”', '「もうひと晩、わたしのところにいてくれないか」'],
    ],
    notes: {
      '“will you not stay with me one night longer?”': '三度目のお願いです。one night longer は「もうひと晩」。',
    },
  }),
  // 136
  ls('[O {引用| “[S It] [V is] [C winter],”}] [V answered] [S the Swallow], [O {引用| “[接 and] [S the chill snow] [V will] [M soon] [V be] [M here].}]', {
    p: true,
    ja: '「もう冬です」とツバメは答えた。「冷たい雪も、もうすぐやってきます。',
    chunks: [
      ['“It is winter,” answered the Swallow,', '「もう冬です」とツバメは答えた'],
      ['“and the chill snow will soon be here.', '「冷たい雪も、もうすぐここに来ます'],
    ],
    notes: {
      '“It is winter,” answered the Swallow,': 'It is winter の It は季節を表す主語です。',
      '“and the chill snow will soon be here.': 'chill は「冷たい」。will soon be here は「もうすぐここに来る」。',
    },
  }),
  // 137
  ls('[M {前| In Egypt}] [S the sun] [V is] [C warm] [M {前| on the green palm-trees}], [接 and] [S the crocodiles] [V lie] [M {前| in the mud}] [接 and] [V look] [M lazily] [M {前| about them}].', {
    ja: 'エジプトでは、緑のヤシの木に日の光が暖かくふりそそぎ、ワニたちは泥の中に寝そべって、のんびりとあたりを見まわしています。',
    chunks: [
      ['In Egypt the sun is warm on the green palm-trees,', 'エジプトでは、緑のヤシの木に日の光が暖かい'],
      ['and the crocodiles lie in the mud and look lazily about them.', 'そしてワニたちは泥の中に寝そべり、のんびりあたりを見まわしている'],
    ],
    notes: {
      'In Egypt the sun is warm on the green palm-trees,': 'palm-tree はヤシの木です。',
      'and the crocodiles lie in the mud and look lazily about them.': 'crocodile は「ワニ」。look about で「あたりを見まわす」。lazily は「のんびりと」。',
    },
  }),
  // 138
  ls('[S My companions] [V are building] [O a nest] [M {前| in the Temple {前| of Baalbec}}], [接 and] [S the {並列| pink | and white} doves] [V are watching] [O them], [接 and] [V cooing] [M {前| to each other}].', {
    ja: '仲間たちはバールベックの神殿に巣を作っていて、桃色や白のハトたちがそれをながめながら、たがいにクークー鳴きかわしています。',
    chunks: [
      ['My companions are building a nest in the Temple of Baalbec,', '仲間たちはバールベックの神殿に巣を作っている'],
      ['and the pink and white doves are watching them,', 'そして桃色や白のハトたちがそれをながめている'],
      ['and cooing to each other.', 'そして、たがいにクークー鳴きかわしている'],
    ],
    notes: {
      'My companions are building a nest in the Temple of Baalbec,': 'Baalbec（バールベック）は、今のレバノンにある古代の神殿の遺跡です。',
      'and the pink and white doves are watching them,': 'dove は「ハト」。',
      'and cooing to each other.': 'coo は「（ハトが）クークー鳴く」。are watching と (are) cooing が並んでいます。',
    },
  }),
  // 139
  ls('[独 Dear Prince], [S I] [V must leave] [O you], [接 but] [S I] [V will] [M never] [V forget] [O you], [接 and] [M next spring] [S I] [V will bring] [O1 you] [M back] [O2 two beautiful jewels {前| in place of those {関係省略:目的格>those| [S you] [V have given away]}}].', {
    ja: '王子さま、ぼくは行かなければなりません。でも、あなたのことは決して忘れません。来年の春には、あなたがあげてしまった宝石のかわりに、美しい宝石を二つ持って帰ってきます。',
    chunks: [
      ['Dear Prince, I must leave you,', '王子さま、ぼくは行かなければなりません'],
      ['but I will never forget you,', 'でも、決してあなたを忘れません'],
      ['and next spring I will bring you back two beautiful jewels', 'そして来年の春、美しい宝石を二つ持って帰ってきます'],
      ['in place of those you have given away.', 'あなたがあげてしまった宝石のかわりに'],
    ],
    notes: {
      'Dear Prince, I must leave you,': 'must は「〜しなければならない」。',
      'and next spring I will bring you back two beautiful jewels': 'bring A back B で「A に B を持って帰る」。',
      'in place of those you have given away.': 'in place of A で「A のかわりに」。those は jewels を指し、those と you の間に関係代名詞が省かれています。give away は「人にあげてしまう」。',
    },
  }),
  // 140
  ls('[S The ruby] [V shall be] [C redder {前| than a red rose}], [接 and] [S the sapphire] [V shall be] [C as blue {前| as the great sea}].”', {
    ja: 'ルビーは赤いバラより赤く、サファイアは大海原のように青いものにしますよ」',
    chunks: [
      ['The ruby shall be redder than a red rose,', 'ルビーは赤いバラより赤いものにします'],
      ['and the sapphire shall be as blue as the great sea.”', 'そしてサファイアは大海原と同じくらい青いものに」'],
    ],
    notes: {
      'The ruby shall be redder than a red rose,': 'shall はここでは話し手の強い意志「きっと〜させる」を表します。redder than A で「A より赤い」。',
      'and the sapphire shall be as blue as the great sea.”': 'as … as A で「A と同じくらい…」。',
    },
  }),
  // 141
  ls('[O {引用| “[M {前| In the square {形容詞>the square| below}}],”}] [V said] [S the Happy Prince], [O {引用| “[M there] [V stands] [S a little match-girl].}]', {
    p: true,
    ja: '「下の広場に」と幸福な王子は言った。「マッチ売りの小さな女の子が立っている。',
    chunks: [
      ['“In the square below,” said the Happy Prince,', '「下の広場に」と幸福な王子は言った'],
      ['“there stands a little match-girl.', '「マッチ売りの小さな女の子が立っている'],
    ],
    notes: {
      '“In the square below,” said the Happy Prince,': 'the square below は「下の広場」。below は副詞で、the square を後ろから説明します。',
      '“there stands a little match-girl.': 'there stands A は there is A と同じ形で「A が立っている」。match-girl はマッチ売りの女の子です。',
    },
  }),
  // 142
  ls('[S She] [V has let] [O her matches] [C {原形| [V fall] [M {前| in the gutter}]}], [接 and] [S they] [V are] [M all] [C spoiled].', {
    ja: 'その子はマッチをどぶに落としてしまって、どれもだめになってしまった。',
    chunks: [
      ['She has let her matches fall in the gutter,', 'その子はマッチをどぶに落としてしまった'],
      ['and they are all spoiled.', 'そして、どれもだめになってしまった'],
    ],
    notes: {
      'She has let her matches fall in the gutter,': 'let A do で「A が〜するままにする」。let her matches fall は「マッチを落としてしまった」。gutter は道のわきのどぶです。',
      'and they are all spoiled.': 'spoiled は「だめになった」。',
    },
  }),
  // 143
  ls('[S Her father] [V will beat] [O her] [M {副詞節:条件| [接 if] [S she] [V does not bring] [M home] [O some money]}], [接 and] [S she] [V is crying].', {
    ja: 'お金を持って帰らないと父親にぶたれるので、その子は泣いている。',
    chunks: [
      ['Her father will beat her', '父親はその子をぶつだろう'],
      ['if she does not bring home some money,', 'もしお金を持って帰らなければ'],
      ['and she is crying.', 'それで、その子は泣いている'],
    ],
    notes: {
      'Her father will beat her': 'beat は「たたく・ぶつ」。',
      'if she does not bring home some money,': 'bring home A で「A を家に持って帰る」。',
      'and she is crying.': 'and she is crying は、前の内容を受けて「それで泣いている」。',
    },
  }),
  // 144
  ls('[S She] [V has] [O no {並列| shoes | or stockings}], [接 and] [S her little head] [V is] [C bare].', {
    ja: '靴もくつ下もはいていないし、小さな頭には何もかぶっていない。',
    chunks: [
      ['She has no shoes or stockings, and her little head is bare.', '靴もくつ下もなく、小さな頭には何もかぶっていない'],
    ],
    notes: {
      'She has no shoes or stockings, and her little head is bare.': 'no A or B で「A も B もない」。stockings は長いくつ下。bare は「むき出しの」で、帽子をかぶっていないことです。',
    },
  }),
  // 145
  ls('[V Pluck out] [O my other eye], [接 and] [V give] [O it] [M {前| to her}], [接 and] [S her father] [V will not beat] [O her].”', {
    ja: 'わたしのもう一つの目をつつき出して、あの子にやっておくれ。そうすれば、父親にぶたれずにすむ」',
    chunks: [
      ['Pluck out my other eye, and give it to her,', 'わたしのもう一つの目をつつき出して、あの子にやっておくれ'],
      ['and her father will not beat her.”', 'そうすれば父親はあの子をぶたないだろう」'],
    ],
    notes: {
      'Pluck out my other eye, and give it to her,': 'Pluck out と give が並ぶ命令文です。',
      'and her father will not beat her.”': '命令文＋and … で「〜しなさい、そうすれば…」。',
    },
  }),
  // 146
  ls('[O {引用| “[S I] [V will stay] [M {前| with you}] [M one night longer],”}] [V said] [S the Swallow], [O {引用| “[接 but] [S I] [V cannot pluck out] [O your eye].}]', {
    p: true,
    ja: '「もうひと晩、あなたのところにいてあげます」とツバメは言った。「でも、あなたの目をつつき出すことはできません。',
    chunks: [
      ['“I will stay with you one night longer,”', '「もうひと晩、あなたのところにいてあげます」'],
      ['said the Swallow, “but I cannot pluck out your eye.', 'とツバメは言った「でも、あなたの目はつつき出せません'],
    ],
    notes: {
      '“I will stay with you one night longer,”': 'one night longer は「もうひと晩」。',
      'said the Swallow, “but I cannot pluck out your eye.': 'cannot は「〜できない」。王子の目をつつき出すのは、ツバメにはつらすぎるのです。',
    },
  }),
  // 147
  ls('[S You] [V would be] [C quite blind] [M then].”', {
    ja: 'そんなことをしたら、あなたはすっかり目が見えなくなってしまいます」',
    chunks: [
      ['You would be quite blind then.”', 'そうしたら、あなたはすっかり目が見えなくなってしまいます」'],
    ],
    notes: {
      'You would be quite blind then.”': 'would は「（もしそうしたら）〜だろう」という仮定の気持ち。blind は「目が見えない」。then は「そうしたら」。',
    },
  }),
  // 148
  ls('[O {引用| “[独 Swallow], [独 Swallow], [独 little Swallow],”}] [V said] [S the Prince], [O {引用| “[V do] [M {副詞節:様態| [接 as] [S I] [V command] [O you]}].”}]', {
    p: true,
    ja: '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った。「わたしの言うとおりにしておくれ」',
    chunks: [
      ['“Swallow, Swallow, little Swallow,” said the Prince,', '「ツバメさん、ツバメさん、小さなツバメさん」と王子は言った'],
      ['“do as I command you.”', '「わたしの言うとおりにしておくれ」'],
    ],
    notes: {
      '“do as I command you.”': 'また同じ言葉で命じています。do as … で「…のとおりにしなさい」。',
    },
  }),
  // 149
  ls('[接 So] [S he] [V plucked out] [O the Prince’s other eye], [接 and] [V darted] [M down] [M {前| with it}].', {
    p: true,
    ja: 'そこでツバメは王子のもう一つの目をつつき出し、それを持って、さっと舞いおりた。',
    chunks: [
      ['So he plucked out the Prince’s other eye,', 'そこでツバメは王子のもう一つの目をつつき出した'],
      ['and darted down with it.', 'そしてそれを持って、さっと舞いおりた'],
    ],
    notes: {
      'and darted down with it.': 'dart down は「さっと飛びおりる」。with it は「それを持って」。',
    },
  }),
  // 150
  ls('[S He] [V swooped] [M {前| past the match-girl}], [接 and] [V slipped] [O the jewel] [M {前| into the palm {前| of her hand}}].', {
    ja: 'マッチ売りの女の子のそばをかすめて飛びながら、宝石をその子の手のひらにすべりこませた。',
    chunks: [
      ['He swooped past the match-girl,', '彼はマッチ売りの女の子のそばをかすめて飛んだ'],
      ['and slipped the jewel into the palm of her hand.', 'そして宝石をその子の手のひらにすべりこませた'],
    ],
    notes: {
      'He swooped past the match-girl,': 'swoop は「さっと舞いおりる」。past A は「A のそばを通りすぎて」。',
      'and slipped the jewel into the palm of her hand.': 'slip A into B で「A を B にそっと入れる」。palm は「手のひら」。',
    },
  }),
  // 151
  ls('[O {引用| “[独 What a lovely bit {前| of glass}],”}] [V cried] [S the little girl]; [接 and] [S she] [V ran] [M home], [M {分詞構文:付帯状況| [V laughing]}].', {
    ja: '「なんてきれいなガラスのかけら！」と女の子は叫び、笑いながら家へかけていった。',
    chunks: [
      ['“What a lovely bit of glass,” cried the little girl;', '「なんてきれいなガラスのかけら」と女の子は叫んだ'],
      ['and she ran home, laughing.', 'そして笑いながら家へかけていった'],
    ],
    marks: [
      [';', 'セミコロンで、女の子の叫びと、そのあとの様子（笑いながら走って帰った）を区切ってつなぎます。'],
    ],
    notes: {
      '“What a lovely bit of glass,” cried the little girl;': 'a bit of glass は「ガラスのかけら」。宝石だとは知らず、ガラスだと思っています。',
      'and she ran home, laughing.': 'laughing は分詞構文で「笑いながら」。',
    },
  }),
  // 152
  ls('[M Then] [S the Swallow] [V came back] [M {前| to the Prince}].', {
    p: true,
    ja: 'それからツバメは王子のところへもどってきた。',
    chunks: [
      ['Then the Swallow came back to the Prince.', 'それからツバメは王子のところへもどってきた'],
    ],
    notes: {
      'Then the Swallow came back to the Prince.': 'come back to A で「A のところへもどる」。',
    },
  }),
  // 153
  ls('[O {引用| “[S You] [V are] [C blind] [M now],”}] [S he] [V said], [O {引用| “[接 so] [S I] [V will stay] [M {前| with you}] [M always].”}]', {
    ja: '「あなたはもう目が見えないんですね」とツバメは言った。「だから、ぼくはずっとあなたのそばにいます」',
    chunks: [
      ['“You are blind now,” he said,', '「あなたはもう目が見えないんですね」と彼は言った'],
      ['“so I will stay with you always.”', '「だから、ぼくはずっとあなたのそばにいます」'],
    ],
    notes: {
      '“so I will stay with you always.”': 'so は「だから」。always は「いつまでも・ずっと」。',
    },
  }),
  // 154
  ls('[O {引用| “[独 No], [独 little Swallow],”}] [V said] [S the poor Prince], [O {引用| “[S you] [V must go away] [M {前| to Egypt}].”}]', {
    p: true,
    ja: '「いけないよ、小さなツバメさん」とかわいそうな王子は言った。「きみはエジプトへ行かなければいけない」',
    chunks: [
      ['“No, little Swallow,” said the poor Prince,', '「いけないよ、小さなツバメさん」とかわいそうな王子は言った'],
      ['“you must go away to Egypt.”', '「きみはエジプトへ行かなければいけない」'],
    ],
    notes: {
      '“No, little Swallow,” said the poor Prince,': 'the poor Prince は「かわいそうな王子」。目が見えなくなった王子への、語り手の同情がこめられています。',
      '“you must go away to Egypt.”': 'must は「〜しなければならない」。',
    },
  }),
  // 155
  ls('[O {引用| “[S I] [V will stay] [M {前| with you}] [M always],”}] [V said] [S the Swallow], [接 and] [S he] [V slept] [M {前| at the Prince’s feet}].', {
    p: true,
    ja: '「ぼくは、いつまでもあなたのそばにいます」とツバメは言って、王子の足もとで眠った。',
    chunks: [
      ['“I will stay with you always,” said the Swallow,', '「ぼくはいつまでもあなたのそばにいます」とツバメは言った'],
      ['and he slept at the Prince’s feet.', 'そして王子の足もとで眠った'],
    ],
    notes: {
      'and he slept at the Prince’s feet.': 'at A’s feet で「A の足もとで」。',
    },
  }),
  // 156
  ls('[M All the next day] [S he] [V sat] [M {前| on the Prince’s shoulder}], [接 and] [V told] [O1 him] [O2 stories {前| of {what節| [O what] [S he] [V had seen] [M {前| in strange lands}]}}].', {
    p: true,
    ja: '次の日は一日じゅう、ツバメは王子の肩にとまって、よその国々で見てきたことを話して聞かせた。',
    chunks: [
      ['All the next day he sat on the Prince’s shoulder,', '次の日は一日じゅう、彼は王子の肩にとまっていた'],
      ['and told him stories of what he had seen in strange lands.', 'そして、よその国々で見てきたことを話して聞かせた'],
    ],
    notes: {
      'All the next day he sat on the Prince’s shoulder,': 'all the next day は「次の日は一日じゅう」。',
      'and told him stories of what he had seen in strange lands.': 'tell A stories of B で「A に B の話をする」。what he had seen は「彼が見てきたこと」。strange lands は「知らない（よその）国々」。',
    },
  }),
  // 157（異国の話をセミコロンで6つ並べた長い1文を、6つに分けた1つ目）
  ls('[S He] [V told] [O him] [M {前| of the red ibises, {関係,>the red ibises| [S who] [V stand] [M {前| in long rows}] [M {前| on the banks {前| of the Nile}}], [接 and] [V catch] [O gold-fish] [M {前| in their beaks}]}}];', {
    part: true,
    ja: 'ツバメは王子に話した。ナイル川の岸にずらりと並んで立ち、くちばしで金魚をとる赤いトキのこと。',
    chunks: [
      ['He told him of the red ibises,', '彼は王子に、赤いトキのことを話した'],
      ['who stand in long rows on the banks of the Nile,', 'ナイル川の岸にずらりと並んで立ち'],
      ['and catch gold-fish in their beaks;', 'くちばしで金魚をとる（トキのことを）'],
    ],
    marks: [
      [';', 'セミコロンで、ツバメが話した異国の話の1つ目（赤いトキ）を区切り、次の of the Sphinx …（スフィンクスのこと）へと話を並べていきます。'],
    ],
    notes: {
      'He told him of the red ibises,': 'tell A of B で「A に B のことを話す」。このあと of … が6つ、セミコロンで区切られて並びます。ibis はトキという鳥です。',
      'who stand in long rows on the banks of the Nile,': 'who は the red ibises に情報を付け足します。in long rows は「長い列になって」。bank は「川岸」。',
      'and catch gold-fish in their beaks;': 'stand と catch が並んでいます。gold-fish は「金色の魚」です。',
    },
  }),
  // 158（1つの文の続き。told him の2つ目の of …）
  ls('[M {前| of the Sphinx, {関係,>the Sphinx| [S who] [V is] [C as old {前| as the world itself}], [接 and] [V lives] [M {前| in the desert}], [接 and] [V knows] [O everything]}}];', {
    part: true,
    fragment: true,
    ja: '世界と同じくらい年をとっていて、砂漠に住み、何でも知っているスフィンクスのこと。',
    chunks: [
      ['of the Sphinx, who is as old as the world itself,', 'スフィンクスのことを。それは世界と同じくらい年をとっていて'],
      ['and lives in the desert, and knows everything;', '砂漠に住み、何でも知っている'],
    ],
    marks: [
      [';', 'セミコロンで、2つ目の話（スフィンクス）を区切り、3つ目の話へ続けます。'],
    ],
    notes: {
      'of the Sphinx, who is as old as the world itself,': '前の部分の told him（王子に話した）に続く、2つ目の of … です。Sphinx はエジプトの、人の顔とライオンの体を持つ巨大な像です。as old as the world itself は「世界そのものと同じくらい古い」。',
      'and lives in the desert, and knows everything;': 'is・lives・knows の3つの動詞が、関係代名詞 who を主語にして並んでいます。',
    },
  }),
  // 159（1つの文の続き。3つ目の of …）
  ls('[M {前| of the merchants, {関係,>the merchants| [S who] [V walk] [M slowly] [M {前| by the side {前| of their camels}}], [接 and] [V carry] [O amber beads] [M {前| in their hands}]}}];', {
    part: true,
    fragment: true,
    ja: 'ラクダのわきをゆっくりと歩き、手にはこはくの数珠を持っている商人たちのこと。',
    chunks: [
      ['of the merchants, who walk slowly by the side of their camels,', '商人たちのことを。その人たちはラクダのわきをゆっくり歩き'],
      ['and carry amber beads in their hands;', '手にはこはくの数珠を持っている'],
    ],
    marks: [
      [';', 'セミコロンで、3つ目の話（商人たち）を区切り、4つ目の話へ続けます。'],
    ],
    notes: {
      'of the merchants, who walk slowly by the side of their camels,': '3つ目の of … です。merchant は「商人」。by the side of A で「A のそばを」。',
      'and carry amber beads in their hands;': 'amber は「こはく」、beads は「（数珠の）玉」です。',
    },
  }),
  // 160（1つの文の続き。4つ目の of …）
  ls('[M {前| of the King {前| of the Mountains {前| of the Moon}}, {関係,>the King of the Mountains of the Moon| [S who] [V is] [C as black {前| as ebony}], [接 and] [V worships] [O a large crystal]}}];', {
    part: true,
    fragment: true,
    ja: '黒たんのように黒くて、大きな水晶をあがめている、月の山々の王のこと。',
    chunks: [
      ['of the King of the Mountains of the Moon,', '月の山々の王のことを'],
      ['who is as black as ebony, and worships a large crystal;', 'その王は黒たんのように黒く、大きな水晶をあがめている'],
    ],
    marks: [
      [';', 'セミコロンで、4つ目の話（月の山々の王）を区切り、5つ目の話へ続けます。'],
    ],
    notes: {
      'of the King of the Mountains of the Moon,': '4つ目の of … です。the Mountains of the Moon（月の山々）は、ナイル川の源にあると言い伝えられた山々です。',
      'who is as black as ebony, and worships a large crystal;': 'as black as ebony は「黒たんのように黒い」。ebony は黒くかたい木です。worship は「あがめる・崇拝する」、crystal は「水晶」。',
    },
  }),
  // 161（1つの文の続き。5つ目の of …）
  ls('[M {前| of the great green snake {関係>the great green snake| [S that] [V sleeps] [M {前| in a palm-tree}], [接 and] [V has] [O twenty priests {to:形容詞>twenty priests| [V to feed] [O it] [M {前| with honey-cakes}]}]}}];', {
    part: true,
    fragment: true,
    ja: 'ヤシの木で眠っていて、はちみつのお菓子を食べさせる神官を二十人もかかえている、大きな緑色の蛇のこと。',
    chunks: [
      ['of the great green snake that sleeps in a palm-tree,', 'ヤシの木で眠っている大きな緑色の蛇のことを'],
      ['and has twenty priests to feed it with honey-cakes;', 'その蛇には、はちみつのお菓子を食べさせる神官が二十人いる'],
    ],
    marks: [
      [';', 'セミコロンで、5つ目の話（大きな緑の蛇）を区切り、and で始まる最後の話へ続けます。'],
    ],
    notes: {
      'of the great green snake that sleeps in a palm-tree,': '5つ目の of … です。that は the great green snake を説明する関係代名詞です。',
      'and has twenty priests to feed it with honey-cakes;': 'to feed it が twenty priests を後ろから説明し、「それにえさをやる神官」。priest は「神官・僧」、honey-cake は「はちみつのお菓子」。',
    },
  }),
  // 162（1つの文の続き。最後の of …）
  ls('[接 and] [M {前| of the pygmies {関係>the pygmies| [S who] [V sail] [M {前| over a big lake}] [M {前| on large flat leaves}], [接 and] [V are] [M always] [C {前| at war {前| with the butterflies}}]}}].', {
    fragment: true,
    ja: 'そして、大きな平たい葉に乗って大きな湖をわたり、いつもチョウたちと戦をしている小人たちのこと。',
    chunks: [
      ['and of the pygmies who sail over a big lake', 'そして、大きな湖をわたる小人たちのことを'],
      ['on large flat leaves, and are always at war with the butterflies.', '大きな平たい葉に乗って。その小人たちは、いつもチョウたちと戦をしている'],
    ],
    notes: {
      'and of the pygmies who sail over a big lake': '最後の of … で、and で締めくくります。pygmy はここでは「小人」のことです。',
      'on large flat leaves, and are always at war with the butterflies.': 'be at war with A で「A と戦争をしている」。sail と are が、who を主語にして並んでいます。',
    },
  }),
  // 163
  ls('[O {引用| “[独 Dear little Swallow],”}] [V said] [S the Prince], [O {引用| “[S you] [V tell] [O me] [M {前| of marvellous things}], [接 but] [C more marvellous {前| than anything}] [V is] [S the suffering {並列| {前| of men} | and {前| of women}}].}]', {
    p: true,
    ja: '「かわいい小さなツバメさん」と王子は言った。「きみは、ふしぎな話をいろいろ聞かせてくれる。でも、何よりもふしぎなのは、男の人たち、女の人たちの苦しみなのだよ。',
    chunks: [
      ['“Dear little Swallow,” said the Prince,', '「かわいい小さなツバメさん」と王子は言った'],
      ['“you tell me of marvellous things,', '「きみはふしぎなことを話してくれる'],
      ['but more marvellous than anything is the suffering', 'でも、何よりもふしぎなのは苦しみだ'],
      ['of men and of women.', '男の人たちと女の人たちの'],
    ],
    notes: {
      '“you tell me of marvellous things,': 'tell A of B で「A に B のことを話す」。marvellous は「ふしぎな・驚くべき」（イギリスのつづり）。',
      'but more marvellous than anything is the suffering': 'more marvellous than anything（何よりもふしぎな）を文の頭に出した倒置で、動詞 is が主語 the suffering の前に来ています。',
      'of men and of women.': 'suffering は「苦しみ」。of men and of women は「男たちと女たちの」。',
    },
  }),
  // 164
  ls('[M There] [V is] [S no Mystery {形容詞>no Mystery| so great {前| as Misery}}].', {
    ja: 'みじめさほど大きななぞはないのだ。',
    chunks: [
      ['There is no Mystery so great as Misery.', 'みじめさほど大きななぞはない'],
    ],
    notes: {
      'There is no Mystery so great as Misery.': 'no A so … as B で「B ほど…な A はない」。Mystery（なぞ）と Misery（みじめさ）の音をひびき合わせた言い方で、大文字で強めています。',
    },
  }),
  // 165
  ls('[V Fly] [M {前| over my city}], [独 little Swallow], [接 and] [V tell] [O1 me] [O2 {what節| [O what] [S you] [V see] [M there]}].”', {
    ja: '小さなツバメさん、わたしの町の上を飛んで、そこで見たものを話しておくれ」',
    chunks: [
      ['Fly over my city, little Swallow,', '小さなツバメさん、わたしの町の上を飛んで'],
      ['and tell me what you see there.”', 'そこで見たものを話しておくれ」'],
    ],
    notes: {
      'Fly over my city, little Swallow,': 'Fly と tell が並ぶ命令文です。little Swallow は呼びかけで、途中にはさまっています。',
      'and tell me what you see there.”': 'what you see there は「そこで見るもの」。',
    },
  }),
  // 166
  ls('[接 So] [S the Swallow] [V flew] [M {前| over the great city}], [接 and] [V saw] [O the rich] [C {現在分詞:補語| [V making] [C merry] [M {前| in their beautiful houses}]}], [M {副詞節:対比| [接 while] [S the beggars] [V were sitting] [M {前| at the gates}]}].', {
    p: true,
    ja: 'そこでツバメは大きな町の上を飛びまわった。お金持ちたちが美しい家でどんちゃんさわぎをしているのに、物ごいたちは門のところに座りこんでいるのが見えた。',
    chunks: [
      ['So the Swallow flew over the great city,', 'そこでツバメは大きな町の上を飛んだ'],
      ['and saw the rich making merry in their beautiful houses,', 'そして、お金持ちたちが美しい家で浮かれさわいでいるのを見た'],
      ['while the beggars were sitting at the gates.', 'その一方で、物ごいたちは門のところに座っていた'],
    ],
    notes: {
      'and saw the rich making merry in their beautiful houses,': 'the rich は「お金持ちの人たち」（the＋形容詞で「〜な人々」）。make merry は「浮かれさわぐ」。',
      'while the beggars were sitting at the gates.': 'while は「〜なのに・その一方で」と対比を表します。beggar は「物ごい」。',
    },
  }),
  // 167
  ls('[S He] [V flew] [M {前| into dark lanes}], [接 and] [V saw] [O the white faces {前| of starving children}] [C {現在分詞:補語| [V looking out] [M listlessly] [M {前| at the black streets}]}].', {
    ja: '暗い路地に入っていくと、おなかをすかせた子どもたちの青白い顔が、ぼんやりと黒い通りを見つめていた。',
    chunks: [
      ['He flew into dark lanes,', '彼は暗い路地に飛んでいった'],
      ['and saw the white faces of starving children', 'そして、おなかをすかせた子どもたちの青白い顔を見た'],
      ['looking out listlessly at the black streets.', 'ぼんやりと黒い通りをながめている（顔を）'],
    ],
    notes: {
      'He flew into dark lanes,': 'lane は「路地・小道」。',
      'and saw the white faces of starving children': 'starving は「飢えている」。white faces は「青白い顔」。',
      'looking out listlessly at the black streets.': 'look out at A で「（中から）A をながめる」。listlessly は「ぼんやりと・元気なく」。',
    },
  }),
  // 168
  ls('[M {前| Under the archway {前| of a bridge}}] [S two little boys] [V were lying] [M {前| in one another’s arms}] [M {to:副詞(目的)| [V to try] [接 and] [V keep] [O themselves] [C warm]}].', {
    ja: '橋のアーチの下では、小さな男の子が二人、体を温めようとして、抱き合って寝ていた。',
    chunks: [
      ['Under the archway of a bridge', '橋のアーチの下では'],
      ['two little boys were lying in one another’s arms', '小さな男の子が二人、抱き合って寝ていた'],
      ['to try and keep themselves warm.', '体を温めようとして'],
    ],
    notes: {
      'Under the archway of a bridge': 'archway は「アーチ形の下の通り道」。',
      'two little boys were lying in one another’s arms': 'in one another’s arms は「たがいに抱き合って」。',
      'to try and keep themselves warm.': 'try and do は try to do と同じで「〜しようとする」。keep A warm で「A を暖かくしておく」。',
    },
  }),
  // 169
  ls('[O {引用| “[C How hungry] [S we] [V are]!”}] [S they] [V said].', {
    ja: '「おなかがすいたなあ！」と二人は言った。',
    chunks: [
      ['“How hungry we are!” they said.', '「おなかがすいたなあ」と二人は言った'],
    ],
    notes: {
      '“How hungry we are!” they said.': 'How＋形容詞＋主語＋動詞で「なんと〜なのだろう」という感嘆文です。',
    },
  }),
  // 170
  ls('[O {引用| “[S You] [V must not lie] [M here],”}] [V shouted] [S the Watchman], [接 and] [S they] [V wandered out] [M {前| into the rain}].', {
    ja: '「ここに寝ていちゃいかん」と夜回りがどなったので、二人は雨の中へさまよい出ていった。',
    chunks: [
      ['“You must not lie here,”', '「ここに寝ていてはいけない」'],
      ['shouted the Watchman, and they wandered out into the rain.', 'と夜回りがどなり、二人は雨の中へさまよい出た'],
    ],
    notes: {
      '“You must not lie here,”': 'must not は「〜してはいけない」という禁止です。',
      'shouted the Watchman, and they wandered out into the rain.': 'Watchman は夜の見回りをする人。wander out は「さまよい出る」。',
    },
  }),
  // 171
  ls('[M Then] [S he] [V flew back] [接 and] [V told] [O1 the Prince] [O2 {what節| [O what] [S he] [V had seen]}].', {
    p: true,
    ja: 'それからツバメは飛んで帰って、見てきたことを王子に話した。',
    chunks: [
      ['Then he flew back and told the Prince what he had seen.', 'それから彼は飛んで帰り、見てきたことを王子に話した'],
    ],
    notes: {
      'Then he flew back and told the Prince what he had seen.': 'tell A B で「A に B を話す」。what he had seen は「彼が見てきたこと」。',
    },
  }),
  // 172
  ls('[O {引用| “[S I] [V am covered] [M {前| with fine gold}],”}] [V said] [S the Prince], [O {引用| “[S you] [V must take] [O it] [M off], [M {反復| leaf by leaf}], [接 and] [V give] [O it] [M {前| to my poor}]; [S the living] [M always] [V think] [O {that節| [接 that] [S gold] [V can make] [O them] [C happy]}].”}]', {
    p: true,
    ja: '「わたしの体は上等の金でおおわれている」と王子は言った。「それを一枚ずつはがして、わたしの町の貧しい人たちにやっておくれ。生きている人たちは、金があれば幸せになれると、いつも思っているものだから」',
    chunks: [
      ['“I am covered with fine gold,” said the Prince,', '「わたしは上等の金でおおわれている」と王子は言った'],
      ['“you must take it off, leaf by leaf,', '「それを一枚ずつはがして'],
      ['and give it to my poor;', 'わたしの町の貧しい人たちにやっておくれ'],
      ['the living always think that gold can make them happy.”', '生きている人たちは、金で幸せになれるといつも思っているのだ」'],
    ],
    marks: [
      [';', 'セミコロンで、「金をはがして貧しい人にやってくれ」という頼みと、その理由（生きている人は金で幸せになれると思っている）を区切ります。'],
    ],
    notes: {
      '“I am covered with fine gold,” said the Prince,': 'be covered with A で「A でおおわれている」。',
      '“you must take it off, leaf by leaf,': 'take A off で「A をはがす」。leaf by leaf は「一枚ずつ」。',
      'and give it to my poor;': 'my poor は「わたしの（町の）貧しい人たち」。',
      'the living always think that gold can make them happy.”': 'the living は「生きている人たち」（the＋形容詞）。make A B で「A を B にする」。金で幸せになれると思っているのは生きている人たちだ、という王子の悲しい見方です。',
    },
  }),
  // 173
  ls('[O {成句| Leaf after leaf} {前| of the fine gold}] [S the Swallow] [V picked off], [M {副詞節:時| [接 till] [S the Happy Prince] [V looked] [C quite {並列| dull | and grey}]}].', {
    p: true,
    ja: 'ツバメは上等な金を一枚また一枚とはがしていき、とうとう幸福な王子は、すっかりくすんだ灰色になってしまった。',
    chunks: [
      ['Leaf after leaf of the fine gold the Swallow picked off,', '上等な金を一枚また一枚と、ツバメははがしていった'],
      ['till the Happy Prince looked quite dull and grey.', 'とうとう幸福な王子は、すっかりくすんだ灰色になった'],
    ],
    notes: {
      'Leaf after leaf of the fine gold the Swallow picked off,': 'Leaf after leaf of the fine gold（上等な金を一枚また一枚と）は picked off の目的語で、文の頭に出して強めています。pick off は「つまんではがす」。',
      'till the Happy Prince looked quite dull and grey.': 'till は「〜するまで（とうとう）」。dull は「くすんだ」、grey は「灰色の」（イギリスのつづり）。',
    },
  }),
  // 174
  ls('[O {成句| Leaf after leaf} {前| of the fine gold}] [S he] [V brought] [M {前| to the poor}], [接 and] [S the children’s faces] [V grew] [C rosier], [接 and] [S they] [V laughed] [接 and] [V played] [O games] [M {前| in the street}].', {
    ja: '上等な金を一枚また一枚と貧しい人たちのところへ運んでいくと、子どもたちの顔はばら色になり、通りで笑ったり遊んだりするようになった。',
    chunks: [
      ['Leaf after leaf of the fine gold he brought to the poor,', '上等な金を一枚また一枚と、彼は貧しい人たちに運んだ'],
      ['and the children’s faces grew rosier,', 'すると子どもたちの顔は、ばら色になってきた'],
      ['and they laughed and played games in the street.', 'そして子どもたちは通りで笑い、遊んだ'],
    ],
    notes: {
      'Leaf after leaf of the fine gold he brought to the poor,': 'ここでも目的語 Leaf after leaf of the fine gold を文の頭に出しています。同じ形をくり返して、何度も運んだことを表します。',
      'and the children’s faces grew rosier,': 'grow rosier で「（顔が）もっとばら色になる」。',
      'and they laughed and played games in the street.': 'laughed と played が並んでいます。',
    },
  }),
  // 175
  ls('[O {引用| “[S We] [V have] [O bread] [M now]!”}] [S they] [V cried].', {
    ja: '「パンがあるよ！」と子どもたちは叫んだ。',
    chunks: [
      ['“We have bread now!” they cried.', '「今はパンがあるよ」と子どもたちは叫んだ'],
    ],
    notes: {
      '“We have bread now!” they cried.': 'now は「今は（もう）」。以前は食べる物がなかったことを表します。',
    },
  }),
  // 176
  ls('[M Then] [S the snow] [V came], [接 and] [M {前| after the snow}] [V came] [S the frost].', {
    p: true,
    ja: 'やがて雪が降り、雪のあとには、きびしい冷えこみがやってきた。',
    chunks: [
      ['Then the snow came, and after the snow came the frost.', 'やがて雪が降り、雪のあとには冷えこみがやってきた'],
    ],
    notes: {
      'Then the snow came, and after the snow came the frost.': 'after the snow came the frost は、after the snow を前に出して、動詞 came が主語 the frost の前に来た倒置の形です。frost は「霜・きびしい冷えこみ」。',
    },
  }),
  // 177
  ls('[S The streets] [V looked] [M {副詞節:様態| [接 as if] [S they] [V were made] [M {前| of silver}]}], [S they] [V were] [C so {並列| bright | and glistening}]; [S long icicles {前| like crystal daggers}] [V hung down] [M {前| from the eaves {前| of the houses}}], [S everybody] [V went about] [M {前| in furs}], [接 and] [S the little boys] [V wore] [O scarlet caps] [接 and] [V skated] [M {前| on the ice}].', {
    ja: '通りはまるで銀でできているかのようだった。それほど明るくきらきら光っていた。家々の軒からは、水晶の短剣のような長いつららがたれさがり、だれもが毛皮を着て出歩き、小さな男の子たちは緋色の帽子をかぶって氷の上でスケートをした。',
    chunks: [
      ['The streets looked as if they were made of silver,', '通りはまるで銀でできているかのように見えた'],
      ['they were so bright and glistening;', 'それほど明るく、きらきら光っていた'],
      ['long icicles like crystal daggers hung down', '水晶の短剣のような長いつららがたれさがった'],
      ['from the eaves of the houses,', '家々の軒から'],
      ['everybody went about in furs,', 'だれもが毛皮を着て出歩いた'],
      ['and the little boys wore scarlet caps and skated on the ice.', 'そして小さな男の子たちは緋色の帽子をかぶり、氷の上でスケートをした'],
    ],
    marks: [
      [';', 'セミコロンで、「通りが銀のように光っていた」という様子と、ほかの冬の光景（つらら、毛皮、スケート）を区切って並べます。'],
    ],
    notes: {
      'The streets looked as if they were made of silver,': 'look as if … で「まるで…のように見える」。were made は仮定法の過去形で、実際には銀ではないことを表します。',
      'they were so bright and glistening;': 'コンマのあとに、そう見えた理由が接続詞なしで続いています。glistening は「きらきら光る」。',
      'long icicles like crystal daggers hung down': 'icicle は「つらら」、dagger は「短剣」。like crystal daggers が long icicles を後ろから説明します。',
      'from the eaves of the houses,': 'eaves は「軒（のき）」です。',
      'everybody went about in furs,': 'go about in A で「A を着て出歩く」。furs は「毛皮の服」。',
      'and the little boys wore scarlet caps and skated on the ice.': 'wore と skated が並んでいます。scarlet は「緋色の」。',
    },
  }),
  // 178
  ls('[S The poor little Swallow] [V grew] [C {成句| colder and colder}], [接 but] [S he] [V would not leave] [O the Prince], [S he] [V loved] [O him] [M too well].', {
    p: true,
    ja: 'かわいそうな小さなツバメは、どんどん寒さがこたえるようになったが、王子のそばを離れようとはしなかった。王子のことが、あまりにも好きだったのだ。',
    chunks: [
      ['The poor little Swallow grew colder and colder,', 'かわいそうな小さなツバメは、どんどん寒くなっていった'],
      ['but he would not leave the Prince,', 'けれど、王子のそばを離れようとはしなかった'],
      ['he loved him too well.', '王子のことが、あまりにも好きだったのだ'],
    ],
    notes: {
      'The poor little Swallow grew colder and colder,': '比較級 and 比較級で「ますます〜」。grow colder and colder は「どんどん寒くなる」。',
      'but he would not leave the Prince,': 'would not は「どうしても〜しようとしなかった」という強い気持ちを表します。',
      'he loved him too well.': 'too well は「あまりにも深く」。コンマのあとに、離れなかった理由が接続詞なしで続いています。',
    },
  }),
  // 179
  ls('[S He] [V picked up] [O crumbs] [M {前| outside the baker’s door}] [M {副詞節:時| [接 when] [S the baker] [V was not looking]}] [接 and] [V tried] [O {to:名詞| [V to keep] [O himself] [C warm] [M {前| by {動名詞| [V flapping] [O his wings]}}]}].', {
    ja: 'パン屋が見ていないすきに店の戸口の外でパンくずを拾い、つばさをぱたぱたさせて、体を温めようとした。',
    chunks: [
      ['He picked up crumbs outside the baker’s door', 'ツバメはパン屋の戸口の外で、パンくずを拾った'],
      ['when the baker was not looking', 'パン屋が見ていないときに'],
      ['and tried to keep himself warm by flapping his wings.', 'そして、つばさをぱたぱたさせて体を温めようとした'],
    ],
    notes: {
      'He picked up crumbs outside the baker’s door': 'pick up A で「A を拾う」。crumb は「パンくず」。',
      'when the baker was not looking': 'when the baker was not looking は「パン屋が見ていないときに」。',
      'and tried to keep himself warm by flapping his wings.': 'keep oneself warm で「体を温かく保つ」。by doing で「〜することによって」。flap は「（つばさを）ぱたぱた動かす」。',
    },
  }),
  // 180
  ls('[接 But] [M {前| at last}] [S he] [V knew] [O {that節| [接 that] [S he] [V was going to die]}].', {
    p: true,
    ja: 'けれども、とうとうツバメは、自分がもうすぐ死ぬのだと分かった。',
    chunks: [
      ['But at last he knew that he was going to die.', 'けれども、とうとう彼は自分がもうすぐ死ぬのだと分かった'],
    ],
    notes: {
      'But at last he knew that he was going to die.': 'at last は「とうとう」。be going to do で「（もうすぐ）〜しそうだ」。',
    },
  }),
  // 181
  ls('[S He] [V had] [M just] [O strength {to:形容詞>strength| [V to fly up] [M {前| to the Prince’s shoulder}] [M once more]}].', {
    ja: 'もう一度だけ王子の肩まで飛びあがる力が、やっと残っていた。',
    chunks: [
      ['He had just strength to fly up', '飛びあがる力が、やっと残っていた'],
      ['to the Prince’s shoulder once more.', 'もう一度、王子の肩まで'],
    ],
    notes: {
      'He had just strength to fly up': 'just は「かろうじて・ぎりぎり」。to fly up … が strength を後ろから説明し、「飛びあがる力」。',
      'to the Prince’s shoulder once more.': 'once more は「もう一度」。',
    },
  }),
  // 182
  ls('[O {引用| “[独 Good-bye], [独 dear Prince]!”}] [S he] [V murmured], [O {引用| “[V will] [S you] [V let] [O me] [C {原形| [V kiss] [O your hand]}]?”}]', {
    ja: '「さようなら、王子さま」とツバメはささやいた。「あなたの手にキスさせてくれますか」',
    chunks: [
      ['“Good-bye, dear Prince!”', '「さようなら、王子さま」'],
      ['he murmured, “will you let me kiss your hand?”', 'と彼はささやいた「あなたの手にキスさせてくれますか」'],
    ],
    notes: {
      '“Good-bye, dear Prince!”': 'dear Prince は親しみをこめた呼びかけです。',
      'he murmured, “will you let me kiss your hand?”': 'murmur は「ささやく・つぶやく」。let A do で「A に〜させてあげる」。Will you let me …? で「〜させてくれますか」。',
    },
  }),
  // 183
  ls('[O {引用| “[S I] [V am] [C glad {that節| [接 that] [S you] [V are going] [M {前| to Egypt}] [M {前| at last}]}], [独 little Swallow],”}] [V said] [S the Prince], [O {引用| “[S you] [V have stayed] [M too long] [M here]; [接 but] [S you] [V must kiss] [O me] [M {前| on the lips}], [接 for] [S I] [V love] [O you].”}]', {
    p: true,
    ja: '「とうとうエジプトへ行くんだね。よかった、小さなツバメさん」と王子は言った。「きみはここに長くいすぎたよ。でも、キスをするならくちびるにしておくれ。わたしはきみが大好きなのだから」',
    chunks: [
      ['“I am glad that you are going to Egypt at last,', '「きみがとうとうエジプトへ行くのがうれしいよ'],
      ['little Swallow,” said the Prince,', '小さなツバメさん」と王子は言った'],
      ['“you have stayed too long here;', '「きみはここに長くいすぎたよ'],
      ['but you must kiss me on the lips, for I love you.”', 'でも、くちびるにキスしておくれ。わたしはきみが大好きなのだから」'],
    ],
    marks: [
      [';', 'セミコロンで、「ここに長くいすぎた」という言葉と、but（でも）で始まる願い（くちびるにキスして）を区切ります。'],
    ],
    notes: {
      '“I am glad that you are going to Egypt at last,': 'I am glad that … で「…してうれしい」。王子は、ツバメがエジプトへ行くのだと思っています。',
      'little Swallow,” said the Prince,': 'little Swallow は呼びかけです。',
      '“you have stayed too long here;': 'too long は「長すぎるほど」。',
      'but you must kiss me on the lips, for I love you.”': 'kiss A on the lips で「A のくちびるにキスする」。for は「というのも」。',
    },
  }),
  // 184
  ls('[O {引用| “[S It] [V is not] [M {前| to Egypt}] [M {強調| [接 that] [S I] [V am going]}],”}] [V said] [S the Swallow].', {
    p: true,
    ja: '「ぼくが行くのは、エジプトではありません」とツバメは言った。',
    chunks: [
      ['“It is not to Egypt that I am going,” said the Swallow.', '「ぼくが行くのはエジプトではありません」とツバメは言った'],
    ],
    notes: {
      '“It is not to Egypt that I am going,” said the Swallow.': 'It is not A that … は強調の構文で、「…するのは A ではない」。to Egypt（エジプトへ）を強めています。',
    },
  }),
  // 185
  ls('“[S I] [V am going] [M {前| to the House {前| of Death}}].', {
    ja: '「死の家へ行くのです。',
    chunks: [
      ['“I am going to the House of Death.', '「死の家へ行くのです'],
    ],
    notes: {
      '“I am going to the House of Death.': 'the House of Death は「死の家」で、死ぬことを遠回しに言っています。',
    },
  }),
  // 186
  ls('[S Death] [V is] [C the brother {前| of Sleep}], [M {成句| is he not}]?”', {
    ja: '死は眠りの兄弟、そうでしょう？」',
    chunks: [
      ['Death is the brother of Sleep, is he not?”', '死は眠りの兄弟、そうでしょう」'],
    ],
    notes: {
      'Death is the brother of Sleep, is he not?”': '…, is he not? は付加疑問で「〜でしょう？」と念を押す言い方です。Death と Sleep を大文字で書き、人のように he と呼んでいます。死は眠りのようなものだ、という昔からの言い方です。',
    },
  }),
  // 187
  ls('[接 And] [S he] [V kissed] [O the Happy Prince] [M {前| on the lips}], [接 and] [V fell down] [C dead] [M {前| at his feet}].', {
    p: true,
    ja: 'そしてツバメは幸福な王子のくちびるにキスをすると、その足もとに落ちて死んでしまった。',
    chunks: [
      ['And he kissed the Happy Prince on the lips,', 'そしてツバメは幸福な王子のくちびるにキスをした'],
      ['and fell down dead at his feet.', 'そして、その足もとに落ちて死んだ'],
    ],
    notes: {
      'And he kissed the Happy Prince on the lips,': 'kiss A on the lips で「A のくちびるにキスする」。',
      'and fell down dead at his feet.': 'fall down dead で「落ちて死ぬ」。dead は、落ちたときの様子を表す補語です。',
    },
  }),
  // 188
  ls('[M {前| At that moment}] [S a curious crack] [V sounded] [M {前| inside the statue}], [M {副詞節:様態| [接 as if] [S something] [V had broken]}].', {
    p: true,
    ja: 'そのとたん、像の中で何かが割れたような、ふしぎなピシッという音がした。',
    chunks: [
      ['At that moment a curious crack sounded inside the statue,', 'そのとたん、像の中でふしぎなピシッという音がした'],
      ['as if something had broken.', 'まるで何かが割れたかのような'],
    ],
    notes: {
      'At that moment a curious crack sounded inside the statue,': 'crack は「ピシッという音・割れる音」。sound は動詞で「鳴る」。',
      'as if something had broken.': 'as if … で「まるで…のように」。had broken は、音がするより前に割れたことを表します。',
    },
  }),
  // 189
  ls('[S The fact] [V is] [C {that節| [接 that] [S the leaden heart] [V had snapped] [M right {前| in two}]}].', {
    ja: '実は、鉛の心臓がまっぷたつに割れてしまったのだ。',
    chunks: [
      ['The fact is that the leaden heart had snapped right in two.', '実は、鉛の心臓がまっぷたつに割れてしまったのだ'],
    ],
    notes: {
      'The fact is that the leaden heart had snapped right in two.': 'The fact is that … で「実は…なのだ」。leaden は「鉛の」。snap in two で「ポキッと二つに割れる」。right は「すっかり」。',
    },
  }),
  // 190
  ls('[S It] [M certainly] [V was] [C a dreadfully hard frost].', {
    ja: 'たしかに、おそろしくきびしい冷えこみだったのだ。',
    chunks: [
      ['It certainly was a dreadfully hard frost.', 'たしかに、おそろしくきびしい冷えこみだった'],
    ],
    notes: {
      'It certainly was a dreadfully hard frost.': 'dreadfully は「ひどく」。hard frost は「きびしい冷えこみ」。心臓が割れたのは寒さのせいだ、と語り手がとぼけて言っています。',
    },
  }),
  // 191
  ls('[M Early the next morning] [S the Mayor] [V was walking] [M {前| in the square {形容詞>the square| below}}] [M {前| in company {前| with the Town Councillors}}].', {
    p: true,
    ja: '次の朝早く、市長は町会議員たちといっしょに、下の広場を歩いていた。',
    chunks: [
      ['Early the next morning the Mayor was walking', '次の朝早く、市長は歩いていた'],
      ['in the square below in company with the Town Councillors.', '町会議員たちといっしょに、下の広場を'],
    ],
    notes: {
      'Early the next morning the Mayor was walking': 'Mayor は「市長」。',
      'in the square below in company with the Town Councillors.': 'in company with A で「A といっしょに」。',
    },
  }),
  // 192
  ls('[M {副詞節:時| [接 As] [S they] [V passed] [O the column]}] [S he] [V looked up] [M {前| at the statue}]: [O {引用| “[独 Dear me]! [C how shabby] [S the Happy Prince] [V looks]!”}] [S he] [V said].', {
    ja: '円柱のそばを通りかかったとき、市長は像を見上げて言った。「おやおや、幸福な王子のなんとみすぼらしいこと！」',
    chunks: [
      ['As they passed the column he looked up at the statue:', '円柱のそばを通りかかったとき、市長は像を見上げた'],
      ['“Dear me! how shabby the Happy Prince looks!” he said.', '「おやおや、幸福な王子のなんとみすぼらしいこと」と市長は言った'],
    ],
    marks: [
      [':', 'コロンで、「像を見上げた」ことに続けて、そのとき市長が言った言葉を示します。'],
    ],
    notes: {
      'As they passed the column he looked up at the statue:': 'as は「〜するとき」。look up at A で「A を見上げる」。',
      '“Dear me! how shabby the Happy Prince looks!” he said.': 'Dear me! は「おやおや」。how shabby … looks は「なんとみすぼらしく見えることか」という感嘆文です。shabby は「みすぼらしい」。',
    },
  }),
  // 193
  ls('[O {引用| “[独 How shabby indeed]!”}] [V cried] [S the Town Councillors, {関係,>the Town Councillors| [S who] [M always] [V agreed] [M {前| with the Mayor}]}]; [接 and] [S they] [V went up] [M {to:副詞(目的)| [V to look] [M {前| at it}]}].', {
    p: true,
    ja: '「まったくみすぼらしい！」と、いつも市長に賛成する町会議員たちは叫んだ。そして、像を見に上がっていった。',
    chunks: [
      ['“How shabby indeed!”', '「まったくみすぼらしい」'],
      ['cried the Town Councillors, who always agreed with the Mayor;', 'と町会議員たちは叫んだ。議員たちはいつも市長に賛成するのだ'],
      ['and they went up to look at it.', 'そして、像を見に上がっていった'],
    ],
    marks: [
      [';', 'セミコロンで、議員たちの叫びと、そのあとの行動（像を見に上がった）を区切ってつなぎます。'],
    ],
    notes: {
      '“How shabby indeed!”': 'How shabby indeed! は「まったく、なんとみすぼらしい」。市長の言葉をそのままくり返しています。',
      'cried the Town Councillors, who always agreed with the Mayor;': 'who は the Town Councillors に情報を付け足します。agree with A で「A に賛成する」。いつも市長に合わせるだけの議員たちへの皮肉です。',
      'and they went up to look at it.': 'to look at it は「それを見るために」。',
    },
  }),
  // 194
  ls('[O {引用| “[S The ruby] [V has fallen] [M {前| out of his sword}], [S his eyes] [V are] [C gone], [接 and] [S he] [V is] [C golden] [M no longer],”}] [V said] [S the Mayor] [M {前| in fact}], [O {引用| “[S he] [V is] [C little better {前| than a beggar}]!”}]', {
    p: true,
    ja: '「ルビーは剣から落ちてしまったし、目はなくなっているし、もう金色でもない」と市長は言った。「これじゃ、物ごいとたいして変わらないじゃないか」',
    chunks: [
      ['“The ruby has fallen out of his sword,', '「ルビーは剣から落ちてしまった'],
      ['his eyes are gone, and he is golden no longer,”', '目はなくなっているし、もう金色でもない」'],
      ['said the Mayor in fact,', 'と市長は実際に言った'],
      ['“he is little better than a beggar!”', '「物ごいとほとんど変わらないじゃないか」'],
    ],
    notes: {
      '“The ruby has fallen out of his sword,': 'fall out of A で「A から落ちる」。has fallen は現在完了で、今はもうないことを表します。',
      'his eyes are gone, and he is golden no longer,”': 'be gone で「なくなっている」。no longer は「もはや〜ない」。',
      'said the Mayor in fact,': 'in fact は「実際（に）」。',
      '“he is little better than a beggar!”': 'little better than A で「A とほとんど変わらない」。beggar は「物ごい」。',
    },
  }),
  // 195
  ls('[O {引用| “[C Little better {前| than a beggar}],”}] [V said] [S the Town Councillors].', {
    p: true,
    ja: '「物ごいとたいして変わりませんな」と町会議員たちは言った。',
    chunks: [
      ['“Little better than a beggar,” said the Town Councillors.', '「物ごいとほとんど変わりませんな」と町会議員たちは言った'],
    ],
    notes: {
      '“Little better than a beggar,” said the Town Councillors.': '市長の言葉を、議員たちがそのままくり返しています。',
    },
  }),
  // 196
  ls('[O {引用| “[接 And] [M here] [V is] [M actually] [S a dead bird] [M {前| at his feet}]!”}] [V continued] [S the Mayor].', {
    p: true,
    ja: '「しかも、足もとには鳥が死んでいるじゃないか！」と市長は続けた。',
    chunks: [
      ['“And here is actually a dead bird at his feet!”', '「しかも、なんと足もとには鳥が死んでいる」'],
      ['continued the Mayor.', 'と市長は続けた'],
    ],
    notes: {
      '“And here is actually a dead bird at his feet!”': 'here is A で「ここに A がある」。actually は「本当に・なんと」と驚きを表します。',
    },
  }),
  // 197
  ls('“[S We] [V must] [M really] [V issue] [O a proclamation {同格that>a proclamation| [接 that] [S birds] [V are not to be allowed] [C {to:補語| [V to die]}] [M here]}].”', {
    ja: '「ここで鳥が死ぬことを禁じる、というお触れを、ぜひとも出さなければ」',
    chunks: [
      ['“We must really issue a proclamation', '「ぜひともお触れを出さなければ'],
      ['that birds are not to be allowed to die here.”', 'ここで鳥が死ぬのは許されない、という（お触れを）」'],
    ],
    notes: {
      '“We must really issue a proclamation': 'issue a proclamation で「布告（お触れ）を出す」。',
      'that birds are not to be allowed to die here.”': 'that 以下は a proclamation の中身を表す同格の節です。be not to be allowed to do で「〜することは許されない」。鳥が死ぬのを法律で禁じようとする、ばかばかしさがおかしいところです。',
    },
  }),
  // 198
  ls('[接 And] [S the Town Clerk] [V made] [O a note {前| of the suggestion}].', {
    ja: 'すると町の書記は、その提案を書きとめた。',
    chunks: [
      ['And the Town Clerk made a note of the suggestion.', 'すると町の書記は、その提案を書きとめた'],
    ],
    notes: {
      'And the Town Clerk made a note of the suggestion.': 'Town Clerk は町の書記。make a note of A で「A を書きとめる」。',
    },
  }),
  // 199
  ls('[接 So] [S they] [V pulled down] [O the statue {前| of the Happy Prince}].', {
    p: true,
    ja: 'こうして人々は、幸福な王子の像を引きおろした。',
    chunks: [
      ['So they pulled down the statue of the Happy Prince.', 'こうして人々は、幸福な王子の像を引きおろした'],
    ],
    notes: {
      'So they pulled down the statue of the Happy Prince.': 'pull down A で「A を引きおろす・取りこわす」。',
    },
  }),
  // 200
  ls('[O {引用| “[M {副詞節:理由| [接 As] [S he] [V is] [M no longer] [C beautiful]}] [S he] [V is] [M no longer] [C useful],”}] [V said] [S the Art Professor {前| at the University}].', {
    ja: '「もう美しくないのだから、もう役にも立たない」と大学の美術の教授は言った。',
    chunks: [
      ['“As he is no longer beautiful he is no longer useful,”', '「もう美しくないのだから、もう役にも立たない」'],
      ['said the Art Professor at the University.', 'と大学の美術の教授は言った'],
    ],
    notes: {
      '“As he is no longer beautiful he is no longer useful,”': 'as は理由「〜なので」。no longer は「もはや〜ない」。美しさを役に立つかどうかで決める、おかしな理屈です。',
      'said the Art Professor at the University.': 'Art Professor は美術の教授です。',
    },
  }),
  // 201
  ls('[M Then] [S they] [V melted] [O the statue] [M {前| in a furnace}], [接 and] [S the Mayor] [V held] [O a meeting {前| of the Corporation}] [M {to:副詞(目的)| [V to decide] [O {疑問詞節| [S what] [V was to be done] [M {前| with the metal}]}]}].', {
    p: true,
    ja: 'それから人々は像を炉でとかし、市長は、その金属をどうするかを決めるために、市の議会を開いた。',
    chunks: [
      ['Then they melted the statue in a furnace,', 'それから人々は像を炉でとかした'],
      ['and the Mayor held a meeting of the Corporation', 'そして市長は市の議会を開いた'],
      ['to decide what was to be done with the metal.', 'その金属をどうするかを決めるために'],
    ],
    notes: {
      'Then they melted the statue in a furnace,': 'melt は「とかす」。furnace は「炉」。',
      'and the Mayor held a meeting of the Corporation': 'hold a meeting で「会議を開く」。the Corporation は市の議会です。',
      'to decide what was to be done with the metal.': 'what was to be done with A で「A をどうすべきか」。be to be done は「されるべきだ」。',
    },
  }),
  // 202
  ls('[O {引用| “[S We] [V must have] [O another statue], [M {成句| of course}],”}] [S he] [V said], [O {引用| “[接 and] [S it] [V shall be] [C a statue {前| of myself}].”}]', {
    ja: '「もちろん、代わりの像が必要だ」と市長は言った。「そして、それはわたしの像にしよう」',
    chunks: [
      ['“We must have another statue, of course,”', '「もちろん、代わりの像が必要だ」'],
      ['he said, “and it shall be a statue of myself.”', 'と市長は言った「そして、それはわたしの像にしよう」'],
    ],
    notes: {
      '“We must have another statue, of course,”': 'another statue は「別の像」。',
      'he said, “and it shall be a statue of myself.”': 'shall はここでは話し手の意志「〜させよう」。a statue of myself は「わたし自身の像」。',
    },
  }),
  // 203
  ls('[O {引用| “[M {前| Of myself}],”}] [V said] [S each {前| of the Town Councillors}], [接 and] [S they] [V quarrelled].', {
    p: true,
    ja: '「いや、わたしの像に」と町会議員たちはめいめいに言って、言い争いになった。',
    chunks: [
      ['“Of myself,” said each of the Town Councillors, and they quarrelled.', '「わたしの像に」と町会議員たちはめいめいに言い、言い争いになった'],
    ],
    notes: {
      '“Of myself,” said each of the Town Councillors, and they quarrelled.': '“Of myself,” は「（像は）わたし自身のものに」。議員が一人ずつ、自分の像を作れと言い出したのです。quarrel は「言い争う」。',
    },
  }),
  // 204
  ls('[M {副詞節:時| [接 When] [S I] [M last] [V heard] [M {前| of them}]}] [S they] [V were quarrelling] [M still].', {
    ja: 'わたしが最後に聞いたときも、まだ言い争いを続けていた。',
    chunks: [
      ['When I last heard of them they were quarrelling still.', 'わたしが最後に聞いたとき、彼らはまだ言い争っていた'],
    ],
    notes: {
      'When I last heard of them they were quarrelling still.': 'I は物語の語り手です。hear of A で「A のうわさを聞く」。still は「まだ」。',
    },
  }),
  // 205
  ls('[O {引用| “[独 What a strange thing]!”}] [V said] [S the overseer {前| of the workmen} {前| at the foundry}].', {
    p: true,
    ja: '「こいつはふしぎだ！」と、鋳物工場の職工長が言った。',
    chunks: [
      ['“What a strange thing!”', '「こいつはふしぎだ」'],
      ['said the overseer of the workmen at the foundry.', 'と鋳物工場の職工長が言った'],
    ],
    notes: {
      'said the overseer of the workmen at the foundry.': 'overseer は「監督」、workman は「職人」。foundry は金属をとかして型に流す鋳物工場です。',
    },
  }),
  // 206
  ls('“[S This broken lead heart] [V will not melt] [M {前| in the furnace}].', {
    ja: '「この割れた鉛の心臓は、炉に入れてもとけないぞ。',
    chunks: [
      ['“This broken lead heart will not melt in the furnace.', '「この割れた鉛の心臓は、炉に入れてもとけない'],
    ],
    notes: {
      '“This broken lead heart will not melt in the furnace.': 'will not は「どうしても〜しない」。lead は「鉛」です。',
    },
  }),
  // 207
  ls('[S We] [V must throw] [O it] [M away].”', {
    ja: '捨ててしまうしかない」',
    chunks: [
      ['We must throw it away.”', '捨ててしまわなければ」'],
    ],
    notes: {
      'We must throw it away.”': 'throw A away で「A を捨てる」。',
    },
  }),
  // 208
  ls('[接 So] [S they] [V threw] [O it] [M {前| on a dust-heap {関係>a dust-heap| [M where] [S the dead Swallow] [V was] [M also] [V lying]}}].', {
    ja: 'そこで人々はそれを、死んだツバメも横たわっているごみの山に投げすてた。',
    chunks: [
      ['So they threw it on a dust-heap', 'そこで人々はそれをごみの山に投げすてた'],
      ['where the dead Swallow was also lying.', 'そこには死んだツバメも横たわっていた'],
    ],
    notes: {
      'So they threw it on a dust-heap': 'dust-heap は「ごみの山」。',
      'where the dead Swallow was also lying.': 'where は a dust-heap を説明する関係副詞で、「そこに〜」。',
    },
  }),
  // 209
  ls('[O {引用| “[V Bring] [O1 me] [O2 the two most precious things {前| in the city}],”}] [V said] [S God] [M {前| to one {前| of His Angels}}]; [接 and] [S the Angel] [V brought] [O1 Him] [O2 {並列| the leaden heart | and the dead bird}].', {
    p: true,
    ja: '「あの町でいちばん尊いものを二つ持ってきなさい」と神さまは天使の一人に言った。天使は、鉛の心臓と死んだ鳥を持ってきた。',
    chunks: [
      ['“Bring me the two most precious things in the city,”', '「あの町でいちばん尊いものを二つ持ってきなさい」'],
      ['said God to one of His Angels;', 'と神さまは天使の一人に言った'],
      ['and the Angel brought Him the leaden heart and the dead bird.', 'そして天使は、鉛の心臓と死んだ鳥を神さまに持ってきた'],
    ],
    marks: [
      [';', 'セミコロンで、神さまの言いつけと、それにこたえた天使の行い（鉛の心臓と死んだ鳥を持ってきた）を区切ってつなぎます。'],
    ],
    notes: {
      '“Bring me the two most precious things in the city,”': 'bring A B で「A に B を持ってくる」。precious は「尊い・貴重な」。',
      'said God to one of His Angels;': 'His と大文字で書くのは、神さまを指すからです。',
      'and the Angel brought Him the leaden heart and the dead bird.': '天使が選んだのは、人々が捨てたものでした。',
    },
  }),
  // 210
  ls('[O {引用| “[S You] [V have] [M rightly] [V chosen],”}] [V said] [S God], [O {引用| “[接 for] [M {前| in my garden {前| of Paradise}}] [S this little bird] [V shall sing] [M {前| for evermore}], [接 and] [M {前| in my city {前| of gold}}] [S the Happy Prince] [V shall praise] [O me].”}]', {
    p: true,
    ja: '「よく選んだ」と神さまは言った。「この小鳥は、わたしの楽園の庭でいつまでも歌い、幸福な王子は、わたしの黄金の都で、わたしをたたえることになるのだから」',
    chunks: [
      ['“You have rightly chosen,” said God,', '「よく選んだ」と神さまは言った'],
      ['“for in my garden of Paradise', '「というのも、わたしの楽園の庭で'],
      ['this little bird shall sing for evermore,', 'この小鳥はいつまでも歌い'],
      ['and in my city of gold the Happy Prince shall praise me.”', 'わたしの黄金の都で、幸福な王子はわたしをたたえるのだから」'],
    ],
    notes: {
      '“You have rightly chosen,” said God,': 'rightly は「正しく」。have chosen は現在完了です。',
      '“for in my garden of Paradise': 'for は「というのも」。Paradise は「天国・楽園」。',
      'this little bird shall sing for evermore,': 'shall は神さまの意志「〜させよう」を表します。for evermore は「永遠に」。',
      'and in my city of gold the Happy Prince shall praise me.”': 'praise は「たたえる」。捨てられたものが、天国でいちばん尊いものとされて、物語は終わります。',
    },
  }),
])
