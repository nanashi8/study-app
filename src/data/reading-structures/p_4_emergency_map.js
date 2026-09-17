import { st } from './entry.js'

export default Object.freeze([
  st('[S Heavy rain] [M sometimes] [V covers] [O streets in our town] [M with water].', {
    chunks: [
      ['Heavy rain sometimes covers streets', '大雨がときどき道路を覆います（どこのかは次へ）'],
      ['in our town', '私たちの町の（道路を）'],
      ['with water', '水で'],
    ],
    notes: {
      'Heavy rain sometimes covers streets': 'cover A with B で「AをBで覆う」。sometimes は「ときどき」。',
    },
  }),
  st('[M Last year], [S junior high school students] [V decided] [O {to:名詞| [V to make] [O a safer walking map]}].', {
    chunks: [
      ['Last year,', '昨年'],
      ['junior high school students', '中学生たちは'],
      ['decided to make a safer walking map', 'より安全に歩ける地図を作ることにしました'],
    ],
    notes: {
      'decided to make a safer walking map': 'decide to ＋ 動詞の原形 で「〜することに決める」。safer は safe の比較級です。',
    },
  }),
  st('[S They] [M first] [V interviewed] [O residents] [M about places {関係>places| [S that] [V became] [C dangerous] [M during storms]}].', {
    chunks: [
      ['They first interviewed residents', '彼らはまず、住民に聞き取りをしました（何についてかは次へ）'],
      ['about places', '場所について（どんな場所かは次へ）'],
      ['that became dangerous during storms', '嵐のときに危険になった（場所について）'],
    ],
    notes: {
      'They first interviewed residents': 'They は前の文の junior high school students を指します。',
      'that became dangerous during storms': 'that は places を受ける関係代名詞です。become ＋ 形容詞 で「〜になる」。',
    },
  }),
  st('[S Several people] [V warned] [O them] [M about a low bridge near the river].', {
    chunks: [
      ['Several people warned them', '何人かの人が彼らに注意しました（何についてかは次へ）'],
      ['about a low bridge near the river', '川の近くの低い橋について'],
    ],
    notes: {
      'Several people warned them': 'warn A about B で「AにBについて注意する」。them は生徒たちを指します。',
    },
    rules: ['postmodifier', 'reference-chain', 'main-clause-skeleton'],
  }),
  st('[S Water] [V can rise] [M there] [M quickly], [接 so] [S the students] [V marked] [O another route to the community center].', {
    chunks: [
      ['Water can rise there quickly,', 'そこでは水がすぐに上がることがあります'],
      ['so', 'だから'],
      ['the students marked another route', '生徒たちは別の道順に印を付けました（どこへのかは次へ）'],
      ['to the community center', '公民館への'],
    ],
    notes: {
      'Water can rise there quickly,': 'there は前の文の「川の近くの低い橋のあたり」を指します。',
    },
  }),
  st('[S An older resident] [M also] [V showed] [O1 them] [O2 a narrow street without lights].', {
    chunks: [
      ['An older resident also showed them', 'ある年配の住民は、彼らに〜も教えてくれました（何をかは次へ）'],
      ['a narrow street without lights', '街灯のない狭い道を'],
    ],
    notes: {
      'An older resident also showed them': 'show ＋ 人 ＋ もの で「人にものを見せる・教える」。',
      'a narrow street without lights': 'without lights は a narrow street を後ろから説明して「街灯のない」。',
    },
    rules: ['postmodifier', 'logic-connectors', 'svoc-core'],
  }),
  st('[S The map] [V tells] [O walkers] [C {to:補語| [V to avoid] [O that street] [M after dark]}].', {
    chunks: [
      ['The map tells walkers', '地図は歩く人に伝えます（何をかは次へ）'],
      ['to avoid that street after dark', '暗くなったらその道を避けるように'],
    ],
    notes: {
      'The map tells walkers': 'tell ＋ 人 ＋ to 〜 で「人に〜するように言う」。',
      'to avoid that street after dark': 'that street は前の文の街灯のない狭い道です。after dark は「暗くなってから」。',
    },
    rules: ['infinitive-role', 'reference-chain', 'svoc-core'],
  }),
  st('[M {副詞節:時| [接 When] [S the first map] [V was] [C ready]}], [S families] [V tested] [O it] [M on a rainy afternoon].', {
    chunks: [
      ['When the first map was ready,', '最初の地図ができあがると'],
      ['families tested it', '家族の人たちがそれを試しました'],
      ['on a rainy afternoon', '雨の午後に'],
    ],
    notes: {
      'families tested it': 'it は the first map を指します。',
    },
  }),
  st('[S They] [V found] [O {that節| [接 that] [S one sign] [V was hidden] [M behind a large tree]}].', {
    chunks: [
      ['They found that', '彼らは〜ことに気づきました（内容は次へ）'],
      ['one sign was hidden behind a large tree', '標識の一つが大きな木の後ろに隠れていた（ことに）'],
    ],
    notes: {
      'They found that': 'find that 〜 で「〜だと気づく・分かる」。They は families を指します。',
      'one sign was hidden behind a large tree': 'was hidden は hide（隠す）の受け身で「隠れていた」。',
    },
  }),
  st('[S They] [M also] [V asked] [M for larger letters and simple pictures].', {
    chunks: [
      ['They also asked for', 'その人たちは〜も求めました（何をかは次へ）'],
      ['larger letters and simple pictures', 'もっと大きな文字と簡単な絵を'],
    ],
    notes: {
      'They also asked for': 'ask for 〜 で「〜を求める」。for 以下は修飾語Mなので、この文は第1文型です。',
    },
  }),
  st('[S Families] [V suggested] [O {動名詞| [V marking] [O places {関係>places| [M where] [S people] [V could wait] [M safely] [M {副詞節:条件| [接 if] [S the rain] [V grew] [C stronger]}]}]}].', {
    chunks: [
      ['Families suggested marking places', '家族の人たちは、場所に印を付けることを提案しました（どんな場所かは次へ）'],
      ['where people could wait safely', '人々が安全に待てる（場所に）'],
      ['if the rain grew stronger', 'もし雨がもっと強くなったら'],
    ],
    notes: {
      'Families suggested marking places': 'suggest ＋ 〜ing で「〜することを提案する」。',
      'where people could wait safely': 'where は places を受ける関係副詞です。',
      'if the rain grew stronger': 'grow ＋ 形容詞 で「〜になる」。stronger は strong の比較級です。',
    },
  }),
  st('[S The students] [V changed] [O the map] [接 and] [V printed] [O copies] [M for schools and shops].', {
    chunks: [
      ['The students changed the map', '生徒たちは地図を直しました'],
      ['and printed copies', 'そして何部も印刷しました（だれのためにかは次へ）'],
      ['for schools and shops', '学校や店のために'],
    ],
    notes: {
      'and printed copies': 'copies は「（印刷した）部数・写し」。printed も The students を主語にしています。',
    },
  }),
  st('[S They] [V put] [O the same information] [M on the town website].', {
    chunks: [
      ['They put the same information', '彼らは同じ情報を載せました（どこにかは次へ）'],
      ['on the town website', '町のウェブサイトに'],
    ],
    notes: {
      'They put the same information': 'put はここでは過去形です（put は形が変わりません）。put A on B で「AをBに載せる」。',
    },
  }),
  st('[M {副詞節:理由| [接 Because] [S streets and buildings] [V change]}], [S the class] [V will check] [O every route] [M again] [M each spring].', {
    chunks: [
      ['Because streets and buildings change,', '道路や建物は変わるので'],
      ['the class will check every route again', 'クラスはすべての道順をもう一度確かめます'],
      ['each spring', '毎年春に'],
    ],
    notes: {
      'the class will check every route again': 'every ＋ 単数名詞 で「すべての〜」。',
      'each spring': 'each spring で「毎年春に」。',
    },
  }),
])
