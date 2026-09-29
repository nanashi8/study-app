import { ls } from './entry.js'

export default Object.freeze([
  // 1
  ls('[S Alice] [V was beginning] [O {to:名詞| [V to get] [C very tired {並列| {前| of {動名詞| [V sitting] [M {前| by her sister}] [M {前| on the bank}]}}, | and {前| of {動名詞| [V having] [O nothing {to:形容詞>nothing| [V to do]}]}}}]}]: [M {成句| once or twice}] [S she] [V had peeped] [M {前| into the book {関係省略:目的格>the book| [S her sister] [V was reading]}}], [接 but] [S it] [V had] [O no {並列| pictures | or conversations}] [M {前| in it}], [O {引用| “[接 and] [C what] [V is] [S the use {前| of a book}],”}] [V thought] [S Alice] [O {引用| “[M {前| without {並列| pictures | or conversations}}]?”}]', {
    p: true,
    ja: 'アリスは、土手で姉のそばに座っているのにも、何もすることがないのにも、すっかりうんざりしはじめていた。一、二度、姉が読んでいる本をのぞいてみたけれど、その本には絵も会話もなかった。「絵も会話もない本なんて、何の役に立つのかしら」とアリスは思った。',
    chunks: [
      ['Alice was beginning to get very tired', 'アリスはすっかりうんざりしはじめていた'],
      ['of sitting by her sister on the bank,', '土手で姉のそばに座っていることに'],
      ['and of having nothing to do:', 'そして、何もすることがないことに'],
      ['once or twice she had peeped into the book', '一、二度、彼女はその本をのぞいてみた'],
      ['her sister was reading,', '姉が読んでいる（本を）'],
      ['but it had no pictures or conversations in it,', 'でも、その本には絵も会話もなかった'],
      ['“and what is the use of a book,”', '「それに、本なんて何の役に立つのかしら」'],
      ['thought Alice “without pictures or conversations?”', 'とアリスは思った「絵も会話もない（本なんて）」'],
    ],
    marks: [
      [':', 'コロンで、「うんざりしはじめていた」ことの中身を具体的に続けます。姉の本をのぞいても絵も会話もなかった、という退屈の様子が後ろに来ます。'],
    ],
    notes: {
      'Alice was beginning to get very tired': 'be beginning to do で「〜しはじめている」。get tired of A は「A にうんざりする・飽きる」で、ここでは体が疲れたのではなく、退屈している様子です。',
      'of sitting by her sister on the bank,': 'tired of のあとに、of sitting … と of having … の2つが並びます。bank はここでは「（川の）土手」。',
      'and of having nothing to do:': 'nothing to do で「することが何もない」。to do が nothing を後ろから説明します。',
      'once or twice she had peeped into the book': 'once or twice は「一、二度」。peep into A は「A をのぞき見る」。',
      'her sister was reading,': 'the book と her sister の間に、目的格の関係代名詞が省かれています。「姉が読んでいる本」。',
      '“and what is the use of a book,”': 'What is the use of A? で「A が何の役に立つのか（何の役にも立たない）」という反語の問いです。',
      'thought Alice “without pictures or conversations?”': 'thought Alice は動詞が主語の前に出た形で、アリスの心の声をはさんでいます。without … は a book を説明し、「絵も会話もない本」となります。',
    },
  }),
  // 2
  ls('[接 So] [S she] [V was considering] [M {前| in her own mind}] {挿入文| ([M as well {副詞節:比較| [接 as] [S she] [V could]}], [接 for] [S the hot day] [V made] [O her] [C {原形| [V feel] [C very {並列| sleepy | and stupid}]}])}, [O {whether節| [接 whether] [S the pleasure {前| of {動名詞| [V making] [O a daisy-chain]}}] [V would be] [C worth the trouble {前| of {並列| {動名詞| [V getting up]} | and {動名詞| [V picking] [O the daisies]}}}]}], [M {関係,>前の内容| [M when] [M suddenly] [S a White Rabbit {前| with pink eyes}] [V ran] [M close {前| by her}]}].', {
    p: true,
    ja: 'それでアリスは、ヒナギクの花輪を作る楽しみが、わざわざ立ち上がってヒナギクを摘む手間に見合うかどうかを、心の中で考えていた（とはいえ、暑い日のせいでひどく眠くてぼんやりしていたので、できるかぎりで、だったが）。すると突然、ピンクの目をした白ウサギが、アリスのすぐそばを走っていった。',
    chunks: [
      ['So she was considering in her own mind', 'それで彼女は心の中で考えていた'],
      ['(as well as she could,', '（できるかぎりは'],
      ['for the hot day made her feel very sleepy and stupid),', 'というのも、暑い日のせいでとても眠くてぼんやりしていたから）'],
      ['whether the pleasure of making a daisy-chain', 'ヒナギクの花輪を作る楽しみが'],
      ['would be worth the trouble', '手間をかけるだけの値打ちがあるかどうかを'],
      ['of getting up and picking the daisies,', '立ち上がってヒナギクを摘む（手間）'],
      ['when suddenly a White Rabbit with pink eyes', 'すると突然、ピンクの目をした白ウサギが'],
      ['ran close by her.', '彼女のすぐそばを走っていった'],
    ],
    notes: {
      'So she was considering in her own mind': 'consider は「よく考える」。何を考えていたかは、かっこのあとの whether …（〜かどうか）で示されます。',
      '(as well as she could,': 'かっこの中は、語り手が差しこんだ説明です。as well as she could で「できるかぎり（うまく）」。眠くて頭がよく働かず、考えるのも十分にはできなかった、という含みです。',
      'for the hot day made her feel very sleepy and stupid),': 'for は「というのも〜だから」と理由を付け足す接続詞。make A do で「A に〜させる」で、feel は to のない不定詞です。stupid はここでは「（眠くて）頭がぼんやりした」。',
      'whether the pleasure of making a daisy-chain': 'whether … で「〜かどうか」。daisy-chain はヒナギクの花をつないで作る花輪（首飾り）です。',
      'would be worth the trouble': 'be worth A で「A の値打ちがある」。the trouble of doing は「〜する手間」。',
      'when suddenly a White Rabbit with pink eyes': 'コンマのあとの when は「すると、そのとき」と話を先へ進める使い方です（前から順に訳します）。',
    },
  }),
  // 3（長い1文を、セミコロンなどの区切りで4つに分けた1つ目）
  ls('[M There] [V was] [S nothing {形容詞>nothing| so very remarkable}] [M {前| in that}];', {
    p: true,
    part: true,
    ja: 'そのこと自体には、それほど変わったところは何もなかった。',
    chunks: [
      ['There was nothing so very remarkable in that;', 'そのことには、それほどとりたてて変わったことは何もなかった'],
    ],
    marks: [
      [';', 'セミコロンで、「それ自体は変わったことではなかった」という文と、次の「アリスもおかしいとは思わなかった」という文を並べます。似た内容の文を、ピリオドで切らずにつなげています。'],
    ],
    notes: {
      'There was nothing so very remarkable in that;': 'nothing＋形容詞で「〜なことは何もない」。形容詞 remarkable（目立った・珍しい）が nothing を後ろから説明します。that は、白ウサギがそばを走っていったことを指します。',
    },
  }),
  // 4（1つ目の文の続き）
  ls('[接 nor] [V did] [S Alice] [V think] [仮O it] [C so very much {成句| out of the way}] [真O {to:名詞| [V to hear] [O the Rabbit] [C {原形| [V say] [M {前| to itself}], [O {引用| “[独 Oh dear]! [独 Oh dear]! [S I] [V shall be] [C late]!”}]}]}] {挿入文| ([M {副詞節:時| [接 when] [S she] [V thought] [O it] [M over] [M afterwards]}], [仮S it] [V occurred] [M {前| to her}] [真S {that節| [接 that] [S she] [V ought to have wondered] [M {前| at this}]}], [接 but] [M {前| at the time}] [S it] [M all] [V seemed] [C quite natural])};', {
    part: true,
    ja: 'ウサギが「たいへんだ！たいへんだ！遅れてしまう！」とひとりごとを言うのを聞いても、アリスはそれほどおかしなこととは思わなかった（あとでよく考えてみると、これには驚くべきだったと思いあたったのだが、そのときは何もかもがごく自然なことに思えたのだ）。',
    chunks: [
      ['nor did Alice think it so very much out of the way', 'アリスも、それほどおかしなことだとは思わなかった'],
      ['to hear the Rabbit say to itself,', 'ウサギがひとりごとを言うのを聞いても'],
      ['“Oh dear! Oh dear! I shall be late!”', '「たいへんだ！たいへんだ！遅れてしまう！」'],
      ['(when she thought it over afterwards,', '（あとでよく考えてみると'],
      ['it occurred to her that she ought to have wondered at this,', 'これには驚くべきだったと思いあたったが'],
      ['but at the time it all seemed quite natural);', 'そのときは、すべてがまったく自然なことに思えたのだ）'],
    ],
    marks: [
      [';', 'セミコロンで、「ウサギのひとりごとも変だと思わなかった」という文を区切り、次の but when …（ところが、ウサギが時計を取り出したときには）という話の転換へつなぎます。'],
    ],
    notes: {
      'nor did Alice think it so very much out of the way': 'nor のあとは、did Alice think のように疑問文と同じ語順（倒置）になり、「〜もまた…でなかった」。think it … to do で「〜するのを…だと思う」で、it は後ろの to hear … を指す形式目的語です。out of the way は「風変わりな・ふつうでない」。',
      'to hear the Rabbit say to itself,': 'hear A do で「A が〜するのを聞く」。say to oneself は「ひとりごとを言う」。',
      '“Oh dear! Oh dear! I shall be late!”': 'Oh dear! は「おやまあ・たいへんだ」という困ったときの声。I shall be late は「遅れてしまう」で、shall は I のときの未来を表す、イギリス英語の古い言い方です。',
      '(when she thought it over afterwards,': 'かっこの中は、語り手があとから振り返って説明する差しこみの文です。think A over で「A をよく考える」。',
      'it occurred to her that she ought to have wondered at this,': 'It occurs to A that … で「A に…という考えが浮かぶ」。ought to have done は「〜すべきだった（のにしなかった）」。wonder at A は「A に驚く」。',
      'but at the time it all seemed quite natural);': 'at the time は「そのときは」。it all は「そのこと全部」。',
    },
  }),
  // 5（1つ目の文の続き）
  ls('[接 but] [M {副詞節:時| [接 when] [S the Rabbit] [M actually] [V took] [O a watch] [M {前| out of its waistcoat-pocket}], [接 and] [V looked] [M {前| at it}], [接 and] [M then] [V hurried] [M on]}], [S Alice] [V started] [M {前| to her feet}], [接 for] [仮S it] [V flashed] [M {前| across her mind}] [真S {that節| [接 that] [S she] [V had] [M never] [M before] [V seen] [O a rabbit {前| with {並列| either a waistcoat-pocket, | or a watch {to:形容詞>a watch| [V to take] [M {前| out of it}]}}}]}],', {
    part: true,
    ja: 'ところが、ウサギが本当にチョッキのポケットから時計を取り出して、それを見て、それから急いで行ってしまうと、アリスははっとして立ち上がった。チョッキのポケットのあるウサギも、そこから取り出す時計を持ったウサギも、これまで一度も見たことがないと、ふと気づいたからだ。',
    chunks: [
      ['but when the Rabbit actually took a watch', 'ところが、ウサギが本当に時計を取り出して'],
      ['out of its waistcoat-pocket,', 'チョッキのポケットから'],
      ['and looked at it, and then hurried on,', 'それを見て、それから急いで行ってしまうと'],
      ['Alice started to her feet,', 'アリスははっとして立ち上がった'],
      ['for it flashed across her mind', 'というのも、ふと頭にひらめいたからだ'],
      ['that she had never before seen a rabbit', 'これまで一度もウサギを見たことがないと'],
      ['with either a waistcoat-pocket,', 'チョッキのポケットのあるウサギも'],
      ['or a watch to take out of it,', 'そこから取り出す時計を持ったウサギも'],
    ],
    notes: {
      'but when the Rabbit actually took a watch': 'actually は「本当に・実際に」。ひとりごとまではまだしも、本当に時計を取り出したので驚いた、という流れです。',
      'and looked at it, and then hurried on,': 'took・looked・hurried の3つの動詞が、主語 the Rabbit を共通にして並んでいます。hurry on は「急いで先へ行く」。',
      'Alice started to her feet,': 'start to one’s feet で「（驚いて）ぱっと立ち上がる」。start はここでは「はっとして急に動く」。',
      'for it flashed across her mind': 'it flashed across her mind that … で「…という考えがふと頭にひらめいた」。it は後ろの that節を指す形式主語です。',
      'with either a waistcoat-pocket,': 'either A or B で「A か B か」。never と組んで「A も B も〜ない」となります。waistcoat はチョッキ（ベスト）。',
      'or a watch to take out of it,': 'to take out of it が a watch を後ろから説明し、「そこから取り出すための時計」。',
    },
  }),
  // 6（1つ目の文の続き）
  ls('[接 and] [M {分詞構文:付帯状況| [V burning] [M {前| with curiosity}]}], [S she] [V ran] [M {前| across the field}] [M {前| after it}], [接 and] [M fortunately] [V was] [M just] [C {前| in time}] [M {to:副詞(結果)| [V to see] [O it] [C {原形| [V pop] [M {前| down a large rabbit-hole {前| under the hedge}}]}]}].', {
    ja: 'そして好奇心に燃えて、野原を横切ってウサギのあとを追いかけ、運よくちょうど、ウサギが生け垣の下の大きなウサギ穴にぴょんと飛びこむところを見ることができた。',
    chunks: [
      ['and burning with curiosity,', 'そして好奇心に燃えて'],
      ['she ran across the field after it,', '彼女は野原を横切ってウサギを追いかけ'],
      ['and fortunately was just in time', '運よく、ちょうど間に合った'],
      ['to see it pop down a large rabbit-hole', 'ウサギが大きなウサギ穴にぴょんと飛びこむのを見るのに'],
      ['under the hedge.', '生け垣の下の（ウサギ穴に）'],
    ],
    notes: {
      'and burning with curiosity,': 'burning … は分詞構文で「好奇心に燃えながら」。burn with A で「A に燃える」。',
      'she ran across the field after it,': 'run after A で「A を追いかける」。it はウサギを指します。',
      'and fortunately was just in time': 'be in time で「間に合う」。主語 she を共通にして、ran と was が並んでいます。',
      'to see it pop down a large rabbit-hole': 'see A do で「A が〜するのを見る」。pop down は「ぽんと下へ（穴へ）飛びこむ」。',
    },
  }),
  // 7
  ls('[M {前| In another moment}] [M down] [V went] [S Alice] [M {前| after it}], [M {分詞構文:付帯状況| [M never once] [V considering] [O {疑問詞節| [M how] [M {前| in the world}] [S she] [V was to get] [M out] [M again]}]}].', {
    p: true,
    ja: '次の瞬間には、アリスもウサギのあとを追って穴の中へ飛びこんでいた。いったいどうやってまた外へ出るのかなど、一度も考えずに。',
    chunks: [
      ['In another moment down went Alice after it,', '次の瞬間には、アリスもウサギを追って下へ飛びこんでいた'],
      ['never once considering how in the world', 'いったいどうやって'],
      ['she was to get out again.', 'また外へ出るのかなど、一度も考えずに'],
    ],
    notes: {
      'In another moment down went Alice after it,': 'down went Alice は、down（下へ）を文の頭に出して、動詞 went が主語 Alice の前に来た倒置の形です。勢いよく飛びこむ様子を表します。',
      'never once considering how in the world': 'never once considering … は分詞構文で「一度も〜を考えずに」。in the world は疑問詞 how を強めて「いったい」。',
      'she was to get out again.': 'be to do は「〜することになる・〜できる」。「どうやって外へ出られるのか」。',
    },
  }),
  // 8
  ls('[S The rabbit-hole] [V went] [M straight on] [M {前| like a tunnel}] [M {前| for some way}], [接 and] [M then] [V dipped] [M suddenly] [M down], [M so suddenly] [M {副詞節:結果| [接 that] [S Alice] [V had not] [O a moment {to:形容詞>a moment| [V to think] [M {前| about {動名詞| [V stopping] [O herself]}}]}] [M {副詞節:時| [接 before] [S she] [V found] [O herself] [C {現在分詞:補語| [V falling] [M {前| down a very deep well}]}]}]}].', {
    p: true,
    ja: 'ウサギ穴はしばらくトンネルのようにまっすぐ続き、それから急に下へ落ちこんでいた。あまりに急だったので、アリスは踏みとどまろうと考える間もなく、気がつくと、とても深い井戸のような穴を落ちていた。',
    chunks: [
      ['The rabbit-hole went straight on like a tunnel for some way,', 'ウサギ穴はしばらくトンネルのようにまっすぐ続き'],
      ['and then dipped suddenly down,', 'それから急に下へ落ちこんでいた'],
      ['so suddenly that Alice had not a moment', 'あまりに急だったので、アリスには一瞬の間もなかった'],
      ['to think about stopping herself', '踏みとどまろうと考える（間も）'],
      ['before she found herself falling down a very deep well.', 'とても深い井戸を落ちていると気づくまでに'],
    ],
    notes: {
      'The rabbit-hole went straight on like a tunnel for some way,': 'go straight on で「まっすぐ続く」。for some way は「しばらくの間（ある距離を）」。',
      'and then dipped suddenly down,': 'dip down は「下へ傾く・落ちこむ」。主語 The rabbit-hole を共通にして、went と dipped が並んでいます。',
      'so suddenly that Alice had not a moment': 'so … that ～ で「とても…なので～」。had not a moment は「一瞬もなかった」（今の英語なら did not have）。',
      'to think about stopping herself': 'to think about … が a moment を後ろから説明し、「〜を考える一瞬（の間）」。stop oneself は「（自分の体を）止める」。',
      'before she found herself falling down a very deep well.': 'find oneself doing で「気がつくと〜している」。before は「〜する前に」ですが、ここでは「〜するまでに」と訳すと自然です。',
    },
  }),
  // 9
  ls('[接 Either] [S the well] [V was] [C very deep], [接 or] [S she] [V fell] [M very slowly], [接 for] [S she] [V had] [O plenty {前| of time}] [M {副詞節:時| [接 as] [S she] [V went] [M down]}] [M {並列| {to:形容詞>plenty of time| [V to look] [M {前| about her}]} | and {to:形容詞>plenty of time| [V to wonder] [O {疑問詞節| [S what] [V was going to happen] [M next]}]}}].', {
    p: true,
    ja: '井戸がとても深かったのか、それともアリスがとてもゆっくり落ちていったのか。というのも、落ちていく間に、あたりを見回したり、次に何が起こるのだろうと考えたりする時間が、たっぷりあったのだ。',
    chunks: [
      ['Either the well was very deep,', '井戸がとても深かったのか'],
      ['or she fell very slowly,', 'それとも彼女がとてもゆっくり落ちていったのか'],
      ['for she had plenty of time as she went down', 'というのも、落ちていく間に、たっぷり時間があったからだ'],
      ['to look about her', 'あたりを見回したり'],
      ['and to wonder what was going to happen next.', '次に何が起こるのだろうと考えたりする（時間が）'],
    ],
    notes: {
      'Either the well was very deep,': 'Either A or B で「A か、それとも B か」。井戸が深いのか、落ち方がゆっくりなのか、2つの説明を並べています。',
      'for she had plenty of time as she went down': 'for は理由を付け足す接続詞で「というのも〜だから」。そう考えた理由が「時間がたっぷりあったこと」です。as she went down は「落ちていく間に」。',
      'to look about her': 'to look … と to wonder … が、plenty of time を後ろから説明します（「〜する時間」）。look about で「あたりを見回す」。',
      'and to wonder what was going to happen next.': 'wonder what … で「何が…だろうと思う」。be going to は「〜しようとしている」。',
    },
  }),
  // 10
  ls('[M First], [S she] [V tried] [O {to:名詞| [V to look] [M down] [接 and] [V make out] [O {疑問詞節| [O what] [S she] [V was coming to]}]}], [接 but] [S it] [V was] [C too dark {to:副詞(程度)| [V to see] [O anything]}]; [M then] [S she] [V looked] [M {前| at the sides {前| of the well}}], [接 and] [V noticed] [O {that節| [接 that] [S they] [V were filled] [M {前| with {並列| cupboards | and book-shelves}}]}]; [M {成句| here and there}] [S she] [V saw] [O {並列| maps | and pictures}] [C {過去分詞:補語| [V hung] [M {前| upon pegs}]}].', {
    ja: 'まず、下を見て、自分がどこへ落ちていくのか見きわめようとしたけれど、暗すぎて何も見えなかった。それから井戸の壁に目をやると、戸棚や本棚がびっしり並んでいるのに気づいた。あちこちに、地図や絵が掛けくぎに掛かっていた。',
    chunks: [
      ['First, she tried to look down', 'まず、彼女は下を見ようとした'],
      ['and make out what she was coming to,', 'そして、自分が何に向かって落ちているのか見きわめようと'],
      ['but it was too dark to see anything;', 'でも暗すぎて、何も見えなかった'],
      ['then she looked at the sides of the well,', 'それから井戸の壁に目をやると'],
      ['and noticed that they were filled with cupboards and book-shelves;', '戸棚や本棚でいっぱいなのに気づいた'],
      ['here and there she saw maps and pictures', 'あちこちに、地図や絵が見えた'],
      ['hung upon pegs.', '掛けくぎに掛けられた（地図や絵が）'],
    ],
    marks: [
      [';', 'セミコロンで、「下を見たが何も見えなかった」ことと、次に「壁を見た」ことを区切ります。落ちながら順にしたことを、ピリオドで切らずに続けています。'],
      [';', 'セミコロンで、「壁が戸棚や本棚でいっぱいだった」ことに、「あちこちに地図や絵が掛かっていた」という様子を付け足します。'],
    ],
    notes: {
      'and make out what she was coming to,': 'make out は「見分ける・見きわめる」。what she was coming to は「自分が何のところへ行き着こうとしているのか」で、to の目的語が文の頭の what です。',
      'but it was too dark to see anything;': 'too … to do で「あまりに…で〜できない」。it は明暗を表す主語で、訳しません。',
      'and noticed that they were filled with cupboards and book-shelves;': 'they は the sides（井戸の壁）を指します。be filled with A で「A でいっぱいだ」。',
      'here and there she saw maps and pictures': 'here and there は「あちこちに」。',
      'hung upon pegs.': 'see A done で「A が〜されているのを見る」。hung は hang（掛ける）の過去分詞、peg は壁に打った掛けくぎです。',
    },
  }),
  // 11
  ls('[S She] [V took down] [O a jar] [M {前| from one {前| of the shelves}}] [M {副詞節:時| [接 as] [S she] [V passed]}]; [S it] [V was labelled] [C “ORANGE MARMALADE”], [接 but] [M {前| to her great disappointment}] [S it] [V was] [C empty]: [S she] [V did not like] [O {to:名詞| [V to drop] [O the jar]}] [M {前| for fear {前| of {動名詞| [V killing] [O somebody] [M underneath]}}}], [接 so] [V managed] [O {to:名詞| [V to put] [O it] [M {前| into one {前| of the cupboards}}]}] [M {副詞節:時| [接 as] [S she] [V fell] [M {前| past it}]}].', {
    ja: '通りすぎざまに、アリスは棚の一つからびんを取り下ろした。「オレンジ・マーマレード」というラベルが貼ってあったけれど、がっかりしたことに、中は空っぽだった。びんを落として下にいる誰かにあてて死なせてはいけないと思い、落ちながら横を通りすぎる戸棚の一つに、なんとかしまいこんだ。',
    chunks: [
      ['She took down a jar from one of the shelves', '彼女は棚の一つからびんを取り下ろした'],
      ['as she passed;', '通りすぎながら'],
      ['it was labelled “ORANGE MARMALADE”,', 'それには「オレンジ・マーマレード」というラベルが貼ってあった'],
      ['but to her great disappointment it was empty:', 'けれど、とてもがっかりしたことに、空っぽだった'],
      ['she did not like to drop the jar', '彼女はびんを落としたくなかった'],
      ['for fear of killing somebody underneath,', '下にいる誰かを死なせてしまうといけないので'],
      ['so managed to put it into one of the cupboards', 'それで、なんとか戸棚の一つにびんをしまった'],
      ['as she fell past it.', 'その横を落ちていきながら'],
    ],
    marks: [
      [';', 'セミコロンで、「びんを取った」ことと、そのびんが「どんなびんだったか」を区切ってつなぎます。'],
      [':', 'コロンで、「空っぽだった」ことを受けて、その空のびんをどうしたか（落とさずに戸棚へしまった）を続けます。'],
    ],
    notes: {
      'She took down a jar from one of the shelves': 'take down A で「A を（高い所から）下ろす」。jar は口の広いびんです。',
      'as she passed;': 'as は「〜しながら・〜するときに」。落ちながら棚の前を通りすぎたところです。',
      'it was labelled “ORANGE MARMALADE”,': 'be labelled A で「A というラベルが貼られている」。marmalade はオレンジなどの皮入りのジャムです。',
      'but to her great disappointment it was empty:': 'to one’s disappointment で「がっかりしたことに」。',
      'for fear of killing somebody underneath,': 'for fear of doing で「〜するといけないので」。underneath は「下に」。',
      'so managed to put it into one of the cupboards': 'manage to do で「なんとか〜する」。主語 she が省かれ、did not like と managed が並んでいます。',
      'as she fell past it.': 'past は「〜のそばを通りすぎて」という前置詞です。it は戸棚を指します。',
    },
  }),
  // 12
  ls('[O {引用| “[独 Well]!”}] [V thought] [S Alice] [M {前| to herself}], [O {引用| “[M {前| after such a fall {前| as this}}], [S I] [V shall think] [O nothing] [M {前| of {動名詞| [V tumbling] [M {前| down stairs}]}}]!}]', {
    p: true,
    ja: '「まあ！」とアリスは心の中で思った。「こんなに落ちたあとなら、階段を転げ落ちるくらい、なんでもないわ！',
    chunks: [
      ['“Well!” thought Alice to herself,', '「まあ！」とアリスは心の中で思った'],
      ['“after such a fall as this,', '「こんなふうに落ちたあとなら'],
      ['I shall think nothing of tumbling down stairs!', '階段を転げ落ちるくらい、なんとも思わないわ！'],
    ],
    notes: {
      '“Well!” thought Alice to herself,': 'Well! は「まあ・さて」という気持ちを表す声。think to oneself は「心の中で思う」。thought Alice は動詞が主語の前に出た形です。',
      '“after such a fall as this,': 'such A as this で「こんな A」。fall は名詞で「落下」。',
      'I shall think nothing of tumbling down stairs!': 'think nothing of doing で「〜するのを何とも思わない」。tumble down stairs は「階段を転げ落ちる」。',
    },
  }),
  // 13
  ls('[C How brave] [S they][V ’ll] [M all] [V think] [O me] [M {前| at home}]!', {
    ja: 'うちのみんなは、わたしをなんて勇敢な子だと思うことでしょう！',
    chunks: [
      ['How brave they’ll all think me at home!', 'うちのみんなは、わたしのことをなんて勇敢だと思うでしょう！'],
    ],
    notes: {
      'How brave they’ll all think me at home!': 'How＋形容詞で始まる感嘆文で「なんと〜だろう」。もとは They’ll all think me very brave.（think A B で「A を B だと思う」）で、brave が How と組んで文の頭に出ています。they’ll は they will の短縮形です。',
    },
  }),
  // 14
  ls('[独 Why], [S I] [V wouldn’t say] [O anything] [M {前| about it}], [M {副詞節:譲歩| [接 even if] [S I] [V fell] [M {前| off the top {前| of the house}}]}]!”', {
    ja: 'だって、たとえ家のてっぺんから落ちたって、わたし、そのことで何も言わないもの！」',
    chunks: [
      ['Why, I wouldn’t say anything about it,', 'だって、そんなこと、何も言わないわ'],
      ['even if I fell off the top of the house!”', 'たとえ家のてっぺんから落ちたとしても！」'],
    ],
    notes: {
      'Why, I wouldn’t say anything about it,': 'Why, … は「だって・まあ」と話し始めるときの声で、「なぜ」ではありません。wouldn’t は「（仮に〜しても）〜しないだろう」という仮定の気持ちを表します。',
      'even if I fell off the top of the house!”': 'even if … で「たとえ〜しても」。fell は仮定法の過去形で、「（実際にはないけれど）もし落ちたとしても」。fall off A は「A から落ちる」。',
    },
  }),
  // 15
  ls('([S Which] [V was] [M very likely] [C true].)', {
    ja: '（それは、たぶん本当だっただろう。）',
    chunks: [
      ['(Which was very likely true.)', '（それはたぶん本当だっただろう）'],
    ],
    notes: {
      '(Which was very likely true.)': 'Which は前のアリスの言葉「家のてっぺんから落ちても何も言わない」を受けて、「そしてそれは」と続ける関係代名詞です。very likely は「たぶん」。そんな高さから落ちたら口もきけなくなるだろう、という語り手の皮肉な冗談です。',
    },
  }),
  // 16
  ls('[M Down], [M down], [M down].', {
    p: true,
    fragment: true,
    ja: '下へ、下へ、どこまでも下へ。',
    chunks: [
      ['Down, down, down.', '下へ、下へ、下へ'],
    ],
    notes: {
      'Down, down, down.': '動詞のない文で、down（下へ）をくり返して、落ちていくのがいつまでも続く様子を表します。',
    },
  }),
  // 17
  ls('[V Would] [S the fall] [M never] [V come] [M {前| to an end}]?', {
    ja: 'この落下は、いつまでも終わらないのだろうか。',
    chunks: [
      ['Would the fall never come to an end?', 'この落下は、いつまでも終わらないのだろうか'],
    ],
    notes: {
      'Would the fall never come to an end?': 'come to an end で「終わる」。Would … never …? は「いつまでも〜しないのだろうか」と、不安やいらだちを表す問いです。',
    },
  }),
  // 18
  ls('[O {引用| “[S I] [V wonder] [O {疑問詞節| [M how many miles] [S I][V ’ve fallen] [M {前| by this time}]}]?”}] [S she] [V said] [M aloud].', {
    ja: '「もう何マイルぐらい落ちたのかしら」と、アリスは声に出して言った。',
    chunks: [
      ['“I wonder how many miles I’ve fallen by this time?”', '「今までに何マイル落ちたのかしら」'],
      ['she said aloud.', 'と彼女は声に出して言った'],
    ],
    notes: {
      '“I wonder how many miles I’ve fallen by this time?”': 'I wonder＋疑問詞 … で「…かしら」。I’ve は I have の短縮形で、have fallen は現在完了「（今までに）落ちてきた」。by this time は「今ごろまでに」。1マイルは約1.6キロメートルです。',
      'she said aloud.': 'aloud は「声に出して」。',
    },
  }),
  // 19
  ls('“[S I] [V must be getting] [M somewhere {前| near the centre {前| of the earth}}].', {
    ja: '「きっと、地球の中心のあたりに近づいているんだわ。',
    chunks: [
      ['“I must be getting somewhere near the centre of the earth.', '「きっと地球の中心の近くまで来ているのね'],
    ],
    notes: {
      '“I must be getting somewhere near the centre of the earth.': 'must be doing で「〜しているにちがいない」。get near A は「A の近くまで来る」。somewhere は「どこか・だいたい」。centre はイギリスのつづりで、アメリカでは center です。',
    },
  }),
  // 20（アリスのひとりごとに語り手の説明が割りこむ1文を、3つに分けた1つ目）
  ls('[V Let] [O me] [C {原形| [V see]}]: [S that] [V would be] [C four thousand miles down], [M {挿入| I think}] — ”', {
    part: true,
    ja: 'ええと、それだと四千マイル下ということになるわね、たしか——」',
    chunks: [
      ['Let me see:', 'ええと'],
      ['that would be four thousand miles down,', 'それだと四千マイル下ということになるわね'],
      ['I think — ”', 'たしか——」'],
    ],
    marks: [
      [':', 'コロンで、「ええと（考えてみよう）」のあとに、考えた中身（四千マイル下のはずだ）を続けます。'],
      ['—', 'ダッシュで、アリスのひとりごとがここで途切れ、かっこの中の語り手の説明が割りこむことを示します。'],
    ],
    notes: {
      'Let me see:': 'Let me see. は「ええと・そうね」と考えるときの決まった言い方です。',
      'that would be four thousand miles down,': 'that は「地球の中心の近く」を指します。would は「（計算すると）〜になるだろう」という推量。地球の半径はおよそ四千マイル（約6400キロメートル）です。',
      'I think — ”': 'I think は「たしか」と自信のなさを表す挿入です。',
    },
  }),
  // 21（1つの文の続き。語り手のかっこ書き）
  ls('([接 for], [M {挿入| you see}], [S Alice] [V had learnt] [O several things {前| of this sort}] [M {前| in her lessons {前| in the schoolroom}}], [接 and] [M {副詞節:譲歩| [接 though] [S this] [V was not] [C a very good opportunity {前| for {動名詞| [V showing off] [O her knowledge]}}], [M {副詞節:理由| [接 as] [M there] [V was] [S no one {to:形容詞>no one| [V to listen] [M {前| to her}]}]}]}], [M still] [仮S it] [V was] [C good practice] [真S {to:名詞| [V to say] [O it] [M over]}])', {
    part: true,
    ja: '（というのも、アリスは勉強部屋の授業で、この手のことをいくつか習っていたのだ。聞いてくれる人が誰もいないので、知識を見せびらかすにはあまりいい機会ではなかったけれど、それでも口に出してくり返してみるのは、いいおさらいになった）',
    chunks: [
      ['(for, you see,', '（というのも、ほら'],
      ['Alice had learnt several things of this sort', 'アリスはこの種のことをいくつか習っていたのだ'],
      ['in her lessons in the schoolroom,', '勉強部屋での授業で'],
      ['and though this was not a very good opportunity', 'そして、これはあまりいい機会ではなかったけれど'],
      ['for showing off her knowledge,', '自分の知識を見せびらかすには'],
      ['as there was no one to listen to her,', '聞いてくれる人が誰もいなかったので'],
      ['still it was good practice to say it over)', 'それでも、それを口に出してくり返すのはいい練習になった）'],
    ],
    notes: {
      '(for, you see,': 'かっこの中は、語り手がアリスのひとりごとに割りこんで説明する部分です。for は「というのも」、you see は「ほら・ご存じのとおり」と読者に語りかける言い方です。',
      'Alice had learnt several things of this sort': 'learnt は learn の過去分詞（イギリスのつづり）。had learnt は過去完了で「（それまでに）習っていた」。of this sort は「この種の」。',
      'in her lessons in the schoolroom,': 'schoolroom は、家庭教師に習う、家の中の勉強部屋のことです。',
      'and though this was not a very good opportunity': 'though … は「〜だけれども」。後ろの still（それでも）と組んで、「…ではあったが、それでも〜」という流れになります。',
      'for showing off her knowledge,': 'show off A で「A を見せびらかす」。',
      'as there was no one to listen to her,': 'as は理由を表し「〜なので」。to listen to her が no one を後ろから説明します。',
      'still it was good practice to say it over)': 'it は形式主語で、中身は to say it over（それを口に出してくり返すこと）。say over は「くり返し言う・おさらいする」。',
    },
  }),
  // 22（1つの文の続き。アリスのひとりごとに戻る）
  ls('“ — [独 yes], [S that][V ’s] [M about] [C the right distance] — [接 but] [M then] [S I] [V wonder] [O {疑問詞節| [O what {並列| Latitude | or Longitude}] [S I][V ’ve got to]}]?”', {
    ja: '「——そう、だいたいそのくらいの距離よね——でも、それじゃあ、わたし、緯度でいうと、経度でいうと、どこに来たのかしら」',
    chunks: [
      ['“ — yes, that’s about the right distance —', '「——そう、だいたいそのくらいの距離ね——'],
      ['but then I wonder what Latitude or Longitude', 'でも、それなら、どの緯度、どの経度に'],
      ['I’ve got to?”', '来たのかしら」'],
    ],
    marks: [
      ['—', 'ダッシュで、かっこの中の語り手の説明が終わり、アリスのひとりごとに戻ることを示します。'],
      ['—', 'ダッシュで、「ちょうどいい距離ね」と言ったあと、話を but then（でも、それなら）と次の疑問へ切りかえます。'],
    ],
    notes: {
      '“ — yes, that’s about the right distance —': 'that’s は that is の短縮形。about はここでは「およそ」という副詞です。',
      'but then I wonder what Latitude or Longitude': 'but then は「でも、それなら」。Latitude は緯度、Longitude は経度。what Latitude or Longitude で「どの緯度や経度」。',
      'I’ve got to?”': 'I’ve got to は have got to（〜しなければならない）ではなく、get to A（A に着く）の現在完了で、「（どの緯度・経度に）着いたのか」。to の目的語が前の what Latitude or Longitude です。',
    },
  }),
  // 23
  ls('([S Alice] [V had] [O no idea {疑問詞節| [C what] [S Latitude] [V was]}], [接 or] [O Longitude] [M either], [接 but] [V thought] [O {that省略| [S they] [V were] [C nice grand words {to:形容詞>nice grand words| [V to say]}]}].)', {
    ja: '（アリスは、緯度が何なのかも、経度が何なのかも、まったく分かっていなかったけれど、口にするにはすてきで立派な言葉だと思っていたのだ。）',
    chunks: [
      ['(Alice had no idea what Latitude was,', '（アリスは緯度が何なのか、まったく分かっていなかった'],
      ['or Longitude either,', '経度が何なのかも'],
      ['but thought they were nice grand words to say.)', 'でも、口にするにはすてきで立派な言葉だと思っていたのだ）'],
    ],
    notes: {
      '(Alice had no idea what Latitude was,': 'have no idea … で「…がまったく分からない」。what Latitude was は「緯度が何なのか」という疑問詞の節で、idea の中身を表します。',
      'or Longitude either,': 'or Longitude either は、or what Longitude was either（経度が何なのかも）を短くした言い方です。否定の文で「〜も（ない）」と言うときは either を使います。',
      'but thought they were nice grand words to say.)': 'thought のあとに that が省かれています。grand は「立派な・堂々とした」。to say が words を後ろから説明し、「口にする（のにすてきな）言葉」。',
    },
  }),
  // 24
  ls('[M Presently] [S she] [V began] [M again].', {
    p: true,
    ja: 'やがて、アリスはまた話しはじめた。',
    chunks: [
      ['Presently she began again.', 'やがて、彼女はまた話しはじめた'],
    ],
    notes: {
      'Presently she began again.': 'presently は古い言い方で「まもなく・やがて」（今の英語では「現在」の意味でも使います）。began は「（話し）はじめた」。',
    },
  }),
  // 25
  ls('“[S I] [V wonder] [O {if節| [接 if] [S I] [V shall fall] [M right {前| through the earth}]}]!', {
    ja: '「このまま、地球をまっすぐ突きぬけて落ちていっちゃうのかしら！',
    chunks: [
      ['“I wonder if I shall fall right through the earth!', '「わたし、地球をまっすぐ突きぬけて落ちちゃうのかしら！'],
    ],
    notes: {
      '“I wonder if I shall fall right through the earth!': 'I wonder if … で「…かしら」。if は「〜かどうか」。right through A で「A をまっすぐ突きぬけて」。',
    },
  }),
  // 26
  ls('[C How funny] [仮S it][V ’ll seem] [真S {to:名詞| [V to come out] [M {前| among the people {関係>the people| [S that] [V walk] [M {前| with their heads downward}]}}]}]!', {
    ja: '頭を下にして歩いている人たちの中へ、ひょっこり出ていくなんて、なんておかしなことでしょう！',
    chunks: [
      ['How funny it’ll seem to come out among the people', '人々の中へ出ていくなんて、なんておかしく思えるでしょう'],
      ['that walk with their heads downward!', '頭を下にして歩いている（人々の中へ）'],
    ],
    notes: {
      'How funny it’ll seem to come out among the people': 'How＋形容詞の感嘆文。it は形式主語で、中身は to come out among the people（人々の中に出ること）。it’ll は it will の短縮形です。',
      'that walk with their heads downward!': 'that は関係代名詞で、the people を説明します。with their heads downward は「頭を下に向けて」。地球の反対側の人は逆さまに歩いている、とアリスは考えています。',
    },
  }),
  // 27
  ls('[独 The Antipathies], [M {挿入| I think}] — ” {挿入文| ([S she] [V was] [C rather glad {that省略| [M there] [V was] [S no one {現在分詞>no one| [V listening]}]}], [M this time], [M {副詞節:理由| [接 as] [S it] [V didn’t sound] [M {前| at all}] [C the right word]}])} “ — [接 but] [S I] [V shall have to ask] [O1 them] [O2 {疑問詞節| [C what] [S the name {前| of the country}] [V is]}], [M {挿入| you know}].', {
    ja: 'たしか「アンチパシーズ」とかいう人たち——」（今度ばかりは、誰も聞いていなくてかえってよかったと、アリスは思った。どうも正しい言葉には聞こえなかったからだ）「——でも、その人たちに、この国の名前を聞かなくちゃいけないわね。',
    chunks: [
      ['The Antipathies, I think — ”', '「アンチパシーズ」っていうんだったかしら——」'],
      ['(she was rather glad there was no one listening, this time,', '（今度ばかりは、誰も聞いていなくてかえってよかったと彼女は思った'],
      ['as it didn’t sound at all the right word)', 'まるで正しい言葉には聞こえなかったから）'],
      ['“ — but I shall have to ask them', '「——でも、その人たちに聞かなくちゃいけないわね'],
      ['what the name of the country is, you know.', 'その国の名前は何ですかって'],
    ],
    marks: [
      ['— —', 'ダッシュ2つで、アリスのひとりごとが途切れ、語り手のかっこ書きをはさんで、また続くことを示します。'],
    ],
    notes: {
      'The Antipathies, I think — ”': 'アリスは、地球の反対側に住む人々を表す the Antipodes（アンティポディーズ）と言いたかったのに、よく似た音の Antipathies（反感・きらいな気持ち）と言いまちがえています。I think は「たしか」。',
      '(she was rather glad there was no one listening, this time,': 'rather は「むしろ・かえって」。glad のあとに that が省かれていて、「誰も聞いていないことが」うれしかった、となります。listening は no one を後ろから説明します。',
      'as it didn’t sound at all the right word)': 'as は理由「〜なので」。not … at all で「まったく〜ない」。sound A で「A に聞こえる」。',
      '“ — but I shall have to ask them': 'shall have to do で「〜しなければならないだろう」。ask A B で「A に B をたずねる」。',
      'what the name of the country is, you know.': 'what the name of the country is は「その国の名前は何か」という疑問詞の節で、ask の2つ目の目的語です。you know は「ほら・〜でしょ」と念を押す言い方です。',
    },
  }),
  // 28
  ls('[独 Please], [独 Ma’am], [V is] [S this] [C {並列| New Zealand | or Australia}]?”', {
    ja: 'すみません、奥さま、ここはニュージーランドですか、それともオーストラリアですか」',
    chunks: [
      ['Please, Ma’am, is this New Zealand or Australia?”', 'すみません、奥さま、ここはニュージーランドですか、オーストラリアですか」'],
    ],
    notes: {
      'Please, Ma’am, is this New Zealand or Australia?”': 'Ma’am は madam を短くした言い方で、女性へのていねいな呼びかけ「奥さま」。イギリスから見て地球の反対側にある国として、ニュージーランドとオーストラリアを挙げています。',
    },
  }),
  // 29
  ls('([接 and] [S she] [V tried] [O {to:名詞| [V to curtsey]}] [M {副詞節:時| [接 as] [S she] [V spoke]}] — [V fancy] [O {動名詞| [V curtseying]}] [M {副詞節:時| [接 as] [S you][V ’re falling] [M {前| through the air}]}]!', {
    ja: '（そう言いながら、アリスはひざを曲げておじぎをしようとした——空中を落ちながらおじぎをするところを、想像してみてください！',
    chunks: [
      ['(and she tried to curtsey as she spoke —', '（そして彼女は、話しながらひざを曲げておじぎをしようとした——'],
      ['fancy curtseying as you’re falling through the air!', '空中を落ちながらおじぎをするなんて、想像してごらんなさい！'],
    ],
    marks: [
      ['—', 'ダッシュで、「おじぎをしようとした」という語りから、読者への語りかけ（落ちながらおじぎをするなんて、想像してごらん）へ切りかえます。'],
    ],
    notes: {
      '(and she tried to curtsey as she spoke —': 'かっこの中は語り手の説明で、次の文の終わりのかっこまで続きます。curtsey は、女性がひざを軽く曲げてするおじぎです。as she spoke は「話しながら」。',
      'fancy curtseying as you’re falling through the air!': 'Fancy doing! で「〜するなんて（想像してごらん）！」と驚きを表します。ここで語り手が読者に直接話しかけています。you’re は you are の短縮形です。',
    },
  }),
  // 30
  ls('[V Do] [S you] [V think] [O {that省略| [S you] [V could manage] [O it]}]?)', {
    ja: 'あなたなら、うまくできると思いますか？）',
    chunks: [
      ['Do you think you could manage it?)', 'あなたにできると思いますか）'],
    ],
    notes: {
      'Do you think you could manage it?)': 'manage は「うまくやってのける」。could は「（もしやるとしたら）できるだろう」という控えめな推量です。語り手が読者に問いかけています。',
    },
  }),
  // 31
  ls('“[接 And] [C what an ignorant little girl] [S she][V ’ll think] [O me] [M {前| for {動名詞| [V asking]}}]!', {
    ja: '「それに、そんなことを聞いたら、その女の人に、なんて物知らずな女の子だろうと思われちゃう！',
    chunks: [
      ['“And what an ignorant little girl she’ll think me for asking!', '「それに、そんなことを聞いたら、なんて物知らずな女の子だと思われるでしょう！'],
    ],
    notes: {
      '“And what an ignorant little girl she’ll think me for asking!': 'what＋a＋形容詞＋名詞で始まる感嘆文。もとは She’ll think me an ignorant little girl.（think A B で「A を B だと思う」）です。for asking は「たずねたことで」と理由を表します。she は、アリスが話しかけるつもりの、向こう側の国の女の人です。',
    },
  }),
  // 32
  ls('[独 No], [仮S it][V ’ll never do] [真S {to:名詞| [V to ask]}]: [M perhaps] [S I] [V shall see] [O it] [C {過去分詞:補語| [V written up] [M somewhere]}].”', {
    ja: 'だめだめ、聞いたりしちゃいけないわ。たぶん、どこかに書いてあるのが見つかるでしょう」',
    chunks: [
      ['No, it’ll never do to ask:', 'だめだめ、聞くなんてとんでもない'],
      ['perhaps I shall see it written up somewhere.”', 'たぶん、どこかに書いてあるのが見つかるわ」'],
    ],
    marks: [
      [':', 'コロンで、「聞いてはいけない」と決めたあとに、その代わりにどうするか（どこかに書いてあるのを見ればいい）を続けます。'],
    ],
    notes: {
      'No, it’ll never do to ask:': 'it will never do to do で「〜するのはまったくいけない」。it は形式主語で、中身は to ask です。',
      'perhaps I shall see it written up somewhere.”': 'see A done で「A が〜されているのを見る」。write up は「（看板などに）書いて掲げる」。it は国の名前を指します。',
    },
  }),
  // 33
  ls('[M Down], [M down], [M down].', {
    p: true,
    fragment: true,
    ja: '下へ、下へ、下へ。',
    chunks: [
      ['Down, down, down.', '下へ、下へ、下へ'],
    ],
    notes: {
      'Down, down, down.': 'また down（下へ）をくり返す、動詞のない文です。落下がまだまだ続いていることを表します。',
    },
  }),
  // 34
  ls('[M There] [V was] [S nothing else {to:形容詞>nothing else| [V to do]}], [接 so] [S Alice] [M soon] [V began] [O {動名詞| [V talking]}] [M again].', {
    ja: 'ほかにすることもないので、アリスはすぐにまたしゃべりはじめた。',
    chunks: [
      ['There was nothing else to do,', 'ほかにすることが何もなかった'],
      ['so Alice soon began talking again.', 'それで、アリスはすぐにまたしゃべりはじめた'],
    ],
    notes: {
      'There was nothing else to do,': 'nothing else は「ほかに何も（ない）」。to do が nothing else を後ろから説明します。',
      'so Alice soon began talking again.': 'begin doing で「〜しはじめる」。so は「それで・だから」と結果を続ける接続詞です。',
    },
  }),
  // 35
  ls('“[S Dinah][V ’ll miss] [O me] [M very much] [M to-night], [M {挿入| I should think}]!”', {
    ja: '「今夜は、ダイナがわたしがいなくて、とてもさびしがるでしょうね！」',
    chunks: [
      ['“Dinah’ll miss me very much to-night, I should think!”', '「今夜は、ダイナがわたしがいなくてとてもさびしがるでしょうね」'],
    ],
    notes: {
      '“Dinah’ll miss me very much to-night, I should think!”': 'Dinah’ll は Dinah will の短縮形。miss A は「A がいなくてさびしく思う」。to-night は tonight の古いつづり。I should think は「〜だと思うわ」と控えめに言い添える挿入です。',
    },
  }),
  // 36
  ls('([S Dinah] [V was] [C the cat].)', {
    ja: '（ダイナというのは、アリスの家の猫のことだ。）',
    chunks: [
      ['(Dinah was the cat.)', '（ダイナというのは、猫のことだ）'],
    ],
    notes: {
      '(Dinah was the cat.)': '語り手がかっこの中で、ダイナが誰なのかを説明しています。the cat は「（うちの）その猫」。',
    },
  }),
  // 37
  ls('“[S I] [V hope] [O {that省略| [S they][V ’ll remember] [O her saucer {前| of milk}] [M {前| at tea-time}]}].', {
    ja: '「お茶の時間に、家のみんなが、ダイナのミルクのお皿を忘れずに出してくれるといいけど。',
    chunks: [
      ['“I hope they’ll remember her saucer of milk at tea-time.', '「お茶の時間に、みんながダイナのミルクの小皿を忘れないといいけど'],
    ],
    notes: {
      '“I hope they’ll remember her saucer of milk at tea-time.': 'hope のあとに that が省かれています。they は家の人たち。saucer は受け皿・小皿。tea-time は午後のお茶の時間です。',
    },
  }),
  // 38
  ls('[独 Dinah] [独 my dear]!', {
    fragment: true,
    ja: 'ねえ、ダイナ！',
    chunks: [
      ['Dinah my dear!', 'ダイナ、かわいい子！'],
    ],
    notes: {
      'Dinah my dear!': '動詞のない呼びかけの文です。my dear は「かわいい子・ねえ」と親しみをこめた呼びかけです。',
    },
  }),
  // 39
  ls('[S I] [V wish] [O {that省略| [S you] [V were] [M down here] [M {前| with me}]}]!', {
    ja: 'あなたがここに、いっしょにいてくれたらいいのに！',
    chunks: [
      ['I wish you were down here with me!', 'あなたがここで、わたしといっしょにいてくれたらいいのに'],
    ],
    notes: {
      'I wish you were down here with me!': 'I wish＋過去形で「〜ならいいのに」と、今の事実と違うことを願う言い方（仮定法過去）です。be動詞は主語に関係なく were を使うのがふつうです。',
    },
  }),
  // 40
  ls('[M There] [V are] [S no mice] [M {前| in the air}], [M {挿入| I’m afraid}], [接 but] [S you] [V might catch] [O a bat], [接 and] [S that][V ’s] [C very {前| like a mouse}], [M {挿入| you know}].', {
    ja: '空中にはネズミはいないみたい。残念だけど。でも、コウモリなら捕まえられるかもしれないわ。コウモリって、ネズミにとてもよく似ているのよ。',
    chunks: [
      ['There are no mice in the air,', '空中にはネズミはいないわね'],
      ['I’m afraid, but you might catch a bat,', '残念だけど。でも、コウモリなら捕まえられるかも'],
      ['and that’s very like a mouse, you know.', 'それって、ネズミにとてもよく似てるでしょ'],
    ],
    notes: {
      'There are no mice in the air,': 'mice は mouse（ネズミ）の複数形です。',
      'I’m afraid, but you might catch a bat,': 'I’m afraid は「残念だけど」と言い添える挿入です。might は「〜かもしれない」。',
      'and that’s very like a mouse, you know.': 'like は前置詞で「〜に似ている」。that は a bat（コウモリ）を指します。',
    },
  }),
  // 41
  ls('[接 But] [V do] [S cats] [V eat] [O bats], [M {挿入| I wonder}]?”', {
    ja: 'でも、猫ってコウモリを食べるのかしら」',
    chunks: [
      ['But do cats eat bats, I wonder?”', 'でも、猫ってコウモリを食べるのかしら」'],
    ],
    notes: {
      'But do cats eat bats, I wonder?”': '…, I wonder? は「…かしら」と、疑問文のあとに付けて自分に問いかける言い方です。',
    },
  }),
  // 42
  ls('[接 And] [M here] [S Alice] [V began] [O {to:名詞| [V to get] [C rather sleepy]}], [接 and] [V went on] [O {動名詞| [V saying] [M {前| to herself}], [M {前| in a dreamy sort {前| of way}}], [O {引用| “[V Do] [S cats] [V eat] [O bats]? [V Do] [S cats] [V eat] [O bats]?”}] [接 and] [M sometimes], [O {引用| “[V Do] [S bats] [V eat] [O cats]?”}]}] [接 for], [M {挿入| you see}], [M {副詞節:理由| [接 as] [S she] [V couldn’t answer] [O either question]}], [仮S it] [V didn’t] [M much] [V matter] [真S {疑問詞節| [M which way] [S she] [V put] [O it]}].', {
    ja: 'このあたりで、アリスはだんだん眠くなってきて、夢うつつのような調子で「猫はコウモリを食べるかしら？猫はコウモリを食べるかしら？」とひとりごとを言いつづけた。ときどき「コウモリは猫を食べるかしら？」になったりもした。どちらの問いにも答えられないのだから、どちら向きに言おうと、たいした違いはなかったのだ。',
    chunks: [
      ['And here Alice began to get rather sleepy,', 'そしてここで、アリスはだんだん眠くなってきて'],
      ['and went on saying to herself, in a dreamy sort of way,', '夢でも見ているような調子で、ひとりごとを言いつづけた'],
      ['“Do cats eat bats? Do cats eat bats?”', '「猫はコウモリを食べるかしら？猫はコウモリを食べるかしら？」'],
      ['and sometimes, “Do bats eat cats?”', 'そしてときどき「コウモリは猫を食べるかしら？」と'],
      ['for, you see, as she couldn’t answer either question,', 'というのも、ほら、どちらの問いにも答えられないのだから'],
      ['it didn’t much matter which way she put it.', 'どちら向きに言っても、たいした違いはなかったのだ'],
    ],
    notes: {
      'And here Alice began to get rather sleepy,': 'get sleepy で「眠くなる」。rather は「かなり・だいぶ」。',
      'and went on saying to herself, in a dreamy sort of way,': 'go on doing で「〜しつづける」。in a … way は「〜なふうに」で、a dreamy sort of way は「夢を見ているような調子」。',
      'and sometimes, “Do bats eat cats?”': 'cats と bats を入れかえた言いまちがいです。眠くて、どちらを言っているのか分からなくなっています。',
      'for, you see, as she couldn’t answer either question,': 'for は「というのも」。as は理由で「〜なので」。either question は「どちらの問いも」で、not と組んで「どちらにも答えられない」。',
      'it didn’t much matter which way she put it.': 'it は形式主語で、中身は which way she put it（どちら向きに言うか）。matter は動詞で「重要である」。put はここでは「言い表す」。',
    },
  }),
  // 43
  ls('[S She] [V felt] [O {that節| [接 that] [S she] [V was dozing off]}], [接 and] [V had] [M just] [V begun] [O {to:名詞| [V to dream] [O {that節| [接 that] [S she] [V was walking] [M {成句| hand in hand}] [M {前| with Dinah}], [接 and] [V saying] [M {前| to her}] [M very earnestly], [O {引用| “[独 Now], [独 Dinah], [V tell] [O1 me] [O2 the truth]: [V did] [S you] [M ever] [V eat] [O a bat]?”}]}]}] [M {関係,>前の内容| [M when] [M suddenly], [独 thump]! [独 thump]! [M down] [S she] [V came] [M {前| upon a heap {前| of {並列| sticks | and dry leaves}}}], [接 and] [S the fall] [V was] [C over]}].', {
    ja: 'アリスは、自分がうとうとしかけているのを感じた。そして、ダイナと手をつないで歩きながら、とても真剣に「ねえ、ダイナ、本当のことを言ってちょうだい。コウモリを食べたことある？」と話しかけている夢を、ちょうど見はじめたところだった。そのとき突然、ドスン！ドスン！と、アリスは小枝と枯れ葉の山の上に落ち、落下は終わった。',
    chunks: [
      ['She felt that she was dozing off,', '彼女は、自分がうとうとしかけているのを感じた'],
      ['and had just begun to dream', 'そして、ちょうど夢を見はじめたところだった'],
      ['that she was walking hand in hand with Dinah,', 'ダイナと手をつないで歩いていて'],
      ['and saying to her very earnestly,', 'とても真剣にダイナにこう言っている（夢を）'],
      ['“Now, Dinah, tell me the truth:', '「ねえ、ダイナ、本当のことを言って'],
      ['did you ever eat a bat?”', 'コウモリを食べたことある？」'],
      ['when suddenly, thump! thump!', 'すると突然、ドスン！ドスン！'],
      ['down she came upon a heap of sticks and dry leaves,', '彼女は小枝や枯れ葉の山の上に落ちた'],
      ['and the fall was over.', 'そして、落下は終わった'],
    ],
    marks: [
      [':', 'コロンで、「本当のことを言って」と前置きしてから、その本当のことをたずねる質問（コウモリを食べたことある？）を続けます。'],
    ],
    notes: {
      'She felt that she was dozing off,': 'doze off は「うとうとする・居眠りする」。',
      'and had just begun to dream': 'had just begun は過去完了で「ちょうど〜しはじめたところだった」。',
      'that she was walking hand in hand with Dinah,': 'hand in hand は「手に手をとって」。猫と手をつないで歩く、夢らしい場面です。',
      'and saying to her very earnestly,': 'was walking と saying が並んでいて、was saying（言っていた）ということです。earnestly は「真剣に」。',
      'did you ever eat a bat?”': 'Did you ever …? で「今までに〜したことがある？」。',
      'when suddenly, thump! thump!': 'コンマのあとの when は「すると、そのとき」と話を先へ進めます。thump は「ドスン」という重い物が落ちる音です。',
      'down she came upon a heap of sticks and dry leaves,': 'down she came は down を前に出した倒置で、勢いを表します。come down upon A で「A の上に落ちる」。heap は「山・積み重なり」。',
      'and the fall was over.': 'be over で「終わる」。fall は名詞で「落下」。',
    },
  }),
  // 44
  ls('[S Alice] [V was not] [M a bit] [C hurt], [接 and] [S she] [V jumped up] [M {前| on to her feet}] [M {前| in a moment}]: [S she] [V looked up], [接 but] [S it] [V was] [M all] [C dark] [M overhead]; [M {前| before her}] [V was] [S another long passage], [接 and] [S the White Rabbit] [V was] [M still] [C {前| in sight}], [M {分詞構文:付帯状況| [V hurrying] [M {前| down it}]}].', {
    p: true,
    ja: 'アリスは少しもけがをしていなかったので、すぐにぴょんと立ち上がった。上を見上げてみたけれど、頭の上は真っ暗だった。目の前には、また長い通路が続いていて、白ウサギがまだ見えていた。その通路を急いで走っていくところだった。',
    chunks: [
      ['Alice was not a bit hurt,', 'アリスは少しもけがをしていなかった'],
      ['and she jumped up on to her feet in a moment:', 'そしてすぐにぴょんと立ち上がった'],
      ['she looked up, but it was all dark overhead;', '上を見上げたが、頭の上は真っ暗だった'],
      ['before her was another long passage,', '目の前には、また長い通路があって'],
      ['and the White Rabbit was still in sight,', '白ウサギがまだ見えていた'],
      ['hurrying down it.', 'その通路を急いで進んでいく（のが）'],
    ],
    marks: [
      [':', 'コロンで、立ち上がったあとに、まわりを見てどうだったか（上は真っ暗、前には通路）を続けます。'],
      [';', 'セミコロンで、「上を見たら真っ暗だった」ことと、「前には通路があった」ことを区切って並べます。'],
    ],
    notes: {
      'Alice was not a bit hurt,': 'not a bit で「少しも〜ない」。hurt は「けがをした」という形容詞のはたらきです。',
      'and she jumped up on to her feet in a moment:': 'on to は onto と同じで「〜の上へ」。jump up on to one’s feet で「ぱっと立ち上がる」。in a moment は「すぐに」。',
      'she looked up, but it was all dark overhead;': 'overhead は「頭上に」。it は明暗を表す主語で、訳しません。',
      'before her was another long passage,': 'before her（彼女の前に）を文の頭に出し、動詞 was が主語 another long passage の前に来た倒置の形です。',
      'and the White Rabbit was still in sight,': 'in sight で「見えるところに」。',
      'hurrying down it.': '分詞構文で「急いでそこを進みながら」。it は passage（通路）を指します。',
    },
  }),
  // 45
  ls('[M There] [V was not] [S a moment {to:形容詞>a moment| [V to be lost]}]: [M away] [V went] [S Alice] [M {前| like the wind}], [接 and] [V was] [M just] [C {前| in time}] [M {to:副詞(結果)| [V to hear] [O it] [C {原形| [V say], [M {副詞節:時| [接 as] [S it] [V turned] [O a corner]}], [O {引用| “[独 Oh my {並列| ears | and whiskers}], [C how late] [S it][V ’s getting]!”}]}]}]', {
    ja: 'ぐずぐずしている暇はなかった。アリスは風のように駆けだして、ちょうど、ウサギが角を曲がりながら「ああ、わたしの耳とひげにかけて、ずいぶん遅くなってしまった！」と言うのを聞くことができた。',
    chunks: [
      ['There was not a moment to be lost:', 'ぐずぐずしている暇は一瞬もなかった'],
      ['away went Alice like the wind,', 'アリスは風のように駆けだし'],
      ['and was just in time to hear it say,', 'ちょうど間に合って、ウサギがこう言うのが聞こえた'],
      ['as it turned a corner,', '角を曲がりながら'],
      ['“Oh my ears and whiskers, how late it’s getting!”', '「ああ、わたしの耳とひげにかけて、ずいぶん遅くなってしまった！」'],
    ],
    marks: [
      [':', 'コロンで、「一瞬もむだにできない」と言ったあとに、だからアリスがどうしたか（風のように駆けだした）を続けます。'],
    ],
    notes: {
      'There was not a moment to be lost:': 'to be lost が a moment を後ろから説明し、「失われてよい一瞬」。not a moment to be lost で「一刻の猶予もない」。',
      'away went Alice like the wind,': 'away（向こうへ）を文の頭に出した倒置で、勢いよく駆けだす様子を表します。like the wind は「風のように（速く）」。',
      'and was just in time to hear it say,': 'be in time で「間に合う」。hear A do で「A が〜するのを聞く」。it はウサギを指します。',
      'as it turned a corner,': 'turn a corner で「角を曲がる」。',
      '“Oh my ears and whiskers, how late it’s getting!”': 'Oh my ears and whiskers! は、ウサギらしい「ああ、たいへん！」という声です。how late it’s getting は How＋形容詞の感嘆文で「なんと遅くなっていくことか」。it’s は it is の短縮形です。',
    },
  }),
  // 46
  ls('[S She] [V was] [M close {前| behind it}] [M {副詞節:時| [接 when] [S she] [V turned] [O the corner]}], [接 but] [S the Rabbit] [V was] [M no longer] [V to be seen]: [S she] [V found] [O herself] [C {前| in a long, low hall, {関係,>a long, low hall| [S which] [V was lit up] [M {前| by a row {前| of lamps {現在分詞>lamps| [V hanging] [M {前| from the roof}]}}}]}}].', {
    ja: '角を曲がったとき、アリスはウサギのすぐ後ろにいたのに、ウサギの姿はもう見えなかった。気がつくと、アリスは細長くて天井の低い広間にいた。広間は、天井からつり下がった一列のランプで照らされていた。',
    chunks: [
      ['She was close behind it when she turned the corner,', '角を曲がったとき、アリスはウサギのすぐ後ろにいた'],
      ['but the Rabbit was no longer to be seen:', 'けれど、ウサギの姿はもう見えなかった'],
      ['she found herself in a long, low hall,', '気がつくと、細長くて天井の低い広間にいた'],
      ['which was lit up by a row of lamps', 'その広間は、一列に並んだランプで照らされていた'],
      ['hanging from the roof.', '天井からつり下がった（ランプで）'],
    ],
    marks: [
      [':', 'コロンで、ウサギが見えなくなったあと、アリスが気づくとどこにいたか（細長い広間）を続けます。'],
    ],
    notes: {
      'She was close behind it when she turned the corner,': 'close behind A で「A のすぐ後ろに」。close は「すぐ近くに」という副詞です。',
      'but the Rabbit was no longer to be seen:': 'no longer は「もはや〜ない」。be to be seen で「見られる・見える」（be to 不定詞の「可能」の意味）。',
      'she found herself in a long, low hall,': 'find oneself in A で「気がつくと A にいる」。low は「天井が低い」。',
      'which was lit up by a row of lamps': 'コンマのあとの which は、a long, low hall に情報を付け足します。light up は「照らす」で、lit はその過去分詞。a row of A は「一列の A」。',
      'hanging from the roof.': 'hanging … が lamps を後ろから説明し、「天井からつり下がっている（ランプ）」。',
    },
  }),
  // 47
  ls('[M There] [V were] [S doors] [M all {前| round the hall}], [接 but] [S they] [V were] [M all] [C locked]; [接 and] [M {副詞節:時| [接 when] [S Alice] [V had been] [M all the way] [M {並列| {前| down one side} | and {前| up the other}}], [M {分詞構文:付帯状況| [V trying] [O every door]}]}], [S she] [V walked] [M sadly] [M {前| down the middle}], [M {分詞構文:付帯状況| [V wondering] [O {疑問詞節| [M how] [S she] [V was] [M ever] [V to get out] [M again]}]}].', {
    p: true,
    ja: '広間のまわりにはぐるりとドアが並んでいたけれど、どれも鍵がかかっていた。アリスは片側をずっと端まで行き、もう片側を戻ってきて、ドアを一つ残らず試してみたあと、いったいどうやったらまた外に出られるのだろうと思いながら、しょんぼりと広間の真ん中を歩いた。',
    chunks: [
      ['There were doors all round the hall,', '広間のまわりにはぐるりとドアがあった'],
      ['but they were all locked;', 'けれど、どれも鍵がかかっていた'],
      ['and when Alice had been all the way down one side', 'アリスは、片側をずっと端まで行き'],
      ['and up the other, trying every door,', 'もう片側を戻ってきて、どのドアも開けてみたあと'],
      ['she walked sadly down the middle,', 'しょんぼりと広間の真ん中を歩いた'],
      ['wondering how she was ever to get out again.', 'いったいどうやったらまた外に出られるのだろうと思いながら'],
    ],
    marks: [
      [';', 'セミコロンで、「ドアはみな鍵がかかっていた」ことと、そのあとアリスがしたこと（全部のドアを試して、しょんぼり歩いた）を区切ってつなぎます。'],
    ],
    notes: {
      'There were doors all round the hall,': 'round は around と同じ前置詞で「〜のまわりに」。all は「ぐるりと・すっかり」と強めます。',
      'and when Alice had been all the way down one side': 'had been は過去完了で、「（片側を）ずっと行ってきた」。all the way は「ずっと・はるばる」。',
      'and up the other, trying every door,': 'the other は the other side（もう一方の側）のことです。trying every door は分詞構文で「どのドアも試しながら」。',
      'wondering how she was ever to get out again.': 'be to do は「〜できる」（可能）。ever は疑問詞 how を強めて「いったい」。',
    },
  }),
  // 48
  ls('[M Suddenly] [S she] [V came upon] [O a little three-legged table, {過去分詞>a little three-legged table| [M all] [V made] [M {前| of solid glass}]}]; [M there] [V was] [S nothing] [M {前| on it}] [M {前| except a tiny golden key}], [接 and] [S Alice’s first thought] [V was] [C {that節| [接 that] [S it] [V might belong] [M {前| to one {前| of the doors {前| of the hall}}}]}]; [接 but], [独 alas]! [接 either] [S the locks] [V were] [C too large], [接 or] [S the key] [V was] [C too small], [接 but] [M {前| at any rate}] [S it] [V would not open] [O any {前| of them}].', {
    p: true,
    ja: '突然、アリスは、すっかり分厚いガラスでできた、小さな三本脚のテーブルに行きあたった。その上には、小さな金の鍵のほかには何もなかった。アリスがまず思ったのは、これは広間のドアのどれかの鍵かもしれない、ということだった。ところが、ああ、錠前が大きすぎるのか、鍵が小さすぎるのか、とにかく、どのドアも開けられなかった。',
    chunks: [
      ['Suddenly she came upon a little three-legged table,', '突然、アリスは小さな三本脚のテーブルに行きあたった'],
      ['all made of solid glass;', 'すっかり分厚いガラスでできた（テーブルに）'],
      ['there was nothing on it except a tiny golden key,', 'その上には、小さな金の鍵のほかは何もなかった'],
      ['and Alice’s first thought was', 'アリスがまず思ったのは'],
      ['that it might belong to one of the doors of the hall;', 'それが広間のドアのどれかのものかもしれない、ということだった'],
      ['but, alas! either the locks were too large,', 'ところが、ああ！錠前が大きすぎるのか'],
      ['or the key was too small,', 'それとも鍵が小さすぎるのか'],
      ['but at any rate it would not open any of them.', 'とにかく、鍵はどのドアも開けられなかった'],
    ],
    marks: [
      [';', 'セミコロンで、「ガラスのテーブルに行きあたった」ことに、「その上に金の鍵があった」ことを続けます。'],
      [';', 'セミコロンで、「ドアの鍵かもしれない」という期待と、but, alas!（ところが、ああ）で始まる「どのドアも開かなかった」という結果を区切ります。'],
    ],
    notes: {
      'Suddenly she came upon a little three-legged table,': 'come upon A で「A にふと出くわす・見つける」。three-legged は「三本脚の」。',
      'all made of solid glass;': 'made of A で「A でできた」で、table を後ろから説明します。solid は「中まで詰まった・分厚い」。',
      'there was nothing on it except a tiny golden key,': 'except A で「A を除いて」。golden は「金の・金色の」。',
      'and Alice’s first thought was': 'Alice’s first thought は「アリスの最初の考え」。was のあとの that節が、その中身（補語）です。',
      'that it might belong to one of the doors of the hall;': 'belong to A で「A のものである」。',
      'but, alas! either the locks were too large,': 'alas は「ああ（悲しいかな）」という嘆きの声です。either A or B で「A か B か」。',
      'but at any rate it would not open any of them.': 'at any rate で「とにかく・いずれにしても」。would not は「どうしても〜しなかった」。them はドアを指します。',
    },
  }),
  // 49
  ls('[M However], [M {前| on the second time round}], [S she] [V came upon] [O a low curtain {関係省略:目的格>a low curtain| [S she] [V had not noticed] [M before]}], [接 and] [M {前| behind it}] [V was] [S a little door {形容詞>a little door| about fifteen inches high}]: [S she] [V tried] [O the little golden key] [M {前| in the lock}], [接 and] [M {前| to her great delight}] [S it] [V fitted]!', {
    ja: 'けれど、二度目に広間を回ったとき、前には気づかなかった低いカーテンが見つかった。その後ろに、高さ十五インチ（約三十八センチ）ほどの小さなドアがあった。小さな金の鍵を錠に差してみると、うれしいことに、ぴったり合った！',
    chunks: [
      ['However, on the second time round,', 'けれど、二度目に回ったとき'],
      ['she came upon a low curtain she had not noticed before,', '前には気づかなかった低いカーテンが見つかり'],
      ['and behind it was a little door about fifteen inches high:', 'その後ろに、高さ十五インチほどの小さなドアがあった'],
      ['she tried the little golden key in the lock,', '小さな金の鍵を錠に差してみると'],
      ['and to her great delight it fitted!', 'うれしいことに、ぴったり合った！'],
    ],
    marks: [
      [':', 'コロンで、小さなドアを見つけたあと、アリスがすぐにしたこと（金の鍵を錠に差してみた）を続けます。'],
    ],
    notes: {
      'However, on the second time round,': 'the second time round で「二回りめに」。',
      'she came upon a low curtain she had not noticed before,': 'a low curtain と she の間に、目的格の関係代名詞が省かれています。「前には気づかなかった低いカーテン」。',
      'and behind it was a little door about fifteen inches high:': 'behind it を文の頭に出し、was が主語 a little door の前に来た倒置の形です。about fifteen inches high は a little door を後ろから説明し、「高さ約十五インチの」。1インチは約2.5センチメートルです。',
      'she tried the little golden key in the lock,': 'try A in B で「A を B に（合うか）試してみる」。',
      'and to her great delight it fitted!': 'to one’s delight で「うれしいことに」。fit は「（大きさが）ぴったり合う」。',
    },
  }),
  // 50
  ls('[S Alice] [V opened] [O the door] [接 and] [V found] [O {that節| [接 that] [S it] [V led] [M {前| into a small passage, {形容詞>a small passage| not much larger {前| than a rat-hole}}}]}]: [S she] [V knelt down] [接 and] [V looked] [M {前| along the passage}] [M {前| into the loveliest garden {関係省略:目的格>the loveliest garden| [S you] [M ever] [V saw]}}].', {
    p: true,
    ja: 'アリスがドアを開けてみると、その先は、ネズミの穴とたいして変わらない大きさの、小さな通路に続いていた。ひざをついて通路の奥をのぞくと、見たこともないほどすてきな庭が見えた。',
    chunks: [
      ['Alice opened the door and found', 'アリスがドアを開けてみると、分かった'],
      ['that it led into a small passage,', 'ドアの先は小さな通路に続いていて'],
      ['not much larger than a rat-hole:', 'ネズミの穴とたいして変わらない大きさだった'],
      ['she knelt down and looked along the passage', '彼女はひざをついて、通路の奥をのぞいた'],
      ['into the loveliest garden you ever saw.', '見たこともないほどすてきな庭を'],
    ],
    marks: [
      [':', 'コロンで、通路がどんなものか分かったあと、アリスがしたこと（ひざをついてのぞいた）と、そこに見えたもの（すてきな庭）を続けます。'],
    ],
    notes: {
      'Alice opened the door and found': 'opened と found が、主語 Alice を共通にして並んでいます。',
      'that it led into a small passage,': 'lead into A で「（道などが）A へ通じる」。led は lead の過去形です。',
      'not much larger than a rat-hole:': 'a small passage を後ろから説明し、「ネズミの穴よりたいして大きくない」。',
      'she knelt down and looked along the passage': 'knelt は kneel（ひざをつく）の過去形。look along A で「A に沿って（奥を）見る」。',
      'into the loveliest garden you ever saw.': 'the loveliest garden と you の間に関係代名詞が省かれています。「あなたがこれまで見た中でいちばんすてきな庭」で、語り手が読者に話しかける言い方です。',
    },
  }),
  // 51
  ls('[M How] [S she] [V longed] [O {to:名詞| [V to get] [M {前| out of that dark hall}], [接 and] [V wander] [M about] [M {前| among {並列| those beds {前| of bright flowers} | and those cool fountains}}]}], [接 but] [S she] [V could not] [M even] [V get] [O her head] [M {前| through the doorway}]; [O {引用| “[接 and] [M {副詞節:譲歩| [接 even if] [S my head] [V would go] [M through]}],”}] [V thought] [S poor Alice], [O {引用| “[S it] [V would be] [C {前| of very little use}] [M {前| without my shoulders}].}]', {
    ja: 'あの暗い広間から出て、色あざやかな花壇や涼しげな噴水の間を歩き回れたら、どんなにいいだろう。でも、アリスは戸口から頭を通すことさえできなかった。「それに、もし頭が通ったとしても」とかわいそうなアリスは思った。「肩が通らなければ、ほとんど何の役にも立たないわ。',
    chunks: [
      ['How she longed to get out of that dark hall,', 'どんなにあの暗い広間から出たかったことか'],
      ['and wander about among those beds of bright flowers', 'そして、あの色あざやかな花壇の間や'],
      ['and those cool fountains,', 'あの涼しげな噴水の間を歩き回りたかったことか'],
      ['but she could not even get her head through the doorway;', 'でも、戸口から頭を通すことさえできなかった'],
      ['“and even if my head would go through,”', '「それに、もし頭が通ったとしても」'],
      ['thought poor Alice,', 'とかわいそうなアリスは思った'],
      ['“it would be of very little use without my shoulders.', '「肩が通らなければ、ほとんど役に立たないわ'],
    ],
    marks: [
      [';', 'セミコロンで、「頭さえ通らなかった」という語りと、それに続くアリスの心の声（たとえ頭が通っても…）を区切ってつなぎます。'],
    ],
    notes: {
      'How she longed to get out of that dark hall,': 'How で始まる感嘆の文で「どんなに〜したかったことか」。long to do で「〜したくてたまらない」。',
      'and wander about among those beds of bright flowers': 'to get out と (to) wander が並んでいます。wander about は「歩き回る」。bed はここでは「花壇」です。',
      'but she could not even get her head through the doorway;': 'get A through B で「A を B に通す」。even は「〜さえ」。doorway は戸口です。',
      '“and even if my head would go through,”': 'even if は「たとえ〜としても」。would go through は「（頭が）通ってくれたとしても」。',
      '“it would be of very little use without my shoulders.': 'of use で「役に立つ」（of＋名詞で形容詞のはたらき）。of very little use で「ほとんど役に立たない」。without my shoulders は「肩が（通ら）なければ」。',
    },
  }),
  // 52
  ls('[独 Oh], [M how] [S I] [V wish] [O {that省略| [S I] [V could shut up] [M {前| like a telescope}]}]!', {
    ja: 'ああ、望遠鏡みたいに体をたためたら、どんなにいいでしょう！',
    chunks: [
      ['Oh, how I wish I could shut up like a telescope!', 'ああ、望遠鏡みたいに縮めたら、どんなにいいかしら！'],
    ],
    notes: {
      'Oh, how I wish I could shut up like a telescope!': 'how I wish … で「…だったらどんなにいいか」。I wish＋could で、できないことを願う言い方（仮定法）です。shut up はここでは「（望遠鏡の筒のように）たたんで縮む」。',
    },
  }),
  // 53
  ls('[S I] [V think] [O {that省略| [S I] [V could], [M {副詞節:条件| [接 if] [S I] [M only] [V knew] [O {疑問詞to| [M how] [V to begin]}]}]}].”', {
    ja: 'どうやってはじめればいいかさえ分かれば、できると思うんだけど」',
    chunks: [
      ['I think I could, if I only knew how to begin.”', 'はじめ方さえ分かれば、できると思うんだけど」'],
    ],
    notes: {
      'I think I could, if I only knew how to begin.”': 'I could のあとに shut up like a telescope が省かれています。if I only knew … は「…さえ分かっていれば」（仮定法過去）。how to begin は「どうやってはじめるか」。',
    },
  }),
  // 54
  ls('[接 For], [M {挿入| you see}], [S so many out-of-the-way things] [V had happened] [M lately], [M {副詞節:結果| [接 that] [S Alice] [V had begun] [O {to:名詞| [V to think] [O {that節| [接 that] [S very few things] [M indeed] [V were] [M really] [C impossible]}]}]}].', {
    ja: 'というのも、近ごろあまりにもたくさん変わったことが起こったので、アリスは、本当にできないことなんてほとんどないのだと思いはじめていたのだ。',
    chunks: [
      ['For, you see, so many out-of-the-way things', 'というのも、ほら、あまりにたくさんの変わったことが'],
      ['had happened lately,', '近ごろ起こったので'],
      ['that Alice had begun to think', 'アリスは思いはじめていたのだ'],
      ['that very few things indeed were really impossible.', '本当にできないことなんて、ほとんどないのだと'],
    ],
    notes: {
      'For, you see, so many out-of-the-way things': 'For は「というのも」と前の内容の理由を示します。so many … that ～ で「とても多くの…なので～」。out-of-the-way は「風変わりな・ふつうでない」。',
      'had happened lately,': 'lately は「近ごろ」。had happened は過去完了で、そのときまでに起こっていたことを表します。',
      'that very few things indeed were really impossible.': 'very few … で「ほとんど〜ない」。indeed は very few を強めます。',
    },
  }),
  // 55（コロンで区切られた1文を、2つに分けた1つ目）
  ls('[M There] [V seemed to be] [S no use {前| in {動名詞| [V waiting] [M {前| by the little door}]}}], [接 so] [S she] [V went back] [M {前| to the table}], [M {分詞構文:付帯状況| [M half] [V hoping] [O {that省略| [S she] [V might find] [O another key] [M {前| on it}], [接 or] [M {前| at any rate}] [O a book {前| of rules {前| for {動名詞| [V shutting] [O people] [M up] [M {前| like telescopes}]}}}]}]}]:', {
    p: true,
    part: true,
    ja: '小さなドアのそばで待っていても、しかたがなさそうだった。そこでアリスは、テーブルの上にもう一つ鍵があるかもしれない、でなければ、せめて人を望遠鏡のようにたたむやり方の書いてある本でもないかしらと、半分期待しながら、テーブルのところへ戻った。',
    chunks: [
      ['There seemed to be no use in waiting by the little door,', '小さなドアのそばで待っていても、しかたがなさそうだった'],
      ['so she went back to the table,', 'それで、彼女はテーブルのところへ戻った'],
      ['half hoping she might find another key on it,', 'その上にもう一つ鍵が見つかるかもしれないと、半分期待しながら'],
      ['or at any rate a book of rules', 'でなければ、せめて決まりの書いてある本が（見つかるかもと）'],
      ['for shutting people up like telescopes:', '人を望遠鏡のようにたたむための'],
    ],
    marks: [
      [':', 'コロンで、「何か見つかるかもと期待してテーブルに戻った」ことを受けて、実際に何が見つかったか（小さなびん）を次の部分で続けます。'],
    ],
    notes: {
      'There seemed to be no use in waiting by the little door,': 'There is no use in doing で「〜してもむだだ」。seem to be で「〜のようだ」。',
      'half hoping she might find another key on it,': 'half hoping は分詞構文で「半分は期待しながら」。hoping のあとに that が省かれています。',
      'or at any rate a book of rules': 'find の目的語が another key と a book of rules の2つで、or で並んでいます。at any rate は「少なくとも・せめて」。',
      'for shutting people up like telescopes:': 'shut A up で「A をたたむ・縮める」。telescope は筒を重ねて縮められる、昔の望遠鏡です。',
    },
  }),
  // 56（1つの文の続き）
  ls('[M this time] [S she] [V found] [O a little bottle] [M {前| on it}], {挿入文| ([O {引用| “[S which] [M certainly] [V was not] [M here] [M before],”}] [V said] [S Alice],)} [接 and] [M {前| round the neck {前| of the bottle}}] [V was] [S a paper label], [M {前| with the words “DRINK ME,” {過去分詞>the words| [M beautifully] [V printed] [M {前| on it}] [M {前| in large letters}]}}].', {
    ja: '今度は、テーブルの上に小さなびんがあった（「さっきは、たしかにここになかったのに」とアリスは言った）。びんの首のまわりには紙のラベルが巻いてあって、「わたしをお飲み」という言葉が、大きな文字できれいに印刷されていた。',
    chunks: [
      ['this time she found a little bottle on it,', '今度は、テーブルの上に小さなびんがあった'],
      ['(“which certainly was not here before,” said Alice,)', '（「さっきは、たしかにここになかったのに」とアリスは言った）'],
      ['and round the neck of the bottle was a paper label,', 'びんの首のまわりには、紙のラベルがついていて'],
      ['with the words “DRINK ME,”', '「わたしをお飲み」という言葉が'],
      ['beautifully printed on it in large letters.', '大きな文字できれいに印刷されていた'],
    ],
    notes: {
      'this time she found a little bottle on it,': 'this time は「今度は」。it はテーブルを指します。',
      '(“which certainly was not here before,” said Alice,)': 'which は a little bottle を指し、アリスの言葉が語り手の文に続く形になっています。「それは、たしかにさっきはここになかった」。',
      'and round the neck of the bottle was a paper label,': 'round the neck of the bottle（びんの首のまわりに）を文の頭に出した倒置で、was が主語 a paper label の前に来ています。',
      'with the words “DRINK ME,”': 'with A done で「A が〜された状態で」。DRINK ME は「わたしを飲んで」という命令文です。',
      'beautifully printed on it in large letters.': 'printed は print（印刷する）の過去分詞。in large letters は「大きな文字で」。',
    },
  }),
  // 57
  ls('[仮S It] [V was] [C all very well] [真S {to:名詞| [V to say] [O “Drink me,”]}] [接 but] [S the wise little Alice] [V was not going to do] [O that] [M {前| in a hurry}].', {
    p: true,
    ja: '「わたしをお飲み」と言うのはけっこうだけれど、かしこいアリスは、あわててそんなことをするつもりはなかった。',
    chunks: [
      ['It was all very well to say “Drink me,”', '「わたしをお飲み」と言うのは、けっこうなことだけれど'],
      ['but the wise little Alice was not going', 'かしこい小さなアリスは、するつもりはなかった'],
      ['to do that in a hurry.', 'そんなことを、あわてて'],
    ],
    notes: {
      'It was all very well to say “Drink me,”': 'It is all very well to do, but … で「〜するのはけっこうだが…」と、そのあとに不満や反対を言う決まった言い方です。It は形式主語で、中身は to say “Drink me”。',
      'but the wise little Alice was not going': 'be going to do で「〜するつもりだ」。',
      'to do that in a hurry.': 'in a hurry は「急いで・あわてて」。',
    },
  }),
  // 58（セミコロンで区切られた長い1文を、3つに分けた1つ目）
  ls('[O {引用| “[独 No], [S I][V ’ll look] [M first],”}] [S she] [V said], [O {引用| “[接 and] [V see] [O {whether節| [接 whether] [S it][V ’s marked] [C ‘poison’] [M or not]}]”}];', {
    part: true,
    ja: '「だめよ、まずよく見て、『毒』って書いてあるかどうか確かめなくちゃ」とアリスは言った。',
    chunks: [
      ['“No, I’ll look first,” she said,', '「いいえ、まず見てみるわ」と彼女は言った'],
      ['“and see whether it’s marked ‘poison’ or not”;', '「そして、『毒』と書いてあるかどうか確かめるの」'],
    ],
    marks: [
      [';', 'セミコロンで、アリスの言葉と、次の for（というのも）で始まる、そう用心した理由の説明を区切ります。'],
    ],
    notes: {
      '“No, I’ll look first,” she said,': 'I’ll は I will の短縮形で、「まず見てみる」とその場で決めたことを表します。',
      '“and see whether it’s marked ‘poison’ or not”;': 'whether … or not で「…かどうか」。be marked A で「A と書かれている・A の印がある」。poison は「毒」。it’s は it is の短縮形です。',
    },
  }),
  // 59（1つの文の続き）
  ls('[接 for] [S she] [V had read] [O several nice little histories {前| about children {関係>children| [S who] [V had got] [C {並列| burnt, | and eaten up {前| by wild beasts} | and other unpleasant things}], [M all {副詞節:理由| [接 because] [S they] [V would not remember] [O the simple rules {関係省略:目的格(taught)>the simple rules| [S their friends] [V had taught] [O1 them]}: {前| such as, {並列| {that節| [接 that] [S a red-hot poker] [V will burn] [O you] [M {副詞節:条件| [接 if] [S you] [V hold] [O it] [M too long]}]}; | and {that節| [接 that] [M {副詞節:条件| [接 if] [S you] [V cut] [O your finger] [M very deeply] [M {前| with a knife}]}], [S it] [M usually] [V bleeds]}}}]}]}}];', {
    part: true,
    ja: 'というのも、アリスは、友だちが教えてくれた簡単な決まりを覚えようとしなかったばかりに、やけどをしたり、野獣に食べられたり、そのほかいろいろいやな目にあったりした子どもたちの、ちょっとした教訓のお話を、いくつも読んでいたからだ。決まりというのは、たとえば、真っ赤に焼けた火かき棒を長く持っていると、やけどをする、とか、ナイフで指をとても深く切ると、たいてい血が出る、とかいったことだ。',
    chunks: [
      ['for she had read several nice little histories about children', 'というのも、彼女は子どもたちのちょっとしたお話を、いくつも読んでいたからだ'],
      ['who had got burnt,', 'やけどをしたり'],
      ['and eaten up by wild beasts and other unpleasant things,', '野獣に食べられたり、そのほかいやな目にあったりした（子どもたちの）'],
      ['all because they would not remember the simple rules', 'それもみな、簡単な決まりを覚えようとしなかったせいで'],
      ['their friends had taught them:', '友だちが教えてくれた（決まりを）'],
      ['such as, that a red-hot poker will burn you', 'たとえば、真っ赤に焼けた火かき棒はやけどをさせる'],
      ['if you hold it too long;', '長く持ちすぎると、ということや'],
      ['and that if you cut your finger very deeply with a knife,', 'ナイフで指をとても深く切ると'],
      ['it usually bleeds;', 'たいてい血が出る、ということだ'],
    ],
    marks: [
      [':', 'コロンで、「友だちが教えてくれた簡単な決まり」の具体例（such as 以下の2つ）を続けます。'],
      [';', 'セミコロンで、決まりの例の1つ目（火かき棒）と2つ目（ナイフ）を区切って並べます。'],
      [';', 'セミコロンで、決まりの例を並べ終え、次の部分の3つ目の決まり（毒のびん）へつなぎます。'],
    ],
    notes: {
      'for she had read several nice little histories about children': 'for は「というのも」と、前の用心の理由を示します。history はここでは「物語・お話」。nice little は「ちょっとした、よくできた」という皮肉まじりの言い方です。',
      'who had got burnt,': 'who は children を説明する関係代名詞。get burnt で「やけどをする」（burnt は burn の過去分詞）。',
      'and eaten up by wild beasts and other unpleasant things,': 'had got のあとに burnt・eaten up・other unpleasant things が並んでいます。eat up は「すっかり食べてしまう」。beast は「けもの」。',
      'all because they would not remember the simple rules': 'all because … で「ただ…というだけの理由で」。would not は「どうしても〜しようとしなかった」。',
      'their friends had taught them:': 'the simple rules と their friends の間に、目的格の関係代名詞が省かれています。teach A B で「A に B を教える」。',
      'such as, that a red-hot poker will burn you': 'such as は「たとえば〜のような」。後ろの2つの that節が、決まりの具体例です。poker は暖炉の火をかき回す鉄の棒（火かき棒）。you は「（一般に）人」。',
      'and that if you cut your finger very deeply with a knife,': 'それぞれの that節の中に、if の副詞節（〜すると）が入っています。',
      'it usually bleeds;': 'bleed は「血が出る」。当たり前のことを「決まり」として大まじめに並べるおかしさがあります。',
    },
  }),
  // 60（1つの文の続き）
  ls('[接 and] [S she] [V had] [M never] [V forgotten] [O {that節| [接 that], [M {副詞節:条件| [接 if] [S you] [V drink] [O much] [M {前| from a bottle {過去分詞>a bottle| [V marked] [C “poison,”]}}]}] [S it] [V is] [C almost certain {to:副詞(形容詞)| [V to disagree] [M {前| with you}]}], [M {成句| sooner or later}]}].', {
    ja: 'それに、「毒」と書いてあるびんからたくさん飲むと、遅かれ早かれ、まずまちがいなく体をこわす、ということも、アリスは決して忘れていなかった。',
    chunks: [
      ['and she had never forgotten that,', 'そして、彼女は決して忘れていなかった'],
      ['if you drink much from a bottle marked “poison,”', '「毒」と書いてあるびんから、たくさん飲むと'],
      ['it is almost certain to disagree with you,', 'まずまちがいなく体に合わない、ということを'],
      ['sooner or later.', '遅かれ早かれ'],
    ],
    notes: {
      'and she had never forgotten that,': 'that は接続詞で、forgotten の目的語になる節を作ります。that の直後に if の節がはさまっています。',
      'if you drink much from a bottle marked “poison,”': 'marked “poison” が a bottle を後ろから説明し、「『毒』と書かれたびん」。much は「たくさん」という名詞のはたらきです。',
      'it is almost certain to disagree with you,': 'be certain to do で「きっと〜する」。disagree with A は「（食べ物などが）A の体に合わない」。「体に合わない」どころではすまないのに、ひかえめに言うおかしさがあります。',
      'sooner or later.': 'sooner or later で「遅かれ早かれ」。',
    },
  }),
  // 61
  ls('[M However], [S this bottle] [V was not marked] [C “poison,”] [接 so] [S Alice] [V ventured] [O {to:名詞| [V to taste] [O it]}], [接 and] [M {分詞構文:理由| [V finding] [O it] [C very nice]}], {挿入文| ([S it] [V had], [M {前| in fact}], [O a sort {前| of mixed flavour {前| of {並列| cherry-tart, | custard, | pine-apple, | roast turkey, | toffee, | and hot buttered toast}}}],)} [S she] [M very soon] [V finished] [O it] [M off].', {
    p: true,
    ja: 'けれども、このびんには「毒」とは書いてなかったので、アリスは思いきって味見をしてみた。するととてもおいしかったので（実際、サクランボのタルトと、カスタードと、パイナップルと、七面鳥の丸焼きと、タフィーと、バターを塗った熱いトーストをまぜたような味がした）、たちまち全部飲みほしてしまった。',
    chunks: [
      ['However, this bottle was not marked “poison,”', 'けれども、このびんには「毒」とは書いてなかった'],
      ['so Alice ventured to taste it,', 'それでアリスは思いきって味見をしてみた'],
      ['and finding it very nice,', 'すると、とてもおいしかったので'],
      ['(it had, in fact, a sort of mixed flavour', '（それは、実際、いろいろまじった味がした'],
      ['of cherry-tart, custard, pine-apple, roast turkey, toffee,', 'サクランボのタルト、カスタード、パイナップル、七面鳥の丸焼き、タフィー'],
      ['and hot buttered toast,)', 'それにバターを塗った熱いトーストの（まじった味）'],
      ['she very soon finished it off.', 'たちまち全部飲みほしてしまった'],
    ],
    notes: {
      'However, this bottle was not marked “poison,”': 'be marked A で「A と書かれている」。',
      'so Alice ventured to taste it,': 'venture to do で「思いきって〜する」。',
      'and finding it very nice,': 'finding … は分詞構文で「〜と分かったので」。find A B で「A が B だと分かる」。',
      '(it had, in fact, a sort of mixed flavour': 'かっこの中は、語り手がどんな味だったかを説明する差しこみの文です。in fact は「実際」。a sort of A で「一種の A・A のようなもの」。flavour はイギリスのつづり（アメリカでは flavor）。',
      'of cherry-tart, custard, pine-apple, roast turkey, toffee,': 'cherry-tart はサクランボのタルト、toffee はバターと砂糖を煮つめたあめ（タフィー）です。',
      'she very soon finished it off.': 'finish A off で「A をすっかり平らげる・飲みほす」。',
    },
  }),
  // 62
  ls('[O {引用| “[独 What a curious feeling]!”}] [V said] [S Alice]; [O {引用| “[S I] [V must be shutting up] [M {前| like a telescope}].”}]', {
    p: true,
    ja: '「なんてへんな感じ！」とアリスは言った。「きっと、望遠鏡みたいに縮んでいってるんだわ」',
    chunks: [
      ['“What a curious feeling!” said Alice;', '「なんておかしな感じ！」とアリスは言った'],
      ['“I must be shutting up like a telescope.”', '「わたし、望遠鏡みたいに縮んでいってるにちがいないわ」'],
    ],
    marks: [
      [';', 'セミコロンで、「へんな感じ！」という叫びと、そのあとに続くアリスの言葉（望遠鏡のように縮んでいるにちがいない）を区切ります。'],
    ],
    notes: {
      '“What a curious feeling!” said Alice;': 'What a＋形容詞＋名詞！で「なんて〜な…だろう」。curious はここでは「奇妙な」。',
      '“I must be shutting up like a telescope.”': 'must be doing で「〜しているにちがいない」。さっき願ったとおり、望遠鏡のように縮みはじめたのです。',
    },
  }),
  // 63
  ls('[接 And] [C so] [S it] [V was] [M indeed]: [S she] [V was] [M now] [C only ten inches high], [接 and] [S her face] [V brightened up] [M {前| at the thought {同格that>the thought| [接 that] [S she] [V was] [M now] [C the right size {前| for {動名詞| [V going] [M {前| through the little door}] [M {前| into that lovely garden}]}}]}}].', {
    p: true,
    ja: 'そして、本当にそのとおりだった。アリスは今やたった十インチ（約二十五センチ）の背丈になっていた。これでちょうど、あの小さなドアを通って、すてきな庭へ入れる大きさになったと思うと、アリスの顔はぱっと明るくなった。',
    chunks: [
      ['And so it was indeed:', 'そして、本当にそのとおりだった'],
      ['she was now only ten inches high,', '彼女は今、たった十インチの背丈になっていた'],
      ['and her face brightened up at the thought', 'そして、考えたとたん、顔がぱっと明るくなった'],
      ['that she was now the right size', '今ならちょうどいい大きさだという（考え）'],
      ['for going through the little door into that lovely garden.', 'あの小さなドアを通って、あのすてきな庭に入るのに'],
    ],
    marks: [
      [':', 'コロンで、「本当にそのとおりだった」ことの中身（背丈が十インチになった）を具体的に続けます。'],
    ],
    notes: {
      'And so it was indeed:': 'so it was で「本当にそうだった」。so は前のアリスの言葉（望遠鏡のように縮んでいる）を受けます。',
      'she was now only ten inches high,': 'ten inches high で「高さ十インチ」。約二十五センチメートルです。',
      'and her face brightened up at the thought': 'brighten up で「（顔が）ぱっと明るくなる」。at the thought that … で「…と考えて」。',
      'that she was now the right size': 'that節は the thought の中身を述べる同格の節です。the right size は「ちょうどいい大きさ」。',
    },
  }),
  // 64
  ls('[M First], [M however], [S she] [V waited] [M {前| for a few minutes}] [M {to:副詞(目的)| [V to see] [O {if節| [接 if] [S she] [V was going to shrink] [M any further]}]}]: [S she] [V felt] [C a little nervous {前| about this}]; [O {引用| “[接 for] [S it] [V might end], [M {挿入| you know}],”}] [V said] [S Alice] [M {前| to herself}], [O {引用| “[M {前| in {動名詞| [M my] [V going out] [M altogether]}}], [M {前| like a candle}].}]', {
    ja: 'けれども、まず数分待って、これ以上縮むかどうか様子を見た。このことが少し心配だったのだ。「だって、ひょっとしたら最後には」とアリスはひとりごとを言った。「ろうそくみたいに、わたしがすっかり消えてなくなっちゃうかもしれないもの。',
    chunks: [
      ['First, however, she waited for a few minutes', 'けれども、まず彼女は数分待ってみた'],
      ['to see if she was going to shrink any further:', 'これ以上縮むかどうか見るために'],
      ['she felt a little nervous about this;', 'このことが、少し心配だったのだ'],
      ['“for it might end, you know,”', '「だって、ひょっとしたら最後にはね」'],
      ['said Alice to herself,', 'とアリスはひとりごとを言った'],
      ['“in my going out altogether, like a candle.', '「ろうそくみたいに、わたしがすっかり消えちゃうことになるかもしれないもの'],
    ],
    marks: [
      [':', 'コロンで、「数分待って様子を見た」理由（これ以上縮むのが心配だった）を続けます。'],
      [';', 'セミコロンで、「心配だった」という語りと、その心配の中身を話すアリスの言葉を区切ってつなぎます。'],
    ],
    notes: {
      'First, however, she waited for a few minutes': 'however は文の途中に入れて「けれども」。すぐ庭へ向かわず、まず待った、という流れです。',
      'to see if she was going to shrink any further:': 'to see if … で「…かどうか確かめるために」。shrink は「縮む」、any further は「これ以上」。',
      'she felt a little nervous about this;': 'nervous は「心配な・不安な」。',
      '“for it might end, you know,”': 'for は「だって」と理由を示します。end in A で「最後は A になる」で、in … は後ろの引用の中に続きます。',
      '“in my going out altogether, like a candle.': 'my going out は「わたしが消えること」で、my は動名詞 going out の意味の上の主語です。go out は「（火が）消える」。altogether は「すっかり」。',
    },
  }),
  // 65
  ls('[S I] [V wonder] [O {疑問詞節| [C what] [S I] [V should be like] [M then]}]?”', {
    ja: 'そうなったら、わたしはどんなふうになるのかしら」',
    chunks: [
      ['I wonder what I should be like then?”', 'そうなったら、わたし、どんなふうになるのかしら」'],
    ],
    notes: {
      'I wonder what I should be like then?”': 'what … be like で「…はどんなふうか」。like の目的語が文の頭の what です。then は「そのとき（すっかり消えてしまったとき）」。',
    },
  }),
  // 66
  ls('[接 And] [S she] [V tried] [O {to:名詞| [V to fancy] [O {疑問詞節| [C what] [S the flame {前| of a candle}] [V is like] [M {副詞節:時| [接 after] [S the candle] [V is blown out]}]}]}], [接 for] [S she] [V could not remember] [O {動名詞| [M ever] [V having seen] [O such a thing]}].', {
    ja: 'そしてアリスは、ろうそくを吹き消したあと、ろうそくの炎がどんなふうになるのか想像してみようとした。そんなものを見た覚えが、一度もなかったからだ。',
    chunks: [
      ['And she tried to fancy what the flame', 'そして彼女は、炎がどんなふうか想像してみようとした'],
      ['of a candle is like after the candle is blown out,', 'ろうそくが吹き消されたあとの、ろうそくの（炎が）'],
      ['for she could not remember ever having seen such a thing.', 'というのも、そんなものを見た覚えが一度もなかったのだ'],
    ],
    notes: {
      'And she tried to fancy what the flame': 'fancy は「想像する」。what … is like で「…がどんなふうか」。',
      'of a candle is like after the candle is blown out,': 'blow out は「（火を）吹き消す」で、is blown out は受け身です。吹き消されたあとの炎は、もうないのですから、見たことがないのは当然です。',
      'for she could not remember ever having seen such a thing.': 'for は「というのも」。remember doing で「〜したことを覚えている」。having seen は、覚えている時より前に見たことを表す完了の動名詞です。',
    },
  }),
  // 67（セミコロンなどで区切られた長い1文を、4つに分けた1つ目）
  ls('[M {前| After a while}], [M {分詞構文:理由| [V finding] [O {that節| [接 that] [S nothing more] [V happened]}]}], [S she] [V decided on] [O {動名詞| [V going] [M {前| into the garden}] [M {前| at once}]}];', {
    p: true,
    part: true,
    ja: 'しばらくして、それ以上何も起こらないと分かったので、アリスはすぐに庭へ行くことにした。',
    chunks: [
      ['After a while, finding that nothing more happened,', 'しばらくして、それ以上何も起こらないと分かったので'],
      ['she decided on going into the garden at once;', '彼女はすぐに庭へ行くことに決めた'],
    ],
    marks: [
      [';', 'セミコロンで、「すぐ庭へ行くことにした」ことと、次の but, alas（ところが、ああ）で始まる思わぬ失敗を区切ります。'],
    ],
    notes: {
      'After a while, finding that nothing more happened,': 'after a while は「しばらくして」。finding … は分詞構文で「〜と分かったので」。',
      'she decided on going into the garden at once;': 'decide on doing で「〜することに決める」。at once は「すぐに」。',
    },
  }),
  // 68（1つの文の続き）
  ls('[接 but], [独 alas {前| for poor Alice}]! [M {副詞節:時| [接 when] [S she] [V got] [M {前| to the door}]}], [S she] [V found] [O {that省略| [S she] [V had forgotten] [O the little golden key]}], [接 and] [M {副詞節:時| [接 when] [S she] [V went back] [M {前| to the table}] [M {前| for it}]}], [S she] [V found] [O {that省略| [S she] [V could not] [M possibly] [V reach] [O it]}]:', {
    part: true,
    ja: 'ところが、ああ、かわいそうなアリス！ドアのところまで来てみると、小さな金の鍵を置いてきてしまったことに気づいた。そこで鍵を取りにテーブルへ戻ってみると、どうやっても手が届かないことが分かった。',
    chunks: [
      ['but, alas for poor Alice!', 'ところが、ああ、かわいそうなアリス！'],
      ['when she got to the door,', 'ドアのところまで来たとき'],
      ['she found she had forgotten the little golden key,', '小さな金の鍵を置いてきてしまったことに気づいた'],
      ['and when she went back to the table for it,', 'そして鍵を取りにテーブルへ戻ったとき'],
      ['she found she could not possibly reach it:', 'とても手が届かないことが分かった'],
    ],
    marks: [
      [':', 'コロンで、「どうしても手が届かない」ことの様子を具体的に続けます（ガラス越しに見えるのに、脚は登れない）。'],
    ],
    notes: {
      'but, alas for poor Alice!': 'alas for A で「A にとって悲しいことに」。語り手がアリスに同情する声です。',
      'she found she had forgotten the little golden key,': 'found のあとに that が省かれています。had forgotten は過去完了で、「（それより前に）忘れてきていた」。鍵はテーブルの上に置いたままでした。',
      'and when she went back to the table for it,': 'for it は「それ（鍵）を取りに」。',
      'she found she could not possibly reach it:': 'not possibly で「とても〜できない」。reach は「（手が）届く」。縮んだので、テーブルの上に手が届かないのです。',
    },
  }),
  // 69（1つの文の続き）
  ls('[S she] [V could see] [O it] [M quite plainly] [M {前| through the glass}], [接 and] [S she] [V tried] [O her best] [M {to:副詞(目的)| [V to climb] [M {前| up one {前| of the legs {前| of the table}}}]}], [接 but] [S it] [V was] [C too slippery];', {
    part: true,
    ja: 'ガラス越しに鍵はとてもはっきり見えたので、アリスはテーブルの脚の一本を一生けんめいよじ登ろうとしたけれど、つるつるすべって登れなかった。',
    chunks: [
      ['she could see it quite plainly through the glass,', 'ガラス越しに、鍵はとてもはっきり見えた'],
      ['and she tried her best to climb up one', 'そして、一生けんめいよじ登ろうとした'],
      ['of the legs of the table, but it was too slippery;', 'テーブルの脚の一本を。でも、つるつるすべりすぎた'],
    ],
    marks: [
      [';', 'セミコロンで、「登ろうとしたが、すべって登れなかった」ことと、最後にどうなったか（疲れて座りこみ、泣いた）を区切ってつなぎます。'],
    ],
    notes: {
      'she could see it quite plainly through the glass,': 'plainly は「はっきりと」。テーブルがガラスでできているので、下から鍵が見えるのです。',
      'and she tried her best to climb up one': 'try one’s best で「精いっぱいやってみる」。climb up A で「A をよじ登る」。',
      'of the legs of the table, but it was too slippery;': 'slippery は「すべりやすい」。too slippery は「すべりやすすぎて（登れない）」。',
    },
  }),
  // 70（1つの文の続き）
  ls('[接 and] [M {副詞節:時| [接 when] [S she] [V had tired] [O herself] [M out] [M {前| with {動名詞| [V trying]}}]}], [S the poor little thing] [V sat down] [接 and] [V cried].', {
    ja: 'そして、何度もやってみるうちにくたくたに疲れてしまうと、かわいそうに、アリスは座りこんで泣きだした。',
    chunks: [
      ['and when she had tired herself out with trying,', 'そして、やってみるうちにくたくたに疲れてしまうと'],
      ['the poor little thing sat down and cried.', 'かわいそうな小さな子は、座りこんで泣いた'],
    ],
    notes: {
      'and when she had tired herself out with trying,': 'tire oneself out で「くたくたに疲れる」。with trying は「やってみることで」。',
      'the poor little thing sat down and cried.': 'the poor little thing は「かわいそうな小さな子」で、アリスのことです。',
    },
  }),
  // 71
  ls('[O {引用| “[独 Come], [M there][V ’s] [S no use {前| in {動名詞| [V crying] [M {前| like that}]}}]!”}] [V said] [S Alice] [M {前| to herself}], [M rather sharply]; [O {引用| “[S I] [V advise] [O you] [C {to:補語| [V to leave off] [M this minute]}]!”}]', {
    p: true,
    ja: '「ほら、そんなふうに泣いたってしかたないでしょ！」と、アリスはかなりきびしい口調で自分に言いきかせた。「今すぐ泣きやみなさい。そのほうが身のためよ！」',
    chunks: [
      ['“Come, there’s no use in crying like that!”', '「さあ、そんなふうに泣いたってしかたないわ！」'],
      ['said Alice to herself, rather sharply;', 'とアリスは、かなりきびしく自分に言った'],
      ['“I advise you to leave off this minute!”', '「今すぐ泣きやむことをおすすめするわ！」'],
    ],
    marks: [
      [';', 'セミコロンで、自分をしかる1つ目の言葉と、続く2つ目の言葉（今すぐやめなさい）を区切ります。'],
    ],
    notes: {
      '“Come, there’s no use in crying like that!”': 'Come, … は「さあ・ほら」と相手をうながす声。There is no use in doing で「〜してもむだだ」。there’s は there is の短縮形です。',
      'said Alice to herself, rather sharply;': 'sharply は「きびしく・きつく」。自分で自分をしかっています。',
      '“I advise you to leave off this minute!”': 'advise A to do で「A に〜するよう忠告する」。leave off は「やめる」、this minute は「今すぐ」。',
    },
  }),
  // 72
  ls('[S She] [M generally] [V gave] [O1 herself] [O2 very good advice], [M ({副詞節:譲歩| [接 though] [S she] [M very seldom] [V followed] [O it]})], [接 and] [M sometimes] [S she] [V scolded] [O herself] [M so severely as {to:副詞(程度)| [V to bring] [O tears] [M {前| into her eyes}]}]; [接 and] [M once] [S she] [V remembered] [O {動名詞| [V trying] [O {to:名詞| [V to box] [O her own ears] [M {前| for {動名詞| [V having cheated] [O herself] [M {前| in a game {前| of croquet} {関係省略:目的格>a game of croquet| [S she] [V was playing] [M {前| against herself}]}}]}}]}]}], [接 for] [S this curious child] [V was] [C very fond {前| of {動名詞| [V pretending] [O {to:名詞| [V to be] [C two people]}]}}].', {
    ja: 'アリスはたいてい、自分にとてもよい忠告をした（それに従うことは、めったになかったけれど）。時には、目に涙が浮かぶほどきびしく自分をしかることもあった。一度などは、自分を相手にクロッケーをしていて、自分をずるでだましたからといって、自分の耳をぶとうとしたこともあったのを覚えている。この変わった子は、一人で二人の人間のふりをするのが大好きだったのだ。',
    chunks: [
      ['She generally gave herself very good advice,', '彼女はたいてい、自分にとてもよい忠告をした'],
      ['(though she very seldom followed it),', '（その忠告に従うことは、めったになかったけれど）'],
      ['and sometimes she scolded herself so severely', 'そして時には、自分をとてもきびしくしかったので'],
      ['as to bring tears into her eyes;', '目に涙が浮かぶほどだった'],
      ['and once she remembered trying to box her own ears', 'それに一度などは、自分の耳をぶとうとしたのを覚えている'],
      ['for having cheated herself in a game', '試合で自分をだましたからといって'],
      ['of croquet she was playing against herself,', '自分を相手にしていたクロッケーの（試合で）'],
      ['for this curious child was very fond', 'というのも、この変わった子は大好きだったのだ'],
      ['of pretending to be two people.', '二人の人間のふりをするのが'],
    ],
    marks: [
      [';', 'セミコロンで、「自分をきびしくしかった」ことに、もっとすごい例（自分の耳をぶとうとした）を続けます。'],
    ],
    notes: {
      'She generally gave herself very good advice,': 'give A B で「A に B を与える」。advice は数えられない名詞で「忠告」。',
      '(though she very seldom followed it),': 'seldom は「めったに〜ない」。follow advice は「忠告に従う」。',
      'and sometimes she scolded herself so severely': 'scold は「しかる」。so … as to do で「〜するほど…」。',
      'as to bring tears into her eyes;': 'bring tears into one’s eyes で「目に涙を浮かべさせる」。',
      'and once she remembered trying to box her own ears': 'remember doing で「〜したことを覚えている」。box one’s ears は「（罰として）耳のあたりを平手でぶつ」。',
      'for having cheated herself in a game': 'for は「〜したことで（の罰に）」。having cheated は、ぶとうとしたより前にだましたことを表す完了の動名詞です。',
      'of croquet she was playing against herself,': 'croquet は木づちで球を打って小さな門をくぐらせる、芝生の上の遊びです。a game of croquet と she の間に、目的格の関係代名詞が省かれています。',
      'for this curious child was very fond': 'for は「というのも」。be fond of doing で「〜するのが大好きだ」。curious はここでは「風変わりな」。',
    },
  }),
  // 73
  ls('[O {引用| “[接 But] [仮S it][V ’s] [C no use] [M now],”}] [V thought] [S poor Alice], [O {引用| “[真S {to:名詞| [V to pretend] [O {to:名詞| [V to be] [C two people]}]}]!}]', {
    ja: '「でも、今さらむだだわ」とかわいそうなアリスは思った。「二人の人間のふりをするなんて！',
    chunks: [
      ['“But it’s no use now,” thought poor Alice,', '「でも、今さらむだよ」とかわいそうなアリスは思った'],
      ['“to pretend to be two people!', '「二人の人間のふりをするなんて！'],
    ],
    notes: {
      '“But it’s no use now,” thought poor Alice,': 'It is no use to do で「〜してもむだだ」。it は形式主語で、中身は thought poor Alice をはさんだ後ろの to pretend … です。',
      '“to pretend to be two people!': 'pretend to do で「〜するふりをする」。',
    },
  }),
  // 74
  ls('[独 Why], [M there][V ’s] [M hardly] [S enough {前| of me} {過去分詞>enough of me| [V left]} {to:副詞(程度)| [V to make] [O one respectable person]}]!”', {
    ja: 'だって、ちゃんとした人間一人分になるほども、わたしは残っていないんだもの！」',
    chunks: [
      ['Why, there’s hardly enough of me left', 'だって、わたしはもうほとんど残っていないんだもの'],
      ['to make one respectable person!”', 'ちゃんとした一人分になるほどは」'],
    ],
    notes: {
      'Why, there’s hardly enough of me left': 'Why, … は「だって」。hardly は「ほとんど〜ない」。enough of me left は「残っている、十分な量のわたし」。縮んで小さくなったことを言っています。',
      'to make one respectable person!”': 'enough … to do で「〜するのに十分な…」。respectable は「ちゃんとした・一人前の」。二人どころか、一人分にも足りない、というおかしさです。',
    },
  }),
  // 75
  ls('[M Soon] [S her eye] [V fell] [M {前| on a little glass box {関係>a little glass box| [S that] [V was lying] [M {前| under the table}]}}]: [S she] [V opened] [O it], [接 and] [V found] [M {前| in it}] [O a very small cake, {関係,>a very small cake| [M {前| on which}] [S the words “EAT ME”] [V were] [M beautifully] [V marked] [M {前| in currants}]}].', {
    p: true,
    ja: 'まもなく、テーブルの下に置いてある小さなガラスの箱が、アリスの目にとまった。開けてみると、中にはとても小さなケーキが入っていて、その上に「わたしをお食べ」という言葉が、干しぶどうできれいに書いてあった。',
    chunks: [
      ['Soon her eye fell on a little glass box', 'まもなく、アリスの目は小さなガラスの箱にとまった'],
      ['that was lying under the table:', 'テーブルの下に置いてある（箱に）'],
      ['she opened it, and found in it a very small cake,', '開けてみると、中にとても小さなケーキが入っていて'],
      ['on which the words “EAT ME” were beautifully marked', 'その上には「わたしをお食べ」という言葉が、きれいに書いてあった'],
      ['in currants.', '干しぶどうで'],
    ],
    marks: [
      [':', 'コロンで、ガラスの箱が目にとまったあと、それをどうしたか（開けて、中にケーキを見つけた）を続けます。'],
    ],
    notes: {
      'Soon her eye fell on a little glass box': 'one’s eye falls on A で「A がふと目にとまる」。',
      'that was lying under the table:': 'that は a little glass box を説明する関係代名詞。lie は「（物が）置いてある」。',
      'she opened it, and found in it a very small cake,': 'found の目的語 a very small cake の前に、in it（その中に）が入っています。',
      'on which the words “EAT ME” were beautifully marked': 'on which は「そのケーキの上に」で、which が a very small cake を指します。EAT ME は「わたしを食べて」。',
      'in currants.': 'currant は小粒の干しぶどうです。',
    },
  }),
  // 76
  ls('[O {引用| “[独 Well], [S I][V ’ll eat] [O it],”}] [V said] [S Alice], [O {引用| “[接 and] [M {副詞節:条件| [接 if] [S it] [V makes] [O me] [C {原形| [V grow] [C larger]}]}], [S I] [V can reach] [O the key]; [接 and] [M {副詞節:条件| [接 if] [S it] [V makes] [O me] [C {原形| [V grow] [C smaller]}]}], [S I] [V can creep] [M {前| under the door}]; [接 so] [M either way] [S I][V ’ll get] [M {前| into the garden}], [接 and] [S I] [V don’t care] [O {疑問詞節| [S which] [V happens]}]!”}]', {
    ja: '「じゃあ、食べてみるわ」とアリスは言った。「もしこれで大きくなったら鍵に手が届くし、小さくなったらドアの下をくぐれるもの。だから、どっちにしても庭へ入れるわ。どっちになったってかまわない！」',
    chunks: [
      ['“Well, I’ll eat it,” said Alice,', '「じゃあ、食べてみるわ」とアリスは言った'],
      ['“and if it makes me grow larger,', '「それで、もしこれで大きくなったら'],
      ['I can reach the key;', '鍵に手が届くし'],
      ['and if it makes me grow smaller,', 'もし小さくなったら'],
      ['I can creep under the door;', 'ドアの下をくぐれるわ'],
      ['so either way I’ll get into the garden,', 'だから、どっちにしても庭へ入れるわ'],
      ['and I don’t care which happens!”', 'どっちになってもかまわない！」'],
    ],
    marks: [
      [';', 'セミコロンで、大きくなった場合と、小さくなった場合の2つを区切って並べます。'],
      [';', 'セミコロンで、2つの場合を並べ終え、so（だから）で始まる結論（どちらでも庭に入れる）へつなぎます。'],
    ],
    notes: {
      '“Well, I’ll eat it,” said Alice,': 'Well は「じゃあ・それなら」。I’ll は I will の短縮形で、その場で決めたことを表します。',
      '“and if it makes me grow larger,': 'make A do で「A に〜させる」。grow larger は「大きくなる」。',
      'and if it makes me grow smaller,': 'grow smaller は「小さくなる」。大きくなる場合と小さくなる場合を、同じ形で並べています。',
      'I can creep under the door;': 'creep は「はって進む・もぐりこむ」。',
      'so either way I’ll get into the garden,': 'either way で「どちらにしても」。',
      'and I don’t care which happens!”': 'I don’t care … で「…はどうでもいい」。which happens は「どちらが起こるか」。',
    },
  }),
  // 77（コロンで区切られた1文を、2つに分けた1つ目）
  ls('[S She] [V ate] [O a little bit], [接 and] [V said] [M anxiously] [M {前| to herself}], [O {引用| “[独 Which way]? [独 Which way]?”}], [M {分詞構文:付帯状況| [V holding] [O her hand] [M {前| on the top {前| of her head}}] [M {to:副詞(目的)| [V to feel] [O {疑問詞節| [M which way] [S it] [V was growing]}]}]}], [接 and] [S she] [V was] [C quite surprised {to:副詞(原因)| [V to find] [O {that節| [接 that] [S she] [V remained] [C the same size]}]}]:', {
    p: true,
    part: true,
    ja: 'アリスはほんの少し食べてみて、頭のてっぺんに手をのせ、どっちに伸びていくのか確かめようとしながら、「どっち？どっち？」と心配そうにひとりごとを言った。すると、大きさがちっとも変わらないので、とても驚いた。',
    chunks: [
      ['She ate a little bit,', '彼女はほんの少し食べて'],
      ['and said anxiously to herself, “Which way? Which way?”,', '心配そうに自分に言った「どっち？どっち？」と'],
      ['holding her hand on the top of her head', '頭のてっぺんに手をのせて'],
      ['to feel which way it was growing,', 'どっちに伸びているのか確かめようとしながら'],
      ['and she was quite surprised to find', 'そして、分かってとても驚いた'],
      ['that she remained the same size:', '大きさがちっとも変わらないことが'],
    ],
    marks: [
      [':', 'コロンで、「大きさが変わらなくて驚いた」ことについて、語り手の説明（ケーキを食べればふつうはそうなのだが）を続けます。'],
    ],
    notes: {
      'She ate a little bit,': 'a little bit は「ほんの少し」。',
      'and said anxiously to herself, “Which way? Which way?”,': 'anxiously は「心配そうに」。Which way? は「どっちへ？」で、大きくなるのか小さくなるのか、と気にしています。',
      'holding her hand on the top of her head': 'holding … は分詞構文で「〜しながら」。',
      'to feel which way it was growing,': 'to feel … は目的を表し「確かめるために」。it は自分の体（背丈）のことです。',
      'and she was quite surprised to find': 'be surprised to do で「〜して驚く」。to find は驚いた原因を表します。',
      'that she remained the same size:': 'remain A で「A のままである」。',
    },
  }),
  // 78（1つの文の続き）
  ls('[M {成句| to be sure}], [S this] [M generally] [V happens] [M {副詞節:時| [接 when] [S one] [V eats] [O cake]}], [接 but] [S Alice] [V had got] [M so much] [M {前| into the way {前| of {動名詞| [V expecting] [O nothing {前| but out-of-the-way things}] [C {to:補語| [V to happen]}]}}}], [M {副詞節:結果| [接 that] [仮S it] [V seemed] [C quite {並列| dull | and stupid}] [真S {前:意味上の主語| for life} {to:名詞| [V to go on] [M {前| in the common way}]}]}].', {
    ja: 'たしかに、ケーキを食べたときには、ふつうはそうなるものだ。けれどアリスは、変わったことしか起こらないと思うのがすっかりくせになっていたので、毎日がふだんどおりに続いていくのが、ひどくつまらなく、ばかばかしく思えたのだ。',
    chunks: [
      ['to be sure, this generally happens when one eats cake,', 'たしかに、ケーキを食べたときには、ふつうはそうなるものだ'],
      ['but Alice had got so much into the way', 'けれどアリスは、すっかりくせになっていたので'],
      ['of expecting nothing but out-of-the-way things to happen,', '変わったことしか起こらないと思うことが'],
      ['that it seemed quite dull and stupid', 'とてもつまらなく、ばかばかしく思えた'],
      ['for life to go on in the common way.', 'ふだんどおりに毎日が続いていくのが'],
    ],
    notes: {
      'to be sure, this generally happens when one eats cake,': 'to be sure は「たしかに」。one は「（一般に）人」。ケーキを食べても背丈が変わらないのは当たり前だ、と語り手がおどけています。',
      'but Alice had got so much into the way': 'get into the way of doing で「〜するくせがつく」。so much … that ～ で「とても…なので～」。',
      'of expecting nothing but out-of-the-way things to happen,': 'expect A to do で「A が〜すると思う」。nothing but A は「A だけ」（but は「〜以外」）。',
      'that it seemed quite dull and stupid': 'it は形式主語で、中身は for life to go on … です。dull は「退屈な」。',
      'for life to go on in the common way.': 'for life は to go on の意味の上の主語で、「生活が（続いていくこと）」。in the common way は「ふだんどおりに」。',
    },
  }),
  // 79
  ls('[接 So] [S she] [V set] [M {前| to work}], [接 and] [M very soon] [V finished off] [O the cake].', {
    p: true,
    ja: 'そこでアリスは食べることに取りかかり、たちまちケーキを平らげてしまった。',
    chunks: [
      ['So she set to work, and very soon finished off the cake.', 'そこで彼女は取りかかり、たちまちケーキを平らげてしまった'],
    ],
    notes: {
      'So she set to work, and very soon finished off the cake.': 'set to work で「（仕事に）取りかかる」。ここではケーキを食べることです。finish off は「すっかり平らげる」。',
    },
  }),
])
