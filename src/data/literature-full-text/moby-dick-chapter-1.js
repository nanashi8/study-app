// Project Gutenbergの原文を、章・短編の完結単位で収録する。
const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  Object.values(value).forEach(deepFreeze)
  return Object.freeze(value)
}

const scenes = [
  {
    "original": "Call me Ishmael. Some years ago — never mind how long precisely — having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet;",
    "translation": "私の名はイシュマエル。何年か前のことだ——正確にどれくらいかはどうでもいい——、私の財布にはほとんどまたはまったく金がなく、陸で特に興味を引くものもなかったので、少し航海に出て世界の水の部分を見てみようと思った。それは私が憂鬱を追い払い、血液の循環を整えるための方法なのだ。口元が陰鬱になっているのに気づくたび、魂の中がじめじめとした小雨の降る十一月のように感じるたび、無意識のうちに棺桶屋の前で立ち止まり、出会うすべての葬列の後ろにつくたび、",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "Call me Ishmael.",
        "translation": "私の名はイシュメルと呼んでください。",
        "speech": "Call me Ishmael."
      },
      {
        "original": "Some years ago —",
        "translation": "数年前のことです——",
        "speech": "Some years ago —"
      },
      {
        "original": "never mind how long precisely —",
        "translation": "正確にどれくらいかは気にしないでください——",
        "speech": "never mind how long precisely —"
      },
      {
        "original": "having little or no money in my purse,",
        "translation": "財布にほとんどお金がなく、",
        "speech": "having little or no money in my purse,"
      },
      {
        "original": "and nothing particular to interest me on shore,",
        "translation": "陸上で特に興味を引くものもなかったので、",
        "speech": "and nothing particular to interest me on shore,"
      },
      {
        "original": "I thought I would sail about a little",
        "translation": "少し航海に出てみようと思いました",
        "speech": "I thought I would sail about a little"
      },
      {
        "original": "and see the watery part of the world.",
        "translation": "そして世界の水の部分を見てみようと思ったのです。",
        "speech": "and see the watery part of the world."
      },
      {
        "original": "It is a way I have",
        "translation": "これは私の習慣で、",
        "speech": "It is a way I have"
      },
      {
        "original": "of driving off the spleen and regulating the circulation.",
        "translation": "憂鬱を追い払い、血液の循環を整える方法です。",
        "speech": "of driving off the spleen and regulating the circulation."
      },
      {
        "original": "Whenever I find myself growing grim about the mouth;",
        "translation": "口元が険しくなるのを感じたときにはいつでも、",
        "speech": "Whenever I find myself growing grim about the mouth;"
      },
      {
        "original": "whenever it is a damp, drizzly November in my soul;",
        "translation": "魂の中で湿った霧のような十一月を感じるときにはいつでも、",
        "speech": "whenever it is a damp, drizzly November in my soul;"
      },
      {
        "original": "whenever I find myself involuntarily pausing before coffin warehouses,",
        "translation": "無意識に棺桶を扱う倉庫の前で立ち止まってしまうときにはいつでも、",
        "speech": "whenever I find myself involuntarily pausing before coffin warehouses,"
      },
      {
        "original": "and bringing up the rear of every funeral I meet;",
        "translation": "出会うすべての葬式の最後に付き添ってしまうときにはいつでも、",
        "speech": "and bringing up the rear of every funeral I meet;"
      }
    ]
  },
  {
    "original": "and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off — then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.",
    "translation": "特に、私の突発的な気分が私を完全に支配してしまい、人々の帽子を計画的に叩き落とすためにわざと通りに飛び出さないよう強い道徳的原則が必要なほどのときは、できるだけ早く海に出るべき時だと考える。これが私のピストルや弾丸の代わりである。哲学的な華麗さをもってカトーは自らの剣に身を投げるが、私は静かに船に乗る。このことには何の驚きもない。もし彼らが知っていれば、ほとんどの人が、ある時点で、私とほぼ同じ気持ちで海に対して思い入れを抱いていることだろう。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "and especially whenever my hypos get such an upper hand of me,",
        "translation": "そして特に、私のハイポが私を完全に支配してしまうときには、",
        "speech": "and especially whenever my hypos get such an upper hand of me,"
      },
      {
        "original": "that it requires a strong moral principle",
        "translation": "それを防ぐには強い道徳的原則が必要で、",
        "speech": "that it requires a strong moral principle"
      },
      {
        "original": "to prevent me from deliberately stepping into the street,",
        "translation": "意図的に通りに出て行き、",
        "speech": "to prevent me from deliberately stepping into the street,"
      },
      {
        "original": "and methodically knocking people’s hats off —",
        "translation": "人々の帽子を計画的に吹き飛ばすのを防ぐためである—",
        "speech": "and methodically knocking people’s hats off —"
      },
      {
        "original": "then, I account it high time to get",
        "translation": "そのとき、私はできるだけ早く",
        "speech": "then, I account it high time to get"
      },
      {
        "original": "to sea as soon as I can.",
        "translation": "海に出るべき時だと考える。",
        "speech": "to sea as soon as I can."
      },
      {
        "original": "This is my substitute for pistol and ball.",
        "translation": "これは私のピストルや弾丸の代わりである。",
        "speech": "This is my substitute for pistol and ball."
      },
      {
        "original": "With a philosophical flourish Cato throws himself upon his sword;",
        "translation": "哲学的な華麗さでカトーは自ら剣に身を投じる;",
        "speech": "With a philosophical flourish Cato throws himself upon his sword;"
      },
      {
        "original": "I quietly take to the ship.",
        "translation": "私は静かに船に乗る。",
        "speech": "I quietly take to the ship."
      },
      {
        "original": "There is nothing surprising in this.",
        "translation": "このことには何の驚きもない。",
        "speech": "There is nothing surprising in this."
      },
      {
        "original": "If they but knew it,",
        "translation": "もし彼らがそれを知っていれば、",
        "speech": "If they but knew it,"
      },
      {
        "original": "almost all men in their degree,",
        "translation": "ほとんどすべての人は、",
        "speech": "almost all men in their degree,"
      },
      {
        "original": "some time or other,",
        "translation": "いつかは、",
        "speech": "some time or other,"
      },
      {
        "original": "cherish very nearly the same feelings towards the ocean with me.",
        "translation": "私とほぼ同じ気持ちで海を愛することを持っている。",
        "speech": "cherish very nearly the same feelings towards the ocean with me."
      }
    ]
  },
  {
    "original": "There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs — commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours previous were out of sight of land. Look at the crowds of water-gazers there.",
    "translation": "さあ、これがあなたのマンハッタの孤立した都市です。その周囲は桟橋で取り囲まれ、まるで珊瑚礁で囲まれたインディアン諸島のようです――商業がその波間に取り巻いています。右も左も、通りは水辺へと続きます。極端に downtown な場所はバッテリーであり、そこではあの壮麗な防波堤が波に洗われ、先ほどまで陸地の見えなかった風に冷やされています。そこで水を眺める群衆を見てください。",
    "guide": "反復される語と指示語の受け先を確かめ、場面のつながりを追います。",
    "narrationSegments": [
      {
        "original": "There now is your insular city of the Manhattoes,",
        "translation": "さて、そこにあなたのマナハッタ諸島の孤立した都市があります、",
        "speech": "There now is your insular city of the Manhattoes,"
      },
      {
        "original": "belted round by wharves as Indian isles by coral reefs —",
        "translation": "桟橋に囲まれた様子は、インディアン諸島が珊瑚礁に囲まれているようです —",
        "speech": "belted round by wharves as Indian isles by coral reefs —"
      },
      {
        "original": "commerce surrounds it with her surf.",
        "translation": "商業がその波の中に取り巻いています。",
        "speech": "commerce surrounds it with her surf."
      },
      {
        "original": "Right and left, the streets take you waterward.",
        "translation": "右にも左にも、通りはあなたを水辺へと導きます。",
        "speech": "Right and left, the streets take you waterward."
      },
      {
        "original": "Its extreme downtown is the battery,",
        "translation": "その極端なダウンタウンはバッテリーです、",
        "speech": "Its extreme downtown is the battery,"
      },
      {
        "original": "where that noble mole is washed by waves,",
        "translation": "あの立派な防波堤が波に洗われ、",
        "speech": "where that noble mole is washed by waves,"
      },
      {
        "original": "and cooled by breezes,",
        "translation": "そよ風で冷やされる場所です、",
        "speech": "and cooled by breezes,"
      },
      {
        "original": "which a few hours previous were out of sight of land.",
        "translation": "その風はほんの数時間前には陸上から見えない場所にありました。",
        "speech": "which a few hours previous were out of sight of land."
      },
      {
        "original": "Look at the crowds of water-gazers there.",
        "translation": "あそこにいる水を眺める群衆を見てください。",
        "speech": "Look at the crowds of water-gazers there."
      }
    ]
  },
  {
    "original": "Circumambulate the city of a dreamy Sabbath afternoon. Go from Corlears Hook to Coenties Slip, and from thence, by Whitehall, northward. What do you see? — Posted like silent sentinels all around the town, stand thousands upon thousands of mortal men fixed in ocean reveries. Some leaning against the spiles; some seated upon the pier-heads; some looking over the bulwarks of ships from China; some high aloft in the rigging, as if striving to get a still better seaward peep. But these are all landsmen; of week days pent up in lath and plaster — tied to counters, nailed to benches, clinched to desks. How then is this? Are the green fields gone? What do they here?",
    "translation": "夢見るような安息日の午後に街を回遊してみよ。コーレアーズフックからコーンティーズスリップへ、そしてそこからホワイトホールを通り北へ進む。何が見えるだろうか？ — 静かな哨兵のように町の周りに立つ、数えきれないほどの人間たちが海の夢想にふけっている。杭にもたれかかる者；桟橋の先に座る者；中国から来た船の舷側を覗き込む者；高くマストに登り、さらに良い海の景色を見ようとする者。しかし、これらは皆陸の人間である；平日は漆喰と木組みに閉じ込められ — カウンターに縛られ、ベンチに打ち付けられ、机に縛り付けられている。では、これはどういうことだろうか？ 緑の野原は消えたのだろうか？ 彼らはここで何をしているのだろう？",
    "guide": "続けて置かれた問いを一つずつ受け、語り手が考えを深める順を追います。",
    "narrationSegments": [
      {
        "original": "Circumambulate the city of a dreamy Sabbath afternoon.",
        "translation": "夢見心地の安息日の午後、街をぐるりと回りなさい。",
        "speech": "Circumambulate the city of a dreamy Sabbath afternoon."
      },
      {
        "original": "Go from Corlears Hook to Coenties Slip,",
        "translation": "コーリアーズ・フックからコエンティーズ・スリップへ、",
        "speech": "Go from Corlears Hook to Coenties Slip,"
      },
      {
        "original": "and from thence, by Whitehall, northward.",
        "translation": "そこからホワイトホールを通り、北へ行きなさい。",
        "speech": "and from thence, by Whitehall, northward."
      },
      {
        "original": "What do you see?",
        "translation": "何が見えますか？",
        "speech": "What do you see?"
      },
      {
        "original": "— Posted like silent sentinels all around the town,",
        "translation": "— 街のあちこちに静かな番人のように立って、",
        "speech": "— Posted like silent sentinels all around the town,"
      },
      {
        "original": "stand thousands upon thousands of mortal men fixed in ocean reveries.",
        "translation": "無数の人間たちが海の夢想にふけっています。",
        "speech": "stand thousands upon thousands of mortal men fixed in ocean reveries."
      },
      {
        "original": "Some leaning against the spiles;",
        "translation": "杭に寄りかかる者もいる;",
        "speech": "Some leaning against the spiles;"
      },
      {
        "original": "some seated upon the pier-heads;",
        "translation": "桟橋の先に座る者もいる;",
        "speech": "some seated upon the pier-heads;"
      },
      {
        "original": "some looking over the bulwarks of ships from China;",
        "translation": "中国から来た船の舷側を見つめる者もいる;",
        "speech": "some looking over the bulwarks of ships from China;"
      },
      {
        "original": "some high aloft in the rigging,",
        "translation": "高くマストの上にいる者もいる,",
        "speech": "some high aloft in the rigging,"
      },
      {
        "original": "as if striving to get a still better seaward peep.",
        "translation": "まるでさらに良い海の眺めを得ようとしているかのように。",
        "speech": "as if striving to get a still better seaward peep."
      },
      {
        "original": "But these are all landsmen;",
        "translation": "しかし、これらはすべて陸の人々です;",
        "speech": "But these are all landsmen;"
      },
      {
        "original": "of week days pent up in lath and plaster —",
        "translation": "平日の間、石膏と木片で閉じ込められ —",
        "speech": "of week days pent up in lath and plaster —"
      },
      {
        "original": "tied to counters, nailed to benches, clinched to desks.",
        "translation": "カウンターに縛られ、ベンチに釘付けされ、机に固定されている。",
        "speech": "tied to counters, nailed to benches, clinched to desks."
      },
      {
        "original": "How then is this?",
        "translation": "それではこれはどういうことでしょう?",
        "speech": "How then is this?"
      },
      {
        "original": "Are the green fields gone? What do they here?",
        "translation": "緑の野原は消えてしまったのか？ 彼らはここで何をしているのか?",
        "speech": "Are the green fields gone? What do they here?"
      }
    ]
  },
  {
    "original": "But look! here come more crowds, pacing straight for the water, and seemingly bound for a dive. Strange! Nothing will content them but the extremest limit of the land; loitering under the shady lee of yonder warehouses will not suffice. No. They must get just as nigh the water as they possibly can without falling in. And there they stand — miles of them — leagues. Inlanders all, they come from lanes and alleys, streets and avenues — north, east, south, and west. Yet here they all unite. Tell me, does the magnetic virtue of the needles of the compasses of all those ships attract them thither?",
    "translation": "しかし見てください！さらなる群衆がやって来ており、水に向かって真っ直ぐ進み、まるで飛び込むつもりのようです。不思議です！彼らを満足させるのは、陸地の極限だけです。あの倉庫の日陰でぶらぶらするだけでは足りません。いいえ。彼らは落ちない限り、できるだけ水に近づかなければなりません。そして、彼らはそこに立っています——何マイルも——何リーグも。皆内陸から来ており、路地や小道、通りや大通りを通って——北、東、南、西からです。それでもここで皆が集まります。教えてください、あの船すべてのコンパスの針の磁力が、彼らをそこに引き寄せているのでしょうか？",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "But look! here come more crowds,",
        "translation": "でも見てください！さらに多くの群衆がやって来ます、",
        "speech": "But look! here come more crowds,"
      },
      {
        "original": "pacing straight for the water, and seemingly bound for a dive.",
        "translation": "まっすぐに水へ向かって歩いており、まるで飛び込むつもりのようです。",
        "speech": "pacing straight for the water, and seemingly bound for a dive."
      },
      {
        "original": "Strange! Nothing will content them but the extremest limit of the land;",
        "translation": "不思議です！彼らを満足させるのは陸の限界の極限以外にはありません;",
        "speech": "Strange! Nothing will content them but the extremest limit of the land;"
      },
      {
        "original": "loitering under the shady lee of yonder warehouses will not suffice.",
        "translation": "あの倉庫の日陰でぶらぶらしているだけでは十分ではありません。",
        "speech": "loitering under the shady lee of yonder warehouses will not suffice."
      },
      {
        "original": "No. They must get just as nigh the water",
        "translation": "いいえ。彼らは水にできるだけ近づかなければなりません、",
        "speech": "No. They must get just as nigh the water"
      },
      {
        "original": "as they possibly can without falling in.",
        "translation": "落ちないギリギリまで。",
        "speech": "as they possibly can without falling in."
      },
      {
        "original": "And there they stand — miles of them — leagues.",
        "translation": "そしてそこに彼らは立っています — 何マイルも — リーグ単位で。",
        "speech": "And there they stand — miles of them — leagues."
      },
      {
        "original": "Inlanders all, they come from lanes and alleys, streets and avenues —",
        "translation": "全員内陸出身で、路地や小道、通りや大通りからやって来ます —",
        "speech": "Inlanders all, they come from lanes and alleys, streets and avenues —"
      },
      {
        "original": "north, east, south, and west.",
        "translation": "北、東、南、そして西から。",
        "speech": "north, east, south, and west."
      },
      {
        "original": "Yet here they all unite.",
        "translation": "それでもここで皆が一つになります。",
        "speech": "Yet here they all unite."
      },
      {
        "original": "Tell me, does the magnetic virtue of the needles",
        "translation": "教えてください、すべての船の",
        "speech": "Tell me, does the magnetic virtue of the needles"
      },
      {
        "original": "of the compasses of all those ships attract them thither?",
        "translation": "コンパスの針の磁力が彼らをそこに引き寄せていますか？",
        "speech": "of the compasses of all those ships attract them thither?"
      }
    ]
  },
  {
    "original": "Once more. Say you are in the country; in some high land of lakes. Take almost any path you please, and ten to one it carries you down in a dale, and leaves you there by a pool in the stream. There is magic in it. Let the most absent-minded of men be plunged in his deepest reveries — stand that man on his legs, set his feet a-going, and he will infallibly lead you to water, if water there be in all that region. Should you ever be athirst in the great American desert, try this experiment, if your caravan happen to be supplied with a metaphysical professor. Yes, as every one knows, meditation and water are wedded for ever.",
    "translation": "もう一度。あなたが田舎にいるとしよう；いくつかの湖の高地に。ほとんどどんな道でも好きな道を選んで進みなさい、そうすれば十中八九、谷に下り、そこにある小川のほとりで立ち止まることになる。そこには魔法がある。最もぼんやりした人間でも、深い思索に没入しているとき——その人を立たせ、足を動かせば、必ずやその人は水のある場所へ導いてくれる、もしその地域に水があるなら。もしあなたが大きなアメリカの砂漠で喉が渇いたなら、この実験を試してみるとよい、あなたのキャラバンに形而上学の教授が同行しているなら。そう、誰もが知っているように、瞑想と水は永遠に結びついているのだ。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "Once more. Say you are in the country;",
        "translation": "もう一度。あなたが田舎にいるとしましょう；",
        "speech": "Once more. Say you are in the country;"
      },
      {
        "original": "in some high land of lakes.",
        "translation": "いくつかの湖の高地に。",
        "speech": "in some high land of lakes."
      },
      {
        "original": "Take almost any path you please,",
        "translation": "ほとんどどんな道でも好きな道を選びなさい、",
        "speech": "Take almost any path you please,"
      },
      {
        "original": "and ten to one it carries you down in a dale,",
        "translation": "そして、大抵それがあなたを谷に導き、",
        "speech": "and ten to one it carries you down in a dale,"
      },
      {
        "original": "and leaves you there by a pool in the stream.",
        "translation": "流れの中の池のそばにあなたを置きます。",
        "speech": "and leaves you there by a pool in the stream."
      },
      {
        "original": "There is magic in it.",
        "translation": "そこには魔法があります。",
        "speech": "There is magic in it."
      },
      {
        "original": "Let the most absent-minded of men be plunged",
        "translation": "最もうっかりした男でも深い思索に沈め、",
        "speech": "Let the most absent-minded of men be plunged"
      },
      {
        "original": "in his deepest reveries —",
        "translation": "彼の最も深い瞑想に —",
        "speech": "in his deepest reveries —"
      },
      {
        "original": "stand that man on his legs,",
        "translation": "その男を立たせ、",
        "speech": "stand that man on his legs,"
      },
      {
        "original": "set his feet a-going,",
        "translation": "足を動かさせ、",
        "speech": "set his feet a-going,"
      },
      {
        "original": "and he will infallibly lead you to water,",
        "translation": "そして必ずあなたを水の元へ導くでしょう、",
        "speech": "and he will infallibly lead you to water,"
      },
      {
        "original": "if water there be in all that region.",
        "translation": "もしその地域に水があるなら。",
        "speech": "if water there be in all that region."
      },
      {
        "original": "Should you ever be athirst in the great American desert,",
        "translation": "もしあなたが偉大なアメリカの砂漠で喉が渇いたら、",
        "speech": "Should you ever be athirst in the great American desert,"
      },
      {
        "original": "try this experiment,",
        "translation": "この実験を試しなさい、",
        "speech": "try this experiment,"
      },
      {
        "original": "if your caravan happen to be supplied with a metaphysical professor.",
        "translation": "もしあなたの隊商が形而上学の教授を持っているなら。",
        "speech": "if your caravan happen to be supplied with a metaphysical professor."
      },
      {
        "original": "Yes, as every one knows, meditation and water are wedded for ever.",
        "translation": "そうです、誰もが知っているように、瞑想と水は永遠に結ばれています。",
        "speech": "Yes, as every one knows, meditation and water are wedded for ever."
      }
    ]
  },
  {
    "original": "But here is an artist. He desires to paint you the dreamiest, shadiest, quietest, most enchanting bit of romantic landscape in all the valley of the Saco. What is the chief element he employs? There stand his trees, each with a hollow trunk, as if a hermit and a crucifix were within; and here sleeps his meadow, and there sleep his cattle; and up from yonder cottage goes a sleepy smoke. Deep into distant woodlands winds a mazy way, reaching to overlapping spurs of mountains bathed in their hill-side blue.",
    "translation": "しかし、ここに芸術家がいる。彼はあなたに、サコ川の谷の中で最も夢幻的で、陰影に富み、静かで、魅惑的なロマンチックな風景の一片を描きたいと思っている。彼が使う主な要素は何だろうか？そこに立つのは彼の木々で、それぞれ空洞の幹を持ち、あたかも隠者と十字架が中にあるかのようだ；そしてここに彼の草地が眠り、あそこに彼の家畜が眠る；向こうの小屋からはのんびりとした煙が上る。遠くの森の中へ迷路のような道が続き、山々の重なり合う尾根へと達し、その斜面は青く染まっている。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "But here is an artist.",
        "translation": "しかし、ここに一人の芸術家がいます。",
        "speech": "But here is an artist."
      },
      {
        "original": "He desires to paint you the dreamiest, shadiest,",
        "translation": "彼はあなたに、最も夢見心地で日陰の、",
        "speech": "He desires to paint you the dreamiest, shadiest,"
      },
      {
        "original": "quietest, most enchanting bit of romantic landscape",
        "translation": "最も静かで魅惑的な、恋愛的な風景の一部を描きたいと思っています",
        "speech": "quietest, most enchanting bit of romantic landscape"
      },
      {
        "original": "in all the valley of the Saco.",
        "translation": "サコ川渓谷全体で。",
        "speech": "in all the valley of the Saco."
      },
      {
        "original": "What is the chief element he employs?",
        "translation": "彼が用いる主要な要素は何でしょうか？",
        "speech": "What is the chief element he employs?"
      },
      {
        "original": "There stand his trees, each with a hollow trunk,",
        "translation": "あそこに彼の木々が立っており、それぞれ空洞の幹を持っています、",
        "speech": "There stand his trees, each with a hollow trunk,"
      },
      {
        "original": "as if a hermit and a crucifix were within;",
        "translation": "まるでその中に隠者と十字架があるかのように;",
        "speech": "as if a hermit and a crucifix were within;"
      },
      {
        "original": "and here sleeps his meadow, and there sleep his cattle;",
        "translation": "そしてここには彼の草原が眠り、あそこでは彼の家畜が眠ります;",
        "speech": "and here sleeps his meadow, and there sleep his cattle;"
      },
      {
        "original": "and up from yonder cottage goes a sleepy smoke.",
        "translation": "あの向こうの小屋からは、眠そうな煙が上がっています。",
        "speech": "and up from yonder cottage goes a sleepy smoke."
      },
      {
        "original": "Deep into distant woodlands winds a mazy way,",
        "translation": "遠くの森の中へ迷路のような道が曲がりくねっており、",
        "speech": "Deep into distant woodlands winds a mazy way,"
      },
      {
        "original": "reaching to overlapping spurs of mountains bathed in their hill-side blue.",
        "translation": "山の重なり合う尾根にまで続き、山の斜面の青に染まっています。",
        "speech": "reaching to overlapping spurs of mountains bathed in their hill-side blue."
      }
    ]
  },
  {
    "original": "But though the picture lies thus tranced, and though this pine-tree shakes down its sighs like leaves upon this shepherd’s head, yet all were vain, unless the shepherd’s eye were fixed upon the magic stream before him. Go visit the Prairies in June, when for scores on scores of miles you wade knee-deep among Tiger-lilies — what is the one charm wanting? — Water — there is not a drop of water there! Were Niagara but a cataract of sand, would you travel your thousand miles to see it?",
    "translation": "しかし、たとえその絵がこのように眠るように横たわり、この松の木がそのため息を羊飼いの頭に葉のように降らせても、羊飼いの目が目の前の魔法の流れに固定されていなければ、すべては無意味であろう。6月の大草原を訪れて、何十マイルもの間、タイガーリリーに膝まで浸かって歩くとしよう — 欠けている唯一の魅力は何か? — 水 — そこには一滴の水もないのだ！ナイアガラが砂の滝だったなら、あなたはそれを見るために千マイルも旅をするだろうか？",
    "guide": "続けて置かれた問いを一つずつ受け、語り手が考えを深める順を追います。",
    "narrationSegments": [
      {
        "original": "But though the picture lies thus tranced,",
        "translation": "しかし、その絵がこのように恍惚として横たわっていても、",
        "speech": "But though the picture lies thus tranced,"
      },
      {
        "original": "and though this pine-tree shakes down its sighs like leaves",
        "translation": "この松の木が、葉のようにため息をこの羊飼いの頭に降らせても、",
        "speech": "and though this pine-tree shakes down its sighs like leaves"
      },
      {
        "original": "upon this shepherd’s head, yet all were vain,",
        "translation": "すべては無駄であろう、",
        "speech": "upon this shepherd’s head, yet all were vain,"
      },
      {
        "original": "unless the shepherd’s eye were fixed upon the magic stream before him.",
        "translation": "もし羊飼いの目が目の前の魔法の川に注がれていなければ。",
        "speech": "unless the shepherd’s eye were fixed upon the magic stream before him."
      },
      {
        "original": "Go visit the Prairies in June,",
        "translation": "6月の大草原を訪れてごらん、",
        "speech": "Go visit the Prairies in June,"
      },
      {
        "original": "when for scores on scores",
        "translation": "何マイルにもわたって",
        "speech": "when for scores on scores"
      },
      {
        "original": "of miles you wade knee-deep among Tiger-lilies —",
        "translation": "タイガーリリーの中を膝まで浸かって歩くとき —",
        "speech": "of miles you wade knee-deep among Tiger-lilies —"
      },
      {
        "original": "what is the one charm wanting?",
        "translation": "何が欠けているのでしょうか？",
        "speech": "what is the one charm wanting?"
      },
      {
        "original": "— Water — there is not a drop of water there!",
        "translation": "— 水 — そこには一滴の水もない！",
        "speech": "— Water — there is not a drop of water there!"
      },
      {
        "original": "Were Niagara but a cataract of sand,",
        "translation": "ナイアガラが砂の滝だったとしたら、",
        "speech": "Were Niagara but a cataract of sand,"
      },
      {
        "original": "would you travel your thousand miles to see it?",
        "translation": "あなたはそれを見るために千マイルも旅をしますか？",
        "speech": "would you travel your thousand miles to see it?"
      }
    ]
  },
  {
    "original": "Why did the poor poet of Tennessee, upon suddenly receiving two handfuls of silver, deliberate whether to buy him a coat, which he sadly needed, or invest his money in a pedestrian trip to Rockaway Beach? Why is almost every robust healthy boy with a robust healthy soul in him, at some time or other crazy to go to sea? Why upon your first voyage as a passenger, did you yourself feel such a mystical vibration, when first told that you and your ship were now out of sight of land? Why did the old Persians hold the sea holy? Why did the Greeks give it a separate deity, and own brother of Jove?",
    "translation": "なぜテネシーの貧しい詩人は、突然一握り二つの銀を手に入れたとき、悲しいほど必要としていたコートを買うか、それともロックアウェイ・ビーチへの徒歩旅行に投資するかを熟考したのでしょうか？なぜほとんどすべての丈夫で健康な少年は、健康な魂を持っているとき、いつか海に行きたくてたまらなくなるのでしょうか？なぜあなた自身、初めて乗客として航海したとき、陸地の視界から船が離れたと告げられたときに、あの神秘的な振動を感じたのでしょうか？なぜ古代ペルシア人は海を神聖だと考えたのでしょうか？なぜギリシャ人は海に別の神を与え、ジュピターの兄弟であると認めたのでしょうか？",
    "guide": "続けて置かれた問いを一つずつ受け、語り手が考えを深める順を追います。",
    "narrationSegments": [
      {
        "original": "Why did the poor poet of Tennessee,",
        "translation": "なぜテネシーの貧しい詩人は、",
        "speech": "Why did the poor poet of Tennessee,"
      },
      {
        "original": "upon suddenly receiving two handfuls of silver,",
        "translation": "突然二握りの銀を受け取ったとき、",
        "speech": "upon suddenly receiving two handfuls of silver,"
      },
      {
        "original": "deliberate whether to buy him a coat,",
        "translation": "自分のためにコートを買うかどうか熟考したのか、",
        "speech": "deliberate whether to buy him a coat,"
      },
      {
        "original": "which he sadly needed,",
        "translation": "それは彼が悲しげに必要としていたものだったのに、",
        "speech": "which he sadly needed,"
      },
      {
        "original": "or invest his money in a pedestrian trip to Rockaway Beach?",
        "translation": "それともロッカウェイビーチへの徒歩旅行にお金を投資するかについて、",
        "speech": "or invest his money in a pedestrian trip to Rockaway Beach?"
      },
      {
        "original": "Why is almost every robust healthy boy",
        "translation": "なぜほとんどすべての健康で元気な少年は、",
        "speech": "Why is almost every robust healthy boy"
      },
      {
        "original": "with a robust healthy soul in him,",
        "translation": "その中に健全で元気な魂を持っていると、",
        "speech": "with a robust healthy soul in him,"
      },
      {
        "original": "at some time or other crazy to go to sea?",
        "translation": "いつかは海に行きたくてたまらなくなるのか？",
        "speech": "at some time or other crazy to go to sea?"
      },
      {
        "original": "Why upon your first voyage as a passenger,",
        "translation": "なぜあなたが乗客として最初の航海に出たとき、",
        "speech": "Why upon your first voyage as a passenger,"
      },
      {
        "original": "did you yourself feel such a mystical vibration,",
        "translation": "陸地が見えなくなったと聞かされたときに、",
        "speech": "did you yourself feel such a mystical vibration,"
      },
      {
        "original": "when first told that you",
        "translation": "あなた自身、",
        "speech": "when first told that you"
      },
      {
        "original": "and your ship were now out of sight of land?",
        "translation": "そしてあなたの船が陸地の視界から消えたときに、そんな神秘的な振動を感じたのか？",
        "speech": "and your ship were now out of sight of land?"
      },
      {
        "original": "Why did the old Persians hold the sea holy?",
        "translation": "なぜ古代ペルシャ人は海を神聖なものと考えたのか？",
        "speech": "Why did the old Persians hold the sea holy?"
      },
      {
        "original": "Why did the Greeks give it a separate deity,",
        "translation": "なぜギリシャ人は海に別の神を与え、",
        "speech": "Why did the Greeks give it a separate deity,"
      },
      {
        "original": "and own brother of Jove?",
        "translation": "ジュピターの兄弟として認めたのか？",
        "speech": "and own brother of Jove?"
      }
    ]
  },
  {
    "original": "Surely all this is not without meaning. And still deeper the meaning of that story of Narcissus, who because he could not grasp the tormenting, mild image he saw in the fountain, plunged into it and was drowned. But that same image, we ourselves see in all rivers and oceans. It is the image of the ungraspable phantom of life; and this is the key to it all.",
    "translation": "確かに、これらすべては意味のないことではありません。そしてなおさら、ナルキッソスの話の意味は深いです。自己を映す泉の中に見た苦しげで穏やかな姿がつかめず、彼はその中に飛び込み溺れてしまったのです。しかし、その同じ像を、私たちはすべての川や海で目にします。それは、つかみどころのない人生の幻影の像であり、これこそがすべての鍵です。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "Surely all this is not without meaning.",
        "translation": "確かに、これらすべては意味のないものではない。",
        "speech": "Surely all this is not without meaning."
      },
      {
        "original": "And still deeper the meaning of that story of Narcissus,",
        "translation": "そしてさらに深いのは、ナルキッソスの物語の意味である、",
        "speech": "And still deeper the meaning of that story of Narcissus,"
      },
      {
        "original": "who because he could not grasp the tormenting,",
        "translation": "彼は苦しめる穏やかな像をつかむことができず、",
        "speech": "who because he could not grasp the tormenting,"
      },
      {
        "original": "mild image he saw in the fountain,",
        "translation": "泉の中にそれを見て、",
        "speech": "mild image he saw in the fountain,"
      },
      {
        "original": "plunged into it and was drowned.",
        "translation": "飛び込み、溺れてしまった。",
        "speech": "plunged into it and was drowned."
      },
      {
        "original": "But that same image, we ourselves see in all rivers and oceans.",
        "translation": "しかし、同じ像を私たちはすべての川や海で自分自身に見いだす。",
        "speech": "But that same image, we ourselves see in all rivers and oceans."
      },
      {
        "original": "It is the image of the ungraspable phantom of life;",
        "translation": "それは人生のつかめない幻影の像である；",
        "speech": "It is the image of the ungraspable phantom of life;"
      },
      {
        "original": "and this is the key to it all.",
        "translation": "そしてこれがすべての鍵である。",
        "speech": "and this is the key to it all."
      }
    ]
  },
  {
    "original": "Now, when I say that I am in the habit of going to sea whenever I begin to grow hazy about the eyes, and begin to be over conscious of my lungs, I do not mean to have it inferred that I ever go to sea as a passenger. For to go as a passenger you must needs have a purse, and a purse is but a rag unless you have something in it. Besides, passengers get sea-sick — grow quarrelsome — don’t sleep of nights — do not enjoy themselves much, as a general thing; — no, I never go as a passenger;",
    "translation": "さて、私が目がかすんでくるときや、肺のことばかり考えすぎるようになると、習慣的に海に出ると言うとき、それは決して私が乗客として海に出るという意味に取ってほしいわけではありません。乗客として行くにはお金が必要であり、しかし中身のない財布はただのぼろでしかありません。それに加えて、乗客は船酔いをし、口論好きになり、夜は眠れず、一般的にはあまり楽しむこともできません；—いいえ、私は決して乗客として行くことはありません；",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "Now, when I say that I am",
        "translation": "さて、私が言うとき、私は",
        "speech": "Now, when I say that I am"
      },
      {
        "original": "in the habit of going to sea whenever I begin",
        "translation": "目に霞がかかり始めるたびに海に行く習慣がある、と",
        "speech": "in the habit of going to sea whenever I begin"
      },
      {
        "original": "to grow hazy about the eyes,",
        "translation": "言うのは、",
        "speech": "to grow hazy about the eyes,"
      },
      {
        "original": "and begin to be over conscious of my lungs,",
        "translation": "肺について過剰に意識し始めるときであり、",
        "speech": "and begin to be over conscious of my lungs,"
      },
      {
        "original": "I do not mean to have it inferred",
        "translation": "それによって",
        "speech": "I do not mean to have it inferred"
      },
      {
        "original": "that I ever go to sea as a passenger.",
        "translation": "私が決して乗客として海に行くという意味を含むわけではありません。",
        "speech": "that I ever go to sea as a passenger."
      },
      {
        "original": "For to go as a passenger you must needs have a purse,",
        "translation": "というのも、乗客として行くには当然財布が必要だからです。",
        "speech": "For to go as a passenger you must needs have a purse,"
      },
      {
        "original": "and a purse is but a rag",
        "translation": "そして財布はただのぼろ布にすぎない",
        "speech": "and a purse is but a rag"
      },
      {
        "original": "unless you have something in it.",
        "translation": "中身がなければ。",
        "speech": "unless you have something in it."
      },
      {
        "original": "Besides, passengers get sea-sick —",
        "translation": "それに、乗客は船酔いをする —",
        "speech": "Besides, passengers get sea-sick —"
      },
      {
        "original": "grow quarrelsome —",
        "translation": "口論好きになる —",
        "speech": "grow quarrelsome —"
      },
      {
        "original": "don’t sleep of nights —",
        "translation": "夜は眠れない —",
        "speech": "don’t sleep of nights —"
      },
      {
        "original": "do not enjoy themselves much, as a general thing; —",
        "translation": "一般的に言って、あまり楽しめない； —",
        "speech": "do not enjoy themselves much, as a general thing; —"
      },
      {
        "original": "no, I never go as a passenger;",
        "translation": "いいえ、私は決して乗客としては行きません；",
        "speech": "no, I never go as a passenger;"
      }
    ]
  },
  {
    "original": "nor, though I am something of a salt, do I ever go to sea as a Commodore, or a Captain, or a Cook. I abandon the glory and distinction of such offices to those who like them. For my part, I abominate all honorable respectable toils, trials, and tribulations of every kind whatsoever. It is quite as much as I can do to take care of myself, without taking care of ships, barques, brigs, schooners, and what not.",
    "translation": "私は多少塩気のある者ではありますが、海に出るときにコモドアやキャプテンやコックとして行くことは決してありません。そのような職務の栄光や名誉は、それを好む人々に任せます。私自身に関しては、あらゆる種類の名誉ある尊敬すべき労苦、試練、苦難を嫌悪します。船やバーク、ブリッグ、スクーナーなどの世話をすることなく、自分自身の世話をするだけで、私には十分です。",
    "guide": "逆接の前後で、人物の考えや場面がどう変わるかを比べます。",
    "narrationSegments": [
      {
        "original": "nor, though I am something of a salt,",
        "translation": "また、私が多少なりとも塩気のある人間であっても、",
        "speech": "nor, though I am something of a salt,"
      },
      {
        "original": "do I ever go to sea as a Commodore,",
        "translation": "海に出て提督として、",
        "speech": "do I ever go to sea as a Commodore,"
      },
      {
        "original": "or a Captain, or a Cook.",
        "translation": "あるいは船長として、あるいは料理長として働くことは決してありません。",
        "speech": "or a Captain, or a Cook."
      },
      {
        "original": "I abandon the glory and distinction of such offices",
        "translation": "私はそのような職務の栄光や名誉を",
        "speech": "I abandon the glory and distinction of such offices"
      },
      {
        "original": "to those who like them.",
        "translation": "それを好む人々に任せます。",
        "speech": "to those who like them."
      },
      {
        "original": "For my part, I abominate all honorable respectable toils,",
        "translation": "私自身は、あらゆる種類の名誉ある尊敬すべき労働、",
        "speech": "For my part, I abominate all honorable respectable toils,"
      },
      {
        "original": "trials, and tribulations of every kind whatsoever.",
        "translation": "試練、困難をすべて忌み嫌います。",
        "speech": "trials, and tribulations of every kind whatsoever."
      },
      {
        "original": "It is quite as much as I can do",
        "translation": "私にとっては、それくらいのことですら、",
        "speech": "It is quite as much as I can do"
      },
      {
        "original": "to take care of myself, without taking care of ships,",
        "translation": "船、帆船、二本マストの艦、スクーナー船などを世話することなしに、",
        "speech": "to take care of myself, without taking care of ships,"
      },
      {
        "original": "barques, brigs, schooners, and what not.",
        "translation": "自分自身の世話をするのが精一杯です。",
        "speech": "barques, brigs, schooners, and what not."
      }
    ]
  },
  {
    "original": "And as for going as cook, — though I confess there is considerable glory in that, a cook being a sort of officer on ship-board — yet, somehow, I never fancied broiling fowls; — though once broiled, judiciously buttered, and judgmatically salted and peppered, there is no one who will speak more respectfully, not to say reverentially, of a broiled fowl than I will. It is out of the idolatrous dotings of the old Egyptians upon broiled ibis and roasted river horse, that you see the mummies of those creatures in their huge bake-houses the pyramids.",
    "translation": "そして料理人として行くことについてですが、— 船上で一種の役員である料理人にはかなりの栄誉があることを認めますが — それにしても、私はどういうわけか鳥を焼くことに興味を持ったことはありません；— しかし一度焼かれ、適切にバターが塗られ、賢明に塩と胡椒で味付けされたなら、私ほど丁重に、いや敬意をもって焼き鳥について語る者はいません。古代エジプト人が焼きイビスや焼いた河馬に崇拝的に夢中になったせいで、彼らの巨大な焼き場であるピラミッドの中に、その生き物たちのミイラが残っているのです。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "And as for going as cook, —",
        "translation": "そして料理人として行くことについては、—",
        "speech": "And as for going as cook, —"
      },
      {
        "original": "though I confess there is considerable glory in that,",
        "translation": "それにはかなりの名誉があることを認めます、",
        "speech": "though I confess there is considerable glory in that,"
      },
      {
        "original": "a cook being a sort of officer on ship-board —",
        "translation": "料理人は船上の一種の士官ですから—",
        "speech": "a cook being a sort of officer on ship-board —"
      },
      {
        "original": "yet, somehow, I never fancied broiling fowls; —",
        "translation": "それでも、どういうわけか、鳥を焼くのを好んだことはありません；—",
        "speech": "yet, somehow, I never fancied broiling fowls; —"
      },
      {
        "original": "though once broiled, judiciously buttered, and judgmatically salted and peppered,",
        "translation": "ただし、一度うまく焼かれ、賢明にバターが塗られ、適切に塩と胡椒が振られたなら、",
        "speech": "though once broiled, judiciously buttered, and judgmatically salted and peppered,"
      },
      {
        "original": "there is no one who will speak more respectfully,",
        "translation": "誰よりも丁重に、",
        "speech": "there is no one who will speak more respectfully,"
      },
      {
        "original": "not to say reverentially, of a broiled fowl than I will.",
        "translation": "いや、敬意を持って、焼き鳥について語るのは私です。",
        "speech": "not to say reverentially, of a broiled fowl than I will."
      },
      {
        "original": "It is out of the idolatrous dotings",
        "translation": "これは、古代エジプト人が焼いたトキや焼いたカバに熱狂的に崇拝した結果であり、",
        "speech": "It is out of the idolatrous dotings"
      },
      {
        "original": "of the old Egyptians upon broiled ibis and roasted river horse,",
        "translation": "その狂信的な愛着から、",
        "speech": "of the old Egyptians upon broiled ibis and roasted river horse,"
      },
      {
        "original": "that you see the mummies of those creatures",
        "translation": "これらの生き物のミイラが",
        "speech": "that you see the mummies of those creatures"
      },
      {
        "original": "in their huge bake-houses the pyramids.",
        "translation": "巨大な焼き場であるピラミッドに見られるのです。",
        "speech": "in their huge bake-houses the pyramids."
      }
    ]
  },
  {
    "original": "No, when I go to sea, I go as a simple sailor, right before the mast, plumb down into the forecastle, aloft there to the royal mast-head. True, they rather order me about some, and make me jump from spar to spar, like a grasshopper in a May meadow. And at first, this sort of thing is unpleasant enough. It touches one’s sense of honor, particularly if you come of an old established family in the land, the Van Rensselaers, or Randolphs, or Hardicanutes. And more than all, if just previous to putting your hand into the tar-pot, you have been lording it as a country schoolmaster, making the tallest boys stand in awe of you.",
    "translation": "いいえ、私が海に出るときは、ただの水夫として、船首の手前の甲板の下、前部艙室に、そしてそこの王立マストの先端まで上がるのです。確かに、彼らは少し私に命令を下し、五月の牧草地のバッタのように、マストからマストへと跳ばせたりします。そして最初のうちは、こういったことはかなり不快です。それは名誉感に触れることがあります。特に、もしあなたがヴァン・レンセラース家、ランドルフ家、またはハーディカヌート家のような土地で昔から確立された家の出であればなおさらです。そして何よりも、もしタールの入った壺に手を入れる直前まで、田舎の学校教師として君臨し、一番背の高い少年たちを恐れさせていたとしたら、尚更です。",
    "guide": "時や条件を示す部分を先に受け、そのあと主な出来事へ進みます。",
    "narrationSegments": [
      {
        "original": "No, when I go to sea,",
        "translation": "いいえ、私が海に行くとき、",
        "speech": "No, when I go to sea,"
      },
      {
        "original": "I go as a simple sailor,",
        "translation": "私はただの船員として行きます、",
        "speech": "I go as a simple sailor,"
      },
      {
        "original": "right before the mast, plumb down into the forecastle,",
        "translation": "マストの前、船首楼の中まで、",
        "speech": "right before the mast, plumb down into the forecastle,"
      },
      {
        "original": "aloft there to the royal mast-head.",
        "translation": "そしてそこの頂上、王のマストの先端まで。",
        "speech": "aloft there to the royal mast-head."
      },
      {
        "original": "True, they rather order me about some,",
        "translation": "確かに、彼らは私にいくつか指示を出します、",
        "speech": "True, they rather order me about some,"
      },
      {
        "original": "and make me jump from spar to spar,",
        "translation": "そして私をマストからマストへ飛ばせます、",
        "speech": "and make me jump from spar to spar,"
      },
      {
        "original": "like a grasshopper in a May meadow.",
        "translation": "まるで五月の草原のバッタのように。",
        "speech": "like a grasshopper in a May meadow."
      },
      {
        "original": "And at first, this sort of thing is unpleasant enough.",
        "translation": "最初は、このようなことはかなり不快です。",
        "speech": "And at first, this sort of thing is unpleasant enough."
      },
      {
        "original": "It touches one’s sense of honor,",
        "translation": "それは名誉心に触れるのです、",
        "speech": "It touches one’s sense of honor,"
      },
      {
        "original": "particularly if you come of an old established family in the land,",
        "translation": "特にあなたがその土地の古くからの家門に生まれた場合、",
        "speech": "particularly if you come of an old established family in the land,"
      },
      {
        "original": "the Van Rensselaers, or Randolphs, or Hardicanutes.",
        "translation": "ヴァン・レンセラー家やランドルフ家、もしくはハルディカヌート家のような。",
        "speech": "the Van Rensselaers, or Randolphs, or Hardicanutes."
      },
      {
        "original": "And more than all,",
        "translation": "そして何よりも、",
        "speech": "And more than all,"
      },
      {
        "original": "if just previous to putting your hand into the tar-pot,",
        "translation": "もしタールの壺に手を入れる直前に、",
        "speech": "if just previous to putting your hand into the tar-pot,"
      },
      {
        "original": "you have been lording it as a country schoolmaster,",
        "translation": "あなたが地方の学校教師として威張っていたなら、",
        "speech": "you have been lording it as a country schoolmaster,"
      },
      {
        "original": "making the tallest boys stand in awe of you.",
        "translation": "最も背の高い少年たちをあなたに畏敬させていたなら。",
        "speech": "making the tallest boys stand in awe of you."
      }
    ]
  },
  {
    "original": "The transition is a keen one, I assure you, from a schoolmaster to a sailor, and requires a strong decoction of Seneca and the Stoics to enable you to grin and bear it. But even this wears off in time.",
    "translation": "その移行は非常に鋭いものであると、私は保証します、教師から船員への移行は、あなたが耐え忍ぶためにセネカやストア派の強い精神が必要です。しかし、この感覚も時が経てば次第に薄れていきます。",
    "guide": "逆接の前後で、人物の考えや場面がどう変わるかを比べます。",
    "narrationSegments": [
      {
        "original": "The transition is a keen one, I assure you,",
        "translation": "その変化は非常に大きいものであると、保証します、",
        "speech": "The transition is a keen one, I assure you,"
      },
      {
        "original": "from a schoolmaster to a sailor,",
        "translation": "教師から水夫への変化は、",
        "speech": "from a schoolmaster to a sailor,"
      },
      {
        "original": "and requires a strong decoction of Seneca",
        "translation": "忍耐して耐えるためには、セネカやストア派の強い教えが必要です",
        "speech": "and requires a strong decoction of Seneca"
      },
      {
        "original": "and the Stoics to enable you to grin and bear it.",
        "translation": "そして、それに耐えて笑顔を見せることができるようにするためです。",
        "speech": "and the Stoics to enable you to grin and bear it."
      },
      {
        "original": "But even this wears off in time.",
        "translation": "しかし、これも時間とともにやがて和らぎます。",
        "speech": "But even this wears off in time."
      }
    ]
  },
  {
    "original": "What of it, if some old hunks of a sea-captain orders me to get a broom and sweep down the decks? What does that indignity amount to, weighed, I mean, in the scales of the New Testament? Do you think the archangel Gabriel thinks anything the less of me, because I promptly and respectfully obey that old hunks in that particular instance? Who ain’t a slave? Tell me that. Well, then, however the old sea-captains may order me about — however they may thump and punch me about, I have the satisfaction of knowing that it is all right; that everybody else is one way or other served in much the same way — either in a physical or metaphysical point of view, that is; and so the universal thump is passed round, and all hands should rub each other’s shoulder-blades, and be content.",
    "translation": "もし年寄りの海の船長が私にほうきを取って甲板を掃けと言ったとしても、それがどうだというのですか？その屈辱は、新約聖書の天秤で測れば、どれほどのものになるのでしょうか？私がその場でその年寄りの船長に素早く、そして礼儀正しく従ったからといって、大天使ガブリエルが私を少なくとも考えるでしょうか？奴隷でない者はいないでしょう？教えてください。さて、だから、年老いた海の船長が私をどう命じようとも、私をどんなに叩こうと殴ろうとも、私はそれが全く正しいことであると知って安心しているのです。他の人々も同じように、身体的にも形而上学的にも、何らかの形で仕えられているのです；だから普遍的な叩き合いは巡り回り、皆が互いの肩甲骨をさすり、満足すべきなのです。",
    "guide": "続けて置かれた問いを一つずつ受け、語り手が考えを深める順を追います。",
    "narrationSegments": [
      {
        "original": "What of it,",
        "translation": "それがどうしたの、",
        "speech": "What of it,"
      },
      {
        "original": "if some old hunks of a sea-captain orders me",
        "translation": "もしある年老いた海の船長が私に命じたとしても",
        "speech": "if some old hunks of a sea-captain orders me"
      },
      {
        "original": "to get a broom and sweep down the decks?",
        "translation": "ほうきを持ってデッキを掃除しろと？",
        "speech": "to get a broom and sweep down the decks?"
      },
      {
        "original": "What does that indignity amount to, weighed,",
        "translation": "その屈辱はどれほどのものだろう、秤にかけてみれば、",
        "speech": "What does that indignity amount to, weighed,"
      },
      {
        "original": "I mean, in the scales of the New Testament?",
        "translation": "つまり、新約聖書の秤で測った場合には？",
        "speech": "I mean, in the scales of the New Testament?"
      },
      {
        "original": "Do you think the archangel Gabriel thinks anything the less of me,",
        "translation": "大天使ガブリエルが私を少しでも軽んじると思うかい、",
        "speech": "Do you think the archangel Gabriel thinks anything the less of me,"
      },
      {
        "original": "because I promptly and respectfully obey that old hunks",
        "translation": "私がその年老いた船長のその特定の指示に",
        "speech": "because I promptly and respectfully obey that old hunks"
      },
      {
        "original": "in that particular instance?",
        "translation": "すぐにかつ丁寧に従ったとしても？",
        "speech": "in that particular instance?"
      },
      {
        "original": "Who ain’t a slave?",
        "translation": "奴隷でない者などいるかい？",
        "speech": "Who ain’t a slave?"
      },
      {
        "original": "Tell me that.",
        "translation": "それを私に教えてくれ。",
        "speech": "Tell me that."
      },
      {
        "original": "Well, then, however the old sea-captains may order me about —",
        "translation": "さて、それでも、いくら年老いた船長たちが私をあちこちに命令しても—",
        "speech": "Well, then, however the old sea-captains may order me about —"
      },
      {
        "original": "however they may thump and punch me about,",
        "translation": "いくら私を殴ったりぶったりしても、",
        "speech": "however they may thump and punch me about,"
      },
      {
        "original": "I have the satisfaction of knowing that it is all right;",
        "translation": "私はそれが正しいことだと知って満足している;",
        "speech": "I have the satisfaction of knowing that it is all right;"
      },
      {
        "original": "that everybody else is one way or other served",
        "translation": "他の皆も、いずれにせよ何らかの方法で",
        "speech": "that everybody else is one way or other served"
      },
      {
        "original": "in much the same way —",
        "translation": "ほぼ同じように扱われていることだ—",
        "speech": "in much the same way —"
      },
      {
        "original": "either in a physical or metaphysical point of view, that is;",
        "translation": "それは肉体的にも形而上学的にも、ということだ;",
        "speech": "either in a physical or metaphysical point of view, that is;"
      },
      {
        "original": "and so the universal thump is passed round,",
        "translation": "そしてそのため普遍的な打撃は回され、",
        "speech": "and so the universal thump is passed round,"
      },
      {
        "original": "and all hands should rub each other’s shoulder-blades, and be content.",
        "translation": "皆、それぞれの肩甲骨を擦り合い、満足すべきだ。",
        "speech": "and all hands should rub each other’s shoulder-blades, and be content."
      }
    ]
  },
  {
    "original": "Again, I always go to sea as a sailor, because they make a point of paying me for my trouble, whereas they never pay passengers a single penny that I ever heard of. On the contrary, passengers themselves must pay. And there is all the difference in the world between paying and being paid. The act of paying is perhaps the most uncomfortable infliction that the two orchard thieves entailed upon us. But being paid, — what will compare with it? The urbane activity with which a man receives money is really marvellous, considering that we so earnestly believe money to be the root of all earthly ills, and that on no account can a monied man enter heaven. Ah! how cheerfully we consign ourselves to perdition!",
    "translation": "繰り返しますが、私はいつも船乗りとして海に出ます。なぜなら、彼らは私の手間に対して報酬を支払うのに対し、乗客には一銭も支払わないからです。むしろ、乗客自身が支払わなければなりません。支払うことと支払われることには大きな違いがあります。支払う行為は、おそらくこの二人の果樹園泥棒が私たちにもたらした最も不快な苦しみだった。しかし、報酬を得ること――それに比べるものは何でしょうか?人がお金を受け取る洗練された活動は本当に素晴らしいものです。なぜなら、私たちはお金こそが地上のすべての災いの根源であり、金持ちの人間は天国に入れないと熱心に信じているからです。あっ!なんと楽しく地獄に身を投じることか!",
    "guide": "逆接の前後で、人物の考えや場面がどう変わるかを比べます。",
    "narrationSegments": [
      {
        "original": "Again, I always go to sea as a sailor,",
        "translation": "私はいつも船乗りとして海に行きます、",
        "speech": "Again, I always go to sea as a sailor,"
      },
      {
        "original": "because they make a point of paying me for my trouble,",
        "translation": "なぜなら、彼らは私の苦労に対して必ず支払うことにしているからです、",
        "speech": "because they make a point of paying me for my trouble,"
      },
      {
        "original": "whereas they never pay passengers a single penny",
        "translation": "旅客には一銭も支払ったことがないにもかかわらず、",
        "speech": "whereas they never pay passengers a single penny"
      },
      {
        "original": "that I ever heard of.",
        "translation": "私の聞いた限りでは。",
        "speech": "that I ever heard of."
      },
      {
        "original": "On the contrary, passengers themselves must pay.",
        "translation": "反対に、旅客自身が支払わなければなりません。",
        "speech": "On the contrary, passengers themselves must pay."
      },
      {
        "original": "And there is all the difference",
        "translation": "そして支払うことと支払われることには",
        "speech": "And there is all the difference"
      },
      {
        "original": "in the world between paying and being paid.",
        "translation": "世界中に大きな違いがあります。",
        "speech": "in the world between paying and being paid."
      },
      {
        "original": "The act of paying is perhaps the most uncomfortable infliction",
        "translation": "支払う行為はおそらく最も不快な拷問です",
        "speech": "The act of paying is perhaps the most uncomfortable infliction"
      },
      {
        "original": "that the two orchard thieves entailed upon us.",
        "translation": "二人の果樹園の泥棒たちが私たちに課したものの中で。",
        "speech": "that the two orchard thieves entailed upon us."
      },
      {
        "original": "But being paid, — what will compare with it?",
        "translation": "しかし、支払われること — これに比べるものがあるでしょうか？",
        "speech": "But being paid, — what will compare with it?"
      },
      {
        "original": "The urbane activity with which a man receives money is really marvellous,",
        "translation": "男性が金を受け取るという洗練された活動は本当に驚くべきものです、",
        "speech": "The urbane activity with which a man receives money is really marvellous,"
      },
      {
        "original": "considering that we so earnestly believe money",
        "translation": "私たちが金を",
        "speech": "considering that we so earnestly believe money"
      },
      {
        "original": "to be the root of all earthly ills,",
        "translation": "すべての地上の悪の根と心から信じていることを考えると、",
        "speech": "to be the root of all earthly ills,"
      },
      {
        "original": "and that on no account can a monied man enter heaven.",
        "translation": "そして金持ちの人はどんな理由でも天国に入れないとされているのです。",
        "speech": "and that on no account can a monied man enter heaven."
      },
      {
        "original": "Ah! how cheerfully we consign ourselves to perdition!",
        "translation": "ああ！私たちはどれほど喜んで地獄に身を任せるのでしょう！",
        "speech": "Ah! how cheerfully we consign ourselves to perdition!"
      }
    ]
  },
  {
    "original": "Finally, I always go to sea as a sailor, because of the wholesome exercise and pure air of the fore-castle deck. For as in this world, head winds are far more prevalent than winds from astern (that is, if you never violate the Pythagorean maxim), so for the most part the Commodore on the quarter-deck gets his atmosphere at second hand from the sailors on the forecastle. He thinks he breathes it first; but not so. In much the same way do the commonalty lead their leaders in many other things, at the same time that the leaders little suspect it.",
    "translation": "最後に、私はいつも船員として海に出ます。それは、前甲板での健全な運動と清浄な空気のためです。この世の中では、向かい風の方が追い風よりもはるかに多いのです（つまり、もしピタゴラスの格言を破らなければ）。ですから、大部分の場合、艦橋にいる提督は前甲板の船員たちから間接的に空気を得ているのです。提督は自分が最初にそれを吸っていると思い込んでいますが、実際はそうではありません。同じように、一般庶民は他の多くのことにおいても、指導者たちがほとんど疑わない間に、指導者を先導しているのです。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "Finally, I always go to sea as a sailor,",
        "translation": "ついに、私はいつも水夫として海に出る、",
        "speech": "Finally, I always go to sea as a sailor,"
      },
      {
        "original": "because of the wholesome exercise and pure air of the fore-castle deck.",
        "translation": "船首甲板での健全な運動と清浄な空気のために。",
        "speech": "because of the wholesome exercise and pure air of the fore-castle deck."
      },
      {
        "original": "For as in this world,",
        "translation": "この世界においては、",
        "speech": "For as in this world,"
      },
      {
        "original": "head winds are far more prevalent than winds from astern (that is,",
        "translation": "向かい風は追い風よりずっと多いのです（つまり、",
        "speech": "head winds are far more prevalent than winds from astern (that is,"
      },
      {
        "original": "if you never violate the Pythagorean maxim),",
        "translation": "ピタゴラスの格言を決して破らなければ）、",
        "speech": "if you never violate the Pythagorean maxim),"
      },
      {
        "original": "so for the most part the Commodore",
        "translation": "したがって、ほとんどの場合、司令官は",
        "speech": "so for the most part the Commodore"
      },
      {
        "original": "on the quarter-deck gets his atmosphere at second hand",
        "translation": "後甲板で空気を二次的にしか得られません",
        "speech": "on the quarter-deck gets his atmosphere at second hand"
      },
      {
        "original": "from the sailors on the forecastle.",
        "translation": "船首の水夫たちから。",
        "speech": "from the sailors on the forecastle."
      },
      {
        "original": "He thinks he breathes it first; but not so.",
        "translation": "自分が最初に吸っていると思うのですが、そうではありません。",
        "speech": "He thinks he breathes it first; but not so."
      },
      {
        "original": "In much the same way do the commonalty lead their leaders",
        "translation": "同じように、多くの他のことにおいても庶民が",
        "speech": "In much the same way do the commonalty lead their leaders"
      },
      {
        "original": "in many other things,",
        "translation": "指導者を導くことがあります、",
        "speech": "in many other things,"
      },
      {
        "original": "at the same time that the leaders little suspect it.",
        "translation": "そしてその間、指導者はほとんどそれに気づかないのです。",
        "speech": "at the same time that the leaders little suspect it."
      }
    ]
  },
  {
    "original": "But wherefore it was that after having repeatedly smelt the sea as a merchant sailor, I should now take it into my head to go on a whaling voyage; this the invisible police officer of the Fates, who has the constant surveillance of me, and secretly dogs me, and influences me in some unaccountable way — he can better answer than any one else. And, doubtless, my going on this whaling voyage, formed part of the grand programme of Providence that was drawn up a long time ago. It came in as a sort of brief interlude and solo between more extensive performances. I take it that this part of the bill must have run something like this:",
    "translation": "しかし、なぜか、商船の水夫として何度も海の匂いを嗅いだあとで、今になって鯨捕りの航海に出ようと思い立ったのか；私を常に監視し、ひそかに追いかけ、説明のつかない方法で私に影響を及ぼす運命の目に見えない警官――彼なら誰よりもよく答えられる。そして間違いなく、私がこの鯨捕りの航海に出ることは、はるか昔に立てられた摂理の壮大な計画の一部を形成していたのだ。もっと大がかりな出来事の間に挟まれた、ひとつの短い間奏やソロのように現れたというわけだ。私はこの章の演目が次のような感じで進んだのだろうと考えている:",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "But wherefore it was that",
        "translation": "しかし、なぜ",
        "speech": "But wherefore it was that"
      },
      {
        "original": "after having repeatedly smelt the sea as a merchant sailor,",
        "translation": "商船の水夫として何度も海の匂いをかいだ後に、",
        "speech": "after having repeatedly smelt the sea as a merchant sailor,"
      },
      {
        "original": "I should now take it into my head",
        "translation": "今になって私が",
        "speech": "I should now take it into my head"
      },
      {
        "original": "to go on a whaling voyage;",
        "translation": "捕鯨の航海に出ようと思い立ったのか；",
        "speech": "to go on a whaling voyage;"
      },
      {
        "original": "this the invisible police officer of the Fates,",
        "translation": "これは運命の目に見えない警察官、",
        "speech": "this the invisible police officer of the Fates,"
      },
      {
        "original": "who has the constant surveillance of me,",
        "translation": "私を常に見守る存在が、",
        "speech": "who has the constant surveillance of me,"
      },
      {
        "original": "and secretly dogs me, and influences me in some unaccountable way —",
        "translation": "密かに私を追跡し、何らかの説明のつかない方法で私に影響を与える —",
        "speech": "and secretly dogs me, and influences me in some unaccountable way —"
      },
      {
        "original": "he can better answer than any one else.",
        "translation": "この者が誰よりもよく答えられる。",
        "speech": "he can better answer than any one else."
      },
      {
        "original": "And, doubtless, my going on this whaling voyage,",
        "translation": "そして、疑いもなく、私がこの捕鯨航海に出ることは、",
        "speech": "And, doubtless, my going on this whaling voyage,"
      },
      {
        "original": "formed part of the grand programme of Providence",
        "translation": "以前から立てられていた",
        "speech": "formed part of the grand programme of Providence"
      },
      {
        "original": "that was drawn up a long time ago.",
        "translation": "摂理の大いなる計画の一部であった。",
        "speech": "that was drawn up a long time ago."
      },
      {
        "original": "It came in as a sort of brief interlude",
        "translation": "それは、より大規模な演奏の合間の",
        "speech": "It came in as a sort of brief interlude"
      },
      {
        "original": "and solo between more extensive performances.",
        "translation": "ひとときの短い間奏や独奏のようなものであった。",
        "speech": "and solo between more extensive performances."
      },
      {
        "original": "I take it that this part",
        "translation": "私が思うに、この部分の",
        "speech": "I take it that this part"
      },
      {
        "original": "of the bill must have run something like this:",
        "translation": "公演内容はおそらく次のようであったに違いない：",
        "speech": "of the bill must have run something like this:"
      }
    ]
  },
  {
    "original": "“Grand Contested Election for the Presidency of the United States. “WHALING VOYAGE BY ONE ISHMAEL. “BLOODY BATTLE IN AFFGHANISTAN.” Though I cannot tell why it was exactly that those stage managers, the Fates, put me down for this shabby part of a whaling voyage, when others were set down for magnificent parts in high tragedies, and short and easy parts in genteel comedies, and jolly parts in farces — though I cannot tell why this was exactly; yet, now that I recall all the circumstances, I think I can see a little into the springs and motives which being cunningly presented to me under various disguises, induced me to set about performing the part I did, besides cajoling me into the delusion that it was a choice resulting from my own unbiased freewill and discriminating judgment.",
    "translation": "「アメリカ合衆国大統領選の大激戦。『イシュマエルによる捕鯨航海。』『アフガニスタンでの血みどろの戦い。』 なぜ舞台監督たち、運命の女神たちが、他の者たちに壮大な悲劇の素晴らしい役や上品な喜劇の短く楽な役、滑稽劇の愉快な役を与えたのに、私にこのみすぼらしい捕鯨航海の役を与えたのか、正確にはわからないのだが――なぜそうなったのか正確には説明できないのだが、今すべての事情を思い出すと、さまざまな変装のもとに巧妙に提示され、私に演じさせるよう仕向けた理由や動機を少しは見通せる気がするし、それに加えて、自分の偏らない自由な意志と判断による選択の結果だという幻想に私を騙し込むよう働きかけたのだと思う。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Grand Contested Election for the Presidency of the United States.",
        "translation": "“アメリカ合衆国大統領選の大論争。”",
        "speech": "“Grand Contested Election for the Presidency of the United States."
      },
      {
        "original": "“WHALING VOYAGE BY ONE ISHMAEL.",
        "translation": "“イシュメエルによる捕鯨航海。”",
        "speech": "“WHALING VOYAGE BY ONE ISHMAEL."
      },
      {
        "original": "“BLOODY BATTLE IN AFFGHANISTAN.”",
        "translation": "“アフガニスタンの血なまぐさい戦闘。”",
        "speech": "“BLOODY BATTLE IN AFFGHANISTAN.”"
      },
      {
        "original": "Though I cannot tell why it was exactly that those stage managers,",
        "translation": "正確にはなぜその舞台監督、",
        "speech": "Though I cannot tell why it was exactly that those stage managers,"
      },
      {
        "original": "the Fates, put me down for this shabby part",
        "translation": "運命の女神たちが私をこのみすぼらしい役に選んだのかは言えないが、",
        "speech": "the Fates, put me down for this shabby part"
      },
      {
        "original": "of a whaling voyage,",
        "translation": "捕鯨の航海の役に、",
        "speech": "of a whaling voyage,"
      },
      {
        "original": "when others were set down for magnificent parts in high tragedies,",
        "translation": "他の者たちが壮大な悲劇の華々しい役に選ばれ、",
        "speech": "when others were set down for magnificent parts in high tragedies,"
      },
      {
        "original": "and short and easy parts in genteel comedies,",
        "translation": "上品なコメディの短く簡単な役に割り当てられ、",
        "speech": "and short and easy parts in genteel comedies,"
      },
      {
        "original": "and jolly parts in farces —",
        "translation": "喜劇の陽気な役に割り当てられたのに対して、",
        "speech": "and jolly parts in farces —"
      },
      {
        "original": "though I cannot tell why this was exactly;",
        "translation": "なぜこれがまさにこうであったのかは言えないが、",
        "speech": "though I cannot tell why this was exactly;"
      },
      {
        "original": "yet, now that I recall all the circumstances,",
        "translation": "しかし、今すべての事情を思い出してみると、",
        "speech": "yet, now that I recall all the circumstances,"
      },
      {
        "original": "I think I can see a little into the springs",
        "translation": "私は少し見通すことができると思う",
        "speech": "I think I can see a little into the springs"
      },
      {
        "original": "and motives which being cunningly presented to me under various disguises,",
        "translation": "巧妙に様々な偽装で私の前に示された動機や理由の一端を、",
        "speech": "and motives which being cunningly presented to me under various disguises,"
      },
      {
        "original": "induced me to set about performing the part I did,",
        "translation": "それが私にとって行った行動を始めさせる原因となったことを、",
        "speech": "induced me to set about performing the part I did,"
      },
      {
        "original": "besides cajoling me into the delusion",
        "translation": "さらに、私をだまして幻想に誘い込み、",
        "speech": "besides cajoling me into the delusion"
      },
      {
        "original": "that it was a choice resulting",
        "translation": "それが私自身の偏りのない自由な意志と",
        "speech": "that it was a choice resulting"
      },
      {
        "original": "from my own unbiased freewill and discriminating judgment.",
        "translation": "慎重な判断から生じた選択であるかのように思わせたことを。",
        "speech": "from my own unbiased freewill and discriminating judgment."
      }
    ]
  },
  {
    "original": "Chief among these motives was the overwhelming idea of the great whale himself. Such a portentous and mysterious monster roused all my curiosity. Then the wild and distant seas where he rolled his island bulk; the undeliverable, nameless perils of the whale; these, with all the attending marvels of a thousand Patagonian sights and sounds, helped to sway me to my wish. With other men, perhaps, such things would not have been inducements; but as for me, I am tormented with an everlasting itch for things remote. I love to sail forbidden seas, and land on barbarous coasts. Not ignoring what is good, I am quick to perceive a horror, and could still be social with it — would they let me — since it is but well to be on friendly terms with all the inmates of the place one lodges in.",
    "translation": "これらの動機の中で最も重要だったのは、偉大なる鯨そのものの圧倒的な存在感であった。その不吉で神秘的な怪物は、私の好奇心をすべてかき立てた。そして、彼がその島のような巨体を転がす荒れた遠い海、鯨の危険は回避不可能で名のないものであること、これらすべてが、百々のパタゴニアの光景や音の驚異と共に、私の望みに心を動かしたのである。他の人々にとっては、こうしたことが誘因にならなかったかもしれない。しかし私にとっては、遠く離れたものへの永遠のかゆみに悩まされている。私は禁じられた海を航海し、野蛮な海岸に上陸するのを愛している。善なるものを無視するわけではなく、恐怖を素早く察知し、なおかつそれと社交的でいることもできる—もし許されるなら—なぜなら、宿泊する場所のすべての住人と友好的な関係でいるのは良いことだからである。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "Chief among these motives was the overwhelming idea",
        "translation": "これらの動機の中で最も重要だったのは、圧倒的な考えでした",
        "speech": "Chief among these motives was the overwhelming idea"
      },
      {
        "original": "of the great whale himself.",
        "translation": "巨大な鯨そのもののことです。",
        "speech": "of the great whale himself."
      },
      {
        "original": "Such a portentous and mysterious monster roused all my curiosity.",
        "translation": "そのような不吉で神秘的な怪物は、私の好奇心をかき立てました。",
        "speech": "Such a portentous and mysterious monster roused all my curiosity."
      },
      {
        "original": "Then the wild and distant seas where he rolled his island bulk;",
        "translation": "それから、彼がその島のような大きな体を転がす、野生で遠く離れた海;",
        "speech": "Then the wild and distant seas where he rolled his island bulk;"
      },
      {
        "original": "the undeliverable, nameless perils of the whale;",
        "translation": "鯨の予測できない、名もなき危険;",
        "speech": "the undeliverable, nameless perils of the whale;"
      },
      {
        "original": "these, with all the attending marvels",
        "translation": "これらは、すべての付随する驚異とともに",
        "speech": "these, with all the attending marvels"
      },
      {
        "original": "of a thousand Patagonian sights and sounds,",
        "translation": "千のパタゴニアの光景や音の",
        "speech": "of a thousand Patagonian sights and sounds,"
      },
      {
        "original": "helped to sway me to my wish.",
        "translation": "私の望みに影響を与える助けとなりました。",
        "speech": "helped to sway me to my wish."
      },
      {
        "original": "With other men, perhaps, such things would not have been inducements;",
        "translation": "他の人々にとっては、おそらくこれらのことは動機にはならなかったかもしれません;",
        "speech": "With other men, perhaps, such things would not have been inducements;"
      },
      {
        "original": "but as for me,",
        "translation": "しかし私にとっては、",
        "speech": "but as for me,"
      },
      {
        "original": "I am tormented with an everlasting itch for things remote.",
        "translation": "私は遠くのものへの永久のかゆみに苦しめられている。",
        "speech": "I am tormented with an everlasting itch for things remote."
      },
      {
        "original": "I love to sail forbidden seas, and land on barbarous coasts.",
        "translation": "禁じられた海を航海し、野蛮な海岸に上陸するのが大好きだ。",
        "speech": "I love to sail forbidden seas, and land on barbarous coasts."
      },
      {
        "original": "Not ignoring what is good,",
        "translation": "良いものを無視することなく、",
        "speech": "Not ignoring what is good,"
      },
      {
        "original": "I am quick to perceive a horror,",
        "translation": "私は恐怖をすぐに察知する、",
        "speech": "I am quick to perceive a horror,"
      },
      {
        "original": "and could still be social with it —",
        "translation": "そしてそれとまだ交流することもできる—",
        "speech": "and could still be social with it —"
      },
      {
        "original": "would they let me —",
        "translation": "もし私をそうさせてくれるなら—",
        "speech": "would they let me —"
      },
      {
        "original": "since it is but well to be",
        "translation": "なぜならそれはただ、",
        "speech": "since it is but well to be"
      },
      {
        "original": "on friendly terms with all the inmates",
        "translation": "滞在する場所のすべての住人と",
        "speech": "on friendly terms with all the inmates"
      },
      {
        "original": "of the place one lodges in.",
        "translation": "友好的な関係でいることが良いからだ。",
        "speech": "of the place one lodges in."
      }
    ]
  },
  {
    "original": "By reason of these things, then, the whaling voyage was welcome; the great flood-gates of the wonder-world swung open, and in the wild conceits that swayed me to my purpose, two and two there floated into my inmost soul, endless processions of the whale, and, mid most of them all, one grand hooded phantom, like a snow hill in the air.",
    "translation": "これらのことのゆえに、鯨漁の航海は歓迎されるものであった。驚異の世界の大きな水門が開き、私をその目的へ突き動かす荒々しい思いの中で、次々と鯨の果てしない行列が私の心の奥深くに浮かび上がり、そのすべての中に、空中の雪の丘のような一つの壮大な覆いをかぶった幻影があった。",
    "guide": "セミコロンで連なる描写を一つずつ整理し、最後に全体の意味をつなぎます。",
    "narrationSegments": [
      {
        "original": "By reason of these things, then, the whaling voyage was welcome;",
        "translation": "これらの理由によって、捕鯨の航海は歓迎された;",
        "speech": "By reason of these things, then, the whaling voyage was welcome;"
      },
      {
        "original": "the great flood-gates of the wonder-world swung open,",
        "translation": "驚異の世界の大洪水門が開かれ、",
        "speech": "the great flood-gates of the wonder-world swung open,"
      },
      {
        "original": "and in the wild conceits that swayed me to my purpose,",
        "translation": "私を目的に導いた荒々しい空想の中で、",
        "speech": "and in the wild conceits that swayed me to my purpose,"
      },
      {
        "original": "two and two there floated into my inmost soul,",
        "translation": "二つ二つずつ、私の最も奥深い魂に浮かんできた、",
        "speech": "two and two there floated into my inmost soul,"
      },
      {
        "original": "endless processions of the whale, and,",
        "translation": "鯨の無限の行列が、そして、",
        "speech": "endless processions of the whale, and,"
      },
      {
        "original": "mid most of them all, one grand hooded phantom,",
        "translation": "それらのほとんどの中で、一つの壮大なフードを被った幻影、",
        "speech": "mid most of them all, one grand hooded phantom,"
      },
      {
        "original": "like a snow hill in the air.",
        "translation": "空中の雪山のようなもの。",
        "speech": "like a snow hill in the air."
      }
    ]
  }
]

const work = {
  "id": "lit_en_moby_dick_water_gazers",
  "excerpt": "Chapter 1: Loomings・第1章全文",
  "coverage": {
    "unitType": "chapter",
    "label": "第1章全文",
    "sourceUnit": "Chapter 1: Loomings",
    "complete": true,
    "sourceWordCount": 2237,
    "maxWordTarget": 5000,
    "limitNote": "長編のため、5,000語以内で完結する第1章を全文収録",
    "startMarker": "Call me Ishmael. Some years ago — never mind how long precisely — having little ",
    "endMarker": "ions of the whale, and, mid most of them all, one grand hooded phantom, like a snow hill in the air.",
    "sourceSha256": "63b5820f4cbf86855bcba35dd01f473264bee6ea2e3b639b12c05981f09094b2",
    "checkedOn": "2026-08-27"
  }
}

export default deepFreeze({ ...work, scenes })
