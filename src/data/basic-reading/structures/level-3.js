// 基礎長文・3級の構造台帳（本文の順に1文ずつ）。書き方は entry.js と長文の構造台帳を見る。
import { bs } from './entry.js'

export const BASIC_READING_STRUCTURES_3 = Object.freeze({
  br3_river_clean_up: Object.freeze([
    bs('[独 Volunteers {過去分詞>Volunteers| [V Needed]}]: [独 River Clean-Up Day]', {
      fragment: true,
      chunks: [
        ['Volunteers Needed:', 'ボランティア募集'],
        ['River Clean-Up Day', '川のそうじの日'],
      ],
      notes: {
        'Volunteers Needed:': '動詞のない見出しです。Needed は「求められている」で、募集の案内文だと分かります。',
      },
      marks: [[':', '見出しの「ボランティア募集」のあとに、何の募集か（川のそうじの日）を示します。']],
      rules: ['purpose-first'],
    }),
    bs('[S The city {前| of Midori}] [V is looking for] [O volunteers {to:形容詞>volunteers| [V to help] [O {原形| [V clean] [O the Midori River]}]}].', {
      chunks: [
        ['The city of Midori', 'みどり市は'],
        ['is looking for volunteers', 'ボランティアを探しています'],
        ['to help clean the Midori River.', 'みどり川のそうじを手伝う'],
      ],
      notes: {
        'to help clean the Midori River.': 'to help は volunteers を後ろから説明します。help の後ろは動詞の原形 clean が続く形です。',
      },
    }),
    bs('[独 When]: [独 Sunday, June 8, {前| from 9:00} {前| to 12:00}]', {
      fragment: true,
      chunks: [
        ['When:', '日時'],
        ['Sunday, June 8,', '6月8日の日曜日'],
        ['from 9:00 to 12:00', '9時から12時まで'],
      ],
      marks: [
        [':', '「日時」という項目名のあとに、その中身（6月8日の日曜日、9時から12時まで）を示します。'],
        [':', '時刻の「時」と「分」を区切る記号で、9:00 は9時ちょうどです。'],
        [':', '時刻の「時」と「分」を区切る記号で、12:00 は12時ちょうどです。'],
      ],
    }),
    bs('[独 Where]: [V Meet] [M {前| at the bridge {前| near Midori Station}}].', {
      chunks: [
        ['Where:', '場所'],
        ['Meet at the bridge', '橋に集合してください'],
        ['near Midori Station.', 'みどり駅の近くの'],
      ],
      marks: [[':', '「場所」という項目名のあとに、集まる場所を命令文で示します。']],
    }),
    bs('[S Volunteers] [V will pick up] [O garbage] [M {前| along the river}] [接 and] [V check] [O {疑問詞節| [C how clean] [S the water] [V is]}].', {
      chunks: [
        ['Volunteers will pick up garbage', 'ボランティアはごみを拾います'],
        ['along the river', '川沿いの'],
        ['and check', 'そして調べます'],
        ['how clean the water is.', '水がどのくらいきれいかを'],
      ],
    }),
    bs('[S You] [V do not need] [O any special tools], [M {副詞節:理由| [接 because] [S we] [V will give] [O1 you] [O2 {並列| gloves | and bags}]}].', {
      chunks: [
        ['You do not need', '必要ありません'],
        ['any special tools,', '特別な道具は'],
        ['because we will give you', 'なぜなら、わたしたちがあなたにあげるからです'],
        ['gloves and bags.', '手ぶくろとふくろを'],
      ],
      notes: {
        'because we will give you': '市がくれる物をたずねる設問の根拠になる部分です。give＋人＋もので「人にものをあげる」。',
      },
      rules: ['evidence-backtrack'],
    }),
    bs('[M Please] [V wear] [O clothes {関係>clothes| [S that] [V can get] [C dirty]}], [接 and] [V bring] [O {並列| a hat | and something {to:形容詞>something| [V to drink]}}].', {
      chunks: [
        ['Please wear clothes', '服を着てください'],
        ['that can get dirty,', 'よごれてもよい'],
        ['and bring a hat', 'そしてぼうしを持ってきてください'],
        ['and something to drink.', 'そして飲み物を'],
      ],
      notes: {
        'and something to drink.': 'to drink が something を後ろから説明して「飲むための何か」、つまり飲み物です。',
      },
    }),
    bs('[M Not] [S all volunteers] [V have to work] [M {前| for three hours}].', {
      chunks: [
        ['Not all volunteers', 'ボランティア全員が〜というわけではありません'],
        ['have to work', '働かなければならない'],
        ['for three hours.', '3時間'],
      ],
      notes: {
        'Not all volunteers': 'Not all は部分否定で、「全員が〜というわけではない」。3時間働かなくてよい人もいる、という意味です。',
      },
      rules: ['negation-scope'],
    }),
    bs('[S Junior high school students] [V can go] [M home] [M {前| at 10:30}] [M {副詞節:条件| [接 if] [S they] [V want]}].', {
      chunks: [
        ['Junior high school students', '中学生は'],
        ['can go home at 10:30', '10時30分に帰ることができます'],
        ['if they want.', 'もし希望すれば'],
      ],
      marks: [[':', '時刻の「時」と「分」を区切る記号で、10:30 は10時30分です。']],
      rules: ['negation-scope'],
    }),
    bs('[S Children {前| under 12}] [V must come] [M {前| with an adult}].', {
      chunks: [
        ['Children under 12', '12歳未満の子どもは'],
        ['must come with an adult.', '大人といっしょに来なければなりません'],
      ],
    }),
    bs('[M {副詞節:条件| [接 If] [S you] [V are] [C interested]}], [M please] [V send] [O an e-mail] [M {前| to the city office}] [M {前| by June 1}].', {
      chunks: [
        ['If you are interested,', 'もし興味があれば'],
        ['please send an e-mail', '電子メールを送ってください'],
        ['to the city office', '市役所へ'],
        ['by June 1.', '6月1日までに'],
      ],
      notes: {
        'by June 1.': 'by は「〜までに」と期限を表します。申しこみの期限は案内文の大事な条件です。',
      },
    }),
    bs('[M {前| After the event}], [S all volunteers] [V will get] [O a free lunch].', {
      chunks: [
        ['After the event,', 'イベントのあと'],
        ['all volunteers will get a free lunch.', 'ボランティア全員が無料の昼食をもらえます'],
      ],
    }),
    bs('[M Last year], [S {数量| more than two hundred} people] [V joined] [O the event] [接 and] [V collected] [O {数量| more than five hundred} kilograms {前| of trash}].', {
      chunks: [
        ['Last year,', '去年は'],
        ['more than two hundred people', '200人を超える人が'],
        ['joined the event', 'イベントに参加しました'],
        ['and collected', 'そして集めました'],
        ['more than five hundred kilograms of trash.', '500キログラムを超えるごみを'],
      ],
    }),
    bs('[M {前| Thanks to their effort}], [S {並列| more fish | and birds}] [V have returned] [M {前| to the river}].', {
      chunks: [
        ['Thanks to their effort,', 'その人たちの努力のおかげで'],
        ['more fish and birds', 'より多くの魚と鳥が'],
        ['have returned to the river.', '川に戻ってきました'],
      ],
    }),
    bs('[S This] [V is] [C a great chance {to:形容詞>a great chance| [V to protect] [O the environment] [接 and] [V meet] [O people] [M {前| in your local area}]}].', {
      chunks: [
        ['This is a great chance', 'これはよい機会です'],
        ['to protect the environment', '環境を守る'],
        ['and meet people', 'そして人と知り合う'],
        ['in your local area.', '地域の'],
      ],
    }),
  ]),
  br3_homestay: Object.freeze([
    bs('[独 Dear Ms. Hayashi],', {
      fragment: true,
      chunks: [
        ['Dear Ms. Hayashi,', '林先生へ'],
      ],
      notes: {
        'Dear Ms. Hayashi,': 'Eメールの書き出しの呼びかけです。だれからだれへのメールかを先につかみます。',
      },
    }),
    bs('[S I] [V have been] [M {前| in Vancouver}] [M {前| for two weeks}] [M now].', {
      chunks: [
        ['I have been in Vancouver', 'わたしはバンクーバーにいます'],
        ['for two weeks now.', 'もう2週間'],
      ],
      notes: {
        'I have been in Vancouver': 'have been＋for で「ずっと〜にいる」（継続の現在完了）です。',
      },
    }),
    bs('[S My host family, {同格>My host family| the Millers},] [V are] [C very kind {前| to me}].', {
      chunks: [
        ['My host family,', 'わたしのホストファミリー'],
        ['the Millers,', 'つまりミラーさん一家は'],
        ['are very kind to me.', 'わたしにとても親切です'],
      ],
    }),
    bs('[M Every morning], [S Mr. Miller] [V drives] [O me] [M {前| to a language school}].', {
      chunks: [
        ['Every morning,', '毎朝'],
        ['Mr. Miller drives me', 'ミラーさんはわたしを車で送ってくれます'],
        ['to a language school.', '語学学校まで'],
      ],
    }),
    bs('[S The students there] [V come] [M {前| from many countries}], [接 so] [S we] [M always] [V speak] [O English] [M {前| in class}].', {
      chunks: [
        ['The students there', 'そこの生徒たちは'],
        ['come from many countries,', 'いろいろな国から来ています'],
        ['so we always speak English', 'だから、わたしたちはいつも英語を話します'],
        ['in class.', '授業で'],
      ],
      notes: {
        'so we always speak English': 'so の後ろは、前の「いろいろな国から来ている」の結果です。',
      },
      rules: ['logic-connectors', 'cause-result'],
    }),
    bs('[M {前| At first}], [S I] [V could not understand] [O {what節| [O what] [S my teacher] [V said]}].', {
      chunks: [
        ['At first,', '最初は'],
        ['I could not understand', 'わたしは分かりませんでした'],
        ['what my teacher said.', '先生が言ったことが'],
      ],
      notes: {
        'what my teacher said.': 'what から said までがひとかたまりの名詞で、understand の目的語です。中は my teacher said のふつうの語順です。',
      },
      rules: ['wh-clause'],
    }),
    bs('[接 But] [M now] [S I] [V can follow] [O most {前| of the lessons}].', {
      chunks: [
        ['But now I can follow', 'でも今では、ついていけます'],
        ['most of the lessons.', 'ほとんどの授業に'],
      ],
    }),
    bs('[M Last weekend], [S the Millers] [V took] [O me] [M {前| to a lake {前| in the mountains}}].', {
      chunks: [
        ['Last weekend,', '先週末'],
        ['the Millers took me', 'ミラーさん一家はわたしを連れて行ってくれました'],
        ['to a lake in the mountains.', '山の中の湖に'],
      ],
    }),
    bs('[S The lake] [V was] [C so beautiful] [M {副詞節:結果| [接 that] [S I] [V took] [O {数量| more than a hundred} pictures]}].', {
      chunks: [
        ['The lake was so beautiful', '湖はとても美しかったです'],
        ['that I took', 'それで、わたしはとりました'],
        ['more than a hundred pictures.', '100枚を超える写真を'],
      ],
      notes: {
        'that I took': 'so … that で「とても…なので〜」。that の後ろが結果です。',
      },
    }),
    bs('[S I] [V will show] [O them] [M {前| to you}] [M {副詞節:時| [接 when] [S I] [V come back] [M {前| to Japan}]}].', {
      chunks: [
        ['I will show them to you', 'わたしはそれを先生に見せます'],
        ['when I come back to Japan.', '日本に帰ったときに'],
      ],
      notes: {
        'I will show them to you': 'them は複数の名詞を指します。前の文の pictures を当てはめると意味が通ります。',
      },
      rules: ['reference-chain'],
    }),
    bs('[S Mr. Miller] [V works] [M {前| for a big company {前| in the city}}], [接 and] [S Mrs. Miller] [V is] [C a nurse].', {
      chunks: [
        ['Mr. Miller works', 'ミラーさんは勤めています'],
        ['for a big company in the city,', '市内の大きな会社に'],
        ['and Mrs. Miller is a nurse.', 'そして奥さんは看護師です'],
      ],
    }),
    bs('[S They] [V are] [M both] [C busy], [接 but] [S they] [M always] [V eat] [O dinner] [M {前| with me}].', {
      chunks: [
        ['They are both busy,', '二人とも忙しいです'],
        ['but they always eat dinner', 'しかし、いつも夕食を食べてくれます'],
        ['with me.', 'わたしといっしょに'],
      ],
    }),
    bs('[M Next week], [S I] [V will give] [O a short speech {前| about Japanese culture}] [M {前| at the language school}].', {
      chunks: [
        ['Next week,', '来週'],
        ['I will give a short speech', 'わたしは短いスピーチをします'],
        ['about Japanese culture', '日本の文化について'],
        ['at the language school.', '語学学校で'],
      ],
    }),
    bs('[S I] [V am] [M a little] [C nervous], [接 but] [仮S it] [V is] [C a good chance] [真S {to:名詞| [V to introduce] [O our customs] [M {前| to my classmates}]}].', {
      chunks: [
        ['I am a little nervous,', 'わたしは少し緊張しています'],
        ['but it is a good chance', 'しかし、よい機会です'],
        ['to introduce our customs', 'わたしたちの習慣を紹介する'],
        ['to my classmates.', 'クラスメートに'],
      ],
    }),
    bs('[S I] [V want] [O {to:名詞| [V to improve] [O my English] [M even more]}] [M {副詞節:時| [接 before] [S I] [V return] [M {前| to Japan}]}].', {
      chunks: [
        ['I want to improve my English', 'わたしは英語を上達させたいです'],
        ['even more', 'もっと'],
        ['before I return to Japan.', '日本に帰る前に'],
      ],
    }),
    bs('[独 Best wishes],', {
      fragment: true,
      chunks: [
        ['Best wishes,', 'それでは'],
      ],
      notes: {
        'Best wishes,': '手紙やメールの結びのあいさつで、動詞のない語句です。',
      },
    }),
    bs('[独 Kenta]', {
      fragment: true,
      chunks: [
        ['Kenta', '健太'],
      ],
    }),
  ]),
  br3_helen_keller: Object.freeze([
    bs('[S Helen Keller] [V was born] [M {前| in the United States}] [M {前| in 1880}].', {
      chunks: [
        ['Helen Keller was born', 'ヘレン・ケラーは生まれました'],
        ['in the United States', 'アメリカで'],
        ['in 1880.', '1880年に'],
      ],
      notes: {
        'in 1880.': '年を表す語句が順に出てくるので、人物の一生を時の順にたどる伝記だと分かります。',
      },
      rules: ['genre-prediction'],
    }),
    bs('[M {副詞節:時| [接 When] [S she] [V was] [C a baby]}], [S she] [V became] [C very sick].', {
      chunks: [
        ['When she was a baby,', '赤ちゃんのとき'],
        ['she became very sick.', 'ヘレンは重い病気になりました'],
      ],
    }),
    bs('[M {前| After that}], [S she] [V could not] [V {並列| see | or hear}].', {
      chunks: [
        ['After that,', 'それから'],
        ['she could not see or hear.', 'ヘレンは目が見えず、耳も聞こえなくなりました'],
      ],
      notes: {
        'she could not see or hear.': 'not … or … で「〜も…もできない」。見ることと聞くことの両方を打ち消しています。',
      },
    }),
    bs('[S Helen] [V could not tell] [O1 people] [O2 {what節| [O what] [S she] [V wanted]}], [接 so] [S she] [V was] [M often] [C angry].', {
      chunks: [
        ['Helen could not tell people', 'ヘレンは人に伝えられませんでした'],
        ['what she wanted,', '自分のしてほしいことを'],
        ['so she was often angry.', 'だから、よく怒っていました'],
      ],
    }),
    bs('[M {前| In 1887}], [S a young teacher {過去分詞>a young teacher| [V named] [C Anne Sullivan]}] [V came] [M {前| to her house}].', {
      chunks: [
        ['In 1887,', '1887年'],
        ['a young teacher', '若い先生が'],
        ['named Anne Sullivan', 'アン・サリバンという名前の'],
        ['came to her house.', 'ヘレンの家にやって来ました'],
      ],
      notes: {
        'named Anne Sullivan': 'named は「〜という名前の」と teacher を後ろから説明します。文全体の動詞は came です。',
      },
      rules: ['main-clause-skeleton', 'postmodifier'],
    }),
    bs('[S Helen] [V was taught] [O many words] [M {前| by Anne}].', {
      chunks: [
        ['Helen was taught', 'ヘレンは教わりました'],
        ['many words', 'たくさんの言葉を'],
        ['by Anne.', 'アンによって'],
      ],
      notes: {
        'Helen was taught': 'be＋過去分詞の受け身です。by Anne を主語にすると「アンがヘレンにたくさんの言葉を教えた」となります。',
      },
      rules: ['passive-active'],
    }),
    bs(`[M One day], [S Anne] [V put] [O Helen's hand] [M {前| in cold water}] [接 and] [V spelled] [O the word "water"] [M {前| on her other hand}].`, {
      chunks: [
        ['One day,', 'ある日'],
        ["Anne put Helen's hand", 'アンはヘレンの手を入れました'],
        ['in cold water', '冷たい水に'],
        ['and spelled the word "water"', 'そして「ウォーター（水）」という語をつづりました'],
        ['on her other hand.', 'もう一方の手に'],
      ],
    }),
    bs('[M {前| At that moment}], [S Helen] [V understood] [O {that節| [接 that] [S everything] [V has] [O a name]}].', {
      chunks: [
        ['At that moment,', 'その瞬間'],
        ['Helen understood', 'ヘレンは理解しました'],
        ['that everything has a name.', 'すべてのものに名前があるということを'],
      ],
    }),
    bs('[M Later], [S Helen] [V studied] [M hard] [接 and] [V finished] [O college].', {
      chunks: [
        ['Later,', 'のちに'],
        ['Helen studied hard', 'ヘレンは一生けんめい勉強しました'],
        ['and finished college.', 'そして大学を卒業しました'],
      ],
    }),
    bs('[S She] [V traveled] [M {前| around the world}] [M {to:副詞(目的)| [V to help] [O people {関係>people| [S who] [V could not] [V {並列| see | or hear}]}]}].', {
      chunks: [
        ['She traveled around the world', 'ヘレンは世界中を旅しました'],
        ['to help people', '人々を助けるために'],
        ['who could not see or hear.', '目や耳が不自由な'],
      ],
    }),
    bs('[S She] [M also] [V visited] [O Japan] [M three times].', {
      chunks: [
        ['She also visited Japan', 'ヘレンは日本も訪れました'],
        ['three times.', '3回'],
      ],
    }),
    bs('[S She] [V asked] [O the government] [C {to:補語| [V to help] [O children {関係>children| [S who] [V could not see]}]}].', {
      chunks: [
        ['She asked the government', 'ヘレンは政府に求めました'],
        ['to help children', '子どもたちを助けるように'],
        ['who could not see.', '目の不自由な'],
      ],
      notes: {
        'to help children': 'ask＋人＋to do で「人に〜するように頼む」。to help は頼んだ中身です。',
      },
    }),
    bs('[S People {前| around the world}] [M still] [V read] [O the books {関係>the books| [O that] [S she] [V wrote]}].', {
      chunks: [
        ['People around the world', '世界中の人々が'],
        ['still read the books', '今でも本を読んでいます'],
        ['that she wrote.', 'ヘレンが書いた'],
      ],
    }),
    bs('[S Her story] [V has encouraged] [O many people {関係>many people| [S who] [V face] [O difficulties] [M {前| in their lives}]}].', {
      chunks: [
        ['Her story has encouraged', 'ヘレンの話は勇気づけてきました'],
        ['many people', '多くの人を'],
        ['who face difficulties', '困難に向き合う'],
        ['in their lives.', '人生で'],
      ],
    }),
    bs('[S It] [V shows] [O {that節| [接 that] [S {並列| courage | and support {前| from others}}] [V can help] [O people] [C {原形| [V do] [O amazing things]}]}].', {
      chunks: [
        ['It shows', 'それは示しています'],
        ['that courage and support from others', '勇気とまわりの人の支えが'],
        ['can help people', '人を助けられるということを'],
        ['do amazing things.', 'おどろくようなことをするのを'],
      ],
      notes: {
        'can help people': 'help＋人＋動詞の原形で「人が〜するのを助ける」。',
      },
    }),
  ]),
  br3_christmas_australia: Object.freeze([
    bs('[M {前| In Japan}], [S Christmas] [V comes] [M {前| in winter}].', {
      chunks: [
        ['In Japan,', '日本では'],
        ['Christmas comes in winter.', 'クリスマスは冬に来ます'],
      ],
    }),
    bs('[M However], [M {前| in Australia}], [S it] [V comes] [M {前| in summer}].', {
      chunks: [
        ['However,', 'しかし'],
        ['in Australia,', 'オーストラリアでは'],
        ['it comes in summer.', 'クリスマスは夏に来ます'],
      ],
      notes: {
        'However,': 'However の前で「ふつうは冬」という予想を示し、後ろでくつがえします。文章の中心は However の後ろです。',
      },
      rules: ['contrast-concession'],
    }),
    bs('[S The weather {前| on Christmas Day} {前| in Sydney}] [V is] [M usually] [C much warmer than {前| in Tokyo}].', {
      chunks: [
        ['The weather on Christmas Day', 'クリスマスの日の天気は'],
        ['in Sydney', 'シドニーの'],
        ['is usually much warmer', 'ふつうずっと暖かいです'],
        ['than in Tokyo.', '東京よりも'],
      ],
      notes: {
        'than in Tokyo.': 'than の後ろに the weather on Christmas Day が省略されています。比べているのはシドニーと東京の天気です。',
      },
      rules: ['comparison-pairs'],
    }),
    bs('[S Many Australian families] [V spend] [O Christmas Day] [M {並列| {前| at the beach} | or {前| in the park}}].', {
      chunks: [
        ['Many Australian families', 'オーストラリアの多くの家族は'],
        ['spend Christmas Day', 'クリスマスの日を過ごします'],
        ['at the beach or in the park.', '海辺や公園で'],
      ],
    }),
    bs('[S They] [M often] [V have] [O a meal] [M outside] [M {前| instead of a big hot dinner {前| at home}}].', {
      chunks: [
        ['They often have a meal outside', '家族はよく外で食事をします'],
        ['instead of a big hot dinner', '温かいごちそうの代わりに'],
        ['at home.', '家での'],
      ],
    }),
    bs('[S Some people] [M even] [V swim] [M {前| in the sea}] [M {前| on Christmas morning}].', {
      chunks: [
        ['Some people even swim', '泳ぐ人さえいます'],
        ['in the sea', '海で'],
        ['on Christmas morning.', 'クリスマスの朝に'],
      ],
    }),
    bs('[S Christmas songs] [V are] [M also] [C popular] [M {前| in Australia}].', {
      chunks: [
        ['Christmas songs are also popular', 'クリスマスの歌も人気があります'],
        ['in Australia.', 'オーストラリアで'],
      ],
    }),
    bs('[M {前| On Christmas Eve}], [S people] [V meet] [M {前| in parks}] [接 and] [V sing] [O songs] [M together] [M {前| with small lights {前| in their hands}}].', {
      chunks: [
        ['On Christmas Eve,', 'クリスマス・イブには'],
        ['people meet in parks', '人々は公園に集まります'],
        ['and sing songs together', 'そしていっしょに歌を歌います'],
        ['with small lights', '小さな明かりを持って'],
        ['in their hands.', '手に'],
      ],
    }),
    bs('[S Australians, {挿入| {前| like people {前| in many other countries}}},] [M still] [V enjoy] [O old songs {前| about snow}].', {
      chunks: [
        ['Australians,', 'オーストラリアの人々は'],
        ['like people in many other countries,', 'ほかの多くの国の人々と同じように'],
        ['still enjoy old songs', '今も昔の歌を楽しんでいます'],
        ['about snow.', '雪についての'],
      ],
      notes: {
        'like people in many other countries,': '二つのコンマにはさまれた補足です。外すと Australians still enjoy old songs about snow. が残ります。',
      },
      rules: ['insertion'],
    }),
    bs('[仮S It] [V is] [C interesting] [真S {to:名詞| [V to sing] [M {前| about snow}] [M {前| on a hot summer night}]}].', {
      chunks: [
        ['It is interesting', 'おもしろいことです'],
        ['to sing about snow', '雪の歌を歌うのは'],
        ['on a hot summer night.', '暑い夏の夜に'],
      ],
      notes: {
        'It is interesting': 'It は形式主語で、中身は後ろの to sing … です。',
      },
    }),
    bs('[M {前| In December}], [S some stores] [V hold] [O Christmas sales], [接 and] [S their staff] [V wear] [O Santa hats] [M {前| with summer clothes}].', {
      chunks: [
        ['In December,', '12月には'],
        ['some stores hold Christmas sales,', 'クリスマスセールをする店もあります'],
        ['and their staff wear Santa hats', 'そして店員はサンタのぼうしをかぶります'],
        ['with summer clothes.', '夏服に'],
      ],
    }),
    bs('[M {前| In Australia}], [S {並列| both Christmas Day | and the next day}] [V are] [C public holidays].', {
      chunks: [
        ['In Australia,', 'オーストラリアでは'],
        ['both Christmas Day and the next day', 'クリスマスの日とその次の日の両方が'],
        ['are public holidays.', '祝日です'],
      ],
    }),
    bs('[S Many families] [V celebrate] [M together] [M {前| with family members {関係>family members| [S who] [V travel] [M {前| from other cities}]}}].', {
      chunks: [
        ['Many families celebrate together', '多くの家族がいっしょにお祝いします'],
        ['with family members', '親せきと'],
        ['who travel from other cities.', 'ほかの町からやって来る'],
      ],
    }),
    bs('[S This custom] [V shows] [O {that節| [接 that] [S the same festival] [V can look] [C very different] [M {前| in different places}]}].', {
      chunks: [
        ['This custom shows', 'この習慣は示しています'],
        ['that the same festival', '同じ祭りでも'],
        ['can look very different', 'とても違って見えることがあると'],
        ['in different places.', '場所によって'],
      ],
    }),
  ]),
  br3_koalas: Object.freeze([
    bs('[S Koalas] [V live] [M only] [M {前| in the forests {前| of Australia}}].', {
      chunks: [
        ['Koalas live only', 'コアラはすんでいるだけです'],
        ['in the forests of Australia.', 'オーストラリアの森に'],
      ],
    }),
    bs('[S They] [V spend] [O most {前| of their lives}] [M {前| in trees}].', {
      chunks: [
        ['They spend most of their lives', 'コアラは一生のほとんどを過ごします'],
        ['in trees.', '木の上で'],
      ],
    }),
    bs('[S Many people] [V think] [O {that省略| [S koalas] [V are] [C lazy]}], [M {副詞節:理由| [接 because] [S they] [V sleep] [M about twenty hours] [M a day]}].', {
      chunks: [
        ['Many people think', '多くの人が思っています'],
        ['koalas are lazy,', 'コアラはなまけ者だと'],
        ['because they sleep', 'なぜなら、コアラは眠るからです'],
        ['about twenty hours a day.', '1日に約20時間'],
      ],
    }),
    bs('[S Koalas] [V eat] [O the leaves {前| of only a few kinds {前| of trees}}].', {
      chunks: [
        ['Koalas eat the leaves', 'コアラは葉を食べます'],
        ['of only a few kinds of trees.', 'ほんの数種類の木の'],
      ],
      notes: {
        'Koalas eat the leaves': '段落の最初の文で、この段落が食べ物の性質から眠る理由を説明する役割だと見当をつけます。',
      },
      rules: ['paragraph-map'],
    }),
    bs('[S These leaves] [V are] [C very hard {to:副詞(形容詞)| [V to digest]}].', {
      chunks: [
        ['These leaves are very hard', 'この葉はとてもむずかしいです'],
        ['to digest.', '消化するのが'],
      ],
      notes: {
        'to digest.': '知らない語 digest は、次の文の In other words のあとの言いかえ（胃が分解する）から推測します。',
      },
      rules: ['unknown-word-context'],
    }),
    bs(`[M {前| In other words}], [仮S it] [V takes] [O a long time] [真S {前:意味上の主語| for a koala's stomach} {to:名詞| [V to break] [O them] [M down]}].`, {
      chunks: [
        ['In other words,', 'つまり'],
        ['it takes a long time', '長い時間がかかります'],
        ["for a koala's stomach", 'コアラの胃が'],
        ['to break them down.', 'それを分解するのに'],
      ],
      notes: {
        'In other words,': 'In other words は「言いかえると」。前の文の hard to digest を、やさしい言葉で言いかえています。',
        "for a koala's stomach": 'for A to do の A は、to do の動作をする側（意味上の主語）です。',
      },
      rules: ['unknown-word-context'],
    }),
    bs('[S The leaves] [M also] [V give] [O1 koalas] [O2 very little energy], [接 so] [S they] [V need] [O {to:名詞| [V to sleep] [M a lot] [M {to:副詞(目的)| [V to save] [O energy]}]}].', {
      chunks: [
        ['The leaves also give koalas', 'その葉はコアラにあたえもします'],
        ['very little energy,', 'ほんの少しのエネルギーしか'],
        ['so they need to sleep a lot', 'だからコアラはたくさん眠る必要があります'],
        ['to save energy.', 'エネルギーを節約するために'],
      ],
      notes: {
        'so they need to sleep a lot': 'so の前（エネルギーが少ない）が原因、後ろ（たくさん眠る必要がある）が結果です。',
      },
      rules: ['cause-result'],
    }),
    bs('[接 So] [S koalas] [V are not] [C lazy].', {
      chunks: [
        ['So koalas are not lazy.', 'つまり、コアラはなまけ者ではありません'],
      ],
    }),
    bs('[S Their long sleep] [V is] [C a smart way {to:形容詞>a smart way| [V to live] [M {前| on their special food}]}].', {
      chunks: [
        ['Their long sleep is a smart way', '長く眠ることは賢いやり方です'],
        ['to live on their special food.', '特別な食べ物で生きていくための'],
      ],
    }),
    bs('[M Today], [S koalas] [V are] [M {前| in danger}] [M {副詞節:理由| [接 because] [S people] [V have cut down] [O many {前| of their forests}]}].', {
      chunks: [
        ['Today,', '今'],
        ['koalas are in danger', 'コアラは危険にさらされています'],
        ['because people have cut down', 'なぜなら、人々が切りひらいてしまったからです'],
        ['many of their forests.', 'コアラの森の多くを'],
      ],
    }),
    bs('[S The government {前| of Australia}] [V is working] [M {to:副詞(目的)| [V to protect] [O them]}].', {
      chunks: [
        ['The government of Australia', 'オーストラリアの政府は'],
        ['is working to protect them.', 'コアラを守るために取り組んでいます'],
      ],
    }),
    bs('[S Their population] [V has decreased] [M {前| in the last few years}] [M {前| because of {並列| forest fires, | accidents {前| on roads}, | and disease}}].', {
      chunks: [
        ['Their population has decreased', 'コアラの数は減っています'],
        ['in the last few years', 'ここ数年'],
        ['because of forest fires,', '森林火災のために'],
        ['accidents on roads, and disease.', '道路での事故、そして病気のために'],
      ],
    }),
    bs('[S Many volunteers] [V take care of] [O injured koalas] [接 and] [V return] [O them] [M {前| to the wild}].', {
      chunks: [
        ['Many volunteers take care of', '多くのボランティアが世話をします'],
        ['injured koalas', 'けがをしたコアラの'],
        ['and return them to the wild.', 'そして野生に帰します'],
      ],
    }),
  ]),
  br3_letter_in_bag: Object.freeze([
    bs('[S {並列| Mai | and Saki}] [V have been] [C friends] [M {前| since elementary school}].', {
      chunks: [
        ['Mai and Saki have been friends', 'マイとサキはずっと友達です'],
        ['since elementary school.', '小学校のころから'],
      ],
    }),
    bs('[S They] [V are] [M both] [C members {前| of the school orchestra}].', {
      chunks: [
        ['They are both members', '二人とも部員です'],
        ['of the school orchestra.', '学校のオーケストラの'],
      ],
    }),
    bs('[S Mai] [V plays] [O the piano], [接 and] [S Saki] [V plays] [O the violin].', {
      chunks: [
        ['Mai plays the piano,', 'マイはピアノをひきます'],
        ['and Saki plays the violin.', 'そしてサキはバイオリンをひきます'],
      ],
    }),
    bs('[M Last spring], [S their teacher] [V chose] [O Saki] [C {to:補語| [V to play] [M alone] [M {前| at the summer concert}]}].', {
      chunks: [
        ['Last spring,', '去年の春'],
        ['their teacher chose Saki', '先生はサキを選びました'],
        ['to play alone', '一人で演奏するように'],
        ['at the summer concert.', '夏のコンサートで'],
      ],
    }),
    bs('[S Mai] [V was] [C happy {前| for her friend}], [接 but] [S she] [M also] [V felt] [M a little] [C sad] [M {副詞節:理由| [接 because] [S she] [V wanted] [O {to:名詞| [V to play] [M alone]}], [M too]}].', {
      chunks: [
        ['Mai was happy for her friend,', 'マイは友達のことをうれしく思いました'],
        ['but she also felt a little sad', 'しかし少し悲しくもなりました'],
        ['because she wanted to play alone,', 'なぜなら一人で演奏したかったからです'],
        ['too.', '自分も'],
      ],
    }),
    bs('[M {前| For a week}], [S Mai] [V did not talk] [M {前| to Saki}] [M very much].', {
      chunks: [
        ['For a week,', '1週間'],
        ['Mai did not talk to Saki', 'マイはサキと話しませんでした'],
        ['very much.', 'あまり'],
      ],
    }),
    bs('[M One evening], [S Mai] [V found] [O a letter {過去分詞>a letter| [V left] [M {前| in her music bag}]}].', {
      chunks: [
        ['One evening,', 'ある晩'],
        ['Mai found a letter', 'マイは手紙を見つけました'],
        ['left in her music bag.', '楽譜のかばんに入れられた'],
      ],
      notes: {
        'left in her music bag.': 'left は be も have もなく名詞 a letter の後ろにあるので、「残された・入れられた」と説明する過去分詞です。',
      },
      rules: ['ing-ed-role', 'postmodifier'],
    }),
    bs('[S It] [V was] [M {前| from Saki}].', {
      chunks: [
        ['It was from Saki.', 'それはサキからでした'],
      ],
    }),
    bs(`[S It] [V said], [O {引用| "[S I][V 'm] [C nervous {前| about the concert}], [接 but] [S your piano] [M always] [V makes] [O me] [C brave]."}]`, {
      chunks: [
        ['It said,', 'そこには書いてありました'],
        ['"I\'m nervous about the concert,', 'コンサートが不安だ'],
        ['but your piano always makes me brave."', 'でもマイのピアノがいつもわたしを勇気づけてくれる'],
      ],
      notes: {
        'but your piano always makes me brave."': 'make＋人＋状態で「人を〜にする」。me が目的語、brave が補語です。',
      },
      rules: ['svoc-core'],
    }),
    bs('[S Mai] [V cried] [M {副詞節:時| [接 when] [S she] [V read] [O it]}].', {
      chunks: [
        ['Mai cried', 'マイは泣きました'],
        ['when she read it.', 'それを読んだとき'],
      ],
      notes: {
        'Mai cried': '「いやで泣いた」と読むと次の文と合わなくなります。前の文の手紙の中身を見直して、泣いた理由を読み直します。',
      },
      rules: ['repair-monitor'],
    }),
    bs('[S The next day], [S Mai] [V said] [O sorry] [M {前| to Saki}], [接 and] [S they] [V practiced] [M together] [M {前| after school}].', {
      chunks: [
        ['The next day,', '次の日'],
        ['Mai said sorry to Saki,', 'マイはサキにあやまりました'],
        ['and they practiced together', 'そして二人はいっしょに練習しました'],
        ['after school.', '放課後に'],
      ],
    }),
    bs('[M {前| At the concert}], [S Saki] [V played] [M beautifully], [接 and] [S Mai] [V was] [C the happiest person {前| in the hall}].', {
      chunks: [
        ['At the concert,', 'コンサートで'],
        ['Saki played beautifully,', 'サキは美しく演奏しました'],
        ['and Mai was the happiest person', 'そしてマイはいちばん幸せな人でした'],
        ['in the hall.', '会場で'],
      ],
    }),
    bs('[M {前| After the concert}], [S the two friends] [V promised] [O {to:名詞| [V to support] [O each other] [M {前| in the future}], [M too]}].', {
      chunks: [
        ['After the concert,', 'コンサートのあと'],
        ['the two friends promised', '二人は約束しました'],
        ['to support each other', 'おたがいを支え合うことを'],
        ['in the future, too.', 'これからも'],
      ],
    }),
    bs('[S Mai] [V realized] [O {that節| [接 that] [S a true friend] [V is] [C someone {関係>someone| [S who] [V can be] [C happy {前| about your success}]}]}].', {
      chunks: [
        ['Mai realized', 'マイは気づきました'],
        ['that a true friend is someone', '本当の友達とは人だということに'],
        ['who can be happy', '喜ぶことができる'],
        ['about your success.', 'あなたの成功を'],
      ],
    }),
  ]),
  br3_recycling: Object.freeze([
    bs('[S Some people] [V say] [O {that節| [接 that] [S recycling] [V is] [C too much work]}].', {
      chunks: [
        ['Some people say', '言う人がいます'],
        ['that recycling is too much work.', 'リサイクルは手間がかかりすぎると'],
      ],
      notes: {
        'Some people say': 'Some people say はほかの人の意見を紹介する合図です。筆者の意見と分けて読みます。',
      },
      rules: ['author-stance', 'distractor-strength'],
    }),
    bs('[S Others] [V say] [O {that省略| [S it] [V does not] [M really] [V help] [O the earth]}].', {
      chunks: [
        ['Others say', 'ほかの人は言います'],
        ['it does not really help the earth.', 'それは本当は地球の役に立っていないと'],
      ],
      rules: ['author-stance'],
    }),
    bs('[S I] [V believe] [O {that省略| [S recycling] [V is] [C important]}].', {
      chunks: [
        ['I believe', 'わたしは考えます'],
        ['recycling is important.', 'リサイクルは大切だと'],
      ],
      notes: {
        'I believe': 'I believe から、筆者自身の意見が始まります。',
      },
      rules: ['author-stance'],
    }),
    bs('[S Many things {前| around us}] [V can be used] [M again].', {
      chunks: [
        ['Many things around us', '身の回りの多くの物は'],
        ['can be used again.', 'もう一度使うことができます'],
      ],
      notes: {
        'Many things around us': '次の文の For example の具体例は、この文の内容（もう一度使える物）の例です。',
      },
      rules: ['example-restatement'],
    }),
    bs('[M {前| For example}], [S old plastic bottles] [V can become] [C clothes], [接 and] [S old paper] [V can become] [C new notebooks].', {
      chunks: [
        ['For example,', 'たとえば'],
        ['old plastic bottles can become clothes,', '古いペットボトルは服になることができます'],
        ['and old paper can become new notebooks.', 'そして古い紙は新しいノートになることができます'],
      ],
      notes: {
        'old plastic bottles can become clothes,': 'can become は「なることができる」。すべてのボトルが服になるとは言っていません。',
      },
      rules: ['example-restatement', 'distractor-strength'],
    }),
    bs('[S Recycling] [M also] [V means] [O {that節| [接 that] [S we] [V throw away] [O less garbage]}].', {
      chunks: [
        ['Recycling also means', 'リサイクルはまた意味します'],
        ['that we throw away less garbage.', '捨てるごみが減るということを'],
      ],
    }),
    bs('[M {前| In many towns {前| in Japan}}], [S people] [V put out] [O {並列| cans, | bottles, | and paper}] [M {前| on different days}].', {
      chunks: [
        ['In many towns in Japan,', '日本の多くの町では'],
        ['people put out', '人々は出します'],
        ['cans, bottles, and paper', 'かん・びん・紙を'],
        ['on different days.', '別々の日に'],
      ],
    }),
    bs('[S Some companies] [V make] [O new goods] [M {前| from these things}], [接 so] [S recycling] [V can] [M also] [V create] [O work] [M {前| for people}].', {
      chunks: [
        ['Some companies make new goods', '新しい商品を作る会社もあります'],
        ['from these things,', 'それらから'],
        ['so recycling can also create work', 'だからリサイクルは仕事を生むこともできます'],
        ['for people.', '人々のための'],
      ],
    }),
    bs('[M {前| Of course}], [S recycling] [V cannot solve] [O every problem {前| with the environment}].', {
      chunks: [
        ['Of course,', 'もちろん'],
        ['recycling cannot solve every problem', 'リサイクルですべての問題が解決できるわけではありません'],
        ['with the environment.', '環境の'],
      ],
      notes: {
        'recycling cannot solve every problem': 'cannot … every は「すべてが〜できるわけではない」という部分否定です。Of course で反対の考えの一部を認めています。',
      },
      rules: ['author-stance', 'distractor-strength'],
    }),
    bs('[接 But] [M {副詞節:条件| [接 if] [S everyone] [V does] [O a little]}], [S it] [V can make] [O a big difference].', {
      chunks: [
        ['But if everyone does a little,', 'でも、もしみんなが少しずつ行えば'],
        ['it can make a big difference.', 'それは大きな違いを生むことができます'],
      ],
      rules: ['author-stance'],
    }),
    bs('[S I] [V hope] [O {that省略| [S more students {前| at my school}] [V will try] [O it]}].', {
      chunks: [
        ['I hope', 'わたしは願います'],
        ['more students at my school', 'わたしの学校のもっと多くの生徒が'],
        ['will try it.', 'それをやってみることを'],
      ],
    }),
    bs(`[V Let][O 's] [C {原形| [V start] [M {前| with one small step}], [M {前| like {動名詞| [V bringing] [O our own bags] [M {副詞節:時| [接 when] [S we] [V go] [M shopping]}]}}]}].`, {
      chunks: [
        ["Let's start", '始めましょう'],
        ['with one small step,', '小さな一歩から'],
        ['like bringing our own bags', '自分のふくろを持っていくような'],
        ['when we go shopping.', '買い物に行くときに'],
      ],
      notes: {
        "Let's start": "Let's は Let us の短くなった形で、「〜しよう」と誘う言い方です。",
      },
    }),
  ]),
  br3_basketball: Object.freeze([
    bs('[S Basketball] [V is] [C one {前| of the most popular sports {前| in the world}}].', {
      chunks: [
        ['Basketball is one', 'バスケットボールは一つです'],
        ['of the most popular sports', 'もっとも人気のあるスポーツの'],
        ['in the world.', '世界で'],
      ],
    }),
    bs('[接 But] [V do] [S you] [V know] [O {that節| [接 that] [S it] [V was born] [M {前| in a gym {前| in the United States}}]}]?', {
      chunks: [
        ['But do you know', 'でも、知っていますか'],
        ['that it was born', 'それが生まれたということを'],
        ['in a gym in the United States?', 'アメリカの体育館で'],
      ],
      notes: {
        'that it was born': 'that の後ろが主語と動詞のそろった文なので、「〜ということ」という名詞節で、know の目的語です。',
      },
      rules: ['that-diagnosis'],
    }),
    bs('[M {前| In 1891}], [S James Naismith] [V was] [C a teacher {前| at a school {前| in Massachusetts}}].', {
      chunks: [
        ['In 1891,', '1891年'],
        ['James Naismith was a teacher', 'ジェームズ・ネイスミスは先生でした'],
        ['at a school in Massachusetts.', 'マサチューセッツ州の学校の'],
      ],
    }),
    bs('[M {前| In winter}], [S it] [V was] [C too cold {to:副詞(程度)| [V to play] [O sports] [M outside]}], [接 and] [S his students] [V got] [C bored] [M {前| in the gym}].', {
      chunks: [
        ['In winter,', '冬は'],
        ['it was too cold', '寒すぎました'],
        ['to play sports outside,', '外でスポーツをするには'],
        ['and his students got bored', 'そして生徒たちは退屈していました'],
        ['in the gym.', '体育館で'],
      ],
      notes: {
        'it was too cold': 'too … to do で「〜するには…すぎる」。it は寒さ・天気を表す主語です。',
      },
    }),
    bs('[S Naismith] [V wanted] [O {to:名詞| [V to create] [O a game {関係>a game| [O that] [S students] [V could play] [M inside]}]}].', {
      chunks: [
        ['Naismith wanted to create a game', 'ネイスミスは競技を作りたいと思いました'],
        ['that students could play inside.', '生徒が屋内でできる'],
      ],
      notes: {
        'that students could play inside.': 'that の直前の a game が先行詞です。節の中で play の目的語が欠けていて、それが a game です。',
      },
      rules: ['relative-clause'],
    }),
    bs('[S He] [V put] [O two containers {前| for peaches}] [M high] [M {前| on the walls {前| of the gym}}], [接 and] [S the players] [V tried] [O {to:名詞| [V to throw] [O a ball] [M {前| into them}]}].', {
      chunks: [
        ['He put two containers for peaches', '彼は桃を入れる入れ物を二つ付けました'],
        ['high on the walls of the gym,', '体育館のかべの高いところに'],
        ['and the players tried', 'そして選手たちはしようとしました'],
        ['to throw a ball into them.', 'その中にボールを投げ入れることを'],
      ],
      notes: {
        'and the players tried': '主語と組になる動詞は put と tried の二つです。to throw は to＋動詞の原形なので数えません。',
      },
      rules: ['finite-verb-check'],
    }),
    bs('[M {前| At first}], [S the game] [V had] [O only thirteen rules].', {
      chunks: [
        ['At first,', '最初'],
        ['the game had only thirteen rules.', 'その競技にはルールが13しかありませんでした'],
      ],
    }),
    bs('[M {前| After each goal}], [S someone] [V had to climb] [O a ladder] [M {to:副詞(目的)| [V to get] [O the ball] [M out]}].', {
      chunks: [
        ['After each goal,', '点が入るたびに'],
        ['someone had to climb a ladder', 'だれかがはしごを登らなければなりませんでした'],
        ['to get the ball out.', 'ボールを取り出すために'],
      ],
    }),
    bs('[M Today], [S millions {前| of people {前| around the world}}] [V enjoy] [O the game {関係>the game| [O that] [S Naismith] [V created]}].', {
      chunks: [
        ['Today,', '今では'],
        ['millions of people around the world', '世界中の何百万もの人々が'],
        ['enjoy the game', 'その競技を楽しんでいます'],
        ['that Naismith created.', 'ネイスミスが作った'],
      ],
    }),
    bs('[S Basketball] [V is] [M now] [V played] [M {前| in {数量| more than two hundred} countries}], [接 and] [S it] [V has been] [C an Olympic sport] [M {前| since 1936}].', {
      chunks: [
        ['Basketball is now played', 'バスケットボールは今では行われています'],
        ['in more than two hundred countries,', '200を超える国で'],
        ['and it has been an Olympic sport', 'そしてオリンピックの競技になっています'],
        ['since 1936.', '1936年から'],
      ],
    }),
    bs('[S Some {前| of the most famous athletes {前| in the world}}] [V are] [C basketball players].', {
      chunks: [
        ['Some of the most famous athletes', 'もっとも有名な運動選手の何人かは'],
        ['in the world', '世界で'],
        ['are basketball players.', 'バスケットボールの選手です'],
      ],
    }),
    bs('[仮S It] [V is] [C amazing] [真S {that節| [接 that] [S a simple idea {前| from one teacher}] [V became] [C such a popular global sport]}].', {
      chunks: [
        ['It is amazing', 'おどろくべきことです'],
        ['that a simple idea from one teacher', '一人の先生の単純な考えが'],
        ['became such a popular global sport.', 'これほど人気のある世界的なスポーツになったのは'],
      ],
      notes: {
        'It is amazing': 'It は形式主語で、中身は後ろの that 以下です。',
      },
    }),
  ]),
  br3_breakfast: Object.freeze([
    bs('[S Many people] [V say] [O {that節| [接 that] [S breakfast] [V is] [C the most important meal {前| of the day}]}].', {
      chunks: [
        ['Many people say', '多くの人が言います'],
        ['that breakfast is', '朝食は〜だと'],
        ['the most important meal of the day.', '一日でいちばん大切な食事'],
      ],
    }),
    bs('[M Why] [V do] [S they] [V think] [M so]?', {
      chunks: [
        ['Why do they think so?', 'なぜその人たちはそう考えるのでしょうか'],
      ],
    }),
    bs('[M {副詞節:時| [接 While] [S we] [V are sleeping]}], [S our bodies] [M still] [V use] [O energy].', {
      chunks: [
        ['While we are sleeping,', 'わたしたちが眠っている間'],
        ['our bodies still use energy.', '体はそれでもエネルギーを使っています'],
      ],
      notes: {
        'our bodies still use energy.': '朝食が大切な理由の背景の説明です。食べない理由をたずねる設問なら、ここは大まかに読みます。',
      },
      rules: ['reading-mode'],
    }),
    bs('[M {前| In the morning}], [S our brains] [V need] [O food] [M {to:副詞(目的)| [V to start] [O {動名詞| [V working]}]}].', {
      chunks: [
        ['In the morning,', '朝'],
        ['our brains need food', '脳は食べ物を必要とします'],
        ['to start working.', '働き始めるために'],
      ],
    }),
    bs('[S A breakfast {前| of {並列| rice, | fish, | and soup}}] [V gives] [O1 us] [O2 energy] [接 and] [V helps] [O us] [C {原形| [V stay] [C healthy]}].', {
      chunks: [
        ['A breakfast of rice, fish, and soup', 'ご飯・魚・汁物の朝食は'],
        ['gives us energy', 'わたしたちにエネルギーをくれます'],
        ['and helps us stay healthy.', 'そして健康でいる助けになります'],
      ],
      notes: {
        'and helps us stay healthy.': 'and の後ろの helps と同じ形を前にさかのぼると、gives が見つかります。朝食がすることが二つ並んでいます。',
      },
      rules: ['parallel-shape'],
    }),
    bs('[M However], [S many young people] [V do not eat] [O breakfast].', {
      chunks: [
        ['However,', 'ところが'],
        ['many young people do not eat breakfast.', '多くの若い人は朝食を食べません'],
      ],
    }),
    bs('[S Some] [V say] [O {that省略| [S they] [V do not have] [O time]}], [接 and] [S others] [V say] [O {that省略| [S they] [V are not] [C hungry] [M {前| in the morning}]}].', {
      chunks: [
        ['Some say', '言う人もいます'],
        ['they do not have time,', '時間がないと'],
        ['and others say', 'そして言う人もいます'],
        ['they are not hungry in the morning.', '朝はおなかがすいていないと'],
      ],
      notes: {
        'Some say': '朝食を食べない理由が書かれた文です。設問の根拠になるので、ペースを落として読みます。',
      },
      rules: ['reading-mode'],
    }),
    bs('[M Even] [S a banana {過去分詞>a banana| [V eaten] [M {前| on the way {前| to school}}]}] [V is] [C better {前| than nothing}].', {
      chunks: [
        ['Even a banana', 'バナナでさえ'],
        ['eaten on the way to school', '学校へ行く途中で食べる'],
        ['is better than nothing.', '何もないよりはよいのです'],
      ],
      notes: {
        'eaten on the way to school': 'eaten は a banana を後ろから「食べられる」と説明する過去分詞です。文の動詞は is です。',
      },
      rules: ['postmodifier'],
    }),
    bs('[V Try] [O {to:名詞| [V to eat] [O something] [M every morning]}], [接 and] [S you] [V will feel] [O the difference].', {
      chunks: [
        ['Try to eat something', '何か食べるようにしてみてください'],
        ['every morning,', '毎朝'],
        ['and you will feel the difference.', 'そうすれば違いを感じるでしょう'],
      ],
      notes: {
        'and you will feel the difference.': '命令文＋and で「〜しなさい、そうすれば…」という意味になります。',
      },
    }),
    bs('[S Some schools {前| in Japan}] [M even] [V serve] [O breakfast] [M {前| to students}] [M {前| before classes}].', {
      chunks: [
        ['Some schools in Japan', '日本のいくつかの学校は'],
        ['even serve breakfast to students', '生徒に朝食を出しさえします'],
        ['before classes.', '授業の前に'],
      ],
    }),
    bs('[S Doctors] [V say] [O {that節| [接 that] [S children {関係>children| [S who] [V eat] [O breakfast] [M every day]}] [V are] [M often] [C healthier]}].', {
      chunks: [
        ['Doctors say', '医者は言います'],
        ['that children', '子どもは'],
        ['who eat breakfast every day', '毎日朝食を食べる'],
        ['are often healthier.', 'より健康なことが多いと'],
      ],
    }),
  ]),
  br3_smartphones: Object.freeze([
    bs('[M Today], [S many junior high school students] [V have] [O their own smartphones].', {
      chunks: [
        ['Today,', '今では'],
        ['many junior high school students', '多くの中学生が'],
        ['have their own smartphones.', '自分のスマートフォンを持っています'],
      ],
    }),
    bs('[S They] [V use] [O them] [M {to:副詞(目的)| [V to send] [O messages], [V take] [O pictures], [接 and] [V look for] [O information]}].', {
      chunks: [
        ['They use them', '生徒たちはそれを使います'],
        ['to send messages,', 'メッセージを送るために'],
        ['take pictures,', '写真をとるために'],
        ['and look for information.', 'そして情報を探すために'],
      ],
    }),
    bs('[S Smartphones] [V are] [C useful], [接 but] [S they] [M also] [V cause] [O some problems]: [S students] [V may sleep] [M less], [V study] [M less], [接 and] [V spend] [O less time] [M {前| with their families}].', {
      chunks: [
        ['Smartphones are useful,', 'スマートフォンは便利です'],
        ['but they also cause some problems:', 'しかし、いくつかの問題も起こします'],
        ['students may sleep less,', '生徒は眠る時間が減るかもしれません'],
        ['study less,', '勉強も減るかもしれません'],
        ['and spend less time', 'そして過ごす時間も減るかもしれません'],
        ['with their families.', '家族と'],
      ],
      marks: [[':', '前の「いくつかの問題」の中身を、コロンの後ろで具体的に説明します。']],
      rules: ['punctuation-map'],
    }),
    bs('[S The number {前| of hours {関係>hours| [O that] [S we] [V spend] [M {前| on our phones}] [M each day]}}] [V is] [C something {to:形容詞>something| [V to think about]}].', {
      chunks: [
        ['The number of hours', '時間の長さは'],
        ['that we spend on our phones', 'わたしたちがスマートフォンに使う'],
        ['each day', '毎日'],
        ['is something to think about.', '考えるべきことです'],
      ],
      notes: {
        'The number of hours': 'The を目印に読み進めると、中心の名詞は number です。後ろの語句はすべて number の説明です。',
      },
      rules: ['noun-boundary'],
    }),
    bs('[S I] [V think] [O {that省略| [S the most important thing] [V is] [C {to:補語| [V to make] [O our own rules]}]}].', {
      chunks: [
        ['I think', 'わたしは思います'],
        ['the most important thing is', 'いちばん大切なことは〜だと'],
        ['to make our own rules.', '自分たちのルールを作ること'],
      ],
      notes: {
        'to make our own rules.': 'is の後ろの to make は「作ること」で、主語の the most important thing の中身を表す補語です。',
      },
      rules: ['infinitive-role'],
    }),
    bs('[M {前| For example}], [M {前| in my family}], [S nobody] [V uses] [O a phone] [M {前| during dinner}].', {
      chunks: [
        ['For example,', 'たとえば'],
        ['in my family,', 'わたしの家族では'],
        ['nobody uses a phone', 'だれもスマートフォンを使いません'],
        ['during dinner.', '夕食の間は'],
      ],
    }),
    bs('[M {前| Because of this rule}], [S we] [V talk] [M more] [M {前| with each other}].', {
      chunks: [
        ['Because of this rule,', 'このルールのおかげで'],
        ['we talk more with each other.', 'わたしたちはおたがいにもっと話します'],
      ],
    }),
    bs('[S Smartphones] [V are] [C tools], [接 and] [S we] [V should decide] [O {疑問詞to| [M how] [V to use] [O them]}].', {
      chunks: [
        ['Smartphones are tools,', 'スマートフォンは道具です'],
        ['and we should decide', 'そして、わたしたちは決めるべきです'],
        ['how to use them.', 'その使い方を'],
      ],
    }),
    bs('[S Some countries] [M even] [V have] [O laws {関係>laws| [S that] [V stop] [O students] [M {前| from {動名詞| [V using] [O phones] [M {前| at school}]}}]}].', {
      chunks: [
        ['Some countries even have laws', '法律がある国さえあります'],
        ['that stop students', '生徒を止める'],
        ['from using phones at school.', '学校でスマートフォンを使うことから'],
      ],
      notes: {
        'from using phones at school.': 'stop A from -ing で「Aが〜するのを止める」。',
      },
    }),
    bs('[O What rules] [V would] [S you] [V make] [M {前| for yourself}]?', {
      chunks: [
        ['What rules would you make', 'あなたならどんなルールを作りますか'],
        ['for yourself?', '自分のために'],
      ],
    }),
  ]),
})
