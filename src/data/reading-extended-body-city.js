// 語彙強化ロングリーディング（約4,000語・英検1級）の本文。
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

export const GENERATIONAL_CITY_BODY = Object.freeze({
  id: 'p_ext_4000_generational_city',
  sections: Object.freeze([
    Object.freeze({
      id: 'time',
      title: 'Thinking Beyond the Next Year',
      titleJa: '翌年より先を考える',
      summaryJa: '費用と利益が現れる時期のずれを、割引・任期・世代という三つの物差しで読みます。',
      sentences: Object.freeze([
        p(
          'A city is above all a machine for moving costs and benefits across time, although it is very rarely described in quite those terms.',
          '都市は何よりも費用と利益を時間を越えて移す装置ですが、そのような言葉で説明されることはめったにありません。',
        ),
        s(
          'A road that is built this year will be repaired, widened, and eventually replaced by people who have not yet been born.',
          '今年造られた道路は、まだ生まれていない人々によって修理され、やがて造り替えられます。',
        ),
        s(
          'A pension that is promised this year will be paid out of the future wages of workers who are still at school today.',
          '今年約束された年金は、まだ学校にいる働き手の賃金から支払われます。',
        ),
        s(
          'Every serious argument about the future of a city is therefore in the end an argument about who pays for it and when.',
          'したがって都市の将来についての真剣な議論はすべて、誰がいつその費用を払うのかについての議論です。',
        ),
        p(
          'Economists usually handle this problem with a discount rate, a single number that states how much a future benefit is worth today.',
          '経済学者はふつうこの問題を割引率で扱います。それは将来の利益が今日どれほどの価値かを述べる一つの数値です。',
        ),
        s(
          'A high rate treats the distant future as almost worth nothing, while a low rate treats that same future as very nearly present indeed.',
          '高い率は遠い未来をほとんど無価値として扱い、低い率は同じ未来をほぼ現在として扱います。',
        ),
        s(
          'The choice of that single number therefore settles the answer long before any piece of evidence has actually been examined.',
          'したがってその数値の選択が、どの証拠も実際に調べられるずっと前に、答えを決めてしまいます。',
        ),
        s(
          'Honest analysis states the rate openly at the very start and then reports how far the conclusion moves when that rate is changed.',
          '誠実な分析は初めにその率を率直に述べ、率を変えたとき結論がどこまで動くかを示します。',
        ),
        p(
          'The terms that politicians serve are very much shorter than the objects that politics builds and then maintains.',
          '政治家が務める任期は、政治が造り維持する物よりはるかに短いのです。',
        ),
        s(
          'A mayor is elected for four years, while the bridge that the same mayor opens is expected to stand for a hundred.',
          '市長は四年の任期で選ばれますが、その市長が開通させる橋は百年立ち続けることが期待されます。',
        ),
        s(
          'That gap quietly rewards those decisions whose benefits appear at once and whose costs appear only after the next election has passed.',
          'この隔たりは、利益がすぐ現れ、費用が次の選挙のあとに現れる決定に、静かに報います。',
        ),
        s(
          'No individual has to behave badly at all for that pattern to repeat itself in one city after another for decades.',
          'この型が何十年も次々と都市で繰り返されるのに、誰かが悪くふるまう必要はありません。',
        ),
        p(
          'Households face exactly the same problem on a much smaller scale, and they generally solve it rather badly.',
          '家庭はまったく同じ問題をはるかに小さな規模で抱え、たいていかなり下手に解いています。',
        ),
        s(
          'People save less than they intend to save, buy insurance later than they should, and repair a thing only after it has already failed.',
          '人は貯めようと思うより少なく貯め、入るべきときより遅く保険に入り、壊れてから修理します。',
        ),
        s(
          'Public bodies repeat all of these habits quite faithfully, for the simple reason that they are made of the very same people.',
          '公的機関はこうした習慣をどれも忠実に繰り返します。同じ人々でできているという単純な理由からです。',
        ),
        s(
          'Recognizing the pattern is far more useful than blaming the particular individuals who happen to hold public office at the time.',
          'この型を認めるほうが、そのときたまたま在職している個人を責めるよりはるかに役に立ちます。',
        ),
        p(
          'A generation is a useful unit of planning precisely because it is longer than any single working career can ever be.',
          '世代が計画の単位として有用なのは、まさにそれがどんな一つの職業人生よりも長いからです。',
        ),
        s(
          'Decisions about land, water, pensions, and public buildings all outlast by many years the people who first make and approve them.',
          '土地と水と年金と公共建築についての決定は、みなそれを最初に下した人より何年も長く残ります。',
        ),
        s(
          'A city that plans in generations does not thereby become any wiser, but it does become considerably harder to surprise.',
          '世代単位で計画する都市がそれで賢くなるわけではありませんが、かなり驚かされにくくはなります。',
        ),
        s(
          'The nine sections that follow examine how that longer view changes ordinary decisions across nine different fields of public life.',
          '以下の九つの節では、その長い視野が公共生活の九つの分野で日常の決定をどう変えるのかを検討します。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'mind',
      title: 'Fear, Hope, and Attention',
      titleJa: '恐れ・希望・注意',
      summaryJa: '注意・恐れ・希望が公共の議論をどう歪め、どうすれば設計に生かせるかを扱います。',
      sentences: Object.freeze([
        p(
          'Public argument is shaped by the direction of public attention long before it is shaped by any piece of evidence.',
          '公の議論は、どんな証拠に形づくられるよりずっと前に、公衆の注意の向きによって形づくられます。',
        ),
        s(
          'A problem that nobody at all has noticed cannot be solved, however serious that problem may later turn out to be.',
          '誰も気づいていない問題はまったく解決できません。それがのちにどれほど深刻だと分かろうともです。',
        ),
        s(
          'A problem that everybody has noticed will be answered somehow, even in cases where it is comparatively small and easy to bear.',
          '誰もが気づいた問題は何らかの形で対処されます。比較的小さく耐えやすいときでさえそうです。',
        ),
        s(
          'The order in which problems arrive on a public agenda is therefore itself an important political outcome in its own right as well.',
          'したがって問題が公の議題に上る順序そのものが、重要な政治的結果なのです。',
        ),
        p(
          'Fear responds to vivid images far more readily than it responds to rates, which is why rare events dominate discussion.',
          '恐れは割合よりも生々しい映像にはるかに反応しやすく、それゆえまれな出来事が議論を占めます。',
        ),
        s(
          'A single dramatic accident will change more behavior in one month than a whole decade of quiet and careful figures.',
          '一件の劇的な事故は、十年分の静かで丁寧な数値より多くの行動を一か月で変えます。',
        ),
        s(
          'This is not simple stupidity, because a single vivid case really does carry information that a long table of numbers hides.',
          'これは単なる愚かさではありません。生々しい事例は、数表が隠す情報を実際に運ぶからです。',
        ),
        s(
          'The error appears only at the moment when that one vivid case is treated as though it were entirely typical.',
          '誤りが現れるのは、その生々しい事例がまったく典型であるかのように扱われる瞬間だけです。',
        ),
        p(
          'Hope is quite as powerful as fear is, and it distorts public planning in precisely the opposite direction from fear.',
          '希望は恐れとまったく同じくらい強く、公共の計画をちょうど反対の向きにゆがめます。',
        ),
        s(
          'Optimism about a promising new technology regularly produces schedules that nobody involved in it could ever keep.',
          '有望な新技術への楽観は、関わる誰にも決して守れない工程表を繰り返し生みます。',
        ),
        s(
          'That very same optimism also produces the sustained effort that occasionally makes a genuinely difficult project succeed.',
          'そのまったく同じ楽観が、本当に難しい事業をときに成功させる持続的な努力も生みます。',
        ),
        s(
          'Removing it entirely would leave a city perfectly accurate about the present and quite incapable of building anything at all.',
          'それを完全に取り除けば、都市は現在について完璧に正確でありながら、何も造れなくなるでしょう。',
        ),
        p(
          'Habits perform far more of the work of ordinary daily life than deliberate choices ever manage to perform.',
          '日々の生活の仕事は、意識的な選択が果たすよりはるかに多くを習慣が果たしています。',
        ),
        s(
          'A resident who has to think carefully about recycling every single week will in the end stop doing it completely.',
          '毎週きちんとリサイクルについて考えねばならない住民は、やがてすっかりやめてしまうでしょう。',
        ),
        s(
          'A system that makes the desired action the easiest available action will survive every change in public enthusiasm.',
          '望ましい行動を最も簡単な選択肢にする仕組みは、世論の熱意のあらゆる変化を生き延びます。',
        ),
        s(
          'Design therefore matters far more than persuasion for anything at all that has to continue for several decades.',
          'したがって数十年続けねばならないものについては、説得より設計のほうがはるかに重要です。',
        ),
        p(
          'Trust behaves much more like a stock that is slowly accumulated than like a flow that arrives each year.',
          '信頼は、毎年届く流れというより、ゆっくり積み上げられる蓄えのようにふるまいます。',
        ),
        s(
          'It builds up slowly through a long series of small promises that are kept and falls very quickly when one large promise fails.',
          'それは守られた小さな約束の長い連なりを通じてゆっくり積み上がり、大きな約束が一つ破られると急速に落ちます。',
        ),
        s(
          'A city with a deep reserve of public trust can attempt reforms that a more suspicious city simply cannot attempt at all.',
          '公共の信頼の蓄えが厚い都市は、疑い深い都市には到底試みられない改革を試みられます。',
        ),
        s(
          'Spending that reserve on a project that then fails is therefore much more expensive than the failed project itself.',
          'したがってその蓄えを、のちに失敗する事業に使うことは、その失敗した事業そのものよりずっと高くつきます。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'work',
      title: 'Work, Skill, and Organization',
      titleJa: '仕事・技能・組織',
      summaryJa: '技能の形成と組織の記憶を、移行の設計という観点から読みます。',
      sentences: Object.freeze([
        p(
          'Work is the place where most people actually meet the economy, and it is also where most public policy finally lands.',
          '仕事こそ大半の人が実際に経済に出会う場所であり、公共政策が最後に着地する場所でもあります。',
        ),
        s(
          'A rule about wages, working hours, or safety reaches a household only through the one particular job that one member of it does.',
          '賃金や労働時間や安全についての規則は、一人が就く特定の仕事を通じてしか家庭に届きません。',
        ),
        s(
          'Changing that rule therefore changes different households in ways that no average figure is able to show at all.',
          'したがってその規則を変えることは、どんな平均値にも示せない仕方で家庭ごとに異なる変化をもたらします。',
        ),
        s(
          'Any honest account of a labor reform therefore has to name who gains from it and who loses by it.',
          'それゆえ労働改革の誠実な説明は、誰が得をし誰が損をするのかを名指ししなければなりません。',
        ),
        p(
          'A skill is not at all the same thing as a certificate, because it is a set of judgments that are built by long repetition.',
          '技能は証書と同じものではありません。長い繰り返しによって築かれる一連の判断だからです。',
        ),
        s(
          'A worker who has performed a task for many years can see a problem that no printed manual has ever been able to describe.',
          '何年もその作業をこなしてきた働き手は、どの手引書にも記述できない問題を見て取れます。',
        ),
        s(
          'Training programs reproduce the manual fully and consistently, and they reproduce the judgment only with the greatest of difficulty.',
          '研修は手引書を確実に完全に再現しますが、判断はやっとのことでしか再現できません。',
        ),
        s(
          'That is precisely why an experienced workforce is a valuable asset that no line in any public budget ever records.',
          'だからこそ経験を積んだ働き手は、どの予算のどの項目にも記録されない貴重な資産なのです。',
        ),
        p(
          'Organizations remember what they have learned through their formal procedures rather than through the memories of their staff.',
          '組織は、学んだことを職員の記憶によってではなく、成文の手順によって記憶します。',
        ),
        s(
          'A form that asks an awkward and apparently useless question is very often the trace of an old and extremely expensive mistake.',
          '厄介で一見無用な質問をする書式は、しばしば古くきわめて高くついた失敗の痕跡です。',
        ),
        s(
          'Removing such questions in order to save a little time can quietly bring back the failure they were designed to prevent.',
          '時間を節約するためにそうした質問を消すと、それが防ぐはずだった失敗を静かに呼び戻します。',
        ),
        s(
          'Making a procedure simpler is valuable, but it should always begin by asking what each step was originally built for.',
          '手順を簡素にすることには価値がありますが、まず各段階がもともと何のために作られたのかを問うべきです。',
        ),
        p(
          'Automation removes particular tasks rather than whole occupations in almost every single case that has been carefully recorded.',
          '自動化は、丁寧に記録されたほとんどすべての場合で、職業全体ではなく特定の作業を取り除きます。',
        ),
        s(
          'A job that is made up of ten separate tasks may lose four of them and become a different job with exactly the same title.',
          '十の別々の作業からなる仕事は、そのうち四つを失い、同じ名称の別の仕事になることがあります。',
        ),
        s(
          'The person doing that job experiences the change as a demand for new skills rather than as the simple loss of employment.',
          'その仕事を担う人は、その変化を雇用の喪失ではなく新しい技能の要求として経験します。',
        ),
        s(
          'Whether that demand is truly answered depends entirely on training that begins well before the change has arrived.',
          'その要求が実際に満たされるかどうかは、変化が到達する前に始まる訓練にすべてかかっています。',
        ),
        p(
          'Transitions are where the whole cost of change concentrates, and they are almost always planned last of all.',
          '移行こそ変化の費用が丸ごと集まる場所ですが、ほとんど常に最後に計画されます。',
        ),
        s(
          'A city that funds retraining only after a large factory has finally closed has already lost several genuinely useful years.',
          '大きな工場が閉じてから再訓練に資金を出す都市は、すでに本当に有用な数年を失っています。',
        ),
        s(
          'The very same money, if it is used earlier, reaches workers while they still have savings, contacts, and a measure of confidence.',
          'まったく同じ資金も、早く使えば、働き手にまだ貯えと人脈といくらかの自信があるうちに届きます。',
        ),
        s(
          'Timing, rather than generosity, therefore decides how much a transition program of this kind actually achieves.',
          'したがって移行の施策が実際にどれだけ成し遂げるかを決めるのは、気前のよさではなく時期です。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'conditions',
      title: 'Conditions That Shape Outcomes',
      titleJa: '結果を形づくる条件',
      summaryJa: '結果の差を、意志の差ではなく条件の差として読み直す訓練をします。',
      sentences: Object.freeze([
        p(
          'Two people who make exactly the same decision on the very same day can end up in two very different places.',
          '同じ日にまったく同じ決定をした二人が、まったく違う場所に行き着くことがあります。',
        ),
        s(
          'The difference usually lies in the conditions that surround the decision rather than in the quality of the decision itself at all.',
          'その違いはたいてい、決定の質ではなく決定を取り巻く条件のほうにあります。',
        ),
        s(
          'A single missed payment is a small trouble for one household and the beginning of a long spiral for another.',
          '支払いの遅れは、ある家庭には小さな面倒であり、別の家庭には長い転落の始まりです。',
        ),
        s(
          'Any policy that ignores this asymmetry will end by describing the second of those households as being simply careless.',
          'この非対称を無視する政策は、結局のところ後者の家庭を単に不注意だと記述することになります。',
        ),
        p(
          'A margin is the distance between an ordinary setback and a setback that turns into something genuinely serious.',
          '余裕とは、ありふれた不調と、本当に深刻になる不調とのあいだの距離です。',
        ),
        s(
          'Savings, family support, and secure housing all widen that distance without ever appearing in any published official figure.',
          '貯蓄と家族の支えと安定した住まいは、公表されるどの数値にも現れずにその距離を広げます。',
        ),
        s(
          'Two households with identical incomes can therefore represent entirely different degrees of practical safety and personal freedom.',
          'したがって同額の収入を持つ二つの家庭が、まったく異なる実際的な安全の度合いを表すことがあります。',
        ),
        s(
          'Measuring income by itself hides most of what actually determines how a sudden shock is going to be absorbed.',
          '収入だけを測ることは、突然の衝撃がどう吸収されるかを実際に決めるものの大半を隠します。',
        ),
        p(
          'Time is the resource that inequality distributes most unevenly and that public policy notices least often.',
          '時間は、不平等が最も不均等に分配し、政策が最も気づきにくい資源です。',
        ),
        s(
          'A long journey to work, an unpredictable shift, and a second job all consume exactly the hours that any serious planning requires.',
          '長い通勤と予測できない勤務と二つ目の仕事は、どんな計画にも必要な時間をすべて奪います。',
        ),
        s(
          'Advice that quietly assumes a free evening at home is entirely useless to the people who most need that advice.',
          '空いた夜を暗に前提にした助言は、その助言を最も必要とする人にはまったく役立ちません。',
        ),
        s(
          'Public services designed around the schedules of their own staff exclude exactly those residents most of all in practice.',
          '職員自身の予定に合わせて設計された行政の窓口は、まさにそうした住民を最も確実に締め出します。',
        ),
        p(
          'Place multiplies every other condition that a household faces, whether in a favorable direction or in the opposite one.',
          '場所は、家庭が直面する他のあらゆる条件を、よい向きにも悪い向きにも増幅します。',
        ),
        s(
          'A child growing up ten kilometers away from a good school effectively lives in a different city from a nearer neighbor.',
          'よい学校から十キロ離れて育つ子どもは、事実上、より近い隣人とは別の都市に暮らしています。',
        ),
        s(
          'Transport policy is therefore education policy as well, although the two are almost never discussed in the same room.',
          'したがって交通政策は教育政策でもありますが、この二つが同じ場で論じられることはほとんどありません。',
        ),
        s(
          'Moving a single bus route can change more outcomes for children than an entirely new curriculum in the same district.',
          '一本のバス路線を動かすことは、同じ地区のまったく新しい教育課程より多くの結果を変えうるのです。',
        ),
        p(
          'None of this argument removes responsibility from the individual who finally makes one particular choice.',
          'この議論のどれも、最終的に特定の選択をする個人から責任を取り去るものではありません。',
        ),
        s(
          'What it changes is the list of things that a fair comparison between two individuals would have to hold constant.',
          'それが変えるのは、二人を公平に比べるときにそろえておくべき事柄の一覧です。',
        ),
        s(
          'A city that improves conditions is therefore not excusing anyone, because what it is doing is widening the margin.',
          'したがって条件を改善する都市は誰かを免責しているのではありません。しているのは余裕を広げることだからです。',
        ),
        s(
          'The practical question in every single case is which of those conditions can be changed at a cost that is worth paying.',
          'どの場合でも実際的な問いは、払う価値のある費用でどの条件を変えられるかということです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'markets',
      title: 'Markets and Household Security',
      titleJa: '市場と家計の安定',
      summaryJa: '価格・住宅・負債・保険が家計の安定に届くまでの経路をたどります。',
      sentences: Object.freeze([
        p(
          'A price is a message about scarcity, and it is at the very same time a bill that some particular household has to pay.',
          '価格は希少さについての伝言であり、同時にどこかの家庭が払わねばならない請求書でもあります。',
        ),
        s(
          'Raising a price reduces demand very efficiently indeed, and it reduces that demand most sharply among those with the least money.',
          '価格を上げれば需要はきわめて効率よく減りますが、最も鋭く減るのは金の最も少ない人々のあいだです。',
        ),
        s(
          'Both of those statements are entirely true, and any policy that admits only one of them will sooner or later be resisted.',
          'その二つの言明はどちらもまったく真実であり、一方しか認めない政策は抵抗を受けます。',
        ),
        s(
          'Pairing a price signal with a direct payment is usually the cheapest available way to keep both effects at once.',
          '価格の合図に直接の給付を組み合わせるのが、たいてい両方の効果を同時に保つ最も安い方法です。',
        ),
        p(
          'Housing is by a considerable margin the largest single expense in the yearly budget of most households.',
          '住居費は、たいていの家計でかなりの差をつけて最大の単一支出です。',
        ),
        s(
          'It is also the asset through which most families hold the wealth that they have managed to accumulate over a life.',
          'それはまた、多くの家族が一生かけて蓄えた財産を保持する資産でもあります。',
        ),
        s(
          'Those two roles pull housing policy in opposite directions, and they cannot both be fully satisfied at the same time.',
          'この二つの役割は住宅政策を反対の向きに引き、同時に両方を完全に満たすことはできません。',
        ),
        s(
          'Cheaper housing is good for new buyers and bad for the existing owners who voted for the rules that are now in force.',
          '住宅が安くなることは買い手にはよく、現行の規則に投票した既存の所有者には悪いことです。',
        ),
        p(
          'Debt moves consumption from the future into the present at a price that is normally stated in advance.',
          '負債は、前もって示された価格で、消費を未来から現在へ移します。',
        ),
        s(
          'Used for education or for the purchase of a house, it can raise the income of a whole life quite substantially.',
          '教育や住宅のために使えば、それは生涯の所得をかなり大きく引き上げうるのです。',
        ),
        s(
          'Used for ordinary daily expenses, it converts a temporary shortage into a permanent charge on every future month.',
          '日々の支出のために使えば、一時的な不足を、将来のあらゆる月への恒久的な負担に変えてしまいます。',
        ),
        s(
          'The very same instrument therefore builds security for one household and steadily removes it from the next.',
          'したがってまったく同じ道具が、ある家庭には安定を築き、別の家庭からは着実にそれを奪います。',
        ),
        p(
          'Insurance is the market instrument that addresses risk between the generations more directly than any other instrument.',
          '保険は、世代のあいだの危険に何よりも直接に対処する市場の道具です。',
        ),
        s(
          'It works by pooling events that are rare for any single individual and reasonably predictable for a whole population.',
          'それは、どの個人にもまれで、集団全体には十分予測できる出来事をまとめることで働きます。',
        ),
        s(
          'When a risk becomes common rather than rare, that pool stops functioning properly and prices rise very sharply indeed.',
          '危険がまれではなく当たり前になると、その集まりは働かなくなり、価格は実に急激に上がります。',
        ),
        s(
          'Flood cover in an exposed coastal district is the clearest current example of exactly that kind of breakdown.',
          '浸水しやすい地区の水害保険は、まさにその種の破綻の最も明確な現在の例です。',
        ),
        p(
          'Markets allocate resources very efficiently within the rules that a society has already chosen to set out for them.',
          '市場は、社会がすでに定めることを選んだ規則の内側で、資源をきわめて効率よく配分します。',
        ),
        s(
          'They cannot choose those rules for themselves, and they cannot notice any cost that nobody has yet put a price on.',
          '市場は自らその規則を選べませんし、誰もまだ値をつけていない費用に気づくこともできません。',
        ),
        s(
          'Treating a market outcome as a verdict about fairness therefore confuses a mechanism with a considered judgment.',
          'したがって市場の結果を公正さの判定として扱うことは、仕組みと熟慮された判断を取り違えることです。',
        ),
        s(
          'The useful question is always which particular set of rules produces outcomes that a city is prepared to live with.',
          '役に立つ問いは常に、都市が受け入れて暮らせる結果を生むのはどの規則の組み合わせかということです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'institutions',
      title: 'Institutions and Public Trust',
      titleJa: '制度と公共の信頼',
      summaryJa: '手続きの遅さの意味と、透明性・説明責任が信頼を支える仕組みを確かめます。',
      sentences: Object.freeze([
        p(
          'An institution is essentially a promise that keeps its force even after the people who first made it have left it behind.',
          '制度とは本質的に、それを作った人々が去ったあとも効力を持ち続ける約束です。',
        ),
        s(
          'Its value comes from being consistently predictable rather than from being clever in any one particular case.',
          'その価値は、個々の場面で賢いことからではなく、確かに予測できることから生まれます。',
        ),
        s(
          'A court that decided every single case purely on its own merits would be entirely fair and completely useless.',
          'すべての事件を純粋にその都度の是非だけで裁く裁判所は、完全に公正でありながらまったく役に立ちません。',
        ),
        s(
          'People arrange their whole lives around what they confidently expect an institution to do in the following year.',
          '人は、制度が翌年に何をするかという確かな予想を軸に、生活を組み立てます。',
        ),
        p(
          'Procedure is very often criticized as useless delay, and a part of that criticism is entirely justified.',
          '手続きはしばしば無用な遅れとして批判され、その批判の一部はまったく正当です。',
        ),
        s(
          'The remaining part of that criticism mistakes a safeguard for an obstacle that serves no useful purpose at all.',
          '批判の残りの部分は、安全装置を何の役にも立たない障害物と取り違えています。',
        ),
        s(
          'A step that appears useless in ninety-nine ordinary cases exists entirely because of the one rare case that remains.',
          '九十九のありふれた場合には無用に見える段階は、百番目の場合のためだけに存在します。',
        ),
        s(
          'Reform therefore requires knowing which particular kind of case each step was originally built to catch.',
          'したがって改革には、各段階がもともとどの場合を捉えるために作られたのかを知ることが要ります。',
        ),
        p(
          'Accountability means simply that someone can be identified by name at the point when a decision turns out to be wrong.',
          '説明責任とは要するに、決定が誤りだと分かったとき誰かを名指しで特定できるということです。',
        ),
        s(
          'Systems that spread responsibility thinly across many offices consistently produce decisions that nobody at all owns.',
          '責任を多くの部署へ薄く分散させる仕組みは、誰一人引き受けない決定を確実に生みます。',
        ),
        s(
          'Such systems are comfortable to work inside and almost impossible to correct from anywhere outside them.',
          'そうした仕組みは中で働くには居心地がよく、外のどこからも正すことはほぼ不可能です。',
        ),
        s(
          'Naming the responsible office well in advance is therefore a technical measure rather than any form of punishment.',
          'したがって責任ある部署を前もって明記することは、罰の一形態ではなく技術的な措置です。',
        ),
        p(
          'Transparency is frequently offered to the public as a complete and sufficient answer to every kind of distrust.',
          '透明性はしばしば、不信への完全で十分な答えとして人々に差し出されます。',
        ),
        s(
          'Publishing a long document that nobody is actually able to read produces the appearance of openness and none of its substance.',
          '誰にも読めない長い文書を公表することは、公開の外見だけを生み、その中身を何も生みません。',
        ),
        s(
          'Genuinely useful transparency states the decision, the reason for it, the alternatives, and the date of the next review.',
          '本当に役立つ透明性は、決定と、その理由と、選択肢と、次の見直しの期日を述べます。',
        ),
        s(
          'Four short sentences of that kind will usually do more for public trust than four hundred pages of technical detail.',
          'その種の短い四つの文のほうが、たいてい四百頁の詳細より公共の信頼に寄与します。',
        ),
        p(
          'Institutions decay very quietly, and that decay becomes visible only in the way they respond to a genuine surprise.',
          '制度はきわめて静かに衰え、その衰えは本物の驚きにどう反応するかにしか現れません。',
        ),
        s(
          'A body that carries out its routine work extremely well may still be quite incapable of admitting a single error.',
          '定型の仕事をきわめてうまくこなす組織でも、一つの誤りを認めることがまるでできないことがあります。',
        ),
        s(
          'The ability to reverse an earlier decision in public is the clearest available sign that an institution is still fully alive.',
          '以前の決定を公然と撤回できることは、制度がまだ生きている最も明確な証です。',
        ),
        s(
          'A city should test that ability deliberately in small matters rather than waiting for a crisis to test it for them.',
          '都市は危機がそれを試すのを待つのではなく、小さな事柄で意図的にその能力を試すべきです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'knowledge',
      title: 'Knowledge and Public Learning',
      titleJa: '知識と公共の学び',
      summaryJa: '学校・評価・公共の学びを、測れるものと測れないものの区別から読みます。',
      sentences: Object.freeze([
        p(
          'A city passes on a great deal more knowledge outside its schools than it will ever pass on inside them.',
          '都市は、学校の中で受け渡すよりはるかに多くの知識を、学校の外で受け渡しています。',
        ),
        s(
          'Libraries, places of work, families, and neighbors together carry most of what a resident of a city actually ends up learning.',
          '図書館と職場と家族と隣人が合わさって、住民が結局実際に学ぶものの大半を運びます。',
        ),
        s(
          'Schools matter so much because they are the one part of that larger system that policy can reach directly.',
          '学校がこれほど重要なのは、その大きな仕組みのうち政策が直接届く部分だからです。',
        ),
        s(
          'Treating schools as though they were the whole of that system produces reforms that fail for reasons nobody had predicted.',
          '学校が仕組みの全体であるかのように扱うと、誰も予測しなかった理由で失敗する改革が生まれます。',
        ),
        p(
          'Assessment shapes what is actually taught in a classroom far more powerfully than any curriculum document ever manages to do.',
          '評価は、どの教育課程の文書よりもはるかに強く、実際に教えられる内容を形づくります。',
        ),
        s(
          'Teachers respond rationally to the things that are measured, and they are entirely right to respond in that way.',
          '教師は測られるものに合理的に応じますし、そう応じるのはまったく正しいことです。',
        ),
        s(
          'A test that mainly rewards recall will consistently produce classrooms that are organized around recall and nothing else.',
          '主として暗記に報いる試験は、暗記を軸に組み立てられた教室を確実に生みます。',
        ),
        s(
          'Changing what is examined is therefore by far the fastest available way to change what is actually taught.',
          'したがって何が試験されるかを変えることが、実際に教えられる内容を変える群を抜いて速い方法です。',
        ),
        p(
          'Some of the most valuable outcomes of an education are also the very hardest to measure at all.',
          '教育の最も価値ある成果のいくつかは、そもそも測ることが最も難しいものでもあります。',
        ),
        s(
          'Patience, curiosity, and a willingness to revise a strong belief all resist almost every simple instrument of measurement.',
          '忍耐と好奇心と、固く抱いた信念を改める意志は、どんな単純な道具にも抵抗します。',
        ),
        s(
          'Measuring only what happens to be easy therefore produces a system that quietly discards almost everything else of value.',
          'したがってたまたま測りやすいものだけを測る仕組みは、それ以外のすべてを静かに捨てていきます。',
        ),
        s(
          'Stating a goal that is not measured in plain language is a weak defense, but it is a good deal better than nothing.',
          '測られない目標を文書に明記しておくのは弱い防御ですが、何もないよりはましです。',
        ),
        p(
          'Adults learn in quite a different way from children, and public systems rarely reflect that difference at all.',
          '大人は子どもとはかなり違ったやり方で学びますが、公的な仕組みがその違いを反映することはまれです。',
        ),
        s(
          'An adult brings experience, severely limited time, and an immediate practical reason for learning one particular thing.',
          '大人は経験と、ひどく限られた時間と、あることを学ぶ差し迫った実際的な理由を持ち込みます。',
        ),
        s(
          'Courses that were designed for eighteen-year-old students will waste all three of those considerable advantages.',
          '十八歳の学生向けに設計された課程は、その三つの大きな利点をすべて無駄にします。',
        ),
        s(
          'Short and practical formats that can be repeated reach far more adults than long degree programs ever do.',
          '繰り返せる短く実際的な形式のほうが、長い学位課程よりはるかに多くの大人に届きます。',
        ),
        p(
          'Public knowledge decays steadily unless someone is actually paid to maintain and correct it year after year.',
          '公共の知識は、誰かが実際に報酬を得て毎年維持しないかぎり、着実に朽ちていきます。',
        ),
        s(
          'Records are lost, formats become unreadable, and the people who once understood an old system quietly retire.',
          '記録は失われ、形式は読めなくなり、古い仕組みを理解していた人は静かに引退します。',
        ),
        s(
          'Maintaining an archive is plain work that is never rewarded, and it is usually the first budget line to be cut.',
          '文書館の維持は地味で報われない仕事であり、たいてい最初に削られる予算項目です。',
        ),
        s(
          'A city that cannot consult its own past will keep on repeating experiments that it has already run once before.',
          '自らの過去を参照できない都市は、すでに一度行った実験を繰り返し続けることになります。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'health',
      title: 'Care Across a Lifetime',
      titleJa: '生涯にわたるケア',
      summaryJa: '予防と治療、介護の担い手、終末期の選択を世代の視点から扱います。',
      sentences: Object.freeze([
        p(
          'Health is produced for the most part outside hospitals, and it is measured almost entirely inside them.',
          '健康はおおむね病院の外で生み出され、ほとんどすべて病院の中で測られます。',
        ),
        s(
          'Housing, work, diet, and the quality of the air together account for far more variation than any treatment ever does.',
          '住まいと仕事と食事と空気の質は、どんな治療よりもはるかに大きな差を説明します。',
        ),
        s(
          'A health budget that is used entirely on treatment is therefore being used at the very last stage of the process.',
          'したがって治療にすべてが使われる保健予算は、過程のまさに最後で使われていることになります。',
        ),
        s(
          'Moving part of that budget earlier is difficult because the benefits then appear in the accounts of some other office.',
          'その予算の一部を前倒しするのが難しいのは、利益が他の誰かの帳簿に現れるからです。',
        ),
        p(
          'Prevention is very cheap when it is counted in total and yet completely invisible in every individual case.',
          '予防は全体として数えればきわめて安く、個々の場面ではまったく目に見えません。',
        ),
        s(
          'Nobody is ever able to point to the particular illness that a clean water supply did not happen to cause.',
          '清潔な水道がたまたま引き起こさなかった特定の病気を、誰も指し示すことはできません。',
        ),
        s(
          'Treatment, by contrast, produces a grateful patient who can be photographed and publicly thanked by name.',
          '対照的に治療は、写真に撮られ公に感謝される、感謝する患者を生みます。',
        ),
        s(
          'That difference in visibility explains most of the lasting imbalance in the way that health money is used.',
          'この可視性の非対称が、保健予算の使われ方に根強く残る偏りの大半を説明します。',
        ),
        p(
          'Care for the very old and for the very young is largely invisible, and it hardly ever appears in any official set of figures.',
          '高齢者と幼い子どもへのケアは、大半が報われず、統計にはほとんど見えません。',
        ),
        s(
          'It is performed at home, mostly by a woman in the family, and it never once enters the national accounts.',
          'それは家庭で、多くは家族の中の女性によって行われ、国民経済計算に入ることはありません。',
        ),
        s(
          'A policy that shifts care from an institution to a family has merely moved a cost rather than removed it.',
          'ケアを施設から家庭へ移す政策は、費用を取り除いたのではなく移しただけです。',
        ),
        s(
          'Counting that work honestly, even when nobody is paid for it, changes which reform looks cheap and which looks expensive.',
          'その無償の仕事を誠実に数えることは、どの改革が安く見えどの改革が高く見えるかを変えます。',
        ),
        p(
          'Medical technology extends the length of a life far more consistently than it manages to extend independence and comfort.',
          '医療技術は、自立を延ばすよりもはるかに確実に人生の長さを延ばします。',
        ),
        s(
          'A treatment that adds five years of life may equally add five years of dependence on someone else.',
          '五年の命を加える治療は、同じだけ他人への依存の五年を加えることもあります。',
        ),
        s(
          'Families usually discover this only after the decision has been made and can no longer easily be reversed at all.',
          '家族がこれを知るのはたいてい、決定が下され、もはや容易には覆せなくなったあとです。',
        ),
        s(
          'Discussing the question well in advance is unpleasant, and it is the only point at which it can be discussed at all.',
          'その問いを前もって話し合うことは不快ですが、そもそも話し合える唯一の時点でもあります。',
        ),
        p(
          'Every health system in the world shares out care, and the honest ones state openly how they do it.',
          '世界のどの医療制度もケアを配分しており、誠実な制度はその方法を率直に述べます。',
        ),
        s(
          'Waiting lists, prices, distance, and rules about who qualifies are all different methods of sharing out care.',
          '待機名簿と価格と距離と誰が資格を持つかの規則は、いずれもケアを配分する方法です。',
        ),
        s(
          'Pretending that no such choice is being made merely hides the choice rather than actually avoiding it in any way.',
          'そのような選択はしていないふりをすることは、選択を実際に避けるのではなく隠すことです。',
        ),
        s(
          'A rule that is stated openly can be argued with, while a rule that is never stated can only be quietly endured.',
          '公然と述べられた規則には反論できますが、決して述べられない規則には耐えるほかありません。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'tools',
      title: 'Tools, Networks, and Limits',
      titleJa: '道具・ネットワーク・限界',
      summaryJa: '技術が能力と依存を同時に生む構造と、選択肢を残す設計を扱います。',
      sentences: Object.freeze([
        p(
          'Every new tool that a city adopts creates a new capability and a new dependence on it at exactly the same moment.',
          '都市が採用するどの道具も、まったく同じ瞬間に新しい能力と新しい依存を生み出します。',
        ),
        s(
          'A payment system that works perfectly for many years quietly becomes infrastructure that can no longer be turned off.',
          '何年も完璧に働く決済の仕組みは、静かに、もはや止められない基盤設備になります。',
        ),
        s(
          'The dependence remains quite invisible while the tool works and becomes total on the day that it finally fails.',
          'その依存は道具が働くあいだは見えないままで、ついに壊れた日に全面的なものになります。',
        ),
        s(
          'Planning carefully for that day is the whole difference between a small trouble and a complete stop.',
          'その日に向けて丁寧に備えることが、小さな面倒と完全な停止との違いのすべてです。',
        ),
        p(
          'Networks concentrate value at their center and concentrate most of the risk at their outer edges instead.',
          'ネットワークは価値を中心に集め、危険を外側の周縁に集めます。',
        ),
        s(
          'A service that absolutely everybody uses is highly efficient, and its failure then affects everybody at once.',
          '誰もが例外なく使う仕組みはきわめて効率的で、その故障は全員に同時に及びます。',
        ),
        s(
          'Keeping several options open is expensive in ordinary years and is the reason a city survives an unusual one.',
          '複数の選択肢を保つことは平年には高くつき、異常な年に都市が生き延びる理由になります。',
        ),
        s(
          'Deciding how much duplication to keep is in the end a judgment about how strange the future may turn out to be.',
          'どれだけの重複を保つかを決めることは、結局、未来がどれほど奇妙になりうるかの判断です。',
        ),
        p(
          'Data that is collected for one stated purpose is almost always used later for some quite different one.',
          'ある目的のために集められたデータは、ほとんど常にのちにまったく別の目的で使われます。',
        ),
        s(
          'A record that is kept in order to run a bus service can eventually answer a question about school attendance.',
          'バスの運行のために保たれた記録は、やがて学校の出席についての問いに答えうるのです。',
        ),
        s(
          'That very value is exactly why the limits have to be agreed before the data is ever gathered.',
          'そのまさに価値こそ、データが集められる前に制限を書き留めておかねばならない理由です。',
        ),
        s(
          'Rules that are agreed later are always shaped by the value of the material that has already been collected.',
          'あとから書かれる規則は、すでに集められたものの価値によって必ず形づくられます。',
        ),
        p(
          'Automation performs its work consistently, and for the same reason it fails in ways that are equally consistent.',
          '自動化は仕事を一貫してこなし、同じくらい一貫した仕方で失敗もします。',
        ),
        s(
          'A human error affects one case at a time, while a single error in the code affects every single case simultaneously.',
          '人の誤りは一度に一件に及びますが、算法の誤りは全件に同時に及びます。',
        ),
        s(
          'Scale therefore converts a small mistake into a very large one without any change at all in the mistake itself.',
          'したがって規模は、誤り自体はまったく変わらないまま、小さな誤りを非常に大きな誤りに変えます。',
        ),
        s(
          'Testing at full scale before any wide deployment is therefore not simple caution but a matter of ordinary arithmetic.',
          'したがって広く導入する前に実規模で試験することは、単なる慎重さではなく普通の算術です。',
        ),
        p(
          'The strongest argument in favor of adopting a new tool is very rarely the fact that the tool is new.',
          '新しい道具を推す最も強い論拠が、その道具が新しいという事実であることはごくまれです。',
        ),
        s(
          'It is that the current arrangement has one specific failure which this particular tool would in fact actually address.',
          'それは、現在の仕組みに、この道具が実際に対処する特定の欠陥が一つあるということです。',
        ),
        s(
          'Adopting a tool without naming that failure guarantees that nobody will be able to evaluate it properly later.',
          'その欠陥を名指しせずに道具を採用すれば、のちに誰もそれを評価できなくなります。',
        ),
        s(
          'Stating the expected improvement in advance is much the cheapest form of accountability that is available to a public body.',
          '期待される改善を前もって書き留めることは、利用できる最も安い説明責任の形です。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'future',
      title: 'A Future Open to Revision',
      titleJa: '見直しに開かれた未来',
      summaryJa: '取り消せる決定と取り消せない決定を分け、見直しを制度に組み込む設計を扱います。',
      sentences: Object.freeze([
        p(
          'No plan survives an entire generation completely intact, and the genuinely useful plans are designed from the start to be changed.',
          'どんな計画も一世代を丸ごと無傷では越えられず、本当に役立つ計画は初めから変えられるように設計されています。',
        ),
        s(
          'The distinction that really matters here lies between decisions that can be reversed and decisions that cannot be reversed.',
          '本当に重要な区別は、撤回できる決定と撤回できない決定のあいだにあります。',
        ),
        s(
          'A tax rate can be adjusted again next year, while a building that has once been destroyed can never be restored.',
          '税率は翌年また調整できますが、取り壊された建物は決して元に戻せません。',
        ),
        s(
          'Decisions that cannot be reversed therefore deserve a much higher standard of evidence than decisions that can.',
          'したがって取り消せない決定は、取り消せる決定よりずっと高い証拠の水準に値します。',
        ),
        p(
          'Uncertainty is really an argument for keeping options open rather than an argument for doing nothing at all.',
          '不確実性は、まったく何もしないことの論拠ではなく、選択肢を開いておくことの論拠です。',
        ),
        s(
          'Doing nothing is itself a decision, and it is frequently the hardest decision of all to reverse at a later date.',
          '何もしないこと自体が一つの決定であり、しばしば選べる中で最も取り消しにくい決定です。',
        ),
        s(
          'Land that has been built on cannot easily be cleared again, and a species that is once lost does not come back.',
          '建てられた土地を再び空けるのは容易ではなく、失われた種は戻ってきません。',
        ),
        s(
          'Delay is therefore only prudent in those particular cases where the delay itself genuinely preserves the choice for later.',
          'したがって遅らせることが賢明なのは、その遅れ自体が本当に選択を保つ場合だけです。',
        ),
        p(
          'A clearly stated review date is much the cheapest instrument for building revision into almost any decision.',
          '明記された見直しの期日は、決定に修正を組み込むための群を抜いて安い道具です。',
        ),
        s(
          'It converts a permanent commitment into a temporary one without weakening its force in any way at all today.',
          'それは、今日の効力をいささかも弱めずに、恒久的な約束を暫定的なものに変えます。',
        ),
        s(
          'Without such a date, a rule simply continues in force until someone spends real effort on getting it removed.',
          'そのような期日がなければ、規則は誰かが実際に労力をかけて取り除くまでただ続きます。',
        ),
        s(
          'That asymmetry explains why obsolete rules accumulate steadily in almost every long-lived public organization there is.',
          'この非対称が、長く続くどの組織にも時代遅れの規則が着実に積み上がる理由を説明します。',
        ),
        p(
          'Residents who will live in this city in fifty years cannot speak at any meeting that is arranged today.',
          '五十年後にここで暮らす住民は、今日開かれる会合で発言することができません。',
        ),
        s(
          'Any procedure that counts only the voices actually present in the room will systematically favor the people of the present.',
          'その部屋にいる声だけを数える手続きは、体系的に現在を優遇することになります。',
        ),
        s(
          'Some cities now appoint an officer whose one formal task is to state the long-term case at every public meeting.',
          '長期的な立場をどの会合でも述べることを正式な職務とする職員を、いまでは置く都市もあります。',
        ),
        s(
          'That device is far from perfect, and yet it is better than simply assuming that someone else will remember.',
          'その仕掛けは完全からはほど遠いのですが、誰かが覚えているだろうとただ想定するよりはましです。',
        ),
        p(
          'A city that expects to be wrong about something builds in quite a different way from one that expects to be right.',
          '何かについて自分は誤りうると考える都市は、正しいと考える都市とは違うやり方で造ります。',
        ),
        s(
          'It leaves physical space, keeps its records, states its assumptions, and schedules the exact moment of the next review.',
          'それは物理的な余地を残し、記録を保ち、前提を述べ、見直しの時を予定に組み込みます。',
        ),
        s(
          'None of that guarantees a good outcome, for the simple reason that no arrangement at all can ever promise one.',
          'そのどれもよい結果を保証しません。どんな仕組みもそれを約束できないという単純な理由からです。',
        ),
        s(
          'What it does guarantee is that a mistake will be found at a time when there is still time to put it right.',
          'それが保証するのは、まだ直せる時点で誤りが見つかるということです。',
        ),
      ]),
    }),
  ]),
})
