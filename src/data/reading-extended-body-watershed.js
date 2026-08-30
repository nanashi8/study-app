// 語彙強化ロングリーディング（約3,000語・英検準1級）の本文。
//
// 初期長文と同じ作りにするため、本文は一つづきの説明文として書き、
// 節は「話題のまとまり」であって語彙の分野バケツではない。
// 一文ごとの語順訳は reading-extended-translation-scenarios.js、
// 主節の5文型は reading-extended-grammar-expectations.js に置く。

const s = (en, ja, paragraphStart = false) => ({
  en,
  ja,
  chunks: [{ en, ja }],
  gloss: {},
  paragraphStart,
})
const p = (en, ja) => s(en, ja, true)

export const SHARED_WATERSHED_BODY = Object.freeze({
  id: 'p_ext_3000_shared_watershed',
  sections: Object.freeze([
    Object.freeze({
      id: 'source',
      title: 'From Rain to River',
      titleJa: '雨から川へ',
      summaryJa: '流域という単位を、尾根が引く境界と、雨・雪・土壌が水を遅らせる仕組みから読みます。',
      sentences: Object.freeze([
        p(
          'A river basin is the whole area of land from which rain and melting snow drain into one single river.',
          '流域とは、雨と解けた雪が一本の川へ流れ込む、その土地全体のことです。',
        ),
        s(
          'Its outer boundary is marked by ridges of high ground rather than by any line that a government has ever set out and agreed on.',
          'その境界は、政府がこれまでに合意したどの線でもなく、尾根によって引かれています。',
        ),
        s(
          'That single difference explains a great deal of the trouble that shared river basins tend to produce later.',
          'このたった一つの違いが、のちに流域が生む厄介ごとの多くを説明します。',
        ),
        p(
          'Rain that falls on a forest does not reach the channel in the same way that rain falling on a paved road does.',
          '森に降る雨は、道路に降る雨と同じようには川筋に届きません。',
        ),
        s(
          'Leaves, roots, and the loose floor of a forest all slow the water down and let a large part of it sink into the ground.',
          '葉と根と林床のやわらかい地面が水の勢いを弱め、その多くを地下へしみ込ませます。',
        ),
        s(
          'Water that sinks into the ground is stored up for later, while water that runs off the surface arrives quickly and all at once.',
          'しみ込んだ水はのちのために蓄えられ、流れ去る水は速く、一度に到達します。',
        ),
        s(
          'A basin therefore behaves far less like a simple pipe than like a sponge with a very uneven surface.',
          'したがって流域は、単純な管というより、表面がひどく不揃いな海綿のようにふるまいます。',
        ),
        p(
          'Snow adds a delay of several months that farmers living downstream have depended on for many centuries.',
          '雪は、下流に暮らす農民が何世紀も頼ってきた遅れをもたらします。',
        ),
        s(
          'A deep layer of winter snow collects several months of rainfall and then releases it slowly through the spring and the early summer.',
          '冬の積雪は数か月分の降水を集め、春から初夏にかけてゆっくりと放出します。',
        ),
        s(
          'When more of that rainfall arrives as rain instead of snow, the same annual total reaches the fields at the wrong time of year.',
          'その降水がより多く雨として降るようになると、年間の総量は同じでも、届く時期が狂います。',
        ),
        s(
          'The contrast between those two patterns matters far more than the average figure that most reports choose to quote.',
          'この二つの型の対比は、多くの報告が引く平均値よりはるかに重要です。',
        ),
        p(
          'Fog, pollen, and fine sand are all carried into the basin by the same moving air that also brings the rain.',
          '霧と花粉と細かな塵は、雨を運ぶのと同じ動く空気によって運ばれます。',
        ),
        s(
          'What a river actually contains is therefore partly a record of what the wind has picked up along the way.',
          'したがって川が実際に含んでいるものは、風が拾い上げてきたものの記録でもあります。',
        ),
        s(
          'A lake near the middle of a basin acts as a quiet pool in which much of this drifting material can settle.',
          '流域の中ほどにある湖は、この漂う物質の多くにとって沈殿槽の役目を果たします。',
        ),
        s(
          'Its water leaves the lake much clearer than it entered, and its bed slowly gains a layer that scientists can later read.',
          '湖から出る水はより澄み、その底には、科学者がのちに読み取れる層がゆっくりと積もります。',
        ),
        p(
          'An anomaly in a single season is quite ordinary, but a long run of them is an indication of something else.',
          'ひとつの季節の異常はありふれたことですが、それが長く続くなら別の何かの兆候です。',
        ),
        s(
          'Separating an ordinary season from a real change requires records that run longer than any single working career.',
          'その二つを見分けるには、一人の職業人生より長い記録が必要です。',
        ),
        s(
          'Communities that begin keeping such records early can see a crisis approaching while it is still relatively cheap to answer.',
          '早くから記録を取り始めた地域は、まだ安く対処できるうちに危機の接近を見て取れます。',
        ),
        s(
          'Those that begin measuring only after a flood must argue about the past as well as about the future.',
          '洪水のあとになって測り始めた地域は、未来だけでなく過去についても争わなければなりません。',
        ),
        s(
          'The first practical step in any river basin is therefore a plain one, which is simply to keep the numbers year after year.',
          'したがってどの流域でも最初の実際的な一歩は地味なもの、すなわち数値を取り続けることです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'ecosystem',
      title: 'Living Systems',
      titleJa: '生きた仕組み',
      summaryJa: '生き物どうしのつながりと、遅れて現れる変化・不可逆な変化の見分け方を確かめます。',
      sentences: Object.freeze([
        p(
          'A river is not merely a volume of moving water, because it is also a corridor along which living things travel.',
          '川は単なる水の量ではありません。生き物が移動する通り道でもあるからです。',
        ),
        s(
          'Fish, insects, birds, and seeds all use the same narrow channel for purposes that have nothing to do with each other.',
          '魚も昆虫も鳥も種子も、互いに関係のない目的で同じ川筋を使います。',
        ),
        s(
          'A change that seems small to an engineer can be devastating to a species that depends on one narrow stage of it.',
          '技術者には小さく見える変化が、狭い一段階に依存する種にとっては壊滅的でありうるのです。',
        ),
        p(
          'Temperature is perhaps the clearest example of a quiet variable that produces genuinely dramatic effects.',
          '温度は、劇的な影響を持つ静かな変数の最も明確な例です。',
        ),
        s(
          'Many aquatic animals are highly susceptible to thermal change because they cannot regulate their own body heat.',
          '多くの水生動物は自分の熱を調節できないため、温度の変化にきわめて弱いのです。',
        ),
        s(
          'A rise of only two degrees may be adequate to end reproduction for one species while another becomes more energetic.',
          '二度の上昇は、ある種の繁殖を終わらせるのに十分でありながら、別の種をより活発にすることがあります。',
        ),
        s(
          'The result is not simply a loss but a new arrangement whose winners are very hard to predict in advance.',
          'その結果は単なる喪失ではなく、勝者を前もって予測しにくい組み替えです。',
        ),
        p(
          'The vegetation along a river bank does far more useful work than its modest appearance suggests.',
          '岸辺の植生は、その見かけから思われるよりはるかに多くの仕事をしています。',
        ),
        s(
          'Roots hold the soil in place, shade cools the water, and fallen leaves feed the insects that fish depend on.',
          '根は土をつなぎとめ、日陰は水を冷やし、落ち葉は魚が頼る昆虫を養います。',
        ),
        s(
          'Removing that narrow strip is cheap and quick, while restoring the same function may take several decades.',
          'その帯を取り除くのは安く速いのに、同じ働きを取り戻すには数十年かかることがあります。',
        ),
        s(
          'This asymmetry between damage and repair is probably the single most important fact about all living systems.',
          'この損傷と修復のあいだの非対称こそ、生きた仕組みについて最も重要な事実です。',
        ),
        p(
          'Species that arrive from elsewhere are described as harmful only after they have already spread widely.',
          '他所から来た種が侵入的だと言われるのは、広く広がったあとになってからです。',
        ),
        s(
          'Before that point they simply look like an ordinary addition to a long list that nobody has the time to read.',
          'その時点までは、誰も読む暇のない目録への目立たない追加に見えます。',
        ),
        s(
          'A prevalent new species can push a native population toward the verge of collapse within a few short seasons.',
          '広く定着した新参の種は、数季のうちに在来の個体群を崩壊の瀬戸際へ押しやることがあります。',
        ),
        s(
          'Preventing the arrival is far cheaper than any campaign of removal that follows a failure to prevent it.',
          '到達を防ぐことは、防ぎ損ねたあとに続くどんな駆除の取り組みよりもはるかに安上がりです。',
        ),
        p(
          'Long chains of cause and effect make the whole system genuinely difficult to describe with any confidence.',
          '因果の長い連なりが、その仕組み全体を自信をもって記述しにくくしています。',
        ),
        s(
          'A cautious scientist will therefore call an early conclusion tentative, and that careful word is not a weakness at all.',
          'それゆえ慎重な科学者は初期の結論を暫定的と呼びますが、その語は弱さではありません。',
        ),
        s(
          'It records how much of the evidence has already arrived and how much of it is still on the way.',
          'それは、証拠のどれだけが届き、どれだけがまだ途上にあるのかを記録しています。',
        ),
        s(
          'Readers who treat every careful wording as doubt will misread the most responsible work in the whole field.',
          'あらゆる留保を疑いと受け取る読者は、この分野で最も慎重な仕事を読み違えるでしょう。',
        ),
        s(
          'The useful question is never whether the science is fully certain, but rather which parts of it are settled enough to act on.',
          '役に立つ問いは、科学が確実かどうかではなく、そのどの部分が行動できるほど固まっているかです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'food',
      title: 'Farms, Food, and Soil',
      titleJa: '農地・食料・土',
      summaryJa: '灌漑・土壌・肥料・貿易を通じて、農地の判断が下流と食卓に及ぶ道筋をたどります。',
      sentences: Object.freeze([
        p(
          'Agriculture takes more water out of most river basins than every city and every factory combined.',
          '農業は、たいていの流域から、すべての都市と工場を合わせたよりも多くの水を取り出します。',
        ),
        s(
          'That single fact decides how any serious argument about water scarcity in a basin has to begin.',
          'このたった一つの事実が、流域における不足をめぐる議論の始め方を決めます。',
        ),
        s(
          'A change in the crops that farmers plant will move more water than any campaign aimed at households.',
          '農民が何を植えるかの変化は、家庭に向けたどんな取り組みよりも多くの水を動かします。',
        ),
        p(
          'Soil is the part of the whole system that is easiest to damage and hardest to replace.',
          '土は、この仕組みの中で最も傷つけやすく、最も取り替えにくい部分です。',
        ),
        s(
          'It takes several centuries to build up a few centimeters of good soil and a single wet season to lose them again.',
          '数センチを作るのに何世紀もかかり、それを失うには一度の雨季で足ります。',
        ),
        s(
          'Bare ground between two harvests is the moment at which a field is most likely to wash away.',
          '収穫と収穫のあいだの裸の地面こそ、畑が最も流されやすい瞬間です。',
        ),
        s(
          'Farmers who keep a cover crop growing through that gap lose far less of the layer they depend on.',
          'その間に被覆作物を保つ農民は、頼りにしている層をはるかに少なくしか失いません。',
        ),
        p(
          'Fertilizer that a plant does not take up does not simply vanish from the field where it was spread.',
          '作物が吸収しなかった肥料は、畑から単に消えてなくなるわけではありません。',
        ),
        s(
          'It travels with the next heavy rain into a ditch, then into a stream, and finally into water that other people use.',
          'それは次の雨とともに用水路へ、次に小川へ、そして最後に他の人が使う水へと移動します。',
        ),
        s(
          'Downstream the very same chemical that raised a yield can feed an enormous growth of water plants and weeds.',
          '下流では、収量を上げたのと同じ化学物質が、藻類の膨大な繁殖を養うことがあります。',
        ),
        s(
          'When that growth dies and decays, it removes the oxygen on which the fish and insects depend.',
          'その繁殖が死んで分解するとき、魚や昆虫が頼る酸素を奪ってしまいます。',
        ),
        p(
          'Irrigation raises yields surely and steadily, and yet it also concentrates salt in the very ground that it waters.',
          '灌漑は確実に収量を上げますが、水をやった土地に塩を集めもします。',
        ),
        s(
          'Every drop of water that evaporates leaves behind any minerals that it happened to be carrying.',
          '蒸発する一リットルごとに、たまたま運んでいた鉱物が残されます。',
        ),
        s(
          'A field can therefore become steadily less productive while every single season still looks successful at harvest.',
          'そのため畑は、どの季節も収穫時には成功に見えながら、着実に生産力を落としていくことがあります。',
        ),
        s(
          'Drainage that carries the salt away is expensive, and it moves the problem to someone further down the valley.',
          '塩を運び去る排水は費用がかかり、しかも問題をより下流の誰かへ移すだけです。',
        ),
        p(
          'Trade hides much of this, because a country that imports grain is also importing water that it never sees.',
          '貿易はこの多くを覆い隠します。穀物を輸入する国は、目にすることのない水を輸入しているからです。',
        ),
        s(
          'A dry region can eat well for many decades by buying what its own rainfall could never support.',
          '乾いた地域は、自らの降水では決して支えられないものを買うことで、数十年よく食べられます。',
        ),
        s(
          'That arrangement is neither dishonest nor unstable, but it does depend on a market that stays open.',
          'その仕組みは不誠実でも不安定でもありませんが、市場が開かれ続けることに依存しています。',
        ),
        s(
          'A single export restriction can turn an ordinary shortage into a full crisis several borders away.',
          '一度の輸出制限が、平凡な不足を、国境をいくつも越えた先で危機に変えることがあります。',
        ),
        s(
          'Reading a food price therefore means reading rainfall, soil, policy, and shipping costs all at the same time.',
          'したがって食料価格を読むとは、降水と土と政策と輸送を同時に読むことです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'health',
      title: 'Water and Public Health',
      titleJa: '水と公衆衛生',
      summaryJa: '水系感染・栄養・心の負担まで含めて、水の質が健康に届く経路を確かめます。',
      sentences: Object.freeze([
        p(
          'The clearest link between a river and a human body is an infection carried by water.',
          '川と人体を結ぶ最も明確な経路は、水が運ぶ感染です。',
        ),
        s(
          'A pathogen that survives a short journey downstream can reach thousands of households within a single day.',
          '下流への短い旅を生き延びた病原体は、一日で何千もの家庭に届きうるのです。',
        ),
        s(
          'Separating drinking water from waste water is therefore the oldest and cheapest public health measure that is known.',
          'したがって飲み水を排水から切り離すことは、知られている中で最も古く最も安い公衆衛生の対策です。',
        ),
        s(
          'Every later advance in medicine rests on that basic separation rather than replacing it in any way.',
          '医学のその後のあらゆる進歩は、その分離に取って代わるのではなく、その上に成り立っています。',
        ),
        p(
          'Incidence tells a community how many new cases of an illness appeared inside a clearly stated period of time.',
          '発生率は、定められた期間の中で新しい患者が何人出たのかを地域に伝えます。',
        ),
        s(
          'A number with no such period attached to it can be read to mean almost anything at all.',
          'その期間が添えられていない数字は、ほとんど何とでも読めてしまいます。',
        ),
        s(
          'Reports that compare two regions must also state how hard each of them actually looked for cases.',
          '二つの地域を比べる報告は、それぞれがどれほど熱心に患者を探したのかも述べなければなりません。',
        ),
        s(
          'A place that tests its own people carefully will always appear less healthy than a place that tests rarely.',
          '丁寧に検査する場所は、めったに検査しない場所より常に不健康に見えます。',
        ),
        p(
          'Nutrition connects the same river to the same human body along a much slower and much quieter path.',
          '栄養は、同じ川と同じ体を、もっと遅い経路で結び付けています。',
        ),
        s(
          'Malnutrition weakens the immune response, so that an otherwise mild infection can become a serious one.',
          '栄養不良は免疫の反応を弱め、軽い感染を重いものに変えます。',
        ),
        s(
          'Protein and clean water are therefore treated together in any program that seriously expects to see results.',
          'したがってたんぱく質と清潔な水は、成果を期待するどの計画でも一緒に扱われます。',
        ),
        s(
          'Treating either of them alone produces figures that look encouraging on paper and change very little.',
          'どちらか一方だけを扱うと、励みになるように見えて実際はほとんど変わらない数字が出ます。',
        ),
        p(
          'A flood does a kind of damage that no clinic can ever record on an ordinary chart of injuries.',
          '洪水は、どの診療所も外傷の記録票には書けない害をもたらします。',
        ),
        s(
          'Families that have lost a house carry a strain that lasts long after the water itself has disappeared.',
          '家を失った家族は、水が引いたあとも長く続く負担を抱えます。',
        ),
        s(
          'Grief, fear of the next season, and the loss of ordinary routine can all be measured if anyone chooses to measure them.',
          '悲しみと次の季節への恐れと日常の喪失は、誰かが測りさえすればすべて測れます。',
        ),
        s(
          'Programs that ignore this part of the harm will consistently underestimate what a full recovery is going to cost.',
          'この部分の害を無視する計画は、回復にかかる費用を決まって過小に見積もります。',
        ),
        p(
          'Distance quietly decides how much of any of this treatment a household is actually able to obtain.',
          '距離が、こうした手当てのどれだけを家庭が実際に受けられるかを決めます。',
        ),
        s(
          'A clinic two hours away is used only for emergencies and almost never for the small problems that precede them.',
          '二時間かかる診療所は緊急時に使われ、その前に起こる小さな不調にはほとんど使われません。',
        ),
        s(
          'Telemedicine narrows part of that gap, although it can neither set a fracture nor deliver a vaccine.',
          '遠隔医療はその隔たりの一部を狭めますが、骨折を整復することもワクチンを届けることもできません。',
        ),
        s(
          'The remaining distance has to be closed by better roads, by more staff, or by moving the service itself closer.',
          '残った距離は、道路か、人員か、あるいは提供の場を近づけることで埋めるほかありません。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'infrastructure',
      title: 'Pipes, Roads, and Buildings',
      titleJa: '管・道路・建物',
      summaryJa: '見えない設備の維持と、費用の先送りが誰に回るのかを追います。',
      sentences: Object.freeze([
        p(
          'Most of the equipment that delivers water to a house is buried underground and therefore easy to forget.',
          '家へ水を届ける設備の大半は埋められていて、それゆえ忘れられがちです。',
        ),
        s(
          'A pipe installed a century ago may still work perfectly while the one beside it is close to failure.',
          '百年前に敷かれた管がなお完璧に働く一方で、その隣の管は破損寸前ということもあります。',
        ),
        s(
          'Nobody can separate the two from the surface alone without instruments and a careful survey of the network.',
          '器具と丁寧な調査なしに、地表からその二つを見分けられる人はいません。',
        ),
        s(
          'Maintenance therefore competes for money against new projects that the public can actually see and even admire.',
          'したがって維持管理は、有権者が実際に目にできる事業と予算を奪い合うことになります。',
        ),
        p(
          'A network full of small leaks loses a fixed share of everything that is ever pumped into its pipes.',
          '漏れのある管網は、送り込まれたものの一定の割合を失います。',
        ),
        s(
          'In some cities that share reaches a third of the total, which is more than any conservation campaign could save.',
          '都市によってはその割合が三分の一に達し、どんな節水の呼びかけで節約できる量も上回ります。',
        ),
        s(
          'Finding those leaks is quiet and patient work that produces no photograph worth printing in a newspaper.',
          '漏れを見つけるのは、印刷する価値のある写真の一枚も生まない地味な仕事です。',
        ),
        s(
          'It is also the cheapest new supply that is available to almost every older city in the world.',
          'それは同時に、世界のほとんどすべての古い都市にとって最も安い新たな供給源でもあります。',
        ),
        p(
          'Roads change a basin quite as much as any dam, although they are rarely counted as water projects at all.',
          '道路は、水の事業として数えられることはまれですが、どのダムにも劣らず流域を変えます。',
        ),
        s(
          'A hard paved surface sends rain straight to the nearest drain instead of letting it soak into the ground.',
          '硬い舗装は、雨を地面にしみ込ませる代わりに最寄りの排水口へ送ります。',
        ),
        s(
          'The same storm therefore produces a higher and much faster peak in a city than in an open field.',
          'そのため同じ嵐でも、都市では畑よりも高く速い出水の頂点が生まれます。',
        ),
        s(
          'Engineers can slow that peak with holding pools, gardens, and open surfaces that cost far less than a concrete wall.',
          '技術者は、堤防よりはるかに安い調整池や緑地や透水性の舗装でその頂点を低くできます。',
        ),
        p(
          'Buildings then decide who is exposed on the day when the peak of a flood arrives in any case.',
          '建物は、それでも出水の頂点が来たとき誰がさらされるのかを決めます。',
        ),
        s(
          'A ground floor that is used for storage recovers from a flood far more easily than one used for sleeping.',
          '倉庫として使われる一階は、寝室として使われる一階よりはるかに容易に洪水から立ち直ります。',
        ),
        s(
          'Rules that require the second of these uses to sit higher are cheap while a district is still being built.',
          '後者の用途を高い階に置くよう求める規則は、地区がまだ建設中なら安上がりです。',
        ),
        s(
          'The very same rules become extremely expensive once that district has been finished and fully occupied.',
          '同じ規則も、地区ができあがって人が住んだあとでは非常に高くつきます。',
        ),
        p(
          'Every single one of these choices quietly moves some cost between the present and the future.',
          'こうした選択のどれもが、現在と未来のあいだで費用を移し替えています。',
        ),
        s(
          'Deferring maintenance is not really saving money, because it is borrowing against a repair that only grows larger.',
          '維持を先送りすることは節約ではありません。大きくなっていく修理から前借りしているからです。',
        ),
        s(
          'The interest on that loan is paid by the family that happens to be living there when the pipe finally breaks.',
          'その借金の利子は、管がついに壊れたときたまたまそこに住んでいる人が払います。',
        ),
        s(
          'A budget that states all of this openly is far easier to defend than one that simply postpones the question.',
          'これを率直に述べる予算は、問いを先送りするだけの予算より擁護しやすいのです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'energy',
      title: 'Energy and Machines',
      titleJa: 'エネルギーと機械',
      summaryJa: '水とエネルギーが互いを消費し合う関係と、制御装置が持ち込む新しい弱点を見ます。',
      sentences: Object.freeze([
        p(
          'Water and energy are so closely linked together that neither of them can be planned on its own.',
          '水とエネルギーは密接に結び付いていて、どちらも単独では計画できません。',
        ),
        s(
          'Moving water up to a higher place takes electricity, and generating that electricity usually takes a great deal of water.',
          '水を高い所へ動かすには電力が要り、電力を作るにはたいてい水が要ります。',
        ),
        s(
          'A drought therefore reduces power output at exactly the moment when the demand for pumping water rises.',
          'そのため干ばつは、揚水の需要が高まるまさにその瞬間に発電量を減らします。',
        ),
        s(
          'Planning either of these two systems without the other guarantees a shortage that nobody in charge predicted.',
          '一方を他方なしに計画することは、誰も予測しなかった不足を確実に招きます。',
        ),
        p(
          'A dam is the most visible machine in any basin and also the hardest one to evaluate honestly.',
          'ダムはどの流域でも最も目立つ機械であり、誠実に評価するのが最も難しい機械です。',
        ),
        s(
          'It stores water, produces power, controls floods, and blocks the movement of fish all at the same time.',
          'それは水を蓄え、電力を生み、洪水を抑え、同時に魚の移動を妨げます。',
        ),
        s(
          'Each of those four effects is entirely real, and no single number can combine them into one verdict.',
          'その四つの影響はどれも本物であり、どんな一つの数字もそれらを一つの判定にまとめられません。',
        ),
        s(
          'Arguments about dams usually turn out to be arguments about which of those effects gets counted first.',
          'ダムをめぐる議論は、たいていどの影響を最初に数えるかをめぐる議論だと分かります。',
        ),
        p(
          'Smaller machines now do a growing share of the work that used to require a large structure.',
          'かつては大きな構造物を必要とした仕事の多くを、いまでは小さな機械が担うようになっています。',
        ),
        s(
          'A valve that opens on a fixed schedule can hold back a flood peak that would otherwise pass downstream.',
          '時刻どおりに開く弁は、そのままなら下流へ抜けていく出水の頂点をせき止められます。',
        ),
        s(
          'A pump that is controlled by a sensor uses far less electricity than one that simply runs all day.',
          'センサーで制御される揚水機は、一日中ただ動き続ける揚水機よりはるかに少ない電力で済みます。',
        ),
        s(
          'These gains are quiet ones, and added together they often exceed what an entire new power plant could supply.',
          'こうした改善は地味ですが、合わせれば新しい発電所が供給する量を上回ることもよくあります。',
        ),
        p(
          'Control has now moved from valves and levers to software that runs on servers far away.',
          '制御は弁やてこから、遠くのサーバー上で動く算法へと移りました。',
        ),
        s(
          'That shift makes a system quick to respond, and at the very same time it makes the whole system a target.',
          'その移行は仕組みを応答的にし、同時に仕組みを標的にもします。',
        ),
        s(
          'A failure in connectivity can now stop a pump that has nothing at all mechanically wrong with it.',
          '通信の障害はいまや、機械的にはどこも壊れていない揚水機を止めてしまいます。',
        ),
        s(
          'Cybersecurity therefore belongs inside a water plan rather than only inside some separate technology plan.',
          'したがってサイバー安全保障は、技術の計画だけでなく水の計画にも属します。',
        ),
        p(
          'Old equipment usually becomes obsolete long before it actually stops working out in the field.',
          '古い設備は、動かなくなるずっと前に時代遅れになります。',
        ),
        s(
          'Parts stop being made, the engineers who understand it retire, and the records that explain it go missing.',
          '部品が作られなくなり、それを理解する技術者が引退し、書類が行方不明になります。',
        ),
        s(
          'A prototype that nobody ever fully described on paper is a risk disguised as a valuable asset.',
          '完全な記録が残されなかった試作機は、資産の姿をした危険です。',
        ),
        s(
          'Writing down how a machine actually works is therefore an ordinary and necessary part of keeping the machine running.',
          'したがって機械が実際にどう働くのかを書き留めることは、それを動かし続けることの一部です。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'measurement',
      title: 'Measurement and Uncertainty',
      titleJa: '測定と不確実性',
      summaryJa: '平均と分布、相関と因果、基準線の選び方など、数字の読み方そのものを扱います。',
      sentences: Object.freeze([
        p(
          'Every claim about a river finally rests on a measurement that someone once chose to make.',
          '川についてのあらゆる主張は、誰かが行うと決めた測定の上に成り立っています。',
        ),
        s(
          'Where the gauge sits, how often it is read, and what it ignores all help to shape the result.',
          '観測器がどこにあり、どれほど頻繁に読み取り、何を無視するかが、すべて結果を形づくります。',
        ),
        s(
          'A number is therefore a summary of a human decision quite as much as a summary of the world.',
          'したがって数字は、世界の要約であると同時に、ある決定の要約でもあります。',
        ),
        p(
          'An average conceals the distribution that produced it, and that distribution is usually what really matters.',
          '平均はそれを生んだ分布を覆い隠しますが、重要なのはたいてい分布のほうです。',
        ),
        s(
          'A basin with adequate rainfall on average can still fail in the three years that happen to fall below the minimum.',
          '平均では十分な降水がある流域も、最低量を下回る三年のあいだに立ち行かなくなることがあります。',
        ),
        s(
          'Planning for the mean therefore prepares a community for a year that it will only rarely experience.',
          'そのため平均に合わせた計画は、地域をめったに経験しない年に備えさせることになります。',
        ),
        s(
          'Planning for the most severe year on record is expensive, and it is the only figure that a household actually feels.',
          '記録上最悪の年に備えるのは高くつきますが、家庭が実際に感じるのはその数字だけです。',
        ),
        p(
          'A baseline is the quiet assumption sitting inside almost every comparison that ever gets published anywhere.',
          '基準線は、公表されるほとんどすべての比較の内側にある静かな前提です。',
        ),
        s(
          'Choosing a wet decade as the starting point makes almost any later period look like a decline.',
          '出発点として雨の多い十年を選べば、その後のどの期間も減少に見えます。',
        ),
        s(
          'Choosing a dry decade instead makes exactly the same later period look like a welcome recovery.',
          '乾いた十年を選べば、同じ期間が歓迎すべき回復に見えます。',
        ),
        s(
          'Honest reports state the baseline first, because a reader cannot check any of the claims without it.',
          '誠実な報告はまず基準線を述べます。それなしには読者が主張を検証できないからです。',
        ),
        p(
          'Correlation appears in almost any pair of series that both happen to rise over the same decades.',
          '相関は、同じ数十年にわたってともに上昇するどんな二つの系列にもほぼ現れます。',
        ),
        s(
          'Causation requires a mechanism, a clear sequence in time, and a case that fails when the mechanism is absent.',
          '因果には、仕組みと、時間の順序と、その仕組みがないときに成り立たない事例が必要です。',
        ),
        s(
          'Reports that supply only the first of these are describing an accident of the record with great confidence.',
          'このうち最初のものしか示さない報告は、偶然の一致を自信たっぷりに記述しているだけです。',
        ),
        s(
          'Asking what would have to be observed for such a claim to fail is the fastest test available.',
          'その主張が成り立たなくなるには何が観測されねばならないかを問うことが、最も速い検証です。',
        ),
        p(
          'Different academic disciplines measure the very same basin and only rarely produce the same picture of it.',
          '異なる分野が同じ流域を測り、同じ像を結ぶことはめったにありません。',
        ),
        s(
          'A water scientist, a specialist in ecology, and an economist will each treat a different quantity as the important one.',
          '水文学者と生態学者と経済学者は、それぞれ別の量を重要なものとして扱います。',
        ),
        s(
          'None of them is simply wrong, and none of their separate pictures is complete on its own.',
          'どの人も間違ってはいませんし、どの像も単独では完全ではありません。',
        ),
        s(
          'Work across several disciplines is slow precisely because the separate vocabularies have to be reconciled first.',
          '分野を越えた仕事が遅いのは、まさに用語をすり合わせる必要があるからです。',
        ),
        s(
          'A basin that funds that slow work early avoids having to argue about basic definitions during an emergency.',
          'その遅い仕事に早くから資金を出す流域は、非常時に定義をめぐって争わずに済みます。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'cooperation',
      title: 'A Resource Shared Downstream',
      titleJa: '下流まで共有する資源',
      summaryJa: '上流と下流の非対称、条約の設計、地域の知識と参加の条件を確かめます。',
      sentences: Object.freeze([
        p(
          'A river gives a community near its source an advantage that no argument can ever fully remove.',
          '川は上流の地域に、どんな議論でも取り除けない有利さを与えます。',
        ),
        s(
          'Anything that happens above arrives below in time, and nothing that happens below ever travels back up again.',
          '上で起きたことはすべて下へ届き、下で起きたことは何一つ上へは戻りません。',
        ),
        s(
          'Every treaty about a shared river is an attempt to answer that one basic asymmetry somehow.',
          '共有された川についてのあらゆる条約は、この根本的な非対称に答えようとする試みです。',
        ),
        s(
          'Agreements that ignore this asymmetry collapse as soon as the first genuinely dry year finally arrives.',
          'それを無視した合意は、最初の乾いた年が来るとすぐに崩れます。',
        ),
        p(
          'A workable agreement gives the side near the source something valuable that it cannot obtain on its own.',
          '機能する合意は、上流の側に、単独では得られない何かを与えます。',
        ),
        s(
          'Electricity, access to markets, flood warnings, and shared observations have all served that purpose rather well.',
          '電力、市場への参入、洪水の警報、そして共有された観測値が、いずれもその役目を果たしてきました。',
        ),
        s(
          'An agreement that only asks the other side for restraint is a request rather than a bargain.',
          '自制だけを求める合意は、取引ではなくお願いです。',
        ),
        s(
          'Requests hold only while relations are warm and fail at exactly the moment when they are most needed.',
          'お願いは関係が良好なあいだは保たれ、必要とされるまさにそのときに破れます。',
        ),
        p(
          'Sovereignty makes enforcement difficult even in cases where the text of a treaty is perfectly clear.',
          '主権は、条約の文言が明確な場合でさえ、履行を難しくします。',
        ),
        s(
          'What holds an agreement together is usually the cost of leaving it rather than any penalty stated inside it.',
          '合意をつなぎとめるのはたいてい、内部の罰則ではなく、そこから抜ける費用のほうです。',
        ),
        s(
          'Joint monitoring is valuable mainly because it makes any disagreement about the basic facts expensive and slow.',
          '共同の観測が価値を持つのは、事実をめぐる不一致を高くつき遅いものにするからです。',
        ),
        s(
          'Two governments that share a single gauge will argue about policy instead of arguing about the numbers.',
          '観測器を共有する二つの政府は、数字ではなく政策について争います。',
        ),
        p(
          'Indigenous communities frequently hold the longest continuous record of how a particular basin actually behaves.',
          '先住の共同体はしばしば、流域がどうふるまうかについての最も長い記録を保っています。',
        ),
        s(
          'That record is stored in daily practice and in language rather than in any published series of numbers.',
          'その記録は、公表された系列ではなく、実践と言語の中に蓄えられています。',
        ),
        s(
          'Treating it as folklore rather than as real evidence discards information that cannot be recovered later.',
          'それを証拠ではなく民話として扱うことは、のちに取り戻せない情報を捨てることです。',
        ),
        s(
          'Consultation that begins after a plan is already complete is a formal step only, and everyone understands it as one.',
          '計画ができあがったあとで始まる協議は形式にすぎず、そう受け取られます。',
        ),
        p(
          'A basin authority works only when the people it governs can see what it decides and why.',
          '流域の管理機構は、統治される人々がその決定と理由を見られるときに機能します。',
        ),
        s(
          'Publishing the data, the model, and the reasoning costs very little and buys a great deal of patience.',
          '観測値と模型と論拠を公表することは費用がわずかで、多くの忍耐を買います。',
        ),
        s(
          'Communities will accept an unpopular decision far more readily when they can follow the whole argument behind it.',
          '人々は、決定の背後にある論拠をたどれるとき、歓迎できない決定をはるかに受け入れやすくなります。',
        ),
        s(
          'A shared river is finally governed by whether the neighbors who live along it can still talk to one another.',
          '共有された川を最終的に治めるのは、隣り合う人々がなお互いに話せるかどうかです。',
        ),
      ]),
    }),
  ]),
})
