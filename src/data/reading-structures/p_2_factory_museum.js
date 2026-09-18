import { st } from './entry.js'

export default Object.freeze([
  st('[S An old industrial building {前| beside the canal}] [V closed] [M thirty years ago].', {
    chunks: [
      ['An old industrial building beside the canal', '運河のそばの古い工業用の建物は'],
      ['closed thirty years ago', '30年前に閉鎖されました'],
    ],
    notes: {
      'An old industrial building beside the canal': 'beside the canal は building を後ろから説明して「運河のそばの建物」。industrial は「工業の」で、ここでは工場の建物です。',
      'closed thirty years ago': 'close はここでは「（工場などが）閉まる・閉鎖される」。',
    },
    rules: ['paragraph-map', 'noun-boundary', 'main-clause-skeleton'],
  }),
  st('[S It] [V had employed] [O a large part {前| of the town}] [M {前| at its peak}].', {
    chunks: [
      ['It had employed a large part', 'その工場は、かなりの部分を雇っていました（何のかは次へ）'],
      ['of the town', '町の人々の'],
      ['at its peak', '最盛期には'],
    ],
    notes: {
      'It had employed a large part': 'It は前の文の建物（工場）を指します。had employed は過去完了で、閉鎖より前のことです。',
      'of the town': 'a large part of the town は「町の人々のかなりの部分」。the town で町の人々を表します。',
      'at its peak': 'peak は「いちばん盛んなとき」。',
    },
  }),
  st('[S Whole families] [V had worked] [M {前| on the same machines}] [M {前| for three generations}].', {
    chunks: [
      ['Whole families had worked', '家族みんなが働いていました（どこでかは次へ）'],
      ['on the same machines', '同じ機械で'],
      ['for three generations', '三世代にわたって'],
    ],
    notes: {
      'Whole families had worked': 'whole families は「家族みんな・家族ぐるみ」。',
      'for three generations': 'generation は「世代」。',
    },
  }),
  st('[M {前| After that}], [S the windows] [V were broken] [接 and] [S young families] [V moved] [M {前| to the suburb}].', {
    chunks: [
      ['After that,', 'その後'],
      ['the windows were broken', '窓は割られ'],
      ['and young families moved to the suburb', 'そして、若い家族は郊外へ移りました'],
    ],
    notes: {
      'After that,': 'that は前の文までの「工場の閉鎖」を指します。',
      'and young families moved to the suburb': 'suburb は「郊外」。',
    },
  }),
  st('[S The town council] [M first] [V planned] [O {to:名詞| [V to pull] [O the building] [M down]}].', {
    chunks: [
      ['The town council first planned', '町議会は初め、計画していました（何をかは次へ）'],
      ['to pull the building down', 'その建物を取り壊すことを'],
    ],
    notes: {
      'The town council first planned': 'town council は「町議会」。first は「初めは」で、あとで方針が変わることを予告します。',
      'to pull the building down': 'pull 〜 down で「〜を取り壊す」。the building が pull と down の間に入っています。',
    },
  }),
  st('[S Former workers] [V asked] [M {前| for a delay {前| of one year}}].', {
    chunks: [
      ['Former workers asked', '元の働き手たちは求めました（何をかは次へ）'],
      ['for a delay of one year', '1年の猶予を'],
    ],
    notes: {
      'Former workers asked': 'former は「元の・以前の」。ask for 〜 で「〜を求める」。',
      'for a delay of one year': 'delay は「延期・猶予」。取り壊しを1年待ってほしいということです。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S They] [V collected] [O {並列| old photographs, | order books | and letters}] [M {前| from families}].', {
    chunks: [
      ['They collected old photographs, order books and letters', '彼らは、古い写真や注文帳や手紙を集めました（だれからかは次へ）'],
      ['from families', '家族から'],
    ],
    notes: {
      'They collected old photographs, order books and letters': 'They は Former workers を指します。目的語は3つが and で並んでいます。order book は「注文帳」。',
    },
  }),
  st('[S The material] [V showed] [O the daily process {前| inside the building}] [M {前| in clear detail}].', {
    chunks: [
      ['The material showed the daily process', 'その資料は、日々の作業の流れを示していました（どこのかは次へ）'],
      ['inside the building', '建物の中の'],
      ['in clear detail', 'はっきりと細かく'],
    ],
    notes: {
      'The material showed the daily process': 'material はここでは集めた「資料」で、数えられない名詞です。process は「工程・作業の流れ」。',
      'in clear detail': 'in detail で「詳しく」。clear がつき「はっきりと細かく」。',
    },
  }),
  st('[S Two hundred people] [V came] [M {前| to a talk {前| about local history}}].', {
    chunks: [
      ['Two hundred people came', '200人が来ました（どこへかは次へ）'],
      ['to a talk about local history', '地域の歴史についての講演に'],
    ],
    notes: {
      'to a talk about local history': 'talk はここでは名詞で「講演」。',
    },
  }),
  st('[S The council] [M then] [V accepted] [O a study {前| of the costs}].', {
    chunks: [
      ['The council then accepted a study', 'そこで町議会は、調査を認めました（何のかは次へ）'],
      ['of the costs', '費用の'],
    ],
    notes: {
      'The council then accepted a study': 'then は「そこで」。accept はここでは「（申し出を）認める」。',
      'of the costs': 'a study of the costs は、建物を残すのにかかる費用の調査です。',
    },
  }),
  st('[S The numbers] [V were not] [C encouraging] [M {前| at first}].', {
    chunks: [
      ['The numbers were not encouraging', 'その数字は、希望の持てるものではありませんでした（いつかは次へ）'],
      ['at first', '初めは'],
    ],
    notes: {
      'The numbers were not encouraging': 'the numbers は費用の調査の数字です。encouraging は「励みになる・希望の持てる」。',
    },
    rules: ['paragraph-map', 'negation-scope', 'main-clause-skeleton'],
  }),
  st('[S Repair {前| of {並列| the roof | and the metal walls}}] [V demanded] [O a large budget].', {
    chunks: [
      ['Repair of the roof and the metal walls', '屋根と金属の壁の修理には'],
      ['demanded a large budget', '大きな予算が必要でした'],
    ],
    notes: {
      'demanded a large budget': 'demand はここでは「必要とする」。',
    },
  }),
  st('[S {並列| Old paint | and chemical waste}] [V raised] [O the expense] [M further].', {
    chunks: [
      ['Old paint and chemical waste', '古い塗料と化学廃棄物が'],
      ['raised the expense further', '費用をさらに押し上げました'],
    ],
    notes: {
      'raised the expense further': 'raise は「上げる」。expense は「費用」、further は「さらに」。',
    },
  }),
  st('[S A private company] [V offered] [O {to:名詞| [V to buy] [O the land] [M {前| for a car park}]}].', {
    chunks: [
      ['A private company', 'ある民間企業が'],
      ['offered to buy the land', 'その土地を買うと申し出ました（何のためにかは次へ）'],
      ['for a car park', '駐車場にするために'],
    ],
    notes: {
      'offered to buy the land': 'offer to 〜 で「〜しようと申し出る」。',
      'for a car park': 'car park は「駐車場」（イギリス英語）。',
    },
  }),
  st('[S The offer] [V would have removed] [O the debt {前| of the town}] [M {前| in one step}].', {
    chunks: [
      ['The offer would have removed the debt', 'その申し出は、借金を消していたでしょう（だれのかは次へ）'],
      ['of the town', '町の'],
      ['in one step', '一度に'],
    ],
    notes: {
      'The offer would have removed the debt': 'would have ＋ 過去分詞 は「（もし受けていたら）〜していただろう」という仮定法過去完了。実際にはこの申し出を受けなかったことを表します。',
      'in one step': 'in one step は「一度に・一気に」。',
    },
  }),
  st('[S The citizens group] [V answered] [M {前| with a different plan}].', {
    chunks: [
      ['The citizens group answered', '市民団体は応えました（何でかは次へ）'],
      ['with a different plan', '別の計画で'],
    ],
    notes: {
      'The citizens group answered': 'citizens group は「市民団体」で、資料を集めた元の働き手たちの会です。answer はここでは「（提案に）応える」。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S Half {前| of the building}] [V would become] [C a museum {前| of the local economy}].', {
    chunks: [
      ['Half of the building would become a museum', '建物の半分は、博物館になる予定でした（何のかは次へ）'],
      ['of the local economy', '地域経済の'],
    ],
    notes: {
      'Half of the building would become a museum': 'would は、計画の中で「〜することになる」を表します。',
    },
  }),
  st('[S The other half] [V would hold] [O small workshops {前| for young makers}].', {
    chunks: [
      ['The other half would hold small workshops', 'もう半分には、小さな工房が入る予定でした（だれのかは次へ）'],
      ['for young makers', '若い作り手のための'],
    ],
    notes: {
      'The other half would hold small workshops': 'hold はここでは「（中に）収める」。workshop は「工房・作業場」。',
      'for young makers': 'maker は「ものを作る人」。',
    },
  }),
  st('[S Rent {前| from those workshops}] [V would produce] [O a steady revenue].', {
    chunks: [
      ['Rent from those workshops', 'それらの工房からの家賃が'],
      ['would produce a steady revenue', '安定した収入を生む見込みでした'],
    ],
    notes: {
      'would produce a steady revenue': 'revenue は「収入」。steady は「安定した」。',
    },
  }),
  st('[S The plan] [M also] [V promised] [O a slow repair {前| over ten years}].', {
    chunks: [
      ['The plan also promised a slow repair', 'その計画は、ゆっくりした修理も約束していました（どのくらいかけてかは次へ）'],
      ['over ten years', '10年かけての'],
    ],
    notes: {
      'over ten years': 'over はここでは「〜にわたって」。',
    },
  }),
  st('[S The council] [V accepted] [O the second plan] [M {前| by a narrow vote}].', {
    chunks: [
      ['The council accepted the second plan', '町議会は、二つ目の計画を認めました（どのようにかは次へ）'],
      ['by a narrow vote', 'わずかな票差で'],
    ],
    notes: {
      'by a narrow vote': 'narrow はここでは「（差が）わずかな」。by は「〜の差で」。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S Work] [V began] [M {前| on the safest wing {前| of the building}}].', {
    chunks: [
      ['Work began', '工事は始まりました（どこでかは次へ）'],
      ['on the safest wing of the building', '建物のいちばん安全な棟で'],
    ],
    notes: {
      'Work began': 'work はここでは「（修理の）工事」。',
      'on the safest wing of the building': 'wing は「（建物の）棟」。safest は safe の最上級です。',
    },
  }),
  st('[S Volunteers] [V cleaned] [O the machines], [接 and] [S a company] [V gave] [O the paint].', {
    chunks: [
      ['Volunteers cleaned the machines,', 'ボランティアが機械をきれいにし'],
      ['and a company gave the paint', 'そして、ある会社が塗料を出しました'],
    ],
  }),
  st('[S The museum] [V opened] [M four years later] [M {前| with a small staff}].', {
    chunks: [
      ['The museum opened four years later', 'その博物館は、4年後に開館しました（どんな形でかは次へ）'],
      ['with a small staff', '少ない職員で'],
    ],
    notes: {
      'with a small staff': 'staff は職員の集まりを表す名詞で、a small staff で「少ない職員」。',
    },
  }),
  st('[S A local organization] [M now] [V runs] [O {並列| the tours | and the small shop}].', {
    chunks: [
      ['A local organization', '地元の団体が'],
      ['now runs the tours and the small shop', '今は、見学案内と小さな売店を運営しています'],
    ],
    notes: {
      'now runs the tours and the small shop': 'run はここでは「運営する」。',
    },
  }),
  st('[S Visitors] [V report] [O a strong emotion] [M {前| inside the old halls}].', {
    chunks: [
      ['Visitors report a strong emotion', '来館者は、強い感情を覚えると話します（どこでかは次へ）'],
      ['inside the old halls', '古い広間の中で'],
    ],
    notes: {
      'Visitors report a strong emotion': 'report はここでは「（感じたことを）話す・伝える」。',
      'inside the old halls': 'hall は「広間・大きな部屋」。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S Former workers] [V lead] [O the tours] [接 and] [V explain] [O each machine].', {
    chunks: [
      ['Former workers lead the tours', '元の働き手が見学を案内し'],
      ['and explain each machine', '機械を一つずつ説明します'],
    ],
  }),
  st('[S Their memory] [V turns] [O a quiet room] [M {前| into a place {前| of real work}}].', {
    chunks: [
      ['Their memory turns a quiet room', '彼らの記憶が、静かな部屋を変えます（何にかは次へ）'],
      ['into a place of real work', '本物の仕事の場に'],
    ],
    notes: {
      'Their memory turns a quiet room': 'Their は Former workers を指します。turn A into B で「A を B に変える」。',
    },
  }),
  st('[S The ancestors {前| of many students}] [V appear] [M {前| in the old photographs}].', {
    chunks: [
      ['The ancestors of many students appear', '多くの生徒の先祖が、写っています（どこにかは次へ）'],
      ['in the old photographs', 'その古い写真に'],
    ],
    notes: {
      'The ancestors of many students appear': 'ancestor は「先祖」。appear はここでは「（写真に）写っている」。',
    },
  }),
  st('[S Young visitors] [V gain] [O a different perception {前| of the town}].', {
    chunks: [
      ['Young visitors gain a different perception', '若い来館者は、違った見方を得ます（何についてのかは次へ）'],
      ['of the town', '町についての'],
    ],
    notes: {
      'Young visitors gain a different perception': 'perception は「見方・受け止め方」。',
    },
  }),
  st('[S The building] [V has become] [C a monument {前| to ordinary work}].', {
    chunks: [
      ['The building has become a monument', 'その建物は、記念碑になりました（何のかは次へ）'],
      ['to ordinary work', 'ふつうの仕事の'],
    ],
    notes: {
      'to ordinary work': 'a monument to 〜 で「〜をたたえる記念碑」。',
    },
  }),
  st('[S The result] [V is not] [C a complete success].', {
    chunks: [
      ['The result', 'その結果は'],
      ['is not a complete success', '完全な成功ではありません'],
    ],
    notes: {
      'is not a complete success': '成功した点もあるが、残る問題もあるという意味で、次の文から具体的に述べられます。',
    },
    rules: ['paragraph-map', 'negation-scope', 'author-stance'],
  }),
  st('[S One wing] [V is] [M still] [C closed], [接 and] [S the roof] [V leaks] [M {前| in heavy rain}].', {
    chunks: [
      ['One wing is still closed,', '一つの棟は今も閉じたままで'],
      ['and the roof leaks in heavy rain', 'そして、激しい雨のときには屋根が雨漏りします'],
    ],
    notes: {
      'and the roof leaks in heavy rain': 'leak は「漏る」。',
    },
  }),
  st('[S The museum] [V depends] [M {前| on public money}] [M {前| for a part {前| of its costs}}].', {
    chunks: [
      ['The museum depends on public money', 'その博物館は、公的な資金に頼っています（何についてかは次へ）'],
      ['for a part of its costs', '費用の一部について'],
    ],
    notes: {
      'The museum depends on public money': 'depend on 〜 で「〜に頼る」。public money は「公的な資金（税金など）」。',
    },
  }),
  st('[S A town] [V cannot preserve] [O every old building] [M {前| in this way}].', {
    chunks: [
      ['A town cannot preserve every old building', '町は、すべての古い建物を保存できるわけではありません（どのようにかは次へ）'],
      ['in this way', 'このやり方で'],
    ],
    notes: {
      'A town cannot preserve every old building': 'not … every は「すべて〜というわけではない」という部分否定です。',
    },
  }),
  st('[S The group] [M therefore] [V starts] [O each project] [M {前| with a hard question}].', {
    chunks: [
      ['The group therefore starts each project', 'そこでその団体は、どの計画も始めます（何からかは次へ）'],
      ['with a hard question', '難しい問いから'],
    ],
    notes: {
      'The group therefore starts each project': 'therefore は、前の文の「すべては保存できない」を受けます。',
    },
  }),
  st('[S They] [V ask] [O {疑問詞節| [S which places] [M still] [V teach] [O something {関係>something| [O that] [S photographs] [V cannot]}]}].', {
    chunks: [
      ['They ask', '団体の人たちは問います（何をかは次へ）'],
      ['which places still teach something', 'どの場所が今も何かを教えてくれるか（どんなことかは次へ）'],
      ['that photographs cannot', '写真には教えられない（ことを）'],
    ],
    notes: {
      'which places still teach something': 'which places から始まる疑問詞節が ask の目的語です。',
      'that photographs cannot': 'cannot のあとに teach が省かれています。「写真には教えられない（何か）」。',
    },
  }),
])
