// 語彙強化ロングリーディング（約2,000語・英検準1級）の本文。
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

export const CUSTOMS_ACROSS_BORDERS_BODY = Object.freeze({
  id: 'p_ext_2000_customs_across_borders',
  sections: Object.freeze([
    Object.freeze({
      id: 'greetings',
      title: 'Greetings and First Impressions',
      titleJa: '挨拶と第一印象',
      summaryJa: '挨拶・呼び名・謝罪・順番待ちに隠れた規則を、丁寧さの優劣ではなく機能の違いとして読みます。',
      sentences: Object.freeze([
        p(
          'A greeting is the shortest conversation a culture holds with a stranger, and it carries far more information than its few words suggest.',
          '挨拶は、ある文化が見知らぬ人と交わす最も短い会話であり、そのわずかな言葉から思われるよりはるかに多くの情報を運びます。',
        ),
        s(
          'It announces how close two people may stand, how formal the moment must be, and who is expected to speak first.',
          '挨拶は、二人がどれだけ近くに立ってよいか、その場にどれほどの改まりが必要か、そして誰が先に話すことになっているかを告げます。',
        ),
        s(
          'Visitors usually notice the gestures long before they notice anything at all about the grammar.',
          '旅行者はたいてい、文法について何かに気づくよりずっと前に、身ぶりに気づきます。',
        ),
        p(
          'In some places a surname comes first because the family is understood to precede the individual who carries it.',
          '姓が先に来る場所があるのは、家族がそれを名乗る個人に先立つと理解されているからです。',
        ),
        s(
          'Elsewhere a first name is offered immediately, and using a title instead can feel like a small refusal of friendship.',
          '別の場所では名前がすぐに差し出され、代わりに肩書を使うと、友情のささやかな拒絶のように感じられることがあります。',
        ),
        s(
          'Neither habit is more polite than the other, because each simply answers a different question about where a person belongs.',
          'どちらの習慣も他方より礼儀正しいわけではありません。それぞれが、人がどこに属するかについての別の問いに答えているだけだからです。',
        ),
        s(
          'A visitor who has learned this stops reading warmth or coldness into the simple order of two ordinary words.',
          'これを学んだ訪問者は、ありふれた二つの語の順番に温かさや冷たさを読み込むのをやめます。',
        ),
        p(
          'Bilingual speakers often move between two greeting systems without noticing that they have changed anything at all.',
          '二言語を話す人は、自分が何かを変えたことにまったく気づかないまま、二つの挨拶の体系を行き来することがよくあります。',
        ),
        s(
          'A returnee may bow politely in one country and shake hands in another within a single week of travel.',
          '帰国者は、一週間の移動のうちに、ある国ではおじぎをし、別の国では握手をすることがあります。',
        ),
        s(
          'Their ease is not a talent so much as long practice with the small rules that surround any introduction.',
          '彼らの自然さは才能というより、紹介の場面を取り巻く細かな規則についての長い実践です。',
        ),
        p(
          'Apologies carry much the same hidden structure, and they are misread even more often than greetings are.',
          '謝罪も同じ隠れた構造を持っており、挨拶よりもさらに頻繁に誤読されます。',
        ),
        s(
          'In one setting an apology repairs a relationship, while in another it admits fault and invites a legal claim.',
          'ある場面では謝罪は関係を修復しますが、別の場面では過失を認め、法的な請求を招きます。',
        ),
        s(
          'Because the two functions look identical from outside, a sincere apology can produce an uproar rather than calm.',
          'この二つの働きは外からは同じに見えるので、誠実な謝罪が落ち着きではなく騒動を生むことがあります。',
        ),
        s(
          'Tone and timing matter as much as the words themselves, and irony rarely survives translation intact.',
          '口調と間合いは言葉そのものと同じくらい重要で、皮肉が翻訳を無傷で生き延びることはめったにありません。',
        ),
        p(
          'Even waiting has a grammar, since a queue may be a straight line, a loose cluster, or a numbered ticket.',
          '順番待ちにさえ文法があります。列は一直線にも、ゆるやかな集まりにも、番号札にもなりうるからです。',
        ),
        s(
          'A visitor who happens to stand in the wrong place is usually judged careless rather than deliberately rude.',
          '間違った場所に立つ新参者はたいてい、意図的に無礼だというより不注意だと判断されます。',
        ),
        s(
          'Hospitality toward strangers is common everywhere, yet the way it is offered follows local rules that nobody writes down.',
          '見知らぬ人へのもてなしはどこにでもありますが、その差し出し方は誰も書き記さない土地の規則に従います。',
        ),
        s(
          'The useful conclusion is not that greetings are arbitrary, but that they are learned, and can therefore be learned again.',
          '役に立つ結論は、挨拶が恣意的だということではなく、それが学ばれたものであり、したがってもう一度学び直せるということです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'hospitality',
      title: 'Hospitality and the Shared Table',
      titleJa: 'もてなしと食卓',
      summaryJa: '食事が生む義務・席次・時間・食べられるものの判断を、費用ではなく手間として読みます。',
      sentences: Object.freeze([
        p(
          'A shared meal is one of the oldest ways in which a household tells a stranger that he is welcome.',
          '共にとる食事は、ある家庭が見知らぬ人に歓迎されていると伝える、最も古い方法の一つです。',
        ),
        s(
          'What appears on the table matters far less than the obligations the meal quietly creates between host and guest.',
          '食卓に並ぶものは、その食事が主人と客の間に静かに生む義務よりも、はるかに重要ではありません。',
        ),
        s(
          'In many communities a guest who refuses food is understood to be refusing the relationship the food represents.',
          '多くの共同体では、食べ物を断る客は、その食べ物が表す関係を断っていると理解されます。',
        ),
        s(
          'Elsewhere a polite guest declines twice before accepting, and a host who stops offering has ended the ritual too early.',
          '別の場所では礼儀正しい客は受け取る前に二度断り、勧めるのをやめた主人は儀礼を早く終わらせすぎたことになります。',
        ),
        s(
          'Both rules are meticulous in their own way, and both remain invisible to anyone who has never been taught them.',
          'どちらの規則も細やかで、どちらも教わったことのない人には見えないままです。',
        ),
        p(
          'A host may spend days preparing a gorgeous meal, or may improvise something frugal from anything the kitchen happens to hold.',
          '主人は何日もかけて豪華な食事を用意することもあれば、台所にたまたまあるもので質素な料理を即興で作ることもあります。',
        ),
        s(
          'The effort rather than the expense is what a guest is generally expected to notice and to acknowledge.',
          '客が気づき、そして認めることを期待されているのは、費用ではなく手間のほうです。',
        ),
        s(
          'Where resources have been depleted, a small portion offered willingly can mean more than an imposing display of plenty.',
          '資源が乏しくなった場所では、進んで差し出された少量が、堂々たる豊かさの誇示よりも大きな意味を持つことがあります。',
        ),
        s(
          'Visitors who measure hospitality by cost alone will therefore misread the generosity in front of them almost entirely.',
          'それゆえ、もてなしを費用だけで測る訪問者は、寛大さをほとんど完全に読み違えます。',
        ),
        p(
          'Seating usually encodes rank, age, or the direction of a view that the household regards as honored.',
          '席次はたいてい、序列や年齢、あるいはその家が名誉あるものとみなす眺めの方向を、暗号のように示しています。',
        ),
        s(
          'Guests who are asked to sit in a particular place receive information, and not merely a chair.',
          '特定の場所に座るよう求められた客は、単に椅子を与えられているのではなく、情報を与えられています。',
        ),
        s(
          'To behave sensibly at an unfamiliar table, it helps to wait, to watch, and to follow the person who clearly belongs.',
          '不慣れな食卓で分別よくふるまうには、待ち、観察し、明らかにその場に属している人に従うのが役立ちます。',
        ),
        p(
          'Some tables require silence while food is being served, while others treat continuous conversation as the whole point of eating together.',
          '食事が供される間の沈黙を求める食卓もあれば、絶え間ない会話こそ共に食べることの目的だとみなす食卓もあります。',
        ),
        s(
          'Timing is equally variable, since a main meal may commence at six in one country and at eleven in another.',
          '時間も同じように多様で、主要な食事はある国では六時に、別の国では十一時に始まることがあります。',
        ),
        s(
          'Guests who anticipate the local rhythm avoid arriving hungry at a house that has not yet begun to cook.',
          '土地の時間の流れを見越す客は、まだ調理を始めていない家に空腹で着いてしまうことを避けられます。',
        ),
        p(
          'What counts as edible is also a local judgment rather than a fixed biological fact.',
          '何が食べられるものとみなされるかもまた、固定した生物学的事実ではなく土地の判断です。',
        ),
        s(
          'A dish that seems notorious to one visitor is ordinary comfort food to the family that is serving it.',
          'ある訪問者には悪名高く思える料理も、それを供している家族にとってはありふれた心安らぐ食べ物です。',
        ),
        s(
          'Curiosity that is expressed without any comment is therefore almost always the safer and more welcome response.',
          'したがって、論評を加えずに示す好奇心は、ほとんどの場合より安全で、より歓迎される反応です。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'belief',
      title: 'Festivals, Belief, and Daily Life',
      titleJa: '祭り・信仰・日常生活',
      summaryJa: '祭りが何を保存し誰が支えているかを、合理・非合理の判定ではなく機能として読みます。',
      sentences: Object.freeze([
        p(
          'Festivals look like exceptions to daily life, and yet they usually restate what a community values most.',
          '祭りは日常生活の例外のように見えますが、実のところ共同体が最も重んじるものを言い直しています。',
        ),
        s(
          'A ritual repeated for centuries carries meanings that its own participants may no longer be able to explain.',
          '何世紀も繰り返された儀礼は、その参加者自身がもはや説明できないかもしれない意味を運んでいます。',
        ),
        s(
          'That is not ignorance, because tradition stores knowledge in a form that words alone would quickly lose.',
          'それは無知ではありません。伝統は、言葉だけならすぐに失われてしまう形で知識を蓄えるからです。',
        ),
        p(
          'Some festivals are religious in origin and now largely social, while others have travelled in the opposite direction.',
          '起源は宗教的で今ではおおむね社交的な祭りもあれば、反対の方向へ進んできた祭りもあります。',
        ),
        s(
          'A holy day can become a shopping season, and a commercial event can gradually acquire a sincere ritual meaning.',
          '聖なる日が買い物の季節になることもあれば、商業的な催しが次第に誠実な儀礼の意味を帯びることもあります。',
        ),
        s(
          'Neither change makes the festival false, since meaning is assigned by the people who actually keep it year after year.',
          'どちらの変化も祭りを偽物にはしません。意味を与えるのは、実際にそれを続けている人々だからです。',
        ),
        p(
          'Music, dancing, and calligraphy often carry the parts of belief that formal doctrine states rather poorly or leaves out completely.',
          '音楽や踊りや書は、公式の教義がうまく述べられない信仰の部分を運んでいることがよくあります。',
        ),
        s(
          'A rhythm learned at an early age can resonate long after the theology that once explained it has been lost.',
          '子どものころに覚えた律動は、かつてそれを説明した神学が忘れられたあとも長く響き続けます。',
        ),
        s(
          'This is why an artifact removed from its festival can look like a pretty object inside a well-lit museum case.',
          'だからこそ、祭りから切り離された工芸品は、博物館の陳列棚の中では単なる装飾に見えてしまうのです。',
        ),
        p(
          'Superstition and principle are much harder to separate than outsiders usually assume them to be.',
          '迷信と信条は、部外者が普通そうだと考えるよりもずっと分けにくいものです。',
        ),
        s(
          'A gesture made for luck may also be a form of respect toward the dead of a particular family.',
          '幸運を願ってなされる身ぶりは、ある家の死者への敬意の形でもありうるのです。',
        ),
        s(
          'Calling such a gesture irrational answers a question that the people performing it were never actually asking in the first place.',
          'そうした身ぶりを非合理だと呼ぶことは、それを行う人々が実際には問うていなかった問いに答えることです。',
        ),
        p(
          'Many festivals now serve two audiences at once: the community that keeps them and the visitors who photograph them.',
          '今日多くの祭りは、それを続ける共同体と、それを写真に撮る訪問者という二つの観客に同時に応えています。',
        ),
        s(
          'A photogenic ritual can survive because tourism funds it, and can also be changed by that very same attention.',
          '写真映えする儀礼は観光がそれを支えるおかげで生き残ることもあれば、まさにその関心によって作り変えられることもあります。',
        ),
        s(
          'Whether this counts as preservation or as loss is a genuine disagreement rather than a question with a settled answer.',
          'これが保存にあたるのか喪失にあたるのかは、決着した事実ではなく、本物の意見の対立です。',
        ),
        p(
          'Imperial history complicates the question further, since some traditions were suppressed and much later revived deliberately.',
          '植民地の歴史はこの問いをさらに複雑にします。抑圧され、ずっと後になって意図的に復活させられた伝統があるからです。',
        ),
        s(
          'A revived custom is not less real, although it may serve purposes that the original version never had and could not have imagined.',
          '復活した風習は現実味が薄いわけではありませんが、元の形が決して持たなかった目的に仕えていることはあります。',
        ),
        s(
          'Reading a festival well therefore means asking who keeps it, who pays for it, and who is left out.',
          'したがって祭りをよく読むとは、誰がそれを続け、誰がその費用を負い、誰が締め出されているのかを問うことです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'memory',
      title: 'Art, Objects, and Memory',
      titleJa: '芸術・物・記憶',
      summaryJa: '物と物語が記憶を運ぶ仕組みと、保存が同時に選別でもあることを確かめます。',
      sentences: Object.freeze([
        p(
          'Objects outlive the people who made them, and they carry memory in a way that paper documents cannot.',
          '物はそれを作った人より長く残り、書かれた文書にはできない仕方で記憶を運びます。',
        ),
        s(
          'A length of fabric, a brick, or a wooden chest can record a technique that no surviving manuscript ever describes.',
          '一巻きの布や煉瓦や木の櫃は、現存するどの写本も記していない技法を記録していることがあります。',
        ),
        s(
          'Museums preserve such things carefully, but they also remove them from the ordinary rooms that once explained them.',
          '博物館はそうした物を丁寧に保存しますが、同時に、かつてそれを説明していた部屋からそれを引き離してもいます。',
        ),
        p(
          'A souvenir bought at a temple gate belongs to two systems of meaning at the very same time.',
          '寺の門前で買われた土産物は、まったく同時に二つの意味の体系に属しています。',
        ),
        s(
          'For the maker it may be an income, while for the buyer it is a compressed memory of a journey.',
          '作り手にとってそれは生計かもしれませんが、買い手にとっては旅を圧縮した記憶です。',
        ),
        s(
          'Neither meaning is false, although the two sides rarely acknowledge each other in any explicit or public way.',
          'どちらの意味も偽りではありませんが、両者が明示的に互いを認め合うことはめったにありません。',
        ),
        p(
          'Craft traditions usually pass through years of apprenticeship rather than through instruction that can be recorded and copied.',
          '工芸の伝統はたいてい、書き記せる指導ではなく徒弟の関係を通って受け継がれます。',
        ),
        s(
          'A pedagogy built on watching and repeating transmits the kind of judgment that verbal rules would inevitably flatten.',
          '見て真似ることの上に築かれた教え方は、言葉の規則なら必ず平板にしてしまう判断を伝えます。',
        ),
        s(
          'When a workshop closes, the loss is not a product but a set of decisions that nobody ever recorded.',
          '工房が閉じるとき、失われるのは製品ではなく、誰も書き留めなかった一連の判断です。',
        ),
        p(
          'Catastrophe accelerates this kind of loss, and so, much less obviously, does a period of sudden wealth.',
          '災厄はこの種の喪失を加速させますが、あまり目立たない形で、急激な繁栄も同じ働きをします。',
        ),
        s(
          'A factory that produces a cheaper version of a traditional object can end the craft within a single generation.',
          '伝統的な品物の安価な複製を作る工場は、一世代のうちにその工芸を終わらせてしまうことがあります。',
        ),
        s(
          'The surplus that such a factory creates may later fund the museum that displays what it replaced.',
          'そうした工場が生む余剰は、のちに、それが取って代わったものを展示する博物館の資金になるかもしれません。',
        ),
        p(
          'Stories work in much the same way, since a protagonist can carry a moral premise across many centuries.',
          '物語もほぼ同じように働きます。主人公は道徳的な前提を何世紀にもわたって運べるからです。',
        ),
        s(
          'A myth is not a failed history, because it is a compressed argument about how people should act.',
          '神話は失敗した歴史ではありません。人がどう行動すべきかについての、圧縮された議論だからです。',
        ),
        s(
          'Reading it as a literal claim therefore misses the function that the story is actually performing for its readers.',
          'それを事実の主張として読むことは、その物語が実際に果たしている働きを見落とすことです。',
        ),
        p(
          'Every act of preservation is at the same time an act of selection that someone has to make.',
          'あらゆる保存の行為は同時に、誰かが下さなければならない選別の行為です。',
        ),
        s(
          'Someone decides which manuscript is restored, which building is protected, and which one is quietly allowed to crack.',
          '誰かが、どの写本を修復し、どの建物を守り、どれが静かにひび割れるままにされるかを決めます。',
        ),
        s(
          'Those decisions quietly shape what a later generation will believe that its own ancestors actually cared about.',
          'そうした決定が、後の世代が自分たちの祖先は本当は何を大切にしていたと信じるかを形づくります。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'movement',
      title: 'Language, Place, and Migration',
      titleJa: '言語・場所・移動',
      summaryJa: '方言・移住・都市・交易を通して、言語と場所が互いを作り変える過程をたどります。',
      sentences: Object.freeze([
        p(
          'Languages move together with people, and they change again in the places where those people eventually arrive and settle.',
          '言語は人とともに移動し、その人々がやがてたどり着いた場所で変化します。',
        ),
        s(
          'A dialect is not a corrupted version of a standard, because it is a variety with a history of its own.',
          '方言は標準語の崩れた形ではありません。それ自身の歴史を持つ一つの変種だからです。',
        ),
        s(
          'The variety that becomes the standard usually did so for political and economic reasons rather than for linguistic ones.',
          '標準語になる変種がそうなったのは、たいてい言語的な理由ではなく政治的な理由によります。',
        ),
        p(
          'Migration is often described as a single decision, though it is normally a long sequence of smaller ones.',
          '移住はしばしば一つの決断として語られますが、普通はもっと小さな決断の長い連なりです。',
        ),
        s(
          'A family may send one member first, then a second, and only much later consider the move permanent.',
          'ある家族はまず一人を送り出し、次に二人目を送り、ずっと後になってようやくその移動を恒久的なものと考えます。',
        ),
        s(
          'Remittances, return visits, and unfinished plans can keep two distant places connected for several decades at a time.',
          '送金と里帰りと未完の計画が、遠く離れた二つの場所を数十年にわたってつなぎ続けます。',
        ),
        p(
          'Cities tend to grow at the outer edges, where new arrivals can still afford both to live and to work.',
          '都市は周縁で成長しがちです。そこならまだ新参者が暮らし、働く余裕があるからです。',
        ),
        s(
          'Urbanization concentrates commerce, and congestion soon follows the very routes that opportunity first took.',
          '都市化は商業を集中させ、やがて渋滞が、機会が最初に通ったまさにその経路をたどります。',
        ),
        s(
          'A suburban district that looks random is often an accurate record of who arrived in which decade.',
          '無計画に見える郊外の一区画は、しばしば、誰がどの十年に着いたのかの正確な記録です。',
        ),
        p(
          'Trade has always carried words along with the commodities that were being bought and sold across long distances.',
          '交易は常に、売り買いされていた商品とともに言葉を運んできました。',
        ),
        s(
          'A vendor who sells an imported textile gradually learns the name under which that cloth first travelled.',
          '輸入された織物を売る商人は、その布がどんな名で旅してきたかを次第に覚えます。',
        ),
        s(
          'Over time the borrowed word outlives the trade route that originally delivered it to the market.',
          '時が経つにつれ、借用された語は、それをもともと市場へ届けた交易路より長く生き残ります。',
        ),
        p(
          'Work shapes language quite as directly as geography does, and it often does so rather more quickly.',
          '仕事は地理と同じくらい直接に、そしてしばしばもっと速く、言語を形づくります。',
        ),
        s(
          'An entrepreneur, a contractor, and a factory worker in one city may share a vocation without sharing much vocabulary.',
          '同じ都市の起業家と請負業者と工場労働者は、職業を共有しながら語彙をあまり共有していないことがあります。',
        ),
        s(
          'Registers separate people inside a single language as firmly as national borders separate them outside it.',
          '言語内の位相は、国境が外側で人を隔てるのと同じくらい確かに、一つの言語の内側で人を隔てます。',
        ),
        p(
          'Bilingual communities are frequently described as being trapped somewhere awkwardly between two different worlds.',
          '二言語の共同体は、二つの異なる世界のはざまに捕らわれているとしばしば描かれます。',
        ),
        s(
          'That description flatters the observer more than it describes the speakers, who are usually managing both worlds competently.',
          'その描写は話し手を描いているというより観察者を持ち上げています。話し手はたいてい両方の世界を手際よくこなしているからです。',
        ),
        s(
          'What looks like confusion from outside is, seen from inside, ordinary and very often quite deliberate.',
          '外から混乱に見えるものは、内側から見れば当たり前のことであり、ごく多くの場合きわめて意図的です。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'stereotypes',
      title: 'Learning Without Stereotypes',
      titleJa: '決めつけずに学ぶ',
      summaryJa: '一般化がどこで壊れるかを問い、比較の基準が自文化に偏る癖を点検します。',
      sentences: Object.freeze([
        p(
          'A stereotype is a compressed observation that has quietly stopped being tested against any new evidence at all.',
          '固定観念とは、新しい証拠に照らして検証されることを静かにやめてしまった、圧縮された観察です。',
        ),
        s(
          'It usually begins with something a traveller genuinely saw and ends as a claim about millions of people.',
          'それはたいてい旅行者が実際に見た何かから始まり、何百万もの人についての主張として終わります。',
        ),
        s(
          'The error is not the original observation, because the error lies in the range over which it is applied.',
          '誤りは最初の観察ではありません。誤りは、それが適用される範囲の中にあるからです。',
        ),
        p(
          'Words such as always and every are among the clearest signals that a description has stopped being precise.',
          'always や every のような語は、記述が正確であることをやめた最も明確な合図です。',
        ),
        s(
          'Most customs vary by region, by generation, by economic class, and by the particular occasion that is involved.',
          'たいていの風習は、地域によって、世代によって、経済的な階層によって、そして関わる場面によって異なります。',
        ),
        s(
          'A visitor who has seen three families has seen three families, and has certainly not seen a whole nation.',
          '三つの家族に会った訪問者は三つの家族に会ったのであり、一つの国民に会ったのでは決してありません。',
        ),
        p(
          'Contrary cases are often dismissed as exceptions, which quietly protects the original claim from any evidence.',
          '反例はしばしば例外として退けられ、それが元の主張をあらゆる証拠から静かに守ってしまいます。',
        ),
        s(
          'A useful habit is to ask what would have to be true for the general claim itself to fail.',
          '役に立つ習慣は、その一般化が成り立たなくなるには何が真でなければならないかを問うことです。',
        ),
        s(
          'If no answer to that question is available at all, the statement is an attitude rather than a description.',
          'その問いに答えが用意できないなら、その言明は記述ではなく態度です。',
        ),
        p(
          'Comparison between cultures is unavoidable and, when it is careful enough, genuinely informative for both sides.',
          '文化どうしの比較は避けられず、注意深く行われるなら本当に有益です。',
        ),
        s(
          'The difficulty is that comparisons usually flatter the culture that happens to supply the standard of measurement.',
          '難しいのは、比較がたいてい、たまたま基準を提供した側の文化を持ち上げてしまうことです。',
        ),
        s(
          'Describing one practice as the natural one makes every other practice look like a deviation from it.',
          'ある慣行を自然なものだと述べることは、他のあらゆる慣行をそこからの逸脱に見せてしまいます。',
        ),
        p(
          'Reluctance to judge too quickly is not the same thing as indifference toward values.',
            '性急に判断することへのためらいは、価値に対する無関心とは別のものです。',
        ),
        s(
          'It is the recognition that a practice usually makes sense inside conditions the visitor has not yet seen.',
          'それは、ある慣行がたいてい、訪問者がまだ見ていない条件の内側では筋が通るという認識です。',
        ),
        s(
          'Once those conditions are understood, some practices still deserve criticism, and that criticism rests on something solid.',
          'その条件が理解されたあとでも批判に値する慣行はあり、そのときの批判は確かなものの上に立っています。',
        ),
        p(
          'The aim of studying other customs is not simply to collect a store of facts about distant people.',
          '他の風習を学ぶ目的は、遠くの人々についての事実を蓄えることではありません。',
        ),
        s(
          'It is to notice that one’s own habits are also local, also learned, and also open to question.',
          'それは、自分自身の習慣もまた土地に根ざし、学ばれたものであり、問い直しに開かれていると気づくことです。',
        ),
        s(
          'That discovery is uncomfortable for almost everyone, and the discomfort it produces is precisely the point.',
          'その発見はほとんど誰にとっても居心地が悪く、その居心地の悪さこそが要点です。',
        ),
      ]),
    }),
  ]),
})
