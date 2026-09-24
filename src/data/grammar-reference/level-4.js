// 文法の参考書：英検4級（中2程度）。並びは学ぶ順。
import { referenceUnit } from './unit.js'

export const GRAMMAR_REFERENCE_4 = [
  referenceUnit({
    key: 'past',
    level: '4',
    topic: '過去形',
    title: '過去形（〜した・〜だった）',
    lead: '過去にしたことや過去の状態は、動詞を過去形にして表す。規則動詞は -ed を付け、不規則動詞は形が変わる。否定文・疑問文は did を使い、動詞は原形に戻す。',
    forms: [
      ['一般動詞', '主語 ＋ 動詞の過去形 〜.', 'Ken played tennis yesterday.', 'ケンは昨日テニスをしました。'],
      ['否定文', '主語 ＋ did not（didn’t）＋ 動詞の原形 〜.', 'I did not go to school yesterday.', '私は昨日学校へ行きませんでした。'],
      ['疑問文', 'Did ＋ 主語 ＋ 動詞の原形 〜?', 'Did you watch the game? — Yes, I did.', 'あなたはその試合を見ましたか。— はい、見ました。'],
      ['be動詞', '主語 ＋ was / were ＋ 〜.', 'I was busy yesterday.', '私は昨日忙しかったです。'],
    ],
    points: [
      {
        title: '規則動詞は -ed を付ける',
        text: [
          '多くの動詞は語尾に -ed を付けて過去形にする。主語が何でも形は同じで、3単現の s のような変化はない。',
        ],
        table: [
          ['動詞の終わり', '付け方', '例'],
          ['ふつう', 'ed', 'play → played、visit → visited'],
          ['e で終わる', 'd だけ', 'use → used、like → liked'],
          ['子音字＋y', 'y を i に変えて ed', 'study → studied、carry → carried'],
          ['短い母音＋子音字', '子音字を重ねて ed', 'stop → stopped、plan → planned'],
        ],
        examples: [
          ['We visited the museum last Sunday.', '私たちはこの前の日曜日に博物館を訪れました。'],
          ['Emi studied English last night.', 'エミは昨夜英語を勉強しました。'],
        ],
      },
      {
        title: '不規則動詞は形ごと変わる',
        text: [
          'go → went のように、-ed を付けずに形が変わる動詞を不規則動詞という。よく使う動詞ほど不規則なことが多い。',
        ],
        table: [
          ['原形', '過去形', '意味'],
          ['go', 'went', '行く'],
          ['come', 'came', '来る'],
          ['see', 'saw', '見る・会う'],
          ['have', 'had', '持っている・食べる'],
          ['make', 'made', '作る'],
          ['take', 'took', '取る・（写真を）撮る'],
          ['write', 'wrote', '書く'],
          ['eat', 'ate', '食べる'],
          ['buy', 'bought', '買う'],
          ['give', 'gave', '与える'],
          ['teach', 'taught', '教える'],
          ['get', 'got', '手に入れる'],
        ],
        examples: [
          ['I went to Kyoto last week.', '私は先週京都へ行きました。'],
          ['She wrote a letter yesterday.', '彼女は昨日手紙を書きました。'],
          ['I saw a movie last night.', '私は昨夜映画を見ました。'],
          ['She had breakfast at seven yesterday.', '彼女は昨日7時に朝食を食べました。', { had: ['have', 'have の過去形（食べた）'] }],
        ],
      },
      {
        title: '否定文・疑問文は did を使う',
        text: [
          '一般動詞の過去の否定文は did not（didn’t）＋原形、疑問文は Did ＋主語＋原形 〜? で作る。did が過去を表すので、後ろの動詞は原形に戻す。答えも did を使う（Yes, I did. / No, I didn’t.）。',
        ],
        examples: [
          ['I didn’t eat breakfast this morning.', '今朝は朝食を食べませんでした。'],
          ['Did Ken play tennis yesterday? — No, he didn’t.', 'ケンは昨日テニスをしましたか。— いいえ、しませんでした。'],
          ['What did you do last Sunday?', 'この前の日曜日は何をしましたか。'],
        ],
      },
      {
        title: 'be動詞の過去形 was・were',
        text: [
          'am・is の過去形は was、are の過去形は were。否定文は was not（wasn’t）・were not（weren’t）、疑問文は Was・Were を主語の前に出す。',
        ],
        table: [
          ['主語', '今', '過去'],
          ['I', 'am', 'was'],
          ['he / she / it・1人・1つ', 'is', 'was'],
          ['you・複数', 'are', 'were'],
        ],
        examples: [
          ['I was not busy yesterday.', '私は昨日忙しくありませんでした。'],
          ['Were you at home last night? — Yes, I was.', '昨夜は家にいましたか。— はい、いました。'],
        ],
      },
      {
        title: '過去を表す語句と、動詞の後ろの形',
        text: [
          'yesterday（昨日）、last 〜（この前の〜）、〜 ago（〜前に）、then（そのとき）があれば過去形を使う。',
          '動詞ごとに後ろの形が決まっている。give は give＋人＋物で「（人）に（物）をあげる」、arrive は arrive at / in＋場所で「〜に着く」（arrive の後ろに場所の名詞を直接置かない）。',
        ],
        examples: [
          ['My aunt gave me a useful book.', 'おばは私に役に立つ本をくれました。'],
          ['The train arrived at nine yesterday.', '電車は昨日9時に着きました。'],
          ['I met him two days ago.', '私は2日前に彼に会いました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '人に物をあげるは give／到着するは arrive／参加するは take part in。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['My aunt gave me a useful book.', '叔母は私に役立つ本をくれました。'],
          ['The train arrived at nine yesterday.', 'その電車は昨日9時に到着しました。'],
          ['We took part in the school festival last year.', '私たちは昨年、学校の祭りに参加しました。'],
        ],
      },
    ],
    mistakes: [
      ['Did you watched the game?', 'Did you watch the game?', 'Did の後ろは動詞の原形。'],
      ['I goed to Kyoto.', 'I went to Kyoto.', 'go は不規則動詞で、過去形は went。'],
      ['I didn’t went to school.', 'I didn’t go to school.', 'didn’t の後ろも原形。'],
      ['You was at home.', 'You were at home.', 'you の be動詞の過去形は were。'],
      ['The train arrived the station.', 'The train arrived at the station.', 'arrive の後ろに場所を言うときは at / in が要る。'],
    ],
    check: [
      '規則動詞は -ed（study → studied、stop → stopped）、不規則動詞は形が変わる（go → went）。',
      '否定文は didn’t＋原形、疑問文は Did＋主語＋原形 〜?',
      'be動詞の過去形は was（I・1人・1つ）と were（you・複数）。',
      'yesterday・last 〜・〜 ago があれば過去形。',
    ],
  }),

  referenceUnit({
    key: 'pastprog',
    level: '4',
    topic: '過去進行形',
    title: '過去進行形（〜しているところだった）',
    lead: '過去のある時に「ちょうど〜しているところだった」ことを表す。was・were の後ろに動詞の ing 形を置く。',
    forms: [
      ['ふつうの文', '主語 ＋ was / were ＋ 動詞ing 〜.', 'I was watching TV at nine.', '私は9時にテレビを見ていました。'],
      ['否定文', '主語 ＋ was / were ＋ not ＋ 動詞ing 〜.', 'They were not playing soccer then.', '彼らはそのときサッカーをしていませんでした。'],
      ['疑問文', 'Was / Were ＋ 主語 ＋ 動詞ing 〜?', 'Were you sleeping then? — No, I wasn’t.', 'あなたはそのとき眠っていましたか。— いいえ、眠っていませんでした。'],
    ],
    points: [
      {
        title: 'was と were の使い分け',
        text: [
          '主語が I や1人・1つなら was、you や複数なら were。be動詞の過去形と同じ使い分け。',
        ],
        examples: [
          ['They were playing soccer then.', '彼らはそのときサッカーをしていました。'],
          ['Ken was studying at that time.', 'ケンはそのとき勉強していました。'],
        ],
      },
      {
        title: '過去形との違い',
        text: [
          '過去形（I watched TV.）は「見た」という出来事、過去進行形（I was watching TV.）は「見ているところだった」という途中の様子を表す。at nine（9時に）、then・at that time（そのとき）など、過去のある時点と一緒に使うことが多い。',
        ],
        examples: [
          ['I watched TV last night.', '私は昨夜テレビを見ました。'],
          ['I was watching TV at nine last night.', '私は昨夜9時にテレビを見ているところでした。'],
        ],
      },
      {
        title: 'when・while と一緒に使う',
        text: [
          '「〜したとき、…しているところだった」は、続いていたこと（…）を過去進行形、その途中で起きたこと（〜）を過去形にする。while（〜している間に）の後ろには進行形がよく来る。',
        ],
        examples: [
          ['She was cooking when I came home.', '私が帰宅したとき、彼女は料理をしていました。'],
          ['What were you doing at eight last night?', '昨夜8時に何をしていましたか。'],
          ['I met Emi while I was walking in the park.', '公園を歩いている間に、エミに会いました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'そのときは at that time／know は過去進行形にしない／〜している間には while＋主語＋動詞。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Ken was studying at that time.', 'ケンはそのとき勉強していました。'],
          ['I knew his name then.', '私はそのとき彼の名前を知っていました。'],
          ['While I was cooking, the phone rang.', '私が料理をしている間に、電話が鳴りました。'],
        ],
      },
    ],
    mistakes: [
      ['I was watched TV at nine.', 'I was watching TV at nine.', '「〜しているところだった」は was＋動詞ing。過去形の動詞と混ぜない。'],
      ['They was playing soccer.', 'They were playing soccer.', '主語が複数なら were。'],
      ['I was knowing him then.', 'I knew him then.', 'know は状態を表す動詞なので、進行形にしない。'],
    ],
    check: [
      '過去進行形＝was / were ＋動詞ing。',
      'I・1人・1つ → was、you・複数 → were。',
      '「〜したとき」に途中だったことを過去進行形で表す。',
    ],
  }),

  referenceUnit({
    key: 'future',
    level: '4',
    topic: '未来表現',
    title: '未来表現（will / be going to）',
    lead: 'これから先のことは、will＋動詞の原形 または be going to＋動詞の原形 で表す。どちらも後ろの動詞は原形。',
    forms: [
      ['will', '主語 ＋ will ＋ 動詞の原形 〜.', 'It will rain tomorrow.', '明日は雨が降るでしょう。'],
      ['be going to', '主語 ＋ am / is / are going to ＋ 動詞の原形 〜.', 'I am going to study tonight.', '私は今夜勉強するつもりです。'],
      ['否定文', 'will not（won’t）＋ 原形 ／ be動詞 ＋ not going to ＋ 原形', 'I will not be late for the meeting.', '私は会議に遅れません。'],
      ['疑問文', 'Will ＋ 主語 ＋ 原形 〜? ／ be動詞 ＋ 主語 ＋ going to ＋ 原形 〜?', 'Are you going to play soccer? — Yes, I am.', 'あなたはサッカーをするつもりですか。— はい、そのつもりです。'],
    ],
    points: [
      {
        title: 'will と be going to の使い分け',
        text: [
          'will は「〜だろう」という予想や、その場で決めた「〜します」という意志によく使う。be going to は、前から決めていた予定や、今の様子から「〜しそうだ」と分かることによく使う。',
        ],
        examples: [
          ['I think it will rain tomorrow.', '明日は雨が降ると思います。'],
          ['I’ll carry your bag.', '（その場で決めて）あなたのかばんを運びますよ。'],
          ['We are going to clean the park tomorrow.', '私たちは明日公園を掃除する予定です。'],
        ],
      },
      {
        title: '後ろは必ず原形',
        text: [
          'will の後ろ、be going to の to の後ろは、主語が3人称単数でも原形。be going to では主語に合う am・is・are を忘れない。',
        ],
        examples: [
          ['Ken will play tennis tomorrow.', 'ケンは明日テニスをするでしょう。'],
          ['Ken is going to visit his grandmother.', 'ケンはおばあさんを訪ねる予定です。'],
        ],
      },
      {
        title: '疑問文と答え方',
        text: [
          'will の疑問文は Will を主語の前に出し、答えも will を使う（Yes, I will. / No, I won’t.）。疑問詞を使うときは What will you do 〜? のようにする。be going to の疑問文は be動詞を主語の前に出す。',
        ],
        examples: [
          ['What will you do tomorrow?', '明日は何をしますか。'],
          ['Will you be free this afternoon? — No, I won’t.', '今日の午後はひまですか。— いいえ、ひまではありません。'],
        ],
      },
      {
        title: '未来を表す語句',
        text: [
          'tomorrow（明日）、next 〜（次の〜）、this weekend（今週末）、someday（いつか）などがあれば、未来の言い方を使う。近い予定は現在進行形で表すこともある（She is coming to the party tomorrow.）。',
          'have a picnic（ピクニックをする）のように、行事を行うときには have を使う。',
        ],
        examples: [
          ['We will have a picnic if it is sunny.', '晴れたらピクニックをします。'],
          ['I am going to see a movie next Saturday.', '次の土曜日に映画を見るつもりです。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'ピクニックをするは have a picnic／出かけるは go out／家にいるは stay home。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['We will have a picnic if it is sunny.', '晴れたら私たちはピクニックをします。'],
          ['We will go out for dinner tonight.', '私たちは今夜、夕食に出かけます。'],
          ['If it snows tomorrow, I will stay home.', '明日雪が降ったら、私は家にいます。'],
        ],
      },
    ],
    mistakes: [
      ['It will rains tomorrow.', 'It will rain tomorrow.', 'will の後ろは原形。'],
      ['I going to study tonight.', 'I am going to study tonight.', 'be going to の be動詞を省かない。'],
      ['I am going to studying.', 'I am going to study.', 'going to の後ろは原形。'],
    ],
    check: [
      'will＋原形＝〜だろう・〜します。',
      'be going to＋原形＝〜する予定だ・〜しそうだ。be動詞を忘れない。',
      '否定は won’t＋原形、疑問は Will＋主語＋原形 〜?',
    ],
  }),

  referenceUnit({
    key: 'modal',
    level: '4',
    topic: '助動詞',
    title: '助動詞（must / have to / should / may など）',
    lead: '動詞の前に置いて「〜しなければならない」「〜すべきだ」「〜してもよい」などの意味を加える。後ろの動詞は必ず原形。',
    forms: [
      ['〜しなければならない', 'must ＋ 原形 ／ have to（has to）＋ 原形', 'You must finish your homework first.', 'まず宿題を終えなければなりません。'],
      ['〜してはいけない', 'must not（mustn’t）＋ 原形', 'You must not run here.', 'ここで走ってはいけません。'],
      ['〜する必要はない', 'do not have to（don’t have to）＋ 原形', 'You don’t have to bring lunch tomorrow.', '明日はお弁当を持ってくる必要はありません。'],
      ['〜すべきだ', 'should ＋ 原形', 'You should see a doctor.', '医者にみてもらったほうがいいですよ。'],
    ],
    points: [
      {
        title: '助動詞の意味',
        table: [
          ['助動詞', '意味', '例'],
          ['must', '〜しなければならない・〜にちがいない', 'You must go now.'],
          ['have to', '〜しなければならない', 'I have to get up early.'],
          ['should', '〜すべきだ・〜したほうがよい', 'You should rest.'],
          ['may', '〜してもよい・〜かもしれない', 'You may go home.'],
          ['can', '〜できる・〜してもよい', 'You can use this room.'],
        ],
        examples: [
          ['With permission, you may play tennis here.', '許可があれば、ここでテニスをしてもよいです。'],
          ['It may rain this afternoon.', '午後は雨が降るかもしれません。'],
        ],
      },
      {
        title: 'must not と don’t have to のちがい',
        text: [
          'must not は「〜してはいけない」という禁止、don’t have to は「〜する必要はない」という意味で、まったく違う。日本語の「〜しなくてよい」は don’t have to。',
        ],
        table: [
          ['言い方', '意味'],
          ['You must not go.', '行ってはいけない（禁止）'],
          ['You don’t have to go.', '行かなくてよい（必要がない）'],
        ],
      },
      {
        title: 'have to の形の変化',
        text: [
          'have to は主語や時で形が変わる。主語が3人称単数なら has to、過去は had to、未来は will have to。否定文・疑問文は do・does・did を使う（Does he have to 〜?）。',
          'must には過去形がないので、「〜しなければならなかった」は had to で表す。',
        ],
        examples: [
          ['Ken has to finish his report by Friday.', 'ケンは金曜日までにレポートを終えなければなりません。'],
          ['I had to wait for an hour.', '私は1時間待たなければなりませんでした。'],
          ['Does she have to work on Sunday?', '彼女は日曜日に働かなければなりませんか。'],
        ],
      },
      {
        title: 'お願い・許可・申し出の言い方',
        table: [
          ['言い方', '意味', '答え方の例'],
          ['May I 〜?', '〜してもよろしいですか（ていねいに許可を求める）', 'Sure.（どうぞ）'],
          ['Could you 〜? / Would you 〜?', '〜していただけますか（ていねいな依頼）', 'Sure.（いいですよ）'],
          ['Will you 〜?', '〜してくれますか（依頼）', 'All right.（いいですよ）'],
          ['Shall I 〜?', '（私が）〜しましょうか（申し出）', 'Yes, please.（お願いします）'],
          ['Shall we 〜?', '（一緒に）〜しましょうか（誘い）', 'Yes, let’s.（そうしましょう）'],
          ['Would you like 〜?', '〜はいかがですか（すすめる）', 'Yes, please.（お願いします）'],
        ],
        examples: [
          ['May I use your pen? — Sure.', 'ペンを使ってもよろしいですか。— どうぞ。', { Sure: 'どうぞ・いいですよ' }],
          ['Could you open the window? — Sure.', '窓を開けていただけますか。— いいですよ。', { Sure: 'いいですよ・もちろん' }],
          ['Shall I carry your bag? — Yes, please.', 'かばんを運びましょうか。— はい、お願いします。'],
          ['Would you like some tea?', 'お茶はいかがですか。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '許可を求める May I 〜?／申し出る Shall I 〜?／医者にみてもらうは see a doctor。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['May I use your pen? Sure.', 'あなたのペンを使ってもよいですか。いいですよ。'],
          ['Shall I carry your bag? Yes, please.', 'かばんをお持ちしましょうか。はい、お願いします。'],
          ['You should see a doctor about that cough.', 'そのせきについては医者にみてもらったほうがいいですよ。'],
        ],
      },
    ],
    rewrites: [
      ['You must clean your room.', 'You have to clean your room.', '「〜しなければならない」は must でも have to でも表せる。'],
      ['Don’t run here.', 'You must not run here.', '「〜するな」の命令文は must not で言いかえられる。'],
      ['You don’t have to hurry.', 'You need not hurry.', '「〜する必要はない」は need not でも表せる。'],
    ],
    mistakes: [
      ['You must to finish it.', 'You must finish it.', 'must の後ろに to を置かない（have to は別の言い方）。'],
      ['He musts go now.', 'He must go now.', '助動詞に s は付けない。'],
      ['She have to work on Sunday.', 'She has to work on Sunday.', '主語が3人称単数なら has to。'],
    ],
    check: [
      'must・have to＝〜しなければならない、must not＝〜してはいけない、don’t have to＝〜する必要はない。',
      '助動詞の後ろは原形。助動詞に s や to を付けない。',
      'have to は has to（3人称単数）、had to（過去）と形が変わる。',
      'May I 〜?・Could you 〜?・Shall I 〜?・Would you like 〜? の意味と答え方。',
    ],
  }),

  referenceUnit({
    key: 'conj',
    level: '4',
    topic: '接続詞',
    title: '接続詞（and / but / when / if / because など）',
    lead: '文と文をつないで、時・条件・理由・逆のことなどの関係を表す。and・but・or・so は対等につなぎ、when・if・because などは「主語＋動詞」のまとまりを続けて、もう一方の文に意味を付け加える。',
    forms: [
      ['対等につなぐ', '文 ＋ and / but / or / so ＋ 文', 'I was tired, so I went to bed early.', '私は疲れていたので、早く寝ました。'],
      ['意味を付け加える', '文 ＋ when / if / because など ＋ 主語 ＋ 動詞 〜', 'Call me when you arrive.', '着いたら電話してください。'],
    ],
    points: [
      {
        title: 'and・but・or・so',
        table: [
          ['接続詞', '意味', '例'],
          ['and', '〜と・そして', 'I like tea and coffee.'],
          ['but', 'しかし', 'I like cats, but my sister likes dogs.'],
          ['or', 'または', 'Is this yours or Ken’s?'],
          ['so', 'だから（結果）', 'It was cold, so I wore a coat.'],
        ],
      },
      {
        title: '時・条件・理由・逆のこと',
        table: [
          ['接続詞', '意味'],
          ['when', '〜するとき・〜したとき'],
          ['before / after', '〜する前に／〜したあとで'],
          ['while', '〜している間に'],
          ['until', '〜するまで（ずっと）'],
          ['if', 'もし〜なら'],
          ['because', '〜なので（理由）'],
          ['though / although', '〜だけれども'],
        ],
        examples: [
          ['Wash your hands before you eat.', '食べる前に手を洗いなさい。'],
          ['We stayed inside because it was raining heavily.', '雨が激しく降っていたので、私たちは中にいました。'],
          ['Although it was raining, we played outside.', '雨が降っていたけれど、私たちは外で遊びました。'],
          ['Please wait here until I come back.', '私が戻るまでここで待っていてください。'],
        ],
      },
      {
        title: 'when・if の中は未来のことでも現在形',
        text: [
          'when（〜するとき）や if（もし〜なら）の後ろのまとまりでは、未来のことでも will を使わず現在形にする。',
        ],
        examples: [
          ['Please call me when you arrive at the station.', '駅に着いたら電話してください。'],
          ['If it rains tomorrow, I will stay home.', '明日雨が降ったら、家にいます。'],
        ],
      },
      {
        title: '「〜だと思う」の that',
        text: [
          'think・know・hope などの後ろに that＋主語＋動詞 を置くと「〜ということ」を表す。この that はよく省かれる。',
          'I’m sure that 〜（きっと〜だと思う）、I’m glad that 〜（〜でうれしい）のように、気持ちを表す語の後ろにも置ける。',
        ],
        examples: [
          ['I think that he is right.', '彼は正しいと思います。'],
          ['I know she likes music.', '彼女が音楽を好きなことを知っています。'],
          ['I’m glad that you like it.', '気に入ってもらえてうれしいです。'],
        ],
      },
      {
        title: 'まとまりを前に置くとき',
        text: [
          'When 〜, や If 〜, のように接続詞のまとまりを文の前に置くときは、まとまりの終わりにコンマ（,）を付ける。',
        ],
        examples: [
          ['If you are free, let’s go out.', 'もしひまなら、出かけましょう。'],
          ['When I got home, my mother was cooking.', '私が家に帰ったとき、母は料理をしていました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '乗り遅れるは miss the bus／風邪をひくは catch a cold／道路をわたるは cross the street。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Hurry up, or you will miss the bus.', '急がないとバスに乗り遅れますよ。'],
          ['Wear a coat, or you will catch a cold.', 'コートを着ないと風邪をひきますよ。'],
          ['Look both ways when you cross the street.', '道路をわたるときは左右をよく見なさい。'],
        ],
      },
    ],
    mistakes: [
      ['If it will rain tomorrow, I will stay home.', 'If it rains tomorrow, I will stay home.', 'if の中は未来のことでも現在形。'],
      ['Though it was cold, but I went out.', 'Though it was cold, I went out.', 'though と but を1つの文で重ねない。'],
      ['I was tired, because I went to bed early.', 'I was tired, so I went to bed early.', '「疲れていた→だから早く寝た」は結果を表す so。because は理由を表す。'],
    ],
    check: [
      'and・but・or・so は文と文を対等につなぐ。',
      'when 時、if 条件、because 理由、though・although 逆のこと、until まで。',
      'when・if の中は未来のことでも現在形。',
      'I think (that) 〜 の that は省ける。',
    ],
  }),

  referenceUnit({
    key: 'there',
    level: '4',
    topic: 'There is/are',
    title: 'There is / There are（〜がある・いる）',
    lead: '「（ある場所に）〜がある・いる」と、物や人があることを伝える言い方。be動詞は、後ろに来る名詞が1つなら is、2つ以上なら are にする。',
    forms: [
      ['1つ・1人', 'There is ＋ 名詞（単数）＋ 場所.', 'There is a cat under the chair.', 'いすの下にネコが1匹います。'],
      ['2つ・2人以上', 'There are ＋ 名詞（複数）＋ 場所.', 'There are many books on the desk.', '机の上にたくさんの本があります。'],
      ['過去', 'There was / were ＋ 名詞 ＋ 場所.', 'There were three birds in the garden.', '庭に鳥が3羽いました。'],
    ],
    points: [
      {
        title: 'be動詞は後ろの名詞に合わせる',
        text: [
          'There is / are の文の主語は、be動詞の後ろの名詞。その名詞が単数なら is（過去は was）、複数なら are（過去は were）にする。',
        ],
        examples: [
          ['There were two chairs in the room yesterday.', '昨日、部屋にはいすが2脚ありました。'],
          ['There was a big tree here.', 'ここには大きな木がありました。'],
        ],
      },
      {
        title: '否定文・疑問文と数のたずね方',
        text: [
          '否定文は be動詞の後ろに not を置く（There aren’t any 〜 で「1つもない」）。疑問文は be動詞を there の前に出し、答えも there を使う（Yes, there is. / No, there aren’t.）。',
          '数をたずねるときは How many＋複数形＋are there 〜? にする。',
        ],
        examples: [
          ['Is there a bank near here? — Yes, there is.', 'この近くに銀行はありますか。— はい、あります。'],
          ['There aren’t any eggs in the fridge.', '冷蔵庫に卵が1つもありません。'],
          ['How many students are there in your class?', 'あなたのクラスには生徒が何人いますか。'],
        ],
      },
      {
        title: '決まった物の場所はふつうの語順で',
        text: [
          'There is / are は、相手がまだ知らない物・人が「ある・いる」ことを伝える言い方。my bag や the book のように、どれか決まっている物の場所を言うときは、My bag is on the desk. のようにふつうの語順を使う。',
        ],
        examples: [
          ['My bag is on the desk.', '私のかばんは机の上にあります。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'この近くには near here／パンは a loaf of で数える／席につくは take a seat。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Is there a bank near here?', 'この近くに銀行はありますか。'],
          ['There is a loaf of bread on the table.', 'テーブルの上にパンが1かたまりあります。'],
          ['There are many seats. Please take a seat.', '席はたくさんあります。どうぞおかけください。'],
        ],
      },
    ],
    rewrites: [
      ['There are seven days in a week.', 'A week has seven days.', '「〜に…がある」は、have（持っている）を使って言いかえられることがある。'],
    ],
    mistakes: [
      ['There is many books on the desk.', 'There are many books on the desk.', 'books は複数なので are。'],
      ['There were a cat in the garden.', 'There was a cat in the garden.', '後ろの名詞 a cat が単数なので was。'],
    ],
    check: [
      'There is＋単数、There are＋複数（過去は was / were）。',
      '疑問文は Is / Are there 〜?、答えも there を使う。',
      '数は How many＋複数形＋are there 〜?',
      '決まった物の場所は My bag is 〜. のように言う。',
    ],
  }),

  referenceUnit({
    key: 'inf',
    level: '4',
    topic: '不定詞',
    title: '不定詞（to＋動詞の原形）の3つの使い方',
    lead: 'to＋動詞の原形 を不定詞という。「〜すること」「〜するための」「〜するために」の3つの意味で使い分ける。to の後ろはいつも動詞の原形。',
    forms: [
      ['〜すること', 'want / hope / like など ＋ to ＋ 原形', 'I want to be a doctor.', '私は医者になりたいです。'],
      ['〜するための', '名詞 ＋ to ＋ 原形', 'I have a lot of work to do.', '私にはやるべき仕事がたくさんあります。'],
      ['〜するために', '動詞の文 ＋ to ＋ 原形', 'He went to the library to borrow books.', '彼は本を借りるために図書館へ行きました。'],
    ],
    points: [
      {
        title: '「〜すること」：動詞の目的語や主語・補語になる',
        text: [
          'want to 〜（〜したい）、like to 〜（〜するのが好きだ）、hope to 〜（〜することを望む）、start・begin to 〜（〜し始める）、decide to 〜（〜することに決める）のように、動詞の後ろに置いて「〜すること」を表す。',
        ],
        examples: [
          ['We want to play tennis next week.', '私たちは来週テニスをしたいです。'],
          ['It started to rain.', '雨が降り始めました。'],
          ['My dream is to travel around the world.', '私の夢は世界中を旅することです。'],
        ],
      },
      {
        title: '「〜するための」：名詞を後ろから説明する',
        text: [
          '名詞のすぐ後ろに to＋原形 を置くと「〜するための」「〜すべき」という意味で名詞を説明する。something to drink（何か飲むもの）のように something の後ろにもよく使う。',
        ],
        examples: [
          ['I need something to drink.', '何か飲むものが必要です。'],
          ['I have no time to watch TV.', 'テレビを見る時間がありません。'],
        ],
      },
      {
        title: '「〜するために」「〜して」：目的や気持ちの理由',
        text: [
          '動詞の文の後ろに置くと「〜するために」という目的を表す。glad・happy・sad など気持ちを表す語の後ろでは「〜して」という理由を表す。',
        ],
        examples: [
          ['Ken joined the tennis club to practice every week.', 'ケンは毎週練習するためにテニス部に入りました。'],
          ['I went home early to take care of my dog.', '犬の世話をするために早く家に帰りました。'],
          ['I am glad to see you.', 'あなたに会えてうれしいです。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '世話をするは take care of／〜してうれしいは be glad to／「何か飲む物」は something to drink。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Please take care of this plant.', 'この植物の世話をしてください。'],
          ['I am glad to see you again.', 'また会えてうれしいです。'],
          ['I need something to drink in this heat.', 'この暑さの中で、私は何か飲む物が必要です。'],
        ],
      },
    ],
    mistakes: [
      ['I want be a doctor.', 'I want to be a doctor.', 'want の後ろで「〜すること」を表すには to＋原形。'],
      ['I went to the park to played tennis.', 'I went to the park to play tennis.', 'to の後ろは原形。'],
      ['I need something drink.', 'I need something to drink.', '「何か飲むもの」は something to drink。'],
    ],
    check: [
      '不定詞＝to＋動詞の原形。',
      '〜すること（want to 〜）、〜するための（something to drink）、〜するために（to buy 〜）。',
      'glad to 〜 などは「〜して（うれしい）」。',
    ],
  }),

  referenceUnit({
    key: 'ger',
    level: '4',
    topic: '動名詞',
    title: '動名詞（動詞ing＝〜すること）',
    lead: '動詞の ing 形が「〜すること」という名詞の働きをするものを動名詞という。文の主語・目的語になり、前置詞の後ろにも置ける。',
    forms: [
      ['目的語', 'enjoy / finish / stop など ＋ 動詞ing', 'He enjoys playing soccer.', '彼はサッカーをするのを楽しみます。'],
      ['主語', '動詞ing 〜 ＋ 動詞', 'Reading books is fun.', '本を読むことは楽しいです。'],
      ['前置詞の後ろ', '前置詞 ＋ 動詞ing', 'She is good at drawing pictures.', '彼女は絵をかくのが得意です。'],
    ],
    points: [
      {
        title: '後ろに動名詞だけを置く動詞',
        text: [
          'enjoy（楽しむ）・finish（終える）・stop（やめる）・practice（練習する）の後ろで「〜すること」を言うときは、to 不定詞ではなく動名詞にする。',
        ],
        examples: [
          ['I finished reading the book.', '私はその本を読み終えました。'],
          ['Stop talking, please.', 'おしゃべりをやめてください。'],
          ['Aya enjoys reading mystery stories.', 'アヤはミステリーを読むのを楽しみます。'],
        ],
      },
      {
        title: '不定詞だけを置く動詞・どちらも置ける動詞',
        table: [
          ['動詞', '後ろの形'],
          ['enjoy・finish・stop・practice', '動名詞だけ（enjoy playing）'],
          ['want・hope・decide・plan', '不定詞だけ（want to play）'],
          ['like・love・start・begin', 'どちらも使える（like playing / like to play）'],
        ],
        examples: [
          ['I like playing the piano.', '私はピアノをひくのが好きです。'],
          ['I like to play the piano.', '私はピアノをひくのが好きです。'],
        ],
      },
      {
        title: '前置詞の後ろは動名詞',
        text: [
          'at・for・about・before・after などの前置詞の後ろに動詞を置くときは、動名詞にする。be good at 〜ing（〜するのが得意だ）、Thank you for 〜ing（〜してくれてありがとう）、How about 〜ing?（〜するのはどうですか）はよく使う。',
        ],
        examples: [
          ['Thank you for helping me.', '手伝ってくれてありがとう。'],
          ['How about going to the zoo?', '動物園に行くのはどうですか。'],
          ['Please check the rules before playing tennis.', 'テニスをする前に決まりを確かめてください。'],
        ],
      },
      {
        title: '主語になる動名詞',
        text: [
          '動名詞で始まるまとまりは、文の主語にもなる。1つのことを表すので、動詞は3人称単数として扱う。',
        ],
        examples: [
          ['Reading books is fun.', '本を読むことは楽しいです。'],
          ['Swimming in the sea is exciting.', '海で泳ぐことはわくわくします。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '得意だは be good at＋動名詞／How about のあとは動名詞／finish のあとは動名詞。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['My sister is good at making sweets.', '姉はお菓子を作るのが得意です。'],
          ['How about going to the zoo tomorrow?', '明日、動物園へ行くのはどうですか。'],
          ['I finished reading the book last night.', '私は昨夜その本を読み終えました。'],
        ],
      },
    ],
    rewrites: [
      ['Let’s go to the zoo.', 'How about going to the zoo?', '「〜しましょう」は How about 〜ing?（〜するのはどうですか）でも言える。'],
    ],
    mistakes: [
      ['He enjoys to play soccer.', 'He enjoys playing soccer.', 'enjoy の後ろは動名詞。'],
      ['Thank you for help me.', 'Thank you for helping me.', '前置詞 for の後ろは動名詞。'],
      ['I want playing tennis.', 'I want to play tennis.', 'want の後ろは不定詞。'],
    ],
    check: [
      'enjoy・finish・stop の後ろは動名詞、want・hope・decide の後ろは不定詞。',
      'like・start・begin はどちらも使える。',
      '前置詞の後ろは動名詞（good at 〜ing、Thank you for 〜ing）。',
      '動名詞の主語は単数として扱う（Reading books is fun.）。',
    ],
  }),

  referenceUnit({
    key: 'whto',
    level: '4',
    topic: '疑問詞+不定詞',
    title: '疑問詞＋不定詞（how to 〜 など）',
    lead: 'how to 〜（〜のしかた）、what to 〜（何を〜すべきか）のように、疑問詞の後ろに to＋動詞の原形 を続けると、1つの名詞のようなまとまりになる。',
    forms: [
      ['形', '疑問詞 ＋ to ＋ 動詞の原形', 'I don’t know how to get to the station.', '駅への行き方が分かりません。'],
    ],
    points: [
      {
        title: '5つの形',
        table: [
          ['形', '意味'],
          ['how to 〜', '〜のしかた・どのように〜すべきか'],
          ['what to 〜', '何を〜すべきか'],
          ['where to 〜', 'どこで（どこへ）〜すべきか'],
          ['when to 〜', 'いつ〜すべきか'],
          ['which ＋ 名詞 ＋ to 〜', 'どの…を〜すべきか'],
        ],
        examples: [
          ['I don’t know what to do.', '何をすればよいか分かりません。'],
          ['I can’t decide which book to read.', 'どの本を読めばよいか決められません。'],
          ['Please tell me when to start.', 'いつ始めればよいか教えてください。'],
        ],
      },
      {
        title: 'know・tell・show などの後ろに置く',
        text: [
          'このまとまりは know・learn・ask などの目的語になる。tell・show・teach の後ろでは「人＋疑問詞＋to 〜」の順にする（tell me how to 〜）。',
        ],
        examples: [
          ['Please tell me how to use this camera.', 'このカメラの使い方を教えてください。'],
          ['She showed me where to buy the ticket.', '彼女は私にどこで切符を買えばよいかを教えてくれました。'],
          ['My grandfather knows how to use the computer.', '祖父はコンピューターの使い方を知っています。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'tell のあとは〈人＋内容〉の順／切符を買うは buy a ticket／機械を使うは use。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Please tell me how to use it.', 'それの使い方を私に教えてください。'],
          ['He told me where to buy the ticket.', '彼はどこで切符を買えばよいか教えてくれました。'],
          ['My grandfather knows how to use this camera.', '祖父はこのカメラの使い方を知っています。'],
        ],
      },
    ],
    rewrites: [
      ['I don’t know what I should do.', 'I don’t know what to do.', '「何をすべきか」は what I should do（3級の間接疑問）でも what to do でも表せる。'],
    ],
    mistakes: [
      ['I don’t know how to got there.', 'I don’t know how to get there.', 'to の後ろは原形。'],
      ['Please tell how to use it to me.', 'Please tell me how to use it.', 'tell の後ろは「人＋how to 〜」の順。'],
    ],
    check: [
      'how to 〜 しかた、what to 〜 何を、where to 〜 どこで、when to 〜 いつ。',
      'tell / show / teach ＋ 人 ＋ how to 〜 の順。',
    ],
  }),

  referenceUnit({
    key: 'comparison',
    level: '4',
    topic: '比較',
    title: '比較（原級・比較級・最上級）',
    lead: '2つ以上を比べるときの言い方。「同じくらい〜」は as 〜 as、「…より〜」は比較級＋than、「いちばん〜」は the＋最上級 を使う。',
    forms: [
      ['同じくらい', 'A ＋ be動詞 ＋ as ＋ 原級 ＋ as ＋ B.', 'Ken is as tall as his father.', 'ケンはお父さんと同じくらいの背の高さです。'],
      ['…より〜', 'A ＋ be動詞 ＋ 比較級 ＋ than ＋ B.', 'Tom is taller than Ken.', 'トムはケンより背が高いです。'],
      ['いちばん〜', 'A ＋ be動詞 ＋ the ＋ 最上級 ＋ in / of 〜.', 'He is the tallest in his class.', '彼はクラスでいちばん背が高いです。'],
    ],
    points: [
      {
        title: '比較級・最上級の作り方',
        table: [
          ['もとの形', '比較級', '最上級'],
          ['tall（ふつう）', 'taller', 'tallest'],
          ['large（e で終わる）', 'larger', 'largest'],
          ['big（短い母音＋子音字）', 'bigger', 'biggest'],
          ['easy（子音字＋y）', 'easier', 'easiest'],
          ['interesting（長い語）', 'more interesting', 'most interesting'],
          ['good / well', 'better', 'best'],
          ['many / much', 'more', 'most'],
        ],
        examples: [
          ['This bag is better than that one.', 'このかばんはあのかばんよりよいです。'],
          ['This is the most interesting book of the three.', 'これは3冊の中でいちばんおもしろい本です。'],
        ],
      },
      {
        title: '比較級と than',
        text: [
          '2つを比べて「…より〜」は比較級＋than＋比べる相手。副詞も同じように比べられる（run faster than 〜）。',
        ],
        examples: [
          ['She runs faster than I.', '彼女は私より速く走ります。'],
          ['This bridge is longer than the old one.', 'この橋は古い橋より長いです。'],
          ['This river is wider than that one.', 'この川はあの川より広いです。'],
        ],
      },
      {
        title: '最上級と in・of',
        text: [
          '3つ以上の中で「いちばん〜」は the＋最上級。範囲が場所・集団（クラス・日本など）なら in、同じ仲間の数や複数の名詞（the three・all など）なら of を使う。',
          'one of the＋最上級＋複数名詞 は「最も〜なものの1つ」。',
        ],
        examples: [
          ['This is the highest mountain in Japan.', 'これは日本でいちばん高い山です。'],
          ['She is the youngest of the three.', '彼女は3人の中でいちばん若いです。'],
          ['This is one of the most famous temples in Kyoto.', 'これは京都で最も有名なお寺の1つです。'],
        ],
      },
      {
        title: 'as 〜 as と not as 〜 as',
        text: [
          'as＋原級＋as は「…と同じくらい〜」。否定の not as 〜 as は「…ほど〜ではない」。twice as 〜 as（…の2倍〜）のように、倍数を前に置くこともできる。',
        ],
        examples: [
          ['This bag is as light as that one.', 'このかばんはあのかばんと同じくらい軽いです。'],
          ['This box is not as heavy as that one.', 'この箱はあの箱ほど重くありません。'],
          ['My room is twice as large as yours.', '私の部屋はあなたの部屋の2倍の広さです。'],
        ],
      },
      {
        title: '好きなものを比べる',
        text: [
          'like A better than B は「BよりAが好き」、like A the best は「Aがいちばん好き」。Which do you like better, A or B? のようにたずねる。',
        ],
        examples: [
          ['I like cats better than dogs.', '私は犬よりネコが好きです。'],
          ['Which do you like better, summer or winter? — I like summer better.', '夏と冬ではどちらが好きですか。— 夏のほうが好きです。'],
          ['I like spring the best of all seasons.', '私はすべての季節の中で春がいちばん好きです。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '好みを比べるのは like A better than B／値段が高いは expensive／年上は older。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['I like tea better than coffee.', '私はコーヒーより紅茶のほうが好きです。'],
          ['This bag is more expensive than that one.', 'このかばんはあのかばんより値段が高いです。'],
          ['My brother is two years older than I am.', '兄は私より2歳年上です。'],
        ],
      },
    ],
    rewrites: [
      ['Tom is taller than Ken.', 'Ken is not as tall as Tom.', '「トムはケンより背が高い」は「ケンはトムほど背が高くない」と言いかえられる。'],
      ['He is the tallest boy in his class.', 'He is taller than any other boy in his class.', '最上級は「ほかのどの…よりも〜」（比較級＋than any other＋単数名詞）で言いかえられる。'],
    ],
    mistakes: [
      ['He is more taller than Ken.', 'He is taller than Ken.', '-er と more を重ねない。'],
      ['He is the tallest of his class.', 'He is the tallest in his class.', 'クラスのような集団の中は in。'],
      ['This is gooder than that.', 'This is better than that.', 'good の比較級は better。'],
    ],
    check: [
      'as＋原級＋as＝同じくらい、not as 〜 as＝…ほど〜でない。',
      '比較級＋than、the＋最上級＋in（場所・集団）／of（数・仲間）。',
      '長い語は more / most、good は better / best。',
      'like A better than B、like A the best。',
    ],
  }),

  referenceUnit({
    key: 'pronoun',
    level: '4',
    topic: '代名詞',
    title: '代名詞（one・another・something・myself など）',
    lead: '5級の I・my・me・mine に続いて、「同じ種類の1つ」を表す one、「もう1つの」の another、だれか・何かを表す someone・something、「自分自身」を表す myself などを学ぶ。',
    forms: [
      ['同じ種類の別の1つ', 'a ＋ 形容詞 ＋ one', 'I lost my pen, so I bought a new one.', 'ペンをなくしたので、新しいのを買いました。'],
      ['自分自身を', '主語と同じ人・物が目的語のとき ＋ myself など', 'I burned myself while cooking dinner.', '夕食を作っているときにやけどをしました。'],
    ],
    points: [
      {
        title: 'one と it',
        text: [
          'it は「前に出たその物そのもの」、one は「同じ種類の別の1つ」を指す。',
        ],
        examples: [
          ['I lost my umbrella. I have to find it.', '傘をなくしました。それを見つけなければなりません。'],
          ['I lost my umbrella, so I bought a new one.', '傘をなくしたので、新しいのを買いました。'],
        ],
      },
      {
        title: 'another・the other・others',
        table: [
          ['語', '意味'],
          ['another ＋ 単数名詞', 'もう1つの・別の1つの'],
          ['the other', '（2つのうち）残りの1つ'],
          ['others', 'ほかの人・物（いくつか）'],
          ['the others', '残り全部'],
        ],
        examples: [
          ['This cup is dirty. Please give me another one.', 'このカップは汚れています。別のをください。'],
          ['I have two dogs. One is white, and the other is black.', '私は犬を2匹飼っています。1匹は白で、もう1匹は黒です。'],
          ['Some students like math, and others like English.', '数学が好きな生徒もいれば、英語が好きな生徒もいます。'],
        ],
      },
      {
        title: 'something・someone・everyone など',
        text: [
          'something（何か）・someone（だれか）・everyone（みんな）・nothing（何も〜ない）は、特定しない人・物を表す。1人・1つとして扱うので、今の文では動詞に s を付ける（Everyone likes him.）。',
          '疑問文・否定文ではふつう anything・anyone を使う。形容詞は後ろに置く（something cold）。',
        ],
        examples: [
          ['Everyone knows his name.', 'みんなが彼の名前を知っています。'],
          ['Is there anyone in the room?', '部屋にだれかいますか。'],
          ['I want something cold.', '何か冷たいものがほしいです。'],
        ],
      },
      {
        title: 'myself・themselves（自分自身）',
        table: [
          ['主語', '〜自身'],
          ['I', 'myself'],
          ['you（1人）', 'yourself'],
          ['he / she / it', 'himself / herself / itself'],
          ['we', 'ourselves'],
          ['you（2人以上）', 'yourselves'],
          ['they', 'themselves'],
        ],
        text: [
          '主語と同じ人・物が目的語になるときに使う。enjoy oneself（楽しく過ごす）、help yourself（自由に取って食べる）のような決まった言い方もある。',
        ],
        examples: [
          ['We enjoyed ourselves at the party.', '私たちはパーティーで楽しく過ごしました。'],
          ['Please help yourself to the cookies.', 'クッキーを自由に取って食べてください。'],
        ],
      },
      {
        title: 'both・each・all と、天気などの it',
        text: [
          'both（2つ・2人とも）は複数、each（それぞれ）は単数として扱う。',
          'it は天気・時刻・距離などを言う文の主語にもなる。',
        ],
        examples: [
          ['My two sisters play the violin. Both of them practice every day.', '私の2人の姉はバイオリンをひきます。2人とも毎日練習します。'],
          ['Each student has a tablet.', '生徒はそれぞれタブレットを持っています。', { tablet: 'タブレット（端末）' }],
          ['It was snowing heavily this morning.', '今朝は雪が激しく降っていました。'],
          ['It is about two kilometers from here to the station.', 'ここから駅まで約2キロです。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '自由に取っては help yourself to／each のあとは単数の名詞／同じ種類の別の1つは one。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Please help yourself to the cookies.', 'クッキーを自由に取って食べてください。'],
          ['Each student has a tablet.', '生徒はそれぞれタブレットを持っています。'],
          ['I lost my eraser, so I bought a new one.', '消しゴムをなくしたので、新しいのを買いました。'],
        ],
      },
    ],
    mistakes: [
      ['Everyone like him.', 'Everyone likes him.', 'everyone は単数として扱う。'],
      ['Each students has a tablet.', 'Each student has a tablet.', 'each の後ろは単数名詞。'],
      ['I have two dogs. One is white, and another is black.', 'I have two dogs. One is white, and the other is black.', '2つのうち残りの1つは the other。'],
    ],
    check: [
      'it＝その物そのもの、one＝同じ種類の別の1つ。',
      'another（もう1つ）、the other（2つのうち残り）、others（ほかの人・物）。',
      'everyone・something は単数として扱う。',
      '主語と同じ人が目的語なら myself などの再帰代名詞。',
    ],
  }),

  referenceUnit({
    key: 'prep',
    level: '4',
    topic: '前置詞',
    title: '前置詞（動詞との組み合わせ・時と場所）',
    lead: '前置詞は、look for（〜を探す）のように動詞と組んで1つの意味を作ることが多い。4級では、時や場所を表す前置詞もさらに増える。',
    forms: [
      ['動詞 ＋ 前置詞', 'look for / look at / look after ＋ 名詞', 'I am looking for my lost key.', '私はなくした鍵を探しています。'],
    ],
    points: [
      {
        title: 'look の組み合わせ',
        table: [
          ['言い方', '意味'],
          ['look at 〜', '〜を見る'],
          ['look for 〜', '〜を探す'],
          ['look after 〜', '〜の世話をする'],
          ['look forward to 〜', '〜を楽しみに待つ'],
        ],
        examples: [
          ['Look at this picture.', 'この写真を見て。'],
          ['She looks after her little brother.', '彼女は弟の世話をしています。'],
          ['I’m looking forward to the trip.', '私はその旅行を楽しみにしています。'],
        ],
      },
      {
        title: 'よく使う動詞＋前置詞',
        table: [
          ['言い方', '意味'],
          ['wait for 〜', '〜を待つ'],
          ['listen to 〜', '〜を聞く'],
          ['arrive at / in 〜', '〜に着く'],
          ['get to 〜', '〜に着く'],
          ['talk to / with 〜', '〜と話す'],
          ['take care of 〜', '〜の世話をする'],
        ],
        examples: [
          ['I waited for the bus for ten minutes.', '私は10分間バスを待ちました。'],
          ['We listen to music every night.', '私たちは毎晩音楽を聞きます。'],
          ['How can I get to the station?', '駅にはどうやって行けますか。'],
        ],
      },
      {
        title: '時・場所の前置詞の広がり',
        text: [
          'until は「〜までずっと続ける」、by は「〜までに（終える）」で意味がちがう。for は「3日間」のような長さ、during は「夏休みの間」のような決まった期間に使う。',
        ],
        table: [
          ['前置詞', '意味', '例'],
          ['during', '〜の間に（決まった期間）', 'during the summer vacation'],
          ['for', '〜の間（長さ）', 'for three days'],
          ['until', '〜まで（ずっと）', 'until five'],
          ['by', '〜までに（期限）', 'by five'],
          ['between', '（2つ）の間に', 'between the bank and the park'],
          ['among', '（3つ以上）の中に', 'among the students'],
          ['across', '〜を横切って', 'across the street'],
          ['along', '〜に沿って', 'along the river'],
        ],
        examples: [
          ['I visited my uncle during the summer vacation.', '夏休みの間におじを訪ねました。'],
          ['Please finish this by five.', '5時までにこれを終えてください。'],
          ['I will wait here until five.', '5時までここで待ちます。'],
          ['The shop is between the bank and the park.', 'その店は銀行と公園の間にあります。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '探すは look for／到着するは arrive at／音楽を聞くは listen to。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['I am looking for my lost key.', '私はなくした鍵を探しています。'],
          ['We arrived at the airport early.', '私たちは早く空港に着きました。'],
          ['We listen to music every night.', '私たちは毎晩音楽を聞きます。'],
        ],
      },
    ],
    mistakes: [
      ['I am looking my key.', 'I am looking for my key.', '「〜を探す」は look for 〜。'],
      ['Please finish this until five.', 'Please finish this by five.', '「〜までに」は by。until は「〜までずっと」。'],
      ['I arrived to the station.', 'I arrived at the station.', 'arrive の後ろは at / in。'],
    ],
    check: [
      'look at 見る、look for 探す、look after 世話をする。',
      'wait for・listen to・arrive at / in・get to。',
      'until＝までずっと、by＝までに。for＝長さ、during＝期間。',
    ],
  }),

  referenceUnit({
    key: 'tag',
    level: '4',
    topic: '付加疑問',
    title: '付加疑問（〜ですよね）',
    lead: '文の最後に短い疑問を付けて「〜ですよね」と相手に確かめる言い方。ふつうの文には否定の形、否定文には肯定の形を付ける。',
    forms: [
      ['ふつうの文', '〜, ＋ 否定の短縮形 ＋ 代名詞?', 'You are from Canada, aren’t you?', 'あなたはカナダ出身ですよね。'],
      ['否定文', '〜, ＋ 肯定の形 ＋ 代名詞?', 'You don’t like coffee, do you?', 'あなたはコーヒーが好きではないですよね。'],
    ],
    points: [
      {
        title: '作り方',
        text: [
          '①文の動詞に合わせて be動詞・do / does / did・助動詞を選ぶ、②ふつうの文なら否定の短縮形、否定文なら肯定の形にする、③主語を代名詞にして最後に置く。',
        ],
        table: [
          ['文', '付加疑問'],
          ['It is hot today,', 'isn’t it?'],
          ['He plays the guitar,', 'doesn’t he?'],
          ['Ken played tennis,', 'didn’t he?'],
          ['You can swim,', 'can’t you?'],
          ['She isn’t busy,', 'is she?'],
        ],
        examples: [
          ['Ken plays tennis after school, doesn’t he?', 'ケンは放課後にテニスをしますよね。'],
          ['It was a nice day, wasn’t it?', 'いい日でしたね。'],
        ],
      },
      {
        title: '命令文と Let’s の文',
        text: [
          '命令文には will you?（〜してくれますね）、Let’s 〜 には shall we?（〜しましょうね）を付ける。',
        ],
        examples: [
          ['Open the door, will you?', 'ドアを開けてくれますか。'],
          ['Let’s go home, shall we?', '家に帰りましょうか。'],
        ],
      },
      {
        title: '答え方',
        text: [
          '答えは、内容が「そうだ」なら Yes、「ちがう」なら No。否定文の付加疑問では、日本語の「はい・いいえ」と逆に見えることがある（You don’t like coffee, do you? — No, I don’t.＝はい、好きではありません）。',
        ],
        examples: [
          ['You don’t like coffee, do you? — No, I don’t.', 'コーヒーは好きではないですよね。— はい、好きではありません。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'テニスをするは play tennis／家に帰るは go home／ドアを開けるは open the door。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Ken plays tennis every Sunday, doesn’t he?', 'ケンは毎週日曜日にテニスをしますよね。'],
          ['Let’s go home early, shall we?', 'もう家に帰りましょうよ。'],
          ['Please open the door, will you?', 'ドアを開けてくれませんか。'],
        ],
      },
    ],
    mistakes: [
      ['He plays the guitar, isn’t he?', 'He plays the guitar, doesn’t he?', '一般動詞の文には do / does / did を使う。'],
      ['Ken is kind, isn’t Ken?', 'Ken is kind, isn’t he?', '付加疑問の主語は代名詞にする。'],
      ['Let’s go home, will we?', 'Let’s go home, shall we?', 'Let’s の文には shall we?'],
    ],
    check: [
      'ふつうの文 → 否定の形、否定文 → 肯定の形。',
      '一般動詞の文は do / does / did、主語は代名詞。',
      '命令文は will you?、Let’s は shall we?',
    ],
  }),

  referenceUnit({
    key: 'exclamation',
    level: '4',
    topic: '感嘆文',
    title: '感嘆文（What 〜! / How 〜!）',
    lead: '「なんて〜なのだろう」と驚きや感動を表す文。名詞を中心に言うときは What、形容詞・副詞だけを強めるときは How で始め、最後に「!」を付ける。',
    forms: [
      ['What', 'What ＋ (a / an) ＋ 形容詞 ＋ 名詞 ＋ (主語 ＋ 動詞)!', 'What a beautiful view this is!', 'これはなんて美しい景色なのでしょう。'],
      ['How', 'How ＋ 形容詞・副詞 ＋ (主語 ＋ 動詞)!', 'How fast he runs!', '彼はなんて速く走るのでしょう。'],
    ],
    points: [
      {
        title: 'What と How の選び方',
        text: [
          '後ろに名詞があれば What、形容詞・副詞だけなら How。名詞が数えられる単数なら a / an を付け、複数や数えられない名詞なら付けない（What beautiful flowers!）。',
        ],
        table: [
          ['ふつうの文', '感嘆文'],
          ['This is a very beautiful view.', 'What a beautiful view this is!'],
          ['This story is very interesting.', 'How interesting this story is!'],
          ['He runs very fast.', 'How fast he runs!'],
        ],
        examples: [
          ['What an interesting story this is!', 'これはなんておもしろい話なのでしょう。'],
          ['What beautiful flowers these are!', 'これらはなんてきれいな花なのでしょう。'],
        ],
      },
      {
        title: '主語と動詞は省いてもよい',
        text: [
          '感嘆文の最後の「主語＋動詞」は、言わなくても分かるときは省くことが多い（What a nice day! / How cute!）。残すときは「主語＋動詞」の順のままで、疑問文のように入れかえない。',
        ],
        examples: [
          ['What a nice day!', 'なんていい天気でしょう。'],
          ['How cute!', 'なんてかわいいのでしょう。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '景色は view／速さは fast／よい天気の日は a nice day。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['What a wonderful view this is!', 'これはなんてすばらしい景色なのでしょう。'],
          ['How fast that boy runs!', 'あの男の子はなんて速く走るのでしょう。'],
          ['What a nice day we are having today!', '今日はなんてよい天気なのでしょう。'],
        ],
      },
    ],
    mistakes: [
      ['How a beautiful view this is!', 'What a beautiful view this is!', '名詞 view があるので What。'],
      ['What fast he runs!', 'How fast he runs!', '副詞 fast だけなら How。'],
      ['How beautiful is this flower!', 'How beautiful this flower is!', '感嘆文は「主語＋動詞」の順。'],
    ],
    check: [
      '名詞があれば What (a)、形容詞・副詞だけなら How。',
      '最後の主語＋動詞は省ける。残すときは語順を入れかえない。',
    ],
  }),

  referenceUnit({
    key: 'usedto',
    level: '4',
    topic: 'used to',
    title: 'used to（以前は〜したものだ）',
    lead: 'used to＋動詞の原形 は「以前はよく〜したものだ（今はちがう）」「以前は〜だった」と、今とはちがう過去の習慣や状態を表す。',
    forms: [
      ['ふつうの文', '主語 ＋ used to ＋ 動詞の原形 〜.', 'I used to play here as a child.', '子どものころ、ここでよく遊んだものです。'],
      ['否定文', '主語 ＋ did not（didn’t）＋ use to ＋ 原形 〜.', 'I didn’t use to like vegetables.', '以前は野菜が好きではありませんでした。'],
      ['疑問文', 'Did ＋ 主語 ＋ use to ＋ 原形 〜?', 'Did you use to play here?', '以前はここで遊んでいましたか。'],
    ],
    points: [
      {
        title: '今とはちがう過去',
        text: [
          'used to には「今はもうそうではない」という気持ちがふくまれる。習慣（よく〜した）にも状態（〜だった・〜があった）にも使える。',
        ],
        examples: [
          ['Ken used to play tennis years ago.', 'ケンは何年も前にはテニスをしていました。'],
          ['There used to be a tree here.', '以前はここに木がありました。'],
        ],
      },
      {
        title: '否定文・疑問文では use to',
        text: [
          'did・didn’t を使う否定文・疑問文では、did が過去を表すので used の d を取って use to にする。',
        ],
        examples: [
          ['I did not use to like vegetables.', '以前は野菜が好きではありませんでした。'],
          ['Did you use to play here as a child?', '子どものころ、ここで遊んでいましたか。'],
        ],
      },
      {
        title: 'used to の後ろは原形',
        text: [
          'used to の to は不定詞の to なので、後ろは動詞の原形。be used to 〜ing（〜に慣れている）は別の言い方で、準2級で学ぶ。',
        ],
        examples: [
          ['My grandfather used to walk to school.', '祖父は以前、歩いて学校に通っていました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'used to のあとは動詞の原形／以前あった物は There used to be／歩いて通うは walk to。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Ken used to play tennis every weekend.', 'ケンは以前、毎週末にテニスをしていました。'],
          ['There used to be a big tree here.', '以前はここに大きな木がありました。'],
          ['My grandfather used to walk to school every day.', '祖父は毎日歩いて学校へ通っていました。'],
        ],
      },
    ],
    mistakes: [
      ['I used to playing tennis.', 'I used to play tennis.', 'used to の後ろは原形。'],
      ['Did you used to play here?', 'Did you use to play here?', 'did の後ろでは use to。'],
    ],
    check: [
      'used to＋原形＝以前は〜したものだ（今はちがう）。',
      '否定・疑問は didn’t use to / Did 〜 use to。',
      'There used to be 〜＝以前は〜があった。',
    ],
  }),
]
