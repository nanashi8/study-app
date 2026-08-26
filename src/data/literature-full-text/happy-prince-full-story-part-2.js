// 『幸福な王子』短編全文の後半。
const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  Object.values(value).forEach(deepFreeze)
  return Object.freeze(value)
}

export default deepFreeze([
  {
    "original": "“I am waited for in Egypt,” answered the Swallow. “To-morrow my friends will fly up to the Second Cataract. The river-horse couches there among the bulrushes, and on a great granite throne sits the God Memnon. All night long he watches the stars, and when the morning star shines he utters one cry of joy, and then he is silent. At noon the yellow lions come down to the water’s edge to drink. They have eyes like green beryls, and their roar is louder than the roar of the cataract.”",
    "translation": "「私はエジプトで待たれている」とツバメは答えた。「明日、私の友達は第二カタラクトまで飛ぶだろう。カバは葦の中で横たわり、偉大な花崗岩の玉座の上に神メムノンが座っている。一晩中、彼は星々を見守り、明けの明星が輝くとき、一声の喜びの叫びを上げ、それから沈黙する。正午には黄色いライオンたちが水辺に降りて水を飲む。彼らの目は緑色のベリルのようで、咆哮はカタラクトの轟きよりも大きい。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“I am waited for in Egypt,” answered the Swallow.",
        "translation": "「私はエジプトで待たれている」とツバメは答えた。",
        "speech": "“I am waited for in Egypt,” answered the Swallow."
      },
      {
        "original": "“To-morrow my friends will fly up to the Second Cataract.",
        "translation": "「明日、私の友達は第二のカタラクトまで飛ぶだろう。",
        "speech": "“To-morrow my friends will fly up to the Second Cataract."
      },
      {
        "original": "The river-horse couches there among the bulrushes,",
        "translation": "カバはヨシの間に身を伏せ、",
        "speech": "The river-horse couches there among the bulrushes,"
      },
      {
        "original": "and on a great granite throne sits the God Memnon.",
        "translation": "大きな花崗岩の玉座に神メムノンが座っている。",
        "speech": "and on a great granite throne sits the God Memnon."
      },
      {
        "original": "All night long he watches the stars,",
        "translation": "一晩中、彼は星を見守り、",
        "speech": "All night long he watches the stars,"
      },
      {
        "original": "and when the morning star shines he utters one cry of joy,",
        "translation": "明けの明星が輝くと一度喜びの叫びをあげ、",
        "speech": "and when the morning star shines he utters one cry of joy,"
      },
      {
        "original": "and then he is silent.",
        "translation": "そして静かになる。",
        "speech": "and then he is silent."
      },
      {
        "original": "At noon the yellow lions come down",
        "translation": "昼になると黄色いライオンたちが",
        "speech": "At noon the yellow lions come down"
      },
      {
        "original": "to the water’s edge to drink.",
        "translation": "水辺に降りて水を飲む。",
        "speech": "to the water’s edge to drink."
      },
      {
        "original": "They have eyes like green beryls,",
        "translation": "彼らの目は緑のベリルのようで、",
        "speech": "They have eyes like green beryls,"
      },
      {
        "original": "and their roar is louder than the roar of the cataract.”",
        "translation": "その吠え声はカタラクトの轟きよりも大きい。」",
        "speech": "and their roar is louder than the roar of the cataract.”"
      }
    ]
  },
  {
    "original": "“Swallow, Swallow, little Swallow,” said the Prince, “far away across the city I see a young man in a garret. He is leaning over a desk covered with papers, and in a tumbler by his side there is a bunch of withered violets. His hair is brown and crisp, and his lips are red as a pomegranate, and he has large and dreamy eyes. He is trying to finish a play for the Director of the Theatre, but he is too cold to write any more. There is no fire in the grate, and hunger has made him faint.”",
    "translation": "「ツバメ、ツバメ、小さなツバメ」と王子は言った。「街のはるか向こうに、屋根裏部屋にいる若者が見える。彼は書類で覆われた机に身をかがめており、横のグラスにはしおれたスミレの花束が入っている。髪は茶色で縮れており、唇はザクロのように赤く、大きく夢見るような目をしている。彼は劇場の監督のために芝居を書き上げようとしているが、あまりにも寒くてもう書けない。暖炉には火がなく、空腹で気を失いそうになっている。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Swallow, Swallow, little Swallow,” said the Prince,",
        "translation": "「ツバメ、ツバメ、ちいさなツバメ」と王子は言った、",
        "speech": "“Swallow, Swallow, little Swallow,” said the Prince,"
      },
      {
        "original": "“far away across the city I see a young man",
        "translation": "「遠く街を越えて、私は一人の若者を見ます",
        "speech": "“far away across the city I see a young man"
      },
      {
        "original": "in a garret.",
        "translation": "屋根裏部屋で。",
        "speech": "in a garret."
      },
      {
        "original": "He is leaning over a desk covered with papers,",
        "translation": "彼は書類でいっぱいの机にもたれかかり、",
        "speech": "He is leaning over a desk covered with papers,"
      },
      {
        "original": "and in a tumbler by his side there is a bunch",
        "translation": "隣のグラスには一束の",
        "speech": "and in a tumbler by his side there is a bunch"
      },
      {
        "original": "of withered violets.",
        "translation": "枯れたスミレが入っています。",
        "speech": "of withered violets."
      },
      {
        "original": "His hair is brown and crisp,",
        "translation": "髪は茶色で縮れており、",
        "speech": "His hair is brown and crisp,"
      },
      {
        "original": "and his lips are red as a pomegranate,",
        "translation": "唇はザクロのように赤く、",
        "speech": "and his lips are red as a pomegranate,"
      },
      {
        "original": "and he has large and dreamy eyes.",
        "translation": "大きく夢見るような目をしています。",
        "speech": "and he has large and dreamy eyes."
      },
      {
        "original": "He is trying to finish a play",
        "translation": "彼は劇場のディレクターのために",
        "speech": "He is trying to finish a play"
      },
      {
        "original": "for the Director of the Theatre,",
        "translation": "戯曲を書き終えようとしていますが、",
        "speech": "for the Director of the Theatre,"
      },
      {
        "original": "but he is too cold to write any more.",
        "translation": "あまりに寒くてもう書くことができません。",
        "speech": "but he is too cold to write any more."
      },
      {
        "original": "There is no fire in the grate,",
        "translation": "暖炉には火がなく、",
        "speech": "There is no fire in the grate,"
      },
      {
        "original": "and hunger has made him faint.”",
        "translation": "空腹で力を失っています。」",
        "speech": "and hunger has made him faint.”"
      }
    ]
  },
  {
    "original": "“I will wait with you one night longer,” said the Swallow, who really had a good heart. “Shall I take him another ruby?” “Alas! I have no ruby now,” said the Prince; “my eyes are all that I have left. They are made of rare sapphires, which were brought out of India a thousand years ago. Pluck out one of them and take it to him. He will sell it to the jeweller, and buy food and firewood, and finish his play.”",
    "translation": "「私はあなたともう一晩一緒にいますよ」と、本当に心の優しいツバメは言いました。「彼にもう一つルビーを持って行きましょうか？」「ああ！今はルビーを持っていません」と王子は言いました。「私に残っているのは目だけです。それはインドから千年前に持ち出された希少なサファイアでできています。そのうちの一つを抜き取って彼に持って行きなさい。彼はそれを宝石商に売って、食べ物や薪を買い、劇を完成させるでしょう。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“I will wait with you one night longer,”",
        "translation": "「もう一晩、君と一緒に待とう」",
        "speech": "“I will wait with you one night longer,”"
      },
      {
        "original": "said the Swallow, who really had a good heart.",
        "translation": "と、本当に心の優しいツバメが言いました。",
        "speech": "said the Swallow, who really had a good heart."
      },
      {
        "original": "“Shall I take him another ruby?”",
        "translation": "「彼にもう一つルビーを持っていこうか？」",
        "speech": "“Shall I take him another ruby?”"
      },
      {
        "original": "“Alas! I have no ruby now,” said the Prince;",
        "translation": "「ああ！今はルビーは持っていない」と王子は言いました。",
        "speech": "“Alas! I have no ruby now,” said the Prince;"
      },
      {
        "original": "“my eyes are all that I have left.",
        "translation": "「私に残っているのは目だけだ。",
        "speech": "“my eyes are all that I have left."
      },
      {
        "original": "They are made of rare sapphires,",
        "translation": "それらは珍しいサファイアでできている、",
        "speech": "They are made of rare sapphires,"
      },
      {
        "original": "which were brought out of India a thousand years ago.",
        "translation": "それは千年前にインドから運ばれたものだ。",
        "speech": "which were brought out of India a thousand years ago."
      },
      {
        "original": "Pluck out one of them and take it to him.",
        "translation": "そのうちの一つを摘み取って彼に持っていきなさい。",
        "speech": "Pluck out one of them and take it to him."
      },
      {
        "original": "He will sell it to the jeweller,",
        "translation": "彼はそれを宝石商に売り、",
        "speech": "He will sell it to the jeweller,"
      },
      {
        "original": "and buy food and firewood, and finish his play.”",
        "translation": "食べ物や薪を買い、劇を終えるだろう。」",
        "speech": "and buy food and firewood, and finish his play.”"
      }
    ]
  },
  {
    "original": "“Dear Prince,” said the Swallow, “I cannot do that”; and he began to weep. “Swallow, Swallow, little Swallow,” said the Prince, “do as I command you.” So the Swallow plucked out the Prince’s eye, and flew away to the student’s garret. It was easy enough to get in, as there was a hole in the roof. Through this he darted, and came into the room. The young man had his head buried in his hands, so he did not hear the flutter of the bird’s wings, and when he looked up he found the beautiful sapphire lying on the withered violets.",
    "translation": "「親愛なる王子さま」とツバメは言った。「私はそれはできません」そして彼は泣き始めた。「ツバメ、ツバメ、小さなツバメ」と王子は言った。「私の命じる通りにしなさい。」そこでツバメは王子の目をくちばしでついばみ、学生の屋根裏部屋へ飛んで行った。屋根に穴があったので、入るのは簡単だった。その穴を通って、彼は部屋に飛び込んだ。若者は頭を両手で覆っていたので、鳥の羽音に気づかず、顔を上げたとき、美しいサファイアがしおれたスミレの上に横たわっているのを見つけた。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Dear Prince,” said the Swallow, “I cannot do that”;",
        "translation": "「親愛なる王子様、」とツバメは言いました。「私はそれをすることができません」;",
        "speech": "“Dear Prince,” said the Swallow, “I cannot do that”;"
      },
      {
        "original": "and he began to weep.",
        "translation": "そして彼は泣き始めました。",
        "speech": "and he began to weep."
      },
      {
        "original": "“Swallow, Swallow, little Swallow,” said the Prince, “do as I command you.”",
        "translation": "「ツバメよ、ツバメよ、小さなツバメよ、」と王子は言いました。「私の命じる通りにしなさい。」",
        "speech": "“Swallow, Swallow, little Swallow,” said the Prince, “do as I command you.”"
      },
      {
        "original": "So the Swallow plucked out the Prince’s eye,",
        "translation": "こうしてツバメは王子の目をつつき出し、",
        "speech": "So the Swallow plucked out the Prince’s eye,"
      },
      {
        "original": "and flew away to the student’s garret.",
        "translation": "学生の屋根裏部屋へ飛んで行きました。",
        "speech": "and flew away to the student’s garret."
      },
      {
        "original": "It was easy enough to get in,",
        "translation": "入るのは十分簡単でした、",
        "speech": "It was easy enough to get in,"
      },
      {
        "original": "as there was a hole in the roof.",
        "translation": "屋根に穴があったので。",
        "speech": "as there was a hole in the roof."
      },
      {
        "original": "Through this he darted, and came into the room.",
        "translation": "その穴を通って、彼は部屋に飛び込んだ。",
        "speech": "Through this he darted, and came into the room."
      },
      {
        "original": "The young man had his head buried in his hands,",
        "translation": "若者は頭を手で覆っていたので、",
        "speech": "The young man had his head buried in his hands,"
      },
      {
        "original": "so he did not hear the flutter of the bird’s wings,",
        "translation": "鳥の羽のはためく音に気づかなかった、",
        "speech": "so he did not hear the flutter of the bird’s wings,"
      },
      {
        "original": "and when he looked up he found the beautiful sapphire lying",
        "translation": "そして見上げると、美しいサファイアが",
        "speech": "and when he looked up he found the beautiful sapphire lying"
      },
      {
        "original": "on the withered violets.",
        "speech": "on the withered violets.",
        "translation": "枯れたスミレの上に横たわっているのを見つけた。"
      }
    ]
  },
  {
    "original": "“I am beginning to be appreciated,” he cried; “this is from some great admirer. Now I can finish my play,” and he looked quite happy. The next day the Swallow flew down to the harbour. He sat on the mast of a large vessel and watched the sailors hauling big chests out of the hold with ropes. “Heave a-hoy!” they shouted as each chest came up. “I am going to Egypt”! cried the Swallow, but nobody minded, and when the moon rose he flew back to the Happy Prince.",
    "translation": "「私は認められ始めている」と彼は叫んだ。「これは何か偉大な崇拝者からのものだ。これで私は自分の劇を完成できる」と彼はとても幸せそうに見えた。翌日、ツバメは港へ飛んで行った。彼は大きな船のマストに座り、船員たちが大きな箱をロープで船倉から引き上げるのを見た。「ヘーヴ・アホイ！」と、箱が一つずつ上がるたびに叫んだ。「私はエジプトに行くぞ！」とツバメは叫んだが、誰も気にせず、月が昇ると彼は幸福な王子のところへ飛んで戻った。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“I am beginning to be appreciated,” he cried;",
        "translation": "「私は評価され始めている」と彼は叫んだ；",
        "speech": "“I am beginning to be appreciated,” he cried;"
      },
      {
        "original": "“this is from some great admirer.",
        "translation": "「これは何か偉大な崇拝者からのものだ。",
        "speech": "“this is from some great admirer."
      },
      {
        "original": "Now I can finish my play,” and he looked quite happy.",
        "translation": "これで私は自分の劇を完成させられる」と彼はとても幸せそうに見えた。",
        "speech": "Now I can finish my play,” and he looked quite happy."
      },
      {
        "original": "The next day the Swallow flew down to the harbour.",
        "translation": "翌日、ツバメは港に飛んだ。",
        "speech": "The next day the Swallow flew down to the harbour."
      },
      {
        "original": "He sat on the mast of a large vessel",
        "translation": "彼は大きな船のマストに座り",
        "speech": "He sat on the mast of a large vessel"
      },
      {
        "original": "and watched the sailors hauling big chests out",
        "translation": "船員たちが大きな箱を引き出すのを見ていた",
        "speech": "and watched the sailors hauling big chests out"
      },
      {
        "original": "of the hold with ropes.",
        "translation": "ロープで倉庫から引き上げる。",
        "speech": "of the hold with ropes."
      },
      {
        "original": "“Heave a-hoy!” they shouted as each chest came up.",
        "translation": "「ホーイ！」と叫びながら、箱が一つずつ引き上げられた。",
        "speech": "“Heave a-hoy!” they shouted as each chest came up."
      },
      {
        "original": "“I am going to Egypt”!",
        "translation": "「私はエジプトに行くのだ！」",
        "speech": "“I am going to Egypt”!"
      },
      {
        "original": "cried the Swallow, but nobody minded,",
        "translation": "ツバメが叫んだが、誰も気にしなかった。",
        "speech": "cried the Swallow, but nobody minded,"
      },
      {
        "original": "and when the moon rose he flew back to the Happy Prince.",
        "speech": "and when the moon rose he flew back to the Happy Prince.",
        "translation": "そして月が昇ると、彼は幸せな王子のもとへ戻って飛んでいった。"
      }
    ]
  },
  {
    "original": "“I am come to bid you good-bye,” he cried. “Swallow, Swallow, little Swallow,” said the Prince, “will you not stay with me one night longer?” “It is winter,” answered the Swallow, “and the chill snow will soon be here. In Egypt the sun is warm on the green palm-trees, and the crocodiles lie in the mud and look lazily about them. My companions are building a nest in the Temple of Baalbec, and the pink and white doves are watching them, and cooing to each other. Dear Prince, I must leave you, but I will never forget you, and next spring I will bring you back two beautiful jewels in place of those you have given away. The ruby shall be redder than a red rose, and the sapphire shall be as blue as the great sea.”",
    "translation": "「お別れを告げに来ました」と彼は叫んだ。「ツバメ、ツバメ、小さなツバメ」と王子は言った。「もう一晩だけ、私と一緒にいてはくれないか？」 「冬だから」とツバメは答えた。「まもなく冷たい雪が降るでしょう。エジプトでは緑のヤシの木に太陽が暖かく、ワニたちは泥の中で横たわり、のんびり周りを眺めています。私の仲間たちはバールベックの神殿で巣を作っていますし、ピンクや白の鳩たちはそれを見守りながら、互いにクークーと鳴いています。親愛なる王子、あなたのもとを離れなければなりませんが、決してあなたを忘れません。来年の春には、あなたがあげたものの代わりに、二つの美しい宝石をあなたに持ってきます。ルビーは赤いバラよりも赤く、サファイアは大海のように青いでしょう。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“I am come to bid you good-bye,” he cried.",
        "translation": "「別れを告げに来た」と彼は泣いた。",
        "speech": "“I am come to bid you good-bye,” he cried."
      },
      {
        "original": "“Swallow, Swallow, little Swallow,” said the Prince,",
        "translation": "「スワロー、スワロー、小さなスワロー」と王子は言った。",
        "speech": "“Swallow, Swallow, little Swallow,” said the Prince,"
      },
      {
        "original": "“will you not stay with me one night longer?”",
        "translation": "「もう一晩だけ一緒にいてくれないか?」",
        "speech": "“will you not stay with me one night longer?”"
      },
      {
        "original": "“It is winter,” answered the Swallow,",
        "translation": "「冬だ」とツバメは答えた。",
        "speech": "“It is winter,” answered the Swallow,"
      },
      {
        "original": "“and the chill snow will soon be here.",
        "translation": "\"そして冷たい雪がもうすぐ降りそうだ。",
        "speech": "“and the chill snow will soon be here."
      },
      {
        "original": "In Egypt the sun is warm on the green palm-trees,",
        "translation": "エジプトでは緑のヤシの木に暖かい太陽",
        "speech": "In Egypt the sun is warm on the green palm-trees,"
      },
      {
        "original": "and the crocodiles lie in the mud and look lazily about them.",
        "translation": "ワニたちは泥の中に横たわり、のんびりと周囲を見回している。",
        "speech": "and the crocodiles lie in the mud and look lazily about them."
      },
      {
        "original": "My companions are building a nest in the Temple of Baalbec,",
        "translation": "私の仲間たちはバールベック神殿に巣を作っています。",
        "speech": "My companions are building a nest in the Temple of Baalbec,"
      },
      {
        "original": "and the pink and white doves are watching them,",
        "translation": "ピンクと白のハトたちは彼らを見守り、",
        "speech": "and the pink and white doves are watching them,"
      },
      {
        "original": "and cooing to each other.",
        "translation": "お互いにクークーと鳴き",
        "speech": "and cooing to each other."
      },
      {
        "original": "Dear Prince, I must leave you,",
        "translation": "親愛なる王子様、私はあなたを去らなければなりません、",
        "speech": "Dear Prince, I must leave you,"
      },
      {
        "original": "but I will never forget you,",
        "translation": "でも決して忘れません、",
        "speech": "but I will never forget you,"
      },
      {
        "original": "and next spring I will bring you back two beautiful jewels",
        "translation": "そして来春、あなたに二つの美しい宝石をお持ち帰りします",
        "speech": "and next spring I will bring you back two beautiful jewels"
      },
      {
        "original": "in place of those you have given away.",
        "translation": "あなたが差し出した宝石の代わりに。",
        "speech": "in place of those you have given away."
      },
      {
        "original": "The ruby shall be redder than a red rose,",
        "translation": "ルビーは赤いバラよりも赤く、",
        "speech": "The ruby shall be redder than a red rose,"
      },
      {
        "original": "and the sapphire shall be as blue as the great sea.”",
        "translation": "サファイアは大海のように青い。」",
        "speech": "and the sapphire shall be as blue as the great sea.”"
      }
    ]
  },
  {
    "original": "“In the square below,” said the Happy Prince, “there stands a little match-girl. She has let her matches fall in the gutter, and they are all spoiled. Her father will beat her if she does not bring home some money, and she is crying. She has no shoes or stockings, and her little head is bare. Pluck out my other eye, and give it to her, and her father will not beat her.” “I will stay with you one night longer,” said the Swallow, “but I cannot pluck out your eye. You would be quite blind then.”",
    "translation": "「下の広場に」と幸福の王子は言いました。「小さなマッチ売りの少女が立っています。彼女はマッチを溝に落としてしまい、全部台無しになってしまいました。お金を家に持って帰らなければ父親に叩かれるでしょう、そして彼女は泣いています。靴も靴下もなく、彼女の小さな頭はむき出しです。私のもう一つの目を抜いて彼女にあげてください、そうすれば父親は彼女を叩きません。」 「私はもう一晩あなたのそばにいます」とツバメは言いました。「しかし、私はあなたの目を抜くことはできません。そのときあなたはまったく盲目になってしまいます。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“In the square below,” said the Happy Prince,",
        "translation": "「下の広場に」と幸福の王子は言いました、",
        "speech": "“In the square below,” said the Happy Prince,"
      },
      {
        "original": "“there stands a little match-girl.",
        "translation": "「小さなマッチ売りの女の子が立っています。",
        "speech": "“there stands a little match-girl."
      },
      {
        "original": "She has let her matches fall in the gutter,",
        "translation": "彼女はマッチを溝に落としてしまい、",
        "speech": "She has let her matches fall in the gutter,"
      },
      {
        "original": "and they are all spoiled.",
        "translation": "全部駄目になってしまいました。",
        "speech": "and they are all spoiled."
      },
      {
        "original": "Her father will beat her",
        "translation": "お金を家に持ち帰らなければ、父親に叩かれるでしょう、",
        "speech": "Her father will beat her"
      },
      {
        "original": "if she does not bring home some money, and she is crying.",
        "translation": "そして彼女は泣いています。",
        "speech": "if she does not bring home some money, and she is crying."
      },
      {
        "original": "She has no shoes or stockings, and her little head is bare.",
        "translation": "彼女は靴も靴下もなく、小さな頭は裸です。",
        "speech": "She has no shoes or stockings, and her little head is bare."
      },
      {
        "original": "Pluck out my other eye, and give it to her,",
        "translation": "私のもう一方の目を引き抜いて、彼女にあげなさい、",
        "speech": "Pluck out my other eye, and give it to her,"
      },
      {
        "original": "and her father will not beat her.”",
        "translation": "そうすれば父親は彼女を叩かないでしょう。」",
        "speech": "and her father will not beat her.”"
      },
      {
        "original": "“I will stay with you one night longer,”",
        "translation": "「もう一晩だけあなたと一緒にいます」",
        "speech": "“I will stay with you one night longer,”"
      },
      {
        "original": "said the Swallow, “but I cannot pluck out your eye.",
        "translation": "と燕は言いました、「でも私はあなたの目を引き抜くことはできません。",
        "speech": "said the Swallow, “but I cannot pluck out your eye."
      },
      {
        "original": "You would be quite blind then.”",
        "translation": "そうするとあなたは全く目が見えなくなってしまいます。」",
        "speech": "You would be quite blind then.”"
      }
    ]
  },
  {
    "original": "“Swallow, Swallow, little Swallow,” said the Prince, “do as I command you.” So he plucked out the Prince’s other eye, and darted down with it. He swooped past the match-girl, and slipped the jewel into the palm of her hand. “What a lovely bit of glass,” cried the little girl; and she ran home, laughing. Then the Swallow came back to the Prince. “You are blind now,” he said, “so I will stay with you always.” “No, little Swallow,” said the poor Prince, “you must go away to Egypt.”",
    "translation": "「ツバメよ、ツバメよ、小さなツバメよ」と王子は言った。「私の命じることをしなさい。」そこで彼は王子のもう一つの目を抜き取り、それを持って飛び下りた。彼はマッチ売りの少女のそばを通り過ぎ、宝石を彼女の手のひらに滑り込ませた。「なんて素敵なガラス片でしょう」と少女は叫び、笑いながら家に走って行った。それからツバメは王子のもとに戻ってきた。「あなたはもう盲目です」と言った。「だから私はいつもあなたと一緒にいます。」 「いいえ、小さなツバメよ」とかわいそうな王子は言った。「あなたはエジプトへ行かなくてはならない。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Swallow, Swallow, little Swallow,” said the Prince, “do as I command you.”",
        "translation": "「ツバメ、ツバメ、小さなツバメよ」と王子は言いました。「私の言う通りにしなさい。」",
        "speech": "“Swallow, Swallow, little Swallow,” said the Prince, “do as I command you.”"
      },
      {
        "original": "So he plucked out the Prince’s other eye,",
        "translation": "そこで彼は王子のもう一つの目を取り出し、",
        "speech": "So he plucked out the Prince’s other eye,"
      },
      {
        "original": "and darted down with it.",
        "translation": "それをくわえて飛び下りました。",
        "speech": "and darted down with it."
      },
      {
        "original": "He swooped past the match-girl,",
        "translation": "彼はマッチ売りの少女のそばをすり抜け、",
        "speech": "He swooped past the match-girl,"
      },
      {
        "original": "and slipped the jewel into the palm of her hand.",
        "translation": "宝石を彼女の手のひらにそっと置きました。",
        "speech": "and slipped the jewel into the palm of her hand."
      },
      {
        "original": "“What a lovely bit of glass,” cried the little girl;",
        "translation": "「なんて素敵なガラスのかけらでしょう」と少女は叫び、",
        "speech": "“What a lovely bit of glass,” cried the little girl;"
      },
      {
        "original": "and she ran home, laughing.",
        "translation": "笑いながら家へ駆け帰りました。",
        "speech": "and she ran home, laughing."
      },
      {
        "original": "Then the Swallow came back to the Prince.",
        "translation": "そしてツバメは王子のもとに戻ってきました。",
        "speech": "Then the Swallow came back to the Prince."
      },
      {
        "original": "“You are blind now,” he said,",
        "translation": "「あなたは今や盲目です」と彼は言いました、",
        "speech": "“You are blind now,” he said,"
      },
      {
        "original": "“so I will stay with you always.”",
        "translation": "「だから私はいつもあなたのそばにいます。」",
        "speech": "“so I will stay with you always.”"
      },
      {
        "original": "“No, little Swallow,” said the poor Prince,",
        "translation": "「いいえ、小さなツバメよ」と可哀想な王子は言いました、",
        "speech": "“No, little Swallow,” said the poor Prince,"
      },
      {
        "original": "“you must go away to Egypt.”",
        "translation": "「あなたはエジプトに行かなければなりません。」",
        "speech": "“you must go away to Egypt.”"
      }
    ]
  },
  {
    "original": "“I will stay with you always,” said the Swallow, and he slept at the Prince’s feet. All the next day he sat on the Prince’s shoulder, and told him stories of what he had seen in strange lands. He told him of the red ibises, who stand in long rows on the banks of the Nile, and catch gold-fish in their beaks; of the Sphinx, who is as old as the world itself, and lives in the desert, and knows everything; of the merchants, who walk slowly by the side of their camels, and carry amber beads in their hands;",
    "translation": "「私はいつもあなたと一緒にいるよ」とツバメは言い、王子の足元で眠りました。翌日、一日中彼は王子の肩に座り、見たことのある不思議な国々の話を王子に語りました。ナイル川の岸で長い列に並んで金魚をくちばしで捕まえる赤いイビスたちのこと、世界と同じほど古いスフィンクスのこと、砂漠に住み、すべてを知っているスフィンクスのこと、そしてラクダのそばをゆっくり歩きながら手に琥珀のビーズを持つ商人たちのことを話しました。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“I will stay with you always,” said the Swallow,",
        "translation": "「私はいつもあなたと一緒にいるわ」とツバメは言いました。",
        "speech": "“I will stay with you always,” said the Swallow,"
      },
      {
        "original": "and he slept at the Prince’s feet.",
        "translation": "そして彼は王子の足元で眠りました。",
        "speech": "and he slept at the Prince’s feet."
      },
      {
        "original": "All the next day he sat on the Prince’s shoulder,",
        "translation": "翌日、ずっと王子の肩に座り、",
        "speech": "All the next day he sat on the Prince’s shoulder,"
      },
      {
        "original": "and told him stories of what he had seen in strange lands.",
        "translation": "見たことのある不思議な国々の物語を王子に語りました。",
        "speech": "and told him stories of what he had seen in strange lands."
      },
      {
        "original": "He told him of the red ibises,",
        "translation": "彼は赤いトキのことを話しました、",
        "speech": "He told him of the red ibises,"
      },
      {
        "original": "who stand in long rows on the banks of the Nile,",
        "translation": "ナイル川の岸辺に長い列を作って立ち、",
        "speech": "who stand in long rows on the banks of the Nile,"
      },
      {
        "original": "and catch gold-fish in their beaks;",
        "translation": "くちばしで金魚を捕まえる鳥のことを;",
        "speech": "and catch gold-fish in their beaks;"
      },
      {
        "original": "of the Sphinx, who is as old as the world itself,",
        "translation": "世界と同じくらい古いスフィンクスのことを、",
        "speech": "of the Sphinx, who is as old as the world itself,"
      },
      {
        "original": "and lives in the desert, and knows everything;",
        "translation": "砂漠に住み、すべてを知っている姿について;",
        "speech": "and lives in the desert, and knows everything;"
      },
      {
        "original": "of the merchants, who walk slowly by the side of their camels,",
        "translation": "ラクダのそばをゆっくり歩く商人たちのことを、",
        "speech": "of the merchants, who walk slowly by the side of their camels,"
      },
      {
        "original": "and carry amber beads in their hands;",
        "translation": "手に琥珀のビーズを持って歩く人々のことを;",
        "speech": "and carry amber beads in their hands;"
      }
    ]
  },
  {
    "original": "of the King of the Mountains of the Moon, who is as black as ebony, and worships a large crystal; of the great green snake that sleeps in a palm-tree, and has twenty priests to feed it with honey-cakes; and of the pygmies who sail over a big lake on large flat leaves, and are always at war with the butterflies.",
    "translation": "月の山の王について、彼は黒檀のように黒く、大きなクリスタルを崇拝している；ヤシの木で眠る大きな緑の蛇について、そしてその蛇に蜂蜜ケーキを与えるための二十人の神官がいる；そして大きな平らな葉の上で大きな湖を渡る小人たちについて、彼らはいつも蝶と戦っている。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "of the King of the Mountains of the Moon,",
        "translation": "月の山の王について、",
        "speech": "of the King of the Mountains of the Moon,"
      },
      {
        "original": "who is as black as ebony, and worships a large crystal;",
        "translation": "彼は黒檀のように黒く、大きな水晶を崇拝している；",
        "speech": "who is as black as ebony, and worships a large crystal;"
      },
      {
        "original": "of the great green snake that sleeps in a palm-tree,",
        "translation": "ヤシの木に眠る大きな緑の蛇について、",
        "speech": "of the great green snake that sleeps in a palm-tree,"
      },
      {
        "original": "and has twenty priests to feed it with honey-cakes;",
        "translation": "そしてそれに蜂蜜ケーキを与えるために二十人の司祭がいる；",
        "speech": "and has twenty priests to feed it with honey-cakes;"
      },
      {
        "original": "and of the pygmies who sail over a big lake",
        "translation": "大きな湖を横切って航海する小人たちについて、",
        "speech": "and of the pygmies who sail over a big lake"
      },
      {
        "original": "on large flat leaves, and are always at war with the butterflies.",
        "translation": "大きな平らな葉の上で、常に蝶と戦っている。",
        "speech": "on large flat leaves, and are always at war with the butterflies."
      }
    ]
  },
  {
    "original": "“Dear little Swallow,” said the Prince, “you tell me of marvellous things, but more marvellous than anything is the suffering of men and of women. There is no Mystery so great as Misery. Fly over my city, little Swallow, and tell me what you see there.” So the Swallow flew over the great city, and saw the rich making merry in their beautiful houses, while the beggars were sitting at the gates. He flew into dark lanes, and saw the white faces of starving children looking out listlessly at the black streets. Under the archway of a bridge two little boys were lying in one another’s arms to try and keep themselves warm. “How hungry we are!” they said. “You must not lie here,” shouted the Watchman, and they wandered out into the rain.",
    "translation": "「親愛なる小さなツバメよ」と王子は言った。「君は私に驚くべきことを話してくれるが、何よりも驚くべきことは、人々の苦しみだ。これほど大きな神秘は、悲惨ほどではない。私の町の上を飛んでおくれ、小さなツバメよ、そしてそこに何が見えるか教えてくれ。」それでツバメは大きな町の上を飛び回り、裕福な人々が美しい家で楽しんでいるのを見た一方で、乞食たちが門のところに座っているのを見た。彼は暗い細い通りにも飛び入り、飢えた子供たちの白い顔が、無気力に黒い通りを見つめているのを見た。橋のアーチの下では、二人の小さな男の子が寄り添って体を温め合おうとしていた。「どれほどお腹がすいているか！」と彼らは言った。「ここに横たわってはいけない」と見張り人が叫び、彼らは雨の中へさまよい出た。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Dear little Swallow,” said the Prince,",
        "translation": "「親愛なる小さなツバメよ」と王子は言った、",
        "speech": "“Dear little Swallow,” said the Prince,"
      },
      {
        "original": "“you tell me of marvellous things,",
        "translation": "「君は私に不思議なことを話してくれる、",
        "speech": "“you tell me of marvellous things,"
      },
      {
        "original": "but more marvellous than anything is the suffering",
        "translation": "しかし、何よりも不思議なのは",
        "speech": "but more marvellous than anything is the suffering"
      },
      {
        "original": "of men and of women.",
        "translation": "男たちや女たちの苦しみだ。",
        "speech": "of men and of women."
      },
      {
        "original": "There is no Mystery so great as Misery.",
        "translation": "苦悩ほど大きな神秘はない。",
        "speech": "There is no Mystery so great as Misery."
      },
      {
        "original": "Fly over my city, little Swallow,",
        "translation": "小さなツバメよ、私の町の上空を飛んで、",
        "speech": "Fly over my city, little Swallow,"
      },
      {
        "original": "and tell me what you see there.”",
        "translation": "そこで見たものを教えておくれ。」",
        "speech": "and tell me what you see there.”"
      },
      {
        "original": "So the Swallow flew over the great city,",
        "translation": "こうしてツバメは大きな都市の上空を飛んだ、",
        "speech": "So the Swallow flew over the great city,"
      },
      {
        "original": "and saw the rich making merry in their beautiful houses,",
        "translation": "そして裕福な人々が美しい家で楽しんでいるのを見た、",
        "speech": "and saw the rich making merry in their beautiful houses,"
      },
      {
        "original": "while the beggars were sitting at the gates.",
        "translation": "一方で物乞いたちは門の前に座っていた。",
        "speech": "while the beggars were sitting at the gates."
      },
      {
        "original": "He flew into dark lanes,",
        "translation": "彼は暗い路地に飛び込み、",
        "speech": "He flew into dark lanes,"
      },
      {
        "original": "and saw the white faces",
        "translation": "飢えた子供たちの白い顔を見た",
        "speech": "and saw the white faces"
      },
      {
        "original": "of starving children looking out listlessly at the black streets.",
        "translation": "黒い街を無気力に見つめているのを。",
        "speech": "of starving children looking out listlessly at the black streets."
      },
      {
        "original": "Under the archway of a bridge two little boys were lying",
        "translation": "橋のアーチの下では二人の小さな少年が",
        "speech": "Under the archway of a bridge two little boys were lying"
      },
      {
        "original": "in one another’s arms to try and keep themselves warm.",
        "translation": "身を寄せ合って暖を取ろうとして横たわっていた。",
        "speech": "in one another’s arms to try and keep themselves warm."
      },
      {
        "original": "“How hungry we are!”",
        "translation": "「お腹がすいたね！」",
        "speech": "“How hungry we are!”"
      },
      {
        "original": "they said. “You must not lie here,”",
        "translation": "と彼らは言った。「ここに寝てはいけません」",
        "speech": "they said. “You must not lie here,”"
      },
      {
        "original": "shouted the Watchman, and they wandered out into the rain.",
        "translation": "と見張りが叫び、彼らは雨の中を歩き出した。",
        "speech": "shouted the Watchman, and they wandered out into the rain."
      }
    ]
  },
  {
    "original": "Then he flew back and told the Prince what he had seen. “I am covered with fine gold,” said the Prince, “you must take it off, leaf by leaf, and give it to my poor; the living always think that gold can make them happy.” Leaf after leaf of the fine gold the Swallow picked off, till the Happy Prince looked quite dull and grey. Leaf after leaf of the fine gold he brought to the poor, and the children’s faces grew rosier, and they laughed and played games in the street. “We have bread now!” they cried.",
    "translation": "それから彼は飛び戻り、王子に自分が見たことを話しました。「私は美しい金で覆われている」と王子は言いました。「それを一枚一枚取り除き、私の貧しい者たちに与えなさい。生きている人々はいつも金が彼らを幸せにすると考えている。」ツバメは金の葉を一枚一枚取り除き、ついには幸福な王子はすっかり鈍く灰色になりました。金の葉を一枚一枚貧しい者たちに届けると、子供たちの顔は赤みを増し、彼らは笑いながら通りで遊びました。「今、私たちにはパンがある！」と彼らは叫びました。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Then he flew back and told the Prince what he had seen.",
        "translation": "そして彼は飛び戻り、王子に自分が見たことを伝えました。",
        "speech": "Then he flew back and told the Prince what he had seen."
      },
      {
        "original": "“I am covered with fine gold,” said the Prince,",
        "translation": "「私は美しい金で覆われている」と王子は言いました。",
        "speech": "“I am covered with fine gold,” said the Prince,"
      },
      {
        "original": "“you must take it off, leaf by leaf,",
        "translation": "「それを一枚一枚はがして、",
        "speech": "“you must take it off, leaf by leaf,"
      },
      {
        "original": "and give it to my poor;",
        "translation": "貧しい人々に与えなさい。",
        "speech": "and give it to my poor;"
      },
      {
        "original": "the living always think that gold can make them happy.”",
        "translation": "生きている人々は常に、金が幸せをもたらすと思っているのです。」",
        "speech": "the living always think that gold can make them happy.”"
      },
      {
        "original": "Leaf after leaf of the fine gold the Swallow picked off,",
        "translation": "ツバメは美しい金を一枚一枚はがしました、",
        "speech": "Leaf after leaf of the fine gold the Swallow picked off,"
      },
      {
        "original": "till the Happy Prince looked quite dull and grey.",
        "translation": "すると幸福な王子はすっかり鈍く灰色に見えるようになりました。",
        "speech": "till the Happy Prince looked quite dull and grey."
      },
      {
        "original": "Leaf after leaf of the fine gold he brought to the poor,",
        "translation": "はがした金の一枚一枚を貧しい人々に持っていき、",
        "speech": "Leaf after leaf of the fine gold he brought to the poor,"
      },
      {
        "original": "and the children’s faces grew rosier,",
        "translation": "子どもたちの顔は赤くなり、",
        "speech": "and the children’s faces grew rosier,"
      },
      {
        "original": "and they laughed and played games in the street.",
        "translation": "彼らは笑い、通りで遊びました。",
        "speech": "and they laughed and played games in the street."
      },
      {
        "original": "“We have bread now!” they cried.",
        "translation": "「これでパンがある！」と彼らは叫びました。",
        "speech": "“We have bread now!” they cried."
      }
    ]
  },
  {
    "original": "Then the snow came, and after the snow came the frost. The streets looked as if they were made of silver, they were so bright and glistening; long icicles like crystal daggers hung down from the eaves of the houses, everybody went about in furs, and the little boys wore scarlet caps and skated on the ice. The poor little Swallow grew colder and colder, but he would not leave the Prince, he loved him too well. He picked up crumbs outside the baker’s door when the baker was not looking and tried to keep himself warm by flapping his wings.",
    "translation": "それから雪が降り、その雪の後に霜がやってきました。通りはまるで銀でできているかのように輝き、きらきらと光っていました；長い氷柱が家々の軒先からクリスタルの短剣のように垂れ下がり、みんな毛皮を身にまとい、小さな男の子たちは赤い帽子をかぶって氷の上でスケートをしていました。かわいそうな小さな燕はどんどん寒くなりましたが、王子を離れようとはせず、彼のことをとても愛していました。燕は、パン屋が見ていない間にパン屋の扉の外でパンくずを拾い、翼を羽ばたかせて体を温めようとしました。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "Then the snow came, and after the snow came the frost.",
        "translation": "それから雪が降り、その雪の後に霜がやってきました。",
        "speech": "Then the snow came, and after the snow came the frost."
      },
      {
        "original": "The streets looked as if they were made of silver,",
        "translation": "通りは銀でできているかのように見え、",
        "speech": "The streets looked as if they were made of silver,"
      },
      {
        "original": "they were so bright and glistening;",
        "translation": "とても明るくきらきらと輝いていました。",
        "speech": "they were so bright and glistening;"
      },
      {
        "original": "long icicles like crystal daggers hung down",
        "translation": "長い氷柱が水晶の短剣のように垂れ下がり、",
        "speech": "long icicles like crystal daggers hung down"
      },
      {
        "original": "from the eaves of the houses,",
        "translation": "家の軒先からぶら下がっていました。",
        "speech": "from the eaves of the houses,"
      },
      {
        "original": "everybody went about in furs,",
        "translation": "皆は毛皮をまとい、",
        "speech": "everybody went about in furs,"
      },
      {
        "original": "and the little boys wore scarlet caps and skated on the ice.",
        "translation": "小さな男の子たちは赤い帽子をかぶり、氷の上でスケートをしていました。",
        "speech": "and the little boys wore scarlet caps and skated on the ice."
      },
      {
        "original": "The poor little Swallow grew colder and colder,",
        "translation": "かわいそうな小さなつばめはますます寒くなっていきました、",
        "speech": "The poor little Swallow grew colder and colder,"
      },
      {
        "original": "but he would not leave the Prince, he loved him too well.",
        "translation": "しかし彼は王子を離れようとはしませんでした、彼は王子をあまりにも愛していたのです。",
        "speech": "but he would not leave the Prince, he loved him too well."
      },
      {
        "original": "He picked up crumbs outside the baker’s door",
        "translation": "パン屋の扉の外で、パン屋が見ていない間にパンくずを拾い、",
        "speech": "He picked up crumbs outside the baker’s door"
      },
      {
        "original": "when the baker was not looking and tried",
        "translation": "そして、",
        "speech": "when the baker was not looking and tried"
      },
      {
        "original": "to keep himself warm by flapping his wings.",
        "translation": "翼をはばたかせて自分を温めようとしました。",
        "speech": "to keep himself warm by flapping his wings."
      }
    ]
  },
  {
    "original": "But at last he knew that he was going to die. He had just strength to fly up to the Prince’s shoulder once more. “Good-bye, dear Prince!” he murmured, “will you let me kiss your hand?” “I am glad that you are going to Egypt at last, little Swallow,” said the Prince, “you have stayed too long here; but you must kiss me on the lips, for I love you.” “It is not to Egypt that I am going,” said the Swallow. “I am going to the House of Death. Death is the brother of Sleep, is he not?”",
    "translation": "しかしついに彼は自分が死ぬのだと知った。彼はかろうじてもう一度王子の肩に飛び上がる力を持っていた。「さようなら、親愛なる王子様！」と彼はつぶやいた。「私の手にキスさせてくれますか？」「やっとエジプトに行くことになってうれしいよ、小さなツバメ」と王子は言った。「君はここに長く留まりすぎた。しかし、私を愛しているのだから、唇にキスしなければならない。」「私が向かうのはエジプトではありません」とツバメは言った。「私が行くのは死の家です。死は眠りの兄弟でしょう？」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "But at last he knew that he was going to die.",
        "translation": "しかしついに、彼は自分が死ぬことを知った。",
        "speech": "But at last he knew that he was going to die."
      },
      {
        "original": "He had just strength to fly up",
        "translation": "彼はかろうじて飛び上がる力があった",
        "speech": "He had just strength to fly up"
      },
      {
        "original": "to the Prince’s shoulder once more.",
        "translation": "もう一度、王子の肩まで。",
        "speech": "to the Prince’s shoulder once more."
      },
      {
        "original": "“Good-bye, dear Prince!”",
        "translation": "「さようなら、親愛なる王子！」",
        "speech": "“Good-bye, dear Prince!”"
      },
      {
        "original": "he murmured, “will you let me kiss your hand?”",
        "translation": "と彼はつぶやき、 「私の手にキスさせてくれますか？」",
        "speech": "he murmured, “will you let me kiss your hand?”"
      },
      {
        "original": "“I am glad that you are going to Egypt at last,",
        "translation": "「やっとエジプトに行けるのがうれしいよ、",
        "speech": "“I am glad that you are going to Egypt at last,"
      },
      {
        "original": "little Swallow,” said the Prince, “you have stayed too long here;",
        "translation": "小さなツバメ」と王子は言った。「君はここに長く留まりすぎたね;",
        "speech": "little Swallow,” said the Prince, “you have stayed too long here;"
      },
      {
        "original": "but you must kiss me on the lips, for I love you.”",
        "translation": "でも僕のことが好きだから、唇にキスしてくれなければならない」",
        "speech": "but you must kiss me on the lips, for I love you.”"
      },
      {
        "original": "“It is not to Egypt that I am going,” said the Swallow.",
        "translation": "「私が行くのはエジプトではありません」とツバメは言った。",
        "speech": "“It is not to Egypt that I am going,” said the Swallow."
      },
      {
        "original": "“I am going to the House of Death.",
        "translation": "「私は死の家に行くのです。",
        "speech": "“I am going to the House of Death."
      },
      {
        "original": "Death is the brother of Sleep, is he not?”",
        "translation": "死は眠りの兄弟ですよね？」",
        "speech": "Death is the brother of Sleep, is he not?”"
      }
    ]
  },
  {
    "original": "And he kissed the Happy Prince on the lips, and fell down dead at his feet. At that moment a curious crack sounded inside the statue, as if something had broken. The fact is that the leaden heart had snapped right in two. It certainly was a dreadfully hard frost. Early the next morning the Mayor was walking in the square below in company with the Town Councillors. As they passed the column he looked up at the statue: “Dear me! how shabby the Happy Prince looks!” he said.",
    "translation": "そして彼は幸福な王子の唇にキスをし、その足元で倒れて死んでしまった。その瞬間、像の中で奇妙なひび割れの音が聞こえた、まるで何かが壊れたかのように。実は鉛の心臓が真っ二つに折れてしまったのだ。本当にひどく厳しい霜だった。翌朝早く、町長は町会議員たちと一緒に広場を歩いていた。彼らが柱を通り過ぎるとき、彼は像を見上げて言った。「まあ！幸福な王子は何とみすぼらしく見えるのだ！」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "And he kissed the Happy Prince on the lips,",
        "translation": "そして彼は幸せな王子の唇にキスをし、",
        "speech": "And he kissed the Happy Prince on the lips,"
      },
      {
        "original": "and fell down dead at his feet.",
        "translation": "その足元で倒れて死んでしまいました。",
        "speech": "and fell down dead at his feet."
      },
      {
        "original": "At that moment a curious crack sounded inside the statue,",
        "translation": "その瞬間、像の中で奇妙なパキッという音がしました、",
        "speech": "At that moment a curious crack sounded inside the statue,"
      },
      {
        "original": "as if something had broken.",
        "translation": "まるで何かが壊れたかのように。",
        "speech": "as if something had broken."
      },
      {
        "original": "The fact is that the leaden heart had snapped right in two.",
        "translation": "実は、鉛でできた心臓が真っ二つに割れてしまったのです。",
        "speech": "The fact is that the leaden heart had snapped right in two."
      },
      {
        "original": "It certainly was a dreadfully hard frost.",
        "translation": "確かにそれは恐ろしく厳しい霜でした。",
        "speech": "It certainly was a dreadfully hard frost."
      },
      {
        "original": "Early the next morning the Mayor was walking",
        "translation": "翌朝早く、市長は",
        "speech": "Early the next morning the Mayor was walking"
      },
      {
        "original": "in the square below in company with the Town Councillors.",
        "translation": "町議会議員とともに広場を歩いていました。",
        "speech": "in the square below in company with the Town Councillors."
      },
      {
        "original": "As they passed the column he looked up at the statue:",
        "translation": "彼らが柱を通り過ぎると、像を見上げて:",
        "speech": "As they passed the column he looked up at the statue:"
      },
      {
        "original": "“Dear me! how shabby the Happy Prince looks!” he said.",
        "translation": "「まあ！ 幸せな王子はなんてみすぼらしい姿だ！」と彼は言いました。",
        "speech": "“Dear me! how shabby the Happy Prince looks!” he said."
      }
    ]
  },
  {
    "original": "“How shabby indeed!” cried the Town Councillors, who always agreed with the Mayor; and they went up to look at it. “The ruby has fallen out of his sword, his eyes are gone, and he is golden no longer,” said the Mayor in fact, “he is little better than a beggar!” “Little better than a beggar,” said the Town Councillors. “And here is actually a dead bird at his feet!” continued the Mayor. “We must really issue a proclamation that birds are not to be allowed to die here.” And the Town Clerk made a note of the suggestion.",
    "translation": "「なんてみすぼらしいことだ！」と、市長にいつも同意する市議たちは叫び、見に行った。事実、市長は言った。「彼の剣からルビーは落ち、目も失われ、もはや黄金の姿ではない。彼はほとんど乞食同然だ！」 「ほとんど乞食同然だ」と市議たちも言った。 「そして実際に彼の足元には死んだ鳥がいる！」と市長は続けた。 「ここで鳥が死ぬのを許さないという布告を本当に出さなければならない。」 そして市書記官はその提案を記録した。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“How shabby indeed!”",
        "translation": "「なんてみすぼらしいのでしょう！」",
        "speech": "“How shabby indeed!”"
      },
      {
        "original": "cried the Town Councillors, who always agreed with the Mayor;",
        "translation": "町会議員たちは叫びました。町会議員たちはいつも市長に同意していました；",
        "speech": "cried the Town Councillors, who always agreed with the Mayor;"
      },
      {
        "original": "and they went up to look at it.",
        "translation": "そして彼らはそれを見に行きました。",
        "speech": "and they went up to look at it."
      },
      {
        "original": "“The ruby has fallen out of his sword,",
        "translation": "「彼の剣からルビーが落ち、",
        "speech": "“The ruby has fallen out of his sword,"
      },
      {
        "original": "his eyes are gone, and he is golden no longer,”",
        "translation": "彼の目はなくなり、もう黄金ではない」",
        "speech": "his eyes are gone, and he is golden no longer,”"
      },
      {
        "original": "said the Mayor in fact, “he is little better than a beggar!”",
        "translation": "と市長は実際に言いました。「彼は乞食と大差ありません！」",
        "speech": "said the Mayor in fact, “he is little better than a beggar!”"
      },
      {
        "original": "“Little better than a beggar,” said the Town Councillors.",
        "translation": "「乞食と大差ない」と、町会議員たちは言いました。",
        "speech": "“Little better than a beggar,” said the Town Councillors."
      },
      {
        "original": "“And here is actually a dead bird at his feet!”",
        "translation": "「そして実際に彼の足元には死んだ鳥がいます！」",
        "speech": "“And here is actually a dead bird at his feet!”"
      },
      {
        "original": "continued the Mayor.",
        "translation": "と市長は続けました。",
        "speech": "continued the Mayor."
      },
      {
        "original": "“We must really issue a proclamation",
        "translation": "「ここで鳥が死なないように",
        "speech": "“We must really issue a proclamation"
      },
      {
        "original": "that birds are not to be allowed to die here.”",
        "translation": "布告を出さなければなりません。」",
        "speech": "that birds are not to be allowed to die here.”"
      },
      {
        "original": "And the Town Clerk made a note of the suggestion.",
        "translation": "そして町書記官はその提案を記録しました。",
        "speech": "And the Town Clerk made a note of the suggestion."
      }
    ]
  },
  {
    "original": "So they pulled down the statue of the Happy Prince. “As he is no longer beautiful he is no longer useful,” said the Art Professor at the University. Then they melted the statue in a furnace, and the Mayor held a meeting of the Corporation to decide what was to be done with the metal. “We must have another statue, of course,” he said, “and it shall be a statue of myself.” “Of myself,” said each of the Town Councillors, and they quarrelled. When I last heard of them they were quarrelling still.",
    "translation": "それで彼らはハッピー・プリンスの像を取り壊しました。「彼はもはや美しくないので、もはや役に立たない」と大学の美術教授は言いました。それから彼らは像を炉で溶かし、市長は金属をどうするかを決めるために会社の会議を開きました。「もちろん、別の像が必要だ」と市長は言い、「それは私自身の像にする」と言いました。「私自身の像に」と町議会議員たちも言い、彼らは口論しました。私が彼らのことを最後に聞いたとき、彼らはまだ口論していました。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "So they pulled down the statue of the Happy Prince.",
        "translation": "それで彼らはハッピー・プリンスの像を取り壊した。",
        "speech": "So they pulled down the statue of the Happy Prince."
      },
      {
        "original": "“As he is no longer beautiful he is no longer useful,”",
        "translation": "「美しくなくなったのだから、もはや役に立たない」",
        "speech": "“As he is no longer beautiful he is no longer useful,”"
      },
      {
        "original": "said the Art Professor at the University.",
        "translation": "と大学の美術教授は言った。",
        "speech": "said the Art Professor at the University."
      },
      {
        "original": "Then they melted the statue in a furnace,",
        "translation": "それから彼らは像を溶鉱炉で溶かし、",
        "speech": "Then they melted the statue in a furnace,"
      },
      {
        "original": "and the Mayor held a meeting of the Corporation",
        "translation": "市長は金属をどうするかを決めるために",
        "speech": "and the Mayor held a meeting of the Corporation"
      },
      {
        "original": "to decide what was to be done with the metal.",
        "translation": "市議会の会議を開いた。",
        "speech": "to decide what was to be done with the metal."
      },
      {
        "original": "“We must have another statue, of course,”",
        "translation": "「もちろん、別の像が必要だ」と",
        "speech": "“We must have another statue, of course,”"
      },
      {
        "original": "he said, “and it shall be a statue of myself.”",
        "translation": "彼は言った。「そしてそれは私自身の像になるだろう。」",
        "speech": "he said, “and it shall be a statue of myself.”"
      },
      {
        "original": "“Of myself,” said each of the Town Councillors, and they quarrelled.",
        "translation": "「私自身の」町議会員一人ひとりが言い、彼らは口論した。",
        "speech": "“Of myself,” said each of the Town Councillors, and they quarrelled."
      },
      {
        "original": "When I last heard of them they were quarrelling still.",
        "translation": "私が最後に彼らのことを聞いたとき、彼らはまだ口論していた。",
        "speech": "When I last heard of them they were quarrelling still."
      }
    ]
  },
  {
    "original": "“What a strange thing!” said the overseer of the workmen at the foundry. “This broken lead heart will not melt in the furnace. We must throw it away.” So they threw it on a dust-heap where the dead Swallow was also lying. “Bring me the two most precious things in the city,” said God to one of His Angels; and the Angel brought Him the leaden heart and the dead bird. “You have rightly chosen,” said God, “for in my garden of Paradise this little bird shall sing for evermore, and in my city of gold the Happy Prince shall praise me.”",
    "translation": "「なんて奇妙なことだ！」と、鋳物工場の職人たちの監督者は言った。「この壊れた鉛の心臓は炉で溶けない。捨てなければならない。」 そこで、それを死んだツバメが横たわっているゴミの山に投げ捨てた。「私の街で最も貴重なものふたつを持ってきなさい」と神は一人の天使に言った。天使は神に鉛の心臓と死んだ鳥を持って行った。「よく選んだ」と神は言った。「私の楽園の庭では、この小さな鳥が永遠に歌い、私の黄金の街では、幸福な王子が私を讃えるだろう。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“What a strange thing!”",
        "translation": "「なんて不思議なことだ！」",
        "speech": "“What a strange thing!”"
      },
      {
        "original": "said the overseer of the workmen at the foundry.",
        "translation": "と鋳物工場の作業監督が言った。",
        "speech": "said the overseer of the workmen at the foundry."
      },
      {
        "original": "“This broken lead heart will not melt in the furnace.",
        "translation": "「この壊れた鉛の心臓は炉で溶けない。",
        "speech": "“This broken lead heart will not melt in the furnace."
      },
      {
        "original": "We must throw it away.”",
        "translation": "捨てなければならない。」",
        "speech": "We must throw it away.”"
      },
      {
        "original": "So they threw it on a dust-heap",
        "translation": "そこで彼らはそれをゴミの山に投げ捨てた",
        "speech": "So they threw it on a dust-heap"
      },
      {
        "original": "where the dead Swallow was also lying.",
        "translation": "そこには死んだ燕も横たわっていた。",
        "speech": "where the dead Swallow was also lying."
      },
      {
        "original": "“Bring me the two most precious things in the city,”",
        "translation": "「私の街で最も貴重な二つのものを持って来なさい」",
        "speech": "“Bring me the two most precious things in the city,”"
      },
      {
        "original": "said God to one of His Angels;",
        "translation": "と神は一人の天使に言った;",
        "speech": "said God to one of His Angels;"
      },
      {
        "original": "and the Angel brought Him the leaden heart and the dead bird.",
        "translation": "そして天使は神に鉛の心と死んだ鳥を持ってきた。",
        "speech": "and the Angel brought Him the leaden heart and the dead bird."
      },
      {
        "original": "“You have rightly chosen,” said God,",
        "translation": "「よく選んだ」と神は言った、",
        "speech": "“You have rightly chosen,” said God,"
      },
      {
        "original": "“for in my garden of Paradise this little bird shall sing",
        "translation": "「私の楽園の庭でこの小さな鳥は永遠に歌うだろう、",
        "speech": "“for in my garden of Paradise this little bird shall sing"
      },
      {
        "original": "for evermore, and in my city",
        "translation": "そして私の黄金の都市で",
        "speech": "for evermore, and in my city"
      },
      {
        "original": "of gold the Happy Prince shall praise me.”",
        "translation": "幸福の王子は私を讃えるだろう。」",
        "speech": "of gold the Happy Prince shall praise me.”"
      }
    ]
  }
])
