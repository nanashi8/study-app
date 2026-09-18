import { st } from './entry.js'

export default Object.freeze([
  st('[S Cities] [V have] [M always] [V had to respond] [M {前| to weather}], [接 but] [S the challenge] [V has become] [C more complicated] [M {副詞節:比例| [接 as] [S {並列| extreme heat | and sudden storms}] [V occur] [M more frequently]}].', {
    chunks: [
      ['Cities', '都市は'],
      ['have always had to respond', 'これまでずっと対応しなければなりませんでした'],
      ['to weather', '天候に'],
      ['but', 'しかし'],
      ['the challenge', 'その課題は'],
      ['has become more complicated', 'より複雑になっています'],
      ['as', '〜するにつれて（内容は次へ）'],
      ['extreme heat and sudden storms occur', '猛暑や突然の嵐が起こる'],
      ['more frequently', 'より頻繁に（起こるにつれて）'],
    ],
    notes: {
      'have always had to respond': 'have had to は have to の現在完了で「（これまで）〜しなければならなかった」。',
      as: 'as はここでは「〜するにつれて」と、変化が並んで進むことを表します。',
    },
  }),
  st('[M {前| In the past}], [S local governments] [M often] [V treated] [O {並列| floods, | heat waves, | and water shortages}] [C {前| as separate problems}].', {
    chunks: [
      ['In the past', 'かつては'],
      ['local governments', '地方自治体は'],
      ['often', 'よく'],
      ['treated floods, heat waves, and water shortages', '洪水や熱波、水不足を扱いました（どう扱ったかは次へ）'],
      ['as separate problems', '別々の問題として'],
    ],
    notes: {
      'as separate problems': 'treat A as B で「AをBとして扱う」。as 以下が A の中身を説明する補語です。',
    },
  }),
  st('[M Today], [S many planners] [V argue] [O {that節| [接 that] [S cities] [V need] [O a broader framework {関係>a broader framework| [S that] [V connects] [O {並列| transportation, | housing, | energy, | and public health}]}]}].', {
    chunks: [
      ['Today', '今日では'],
      ['many planners argue', '多くの都市計画者は主張しています（内容は次へ）'],
      ['that', '〜だと'],
      ['cities', '都市は'],
      ['need a broader framework', 'より広い枠組みを必要としている'],
      ['that connects', 'そしてその枠組みは結びつけます（何をかは次へ）'],
      ['transportation, housing, energy, and public health', '交通・住宅・エネルギー・公衆衛生を'],
    ],
  }),
  st('[S One reason] [V is] [C {that節| [接 that] [S a measure {過去分詞>a measure| [V designed] [M {前| for a single purpose}]}] [V can have] [O unexpected consequences] [M {前| in another area}]}].', {
    chunks: [
      ['One reason is that', '理由の一つは次のことです'],
      ['a measure designed for a single purpose', '一つの目的のために作られた対策が'],
      ['can have unexpected consequences', '予期しない結果をもたらすことがある'],
      ['in another area', '別の分野で（ということです）'],
    ],
    notes: {
      'One reason is that': 'that 以下が One reason の中身を説明する補語になる名詞節です。',
      'a measure designed for a single purpose': 'designed 以下は a measure を後ろから説明する過去分詞のまとまりです。',
    },
  }),
  st('[M {前| For instance}], [S {動名詞| [V building] [O higher concrete walls] [M {前| along a river}]}] [V may reduce] [O flooding {前| in one district}] [M {副詞節:対比| [接 while] [V pushing] [O water] [M {前| toward a poorer neighborhood }downstream]}].', {
    chunks: [
      ['For instance', '例えば'],
      ['building higher concrete walls along a river', '川沿いにより高いコンクリートの壁を建てることは'],
      ['may reduce flooding in one district', 'ある地区の洪水を減らすかもしれません'],
      ['while pushing water', '一方で水を押しやるかもしれません（どこへかは次へ）'],
      ['toward a poorer neighborhood downstream', '下流のより貧しい地域へ'],
    ],
    notes: {
      'building higher concrete walls along a river': 'building 以下は「〜を建てること」という動名詞のまとまりで、文の主語です。',
      'while pushing water': 'while pushing は while (it is) pushing の形で、「〜する一方で」。',
    },
  }),
  st('[M Similarly], [S {動名詞| [V installing] [O powerful air conditioners] [M {前| in public buildings}]}] [V may protect] [O residents] [M {前| during heat waves}], [接 yet] [S it] [V can increase] [O energy demand] [M {副詞節:時| [接 when] [S the power supply] [V is] [M already] [M {前| under pressure}]}].', {
    chunks: [
      ['Similarly', '同じように'],
      ['installing powerful air conditioners in public buildings', '公共施設に強力なエアコンを設置することは'],
      ['may protect residents', '住民を守るかもしれません'],
      ['during heat waves', '熱波のあいだ'],
      ['yet', 'しかし'],
      ['it', 'そのことは'],
      ['can increase energy demand', 'エネルギーの需要を増やすことがあります'],
      ['when', '〜するときに（内容は次へ）'],
      ['the power supply', '電力の供給が'],
      ['is already under pressure', 'すでに逼迫している（ときに）'],
    ],
    notes: {
      it: 'it は前の installing powerful air conditioners in public buildings を指します。',
      'is already under pressure': 'under pressure は「圧力を受けて・逼迫して」。',
    },
  }),
  st('[S A more resilient city] [M therefore] [V begins] [M {前| by {動名詞| [V assessing] [O {並列| {疑問詞節| [S who] [V is] [C most vulnerable]} | and {疑問詞節| [S which resources] [V can serve] [O several needs] [M {前| at once}]}}]}}].', {
    chunks: [
      ['A more resilient city therefore begins', 'そのため、より回復力のある都市は始めます（何から始めるかは次へ）'],
      ['by assessing', '評価することから（何をかは次へ）'],
      ['who is most vulnerable', 'だれが最も弱い立場にあるか'],
      ['and which resources', 'そして、どの資源が'],
      ['can serve several needs at once', '同時にいくつもの必要を満たせるか（を）'],
    ],
    notes: {
      'by assessing': 'by ＋ -ing で「〜することによって・〜することから」。',
      'and which resources': 'who … と which resources … の二つの疑問詞の節が and で並び、どちらも assessing の目的語です。',
    },
  }),
  st('[S Trees] [V are] [C a useful example].', {
    chunks: [
      ['Trees', '樹木は'],
      ['are a useful example', '役に立つ例です'],
    ],
  }),
  st('[S They] [V provide] [O shade], [V absorb] [O rainwater], [V improve] [O air quality], [接 and] [V make] [O streets] [C more pleasant {前| for walking}].', {
    chunks: [
      ['They', '樹木は'],
      ['provide shade,', '日陰を作ります'],
      ['absorb rainwater,', '雨水を吸収します'],
      ['improve air quality', '空気の質をよくします'],
      ['and', 'そして'],
      ['make streets more pleasant', '通りをより快適にします（何にとってかは次へ）'],
      ['for walking', '歩くのに'],
    ],
    notes: {
      'make streets more pleasant': 'make ＋ O ＋ C で「OをCにする」。',
    },
  }),
  st('[M However], [S {動名詞| [V planting] [O trees]}] [V is not] [C a simple solution] [M {副詞節:条件| [接 if] [S maintenance money] [V is limited]}] [接 or] [M {副詞節:条件| [接 if] [S sidewalks] [V are] [C too narrow {前:意味上の主語| for roots} {to:副詞(程度)| [V to grow] [M safely]}]}].', {
    chunks: [
      ['However', 'しかし'],
      ['planting trees', '木を植えることは'],
      ['is not a simple solution', '単純な解決策ではありません'],
      ['if maintenance money is limited', '維持のための費用が限られていたり'],
      ['or if sidewalks are too narrow', '歩道が狭すぎたりすると（どれほどかは次へ）'],
      ['for roots to grow safely', '根が安全に伸びるには'],
    ],
    notes: {
      'or if sidewalks are too narrow': '二つの if 節が or で並んでいます。too ＋ 形容詞 ＋ to do で「〜するには…すぎる」。',
      'for roots to grow safely': 'for roots は to grow の意味上の主語で、「根が伸びる」と読みます。',
    },
  }),
  st('[S This] [V illustrates] [O a problem {関係>a problem| [O that] [S researchers] [V call] [C maladaptation]}]: [S an attempt {to:形容詞>an attempt| [V to reduce] [O one risk]}] [V can create] [O a new risk] [接 or] [V deepen] [O an old inequality].', {
    chunks: [
      ['This', 'このことは'],
      ['illustrates a problem', 'ある問題を示しています'],
      ['that researchers call maladaptation', '研究者が「不適応」と呼ぶ（問題を）'],
      ['an attempt', 'つまり、試みが（どんな試みかは次へ）'],
      ['to reduce one risk', 'ある危険を減らそうとする（試みが）'],
      ['can create a new risk', '新しい危険を生むことがあります'],
      ['or deepen an old inequality', 'あるいは以前からの不平等を深めることがあります'],
    ],
    notes: {
      'that researchers call maladaptation': 'that は a problem を受ける関係代名詞で、call の目的語です。call ＋ O ＋ C で「OをCと呼ぶ」。',
      'an attempt': 'コロン（:）の後ろで、maladaptation がどういう問題かを説明しています。',
    },
  }),
  st('[S A park {関係>A park| [S that] [V cools] [O a wealthy district]}], [M {前| for example}], [V may increase] [O nearby rents] [接 and] [V force] [O lower-income residents] [C {to:補語| [V to move] [M {副詞節:時| [接 before] [S they] [V enjoy] [O the benefits]}]}].', {
    chunks: [
      ['A park', '公園が'],
      ['that cools a wealthy district,', '裕福な地区を涼しくする（公園が）'],
      ['for example,', '例えば'],
      ['may increase nearby rents', '近くの家賃を上げるかもしれません'],
      ['and', 'そして'],
      ['force lower-income residents to move', '低所得の住民に引っ越しを強いるかもしれません'],
      ['before they enjoy the benefits', '住民がその恩恵を受ける前に'],
    ],
    notes: {
      'force lower-income residents to move': 'force ＋ 人 ＋ to do で「人に〜することを強いる」。',
    },
  }),
  st('[S Planners] [V must] [M therefore] [V examine] [O {並列| not only {whether節| [接 whether] [S an intervention] [V works] [M physically]} | but also {疑問詞節| [M how] [S its {並列| costs | and benefits}] [V are distributed]}}].', {
    chunks: [
      ['Planners must therefore examine', 'そのため計画者は調べなければなりません（何をかは次へ）'],
      ['not only', '〜だけでなく（一つ目は次へ）'],
      ['whether an intervention works physically', '対策が物理的にうまく働くかどうか'],
      ['but also', '〜も（二つ目は次へ）'],
      ['how its costs and benefits are distributed', 'その費用と恩恵がどのように分配されるかも'],
    ],
    notes: {
      'not only': 'not only A but also B で「AだけでなくBも」。A も B も examine の目的語です。',
    },
  }),
  st('[S Good policy] [V must be based] [M {前| on evidence {前| from the actual community}}] [M {前| rather than {前| on attractive ideas {過去分詞>attractive ideas| [V copied] [M {前| from other cities}]}}}].', {
    chunks: [
      ['Good policy must be based', 'よい政策は基づくべきです（何にかは次へ）'],
      ['on evidence from the actual community', '実際の地域から得た根拠に'],
      ['rather than on attractive ideas', '魅力的な考えにではなく'],
      ['copied from other cities', 'ほかの都市からまねた（考えに）'],
    ],
    notes: {
      'Good policy must be based': 'be based on 〜 で「〜に基づいている」。',
      'rather than on attractive ideas': 'A rather than B で「BではなくA」。on evidence と on attractive ideas を比べています。',
    },
  }),
  st('[S Some cities] [V have begun] [O {to:名詞| [V to invite] [O residents] [C {to:補語| [V to map] [O {並列| dangerous intersections, | hot streets, | and places {関係>places| [M where] [S water] [V remains] [M {前| after heavy rain}]}}]}]}].', {
    chunks: [
      ['Some cities', '一部の都市は'],
      ['have begun to invite residents', '住民に呼びかけ始めています（何をかは次へ）'],
      ['to map dangerous intersections, hot streets,', '危険な交差点や暑い通り'],
      ['and places', 'そして場所を地図に書き込むように（どんな場所かは次へ）'],
      ['where water remains after heavy rain', '大雨のあとに水が残る（場所を）'],
    ],
    notes: {
      'have begun to invite residents': 'invite ＋ 人 ＋ to do で「人に〜するよう呼びかける」。',
      'where water remains after heavy rain': 'where は places を説明する関係副詞で、「その場所では」と受け直します。',
    },
  }),
  st('[S This process] [V takes] [O time], [接 and] [S it] [V may reveal] [O disagreements {前| about {疑問詞節| [S which projects] [V should come] [M first]}}].', {
    chunks: [
      ['This process', 'この過程は'],
      ['takes time', '時間がかかります'],
      ['and', 'そして'],
      ['it', 'この過程は'],
      ['may reveal disagreements', '意見の食い違いを明らかにするかもしれません'],
      ['about which projects should come first', 'どの事業を先に行うべきかについての（食い違いを）'],
    ],
    notes: {
      'about which projects should come first': 'which projects … は前置詞 about の目的語になる疑問詞の節です。',
    },
  }),
  st('[M Nevertheless], [S it] [V can build] [O trust] [M {副詞節:理由| [接 because] [S residents] [V see] [O {that節| [接 that] [S their daily experience] [V is treated] [C {前| as valuable information}]}]}].', {
    chunks: [
      ['Nevertheless', 'それでも'],
      ['it', 'この過程は'],
      ['can build trust', '信頼を築くことができます'],
      ['because', 'なぜなら'],
      ['residents see', '住民は分かります（内容は次へ）'],
      ['that', '〜だと'],
      ['their daily experience', '自分たちの毎日の経験が'],
      ['is treated as valuable information', '価値のある情報として扱われている（と分かるからです）'],
    ],
    notes: {
      'is treated as valuable information': 'treat A as B「AをBとして扱う」の受け身です。',
    },
  }),
  st('[S Local knowledge] [M also] [V helps] [O officials] [C {原形| [V identify] [O failures {関係>failures| [O that] [S computer models] [V miss]}]}].', {
    chunks: [
      ['Local knowledge', '地域の知識は'],
      ['also', 'また'],
      ['helps officials identify failures', '担当者が不具合を見つける助けになります'],
      ['that computer models miss', 'コンピューターのモデルが見落とす（不具合を）'],
    ],
    notes: {
      'helps officials identify failures': 'help ＋ 人 ＋ 動詞の原形 で「人が〜するのを助ける」。',
      'that computer models miss': 'that は failures を受ける関係代名詞で、miss の目的語です。',
    },
  }),
  st('[S A drainage map] [V may look] [C complete], [接 yet] [S residents] [V may know] [O {that節| [接 that] [S blocked street drains] [M regularly] [V send] [O water] [M {前| into a particular apartment building}]}].', {
    chunks: [
      ['A drainage map', '排水の地図は'],
      ['may look complete', '完全に見えるかもしれません'],
      ['yet', 'それでも'],
      ['residents may know', '住民は知っているかもしれません（内容は次へ）'],
      ['that', '〜ということを'],
      ['blocked street drains', '詰まった道路の排水口が'],
      ['regularly', 'たびたび'],
      ['send water', '水を流し込む（どこへかは次へ）'],
      ['into a particular apartment building', 'ある特定の集合住宅へ（ということを）'],
    ],
    notes: {
      'may look complete': 'look ＋ 形容詞 で「〜に見える」。',
    },
  }),
  st('[S Such observations] [V do not replace] [O scientific data]; [S they] [V reveal] [O {疑問詞節| [M where] [S additional measurement] [V is needed]}].', {
    chunks: [
      ['Such observations', 'そうした観察は'],
      ['do not replace scientific data', '科学的なデータに代わるものではありません'],
      ['they reveal', 'そうした観察は明らかにします（何をかは次へ）'],
      ['where additional measurement is needed', 'どこで追加の測定が必要かを'],
    ],
    notes: {
      'they reveal': 'セミコロン（;）の後ろで、前の文を補って「そうではなく〜する」と続けています。they は Such observations を指します。',
    },
  }),
  st('[S The financial side {前| of adaptation}] [V is] [M equally] [C difficult].', {
    chunks: [
      ['The financial side of adaptation', '適応のお金の面も'],
      ['is equally difficult', '同じように難しいのです'],
    ],
    notes: {
      'is equally difficult': 'equally は「（前に述べたことと）同じように」。',
    },
  }),
  st('[S Large infrastructure projects] [V are] [C attractive {前| to politicians}] [M {副詞節:理由| [接 because] [S they] [V are] [C visible] [接 and] [V can be announced] [C {前| as decisive action}]}].', {
    chunks: [
      ['Large infrastructure projects', '大規模なインフラ事業は'],
      ['are attractive to politicians', '政治家にとって魅力的です'],
      ['because', 'なぜなら'],
      ['they are visible', 'それらは目に見えやすく'],
      ['and can be announced as decisive action', '思い切った行動として発表できるからです'],
    ],
    notes: {
      'and can be announced as decisive action': 'announce A as B「AをBとして発表する」の受け身です。can be announced は are visible と主語 they を共有しています。',
    },
  }),
  st('[M Yet] [S smaller investments, {前| such as {並列| {動名詞| [V training] [O neighborhood volunteers]} | or {動名詞| [V improving] [O warning messages {前| in several languages}]}}},] [V may save] [O more lives] [M {前| during an emergency}].', {
    chunks: [
      ['Yet', 'しかし'],
      ['smaller investments,', 'より小さな投資のほうが（どんな投資かは次へ）'],
      ['such as training neighborhood volunteers', '例えば地域のボランティアを訓練することや'],
      ['or improving warning messages in several languages,', 'いくつもの言語で警告のメッセージをよくすること'],
      ['may save more lives', 'より多くの命を救うかもしれません'],
      ['during an emergency', '緊急時に'],
    ],
    notes: {
      'such as training neighborhood volunteers': 'such as 以下は smaller investments の具体例で、主語の一部です。training と improving は動名詞です。',
    },
  }),
  st('[M {副詞節:理由| [接 Because] [S these measures] [V are] [C less dramatic]}], [S they] [V are] [M often] [C the first {to:形容詞>the first| [V to be reduced] [M {副詞節:時| [接 when] [S budgets] [V become] [C tight]}]}].', {
    chunks: [
      ['Because', '〜ので（理由は次へ）'],
      ['these measures are less dramatic', 'これらの対策はあまり目立たない（ので）'],
      ['they are often the first to be reduced', 'それらは真っ先に削られることがよくあります'],
      ['when budgets become tight', '予算が厳しくなると'],
    ],
    notes: {
      'these measures are less dramatic': 'these measures は前の文の smaller investments を指します。less dramatic は、その前の文の大規模なインフラ事業と比べて「それほど目立たない」という意味です。',
      'they are often the first to be reduced': 'the first to do で「最初に〜するもの」。to be reduced は受け身の不定詞で、the first を後ろから説明します。',
    },
    rules: ['cause-result', 'comparison-pairs', 'infinitive-role'],
  }),
  st('[S A city {関係>A city| [S that] [V takes] [O resilience] [M seriously]}] [V must] [M therefore] [V evaluate] [O projects] [M {前| over a long period}] [M {前| rather than only {前| during the year {関係>the year| [M in which] [S they] [V are introduced]}}}].', {
    chunks: [
      ['A city', '都市は'],
      ['that takes resilience seriously', '回復力を真剣に考える（都市は）'],
      ['must therefore evaluate projects', 'そのため事業を評価しなければなりません'],
      ['over a long period', '長い期間にわたって'],
      ['rather than only during the year', 'その年の間だけではなく（どの年かは次へ）'],
      ['in which they are introduced', '事業が導入される（年の間だけ）'],
    ],
    notes: {
      'that takes resilience seriously': 'take 〜 seriously で「〜を真剣に受け止める」。',
      'in which they are introduced': 'in which は the year を受ける前置詞＋関係代名詞で、「その年に」と読みます。they は projects を指します。',
    },
  }),
  st('[S It] [V must] [M also] [V recognize] [O {that節| [接 that] [S the absence {前| of disaster}] [V is not] [C proof {同格that>proof| [接 that] [S preparation] [V was] [C unnecessary]}]}].', {
    chunks: [
      ['It must also recognize', '都市はまた認めなければなりません（内容は次へ）'],
      ['that', '〜ということを'],
      ['the absence of disaster', '災害が起きなかったことが'],
      ['is not proof', '証拠ではない（何の証拠かは次へ）'],
      ['that preparation was unnecessary', '準備がいらなかったという（証拠では）'],
    ],
    notes: {
      'It must also recognize': 'It は前の文の A city that takes resilience seriously を指します。',
      'that preparation was unnecessary': 'この that は proof の中身を述べる同格の that で、関係代名詞ではありません。',
    },
  }),
  st('[M Finally], [S adaptation plans] [V must remain] [C flexible].', {
    chunks: [
      ['Finally', '最後に'],
      ['adaptation plans', '適応の計画は'],
      ['must remain flexible', '柔軟なままでなければなりません'],
    ],
    notes: {
      'must remain flexible': 'remain ＋ 形容詞 で「〜のままである」。',
    },
  }),
  st('[S A project {関係>A project| [S that] [V performs] [M well] [M {前| under today\'s conditions}]}] [V may be] [C inadequate] [M {副詞節:条件| [接 if] [S {並列| migration, | land use, | or rainfall patterns}] [V change]}].', {
    chunks: [
      ['A project', '事業は'],
      ['that performs well', 'うまく機能する（事業は）'],
      ["under today's conditions", '今の条件のもとで'],
      ['may be inadequate', '不十分になるかもしれません'],
      ['if', 'もし（条件は次へ）'],
      ['migration, land use, or rainfall patterns change', '人口の移動や土地の使われ方、雨の降り方が変われば'],
    ],
  }),
  st('[S {並列| {動名詞| [V Setting] [O review dates]} | and {動名詞| [V publishing] [O results]}}] [V allow] [O governments] [C {to:補語| [V to revise] [O policies] [M {前| without {動名詞| [V treating] [O revision] [C {前| as failure}]}}]}].', {
    chunks: [
      ['Setting review dates and publishing results', '見直しの日程を決め、結果を公表することは'],
      ['allow governments to revise policies', '政府が政策を見直せるようにします'],
      ['without treating revision as failure', '見直すことを失敗とみなさずに'],
    ],
    notes: {
      'Setting review dates and publishing results': '二つの動名詞のまとまりが and で並んで主語になるので、動詞は複数に合わせて allow です。',
      'allow governments to revise policies': 'allow ＋ 人 ＋ to do で「人が〜できるようにする」。',
      'without treating revision as failure': 'treat A as B で「AをBとみなす」。',
    },
  }),
  st('[M {副詞節:理由| [接 As] [S climate conditions] [V remain] [C uncertain]}], [S the cities {関係>the cities| [S that] [V adapt] [M most successfully]}] [V will] [M probably] [V be] [C those {関係>those| [S that] [V combine] [O technical knowledge] [M {前| with public participation}]}].', {
    chunks: [
      ['As', '〜ので（理由は次へ）'],
      ['climate conditions remain uncertain', '気候の状況が不確かなままな（ので）'],
      ['the cities', '都市は'],
      ['that adapt most successfully', '最もうまく適応する（都市は）'],
      ['will probably be those', 'おそらく〜な都市でしょう（どんな都市かは次へ）'],
      ['that combine technical knowledge', '専門的な知識を組み合わせる（都市）'],
      ['with public participation', '市民の参加と'],
    ],
    notes: {
      As: 'As はここでは「〜なので」と理由を表します。',
      'will probably be those': 'those は前の the cities の代わりに使う代名詞で、「〜な都市」。',
      'with public participation': 'combine A with B で「AをBと組み合わせる」。',
    },
  }),
])
