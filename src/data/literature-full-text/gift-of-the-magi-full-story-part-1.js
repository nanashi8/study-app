// 『賢者の贈り物』短編全文の前半。
const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  Object.values(value).forEach(deepFreeze)
  return Object.freeze(value)
}

export default deepFreeze([
  {
    "original": "One dollar and eighty-seven cents. That was all. And sixty cents of it was in pennies. Pennies saved one and two at a time by bulldozing the grocer and the vegetable man and the butcher until one’s cheeks burned with the silent imputation of parsimony that such close dealing implied. Three times Della counted it. One dollar and eighty-seven cents. And the next day would be Christmas. There was clearly nothing to do but flop down on the shabby little couch and howl. So Della did it. Which instigates the moral reflection that life is made up of sobs, sniffles, and smiles, with sniffles predominating.",
    "translation": "一ドル八十七セント。それが全てだった。そしてそのうち六十セントはペニーだった。ペニーは、一つまた二つと、食料品店や八百屋、肉屋から少しずつ貯めたもので、その慎ましいやり取りが示すけちな疑いに頬が赤くなるほどだった。デラは三回数えた。一ドル八十七セント。そして翌日はクリスマスだった。明らかにできることは、みすぼらしい小さなソファに倒れ込み、泣き叫ぶことだけだった。だからデラはその通りにした。このことは、人生は嗚咽、すすり泣き、そして笑顔でできていて、すすり泣きが最も多い、という道徳的な反省を引き起こす。",
    "guide": "逆接の前後で、人物の考えや場面がどう変わるかを比べます。",
    "narrationSegments": [
      {
        "original": "One dollar and eighty-seven cents.",
        "translation": "1ドル87セント。",
        "speech": "One dollar and eighty-seven cents."
      },
      {
        "original": "That was all.",
        "translation": "それだけだった。",
        "speech": "That was all."
      },
      {
        "original": "And sixty cents of it was in pennies.",
        "translation": "そしてそのうち60セントはペニーだった。",
        "speech": "And sixty cents of it was in pennies."
      },
      {
        "original": "Pennies saved one and two at a time",
        "translation": "ペニーは、少しずつ、",
        "speech": "Pennies saved one and two at a time"
      },
      {
        "original": "by bulldozing the grocer and the vegetable man",
        "translation": "食料品店や八百屋、肉屋を押しのけながら貯めたもので、",
        "speech": "by bulldozing the grocer and the vegetable man"
      },
      {
        "original": "and the butcher until one’s cheeks burned",
        "translation": "その結果、頬が赤くなるほどだった。",
        "speech": "and the butcher until one’s cheeks burned"
      },
      {
        "original": "with the silent imputation of parsimony that such close dealing implied.",
        "translation": "そのような細かい取引が含意する節約の厳しい批判のために。",
        "speech": "with the silent imputation of parsimony that such close dealing implied."
      },
      {
        "original": "Three times Della counted it.",
        "translation": "デラはそれを三度数えた。",
        "speech": "Three times Della counted it."
      },
      {
        "original": "One dollar and eighty-seven cents.",
        "translation": "1ドル87セント。",
        "speech": "One dollar and eighty-seven cents."
      },
      {
        "original": "And the next day would be Christmas.",
        "translation": "そして翌日はクリスマスだった。",
        "speech": "And the next day would be Christmas."
      },
      {
        "original": "There was clearly nothing to do but flop down",
        "translation": "明らかにやることは、みすぼらしい小さなソファに倒れ込んで",
        "speech": "There was clearly nothing to do but flop down"
      },
      {
        "original": "on the shabby little couch and howl.",
        "translation": "泣き叫ぶことしかなかった。",
        "speech": "on the shabby little couch and howl."
      },
      {
        "original": "So Della did it.",
        "translation": "だから、デラはそうした。",
        "speech": "So Della did it."
      },
      {
        "original": "Which instigates the moral reflection that life is made up of sobs,",
        "translation": "これにより人生はすすり泣き、鼻をすすること、そして笑顔で成り立っており、",
        "speech": "Which instigates the moral reflection that life is made up of sobs,"
      },
      {
        "original": "sniffles, and smiles, with sniffles predominating.",
        "speech": "sniffles, and smiles, with sniffles predominating.",
        "translation": "すすり泣きが最も多いという道徳的反省が促される。"
      }
    ]
  },
  {
    "original": "While the mistress of the home is gradually subsiding from the first stage to the second, take a look at the home. A furnished flat at $8 per week. It did not exactly beggar description, but it certainly had that word on the lookout for the mendicancy squad. In the vestibule below was a letter-box into which no letter would go, and an electric button from which no mortal finger could coax a ring. Also appertaining thereunto was a card bearing the name “Mr. James Dillingham Young.”",
    "translation": "家の主婦が第一段階から第二段階へ徐々に落ちついていく間に、家を見てみましょう。週8ドルの家具付きフラットです。それは正確に言って貧相なものではありませんでしたが、確かに乞食取り締まり隊を探している言葉にはぴったりでした。下の玄関ホールには、どんな手紙も入らない郵便受けと、どんな人間の指でも鈴を鳴らせない電気ボタンがありました。またそれに関連して、「ジェームズ・ディリングハム・ヤング氏」という名前のカードが掲げられていました。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "While the mistress of the home is gradually subsiding",
        "translation": "家の女主人が徐々に落ち着きながら",
        "speech": "While the mistress of the home is gradually subsiding"
      },
      {
        "original": "from the first stage to the second,",
        "translation": "第一段階から第二段階へと移っていく中で、",
        "speech": "from the first stage to the second,"
      },
      {
        "original": "take a look at the home.",
        "translation": "家を見てみてください。",
        "speech": "take a look at the home."
      },
      {
        "original": "A furnished flat at $8 per week.",
        "translation": "週8ドルの家具付きアパート。",
        "speech": "A furnished flat at $8 per week."
      },
      {
        "original": "It did not exactly beggar description,",
        "translation": "それは正確に言えば言葉では言い表せないというほどではなかったが、",
        "speech": "It did not exactly beggar description,"
      },
      {
        "original": "but it certainly had that word on the lookout",
        "translation": "確かにその言葉が待ち構えているようなものだった",
        "speech": "but it certainly had that word on the lookout"
      },
      {
        "original": "for the mendicancy squad.",
        "translation": "乞食取り締まり班のために。",
        "speech": "for the mendicancy squad."
      },
      {
        "original": "In the vestibule below was a letter-box into",
        "translation": "下の玄関ホールには、手紙を入れても入らない郵便受けがあり、",
        "speech": "In the vestibule below was a letter-box into"
      },
      {
        "original": "which no letter would go,",
        "translation": "手紙は一切入らなかった、",
        "speech": "which no letter would go,"
      },
      {
        "original": "and an electric button from",
        "speech": "and an electric button from",
        "translation": "そして電気の押しボタンがあった"
      },
      {
        "original": "which no mortal finger could coax a ring.",
        "speech": "which no mortal finger could coax a ring.",
        "translation": "どの人間の指もリングをはめることができなかった。"
      },
      {
        "original": "Also appertaining thereunto was a card bearing the name “Mr.",
        "speech": "Also appertaining thereunto was a card bearing the name “Mr.",
        "translation": "また、それに関連して、「ミスター」という名前のカードがあった。"
      },
      {
        "original": "James Dillingham Young.”",
        "speech": "James Dillingham Young.”",
        "translation": "ジェームズ・ディリングハム・ヤング。"
      }
    ]
  },
  {
    "original": "The “Dillingham” had been flung to the breeze during a former period of prosperity when its possessor was being paid $30 per week. Now, when the income was shrunk to $20, though, they were thinking seriously of contracting to a modest and unassuming D. But whenever Mr. James Dillingham Young came home and reached his flat above he was called “Jim” and greatly hugged by Mrs. James Dillingham Young, already introduced to you as Della. Which is all very good.",
    "translation": "「ディリングハム」は、かつてその所有者が週に30ドルを稼いでいた裕福な時期に風に掲げられていた。ところが今、収入が20ドルに減ってしまったため、彼らは控えめで質素なDへの縮小を真剣に考えていた。しかし、ジェームズ・ディリングハム・ヤング氏が帰宅し、自分の上階のフラットに着くと、彼は「ジム」と呼ばれ、すでにあなたに紹介したデラことジェームズ・ディリングハム・ヤング夫人に大いに抱きしめられる。これはすべて非常に良いことだ。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "The “Dillingham” had been flung",
        "translation": "「ディリングハム号」は投げ出されていた",
        "speech": "The “Dillingham” had been flung"
      },
      {
        "original": "to the breeze during a former period",
        "translation": "かつての繁栄の時代において",
        "speech": "to the breeze during a former period"
      },
      {
        "original": "of prosperity when its possessor was being paid $30 per week.",
        "translation": "その所有者が週30ドルもらっていたときに。",
        "speech": "of prosperity when its possessor was being paid $30 per week."
      },
      {
        "original": "Now, when the income was shrunk to $20,",
        "translation": "しかし現在、収入が20ドルに減ったとき、",
        "speech": "Now, when the income was shrunk to $20,"
      },
      {
        "original": "though, they were thinking seriously of contracting",
        "translation": "彼らは真剣に契約を考えていた",
        "speech": "though, they were thinking seriously of contracting"
      },
      {
        "original": "to a modest and unassuming D.",
        "translation": "控えめで地味なディーリングに。",
        "speech": "to a modest and unassuming D."
      },
      {
        "original": "But whenever Mr.",
        "translation": "しかし、ジェームズ・ディリングハム・ヤングさんが",
        "speech": "But whenever Mr."
      },
      {
        "original": "James Dillingham Young came home",
        "translation": "家に帰ってきて",
        "speech": "James Dillingham Young came home"
      },
      {
        "original": "and reached his flat above he was called “Jim”",
        "translation": "上の彼のアパートに着くと、彼は「ジム」と呼ばれ、",
        "speech": "and reached his flat above he was called “Jim”"
      },
      {
        "original": "and greatly hugged by Mrs.",
        "translation": "そして大いに抱きしめられました、",
        "speech": "and greatly hugged by Mrs."
      },
      {
        "original": "James Dillingham Young, already introduced to you as Della.",
        "translation": "すでにあなたにデラとして紹介されたジェームズ・ディリングハム・ヤング夫人に。",
        "speech": "James Dillingham Young, already introduced to you as Della."
      },
      {
        "original": "Which is all very good.",
        "translation": "それはすべてとても良いことです。",
        "speech": "Which is all very good."
      }
    ]
  },
  {
    "original": "Della finished her cry and attended to her cheeks with the powder rag. She stood by the window and looked out dully at a gray cat walking a gray fence in a gray backyard. Tomorrow would be Christmas Day, and she had only $1.87 with which to buy Jim a present. She had been saving every penny she could for months, with this result. Twenty dollars a week doesn’t go far. Expenses had been greater than she had calculated. They always are. Only $1.87 to buy a present for Jim. Her Jim. Many a happy hour she had spent planning for something nice for him. Something fine and rare and sterling — something just a little bit near to being worthy of the honor of being owned by Jim.",
    "translation": "デラは泣き声を終え、粉布で頬を拭いた。彼女は窓辺に立ち、灰色の裏庭で灰色のフェンスを歩く灰色の猫をぼんやりと見つめていた。明日はクリスマスの日で、ジムにプレゼントを買うためのお金はわずか1.87ドルしかなかった。彼女は何ヶ月もできる限りのお金を貯めてきたのに、この結果が出た。週に20ドルじゃ大したことないよ。費用は彼女が計算していたよりも多かった。いつもそうだ。ジムへのプレゼントを買うのにたったの1.87ドル。彼女のジム。彼女は彼のために何か素敵なことを計画した多くのハッピーアワーを過ごした。上質で希少で、スターリングなもの――ジムの所有にふさわしい名誉にほんの少しだけ近いもの。",
    "guide": "主語と動作を先に押さえ、あとから加わる説明を順に重ねます。",
    "narrationSegments": [
      {
        "original": "Della finished her cry and attended to her cheeks",
        "translation": "デラは泣き終え、頬の手入れをした",
        "speech": "Della finished her cry and attended to her cheeks"
      },
      {
        "original": "with the powder rag.",
        "translation": "化粧用の布で。",
        "speech": "with the powder rag."
      },
      {
        "original": "She stood by the window and looked out dully",
        "translation": "彼女は窓のそばに立ち、ぼんやりと外を見た",
        "speech": "She stood by the window and looked out dully"
      },
      {
        "original": "at a gray cat walking a gray fence in a gray backyard.",
        "translation": "灰色の裏庭の灰色のフェンスを歩く灰色の猫を見ながら。",
        "speech": "at a gray cat walking a gray fence in a gray backyard."
      },
      {
        "original": "Tomorrow would be Christmas Day,",
        "translation": "明日はクリスマスの日だった、",
        "speech": "Tomorrow would be Christmas Day,"
      },
      {
        "original": "and she had only $1.87 with which to buy Jim a present.",
        "translation": "そして彼女はジムにプレゼントを買うのにたった1.87ドルしか持っていませんでした。",
        "speech": "and she had only $1.87 with which to buy Jim a present."
      },
      {
        "original": "She had been saving every penny she could for months,",
        "translation": "彼女は何か月もの間、できるだけすべてのペニーを貯めてきました、",
        "speech": "She had been saving every penny she could for months,"
      },
      {
        "original": "with this result.",
        "speech": "with this result.",
        "translation": "その結果がこれでした。"
      },
      {
        "original": "Twenty dollars a week doesn’t go far.",
        "translation": "週に20ドルではあまり遠くまで行けません。",
        "speech": "Twenty dollars a week doesn’t go far."
      },
      {
        "original": "Expenses had been greater than she had calculated.",
        "translation": "出費は彼女の計算よりも多かった。",
        "speech": "Expenses had been greater than she had calculated."
      },
      {
        "original": "They always are.",
        "translation": "いつもそうなのだ。",
        "speech": "They always are."
      },
      {
        "original": "Only $1.87 to buy a present for Jim.",
        "translation": "ジムへのプレゼントを買うのにたったの1.87ドル。",
        "speech": "Only $1.87 to buy a present for Jim."
      },
      {
        "original": "Her Jim. Many a happy hour she had spent planning",
        "translation": "彼女のジム。彼のために何か素敵なものを計画するのに何時間も楽しい時間を過ごした。",
        "speech": "Her Jim. Many a happy hour she had spent planning"
      },
      {
        "original": "for something nice for him.",
        "speech": "for something nice for him.",
        "translation": "彼のために何か良いものを。"
      },
      {
        "original": "Something fine and rare and sterling —",
        "translation": "素晴らしくて珍しくて純粋なもの—",
        "speech": "Something fine and rare and sterling —"
      },
      {
        "original": "something just a little bit near to being worthy",
        "translation": "ジムが所有する栄誉に値するに少しでも近い何か。",
        "speech": "something just a little bit near to being worthy"
      },
      {
        "original": "of the honor of being owned by Jim.",
        "translation": "ジムが所有する栄誉に値するに少しでも近い何か。",
        "speech": "of the honor of being owned by Jim."
      }
    ]
  },
  {
    "original": "There was a pier glass between the windows of the room. Perhaps you have seen a pier glass in an $8 flat. A very thin and very agile person may, by observing his reflection in a rapid sequence of longitudinal strips, obtain a fairly accurate conception of his looks. Della, being slender, had mastered the art. Suddenly she whirled from the window and stood before the glass. Her eyes were shining brilliantly, but her face had lost its color within twenty seconds. Rapidly she pulled down her hair and let it fall to its full length.",
    "translation": "部屋の窓の間にはピアガラスが置かれていた。おそらく、あなたも8ドルのアパートでピアガラスを見たことがあるだろう。非常に細くて機敏な人は、縦に並んだ帯状の反射を素早く眺めることによって、自分の容姿をかなり正確に知ることができる。スレンダーなデラはその技術を習得していた。突然、彼女は窓から振り向き、ガラスの前に立った。目は輝いていたが、顔は二十秒もたたないうちに血の気を失った。素早く髪を下ろし、その全長を自由に垂らした。",
    "guide": "逆接の前後で、人物の考えや場面がどう変わるかを比べます。",
    "narrationSegments": [
      {
        "original": "There was a pier glass between the windows of the room.",
        "translation": "部屋の窓の間にはピアガラスがありました。",
        "speech": "There was a pier glass between the windows of the room."
      },
      {
        "original": "Perhaps you have seen a pier glass in an $8 flat.",
        "translation": "おそらく、あなたも8ドルのアパートでピアガラスを見たことがあるでしょう。",
        "speech": "Perhaps you have seen a pier glass in an $8 flat."
      },
      {
        "original": "A very thin and very agile person may,",
        "translation": "非常に細くて非常に敏捷な人は、",
        "speech": "A very thin and very agile person may,"
      },
      {
        "original": "by observing his reflection in a rapid sequence of longitudinal strips,",
        "translation": "縦長のストリップに映る自分の姿を連続して観察することによって、",
        "speech": "by observing his reflection in a rapid sequence of longitudinal strips,"
      },
      {
        "original": "obtain a fairly accurate conception of his looks.",
        "translation": "自分の容貌をかなり正確に把握することができます。",
        "speech": "obtain a fairly accurate conception of his looks."
      },
      {
        "original": "Della, being slender, had mastered the art.",
        "translation": "細身のデラは、その技術を習得していました。",
        "speech": "Della, being slender, had mastered the art."
      },
      {
        "original": "Suddenly she whirled from the window and stood before the glass.",
        "translation": "突然、彼女は窓から体をひるがえしてガラスの前に立ちました。",
        "speech": "Suddenly she whirled from the window and stood before the glass."
      },
      {
        "original": "Her eyes were shining brilliantly,",
        "translation": "彼女の目は輝いていましたが、",
        "speech": "Her eyes were shining brilliantly,"
      },
      {
        "original": "but her face had lost its color within twenty seconds.",
        "translation": "顔色は20秒以内に失われました。",
        "speech": "but her face had lost its color within twenty seconds."
      },
      {
        "original": "Rapidly she pulled down her hair",
        "translation": "素早く、彼女は髪を下ろし、",
        "speech": "Rapidly she pulled down her hair"
      },
      {
        "original": "and let it fall to its full length.",
        "translation": "その長さのまま落としました。",
        "speech": "and let it fall to its full length."
      }
    ]
  },
  {
    "original": "Now, there were two possessions of the James Dillingham Youngs in which they both took a mighty pride. One was Jim’s gold watch that had been his father’s and his grandfather’s. The other was Della’s hair. Had the queen of Sheba lived in the flat across the airshaft, Della would have let her hair hang out the window some day to dry just to depreciate Her Majesty’s jewels and gifts. Had King Solomon been the janitor, with all his treasures piled up in the basement, Jim would have pulled out his watch every time he passed, just to see him pluck at his beard from envy.",
    "translation": "さて、ジェームズ・ディリングハム・ヤング夫妻には、二つの物に大いに誇りを持っているものがありました。一つはジムの金の懐中時計で、これは彼の父と祖父のものでもありました。もう一つはデラの髪です。もしシバの女王が向かいの空気シャフト越しのアパートに住んでいたなら、デラはいつか彼女の髪を窓から垂らして乾かし、女王陛下の宝石や贈り物の価値を下げてしまうでしょう。もしソロモン王が管理人で、彼のすべての宝が地下室に積まれていたとしても、ジムは通りすがるたびに時計を取り出し、王が嫉妬で髭をいじるのを見て楽しむでしょう。",
    "guide": "反復される語と指示語の受け先を確かめ、場面のつながりを追います。",
    "narrationSegments": [
      {
        "original": "Now, there were two possessions of the James Dillingham Youngs",
        "translation": "さて、ジェームズ・ディリングハム・ヤング夫妻には、",
        "speech": "Now, there were two possessions of the James Dillingham Youngs"
      },
      {
        "original": "in which they both took a mighty pride.",
        "translation": "二つの所有物があり、二人ともそれを非常に誇りに思っていました。",
        "speech": "in which they both took a mighty pride."
      },
      {
        "original": "One was Jim’s gold watch that had been his father’s",
        "translation": "一つはジムの金の懐中時計で、これは父親のものでもあり、",
        "speech": "One was Jim’s gold watch that had been his father’s"
      },
      {
        "original": "and his grandfather’s.",
        "translation": "祖父のものでもありました。",
        "speech": "and his grandfather’s."
      },
      {
        "original": "The other was Della’s hair.",
        "translation": "もう一つはデラの髪でした。",
        "speech": "The other was Della’s hair."
      },
      {
        "original": "Had the queen of Sheba lived in the flat across the airshaft,",
        "translation": "もしシバの女王が、あの通気口の向かいのフラットに住んでいたとしても、",
        "speech": "Had the queen of Sheba lived in the flat across the airshaft,"
      },
      {
        "original": "Della would have let her hair hang out the window some day",
        "translation": "デラはいつか彼女の髪を窓から垂らし、",
        "speech": "Della would have let her hair hang out the window some day"
      },
      {
        "original": "to dry just to depreciate Her Majesty’s jewels and gifts.",
        "translation": "女王陛下の宝石や贈り物の価値を落とすことでしょう。",
        "speech": "to dry just to depreciate Her Majesty’s jewels and gifts."
      },
      {
        "original": "Had King Solomon been the janitor,",
        "translation": "もしソロモン王が管理人だったとしても、",
        "speech": "Had King Solomon been the janitor,"
      },
      {
        "original": "with all his treasures piled up in the basement,",
        "translation": "地下に山積みにされたすべての宝物を前にして、",
        "speech": "with all his treasures piled up in the basement,"
      },
      {
        "original": "Jim would have pulled out his watch every time he passed,",
        "translation": "ジムは通るたびに懐中時計を取り出し、",
        "speech": "Jim would have pulled out his watch every time he passed,"
      },
      {
        "original": "just to see him pluck at his beard from envy.",
        "translation": "羨ましさでひげを引っ張る彼を見て楽しむでしょう。",
        "speech": "just to see him pluck at his beard from envy."
      }
    ]
  },
  {
    "original": "So now Della’s beautiful hair fell about her rippling and shining like a cascade of brown waters. It reached below her knee and made itself almost a garment for her. And then she did it up again nervously and quickly. Once she faltered for a minute and stood still while a tear or two splashed on the worn red carpet. On went her old brown jacket; on went her old brown hat. With a whirl of skirts and with the brilliant sparkle still in her eyes, she fluttered out the door and down the stairs to the street.",
    "translation": "さて、今やデラの美しい髪は波打ちながら輝き、まるで茶色の水の滝のように広がっていた。それは膝の下まで届き、まるで彼女の衣服の一部のようになっていた。そして彼女はそれを再び神経質に、素早くまとめた。一瞬ためらい、立ち止まったときに、涙が一、二滴擦り切れた赤いカーペットに落ちた。古い茶色のジャケットを身に着け、古い茶色の帽子をかぶった。スカートをくるくると回し、まだ目には鮮やかな輝きを残したまま、彼女は扉をそよそよと出て、階段を下り、通りへと向かった。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "So now Della’s beautiful hair fell about her rippling",
        "translation": "さて、今やデラの美しい髪は彼女の波打つような",
        "speech": "So now Della’s beautiful hair fell about her rippling"
      },
      {
        "original": "and shining like a cascade of brown waters.",
        "translation": "そして茶色の滝のように輝く髪の間に垂れ下がっていた。",
        "speech": "and shining like a cascade of brown waters."
      },
      {
        "original": "It reached below her knee",
        "translation": "それは膝の下まで達し、",
        "speech": "It reached below her knee"
      },
      {
        "original": "and made itself almost a garment for her.",
        "translation": "ほとんど彼女の衣服のようになっていた。",
        "speech": "and made itself almost a garment for her."
      },
      {
        "original": "And then she did it up again nervously and quickly.",
        "translation": "そして、彼女はそれをまた神経質に急いでまとめた。",
        "speech": "And then she did it up again nervously and quickly."
      },
      {
        "original": "Once she faltered for a minute and stood still",
        "translation": "一度、彼女は一瞬ためらい、立ち止まった",
        "speech": "Once she faltered for a minute and stood still"
      },
      {
        "original": "while a tear or two splashed on the worn red carpet.",
        "translation": "そして涙が一、二滴、使い古された赤いカーペットに落ちた。",
        "speech": "while a tear or two splashed on the worn red carpet."
      },
      {
        "original": "On went her old brown jacket; on went her old brown hat.",
        "translation": "古い茶色のジャケットを着て；古い茶色の帽子をかぶった。",
        "speech": "On went her old brown jacket; on went her old brown hat."
      },
      {
        "original": "With a whirl of skirts and",
        "translation": "スカートをひらりとさせ、",
        "speech": "With a whirl of skirts and"
      },
      {
        "original": "with the brilliant sparkle still in her eyes,",
        "translation": "まだ目に輝きを宿したまま、",
        "speech": "with the brilliant sparkle still in her eyes,"
      },
      {
        "original": "she fluttered out the door and down the stairs to the street.",
        "translation": "彼女はドアを飛び出し、階段を下って通りへと向かった。",
        "speech": "she fluttered out the door and down the stairs to the street."
      }
    ]
  },
  {
    "original": "Where she stopped the sign read: “Mme. Sofronie. Hair Goods of All Kinds.” One flight up Della ran, and collected herself, panting. Madame, large, too white, chilly, hardly looked the “Sofronie.” “Will you buy my hair?” asked Della. “I buy hair,” said Madame. “Take yer hat off and let’s have a sight at the looks of it.” Down rippled the brown cascade. “Twenty dollars,” said Madame, lifting the mass with a practised hand. “Give it to me quick,” said Della.",
    "translation": "彼女が立ち止まった場所には、看板がこう書かれていた：「マダム・ソフロニー。あらゆる種類の髪製品」。階段を一段上がると、デラは息を切らせながら身を整えた。マダムは大柄で、顔色が白すぎて、冷たく、「ソフロニー」とはとても言えない感じだった。「私の髪を買ってくれますか？」とデラは尋ねた。「髪を買うわよ」とマダムは言った。「帽子を取って、その見た目を見せなさい。」茶色い髪が波のように流れ落ちた。「20ドル」と、マダムは慣れた手つきで髪の束を持ち上げながら言った。「すぐにちょうだい」とデラは言った。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Where she stopped the sign read: “Mme.",
        "translation": "彼女が立ち止まったところの看板にはこう書かれていた：「Mme.",
        "speech": "Where she stopped the sign read: “Mme."
      },
      {
        "original": "Sofronie. Hair Goods of All Kinds.”",
        "translation": "Sofronie。あらゆる種類のヘア用品。」",
        "speech": "Sofronie. Hair Goods of All Kinds.”"
      },
      {
        "original": "One flight up Della ran, and collected herself, panting.",
        "translation": "一階上まで駆け上がると、デラは息を整えながら立ち止まった。",
        "speech": "One flight up Della ran, and collected herself, panting."
      },
      {
        "original": "Madame, large, too white, chilly, hardly looked the “Sofronie.”",
        "translation": "マダムは大柄で、とても白く、冷たく、「ソフロニー」とはとても思えなかった。",
        "speech": "Madame, large, too white, chilly, hardly looked the “Sofronie.”"
      },
      {
        "original": "“Will you buy my hair?”",
        "translation": "「私の髪を買ってもらえますか？」",
        "speech": "“Will you buy my hair?”"
      },
      {
        "original": "asked Della. “I buy hair,” said Madame.",
        "translation": "とデラは尋ねた。「髪を買うわよ」とマダムは言った。",
        "speech": "asked Della. “I buy hair,” said Madame."
      },
      {
        "original": "“Take yer hat off and let’s have a sight",
        "translation": "「帽子を取って、ちょっと見せてくれ」",
        "speech": "“Take yer hat off and let’s have a sight"
      },
      {
        "original": "at the looks of it.”",
        "translation": "「見た目を確認したいんだ」",
        "speech": "at the looks of it.”"
      },
      {
        "original": "Down rippled the brown cascade.",
        "translation": "茶色の髪がさらさらと流れ落ちた。",
        "speech": "Down rippled the brown cascade."
      },
      {
        "original": "“Twenty dollars,” said Madame, lifting the mass with a practised hand.",
        "translation": "「20ドルです」とマダムは、手慣れた手つきで髪の塊を持ち上げながら言った。",
        "speech": "“Twenty dollars,” said Madame, lifting the mass with a practised hand."
      },
      {
        "original": "“Give it to me quick,” said Della.",
        "speech": "“Give it to me quick,” said Della.",
        "translation": "「早く渡して！」とデラは言った。"
      }
    ]
  },
  {
    "original": "Oh, and the next two hours tripped by on rosy wings. Forget the hashed metaphor. She was ransacking the stores for Jim’s present. She found it at last. It surely had been made for Jim and no one else. There was no other like it in any of the stores, and she had turned all of them inside out. It was a platinum fob chain simple and chaste in design, properly proclaiming its value by substance alone and not by meretricious ornamentation — as all good things should do. It was even worthy of The Watch. As soon as she saw it she knew that it must be Jim’s. It was like him. Quietness and value — the description applied to both.",
    "translation": "ああ、それに次の二時間は、まるでバラ色の翼に乗って過ぎ去ったかのようだった。比喩は忘れよう。彼女はジムへの贈り物を探して店をいくつも荒らして回っていた。ついにそれを見つけた。それは間違いなくジムのために作られたものであり、他の誰のためでもなかった。どの店にも同じものはなく、彼女はすべての店の中をひっくり返して調べていた。それはプラチナの懐中時計用鎖で、シンプルで清楚なデザインで、価値を派手な装飾ではなく実質によってのみ示していた — 良いものは皆そうあるべきである。それは「ザ・ウォッチ」にもふさわしいものであった。彼女はそれを見た瞬間、これはジムのものでなければならないと確信した。それは彼と同じだった。静かさと価値 — その描写は両方に当てはまった。",
    "guide": "反復される語と指示語の受け先を確かめ、場面のつながりを追います。",
    "narrationSegments": [
      {
        "original": "Oh, and the next two hours tripped by on rosy wings.",
        "translation": "ああ、そして次の2時間はバラ色の翼に乗って過ぎていった。",
        "speech": "Oh, and the next two hours tripped by on rosy wings."
      },
      {
        "original": "Forget the hashed metaphor.",
        "translation": "ハッシュ化されたメタファーは忘れてください。",
        "speech": "Forget the hashed metaphor."
      },
      {
        "original": "She was ransacking the stores for Jim’s present.",
        "translation": "彼女はジムのプレゼントを探して店を",
        "speech": "She was ransacking the stores for Jim’s present."
      },
      {
        "original": "She found it at last.",
        "translation": "ついに見つけた。",
        "speech": "She found it at last."
      },
      {
        "original": "It surely had been made for Jim and no one else.",
        "translation": "確かにジムのために作られたもので、他の誰のためでもなかった。",
        "speech": "It surely had been made for Jim and no one else."
      },
      {
        "original": "There was no other like it in any of the stores,",
        "translation": "どの店にも同じものは他になく、",
        "speech": "There was no other like it in any of the stores,"
      },
      {
        "original": "and she had turned all of them inside out.",
        "translation": "そして彼女はすべて裏返していた。",
        "speech": "and she had turned all of them inside out."
      },
      {
        "original": "It was a platinum fob chain simple and chaste in design,",
        "translation": "それはプラチナ製のフォブチェーンで、シンプルで純粋なデザインで、",
        "speech": "It was a platinum fob chain simple and chaste in design,"
      },
      {
        "original": "properly proclaiming its value by substance alone",
        "translation": "実力だけで価値を正しく示していました",
        "speech": "properly proclaiming its value by substance alone"
      },
      {
        "original": "and not by meretricious ornamentation — as all good things should do.",
        "translation": "飾りではなく、飾り付けではなく、すべての良いものがそうであるべき",
        "speech": "and not by meretricious ornamentation — as all good things should do."
      },
      {
        "original": "It was even worthy of The Watch.",
        "translation": "『ザ・ウォッチ』にふ",
        "speech": "It was even worthy of The Watch."
      },
      {
        "original": "As soon as she saw it she knew",
        "translation": "彼女はそれを見た瞬間",
        "speech": "As soon as she saw it she knew"
      },
      {
        "original": "that it must be Jim’s.",
        "translation": "ジムのものだと確信した。",
        "speech": "that it must be Jim’s."
      },
      {
        "original": "It was like him.",
        "translation": "彼らしい。",
        "speech": "It was like him."
      },
      {
        "original": "Quietness and value — the description applied to both.",
        "translation": "静寂と明るさ — 両方に適用される説明。",
        "speech": "Quietness and value — the description applied to both."
      }
    ]
  },
  {
    "original": "Twenty-one dollars they took from her for it, and she hurried home with the 87 cents. With that chain on his watch Jim might be properly anxious about the time in any company. Grand as the watch was, he sometimes looked at it on the sly on account of the old leather strap that he used in place of a chain.",
    "translation": "それには21ドルも彼らに取られ、彼女は87セントを手に家に急いだ。その時計にチェーンがついていれば、ジムはどんな場でも時間に対してきちんと気を配ることができただろう。その時計は立派なものだったが、彼は時々、チェーンの代わりに使っていた古い革のストラップのせいでこっそりと時計を見ることもあった。",
    "guide": "主語と動作を先に押さえ、あとから加わる説明を順に重ねます。",
    "narrationSegments": [
      {
        "original": "Twenty-one dollars they took from her for it,",
        "translation": "彼女はそれのために21ドルを取られ、",
        "speech": "Twenty-one dollars they took from her for it,"
      },
      {
        "original": "and she hurried home with the 87 cents.",
        "translation": "そして87セントを持って急いで家に帰った。",
        "speech": "and she hurried home with the 87 cents."
      },
      {
        "original": "With that chain",
        "translation": "その鎖で",
        "speech": "With that chain"
      },
      {
        "original": "on his watch Jim might be properly anxious about the time",
        "translation": "ジムはどんな集まりでも時計の時間をちゃんと気にすることができた。",
        "speech": "on his watch Jim might be properly anxious about the time"
      },
      {
        "original": "in any company.",
        "translation": "どんな仲間の中でも。",
        "speech": "in any company."
      },
      {
        "original": "Grand as the watch was,",
        "translation": "時計は立派だったが、",
        "speech": "Grand as the watch was,"
      },
      {
        "original": "he sometimes looked at it on the sly",
        "translation": "彼は時々こっそりそれを見ていた",
        "speech": "he sometimes looked at it on the sly"
      },
      {
        "original": "on account of the old leather strap",
        "translation": "古い革のストラップのために",
        "speech": "on account of the old leather strap"
      },
      {
        "original": "that he used in place of a chain.",
        "speech": "that he used in place of a chain.",
        "translation": "それを鎖の代わりに使っていたのだ。"
      }
    ]
  },
  {
    "original": "When Della reached home her intoxication gave way a little to prudence and reason. She got out her curling irons and lighted the gas and went to work repairing the ravages made by generosity added to love. Which is always a tremendous task, dear friends — a mammoth task. Within forty minutes her head was covered with tiny, close-lying curls that made her look wonderfully like a truant schoolboy. She looked at her reflection in the mirror long, carefully, and critically.",
    "translation": "デラが家に着くと、酔いが少しずつ慎重さと理性に変わった。彼女はカーリングアイロンを取り出し、ガスを点け、愛による寛大さがもたらした荒廃を修復する作業に取りかかった。それは常に途方もない仕事であり、親愛なる友よ ― 巨大な仕事である。四十分以内に、彼女の頭は小さく密着したカールで覆われ、まるで不良少年のように見えるほどだった。彼女は鏡に映った自分の姿を長く、注意深く、厳しく見つめた。",
    "guide": "時や条件を示す部分を先に受け、そのあと主な出来事へ進みます。",
    "narrationSegments": [
      {
        "original": "When Della reached home her intoxication gave way a little",
        "translation": "デラが家に着いたとき、彼女の酔いは少し",
        "speech": "When Della reached home her intoxication gave way a little"
      },
      {
        "original": "to prudence and reason.",
        "translation": "慎重さと理性に譲った。",
        "speech": "to prudence and reason."
      },
      {
        "original": "She got out her curling irons",
        "translation": "彼女はカーリングアイロンを取り出し、",
        "speech": "She got out her curling irons"
      },
      {
        "original": "and lighted the gas and went",
        "translation": "ガスに火をつけて作業に取りかかり、",
        "speech": "and lighted the gas and went"
      },
      {
        "original": "to work repairing the ravages made by generosity added to love.",
        "translation": "愛情に加えられた寛大さによって生じた荒れ果てた状態を修復した。",
        "speech": "to work repairing the ravages made by generosity added to love."
      },
      {
        "original": "Which is always a tremendous task, dear friends — a mammoth task.",
        "translation": "これはいつも大変な作業で、親愛なる友よ — 巨大な作業である。",
        "speech": "Which is always a tremendous task, dear friends — a mammoth task."
      },
      {
        "original": "Within forty minutes her head was covered with tiny,",
        "translation": "四十分以内に、彼女の頭は小さくて",
        "speech": "Within forty minutes her head was covered with tiny,"
      },
      {
        "original": "close-lying curls that made her look wonderfully like a truant schoolboy.",
        "translation": "密着したカールで覆われ、それが彼女をまるで家出少年のように見せた。",
        "speech": "close-lying curls that made her look wonderfully like a truant schoolboy."
      },
      {
        "original": "She looked at her reflection in the mirror long, carefully, and critically.",
        "translation": "彼女は鏡に映った自分の姿を長く、慎重に、そして批判的に見つめた。",
        "speech": "She looked at her reflection in the mirror long, carefully, and critically."
      }
    ]
  }
])
