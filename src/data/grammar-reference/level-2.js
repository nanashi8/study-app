// 文法の参考書：英検2級（高校卒業程度）。並びは学ぶ順。
import { referenceUnit } from './unit.js'

export const GRAMMAR_REFERENCE_2 = [
  referenceUnit({
    key: 'perfect',
    level: '2',
    topic: '完了形応用',
    title: '完了形の広がり（未来完了・完了形の受動態）',
    lead: '完了形は「基準の時」までのつながりを表す。基準が今なら現在完了、過去なら過去完了、未来なら未来完了（will have＋過去分詞）。受け身にするときは have been＋過去分詞。',
    forms: [
      ['未来完了', '主語 ＋ will have ＋ 過去分詞 〜.', 'By next year, I will have worked here for ten years.', '来年で、私はここで10年働いたことになります。'],
      ['完了形の受動態', '主語 ＋ have / has / had been ＋ 過去分詞 〜.', 'The final results have not been confirmed yet.', '最終結果はまだ確定していません。'],
    ],
    points: [
      {
        title: '基準の時で3つの完了形を選ぶ',
        table: [
          ['基準の時', '形', '例'],
          ['今', 'have / has＋過去分詞', 'I have finished it.'],
          ['過去のある時', 'had＋過去分詞', 'I had finished it by then.'],
          ['未来のある時', 'will have＋過去分詞', 'I will have finished it by noon.'],
        ],
        examples: [
          ['By the time we arrived, the concert had already begun.', '私たちが着いたときには、コンサートはもう始まっていました。'],
          ['The committee will have revised the proposal by Friday.', '委員会は金曜日までに提案を修正し終えているでしょう。'],
        ],
      },
      {
        title: '未来完了の3つの意味',
        text: [
          '未来のある時までに「〜し終えているだろう（完了）」「〜したことになる（経験）」「ずっと〜していることになる（継続）」を表す。by（〜までに）や by the time（〜するときまでに）とよく使う。by the time の中は未来でも現在形。',
        ],
        examples: [
          ['I will have finished my homework by the time you come back.', 'あなたが戻るまでに、宿題を終えているでしょう。'],
          ['If I visit Kyoto again, I will have been there three times.', 'もう一度京都を訪れれば、3回行ったことになります。'],
        ],
      },
      {
        title: '完了形の受動態・進行形',
        text: [
          '完了形を受け身にすると have / has / had been＋過去分詞（〜されている・〜された）。完了形の進行形は have been＋動詞ing。',
        ],
        examples: [
          ['The bridge has been repaired.', 'その橋は修理されています。'],
          ['I have been studying for two hours.', '私は2時間ずっと勉強しています。'],
        ],
      },
    ],
    mistakes: [
      ['By next year, I will work here for ten years.', 'By next year, I will have worked here for ten years.', '未来の基準までの継続は未来完了 will have＋過去分詞。'],
      ['The results have not confirmed yet.', 'The results have not been confirmed yet.', '結果は「確定される」側なので have been＋過去分詞。'],
    ],
    check: [
      '基準が今 → have done、過去 → had done、未来 → will have done。',
      'by・by the time と未来完了。by the time の中は現在形。',
      '完了形の受動態は have been＋過去分詞。',
    ],
  }),

  referenceUnit({
    key: 'pastperfprog',
    level: '2',
    topic: '過去完了進行形',
    title: '過去完了進行形（had been ＋ 動詞ing）',
    lead: '過去のある時まで「ずっと〜し続けていた」動作を表す。had been の後ろに動詞の ing 形を置く。',
    forms: [
      ['形', '主語 ＋ had been ＋ 動詞ing 〜.', 'She had been waiting for an hour when I arrived.', '私が着いたとき、彼女は1時間待ち続けていました。'],
    ],
    points: [
      {
        title: '過去の基準まで続いていた動作',
        text: [
          '基準の時（when・before・by the time などで示す過去の時）の前から、その時まで続いていた動作に使う。長さは for・since で表す。',
        ],
        examples: [
          ['He had been living there for five years before he moved.', '彼は引っ越す前に5年間そこに住んでいました。'],
          ['It had been raining for hours when the road flooded.', '道路が水につかったとき、何時間も雨が降り続いていました。', { flooded: ['flood', '水につかった・あふれた'] }],
          ['Ken had been working for three hours when his computer crashed.', 'ケンのコンピューターが止まったとき、彼は3時間ずっと作業していました。', { crashed: ['crash', '（コンピューターが）止まった・故障した'] }],
        ],
      },
      {
        title: '現在完了進行形・過去完了との関係',
        table: [
          ['形', '表すこと'],
          ['have been ＋ 動詞ing', '今までずっと〜している'],
          ['had been ＋ 動詞ing', '過去のある時までずっと〜していた'],
          ['had ＋ 過去分詞', '過去のある時までに〜し終えていた・〜したことがあった'],
        ],
      },
    ],
    mistakes: [
      ['She had been wait for an hour.', 'She had been waiting for an hour.', 'had been の後ろは動詞の ing 形。'],
      ['I had been knowing him for years.', 'I had known him for years.', 'know は状態を表すので過去完了を使う。'],
    ],
    check: [
      '過去完了進行形＝had been＋動詞ing。',
      '過去の基準の時まで続いていた動作。for・since と使う。',
    ],
  }),

  referenceUnit({
    key: 'obligation',
    level: '2',
    topic: '助動詞・義務',
    title: '助動詞の働きをする言い方（be supposed to など）',
    lead: '規則・予定・許可・義務・能力は、助動詞のほかに be supposed to（〜することになっている）、be allowed to（〜してよい）、be required to（〜しなければならない）、be able to（〜できる）でも表す。',
    forms: [
      ['〜することになっている', 'be supposed to ＋ 原形', 'Visitors are supposed to show their passes at the gate.', '訪問者は入口で通行証を見せることになっています。', { passes: '通行証（pass の複数形）' }],
      ['〜してはいけないことになっている', 'be not supposed to ＋ 原形', 'Students are not supposed to run in the hallway.', '生徒は廊下を走ってはいけないことになっています。'],
    ],
    points: [
      {
        title: '意味を見分ける',
        table: [
          ['言い方', '意味'],
          ['be supposed to 〜', '（規則・予定で）〜することになっている'],
          ['be allowed to 〜', '〜することを許されている'],
          ['be required to 〜', '〜することを求められている'],
          ['be able to 〜', '〜することができる'],
          ['had better 〜', '〜したほうがよい（強い忠告）'],
        ],
        examples: [
          ['You are not allowed to take photos here.', 'ここで写真を撮ることは許されていません。'],
          ['All members are required to attend the meeting.', '全員が会議に出席することを求められています。'],
          ['She was able to finish the work on time.', '彼女は時間どおりに仕事を終えることができました。'],
        ],
      },
      {
        title: '助動詞と組み合わせる',
        text: [
          '助動詞は2つ並べられないので、will be able to（〜できるだろう）、will have to（〜しなければならないだろう）のように、be able to・have to を使って組み合わせる。',
        ],
        examples: [
          ['You will be able to swim soon.', 'すぐに泳げるようになるでしょう。'],
        ],
      },
    ],
    mistakes: [
      ['Visitors are supposed show their passes.', 'Visitors are supposed to show their passes.', 'be supposed の後ろは to＋原形。'],
      ['You will can swim soon.', 'You will be able to swim soon.', '助動詞を2つ並べず、be able to を使う。'],
    ],
    check: [
      'be supposed to＝〜することになっている、be allowed to＝〜してよい。',
      'be required to＝〜しなければならない、be able to＝〜できる。',
      '助動詞と組み合わせるときは will be able to のようにする。',
    ],
  }),

  referenceUnit({
    key: 'modalperf',
    level: '2',
    topic: '助動詞+have done',
    title: '助動詞 ＋ have ＋ 過去分詞（過去への推量・後悔）',
    lead: '過去のことについて「〜したにちがいない」「〜したかもしれない」「〜したはずがない」と推量したり、「〜すべきだったのに」と後悔したりするときは、助動詞＋have＋過去分詞を使う。',
    forms: [
      ['形', '主語 ＋ 助動詞 ＋ have ＋ 過去分詞 〜.', 'He must have missed the train.', '彼は電車に乗り遅れたにちがいありません。'],
    ],
    points: [
      {
        title: '推量の言い方',
        table: [
          ['言い方', '意味'],
          ['must have ＋ 過去分詞', '〜したにちがいない'],
          ['may / might have ＋ 過去分詞', '〜したかもしれない'],
          ['cannot / can’t have ＋ 過去分詞', '〜したはずがない'],
          ['could have ＋ 過去分詞', '〜できただろう・〜したかもしれない'],
        ],
        examples: [
          ['She cannot have done it; she was away.', '彼女がそれをしたはずがありません。出かけていたのですから。'],
          ['The committee must have revised the proposal already.', '委員会はもう提案を修正したにちがいありません。'],
          ['He may have forgotten our appointment.', '彼は約束を忘れたのかもしれません。'],
        ],
      },
      {
        title: '後悔・非難の言い方',
        table: [
          ['言い方', '意味'],
          ['should have ＋ 過去分詞', '〜すべきだったのに（しなかった）'],
          ['should not have ＋ 過去分詞', '〜すべきではなかったのに（した）'],
          ['need not have ＋ 過去分詞', '〜する必要はなかったのに（した）'],
        ],
        examples: [
          ['You should have told me earlier.', 'もっと早く言ってくれればよかったのに。'],
          ['You should have checked the source before sharing it.', '共有する前に情報の出どころを確かめるべきでした。'],
          ['You need not have hurried; we had time.', '急ぐ必要はなかったのに。時間はありましたから。'],
        ],
      },
    ],
    mistakes: [
      ['He must missed the train.', 'He must have missed the train.', '過去の推量は must have＋過去分詞。'],
      ['You should have tell me.', 'You should have told me.', 'have の後ろは過去分詞。'],
    ],
    check: [
      'must have done＝したにちがいない、may have done＝したかもしれない、cannot have done＝したはずがない。',
      'should have done＝すべきだったのに、need not have done＝する必要はなかったのに。',
    ],
  }),

  referenceUnit({
    key: 'perfinf',
    level: '2',
    topic: '完了不定詞',
    title: '完了不定詞（to have ＋ 過去分詞）',
    lead: 'to have＋過去分詞 は、文の動詞が表す時よりも前のことを表す不定詞。seem・appear・be said などの後ろでよく使う。',
    forms: [
      ['形', 'seem / appear など ＋ to have ＋ 過去分詞', 'He seems to have been ill.', '彼は病気だったようです。'],
    ],
    points: [
      {
        title: '文の動詞より前のことを表す',
        text: [
          'He seems to be ill. は「（今）病気のようだ」、He seems to have been ill. は「（以前）病気だったようだ」。seems（今）より前のことなので to have been にする。',
        ],
        table: [
          ['文', '言いかえ'],
          ['He seems to be ill.', 'It seems that he is ill.'],
          ['He seems to have been ill.', 'It seems that he was ill.'],
        ],
        examples: [
          ['He seems to have forgotten our appointment.', '彼は約束を忘れてしまったようです。'],
          ['The committee seems to have revised the proposal.', '委員会は提案を修正したようです。'],
          ['The species appears to have disappeared from the island.', 'その種は島から姿を消したらしい。'],
        ],
      },
      {
        title: '気持ちの理由・be said to',
        text: [
          'I am sorry to have kept you waiting.（お待たせしてすみません）のように、気持ちの理由が前のことなら完了不定詞にする。be said to have＋過去分詞 は「〜したと言われている」。',
        ],
        examples: [
          ['I am sorry to have kept you waiting.', 'お待たせしてすみません。'],
          ['She is believed to have written the letter.', '彼女がその手紙を書いたと考えられています。'],
        ],
      },
    ],
    rewrites: [
      ['It seems that he was ill.', 'He seems to have been ill.', 'It seems that＋過去の文 は、主語を前に出して seem to have＋過去分詞 で言いかえられる。'],
    ],
    mistakes: [
      ['He seems to has been ill.', 'He seems to have been ill.', 'to の後ろは原形の have。'],
      ['He is said to wrote the book.', 'He is said to have written the book.', '「書いたと言われている」は to have＋過去分詞。'],
    ],
    check: [
      'to have＋過去分詞＝文の動詞より前のこと。',
      'seem to have done＝It seems that＋過去の文。',
    ],
  }),

  referenceUnit({
    key: 'beto',
    level: '2',
    topic: 'be to構文',
    title: 'be to ＋ 動詞の原形（予定・義務）',
    lead: 'be動詞＋to＋原形 で、公式の予定（〜することになっている）や義務・命令（〜しなければならない）を表す。ニュースや掲示でよく使う、かたい言い方。',
    forms: [
      ['形', '主語 ＋ be動詞 ＋ to ＋ 原形 〜.', 'The prime minister is to visit the city next week.', '首相は来週その市を訪れることになっています。', { prime: 'prime minister で「首相」', minister: 'prime minister で「首相」' }],
    ],
    points: [
      {
        title: '予定と義務',
        text: [
          '文の内容から、「〜することになっている（予定）」か「〜しなければならない（義務・命令）」かを判断する。否定の be not to＋原形 は「〜してはならない」。',
        ],
        examples: [
          ['You are to finish this by noon.', 'あなたはこれを正午までに終えなければなりません。'],
          ['No one is to leave the building without permission.', '許可なくだれも建物を出てはなりません。'],
          ['The committee is to revise the proposal tomorrow.', '委員会は明日、提案を修正することになっています。'],
        ],
      },
      {
        title: 'be to と be going to・will のちがい',
        text: [
          'be to は、公式に決まった予定や規則として決められた義務を表す、かたい言い方。個人の予定なら be going to、予想なら will を使う。',
        ],
        table: [
          ['言い方', '伝わること'],
          ['The meeting is to be held on Monday.', '（公式に）月曜日に開かれることになっている'],
          ['We are going to meet on Monday.', '月曜日に会うつもりだ（個人の予定）'],
          ['It will rain on Monday.', '月曜日は雨だろう（予想）'],
        ],
        examples: [
          ['The meeting is to be held on Monday.', '会議は月曜日に開かれることになっています。'],
        ],
      },
    ],
    advanced: {
      level: 'pre1',
      title: '可能・運命・意図の be to',
      text: [
        'be to は「〜できる（否定文で）」「〜する運命だった」「〜するつもりなら（if 節で）」も表す（準1級で学ぶ）。',
      ],
      examples: [
        ['Not a sound was to be heard.', '物音ひとつ聞こえませんでした。'],
      ],
    },
    mistakes: [
      ['The prime minister is visit the city.', 'The prime minister is to visit the city.', 'be to の to を落とさない。'],
      ['You are to finished this.', 'You are to finish this.', 'to の後ろは原形。'],
    ],
    check: [
      'be to＋原形＝〜することになっている（予定）・〜しなければならない（義務）。',
      'be not to＋原形＝〜してはならない。',
    ],
  }),

  referenceUnit({
    key: 'causative',
    level: '2',
    topic: '使役',
    title: '使役（have ＋ 人 ＋ 原形 / get ＋ 人 ＋ to do / have ＋ 物 ＋ 過去分詞）',
    lead: '「人に〜してもらう・させる」は have＋人＋原形、get＋人＋to＋原形。「物を〜してもらう」は have＋物＋過去分詞。後ろの形が動詞ごとにちがう。',
    forms: [
      ['人に〜させる・してもらう', 'have ＋ 人 ＋ 原形', 'The teacher had us clean the room.', '先生は私たちに部屋を掃除させました。'],
      ['人に〜してもらう', 'get ＋ 人 ＋ to ＋ 原形', 'I got my brother to repair my bicycle.', '私は兄に自転車を直してもらいました。'],
      ['物を〜してもらう', 'have ＋ 物 ＋ 過去分詞', 'I had my car repaired before the trip.', '旅行の前に車を修理してもらいました。'],
    ],
    points: [
      {
        title: '形を比べる',
        table: [
          ['形', '意味'],
          ['make ＋ 人 ＋ 原形', '（強制的に）〜させる'],
          ['have ＋ 人 ＋ 原形', '（頼んで・役目として）〜してもらう'],
          ['get ＋ 人 ＋ to ＋ 原形', '（説得して）〜してもらう'],
          ['let ＋ 人 ＋ 原形', '〜させてあげる'],
          ['have / get ＋ 物 ＋ 過去分詞', '物を〜してもらう・〜される'],
        ],
        examples: [
          ['We got Ken to revise the proposal.', '私たちはケンに提案を修正してもらいました。'],
          ['I had my bag stolen on the train.', '私は電車でかばんを盗まれました。'],
        ],
      },
      {
        title: '目的語が「する」側か「される」側か',
        text: [
          '目的語が動作をする人なら原形（have him check it）、動作をされる物なら過去分詞（have it checked）。',
        ],
        examples: [
          ['I had him check the report.', '私は彼にレポートを確認してもらいました。'],
          ['I had the report checked.', '私はレポートを確認してもらいました。'],
        ],
      },
    ],
    mistakes: [
      ['The teacher had us to clean the room.', 'The teacher had us clean the room.', 'have＋人の後ろは原形。'],
      ['I got my brother repair my bike.', 'I got my brother to repair my bike.', 'get＋人の後ろは to＋原形。'],
      ['I had my car repair.', 'I had my car repaired.', '車は「修理される」側なので過去分詞。'],
    ],
    check: [
      'have＋人＋原形、get＋人＋to＋原形。',
      'have / get＋物＋過去分詞＝物を〜してもらう・〜される。',
    ],
  }),

  referenceUnit({
    key: 'gerundidiom',
    level: '2',
    topic: '動名詞の慣用',
    title: '動名詞の慣用表現（cannot help 〜ing・There is no 〜ing など）',
    lead: '動名詞を使う決まった言い方のうち、2級でよく出るものを確かめる。意味とまとまりの形をセットで身につける。',
    forms: [
      ['〜せずにはいられない', 'cannot help ＋ 動詞ing', 'I cannot help laughing at the joke.', 'その冗談には笑わずにはいられません。'],
      ['〜することはできない', 'There is no ＋ 動詞ing', 'There is no denying that the policy needs revision.', 'その政策に見直しが必要なことは否定できません。'],
    ],
    points: [
      {
        title: 'よく出る動名詞の慣用表現',
        table: [
          ['言い方', '意味'],
          ['cannot help 〜ing', '〜せずにはいられない'],
          ['It is no use 〜ing', '〜してもむだだ'],
          ['There is no 〜ing', '〜することはできない'],
          ['on 〜ing', '〜するとすぐに'],
          ['in 〜ing', '〜するときに・〜する点で'],
          ['be worth 〜ing', '〜する価値がある'],
          ['What do you say to 〜ing?', '〜するのはどうですか'],
          ['come close to 〜ing', 'あやうく〜しそうになる'],
        ],
        examples: [
          ['It is no use crying over spilt milk.', 'こぼれた牛乳のことを嘆いてもむだです（覆水盆に返らず）。'],
          ['On arriving at the station, I called my mother.', '駅に着くとすぐに、母に電話しました。'],
          ['This book is worth reading.', 'この本は読む価値があります。'],
        ],
      },
      {
        title: '動名詞の意味上の主語',
        text: [
          '動名詞の動作をする人を示すときは、動名詞の前に所有格か目的格を置く（I don’t like his coming late.＝彼が遅れて来るのが気に入らない）。',
        ],
        examples: [
          ['Do you mind my opening the window?', '私が窓を開けてもかまいませんか。'],
        ],
      },
    ],
    mistakes: [
      ['I cannot help to laugh.', 'I cannot help laughing.', 'cannot help の後ろは動名詞。'],
      ['This book is worth to read.', 'This book is worth reading.', 'be worth の後ろは動名詞。'],
    ],
    check: [
      'cannot help 〜ing＝せずにはいられない、It is no use 〜ing＝してもむだ。',
      'There is no 〜ing＝できない、on 〜ing＝するとすぐに、be worth 〜ing＝する価値がある。',
      '動名詞の意味上の主語は所有格・目的格。',
    ],
  }),

  referenceUnit({
    key: 'partconst',
    level: '2',
    topic: '分詞構文',
    title: '分詞構文（Being 〜・過去分詞・Having done・否定）',
    lead: '準2級の分詞構文を広げる。受け身の意味なら過去分詞で始め、先に終わったことは Having＋過去分詞、否定は not を分詞の前に置く。with を使った付帯状況も学ぶ。',
    forms: [
      ['受け身', '過去分詞 〜, 主語 ＋ 動詞 ….', 'Seen from space, the earth looks blue.', '宇宙から見ると、地球は青く見えます。'],
      ['先に終わったこと', 'Having ＋ 過去分詞 〜, 主語 ＋ 動詞 ….', 'Having finished the work, he went home.', '仕事を終えて、彼は家に帰りました。'],
      ['否定', 'Not ＋ 動詞ing 〜, 主語 ＋ 動詞 ….', 'Not knowing what to say, she kept silent.', '何と言えばよいか分からず、彼女は黙っていました。'],
    ],
    points: [
      {
        title: 'Being と過去分詞で始まる分詞構文',
        text: [
          'be動詞のまとまり（Because he was tired）を分詞構文にすると Being tired になる。Being はよく省かれ、Tired from work, 〜 のように形容詞・過去分詞で始まることもある。',
          '主語が「〜される」側なら過去分詞で始める（Seen from space＝宇宙から見られると）。',
        ],
        examples: [
          ['Being tired, he went to bed early.', '疲れていたので、彼は早く寝ました。'],
          ['Written in easy English, the book is popular with students.', 'やさしい英語で書かれているので、その本は生徒に人気があります。'],
        ],
      },
      {
        title: 'Having ＋ 過去分詞・否定',
        text: [
          '文の動詞より前に終わったことは Having＋過去分詞。受け身なら Having been＋過去分詞。否定の not・never は分詞の前に置く。',
        ],
        examples: [
          ['Having revised the proposal carefully, the committee announced its decision.', '提案を注意深く修正したあと、委員会は決定を発表しました。'],
          ['Having been warned of the storm, the hikers returned early.', '嵐の警告を受けていたので、ハイカーたちは早めに戻りました。'],
        ],
      },
      {
        title: '付帯状況の with',
        text: [
          'with＋名詞＋分詞（形容詞・前置詞句）で「〜を…した状態で・…しながら」と同時の様子を表す。名詞が「する」側なら現在分詞、「される」側なら過去分詞。',
        ],
        examples: [
          ['He listened to music with his eyes closed.', '彼は目を閉じて音楽を聞いていました。'],
          ['She was sitting with her dog lying beside her.', '彼女は犬をそばに寝そべらせて座っていました。'],
        ],
      },
    ],
    mistakes: [
      ['Seeing from space, the earth looks blue.', 'Seen from space, the earth looks blue.', '地球は「見られる」側なので過去分詞で始める。'],
      ['Knowing not what to say, she kept silent.', 'Not knowing what to say, she kept silent.', '否定の not は分詞の前。'],
      ['He listened with his eyes closing.', 'He listened with his eyes closed.', '目は「閉じられた」状態なので過去分詞。'],
    ],
    check: [
      '受け身の意味は過去分詞で始める。Being はよく省かれる。',
      '先に終わったことは Having＋過去分詞。否定は Not＋分詞。',
      'with＋名詞＋分詞＝〜を…した状態で。',
    ],
  }),

  referenceUnit({
    key: 'what',
    level: '2',
    topic: '関係代名詞 what',
    title: '関係代名詞 what の応用',
    lead: 'what は「〜すること・もの」。2級では、主語になる what 節、A is to B what C is to D（AのBに対する関係はCのDに対する関係と同じ）などの決まった言い方を学ぶ。',
    forms: [
      ['主語になる', 'What ＋ (主語) ＋ 動詞 〜 ＋ 動詞 ….', 'What he said surprised us.', '彼が言ったことは私たちを驚かせました。'],
      ['決まった言い方', 'A is to B what C is to D.', 'Reading is to the mind what food is to the body.', '読書と心の関係は、食べ物と体の関係と同じです。'],
    ],
    points: [
      {
        title: 'what 節が主語・補語になる',
        text: [
          'What で始まるまとまりが主語になるとき、動詞はふつう単数として扱う。',
        ],
        examples: [
          ['What we need now is a practical solution.', '私たちに今必要なのは、実際に役立つ解決策です。'],
          ['What the committee needs now is time to revise the proposal.', '委員会に今必要なのは、提案を修正する時間です。'],
        ],
      },
      {
        title: 'what を使った決まった言い方',
        table: [
          ['言い方', '意味'],
          ['A is to B what C is to D', 'AのBに対する関係は、CのDに対する関係と同じ'],
          ['what is called 〜 / what we call 〜', 'いわゆる〜'],
          ['what is more', 'そのうえ'],
          ['what S is', '今のS（の姿）'],
        ],
        examples: [
          ['He is what is called a genius.', '彼はいわゆる天才です。'],
        ],
      },
    ],
    mistakes: [
      ['That he said surprised us.', 'What he said surprised us.', '「彼が言ったこと」は what。that だと said の目的語がなくなる。'],
      ['The thing what we need is time.', 'What we need is time.', 'what は先行詞をふくむので the thing を並べない。'],
    ],
    check: [
      'what 節は主語・目的語・補語になる。',
      'A is to B what C is to D、what is called 〜、what is more。',
    ],
  }),

  referenceUnit({
    key: 'whose',
    level: '2',
    topic: '関係代名詞 whose',
    title: '関係代名詞 whose（その〜が…する）',
    lead: 'whose は先行詞の「持ち物・一部・関係するもの」を説明するときに使い、whose＋名詞 のまとまりで後ろにつなぐ。先行詞は人でも物でもよい。',
    forms: [
      ['形', '先行詞 ＋ whose ＋ 名詞 ＋ (主語) ＋ 動詞 〜', 'I met a man whose car was stolen.', '私は車を盗まれた男性に会いました。'],
    ],
    points: [
      {
        title: '先行詞と後ろの名詞に「の」の関係がある',
        text: [
          'a man whose car was stolen は「その人の車が盗まれた男性」。先行詞（a man）と whose の後ろの名詞（car）が「〜の…」の関係になっている。',
        ],
        examples: [
          ['She is a writer whose novels are read worldwide.', '彼女は小説が世界中で読まれている作家です。'],
          ['We visited a company whose products are sold worldwide.', '私たちは製品が世界中で売られている会社を訪ねました。'],
          ['We met a researcher whose work influenced the policy.', '私たちは、研究がその政策に影響を与えた研究者に会いました。'],
        ],
      },
      {
        title: 'who・which との見分け方',
        text: [
          '関係代名詞の後ろにすぐ名詞があり、その名詞に冠詞（a・the）や所有格がないときは whose を考える。後ろにすぐ動詞なら who / which（主格）、主語＋動詞なら目的格。',
        ],
        table: [
          ['文', '使う語'],
          ['a student who plays tennis', 'すぐ動詞 → who'],
          ['a student whose team won', 'すぐ名詞（team）→ whose'],
        ],
      },
    ],
    mistakes: [
      ['I met a man who car was stolen.', 'I met a man whose car was stolen.', '「その人の車」なので所有を表す whose。'],
      ['She is a writer whose the novels are popular.', 'She is a writer whose novels are popular.', 'whose の後ろの名詞に the を付けない。'],
    ],
    check: [
      'whose＋名詞＝その〜が…する（人にも物にも使う）。',
      '後ろにすぐ冠詞のない名詞があれば whose。',
    ],
  }),

  referenceUnit({
    key: 'relapp',
    level: '2',
    topic: '関係代名詞応用',
    title: '関係代名詞の応用（数量 ＋ of whom / which）',
    lead: '継続用法の関係代名詞の前に some of・all of・two of・none of などを置き、先行詞の一部について説明を付け足す。前置詞 of の後ろなので、人なら whom、物なら which を使う。',
    forms: [
      ['人', '先行詞, ＋ 数量 ＋ of whom ＋ 動詞 〜', 'He has two sons, both of whom are doctors.', '彼には息子が2人いて、2人とも医者です。'],
      ['物', '先行詞, ＋ 数量 ＋ of which ＋ 動詞 〜', 'We discussed three plans, none of which was practical.', '私たちは3つの計画を話し合いましたが、どれも実際的ではありませんでした。'],
    ],
    points: [
      {
        title: 'them ではなく whom・which',
        text: [
          '2つの文をコンマだけでつなぐことはできないので、both of them ではなく both of whom とする。of の後ろなので who ではなく whom。',
        ],
        table: [
          ['2つの文', '1つにした文'],
          ['He has two sons. Both of them are doctors.', 'He has two sons, both of whom are doctors.'],
          ['Ten people came. Three of them were from abroad.', 'Ten people came, three of whom were from abroad.'],
        ],
        examples: [
          ['Ten researchers attended, three of whom were from abroad.', '10人の研究者が出席し、そのうち3人は外国から来ていました。'],
          ['We met several students, two of whom had revised the proposal.', '私たちは何人かの生徒に会い、そのうち2人は提案を修正していました。'],
        ],
      },
      {
        title: 'よく使う「数量＋of which / whom」',
        table: [
          ['形', '意味'],
          ['all of which / whom', 'そのすべて'],
          ['most of which / whom', 'そのほとんど'],
          ['some of which / whom', 'そのいくつか・何人か'],
          ['none of which / whom', 'そのどれも（だれも）〜ない'],
          ['half of which / whom', 'その半分'],
        ],
        examples: [
          ['The club has forty members, most of whom are students.', 'そのクラブには40人の会員がいて、そのほとんどが学生です。'],
        ],
      },
    ],
    mistakes: [
      ['He has two sons, both of them are doctors.', 'He has two sons, both of whom are doctors.', 'コンマだけで2つの文をつながない。関係代名詞 whom を使う。'],
      ['Ten people came, three of who were from abroad.', 'Ten people came, three of whom were from abroad.', '前置詞 of の後ろは whom。'],
    ],
    check: [
      '先行詞, 数量＋of whom（人）／of which（物）。',
      'them を使うとコンマだけで文をつなぐことになるので使わない。',
    ],
  }),

  referenceUnit({
    key: 'subjunctive',
    level: '2',
    topic: '仮定法',
    title: '仮定法（I wish・as if・It’s time・without・if should）',
    lead: '仮定法過去（If＋過去形, would＋原形）を土台に、I wish（〜ならいいのに）、as if（まるで〜かのように）、It’s time（もう〜する時間だ）、Without / But for（〜がなければ）など、仮定法を使う言い方を広げる。',
    forms: [
      ['〜ならいいのに', 'I wish ＋ 主語 ＋ 過去形 〜.', 'I wish I were taller.', 'もっと背が高ければいいのに。'],
      ['まるで〜かのように', 'as if ＋ 主語 ＋ 過去形 〜', 'He acts as if he were the boss.', '彼はまるで上司であるかのようにふるまいます。'],
      ['もう〜する時間だ', 'It’s time ＋ 主語 ＋ 過去形 〜.', 'It’s time you went to bed.', 'もう寝る時間ですよ。'],
    ],
    points: [
      {
        title: '仮定法過去と I wish・as if',
        text: [
          '今の事実とちがうことは、主語が何でも be動詞を were にする。I wish・as if の後ろも同じ形。',
        ],
        examples: [
          ['If I were you, I would accept the offer.', '私があなたなら、その申し出を受けるでしょう。'],
          ['Ken wishes the committee had more time to revise the proposal.', 'ケンは委員会に提案を修正する時間がもっとあればいいのにと思っています。'],
        ],
      },
      {
        title: '「〜がなければ」の Without / But for',
        text: [
          'Without 〜・But for 〜 は If it were not for 〜（今〜がなければ）、If it had not been for 〜（あのとき〜がなかったら）の意味で使う。後ろの文の形で今か過去かを見分ける。',
        ],
        examples: [
          ['Without water, we could not live.', '水がなければ、私たちは生きられないでしょう。'],
          ['But for your help, I would have failed.', 'あなたの助けがなかったら、私は失敗していたでしょう。'],
        ],
      },
      {
        title: '万一の should・過去と今が混ざる仮定',
        text: [
          'If＋主語＋should＋原形 は「万一〜したら」という可能性の低い条件（後ろは命令文や will でもよい）。',
          '「あのとき〜していたら、今…だろう」は、If＋had＋過去分詞, would＋原形 のように前と後ろで時がずれる。',
        ],
        examples: [
          ['If you should change your mind, let me know.', '万一気が変わったら、知らせてください。'],
          ['If I had studied harder, I would be a doctor now.', 'もっと一生けんめい勉強していたら、今ごろ医者になっているでしょう。'],
        ],
      },
    ],
    mistakes: [
      ['I wish I am taller.', 'I wish I were taller.', 'I wish の後ろは過去形（be は were）。'],
      ['It’s time you go to bed.', 'It’s time you went to bed.', 'It’s time の後ろは過去形。'],
      ['Instead for your help, I would have failed.', 'But for your help, I would have failed.', '「〜がなかったら」は But for 〜（または Without 〜）。'],
    ],
    check: [
      'I wish・as if・It’s time の後ろは過去形（be は were）。',
      'Without・But for＝〜がなければ／なかったら。',
      'If 〜 should＝万一〜なら。過去の条件と今の結果の組み合わせもある。',
    ],
  }),

  referenceUnit({
    key: 'subjpastperf',
    level: '2',
    topic: '仮定法過去完了',
    title: '仮定法過去完了（あのとき〜だったら…だったのに）',
    lead: '過去の事実とちがうことを想像するときは、If＋had＋過去分詞, would have＋過去分詞 を使う。時を1つ前（過去完了）にずらして「事実ではない」ことを表す。',
    forms: [
      ['形', 'If ＋ 主語 ＋ had ＋ 過去分詞 〜, 主語 ＋ would / could have ＋ 過去分詞 ….', 'If I had known, I would have helped you.', '知っていたら、あなたを手伝ったのに。'],
      ['if を省いた形', 'Had ＋ 主語 ＋ 過去分詞 〜, 主語 ＋ would have ＋ 過去分詞 ….', 'Had I known about the delay, I would have waited.', '遅れることを知っていたら、待っていたのに。'],
    ],
    points: [
      {
        title: '過去の事実とちがう仮定',
        text: [
          '事実：I didn’t know.（知らなかった）→ 仮定：If I had known, 〜（知っていたら）。後ろは would / could / might have＋過去分詞。',
        ],
        examples: [
          ['If she had left earlier, she would have caught the train.', 'もっと早く出ていたら、彼女は電車に間に合ったでしょう。'],
          ['If I had known the truth, I would have acted differently.', '本当のことを知っていたら、ちがう行動をとったでしょう。'],
          ['If the committee had revised the proposal earlier, the outcome would have been different.', '委員会がもっと早く提案を修正していたら、結果はちがっていたでしょう。'],
        ],
      },
      {
        title: 'if を省くと倒置',
        text: [
          'If I had known は、if を省いて Had I known のように had を主語の前に出せる。Were I you（If I were you）、Should you need（If you should need）も同じ。',
        ],
        examples: [
          ['Had I known about the delay, I would have waited.', '遅れることを知っていたら、待っていたのに。'],
        ],
      },
      {
        title: 'I wish ＋ had ＋ 過去分詞',
        text: [
          '過去のことを「〜だったらよかったのに」と言うときは I wish＋主語＋had＋過去分詞。',
        ],
        examples: [
          ['I wish I had studied harder.', 'もっと一生けんめい勉強しておけばよかった。'],
        ],
      },
    ],
    mistakes: [
      ['If I knew it then, I would have helped you.', 'If I had known it then, I would have helped you.', '過去の事実とちがう仮定なら If の中は had＋過去分詞。'],
      ['If we had left earlier, we would catch the train.', 'If we had left earlier, we would have caught the train.', '過去の結果は would have＋過去分詞。'],
      ['If I would have known, I would have come.', 'If I had known, I would have come.', 'If の中に would have を置かない。'],
    ],
    check: [
      'If＋had＋過去分詞, would / could have＋過去分詞。',
      'if を省くと Had＋主語＋過去分詞。',
      'I wish＋had＋過去分詞＝〜だったらよかったのに。',
    ],
  }),

  referenceUnit({
    key: 'nounclause',
    level: '2',
    topic: '名詞節',
    title: '名詞節（that 〜 / whether 〜 / 疑問詞 〜）',
    lead: 'that・whether・疑問詞で始まるまとまりは、文の中で名詞と同じ働き（主語・目的語・補語）をする。このまとまりを名詞節という。',
    forms: [
      ['〜ということ', 'that ＋ 主語 ＋ 動詞 〜', 'That he is honest is certain.', '彼が正直なことは確かです。'],
      ['〜かどうか', 'whether ＋ 主語 ＋ 動詞 〜', 'Whether the plan will succeed remains uncertain.', 'その計画がうまくいくかどうかは、はっきりしないままです。'],
    ],
    points: [
      {
        title: 'that と whether の選び方',
        text: [
          '内容が決まっている「〜ということ」は that、決まっていない「〜かどうか」は whether（目的語なら if も使える）。',
          '文の主語になるとき、前置詞の後ろ、or not がすぐ後ろに続くときは if ではなく whether を使う。',
        ],
        examples: [
          ['I’m not sure whether he will come.', '彼が来るかどうか分かりません。'],
          ['Whether the committee will revise the proposal remains unclear.', '委員会が提案を修正するかどうかは、はっきりしないままです。'],
        ],
      },
      {
        title: '主語の that 節は it で受けることが多い',
        text: [
          'That he is honest is certain. のように that 節が主語になる文は、It is certain that he is honest. と形式主語 it を使って書くことが多い。',
        ],
        examples: [
          ['It is certain that he is honest.', '彼が正直なことは確かです。'],
        ],
      },
      {
        title: '疑問詞で始まる名詞節',
        text: [
          '疑問詞で始まる名詞節は「疑問詞＋主語＋動詞」の順。The question is how 〜（問題はどのように〜かだ）のように補語にもなる。',
        ],
        examples: [
          ['The question is how we should measure progress.', '問題は、進歩をどのように測るべきかです。'],
        ],
      },
    ],
    mistakes: [
      ['If the plan will succeed remains uncertain.', 'Whether the plan will succeed remains uncertain.', '主語になる「〜かどうか」は whether。'],
      ['I know what did he say.', 'I know what he said.', '疑問詞の後ろは「主語＋動詞」。'],
    ],
    check: [
      'that＝〜ということ、whether / if＝〜かどうか（主語・前置詞の後ろは whether）。',
      '主語の that 節は It is 〜 that … にすることが多い。',
      '疑問詞＋主語＋動詞の語順。',
    ],
  }),

  referenceUnit({
    key: 'formalobj',
    level: '2',
    topic: '形式目的語',
    title: '形式目的語 it（find it 〜 to … / make it 〜 to …）',
    lead: 'SVOC の目的語が to … や that … のように長いとき、目的語の位置に it を置き、本当の目的語を後ろに回す。この it を形式目的語という。',
    forms: [
      ['形', '主語 ＋ find / think / make ＋ it ＋ 補語 ＋ to … / that …', 'I found it hard to believe his story.', '彼の話は信じがたいと思いました。'],
    ],
    points: [
      {
        title: 'it が後ろの to … を指す',
        text: [
          'find it hard to believe 〜 の it は「〜を信じること」を指す。日本語に訳すときは it を訳さない。',
        ],
        examples: [
          ['The new data made it easy to revise the proposal.', '新しいデータのおかげで、提案を修正するのが簡単になりました。'],
          ['The news made it difficult for us to decide.', 'その知らせのせいで、私たちは決めにくくなりました。'],
          ['Many students find it difficult to evaluate online sources.', '多くの生徒は、ネット上の情報を評価するのを難しいと感じています。'],
        ],
      },
      {
        title: 'it を使った決まった言い方',
        table: [
          ['言い方', '意味'],
          ['make it a rule to 〜', '〜することにしている'],
          ['take it for granted that 〜', '〜を当然のことと思う'],
          ['owe it to A that 〜', '〜なのはAのおかげだ'],
          ['make it clear that 〜', '〜をはっきりさせる'],
        ],
        examples: [
          ['I make it a rule to walk every day.', '私は毎日歩くことにしています。'],
          ['We owe it to her support that the project succeeded.', '計画が成功したのは彼女の支えのおかげです。'],
        ],
      },
    ],
    mistakes: [
      ['I found hard to believe his story.', 'I found it hard to believe his story.', '目的語の位置に it が必要。'],
      ['I make that a rule to walk every day.', 'I make it a rule to walk every day.', '形式目的語は it。'],
    ],
    check: [
      'find / think / make＋it＋補語＋to … / that …。',
      'make it a rule to・take it for granted that・owe it to A that。',
    ],
  }),

  referenceUnit({
    key: 'inanimate',
    level: '2',
    topic: '無生物主語',
    title: '無生物主語（物・出来事が主語の文）',
    lead: '英語では「雨のせいで私たちは出かけられなかった」を The rain prevented us from going out. のように、原因となる物・出来事を主語にして言うことが多い。日本語に訳すときは「〜のおかげで・〜のせいで」とする。',
    forms: [
      ['〜のせいで…できない', '物 ＋ prevent ＋ 人 ＋ from ＋ 動詞ing', 'The heavy rain prevented us from going out.', '激しい雨のせいで、私たちは外出できませんでした。'],
      ['〜のおかげで…できる', '物 ＋ enable ＋ 人 ＋ to ＋ 原形', 'This app will enable you to track your progress.', 'このアプリを使えば、自分の進み具合を記録できます。'],
    ],
    points: [
      {
        title: '無生物主語でよく使う動詞',
        table: [
          ['形', '訳し方'],
          ['A enables 人 to 〜', 'Aのおかげで人は〜できる'],
          ['A prevents 人 from 〜ing', 'Aのせいで人は〜できない'],
          ['A makes 人 〜（原形）', 'Aのせいで人は〜する'],
          ['A takes 人 to 場所', 'Aで人は（場所）に行ける'],
          ['A brings 人 to 場所', 'Aで人は（場所）に着く'],
          ['A reminds 人 of B', 'Aを見ると人はBを思い出す'],
          ['A causes B', 'AがBを引き起こす'],
        ],
        examples: [
          ['A short walk brought us to the old castle.', '少し歩くと、古い城に着きました。'],
          ['This picture reminds me of my childhood.', 'この写真を見ると、子どものころを思い出します。'],
          ['The new system will enable the committee to revise the proposal more efficiently.', '新しい仕組みのおかげで、委員会は提案をもっと効率よく修正できるでしょう。'],
        ],
      },
      {
        title: '名詞と動詞の決まった組み合わせ',
        text: [
          'give rise to 〜（〜を引き起こす）、meet resistance（反対にあう）のように、名詞と動詞にも決まった組み合わせがある。',
        ],
        examples: [
          ['The policy gave rise to public concern.', 'その政策は人々の不安を引き起こしました。', { rise: '（名詞）発生・上昇／give rise to 〜 で「〜を引き起こす」' }],
          ['The plan is likely to meet resistance.', 'その計画は反対にあいそうです。'],
        ],
      },
    ],
    mistakes: [
      ['The rain prevented us to go out.', 'The rain prevented us from going out.', 'prevent＋人＋from＋動詞ing。'],
      ['This app will enable you tracking your progress.', 'This app will enable you to track your progress.', 'enable＋人＋to＋原形。'],
    ],
    check: [
      '無生物主語は「〜のおかげで・〜のせいで」と訳す。',
      'enable＋人＋to 〜、prevent＋人＋from 〜ing、remind＋人＋of 〜。',
    ],
  }),

  referenceUnit({
    key: 'speech',
    level: '2',
    topic: '話法',
    title: '話法（直接話法と間接話法）',
    lead: '人の言葉を " " でそのまま伝えるのが直接話法、話し手の立場で言い直して伝えるのが間接話法。間接話法では、代名詞・時制・時や場所の語を伝える側に合わせて変える。',
    forms: [
      ['ふつうの文', 'say (that) ＋ 主語 ＋ 動詞 〜', 'He said that he was busy then.', '彼はそのとき忙しいと言いました。'],
      ['Yes / No 疑問文', 'ask (人) if / whether ＋ 主語 ＋ 動詞 〜', 'She asked me if I was free.', '彼女は私にひまかどうかたずねました。'],
    ],
    points: [
      {
        title: '時制・代名詞・時の語を変える',
        text: [
          '伝える動詞（said）が過去なら、中の動詞を1つ前の時にずらす（is → was、will → would、過去 → 過去完了）。I → he のように代名詞も、now → then、today → that day、tomorrow → the next day のように時の語も変える。',
        ],
        table: [
          ['直接話法', '間接話法'],
          ['He said, “I am busy now.”', 'He said that he was busy then.'],
          ['She said, “I finished it yesterday.”', 'She said that she had finished it the day before.'],
          ['He said, “I will come tomorrow.”', 'He said that he would come the next day.'],
        ],
        examples: [
          ['She said that she had completed the task the day before.', '彼女は前の日にその仕事を終えたと言いました。'],
          ['Ken said that the committee had revised the proposal.', 'ケンは委員会が提案を修正したと言いました。'],
        ],
      },
      {
        title: '疑問文・命令文を伝える',
        text: [
          'Yes / No 疑問文は ask＋人＋if / whether 〜、疑問詞のある疑問文は ask＋人＋疑問詞＋主語＋動詞。命令文は tell＋人＋to 〜、お願いは ask＋人＋to 〜 で伝える。',
        ],
        examples: [
          ['He asked me why I had changed the plan.', '彼は私に、なぜ計画を変えたのかたずねました。'],
          ['The teacher told us to be quiet.', '先生は私たちに静かにするように言いました。'],
        ],
      },
      {
        title: 'say と tell',
        text: [
          'say は後ろに内容（that 〜）を置き、相手は to 人 で表す。tell は後ろにすぐ相手を置く（tell me that 〜）。',
        ],
        examples: [
          ['He told me that he was tired.', '彼は私に疲れていると言いました。'],
        ],
      },
    ],
    mistakes: [
      ['He said me that he was tired.', 'He told me that he was tired.', '相手をすぐ後ろに置くのは tell。'],
      ['She asked me that I was free.', 'She asked me if I was free.', 'Yes / No 疑問文を伝えるときは if / whether。'],
      ['He said that he is busy then.', 'He said that he was busy then.', 'said に合わせて中の動詞も過去にする。'],
    ],
    check: [
      '間接話法では、時制を1つ前に、代名詞・時の語を伝える側に合わせる。',
      '疑問文は ask if / 疑問詞、命令文は tell＋人＋to 〜。',
      'say＋内容、tell＋人＋内容。',
    ],
  }),

  referenceUnit({
    key: 'emphasis',
    level: '2',
    topic: '強調',
    title: '強調（do / does / did・the very・再帰代名詞）',
    lead: '動詞・名詞・主語などを強める言い方を学ぶ。動詞は do / does / did＋原形、名詞は the very＋名詞、主語は再帰代名詞（himself など）で強める。',
    forms: [
      ['動詞を強める', 'do / does / did ＋ 原形', 'I do want to see you.', '本当にあなたに会いたいのです。'],
      ['名詞を強める', 'the very ＋ 名詞', 'This is the very reason I opposed the proposal.', 'これこそ私が提案に反対した理由です。'],
    ],
    points: [
      {
        title: '動詞を強める do・does・did',
        text: [
          'ふつうの文の動詞の前に do / does / did を置き、動詞を原形にすると「本当に〜する・確かに〜した」と強まる。',
        ],
        examples: [
          ['I did see someone enter the room.', '私は確かにだれかが部屋に入るのを見ました。'],
          ['We do enjoy your class, Ms. Sato.', '佐藤先生、私たちは先生の授業を本当に楽しんでいます。'],
        ],
      },
      {
        title: '名詞・主語・否定を強める語',
        table: [
          ['言い方', '強めるもの'],
          ['the very ＋ 名詞', 'まさにその〜'],
          ['名詞 ＋ itself', '〜そのもの'],
          ['主語 ＋ 再帰代名詞', '〜自身が'],
          ['not 〜 at all', 'まったく〜ない'],
          ['疑問詞 ＋ on earth / in the world', 'いったい〜'],
        ],
        examples: [
          ['The idea itself is good.', 'その考えそのものはよいです。'],
          ['The president himself answered the letter.', '社長自身がその手紙に返事を書きました。'],
          ['What on earth are you doing?', 'いったい何をしているのですか。', { earth: 'on earth で「いったい」（疑問詞を強める）' }],
        ],
      },
    ],
    mistakes: [
      ['I did saw someone enter the room.', 'I did see someone enter the room.', '強めの did の後ろは原形。'],
      ['This is the much reason I opposed it.', 'This is the very reason I opposed it.', '「まさにその〜」は the very。'],
    ],
    check: [
      'do / does / did＋原形で動詞を強める。',
      'the very＋名詞・名詞＋itself・主語＋再帰代名詞。',
    ],
  }),

  referenceUnit({
    key: 'cleft',
    level: '2',
    topic: '強調構文',
    title: '強調構文（It is 〜 that …）',
    lead: '文の中の1つの語句（主語・目的語・時・場所など）を It is / was と that ではさみ、「…なのは〜だ」と強める。It is と that を取ると、もとの文に戻せるのが見分け方。',
    forms: [
      ['形', 'It is / was ＋ 強める語句 ＋ that ＋ 残りの文', 'It was John that broke the window.', '窓を割ったのはジョンでした。'],
    ],
    points: [
      {
        title: '何でも強められる',
        text: [
          '主語・目的語・時・場所・理由などを強められる。強めるのが人なら that の代わりに who も使える。',
        ],
        table: [
          ['もとの文', '強調構文'],
          ['I met her in Paris.', 'It was in Paris that I met her.'],
          ['The committee revised the proposal yesterday.', 'It was yesterday that the committee revised the proposal.'],
          ['The final interview changed her decision.', 'It was the final interview that changed her decision.'],
        ],
        examples: [
          ['It was the final report that changed their plan.', '彼らの計画を変えたのは、最終報告書でした。'],
        ],
      },
      {
        title: '形式主語の文との見分け方',
        text: [
          'It is 〜 that … から It is と that を取って文が成り立てば強調構文。It is important that you come.（来ることが大切だ）は、取ると文にならないので形式主語の文。',
        ],
        examples: [
          ['It is important that you come.', 'あなたが来ることが大切です。'],
        ],
      },
      {
        title: '疑問詞を強める',
        text: [
          '疑問詞を強めるときは「疑問詞＋is / was it that 〜?」の順にする（Who was it that broke the vase?＝花びんを割ったのはいったいだれだったのか）。',
        ],
        examples: [
          ['Who was it that broke the vase?', '花びんを割ったのはいったいだれだったのですか。'],
        ],
      },
    ],
    mistakes: [
      ['It was in Paris where I met her.', 'It was in Paris that I met her.', '強調構文では that を使う（in Paris のような語句を強めるとき where は使わない）。'],
      ['It was John what broke the window.', 'It was John that broke the window.', '強調構文は It is 〜 that …（人なら who も可）。'],
    ],
    check: [
      'It is / was＋強める語句＋that＋残りの文。',
      'It is と that を取って文が成り立てば強調構文。',
      '疑問詞は 疑問詞＋is / was it that 〜?',
    ],
  }),

  referenceUnit({
    key: 'inversion',
    level: '2',
    topic: '倒置',
    title: '倒置（So do I・Never have I 〜・Only then did 〜）',
    lead: '否定の語句や only をふくむ語句を文の最初に出すと、その後ろが疑問文と同じ「助動詞（be動詞）＋主語」の順になる。相手に合わせる So do I・Neither can I も同じ形。',
    forms: [
      ['〜もそうだ', 'So ＋ 助動詞・be動詞 ＋ 主語.', 'I like coffee. — So do I.', '私はコーヒーが好きです。— 私もです。'],
      ['否定の語句を前に', 'Never / Only 〜 ＋ 助動詞 ＋ 主語 ＋ 動詞 〜.', 'Never have I seen such rapid change.', 'こんなに急な変化は見たことがありません。'],
    ],
    points: [
      {
        title: 'So do I と Neither can I',
        text: [
          'ふつうの文に「〜もそうだ」と合わせるときは So＋助動詞＋主語、否定文に「〜もそうではない」と合わせるときは Neither（Nor）＋助動詞＋主語。助動詞は前の文の動詞に合わせる。',
        ],
        examples: [
          ['I can’t swim. — Neither can I.', '私は泳げません。— 私もです。'],
          ['The committee supports the change, and so does Ken.', '委員会はその変更を支持しており、ケンもそうです。'],
        ],
      },
      {
        title: '否定・only の語句を前に出す',
        text: [
          'Never・Hardly・Little・Not only・Only then など、否定や「〜して初めて」の語句を文の最初に置くと、後ろは「助動詞＋主語＋動詞」の順になる。一般動詞の文なら do / does / did を使う。',
        ],
        examples: [
          ['Only then did I understand the truth.', 'そのとき初めて私は真実を理解しました。'],
          ['Only then did the team understand the risk.', 'そのとき初めて、チームは危険を理解しました。'],
        ],
      },
    ],
    advanced: {
      level: 'pre1',
      title: '場所の語句や補語を前に出す倒置',
      text: [
        'Here comes the bus.（ほらバスが来た）や Happy are those who 〜（〜する人は幸せだ）のように、場所の語句や補語を前に出して「動詞＋主語」の順にする倒置もある（準1級で学ぶ）。',
      ],
      examples: [
        ['Here comes the bus.', 'ほら、バスが来ましたよ。'],
      ],
    },
    mistakes: [
      ['Never I have seen such a change.', 'Never have I seen such a change.', '否定の語句を前に出したら「助動詞＋主語」の順。'],
      ['I can’t swim. — So can’t I.', 'I can’t swim. — Neither can I.', '否定文に合わせるときは Neither＋助動詞＋主語。'],
      ['Only then I understood the truth.', 'Only then did I understand the truth.', 'Only then を前に出したら did＋主語＋原形。'],
    ],
    check: [
      'So＋助動詞＋主語＝〜もそうだ、Neither＋助動詞＋主語＝〜もそうではない。',
      'Never・Only then などを前に出すと「助動詞＋主語＋動詞」。',
    ],
  }),

  referenceUnit({
    key: 'partialneg',
    level: '2',
    topic: '部分否定',
    title: '部分否定（not all / not always / not necessarily）',
    lead: 'all・every・always・both・necessarily などに not を組み合わせると、「すべてが〜というわけではない」「いつも〜とは限らない」という部分否定になる。全部を打ち消す全否定との区別が大切。',
    forms: [
      ['部分否定', 'not ＋ all / every / always / both / necessarily', 'Not all of them agreed.', '彼ら全員が賛成したわけではありません。'],
      ['全否定', 'no / none / never / neither', 'None of them agreed.', '彼らのだれも賛成しませんでした。'],
    ],
    points: [
      {
        title: '部分否定と全否定',
        table: [
          ['部分否定（一部は〜）', '全否定（全部〜ない）'],
          ['Not all students agreed.（全員が賛成したわけではない）', 'No students agreed.（だれも賛成しなかった）'],
          ['He is not always busy.（いつも忙しいとは限らない）', 'He is never busy.（決して忙しくない）'],
          ['I don’t know both of them.（両方を知っているわけではない）', 'I know neither of them.（どちらも知らない）'],
        ],
        examples: [
          ['Expensive products are not always better than cheap ones.', '高い製品がいつも安い製品よりよいとは限りません。'],
          ['Not everyone was satisfied with the result.', '全員がその結果に満足したわけではありません。'],
          ['A high score does not necessarily indicate deep understanding.', '高い点数が必ずしも深い理解を示すわけではありません。'],
        ],
      },
      {
        title: 'not necessarily と二重否定',
        text: [
          'not necessarily（必ずしも〜ではない）も部分否定。never 〜 without …ing（…せずには〜しない＝〜すると必ず…する）のように否定を2つ重ねると、強い肯定になる。',
        ],
        examples: [
          ['The rich are not always happy.', 'お金持ちがいつも幸せとは限りません。'],
          ['He never meets her without talking about music.', '彼は彼女に会うと必ず音楽の話をします。'],
        ],
      },
    ],
    mistakes: [
      ['No all of them agreed.', 'Not all of them agreed.', '部分否定は not all。'],
      ['None everyone was satisfied.', 'Not everyone was satisfied.', '「全員が〜というわけではない」は not everyone。'],
    ],
    check: [
      'not all / every / always / both / necessarily＝部分否定。',
      'no / none / never / neither＝全否定。',
    ],
  }),

  referenceUnit({
    key: 'conj',
    level: '2',
    topic: '接続詞',
    title: '接続詞（in case / now that / as far as / even though など）',
    lead: '2級でよく出る、2語以上で1つの接続詞になるもの（in case・now that・as far as・even though・even if など）を中心に、意味のちがいを確かめる。',
    forms: [
      ['〜するといけないから', '文 ＋ in case ＋ 主語 ＋ 動詞 〜', 'Take an umbrella in case it rains.', '雨が降るといけないから傘を持っていきなさい。'],
      ['今や〜なので', 'Now that ＋ 主語 ＋ 動詞 〜, …', 'Now that you are here, let’s begin.', 'あなたが来たので、始めましょう。'],
    ],
    points: [
      {
        title: '2語以上で働く接続詞',
        table: [
          ['接続詞', '意味'],
          ['in case', '〜するといけないから・〜の場合に備えて'],
          ['now that', '今や〜なので'],
          ['as far as', '〜する限り（範囲）'],
          ['as long as', '〜する限り（条件）'],
          ['even though', '（実際に）〜だけれども'],
          ['even if', '（たとえ）〜だとしても'],
          ['so that', '〜するように'],
        ],
        examples: [
          ['As far as I know, he is honest.', '私の知る限り、彼は正直です。'],
          ['Even though he was tired, he kept working.', '彼は疲れていたけれど、働き続けました。'],
          ['Even if it rains tomorrow, the game will be held.', 'たとえ明日雨が降っても、試合は行われます。'],
        ],
      },
      {
        title: 'even though と even if',
        text: [
          'even though は「実際に〜だけれども（事実）」、even if は「たとえ〜だとしても（仮定）」。',
        ],
        examples: [
          ['Since Ken forgot his umbrella, he got soaked coming home.', 'ケンは傘を忘れたので、帰り道にずぶぬれになりました。'],
        ],
      },
      {
        title: '前置詞をふくむ語の組み合わせ',
        text: [
          'distinguish A from B（AとBを区別する）、account for 〜（〜を説明する・〜の割合を占める）のように、動詞と前置詞の組み合わせも決まっている。',
        ],
        examples: [
          ['We should distinguish facts from opinions.', '私たちは事実と意見を区別するべきです。'],
          ['His explanation accounts for the difference.', '彼の説明でそのちがいが説明できます。'],
        ],
      },
    ],
    mistakes: [
      ['Take an umbrella in case it will rain.', 'Take an umbrella in case it rains.', 'in case の中は未来のことでも現在形。'],
      ['He kept working even he was tired.', 'He kept working even though he was tired.', 'even だけでは接続詞にならない。「〜だけれども」は even though、「たとえ〜でも」は even if。'],
    ],
    check: [
      'in case＝〜するといけないから、now that＝今や〜なので。',
      'as far as＝〜する限り（範囲）、as long as＝〜する限り（条件）。',
      'even though＝実際に〜だけれど、even if＝たとえ〜でも。',
    ],
  }),

  referenceUnit({
    key: 'connadv',
    level: '2',
    topic: '接続副詞',
    title: '接続副詞（however / therefore / moreover など）',
    lead: 'however・therefore・moreover などは、前の文と後ろの文の意味のつながり（逆・結果・追加）を示す副詞。接続詞ではないので、2つの文をコンマだけでつながず、ピリオドかセミコロン（;）で区切る。',
    forms: [
      ['形', '文. However, 文. ／ 文; however, 文.', 'He is rich; however, he is not happy.', '彼はお金持ちです。しかし、幸せではありません。'],
    ],
    points: [
      {
        title: '意味で選ぶ',
        table: [
          ['意味', '接続副詞'],
          ['逆（しかし）', 'however・nevertheless'],
          ['結果（したがって）', 'therefore・thus・consequently'],
          ['追加（そのうえ）', 'moreover・furthermore・in addition'],
          ['例（たとえば）', 'for example・for instance'],
          ['言いかえ（つまり）', 'in other words'],
          ['そうしないと', 'otherwise'],
        ],
        examples: [
          ['The road was closed; therefore, we took another route.', '道路が閉鎖されていたので、私たちは別の道を通りました。'],
          ['The plan is affordable; moreover, it can be carried out quickly.', 'その計画は費用が手ごろで、そのうえすぐに実行できます。'],
          ['The evidence was conclusive; therefore, the board approved the budget.', '証拠が決定的だったので、理事会は予算を承認しました。'],
        ],
      },
      {
        title: '句読点のルール',
        text: [
          'however などで2つの文をつなぐときは、前にピリオドかセミコロンを置き、後ろにコンマを置く。but と however を重ねない。',
        ],
        examples: [
          ['The sample was small; however, the results were consistent.', '標本は少なかったものの、結果は一貫していました。'],
        ],
      },
    ],
    mistakes: [
      ['The sample was small, however the results were consistent.', 'The sample was small; however, the results were consistent.', 'however では2つの文をコンマだけでつながない。'],
      ['But however, the plan failed.', 'However, the plan failed.', '同じ「しかし」を2つ重ねない。'],
    ],
    check: [
      'however（しかし）・therefore（したがって）・moreover（そのうえ）・otherwise（そうしないと）。',
      '文と文はピリオドかセミコロンで区切り、接続副詞の後ろにコンマ。',
    ],
  }),

  referenceUnit({
    key: 'comparison',
    level: '2',
    topic: '比較応用',
    title: '比較の応用（No other 〜・the 比較級 of the two・less than）',
    lead: '最上級と同じ意味を表す No other 〜 as / 比較級 than、2つのうちで「〜なほう」の the＋比較級 of the two、「…ほど〜でない」の less 〜 than などを学ぶ。',
    forms: [
      ['最上級と同じ意味', 'No other ＋ 単数名詞 ＋ is as 〜 as A / 比較級 than A', 'No other student is as tall as Tom.', 'トムほど背の高い生徒はほかにいません。'],
      ['2つのうちで〜なほう', 'the ＋ 比較級 ＋ of the two', 'He is the taller of the two.', '彼は2人のうちで背が高いほうです。'],
    ],
    points: [
      {
        title: '最上級の言いかえ',
        table: [
          ['言い方', '文'],
          ['最上級', 'Tom is the tallest student in the class.'],
          ['比較級＋than any other', 'Tom is taller than any other student in the class.'],
          ['No other ＋ as 〜 as', 'No other student in the class is as tall as Tom.'],
          ['No other ＋ 比較級 than', 'No other student in the class is taller than Tom.'],
        ],
        examples: [
          ['No other building here is as tall as the city hall.', 'ここには市役所ほど高い建物はほかにありません。'],
        ],
      },
      {
        title: '比較のいろいろな言い方',
        table: [
          ['言い方', '意味'],
          ['less 〜 than …', '…ほど〜でない'],
          ['倍数 ＋ as 〜 as …', '…の〜倍'],
          ['as 〜 as possible', 'できるだけ〜'],
          ['no more than 〜', 'たった〜（少ないという気持ち）'],
          ['no less than 〜', '〜も（多いという気持ち）'],
          ['not so much A as B', 'AというよりむしろB'],
        ],
        examples: [
          ['This hall is three times as large as the old one.', 'このホールは古いホールの3倍の広さです。'],
          ['This problem is less difficult than it looks.', 'この問題は見た目ほど難しくありません。'],
          ['He is not so much a scholar as a writer.', '彼は学者というよりむしろ作家です。'],
        ],
      },
    ],
    mistakes: [
      ['No other student is so tall than Tom.', 'No other student is taller than Tom.', 'No other の後ろは as 〜 as か 比較級＋than。'],
      ['He is the tallest of the two.', 'He is the taller of the two.', '2人の中では the＋比較級。'],
    ],
    check: [
      'No other＋単数名詞＋as 〜 as / 比較級 than＝最上級と同じ意味。',
      'the＋比較級＋of the two＝2つのうちで〜なほう。',
      'less 〜 than＝…ほど〜でない、not so much A as B＝AというよりB。',
    ],
  }),

  referenceUnit({
    key: 'prep',
    level: '2',
    topic: '前置詞',
    title: '前置詞（語と語の決まった組み合わせ）',
    lead: '2級では、place a burden on（〜に負担をかける）のように、動詞や名詞と前置詞が決まった組み合わせで使われるものが増える。前置詞の基本の意味（on＝上にのしかかる、for＝向かう先 など）と結びつけて確かめる。',
    forms: [
      ['形', '動詞・名詞 ＋ 決まった前置詞 ＋ 名詞', 'The new system places a burden on small schools.', '新しい仕組みは小さな学校に負担をかけます。'],
    ],
    points: [
      {
        title: '動詞・名詞と前置詞の組み合わせ',
        table: [
          ['言い方', '意味'],
          ['place a burden on 〜', '〜に負担をかける'],
          ['have an effect on 〜', '〜に影響を与える'],
          ['depend on 〜', '〜しだいだ・〜に頼る'],
          ['account for 〜', '〜を説明する・〜の割合を占める'],
          ['distinguish A from B', 'AとBを区別する'],
          ['get over 〜', '〜から立ち直る'],
          ['go through 〜', '〜を経験する'],
        ],
        examples: [
          ['Music has a strong effect on our mood.', '音楽は私たちの気分に強い影響を与えます。'],
          ['It took him a long time to get over the illness.', '彼がその病気から回復するのには長い時間がかかりました。'],
        ],
      },
      {
        title: '名詞に変えた動詞と前置詞',
        text: [
          'cancel the concert（コンサートを中止する）を名詞にすると the cancellation of the concert（コンサートの中止）のように of でつなぐ。論説文でよく使う形。',
        ],
        examples: [
          ['The cancellation of the concert disappointed many fans.', 'コンサートの中止は多くのファンをがっかりさせました。'],
        ],
      },
      {
        title: '前置詞をふくむ決まった言い方',
        table: [
          ['言い方', '意味'],
          ['in addition (to 〜)', '（〜に）加えて'],
          ['at least', '少なくとも'],
          ['on the other hand', '一方で'],
          ['in spite of 〜', '〜にもかかわらず'],
          ['according to 〜', '〜によれば'],
        ],
        examples: [
          ['According to the report, the number of visitors increased.', 'その報告によれば、訪問者の数は増えました。'],
        ],
      },
    ],
    mistakes: [
      ['The system places a burden to small schools.', 'The system places a burden on small schools.', '「〜に負担をかける」は place a burden on 〜。'],
      ['We should distinguish facts with opinions.', 'We should distinguish facts from opinions.', 'distinguish A from B。'],
    ],
    check: [
      'place a burden on・have an effect on・account for・distinguish A from B。',
      '名詞化した動詞は of でつなぐ（the cancellation of 〜）。',
      'in addition・at least・according to。',
    ],
  }),
]
