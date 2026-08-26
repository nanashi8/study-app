// 『賢者の贈り物』短編全文の後半。
const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  Object.values(value).forEach(deepFreeze)
  return Object.freeze(value)
}

export default deepFreeze([
  {
    "original": "“If Jim doesn’t kill me,” she said to herself, “before he takes a second look at me, he’ll say I look like a Coney Island chorus girl. But what could I do — oh! what could I do with a dollar and eighty-seven cents?” At 7 o’clock the coffee was made and the frying-pan was on the back of the stove hot and ready to cook the chops.",
    "translation": "「もしジムが私を殺さなければ」と彼女は独り言を言った。「彼が私をもう一度見直す前に、きっと私がコニーアイランドのコーラスガールのようだと言うだろう。でも、私はどうすればいいの？ああ、1ドル87セントしかないのに、私はどうすればいいの？」7時にはコーヒーができ、フライパンはストーブの後ろで熱くなっていて、チョップを料理する準備ができていた。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“If Jim doesn’t kill me,” she said to herself,",
        "translation": "「もしジムが私を殺さなければ」と彼女は自分に言った、",
        "speech": "“If Jim doesn’t kill me,” she said to herself,"
      },
      {
        "original": "“before he takes a second look at me,",
        "translation": "「彼が私をもう一度見つめる前に、",
        "speech": "“before he takes a second look at me,"
      },
      {
        "original": "he’ll say I look like a Coney Island chorus girl.",
        "translation": "彼は私がコニーアイランドのコーラスガールのようだと言うだろう。",
        "speech": "he’ll say I look like a Coney Island chorus girl."
      },
      {
        "original": "But what could I do — oh!",
        "translation": "でも、私はどうすればいいの—ああ！",
        "speech": "But what could I do — oh!"
      },
      {
        "original": "what could I do with a dollar and eighty-seven cents?”",
        "translation": "1ドル87セントで、私は何ができるだろう？」",
        "speech": "what could I do with a dollar and eighty-seven cents?”"
      },
      {
        "original": "At 7 o’clock the coffee was made",
        "translation": "7時にコーヒーは入れられ、",
        "speech": "At 7 o’clock the coffee was made"
      },
      {
        "original": "and the frying-pan was on the back",
        "translation": "フライパンは",
        "speech": "and the frying-pan was on the back"
      },
      {
        "original": "of the stove hot and ready to cook the chops.",
        "translation": "ストーブの後ろで熱くなり、チョップを料理する準備ができていた。",
        "speech": "of the stove hot and ready to cook the chops."
      }
    ]
  },
  {
    "original": "Jim was never late. Della doubled the fob chain in her hand and sat on the corner of the table near the door that he always entered. Then she heard his step on the stair away down on the first flight, and she turned white for just a moment. She had a habit of saying a little silent prayer about the simplest everyday things, and now she whispered: “Please God, make him think I am still pretty.” The door opened and Jim stepped in and closed it. He looked thin and very serious. Poor fellow, he was only twenty-two — and to be burdened with a family! He needed a new overcoat and he was without gloves.",
    "translation": "ジムは決して遅れることはなかった。デラは懐中時計の鎖を手の中で二重にして、彼がいつも入ってくるドアの近くのテーブルの角に座った。そして彼の足音が一階の階段を上がってくるのを聞くと、彼女は一瞬真っ白になった。彼女には日常の些細なことについて小さな心の中で祈る習慣があり、今、彼女はささやいた。「どうか神様、彼に私はまだきれいだと思わせてください。」ドアが開き、ジムが入ってきて閉めた。彼は痩せていて、とても真剣な表情をしていた。かわいそうに、彼はまだ二十二歳で、しかも家族という重荷を背負っている。新しいオーバーコートが必要で、手袋も持っていなかった。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Jim was never late.",
        "translation": "ジムは決して遅刻しなかった。",
        "speech": "Jim was never late."
      },
      {
        "original": "Della doubled the fob chain in her hand",
        "translation": "デラはオーバルチェーンを手で二重に握り",
        "speech": "Della doubled the fob chain in her hand"
      },
      {
        "original": "and sat on the corner",
        "translation": "ドアの近くの",
        "speech": "and sat on the corner"
      },
      {
        "original": "of the table near the door that he always entered.",
        "translation": "いつもジムが入るテーブルの角に座った。",
        "speech": "of the table near the door that he always entered."
      },
      {
        "original": "Then she heard his step on the stair away down",
        "translation": "すると、彼女は一階の階段で彼の足音を聞き、",
        "speech": "Then she heard his step on the stair away down"
      },
      {
        "original": "on the first flight, and she turned white for just a moment.",
        "translation": "ほんの一瞬、顔が青ざめた。",
        "speech": "on the first flight, and she turned white for just a moment."
      },
      {
        "original": "She had a habit",
        "translation": "彼女は習慣として",
        "speech": "She had a habit"
      },
      {
        "original": "of saying a little silent prayer about the simplest everyday things,",
        "translation": "日常の些細なことについて小さな心の中の祈りを唱えることがあった、",
        "speech": "of saying a little silent prayer about the simplest everyday things,"
      },
      {
        "original": "and now she whispered:",
        "translation": "そして今、ささやいた：",
        "speech": "and now she whispered:"
      },
      {
        "original": "“Please God, make him think I am still pretty.”",
        "translation": "「神様、私がまだきれいだと思わせてください。」",
        "speech": "“Please God, make him think I am still pretty.”"
      },
      {
        "original": "The door opened and Jim stepped in and closed it.",
        "translation": "ドアが開き、ジムが入って閉めた。",
        "speech": "The door opened and Jim stepped in and closed it."
      },
      {
        "original": "He looked thin and very serious.",
        "translation": "彼は痩せてとても真剣な顔をしていた。",
        "speech": "He looked thin and very serious."
      },
      {
        "original": "Poor fellow, he was only twenty-two —",
        "translation": "可哀想に、彼はまだ二十二歳だった —",
        "speech": "Poor fellow, he was only twenty-two —"
      },
      {
        "original": "and to be burdened with a family!",
        "translation": "そして家族を背負わなければならないなんて！",
        "speech": "and to be burdened with a family!"
      },
      {
        "original": "He needed a new overcoat and he was without gloves.",
        "translation": "彼は新しいオーバーコートが必要で、手袋も持っていなかった。",
        "speech": "He needed a new overcoat and he was without gloves."
      }
    ]
  },
  {
    "original": "Jim stopped inside the door, as immovable as a setter at the scent of quail. His eyes were fixed upon Della, and there was an expression in them that she could not read, and it terrified her. It was not anger, nor surprise, nor disapproval, nor horror, nor any of the sentiments that she had been prepared for. He simply stared at her fixedly with that peculiar expression on his face. Della wriggled off the table and went for him.",
    "translation": "ジムはドアの内側で立ち止まり、まるでウズラの匂いを嗅ぎつけたセッターのように微動だにしなかった。彼の目はデラに釘付けで、そこには彼女には読み取れない表情があり、それが彼女を恐れさせた。それは怒りでも、驚きでも、不賛成でも、恐怖でも、彼女が予想していたどの感情でもなかった。彼はただ特有の表情でデラをじっと見つめているだけだった。デラはテーブルから身をよじって彼のもとに向かった。",
    "guide": "出来事が起きた順に、人物・場所・動作を結びつけて読みます。",
    "narrationSegments": [
      {
        "original": "Jim stopped inside the door,",
        "translation": "ジムはドアの内側で立ち止まった、",
        "speech": "Jim stopped inside the door,"
      },
      {
        "original": "as immovable as a setter at the scent of quail.",
        "translation": "まるでウズラの匂いを嗅いだセッター犬のように動けずに。",
        "speech": "as immovable as a setter at the scent of quail."
      },
      {
        "original": "His eyes were fixed upon Della,",
        "translation": "彼の目はデラに釘付けで、",
        "speech": "His eyes were fixed upon Della,"
      },
      {
        "original": "and there was an expression in them that she could not read,",
        "translation": "彼女には読み取れない表情がそこにあり、",
        "speech": "and there was an expression in them that she could not read,"
      },
      {
        "original": "and it terrified her.",
        "translation": "それが彼女を怖がらせた。",
        "speech": "and it terrified her."
      },
      {
        "original": "It was not anger, nor surprise, nor disapproval,",
        "translation": "それは怒りでも、驚きでも、非難でも、",
        "speech": "It was not anger, nor surprise, nor disapproval,"
      },
      {
        "original": "nor horror, nor any of the sentiments",
        "translation": "恐怖でも、彼女が予想していたような",
        "speech": "nor horror, nor any of the sentiments"
      },
      {
        "original": "that she had been prepared for.",
        "translation": "どの感情でもなかった。",
        "speech": "that she had been prepared for."
      },
      {
        "original": "He simply stared at her fixedly with",
        "translation": "ただ、彼はあの独特の表情を浮かべながら",
        "speech": "He simply stared at her fixedly with"
      },
      {
        "original": "that peculiar expression on his face.",
        "translation": "じっと彼女を見つめていた。",
        "speech": "that peculiar expression on his face."
      },
      {
        "original": "Della wriggled off the table and went for him.",
        "translation": "デラはテーブルから身をよじって彼に向かった。",
        "speech": "Della wriggled off the table and went for him."
      }
    ]
  },
  {
    "original": "“Jim, darling,” she cried, “don’t look at me that way. I had my hair cut off and sold because I couldn’t have lived through Christmas without giving you a present. It’ll grow out again — you won’t mind, will you? I just had to do it. My hair grows awfully fast. Say ‘Merry Christmas!’ Jim, and let’s be happy. You don’t know what a nice — what a beautiful, nice gift I’ve got for you.” “You’ve cut off your hair?” asked Jim, laboriously, as if he had not arrived at that patent fact yet even after the hardest mental labor.",
    "translation": "「ジム、ダーリン」彼女は叫んだ。「そんな風に私を見ないで。クリスマスを無事に過ごすにはあなたにプレゼントをあげずにいられなかったから、髪を切って売ったの。すぐにまた伸びるわ — 気にしないでくれるでしょ？どうしてもそうしなきゃいけなかったの。私の髪はものすごく早く伸びるの。『メリークリスマス！』って言って、ジム、一緒に幸せになろうよ。あなたにはどんなに素敵で — どんなに美しい、素敵なプレゼントを用意したか、わからないでしょ。」 「髪を切ったのか？」ジムは、まるでその明らかな事実に、最も困難な思考作業を重ねてもまだ到達していないかのように、苦労して尋ねた。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Jim, darling,” she cried, “don’t look at me that way.",
        "translation": "「ジム、ダーリン」と彼女は叫んだ。「そんなふうに私を見ないで。」",
        "speech": "“Jim, darling,” she cried, “don’t look at me that way."
      },
      {
        "original": "I had my hair cut off and sold",
        "translation": "私は髪を切って売ったのよ",
        "speech": "I had my hair cut off and sold"
      },
      {
        "original": "because I couldn’t have lived through Christmas without giving you a present.",
        "translation": "クリスマスを迎えるのにプレゼントをあげずに過ごせなかったから。",
        "speech": "because I couldn’t have lived through Christmas without giving you a present."
      },
      {
        "original": "It’ll grow out again — you won’t mind, will you?",
        "translation": "また伸びるわ — 気にしないでくれるわよね？」",
        "speech": "It’ll grow out again — you won’t mind, will you?"
      },
      {
        "original": "I just had to do it.",
        "translation": "私はどうしてもそうしなければならなかったの。",
        "speech": "I just had to do it."
      },
      {
        "original": "My hair grows awfully fast.",
        "translation": "私の髪はとても早く伸びるのよ。",
        "speech": "My hair grows awfully fast."
      },
      {
        "original": "Say ‘Merry Christmas!’",
        "translation": "『メリークリスマス！』って言ってね",
        "speech": "Say ‘Merry Christmas!’"
      },
      {
        "original": "Jim, and let’s be happy.",
        "translation": "ジム、そして幸せになろう。",
        "speech": "Jim, and let’s be happy."
      },
      {
        "original": "You don’t know what a nice —",
        "translation": "君は知らないでしょう、どんなに素敵な —",
        "speech": "You don’t know what a nice —"
      },
      {
        "original": "what a beautiful, nice gift I’ve got for you.”",
        "translation": "どんなに美しくて素晴らしい贈り物を用意したか。」",
        "speech": "what a beautiful, nice gift I’ve got for you.”"
      },
      {
        "original": "“You’ve cut off your hair?”",
        "translation": "「髪を切ったのか？」",
        "speech": "“You’ve cut off your hair?”"
      },
      {
        "original": "asked Jim, laboriously,",
        "translation": "とジムは、苦労しながら尋ねた、",
        "speech": "asked Jim, laboriously,"
      },
      {
        "original": "as if he had not arrived at",
        "translation": "まるで彼がその明らかな事実に、",
        "speech": "as if he had not arrived at"
      },
      {
        "original": "that patent fact yet even after the hardest mental labor.",
        "translation": "最も困難な精神的努力をしてもまだ到達していないかのように。",
        "speech": "that patent fact yet even after the hardest mental labor."
      }
    ]
  },
  {
    "original": "“Cut it off and sold it,” said Della. “Don’t you like me just as well, anyhow? I’m me without my hair, ain’t I?” Jim looked about the room curiously. “You say your hair is gone?” he said, with an air almost of idiocy. “You needn’t look for it,” said Della. “It’s sold, I tell you — sold and gone, too. It’s Christmas Eve, boy. Be good to me, for it went for you. Maybe the hairs of my head were numbered,” she went on with sudden serious sweetness, “but nobody could ever count my love for you. Shall I put the chops on, Jim?”",
    "translation": "「切って売ったのよ」とデラは言った。「それでも私のこと、嫌いになったりしないでしょ？髪がなくても私は私よね？」ジムは好奇心いっぱいに部屋を見回した。「君、髪を切ったって言うのか？」と、ほとんどばかみたいな感じで言った。「探す必要なんてないわ」とデラは言った。「もう売ったの、売って、なくなっちゃったの。クリスマス・イブなんだからね。私に優しくしてね、あなたのために売ったんだもの。もしかしたら私の頭の髪は数えられるかもしれないけど」と急に真剣で甘い声で続けた。「でもあなたへの愛は誰にも数えられないわ。ジム、チョップを焼こうか？」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Cut it off and sold it,” said Della.",
        "translation": "「切って売ったのよ」とデラは言った。",
        "speech": "“Cut it off and sold it,” said Della."
      },
      {
        "original": "“Don’t you like me just as well, anyhow?",
        "translation": "「それでも私のこと好きじゃないの？」",
        "speech": "“Don’t you like me just as well, anyhow?"
      },
      {
        "original": "I’m me without my hair, ain’t I?”",
        "translation": "「髪がなくても、私は私でしょ？」",
        "speech": "I’m me without my hair, ain’t I?”"
      },
      {
        "original": "Jim looked about the room curiously.",
        "translation": "ジムは部屋を好奇心いっぱいに見回した。",
        "speech": "Jim looked about the room curiously."
      },
      {
        "original": "“You say your hair is gone?”",
        "translation": "「髪がなくなったって言うのか？」",
        "speech": "“You say your hair is gone?”"
      },
      {
        "original": "he said, with an air almost of idiocy.",
        "translation": "と、彼はほとんど馬鹿げた様子で言った。",
        "speech": "he said, with an air almost of idiocy."
      },
      {
        "original": "“You needn’t look for it,” said Della.",
        "translation": "「探す必要ないわ」とデラは言った。",
        "speech": "“You needn’t look for it,” said Della."
      },
      {
        "original": "“It’s sold, I tell you — sold and gone, too.",
        "translation": "「売ったのよ、言ってるでしょ—売ってなくなったの。",
        "speech": "“It’s sold, I tell you — sold and gone, too."
      },
      {
        "original": "It’s Christmas Eve, boy.",
        "translation": "今日はクリスマスイブなのよ、坊や。",
        "speech": "It’s Christmas Eve, boy."
      },
      {
        "original": "Be good to me, for it went for you.",
        "translation": "私のために優しくしてね、それはあなたのためにしたことだから。",
        "speech": "Be good to me, for it went for you."
      },
      {
        "original": "Maybe the hairs of my head were numbered,”",
        "translation": "もしかしたら私の髪の毛の本数は数えられるかもしれないけど、",
        "speech": "Maybe the hairs of my head were numbered,”"
      },
      {
        "original": "she went on with sudden serious sweetness,",
        "translation": "と、彼女は突然の真剣な優しさで続けた。",
        "speech": "she went on with sudden serious sweetness,"
      },
      {
        "original": "“but nobody could ever count my love for you.",
        "translation": "誰も私のあなたへの愛を数えることはできないわ。",
        "speech": "“but nobody could ever count my love for you."
      },
      {
        "original": "Shall I put the chops on, Jim?”",
        "translation": "ジム、チョップを火にかけようか？」",
        "speech": "Shall I put the chops on, Jim?”"
      }
    ]
  },
  {
    "original": "Out of his trance Jim seemed quickly to wake. He enfolded his Della. For ten seconds let us regard with discreet scrutiny some inconsequential object in the other direction. Eight dollars a week or a million a year — what is the difference? A mathematician or a wit would give you the wrong answer. The magi brought valuable gifts, but that was not among them. This dark assertion will be illuminated later on. Jim drew a package from his overcoat pocket and threw it upon the table.",
    "translation": "ジムは恍惚状態から抜け出すと、すぐに覚醒したようだった。彼はデラを抱きしめた。ここで十秒ほど、別の方向にある取るに足らない物を慎重に観察してみよう。一週間に八ドル、一年に百万ドル—何の違いがあるだろうか？数学者や知識人であれば、間違った答えを教えるだろう。東方の三博士は貴重な贈り物を持ってきたが、それは含まれていなかった。この暗い主張は後に明らかにされるだろう。ジムはオーバーコートのポケットから包みを取り出し、テーブルに投げ置いた。",
    "guide": "逆接の前後で、人物の考えや場面がどう変わるかを比べます。",
    "narrationSegments": [
      {
        "original": "Out of his trance Jim seemed quickly to wake.",
        "translation": "ジムは夢見心地からすぐに目を覚ましたようだった。",
        "speech": "Out of his trance Jim seemed quickly to wake."
      },
      {
        "original": "He enfolded his Della.",
        "translation": "彼はデラを抱きしめた。",
        "speech": "He enfolded his Della."
      },
      {
        "original": "For ten seconds let us regard",
        "translation": "十秒間、その姿を見つめてみよう。",
        "speech": "For ten seconds let us regard"
      },
      {
        "original": "with discreet scrutiny some inconsequential object in the other direction.",
        "translation": "慎重に観察すると、他の方向にある取るに足らない物体。",
        "speech": "with discreet scrutiny some inconsequential object in the other direction."
      },
      {
        "original": "Eight dollars a week or a million a year —",
        "translation": "週に8ドルでも、年に100万ドルでも—",
        "speech": "Eight dollars a week or a million a year —"
      },
      {
        "original": "what is the difference?",
        "translation": "違いは何だろう？",
        "speech": "what is the difference?"
      },
      {
        "original": "A mathematician or a wit would give you the wrong answer.",
        "translation": "数学者や機知に富んだ人は、あなたに間違った答えを教えるだろう。",
        "speech": "A mathematician or a wit would give you the wrong answer."
      },
      {
        "original": "The magi brought valuable gifts, but that was not among them.",
        "translation": "三博士は貴重な贈り物を持ってきたが、それはその中にはなかった。",
        "speech": "The magi brought valuable gifts, but that was not among them."
      },
      {
        "original": "This dark assertion will be illuminated later on.",
        "translation": "この暗い主張は後で明らかにされるだろう。",
        "speech": "This dark assertion will be illuminated later on."
      },
      {
        "original": "Jim drew a package from his overcoat pocket",
        "translation": "ジムはオーバーコートのポケットから包みを取り出し、",
        "speech": "Jim drew a package from his overcoat pocket"
      },
      {
        "original": "and threw it upon the table.",
        "speech": "and threw it upon the table.",
        "translation": "テーブルの上に投げた。"
      }
    ]
  },
  {
    "original": "“Don’t make any mistake, Dell,” he said, “about me. I don’t think there’s anything in the way of a haircut or a shave or a shampoo that could make me like my girl any less. But if you’ll unwrap that package you may see why you had me going a while at first.” White fingers and nimble tore at the string and paper. And then an ecstatic scream of joy; and then, alas! a quick feminine change to hysterical tears and wails, necessitating the immediate employment of all the comforting powers of the lord of the flat.",
    "translation": "「間違えないでくれ、デル」と彼は言った。「俺のことについてだ。髪を切ったり、ひげをそったり、シャンプーしたりしても、俺が女の子を好きでなくなるなんてことはないと思う。でも、もし君がその包みを開けてくれれば、最初のうちはなぜ俺を惑わせたのかがわかるかもしれない」白い指が器用に紐と紙を裂いた。そして、歓喜の雄叫びが上がった。だが、ああ！すぐに女性らしい激しい涙と泣き叫びに変わり、フラットの主の慰めの力をすべて駆使することが必要になった。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Don’t make any mistake, Dell,” he said, “about me.",
        "translation": "「俺について、間違えないでくれ、デル」と彼は言った。",
        "speech": "“Don’t make any mistake, Dell,” he said, “about me."
      },
      {
        "original": "I don’t think there’s anything in the way",
        "translation": "「髪を切ることや髭を剃ること、シャンプーのことで",
        "speech": "I don’t think there’s anything in the way"
      },
      {
        "original": "of a haircut or a shave or a shampoo",
        "translation": "妨げになるものはないと思う」",
        "speech": "of a haircut or a shave or a shampoo"
      },
      {
        "original": "that could make me like my girl any less.",
        "translation": "それが私の彼女を以前ほど好きではなくなる原因にはならないでしょう。",
        "speech": "that could make me like my girl any less."
      },
      {
        "original": "But if you’ll unwrap",
        "translation": "でも、もしあなたがその",
        "speech": "But if you’ll unwrap"
      },
      {
        "original": "that package you may see why you had me going a",
        "translation": "パッケージを開ければ、なぜ私をこんなに翻弄させたのかがわかるかもしれません",
        "speech": "that package you may see why you had me going a"
      },
      {
        "original": "while at first.”",
        "translation": "最初のうちは。",
        "speech": "while at first.”"
      },
      {
        "original": "White fingers and nimble tore at the string and paper.",
        "translation": "白い指と器用な手が紐や紙を裂いた。",
        "speech": "White fingers and nimble tore at the string and paper."
      },
      {
        "original": "And then an ecstatic scream of joy; and then, alas!",
        "speech": "And then an ecstatic scream of joy; and then, alas!",
        "translation": "そして次に、歓喜の絶叫があり；そして、ああ！"
      },
      {
        "original": "a quick feminine change to hysterical tears and wails,",
        "speech": "a quick feminine change to hysterical tears and wails,",
        "translation": "素早く女性特有の変化が起こり、ヒステリックな涙と泣き声に変わった、"
      },
      {
        "original": "necessitating the immediate employment of all the comforting powers",
        "speech": "necessitating the immediate employment of all the comforting powers",
        "translation": "これは賃貸マンションの主人のあらゆる慰めの力を"
      },
      {
        "original": "of the lord of the flat.",
        "speech": "of the lord of the flat.",
        "translation": "直ちに使わざるを得ないものであった。"
      }
    ]
  },
  {
    "original": "For there lay The Combs — the set of combs, side and back, that Della had worshipped long in a Broadway window. Beautiful combs, pure tortoise shell, with jewelled rims — just the shade to wear in the beautiful vanished hair. They were expensive combs, she knew, and her heart had simply craved and yearned over them without the least hope of possession. And now, they were hers, but the tresses that should have adorned the coveted adornments were gone. But she hugged them to her bosom, and at length she was able to look up with dim eyes and a smile and say: “My hair grows so fast, Jim!”",
    "translation": "そこにあったのはコームだった――サイド用とバック用のセットで、デラが長い間ブロードウェイのウィンドウで崇拝していたものだ。美しいコーム、純粋なべっ甲製で、縁には宝石がはめられており――美しいかつての髪にぴったりの色合いだった。高価なコームであることは彼女も知っていたし、心はただ手に入れる望みもなく貪り憧れていたのだった。そして今、それは彼女のものとなった。しかし、その豪華な装飾を飾るはずの髪はもうなかった。それでも彼女はそれを胸に抱き、とにかくかすかな涙目で微笑み、こう言うことができた。「私の髪、すごく早く伸びるのよ、ジム！」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "For there lay The Combs —",
        "translation": "そこに櫛があった——",
        "speech": "For there lay The Combs —"
      },
      {
        "original": "the set of combs, side and back,",
        "translation": "横用と後用の一揃いの櫛、",
        "speech": "the set of combs, side and back,"
      },
      {
        "original": "that Della had worshipped long in a Broadway window.",
        "translation": "デラがブロードウェイのウィンドウで長い間崇拝していた櫛。",
        "speech": "that Della had worshipped long in a Broadway window."
      },
      {
        "original": "Beautiful combs, pure tortoise shell, with jewelled rims —",
        "translation": "美しい櫛、純粋なべっ甲で、宝石の縁取りがあり——",
        "speech": "Beautiful combs, pure tortoise shell, with jewelled rims —"
      },
      {
        "original": "just the shade to wear in the beautiful vanished hair.",
        "translation": "かつて美しかった髪にぴったりの色合い。",
        "speech": "just the shade to wear in the beautiful vanished hair."
      },
      {
        "original": "They were expensive combs, she knew,",
        "translation": "高価な櫛だと、彼女は知っていた、",
        "speech": "They were expensive combs, she knew,"
      },
      {
        "original": "and her heart had simply craved",
        "translation": "そして心はただその櫛を強く欲し、",
        "speech": "and her heart had simply craved"
      },
      {
        "original": "and yearned over them without the least hope of possession.",
        "translation": "所有の望みなどまったくないまま憧れていた。",
        "speech": "and yearned over them without the least hope of possession."
      },
      {
        "original": "And now, they were hers,",
        "translation": "そして今、それは彼女のものだった、",
        "speech": "And now, they were hers,"
      },
      {
        "original": "but the tresses that should have adorned the coveted adornments were gone.",
        "translation": "しかし望んでいた装飾を飾るべき髪は失われていた。",
        "speech": "but the tresses that should have adorned the coveted adornments were gone."
      },
      {
        "original": "But she hugged them to her bosom,",
        "translation": "それでも彼女は櫛を胸に抱き、",
        "speech": "But she hugged them to her bosom,"
      },
      {
        "original": "and at length she was able to look up",
        "translation": "やがて彼女は見上げることができた",
        "speech": "and at length she was able to look up"
      },
      {
        "original": "with dim eyes and a smile and say:",
        "translation": "かすんだ目と笑顔でこう言った：",
        "speech": "with dim eyes and a smile and say:"
      },
      {
        "original": "“My hair grows so fast, Jim!”",
        "translation": "「私の髪、すごく早く伸びてるのよ、ジム！」",
        "speech": "“My hair grows so fast, Jim!”"
      }
    ]
  },
  {
    "original": "And then Della leaped up like a little singed cat and cried, “Oh, oh!” Jim had not yet seen his beautiful present. She held it out to him eagerly upon her open palm. The dull precious metal seemed to flash with a reflection of her bright and ardent spirit. “Isn’t it a dandy, Jim? I hunted all over town to find it. You’ll have to look at the time a hundred times a day now. Give me your watch. I want to see how it looks on it.”",
    "translation": "そしてデラは、まるで少し焼けた小さな猫のように跳び上がって、『ああ、ああ！』と叫びました。ジムはまだ彼の美しい贈り物を見ていませんでした。デラはそれを意欲的に手のひらにのせて差し出しました。その鈍い貴金属は、彼女の明るく熱烈な精神を反射するかのように輝いているように見えました。『素晴らしいでしょう、ジム？街中を探し回ってこれを見つけたのよ。これからは一日に何度も時間を見なきゃね。時計ちょうだい。その上でどう見えるか見たいの。』",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "And then Della leaped up like a little singed cat and cried,",
        "translation": "そしてデラは少し焼けた小さな猫のように跳び上がって叫んだ、",
        "speech": "And then Della leaped up like a little singed cat and cried,"
      },
      {
        "original": "“Oh, oh!” Jim had not yet seen his beautiful present.",
        "translation": "「ああ、ああ！」ジムはまだ彼の美しい贈り物を見ていなかった。",
        "speech": "“Oh, oh!” Jim had not yet seen his beautiful present."
      },
      {
        "original": "She held it out to him eagerly upon her open palm.",
        "translation": "彼女はそれを開いた手のひらに熱心に差し出した。",
        "speech": "She held it out to him eagerly upon her open palm."
      },
      {
        "original": "The dull precious metal seemed to flash",
        "translation": "鈍い貴金属が",
        "speech": "The dull precious metal seemed to flash"
      },
      {
        "original": "with a reflection of her bright and ardent spirit.",
        "translation": "彼女の明るく熱心な魂を映す光で輝いているように見えた。",
        "speech": "with a reflection of her bright and ardent spirit."
      },
      {
        "original": "“Isn’t it a dandy, Jim?",
        "translation": "「素敵でしょ、ジム？",
        "speech": "“Isn’t it a dandy, Jim?"
      },
      {
        "original": "I hunted all over town to find it.",
        "translation": "町中を探し回って見つけたのよ。",
        "speech": "I hunted all over town to find it."
      },
      {
        "original": "You’ll have to look",
        "translation": "これからは何百回も",
        "speech": "You’ll have to look"
      },
      {
        "original": "at the time a hundred times a day now.",
        "translation": "毎日時間を見ることになるわね。",
        "speech": "at the time a hundred times a day now."
      },
      {
        "original": "Give me your watch.",
        "translation": "時計を見せて。",
        "speech": "Give me your watch."
      },
      {
        "original": "I want to see how it looks on it.”",
        "translation": "どんなふうに見えるか知りたいの。」",
        "speech": "I want to see how it looks on it.”"
      }
    ]
  },
  {
    "original": "Instead of obeying, Jim tumbled down on the couch and put his hands under the back of his head and smiled. “Dell,” said he, “let’s put our Christmas presents away and keep ’em a while. They’re too nice to use just at present. I sold the watch to get the money to buy your combs. And now suppose you put the chops on.”",
    "translation": "従う代わりに、ジムはソファにドサリと倒れ込み、両手を頭の後ろに置いて微笑んだ。「デル」と彼は言った。「クリスマスプレゼントをしまっておいて、しばらくそのままにしておこう。今すぐ使うには良すぎるんだ。君の櫛を買うために時計を売ったんだ。それで、今度は君がチョップスを置く番だと思うよ。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Instead of obeying,",
        "translation": "従う代わりに、",
        "speech": "Instead of obeying,"
      },
      {
        "original": "Jim tumbled down on the couch",
        "translation": "ジムはソファにどさっと倒れ込んだ",
        "speech": "Jim tumbled down on the couch"
      },
      {
        "original": "and put his hands under the back of his head and smiled.",
        "translation": "そして頭の後ろに手を置き、にっこり笑った。",
        "speech": "and put his hands under the back of his head and smiled."
      },
      {
        "original": "“Dell,” said he,",
        "translation": "「デル」と彼は言った、",
        "speech": "“Dell,” said he,"
      },
      {
        "original": "“let’s put our Christmas presents away and keep ’em a while.",
        "translation": "「クリスマスのプレゼントを片付けて、しばらく取っておこう。",
        "speech": "“let’s put our Christmas presents away and keep ’em a while."
      },
      {
        "original": "They’re too nice to use just at present.",
        "translation": "今すぐ使うには、あまりにも良すぎるよ。",
        "speech": "They’re too nice to use just at present."
      },
      {
        "original": "I sold the watch to get the money to buy your combs.",
        "translation": "君の櫛を買うお金を得るために、時計を売ったんだ。",
        "speech": "I sold the watch to get the money to buy your combs."
      },
      {
        "original": "And now suppose you put the chops on.”",
        "translation": "さあ、今度は君が肉を焼く番だ。」",
        "speech": "And now suppose you put the chops on.”"
      }
    ]
  },
  {
    "original": "The magi, as you know, were wise men — wonderfully wise men — who brought gifts to the Babe in the manger. They invented the art of giving Christmas presents. Being wise, their gifts were no doubt wise ones, possibly bearing the privilege of exchange in case of duplication. And here I have lamely related to you the uneventful chronicle of two foolish children in a flat who most unwisely sacrificed for each other the greatest treasures of their house. But in a last word to the wise of these days let it be said that of all who give gifts these two were the wisest. Of all who give and receive gifts, such as they are wisest. Everywhere they are wisest. They are the magi.",
    "translation": "ご存じの通り、三博士は賢者でした ― ― 驚くほど賢い人々で、馬小屋の赤ん坊に贈り物を持ってきたのです。彼らはクリスマスプレゼントを贈る技を発明しました。賢者であるため、彼らの贈り物も間違いなく賢いもので、場合によっては重複した場合の交換の特権も備えていたかもしれません。そしてここで私は、平凡な2人の愚かな子供たちが互いに家の中で最も大切な宝物を最も賢明でない方法で犠牲にした、とても平凡な物語を鈍くあなたに語ったに過ぎません。しかし、現代の賢者たちに最後に一言申し上げるなら、贈り物を与えるすべての人の中で、この二人こそが最も賢明であったということです。贈る人も受け取る人も含め、こうした人々は最も賢明です。どこでも最も賢明です。彼らこそが三博士です。",
    "guide": "逆接の前後で、人物の考えや場面がどう変わるかを比べます。",
    "narrationSegments": [
      {
        "original": "The magi, as you know, were wise men —",
        "translation": "ご存知の通り、博士たちは賢者でした——",
        "speech": "The magi, as you know, were wise men —"
      },
      {
        "original": "wonderfully wise men —",
        "translation": "実に素晴らしく賢い賢者たち——",
        "speech": "wonderfully wise men —"
      },
      {
        "original": "who brought gifts to the Babe in the manger.",
        "translation": "馬小屋の赤ん坊に贈り物を持ってきた人たちです。",
        "speech": "who brought gifts to the Babe in the manger."
      },
      {
        "original": "They invented the art of giving Christmas presents.",
        "translation": "彼らはクリスマスプレゼントを贈る芸術を発明しました。",
        "speech": "They invented the art of giving Christmas presents."
      },
      {
        "original": "Being wise, their gifts were no doubt wise ones,",
        "translation": "賢者である彼らの贈り物は、間違いなく賢いもので、",
        "speech": "Being wise, their gifts were no doubt wise ones,"
      },
      {
        "original": "possibly bearing the privilege of exchange in case of duplication.",
        "translation": "重複した場合の交換の特権を備えていたかもしれません。",
        "speech": "possibly bearing the privilege of exchange in case of duplication."
      },
      {
        "original": "And here I have lamely related",
        "translation": "そしてここで私は不器用にお話ししました",
        "speech": "And here I have lamely related"
      },
      {
        "original": "to you the uneventful chronicle of two foolish children",
        "translation": "ある平凡なアパートの二人の愚かな子供たちの日常を",
        "speech": "to you the uneventful chronicle of two foolish children"
      },
      {
        "original": "in a flat who most unwisely sacrificed",
        "translation": "最も賢明でない方法で、",
        "speech": "in a flat who most unwisely sacrificed"
      },
      {
        "original": "for each other the greatest treasures of their house.",
        "translation": "お互いの家で最も大切な宝物を犠牲にした話です。",
        "speech": "for each other the greatest treasures of their house."
      },
      {
        "original": "But in a last word to the wise",
        "translation": "しかし現代の賢者たちへの最後の言葉として",
        "speech": "But in a last word to the wise"
      },
      {
        "original": "of these days let it be said that",
        "translation": "次のように述べておきましょう：",
        "speech": "of these days let it be said that"
      },
      {
        "original": "of all who give gifts these two were the wisest.",
        "translation": "贈り物をする人の中で、この二人こそが最も賢明でした。",
        "speech": "of all who give gifts these two were the wisest."
      },
      {
        "original": "Of all who give and receive gifts, such as they are wisest.",
        "translation": "贈り受けする人の中でも、彼らほど賢明な者はいません。",
        "speech": "Of all who give and receive gifts, such as they are wisest."
      },
      {
        "original": "Everywhere they are wisest. They are the magi.",
        "translation": "どこにいても、彼らは最も賢明です。彼らが博士たちです。",
        "speech": "Everywhere they are wisest. They are the magi."
      }
    ]
  }
])
