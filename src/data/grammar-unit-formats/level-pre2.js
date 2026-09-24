// 単元別の並び替え・語法：英検準2級（全26単元）。参考書の各ページで学ぶ形をそのまま問う。
import { unitFormats } from './build.js'

export const GRAMMAR_UNIT_FORMATS_PRE2 = unitFormats('pre2', [
  {
    unit: 'gref_pre2_pastperf',
    order: [
      ['過去の基準より前のことは had＋過去分詞', 'The concert had started before we arrived.', '私たちが着く前に、コンサートは始まっていました。', '「着いた」という過去の時点より前のことなので had＋過去分詞にする。基準になる過去は before のまとまりで示す。'],
      ['過去の基準までの継続', 'He had lived in Osaka for ten years before he moved.', '彼は引っ越す前、10年間大阪に住んでいました。', '引っ越した時点までの継続を表すので had＋過去分詞にする。長さは for＋期間で示す。'],
    ],
    usage: [
      ['confusable', '基準より前の経験は had never', 'She had ___ seen snow before she came to Japan.', ['never', 'ever', 'yet', 'already'], 'never', '彼女は日本に来る前、雪を見たことがありませんでした。', '過去のある時までの経験がないことは had never＋過去分詞で表す。never は had と過去分詞の間に置く。', [
        'had never＋過去分詞で「（その時までに）一度も〜したことがなかった」を表す。',
        'ever は疑問文で「今までに」とたずねるときに使い、ふつうの文でこの位置には置かない。',
        'yet は否定文や疑問文の終わりに置いて「まだ・もう」を表す語で、この位置には入らない。',
        'already は「もう〜していた」となり、見たことがないという内容と合わない。',
      ]],
      ['confusable', '食べ終えるは finish', 'She had ___ lunch before the guests arrived.', ['finished', 'ended', 'closed', 'stopped'], 'finished', '客が着く前に、彼女は昼食を終えていました。', 'finish＋名詞で「〜を終える」。最後までやり遂げることを finish で表す。完了形・受け身の形なので過去分詞 finished にする。', [
        'finish lunch で「昼食を終える」。最後まで食べ終えることを表す。',
        'end lunch という言い方はふつう使わない。end は出来事が終わることを表す。',
        'close lunch という結び付きはない。close は「閉じる」。',
        'stop lunch では「昼食を中断する」となり、終えた意味にならない。',
      ]],
      ['confusable', '引っ越すは move', 'He had lived in Osaka for ten years before he ___ to Tokyo.', ['moved', 'changed', 'carried', 'took'], 'moved', '彼は東京へ引っ越す前、10年間大阪に住んでいました。', 'move to 〜 で「〜へ引っ越す」。住む場所を変えることを move で表す。過去の文なので moved にする。', [
        'move to 〜 で「〜へ引っ越す」。住まいを変えることを move で表す。',
        'change to 〜 は「〜に変える」で、住まいを移す意味にならない。',
        'carry to 〜 は「〜へ運ぶ」で、引っ越す意味にならない。',
        'take to 〜 は「〜を好きになる」などの別の意味になる。',
      ]],
    ],
    choice: [
      ['主語が何でも had', 'By the time we arrived, the lecture ___ started.', ['had', 'has', 'was', 'did'], 'had', '私たちが着いたときには、講義はもう始まっていました。', '過去完了は主語に関係なく had＋過去分詞。基準になる過去は by the time のまとまりで示す。', [
        '過去の基準より前のことなので had started にする。主語が何でも had を使う。',
        'has started は今とつながる形で、過去の基準より前を表す文には合わない。',
        'was started とすると「始められた」と受け身になり、時の前後を表せない。',
        'did started という形はない。過去分詞の前には had を置く。',
      ]],
      ['過去分詞の形をまちがえない', 'I had never ___ such a beautiful sunset.', ['seen', 'saw', 'see', 'seeing'], 'seen', '私はそんなに美しい夕焼けを見たことがありませんでした。', 'had のあとは過去分詞にする。see の過去分詞は saw ではなく seen。', [
        'see の過去分詞は seen。had never seen で「見たことがなかった」となる。',
        'saw は過去形で、had のあとには置けない。',
        'see は原形で、had のあとには置けない。',
        'seeing は ing 形で、had のあとには置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_perfprog',
    order: [
      ['続いている活動は have been＋ing', 'She has been practicing the violin for two hours.', '彼女は2時間ずっとバイオリンの練習をしています。', '今まで続いている活動の長さに目を向けるので、has been＋動詞ing にする。長さは for＋期間で示す。'],
      ['終わった量は現在完了', 'I have read three chapters so far.', '私はこれまでに3章読みました。', '読み終えた量に目を向けるので、have＋過去分詞にする。続いている活動を表す have been reading とは見方がちがう。'],
      ['since で始まりを示す', 'She has been working at the hospital since March.', '彼女は3月からずっとその病院で働いています。', '活動が始まった時点を since で示し、今まで続いていることを has been＋動詞ing で表す。'],
    ],
    usage: [
      ['verbForm', '状態を表す動詞は現在完了', 'This bag ___ to my family for fifty years.', ['has belonged', 'has been belonging', 'belongs', 'is belonging'], 'has belonged', 'このかばんは50年間、私の家族のものです。', 'belong は状態を表す動詞なので進行形にせず、続いていることも has belonged と現在完了で表す。', [
        'belong は状態を表す動詞なので、has belonged で50年間の継続を表す。',
        'belong は状態を表す動詞なので、進行形 been belonging にはしない。',
        'belongs は今のことだけを表し、50年間続いていることを表せない。',
        'is belonging という進行形は使わない。belong は状態を表す動詞。',
      ]],
      ['phrasal', '取り組むは work on', 'She has been working ___ the report since April.', ['on', 'in', 'at', 'of'], 'on', '彼女は4月からずっとその報告書に取り組んでいます。', 'work on 〜 で「〜に取り組む」。手がけている仕事や課題を on で示す。', [
        'work on 〜 で「〜に取り組む」。取りかかっている対象は on で示す。',
        'work in 〜 は「〜（の分野・場所）で働く」を表し、取り組む対象を示さない。',
        'work at 〜 は「〜（勤め先）で働く」を表す。',
        'work of 〜 という結び付きはない。',
      ]],
      ['preposition', '始まりの時点は since', 'My parents have been waiting ___ this morning.', ['since', 'for', 'from', 'during'], 'since', '両親は今朝からずっと待ち続けています。', '現在完了進行形で始まった時点を言うときは since＋時を使う。長さを言う for と使い分ける。', [
        'since this morning で「今朝から（ずっと）」。始まりの時点を示す。',
        'for は for two hours のように長さを言うときに使う。',
        'from も始まりを表すが、現在完了進行形で今まで続いていることを言うときは since を使う。',
        'during は during the class のように、決まった期間の「中で」を表す。',
      ]],
    ],
    choice: [
      ['続いている活動は進行形で', 'It ___ raining since this morning.', ['has been', 'has', 'is', 'was'], 'has been', '今朝からずっと雨が降っています。', '朝から今まで続いている活動なので、has been＋動詞ing にする。has だけでは ing を続けられない。', [
        'has been＋動詞ing で、今まで続いている活動を表す。',
        'has raining という形はない。has のあとには過去分詞を置く。',
        'is raining は今の様子だけを表し、朝からの続きを表せない。',
        'was raining は過去の様子を表し、今まで続いていることを表せない。',
      ]],
      ['been のあとは動詞ing', 'They have been ___ since this morning.', ['talking', 'talk', 'talked', 'talks'], 'talking', '彼らは今朝からずっと話し続けています。', 'have been のあとは動詞ing にして have been talking とする。過去分詞を置くと受け身の意味になってしまう。', [
        'have been＋動詞ing で続いている活動を表すので talking を置く。',
        'been のあとに動詞の原形 talk は置けない。',
        'have been talked では「話しかけられてきた」と受け身の意味になる。',
        'talks は3人称単数のときの現在形で、been のあとには置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_habit',
    order: [
      ['would often で昔の動作をふり返る', 'My father would often take me fishing.', '父はよく私を釣りに連れて行ってくれたものでした。', 'would often＋動詞の原形で「よく〜したものだ」と過去にくり返した動作を表す。'],
      ['used to は昔の状態にも使える', 'This area used to be a large rice field.', 'この地域は以前、広い田んぼでした。', 'used to＋動詞の原形は、過去の動作にも状態にも使える。今とはちがうことを表す。'],
      ['when のまとまりで時をそえる', 'When I was young, my father would read to me.', '私が幼かったころ、父はよく本を読んでくれました。', 'when のまとまりで思い出の時期を示し、後ろの文を would＋原形にして、くり返した動作を語る。'],
    ],
    usage: [
      ['confusable', '過去の状態には used to', 'There ___ be a small park here.', ['used to', 'would', 'was used to', 'would often'], 'used to', '以前はここに小さな公園がありました。', 'would は動作にしか使えない。過去にあった状態は used to＋原形で表す。', [
        '「以前は〜があった」という状態なので、There used to be 〜 とする。',
        'would は動作をくり返したことを表す語で、状態には使えない。',
        'be used to は「〜に慣れている」で、後ろに動詞の原形 be は続かない。',
        'would often も動作のくり返しを表す言い方で、状態には使えない。',
      ]],
      ['confusable', 'よく〜したものだは would often', 'When he was a boy, he ___ often swim in this river.', ['would', 'used', 'was', 'did'], 'would', '彼は少年のころ、よくこの川で泳いだものでした。', 'would often＋動詞の原形で、過去にくり返した動作を思い出として語る。', [
        'would often＋原形で「よく〜したものだ」と過去のくり返しを表す。',
        'used often swim という形はない。used to＋原形にするなら often は to のあとに置く。',
        'was often swim という形はない。be動詞のあとに動詞の原形は続かない。',
        'did often swim は動作を強める言い方で、昔のくり返しを語る形にはならない。',
      ]],
      ['setPhrase', 'used to のあとは原形', 'I ___ to visit my cousins every winter.', ['used', 'was used', 'am used', 'used to be'], 'used', '私は毎年冬にいとこを訪ねたものでした。', 'used to＋動詞の原形で「以前は〜した」。be used to は「〜に慣れている」で意味がちがう。', [
        'used to visit で「（以前は）訪ねたものだ」となる。to のあとは原形。',
        'was used to visit とすると「訪ねることに慣れていた」となり、後ろも動名詞にする必要がある。',
        'am used to は「〜に慣れている」で、後ろは動名詞になる。過去のくり返しは表せない。',
        'used to be to visit という形はない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_usedto',
    order: [
      ['be used to＋動名詞は「慣れている」', 'Mika is used to speaking in front of people.', 'ミカは人前で話すことに慣れています。', 'be used to の to は前置詞なので、後ろは動名詞にする。「〜に慣れている」という状態を表す。'],
      ['used to＋原形は「以前は〜した」', 'I used to live near the sea.', '私は以前、海の近くに住んでいました。', 'used to のあとは動詞の原形。今とはちがう過去のことを表す。'],
      ['get used to は「慣れる」', 'You will soon get used to the new school.', 'あなたはすぐに新しい学校に慣れるでしょう。', 'get used to＋名詞・動名詞で「〜に慣れる」という変化を表す。be used to は慣れている状態を表す。'],
    ],
    usage: [
      ['verbForm', 'be used to のあとは動名詞', 'My father is used to ___ up before dawn.', ['getting', 'get', 'got', 'to get'], 'getting', '父は夜明け前に起きることに慣れています。', 'be used to の to は前置詞なので、後ろの動詞を getting と ing 形にする。', [
        'be used to の to は前置詞なので、動名詞 getting を置く。',
        'be used to get という形にはしない。to のあとを原形にすると「〜するために使われる」の意味になる。',
        'got は過去形で、前置詞 to のあとには置けない。',
        'to get と to を重ねることはできない。',
      ]],
      ['verbForm', 'used to のあとは原形', 'My family used to ___ near the lake.', ['live', 'living', 'lived', 'be living'], 'live', '私の家族は以前、湖の近くに住んでいました。', 'used to のあとは動詞の原形 live にする。be used to＋動名詞と形を混ぜない。', [
        'used to のあとは動詞の原形なので live を置く。',
        'used to living とすると be used to の形と混ざってしまう。',
        'used to lived という形はない。to のあとは原形にする。',
        'used to be living という言い方はしない。',
      ]],
      ['verbForm', 'be used to＋原形は受け身', 'This knife is used ___ bread.', ['to cut', 'to cutting', 'cutting', 'for cut'], 'to cut', 'このナイフはパンを切るために使われます。', 'be used to＋動詞の原形は「〜するために使われる」という受け身の意味になる。ここは to cut として「切るために使われる」とする。', [
        'is used to＋動詞の原形で「〜するために使われる」となる。',
        'to cutting とすると「切ることに慣れている」の形になり、主語がナイフのこの文に合わない。',
        'is used cutting という形はない。',
        'for cut という形はない。for のあとは名詞か動名詞にする。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_hadbetter',
    order: [
      ['had better＋原形', 'You had better bring an umbrella today.', '今日はかさを持って行ったほうがいいですよ。', 'had better のあとは動詞の原形。had という形でも、今やこれからのことについての強い助言を表す。'],
      ['否定は had better not', 'You had better not eat too much tonight.', '今夜は食べすぎないほうがいいですよ。', 'had better の否定は not を better の後ろに置く。had not better とはしない。'],
      ['短縮形 You’d better', 'You’d better hurry or you will be late.', '急がないと遅れますよ。', 'had better は You’d better と縮めて言うことが多い。後ろはやはり動詞の原形にする。'],
    ],
    usage: [
      ['verbForm', 'had better のあとに to は付けない', 'You had better ___ a doctor today.', ['see', 'to see', 'seeing', 'saw'], 'see', '今日は医者にみてもらったほうがいいですよ。', 'had better は2語で1つの助動詞のように働くので、後ろは動詞の原形 see にする。to は付けない。', [
        'had better のあとは動詞の原形なので see を置く。',
        'had better to see という形にはしない。to は付けない。',
        'had better seeing という形はない。動詞は原形にする。',
        'saw は過去形で、had better のあとには置けない。',
      ]],
      ['verbForm', 'not は better の後ろ', 'You had ___ go out alone at night.', ['better not', 'not better', 'better don’t', 'no better'], 'better not', '夜に一人で出歩かないほうがいいですよ。', 'had better の否定は had better not＋原形。not は better の後ろに置く。', [
        'had better not＋原形で「〜しないほうがよい」を表す。',
        'had not better という語順にはしない。not は better の後ろに置く。',
        'had better don’t という形はない。原形の前に don’t は置かない。',
        'had no better という言い方はなく、助言を打ち消す形にならない。',
      ]],
      ['verbForm', 'should より強い忠告', 'You had better ___ for the test tonight.', ['study', 'studying', 'to study', 'studied'], 'study', '今夜はテストの勉強をしたほうがいいですよ。', 'had better は should より強い忠告を表す。後ろはいつも動詞の原形なので study を置く。', [
        'had better のあとは動詞の原形なので study を置く。',
        'studying は ing 形で、had better のあとには置けない。',
        'to study と to を付けることはできない。',
        'studied は過去形・過去分詞で、had better のあとには置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_causative',
    order: [
      ['have＋物＋過去分詞', 'I had the car repaired last weekend.', '私は先週末、車を修理してもらいました。', 'have＋物＋過去分詞で「物を〜してもらう」。車は「修理される」側なので過去分詞にする。'],
      ['get＋人＋to＋原形', 'I got my brother to help me with the boxes.', '私は弟に箱を運ぶのを手伝ってもらいました。', 'get のときだけ〈人＋to＋動詞の原形〉にする。make・have・let は to を付けない。'],
      ['知覚動詞＋人＋動詞ing', 'I saw him crossing the street.', '私は彼が通りをわたっているところを見ました。', 'see＋人＋動詞ing で「〜しているところを見る」。動作の途中を見たときは ing 形を使う。'],
    ],
    usage: [
      ['verbForm', 'let のあとは原形', 'Please let me ___ your heavy bag.', ['carry', 'to carry', 'carrying', 'carried'], 'carry', 'あなたの重いかばんを運ばせてください。', 'let＋人＋動詞の原形で「人に〜させてあげる」。原形 carry の前に to は付けない。', [
        'let のあとは〈人＋動詞の原形〉なので carry を置く。',
        'let me to carry という形にはしない。let のあとに to は付けない。',
        'let me carrying という形はない。動詞は原形にする。',
        'let me carried では「運ばれる」と受け身になってしまう。',
      ]],
      ['verbForm', '物は過去分詞で受ける', 'I must get this report ___ by Friday.', ['done', 'do', 'doing', 'to do'], 'done', '私は金曜日までにこの報告書を仕上げてもらわなければなりません。', 'get＋物＋過去分詞で「物を〜してもらう」。報告書は「される」側なので過去分詞 done にする。', [
        '報告書は仕上げられる側なので、過去分詞 done を置く。',
        'get this report do という形にはしない。物には過去分詞を使う。',
        'doing では報告書が自分で行うことになり、意味が通らない。',
        'get＋物＋to do という形は使わない。物には過去分詞を置く。',
      ]],
      ['verbForm', '知覚動詞＋人＋原形', 'I heard someone ___ my name.', ['call', 'to call', 'called', 'calls'], 'call', 'だれかが私の名前を呼ぶのが聞こえました。', 'hear＋人＋動詞の原形で「人が〜するのが聞こえる」。全部を聞いたときは原形 call を使う。', [
        'hear のあとは〈人＋動詞の原形〉なので call を置く。',
        'hear someone to call という形にはしない。to は付けない。',
        'called では「呼ばれる」と受け身の関係になってしまう。',
        'calls は3人称単数のときの現在形で、知覚動詞のあとには置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_itfor',
    order: [
      ['It is 〜 for 人 to …', 'It is necessary for students to bring a dictionary.', '生徒が辞書を持ってくることは必要です。', '形式主語 It で始め、動作をする人を for 人 で示し、本当の主語 to＋原形を後ろに置く。'],
      ['人の性質には of 人', 'It was careless of me to leave the door open.', 'ドアを開けたままにしたのは私の不注意でした。', 'careless のように人の性質を表す形容詞のときは、to の前を of 人 にする。'],
      ['It takes 人 時間 to …', 'It takes me an hour to get to school.', '私が学校に着くには1時間かかります。', 'It takes＋人＋時間＋to＋原形で「人が〜するのに…かかる」を表す。'],
    ],
    usage: [
      ['adjPrep', 'ふつうの形容詞には for', 'It is hard ___ me to get up at five.', ['for', 'of', 'to', 'with'], 'for', '私にとって5時に起きるのはつらいです。', 'hard・easy・important などのときは to の前を for 人 にする。人の性質を表す語のときだけ of を使う。', [
        'hard は人の性質ではなく、だれにとって難しいかを表すので for を使う。',
        'of は kind・careless など人の性質を表す形容詞のときに使う。',
        'to me を置くと動作をする人を表せない。for 人 の形にする。',
        'with me では「私と一緒に」となり、動作をする人を表せない。',
      ]],
      ['adjPrep', '人の性質には of', 'It was kind ___ you to help my mother.', ['of', 'for', 'to', 'from'], 'of', '母を助けてくださって親切にどうも。', 'kind は「あなたが親切だ」と人の性質を表すので、to の前を of 人 にする。', [
        'kind は人の性質を表す形容詞なので、of you として「あなたが親切だ」を表す。',
        'for you とすると「あなたにとって親切だ」となり、だれが親切かを表せない。',
        'to you では「あなたに対して」となり、この形では使わない。',
        'from you では「あなたから」となり、性質を表す形にならない。',
      ]],
      ['setPhrase', '時間がかかるは It takes', 'It ___ me thirty minutes to finish the report.', ['takes', 'spends', 'costs', 'makes'], 'takes', '私がその報告書を仕上げるには30分かかります。', '時間がかかることを言うときは It takes＋人＋時間＋to＋原形 の形にする。', [
        '時間がかかることは It takes＋人＋時間＋to＋原形 で表す。',
        'spend は人を主語にして I spent thirty minutes 〜ing のように使う。It spends 〜 とはしない。',
        'cost はお金がかかることを表し、時間には takes を使う。',
        'makes では「作る・させる」となり、時間がかかる意味にならない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_tooenough',
    order: [
      ['enough は形容詞の後ろ', 'The soup is cool enough for the baby to eat.', 'スープは赤ちゃんが食べられるほどさめています。', 'enough は形容詞の後ろに置く。だれにとってかは for 人 で to の前に示す。'],
      ['too 〜 to … で打ち消す', 'The music was too loud to enjoy.', 'その音楽は大きすぎて楽しめませんでした。', 'too＋形容詞＋to＋原形で「〜すぎて…できない」。主語が drink の目的語なので、最後に it は置かない。'],
    ],
    usage: [
      ['confusable', '熱すぎて飲めないは too hot', 'This soup is too ___ to eat right now.', ['hot', 'warm', 'high', 'strong'], 'hot', 'このスープは熱すぎて今は食べられません。', '食べ物や飲み物の温度が高いことは hot で表す。ほどよく温かいことを表す warm と使い分ける。', [
        'hot は温度が高いことを表す。too hot to eat で「熱すぎて食べられない」となる。',
        'warm は「ほどよく温かい」で、熱すぎて食べられない理由にならない。',
        'high は位置や数値が高いことを表し、食べ物の温度には使わない。',
        'strong は味や力が強いことを表し、温度を表さない。',
      ]],
      ['confusable', '重すぎて運べないは too heavy', 'The wooden box was too ___ for me to carry.', ['heavy', 'strong', 'hard', 'thick'], 'heavy', 'その木の箱は重すぎて、私には運べませんでした。', '物の重さは heavy で表す。力の強さを表す strong と使い分ける。', [
        'heavy は重さがあることを表す。too heavy to carry で「重すぎて運べない」となる。',
        'strong は力や味が強いことを表し、物の重さを表さない。',
        'hard は「かたい・難しい」で、重さを表さない。',
        'thick は「厚い」で、重さを表さない。',
      ]],
      ['confusable', '手が届くは reach', 'She is tall enough to ___ the top shelf.', ['reach', 'arrive', 'come', 'stand'], 'reach', '彼女はいちばん上のたなに手が届くほど背が高いです。', 'reach＋場所 で「〜に手が届く」。前置詞を入れずに目的語を直接置く。', [
        'reach the top shelf で「いちばん上のたなに手が届く」。前置詞なしで目的語を置く。',
        'arrive は「着く」で、arrive at 〜 の形にする。手が届く意味にもならない。',
        'come は「来る」で、手が届く意味にならない。',
        'stand は「立つ」で、手が届く意味にならない。',
      ]],
    ],
    choice: [
      ['目的語を重ねない', 'This tea is too hot ___.', ['to drink', 'to drink it', 'drinking', 'for drink'], 'to drink', 'この紅茶は熱すぎて飲めません。', '主語 This tea が to のあとの動詞の目的語にあたるので、to drink だけにして it を重ねない。', [
        '主語がそのまま drink の目的語にあたるので、to drink だけにする。',
        'to drink it とすると目的語が重なってしまう。',
        'too hot drinking という形はない。too のあとは to＋原形にする。',
        'for drink という形はない。too 〜 to … の形にする。',
      ]],
      ['enough の位置', 'Ken is ___ to lift this heavy table.', ['strong enough', 'enough strong', 'too strong', 'so strong'], 'strong enough', 'ケンはこの重いテーブルを持ち上げられるほど力が強いです。', 'enough は形容詞の後ろに置いて strong enough to＋原形 とする。形容詞の前には置かない。', [
        'enough は形容詞の後ろに置くので strong enough となる。',
        'enough strong という語順にはしない。enough は形容詞の後ろ。',
        'too strong to lift では「力が強すぎて持ち上げられない」と意味が通らなくなる。',
        'so strong to lift という形は使わない。so は that の文と組にする。',
      ]],
      ['名詞の前の enough', 'I don’t have ___ money to buy it.', ['enough', 'too', 'much enough', 'enough of'], 'enough', '私にはそれを買うのに十分なお金がありません。', 'enough が名詞を説明するときは名詞の前に置く。形容詞を説明するときは後ろに置く。', [
        '名詞 money を説明するときは、enough を名詞の前に置く。',
        'too money という形はない。too は形容詞・副詞の前に置く。',
        'much enough という言い方はしない。名詞の前は enough だけでよい。',
        'enough of は enough of the money のように決まった物を指すときの形で、ここでは合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_purpose',
    order: [
      ['in order to で目的をはっきり示す', 'He got up early in order to catch the first train.', '彼は始発列車に間に合うように早起きしました。', 'in order to＋動詞の原形で「〜するために」と目的をはっきり示す。to＋原形だけでも同じ意味になる。'],
      ['否定は in order not to', 'He spoke quietly in order not to disturb others.', '彼はほかの人のじゃまをしないように静かに話しました。', '「〜しないように」は not を to の前に置いて in order not to＋原形とする。'],
      ['so that＋主語＋can', 'Write clearly so that everyone can read it.', 'みんなが読めるように、はっきり書いてください。', '目的の主語が文の主語とちがうときは so that＋主語＋can / will の形にする。'],
    ],
    usage: [
      ['setPhrase', 'so as not to の語順', 'We left early so as ___ to miss the bus.', ['not', 'don’t', 'no', 'never'], 'not', '私たちはバスに乗り遅れないように早く出ました。', 'so as to＋原形 を打ち消すときは、not を to の直前に置いて so as not to＋原形 にする。', [
        'so as not to＋原形で「〜しないように」を表す。not は to の直前に置く。',
        'don’t は命令文や一般動詞の否定に使う語で、so as のあとには置けない。',
        'no は名詞の前に置く語で、to＋原形を打ち消す働きはない。',
        'so as never to も使えなくはないが、ここでは決まった形の so as not to を使う。',
      ]],
      ['setPhrase', '目的をつなぐのは so that', 'Speak slowly ___ that everyone can follow you.', ['so', 'such', 'in order', 'as'], 'so', 'みんながついていけるように、ゆっくり話してください。', '目的を表すまとまりは so that＋主語＋can の形にする。such that や in order that とは言いかえない。', [
        'so that＋主語＋can で「〜できるように」と目的を表す。',
        'such that は「そのような〜」を表す別の言い方で、目的を表す形ではない。',
        'in order that も使えるが、in order の後ろに that を続けるときは形が変わる。ここでは so that にする。',
        'as that という結び付きはない。',
      ]],
      ['confusable', '目をさまさせるは wake', 'She moved quietly in order not to ___ the baby.', ['wake', 'rise', 'stand', 'grow'], 'wake', '彼女は赤ちゃんを起こさないように静かに動きました。', 'wake＋人 で「人を起こす」。自分が起きることを表す get up や rise と使い分ける。', [
        'wake the baby で「赤ちゃんを起こす」。眠っている人を目ざめさせることを表す。',
        'rise は「（自分が）昇る・起き上がる」で、後ろに目的語を置かない。',
        'stand は「立つ」で、起こす意味にならない。',
        'grow は「育つ」で、起こす意味にならない。',
      ]],
    ],
    choice: [
      ['so that の中には can や will', 'I wrote it down so that everyone ___ remember it.', ['could', 'can to', 'is', 'does'], 'could', 'みんなが覚えられるように、私はそれを書きとめました。', 'so that のまとまりの中には can・will・could などを入れる。文の動詞が過去形なので could にそろえる。', [
        '文の動詞 wrote が過去形なので、そろえて could remember にする。',
        'can to remember という形はない。助動詞のあとに to は付けない。',
        'is remember という形はない。be動詞のあとに原形は続かない。',
        'does remember は動作を強める形で、目的を表すまとまりには合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_gerundidiom',
    order: [
      ['look forward to＋動名詞', 'I look forward to hearing your answer.', 'お返事をいただけるのを楽しみにしています。', 'look forward to の to は前置詞なので、後ろは動名詞にする。動詞の原形は置けない。'],
      ['feel like＋動名詞', 'I feel like cooking something warm tonight.', '今夜は何か温かい物を作りたい気分です。', 'feel like＋動詞ing で「〜したい気がする」。like は前置詞なので後ろは動名詞にする。'],
      ['have difficulty＋動名詞', 'I had difficulty finding the right platform.', '私は正しいホームを見つけるのに苦労しました。', 'have difficulty＋動詞ing で「〜するのに苦労する」。to＋原形は続けない。'],
    ],
    usage: [
      ['setPhrase', '〜せずにはいられない', 'I could not help ___ at his joke.', ['laughing', 'to laugh', 'laugh', 'laughed'], 'laughing', '私は彼の冗談に笑わずにはいられませんでした。', 'cannot help＋動詞ing で「〜せずにはいられない」という決まった言い方になる。ここは laughing を置く。', [
        'cannot help＋動詞ing で「〜せずにはいられない」。laughing を置く。',
        'help to laugh は「笑うのを手伝う」という別の意味になってしまう。',
        'help laugh も「笑うのを手伝う」の形で、この決まった言い方にはならない。',
        'laughed は過去形・過去分詞で、help のあとには置けない。',
      ]],
      ['setPhrase', 'when it comes to＋動名詞', 'When it comes to ___, Ken is the best in our class.', ['cooking', 'cook', 'to cook', 'cooked'], 'cooking', '料理のこととなると、ケンは私たちのクラスでいちばんです。', 'when it comes to の to も前置詞なので、後ろは名詞か動名詞にして cooking とする。', [
        'when it comes to の to は前置詞なので、動名詞 cooking を置く。',
        'cook と原形を置くことはできない。前置詞のあとは動名詞にする。',
        'to cook と to を重ねることはできない。',
        'cooked は過去形・過去分詞で、前置詞のあとには置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_participle',
    order: [
      ['SVC の分詞は主語の様子', 'The dog came running toward us.', '犬が私たちのほうへ走って来ました。', 'come＋動詞ing で「〜しながら来る」。分詞が主語 The dog の様子を表す。'],
      ['keep＋目的語＋動詞ing', 'Don’t keep me waiting so long.', 'そんなに長く私を待たせないでください。', 'keep＋目的語＋分詞で目的語の様子を表す。me は「待つ」側なので現在分詞 waiting にする。'],
      ['名詞を後ろから説明する過去分詞', 'The letters written in pencil were hard to read.', 'えんぴつで書かれた手紙は読みにくかったです。', '手紙は「書かれる」側なので過去分詞 written を使い、2語以上なので The letters の後ろに置く。'],
    ],
    usage: [
      ['verbForm', '目的語が「される」側なら過去分詞', 'He left the window ___ all night.', ['open', 'opening', 'to open', 'opens'], 'open', '彼は一晩中、窓を開けたままにしておきました。', 'leave＋目的語＋補語で「〜を…のままにする」。窓の状態を表す open を補語に置く。', [
        'the window＝open の関係になるので、状態を表す open を置く。',
        'opening では窓が自分で開けていることになり、意味が通らない。',
        'to open では「開けるために」となり、状態を表す形にならない。',
        'opens を置くと文の動詞が2つになってしまう。',
      ]],
      ['confusable', 'look＋分詞で主語の様子', 'Naomi looked ___ to see me at the station.', ['surprised', 'surprising', 'surprise', 'to surprise'], 'surprised', 'ナオミは駅で私に会って驚いた様子でした。', 'look＋過去分詞で「〜した様子に見える」。人は驚かされる側なので surprised にする。', [
        'ナオミは驚かされる側なので、過去分詞 surprised を置く。',
        'surprising は「人を驚かせるような」で、主語が人のこの文には合わない。',
        'surprise は動詞の原形で、look のあとにそのまま置くことはできない。',
        'to surprise は「驚かせるために」となり、様子を表す形にならない。',
      ]],
      ['verbForm', '見えている動作は現在分詞', 'I saw two men ___ a piano into the hall.', ['carrying', 'carried', 'carry to', 'to carry'], 'carrying', '私は2人の男性がピアノをホールへ運んでいるのを見ました。', 'see＋目的語＋動詞ing で「〜しているところを見る」。運んでいる途中を見たので carrying にする。', [
        '運んでいる途中を見たので、現在分詞 carrying を置く。',
        'carried では「運ばれる」と受け身の関係になってしまう。',
        'carry to という形はここでは合わない。see のあとに to は付けない。',
        'to carry という形にはしない。知覚動詞のあとに to は付けない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_partconst',
    order: [
      ['分詞構文は動詞ing で始める', 'Feeling hungry, he opened the refrigerator.', 'おなかがすいたので、彼は冷蔵庫を開けました。', '接続詞と主語を省き、動詞を ing 形にして文の前に置く。文の主語 he が feel の動作をする人になる。'],
      ['意味は文の流れで決まる', 'Walking home, Emi found a small coin.', '歩いて家へ帰る途中、エミは小さな硬貨を見つけました。', '分詞構文は「〜しているとき」「〜なので」などの意味を、後ろの文との関係から読み取る。'],
    ],
    usage: [
      ['preposition', '通りを歩くは walk down the street', 'Walking ___ the road, I found a small shop.', ['down', 'of', 'into', 'off'], 'down', '道を歩いていると、私は小さな店を見つけました。', 'walk down the road で「道を歩いていく」。道に沿って進むことを down で表す。', [
        'walk down the road で「道を歩いていく」。道に沿って進むときは down を使う。',
        'walk of the road という結び付きはない。',
        'walk into 〜 は「〜の中へ歩いて入る」で、道に沿って進む意味にならない。',
        'walk off 〜 は「〜から歩き去る」で、道を進む意味にならない。',
      ]],
      ['verbNoun', '風呂に入るは take a bath', 'Arriving home, she ___ a hot bath.', ['took', 'made', 'did', 'put'], 'took', '家に着くと、彼女は熱いふろに入りました。', 'take a bath で「ふろに入る」という決まった結び付きになる。過去の文なので took にする。', [
        'take a bath で「ふろに入る」。入浴することを take で表す。',
        'make a bath では「ふろを作る」となり、入る意味にならない。',
        'do a bath という結び付きはない。',
        'put a bath という結び付きもない。',
      ]],
      ['setPhrase', '寝るは go to bed', 'Feeling sleepy, he went straight to ___.', ['bed', 'the bed', 'a bed', 'beds'], 'bed', '眠かったので、彼はまっすぐ寝ました。', 'go to bed で「寝る」。眠るという目的を表すので bed に冠詞を付けない。', [
        'go to bed で「寝る」。目的を表すので冠詞を付けない。',
        'go to the bed では「そのベッドのところへ行く」と家具を指す形になる。',
        'go to a bed では「あるベッドのところへ行く」となり、寝る意味にならない。',
        'go to beds という言い方はしない。',
      ]],
    ],
    choice: [
      ['分詞構文は ing 形で始める', '___ down the street, I met an old friend.', ['Walking', 'Walked', 'To walk', 'Walk'], 'Walking', '通りを歩いていると、私は昔の友達に会いました。', '分詞構文は動詞を ing 形にして文の前に置き、Walking で始める。過去形や to＋原形では作れない。', [
        '主語 I が歩く側なので、現在分詞 Walking で始める。',
        'Walked では「歩かれて」と受け身の関係になってしまう。',
        'To walk は「歩くために」と目的を表し、この文の流れに合わない。',
        'Walk と原形で文を始めると命令文になってしまう。',
      ]],
      ['先に終わったことは Having＋過去分詞', '___ finished her work, Aya went out.', ['Having', 'Have', 'Had', 'To have'], 'Having', '仕事を終えてから、アヤは出かけました。', '文の動詞より前に終わったことを表すときは、Having＋過去分詞で分詞構文を作る。', [
        '先に終わったことなので Having＋過去分詞にする。',
        'Have と原形で始めると命令文になってしまう。',
        'Had finished では〈主語＋動詞〉が必要になり、分詞構文にならない。',
        'To have finished は「終えるために」となり、この文の流れに合わない。',
      ]],
      ['後ろに置く分詞構文', 'She read the letter, ___ happily.', ['smiling', 'smiled', 'to smile', 'smile'], 'smiling', '彼女はうれしそうにほほえみながら手紙を読みました。', '分詞構文は文の後ろにも置ける。主語 She がほほえむ側なので現在分詞 smiling にする。', [
        '主語がほほえむ側なので、現在分詞 smiling を置く。',
        'smiled では受け身の関係になり、主語の様子を表せない。',
        'to smile は「ほほえむために」となり、同時の様子を表さない。',
        'smile と原形を置くと、文に動詞が2つ並んでしまう。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_reladv',
    order: [
      ['時を説明する when', 'I still remember the day when we first met.', '私は今でも初めて会った夏を覚えています。', '先行詞が時を表す名詞で、後ろの文が欠けていないので関係副詞 when を使う。'],
      ['理由を説明する why', 'Please tell me the reason why you changed your mind.', 'あなたが考えを変えた理由を教えてください。', '先行詞が the reason のときは関係副詞 why でつなぐ。後ろには主語も目的語もそろった文が続く。'],
    ],
    usage: [
      ['setPhrase', '生まれるは be born', 'This is the town where I was ___.', ['born', 'birth', 'bearing', 'borne'], 'born', 'ここは私が生まれた町です。', 'be born で「生まれる」。受け身の形のまとまりとして覚える。', [
        'be born で「生まれる」。was born のように be動詞と組にして使う。',
        'birth は「誕生」という名詞で、be動詞のあとに置いて生まれた意味にはならない。',
        'bearing は「（重さを）支えている」などを表し、生まれる意味にならない。',
        'borne は bear の過去分詞だが、生まれる意味では born を使う。',
      ]],
      ['confusable', '覚えているは remember', 'I still ___ the summer when we first met.', ['remember', 'remind', 'memorize', 'forget'], 'remember', '私は今でも初めて会った日を覚えています。', 'remember は「覚えている・思い出す」。人に思い出させる remind と使い分ける。', [
        'remember は自分が覚えていることを表す。目的語を直接置ける。',
        'remind は「人に思い出させる」で、remind me of 〜 の形にする。',
        'memorize は「暗記する」で、覚えようと努力することを表す。',
        'forget は「忘れる」で、覚えている意味と逆になる。',
      ]],
      ['confusable', '人に伝えるは tell', 'Please ___ me the reason why you were absent.', ['tell', 'say', 'speak', 'talk'], 'tell', 'あなたが欠席した理由を私に教えてください。', 'tell は〈tell＋人＋内容〉の順に置ける。say・speak・talk は人を直接置けない。', [
        'tell me the reason で「私に理由を伝える」。tell は人を直接後ろに置ける。',
        'say は言う内容を目的語にする語で、人を直接置けない。say to me の形にする。',
        'speak は speak to me の形で使い、人を直接置けない。',
        'talk も talk to me の形で使う。',
      ]],
    ],
    choice: [
      ['場所を説明するのは where', 'This is the village ___ my mother grew up.', ['where', 'which', 'what', 'who'], 'where', 'ここは母が育った村です。', '後ろの文が欠けていないので関係副詞 where を使う。which を使うなら in which とする。', [
        '後ろの my mother grew up は欠けていない文なので、関係副詞 where でつなぐ。',
        'which は後ろの文の主語や目的語が欠けているときに使う。この文では欠けていない。',
        'what は先行詞を含む語なので、前に the village を置くことはできない。',
        'who は人を説明する語で、village を先行詞にはできない。',
      ]],
      ['the way と how は並べない', 'This is ___ she learned Chinese.', ['how', 'the way how', 'which', 'what way'], 'how', 'このようにして彼女は中国語を覚えました。', '方法を表すときは the way か how のどちらか一方だけを使う。2つを並べて言わない。', [
        'how だけで「〜する方法」を表せる。the way は付けない。',
        'the way how と並べる言い方はしない。どちらか一方にする。',
        'which では方法を表せない。後ろの文も欠けていない。',
        'what way という言い方はこの形では使わない。',
      ]],
      ['前置詞＋which に言いかえる', 'This is the house ___ which I was born.', ['in', 'on', 'at', 'to'], 'in', 'ここは私が生まれた家です。', 'where は〈前置詞＋which〉に言いかえられる。前置詞はもとの文の be born in 〜 から決める。', [
        'もとの文が I was born in the house なので、in which とする。',
        'on which では「家の上で生まれた」となってしまう。',
        'at which も使える場面はあるが、建物の中を表すもとの文は be born in 〜 になる。',
        'to which では行き先を表し、生まれた場所を表せない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_nonrestrictive',
    order: [
      ['コンマ＋who で説明を足す', 'My uncle, who lives in New York, is a doctor.', 'おじはニューヨークに住んでいて、医者をしています。', 'すでにだれか決まっている人に説明を足すので、コンマを置いて who を続ける。'],
      ['コンマ＋which で物に説明を足す', 'This library, which opened in April, is always crowded.', 'この図書館は4月に開館したのですが、いつも混んでいます。', '物に説明を足す継続用法ではコンマ＋which を使う。that には置きかえられない。'],
      ['自分の持ち物に説明を足す', 'My bicycle, which I bought in May, was stolen yesterday.', '私の自転車は5月に買ったのですが、昨日ぬすまれました。', 'どれかが決まっている物に説明を足す形。継続用法の which は省略できない。'],
    ],
    usage: [
      ['verbNoun', '開館するは open', 'This shop, which ___ last year, is very popular.', ['opened', 'wore', 'washed', 'wrote'], 'opened', 'この店は去年開店したのですが、とても人気があります。', 'open は店や施設が「開く・開店する」ことを表す。身に着ける wear などとは使う場面がちがう。過去の文なので opened にする。', [
        'open は店が営業を始めることを表す。The shop opened last year. のように使う。',
        'wear は身に着けることを表し、施設には使わない。',
        'wash は「洗う」で、開館する意味にならない。',
        'write は「書く」で、開館する意味にならない。',
      ]],
      ['adjPrep', '〜で有名だは be famous for', 'This town, which is famous ___ its old temples, attracts many visitors.', ['for', 'to', 'with', 'at'], 'for', 'この町は古い寺で有名なのですが、多くの観光客を引きつけています。', 'be famous for 〜 で「〜で有名だ」。有名になった理由を for で示す。', [
        'be famous for 〜 で「〜で有名だ」。有名さの理由は for で示す。',
        'be famous to 〜 は「〜に知られている」と、知っている相手を示す別の言い方になる。',
        'famous with 〜 という結び付きはない。',
        'famous at 〜 という結び付きもない。',
      ]],
      ['phrasal', 'こわれるは break down', 'My laptop, which I bought last year, has already ___ down.', ['broken', 'fallen', 'taken', 'put'], 'broken', '私のノートパソコンは去年買ったのですが、もう故障しました。', 'break down で「（機械が）こわれる・故障する」という決まった結び付きになる。過去の文なので broken にする。', [
        'break down で「故障する」。機械が動かなくなることを表す。',
        'fall down は「倒れる・転ぶ」で、機械の故障を表さない。',
        'take down は「取りはずす・書きとめる」で、故障の意味にならない。',
        'put down は「下に置く・書きとめる」で、故障の意味にならない。',
      ]],
    ],
    choice: [
      ['継続用法に that は使わない', 'My aunt, ___ lives in Sydney, is a lawyer.', ['who', 'that', 'which', 'whom'], 'who', 'おばはシドニーに住んでいて、弁護士をしています。', 'コンマのある継続用法では that を使わない。先行詞が人で主語になるので who を使う。', [
        '継続用法で人に説明を足すときは who を使う。',
        'that はコンマのある継続用法では使えない。',
        'which は物を説明する語で、my aunt には使えない。',
        'whom は目的語になるときの形で、後ろに動詞が続くこの文には合わない。',
      ]],
      ['継続用法は省略できない', 'The cake, ___ Emi made yesterday, was delicious.', ['which', 'what', 'whose', 'where'], 'which', 'そのケーキはエミが昨日作ったもので、とてもおいしかったです。', '継続用法の関係代名詞は目的格でも省略しない。物なので which を使う。', [
        '物に説明を足す継続用法なので which を使い、省略もしない。',
        'what は先行詞を含む語なので、前に The cake を置くことはできない。',
        'whose は後ろに名詞を続けて持ち主を表す語で、ここでは合わない。',
        'where は場所を説明する語で、ケーキの説明には使えない。',
      ]],
      ['コンマのあるなしで意味が変わる', 'He has two sons, ___ became doctors.', ['both of whom', 'both of them', 'both of who', 'both they'], 'both of whom', '彼には息子が2人いて、2人とも医者になりました。', '前置詞や of の後ろで人を受けるときは whom を使い、both of whom とする。コンマのあとに them を置くと文が2つ並んでしまう。', [
        'of の後ろで人を受けるので whom を使い、1つの文の中でつなぐ。',
        'both of them を置くと、つなぐ語のないまま文が2つ並んでしまう。',
        'of の後ろに who は置けない。目的格の whom にする。',
        'both they という語順はない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_what',
    order: [
      ['what は先行詞をふくむ', 'Please tell me what you need today.', '今日あなたが必要とする物を教えてください。', 'what は「〜する物」を1語で表すので、前に名詞を置かない。tell＋人＋内容 の内容として置く。'],
      ['What が主語のまとまりになる', 'What surprised us was his calm answer.', '私たちを驚かせたのは、彼の落ち着いた返事でした。', 'What surprised us が「私たちを驚かせたこと」という主語のまとまりになる。後ろに was を続けて説明する。'],
      ['what it was で昔と比べる', 'The town is very different from what it was ten years ago.', 'その都市は20年前とはすっかりちがいます。', 'what it was で「かつての姿」を表す。from の後ろに置いて、今の姿と比べる。'],
    ],
    usage: [
      ['confusable', '大切であるは matter', 'What ___ most is that you tried your best.', ['matters', 'minds', 'cares', 'means'], 'matters', 'いちばん大切なのは、あなたが全力を尽くしたということです。', 'matter は「重要である」。主語の what と組にして「大切なこと」を表す。主語が3人称単数なので matters にする。', [
        'matter は「重要である」。What matters most で「いちばん大切なこと」となる。',
        'mind は「気にする」で、重要であるという意味にならない。',
        'care は「気にかける」で、care about 〜 の形で使う。',
        'mean は「意味する」で、重要であるという意味にならない。',
      ]],
      ['verbNoun', '全力を尽くすは do one’s best', 'What matters is that you ___ your best.', ['did', 'made', 'took', 'played'], 'did', '大切なのは、あなたが全力を尽くしたということです。', 'do one’s best で「全力を尽くす」という決まった結び付きになる。過去の文なので did にする。', [
        'do your best で「全力を尽くす」。決まった言い方としてまとまりで覚える。',
        'make your best という言い方はしない。',
        'take your best という結び付きはない。',
        'play your best は演技や演奏について言う形で、全力を尽くすという意味にはならない。',
      ]],
      ['adjPrep', '〜とちがうは be different from', 'The city is very different ___ what it was twenty years ago.', ['from', 'to', 'with', 'of'], 'from', 'その町は10年前とはすっかりちがいます。', 'be different from 〜 で「〜とちがう」。比べる相手を from で示す。', [
        'be different from 〜 で「〜とちがう」。比べる相手は from で示す。',
        'different to 〜 は一部の地域で使われるが、英検では from を選ぶ。',
        'different with 〜 という結び付きはない。',
        'different of 〜 という結び付きもない。',
      ]],
    ],
    choice: [
      ['先行詞がなければ what', 'This is ___ I wanted for my birthday.', ['what', 'that', 'which', 'the thing what'], 'what', 'これが私が誕生日にほしかった物です。', '前に先行詞がなく「〜する物」をまとめて表すときは what を使う。', [
        '前に名詞がないので、先行詞をふくむ what を使う。',
        'that は前に先行詞があるときに使う。ここには先行詞がない。',
        'which も前に先行詞が必要で、この文では使えない。',
        'the thing what と重ねる言い方はしない。what だけで「〜する物」を表す。',
      ]],
      ['先行詞があれば that・which', 'This is the book ___ I wanted to read.', ['that', 'what', 'whose', 'where'], 'that', 'これが私が読みたかった本です。', '前に the book という先行詞があるので、what ではなく that（または which）を使う。', [
        '先行詞 the book があるので、that でつなぐ。which でもよい。',
        'what は先行詞をふくむ語なので、the book のあとには置けない。',
        'whose は後ろに名詞を続けて持ち主を表す語で、ここでは合わない。',
        'where は場所を説明する語で、本の説明には使えない。',
      ]],
      ['What で始まる主語は単数扱い', 'What he said ___ everyone in the room.', ['surprised', 'surprise', 'were surprising', 'have surprised'], 'surprised', '彼が言ったことは、部屋にいたみんなを驚かせました。', 'What 〜 のまとまりは1つの事がらを表すので、動詞は単数に合わせて surprised にする。', [
        'What he said は1つの事がらなので、動詞は単数に合わせて surprised とする。',
        'surprise は主語が複数のときの形で、What 〜 の主語には合わない。',
        'were は複数の主語に使う形で、What 〜 のまとまりには合わない。',
        'have surprised は主語が複数のときの形で、この主語には has を使う。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_preprel',
    order: [
      ['前置詞＋whom で人を受ける', 'The man to whom I wrote never replied.', '私が手紙を書いた男性は一度も返事をくれませんでした。', 'もとの文が write to 〜 なので、前置詞 to を関係代名詞の前に出し、人なので whom を使う。'],
      ['前置詞＋which で物を受ける', 'This is the key with which we open the gate.', 'これは私たちが門を開けるのに使う鍵です。', 'もとの文が open with 〜 なので、with を前に出して with which とする。'],
      ['in which で場所を表す', 'That is the room in which the meeting was held.', 'あれがその会議が開かれた部屋です。', 'hold in the room のもとの形から in を前に出す。where に言いかえることもできる。'],
    ],
    usage: [
      ['confusable', '修理するは repair', 'This is the tool with which the engine is ___.', ['repaired', 'recovered', 'returned', 'replied'], 'repaired', 'これはそのエンジンを修理するのに使う道具です。', 'repair は機械や建物を「修理する」。元の状態に戻すことを表す。完了形・受け身の形なので過去分詞 repaired にする。', [
        'repair は機械を修理することを表す。The engine is repaired. と受け身で使える。',
        'recover は「回復する・取りもどす」で、機械を直す意味にならない。',
        'return は「返す・もどる」で、修理する意味にならない。',
        'reply は「返事をする」で、修理する意味にならない。',
      ]],
      ['phrasal', '頼るは depend on', 'This is the person on whom we ___ in an emergency.', ['depend', 'wear', 'wash', 'write'], 'depend', 'これは緊急時に私たちが頼る人です。', 'depend on 〜 で「〜に頼る」。頼る相手は on で示す。', [
        'depend on 〜 で「〜に頼る」。頼る相手は on で示す。',
        'wear on 〜 という結び付きはなく、頼る意味にならない。',
        'wash on 〜 という結び付きもない。',
        'write on 〜 は「〜について書く」で、頼る意味にならない。',
      ]],
      ['verbNoun', '遊ぶは play', 'This is the garden in which children ___ safely.', ['play', 'make', 'do', 'take'], 'play', 'ここは子どもたちが安全に遊べる庭です。', 'play は「遊ぶ」。後ろに目的語を置かずに使える点で、make・do・take とちがう。', [
        'play は「遊ぶ」。目的語を置かずに使い、場所は in the garden で示す。',
        'make は「作る」で、目的語が必要になり、遊ぶ意味にもならない。',
        'do は「する」で、目的語が必要になる。',
        'take は「取る」で、目的語が必要になり、遊ぶ意味にならない。',
      ]],
    ],
    choice: [
      ['前置詞のあとに that は置けない', 'This is the building in ___ she works.', ['which', 'that', 'what', 'where'], 'which', 'これは彼女が働いている建物です。', '前置詞のすぐ後ろには that を置けない。物を受けるときは which を使う。', [
        '前置詞 in の後ろには which を置く。in which で「その中に」を表す。',
        '前置詞のすぐ後ろに that は置けない。that を使うなら前置詞を後ろに残す。',
        'what は先行詞をふくむ語なので、the building のあとには置けない。',
        'where は前置詞の後ろには置けない。where 1語なら in which の代わりになる。',
      ]],
      ['前置詞＋人は whom', 'The woman to ___ I spoke was very kind.', ['whom', 'who', 'which', 'that'], 'whom', '私が話しかけた女性はとても親切でした。', '前置詞のすぐ後ろで人を受けるときは、who ではなく whom を使う。', [
        '前置詞 to の後ろで人を受けるので、目的格の whom を使う。',
        '前置詞のすぐ後ろに who は置けない。whom にする。',
        'which は物を受ける語で、the woman には使えない。',
        '前置詞のすぐ後ろに that は置けない。',
      ]],
      ['前置詞はもとの文で決まる', 'This is the chair ___ which my grandfather always sat.', ['in', 'to', 'for', 'of'], 'in', 'これは祖父がいつもすわっていたいすです。', '前置詞はもとの文の組み合わせで決まる。sit in the chair なので in which とする。', [
        'sit in the chair という組み合わせなので、in which とする。',
        'to which では行き先を表し、すわる場所を表せない。',
        'for which では目的や相手を表し、すわる場所を表せない。',
        'of which は「〜の」を表し、すわる場所を表せない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_indirect',
    order: [
      ['whether で「〜かどうか」', 'I wonder whether it will rain this afternoon.', '今晩雪が降るだろうか。', 'Yes / No でたずねる内容を文に入れるときは whether（または if）＋主語＋動詞にする。'],
      ['疑問詞のあとは主語＋動詞', 'Could you tell me when the store opens?', 'その店がいつ開くか教えていただけますか。', '文に入れた疑問は〈疑問詞＋主語＋動詞〉の順にする。does を使わず動詞に s を付けて表す。'],
      ['文の動詞に時をそろえる', 'I wonder why he left so early yesterday.', '彼が昨日なぜあんなに早く帰ったのだろう。', '文に入れた疑問では did を使わず、動詞を過去形にして時を表す。'],
    ],
    usage: [
      ['confusable', '〜かどうかは whether', 'I asked her ___ she was free on Sunday.', ['if', 'that', 'what', 'which'], 'if', '私は彼女に日曜日はひまかどうかたずねました。', 'Yes / No でたずねる内容を文に入れるときは if または whether を使う。that は使わない。', [
        'if＋〈主語＋動詞〉で「〜かどうか」を表す。whether にも置きかえられる。',
        'that は「〜ということ」を表し、「かどうか」という不確かさは表せない。',
        'what は「何を」を表す語で、後ろに足りない部分のある文を続ける。',
        'which は「どちらを」を表す語で、ここでは意味が通らない。',
      ]],
      ['verbForm', '〜だろうかと思うは wonder', 'I ___ whether it will snow this evening.', ['wonder', 'speak', 'talk', 'say'], 'wonder', '午後に雨が降るだろうか。', 'wonder＋whether / 疑問詞 で「〜だろうかと思う」。後ろにまとまりを続けられる。', [
        'wonder whether 〜 で「〜だろうかと思う」。後ろに〈主語＋動詞〉のまとまりを続ける。',
        'speak は speak to 〜 の形で使い、whether のまとまりを続けられない。',
        'talk も talk about 〜 の形で使い、whether のまとまりを続けられない。',
        'say は言う内容を目的語にするが、say whether の形はこの文脈では使わない。',
      ]],
      ['confusable', '行き方は the way to', 'Could you tell me the ___ to the station?', ['way', 'road', 'street', 'path'], 'way', '駅への行き方を教えていただけますか。', 'the way to 〜 で「〜への行き方」。道そのものを指す road・street と使い分ける。', [
        'the way to 〜 で「〜への行き方」。道順をたずねるときの決まった言い方。',
        'road は町と町を結ぶ道そのものを指し、行き方を表さない。',
        'street は建物の並ぶ通りを指し、行き方を表さない。',
        'path は細い小道を指し、行き方を表さない。',
      ]],
    ],
    choice: [
      ['語順を疑問文に戻さない', 'Could you tell me where ___?', ['the station is', 'is the station', 'does the station', 'the station does'], 'the station is', '駅がどこにあるか教えていただけますか。', '文に入れた疑問は〈疑問詞＋主語＋動詞〉の順にして the station is とする。動詞を主語の前に出さない。', [
        'where のあとを〈主語＋動詞〉にして the station is とする。',
        'is the station は疑問文の語順で、文に入れた疑問では使わない。',
        'does the station も疑問文の形で、ここでは使わない。',
        'the station does では「駅がする」となり、場所を表す文にならない。',
      ]],
      ['do・does・did は使わない', 'I wonder why she ___ so suddenly.', ['left', 'did leave', 'does leave', 'leaving'], 'left', '彼女がなぜあんなに急に帰ったのだろう。', '文に入れた疑問では do・does・did を使わず、動詞の形で時を表して left とする。', [
        '過去のことなので、動詞を過去形 left にして時を表す。',
        'did leave は疑問文の形で、文に入れた疑問では使わない。',
        'does leave も疑問文の形で、過去のことにも合わない。',
        'leaving だけでは中の文の動詞にならない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_subjunctive',
    order: [
      ['事実とちがう仮定は過去形', 'If I had a boat, I could sail to that island.', 'もし船があれば、あの島へ行けるのに。', '今の事実とちがう想像なので、If の中を過去形にし、後ろを could＋原形にする。'],
      ['起こりうる条件は現在形', 'If it snows tomorrow, we will stay inside.', '明日雪が降ったら、私たちは中にいます。', '実際に起こりうる条件なので、If の中を現在形にし、後ろを will＋原形にする。'],
      ['仮定法の were', 'If Ken were free today, he would join us.', 'もしケンが今日ひまなら、私たちに加わるのに。', '事実とちがう想像では、主語が何でも be動詞は were を使う。後ろの文は would＋原形にする。'],
    ],
    usage: [
      ['confusable', '空を飛ぶは fly', 'If I had wings, I could ___ over the sea.', ['fly', 'run', 'drive', 'ride'], 'fly', 'もし翼があれば、海の上を飛べるのに。', '空を飛ぶことは fly で表す。地面を移動する run・drive・ride と使い分ける。', [
        'fly は空を飛ぶことを表す。翼があれば飛べる、という内容に合う。',
        'run は地面を走ることを表し、翼とは結び付かない。',
        'drive は車を運転することを表す。',
        'ride は自転車や馬にまたがって乗ることを表す。',
      ]],
      ['verbNoun', '時間があるは have time', 'If I ___ more time, I would help you.', ['had', 'made', 'took', 'did'], 'had', 'もっと時間があれば、あなたを手伝えるのに。', 'have time で「時間がある」という決まった結び付きになる。事実とちがう想像なので過去形 had にする。', [
        'have time で「時間がある」。事実とちがう想像なので過去形 had にする。',
        'make time は「時間をつくる」で、時間がある状態を表さない。',
        'take time は「時間がかかる」で、意味がちがう。',
        'do time という結び付きはこの意味では使わない。',
      ]],
      ['confusable', '仲間に加わるは join', 'If Ken were free today, he would ___ us for lunch.', ['join', 'wear', 'wash', 'write'], 'join', 'もしケンが今日ひまなら、昼食に加わるのに。', 'join＋人 で「人に加わる・一緒にする」。前置詞を入れずに目的語を直接置く。', [
        'join us で「私たちに加わる」。join は目的語を直接置く。',
        'wear us という結び付きはない。',
        'wash us では「私たちを洗う」となり、意味が通らない。',
        'write us は「私たちに手紙を書く」で、加わる意味にならない。',
      ]],
    ],
    choice: [
      ['If の中の be動詞は were', 'If I ___ rich, I would travel around the world.', ['were', 'am', 'will be', 'have been'], 'were', 'もしお金持ちなら、世界中を旅するのに。', '今の事実とちがう想像では、主語が I でも be動詞は were にする。', [
        '事実とちがう想像なので、主語が I でも were を使う。',
        'am と現在形にすると、would と組にならない。',
        'If の中では will を使わない。事実とちがう想像は過去形で表す。',
        'have been は今までの経験や継続を表す形で、この想像には合わない。',
      ]],
      ['起こりうる条件では will を使わない', 'If it ___ tomorrow, we will cancel the picnic.', ['rains', 'will rain', 'rained', 'would rain'], 'rains', '明日雨が降ったら、ピクニックは中止にします。', '実際に起こりうる条件を表す if の中では、これから先のことでも現在形 rains を使う。', [
        '条件を表す if の中は、未来のことでも現在形 rains にする。',
        'if の中では will を使わない。',
        'rained と過去形にすると、事実とちがう想像を表す形になり will とつり合わない。',
        'would rain も想像を表す形で、will stay とつり合わない。',
      ]],
      ['帰結は would・could＋原形', 'If I had more time, I ___ help you.', ['could', 'can', 'will', 'am'], 'could', 'もっと時間があれば、あなたを手伝えるのに。', '事実とちがう想像の帰結は would / could＋動詞の原形にする。can・will は使わない。', [
        '事実とちがう想像の帰結なので、could＋原形にする。',
        'can は実際にできることを表すので、事実とちがう想像には使わない。',
        'will も実際に起こることを表すので、If＋過去形とはつり合わない。',
        'am のあとに動詞の原形 help を続けることはできない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_comparison',
    order: [
      ['The＋比較級, the＋比較級', 'The more you read, the wider your world becomes.', '読めば読むほど、世界は広がります。', '「〜すればするほど…」は The＋比較級 〜, the＋比較級 … の形にする。どちらにも the を付ける。'],
      ['比べるものをそろえる', 'The population of Tokyo is larger than that of Kyoto.', '東京の人口は京都の人口より多いです。', '人口どうしを比べるので、than の後ろは that of Kyoto として「京都の人口」を表す。'],
      ['2つのうちで〜なほう', 'Ken is the taller of the two brothers.', 'ケンは2人の兄弟のうち背が高いほうです。', '2つのうちで比べるときは the＋比較級＋of the two の形にする。最上級は使わない。'],
    ],
    usage: [
      ['setPhrase', '比較級を強めるのは much・far', 'This method is ___ more reliable than the old one.', ['far', 'very', 'so', 'too'], 'far', 'この方法は古い方法よりずっと信頼できます。', '比較級を「ずっと」と強めるのは much・far・even。very は原級を強める語で比較級には付けない。', [
        'far は比較級を強めて「ずっと〜」を表す。much・even も同じ働きをする。',
        'very は原級を強める語で、比較級 more reliable の前には置けない。',
        'so も原級を強める語で、比較級の前には置かない。',
        'too は「〜すぎる」で、than と組にして比べる文には合わない。',
      ]],
      ['setPhrase', 'だんだん〜は比較級 and 比較級', 'She felt less and ___ confident before the speech.', ['less', 'little', 'least', 'lesser'], 'less', '彼女はスピーチの前、だんだん自信がなくなっていきました。', '〈比較級 and 比較級〉で「だんだん〜」を表す。less and less と同じ比較級をくり返して置く。', [
        'less and less で「だんだん〜でなくなる」。同じ比較級をくり返す。',
        'little は原級で、and の後ろにも比較級を置く必要がある。',
        'least は最上級で、and でつないでくり返す形には合わない。',
        'lesser は「重要度が低い」などを表す別の語で、この形では使わない。',
      ]],
      ['confusable', '人口が多いは large', 'The population of this town is ___ than that of the village.', ['larger', 'longer', 'taller', 'heavier'], 'larger', 'この町の人口はその村の人口より多いです。', '人口の多さは large で表す。many や tall は人口には使わない。than と比べるので比較級 larger にする。', [
        '人口が多いことは large で表す。larger than 〜 で比べる。',
        'longer は長さを表す語で、人口には使わない。',
        'taller は背の高さを表す語で、人口には使わない。',
        'heavier は重さを表す語で、人口には使わない。',
      ]],
    ],
    choice: [
      ['両方に the を付ける', 'The earlier you leave, ___ sooner you will arrive.', ['the', 'a', 'more', 'so'], 'the', '早く出発すればするほど、早く着きます。', 'The＋比較級 〜, the＋比較級 … の形では、後半の比較級にも the を付ける。', [
        '後半の比較級にも the を付けて、the sooner とする。',
        'a sooner という言い方はしない。比較級には the を付ける。',
        'more sooner と重ねることはできない。sooner がすでに比較級。',
        'so sooner という言い方はない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_conj',
    order: [
      ['unless は「〜しない限り」', 'Unless you hurry, you will miss the bus.', '急がないとバスに乗り遅れますよ。', 'unless は if 〜 not と同じ意味なので、まとまりの中を否定にしない。'],
      ['as long as は「〜する限り」', 'You may stay here as long as you like.', '好きなだけここにいてかまいません。', 'as long as＋〈主語＋動詞〉で条件を表す。「〜する限りは」という意味になる。'],
      ['once は「いったん〜すると」', 'Once you start this game, you cannot stop.', 'いったんこのゲームを始めると、やめられません。', 'once＋〈主語＋動詞〉で「いったん〜すると」を表す。時・条件のまとまりなので中は現在形にする。'],
    ],
    usage: [
      ['confusable', 'unless の中は否定にしない', '___ you hurry, you will miss the train.', ['Unless', 'If not', 'Unless not', 'Without'], 'Unless', '急がないと電車に乗り遅れますよ。', 'unless は「〜しない限り」という打ち消しをすでにふくむので、中を否定にしない。', [
        'Unless＋〈主語＋動詞〉で「〜しない限り」を表す。中は否定にしない。',
        'If not のあとに〈主語＋動詞〉を続ける言い方はしない。If you do not hurry とする。',
        'Unless not とすると打ち消しが二重になってしまう。',
        'Without のあとには名詞を置く。〈主語＋動詞〉は続けられない。',
      ]],
      ['setPhrase', '万一に備えるのは in case', 'Take an umbrella ___ case it rains this evening.', ['in', 'on', 'at', 'for'], 'in', '今晩雨が降るといけないので、かさを持って行きなさい。', 'in case＋〈主語＋動詞〉で「〜するといけないから」と備えを表す決まった言い方になる。', [
        'in case＋〈主語＋動詞〉で「〜するといけないから」を表す。',
        'on case という結び付きはない。',
        'at case という結び付きはない。',
        'for case という結び付きはなく、備えを表せない。',
      ]],
      ['verbNoun', 'かさを持っていくは take an umbrella', 'Please ___ an umbrella with you today.', ['take', 'wear', 'put', 'hold'], 'take', '今日はかさを持っていってください。', 'take＋持ち物 で「〜を持っていく」。身に着ける wear と使い分ける。', [
        'take an umbrella で「かさを持っていく」。持って出かけることを take で表す。',
        'wear は服や帽子のように身に着ける物に使い、かさには使わない。',
        'put an umbrella では「かさを置く」となり、持っていく意味にならない。',
        'hold an umbrella は「かさを手に持っている」で、持って出かける意味にならない。',
      ]],
    ],
    choice: [
      ['as soon as の中は現在形', 'I will call you as soon as I ___ the work.', ['finish', 'will finish', 'finished', 'am finishing'], 'finish', '仕事を終えたらすぐに電話します。', '時を表すまとまりの中は、これから先のことでも will を使わず現在形 finish にする。', [
        '時を表すまとまりの中なので、未来のことでも現在形 finish にする。',
        '時を表すまとまりの中では will を使わない。',
        'finished は過去形で、これから仕事を終える場面に合わない。',
        'am finishing は今まさに進んでいる様子を表し、終わった時点を表せない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_correlative',
    order: [
      ['AもBもは both A and B', 'The course develops both reading and writing skills.', 'その講座は読む力と書く力の両方を伸ばします。', 'both A and B の A と B には同じ種類の語句を置く。ここでは reading と writing をそろえる。'],
      ['AもBも〜ないは neither A nor B', 'Neither the coach nor the players were satisfied.', '監督も選手たちも満足していませんでした。', 'neither A nor B で「AもBも〜ない」。動詞は近いほうの B（the players）に合わせる。'],
    ],
    usage: [
      ['setPhrase', 'AだけでなくBもは not only A but also B', 'She can play not only the piano ___ also the violin.', ['but', 'and', 'or', 'nor'], 'but', '彼女はピアノだけでなくバイオリンもひけます。', 'not only A but also B で「AだけでなくBも」。not only と組になるのは but also。', [
        'not only A but also B が1つのまとまりになる。and ではなく but を使う。',
        'not only 〜 and also という言い方はしない。',
        'or は「AかBか」を表し、not only とは組にならない。',
        'nor は neither と組にする語で、not only とは組にならない。',
      ]],
      ['verbNoun', 'チームを率いるは lead the team', 'Either you or Ken must ___ the group.', ['lead', 'take', 'make', 'do'], 'lead', 'あなたかケンのどちらかがそのグループを率いなければなりません。', 'lead the group で「グループを率いる」という決まった結び付きになる。', [
        'lead the group で「グループを率いる」。先頭に立って導くことを lead で表す。',
        'take the group では「グループを連れていく」となり、率いる意味にならない。',
        'make the group という結び付きはこの意味では使わない。',
        'do the group という結び付きはない。',
      ]],
      ['noun', '言語の名前に冠詞は付けない', 'My uncle can speak not only English but also ___.', ['French', 'a French', 'the French', 'Frenches'], 'French', 'おじは英語だけでなくフランス語も話せます。', '言語の名前は冠詞を付けずに使う。the French とすると「フランス人（全体）」を指す。', [
        '言語の名前は冠詞を付けずに French とする。',
        'a French という言い方はしない。',
        'the French は「フランス人全体」を指し、言語を表さない。',
        'Frenches という複数形はない。',
      ]],
    ],
    choice: [
      ['either A or B の動詞は B に合わせる', 'Either you or he ___ wrong.', ['is', 'are', 'am', 'be'], 'is', 'あなたか彼のどちらかがまちがっています。', 'either A or B が主語のときは、動詞を近いほうの B に合わせる。B は he なので is にする。', [
        '動詞は近いほうの he に合わせるので is を使う。',
        'are は複数の主語に使う形で、近いほうの he には合わない。',
        'am は主語が I のときの形で、he には合わない。',
        'be は原形で、文の動詞としてそのまま置くことはできない。',
      ]],
      ['A と B の形をそろえる', 'I like both ___ and writing stories.', ['reading', 'to read', 'read', 'reads'], 'reading', '私は本を読むことと物語を書くことの両方が好きです。', 'both A and B の A と B は同じ形にそろえる。B が writing なので A も動名詞 reading にする。', [
        'B が writing なので、A も動名詞 reading にそろえる。',
        'to read では B の writing と形がそろわない。',
        'read と原形にすると、B の動名詞とそろわない。',
        'reads は3人称単数のときの現在形で、この位置には置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_suchthat',
    order: [
      ['such a＋形容詞＋名詞＋that', 'It was such a cold night that we stayed home.', 'とても寒い夜だったので、私たちは家にいました。', '名詞をふくむときは such (a)＋形容詞＋名詞＋that の形にする。a は such のすぐ後ろに置く。'],
      ['so＋形容詞＋that', 'The movie was so long that I got tired.', 'その映画はとても長かったので、私は疲れてしまいました。', '形容詞だけを強めるときは so＋形容詞＋that の形にする。名詞をふくむときの such と使い分ける。'],
      ['so＋副詞＋that', 'He spoke so quickly that I could not follow him.', '彼はとても速く話したので、私はついていけませんでした。', 'so のあとには副詞も置ける。話す速さの程度を so quickly で表し、結果を that 以下に続ける。'],
    ],
    usage: [
      ['confusable', '名詞をふくむなら such', 'It was ___ an exciting game that nobody left early.', ['such', 'so', 'very', 'too'], 'such', 'とてもわくわくする試合だったので、だれも早くは帰りませんでした。', '後ろに〈a＋形容詞＋名詞〉が続くときは such を使う。so は形容詞・副詞だけに付ける。', [
        '後ろに an exciting game という名詞のまとまりがあるので such を使う。',
        'so のあとに〈a＋形容詞＋名詞〉はふつう続けない。名詞をふくむときは such を使う。',
        'very は that の文と組にして結果を表す働きを持たない。',
        'too は「〜すぎる」で、that の文とは組にならない。',
      ]],
      ['verbNoun', '中にいるは stay inside', 'It was such a hot afternoon that we ___ inside.', ['stayed', 'kept', 'held', 'sat'], 'stayed', 'とても暑い午後だったので、私たちは中にいました。', 'stay inside で「中にいる」。同じ場所にとどまることを stay で表す。過去の文なので stayed にする。', [
        'stay inside で「中にいる」。外へ出ずにとどまることを表す。',
        'keep inside という言い方はふつう使わない。',
        'hold inside という結び付きはない。',
        'sit inside は「中にすわる」で、外へ出ずに過ごした意味にならない。',
      ]],
      ['confusable', '話についていくは follow', 'She spoke so quickly that I could not ___ her.', ['follow', 'carry', 'hold', 'wear'], 'follow', '彼女はとても速く話したので、私はついていけませんでした。', 'follow＋人 で「話についていく・理解する」。あとを追う意味からきた使い方。', [
        'follow her で「彼女の話についていく」。話の流れを追うことを follow で表す。',
        'carry her は「彼女を運ぶ」で、話を理解する意味にならない。',
        'hold her は「彼女をつかむ」で、話を理解する意味にならない。',
        'wear her では意味が通らない。',
      ]],
    ],
    choice: [
      ['a の位置は such a', 'He was ___ honest man that everyone trusted him.', ['such an', 'a such', 'so an', 'such'], 'such an', '彼はとても正直な人だったので、みんな彼を信頼しました。', 'such a / an＋形容詞＋名詞 の順にする。honest は母音の音で始まるので such an とし、a を such の前に置かない。', [
        'such an＋形容詞＋名詞 の順にする。honest は h を読まず母音の音で始まるので an になる。',
        'a such という語順にはしない。a は such の後ろに置く。',
        'so an という形はない。名詞をふくむときは such を使う。',
        'such だけでは数えられる名詞1つを表せない。an を続ける。',
      ]],
      ['結果の so 〜 that と目的の so that', 'He spoke slowly ___ that I could follow him.', ['so', 'such', 'so quickly', 'too'], 'so', '私がついていけるように、彼はゆっくり話しました。', 'so that＋主語＋can / could は目的を表す。so＋形容詞＋that は結果を表すので、形で区別する。', [
        'so that＋主語＋could で「〜できるように」と目的を表す。',
        'such that はこの意味では使わない。目的は so that で表す。',
        'so quickly that 〜 では結果を表す形になり、ゆっくり話した理由と合わない。',
        'too that という結び付きはない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_quantity',
    order: [
      ['a few は「少しはある」', 'I have a few friends, so I am not lonely.', '友達が少しいるので、さびしくありません。', 'a few＋複数名詞で「少しはある」。a がない few は「ほとんどない」という否定の気持ちになる。'],
      ['little は「ほとんどない」', 'He has little money, so he cannot buy it.', '彼はお金がほとんどないので、それを買えません。', '数えられない名詞には little を使う。a がないので「ほとんどない」という意味になる。'],
      ['the number of は単数扱い', 'The number of students is increasing every year.', '生徒の数は毎年増えています。', 'the number of＋複数名詞は「〜の数」という1つのまとまりなので、動詞は単数に合わせる。'],
    ],
    usage: [
      ['confusable', '数えられない名詞には little', 'I have ___ money, so I cannot join the trip.', ['little', 'few', 'a few', 'many'], 'little', '私はお金がほとんどないので、その旅行に参加できません。', 'money は数えられない名詞なので little を使う。数えられる名詞には few を使う。', [
        'money は数えられない名詞なので、「ほとんどない」は little で表す。',
        'few は数えられる名詞に使う語で、money には合わない。',
        'a few も数えられる名詞に使ううえ、「少しはある」となり後ろの文と合わない。',
        'many も数えられる名詞に使う語で、money には合わない。',
      ]],
      ['confusable', 'a があれば「少しはある」', 'There is still ___ little water in the bottle.', ['a', 'the', 'few', 'some'], 'a', 'びんの中にはまだ少し水があります。', 'a little は「少しはある」、little は「ほとんどない」。a があるかないかで気持ちが変わる。', [
        'a little water で「少しは水がある」となり、still とも合う。',
        'the little water は「その少ない水」と決まった物を指す形で、ここでは合わない。',
        'few little という重ね方はしない。',
        'some little という言い方はこの形では使わない。',
      ]],
      ['noun', '助言は a piece of で数える', 'She gave me a ___ of advice.', ['piece', 'pair', 'glass', 'loaf'], 'piece', '彼女は私に1つ助言をくれました。', 'advice は数えられない名詞なので、a piece of advice のように数える。', [
        'a piece of advice で「1つの助言」。数えられない名詞は piece で数える。',
        'a pair of 〜 は2つで1組の物に使う。',
        'a glass of 〜 は冷たい飲み物に使う。',
        'a loaf of 〜 はパンのかたまりに使う。',
      ]],
    ],
    choice: [
      ['a number of は複数扱い', 'A number of students ___ joined the project.', ['have', 'has', 'is', 'was'], 'have', '多くの生徒がその企画に参加しました。', 'a number of＋複数名詞は「多くの〜」という意味で複数扱いなので have にする。the number of との違いに気をつける。', [
        'a number of students は「多くの生徒」で複数なので have を使う。',
        'has は単数の主語に使う形。the number of 〜（〜の数）なら has になる。',
        'is は単数の主語に使う形で、複数の students には合わない。',
        'was も単数の主語に使う形で、ここでは合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_pronoun',
    order: [
      ['2つのうち1つと残りは one と the other', 'One is white and the other is black.', '1匹は白くて、もう1匹は黒いです。', '2つのうち1つを one、残りの1つを the other で表す。残りが決まっているので the を付ける。'],
      ['the others は残り全部', 'Three students stayed and the others went home.', '3人の生徒が残り、ほかの生徒はみんな帰りました。', '残り全部を指すときは the others にする。特定しない「ほかの人たち」は others になる。'],
      ['each other は「お互い」', 'The students helped each other during the test.', '生徒たちはテスト中にお互いを助け合いました。', 'each other は「お互い」を表す1つのまとまり。動詞の目的語として置き、複数形にしない。'],
    ],
    usage: [
      ['confusable', '同じ種類の別の1つは one', 'Emi’s cap is too small. She wants a bigger ___.', ['one', 'it', 'other', 'another one'], 'one', 'エミの帽子は小さすぎます。彼女はもっと大きいのをほしがっています。', '同じ種類の別の1つは one で受ける。その物そのものを指すときは it を使う。', [
        '同じ種類の別の帽子を指すので one を使う。a bigger one となる。',
        'it は今持っている帽子そのものを指すので、「もっと大きいの」を表せない。',
        'a bigger other という言い方はしない。',
        'a bigger another one と重ねる言い方はしない。',
      ]],
      ['confusable', '2つのうち残りは the other', 'I have two cats. One is white and ___ is black.', ['the other', 'another', 'other', 'others'], 'the other', 'ネコを2匹飼っています。1匹は白で、もう1匹は黒です。', '2つのうち残りの1つは決まっているので the other にする。another は「もう1つ」で、残りが決まっていないときに使う。', [
        '2匹のうち残りの1匹は決まっているので the other を使う。',
        'another は3つ以上あるうちの「もう1つ」を表し、残りが決まっている場面には合わない。',
        'other 1語では主語になれない。the other か others にする。',
        'others は「ほかのいくつか」を表す複数形で、1匹を指すこの文には合わない。',
      ]],
      ['setPhrase', 'each other は複数形にしない', 'They talked to ___ in English.', ['each other', 'each others', 'themselves', 'the other'], 'each other', '彼らは英語でお互いに話しました。', 'each other は2語で1つのまとまり。others のように複数形にしない。', [
        'each other で「お互い」を表す。前置詞 to の後ろにそのまま置ける。',
        'each others という形はない。複数形にはしない。',
        'themselves は「自分自身に」となり、お互いに話し合った意味にならない。',
        'the other は「2つのうち残りの1つ」で、お互いという意味にはならない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_reflexive',
    order: [
      ['主語と同じ人は再帰代名詞', 'Aya introduced herself to the new students.', 'アヤは新入生に自己紹介しました。', '主語 Aya と目的語が同じ人なので、目的語を herself にする。her では別の人を指してしまう。'],
      ['自分でを強める再帰代名詞', 'She painted the whole wall herself.', '彼女は壁全体を自分でぬりました。', '文の終わりに再帰代名詞を置くと「自分で」と強める働きになる。省いても文は成り立つ。'],
      ['by oneself は「一人で」', 'My grandfather lives by himself in the country.', '祖父は田舎で一人暮らしをしています。', 'by oneself で「一人で・自分の力で」という決まった言い方になる。'],
    ],
    usage: [
      ['setPhrase', '楽しく過ごすは enjoy oneself', 'We enjoyed ___ at the summer festival.', ['ourselves', 'us', 'ourself', 'our'], 'ourselves', '私たちは夏祭りで楽しく過ごしました。', 'enjoy oneself で「楽しく過ごす」。主語 We に合わせて ourselves にする。', [
        '主語 We と同じ人を指すので ourselves にする。enjoy oneself で「楽しく過ごす」。',
        'us では自分たち以外の人を指すことになり、この決まった言い方にならない。',
        'ourself という形はない。複数の主語には ourselves を使う。',
        'our は名詞の前に置く形で、動詞の目的語にはならない。',
      ]],
      ['setPhrase', 'けがをするは hurt oneself', 'Be careful not to hurt ___ with the knife.', ['yourself', 'you', 'your', 'yours'], 'yourself', 'ナイフで手を切らないように気をつけて。', '主語と同じ人がけがをするので、目的語を再帰代名詞にする。相手1人なら yourself。', [
        '命令文の主語は you なので、目的語も yourself にする。',
        'hurt you では自分以外の人を傷つけることになってしまう。',
        'your は名詞の前に置く形で、動詞の目的語にはならない。',
        'yours は「あなたのもの」を表す語で、ここでは合わない。',
      ]],
      ['setPhrase', '自由に取っては help oneself to', 'Please help ___ to the fruit on the table.', ['yourself', 'you', 'yours', 'your own'], 'yourself', 'テーブルの上の果物を自由に取ってください。', 'help oneself to 〜 で「〜を自由に取って食べる」という決まった言い方になる。相手が1人なので yourself を置く。', [
        'help yourself to 〜 で「自由に取って食べる」。相手1人には yourself を使う。',
        'help you to 〜 では「あなたが〜するのを手伝う」という別の意味になる。',
        'yours は「あなたのもの」を表す語で、この決まった言い方には入らない。',
        'your own は「あなた自身の〜」と名詞に付ける形で、ここでは合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre2_prep',
    order: [
      ['despite のあとは名詞', 'Despite the cold weather, the festival continued.', '寒い天気にもかかわらず、祭りは続きました。', 'despite は前置詞なので後ろに名詞のまとまりを置く。〈主語＋動詞〉を続けるときは although を使う。'],
      ['during のあとは名詞', 'Nobody left the hall during the long speech.', '長い演説の間、だれもホールを出ませんでした。', 'during は前置詞なので後ろに名詞を置く。〈主語＋動詞〉を続けるときは while を使う。'],
      ['until は「〜までずっと」', 'Please wait here until I come back.', '私がもどるまでここで待っていてください。', 'until は「〜までずっと」を表し、後ろに〈主語＋動詞〉も名詞も置ける。期限を表す by と使い分ける。'],
    ],
    usage: [
    ],
  },
])
