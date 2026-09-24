// 単元別の並び替え・語法：英検3級（全16単元）。参考書の各ページで学ぶ形をそのまま問う。
import { unitFormats } from './build.js'

export const GRAMMAR_UNIT_FORMATS_3 = unitFormats('3', [
  {
    unit: 'gref_3_perfect',
    order: [
      ['経験を表す have been to', 'My sister has been to Canada twice.', '姉はカナダへ2回行ったことがあります。', 'have / has been to 〜 で「〜へ行ったことがある」という経験を表す。回数を表す twice は文の終わりに置く。'],
      ['完了を表す have just', 'The bus has just left the stop.', 'バスはちょうど停留所を出たところです。', '完了を表す just は have / has と過去分詞の間に置く。「ちょうど〜したところだ」となる。'],
    ],
    usage: [
      ['preposition', '期間の長さは for、始まりは since', 'I have known Ms. Sato ___ three years.', ['for', 'since', 'from', 'during'], 'for', '私は佐藤さんと3年間の知り合いです。', '現在完了で続いている長さを言うときは for＋期間、始まった時点を言うときは since＋時を使う。', [
        'for＋期間で「〜の間ずっと」。three years は長さなので for を使う。',
        'since は since 2010 のように始まりの時点を言うときに使う。長さには使わない。',
        'from は始まりの時点を表すが、現在完了で続いている期間を言うときは since を使う。',
        'during は during the summer のように、決まった期間の「中で」を表す。長さの数字には使わない。',
      ]],
      ['confusable', '経験をたずねる ever', 'Have you ___ visited that castle before?', ['ever', 'yet', 'already', 'still'], 'ever', 'あなたは以前にあの城を訪れたことがありますか。', '経験をたずねる疑問文では ever を過去分詞の前に置き、「今までに〜したことがありますか」とたずねる。', [
        'ever は「今までに」。経験をたずねる疑問文で過去分詞の前に置く。',
        'yet は「もう〜しましたか」と完了をたずねるときに使い、文の終わりに置く。',
        'already は「もう〜した」と完了を表す語で、ふつうの文で使う。',
        'still は「まだ〜している」と続いていることを表す語で、経験をたずねる文には使わない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_perfprog',
    order: [
      ['have been＋動詞ing で続く動作', 'I have been waiting for my friend for forty minutes.', '私は40分間ずっと友達を待っています。', '現在完了進行形は have / has been＋動詞ing。続いている長さは for＋期間で表す。'],
      ['3人称単数は has been', 'Ken has been playing the piano since noon.', 'ケンは正午からずっとピアノをひいています。', '主語が3人称単数のときは has been＋動詞ing にする。始まりの時点は since で表す。'],
      ['How long で期間をたずねる', 'How long has she been learning Spanish?', '彼女はどのくらいの間、スペイン語を学んでいますか。', '期間をたずねるときは How long を文の先頭に置き、そのあとを has＋主語＋been＋動詞ing の語順にする。主語が3人称単数なので has を使う。'],
    ],
    usage: [
      ['verbForm', 'know は現在完了進行形にしない', 'I have ___ her for years.', ['known', 'been knowing', 'knowing', 'know'], 'known', '私は彼女を何年も前から知っています。', 'know のように状態を表す動詞は進行形にしないので、続いていることも have known と現在完了で表す。', [
        'know は状態を表す動詞なので、have known で「ずっと知っている」を表す。',
        'know は状態を表す動詞なので、been knowing という進行形にはしない。',
        'have knowing という形はない。have のあとには過去分詞を置く。',
        'have know という形はない。have のあとは過去分詞 known にする。',
      ]],
      ['phrasal', '〜を待つは wait for', 'I have been ___ for the train for thirty minutes.', ['waiting', 'looking', 'seeing', 'hearing'], 'waiting', '私は30分間ずっと電車を待っています。', 'wait for 〜 で「〜を待つ」。目的語の前に for が必要になる。この文は進行形なので waiting の形にする。', [
        'wait for 〜 で「〜を待つ」。待つ相手の前には for を置く。',
        'look for 〜 は「〜を探す」で、待つ意味にならない。',
        'see for 〜 という結び付きはない。',
        'hear for 〜 という結び付きもない。',
      ]],
      ['verbNoun', 'ピアノの練習をするは practice the piano', 'She has been ___ the piano since noon.', ['practicing', 'making', 'doing', 'taking'], 'practicing', '彼女は正午からずっとピアノの練習をしています。', 'practice the piano で「ピアノの練習をする」という決まった結び付きになる。この文は進行形なので practicing の形にする。', [
        'practice the piano で「ピアノの練習をする」。くり返して身につけることを practice で表す。',
        'make the piano では「ピアノを作る」となり、練習する意味にならない。',
        'do the piano という結び付きはない。',
        'take the piano では「ピアノを持っていく」となり、練習する意味にならない。',
      ]],
    ],
    choice: [
      ['been のあとは動詞ing', 'He has been ___ for two hours.', ['studying', 'study', 'studied', 'studies'], 'studying', '彼は2時間ずっと勉強しています。', '現在完了進行形は have / has been のあとに動詞ing を置き、has been studying とする。', [
        'has been のあとは動詞ing。studying を置いて「ずっと勉強している」となる。',
        'been のあとに動詞の原形 study は置けない。ing 形にする。',
        'has been studied とすると「勉強されている」と受け身の意味になってしまう。',
        'studies は3人称単数のときの現在形で、been のあとには置けない。',
      ]],
      ['been を being にしない', 'How long has she ___ running?', ['been', 'being', 'be', 'was'], 'been', '彼女はどのくらいの間、走っているのですか。', 'has のあとは過去分詞なので been にする。being は be の ing 形で、この形には入らない。', [
        'has のあとは過去分詞 been。has been＋動詞ing で続いている動作を表す。',
        'being は be の ing 形で、has のすぐあとには置けない。',
        'be は原形で、has のあとには置けない。過去分詞 been にする。',
        'was は過去形で、has と重ねて使うことはできない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_passive',
    order: [
      ['受動態は be動詞＋過去分詞', 'These photos were taken in Okinawa.', 'これらの写真は沖縄で撮られました。', '受動態は be動詞＋過去分詞。主語が複数で過去のことなので were を使い、take の過去分詞 taken を続ける。'],
      ['助動詞つきは助動詞＋be＋過去分詞', 'The report must be sent before noon.', 'その報告書は正午までに送られなければなりません。', '助動詞のある受動態は〈助動詞＋be＋過去分詞〉にする。must のあとは原形 be を置き、send の過去分詞 sent を続ける。'],
    ],
    usage: [
      ['adjPrep', 'おおわれているは be covered with', 'The garden is covered ___ fallen leaves.', ['with', 'by', 'of', 'from'], 'with', 'その庭は落ち葉でおおわれています。', 'be covered with 〜 で「〜でおおわれている」。動作をした人を言う by とは使い分ける。', [
        'be covered with 〜 で「〜でおおわれている」。おおっている物には with を使う。',
        'by は「だれによって」を表す。落ち葉は行為者ではないので、この形には合わない。',
        'covered of 〜 という結び付きはない。',
        'covered from 〜 という結び付きはなく、おおわれている状態を表せない。',
      ]],
      ['adjPrep', '材料が変わるなら be made from', 'Cheese is made ___ milk.', ['from', 'of', 'with', 'by'], 'from', 'チーズは牛乳から作られます。', '見ても元が分からないほど変わる材料は be made from、形が残る材料は be made of を使う。', [
        'チーズは牛乳が姿を変えて作られるので、be made from を使う。',
        'be made of は木の机のように、元の材料が見て分かるときに使う。',
        'be made with 〜 は料理の中身を並べるときに使い、原料の変化を表す形ではない。',
        'by は「だれによって」を表す語で、材料を表すときには使わない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_patterns',
    order: [
      ['SVOO は〈人＋物〉の順', 'My aunt sent me a birthday card.', 'おばは私に誕生日カードを送ってくれました。', 'send＋人＋物の順に置くと「人に物を送る」となる。人の前に to は付けない。'],
      ['SVOC は〈目的語＋説明する語〉', 'Please keep the windows closed.', '窓を閉めたままにしておいてください。', 'keep＋目的語＋補語で「〜を…のままにする」。the windows＝closed の関係になるように、補語には様子を表す語を置く。'],
    ],
    usage: [
      ['confusable', '〜に見えるは look＋形容詞', 'You ___ happy today.', ['look', 'look at', 'see', 'watch'], 'look', 'あなたは今日うれしそうに見えます。', 'look＋形容詞で「〜に見える」。目を向ける動作を表す look at 〜 とは形も意味もちがう。', [
        'look＋形容詞で「〜に見える」。主語の様子を表す。',
        'look at 〜 は「〜に目を向ける」で、後ろには見る相手の名詞を置く。',
        'see は「目に入る・見える」で、後ろに形容詞を置いて様子を表す形にはならない。',
        'watch は動いている物をじっと見ることを表し、形容詞を続ける形にはならない。',
      ]],
      ['verbForm', 'buy は物を先に言うと for＋人', 'My mother bought a bag ___ me.', ['for', 'to', 'of', 'with'], 'for', '母は私にかばんを買ってくれました。', 'SVOO を〈物＋前置詞＋人〉に言いかえるとき、buy・make・cook などは for、give・show・tell などは to を使う。', [
        'buy は相手のために何かをする動詞なので、物を先に言うと for＋人 になる。',
        'to は give・show・tell のように、相手へ直接わたす動詞に使う。',
        'of は ask a favor of 〜 のような形で使い、buy には使わない。',
        'with は「〜を使って」「〜と一緒に」を表し、相手を表すことはできない。',
      ]],
      ['confusable', '〜に聞こえるは sound', 'That ___ interesting to me.', ['sounds', 'hears', 'listens', 'says'], 'sounds', 'それは私にはおもしろそうに聞こえます。', 'sound＋形容詞で「〜に聞こえる・〜のようだ」。人が耳で聞く hear・listen と使い分ける。主語が3人称単数なので sounds にする。', [
        'sound＋形容詞で「〜に聞こえる」。話を聞いた感想を言うときに使う。',
        'hear は人が主語になって「聞こえる」を表す語で、後ろに形容詞を置けない。',
        'listen は「耳をかたむける」で、to を伴い、後ろに形容詞を置けない。',
        'say は「言う」で、後ろに形容詞を置いて感想を表す形にならない。',
      ]],
    ],
    choice: [
      ['make＋O＋C の C は形容詞', 'Her smile made me ___.', ['happy', 'happily', 'happiness', 'to happy'], 'happy', '彼女のほほえみは私をうれしい気持ちにしました。', 'make＋目的語＋補語の補語には、目的語の様子を表す形容詞 happy を置く。副詞や名詞は置かない。', [
        'me＝happy の関係になるので、補語には形容詞 happy を置く。',
        'happily は「うれしそうに」と動作のしかたを表す副詞で、補語にはならない。',
        'happiness は「幸福」という名詞で、me＝happiness という関係にならない。',
        'to happy という形はない。to のあとには動詞の原形を置く。',
      ]],
    ],
  },
  {
    unit: 'gref_3_inf2',
    order: [
      ['It is 〜 for 人 to … の語順', 'It is not easy for me to understand English.', '私にとって英語を理解することは簡単ではありません。', '形式主語 It で文を始め、だれにとってかを for 人 で示し、本当の主語 to＋原形を後ろに置く。'],
      ['want＋人＋to＋原形', 'My parents want me to study abroad.', '両親は私に留学してほしいと思っています。', 'want＋人＋to＋動詞の原形で「人に〜してほしい」。人の後ろに to を置き、that の文にはしない。'],
      ['too 〜 to … は「〜すぎて…できない」', 'It was too cold to swim yesterday.', '昨日は寒すぎて泳げませんでした。', 'too＋形容詞＋to＋原形で「〜すぎて…できない」。not を使わずに打ち消しの意味を表す。'],
    ],
    usage: [
      ['confusable', '知らせを聞くは hear the news', 'We were glad to ___ the news.', ['hear', 'listen', 'sound', 'speak'], 'hear', '私たちはその知らせを聞いてうれしかったです。', 'hear the news で「知らせを聞く」。耳に入ることを hear で表す。', [
        'hear the news で「知らせを聞く」。自然に耳に入ることを hear で表す。',
        'listen は to を伴って「耳をかたむける」を表し、the news を直接置けない。',
        'sound は「〜に聞こえる」で、知らせを受け取る意味にならない。',
        'speak the news という結び付きはない。',
      ]],
      ['verbForm', 'ask＋人＋to＋原形', 'My mother ___ me to clean my room.', ['asked', 'said', 'spoke', 'talked'], 'asked', '母は私に部屋をそうじするように言いました。', 'ask＋人＋to＋動詞の原形で「人に〜するよう頼む」。say・speak・talk は〈人＋to＋原形〉を続けられない。過去の文なので asked にする。', [
        'ask＋人＋to＋原形で「人に〜するよう頼む」。人を直接後ろに置ける。',
        'say は人を直接後ろに置けない。say to me のように to が必要で、to＋原形も続かない。',
        'speak は speak to me の形で使い、〈人＋to＋原形〉を続けられない。',
        'talk も talk to me の形で使い、〈人＋to＋原形〉を続けられない。',
      ]],
    ],
    choice: [
      ['「〜しないように」は not to', 'The doctor told me ___ to eat too much.', ['not', 'don’t', 'no', 'never to'], 'not', '医者は私に食べすぎないように言いました。', 'tell＋人＋to＋原形 を打ち消すときは、to の直前に not を置いて not to＋原形 にする。', [
        'to の直前に not を置き、not to eat で「食べないように」となる。',
        'don’t は命令文や一般動詞の否定に使う語で、tell＋人のあとには置けない。',
        'no は名詞の前に置く語で、to＋原形を打ち消す働きはない。',
        'never to を重ねると to が2つになってしまう。ここでは not to だけにする。',
      ]],
      ['〜 enough to … の語順', 'He is old ___ to drive a car.', ['enough', 'too', 'very', 'so'], 'enough', '彼は車を運転できる年齢です。', 'enough は形容詞の後ろに置き、〈形容詞＋enough＋to＋原形〉で「…できるほど〜」となる。', [
        'enough は形容詞の後ろに置く。old enough to drive で「運転できる年齢だ」。',
        'too old to drive では「年を取りすぎて運転できない」と反対の意味になる。',
        'very は程度を強めるだけで、to＋原形と組にして「…できるほど」を表さない。',
        'so は so 〜 that … の形で使い、to＋原形とは直接組にならない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_bareinf',
    order: [
      ['make＋人＋原形', 'The teacher made us rewrite the report.', '先生は私たちにレポートを書き直させました。', 'make＋人＋動詞の原形で「人に〜させる」。原形の前に to は付けない。'],
      ['let＋人＋原形', 'My mother let me go out yesterday.', '母は昨日、私が外出するのを許してくれました。', 'let＋人＋動詞の原形で「人に〜させてあげる」。let のあとも to を付けない。'],
      ['help＋人＋原形', 'I helped my father wash the car.', '私は父が車を洗うのを手伝いました。', 'help＋人＋動詞の原形で「人が〜するのを手伝う」。help のあとは to を付けても付けなくてもよいが、原形を置くのがふつう。'],
    ],
    usage: [
      ['verbForm', 'let のあとに to は付けない', 'Will you let me ___ this camera?', ['try', 'to try', 'trying', 'tried'], 'try', '私にこのカメラを試させてくれませんか。', 'let＋人＋動詞の原形の形なので、原形 try の前に to を置かない。', [
        'let のあとは〈人＋動詞の原形〉。to を付けずに try を置く。',
        'let me to try という形にはしない。let のあとに to は付けない。',
        'let me trying という形はない。動詞は原形にする。',
        'let me tried という形はない。過去分詞は置かない。',
      ]],
      ['verbForm', '物が主語の make＋O＋原形', 'This story makes me ___ sad.', ['feel', 'to feel', 'feeling', 'felt'], 'feel', 'この物語は私を悲しい気持ちにさせます。', '物が主語でも make＋目的語＋動詞の原形の形は変わらない。feel sad で「悲しい気持ちになる」。', [
        'make のあとは〈目的語＋動詞の原形〉。to を付けずに feel を置く。',
        'make me to feel という形にはしない。make のあとに to は付けない。',
        'make me feeling という形はない。動詞は原形にする。',
        'make me felt では「感じられる」と受け身の意味になってしまう。',
      ]],
      ['verbForm', '手伝うは help＋人＋原形', 'She helped her brother ___ his homework.', ['finish', 'finished', 'finishes', 'to finishing'], 'finish', '彼女は弟が宿題を終えるのを手伝いました。', 'help＋人＋動詞の原形で「人が〜するのを手伝う」。人のあとは原形 finish にする。', [
        'help のあとは〈人＋動詞の原形〉。finish を原形のまま置く。',
        'finished は過去形・過去分詞で、help＋人のあとには置けない。',
        'finishes は3人称単数のときの現在形で、help＋人のあとには置けない。',
        'to finishing という形はない。to のあとは動詞の原形にする。',
      ]],
    ],
  },
  {
    unit: 'gref_3_verbforms',
    order: [
      ['decide のあとは to＋原形', 'He decided to join the soccer team.', '彼はサッカー部に入ることに決めました。', 'decide のあとに「〜すること」を置くときは to＋動詞の原形。動名詞は続けられない。'],
      ['mind のあとは動名詞', 'Would you mind opening the window?', '窓を開けていただけませんか。', 'mind のあとに動作を置くときは動詞ing にする。Would you mind 〜ing? はていねいに頼む言い方。'],
      ['look forward to のあとは動名詞', 'We look forward to hearing from you soon.', 'まもなくご連絡をいただけるのを楽しみにしています。', 'look forward to の to は前置詞なので、後ろは動詞ing にする。原形は置けない。'],
    ],
    usage: [
      ['verbForm', 'keep のあとは動名詞', 'He kept ___ for an hour.', ['talking', 'to talk', 'talk', 'talked'], 'talking', '彼は1時間話し続けました。', 'keep のあとに動作を置くときは動詞ing にする。keep talking で「話し続ける」となる。', [
        'keep＋動詞ing で「〜し続ける」。talking を置く。',
        'keep to talk という形にはしない。keep のあとは動名詞にする。',
        'kept talk と原形を続けることはできない。',
        'kept talked では受け身のような形になり、「話し続けた」を表せない。',
      ]],
      ['verbForm', 'promise のあとは to＋原形', 'She promised ___ her room every day.', ['to clean', 'cleaning', 'clean', 'to cleaning'], 'to clean', '彼女は毎日部屋をそうじすると約束しました。', 'promise のあとに「〜すること」を置くときは to＋動詞の原形にして to clean とする。', [
        'promise のあとは to＋動詞の原形。to clean で「そうじすると（約束する）」となる。',
        'promise cleaning という形にはしない。promise のあとは to 不定詞にする。',
        'promised clean と原形を続けることはできない。',
        'to のあとは動詞の原形なので、to cleaning という形にはしない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_indirect',
    order: [
      ['中の語順は〈疑問詞＋主語＋動詞〉', 'Do you know where your brother works?', 'あなたはお兄さんがどこで働いているか知っていますか。', '文の中に入れた疑問は〈疑問詞＋主語＋動詞〉の語順にする。does は使わず、動詞に s を付けて表す。'],
      ['文の動詞が過去なら中も過去に', 'I asked Emi where she lived.', '私はエミにどこに住んでいるのかたずねました。', '文の動詞 asked が過去なので、中の動詞も過去形 lived にする。語順は〈疑問詞＋主語＋動詞〉のまま。'],
      ['疑問詞が主語のときはそのまま', 'I know who broke the window.', '私はだれが花びんを割ったか知っています。', '疑問詞が中の文の主語になっているときは、〈疑問詞＋動詞〉の順のままにする。主語を後ろに補わない。'],
    ],
    usage: [
      ['confusable', '「〜かどうか」は if で表す', 'I don’t know ___ he will come today.', ['if', 'that', 'what', 'who'], 'if', '私は彼が今日来るかどうか分かりません。', '「〜かどうか」を文の中に入れるときは if（または whether）でつなぐ。', [
        'if＋〈主語＋動詞〉で「〜かどうか」を表す。whether に置きかえられる。',
        'that は「〜ということ」を表し、「かどうか」という不確かさは表せない。',
        'what は「何を」を表す語で、後ろに足りない部分のある文を続ける。ここでは文がそろっている。',
        'who は「だれが」を表す語で、来るかどうかという内容にはならない。',
      ]],
      ['verbNoun', '窓を割るは break the window', 'I know who ___ the vase.', ['broke', 'cut', 'fell', 'wrote'], 'broke', '私はだれが窓を割ったか知っています。', 'break the vase で「花びんを割る」という決まった結び付きになる。過去の文なので broke にする。', [
        'break the vase で「花びんを割る」。こわすことを break で表す。',
        'cut the vase では「花びんを切る」となり、割る意味にならない。',
        'fall は「落ちる」で、後ろに目的語を置けない。',
        'write the vase では意味が通らない。',
      ]],
      ['confusable', '電車が出発するは leave', 'Do you know when the bus ___?', ['leaves', 'goes out', 'takes off', 'puts on'], 'leaves', 'あなたはそのバスがいつ出発するか知っていますか。', '電車やバスが出発することは leave で表す。飛行機が離陸する take off と使い分ける。主語が3人称単数なので leaves にする。', [
        'leave は乗り物が「出発する」を表す。The bus leaves at nine. のように使う。',
        'go out は人が「出かける」を表し、バスの出発には使わない。',
        'take off は飛行機が「離陸する」を表し、バスには使わない。',
        'put on は「身に着ける」を表し、出発する意味にならない。',
      ]],
    ],
    choice: [
      ['間接疑問では does を使わない', 'Do you know when the movie ___?', ['starts', 'does start', 'do start', 'starting'], 'starts', 'あなたはその映画がいつ始まるか知っていますか。', '文の中に入れた疑問では do・does を使わず、動詞の形で主語と時を表す。3人称単数なので starts にする。', [
        '中の主語 the movie は3人称単数なので、動詞に s を付けて starts にする。',
        'does start は疑問文の形で、文の中に入れた疑問では使わない。',
        'do start も疑問文の形で、中の文では使わない。主語も3人称単数なので合わない。',
        'starting だけでは中の文の動詞にならない。',
      ]],
      ['語順は疑問文に戻さない', 'Nobody knows who ___.', ['he is', 'is he', 'does he', 'he does'], 'he is', 'だれも彼がだれなのか知りません。', '文の中に入れた疑問は〈疑問詞＋主語＋動詞〉の語順にして he is とする。疑問文のように動詞を前に出さない。', [
        '疑問詞 who のあとを〈主語＋動詞〉にして he is とする。',
        'is he は疑問文の語順で、文の中に入れた疑問では使わない。',
        'does he は疑問文の形で、who の後ろには置けない。',
        'he does では「彼がする」となり、だれなのかを表す文にならない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_relative',
    order: [
      ['主格の who は直後に動詞', 'The man who lives next door is a doctor.', 'となりに住んでいる男性は医者です。', '先行詞が人で、つなぐ文の主語になるので who を使う。who のすぐ後ろに動詞 lives を置く。'],
      ['目的格は〈関係代名詞＋主語＋動詞〉', 'The song that he wrote became famous.', '彼が書いた歌は有名になりました。', 'that がつなぐ文の目的語になるので、後ろは〈主語＋動詞〉の順にする。wrote の後ろに目的語は置かない。'],
    ],
    usage: [
      ['verbNoun', 'ケーキを作るは make a cake', 'The soup that she ___ was delicious.', ['made', 'did', 'took', 'wrote'], 'made', '彼女が作ったスープはおいしかったです。', 'make soup で「スープを作る」という決まった結び付きになる。過去の文なので made にする。', [
        'make soup で「スープを作る」。料理を作ることは make で表す。',
        'do soup という結び付きはない。',
        'take soup では「スープを取る」となり、作る意味にならない。',
        'write soup では意味が通らない。',
      ]],
      ['verbNoun', '電車に乗って行くは take a train', 'I ___ a bus which goes to the airport.', ['took', 'made', 'did', 'put'], 'took', '私は空港へ行くバスに乗りました。', 'take a train で「電車に乗って行く」。交通手段を利用することは take で表す。過去の文なので took にする。', [
        'take a bus で「バスに乗って行く」。バスや電車を利用するときは take を使う。',
        'make a bus では「バスを作る」となり、乗る意味にならない。',
        'do a bus という結び付きはない。',
        'put a bus では「バスを置く」となり、乗る意味にならない。',
      ]],
      ['confusable', '住んでいるは live', 'I have a cousin who ___ in Canada.', ['lives', 'sits', 'holds', 'wears'], 'lives', '私にはカナダに住んでいるいとこがいます。', 'ある場所に住んでいることは live in 〜 で表す。一時的にとどまる stay と使い分ける。主語が3人称単数なので lives にする。', [
        'live in 〜 で「〜に住んでいる」。暮らしている場所を表す。',
        'sit in 〜 は「〜にすわっている」で、住んでいる意味にならない。',
        'hold in 〜 という結び付きはなく、住む意味にならない。',
        'wear in 〜 という結び付きもない。',
      ]],
    ],
    choice: [
      ['先行詞が人なら who', 'I have an uncle ___ works at a zoo.', ['who', 'which', 'whose', 'what'], 'who', '私には動物園で働いているおじがいます。', '説明される名詞が人で、つなぐ文の主語になるときは who を使う。物のときは which を使う。', [
        '先行詞 an uncle は人で、後ろの文の主語になるので who を使う。',
        'which は物を説明するときに使う。人を先行詞にすることはできない。',
        'whose は「〜の」と持ち主を表し、後ろに名詞を続ける。ここでは動詞が続くので合わない。',
        'what は先行詞を含む語で、前に a friend のような名詞を置くことはできない。',
      ]],
      ['持ち主を表すのは whose', 'I met a boy ___ father is a pilot.', ['whose', 'who', 'which', 'that'], 'whose', '私は父親がパイロットである男の子に会いました。', 'whose＋名詞で「その〜が…である」と持ち主を表す。後ろに名詞が続く点でほかの関係代名詞とちがう。', [
        'whose＋名詞で持ち主を表す。whose father で「その男の子の父親」となる。',
        'who のあとには動詞が続く。名詞 father が続くこの文には合わない。',
        'which のあとには動詞か〈主語＋動詞〉が続く。名詞だけを続けることはできない。',
        'that のあとにも名詞だけを続けることはできない。持ち主は whose で表す。',
      ]],
      ['目的格のあとに目的語を残さない', 'That is the cap which I found ___.', ['yesterday', 'it yesterday', 'it', 'them'], 'yesterday', 'あれは私が昨日見つけた帽子です。', '目的格の関係代名詞は、つなぐ文の目的語のかわりをしている。後ろには時を表す yesterday だけを置き、it を重ねない。', [
        'which が find の目的語のかわりなので、後ろには時を表す yesterday だけを置く。',
        'which がすでに目的語なので、it を重ねて置くことはできない。',
        'it を置くと目的語が2つになり、文の形がくずれる。',
        'them を置いても目的語が重なるうえ、the cap は1つなので数も合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_participle',
    order: [
      ['2語以上の分詞は名詞の後ろ', 'The boy sitting by the window is Ken.', '窓のそばにすわっている男の子はケンです。', '分詞が2語以上のまとまりになるときは、説明される名詞の後ろに置く。ここでは sitting by the window が The boy を説明する。'],
      ['過去分詞は「〜された」', 'I bought a watch made in Switzerland.', '私はスイス製の腕時計を買いました。', '腕時計は「作られる」側なので過去分詞 made を使う。2語以上なので a watch の後ろに置く。'],
      ['1語の分詞は名詞の前', 'I ate a boiled egg for breakfast.', '私は朝食にゆで卵を食べました。', '分詞が1語のときは説明される名詞の前に置く。卵は「ゆでられた」側なので過去分詞 boiled にする。'],
    ],
    usage: [
      ['confusable', '人の気持ちは過去分詞', 'We were ___ at the sudden news.', ['surprised', 'surprising', 'surprise', 'to surprise'], 'surprised', '私たちはその突然の知らせに驚きました。', '人が驚かされる側なので過去分詞 surprised を使う。物事の性質を表すときは surprising になる。', [
        '人は驚かされる側なので、過去分詞 surprised を使って「驚いた」を表す。',
        'surprising は「（物事が）驚かせるような」で、主語が We のこの文には合わない。',
        'surprise は「驚かせる」という動詞で、be動詞のあとにそのまま置くことはできない。',
        'to surprise は「驚かせるために」となり、気持ちを表す形にならない。',
      ]],
      ['confusable', '物事の性質は現在分詞', 'That movie was very ___.', ['exciting', 'excited', 'excite', 'to excite'], 'exciting', 'その映画はとてもわくわくするものでした。', '映画は人をわくわくさせる側なので現在分詞 exciting を使う。人の気持ちは excited になる。', [
        '映画は人をわくわくさせる側なので、現在分詞 exciting を使う。',
        'excited は「（人が）わくわくしている」で、主語が movie のこの文には合わない。',
        'excite は「わくわくさせる」という動詞で、very のあとに置くことはできない。',
        'to excite は「わくわくさせるために」となり、映画の様子を表す形にならない。',
      ]],
      ['confusable', '退屈しているは bored', 'The students were ___ during the long speech.', ['bored', 'boring', 'bore', 'to bore'], 'bored', 'その長い演説の間、生徒たちは退屈していました。', '人が退屈しているときは過去分詞 bored、物事が退屈させるときは現在分詞 boring を使う。', [
        '生徒は退屈させられる側なので、過去分詞 bored を使う。',
        'boring は「（物事が）退屈させるような」で、主語が人のこの文には合わない。',
        'bore は「退屈させる」という動詞で、be動詞のあとにそのまま置けない。',
        'to bore は「退屈させるために」となり、気持ちを表す形にならない。',
      ]],
    ],
    choice: [
      ['「〜している」は現在分詞', 'The girl ___ the piano is my cousin.', ['playing', 'played', 'plays', 'to play'], 'playing', 'ピアノをひいている女の子は私のいとこです。', '生徒は自分でテニスをしている側なので現在分詞 playing を使い、2語以上なので名詞の後ろに置く。', [
        '女の子がピアノをひいている側なので、現在分詞 playing で後ろから説明する。',
        'played では「ひかれた」と受け身の関係になり、女の子の動作を表せない。',
        'plays を置くと文の動詞が2つになり、主語を説明するまとまりにならない。',
        'to play は「これからする」という意味になり、今している様子を表さない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_comparison',
    order: [
      ['倍数＋as＋原級＋as', 'This hall is three times as large as ours.', 'このホールは私たちのホールの3倍の広さです。', '〈倍数＋as＋原級＋as〉で「…の〜倍」となる。as と as の間の形容詞は比較級にせず原級のまま置く。'],
      ['できるだけ〜は as 〜 as possible', 'Please answer as quickly as possible.', 'できるだけ早く返事をしてください。', 'as＋原級＋as possible で「できるだけ〜」。possible のかわりに〈主語＋can〉を置くこともできる。'],
      ['one of the＋最上級＋複数名詞', 'Kyoto is one of the oldest cities in Japan.', '京都は日本で最も古い都市の1つです。', 'one of the＋最上級＋複数名詞で「最も〜な…の1つ」。「1つ」でも後ろの名詞は複数形にする。'],
    ],
    usage: [
      ['setPhrase', '比較級を強めるのは much', 'This book is ___ easier than that one.', ['much', 'very', 'so', 'too'], 'much', 'この本はあの本よりずっとやさしいです。', '比較級を「ずっと」と強めるときは much を使う。very は原級を強める語で、比較級には付けない。', [
        'much は比較級を強めて「ずっと〜」を表す。much easier となる。',
        'very は原級を強める語で、比較級 easier の前には置けない。',
        'so は「とても」と原級を強める語で、比較級の前には置かない。',
        'too は「〜すぎる」で、than と組にして比べる文には合わない。',
      ]],
      ['setPhrase', 'できるだけ早くは as soon as possible', 'Please come back as soon as ___.', ['possible', 'possibly', 'able', 'can'], 'possible', 'できるだけ早く戻ってきてください。', 'as soon as possible で「できるだけ早く」という決まった言い方になる。', [
        'as soon as possible で「できるだけ早く」。まとまりで覚える。',
        'possibly は副詞で、as 〜 as の間にも後ろにも置かない。',
        'able は be able to の形で使う語で、この決まった言い方には入らない。',
        'can を使うなら as soon as you can とし、主語も必要になる。',
      ]],
      ['verbNoun', '時間がかかるは take time', 'This work will ___ much more time than that one.', ['take', 'make', 'do', 'put'], 'take', 'この仕事はあの仕事よりずっと多くの時間がかかります。', 'take time で「時間がかかる」という決まった結び付きになる。', [
        'take time で「時間がかかる」。必要な時間を take で表す。',
        'make time は「時間をつくる」で、かかる意味にならない。',
        'do time という結び付きはこの意味では使わない。',
        'put time という結び付きはない。',
      ]],
    ],
    choice: [
      ['as 〜 as＋主語＋can', 'I ran as fast as I ___.', ['could', 'can', 'will', 'do'], 'could', '私はできるだけ速く走りました。', 'as＋原級＋as＋主語＋can で「できるだけ〜」。文の動詞が過去形 ran なので、can も過去形 could にする。', [
        '文の動詞が過去形 ran なので、そろえて過去形 could にする。',
        'can は現在の形で、過去のことを述べるこの文とは時が合わない。',
        'will はこれから先のことを表す語で、過去の文には合わない。',
        'do は一般動詞の疑問文・否定文を作る語で、この形には入らない。',
      ]],
      ['one of the＋最上級のあとは複数形', 'Osaka is one of the busiest ___ in Japan.', ['cities', 'city', 'a city', 'the city'], 'cities', '大阪は日本で最もにぎやかな都市の1つです。', 'one of 〜 は「〜のうちの1つ」なので、後ろの名詞を複数形 cities にする。', [
        'one of the busiest cities で「最もにぎやかな都市のうちの1つ」。後ろは複数形にする。',
        'city と単数にすると「1つのうちの1つ」となり、意味が通らない。',
        'a city は1つを指す形で、one of 〜 の後ろには置けない。',
        'the city も1つを指す形なので、one of 〜 の後ろには合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_conj',
    order: [
      ['because は理由、so は結果', 'I stayed home because it was raining hard.', '激しく雨が降っていたので、私は家にいました。', 'because のあとには理由を置く。結果を後ろに置く so とは、前後に来る内容が逆になる。'],
      ['as soon as の中は現在形', 'Let’s start as soon as he comes.', '彼が来たらすぐに始めましょう。', 'as soon as のまとまりの中は、これから先のことでも will を使わず現在形にする。'],
    ],
    usage: [
      ['adjPrep', '気持ちのあとは that＋文', 'I’m ___ that many people will use robots.', ['sure', 'surely', 'sureness', 'surer'], 'sure', '多くの人がロボットを使うようになると私は確信しています。', 'be sure that 〜 で「〜だと確信している」。that のあとには〈主語＋動詞〉の文を置く。', [
        'be sure that 〜 で「〜だと確信している」。sure は be動詞のあとに置く形容詞。',
        'surely は「確かに」と文全体をやわらげる副詞で、be動詞のあとに置いて that 節を続ける形にはならない。',
        'sureness は名詞で、I’m sureness that 〜 という言い方はしない。',
        'surer は比較級で、比べる相手のないこの文には合わない。',
      ]],
      ['phrasal', '家に着くは get home', 'I will call you when I ___ home tonight.', ['get', 'take', 'make', 'put'], 'get', '今夜家に着いたら電話します。', 'get home で「家に着く」。home は副詞なので前に to を置かない。', [
        'get home で「家に着く」。到着することを get で表す。',
        'take home は「家へ持ち帰る」で、着く意味にならない。',
        'make home という結び付きはない。',
        'put home という結び付きもない。',
      ]],
      ['setPhrase', '〜するとすぐには as soon as', 'Let’s begin ___ soon as she arrives.', ['as', 'so', 'too', 'very'], 'as', '彼女が着いたらすぐに始めましょう。', 'as soon as＋〈主語＋動詞〉で「〜するとすぐに」という決まった言い方になる。', [
        'as soon as 〜 で「〜するとすぐに」。前後を as ではさむ。',
        'so soon as という言い方はふつう使わない。',
        'too soon as という言い方はない。',
        'very soon as という言い方もない。',
      ]],
    ],
    choice: [
      ['although のあとに but は置かない', 'Although it was snowing, the game ___.', ['continued', 'but continued', 'so continued', 'and continued'], 'continued', '雪が降っていたけれど、試合は続けられました。', 'although のまとまりで「〜だけれども」を表しているので、後ろの文は continued だけにして but を重ねない。', [
        'Although のまとまりが「〜だけれども」を表すので、後ろは continued だけでよい。',
        'but を重ねると、逆のことを表す語が2つになってしまう。',
        'so は「だから」と結果をつなぐ語で、although と組にはならない。',
        'and は内容を並べる語で、主語のすぐ後ろに置くことはできない。',
      ]],
      ['when の中は未来でも現在形', 'I will text you when I ___ home.', ['get', 'will get', 'got', 'getting'], 'get', '家に着いたらメッセージを送ります。', 'when のまとまりの中は、これから先のことでも will を使わず現在形 get で表す。', [
        'when のまとまりの中は現在形。get を置いて「着いたら」を表す。',
        'when のまとまりの中では will を使わない。未来のことも現在形にする。',
        'got は過去形で、これから家に着く場面には合わない。',
        'getting だけではまとまりの動詞にならない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_sothat',
    order: [
      ['so＋形容詞＋that＋文', 'The soup was so hot that I burned my tongue.', 'そのスープはとても熱かったので、私は舌をやけどしました。', 'so のあとに程度を表す形容詞、that のあとにその結果の文を置く。very ではなく so を使う。'],
      ['so＋副詞＋that＋文', 'He ran so fast that we could not catch him.', '彼はとても速く走ったので、私たちは追いつけませんでした。', 'so のあとには副詞も置ける。走る速さの程度を so fast で表し、その結果を that 以下に続ける。'],
      ['so 〜 that＋can’t の形', 'He was so tired that he could hardly walk.', '彼はとても疲れていたので、ほとんど歩けませんでした。', 'so 〜 that＋主語＋could not / hardly の形で「とても〜なので…できない」を表す。'],
    ],
    usage: [
      ['phrasal', '眠り込むは fall asleep', 'He was so tired that he ___ asleep on the sofa.', ['fell', 'felt', 'took', 'wrote'], 'fell', '彼はとても疲れていたので、ソファで眠ってしまいました。', 'fall asleep で「眠り込む」という決まった結び付きになる。過去の文なので fell にする。', [
        'fall asleep で「眠り込む」。眠りに落ちることを fall で表す。',
        'felt asleep という結び付きはない。feel は「感じる」。',
        'took asleep という結び付きはない。',
        'wrote asleep という結び付きもない。',
      ]],
      ['verbNoun', '持ち上げるは lift', 'The bag was so heavy that I could not ___ it.', ['lift', 'wear', 'wash', 'write'], 'lift', 'そのかばんはとても重かったので、私は持ち上げられませんでした。', 'lift は物を持ち上げることを表す。重さを問題にするときに使う。', [
        'lift は「持ち上げる」。重い物を上へ動かすことを表す。',
        'wear は身に着けることを表し、かばんを持ち上げる意味にならない。',
        'wash は「洗う」で、持ち上げる意味にならない。かばんには使わない。',
        'write は「書く」で、持ち上げる意味にならない。',
      ]],
      ['confusable', 'ほとんど〜ないは hardly', 'He spoke so quietly that I could ___ hear him.', ['hardly', 'hard', 'almost', 'nearly'], 'hardly', '彼はとても静かに話したので、私はほとんど聞き取れませんでした。', 'hardly は「ほとんど〜ない」と打ち消す副詞。「熱心に」を表す hard と形も意味もちがう。', [
        'hardly は「ほとんど〜ない」。could hardly hear で「ほとんど聞き取れなかった」となる。',
        'hard は「熱心に・激しく」で、打ち消す意味を持たない。',
        'almost は「ほとんど」だが、almost hear のように動詞を直接打ち消す使い方はしない。',
        'nearly も「ほとんど」だが、聞こえなかったことを表す言い方にはならない。',
      ]],
    ],
    choice: [
      ['程度を表すのは so', 'She was ___ tired that she fell asleep.', ['so', 'very', 'too', 'much'], 'so', '彼女はとても疲れていたので、眠ってしまいました。', 'that の文と組にして「とても〜なので…」を表すときは so を使う。very は that の文と組にならない。', [
        'so＋形容詞＋that＋文 で「とても〜なので…」を表す。',
        'very は形容詞を強めるだけで、後ろに that の文を続ける働きはない。',
        'too は too 〜 to … の形で使い、that の文とは組にならない。',
        'much は比較級を強める語で、原級 tired の前には置かない。',
      ]],
      ['too 〜 to … への言いかえ', 'This bag is too heavy ___ carry.', ['to', 'that', 'for', 'so'], 'to', 'このかばんは重すぎて運べません。', 'too＋形容詞＋to＋動詞の原形で「〜すぎて…できない」。so 〜 that … can’t の言いかえになる。', [
        'too のあとは to＋動詞の原形。too heavy to carry で「重すぎて運べない」となる。',
        'that を使うなら so heavy that I can’t carry it のように、so と組にする。',
        'for のあとには名詞を置く。動詞の原形 carry を続けることはできない。',
        'so は that の文と組にする語で、too とは組にならない。',
      ]],
      ['結果の文は that のあとに置く', 'The movie was so sad ___ everyone cried.', ['that', 'to', 'as', 'than'], 'that', 'その映画はとても悲しかったので、みんな泣きました。', 'so＋形容詞のあとに結果の文を続けるときは that でつなぐ。that のあとは〈主語＋動詞〉になる。', [
        'so＋形容詞＋that＋〈主語＋動詞〉で、程度とその結果を表す。',
        'to のあとは動詞の原形で、〈主語＋動詞〉の文を続けることはできない。',
        'as は「〜のように」「〜なので」を表すが、so と組にして結果を表す形にはならない。',
        'than は比較級と組にする語で、so 〜 の後ろには置かない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_prep',
    order: [
      ['by は締め切り、until は継続', 'You must return these books by Friday.', 'あなたは金曜日までにこれらの本を返さなければなりません。', 'by は「〜までに」と締め切りを表す。その時までずっと続くことを表す until とは意味がちがう。'],
      ['during のあとは名詞', 'Nobody spoke during the long movie.', 'その長い映画の間、だれも話しませんでした。', 'during は前置詞なので後ろに名詞を置く。〈主語＋動詞〉を続けるときは接続詞 while を使う。'],
      ['because of のあとは名詞', 'The game was stopped because of the heavy rain.', '大雨のため、その試合は中止になりました。', 'because of は2語で1つの前置詞のように働き、後ろに名詞を置く。文を続けるときは because を使う。'],
    ],
    usage: [
      ['confusable', 'while のあとは〈主語＋動詞〉', 'Nobody spoke ___ the movie was playing.', ['while', 'during', 'for', 'in'], 'while', '映画が上映されている間、だれも話しませんでした。', 'while は接続詞なので後ろに〈主語＋動詞〉を置く。名詞だけを続けるときは during を使う。', [
        'while のあとには the movie was playing という〈主語＋動詞〉のまとまりを続ける。',
        'during は前置詞なので、〈主語＋動詞〉のまとまりを続けることはできない。',
        'for は期間の長さを表す前置詞で、〈主語＋動詞〉を続けることはできない。',
        'in は場所や期間を表す前置詞で、〈主語＋動詞〉を続けることはできない。',
      ]],
      ['verbForm', 'prevent＋人＋from＋動名詞', 'The snow prevented them ___ going out.', ['from', 'to', 'of', 'for'], 'from', '雪のせいで彼らは外出できませんでした。', 'prevent＋人＋from＋動詞ing で「人が〜するのをさまたげる」という決まった形になる。', [
        'prevent＋人＋from＋動詞ing で「人が〜するのをさまたげる」。',
        'prevent them to go という形にはしない。さまたげる相手のあとは from を使う。',
        'prevent them of 〜 という結び付きはない。',
        'prevent them for 〜 という結び付きはなく、さまたげる意味を表せない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_tag',
    order: [
      ['現在完了の文には haven’t you', 'You have seen this movie, haven’t you?', 'あなたは以前この番組を見たことがありますよね。', '付加疑問は文の動詞と同じ種類の語を使う。現在完了の have の文なので haven’t you? を付ける。'],
      ['否定文には肯定の形', 'She is not busy today, is she?', '彼女は今日忙しくないですよね。', '否定文の後ろには肯定の形を付ける。be動詞 is の否定文なので is she? を続ける。'],
      ['There is の文には there をくり返す', 'There are many shops here, aren’t there?', 'ここにはお店がたくさんありますよね。', 'There の文の付加疑問では、主語のかわりに there をそのまま使って aren’t there? とする。'],
    ],
    usage: [
      ['verbNoun', '休憩するは take a break', 'Let’s ___ a short break, shall we?', ['take', 'make', 'do', 'put'], 'take', '少し休憩しましょうよ。', 'take a break で「休憩する」という決まった結び付きになる。', [
        'take a break で「休憩する」。短く休むことを take で表す。',
        'make a break という結び付きはこの意味では使わない。',
        'do a break という結び付きはない。',
        'put a break という結び付きもない。',
      ]],
      ['confusable', '映画を見たは have seen', 'You have ___ this show before, haven’t you?', ['seen', 'listened', 'spoken', 'said'], 'seen', 'あなたはこの映画を見たことがありますよね。', '番組や試合を見ることは see で表す。see a show の形で覚える。完了形・受け身の形なので過去分詞 seen にする。', [
        'see a show で「番組を見る」。作品を見ることは see で表す。',
        'listen は「耳をかたむける」で、番組を見る意味にならない。',
        'speak は「話す」で、見る意味にならない。',
        'say は「言う」で、見る意味にならない。',
      ]],
      ['setPhrase', '買い物に行くは go shopping', 'You went ___ yesterday, didn’t you?', ['shopping', 'shop', 'to shop', 'for shopping'], 'shopping', 'あなたは昨日、買い物に行きましたよね。', 'go shopping で「買い物に行く」。go＋動詞ing でその活動をしに行くことを表す。', [
        'go shopping で「買い物に行く」。go＋動詞ing の決まった言い方。',
        'go shop という形にはしない。',
        'go to shop という言い方はふつう使わない。',
        'go for shopping という言い方もふつう使わない。',
      ]],
    ],
    choice: [
      ['I am の文には aren’t I', 'I’m right, ___ I?', ['aren’t', 'am not', 'isn’t', 'don’t'], 'aren’t', '私は正しいですよね。', 'I am 〜. の付加疑問は、am not I? ではなく aren’t I? という決まった形を使う。', [
        'I am 〜. の付加疑問は aren’t I? と決まっている。',
        'am not I? という語順はふつう使わない。aren’t I? にする。',
        'isn’t は主語が he・she・it のときの形で、主語 I には合わない。',
        'don’t は一般動詞の文に付ける形で、be動詞 am の文には合わない。',
      ]],
      ['助動詞の文には同じ助動詞', 'Ken can swim fast, ___ he?', ['can’t', 'doesn’t', 'isn’t', 'won’t'], 'can’t', 'ケンは速く泳げますよね。', '付加疑問には文と同じ助動詞を使う。can の文なので can’t he? を付ける。', [
        '文の助動詞が can なので、否定の短縮形 can’t を使う。',
        'doesn’t は一般動詞の文に付ける形で、助動詞 can の文には合わない。',
        'isn’t は be動詞の文に付ける形で、can の文には合わない。',
        'won’t は will の否定で、can の文には合わない。',
      ]],
      ['否定の命令文には will you', 'Don’t be late, ___ you?', ['will', 'do', 'are', 'shall'], 'will', '遅れないでくださいね。', '命令文は否定でも、後ろに付ける短い疑問は will you? にする。', [
        '命令文には、否定の命令文でも will you? を付ける。',
        'do you? は一般動詞のふつうの文に付ける形で、命令文には付けない。',
        'are you? は be動詞のふつうの文に付ける形で、命令文には付けない。',
        'shall we? は Let’s 〜. の文に付ける形で、命令文には付けない。',
      ]],
    ],
  },
  {
    unit: 'gref_3_subjunctive',
    order: [
      ['If＋過去形, would＋原形', 'If I had a car, I would drive there.', 'もし車を持っていたら、そこへ運転して行くのに。', '今の事実とちがう想像は、If のまとまりを過去形にし、後ろの文を would＋動詞の原形にする。'],
      ['仮定法の be動詞は were', 'If I were you, I would apologize now.', 'もし私があなたなら、今あやまるのに。', '仮定法の If の中では、主語が I でも be動詞は were を使う。後ろの文は would＋原形にする。'],
      ['I wish＋過去形', 'I wish I had more free time.', 'もっと自由な時間があればいいのに。', 'I wish のあとを過去形にすると「（今）〜ならいいのに」となる。今は持っていないことを had で表す。'],
    ],
    usage: [
      ['confusable', '電話をかけるは call', 'If I knew his number, I would ___ him.', ['call', 'speak', 'talk', 'say'], 'call', 'もし彼の番号を知っていたら、電話するのに。', 'call＋人 で「人に電話をかける」。speak・talk は to を伴い、say は人を直接置けない。', [
        'call him で「彼に電話をかける」。人を直接後ろに置ける。',
        'speak は speak to him の形で使い、人を直接置けない。',
        'talk も talk to him の形で使う。',
        'say は言う内容を目的語にする語で、人を直接置けない。',
      ]],
      ['verbNoun', '世界中を旅するは travel around the world', 'If I were rich, I would ___ across the country.', ['travel', 'wear', 'wash', 'write'], 'travel', 'もしお金持ちなら、その国を旅して回るのに。', 'travel across 〜 で「〜を旅して回る」という決まった結び付きになる。', [
        'travel across 〜 で「〜を旅して回る」。旅することは travel で表す。',
        'wear across 〜 という結び付きはない。',
        'wash across 〜 という結び付きもない。',
        'write across 〜 という結び付きもない。',
      ]],
      ['phrasal', '夢がかなうは come true', 'I wish my dream would ___ true.', ['come', 'go', 'take', 'put'], 'come', '私の夢がかなえばいいのに。', 'come true で「（夢や願いが）かなう」という決まった結び付きになる。', [
        'come true で「夢がかなう」。実現することを come で表す。',
        'go true という結び付きはない。',
        'take true という結び付きもない。',
        'put true という結び付きもない。',
      ]],
    ],
    choice: [
      ['仮定法の If の中は過去形', 'If I ___ his address, I would write to him.', ['knew', 'know', 'known', 'will know'], 'knew', 'もし彼の住所を知っていたら、手紙を書くのに。', '今の事実とちがう想像では、If の中の動詞を過去形 knew にする。表しているのは今のこと。', [
        '今は住所を知らないので、事実とちがう想像として過去形 knew にする。',
        'know と現在形にすると、ふつうの条件を表す文になり would と合わない。',
        'known は過去分詞で、If の中の動詞としてそのまま置くことはできない。',
        'If の中では will を使わない。今の想像は過去形で表す。',
      ]],
      ['帰結の文は would／could＋原形', 'If I were you, I ___ ask my friend for help.', ['would', 'will', 'am', 'did'], 'would', 'もし私があなたなら、友達に助けを求めるのに。', '仮定法の後ろの文は would / could＋動詞の原形にする。will は使わない。', [
        '事実とちがう想像の帰結なので、would＋動詞の原形にする。',
        'will は実際に起こりそうなことを表すので、事実とちがう想像には使わない。',
        'am のあとに動詞の原形 ask を続けることはできない。',
        'did は過去の一般動詞を表す語で、ここでは「〜するのに」という想像を表せない。',
      ]],
      ['I wish のあとの can は could に', 'I wish it ___ sunny today.', ['were', 'is', 'will be', 'be'], 'were', '今日が晴れだったらいいのに。', 'I wish のあとは今の事実とちがう想像なので、be動詞は主語に関係なく were にする。', [
        'I wish のあとは事実とちがう想像なので、be動詞は were にする。',
        'is と現在形にすると、事実とちがう想像を表す形にならない。',
        'will be はこれから先のことを表す形で、I wish のあとには置かない。',
        'be は原形で、I wish のあとの動詞としてそのまま置くことはできない。',
      ]],
    ],
  },
])
