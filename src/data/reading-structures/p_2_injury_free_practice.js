import { st } from './entry.js'

export default Object.freeze([
  st('[M Last spring], [S four members {前| of our track club}] [V were injured] [M {前| within a single month}].', {
    chunks: [
      ['Last spring,', '昨年の春'],
      ['four members of our track club', '私たちの陸上部の4人の部員が'],
      ['were injured', 'けがをしました（どのくらいの間にかは次へ）'],
      ['within a single month', 'たったひと月のうちに'],
    ],
    notes: {
      'were injured': 'be injured で「けがをする」（受け身の形）。',
      'within a single month': 'within は「〜のうちに・〜以内に」。single は「たった一つの」と強めます。',
    },
    rules: ['paragraph-map', 'noun-boundary', 'main-clause-skeleton'],
  }),
  st('[S The teacher] [V called] [O each case] [C bad luck].', {
    chunks: [
      ['The teacher', '先生は'],
      ['called each case bad luck', 'それぞれのけがを不運だと言いました'],
    ],
    notes: {
      'called each case bad luck': 'call ＋ O ＋ C で「O を C と呼ぶ・言う」。case はここでは「（けがの）一件」。',
    },
  }),
  st('[S A graduate {前| of the school}], [M however], [V returned] [M {to:副詞(目的)| [V to help] [O the club]}].', {
    chunks: [
      ['A graduate of the school,', 'その学校の卒業生が'],
      ['however, returned', 'しかし、戻ってきました（何のためにかは次へ）'],
      ['to help the club', '部を手伝うために'],
    ],
    notes: {
      'however, returned': 'however はコンマではさまれて文の途中に入り、前の文（先生は不運だと言った）と反対の流れを示します。',
      'to help the club': 'to help は目的を表し「手伝うために」。',
    },
  }),
  st('[S She] [V asked] [O every member] [C {to:補語| [V to keep] [O a simple record] [M {前| after practice}]}].', {
    chunks: [
      ['She asked every member', '彼女はすべての部員に頼みました（何をかは次へ）'],
      ['to keep a simple record', '簡単な記録をつけるように'],
      ['after practice', '練習のあとで'],
    ],
    notes: {
      'She asked every member': 'She は前の文の卒業生を指します。ask ＋ O ＋ to 〜 で「O に〜するよう頼む」。',
      'to keep a simple record': 'keep a record で「記録をつける」。',
    },
  }),
  st('[S Each card] [V showed] [O {並列| the distance, | the weather | and the pain}].', {
    chunks: [
      ['Each card', 'それぞれのカードは'],
      ['showed the distance, the weather and the pain', '距離と天気と痛みを示していました'],
    ],
    notes: {
      'Each card': 'card は、前の文の「記録」を書いたカードです。',
      'showed the distance, the weather and the pain': 'show はここでは「（記録として）示す」。目的語は3つが and で並んでいます。',
    },
  }),
  st('[S The records] [V revealed] [O a clear pattern] [M {前| within eight weeks}].', {
    chunks: [
      ['The records revealed a clear pattern', 'その記録は、はっきりした傾向を明らかにしました（いつまでにかは次へ）'],
      ['within eight weeks', '8週間のうちに'],
    ],
    notes: {
      'The records revealed a clear pattern': 'reveal は「明らかにする」。pattern は「決まった傾向」。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S Most damage] [V appeared] [M {前| after a sudden rise {前| in weekly distance}}].', {
    chunks: [
      ['Most damage appeared', 'ほとんどの損傷は、現れました（いつかは次へ）'],
      ['after a sudden rise', '急な増加のあとに（何のかは次へ）'],
      ['in weekly distance', '週ごとの距離の'],
    ],
    notes: {
      'Most damage appeared': 'damage はここでは「（体の）損傷・傷み」で、数えられない名詞です。',
      'in weekly distance': 'rise in 〜 で「〜の増加」。weekly は「週ごとの」。',
    },
  }),
  st('[S A second factor] [V was] [C heat], [M {副詞節:理由| [接 because] [S the club] [V practiced] [M {前| at four {前| in the afternoon}}]}].', {
    chunks: [
      ['A second factor was heat,', '二つ目の要因は暑さでした'],
      ['because the club practiced', 'その部は練習していたからです（いつかは次へ）'],
      ['at four in the afternoon', '午後4時に'],
    ],
    notes: {
      'A second factor was heat,': 'factor は「要因」。一つ目の要因（距離の急な増加）に続く、二つ目です。',
      'at four in the afternoon': 'at four in the afternoon は「午後4時に」。',
    },
  }),
  st('[S High humidity] [V raised] [O the risk] [M further], [接 and] [S the water breaks] [V were] [C too short].', {
    chunks: [
      ['High humidity raised the risk further,', '高い湿度が、危険をさらに高めました'],
      ['and the water breaks were too short', 'そして、水分補給の休憩は短すぎました'],
    ],
    notes: {
      'High humidity raised the risk further,': 'raise は「上げる・高める」。further は「さらに」。',
      'and the water breaks were too short': 'water break は「水を飲むための休憩」。too short は「短すぎる」。',
    },
  }),
  st('[S The mentor] [V explained] [O the mechanism] [M {前| in simple language}].', {
    chunks: [
      ['The mentor explained the mechanism', 'その指導者は、仕組みを説明しました（どのようにかは次へ）'],
      ['in simple language', 'やさしい言葉で'],
    ],
    notes: {
      'The mentor explained the mechanism': 'mentor は、手伝いに来た卒業生のことです。mechanism は「（けがが起きる）仕組み」。',
    },
  }),
  st('[S Tired muscles] [V lose] [O their shape], [接 and] [S the load] [V moves] [M {前| to the joints}].', {
    chunks: [
      ['Tired muscles lose their shape,', '疲れた筋肉は形が崩れ'],
      ['and the load moves to the joints', 'そして、負荷が関節へ移ります'],
    ],
    notes: {
      'Tired muscles lose their shape,': 'lose one\'s shape で「形が崩れる」。their は muscles を指します。',
      'and the load moves to the joints': 'load は「（体にかかる）負荷」。joint は「関節」。',
    },
  }),
  st('[S A body {前| under such stress}] [V becomes] [C vulnerable {前| to small accidents}].', {
    chunks: [
      ['A body under such stress', 'そうした負担のもとにある体は'],
      ['becomes vulnerable to small accidents', '小さな事故で傷つきやすくなります'],
    ],
    notes: {
      'A body under such stress': 'under such stress は A body を後ろから説明して「そうした負担のもとにある体」。',
      'becomes vulnerable to small accidents': 'vulnerable to 〜 で「〜に弱い・傷つきやすい」。',
    },
  }),
  st('[S The club] [M then] [V changed] [O three daily habits].', {
    chunks: [
      ['The club then changed three daily habits', 'そこで部は、毎日の習慣を三つ変えました'],
    ],
    notes: {
      'The club then changed three daily habits': 'then は「そこで・それから」。このあと三つの習慣が順に述べられます。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S Members] [M now] [V increase] [O the weekly distance] [M {前| by a small percentage}].', {
    chunks: [
      ['Members now increase the weekly distance', '部員は今、週ごとの距離を増やしています（どのくらいずつかは次へ）'],
      ['by a small percentage', '小さな割合ずつ'],
    ],
    notes: {
      'by a small percentage': 'by はここで増える幅を表し、「小さな割合ずつ」。',
    },
  }),
  st('[S The team] [V moved] [O practice] [M {前| to the early morning}] [M {前| during the hot season}].', {
    chunks: [
      ['The team moved practice', 'チームは、練習を移しました（いつにかは次へ）'],
      ['to the early morning', '早朝へ'],
      ['during the hot season', '暑い季節のあいだ'],
    ],
  }),
  st('[S A cheap device] [V shows] [O {並列| the temperature | and the humidity}] [M {前| at the field}].', {
    chunks: [
      ['A cheap device', '安い装置が'],
      ['shows the temperature and the humidity', '気温と湿度を示します（どこのかは次へ）'],
      ['at the field', 'グラウンドで'],
    ],
    notes: {
      'A cheap device': 'device は「装置・機器」。',
    },
  }),
  st('[S The leader] [V stops] [O the practice] [M {副詞節:時| [接 when] [S the numbers] [V pass] [O a fixed line]}].', {
    chunks: [
      ['The leader stops the practice', 'リーダーは練習を止めます（いつかは次へ）'],
      ['when the numbers pass a fixed line', '数値が決められた線を超えたときに'],
    ],
    notes: {
      'when the numbers pass a fixed line': 'the numbers は、装置が示す気温と湿度の数値です。pass はここでは「（線を）超える」。',
    },
  }),
  st('[S The hardest change] [V was not] [C physical].', {
    chunks: [
      ['The hardest change', 'いちばん難しい変化は'],
      ['was not physical', '体のことではありませんでした'],
    ],
    notes: {
      'was not physical': 'physical は「体の」。体ではなく心の問題だったことが、次の文から分かります。',
    },
    rules: ['paragraph-map', 'negation-scope', 'main-clause-skeleton'],
  }),
  st('[S Many students] [V had hidden] [O small pains] [M {前| from the teacher}].', {
    chunks: [
      ['Many students had hidden small pains', '多くの生徒が、小さな痛みを隠していました（だれにかは次へ）'],
      ['from the teacher', '先生に'],
    ],
    notes: {
      'Many students had hidden small pains': 'had hidden は過去完了で「（それまでずっと）隠していた」。hide A from B で「A を B に隠す」。',
    },
  }),
  st('[S They] [V felt] [O anxiety {前| about {動名詞| [V losing] [O a place {前| in the team}]}}].', {
    chunks: [
      ['They felt anxiety', '生徒たちは、不安を感じていました（何についてかは次へ）'],
      ['about losing a place in the team', 'チームでの自分の座を失うことについて'],
    ],
    notes: {
      'They felt anxiety': 'They は前の文の Many students を指します。anxiety は「不安」。',
      'about losing a place in the team': 'a place in the team は「チームでの座（選手に選ばれる立場）」。',
    },
  }),
  st('[S The mentor] [M therefore] [V separated] [O the report {前| of pain}] [M {前| from the choice {前| of members}}].', {
    chunks: [
      ['The mentor therefore separated the report of pain', 'そこで指導者は、痛みの報告を切り離しました（何からかは次へ）'],
      ['from the choice of members', '部員の選考から'],
    ],
    notes: {
      'The mentor therefore separated the report of pain': 'separate A from B で「A を B から切り離す」。therefore は、前の文の「座を失う不安」を受けます。',
      'from the choice of members': 'the choice of members は「（試合に出る）部員を選ぶこと」。',
    },
  }),
  st('[S The team] [V keeps] [O the place {前| of any student {関係>any student| [S who] [V reports] [O pain] [M early]}}].', {
    chunks: [
      ['The team keeps the place of any student', 'チームは、どの生徒の座も守ります（どんな生徒かは次へ）'],
      ['who reports pain early', '痛みを早めに報告する'],
    ],
    notes: {
      'The team keeps the place of any student': 'keep はここでは「守る・そのままにしておく」。any student は「どの生徒でも」。',
    },
  }),
  st('[S This policy] [V lowered] [O the pressure] [接 and] [V raised] [O the accuracy {前| of the records}].', {
    chunks: [
      ['This policy lowered the pressure', 'この方針は、重圧を下げ'],
      ['and raised the accuracy of the records', '記録の正確さを高めました'],
    ],
    notes: {
      'This policy lowered the pressure': 'lower はここでは動詞で「下げる」。pressure は「（心の）重圧」。',
    },
  }),
  st('[S Members] [M now] [V report] [O small pains] [M {前| without fear}].', {
    chunks: [
      ['Members now report small pains', '部員は今、小さな痛みを報告します（どのようにかは次へ）'],
      ['without fear', '恐れずに'],
    ],
  }),
  st('[S Awareness {前| of the body}] [V became] [C part {前| of the ordinary practice}].', {
    chunks: [
      ['Awareness of the body', '体への意識が'],
      ['became part of the ordinary practice', 'ふだんの練習の一部になりました'],
    ],
    notes: {
      'Awareness of the body': 'awareness of 〜 で「〜への意識・〜に気づいていること」。',
    },
  }),
  st('[M {前| In the second year}], [S the club] [V counted] [O one hurt member].', {
    chunks: [
      ['In the second year,', '2年目には'],
      ['the club counted one hurt member', '部が数えたけが人は1人でした'],
    ],
    notes: {
      'the club counted one hurt member': 'hurt はここでは形容詞で「けがをした」。',
    },
    rules: ['paragraph-map', 'comparison-pairs', 'main-clause-skeleton'],
  }),
  st('[S The number] [V had been] [C nine] [M {前| in the first year}].', {
    chunks: [
      ['The number had been nine', 'その数は9人でした（いつかは次へ）'],
      ['in the first year', '最初の年には'],
    ],
    notes: {
      'The number had been nine': 'had been は過去完了で、2年目より前の1年目のことを表します。',
    },
  }),
  st('[S Results {前| in races}] [V improved], [M {副詞節:譲歩| [接 although] [S nobody] [V trained] [M more hours]}].', {
    chunks: [
      ['Results in races improved,', 'レースの成績は良くなりました'],
      ['although nobody trained more hours', '練習時間を増やした人はいなかったのに'],
    ],
    notes: {
      'although nobody trained more hours': 'nobody は「だれも〜ない」。more hours は「より長い時間」で、練習時間を増やしたわけではないということです。',
    },
  }),
  st('[S The school council] [V asked] [O the club] [C {to:補語| [V to share] [O the method] [M {前| with other teams}]}].', {
    chunks: [
      ['The school council asked the club', '学校の評議会は、部に頼みました（何をかは次へ）'],
      ['to share the method with other teams', 'その方法をほかのチームと共有するように'],
    ],
    notes: {
      'The school council asked the club': 'ask ＋ O ＋ to 〜 で「O に〜するよう頼む」。',
    },
  }),
  st('[S A small budget] [V covered] [O {並列| the device | and a short course {前| for the leaders}}].', {
    chunks: [
      ['A small budget', '少しの予算が'],
      ['covered the device and a short course', 'その装置と短い講習の費用をまかないました（だれ向けのかは次へ）'],
      ['for the leaders', 'リーダー向けの'],
    ],
    notes: {
      'covered the device and a short course': 'cover はここでは「（費用を）まかなう」。目的語は2つが and で並んでいます。',
    },
  }),
  st('[S The benefit] [M soon] [V reached] [O students {前| outside the track club}].', {
    chunks: [
      ['The benefit soon reached students', 'その恩恵は、まもなく生徒たちに届きました（どんな生徒かは次へ）'],
      ['outside the track club', '陸上部の外の'],
    ],
    notes: {
      'The benefit soon reached students': 'benefit は「恩恵・よい効果」。',
    },
  }),
  st('[S The mentor] [V warns] [O {that節| [接 that] [S the method] [V has] [O limits]}].', {
    chunks: [
      ['The mentor warns that', '指導者は〜と注意しています（内容は次へ）'],
      ['the method has limits', 'その方法には限界がある（と）'],
    ],
    notes: {
      'the method has limits': 'limit は「限界」。',
    },
    rules: ['paragraph-map', 'that-diagnosis', 'author-stance'],
  }),
  st('[S Records] [V cannot predict] [O every accident], [接 and] [S some damage] [V comes] [M {前| from old wounds}].', {
    chunks: [
      ['Records cannot predict every accident,', '記録で、すべての事故を予測できるわけではありません'],
      ['and some damage comes from old wounds', 'そして、一部の損傷は古い傷から生じます'],
    ],
    notes: {
      'Records cannot predict every accident,': 'not … every は「すべて〜というわけではない」という部分否定です。',
      'and some damage comes from old wounds': 'wound は「傷」。old wounds は「前からある古い傷」。',
    },
  }),
  st('[S A club {前| with a wide range {前| of ages}}] [V needs] [O a different plan {前| for beginners}].', {
    chunks: [
      ['A club with a wide range of ages', '幅広い年齢の部員がいる部には'],
      ['needs a different plan for beginners', '初心者向けの別の計画が必要です'],
    ],
    notes: {
      'A club with a wide range of ages': 'with 以下は A club を後ろから説明します。a wide range of 〜 で「幅広い〜」。',
    },
  }),
  st('[S The idea {前| behind the whole change}] [V is] [C simple].', {
    chunks: [
      ['The idea behind the whole change', 'この変化全体のもとにある考えは'],
      ['is simple', '単純です'],
    ],
    notes: {
      'The idea behind the whole change': 'behind 以下は The idea を後ろから説明して「〜のもとにある考え」。',
    },
  }),
  st('[S A team] [V can act] [M early] [M {副詞節:時| [接 when] [S it] [V measures] [O its own practice]}].', {
    chunks: [
      ['A team can act early', 'チームは、早めに手を打つことができます（いつかは次へ）'],
      ['when it measures its own practice', '自分たちの練習を測るときには'],
    ],
    notes: {
      'A team can act early': 'act early は「早めに行動する・手を打つ」。',
      'when it measures its own practice': 'it は A team を指します。own は「自分たちの」。',
    },
  }),
])
