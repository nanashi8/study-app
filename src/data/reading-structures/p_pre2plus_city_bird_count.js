import { st } from './entry.js'

export default Object.freeze([
  st('[S Professional scientists] [V cannot be] [M everywhere] [M {前| at once}], [M especially {副詞節:時| [接 when] [S they] [V study] [O animals {関係>animals| [S that] [V move] [M {前| across wide areas}]}]}].', {
    chunks: [
      ['Professional scientists cannot be everywhere at once,', '専門の科学者は、同時にあらゆる場所にいることはできません'],
      ['especially when they study animals', '特に動物を研究するときには（どんな動物かは次へ）'],
      ['that move across wide areas', '広い地域を移動する（動物を）'],
    ],
    notes: {
      'Professional scientists cannot be everywhere at once,': 'be everywhere は「どこにでもいる」。場所を表す everywhere は修飾語Mで、この文は第1文型です。at once は「同時に」。',
      'especially when they study animals': 'especially は when 以下を強めて「特に〜するときは」。they は Professional scientists を指します。',
    },
  }),
  st('[S Many research groups] [V need] [O more information], [接 so] [S they] [V invite] [O ordinary people] [C {to:補語| [V to join] [O projects {過去分詞>projects| [V known] [C {前| as citizen science}]}]}].', {
    chunks: [
      ['Many research groups need more information,', '多くの研究団体は、もっと多くの情報を必要としています'],
      ['so', 'そのため'],
      ['they invite ordinary people to join projects', '一般の人々に活動へ参加するよう呼びかけています'],
      ['known as citizen science', '市民科学として知られる（活動へ）'],
    ],
    notes: {
      'they invite ordinary people to join projects': 'invite ＋ 人 ＋ to 〜 で「人に〜するよう呼びかける・招く」。',
      'known as citizen science': 'known は know の過去分詞で、projects を後ろから説明します。be known as 〜 で「〜として知られている」。',
    },
  }),
  st('[S One common project] [V asks] [O participants] [C {to:補語| [V to observe] [O birds] [M {前| in gardens, parks, and school grounds}]}].', {
    chunks: [
      ['One common project asks participants', 'よくある活動の一つは、参加者に求めます（何をかは次へ）'],
      ['to observe birds', '鳥を観察するように'],
      ['in gardens, parks, and school grounds', '庭や公園、校庭で'],
    ],
    notes: {
      'One common project asks participants': 'ask ＋ 人 ＋ to 〜 で「人に〜するよう求める」。',
    },
  }),
  st('[S Volunteers] [V record] [O each species {関係省略:目的格>each species| [S they] [V see]}, the number {前| of birds}, the location, and the time].', {
    chunks: [
      ['Volunteers record each species', 'ボランティアは、それぞれの種類を記録します（どの種類かは次へ）'],
      ['they see,', '自分が見た（種類を）'],
      ['the number of birds,', '鳥の数や'],
      ['the location, and the time', '場所、時刻も'],
    ],
    notes: {
      'they see,': 'each species と they see の間に、関係詞 that（which）が省略されています。see の目的語が each species です。',
      'the location, and the time': 'each species から the time までの四つが、どれも record の目的語です。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S thousands {前| of people}] [V send] [O reports]}], [S researchers] [V can discover] [O patterns {関係>patterns| [O that] [S a small team] [V might miss]}].', {
    chunks: [
      ['When thousands of people send reports,', '何千人もの人が報告を送ると'],
      ['researchers can discover patterns', '研究者は傾向を見つけることができます（どんな傾向かは次へ）'],
      ['that a small team might miss', '小さなチームなら見落とすかもしれない（傾向を）'],
    ],
    notes: {
      'that a small team might miss': 'that は patterns を受ける関係代名詞で、miss の目的語です。might は「〜かもしれない」。',
    },
  }),
  st('[M {前| For example}], [S the records] [V may show] [O {that節| [接 that] [S a species] [V is arriving] [M earlier] [M {前| in spring}] [接 or] [V disappearing] [M {前| from certain neighborhoods}]}].', {
    chunks: [
      ['For example,', '例えば'],
      ['the records may show that', '記録から〜ことが分かるかもしれません（内容は次へ）'],
      ['a species is arriving earlier in spring', 'ある種類の鳥が春により早くやって来ている（ことや）'],
      ['or disappearing from certain neighborhoods', '特定の地域から姿を消している（ことが）'],
    ],
    notes: {
      'the records may show that': 'show that 〜 で「〜ということを示す」。記録が示すので、日本語では「記録から分かる」と訳せます。',
      'or disappearing from certain neighborhoods': 'disappearing も is を共有しています（is disappearing）。',
    },
  }),
  st('[S Such changes] [V can suggest] [O {that節| [接 that] [S weather, food, or habitat conditions] [V are affecting] [O bird populations]}].', {
    chunks: [
      ['Such changes can suggest that', 'そのような変化は、〜ことを示していることがあります（内容は次へ）'],
      ['weather, food, or habitat conditions', '天候や食べ物、生息環境の条件が'],
      ['are affecting bird populations', '鳥の個体数に影響している（ことを）'],
    ],
    notes: {
      'Such changes can suggest that': 'suggest that 〜 は、ここでは「〜ということをうかがわせる」。',
    },
  }),
  st('[M However], [S large numbers {前| of reports}] [V cannot] [M automatically] [V ensure] [O reliable data] [M {前| in practice}].', {
    chunks: [
      ['However,', 'しかし'],
      ['large numbers of reports', '報告が大量にあっても'],
      ['cannot automatically ensure reliable data', '信頼できるデータが自動的に保証されるわけではありません'],
      ['in practice', '実際には'],
    ],
    notes: {
      'cannot automatically ensure reliable data': 'not automatically は「自動的に〜とは限らない」という部分否定です。',
    },
  }),
  st('[S An experienced observer] [V may identify] [O a bird] [M {前| by its song}], [M {副詞節:対比| [接 while] [S a beginner] [V may confuse] [O two similar species]}].', {
    chunks: [
      ['An experienced observer may identify a bird', '経験豊かな観察者は、鳥を見分けるかもしれません'],
      ['by its song,', '鳴き声で'],
      ['while', '一方で'],
      ['a beginner may confuse two similar species', '初心者は似た2種類を取り違えるかもしれません'],
    ],
    notes: {
      'by its song,': 'by は手段を表して「〜によって」。its は a bird を指します。',
      while: 'while はここでは「一方で」と、経験豊かな観察者と初心者を比べています。',
    },
  }),
  st('[S People] [M also] [V visit] [O places {関係>places| [S that] [V are] [C easy {to:副詞(形容詞)| [V to reach]}]}] [M more often {前| than distant or unsafe locations}].', {
    chunks: [
      ['People also visit places', 'また、人々は場所を訪れます（どんな場所かは次へ）'],
      ['that are easy to reach', '行きやすい（場所を）'],
      ['more often', 'より頻繁に（訪れます）'],
      ['than distant or unsafe locations', '遠い場所や安全でない場所よりも'],
    ],
    notes: {
      'that are easy to reach': 'easy to 〜 で「〜しやすい」。places that are easy to reach で「行きやすい場所」。',
      'than distant or unsafe locations': 'than の後ろは、行きやすい場所と比べる相手です。',
    },
  }),
  st('[S This] [V creates] [O a bias] [M {副詞節:理由| [接 because] [S some habitats] [V receive] [O many reports] [接 and] [S others] [V receive] [O few]}].', {
    chunks: [
      ['This creates a bias', 'このことが偏りを生みます'],
      ['because', 'なぜなら'],
      ['some habitats receive many reports', '一部の生息地には多くの報告が集まり'],
      ['and others receive few', 'ほかの生息地にはわずかしか集まらないからです'],
    ],
    notes: {
      'This creates a bias': 'This は前の文の「人々が行きやすい場所を多く訪れること」を指します。',
      'and others receive few': 'others は other habitats、few は few reports のことです。',
    },
  }),
  st('[S Good projects] [V reduce] [O these problems] [M {前| through clear training and careful design}].', {
    chunks: [
      ['Good projects reduce these problems', 'よい活動は、こうした問題を減らします'],
      ['through clear training and careful design', '分かりやすい訓練と慎重な設計によって'],
    ],
    notes: {
      'Good projects reduce these problems': 'these problems は、前の段落の「見分け違い」と「報告の偏り」を指します。',
    },
  }),
  st('[S They] [V provide] [O pictures and recordings {関係>pictures and recordings| [S that] [V help] [O volunteers] [C {原形| [V identify] [O species] [M correctly]}]}].', {
    chunks: [
      ['They provide pictures and recordings', 'よい活動は、写真や録音を用意しています（どんなものかは次へ）'],
      ['that help volunteers identify species correctly', 'ボランティアが種類を正しく見分けるのに役立つ（写真や録音を）'],
    ],
    notes: {
      'They provide pictures and recordings': 'They は前の文の Good projects を指します。',
      'that help volunteers identify species correctly': 'help ＋ 人 ＋ 動詞の原形 で「人が〜するのを助ける」。',
    },
  }),
  st('[S They] [V may ask] [O participants] [C {to:補語| [V to watch] [M {前| for the same length {前| of time}}]} and {to:補語| [V to report] [O visits {関係>visits| [M when] [S no birds] [V appeared]}]}].', {
    chunks: [
      ['They may ask participants', 'よい活動は、参加者に求めることがあります（何をかは次へ）'],
      ['to watch for the same length of time', '同じ長さの時間だけ観察するように'],
      ['and to report visits', 'そして訪問も報告するように（どんな訪問かは次へ）'],
      ['when no birds appeared', '鳥が1羽も現れなかった（訪問も）'],
    ],
    notes: {
      'They may ask participants': 'ask ＋ 人 ＋ to 〜 で「人に〜するよう求める」。to watch と to report の二つが並んでいます。',
      'when no birds appeared': 'when は visits を受ける関係副詞で、「鳥が現れなかった訪問」。',
    },
  }),
  st('[S Experts] [M often] [V check] [O unusual reports] [M {副詞節:時| [接 before] [S the records] [V enter] [O the main database]}].', {
    chunks: [
      ['Experts often check unusual reports', '専門家は、珍しい報告を確認することがよくあります'],
      ['before the records enter the main database', 'その記録が主なデータベースに入る前に'],
    ],
    notes: {
      'before the records enter the main database': 'the records は、珍しい報告の記録を指します。',
    },
  }),
  st('[S Some projects] [M also] [V send] [O1 several volunteers] [O2 the same observation task] [接 and] [V compare] [O their answers] [M {to:副詞(目的)| [V to estimate] [O {疑問詞節| [M how often] [S mistakes] [V occur]}]}].', {
    chunks: [
      ['Some projects also send several volunteers', '一部の活動は、複数のボランティアに送ります（何をかは次へ）'],
      ['the same observation task', '同じ観察の課題を'],
      ['and compare their answers', 'そしてその答えを比べます'],
      ['to estimate how often mistakes occur', '間違いがどのくらいの頻度で起きるかを推定するために'],
    ],
    notes: {
      'Some projects also send several volunteers': 'send ＋ 人 ＋ もの で「人にものを送る」。',
      'to estimate how often mistakes occur': 'to estimate は目的を表して「推定するために」。how often 以下は estimate の目的語です。',
    },
  }),
  st('[S Researchers] [V can] [M then] [V compare] [O similar observations] [接 and] [V estimate] [O {疑問詞節| [M where] [S the data] [V may be] [C incomplete]}].', {
    chunks: [
      ['Researchers can then compare similar observations', 'その上で研究者は、似た観察結果を比べることができます'],
      ['and estimate', 'そして推定できます（何をかは次へ）'],
      ['where the data may be incomplete', 'データが不完全かもしれないのはどこかを'],
    ],
    notes: {
      'and estimate': 'estimate も can を共有しています（can estimate）。',
    },
  }),
  st('[S Citizen science] [V is] [C valuable] [M not {副詞節:理由| [接 because] [S volunteers] [V replace] [O professionals]}, but {副詞節:理由| [接 because] [S the two groups] [V contribute] [O different strengths]}].', {
    chunks: [
      ['Citizen science is valuable', '市民科学には価値があります（なぜかは次へ）'],
      ['not because volunteers replace professionals,', 'ボランティアが専門家に取って代わるからではなく'],
      ['but because the two groups contribute different strengths', '二つの集団がそれぞれ違う強みを出し合うからです'],
    ],
    notes: {
      'not because volunteers replace professionals,': 'not because A, but because B で「AだからではなくBだから」。',
    },
  }),
  st('[S The public] [V contributes] [O time, local knowledge, and a large number {前| of observations}].', {
    chunks: [
      ['The public contributes', '一般の人々は提供します（何をかは次へ）'],
      ['time, local knowledge,', '時間や地域についての知識'],
      ['and a large number of observations', 'そしてたくさんの観察結果を'],
    ],
    notes: {
      'The public contributes': 'the public は「一般の人々」。一つのまとまりとして扱うので contributes です。',
    },
  }),
  st('[S Scientists] [V contribute] [O research methods {関係>research methods| [S that] [V turn] [O those observations] [M {前| into careful conclusions}]}].', {
    chunks: [
      ['Scientists contribute research methods', '科学者は研究の方法を提供します（どんな方法かは次へ）'],
      ['that turn those observations into careful conclusions', 'それらの観察結果を慎重な結論に変える（方法を）'],
    ],
    notes: {
      'that turn those observations into careful conclusions': 'turn A into B で「AをBに変える」。those observations は前の文の観察結果を指します。',
    },
  }),
  st('[M Together], [S they] [V can follow] [O changes {前| in biodiversity}] [接 and] [V identify] [O places {関係>places| [S that] [V may need] [O conservation]}].', {
    chunks: [
      ['Together,', '力を合わせれば'],
      ['they can follow changes in biodiversity', '両者は生物多様性の変化を追うことができます'],
      ['and identify places', 'そして場所を特定できます（どんな場所かは次へ）'],
      ['that may need conservation', '保全が必要かもしれない（場所を）'],
    ],
    notes: {
      'they can follow changes in biodiversity': 'they は一般の人々と科学者の両方を指します。',
      'and identify places': 'identify も can を共有しています（can identify）。',
    },
  }),
  st('[S The partnership] [M also] [V shows] [O {that節| [接 that] [S useful science] [V depends] [M {前| on {動名詞| [V recording] [O uncertainty] [M as honestly {前| as discovery}]}}]}].', {
    chunks: [
      ['The partnership also shows that', 'この協力関係はまた、〜ことを示しています（内容は次へ）'],
      ['useful science depends on recording uncertainty', '役に立つ科学は、不確かさを記録することにかかっている（どう記録するかは次へ）'],
      ['as honestly as discovery', '発見を記録するのと同じくらい正直に'],
    ],
    notes: {
      'useful science depends on recording uncertainty': 'depend on 〜ing で「〜することにかかっている」。',
      'as honestly as discovery': 'as honestly as (it records) discovery の省略で、「発見を記録するのと同じくらい正直に」。',
    },
  }),
])
