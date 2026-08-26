// Project Gutenbergの原文を、章・短編の完結単位で収録する。
const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  Object.values(value).forEach(deepFreeze)
  return Object.freeze(value)
}

const scenes = [
  {
    "original": "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?” So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.",
    "translation": "アリスは川の土手で姉のそばに座っていることにだんだん飽きてきて、何もすることがないことに疲れてきていた。彼女は一度か二度、姉が読んでいる本をのぞき見してみたことがあったが、その本には絵も会話も載っていなかった。「絵も会話もない本なんて、何の役に立つの？」とアリスは思った。だから彼女は自分の心の中で（暑い日でとても眠くてぼんやりしていたので、自分なりに精一杯考えながら）、デイジーチェーンを作る楽しみが立ち上がってデイジーを摘む手間に見合うかどうかを考えていたとき、突然、ピンクの目をした白ウサギが彼女のすぐそばを走り抜けた。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Alice was beginning to get very tired",
        "translation": "アリスはだんだんととても疲れてきていた",
        "speech": "Alice was beginning to get very tired"
      },
      {
        "original": "of sitting by her sister on the bank,",
        "translation": "川岸で妹のそばに座っていることに、",
        "speech": "of sitting by her sister on the bank,"
      },
      {
        "original": "and of having nothing to do:",
        "translation": "そして何もすることがないことに:",
        "speech": "and of having nothing to do:"
      },
      {
        "original": "once or twice she had peeped into the book her",
        "translation": "一度か二度、妹が読んでいる本をのぞいてみたことがあったが、",
        "speech": "once or twice she had peeped into the book her"
      },
      {
        "original": "sister was reading, but it had no pictures or conversations in it,",
        "translation": "その本には絵や会話が全くなかった、",
        "speech": "sister was reading, but it had no pictures or conversations in it,"
      },
      {
        "original": "“and what is the use of a book,”",
        "translation": "「本に絵や会話がなければ、",
        "speech": "“and what is the use of a book,”"
      },
      {
        "original": "thought Alice “without pictures or conversations?”",
        "translation": "なんの役に立つのだろう」とアリスは思った。",
        "speech": "thought Alice “without pictures or conversations?”"
      },
      {
        "original": "So she was considering in her own mind",
        "translation": "だから彼女は自分の心の中で考えていた",
        "speech": "So she was considering in her own mind"
      },
      {
        "original": "(as well as she could,",
        "translation": "（できる限り、",
        "speech": "(as well as she could,"
      },
      {
        "original": "for the hot day made her feel very sleepy and stupid),",
        "translation": "暑い日でとても眠くてぼんやりしていたので）、",
        "speech": "for the hot day made her feel very sleepy and stupid),"
      },
      {
        "original": "whether the pleasure of making a daisy-chain would be worth the trouble",
        "translation": "デイジーチェーンを作る楽しみが、",
        "speech": "whether the pleasure of making a daisy-chain would be worth the trouble"
      },
      {
        "original": "of getting up and picking the daisies,",
        "translation": "立ち上がってデイジーを摘む手間に見合うかどうか、",
        "speech": "of getting up and picking the daisies,"
      },
      {
        "original": "when suddenly a White Rabbit with pink eyes ran close by her.",
        "translation": "そのとき突然、ピンク色の目をした白ウサギが彼女のすぐそばを走り抜けた。",
        "speech": "when suddenly a White Rabbit with pink eyes ran close by her."
      }
    ]
  },
  {
    "original": "There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, “Oh dear! Oh dear! I shall be late!” (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.",
    "translation": "それには特に驚くようなことは何もなかったし、アリスもウサギが自分に向かって「まあ！まあ！遅れるわ！」と言っているのを聞いて、そんなに変だとも思わなかった。（後でよく考えてみると、彼女はそれに驚くべきだったと思ったが、その時はすべてが全く自然に思えた。）しかし、ウサギが実際に懐中時計をベストのポケットから取り出して、それを見て、そして急いで行ったとき、アリスは飛び上がった。なぜなら、彼女の頭に、ウサギがベストのポケットを持っているのも、取り出す時計を持っているのも今まで見たことがなかったという考えが閃いたからである。そして好奇心に燃えて、彼女は畑を横切ってウサギを追いかけ、幸運にも生け垣の下にある大きなウサギの穴にウサギが飛び込むのをちょうど間に合って見ることができたのだった。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "There was nothing so very remarkable in that;",
        "translation": "それには特にめざましいことは何もなかった。",
        "speech": "There was nothing so very remarkable in that;"
      },
      {
        "original": "nor did Alice think it so very much out",
        "translation": "アリスも、うさぎが独り言で「まあ！まあ！遅れちゃうわ！」と言うのを聞いても、",
        "speech": "nor did Alice think it so very much out"
      },
      {
        "original": "of the way to hear the Rabbit say to itself, “Oh dear!",
        "translation": "そんなに不思議だとは思わなかった。",
        "speech": "of the way to hear the Rabbit say to itself, “Oh dear!"
      },
      {
        "original": "Oh dear! I shall be late!”",
        "translation": "（後でよく考えてみると、",
        "speech": "Oh dear! I shall be late!”"
      },
      {
        "original": "(when she thought it over afterwards,",
        "translation": "それに驚くべきだったと気づいたが、",
        "speech": "(when she thought it over afterwards,"
      },
      {
        "original": "it occurred to her that she ought to have wondered at this,",
        "translation": "その時は、すべてごく自然に思えた）；",
        "speech": "it occurred to her that she ought to have wondered at this,"
      },
      {
        "original": "but at the time it all seemed quite natural);",
        "translation": "しかし、うさぎが実際に懐中時計をベストのポケットから取り出し、",
        "speech": "but at the time it all seemed quite natural);"
      },
      {
        "original": "but when the Rabbit actually took a watch out of its waistcoat-pocket,",
        "translation": "それを見て、そして急いで行ってしまったとき、",
        "speech": "but when the Rabbit actually took a watch out of its waistcoat-pocket,"
      },
      {
        "original": "and looked at it, and then hurried on,",
        "translation": "アリスは飛び上がった。",
        "speech": "and looked at it, and then hurried on,"
      },
      {
        "original": "Alice started to her feet,",
        "translation": "なぜなら、",
        "speech": "Alice started to her feet,"
      },
      {
        "original": "for it flashed across her mind",
        "translation": "彼女は今まで一度も、ベストのポケットを持つうさぎや、",
        "speech": "for it flashed across her mind"
      },
      {
        "original": "that she had never before seen a rabbit with either a waistcoat-pocket,",
        "translation": "そこから取り出す時計を持つうさぎを見たことがなかったことを",
        "speech": "that she had never before seen a rabbit with either a waistcoat-pocket,"
      },
      {
        "original": "or a watch to take out of it,",
        "translation": "思い出したからである。",
        "speech": "or a watch to take out of it,"
      },
      {
        "original": "and burning with curiosity, she ran across the field after it,",
        "translation": "好奇心に燃え、彼女はそのうさぎを追いかけて野原を駆け抜け、",
        "speech": "and burning with curiosity, she ran across the field after it,"
      },
      {
        "original": "and fortunately was just in time",
        "translation": "幸いにもちょうど間に合い、",
        "speech": "and fortunately was just in time"
      },
      {
        "original": "to see it pop down a large rabbit-hole under the hedge.",
        "translation": "生け垣の下の大きなウサギの穴に飛び込むのを目にすることができた。",
        "speech": "to see it pop down a large rabbit-hole under the hedge."
      }
    ]
  },
  {
    "original": "In another moment down went Alice after it, never once considering how in the world she was to get out again. The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.",
    "translation": "次の瞬間、アリスはそれを追って下に落ちて行きましたが、どうやってまた地上に戻るのかということを一度も考えませんでした。そのウサギの穴はしばらくの間トンネルのようにまっすぐ続き、そして突然下に曲がりました。そのため、アリスは自分を止めることを考える暇もなく、とても深い井戸に落ちていることに気づきました。",
    "guide": "時や条件を示す部分を先に受け、そのあと主な出来事へ進みます。",
    "narrationSegments": [
      {
        "original": "In another moment down went Alice after it,",
        "translation": "次の瞬間、アリスはそれを追いかけて下に落ちました、",
        "speech": "In another moment down went Alice after it,"
      },
      {
        "original": "never once considering how in the world she was",
        "translation": "自分が一体どうやって",
        "speech": "never once considering how in the world she was"
      },
      {
        "original": "to get out again.",
        "translation": "また出てくるのかを一度も考えることなく。",
        "speech": "to get out again."
      },
      {
        "original": "The rabbit-hole went straight on like a tunnel for some way,",
        "translation": "そのウサギの穴はしばらくトンネルのように真っすぐ続き、",
        "speech": "The rabbit-hole went straight on like a tunnel for some way,"
      },
      {
        "original": "and then dipped suddenly down,",
        "translation": "そして突然急に下に傾き、",
        "speech": "and then dipped suddenly down,"
      },
      {
        "original": "so suddenly that Alice had not a moment",
        "translation": "あまりにも急で、アリスは一瞬も",
        "speech": "so suddenly that Alice had not a moment"
      },
      {
        "original": "to think about stopping herself",
        "translation": "自分を止めることを考える間がなく、",
        "speech": "to think about stopping herself"
      },
      {
        "original": "before she found herself falling down a very deep well.",
        "translation": "非常に深い井戸に落ちてしまいました。",
        "speech": "before she found herself falling down a very deep well."
      }
    ]
  },
  {
    "original": "Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled “ORANGE MARMALADE”, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody underneath, so managed to put it into one of the cupboards as she fell past it.",
    "translation": "井戸はとても深かったのか、それとも彼女が落ちるのがとてもゆっくりだったのか、彼女には降りながら周りを見て、次に何が起こるのだろうと不思議に思う十分な時間があった。まず、下を見てどこに着くのか確認しようとしたが、暗くて何も見えなかった。それから井戸の側面を見ると、戸棚や本棚でいっぱいになっていることに気づいた。あちこちに地図や絵が釘に掛けられているのも見えた。彼女は通り過ぎる際に棚の一つから瓶を取り下ろした。それには「オレンジマーマレード」とラベルが貼られていたが、残念なことに空っぽだった。下に人がいても殺してしまうかもしれないと思い、瓶を落としたくはなかったので、落ちて通り過ぎる際に何とか戸棚の一つに戻した。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Either the well was very deep,",
        "translation": "井戸は非常に深かったのか、",
        "speech": "Either the well was very deep,"
      },
      {
        "original": "or she fell very slowly,",
        "translation": "それとも彼女はとてもゆっくり落ちたのか、",
        "speech": "or she fell very slowly,"
      },
      {
        "original": "for she had plenty of time",
        "translation": "下に落ちる間にたっぷり時間があった、",
        "speech": "for she had plenty of time"
      },
      {
        "original": "as she went down to look about her",
        "translation": "自分の周りを見渡したり、",
        "speech": "as she went down to look about her"
      },
      {
        "original": "and to wonder what was going to happen next.",
        "translation": "次に何が起こるのかと思いを巡らせたりしながら。",
        "speech": "and to wonder what was going to happen next."
      },
      {
        "original": "First, she tried to look down",
        "translation": "まず、彼女は下を見ようとしました",
        "speech": "First, she tried to look down"
      },
      {
        "original": "and make out what she was coming to,",
        "translation": "そして自分が何に近づいているのかを理解しようとしました、",
        "speech": "and make out what she was coming to,"
      },
      {
        "original": "but it was too dark to see anything;",
        "translation": "しかし何も見えないほど暗かったです；",
        "speech": "but it was too dark to see anything;"
      },
      {
        "original": "then she looked at the sides of the well,",
        "translation": "それから彼女は井戸の側面を見ました、",
        "speech": "then she looked at the sides of the well,"
      },
      {
        "original": "and noticed that they were filled with cupboards and book-shelves;",
        "translation": "そして、それらが戸棚や本棚でいっぱいになっていることに気付きました；",
        "speech": "and noticed that they were filled with cupboards and book-shelves;"
      },
      {
        "original": "here and there she saw maps and pictures hung upon pegs.",
        "translation": "あちこちで、彼女は地図や絵が杭に掛けられているのを見た。",
        "speech": "here and there she saw maps and pictures hung upon pegs."
      },
      {
        "original": "She took down a jar from one",
        "translation": "彼女はそのうちの一つから瓶を下ろした。",
        "speech": "She took down a jar from one"
      },
      {
        "original": "of the shelves as she passed;",
        "translation": "彼女が通り過ぎるときの棚の上のもの；",
        "speech": "of the shelves as she passed;"
      },
      {
        "original": "it was labelled “ORANGE MARMALADE”,",
        "translation": "「オレンジマーマレード」とラベルが貼られていたが、",
        "speech": "it was labelled “ORANGE MARMALADE”,"
      },
      {
        "original": "but to her great disappointment it was empty:",
        "translation": "彼女は大いにがっかりした、空だったのだ：",
        "speech": "but to her great disappointment it was empty:"
      },
      {
        "original": "she did not like to drop the jar",
        "translation": "彼女はその瓶を落とすのを好まなかった",
        "speech": "she did not like to drop the jar"
      },
      {
        "original": "for fear of killing somebody underneath,",
        "translation": "下にいる誰かを殺してしまうのを恐れて、",
        "speech": "for fear of killing somebody underneath,"
      },
      {
        "original": "so managed to put it into one",
        "translation": "だから落ちる途中でそれを",
        "speech": "so managed to put it into one"
      },
      {
        "original": "of the cupboards as she fell past it.",
        "translation": "戸棚の一つに置くことができた。",
        "speech": "of the cupboards as she fell past it."
      }
    ]
  },
  {
    "original": "“Well!” thought Alice to herself, “after such a fall as this, I shall think nothing of tumbling down stairs! How brave they’ll all think me at home! Why, I wouldn’t say anything about it, even if I fell off the top of the house!” (Which was very likely true.)",
    "translation": "「さて！」とアリスは心の中で考えました。「こんな大きな落下の後では、階段から転げ落ちるくらい何でもないと思うわ！家ではみんな私のことをとても勇敢だと思うでしょうね！いや、家の屋根のてっぺんから落ちても、何も言わないでしょう！」（これは非常にありそうなことでした。）",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Well!” thought Alice to herself,",
        "translation": "「さて！」とアリスは心の中で思いました、",
        "speech": "“Well!” thought Alice to herself,"
      },
      {
        "original": "“after such a fall as this,",
        "translation": "「こんなに落ちた後なら、",
        "speech": "“after such a fall as this,"
      },
      {
        "original": "I shall think nothing of tumbling down stairs!",
        "translation": "階段を転げ落ちるくらい、大したことないわ！」",
        "speech": "I shall think nothing of tumbling down stairs!"
      },
      {
        "original": "How brave they’ll all think me at home!",
        "translation": "みんな家で私がどれほど勇敢だと思うことでしょう！",
        "speech": "How brave they’ll all think me at home!"
      },
      {
        "original": "Why, I wouldn’t say anything about it,",
        "translation": "だって、もし屋根の上から落ちても、",
        "speech": "Why, I wouldn’t say anything about it,"
      },
      {
        "original": "even if I fell off the top of the house!”",
        "translation": "何も言わなかったでしょうから！」",
        "speech": "even if I fell off the top of the house!”"
      },
      {
        "original": "(Which was very likely true.)",
        "translation": "（それはとてもありそうなことでした。）",
        "speech": "(Which was very likely true.)"
      }
    ]
  },
  {
    "original": "Down, down, down. Would the fall never come to an end? “I wonder how many miles I’ve fallen by this time?” she said aloud. “I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think — ” (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a very good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) “ — yes, that’s about the right distance — but then I wonder what Latitude or Longitude I’ve got to?” (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)",
    "translation": "どんどん、どんどん、どんどん落ちていく。落下はいつになったら終わるのだろう？ 「いったい今までに何マイル落ちたのかしら？」と彼女は声に出して言った。 「そろそろ地球の中心あたりに近づいているに違いないわ。ちょっと考えてみよう：それはたぶん四千マイルの深さくらいだと思う――」（というのも、アリスは学校の授業でこの手のことをいくつか学んでいて、今は知識をひけらかすいい機会ではなかったけれど、誰も聞いていなくても声に出して言うのは良い練習になると思ったのだ） 「―そうね、だいたいそのくらいの距離かしら――でも、わたしはいったい何度線と経度線のあたりにいるのかしら？」（アリスは何度線というものも経度線というものもまったく知らなかったが、言うと立派な感じがする言葉だと思っていた。）",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Down, down, down.",
        "translation": "下へ、下へ、下へ。",
        "speech": "Down, down, down."
      },
      {
        "original": "Would the fall never come to an end?",
        "translation": "この落下はいつになったら終わるのだろう？",
        "speech": "Would the fall never come to an end?"
      },
      {
        "original": "“I wonder how many miles I’ve fallen by this time?”",
        "translation": "「今までにどれくらい落ちたのかしら？」",
        "speech": "“I wonder how many miles I’ve fallen by this time?”"
      },
      {
        "original": "she said aloud.",
        "translation": "彼女は声に出して言った。",
        "speech": "she said aloud."
      },
      {
        "original": "“I must be getting somewhere near the centre of the earth.",
        "translation": "「そろそろ地球の中心に近づいているに違いないわ。",
        "speech": "“I must be getting somewhere near the centre of the earth."
      },
      {
        "original": "Let me see:",
        "translation": "ええと、",
        "speech": "Let me see:"
      },
      {
        "original": "that would be four thousand miles down, I think —",
        "translation": "それなら四千マイルくらい下に来ていると思う――",
        "speech": "that would be four thousand miles down, I think —"
      },
      {
        "original": "” (for, you see,",
        "translation": "」（というのも、",
        "speech": "” (for, you see,"
      },
      {
        "original": "Alice had learnt several things of this sort",
        "translation": "アリスはこの手のことをいくつか学んでいたからだ",
        "speech": "Alice had learnt several things of this sort"
      },
      {
        "original": "in her lessons in the schoolroom,",
        "translation": "教室での授業の中で、",
        "speech": "in her lessons in the schoolroom,"
      },
      {
        "original": "and though this was not a very good opportunity",
        "translation": "そしてこれはあまり良い機会ではなかったけれども、",
        "speech": "and though this was not a very good opportunity"
      },
      {
        "original": "for showing off her knowledge,",
        "translation": "自分の知識を見せびらかすには、",
        "speech": "for showing off her knowledge,"
      },
      {
        "original": "as there was no one to listen to her,",
        "translation": "聞いてくれる人が誰もいなかったので、",
        "speech": "as there was no one to listen to her,"
      },
      {
        "original": "still it was good practice to say it over) “ —",
        "translation": "それでも何度も言って練習するには良いことだった) “ —",
        "speech": "still it was good practice to say it over) “ —"
      },
      {
        "original": "yes, that’s about the right distance —",
        "translation": "そう、だいたいそのくらいの距離ね —",
        "speech": "yes, that’s about the right distance —"
      },
      {
        "original": "but then I wonder what Latitude or Longitude I’ve got to?”",
        "translation": "でも、私はいったい緯度か経度のどれを持っているんだろう？”",
        "speech": "but then I wonder what Latitude or Longitude I’ve got to?”"
      },
      {
        "original": "(Alice had no idea what Latitude was,",
        "translation": "(アリスは緯度というものが何か、",
        "speech": "(Alice had no idea what Latitude was,"
      },
      {
        "original": "or Longitude either, but thought they were nice grand words to say.)",
        "translation": "経度もまた何か全く分からなかったが、ただ言うと立派そうな言葉だと思った。)",
        "speech": "or Longitude either, but thought they were nice grand words to say.)"
      }
    ]
  },
  {
    "original": "Presently she began again. “I wonder if I shall fall right through the earth! How funny it’ll seem to come out among the people that walk with their heads downward! The Antipathies, I think — ” (she was rather glad there was no one listening, this time, as it didn’t sound at all the right word) “ — but I shall have to ask them what the name of the country is, you know. Please, Ma’am, is this New Zealand or Australia?” (and she tried to curtsey as she spoke — fancy curtseying as you’re falling through the air! Do you think you could manage it?) “And what an ignorant little girl she’ll think me for asking! No, it’ll never do to ask: perhaps I shall see it written up somewhere.”",
    "translation": "さて、彼女はまた話し始めました。「私は地球の真ん中まで落ちてしまうのかな！頭を下にして歩く人々の中に出てくるなんて、どんなに奇妙でしょうね！反感の国かな、と思うけど—」（今回は誰も聞いていないのが少し嬉しかった、というのもまったく正しい言葉には聞こえなかったからです）「—でも、国の名前を聞かなきゃいけませんね。お願いです、奥様、ここはニュージーランドですか、それともオーストラリアですか？」（そして話しながらお辞儀しようとしました—空中を落ちながらお辞儀するなんて考えてみてください！あなたならできますか？）「そして、そんなことを尋ねて、どれほど無知な小さな女の子だと思われるでしょう！いいえ、尋ねるのは絶対にだめ、もしかしたらどこかに名前が書いてあるのを見ることができるかもしれません。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Presently she began again.",
        "translation": "さて、彼女はまた話し始めました。",
        "speech": "Presently she began again."
      },
      {
        "original": "“I wonder if I shall fall right through the earth!",
        "translation": "「私、地球をまっすぐに突き抜けてしまうかしら！",
        "speech": "“I wonder if I shall fall right through the earth!"
      },
      {
        "original": "How funny it’ll seem to come out among the people",
        "translation": "逆さまに歩く人たちの中に出てくるなんて、",
        "speech": "How funny it’ll seem to come out among the people"
      },
      {
        "original": "that walk with their heads downward!",
        "translation": "なんて面白いことでしょう！",
        "speech": "that walk with their heads downward!"
      },
      {
        "original": "The Antipathies, I think —",
        "translation": "アンチパシーたち、だと思うわ —",
        "speech": "The Antipathies, I think —"
      },
      {
        "original": "” (she was rather glad there was no one listening,",
        "translation": "（この時は、誰も聞いていなくて彼女はむしろ嬉しかった、",
        "speech": "” (she was rather glad there was no one listening,"
      },
      {
        "original": "this time, as it didn’t sound",
        "translation": "この声は",
        "speech": "this time, as it didn’t sound"
      },
      {
        "original": "at all the right word) “ —",
        "translation": "まさにその言葉) “ —",
        "speech": "at all the right word) “ —"
      },
      {
        "original": "but I shall have to ask them what the name",
        "translation": "しかし、彼らにその名前が何かを尋ねなければならない",
        "speech": "but I shall have to ask them what the name"
      },
      {
        "original": "of the country is, you know.",
        "translation": "国がどんなところかって、わかるでしょう。",
        "speech": "of the country is, you know."
      },
      {
        "original": "Please, Ma’am, is this New Zealand or Australia?”",
        "translation": "お願いします、マアム、ここはニュージーランドですか、それともオーストラリアですか？”",
        "speech": "Please, Ma’am, is this New Zealand or Australia?”"
      },
      {
        "original": "(and she tried to curtsey as she spoke —",
        "translation": "（そして彼女は話しながらおじぎしようとしました —",
        "speech": "(and she tried to curtsey as she spoke —"
      },
      {
        "original": "fancy curtseying as you’re falling through the air!",
        "translation": "空中に落ちながらおじぎするなんて、考えてみてください！",
        "speech": "fancy curtseying as you’re falling through the air!"
      },
      {
        "original": "Do you think you could manage it?)",
        "translation": "できると思いますか？）",
        "speech": "Do you think you could manage it?)"
      },
      {
        "original": "“And what an ignorant little girl she’ll think me for asking!",
        "translation": "“こんなことを聞くなんて、彼女にはなんて無知な小さな女の子だと思われるでしょう！",
        "speech": "“And what an ignorant little girl she’ll think me for asking!"
      },
      {
        "original": "No, it’ll never do to ask:",
        "translation": "いや、聞くわけにはいきません：",
        "speech": "No, it’ll never do to ask:"
      },
      {
        "original": "perhaps I shall see it written up somewhere.”",
        "translation": "もしかしたらどこかで書かれているのを見るかもしれません。”",
        "speech": "perhaps I shall see it written up somewhere.”"
      }
    ]
  },
  {
    "original": "Down, down, down. There was nothing else to do, so Alice soon began talking again. “Dinah’ll miss me very much to-night, I should think!” (Dinah was the cat.) “I hope they’ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I’m afraid, but you might catch a bat, and that’s very like a mouse, you know. But do cats eat bats, I wonder?” And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, “Do cats eat bats?",
    "translation": "下へ、下へ、下へ。ほかにすることもなかったので、アリスはすぐにまた話し始めました。「ディナちゃんは今夜、私のことをとても恋しがると思うわ！」（ディナは猫でした。）「お茶の時間に彼女のミルクの小皿を覚えていてくれるといいけれど。ディナ、私のかわいい子！ あなたがここに一緒にいたらなあ！ 空中にはネズミはいないと思うけど、コウモリなら捕まえられるかもね、あれはネズミにそっくりだから。でも、猫はコウモリを食べるのかしら？」そしてここでアリスはちょっと眠くなり、夢見るように自分自身に言い続けました。「猫はコウモリを食べるのかしら？」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Down, down, down.",
        "translation": "下へ、下へ、下へ。",
        "speech": "Down, down, down."
      },
      {
        "original": "There was nothing else to do, so Alice soon began talking again.",
        "translation": "他にすることがなかったので、アリスはすぐにまた話し始めました。",
        "speech": "There was nothing else to do, so Alice soon began talking again."
      },
      {
        "original": "“Dinah’ll miss me very much to-night, I should think!”",
        "translation": "「今夜、ダイナは私のことをとても寂しく思うでしょうね！」",
        "speech": "“Dinah’ll miss me very much to-night, I should think!”"
      },
      {
        "original": "(Dinah was the cat.)",
        "translation": "（ダイナは猫でした。）",
        "speech": "(Dinah was the cat.)"
      },
      {
        "original": "“I hope they’ll remember her saucer of milk at tea-time.",
        "translation": "「お茶の時間に彼女のミルクのお皿を思い出してくれるといいな。",
        "speech": "“I hope they’ll remember her saucer of milk at tea-time."
      },
      {
        "original": "Dinah my dear!",
        "translation": "ダイナ、私の可愛い子！",
        "speech": "Dinah my dear!"
      },
      {
        "original": "I wish you were down here with me!",
        "translation": "あなたがここに一緒にいてくれたらいいのに！",
        "speech": "I wish you were down here with me!"
      },
      {
        "original": "There are no mice in the air,",
        "translation": "空中にはネズミはいません、",
        "speech": "There are no mice in the air,"
      },
      {
        "original": "I’m afraid, but you might catch a bat,",
        "translation": "残念ながら、でもコウモリを捕まえるかもしれません、",
        "speech": "I’m afraid, but you might catch a bat,"
      },
      {
        "original": "and that’s very like a mouse, you know.",
        "translation": "そしてそれはネズミにとても似ていますよ。",
        "speech": "and that’s very like a mouse, you know."
      },
      {
        "original": "But do cats eat bats, I wonder?”",
        "translation": "でも猫はコウモリを食べるのかしら？」",
        "speech": "But do cats eat bats, I wonder?”"
      },
      {
        "original": "And here Alice began to get rather sleepy,",
        "translation": "そしてここでアリスは少し眠くなり始め、",
        "speech": "And here Alice began to get rather sleepy,"
      },
      {
        "original": "and went on saying to herself,",
        "translation": "夢見がちな口調で、自分自身に言い続けました、",
        "speech": "and went on saying to herself,"
      },
      {
        "original": "in a dreamy sort of way, “Do cats eat bats?",
        "translation": "「猫はコウモリを食べるのかしら？」",
        "speech": "in a dreamy sort of way, “Do cats eat bats?"
      }
    ]
  },
  {
    "original": "Do cats eat bats?” and sometimes, “Do bats eat cats?” for, you see, as she couldn’t answer either question, it didn’t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, “Now, Dinah, tell me the truth: did you ever eat a bat?” when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.",
    "translation": "「猫はコウモリを食べますか？」そして時には、「コウモリは猫を食べますか？」と、というのも、彼女はどちらの質問にも答えられなかったので、どちらの言い方をしてもあまり重要ではなかったのです。彼女はうたた寝し始めているのを感じて、ちょうどディナと手をつないで歩いている夢を見始め、「ねえ、ディナ、本当のことを教えて、コウモリを食べたことはある？」ととても真剣に彼女に言っているところでした。その時突然、どん！どん！と、枝や枯れ葉の山に落ちて、落下は終わったのです。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Do cats eat bats?”",
        "translation": "猫はコウモリを食べますか？」",
        "speech": "Do cats eat bats?”"
      },
      {
        "original": "and sometimes, “Do bats eat cats?”",
        "translation": "そして時々、「コウモリは猫を食べますか？」",
        "speech": "and sometimes, “Do bats eat cats?”"
      },
      {
        "original": "for, you see, as she couldn’t answer either question,",
        "translation": "なぜなら、彼女はどちらの質問にも答えられなかったので、",
        "speech": "for, you see, as she couldn’t answer either question,"
      },
      {
        "original": "it didn’t much matter which way she put it.",
        "translation": "どのように言おうとあまり重要ではなかったのです。",
        "speech": "it didn’t much matter which way she put it."
      },
      {
        "original": "She felt that she was dozing off,",
        "translation": "彼女はうとうとしているのを感じ、",
        "speech": "She felt that she was dozing off,"
      },
      {
        "original": "and had just begun to dream",
        "translation": "ちょうど夢を見始めたところでした",
        "speech": "and had just begun to dream"
      },
      {
        "original": "that she was walking hand in hand with Dinah,",
        "translation": "夢の中で彼女はダイナと手をつないで歩いていて、",
        "speech": "that she was walking hand in hand with Dinah,"
      },
      {
        "original": "and saying to her very earnestly, “Now, Dinah, tell me the truth:",
        "translation": "とても真剣に彼女に言っていました。「さあ、ダイナ、本当のことを教えて：",
        "speech": "and saying to her very earnestly, “Now, Dinah, tell me the truth:"
      },
      {
        "original": "did you ever eat a bat?”",
        "translation": "コウモリを食べたことはありますか？」",
        "speech": "did you ever eat a bat?”"
      },
      {
        "original": "when suddenly, thump!",
        "translation": "すると突然、ドン！",
        "speech": "when suddenly, thump!"
      },
      {
        "original": "thump! down she came upon a heap of sticks and dry leaves,",
        "translation": "ドン！ 束の棒と枯れ葉の山に落ちました、",
        "speech": "thump! down she came upon a heap of sticks and dry leaves,"
      },
      {
        "original": "and the fall was over.",
        "translation": "そして落下は終わりました。",
        "speech": "and the fall was over."
      }
    ]
  },
  {
    "original": "Alice was not a bit hurt, and she jumped up on to her feet in a moment: she looked up, but it was all dark overhead; before her was another long passage, and the White Rabbit was still in sight, hurrying down it. There was not a moment to be lost: away went Alice like the wind, and was just in time to hear it say, as it turned a corner, “Oh my ears and whiskers, how late it’s getting!” She was close behind it when she turned the corner, but the Rabbit was no longer to be seen: she found herself in a long, low hall, which was lit up by a row of lamps hanging from the roof.",
    "translation": "アリスは少しも傷つかず、すぐに立ち上がった。見上げてみたが、頭上はすべて暗かった。目の前には別の長い通路があり、白ウサギはまだ見えていて、その中を急いでいた。時間は一刻も惜しかった。アリスは風のように駆け出し、ちょうど角を曲がる白ウサギが「まあ、耳とひげが、もうこんなに遅くなってしまった！」と言うのを聞いた。アリスは角を曲がるところで間近にいたが、ウサギはもう見えなかった。彼女は長く低いホールに出て、屋根からぶら下がっている一列のランプによって照らされていたことに気づいた。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Alice was not a bit hurt,",
        "translation": "アリスは少しも傷ついていませんでした、",
        "speech": "Alice was not a bit hurt,"
      },
      {
        "original": "and she jumped up on to her feet in a moment:",
        "translation": "そして、すぐに立ち上がりました：",
        "speech": "and she jumped up on to her feet in a moment:"
      },
      {
        "original": "she looked up, but it was all dark overhead;",
        "translation": "彼女は上を見上げましたが、頭上はすべて暗かったです；",
        "speech": "she looked up, but it was all dark overhead;"
      },
      {
        "original": "before her was another long passage,",
        "translation": "彼女の前には別の長い通路があり、",
        "speech": "before her was another long passage,"
      },
      {
        "original": "and the White Rabbit was still in sight, hurrying down it.",
        "translation": "白ウサギはまだ見えており、急いでその通路を進んでいました。",
        "speech": "and the White Rabbit was still in sight, hurrying down it."
      },
      {
        "original": "There was not a moment to be lost:",
        "translation": "一瞬の猶予もありません：",
        "speech": "There was not a moment to be lost:"
      },
      {
        "original": "away went Alice like the wind,",
        "translation": "アリスは風のように走り出し、",
        "speech": "away went Alice like the wind,"
      },
      {
        "original": "and was just in time to hear it say,",
        "translation": "ちょうどその角を曲がるウサギの声を聞く間一瞬に間に間にたちました、",
        "speech": "and was just in time to hear it say,"
      },
      {
        "original": "as it turned a corner, “Oh my ears and whiskers,",
        "translation": "「ああ、私の耳とひげ、",
        "speech": "as it turned a corner, “Oh my ears and whiskers,"
      },
      {
        "original": "how late it’s getting!”",
        "translation": "もうこんなに遅くなってしまった！」と言っていました。",
        "speech": "how late it’s getting!”"
      },
      {
        "original": "She was close behind it when she turned the corner,",
        "translation": "彼女が角を曲がった時、ウサギのすぐ後ろにいました、",
        "speech": "She was close behind it when she turned the corner,"
      },
      {
        "original": "but the Rabbit was no longer to be seen:",
        "translation": "しかし、ウサギの姿はもう見えませんでした：",
        "speech": "but the Rabbit was no longer to be seen:"
      },
      {
        "original": "she found herself in a long, low hall,",
        "translation": "彼女は自分が長く低いホールにいることに気づき、",
        "speech": "she found herself in a long, low hall,"
      },
      {
        "original": "which was lit up by a row",
        "translation": "そのホールは天井から吊るされた一列の",
        "speech": "which was lit up by a row"
      },
      {
        "original": "of lamps hanging from the roof.",
        "translation": "ランプによって照らされていました。",
        "speech": "of lamps hanging from the roof."
      }
    ]
  },
  {
    "original": "There were doors all round the hall, but they were all locked; and when Alice had been all the way down one side and up the other, trying every door, she walked sadly down the middle, wondering how she was ever to get out again.",
    "translation": "ホールの周りにはドアが全部あったが、すべて鍵がかかっていた。アリスが一方の側を端から端まで、もう一方の側も同じように歩いて、すべてのドアを試した後、彼女は悲しそうに中央を歩きながら、どうすれば再び外に出られるのかと考えた。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "There were doors all round the hall, but they were all locked;",
        "translation": "ホールの周りにはドアがありましたが、全部鍵がかかっていました。",
        "speech": "There were doors all round the hall, but they were all locked;"
      },
      {
        "original": "and when Alice had been all the way down one side",
        "translation": "アリスは一方の側を全部歩き、",
        "speech": "and when Alice had been all the way down one side"
      },
      {
        "original": "and up the other, trying every door,",
        "translation": "もう一方の側も上がり下がりしながら、すべてのドアを試してみました。",
        "speech": "and up the other, trying every door,"
      },
      {
        "original": "she walked sadly down the middle,",
        "translation": "そして、彼女は悲しそうに中央を歩き",
        "speech": "she walked sadly down the middle,"
      },
      {
        "original": "wondering how she was ever to get out again.",
        "translation": "どうやって再び外に出ることができるのだろうかと考えました。",
        "speech": "wondering how she was ever to get out again."
      }
    ]
  },
  {
    "original": "Suddenly she came upon a little three-legged table, all made of solid glass; there was nothing on it except a tiny golden key, and Alice’s first thought was that it might belong to one of the doors of the hall; but, alas! either the locks were too large, or the key was too small, but at any rate it would not open any of them. However, on the second time round, she came upon a low curtain she had not noticed before, and behind it was a little door about fifteen inches high: she tried the little golden key in the lock, and to her great delight it fitted!",
    "translation": "突如として彼女は、小さな三本足のテーブルに出くわしました。それはすべて固いガラスでできており、上には小さな金の鍵だけが置かれていました。アリスの最初の考えは、それが広間のどこかの扉に使えるかもしれないというものでした。しかし、残念なことに、錠は大きすぎるか、鍵は小さすぎたのです。それにしても、どの扉も開けることはできませんでした。しかし、二度目に回ったとき、彼女は以前に気づかなかった低いカーテンに出会い、その奥には高さ約十五インチの小さな扉がありました。彼女は金の小さな鍵を錠に試してみると、大いに喜んだことにそれはぴったり合ったのです！",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "Suddenly she came upon a little three-legged table,",
        "translation": "突然、彼女は小さな三本脚のテーブルを見つけました、",
        "speech": "Suddenly she came upon a little three-legged table,"
      },
      {
        "original": "all made of solid glass;",
        "translation": "すべてが固いガラスでできていました；",
        "speech": "all made of solid glass;"
      },
      {
        "original": "there was nothing on it except a tiny golden key,",
        "translation": "その上には小さな金の鍵しかありませんでした、",
        "speech": "there was nothing on it except a tiny golden key,"
      },
      {
        "original": "and Alice’s first thought was that it might belong",
        "translation": "そしてアリスの最初の考えは、それが",
        "speech": "and Alice’s first thought was that it might belong"
      },
      {
        "original": "to one of the doors of the hall; but, alas!",
        "translation": "ホールのドアの一つに属しているかもしれないということでした；しかし、ああ！",
        "speech": "to one of the doors of the hall; but, alas!"
      },
      {
        "original": "either the locks were too large,",
        "translation": "錠前が大きすぎるか、",
        "speech": "either the locks were too large,"
      },
      {
        "original": "or the key was too small,",
        "translation": "鍵が小さすぎるか、",
        "speech": "or the key was too small,"
      },
      {
        "original": "but at any rate it would not open any of them.",
        "translation": "いずれにせよ、どのドアも開けることはできませんでした。",
        "speech": "but at any rate it would not open any of them."
      },
      {
        "original": "However, on the second time round,",
        "translation": "しかし、二度目に回ったとき、",
        "speech": "However, on the second time round,"
      },
      {
        "original": "she came upon a low curtain she had not noticed before,",
        "translation": "彼女は以前は気づかなかった低いカーテンを見つけました、",
        "speech": "she came upon a low curtain she had not noticed before,"
      },
      {
        "original": "and behind it was a little door about fifteen inches high:",
        "translation": "その後ろには高さ約十五インチの小さなドアがありました：",
        "speech": "and behind it was a little door about fifteen inches high:"
      },
      {
        "original": "she tried the little golden key in the lock,",
        "translation": "彼女は錠に小さな金の鍵を試し、",
        "speech": "she tried the little golden key in the lock,"
      },
      {
        "original": "and to her great delight it fitted!",
        "translation": "そして大いに喜んだことに、それはぴったり合いました！",
        "speech": "and to her great delight it fitted!"
      }
    ]
  },
  {
    "original": "Alice opened the door and found that it led into a small passage, not much larger than a rat-hole: she knelt down and looked along the passage into the loveliest garden you ever saw. How she longed to get out of that dark hall, and wander about among those beds of bright flowers and those cool fountains, but she could not even get her head through the doorway; “and even if my head would go through,” thought poor Alice, “it would be of very little use without my shoulders. Oh, how I wish I could shut up like a telescope! I think I could, if I only knew how to begin.” For, you see, so many out-of-the-way things had happened lately, that Alice had begun to think that very few things indeed were really impossible.",
    "translation": "アリスはドアを開けると、それが小さな通路につながっていることに気づきました。ネズミの穴より少し大きいくらいの通路です。彼女はひざまずき、その通路の先にある、今まで見た中で最も美しい庭を見つめました。暗いホールを出て、明るい花壇や涼しい噴水の間を歩き回りたいと切望しましたが、頭さえもドアから入れることができませんでした。「たとえ頭だけでも通せたとしても」とかわいそうなアリスは考えました。「肩がないとほとんど意味がないわ。ああ、望遠鏡のように縮められたらいいのに！どうやって始めたらいいか分かればできると思うんだけど。」というのも、最近は普通では考えられないことが次々に起きたため、アリスは本当に不可能なことはごくわずかしかないのではないかと思い始めていたのです。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Alice opened the door and found",
        "translation": "アリスはドアを開け、見つけました",
        "speech": "Alice opened the door and found"
      },
      {
        "original": "that it led into a small passage,",
        "translation": "それが小さな通路につながっていることを、",
        "speech": "that it led into a small passage,"
      },
      {
        "original": "not much larger than a rat-hole:",
        "translation": "ねずみの穴より少し大きい程度の通路でした：",
        "speech": "not much larger than a rat-hole:"
      },
      {
        "original": "she knelt down",
        "translation": "彼女はひざまずき、",
        "speech": "she knelt down"
      },
      {
        "original": "and looked along the passage into the loveliest garden you ever saw.",
        "translation": "その通路の先にある、これまで見た中で最も素敵な庭園を見ました。",
        "speech": "and looked along the passage into the loveliest garden you ever saw."
      },
      {
        "original": "How she longed to get out of that dark hall,",
        "translation": "暗いホールから抜け出したくてたまらず、",
        "speech": "How she longed to get out of that dark hall,"
      },
      {
        "original": "and wander about among those beds of bright flowers",
        "translation": "明るい花壇の間を歩き回り、",
        "speech": "and wander about among those beds of bright flowers"
      },
      {
        "original": "and those cool fountains,",
        "translation": "涼しい噴水の周りを歩き回りたいと思いました、",
        "speech": "and those cool fountains,"
      },
      {
        "original": "but she could not even get her head through the doorway;",
        "translation": "でも、彼女はドアから頭さえ通すことができませんでした;",
        "speech": "but she could not even get her head through the doorway;"
      },
      {
        "original": "“and even if my head would go through,”",
        "translation": "「頭が通ったとしても、」",
        "speech": "“and even if my head would go through,”"
      },
      {
        "original": "thought poor Alice,",
        "translation": "かわいそうなアリスは考えました、",
        "speech": "thought poor Alice,"
      },
      {
        "original": "“it would be of very little use without my shoulders.",
        "translation": "「肩がなければほとんど役に立たないでしょう。",
        "speech": "“it would be of very little use without my shoulders."
      },
      {
        "original": "Oh, how I wish I could shut up like a telescope!",
        "translation": "ああ、望遠鏡のように縮められたらいいのに！",
        "speech": "Oh, how I wish I could shut up like a telescope!"
      },
      {
        "original": "I think I could, if I only knew how to begin.”",
        "translation": "どうやって始めればいいか分かれば、できると思うのに。」",
        "speech": "I think I could, if I only knew how to begin.”"
      },
      {
        "original": "For, you see, so many out-of-the-way things had happened lately,",
        "translation": "見ての通り、最近はこんな普通では考えられないことがたくさん起こったので、",
        "speech": "For, you see, so many out-of-the-way things had happened lately,"
      },
      {
        "original": "that Alice had begun to think",
        "translation": "アリスは考え始めました",
        "speech": "that Alice had begun to think"
      },
      {
        "original": "that very few things indeed were really impossible.",
        "translation": "ほとんど不可能なことは実際にはほとんどないのだと。",
        "speech": "that very few things indeed were really impossible."
      }
    ]
  },
  {
    "original": "There seemed to be no use in waiting by the little door, so she went back to the table, half hoping she might find another key on it, or at any rate a book of rules for shutting people up like telescopes: this time she found a little bottle on it, (“which certainly was not here before,” said Alice,) and round the neck of the bottle was a paper label, with the words “DRINK ME,” beautifully printed on it in large letters.",
    "translation": "小さなドアのそばで待っていても無駄なように思えたので、彼女はまたテーブルのところへ戻り、半分はもう一つ鍵が見つかるかもしれないと望み、あるいは少なくとも望遠鏡のように人を閉じ込めるための規則の本を見つけられないかと思った。すると今度はテーブルの上に小さな瓶を見つけた（「これは確かに前にはなかったわ」とアリスは言った）、そして瓶の首には紙のラベルが巻かれており、そこには大きな文字で美しく「DRINK ME」と印刷されていた。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "There seemed to be no use in waiting by the little door,",
        "translation": "小さな扉のそばで待っていても無駄なように思えたので、",
        "speech": "There seemed to be no use in waiting by the little door,"
      },
      {
        "original": "so she went back to the table,",
        "translation": "彼女はテーブルに戻った。",
        "speech": "so she went back to the table,"
      },
      {
        "original": "half hoping she might find another key on it,",
        "translation": "そこにもう一つの鍵が見つかるかもしれないと半ば期待しながら、",
        "speech": "half hoping she might find another key on it,"
      },
      {
        "original": "or at any rate a book of rules",
        "translation": "あるいはせめて人を望遠鏡のように閉じ込めるための規則の書でも、",
        "speech": "or at any rate a book of rules"
      },
      {
        "original": "for shutting people up like telescopes:",
        "translation": "見つかればと思った。",
        "speech": "for shutting people up like telescopes:"
      },
      {
        "original": "this time she found a little bottle on it,",
        "translation": "すると今度はテーブルの上に小さな瓶を見つけた。",
        "speech": "this time she found a little bottle on it,"
      },
      {
        "original": "(“which certainly was not here before,” said Alice,)",
        "translation": "（「これは確かに前にはここになかった」とアリスは言った）、",
        "speech": "(“which certainly was not here before,” said Alice,)"
      },
      {
        "original": "and round the neck of the bottle was a paper label,",
        "translation": "瓶の首の周りには紙のラベルがあり、",
        "speech": "and round the neck of the bottle was a paper label,"
      },
      {
        "original": "with the words “DRINK ME,” beautifully printed on it in large letters.",
        "translation": "そこには「私を飲んで」と大きな文字で美しく印刷されていた。",
        "speech": "with the words “DRINK ME,” beautifully printed on it in large letters."
      }
    ]
  },
  {
    "original": "It was all very well to say “Drink me,” but the wise little Alice was not going to do that in a hurry. “No, I’ll look first,” she said, “and see whether it’s marked ‘poison’ or not”; for she had read several nice little histories about children who had got burnt, and eaten up by wild beasts and other unpleasant things, all because they would not remember the simple rules their friends had taught them: such as, that a red-hot poker will burn you if you hold it too long; and that if you cut your finger very deeply with a knife, it usually bleeds; and she had never forgotten that, if you drink much from a bottle marked “poison,” it is almost certain to disagree with you, sooner or later.",
    "translation": "「私を飲んで」と言うのは簡単なことでしたが、賢い小さなアリスは急いでそれをしようとは思いませんでした。「いえ、先に見てみます」と彼女は言いました。「それが『毒』と書かれているかどうかを確認します」；なぜなら彼女は、子どもたちがやけどをしたり、野獣に食べられたり、その他の不愉快なことに遭った話をいくつか読んでおり、それは皆、友達が教えてくれた簡単なルールを思い出さなかったからで、例えば、熱くした鉄の棒を長く持つと火傷する、とか、ナイフで指を深く切るとたいてい血が出る、とか。そして彼女は、もし『毒』と書かれた瓶からたくさん飲むと、遅かれ早かれ体に合わないことがほぼ確実である、ということを決して忘れていませんでした。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "It was all very well to say “Drink me,”",
        "translation": "「私を飲みなさい」と言われても、それは簡単なことでしたが、",
        "speech": "It was all very well to say “Drink me,”"
      },
      {
        "original": "but the wise little Alice was not going",
        "translation": "賢い小さなアリスは、",
        "speech": "but the wise little Alice was not going"
      },
      {
        "original": "to do that in a hurry.",
        "translation": "そんなことを急いでやろうとは思いませんでした。",
        "speech": "to do that in a hurry."
      },
      {
        "original": "“No, I’ll look first,” she said,",
        "translation": "「いや、まず見てみるわ」と彼女は言いました。",
        "speech": "“No, I’ll look first,” she said,"
      },
      {
        "original": "“and see whether it’s marked ‘poison’ or not”;",
        "translation": "「そして、‘毒’と書かれているかどうか確かめてみるの」;",
        "speech": "“and see whether it’s marked ‘poison’ or not”;"
      },
      {
        "original": "for she had read several nice little histories about children",
        "translation": "なぜなら、彼女は何人かの子供たちが",
        "speech": "for she had read several nice little histories about children"
      },
      {
        "original": "who had got burnt,",
        "translation": "やけどをしたり、",
        "speech": "who had got burnt,"
      },
      {
        "original": "and eaten up by wild beasts and other unpleasant things,",
        "translation": "野獣に食べられたり、その他不愉快な目に遭った、",
        "speech": "and eaten up by wild beasts and other unpleasant things,"
      },
      {
        "original": "all because they would not remember the simple rules their",
        "translation": "といういくつかの楽しい小さな物語を読んでいたからで、",
        "speech": "all because they would not remember the simple rules their"
      },
      {
        "original": "friends had taught them:",
        "translation": "友達が彼らに教えたこと：",
        "speech": "friends had taught them:"
      },
      {
        "original": "such as, that a red-hot poker will burn you",
        "translation": "例えば、赤く熱せられた鉄棒は、",
        "speech": "such as, that a red-hot poker will burn you"
      },
      {
        "original": "if you hold it too long;",
        "translation": "長く持っていると火傷をするということ；",
        "speech": "if you hold it too long;"
      },
      {
        "original": "and that if you cut your finger very deeply with a knife,",
        "translation": "そして、ナイフで指を深く切ると、",
        "speech": "and that if you cut your finger very deeply with a knife,"
      },
      {
        "original": "it usually bleeds;",
        "translation": "たいてい出血するということ；",
        "speech": "it usually bleeds;"
      },
      {
        "original": "and she had never forgotten that,",
        "translation": "そして彼女は決して忘れなかった、",
        "speech": "and she had never forgotten that,"
      },
      {
        "original": "if you drink much from a bottle marked “poison,”",
        "translation": "ラベルに「毒」と書かれた瓶から大量に飲むと、",
        "speech": "if you drink much from a bottle marked “poison,”"
      },
      {
        "original": "it is almost certain to disagree with you, sooner or later.",
        "translation": "遅かれ早かれ必ず体によくない影響を受ける、ということを。",
        "speech": "it is almost certain to disagree with you, sooner or later."
      }
    ]
  },
  {
    "original": "However, this bottle was not marked “poison,” so Alice ventured to taste it, and finding it very nice, (it had, in fact, a sort of mixed flavour of cherry-tart, custard, pine-apple, roast turkey, toffee, and hot buttered toast,) she very soon finished it off. “What a curious feeling!” said Alice; “I must be shutting up like a telescope.”",
    "translation": "しかし、この瓶には「毒」とは書かれていなかったので、アリスは思い切って味見をしてみると、とても美味しかった（実際には、チェリータルト、カスタード、パイナップル、ローストターキー、トフィー、熱いバタートーストが混ざったような味がした）ので、彼女はすぐに飲み干してしまった。「なんて不思議な感覚なの！」とアリスは言った。「まるで望遠鏡のように縮んでいくみたい。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "However, this bottle was not marked “poison,”",
        "translation": "しかし、この瓶には「毒」とは書かれていなかったので、",
        "speech": "However, this bottle was not marked “poison,”"
      },
      {
        "original": "so Alice ventured to taste it,",
        "translation": "アリスは思い切って味見してみました。",
        "speech": "so Alice ventured to taste it,"
      },
      {
        "original": "and finding it very nice, (it had,",
        "translation": "そしてとても美味しいことに気づきました、（実際、それは、",
        "speech": "and finding it very nice, (it had,"
      },
      {
        "original": "in fact, a sort of mixed flavour of cherry-tart,",
        "translation": "ある種のチェリータルトの混ざった味がして、",
        "speech": "in fact, a sort of mixed flavour of cherry-tart,"
      },
      {
        "original": "custard, pine-apple, roast turkey, toffee, and hot buttered toast,)",
        "translation": "カスタード、パイナップル、ローストターキー、トフィー、そして熱いバタートースト、",
        "speech": "custard, pine-apple, roast turkey, toffee, and hot buttered toast,)"
      },
      {
        "original": "she very soon finished it off.",
        "translation": "彼女はすぐにそれを全部食べてしまった。",
        "speech": "she very soon finished it off."
      },
      {
        "original": "“What a curious feeling!”",
        "translation": "「なんて変な感じなの！」",
        "speech": "“What a curious feeling!”"
      },
      {
        "original": "said Alice; “I must be shutting up like a telescope.”",
        "translation": "アリスは言った。「望遠鏡みたいに縮んでいってるに違いないわ。」",
        "speech": "said Alice; “I must be shutting up like a telescope.”"
      }
    ]
  },
  {
    "original": "And so it was indeed: she was now only ten inches high, and her face brightened up at the thought that she was now the right size for going through the little door into that lovely garden. First, however, she waited for a few minutes to see if she was going to shrink any further: she felt a little nervous about this; “for it might end, you know,” said Alice to herself, “in my going out altogether, like a candle. I wonder what I should be like then?” And she tried to fancy what the flame of a candle is like after the candle is blown out, for she could not remember ever having seen such a thing.",
    "translation": "そして実際そうでした：彼女は今やわずか十インチの高さになっており、その可愛らしい庭への小さな扉を通るのにちょうどよい大きさになったと思うと、顔が明るくなりました。しかしまず、彼女はさらに小さくなるかどうかを確かめるために数分待ちました：このことについて少し不安を感じていたのです。「だって、結局どうなるかわからないもの」とアリスは自分に言い聞かせました。「まるでろうそくのように、すっかり消えてしまうかもしれない。そうなったら私はどうなるんだろう？」そして彼女は、ろうそくの炎が吹き消された後の様子を想像しようとしましたが、これまでにそんなものを見たことがないので思い出すことができませんでした。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "And so it was indeed:",
        "translation": "そして、それは本当にそうでした：",
        "speech": "And so it was indeed:"
      },
      {
        "original": "she was now only ten inches high,",
        "translation": "彼女は今、わずか十インチの高さになっていました、",
        "speech": "she was now only ten inches high,"
      },
      {
        "original": "and her face brightened up at the thought",
        "translation": "そしてその考えに顔を明るくしました",
        "speech": "and her face brightened up at the thought"
      },
      {
        "original": "that she was now the right size",
        "translation": "自分がちょうど良い大きさになったことを",
        "speech": "that she was now the right size"
      },
      {
        "original": "for going through the little door into that lovely garden.",
        "translation": "その素敵な庭に通じる小さなドアを通るのに。",
        "speech": "for going through the little door into that lovely garden."
      },
      {
        "original": "First, however, she waited for a few minutes",
        "translation": "しかしまず最初に、彼女は数分間待ちました",
        "speech": "First, however, she waited for a few minutes"
      },
      {
        "original": "to see if she was going to shrink any further:",
        "translation": "さらに小さくなるかどうかを見るために：",
        "speech": "to see if she was going to shrink any further:"
      },
      {
        "original": "she felt a little nervous about this;",
        "translation": "これについて少し緊張していました；",
        "speech": "she felt a little nervous about this;"
      },
      {
        "original": "“for it might end, you know,”",
        "translation": "「だって、知っての通り、」",
        "speech": "“for it might end, you know,”"
      },
      {
        "original": "said Alice to herself, “in my going out altogether, like a candle.",
        "translation": "アリスは自分に言いました、「まるでろうそくのように、完全に消えてしまうこともあり得るかもしれない。",
        "speech": "said Alice to herself, “in my going out altogether, like a candle."
      },
      {
        "original": "I wonder what I should be like then?”",
        "translation": "その時、私は一体どうなっているんだろう？」",
        "speech": "I wonder what I should be like then?”"
      },
      {
        "original": "And she tried to fancy what the flame",
        "translation": "そして彼女は、ろうそくの炎を想像しようとしました",
        "speech": "And she tried to fancy what the flame"
      },
      {
        "original": "of a candle is like after the candle is blown out,",
        "translation": "ろうそくが吹き消された後の炎がどんなものか、",
        "speech": "of a candle is like after the candle is blown out,"
      },
      {
        "original": "for she could not remember ever having seen such a thing.",
        "translation": "というのも、彼女はそれを見たことを覚えていなかったからです。",
        "speech": "for she could not remember ever having seen such a thing."
      }
    ]
  },
  {
    "original": "After a while, finding that nothing more happened, she decided on going into the garden at once; but, alas for poor Alice! when she got to the door, she found she had forgotten the little golden key, and when she went back to the table for it, she found she could not possibly reach it: she could see it quite plainly through the glass, and she tried her best to climb up one of the legs of the table, but it was too slippery; and when she had tired herself out with trying, the poor little thing sat down and cried.",
    "translation": "しばらくして、何も起こらないことに気づいた彼女は、すぐに庭に行くことに決めました。しかし、かわいそうなアリスにとっては悲劇です！ 彼女がドアに着くと、小さな金の鍵を忘れてしまったことに気づきました。そして、それを取ろうとテーブルに戻ると、どうしても届かないことがわかりました：鍵はガラス越しにしっかりと見えるのに、彼女はテーブルの足の一つを登ろうと最善を尽くしましたが、とても滑りやすく、努力して疲れ切った後、かわいそうなその小さな子は座って泣いてしまいました。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "After a while, finding that nothing more happened,",
        "translation": "しばらくしても何も起こらないことに気づいたので、",
        "speech": "After a while, finding that nothing more happened,"
      },
      {
        "original": "she decided on going into the garden at once;",
        "translation": "彼女はすぐに庭に行くことに決めました；",
        "speech": "she decided on going into the garden at once;"
      },
      {
        "original": "but, alas for poor Alice!",
        "translation": "しかし、かわいそうなアリスのために悲しいことに！",
        "speech": "but, alas for poor Alice!"
      },
      {
        "original": "when she got to the door,",
        "translation": "彼女がドアまで来たとき、",
        "speech": "when she got to the door,"
      },
      {
        "original": "she found she had forgotten the little golden key,",
        "translation": "小さな金の鍵を忘れてしまっていることに気づき、",
        "speech": "she found she had forgotten the little golden key,"
      },
      {
        "original": "and when she went back to the table for it,",
        "translation": "それを取るためにテーブルに戻ったとき、",
        "speech": "and when she went back to the table for it,"
      },
      {
        "original": "she found she could not possibly reach it:",
        "translation": "どうしても手が届かないことがわかりました：",
        "speech": "she found she could not possibly reach it:"
      },
      {
        "original": "she could see it quite plainly through the glass,",
        "translation": "ガラス越しにはっきりと見ることはできましたが、",
        "speech": "she could see it quite plainly through the glass,"
      },
      {
        "original": "and she tried her best to climb up one",
        "translation": "彼女はテーブルの脚の一本によじ登ろうと一生懸命試みました",
        "speech": "and she tried her best to climb up one"
      },
      {
        "original": "of the legs of the table, but it was too slippery;",
        "translation": "しかし滑りやすすぎました；",
        "speech": "of the legs of the table, but it was too slippery;"
      },
      {
        "original": "and when she had tired herself out with trying,",
        "translation": "試して疲れ果てたとき、",
        "speech": "and when she had tired herself out with trying,"
      },
      {
        "original": "the poor little thing sat down and cried.",
        "translation": "そのかわいそうな小さな女の子は座り込んで泣きました。",
        "speech": "the poor little thing sat down and cried."
      }
    ]
  },
  {
    "original": "“Come, there’s no use in crying like that!” said Alice to herself, rather sharply; “I advise you to leave off this minute!” She generally gave herself very good advice, (though she very seldom followed it), and sometimes she scolded herself so severely as to bring tears into her eyes; and once she remembered trying to box her own ears for having cheated herself in a game of croquet she was playing against herself, for this curious child was very fond of pretending to be two people. “But it’s no use now,” thought poor Alice, “to pretend to be two people! Why, there’s hardly enough of me left to make one respectable person!”",
    "translation": "「さあ、あんなふうに泣いても仕方がないわ！」とアリスは少しきつく自分に言った。「今すぐやめるようにアドバイスするわ！」彼女は普段、自分にとても良い助言をしていた（とはいえ、めったに従わなかったが）、そして時にはあまりにも厳しく自分を叱るので涙ぐむこともあった；そしてかつて、クロッケーのゲームで自分をだましてしまったことで自分の耳を叩こうとしたことを思い出した。この奇妙な子供は二人の人間のふりをするのが大好きだったのだ。「でも、もう無駄よ」とかわいそうなアリスは思った。「二人の人間のふりをするなんて！　いや、まともな一人分にも足りないくらいしか私が残っていないもの！」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Come, there’s no use in crying like that!”",
        "translation": "「さあ、そんなに泣いても仕方がないよ！」",
        "speech": "“Come, there’s no use in crying like that!”"
      },
      {
        "original": "said Alice to herself, rather sharply;",
        "translation": "アリスはかなりきつく、自分自身に言った。",
        "speech": "said Alice to herself, rather sharply;"
      },
      {
        "original": "“I advise you to leave off this minute!”",
        "translation": "「今すぐやめることを勧めるわ！」",
        "speech": "“I advise you to leave off this minute!”"
      },
      {
        "original": "She generally gave herself very good advice,",
        "translation": "彼女は普段、自分にとても良い助言をしていた、",
        "speech": "She generally gave herself very good advice,"
      },
      {
        "original": "(though she very seldom followed it),",
        "translation": "（ただし、それに従うことは滅多になかったが）、",
        "speech": "(though she very seldom followed it),"
      },
      {
        "original": "and sometimes she scolded herself so severely as",
        "translation": "そして時には、自分を叱りすぎて",
        "speech": "and sometimes she scolded herself so severely as"
      },
      {
        "original": "to bring tears into her eyes;",
        "translation": "涙が出ることさえあった。",
        "speech": "to bring tears into her eyes;"
      },
      {
        "original": "and once she remembered trying to box her own ears",
        "translation": "かつて、彼女は自分自身をだましていたクロッケーのゲームで",
        "speech": "and once she remembered trying to box her own ears"
      },
      {
        "original": "for having cheated herself in a game",
        "translation": "自分の耳をたたこうとしたことを思い出したことがある、",
        "speech": "for having cheated herself in a game"
      },
      {
        "original": "of croquet she was playing against herself,",
        "translation": "この奇妙な子は、自分自身と対戦していたのだ、",
        "speech": "of croquet she was playing against herself,"
      },
      {
        "original": "for this curious child was very fond",
        "translation": "なぜなら、この好奇心旺盛な子は",
        "speech": "for this curious child was very fond"
      },
      {
        "original": "of pretending to be two people.",
        "translation": "二人の人間を演じるのが大好きだったからだ。",
        "speech": "of pretending to be two people."
      },
      {
        "original": "“But it’s no use now,” thought poor Alice,",
        "translation": "「でももう無駄だわ」とかわいそうなアリスは思った、",
        "speech": "“But it’s no use now,” thought poor Alice,"
      },
      {
        "original": "“to pretend to be two people!",
        "translation": "「二人の人間を演じても意味がないわ！」",
        "speech": "“to pretend to be two people!"
      },
      {
        "original": "Why, there’s hardly enough of me left to make one respectable person!”",
        "translation": "「だって、今の私には、一人の立派な人間を作るのに",
        "speech": "Why, there’s hardly enough of me left to make one respectable person!”"
      }
    ]
  },
  {
    "original": "Soon her eye fell on a little glass box that was lying under the table: she opened it, and found in it a very small cake, on which the words “EAT ME” were beautifully marked in currants. “Well, I’ll eat it,” said Alice, “and if it makes me grow larger, I can reach the key; and if it makes me grow smaller, I can creep under the door; so either way I’ll get into the garden, and I don’t care which happens!”",
    "translation": "すぐに彼女の目はテーブルの下に置かれた小さなガラスの箱に留まりました。彼女はそれを開けると、そこにはとても小さなケーキが入っていて、「EAT ME」という言葉が美しくカランツで書かれていました。「よし、食べてみよう」とアリスは言いました。「それで大きくなったら鍵に手が届くし、小さくなったらドアの下をくぐれる。どちらにしても庭に入れるし、どちらが起きるか気にしないわ！」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Soon her eye fell on a little glass box",
        "translation": "すぐに彼女の目は小さなガラスの箱に留まりました",
        "speech": "Soon her eye fell on a little glass box"
      },
      {
        "original": "that was lying under the table:",
        "translation": "それはテーブルの下に置かれていました:",
        "speech": "that was lying under the table:"
      },
      {
        "original": "she opened it, and found in it a very small cake,",
        "translation": "彼女はそれを開け、中にはとても小さなケーキが入っていて、",
        "speech": "she opened it, and found in it a very small cake,"
      },
      {
        "original": "on which the words “EAT ME” were beautifully marked in currants.",
        "translation": "そのケーキには「食べて」とカランツで美しく書かれていました。",
        "speech": "on which the words “EAT ME” were beautifully marked in currants."
      },
      {
        "original": "“Well, I’ll eat it,” said Alice,",
        "translation": "「よし、食べてみよう」とアリスは言いました、",
        "speech": "“Well, I’ll eat it,” said Alice,"
      },
      {
        "original": "“and if it makes me grow larger, I can reach the key;",
        "translation": "「もしこれで大きくなったら、鍵に届くし、",
        "speech": "“and if it makes me grow larger, I can reach the key;"
      },
      {
        "original": "and if it makes me grow smaller,",
        "translation": "もし小さくなったら、",
        "speech": "and if it makes me grow smaller,"
      },
      {
        "original": "I can creep under the door;",
        "translation": "ドアの下をくぐれるわ;",
        "speech": "I can creep under the door;"
      },
      {
        "original": "so either way I’ll get into the garden,",
        "translation": "だからどちらにしても庭に入れるわ、",
        "speech": "so either way I’ll get into the garden,"
      },
      {
        "original": "and I don’t care which happens!”",
        "translation": "どちらが起きても気にしないわ！」",
        "speech": "and I don’t care which happens!”"
      }
    ]
  },
  {
    "original": "She ate a little bit, and said anxiously to herself, “Which way? Which way?”, holding her hand on the top of her head to feel which way it was growing, and she was quite surprised to find that she remained the same size: to be sure, this generally happens when one eats cake, but Alice had got so much into the way of expecting nothing but out-of-the-way things to happen, that it seemed quite dull and stupid for life to go on in the common way. So she set to work, and very soon finished off the cake.",
    "translation": "彼女は少しだけ食べて、不安そうに自分自身に向かって「どっちだろう？どっちだろう？」と言いながら、頭の上に手を置いてどちらの方向に伸びているのかを確かめ、そして自分が同じ大きさのままであることにかなり驚きました。確かに、これは普通ケーキを食べるときに起こることですが、アリスは珍しいことだけが起こるものだと期待することにすっかり慣れていたので、人生が普通のやり方で進むのは非常につまらなく馬鹿げているように思えました。そこで彼女は作業に取りかかり、すぐにケーキを食べ終えました。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "She ate a little bit, and said anxiously to herself, “Which way?",
        "translation": "彼女は少し食べて、不安そうに自分自身に言いました。「どっちの方向？」",
        "speech": "She ate a little bit, and said anxiously to herself, “Which way?"
      },
      {
        "original": "Which way?”, holding her hand on the top",
        "translation": "「どっちの方向？」と、頭のてっぺんに手を置いて",
        "speech": "Which way?”, holding her hand on the top"
      },
      {
        "original": "of her head to feel which way it was growing,",
        "translation": "どの方向に伸びているのか確かめながら、",
        "speech": "of her head to feel which way it was growing,"
      },
      {
        "original": "and she was quite surprised to find",
        "translation": "そして、まったく驚いたことに",
        "speech": "and she was quite surprised to find"
      },
      {
        "original": "that she remained the same size:",
        "translation": "大きさが変わっていないことに気づきました：",
        "speech": "that she remained the same size:"
      },
      {
        "original": "to be sure, this generally happens when one eats cake,",
        "translation": "確かに、これは一般的にケーキを食べると起きることですが、",
        "speech": "to be sure, this generally happens when one eats cake,"
      },
      {
        "original": "but Alice had got so much into the way",
        "translation": "アリスは、予想外のことしか起こらないと考えることに",
        "speech": "but Alice had got so much into the way"
      },
      {
        "original": "of expecting nothing but out-of-the-way things to happen,",
        "speech": "of expecting nothing but out-of-the-way things to happen,",
        "translation": "すっかり慣れてしまっていたので、"
      },
      {
        "original": "that it seemed quite dull and stupid",
        "speech": "that it seemed quite dull and stupid",
        "translation": "日常通りに物事が進むのは"
      },
      {
        "original": "for life to go on in the common way.",
        "speech": "for life to go on in the common way.",
        "translation": "とても退屈で馬鹿げているように感じました。"
      },
      {
        "original": "So she set to work, and very soon finished off the cake.",
        "speech": "So she set to work, and very soon finished off the cake.",
        "translation": "それで、彼女は作業に取りかかり、すぐにケーキを食べ終えました。"
      }
    ]
  }
]

const work = {
  "id": "lit_en_alice_rabbit_hole",
  "excerpt": "Chapter I: Down the Rabbit-Hole・第1章全文",
  "coverage": {
    "unitType": "chapter",
    "label": "第1章全文",
    "sourceUnit": "Chapter I: Down the Rabbit-Hole",
    "complete": true,
    "sourceWordCount": 2162,
    "maxWordTarget": 5000,
    "limitNote": "長編のため、5,000語以内で完結する第1章を全文収録",
    "startMarker": "Alice was beginning to get very tired of sitting by her sister on the bank, and ",
    "endMarker": "stupid for life to go on in the common way. So she set to work, and very soon finished off the cake.",
    "sourceSha256": "d372af777f1f642fdfebfae6eee4aab8158ab8dc838eca2048bd65fa1583eb34",
    "checkedOn": "2026-08-27"
  }
}

export default deepFreeze({ ...work, scenes })
