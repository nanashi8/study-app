import { st } from './entry.js'

export default Object.freeze([
  st('[S People] [V replace] [O {並列| phones, | lamps, | and other household devices}] [M {前| for many reasons}].', {
    chunks: [
      ['People', '人々は'],
      ['replace phones, lamps, and other household devices', '電話やランプ、そのほかの家庭用機器を買い替えます'],
      ['for many reasons', 'さまざまな理由で'],
    ],
  }),
  st('[M Sometimes] [S a product] [V is] [M badly] [C damaged], [接 but] [M {前| in other cases}] [M only] [S a small part] [V has stopped] [O {動名詞| [V working]}].', {
    chunks: [
      ['Sometimes', 'ときには'],
      ['a product is badly damaged', '製品がひどく壊れています'],
      ['but', 'しかし'],
      ['in other cases', 'ほかの場合には'],
      ['only a small part has stopped working', '小さな部品だけが動かなくなっています'],
    ],
    notes: {
      'only a small part has stopped working': 'only は a small part を限定して「〜だけが」。stop ＋ -ing で「〜するのをやめる」で、ここでは部品が「動かなくなる」。',
    },
  }),
  st('[M {副詞節:理由| [接 Because] [S {動名詞| [V buying] [O a new item]}] [V is] [M often] [C easier {前| than {動名詞| [V finding] [O someone {to:形容詞>someone| [V to fix] [O the old one]}]}}]}], [S usable products] [V become] [C waste].', {
    chunks: [
      ['Because', '〜なので（理由は次へ）'],
      ['buying a new item', '新しい品物を買うことは'],
      ['is often easier', 'より簡単なことが多い（比べる相手は次へ）'],
      ['than finding someone', '人を見つけるよりも'],
      ['to fix the old one', '古い物を直してくれる（人を）'],
      ['usable products', 'まだ使える製品が'],
      ['become waste', 'ごみになります'],
    ],
    notes: {
      'buying a new item': 'buying a new item は「新しい品物を買うこと」という動名詞のまとまりで、because 節の主語です。',
      'than finding someone': 'than の後ろも finding（見つけること）という動名詞で、buying と比べています。',
      'to fix the old one': 'to fix は someone を後ろから説明します。one は前に出た item の代わりです。',
    },
    rules: ['cause-result', 'comparison-pairs', 'ing-ed-role'],
  }),
  st('[M {前| In response}], [S communities {前| in several countries}] [V have started] [O events {過去分詞>events| [V called] [C repair cafes]}].', {
    chunks: [
      ['In response', 'これに応じて'],
      ['communities', '地域社会は'],
      ['in several countries', 'いくつかの国の（地域社会は）'],
      ['have started events', '催しを始めました'],
      ['called repair cafes', 'リペアカフェと呼ばれる（催しを）'],
    ],
    notes: {
      'called repair cafes': 'called 以下は events を後ろから説明する過去分詞のまとまりで、「リペアカフェと呼ばれる」。',
    },
  }),
  st('[M {前| At these events}], [S local volunteers] [V help] [O visitors] [C {原形| [V examine] [O broken things] [接 and], [M {副詞節:時| [接 when] [C possible]}], [V repair] [O them]}].', {
    chunks: [
      ['At these events', 'こうした催しでは'],
      ['local volunteers', '地域のボランティアが'],
      ['help visitors examine broken things', '来場者が壊れた物を調べるのを手伝います'],
      ['and', 'そして'],
      ['when possible,', 'できる場合には'],
      ['repair them', 'それを修理するのを（手伝います）'],
    ],
    notes: {
      'help visitors examine broken things': 'help ＋ 人 ＋ 動詞の原形 で「人が〜するのを手伝う」。examine と後ろの repair が help の後ろの原形です。',
      'when possible,': 'when possible は when it is possible の it is が省かれた形です。',
    },
  }),
  st('[S A repair cafe] [V is] [C different {前| from a normal repair shop}].', {
    chunks: [
      ['A repair cafe', 'リペアカフェは'],
      ['is different', '違っています（何と違うかは次へ）'],
      ['from a normal repair shop', '普通の修理店とは'],
    ],
    notes: {
      'is different': 'be different from 〜 で「〜とは違う」。',
    },
  }),
  st('[S Visitors] [V are expected] [C {to:補語| [V to sit] [M {前| with volunteers}] [接 and] [V take part] [M {前| in the work}] [M {前| instead of {動名詞| [M simply] [V leaving] [O an item] [M {前| at a counter}]}}]}].', {
    chunks: [
      ['Visitors', '来場者は'],
      ['are expected to sit', '座ることが求められています（だれと座るかは次へ）'],
      ['with volunteers', 'ボランティアと一緒に'],
      ['and', 'そして'],
      ['take part in the work', '作業に参加することが（求められています）'],
      ['instead of', '〜するのではなく（内容は次へ）'],
      ['simply leaving an item at a counter', 'ただ受付に品物を置いていく（のではなく）'],
    ],
    notes: {
      'are expected to sit': 'be expected to do で「〜することを求められている」。',
      'take part in the work': 'take part in 〜 で「〜に参加する」。take part は to sit と to を共有しています。',
      'instead of': 'instead of ＋ -ing で「〜するのではなく」。',
    },
  }),
  st('[S A volunteer] [V may show] [O1 someone] [O2 {疑問詞to| [M how] [V to open] [O a lamp] [M safely], [V replace] [O a worn wire], [接 or] [V search] [M {前| for instructions}] [M online]}].', {
    chunks: [
      ['A volunteer', 'ボランティアは'],
      ['may show someone', '人に教えることもあります（何を教えるかは次へ）'],
      ['how to open a lamp safely,', 'ランプを安全に開ける方法や'],
      ['replace a worn wire,', 'すり減った電線を交換する方法'],
      ['or search for instructions online', 'あるいはインターネットで説明書を探す方法を'],
    ],
    notes: {
      'may show someone': 'show ＋ 人 ＋ もの で「人にものを示す・教える」。may は「〜することもある」。',
      'how to open a lamp safely,': 'how to do で「〜する方法」。replace と search も how to を共有しています（how to replace / how to search）。',
    },
  }),
  st('[S This process] [V allows] [O participants] [C {to:補語| [V to gain] [O {並列| practical skills | and confidence}]}].', {
    chunks: [
      ['This process', 'この過程は'],
      ['allows participants to gain practical skills and confidence', '参加者が実用的な技能と自信を身につけられるようにします'],
    ],
    notes: {
      'allows participants to gain practical skills and confidence': 'allow ＋ 人 ＋ to do で「人が〜できるようにする」。',
    },
  }),
  st('[S It] [M also] [V creates] [O conversations {前| between people {前| of different ages}}].', {
    chunks: [
      ['It', 'この過程は'],
      ['also', 'また'],
      ['creates conversations', '会話を生み出します'],
      ['between people of different ages', '異なる年代の人々の間の（会話を）'],
    ],
    notes: {
      It: 'It は前の文の This process を指します。',
    },
  }),
  st('[S Older residents] [V may know] [O {疑問詞節| [M how] [S older machines] [V were built]}], [M {副詞節:対比| [接 while] [S younger participants] [V may be] [C more comfortable {ing限定| [V finding] [O digital information]}]}].', {
    chunks: [
      ['Older residents may know', '年配の住民は知っているかもしれません（何をかは次へ）'],
      ['how older machines were built', '古い機械がどのように作られていたかを'],
      ['while', '一方'],
      ['younger participants', '若い参加者のほうが'],
      ['may be more comfortable', '慣れているかもしれません（何にかは次へ）'],
      ['finding digital information', 'デジタル情報を探すことに'],
    ],
    notes: {
      'how older machines were built': 'how 以下は「どのように〜か」という名詞のまとまりで、know の目的語です。were built は受け身です。',
      while: 'while はここでは「一方で」と前後を対比します。',
      'finding digital information': 'be comfortable -ing で「〜することに慣れている・抵抗がない」。',
    },
  }),
  st('[S Supporters] [V say] [O {that省略| [S repair cafes] [V offer] [O {並列| both environmental | and social benefits}]}].', {
    chunks: [
      ['Supporters say', '支持する人々は言います（内容は次へ）'],
      ['repair cafes', 'リペアカフェが'],
      ['offer both environmental and social benefits', '環境面と社会面の両方の利点をもたらす（と）'],
    ],
    notes: {
      'Supporters say': 'say の後ろで接続詞 that が省略されています。',
      'offer both environmental and social benefits': 'both A and B で「AとBの両方」。',
    },
  }),
  st('[S {動名詞| [V Extending] [O the life {前| of a product}]}] [V reduces] [O waste] [接 and] [V lowers] [O demand {前| for {並列| the energy | and resources} {過去分詞>the energy and resources| [V required] [M {to:副詞(目的)| [V to make] [O new goods]}]}}].', {
    chunks: [
      ['Extending the life of a product', '製品の寿命を延ばすことは'],
      ['reduces waste', 'ごみを減らします'],
      ['and', 'そして'],
      ['lowers demand', '需要を下げます（何への需要かは次へ）'],
      ['for the energy and resources', 'エネルギーや資源への'],
      ['required to make new goods', '新しい製品を作るのに必要な（エネルギーや資源への）'],
    ],
    notes: {
      'Extending the life of a product': 'Extending the life of a product は「製品の寿命を延ばすこと」という動名詞のまとまりで、文の主語です。',
      'required to make new goods': 'required 以下は the energy and resources を後ろから説明する過去分詞のまとまりです。',
    },
  }),
  st('[S Families] [V may] [M also] [V save] [O money], [M {関係,>前の内容| [S which] [V is] [M especially] [C valuable] [M {副詞節:時| [接 when] [S prices] [V are rising]}]}].', {
    chunks: [
      ['Families', '家庭は'],
      ['may also save money', 'お金も節約できるかもしれません'],
      ['which', 'そしてそのことは'],
      ['is especially valuable', '特に価値があります'],
      ['when prices are rising', '物価が上がっているときには'],
    ],
    notes: {
      which: 'コンマの後ろの which は、前の節の内容（お金を節約できること）を受けています。',
      'when prices are rising': 'are rising は現在進行形で「上がっている最中」。',
    },
  }),
  st('[M {前| In addition}], [S the events] [V encourage] [O people] [C {to:補語| [V to think] [M differently] [M {前| about ownership}]}].', {
    chunks: [
      ['In addition', 'さらに'],
      ['the events', 'その催しは'],
      ['encourage people to think differently about ownership', '人々に、物を持つことについて違った考え方をするよう促します'],
    ],
    notes: {
      'encourage people to think differently about ownership': 'encourage ＋ 人 ＋ to do で「人に〜するよう促す」。',
    },
  }),
  st('[S A device] [M no longer] [V seems] [C {前| like a closed box {関係>a closed box| [O that] [M only] [S its manufacturer] [V understands]}}].', {
    chunks: [
      ['A device', '機器は'],
      ['no longer seems like a closed box', 'もはや閉ざされた箱のようには思えません'],
      ['that only its manufacturer understands', '製造業者だけが中を理解している（箱のようには）'],
    ],
    notes: {
      'no longer seems like a closed box': 'no longer は「もはや〜ない」。seem like ＋ 名詞 で「〜のように思える」。',
      'that only its manufacturer understands': 'that は a closed box を受ける関係代名詞で、understands の目的語です。only は its manufacturer を限定します。',
    },
  }),
  st('[M {副詞節:時| [接 Even when] [S an object] [V cannot be repaired]}], [S a visitor] [V may learn] [O {並列| {疑問詞節| [M why] [S it] [V failed]} | and {疑問詞to| [M how] [V to choose] [O a longer-lasting replacement]}}].', {
    chunks: [
      ['Even when', '〜するときでさえ（内容は次へ）'],
      ['an object cannot be repaired', '物を修理できない（ときでさえ）'],
      ['a visitor may learn', '来場者は学ぶことができます（何をかは次へ）'],
      ['why it failed', 'それがなぜ壊れたのかを'],
      ['and how to choose a longer-lasting replacement', 'そして、より長持ちする代わりの品をどう選ぶかを'],
    ],
    notes: {
      'an object cannot be repaired': 'cannot be repaired は受け身で「修理されることができない」。',
      'a visitor may learn': 'may はここでは「〜できることもある」という可能性です。',
      'and how to choose a longer-lasting replacement': 'why it failed と how to choose … の二つが and で並び、どちらも learn の目的語です。',
    },
  }),
  st('[M However], [S repair cafes] [V are not] [C a complete solution].'),
  st('[S Volunteers] [V must refuse] [O jobs {関係>jobs| [S that] [V could be] [C dangerous]}], [接 and] [S replacement parts] [V are] [M sometimes] [C {並列| unavailable | or too expensive}].', {
    chunks: [
      ['Volunteers', 'ボランティアは'],
      ['must refuse jobs', '作業を断らなければなりません'],
      ['that could be dangerous', '危険になりうる（作業を）'],
      ['and', 'そして'],
      ['replacement parts', '交換部品は'],
      ['are sometimes unavailable', 'ときには手に入りません'],
      ['or too expensive', 'または高すぎます'],
    ],
    notes: {
      'that could be dangerous': 'could はここでは「〜になりうる」という可能性です。',
    },
  }),
  st('[S Some modern products] [V are] [M also] [V designed] [M {副詞節:目的| [接 so that] [S they] [V are] [C difficult {to:副詞(形容詞)| [V to open] [M {前| without special tools}]}]}].', {
    chunks: [
      ['Some modern products', '現代の製品の中には'],
      ['are also designed', '設計されているものもあります（どう設計されているかは次へ）'],
      ['so that', '〜ように'],
      ['they are difficult to open', 'それらが開けにくい（ように）'],
      ['without special tools', '特別な道具なしでは'],
    ],
    notes: {
      'so that': 'so that ＋ S ＋ V で「SがVするように」。',
      'they are difficult to open': 'difficult to open で「開けるのが難しい」。to open は difficult の内容を後ろから限定します。',
    },
  }),
  st('[S Critics] [M therefore] [V argue] [O {that節| [接 that] [S manufacturers] [V should make] [O {並列| parts | and instructions}] [C easier {to:副詞(形容詞)| [V to obtain]}]}].', {
    chunks: [
      ['Critics therefore argue', 'そのため、批判する人々は主張します（内容は次へ）'],
      ['that', '〜だと'],
      ['manufacturers', '製造業者は'],
      ['should make parts and instructions easier to obtain', '部品や説明書をもっと手に入れやすくするべきだ（と）'],
    ],
    notes: {
      'should make parts and instructions easier to obtain': 'make ＋ O ＋ C で「OをCにする」。easier to obtain が C で、to obtain は easier を後ろから限定します。',
    },
  }),
  st('[S Repair cafes] [V cannot change] [O product design] [M {前| by themselves}], [接 but] [S they] [V can show] [O1 consumers] [O2 {疑問詞節| [S what] [V prevents] [O repairs]}].', {
    chunks: [
      ['Repair cafes', 'リペアカフェは'],
      ['cannot change product design', '製品の設計を変えることはできません'],
      ['by themselves', 'それだけの力では'],
      ['but', 'しかし'],
      ['they', 'リペアカフェは'],
      ['can show consumers', '消費者に示すことができます（何をかは次へ）'],
      ['what prevents repairs', '何が修理を妨げているのかを'],
    ],
    notes: {
      'by themselves': 'by oneself で「自分（たち）だけで」。',
      'what prevents repairs': 'what は「何が」と問う疑問詞で、what 以下が show の二つ目の目的語です。',
    },
  }),
  st('[S Their greatest value] [V may be] [C {that節| [接 that] [S they] [V turn] [O a private problem, {同格>a private problem| a broken object},] [M {前| into a public lesson {前| about {並列| waste, | skills, | and responsibility}}}]}].', {
    chunks: [
      ['Their greatest value may be', 'リペアカフェの最大の価値は〜ことかもしれません（内容は次へ）'],
      ['that', '〜ということ'],
      ['they', 'リペアカフェが'],
      ['turn a private problem,', '個人的な問題を変える'],
      ['a broken object,', 'つまり壊れた物を'],
      ['into a public lesson', '社会の学びへと'],
      ['about waste, skills, and responsibility', 'ごみや技能や責任についての（学びへ）'],
    ],
    notes: {
      'turn a private problem,': 'turn A into B で「AをBに変える」。',
      'a broken object,': 'a broken object は a private problem を言いかえた同格です。',
    },
  }),
])
