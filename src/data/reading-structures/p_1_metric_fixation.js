import { st } from './entry.js'

export default Object.freeze([
  st('[S Modern institutions] [V measure] [O almost everything {関係省略>everything| [S they] [V hope] [O {to:名詞| [V to improve]}]}] [M in complex systems with competing public purposes].', {
    chunks: [
      ['Modern institutions measure almost everything', '現代の機関は、ほとんどすべてのものを測っています（どんなものかは次へ）'],
      ['they hope to improve', '自分たちがよくしたいと望む（ものを）'],
      ['in complex systems', '複雑な仕組みの中で（どんな仕組みかは次へ）'],
      ['with competing public purposes', '公共の目的どうしがぶつかり合う（仕組みの中で）'],
    ],
    notes: {
      'they hope to improve': 'everything と they の間に関係詞 that が省略されています。improve の目的語が everything です。',
      'with competing public purposes': 'competing は「互いにぶつかり合う」。with 以下は complex systems を後ろから説明します。',
    },
  }),
  st('[S Schools] [V compare] [O test scores], [S hospitals] [V track] [O waiting times], [S universities] [V count] [O publications], [接 and] [S governments] [V publish] [O targets for employment, safety, and environmental quality].', {
    chunks: [
      ['Schools compare test scores,', '学校はテストの点数を比べ'],
      ['hospitals track waiting times,', '病院は待ち時間を記録し'],
      ['universities count publications,', '大学は発表した論文を数え'],
      ['and governments publish targets', 'そして政府は目標を公表します（何の目標かは次へ）'],
      ['for employment, safety, and environmental quality', '雇用や安全、環境の質についての（目標を）'],
    ],
    notes: {
      'Schools compare test scores,': '主語と動詞の組が四つ並び、測定の例を挙げています。',
    },
  }),
  st('[S Such indicators] [V give] [O1 institutions] [O2 a common language for {動名詞| [V judging] [O performance] [M across places and over time]}].', {
    chunks: [
      ['Such indicators give institutions', 'そうした指標は、機関に与えます（何をかは次へ）'],
      ['a common language', '共通の言葉を（何のためのかは次へ）'],
      ['for judging performance', '成果を判断するための（共通の言葉を）'],
      ['across places and over time', '場所をまたいで、また時間を通して'],
    ],
    notes: {
      'Such indicators give institutions': 'give ＋ 人 ＋ もの で「人にものを与える」。Such indicators は前の文の点数や待ち時間などを指します。',
    },
  }),
  st('[S They] [V can expose] [O failure {関係>failure| [S that] [V would] [M otherwise] [V remain] [C hidden] [M behind confident speeches or professional authority]}].', {
    chunks: [
      ['They can expose failure', '指標は失敗を明らかにできます（どんな失敗かは次へ）'],
      ['that would otherwise remain hidden', '指標がなければ隠れたままになるはずの（失敗を）'],
      ['behind confident speeches or professional authority', '自信たっぷりの演説や専門家の権威の陰に'],
    ],
    notes: {
      'They can expose failure': 'They は Such indicators を指します。',
      'that would otherwise remain hidden': 'otherwise は「そうでなければ（指標がなければ）」。would は、指標がない場合を想像して「〜だろう」と言っています。remain ＋ 過去分詞 で「〜されたままである」。',
    },
  }),
  st('[S The difficulty] [V begins] [M {副詞節:時| [接 when] [S a useful measure] [V becomes] [C the institution’s practical definition of success]}].', {
    chunks: [
      ['The difficulty begins', '問題は始まります（いつかは次へ）'],
      ['when a useful measure becomes', '役に立つ測定値が〜になるときに（何になるかは次へ）'],
      ['the institution’s practical definition of success', '機関にとっての事実上の成功の定義（に）'],
    ],
    notes: {
      'the institution’s practical definition of success': 'practical はここでは「事実上の」。数字がよいことが、そのまま成功だと見なされるようになることです。',
    },
  }),
  st('[S An indicator] [V is] [M necessarily] [C a simplified representation of a broader objective].', {
    chunks: [
      ['An indicator', '指標は'],
      ['is necessarily a simplified representation', '必ず、単純にして表したものです（何をかは次へ）'],
      ['of a broader objective', 'より広い目的を'],
    ],
    notes: {
      'is necessarily a simplified representation': 'necessarily は「必ず・どうしても」。',
    },
  }),
  st('[S A reading test] [V captures] [O some forms of comprehension], [M for example], [接 but] [M not] [O every capacity {関係>every capacity| [S that] [V makes] [O someone] [C a thoughtful reader]}].', {
    chunks: [
      ['A reading test captures some forms of comprehension,', '読解のテストは、理解力のいくつかの形をとらえます'],
      ['for example,', '例えば'],
      ['but not every capacity', 'しかし、すべての力をとらえるわけではありません（どんな力かは次へ）'],
      ['that makes someone a thoughtful reader', '人を思慮深い読み手にする（力を）'],
    ],
    notes: {
      'but not every capacity': 'but (it does) not (capture) every capacity の省略です。not … every は「すべてが〜というわけではない」という部分否定です。',
      'that makes someone a thoughtful reader': 'make ＋ O ＋ C で「OをCにする」。',
    },
  }),
  st('[M {副詞節:時| [接 Once] [S rewards or penalties] [V depend] [M heavily] [M on the score]}], [S people] [V have] [O an incentive {to:形容詞>an incentive| [V to optimize] [O the proxy] [M rather than {原形| [V pursue] [O the underlying mission]}]}].', {
    chunks: [
      ['Once rewards or penalties depend heavily', 'いったん報酬や罰が大きく左右されるようになると（何にかは次へ）'],
      ['on the score,', '点数に'],
      ['people have an incentive', '人々は動機を持ちます（何をする動機かは次へ）'],
      ['to optimize the proxy', '代わりの指標をよくしようとする（動機を）'],
      ['rather than pursue the underlying mission', '根本にある使命を追い求めるよりも'],
    ],
    notes: {
      'Once rewards or penalties depend heavily': 'once ＋ 主語 ＋ 動詞 で「いったん〜すると」。depend on 〜 で「〜によって決まる」。',
      'to optimize the proxy': 'proxy は、本当に測りたいものの「代わりに測る指標」です。to optimize は an incentive を後ろから説明します。',
      'rather than pursue the underlying mission': 'rather than の後ろに動詞の原形 pursue を置き、「〜するよりも」。',
    },
  }),
  st('[S This response] [V need not involve] [O obvious cheating].', {
    chunks: [
      ['This response', 'この反応は'],
      ['need not involve obvious cheating', 'はっきりした不正を伴うとは限りません'],
    ],
    notes: {
      'This response': 'This response は、前の文の「代わりの指標をよくしようとすること」を指します。',
      'need not involve obvious cheating': 'need not ＋ 動詞の原形 で「〜する必要はない・〜するとは限らない」。この need は助動詞です。',
    },
  }),
  st('[S A school] [V may devote] [O more time] [M to easily tested skills] [M {副詞節:対比| [接 while] [V neglecting] [O discussion, curiosity, or students {関係>students| [S whose improvement] [V is] [C unlikely {to:副詞(形容詞)| [V to change] [O its ranking]}]}]}].', {
    chunks: [
      ['A school may devote more time', '学校は、より多くの時間を充てるかもしれません（何にかは次へ）'],
      ['to easily tested skills', '試験しやすい技能に'],
      ['while neglecting discussion, curiosity,', '話し合いや好奇心をおろそかにする一方で'],
      ['or students', 'あるいは生徒を（どんな生徒かは次へ）'],
      ['whose improvement is unlikely to change its ranking', '伸びても学校の順位が変わりそうにない（生徒を）'],
    ],
    notes: {
      'A school may devote more time': 'devote A to B で「AをBに充てる」。',
      'whose improvement is unlikely to change its ranking': 'whose は students を受け、「その生徒の」。be unlikely to 〜 で「〜しそうにない」。its は A school を指します。',
    },
  }),
  st('[S A hospital] [V may transfer] [O difficult patients] [接 or] [V redefine] [O {疑問詞節| [M when] [S the waiting-time clock] [M officially] [V starts]}].', {
    chunks: [
      ['A hospital may transfer difficult patients', '病院は、難しい患者をほかへ移すかもしれません'],
      ['or redefine', 'あるいは定め直すかもしれません（何をかは次へ）'],
      ['when the waiting-time clock officially starts', '待ち時間を測る時計が公式にいつ動き出すかを'],
    ],
    notes: {
      'or redefine': 'redefine も may を共有しています（may redefine）。',
      'when the waiting-time clock officially starts': 'when 以下は「いつ〜するか」という名詞のまとまりで、redefine の目的語です。',
    },
  }),
  st('[S Each action] [V can improve] [O the reported number] [M without {動名詞| [V producing] [O an equivalent improvement in education or care]}].', {
    chunks: [
      ['Each action can improve the reported number', 'どの行動も、報告される数字をよくすることができます'],
      ['without producing an equivalent improvement', '同じだけの改善を生むことなく（何の改善かは次へ）'],
      ['in education or care', '教育や医療の'],
    ],
    notes: {
      'without producing an equivalent improvement': 'without 〜ing で「〜することなく」。数字だけがよくなり、中身はよくならないということです。',
    },
  }),
  st('[S Less visible distortions] [V arise] [M {副詞節:時| [接 when] [S workers] [V avoid] [O experiments {関係>experiments| [S whose uncertain outcomes] [V could damage] [O an otherwise strong record]}]}].', {
    chunks: [
      ['Less visible distortions arise', '目立ちにくいゆがみが生じます（いつかは次へ）'],
      ['when workers avoid experiments', '働く人たちが実験を避けるときに（どんな実験かは次へ）'],
      ['whose uncertain outcomes could damage', '不確かな結果が損なうかもしれない（実験を。何をかは次へ）'],
      ['an otherwise strong record', 'その実験がなければよいはずの記録を'],
    ],
    notes: {
      'whose uncertain outcomes could damage': 'whose は experiments を受け、「その実験の」。',
      'an otherwise strong record': 'otherwise strong は「そうでなければ（その実験がなければ）良好な」。',
    },
  }),
  st('[S A narrow target] [V may] [M consequently] [V punish] [O the very risk taking {過去分詞>the very risk taking| [V required] [M for genuine learning]}].', {
    chunks: [
      ['A narrow target may consequently punish', 'その結果、狭い目標は罰してしまうかもしれません（何をかは次へ）'],
      ['the very risk taking', 'まさにリスクを取ること（そのものを）'],
      ['required for genuine learning', '本当の学びに必要な（リスクを取ることを）'],
    ],
    notes: {
      'the very risk taking': 'the very 〜 は「まさにその〜」。risk taking は「リスクを取ること」。',
      'required for genuine learning': 'required は過去分詞で、the very risk taking を後ろから説明します。',
    },
  }),
  st('[S Critics] [M sometimes] [V conclude] [O {that節| [接 that] [S quantification itself] [V is] [C the problem]} and {that節| [接 that] [S experienced professionals] [V should] [M simply] [V be trusted] [C {to:補語| [V to exercise] [O judgment]}]}].', {
    chunks: [
      ['Critics sometimes conclude that', '批判する人々は、ときに〜と結論づけます（内容は次へ）'],
      ['quantification itself is the problem', '数量化そのものが問題であり'],
      ['and that experienced professionals', 'そして経験豊かな専門家は（内容は次へ）'],
      ['should simply be trusted', 'ただ信頼して任されるべきだ（何をかは次へ）'],
      ['to exercise judgment', '判断を下すことを（と）'],
    ],
    notes: {
      'Critics sometimes conclude that': 'Critics conclude は、筆者ではなく批判する人々の考えです。that 以下と and that 以下の二つが conclude の目的語です。',
      'should simply be trusted': 'trust ＋ 人 ＋ to 〜（人を信頼して〜を任せる）の受け身です。',
    },
  }),
  st('[S That position] [V underestimates] [O {疑問詞節| [M why] [S measurement] [V became] [C attractive] [M in the first place]}].', {
    chunks: [
      ['That position underestimates', 'その立場は、軽く見ています（何をかは次へ）'],
      ['why measurement became attractive', '測定がなぜ魅力的になったのかを'],
      ['in the first place', 'そもそも'],
    ],
    notes: {
      'That position underestimates': 'That position は前の文の批判する人々の結論を指します。ここから筆者の反論です。',
      'in the first place': 'in the first place は「そもそも」。',
    },
    rules: ['author-stance', 'wh-clause', 'reference-chain'],
  }),
  st('[S Judgment] [V can remain] [C informed and humane], [接 but] [S it] [V can] [M also] [V become] [C inconsistent, biased, and difficult {to:副詞(形容詞)| [M for outsiders] [V to challenge]}].', {
    chunks: [
      ['Judgment can remain informed and humane,', '判断は、よく知ったうえでの、人間味のあるものであり続けることができます'],
      ['but it can also become', 'しかし、〜になることもあります（どんなものかは次へ）'],
      ['inconsistent, biased,', '一貫しない、偏った'],
      ['and difficult for outsiders to challenge', 'そして外部の人が異議を唱えにくい（ものに）'],
    ],
    notes: {
      'Judgment can remain informed and humane,': 'informed は「十分な知識に基づいた」、humane は「人間味のある・思いやりのある」。',
      'and difficult for outsiders to challenge': 'difficult for A to 〜 で「Aが〜しにくい」。challenge はここでは「異議を唱える」。',
    },
  }),
  st('[M Without records], [S leaders] [V may celebrate] [O a program’s intentions] [M {副詞節:時| [接 while] [V ignoring] [O evidence {同格that>evidence| [接 that] [S it] [M repeatedly] [V fails] [O particular communities]}]}].', {
    chunks: [
      ['Without records,', '記録がなければ'],
      ['leaders may celebrate a program’s intentions', '指導者は、事業のねらいをたたえるかもしれません'],
      ['while ignoring evidence', '証拠を無視しながら（どんな証拠かは次へ）'],
      ['that it repeatedly fails particular communities', 'その事業が特定の地域の人々の役に繰り返し立っていないという（証拠を）'],
    ],
    notes: {
      'while ignoring evidence': 'while ignoring は while (they are) ignoring の形で、「〜しながら」。',
      'that it repeatedly fails particular communities': 'that 以下は evidence の中身を説明する同格の that節です。it は a program を指し、fail はここでは「（人々の）役に立たない」。',
    },
  }),
  st('[S The relevant choice] [V is] [C neither perfect numbers nor pure wisdom], [M {副詞節:理由| [接 because] [S neither] [V exists]}].', {
    chunks: [
      ['The relevant choice', '考えるべき選択肢は'],
      ['is neither perfect numbers nor pure wisdom,', '完全な数字でも純粋な知恵でもありません'],
      ['because neither exists', 'どちらも存在しないからです'],
    ],
    notes: {
      'is neither perfect numbers nor pure wisdom,': 'neither A nor B で「AでもBでもない」。',
      'because neither exists': 'この neither は「どちらも〜ない」という代名詞で、主語です。単数として扱うので exists です。',
    },
  }),
  st('[S Better systems] [V treat] [O indicators] [C as evidence within a process of judgment rather than as automatic verdicts].', {
    chunks: [
      ['Better systems treat indicators', 'よりよい仕組みは、指標を扱います（何としてかは次へ）'],
      ['as evidence within a process of judgment', '判断の過程の中の証拠として'],
      ['rather than as automatic verdicts', '自動的に下される判決としてではなく'],
    ],
    notes: {
      'Better systems treat indicators': 'treat A as B で「AをBとして扱う」。',
      'rather than as automatic verdicts': 'A rather than B で「BではなくA」。',
    },
  }),
  st('[S This] [V requires] [O several forms of institutional restraint].', {
    chunks: [
      ['This requires', 'このためには必要です（何がかは次へ）'],
      ['several forms of institutional restraint', '機関によるいくつかの形の自制が'],
    ],
    notes: {
      'This requires': 'This は、前の文の「指標を判断の中の証拠として扱うこと」を指します。',
      'several forms of institutional restraint': 'restraint は「（自分を）抑えること・自制」。このあと First・Second・Third で一つずつ説明されます。',
    },
  }),
  st('[M First], [S decision makers] [V should use] [O multiple measures {関係>multiple measures| [S that] [V illuminate] [O different parts of the mission]}].', {
    chunks: [
      ['First,', '第一に'],
      ['decision makers should use multiple measures', '決定する人々は、複数の測定値を使うべきです（どんな測定値かは次へ）'],
      ['that illuminate different parts of the mission', '使命のさまざまな部分を照らし出す（測定値を）'],
    ],
    notes: {
      'that illuminate different parts of the mission': 'illuminate は「照らす・明らかにする」。',
    },
  }),
  st('[S Graduation rates] [V may be considered] [M alongside student surveys, samples of actual work, and information about {what節| [O what] [S graduates] [V can do] [M later]}].', {
    chunks: [
      ['Graduation rates may be considered alongside', '卒業率は、〜と並べて検討されることがあります（何とかは次へ）'],
      ['student surveys, samples of actual work,', '生徒へのアンケートや、実際の作品の見本'],
      ['and information about what graduates can do later', 'そして卒業生があとでできることについての情報と'],
    ],
    notes: {
      'Graduation rates may be considered alongside': 'alongside は「〜と並べて・〜と一緒に」。',
      'and information about what graduates can do later': 'what は「〜すること」という関係代名詞で、do の目的語です。',
    },
  }),
  st('[S No collection of measures] [V eliminates] [O judgment], [接 but] [S plural indicators] [V make] [仮O it] [C harder] [真O {to:名詞| [M for one narrow target] [V to dominate] [O behavior]}].', {
    chunks: [
      ['No collection of measures eliminates judgment,', 'どんな測定値の集まりも、判断をなくしはしません'],
      ['but plural indicators make it harder', 'しかし、指標が複数あると、〜が難しくなります（何がかは次へ）'],
      ['for one narrow target to dominate behavior', '一つの狭い目標が行動を支配することが'],
    ],
    notes: {
      'No collection of measures eliminates judgment,': 'No ＋ 名詞 が主語で「どんな〜も…ない」。',
      'but plural indicators make it harder': 'make it ＋ 形容詞 ＋ for A to 〜 で「Aが〜するのを…にする」。it は形式目的語で、中身は for one narrow target to dominate behavior です。',
    },
  }),
  st('[M Second], [S metrics] [V should be interpreted] [M with qualitative evidence from the people {過去分詞>the people| [V represented] [M by them]}].', {
    chunks: [
      ['Second,', '第二に'],
      ['metrics should be interpreted', '指標は解釈されるべきです（どう解釈するかは次へ）'],
      ['with qualitative evidence', '質的な証拠と合わせて（だれからのかは次へ）'],
      ['from the people represented by them', 'その指標で表される人々からの（証拠と）'],
    ],
    notes: {
      'with qualitative evidence': 'qualitative evidence は、聞き取りのような数字でない「質的な証拠」です。',
      'from the people represented by them': 'represented by them は the people を後ろから説明し、them は metrics を指します。',
    },
  }),
  st('[S Missed medical appointments] [V could indicate] [O irresponsibility], [接 but] [S interviews] [V might reveal] [O {that節| [接 that] [S a new transport schedule] [V made] [O the clinic] [C inaccessible]}].', {
    chunks: [
      ['Missed medical appointments could indicate irresponsibility,', '守られなかった診療の予約は、無責任さを示しているのかもしれません'],
      ['but interviews might reveal that', 'しかし聞き取りによって、〜ことが分かるかもしれません（内容は次へ）'],
      ['a new transport schedule made the clinic inaccessible', '新しい交通の時刻表のせいで、診療所に行きにくくなった（ことが）'],
    ],
    notes: {
      'but interviews might reveal that': 'could と might は「〜かもしれない」。数字だけを見た読み方と、聞き取りで分かる事情を比べています。',
      'a new transport schedule made the clinic inaccessible': 'make ＋ O ＋ C で「OをCにする」。inaccessible は「行きにくい・利用しにくい」。',
    },
  }),
  st('[S Context] [V does not excuse] [O every poor result]; [S it] [V helps] [O institutions] [C {原形| [V distinguish] [O causes {関係>causes| [S that] [V demand] [O different responses]}]}].', {
    chunks: [
      ['Context does not excuse every poor result;', '背景事情があっても、すべての悪い結果が許されるわけではありません'],
      ['it helps institutions distinguish causes', 'それは、機関が原因を見分ける助けになります（どんな原因かは次へ）'],
      ['that demand different responses', '違う対応を必要とする（原因を）'],
    ],
    notes: {
      'Context does not excuse every poor result;': 'not … every は「すべてが〜というわけではない」という部分否定です。',
      'it helps institutions distinguish causes': 'help ＋ 人 ＋ 動詞の原形 で「人が〜するのを助ける」。it は Context を指します。',
    },
  }),
  st('[M Third], [S organizations] [V must examine] [O {疑問詞節| [M how] [S people] [V adapt] [M {副詞節:時| [接 once] [S a measure] [V carries] [O consequences]}]}].', {
    chunks: [
      ['Third,', '第三に'],
      ['organizations must examine', '組織は調べなければなりません（何をかは次へ）'],
      ['how people adapt', '人々がどう適応するかを（いつかは次へ）'],
      ['once a measure carries consequences', 'いったん測定値に処遇などの結果が結びつくと'],
    ],
    notes: {
      'once a measure carries consequences': 'carry consequences は「（報酬や処罰などの）結果を伴う」。',
    },
  }),
  st('[S A quiet diagnostic metric] [V can become] [C unreliable] [M {副詞節:時| [接 after] [S promotion, funding, or punishment] [V depends] [M on it]}].', {
    chunks: [
      ['A quiet diagnostic metric can become unreliable', '目立たずに使われていた診断用の指標も、信頼できなくなることがあります'],
      ['after promotion, funding, or punishment depends on it', '昇進や資金、処罰がそれで決まるようになると'],
    ],
    notes: {
      'A quiet diagnostic metric can become unreliable': 'quiet はここでは「（それまで）目立たずに使われていた」。',
      'after promotion, funding, or punishment depends on it': 'A, B, or C が主語のときは、近い punishment に合わせて depends になります。it は A quiet diagnostic metric を指します。',
    },
  }),
  st('[S Regular audits] [V should look] [M not only for false reports but also for neglected tasks, displaced risks, and groups {関係>groups| [S that] [V disappear] [M from the data]}].', {
    chunks: [
      ['Regular audits should look', '定期的な監査は、探すべきです（何をかは次へ）'],
      ['not only for false reports', 'うその報告だけでなく'],
      ['but also for neglected tasks, displaced risks,', 'おろそかにされた仕事や、よそへ移された危険'],
      ['and groups', 'そして集団も（どんな集団かは次へ）'],
      ['that disappear from the data', 'データから消えてしまう（集団も）'],
    ],
    notes: {
      'Regular audits should look': 'look for 〜 で「〜を探す」。',
      'not only for false reports': 'not only A but also B で「AだけでなくBも」。',
    },
  }),
  st('[S Evaluation systems] [V must be] [C adaptive] [M {副詞節:理由| [接 because] [S the behavior {関係省略>the behavior| [S they] [V observe]}] [V changes] [M in response to observation]}].', {
    chunks: [
      ['Evaluation systems must be adaptive', '評価の仕組みは、状況に合わせて変われなければなりません'],
      ['because the behavior they observe changes', '観察している行動そのものが変わるからです（どう変わるかは次へ）'],
      ['in response to observation', '観察されることに反応して'],
    ],
    notes: {
      'because the behavior they observe changes': 'the behavior と they の間に関係詞 that が省略され、the behavior they observe 全体が主語です。they は Evaluation systems を指します。',
    },
  }),
  st('[S Transparency] [V is] [C important], [接 yet] [S {動名詞| [V publishing] [O more data]}] [V is not] [C sufficient].', {
    chunks: [
      ['Transparency is important,', '透明性は大切です'],
      ['yet publishing more data is not sufficient', 'しかし、データを多く公開するだけでは十分ではありません'],
    ],
    notes: {
      'yet publishing more data is not sufficient': 'yet は「しかし」。publishing more data は「より多くのデータを公開すること」という動名詞のまとまりで、主語です。',
    },
  }),
  st('[S A dashboard] [V can appear] [C open] [M {副詞節:対比| [接 while] [V hiding] [O decisions about definitions, missing cases, statistical adjustments, and acceptable thresholds]}].', {
    chunks: [
      ['A dashboard can appear open', 'データをまとめた画面は、開かれているように見えることがあります'],
      ['while hiding decisions', '決定を隠している一方で（何についての決定かは次へ）'],
      ['about definitions, missing cases,', '定義や、抜け落ちた事例'],
      ['statistical adjustments, and acceptable thresholds', '統計上の調整、許される基準値についての（決定を）'],
    ],
    notes: {
      'A dashboard can appear open': 'dashboard は、データを一目で見られるようにまとめた画面です。appear ＋ 形容詞 で「〜に見える」。',
      'while hiding decisions': 'while hiding は while (it is) hiding の形で、「〜している一方で」。',
    },
  }),
  st('[S Meaningful transparency] [V explains] [O {疑問詞節| [M why] [S a measure] [V was chosen]}, {疑問詞節| [O what] [S it] [V omits]}, {疑問詞節| [M how] [S uncertainty] [V was handled]}, and {疑問詞節| [S who] [V can question] [O its use]}].', {
    chunks: [
      ['Meaningful transparency explains', '意味のある透明性は、説明します（何をかは次へ）'],
      ['why a measure was chosen,', 'なぜその測定値が選ばれたのか'],
      ['what it omits,', '何を含めていないのか'],
      ['how uncertainty was handled,', '不確かさをどう扱ったのか'],
      ['and who can question its use', 'そしてだれがその使い方に異議を唱えられるのかを'],
    ],
    notes: {
      'why a measure was chosen,': 'why・what・how・who で始まる四つのまとまりが、どれも explains の目的語です。',
    },
  }),
  st('[S That explanation] [V enables] [O public deliberation about goals] [M instead of {動名詞| [V limiting] [O debate] [M to technical compliance]}].', {
    chunks: [
      ['That explanation enables public deliberation about goals', 'その説明によって、目標について公に話し合えるようになります'],
      ['instead of limiting debate', '議論を限ってしまうのではなく（何にかは次へ）'],
      ['to technical compliance', '技術的な決まりを守っているかどうかに'],
    ],
    notes: {
      'That explanation enables public deliberation about goals': 'enable ＋ 名詞 で「〜を可能にする」。deliberation は「じっくり話し合うこと」。',
      'instead of limiting debate': 'instead of 〜ing で「〜するのではなく」。limit A to B で「AをBに限る」。',
    },
    rules: ['reference-chain', 'contrast-concession', 'ing-ed-role'],
  }),
  st('[S It] [M also] [V gives] [O1 independent researchers] [O2 a way {to:形容詞>a way| [V to test] [O {whether節| [接 whether] [S alternative definitions] [V would tell] [O a substantially different story]}]}].', {
    chunks: [
      ['It also gives independent researchers a way', 'それはまた、独立した研究者に方法を与えます（何の方法かは次へ）'],
      ['to test whether alternative definitions', '別の定義なら〜かどうかを確かめる（方法を。内容は次へ）'],
      ['would tell a substantially different story', '大きく違う実態を示す（かどうかを）'],
    ],
    notes: {
      'It also gives independent researchers a way': 'It は前の文の That explanation を指します。give ＋ 人 ＋ もの の形です。',
      'would tell a substantially different story': 'tell a different story で「違う実態を示す」。would は「（もし別の定義を使ったら）〜だろう」。',
    },
  }),
  st('[M There] [V is] [M also] [S a political question about {疑問詞節| [S who] [V bears] [O the burden of {動名詞| [V being measured]}]}].', {
    chunks: [
      ['There is also a political question', '政治的な問いもあります（何についてかは次へ）'],
      ['about who bears the burden', 'だれが負担を負うのかという（問いが）'],
      ['of being measured', '測られることの（負担を）'],
    ],
    notes: {
      'about who bears the burden': 'bear the burden で「負担を負う」。who 以下は前置詞 about の目的語です。',
      'of being measured': 'being measured は「測られること」という受け身の動名詞です。',
    },
  }),
  st('[S Frontline workers and vulnerable citizens] [M often] [V supply] [O detailed data], [M {副詞節:対比| [接 while] [S senior institutions] [V retain] [O discretion over {疑問詞節| [M how] [S the numbers] [V are interpreted]}]}].', {
    chunks: [
      ['Frontline workers and vulnerable citizens', '現場で働く人々や弱い立場の市民が'],
      ['often supply detailed data,', '詳しいデータを出すことが多いのです'],
      ['while senior institutions retain discretion', '一方で上の立場の機関は、決める権限を持ち続けます（何についてかは次へ）'],
      ['over how the numbers are interpreted', '数字がどう解釈されるかについての（権限を）'],
    ],
    notes: {
      'while senior institutions retain discretion': 'discretion は「自分の判断で決める権限」。while は「一方で」。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S measurement] [V increases] [O surveillance] [M below] [接 but] [S accountability] [V does not increase] [M above]}], [S the system] [V may weaken rather than strengthen] [O legitimacy].', {
    chunks: [
      ['If measurement increases surveillance below', 'もし測定によって下の立場への監視が強まり'],
      ['but accountability does not increase above,', 'しかし上の立場の説明責任が強まらないなら'],
      ['the system may weaken rather than strengthen legitimacy', 'その仕組みは、正当性を強めるどころか弱めるかもしれません', 'the system may weaken rather than strengthen legitimacy'],
    ],
    notes: {
      'If measurement increases surveillance below': 'below と above は、組織の中の「下の立場」と「上の立場」を指します。',
      'the system may weaken rather than strengthen legitimacy': 'weaken と strengthen の二つの動詞が legitimacy を共有しています。A rather than B で「BではなくA」。',
    },
  }),
  st('[S Those {関係>Those| [S who] [V design] [O indicators]}] [V should] [M therefore] [V be] [C answerable for their consequences, including the administrative labor {関係省略>the administrative labor| [S they] [V create]}].', {
    chunks: [
      ['Those who design indicators', '指標を作る人々は'],
      ['should therefore be answerable', 'したがって責任を負うべきです（何についてかは次へ）'],
      ['for their consequences,', 'その指標がもたらす結果について'],
      ['including the administrative labor they create', '指標が生み出す事務の手間も含めて'],
    ],
    notes: {
      'Those who design indicators': 'Those who 〜 で「〜する人々」。',
      'including the administrative labor they create': 'the administrative labor と they の間に関係詞 that が省略されています。their と they は indicators を指します。',
    },
  }),
  st('[S A mature culture of evaluation] [V recognizes] [O {that節| [接 that] [S important purposes] [V cannot] [M always] [V be] [M fully] [V quantified]}].', {
    chunks: [
      ['A mature culture of evaluation recognizes that', '成熟した評価の文化は、〜ことを認めています（内容は次へ）'],
      ['important purposes cannot always be fully quantified', '大切な目的をいつも完全に数で表せるわけではない（ことを）'],
    ],
    notes: {
      'important purposes cannot always be fully quantified': 'not always は「いつも〜とは限らない」という部分否定です。be quantified は「数量で表される」。',
    },
  }),
  st('[S Institutions] [V cannot] [M precisely] [V measure] [O trust, intellectual courage, dignity, and social repair], [接 yet] [S they] [V cannot] [M responsibly] [V ignore] [O these values].', {
    chunks: [
      ['Institutions cannot precisely measure', '機関は、正確には測れません（何をかは次へ）'],
      ['trust, intellectual courage, dignity, and social repair,', '信頼や知的な勇気、尊厳、社会の修復を'],
      ['yet they cannot responsibly ignore these values', 'しかし、責任ある態度でこうした価値を無視することもできません'],
    ],
    notes: {
      'yet they cannot responsibly ignore these values': 'yet は「しかし」。these values は前半の信頼や勇気などを指します。',
    },
  }),
  st('[S The inability {to:形容詞>The inability| [V to assign] [O a clean number]}] [V is not] [C evidence {同格that>evidence| [接 that] [S a value] [V is] [C unreal]}]; [S it] [V is] [C a warning {同格that>a warning| [接 that] [S judgment] [V must remain] [C visible and contestable]}].', {
    chunks: [
      ['The inability to assign a clean number', 'はっきりした数字をあてはめられないことは'],
      ['is not evidence', '証拠ではありません（何の証拠かは次へ）'],
      ['that a value is unreal;', 'その価値が実在しないという（証拠では）'],
      ['it is a warning', 'それは警告です（どんな警告かは次へ）'],
      ['that judgment must remain visible and contestable', '判断が見えるままで、異議を唱えられるものでなければならないという（警告です）'],
    ],
    notes: {
      'The inability to assign a clean number': 'to assign は The inability を後ろから説明して「あてはめられないこと」。',
      'that a value is unreal;': 'that 以下は evidence の中身を説明する同格の that節です。',
      'that judgment must remain visible and contestable': 'that 以下は a warning の中身です。contestable は「異議を唱えられる」。',
    },
  }),
  st('[S Institutions] [V can strengthen] [O trust] [M by {動名詞| [M publicly] [V stating] [O that limit]}] [M {副詞節:理由| [接 because] [S this] [V prevents] [O precision] [M from {動名詞| [V being mistaken] [M for certainty]}]}].', {
    chunks: [
      ['Institutions can strengthen trust', '機関は、信頼を強めることができます（どうやってかは次へ）'],
      ['by publicly stating that limit', 'その限界を公に述べることによって'],
      ['because this prevents precision', 'そうすることで、正確さが〜のを防げるからです（何をかは次へ）'],
      ['from being mistaken for certainty', '確かさと取り違えられる（のを）'],
    ],
    notes: {
      'by publicly stating that limit': 'that limit は前の文の「数字で表せない価値がある」という限界を指します。',
      'from being mistaken for certainty': 'prevent A from -ing で「Aが〜するのを防ぐ」。mistake A for B（AをBと間違える）の受け身です。',
    },
    rules: ['cause-result', 'reference-chain', 'ing-ed-role'],
  }),
  st('[S Metrics] [V are] [C most valuable] [M {副詞節:時| [接 when] [S they] [V create] [O questions] [M rather than {原形| [V close] [O them]}]}].', {
    chunks: [
      ['Metrics are most valuable', '指標が最も価値を持つのは（いつかは次へ）'],
      ['when they create questions', '問いを生み出すときです'],
      ['rather than close them', '問いを閉じてしまうときではなく'],
    ],
    notes: {
      'rather than close them': 'rather than の後ろに動詞の原形 close を置き、「〜するのではなく」。them は questions を指します。',
    },
  }),
  st('[S They] [V should direct] [O attention] [M toward patterns {関係>patterns| [S that] [V require] [O explanation]}], [V provide] [O feedback for revision], [接 and] [V reveal] [O {whether節| [接 whether] [S policies] [V serve] [O their stated mission]}].', {
    chunks: [
      ['They should direct attention', '指標は、注意を向けるべきです（どこへかは次へ）'],
      ['toward patterns that require explanation,', '説明が必要な傾向へ'],
      ['provide feedback for revision,', '見直しのための手がかりを与え'],
      ['and reveal whether policies serve their stated mission', 'そして政策が掲げた使命に役立っているかどうかを明らかにすべきです'],
    ],
    notes: {
      'They should direct attention': 'They は前の文の Metrics を指します。direct、provide、reveal の三つが should を共有しています。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S a measure] [V becomes] [C a substitute for that mission]}], [S apparent precision] [V can conceal] [O institutional drift].', {
    chunks: [
      ['When a measure becomes a substitute', '測定値が代わりになると（何の代わりかは次へ）'],
      ['for that mission,', 'その使命の'],
      ['apparent precision can conceal institutional drift', '見かけの正確さが、機関が本来の目的からずれていくことを隠してしまうことがあります'],
    ],
    notes: {
      'apparent precision can conceal institutional drift': 'institutional drift は、機関が少しずつ本来の目的からずれていくことです。that mission は、前の文の their stated mission を指します。',
    },
    rules: ['reference-chain', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[M {副詞節:時| [接 When] [S it] [V remains] [C one disciplined source of evidence among others]}], [S measurement] [V can support] [O both learning and democratic accountability] [M across changing circumstances and competing interpretations of public value] [M over time].', {
    chunks: [
      ['When it remains one disciplined source of evidence', '測定が、規律ある一つの証拠の源であり続けるなら'],
      ['among others,', 'ほかの証拠と並んで'],
      ['measurement can support', '測定は支えることができます（何をかは次へ）'],
      ['both learning and democratic accountability', '学びと民主的な説明責任の両方を'],
      ['across changing circumstances', '変わっていく状況や（続く）'],
      ['and competing interpretations of public value', '公共の価値をめぐって対立する解釈をまたいで'],
      ['over time', '時間を通して'],
    ],
    notes: {
      'When it remains one disciplined source of evidence': 'it は後ろの measurement を指します（代名詞が先に出ています）。',
      'both learning and democratic accountability': 'both A and B で「AとBの両方」。',
    },
    rules: ['reference-chain', 'parallel-shape', 'main-clause-skeleton'],
  }),
])
