// 文法の参考書：英検3級（中3程度）。並びは学ぶ順。
import { referenceUnit } from './unit.js'

export const GRAMMAR_REFERENCE_3 = [
  referenceUnit({
    key: 'perfect',
    level: '3',
    topic: '現在完了',
    title: '現在完了（have / has ＋ 過去分詞）',
    lead: '過去のことが今とつながっていることを表す。「ずっと〜している（継続）」「〜したことがある（経験）」「〜したところだ・もう〜した（完了）」の3つの意味がある。',
    forms: [
      ['ふつうの文', '主語 ＋ have / has ＋ 過去分詞 〜.', 'I have lived in Tokyo for ten years.', '私は10年間東京に住んでいます。'],
      ['否定文', '主語 ＋ have / has ＋ not ＋ 過去分詞 〜.', 'He has not come home yet.', '彼はまだ帰ってきていません。'],
      ['疑問文', 'Have / Has ＋ 主語 ＋ 過去分詞 〜?', 'Have you ever been to Hawaii? — No, I haven’t.', 'あなたはハワイに行ったことがありますか。— いいえ、ありません。'],
    ],
    points: [
      {
        title: '継続：ずっと〜している',
        text: [
          '過去に始まった状態が今も続いていることを表す。for＋期間（for ten years＝10年間）、since＋始まった時（since 2020＝2020年から）と一緒に使う。',
          '「どのくらいの間〜していますか」は How long have you 〜? でたずねる。',
        ],
        examples: [
          ['I have known him since 2010.', '私は2010年から彼を知っています。'],
          ['Ken has lived in this town for five years.', 'ケンはこの町に5年間住んでいます。'],
          ['How long have you known Ms. Sato? — For three years.', 'あなたは佐藤先生をどのくらい前から知っていますか。— 3年前からです。'],
          ['She has had a cold since Monday.', '彼女は月曜日からかぜをひいています。'],
        ],
      },
      {
        title: '経験：〜したことがある',
        text: [
          'これまでの経験を表す。once（1回）、twice（2回）、〜 times（〜回）、ever（今までに）、never（一度も〜ない）、before（以前に）と一緒に使う。',
          'have been to 〜 は「〜に行ったことがある」、have gone to 〜 は「〜に行ってしまった（今ここにいない）」で、意味がちがう。',
        ],
        examples: [
          ['She has been to Australia twice.', '彼女はオーストラリアに2回行ったことがあります。'],
          ['Have you ever heard this song before?', '以前にこの歌を聞いたことがありますか。'],
          ['I have never seen such a big dog.', '私はこんなに大きな犬を一度も見たことがありません。'],
          ['Ken has gone to the library, so he is not here.', 'ケンは図書館へ行ってしまったので、ここにはいません。'],
        ],
      },
      {
        title: '完了：〜したところだ・もう〜した',
        text: [
          'just（ちょうど）、already（もう・すでに）と一緒に使う。疑問文・否定文では yet を文の最後に置き、疑問文なら「もう」、否定文なら「まだ（〜ない）」の意味になる。',
        ],
        examples: [
          ['The train has just left.', '電車はちょうど出たところです。'],
          ['I have already finished my homework.', '私はもう宿題を終えました。'],
          ['Have you finished your lunch yet? — No, not yet.', 'もう昼食を食べ終えましたか。— いいえ、まだです。'],
        ],
      },
      {
        title: '過去分詞と、使えない語句',
        text: [
          '規則動詞の過去分詞は過去形と同じ -ed の形。不規則動詞は形を確かめる（go - went - gone、see - saw - seen、write - wrote - written、take - took - taken）。',
          'yesterday・last week・〜 ago・When 〜? のように「過去のいつか」をはっきり示す語句とは、現在完了を使わず過去形を使う。',
        ],
        table: [
          ['原形', '過去形', '過去分詞'],
          ['be', 'was / were', 'been'],
          ['go', 'went', 'gone'],
          ['see', 'saw', 'seen'],
          ['eat', 'ate', 'eaten'],
          ['write', 'wrote', 'written'],
          ['take', 'took', 'taken'],
          ['know', 'knew', 'known'],
          ['hear', 'heard', 'heard'],
        ],
        examples: [
          ['I saw him yesterday.', '私は昨日彼に会いました。'],
          ['I have seen him many times.', '私は彼に何度も会ったことがあります。'],
        ],
      },
    ],
    rewrites: [
      ['My dog died three days ago.', 'My dog has been dead for three days.', '「3日前に死んだ」は「3日間ずっと死んでいる（状態）」と、現在完了の継続で言いかえられる。'],
      ['I have never seen such a big dog.', 'This is the biggest dog that I have ever seen.', '「こんなに〜な物は見たことがない」は「今までに見た中でいちばん〜」と言いかえられる。'],
    ],
    mistakes: [
      ['I have lived here since ten years.', 'I have lived here for ten years.', '期間の長さには for。since は始まった時。'],
      ['I have seen him yesterday.', 'I saw him yesterday.', 'yesterday のような過去のいつかを示す語には過去形。'],
      ['She has went to Kyoto.', 'She has gone to Kyoto.', 'have / has の後ろは過去分詞（go の過去分詞は gone）。'],
    ],
    check: [
      '現在完了＝have / has＋過去分詞。3人称単数は has。',
      '継続（for・since・How long）、経験（ever・never・〜 times）、完了（just・already・yet）。',
      'have been to＝行ったことがある、have gone to＝行ってしまった。',
      'yesterday・〜 ago などには過去形を使う。',
    ],
  }),

  referenceUnit({
    key: 'perfprog',
    level: '3',
    topic: '現在完了進行形',
    title: '現在完了進行形（have / has been ＋ 動詞ing）',
    lead: '少し前から今まで「ずっと〜し続けている」と、動作が続いていることを表す。have / has been の後ろに動詞の ing 形を置く。',
    forms: [
      ['ふつうの文', '主語 ＋ have / has been ＋ 動詞ing 〜.', 'It has been snowing for three hours.', '3時間ずっと雪が降っています。'],
      ['疑問文', 'How long ＋ have / has ＋ 主語 ＋ been ＋ 動詞ing 〜?', 'How long has he been studying Japanese?', '彼はどのくらいの間、日本語を勉強していますか。'],
    ],
    points: [
      {
        title: '動作が今まで続いている',
        text: [
          'wait（待つ）・study（勉強する）・play（する）のような動作を表す動詞で、「今までずっと〜している」と言うときに使う。for＋期間、since＋始まった時と一緒に使うことが多い。',
        ],
        examples: [
          ['I have been waiting for the bus for thirty minutes.', '私は30分間ずっとバスを待っています。'],
          ['Ken has been playing tennis for an hour.', 'ケンは1時間ずっとテニスをしています。'],
          ['They have been talking since this morning.', '彼らは今朝からずっと話しています。'],
        ],
      },
      {
        title: '現在完了（継続）との使い分け',
        text: [
          'know（知っている）・live（住んでいる）・have（持っている）のような状態を表す動詞は、進行形にしないので現在完了の have known を使う。動作を表す動詞は現在完了進行形にすると「ずっと続けている」ことがはっきりする。',
        ],
        table: [
          ['動詞の種類', '「ずっと〜している」', '例'],
          ['状態（know・like・have など）', '現在完了', 'I have known her for years.'],
          ['動作（play・wait・study など）', '現在完了進行形', 'I have been studying for two hours.'],
        ],
      },
    ],
    mistakes: [
      ['He has been study for two hours.', 'He has been studying for two hours.', 'been の後ろは動詞の ing 形。'],
      ['I have been knowing her for years.', 'I have known her for years.', 'know は状態を表す動詞なので、現在完了を使う。'],
      ['How long has he being studying?', 'How long has he been studying?', 'has の後ろは been（be の過去分詞）。'],
    ],
    check: [
      '現在完了進行形＝have / has been＋動詞ing。',
      '動作が今まで続いていることを表す。for・since とよく使う。',
      'know・like などの状態は現在完了（have known）。',
    ],
  }),

  referenceUnit({
    key: 'passive',
    level: '3',
    topic: '受動態',
    title: '受動態（be動詞 ＋ 過去分詞）',
    lead: '「〜される・〜された」と、動作を受ける側を主語にする言い方。be動詞の後ろに過去分詞を置き、だれがしたかは by 〜 で表す。',
    forms: [
      ['今', '主語 ＋ am / is / are ＋ 過去分詞 〜.', 'English is spoken all over the world.', '英語は世界中で話されています。'],
      ['過去', '主語 ＋ was / were ＋ 過去分詞 〜.', 'The room was cleaned yesterday.', 'その部屋は昨日掃除されました。'],
      ['助動詞つき', '主語 ＋ 助動詞 ＋ be ＋ 過去分詞 〜.', 'Stars can be seen at night.', '星は夜に見ることができます。'],
    ],
    points: [
      {
        title: 'ふつうの文を受動態にする',
        text: [
          'ふつうの文（能動態）の目的語を主語にして、動詞を be動詞＋過去分詞にする。もとの主語は by 〜 で表す（だれがしたか分からない・言う必要がないときは省く）。時は be動詞で表す。',
        ],
        table: [
          ['', '文'],
          ['能動態', 'Many people read this book.'],
          ['受動態', 'This book is read by many people.'],
        ],
        examples: [
          ['America was discovered by Columbus.', 'アメリカはコロンブスによって発見されました。'],
          ['The bridge was built by local workers.', 'その橋は地元の作業員によって建てられました。'],
          ['This letter was written in French.', 'この手紙はフランス語で書かれていました。'],
        ],
      },
      {
        title: '否定文・疑問文と、未来・助動詞',
        text: [
          '否定文は be動詞の後ろに not、疑問文は be動詞を主語の前に出す（Was this letter written by Tom?）。',
          '未来は will be＋過去分詞、助動詞をふくむときは「助動詞＋be＋過去分詞」にする（must be finished、can be seen）。',
        ],
        examples: [
          ['Was this letter written by Tom? — Yes, it was.', 'この手紙はトムによって書かれましたか。— はい、そうです。'],
          ['The festival will be held next Sunday.', 'そのお祭りは次の日曜日に開かれます。'],
          ['This work must be finished today.', 'この仕事は今日終えなければなりません。'],
        ],
      },
      {
        title: 'by 以外の前置詞を使う受動態',
        table: [
          ['言い方', '意味'],
          ['be covered with 〜', '〜でおおわれている'],
          ['be filled with 〜', '〜でいっぱいだ'],
          ['be known to 〜', '〜に知られている'],
          ['be interested in 〜', '〜に興味がある'],
          ['be surprised at 〜', '〜に驚く'],
          ['be made of 〜（材料）', '〜でできている（見て分かる材料）'],
          ['be made from 〜（原料）', '〜から作られる（形が変わる原料）'],
          ['be used for 〜', '〜のために使われる'],
        ],
        examples: [
          ['The mountain is covered with snow.', 'その山は雪でおおわれています。'],
          ['This desk is made of wood.', 'この机は木でできています。'],
          ['Cheese is made from milk.', 'チーズは牛乳から作られます。'],
          ['This tool is used for cutting paper.', 'この道具は紙を切るのに使われます。'],
        ],
      },
    ],
    advanced: {
      level: 'pre2',
      title: '受動態の応用（完了形・進行形・to be done・being done）',
      text: [
        '完了形の受動態は have been＋過去分詞、進行形の受動態は be being＋過去分詞。不定詞は to be＋過去分詞、動名詞は being＋過去分詞 で「〜されること」を表す。',
        'laugh at・take care of のような「動詞＋前置詞」は、まとまりのまま受動態にする（be laughed at）。',
      ],
      table: [
        ['形', '例'],
        ['have been ＋ 過去分詞', 'The bridge has been repaired.'],
        ['be being ＋ 過去分詞', 'The road is being repaired.'],
        ['to be ＋ 過去分詞', 'The car needs to be repaired.'],
        ['being ＋ 過去分詞', 'I don’t like being laughed at.'],
      ],
      examples: [
        ['The road is being repaired now.', 'その道路は今、修理されているところです。'],
        ['He was laughed at by everyone.', '彼はみんなに笑われました。'],
      ],
    },
    rewrites: [
      ['Tom wrote this letter.', 'This letter was written by Tom.', '能動態の目的語 this letter を主語にして、wrote を was written にする。'],
      ['My uncle gave me this watch.', 'This watch was given to me by my uncle.', '「人に物を与える」の文は、物を主語にすると to me のように前置詞が入る。'],
    ],
    mistakes: [
      ['This book is reading by many people.', 'This book is read by many people.', '「〜される」は be動詞＋過去分詞。ing 形では「〜している」になる。'],
      ['Stars can seen at night.', 'Stars can be seen at night.', '助動詞をふくむ受動態は「助動詞＋be＋過去分詞」。be を落とさない。'],
      ['The mountain is covered by snow.', 'The mountain is covered with snow.', '「雪でおおわれている」状態は be covered with。'],
    ],
    check: [
      '受動態＝be動詞＋過去分詞。時は be動詞で表す（is / was / will be）。',
      'だれがしたかは by 〜。言う必要がなければ省く。',
      '助動詞つきは「助動詞＋be＋過去分詞」。',
      'be covered with・be made of / from・be known to・be interested in。',
    ],
  }),

  referenceUnit({
    key: 'patterns',
    level: '3',
    topic: '文型(SVOO/SVOC)',
    title: '文の形（SVC・SVOO・SVOC）',
    lead: '英語の文は、主語（S）・動詞（V）の後ろに何が続くかで形が決まる。動詞の後ろに「人＋物」が続く SVOO と、「目的語＋それを説明する語」が続く SVOC を中心に学ぶ。',
    forms: [
      ['SVC', '主語 ＋ look / become / feel など ＋ 補語', 'You look happy.', 'あなたはうれしそうに見えます。'],
      ['SVOO', '主語 ＋ give / show など ＋ 人 ＋ 物', 'He gave me a present.', '彼は私にプレゼントをくれました。'],
      ['SVOC', '主語 ＋ make / call / keep など ＋ 目的語 ＋ 補語', 'The news made me happy.', 'その知らせは私をうれしい気持ちにしました。'],
    ],
    points: [
      {
        title: 'SVC：主語＝補語',
        text: [
          'be動詞のほか、look（〜に見える）・become（〜になる）・feel（〜と感じる）・sound（〜に聞こえる）・get（〜になる）の後ろに、主語の様子を表す形容詞や名詞を置く。主語＝補語の関係になる。',
        ],
        examples: [
          ['The man became an astronaut.', 'その男性は宇宙飛行士になりました。'],
          ['That sounds interesting.', 'それはおもしろそうですね。'],
          ['I felt happy when I heard the news.', 'その知らせを聞いて、私はうれしく感じました。'],
        ],
      },
      {
        title: 'SVOO：人に物を〜する',
        text: [
          'give（与える）・show（見せる）・tell（伝える）・teach（教える）・send（送る）・lend（貸す）・buy（買う）・make（作る）は、動詞の後ろに「人＋物」の順で2つの目的語を置ける。人の前に to や for は付けない。',
          '物のところには how to 〜 や that 〜 のまとまりも置ける（show us how to 〜、tell me that 〜）。',
        ],
        examples: [
          ['Ken gave me a useful map yesterday.', 'ケンは昨日私に役に立つ地図をくれました。'],
          ['He showed me the picture.', '彼は私にその写真を見せてくれました。'],
          ['My teacher showed us how to solve the problem.', '先生は私たちにその問題の解き方を教えてくれました。'],
          ['My brother told me that he would come to the party.', '兄は私にパーティーに来ると言いました。'],
        ],
      },
      {
        title: 'SVOO を「物＋to / for＋人」にする',
        text: [
          '物を先に言うときは「動詞＋物＋to / for＋人」にする。相手に届く動き（give・show・tell・teach・send・lend）は to、相手のためにする動き（buy・make・cook）は for を使う。',
        ],
        table: [
          ['SVOO', '物＋to / for＋人'],
          ['He gave me a pen.', 'He gave a pen to me.'],
          ['She sent me a letter.', 'She sent a letter to me.'],
          ['My mother bought me a bag.', 'My mother bought a bag for me.'],
          ['He made us lunch.', 'He made lunch for us.'],
        ],
      },
      {
        title: 'SVOC：目的語をどうする・どう呼ぶ',
        text: [
          'make＋O＋C（OをCにする）、keep＋O＋C（OをCのままにしておく）、call＋O＋C（OをCと呼ぶ）、name＋O＋C（OをCと名づける）、find＋O＋C（OがCだと分かる）。補語（C）は目的語（O）の様子や名前を説明するので、O＝C の関係になる。',
          '補語には形容詞を使う（make the room bright）。副詞（brightly）は使わない。',
        ],
        examples: [
          ['Please keep the door open.', 'ドアを開けたままにしておいてください。'],
          ['We call our dog Max.', '私たちは犬をマックスと呼んでいます。'],
          ['Ken made the room bright.', 'ケンは部屋を明るくしました。'],
          ['I found the book difficult.', 'その本は難しいと分かりました。'],
        ],
      },
    ],
    rewrites: [
      ['He gave me a present.', 'He gave a present to me.', 'SVOO は「物＋to＋人」に言いかえられる（buy・make は for）。'],
    ],
    mistakes: [
      ['He gave to me a present.', 'He gave me a present.', 'SVOO では人の前に to を置かない。'],
      ['The news made me happily.', 'The news made me happy.', 'SVOC の補語は形容詞。'],
      ['My mother bought a bag to me.', 'My mother bought a bag for me.', 'buy は「相手のために」なので for。'],
    ],
    check: [
      'SVC：look・become・feel・sound＋形容詞・名詞（主語＝補語）。',
      'SVOO：give・show・tell・teach＋人＋物。物を先に言えば to / for＋人。',
      'SVOC：make・keep・call・name・find＋O＋C（O＝C）。補語は形容詞。',
    ],
  }),

  referenceUnit({
    key: 'inf2',
    level: '3',
    topic: '不定詞応用',
    title: '不定詞の応用（It is 〜 to／want 人 to／too 〜 to）',
    lead: '不定詞（to＋動詞の原形）を使った、It is 〜 (for 人) to …（…することは〜だ）、want＋人＋to …（人に…してほしい）、too 〜 to …（〜すぎて…できない）などの形を学ぶ。',
    forms: [
      ['〜することは…だ', 'It is ＋ 形容詞 ＋ (for 人) ＋ to ＋ 原形 〜.', 'It is important to study English every day.', '毎日英語を勉強することは大切です。'],
      ['人に〜してほしい・言う・頼む', 'want / tell / ask ＋ 人 ＋ to ＋ 原形', 'I want you to help me.', 'あなたに手伝ってほしいです。'],
      ['〜すぎて…できない', 'too ＋ 形容詞・副詞 ＋ to ＋ 原形', 'This box is too heavy to carry.', 'この箱は重すぎて運べません。'],
    ],
    points: [
      {
        title: 'It is 〜 (for 人) to …',
        text: [
          '「…することは〜だ」の to … が長いので、主語の位置に it を置き、to … を後ろに回す（この it を形式主語という）。「だれにとって」は to の前に for＋人 で表す。',
        ],
        examples: [
          ['It is fun to travel to new places.', '新しい場所へ旅行することは楽しいです。'],
          ['It is not easy for me to understand English.', '私にとって英語を理解するのは簡単ではありません。'],
        ],
      },
      {
        title: 'want・tell・ask ＋人＋to …',
        text: [
          'want＋人＋to …（人に…してほしい）、tell＋人＋to …（人に…するように言う）、ask＋人＋to …（人に…するように頼む）。advise＋人＋to …（人に…するよう助言する）も同じ形。',
          '「…しないように」は to の前に not を置く（tell＋人＋not to …）。',
        ],
        examples: [
          ['Our teacher told us to go out and enjoy the break.', '先生は私たちに、外に出て休み時間を楽しむように言いました。'],
          ['My father told me not to touch the machine.', '父は私にその機械にさわらないように言いました。'],
          ['My teacher advised me to check the source.', '先生は私に、情報の出どころを確かめるよう助言しました。'],
        ],
      },
      {
        title: 'too 〜 to … と 〜 enough to …',
        text: [
          'too＋形容詞＋to … は「〜すぎて…できない」、形容詞＋enough to … は「…できるほど十分〜だ」。enough は形容詞の後ろに置く。',
        ],
        examples: [
          ['He is old enough to drive.', '彼は車を運転できる年齢です。'],
          ['It was too cold to swim.', '寒すぎて泳げませんでした。'],
        ],
      },
      {
        title: '気持ちの理由と、目的を表す不定詞',
        text: [
          'glad・sad・surprised などの後ろの to … は「…して」という気持ちの理由、動詞の文の後ろの to … は「…するために」という目的を表す。',
        ],
        examples: [
          ['I was glad to hear the news.', 'その知らせを聞いてうれしかったです。'],
          ['Ken went to the library to study for the report.', 'ケンはレポートの勉強をするために図書館へ行きました。'],
        ],
      },
    ],
    rewrites: [
      ['Roy was so busy that he could not eat lunch.', 'Roy was too busy to eat lunch.', '「とても〜なので…できない」は too 〜 to … で言いかえられる。'],
      ['It is important for you to do your best.', 'Doing your best is important for you.', '形式主語の文は、動名詞を主語にして言いかえられる。'],
      ['“Please visit my home,” he said to me.', 'He asked me to visit his home.', '「〜してください」と頼んだことは ask＋人＋to 〜 で伝えられる。'],
    ],
    mistakes: [
      ['I want that you help me.', 'I want you to help me.', '「人に〜してほしい」は want＋人＋to＋原形。'],
      ['He told me not touch it.', 'He told me not to touch it.', '「〜しないように」は not to＋原形。'],
      ['He is enough old to drive.', 'He is old enough to drive.', 'enough は形容詞の後ろ。'],
    ],
    check: [
      'It is 〜 (for 人) to …＝（人が）…することは〜だ。',
      'want / tell / ask＋人＋to …。「…しないように」は not to …。',
      'too 〜 to …＝〜すぎて…できない、〜 enough to …＝…できるほど〜。',
    ],
  }),

  referenceUnit({
    key: 'bareinf',
    level: '3',
    topic: '原形不定詞',
    title: '原形不定詞（make / let / help ＋ 人 ＋ 動詞の原形）',
    lead: 'make・let・help の後ろでは「人＋動詞の原形」の形になり、to を付けない。この to の付かない動詞の原形を原形不定詞という。',
    forms: [
      ['〜させる', 'make ＋ 人 ＋ 原形', 'The teacher made us rewrite the essay.', '先生は私たちに作文を書き直させました。'],
      ['〜させてあげる', 'let ＋ 人 ＋ 原形', 'My mother let me go out.', '母は私が外出するのを許してくれました。'],
      ['〜するのを手伝う', 'help ＋ 人 ＋ 原形', 'I helped my father wash the car.', '私は父が車を洗うのを手伝いました。'],
    ],
    points: [
      {
        title: 'make・let・help の意味のちがい',
        table: [
          ['言い方', '意味'],
          ['make ＋ 人 ＋ 原形', '（いやでも）人に〜させる'],
          ['let ＋ 人 ＋ 原形', '人が〜するのを許す・〜させてあげる'],
          ['help ＋ 人 ＋ 原形', '人が〜するのを手伝う（help＋人＋to 〜 も使える）'],
        ],
        examples: [
          ['The situation made Ken play tennis.', 'その状況のため、ケンはテニスをすることになりました。'],
          ['Will you let me try?', '私にやらせてもらえますか。'],
        ],
      },
      {
        title: '物が主語の make',
        text: [
          'This song makes me feel happy.（この歌を聞くと私はうれしい気持ちになる）のように、物や出来事が主語になることもある。「〜のおかげで・〜のせいで…する」と訳すと自然になる。',
        ],
        examples: [
          ['This song makes me feel happy.', 'この歌を聞くと、うれしい気持ちになります。'],
        ],
      },
    ],
    advanced: {
      level: 'pre2',
      title: '見る・聞くを表す動詞＋人＋原形',
      text: [
        'see・hear・feel などの後ろでも「人＋原形」の形になり、「人が〜するのを見る・聞く」を表す（準2級の使役・知覚で学ぶ）。',
      ],
      examples: [
        ['I heard him sing a song.', '私は彼が歌を歌うのを聞きました。'],
      ],
    },
    mistakes: [
      ['My mother let me to go out.', 'My mother let me go out.', 'let の後ろは「人＋原形」。to を付けない。'],
      ['The teacher made us to rewrite it.', 'The teacher made us rewrite it.', 'make＋人の後ろも原形。'],
    ],
    check: [
      'make＋人＋原形＝させる、let＋人＋原形＝させてあげる、help＋人＋原形＝手伝う。',
      'make・let の後ろでは to を付けない。',
    ],
  }),

  referenceUnit({
    key: 'verbforms',
    level: '3',
    topic: '動詞と不定詞・動名詞',
    title: '動詞の後ろは不定詞か動名詞か',
    lead: '「〜すること」を動詞の後ろに置くとき、to 不定詞にするか動名詞にするかは動詞ごとに決まっている。まとまりで確かめておく。',
    forms: [
      ['動名詞をとる', 'enjoy / finish / stop / avoid など ＋ 動詞ing', 'We avoided visiting the museum on Sunday.', '私たちは日曜日に博物館へ行くのを避けました。'],
      ['不定詞をとる', 'want / decide / hope / promise など ＋ to ＋ 原形', 'He decided to join the team.', '彼はチームに入ることに決めました。'],
    ],
    points: [
      {
        title: '動名詞だけをとる動詞',
        text: [
          '「すでにしていること・していたこと」に目を向ける動詞が多い。',
        ],
        table: [
          ['動詞', '意味'],
          ['enjoy 〜ing', '〜して楽しむ'],
          ['finish 〜ing', '〜し終える'],
          ['stop 〜ing', '〜するのをやめる'],
          ['practice 〜ing', '〜する練習をする'],
          ['keep 〜ing', '〜し続ける'],
          ['avoid 〜ing', '〜するのを避ける'],
          ['mind 〜ing', '〜するのを気にする・いやがる'],
          ['give up 〜ing', '〜するのをあきらめる'],
          ['imagine 〜ing', '〜するのを想像する'],
          ['consider 〜ing', '〜することを考える'],
        ],
        examples: [
          ['Emi finished writing her science report before dinner.', 'エミは夕食前に理科のレポートを書き終えました。'],
          ['Would you mind opening the window?', '窓を開けていただけませんか。'],
          ['He kept talking for an hour.', '彼は1時間話し続けました。'],
        ],
      },
      {
        title: '不定詞だけをとる動詞',
        text: [
          '「これからすること」に目を向ける動詞が多い。',
        ],
        table: [
          ['動詞', '意味'],
          ['want to 〜', '〜したい'],
          ['hope to 〜', '〜することを望む'],
          ['decide to 〜', '〜することに決める'],
          ['plan to 〜', '〜するつもりだ'],
          ['need to 〜', '〜する必要がある'],
          ['promise to 〜', '〜すると約束する'],
          ['expect to 〜', '〜するつもりだ・〜すると思う'],
          ['learn to 〜', '〜できるようになる'],
          ['agree to 〜', '〜することに同意する'],
          ['afford to 〜', '〜する余裕がある'],
        ],
        examples: [
          ['She promised to clean her room.', '彼女は部屋を掃除すると約束しました。'],
          ['I learned to swim last summer.', '私は去年の夏に泳げるようになりました。'],
          ['We can’t afford to buy a new car.', '私たちには新しい車を買う余裕がありません。'],
        ],
      },
      {
        title: 'to が前置詞のときは動名詞',
        text: [
          'look forward to 〜（〜を楽しみに待つ）の to は前置詞なので、後ろには名詞か動名詞を置く。',
        ],
        examples: [
          ['We look forward to hearing from you.', '私たちはあなたからのお便りを楽しみにしています。', { hearing: ['hear', '（hear from 〜 で）〜から便りがある'] }],
        ],
      },
    ],
    advanced: {
      level: 'pre2',
      title: 'どちらもとれるが、意味が変わる動詞',
      text: [
        'remember・forget・stop・try は、後ろが不定詞か動名詞かで意味が変わる。不定詞は「これからすること」、動名詞は「したこと・していること」。',
      ],
      table: [
        ['形', '意味'],
        ['remember to 〜', '（忘れずに）〜する'],
        ['remember 〜ing', '〜したことを覚えている'],
        ['stop to 〜', '〜するために立ち止まる'],
        ['stop 〜ing', '〜するのをやめる'],
        ['try to 〜', '〜しようとする'],
        ['try 〜ing', '試しに〜してみる'],
      ],
      examples: [
        ['Remember to lock the door.', '忘れずにドアに鍵をかけてね。'],
        ['I remember meeting her before.', '私は以前彼女に会ったことを覚えています。'],
      ],
    },
    mistakes: [
      ['I enjoyed to play tennis.', 'I enjoyed playing tennis.', 'enjoy の後ろは動名詞。'],
      ['He decided joining the team.', 'He decided to join the team.', 'decide の後ろは to 不定詞。'],
      ['I look forward to see you.', 'I look forward to seeing you.', 'look forward to の to は前置詞なので、後ろは動名詞。'],
    ],
    check: [
      'enjoy・finish・stop・keep・avoid・mind・give up の後ろは動名詞。',
      'want・hope・decide・plan・need・promise・learn の後ろは to 不定詞。',
      'look forward to 〜ing（to は前置詞）。',
    ],
  }),

  referenceUnit({
    key: 'indirect',
    level: '3',
    topic: '間接疑問',
    title: '間接疑問（疑問詞 ＋ 主語 ＋ 動詞）',
    lead: '疑問詞で始まる疑問文を、I know 〜 や Do you know 〜? などの文の中に入れる形。中に入ると語順は「疑問詞＋主語＋動詞」になり、do・does・did は使わない。',
    forms: [
      ['形', '文 ＋ 疑問詞 ＋ 主語 ＋ 動詞 〜', 'I don’t know who he is.', '私は彼がだれなのか知りません。'],
    ],
    points: [
      {
        title: '語順を「主語＋動詞」に戻す',
        text: [
          'Where is the station? を文の中に入れると where the station is となる。be動詞も助動詞も主語の後ろに戻す。',
        ],
        table: [
          ['疑問文', '文の中に入れた形'],
          ['Who is he?', 'I don’t know who he is.'],
          ['Where is the station?', 'Tell me where the station is.'],
          ['What is this?', 'Do you know what this is?'],
          ['What can I do?', 'I don’t know what I can do.'],
        ],
      },
      {
        title: 'do・does・did は使わず、動詞の形で表す',
        text: [
          '一般動詞の疑問文（When does the train leave?）を中に入れるときは does を消し、動詞に s や ed を付けて時と主語を表す（when the train leaves）。',
        ],
        examples: [
          ['Do you know when the train leaves?', '電車がいつ出るか知っていますか。', { leaves: ['leave', '出発する（leave に s が付いた形）'] }],
          ['Do you know why Ken plays tennis?', 'ケンがなぜテニスをするのか知っていますか。'],
          ['Do you know where she lives?', '彼女がどこに住んでいるか知っていますか。'],
          ['I don’t know what he did last night.', '彼が昨夜何をしたのか知りません。'],
        ],
      },
      {
        title: '文の動詞が過去なら中も過去に',
        text: [
          'I asked 〜 や I didn’t know 〜 のように、文の中心の動詞が過去のときは、中の動詞も過去の形にそろえる（時制の一致）。',
        ],
        examples: [
          ['I asked her how old she was.', '私は彼女に何歳かたずねました。'],
          ['I didn’t know where he lived.', '私は彼がどこに住んでいるのか知りませんでした。'],
        ],
      },
      {
        title: '疑問詞が主語のとき',
        text: [
          'Who broke the window? のように疑問詞が主語のときは、もともと「疑問詞＋動詞」の順なので、そのまま中に入れる（I know who broke the window.）。',
        ],
        examples: [
          ['I know who broke the window.', 'だれが窓を割ったのか知っています。'],
        ],
      },
    ],
    advanced: {
      level: 'pre2',
      title: '疑問詞のない疑問文は if / whether',
      text: [
        'Is he at home? のように疑問詞のない疑問文を中に入れるときは、if または whether（〜かどうか）を使う。',
      ],
      examples: [
        ['I wonder if he is at home.', '彼は家にいるだろうか。', { wonder: ['wonder', '〜だろうかと思う'] }],
      ],
    },
    rewrites: [
      ['I don’t know what I should do.', 'I don’t know what to do.', '「何をすべきか」は疑問詞＋to 不定詞（4級）でも言える。'],
    ],
    mistakes: [
      ['I don’t know who is he.', 'I don’t know who he is.', '文の中に入れたら「主語＋動詞」の順。'],
      ['Do you know where does she live?', 'Do you know where she lives?', 'does を使わず、lives で主語と時を表す。'],
      ['I asked her how old is she.', 'I asked her how old she was.', '語順を戻し、asked に合わせて過去の was にする。'],
    ],
    check: [
      '間接疑問＝疑問詞＋主語＋動詞（疑問文の語順にしない）。',
      'do・does・did は使わず、動詞の形で主語と時を表す。',
      '文の動詞が過去なら、中の動詞も過去。',
    ],
  }),

  referenceUnit({
    key: 'relative',
    level: '3',
    topic: '関係代名詞',
    title: '関係代名詞（who / which / that）',
    lead: '名詞のすぐ後ろに「どんな人・物か」を説明する文をつなぐ語を関係代名詞という。説明される名詞（先行詞）が人なら who、物なら which、どちらにも that を使える。',
    forms: [
      ['主格', '先行詞 ＋ who / which / that ＋ 動詞 〜', 'I have a friend who lives in Canada.', '私にはカナダに住んでいる友達がいます。'],
      ['目的格', '先行詞 ＋ which / that ＋ 主語 ＋ 動詞 〜', 'This is the book which I bought yesterday.', 'これは私が昨日買った本です。'],
    ],
    points: [
      {
        title: '主格：つなぐ文の主語になる',
        text: [
          '関係代名詞の後ろにすぐ動詞が続くときは、関係代名詞がつなぐ文の主語の働きをしている（主格）。人なら who、物なら which、どちらでも that が使える。',
          '動詞は先行詞に合わせる（a friend who lives 〜 の lives）。',
        ],
        examples: [
          ['The woman who teaches us science is from Canada.', '私たちに理科を教えている女性はカナダ出身です。'],
          ['I took a train which goes to Tokyo.', '私は東京行きの電車に乗りました。'],
          ['I know a student who plays tennis very well.', '私はテニスがとても上手な生徒を知っています。'],
        ],
      },
      {
        title: '目的格：つなぐ文の目的語になる',
        text: [
          '関係代名詞の後ろに「主語＋動詞」が続き、動詞の目的語が欠けているときは目的格。物には which・that、人には that（または who・whom）を使う。',
          '目的格の関係代名詞は省くことができる（the book I bought yesterday）。',
        ],
        examples: [
          ['The cake that she made was delicious.', '彼女が作ったケーキはおいしかったです。'],
          ['This is the picture that my uncle painted.', 'これはおじがかいた絵です。'],
          ['This is the mountain I climbed last year.', 'これは私が去年登った山です。'],
          ['The man whom I met was kind.', '私が会った男性は親切でした。'],
        ],
      },
      {
        title: 'that がよく使われるとき',
        text: [
          '先行詞に最上級（the best）・the first・the only・all・every などが付くときは、that がよく使われる。',
        ],
        examples: [
          ['This is the best movie that I have ever seen.', 'これは私が今までに見た中でいちばんよい映画です。'],
        ],
      },
      {
        title: '持ち主を表す whose',
        text: [
          '「その〜が…である」と先行詞の持ち物を説明するときは whose＋名詞 を使う。人にも物にも使える。',
        ],
        examples: [
          ['I have a dog whose name is Pochi.', '私はポチという名前の犬を飼っています。'],
        ],
      },
    ],
    rewrites: [
      ['This letter was written by Tom.', 'This is the letter which Tom wrote.', '受動態の文は、関係代名詞を使って「トムが書いた手紙」と言いかえられる。'],
      ['I have a pen pal living in China.', 'I have a pen pal who lives in China.', '名詞の後ろの ing 形（分詞）のまとまりは、主格の関係代名詞で言いかえられる。'],
    ],
    mistakes: [
      ['I have a friend which lives in Canada.', 'I have a friend who lives in Canada.', '先行詞が人なら who（または that）。'],
      ['This is the book which I bought it yesterday.', 'This is the book which I bought yesterday.', '目的格の関係代名詞の後ろでは、目的語（it）を重ねない。'],
      ['I know a student who play tennis.', 'I know a student who plays tennis.', '主格の関係代名詞の後ろの動詞は先行詞（a student）に合わせる。'],
    ],
    check: [
      '先行詞が人 → who、物 → which、どちらも that。',
      '後ろにすぐ動詞 → 主格、後ろに主語＋動詞 → 目的格（省略できる）。',
      '持ち主を表すのは whose＋名詞。',
    ],
  }),

  referenceUnit({
    key: 'participle',
    level: '3',
    topic: '分詞',
    title: '分詞（〜している…・〜された…）',
    lead: '動詞の ing 形（現在分詞）と過去分詞は、形容詞のように名詞を説明できる。「〜している」なら現在分詞、「〜された」なら過去分詞を使う。',
    forms: [
      ['1語のとき', '分詞 ＋ 名詞', 'Look at the sleeping baby.', '眠っている赤ちゃんを見て。'],
      ['2語以上のとき', '名詞 ＋ 分詞 ＋ 〜', 'The girl standing over there is my sister.', 'あそこに立っている女の子は私の姉です。'],
    ],
    points: [
      {
        title: '現在分詞と過去分詞の使い分け',
        text: [
          '説明される名詞が動作を「している」なら現在分詞（running boy＝走っている少年）、動作を「される」なら過去分詞（a broken window＝割られた窓）。',
        ],
        table: [
          ['形', '意味', '例'],
          ['現在分詞（動詞ing）', '〜している', 'a running boy'],
          ['過去分詞', '〜された・〜されている', 'a broken window'],
        ],
        examples: [
          ['The student playing tennis is my neighbor.', 'テニスをしている生徒は私の近所の人です。'],
          ['I read a book written in easy English.', '私はやさしい英語で書かれた本を読みました。'],
          ['English is a language spoken in many countries.', '英語は多くの国で話されている言語です。'],
        ],
      },
      {
        title: '置く場所：1語なら前、2語以上なら後ろ',
        text: [
          '分詞1語だけなら名詞の前に置く（a sleeping baby）。分詞に語句が付いて2語以上になるときは名詞の後ろに置く（a baby sleeping in the bed）。',
        ],
        examples: [
          ['I ate a boiled egg.', '私はゆで卵を食べました。', { boiled: ['boil', 'ゆでた（boil の過去分詞）'] }],
          ['This is a picture taken by my father.', 'これは父が撮った写真です。'],
        ],
      },
      {
        title: '気持ちを表す分詞',
        text: [
          'surprise（驚かせる）・excite（わくわくさせる）・interest（興味をもたせる）などの分詞は、人が「〜させられた＝〜している気持ち」なら過去分詞、物事が「人を〜させる」なら現在分詞を使う。',
        ],
        table: [
          ['人の気持ち（過去分詞）', '物事の性質（現在分詞）'],
          ['I was surprised.（驚いた）', 'The news was surprising.（驚くべき知らせ）'],
          ['I was excited.（わくわくした）', 'The game was exciting.（わくわくする試合）'],
          ['I am interested in art.（興味がある）', 'This book is interesting.（おもしろい本）'],
        ],
        examples: [
          ['I was surprised at the news.', '私はその知らせに驚きました。'],
        ],
      },
    ],
    rewrites: [
      ['I know that girl. She is talking with Jim.', 'I know the girl talking with Jim.', '2つの文を、分詞のまとまり（talking with Jim）で1つにできる。'],
      ['Tom wrote a letter to me in English.', 'I got a letter written in English from Tom.', '「書かれた手紙」は過去分詞 written のまとまりで名詞を説明できる。'],
    ],
    mistakes: [
      ['The girl stand over there is my sister.', 'The girl standing over there is my sister.', '名詞を説明する「〜している」は現在分詞。'],
      ['I read a book writing in English.', 'I read a book written in English.', '本は「書かれた」ので過去分詞。'],
      ['I was surprising at the news.', 'I was surprised at the news.', '人が驚いた気持ちは過去分詞 surprised。'],
    ],
    check: [
      '「〜している」は現在分詞、「〜された」は過去分詞。',
      '1語なら名詞の前、2語以上なら名詞の後ろ。',
      '人の気持ちは surprised・excited、物事の性質は surprising・exciting。',
    ],
  }),

  referenceUnit({
    key: 'comparison',
    level: '3',
    topic: '比較応用',
    title: '比較の応用（倍数・as 〜 as possible・one of the 最上級）',
    lead: '4級の比較に続いて、「…の2倍〜」「できるだけ〜」「最も〜なものの1つ」「ほかのどの…よりも〜」などの言い方を学ぶ。',
    forms: [
      ['…の〜倍', '倍数 ＋ as ＋ 原級 ＋ as ＋ …', 'This room is twice as large as that one.', 'この部屋はあの部屋の2倍の広さです。'],
      ['できるだけ〜', 'as ＋ 原級 ＋ as possible', 'Come back as soon as possible.', 'できるだけ早く戻ってきて。'],
      ['最も〜なものの1つ', 'one of the ＋ 最上級 ＋ 複数名詞', 'Tokyo is one of the largest cities in the world.', '東京は世界で最も大きな都市の1つです。'],
    ],
    points: [
      {
        title: '倍数の言い方',
        text: [
          '「…の2倍〜」は twice as 〜 as …、「3倍」なら three times as 〜 as …。「半分」は half as 〜 as …。as と as の間は原級（比較級にしない）。',
        ],
        examples: [
          ['The new tower is twice as tall as the old building.', '新しいタワーは古い建物の2倍の高さです。'],
          ['This bridge is three times as long as that one.', 'この橋はあの橋の3倍の長さです。'],
        ],
      },
      {
        title: 'as 〜 as possible・as 〜 as ＋主語＋can',
        text: [
          '「できるだけ〜」は as 〜 as possible、または as 〜 as＋主語＋can（過去なら could）で表す。',
        ],
        examples: [
          ['Please answer as quickly as possible.', 'できるだけ早く答えてください。'],
          ['I ran as fast as I could.', '私はできるだけ速く走りました。'],
        ],
      },
      {
        title: '比較級を強める・同じくらい大切',
        text: [
          '比較級を「ずっと〜」と強めるときは much を比較級の前に置く（very は使わない）。as 〜 as は「同じくらい大切だ」のような意味の比べ方にも使える。',
        ],
        examples: [
          ['This book is much easier than that one.', 'この本はあの本よりずっとやさしいです。'],
          ['Health is as important as money.', '健康はお金と同じくらい大切です。'],
        ],
      },
    ],
    rewrites: [
      ['Mt. Fuji is the highest mountain in Japan.', 'Mt. Fuji is higher than any other mountain in Japan.', '最上級は「比較級＋than any other＋単数名詞」で言いかえられる。'],
      ['Time is the most important of all.', 'Nothing is more important than time.', '「いちばん大切」は「〜より大切なものは何もない」と言いかえられる。'],
      ['His watch is better than mine.', 'My watch is not as good as his.', '比較級の文は、not as 〜 as で主語を入れかえて言いかえられる。'],
    ],
    mistakes: [
      ['This room is twice as larger as that one.', 'This room is twice as large as that one.', 'as と as の間は原級。'],
      ['Tokyo is one of the largest city in the world.', 'Tokyo is one of the largest cities in the world.', 'one of the＋最上級の後ろは複数名詞。'],
      ['This book is very easier than that one.', 'This book is much easier than that one.', '比較級を強めるのは much。'],
    ],
    check: [
      '倍数＋as＋原級＋as（twice・three times・half）。',
      'as 〜 as possible＝as 〜 as＋主語＋can＝できるだけ〜。',
      'one of the＋最上級＋複数名詞。比較級を強めるのは much。',
    ],
  }),

  referenceUnit({
    key: 'conj',
    level: '3',
    topic: '接続詞',
    title: '接続詞（because / although / when / if）',
    lead: '4級の接続詞を使いこなす単元。理由の because と結果の so、逆のことを言う although と but の区別、「時・条件」の中の現在形、I’m sure that 〜 などを確かめる。',
    forms: [
      ['理由', '結果の文 ＋ because ＋ 理由の文', 'I stayed home because it was raining.', '雨が降っていたので、私は家にいました。'],
      ['逆のこと', 'Although ＋ 文, ＋ 文', 'Although it was cold, we went out.', '寒かったけれど、私たちは出かけました。'],
    ],
    points: [
      {
        title: 'because と so、although と but',
        text: [
          'because は理由の前に、so は結果の前に置く。although（though）は「〜だけれども」の前に、but は「しかし」の後ろの文の前に置く。1つの文に although と but を一緒に使わない。',
        ],
        table: [
          ['言い方', '文'],
          ['理由 because', 'I stayed home because it was raining.'],
          ['結果 so', 'It was raining, so I stayed home.'],
          ['譲歩 although', 'Although it was raining, the game continued.'],
          ['しかし but', 'It was raining, but the game continued.'],
        ],
      },
      {
        title: '時・条件の中は、未来のことでも現在形',
        text: [
          'when・before・after・until・as soon as（〜するとすぐに）・if の後ろのまとまりでは、未来のことでも will を使わず現在形にする。',
        ],
        examples: [
          ['I will call you when I get home.', '家に着いたら電話します。'],
          ['I will call you when Ken plays tennis.', 'ケンがテニスをするときに電話します。'],
          ['Let’s start as soon as he comes.', '彼が来たらすぐに始めましょう。'],
        ],
      },
      {
        title: '気持ち＋that 〜',
        text: [
          'I’m sure that 〜（きっと〜だ）、I’m glad that 〜（〜でうれしい）、I’m afraid that 〜（残念ながら〜だと思う）のように、気持ちを表す語の後ろに that＋文を続けられる。that はよく省かれる。',
        ],
        examples: [
          ['I’m sure that many people will live with a robot in the future.', 'きっと将来は多くの人がロボットと暮らすだろうと思います。'],
          ['I’m afraid I can’t come to the party.', '残念ですが、パーティーには行けないと思います。'],
        ],
      },
    ],
    mistakes: [
      ['I will call you when I will get home.', 'I will call you when I get home.', 'when の中は未来のことでも現在形。'],
      ['Although it was raining, but the game continued.', 'Although it was raining, the game continued.', 'although と but を重ねない。'],
      ['I stayed home, so it was raining.', 'I stayed home because it was raining.', '「雨が降っていた」は理由なので because。'],
    ],
    check: [
      'because＋理由、so＋結果。although＋逆のこと（but と重ねない）。',
      'when・if・as soon as の中は未来でも現在形。',
      'I’m sure / glad / afraid (that) 〜。',
    ],
  }),

  referenceUnit({
    key: 'sothat',
    level: '3',
    topic: 'so...that',
    title: 'so 〜 that …（とても〜なので…）',
    lead: 'so＋形容詞・副詞＋that＋文 で「とても〜なので…だ」という結果を表す。so の後ろに程度、that の後ろにその結果を置く。',
    forms: [
      ['形', '主語 ＋ 動詞 ＋ so ＋ 形容詞・副詞 ＋ that ＋ 主語 ＋ 動詞 〜', 'He was so tired that he fell asleep.', '彼はとても疲れていたので、眠ってしまいました。'],
    ],
    points: [
      {
        title: 'so のあとは形容詞・副詞',
        text: [
          'so の後ろには、程度を表す形容詞（tired・heavy）や副詞（quietly・fast）を置く。that の後ろは「その結果どうなったか」。',
        ],
        examples: [
          ['The box was so heavy that I could not lift it.', 'その箱はとても重かったので、持ち上げられませんでした。'],
          ['She spoke so quietly that I could hardly hear her.', '彼女はとても小さな声で話したので、ほとんど聞こえませんでした。'],
          ['Ken was so tired that he could hardly walk yesterday.', 'ケンは昨日とても疲れていたので、ほとんど歩けませんでした。'],
        ],
      },
      {
        title: 'too 〜 to … との言いかえ',
        text: [
          '「とても〜なので…できない」は too 〜 to …（〜すぎて…できない）で言いかえられる。so 〜 that 〜 can’t の文では that の後ろに主語が要るが、too 〜 to では主語を書かない。',
        ],
        examples: [
          ['This box is too heavy to carry.', 'この箱は重すぎて運べません。'],
        ],
      },
    ],
    advanced: {
      level: 'pre2',
      title: 'such 〜 that … と so that（目的）',
      text: [
        '名詞をふくむときは such (a)＋形容詞＋名詞＋that …（とても〜な…なので）を使う。so that ＋主語＋can 〜 は「〜できるように」という目的を表す（準2級で学ぶ）。',
      ],
      examples: [
        ['It was such a nice day that we went out.', 'とてもいい天気だったので、私たちは出かけました。'],
      ],
    },
    rewrites: [
      ['The box was so heavy that I couldn’t carry it.', 'The box was too heavy for me to carry.', 'so 〜 that … can’t は too 〜 (for 人) to … で言いかえられる。to の後ろに目的語 it は置かない。'],
    ],
    mistakes: [
      ['He was very tired that he fell asleep.', 'He was so tired that he fell asleep.', '「とても〜なので」は so 〜 that。very は使わない。'],
      ['The box was too heavy that I couldn’t lift it.', 'The box was so heavy that I couldn’t lift it.', 'that 〜 と組むのは so。too は to 〜 と組む。'],
    ],
    check: [
      'so＋形容詞・副詞＋that＋文＝とても〜なので…。',
      'so 〜 that … can’t＝too 〜 to …。',
    ],
  }),

  referenceUnit({
    key: 'prep',
    level: '3',
    topic: '前置詞',
    title: '前置詞（by / until・during / while・because of）',
    lead: '意味が似ていて取り違えやすい前置詞を区別する。前置詞の後ろには名詞（か動名詞）を置き、「主語＋動詞」の文を続けるときは接続詞を使う。',
    forms: [
      ['形', '前置詞 ＋ 名詞（代名詞・動名詞）', 'Finish your report by Friday.', '金曜日までにレポートを終えなさい。'],
    ],
    points: [
      {
        title: 'by と until',
        text: [
          'by は「〜までに（その時までに一度すればよい）」、until（till）は「〜までずっと（その時まで続ける）」。',
        ],
        examples: [
          ['Ken must return the library book by next Monday.', 'ケンは次の月曜日までに図書館の本を返さなければなりません。'],
          ['I studied until midnight.', '私は夜の12時まで勉強しました。'],
        ],
      },
      {
        title: '前置詞と接続詞：during と while、because of と because',
        text: [
          'during（〜の間に）と because of（〜のために）は前置詞なので後ろは名詞。while（〜する間に）と because（〜なので）は接続詞なので後ろは「主語＋動詞」。',
          'despite と in spite of（〜にもかかわらず）も前置詞で、後ろは名詞。',
        ],
        table: [
          ['前置詞＋名詞', '接続詞＋主語＋動詞'],
          ['during the movie', 'while I was watching the movie'],
          ['because of the rain', 'because it was raining'],
          ['in spite of the rain', 'although it was raining'],
        ],
        examples: [
          ['Nobody spoke during the movie.', '映画の間、だれも話しませんでした。'],
          ['The game was stopped because of the rain.', '雨のために試合は中止されました。'],
          ['We went hiking in spite of the rain.', '雨にもかかわらず、私たちはハイキングに行きました。'],
        ],
      },
      {
        title: 'since と for・場所や動きの前置詞',
        text: [
          'since は「〜以来（始まった時）」、for は「〜の間（長さ）」。場所や動きは through（〜を通って）・over（〜の上を越えて）・around（〜のまわりに）・behind（〜の後ろに）・above / below（〜より上に・下に）などで表す。',
        ],
        examples: [
          ['The train went through a long tunnel.', '電車は長いトンネルを通り抜けました。'],
          ['There is a small garden behind the house.', '家の後ろに小さな庭があります。'],
        ],
      },
      {
        title: '前置詞をふくむ決まった形',
        text: [
          'prevent＋人＋from 〜ing（人が〜するのをさまたげる）のように、動詞と前置詞が組んで形が決まっているものがある。from の後ろは動名詞。',
        ],
        examples: [
          ['The rain prevented us from playing outside.', '雨のせいで私たちは外で遊べませんでした。'],
        ],
      },
    ],
    mistakes: [
      ['Finish your report until Friday.', 'Finish your report by Friday.', '「〜までに」は by。'],
      ['Nobody spoke while the movie.', 'Nobody spoke during the movie.', '名詞 the movie の前は前置詞 during。'],
      ['We went out in spite the rain.', 'We went out in spite of the rain.', 'in spite of で1つの前置詞。of を落とさない。'],
    ],
    check: [
      'by＝までに、until＝までずっと。since＝以来、for＝の間。',
      'during・because of・despite は前置詞（後ろは名詞）、while・because・although は接続詞。',
      'prevent＋人＋from 〜ing。',
    ],
  }),

  referenceUnit({
    key: 'tag',
    level: '3',
    topic: '付加疑問',
    title: '付加疑問（いろいろな文の「〜ですよね」）',
    lead: '4級の付加疑問を、現在完了・助動詞・There is・I am の文にも広げる。文の動詞と同じ種類の語を使い、ふつうの文には否定、否定文には肯定の形を付ける。',
    forms: [
      ['ふつうの文', '〜, ＋ 否定の短縮形 ＋ 代名詞?', 'Ken is your classmate, isn’t he?', 'ケンはあなたの同級生ですよね。'],
      ['否定文', '〜, ＋ 肯定の形 ＋ 代名詞?', 'She is not busy, is she?', '彼女は忙しくないですよね。'],
    ],
    points: [
      {
        title: '文の動詞に合わせる',
        table: [
          ['文', '付加疑問'],
          ['You have seen this movie,', 'haven’t you?'],
          ['You have not seen this movie,', 'have you?'],
          ['She has finished her work,', 'hasn’t she?'],
          ['We should go now,', 'shouldn’t we?'],
          ['You must leave now,', 'mustn’t you?'],
          ['There is a bank near here,', 'isn’t there?'],
          ['They didn’t come,', 'did they?'],
        ],
        examples: [
          ['You have not seen this movie, have you?', 'あなたはこの映画を見ていないですよね。'],
          ['There are many shops here, aren’t there?', 'ここにはたくさん店がありますよね。'],
        ],
      },
      {
        title: '特別な形',
        text: [
          'I am 〜 の付加疑問は aren’t I? になる。命令文には will you?、Let’s 〜 には shall we? を付ける。',
        ],
        examples: [
          ['I’m right, aren’t I?', '私は正しいですよね。'],
          ['Let’s take a break, shall we?', '休憩しましょうか。'],
          ['Don’t be late, will you?', '遅れないでくださいね。'],
        ],
      },
    ],
    mistakes: [
      ['You have seen it, don’t you?', 'You have seen it, haven’t you?', '現在完了の文には have / has を使う。'],
      ['She is not busy, isn’t she?', 'She is not busy, is she?', '否定文には肯定の形を付ける。'],
      ['I’m right, am not I?', 'I’m right, aren’t I?', 'I am の付加疑問は aren’t I。'],
    ],
    check: [
      '文の動詞（be・do・have・助動詞）と同じ種類の語を使う。',
      'ふつうの文→否定、否定文→肯定。主語は代名詞。',
      'I am → aren’t I?、命令文 → will you?、Let’s → shall we?',
    ],
  }),

  referenceUnit({
    key: 'subjunctive',
    level: '3',
    topic: '仮定法(基礎)',
    title: '仮定法の基本（If I were 〜 / I wish 〜）',
    lead: '「もし（今）〜だったら…なのに」のように、今の事実とちがうことを想像して言うときは、動詞を過去形にする。これを仮定法という。過去形でも、表しているのは今のこと。',
    forms: [
      ['もし〜なら…なのに', 'If ＋ 主語 ＋ 過去形 〜, 主語 ＋ would / could ＋ 原形 ….', 'If I knew her number, I would call her.', 'もし彼女の電話番号を知っていたら、電話するのに。'],
      ['〜ならいいのに', 'I wish ＋ 主語 ＋ 過去形 〜.', 'I wish I could play the guitar.', 'ギターがひけたらいいのに。'],
    ],
    points: [
      {
        title: '今の事実とちがうことは過去形で',
        text: [
          '事実：I don’t know her number.（電話番号を知らない）→ 仮定：If I knew her number, I would call her.（知っていたら電話するのに）。If の中を過去形、もう一方を would（〜するだろう）・could（〜できるだろう）＋原形にする。',
        ],
        examples: [
          ['If Ken had more time, he could play tennis.', 'もしケンにもっと時間があれば、テニスができるのに。'],
          ['If you had five million yen, what would you do?', 'もし500万円持っていたら、あなたは何をしますか。'],
        ],
      },
      {
        title: 'be動詞は were',
        text: [
          '仮定法の If の中の be動詞は、主語が I や he でもふつう were を使う（If I were you, 〜＝もし私があなたなら）。',
        ],
        examples: [
          ['If I were a bird, I could fly.', 'もし私が鳥なら、飛べるのに。'],
          ['If I were you, I would ask my best friend to help me.', 'もし私があなたなら、親友に助けを頼むでしょう。'],
        ],
      },
      {
        title: 'I wish ＋過去形',
        text: [
          'I wish の後ろに過去形の文を置くと「（今）〜ならいいのに」という、かなわない願いを表す。can は could にする。',
        ],
        examples: [
          ['I wish I knew my cat’s feelings.', 'ネコの気持ちが分かればいいのに。'],
          ['I wish it were sunny today.', '今日が晴れならいいのに。'],
        ],
      },
      {
        title: 'ふつうの if との区別',
        text: [
          '本当に起こるかもしれないことは、ふつうの if＋現在形（If it rains tomorrow, I will stay home.）。起こりそうにない・事実とちがうことを言うときに仮定法を使う。',
        ],
        table: [
          ['言い方', '気持ち'],
          ['If I have time, I will help you.', '時間があれば手伝う（ありうる）'],
          ['If I had time, I would help you.', '時間があれば手伝うのに（実際は時間がない）'],
        ],
      },
    ],
    mistakes: [
      ['If I know her number, I would call her.', 'If I knew her number, I would call her.', '今の事実とちがう仮定なら、If の中は過去形。'],
      ['I wish I can play the guitar.', 'I wish I could play the guitar.', 'I wish の後ろは過去形（can → could）。'],
      ['If I were a bird, I can fly.', 'If I were a bird, I could fly.', 'もう一方の文は would / could＋原形。'],
    ],
    check: [
      '今の事実とちがう仮定＝If＋過去形, would / could＋原形。',
      'If の中の be動詞は were。',
      'I wish＋過去形＝〜ならいいのに。',
    ],
  }),
]
