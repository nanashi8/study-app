import { st } from './entry.js'

export default Object.freeze([
  st('[M Last spring], [S the students at Maple Junior High] [V started] [O a vegetable garden] [M behind their school].'),
  st('[M At first], [S many students] [V thought] [O {that省略| [S the work] [V would be] [C simple]}], [接 but] [S they] [M soon] [V learned] [O {that節| [接 that] [S plants] [V need] [O careful attention]}].', {
    notes: {
      'many students thought': 'thought の後ろでは接続詞 that が省略されています（thought (that) the work would be simple）。',
      'would be simple': 'would は「（そのときは）〜だろう」と、過去の時点での予想を表します。',
    },
  }),
  st('[S They] [V had to choose] [O a sunny place], [V remove] [O stones] [M from the soil], [接 and] [V water] [O the young plants] [M every day].', {
    notes: {
      'had to choose a sunny place,': 'had to は have to の過去形で「〜しなければならなかった」。',
      'remove stones': 'remove と後ろの water は、前の had to を共有する動詞です（had to remove / had to water）。',
    },
  }),
  st('[S Some students] [V forgot] [O their jobs] [M during the first week], [接 so] [S the tomatoes] [V did not grow] [M well].', {
    chunks: [
      ['Some students', '何人かの生徒は'],
      ['forgot their jobs', '自分の仕事を忘れました'],
      ['during the first week', '最初の週に'],
      ['so', 'そのため'],
      ['the tomatoes', 'トマトは'],
      ['did not grow well', 'うまく育ちませんでした'],
    ],
    notes: {
      'did not grow well': 'not … well で「うまく〜しない」。まったく育たなかったのではなく、育ち方がよくなかったという意味です。',
    },
  }),
  st('[S Their science teacher] [V asked] [O each group] [C {to:補語| [V to make] [O a schedule] [接 and] [V write] [O short notes about the weather]}].', {
    notes: {
      'asked each group to make a schedule': 'ask ＋ 人 ＋ to do で「人に〜するように求める」。',
      'write short notes': 'write は to make と to を共有しています（(to) write）。',
    },
  }),
  st('[M After that], [S the garden] [V changed] [M quickly].', {
    notes: {
      'After that': 'この that は「そのこと」と前の内容を指す代名詞です。',
    },
  }),
  st('[S The students] [V began] [O {to:名詞| [V to understand] [O {疑問詞節| [M how] [S temperature, rain, and insects] [V affected] [O the vegetables]}]}].', {
    chunks: [
      ['The students', '生徒たちは'],
      ['began to understand', '理解し始めました（何を理解したかは次へ）'],
      ['how', 'どのように'],
      ['temperature, rain, and insects', '気温や雨や昆虫が'],
      ['affected the vegetables', '野菜に影響を与えたのかを（理解し始めました）'],
    ],
    notes: {
      'began to understand': 'begin to do で「〜し始める」。to understand が began の目的語です。',
      how: 'how 以下（how … affected the vegetables）は「どのように〜したか」という名詞のまとまりで、understand の目的語です。',
    },
  }),
  st('[M In June], [S the students] [V noticed] [O {that節| [接 that] [S insects] [V were eating] [O the leaves of several plants]}].', {
    chunks: [
      ['In June', '6月に'],
      ['the students noticed', '生徒たちは気づきました'],
      ['that', '〜ということに（中身は次へ）'],
      ['insects', '虫が'],
      ['were eating the leaves of several plants', 'いくつかの植物の葉を食べていること（に気づきました）'],
    ],
    notes: {
      'were eating the leaves of several plants': 'were eating は過去進行形で「（そのとき）食べていた」。',
    },
  }),
  st('[S Some] [V wanted] [O {to:名詞| [V to use] [O a strong chemical spray]}], [接 but] [S the teacher] [V asked] [O them] [C {to:補語| [V to research] [O safer choices] [M first]}].', {
    chunks: [
      ['Some', '何人かの生徒は'],
      ['wanted to use a strong chemical spray', '強い薬品のスプレーを使いたいと思いました'],
      ['but', 'しかし'],
      ['the teacher', '先生は'],
      ['asked them to research safer choices first', 'まず、より安全な方法を調べるよう生徒たちに求めました'],
    ],
    notes: {
      Some: 'Some は Some students の students を省いた形です。',
    },
  }),
  st('[S They] [V learned] [O {that節| [接 that] [S certain flowers] [V attract] [O insects {関係>insects| [S that] [V eat] [O garden pests] [M without {動名詞| [V harming] [O the vegetables]}]}]}].', {
    chunks: [
      ['They learned', '生徒たちは学びました'],
      ['that', '次の内容だと（中身は次へ）'],
      ['certain flowers', 'ある種の花が'],
      ['attract insects', '昆虫を引き寄せる（と学びました）'],
      ['that', 'そしてその昆虫は'],
      ['eat garden pests', '畑の害虫を食べます'],
      ['without harming the vegetables', '野菜を傷つけることなく'],
    ],
    notes: {
      'without harming the vegetables': 'without ＋ -ing で「〜せずに」。harming は前置詞 without の目的語になる動名詞です。',
    },
  }),
  st('[S The class] [V planted] [O those flowers] [M around the garden], [接 and] [S the number of damaged leaves] [M soon] [V decreased].', {
    chunks: [
      ['The class', 'クラスは'],
      ['planted those flowers', 'その花を植えました'],
      ['around the garden', '菜園の周りに'],
      ['and', 'そして'],
      ['the number of damaged leaves', '傷んだ葉の数は'],
      ['soon', 'すぐに'],
      ['decreased', '減りました'],
    ],
  }),
  st('[M In July], [S they] [V picked] [O enough cucumbers and tomatoes {to:副詞(程度)| [V to share] [M with people at a nearby community center]}].', {
    chunks: [
      ['In July', '7月に'],
      ['they', '生徒たちは'],
      ['picked enough cucumbers and tomatoes', '十分な量のきゅうりとトマトを収穫しました'],
      ['to share', '分け合えるほど（十分な量を）'],
      ['with people', '人々と'],
      ['at a nearby community center', '近くのコミュニティセンターにいる（人々と）'],
    ],
    notes: {
      'to share': 'enough ＋ 名詞 ＋ to do で「〜できるほど十分な名詞」。',
    },
  }),
  st('[M Instead of {動名詞| [M simply] [V giving] [O the food] [M away]}], [S the students] [V visited] [O the center] [接 and] [V explained] [O {疑問詞節| [M how] [S they] [V had grown] [O it]}].', {
    chunks: [
      ['Instead of', '〜するのではなく（内容は次へ）'],
      ['simply giving the food away', 'ただ食べ物をあげてしまう（のではなく）'],
      ['the students', '生徒たちは'],
      ['visited the center', 'そのセンターを訪れました'],
      ['and', 'そして'],
      ['explained', '説明しました'],
      ['how', 'どのように'],
      ['they', '自分たちが'],
      ['had grown it', 'その野菜を育ててきたのかを（説明しました）'],
    ],
    notes: {
      'simply giving the food away': 'give … away で「〜を人にあげてしまう」。giving は Instead of の後ろに来る動名詞です。',
      'had grown it': 'had grown は過去完了で、説明した時点までに育ててきたことを表します。it は the food を指します。',
    },
  }),
  st('[S The older residents] [V shared] [O recipes] [接 and] [V suggested] [O vegetables {関係>vegetables| [O that] [S the class] [V could plant] [M in autumn]}].', {
    chunks: [
      ['The older residents', '年配の住民は'],
      ['shared recipes', 'レシピを教えてくれました'],
      ['and', 'そして'],
      ['suggested vegetables', '野菜を提案しました'],
      ['that', 'その野菜を'],
      ['the class could plant', 'クラスは植えることができました'],
      ['in autumn', '秋に'],
    ],
  }),
  st('[S The students] [V used] [O this advice] [M {to:副詞(目的)| [V to plan] [O a second garden]}], [M {関係,>前の内容| [S which] [V made] [O the project] [C {原形| [V continue] [M beyond one school term]}]}].', {
    chunks: [
      ['The students', '生徒たちは'],
      ['used this advice', 'この助言を使いました'],
      ['to plan a second garden', '二つ目の菜園を計画するために'],
      ['which', 'そしてそのことが'],
      ['made the project continue', 'その活動が続くようにしました'],
      ['beyond one school term', '一学期を越えて（続くように）'],
    ],
    notes: {
      which: 'コンマの後ろの which は、前の節の内容（二つ目の菜園を計画したこと）を受けています。',
      'made the project continue': 'make ＋ O ＋ 動詞の原形で「Oに〜させる」。continue は to のない不定詞（原形不定詞）です。',
    },
  }),
  st('[S The experience] [V taught] [O1 them] [O2 {that節| [接 that] [S {動名詞| [V protecting] [O the environment]}] [V can begin] [M with small daily actions]}].', {
    chunks: [
      ['The experience', 'その経験は'],
      ['taught them', '生徒たちに教えました（内容は次へ）'],
      ['that', '〜ということを'],
      ['protecting the environment can begin', '環境を守ることは始められる'],
      ['with small daily actions', '日々の小さな行動から（始められる、と教えました）'],
    ],
    notes: {
      'taught them': 'teach ＋ 人 ＋ that節 で「人に〜ということを教える」。',
      'protecting the environment can begin': 'protecting the environment は「環境を守ること」という動名詞のまとまりで、that 節の主語です。',
    },
  }),
  st('[S It] [M also] [V gave] [O1 them] [O2 a chance {to:形容詞>a chance| [V to talk] [M with older people {関係>older people| [S who] [V knew] [O many useful farming tips]}]}].', {
    chunks: [
      ['It', 'その経験は'],
      ['also', 'また'],
      ['gave them a chance', '生徒たちに機会を与えました'],
      ['to talk with older people', '年配の人々と話す（機会を）'],
      ['who', 'そしてその人々は'],
      ['knew many useful farming tips', '役に立つ農業の知恵をたくさん知っていました'],
    ],
    notes: {
      It: 'It は前の文の The experience を指します。',
    },
  }),
  st('[M By the end of the project], [M even] [S the students {関係>the students| [S who] [V had disliked] [O gardening]}] [V were] [C proud of the result].', {
    chunks: [
      ['By the end of the project', 'プロジェクトの終わりまでには'],
      ['even the students', '生徒たちでさえ'],
      ['who had disliked gardening', '園芸を嫌っていた（生徒たちでさえ）'],
      ['were proud of the result', 'その結果を誇りに思っていました'],
    ],
    notes: {
      'even the students': 'even は直後の the students を強めて「〜でさえ」と意外さを表します。',
      'who had disliked gardening': 'had disliked は過去完了で、それより前（プロジェクトの前）に嫌いだったことを表します。',
      'were proud of the result': 'be proud of 〜 で「〜を誇りに思う」。',
    },
  }),
])
