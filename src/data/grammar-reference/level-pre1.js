// 文法の参考書：英検準1級（大学中級程度）。並びは学ぶ順。
import { referenceUnit } from './unit.js'

export const GRAMMAR_REFERENCE_PRE1 = [
  referenceUnit({
    key: 'modal',
    level: 'pre1',
    topic: '助動詞',
    title: '助動詞（ought to have・must have・need not have）',
    lead: '過去のことへの推量・後悔・非難を、助動詞＋have＋過去分詞で表す。2級で学んだ must have・should have に加えて、ought to have（〜すべきだったのに）なども使えるようにする。',
    forms: [
      ['〜すべきだったのに', 'ought to have ＋ 過去分詞', 'You ought to have consulted us before changing the plan.', '計画を変える前に私たちに相談すべきでした。'],
      ['〜する必要はなかったのに', 'need not have ＋ 過去分詞', 'You need not have brought so much food.', 'そんなにたくさん食べ物を持ってくる必要はなかったのに。'],
    ],
    points: [
      {
        title: '過去への判断を表す形',
        table: [
          ['形', '意味'],
          ['must have ＋ 過去分詞', '〜したにちがいない'],
          ['cannot have ＋ 過去分詞', '〜したはずがない'],
          ['may / might have ＋ 過去分詞', '〜したかもしれない'],
          ['should / ought to have ＋ 過去分詞', '〜すべきだったのに（しなかった）'],
          ['need not have ＋ 過去分詞', '〜する必要はなかったのに（した）'],
        ],
        examples: [
          ['She must have known that the figures were inaccurate.', '彼女は数字が正確でないことを知っていたにちがいありません。'],
          ['The committee ought to have revised the proposal earlier.', '委員会はもっと早く提案を修正すべきでした。'],
        ],
      },
      {
        title: '助動詞を使った決まった言い方',
        table: [
          ['言い方', '意味'],
          ['may well ＋ 原形', 'おそらく〜だろう・〜するのももっともだ'],
          ['might as well ＋ 原形', '〜したほうがましだ'],
          ['cannot ＋ 原形 ＋ too 〜', 'いくら〜してもしすぎることはない'],
          ['would rather A than B', 'BするよりむしろAしたい'],
        ],
        examples: [
          ['You may well be right.', 'おそらくあなたの言うとおりでしょう。'],
          ['You cannot be too careful when you drive.', '運転するときは、いくら注意してもしすぎることはありません。'],
        ],
      },
    ],
    mistakes: [
      ['You ought to consulted us.', 'You ought to have consulted us.', '過去のことを言うときは ought to have＋過去分詞。'],
      ['She must had known it.', 'She must have known it.', '助動詞の後ろは原形の have。'],
    ],
    check: [
      'ought to have done＝すべきだったのに、need not have done＝する必要はなかったのに。',
      'may well＝おそらく〜、might as well＝〜したほうがまし、cannot 〜 too＝いくら〜してもしすぎない。',
    ],
  }),

  referenceUnit({
    key: 'subjunctive',
    level: 'pre1',
    topic: '仮定法応用',
    title: '仮定法の応用（if の省略・were to・仮定法現在）',
    lead: 'if を省いた倒置（Had I known 〜 / Were it not for 〜）、実現しにくい未来の仮定（If 〜 were to）、would rather＋仮定法、「要求・提案」の that 節で原形を使う仮定法現在などを学ぶ。',
    forms: [
      ['if の省略', 'Had / Were / Should ＋ 主語 〜, 主語 ＋ would 〜.', 'Had I known, I would have told you.', '知っていたら、あなたに話したでしょう。'],
      ['仮定法現在', 'demand / suggest / insist ＋ that ＋ 主語 ＋ 原形', 'The residents demanded that the council publish the safety report.', '住民は議会が安全報告書を公表するよう求めました。'],
    ],
    points: [
      {
        title: 'if を省くと倒置になる',
        text: [
          'If I had known → Had I known、If it were not for 〜 → Were it not for 〜、If you should 〜 → Should you 〜。if を省くと、had・were・should が主語の前に出る。',
        ],
        examples: [
          ['Were it not for water, nothing could live.', '水がなければ、何も生きられないでしょう。'],
          ['Had the committee revised the proposal earlier, the outcome would have differed.', '委員会がもっと早く提案を修正していれば、結果はちがっていたでしょう。'],
        ],
      },
      {
        title: '「〜がなければ」「そうでなければ」',
        text: [
          'If it were not for 〜・But for 〜・Without 〜 は「〜がなければ」。otherwise（そうでなければ）も仮定の条件をふくむので、後ろは would＋原形／would have＋過去分詞になる。',
        ],
        examples: [
          ['If it were not for this map, we would be lost.', 'この地図がなければ、私たちは道に迷っているでしょう。'],
          ['But for air, no living thing could survive.', '空気がなければ、生き物は生きられないでしょう。'],
          ['The bus arrived just in time; otherwise, we would have missed the flight.', 'バスがちょうど間に合いました。そうでなければ、飛行機に乗り遅れていたでしょう。'],
        ],
      },
      {
        title: 'were to・wish・would rather',
        text: [
          'If＋主語＋were to＋原形 は、起こりそうにない未来の仮定。I wish＋could（今）／had＋過去分詞（過去）。would rather＋主語＋過去形 は「（人に）むしろ〜してほしい」。',
        ],
        examples: [
          ['If the plan were to fail, we would need an alternative.', '万一計画が失敗したら、別の案が必要になるでしょう。'],
          ['I wish I could speak French.', 'フランス語が話せたらいいのに。'],
          ['I wish I had listened to your advice.', 'あなたの助言を聞いておけばよかった。'],
          ['I would rather you left now.', 'あなたにはむしろ今出発してほしいのですが。'],
        ],
      },
      {
        title: '要求・提案の that 節は原形（仮定法現在）',
        text: [
          'demand・require・suggest・propose・insist・recommend などの後ろの that 節や、It is vital / essential / necessary that 〜 の中では、主語や時にかかわらず動詞を原形にする（イギリス英語では should＋原形も使う）。',
        ],
        examples: [
          ['It is vital that every record be preserved.', 'すべての記録が保存されることがきわめて重要です。'],
          ['The doctor suggested that he take a rest.', '医者は彼が休むよう勧めました。'],
        ],
      },
    ],
    mistakes: [
      ['If I have known, I would have told you.', 'Had I known, I would have told you.', '過去の仮定は had＋過去分詞。if を省くなら Had I known。'],
      ['Was it not for water, nothing could live.', 'Were it not for water, nothing could live.', 'if it were not for を倒置すると Were it not for。'],
      ['They demanded that he pays the money.', 'They demanded that he pay the money.', '要求を表す that 節の中は原形。'],
    ],
    check: [
      'Had I known＝If I had known、Were it not for＝If it were not for。',
      'If 〜 were to＝万一〜したら。would rather＋主語＋過去形。',
      'demand / suggest / It is vital that＋主語＋原形。',
    ],
  }),

  referenceUnit({
    key: 'beto',
    level: 'pre1',
    topic: 'be to構文',
    title: 'be to 構文の5つの意味',
    lead: 'be to＋原形 は「予定・義務・可能・運命・意図」の意味を表す。どの意味かは文の内容と形（否定・受け身・if 節など）から判断する。',
    forms: [
      ['形', '主語 ＋ be動詞 ＋ to ＋ 原形 〜', 'The conference is to begin at nine sharp.', '会議は9時ちょうどに始まる予定です。'],
    ],
    points: [
      {
        title: '意味の見分け方',
        table: [
          ['意味', '手がかり', '例'],
          ['予定（〜することになっている）', '時を表す語句', 'The conference is to begin at nine.'],
          ['義務（〜しなければならない）', '指示・規則の文', 'You are to finish this by noon.'],
          ['可能（〜できる）', '否定文＋受け身が多い', 'Not a sound was to be heard.'],
          ['運命（〜することになった）', '過去の話で後のことを言う', 'He was never to see her again.'],
          ['意図（〜するつもりなら）', 'if 節の中', 'If you are to succeed, 〜'],
        ],
        examples: [
          ['When I woke up, not a sound was to be heard.', '目が覚めたとき、物音ひとつ聞こえませんでした。'],
          ['If you are to succeed, you must set clear priorities.', '成功したいなら、はっきりした優先順位を決めなければなりません。'],
          ['If the committee is to revise the proposal successfully, it needs more resources.', '委員会が提案をうまく修正するには、もっと人手と資金が必要です。'],
          ['He was never to see his hometown again.', '彼は二度と故郷を見ることはありませんでした。'],
        ],
      },
      {
        title: 'be subject to 〜 など形の似た言い方',
        text: [
          'be subject to 〜（〜の対象となる・〜を受けることがある）の to は前置詞で、後ろは名詞。be to 構文とは別のもの。',
        ],
        examples: [
          ['The rule is subject to review every year.', 'その規則は毎年見直しの対象になります。'],
        ],
      },
    ],
    mistakes: [
      ['If you are succeed, you must work hard.', 'If you are to succeed, you must work hard.', '「成功したいなら」は If you are to succeed。to を落とさない。'],
      ['Not a sound was to hear.', 'Not a sound was to be heard.', '音は「聞かれる」側なので to be heard。'],
    ],
    check: [
      'be to＋原形＝予定・義務・可能・運命・意図。',
      '可能は否定＋受け身（not 〜 to be seen / heard）、意図は if 節の中。',
    ],
  }),

  referenceUnit({
    key: 'speech',
    level: 'pre1',
    topic: '話法',
    title: '話法と伝える動詞（tell・warn・deny・be believed）',
    lead: '発言を伝えるときは、内容に合う動詞とその後ろの形を選ぶ。命令は tell＋人＋to、警告は warn＋人＋not to、否定は deny＋動名詞、うわさ・考えは be said / believed to＋原形 などで表す。',
    forms: [
      ['命令を伝える', 'tell ＋ 人 ＋ to ＋ 原形', 'He told me to be careful.', '彼は私に気をつけるように言いました。'],
      ['否定を伝える', 'deny ＋ 動詞ing / having ＋ 過去分詞', 'She denied having copied the confidential file.', '彼女は機密ファイルをコピーしたことを否定しました。'],
    ],
    points: [
      {
        title: '伝える動詞と後ろの形',
        table: [
          ['動詞', '形', '意味'],
          ['tell', 'tell ＋ 人 ＋ to 〜', '〜するように言う'],
          ['ask', 'ask ＋ 人 ＋ to 〜', '〜するように頼む'],
          ['warn', 'warn ＋ 人 ＋ not to 〜', '〜しないよう警告する'],
          ['advise', 'advise ＋ 人 ＋ to 〜', '〜するよう助言する'],
          ['deny', 'deny ＋ 〜ing', '〜したことを否定する'],
          ['admit', 'admit ＋ 〜ing', '〜したことを認める'],
          ['suggest', 'suggest ＋ 〜ing / that 〜', '〜しようと提案する'],
        ],
        examples: [
          ['The officer warned us not to enter the area.', '警察官は私たちにその地域に入らないよう警告しました。'],
          ['The committee denied having revised the proposal publicly.', '委員会は提案を公に修正したことを否定しました。'],
        ],
      },
      {
        title: 'be said / believed to 〜',
        text: [
          'It is believed that 〜（〜と信じられている）は、主語を前に出して S is believed to＋原形 とも言える。伝える内容が前のことなら to have＋過去分詞 にする。',
        ],
        examples: [
          ['The proposal is believed to have reduced waste.', 'その提案はむだを減らしたと考えられています。', { reduced: ['reduce', '減らした（reduce の過去分詞）'] }],
          ['He is said to be the best player on the team.', '彼はチームでいちばんの選手だと言われています。'],
        ],
      },
    ],
    mistakes: [
      ['He told me be careful.', 'He told me to be careful.', 'tell＋人の後ろは to＋原形。'],
      ['She denied to copy the file.', 'She denied copying the file.', 'deny の後ろは動名詞。'],
      ['The officer warned us not enter the area.', 'The officer warned us not to enter the area.', 'warn＋人＋not to＋原形。'],
    ],
    check: [
      'tell / ask / advise＋人＋to 〜、warn＋人＋not to 〜。',
      'deny・admit・suggest の後ろは動名詞。',
      'S is said / believed to 〜。前のことは to have＋過去分詞。',
    ],
  }),

  referenceUnit({
    key: 'partconst',
    level: 'pre1',
    topic: '分詞構文応用',
    title: '分詞構文の応用（Having been 〜・慣用的な分詞構文）',
    lead: '受け身で先に終わったことを表す Having been＋過去分詞 と、generally speaking（一般的に言えば）のような決まった分詞構文を学ぶ。',
    forms: [
      ['受け身＋先のこと', 'Having been ＋ 過去分詞 〜, 主語 ＋ 動詞 ….', 'Having been written in haste, the report had errors.', '急いで書かれたので、その報告書には誤りがありました。'],
      ['決まった言い方', 'Generally speaking, 〜', 'Generally speaking, the new system works well.', '一般的に言えば、新しい仕組みはうまく働いています。'],
    ],
    points: [
      {
        title: 'Having been ＋ 過去分詞',
        text: [
          '主語が「（前に）〜された」ことを表す。Having been はよく省かれ、過去分詞だけで始まることもある（Written in haste, 〜）。',
        ],
        examples: [
          ['Having been warned of the storm, the hikers returned early.', '嵐の警告を受けていたので、ハイカーたちは早めに戻りました。'],
        ],
      },
      {
        title: '主語を気にしない決まった分詞構文',
        table: [
          ['言い方', '意味'],
          ['generally speaking', '一般的に言えば'],
          ['strictly speaking', '厳密に言えば'],
          ['frankly speaking', '率直に言えば'],
          ['judging from 〜', '〜から判断すると'],
          ['considering 〜', '〜を考えると'],
          ['weather permitting', '天気が許せば'],
        ],
        examples: [
          ['Strictly speaking, this is not a new idea.', '厳密に言えば、これは新しい考えではありません。'],
          ['Judging from his face, he must be tired.', '顔つきから判断すると、彼は疲れているにちがいありません。'],
          ['Weather permitting, the event will be held outdoors.', '天気が許せば、その行事は屋外で行われます。'],
          ['Generally speaking, the committee should revise the proposal.', '一般的に言えば、委員会は提案を修正すべきです。'],
        ],
      },
    ],
    mistakes: [
      ['Generally spoken, the system works well.', 'Generally speaking, the system works well.', '決まった言い方は generally speaking。'],
      ['Weather permitted, the event will be held outdoors.', 'Weather permitting, the event will be held outdoors.', '「天気が許せば」は weather permitting。'],
    ],
    check: [
      'Having been＋過去分詞＝（前に）〜されたので。',
      'generally / strictly / frankly speaking、judging from、considering、weather permitting。',
    ],
  }),

  referenceUnit({
    key: 'absolute',
    level: 'pre1',
    topic: '独立分詞構文',
    title: '独立分詞構文（分詞の前に主語を置く）',
    lead: '分詞構文の動作をする人・物が、文の主語とちがうときは、分詞の前にその主語を置く。これを独立分詞構文という。',
    forms: [
      ['形', '名詞 ＋ 分詞 〜, 主語 ＋ 動詞 ….', 'The weather being fine, we went hiking.', '天気がよかったので、私たちはハイキングに行きました。'],
    ],
    points: [
      {
        title: '分詞の前の主語',
        text: [
          'Because the weather was fine, we went hiking. の weather は we とちがうので、分詞構文にしても主語を残して The weather being fine, 〜 とする。There is / are の文は There being 〜 になる。',
        ],
        examples: [
          ['There being no further questions, the meeting ended.', 'それ以上の質問がなかったので、会議は終わりました。'],
          ['The meeting being over, everyone left the room.', '会議が終わったので、全員が部屋を出ました。'],
          ['There being no objections, the committee revised the proposal yesterday.', '反対がなかったので、委員会は昨日提案を修正しました。'],
        ],
      },
      {
        title: '過去分詞の独立分詞構文・決まった言い方',
        text: [
          '分詞の前の名詞が「〜される」側なら過去分詞にする（The data collected, 〜＝データが集められて）。all things considered（すべてを考えると）は決まった言い方。',
        ],
        examples: [
          ['All things considered, the project was a success.', 'すべてを考えると、その計画は成功でした。'],
          ['The data collected, the team began its analysis.', 'データが集まると、チームは分析を始めました。'],
        ],
      },
    ],
    mistakes: [
      ['Being fine, we went hiking.', 'The weather being fine, we went hiking.', '晴れていたのは we ではなく天気なので、主語 the weather を残す。'],
      ['There was no questions, the meeting ended.', 'There being no questions, the meeting ended.', '2つの文をコンマだけでつながず、There being の分詞構文にする。'],
    ],
    check: [
      '分詞の主語が文の主語とちがうときは、分詞の前に主語を置く。',
      'There being 〜、all things considered。',
    ],
  }),

  referenceUnit({
    key: 'with',
    level: 'pre1',
    topic: '付帯状況',
    title: '付帯状況の with（with ＋ 名詞 ＋ 分詞・形容詞）',
    lead: 'with＋名詞＋分詞（形容詞・前置詞句）で「〜を…した状態で・〜が…しながら」と、同時の様子を付け加える。名詞が「する」側なら現在分詞、「される」側なら過去分詞。',
    forms: [
      ['形', '文 ＋ with ＋ 名詞 ＋ 分詞・形容詞・前置詞句', 'He sat there with his eyes closed.', '彼は目を閉じてそこに座っていました。'],
    ],
    points: [
      {
        title: '現在分詞か過去分詞か',
        text: [
          '名詞と分詞の関係を考える。「エンジンがかかっている（動いている）」なら running、「腕が組まれている」なら folded。',
        ],
        table: [
          ['形', '意味'],
          ['with the engine running', 'エンジンをかけたまま'],
          ['with her arms folded', '腕を組んで'],
          ['with the door left open', 'ドアを開けたままで'],
          ['with a book in his hand', '本を手に持って'],
        ],
        examples: [
          ['The driver waited with the engine running.', '運転手はエンジンをかけたまま待っていました。'],
          ['She stood by the window with her arms folded.', '彼女は腕を組んで窓のそばに立っていました。'],
          ['With the door left open, the room grew cold.', 'ドアが開けっぱなしだったので、部屋は寒くなりました。'],
          ['With the discussion continuing, the committee revised the proposal yesterday.', '話し合いが続く中、委員会は昨日提案を修正しました。'],
        ],
      },
      {
        title: 'with ＋名詞＋形容詞・前置詞句',
        text: [
          '分詞のほか、形容詞や前置詞句も置ける（with the window open＝窓を開けたまま、with a book in his hand＝本を手に持って）。',
        ],
        examples: [
          ['Don’t speak with your mouth full.', '口に物を入れたまま話してはいけません。'],
          ['He walked in with a book in his hand.', '彼は本を手に持って入ってきました。'],
        ],
      },
    ],
    mistakes: [
      ['She stood with her arms folding.', 'She stood with her arms folded.', '腕は「組まれた」状態なので過去分詞。'],
      ['He sat there by his eyes closed.', 'He sat there with his eyes closed.', '付帯状況は with を使う。'],
    ],
    check: [
      'with＋名詞＋分詞＝〜を…した状態で・〜が…しながら。',
      '名詞が「する」側なら現在分詞、「される」側なら過去分詞。',
    ],
  }),

  referenceUnit({
    key: 'chainrel',
    level: 'pre1',
    topic: '連鎖関係詞',
    title: '連鎖関係詞（who I think 〜）',
    lead: '関係代名詞のすぐ後ろに I think・we believe などがはさまる形。はさまった部分を取りのぞいて、関係代名詞が後ろの文で主語か目的語かを確かめる。',
    forms: [
      ['形', '先行詞 ＋ 関係代名詞 ＋ (I think など) ＋ 動詞 〜', 'She is the person who I think can solve the problem.', '彼女はその問題を解決できると私が思う人です。'],
    ],
    points: [
      {
        title: 'はさまった部分を取りのぞく',
        text: [
          'the man who [I thought] was honest → the man who was honest。はさまった I thought を取ると、who の後ろにすぐ動詞 was が続くので、who は主語（主格）。',
          'the candidate whom [I believe] the committee will select → whom の後ろは主語＋動詞で、select の目的語が欠けているので目的格。',
        ],
        examples: [
          ['The man who I thought was honest lied to me.', '正直だと思っていた男性は私にうそをつきました。'],
          ['This is the candidate whom I believe the committee will select.', 'これは委員会が選ぶだろうと私が思う候補者です。'],
          ['This is a student who we believe can revise the proposal.', 'これは提案を修正できると私たちが考えている生徒です。'],
        ],
      },
      {
        title: '疑問文 Who do you think 〜? も同じ考え方',
        text: [
          'Who do you think will win?（だれが勝つと思いますか）の who も、do you think を取ると Who will win? となり、主語だと分かる。連鎖関係詞と同じように、はさまった部分を取って読む。',
        ],
        examples: [
          ['Who do you think will win the game?', 'だれが試合に勝つと思いますか。'],
          ['This is the method that experts say is most reliable.', 'これは専門家が最も信頼できると言う方法です。'],
        ],
      },
    ],
    mistakes: [
      ['The man whom I thought was honest lied.', 'The man who I thought was honest lied.', 'I thought を取ると who was honest。主格なので who。'],
    ],
    check: [
      'I think などをはさんでも、取りのぞいた形で主格か目的格かを決める。',
      '後ろにすぐ動詞 → 主格 who、後ろに主語＋動詞で目的語が欠ける → 目的格。',
    ],
  }),

  referenceUnit({
    key: 'compound',
    level: 'pre1',
    topic: '複合関係詞',
    title: '複合関係詞（whoever / whatever / whichever / however / wherever）',
    lead: 'who・what などに -ever が付いた語は、「〜する人はだれでも（名詞のまとまり）」と「だれが〜しても（譲歩）」の2つの働きをする。',
    forms: [
      ['〜する人はだれでも', 'Whoever ＋ 動詞 〜 ＋ 動詞 ….', 'Whoever comes will be welcome.', '来る人はだれでも歓迎されます。'],
      ['どこへ〜しても', 'Wherever ＋ 主語 ＋ 動詞 〜, ….', 'Wherever you go, I will follow you.', 'あなたがどこへ行っても、私はついていきます。'],
    ],
    points: [
      {
        title: '2つの働き',
        table: [
          ['語', '名詞のまとまり', '譲歩（〜しても）'],
          ['whoever', '〜する人はだれでも（anyone who）', 'だれが〜しても'],
          ['whatever', '〜するものは何でも（anything that）', '何が（を）〜しても'],
          ['whichever', '〜するものはどれでも', 'どれを〜しても'],
          ['however', '―', 'どんなに〜しても（however＋形容詞・副詞）'],
          ['wherever / whenever', '―', 'どこへ（いつ）〜しても'],
        ],
        examples: [
          ['Whoever needs the data may download it.', 'そのデータが必要な人はだれでもダウンロードしてかまいません。'],
          ['Whichever route you take, allow at least two hours.', 'どちらの道を通っても、少なくとも2時間はみておきなさい。'],
          ['However carefully the device is tested, some risk remains.', 'どんなに注意深く装置を試験しても、いくらか危険は残ります。'],
          ['Whatever method the committee chooses, it must revise the proposal.', '委員会がどの方法を選ぶにしても、提案を修正しなければなりません。'],
        ],
      },
      {
        title: 'whoever と whomever',
        text: [
          '-ever の語も、後ろの文の中で主語なら whoever、目的語なら whomever にする（話し言葉では whoever で代用することが多い）。',
        ],
        examples: [
          ['Give the ticket to whoever wants it.', 'ほしい人ならだれにでもチケットをあげてください。'],
        ],
      },
    ],
    rewrites: [
      ['However difficult the task is, we will continue.', 'No matter how difficult the task is, we will continue.', '譲歩の however は no matter how で言いかえられる（whatever は no matter what）。'],
    ],
    mistakes: [
      ['However it is difficult, we will continue.', 'However difficult it is, we will continue.', 'however の直後に形容詞・副詞を置く。'],
      ['Whomever comes will be welcome.', 'Whoever comes will be welcome.', 'comes の主語なので whoever。'],
    ],
    check: [
      'whoever＝anyone who、whatever＝anything that（名詞のまとまり）。',
      '譲歩の -ever＝no matter 〜。however＋形容詞・副詞の語順。',
    ],
  }),

  referenceUnit({
    key: 'whatever',
    level: 'pre1',
    topic: 'whatever等',
    title: 'whatever など（何が起ころうとも・何でも）',
    lead: 'whatever は「〜するものは何でも」と「何が〜しようとも」の意味で使う。Whatever happens（何が起ころうとも）、Whatever the cost may be（費用が何であれ）のような言い方を身につける。',
    forms: [
      ['何が〜しようとも', 'Whatever ＋ (主語) ＋ 動詞 〜, ….', 'Whatever happens, I will support you.', '何が起ころうとも、あなたを支えます。'],
      ['〜するものは何でも', '動詞 ＋ whatever ＋ 主語 ＋ 動詞 〜', 'Feel free to order whatever you like from the menu tonight.', '今夜はメニューから何でも好きなものを注文してください。'],
    ],
    points: [
      {
        title: 'may をふくむ譲歩・名詞を修飾する whatever',
        text: [
          'Whatever may happen（何が起ころうとも）のように may を使うと、かたい言い方になる。Whatever the result may be（結果がどうであれ）の may be は省くこともある。whatever＋名詞 は「どんな〜でも」。',
        ],
        examples: [
          ['Whatever may happen, we must remain calm.', '何が起ころうとも、私たちは落ち着いていなければなりません。'],
          ['Whatever the cost may be, safety comes first.', '費用がいくらかかろうとも、安全が第一です。'],
          ['Whatever the result may be, we will publish the data.', '結果がどうであれ、私たちはそのデータを公表します。'],
        ],
      },
      {
        title: 'ほかの -ever との区別',
        text: [
          '人なら whoever、物・事なら whatever、選ぶものが決まっているなら whichever、場所は wherever、時は whenever、程度（どんなに）は however を使う。',
        ],
        examples: [
          ['You can come whenever you like.', '好きなときにいつでも来ていいですよ。'],
        ],
      },
    ],
    mistakes: [
      ['However happens, I will support you.', 'Whatever happens, I will support you.', '「何が起ころうとも」は whatever（however は「どんなに」）。'],
      ['Feel free to order wherever you like.', 'Feel free to order whatever you like.', '注文する「もの」なので whatever。'],
    ],
    check: [
      'whatever＝何が〜しようとも・〜するものは何でも。',
      'whatever＋名詞＝どんな〜でも。人 whoever・場所 wherever・時 whenever。',
    ],
  }),

  referenceUnit({
    key: 'nounclause',
    level: 'pre1',
    topic: '名詞節',
    title: '名詞節（that / what / whether の見分け方）',
    lead: '名詞のまとまりを作る that・what・whether を見分ける。後ろの文が欠けていなければ that（〜ということ）か whether（〜かどうか）、名詞が欠けていれば what（〜するもの・こと）。',
    forms: [
      ['同格の that', '名詞 ＋ that ＋ 完全な文', 'The fact that he lied shocked us.', '彼がうそをついたという事実は私たちに衝撃を与えました。'],
      ['what', 'What ＋ 名詞が欠けた文 〜', 'What matters most is whether the evidence is reliable.', 'いちばん大切なのは、証拠が信頼できるかどうかです。'],
    ],
    points: [
      {
        title: '3つの見分け方',
        table: [
          ['語', '後ろの文', '意味'],
          ['that', '欠けていない（完全）', '〜ということ（内容が決まっている）'],
          ['whether / if', '欠けていない（完全）', '〜かどうか（2つのうち決まっていない）'],
          ['what', '名詞（主語・目的語）が欠けている', '〜するもの・こと'],
        ],
        examples: [
          ['There is a possibility that the schedule will change.', '予定が変わる可能性があります。'],
          ['The assumption that remote work increases productivity is now questioned.', '在宅勤務が生産性を高めるという前提は、今では疑問視されています。'],
        ],
      },
      {
        title: 'whether と if の使い分け',
        text: [
          '「〜かどうか」は whether も if も使えるが、文の主語・前置詞の後ろ・to 不定詞の前・or not の直前では whether を使う。',
        ],
        table: [
          ['置く場所', '使える語'],
          ['文の主語', 'whether'],
          ['前置詞の後ろ', 'whether'],
          ['whether to 〜', 'whether'],
          ['動詞の目的語', 'whether・if'],
        ],
        examples: [
          ['It depends on whether we have enough time.', 'それは十分な時間があるかどうかしだいです。'],
          ['I can’t decide whether to go or not.', '行くかどうか決められません。'],
        ],
      },
    ],
    mistakes: [
      ['The fact what he lied shocked us.', 'The fact that he lied shocked us.', '後ろの文（he lied）が欠けていないので that。'],
      ['That matters most is the evidence.', 'What matters most is the evidence.', 'matters の主語が欠けているので what。'],
    ],
    check: [
      '後ろが完全な文 → that（内容）か whether（かどうか）。',
      '後ろで名詞が欠けている → what。',
    ],
  }),

  referenceUnit({
    key: 'apposition',
    level: 'pre1',
    topic: '同格',
    title: '同格（名詞 ＋ that 〜・名詞, 名詞）',
    lead: 'fact・news・idea・belief などの名詞の直後に that＋完全な文 を置くと、その名詞の中身（〜という事実・知らせ・考え）を説明する。これを同格の that という。',
    forms: [
      ['形', '名詞 ＋ that ＋ 主語 ＋ 動詞 〜（完全な文）', 'There is no doubt that he is guilty.', '彼が有罪であることは疑いありません。'],
    ],
    points: [
      {
        title: '同格の that と関係代名詞の that',
        text: [
          '同格の that の後ろは欠けていない文。関係代名詞の that の後ろは主語か目的語が欠けている。',
        ],
        table: [
          ['文', 'that の種類'],
          ['The news that the factory would close shocked the town.', '同格（欠けていない）'],
          ['The news that he told me was surprising.', '関係代名詞（told の目的語が欠けている）'],
        ],
        examples: [
          ['The news that the factory would close shocked the town.', '工場が閉鎖されるという知らせは町に衝撃を与えました。'],
          ['His belief that everyone deserves a second chance guided his decision.', 'だれにでもやり直す機会があるべきだという信念が、彼の決断を導きました。'],
        ],
      },
      {
        title: 'よく同格の that をとる名詞',
        table: [
          ['名詞', '意味'],
          ['fact / news', '事実・知らせ'],
          ['idea / belief / thought', '考え・信念'],
          ['possibility / chance', '可能性・見込み'],
          ['doubt / fear / hope', '疑い・おそれ・希望'],
          ['claim / assumption', '主張・前提'],
        ],
        examples: [
          ['The fact that the committee may revise the proposal deserves attention.', '委員会が提案を修正するかもしれないという事実は注目に値します。'],
        ],
      },
      {
        title: 'コンマではさむ同格',
        text: [
          '名詞の後ろにコンマではさんで別の名詞を置くと、「〜、つまり…」と説明を付け足せる。',
        ],
        examples: [
          ['Marie Curie, a pioneering scientist, won two Nobel Prizes.', '先駆的な科学者であるマリー・キュリーは、ノーベル賞を2度受賞しました。'],
        ],
      },
    ],
    mistakes: [
      ['The news which the factory would close shocked us.', 'The news that the factory would close shocked us.', '後ろの文が欠けていないので同格の that。which は使えない。'],
    ],
    check: [
      '名詞＋that＋完全な文＝〜という（名詞）。',
      '後ろが欠けていれば関係代名詞、欠けていなければ同格。',
    ],
  }),

  referenceUnit({
    key: 'concession',
    level: 'pre1',
    topic: '譲歩',
    title: '譲歩（however＋形容詞・形容詞＋as＋主語・whether 〜 or not）',
    lead: '「どんなに〜でも」「〜ではあるけれども」「〜であろうとなかろうと」のように、予想に反することを認めながら話を続ける言い方を学ぶ。',
    forms: [
      ['どんなに〜でも', 'However ＋ 形容詞・副詞 ＋ 主語 ＋ 動詞 〜, ….', 'However rich he is, he is never happy.', '彼はどんなにお金持ちでも、決して幸せではありません。'],
      ['〜ではあるけれども', '形容詞・副詞 ＋ as ＋ 主語 ＋ 動詞 〜, ….', 'Tired as she was, she kept working.', '疲れてはいたけれど、彼女は働き続けました。'],
    ],
    points: [
      {
        title: '譲歩の言い方',
        table: [
          ['言い方', '意味'],
          ['although / though / even though', '〜だけれども（事実）'],
          ['even if', 'たとえ〜でも（仮定）'],
          ['however ＋ 形容詞・副詞 ＝ no matter how', 'どんなに〜でも'],
          ['形容詞・副詞・名詞 ＋ as ＋ 主語 ＋ 動詞', '〜ではあるけれども'],
          ['much as ＋ 主語 ＋ 動詞', '大いに〜するけれども'],
          ['whether A or not', 'Aであろうとなかろうと'],
          ['while', '〜である一方で'],
        ],
        examples: [
          ['No matter how carefully you plan, problems may arise.', 'どんなに注意深く計画しても、問題は起こりうるものです。'],
          ['Much as I respect her, I cannot accept this proposal.', '彼女を大いに尊敬してはいるけれど、この提案は受け入れられません。'],
          ['Whether you agree or not, the decision has been made.', 'あなたが賛成しようとしまいと、決定はもう下されました。'],
          ['Tight as the schedule was, the team met every deadline.', '予定はきつかったけれど、チームはすべての締め切りを守りました。'],
        ],
      },
      {
        title: 'although と but を重ねない',
        text: [
          'although（though）のまとまりと、but で始まる文を1つの文で重ねない。どちらか一方を使う。',
        ],
        examples: [
          ['Although the sample was small, the pattern was clear.', '標本は少なかったけれど、傾向ははっきりしていました。'],
        ],
      },
    ],
    mistakes: [
      ['However he is rich, he is never happy.', 'However rich he is, he is never happy.', 'however の直後に形容詞・副詞を置く。'],
      ['As tired she was, she kept working.', 'Tired as she was, she kept working.', '「〜ではあるけれども」は 形容詞＋as＋主語＋動詞 の順。'],
      ['Although the sample was small, but the pattern was clear.', 'Although the sample was small, the pattern was clear.', 'although と but を重ねない。'],
    ],
    check: [
      'however＋形容詞・副詞＋主語＋動詞＝どんなに〜でも（no matter how）。',
      '形容詞＋as＋主語＋動詞＝〜ではあるけれども。much as＝大いに〜するけれど。',
      'whether A or not＝Aであろうとなかろうと。',
    ],
  }),

  referenceUnit({
    key: 'inversion',
    level: 'pre1',
    topic: '倒置',
    title: '倒置（否定の語句・Only・Hardly 〜 when・No sooner 〜 than）',
    lead: 'Never・Little・Seldom・Under no circumstances などの否定の語句や、Only＋語句を文の最初に出すと、その後ろは「助動詞＋主語＋動詞」の順になる。Hardly 〜 when・No sooner 〜 than は「〜するとすぐに」の決まった形。',
    forms: [
      ['否定の語句', '否定の語句 ＋ 助動詞 ＋ 主語 ＋ 動詞 〜.', 'Little did he know that danger was near.', '危険が迫っていることを、彼は少しも知りませんでした。'],
      ['〜するとすぐに', 'Hardly had ＋ 主語 ＋ 過去分詞 〜 when ＋ 過去の文.', 'Hardly had I arrived when it began to rain.', '私が着くとすぐに雨が降り始めました。'],
    ],
    points: [
      {
        title: '倒置を引き起こす語句',
        table: [
          ['語句', '意味'],
          ['Never / Seldom / Rarely', '決して〜ない／めったに〜ない'],
          ['Little', '少しも〜ない'],
          ['Not only 〜', '〜だけでなく'],
          ['Under no circumstances', 'どんなことがあっても〜ない'],
          ['Only ＋ 副詞（句・節）', '〜して初めて・〜によってのみ'],
          ['Not until 〜', '〜して初めて'],
        ],
        examples: [
          ['Never have I seen such a sight.', 'こんな光景は見たことがありません。'],
          ['Never has the committee revised a proposal so quickly.', '委員会がこれほど速く提案を修正したことはありません。'],
          ['Seldom is he late for school.', '彼はめったに学校に遅刻しません。'],
          ['Rarely do we encounter such careful research.', 'これほど注意深い研究にはめったに出会いません。'],
          ['Under no circumstances should you reveal this password.', 'どんなことがあってもこのパスワードを明かしてはいけません。'],
          ['Only by working together can we solve the problem.', '協力することによってのみ、私たちはその問題を解決できます。'],
          ['Not until midnight did the noise stop.', '真夜中になってやっと物音がやみました。'],
        ],
      },
      {
        title: '「〜するとすぐに」の形',
        text: [
          'Hardly（Scarcely）had＋主語＋過去分詞 〜 when（before）＋過去の文、No sooner had＋主語＋過去分詞 〜 than＋過去の文 で「〜するとすぐに…した」。hardly は when、no sooner は than と組む。',
        ],
        examples: [
          ['No sooner had the speech ended than questions began.', '演説が終わるとすぐに質問が始まりました。'],
          ['Hardly had the meeting begun when the alarm rang.', '会議が始まるとすぐに警報が鳴りました。'],
        ],
      },
      {
        title: 'Not only を前に出すとき',
        text: [
          'Not only を文の最初に出すと、その後ろのまとまりだけが倒置になる（Not only was he late, but he was also rude.）。',
        ],
        examples: [
          ['Not only was he late, but he was also rude.', '彼は遅れただけでなく、失礼でもありました。'],
        ],
      },
    ],
    mistakes: [
      ['Never I have seen such a sight.', 'Never have I seen such a sight.', '否定の語句を前に出したら「助動詞＋主語」。'],
      ['No sooner had the speech ended when questions began.', 'No sooner had the speech ended than questions began.', 'no sooner は than と組む。'],
      ['Little he knew that danger was near.', 'Little did he know that danger was near.', 'Little を前に出したら did＋主語＋原形。'],
    ],
    check: [
      '否定の語句・Only 〜・Not until 〜 を前に出すと「助動詞＋主語＋動詞」。',
      'Hardly had 〜 when …、No sooner had 〜 than …＝〜するとすぐに。',
    ],
  }),

  referenceUnit({
    key: 'emphasis',
    level: 'pre1',
    topic: '強調',
    title: '強調（It is not until 〜 that・It is because 〜 that・do の強調）',
    lead: '強調構文 It is 〜 that … を使った「〜して初めて…」（It is not until 〜 that …）や、理由を強める It is because 〜 that … を学ぶ。動詞の前の do / does / did も確かめる。',
    forms: [
      ['〜して初めて…', 'It is / was not until 〜 that ＋ 主語 ＋ 動詞 ….', 'It was not until noon that he woke up.', '彼は昼になってやっと目を覚ましました。'],
      ['理由を強める', 'It is because 〜 that ….', 'It is because the data are incomplete that we need another study.', 'もう1つ研究が必要なのは、データが不完全だからです。'],
    ],
    points: [
      {
        title: 'It is not until 〜 that …',
        text: [
          '「〜まで…しなかった」を強調構文にした形で、「〜して初めて…した」と訳す。Not until 〜 did … の倒置でも同じ意味を表せる。',
        ],
        table: [
          ['言い方', '文'],
          ['ふつうの文', 'He did not wake up until noon.'],
          ['強調構文', 'It was not until noon that he woke up.'],
          ['倒置', 'Not until noon did he wake up.'],
        ],
      },
      {
        title: '動詞を強める do・does・did',
        text: [
          '肯定文の一般動詞の前に do / does / did を置くと「本当に〜する」と強まる。indeed（本当に）と一緒に使うこともある。',
        ],
        examples: [
          ['I do appreciate your patience.', 'あなたのがまん強さに本当に感謝しています。'],
          ['The committee indeed did revise the proposal.', '委員会は実際に提案を修正しました。'],
        ],
      },
    ],
    mistakes: [
      ['It was not until noon when he woke up.', 'It was not until noon that he woke up.', 'It is not until 〜 の後ろは that。'],
      ['It is because the data are incomplete why we need a study.', 'It is because the data are incomplete that we need a study.', '強調構文では that を使う。'],
    ],
    check: [
      'It is not until 〜 that …＝〜して初めて…（＝Not until 〜 did …）。',
      'It is because 〜 that …＝…なのは〜だからだ。',
      'do / does / did＋原形で動詞を強める。',
    ],
  }),

  referenceUnit({
    key: 'ellipsis',
    level: 'pre1',
    topic: '省略',
    title: '省略（if necessary・when in doubt・if any）',
    lead: '時・条件・譲歩を表す when・if・though などのまとまりで、主語が文の主語と同じ（または it）で be動詞があるとき、「主語＋be動詞」を省くことが多い。',
    forms: [
      ['形', 'when / if / though ＋ (主語 ＋ be動詞) ＋ 形容詞・分詞など', 'Call me if necessary.', '必要なら電話してください。'],
    ],
    points: [
      {
        title: '主語＋be動詞の省略',
        text: [
          'if (it is) necessary、when (you are) in doubt、though (she was) disappointed のように、主語と be動詞が省かれる。省いた語を補って意味をとる。',
        ],
        examples: [
          ['When in doubt, check the original source.', '迷ったら、もとの資料を確かめなさい。'],
          ['Though disappointed by the result, she continued the study.', '結果にがっかりはしたものの、彼女は研究を続けました。'],
          ['If necessary, the committee will revise the proposal again after consultation.', '必要なら、委員会は相談のうえで提案を再び修正します。'],
        ],
      },
      {
        title: 'if any・if ever・if possible',
        table: [
          ['言い方', '意味'],
          ['if possible', 'できれば'],
          ['if necessary', '必要なら'],
          ['if any', '（あるとしても）ほとんどない'],
          ['if ever', '（するとしても）めったにない'],
        ],
        examples: [
          ['There are few errors, if any.', '誤りは、あるとしてもほとんどありません。'],
          ['He seldom, if ever, goes out.', '彼は外出することがあるとしても、めったにありません。'],
        ],
      },
    ],
    mistakes: [
      ['Call me if it necessary.', 'Call me if necessary.', '省くなら it と is の両方を省く（if it is necessary / if necessary）。'],
      ['When in doubted, check the source.', 'When in doubt, check the source.', 'in doubt（迷って）のまとまり。'],
    ],
    check: [
      'when / if / though の後ろで「主語＋be動詞」が省かれる。',
      'if possible・if necessary・if any・if ever。',
    ],
  }),

  referenceUnit({
    key: 'agreement',
    level: 'pre1',
    topic: '一致',
    title: '主語と動詞の一致（中心の名詞を見つける）',
    lead: '主語が長いときは、前置詞句（of 〜）や挿入句に惑わされず、中心の名詞に動詞を合わせる。時間・距離・金額のまとまりは単数として扱う。',
    forms: [
      ['形', '中心の名詞 ＋ (of 〜 など) ＋ 動詞', 'One of the workshops is planned for next month.', 'ワークショップの1つは来月に予定されています。'],
    ],
    points: [
      {
        title: '中心の名詞を探す',
        table: [
          ['主語', '中心', '動詞'],
          ['One of the workshops', 'One（単数）', 'is'],
          ['The quality of the sources', 'The quality（単数）', 'is'],
          ['Neither explanation', 'explanation（単数）', 'is'],
          ['The teacher, along with the students,', 'The teacher（単数）', 'was'],
        ],
        examples: [
          ['Neither explanation is convincing.', 'どちらの説明も納得できるものではありません。'],
          ['One of the reviews is expected to help the committee revise the proposal.', '批評の1つが委員会の提案修正に役立つと見込まれています。'],
          ['The teacher, along with the students, was interviewed.', '生徒たちとともに先生も取材を受けました。'],
        ],
      },
      {
        title: 'まとまりとして見る量',
        text: [
          'Ten years（10年）・Five kilometers（5キロ）・Twenty dollars（20ドル）のような時間・距離・金額は、1つのまとまりと考えて単数動詞を使う。',
        ],
        examples: [
          ['Ten years is a long time to wait.', '10年は待つには長い時間です。'],
        ],
      },
    ],
    mistakes: [
      ['One of the workshops are planned.', 'One of the workshops is planned.', '中心は One（単数）なので is。'],
      ['The quality of the sources are important.', 'The quality of the sources is important.', '中心は quality（単数）。'],
    ],
    check: [
      'of 〜 や挿入句を飛ばして、中心の名詞に動詞を合わせる。',
      'along with・as well as は主語の数を増やさない。',
      '時間・距離・金額のまとまりは単数。',
    ],
  }),

  referenceUnit({
    key: 'comparison',
    level: 'pre1',
    topic: '比較構文',
    title: '比較構文（no fewer than・not so much A as B）',
    lead: '比較の形を使った決まった言い方を、数量の多い・少ないの気持ちや、「AよりむしろB」の論理から読み取る。',
    forms: [
      ['〜も（多い）', 'no fewer than ＋ 数（数えられる名詞）', 'No fewer than fifty people attended the lecture.', '50人もの人がその講義に出席しました。'],
      ['AというよりむしろB', 'not so much A as B', 'She is not so much angry as disappointed.', '彼女は怒っているというよりむしろがっかりしています。'],
    ],
    points: [
      {
        title: '数量の決まった言い方',
        table: [
          ['言い方', '意味'],
          ['no fewer than ＋ 数', '〜も（多いという気持ち・数えられる名詞）'],
          ['no less than ＋ 量', '〜も（多いという気持ち）'],
          ['no more than ＋ 数量', 'たった〜しか（少ないという気持ち）'],
          ['not more than ＋ 数量', '多くても〜'],
          ['not less than ＋ 数量', '少なくとも〜'],
        ],
        examples: [
          ['The trip cost no more than 5,000 yen.', 'その旅行はたった5,000円しかかかりませんでした。'],
        ],
      },
      {
        title: 'the 比較級, the 比較級・not so much A as B',
        text: [
          'The sooner, the better.（早ければ早いほどよい）のように、the＋比較級 を2つ並べて比例を表す。not so much A as B は「AというよりむしろB」で、A を完全に打ち消すとは限らない。',
        ],
        examples: [
          ['The sooner we leave, the better.', '早く出発すればするほどよいです。'],
          ['The issue is not so much cost as fairness.', '問題は費用というよりむしろ公平さです。'],
        ],
      },
      {
        title: '比較の形をふくむ語の組み合わせ',
        text: [
          'fall short of 〜（〜に届かない・不足する）のような言い方もまとまりで身につける。',
        ],
        examples: [
          ['The proposal falls short of the required standard.', 'その提案は求められる水準に届いていません。'],
        ],
      },
    ],
    mistakes: [
      ['No less than fifty people attended.', 'No fewer than fifty people attended.', '数えられる名詞（people）には no fewer than が正式。'],
      ['She is not so much angry than disappointed.', 'She is not so much angry as disappointed.', 'not so much A as B。than は使わない。'],
    ],
    check: [
      'no fewer / less than＝〜も（多い）、no more than＝たった〜しか。',
      'not so much A as B＝AというよりむしろB。',
    ],
  }),

  referenceUnit({
    key: 'whale',
    level: 'pre1',
    topic: 'クジラ構文',
    title: 'クジラ構文（A is no more B than C is）',
    lead: 'A whale is no more a fish than a horse is.（クジラが魚でないのは、馬が魚でないのと同じだ）のように、no more 〜 than … で「…が〜でないのと同じように、Aも〜ではない」と強く打ち消す。',
    forms: [
      ['形', 'A is no more B than C is (D).', 'A whale is no more a fish than a horse is.', 'クジラが魚でないのは、馬が魚でないのと同じです。'],
    ],
    points: [
      {
        title: 'than の後ろを先に考える',
        text: [
          'than の後ろ（a horse is a fish＝馬は魚だ）は明らかにまちがい。それと同じくらい、A（クジラは魚だ）もまちがいだ、と言っている。「〜ない」の意味になることに気をつける。',
        ],
        examples: [
          ['A bat is no more a bird than a whale is.', 'コウモリが鳥でないのは、クジラが鳥でないのと同じです。'],
          ['A smartphone is no more a teacher than a calculator is.', 'スマートフォンが先生でないのは、電卓が先生でないのと同じです。'],
          ['In formal reasoning, a rumor is no more evidence than a guess is.', '厳密な推論では、うわさが証拠にならないのは推測が証拠にならないのと同じです。'],
        ],
      },
      {
        title: 'no less 〜 than … は反対の意味',
        text: [
          'A is no less B than C is は「Cと同じようにAもBだ」と、強く肯定する。',
        ],
        examples: [
          ['She is no less talented than her sister is.', '彼女は姉に負けないくらい才能があります。'],
        ],
      },
    ],
    mistakes: [
      ['A whale is no less a fish than a horse is.（魚ではないと言いたい）', 'A whale is no more a fish than a horse is.', '「〜ではない」と打ち消すのは no more 〜 than。'],
    ],
    check: [
      'A is no more B than C is＝CがBでないのと同様、AもBではない。',
      'A is no less B than C is＝CがBであるのと同様、AもBだ。',
    ],
  }),

  referenceUnit({
    key: 'prep',
    level: 'pre1',
    topic: '前置詞',
    title: '前置詞（論説でよく使う組み合わせ）',
    lead: '長文や意見文でよく使う、名詞・形容詞と前置詞の組み合わせ（cast doubt on・be attributable to・be at odds with など）を、前置詞の基本の意味と結びつけて身につける。',
    forms: [
      ['形', '名詞・形容詞 ＋ 決まった前置詞 ＋ 名詞', 'The report casts doubt on the original claim.', 'その報告書はもとの主張に疑問を投げかけています。'],
    ],
    points: [
      {
        title: '前置詞の基本の意味とつなげる',
        table: [
          ['言い方', '意味', '前置詞のイメージ'],
          ['cast doubt on 〜', '〜に疑いを投げかける', 'on＝対象にのしかかる'],
          ['have an impact on 〜', '〜に影響を与える', 'on＝対象にのしかかる'],
          ['be attributable to 〜', '〜が原因である', 'to＝向かう先'],
          ['be subject to 〜', '〜の対象となる', 'to＝向かう先'],
          ['be at odds with 〜', '〜と食い違う', 'with＝相手'],
          ['be consistent with 〜', '〜と一致する', 'with＝相手'],
          ['fall short of 〜', '〜に届かない', 'of＝基準'],
        ],
        examples: [
          ['The result is attributable to several factors.', 'その結果はいくつかの要因によるものです。'],
          ['The two accounts are at odds with each other.', '2つの説明は互いに食い違っています。'],
        ],
      },
      {
        title: '組み合わせから意味を予測する',
        text: [
          '同じ名詞でも、組む動詞や前置詞で意味が決まる（have an impact on 〜＝〜に影響を与える、in response to 〜＝〜に応じて）。まとまりごと身につけ、長文では前置詞から後ろの意味を予測して読む。',
        ],
        examples: [
          ['The new rule is subject to review every year.', '新しい規則は毎年見直しの対象になります。'],
          ['Social media has a strong impact on young people.', 'ソーシャルメディアは若者に強い影響を与えています。'],
          ['The city changed the plan in response to public concern.', '市は人々の不安に応じて計画を変えました。'],
        ],
      },
    ],
    mistakes: [
      ['The report casts doubt to the claim.', 'The report casts doubt on the claim.', 'cast doubt on 〜。'],
      ['The two accounts are at odds to each other.', 'The two accounts are at odds with each other.', 'be at odds with 〜。'],
    ],
    check: [
      'cast doubt on・have an impact on・be attributable to・be subject to。',
      'be at odds with・be consistent with・fall short of。',
    ],
  }),
]
