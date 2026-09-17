import { st } from './entry.js'

// 語彙強化ロングリーディング（約2,000語）の構造台帳。節ごとに手で確かめて足していく。
// 全108文（六つの節すべて）を手で確かめて書いた。残りは台帳ができるまで解析器の表示のまま。
export default Object.freeze([
  st('[S A greeting] [V is] [C the shortest conversation {関係省略:目的格>the shortest conversation| [S a culture] [V holds] [M {前| with a stranger}]}], [接 and] [S it] [V carries] [O far more information] [M {副詞節:比較| [接 than] [S its few words] [V suggest]}].', {
    chunks: [
      ['A greeting is the shortest conversation', '挨拶は最も短い会話です（どんな会話かは次へ）'],
      ['a culture holds with a stranger,', 'ある文化が見知らぬ人と交わす'],
      ['and it carries far more information', 'そしてはるかに多くのことを伝えます'],
      ['than its few words suggest', 'そのわずかな言葉から思われるよりも'],
    ],
    notes: {
      'a culture holds with a stranger,': 'conversation の後ろに目的格の関係代名詞が省かれています。',
    },
  }),
  st('[S It] [V announces] [O {疑問詞節| [M how close] [S two people] [V may stand]}, {疑問詞節| [C how formal] [S the moment] [V must be]}, and {疑問詞節| [S who] [V is expected] [C {to:補語| [V to speak] [M first]}]}].', {
    chunks: [
      ['It announces how close two people may stand,', '挨拶は、二人がどれだけ近くに立ってよいか'],
      ['how formal the moment must be,', 'その場がどれほど改まったものであるべきか'],
      ['and who is expected to speak first', 'そしてだれが先に話すことになっているかを告げます'],
    ],
    notes: {
      'and who is expected to speak first': 'be expected to ＋ 動詞 で「〜することになっている」。',
    },
  }),
  st('[S Visitors] [M usually] [V notice] [O the gestures] [M long] [M {副詞節:時| [接 before] [S they] [V notice] [O anything {前| at all}] [M {前| about the grammar}]}].', {
    chunks: [
      ['Visitors usually notice the gestures long', '訪れる人はたいてい、ずっと先に身ぶりに気づきます'],
      ['before they notice anything at all', '何かに気づくよりも'],
      ['about the grammar', '文法について'],
    ],
    notes: {
      'Visitors usually notice the gestures long': 'gesture は「身ぶり」。long before … で「…よりずっと前に」。',
    },
  }),
  st('[M {前| In some places}] [S a surname] [V comes] [M first] [M {副詞節:理由| [接 because] [S the family] [V is understood] [C {to:補語| [V to precede] [O the individual {関係>the individual| [S who] [V carries] [O it]}]}]}].', {
    chunks: [
      ['In some places a surname comes first', '姓が先に来る場所があります'],
      ['because the family is understood', 'なぜなら家族は〜と理解されているからです'],
      ['to precede the individual who carries it', 'それを名乗る個人に先立つと'],
    ],
    notes: {
      'to precede the individual who carries it': 'precede … で「…より先に来る」。',
    },
  }),
  st('[M Elsewhere] [S a first name] [V is offered] [M immediately], [接 and] [S {動名詞| [V using] [O a title] [M instead]}] [V can feel] [M {前| like a small refusal {前| of friendship}}].', {
    chunks: [
      ['Elsewhere a first name is offered immediately,', '別の場所では、名前がすぐに差し出されます'],
      ['and using a title instead', 'そして代わりに肩書を使うと'],
      ['can feel like a small refusal of friendship', '友情のささやかな拒みのように感じられます'],
    ],
    notes: {
      'and using a title instead': 'title はここでは「肩書・敬称」。',
    },
  }),
  st('[S Neither habit] [V is] [C more polite] [M {前| than the other}], [M {副詞節:理由| [接 because] [S each] [M simply] [V answers] [O a different question {前| about {疑問詞節| [M where] [S a person] [V belongs]}}]}].', {
    chunks: [
      ['Neither habit is more polite than the other,', 'どちらの習慣も、もう一方より礼儀正しいわけではありません'],
      ['because each simply answers a different question', 'それぞれが別の問いに答えているだけだからです'],
      ['about where a person belongs', '人がどこに属するかについての'],
    ],
    notes: {
      'Neither habit is more polite than the other,': 'neither … で「どちらの…も〜ない」。',
    },
  }),
  st('[S A visitor {関係>A visitor| [S who] [V has learned] [O this]}] [V stops] [O {動名詞| [V reading] [O warmth or coldness] [M {前| into the simple order {前| of two ordinary words}}]}].', {
    chunks: [
      ['A visitor who has learned this', 'これを学んだ訪問者は'],
      ['stops reading warmth or coldness', '温かさや冷たさを読み取るのをやめます'],
      ['into the simple order of two ordinary words', 'ありふれた二語の並び順に'],
    ],
    notes: {
      'stops reading warmth or coldness': 'read A into B で「BにAを読み込む」。',
    },
  }),
  st('[S Bilingual speakers] [M often] [V move] [M {前| between two greeting systems}] [M {前| without {動名詞| [V noticing] [O {that節| [接 that] [S they] [V have changed] [O anything] [M {前| at all}]}]}}].', {
    chunks: [
      ['Bilingual speakers often move', '二つの言語を話す人はよく行き来します'],
      ['between two greeting systems', '二つの挨拶の体系のあいだを'],
      ['without noticing that they have changed anything at all', '自分が何かを変えたと気づかないまま'],
    ],
    notes: {
      'without noticing that they have changed anything at all': 'この that は接続詞で、noticing の目的語になる名詞節を作ります。',
    },
  }),
  st('[S A returnee] [V may bow] [M politely] [M {前| in one country}] [接 and] [V shake] [O hands] [M {前| in another}] [M {前| within a single week {前| of travel}}].', {
    chunks: [
      ['A returnee may bow politely in one country', '帰国した人は、ある国では丁寧におじぎをし'],
      ['and shake hands in another', '別の国では握手をすることがあります'],
      ['within a single week of travel', 'たった一週間の旅のうちに'],
    ],
    notes: {
      'A returnee may bow politely in one country': 'returnee は「帰ってきた人」。',
    },
  }),
  st('[S Their ease] [V is not] [C a talent] [M so much {前| as long practice {前| with the small rules {関係>the small rules| [S that] [V surround] [O any introduction]}}}].', {
    chunks: [
      ['Their ease is not a talent', 'その自然さは才能ではなく'],
      ['so much as long practice with the small rules', '細かな規則についての長い慣れです'],
      ['that surround any introduction', 'どんな紹介の場面も取り巻く（規則）'],
    ],
    notes: {
      'so much as long practice with the small rules': 'not A so much as B で「AというよりむしろB」。',
    },
  }),
  st('[S Apologies] [V carry] [O much the same hidden structure], [接 and] [S they] [V are misread] [M even more often] [M {副詞節:比較| [接 than] [S greetings] [V are]}].', {
    chunks: [
      ['Apologies carry much the same hidden structure,', '謝罪もほぼ同じ隠れた組み立てを持っています'],
      ['and they are misread even more often', 'そしてさらに頻繁に読み違えられます'],
      ['than greetings are', '挨拶よりも'],
    ],
    notes: {
      'and they are misread even more often': 'misread は「読み違える」。ここは受け身です。',
    },
  }),
  st('[M {前| In one setting}] [S an apology] [V repairs] [O a relationship], [M {副詞節:対比| [接 while] [M {前| in another}] [S it] [V admits] [O fault] [接 and] [V invites] [O a legal claim]}].', {
    chunks: [
      ['In one setting an apology repairs a relationship,', 'ある場面では、謝罪は関係を修復します'],
      ['while in another it admits fault', '一方、別の場面では過失を認め'],
      ['and invites a legal claim', '法的な請求を招きます'],
    ],
    notes: {
      'while in another it admits fault': 'この another は another setting のことです。',
    },
  }),
  st('[M {副詞節:理由| [接 Because] [S the two functions] [V look] [C identical] [M {前| from outside}]}], [S a sincere apology] [V can produce] [O an uproar] [M {前| rather than calm}].', {
    chunks: [
      ['Because the two functions look identical from outside,', 'この二つの働きは外からは同じに見えるので'],
      ['a sincere apology can produce an uproar', '誠実な謝罪が騒ぎを生むことがあります'],
      ['rather than calm', '静けさではなく'],
    ],
    notes: {
      'Because the two functions look identical from outside,': 'identical は「まったく同じ」。',
    },
  }),
  st('[S Tone and timing] [V matter] [M as much] [M {前| as the words themselves}], [接 and] [S irony] [M rarely] [V survives] [O translation] [M intact].', {
    chunks: [
      ['Tone and timing matter as much as the words themselves,', '口調と間合いは、言葉そのものと同じくらい大切です'],
      ['and irony rarely survives translation intact', 'そして皮肉が翻訳を無傷で越えることはまれです'],
    ],
    notes: {
      'and irony rarely survives translation intact': 'survive … intact で「…を無傷で切り抜ける」。',
    },
  }),
  st('[S Even waiting] [V has] [O a grammar], [M {副詞節:理由| [接 since] [S a queue] [V may be] [C a straight line, a loose cluster, or a numbered ticket]}].', {
    chunks: [
      ['Even waiting has a grammar,', '順番を待つことにさえ文法があります'],
      ['since a queue may be a straight line,', 'なぜなら列は一直線にも'],
      ['a loose cluster, or a numbered ticket', 'ゆるい人だかりにも、番号札にもなるからです'],
    ],
    notes: {
      'since a queue may be a straight line,': 'この since は「〜なので」という理由です。',
    },
  }),
  st('[S A visitor {関係>A visitor| [S who] [V happens] [C {to:補語| [V to stand] [M {前| in the wrong place}]}]}] [V is] [M usually] [V judged] [C careless] [M {前| rather than deliberately rude}].', {
    chunks: [
      ['A visitor who happens to stand in the wrong place', 'たまたま違う場所に立った訪問者は'],
      ['is usually judged careless', 'たいてい不注意だと見なされます'],
      ['rather than deliberately rude', 'わざと無礼なのではなく'],
    ],
    notes: {
      'is usually judged careless': 'judge ＋ 目的語 ＋ 形容詞 で「〜を…だと判断する」。ここは受け身です。',
    },
  }),
  st('[S Hospitality {前| toward strangers}] [V is] [C common] [M everywhere], [接 yet] [S the way {関係省略:関係副詞>the way| [S it] [V is offered]}] [V follows] [O local rules {関係>local rules| [O that] [S nobody] [V writes down]}].', {
    chunks: [
      ['Hospitality toward strangers is common everywhere,', '見知らぬ人へのもてなしはどこにでもあります'],
      ['yet the way it is offered', 'それでも、その差し出し方は'],
      ['follows local rules that nobody writes down', 'だれも書き留めない土地の規則に従います'],
    ],
    notes: {
      'yet the way it is offered': 'the way ＋ 主語 ＋ 動詞 で「〜するやり方」。',
    },
  }),
  st('[S The useful conclusion] [V is not] [C {that節| [接 that] [S greetings] [V are] [C arbitrary]}], [接 but] [C {that節| [接 that] [S they] [V are learned]}], [接 and] [V can] [M therefore] [V be learned] [M again].', {
    chunks: [
      ['The useful conclusion is not that greetings are arbitrary,', '役に立つ結論は、挨拶が気まぐれだということではありません'],
      ['but that they are learned,', 'そうではなく、学ばれたものであり'],
      ['and can therefore be learned again', 'だからこそ学び直せるということです'],
    ],
    notes: {
      'The useful conclusion is not that greetings are arbitrary,': 'arbitrary は「決まりのない・気まぐれの」。',
    },
  }),
  st('[S A shared meal] [V is] [C one {前| of the oldest ways {関係>the oldest ways| [M in which] [S a household] [V tells] [O1 a stranger] [O2 {that節| [接 that] [S he] [V is] [C welcome]}]}}].', {
    chunks: [
      ['A shared meal is one of the oldest ways', '共にとる食事は最も古い方法の一つです'],
      ['in which a household tells a stranger', 'それによって家庭が見知らぬ人に伝える'],
      ['that he is welcome', '歓迎していると'],
    ],
    notes: {
      'in which a household tells a stranger': 'in which は「前置詞＋関係代名詞」で、in the ways（そのやり方で）の意味です。',
    },
  }),
  st('[S {what節| [S What] [V appears] [M {前| on the table}]}] [V matters] [M far less] [M {前| than the obligations {関係省略:目的格>the obligations| [S the meal] [M quietly] [V creates] [M {前| between host and guest}]}}].', {
    chunks: [
      ['What appears on the table matters far less', '食卓に出るものの重みは、はるかに小さいのです'],
      ['than the obligations the meal quietly creates', 'その食事が静かに生む義務よりも'],
      ['between host and guest', '主人と客のあいだに'],
    ],
    notes: {
      'than the obligations the meal quietly creates': 'obligations の後ろに目的格の関係代名詞が省かれています。',
    },
  }),
  st('[M {前| In many communities}] [S a guest {関係>a guest| [S who] [V refuses] [O food]}] [V is understood] [C {to:補語| [V to be refusing] [O the relationship {関係省略:目的格>the relationship| [S the food] [V represents]}]}].', {
    chunks: [
      ['In many communities a guest who refuses food', '多くの共同体では、食べ物を断る客は'],
      ['is understood to be refusing', '断っていると受け取られます'],
      ['the relationship the food represents', 'その食べ物が表す関係を'],
    ],
    notes: {
      'the relationship the food represents': 'relationship の後ろに目的格の関係代名詞が省かれています。',
    },
  }),
  st('[M Elsewhere] [S a polite guest] [V declines] [M twice] [M {副詞節:時| [接 before] [V accepting]}], [接 and] [S a host {関係>a host| [S who] [V stops] [O {動名詞| [V offering]}]}] [V has ended] [O the ritual] [M too early].', {
    chunks: [
      ['Elsewhere a polite guest declines twice', '別の場所では、礼儀正しい客は二度断ります'],
      ['before accepting,', '受け取る前に'],
      ['and a host who stops offering', 'そして勧めるのをやめた主人は'],
      ['has ended the ritual too early', '儀礼を早く終わらせすぎたことになります'],
    ],
    notes: {
      'before accepting,': 'before ＋ -ing で「〜する前に」。主語は省かれています。',
    },
  }),
  st('[S Both rules] [V are] [C meticulous] [M {前| in their own way}], [接 and] [S both] [V remain] [C invisible] [M {前| to anyone {関係>anyone| [S who] [V has] [M never] [V been taught] [O them]}}].', {
    chunks: [
      ['Both rules are meticulous in their own way,', 'どちらの規則もそれぞれのやり方で細やかです'],
      ['and both remain invisible', 'そしてどちらも見えないままです'],
      ['to anyone who has never been taught them', 'それを教わったことのない人には'],
    ],
    notes: {
      'Both rules are meticulous in their own way,': 'meticulous は「細かいところまで行き届いた」。',
    },
  }),
  st('[S A host] [V may spend] [O days] [C {動名詞| [V preparing] [O a gorgeous meal]}], [接 or] [V may improvise] [O something frugal] [M {前| from anything {関係省略:目的格(hold)>anything| [S the kitchen] [V happens] [C {to:補語| [V to hold]}]}}].', {
    chunks: [
      ['A host may spend days preparing a gorgeous meal,', '主人は何日もかけて豪華な食事を用意することもあれば'],
      ['or may improvise something frugal', '質素なものをその場で作ることもあります'],
      ['from anything the kitchen happens to hold', '台所にたまたまあるもので'],
    ],
    notes: {
      'A host may spend days preparing a gorgeous meal,': 'spend ＋ 時間 ＋ -ing で「〜して時間を費やす」。',
    },
  }),
  st('[S The effort {前| rather than the expense}] [V is] [C {what節| [O what] [S a guest] [V is] [M generally] [V expected] [C {to:補語| [V to notice] [接 and] [V to acknowledge]}]}].', {
    chunks: [
      ['The effort rather than the expense', '費用ではなく手間のほうが'],
      ['is what a guest is generally expected', '客がふつう期待されていることです'],
      ['to notice and to acknowledge', '気づき、それを認めると'],
    ],
    notes: {
      'to notice and to acknowledge': 'acknowledge は「認めて示す」。',
    },
  }),
  st('[M {副詞節:場所| [接 Where] [S resources] [V have been depleted]}], [S a small portion {過去分詞>a small portion| [V offered] [M willingly]}] [V can mean] [O more] [M {前| than an imposing display {前| of plenty}}].', {
    chunks: [
      ['Where resources have been depleted,', '資源が乏しくなった場所では'],
      ['a small portion offered willingly', '進んで差し出された少しの分け前が'],
      ['can mean more than an imposing display of plenty', '堂々たる豊かさの見せ方より大きな意味を持ちえます'],
    ],
    notes: {
      'Where resources have been depleted,': 'deplete は「使い果たす」。ここは受け身です。',
    },
  }),
  st('[S Visitors {関係>Visitors| [S who] [V measure] [O hospitality] [M {前| by cost}] [M alone]}] [V will] [M therefore] [V misread] [O the generosity {前| in front of them}] [M almost entirely].', {
    chunks: [
      ['Visitors who measure hospitality by cost alone', 'もてなしを費用だけで測る訪問者は'],
      ['will therefore misread the generosity', 'したがって寛大さを読み違えます'],
      ['in front of them almost entirely', '目の前にある寛大さを、ほぼ丸ごと'],
    ],
    notes: {
      'Visitors who measure hospitality by cost alone': 'by ＋ 手段 で「…で測る」。alone は「〜だけで」。',
    },
  }),
  st('[S Seating] [M usually] [V encodes] [O rank, age, or the direction {前| of a view {関係>a view| [O that] [S the household] [V regards] [C {前| as honored}]}}].', {
    chunks: [
      ['Seating usually encodes rank, age,', '席の決め方はたいてい、序列や年齢を暗に示します'],
      ['or the direction of a view', 'あるいは眺めの向きを'],
      ['that the household regards as honored', 'その家が名誉あるものとみなす（眺めの）'],
    ],
    notes: {
      'that the household regards as honored': 'regard A as B で「AをBとみなす」。that は regards の目的語にあたります。',
    },
  }),
  st('[S Guests {関係>Guests| [S who] [V are asked] [C {to:補語| [V to sit] [M {前| in a particular place}]}]}] [V receive] [O information], [接 and] [M not merely] [O a chair].', {
    chunks: [
      ['Guests who are asked to sit in a particular place', '決まった場所に座るよう求められた客は'],
      ['receive information,', '情報を受け取っています'],
      ['and not merely a chair', '単に椅子を与えられているのではなく'],
    ],
    notes: {
      'Guests who are asked to sit in a particular place': 'ask ＋ 人 ＋ to ＋ 動詞 で「人に〜するよう頼む」。ここは受け身です。',
    },
  }),
  st('[M {to:副詞(目的)| [V To behave] [M sensibly] [M {前| at an unfamiliar table}]}], [仮S it] [V helps] [真S {to:名詞| [V to wait], [V to watch], [接 and] [V to follow] [O the person {関係>the person| [S who] [M clearly] [V belongs]}]}].', {
    chunks: [
      ['To behave sensibly at an unfamiliar table,', '慣れない食卓で分別よくふるまうには'],
      ['it helps to wait, to watch,', '待ち、見ることが役に立ちます'],
      ['and to follow the person who clearly belongs', 'そして明らかにその場の人に従うことが'],
    ],
    notes: {
      'it helps to wait, to watch,': 'it は形式の主語で、後ろの to ＋ 動詞 が本当の主語です。',
    },
  }),
  st('[S Some tables] [V require] [O silence] [M {副詞節:時| [接 while] [S food] [V is being served]}], [M {副詞節:対比| [接 while] [S others] [V treat] [O continuous conversation] [C {前| as the whole point {前| of {動名詞| [V eating] [M together]}}}]}].', {
    chunks: [
      ['Some tables require silence', '食事中の静けさを求める食卓もあります'],
      ['while food is being served,', '料理が出されているあいだは'],
      ['while others treat continuous conversation', '一方、絶え間ない会話を〜とみなす食卓もあります'],
      ['as the whole point of eating together', '共に食べることの眼目そのものだと'],
    ],
    notes: {
      'as the whole point of eating together': 'the point of … で「…の眼目・ねらい」。',
    },
  }),
  st('[S Timing] [V is] [M equally] [C variable], [M {副詞節:理由| [接 since] [S a main meal] [V may commence] [M {前| at six}] [M {前| in one country}] [接 and] [M {前| at eleven}] [M {前| in another}]}].', {
    chunks: [
      ['Timing is equally variable,', '時間も同じように一定ではありません'],
      ['since a main meal may commence at six in one country', '主な食事はある国では六時に始まり'],
      ['and at eleven in another', '別の国では十一時に始まるからです'],
    ],
    notes: {
      'since a main meal may commence at six in one country': 'commence は「始まる」。',
    },
  }),
  st('[S Guests {関係>Guests| [S who] [V anticipate] [O the local rhythm]}] [V avoid] [O {動名詞| [V arriving] [C hungry] [M {前| at a house {関係>a house| [S that] [V has] [M not yet] [V begun] [O {to:名詞| [V to cook]}]}}]}].', {
    chunks: [
      ['Guests who anticipate the local rhythm', '土地の時間の流れを見越す客は'],
      ['avoid arriving hungry', '空腹で着くことを避けられます'],
      ['at a house that has not yet begun to cook', 'まだ料理を始めていない家に'],
    ],
    notes: {
      'avoid arriving hungry': 'avoid ＋ -ing で「〜するのを避ける」。',
    },
  }),
  st('[S {what節| [S What] [V counts] [C {前| as edible}]}] [V is] [M also] [C a local judgment {前| rather than a fixed biological fact}].', {
    chunks: [
      ['What counts as edible', '何が食べられるものとされるかも'],
      ['is also a local judgment', 'やはり土地ごとの判断です'],
      ['rather than a fixed biological fact', '動かせない生物学上の事実ではなく'],
    ],
    notes: {
      'What counts as edible': 'count as … で「…とみなされる」。edible は「食べられる」。',
    },
  }),
  st('[S A dish {関係>A dish| [S that] [V seems] [C notorious] [M {前| to one visitor}]}] [V is] [C ordinary comfort food] [M {前| to the family {関係>the family| [S that] [V is serving] [O it]}}].', {
    chunks: [
      ['A dish that seems notorious to one visitor', 'ある訪問者には悪名高く思える料理も'],
      ['is ordinary comfort food', 'ありふれた、ほっとする食べ物です'],
      ['to the family that is serving it', 'それを出している家族にとっては'],
    ],
    notes: {
      'A dish that seems notorious to one visitor': 'notorious は「悪い意味で知られた」。',
    },
  }),
  st('[S Curiosity {関係>Curiosity| [S that] [V is expressed] [M {前| without any comment}]}] [V is] [M therefore] [M almost always] [C the safer and more welcome response].', {
    chunks: [
      ['Curiosity that is expressed without any comment', '論評を添えずに示される好奇心は'],
      ['is therefore almost always', 'したがってほとんどの場合'],
      ['the safer and more welcome response', 'より安全で、より喜ばれる反応です'],
    ],
    notes: {
      'Curiosity that is expressed without any comment': 'express は「表に出す」。ここは受け身です。',
    },
  }),
  st('[S Festivals] [V look] [M {前| like exceptions {前| to daily life}}], [接 and] [M yet] [S they] [M usually] [V restate] [O {what節| [O what] [S a community] [V values] [M most]}].', {
    chunks: [
      ['Festivals look like exceptions to daily life,', '祭りは日々の暮らしの例外のように見えます'],
      ['and yet they usually restate', 'それでもたいてい言い直しています'],
      ['what a community values most', '共同体が最も大切にするものを'],
    ],
    notes: {
      'and yet they usually restate': 'restate は「言い直す」。and yet は「それでも」。',
    },
  }),
  st('[S A ritual {過去分詞>A ritual| [V repeated] [M {前| for centuries}]}] [V carries] [O meanings {関係>meanings| [O that] [S its own participants] [V may] [M no longer] [V be able to explain]}].', {
    chunks: [
      ['A ritual repeated for centuries', '何世紀も繰り返されてきた儀礼は'],
      ['carries meanings', '意味を運んでいます（どんな意味かは次へ）'],
      ['that its own participants may no longer be able to explain', '参加者自身がもはや説明できないかもしれない（意味を）'],
    ],
    notes: {
      'A ritual repeated for centuries': 'repeated for centuries は A ritual を後ろから説明しています。',
    },
  }),
  st('[S That] [V is not] [C ignorance], [M {副詞節:理由| [接 because] [S tradition] [V stores] [O knowledge] [M {前| in a form {関係>a form| [O that] [S words alone] [V would] [M quickly] [V lose]}}]}].', {
    chunks: [
      ['That is not ignorance,', 'それは無知ではありません'],
      ['because tradition stores knowledge in a form', 'なぜなら伝統は知識をある形で蓄えるからです'],
      ['that words alone would quickly lose', '言葉だけならすぐに失われる（形で）'],
    ],
    notes: {
      'that words alone would quickly lose': 'alone はここでは「〜だけでは」。',
    },
  }),
  st('[S Some festivals] [V are] [C religious {前| in origin}] [接 and] [M now] [C largely social], [M {副詞節:対比| [接 while] [S others] [V have travelled] [M {前| in the opposite direction}]}].', {
    chunks: [
      ['Some festivals are religious in origin', '起源は宗教にある祭りもあります'],
      ['and now largely social,', 'そして今ではおおむね社交の場になっています'],
      ['while others have travelled in the opposite direction', '一方、反対の道をたどった祭りもあります'],
    ],
    notes: {
      'Some festivals are religious in origin': 'in origin で「起源においては」。',
    },
  }),
  st('[S A holy day] [V can become] [C a shopping season], [接 and] [S a commercial event] [V can] [M gradually] [V acquire] [O a sincere ritual meaning].', {
    chunks: [
      ['A holy day can become a shopping season,', '聖なる日が買い物の季節になることもあります'],
      ['and a commercial event can gradually acquire', 'そして商いの催しが少しずつ帯びることもあります'],
      ['a sincere ritual meaning', '真剣な儀礼の意味を'],
    ],
    notes: {
      'and a commercial event can gradually acquire': 'acquire は「（時間をかけて）身につける」。',
    },
  }),
  st('[S Neither change] [V makes] [O the festival] [C false], [M {副詞節:理由| [接 since] [S meaning] [V is assigned] [M {前| by the people {関係>the people| [S who] [M actually] [V keep] [O it] [M year {前| after year}]}}]}].', {
    chunks: [
      ['Neither change makes the festival false,', 'どちらの変化も祭りを偽物にはしません'],
      ['since meaning is assigned by the people', '意味を与えるのは人々だからです'],
      ['who actually keep it year after year', '毎年それを実際に続けている（人々）'],
    ],
    notes: {
      'since meaning is assigned by the people': 'assign は「割り当てる・与える」。ここは受け身です。',
    },
  }),
  st('[S Music, dancing, and calligraphy] [M often] [V carry] [O the parts {前| of belief} {関係>the parts of belief| [O that] [S formal doctrine] [V states] [M rather poorly] [接 or] [V leaves out] [M completely]}].', {
    chunks: [
      ['Music, dancing, and calligraphy often carry', '音楽と踊りと書はしばしば運んでいます'],
      ['the parts of belief', '信仰のうちの部分を'],
      ['that formal doctrine states rather poorly', '公式の教えがうまく述べられない（部分を）'],
      ['or leaves out completely', 'あるいはまったく落としてしまう'],
    ],
    notes: {
      'or leaves out completely': 'leave out … で「…を外す・書かずにおく」。',
    },
  }),
  st('[S A rhythm {過去分詞>A rhythm| [V learned] [M {前| at an early age}]}] [V can resonate] [M long] [M {副詞節:時| [接 after] [S the theology {関係>the theology| [S that] [M once] [V explained] [O it]}] [V has been lost]}].', {
    chunks: [
      ['A rhythm learned at an early age', '幼いころに覚えたリズムは'],
      ['can resonate long', '長く響き続けます'],
      ['after the theology that once explained it has been lost', 'かつてそれを説明した神学が失われたあとも'],
    ],
    notes: {
      'can resonate long': 'resonate は「響く・心に残る」。',
    },
  }),
  st('[S This] [V is] [C {疑問詞節| [M why] [S an artifact {過去分詞>an artifact| [V removed] [M {前| from its festival}]}] [V can look] [M {前| like a pretty object {前| inside a well-lit museum case}}]}].', {
    chunks: [
      ['This is why an artifact removed from its festival', 'だからこそ、祭りから外された品物は'],
      ['can look like a pretty object', 'きれいな品に見えてしまうのです'],
      ['inside a well-lit museum case', '明るく照らされた展示ケースの中では'],
    ],
    notes: {
      'This is why an artifact removed from its festival': 'artifact は「人の手で作られた品」。',
    },
  }),
  st('[S Superstition and principle] [V are] [M much] [C harder {to:副詞(形容詞)| [V to separate]}] [M {副詞節:比較| [接 than] [S outsiders] [M usually] [V assume] [O them] [C {to:補語| [V to be]}]}].', {
    chunks: [
      ['Superstition and principle are much harder to separate', '迷信と信条は、分けるのがずっと難しいのです'],
      ['than outsiders usually assume them to be', '部外者がふつう思っているよりも'],
    ],
    notes: {
      'than outsiders usually assume them to be': 'assume ＋ 目的語 ＋ to be で「〜が…だと思い込む」。',
    },
  }),
  st('[S A gesture {過去分詞>A gesture| [V made] [M {前| for luck}]}] [V may] [M also] [V be] [C a form {前| of respect} {前| toward the dead {前| of a particular family}}].', {
    chunks: [
      ['A gesture made for luck', '幸運を願ってなされる身ぶりは'],
      ['may also be a form of respect', '敬意の形でもありえます'],
      ['toward the dead of a particular family', 'ある家の亡くなった人たちへの'],
    ],
    notes: {
      'toward the dead of a particular family': 'the dead で「亡くなった人たち」。',
    },
  }),
  st('[S {動名詞| [V Calling] [O such a gesture] [C irrational]}] [V answers] [O a question {関係>a question| [O that] [S the people {現在分詞>the people| [V performing] [O it]}] [V were] [M never] [M actually] [V asking] [M {前| in the first place}]}].', {
    chunks: [
      ['Calling such a gesture irrational', 'そうした身ぶりを理屈に合わないと呼ぶことは'],
      ['answers a question', 'ある問いに答えることです（どんな問いかは次へ）'],
      ['that the people performing it', 'それを行っている人々が'],
      ['were never actually asking in the first place', 'そもそも実際には問うていなかった（問いに）'],
    ],
    notes: {
      'Calling such a gesture irrational': 'call ＋ 目的語 ＋ 形容詞 で「〜を…と呼ぶ」。',
    },
  }),
  st('[S Many festivals] [M now] [V serve] [O two audiences] [M {前| at once}]: [O {同格>two audiences| the community {関係>the community| [S that] [V keeps] [O them]} and the visitors {関係>the visitors| [S who] [V photograph] [O them]}}].', {
    chunks: [
      ['Many festivals now serve two audiences at once:', '今日、多くの祭りは二つの相手に同時に応えています'],
      ['the community that keeps them', 'それを続ける共同体と'],
      ['and the visitors who photograph them', 'それを写真に撮る訪問者に'],
    ],
    notes: {
      'Many festivals now serve two audiences at once:': 'コロンの後ろが two audiences の中身です。',
    },
  }),
  st('[S A photogenic ritual] [V can survive] [M {副詞節:理由| [接 because] [S tourism] [V funds] [O it]}], [接 and] [V can] [M also] [V be changed] [M {前| by that very same attention}].', {
    chunks: [
      ['A photogenic ritual can survive', '写真映えする儀礼は生き残ることができます'],
      ['because tourism funds it,', '観光がそれを支えるおかげで'],
      ['and can also be changed by that very same attention', 'そしてまさに同じ関心によって変えられもします'],
    ],
    notes: {
      'because tourism funds it,': 'fund は動詞で「資金を出して支える」。',
    },
  }),
  st('[S {whether節| [接 Whether] [S this] [V counts] [M {前| as preservation} or {前| as loss}]}] [V is] [C a genuine disagreement {前| rather than a question {前| with a settled answer}}].', {
    chunks: [
      ['Whether this counts as preservation or as loss', 'これが保存にあたるのか失われることにあたるのかは'],
      ['is a genuine disagreement', '本物の意見の食い違いです'],
      ['rather than a question with a settled answer', '答えの決まった問いではなく'],
    ],
    notes: {
      'Whether this counts as preservation or as loss': 'count as … で「…とみなされる」。',
    },
  }),
  st('[S Imperial history] [V complicates] [O the question] [M further], [M {副詞節:理由| [接 since] [S some traditions] [V were suppressed] [接 and] [M much later] [V revived] [M deliberately]}].', {
    chunks: [
      ['Imperial history complicates the question further,', '帝国の歴史はこの問いをさらに込み入ったものにします'],
      ['since some traditions were suppressed', '抑えつけられた伝統があり'],
      ['and much later revived deliberately', 'ずっとあとで意図して復活させられたからです'],
    ],
    notes: {
      'and much later revived deliberately': 'revive は「よみがえらせる」。ここは were を共有する受け身です。',
    },
  }),
  st('[S A revived custom] [V is not] [C less real], [M {副詞節:譲歩| [接 although] [S it] [V may serve] [O purposes {関係>purposes| [O that] [S the original version] [M never] [V had] [接 and] [V could not have imagined]}]}].', {
    chunks: [
      ['A revived custom is not less real,', 'よみがえった風習が本物でないわけではありません'],
      ['although it may serve purposes', 'ただし、目的に仕えていることはあります'],
      ['that the original version never had', 'もとの形が決して持たず'],
      ['and could not have imagined', '思いもしなかった（目的に）'],
    ],
    notes: {
      'and could not have imagined': 'could not have ＋ 過去分詞 で「〜できなかっただろう」。',
    },
  }),
  st('[S {動名詞| [V Reading] [O a festival] [M well]}] [M therefore] [V means] [O {動名詞| [V asking] [O {疑問詞節| [S who] [V keeps] [O it]}, {疑問詞節| [S who] [V pays] [M {前| for it}]}, and {疑問詞節| [S who] [V is left out]}]}].', {
    chunks: [
      ['Reading a festival well therefore means asking', 'したがって祭りをよく読むとは、問うことです'],
      ['who keeps it, who pays for it,', 'だれが続け、だれが費用を負い'],
      ['and who is left out', 'だれが外されているのかを'],
    ],
    notes: {
      'and who is left out': 'leave … out で「…を外す」。ここは受け身です。',
    },
  }),
  st('[S Objects] [V outlive] [O the people {関係>the people| [S who] [V made] [O them]}], [接 and] [S they] [V carry] [O memory] [M {前| in a way {関係>a way| [O that] [S paper documents] [V cannot]}}].', {
    chunks: [
      ['Objects outlive the people who made them,', '物はそれを作った人より長く残ります'],
      ['and they carry memory in a way', 'そして記憶をあるやり方で運びます'],
      ['that paper documents cannot', '紙の記録にはできない（やり方で）'],
    ],
    notes: {
      'that paper documents cannot': 'cannot の後ろに carry memory が省かれています。',
    },
  }),
  st('[S A length {前| of fabric}, a brick, or a wooden chest] [V can record] [O a technique {関係>a technique| [O that] [S no surviving manuscript] [M ever] [V describes]}].', {
    chunks: [
      ['A length of fabric, a brick, or a wooden chest', '一幅の布や煉瓦や木の箱が'],
      ['can record a technique', '技法を記録していることがあります'],
      ['that no surviving manuscript ever describes', '現存するどの写本も書き残していない（技法を）'],
    ],
    notes: {
      'A length of fabric, a brick, or a wooden chest': 'a length of … で「一続きの…」。chest は「ふた付きの箱」。',
    },
  }),
  st('[S Museums] [V preserve] [O such things] [M carefully], [接 but] [S they] [M also] [V remove] [O them] [M {前| from the ordinary rooms {関係>the ordinary rooms| [S that] [M once] [V explained] [O them]}}].', {
    chunks: [
      ['Museums preserve such things carefully,', '博物館はそうした物を丁寧に守ります'],
      ['but they also remove them', 'しかし同時に引き離してもいます'],
      ['from the ordinary rooms that once explained them', 'かつてそれを説明していた日常の部屋から'],
    ],
    notes: {
      'from the ordinary rooms that once explained them': 'once はここでは「かつて」。',
    },
  }),
  st('[S A souvenir {過去分詞>A souvenir| [V bought] [M {前| at a temple gate}]}] [V belongs] [M {前| to two systems {前| of meaning}}] [M {前| at the very same time}].', {
    chunks: [
      ['A souvenir bought at a temple gate', '寺の門前で買われた土産は'],
      ['belongs to two systems of meaning', '二つの意味の体系に属します'],
      ['at the very same time', 'まさに同時に'],
    ],
    notes: {
      'A souvenir bought at a temple gate': 'bought at a temple gate は A souvenir を後ろから説明しています。',
    },
  }),
  st('[M {前| For the maker}] [S it] [V may be] [C an income], [M {副詞節:対比| [接 while] [M {前| for the buyer}] [S it] [V is] [C a compressed memory {前| of a journey}]}].', {
    chunks: [
      ['For the maker it may be an income,', '作り手にとっては、それは収入かもしれません'],
      ['while for the buyer', '一方、買い手にとっては'],
      ['it is a compressed memory of a journey', '旅を縮めて閉じ込めた記憶です'],
    ],
    notes: {
      'it is a compressed memory of a journey': 'compressed は「押し縮められた」。',
    },
  }),
  st('[S Neither meaning] [V is] [C false], [M {副詞節:譲歩| [接 although] [S the two sides] [M rarely] [V acknowledge] [O each other] [M {前| in any explicit or public way}]}].', {
    chunks: [
      ['Neither meaning is false,', 'どちらの意味も偽りではありません'],
      ['although the two sides rarely acknowledge each other', 'ただし、双方が互いを認め合うことはまれです'],
      ['in any explicit or public way', 'はっきりと、人前でという形では'],
    ],
    notes: {
      'although the two sides rarely acknowledge each other': 'acknowledge は「認める」。explicit は「はっきり言葉にした」。',
    },
  }),
  st('[S Craft traditions] [M usually] [V pass] [M {前| through years {前| of apprenticeship}}] [M {前| rather than {前| through instruction {関係>instruction| [S that] [V can be recorded] [接 and] [V copied]}}}].', {
    chunks: [
      ['Craft traditions usually pass', '工芸の伝統はたいてい受け継がれます'],
      ['through years of apprenticeship', '何年もの弟子入りを通して'],
      ['rather than through instruction', '教えを通してではなく'],
      ['that can be recorded and copied', '書き取って写せる（教えを）'],
    ],
    notes: {
      'through years of apprenticeship': 'apprenticeship は「弟子として学ぶ期間」。',
    },
  }),
  st('[S A pedagogy {過去分詞>A pedagogy| [V built] [M {前| on {動名詞| [V watching] [接 and] [V repeating]}}]}] [V transmits] [O the kind {前| of judgment} {関係>the kind of judgment| [O that] [S verbal rules] [V would] [M inevitably] [V flatten]}].', {
    chunks: [
      ['A pedagogy built on watching and repeating', '見てまねることの上に立つ教え方は'],
      ['transmits the kind of judgment', 'そういう判断を伝えます'],
      ['that verbal rules would inevitably flatten', '言葉の規則なら必ず平らにしてしまう（判断を）'],
    ],
    notes: {
      'A pedagogy built on watching and repeating': 'pedagogy は「教え方」。flatten は「平板にする」。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S a workshop] [V closes]}], [S the loss] [V is not] [C a product but a set {前| of decisions} {関係>a set of decisions| [O that] [S nobody] [M ever] [V recorded]}].', {
    chunks: [
      ['When a workshop closes,', '工房が閉じるとき'],
      ['the loss is not a product', '失われるのは製品ではなく'],
      ['but a set of decisions that nobody ever recorded', 'だれも書き留めなかった一連の判断です'],
    ],
    notes: {
      'but a set of decisions that nobody ever recorded': 'not A but B で「AではなくB」。',
    },
  }),
  st('[S Catastrophe] [V accelerates] [O this kind {前| of loss}], [接 and] [M so], [M much less obviously], [V does] [S a period {前| of sudden wealth}].', {
    chunks: [
      ['Catastrophe accelerates this kind of loss,', '災厄はこの種の失われ方を速めます'],
      ['and so, much less obviously,', 'そして、ずっと目立たない形で'],
      ['does a period of sudden wealth', '急な豊かさの時期も同じことをします'],
    ],
    notes: {
      'does a period of sudden wealth': 'so does … で「…も同じである」。does の後ろに主語が出る倒置です。',
    },
  }),
  st('[S A factory {関係>A factory| [S that] [V produces] [O a cheaper version {前| of a traditional object}]}] [V can end] [O the craft] [M {前| within a single generation}].', {
    chunks: [
      ['A factory that produces a cheaper version', 'より安い形を作る工場は'],
      ['of a traditional object', '昔ながらの品物の'],
      ['can end the craft within a single generation', '一世代のうちにその工芸を終わらせることがあります'],
    ],
    notes: {
      'can end the craft within a single generation': 'craft は「手仕事の技」。',
    },
  }),
  st('[S The surplus {関係>The surplus| [O that] [S such a factory] [V creates]}] [V may] [M later] [V fund] [O the museum {関係>the museum| [S that] [V displays] [O {what節| [O what] [S it] [V replaced]}]}].', {
    chunks: [
      ['The surplus that such a factory creates', 'そうした工場が生む余りは'],
      ['may later fund the museum', 'のちに博物館を支えるかもしれません'],
      ['that displays what it replaced', 'それが取って代わったものを展示する（博物館を）'],
    ],
    notes: {
      'The surplus that such a factory creates': 'surplus は「余り・もうけ」。',
    },
  }),
  st('[S Stories] [V work] [M {前| in much the same way}], [M {副詞節:理由| [接 since] [S a protagonist] [V can carry] [O a moral premise] [M {前| across many centuries}]}].', {
    chunks: [
      ['Stories work in much the same way,', '物語もほぼ同じように働きます'],
      ['since a protagonist can carry a moral premise', '主人公が道徳の前提を運べるからです'],
      ['across many centuries', '何世紀も越えて'],
    ],
    notes: {
      'since a protagonist can carry a moral premise': 'protagonist は「物語の主人公」、premise は「前提」。',
    },
  }),
  st('[S A myth] [V is not] [C a failed history], [M {副詞節:理由| [接 because] [S it] [V is] [C a compressed argument {前| about {疑問詞節| [M how] [S people] [V should act]}}]}].', {
    chunks: [
      ['A myth is not a failed history,', '神話は出来そこないの歴史ではありません'],
      ['because it is a compressed argument', 'なぜなら圧縮された議論だからです'],
      ['about how people should act', '人がどうふるまうべきかについての'],
    ],
    notes: {
      'A myth is not a failed history,': 'myth は「神話」。',
    },
  }),
  st('[S {動名詞| [V Reading] [O it] [C {前| as a literal claim}]}] [M therefore] [V misses] [O the function {関係>the function| [O that] [S the story] [V is] [M actually] [V performing] [M {前| for its readers}]}].', {
    chunks: [
      ['Reading it as a literal claim', 'それを文字どおりの主張として読むことは'],
      ['therefore misses the function', 'したがってその働きを見落とします'],
      ['that the story is actually performing for its readers', '物語が読み手のために実際に果たしている（働きを）'],
    ],
    notes: {
      'Reading it as a literal claim': 'literal は「文字どおりの」。',
    },
  }),
  st('[S Every act {前| of preservation}] [V is] [M {前| at the same time}] [C an act {前| of selection} {関係>an act of selection| [O that] [S someone] [V has to make]}].', {
    chunks: [
      ['Every act of preservation is at the same time', '保存という行いはどれも、同時に'],
      ['an act of selection', '選び取るという行いです'],
      ['that someone has to make', 'だれかが下さねばならない（選び）'],
    ],
    notes: {
      'an act of selection': 'selection は「選ぶこと」。',
    },
  }),
  st('[S Someone] [V decides] [O {疑問詞節| [S which manuscript] [V is restored]}, {疑問詞節| [S which building] [V is protected]}, and {疑問詞節| [S which one] [V is] [M quietly] [V allowed] [C {to:補語| [V to crack]}]}].', {
    chunks: [
      ['Someone decides which manuscript is restored,', 'だれかが、どの写本を直すか'],
      ['which building is protected,', 'どの建物を守るか'],
      ['and which one is quietly allowed to crack', 'そしてどれを静かにひび割れるにまかせるかを決めます'],
    ],
    notes: {
      'and which one is quietly allowed to crack': 'allow ＋ 目的語 ＋ to ＋ 動詞 で「〜が…するのを許す」。ここは受け身です。',
    },
  }),
  st('[S Those decisions] [M quietly] [V shape] [O {what節| [O what] [S a later generation] [V will believe] [O {that節| [接 that] [S its own ancestors] [M actually] [V cared] [M about]}]}].', {
    chunks: [
      ['Those decisions quietly shape', 'そうした決定が静かに形づくります（何をかは次へ）'],
      ['what a later generation will believe', 'のちの世代が信じることを'],
      ['that its own ancestors actually cared about', '自分たちの祖先が本当は何を大切にしていたかについて'],
    ],
    notes: {
      'that its own ancestors actually cared about': 'care about … で「…を大切に思う」。文の終わりに about が残っています。',
    },
  }),
  st('[S Languages] [V move] [M together] [M {前| with people}], [接 and] [S they] [V change] [M again] [M {前| in the places {関係>the places| [M where] [S those people] [M eventually] [V arrive] [接 and] [V settle]}}].', {
    chunks: [
      ['Languages move together with people,', '言語は人とともに動きます'],
      ['and they change again in the places', 'そしてその場所で再び変わります'],
      ['where those people eventually arrive and settle', 'その人々がやがて着き、住み着く（場所で）'],
    ],
    notes: {
      'where those people eventually arrive and settle': 'settle は「住み着く」。',
    },
  }),
  st('[S A dialect] [V is not] [C a corrupted version {前| of a standard}], [M {副詞節:理由| [接 because] [S it] [V is] [C a variety {前| with a history {前| of its own}}]}].', {
    chunks: [
      ['A dialect is not a corrupted version of a standard,', '方言は標準語の崩れた形ではありません'],
      ['because it is a variety', 'なぜならそれは一つの姿だからです'],
      ['with a history of its own', 'それ自身の歴史を持つ'],
    ],
    notes: {
      'A dialect is not a corrupted version of a standard,': 'corrupted は「崩れた」。variety はここでは「言語の一つの姿」。',
    },
  }),
  st('[S The variety {関係>The variety| [S that] [V becomes] [C the standard]}] [M usually] [V did] [O so] [M {前| for political and economic reasons}] [M {前| rather than {前| for linguistic ones}}].', {
    chunks: [
      ['The variety that becomes the standard', '標準になる姿が'],
      ['usually did so', 'そうなったのはたいてい'],
      ['for political and economic reasons', '政治と経済の理由からです'],
      ['rather than for linguistic ones', '言語そのものの理由からではなく'],
    ],
    notes: {
      'usually did so': 'did so は「そうした」で、becomes the standard を受けています。',
    },
  }),
  st('[S Migration] [V is] [M often] [V described] [M {前| as a single decision}], [M {副詞節:譲歩| [接 though] [S it] [V is] [M normally] [C a long sequence {前| of smaller ones}]}].', {
    chunks: [
      ['Migration is often described as a single decision,', '移住はしばしば一つの決断として語られます'],
      ['though it is normally a long sequence', 'けれども、ふつうは長い連なりです'],
      ['of smaller ones', 'もっと小さな決断の'],
    ],
    notes: {
      'of smaller ones': 'この ones は decisions の代わりです。',
    },
  }),
  st('[S A family] [V may send] [O one member] [M first], [M then] [O a second], [接 and] [M only much later] [V consider] [O the move] [C permanent].', {
    chunks: [
      ['A family may send one member first,', 'ある家族はまず一人を送り出し'],
      ['then a second,', '次に二人目を送り'],
      ['and only much later consider the move permanent', 'ずっとあとでようやく、その移動を永続的なものと考えます'],
    ],
    notes: {
      'and only much later consider the move permanent': 'consider ＋ 目的語 ＋ 形容詞 で「〜を…だとみなす」。',
    },
  }),
  st('[S Remittances, return visits, and unfinished plans] [V can keep] [O two distant places] [C connected] [M {前| for several decades}] [M {前| at a time}].', {
    chunks: [
      ['Remittances, return visits, and unfinished plans', '送金と里帰りとやり残した計画が'],
      ['can keep two distant places connected', '遠く離れた二つの場所をつなぎ続けます'],
      ['for several decades at a time', '一度に数十年にわたって'],
    ],
    notes: {
      'can keep two distant places connected': 'keep ＋ 目的語 ＋ 過去分詞 で「〜を…されたままにする」。remittance は「送金」。',
    },
  }),
  st('[S Cities] [V tend] [O {to:名詞| [V to grow] [M {前| at the outer edges}]}], [M {関係,>the outer edges| [M where] [S new arrivals] [V can] [M still] [V afford] [O both {to:名詞| [V to live]} and {to:名詞| [V to work]}]}].', {
    chunks: [
      ['Cities tend to grow at the outer edges,', '都市は外の縁で育ちがちです'],
      ['where new arrivals can still afford', 'そこでは新しく来た人がまだ余裕を持てます'],
      ['both to live and to work', '住むことにも働くことにも'],
    ],
    notes: {
      'where new arrivals can still afford': 'afford to ＋ 動詞 で「〜する余裕がある」。',
    },
  }),
  st('[S Urbanization] [V concentrates] [O commerce], [接 and] [S congestion] [M soon] [V follows] [O the very routes {関係>the very routes| [O that] [S opportunity] [M first] [V took]}].', {
    chunks: [
      ['Urbanization concentrates commerce,', '都市化は商いを一か所に集めます'],
      ['and congestion soon follows the very routes', 'そしてやがて混雑がまさにその道をたどります'],
      ['that opportunity first took', '機会が最初に通った（道を）'],
    ],
    notes: {
      'and congestion soon follows the very routes': 'congestion は「混み合い」。',
    },
  }),
  st('[S A suburban district {関係>A suburban district| [S that] [V looks] [C random]}] [V is] [M often] [C an accurate record {前| of {疑問詞節| [S who] [V arrived] [M {前| in which decade}]}}].', {
    chunks: [
      ['A suburban district that looks random', '行き当たりばったりに見える郊外の一帯は'],
      ['is often an accurate record', 'しばしば正確な記録です'],
      ['of who arrived in which decade', 'だれがどの十年に来たのかの'],
    ],
    notes: {
      'of who arrived in which decade': 'この who は疑問詞で、「だれが来たのか」という間接疑問を作ります。',
    },
  }),
  st('[S Trade] [V has] [M always] [V carried] [O words] [M {前| along with the commodities {関係>the commodities| [S that] [V were being bought and sold] [M {前| across long distances}]}}].', {
    chunks: [
      ['Trade has always carried words', '交易は常に言葉を運んできました'],
      ['along with the commodities', '品物とともに'],
      ['that were being bought and sold across long distances', '遠くまで売り買いされていた（品物と）'],
    ],
    notes: {
      'along with the commodities': 'along with … で「…と一緒に」。commodity は「売り買いされる品」。',
    },
  }),
  st('[S A vendor {関係>A vendor| [S who] [V sells] [O an imported textile]}] [M gradually] [V learns] [O the name {関係>the name| [M under which] [S that cloth] [M first] [V travelled]}].', {
    chunks: [
      ['A vendor who sells an imported textile', '輸入された織物を売る商人は'],
      ['gradually learns the name', '少しずつその名を覚えます'],
      ['under which that cloth first travelled', 'その布が最初に旅した（名を）'],
    ],
    notes: {
      'under which that cloth first travelled': 'under which は「前置詞＋関係代名詞」で、under the name（その名で）の意味です。',
    },
  }),
  st('[M {前| Over time}] [S the borrowed word] [V outlives] [O the trade route {関係>the trade route| [S that] [M originally] [V delivered] [O it] [M {前| to the market}]}].', {
    chunks: [
      ['Over time the borrowed word outlives', '時がたつと、借りた語のほうが長く残ります'],
      ['the trade route', '交易路よりも'],
      ['that originally delivered it to the market', 'もともとそれを市場へ届けた（交易路）'],
    ],
    notes: {
      'Over time the borrowed word outlives': 'outlive … で「…より長く生き残る」。',
    },
  }),
  st('[S Work] [V shapes] [O language] [M quite as directly] [M {副詞節:比較| [接 as] [S geography] [V does]}], [接 and] [S it] [M often] [V does] [O so] [M rather more quickly].', {
    chunks: [
      ['Work shapes language quite as directly', '仕事は言語をまったく同じくらい直接に形づくります'],
      ['as geography does,', '地理が形づくるのと'],
      ['and it often does so rather more quickly', 'そしてしばしば、もっと速くそうします'],
    ],
    notes: {
      'and it often does so rather more quickly': 'does so は「そうする」で、shapes language を受けています。',
    },
  }),
  st('[S An entrepreneur, a contractor, and a factory worker {前| in one city}] [V may share] [O a vocation] [M {前| without {動名詞| [V sharing] [O much vocabulary]}}].', {
    chunks: [
      ['An entrepreneur, a contractor, and a factory worker', '起業家と請負人と工場で働く人が'],
      ['in one city may share a vocation', '同じ都市で同じ職業を共にしても'],
      ['without sharing much vocabulary', '語彙はあまり共にしないことがあります'],
    ],
    notes: {
      'An entrepreneur, a contractor, and a factory worker': 'entrepreneur は「起業家」、contractor は「請負人」。',
    },
  }),
  st('[S Registers] [V separate] [O people] [M {前| inside a single language}] [M as firmly] [M {副詞節:比較| [接 as] [S national borders] [V separate] [O them] [M {前| outside it}]}].', {
    chunks: [
      ['Registers separate people inside a single language', '言葉づかいの違いは、一つの言語の中で人を隔てます'],
      ['as firmly as national borders separate them', '国境が人を隔てるのと同じくらい強く'],
      ['outside it', 'その言語の外で'],
    ],
    notes: {
      'Registers separate people inside a single language': 'register はここでは「場面ごとの言葉づかい」。',
    },
  }),
  st('[S Bilingual communities] [V are] [M frequently] [V described] [M {前| as {動名詞| [V being trapped] [M somewhere] [M awkwardly] [M {前| between two different worlds}]}}].', {
    chunks: [
      ['Bilingual communities are frequently described', '二つの言語を使う共同体はしばしば描かれます'],
      ['as being trapped somewhere awkwardly', 'どこか居心地悪く閉じ込められていると'],
      ['between two different worlds', '二つの違う世界のあいだに'],
    ],
    notes: {
      'as being trapped somewhere awkwardly': 'be trapped で「閉じ込められる」。as ＋ -ing で「〜していると」。',
    },
  }),
  st('[S That description] [V flatters] [O the observer] [M more] [M {副詞節:比較| [接 than] [S it] [V describes] [O the speakers, {関係,>the speakers| [S who] [V are] [M usually] [V managing] [O both worlds] [M competently]}]}].', {
    chunks: [
      ['That description flatters the observer more', 'その言い方は観察する側を持ち上げます'],
      ['than it describes the speakers,', '話し手を描くというよりも'],
      ['who are usually managing both worlds competently', '話し手はたいてい両方の世界を手際よくこなしています'],
    ],
    notes: {
      'That description flatters the observer more': 'flatter は「実際よりよく見せる」。',
    },
  }),
  st('[S {what節| [S What] [V looks] [M {前| like confusion}] [M {前| from outside}]}] [V is], [M {分詞構文:時| [V seen] [M {前| from inside}]}], [C ordinary and very often quite deliberate].', {
    chunks: [
      ['What looks like confusion from outside', '外から混乱に見えるものは'],
      ['is, seen from inside,', '内側から見れば'],
      ['ordinary and very often quite deliberate', 'ありふれたことで、多くの場合とても意図的です'],
    ],
    notes: {
      'is, seen from inside,': 'seen from inside は「内側から見れば」という分詞のまとまりです。',
    },
  }),
  st('[S A stereotype] [V is] [C a compressed observation {関係>a compressed observation| [S that] [V has] [M quietly] [V stopped] [O {動名詞| [V being tested] [M {前| against any new evidence}] [M {前| at all}]}]}].', {
    chunks: [
      ['A stereotype is a compressed observation', '固定観念とは、縮めて固めた観察です'],
      ['that has quietly stopped being tested', '確かめられることを静かにやめた（観察）'],
      ['against any new evidence at all', 'どんな新しい証拠にも照らして'],
    ],
    notes: {
      'that has quietly stopped being tested': 'stop ＋ -ing で「〜するのをやめる」。being tested は受け身の動名詞です。',
    },
  }),
  st('[S It] [M usually] [V begins] [M {前| with something {関係省略:目的格>something| [S a traveller] [M genuinely] [V saw]}}] [接 and] [V ends] [M {前| as a claim {前| about millions {前| of people}}}].', {
    chunks: [
      ['It usually begins with something', 'それはたいてい、あることから始まります'],
      ['a traveller genuinely saw', '旅人が本当に見た（こと）'],
      ['and ends as a claim about millions of people', 'そして何百万人についての主張として終わります'],
    ],
    notes: {
      'a traveller genuinely saw': 'something の後ろに目的格の関係代名詞が省かれています。',
    },
  }),
  st('[S The error] [V is not] [C the original observation], [M {副詞節:理由| [接 because] [S the error] [V lies] [M {前| in the range {関係>the range| [M over which] [S it] [V is applied]}}]}].', {
    chunks: [
      ['The error is not the original observation,', '誤りは最初の観察ではありません'],
      ['because the error lies in the range', '誤りは範囲の中にあるからです'],
      ['over which it is applied', 'それが当てはめられる（範囲の）'],
    ],
    notes: {
      'over which it is applied': 'over which は「前置詞＋関係代名詞」で、over the range（その範囲にわたって）の意味です。',
    },
  }),
  st('[S Words {前| such as always and every}] [V are] [M {前| among the clearest signals {同格that>signals| [接 that] [S a description] [V has stopped] [O {動名詞| [V being] [C precise]}]}}].', {
    chunks: [
      ['Words such as always and every', 'always や every のような語は'],
      ['are among the clearest signals', '最も明確な合図の一つです'],
      ['that a description has stopped being precise', '記述が正確であることをやめたという'],
    ],
    notes: {
      'that a description has stopped being precise': 'この that は同格の that で、signals の中身を示します。',
    },
  }),
  st('[S Most customs] [V vary] [M {前| by region}], [M {前| by generation}], [M {前| by economic class}], [接 and] [M {前| by the particular occasion {関係>the particular occasion| [S that] [V is involved]}}].', {
    chunks: [
      ['Most customs vary by region, by generation,', 'たいていの風習は、地域ごと、世代ごと'],
      ['by economic class,', '経済的な立場ごとに違い'],
      ['and by the particular occasion that is involved', 'その場面ごとにも違います'],
    ],
    notes: {
      'Most customs vary by region, by generation,': 'vary by … で「…によって違う」。',
    },
  }),
  st('[S A visitor {関係>A visitor| [S who] [V has seen] [O three families]}] [V has seen] [O three families], [接 and] [V has] [M certainly not] [V seen] [O a whole nation].', {
    chunks: [
      ['A visitor who has seen three families', '三つの家族を見た訪問者は'],
      ['has seen three families,', '三つの家族を見たのであって'],
      ['and has certainly not seen a whole nation', '国民全体を見たのでは決してありません'],
    ],
    notes: {
      'and has certainly not seen a whole nation': 'certainly not で「決して〜ない」と強く否定します。',
    },
  }),
  st('[S Contrary cases] [V are] [M often] [V dismissed] [M {前| as exceptions}], [M {関係,>前の内容| [S which] [M quietly] [V protects] [O the original claim] [M {前| from any evidence}]}].', {
    chunks: [
      ['Contrary cases are often dismissed as exceptions,', '反対の例はしばしば例外として片づけられます'],
      ['which quietly protects the original claim', 'そのことが元の主張を静かに守ります'],
      ['from any evidence', 'どんな証拠からも'],
    ],
    notes: {
      'which quietly protects the original claim': 'コンマの後ろの which は、前の内容全体を受けています。',
    },
  }),
  st('[S A useful habit] [V is] [C {to:補語| [V to ask] [O {疑問詞節| [S what] [V would have to be] [C true] [M {前:意味上の主語| for the general claim itself} {to:副詞(目的)| [V to fail]}]}]}].', {
    chunks: [
      ['A useful habit is to ask', '役に立つ習慣は、問うことです'],
      ['what would have to be true', '何が本当でなければならないかを'],
      ['for the general claim itself to fail', 'その一般化そのものが崩れるには'],
    ],
    notes: {
      'for the general claim itself to fail': 'for ＋ 名詞 ＋ to ＋ 動詞 で「〜が…するには」。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S no answer {前| to that question}] [V is] [C available] [M {前| at all}]}], [S the statement] [V is] [C an attitude {前| rather than a description}].', {
    chunks: [
      ['If no answer to that question is available at all,', 'その問いに答えがまったく出せないなら'],
      ['the statement is an attitude', 'その言い分は態度であって'],
      ['rather than a description', '記述ではありません'],
    ],
    notes: {
      'the statement is an attitude': 'attitude は「身がまえ・姿勢」。',
    },
  }),
  st('[S Comparison {前| between cultures}] [V is] [C unavoidable] [接 and], [M {副詞節:時| [接 when] [S it] [V is] [C careful enough]}], [C genuinely informative] [M {前| for both sides}].', {
    chunks: [
      ['Comparison between cultures is unavoidable and,', '文化どうしを比べることは避けられません'],
      ['when it is careful enough,', 'そして十分に慎重であれば'],
      ['genuinely informative for both sides', '双方にとって本当に学びになります'],
    ],
    notes: {
      'genuinely informative for both sides': 'informative は「知らせてくれる・学びになる」。',
    },
  }),
  st('[S The difficulty] [V is] [C {that節| [接 that] [S comparisons] [M usually] [V flatter] [O the culture {関係>the culture| [S that] [V happens] [C {to:補語| [V to supply] [O the standard {前| of measurement}]}]}]}].', {
    chunks: [
      ['The difficulty is that comparisons usually flatter', '難しいのは、比較がたいてい持ち上げてしまうことです'],
      ['the culture that happens to supply', 'たまたま差し出した側の文化を'],
      ['the standard of measurement', '測るための基準を'],
    ],
    notes: {
      'the culture that happens to supply': 'happen to ＋ 動詞 で「たまたま〜する」。',
    },
  }),
  st('[S {動名詞| [V Describing] [O one practice] [C {前| as the natural one}]}] [V makes] [O every other practice] [C {原形| [V look] [M {前| like a deviation {前| from it}}]}].', {
    chunks: [
      ['Describing one practice as the natural one', 'ある習わしを当たり前のものだと述べることは'],
      ['makes every other practice', 'ほかのすべての習わしを'],
      ['look like a deviation from it', 'そこから外れたものに見せます'],
    ],
    notes: {
      'look like a deviation from it': 'deviation は「そこから外れること」。',
    },
  }),
  st('[S Reluctance {to:形容詞>Reluctance| [V to judge] [M too quickly]}] [V is not] [C the same thing {前| as indifference {前| toward values}}].', {
    chunks: [
      ['Reluctance to judge too quickly', 'すぐに決めつけるのをためらうことは'],
      ['is not the same thing', '同じではありません'],
      ['as indifference toward values', '価値への無関心とは'],
    ],
    notes: {
      'Reluctance to judge too quickly': 'reluctance to ＋ 動詞 で「〜したがらないこと」。',
    },
  }),
  st('[S It] [V is] [C the recognition {同格that>the recognition| [接 that] [S a practice] [M usually] [V makes] [O sense] [M {前| inside conditions {関係省略:目的格>conditions| [S the visitor] [V has] [M not yet] [V seen]}}]}].', {
    chunks: [
      ['It is the recognition that a practice usually makes sense', 'それは、ある習わしがたいてい筋が通るという気づきです'],
      ['inside conditions', '条件の内側では'],
      ['the visitor has not yet seen', '訪問者がまだ見ていない（条件の）'],
    ],
    notes: {
      'It is the recognition that a practice usually makes sense': 'make sense で「筋が通る」。この that は同格の that です。',
    },
  }),
  st('[M {副詞節:時| [接 Once] [S those conditions] [V are understood]}], [S some practices] [M still] [V deserve] [O criticism], [接 and] [S that criticism] [V rests] [M {前| on something solid}].', {
    chunks: [
      ['Once those conditions are understood,', 'その条件がいったん分かったあとでも'],
      ['some practices still deserve criticism,', '批判に値する習わしはあります'],
      ['and that criticism rests on something solid', 'そしてその批判は確かなものの上に立ちます'],
    ],
    notes: {
      'and that criticism rests on something solid': 'rest on … で「…の上に立つ」。',
    },
  }),
  st('[S The aim {前| of {動名詞| [V studying] [O other customs]}}] [V is] [M not simply] [C {to:補語| [V to collect] [O a store {前| of facts {前| about distant people}}]}].', {
    chunks: [
      ['The aim of studying other customs', 'ほかの風習を学ぶねらいは'],
      ['is not simply to collect a store of facts', '事実の蓄えを集めることだけではありません'],
      ['about distant people', '遠くの人々についての'],
    ],
    notes: {
      'is not simply to collect a store of facts': 'a store of … で「…の蓄え」。',
    },
  }),
  st('[S It] [V is] [C {to:補語| [V to notice] [O {that節| [接 that] [S one’s own habits] [V are] [M also] [C local, also learned, and also open {前| to question}]}]}].', {
    chunks: [
      ['It is to notice that one’s own habits', 'それは、自分自身の習慣もまた〜と気づくことです'],
      ['are also local, also learned,', '土地のものであり、学ばれたものであり'],
      ['and also open to question', '問い直しに開かれている'],
    ],
    notes: {
      'and also open to question': 'open to question で「問い直す余地がある」。',
    },
  }),
  st('[S That discovery] [V is] [C uncomfortable] [M {前| for almost everyone}], [接 and] [S the discomfort {関係省略:目的格>the discomfort| [S it] [V produces]}] [V is] [M precisely] [C the point].', {
    chunks: [
      ['That discovery is uncomfortable for almost everyone,', 'その気づきはほとんどだれにとっても居心地が悪いものです'],
      ['and the discomfort it produces', 'そしてそれが生む居心地の悪さこそ'],
      ['is precisely the point', 'まさに肝心なところです'],
    ],
    notes: {
      'and the discomfort it produces': 'discomfort の後ろに目的格の関係代名詞が省かれています。',
    },
  }),
])
