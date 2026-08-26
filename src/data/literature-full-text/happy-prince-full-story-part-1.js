// 『幸福な王子』短編全文の前半。
const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  Object.values(value).forEach(deepFreeze)
  return Object.freeze(value)
}

export default deepFreeze([
  {
    "original": "HIGH above the city, on a tall column, stood the statue of the Happy Prince. He was gilded all over with thin leaves of fine gold, for eyes he had two bright sapphires, and a large red ruby glowed on his sword-hilt. He was very much admired indeed. “He is as beautiful as a weathercock,” remarked one of the Town Councillors who wished to gain a reputation for having artistic tastes; “only not quite so useful,” he added, fearing lest people should think him unpractical, which he really was not.",
    "translation": "街の高いところ、一本の高い柱の上に、幸福な王子の像が立っていた。像は薄い金箔で全体が金色に輝いており、目には二つの明るいサファイアがはめられ、剣の柄には大きな赤いルビーが輝いていた。人々は本当にその像を非常に称賛した。「彼は風見鶏のように美しい」と、芸術的な趣味を持つことで評判を得たいと望む町議会議員の一人が述べた。「ただし、少し役に立たないけれど」、と彼は、周囲に自分が実用的でないと思われるのを恐れて、付け加えたが、実際にはそうではなかった。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "HIGH above the city, on a tall column,",
        "translation": "街の高くそびえる柱の上に、",
        "speech": "HIGH above the city, on a tall column,"
      },
      {
        "original": "stood the statue of the Happy Prince.",
        "translation": "幸福の王子の像が立っていました。",
        "speech": "stood the statue of the Happy Prince."
      },
      {
        "original": "He was gilded all over with thin leaves of fine gold,",
        "translation": "彼は薄い金箔で全身が覆われ、",
        "speech": "He was gilded all over with thin leaves of fine gold,"
      },
      {
        "original": "for eyes he had two bright sapphires,",
        "translation": "目には二つの明るいサファイア、",
        "speech": "for eyes he had two bright sapphires,"
      },
      {
        "original": "and a large red ruby glowed on his sword-hilt.",
        "translation": "剣の柄には大きな赤いルビーが輝いていました。",
        "speech": "and a large red ruby glowed on his sword-hilt."
      },
      {
        "original": "He was very much admired indeed.",
        "translation": "彼は本当に非常に賞賛されていました。",
        "speech": "He was very much admired indeed."
      },
      {
        "original": "“He is as beautiful as a weathercock,”",
        "translation": "「彼は風見鶏のように美しい」と、",
        "speech": "“He is as beautiful as a weathercock,”"
      },
      {
        "original": "remarked one of the Town Councillors who wished",
        "translation": "芸術的な趣味があると評判を得たいと望む、",
        "speech": "remarked one of the Town Councillors who wished"
      },
      {
        "original": "to gain a reputation for having artistic tastes;",
        "translation": "ある町議が言いました。",
        "speech": "to gain a reputation for having artistic tastes;"
      },
      {
        "original": "“only not quite so useful,” he added,",
        "translation": "「ただし、少しだけ実用的ではないけれど」と彼は付け加え、",
        "speech": "“only not quite so useful,” he added,"
      },
      {
        "original": "fearing lest people should think him unpractical, which he really was not.",
        "translation": "人々が彼を非実用的だと思わないか心配していましたが、実際にはそうではありませんでした。",
        "speech": "fearing lest people should think him unpractical, which he really was not."
      }
    ]
  },
  {
    "original": "“Why can’t you be like the Happy Prince?” asked a sensible mother of her little boy who was crying for the moon. “The Happy Prince never dreams of crying for anything.” “I am glad there is some one in the world who is quite happy,” muttered a disappointed man as he gazed at the wonderful statue. “He looks just like an angel,” said the Charity Children as they came out of the cathedral in their bright scarlet cloaks and their clean white pinafores.",
    "translation": "「どうしてあなたはハッピー・プリンスみたいになれないの？」と、月を欲しがって泣いている小さな男の子に、分別のある母親が尋ねました。「ハッピー・プリンスは何も欲しがって泣いたりは決してしないのよ。」 「世の中には本当に幸せな人がいるんだな」と、落胆した男は素晴らしい像を見つめながらつぶやきました。 「天使みたいだね」と、チャリティー・チルドレンたちは、鮮やかな赤いマントときれいな白いエプロン姿で大聖堂から出てくるときにそう言いました。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Why can’t you be like the Happy Prince?”",
        "translation": "「どうしてあなたはハッピー・プリンスみたいになれないの？」",
        "speech": "“Why can’t you be like the Happy Prince?”"
      },
      {
        "original": "asked a sensible mother of her little boy",
        "translation": "と、賢い母親が泣きじゃくる小さな息子に尋ねました",
        "speech": "asked a sensible mother of her little boy"
      },
      {
        "original": "who was crying for the moon.",
        "translation": "月をねだって泣いている子に。",
        "speech": "who was crying for the moon."
      },
      {
        "original": "“The Happy Prince never dreams of crying for anything.”",
        "translation": "「ハッピー・プリンスは何かを求めて泣くことなんて夢にも思わないのよ。」",
        "speech": "“The Happy Prince never dreams of crying for anything.”"
      },
      {
        "original": "“I am glad there is some one",
        "translation": "「世界には本当に幸せな人がいるんだって、",
        "speech": "“I am glad there is some one"
      },
      {
        "original": "in the world who is quite happy,”",
        "translation": "うれしく思うな。」",
        "speech": "in the world who is quite happy,”"
      },
      {
        "original": "muttered a disappointed man as he gazed at the wonderful statue.",
        "translation": "と、がっかりした男が素晴らしい像を見つめながらつぶやきました。",
        "speech": "muttered a disappointed man as he gazed at the wonderful statue."
      },
      {
        "original": "“He looks just like an angel,”",
        "translation": "「まるで天使みたいに見える。」",
        "speech": "“He looks just like an angel,”"
      },
      {
        "original": "said the Charity Children as they came out",
        "translation": "と、チャリティーの子どもたちは言いました、",
        "speech": "said the Charity Children as they came out"
      },
      {
        "original": "of the cathedral in their bright scarlet cloaks",
        "translation": "大聖堂から出てくるとき、鮮やかな赤いマントをまとい、",
        "speech": "of the cathedral in their bright scarlet cloaks"
      },
      {
        "original": "and their clean white pinafores.",
        "translation": "きれいな白いエプロンを着て。",
        "speech": "and their clean white pinafores."
      }
    ]
  },
  {
    "original": "“How do you know?” said the Mathematical Master, “you have never seen one.” “Ah! but we have, in our dreams,” answered the children; and the Mathematical Master frowned and looked very severe, for he did not approve of children dreaming. One night there flew over the city a little Swallow. His friends had gone away to Egypt six weeks before, but he had stayed behind, for he was in love with the most beautiful Reed. He had met her early in the spring as he was flying down the river after a big yellow moth, and had been so attracted by her slender waist that he had stopped to talk to her.",
    "translation": "「どうしてわかるのですか？」と数学の先生は言いました。「あなたは一度も見たことがないでしょう。」 「ああ！でも私たちは夢の中で見たことがあります」と子どもたちは答えました；数学の先生は眉をひそめ、とても厳しそうな顔をしました。なぜなら、彼は子どもたちが夢を見ることを好まなかったからです。ある夜、小さなつばめが町の上を飛んでいました。彼の友達は六週間前にエジプトへ行ってしまいましたが、彼は残っていました。なぜなら、彼は最も美しい葦の女性に恋をしていたからです。春のはじめに、大きな黄色い蛾を追いながら川を飛んでいるときに彼女に出会い、その細いウエストにあまりにも惹かれたため、立ち止まって話しかけたのです。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“How do you know?”",
        "translation": "「どうしてわかるのですか？」",
        "speech": "“How do you know?”"
      },
      {
        "original": "said the Mathematical Master, “you have never seen one.”",
        "translation": "と数学の師匠が言った。「あなたは一度も見たことがないでしょう。」",
        "speech": "said the Mathematical Master, “you have never seen one.”"
      },
      {
        "original": "“Ah! but we have, in our dreams,” answered the children;",
        "translation": "「ああ！でも私たちは夢の中で見ました」と子供たちが答えた。",
        "speech": "“Ah! but we have, in our dreams,” answered the children;"
      },
      {
        "original": "and the Mathematical Master frowned and looked very severe,",
        "translation": "すると数学の師匠は眉をひそめ、とても厳しい顔をした、",
        "speech": "and the Mathematical Master frowned and looked very severe,"
      },
      {
        "original": "for he did not approve of children dreaming.",
        "translation": "なぜなら彼は子供が夢を見ることを好まなかったからである。",
        "speech": "for he did not approve of children dreaming."
      },
      {
        "original": "One night there flew over the city a little Swallow.",
        "translation": "ある夜、小さなツバメが街の上を飛んだ。",
        "speech": "One night there flew over the city a little Swallow."
      },
      {
        "original": "His friends had gone away to Egypt six weeks before,",
        "translation": "彼の友達は六週間前にエジプトに行ってしまったが、",
        "speech": "His friends had gone away to Egypt six weeks before,"
      },
      {
        "original": "but he had stayed behind,",
        "translation": "彼は後に残った、",
        "speech": "but he had stayed behind,"
      },
      {
        "original": "for he was in love with the most beautiful Reed.",
        "translation": "なぜなら彼は最も美しい葦に恋をしていたからである。",
        "speech": "for he was in love with the most beautiful Reed."
      },
      {
        "original": "He had met her early in the spring",
        "translation": "彼は春の初めに彼女に出会った、",
        "speech": "He had met her early in the spring"
      },
      {
        "original": "as he was flying down the river after a big yellow moth,",
        "translation": "大きな黄色いガを追いかけながら川を飛んでいた時に、",
        "speech": "as he was flying down the river after a big yellow moth,"
      },
      {
        "original": "and had been so attracted by her slender waist",
        "translation": "そして彼女の細い腰にとても惹かれたので、",
        "speech": "and had been so attracted by her slender waist"
      },
      {
        "original": "that he had stopped to talk to her.",
        "translation": "立ち止まって話しかけたのだった。",
        "speech": "that he had stopped to talk to her."
      }
    ]
  },
  {
    "original": "“Shall I love you?” said the Swallow, who liked to come to the point at once, and the Reed made him a low bow. So he flew round and round her, touching the water with his wings, and making silver ripples. This was his courtship, and it lasted all through the summer. “It is a ridiculous attachment,” twittered the other Swallows; “she has no money, and far too many relations”; and indeed the river was quite full of Reeds. Then, when the autumn came they all flew away.",
    "translation": "「あなたを愛してもいいですか？」と、すぐに本題に入りたがるツバメが言いました。すると、アシは低くお辞儀をしました。それから彼はアシの周りをぐるぐる飛び回り、翼で水に触れて銀色の波紋を作りました。これが彼の求愛で、夏の間ずっと続きました。「ばかげた恋愛だわ」と他のツバメたちはさえずりました。「彼女はお金がないし、親戚が多すぎるわ」—実際、川はアシでいっぱいでした。そして秋が来ると、みんな飛び去っていきました。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Shall I love you?”",
        "translation": "「私、あなたを愛してもいいですか？」",
        "speech": "“Shall I love you?”"
      },
      {
        "original": "said the Swallow, who liked to come to the point at once,",
        "translation": "と、すぐに本題に入りたがるツバメが言いました。",
        "speech": "said the Swallow, who liked to come to the point at once,"
      },
      {
        "original": "and the Reed made him a low bow.",
        "translation": "するとヨシは低く頭を下げました。",
        "speech": "and the Reed made him a low bow."
      },
      {
        "original": "So he flew round and round her,",
        "translation": "それから彼はヨシの周りをぐるぐると飛び回り、",
        "speech": "So he flew round and round her,"
      },
      {
        "original": "touching the water with his wings, and making silver ripples.",
        "translation": "翼で水に触れて銀色のさざ波を作りました。",
        "speech": "touching the water with his wings, and making silver ripples."
      },
      {
        "original": "This was his courtship, and it lasted all through the summer.",
        "translation": "これが彼の求愛であり、夏の間ずっと続きました。",
        "speech": "This was his courtship, and it lasted all through the summer."
      },
      {
        "original": "“It is a ridiculous attachment,” twittered the other Swallows;",
        "translation": "「くだらない恋愛だわ」と他のツバメたちがさえずりました。",
        "speech": "“It is a ridiculous attachment,” twittered the other Swallows;"
      },
      {
        "original": "“she has no money, and far too many relations”;",
        "translation": "「彼女にはお金がないし、親戚が多すぎる」",
        "speech": "“she has no money, and far too many relations”;"
      },
      {
        "original": "and indeed the river was quite full of Reeds.",
        "translation": "実際、川はヨシでいっぱいでした。",
        "speech": "and indeed the river was quite full of Reeds."
      },
      {
        "original": "Then, when the autumn came they all flew away.",
        "translation": "そして秋になると、みんな飛び去っていきました。",
        "speech": "Then, when the autumn came they all flew away."
      }
    ]
  },
  {
    "original": "After they had gone he felt lonely, and began to tire of his lady-love. “She has no conversation,” he said, “and I am afraid that she is a coquette, for she is always flirting with the wind.” And certainly, whenever the wind blew, the Reed made the most graceful curtseys. “I admit that she is domestic,” he continued, “but I love travelling, and my wife, consequently, should love travelling also.” “Will you come away with me?” he said finally to her; but the Reed shook her head, she was so attached to her home.",
    "translation": "彼らが去った後、彼は寂しさを感じ、恋人に飽き始めた。「彼女は会話がない」と彼は言った。「それに、彼女はいつも風に恋しているので、気まぐれな女ではないかと思う。」そして実際、風が吹くたびに、葦は最も優雅なお辞儀をした。「確かに彼女は家庭的だ」と彼は続けた。「しかし私は旅行が好きで、だから私の妻も旅行が好きであるべきだ。」「僕と一緒に来てくれるか？」と彼はついに彼女に言った。しかし葦は首を振った、彼女は家にとても愛着があった。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "After they had gone he felt lonely,",
        "translation": "彼らが去った後、彼は孤独を感じました、",
        "speech": "After they had gone he felt lonely,"
      },
      {
        "original": "and began to tire of his lady-love.",
        "translation": "そして彼の恋人にうんざりし始めました。",
        "speech": "and began to tire of his lady-love."
      },
      {
        "original": "“She has no conversation,” he said,",
        "translation": "「彼女は会話ができない」と彼は言いました、",
        "speech": "“She has no conversation,” he said,"
      },
      {
        "original": "“and I am afraid that she is a coquette,",
        "translation": "「そして私は彼女が気まぐれな女の子だと心配です、",
        "speech": "“and I am afraid that she is a coquette,"
      },
      {
        "original": "for she is always flirting with the wind.”",
        "translation": "なぜなら彼女はいつも風にそわそわしているからです。」",
        "speech": "for she is always flirting with the wind.”"
      },
      {
        "original": "And certainly, whenever the wind blew,",
        "translation": "そして確かに、風が吹くたびに、",
        "speech": "And certainly, whenever the wind blew,"
      },
      {
        "original": "the Reed made the most graceful curtseys.",
        "translation": "葦は最も優雅なお辞儀をしました。",
        "speech": "the Reed made the most graceful curtseys."
      },
      {
        "original": "“I admit that she is domestic,” he continued,",
        "translation": "「彼女は家庭的だと認めます」と彼は続けました、",
        "speech": "“I admit that she is domestic,” he continued,"
      },
      {
        "original": "“but I love travelling, and my wife, consequently, should love travelling also.”",
        "translation": "「しかし私は旅行が好きで、その結果、私の妻も旅行が好きでなければなりません。」",
        "speech": "“but I love travelling, and my wife, consequently, should love travelling also.”"
      },
      {
        "original": "“Will you come away with me?”",
        "translation": "「私と一緒に来てくれますか？」",
        "speech": "“Will you come away with me?”"
      },
      {
        "original": "he said finally to her;",
        "translation": "と彼はついに彼女に言いました;",
        "speech": "he said finally to her;"
      },
      {
        "original": "but the Reed shook her head,",
        "translation": "しかし葦は首を振りました、",
        "speech": "but the Reed shook her head,"
      },
      {
        "original": "she was so attached to her home.",
        "translation": "彼女は家にとても愛着がありました。",
        "speech": "she was so attached to her home."
      }
    ]
  },
  {
    "original": "“You have been trifling with me,” he cried. “I am off to the Pyramids. Good-bye!” and he flew away. All day long he flew, and at night-time he arrived at the city. “Where shall I put up?” he said; “I hope the town has made preparations.” Then he saw the statue on the tall column. “I will put up there,” he cried; “it is a fine position, with plenty of fresh air.” So he alighted just between the feet of the Happy Prince.",
    "translation": "「君は私をからかってきたのだ」と彼は叫んだ。「私はピラミッドへ行く。さようなら！」そして彼は飛び去った。彼は一日中飛び続け、夜になると町に到着した。「どこに宿を取ろうか」と彼は言った。「町は準備をしてくれているといいのだが。」すると彼は高い柱の上の像を見た。「あそこに泊まろう」と彼は叫んだ。「すばらしい場所だ、新鮮な空気もたっぷりだ。」こうして彼は幸福の王子の足元のちょうど間に降り立った。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“You have been trifling with me,” he cried.",
        "translation": "「私をおもちゃにしていたのか」と彼は叫んだ。",
        "speech": "“You have been trifling with me,” he cried."
      },
      {
        "original": "“I am off to the Pyramids.",
        "translation": "「ピラミッドへ行くところだ。",
        "speech": "“I am off to the Pyramids."
      },
      {
        "original": "Good-bye!” and he flew away.",
        "translation": "さようなら！」そして彼は飛び去った。",
        "speech": "Good-bye!” and he flew away."
      },
      {
        "original": "All day long he flew,",
        "translation": "一日中ずっと飛び、",
        "speech": "All day long he flew,"
      },
      {
        "original": "and at night-time he arrived at the city.",
        "translation": "夜になると街に着いた。",
        "speech": "and at night-time he arrived at the city."
      },
      {
        "original": "“Where shall I put up?”",
        "translation": "「どこに泊まろうか？」",
        "speech": "“Where shall I put up?”"
      },
      {
        "original": "he said; “I hope the town has made preparations.”",
        "translation": "彼は言った。「街が準備をしてくれているといいのだが。」",
        "speech": "he said; “I hope the town has made preparations.”"
      },
      {
        "original": "Then he saw the statue on the tall column.",
        "translation": "すると彼は高い柱の上の像を見た。",
        "speech": "Then he saw the statue on the tall column."
      },
      {
        "original": "“I will put up there,” he cried;",
        "translation": "「あそこに泊まろう」と彼は叫んだ。",
        "speech": "“I will put up there,” he cried;"
      },
      {
        "original": "“it is a fine position, with plenty of fresh air.”",
        "translation": "「素晴らしい場所だ、新鮮な空気もたくさんある。」",
        "speech": "“it is a fine position, with plenty of fresh air.”"
      },
      {
        "original": "So he alighted just between the feet of the Happy Prince.",
        "translation": "こうして彼は幸福な王子の足の間にちょうど降り立った。",
        "speech": "So he alighted just between the feet of the Happy Prince."
      }
    ]
  },
  {
    "original": "“I have a golden bedroom,” he said softly to himself as he looked round, and he prepared to go to sleep; but just as he was putting his head under his wing a large drop of water fell on him. “What a curious thing!” he cried; “there is not a single cloud in the sky, the stars are quite clear and bright, and yet it is raining. The climate in the north of Europe is really dreadful. The Reed used to like the rain, but that was merely her selfishness.”",
    "translation": "「僕には黄金の寝室があるんだ」と彼はじっと見回しながらそっと自分に言い、眠る準備をした。しかし、ちょうど羽の下に頭を入れようとしたとき、大きな水滴が彼に落ちてきた。「なんて不思議なことだ！」と彼は叫んだ。「空には雲ひとつないのに、星はとても明るく澄んでいるのに、それでも雨が降っている。北ヨーロッパの気候は本当にひどいものだ。リードはかつて雨が好きだったが、それは単なる彼女のわがままだったのだ。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“I have a golden bedroom,”",
        "translation": "「僕には金色の寝室があるんだ」",
        "speech": "“I have a golden bedroom,”"
      },
      {
        "original": "he said softly to himself as he looked round,",
        "translation": "と彼はそっと自分自身に言った。",
        "speech": "he said softly to himself as he looked round,"
      },
      {
        "original": "and he prepared to go to sleep;",
        "translation": "そして彼は眠る準備をした。",
        "speech": "and he prepared to go to sleep;"
      },
      {
        "original": "but just as he was putting his head under his",
        "translation": "しかし、ちょうど頭を羽の下に入れようとしたとき、",
        "speech": "but just as he was putting his head under his"
      },
      {
        "original": "wing a large drop of water fell on him.",
        "translation": "大きな水滴が彼に落ちてきた。",
        "speech": "wing a large drop of water fell on him."
      },
      {
        "original": "“What a curious thing!”",
        "translation": "「なんて不思議なことだ！」",
        "speech": "“What a curious thing!”"
      },
      {
        "original": "he cried; “there is not a single cloud in the sky,",
        "translation": "彼は叫んだ。「空には一片の雲もないのに、",
        "speech": "he cried; “there is not a single cloud in the sky,"
      },
      {
        "original": "the stars are quite clear and bright, and yet it is raining.",
        "translation": "星はとても澄んで明るいのに、雨が降っている。",
        "speech": "the stars are quite clear and bright, and yet it is raining."
      },
      {
        "original": "The climate in the north of Europe is really dreadful.",
        "translation": "北ヨーロッパの気候は本当にひどいものだ。",
        "speech": "The climate in the north of Europe is really dreadful."
      },
      {
        "original": "The Reed used to like the rain,",
        "translation": "葦はかつて雨が好きだったけれど、",
        "speech": "The Reed used to like the rain,"
      },
      {
        "original": "but that was merely her selfishness.”",
        "translation": "それは単なる彼女のわがままだっただけだ。」",
        "speech": "but that was merely her selfishness.”"
      }
    ]
  },
  {
    "original": "Then another drop fell. “What is the use of a statue if it cannot keep the rain off?” he said; “I must look for a good chimney-pot,” and he determined to fly away. But before he had opened his wings, a third drop fell, and he looked up, and saw — Ah! what did he see? The eyes of the Happy Prince were filled with tears, and tears were running down his golden cheeks. His face was so beautiful in the moonlight that the little Swallow was filled with pity.",
    "translation": "するとまた一滴が落ちた。「雨を避けられない像に何の役に立つのだろう？」と彼は言った。「僕は良い煙突の先を探さなければ」と決心して飛び立とうとした。しかし、羽を広げる前に三滴目が落ち、見上げると、ああ！彼は何を見たのだろうか？幸福な王子の目は涙でいっぱいで、涙がその黄金の頬を流れ落ちていた。月明かりの中でその顔はとても美しく、小さなツバメは憐れみで胸がいっぱいになった。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Then another drop fell.",
        "translation": "するともう一滴落ちた。",
        "speech": "Then another drop fell."
      },
      {
        "original": "“What is the use of a statue",
        "translation": "「雨を防げない像に",
        "speech": "“What is the use of a statue"
      },
      {
        "original": "if it cannot keep the rain off?”",
        "translation": "何の役に立つというのだろう？」",
        "speech": "if it cannot keep the rain off?”"
      },
      {
        "original": "he said; “I must look for a good chimney-pot,”",
        "translation": "と彼は言った。「良い煙突を探さなくては、",
        "speech": "he said; “I must look for a good chimney-pot,”"
      },
      {
        "original": "and he determined to fly away.",
        "translation": "」そして彼は飛び立つことを決心した。",
        "speech": "and he determined to fly away."
      },
      {
        "original": "But before he had opened his wings,",
        "translation": "しかし、翼を広げる前に、",
        "speech": "But before he had opened his wings,"
      },
      {
        "original": "a third drop fell, and he looked up, and saw — Ah!",
        "translation": "三滴目が落ち、彼は見上げた。ああ！",
        "speech": "a third drop fell, and he looked up, and saw — Ah!"
      },
      {
        "original": "what did he see?",
        "translation": "彼は何を見たのか？",
        "speech": "what did he see?"
      },
      {
        "original": "The eyes of the Happy Prince were filled with tears,",
        "translation": "幸福の王子の目は涙であふれ、",
        "speech": "The eyes of the Happy Prince were filled with tears,"
      },
      {
        "original": "and tears were running down his golden cheeks.",
        "translation": "涙が彼の黄金の頬を伝って流れていた。",
        "speech": "and tears were running down his golden cheeks."
      },
      {
        "original": "His face was so beautiful in the moonlight",
        "translation": "月明かりの中で彼の顔はあまりに美しく、",
        "speech": "His face was so beautiful in the moonlight"
      },
      {
        "original": "that the little Swallow was filled with pity.",
        "translation": "小さなツバメは哀れみで胸がいっぱいになった。",
        "speech": "that the little Swallow was filled with pity."
      }
    ]
  },
  {
    "original": "“Who are you?” he said. “I am the Happy Prince.” “Why are you weeping then?” asked the Swallow; “you have quite drenched me.” “When I was alive and had a human heart,” answered the statue, “I did not know what tears were, for I lived in the Palace of Sans-Souci, where sorrow is not allowed to enter. In the daytime I played with my companions in the garden, and in the evening I led the dance in the Great Hall. Round the garden ran a very lofty wall, but I never cared to ask what lay beyond it, everything about me was so beautiful.",
    "translation": "「あなたは誰ですか？」と彼は言った。 「私は幸せな王子です。」 「では、なぜ泣いているのですか？」とツバメが尋ねた。「私をびしょ濡れにしてしまいましたよ。」 「私が生きていて人間の心を持っていたころは、涙が何かなど知らなかった」と像は答えた。「私はサンスーシ宮殿に住んでいて、そこには悲しみが入ることは許されていなかったのです。昼間は庭で仲間たちと遊び、夕方には大広間で舞踏会を指揮していました。庭の周りには非常に高い壁がありましたが、その向こうに何があるかを尋ねたいとは思わなかった、私の周りのすべてがあまりにも美しかったのです。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Who are you?”",
        "translation": "「あなたは誰ですか？」",
        "speech": "“Who are you?”"
      },
      {
        "original": "he said. “I am the Happy Prince.”",
        "translation": "彼は言った。「私は幸せな王子です。」",
        "speech": "he said. “I am the Happy Prince.”"
      },
      {
        "original": "“Why are you weeping then?”",
        "translation": "「では、なぜ泣いているのですか？」",
        "speech": "“Why are you weeping then?”"
      },
      {
        "original": "asked the Swallow; “you have quite drenched me.”",
        "translation": "ツバメが尋ねた。「私をずぶ濡れにしてしまいました。」",
        "speech": "asked the Swallow; “you have quite drenched me.”"
      },
      {
        "original": "“When I was alive and had a human heart,”",
        "translation": "「私が生きていて、人間の心を持っていたとき、」",
        "speech": "“When I was alive and had a human heart,”"
      },
      {
        "original": "answered the statue, “I did not know what tears were,",
        "translation": "像は答えた。「涙とは何かを知りませんでした、",
        "speech": "answered the statue, “I did not know what tears were,"
      },
      {
        "original": "for I lived in the Palace of Sans-Souci,",
        "translation": "なぜなら私はサン・スーシー宮殿に住んでいて、",
        "speech": "for I lived in the Palace of Sans-Souci,"
      },
      {
        "original": "where sorrow is not allowed to enter.",
        "translation": "そこでは悲しみが入ることを許されていなかったからです。",
        "speech": "where sorrow is not allowed to enter."
      },
      {
        "original": "In the daytime I played with my companions in the garden,",
        "translation": "昼間は庭で仲間たちと遊び、",
        "speech": "In the daytime I played with my companions in the garden,"
      },
      {
        "original": "and in the evening I led the dance in the Great Hall.",
        "translation": "夕方には大広間で舞踏会を率いました。",
        "speech": "and in the evening I led the dance in the Great Hall."
      },
      {
        "original": "Round the garden ran a very lofty wall,",
        "translation": "庭の周りには非常に高い壁がありましたが、",
        "speech": "Round the garden ran a very lofty wall,"
      },
      {
        "original": "but I never cared to ask what lay beyond it,",
        "translation": "その向こうに何があるか尋ねようとは思いませんでした、",
        "speech": "but I never cared to ask what lay beyond it,"
      },
      {
        "original": "everything about me was so beautiful.",
        "translation": "私の周りのすべてがあまりにも美しかったのです。」",
        "speech": "everything about me was so beautiful."
      }
    ]
  },
  {
    "original": "My courtiers called me the Happy Prince, and happy indeed I was, if pleasure be happiness. So I lived, and so I died. And now that I am dead they have set me up here so high that I can see all the ugliness and all the misery of my city, and though my heart is made of lead yet I cannot chose but weep.”",
    "translation": "私の廷臣たちは私を『幸福な王子』と呼び、もし喜びが幸福であるなら、私は確かに幸福でした。そうして私は生き、そうして私は死にました。そして今、私が死んだ後、彼らは私をこんなに高い所に置き、私の町のすべての醜さとすべての悲惨さを見ることができるようにしました。そして私の心は鉛でできているにもかかわらず、私は涙を禁じることができません。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "My courtiers called me the Happy Prince,",
        "translation": "私の廷臣たちは私を幸福な王子と呼びました、",
        "speech": "My courtiers called me the Happy Prince,"
      },
      {
        "original": "and happy indeed I was, if pleasure be happiness.",
        "translation": "そして、もし喜びが幸福なら、確かに私は幸福でした。",
        "speech": "and happy indeed I was, if pleasure be happiness."
      },
      {
        "original": "So I lived, and so I died.",
        "translation": "こうして私は生き、こうして私は死にました。",
        "speech": "So I lived, and so I died."
      },
      {
        "original": "And now that I am dead they have set me up here",
        "translation": "そして今、私が死んで、彼らは私をここに据えました",
        "speech": "And now that I am dead they have set me up here"
      },
      {
        "original": "so high that I can see all the ugliness",
        "translation": "とても高い場所に、そこから私はすべての醜さを見ることができます",
        "speech": "so high that I can see all the ugliness"
      },
      {
        "original": "and all the misery of my city,",
        "translation": "そして私の街のすべての悲惨さ、",
        "speech": "and all the misery of my city,"
      },
      {
        "original": "and though my heart is made of lead",
        "translation": "そして私の心が鉛でできていても",
        "speech": "and though my heart is made of lead"
      },
      {
        "original": "yet I cannot chose but weep.”",
        "translation": "それでも私は涙をこらえることができません。」",
        "speech": "yet I cannot chose but weep.”"
      }
    ]
  },
  {
    "original": "“What! is he not solid gold?” said the Swallow to himself. He was too polite to make any personal remarks out loud. “Far away,” continued the statue in a low musical voice, “far away in a little street there is a poor house. One of the windows is open, and through it I can see a woman seated at a table. Her face is thin and worn, and she has coarse, red hands, all pricked by the needle, for she is a seamstress. She is embroidering passion-flowers on a satin gown for the loveliest of the Queen’s maids-of-honour to wear at the next Court-ball.",
    "translation": "「なんだって！彼は本物の金じゃないのか？」とツバメは心の中で言いました。彼はあまりにも礼儀正しいので、口に出して個人的な感想を言うことはできませんでした。「はるか遠く」と、像は低く音楽的な声で続けました。「小さな通りの先に貧しい家があります。窓の一つが開いていて、そこから私は女性が机に座っているのを見ることができます。彼女の顔は痩せて疲れて見え、手は粗く赤く、針で刺された跡があり、彼女は仕立て屋です。彼女は次の宮廷舞踏会で女王の最も美しい侍女が着るためのサテンのドレスにパッションフラワーを刺繍しています。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“What! is he not solid gold?”",
        "translation": "「何だって！彼は金でできていないのか？」",
        "speech": "“What! is he not solid gold?”"
      },
      {
        "original": "said the Swallow to himself.",
        "translation": "とツバメは独りごちた。",
        "speech": "said the Swallow to himself."
      },
      {
        "original": "He was too polite to make any personal remarks out loud.",
        "translation": "彼はあまりにも礼儀正しかったので、声に出して個人的な批評をすることはなかった。",
        "speech": "He was too polite to make any personal remarks out loud."
      },
      {
        "original": "“Far away,” continued the statue in a low musical voice,",
        "translation": "「遠くに、」と像は低く音楽的な声で語り続けた、",
        "speech": "“Far away,” continued the statue in a low musical voice,"
      },
      {
        "original": "“far away in a little street there is a poor house.",
        "translation": "「遠くの小さな通りに貧しい家がある。",
        "speech": "“far away in a little street there is a poor house."
      },
      {
        "original": "One of the windows is open,",
        "translation": "一つの窓が開いており、",
        "speech": "One of the windows is open,"
      },
      {
        "original": "and through it I can see a woman seated at a table.",
        "translation": "その窓越しに、机に座る女性が見える。",
        "speech": "and through it I can see a woman seated at a table."
      },
      {
        "original": "Her face is thin and worn,",
        "translation": "彼女の顔はやせて疲れており、",
        "speech": "Her face is thin and worn,"
      },
      {
        "original": "and she has coarse, red hands,",
        "translation": "粗く赤い手をしていて、",
        "speech": "and she has coarse, red hands,"
      },
      {
        "original": "all pricked by the needle, for she is a seamstress.",
        "translation": "針で針跡だらけだ、なぜなら彼女は仕立て屋だからだ。",
        "speech": "all pricked by the needle, for she is a seamstress."
      },
      {
        "original": "She is embroidering passion-flowers on a satin gown",
        "translation": "彼女はサテンのドレスにパッションフラワーを刺繍している",
        "speech": "She is embroidering passion-flowers on a satin gown"
      },
      {
        "original": "for the loveliest of the Queen’s maids-of-honour",
        "translation": "王后付きの最も美しい侍女のために、",
        "speech": "for the loveliest of the Queen’s maids-of-honour"
      },
      {
        "original": "to wear at the next Court-ball.",
        "translation": "次の宮廷舞踏会で着るために。」",
        "speech": "to wear at the next Court-ball."
      }
    ]
  },
  {
    "original": "In a bed in the corner of the room her little boy is lying ill. He has a fever, and is asking for oranges. His mother has nothing to give him but river water, so he is crying. Swallow, Swallow, little Swallow, will you not bring her the ruby out of my sword-hilt? My feet are fastened to this pedestal and I cannot move.”",
    "translation": "部屋の隅のベッドで、彼女の小さな男の子が病気で横たわっています。彼は熱があり、オレンジを欲しがっています。母親は彼にあげるものが川の水しかないので、彼は泣いています。燕よ、燕よ、小さな燕よ、私の剣の柄からルビーを彼女に持ってきてはくれないか？私の足はこの台座に縛られていて、動けません。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "In a bed in the corner",
        "translation": "部屋の隅のベッドで",
        "speech": "In a bed in the corner"
      },
      {
        "original": "of the room her little boy is lying ill.",
        "translation": "彼女の小さな息子が病気で横たわっている。",
        "speech": "of the room her little boy is lying ill."
      },
      {
        "original": "He has a fever, and is asking for oranges.",
        "translation": "彼は熱があり、オレンジを求めている。",
        "speech": "He has a fever, and is asking for oranges."
      },
      {
        "original": "His mother has nothing to give him but river water,",
        "translation": "母親は川の水しか与えられず、",
        "speech": "His mother has nothing to give him but river water,"
      },
      {
        "original": "so he is crying.",
        "translation": "彼は泣いている。",
        "speech": "so he is crying."
      },
      {
        "original": "Swallow, Swallow, little Swallow,",
        "translation": "ツバメよ、ツバメよ、小さなツバメ、",
        "speech": "Swallow, Swallow, little Swallow,"
      },
      {
        "original": "will you not bring her the ruby out of my sword-hilt?",
        "translation": "私の剣の柄のルビーを彼女に持ってはくれないか？",
        "speech": "will you not bring her the ruby out of my sword-hilt?"
      },
      {
        "original": "My feet are fastened to this pedestal and I cannot move.”",
        "translation": "私の足はこの台座に縛られていて動けないのだ。”",
        "speech": "My feet are fastened to this pedestal and I cannot move.”"
      }
    ]
  },
  {
    "original": "“I am waited for in Egypt,” said the Swallow. “My friends are flying up and down the Nile, and talking to the large lotus-flowers. Soon they will go to sleep in the tomb of the great King. The King is there himself in his painted coffin. He is wrapped in yellow linen, and embalmed with spices. Round his neck is a chain of pale green jade, and his hands are like withered leaves.” “Swallow, Swallow, little Swallow,” said the Prince, “will you not stay with me for one night, and be my messenger? The boy is so thirsty, and the mother so sad.”",
    "translation": "「私はエジプトで待たれているの」とツバメは言った。「友達たちはナイル川の上や下を飛び回り、大きな蓮の花に話しかけているの。まもなく彼らは偉大な王の墓で眠ることになるでしょう。王は自分の彩色された棺の中にいるのです。黄色いリネンに包まれ、香料で防腐処理されています。首には淡い緑色の翡翠の鎖を巻き、手は枯れ葉のようです。」\n\n「ツバメ、ツバメ、ちいさなツバメ」と王子は言った。「一晩だけ私と一緒にいて、私の使者になってくれないか。少年はとてものどが渇いていて、母はとても悲しんでいるのです。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“I am waited for in Egypt,” said the Swallow.",
        "translation": "「エジプトで私を待っている人がいるの」とツバメは言いました。",
        "speech": "“I am waited for in Egypt,” said the Swallow."
      },
      {
        "original": "“My friends are flying up and down the Nile,",
        "translation": "「私の友達はナイル川の上下を飛び回って、",
        "speech": "“My friends are flying up and down the Nile,"
      },
      {
        "original": "and talking to the large lotus-flowers.",
        "translation": "大きな蓮の花と話しているのよ。",
        "speech": "and talking to the large lotus-flowers."
      },
      {
        "original": "Soon they will go to sleep in the tomb",
        "translation": "まもなく彼らは墓で眠ることになるでしょう」",
        "speech": "Soon they will go to sleep in the tomb"
      },
      {
        "original": "of the great King.",
        "translation": "偉大な王のもの。",
        "speech": "of the great King."
      },
      {
        "original": "The King is there himself in his painted coffin.",
        "translation": "王自身が彩色された棺の中にいる。",
        "speech": "The King is there himself in his painted coffin."
      },
      {
        "original": "He is wrapped in yellow linen, and embalmed with spices.",
        "translation": "彼は黄色いリネンに包まれ、香料で保存されている。",
        "speech": "He is wrapped in yellow linen, and embalmed with spices."
      },
      {
        "original": "Round his neck is a chain of pale green jade,",
        "translation": "彼の首には淡い緑色の翡翠の鎖が巻かれている、",
        "speech": "Round his neck is a chain of pale green jade,"
      },
      {
        "original": "and his hands are like withered leaves.”",
        "translation": "そして彼の手は枯れ葉のようだ。”",
        "speech": "and his hands are like withered leaves.”"
      },
      {
        "original": "“Swallow, Swallow, little Swallow,” said the Prince,",
        "translation": "“ツバメよ、ツバメよ、小さなツバメよ,” 王子は言った、",
        "speech": "“Swallow, Swallow, little Swallow,” said the Prince,"
      },
      {
        "original": "“will you not stay with me for one night,",
        "translation": "“一晩だけ私のそばにいてくれないか、",
        "speech": "“will you not stay with me for one night,"
      },
      {
        "original": "and be my messenger?",
        "translation": "そして私の使者になってくれないか？”",
        "speech": "and be my messenger?"
      },
      {
        "original": "The boy is so thirsty, and the mother so sad.”",
        "speech": "The boy is so thirsty, and the mother so sad.”",
        "translation": "その少年はとても喉が渇いていて、母親はとても悲しんでいる。”"
      }
    ]
  },
  {
    "original": "“I don’t think I like boys,” answered the Swallow. “Last summer, when I was staying on the river, there were two rude boys, the miller’s sons, who were always throwing stones at me. They never hit me, of course; we swallows fly far too well for that, and besides, I come of a family famous for its agility; but still, it was a mark of disrespect.” But the Happy Prince looked so sad that the little Swallow was sorry. “It is very cold here,” he said; “but I will stay with you for one night, and be your messenger.”",
    "translation": "「僕は男の子が好きだとは思わない」とツバメは答えました。「去年の夏、川に滞在していたとき、いつも石を投げてくる無作法な男の子が二人いたんだ。粉屋の息子でね。もちろん僕に当たることはなかったけど、僕たちツバメは飛ぶのが得意すぎるし、それに僕は敏捷さで有名な家系の出身だからね。でも、それでも無礼の印だったんだ。」しかし、幸福な王子はとても悲しそうに見えたので、小さなツバメは気の毒に思いました。「ここはとても寒い」と彼は言いました。「でも今夜一晩、君のところにいて、君の使い手になろう。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“I don’t think I like boys,” answered the Swallow.",
        "translation": "「僕、男の子ってあまり好きじゃないと思う」とツバメは答えた。",
        "speech": "“I don’t think I like boys,” answered the Swallow."
      },
      {
        "original": "“Last summer, when I was staying on the river,",
        "translation": "「去年の夏、川辺に滞在していたとき、",
        "speech": "“Last summer, when I was staying on the river,"
      },
      {
        "original": "there were two rude boys, the miller’s sons,",
        "translation": "無作法な男の子が二人、粉屋の息子たちがいて、",
        "speech": "there were two rude boys, the miller’s sons,"
      },
      {
        "original": "who were always throwing stones at me.",
        "translation": "いつも僕に石を投げてきたんだ。",
        "speech": "who were always throwing stones at me."
      },
      {
        "original": "They never hit me, of course;",
        "translation": "もちろん、当たったことはないけれど;",
        "speech": "They never hit me, of course;"
      },
      {
        "original": "we swallows fly far too well for that,",
        "translation": "僕たちツバメは飛ぶのがあまりにうまいからね、",
        "speech": "we swallows fly far too well for that,"
      },
      {
        "original": "and besides, I come of a family famous for its agility;",
        "translation": "それに、僕は敏捷さで有名な家系の出身だから;",
        "speech": "and besides, I come of a family famous for its agility;"
      },
      {
        "original": "but still, it was a mark of disrespect.”",
        "translation": "でも、それでも侮辱の印だった。」",
        "speech": "but still, it was a mark of disrespect.”"
      },
      {
        "original": "But the Happy Prince looked so sad",
        "translation": "しかし、幸福の王子はとても悲しそうに見えたので、",
        "speech": "But the Happy Prince looked so sad"
      },
      {
        "original": "that the little Swallow was sorry.",
        "translation": "小さなツバメは申し訳なく思った。",
        "speech": "that the little Swallow was sorry."
      },
      {
        "original": "“It is very cold here,” he said;",
        "translation": "「ここはとても寒いね」と彼は言った;",
        "speech": "“It is very cold here,” he said;"
      },
      {
        "original": "“but I will stay with you for one night,",
        "translation": "「でも、今夜だけ君と一緒にいて、",
        "speech": "“but I will stay with you for one night,"
      },
      {
        "original": "and be your messenger.”",
        "translation": "君の使者になろう。」",
        "speech": "and be your messenger.”"
      }
    ]
  },
  {
    "original": "“Thank you, little Swallow,” said the Prince. So the Swallow picked out the great ruby from the Prince’s sword, and flew away with it in his beak over the roofs of the town. He passed by the cathedral tower, where the white marble angels were sculptured. He passed by the palace and heard the sound of dancing. A beautiful girl came out on the balcony with her lover. “How wonderful the stars are,” he said to her, “and how wonderful is the power of love!”",
    "translation": "「ありがとう、小さなツバメ」と王子は言いました。そこでツバメは王子の剣から大きなルビーをくちばしでくわえ、町の屋根の上を飛び去って行きました。彼は白い大理石の天使が彫られた大聖堂の塔のそばを通り過ぎました。宮殿のそばを通り、そこで踊りの音を聞きました。美しい少女が恋人と一緒にバルコニーに現れました。「星はなんて素晴らしいのでしょう」と彼は彼女に言いました。「そして愛の力もなんて素晴らしいのでしょう！」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Thank you, little Swallow,” said the Prince.",
        "translation": "「ありがとう、小さなツバメさん」と王子は言いました。",
        "speech": "“Thank you, little Swallow,” said the Prince."
      },
      {
        "original": "So the Swallow picked out the great ruby from the Prince’s sword,",
        "translation": "それでツバメは王子の剣から大きなルビーを取り出し、",
        "speech": "So the Swallow picked out the great ruby from the Prince’s sword,"
      },
      {
        "original": "and flew away with it",
        "translation": "くちばしにくわえて飛び去りました",
        "speech": "and flew away with it"
      },
      {
        "original": "in his beak over the roofs of the town.",
        "translation": "町の屋根の上を越えて。",
        "speech": "in his beak over the roofs of the town."
      },
      {
        "original": "He passed by the cathedral tower,",
        "translation": "彼は大聖堂の塔を通り過ぎ、",
        "speech": "He passed by the cathedral tower,"
      },
      {
        "original": "where the white marble angels were sculptured.",
        "translation": "白い大理石の天使たちが彫られているのを見ました。",
        "speech": "where the white marble angels were sculptured."
      },
      {
        "original": "He passed by the palace and heard the sound of dancing.",
        "translation": "彼は宮殿のそばを通り過ぎ、踊りの音が聞こえてきました。",
        "speech": "He passed by the palace and heard the sound of dancing."
      },
      {
        "original": "A beautiful girl came out on the balcony with her lover.",
        "translation": "美しい少女が恋人と一緒にバルコニーに出てきました。",
        "speech": "A beautiful girl came out on the balcony with her lover."
      },
      {
        "original": "“How wonderful the stars are,” he said to her,",
        "translation": "「星はなんて素晴らしいのでしょう」と彼は彼女に言いました、",
        "speech": "“How wonderful the stars are,” he said to her,"
      },
      {
        "original": "“and how wonderful is the power of love!”",
        "translation": "「そして愛の力もなんて素晴らしいのでしょう！」",
        "speech": "“and how wonderful is the power of love!”"
      }
    ]
  },
  {
    "original": "“I hope my dress will be ready in time for the State-ball,” she answered; “I have ordered passion-flowers to be embroidered on it; but the seamstresses are so lazy.” He passed over the river, and saw the lanterns hanging to the masts of the ships. He passed over the Ghetto, and saw the old Jews bargaining with each other, and weighing out money in copper scales. At last he came to the poor house and looked in. The boy was tossing feverishly on his bed, and the mother had fallen asleep, she was so tired. In he hopped, and laid the great ruby on the table beside the woman’s thimble. Then he flew gently round the bed, fanning the boy’s forehead with his wings. “How cool I feel,” said the boy, “I must be getting better”; and he sank into a delicious slumber.",
    "translation": "「私のドレスが州の舞踏会に間に合うといいわ」と彼女は答えた。「そのドレスにはパッションフラワーを刺繍してもらうよう頼んだの。でも、仕立て屋たちはとても怠け者なの」彼は川を渡り、船のマストに下がる提灯を見た。彼はゲットーを通り過ぎ、年老いたユダヤ人たちが互いに交渉し、銅の秤でお金を量っているのを見た。ついに彼は貧民の家にたどり着き、のぞき込んだ。少年はベッドで熱にうなされながらもがき、母親はあまりに疲れて眠り込んでいた。彼は飛び込むと、ルビーの大きな石を女性の指ぬきのそばのテーブルに置いた。それから彼はやさしくベッドの周りを飛び回り、翼で少年の額を仰いだ。「なんて涼しいんだ」と少年は言った。「もうよくなってきたにちがいない」そして彼は心地よい眠りに沈んだ。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“I hope my dress will be ready in time for the State-ball,”",
        "speech": "“I hope my dress will be ready in time for the State-ball,”",
        "translation": "「州の舞踏会に間に合うように私のドレスができるといいのですが」"
      },
      {
        "original": "she answered; “I have ordered passion-flowers to be embroidered on it;",
        "speech": "she answered; “I have ordered passion-flowers to be embroidered on it;",
        "translation": "と彼女は答えました。「ドレスにはパッションフラワーを刺繍するように頼んだのですが、"
      },
      {
        "original": "but the seamstresses are so lazy.”",
        "speech": "but the seamstresses are so lazy.”",
        "translation": "仕立て屋たちはとても怠け者なんです。」"
      },
      {
        "original": "He passed over the river,",
        "speech": "He passed over the river,",
        "translation": "彼は川を渡り、"
      },
      {
        "original": "and saw the lanterns hanging to the masts of the ships.",
        "speech": "and saw the lanterns hanging to the masts of the ships.",
        "translation": "船のマストにぶら下がる提灯を見ました。"
      },
      {
        "original": "He passed over the Ghetto,",
        "speech": "He passed over the Ghetto,",
        "translation": "彼はゲットーを通り過ぎ、"
      },
      {
        "original": "and saw the old Jews bargaining with each other,",
        "speech": "and saw the old Jews bargaining with each other,",
        "translation": "年老いたユダヤ人たちが互いに交渉しているのを見、"
      },
      {
        "original": "and weighing out money in copper scales.",
        "speech": "and weighing out money in copper scales.",
        "translation": "銅の秤でお金を量っているのを見ました。"
      },
      {
        "original": "At last he came to the poor house and looked in.",
        "speech": "At last he came to the poor house and looked in.",
        "translation": "ついに彼は貧民院に着き、中を見ました。"
      },
      {
        "original": "The boy was tossing feverishly on his bed,",
        "speech": "The boy was tossing feverishly on his bed,",
        "translation": "少年はベッドの上で熱っぽく身をよじっていた、"
      },
      {
        "original": "and the mother had fallen asleep, she was so tired.",
        "speech": "and the mother had fallen asleep, she was so tired.",
        "translation": "そして母親はとても疲れて眠りに落ちてしまった。"
      },
      {
        "original": "In he hopped,",
        "speech": "In he hopped,",
        "translation": "彼は飛び込んできて、"
      },
      {
        "original": "and laid the great ruby on the table beside the woman’s thimble.",
        "speech": "and laid the great ruby on the table beside the woman’s thimble.",
        "translation": "大きなルビーを女性の指ぬきのそばのテーブルに置いた。"
      },
      {
        "original": "Then he flew gently round the bed,",
        "speech": "Then he flew gently round the bed,",
        "translation": "それから彼はそっとベッドの周りを飛び、"
      },
      {
        "original": "fanning the boy’s forehead with his wings.",
        "speech": "fanning the boy’s forehead with his wings.",
        "translation": "翼で少年の額を扇いだ。"
      },
      {
        "original": "“How cool I feel,” said the boy, “I must be getting better”;",
        "speech": "“How cool I feel,” said the boy, “I must be getting better”;",
        "translation": "「なんて涼しいんだ」と少年は言った。「よくなってきたに違いない」;"
      },
      {
        "original": "and he sank into a delicious slumber.",
        "speech": "and he sank into a delicious slumber.",
        "translation": "そして彼は心地よい眠りに落ちた。"
      }
    ]
  },
  {
    "original": "Then the Swallow flew back to the Happy Prince, and told him what he had done. “It is curious,” he remarked, “but I feel quite warm now, although it is so cold.” “That is because you have done a good action,” said the Prince. And the little Swallow began to think, and then he fell asleep. Thinking always made him sleepy. When day broke he flew down to the river and had a bath. “What a remarkable phenomenon,” said the Professor of Ornithology as he was passing over the bridge. “A swallow in winter!” And he wrote a long letter about it to the local newspaper. Every one quoted it, it was full of so many words that they could not understand.",
    "translation": "それからツバメは幸せな王子のもとに飛んで戻り、自分がしたことを彼に伝えました。「不思議だ」と彼は言いました。「とても寒いのに、今はとても温かく感じる。」 「それは善い行いをしたからだ」と王子は言いました。そして小さなツバメは考え始め、やがて眠ってしまいました。考えるといつも眠くなってしまうのです。日が明けると、彼は川に飛び降りて水浴びをしました。「なんて驚くべき現象だろう」と鳥類学の教授が橋を通りかかりながら言いました。「冬のツバメだ！」そして彼はそのことについて地元の新聞に長い手紙を書きました。皆それを引用しましたが、あまりに多くの言葉が書かれていたので理解できませんでした。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Then the Swallow flew back to the Happy Prince,",
        "translation": "それからツバメは幸せな王子のもとへ飛んで戻り、",
        "speech": "Then the Swallow flew back to the Happy Prince,"
      },
      {
        "original": "and told him what he had done.",
        "translation": "自分がしたことを王子に話しました。",
        "speech": "and told him what he had done."
      },
      {
        "original": "“It is curious,” he remarked,",
        "translation": "「不思議だね」と彼は言いました、",
        "speech": "“It is curious,” he remarked,"
      },
      {
        "original": "“but I feel quite warm now, although it is so cold.”",
        "translation": "「こんなに寒いのに、今はとても暖かく感じる。」",
        "speech": "“but I feel quite warm now, although it is so cold.”"
      },
      {
        "original": "“That is because you have done a good action,” said the Prince.",
        "translation": "「それは、あなたが善い行いをしたからです」と王子は言いました。",
        "speech": "“That is because you have done a good action,” said the Prince."
      },
      {
        "original": "And the little Swallow began to think, and then he fell asleep.",
        "translation": "そして小さなツバメは考え始め、それから眠りに落ちました。",
        "speech": "And the little Swallow began to think, and then he fell asleep."
      },
      {
        "original": "Thinking always made him sleepy.",
        "translation": "考えると、いつも眠くなるのです。",
        "speech": "Thinking always made him sleepy."
      },
      {
        "original": "When day broke he flew down to the river",
        "translation": "夜が明けると、彼は川へ飛んで行き、",
        "speech": "When day broke he flew down to the river"
      },
      {
        "original": "and had a bath.",
        "translation": "入浴しました。",
        "speech": "and had a bath."
      },
      {
        "original": "“What a remarkable phenomenon,”",
        "translation": "「なんて驚くべき現象だ」",
        "speech": "“What a remarkable phenomenon,”"
      },
      {
        "original": "said the Professor of Ornithology as he was passing over the bridge.",
        "translation": "と鳥類学の教授は橋を通りかかりながら言いました。",
        "speech": "said the Professor of Ornithology as he was passing over the bridge."
      },
      {
        "original": "“A swallow in winter!”",
        "translation": "「冬にツバメとは！」",
        "speech": "“A swallow in winter!”"
      },
      {
        "original": "And he wrote a long letter about it to the local newspaper.",
        "translation": "そして彼はそのことについて長い手紙を書き、地元の新聞に送ったのです。",
        "speech": "And he wrote a long letter about it to the local newspaper."
      },
      {
        "original": "Every one quoted it,",
        "translation": "皆それを引用しました、",
        "speech": "Every one quoted it,"
      },
      {
        "original": "it was full of so many words that they could not understand.",
        "translation": "あまりにも多くの分からない言葉でいっぱいでした。",
        "speech": "it was full of so many words that they could not understand."
      }
    ]
  },
  {
    "original": "“To-night I go to Egypt,” said the Swallow, and he was in high spirits at the prospect. He visited all the public monuments, and sat a long time on top of the church steeple. Wherever he went the Sparrows chirruped, and said to each other, “What a distinguished stranger!” so he enjoyed himself very much. When the moon rose he flew back to the Happy Prince. “Have you any commissions for Egypt?” he cried; “I am just starting.” “Swallow, Swallow, little Swallow,” said the Prince, “will you not stay with me one night longer?”",
    "translation": "「今夜、私はエジプトに行くのだ」とツバメは言い、先の見通しに胸を躍らせていた。彼はすべての公共の記念碑を訪れ、教会の尖塔の上に長い間座っていた。どこへ行ってもスズメたちはチュンチュン鳴き、「なんて立派なお客さんだ！」と互いに言い合ったので、彼はとても楽しんだ。月が昇ると、彼は幸福の王子のところへ飛び戻った。「エジプトへの使いはありますか？」と彼は叫んだ。「ちょうど出発するところです。」 「ツバメよ、ツバメよ、小さなツバメよ」と王子は言った。「もう一晩、私と一緒にいてはくれないか？」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“To-night I go to Egypt,” said the Swallow,",
        "translation": "「今夜、私はエジプトに行くのだ」とツバメは言った。",
        "speech": "“To-night I go to Egypt,” said the Swallow,"
      },
      {
        "original": "and he was in high spirits at the prospect.",
        "translation": "彼はその見込みに胸を躍らせていた。",
        "speech": "and he was in high spirits at the prospect."
      },
      {
        "original": "He visited all the public monuments,",
        "translation": "彼は全ての公共の記念碑を訪れ、",
        "speech": "He visited all the public monuments,"
      },
      {
        "original": "and sat a long time on top of the church steeple.",
        "translation": "教会の尖塔のてっぺんに長い間座っていた。",
        "speech": "and sat a long time on top of the church steeple."
      },
      {
        "original": "Wherever he went the Sparrows chirruped,",
        "translation": "彼が行くところではどこでもスズメたちがチュンチュン鳴き、",
        "speech": "Wherever he went the Sparrows chirruped,"
      },
      {
        "original": "and said to each other, “What a distinguished stranger!”",
        "translation": "互いに「なんて立派な客人だ！」と言った。",
        "speech": "and said to each other, “What a distinguished stranger!”"
      },
      {
        "original": "so he enjoyed himself very much.",
        "translation": "そのため彼はとても楽しんだ。",
        "speech": "so he enjoyed himself very much."
      },
      {
        "original": "When the moon rose he flew back to the Happy Prince.",
        "translation": "月が昇ると、彼は幸せな王子のもとへ戻った。",
        "speech": "When the moon rose he flew back to the Happy Prince."
      },
      {
        "original": "“Have you any commissions for Egypt?”",
        "translation": "「エジプトへの依頼はありますか？」",
        "speech": "“Have you any commissions for Egypt?”"
      },
      {
        "original": "he cried; “I am just starting.”",
        "translation": "と叫んだ。「まさに出発するところです。」",
        "speech": "he cried; “I am just starting.”"
      },
      {
        "original": "“Swallow, Swallow, little Swallow,” said the Prince,",
        "translation": "「ツバメよ、ツバメ、ちいさなツバメよ」と王子は言った、",
        "speech": "“Swallow, Swallow, little Swallow,” said the Prince,"
      },
      {
        "original": "“will you not stay with me one night longer?”",
        "translation": "「もう一晩、私と一緒にいてくれないか？」",
        "speech": "“will you not stay with me one night longer?”"
      }
    ]
  }
])
