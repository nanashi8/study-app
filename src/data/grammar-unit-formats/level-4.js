// 単元別の並び替え・語法：英検4級（全15単元）。参考書の各ページで学ぶ形をそのまま問う。
import { unitFormats } from './build.js'

export const GRAMMAR_UNIT_FORMATS_4 = unitFormats('4', [
  {
    unit: 'gref_4_past',
    order: [
      ['不規則動詞は形ごと変わる', 'My father bought a new camera last month.', '父は先月、新しいカメラを買いました。', 'buy の過去形は ed を付けず bought になる。過去を表す last month があるので、動詞を過去形にして置く。'],
      ['Did の疑問文では動詞は原形', 'Did you finish your report yesterday?', 'あなたは昨日レポートを終えましたか。', '過去の疑問文は Did で始める。Did が過去を表すので、そのあとの動詞は原形 finish に戻す。'],
    ],
    usage: [
      ['参加するは take part in', 'We ___ part in the city marathon last year.', ['took', 'did', 'made', 'got'], 'took', '私たちは昨年、市のマラソンに参加しました。', 'take part in 〜 で「〜に参加する」という決まった結び付きになる。過去の文なので take を過去形 took にする。', [
        'take part in 〜 で「〜に参加する」。過去の文なので took にする。',
        'do part in 〜 という結び付きはない。参加するは take part in で表す。',
        'make part in 〜 という結び付きはない。make は「作る」を表す動詞。',
        'got part in 〜 という結び付きはない。get は「手に入れる・着く」を表す動詞。',
      ]],
    ],
  },
  {
    unit: 'gref_4_pastprog',
    order: [
      ['複数の主語には were', 'The students were cleaning the classroom then.', '生徒たちはそのとき教室をそうじしていました。', '過去進行形は was / were ＋動詞ing。主語 The students は複数なので were を使い、そのあとに cleaning を置く。'],
      ['否定は was / were のすぐ後ろに not', 'I was not sleeping at eleven.', '私は11時には眠っていませんでした。', '過去進行形の否定文は was / were のすぐ後ろに not を置き、そのあとに動詞ing を続ける。'],
      ['疑問文は was / were を主語の前へ', 'What were you doing yesterday afternoon?', 'あなたは昨日の午後、何をしていましたか。', '疑問詞を文の先頭に置き、そのあとを were＋主語＋動詞ing の語順にする。'],
    ],
    usage: [
      ['そのときは at that time', 'Ken was studying ___ that time.', ['at', 'in', 'on', 'by'], 'at', 'ケンはそのとき勉強していました。', 'at that time で「そのとき」と過去の一点を指す。過去進行形と組にしてよく使う。', [
        'at that time で「そのとき」。時の一点を指すときは at を使う。',
        'in that time という結び付きはふつう使わない。時の一点は at で表す。',
        'on that time という結び付きはない。on は曜日や日付に使う。',
        'by that time は「そのときまでには」と期限を表し、その瞬間の様子を表さない。',
      ]],
      ['know は過去進行形にしない', 'I ___ his name then.', ['knew', 'was knowing', 'know', 'am knowing'], 'knew', '私はそのとき彼の名前を知っていました。', 'know は状態を表す動詞なので、過去のことでも進行形にせず過去形 knew にする。', [
        'know は状態を表す動詞なので、過去のことは過去形 knew で表す。',
        'know は状態を表す動詞なので、was knowing という進行形にはしない。',
        'know は現在形で、過去を表す then のある文には合わない。',
        'am knowing は現在の進行形で、状態を表す know は進行形にしないうえ、過去の文にも合わない。',
      ]],
      ['〜している間には while＋主語＋動詞', '___ I was cooking, the phone rang.', ['While', 'During', 'Between', 'For'], 'While', '私が料理をしている間に、電話が鳴りました。', 'while のあとには〈主語＋動詞〉のまとまりを続ける。名詞だけを続ける during と使い分ける。', [
        'while のあとには I was cooking のような〈主語＋動詞〉のまとまりを続ける。',
        'during のあとには the summer のような名詞だけを置く。〈主語＋動詞〉は続けられない。',
        'between は2つのものの間を表す語で、〈主語＋動詞〉を続けることはできない。',
        'for は for two hours のように長さを表す語で、〈主語＋動詞〉を続けることはできない。',
      ]],
    ],
  },
  {
    unit: 'gref_4_future',
    order: [
      ['will のあとは動詞の原形', 'I will call you again tomorrow evening.', '私は明日の夕方にまた電話します。', 'will のあとの動詞はいつも原形。will call のまとまりを作り、目的語と時を表す語句を続ける。'],
      ['be going to の否定は be動詞＋not', 'She is not going to come today.', '彼女は今日は来ない予定です。', 'be going to の否定文は be動詞のすぐ後ろに not を置く。going to のあとは動詞の原形 come のままにする。'],
    ],
    usage: [
      ['be going to は be動詞を忘れない', 'I ___ going to visit my uncle next week.', ['am', 'will', 'do', 'have'], 'am', '私は来週おじを訪ねる予定です。', 'be going to は be動詞＋going to の形。主語 I には am を置き、そのあとに going to＋原形を続ける。', [
        '主語 I に合わせて am を置き、am going to visit の形にする。',
        'will going to という重ね方はしない。will を使うなら will visit とする。',
        'do going to という結び付きはない。do は否定文・疑問文を作る語。',
        'have going to という結び付きはない。have は「持っている」などを表す動詞。',
      ]],
      ['その場で決めた申し出は I’ll', 'Your bag looks heavy. ___ carry it for you.', ['I’ll', 'I’m', 'I do', 'I have'], 'I’ll', 'かばんが重そうですね。私が運びましょう。', 'その場で決めた「〜しましょう」は will（I’ll）で表す。前から決めていた予定の be going to と使い分ける。', [
        'I’ll は I will を縮めた形。その場で決めた申し出は will で表す。',
        'I’m carry という形はない。be動詞のあとに動詞の原形は続けられない。',
        'I do carry it は「ふだん運んでいる」と現在のことを強めて言う形で、これからの申し出にならない。',
        'I have carry という形はない。have のあとに動詞の原形は続けられない。',
      ]],
    ],
  },
  {
    unit: 'gref_4_modal',
    order: [
      ['must のあとは動詞の原形', 'You must wear a helmet here.', 'ここではヘルメットをかぶらなければなりません。', 'must は助動詞なので、そのあとの動詞は原形 wear にする。must に s や to は付けない。'],
      ['don’t have to は「必要はない」', 'You don’t have to bring your lunch.', 'あなたはお弁当を持ってくる必要はありません。', 'don’t have to＋原形は「〜する必要はない」。「〜してはいけない」の must not とは意味がちがう。'],
      ['should は「〜したほうがよい」', 'You should take a rest today.', '今日は休んだほうがいいですよ。', 'should＋動詞の原形で「〜すべきだ・〜したほうがよい」と助言を表す。'],
    ],
    usage: [
      ['3人称単数の主語には has to', 'Ken ___ to finish his homework before dinner.', ['has', 'have', 'having', 'be'], 'has', 'ケンは夕食前に宿題を終えなければなりません。', 'have to は主語が3人称単数のとき has to に形を変える。must は形が変わらない点とちがう。', [
        '主語 Ken は3人称単数なので has to にする。そのあとは動詞の原形 finish を置く。',
        'have to は主語が I・you・複数のときの形。3人称単数の Ken には has to を使う。',
        'having to だけでは文の動詞にならない。主語のすぐ後ろには has to を置く。',
        'be to finish という形はここでは使わない。「〜しなければならない」は has to で表す。',
      ]],
      ['許可を求める May I 〜?', '___ I use your pen? Sure.', ['May', 'Do', 'Am', 'Have'], 'May', 'あなたのペンを使ってもよいですか。いいですよ。', 'May I 〜? は「〜してもよいですか」とていねいに許可を求める言い方。Sure. などで答える。', [
        'May I 〜? で「〜してもよいですか」と許可を求める。Can I 〜? よりていねいな言い方になる。',
        'Do I use your pen? は「私はあなたのペンを使いますか」と事実をたずねる文で、許可を求める意味にならない。',
        'Am I use 〜? という形はない。be動詞のあとに動詞の原形は続けられない。',
        'Have I use 〜? という形はない。have のあとに動詞の原形は続けられない。',
      ]],
      ['申し出る Shall I 〜?', '___ I carry your bag? Yes, please.', ['Shall', 'Will', 'Do', 'Am'], 'Shall', 'かばんをお持ちしましょうか。はい、お願いします。', 'Shall I 〜? は「（私が）〜しましょうか」と申し出る言い方。Yes, please. などで答える。', [
        'Shall I 〜? で「〜しましょうか」と申し出る。答えは Yes, please. / No, thank you. となる。',
        'Will I 〜? は「私は〜することになりますか」と自分の先のことをたずねる形で、申し出にならない。',
        'Do I carry your bag? は「私はふだんかばんを持ちますか」と事実をたずねる文になる。',
        'Am I carry 〜? という形はない。be動詞のあとに動詞の原形は続けられない。',
      ]],
    ],
  },
  {
    unit: 'gref_4_conj',
    order: [
      ['so は結果をつなぐ', 'I was very tired, so I went home early.', '私はとても疲れていたので、早く家に帰りました。', 'so は前の文を受けて「だから〜」と結果をつなぐ。理由の文を先に置き、そのあとに so＋結果の文を続ける。'],
      ['because は理由を付け加える', 'We stayed inside because it was raining.', '雨が降っていたので、私たちは中にいました。', 'because のあとには〈主語＋動詞〉のまとまりを続け、前の文に理由を付け加える。'],
      ['if のまとまりを前に置く', 'If you are free, let’s go shopping.', 'もしひまなら、買い物に行きましょう。', 'if のまとまりを文の前に置くときは、その終わりにコンマを打ち、そのあとに言いたい内容の文を続ける。'],
    ],
    usage: [
      ['when の中は未来でも現在形', 'Please call me when you ___ at the airport.', ['arrive', 'will arrive', 'arrived', 'arriving'], 'arrive', '空港に着いたら電話してください。', 'when のまとまりの中は、これから先のことでも will を使わず現在形 arrive で表す。', [
        'when のまとまりの中は、これから先のことでも現在形 arrive にする。',
        'when のまとまりの中では will を使わない。未来のことも現在形で表す。',
        'arrived は過去形で、これから空港に着く場面には合わない。',
        'arriving だけではまとまりの動詞にならない。主語 you に続けるなら arrive にする。',
      ]],
      ['「〜だと思う」は think that', 'I think ___ her idea is good.', ['that', 'what', 'which', 'if'], 'that', '私は彼女の考えがよいと思います。', 'think のあとに〈主語＋動詞〉の文を続けるときは that でつなぐ。この that は省くこともできる。', [
        'think that＋文 で「〜だと思う」。that のあとは her idea is good という完全な文になる。',
        'what は「〜なこと」を表し、後ろに足りない部分のある文を続ける。ここでは文がそろっているので合わない。',
        'which は「どちらの」とたずねたり、名詞を説明したりする語で、think の後ろの文をつなぐ働きはない。',
        'if は「〜かどうか」を表し、I think if 〜 の形では使わない。',
      ]],
      ['though のあとに but は置かない', '___ it was cold, I went out.', ['Though', 'But', 'So', 'And'], 'Though', '寒かったけれど、私は外出しました。', 'though（although）のまとまりで「〜だけれども」を表す。日本語につられて後ろの文に but を重ねない。', [
        'Though＋〈主語＋動詞〉で「〜だけれども」となり、後ろの文とつながる。',
        'But は文と文を対等につなぐ語で、文の先頭に置いて前半のまとまりを作ることはできない。',
        'So は「だから」と結果をつなぐ語で、ここでは前半と後半の関係が合わない。',
        'And は「そして」と内容を並べる語で、逆の内容をつなぐ働きはない。',
      ]],
    ],
  },
  {
    unit: 'gref_4_there',
    order: [
      ['過去で複数なら There were', 'There were two chairs in the room.', '部屋にはいすが2きゃくありました。', 'There is / are の be動詞は後ろの名詞に合わせる。two chairs は複数で過去のことなので were を使う。'],
      ['疑問文は Is there で始める', 'Is there a bank near your house?', 'あなたの家の近くに銀行はありますか。', 'There is 〜. の疑問文は be動詞を there の前に出して Is there 〜? とする。'],
    ],
    usage: [
      ['否定文では any を使う', 'There ___ any eggs in the fridge.', ['aren’t', 'isn’t', 'doesn’t', 'wasn’t'], 'aren’t', '冷蔵庫には卵が1つもありません。', 'There の文の be動詞は後ろの名詞に合わせる。eggs は複数なので aren’t になり、否定文では some ではなく any を使う。', [
        '後ろの eggs が複数なので aren’t を使う。否定文なので any が続く。',
        'isn’t は後ろが1つのときの形。eggs は複数なので合わない。',
        'doesn’t は一般動詞の否定に使う語で、There の文では be動詞を使う。',
        'wasn’t は過去で1つのときの形。複数の eggs にも、今のことにも合わない。',
      ]],
      ['数をたずねる How many 〜 are there', 'How many students ___ there in your class?', ['are', 'is', 'do', 'have'], 'are', 'あなたのクラスには何人の生徒がいますか。', '数をたずねるときは〈How many＋複数形＋are there 〜?〉の語順にする。', [
        'students は複数なので are there の語順にする。',
        'is は1つのときの形で、複数の students には合わない。',
        'do は一般動詞の疑問文に使う語で、There の文では be動詞を使う。',
        'have は「持っている」を表す動詞で、There の文の疑問形にはならない。',
      ]],
      ['どれか決まっている物は It is で言う', 'Where is my bag? ___ on the desk.', ['It is', 'There is', 'It has', 'There has'], 'It is', '私のかばんはどこですか。机の上にあります。', 'There is 〜. は初めて話に出す物に使う。どれかが決まっている my bag の場所は It is 〜. で答える。', [
        'すでに話に出ている my bag を受けるので、It is＋場所 で答える。',
        'There is は相手がまだ知らない物を初めて伝えるときの形で、決まっている物の場所には使わない。',
        'It has 〜 は「それは〜を持っている」で、場所を答える文にならない。',
        'There has という形はない。There のあとには be動詞を置く。',
      ]],
    ],
  },
  {
    unit: 'gref_4_inf',
    order: [
      ['「〜すること」は動詞の目的語になる', 'My sister hopes to study in Canada.', '姉はカナダで勉強したいと思っています。', 'hope のあとに「〜すること」を置くときは to＋動詞の原形にする。hope to study のまとまりを作る。'],
      ['「〜するための」は名詞を後ろから説明する', 'I need something cold to drink.', '私は何か冷たい飲み物が必要です。', 'something を説明する語は後ろに置く。〈something＋形容詞＋to＋原形〉の順で「何か冷たい飲み物」となる。'],
      ['「〜するために」は目的を表す', 'Emi got up early to catch the first train.', 'エミは始発列車に乗るために早く起きました。', '動作の目的は to＋動詞の原形で表し、文の後ろに置く。「早く起きた目的＝始発に乗るため」となる。'],
    ],
    usage: [
      ['〜してうれしいは be glad to', 'I am glad ___ see you again.', ['to', 'for', 'of', 'at'], 'to', 'また会えてうれしいです。', 'be glad to＋動詞の原形で「〜してうれしい」と気持ちの理由を表す。', [
        'glad のあとに理由となる動作を置くときは to＋動詞の原形にする。',
        'for のあとには名詞や動名詞を置く。動詞の原形 see を続けることはできない。',
        'of のあとには名詞や動名詞を置く。be glad of 〜 でも動詞の原形は続かない。',
        'at のあとには名詞を置く。動詞の原形 see を続けることはできない。',
      ]],
      ['「何か飲む物」は something to drink', 'I need something ___ in this heat.', ['to drink', 'drinking', 'drink', 'for drink'], 'to drink', 'この暑さの中で、私は何か飲む物が必要です。', 'something のような代名詞を後ろから説明するときは to＋動詞の原形を置き、something to drink とする。', [
        'something to drink で「何か飲む物」。to＋原形が前の something を後ろから説明する。',
        'drinking を置くと「飲んでいる何か」となり、これから飲む物を表す言い方にならない。',
        'something drink と原形を並べても、前の語を説明する形にはならない。',
        'for drink という言い方はふつう使わない。説明は to＋原形で付ける。',
      ]],
    ],
  },
  {
    unit: 'gref_4_ger',
    order: [
      ['enjoy のあとは動名詞', 'My brother enjoys playing the drums.', '兄はドラムをたたくのを楽しんでいます。', 'enjoy のあとに「〜すること」を置くときは動詞ing にする。to＋原形は続けられない。'],
      ['動名詞は主語にもなる', 'Walking in the morning is good exercise.', '朝に歩くことはよい運動です。', '動詞ing が「〜すること」という主語になる。主語のまとまりは1つと数えるので、動詞は is にする。'],
      ['前置詞のあとは動名詞', 'Thank you for helping me yesterday.', '昨日は手伝ってくれてありがとう。', '前置詞 for のあとに動作を置くときは動詞ing にする。動詞の原形は続けられない。'],
    ],
    usage: [
      ['得意だは be good at＋動名詞', 'My sister is good ___ making sweets.', ['at', 'in', 'on', 'to'], 'at', '姉はお菓子を作るのが得意です。', 'be good at＋動名詞で「〜するのが得意だ」という決まった結び付きになる。', [
        'be good at 〜ing で「〜するのが得意だ」。at のあとは動名詞になる。',
        'good in 〜 は得意であることを表す言い方ではない。',
        'good on 〜 という結び付きはなく、得意であることは表せない。',
        'good to 〜 は「〜に親切だ」という別の意味になる。',
      ]],
      ['How about のあとは動名詞', 'How about ___ to the zoo tomorrow?', ['going', 'go', 'to go', 'went'], 'going', '明日、動物園へ行くのはどうですか。', 'How about 〜? の about は前置詞なので、後ろの動作を going と動詞ing にする。', [
        'about は前置詞なので、後ろの動作は going と動名詞にする。',
        '前置詞 about のあとに動詞の原形 go は置けない。',
        'How about to go という言い方はしない。about のあとは動名詞にする。',
        'went は過去形で、前置詞のあとにも、これからの誘いにも合わない。',
      ]],
      ['finish のあとは動名詞', 'I finished ___ the book last night.', ['reading', 'to read', 'read', 'reads'], 'reading', '私は昨夜その本を読み終えました。', 'finish のあとに「〜すること」を置くときは動詞ing にして finish reading とする。to＋原形は続けられない。', [
        'finish のあとは動名詞。finish reading で「読み終える」となる。',
        'finish のあとに to＋原形は置けない。to read を続ける動詞は want などにかぎられる。',
        'finished read と過去形と原形を並べることはできない。',
        'reads は3人称単数のときの現在形で、finished のあとに続けることはできない。',
      ]],
    ],
  },
  {
    unit: 'gref_4_whto',
    order: [
      ['show＋人＋where to の順', 'Please show me where to buy the ticket.', '切符をどこで買えばよいか教えてください。', 'show のあとは〈人＋内容〉の順。内容は where to buy the ticket というひとまとまりにして置く。'],
      ['what to は「何を〜すべきか」', 'I don’t know what to do next.', '私は次に何をすべきか分かりません。', '疑問詞＋to＋動詞の原形で1つの名詞のまとまりになる。know の目的語として what to do next を置く。'],
    ],
    usage: [
      ['how to＋動詞の原形', 'My grandfather knows how ___ the computer.', ['to use', 'use', 'using', 'used'], 'to use', '祖父はコンピューターの使い方を知っています。', 'how to＋動詞の原形で「〜のしかた」を表す。ここは how to use として、to のあとを原形にする。', [
        'how to use で「使い方」。疑問詞のあとは to＋動詞の原形にする。',
        'how use という並べ方はしない。how のあとには to を置く。',
        'how using という言い方はしない。まとまりは to＋原形で作る。',
        'how used では過去形になり、「〜のしかた」を表すまとまりにならない。',
      ]],
      ['which＋名詞＋to＋原形', 'I can’t decide which book ___.', ['to read', 'reading', 'read', 'to reading'], 'to read', '私はどの本を読めばよいか決められません。', 'which のあとに名詞を置き、そのあとを to＋動詞の原形にする。which book to read で「どの本を読むべきか」となる。', [
        'which book to read で「どの本を読むべきか」。名詞のあとを to＋原形にする。',
        'which book reading では、読むべき本を表すまとまりにならない。',
        'which book read と原形だけを並べても、まとまりにはならない。',
        'to のあとは動詞の原形なので、to reading という形にはしない。',
      ]],
      ['tell のあとは〈人＋内容〉の順', 'Please tell ___ how to use it.', ['me', 'to me', 'for me', 'my'], 'me', 'それの使い方を私に教えてください。', 'tell は〈tell＋人＋内容〉の順に置く。人は目的格 me にし、その前に to を付けない。', [
        'tell のすぐ後ろに人を置くので、目的格 me を使う。',
        'tell to me という形はしない。tell は人を直接後ろに置く。',
        'tell for me は「私のために話す」となり、「私に教える」という意味にならない。',
        'my は名詞の前に置いて「私の」を表す形で、tell の後ろには置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_4_comparison',
    order: [
      ['比較級＋than で2つを比べる', 'This box is heavier than that one.', 'この箱はあの箱より重いです。', 'heavy は〈子音＋y〉で終わるので、y を i に変えて er を付け heavier にする。比べる相手は than のあとに置く。'],
      ['the＋最上級＋in＋集団', 'Emi is the tallest girl in our class.', 'エミは私たちのクラスでいちばん背の高い女の子です。', '「いちばん〜」は the＋最上級。範囲が集団や場所のときは in を使い、in our class とする。'],
    ],
    usage: [
      ['同じくらいは as＋原級＋as', 'My bag is ___ light as yours.', ['as', 'more', 'than', 'the'], 'as', '私のかばんはあなたのかばんと同じくらい軽いです。', 'as＋原級＋as 〜 で「〜と同じくらい…」。間に入る形容詞は比較級にせず原級のまま置く。', [
        'as light as 〜 で「〜と同じくらい軽い」。前後を as ではさむ。',
        'more light as という言い方はない。light を比べるなら lighter than にする。',
        'than は比較級と組にして使う語で、後ろの as と組にはならない。',
        'the は最上級と組にして使う語で、as 〜 as の形には入らない。',
      ]],
      ['仲間の数が範囲なら of', 'She is the youngest ___ the three.', ['of', 'in', 'on', 'at'], 'of', '彼女は3人の中でいちばん年下です。', '最上級の範囲が「3人の中で」のように数や仲間のときは of を使う。場所や集団のときは in を使う。', [
        'of the three で「3人の中で」。数や仲間を範囲にするときは of を使う。',
        'in は in our class のように場所や集団を範囲にするときに使う。',
        'on は上にあることを表す前置詞で、範囲を表す言い方にはならない。',
        'at は時や地点を表す前置詞で、最上級の範囲には使わない。',
      ]],
      ['好みを比べるのは like A better than B', 'I like tea ___ than coffee.', ['better', 'more good', 'best', 'well'], 'better', '私はコーヒーより紅茶のほうが好きです。', 'like A better than B で「BよりAのほうが好きだ」。good・well の比較級は better になる。', [
        'like 〜 better than … で好みを比べる。well の比較級は better。',
        'more good という形はない。good・well の比較級は better の1語。',
        'best は最上級で、than と組にはならない。like 〜 the best of … の形で使う。',
        'well は比べていない形なので、than と組にして使うことはできない。',
      ]],
    ],
  },
  {
    unit: 'gref_4_pronoun',
    order: [
      ['one は同じ種類の別の1つ', 'My cup is broken, so I need a new one.', '私のカップは割れているので、新しいのが必要です。', 'すでに出た名詞と同じ種類の別の1つは one で受ける。前に形容詞を置いて a new one とする。'],
      ['2つのうち残りは the other', 'One is white, and the other is black.', '1匹は白くて、もう1匹は黒いです。', '2つのうち1つを one、残りの1つを the other で表す。残りが決まっているので the を付ける。'],
      ['主語と同じ人が目的語なら再帰代名詞', 'The children enjoyed themselves at the zoo.', '子どもたちは動物園で楽しく過ごしました。', 'enjoy oneself で「楽しく過ごす」。主語 The children と同じ人を指すので themselves にする。'],
    ],
    usage: [
      ['everyone は1人として扱う', 'Everyone ___ his name.', ['knows', 'know', 'are knowing', 'have known'], 'knows', 'みんなが彼の名前を知っています。', 'everyone・someone などは、意味は多くの人でも文の上では1人として扱う。現在の文では動詞に s を付けて knows にする。', [
        'everyone は1人として扱うので、現在の文では動詞に s を付けて knows にする。',
        'know は主語が I・you・複数のときの形で、everyone には合わない。',
        'know は状態を表す動詞なので進行形にしないうえ、are も everyone には合わない。',
        'have known は主語が複数のときの形。everyone には has known を使う。',
      ]],
      ['自由に取っては help yourself to', 'Please help ___ to the cookies.', ['yourself', 'you', 'your', 'yours'], 'yourself', 'クッキーを自由に取って食べてください。', 'help oneself to 〜 で「〜を自由に取って食べる」という決まった言い方になる。相手1人には yourself を使う。', [
        'help yourself to 〜 で「〜を自由に取って食べる」。相手1人には yourself を使う。',
        'help you では「あなたを手伝う」となり、自由に取ってという意味にならない。',
        'your は名詞の前に置いて「あなたの」を表す形で、help の後ろには置けない。',
        'yours は「あなたのもの」を表す語で、この決まった言い方には入らない。',
      ]],
      ['each のあとは単数の名詞', '___ student has a tablet.', ['Each', 'All', 'Both', 'Many'], 'Each', '生徒はそれぞれタブレットを持っています。', 'each は「それぞれの」を表し、後ろに単数の名詞を置いて1人ずつを指す。動詞も単数に合わせる。', [
        'Each student で「それぞれの生徒」。後ろは単数の名詞になり、動詞も has になる。',
        'All のあとは複数の名詞にする。All students have 〜. の形になる。',
        'Both は2つ・2人のときに使い、後ろは複数の名詞にする。',
        'Many のあとは複数の名詞にする。Many students have 〜. の形になる。',
      ]],
    ],
  },
  {
    unit: 'gref_4_prep',
    order: [
      ['look after は「世話をする」', 'My aunt looks after our dog sometimes.', 'おばはときどき私たちの犬の世話をしてくれます。', 'look after 〜 で「〜の世話をする」。look と after を組にして1つの動詞のように使う。'],
      ['wait for は「〜を待つ」', 'They waited for the train in the rain.', '彼らは雨の中で電車を待ちました。', 'wait は目的語の前に for が必要で、wait for 〜 で「〜を待つ」となる。'],
      ['by は「〜までに」', 'Please finish this report by five.', 'このレポートを5時までに仕上げてください。', 'by は締め切りを表し「〜までに」となる。その時までずっと続く until と使い分ける。'],
    ],
    usage: [
      ['到着するは arrive at', 'We arrived ___ the airport early.', ['at', 'to', 'for', 'on'], 'at', '私たちは早く空港に着きました。', 'arrive は目的語の前に前置詞が必要で、地点には at、広い場所には in を使う。to は使わない。', [
        'arrive at 〜 で「〜に着く」。駅や空港のような地点には at を使う。',
        'arrive to 〜 という言い方はしない。to を使うなら get to 〜 とする。',
        'arrive for 〜 では到着した場所を表せない。for は目的や相手を表す。',
        'arrive on 〜 では上にのる意味になり、着いた場所を表す言い方にならない。',
      ]],
      ['音楽を聞くは listen to', 'We ___ to music every night.', ['listen', 'hear', 'sound', 'look'], 'listen', '私たちは毎晩音楽を聞きます。', 'listen to 〜 で「〜に耳をかたむけて聞く」。意識して聞くときは listen、自然に聞こえるときは hear を使う。', [
        'listen to 〜 で「〜を聞く」。意識して耳をかたむけるときに使う。',
        'hear は「自然に聞こえる」で、to を付けずに hear music とする。',
        'sound は「〜に聞こえる」で、to music と続けて「音楽を聞く」意味にはならない。',
        'look は「見る」で、音を聞く意味にはならない。',
      ]],
    ],
  },
  {
    unit: 'gref_4_tag',
    order: [
      ['一般動詞の文には doesn’t he', 'Your sister plays the violin, doesn’t she?', 'あなたのお姉さんはバイオリンをひきますよね。', 'ふつうの文には否定の短い疑問を付ける。一般動詞の3人称単数の文なので doesn’t を使い、主語は代名詞 she にする。'],
      ['否定文には肯定の形を付ける', 'Tom doesn’t eat meat, does he?', 'トムは肉を食べませんよね。', '否定文の後ろには肯定の形を付ける。doesn’t の文なので does he? を続ける。'],
      ['Let’s の文には shall we', 'Let’s go home now, shall we?', 'もう家に帰りましょうよ。', 'Let’s 〜. の文に付ける短い疑問は shall we? と決まっている。'],
    ],
    usage: [
      ['be動詞の文には aren’t you', 'You are from Australia, ___ you?', ['aren’t', 'don’t', 'isn’t', 'won’t'], 'aren’t', 'あなたはオーストラリア出身ですよね。', '付加疑問は前の文と同じ種類の語を使う。be動詞 are の文なので aren’t you? を付ける。', [
        'are の文なので、否定の短縮形 aren’t を使って aren’t you? とする。',
        'don’t は一般動詞の文に付ける形で、be動詞 are の文には合わない。',
        'isn’t は主語が he・she・it などのときの形。主語 You には aren’t を使う。',
        'won’t は will の否定で、これから先のことを言う文に付ける形。',
      ]],
      ['付加疑問の主語は代名詞にする', 'Ken is kind, isn’t ___?', ['he', 'Ken', 'him', 'his'], 'he', 'ケンは親切ですよね。', '付加疑問の主語は、前の文の主語を代名詞に置きかえて置く。Ken は he になる。', [
        '前の文の主語 Ken を代名詞に置きかえて he にする。',
        '付加疑問では名前をくり返さず、代名詞に置きかえる。',
        'him は動詞や前置詞の後ろに置く目的格で、付加疑問の主語にはならない。',
        'his は「彼の」を表す形で、主語にはならない。',
      ]],
      ['命令文には will you', 'Open the door, ___ you?', ['will', 'do', 'are', 'shall'], 'will', 'ドアを開けてくれませんか。', '命令文の後ろに付ける短い疑問は will you? にする。Let’s の文に付ける shall we? と使い分ける。', [
        '命令文には will you? を付けて、やわらかい頼み方にする。',
        'do you? は一般動詞のふつうの文に付ける形で、命令文には付けない。',
        'are you? は be動詞の文に付ける形で、命令文には付けない。',
        'shall we? は Let’s 〜. の文に付ける形で、命令文には付けない。',
      ]],
    ],
  },
  {
    unit: 'gref_4_exclamation',
    order: [
      ['What＋a＋形容詞＋名詞', 'What a kind boy he is!', '彼はなんて親切な男の子なのでしょう。', '名詞を中心に驚きを言うときは What で始める。数えられる名詞1つには a を付け、そのあとに〈主語＋動詞〉を続ける。'],
      ['How＋形容詞＋主語＋動詞', 'How beautiful this flower is!', 'この花はなんて美しいのでしょう。', '形容詞だけを強めるときは How で始め、そのあとは〈主語＋動詞〉の語順にする。疑問文の語順にはしない。'],
      ['複数の名詞には a を付けない', 'What tall buildings those are!', 'あれらはなんて高い建物なのでしょう。', 'What の後ろの名詞が複数のときは a・an を付けない。〈What＋形容詞＋複数名詞＋主語＋動詞〉の順になる。'],
    ],
    usage: [
      ['名詞があれば What', '___ a nice day it is today!', ['What', 'How', 'Very', 'So'], 'What', '今日はなんてよい日なのでしょう。', '後ろに名詞（day）があるので What で始める。形容詞・副詞だけを強めるときは How を使う。', [
        '後ろに a nice day という名詞のまとまりがあるので What で始める。',
        'How のあとには形容詞・副詞だけを置く。名詞 day が続くこの文には合わない。',
        'Very は形容詞を強める語で、文全体を感嘆文にする働きはない。',
        'So は「とても」と強める語だが、a nice day を続けて感嘆文を作ることはできない。',
      ]],
      ['形容詞・副詞だけなら How', '___ fast she swims!', ['How', 'What', 'What a', 'Very'], 'How', '彼女はなんて速く泳ぐのでしょう。', '後ろが副詞 fast だけなので How で始める。名詞があるときの What と使い分ける。', [
        '後ろが副詞 fast だけなので How fast 〜! の形にする。',
        'What のあとには名詞のまとまりを置く。fast だけが続くこの文には合わない。',
        'What a のあとには〈形容詞＋名詞〉を置く。名詞がないので使えない。',
        'Very は感嘆文を作る語ではなく、文の先頭に置いて驚きを表すことはできない。',
      ]],
      ['感嘆文の終わりは〈主語＋動詞〉', 'How kind ___!', ['she is', 'is she', 'she', 'is'], 'she is', '彼女はなんて親切なのでしょう。', '感嘆文の終わりは〈主語＋動詞〉の順に置いて she is とする。疑問文のように動詞を前に出さない。', [
        'How＋形容詞のあとは〈主語＋動詞〉の順なので she is とする。',
        'is she は疑問文の語順で、感嘆文にはしない。',
        'she だけでは動詞がなく、文の形が整わない。',
        'is だけでは主語がなく、だれのことか分からない。',
      ]],
    ],
  },
  {
    unit: 'gref_4_usedto',
    order: [
      ['used to＋原形で昔の習慣', 'My father used to live in Osaka.', '父は以前、大阪に住んでいました。', 'used to＋動詞の原形で「以前は〜だった（今はちがう）」を表す。to のあとは原形 live のまま置く。'],
      ['否定は didn’t use to', 'I didn’t use to like carrots.', '私は以前はニンジンが好きではありませんでした。', '否定文では did が過去を表すので、used ではなく use to に戻して didn’t use to＋原形とする。'],
      ['There used to be で昔あった物を言う', 'There used to be a post office here.', '以前はここに郵便局がありました。', 'There used to be 〜 で「以前は〜があった」。There is 〜. の be動詞の前に used to を置いた形になる。'],
    ],
    usage: [
      ['疑問文では use to に戻す', 'Did you ___ to live near the sea?', ['use', 'used', 'using', 'uses'], 'use', '以前は海の近くに住んでいましたか。', 'Did の疑問文では Did が過去を表すので、そのあとは use to に戻す。', [
        'Did のあとなので、過去を表す d を落として use to にする。',
        'used to のままにすると、Did と重ねて過去を二重に表すことになる。',
        'using to という形はない。疑問文では use to にする。',
        'uses は3人称単数のときの現在形で、Did の疑問文には合わない。',
      ]],
      ['used to のあとは動詞の原形', 'Ken used to ___ tennis every weekend.', ['play', 'plays', 'playing', 'played'], 'play', 'ケンは以前、毎週末にテニスをしていました。', 'used to のあとの動詞はいつも原形にして play とする。used が過去を表すので、後ろの動詞は過去形にしない。', [
        'used to のあとは動詞の原形なので play を置く。',
        'plays は3人称単数のときの現在形で、to のあとには置けない。',
        'playing は to のあとに置けない。used to＋原形の形で覚える。',
        'played と過去形にすると過去を二重に表すことになる。used が過去を表している。',
      ]],
      ['以前あった物は There used to be', 'There used ___ be a big tree here.', ['to', 'for', 'of', 'at'], 'to', '以前はここに大きな木がありました。', 'used to は2語で1つのまとまり。「以前は〜があった」は There used to be 〜 とする。', [
        'used to be で「以前は〜だった」。used のあとには必ず to を置く。',
        'used for 〜 は「〜のために使われる」という別の意味になる。',
        'used of 〜 という結び付きはない。',
        'used at 〜 という結び付きはなく、以前の状態を表せない。',
      ]],
    ],
  },
])
