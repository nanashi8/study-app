// 語彙強化ロングリーディング（約1,000語・英検2級）の本文。
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

export const CIVIC_DECISIONS_BODY = Object.freeze({
  id: 'p_ext_1000_civic_decisions',
  sections: Object.freeze([
    Object.freeze({
      id: 'voice',
      title: 'Voice and Representation',
      titleJa: '声と代表',
      summaryJa: '誰の声が決定の場に届くのかを、負託・指名・反対意見の順に確かめます。',
      sentences: Object.freeze([
        p(
          'Every public decision begins with a simple question about whose voice actually reaches the room where the choice is made.',
          'どの公共の決定も、選択が行われる場に実際は誰の声が届いているのかという、単純な問いから始まります。',
        ),
        s(
          'A town may hold meetings and publish notices, yet still hear only the people who already know how the system works.',
          '町は会合を開き通知を出すことはできますが、それでも制度の仕組みをすでに知っている人の声しか聞こえないことがあります。',
        ),
        s(
          'Representation is therefore a practice rather than a title.',
          'したがって代表とは、肩書ではなく実践です。',
        ),
        p(
          'When people give a council a mandate, they lend power for a limited time.',
          '人々が議会に負託を与えるとき、彼らは限られた期間だけ権力を貸しています。',
        ),
        s(
          'The council may nominate officials, form a coalition, or ask a committee to study a difficult problem.',
          '議会は職員を指名し、連立を組み、あるいは難しい問題の調査を委員会に依頼することができます。',
        ),
        s(
          'None of these steps replaces the duty to explain the decision to the constituency that granted the power.',
          'こうした手続きのどれも、権力を与えた選挙区に決定を説明する義務の代わりにはなりません。',
        ),
        p(
          'Speaking is only half of representation, because listening decides whose problem becomes the next item.',
          '次に誰の問題が議題になるのかを決めるのは聞く側なので、話すことは代表の半分にすぎません。',
        ),
        s(
          'An oral report reaches people who cannot read long documents, and a printed record protects those who cannot attend.',
          '口頭の報告は長い文書を読めない人に届き、印刷された記録は出席できない人を守ります。',
        ),
        s(
          'Communities that use both methods hear a wider range of residents than those that rely on one channel.',
          '両方の方法を使う地域は、一つの経路に頼る地域よりも幅広い住民の声を聞きます。',
        ),
        p(
          'Dissent often shows that a plan has not yet been explained clearly enough to the people it affects.',
          '反対意見はしばしば、計画が影響を受ける人々にまだ十分はっきりと説明されていないことを示します。',
        ),
        s(
          'If a council treats every objection as an attack, it will soon receive silence instead of assent.',
          '議会があらゆる異議を攻撃として扱えば、やがて同意ではなく沈黙が返ってきます。',
        ),
        s(
          'The habit of answering questions in public turns an official body into a representative one.',
          '公の場で質問に答えるという習慣が、公式の組織を代表する組織へと変えます。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'rights',
      title: 'Law, Rights, and Responsibility',
      titleJa: '法・権利・責任',
      summaryJa: '管轄・推定無罪・抑止・先例をたどり、権利と義務が対で書かれる理由を読みます。',
      sentences: Object.freeze([
        p(
          'Rules become real only when everyone can find out their content and their limits.',
          '規則は、その中身と限界を誰もが調べられるときに、はじめて現実のものになります。',
        ),
        s(
          'A court has jurisdiction over certain places and certain kinds of dispute.',
          '裁判所は、特定の場所と特定の種類の争いに対して管轄権を持ちます。',
        ),
        s(
          'Outside those limits its orders carry no weight at all, however reasonable they may sound.',
          'その範囲の外では、どれほど筋が通って聞こえても、その命令にはまったく効力がありません。',
        ),
        s(
          'Citizens who understand the limits of a rule can also see where their own responsibility begins.',
          '規則の限界を理解している市民は、自分の責任がどこから始まるのかも見て取れます。',
        ),
        p(
          'A fair system treats a person who is accused of a crime as innocent until the evidence has been tested.',
          '公正な制度は、犯罪で告発された人を、証拠が検証されるまでは無罪の者として扱います。',
        ),
        s(
          'Prosecutors must show why the charge fits the facts, and the defense may challenge every provision the state relies on.',
          '検察はなぜその訴えが事実に合うのかを示さねばならず、弁護側は国が根拠とするあらゆる条項に異議を唱えられます。',
        ),
        s(
          'This slow procedure protects the innocent far more often than it protects the guilty.',
          'この時間のかかる手続きは、有罪の者を守るよりもはるかに多く、無実の者を守ります。',
        ),
        p(
          'Punishment is sometimes defended as a deterrent, but a penalty deters nobody if the rule itself is unknown.',
          '刑罰は抑止力として擁護されることがありますが、規則そのものが知られていなければ、罰は誰も抑止しません。',
        ),
        s(
          'A clear law with a small penalty often changes behavior more than a harsh law full of loopholes.',
          '罰の軽い明確な法律は、抜け穴だらけの厳しい法律よりも、行動をよく変えることがあります。',
        ),
        s(
          'Each decision also creates a precedent that later courts will read as guidance.',
          'どの判断も、のちの裁判所が指針として読む先例を作ります。',
        ),
        p(
          'Rights and duties appear together, because a right that entitles one person makes some action obligatory for another.',
          'ある人に権利を与えることは別の人に何らかの行為を義務づけるので、権利と義務は対で書かれます。',
        ),
        s(
          'When a legislature enacts a rule, the useful question is not only what it forbids but who must act.',
          '議会が規則を制定するとき、役に立つ問いは、何を禁じるのかだけでなく、誰が動かねばならないのかです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'information',
      title: 'Information Before an Argument',
      titleJa: '議論の前に必要な情報',
      summaryJa: '誤情報と偽情報を分け、媒体ごとの癖と出典確認の技能を確かめます。',
      sentences: Object.freeze([
        p(
          'An argument about a public choice is only as good as the information that both sides are able to check.',
          '公共の選択をめぐる議論は、双方が確かめられる情報の質を超えることはありません。',
        ),
        s(
          'Comparison becomes impossible when key figures are hidden, delayed, or expressed in language that no outsider understands.',
          '重要な数字が隠され、遅らされ、あるいは部外者に分からない言葉で書かれると、比較はできなくなります。',
        ),
        s(
          'Openness is therefore not a courtesy that officials may offer but a condition for honest debate.',
          'したがって公開とは、当局が差し出してもよい厚意ではなく、誠実な議論の条件です。',
        ),
        p(
          'Misinformation spreads when people repeat a claim that they believe to be true.',
          '誤情報は、人々が本当だと信じている主張を繰り返すときに広がります。',
        ),
        s(
          'Disinformation spreads when someone knows that the claim is false and shares it anyway.',
          '偽情報は、その主張が誤りだと知りながら誰かがそれでも広めるときに広がります。',
        ),
        s(
          'The two problems look alike on a screen, and yet they need completely different answers.',
          'この二つの問題は画面の上ではよく似ていますが、それでも必要な対処はまったく異なります。',
        ),
        s(
          'The first is treated by a better explanation, and the second by tracing who gains from the story.',
          '前者はよりよい説明によって、後者はその話で誰が得をするのかをたどることによって対処されます。',
        ),
        p(
          'Every medium shapes what it carries, because a broadcast compresses while a document accumulates.',
          '放送は圧縮し文書は積み重ねるので、どの媒体も運ぶ内容を形づくります。',
        ),
        s(
          'A reader who is literate in one medium may still be almost helpless in another.',
          'ある媒体を読みこなせる読者でも、別の媒体ではほとんど無力なことがあります。',
        ),
        s(
          'Schools that teach students to check a source, a date, and a credential give them a skill they will use for decades.',
          '出典と日付と資格を確かめるよう教える学校は、生徒に何十年も使える技能を与えます。',
        ),
        p(
          'Officials often answer through a spokesman, and the public then judges the office by that single voice.',
          '当局はしばしば報道官を通して答え、人々はその一つの声によってその役所を判断します。',
        ),
        s(
          'What matters most is that a citizen can reach the original figure without asking anyone for permission.',
          '最も大切なのは、市民が誰にも許可を求めずに元の数字にたどり着けることです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'resources',
      title: 'Budgets and Public Choices',
      titleJa: '予算と公共の選択',
      summaryJa: '予算を価値の表明として読み、競争・緊縮・分配が家計に届くまでを追います。',
      sentences: Object.freeze([
        p(
          'Every public promise spends something: the time, labor, land, or money that could have served another goal.',
          'どの公的な約束も、別の目的に使えたはずの時間や労働や土地や資金という、何かを費やします。',
        ),
        s(
          'A budget is the clearest statement that a government ever makes about what it truly values.',
          '予算は、政府が本当に何を重んじているかについて示す、最も明確な表明です。',
        ),
        s(
          'Reading it carefully is a civic skill rather than a narrow accounting one.',
          'それを丁寧に読むことは、狭い会計の技能というより市民の技能です。',
        ),
        p(
          'A feasibility study asks whether a plan can be built at all, and at what cost to the workforce that builds it.',
          '実現可能性の調査は、その計画がそもそも実行できるのか、そして作る労働力にどんな負担がかかるのかを問います。',
        ),
        s(
          'When a single corporation holds a monopoly over a service, the town loses the comparison an auction provides.',
          '一つの企業がある事業を独占すると、町は競売がもたらす比較を失います。',
        ),
        s(
          'Competition is valuable mainly because it produces reliable information about price.',
          '競争が価値を持つのは、主として価格についての信頼できる情報を生むからです。',
        ),
        p(
          'Households feel these decisions through rent, a mortgage, the price of food, and the currency in their pockets.',
          '家計はこうした決定を、家賃や住宅ローンや食料品の値段、そして財布の中の通貨を通して感じ取ります。',
        ),
        s(
          'A policy of austerity may balance the accounts while moving the cost onto families who cannot insure themselves.',
          '緊縮の政策は帳尻を合わせる一方で、その負担を自分では備えられない家庭へ移すことがあります。',
        ),
        s(
          'Growth matters, but distribution decides who is able to turn that growth into security.',
          '成長は重要ですが、その成長を安心に変えられるのが誰かを決めるのは分配です。',
        ),
        p(
          'Public money also carries a duty to explain, because a refund or a contract needs a reason residents can repeat.',
          '払い戻しにも契約にも住民が言い直せる理由が要るので、公金には説明する義務も伴います。',
        ),
        s(
          'Some towns specialize in a single enterprise and then struggle when that industry moves away.',
          '一つの事業に特化し、やがてその産業が去ったときに苦しむ町もあります。',
        ),
        s(
          'A budget that plans for the second outcome is not pessimistic; it is simply honest.',
          '後者の結末に備える予算は悲観的なのではなく、ただ正直なだけです。',
        ),
      ]),
    }),

    Object.freeze({
      id: 'revision',
      title: 'A Decision That Can Be Revised',
      titleJa: '見直せる決定',
      summaryJa: '見直しの期日と方法を持つ決定が、なぜ弱さではなく強さなのかを確かめます。',
      sentences: Object.freeze([
        p(
          'A good decision is firm enough to guide action and open enough to be revised when the evidence changes.',
          'よい決定は、行動を導けるほど確かで、証拠が変わったときに見直せるほど開かれています。',
        ),
        s(
          'Treating every revision as a failure is the surest way to keep a mistake in place for years.',
          'あらゆる見直しを失敗とみなすことは、誤りを何年もそのまま残す最も確実な方法です。',
        ),
        s(
          'Every rule should therefore carry a date and a stated method for review.',
          'したがってどの規則も、期日と、明記された見直しの方法を備えるべきです。',
        ),
        p(
          'Guidelines work best when they name the action, the decider, and the date of the next review.',
          '指針が最もよく働くのは、行為と、決める人と、次の見直しの期日を名指ししているときです。',
        ),
        s(
          'A norm that nobody is allowed to question quietly becomes a threat to the trust that created it.',
          '誰も問い直すことを許されない規範は、それを生んだ信頼にとって静かな脅威になります。',
        ),
        s(
          'Humility in public life is not a weakness, because it is a way of keeping options open.',
          '公的な場での謙虚さは選択肢を開いておく方法なので、弱さではありません。',
        ),
        p(
          'Globalization has made it much harder to separate local choices from distant ones.',
          'グローバル化は、地域の選択を遠くの選択から切り離すことをはるかに難しくしてきました。',
        ),
        s(
          'A rule about waste, wages, or travel now touches many people who never voted on it.',
          '廃棄物や賃金や移動についての規則は、いまやそれに投票したことのない多くの人に及びます。',
        ),
        s(
          'Humanitarian and environmental arguments therefore enter debates once thought purely local.',
          'そのため人道的・環境的な議論が、かつては純粋に地域的だと思われていた議論の中に入ってきます。',
        ),
        p(
          'Mainstream opinion moves, and a reservation recorded yesterday can become tomorrow’s ordinary standard.',
          '主流の意見は動き、昨日記録された留保が明日には当たり前の基準になることがあります。',
        ),
        s(
          'The hardest role in any community is the bystander who sees a problem and assumes that someone else will report it.',
          'どの地域社会でも最も厄介な役回りは、問題に気づきながら誰か他の人が知らせるだろうと考える傍観者です。',
        ),
        s(
          'A decision that can be revised is not a weak one, because it expects citizens to keep watching.',
          '見直せる決定は市民が見続けることを前提にしているので、弱い決定ではありません。',
        ),
      ]),
    }),
  ]),
})
