import { st } from './entry.js'

export default Object.freeze([
  st('[S The radio club {前| at our school}] [M almost] [V stopped] [M two years ago].', {
    chunks: [
      ['The radio club at our school', '私たちの学校の放送部は'],
      ['almost stopped two years ago', '2年前、もう少しで止まるところでした'],
    ],
    notes: {
      'The radio club at our school': 'at our school は club を後ろから説明して「私たちの学校の放送部」。',
      'almost stopped two years ago': 'almost は「もう少しで」。almost stopped で「もう少しで（活動が）止まるところだった」となり、実際には止まらなかったことを表します。',
    },
  }),
  st('[S Three members] [V remained], [接 and] [S the lunch program] [V ran] [M {前| for four minutes}].', {
    chunks: [
      ['Three members remained,', '3人の部員が残り'],
      ['and the lunch program ran for four minutes', 'そして、昼の番組は4分間流れていました'],
    ],
    notes: {
      'Three members remained,': 'remain は「残る」。',
      'and the lunch program ran for four minutes': 'run はここでは「（番組が）続く・流れる」。for four minutes で番組の長さを表します。',
    },
  }),
  st('[S Most students] [V paid] [O no attention] [M {前| to the sound {前| in the halls}}].', {
    chunks: [
      ['Most students paid no attention', 'ほとんどの生徒は、注意を払っていませんでした（何にかは次へ）'],
      ['to the sound in the halls', '廊下に流れる音に'],
    ],
    notes: {
      'Most students paid no attention': 'pay attention to 〜 で「〜に注意を払う」。no attention で「まったく注意を払わない」。',
      'to the sound in the halls': 'in the halls は sound を後ろから説明して「廊下に流れる音」。hall はここでは「廊下」。',
    },
  }),
  st('[S A new adviser] [V asked] [O the club] [C {to:補語| [V to study] [O its own audience]}].', {
    chunks: [
      ['A new adviser asked the club', '新しい顧問は、部に頼みました（何をかは次へ）'],
      ['to study its own audience', '自分たちの聞き手を調べるように'],
    ],
    notes: {
      'A new adviser asked the club': 'adviser は部の「顧問」。ask ＋ O ＋ to 〜 で「O に〜するよう頼む」。',
      'to study its own audience': 'its は the club を指します。study はここでは「調べる」、audience は「聞き手」。',
    },
  }),
  st('[S The members] [V wrote] [O a short survey] [接 and] [V collected] [O two hundred answers].', {
    chunks: [
      ['The members wrote a short survey', '部員たちは短い調査票を作り'],
      ['and collected two hundred answers', 'そして、200の回答を集めました'],
    ],
    notes: {
      'The members wrote a short survey': 'survey はここでは「アンケート（調査票）」。write a survey で「調査票を作る」。',
    },
  }),
  st('[S The comments] [V were] [C {並列| direct | and sometimes painful}].', {
    chunks: [
      ['The comments were direct', 'その意見は率直で'],
      ['and sometimes painful', 'ときにはつらいものでした'],
    ],
    notes: {
      'The comments were direct': 'comment は調査票に書かれた「意見」。direct は「率直な・遠回しでない」。',
      'and sometimes painful': 'were の補語が direct と painful の二つです。sometimes は painful だけにかかります。',
    },
  }),
  st('[S Students] [V said] [O {that節| [接 that] [S the voices] [V were] [C too fast]}].', {
    chunks: [
      ['Students said that', '生徒たちは〜と言いました（内容は次へ）'],
      ['the voices were too fast', '声が速すぎる（と）'],
    ],
    notes: {
      'the voices were too fast': 'the voices は、放送で読む部員たちの声です。too は「〜すぎる」。',
    },
  }),
  st('[S The topics] [V felt] [C far {前| from daily life}].', {
    chunks: [
      ['The topics felt far', '話題は遠く感じられました（何からかは次へ）'],
      ['from daily life', '日々の生活から'],
    ],
    notes: {
      'The topics felt far': 'feel ＋ 形容詞 で「〜に感じられる」。far from 〜 で「〜から遠い」。',
    },
  }),
  st('[S One comment] [V asked] [M {前| for news {前| about the student council election}}].', {
    chunks: [
      ['One comment asked for news', 'ある意見は、知らせを求めていました（何のかは次へ）'],
      ['about the student council election', '生徒会の選挙についての'],
    ],
    notes: {
      'One comment asked for news': 'ask for 〜 で「〜を求める」。news は数えられない名詞で「知らせ」。',
      'about the student council election': 'student council は「生徒会」、election は「選挙」。',
    },
  }),
  st('[S The club] [V changed] [O the program] [M {前| in three ways}].', {
    chunks: [
      ['The club changed the program', '部は番組を変えました（どのようにかは次へ）'],
      ['in three ways', '三つの点で'],
    ],
    notes: {
      'in three ways': 'way はここでは「点・方法」。どう変えたかは、次の文から具体的に書かれます。',
    },
  }),
  st('[S Each member] [M now] [V writes] [O a script] [接 and] [V reads] [O it] [M slowly] [M {前| before lunch}].', {
    chunks: [
      ['Each member now writes a script', 'それぞれの部員は今、原稿を書き'],
      ['and reads it slowly before lunch', 'そして、昼食の前にそれをゆっくり読みます'],
    ],
    notes: {
      'Each member now writes a script': 'each は単数として扱うので writes。script は放送で読む「原稿」。now は変えたあとの「今は」。',
      'and reads it slowly before lunch': 'it は a script を指します。',
    },
  }),
  st('[S An older student] [V checks] [O {並列| the speed | and the volume}].', {
    chunks: [
      ['An older student', '上級生が'],
      ['checks the speed and the volume', '読む速さと音量を確かめます'],
    ],
    notes: {
      'An older student': 'older student は「年上の生徒・上級生」。',
      'checks the speed and the volume': 'the speed は、前の文で原稿を読むときの速さです。volume は「音量」。',
    },
  }),
  st('[S The club] [V pronounces] [O the names {前| of {並列| clubs | and teachers}}] [M {前| with care}].', {
    chunks: [
      ['The club pronounces the names', '部は名前を発音します（何のかは次へ）'],
      ['of clubs and teachers', '部活や先生の'],
      ['with care', '気をつけて'],
    ],
    notes: {
      'The club pronounces the names': 'pronounce は「発音する」。',
      'with care': 'with care は「注意して」で、carefully と同じ意味です。',
    },
  }),
  st('[S A short summary {前| at the end}] [V repeats] [O the two main points].', {
    chunks: [
      ['A short summary at the end', '終わりの短いまとめが'],
      ['repeats the two main points', '二つの要点を繰り返します'],
    ],
    notes: {
      'A short summary at the end': 'at the end は summary を後ろから説明して「（番組の）終わりのまとめ」。',
      'repeats the two main points': 'main point は「要点」。',
    },
  }),
  st('[S The topics] [V changed] [M too].', {
    chunks: [
      ['The topics changed too', '話題も変わりました'],
    ],
    notes: {
      'The topics changed too': 'too は「〜も」。前の段落の伝え方に加えて、話題も変わったことを表します。',
    },
  }),
  st('[S Reporters] [M now] [V visit] [O {並列| the school nurse | and the cooking staff}].', {
    chunks: [
      ['Reporters now visit', '取材係は今、訪ねます（だれをかは次へ）'],
      ['the school nurse and the cooking staff', '保健の先生と給食の職員を'],
    ],
    notes: {
      'Reporters now visit': 'reporter は、番組のために話を聞きに行く「取材係」です。',
      'the school nurse and the cooking staff': 'school nurse は「保健の先生」、cooking staff は「給食を作る職員」。',
    },
  }),
  st('[S The librarian] [V joins] [O a monthly program {前| about new books}].', {
    chunks: [
      ['The librarian joins a monthly program', '司書は毎月の番組に加わります（何についてのかは次へ）'],
      ['about new books', '新しい本についての'],
    ],
    notes: {
      'The librarian joins a monthly program': 'librarian は図書館の「司書」。monthly は「毎月の」。',
    },
  }),
  st('[S A weekly part {前| of the program}] [V explains] [O {並列| one English word | or one old local word}].', {
    chunks: [
      ['A weekly part of the program', '番組の中の、毎週の一部分が'],
      ['explains one English word', '英語の単語を一つ説明します'],
      ['or one old local word', 'または、昔からの地元の言葉を一つ'],
    ],
    notes: {
      'A weekly part of the program': 'weekly は「毎週の」。番組の中で、毎週決まってある一部分のことです。',
      'or one old local word': 'old local word は、その土地で昔から使われてきた言葉です。',
    },
  }),
  st('[S A short weather report] [V follows] [O the news] [M every day].', {
    chunks: [
      ['A short weather report', '短い天気予報が'],
      ['follows the news every day', '毎日、ニュースのあとに続きます'],
    ],
    notes: {
      'follows the news every day': 'follow は「〜のあとに続く」で、the news が目的語です。',
    },
  }),
  st('[M {前| During the election}], [S the club] [V gave] [O the same three minutes] [M {前| to each student}].', {
    chunks: [
      ['During the election,', '選挙のあいだ'],
      ['the club gave the same three minutes', '部は同じ3分を与えました（だれにかは次へ）'],
      ['to each student', 'それぞれの生徒に'],
    ],
    notes: {
      'During the election,': 'the election は、第9文の生徒会の選挙です。',
      'the club gave the same three minutes': 'give A to B で「B に A を与える」。the same three minutes は、どの生徒にも同じ長さの3分ということです。',
    },
  }),
  st('[S An official {前| from the town office}] [V talked] [M {前| about the disaster practice {前| in early summer}}].', {
    chunks: [
      ['An official from the town office talked', '町役場の職員が話しました（何についてかは次へ）'],
      ['about the disaster practice in early summer', '初夏の防災訓練について'],
    ],
    notes: {
      'An official from the town office talked': 'official はここでは名詞で「職員」。town office は「町役場」。',
      'about the disaster practice in early summer': 'disaster practice は「災害に備える練習」＝防災訓練。in early summer は practice を後ろから説明して「初夏の訓練」。',
    },
  }),
  st('[S The audience] [V grew], [接 but] [S the work] [V became] [C heavier].', {
    chunks: [
      ['The audience grew,', '聞き手は増えました'],
      ['but the work became heavier', 'しかし、仕事は重くなりました'],
    ],
    notes: {
      'The audience grew,': 'audience は聞き手全体を表し、grow で「（数が）増える」。',
      'but the work became heavier': 'heavier は heavy の比較級で、仕事の負担が前より重くなったことを表します。',
    },
  }),
  st('[S Members] [V hesitate] [M {前| before a difficult program}], [接 and] [S some {前| of them}] [M still] [V shake].', {
    chunks: [
      ['Members hesitate before a difficult program,', '部員は難しい番組の前にためらい'],
      ['and some of them still shake', 'そして、その中の何人かは今でも震えます'],
    ],
    notes: {
      'Members hesitate before a difficult program,': 'hesitate は「ためらう」。',
      'and some of them still shake': 'them は Members を指します。still は「今でも」、shake は「（緊張で）震える」。',
    },
  }),
  st('[S The adviser] [V tells] [O1 them] [O2 {that節| [接 that] [S a small mistake] [V is not] [C a failure]}].', {
    chunks: [
      ['The adviser tells them that', '顧問は彼らに〜と伝えます（内容は次へ）'],
      ['a small mistake is not a failure', '小さな誤りは失敗ではない（と）'],
    ],
    notes: {
      'The adviser tells them that': 'tell ＋ 人 ＋ that 〜 で「人に〜と伝える」。them は部員たちを指します。',
    },
  }),
  st('[S The club] [V admits] [O a mistake] [接 and] [V moves on].', {
    chunks: [
      ['The club admits a mistake', '部は誤りを認め'],
      ['and moves on', 'そして、先へ進みます'],
    ],
    notes: {
      'The club admits a mistake': 'admit は「（誤りなどを）認める」。',
      'and moves on': 'move on で「（こだわらずに）先へ進む」。on は動詞と一組なので、動詞Vの中に入れます。',
    },
  }),
  st('[S They] [V express] [O their own opinions] [M briefly] [接 and] [V leave] [O the rest] [M {前| to the audience}].', {
    chunks: [
      ['They express their own opinions briefly', '彼らは自分たちの意見を短く述べ'],
      ['and leave the rest to the audience', 'そして、残りは聞き手にゆだねます'],
    ],
    notes: {
      'They express their own opinions briefly': 'They は部員たちを指します。express は「（考えを）述べる」、briefly は「短く」。',
      'and leave the rest to the audience': 'leave A to B で「A を B にゆだねる」。the rest は、それ以上どう考えるかのことです。',
    },
  }),
  st('[S The club] [M now] [V has] [O a clear role] [M {前| in an emergency}].', {
    chunks: [
      ['The club now has a clear role', '部は今、はっきりした役割を持っています（どんなときにかは次へ）'],
      ['in an emergency', '非常時に'],
    ],
    notes: {
      'in an emergency': 'emergency は「非常時・緊急のとき」。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S a disaster] [V stops] [O the school bell]}], [S the radio room] [V carries] [O the announcement].', {
    chunks: [
      ['If a disaster stops the school bell,', 'もし災害が学校のチャイムを止めたら'],
      ['the radio room carries the announcement', '放送室が知らせを伝えます'],
    ],
    notes: {
      'If a disaster stops the school bell,': '非常時の決まった手順を述べているので、if の節も主節も現在形です。',
      'the radio room carries the announcement': 'carry はここでは「（知らせを）伝える・流す」。',
    },
  }),
  st('[S {並列| A battery | and a simple device}] [V keep] [O the speakers] [C working] [M {前| for two hours}].', {
    chunks: [
      ['A battery and a simple device', '電池と簡単な装置が'],
      ['keep the speakers working', 'スピーカーを動かし続けます（どのくらいかは次へ）'],
      ['for two hours', '2時間'],
    ],
    notes: {
      'A battery and a simple device': '主語が and で二つ並ぶので、動詞は s のつかない keep です。',
      'keep the speakers working': 'keep ＋ O ＋ -ing で「O が〜している状態を保つ」。スピーカーが動いている（working）状態を保つということです。',
    },
  }),
  st('[S The members] [V practice] [O the emergency words] [M once a month].', {
    chunks: [
      ['The members practice the emergency words', '部員たちは非常時の言葉を練習します'],
      ['once a month', '月に一度'],
    ],
    notes: {
      'The members practice the emergency words': 'the emergency words は、非常時の放送で使う決まった言葉です。',
      'once a month': 'a は「〜につき」で、once a month は「1か月に1回」。',
    },
  }),
  st('[S They] [V say] [O {that節| [接 that] [S a voice {前| in the halls}] [V is] [C a small form {前| of communication}]}].', {
    chunks: [
      ['They say that', '彼らは〜と言います（内容は次へ）'],
      ['a voice in the halls', '廊下に流れる声は'],
      ['is a small form of communication', '小さな伝え合いの形だ（と）'],
    ],
    notes: {
      'a voice in the halls': 'in the halls は voice を後ろから説明します。題名 The Voice in the Halls とつながる言葉です。',
      'is a small form of communication': 'form は「形」、communication は「伝え合い」。',
    },
  }),
])
