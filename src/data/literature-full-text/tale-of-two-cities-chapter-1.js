// Project Gutenbergの原文を、章・短編の完結単位で収録する。
const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  Object.values(value).forEach(deepFreeze)
  return Object.freeze(value)
}

const scenes = [
  {
    "original": "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way — in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.",
    "translation": "それは最良の時代であり、最悪の時代でもありました。それは知恵の時代であり、愚かさの時代でもありました。それは信仰の時代であり、不信の時代でもありました。それは光の季節であり、闇の季節でもありました。それは希望の春であり、絶望の冬でもありました。私たちの前にはすべてがあり、何もありませんでした。私たちは皆、直接天国へ行くところであり、また同時に全く逆の方向へ行くところでもありました。要するに、その時代は現代と非常によく似ており、その最も騒々しい権威のいくつかは、良いにせよ悪いにせよ、それを最上級の比較で受け入れるべきだと主張したのです。",
    "guide": "時や条件を示す部分を先に受け、そのあと主な出来事へ進みます。",
    "narrationSegments": [
      {
        "original": "It was the best of times,",
        "translation": "それは最良の時代でした、",
        "speech": "It was the best of times,"
      },
      {
        "original": "it was the worst of times,",
        "translation": "それは最悪の時代でした、",
        "speech": "it was the worst of times,"
      },
      {
        "original": "it was the age of wisdom,",
        "translation": "それは知恵の時代でした、",
        "speech": "it was the age of wisdom,"
      },
      {
        "original": "it was the age of foolishness,",
        "translation": "それは愚かさの時代でした、",
        "speech": "it was the age of foolishness,"
      },
      {
        "original": "it was the epoch of belief,",
        "translation": "それは信仰の時代でした、",
        "speech": "it was the epoch of belief,"
      },
      {
        "original": "it was the epoch of incredulity,",
        "translation": "それは不信の時代でした、",
        "speech": "it was the epoch of incredulity,"
      },
      {
        "original": "it was the season of Light,",
        "translation": "それは光の季節でした、",
        "speech": "it was the season of Light,"
      },
      {
        "original": "it was the season of Darkness,",
        "translation": "それは暗黒の季節でした、",
        "speech": "it was the season of Darkness,"
      },
      {
        "original": "it was the spring of hope,",
        "translation": "それは希望の春でした、",
        "speech": "it was the spring of hope,"
      },
      {
        "original": "it was the winter of despair,",
        "translation": "それは絶望の冬でした、",
        "speech": "it was the winter of despair,"
      },
      {
        "original": "we had everything before us, we had nothing before us,",
        "translation": "私たちはすべてを手にしていました、私たちは何も手にしていませんでした、",
        "speech": "we had everything before us, we had nothing before us,"
      },
      {
        "original": "we were all going direct to Heaven,",
        "translation": "私たちは皆、まっすぐ天国に向かっていました、",
        "speech": "we were all going direct to Heaven,"
      },
      {
        "original": "we were all going direct the other way —",
        "translation": "私たちは皆、まっすぐ反対方向に向かっていました —",
        "speech": "we were all going direct the other way —"
      },
      {
        "original": "in short, the period was so far like the present period,",
        "translation": "簡単に言えば、その時代は現在の時代に非常に似ていました、",
        "speech": "in short, the period was so far like the present period,"
      },
      {
        "original": "that some of its noisiest authorities insisted on its being received,",
        "translation": "そのため、最も騒がしい権威者の一部は、それを受け入れることを主張しました、",
        "speech": "that some of its noisiest authorities insisted on its being received,"
      },
      {
        "original": "for good or for evil, in the superlative degree of comparison only.",
        "translation": "善であれ悪であれ、比較の最上級でのみ。",
        "speech": "for good or for evil, in the superlative degree of comparison only."
      }
    ]
  },
  {
    "original": "There were a king with a large jaw and a queen with a plain face, on the throne of England; there were a king with a large jaw and a queen with a fair face, on the throne of France. In both countries it was clearer than crystal to the lords of the State preserves of loaves and fishes, that things in general were settled for ever.",
    "translation": "イングランドの王位には、大きなあごの王と、目立たない顔の女王がいた；フランスの王位には、大きなあごの王と、美しい顔の女王がいた。両国の状態管理に携わる領主たちにとって、一般的なことは永遠に決まっていることは、水晶よりも明らかであった。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "There were a king with a large jaw",
        "translation": "大きなあごを持つ王がいた",
        "speech": "There were a king with a large jaw"
      },
      {
        "original": "and a queen with a plain face, on the throne of England;",
        "translation": "そして、平凡な顔をした女王が、イングランドの王座にいた。",
        "speech": "and a queen with a plain face, on the throne of England;"
      },
      {
        "original": "there were a king with a large jaw",
        "translation": "大きなあごを持つ王がいた",
        "speech": "there were a king with a large jaw"
      },
      {
        "original": "and a queen with a fair face, on the throne of France.",
        "translation": "そして、美しい顔をした女王が、フランスの王座にいた。",
        "speech": "and a queen with a fair face, on the throne of France."
      },
      {
        "original": "In both countries it was clearer than crystal",
        "translation": "両国において、それはクリスタルよりも明らかだった",
        "speech": "In both countries it was clearer than crystal"
      },
      {
        "original": "to the lords of the State preserves of loaves and fishes,",
        "translation": "国家のパンと魚の保護者である貴族たちにとって、",
        "speech": "to the lords of the State preserves of loaves and fishes,"
      },
      {
        "original": "that things in general were settled for ever.",
        "translation": "物事は概して永遠に定まっているということが。",
        "speech": "that things in general were settled for ever."
      }
    ]
  },
  {
    "original": "It was the year of Our Lord one thousand seven hundred and seventy-five. Spiritual revelations were conceded to England at that favoured period, as at this. Mrs. Southcott had recently attained her five-and-twentieth blessed birthday, of whom a prophetic private in the Life Guards had heralded the sublime appearance by announcing that arrangements were made for the swallowing up of London and Westminster. Even the Cock-lane ghost had been laid only a round dozen of years, after rapping out its messages, as the spirits of this very year last past (supernaturally deficient in originality) rapped out theirs.",
    "translation": "それは我らが主の年、一千七百七十五年のことであった。霊的な啓示は、この好機においても、当時のイングランドに与えられていた。サウスコット夫人は最近、五百二十五歳の祝福された誕生日を迎えたところであり、ライフガーズの予言的な一等兵が、ロンドンとウェストミンスターを飲み込む計画が整ったことを告げることで、彼女の崇高な出現を予告していた。その象徴的な出来事として、コック・レインの幽霊さえ、自らのメッセージをノックしてからほんの12年ほどで鎮まったのであり、昨年同様（超自然的に独創性に欠ける）霊たちもまた、自分たちのメッセージをノックで伝えていたのである。",
    "guide": "時や条件を示す部分を先に受け、そのあと主な出来事へ進みます。",
    "narrationSegments": [
      {
        "original": "It was the year of Our Lord one thousand seven hundred",
        "translation": "それは西暦1775年のことであった。",
        "speech": "It was the year of Our Lord one thousand seven hundred"
      },
      {
        "original": "and seventy-five. Spiritual revelations were conceded to England at that favoured period,",
        "translation": "その恵まれた時期に、イングランドには霊的啓示が授けられた、",
        "speech": "and seventy-five. Spiritual revelations were conceded to England at that favoured period,"
      },
      {
        "original": "as at this.",
        "translation": "この時期と同様に。",
        "speech": "as at this."
      },
      {
        "original": "Mrs. Southcott had recently attained her five-and-twentieth blessed birthday,",
        "translation": "サウスコット夫人は最近25回目の祝福された誕生日を迎えたところで、",
        "speech": "Mrs. Southcott had recently attained her five-and-twentieth blessed birthday,"
      },
      {
        "original": "of whom a prophetic private",
        "translation": "その人物について、予言的な個人が",
        "speech": "of whom a prophetic private"
      },
      {
        "original": "in the Life Guards had heralded the sublime appearance",
        "translation": "ライフガーズにおいて荘厳な出現を告げた、",
        "speech": "in the Life Guards had heralded the sublime appearance"
      },
      {
        "original": "by announcing that arrangements were made",
        "translation": "ロンドンとウェストミンスターが飲み込まれる準備が整ったと",
        "speech": "by announcing that arrangements were made"
      },
      {
        "original": "for the swallowing up of London and Westminster.",
        "translation": "発表することによって。",
        "speech": "for the swallowing up of London and Westminster."
      },
      {
        "original": "Even the Cock-lane ghost had been laid only a round dozen",
        "translation": "コックレーンの幽霊でさえ、メッセージを叩き出してから",
        "speech": "Even the Cock-lane ghost had been laid only a round dozen"
      },
      {
        "original": "of years, after rapping out its messages,",
        "translation": "ちょうど12年後に鎮められた、",
        "speech": "of years, after rapping out its messages,"
      },
      {
        "original": "as the spirits of this very year last past (supernaturally deficient",
        "translation": "この前の年の幽霊たちが（超自然的に独創性に欠けていた）",
        "speech": "as the spirits of this very year last past (supernaturally deficient"
      },
      {
        "original": "in originality) rapped out theirs.",
        "translation": "彼らのメッセージを叩き出したのと同じように。",
        "speech": "in originality) rapped out theirs."
      }
    ]
  },
  {
    "original": "Mere messages in the earthly order of events had lately come to the English Crown and People, from a congress of British subjects in America: which, strange to relate, have proved more important to the human race than any communications yet received through any of the chickens of the Cock-lane brood.",
    "translation": "最近、イギリス国王と国民には、アメリカのイギリス臣民の会議から地上の出来事の順序に関する単なるメッセージが届いた。奇妙なことに、このメッセージは、これまでコックレーン家の鶏たちを通じて受け取ったどの通信よりも人類にとって重要であることが判明した。",
    "guide": "逆接の前後で、人物の考えや場面がどう変わるかを比べます。",
    "narrationSegments": [
      {
        "original": "Mere messages in the earthly order",
        "translation": "最近、地上の秩序における単なる消息が",
        "speech": "Mere messages in the earthly order"
      },
      {
        "original": "of events had lately come to the English Crown and People,",
        "translation": "イギリスの王冠と国民に届いた、",
        "speech": "of events had lately come to the English Crown and People,"
      },
      {
        "original": "from a congress of British subjects in America:",
        "translation": "アメリカのイギリス臣民による会議からのものである：",
        "speech": "from a congress of British subjects in America:"
      },
      {
        "original": "which, strange to relate,",
        "translation": "奇妙なことに、",
        "speech": "which, strange to relate,"
      },
      {
        "original": "have proved more important to the human race than any communications",
        "translation": "これまでにコック・レーンの一派の鶏たちから受け取ったどの通信よりも",
        "speech": "have proved more important to the human race than any communications"
      },
      {
        "original": "yet received through any of the chickens of the Cock-lane brood.",
        "translation": "人類にとって重要であることが証明された。",
        "speech": "yet received through any of the chickens of the Cock-lane brood."
      }
    ]
  },
  {
    "original": "France, less favoured on the whole as to matters spiritual than her sister of the shield and trident, rolled with exceeding smoothness down hill, making paper money and spending it. Under the guidance of her Christian pastors, she entertained herself, besides, with such humane achievements as sentencing a youth to have his hands cut off, his tongue torn out with pincers, and his body burned alive, because he had not kneeled down in the rain to do honour to a dirty procession of monks which passed within his view, at a distance of some fifty or sixty yards.",
    "translation": "フランスは、盾と三叉槍の姉妹よりも精神的な面であまり好まれなかったが、非常に滑らかに坂を転がり落ち、紙幣を稼ぎ、それを使い果たした。キリスト教の牧師たちの指導のもと、彼女は自分を楽しませ、さらに若者を雨の中でひざまずいて汚れた修道士の行列に敬意を払わなかったために手を切り落とし、舌をハサミで引きちぎり、生きたまま焼き殺すという人道的な行為を行った。 約50〜60ヤードの距離で。",
    "guide": "出来事が起きた順に、人物・場所・動作を結びつけて読みます。",
    "narrationSegments": [
      {
        "original": "France, less favoured on the whole as",
        "translation": "フランスは、全体として霊的な事柄に関しては、",
        "speech": "France, less favoured on the whole as"
      },
      {
        "original": "to matters spiritual than her sister of the shield and trident,",
        "translation": "盾と三叉槍の姉妹ほど恵まれてはいなかったが、",
        "speech": "to matters spiritual than her sister of the shield and trident,"
      },
      {
        "original": "rolled with exceeding smoothness down hill, making paper money and spending it.",
        "translation": "非常に滑らかに坂を転がるように、紙幣を作り、それを使っていた。",
        "speech": "rolled with exceeding smoothness down hill, making paper money and spending it."
      },
      {
        "original": "Under the guidance of her Christian pastors,",
        "translation": "キリスト教の牧師たちの指導の下、",
        "speech": "Under the guidance of her Christian pastors,"
      },
      {
        "original": "she entertained herself, besides,",
        "translation": "その上、彼女は、",
        "speech": "she entertained herself, besides,"
      },
      {
        "original": "with such humane achievements as sentencing a youth",
        "translation": "若者の手を切断する刑を科すといったような人道的業績に",
        "speech": "with such humane achievements as sentencing a youth"
      },
      {
        "original": "to have his hands cut off,",
        "translation": "楽しみを見出していた。",
        "speech": "to have his hands cut off,"
      },
      {
        "original": "his tongue torn out with pincers,",
        "translation": "彼の舌はペンチで引き裂かれ、",
        "speech": "his tongue torn out with pincers,"
      },
      {
        "original": "and his body burned alive,",
        "translation": "彼の体は生きたまま焼かれた、",
        "speech": "and his body burned alive,"
      },
      {
        "original": "because he had not kneeled down in the rain",
        "translation": "彼が雨の中でひざまずき",
        "speech": "because he had not kneeled down in the rain"
      },
      {
        "original": "to do honour to a dirty procession",
        "translation": "汚れた僧侶の行列に敬意を表さなかったからである、",
        "speech": "to do honour to a dirty procession"
      },
      {
        "original": "of monks which passed within his view,",
        "translation": "その行列は彼の視界の中を通り過ぎた、",
        "speech": "of monks which passed within his view,"
      },
      {
        "original": "at a distance of some fifty or sixty yards.",
        "translation": "およそ50ヤードから60ヤードの距離で。",
        "speech": "at a distance of some fifty or sixty yards."
      }
    ]
  },
  {
    "original": "It is likely enough that, rooted in the woods of France and Norway, there were growing trees, when that sufferer was put to death, already marked by the Woodman, Fate, to come down and be sawn into boards, to make a certain movable framework with a sack and a knife in it, terrible in history. It is likely enough that in the rough outhouses of some tillers of the heavy lands adjacent to Paris, there were sheltered from the weather that very day, rude carts, bespattered with rustic mire, snuffed about by pigs, and roosted in by poultry, which the Farmer, Death, had already set apart to be his tumbrils of the Revolution.",
    "translation": "フランスやノルウェーの森に根を下ろした木々がすでに育っていた頃には、その苦しむ者が処刑される運命にあったとしても、それらの木々はすでに木こり、すなわち運命によって、倒され板にされ、袋とナイフが入ったある動かせる枠組みを作るために使われることが定められていた、というのは歴史上恐ろしい話である。パリ近郊の重い土地を耕す農夫たちの粗末な物置には、その非常にその日に、悪天候から守られたまま、粗野な泥にまみれ、豚に嗅ぎまわられ、家禽に止まり木として使われる素朴な荷車があった。それらは農夫である死がすでに選び分け、革命の運搬台車にすることが定められていたのだ。」",
    "guide": "時や条件を示す部分を先に受け、そのあと主な出来事へ進みます。",
    "narrationSegments": [
      {
        "original": "It is likely enough that,",
        "translation": "十分にあり得ることで、",
        "speech": "It is likely enough that,"
      },
      {
        "original": "rooted in the woods of France and Norway,",
        "translation": "フランスやノルウェーの森に根を下ろしていた木々が、",
        "speech": "rooted in the woods of France and Norway,"
      },
      {
        "original": "there were growing trees, when that sufferer was put to death,",
        "translation": "あの苦しむ者が処刑されるときにはすでに育っていたということだ、",
        "speech": "there were growing trees, when that sufferer was put to death,"
      },
      {
        "original": "already marked by the Woodman, Fate,",
        "translation": "すでに木こりである運命によって印がつけられ、",
        "speech": "already marked by the Woodman, Fate,"
      },
      {
        "original": "to come down and be sawn into boards,",
        "translation": "切り倒されて板に引かれる運命だったのである、",
        "speech": "to come down and be sawn into boards,"
      },
      {
        "original": "to make a certain movable framework with a sack",
        "translation": "袋とその中のナイフを備えたある可動式の枠組みを作るため、",
        "speech": "to make a certain movable framework with a sack"
      },
      {
        "original": "and a knife in it, terrible in history.",
        "translation": "歴史の中で恐ろしいものである。",
        "speech": "and a knife in it, terrible in history."
      },
      {
        "original": "It is likely enough that in the rough outhouses",
        "translation": "十分にあり得ることで、粗末な納屋の中に、",
        "speech": "It is likely enough that in the rough outhouses"
      },
      {
        "original": "of some tillers of the heavy lands adjacent to Paris,",
        "translation": "パリに隣接する重い土地の耕作者の中に、",
        "speech": "of some tillers of the heavy lands adjacent to Paris,"
      },
      {
        "original": "there were sheltered from the weather that very day,",
        "translation": "そのまさにその日に天候から守られたように、",
        "speech": "there were sheltered from the weather that very day,"
      },
      {
        "original": "rude carts, bespattered with rustic mire,",
        "translation": "粗雑な泥で汚れた素朴な荷車が、",
        "speech": "rude carts, bespattered with rustic mire,"
      },
      {
        "original": "snuffed about by pigs, and roosted in by poultry,",
        "translation": "豚に嗅ぎ回され、鶏に止まり木にされ、",
        "speech": "snuffed about by pigs, and roosted in by poultry,"
      },
      {
        "original": "which the Farmer, Death,",
        "translation": "農夫である死によって、",
        "speech": "which the Farmer, Death,"
      },
      {
        "original": "had already set apart to be his tumbrils of the Revolution.",
        "translation": "すでに革命のための自分の荷車として取り分けられていた。",
        "speech": "had already set apart to be his tumbrils of the Revolution."
      }
    ]
  },
  {
    "original": "But that Woodman and that Farmer, though they work unceasingly, work silently, and no one heard them as they went about with muffled tread: the rather, forasmuch as to entertain any suspicion that they were awake, was to be atheistical and traitorous.",
    "translation": "しかし、その木こりとその農夫は、絶え間なく働いているにもかかわらず、静かに働き、彼らが重く覆われた足取りで歩いているのを誰も聞かなかった。むしろ、彼らが目覚めているのではないかと疑うことは、無神論的であり反逆的であると見なされるほどだった。",
    "guide": "逆接の前後で、人物の考えや場面がどう変わるかを比べます。",
    "narrationSegments": [
      {
        "original": "But that Woodman and that Farmer,",
        "translation": "しかし、あの木こりとあの農夫は、",
        "speech": "But that Woodman and that Farmer,"
      },
      {
        "original": "though they work unceasingly, work silently,",
        "translation": "絶え間なく働いているにもかかわらず、静かに働き、",
        "speech": "though they work unceasingly, work silently,"
      },
      {
        "original": "and no one heard them as they went about with muffled tread:",
        "translation": "だれも彼らが音を立てずに歩き回るのを聞くことはなかった：",
        "speech": "and no one heard them as they went about with muffled tread:"
      },
      {
        "original": "the rather, forasmuch as to entertain any suspicion that they were awake,",
        "translation": "むしろ、彼らが目覚めているのではないかと疑うことは、",
        "speech": "the rather, forasmuch as to entertain any suspicion that they were awake,"
      },
      {
        "original": "was to be atheistical and traitorous.",
        "translation": "無神論的で反逆的であると見なされることだった。",
        "speech": "was to be atheistical and traitorous."
      }
    ]
  },
  {
    "original": "In England, there was scarcely an amount of order and protection to justify much national boasting. Daring burglaries by armed men, and highway robberies, took place in the capital itself every night; families were publicly cautioned not to go out of town without removing their furniture to upholsterers’ warehouses for security; the highwayman in the dark was a City tradesman in the light, and, being recognised and challenged by his fellow-tradesman whom he stopped in his character of “the Captain,” gallantly shot him through the head and rode away;",
    "translation": "イングランドでは、国民的な誇示を正当化するほどの秩序や保護はほとんど存在しませんでした。首都では武装した男たちによる大胆な強盗や高速道路強盗が毎晩起きていた。家族には、安全のために家具を張り替え職人の倉庫に運ぶ前に町を出るよう公に注意が促されました。暗闇の中の強盗は街の商人であり、仲間の商人たちに見つかり「キャプテン」として立ち止まり、勇敢に頭を撃ち抜いて馬で逃げ去った。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "In England, there was scarcely an amount",
        "translation": "イングランドでは、",
        "speech": "In England, there was scarcely an amount"
      },
      {
        "original": "of order and protection to justify much national boasting.",
        "translation": "国を誇るほどの秩序や保護はほとんど存在しませんでした。",
        "speech": "of order and protection to justify much national boasting."
      },
      {
        "original": "Daring burglaries by armed men, and highway robberies,",
        "translation": "武装した男たちによる大胆な強盗や高速道路強盗、",
        "speech": "Daring burglaries by armed men, and highway robberies,"
      },
      {
        "original": "took place in the capital itself every night;",
        "translation": "首都内で毎晩発生していた;",
        "speech": "took place in the capital itself every night;"
      },
      {
        "original": "families were publicly cautioned not to go out",
        "translation": "家族は公開に警告されました",
        "speech": "families were publicly cautioned not to go out"
      },
      {
        "original": "of town without removing their furniture to upholsterers’ warehouses for security;",
        "translation": "外出時には家具を張り替え職人の倉庫に持ち",
        "speech": "of town without removing their furniture to upholsterers’ warehouses for security;"
      },
      {
        "original": "the highwayman in the dark was a City tradesman in the light,",
        "translation": "暗闇の中のハイウェイマンは光の中の市の商人であり、",
        "speech": "the highwayman in the dark was a City tradesman in the light,"
      },
      {
        "original": "and, being recognised and challenged",
        "translation": "そして",
        "speech": "and, being recognised and challenged"
      },
      {
        "original": "by his fellow-tradesman whom he stopped in his character of “the Captain,”",
        "translation": "彼は「キャプテン」の役で止めた。",
        "speech": "by his fellow-tradesman whom he stopped in his character of “the Captain,”"
      },
      {
        "original": "gallantly shot him through the head and rode away;",
        "translation": "勇敢に彼の頭を撃ち抜き、馬で逃げ去った。",
        "speech": "gallantly shot him through the head and rode away;"
      }
    ]
  },
  {
    "original": "the mail was waylaid by seven robbers, and the guard shot three dead, and then got shot dead himself by the other four, “in consequence of the failure of his ammunition:” after which the mail was robbed in peace; that magnificent potentate, the Lord Mayor of London, was made to stand and deliver on Turnham Green, by one highwayman, who despoiled the illustrious creature in sight of all his retinue; prisoners in London gaols fought battles with their turnkeys, and the majesty of the law fired blunderbusses in among them, loaded with rounds of shot and ball; thieves snipped off diamond crosses from the necks of noble lords at Court drawing-rooms;",
    "translation": "郵便馬車は七人の強盗に待ち伏せされ、護衛は三人を射殺したものの、「弾薬が尽きたため」残る四人に撃ち殺された。その後、郵便馬車は悠々と略奪された。ロンドン市長という大権力者さえ、一人の追いはぎにターンハム・グリーンで金品を差し出させられ、従者一同の目の前で略奪された。ロンドンの監獄では囚人と看守が戦い、法の権威は散弾と丸弾を込めた大型銃を囚人たちへ撃ち込んだ。盗賊は宮廷の応接室で貴族の首からダイヤの十字架を切り取った。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "the mail was waylaid by seven robbers,",
        "translation": "郵便は七人の強盗に襲われた、",
        "speech": "the mail was waylaid by seven robbers,"
      },
      {
        "original": "and the guard shot three dead,",
        "translation": "そして護衛は三人を撃ち殺した、",
        "speech": "and the guard shot three dead,"
      },
      {
        "original": "and then got shot dead himself by the other four,",
        "translation": "その後、残りの四人に撃たれて護衛自身も殺された、",
        "speech": "and then got shot dead himself by the other four,"
      },
      {
        "original": "“in consequence of the failure of his ammunition:”",
        "translation": "「弾薬の不足により：」",
        "speech": "“in consequence of the failure of his ammunition:”"
      },
      {
        "original": "after which the mail was robbed in peace;",
        "translation": "その後、郵便は平穏に強奪された;",
        "speech": "after which the mail was robbed in peace;"
      },
      {
        "original": "that magnificent potentate, the Lord Mayor of London,",
        "translation": "あの壮麗な君主、ロンドン市長は、",
        "speech": "that magnificent potentate, the Lord Mayor of London,"
      },
      {
        "original": "was made to stand and deliver on Turnham Green,",
        "translation": "ターンハム・グリーンで立たされ、持ち物を差し出す羽目になった、",
        "speech": "was made to stand and deliver on Turnham Green,"
      },
      {
        "original": "by one highwayman,",
        "translation": "一人の高速道路の強盗によって、",
        "speech": "by one highwayman,"
      },
      {
        "original": "who despoiled the illustrious creature in sight of all his retinue;",
        "speech": "who despoiled the illustrious creature in sight of all his retinue;",
        "translation": "彼の従者全員の目の前でその有名な生き物を略奪した;"
      },
      {
        "original": "prisoners in London gaols fought battles with their turnkeys,",
        "translation": "ロンドンの牢獄の囚人たちは看守と戦いを繰り広げ、",
        "speech": "prisoners in London gaols fought battles with their turnkeys,"
      },
      {
        "original": "and the majesty of the law fired blunderbusses in among them,",
        "translation": "そして法の威厳は彼らの中に散弾銃を撃ち込んだ、",
        "speech": "and the majesty of the law fired blunderbusses in among them,"
      },
      {
        "original": "loaded with rounds of shot and ball;",
        "translation": "散弾と弾丸で満たされた;",
        "speech": "loaded with rounds of shot and ball;"
      },
      {
        "original": "thieves snipped off diamond crosses from the necks",
        "translation": "泥棒たちは宮廷の応接間で高貴な貴族の首からダイヤモンドの十字架を切り取った;",
        "speech": "thieves snipped off diamond crosses from the necks"
      },
      {
        "original": "of noble lords at Court drawing-rooms;",
        "translation": "宮廷の応接室にいた貴族たちの首から。",
        "speech": "of noble lords at Court drawing-rooms;"
      }
    ]
  },
  {
    "original": "musketeers went into St. Giles’s, to search for contraband goods, and the mob fired on the musketeers, and the musketeers fired on the mob, and nobody thought any of these occurrences much out of the common way. In the midst of them, the hangman, ever busy and ever worse than useless, was in constant requisition; now, stringing up long rows of miscellaneous criminals; now, hanging a housebreaker on Saturday who had been taken on Tuesday; now, burning people in the hand at Newgate by the dozen, and now burning pamphlets at the door of Westminster Hall; to-day, taking the life of an atrocious murderer, and to-morrow of a wretched pilferer who had robbed a farmer’s boy of sixpence.",
    "translation": "銃士隊が密輸品を捜しにセント・ジャイルズへ入ると、群衆が銃士隊を撃ち、銃士隊も群衆を撃ったが、だれもこうした出来事を日常から大きく外れたものとは思わなかった。そのさなか、死刑執行人は絶えず忙しく、役に立たないどころか害をなしながら、いつも呼び出された。雑多な犯罪者を長い列でつるし、火曜に捕えた押し込み強盗を土曜には絞首刑にし、ニューゲートでは一度に十数人の手へ焼き印を押し、ウェストミンスター・ホールの扉ではパンフレットを焼いた。今日は凶悪な殺人犯の命を奪い、明日は農家の少年から六ペンスを奪った哀れなこそ泥の命を奪った。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "musketeers went into St. Giles’s, to search for contraband goods,",
        "translation": "銃士隊が密輸品を捜しにセント・ジャイルズへ入り、",
        "speech": "musketeers went into St. Giles’s, to search for contraband goods,"
      },
      {
        "original": "and the mob fired on the musketeers,",
        "translation": "そして群衆は銃士隊に発砲し、",
        "speech": "and the mob fired on the musketeers,"
      },
      {
        "original": "and the musketeers fired on the mob,",
        "translation": "銃士隊は群衆に発砲し、",
        "speech": "and the musketeers fired on the mob,"
      },
      {
        "original": "and nobody thought any of these occurrences much out",
        "translation": "そして誰もこれらの出来事が特におかしいとは思わなかった",
        "speech": "and nobody thought any of these occurrences much out"
      },
      {
        "original": "of the common way.",
        "translation": "一般的な方法の中で。",
        "speech": "of the common way."
      },
      {
        "original": "In the midst of them, the hangman,",
        "translation": "その中で、死刑執行人が、",
        "speech": "In the midst of them, the hangman,"
      },
      {
        "original": "ever busy and ever worse than useless, was in constant requisition;",
        "translation": "常に忙しく、役に立たないどころかさらに悪い状態で、常に呼び出されていた;",
        "speech": "ever busy and ever worse than useless, was in constant requisition;"
      },
      {
        "original": "now, stringing up long rows of miscellaneous criminals;",
        "translation": "今、さまざまな犯罪者を長い列につるしている；",
        "speech": "now, stringing up long rows of miscellaneous criminals;"
      },
      {
        "original": "now, hanging a housebreaker on Saturday who had been taken on Tuesday;",
        "translation": "今、火曜日に捕まった強盗を土曜日に吊るしている；",
        "speech": "now, hanging a housebreaker on Saturday who had been taken on Tuesday;"
      },
      {
        "original": "now, burning people in the hand at Newgate by the dozen,",
        "translation": "今、ニューゲートで人々の手を十数人単位で焼いている、",
        "speech": "now, burning people in the hand at Newgate by the dozen,"
      },
      {
        "original": "and now burning pamphlets at the door of Westminster Hall;",
        "translation": "そして今、ウェストミンスター・ホールの扉の前でパンフレットを焼いている；",
        "speech": "and now burning pamphlets at the door of Westminster Hall;"
      },
      {
        "original": "to-day, taking the life of an atrocious murderer,",
        "translation": "今日、恐ろしい殺人者の命を奪い、",
        "speech": "to-day, taking the life of an atrocious murderer,"
      },
      {
        "original": "and to-morrow of a wretched pilferer",
        "translation": "明日、みじめな泥棒の命を奪う",
        "speech": "and to-morrow of a wretched pilferer"
      },
      {
        "original": "who had robbed a farmer’s boy of sixpence.",
        "translation": "農夫の少年から六ペンスを奪った者の命を。",
        "speech": "who had robbed a farmer’s boy of sixpence."
      }
    ]
  },
  {
    "original": "All these things, and a thousand like them, came to pass in and close upon the dear old year one thousand seven hundred and seventy-five. Environed by them, while the Woodman and the Farmer worked unheeded, those two of the large jaws, and those other two of the plain and the fair faces, trod with stir enough, and carried their divine rights with a high hand. Thus did the year one thousand seven hundred and seventy-five conduct their Greatnesses, and myriads of small creatures — the creatures of this chronicle among the rest — along the roads that lay before them.",
    "translation": "これらすべてのこと、そしてそれに類する千のことが、親愛なる古き年、一七七五年に起こった。その中に囲まれながら、木こりと農夫が気にかけず働いている間に、大きな顎を持つ二人、そして平凡で美しい顔を持つもう二人は、十分に活気をもって歩み、その神聖な権利を高慢に行使した。このようにして、一七七五年は彼ら偉大なる者たちと、無数の小さき生き物たち――この年代記に記される生き物たちもその一部――を、彼らの前に広がる道に沿って導いたのである。",
    "guide": "時や条件を示す部分を先に受け、そのあと主な出来事へ進みます。",
    "narrationSegments": [
      {
        "original": "All these things, and a thousand like them,",
        "translation": "これらすべてのこと、そしてそれに似た千のことが、",
        "speech": "All these things, and a thousand like them,"
      },
      {
        "original": "came to pass in",
        "translation": "起こったのは",
        "speech": "came to pass in"
      },
      {
        "original": "and close upon the dear old year one thousand seven hundred",
        "translation": "愛しい古き年、千七百",
        "speech": "and close upon the dear old year one thousand seven hundred"
      },
      {
        "original": "and seventy-five. Environed by them,",
        "translation": "七十五年の末でした。彼らに囲まれ、",
        "speech": "and seventy-five. Environed by them,"
      },
      {
        "original": "while the Woodman and the Farmer worked unheeded,",
        "translation": "木こりや農夫が無視されて働いている間、",
        "speech": "while the Woodman and the Farmer worked unheeded,"
      },
      {
        "original": "those two of the large jaws,",
        "translation": "その大きな顎の二人が、",
        "speech": "those two of the large jaws,"
      },
      {
        "original": "and those other two of the plain and the fair faces,",
        "translation": "そしてあの平凡で美しい顔の二人が、",
        "speech": "and those other two of the plain and the fair faces,"
      },
      {
        "original": "trod with stir enough,",
        "translation": "十分な騒ぎで踏み進み、",
        "speech": "trod with stir enough,"
      },
      {
        "original": "and carried their divine rights with a high hand.",
        "translation": "自らの神聖な権利を高慢に振るいました。",
        "speech": "and carried their divine rights with a high hand."
      },
      {
        "original": "Thus did the year one thousand seven hundred",
        "translation": "かくして千七百",
        "speech": "Thus did the year one thousand seven hundred"
      },
      {
        "original": "and seventy-five conduct their Greatnesses, and myriads of small creatures —",
        "translation": "七十五年は、偉大なる彼らたちと無数の小さな生き物たちを―",
        "speech": "and seventy-five conduct their Greatnesses, and myriads of small creatures —"
      },
      {
        "original": "the creatures of this chronicle among the rest —",
        "translation": "この年代記の生き物たちも含めて―",
        "speech": "the creatures of this chronicle among the rest —"
      },
      {
        "original": "along the roads that lay before them.",
        "translation": "彼らの前に広がる道に沿って導きました。",
        "speech": "along the roads that lay before them."
      }
    ]
  }
]

const work = {
  "id": "lit_en_tale_two_cities_times",
  "excerpt": "Book the First, Chapter I・第1章全文",
  "coverage": {
    "unitType": "chapter",
    "label": "第1章全文",
    "sourceUnit": "Book the First, Chapter I: The Period",
    "complete": true,
    "sourceWordCount": 1015,
    "maxWordTarget": 5000,
    "limitNote": "長編のため、5,000語以内で完結する第1章を全文収録",
    "startMarker": "It was the best of times, it was the worst of times, it was the age of wisdom, i",
    "endMarker": "l creatures — the creatures of this chronicle among the rest — along the roads that lay before them.",
    "sourceSha256": "36c18eaad0a58a76426407cef9698deb40a3717204abb38ac61b4458e66403b1",
    "checkedOn": "2026-08-27"
  }
}

export default deepFreeze({ ...work, scenes })
