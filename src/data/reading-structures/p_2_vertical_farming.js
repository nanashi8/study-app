import { st } from './entry.js'

export default Object.freeze([
  st('[S Vertical farms] [V grow] [O crops] [M {前| on stacked shelves {前| inside buildings}} {前| rather than {前| across wide fields}}].', {
    chunks: [
      ['Vertical farms grow crops', '垂直農場は作物を育てます（どこでかは次へ）'],
      ['on stacked shelves inside buildings', '建物の中の、積み重ねた棚で'],
      ['rather than across wide fields', '広い畑ではなく'],
    ],
    notes: {
      'on stacked shelves inside buildings': 'stacked shelves は「積み重ねた棚」。inside buildings が shelves のある場所を示します。',
      'rather than across wide fields': 'A rather than B で「BではなくA」。実際のやり方が前、比べられる普通の農業が後ろです。',
    },
  }),
  st('[S Plants] [V receive] [O {並列| carefully controlled light, | water, | temperature, | and nutrients}] [M {前| without ordinary soil}].', {
    chunks: [
      ['Plants receive carefully controlled light,', '植物は、細かく管理された光'],
      ['water, temperature, and nutrients', '水、温度、栄養を受け取ります'],
      ['without ordinary soil', '普通の土を使わずに'],
    ],
    notes: {
      'Plants receive carefully controlled light,': 'carefully controlled は「細かく管理された」で、後ろの4つすべてにかかります。',
      'without ordinary soil': 'nutrient は「栄養素」。土のかわりに、水にとかした栄養素を与えます。',
    },
  }),
  st('[S Supporters] [V argue] [O {that節| [接 that] [S this method] [V can produce] [O fresh food] [M {前| near crowded cities}] [M {前| throughout the year}]}].', {
    chunks: [
      ['Supporters argue that', '支持する人たちは〜と主張します（内容は次へ）'],
      ['this method can produce fresh food', 'この方法なら新鮮な食料を作れる'],
      ['near crowded cities throughout the year', '人の多い都市の近くで、一年を通して（作れると）'],
    ],
    notes: {
      'Supporters argue that': 'argue は「主張する」。ここからは支持する人たちの言い分で、筆者の判断は第7文から始まります。',
      'near crowded cities throughout the year': 'throughout the year は「一年を通して」。畑の季節に左右されないという意味です。',
    },
    rules: ['that-diagnosis', 'author-stance', 'paragraph-map'],
  }),
  st('[M {副詞節:理由| [接 Because] [S water] [V is collected] [接 and] [V used] [M again]}], [S some systems] [V use] [O far less water {前| than field farming}].', {
    chunks: [
      ['Because water is collected and used again,', '水を回収して再び使うので'],
      ['some systems use far less water', '一部のしくみは、はるかに少ない水しか使いません'],
      ['than field farming', '露地の農業より（少ない水で）'],
    ],
    notes: {
      'Because water is collected and used again,': 'is collected と (is) used が and で並ぶ受け身です。again は「もう一度」。',
      'some systems use far less water': 'far は比較級 less を強めて「はるかに」。',
    },
  }),
  st('[S Indoor crops] [V are] [M also] [V protected] [M {前| from {並列| storms, | droughts, | and many outdoor insects}}].', {
    chunks: [
      ['Indoor crops are also protected', '室内の作物は、守られてもいます（何からかは次へ）'],
      ['from storms, droughts, and many outdoor insects', '嵐や干ばつ、多くの屋外の虫から'],
    ],
    notes: {
      'Indoor crops are also protected': 'are … protected が受け身で、間の also は「〜もまた」。',
      'from storms, droughts, and many outdoor insects': 'be protected from 〜 で「〜から守られる」。危険の出どころを from で示します。',
    },
  }),
  st('[S Shorter transport] [V can reduce] [O damaged produce] [接 and] [V allow] [O growers] [C {to:補語| [V to harvest] [O food] [M {副詞節:時| [接 when] [S it] [V is] [C ready]}]}].', {
    chunks: [
      ['Shorter transport can reduce damaged produce', '輸送が短くなれば、傷んだ農産物を減らせます'],
      ['and allow growers to harvest food', 'そして、生産者が食料を収穫できるようにします'],
      ['when it is ready', '食べ頃になったときに'],
    ],
    notes: {
      'Shorter transport can reduce damaged produce': 'produce はここでは名詞で「農産物」。Shorter transport は「輸送が短いこと」。',
      'and allow growers to harvest food': 'allow ＋ 人 ＋ to 〜 で「人が〜できるようにする」。and の後ろの主語も Shorter transport です。',
      'when it is ready': 'it は食料を指し、ready は「食べ頃になった」。',
    },
  }),
  st('[S These advantages], [M however], [V do not make] [O every vertical farm] [C environmentally efficient].', {
    chunks: [
      ['These advantages, however,', 'しかし、こうした利点は'],
      ['do not make every vertical farm', 'すべての垂直農場を〜にするわけではありません（どんな状態かは次へ）'],
      ['environmentally efficient', '環境の面で効率的な状態に'],
    ],
    notes: {
      'These advantages, however,': 'however が文の途中にコンマで挟まれ、ここから筆者の判断に変わります。',
      'do not make every vertical farm': 'not … every は「すべてが〜というわけではない」という部分否定です。',
      'environmentally efficient': 'make ＋ もの ＋ 形容詞 で「ものを〜の状態にする」。',
    },
    rules: ['negation-scope', 'contrast-concession', 'svoc-core'],
  }),
  st('[S {並列| Artificial lights | and cooling systems}] [V may require] [O large amounts {前| of electricity}].', {
    chunks: [
      ['Artificial lights and cooling systems', '人工の照明と冷却の設備は'],
      ['may require large amounts of electricity', '大量の電力を必要とすることがあります'],
    ],
    notes: {
      'may require large amounts of electricity': 'may は「〜することがある」という可能性。large amounts of 〜 で「大量の〜」。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S that electricity] [V comes] [M {前| from fossil fuels}]}], [S saved transport] [V may not balance] [O the extra energy use].', {
    chunks: [
      ['If that electricity comes from fossil fuels,', 'その電気が化石燃料から作られるなら'],
      ['saved transport may not balance', '輸送で節約できた分では埋め合わせられないかもしれません（何をかは次へ）'],
      ['the extra energy use', '増える分のエネルギー使用を'],
    ],
    notes: {
      'If that electricity comes from fossil fuels,': 'that electricity は前の文の照明や冷却に使う電力を指します。',
      'saved transport may not balance': 'saved transport は「輸送を短くして節約できた分」。balance は「埋め合わせる・釣り合わせる」。',
    },
  }),
  st('[S Farms {関係>Farms| [S that] [V buy] [O renewable power] [接 or] [V use] [O waste heat {前| from nearby buildings}]}] [V may produce] [O a different balance].', {
    chunks: [
      ['Farms that buy renewable power', '再生可能な電力を買う農場や'],
      ['or use waste heat from nearby buildings', '近くの建物の排熱を使う農場は'],
      ['may produce a different balance', '違う収支を生むことがあります'],
    ],
    notes: {
      'or use waste heat from nearby buildings': 'or は that の節の中で buy と use を並べます。waste heat は「捨てられる熱」。',
      'may produce a different balance': 'balance はここでは「差し引きの結果・収支」。前の文とは逆の結果になりうるということです。',
    },
  }),
  st('[S The answer] [V depends] [M {前| on {並列| the local climate, | power supply, | building, | and crop}}].', {
    chunks: [
      ['The answer depends', '答えは〜によって変わります（何によってかは次へ）'],
      ['on the local climate, power supply,', 'その地域の気候や電力の供給'],
      ['building, and crop', '建物、作物によって'],
    ],
    notes: {
      'The answer depends': 'The answer は「垂直農場が環境にやさしいかどうかの答え」。depend on 〜 で「〜によって決まる」。',
      'building, and crop': 'on の後ろに4つが and で並んでいます。',
    },
  }),
  st('[S Vertical farms] [V are] [M currently] [C best suited {前| to {並列| leafy vegetables | and herbs} {関係>leafy vegetables and herbs| [S that] [V grow] [M quickly]}}].', {
    chunks: [
      ['Vertical farms are currently best suited', '垂直農場は今のところ最も向いています（何にかは次へ）'],
      ['to leafy vegetables and herbs', '葉物野菜やハーブに'],
      ['that grow quickly', '早く育つ（野菜やハーブに）'],
    ],
    notes: {
      'Vertical farms are currently best suited': 'be suited to 〜 で「〜に適している」。currently は「今のところ」。',
      'that grow quickly': '早く育つ作物なら、棚を何回も使えるということです。',
    },
  }),
  st('[S {並列| Wheat, | rice, | and fruit trees}] [V need] [O more space] [接 or] [V have] [O lower value {前| for each shelf}].', {
    chunks: [
      ['Wheat, rice, and fruit trees need more space', '小麦や米、果樹はもっと広い場所が必要です'],
      ['or have lower value for each shelf', 'あるいは、棚1段あたりの価値が低くなります'],
    ],
    notes: {
      'or have lower value for each shelf': 'or は need と have を並べ、どちらも Wheat, rice, and fruit trees が主語です。for each shelf は「棚1段あたりで」。',
    },
  }),
  st('[S Some crops] [M also] [V depend] [M {前| on {並列| pollinators | or complex seasonal changes} {関係>pollinators or complex seasonal changes| [O that] [S indoor systems] [V must copy]}}].', {
    chunks: [
      ['Some crops also depend', '作物によっては、〜にも頼っています（何にかは次へ）'],
      ['on pollinators or complex seasonal changes', '受粉を助ける生き物や、複雑な季節の変化に'],
      ['that indoor systems must copy', '室内の設備がまねなければならない（もの）'],
    ],
    notes: {
      'on pollinators or complex seasonal changes': 'pollinator は花粉を運ぶ虫や鳥のことです。',
      'that indoor systems must copy': 'copy は「まねて作り出す」。室内では、外の受粉や季節の変化を人の手で再現することになります。',
    },
  }),
  st('[S High construction costs] [V create] [O another limit], [M especially {前| for new companies}].', {
    chunks: [
      ['High construction costs create another limit,', '高い建設費も、もう一つの限界になります'],
      ['especially for new companies', '特に新しい会社にとっては'],
    ],
    notes: {
      'High construction costs create another limit,': 'another limit は、電力や作物に続く「もう一つの限界」です。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'reference-chain'],
  }),
  st('[S A farm] [V may produce] [O excellent vegetables] [接 and] [M still] [V fail] [M {副詞節:条件| [接 if] [S {並列| debt | and electricity costs}] [V remain] [C high]}].', {
    chunks: [
      ['A farm may produce excellent vegetables', '農場はすばらしい野菜を作れても'],
      ['and still fail', 'それでも失敗することがあります'],
      ['if debt and electricity costs remain high', '借金と電気代が高いままなら'],
    ],
    notes: {
      'and still fail': 'still は「それでも」。and の後ろの fail の主語も A farm です。',
      'if debt and electricity costs remain high': 'remain ＋ 形容詞 で「〜のままである」。debt は「借金」。',
    },
  }),
  st('[S Operators] [V must] [M also] [V pay] [O workers {前| with technical skills {to:形容詞>technical skills| [V to monitor] [O plants] [接 and] [V repair] [O complex equipment]}}].', {
    chunks: [
      ['Operators must also pay workers', '運営する側は、働く人にも賃金を払わなければなりません（どんな人かは次へ）'],
      ['with technical skills', '技術を持つ（働く人に）'],
      ['to monitor plants and repair complex equipment', '植物を見守り、複雑な設備を修理する（技術を）'],
    ],
    notes: {
      'Operators must also pay workers': 'Operator は農場を運営する人や会社です。',
      'to monitor plants and repair complex equipment': 'to monitor と (to) repair が technical skills を後ろから説明して「〜する技術」。',
    },
  }),
  st('[S Public support] [V should] [M therefore] [V be based] [M {前| on transparent evidence} {前| rather than exciting images alone}].', {
    chunks: [
      ['Public support should therefore be based', 'そのため、公的な支援は〜に基づくべきです（何にかは次へ）'],
      ['on transparent evidence', 'だれでも確かめられる根拠に'],
      ['rather than exciting images alone', '目を引く映像だけではなく'],
    ],
    notes: {
      'Public support should therefore be based': 'be based on 〜 で「〜に基づく」。therefore は前の段落までの限界を受けています。',
      'rather than exciting images alone': 'alone は「〜だけ」。映像だけで判断しないという意味です。',
    },
  }),
  st('[S Useful comparisons] [V examine] [O the whole life {前| of a system}].', {
    chunks: [
      ['Useful comparisons examine', '役に立つ比べ方は、調べます（何をかは次へ）'],
      ['the whole life of a system', 'そのしくみの一生全体を'],
    ],
    notes: {
      'the whole life of a system': 'the whole life は「作られてから使い終わるまでの全体」。次の文が、その中身を並べています。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S They] [V include] [O {並列| construction materials, | water, | electricity, | transport, | food waste, | and the useful life {前| of equipment}}].', {
    chunks: [
      ['They include construction materials,', 'それには建設の材料'],
      ['water, electricity, transport, food waste,', '水、電気、輸送、食品のむだ'],
      ['and the useful life of equipment', 'そして設備を使える年数が含まれます'],
    ],
    notes: {
      'They include construction materials,': 'They は前の文の Useful comparisons を指します。',
      'and the useful life of equipment': 'the useful life of equipment は「設備が使えるうちの年数」。',
    },
  }),
  st('[S They] [M also] [V ask] [O {疑問詞節| [S who] [V receives] [O {並列| jobs, | training, | and affordable food}] [M {前| from the investment}]}].', {
    chunks: [
      ['They also ask', 'その比べ方は、さらに問います（何をかは次へ）'],
      ['who receives jobs, training, and affordable food', 'だれが仕事や訓練、手ごろな値段の食料を得るのかを'],
      ['from the investment', 'その投資から'],
    ],
    notes: {
      'who receives jobs, training, and affordable food': 'who 以下は「だれが〜か」という名詞のまとまりで、ask の目的語です。',
      'from the investment': 'the investment は垂直農場に使われるお金のことです。',
    },
  }),
  st('[S A fair study] [V compares] [O farms {関係>farms| [S that] [V produce] [O the same crop] [M {前| for {並列| the same season | and destination}}]}]; [S it] [V does not compare] [O one city farm] [M {前| with a distant average}].', {
    chunks: [
      ['A fair study compares farms', '公平な調べ方は、農場どうしを比べます（どんな農場かは次へ）'],
      ['that produce the same crop', '同じ作物を作る（農場を）'],
      ['for the same season and destination;', '同じ季節、同じ届け先に向けて'],
      ['it does not compare one city farm', 'ある都市の農場を比べたりはしません（何とかは次へ）'],
      ['with a distant average', '遠くの平均の数字と'],
    ],
    notes: {
      'that produce the same crop': '作る作物・季節・届け先をそろえた農場どうしを比べる、ということです。',
      'it does not compare one city farm': 'it は A fair study を指します。セミコロンの前後で、する比べ方としない比べ方を並べています。',
      'with a distant average': 'compare A with B で「AをBと比べる」。a distant average は「遠くの農場をまとめた平均」。',
    },
  }),
  st('[S Vertical farming] [V is] [C unlikely {to:副詞(形容詞)| [V to replace] [O ordinary farming]}], [接 and] [S replacement] [V is] [C the wrong goal].', {
    chunks: [
      ['Vertical farming is unlikely to replace ordinary farming,', '垂直農業が普通の農業に取って代わることはなさそうです'],
      ['and replacement is the wrong goal', 'そして、取って代わること自体が誤った目標です'],
    ],
    notes: {
      'Vertical farming is unlikely to replace ordinary farming,': 'be unlikely to 〜 で「〜しそうにない」。「絶対にない」とまでは言っていません。',
      'and replacement is the wrong goal': 'replacement は replace の名詞形で「取って代わること」。',
    },
  }),
  st('[S It] [V may] [M instead] [V supply] [O certain crops] [M {副詞節:場所| [接 where] [S land] [V is] [C scarce], [S transport] [V is] [C difficult], [接 or] [S weather] [V is] [C unstable]}].', {
    chunks: [
      ['It may instead supply certain crops', 'それは代わりに、特定の作物を届けられます（どこでかは次へ）'],
      ['where land is scarce,', '土地が少ない所や'],
      ['transport is difficult, or weather is unstable', '輸送が難しい所、天気が不安定な所で'],
    ],
    notes: {
      'It may instead supply certain crops': 'It は Vertical farming を指します。instead は「（取って代わるのではなく）代わりに」。',
      'transport is difficult, or weather is unstable': 'where の節の中に、土地・輸送・天気の3つの場合が並んでいます。',
    },
  }),
  st('[S {並列| Field farms, | greenhouses, | and indoor farms}] [V can] [M then] [V contribute] [O different strengths] [M {前| to a more resilient food system}].', {
    chunks: [
      ['Field farms, greenhouses, and indoor farms', '露地の農場、温室、室内の農場は'],
      ['can then contribute different strengths', 'そうすれば、それぞれ違う強みを持ち寄れます'],
      ['to a more resilient food system', 'より立ち直りやすい食料のしくみに'],
    ],
    notes: {
      'can then contribute different strengths': 'then は「そうすれば」。contribute A to B で「AをBに持ち寄る」。',
      'to a more resilient food system': 'resilient は「困ったことがあっても立ち直れる」。3つの農業のよい所を合わせるという結論です。',
    },
  }),
  st('[S The technology] [V is] [C most valuable] [M {副詞節:時| [接 when] [S its limits] [V are measured] [M as carefully {前| as its promises}]}].', {
    chunks: [
      ['The technology is most valuable', 'その技術が最も価値を持つのは'],
      ['when its limits are measured', '限界が測られるときです（どのようにかは次へ）'],
      ['as carefully as its promises', '期待できる良い面と同じくらい丁寧に'],
    ],
    notes: {
      'when its limits are measured': 'are measured は measure（測る）の受け身です。',
      'as carefully as its promises': 'as … as 〜 で「〜と同じくらい…」。its promises は「その技術が約束する良い面」。',
    },
    rules: ['comparison-pairs', 'author-stance', 'passive-active'],
  }),
])
