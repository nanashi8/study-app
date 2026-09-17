import { st } from './entry.js'

export default Object.freeze([
  st('[M Last spring], [S workers] [V put] [O solar panels] [M {前| on the roof {前| of our school}}].', {
    chunks: [
      ['Last spring, workers put solar panels', '昨年の春、作業の人が太陽光パネルを取り付けました（どこにかは次へ）'],
      ['on the roof of our school', '私たちの学校の屋根に'],
    ],
    notes: {
      'Last spring, workers put solar panels': 'solar panel は日光から電気を作る板です。put は過去形も put です。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S The panels] [V change] [O sunlight] [M {前| into electricity {前| for the classrooms}}].', {
    chunks: [
      ['The panels change sunlight into electricity', 'そのパネルは、日光を電気に変えます（何のためかは次へ）'],
      ['for the classrooms', '教室で使うための'],
    ],
    notes: {
      'The panels change sunlight into electricity': 'change A into B で「AをBに変える」。',
      'for the classrooms': 'for the classrooms は electricity を後ろから説明して「教室のための電気」。',
    },
  }),
  st('[S A screen {前| near the office}] [V reports] [O the power {関係>the power| [O that] [S the school] [V makes] [M each day]}].', {
    chunks: [
      ['A screen near the office reports the power', '事務室の近くの画面が、電力を知らせます（どんな電力かは次へ）'],
      ['that the school makes each day', '学校が毎日作り出している（電力を）'],
    ],
    notes: {
      'A screen near the office reports the power': 'near the office は A screen を後ろから説明して「事務室の近くの画面」。',
      'that the school makes each day': 'that は the power を受ける関係代名詞で、makes の目的語にあたります。each day は makes にかかり「毎日作る」。reports が知らせているのは「学校が毎日作る電力」全体です。',
    },
  }),
  st('[S Our science teacher] [V asked] [O students] [C {to:補語| [V to check] [O the numbers] [M every Monday]}].', {
    chunks: [
      ['Our science teacher asked students', '理科の先生は、生徒たちに頼みました（何をかは次へ）'],
      ['to check the numbers every Monday', '毎週月曜日にその数字を確かめるように'],
    ],
    notes: {
      'Our science teacher asked students': 'ask ＋ 人 ＋ to 〜 で「人に〜するよう頼む」。',
      'to check the numbers every Monday': 'the numbers は、画面に出る発電量の数字です。',
    },
    rules: ['svoc-core', 'infinitive-role', 'paragraph-map'],
  }),
  st('[S We] [V learned] [O {that節| [接 that] [S the panels] [V made] [O the most electricity] [M {前| in May}]}].', {
    chunks: [
      ['We learned that', '私たちは〜と分かりました（内容は次へ）'],
      ['the panels made the most electricity in May', 'パネルが5月にいちばん多く電気を作ったこと'],
    ],
    notes: {
      'the panels made the most electricity in May': 'the most electricity で「いちばん多くの電気」。most は many・much の最上級です。',
    },
  }),
  st('[M {前| In June}], [S clouds and rain] [V lowered] [O the number] [M {前| for two weeks}].', {
    chunks: [
      ['In June, clouds and rain lowered the number', '6月には、雲と雨がその数字を下げました（どのくらいかは次へ）'],
      ['for two weeks', '2週間'],
    ],
    notes: {
      'In June, clouds and rain lowered the number': 'lower はここでは動詞で「下げる」。the number は発電量の数字です。',
    },
  }),
  st('[S Some students] [V thought] [O {that省略| [S the panels] [V were] [C broken]}], [接 but] [S the weather] [V was] [C the real reason].', {
    chunks: [
      ['Some students thought the panels were broken,', 'パネルが壊れたと思った生徒もいました'],
      ['but the weather was the real reason', 'しかし、本当の理由は天気でした'],
    ],
    notes: {
      'Some students thought the panels were broken,': 'thought の後ろに that が省かれています。broken は「壊れた」。',
      'but the weather was the real reason': 'the real reason は「本当の理由」。数字が下がった原因は故障ではなかったということです。',
    },
  }),
  st('[S The school] [M also] [V uses] [O the panels] [M {前| in an emergency}].', {
    chunks: [
      ['The school also uses the panels', '学校は、そのパネルを〜にも使います（いつかは次へ）'],
      ['in an emergency', '非常のときに'],
    ],
    notes: {
      'in an emergency': 'emergency は「非常のとき・緊急時」。',
    },
    rules: ['paragraph-map', 'logic-connectors', 'main-clause-skeleton'],
  }),
  st('[S A battery {前| in the gym}] [V can store] [O power] [M {前| for lights and phones}].', {
    chunks: [
      ['A battery in the gym can store power', '体育館にある蓄電池が、電気をためられます（何のためかは次へ）'],
      ['for lights and phones', '照明と電話のために'],
    ],
    notes: {
      'A battery in the gym can store power': 'store はここでは「たくわえる」。in the gym は A battery を後ろから説明しています。',
    },
  }),
  st('[M Last year], [S a strong typhoon] [V stopped] [O electricity] [M {前| in our town}] [M {前| for one night}].', {
    chunks: [
      ['Last year, a strong typhoon stopped electricity', '昨年、強い台風が電気を止めました（どこでかは次へ）'],
      ['in our town for one night', '私たちの町で、一晩'],
    ],
    notes: {
      'Last year, a strong typhoon stopped electricity': 'stop electricity で「電気を止める」。停電のことです。',
    },
  }),
  st('[S Families] [V came] [M {前| to the gym}] [M {副詞節:理由| [接 because] [S the lights] [M there] [V were] [M still] [C on]}].', {
    chunks: [
      ['Families came to the gym', '家族連れが体育館に来ました（なぜかは次へ）'],
      ['because the lights there were still on', 'そこの明かりがまだついていたからです'],
    ],
    notes: {
      'because the lights there were still on': 'there は「体育館に」。were still on の on は「（明かりが）ついている」。',
    },
  }),
  st('[S The panels] [V do not solve] [O every problem].', {
    chunks: [
      ['The panels do not solve every problem', 'そのパネルが、すべての問題を解決するわけではありません'],
    ],
    notes: {
      'The panels do not solve every problem': 'not … every は「すべてが〜というわけではない」という部分否定です。',
    },
    rules: ['negation-scope', 'paragraph-map', 'main-clause-skeleton'],
  }),
  st('[S They] [V cannot make] [O enough power {前| for the whole school}] [M {前| on dark winter days}].', {
    chunks: [
      ['They cannot make enough power', 'それらは、十分な電気を作れません（だれのためかは次へ）'],
      ['for the whole school on dark winter days', '学校全体のために、暗い冬の日には'],
    ],
    notes: {
      'They cannot make enough power': 'They は前の文の The panels を指します。',
      'for the whole school on dark winter days': 'for the whole school は enough power を後ろから説明して「学校全体に足りる電気」。',
    },
  }),
  st('[S The school] [M still] [V buys] [O electricity] [M {前| from the power company}].', {
    chunks: [
      ['The school still buys electricity', '学校は今も電気を買っています（どこからかは次へ）'],
      ['from the power company', '電力会社から'],
    ],
    notes: {
      'The school still buys electricity': 'still は「今でも」。パネルだけでは足りないということです。',
    },
  }),
  st('[M Now] [S students] [V talk] [M {前| about energy}] [M {前| at home}], [接 and] [S some families] [V check] [O their own use].', {
    chunks: [
      ['Now students talk about energy at home,', '今では、生徒が家でエネルギーの話をします'],
      ['and some families check their own use', '自分の家の使用量を確かめる家庭もあります'],
    ],
    notes: {
      'and some families check their own use': 'their own use は「その家庭自身の使用量」。パネルが会話や行動を変えたということです。',
    },
  }),
])
