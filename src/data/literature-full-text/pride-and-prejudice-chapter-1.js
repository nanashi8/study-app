// Project Gutenbergの原文を、章・短編の完結単位で収録する。
const deepFreeze = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  Object.values(value).forEach(deepFreeze)
  return Object.freeze(value)
}

const scenes = [
  {
    "original": "It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters. “My dear Mr. Bennet,” said his lady to him one day, “have you heard that Netherfield Park is let at last?”",
    "translation": "それは万人に認められた真実である。すなわち、ある裕福な独身の男性は、必ず妻を欲しているに違いないということである。そのような男性が初めて近隣に入ってきた時の感情や考えがどれほど知られていようと、この真実は周囲の家族たちの心にしっかりと根付いており、彼は誰かの娘の正当な所有物と見なされるのである。ある日、彼の妻はこう言った。「親愛なるベネット氏、ネザーフィールド・パークがついに貸し出されたと聞きましたか？」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "It is a truth universally acknowledged,",
        "translation": "それは万人に認められた真実である、",
        "speech": "It is a truth universally acknowledged,"
      },
      {
        "original": "that a single man in possession",
        "translation": "裕福な独身男性は",
        "speech": "that a single man in possession"
      },
      {
        "original": "of a good fortune must be in want of a wife.",
        "translation": "必ず妻を求めているに違いない。",
        "speech": "of a good fortune must be in want of a wife."
      },
      {
        "original": "However little known the feelings or views",
        "translation": "このような男性の感情や考えが",
        "speech": "However little known the feelings or views"
      },
      {
        "original": "of such a man may be on his first entering a neighbourhood,",
        "translation": "近所に初めて入る際にどれほど知られていようと、",
        "speech": "of such a man may be on his first entering a neighbourhood,"
      },
      {
        "original": "this truth is so well fixed in the minds",
        "translation": "この真実は人々の心にしっかりと根付いている。",
        "speech": "this truth is so well fixed in the minds"
      },
      {
        "original": "of the surrounding families,",
        "translation": "周囲の家族たちの中で、",
        "speech": "of the surrounding families,"
      },
      {
        "original": "that he is considered as the rightful property",
        "translation": "彼は誰かしらの娘の正当な所有物と見なされています。",
        "speech": "that he is considered as the rightful property"
      },
      {
        "original": "of some one or other of their daughters.",
        "translation": "誰かしらの娘のものです。",
        "speech": "of some one or other of their daughters."
      },
      {
        "original": "“My dear Mr.",
        "translation": "「親愛なるミスター・ベネット、」",
        "speech": "“My dear Mr."
      },
      {
        "original": "Bennet,” said his lady to him one day,",
        "translation": "ある日、彼の妻が彼に言いました、",
        "speech": "Bennet,” said his lady to him one day,"
      },
      {
        "original": "“have you heard that Netherfield Park is let at last?”",
        "translation": "「ネザーフィールド・パークがついに貸し出されたって聞きましたか？」",
        "speech": "“have you heard that Netherfield Park is let at last?”"
      }
    ]
  },
  {
    "original": "Mr. Bennet replied that he had not. “But it is,” returned she; “for Mrs. Long has just been here, and she told me all about it.” Mr. Bennet made no answer. “Do not you want to know who has taken it?” cried his wife, impatiently. “You want to tell me, and I have no objection to hearing it.” “He came down to see the place” This was invitation enough.",
    "translation": "ベネット氏は、それについては知らないと答えた。「でも、そうよ」と彼女は言い返した。「ロン夫人がちょうどここに来て、全部話してくれたのよ。」ベネット氏は答えなかった。「誰がそれを手に入れたのか知りたくないの？」と妻はいらいらしながら叫んだ。「君は教えてくれたいのだろうし、私は聞くのをやめるつもりはない。」『彼はその場所を見に下りてきた』それだけで十分な招待だった。",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "Mr. Bennet replied that he had not.",
        "translation": "ベネット氏は、持っていないと答えた。",
        "speech": "Mr. Bennet replied that he had not."
      },
      {
        "original": "“But it is,” returned she; “for Mrs.",
        "translation": "「でもそうですわ」と彼女は答えた。「だって、ミセス。」",
        "speech": "“But it is,” returned she; “for Mrs."
      },
      {
        "original": "Long has just been here, and she told me all about it.”",
        "translation": "ロンがちょうどここに来て、私に全部話してくれた。",
        "speech": "Long has just been here, and she told me all about it.”"
      },
      {
        "original": "Mr. Bennet made no answer.",
        "translation": "ベネット氏は何も答えなかった。",
        "speech": "Mr. Bennet made no answer."
      },
      {
        "original": "“Do not you want to know who has taken it?”",
        "translation": "「誰がそれを持っていったのか知りたくありませんか？」",
        "speech": "“Do not you want to know who has taken it?”"
      },
      {
        "original": "cried his wife, impatiently.",
        "translation": "彼の妻はせっかちに叫んだ。",
        "speech": "cried his wife, impatiently."
      },
      {
        "original": "“You want to tell me,",
        "translation": "「あなたは私に話したいのね、",
        "speech": "“You want to tell me,"
      },
      {
        "original": "and I have no objection to hearing it.”",
        "translation": "私は聞くことに異議はありません。」",
        "speech": "and I have no objection to hearing it.”"
      },
      {
        "original": "“He came down to see the place” This was invitation enough.",
        "translation": "「彼はその場所を見に来た」これで十分な招待だった。",
        "speech": "“He came down to see the place” This was invitation enough."
      }
    ]
  },
  {
    "original": "“Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week.” “What is his name?”",
    "translation": "「まあ、あなた、知っておくべきことよ、ロング夫人によると、ネザーフィールドはイングランド北部の大金持ちの若い男性に借りられたそうよ。月曜日にチャイーズに四頭立ての馬車で訪れて場所を見に来たのだけれど、その家にとても感激して、すぐにモリス氏と契約したのですって。マイケルマス前に入居することになっていて、いくつかの使用人は来週末までに家に入ることになっているそうよ。」\n「彼の名前は？」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Why, my dear, you must know, Mrs.",
        "translation": "「まあ、親愛なる人、あなたは知っておくべきです、ミセス。",
        "speech": "“Why, my dear, you must know, Mrs."
      },
      {
        "original": "Long says that Netherfield is taken",
        "translation": "ロングは言っています、ネザーフィールドは",
        "speech": "Long says that Netherfield is taken"
      },
      {
        "original": "by a young man of large fortune from the north of England;",
        "translation": "北イングランド出身で大きな財産を持つ若い男性によって取られたと;",
        "speech": "by a young man of large fortune from the north of England;"
      },
      {
        "original": "that he came down on Monday in a chaise",
        "translation": "彼は月曜日に四頭立ての馬車で",
        "speech": "that he came down on Monday in a chaise"
      },
      {
        "original": "and four to see the place,",
        "translation": "その場所を見に来ました、",
        "speech": "and four to see the place,"
      },
      {
        "original": "and was so much delighted with it that he agreed with Mr.",
        "translation": "そして彼はそれにとても喜び、すぐにモリス氏と合意しました。",
        "speech": "and was so much delighted with it that he agreed with Mr."
      },
      {
        "original": "Morris immediately; that he is to take possession before Michaelmas,",
        "translation": "彼はミカエル祭の前にその物件を引き渡されることになり、",
        "speech": "Morris immediately; that he is to take possession before Michaelmas,"
      },
      {
        "original": "and some of his servants are to be",
        "translation": "彼の使用人の何人かが",
        "speech": "and some of his servants are to be"
      },
      {
        "original": "in the house by the end of next week.”",
        "translation": "来週の終わりまでに家に入ることになっています。」",
        "speech": "in the house by the end of next week.”"
      },
      {
        "original": "“What is his name?”",
        "translation": "「彼の名前は何ですか？」",
        "speech": "“What is his name?”"
      }
    ]
  },
  {
    "original": "“Bingley.” “Is he married or single?” “Oh, single, my dear, to be sure! A single man of large fortune; four or five thousand a year. What a fine thing for our girls!” “How so? how can it affect them?” “My dear Mr. Bennet,” replied his wife, “how can you be so tiresome? You must know that I am thinking of his marrying one of them.” “Is that his design in settling here?” “Design? Nonsense, how can you talk so! But it is very likely that he may fall in love with one of them, and therefore you must visit him as soon as he comes.”",
    "translation": "「ビングリーさん。」「彼は既婚ですか、それとも独身ですか？」「ああ、もちろん独身よ、親愛なる人。大金持ちの独身男性で、年収は四千から五千ポンド。わが娘たちにはなんて素晴らしいことなの！」 「どうしてですか？それがどう影響するというのですか？」「親愛なるベネットさん、」と妻は答えた。「どうしてそんなに面倒なことを言うのですか？あなたは私が彼に娘の一人を嫁がせようと考えていることを知っているはずでしょう。」「彼がここに住む目的はそれですか？」「目的？馬鹿なことを言わないで、どうしてそんなことを言えるの！でも、彼が娘たちのうちの一人に恋をする可能性は十分にあるわ。だから、彼が来たらすぐに訪問しなくてはならないのよ。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Bingley.” “Is he married or single?”",
        "translation": "\"ビングリー\"。「彼は既婚者ですか、それとも独身ですか?」",
        "speech": "“Bingley.” “Is he married or single?”"
      },
      {
        "original": "“Oh, single, my dear, to be sure!",
        "translation": "\"ああ、独身よ、親愛なる、確かに!",
        "speech": "“Oh, single, my dear, to be sure!"
      },
      {
        "original": "A single man of large fortune; four or five thousand a year.",
        "translation": "大財産の一人の男;年間4,5,000ドル。",
        "speech": "A single man of large fortune; four or five thousand a year."
      },
      {
        "original": "What a fine thing for our girls!”",
        "translation": "うちの娘たちにとってなんて素晴らしいことなんだ!」",
        "speech": "What a fine thing for our girls!”"
      },
      {
        "original": "“How so? how can it affect them?”",
        "translation": "\"どういうこと?それが彼らにどう影響するのか?」",
        "speech": "“How so? how can it affect them?”"
      },
      {
        "original": "“My dear Mr.",
        "translation": "親愛なるMr.",
        "speech": "“My dear Mr."
      },
      {
        "original": "Bennet,” replied his wife, “how can you be so tiresome?",
        "translation": "ベネット」と妻は答えた。「どうしてそんなに面倒なの?",
        "speech": "Bennet,” replied his wife, “how can you be so tiresome?"
      },
      {
        "original": "You must know that I am thinking",
        "translation": "私が考えていることをあなたは知らなければなりません",
        "speech": "You must know that I am thinking"
      },
      {
        "original": "of his marrying one of them.”",
        "translation": "彼がその中の一人と結婚することについてです。」",
        "speech": "of his marrying one of them.”"
      },
      {
        "original": "“Is that his design in settling here?”",
        "translation": "「ここに落ち着く目的がそれですか？」",
        "speech": "“Is that his design in settling here?”"
      },
      {
        "original": "“Design? Nonsense, how can you talk so!",
        "translation": "「目的？ ばかげています、どうしてそんなことを言えるのですか！",
        "speech": "“Design? Nonsense, how can you talk so!"
      },
      {
        "original": "But it is very likely that he may fall",
        "translation": "しかし、彼がその中の一人に恋をする可能性は非常に高いのです、",
        "speech": "But it is very likely that he may fall"
      },
      {
        "original": "in love with one of them,",
        "translation": "ですから、",
        "speech": "in love with one of them,"
      },
      {
        "original": "and therefore you must visit him as soon as he comes.”",
        "translation": "彼が来たらすぐに彼を訪ねなければなりません。」",
        "speech": "and therefore you must visit him as soon as he comes.”"
      }
    ]
  },
  {
    "original": "“I see no occasion for that. You and the girls may go — or you may send them by themselves, which perhaps will be still better; for as you are as handsome as any of them, Mr. Bingley might like you the best of the party.” “My dear, you flatter me. I certainly have had my share of beauty, but I do not pretend to be anything extraordinary now. When a woman has five grown-up daughters, she ought to give over thinking of her own beauty.”",
    "translation": "「その必要はないと思いますよ。あなたも娘たちも行ってよいですし、あるいは彼女たちだけを行かせてもよいでしょう。それがむしろ良いかもしれません。なぜなら、あなたは娘たちと同じくらい魅力的ですから、ビングリー氏はあなたを一番気に入るかもしれません。」\n「親愛なる人、あなたは私をお世辞でほめてくれますね。確かに私はかつてはそれなりに美しさを持っていましたが、今は特にこれといって自慢できるものではありません。五人の成人した娘がいる女性は、自分の美しさのことを考えるのをやめるべきでしょうから。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“I see no occasion for that.",
        "translation": "「それは必要ないと思います。」",
        "speech": "“I see no occasion for that."
      },
      {
        "original": "You and the girls may go —",
        "translation": "「あなたも娘たちも行ってもいいし—",
        "speech": "You and the girls may go —"
      },
      {
        "original": "or you may send them by themselves,",
        "translation": "あるいは娘たちだけで行ってもいいでしょう、",
        "speech": "or you may send them by themselves,"
      },
      {
        "original": "which perhaps will be still better;",
        "translation": "それがむしろ良いかもしれません;",
        "speech": "which perhaps will be still better;"
      },
      {
        "original": "for as you are as handsome as any of them, Mr.",
        "translation": "あなたは誰よりも美しいのですから、ビングリーさんは",
        "speech": "for as you are as handsome as any of them, Mr."
      },
      {
        "original": "Bingley might like you the best of the party.”",
        "translation": "あなたを一番気に入るかもしれません。」",
        "speech": "Bingley might like you the best of the party.”"
      },
      {
        "original": "“My dear, you flatter me.",
        "translation": "「親愛なるあなた、そんなにお世辞を言わないでください。",
        "speech": "“My dear, you flatter me."
      },
      {
        "original": "I certainly have had my share of beauty,",
        "translation": "確かに私は美しさの分け前を持っていましたが、",
        "speech": "I certainly have had my share of beauty,"
      },
      {
        "original": "but I do not pretend to be anything extraordinary now.",
        "translation": "今は特別何かがあるとは思っていません。",
        "speech": "but I do not pretend to be anything extraordinary now."
      },
      {
        "original": "When a woman has five grown-up daughters,",
        "translation": "女性が五人の成人した娘を持っているなら、",
        "speech": "When a woman has five grown-up daughters,"
      },
      {
        "original": "she ought to give over thinking of her own beauty.”",
        "translation": "自分の美しさについて考えるのはやめるべきです。」",
        "speech": "she ought to give over thinking of her own beauty.”"
      }
    ]
  },
  {
    "original": "“In such cases, a woman has not often much beauty to think of.” “But, my dear, you must indeed go and see Mr. Bingley when he comes into the neighbourhood.” “It is more than I engage for, I assure you.” “But consider your daughters. Only think what an establishment it would be for one of them. Sir William and Lady Lucas are determined to go, merely on that account; for in general, you know, they visit no new comers. Indeed you must go, for it will be impossible for us to visit him, if you do not.”",
    "translation": "「そのような場合、女性はあまり美しさを考えることはないのです。」 「でも、親愛なる人よ、彼が近くに来たら、ビングリー氏に会いに行かなくてはなりませんよ。」 「それは私には約束できること以上のことです、本当に。」 「でも、あなたの娘たちのことを考えてください。どれほど素晴らしい縁談になるか想像してください。ウィリアム卿とルーカス夫人は、ただその理由だけで行くと決めています；普段はご存知の通り、新参者を訪ねることはしません。確かに、あなたは行かなくてはなりません、もし行かないなら、私たちが彼を訪れることは不可能になるでしょうから。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“In such cases,",
        "translation": "「そのような場合、",
        "speech": "“In such cases,"
      },
      {
        "original": "a woman has not often much beauty to think of.”",
        "translation": "女性はあまり美を考えられないことが多い。」",
        "speech": "a woman has not often much beauty to think of.”"
      },
      {
        "original": "“But, my dear, you must indeed go and see Mr.",
        "translation": "「でも、親愛なる人よ、あなたは本当に行ってミスターに会わなければなりません。」",
        "speech": "“But, my dear, you must indeed go and see Mr."
      },
      {
        "original": "Bingley when he comes into the neighbourhood.”",
        "translation": "ビングリーが近所に来るとき。",
        "speech": "Bingley when he comes into the neighbourhood.”"
      },
      {
        "original": "“It is more than I engage for, I assure you.”",
        "translation": "「それ以上のことには手を出さないと、保証します。」",
        "speech": "“It is more than I engage for, I assure you.”"
      },
      {
        "original": "“But consider your daughters.",
        "translation": "「しかし、あなたの娘たちのことを考えてください。",
        "speech": "“But consider your daughters."
      },
      {
        "original": "Only think what an establishment it would be for one of them.",
        "translation": "どれほど素晴らしい生活の基盤になるか、一人でも想像してみてください。」",
        "speech": "Only think what an establishment it would be for one of them."
      },
      {
        "original": "Sir William and Lady Lucas are determined to go,",
        "translation": "ウィリアム卿とルーカス夫人は、その理由だけで行く決意をしています。",
        "speech": "Sir William and Lady Lucas are determined to go,"
      },
      {
        "original": "merely on that account;",
        "translation": "ただそのためだけに;",
        "speech": "merely on that account;"
      },
      {
        "original": "for in general, you know, they visit no new comers.",
        "translation": "というのも、一般的に、彼らは新しい来訪者を訪ねることはありませんから。",
        "speech": "for in general, you know, they visit no new comers."
      },
      {
        "original": "Indeed you must go,",
        "translation": "本当にあなたが行かなければなりません、",
        "speech": "Indeed you must go,"
      },
      {
        "original": "for it will be impossible for us to visit him,",
        "translation": "でなければ、私たちが彼を訪ねることは不可能になります、",
        "speech": "for it will be impossible for us to visit him,"
      },
      {
        "original": "if you do not.”",
        "translation": "あなたが行かない場合は。」",
        "speech": "if you do not.”"
      }
    ]
  },
  {
    "original": "“You are over scrupulous, surely. I dare say Mr. Bingley will be very glad to see you; and I will send a few lines by you to assure him of my hearty consent to his marrying whichever he chooses of the girls — though I must throw in a good word for my little Lizzy.” “I desire you will do no such thing. Lizzy is not a bit better than the others: and I am sure she is not half so handsome as Jane, nor half so good-humoured as Lydia. But you are always giving her the preference.”",
    "translation": "「あなたはきっと神経質すぎますよ。確かに、ビングリー氏はあなたに会えてとても喜ぶでしょうし、私はあなたに少し手紙を託して、彼がどの娘と結婚しても私が心から承諾していることを伝えてもらおうと思います――とは言え、やはり私の小さなリジィのために一言添えたいところですが。」 「そんなことは絶対にしないでください。リジィは他の娘たちよりも少しもましではありません。それに、ジェーンほど美しいわけでもなく、リディアほど快活でもありません。それなのに、あなたはいつもリジィをひいきにしているのです。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“You are over scrupulous, surely.",
        "translation": "「あなたは確かに細かすぎますよ。",
        "speech": "“You are over scrupulous, surely."
      },
      {
        "original": "I dare say Mr.",
        "translation": "多分、ビングリーさんは",
        "speech": "I dare say Mr."
      },
      {
        "original": "Bingley will be very glad to see you;",
        "translation": "あなたに会えてとても喜ぶでしょう;",
        "speech": "Bingley will be very glad to see you;"
      },
      {
        "original": "and I will send a few lines",
        "translation": "そして私からの数行を",
        "speech": "and I will send a few lines"
      },
      {
        "original": "by you to assure him of my hearty consent",
        "translation": "あなたに送って、どの娘と結婚してもよいという私の心からの同意を",
        "speech": "by you to assure him of my hearty consent"
      },
      {
        "original": "to his marrying whichever he chooses of the girls —",
        "translation": "彼に伝えてもらいます—",
        "speech": "to his marrying whichever he chooses of the girls —"
      },
      {
        "original": "though I must throw in a good word for my little Lizzy.”",
        "translation": "「でも、私の小さなリジーを少し褒めてあげたいのです。」",
        "speech": "though I must throw in a good word for my little Lizzy.”"
      },
      {
        "original": "“I desire you will do no such thing.",
        "translation": "「そんなことはまったくしないでほしい。",
        "speech": "“I desire you will do no such thing."
      },
      {
        "original": "Lizzy is not a bit better than the others:",
        "translation": "リジーは他の娘たちと少しも変わりません：",
        "speech": "Lizzy is not a bit better than the others:"
      },
      {
        "original": "and I am sure she is not half so handsome as Jane,",
        "translation": "そして、彼女がジェーンほど美しいとも思いませんし、",
        "speech": "and I am sure she is not half so handsome as Jane,"
      },
      {
        "original": "nor half so good-humoured as Lydia.",
        "translation": "リディアほど陽気でもありません。",
        "speech": "nor half so good-humoured as Lydia."
      },
      {
        "original": "But you are always giving her the preference.”",
        "translation": "それなのに、あなたはいつも彼女を優先しています。」",
        "speech": "But you are always giving her the preference.”"
      }
    ]
  },
  {
    "original": "“They have none of them much to recommend them,” replied he: “they are all silly and ignorant like other girls; but Lizzy has something more of quickness than her sisters.” “Mr. Bennet, how can you abuse your own children in such a way? You take delight in vexing me. You have no compassion on my poor nerves.” “You mistake me, my dear. I have a high respect for your nerves. They are my old friends. I have heard you mention them with consideration these twenty years at least.”",
    "translation": "「彼女たちには、勧められるところはほとんどありません」と彼は答えた。「みんな他の娘と同じで、愚かで無知です。しかしリジィには姉妹たちよりも少し機敏さがあります。」\n「ベネットさん、どうして自分の子供たちをそんなふうにけなすことができるのですか？ あなたは私をいら立たせることを楽しんでいるのですね。私のかわいそうな神経には情けをかけないのですか。」\n「誤解されていますよ、愛しい人。私はあなたの神経を非常に尊敬しています。それらは私の古い友人です。少なくともこの二十年間、考慮してそれについて言及されるのを聞いてきました。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“They have none of them much to recommend them,” replied he:",
        "translation": "「彼女たちには、特に褒めるべき点はほとんどない」と彼は答えた：",
        "speech": "“They have none of them much to recommend them,” replied he:"
      },
      {
        "original": "“they are all silly and ignorant like other girls;",
        "translation": "「みんな他の女の子たちと同じように愚かで無知だ;",
        "speech": "“they are all silly and ignorant like other girls;"
      },
      {
        "original": "but Lizzy has something more of quickness than her sisters.”",
        "translation": "でも、リジーには姉妹より少し機敏なところがある。」",
        "speech": "but Lizzy has something more of quickness than her sisters.”"
      },
      {
        "original": "“Mr. Bennet, how can you abuse your own children",
        "translation": "「ベネットさん、どうして自分の子どもたちをそんなふうにけなせるのですか",
        "speech": "“Mr. Bennet, how can you abuse your own children"
      },
      {
        "original": "in such a way?",
        "translation": "こんな言い方で?",
        "speech": "in such a way?"
      },
      {
        "original": "You take delight in vexing me.",
        "translation": "私を困らせるのが楽しいのですか。",
        "speech": "You take delight in vexing me."
      },
      {
        "original": "You have no compassion on my poor nerves.”",
        "translation": "私のかわいそうな神経を気にかけないのです。」",
        "speech": "You have no compassion on my poor nerves.”"
      },
      {
        "original": "“You mistake me, my dear.",
        "translation": "「私のことを誤解しているよ、親愛なる君。",
        "speech": "“You mistake me, my dear."
      },
      {
        "original": "I have a high respect for your nerves.",
        "translation": "君の神経を高く評価しているんだ。",
        "speech": "I have a high respect for your nerves."
      },
      {
        "original": "They are my old friends.",
        "translation": "君の神経は私の旧友のようなものだ。",
        "speech": "They are my old friends."
      },
      {
        "original": "I have heard you mention them",
        "translation": "君がそのことを言及するのを聞いてきたよ",
        "speech": "I have heard you mention them"
      },
      {
        "original": "with consideration these twenty years at least.”",
        "translation": "少なくともこの二十年は慎重に聞いてきた。」",
        "speech": "with consideration these twenty years at least.”"
      }
    ]
  },
  {
    "original": "“Ah, you do not know what I suffer.” “But I hope you will get over it, and live to see many young men of four thousand a year come into the neighbourhood.” “It will be no use to us, if twenty such should come, since you will not visit them.” “Depend upon it, my dear, that when there are twenty, I will visit them all.”",
    "translation": "「ああ、あなたは私の苦しみを知らないのですね。」 「でも、あなたがそれを乗り越え、年収四千の若者たちがたくさんこの近所に来るのを見ることができることを願っています。」 「そのような若者が二十人来ても、あなたが彼らを訪ねなければ、私たちには何の役にも立ちません。」 「頼りにしてください、親愛なる人よ、二十人になったときには、私は皆訪ねるつもりです。」",
    "guide": "引用部分と、だれが何を言ったかを分け、会話の流れを追います。",
    "narrationSegments": [
      {
        "original": "“Ah, you do not know what I suffer.”",
        "translation": "「ああ、あなたは私がどれほど苦しんでいるか分からない。」",
        "speech": "“Ah, you do not know what I suffer.”"
      },
      {
        "original": "“But I hope you will get over it,",
        "translation": "「でも、希望します、あなたがこれを乗り越えて、",
        "speech": "“But I hope you will get over it,"
      },
      {
        "original": "and live to see many young men",
        "translation": "年収四千の若い男性たちが",
        "speech": "and live to see many young men"
      },
      {
        "original": "of four thousand a year come into the neighbourhood.”",
        "translation": "多く近所にやってくるのを見られることを。」",
        "speech": "of four thousand a year come into the neighbourhood.”"
      },
      {
        "original": "“It will be no use to us,",
        "translation": "「もしそんな人が二十人来ても、私たちには無意味です、",
        "speech": "“It will be no use to us,"
      },
      {
        "original": "if twenty such should come, since you will not visit them.”",
        "translation": "あなたが彼らを訪ねないなら。」",
        "speech": "if twenty such should come, since you will not visit them.”"
      },
      {
        "original": "“Depend upon it, my dear, that when there are twenty,",
        "translation": "「信じてください、親愛なる人よ、二十人来たとき、",
        "speech": "“Depend upon it, my dear, that when there are twenty,"
      },
      {
        "original": "I will visit them all.”",
        "translation": "私は全員訪ねます。」",
        "speech": "I will visit them all.”"
      }
    ]
  },
  {
    "original": "Mr. Bennet was so odd a mixture of quick parts, sarcastic humour, reserve, and caprice, that the experience of three-and-twenty years had been insufficient to make his wife understand his character. Her mind was less difficult to develope. She was a woman of mean understanding, little information, and uncertain temper. When she was discontented, she fancied herself nervous. The business of her life was to get her daughters married: its solace was visiting and news.",
    "translation": "ベネット氏は、鋭い頭脳、皮肉なユーモア、内気さ、そして気まぐれの奇妙な混合体であり、23年間の経験をもってしても、妻が彼の性格を理解するには十分ではなかった。彼女の心は理解するのがさほど難しくはなかった。彼女は理解力が乏しく、知識も少なく、気性も不安定な女性だった。彼女が不満を抱くと、自分は神経質なのだと思い込んだ。彼女の人生の目的は娘たちを結婚させることであり、その慰めは訪問や噂話だった。",
    "guide": "時や条件を示す部分を先に受け、そのあと主な出来事へ進みます。",
    "narrationSegments": [
      {
        "original": "Mr. Bennet was so odd a mixture of quick parts,",
        "translation": "ベネット氏は、鋭い才知、",
        "speech": "Mr. Bennet was so odd a mixture of quick parts,"
      },
      {
        "original": "sarcastic humour, reserve, and caprice,",
        "translation": "皮肉なユーモア、控えめさ、気まぐれさが",
        "speech": "sarcastic humour, reserve, and caprice,"
      },
      {
        "original": "that the experience of three-and-twenty years had been insufficient",
        "translation": "非常に奇妙に混ざり合った人物で、三十三年の経験でも",
        "speech": "that the experience of three-and-twenty years had been insufficient"
      },
      {
        "original": "to make his wife understand his character.",
        "translation": "妻が彼の性格を理解するには不十分であった。",
        "speech": "to make his wife understand his character."
      },
      {
        "original": "Her mind was less difficult to develope.",
        "translation": "彼女の心は開発するのがそれほど難しくなかった。",
        "speech": "Her mind was less difficult to develope."
      },
      {
        "original": "She was a woman of mean understanding, little information, and uncertain temper.",
        "translation": "彼女は理解力が乏しく、知識も少なく、気性も不安定な女性であった。",
        "speech": "She was a woman of mean understanding, little information, and uncertain temper."
      },
      {
        "original": "When she was discontented, she fancied herself nervous.",
        "translation": "不満を抱くと、彼女は自分を神経質だと思い込んだ。",
        "speech": "When she was discontented, she fancied herself nervous."
      },
      {
        "original": "The business of her life was to get her daughters married:",
        "translation": "彼女の人生の仕事は娘たちを結婚させることであった：",
        "speech": "The business of her life was to get her daughters married:"
      },
      {
        "original": "its solace was visiting and news.",
        "translation": "慰めは訪問とニュースであった。",
        "speech": "its solace was visiting and news."
      }
    ]
  }
]

const work = {
  "id": "lit_en_pride_prejudice_netherfield",
  "excerpt": "Chapter 1・第1章全文",
  "coverage": {
    "unitType": "chapter",
    "label": "第1章全文",
    "sourceUnit": "Chapter I",
    "complete": true,
    "sourceWordCount": 860,
    "maxWordTarget": 5000,
    "limitNote": "長編のため、5,000語以内で完結する第1章を全文収録",
    "startMarker": "It is a truth universally acknowledged, that a single man in possession of a goo",
    "endMarker": "ervous. The business of her life was to get her daughters married: its solace was visiting and news.",
    "sourceSha256": "8c565e7eb74019fd7c66a9bb9a96fa12544b6e3023d6b7fac93dc1ba9cd9a3a8",
    "checkedOn": "2026-08-27"
  }
}

export default deepFreeze({ ...work, scenes })
