// 単元別の並び替え・語法：英検準1級（全20単元）。参考書の各ページで学ぶ形をそのまま問う。
import { unitFormats } from './build.js'

export const GRAMMAR_UNIT_FORMATS_PRE1 = unitFormats('pre1', [
  {
    unit: 'gref_pre1_modal',
    order: [
      ['ought to have＋過去分詞', 'You ought to have checked the figures beforehand.', 'あなたは前もって数字を確かめるべきでした。', 'ought to have＋過去分詞で「〜すべきだったのに（しなかった）」という後悔・非難を表す。'],
      ['need not have＋過去分詞', 'You need not have carried all those bags.', 'あなたはあれほど多くのかばんを運ぶ必要はなかったのに。', 'need not have＋過去分詞で「〜する必要はなかったのに（してしまった）」を表す。'],
      ['must have＋過去分詞', 'She must have realized the figures were wrong.', '彼女はその数字がまちがっていると気づいていたにちがいありません。', 'must have＋過去分詞で、過去のことへの強い推量を表す。must のあとは原形 have にする。'],
    ],
    usage: [
      ['ought のあとに to を落とさない', 'You ought ___ have consulted us first.', ['to', 'of', 'for', 'at'], 'to', 'あなたはまず私たちに相談すべきでした。', 'ought は後ろに to を伴って1つの助動詞のように働く。ought to have＋過去分詞の形にする。', [
        'ought to have＋過去分詞の形。ought のあとの to を落とさない。',
        'ought of have という形はない。',
        'ought for have という形もない。',
        'ought at have という形もない。',
      ]],
      ['おそらく〜は may well', 'You ___ well be right about the cause.', ['may', 'must', 'should', 'need'], 'may', '原因についてはあなたの言うとおりかもしれません。', 'may well＋原形で「おそらく〜だろう・〜するのももっともだ」という決まった言い方になる。', [
        'may well＋原形で「おそらく〜だろう」を表す決まった言い方になる。',
        'must well という結び付きはない。must は「〜にちがいない」を1語で表す。',
        'should well という結び付きはない。',
        'need well という結び付きもない。',
      ]],
      ['いくら〜してもしすぎない', 'You cannot be ___ careful when you handle chemicals.', ['too', 'very', 'so', 'much'], 'too', '薬品をあつかうときは、いくら注意してもしすぎることはありません。', 'cannot be too＋形容詞で「いくら〜してもしすぎることはない」という決まった言い方になる。', [
        'cannot 〜 too … で「いくら…しても…しすぎることはない」を表す。',
        'cannot be very careful では「あまり注意深くできない」という別の意味になる。',
        'cannot be so careful もこの決まった言い方にはならない。',
        'much は比較級を強める語で、原級 careful の前には置かない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_subjunctive',
    order: [
      ['if を省くと Had＋主語', 'Had I noticed the error, I would have corrected it.', '誤りに気づいていたら、私は直していたでしょう。', 'If I had noticed 〜 の if を省くと、Had を主語の前に出した語順になる。'],
      ['「〜がなければ」は Were it not for', 'Were it not for sunlight, no plant could grow.', '日光がなければ、どんな植物も育たないでしょう。', 'If it were not for 〜 の if を省くと Were it not for 〜 になる。「〜がなければ」を表す。'],
      ['要求・提案の that 節は原形', 'The residents demanded that the council publish the report.', '住民は議会がその報告書を公表するよう求めました。', 'demand・suggest・insist などの that 節では、主語に関係なく動詞を原形にする。'],
    ],
    usage: [
      ['万一を表す were to', 'If the project ___ to fail, we would need a backup plan.', ['were', 'is', 'will be', 'has been'], 'were', '万一その事業が失敗したら、私たちは予備の計画が必要になるでしょう。', 'If＋主語＋were to＋原形で「万一〜したら」と、実現しにくい先のことを仮定する。', [
        'If 〜 were to＋原形で「万一〜したら」を表す。主語が何でも were を使う。',
        'is では実際に起こりうる条件の形になり、would と組にならない。',
        'will be は if のまとまりの中では使わない。',
        'has been は今までのつながりを表す形で、この仮定には合わない。',
      ]],
      ['提案の that 節は原形', 'The doctor suggested that he ___ a complete rest.', ['take', 'takes', 'took', 'is taking'], 'take', '医者は彼が完全に休養をとるよう提案しました。', 'suggest・demand・insist などの that 節の中は、主語が3人称単数でも動詞を原形 take にする。', [
        '提案を表す that 節の中は原形にするので take を置く。',
        'takes と3人称単数の形にすると、提案を表すこの形にならない。',
        'took は過去形で、提案の内容を表す that 節には合わない。',
        'is taking は今の様子を表す形で、提案の内容にはならない。',
      ]],
      ['It is vital that の中も原形', 'It is vital that every document ___ kept safely.', ['be', 'is', 'was', 'being'], 'be', 'すべての書類が安全に保管されることが極めて重要です。', 'It is vital / essential that 〜 の that 節の中も、動詞を原形にする。受け身なら be＋過去分詞。', [
        '重要性を述べる that 節の中は原形なので、受け身も be kept にする。',
        'is kept とすると、事実を述べる形になり、この言い方に合わない。',
        'was kept は過去の事実を述べる形で、これから守るべきことを表さない。',
        'being kept では that 節の動詞にならない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_beto',
    order: [
      ['be to で予定を表す', 'The exhibition is to open on the first of May.', '展覧会は5月1日に開かれる予定です。', 'be to＋原形は決まっている予定を表す。かたい書き言葉でよく使う。'],
      ['否定＋受け身で可能を表す', 'In the empty hall, not a voice was to be heard.', 'がらんとしたホールでは、声一つ聞こえませんでした。', 'not 〜 to be＋過去分詞で「〜されえない」という可能の意味になる。be を落とさない。'],
      ['if 節の be to は意図', 'If we are to finish on time, we must start now.', '時間どおりに終えるつもりなら、今始めなければなりません。', 'if のまとまりの中の be to は「〜するつもりなら」という意図を表す。'],
    ],
    usage: [
      ['be to のあとは原形', 'The ceremony is to ___ in the main hall.', ['be held', 'hold', 'holding', 'held'], 'be held', '式典は大ホールで行われる予定です。', '式典は「行われる」側なので、be to のあとを be held と be＋過去分詞にする。', [
        '式典は行われる側なので、to のあとを be held と受け身にする。',
        'hold では式典が自分で開くことになり、意味が通らない。',
        'holding だけでは to のあとに続けられない。',
        'held だけでは受け身の形にならない。be を入れる。',
      ]],
      ['見込みを表す be subject to', 'The contract is subject ___ change without notice.', ['to', 'for', 'of', 'with'], 'to', 'その契約は予告なく変更されることがあります。', 'be subject to＋名詞で「〜を受けることになっている」。形の似た be to＋原形と区別する。', [
        'be subject to＋名詞で「〜を受けることになっている」を表す。',
        'subject for という結び付きはない。',
        'subject of は「〜の主題」を表す別の言い方になる。',
        'subject with という結び付きはない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_speech',
    order: [
      ['warn＋人＋not to＋原形', 'The guide warned us not to touch the statues.', '案内人は私たちに像にさわらないよう警告しました。', 'warn＋人＋not to＋原形で「人に〜しないよう警告する」。not は to の前に置く。'],
      ['deny＋having＋過去分詞', 'He denied having taken the missing documents.', '彼はなくなった書類を持ち出したことを否定しました。', 'deny のあとは動名詞。否定する内容が前のことなら having＋過去分詞にする。'],
    ],
    usage: [
      ['tell＋人＋to＋原形', 'He told me ___ careful on the icy road.', ['to be', 'be', 'being', 'that be'], 'to be', '彼は私に凍った道では気をつけるように言いました。', '命令の内容を伝えるときは tell＋人＋to＋動詞の原形にして to be とする。to を落とさない。', [
        'tell＋人＋to＋原形の形なので to be を置く。',
        'told me be careful という形にはしない。to が必要。',
        'being careful では命令の内容を伝える形にならない。',
        'that be careful という形はない。',
      ]],
      ['deny のあとは動名詞', 'She denied ___ the file without permission.', ['copying', 'to copy', 'copy', 'copied'], 'copying', '彼女は許可なくそのファイルをコピーしたことを否定しました。', 'deny・admit・suggest のあとに動作を置くときは動名詞 copying にする。to＋原形は続けない。', [
        'deny のあとは動名詞なので copying を置く。',
        'deny to copy という形にはしない。',
        'deny copy と原形を置くこともできない。',
        'copied は過去形・過去分詞で、deny のあとには置けない。',
      ]],
      ['be said to have＋過去分詞', 'The policy is believed ___ waste in the city.', ['to have reduced', 'to reduce', 'reducing', 'to be reduced'], 'to have reduced', 'その政策は市のごみを減らしたと考えられています。', '減らしたのは今より前のことなので、to have reduced と to have＋過去分詞にして時の前後を示す。', [
        '減らしたのは信じられている今より前なので、to have reduced にする。',
        'to reduce では今のことになり、すでに減らした結果を表せない。',
        'reducing だけでは is believed のあとに続けられない。',
        'to be reduced では政策が減らされることになり、意味が通らない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_partconst',
    order: [
      ['Having been＋過去分詞', 'Having been written in haste, the report contained errors.', '急いで書かれたので、その報告書には誤りがありました。', '受け身で、しかも文の動詞より前のことなので Having been＋過去分詞で始める。'],
      ['Generally speaking で始める', 'Generally speaking, older buildings need more care.', '一般的に言えば、古い建物はより手入れが必要です。', 'generally speaking は文の主語に関係なく使える決まった分詞構文で、文頭に置く。'],
      ['「〜から判断すると」は Judging from', 'Judging from his expression, he must be exhausted.', '表情から判断すると、彼はとても疲れているにちがいありません。', 'judging from 〜 は「〜から判断すると」という決まった分詞構文。文の主語と結び付けなくてよい。'],
    ],
    usage: [
      ['受け身で前のことは Having been', '___ warned of the danger, the crew left the site.', ['Having been', 'Having', 'Being', 'Have been'], 'Having been', '危険を知らされていたので、作業員たちは現場を離れました。', '作業員は「知らされる」側で、しかも現場を離れるより前のことなので Having been＋過去分詞にする。', [
        '受け身で、しかも文の動詞より前のことなので Having been warned とする。前に終わったことをはっきり示せる。',
        'Having warned では「作業員が警告した」という意味になってしまう。',
        'Being warned でも意味は通るが、前に終わったことをはっきり示すのは Having been。',
        'Have been と原形で始めると命令文の形になってしまう。',
      ]],
      ['speaking は形を変えない', '___ speaking, this is not a new idea.', ['Strictly', 'Strict', 'Stricter', 'Strictness'], 'Strictly', '厳密に言えば、これは新しい考えではありません。', 'strictly speaking は決まった分詞構文で、speaking の前には副詞を置く。', [
        'speaking の前には副詞を置くので strictly にする。',
        'strict は形容詞で、speaking の前には置けない。',
        'stricter は比較級で、この決まった言い方には入らない。',
        'strictness は名詞で、speaking の前には置けない。',
      ]],
      ['「天気が許せば」は weather permitting', 'Weather ___, the concert will take place in the park.', ['permitting', 'permitted', 'permits', 'to permit'], 'permitting', '天気がよければ、そのコンサートは公園で行われます。', 'weather permitting は「天気が許せば」という決まった独立分詞構文。天気は「許す」側なので現在分詞にする。', [
        '天気が許す側なので、現在分詞 permitting を置く。',
        'permitted では天気が許される側になり、意味が通らない。',
        'permits を置くと文の動詞が2つになってしまう。',
        'to permit は「許すために」となり、条件を表さない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_absolute',
    order: [
      ['分詞の前に主語を置く', 'The weather being fine, we decided to walk home.', '天気がよかったので、私たちは歩いて帰ることにしました。', '分詞の動作をするのが文の主語とちがうときは、分詞の前にその主語（The weather）を置く。'],
      ['「〜がないので」は There being', 'There being no time left, we stopped the discussion.', '時間が残っていなかったので、私たちは話し合いをやめました。', 'There is 〜. を分詞構文にすると There being 〜 になる。形のまま覚える。'],
      ['「考え合わせると」は All things considered', 'All things considered, the trip went very well.', 'すべてを考え合わせると、その旅行はとてもうまくいきました。', 'all things considered は「すべてを考え合わせると」という決まった独立分詞構文。'],
    ],
    usage: [
      ['主語がちがうときは主語を残す', '___ being over, the audience left quietly.', ['The concert', 'It', 'Being', 'There'], 'The concert', 'コンサートが終わったので、観客は静かに出ていきました。', '分詞の動作をするのが文の主語 the audience とちがうので、分詞の前に The concert を置く。', [
        '終わったのはコンサートなので、分詞の前に The concert を置く。',
        'It being over では何が終わったのか分からない。',
        'Being over だけでは、文の主語 the audience が終わったことになってしまう。',
        'There being over という言い方はない。',
      ]],
      ['There is を分詞構文にする', '___ being no objections, the plan was approved.', ['There', 'It', 'That', 'They'], 'There', '反対がなかったので、その計画は承認されました。', 'There is no 〜. を分詞構文にすると There being no 〜 になる。there をそのまま残す。', [
        'There is 〜. を分詞構文にすると There being 〜 になる。',
        'It being no objections という形はない。',
        'That being は「それが〜なので」を表し、後ろに no objections を続けられない。',
        'They being no objections という形もない。',
      ]],
      ['過去分詞の独立分詞構文', 'The data ___, the team began its analysis.', ['collected', 'collecting', 'collects', 'to collect'], 'collected', 'データが集められたので、チームは分析を始めました。', 'データは「集められる」側なので過去分詞 collected にする。分詞の前に主語 The data を置く。', [
        'データは集められる側なので、過去分詞 collected を置く。',
        'collecting ではデータが何かを集めることになってしまう。',
        'collects を置くと文の動詞が2つになってしまう。',
        'to collect は「集めるために」となり、理由を表す形にならない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_with',
    order: [
      ['with＋名詞＋現在分詞', 'The dog lay still with its tail wagging.', '犬はしっぽを振りながらじっと横になっていました。', 'しっぽは「振れている」側なので現在分詞 wagging を使う。with＋名詞＋分詞で同時の様子を表す。'],
      ['with＋名詞＋過去分詞', 'He sat in silence with his arms crossed.', '彼は腕を組んで黙ってすわっていました。', '腕は「組まれる」側なので過去分詞 crossed を使う。with＋名詞＋分詞で同時の様子を表す。'],
    ],
    usage: [
      ['される側なら過去分詞', 'He sat quietly with his eyes ___.', ['closed', 'closing', 'close', 'to close'], 'closed', '彼は目を閉じて静かにすわっていました。', 'with＋名詞＋分詞では、名詞が「される」側なら過去分詞にする。目は閉じられる側なので closed を置く。', [
        '目は閉じられる側なので、過去分詞 closed を置く。',
        'closing では目が何かを閉じていることになってしまう。',
        'close は原形・形容詞で、この形には入らない。',
        'to close は「閉じるために」となり、同時の様子を表さない。',
      ]],
      ['with＋名詞＋形容詞', 'Do not speak with your mouth ___.', ['full', 'fill', 'filling', 'to fill'], 'full', '口に物を入れたまま話してはいけません。', 'with＋名詞のあとには形容詞も置ける。full は「いっぱいの」という形容詞。', [
        'with your mouth full で「口がいっぱいの状態で」を表す。',
        'fill は「満たす」という動詞で、この形には入らない。',
        'filling では口が何かを満たしていることになってしまう。',
        'to fill は「満たすために」となり、状態を表さない。',
      ]],
      ['付帯状況を表すのは with', 'He walked in ___ a book in his hand.', ['with', 'by', 'on', 'for'], 'with', '彼は本を手に持って入ってきました。', '同時の様子を付け加えるときは with＋名詞＋前置詞句の形にする。by では表せない。', [
        'with＋名詞＋前置詞句で「〜を…した状態で」という同時の様子を表す。',
        'by は手段や行為者を表す語で、同時の様子を付け加える働きはない。',
        'on は接している場所を表す語で、この形には合わない。',
        'for は目的や相手を表す語で、同時の様子を表せない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_chainrel',
    order: [
      ['who＋I think＋動詞', 'The man who I thought was honest lied to me.', '正直だと私が思っていた男性は、私にうそをつきました。', 'I thought を取りのぞくと who was honest となり、who が主語なので主格にする。'],
      ['whom＋I believe＋主語＋動詞', 'That is the writer whom I believe the judges will choose.', 'あれは審査員が選ぶだろうと私が思う作家です。', 'I believe を取りのぞくと the committee will select 〜 となり、目的語が欠けるので目的格 whom にする。'],
      ['that＋experts say＋動詞', 'This is the method that experts say is most reliable.', 'これは専門家が最も信頼できると言う方法です。', 'experts say を取りのぞくと that is most reliable となり、主語が欠けるので主格でつなぐ。'],
    ],
    usage: [
      ['取りのぞいて主格か決める', 'She is the person ___ I think can solve this problem.', ['who', 'whom', 'whose', 'what'], 'who', '彼女はこの問題を解決できると私が思う人です。', 'I think を取りのぞくと can solve 〜 の主語が欠けるので、主格の who を使う。', [
        'I think を取りのぞくと主語が欠けるので、主格の who を使う。',
        'whom は目的格で、後ろの動詞の主語にはなれない。',
        'whose は後ろに名詞を続けて持ち主を表す語で、ここでは合わない。',
        'what は先行詞をふくむ語なので、the person のあとには置けない。',
      ]],
      ['目的語が欠けるなら目的格', 'He is the writer ___ I believe the committee will support.', ['whom', 'who', 'whose', 'which'], 'whom', '彼は委員会が支持するだろうと私が思う作家です。', 'I believe を取りのぞくと honor の目的語が欠けるので、目的格の whom を使う。', [
        'support の目的語が欠けるので、目的格の whom を使う。',
        'who は主格で、目的語が欠けるこの文には合わない。',
        'whose は後ろに名詞を続ける語で、ここでは合わない。',
        'which は物を受ける語で、the writer には使えない。',
      ]],
      ['「だれが〜と思うか」は Who do you think', 'Who ___ will win the final game?', ['do you think', 'do you think that', 'you think', 'think you'], 'do you think', 'だれが決勝戦に勝つと思いますか。', 'Yes / No で答えられない問いでは、疑問詞を先頭に出して〈疑問詞＋do you think＋主語＋動詞〉の語順にする。', [
        '疑問詞を先頭に置き、そのあとを do you think＋動詞 の語順にする。',
        'Who do you think that 〜? のように that を入れることはしない。',
        'Who you think will win 〜? では疑問文の形になっていない。',
        'Who think you 〜? という語順はない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_compound',
    order: [
      ['Whoever＋動詞', 'Whoever needs the data may download it freely.', 'そのデータを必要とする人はだれでも、自由にダウンロードできます。', 'Whoever は anyone who と同じで、「〜する人はだれでも」という主語のまとまりを作る。'],
      ['Whichever＋名詞＋主語＋動詞', 'Whichever plan you choose, please tell us today.', 'どちらの計画を選ぶにしても、今日私たちに知らせてください。', 'Whichever＋名詞で「どちらの〜を…しても」という譲歩のまとまりを作る。'],
      ['However＋副詞＋主語＋動詞', 'However quickly we work, the task takes two days.', 'どんなに速く働いても、その作業には2日かかります。', 'however のすぐ後ろに形容詞・副詞を置き、そのあとを〈主語＋動詞〉にする。'],
    ],
    usage: [
      ['however のあとは形容詞・副詞', '___ difficult it is, we will continue the project.', ['However', 'How', 'Whatever', 'Whenever'], 'However', 'どんなに難しくても、私たちはその事業を続けます。', 'however＋形容詞＋主語＋動詞で「どんなに〜でも」を表す。形容詞を however のすぐ後ろに置く。', [
        'However＋形容詞＋〈主語＋動詞〉で「どんなに〜でも」を表す。',
        'How difficult it is は疑問や感嘆を表す形で、譲歩のまとまりにはならない。',
        'Whatever のあとには名詞が続く。形容詞 difficult は続かない。',
        'Whenever は「いつ〜しても」を表し、難しさの程度を表せない。',
      ]],
      ['主格なら whoever', 'Give the ticket to ___ wants it most.', ['whoever', 'whomever', 'whatever', 'whichever'], 'whoever', 'いちばんそれをほしがっている人にそのチケットをあげなさい。', 'to のあとでも、wants の主語になるので主格の whoever を使う。前置詞につられない。', [
        'wants の主語になるので、前置詞のあとでも主格の whoever を使う。',
        'whomever は目的格で、後ろの動詞 wants の主語にはなれない。',
        'whatever は物を表す語で、チケットをほしがる人を指せない。',
        'whichever は「どちらでも」と選ぶ範囲が決まっているときに使う。',
      ]],
      ['no matter＋疑問詞に言いかえる', '___ matter how hard it rains, the train will run.', ['No', 'Not', 'Never', 'None'], 'No', 'どんなに激しく雨が降っても、電車は運行します。', 'no matter＋疑問詞 は -ever の譲歩と同じ意味を表す決まった言い方になる。', [
        'no matter how 〜 で「どんなに〜でも」を表し、However 〜 と言いかえられる。',
        'Not matter という言い方はない。',
        'Never matter という言い方もない。',
        'None matter という言い方もない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_whatever',
    order: [
      ['Whatever happens で始める', 'Whatever happens, I will support your decision.', '何が起ころうとも、私はあなたの決定を支えます。', 'Whatever happens は「何が起ころうとも」という譲歩のまとまり。後ろに言いたい内容の文を続ける。'],
      ['whatever＋主語＋動詞', 'Feel free to order whatever you like tonight.', '今夜は何でも好きなものを注文してください。', 'whatever は「〜するものは何でも」を表し、order の目的語になるまとまりを作る。'],
    ],
    usage: [
      ['何が〜しようともは Whatever', '___ may happen, we will not change our plan.', ['Whatever', 'However', 'Whenever', 'Wherever'], 'Whatever', '何が起ころうとも、私たちは計画を変えません。', 'whatever＋may＋動詞で「何が〜しようとも」を表す。主語の位置に立つ語を選ぶ。', [
        'Whatever は happen の主語になり、「何が起ころうとも」を表す。',
        'However のあとには形容詞・副詞が続き、主語の位置には立たない。',
        'Whenever は「いつ〜しても」を表し、主語の位置には立たない。',
        'Wherever は「どこで〜しても」を表し、主語の位置には立たない。',
      ]],
      ['whatever＋名詞', '___ the weather may be, the race will start.', ['Whatever', 'However', 'Whoever', 'Whichever'], 'Whatever', '天気がどうであれ、レースは始まります。', 'whatever＋名詞で「どんな〜であれ」を表す。後ろに may be を続けて譲歩にする。', [
        'Whatever＋名詞で「どんな〜であれ」を表す。',
        'However のあとには形容詞・副詞が続き、名詞 the weather は続かない。',
        'Whoever は人を指す語で、the weather には使えない。',
        'Whichever は選ぶ範囲が決まっているときに使い、ここでは合わない。',
      ]],
      ['時なら whenever', 'You can come ___ you like.', ['whenever', 'whatever', 'whoever', 'however'], 'whenever', 'あなたは好きなときにいつでも来てよいです。', '時について「いつでも」を表すのは whenever。物なら whatever、人なら whoever を使う。', [
        '時について「いつでも」を表すので whenever を使う。',
        'whatever は物について「何でも」を表し、来る時を表せない。',
        'whoever は人について「だれでも」を表し、時を表せない。',
        'however は程度やしかたを表し、時を表せない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_nounclause',
    order: [
      ['同格の that＋完全な文', 'The fact that he lied shocked the whole team.', '彼がうそをついたという事実は、チーム全体に衝撃を与えました。', 'The fact のすぐ後ろに that＋完全な文を置いて、その事実の中身を説明する。'],
      ['What＋欠けた文が主語', 'What matters here is whether the plan is realistic.', 'ここで大切なのは、その計画が現実的かどうかです。', 'What matters here は主語のまとまり、whether 〜 は補語のまとまりになる。'],
      ['前置詞のあとは whether', 'It depends on whether we have enough time.', 'それは私たちに十分な時間があるかどうかによります。', '前置詞 on の後ろで「〜かどうか」を表すときは whether を使う。if は置けない。'],
    ],
    usage: [
      ['後ろが完全な文なら that', 'There is a chance ___ the schedule will change.', ['that', 'what', 'which', 'whose'], 'that', '予定が変わる見込みがあります。', '後ろの文に欠けている部分がないので、名詞の中身を説明する同格の that を使う。', [
        '後ろの the schedule will change は欠けていない文なので、同格の that を使う。',
        'what は後ろで名詞が欠けているときに使う。この文では欠けていない。',
        'which を使うと、後ろの文で主語か目的語が欠けている必要がある。',
        'whose は後ろに名詞を続けて持ち主を表す語で、ここでは合わない。',
      ]],
      ['名詞が欠けていれば what', '___ matters most is the quality of the evidence.', ['What', 'That', 'Whether', 'Which'], 'What', 'いちばん大切なのは、証拠の質です。', 'matters の主語が欠けているので、先行詞をふくむ what を使う。', [
        'matters の主語が欠けているので、先行詞をふくむ What を使う。',
        'That matters most 〜 では主語が足りず、文として成り立たない。',
        'Whether は後ろに完全な文を続ける語で、主語が欠けるこの文には合わない。',
        'Which は前に先行詞が必要で、文の先頭には置けない。',
      ]],
      ['to 不定詞と組むのは whether', 'I cannot decide ___ to go or not.', ['whether', 'if', 'that', 'what'], 'whether', '私は行くべきかどうか決められません。', 'to＋原形と組にして「〜すべきかどうか」を表せるのは whether だけ。if は to と組にならない。', [
        'whether to＋原形で「〜すべきかどうか」を表す。',
        'if は to＋原形と組にできない。〈主語＋動詞〉を続ける必要がある。',
        'that は「〜ということ」を表し、不確かさを表せない。',
        'what to go という形では意味が通らない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_apposition',
    order: [
      ['news＋that＋完全な文', 'The news that the store would close upset many customers.', '店が閉まるという知らせは、多くの客を動揺させました。', 'The news の中身を that＋完全な文で説明する同格の形。which には置きかえられない。'],
      ['belief＋that＋完全な文', 'His belief that everyone deserves a second chance guided him.', 'だれもがやり直す機会に値するという信念が、彼を導きました。', 'His belief の中身を that＋完全な文で説明する。文の主語が長くなる点に注意する。'],
      ['コンマではさむ同格', 'Marie Curie, a pioneering scientist, won two Nobel Prizes.', '先駆的な科学者であるマリ・キュリーは、ノーベル賞を2度受賞しました。', '名詞のあとにコンマではさんで別の名詞を置くと、前の名詞を言いかえて説明できる。'],
    ],
    usage: [
      ['同格は that でつなぐ', 'The news ___ the factory would close shocked us.', ['that', 'which', 'what', 'whose'], 'that', '工場が閉鎖されるという知らせは、私たちに衝撃を与えました。', '後ろの文が欠けていないので、名詞の中身を説明する同格の that を使う。', [
        '後ろの the factory would close は欠けていない文なので、同格の that を使う。',
        'which を使うには、後ろの文で主語か目的語が欠けている必要がある。',
        'what は先行詞をふくむ語なので、The news のあとには置けない。',
        'whose は後ろに名詞を続ける語で、ここでは合わない。',
      ]],
      ['欠けていれば関係代名詞', 'The report ___ she wrote changed the policy.', ['that', 'what', 'whose', 'whether'], 'that', '彼女が書いた報告書は、その方針を変えました。', 'wrote の目的語が欠けているので、同格ではなく関係代名詞の that を使う。', [
        'wrote の目的語が欠けているので、関係代名詞の that でつなぐ。',
        'what は先行詞をふくむ語なので、The report のあとには置けない。',
        'whose は後ろに名詞を続ける語で、ここでは合わない。',
        'whether は「〜かどうか」を表し、名詞を説明する働きはない。',
      ]],
      ['同格の that をとる名詞', 'The ___ that longer hours improve results is now questioned.', ['assumption', 'assume', 'assuming', 'assumed'], 'assumption', '長時間働けば成果が上がるという想定は、今では疑問視されています。', 'fact・news・idea・assumption などの名詞は、後ろに同格の that 節を取れる。動詞は取れない。', [
        'assumption は名詞で、後ろに同格の that 節を取れる。',
        'assume は動詞で、The のあとに置くことはできない。',
        'assuming は分詞で、The のあとに置いて主語にはできない。',
        'assumed は過去形・過去分詞で、The のあとには置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_concession',
    order: [
      ['However＋形容詞＋主語＋動詞', 'However rich he is, he is never satisfied.', '彼はどんなに裕福でも、決して満足しません。', 'however のすぐ後ろに形容詞を置き、そのあとを〈主語＋動詞〉にする。'],
      ['形容詞＋as＋主語＋動詞', 'Tired as she was, she kept working until midnight.', '疲れてはいたけれど、彼女は真夜中まで働き続けました。', '形容詞を文の先頭に出し、as＋〈主語＋動詞〉を続けると「〜ではあるけれども」を表す。'],
      ['「〜であろうとなかろうと」は whether A or not', 'Whether he agrees or not, the plan will proceed.', '彼が賛成しようとしまいと、その計画は進みます。', 'whether 〜 or not で「〜であろうとなかろうと」という譲歩のまとまりを作る。'],
    ],
    usage: [
      ['no matter how に言いかえる', 'No matter ___ carefully you check, mistakes may remain.', ['how', 'what', 'which', 'that'], 'how', 'どんなに注意深く確かめても、誤りは残りえます。', 'no matter how＋副詞＋主語＋動詞で「どんなに〜しても」を表す。However 〜 と言いかえられる。', [
        'no matter how＋副詞で程度の譲歩を表し、However carefully 〜 と同じ意味になる。',
        'no matter what のあとには名詞や〈主語＋動詞〉が続き、副詞 carefully は続かない。',
        'no matter which は選ぶ範囲が決まっているときに使う。',
        'no matter that という言い方はない。',
      ]],
      ['much as で譲歩を表す', '___ as I admire his work, I cannot agree here.', ['Much', 'Very', 'So', 'Too'], 'Much', '彼の仕事を大いに賞賛してはいますが、ここでは賛成できません。', 'Much as＋〈主語＋動詞〉で「大いに〜するけれども」という譲歩を表す。', [
        'Much as 〜 で「大いに〜するけれども」という譲歩を表す。',
        'Very as という言い方はない。',
        'So as 〜 は目的を表す別の形で、譲歩にはならない。',
        'Too as という言い方はない。',
      ]],
      ['although に but を重ねない', 'Although the sample was small, the pattern ___ clear.', ['was', 'but was', 'so was', 'and was'], 'was', '標本は小さかったが、その傾向ははっきりしていました。', 'Although のまとまりがすでに「〜だけれども」を表しているので、後ろの文は was だけにして but を重ねない。', [
        'Although のまとまりが逆の内容を示すので、後ろは was だけでよい。',
        'but を重ねると、逆の内容を示す語が2つになってしまう。',
        'so は結果をつなぐ語で、although とは組にならない。',
        'and は内容を並べる語で、主語のすぐ後ろには置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_inversion',
    order: [
      ['Little＋助動詞＋主語', 'Little did she know that trouble lay ahead.', 'この先に問題があることを、彼女は少しも知りませんでした。', 'Little を文の先頭に出すと、後ろが〈did＋主語＋動詞の原形〉の語順になる。'],
      ['「〜するとすぐに」は No sooner had 〜 than', 'No sooner had the bell rung than the students left.', 'ベルが鳴るとすぐに生徒たちは出ていきました。', 'No sooner had＋主語＋過去分詞 〜 than＋過去の文 で「〜するとすぐに」を表す。'],
    ],
    usage: [
      ['Never を前に出すと倒置', 'Never ___ such a beautiful sight before.', ['have I seen', 'I have seen', 'did I saw', 'I saw'], 'have I seen', 'こんなに美しい景色は今まで見たことがありません。', '否定の語句を文の先頭に出すと、後ろが〈助動詞＋主語＋動詞〉の語順になり have I seen とする。', [
        'Never を前に出したので、have I seen と倒置させる。',
        'Never I have seen という語順にはしない。',
        'did I saw と過去形を重ねることはできない。',
        'Never I saw 〜 では倒置していない。',
      ]],
      ['Hardly 〜 when の組み合わせ', 'Hardly had the concert begun ___ the lights went out.', ['when', 'than', 'that', 'as'], 'when', 'コンサートが始まるとすぐに照明が消えました。', 'Hardly had 〜 when … で「〜するとすぐに」。No sooner と組になる than と使い分ける。', [
        'Hardly had 〜 when … が決まった組み合わせになる。',
        'than は No sooner had 〜 than … と組にする語で、Hardly とは組にならない。',
        'that は Hardly と組にして「〜するとすぐに」を表さない。',
        'as は「〜するとき」を表せるが、この決まった形では when を使う。',
      ]],
      ['Not only を前に出すと倒置', 'Not only ___ late, but he was also rude.', ['was he', 'he was', 'did he', 'he did'], 'was he', '彼は遅れただけでなく、無礼でもありました。', 'Not only を文の先頭に出すと、後ろが〈be動詞・助動詞＋主語〉の語順になり was he とする。', [
        'Not only を前に出したので、was he と倒置させる。',
        'Not only he was 〜 では倒置していない。',
        'did he のあとに late は続けられない。be動詞の文なので was he にする。',
        'he did では倒置にも be動詞の文にもならない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_emphasis',
    order: [
      ['「〜して初めて…」は It is not until 〜 that', 'It was not until evening that the wind stopped.', '夕方になってやっと風がやみました。', 'It is / was not until 〜 that … で「〜して初めて…」を表す。where や when は使わない。'],
      ['理由を強める It is because 〜 that', 'It is because the roads are icy that the buses stopped.', 'バスが止まったのは、道路が凍っているからです。', 'It is because 〜 that … で「…なのは〜だからだ」と理由を強める。'],
      ['do で動詞を強める', 'I do appreciate your patience in this matter.', 'この件でのご辛抱に、本当に感謝しています。', 'do＋動詞の原形で動詞を強める。主語が I なので do を使う。'],
    ],
    usage: [
      ['not until を受けるのは that', 'It was not until midnight ___ the rain stopped.', ['that', 'when', 'which', 'then'], 'that', '真夜中になってやっと雨がやみました。', 'It is / was not until 〜 の後ろは、時を表す語句を強めても that で受ける。', [
        '強調構文なので、時を強めても that で受ける。',
        'when は使わない。強調構文は It is 〜 that … の形で決まっている。',
        'which は名詞を説明する語で、until midnight という語句を受けられない。',
        'then は副詞で、2つの文をつなぐ働きがない。',
      ]],
      ['理由を強めるのは because', 'It is ___ the lights failed that the show was delayed.', ['because', 'why', 'since that', 'the reason'], 'because', '公演が遅れたのは、照明が故障したからです。', '理由を強めるときは It is because 〜 that … の形にする。why は使わない。', [
        'It is because 〜 that … で理由を強める。',
        'why は理由をたずねる語で、強調構文のこの位置には置けない。',
        'since that という並べ方はしない。',
        'the reason を置くと that の前後のつながりが変わってしまう。',
      ]],
      ['does＋原形で強める', 'The committee indeed ___ revise the proposal last month.', ['did', 'does', 'was', 'had'], 'did', '委員会は先月、確かに提案を見直しました。', 'did＋動詞の原形で動詞を強める。last month があるので過去形の did を使う。', [
        '過去のことなので did を置き、そのあとを原形 revise にする。',
        'does は現在のことを表す形で、last month とは合わない。',
        'was のあとに動詞の原形 revise は続けられない。',
        'had のあとには過去分詞が必要で、原形 revise は続けられない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_ellipsis',
    order: [
      ['if necessary で省略', 'Please call the office again if necessary.', '必要なら、もう一度事務所に電話してください。', 'if it is necessary の〈主語＋be動詞〉を省いた形。決まった言い方として覚える。'],
      ['When in doubt で始める', 'When in doubt, ask your supervisor first.', '迷ったときは、まず上司にたずねなさい。', 'When you are in doubt の〈主語＋be動詞〉を省いた形。命令文とよく組にして使う。'],
      ['Though＋過去分詞', 'Though tired from the trip, he finished the report.', '旅行で疲れていたものの、彼は報告書を仕上げました。', 'Though he was tired 〜 の〈主語＋be動詞〉を省いた形になる。'],
    ],
    usage: [
      ['if のあとの主語と be動詞を省く', 'Call me later if ___.', ['necessary', 'it necessary', 'is necessary', 'to necessary'], 'necessary', '必要ならあとで電話してください。', 'if it is necessary の〈主語＋be動詞〉を省いて if necessary とする。', [
        'if it is を省いて if necessary とするのが決まった言い方になる。',
        'if it necessary では動詞がなく、文の形が整わない。',
        'if is necessary では主語がなく、形が整わない。',
        'to necessary という形はない。',
      ]],
      ['もしあってもは if any', 'There are few errors, ___ any, in this report.', ['if', 'though', 'even', 'or'], 'if', 'この報告書には、あるとしてもほとんど誤りはありません。', 'if any は「もしあるとしても」を表す決まった言い方。few・little と組にしてよく使う。', [
        'if any で「もしあるとしても」を表す。few と組にしてよく使う。',
        'though any という言い方はない。',
        'even any という言い方もない。',
        'or any ではこの決まった言い方にならない。',
      ]],
      ['めったにないは seldom, if ever', 'He seldom, ___ ever, goes out on weekdays.', ['if', 'or', 'and', 'though'], 'if', '彼は平日に外出することは、あるとしてもめったにありません。', 'seldom, if ever は「たとえあるとしてもめったに〜ない」を表す決まった言い方になる。', [
        'seldom, if ever で「あるとしてもめったに〜ない」を表す。',
        'or ever という言い方はこの形では使わない。',
        'and ever という言い方もない。',
        'though ever という言い方もない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_agreement',
    order: [
      ['One of＋複数名詞は単数扱い', 'One of the reports is missing from the file.', '報告書の1つがそのファイルから抜けています。', '中心の名詞は One なので、動詞は単数に合わせる。of the reports に引きずられない。'],
      ['along with は主語を増やさない', 'The teacher, along with the students, was interviewed.', '先生は生徒たちとともに取材を受けました。', 'along with 〜 の部分は主語の数を変えない。中心の名詞 The teacher に合わせて was にする。'],
      ['時間のまとまりは単数扱い', 'Twenty kilometers is a long way to walk.', '20キロは歩くには長い道のりです。', '時間・距離・金額のまとまりは1つのかたまりと見るので、動詞は単数に合わせる。20キロで1つの道のりと数える。'],
    ],
    usage: [
      ['中心の名詞に合わせる', 'The quality of the sources ___ more important than the number.', ['is', 'are', 'were', 'have been'], 'is', '資料の質は、数よりも重要です。', '主語の中心は The quality なので、of the sources に引きずられず単数に合わせて is にする。', [
        '中心の名詞は The quality なので、動詞は単数の is にする。',
        'are は of the sources に引きずられた形で、中心の名詞と合わない。',
        'were も複数の形で、中心の名詞 quality とは合わない。',
        'have been も複数の主語に使う形で、ここでは has been になる。',
      ]],
      ['neither＋単数名詞', 'Neither explanation ___ convincing enough.', ['is', 'are', 'were', 'have'], 'is', 'どちらの説明も十分に納得できるものではありません。', 'neither＋単数名詞は1つずつを指すので、動詞は単数に合わせて is にする。', [
        'Neither explanation は1つずつを指すので、動詞は is にする。',
        'are は複数の主語に使う形で、単数の explanation には合わない。',
        'were も複数の主語に使う形で、今のことにも合わない。',
        'have は複数の主語に使う形で、ここでは合わない。',
      ]],
      ['as well as も主語を増やさない', 'The manager, as well as the staff, ___ invited to the event.', ['was', 'were', 'have been', 'are'], 'was', '支配人は職員とともにその行事に招待されました。', 'as well as 〜 の部分は主語の数を変えない。中心の名詞 The manager に合わせて was にする。', [
        '中心の名詞は The manager なので、動詞は単数の was にする。',
        'were は as well as のあとに引きずられた形で、中心の名詞と合わない。',
        'have been も複数の主語に使う形で、ここでは has been になる。',
        'are は今のことを表す複数の形で、この文には合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_comparison',
    order: [
      ['no fewer than＋数', 'No fewer than thirty students joined the club.', '30人もの生徒がその部に入りました。', 'no fewer than＋数で「〜もの（多さに驚く）」を表す。数えられる名詞には fewer を使う。'],
      ['no more than＋金額', 'The whole trip cost no more than five thousand yen.', '旅行全体でたった5千円しかかかりませんでした。', 'no more than＋数量で「たった〜しか」と少なさを表す。no fewer than とは気持ちが反対になる。'],
      ['The＋比較級, the better', 'The earlier we start, the better.', '早く始めれば始めるほどよいです。', 'The＋比較級 〜, the better. は後半を省いた言い方で、「〜するほどよい」を表す。'],
    ],
    usage: [
      ['数えられる名詞には fewer', 'No ___ than fifty people attended the ceremony.', ['fewer', 'less', 'little', 'few'], 'fewer', '50人もの人がその式典に出席しました。', '数えられる名詞 people には fewer を使う。数えられない名詞には less を使う。', [
        'people は数えられる名詞なので、no fewer than を使う。',
        'less は数えられない名詞の量に使う語で、people には合わない。',
        'little も数えられない名詞に使う語で、than と組にもならない。',
        'few は原級で、than と組にして比べる形にはならない。',
      ]],
      ['AというよりむしろB', 'The issue is not so much cost ___ fairness.', ['as', 'than', 'but', 'like'], 'as', 'その問題は費用というよりむしろ公平さです。', 'not so much A as B で「AというよりむしろB」を表す。than とは組にならない。', [
        'not so much A as B が決まった組み合わせになる。',
        'than は比較級と組にする語で、so much とは組にならない。',
        'but を置くとこの決まった言い方にならない。',
        'like は「〜のような」を表し、この形には入らない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_whale',
    order: [
      ['強く打ち消す A is no more B than C is', 'A dolphin is no more a fish than a dog is.', 'イルカが魚でないのは、犬が魚でないのと同じです。', 'than の後ろの「犬は魚ではない」を先に考え、それと同じようにAもBではないと読む。'],
      ['no less 〜 than は反対の意味', 'She is no less talented than her sister is.', '彼女は姉に劣らず才能があります。', 'no less 〜 than … は「…に劣らず〜だ」と、どちらもそうであることを表す。'],
    ],
    usage: [
      ['打ち消すのは no more', 'A slogan is no ___ an argument than a wish is.', ['more', 'less', 'better', 'worse'], 'more', '標語が論証でないのは、願望が論証でないのと同じです。', 'A is no more B than C is で「CがBでないのと同様、AもBではない」を表す。', [
        'no more 〜 than … で「…でないのと同様、〜でもない」を強く打ち消す。',
        'no less 〜 than … は「…に劣らず〜だ」と、どちらもそうであることを表す。',
        'no better than 〜 は「〜も同然だ」という別の意味になる。',
        'no worse than 〜 は「〜ほど悪くない」という別の意味になる。',
      ]],
      ['than の後ろは be動詞で受ける', 'A bat is no more a bird than a mouse ___.', ['is', 'does', 'has', 'can'], 'is', 'コウモリが鳥でないのは、ネズミが鳥でないのと同じです。', 'than のあとは、前と同じ形をくり返すかわりに be動詞 is だけを置く。', [
        '前が is なので、than のあとも is でくり返す。',
        'does は一般動詞をくり返すときの形で、be動詞の文には合わない。',
        'has は have をくり返すときの形で、この文には合わない。',
        'can は助動詞をくり返すときの形で、この文には合わない。',
      ]],
      ['no less＋名詞＋than', 'Her contribution is no ___ important than his.', ['less', 'more', 'fewer', 'little'], 'less', '彼女の貢献は彼の貢献に劣らず重要です。', 'no less 〜 than … で「…に劣らず〜だ」を表す。どちらも重要だという意味になる。', [
        'no less important than 〜 で「〜に劣らず重要だ」を表す。',
        'no more important than 〜 では「重要でないのは同じだ」と反対の意味になる。',
        'fewer は数えられる名詞に使う語で、形容詞 important の前には置かない。',
        'little は原級で、than と組にして比べる形にはならない。',
      ]],
    ],
  },
  {
    unit: 'gref_pre1_prep',
    order: [
      ['cast doubt on＋名詞', 'The new report casts doubt on the original claim.', '新しい報告書は、もとの主張に疑問を投げかけています。', 'cast doubt on 〜 で「〜に疑問を投げかける」。疑いが向かう先は on で示す。'],
      ['have an impact on＋名詞', 'Social media has a strong impact on young people.', 'ソーシャルメディアは若い人に強い影響を与えています。', 'have an impact on 〜 で「〜に影響を与える」。影響が及ぶ相手は on で示す。'],
      ['in response to＋名詞', 'The city changed the plan in response to public concern.', '市は市民の不安に応えて計画を変えました。', 'in response to＋名詞で「〜に応えて」。前置詞をふくむ3語で1つのまとまりになる。'],
    ],
    usage: [],
  },
])
