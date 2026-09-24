// 単元別の並び替え・語法：英検2級（全26単元）。参考書の各ページで学ぶ形をそのまま問う。
import { unitFormats } from './build.js'

export const GRAMMAR_UNIT_FORMATS_2 = unitFormats('2', [
  {
    unit: 'gref_2_perfect',
    order: [
      ['未来完了は will have＋過去分詞', 'By next spring, I will have lived here for ten years.', '来年の春で、私はここに10年住んだことになります。', '未来のある時点までのつながりを表すので will have＋過去分詞にする。基準の時は by 〜 で示す。'],
      ['完了形の受動態は have been＋過去分詞', 'The old bridge has been repaired at last.', '古い橋がついに修理されました。', '完了形を受け身にするときは have / has been＋過去分詞にする。been を落とさない。'],
      ['by the time の中は現在形', 'I will have finished this task by the time you return.', 'あなたがもどるころには、私はこの作業を終えているでしょう。', '未来完了と組にする by the time のまとまりの中は、未来のことでも現在形にする。'],
    ],
    usage: [
      ['未来の基準には未来完了', 'By next month, she ___ here for five years.', ['will have worked', 'will work', 'has worked', 'worked'], 'will have worked', '来月で、彼女はここで5年働いたことになります。', '未来のある時点までの積み重ねを表すので、will have worked と will have＋過去分詞にする。', [
        '未来の基準 by next month までの積み重ねなので will have worked にする。',
        'will work はこれからすることを表すだけで、その時までの積み重ねを表せない。',
        'has worked は今までの積み重ねで、未来の基準には合わない。',
        'worked は過去のことを表し、未来の基準には合わない。',
      ]],
      ['受動態では been を落とさない', 'The safety checks have not ___ completed yet.', ['been', 'be', 'being', 'was'], 'been', '安全点検はまだ終わっていません。', '完了形の受動態は have been＋過去分詞。have と過去分詞の間に been を置く。', [
        'have not been completed で「まだ終えられていない」となる。been を落とさない。',
        'have be という形はない。have のあとには過去分詞を置く。',
        'have being という形もない。受動態の完了形は have been＋過去分詞。',
        'was は過去形で、have と重ねて使うことはできない。',
      ]],
      ['by the time の中は現在形', 'I will have finished the report by the time you ___ back.', ['come', 'will come', 'came', 'coming'], 'come', 'あなたがもどるころには、私は報告書を終えているでしょう。', '時を表す by the time のまとまりの中は、未来のことでも現在形 come にする。', [
        '時を表すまとまりの中なので、未来のことでも現在形 come にする。',
        '時を表すまとまりの中では will を使わない。',
        'came は過去形で、これからもどる場面に合わない。',
        'coming だけではまとまりの動詞にならない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_pastperfprog',
    order: [
      ['had been＋動詞ing', 'She had been reading for an hour when I came in.', '私が入って来たとき、彼女は1時間読み続けていました。', '過去のある時まで続いていた動作なので had been＋動詞ing にする。基準の時は when のまとまりで示す。'],
      ['before で基準の時を示す', 'He had been teaching there for six years before he retired.', '彼は退職する前、そこで6年間教え続けていました。', '退職した時点までの継続なので had been＋動詞ing にする。基準は before のまとまりで示す。'],
      ['天気にも使える', 'It had been snowing all night when we woke up.', '私たちが目をさましたとき、雪は一晩中降り続いていました。', '過去のある時まで降り続いていたことを表すので had been snowing にする。天気の文でも形は同じ。'],
    ],
    usage: [
      ['been のあとは動詞ing', 'Ken had been ___ for two hours when the power went out.', ['working', 'work', 'worked', 'works'], 'working', '停電したとき、ケンは2時間作業し続けていました。', '過去完了進行形は had been のあとに動詞ing を置き、had been working とする。', [
        'had been＋動詞ing の形なので working を置く。',
        'been のあとに動詞の原形 work は置けない。',
        'had been worked では「働かされてきた」と受け身の意味になる。',
        'works は3人称単数のときの現在形で、been のあとには置けない。',
      ]],
      ['状態を表す動詞は過去完了', 'I ___ him for years before we became partners.', ['had known', 'had been knowing', 'knew', 'was knowing'], 'had known', '私たちが組む前、私は彼を何年も前から知っていました。', 'know は状態を表す動詞なので進行形にせず、過去までの継続も had known と had＋過去分詞で表す。', [
        'know は状態を表す動詞なので、had known で過去までの継続を表す。',
        'know は状態を表す動詞なので、been knowing という進行形にはしない。',
        'knew はある時点の状態を表すだけで、それまでの継続を表せない。',
        'was knowing という進行形は使わない。know は状態を表す動詞。',
      ]],
      ['基準の時は過去形で示す', 'It had been snowing for hours when we finally ___ home.', ['got', 'get', 'have got', 'will get'], 'got', '私たちがようやく家に着いたとき、雪は何時間も降り続いていました。', '過去完了進行形の基準になる時は、when のまとまりの中で過去形 got で示す。', [
        '基準になる過去の時点なので、when のまとまりの中は過去形 got にする。',
        'get は現在形で、過去の場面を表すこの文には合わない。',
        'have got は今までのつながりを表す形で、過去の基準には合わない。',
        'will get はこれから先のことを表し、過去完了進行形とは合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_obligation',
    order: [
      ['be supposed to で決まりを表す', 'Guests are supposed to sign their names at the desk.', '来客は受付で名前を書くことになっています。', 'be supposed to＋動詞の原形で「〜することになっている」と決まりや予定を表す。'],
      ['be not supposed to は禁止', 'Students are not supposed to eat in the library.', '生徒は図書館で食べてはいけないことになっています。', 'be supposed to の否定は be動詞のすぐ後ろに not を置き、「〜してはいけないことになっている」を表す。'],
      ['助動詞と組むときは be able to', 'You will be able to swim well after this course.', 'この講座のあとには上手に泳げるようになるでしょう。', 'can は助動詞と重ねられないので、will のあとは be able to＋原形にする。'],
    ],
    usage: [
      ['supposed のあとに to を落とさない', 'Visitors are supposed ___ show their passes.', ['to', 'for', 'of', 'with'], 'to', '訪問者は通行証を見せることになっています。', 'be supposed to＋動詞の原形で1つのまとまり。supposed のあとの to を落とさない。', [
        'be supposed to＋原形で「〜することになっている」。to を落とさない。',
        'supposed for という結び付きはない。',
        'supposed of という結び付きはない。',
        'supposed with という結び付きはなく、決まりを表せない。',
      ]],
      ['許されていないは be not allowed to', 'You are not ___ to take photos in this hall.', ['allowed', 'supposed of', 'able', 'required'], 'allowed', 'このホールでは写真をとることは許されていません。', 'be allowed to＋原形で「〜してよい」。その否定で「〜してはいけない」を表す。', [
        'be not allowed to＋原形で「〜することを許されていない」を表す。',
        'supposed of という結び付きはない。be not supposed to なら使える。',
        'be not able to は「〜できない」で、許可の有無を表さない。',
        'be not required to は「〜する必要はない」で、禁止を表さない。',
      ]],
      ['will のあとは be able to', 'You will ___ swim across the river next year.', ['be able to', 'can', 'could', 'are able to'], 'be able to', '来年にはその川を泳いで渡れるようになるでしょう。', '助動詞は2つ重ねられないので、will のあとは be able to＋原形にする。', [
        'will のあとは原形なので be able to を置き、そのあとに原形 swim を続ける。',
        'will can と助動詞を2つ重ねることはできない。',
        'will could も助動詞を重ねた形で、使えない。',
        'will are という形はない。will のあとは原形 be にする。',
      ]],
    ],
  },
  {
    unit: 'gref_2_modalperf',
    order: [
      ['must have＋過去分詞で推量', 'He must have missed the last train.', '彼は終電に乗り遅れたにちがいありません。', '過去のことへの強い推量は must have＋過去分詞。must のあとは原形 have を置く。'],
      ['should have＋過去分詞で後悔', 'You should have told me about it earlier.', 'そのことをもっと早く私に言うべきだったのに。', 'should have＋過去分詞で「〜すべきだったのに（しなかった）」という後悔・非難を表す。'],
      ['cannot have＋過去分詞', 'She cannot have done it alone.', '彼女が一人でそれをしたはずがありません。', 'cannot have＋過去分詞で「〜したはずがない」と過去のことを強く打ち消す。'],
    ],
    usage: [
      ['助動詞のあとは原形 have', 'He ___ have forgotten our appointment.', ['may', 'may to', 'may has', 'may had'], 'may', '彼は私たちの約束を忘れたのかもしれません。', 'may have＋過去分詞で「〜したかもしれない」。助動詞のあとは原形 have を置く。', [
        'may have＋過去分詞で過去への推量を表す。助動詞のあとは原形 have。',
        '助動詞のあとに to は付けない。',
        'may has という形はない。助動詞のあとは原形 have にする。',
        'may had という形もない。助動詞のあとは原形 have にする。',
      ]],
      ['have のあとは過去分詞', 'You should have ___ me about the change.', ['told', 'tell', 'telling', 'tells'], 'told', 'その変更について私に言うべきだったのに。', 'should have のあとは過去分詞。tell の過去分詞は told。', [
        'should have＋過去分詞の形なので、tell の過去分詞 told を置く。',
        'have のあとに原形 tell は置けない。',
        'telling は ing 形で、have のあとには置けない。',
        'tells は3人称単数のときの現在形で、have のあとには置けない。',
      ]],
      ['する必要はなかったのに', 'You ___ have hurried; we had plenty of time.', ['need not', 'must not', 'cannot', 'should'], 'need not', '急ぐ必要はなかったのに。時間はたっぷりありました。', 'need not have＋過去分詞で「〜する必要はなかったのに（してしまった）」を表す。', [
        'need not have＋過去分詞で「〜する必要はなかったのに」を表す。',
        'must not have done という言い方はふつうしない。禁止は must not＋原形で表す。',
        'cannot have hurried は「急いだはずがない」となり、後ろの文と合わない。',
        'should have hurried は「急ぐべきだったのに」となり、時間があったという内容と合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_perfinf',
    order: [
      ['seem to have＋過去分詞', 'She seems to have lost her train ticket.', '彼女は電車の切符をなくしてしまったようです。', '文の動詞 seems より前に起きたことを表すので、to have＋過去分詞にする。'],
      ['be said to have＋過去分詞', 'She is believed to have written that letter.', '彼女がその手紙を書いたと信じられています。', '信じられている内容が前のことなので、to have＋過去分詞にする。'],
      ['I am sorry to have＋過去分詞', 'I am sorry to have troubled you so much.', 'たいへんご迷惑をおかけして申し訳ありません。', '謝っている今より前のことなので、to have＋過去分詞にして時の前後をはっきりさせる。'],
    ],
    usage: [
      ['to のあとは原形 have', 'He seems to ___ been ill last week.', ['have', 'has', 'had', 'having'], 'have', '彼は先週、病気だったようです。', '不定詞なので to のあとは原形 have を置く。to has・to had とはしない。', [
        'to のあとは原形なので have を置き、to have been とする。',
        'to has という形はない。to のあとはいつも原形。',
        'to had という形もない。to のあとはいつも原形。',
        'to having という形はこの文では使わない。',
      ]],
      ['前のことなら完了不定詞', 'The species appears ___ from the island long ago.', ['to have disappeared', 'to disappear', 'disappearing', 'to be disappeared'], 'to have disappeared', 'その種はずっと前にその島から姿を消したようです。', 'long ago のことは文の動詞 appears より前なので、to have disappeared と to have＋過去分詞にする。', [
        '文の動詞より前のことなので、to have disappeared とする。',
        'to disappear では今のことになり、long ago と合わない。',
        'disappearing だけでは appears のあとに続けられない。',
        'disappear は「消える」で受け身にしないので、to be disappeared とはしない。',
      ]],
      ['be said to have＋過去分詞', 'He is said ___ the book in his twenties.', ['to have written', 'to write', 'to have wrote', 'writing'], 'to have written', '彼は20代でその本を書いたと言われています。', 'be said to have＋過去分詞で「（以前に）〜したと言われている」を表す。ここは to have written とする。', [
        '書いたのは言われている今より前なので、to have written にする。',
        'to write では今のことになり、in his twenties と合わない。',
        'have のあとは過去分詞なので、wrote ではなく written にする。',
        'writing だけでは is said のあとに続けられない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_beto',
    order: [
      ['be to で公式の予定を表す', 'The mayor is to open the new library in May.', '市長は5月に新しい図書館を開くことになっています。', 'be動詞＋to＋動詞の原形で、決まっている公式の予定を表す。ニュースでよく使う言い方。'],
      ['be to で義務を表す', 'You are to finish this work by noon.', 'あなたは正午までにこの仕事を終えなければなりません。', 'be to＋原形は「〜しなければならない」という義務・命令も表す。'],
      ['be not to は禁止', 'No one is to enter this room without a pass.', '通行証なしにだれもこの部屋に入ってはいけません。', 'be to の否定は be動詞のあとに not を置き、「〜してはならない」という禁止を表す。'],
    ],
    usage: [
      ['be動詞のあとに to を置く', 'The board ___ announce the result on Monday.', ['is to', 'is', 'is going', 'is for'], 'is to', '理事会は月曜日に結果を発表することになっています。', 'be to＋動詞の原形で決まった予定を表す。be動詞のあとの to を落とさず is to とする。', [
        'is to＋原形で「〜することになっている」と決まった予定を表す。',
        'is announce という形はない。be動詞のあとに動詞の原形は続かない。',
        'is going announce という形はない。going のあとに to が必要。',
        'is for announce という形はない。for のあとに原形は続かない。',
      ]],
      ['to のあとは原形', 'You are to ___ this report by five.', ['submit', 'submitted', 'submitting', 'be submit'], 'submit', 'あなたは5時までにこの報告書を提出しなければなりません。', 'be to は2語で1つの助動詞のように働くので、そのあとの動詞はいつも原形 submit にする。', [
        'be to のあとは動詞の原形なので submit を置く。',
        'submitted は過去形・過去分詞で、to のあとには置けない。',
        'submitting は ing 形で、to のあとには置けない。',
        'be submit という形はない。',
      ]],
      ['be to の受動態', 'The meeting is to ___ on Monday morning.', ['be held', 'hold', 'be holding', 'held'], 'be held', '会議は月曜日の朝に開かれることになっています。', '会議は「開かれる」側なので、be to のあとを be held と be＋過去分詞にする。', [
        '会議は開かれる側なので、to のあとを be held と受け身にする。',
        'hold では「会議が開く」となり、意味が通らない。',
        'be holding では会議が自分で開いていることになってしまう。',
        'held だけでは to のあとに続けられない。be を入れる。',
      ]],
    ],
  },
  {
    unit: 'gref_2_causative',
    order: [
      ['have＋人＋原形', 'The teacher had us clean the science room.', '先生は私たちに理科室を掃除させました。', 'have＋人＋動詞の原形で「人に〜させる・してもらう」。to は付けない。'],
      ['get＋人＋to＋原形', 'I got my sister to check my English essay.', '私は姉に英作文を見てもらいました。', 'get のときだけ〈人＋to＋動詞の原形〉にする。have・make・let とは形がちがう。'],
      ['have＋物＋過去分詞', 'I had my watch fixed at the shop yesterday.', '私は昨日、店で腕時計を直してもらいました。', 'have＋物＋過去分詞で「物を〜してもらう」。腕時計は「直される」側なので過去分詞にする。'],
    ],
    usage: [
      ['have＋人のあとは原形', 'I had him ___ the report before the meeting.', ['check', 'to check', 'checking', 'checked'], 'check', '私は会議の前に彼に報告書を確認してもらいました。', 'have＋人＋動詞の原形の形。人が「する」側なので原形 check を置く。', [
        'have＋人＋原形の形なので check を置く。',
        'have him to check という形にはしない。to は付けない。',
        'have him checking という形はふつう使わない。原形にする。',
        'have him checked では「彼が調べられる」という意味になってしまう。',
      ]],
      ['get＋人のあとは to＋原形', 'We got Ken ___ the proposal again.', ['to revise', 'revise', 'revising', 'revised'], 'to revise', '私たちはケンに提案をもう一度見直してもらいました。', 'get のときは〈人＋to＋動詞の原形〉にして to revise とする。have との形のちがいに気をつける。', [
        'get＋人＋to＋原形の形なので to revise を置く。',
        'get Ken revise という形にはしない。get のときは to が必要。',
        'get Ken revising という形はふつう使わない。',
        'get Ken revised では「ケンが見直される」という意味になってしまう。',
      ]],
      ['被害を表す have＋物＋過去分詞', 'I had my bag ___ on the train yesterday.', ['stolen', 'steal', 'stealing', 'to steal'], 'stolen', '私は昨日、電車でかばんをぬすまれました。', 'have＋物＋過去分詞は「〜してもらう」だけでなく「〜される」という被害も表す。かばんは stolen と過去分詞にする。', [
        'かばんは「ぬすまれる」側なので過去分詞 stolen を置く。',
        'steal では「かばんがぬすむ」となり、意味が通らない。',
        'stealing でもかばんが行う側になってしまう。',
        'have＋物＋to do という形は使わない。物には過去分詞を置く。',
      ]],
    ],
  },
  {
    unit: 'gref_2_gerundidiom',
    order: [
      ['It is no use＋動詞ing', 'It is no use crying over the past.', '過ぎたことを嘆いてもむだです。', 'It is no use＋動詞ing で「〜してもむだだ」という決まった言い方になる。'],
      ['on＋動詞ing で「〜するとすぐに」', 'On arriving at the station, I called my mother.', '駅に着くとすぐ、私は母に電話しました。', 'on＋動詞ing で「〜するとすぐに」。前置詞 on のあとなので動名詞にする。'],
      ['be worth＋動詞ing', 'This old novel is worth reading twice.', 'この古い小説は二度読む価値があります。', 'be worth＋動詞ing で「〜する価値がある」。to＋原形は続けない。'],
    ],
    usage: [
      ['There is no＋動詞ing', 'There is no ___ that the plan has many risks.', ['denying', 'deny', 'to deny', 'denied'], 'denying', 'その計画に多くの危険があることは否定できません。', 'There is no＋動詞ing で「〜することはできない」という決まった言い方になる。ここは denying を置く。', [
        'There is no＋動詞ing の形なので denying を置く。',
        'There is no deny という形はない。動名詞にする。',
        'There is no to deny という形もない。',
        'denied は過去分詞で、この決まった言い方には入らない。',
      ]],
      ['動名詞の意味上の主語', 'Do you mind ___ opening the window?', ['my', 'me to', 'I', 'for me'], 'my', '私が窓を開けてもかまいませんか。', '動名詞の動作をする人を示すときは、所有格 my（または目的格）を動名詞の前に置く。', [
        '動名詞の前に所有格 my を置いて「私が開けること」を表す。',
        'mind me to open という形はない。mind のあとは動名詞にする。',
        'I は主語に使う形で、動名詞の前には置けない。',
        'for me は不定詞の動作主を示す形で、動名詞の前には置かない。',
      ]],
      ['worth のあとは動名詞', 'This museum is worth ___ at least once.', ['visiting', 'to visit', 'visit', 'visited'], 'visiting', 'この博物館は少なくとも一度は訪れる価値があります。', 'be worth＋動詞ing で「〜する価値がある」。ここは visiting とし、to＋原形は使わない。', [
        'be worth のあとは動名詞なので visiting を置く。',
        'worth to visit という形にはしない。',
        'worth visit と原形を置くこともできない。',
        'visited は過去分詞で、worth のあとには置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_partconst',
    order: [
      ['受け身の意味は過去分詞で始める', 'Seen from the hill, the town looks peaceful.', '丘から見ると、その町は平和に見えます。', '町は「見られる」側なので、分詞構文を過去分詞 Seen で始める。Being はふつう省く。'],
      ['否定は Not を分詞の前に', 'Not having enough time, we skipped the last item.', '時間が足りなかったので、私たちは最後の項目を省きました。', '分詞構文の否定は not を分詞の前に置く。having not の語順にはしない。'],
    ],
    usage: [
      ['受け身なら過去分詞で始める', '___ in easy English, the book is popular with students.', ['Written', 'Writing', 'To write', 'Write'], 'Written', 'やさしい英語で書かれているので、その本は学生に人気です。', '主語が動作を受ける側のときは、分詞構文を過去分詞で始める。本は「書かれる」側なので Written になる。', [
        '本は書かれる側なので、過去分詞 Written で始める。',
        'Writing では本が自分で書いていることになってしまう。',
        'To write は「書くために」となり、この文の流れに合わない。',
        'Write と原形で始めると命令文になってしまう。',
      ]],
      ['否定は Not＋分詞', '___ knowing the answer, he stayed quiet.', ['Not', 'No', 'Don’t', 'Never to'], 'Not', '答えを知らなかったので、彼は黙っていました。', '分詞構文を打ち消すときは、not を分詞のすぐ前に置く。knowing not の語順にはしない。', [
        '分詞の前に Not を置いて「〜しないので」を表す。',
        'No は名詞の前に置く語で、分詞を打ち消す働きはない。',
        'Don’t は命令文を打ち消す語で、分詞構文には使えない。',
        'Never to knowing という形はない。',
      ]],
      ['付帯状況の with＋名詞＋分詞', 'He listened to the radio with his eyes ___.', ['closed', 'closing', 'close', 'to close'], 'closed', '彼は目を閉じたままラジオを聞いていました。', 'with＋名詞＋分詞で「〜を…した状態で」。目は「閉じられる」側なので過去分詞 closed にする。', [
        '目は閉じられる側なので、過去分詞 closed を置く。',
        'closing では目が何かを閉じていることになってしまう。',
        'close は原形・形容詞で、この形には入らない。',
        'to close は「閉じるために」となり、状態を表さない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_what',
    order: [
      ['what 節が主語になる', 'What he said at the meeting surprised everyone.', '彼が会議で言ったことは、みんなを驚かせました。', 'What he said が「彼が言ったこと」という主語のまとまりになる。動詞は単数に合わせる。'],
      ['what 節が補語になる', 'What this town needs is a larger hospital.', 'この町が必要としているのは、もっと大きな病院です。', 'What this town needs を主語のまとまりにし、is のあとに答えを置く。'],
      ['what is called で「いわゆる」', 'He is what is called a born leader.', '彼はいわゆる生まれながらの指導者です。', 'what is called 〜 で「いわゆる〜」という決まった言い方になる。'],
    ],
    usage: [
      ['先行詞がなければ what', '___ he said at the meeting surprised us all.', ['What', 'That', 'Which', 'The thing what'], 'What', '彼が会議で言ったことは、私たち全員を驚かせました。', '先行詞がなく「〜したこと」をまとめて主語にするときは what を使う。', [
        '先行詞がないので、先行詞をふくむ what を使って主語のまとまりを作る。',
        'That he said 〜 では say の目的語が足りず、文として成り立たない。',
        'Which は前に先行詞が必要で、文の先頭には置けない。',
        'The thing what と重ねる言い方はしない。',
      ]],
      ['what 節の動詞は単数に合わせる', 'What we need now ___ more time.', ['is', 'are', 'were', 'have'], 'is', '私たちが今必要としているのは、もっと多くの時間です。', 'what 節は1つの事がらを表すので、続く動詞は単数に合わせて is にする。', [
        'What we need now は1つの事がらなので、動詞は is にする。',
        'are は複数の主語に使う形で、what 節には合わない。',
        'were も複数の主語に使う形で、今のことにも合わない。',
        'have は「持っている」を表す動詞で、ここでは主語と答えを結べない。',
      ]],
      ['AとBの関係は A is to B what C is to D', 'Exercise is to the body ___ study is to the mind.', ['what', 'that', 'as', 'which'], 'what', '運動と体の関係は、勉強と心の関係と同じです。', 'A is to B what C is to D で「AのBに対する関係は、CのDに対する関係と同じ」を表す。', [
        'A is to B what C is to D は決まった言い方で、what を使う。',
        'that ではこの決まった言い方にならない。',
        'as を使うと別の形になり、この決まった言い方にはならない。',
        'which は前に先行詞が必要で、この形には入らない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_whose',
    order: [
      ['whose＋名詞で持ち主を表す', 'I met a man whose car was stolen last night.', '私は昨夜、車をぬすまれた男性に会いました。', 'whose＋名詞で「その人の〜」を表す。whose のあとに冠詞のない名詞を続ける。'],
      ['物にも whose を使える', 'We visited a school whose gym was built last year.', '私たちは、体育館が昨年建てられた学校を訪ねました。', 'whose は物にも使える。whose gym で「その学校の体育館」を表す。'],
      ['whose のあとに冠詞は置かない', 'He is a painter whose works hang in this museum.', '彼は作品がこの美術館にかかっている画家です。', 'whose のすぐ後ろには冠詞を付けずに名詞を置く。whose the works とはしない。'],
    ],
    usage: [
      ['後ろに名詞があれば whose', 'I met a man ___ car was stolen last week.', ['whose', 'who', 'which', 'whom'], 'whose', '私は先週、車をぬすまれた男性に会いました。', 'whose のあとには名詞が続き、「その人の〜」という持ち主の関係を表す。', [
        '後ろに名詞 car が続き、「その男性の車」という関係になるので whose を使う。',
        'who のあとには動詞が続く。名詞が続くこの文には合わない。',
        'which のあとにも名詞だけを続けることはできない。',
        'whom は目的格で、後ろに名詞を続ける形にはならない。',
      ]],
      ['whose のあとに冠詞は置かない', 'She is a writer whose ___ are popular in Asia.', ['novels', 'the novels', 'a novels', 'novel’s'], 'novels', '彼女は小説がアジアで人気のある作家です。', 'whose 自体が「その人の」を表すので、後ろの名詞 novels に the や a を付けない。', [
        'whose novels で「その作家の小説」。冠詞は付けない。',
        'whose the novels とは言わない。whose がすでに「その人の」を表す。',
        'a novels は冠詞と複数形が合わず、形として成り立たない。',
        'novel’s は「小説の」を表す形で、主語としてそのまま置けない。',
      ]],
      ['人にも物にも使える whose', 'We met an engineer ___ design won the prize.', ['whose', 'which', 'that', 'what'], 'whose', '私たちは、設計が賞をとった技術者に会いました。', 'whose は先行詞が人でも物でも使える。後ろに名詞が続くのが目印になる。', [
        '後ろに名詞 design が続くので whose を使う。',
        'which のあとに名詞だけを続けることはできない。',
        'that のあとにも名詞だけを続けることはできない。',
        'what は先行詞をふくむ語なので、an engineer のあとには置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_relapp',
    order: [
      ['数量＋of whom', 'She has two daughters, both of whom are nurses.', '彼女には娘が2人いて、2人とも看護師です。', 'of の後ろで人を受けるので whom を使う。both of whom で1つの文としてつながる。'],
      ['数量＋of which', 'They offered four routes, none of which was safe.', '彼らは4つの道を示しましたが、どれも安全ではありませんでした。', '物を受けるので of which を使う。none of which は単数として扱い、動詞は was になる。'],
      ['most of whom で多数を表す', 'The club has forty members, most of whom are students.', 'その部には40人の部員がいて、そのほとんどは学生です。', 'most of whom で「そのほとんどの人」を表し、前の文に説明を付け足す。'],
    ],
    usage: [
      ['them ではなく whom', 'Twelve teachers attended, four of ___ were from abroad.', ['whom', 'them', 'who', 'they'], 'whom', '12人の教師が出席し、そのうち4人は海外から来ていました。', 'コンマだけで文を2つつなぐことはできないので、them ではなく関係代名詞 whom を使う。', [
        'of の後ろで人を受けるので whom を使い、1つの文の中でつなぐ。',
        'them を使うと、つなぐ語のないまま文が2つ並んでしまう。',
        '前置詞 of の後ろに who は置けない。目的格の whom にする。',
        'they は主語に使う形で、of の後ろには置けない。',
      ]],
      ['物なら of which', 'She bought five books, two of ___ were about science.', ['which', 'them', 'whom', 'what'], 'which', '彼女は5冊の本を買い、そのうち2冊は科学についての本でした。', '物を受けるときは of which を使う。人を受ける of whom と使い分ける。', [
        '先行詞が本なので、of の後ろは which を使う。',
        'them を使うと、つなぐ語のないまま文が2つ並んでしまう。',
        'whom は人を受ける語で、books には使えない。',
        'what は先行詞をふくむ語なので、この形には入らない。',
      ]],
      ['none of which は単数扱い', 'We reviewed three plans, none of which ___ realistic.', ['was', 'were', 'are', 'have been'], 'was', '私たちは3つの計画を検討しましたが、どれも現実的ではありませんでした。', 'none of 〜 は「どれも〜ない」を表し、かたい書き言葉では単数として扱うので was にする。', [
        'none of which は単数として扱うので、was を使う。',
        'were は複数の主語に使う形で、かたい書き言葉の none には合わない。',
        'are は今のことを表す形で、過去の場面には合わない。',
        'have been も今までのつながりを表す形で、過去の場面には合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_subjunctive',
    order: [
      ['as if＋過去形', 'He acts as if he were the manager here.', '彼はまるでここの責任者であるかのようにふるまいます。', 'as if のあとを過去形にすると「まるで〜かのように」と事実とちがうことを表す。be動詞は were にする。'],
      ['It’s time＋過去形', 'It is time you went to bed.', 'もう寝る時間ですよ。', 'It is time のあとを過去形にすると「もう〜してよいころだ」という意味になる。'],
      ['But for＋名詞', 'But for her advice, we would have lost our way.', '彼女の助言がなかったら、私たちは道に迷っていたでしょう。', 'But for＋名詞で「〜がなかったら」を表し、後ろを would have＋過去分詞にする。'],
    ],
    usage: [
      ['I wish のあとの be動詞は were', 'I wish I ___ taller than my brother.', ['were', 'am', 'will be', 'have been'], 'were', '兄より背が高ければいいのに。', 'I wish のあとは今の事実とちがう想像なので、be動詞は主語に関係なく were にする。', [
        'I wish のあとは事実とちがう想像なので、be動詞は were にする。',
        'am と現在形にすると、事実とちがう想像を表す形にならない。',
        'will be はこれから先のことを表し、I wish のあとには置かない。',
        'have been は今までのつながりを表す形で、この想像には合わない。',
      ]],
      ['〜がなければは Without', '___ water, we could not live even a week.', ['Without', 'But', 'Except', 'Unless'], 'Without', '水がなければ、私たちは1週間も生きられないでしょう。', 'Without＋名詞で「〜がなければ」を表し、後ろを would / could＋原形にする。', [
        'Without＋名詞で「〜がなければ」を表す。But for に言いかえられる。',
        'But 1語では名詞を続けられない。But for の形にする。',
        'Except は「〜を除いて」で、仮定の条件を表さない。',
        'Unless のあとには〈主語＋動詞〉を置く。名詞だけは続けられない。',
      ]],
      ['万一のときは should', 'If you ___ change your mind, please let me know.', ['should', 'would', 'could', 'might'], 'should', '万一考えが変わったら、知らせてください。', 'If＋主語＋should＋原形で「万一〜なら」と、起こりにくいことを表す。', [
        'If 〜 should＋原形で「万一〜なら」を表す。',
        'If 〜 would という形はふつう使わない。',
        'If 〜 could では「できるなら」となり、万一という意味にならない。',
        'If 〜 might という形もふつう使わない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_subjpastperf',
    order: [
      ['If＋had＋過去分詞', 'If he had set off earlier, he would have caught the ferry.', 'もっと早く出発していたら、彼は船に間に合ったのに。', '過去の事実とちがう想像なので、If の中を had＋過去分詞、後ろを would have＋過去分詞にする。'],
      ['if を省くと倒置', 'Had we known about the storm, we would have stayed.', '嵐のことを知っていたら、私たちはとどまっていたのに。', 'if を省くと Had＋主語＋過去分詞 という語順になる。意味は If we had known 〜 と同じ。'],
    ],
    usage: [
      ['過去の想像は had＋過去分詞', 'If I ___ the schedule, I would have arrived on time.', ['had known', 'knew', 'have known', 'would know'], 'had known', '予定を知っていたら、私は時間どおりに着いたのに。', '過去の事実とちがう想像では、If の中を had known と had＋過去分詞にする。', [
        '過去の事実とちがう想像なので、If の中は had known にする。',
        'knew は今の事実とちがう想像に使う形で、would have acted とつり合わない。',
        'have known は今までのつながりを表す形で、この想像には合わない。',
        'If の中に would は置かない。',
      ]],
      ['帰結は would have＋過去分詞', 'If we had left earlier, we ___ the last bus.', ['would have caught', 'would catch', 'will catch', 'had caught'], 'would have caught', 'もっと早く出ていたら、私たちは最終バスに間に合ったのに。', '過去の事実とちがう想像の帰結は、would have caught と would have＋過去分詞にする。', [
        '過去の想像の帰結なので would have caught にする。',
        'would catch は今の事実とちがう想像の帰結で、had left とつり合わない。',
        'will catch は実際に起こることを表し、この想像には合わない。',
        'had caught は事実を述べる形で、想像の帰結にはならない。',
      ]],
      ['I wish＋had＋過去分詞', 'I wish I ___ harder for the exam.', ['had studied', 'studied', 'have studied', 'would study'], 'had studied', '試験のためにもっと勉強しておけばよかった。', 'I wish のあとを had studied と had＋過去分詞にすると「（過去に）〜だったらよかったのに」を表す。', [
        '過去のことを悔やんでいるので、had studied にする。',
        'studied は今の事実とちがう想像に使う形で、過去への後悔を表さない。',
        'have studied は今までのつながりを表す形で、I wish のあとには置かない。',
        'would study はこれからのことを表し、過去への後悔にならない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_nounclause',
    order: [
      ['whether 節が主語になる', 'Whether the new rule will work remains unclear.', '新しい規則がうまくいくかどうかは、はっきりしないままです。', 'whether のまとまりが主語になる。主語の位置では if を使わず whether にする。'],
      ['that 節を it で受ける', 'It is certain that he is honest.', '彼が正直なことは確かです。', '長い that 節を後ろに回し、主語の位置に形式主語 It を置く。'],
      ['疑問詞の名詞節が補語になる', 'The question is how we should measure progress.', '問題は、進み具合をどう測るかということです。', '疑問詞のまとまりが is のあとの補語になる。中は〈疑問詞＋主語＋動詞〉の順にする。'],
    ],
    usage: [
      ['主語の位置は whether', '___ the project will continue remains undecided.', ['Whether', 'If', 'That', 'What'], 'Whether', 'その事業が続くかどうかは、まだ決まっていません。', '「〜かどうか」のまとまりを主語にするときは、if ではなく whether を使う。', [
        '主語の位置では whether を使い、「〜かどうか」を表す。',
        'if は「〜かどうか」を表せるが、主語の位置には置けない。',
        'That では「〜ということ」となり、不確かさを表せない。',
        'What は先行詞をふくむ語で、後ろの文がそろっているこの文には合わない。',
      ]],
      ['前置詞のあとも whether', 'We talked about ___ we should postpone the event.', ['whether', 'if', 'that', 'what'], 'whether', '私たちはその行事を延期すべきかどうか話し合いました。', '前置詞の後ろで「〜かどうか」を表すときは whether を使う。if は置けない。', [
        '前置詞 about の後ろでは whether を使う。',
        'if は前置詞の後ろには置けない。',
        'that は「〜ということ」を表し、不確かさを表せない。',
        'what は後ろの文に足りない部分があるときに使う。ここではそろっている。',
      ]],
      ['名詞節の中は疑問文の語順にしない', 'I know ___ at the meeting.', ['what he said', 'what did he say', 'what said he', 'that he said'], 'what he said', '私は彼が会議で言ったことを知っています。', '疑問詞で始まる名詞節の中は〈疑問詞＋主語＋動詞〉の順にして what he said とする。did は使わない。', [
        '疑問詞のあとを〈主語＋動詞〉にして what he said とする。',
        'what did he say は疑問文の語順で、名詞節では使わない。',
        'what said he という語順はない。',
        'that he said では say の目的語が足りず、文として成り立たない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_formalobj',
    order: [
      ['find it＋補語＋to …', 'Many students find it difficult to evaluate online sources.', '多くの学生は、ネット上の情報を見きわめるのが難しいと感じています。', '本当の目的語 to＋原形が長いので、目的語の位置に it を置いて後ろに回す。'],
      ['〜することにしているは make it a rule to', 'I make it a rule to walk for thirty minutes every day.', '私は毎日30分歩くことにしています。', 'make it a rule to＋原形で「〜することにしている」という決まった言い方になる。'],
    ],
    usage: [
      ['形式目的語の it を落とさない', 'I found ___ hard to follow his explanation.', ['it', 'that', 'this', 'what'], 'it', '彼の説明はついていきにくいと思いました。', 'SVOC の目的語が to＋原形で長いときは、目的語の位置に it を置いて後ろに回す。', [
        '目的語の位置に it を置き、本当の目的語 to follow 〜 を後ろに回す。',
        'that を目的語の位置に置くことはできない。',
        'this を置くと「これ」と別の物を指すことになり、後ろの to 〜 とつながらない。',
        'what は先行詞をふくむ語で、この位置には置けない。',
      ]],
      ['〜しやすくするは make it easy to', 'The new map made ___ easy to find the entrance.', ['it', 'that', 'them', 'this'], 'it', '新しい地図のおかげで、入口を見つけるのが簡単になりました。', 'make＋it＋補語＋to＋原形で「〜するのを…にする」。it が後ろの to 〜 を指す。', [
        'it を目的語の位置に置き、後ろの to find 〜 を指させる。',
        'that を目的語の位置に置いて後ろの to 〜 を指すことはできない。',
        'them では複数の何かを指すことになり、後ろの to 〜 とつながらない。',
        'this も別の物を指すことになり、後ろの to 〜 を受けられない。',
      ]],
      ['当然と思うは take it for granted that', 'We took ___ for granted that the train would be on time.', ['it', 'that', 'this', 'them'], 'it', '私たちは電車が時間どおりだと当然のように思っていました。', 'take it for granted that 〜 で「〜を当然のことと思う」という決まった言い方になる。', [
        'take it for granted that 〜 は決まった言い方で、it を置く。',
        'take that for granted that 〜 とは言わない。',
        'this を置くとこの決まった言い方にならない。',
        'them を置くと複数の何かを指すことになり、後ろの that 節を受けられない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_inanimate',
    order: [
      ['prevent＋人＋from＋動詞ing', 'The heavy snow prevented us from leaving the village.', '大雪のせいで、私たちはその村を出られませんでした。', '原因となる物を主語にし、prevent＋人＋from＋動詞ing で「〜のせいで…できない」を表す。'],
      ['enable＋人＋to＋原形', 'This map will enable you to find the shortest route.', 'この地図を使えば、いちばん短い道を見つけられます。', 'enable＋人＋to＋動詞の原形で「〜のおかげで…できる」を表す。'],
      ['remind＋人＋of＋名詞', 'This picture reminds me of my childhood.', 'この写真を見ると、私は子どものころを思い出します。', 'remind＋人＋of＋名詞で「〜に…を思い出させる」。物を主語にして訳は「〜を見ると思い出す」とする。'],
    ],
    usage: [
      ['enable のあとは to＋原形', 'The new system will enable the staff ___ the data quickly.', ['to check', 'checking', 'check', 'for checking'], 'to check', '新しい仕組みのおかげで、職員はすばやくデータを確認できるようになります。', 'enable＋人＋to＋動詞の原形の形にして to check とする。動名詞は続けない。', [
        'enable＋人＋to＋原形の形なので to check を置く。',
        'enable the staff checking という形はない。',
        'enable the staff check と原形だけを置くこともできない。',
        'for checking という形はこの動詞では使わない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_speech',
    order: [
      ['tell＋人＋that 節', 'He told me that he was tired that day.', '彼はその日は疲れていると私に言いました。', 'tell は〈人＋内容〉の順に置く。伝える側に合わせて時制を1つ前にずらす。'],
      ['ask＋人＋if 節', 'She asked me if I was free the next day.', '彼女は私に翌日ひまかどうかたずねました。', 'Yes / No でたずねた内容は ask＋人＋if / whether＋〈主語＋動詞〉で伝える。'],
      ['tell＋人＋to＋原形', 'The teacher told us to be quiet in the library.', '先生は私たちに図書館では静かにするように言いました。', '命令の内容を伝えるときは tell＋人＋to＋動詞の原形にする。'],
    ],
    usage: [
      ['人を続けるのは tell', 'He ___ me that he was tired.', ['told', 'said', 'spoke', 'talked'], 'told', '彼は疲れていると私に言いました。', 'tell は後ろに人を直接置けるので told me とする。say は人を直接置けず、said to me とする必要がある。', [
        'tell＋人＋that 節 の形なので told を置く。',
        'said me という形にはしない。say を使うなら said to me とする。',
        'spoke me という形はない。speak は spoke to me とする。',
        'talked me という形もない。talk は talked to me とする。',
      ]],
      ['たずねた内容は if でつなぐ', 'She asked me ___ I was free on Sunday.', ['if', 'that', 'what', 'which'], 'if', '彼女は私に日曜日はひまかどうかたずねました。', 'Yes / No でたずねた内容を伝えるときは if または whether でつなぐ。that は使わない。', [
        'ask＋人＋if 〜 で「〜かどうかたずねる」を表す。',
        'that は「〜ということ」を表し、たずねた内容をつなぐ形にはならない。',
        'what は後ろの文に足りない部分があるときに使う。ここではそろっている。',
        'which も後ろに足りない部分が必要で、この文には合わない。',
      ]],
      ['伝えるときは時制を1つ前に', 'She said that she ___ tired then.', ['was', 'is', 'will be', 'has been'], 'was', '彼女はそのとき疲れていると言いました。', '間接話法では、伝える側の時に合わせて中の動詞を1つ前にずらし was にする。', [
        '文の動詞 said が過去なので、中の動詞も過去形 was にする。',
        'is は今のことを表す形で、said とは時が合わない。',
        'will be はこれから先のことを表し、then とも合わない。',
        'has been は今までのつながりを表す形で、said とは時が合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_emphasis',
    order: [
      ['do＋原形で動詞を強める', 'I did lock the door this morning.', '私は今朝確かにドアにかぎをかけました。', '動詞を強めるときは do / does / did＋動詞の原形にする。did のあとは原形 lock にする。'],
      ['the very＋名詞', 'This is the very reason I opposed the plan.', 'これこそ私がその計画に反対した理由です。', 'the very＋名詞で「まさにその〜」と名詞を強める。the と名詞の間に very を置く。'],
      ['名詞＋itself で強める', 'The idea itself is good enough.', 'その考え自体は十分によいものです。', '名詞のすぐ後ろに itself を置くと「それ自体」と名詞を強められる。'],
    ],
    usage: [
      ['did のあとは原形', 'I did ___ someone leave the building.', ['see', 'saw', 'seen', 'seeing'], 'see', '私は確かにだれかが建物を出るのを見ました。', 'did＋動詞の原形で動詞を強める。did がすでに過去を表すので、動詞は原形 see にする。', [
        'did が過去を表すので、後ろの動詞は原形 see にする。',
        'did saw と過去形を重ねることはできない。',
        'seen は過去分詞で、did のあとには置けない。',
        'seeing は ing 形で、did のあとには置けない。',
      ]],
      ['名詞を強めるのは the very', 'This is the ___ book I have been looking for.', ['very', 'much', 'more', 'so'], 'very', 'これこそ私がずっと探していた本です。', 'the very＋名詞で「まさにその〜」と名詞を強める。much や more では名詞を強められない。', [
        'the very＋名詞で「まさにその〜」と名詞を強める。',
        'the much book という言い方はない。much は数えられない名詞の量に使う。',
        'the more book という言い方もない。more は比較級を作る語。',
        'the so book という言い方はない。so は形容詞・副詞を強める語。',
      ]],
      ['主語を強める再帰代名詞', 'The president ___ answered the letter.', ['himself', 'him', 'his own', 'by him'], 'himself', '社長自身がその手紙に返事を書きました。', '主語のすぐ後ろに再帰代名詞 himself を置くと「〜自身が」と主語を強められる。', [
        '主語 The president を強めるので himself を置く。',
        'him は目的格で、主語を強める働きはない。',
        'his own は名詞の前に置いて「彼自身の〜」を表す形で、ここでは合わない。',
        'by him は「彼によって」を表し、主語を強める形にはならない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_cleft',
    order: [
      ['It is 〜 that … で強める', 'It was in Paris that I first met her.', '私が初めて彼女に会ったのはパリでした。', '強めたい語句を It was と that の間にはさむ。場所を強めても where ではなく that を使う。'],
      ['疑問詞を強める形', 'What was it that caused the delay?', 'その遅れを引き起こしたのはいったい何ですか。', '疑問詞を強めるときは〈疑問詞＋is / was it that 〜?〉の語順にする。that のあとに残りの文を続ける。'],
    ],
    usage: [
      ['強調構文では that を使う', 'It was in Kyoto ___ I met my old friend.', ['that', 'where', 'which', 'when'], 'that', '私が旧友に会ったのは京都でした。', '強調構文では、強める語句が場所でも時でも that を使う。where や when は使わない。', [
        '強調構文は It is / was 〜 that … の形なので、that を使う。',
        '強調構文では、強めるのが場所でも where は使わない。',
        'which は名詞を説明する語で、in Kyoto という語句を受けることはできない。',
        '強調構文では、強めるのが時でも when は使わない。',
      ]],
      ['強調構文と形式主語を見分ける', 'It was the last email ___ changed their plan.', ['that', 'what', 'who', 'whose'], 'that', '彼らの計画を変えたのは、その最後のメールでした。', 'It is と that を取ってもとの文が成り立てば強調構文。強める語句が物なので that を使う。', [
        'It was と that を取ると The last email changed their plan. に戻る強調構文。',
        'what は先行詞をふくむ語で、前に the last email があるこの文には置けない。',
        'who は人を受ける語で、email には使えない。',
        'whose は後ろに名詞を続けて持ち主を表す語で、ここでは合わない。',
      ]],
      ['疑問詞の強調の語順', '___ was it that broke the window?', ['Who', 'Whose', 'Whom', 'What who'], 'Who', '窓を割ったのはいったいだれですか。', '疑問詞を強めるときは、疑問詞 Who を先頭に出して〈疑問詞＋was it that 〜?〉の語順にする。', [
        '人をたずねて強めるので、Who を先頭に置いて Who was it that 〜? とする。',
        'Whose のあとには名詞が必要で、この形には合わない。',
        'Whom は目的格で、broke の主語をたずねるこの文には合わない。',
        'What who という並べ方はない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_inversion',
    order: [
      ['So＋助動詞＋主語', 'My sister enjoys classical music, and so does my father.', '姉はクラシック音楽を楽しんでおり、父もそうです。', 'So＋助動詞＋主語 で「〜もそうだ」を表す。前の文が一般動詞なので does を使う。'],
      ['Only then＋助動詞＋主語', 'Only later did the team notice the mistake.', 'あとになって初めて、チームはその誤りに気づきました。', 'only をふくむ語句を前に出すと、後ろが〈助動詞＋主語＋動詞〉の順になる。'],
    ],
    usage: [
      ['Never を前に出すと倒置', 'Never ___ seen such a beautiful garden.', ['have I', 'I have', 'did I have', 'I did'], 'have I', 'こんなに美しい庭は見たことがありません。', '否定の語句を文の先頭に出すと、後ろが〈助動詞＋主語〉の順になり have I とする。', [
        'Never を前に出したので、後ろを have I と倒置させる。',
        'Never I have という語順にはしない。否定の語句を前に出したら倒置する。',
        'did I have seen という形はない。完了形は have＋過去分詞で表す。',
        'I did のあとに seen は続けられない。',
      ]],
      ['否定に合わせるのは Neither', 'I cannot swim. — ___ can I.', ['Neither', 'So', 'Either', 'Also'], 'Neither', '私は泳げません。— 私もです。', '否定の内容に「私もそうだ」と合わせるときは Neither＋助動詞＋主語 にする。', [
        '前が否定の内容なので、Neither can I. で「私もできない」を表す。',
        'So can I. は「私もできる」となり、前の否定と合わない。',
        'Either は単独で文の先頭に置いて同意を表すことはできない。',
        'Also can I という語順はない。',
      ]],
      ['Only then のあとは助動詞＋主語', 'Only then ___ I realize my mistake.', ['did', 'do', 'was', 'had'], 'did', 'そのときになって初めて、私は自分の誤りに気づきました。', 'Only then を前に出したので、後ろを〈did＋主語＋動詞の原形〉にする。', [
        '過去のことなので did を置き、そのあとを〈主語＋原形〉にする。',
        'do は現在のことを表す形で、過去の場面には合わない。',
        'was のあとに動詞の原形 realize は続けられない。',
        'had のあとには過去分詞が必要で、原形 realize は続けられない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_partialneg',
    order: [
      ['not always で部分否定', 'Famous restaurants are not always better than small ones.', '有名な店が小さな店より必ずよいとは限りません。', 'not always で「いつも〜とは限らない」という部分否定になる。全部を打ち消すわけではない。'],
      ['Not everyone で部分否定', 'Not every student agreed with the new rule.', 'すべての生徒が新しい規則に賛成したわけではありません。', 'not と every を組にすると「すべての〜が…というわけではない」という部分否定になる。'],
      ['必ずしも〜ないは not necessarily', 'A high score does not necessarily indicate deep understanding.', '高い点数が必ずしも深い理解を示すとは限りません。', 'not necessarily で「必ずしも〜とは限らない」という部分否定を表す。'],
    ],
    usage: [
      ['全部ではないは not all', '___ all of them agreed with the plan.', ['Not', 'No', 'None', 'Never'], 'Not', '彼ら全員がその計画に賛成したわけではありません。', 'not all で「全部が〜というわけではない」という部分否定になる。no・none は全部を打ち消す。', [
        'Not all of them で「全員が〜というわけではない」という部分否定になる。',
        'No all という言い方はない。No は名詞の前に直接置く。',
        'None of them agreed. なら「だれも賛成しなかった」という全否定になる。',
        'Never all という言い方はない。',
      ]],
      ['全員が〜ないは None', '___ of them agreed with the plan.', ['None', 'Not', 'No', 'Neither'], 'None', '彼らのだれもその計画に賛成しませんでした。', 'none of 〜 で「〜のだれも…ない」という全否定を表す。部分否定の not all と区別する。', [
        'None of them で「だれも〜ない」という全否定になる。',
        'Not of them という言い方はない。',
        'No of them という言い方もない。No は名詞の前に直接置く。',
        'Neither は2人・2つのときに使う語で、3人以上には none を使う。',
      ]],
      ['必ずしも〜ないは not necessarily', 'A high score does not ___ mean deep understanding.', ['necessarily', 'necessary', 'need', 'necessity'], 'necessarily', '高い点数が必ずしも深い理解を意味するとは限りません。', 'not necessarily＋動詞で「必ずしも〜とは限らない」を表す。necessarily は副詞。', [
        'necessarily は副詞で、not と組にして部分否定を作る。',
        'necessary は形容詞で、動詞 mean の前には置けない。',
        'need は動詞や助動詞で、この位置に置くと意味が通らない。',
        'necessity は名詞で、動詞の前には置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_conj',
    order: [
      ['in case で備えを表す', 'Take an umbrella in case it rains this afternoon.', '午後に雨が降るといけないので、かさを持っていきなさい。', 'in case＋〈主語＋動詞〉で「〜するといけないから」と備えを表す。中は未来のことでも現在形にする。'],
      ['now that で理由を表す', 'Now that you are here, let us begin the meeting.', 'あなたが来たので、会議を始めましょう。', 'now that＋〈主語＋動詞〉で「今や〜なので」と、状況が変わったことを理由にする。'],
      ['even though は事実の譲歩', 'Even though it was raining, they kept walking.', '雨が降っていたけれど、彼らは歩き続けました。', 'even though は実際にそうであることを認めたうえで「〜だけれど」を表す。'],
    ],
    usage: [
      ['たとえ〜でもは even if', '___ if it rains tomorrow, the game will be held.', ['Even', 'Only', 'As', 'So'], 'Even', 'たとえ明日雨が降っても、試合は行われます。', 'even if は「たとえ〜でも」と、まだ分からないことを仮に認める言い方になる。', [
        'even if で「たとえ〜でも」と、これから起こるか分からないことを仮に認める。',
        'only if は「〜の場合にかぎり」という別の意味になる。',
        'as if は「まるで〜かのように」という別の意味になる。',
        'so if という結び付きはない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_connadv',
    order: [
      ['セミコロン＋however', 'The sample was small; however, the results were consistent.', '標本は小さかったが、結果には一貫性がありました。', 'however は接続詞ではないので、2つの文をコンマだけでつながずセミコロンで区切り、後ろにコンマを置く。'],
      ['therefore で結果をつなぐ', 'The line was busy; therefore, we sent an email.', '電話が話し中だったので、私たちはメールを送りました。', 'therefore は「したがって」と結果を示す副詞。セミコロンで区切り、後ろにコンマを置く。'],
      ['moreover で付け加える', 'The plan is affordable; moreover, it can be carried out quickly.', 'その計画は費用が手ごろで、そのうえ早く実行できます。', 'moreover は「そのうえ」と内容を付け加える副詞。前の文とはセミコロンで区切る。'],
    ],
    usage: [
      ['コンマだけではつなげない', 'The room was small___ however, everyone found a seat.', [';', ',', ' and', ' but'], ';', '部屋は小さかったが、全員が席を見つけました。', 'however は副詞なので、2つの文をコンマだけでつなぐことはできない。セミコロン ; かピリオドで区切る。', [
        'however は副詞なので、前の文とはセミコロンで区切る。',
        'コンマだけで2つの文をつなぐことはできない。',
        'and however と重ねる言い方はしない。',
        'but however も意味が重なるので使わない。',
      ]],
      ['したがっては therefore', 'The report was clear; ___, the board approved the budget.', ['therefore', 'however', 'otherwise', 'moreover'], 'therefore', '報告書は明快だった。したがって、理事会は予算を承認しました。', 'therefore は前の内容を受けて「したがって」と結果を示す。', [
        '報告書が明快だったことが理由になり、結果を示す therefore が合う。',
        'however は「しかし」と反対の内容を示す語で、前後がつながらない。',
        'otherwise は「そうしないと」を表し、前後の関係に合わない。',
        'moreover は「そのうえ」と内容を付け加える語で、結果を示さない。',
      ]],
      ['そうしないとは otherwise', 'Leave now; ___, you will miss the last bus.', ['otherwise', 'therefore', 'moreover', 'however'], 'otherwise', 'もう出発しなさい。そうしないと最終バスに乗り遅れますよ。', 'otherwise は「そうしないと」と、前の内容に従わなかった場合を示す。', [
        '前の指示に従わなかった場合を示すので otherwise が合う。',
        'therefore は結果を示す語で、「そうしないと」という意味にならない。',
        'moreover は内容を付け加える語で、ここでは前後がつながらない。',
        'however は反対の内容を示す語で、ここでは意味が通らない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_comparison',
    order: [
      ['No other＋単数名詞で最上級を表す', 'No other river in Japan is as long as the Shinano.', '日本には信濃川ほど長い川はほかにありません。', 'No other＋単数名詞＋as 〜 as A で、最上級と同じ内容を表す。'],
      ['the＋比較級＋of the two', 'He is the taller of the two brothers.', '彼は2人の兄弟のうち背が高いほうです。', '2人のうちで比べるときは the＋比較級＋of the two にする。最上級は使わない。'],
      ['AというよりBは not so much A as B', 'He is not so much a scholar as a writer.', '彼は学者というよりむしろ作家です。', 'not so much A as B で「AというよりむしろB」を表す。'],
    ],
    usage: [
      ['No other＋単数名詞', 'No other ___ in this class is as fast as Ken.', ['student', 'students', 'a student', 'the students'], 'student', 'このクラスでケンほど足の速い生徒はほかにいません。', 'No other のあとの名詞は単数形 student にする。意味は最上級と同じになる。', [
        'No other のあとは単数形なので student を置く。',
        'No other students という複数形はこの形では使わない。',
        'No other a student という形はない。',
        'No other the students という形もない。',
      ]],
      ['…ほど〜でないは less than', 'This problem is ___ difficult than it looks.', ['less', 'least', 'lesser', 'little'], 'less', 'この問題は見かけほど難しくありません。', 'less＋原級＋than 〜 で「…ほど〜でない」を表す。than と組にするのは比較級の less。', [
        'less difficult than 〜 で「〜ほど難しくない」を表す。',
        'least は最上級で、than とは組にならない。',
        'lesser は「重要度が低い」などを表す別の語で、この形では使わない。',
        'little は原級で、than とは組にならない。',
      ]],
      ['2つのうちなら the＋比較級', 'She is ___ of the two sisters.', ['the taller', 'the tallest', 'taller', 'tallest'], 'the taller', '彼女は2人の姉妹のうち背が高いほうです。', '2つのうちで比べるときは the taller of the two のように the＋比較級にする。最上級にはしない。', [
        '2人のうちで比べるので the taller にする。the を付けるのを忘れない。',
        '2人のうちなので最上級 the tallest は使わない。',
        'of the two と組にするときは the を付けて the taller とする。',
        'tallest だけでは the も付かず、2人を比べる形にもならない。',
      ]],
    ],
  },
  {
    unit: 'gref_2_prep',
    order: [
      ['影響を与えるは have an effect on', 'Music has a strong effect on our mood.', '音楽は私たちの気分に強い影響を与えます。', 'have an effect on 〜 で「〜に影響を与える」。影響が及ぶ相手は on で示す。'],
      ['get over＋名詞', 'It took him a long time to get over the illness.', '彼がその病気から回復するには長い時間がかかりました。', 'get over 〜 で「〜を乗りこえる・（病気から）回復する」という決まった組み合わせになる。'],
      ['according to＋名詞', 'According to the report, the number of visitors increased.', 'その報告書によると、訪問者の数は増えました。', 'according to＋名詞で「〜によると」。出どころを示す決まった言い方になる。'],
    ],
    usage: [
      ['区別するは distinguish A from B', 'We must distinguish rumors ___ facts.', ['from', 'with', 'to', 'for'], 'from', '私たちはうわさと事実を区別しなければなりません。', 'distinguish A from B で「AとBを区別する」という決まった組み合わせになる。', [
        'distinguish A from B で「AをBと区別する」を表す。',
        'distinguish A with B という結び付きはない。',
        'distinguish A to B という結び付きもない。',
        'distinguish A for B という結び付きもない。',
      ]],
      ['名詞化した動詞は of でつなぐ', 'The cancellation ___ the concert disappointed many fans.', ['of', 'for', 'to', 'about'], 'of', 'コンサートの中止は多くのファンを落胆させました。', 'cancel を名詞にした cancellation は、対象を of でつなぐ。動詞のときの語順とはちがう。', [
        '名詞 cancellation は、何を中止したかを of でつなぐ。',
        'for は目的や相手を表す語で、中止した対象を示せない。',
        'to は行き先や相手を表す語で、中止した対象を示せない。',
        'about は「〜について」で、中止した対象を示す形にならない。',
      ]],
    ],
  },
])
