// 文法の参考書：英検準2級（高1・高2程度）。並びは学ぶ順。
import { referenceUnit } from './unit.js'

export const GRAMMAR_REFERENCE_PRE2 = [
  referenceUnit({
    key: 'pastperf',
    level: 'pre2',
    topic: '過去完了',
    title: '過去完了（had ＋ 過去分詞）',
    lead: '過去のある時を基準にして、それより前に起きたことや、その時までの経験・継続を表す。had の後ろに過去分詞を置き、主語が何でも had を使う。',
    forms: [
      ['形', '主語 ＋ had ＋ 過去分詞 〜.', 'The train had left when I arrived.', '私が着いたとき、電車は出てしまっていました。'],
      ['否定文', '主語 ＋ had not（hadn’t）＋ 過去分詞 〜.', 'I had not finished my homework by then.', 'そのときまでに、私は宿題を終えていませんでした。'],
    ],
    points: [
      {
        title: '過去の基準より前のこと（完了・結果）',
        text: [
          '過去に2つの出来事があり、そのうち先に起きたほうを had＋過去分詞にする。when・before・by the time（〜するまでに）などで基準の時を示すことが多い。',
        ],
        examples: [
          ['She had finished dinner before the guests arrived.', '客が着く前に、彼女は夕食を食べ終えていました。'],
          ['By the time we arrived, the lecture had started.', '私たちが着くまでに、講義は始まっていました。'],
          ['Ken had played tennis before the meeting began.', 'ケンは会議が始まる前にテニスをしていました。'],
        ],
      },
      {
        title: '過去の基準までの経験・継続',
        text: [
          '現在完了の「経験」「継続」を過去にずらした形。「（その時まで）一度も〜したことがなかった」「（その時まで）ずっと〜していた」を表す。',
        ],
        examples: [
          ['I had never seen such a clear night sky.', '私はあんなに澄んだ夜空を見たことがありませんでした。'],
          ['She had never seen snow before she came to Japan.', '彼女は日本に来る前は雪を見たことがありませんでした。'],
          ['He had lived in Osaka for ten years before he moved to Tokyo.', '彼は東京に引っ越す前に、10年間大阪に住んでいました。'],
        ],
      },
      {
        title: '過去形とのちがい',
        text: [
          '過去の出来事が1つだけ、または起きた順に並べて話すときは過去形でよい。基準の時より「前」だとはっきり示したいときに had＋過去分詞を使う。',
        ],
        table: [
          ['文', '伝わること'],
          ['When I arrived, the train left.', '着いたときに電車が出た（ほぼ同時）'],
          ['When I arrived, the train had left.', '着いたときにはもう電車は出ていた（先に出た）'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '基準より前の経験は had never／食べ終えるは finish／引っ越すは move。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['She had never seen snow before she came to Japan.', '彼女は日本に来る前、雪を見たことがありませんでした。'],
          ['She had finished lunch before the guests arrived.', '客が着く前に、彼女は昼食を終えていました。'],
          ['He had lived in Osaka for ten years before he moved to Tokyo.', '彼は東京へ引っ越す前、10年間大阪に住んでいました。'],
        ],
      },
    ],
    mistakes: [
      ['When I arrived, the train has left.', 'When I arrived, the train had left.', '基準が過去（arrived）なので、それより前は had＋過去分詞。'],
      ['I had never saw such a sky.', 'I had never seen such a sky.', 'had の後ろは過去分詞（see の過去分詞は seen）。'],
    ],
    check: [
      '過去完了＝had＋過去分詞（主語が何でも had）。',
      '過去の基準より前の完了・結果、基準までの経験・継続を表す。',
      '基準より前だと示す必要がなければ過去形でよい。',
    ],
  }),

  referenceUnit({
    key: 'perfprog',
    level: 'pre2',
    topic: '現在完了進行形',
    title: '現在完了進行形と現在完了の使い分け',
    lead: 'have / has been＋動詞ing は、今まで続いている活動に目を向ける。have / has＋過去分詞は、終わった結果・経験・状態の継続に目を向ける。',
    forms: [
      ['続いている活動', '主語 ＋ have / has been ＋ 動詞ing 〜.', 'It has been raining since morning.', '朝からずっと雨が降っています。'],
      ['結果・経験', '主語 ＋ have / has ＋ 過去分詞 〜.', 'I have read three chapters so far.', 'これまでに3章読みました。'],
    ],
    points: [
      {
        title: '活動の長さか、終わった量・結果か',
        text: [
          '「どのくらいの間やっているか」を言うときは現在完了進行形（for・since・How long）。「どれだけやり終えたか」を言うときは現在完了（three chapters・twice）。',
        ],
        examples: [
          ['I have been reading this book for two hours.', '私は2時間この本を読み続けています。'],
          ['She has been practicing the piano for two hours.', '彼女は2時間ピアノの練習を続けています。'],
          ['He has been working on the project since April.', '彼は4月からずっとその計画に取り組んでいます。'],
        ],
      },
      {
        title: '状態を表す動詞は現在完了',
        text: [
          'know・belong・own・like など状態を表す動詞はふつう進行形にしないので、「ずっと〜している」も have known のように現在完了で表す。',
        ],
        examples: [
          ['I have known her for years.', '私は何年も前から彼女を知っています。'],
          ['This bag has belonged to my family for fifty years.', 'このかばんは50年間、私の家族のものです。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '状態を表す動詞は現在完了／取り組むは work on／始まりの時点は since。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['This bag has belonged to my family for fifty years.', 'このかばんは50年間、私の家族のものです。'],
          ['She has been working on the report since April.', '彼女は4月からずっとその報告書に取り組んでいます。'],
          ['My parents have been waiting since this morning.', '両親は今朝からずっと待ち続けています。'],
        ],
      },
    ],
    mistakes: [
      ['I have been knowing her for years.', 'I have known her for years.', 'know は状態を表すので進行形にしない。'],
      ['It has raining since morning.', 'It has been raining since morning.', 'has の後ろに been を入れて has been raining。'],
    ],
    check: [
      '続いている活動の長さ → have / has been＋動詞ing。',
      '終わった量・結果・経験 → have / has＋過去分詞。',
      'know・belong などの状態は現在完了。',
    ],
  }),

  referenceUnit({
    key: 'habit',
    level: 'pre2',
    topic: '過去の習慣',
    title: '過去の習慣（would often / used to）',
    lead: '過去にくり返していたことは、would (often)＋原形 や used to＋原形 で表す。used to は過去の状態にも使えるが、would は動作だけに使う。',
    forms: [
      ['よく〜したものだ', '主語 ＋ would (often) ＋ 原形 〜.', 'He would often swim in this river as a boy.', '彼は少年のころ、よくこの川で泳いだものでした。'],
      ['以前は〜した・〜だった', '主語 ＋ used to ＋ 原形 〜.', 'This street used to be much quieter.', 'この通りは以前はずっと静かでした。'],
    ],
    points: [
      {
        title: 'would と used to のちがい',
        table: [
          ['', 'would (often)', 'used to'],
          ['過去の動作のくり返し', '使える（He would often swim.）', '使える（He used to swim.）'],
          ['過去の状態', '使えない', '使える（There used to be a park here.）'],
          ['「今はちがう」気持ち', 'ふくまない', 'ふくむことが多い'],
        ],
        examples: [
          ['I used to visit my grandparents every summer.', '私は以前、毎年夏に祖父母を訪ねていました。'],
          ['Ken would often play tennis years ago.', 'ケンは何年も前、よくテニスをしたものでした。'],
        ],
      },
      {
        title: 'would は思い出を語るときに',
        text: [
          'would は「あのころはよく〜したものだ」と昔をなつかしむ話でよく使う。過去の場面が分かる語句（as a boy・when I was young）と一緒に使う。',
        ],
        examples: [
          ['When I was young, my father would read to me every night.', '私が小さいころ、父は毎晩本を読んでくれたものでした。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '過去の状態には used to／よく〜したものだは would often／used to のあとは原形。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['There used to be a small park here.', '以前はここに小さな公園がありました。'],
          ['When he was a boy, he would often swim in this river.', '彼は少年のころ、よくこの川で泳いだものでした。'],
          ['I used to visit my cousins every winter.', '私は毎年冬にいとこを訪ねたものでした。'],
        ],
      },
    ],
    mistakes: [
      ['There would be a park here.', 'There used to be a park here.', '過去の状態には would ではなく used to を使う。'],
      ['I was used to visit my grandparents.', 'I used to visit my grandparents.', '過去の習慣は used to＋原形。be used to は「慣れている」の形。'],
    ],
    check: [
      'would (often)＋原形＝よく〜したものだ（動作）。',
      'used to＋原形＝以前は〜した・〜だった（動作・状態）。',
      '過去の状態（There used to be 〜）に would は使わない。',
    ],
  }),

  referenceUnit({
    key: 'usedto',
    level: 'pre2',
    topic: 'used to / be used to',
    title: 'used to と be used to（以前は〜した／〜に慣れている）',
    lead: 'used to＋原形 は「以前は〜した」、be used to＋名詞・動名詞 は「〜に慣れている」、get used to＋名詞・動名詞 は「〜に慣れる」。形が似ているので、後ろの形で見分ける。',
    forms: [
      ['以前は〜した', 'used to ＋ 動詞の原形', 'I used to walk to school.', '私は以前、歩いて学校に通っていました。'],
      ['〜に慣れている', 'be used to ＋ 名詞・動詞ing', 'I am used to getting up early.', '私は早起きに慣れています。'],
      ['〜に慣れる', 'get used to ＋ 名詞・動詞ing', 'You will soon get used to the new school.', 'すぐに新しい学校に慣れるでしょう。'],
    ],
    points: [
      {
        title: 'to の後ろで見分ける',
        text: [
          'used to の to は不定詞なので後ろは原形。be used to・get used to の to は前置詞なので、後ろは名詞か動名詞（動詞ing）。',
        ],
        table: [
          ['形', '後ろ', '意味'],
          ['used to', '原形（used to live）', '以前は〜した・〜だった'],
          ['be used to', '名詞・動名詞（be used to living）', '〜に慣れている'],
          ['get used to', '名詞・動名詞（get used to living）', '〜に慣れる'],
        ],
        examples: [
          ['Mika is used to getting up early for practice.', 'ミカは練習のために早起きすることに慣れています。'],
          ['Ms. Sato is used to cooking dinner for a large family.', '佐藤さんは大家族の夕食を作るのに慣れています。'],
          ['I used to live near the sea.', '私は以前、海の近くに住んでいました。'],
        ],
      },
      {
        title: 'be used to 原形 は受け身',
        text: [
          'be used to＋原形 は「〜するために使われる」という受動態で、別の意味になる（This knife is used to cut bread.＝このナイフはパンを切るのに使われる）。',
        ],
        examples: [
          ['This knife is used to cut bread.', 'このナイフはパンを切るのに使われます。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'be used to のあとは動名詞／used to のあとは原形／be used to＋原形は受け身。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['My father is used to getting up before dawn.', '父は夜明け前に起きることに慣れています。'],
          ['My family used to live near the lake.', '私の家族は以前、湖の近くに住んでいました。'],
          ['This knife is used to cut bread.', 'このナイフはパンを切るために使われます。'],
        ],
      },
    ],
    mistakes: [
      ['I am used to get up early.', 'I am used to getting up early.', 'be used to の to は前置詞なので、後ろは動名詞。'],
      ['I used to living near the sea.', 'I used to live near the sea.', '「以前は〜した」の used to の後ろは原形。'],
    ],
    check: [
      'used to＋原形＝以前は〜した。',
      'be used to＋名詞・動名詞＝〜に慣れている、get used to＝〜に慣れる。',
      'be used to＋原形は「〜するために使われる」。',
    ],
  }),

  referenceUnit({
    key: 'hadbetter',
    level: 'pre2',
    topic: 'had better',
    title: 'had better（〜したほうがよい）',
    lead: 'had better＋動詞の原形 は「〜したほうがよい（そうしないと困ったことになる）」という強めの助言を表す。形は had でも、今やこれからのことを言う。',
    forms: [
      ['形', '主語 ＋ had better ＋ 原形 〜.', 'You had better see a doctor.', '医者にみてもらったほうがいいですよ。'],
      ['否定', '主語 ＋ had better not ＋ 原形 〜.', 'You had better not tell anyone the secret.', 'その秘密はだれにも言わないほうがいいですよ。'],
    ],
    points: [
      {
        title: '後ろは原形、否定は had better not',
        text: [
          'had better の後ろには to を付けず、原形を置く。否定の not は better の後ろに置いて had better not＋原形 にする。短縮形は You’d better。',
        ],
        examples: [
          ['You had better keep a copy of the receipt.', 'レシートの控えを取っておいたほうがいいですよ。'],
          ['You’d better hurry.', '急いだほうがいいですよ。'],
          ['You had better study for the test tonight.', '今夜はテスト勉強をしたほうがいいですよ。'],
        ],
      },
      {
        title: 'should との強さのちがい',
        text: [
          'should（〜したほうがよい）はおだやかなすすめ。had better は「しないと困る」という強い調子になり、目上の人に使うと失礼に聞こえることがある。',
        ],
        table: [
          ['言い方', '調子'],
          ['You should see a doctor.', 'おだやかな助言'],
          ['You had better see a doctor.', '強い忠告（しないと困る）'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'had better のあとに to は付けない／not は better の後ろ／should より強い忠告。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['You had better see a doctor today.', '今日は医者にみてもらったほうがいいですよ。'],
          ['You had better not go out alone at night.', '夜に一人で出歩かないほうがいいですよ。'],
          ['You had better study for the test tonight.', '今夜はテストの勉強をしたほうがいいですよ。'],
        ],
      },
    ],
    mistakes: [
      ['You had better to see a doctor.', 'You had better see a doctor.', 'had better の後ろは原形。to を付けない。'],
      ['You had not better go.', 'You had better not go.', '否定は had better not＋原形。'],
    ],
    check: [
      'had better＋原形＝〜したほうがよい（強い忠告）。',
      '否定は had better not＋原形。to は付けない。',
    ],
  }),

  referenceUnit({
    key: 'causative',
    level: 'pre2',
    topic: '使役・知覚',
    title: '使役動詞・知覚動詞（make / have / let・see / hear）',
    lead: '「人に〜させる・してもらう」を表す make・have・let・get（使役動詞）と、「人が〜するのを見る・聞く」を表す see・hear・watch・feel（知覚動詞）の後ろの形を学ぶ。',
    forms: [
      ['〜させる', 'make / have / let ＋ 人 ＋ 原形', 'My mother made me wash the dishes.', '母は私に皿を洗わせました。'],
      ['〜してもらう（物）', 'have / get ＋ 物 ＋ 過去分詞', 'I had my hair cut yesterday.', '私は昨日、髪を切ってもらいました。'],
      ['〜するのを見る・聞く', 'see / hear / watch ＋ 人 ＋ 原形・動詞ing', 'I saw him enter the room.', '私は彼が部屋に入るのを見ました。'],
    ],
    points: [
      {
        title: '使役動詞の意味と形',
        table: [
          ['形', '意味'],
          ['make ＋ 人 ＋ 原形', '（いやでも）〜させる'],
          ['have ＋ 人 ＋ 原形', '（頼んで・仕事として）〜してもらう'],
          ['let ＋ 人 ＋ 原形', '〜するのを許す・させてあげる'],
          ['get ＋ 人 ＋ to ＋ 原形', '（説得して）〜してもらう'],
          ['help ＋ 人 ＋ (to) 原形', '〜するのを手伝う'],
        ],
        examples: [
          ['Please let me carry your bag.', 'かばんを持たせてください。'],
          ['I got my brother to help me.', '私は兄に手伝ってもらいました。'],
          ['She helped me do my homework.', '彼女は私が宿題をするのを手伝ってくれました。'],
          ['The coach made us check the plan again.', 'コーチは私たちに計画をもう一度確かめさせました。'],
        ],
      },
      {
        title: 'have / get ＋ 物 ＋ 過去分詞',
        text: [
          '目的語が「〜される」側の物なら、have＋物＋過去分詞で「物を〜してもらう」を表す。get＋物＋過去分詞は「物を〜してしまう・済ませる」の意味にもなる。',
        ],
        examples: [
          ['I had the car repaired yesterday.', '私は昨日、車を修理してもらいました。'],
          ['I must get this report done by five.', '5時までにこのレポートを仕上げなければなりません。'],
        ],
      },
      {
        title: '知覚動詞：原形と ing 形',
        text: [
          'see・hear・watch・feel＋人＋原形 は「〜するのを（初めから終わりまで）見る・聞く」、＋動詞ing は「〜しているところを見る・聞く」。',
        ],
        examples: [
          ['I watched them play baseball.', '私は彼らが野球をするのを見ました。'],
          ['I heard someone call my name.', 'だれかが私の名前を呼ぶのが聞こえました。'],
          ['I saw him crossing the street.', '私は彼が通りをわたっているところを見ました。', { crossing: ['cross', 'わたっている（cross の ing 形）'] }],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'let のあとは原形／物は過去分詞で受ける／知覚動詞＋人＋原形。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Please let me carry your heavy bag.', 'あなたの重いかばんを運ばせてください。'],
          ['I must get this report done by Friday.', '私は金曜日までにこの報告書を仕上げてもらわなければなりません。'],
          ['I heard someone call my name.', 'だれかが私の名前を呼ぶのが聞こえました。'],
        ],
      },
    ],
    advanced: {
      level: '2',
      title: '使役・知覚の受け身では to が入る',
      text: [
        'make＋人＋原形 を受け身にすると be made to＋原形 になり、to が入る（He was made to wait.）。see＋人＋原形 も be seen to＋原形 になる。',
      ],
      examples: [
        ['He was made to wait for an hour.', '彼は1時間待たされました。'],
      ],
    },
    mistakes: [
      ['My mother made me to wash the dishes.', 'My mother made me wash the dishes.', 'make＋人の後ろは原形。to を入れない。'],
      ['I had my hair cutting.', 'I had my hair cut.', '髪は「切られる」側なので過去分詞 cut。'],
      ['I got my brother help me.', 'I got my brother to help me.', 'get＋人の後ろは to＋原形。'],
    ],
    check: [
      'make / have / let＋人＋原形、get＋人＋to＋原形。',
      'have / get＋物＋過去分詞＝物を〜してもらう。',
      '知覚動詞＋人＋原形（全部）／＋動詞ing（途中）。',
    ],
  }),

  referenceUnit({
    key: 'itfor',
    level: 'pre2',
    topic: 'it...to/for',
    title: 'It is 〜 for / of 人 to …',
    lead: '形式主語の It is 〜 to … で、「だれが…するのか」を示すときは to の前に for 人 を置く。ただし kind・careless など人の性質を言う語のときは of 人 にする。',
    forms: [
      ['ふつう', 'It is ＋ 形容詞 ＋ for 人 ＋ to ＋ 原形 〜.', 'It is hard for me to wake up early.', '私にとって早起きはつらいです。'],
      ['人の性質', 'It is ＋ kind などの形容詞 ＋ of 人 ＋ to ＋ 原形 〜.', 'It was kind of you to carry my bag.', 'かばんを運んでくれてありがとう（親切にどうも）。'],
    ],
    points: [
      {
        title: 'for と of の見分け方',
        text: [
          'easy・hard・important・necessary など「そのことがどうか」を言う形容詞は for 人。kind・nice・careless・foolish・wise など「その人がどうか」を言う形容詞は of 人。',
          'of になるのは、「人＝形容詞」の関係が成り立つとき（You were kind.）。',
        ],
        table: [
          ['for 人（そのことの評価）', 'of 人（その人の性質）'],
          ['easy・hard・difficult', 'kind・nice'],
          ['important・necessary', 'careless・foolish'],
          ['impossible・dangerous', 'wise・polite'],
        ],
        examples: [
          ['It is important for every member to vote.', 'メンバー全員が投票することが大切です。'],
          ['It was careless of me to leave the door open.', 'ドアを開けたままにしたのは私の不注意でした。'],
        ],
      },
      {
        title: 'of 人 の文の言いかえと、It takes 〜 to …',
        text: [
          'It was kind of you to help me. は You were kind to help me. と言いかえられる（人＝形容詞の関係があるから）。for 人 の文はこの言いかえができない。',
          'It takes（人）＋時間＋to … は「…するのに（時間が）かかる」。It costs（人）＋お金＋to … は「…するのに（お金が）かかる」。',
        ],
        examples: [
          ['You were kind to help me.', '手伝ってくれて親切にありがとう。'],
          ['It takes me an hour to get to school.', '学校に着くのに1時間かかります。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'ふつうの形容詞には for／人の性質には of／時間がかかるは It takes。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['It is hard for me to get up at five.', '私にとって5時に起きるのはつらいです。'],
          ['It was kind of you to help my mother.', '母を助けてくださって親切にどうも。'],
          ['It takes me thirty minutes to finish the report.', '私がその報告書を仕上げるには30分かかります。'],
        ],
      },
    ],
    mistakes: [
      ['It was kind for you to help me.', 'It was kind of you to help me.', 'kind は人の性質を言う語なので of 人。'],
      ['It is hard of me to wake up early.', 'It is hard for me to wake up early.', 'hard は「そのこと」の評価なので for 人。'],
    ],
    check: [
      'It is 〜 for 人 to …（easy・hard・important など）。',
      'It is 〜 of 人 to …（kind・careless など人の性質）。',
    ],
  }),

  referenceUnit({
    key: 'tooenough',
    level: 'pre2',
    topic: 'too/enough',
    title: 'too 〜 to … と 〜 enough to …',
    lead: 'too＋形容詞＋to … は「〜すぎて…できない」、形容詞＋enough to … は「…できるほど十分〜だ」。だれにとってかは for 人 で to の前に置く。',
    forms: [
      ['〜すぎて…できない', 'too ＋ 形容詞 ＋ (for 人) ＋ to ＋ 原形', 'This coffee is too hot to drink.', 'このコーヒーは熱すぎて飲めません。'],
      ['…できるほど〜', '形容詞 ＋ enough ＋ (for 人) ＋ to ＋ 原形', 'He is strong enough to lift the box.', '彼はその箱を持ち上げられるほど力が強いです。'],
    ],
    points: [
      {
        title: 'for 人 の位置と、目的語を重ねないこと',
        text: [
          '「人が」を言うときは to の直前に for 人 を置く（too heavy for me to carry）。文の主語が to の後ろの動詞の目的語になっているときは、to の後ろに it などを重ねない。',
        ],
        examples: [
          ['The box was too heavy for me to carry.', 'その箱は重すぎて私には運べませんでした。'],
          ['The water is warm enough for us to swim in.', '水は私たちが泳げるほど温かいです。'],
          ['The box was light enough for Mina to carry alone.', 'その箱はミナが1人で運べるほど軽かったです。'],
        ],
      },
      {
        title: 'enough の位置',
        text: [
          'enough は形容詞・副詞の後ろに置く（old enough）。名詞に付けるときは名詞の前でもよい（enough money to buy it）。',
        ],
        examples: [
          ['Ken is strong enough to carry the heavy box.', 'ケンはその重い箱を運べるほど力が強いです。'],
          ['I don’t have enough money to buy it.', 'それを買うのに十分なお金がありません。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '熱すぎて飲めないは too hot／重すぎて運べないは too heavy／手が届くは reach。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['This soup is too hot to eat right now.', 'このスープは熱すぎて今は食べられません。'],
          ['The wooden box was too heavy for me to carry.', 'その木の箱は重すぎて、私には運べませんでした。'],
          ['She is tall enough to reach the top shelf.', '彼女はいちばん上のたなに手が届くほど背が高いです。'],
        ],
      },
    ],
    rewrites: [
      ['The box was so heavy that I couldn’t carry it.', 'The box was too heavy for me to carry.', 'so 〜 that … can’t は too 〜 for 人 to … で言いかえられる。'],
      ['He is so strong that he can lift the box.', 'He is strong enough to lift the box.', 'so 〜 that … can は 〜 enough to … で言いかえられる。'],
    ],
    mistakes: [
      ['This coffee is too hot to drink it.', 'This coffee is too hot to drink.', '主語 this coffee が drink の目的語なので、it を重ねない。'],
      ['He is enough strong to lift it.', 'He is strong enough to lift it.', 'enough は形容詞の後ろ。'],
    ],
    check: [
      'too 〜 (for 人) to …＝〜すぎて（人は）…できない。',
      '〜 enough (for 人) to …＝…できるほど〜。enough は形容詞の後ろ。',
      '主語が to の後ろの動詞の目的語なら it を重ねない。',
    ],
  }),

  referenceUnit({
    key: 'purpose',
    level: 'pre2',
    topic: '目的の表現',
    title: '目的の表現（to / in order to / so that）',
    lead: '「〜するために」は、主語が同じなら to＋原形（はっきり言うなら in order to）、主語がちがうときや can・will を入れたいときは so that＋主語＋can 〜 で表す。',
    forms: [
      ['〜するために', 'in order to ＋ 原形', 'He got up early in order to catch the train.', '彼は電車に間に合うように早起きしました。'],
      ['〜しないように', 'in order not to ＋ 原形', 'She whispered in order not to wake the baby.', '彼女は赤ちゃんを起こさないように小声で話しました。'],
      ['〜できるように', 'so that ＋ 主語 ＋ can / will 〜', 'Speak slowly so that everyone can understand.', 'みんなが理解できるように、ゆっくり話してください。'],
    ],
    points: [
      {
        title: 'to・in order to・so as to',
        text: [
          'ふつうは to＋原形 で十分。目的をはっきり言うときは in order to＋原形 や so as to＋原形 を使う。「〜しないように」は not を to の前に置く（in order not to・so as not to）。',
        ],
        examples: [
          ['Ken joined the tennis club in order to practice every week.', 'ケンは毎週練習するためにテニス部に入りました。'],
          ['We left early so as not to miss the bus.', 'バスに乗り遅れないように、私たちは早く出ました。'],
        ],
      },
      {
        title: 'so that ＋主語＋can / will',
        text: [
          '目的のまとまりに別の主語を置きたいときや、can・will を使いたいときは so that＋主語＋can / will 〜 にする。過去の文では could・would になる。',
        ],
        examples: [
          ['I wrote it down so that everyone could remember it.', 'みんなが覚えていられるように、私はそれを書き留めました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'so as not to の語順／目的をつなぐのは so that／目をさまさせるは wake。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['We left early so as not to miss the bus.', '私たちはバスに乗り遅れないように早く出ました。'],
          ['Speak slowly so that everyone can follow you.', 'みんながついていけるように、ゆっくり話してください。'],
          ['She moved quietly in order not to wake the baby.', '彼女は赤ちゃんを起こさないように静かに動きました。'],
        ],
      },
    ],
    mistakes: [
      ['She whispered in order to not wake the baby.', 'She whispered in order not to wake the baby.', '「〜しないように」は not を to の前に置いて in order not to。'],
      ['Speak slowly such that everyone can understand.', 'Speak slowly so that everyone can understand.', '「〜できるように」は so that。'],
    ],
    check: [
      'to / in order to / so as to＋原形＝〜するために。',
      '否定は in order not to / so as not to。',
      'so that＋主語＋can / will＝〜できるように。',
    ],
  }),

  referenceUnit({
    key: 'gerundidiom',
    level: 'pre2',
    topic: '動名詞の慣用',
    title: '動名詞を使う決まった言い方',
    lead: '前置詞の後ろには動名詞が来るので、前置詞をふくむ決まった言い方の後ろは動詞ing になる。to が前置詞の言い方（look forward to など）に特に気をつける。',
    forms: [
      ['形', '決まった言い方（前置詞で終わる）＋ 動詞ing', 'I look forward to seeing you again.', 'またお会いできるのを楽しみにしています。'],
    ],
    points: [
      {
        title: 'to が前置詞の言い方',
        table: [
          ['言い方', '意味'],
          ['look forward to 〜ing', '〜するのを楽しみに待つ'],
          ['be used to 〜ing', '〜するのに慣れている'],
          ['get used to 〜ing', '〜するのに慣れる'],
          ['object to 〜ing', '〜することに反対する'],
          ['when it comes to 〜ing', '〜することとなると'],
        ],
        examples: [
          ['I am used to getting up early.', '私は早起きに慣れています。'],
          ['When it comes to cooking, Ken is the best.', '料理のことなら、ケンがいちばんです。'],
        ],
      },
      {
        title: 'そのほかの動名詞の決まった言い方',
        table: [
          ['言い方', '意味'],
          ['feel like 〜ing', '〜したい気がする'],
          ['have difficulty (in) 〜ing', '〜するのに苦労する'],
          ['have trouble (in) 〜ing', '〜するのに苦労する'],
          ['be capable of 〜ing', '〜する能力がある'],
          ['be good at 〜ing', '〜するのが得意だ'],
          ['How about 〜ing?', '〜するのはどうですか'],
          ['It is no use 〜ing', '〜してもむだだ'],
          ['cannot help 〜ing', '〜せずにはいられない'],
        ],
        examples: [
          ['I feel like cooking tonight.', '今夜は料理をしたい気分です。'],
          ['I had difficulty hearing the speaker in the noisy room.', '騒がしい部屋で、私は話す人の声を聞き取るのに苦労しました。'],
          ['She is capable of solving the problem alone.', '彼女はその問題を1人で解く力があります。'],
          ['I couldn’t help laughing.', '私は笑わずにはいられませんでした。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '〜できるは be capable of／〜せずにはいられない／when it comes to＋動名詞。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['She is capable of solving the problem alone.', '彼女は一人でその問題を解く力があります。'],
          ['I could not help laughing at his joke.', '私は彼の冗談に笑わずにはいられませんでした。'],
          ['When it comes to cooking, Ken is the best in our class.', '料理のこととなると、ケンは私たちのクラスでいちばんです。'],
        ],
      },
    ],
    mistakes: [
      ['I look forward to see you.', 'I look forward to seeing you.', 'look forward to の to は前置詞なので、後ろは動名詞。'],
      ['I feel like to cook tonight.', 'I feel like cooking tonight.', 'feel like の後ろは動名詞。'],
      ['I had difficulty to hear him.', 'I had difficulty hearing him.', 'have difficulty の後ろは動名詞。'],
    ],
    check: [
      'look forward to・be used to の to は前置詞 → 動名詞。',
      'feel like 〜ing、have difficulty / trouble (in) 〜ing、be capable of 〜ing。',
      'cannot help 〜ing＝〜せずにはいられない。',
    ],
  }),

  referenceUnit({
    key: 'participle',
    level: 'pre2',
    topic: '分詞',
    title: '分詞（名詞の説明・SVC・SVOC）',
    lead: '3級で学んだ「名詞を説明する分詞」に加えて、look・come の後ろの分詞（SVC）や、keep・leave・see の目的語の後ろの分詞（SVOC）を学ぶ。動作をする側なら現在分詞、される側なら過去分詞。',
    forms: [
      ['名詞の説明', '名詞 ＋ 分詞 ＋ 〜', 'This is a watch made in Japan.', 'これは日本製の腕時計です。'],
      ['SVOC', 'keep / leave / see ＋ 目的語 ＋ 分詞', 'I heard someone calling my name.', 'だれかが私の名前を呼んでいるのが聞こえました。'],
    ],
    points: [
      {
        title: '名詞を説明する分詞',
        text: [
          '名詞が「〜している」なら現在分詞、「〜される」なら過去分詞。1語なら名詞の前、語句が付くなら名詞の後ろに置く。',
        ],
        examples: [
          ['Look at the sleeping baby.', '眠っている赤ちゃんを見て。'],
          ['The student playing tennis waved to us.', 'テニスをしている生徒が私たちに手を振りました。'],
          ['The photos taken at the event were shared online.', 'その行事で撮られた写真はネットで共有されました。'],
        ],
      },
      {
        title: '主語の様子を表す分詞（SVC）',
        text: [
          'look・seem・come・sit・stand などの後ろに分詞を置いて、主語の様子を表す。come running は「走ってくる」。',
        ],
        examples: [
          ['Naomi looked surprised to see me.', 'ナオミは私に会って驚いたようでした。'],
          ['The dog came running toward us.', '犬が私たちの方へ走ってきました。'],
        ],
      },
      {
        title: '目的語の様子を表す分詞（SVOC）',
        text: [
          'keep・leave＋目的語＋分詞 は「〜を…のままにしておく」、see・hear＋目的語＋分詞 は「〜が…しているのを見る・聞く」。目的語が「する」側なら現在分詞、「される」側なら過去分詞。',
        ],
        examples: [
          ['Don’t keep me waiting.', '私を待たせないで。'],
          ['He left the window open.', '彼は窓を開けたままにしていました。'],
          ['I saw two men carrying a piano.', '私は2人の男性がピアノを運んでいるのを見ました。'],
          ['She kept the door locked.', '彼女はドアに鍵をかけたままにしておきました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '目的語が「される」側なら過去分詞／look＋分詞で主語の様子／見えている動作は現在分詞。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['He left the window open all night.', '彼は一晩中、窓を開けたままにしておきました。'],
          ['Naomi looked surprised to see me at the station.', 'ナオミは駅で私に会って驚いた様子でした。'],
          ['I saw two men carrying a piano into the hall.', '私は2人の男性がピアノをホールへ運んでいるのを見ました。'],
        ],
      },
    ],
    mistakes: [
      ['This is a watch making in Japan.', 'This is a watch made in Japan.', '腕時計は「作られる」側なので過去分詞。'],
      ['Don’t keep me waited.', 'Don’t keep me waiting.', '私が「待っている」ので現在分詞。'],
    ],
    check: [
      '名詞が「する」側なら現在分詞、「される」側なら過去分詞。',
      'look surprised・come running のように主語の様子を表す（SVC）。',
      'keep / leave / see＋目的語＋分詞（SVOC）。',
    ],
  }),

  referenceUnit({
    key: 'partconst',
    level: 'pre2',
    topic: '分詞構文',
    title: '分詞構文の基本',
    lead: '「〜するとき」「〜なので」「〜しながら」のような意味のまとまりを、接続詞と主語を省いて分詞で始める形を分詞構文という。文の主語と、分詞の動作をする人が同じときに使う。',
    forms: [
      ['形', '動詞ing 〜, 主語 ＋ 動詞 ….', 'Walking down the street, I met Tom.', '通りを歩いていると、トムに会いました。'],
      ['先に終わったこと', 'Having ＋ 過去分詞 〜, 主語 ＋ 動詞 ….', 'Having finished her homework, Aya called her friend.', '宿題を終えてから、アヤは友達に電話しました。'],
    ],
    points: [
      {
        title: '分詞構文の作り方',
        text: [
          '①接続詞（when・because など）を消す、②文の主語と同じなら主語も消す、③動詞を ing 形にする。',
        ],
        table: [
          ['もとの文', '分詞構文'],
          ['When I walked down the street, I met Tom.', 'Walking down the street, I met Tom.'],
          ['Because she felt tired, she went to bed.', 'Feeling tired, she went to bed.'],
          ['When he arrived home, he took a bath.', 'Arriving home, he took a bath.'],
        ],
        examples: [
          ['Feeling tired, she went straight to bed.', '疲れていたので、彼女はまっすぐ寝ました。'],
          ['Arriving home, he took a hot bath.', '家に着くと、彼は熱いおふろに入りました。'],
        ],
      },
      {
        title: '意味は文の流れで決まる',
        text: [
          '分詞構文は「時（〜するとき）」「理由（〜なので）」「同時の動作（〜しながら）」などを表す。どの意味かは前後の内容で判断する。',
        ],
        examples: [
          ['Walking home, Emi found a coin.', '家に歩いて帰る途中で、エミはコインを見つけました。'],
          ['She read the letter, smiling happily.', '彼女はうれしそうにほほえみながら手紙を読みました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '通りを歩くは walk down the street／風呂に入るは take a bath／寝るは go to bed。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Walking down the road, I found a small shop.', '道を歩いていると、私は小さな店を見つけました。'],
          ['Arriving home, she took a hot bath.', '家に着くと、彼女は熱いふろに入りました。'],
          ['Feeling sleepy, he went straight to bed.', '眠かったので、彼はまっすぐ寝ました。'],
        ],
      },
    ],
    mistakes: [
      ['Walked down the street, I met Tom.', 'Walking down the street, I met Tom.', '「私が歩いていた」ので現在分詞で始める。'],
      ['To feel tired, she went to bed.', 'Feeling tired, she went to bed.', '理由を表す分詞構文は ing 形で始める。'],
    ],
    check: [
      '接続詞と主語を消して、動詞を ing 形にする。',
      '文の主語と分詞の動作をする人が同じときに使う。',
      '先に終わったことは Having＋過去分詞。',
    ],
  }),

  referenceUnit({
    key: 'reladv',
    level: 'pre2',
    topic: '関係副詞',
    title: '関係副詞（where / when / why / how）',
    lead: '場所・時・理由・方法を表す名詞の後ろに説明の文をつなぐ語。場所なら where、時なら when、理由（the reason）なら why、方法なら how を使う。後ろには主語も目的語もそろった文が続く。',
    forms: [
      ['形', '先行詞 ＋ where / when / why ＋ 主語 ＋ 動詞 〜', 'This is the house where I was born.', 'これは私が生まれた家です。'],
    ],
    points: [
      {
        title: '4つの関係副詞',
        table: [
          ['先行詞', '関係副詞', '例'],
          ['場所（the house・the town）', 'where', 'the town where I grew up'],
          ['時（the day・the year）', 'when', 'the day when we first met'],
          ['理由（the reason）', 'why', 'the reason why you were late'],
          ['方法', 'how（the way とは並べない）', 'how he solved the problem'],
        ],
        examples: [
          ['I remember the day when we first met.', '私たちが初めて会った日を覚えています。'],
          ['Tell me the reason why you were late.', '遅れた理由を教えてください。'],
          ['This is how he solved the problem.', 'このようにして彼はその問題を解きました。'],
        ],
      },
      {
        title: '関係副詞か関係代名詞か',
        text: [
          '後ろの文に主語・目的語が欠けていなければ関係副詞、欠けていれば関係代名詞。the park を先行詞にしても、後ろが I visited（目的語が欠けている）なら which / that を使う。',
        ],
        table: [
          ['文', '後ろの文', '使う語'],
          ['This is the park where the festival is held.', '欠けていない', 'where'],
          ['This is the park which I visited.', 'visited の目的語が欠けている', 'which'],
        ],
        examples: [
          ['This is the town where my grandfather was born.', 'これは祖父が生まれた町です。'],
        ],
      },
      {
        title: '前置詞＋which との言いかえ',
        text: [
          'where は in which、when は on / in which、why は for which のように「前置詞＋which」で言いかえられる。',
        ],
        examples: [
          ['This is the house in which I was born.', 'これは私が生まれた家です。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '生まれるは be born／覚えているは remember／人に伝えるは tell。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['This is the town where I was born.', 'ここは私が生まれた町です。'],
          ['I still remember the summer when we first met.', '私は今でも初めて会った日を覚えています。'],
          ['Please tell me the reason why you were absent.', 'あなたが欠席した理由を私に教えてください。'],
        ],
      },
    ],
    mistakes: [
      ['This is the house which I was born.', 'This is the house where I was born.', '後ろの文（I was born）が欠けていないので、関係副詞 where。'],
      ['This is the way how he solved it.', 'This is how he solved it.', 'the way と how は並べない（the way he solved it でもよい）。'],
    ],
    check: [
      '場所 where・時 when・理由 why・方法 how。',
      '後ろの文が欠けていなければ関係副詞、欠けていれば関係代名詞。',
      'the way と how は並べない。',
    ],
  }),

  referenceUnit({
    key: 'nonrestrictive',
    level: 'pre2',
    topic: '関係代名詞(継続)',
    title: '関係代名詞の継続用法（, who / , which）',
    lead: '関係代名詞の前にコンマ（,）を置くと、すでに決まっている人・物に説明を付け加える言い方（継続用法）になる。継続用法では that は使えない。',
    forms: [
      ['人', '先行詞 ＋ , who ＋ 動詞 〜', 'My uncle, who lives in New York, is a doctor.', 'おじはニューヨークに住んでいて、医者をしています。', { New: 'New York で「ニューヨーク（地名）」', York: 'New York で「ニューヨーク（地名）」' }],
      ['物', '先行詞 ＋ , which ＋ 〜', 'This museum, which opened last year, is very popular.', 'この博物館は去年開館したのですが、とても人気があります。'],
    ],
    points: [
      {
        title: 'コンマがあるかないかで意味が変わる',
        text: [
          'コンマなし（制限用法）は「どの人・物か」を絞りこむ。コンマあり（継続用法）は、すでに決まっている人・物について情報を付け足す。',
        ],
        table: [
          ['文', '伝わること'],
          ['My brother who lives in Tokyo is a teacher.', '（何人かいる兄のうち）東京に住む兄は先生だ'],
          ['My brother, who lives in Tokyo, is a teacher.', '兄は（1人で）東京に住んでいて、先生だ'],
        ],
      },
      {
        title: 'that は使わない・省略しない',
        text: [
          '継続用法では that を使わず、人には who（目的格なら whom）、物には which を使う。目的格でも省略しない。',
        ],
        examples: [
          ['My laptop, which I bought last year, is already broken.', '私のノートパソコンは去年買ったのに、もう壊れています。'],
          ['The cake, which Emi made recently, attracted attention.', 'そのケーキはエミが最近作ったもので、注目を集めました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '開館するは open／〜で有名だは be famous for／こわれるは break down。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['This shop, which opened last year, is very popular.', 'この店は去年開店したのですが、とても人気があります。'],
          ['This town, which is famous for its old temples, attracts many visitors.', 'この町は古い寺で有名なのですが、多くの観光客を引きつけています。'],
          ['My laptop, which I bought last year, has already broken down.', '私のノートパソコンは去年買ったのですが、もう故障しました。'],
        ],
      },
    ],
    advanced: {
      level: '2',
      title: '前の文全体を受ける , which',
      text: [
        ', which は前の名詞だけでなく、前の文の内容全体を受けることもある（「そしてそのことは〜」）。',
      ],
      examples: [
        ['He passed the exam, which surprised everyone.', '彼は試験に合格し、そのことはみんなを驚かせました。'],
      ],
    },
    mistakes: [
      ['My uncle, that lives in New York, is a doctor.', 'My uncle, who lives in New York, is a doctor.', 'コンマの後ろ（継続用法）に that は使えない。'],
      ['My laptop, I bought last year, is broken.', 'My laptop, which I bought last year, is broken.', '継続用法では目的格の関係代名詞も省略しない。'],
    ],
    check: [
      'コンマなし＝絞りこむ、コンマあり＝付け足す。',
      '継続用法は who / which。that は使わず、省略もしない。',
    ],
  }),

  referenceUnit({
    key: 'what',
    level: 'pre2',
    topic: '関係代名詞 what',
    title: '関係代名詞 what（〜すること・〜するもの）',
    lead: 'what は「〜すること・〜するもの（the thing(s) that 〜）」を1語で表す関係代名詞。先行詞をふくんでいるので、what の前に名詞を置かない。',
    forms: [
      ['形', 'what ＋ (主語) ＋ 動詞 〜', 'Tell me what you want.', 'あなたがほしいものを教えてください。'],
    ],
    points: [
      {
        title: '文の中で名詞の働きをする',
        text: [
          'what で始まるまとまりは、主語・目的語・補語になる。',
        ],
        examples: [
          ['What matters is that you tried your best.', '大切なのは、あなたが全力をつくしたことです。'],
          ['This is exactly what he needs.', 'これはまさに彼が必要としているものです。'],
          ['Please tell me what you need to play tennis today.', '今日テニスをするのに必要なものを教えてください。'],
        ],
      },
      {
        title: 'what と that・which の見分け方',
        text: [
          '前に先行詞（名詞）があれば which / that、なければ what。the thing what のように並べない。',
        ],
        table: [
          ['文', '使う語'],
          ['This is the thing that I wanted.', '先行詞 the thing がある → that'],
          ['This is what I wanted.', '先行詞がない → what'],
        ],
      },
      {
        title: 'what を使った決まった言い方',
        text: [
          'what S is（今のS）、what S was / used to be（以前のS）のように、人や物の「姿」を表すこともある。',
        ],
        examples: [
          ['The town is very different from what it was ten years ago.', 'その町は10年前の姿とは大きくちがいます。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '大切であるは matter／全力を尽くすは do one’s best／〜とちがうは be different from。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['What matters most is that you tried your best.', 'いちばん大切なのは、あなたが全力を尽くしたということです。'],
          ['What matters is that you did your best.', '大切なのは、あなたが全力を尽くしたということです。'],
          ['The city is very different from what it was twenty years ago.', 'その町は10年前とはすっかりちがいます。'],
        ],
      },
    ],
    mistakes: [
      ['This is the thing what I wanted.', 'This is what I wanted.', 'what は先行詞をふくむので、前に the thing を置かない。'],
      ['That matters is your effort.', 'What matters is your effort.', '「大切なこと」を主語にするときは what で始める。'],
    ],
    check: [
      'what＝the thing(s) that＝〜すること・〜するもの。',
      '先行詞があれば which / that、なければ what。',
    ],
  }),

  referenceUnit({
    key: 'preprel',
    level: 'pre2',
    topic: '前置詞+関係代名詞',
    title: '前置詞 ＋ 関係代名詞（in which / to whom）',
    lead: '関係代名詞が前置詞の目的語になるとき、前置詞を関係代名詞の前に出せる。前置詞の直後には、物なら which、人なら whom を使い、that は使えない。',
    forms: [
      ['形', '先行詞 ＋ 前置詞 ＋ which / whom ＋ 主語 ＋ 動詞 〜', 'This is the house in which he lives.', 'これは彼が住んでいる家です。'],
    ],
    points: [
      {
        title: '前置詞はもとの文から決める',
        text: [
          'He lives in the house. → the house in which he lives。I spoke to the woman. → the woman to whom I spoke。もとの文でどの前置詞と組んでいたかを確かめる。',
        ],
        examples: [
          ['The woman to whom I spoke was very helpful.', '私が話しかけた女性はとても親切でした。'],
          ['This is the tool with which the machine is repaired.', 'これはその機械を修理するのに使う道具です。'],
          ['This is the park in which children play safely.', 'これは子どもたちが安全に遊べる公園です。'],
        ],
      },
      {
        title: '前置詞を後ろに残す言い方',
        text: [
          '話し言葉では、前置詞を文の最後に残して which / that / who を使ったり、関係代名詞を省いたりすることが多い。',
        ],
        table: [
          ['かたい言い方', 'くだけた言い方'],
          ['the house in which he lives', 'the house (which) he lives in'],
          ['the woman to whom I spoke', 'the woman (who) I spoke to'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '修理するは repair／頼るは depend on／遊ぶは play。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['This is the tool with which the engine is repaired.', 'これはそのエンジンを修理するのに使う道具です。'],
          ['This is the person on whom we depend in an emergency.', 'これは緊急時に私たちが頼る人です。'],
          ['This is the garden in which children play safely.', 'ここは子どもたちが安全に遊べる庭です。'],
        ],
      },
    ],
    mistakes: [
      ['This is the house in that he lives.', 'This is the house in which he lives.', '前置詞の直後に that は使えない。'],
      ['The woman to who I spoke was kind.', 'The woman to whom I spoke was kind.', '前置詞の直後の人は whom。'],
    ],
    check: [
      '前置詞＋which（物）・前置詞＋whom（人）。that は使えない。',
      '前置詞はもとの文の組み合わせ（live in・speak to）で決まる。',
    ],
  }),

  referenceUnit({
    key: 'indirect',
    level: 'pre2',
    topic: '間接疑問',
    title: '間接疑問（whether / if・疑問詞＋主語＋動詞）',
    lead: '疑問詞のある疑問文は「疑問詞＋主語＋動詞」の順で文に入れ、疑問詞のない疑問文（Yes / No で答える疑問文）は whether / if（〜かどうか）で文に入れる。',
    forms: [
      ['〜かどうか', '文 ＋ whether / if ＋ 主語 ＋ 動詞 〜', 'I wonder whether it will rain.', '雨が降るだろうか。'],
      ['疑問詞', '文 ＋ 疑問詞 ＋ 主語 ＋ 動詞 〜', 'Could you tell me where the bank is?', '銀行がどこにあるか教えていただけますか。'],
    ],
    points: [
      {
        title: 'whether / if で「〜かどうか」',
        text: [
          'Will it rain? を文に入れると whether / if it will rain（雨が降るかどうか）。未来のことなら will をそのまま使う。',
          'I wonder whether 〜 は「〜だろうか」、ask 人 if 〜 は「〜かどうか人にたずねる」。',
        ],
        examples: [
          ['I wonder whether Ken will play tennis after school.', 'ケンは放課後テニスをするだろうか。'],
          ['I asked her if she was free.', '私は彼女にひまかどうかたずねました。'],
        ],
      },
      {
        title: '疑問詞のあとは主語＋動詞',
        text: [
          '疑問詞で始まるときも、後ろは疑問文の語順にせず「主語＋動詞」にする。',
        ],
        examples: [
          ['I wonder why he left so early.', '彼はなぜそんなに早く帰ったのだろう。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '〜かどうかは whether／〜だろうかと思うは wonder／行き方は the way to。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['I asked her if she was free on Sunday.', '私は彼女に日曜日はひまかどうかたずねました。'],
          ['I wonder whether it will snow this evening.', '午後に雨が降るだろうか。'],
          ['Could you tell me the way to the station?', '駅への行き方を教えていただけますか。'],
        ],
      },
    ],
    mistakes: [
      ['I wonder that it will rain.', 'I wonder whether it will rain.', '「〜かどうか」は whether / if。'],
      ['Could you tell me where is the bank?', 'Could you tell me where the bank is?', '文の中では「主語＋動詞」の順。'],
      ['I wonder why did he leave early.', 'I wonder why he left early.', 'did を使わず、動詞の過去形 left にする。'],
    ],
    check: [
      '疑問詞のない疑問文 → whether / if＋主語＋動詞。',
      '疑問詞のある疑問文 → 疑問詞＋主語＋動詞。',
    ],
  }),

  referenceUnit({
    key: 'subjunctive',
    level: 'pre2',
    topic: '仮定法(基礎)',
    title: '仮定法過去と、ふつうの if の区別',
    lead: '今の事実とちがう仮定は If＋過去形, would / could＋原形。本当に起こりうる条件は If＋現在形, will＋原形。どちらの意味かで動詞の形を決める。',
    forms: [
      ['事実とちがう仮定', 'If ＋ 主語 ＋ 過去形 〜, 主語 ＋ would / could ＋ 原形 ….', 'If I had wings, I could fly to you.', 'もし翼があれば、あなたのところへ飛んでいけるのに。'],
      ['起こりうる条件', 'If ＋ 主語 ＋ 現在形 〜, 主語 ＋ will ＋ 原形 ….', 'If it rains tomorrow, I will stay home.', '明日雨が降ったら、家にいます。'],
    ],
    points: [
      {
        title: '仮定法過去の形',
        text: [
          'If の中は過去形（be動詞は主語に関係なく were）、もう一方は would（〜するだろう）・could（〜できるだろう）＋原形。',
        ],
        examples: [
          ['If I were rich, I would travel around the world.', 'もしお金持ちなら、世界中を旅するのに。'],
          ['If I had time, I would help you.', '時間があれば手伝うのですが。'],
          ['If Ken were free today, he would play tennis.', 'もし今日ケンがひまなら、テニスをするでしょうに。'],
          ['If I were you, I would ask the teacher.', '私があなたなら、先生にたずねるでしょう。'],
        ],
      },
      {
        title: 'ふつうの if は現在形',
        text: [
          '起こるかもしれない未来の条件は、if の中を現在形にする（will は使わない）。',
        ],
        table: [
          ['文', '気持ち'],
          ['If it rains tomorrow, I will stay home.', '雨の可能性がある'],
          ['If I were a bird, I would fly.', '鳥ではない（事実とちがう）'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '空を飛ぶは fly／時間があるは have time／仲間に加わるは join。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['If I had wings, I could fly over the sea.', 'もし翼があれば、海の上を飛べるのに。'],
          ['If I had more time, I would help you.', 'もっと時間があれば、あなたを手伝えるのに。'],
          ['If Ken were free today, he would join us for lunch.', 'もしケンが今日ひまなら、昼食に加わるのに。'],
        ],
      },
    ],
    mistakes: [
      ['If I am rich, I would travel.', 'If I were rich, I would travel.', '事実とちがう仮定なら If の中は過去形（were）。'],
      ['If it will rain tomorrow, I will stay home.', 'If it rains tomorrow, I will stay home.', '条件の if の中は、未来のことでも現在形。'],
    ],
    check: [
      '事実とちがう仮定：If＋過去形（were）, would / could＋原形。',
      '起こりうる条件：If＋現在形, will＋原形。',
    ],
  }),

  referenceUnit({
    key: 'comparison',
    level: 'pre2',
    topic: '比較応用',
    title: '比較の応用（the 比較級, the 比較級・比べるものをそろえる）',
    lead: '「〜すればするほど…」の the＋比較級, the＋比較級、比較級を強める much / far、比べるもの同士をそろえる that of 〜 などを学ぶ。',
    forms: [
      ['〜するほど…', 'The ＋ 比較級 〜, the ＋ 比較級 ….', 'The harder you study, the better you will be.', '一生けんめい勉強すればするほど、よくなります。'],
      ['…の〜倍', '倍数 ＋ as ＋ 原級 ＋ as', 'This room is three times as large as mine.', 'この部屋は私の部屋の3倍の広さです。'],
    ],
    points: [
      {
        title: 'the＋比較級, the＋比較級',
        text: [
          '2つのまとまりの両方を「the＋比較級」で始める。形容詞が名詞をともなうときは、名詞も一緒に前に出す（The more books you read, 〜）。',
        ],
        examples: [
          ['The more you practice, the more confident you become.', '練習すればするほど、自信がつきます。'],
          ['The earlier you leave, the sooner you will arrive.', '早く出れば出るほど、早く着きます。'],
        ],
      },
      {
        title: '比較級を強める語と、比べるものをそろえること',
        text: [
          '比較級を強めるのは much・far・even・a lot（very は使わない）。',
          '比べるもの同士は同じ種類にそろえる。「東京の人口」と比べるなら「京都の人口」（that of Kyoto）。くり返しの名詞は that / those で受ける。',
        ],
        examples: [
          ['This method is far more reliable than the old one.', 'この方法は古い方法よりはるかに信頼できます。'],
          ['The population of Tokyo is larger than that of Kyoto.', '東京の人口は京都の人口より多いです。'],
        ],
      },
      {
        title: 'だんだん〜・2つのうちで〜なほう',
        text: [
          '比較級 and 比較級 は「だんだん〜」、the＋比較級＋of the two は「2つのうちで〜なほう」。',
        ],
        examples: [
          ['She felt less and less confident.', '彼女はだんだん自信がなくなっていきました。'],
          ['Ken is the taller of the two.', 'ケンは2人のうちで背が高いほうです。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '比較級を強めるのは much・far／だんだん〜は比較級 and 比較級／人口が多いは large。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['This method is far more reliable than the old one.', 'この方法は古い方法よりずっと信頼できます。'],
          ['She felt less and less confident before the speech.', '彼女はスピーチの前、だんだん自信がなくなっていきました。'],
          ['The population of this town is larger than that of the village.', 'この町の人口はその村の人口より多いです。'],
        ],
      },
    ],
    mistakes: [
      ['The harder you study, better you will be.', 'The harder you study, the better you will be.', '後ろのまとまりも the＋比較級で始める。'],
      ['The population of Tokyo is larger than Kyoto.', 'The population of Tokyo is larger than that of Kyoto.', '人口と人口を比べるので that of Kyoto。'],
      ['This is very better than that.', 'This is much better than that.', '比較級を強めるのは much・far。'],
    ],
    check: [
      'The＋比較級 〜, the＋比較級 …＝〜すればするほど…。',
      '比較級を強めるのは much・far・even。',
      '比べるものをそろえる（that of 〜）。比較級 and 比較級＝だんだん〜。',
    ],
  }),

  referenceUnit({
    key: 'conj',
    level: 'pre2',
    topic: '接続詞',
    title: '接続詞（unless / as long as / once / since など）',
    lead: '条件・時・理由・譲歩を表す接続詞の数を広げる。unless（〜しない限り）、as long as（〜する限り）、as soon as（〜するとすぐに）、once（いったん〜すると）、since・as（〜なので）など。',
    forms: [
      ['条件', 'Unless ＋ 主語 ＋ 動詞 〜, …', 'Unless you hurry, you’ll miss the bus.', '急がないとバスに乗り遅れますよ。'],
      ['時', '… as soon as ＋ 主語 ＋ 動詞 〜', 'I will send the file as soon as I finish checking it.', '確認し終えたらすぐにファイルを送ります。', { file: 'ファイル（データ・書類）' }],
    ],
    points: [
      {
        title: '条件を表す接続詞',
        table: [
          ['接続詞', '意味'],
          ['if', 'もし〜なら'],
          ['unless', '〜しない限り（if 〜 not）'],
          ['as long as', '〜する限りは・〜しさえすれば'],
          ['once', 'いったん〜すると'],
          ['in case', '〜するといけないから・〜の場合に備えて'],
        ],
        examples: [
          ['You may stay as long as you like.', '好きなだけいていいですよ。'],
          ['Once you start, you can’t stop.', 'いったん始めると、やめられません。'],
          ['Take an umbrella in case it rains.', '雨が降るといけないから、傘を持っていきなさい。'],
        ],
      },
      {
        title: '時・理由・譲歩を表す接続詞',
        table: [
          ['接続詞', '意味'],
          ['while', '〜する間に・〜する一方で'],
          ['as soon as', '〜するとすぐに'],
          ['since', '〜して以来・〜なので'],
          ['as', '〜するとき・〜なので・〜につれて'],
          ['though / although', '〜だけれども'],
          ['until / till', '〜するまでずっと'],
        ],
        examples: [
          ['While Ken was cooking dinner, Aya set the table.', 'ケンが夕食を作っている間に、アヤは食卓の準備をしました。', { set: ['set', '（set the table で）食卓の準備をした'] }],
          ['Since it was late, we took a taxi.', '遅かったので、私たちはタクシーに乗りました。'],
        ],
      },
      {
        title: '時・条件の中は未来でも現在形',
        text: [
          'unless・as soon as・once・until などで始まる「時・条件」のまとまりでも、未来のことを現在形で表す。',
        ],
        examples: [
          ['I will wait here until you come back.', 'あなたが戻るまでここで待っています。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'unless の中は否定にしない／万一に備えるのは in case／かさを持っていくは take an umbrella。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Unless you hurry, you will miss the train.', '急がないと電車に乗り遅れますよ。'],
          ['Take an umbrella in case it rains this evening.', '今晩雨が降るといけないので、かさを持って行きなさい。'],
          ['Please take an umbrella with you today.', '今日はかさを持っていってください。'],
        ],
      },
    ],
    mistakes: [
      ['Unless you don’t hurry, you’ll miss the bus.', 'Unless you hurry, you’ll miss the bus.', 'unless 自体が「〜しない限り」なので not を重ねない。'],
      ['I will send it as soon as I will finish.', 'I will send it as soon as I finish.', 'as soon as の中は未来でも現在形。'],
    ],
    check: [
      'unless＝if 〜 not、as long as＝〜する限り、once＝いったん〜すると。',
      'since・as は理由にも使う。while は「〜する間に・〜する一方で」。',
      '時・条件の中は未来でも現在形。',
    ],
  }),

  referenceUnit({
    key: 'correlative',
    level: 'pre2',
    topic: '相関接続詞',
    title: '相関接続詞（both A and B / not only A but also B など）',
    lead: '2つの語がセットで働く接続詞。A と B には同じ種類の語句（名詞と名詞、動詞と動詞）を置く。主語になったときの動詞の形にも気をつける。',
    forms: [
      ['AもBも', 'both A and B', 'The course develops both reading and writing skills.', 'その講座は読む力と書く力の両方を伸ばします。'],
      ['AだけでなくBも', 'not only A but also B', 'He can speak not only English but also French.', '彼は英語だけでなくフランス語も話せます。'],
    ],
    points: [
      {
        title: '4つのセット',
        table: [
          ['形', '意味'],
          ['both A and B', 'AもBも（両方）'],
          ['either A or B', 'AかBのどちらか'],
          ['neither A nor B', 'AもBも〜ない'],
          ['not only A but also B', 'AだけでなくBも（＝B as well as A）'],
        ],
        examples: [
          ['Either you or Tom must lead the team.', 'あなたかトムのどちらかがチームを率いなければなりません。'],
          ['Neither the teacher nor the students knew the answer.', '先生も生徒たちも答えを知りませんでした。'],
        ],
      },
      {
        title: '主語になったときの動詞',
        text: [
          'both A and B は複数として扱う。either A or B・neither A nor B・not only A but also B は、動詞に近いほう（B）に動詞を合わせる。',
        ],
        examples: [
          ['Not only Ken but also Emi joined the project.', 'ケンだけでなくエミもその計画に加わりました。'],
          ['Either you or he is wrong.', 'あなたか彼のどちらかがまちがっています。'],
        ],
      },
      {
        title: 'A と B の形をそろえる',
        text: [
          'A と B は同じ形にする（both reading and writing、not only play tennis but also call Grandma）。',
        ],
        examples: [
          ['Ken can not only play tennis after school but also call Grandma in the evening.', 'ケンは放課後テニスができるだけでなく、夕方おばあちゃんに電話もできます。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'AだけでなくBもは not only A but also B／チームを率いるは lead the team／言語の名前に冠詞は付けない。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['She can play not only the piano but also the violin.', '彼女はピアノだけでなくバイオリンもひけます。'],
          ['Either you or Ken must lead the group.', 'あなたかケンのどちらかがそのグループを率いなければなりません。'],
          ['My uncle can speak not only English but also French.', 'おじは英語だけでなくフランス語も話せます。'],
        ],
      },
    ],
    mistakes: [
      ['He speaks not only English and also French.', 'He speaks not only English but also French.', 'not only とセットになるのは but also。'],
      ['Neither the teacher or the students knew it.', 'Neither the teacher nor the students knew it.', 'neither とセットになるのは nor。'],
      ['I like both to read and writing.', 'I like both reading and writing.', 'A と B の形をそろえる。'],
    ],
    check: [
      'both A and B・either A or B・neither A nor B・not only A but also B。',
      'either / neither / not only 〜 but also の動詞は B に合わせる。',
      'A と B は同じ形にそろえる。',
    ],
  }),

  referenceUnit({
    key: 'suchthat',
    level: 'pre2',
    topic: 'so/such...that',
    title: 'so 〜 that と such 〜 that',
    lead: '「とても〜なので…」は、形容詞・副詞だけなら so 〜 that、名詞をふくむなら such (a / an)＋形容詞＋名詞＋that を使う。',
    forms: [
      ['形容詞・副詞', 'so ＋ 形容詞・副詞 ＋ that 〜', 'The lecture was so boring that several students fell asleep.', 'その講義はとても退屈だったので、何人かの生徒が眠ってしまいました。'],
      ['名詞をふくむ', 'such ＋ (a / an) ＋ 形容詞 ＋ 名詞 ＋ that 〜', 'It was such a hot day that we stayed inside.', 'とても暑い日だったので、私たちは中にいました。'],
    ],
    points: [
      {
        title: 'so と such の見分け方',
        text: [
          '後ろに名詞があれば such、形容詞・副詞だけなら so。such の後ろでは a / an を形容詞の前に置く（such a hot day）。',
        ],
        table: [
          ['so', 'such'],
          ['so hot', 'such a hot day'],
          ['so interesting', 'such an interesting artist'],
          ['so kind', 'such kind people（複数なら a は付けない）'],
        ],
        examples: [
          ['It was such an urgent matter that we met immediately.', 'とても急を要する件だったので、私たちはすぐに集まりました。'],
          ['She was such an interesting artist that everyone listened carefully.', '彼女はとても興味深い芸術家だったので、みんながしっかり耳を傾けました。'],
        ],
      },
      {
        title: 'so 〜 that（結果）と so that（目的）',
        text: [
          'so 〜 that …（とても〜なので…）と、so that＋主語＋can 〜（〜できるように）は形が似ているが意味がちがう。so の直後に形容詞・副詞があれば「程度と結果」、so that が続いていれば「目的」。',
        ],
        examples: [
          ['He spoke so quickly that I couldn’t follow him.', '彼はとても速く話したので、私はついていけませんでした。'],
          ['He spoke slowly so that I could follow him.', '私がついていけるように、彼はゆっくり話しました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '名詞をふくむなら such／中にいるは stay inside／話についていくは follow。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['It was such an exciting game that nobody left early.', 'とてもわくわくする試合だったので、だれも早くは帰りませんでした。'],
          ['It was such a hot afternoon that we stayed inside.', 'とても暑い午後だったので、私たちは中にいました。'],
          ['She spoke so quickly that I could not follow her.', '彼女はとても速く話したので、私はついていけませんでした。'],
        ],
      },
    ],
    rewrites: [
      ['The day was so hot that we stayed inside.', 'It was such a hot day that we stayed inside.', '形容詞だけの so 〜 that は、名詞を入れて such 〜 that に言いかえられる。'],
    ],
    mistakes: [
      ['It was so a hot day that we stayed inside.', 'It was such a hot day that we stayed inside.', '名詞をふくむときは such (a)＋形容詞＋名詞。'],
      ['It was a such hot day that we stayed inside.', 'It was such a hot day that we stayed inside.', 'a は such の後ろ（such a hot day）。'],
    ],
    check: [
      '形容詞・副詞だけ → so 〜 that、名詞をふくむ → such (a) 〜 that。',
      'a / an の位置は such a＋形容詞＋名詞。',
    ],
  }),

  referenceUnit({
    key: 'quantity',
    level: 'pre2',
    topic: '数量表現',
    title: '数量表現（few / a few / little / a little など）',
    lead: '数えられる名詞には many・few・a few・a number of、数えられない名詞には much・little・a little・an amount of を使う。a の有無で「少しはある」と「ほとんどない」の気持ちが変わる。',
    forms: [
      ['数えられる名詞', 'many / few / a few ＋ 複数名詞', 'I have a few friends, so I’m not lonely.', '友達が少しいるので、さびしくありません。'],
      ['数えられない名詞', 'much / little / a little ＋ 名詞', 'He has little money, so he can’t buy it.', '彼はお金がほとんどないので、それを買えません。'],
    ],
    points: [
      {
        title: 'a があるかないか',
        table: [
          ['', '数えられる名詞', '数えられない名詞'],
          ['少しはある（肯定的）', 'a few', 'a little'],
          ['ほとんどない（否定的）', 'few', 'little'],
          ['たくさん', 'many・a lot of', 'much・a lot of'],
        ],
        examples: [
          ['There is still a little time before the train leaves.', '電車が出るまでまだ少し時間があります。'],
          ['Few people came to the meeting.', '会議に来た人はほとんどいませんでした。'],
          ['We have only a little time today, so let’s be careful.', '今日は時間が少ししかないので、気をつけましょう。'],
        ],
      },
      {
        title: 'number と amount',
        text: [
          'a number of＋複数名詞（多くの〜）は複数として扱い、the number of＋複数名詞（〜の数）は単数として扱う。数えられない名詞の量は amount で表す。',
        ],
        examples: [
          ['A number of students have joined the project.', '多くの生徒がその計画に加わりました。'],
          ['The number of students is increasing.', '生徒の数は増えています。'],
        ],
      },
      {
        title: '数えられない名詞に気をつける',
        text: [
          'information（情報）・advice（助言）・furniture（家具）・evidence（証拠）は数えられない名詞で、複数の s を付けない。数えるときは a piece of 〜 を使う。',
        ],
        examples: [
          ['She gave me a piece of advice.', '彼女は私に1つ助言をくれました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '数えられない名詞には little／a があれば「少しはある」／助言は a piece of で数える。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['I have little money, so I cannot join the trip.', '私はお金がほとんどないので、その旅行に参加できません。'],
          ['There is still a little water in the bottle.', 'びんの中にはまだ少し水があります。'],
          ['She gave me a piece of advice.', '彼女は私に1つ助言をくれました。'],
        ],
      },
    ],
    mistakes: [
      ['I have few money.', 'I have little money.', 'money は数えられないので little。'],
      ['She gave me many advices.', 'She gave me a lot of advice.', 'advice は数えられないので s を付けず、many も使わない。'],
      ['The number of students are increasing.', 'The number of students is increasing.', 'the number of 〜 は「数」なので単数。'],
    ],
    check: [
      '数えられる → few / a few、数えられない → little / a little。',
      'a があれば「少しはある」、なければ「ほとんどない」。',
      'a number of＝多くの（複数）、the number of＝〜の数（単数）。',
    ],
  }),

  referenceUnit({
    key: 'pronoun',
    level: 'pre2',
    topic: '代名詞',
    title: '代名詞（one / another / the other / each other）',
    lead: '前に出た名詞とどんな関係にあるかで代名詞を選ぶ。同じ種類の別の物は one、2つのうち残りは the other、残り全部は the others、「お互い」は each other。',
    forms: [
      ['2つのうち', 'one 〜, the other …', 'I have two cats; one is white and the other is black.', 'ネコを2匹飼っていて、1匹は白、もう1匹は黒です。'],
      ['お互いに', 'each other / one another', 'They helped each other.', '彼らはお互いに助け合いました。'],
    ],
    points: [
      {
        title: '数と「残り」で選ぶ',
        table: [
          ['言い方', '意味'],
          ['one', '同じ種類の（別の）1つ'],
          ['ones', '同じ種類の（別の）いくつか'],
          ['another', '（ほかにもある中の）もう1つ'],
          ['the other', '（2つのうち）残りの1つ'],
          ['others', 'ほかの人・物（全部ではない）'],
          ['the others', '残り全部'],
        ],
        examples: [
          ['Emi’s cap is small. She wants a bigger one.', 'エミの帽子は小さいです。彼女はもっと大きいのをほしがっています。'],
          ['Some students agreed, but others opposed the plan.', '賛成した生徒もいれば、その計画に反対した生徒もいました。'],
          ['Three students stayed. The others went home.', '3人の生徒が残り、残りの生徒は全員帰りました。'],
        ],
      },
      {
        title: 'each other と one another',
        text: [
          'each other・one another は「お互い（に）」という意味の代名詞。talk to each other のように、前置詞の後ろにも置く。',
        ],
        examples: [
          ['They helped each other.', '彼らはお互いに助け合いました。'],
          ['The students talked to one another in English.', '生徒たちはお互いに英語で話しました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '同じ種類の別の1つは one／2つのうち残りは the other／each other は複数形にしない。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Emi’s cap is too small. She wants a bigger one.', 'エミの帽子は小さすぎます。彼女はもっと大きいのをほしがっています。'],
          ['I have two cats. One is white and the other is black.', 'ネコを2匹飼っています。1匹は白で、もう1匹は黒です。'],
          ['They talked to each other in English.', '彼らは英語でお互いに話しました。'],
        ],
      },
    ],
    mistakes: [
      ['I have two cats; one is white and another is black.', 'I have two cats; one is white and the other is black.', '2つのうちの残りの1つは the other。'],
      ['They helped each others.', 'They helped each other.', 'each other に s は付けない。'],
    ],
    check: [
      'one＝同じ種類の1つ、another＝もう1つ、the other＝2つのうち残り。',
      'others＝ほかの人、the others＝残り全部。',
      'each other / one another＝お互い。',
    ],
  }),

  referenceUnit({
    key: 'reflexive',
    level: 'pre2',
    topic: '再帰代名詞',
    title: '再帰代名詞（myself / themselves）',
    lead: '主語と目的語が同じ人・物のときは、目的語を myself・himself などの再帰代名詞にする。「自分で」と強める使い方や、決まった言い方もある。',
    forms: [
      ['自分を', '主語 ＋ 動詞 ＋ 再帰代名詞', 'He introduced himself to the new classmates.', '彼は新しいクラスメートに自己紹介しました。'],
      ['自分で（強め）', '文 ＋ 再帰代名詞', 'She painted the wall herself.', '彼女は自分で壁をぬりました。'],
    ],
    points: [
      {
        title: '主語と目的語が同じとき',
        text: [
          '主語と同じ人を目的語にするときは再帰代名詞にする（He introduced him. だと別の人を紹介したことになる）。',
        ],
        examples: [
          ['Ken introduced himself at the meeting.', 'ケンは会議で自己紹介しました。'],
          ['Be careful not to hurt yourself.', 'けがをしないように気をつけて。'],
        ],
      },
      {
        title: '再帰代名詞を使う決まった言い方',
        table: [
          ['言い方', '意味'],
          ['enjoy oneself', '楽しく過ごす'],
          ['help oneself to 〜', '〜を自由に取って食べる'],
          ['by oneself', 'ひとりで・自力で'],
          ['for oneself', '自分のために・自分で'],
          ['make oneself at home', 'くつろぐ'],
        ],
        examples: [
          ['We enjoyed ourselves at the festival.', '私たちはお祭りで楽しく過ごしました。'],
          ['He lives by himself.', '彼はひとりで暮らしています。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '楽しく過ごすは enjoy oneself／けがをするは hurt oneself／自由に取っては help oneself to。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['We enjoyed ourselves at the summer festival.', '私たちは夏祭りで楽しく過ごしました。'],
          ['Be careful not to hurt yourself with the knife.', 'ナイフで手を切らないように気をつけて。'],
          ['Please help yourself to the fruit on the table.', 'テーブルの上の果物を自由に取ってください。'],
        ],
      },
    ],
    mistakes: [
      ['We enjoyed us at the festival.', 'We enjoyed ourselves at the festival.', '主語 We と同じ人なので ourselves。'],
      ['He introduced his to the class.', 'He introduced himself to the class.', '主語と同じ人を目的語にするときは himself。'],
    ],
    check: [
      '主語と目的語が同じなら再帰代名詞（myself・himself など）。',
      'enjoy oneself・help oneself・by oneself。',
    ],
  }),

  referenceUnit({
    key: 'prep',
    level: 'pre2',
    topic: '前置詞',
    title: '前置詞（despite / during・決まった組み合わせ）',
    lead: '前置詞の後ろには名詞（句）、接続詞の後ろには「主語＋動詞」を置く。また pay attention to・take 〜 into account のように、前置詞をふくむ決まった組み合わせは、まとまりで使えるようにする。',
    forms: [
      ['前置詞＋名詞', 'despite / during ＋ 名詞', 'Despite the heavy traffic, we arrived on time.', 'ひどい渋滞にもかかわらず、私たちは時間どおりに着きました。'],
    ],
    points: [
      {
        title: '前置詞と接続詞を区別する',
        table: [
          ['前置詞（後ろは名詞）', '接続詞（後ろは主語＋動詞）', '意味'],
          ['despite / in spite of', 'although / though', '〜にもかかわらず'],
          ['during', 'while', '〜の間'],
          ['because of', 'because', '〜のために・〜なので'],
          ['until / till', 'until / till', '〜まで（どちらにも使える）'],
        ],
        examples: [
          ['No one used a phone during the performance.', '上演中、だれも電話を使いませんでした。'],
          ['Despite the sudden noise outside, Ken kept reading his book.', '外で突然音がしても、ケンは本を読み続けました。'],
          ['Please wait until I come back.', '私が戻るまで待っていてください。'],
        ],
      },
      {
        title: '前置詞をふくむ決まった組み合わせ',
        table: [
          ['言い方', '意味'],
          ['pay attention to 〜', '〜に注意を払う'],
          ['take 〜 into account', '〜を考えに入れる'],
          ['come into effect', '（法律・規則が）効力をもつ'],
          ['be consistent with 〜', '〜と一致する・矛盾しない'],
          ['depend on 〜', '〜しだいだ・〜に頼る'],
          ['result in 〜', '〜という結果になる'],
        ],
        examples: [
          ['Please pay attention to the final paragraph.', '最後の段落に注意を払ってください。'],
          ['The committee took the evidence into account.', '委員会はその証拠を考えに入れました。'],
          ['The new rule will come into effect next month.', '新しい規則は来月から効力をもちます。'],
          ['Our results were consistent with the earlier study.', '私たちの結果は以前の研究と一致していました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '注意を向けるは pay attention to／効力を持つは come into effect／〜と一致するは be consistent with／考えに入れるは take 〜 into account。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Please pay attention to the final paragraph.', '最後の段落に注意を払ってください。'],
          ['The new rule will come into effect next month.', '新しい規則は来月発効します。'],
          ['Our results were consistent with the earlier study.', '私たちの結果は先の研究と一致していました。'],
          ['The committee took the evidence into account.', '委員会はその証拠を考慮に入れました。'],
        ],
      },
    ],
    mistakes: [
      ['Although the heavy traffic, we arrived on time.', 'Despite the heavy traffic, we arrived on time.', '名詞 the heavy traffic の前は前置詞 despite。'],
      ['No one talked while the performance.', 'No one talked during the performance.', '名詞の前は前置詞 during。'],
      ['Please pay attention on the paragraph.', 'Please pay attention to the paragraph.', 'pay attention to 〜 で決まった組み合わせ。'],
    ],
    check: [
      'despite・during・because of の後ろは名詞。although・while・because の後ろは主語＋動詞。',
      'pay attention to・take 〜 into account・come into effect・be consistent with。',
    ],
  }),
]
