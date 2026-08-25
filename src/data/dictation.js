// 英検級別ディクテーション専用データ。
//
// 英検本試験に「全文を書き取る」形式はないため、これは過去問の再現ではない。
// 公式が示す各級のリスニングの場面・題材・放送回数と級の目安を土台に、
// 聞き取り＋綴りの練習用として、文長・構文・話題を段階化したオリジナル問題。
// 設計確認日: 2026-07-27
// https://www.eiken.or.jp/eiken/exam/criteria/
// https://www.eiken.or.jp/eiken/exam/

export const DICTATION_PROFILES = Object.freeze({
  '5': Object.freeze({
    label: '5級',
    benchmark: '中学初級・身近な一文',
    target: '家庭・学校・予定を、基本語と単純な語順で聞き取る',
    wordRange: Object.freeze([5, 8]),
    recommendedPlays: 2,
    rate: 0.84,
    slowRate: 0.64,
    passScore: 90,
  }),
  '4': Object.freeze({
    label: '4級',
    benchmark: '中学中級・少し長い一文',
    target: '過去・未来・比較・理由を含む身近な英文を聞き取る',
    wordRange: Object.freeze([7, 11]),
    recommendedPlays: 2,
    rate: 0.88,
    slowRate: 0.67,
    passScore: 90,
  }),
  '3': Object.freeze({
    label: '3級',
    benchmark: '中学卒業・節を含む一文',
    target: '経験・条件・関係節を含む日常的な説明を聞き取る',
    wordRange: Object.freeze([9, 14]),
    recommendedPlays: 2,
    rate: 0.92,
    slowRate: 0.7,
    passScore: 90,
  }),
  pre2: Object.freeze({
    label: '準2級',
    benchmark: '高校中級・短い説明',
    target: '学校・地域・科学などの具体的な説明を一回で捉える',
    wordRange: Object.freeze([12, 17]),
    recommendedPlays: 1,
    rate: 0.96,
    slowRate: 0.73,
    passScore: 90,
  }),
  '2': Object.freeze({
    label: '2級',
    benchmark: '高校卒業・社会的な説明',
    target: '教育・環境・医療・技術などの因果関係を一回で捉える',
    wordRange: Object.freeze([15, 21]),
    recommendedPlays: 1,
    rate: 1,
    slowRate: 0.76,
    passScore: 90,
  }),
  pre1: Object.freeze({
    label: '準1級',
    benchmark: '大学中級・複雑な社会的内容',
    target: '留保・対比・因果を含む社会性の高い複文を一回で捉える',
    wordRange: Object.freeze([20, 27]),
    recommendedPlays: 1,
    rate: 1.04,
    slowRate: 0.79,
    passScore: 90,
  }),
  '1': Object.freeze({
    label: '1級',
    benchmark: '大学上級・抽象的で幅広い内容',
    target: '論証・含意・複数の修飾関係を含む高度な文を一回で捉える',
    wordRange: Object.freeze([26, 34]),
    recommendedPlays: 1,
    rate: 1.08,
    slowRate: 0.82,
    passScore: 90,
  }),
})

// [英文, 和訳, 話題, 音声場面, 学習焦点]
const RAW_ITEMS = {
  '5': [
    ['My sister walks to school every morning.', '姉は毎朝歩いて学校へ行きます。', '学校', '短文', '現在形'],
    ['Please put your bag under the chair.', 'かばんをいすの下に置いてください。', '家庭', '指示', '命令文・前置詞'],
    ['We have math class after lunch.', '私たちは昼食後に数学の授業があります。', '学校', '短文', '時を表す句'],
    ['Can you open the window for me?', '私のために窓を開けてくれますか。', '家庭', '会話', 'can の疑問文'],
    ['I usually play tennis on Sundays.', '私はたいてい日曜日にテニスをします。', '趣味', '短文', '頻度・曜日'],
    ['Our dog is sleeping by the door.', '私たちの犬はドアのそばで寝ています。', '家庭', '短文', '現在進行形'],
    ['What time does the movie start?', 'その映画は何時に始まりますか。', '映画', '会話', '疑問詞'],
    ['My father cooks dinner on Fridays.', '父は金曜日に夕食を作ります。', '食事', '短文', '三単現'],
    ['There are three apples in the basket.', 'かごの中にりんごが3個あります。', '買い物', '短文', 'there is 構文'],
    ['I want a glass of water.', '私はコップ1杯の水が欲しいです。', '食事', '会話', 'want・数量'],
    ['She can speak English very well.', '彼女は英語をとても上手に話せます。', '学校', '短文', '助動詞 can'],
    ['This bus goes to the station.', 'このバスは駅へ行きます。', '交通', '案内', '三単現'],
    ['Do not forget your blue umbrella.', '青い傘を忘れないでください。', '天気', '指示', '否定命令文'],
    ['Ken is reading a book upstairs.', 'ケンは2階で本を読んでいます。', '家庭', '短文', '現在進行形'],
    ['We will visit our grandmother tomorrow.', '私たちは明日祖母を訪ねます。', '家族', '短文', '未来 will'],
    ['The library closes at five today.', '図書館は今日は5時に閉まります。', '地域', '案内', '時刻'],
    ['Please call me after school.', '放課後に私へ電話してください。', '学校', '会話', '命令文'],
    ['My birthday is in September.', '私の誕生日は9月です。', '自己紹介', '短文', 'be 動詞・月'],
    ['They are watching a soccer game.', '彼らはサッカーの試合を見ています。', 'スポーツ', '短文', '現在進行形'],
    ['I ate toast and eggs for breakfast.', '私は朝食にトーストと卵を食べました。', '食事', '短文', '過去形'],
  ],
  '4': [
    ['We visited an old castle during our trip.', '私たちは旅行中に古い城を訪れました。', '旅行', '短文', '過去形'],
    ['My brother has to practice the piano tonight.', '兄は今夜ピアノを練習しなければなりません。', '音楽', '短文', 'have to'],
    ['If it rains, we will stay at home.', '雨が降ったら、私たちは家にいます。', '天気', '短文', '条件節'],
    ['The girl next door always helps my grandmother.', '隣の女の子はいつも祖母を手伝ってくれます。', '地域', '短文', '頻度・目的語'],
    ['I saw a beautiful rainbow after the storm.', '嵐のあとに美しい虹を見ました。', '天気', '短文', '過去形・時の句'],
    ['Could you tell me how to get there?', 'そこへの行き方を教えていただけますか。', '道案内', '会話', '丁寧な依頼'],
    ['This camera is easier to use than mine.', 'このカメラは私のものより使いやすいです。', '買い物', '会話', '比較級'],
    ['We were playing basketball when the bell rang.', 'ベルが鳴ったとき、私たちはバスケットボールをしていました。', '学校', '短文', '過去進行形'],
    ['You should bring a jacket because it is cold.', '寒いので上着を持ってくるべきです。', '天気', '会話', '助言・理由'],
    ['I am going to join the science club.', '私は科学部に入る予定です。', '学校', '短文', 'be going to'],
    ['The train left ten minutes before we arrived.', '私たちが着く10分前に電車は出ました。', '交通', '短文', '過去形・before'],
    ['Nancy bought a present for her younger cousin.', 'ナンシーはいとこの年下の子に贈り物を買いました。', '家族', '短文', '過去形'],
    ['How many students were absent from class today?', '今日は何人の生徒が授業を欠席しましたか。', '学校', '会話', 'how many'],
    ['I think this restaurant serves the best noodles.', 'この店が一番おいしい麺を出すと思います。', '食事', '会話', '最上級'],
    ['Our teacher showed us pictures from Canada.', '先生は私たちにカナダの写真を見せました。', '海外文化', '短文', '第4文型'],
    ['The concert was canceled because of the snow.', 'そのコンサートは雪のため中止されました。', '音楽', '案内', '受動態'],
    ['Please remember to turn off the lights.', '忘れずに明かりを消してください。', '家庭', '指示', '不定詞'],
    ['Tom is tall enough to reach the shelf.', 'トムは棚に手が届くほど背が高いです。', '家庭', '短文', 'enough to'],
    ['We need more chairs for the school festival.', '学校祭のためにもっといすが必要です。', '学校', '短文', '数量表現'],
    ['My mother asked me to wash the dishes.', '母は私に皿を洗うよう頼みました。', '家庭', '短文', 'ask 人 to'],
  ],
  '3': [
    ['I have lived in this town since I was five.', '私は5歳のときからこの町に住んでいます。', '地域', '短文', '現在完了・since'],
    ['If you finish your homework early, you can join us.', '宿題を早く終えたら、私たちと一緒に参加できます。', '学校', '会話', '条件節'],
    ['The museum that we visited last week was very interesting.', '先週訪れた博物館はとても興味深かったです。', '旅行', '短文', '関係代名詞'],
    ['I was surprised to hear that she won the contest.', '彼女が大会で優勝したと聞いて驚きました。', '学校', '短文', '感情・内容節'],
    ['Have you ever tried making bread at home with your family?', '家で家族とパンを作ってみたことがありますか。', '食事', '会話', '現在完了・動名詞'],
    ['Please let me know when you arrive at the station.', '駅に着いたら私に知らせてください。', '交通', '会話', '時を表す節'],
    ['The book was written by a doctor who works overseas.', 'その本は海外で働く医師によって書かれました。', '人物紹介', '説明', '受動態・関係節'],
    ['Although it was raining, the children continued their game.', '雨が降っていましたが、子どもたちは試合を続けました。', 'スポーツ', '短文', '譲歩節'],
    ['My goal is to study abroad after I graduate.', '私の目標は卒業後に留学することです。', '自己紹介', '短文', '不定詞・時の節'],
    ['We should use less plastic to protect the ocean.', '海を守るためにプラスチックの使用を減らすべきです。', '環境', '説明', '助言・目的'],
    ['I could not find the key that my father gave me.', '父がくれた鍵を見つけられませんでした。', '家庭', '短文', '関係代名詞'],
    ['Emi has practiced the violin for more than six years.', 'エミは6年以上バイオリンを練習しています。', '音楽', '短文', '現在完了・for'],
    ['The festival is held every spring to welcome new students.', 'その祭りは新入生を迎えるため毎春開かれます。', '学校', '説明', '受動態・目的'],
    ['When I called Jack, he was preparing dinner for his family.', '私が電話したとき、ジャックは家族の夕食を準備していました。', '家族', '短文', '過去進行形'],
    ['This is the most exciting movie I have ever seen.', 'これは私が今まで見た中で最もわくわくする映画です。', '映画', '会話', '最上級・現在完了'],
    ['Would you mind helping me carry these heavy boxes?', 'この重い箱を運ぶのを手伝っていただけますか。', '地域', '会話', '丁寧な依頼'],
    ['The meeting will begin as soon as everyone arrives.', '全員が到着ししだい会議が始まります。', '学校', '案内', '時を表す節'],
    ['I learned how important teamwork was during the tournament.', '大会を通してチームワークの大切さを学びました。', 'スポーツ', '短文', '間接疑問'],
    ['Because the road was crowded, our bus arrived late.', '道路が混んでいたため、バスは遅れて着きました。', '交通', '短文', '理由節'],
    ['The woman speaking with my teacher is a famous writer.', '先生と話している女性は有名な作家です。', '人物紹介', '短文', '現在分詞'],
  ],
  pre2: [
    ['Many students use online videos when they want to review difficult lessons.', '多くの生徒は難しい授業を復習したいときにオンライン動画を使います。', '教育', '説明', '時を表す節'],
    ['I missed the first train, so I had to wait nearly an hour.', '始発電車に乗り遅れたので、1時間近く待たなければなりませんでした。', '交通', '会話', '結果・have to'],
    ['The city built a new park where children can safely play after school.', '市は子どもたちが放課後に安全に遊べる新しい公園を造りました。', '地域', '説明', '関係副詞'],
    ['If more people carried reusable bottles, we could reduce plastic waste in our town.', 'もっと多くの人が再利用できるボトルを持てば、町のプラスチックごみを減らせるでしょう。', '環境', '説明', '仮定法'],
    ['The woman at the information desk explained which bus we should take.', '案内所の女性はどのバスに乗るべきか説明しました。', '旅行', '会話', '間接疑問'],
    ['My host family encouraged me to speak English even when I made mistakes.', 'ホストファミリーは、間違えても英語を話すよう励ましてくれました。', '海外文化', '短文', 'encourage 人 to'],
    ['Because the weather improved, the outdoor concert began only thirty minutes late.', '天候が回復したため、野外コンサートはわずか30分遅れで始まりました。', '音楽', '案内', '理由節'],
    ['The article describes how local farmers are protecting wild birds near their fields.', 'その記事は地元の農家が畑の近くで野鳥を守っている方法を説明しています。', '環境', '説明', '間接疑問'],
    ['I have been saving money since April so that I can buy a laptop.', 'ノートパソコンを買えるよう、4月からお金を貯め続けています。', '買い物', '短文', '現在完了進行形'],
    ['Volunteers collected enough food to support fifty families in our community during the winter.', 'ボランティアは冬の間、地域の50世帯を支えるのに十分な食料を集めました。', '地域', '説明', 'enough to'],
    ['The teacher asked us to compare the two plans before choosing one.', '先生は1つを選ぶ前に2つの計画を比べるよう私たちに求めました。', '教育', '指示', 'ask 人 to'],
    ['Our flight was delayed, but the airline gave us meal tickets at the airport.', '便は遅れましたが、航空会社は空港で食事券をくれました。', '旅行', '案内', '対比'],
    ['Scientists hope this simple device will help people save water at home.', '科学者たちは、この簡単な装置が家庭の節水に役立つことを期待しています。', '科学', '説明', 'help 人 動詞'],
    ['When Maya moved overseas, she kept in touch with her friends online.', 'マヤは海外へ引っ越したときも、オンラインで友人と連絡を取り続けました。', '海外文化', '短文', '時の節・熟語'],
    ['The library offers free workshops for anyone interested in learning computer skills.', '図書館はコンピューター技能を学びたい人向けに無料講座を提供しています。', '地域', '案内', '過去分詞'],
    ['I was relieved that my passport had been found at the hotel.', 'パスポートがホテルで見つかったと知って安心しました。', '旅行', '短文', '過去完了・受動態'],
    ['The school festival was more successful this year than anyone had expected.', '今年の学校祭は誰もが予想した以上に成功しました。', '学校', '説明', '比較級・過去完了'],
    ['By the time we reached the theater, the play had already started.', '劇場に着いたときには、劇はすでに始まっていました。', '芸術', '短文', '過去完了'],
    ['The guide warned us not to leave the marked hiking trail in the forest.', 'ガイドは森で印の付いた登山道から外れないよう私たちに注意しました。', '旅行', '指示', 'warn 人 not to'],
    ['Some teenagers choose after-school jobs to gain valuable experience and independence.', '貴重な経験と自立心を得るため、放課後の仕事を選ぶ10代の若者もいます。', '仕事', '説明', '目的の不定詞'],
  ],
  '2': [
    ['The company introduced flexible working hours so that employees could spend more time with their families.', '会社は従業員が家族と過ごす時間を増やせるよう、柔軟な勤務時間を導入しました。', '仕事', '説明', '目的・結果'],
    ['Although electric cars produce no exhaust while driving, generating their electricity can still affect the environment.', '電気自動車は走行中に排気ガスを出しませんが、発電はなお環境に影響し得ます。', '環境', '説明', '譲歩・動名詞'],
    ['The city plans to convert an empty office building into affordable housing for young families.', '市は空きオフィスビルを若い家族向けの手頃な住宅に転用する計画です。', '地域', 'ニュース', 'convert A into B'],
    ['Researchers found that students remember information better when they explain it in their own words.', '研究者は、生徒が自分の言葉で説明すると情報をよりよく覚えることを発見しました。', '教育', '説明', '内容節・比較'],
    ['Due to heavy snow, all morning flights have been canceled until the runway can be cleared.', '大雪のため、滑走路を除雪できるまで午前の全便が欠航になっています。', '旅行', 'アナウンス', '現在完了受動態'],
    ['The museum allows visitors to download an app that provides detailed descriptions of each artwork.', '博物館では、各作品の詳しい説明を提供するアプリを来館者がダウンロードできます。', '芸術', '案内', '関係節'],
    ['If the new recycling program succeeds, the town will expand it to every neighborhood next year.', '新しいリサイクル計画が成功すれば、町は来年すべての地区へ拡大します。', '環境', 'ニュース', '条件節'],
    ['Some hospitals are using robots to deliver medicine, allowing nurses to focus more on patient care.', '一部の病院では薬を運ぶロボットを使い、看護師が患者のケアに集中できるようにしています。', '医療', '説明', '分詞構文'],
    ['The documentary showed how rising ocean temperatures are changing the behavior of several fish species.', 'そのドキュメンタリーは海水温の上昇が複数の魚種の行動をどう変えているか示しました。', '科学', '説明', '間接疑問'],
    ['Applicants must submit two references before the company will arrange an online interview with its manager.', '応募者は会社が管理者とのオンライン面接を設定する前に、2通の推薦状を提出しなければなりません。', '仕事', '案内', '義務・時の節'],
    ['The professor canceled today’s lecture because a train delay prevented her from reaching campus on time.', '教授は電車の遅延で時間どおり大学に着けなかったため、今日の講義を休講にしました。', '教育', 'アナウンス', 'prevent 人 from'],
    ['Many consumers say they prefer local products, even when those products cost slightly more at the store.', '店で少し高くても地元の商品を好むと、多くの消費者が答えています。', 'ビジネス', '説明', '譲歩節'],
    ['The community center offers language classes designed for residents who recently moved to Japan with their families.', '地域センターは家族と最近来日した住民向けの語学講座を提供しています。', '地域', '案内', '過去分詞・関係節'],
    ['Scientists are testing a material that may keep buildings cooler without using additional electricity during hot summer months.', '科学者たちは暑い夏にも追加の電力を使わず建物を涼しく保てるかもしれない素材を試験しています。', '科学', '説明', '関係節・without'],
    ['After reviewing the safety report, the council agreed to repair the bridge immediately before winter begins.', '安全報告書を検討後、議会は冬が始まる前に橋を直ちに修理することで合意しました。', '地域', 'ニュース', '分詞・時の節'],
    ['The hotel apologized for the mistake and offered us a larger room at no extra cost.', 'ホテルは誤りを謝罪し、追加料金なしでより広い部屋を提供しました。', '旅行', '会話', '並列・熟語'],
    ['People who regularly read reliable news sources are less likely to share false information online.', '信頼できるニュースを日頃から読む人は、オンラインで誤情報を共有しにくい傾向があります。', 'メディア', '説明', '関係節・比較'],
    ['The school replaced paper notices with a mobile app to communicate with parents more quickly.', '学校は保護者とより迅速に連絡するため、紙のお知らせをモバイルアプリに替えました。', '教育', 'ニュース', 'replace A with B'],
    ['Unless we improve public transportation, traffic congestion will continue to worsen as the population grows.', '公共交通を改善しなければ、人口増加に伴い交通渋滞は悪化し続けるでしょう。', '交通', '説明', 'unless・as'],
    ['A local business donated computers so that children could attend classes from home during the storm.', '地元企業は嵐の間も子どもが自宅から授業に参加できるよう、コンピューターを寄付しました。', '教育', 'ニュース', '目的節'],
  ],
  pre1: [
    ['While remote work has reduced commuting time for many employees, some managers worry that it may weaken informal communication among colleagues.', '在宅勤務は多くの従業員の通勤時間を減らしましたが、同僚間の非公式な意思疎通を弱めると懸念する管理職もいます。', '仕事', '説明', '対比・内容節'],
    ['The city postponed the waterfront project after residents argued that the environmental review had failed to consider seasonal flooding risks.', '住民が環境審査は季節的な洪水リスクを考慮していないと主張したため、市は沿岸事業を延期しました。', '環境', 'ニュース', '過去完了・内容節'],
    ['Researchers caution that the apparent decline in crime may partly reflect changes in how local authorities collect and classify data.', '犯罪の見かけ上の減少は、自治体のデータ収集・分類方法の変化を一部反映している可能性があると研究者は警告しています。', '社会', '説明', '留保・間接疑問'],
    ['Although the treatment showed promising results in a small trial, doctors say its effects over the long term remain largely unknown to researchers.', 'その治療は小規模試験で有望な結果を示しましたが、長期的影響の大部分はまだ不明だと医師らは述べています。', '医療', '説明', '譲歩・内容節'],
    ['The university expanded its scholarship program to ensure that qualified students are not excluded simply because of their financial circumstances.', '大学は、資格のある学生が経済事情だけで排除されないよう奨学金制度を拡充しました。', '教育', 'ニュース', '目的節・受動態'],
    ['A growing number of farmers are combining traditional knowledge with satellite data to manage water more efficiently during severe droughts.', '深刻な干ばつの際に水をより効率的に管理するため、伝統知と衛星データを組み合わせる農家が増えています。', '環境', '説明', 'combine A with B'],
    ['The speaker claimed that artificial intelligence should support professional judgment rather than replace the people responsible for making final decisions in hospitals.', '講演者は、AIは専門家の判断を支え、病院で最終決定を担う人々に取って代わるべきではないと主張しました。', '技術', '講義', 'rather than・分詞'],
    ['Because the original survey included few rural participants, its conclusions may not represent the experiences of the entire population as a whole.', '元の調査には地方の参加者が少なかったため、その結論は国民全体の経験を表していない可能性があります。', '社会', '説明', '理由・留保'],
    ['The airline revised its compensation policy after regulators received numerous complaints from passengers whose flights had been repeatedly canceled without warning.', '便を事前通知なく繰り返し欠航された乗客から規制当局が多数の苦情を受け、航空会社は補償方針を改定しました。', '旅行', 'ニュース', '関係節・過去完了受動'],
    ['Historians disagree about whether the reform achieved its stated goals or merely shifted political power to a different group within the country.', 'その改革が目標を達成したのか、国内の別集団へ政治権力を移しただけなのか、歴史家の意見は分かれています。', '歴史', '講義', 'whether・対比'],
    ['The new tax is intended to discourage wasteful packaging, but small retailers fear that compliance costs will reduce their profits.', '新税は無駄な包装を抑える狙いですが、小売店は順守費用が利益を減らすことを懸念しています。', '経済', 'ニュース', '受動態・対比'],
    ['Even if laboratory-grown meat becomes affordable, consumers may hesitate to buy it unless manufacturers explain how it is produced.', '培養肉が手頃になっても、製造方法が説明されなければ消費者は購入をためらうかもしれません。', '科学', '説明', 'even if・unless'],
    ['The report recommends restoring wetlands near coastal towns because they absorb floodwater while also providing habitats for many threatened species.', '報告書は、洪水を吸収し絶滅危惧種の生息地にもなるため、沿岸の町の湿地再生を勧告しています。', '環境', '説明', '理由・分詞'],
    ['After several inaccurate predictions, the public became increasingly skeptical of experts who spoke with more certainty than the evidence justified.', '何度か予測が外れた後、根拠以上に断定的に話す専門家への市民の懐疑が強まりました。', '社会', 'ニュース', '比較・関係節'],
    ['The museum returned the artifacts voluntarily, acknowledging that they had been acquired under laws that would now be considered unjust.', '博物館は、それらが現在なら不当と見なされる法律のもとで取得されたと認め、自主的に返還しました。', '文化', 'ニュース', '分詞構文・過去完了'],
    ['Economists warn that raising interest rates too quickly could control inflation while creating unnecessary hardship for households with large debts.', '金利を急に上げるとインフレを抑える一方、多額の負債を抱える世帯に不要な苦境を与え得ると経済学者は警告します。', '経済', '説明', '動名詞・対比'],
    ['The conservation program pays local communities to protect forests, giving residents a financial reason to prevent illegal logging in the region.', 'その保全計画は地域社会に森林保護の対価を払い、違法伐採を防ぐ経済的理由を住民に与えています。', '環境', '説明', '分詞構文'],
    ['When schools teach students to evaluate sources critically, they are better prepared to recognize misleading claims on social media during elections.', '学校で情報源を批判的に評価する方法を教えると、生徒は選挙中のSNS上の誤解を招く主張を見抜きやすくなります。', 'メディア', '説明', '時の節・比較'],
    ['The committee approved the proposal only after independent engineers confirmed that the revised design met current safety standards for public buildings.', '独立した技術者が改訂設計は公共建築の現行安全基準を満たすと確認して初めて、委員会は提案を承認しました。', '技術', 'ニュース', 'only after・内容節'],
    ['Although tourism creates jobs, overcrowding can damage historic neighborhoods and make ordinary services less accessible to permanent residents in popular cities.', '観光は雇用を生みますが、人気都市の混雑は歴史地区を傷つけ、日常サービスを住民が利用しにくくすることがあります。', '文化', '説明', '譲歩・比較'],
  ],
  '1': [
    ['Although the proposed carbon market could encourage firms to reduce emissions, critics contend that generous exemptions would reward major polluters while placing a disproportionate burden on smaller competitors.', '提案された炭素市場は企業の排出削減を促し得ますが、寛大な免除は大規模汚染者を優遇し、小規模競争相手に不釣り合いな負担を課すと批判されています。', '環境政策', '論説', '譲歩・分詞構文'],
    ['The historian argues that public memory is shaped not only by what societies commemorate, but also by which uncomfortable events their institutions repeatedly choose to ignore.', '公共の記憶は社会が記念するものだけでなく、制度が繰り返し無視する不都合な出来事によっても形作られると、その歴史家は論じます。', '歴史', '講義', 'not only but also'],
    ['Despite impressive gains in diagnostic accuracy, the system remains vulnerable to biased training data, which can reproduce existing inequalities under the appearance of scientific objectivity and fairness.', '診断精度が大きく向上しても、そのシステムは偏った学習データに弱く、科学的客観性と公正さを装って既存の不平等を再生産しかねません。', '技術倫理', '論説', '譲歩・非制限用法'],
    ['Because central banks must respond to both inflation and unemployment, a policy that stabilizes prices in the short term may nevertheless deepen regional economic disparities over time.', '中央銀行はインフレと失業の双方に対応する必要があるため、短期的に物価を安定させる政策が長期的には地域格差を深める可能性があります。', '経済', '講義', '理由・逆接副詞'],
    ['The court ruled that national security concerns did not justify indefinite secrecy, particularly when the withheld documents contained evidence of misconduct by senior public officials during the investigation.', '裁判所は、特に非公開文書に捜査中の政府高官の不正証拠が含まれる場合、安全保障上の懸念は無期限の秘密を正当化しないと判断しました。', '法律', 'ニュース', '内容節・時の節'],
    ['Proponents of universal basic income claim it would simplify welfare systems and strengthen workers’ bargaining power, whereas opponents question whether governments could finance it sustainably over decades.', 'ベーシックインカム支持者は福祉制度を簡素化し労働者の交渉力を高めると主張する一方、反対者は数十年にわたる財源を疑問視しています。', '社会政策', '論説', 'whereas・whether'],
    ['The discovery does not prove that microbial life exists beyond Earth, but it narrows the range of conditions scientists should examine in future planetary missions to distant moons.', 'その発見は地球外微生物の存在を証明しませんが、遠方の衛星を調べる将来の探査で検討すべき条件を絞り込みます。', '科学', '講義', '対比・関係節省略'],
    ['By framing poverty as an individual failure, policymakers may overlook structural barriers that persist even when people obtain education, work steadily, and comply with every official requirement.', '貧困を個人の失敗として捉えることで、政策立案者は、人々が教育を受け働き続け公的要件を満たしても残る構造的障壁を見落としかねません。', '社会政策', '論説', 'by・譲歩節'],
    ['The author maintains that translating literature involves more than preserving literal meaning, since rhythm, cultural associations, and deliberate ambiguity can be equally central to a work.', '文学翻訳は字義的意味の保存以上のものであり、リズム、文化的連想、意図的な曖昧さも作品の核心になり得ると著者は主張します。', '文学', '講義', 'more than・理由'],
    ['Although gene editing may eventually prevent inherited diseases, establishing who may access such treatment raises ethical questions that cannot be resolved by technical expertise alone or market demand.', '遺伝子編集は遺伝病を防ぐ可能性がありますが、誰が治療を受けられるかは技術的専門知識や市場需要だけでは解けない倫理問題を生みます。', '生命倫理', '論説', '譲歩・間接疑問'],
    ['The peace agreement ended open hostilities, yet its vague provisions left minority communities uncertain about whether their language rights and local political representation would actually be protected.', '和平合意は公然の敵対行為を終わらせましたが、曖昧な条項のため少数派は言語権と地方政治での代表が守られるか確信できませんでした。', '国際政治', 'ニュース', 'yet・whether'],
    ['When algorithms determine access to loans or employment, transparency requires more than publishing code; affected people must also have a practical way to challenge erroneous decisions.', '融資や雇用へのアクセスをアルゴリズムが決める場合、透明性にはコード公開以上に、影響を受ける人が誤決定へ異議を唱える実用的手段が必要です。', '技術倫理', '論説', 'セミコロン・more than'],
    ['The economist cautioned that measuring national prosperity solely through economic output ignores unpaid care work, environmental degradation, and the unequal distribution of wealth across different households.', '国の繁栄を経済生産だけで測ると、無償ケア労働、環境悪化、世帯間の富の偏在を無視すると、その経済学者は警告しました。', '経済', '講義', '動名詞・列挙'],
    ['Archaeologists initially attributed the settlement’s collapse to warfare, but new evidence suggests that prolonged drought gradually undermined agriculture and intensified competition among neighboring communities for water.', '考古学者は当初集落崩壊を戦争のせいとしましたが、新証拠は長期干ばつが農業を弱め、水をめぐる近隣社会の競争を激化させたと示唆します。', '歴史', '講義', 'attribute A to B'],
    ['A democratic government must protect unpopular speech without allowing powerful actors to manipulate public debate through coordinated deception, intimidation, or control of essential communication platforms during national elections.', '民主政府は不人気な言論を守る一方、強者が選挙中に組織的な欺瞞、威圧、通信基盤の支配で公共議論を操作するのを許してはなりません。', '政治', '論説', 'without・列挙'],
    ['The medical trial was halted not because the treatment had failed, but because preliminary results showed benefits so substantial that withholding it from other patients became ethically indefensible.', '臨床試験は治療が失敗したからでなく、予備結果の効果が非常に大きく、他の患者に提供しないことが倫理的に正当化不能になったため中止されました。', '医療倫理', 'ニュース', 'not because but because'],
    ['Even well-designed sanctions can produce unintended consequences when political elites shift the economic burden onto ordinary citizens while preserving their own access to scarce resources.', 'よく設計された制裁でも、政治エリートが希少資源への自らのアクセスを保ちつつ経済負担を一般市民へ移せば、意図せぬ結果を生み得ます。', '国際政治', '論説', '譲歩・while'],
    ['The philosopher rejects the assumption that technological progress is inherently beneficial, arguing that every innovation should be judged by whose interests it serves and whose choices it restricts.', 'その哲学者は技術進歩が本質的に有益だという前提を退け、各革新は誰の利益に資し誰の選択を制限するかで評価すべきだと論じます。', '哲学', '講義', '分詞構文・間接疑問'],
    ['If universities rely excessively on short-term performance metrics, researchers may avoid ambitious projects whose value is uncertain but whose eventual impact could transform entire disciplines.', '大学が短期的業績指標に過度に依存すると、価値は不確かでも最終的に学問分野全体を変え得る野心的研究を研究者が避けるかもしれません。', '教育政策', '論説', '条件・whose'],
    ['The commission found that emergency powers, though lawful when introduced, had gradually become normalized and were being used in circumstances far removed from the original crisis.', '委員会は、導入時には合法だった緊急権限が徐々に常態化し、元の危機とかけ離れた状況で使われていると認定しました。', '法律', 'ニュース', '挿入譲歩・過去完了'],
  ],
}

export const dictationWordCount = (text) =>
  (text?.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*/g) ?? []).length

export const DICTATION_ITEMS = Object.freeze(
  Object.entries(RAW_ITEMS).flatMap(([level, items]) =>
    items.map(([text, ja, topic, kind, focus], index) =>
      Object.freeze({
        id: `dict_${level}_${String(index + 1).padStart(2, '0')}`,
        level,
        text,
        ja,
        topic,
        kind,
        focus,
        wordCount: dictationWordCount(text),
      }),
    ),
  ),
)

export const DICTATION_BY_ID = Object.freeze(
  Object.fromEntries(DICTATION_ITEMS.map((item) => [item.id, item])),
)

export const getDictation = (id) => DICTATION_BY_ID[id]

export const dictationByLevel = (levelId) =>
  DICTATION_ITEMS.filter((item) => item.level === levelId)

function shuffled(items, rng = Math.random) {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function buildDictationDeck(
  source = { type: 'level', levelId: '5' },
  { size = 8, rng = Math.random } = {},
) {
  const candidates =
    source.type === 'dictationList'
      ? (source.ids ?? []).map(getDictation).filter(Boolean)
      : dictationByLevel(source.levelId ?? '5')
  const deck = source.type === 'dictationList' && source.preserveOrder
    ? candidates
    : shuffled(candidates, rng)
  return size ? deck.slice(0, size) : deck
}
