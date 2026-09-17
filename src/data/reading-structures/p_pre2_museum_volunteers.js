import { st } from './entry.js'

export default Object.freeze([
  st('[S Many museums] [V are trying] [O {to:名詞| [V to become] [C places {関係>places| [M where] [S teenagers] [V can do] [O more than {原形| [M simply] [V look] [M at objects behind glass]}]}]}].', {
    chunks: [
      ['Many museums', '多くの博物館は'],
      ['are trying to become places', '場所になろうとしています（どんな場所かは次へ）'],
      ['where', 'そこでは'],
      ['teenagers can do more', '10代の若者がより多くのことができます'],
      ['than simply look at objects', 'ただ展示物を見る（よりも）'],
      ['behind glass', 'ガラスの向こうにある（展示物を）'],
    ],
    notes: {
      'are trying to become places': 'try to do で「〜しようとする」。to become 以下が are trying の目的語です。',
      where: 'where は places を説明する関係副詞で、「その場所では」と場所を受け直します。',
      'teenagers can do more': 'more は「より多くのこと」という名詞のはたらきで、do の目的語です。',
      'than simply look at objects': 'than の後ろの look は to のない動詞の原形で、「ただ見ること」と比べています。',
    },
  }),
  st('[S One city museum] [M recently] [V began] [O a volunteer program for high school students {関係>high school students| [S who] [V are] [C interested in local culture]}].', {
    chunks: [
      ['One city museum', 'ある市立博物館は'],
      ['recently', '最近'],
      ['began a volunteer program', 'ボランティアプログラムを始めました'],
      ['for high school students', '高校生のための（プログラムを）'],
      ['who are interested in local culture', '地域の文化に関心のある（高校生のための）'],
    ],
    notes: {
      'who are interested in local culture': 'be interested in 〜 で「〜に関心がある」。interested は形容詞として補語になります。',
    },
  }),
  st("[M {副詞節:時| [接 Before] [S the museum] [V opens] [M on Saturdays]}], [S the students] [V meet] [O a staff member] [接 and] [V learn] [M about the day's exhibition].", {
    chunks: [
      ['Before', '〜する前に（内容は次へ）'],
      ['the museum opens', '博物館が開館する'],
      ['on Saturdays', '毎週土曜日に（開館する前に）'],
      ['the students', '生徒たちは'],
      ['meet a staff member', '職員に会います'],
      ['and', 'そして'],
      ['learn', '学びます'],
      ["about the day's exhibition", 'その日の展示について'],
    ],
    notes: {
      'on Saturdays': 'Saturdays と複数形にすると「毎週土曜日に」という意味になります。',
    },
  }),
  st('[S They] [V check] [O maps], [V prepare] [O simple worksheets], [接 and] [V practice] [O {動名詞| [V explaining] [O the displays] [M in easy words]}].', {
    chunks: [
      ['They', '生徒たちは'],
      ['check maps,', '地図を確認します'],
      ['prepare simple worksheets', '簡単なワークシートを準備します'],
      ['and', 'そして'],
      ['practice explaining the displays in easy words', 'やさしい言葉で展示を説明する練習をします'],
    ],
    notes: {
      'practice explaining the displays in easy words': 'practice ＋ -ing で「〜する練習をする」。explaining 以下が practice の目的語です。',
    },
  }),
  st('[M During the afternoon], [S they] [V help] [O families {関係>families| [S who] [V have] [O small children]} or visitors {関係>visitors| [S who] [V are not] [C used to museums]}].', {
    chunks: [
      ['During the afternoon', '午後には'],
      ['they', '生徒たちは'],
      ['help families', '家族を手助けします'],
      ['who have small children', '小さな子どものいる（家族を）'],
      ['or visitors', 'または来館者を（手助けします）'],
      ['who are not used to museums', '博物館に慣れていない（来館者を）'],
    ],
    notes: {
      'or visitors': 'or は families … と visitors … の二つを並べ、どちらも help の目的語です。',
      'who are not used to museums': 'be used to ＋ 名詞 で「〜に慣れている」。',
    },
  }),
  st('[S The work] [V is] [M not always] [C easy] [M {副詞節:理由| [接 because] [S volunteers] [V must communicate] [M politely] [M {副詞節:時| [接 even when] [S the building] [V is] [C crowded]}]}].', {
    chunks: [
      ['The work', 'その仕事は'],
      ['is not always easy', 'いつも簡単だとは限りません'],
      ['because', 'なぜなら'],
      ['volunteers must communicate', 'ボランティアは応対しなければなりません'],
      ['politely', '丁寧に'],
      ['even when', '〜するときでさえ（内容は次へ）'],
      ['the building is crowded', '館内が混雑している（ときでさえ、そうしなければならないからです）'],
    ],
    notes: {
      'is not always easy': 'not always は「いつも〜とは限らない」という部分否定です。',
      'even when': 'even は when 以下の時の節を強め、「〜するときでさえ」となります。',
    },
  }),
  st('[S They] [V may not know] [O the answer to every question], [接 so] [S they] [V are taught] [C {to:補語| [V to admit] [O uncertainty] [接 and] [V ask] [O a staff member] [M for help]}].', {
    chunks: [
      ['They', '生徒たちは'],
      ['may not know the answer to every question', 'すべての質問の答えを知っているとは限りません'],
      ['so', 'そのため'],
      ['they', '生徒たちは'],
      ['are taught to admit uncertainty', '分からないことを認めるように教えられます'],
      ['and', 'そして'],
      ['ask a staff member for help', '職員に助けを求めるように（教えられます）'],
    ],
    notes: {
      'may not know the answer to every question': 'not … every は「すべて〜とは限らない」という部分否定です。',
      'are taught to admit uncertainty': 'teach ＋ 人 ＋ to do「人に〜するように教える」の受け身で、「〜するように教えられる」。',
      'ask a staff member for help': 'ask ＋ 人 ＋ for 〜 で「人に〜を求める」。ask は to admit と to を共有しています。',
    },
  }),
  st('[S This approach] [V is] [C more useful than {動名詞| [V giving] [O1 visitors] [O2 information {関係>information| [S that] [V may be] [C incorrect]}]}].', {
    chunks: [
      ['This approach', 'このやり方は'],
      ['is more useful', 'より役に立ちます（比べる相手は次へ）'],
      ['than', '〜よりも'],
      ['giving visitors information', '来館者に情報を与えること（よりも）'],
      ['that may be incorrect', '誤っているかもしれない（情報を）'],
    ],
    notes: {
      'giving visitors information': 'give ＋ 人 ＋ もの の形の動名詞で、「人にものを与えること」。',
    },
  }),
  st('[M However], [S many students] [V say] [O {that省略| [S the program] [V gives] [O1 them] [O2 a useful sense of responsibility]}].', {
    chunks: [
      ['However', 'しかし'],
      ['many students say', '多くの生徒は言います（内容は次へ）'],
      ['the program', 'このプログラムが'],
      ['gives them a useful sense of responsibility', '自分たちに役に立つ責任感を与えてくれる（と）'],
    ],
    notes: {
      'many students say': 'say の後ろで接続詞 that が省略されています。',
      'gives them a useful sense of responsibility': 'give ＋ 人 ＋ もの で「人にものを与える」。them は many students を指します。',
    },
  }),
  st('[S They] [M also] [V discover] [O {that節| [接 that] [S a museum] [V is connected] [M to schools, shops, parks, and many other parts of the community]}].', {
    chunks: [
      ['They also discover', '生徒たちはまた気づきます（内容は次へ）'],
      ['that', '〜ということに'],
      ['a museum is connected', '博物館がつながっている（ことに）'],
      ['to schools, shops, parks,', '学校や商店や公園と'],
      ['and many other parts of the community', 'そのほか地域の多くの場所と（つながっていることに）'],
    ],
    notes: {
      'a museum is connected': 'be connected to 〜 で「〜とつながっている」。',
    },
    rules: ['that-diagnosis', 'parallel-shape', 'logic-connectors'],
  }),
  st('[S One student] [V said] [O {that省略| [S she] [V had become] [C more confident] [M after {動名詞| [V answering] [O questions from foreign visitors]}]}].', {
    chunks: [
      ['One student said', 'ある生徒は言いました（内容は次へ）'],
      ['she', '自分は'],
      ['had become more confident', '前より自信がついていた（と）'],
      ['after answering questions from foreign visitors', '外国人来館者からの質問に答えたあとで'],
    ],
    notes: {
      'had become more confident': 'had become は過去完了で、said（言った時）までに自信がついていたことを表します。',
      'after answering questions from foreign visitors': 'answering は前置詞 after の後ろの動名詞で、「答えたあとで」。',
    },
  }),
  st('[S Another student] [V decided] [O {to:名詞| [V to study] [O history] [M at college]}] [M {副詞節:理由| [接 because] [S he] [V wanted] [O {to:名詞| [V to protect] [O old buildings in his town]}]}].', {
    chunks: [
      ['Another student', '別の生徒は'],
      ['decided to study history at college', '大学で歴史を学ぶことに決めました'],
      ['because', 'なぜなら'],
      ['he', 'その生徒は'],
      ['wanted to protect old buildings in his town', '自分の町の古い建物を守りたいと思ったからです'],
    ],
  }),
  st('[M For the museum], [S the benefit] [V is] [C clear] [M as well].', {
    chunks: [
      ['For the museum', '博物館にとって'],
      ['the benefit', 'その利点は'],
      ['is clear', '明らかです'],
      ['as well', '同じように（博物館にとっても）'],
    ],
    notes: {
      'as well': 'as well は「〜もまた」。For the museum に意味がかかり、「生徒だけでなく博物館にとっても」となります。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S young people] [V take part]}], [S exhibitions] [V feel] [C more open], [接 and] [S visitors] [V are] [C more willing {to:副詞(形容詞)| [V to ask] [O questions]}].', {
    chunks: [
      ['When', '〜すると（内容は次へ）'],
      ['young people take part', '若者が参加する（と）'],
      ['exhibitions', '展示は'],
      ['feel more open', 'より開かれたものに感じられます'],
      ['and', 'そして'],
      ['visitors', '来館者は'],
      ['are more willing to ask questions', 'より進んで質問しようとします'],
    ],
    notes: {
      'feel more open': 'feel ＋ 形容詞 で「〜に感じられる」。exhibitions が感じるのではなく、展示がそう感じられるという意味です。',
      'are more willing to ask questions': 'be willing to do で「進んで〜する」。to ask は willing の内容を後ろから説明します。',
    },
  }),
  st('[S The museum] [V has] [M also] [V changed] [O the way {関係省略>the way| [S it] [V prepares] [O labels for new displays]}].', {
    chunks: [
      ['The museum', '博物館は'],
      ['has also changed the way', '方法も変えました（どんな方法かは次へ）'],
      ['it prepares labels for new displays', '博物館が新しい展示の説明文を準備する（方法を）'],
    ],
    notes: {
      'has also changed the way': 'has changed は現在完了で、変えた結果が今も続いていることを表します。',
      'it prepares labels for new displays': 'the way の後ろで関係詞（that / in which）が省略され、「〜する方法」となります。it は the museum を指します。',
    },
  }),
  st('[S Staff members] [V used to write] [O long explanations for adults], [接 but] [S they] [M now] [V ask] [O student volunteers] [C {to:補語| [V to read] [O the labels] [M first]}].', {
    chunks: [
      ['Staff members', '職員は'],
      ['used to write long explanations', '以前は長い説明を書いていました'],
      ['for adults', '大人向けの（長い説明を）'],
      ['but', 'しかし'],
      ['they', '職員は'],
      ['now', '今では'],
      ['ask student volunteers to read the labels first', 'まず学生ボランティアに説明文を読んでくれるよう頼みます'],
    ],
    notes: {
      'used to write long explanations': 'used to ＋ 動詞の原形 で「以前は〜していた（今はしていない）」。',
      'ask student volunteers to read the labels first': 'ask ＋ 人 ＋ to do で「人に〜するように頼む」。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S the students] [V cannot understand] [O an important point]}], [S the staff] [V try] [O {to:名詞| [V to make] [O the language] [C clearer] [M without {動名詞| [V removing] [O the main idea]}]}].', {
    chunks: [
      ['If', 'もし'],
      ['the students', '生徒たちが'],
      ['cannot understand an important point', '重要な点を理解できなければ'],
      ['the staff', '職員は'],
      ['try to make the language clearer', '表現をより分かりやすくしようとします'],
      ['without removing the main idea', '中心となる考えを削ることなく'],
    ],
    notes: {
      'try to make the language clearer': 'make ＋ O ＋ C で「OをCにする」。the language が O、clearer が C です。',
      'without removing the main idea': 'without ＋ -ing で「〜せずに」。',
    },
  }),
  st('[S The students] [M also] [V record] [O the questions {関係省略>the questions| [S visitors] [V ask] [M most often]}], [接 and] [S the museum] [V uses] [O this feedback] [M {副詞節:時| [接 when] [V planning] [O future exhibitions]}].', {
    chunks: [
      ['The students', '生徒たちは'],
      ['also', 'また'],
      ['record the questions', '質問を記録します'],
      ['visitors ask most often', '来館者がいちばんよく尋ねる（質問を）'],
      ['and', 'そして'],
      ['the museum', '博物館は'],
      ['uses this feedback', 'この意見を活用します'],
      ['when planning future exhibitions', '今後の展示を計画するときに'],
    ],
    notes: {
      'visitors ask most often': 'the questions の後ろで関係代名詞（that / which）が省略されています。',
      'when planning future exhibitions': 'when (it is) planning の主語と be動詞が省略された形で、主語は前の the museum です。',
    },
  }),
  st('[S The program] [V shows] [O {that節| [接 that] [S {動名詞| [V learning] [M about the past]}] [V can help] [O people] [C {原形| [V build] [O stronger relationships in the present]}]}].', {
    chunks: [
      ['The program shows', 'このプログラムは示しています（内容は次へ）'],
      ['that', '〜ということを'],
      ['learning about the past', '過去について学ぶことが'],
      ['can help people build stronger relationships', '人々がより強い関係を築く助けになりうる'],
      ['in the present', '今の時代の（関係を）'],
    ],
    notes: {
      'learning about the past': 'learning about the past は「過去について学ぶこと」という動名詞のまとまりで、that 節の主語です。',
      'can help people build stronger relationships': 'help ＋ 人 ＋ 動詞の原形 で「人が〜するのを助ける」。',
    },
  }),
])
