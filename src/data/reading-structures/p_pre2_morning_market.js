import { st } from './entry.js'

export default Object.freeze([
  st('[M {前| On Sunday mornings}], [S a small market] [V opens] [M {前| in front of our town station}].', {
    chunks: [
      ['On Sunday mornings,', '日曜日の朝には'],
      ['a small market opens', '小さな市場が開かれます（どこでかは次へ）'],
      ['in front of our town station', '私たちの町の駅の前で'],
    ],
    notes: {
      'On Sunday mornings,': 'mornings は複数形で「日曜日の朝にはいつも」。',
      'in front of our town station': 'in front of は3語で一つの前置詞のように働き、「〜の前で」。',
    },
    rules: ['paragraph-map', 'noun-boundary', 'main-clause-skeleton'],
  }),
  st('[S Farmers {前| from nearby villages}] [V bring] [O {並列| vegetables, | fruit | and flowers}] [M {前| in small trucks}].', {
    chunks: [
      ['Farmers from nearby villages', '近くの村の農家が'],
      ['bring vegetables, fruit and flowers', '野菜や果物や花を運んできます（どうやってかは次へ）'],
      ['in small trucks', '小さなトラックで'],
    ],
    notes: {
      'Farmers from nearby villages': 'from nearby villages は Farmers を後ろから説明して「近くの村の農家」。',
      'bring vegetables, fruit and flowers': '目的語は vegetables, fruit and flowers の3つで、and で並んでいます。',
    },
  }),
  st('[M {前| At the start}], [S {並列| five producers | and a few customers}] [V came].', {
    chunks: [
      ['At the start,', '始まりのころは'],
      ['five producers and a few customers came', '5人の生産者と数人の客が来ました'],
    ],
    notes: {
      'five producers and a few customers came': 'a few は「少しはいる」という見方で「数人の」。a のない few（ほとんどいない）とは違います。',
    },
  }),
  st('[M Today] [S about thirty suppliers] [V join], [接 and] [S the number {前| of visitors}] [V keeps] [C rising].', {
    chunks: [
      ['Today about thirty suppliers join,', '今では約30の出店者が参加しています'],
      ['and the number of visitors keeps rising', 'そして、訪れる人の数は増え続けています'],
    ],
    notes: {
      'Today about thirty suppliers join,': 'about は数の前で「約」。supplier は「品物を出す人」で、ここでは市場に出店する生産者です。',
      'and the number of visitors keeps rising': 'keep ＋ -ing で「〜し続ける」。the number of 〜 は「〜の数」で、単数の keeps で受けます。',
    },
  }),
  st('[S Visitors] [V say] [O {that節| [接 that] [S the prices here] [V are] [C affordable]}].', {
    chunks: [
      ['Visitors say that', '来場者は〜と言います（内容は次へ）'],
      ['the prices here are affordable', 'ここの値段は手ごろだ（と）'],
    ],
    notes: {
      'the prices here are affordable': 'here は the prices を後ろから説明して「ここの値段」。affordable は「手ごろな」。',
    },
    rules: ['paragraph-map', 'that-diagnosis', 'main-clause-skeleton'],
  }),
  st('[S They] [V find] [O the quality] [C reliable] [接 and] [V return] [M every week].', {
    chunks: [
      ['They find the quality reliable', '来場者たちは、品質が信頼できると感じ'],
      ['and return every week', '毎週また来ます'],
    ],
    notes: {
      'They find the quality reliable': 'They は Visitors を指します。find ＋ O ＋ C で「O が C だと感じる」。',
      'and return every week': 'and の後ろの return の主語も They です。',
    },
  }),
  st('[S Each producer] [V writes] [O the name {前| of the farm}] [M {前| on a card {前| beside the boxes}}].', {
    chunks: [
      ['Each producer writes the name of the farm', 'それぞれの生産者は、農場の名前を書きます（どこにかは次へ）'],
      ['on a card beside the boxes', '箱のそばのカードに'],
    ],
    notes: {
      'on a card beside the boxes': 'beside the boxes は a card を後ろから説明して「箱のそばのカード」。',
    },
  }),
  st('[S Customers] [V can] [M therefore] [V ask] [M {前| about {並列| the soil, | the water | and the harvest}}].', {
    chunks: [
      ['Customers can therefore ask', 'そのため客は、尋ねることができます（何についてかは次へ）'],
      ['about the soil, the water and the harvest', '土や水や収穫について'],
    ],
    notes: {
      'Customers can therefore ask': 'therefore は、前の文の「カードに農場の名前を書く」を受けます。',
    },
  }),
  st('[S This direct contact] [V builds] [O confidence], [接 and] [S it] [V lowers] [O complaints {前| about the goods}].', {
    chunks: [
      ['This direct contact builds confidence,', 'この直接のやりとりが信頼を生み'],
      ['and it lowers complaints about the goods', 'そして、商品についての苦情を減らします'],
    ],
    notes: {
      'This direct contact builds confidence,': 'contact はここでは、生産者と客の「直接のやりとり」。build confidence で「信頼を築く」。',
      'and it lowers complaints about the goods': 'it は This direct contact を指します。lower はここでは動詞で「減らす」。',
    },
  }),
  st('[S A survey last year] [V showed] [O {that節| [接 that] [S a high percentage {前| of visitors}] [V welcomed] [O this contact]}].', {
    chunks: [
      ['A survey last year showed that', '昨年の調査で、〜ということが分かりました（内容は次へ）'],
      ['a high percentage of visitors', '来場者のうち高い割合の人が'],
      ['welcomed this contact', 'このやりとりを歓迎していた（ということ）'],
    ],
    notes: {
      'A survey last year showed that': 'last year は A survey を後ろから説明して「昨年の調査」。',
      'a high percentage of visitors': 'a high percentage of 〜 で「〜のうち高い割合（の人）」。',
    },
  }),
  st('[S The producers] [V read] [O this feedback] [接 and] [V learn] [O the preference {前| of local families}].', {
    chunks: [
      ['The producers read this feedback', '生産者はこの意見を読み'],
      ['and learn the preference of local families', '地元の家庭の好みを知ります'],
    ],
    notes: {
      'The producers read this feedback': 'read は現在形です。feedback は「（客からの）意見・感想」。',
      'and learn the preference of local families': 'learn はここでは「知る・分かる」。preference は「好み」。',
    },
  }),
  st('[S The cheerful scene] [V hides] [O much quiet work].', {
    chunks: [
      ['The cheerful scene', 'その明るい光景は'],
      ['hides much quiet work', '目立たない多くの仕事を隠しています'],
    ],
    notes: {
      'hides much quiet work': 'work は数えられない名詞なので much で「多くの」。quiet work は「目立たない仕事」で、次の文から具体的に述べられます。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S {並列| The town office | and the producers}] [V share] [O a list {前| of requirements}].', {
    chunks: [
      ['The town office and the producers', '町役場と生産者たちは'],
      ['share a list of requirements', '守るべき条件の一覧を共有しています'],
    ],
    notes: {
      'share a list of requirements': 'requirement は「守るべき条件」。',
    },
  }),
  st('[S Local rules] [V regulate] [O the handling {前| of fresh food}], [接 and] [S the market] [V follows] [O them] [M closely].', {
    chunks: [
      ['Local rules regulate the handling of fresh food,', '地元の規則が、生鮮食品の扱い方を定めています'],
      ['and the market follows them closely', 'そして市場は、その規則にきちんと従っています'],
    ],
    notes: {
      'Local rules regulate the handling of fresh food,': 'regulate は「（規則で）定める・規制する」。handling は「取り扱い」。',
      'and the market follows them closely': 'them は Local rules を指します。closely はここでは「厳密に」。',
    },
  }),
  st('[S Volunteers] [V check] [O {並列| the temperature | and the moisture}] [M {前| with simple tools}].', {
    chunks: [
      ['Volunteers check the temperature and the moisture', 'ボランティアは、温度と水分を確かめます（何でかは次へ）'],
      ['with simple tools', '簡単な道具で'],
    ],
    notes: {
      'Volunteers check the temperature and the moisture': 'moisture は「水分・湿り気」。',
    },
  }),
  st('[S A representative {前| of the producers}] [V reports] [O these records] [M {前| to the government office}].', {
    chunks: [
      ['A representative of the producers', '生産者の代表が'],
      ['reports these records', 'これらの記録を報告します（どこへかは次へ）'],
      ['to the government office', '役所へ'],
    ],
    notes: {
      'A representative of the producers': 'representative は「代表者」。',
      'reports these records': 'these records は、前の文で確かめた温度と水分の記録です。',
    },
  }),
  st('[S Accuracy] [V is] [C more important] [M {前| than speed}] [M {前| in this check}].', {
    chunks: [
      ['Accuracy is more important', '正確さのほうが大切です（何よりかは次へ）'],
      ['than speed', '速さよりも'],
      ['in this check', 'この確認では'],
    ],
    notes: {
      'Accuracy is more important': 'more important は important の比較級。比べる相手は than の後ろです。',
    },
  }),
  st('[S Money] [V is] [C the hardest part {前| of the routine}].', {
    chunks: [
      ['Money is the hardest part', 'お金は最も難しい部分です（何のかは次へ）'],
      ['of the routine', 'この決まった仕事の'],
    ],
    notes: {
      'Money is the hardest part': 'hardest は hard の最上級で「いちばん難しい」。',
      'of the routine': 'routine は「決まった手順・いつもの仕事」。ここでは毎週の市場の運営のことです。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S Each producer] [V pays] [O a small fee], [接 and] [S that payment] [V covers] [O {並列| cleaning | and transportation}].', {
    chunks: [
      ['Each producer pays a small fee,', 'それぞれの生産者は少しの料金を払い'],
      ['and that payment covers cleaning and transportation', 'そのお金で、清掃と輸送の費用をまかないます'],
    ],
    notes: {
      'and that payment covers cleaning and transportation': 'that payment は、前の「少しの料金を払うこと」を受けます。cover はここでは「（費用を）まかなう」。',
    },
  }),
  st('[M {前| In a wet climate}], [S few households] [V come], [接 and] [S the sellers] [V carry] [O the loss] [M themselves].', {
    chunks: [
      ['In a wet climate,', '雨の多い気候では'],
      ['few households come,', '来る家庭はわずかで'],
      ['and the sellers carry the loss themselves', 'そして売り手が、その損失を自分で負います'],
    ],
    notes: {
      'few households come,': 'a のない few は「ほとんど〜ない」という否定の見方。来る家庭がわずかだということです。',
      'and the sellers carry the loss themselves': 'carry the loss で「損失を負う」。themselves は「自分たちで」と主語を強めます。',
    },
  }),
  st('[S High humidity] [V spoils] [O leaf vegetables] [M {前| before noon}].', {
    chunks: [
      ['High humidity spoils leaf vegetables', '高い湿度は、葉物野菜をだめにします（いつまでにかは次へ）'],
      ['before noon', '正午前に'],
    ],
    notes: {
      'High humidity spoils leaf vegetables': 'spoil は「だめにする・傷める」。leaf vegetables は「葉物野菜（ほうれん草など）」。',
    },
  }),
  st('[S The producers] [M therefore] [V keep] [O a priority list {前| of goods {前| with a long life}}].', {
    chunks: [
      ['The producers therefore keep a priority list', 'そこで生産者は、優先する一覧を用意しています（何のかは次へ）'],
      ['of goods with a long life', '日持ちのする商品の'],
    ],
    notes: {
      'The producers therefore keep a priority list': 'therefore は、前の文の「湿度で葉物野菜が傷む」を受けます。keep はここでは「（一覧を）用意しておく」。',
      'of goods with a long life': 'with a long life は goods を後ろから説明して「日持ちのする商品」。',
    },
  }),
  st('[S The market] [V has changed] [O the town] [M {前| in ways {関係省略:目的格>ways| [S nobody] [V planned]}}].', {
    chunks: [
      ['The market has changed the town', 'その市場は、町を変えてきました（どのようにかは次へ）'],
      ['in ways nobody planned', '誰も計画していなかったかたちで'],
    ],
    notes: {
      'The market has changed the town': 'has changed は現在完了で「（これまでに）変えてきた」。',
      'in ways nobody planned': 'nobody planned は「誰も計画しなかった」。',
    },
    rules: ['paragraph-map', 'relative-clause', 'main-clause-skeleton'],
  }),
  st('[S A high school club] [V runs] [O a cooking workshop] [M {前| near the stalls}].', {
    chunks: [
      ['A high school club runs a cooking workshop', 'ある高校の部が、料理の講習会を開いています（どこでかは次へ）'],
      ['near the stalls', '屋台の近くで'],
    ],
    notes: {
      'A high school club runs a cooking workshop': 'run はここでは「（会を）開く・運営する」。workshop は「講習会」。',
    },
  }),
  st('[S The club] [V studies] [O the stalls] [接 and] [V turns] [O each visit] [M {前| into an assignment}].', {
    chunks: [
      ['The club studies the stalls', 'その部は屋台を調べ'],
      ['and turns each visit into an assignment', '毎回の訪問を課題にしています'],
    ],
    notes: {
      'and turns each visit into an assignment': 'turn A into B で「A を B に変える」。訪問のたびに、それを学校の課題にするということです。',
    },
  }),
  st('[S Young children] [V learn] [O {並列| the names {前| of vegetables} | and the season {前| of each crop}}].', {
    chunks: [
      ['Young children learn the names of vegetables', '小さな子どもたちは、野菜の名前を学びます'],
      ['and the season of each crop', 'そして、それぞれの作物の旬も（学びます）'],
    ],
    notes: {
      'Young children learn the names of vegetables': '目的語は the names of vegetables と the season of each crop の2つで、and で並んでいます。',
      'and the season of each crop': 'season はここでは、作物がとれる季節「旬」。',
    },
  }),
  st('[M {前| For older residents}], [S the mild Sunday morning] [V has become] [C a routine meeting].', {
    chunks: [
      ['For older residents,', '年配の住民にとって'],
      ['the mild Sunday morning', '穏やかな日曜の朝は'],
      ['has become a routine meeting', 'いつもの集まりの時間になっています'],
    ],
    notes: {
      'the mild Sunday morning': 'mild は「（天気が）穏やかな」。',
      'has become a routine meeting': 'has become は現在完了で「（今では）〜になっている」。routine は「いつもの・決まった」。',
    },
  }),
  st('[S The producers] [V say] [O {that節| [接 that] [S steady growth] [V is] [C better] [M {前| than a large profit}]}].', {
    chunks: [
      ['The producers say that', '生産者たちは〜と言います（内容は次へ）'],
      ['steady growth is better', '着実な成長のほうがよい（何よりかは次へ）'],
      ['than a large profit', '大きな利益よりも（と）'],
    ],
    notes: {
      'steady growth is better': 'better は good の比較級。steady は「着実な」。',
    },
  }),
  st('[S They] [V explain] [O {that節| [接 that] [S a market] [V brings] [O people] [M together], [接 and] [S goods] [V come] [M second]}].', {
    chunks: [
      ['They explain that', '生産者たちは〜と説明します（内容は次へ）'],
      ['a market brings people together,', '市場は人々を結びつけるもので'],
      ['and goods come second', '商品は二の次だ（と）'],
    ],
    notes: {
      'They explain that': 'They は The producers を指します。',
      'a market brings people together,': 'bring 〜 together で「〜を一つに集める・結びつける」。',
      'and goods come second': 'come second で「2番目に来る」、つまり「二の次だ」。and のあとも that の内容の続きです。',
    },
  }),
])
