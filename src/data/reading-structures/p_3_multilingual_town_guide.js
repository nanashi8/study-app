import { st } from './entry.js'

export default Object.freeze([
  st('[S A small town {前| on the coast}] [V receives] [O many visitors] [M {前| during the summer}].', {
    chunks: [
      ['A small town on the coast', '海岸にある小さな町は'],
      ['receives many visitors', '多くの旅行者を迎えます'],
      ['during the summer', '夏の間に'],
    ],
    notes: {
      'A small town on the coast': 'on the coast は A small town を後ろから説明して「海岸にある」。',
      'receives many visitors': 'receive visitors で「訪れる人を迎える」。町を主語にして、多くの旅行者が訪れることを表しています。',
    },
    rules: ['main-clause-skeleton', 'postmodifier', 'paragraph-map'],
  }),
  st('[S Local students] [V wanted] [O {to:名詞| [V to help] [O them] [C {原形| [V explore] [O the town] [M {前| without {動名詞| [V getting] [C lost]}}]}]}].', {
    chunks: [
      ['Local students wanted to help them', '地元の生徒たちは旅行者を手助けしたいと考えました（何をするのをかは次へ）'],
      ['explore the town', '町を見て回るのを'],
      ['without getting lost', '迷わずに'],
    ],
    notes: {
      'Local students wanted to help them': 'want to ＋ 動詞の原形 で「〜したい」。them は前の文の many visitors を指します。',
      'explore the town': 'help ＋ 人 ＋ 動詞の原形 で「人が〜するのを手伝う」。explore は to のない不定詞です。',
      'without getting lost': 'without は前置詞なので、後ろの動作は動名詞 getting になります。get lost で「道に迷う」。',
    },
    rules: ['infinitive-role', 'svoc-core', 'reference-chain'],
  }),
  st('[S They] [V decided] [O {to:名詞| [V to create] [O a walking guide {前| in {並列| Japanese | and easy English}}]}].', {
    chunks: [
      ['They decided to create a walking guide', '彼らは街歩きガイドを作ることにしました（何語のかは次へ）'],
      ['in Japanese and easy English', '日本語とやさしい英語の'],
    ],
    notes: {
      'They decided to create a walking guide': 'They は前の文の Local students を指します。decide to ＋ 動詞の原形 で「〜することに決める」。',
      'in Japanese and easy English': 'in ＋ 言語 で「その言葉で書かれた」。a walking guide を後ろから説明しています。',
    },
  }),
  st('[M {前| Before {動名詞| [V writing]}}], [S the students] [V gave] [O1 tourists] [O2 a short survey] [M {前| at the station}].', {
    chunks: [
      ['Before writing,', '書き始める前に'],
      ['the students gave tourists a short survey', '生徒たちは旅行者に短いアンケートを行いました'],
      ['at the station', '駅で'],
    ],
    notes: {
      'Before writing,': 'before は前置詞で、後ろの writing は動名詞です。ガイドを書き始める前のことです。',
      'the students gave tourists a short survey': 'give ＋ 人 ＋ もの の形で、give A a survey は「Aにアンケートを行う」。',
    },
    rules: ['svoc-core', 'ing-ed-role', 'paragraph-map'],
  }),
  st('[S Many people] [V said] [O {that節| [接 that] [S {並列| bus times | and closing times}] [V were] [C difficult {to:副詞(形容詞)| [V to find]}]}].', {
    chunks: [
      ['Many people said that', '多くの人は〜と答えました（内容は次へ）'],
      ['bus times and closing times', 'バスの時刻と閉店時刻は'],
      ['were difficult to find', '見つけるのが難しい（と）'],
    ],
    notes: {
      'Many people said that': 'アンケートの答えなので、said は「答えた」と訳せます。that 以下が said の目的語です。',
      'were difficult to find': 'difficult to find で「見つけるのが難しい」。to find は形容詞 difficult の内容を説明します。',
    },
  }),
  st('[S Others] [V wanted] [O {to:名詞| [V to know] [O {疑問詞節| [M where] [S they] [V could refill] [O water bottles] [接 or] [V leave] [O trash]}]}].', {
    chunks: [
      ['Others wanted to know', 'ほかの人たちは知りたがりました（何をかは次へ）'],
      ['where they could refill water bottles', 'どこで水筒に水を補給できるか'],
      ['or leave trash', 'またはごみを捨てられるかを'],
    ],
    notes: {
      'Others wanted to know': 'Others は「ほかの人たち」で、前の文の Many people と対になっています。',
      'where they could refill water bottles': 'where 以下は「どこで〜できるか」という名詞のまとまりで、know の目的語です。they は旅行者を指します。',
      'or leave trash': 'or は could refill と could leave をつないでいます。where は両方にかかります。',
    },
  }),
  st('[S The students] [M also] [V asked] [O1 hotel workers] [O2 {疑問詞節| [O which questions] [S visitors] [V asked] [M most often]}].', {
    chunks: [
      ['The students also asked hotel workers', '生徒たちはホテルで働く人にも尋ねました（何をかは次へ）'],
      ['which questions visitors asked most often', '旅行者がどの質問を最もよくするかを'],
    ],
    notes: {
      'The students also asked hotel workers': 'ask ＋ 人 ＋ 疑問詞のまとまり で「人に〜かを尋ねる」。also は、旅行者へのアンケートに加えてホテルでも聞いたことを表します。',
      'which questions visitors asked most often': 'which questions は「どの質問」で、後ろの asked の目的語にあたります。most often は「最もよく」。',
    },
    rules: ['wh-clause', 'svoc-core', 'logic-connectors'],
  }),
  st('[S The class] [M therefore] [V chose] [O practical information] [M {前| instead of {動名詞| [V listing] [O every famous place]}}].', {
    chunks: [
      ['The class therefore chose practical information', 'そこでクラスは実用的な情報を選びました'],
      ['instead of listing every famous place', '有名な場所をすべて並べる代わりに'],
    ],
    notes: {
      'The class therefore chose practical information': 'therefore は「そのため・そこで」で、前の文までのアンケートの結果を受けています。',
      'instead of listing every famous place': 'instead of ＋ -ing で「〜する代わりに」。listing は前置詞の後ろの動名詞です。',
    },
  }),
  st('[S Teams] [V walked] [O each route] [接 and] [V measured] [O {疑問詞節| [O how long] [S it] [V took]}].', {
    chunks: [
      ['Teams walked each route', '各チームはそれぞれの道順を歩きました'],
      ['and measured how long it took', 'そして、どのくらい時間がかかったかを測りました'],
    ],
    notes: {
      'Teams walked each route': 'walk ＋ 道 で「〜を歩く」。each route は walked の目的語です。',
      'and measured how long it took': 'how long 以下は「どのくらい時間がかかったか」という名詞のまとまりで、measured の目的語です。take は「（時間が）かかる」で、it は道順を歩くことを指します。',
    },
  }),
  st('[S They] [V tested] [O the walking times] [M twice] [M {副詞節:理由| [接 because] [S busy summer streets] [V could slow] [O a group]}].', {
    chunks: [
      ['They tested the walking times twice', '彼らは歩行時間を2回測りました'],
      ['because busy summer streets could slow a group', '夏の混雑した道路ではグループの歩みが遅くなることがあるので'],
    ],
    notes: {
      'They tested the walking times twice': 'twice は「2回」。because 以下が2回測った理由です。',
      'because busy summer streets could slow a group': 'slow はここでは動詞で「遅くする」。could は「〜することがある」という可能性を表します。',
    },
  }),
  st('[S They] [V photographed] [O clear landmarks, {前| such as {並列| a red bridge | and a stone tower}}].', {
    chunks: [
      ['They photographed clear landmarks,', '彼らは分かりやすい目印を写真に撮りました'],
      ['such as a red bridge', '例えば赤い橋や'],
      ['and a stone tower', '石の塔といった（目印を）'],
    ],
    notes: {
      'They photographed clear landmarks,': 'photograph はここでは動詞で「写真に撮る」。landmark は「目印になる建物や場所」。',
      'such as a red bridge': 'such as 以下は clear landmarks の具体例で、目的語の一部です。',
    },
  }),
  st('[S Restaurant owners] [V checked] [O {並列| names, | prices, | and business hours}] [M {前| for mistakes}].', {
    chunks: [
      ['Restaurant owners checked names, prices, and business hours', '飲食店の店主は名前・価格・営業時間を確認しました'],
      ['for mistakes', '間違いがないか'],
    ],
    notes: {
      'Restaurant owners checked names, prices, and business hours': 'names, prices, and business hours の3つが checked の目的語です。business hours は「営業時間」。',
      'for mistakes': 'check A for mistakes で「Aに間違いがないか確かめる」。',
    },
  }),
  st('[M Next], [S exchange students] [V used] [O the first version] [M {前| without help {前| from the class}}].', {
    chunks: [
      ['Next, exchange students used the first version', '次に、交換留学生が最初の版を使いました'],
      ['without help from the class', 'クラスの助けなしに'],
    ],
    notes: {
      'Next, exchange students used the first version': 'exchange student は「交換留学生」。the first version は完成前の最初の版のガイドです。',
      'without help from the class': 'from the class は help を後ろから説明して「クラスからの助け」。',
    },
    rules: ['paragraph-map', 'logic-connectors', 'main-clause-skeleton'],
  }),
  st('[S They] [V understood] [O the English] [接 but] [M sometimes] [V missed] [O a turn {過去分詞>a turn| [V shown] [M only {前| by a street name}]}].', {
    chunks: [
      ['They understood the English', '彼らは英語は理解しました'],
      ['but sometimes missed a turn', 'しかし、ときどき曲がり角を見落としました（どんな角かは次へ）'],
      ['shown only by a street name', '道路名だけで示された（曲がり角を）'],
    ],
    notes: {
      'They understood the English': 'They は前の文の exchange students を指します。the English はガイドに書かれた英語のことです。',
      'but sometimes missed a turn': 'miss a turn で「曲がる所を見落とす」。but の後ろの missed の主語も They です。',
      'shown only by a street name': 'shown は過去分詞で、a turn を後ろから説明して「〜で示された」。only は by a street name にかかり「道路名だけで」。',
    },
  }),
  st('[S One student {前| in a wheelchair}] [M also] [V found] [O {that節| [接 that] [S a short route] [V had] [O many steps]}].', {
    chunks: [
      ['One student in a wheelchair also found that', '車いすを使う一人の生徒は、〜ことにも気づきました（内容は次へ）'],
      ['a short route had many steps', '短い道順に階段が多い（ことに）'],
    ],
    notes: {
      'One student in a wheelchair also found that': 'in a wheelchair は One student を後ろから説明して「車いすを使う」。find that 〜 で「〜だと気づく」。',
      'a short route had many steps': 'steps はここでは「（階段の）段」。had many steps で「階段が多かった」。',
    },
  }),
  st('[S The class] [V added] [O {並列| pictures, | safer crossings, | and a longer route {前| without steps}}].', {
    chunks: [
      ['The class added pictures, safer crossings,', 'クラスは写真とより安全な横断場所を加えました'],
      ['and a longer route without steps', 'さらに、階段のない長めの道順も（加えました）'],
    ],
    notes: {
      'The class added pictures, safer crossings,': 'pictures, safer crossings, and a longer route の3つが added の目的語です。safer は safe の比較級です。',
      'and a longer route without steps': 'without steps は a longer route を後ろから説明して「階段のない」。前の文の階段の問題への対策です。',
    },
    rules: ['parallel-shape', 'postmodifier', 'svoc-core'],
  }),
  st('[S The finished guide] [V is] [M now] [C available] [M {並列| {前| at the station} | and {前| on the town website}}].', {
    chunks: [
      ['The finished guide is now available', '完成したガイドは今、利用できます'],
      ['at the station and on the town website', '駅でも町のウェブサイトでも'],
    ],
    notes: {
      'The finished guide is now available': 'finished は「完成した」。available は「手に入る・利用できる」で、is の補語です。',
      'at the station and on the town website': 'and は at the station と on the town website の2つの場所をつないでいます。',
    },
  }),
  st('[S Printed pages] [V include] [O a code {関係>a code| [S that] [V opens] [O the newest online map] [M {前| on a phone}]}].', {
    chunks: [
      ['Printed pages include a code', '印刷されたページにはコードが載っています（どんなコードかは次へ）'],
      ['that opens the newest online map', '最新のオンライン地図を開く（コードが）'],
      ['on a phone', 'スマートフォンで（地図を開く）'],
    ],
    notes: {
      'Printed pages include a code': 'Printed pages は紙に印刷したガイドのことです。',
      'that opens the newest online map': 'that は a code を受ける関係代名詞で、opens の主語です。newest は new の最上級で「最新の」。',
    },
  }),
  st('[S A small note] [V asks] [O users] [C {to:補語| [V to report] [O information {関係>information| [S that] [V is] [M no longer] [C correct]}]}].', {
    chunks: [
      ['A small note asks users', '小さな注意書きは利用者に求めています（何をかは次へ）'],
      ['to report information', '情報を知らせるように（どんな情報かは次へ）'],
      ['that is no longer correct', 'もう正しくなくなった（情報を）'],
    ],
    notes: {
      'A small note asks users': 'ask ＋ 人 ＋ to 〜 で「人に〜するように求める」。',
      'that is no longer correct': 'that は information を受ける関係代名詞です。no longer は「もはや〜ない」。',
    },
  }),
  st('[S The students] [V learned] [O {that節| [接 that] [S good translation] [V requires] [O more {前| than {動名詞| [V replacing] [O words]}}]}].', {
    chunks: [
      ['The students learned that', '生徒たちは〜と学びました（内容は次へ）'],
      ['good translation requires more than replacing words', 'よい翻訳には単語を置き換える以上のことが必要だ（と）'],
    ],
    notes: {
      'The students learned that': 'that 以下が learned の目的語です。',
      'good translation requires more than replacing words': 'more than 〜 で「〜以上のこと」。more が requires の目的語で、than の後ろの replacing words は「単語を置き換えること」。',
    },
  }),
  st('[S It] [M also] [V requires] [O {動名詞| [V imagining] [O {疑問詞節| [O what] [S a reader] [V needs] [M {前| at each moment {前| of a journey}}]}]}].', {
    chunks: [
      ['It also requires imagining', 'それには〜を想像することも必要です（何をかは次へ）'],
      ['what a reader needs', '読み手が何を必要とするか'],
      ['at each moment of a journey', '旅のそれぞれの場面で'],
    ],
    notes: {
      'It also requires imagining': 'It は前の文の good translation を指します。imagining は requires の目的語になる動名詞です。',
      'what a reader needs': 'what 以下は「何を〜か」という名詞のまとまりで、imagining の目的語です。what は needs の目的語にあたります。',
      'at each moment of a journey': 'needs にかかり、「旅のそれぞれの場面で」必要なものを表します。',
    },
  }),
])
