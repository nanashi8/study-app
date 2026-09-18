import { st } from './entry.js'

export default Object.freeze([
  st('[S A small pond {前| behind our school}] [V had] [M nearly] [V disappeared] [M {前| under tall weeds}].', {
    chunks: [
      ['A small pond behind our school', '学校の裏の小さな池は'],
      ['had nearly disappeared under tall weeds', '背の高い雑草の下で、ほとんど見えなくなっていました'],
    ],
    notes: {
      'A small pond behind our school': 'behind our school は A small pond を後ろから説明して「学校の裏の池」。',
      'had nearly disappeared under tall weeds': 'had disappeared は過去完了で「（活動を始める前に）消えてしまっていた」。nearly は「ほとんど」。',
    },
    rules: ['paragraph-map', 'noun-boundary', 'main-clause-skeleton'],
  }),
  st('[S Elderly residents] [V remembered] [O clear water {前| with {並列| frogs, | insects | and green plants}}].', {
    chunks: [
      ['Elderly residents remembered clear water', '年配の住民は、澄んだ水を覚えていました（どんな水かは次へ）'],
      ['with frogs, insects and green plants', 'カエルや虫、緑の植物のある'],
    ],
    notes: {
      'Elderly residents remembered clear water': 'elderly は「年配の」。昔の池のようすを覚えているということです。',
      'with frogs, insects and green plants': 'with 以下は clear water を後ろから説明して「〜のある水」。',
    },
  }),
  st('[M Last spring], [S {並列| the science club | and a local wildlife group}] [V decided] [O {to:名詞| [V to restore] [O the habitat]}].', {
    chunks: [
      ['Last spring,', '昨年の春'],
      ['the science club and a local wildlife group', '科学部と地元の野生生物の会が'],
      ['decided to restore the habitat', 'その生きものの住みかを元に戻すことに決めました'],
    ],
    notes: {
      'the science club and a local wildlife group': '主語は and で結ばれた二つのグループです。',
      'decided to restore the habitat': 'decide to 〜 で「〜することに決める」。restore は「元に戻す」、habitat は「生きものの住みか」。',
    },
  }),
  st('[S The first survey] [V showed] [O the true size {前| of the task}].', {
    chunks: [
      ['The first survey showed the true size', '最初の調べで、本当の大きさが分かりました（何のかは次へ）'],
      ['of the task', 'その仕事の'],
    ],
    notes: {
      'The first survey showed the true size': 'show はここでは「示す・明らかにする」。',
      'of the task': 'the task は池を元に戻す仕事です。',
    },
  }),
  st('[S The students] [V measured] [O the water level] [接 and] [V recorded] [O the temperature] [M every week].', {
    chunks: [
      ['The students measured the water level', '生徒たちは水位を測り'],
      ['and recorded the temperature every week', '毎週、水温を記録しました'],
    ],
    notes: {
      'The students measured the water level': 'water level は「水位（水の高さ）」。',
      'and recorded the temperature every week': 'and の後ろの recorded の主語も The students です。',
    },
    rules: ['paragraph-map', 'parallel-shape', 'main-clause-skeleton'],
  }),
  st('[S The results] [V showed] [O {that節| [接 that] [S the pond itself] [V was not] [M badly] [C polluted]}].', {
    chunks: [
      ['The results showed that', 'その結果から、〜ということが分かりました（内容は次へ）'],
      ['the pond itself was not badly polluted', '池そのものは、ひどく汚れてはいない（ということ）'],
    ],
    notes: {
      'the pond itself was not badly polluted': 'itself は the pond を強めて「池そのもの」。polluted は「汚染された・汚れた」。問題は水の汚れではなかったということです。',
    },
  }),
  st('[S Residents] [V had released] [O a foreign fish] [M {前| into the pond}] [M many years before].', {
    chunks: [
      ['Residents had released a foreign fish', '住民が、外来の魚を放していたのです（どこにかは次へ）'],
      ['into the pond', '池に'],
      ['many years before', '何年も前に'],
    ],
    notes: {
      'Residents had released a foreign fish': 'had released は過去完了で、調べるより前のできごとです。foreign fish は「外来の魚」。',
      'many years before': 'before はここでは「（それより）前に」という副詞です。',
    },
  }),
  st('[S The prefecture] [M now] [V bans] [O that action], [接 but] [S the official rule] [V was] [C too late].', {
    chunks: [
      ['The prefecture now bans that action,', '県は今、そうしたことを禁じています'],
      ['but the official rule was too late', 'しかし、その公式の決まりは遅すぎました'],
    ],
    notes: {
      'The prefecture now bans that action,': 'that action は前の文の「外来の魚を放すこと」です。ban は「禁じる」。',
      'but the official rule was too late': '決まりができる前に、魚はもう放されていたということです。',
    },
  }),
  st('[S This species] [V eats] [O the young {前| of local frogs}], [接 and] [S it] [V destroys] [O the water plants].', {
    chunks: [
      ['This species eats the young of local frogs,', 'この種類の魚は、地元のカエルの子を食べ'],
      ['and it destroys the water plants', '水草もだめにしてしまいます'],
    ],
    notes: {
      'This species eats the young of local frogs,': 'species は「（生きものの）種類」。the young はここでは名詞で「（動物の）子」です。',
      'and it destroys the water plants': 'it は This species を指します。',
    },
  }),
  st('[S The fish] [V had] [O no natural enemy] [M here], [接 so] [S its numbers] [V had grown] [M rapidly].', {
    chunks: [
      ['The fish had no natural enemy here,', 'その魚には、ここに天敵がいなかったので'],
      ['so its numbers had grown rapidly', 'その数は、どんどん増えていました'],
    ],
    notes: {
      'The fish had no natural enemy here,': 'natural enemy は「天敵（食べる側の生きもの）」。この had は have の過去形で、had no 〜 は「〜がいなかった」。後半の had grown（過去完了）とは形が違います。',
      'so its numbers had grown rapidly': 'its は The fish を指します。had grown は過去完了で「（調べたときには）増えてしまっていた」。',
    },
  }),
  st('[S The group] [V could not remove] [O every fish] [M {前| in a single day}].', {
    chunks: [
      ['The group could not remove every fish', 'その会は、すべての魚を取り除くことはできませんでした（どのくらいでかは次へ）'],
      ['in a single day', 'たった一日では'],
    ],
    notes: {
      'The group could not remove every fish': 'not … every は「すべてを〜できるわけではない」という部分否定です。',
    },
    rules: ['paragraph-map', 'negation-scope', 'main-clause-skeleton'],
  }),
  st('[S The volunteers] [V placed] [O nets] [M {前| on Saturdays}] [接 and] [V weighed] [O the catch] [M carefully].', {
    chunks: [
      ['The volunteers placed nets on Saturdays', 'ボランティアは、毎週土曜日に網を仕掛け'],
      ['and weighed the catch carefully', 'とれた魚の重さを注意深く量りました'],
    ],
    notes: {
      'The volunteers placed nets on Saturdays': 'on Saturdays は複数形で「土曜日にはいつも」。',
      'and weighed the catch carefully': 'the catch はここでは名詞で「とれたもの（とれた魚）」。weigh は「重さを量る」。',
    },
  }),
  st('[S A local scientist] [V showed] [O1 the club] [O2 a simple way {to:形容詞>a simple way| [V to record] [O the water conditions]}].', {
    chunks: [
      ['A local scientist showed the club', '地元の科学者が、部に示してくれました（何をかは次へ）'],
      ['a simple way to record the water conditions', '水のようすを記録する簡単な方法を'],
    ],
    notes: {
      'A local scientist showed the club': 'show ＋ 人 ＋ もの で「人にものを示す」。',
      'a simple way to record the water conditions': 'to record 以下は a simple way を後ろから説明して「記録する方法」。',
    },
  }),
  st('[S The data {前| from six months}] [V revealed] [O a steady decline {前| in the foreign population}].', {
    chunks: [
      ['The data from six months', '6か月分のデータは'],
      ['revealed a steady decline', '着実な減少を示しました（何のかは次へ）'],
      ['in the foreign population', '外来の魚の数の'],
    ],
    notes: {
      'revealed a steady decline': 'reveal は「明らかにする」。steady decline は「着実な減少」。',
      'in the foreign population': 'population はここでは「（生きものの）数」。',
    },
  }),
  st('[S The students] [M also] [V cleared] [O the weeds {前| along the bank}] [接 and] [V planted] [O local grasses].', {
    chunks: [
      ['The students also cleared the weeds', '生徒たちはさらに、雑草を取り除きました（どこのかは次へ）'],
      ['along the bank', '岸に沿って生えた'],
      ['and planted local grasses', 'そして、その土地の草を植えました'],
    ],
    notes: {
      'The students also cleared the weeds': 'clear は「取り除く」。also は、魚を取るのに加えて、ということです。',
      'along the bank': 'along 以下は the weeds を後ろから説明します。bank はここでは「岸」。',
      'and planted local grasses': 'local grasses は「その土地にもともとある草」。',
    },
  }),
  st('[S The members] [V had expected] [O a faster recovery], [接 but] [S the work] [V demanded] [O patience].', {
    chunks: [
      ['The members had expected a faster recovery,', '部員たちは、もっと早く元に戻ると思っていました'],
      ['but the work demanded patience', 'しかし、その仕事にはがまん強さが必要でした'],
    ],
    notes: {
      'The members had expected a faster recovery,': 'had expected は過去完了で「（それまでは）期待していた」。recovery は「回復」。',
      'but the work demanded patience': 'demand はここでは「必要とする」。patience は「がまん強さ」。',
    },
    rules: ['paragraph-map', 'contrast-concession', 'main-clause-skeleton'],
  }),
  st('[S Frogs] [V returned] [M {前| in the second spring}], [接 but] [S the number {前| of insects}] [V remained] [C low].', {
    chunks: [
      ['Frogs returned in the second spring,', 'カエルは2度目の春に戻ってきました'],
      ['but the number of insects remained low', 'しかし、虫の数は少ないままでした'],
    ],
    notes: {
      'but the number of insects remained low': 'remain ＋ 形容詞 で「〜のままである」。',
    },
  }),
  st('[S Their teacher] [V explained] [O {that節| [接 that] [S a damaged habitat] [V needs] [O several seasons] [M {to:副詞(目的)| [V to become] [C stable]}]}].', {
    chunks: [
      ['Their teacher explained that', '先生は〜と説明しました（内容は次へ）'],
      ['a damaged habitat needs several seasons', '傷んだ住みかには、いくつもの季節が必要だ（何のためにかは次へ）'],
      ['to become stable', '落ち着いた状態になるには（と）'],
    ],
    notes: {
      'a damaged habitat needs several seasons': 'damaged は habitat を説明して「傷んだ」。several seasons は「いくつもの季節」。',
      'to become stable': 'to become は目的を表し「〜になるために」。stable は「安定した」。',
    },
  }),
  st('[S The club] [M therefore] [V decided] [O {to:名詞| [V to continue] [O the survey] [M {副詞節:時| [接 after] [S the first members] [V graduate]}]}].', {
    chunks: [
      ['The club therefore decided', 'そこで部は決めました（何をかは次へ）'],
      ['to continue the survey', '調べを続けることを（いつまでかは次へ）'],
      ['after the first members graduate', '最初の部員が卒業したあとも'],
    ],
    notes: {
      'The club therefore decided': 'therefore は、前の文の「落ち着くには何季節もかかる」を受けます。',
      'after the first members graduate': 'after 〜 の中は、先のことでも現在形 graduate で表します。',
    },
  }),
  st('[S The project] [V changed] [O the way {関係省略:関係副詞>the way| [S the town] [V sees] [O the land {前| behind the school}]}].', {
    chunks: [
      ['The project changed the way', 'この活動は、見方を変えました（どんな見方かは次へ）'],
      ['the town sees the land behind the school', '町の人たちが学校の裏の土地を見る（見方を）'],
    ],
    notes: {
      'The project changed the way': 'the way の後ろで関係副詞が省かれ、「〜するしかた」となります。',
      'the town sees the land behind the school': 'the town はここでは「町の人たち」。',
    },
    rules: ['paragraph-map', 'relative-clause', 'main-clause-skeleton'],
  }),
  st('[S The city office] [M now] [V provides] [O tools], [接 and] [S a nearby company] [V pays] [M {前| for the nets}].', {
    chunks: [
      ['The city office now provides tools,', '市役所は今、道具を出してくれています'],
      ['and a nearby company pays for the nets', 'そして近くの会社が網のお金を払っています'],
    ],
    notes: {
      'and a nearby company pays for the nets': 'pay for 〜 で「〜の代金を払う」。',
    },
  }),
  st('[S Younger children] [V visit] [O the pond] [M {前| with real curiosity {前| about {並列| the frogs | and the plants}}}].', {
    chunks: [
      ['Younger children visit the pond', '年下の子どもたちは、池を訪れます（どんな気持ちでかは次へ）'],
      ['with real curiosity', '心からの興味を持って（何へのかは次へ）'],
      ['about the frogs and the plants', 'カエルや植物への'],
    ],
    notes: {
      'Younger children visit the pond': 'younger は young の比較級で、生徒たちより「年下の」。',
      'with real curiosity': 'curiosity は「好奇心」。real は「心からの」。',
      'about the frogs and the plants': 'about 以下は curiosity を後ろから説明します。',
    },
  }),
  st('[S A community event {前| in autumn}] [M now] [V includes] [O a short report {前| from the science club}].', {
    chunks: [
      ['A community event in autumn', '秋の地域の行事には'],
      ['now includes a short report', '今、短い報告が入っています（だれからのかは次へ）'],
      ['from the science club', '科学部からの'],
    ],
    notes: {
      'now includes a short report': 'include は「含む」。',
    },
  }),
  st('[S The students] [V say] [O {that節| [接 that] [仮S it] [V is] [C much harder] [真S {to:名詞| [V to protect] [O a habitat]}] [M {前| than {to:名詞| [V to damage] [O one]}}]}].', {
    chunks: [
      ['The students say that', '生徒たちは〜と言います（内容は次へ）'],
      ['it is much harder to protect a habitat', '生きものの住みかを守るのはずっと難しい（何よりかは次へ）'],
      ['than to damage one', '壊すことよりも（と）'],
    ],
    notes: {
      'it is much harder to protect a habitat': 'it は形式主語で、本当の主語は to protect a habitat です。much は比較級 harder を強めます。',
      'than to damage one': 'one は a habitat の代わりです。',
    },
  }),
  st('[S They] [M also] [V believe] [O {that節| [接 that] [S a small pond] [V can teach] [O a town] [M {前| about the wider environment}]}].', {
    chunks: [
      ['They also believe that', '生徒たちはまた、〜と信じています（内容は次へ）'],
      ['a small pond can teach a town', '小さな池が町に教えることができる（何についてかは次へ）'],
      ['about the wider environment', 'もっと広い環境について（と）'],
    ],
    notes: {
      'They also believe that': 'They は The students を指します。',
      'about the wider environment': 'wider は wide の比較級で「より広い」。',
    },
  }),
])
